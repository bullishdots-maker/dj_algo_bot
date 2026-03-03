import React from 'react';
import { Card } from './ui/card';
import { Asset } from '../types/trading';

interface DepthLevel {
  price: number;
  size: number;
  total: number;
}

interface MarketDepthProps {
  activeAsset: Asset;
  currentPrice: number;
}

const MarketDepth = ({ activeAsset, currentPrice }: MarketDepthProps) => {
  const precision = activeAsset === 'XAG/USD' ? 3 : 2;
  const step = activeAsset === 'XAG/USD' ? 0.005 : activeAsset === 'BTC/USD' ? 10 : 1;

  // Generate simulated order book levels
  const generateLevels = (isAsk: boolean) => {
    const levels: DepthLevel[] = [];
    let runningTotal = 0;
    for (let i = 1; i <= 8; i++) {
      const price = isAsk ? currentPrice + (i * step) : currentPrice - (i * step);
      const size = Math.random() * (activeAsset === 'BTC/USD' ? 2 : 500);
      runningTotal += size;
      levels.push({ price, size, total: runningTotal });
    }
    return isAsk ? levels.reverse() : levels;
  };

  const asks = generateLevels(true);
  const bids = generateLevels(false);
  const maxTotal = Math.max(asks[0].total, bids[bids.length - 1].total);

  return (
    <Card className="p-4 bg-slate-950 border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Market Depth</h3>
        <span className="text-[10px] font-bold text-slate-500">STEP: {step}</span>
      </div>

      <div className="flex-1 flex flex-col text-[10px] font-mono">
        {/* Asks (Sells) */}
        <div className="space-y-0.5 mb-2">
          {asks.map((level, i) => (
            <div key={`ask-${i}`} className="relative h-5 flex items-center justify-between px-2 group cursor-pointer hover:bg-rose-500/5">
              <div 
                className="absolute right-0 top-0 h-full bg-rose-500/10 transition-all duration-300" 
                style={{ width: `${(level.total / maxTotal) * 100}%` }}
              />
              <span className="text-rose-400 z-10">{level.price.toFixed(precision)}</span>
              <span className="text-slate-400 z-10">{level.size.toFixed(activeAsset === 'BTC/USD' ? 3 : 1)}</span>
            </div>
          ))}
        </div>

        {/* Spread / Mid Price */}
        <div className="py-2 border-y border-slate-800 flex justify-between items-center px-2 bg-slate-900/30">
          <span className="text-xs font-bold text-white">{currentPrice.toFixed(precision)}</span>
          <span className="text-[9px] text-slate-500 uppercase">Spread: {(step * 0.2).toFixed(precision)}</span>
        </div>

        {/* Bids (Buys) */}
        <div className="space-y-0.5 mt-2">
          {bids.map((level, i) => (
            <div key={`bid-${i}`} className="relative h-5 flex items-center justify-between px-2 group cursor-pointer hover:bg-emerald-500/5">
              <div 
                className="absolute right-0 top-0 h-full bg-emerald-500/10 transition-all duration-300" 
                style={{ width: `${(level.total / maxTotal) * 100}%` }}
              />
              <span className="text-emerald-400 z-10">{level.price.toFixed(precision)}</span>
              <span className="text-slate-400 z-10">{level.size.toFixed(activeAsset === 'BTC/USD' ? 3 : 1)}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MarketDepth;