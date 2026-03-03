import { useState, useEffect, useCallback } from 'react';
import { Candle, Trade, MarketOrder } from '../types/trading';
import { format } from 'date-fns';

export const useTradingSim = (isActive: boolean) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0850);

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

  const processBotLogic = useCallback((newCandle: Candle) => {
    if (!isActive) return;

    // Price Action Strategy: Pin Bar Detection
    const bodySize = Math.abs(newCandle.open - newCandle.close);
    const totalSize = newCandle.high - newCandle.low;
    const upperWick = newCandle.high - Math.max(newCandle.open, newCandle.close);
    const lowerWick = Math.min(newCandle.open, newCandle.close) - newCandle.low;

    // Order Flow Strategy: Delta Imbalance
    const isBullishImbalance = newCandle.delta > 150;
    const isBearishImbalance = newCandle.delta < -150;

    if (lowerWick > bodySize * 2 && isBullishImbalance) {
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        time: newCandle.time,
        type: 'BUY',
        price: newCandle.close,
        reason: 'Bullish Pin Bar + Order Flow Delta Imbalance',
        status: 'OPEN',
      };
      setTrades(prev => [newTrade, ...prev]);
    } else if (upperWick > bodySize * 2 && isBearishImbalance) {
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        time: newCandle.time,
        type: 'SELL',
        price: newCandle.close,
        reason: 'Bearish Pin Bar + Order Flow Delta Imbalance',
        status: 'OPEN',
      };
      setTrades(prev => [newTrade, ...prev]);
    }
  }, [isActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      const priceChange = (Math.random() - 0.5) * 0.0002;
      const newPrice = currentPrice + priceChange;
      setCurrentPrice(newPrice);

      // Simulate a new market order
      const newOrder: MarketOrder = {
        id: Math.random().toString(36).substr(2, 9),
        time: format(new Date(), 'HH:mm:ss'),
        price: newPrice,
        size: Math.floor(Math.random() * 50) + 1,
        side: Math.random() > 0.5 ? 'BUY' : 'SELL',
        imbalance: Math.random() > 0.9,
      };
      setOrders(prev => [newOrder, ...prev].slice(0, 50));

      // Every 5 seconds, complete a candle
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

  return { candles, trades, orders, currentPrice };
};