import { useState, useEffect, useCallback, useRef } from 'react';
import { Candle, Trade, MarketOrder, AccountStats, Asset, Strategy } from '../types/trading';
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

const STORAGE_KEY = 'trading_sim_data_v3';

// Helper to calculate RSI
const calculateRSI = (candles: Candle[], period: number = 14) => {
  if (candles.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    const diff = candles[i].close - candles[i].open;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const rs = gains / losses;
  return 100 - (100 / (1 + rs));
};

export const useTradingSim = (isActive: boolean, activeAsset: Asset, strategy: Strategy = 'MEAN_REVERSION') => {
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

  const executeManualTrade = useCallback((type: 'BUY' | 'SELL', price: number) => {
    const newTrade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      asset: activeAsset,
      time: format(new Date(), 'HH:mm:ss'),
      type,
      price,
      reason: 'Manual Execution',
      status: 'OPEN',
      isManual: true,
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
          if (isActive) processBotLogic(activeAsset, newCandle, strategy);
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
  }, [activeAsset, isActive, strategy]);

  const processBotLogic = useCallback((asset: Asset, candle: Candle, strat: Strategy) => {
    const openTrades = tradesRef.current.filter(t => t.status === 'OPEN' && t.asset === asset && !t.isManual);
    if (openTrades.length > 0) {
      if (Math.random() > 0.6) closeTrade(openTrades[0].id, candle.close);
      return;
    }

    const bodySize = Math.abs(candle.open - candle.close);
    const isBullish = candle.close > candle.open;
    
    if (strat === 'MEAN_REVERSION') {
      const isOversold = (candle.rsi && candle.rsi < 30) || (!isBullish && bodySize > (candle.high - candle.low) * 0.7);
      const isOverbought = (candle.rsi && candle.rsi > 70) || (isBullish && bodySize > (candle.high - candle.low) * 0.7);
      if (isOversold) executeManualTrade('BUY', candle.close);
      else if (isOverbought) executeManualTrade('SELL', candle.close);
    } else {
      const isStrongTrend = bodySize > (candle.high - candle.low) * 0.5;
      if (isStrongTrend && isBullish) executeManualTrade('BUY', candle.close);
      else if (isStrongTrend && !isBullish) executeManualTrade('SELL', candle.close);
    }
  }, [closeTrade, executeManualTrade]);

  useEffect(() => {
    const openTradesPnl = trades.filter(t => t.status === 'OPEN').reduce((acc, t) => {
      const diff = currentPrice - t.price;
      return acc + ((t.type === 'BUY' ? diff : -diff) * ASSET_CONFIG[t.asset].lotSize);
    }, 0);
    const newEquity = account.balance + openTradesPnl;
    setAccount(prev => ({ ...prev, equity: newEquity }));

    // Update equity history every 10 seconds if price changes
    const now = format(new Date(), 'HH:mm:ss');
    setEquityHistory(prev => {
      if (prev.length > 0 && prev[prev.length - 1].time === now) return prev;
      return [...prev.slice(-49), { time: now, equity: newEquity }];
    });
  }, [currentPrice, trades]);

  return { candles, trades, orders, currentPrice, account, sentiment, equityHistory, executeManualTrade, closeTrade };
};