export type Asset = 'XAG/USD' | 'BTC/USD' | 'ETH/USD';
export type Strategy = 'MEAN_REVERSION' | 'TREND_FOLLOWING';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  delta: number;
  ma7?: number;
  rsi?: number;
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
  isManual?: boolean;
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