import React from 'react';
import { Card } from './ui/card';
import { Activity, Zap } from 'lucide-react';

const LiquidityHeatmap = () => {
  // Generate mock heatmap data
  const rows = 12;
  const cols = 24;
  const data = Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => Math.random())
  );

  return (
    <Card className="p-6 bg-slate-950 border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="text-amber-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Liquidity Heatmap</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Whale Watch</span>
        </div>
      </div>

      <div className="space-y-1">
        {data.map((row, i) => (
          <div key={i} className="flex gap-1 h-3">
            {row.map((val, j) => (
              <div 
                key={j} 
                className="flex-1 rounded-sm transition-all duration-500 hover:scale-110 cursor-crosshair"
                style={{ 
                  backgroundColor: val > 0.8 ? '#f59e0b' : 
                                   val > 0.6 ? '#d97706' : 
                                   val > 0.4 ? '#92400e' : 
                                   val > 0.2 ? '#451a03' : '#020617',
                  opacity: val > 0.1 ? 1 : 0.2
                }}
                title={`Liquidity: ${(val * 100).toFixed(1)}%`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={12} className="text-amber-400" />
            <span className="text-[10px] text-slate-500 uppercase font-bold">Buy Walls</span>
          </div>
          <div className="text-sm font-mono font-bold text-emerald-400">Significant @ 62.4k</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={12} className="text-rose-400" />
            <span className="text-[10px] text-slate-500 uppercase font-bold">Sell Walls</span>
          </div>
          <div className="text-sm font-mono font-bold text-rose-400">Heavy @ 65.1k</div>
        </div>
      </div>
    </Card>
  );
};

export default LiquidityHeatmap;