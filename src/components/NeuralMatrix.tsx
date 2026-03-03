import React from 'react';
import { Card } from './ui/card';
import { Brain, Activity, Zap, Target } from 'lucide-react';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface NeuralMatrixProps {
  weights: {
    rsi: number;
    trend: number;
    volume: number;
    sentiment: number;
  };
}

const NeuralMatrix = ({ weights }: NeuralMatrixProps) => {
  const totalConfidence = (weights.rsi + weights.trend + weights.volume + weights.sentiment) / 4 * 100;

  return (
    <Card className="p-6 bg-slate-950 border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Brain size={80} className="text-blue-500" />
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <Brain className="text-blue-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Neural Decision Matrix</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
              <span>RSI Weight</span>
              <span className="text-blue-400">{(weights.rsi * 100).toFixed(0)}%</span>
            </div>
            <Progress value={weights.rsi * 100} className="h-1 bg-slate-900" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
              <span>Trend Bias</span>
              <span className="text-emerald-400">{(weights.trend * 100).toFixed(0)}%</span>
            </div>
            <Progress value={weights.trend * 100} className="h-1 bg-slate-900" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
              <span>Vol Delta</span>
              <span className="text-amber-400">{(weights.volume * 100).toFixed(0)}%</span>
            </div>
            <Progress value={weights.volume * 100} className="h-1 bg-slate-900" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
              <span>Sentiment</span>
              <span className="text-purple-400">{(weights.sentiment * 100).toFixed(0)}%</span>
            </div>
            <Progress value={weights.sentiment * 100} className="h-1 bg-slate-900" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-slate-300 uppercase">Engine Confidence</span>
            </div>
            <span className={cn(
              "text-lg font-mono font-black",
              totalConfidence > 70 ? "text-emerald-500" : totalConfidence > 40 ? "text-blue-400" : "text-rose-400"
            )}>
              {totalConfidence.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
              style={{ width: `${totalConfidence}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NeuralMatrix;