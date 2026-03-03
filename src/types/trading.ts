export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  delta: number; // Order flow delta (Buy - Sell)
}

export interface Trade {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  price: number;
  reason: string;
  status: 'OPEN' | 'CLOSED';
  profit?: number;
}

export interface MarketOrder {
  id: string;
  time: string;
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
  imbalance: boolean;
}