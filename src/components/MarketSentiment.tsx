import React from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketSentimentProps {
  sentiment: number;
}

const MarketSentiment = ({ sentiment }: MarketSentimentProps) => {
  const isBullish = sentiment > 50;
  
  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          < Zap className="text-amber-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Market Sentiment</h3>
        </div>
        <div className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
          isBullish ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
        )}>
          {isBullish ? 'Bullish' : 'Bearish'}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-xs font-mono">
          <div className="flex items-center gap-1 text-rose-500">
            <TrendingDown size={14} />
            <span>{Math.round(100 - sentiment)}% SELL</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-500">
            <span>{Math.round(sentiment)}% BUY</span>
            <TrendingUp size={14} />
          </div>
        </div>
        
        <div className="relative h-2 w-full bg-slate-900 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-rose-500 transition-all duration-500" 
            style={{ width: '100%' }}
          />
          <div 
            className="absolute right-0 top-0 h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${sentiment}%` }}
          />
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/20 -translate-x-1/2" />
        </div>

        <p className="text-[10px] text-slate-500 leading-relaxed text-center">
          Based on the last 20 market orders from the live feed.
        </p>
      </div>
    </Card>
  );
};

export default MarketSentiment;