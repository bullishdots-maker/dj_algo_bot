import { useState, useEffect, useCallback, useRef } from 'react';
import { Candle, Trade, MarketOrder, AccountStats } from '../types/trading';
import { format } from 'date-fns';

export const useTradingSim = (isActive: boolean) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0850);
  const [account, setAccount] = useState<AccountStats>({
    balance: 10000,
    equity: 10000,
    totalProfit: 0,
    winRate: 0,
  });

  const tradesRef = useRef<Trade[]>([]);
  tradesRef.current = trades;

  // Initialize data
  useEffect(() => {
    const initialCandles: Candle[] = [];
    let basePrice = 1.0850;
    for (let i = 0; i < 20; i++) {
      const change = (Math.random() - 0.5) * 0.0010;
      const open = basePrice;
      const close = basePrice + change;
      initialCandles.push({
        time: format(new Date(Date.now() - (20 - i) * 60000), 'HH:mm'),
        open,
        high: Math.max(open, close) + Math.random() * 0.0005,
        low: Math.min(open, close) - Math.random() * 0.0005,
        close,
        volume: Math.floor(Math.random() * 1000),
        delta: Math.floor((Math.random() - 0.5) * 200),
      });
      basePrice = close;
    }
    setCandles(initialCandles);
    setCurrentPrice(basePrice);
  }, []);

  // Calculate Equity based on open trades
  useEffect(() => {
    const openTradesPnl = trades
      .filter(t => t.status === 'OPEN')
      .reduce((acc, t) => {
        const diff = currentPrice - t.price;
        const pnl = t.type === 'BUY' ? diff : -diff;
        return acc + (pnl * 100000); // Standard lot size simulation
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
        const finalPnl = pnl * 100000;
        
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

  const processBotLogic = useCallback((newCandle: Candle) => {
    if (!isActive) return;

    // Auto-close trades after some time for simulation
    const openTrades = tradesRef.current.filter(t => t.status === 'OPEN');
    if (openTrades.length > 0 && Math.random() > 0.7) {
      closeTrade(openTrades[0].id, newCandle.close);
    }

    const bodySize = Math.abs(newCandle.open - newCandle.close);
    const upperWick = newCandle.high - Math.max(newCandle.open, newCandle.close);
    const lowerWick = Math.min(newCandle.open, newCandle.close) - newCandle.low;
    const isBullishImbalance = newCandle.delta > 150;
    const isBearishImbalance = newCandle.delta < -150;

    if (lowerWick > bodySize * 2 && isBullishImbalance && openTrades.length < 3) {
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        time: newCandle.time,
        type: 'BUY',
        price: newCandle.close,
        reason: 'Bullish Pin Bar + Delta Imbalance',
        status: 'OPEN',
      };
      setTrades(prev => [newTrade, ...prev]);
    } else if (upperWick > bodySize * 2 && isBearishImbalance && openTrades.length < 3) {
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        time: newCandle.time,
        type: 'SELL',
        price: newCandle.close,
        reason: 'Bearish Pin Bar + Delta Imbalance',
        status: 'OPEN',
      };
      setTrades(prev => [newTrade, ...prev]);
    }
  }, [isActive, closeTrade]);

  useEffect(() => {
    const interval = setInterval(() => {
      const priceChange = (Math.random() - 0.5) * 0.0002;
      const newPrice = currentPrice + priceChange;
      setCurrentPrice(newPrice);

      const newOrder: MarketOrder = {
        id: Math.random().toString(36).substr(2, 9),
        time: format(new Date(), 'HH:mm:ss'),
        price: newPrice,
        size: Math.floor(Math.random() * 50) + 1,
        side: Math.random() > 0.5 ? 'BUY' : 'SELL',
        imbalance: Math.random() > 0.9,
      };
      setOrders(prev => [newOrder, ...prev].slice(0, 50));

      if (Date.now() % 5000 < 1000) {
        const lastCandle = candles[candles.length - 1];
        const newCandle: Candle = {
          time: format(new Date(), 'HH:mm'),
          open: lastCandle?.close || newPrice,
          high: newPrice + 0.0002,
          low: newPrice - 0.0002,
          close: newPrice,
          volume: Math.floor(Math.random() * 1000),
          delta: Math.floor((Math.random() - 0.5) * 400),
        };
        setCandles(prev => [...prev.slice(1), newCandle]);
        processBotLogic(newCandle);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPrice, candles, processBotLogic]);

  return { candles, trades, orders, currentPrice, account };
};