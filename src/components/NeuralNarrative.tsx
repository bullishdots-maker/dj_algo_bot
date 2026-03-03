import React from 'react';
import { Card } from './ui/card';
import { Sparkles, Brain, TrendingUp, AlertTriangle } from 'lucide-react';

const NeuralNarrative = () => {
  return (
    <Card className="p-6 bg-slate-950 border-slate-800 border-l-4 border-l-blue-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Sparkles size={60} className="text-blue-400" />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-blue-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Neural Narrative</h3>
      </div>

      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "The Alpha-Pro engine detects a significant divergence between RSI and price action on the 15m timeframe. Order flow suggests institutional accumulation near the $62,500 support zone. Volatility is compressing, indicating a potential breakout within the next 2-4 hours."
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Bullish Bias</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-amber-500" />
            <span className="text-[10px] font-bold text-amber-500 uppercase">High Volatility Risk</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NeuralNarrative;