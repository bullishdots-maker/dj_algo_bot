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

const STORAGE_KEY = 'trading_sim_data';

export const useTradingSim = (isActive: boolean, activeAsset: Asset) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [sentiment, setSentiment] = useState<number>(50); // 0-100 (Bearish to Bullish)
  const [account, setAccount] = useState<AccountStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.account;
    }
    return {
      balance: 10000,
      equity: 10000,
      totalProfit: 0,
      winRate: 0,
    };
  });

  const tradesRef = useRef<Trade[]>([]);
  
  // Load trades from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTrades(parsed.trades || []);
      tradesRef.current = parsed.trades || [];
    }
  }, []);

  // Save to storage whenever account or trades change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ account, trades }));
    tradesRef.current = trades;
  }, [account, trades]);

  // WebSocket Connection
  useEffect(() => {
    const symbol = SYMBOL_MAP[activeAsset];
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_1m/${symbol}@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.e === '24hrTicker') {
        const price = parseFloat(data.c);
        setCurrentPrice(price);

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
          setOrders(prev => {
            const newOrders = [newOrder, ...prev].slice(0, 50);
            // Calculate sentiment based on last 20 orders
            const buys = newOrders.slice(0, 20).filter(o => o.side === 'BUY').length;
            setSentiment((buys / 20) * 100);
            return newOrders;
          });
        }
      }

      if (data.e === 'kline') {
        const k = data.k;
        const newCandle: Candle = {
          time: format(new Date(k.t), 'HH:mm'),
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
          delta: (parseFloat(k.c) - parseFloat(k.o)) * 1000,
        };

        if (k.x) {
          setCandles(prev => {
            const updated = [...prev.slice(-29), newCandle];
            // Add simple 7-period Moving Average
            if (updated.length >= 7) {
              const last7 = updated.slice(-7);
              const avg = last7.reduce((acc, c) => acc + c.close, 0) / 7;
              (newCandle as any).ma7 = avg;
            }
            return updated;
          });
          if (isActive) processBotLogic(activeAsset, newCandle);
        } else {
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
    setTrades(prev => {
      const updated = prev.map(t => {
        if (t.id === tradeId && t.status === 'OPEN') {
          const diff = exitPrice - t.price;
          const pnl = t.type === 'BUY' ? diff : -diff;
          const finalPnl = pnl * ASSET_CONFIG[t.asset].lotSize;
          
          setAccount(acc => {
            const newBalance = acc.balance + finalPnl;
            const closedTrades = [...prev.filter(tr => tr.status === 'CLOSED' || tr.id === tradeId), { ...t, status: 'CLOSED', pnl: finalPnl }];
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
      });
      return updated;
    });
  }, []);

  const processBotLogic = useCallback((asset: Asset, candle: Candle) => {
    const openTrades = tradesRef.current.filter(t => t.status === 'OPEN' && t.asset === asset);
    
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

    if (openTrades.length > 0 && Math.random() > 0.5) {
      closeTrade(openTrades[0].id, candle.close);
    }
  }, [closeTrade]);

  return { 
    candles, 
    trades, 
    orders, 
    currentPrice, 
    account,
    sentiment
  };
};