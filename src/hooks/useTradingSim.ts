import { useState, useEffect, useCallback, useRef } from 'react';
import { Candle, Trade, MarketOrder, AccountStats, Asset } from '../types/trading';
import { format } from 'date-fns';

const ASSET_CONFIG: Record<Asset, { base: number; step: number; lotSize: number }> = {
  'EUR/USD': { base: 1.0850, step: 0.0002, lotSize: 100000 },
  'XAU/USD': { base: 2350.00, step: 0.50, lotSize: 100 },
  'XAG/USD': { base: 28.50, step: 0.05, lotSize: 5000 },
};

export const useTradingSim = (isActive: boolean, activeAsset: Asset) => {
  const [candlesMap, setCandlesMap] = useState<Record<Asset, Candle[]>>({
    'EUR/USD': [], 'XAU/USD': [], 'XAG/USD': []
  });
  const [prices, setPrices] = useState<Record<Asset, number>>({
    'EUR/USD': 1.0850, 'XAU/USD': 2350.00, 'XAG/USD': 28.50
  });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [account, setAccount] = useState<AccountStats>({
    balance: 10000,
    equity: 10000,
    totalProfit: 0,
    winRate: 0,
  });

  const tradesRef = useRef<Trade[]>([]);
  tradesRef.current = trades;

  // Initialize data for all assets
  useEffect(() => {
    const newCandlesMap = { ...candlesMap };
    Object.keys(ASSET_CONFIG).forEach((assetKey) => {
      const asset = assetKey as Asset;
      const config = ASSET_CONFIG[asset];
      const initialCandles: Candle[] = [];
      let basePrice = config.base;
      for (let i = 0; i < 20; i++) {
        const change = (Math.random() - 0.5) * (config.step * 5);
        const open = basePrice;
        const close = basePrice + change;
        initialCandles.push({
          time: format(new Date(Date.now() - (20 - i) * 60000), 'HH:mm'),
          open,
          high: Math.max(open, close) + Math.random() * config.step,
          low: Math.min(open, close) - Math.random() * config.step,
          close,
          volume: Math.floor(Math.random() * 1000),
          delta: Math.floor((Math.random() - 0.5) * 200),
        });
        basePrice = close;
      }
      newCandlesMap[asset] = initialCandles;
    });
    setCandlesMap(newCandlesMap);
  }, []);

  // Calculate Equity
  useEffect(() => {
    const openTradesPnl = trades
      .filter(t => t.status === 'OPEN')
      .reduce((acc, t) => {
        const currentAssetPrice = prices[t.asset];
        const diff = currentAssetPrice - t.price;
        const pnl = t.type === 'BUY' ? diff : -diff;
        return acc + (pnl * ASSET_CONFIG[t.asset].lotSize);
      }, 0);
    
    setAccount(prev => ({
      ...prev,
      equity: prev.balance + openTradesPnl
    }));
  }, [prices, trades]);

  const closeTrade = useCallback((tradeId: string, exitPrice: number) => {
    setTrades(prev => prev.map(t => {
      if (t.id === tradeId && t.status === 'OPEN') {
        const diff = exitPrice - t.price;
        const pnl = t.type === 'BUY' ? diff : -diff;
        const finalPnl = pnl * ASSET_CONFIG[t.asset].lotSize;
        
        setAccount(acc => {
          const newBalance = acc.balance + finalPnl;
          const closedTrades = [...prev.filter(tr => tr.status === 'CLOSED'), { ...t, status: 'CLOSED', pnl: finalPnl }];
          const wins = closedTrades.filter(tr => (tr.pnl || 0) > 0).length;
          
          return {
            ...acc,
            balance: newBalance,
            totalProfit: acc.totalProfit + finalPnl,
            winRate: (wins / closedTrades.length) * 100
          };
        });

        return { ...t, status: 'CLOSED', pnl: finalPnl, exitPrice };
      }
      return t;
    }));
  }, []);

  const processBotLogic = useCallback((asset: Asset, newCandle: Candle) => {
    if (!isActive) return;

    const openTrades = tradesRef.current.filter(t => t.status === 'OPEN' && t.asset === asset);
    if (openTrades.length > 0 && Math.random() > 0.7) {
      closeTrade(openTrades[0].id, newCandle.close);
    }

    const bodySize = Math.abs(newCandle.open - newCandle.close);
    const upperWick = newCandle.high - Math.max(newCandle.open, newCandle.close);
    const lowerWick = Math.min(newCandle.open, newCandle.close) - newCandle.low;
    const isBullishImbalance = newCandle.delta > 150;
    const isBearishImbalance = newCandle.delta < -150;

    if (lowerWick > bodySize * 1.5 && isBullishImbalance && openTrades.length < 2) {
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        asset,
        time: newCandle.time,
        type: 'BUY',
        price: newCandle.close,
        reason: `${asset} Bullish Pin Bar + Delta Imbalance`,
        status: 'OPEN',
      };
      setTrades(prev => [newTrade, ...prev]);
    } else if (upperWick > bodySize * 1.5 && isBearishImbalance && openTrades.length < 2) {
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        asset,
        time: newCandle.time,
        type: 'SELL',
        price: newCandle.close,
        reason: `${asset} Bearish Pin Bar + Delta Imbalance`,
        status: 'OPEN',
      };
      setTrades(prev => [newTrade, ...prev]);
    }
  }, [isActive, closeTrade]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPrices = { ...prices };
      const newOrders: MarketOrder[] = [];

      Object.keys(ASSET_CONFIG).forEach((assetKey) => {
        const asset = assetKey as Asset;
        const config = ASSET_CONFIG[asset];
        const priceChange = (Math.random() - 0.5) * config.step;
        newPrices[asset] = prices[asset] + priceChange;

        if (asset === activeAsset) {
          newOrders.push({
            id: Math.random().toString(36).substr(2, 9),
            asset,
            time: format(new Date(), 'HH:mm:ss'),
            price: newPrices[asset],
            size: Math.floor(Math.random() * 50) + 1,
            side: Math.random() > 0.5 ? 'BUY' : 'SELL',
            imbalance: Math.random() > 0.9,
          });
        }
      });

      setPrices(newPrices);
      if (newOrders.length > 0) {
        setOrders(prev => [...newOrders, ...prev].slice(0, 50));
      }

      if (Date.now() % 5000 < 1000) {
        const newCandlesMap = { ...candlesMap };
        Object.keys(ASSET_CONFIG).forEach((assetKey) => {
          const asset = assetKey as Asset;
          const lastCandle = candlesMap[asset][candlesMap[asset].length - 1];
          const newCandle: Candle = {
            time: format(new Date(), 'HH:mm'),
            open: lastCandle?.close || newPrices[asset],
            high: newPrices[asset] + ASSET_CONFIG[asset].step,
            low: newPrices[asset] - ASSET_CONFIG[asset].step,
            close: newPrices[asset],
            volume: Math.floor(Math.random() * 1000),
            delta: Math.floor((Math.random() - 0.5) * 400),
          };
          newCandlesMap[asset] = [...candlesMap[asset].slice(1), newCandle];
          processBotLogic(asset, newCandle);
        });
        setCandlesMap(newCandlesMap);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prices, candlesMap, processBotLogic, activeAsset]);

  return { 
    candles: candlesMap[activeAsset], 
    trades, 
    orders, 
    currentPrice: prices[activeAsset], 
    account 
  };
};