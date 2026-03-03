export type Asset = 'EUR/USD' | 'XAU/USD' | 'BTC/USD';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  delta: number;
}

export interface Trade {
  id: string;
  asset: Asset;
  time: string;
  type: 'BUY' | 'SELL';
  price: number;
  reason: string;
  status: 'OPEN' | 'CLOSED';
  pnl?: number;
  exitPrice?: number;
}

export interface MarketOrder {
  id: string;
  asset: Asset;
  time: string;
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
  imbalance: boolean;
}

export interface AccountStats {
  balance: number;
  equity: number;
  totalProfit: number;
  winRate: number;
}