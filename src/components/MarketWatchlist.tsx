import React from 'react';
import { Card } from './ui/card';
import { Asset } from '../types/trading';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WatchlistItem {
  symbol: Asset;
  price: number;
  change: number;
  status: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

interface MarketWatchlistProps {
  activeAsset: Asset;
  onSelect: (asset: Asset) => void;
  currentPrice: number;
}

const MarketWatchlist = ({ activeAsset, onSelect, currentPrice }: MarketWatchlistProps) => {
  // Simulated watchlist data
  const items: WatchlistItem[] = [
    { symbol: 'BTC/USD', price: currentPrice, change: 2.4, status: 'BULLISH' },
    { symbol: 'ETH/USD', price: currentPrice / 20, change: -1.2, status: 'BEARISH' },
    { symbol: 'XAU/USD', price: 2350.45, change: 0.5, status: 'BULLISH' },
    { symbol: 'XAG/USD', price: 28.32, change: -0.2, status: 'NEUTRAL' },
  ];

  return (
    <Card className="bg-slate-950 border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-blue-400" />
          <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Market Watchlist</h3>
        </div>
      </div>
      <div className="divide-y divide-slate-900">
        {items.map((item) => (
          <button
            key={item.symbol}
            onClick={() => onSelect(item.symbol)}
            className={cn(
              "w-full flex items-center justify-between p-4 transition-all hover:bg-slate-900/50 group",
              activeAsset === item.symbol ? "bg-blue-500/5 border-l-2 border-blue-500" : "border-l-2 border-transparent"
            )}
          >
            <div className="flex flex-col items-start">
              <span className={cn(
                "text-xs font-black tracking-tight uppercase transition-colors",
                activeAsset === item.symbol ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
              )}>
                {item.symbol}
              </span>
              <span className="text-[10px] text-slate-600 font-bold uppercase">Spot Market</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-slate-200">
                {item.symbol === activeAsset ? currentPrice.toFixed(2) : item.price.toFixed(2)}
              </div>
              <div className={cn(
                "text-[10px] font-bold flex items-center justify-end gap-1",
                item.change >= 0 ? "text-emerald-500" : "text-rose-500"
              )}>
                {item.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {item.change >= 0 ? '+' : ''}{item.change}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default MarketWatchlist;