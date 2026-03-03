import { useState, useEffect, useCallback, useRef } from 'react';
import { Candle, Trade, MarketOrder, AccountStats, Asset } from '../types/trading';
import { format } from 'date-fns';

const SYMBOL_MAP: Record<Asset, string> = {
  'EUR/USD': 'eurusdt',
  'XAU/USD': 'paxgusdt',
  'BTC/USD': 'btcusdt',
};

const ASSET_CONFIG: Record<Asset, { lotSize: number; precision: number }> = {
  'EUR/USD': { lotSize: 100000, precision: 5 },
  'XAU/USD': { lotSize: 100, precision: 2 },
  'BTC/USD': { lotSize: 1, precision: 2 },
};

export const useTradingSim = (isActive: boolean, activeAsset: Asset) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
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

  // WebSocket Connection
  useEffect(() => {
    const symbol = SYMBOL_MAP[activeAsset];
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_1m/${symbol}@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle Ticker (Live Price & Tape)
      if (data.e === '24hrTicker') {
        const price = parseFloat(data.c);
        setCurrentPrice(price);

        // Generate simulated tape from live price movements
        if (Math.random() > 0.7) {
          const newOrder: MarketOrder = {
            id: Math.random().toString(36).substr(2, 9),
            asset: activeAsset,
            time: format(new Date(), 'HH:mm:ss'),
            price: price,
            size: Math.floor(Math.random() * 10) + 1,
            side: Math.random() > 0.5 ? 'BUY' : 'SELL',
            imbalance: Math.random() > 0.9,
          };
          setOrders(prev => [newOrder, ...prev].slice(0, 50));
        }
      }

      // Handle Kline (Candlesticks & Bot Logic)
      if (data.e === 'kline') {
        const k = data.k;
        const newCandle: Candle = {
          time: format(new Date(k.t), 'HH:mm'),
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
          delta: (parseFloat(k.c) - parseFloat(k.o)) * 1000, // Simulated delta
        };

        if (k.x) { // Candle closed
          setCandles(prev => [...prev.slice(-29), newCandle]);
          if (isActive) processBotLogic(activeAsset, newCandle);
        } else {
          // Update last candle in real-time
          setCandles(prev => {
            const last = prev[prev.length - 1];
            if (last && last.time === newCandle.time) {
              return [...prev.slice(0, -1), newCandle];
            }
            return [...prev, newCandle].slice(-30);
          });
        }
      }
    };

    return () => ws.close();
  }, [activeAsset, isActive]);

  // Calculate Equity
  useEffect(() => {
    const openTradesPnl = trades
      .filter(t => t.status === 'OPEN')
      .reduce((acc, t) => {
        const diff = currentPrice - t.price;
        const pnl = t.type === 'BUY' ? diff : -diff;
        return acc + (pnl * ASSET_CONFIG[t.asset].lotSize);
      }, 0);
    
    setAccount(prev => ({
      ...prev,
      equity: prev.balance + openTradesPnl
    }));
  }, [currentPrice, trades]);

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

  const processBotLogic = useCallback((asset: Asset, candle: Candle) => {
    const openTrades = tradesRef.current.filter(t => t.status === 'OPEN' && t.asset === asset);
    
    // Simple Mean Reversion Logic for Live Data
    const bodySize = Math.abs(candle.open - candle.close);
    const isOversold = candle.close < candle.open && bodySize > (candle.high - candle.low) * 0.6;
    const isOverbought = candle.close > candle.open && bodySize > (candle.high - candle.low) * 0.6;

    if (isOversold && openTrades.length === 0) {
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        asset,
        time: candle.time,
        type: 'BUY',
        price: candle.close,
        reason: `Live ${asset} Oversold Signal`,
        status: 'OPEN',
      };
      setTrades(prev => [newTrade, ...prev]);
    } else if (isOverbought && openTrades.length === 0) {
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        asset,
        time: candle.time,
        type: 'SELL',
        price: candle.close,
        reason: `Live ${asset} Overbought Signal`,
        status: 'OPEN',
      };
      setTrades(prev => [newTrade, ...prev]);
    }

    // Auto-close after 3 candles
    if (openTrades.length > 0 && Math.random() > 0.5) {
      closeTrade(openTrades[0].id, candle.close);
    }
  }, [closeTrade]);

  return { 
    candles, 
    trades, 
    orders, 
    currentPrice, 
    account 
  };
};