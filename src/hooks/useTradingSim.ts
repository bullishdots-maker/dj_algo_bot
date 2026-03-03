import { useState, useEffect, useCallback, useRef } from 'react';
import { Candle, Trade, MarketOrder, AccountStats, Asset } from '../types/trading';
import { format } from 'date-fns';

const SYMBOL_MAP: Record<Asset, string> = {
  'XAG/USD': 'xagusdt',
  'BTC/USD': 'btcusdt',
  'ETH/USD': 'ethusdt',
};

const ASSET_CONFIG: Record<Asset, { lotSize: number; precision: number; pipValue: number }> = {
  'XAG/USD': { lotSize: 5000, precision: 3, pipValue: 0.01 },
  'BTC/USD': { lotSize: 1, precision: 2, pipValue: 1 },
  'ETH/USD': { lotSize: 10, precision: 2, pipValue: 1 },
};

const STORAGE_KEY = 'trading_sim_data_v5';

const calculateRSI = (candles: Candle[], period: number = 14) => {
  if (candles.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    const diff = candles[i].close - candles[i].open;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
};

export const useTradingSim = (isActive: boolean, activeAsset: Asset) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [sentiment, setSentiment] = useState<number>(50);
  const [equityHistory, setEquityHistory] = useState<{time: string, equity: number}[]>([]);
  const [account, setAccount] = useState<AccountStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.account;
    }
    return { balance: 10000, equity: 10000, totalProfit: 0, winRate: 0 };
  });

  const tradesRef = useRef<Trade[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTrades(parsed.trades || []);
      tradesRef.current = parsed.trades || [];
      setEquityHistory(parsed.equityHistory || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ account, trades, equityHistory }));
    tradesRef.current = trades;
  }, [account, trades, equityHistory]);

  const executeManualTrade = useCallback((type: 'BUY' | 'SELL', price: number, reason: string = 'Manual Execution') => {
    const newTrade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      asset: activeAsset,
      time: format(new Date(), 'HH:mm:ss'),
      type,
      price,
      reason,
      status: 'OPEN',
      isManual: reason === 'Manual Execution',
    };
    setTrades(prev => [newTrade, ...prev]);
  }, [activeAsset]);

  const closeTrade = useCallback((tradeId: string, exitPrice: number) => {
    setTrades(prev => {
      const updated = prev.map(t => {
        if (t.id === tradeId && t.status === 'OPEN') {
          const diff = exitPrice - t.price;
          const pnl = t.type === 'BUY' ? diff : -diff;
          const finalPnl = pnl * ASSET_CONFIG[t.asset].lotSize;
          
          setAccount(acc => {
            const newBalance = acc.balance + finalPnl;
            const closedTrades: Trade[] = [
              ...prev.filter(tr => tr.status === 'CLOSED' || tr.id === tradeId), 
              { ...t, status: 'CLOSED' as const, pnl: finalPnl }
            ];
            const wins = closedTrades.filter(tr => (tr.pnl || 0) > 0).length;
            return {
              ...acc,
              balance: newBalance,
              totalProfit: acc.totalProfit + finalPnl,
              winRate: (wins / closedTrades.length) * 100
            };
          });
          return { ...t, status: 'CLOSED' as const, pnl: finalPnl, exitPrice };
        }
        return t;
      });
      return updated;
    });
  }, []);

  useEffect(() => {
    const symbol = SYMBOL_MAP[activeAsset];
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_1m/${symbol}@ticker`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.e === '24hrTicker') {
        setCurrentPrice(parseFloat(data.c));
        if (Math.random() > 0.8) {
          const newOrder: MarketOrder = {
            id: Math.random().toString(36).substr(2, 9),
            asset: activeAsset,
            time: format(new Date(), 'HH:mm:ss'),
            price: parseFloat(data.c),
            size: Math.floor(Math.random() * 5) + 1,
            side: Math.random() > 0.5 ? 'BUY' : 'SELL',
            imbalance: Math.random() > 0.95,
          };
          setOrders(prev => [newOrder, ...prev].slice(0, 30));
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
            if (updated.length >= 7) {
              const last7 = updated.slice(-7);
              newCandle.ma7 = last7.reduce((acc, c) => acc + c.close, 0) / 7;
            }
            newCandle.rsi = calculateRSI(updated);
            return updated;
          });
          if (isActive) processAlphaProLogic(activeAsset, newCandle);
        } else {
          setCandles(prev => {
            const last = prev[prev.length - 1];
            if (last && last.time === newCandle.time) return [...prev.slice(0, -1), newCandle];
            return [...prev, newCandle].slice(-30);
          });
        }
      }
    };
    return () => ws.close();
  }, [activeAsset, isActive]);

  const processAlphaProLogic = useCallback((asset: Asset, candle: Candle) => {
    const openTrades = tradesRef.current.filter(t => t.status === 'OPEN' && t.asset === asset && !t.isManual);
    
    if (openTrades.length > 0) {
      const trade = openTrades[0];
      const pnl = trade.type === 'BUY' ? (candle.close - trade.price) : (trade.price - candle.close);
      const pips = pnl / ASSET_CONFIG[asset].pipValue;
      
      if (pips > 20 || pips < -10) { 
        closeTrade(trade.id, candle.close);
      }
      return;
    }

    const rsi = candle.rsi || 50;
    const ma7 = candle.ma7 || candle.close;
    const isBullishTrend = candle.close > ma7;

    if (rsi < 30 && isBullishTrend && candle.delta > 0) {
      executeManualTrade('BUY', candle.close, 'Alpha-Pro: Bullish Reversal');
    } else if (rsi > 70 && !isBullishTrend && candle.delta < 0) {
      executeManualTrade('SELL', candle.close, 'Alpha-Pro: Bearish Reversal');
    }
  }, [closeTrade, executeManualTrade]);

  useEffect(() => {
    const openTradesPnl = trades.filter(t => t.status === 'OPEN').reduce((acc, t) => {
      const diff = currentPrice - t.price;
      return acc + ((t.type === 'BUY' ? diff : -diff) * ASSET_CONFIG[t.asset].lotSize);
    }, 0);
    const newEquity = account.balance + openTradesPnl;
    setAccount(prev => ({ ...prev, equity: newEquity }));

    const now = format(new Date(), 'HH:mm:ss');
    setEquityHistory(prev => {
      if (prev.length > 0 && prev[prev.length - 1].time === now) return prev;
      return [...prev.slice(-49), { time: now, equity: newEquity }];
    });
  }, [currentPrice, trades]);

  return { candles, trades, orders, currentPrice, account, sentiment, equityHistory, executeManualTrade, closeTrade };
};