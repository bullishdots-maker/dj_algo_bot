import React from 'react';
import { Card } from './ui/card';
import { Candle } from '../types/trading';
import { Gauge, ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalAnalysisProps {
  candles: Candle[];
}

const TechnicalAnalysis = ({ candles }: TechnicalAnalysisProps) => {
  const lastCandle = candles[candles.length - 1];
  if (!lastCandle) return null;

  const rsi = lastCandle.rsi || 50;
  const ma7 = lastCandle.ma7 || lastCandle.close;
  const price = lastCandle.close;

  const getSignal = () => {
    let score = 0;
    if (rsi < 30) score += 2;
    else if (rsi < 45) score += 1;
    else if (rsi > 70) score -= 2;
    else if (rsi > 55) score -= 1;

    if (price > ma7) score += 1;
    else score -= 1;

    if (score >= 2) return { label: 'Strong Buy', color: 'text-emerald-500', icon: ArrowUpCircle };
    if (score === 1) return { label: 'Buy', color: 'text-emerald-400', icon: ArrowUpCircle };
    if (score <= -2) return { label: 'Strong Sell', color: 'text-rose-500', icon: ArrowDownCircle };
    if (score === -1) return { label: 'Sell', color: 'text-rose-400', icon: ArrowDownCircle };
    return { label: 'Neutral', color: 'text-slate-400', icon: MinusCircle };
  };

  const signal = getSignal();
  const SignalIcon = signal.icon;

  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Gauge className="text-indigo-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Technical Summary</h3>
      </div>

      <div className="flex flex-col items-center justify-center py-4 space-y-4">
        <div className={cn("flex flex-col items-center gap-2", signal.color)}>
          <SignalIcon size={48} strokeWidth={1.5} />
          <span className="text-xl font-bold uppercase tracking-tighter">{signal.label}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-900">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">RSI (14)</span>
            <span className={cn(
              "text-sm font-mono font-bold",
              rsi > 70 ? "text-rose-400" : rsi < 30 ? "text-emerald-400" : "text-slate-300"
            )}>{rsi.toFixed(1)}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">MA (7)</span>
            <span className={cn(
              "text-sm font-mono font-bold",
              price > ma7 ? "text-emerald-400" : "text-rose-400"
            )}>{price > ma7 ? 'Above' : 'Below'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TechnicalAnalysis;