import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, BarChart3, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'sonner';

const BacktestPanel = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runBacktest = () => {
    setIsSimulating(true);
    setResults([]);
    
    // Simulate backtest calculation delay
    setTimeout(() => {
      const mockData = [];
      let equity = 10000;
      for (let i = 0; i < 50; i++) {
        equity += (Math.random() - 0.45) * 500;
        mockData.push({ day: i, equity });
      }
      setResults(mockData);
      setIsSimulating(false);
      toast.success("Backtest completed: 14.2% Return over 30 days");
    }, 2000);
  };

  return (
    <Card className="p-6 bg-slate-950 border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-amber-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Strategy Backtester</h3>
        </div>
        <Button 
          size="sm" 
          onClick={runBacktest} 
          disabled={isSimulating}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-8 text-[10px] uppercase"
        >
          {isSimulating ? "Simulating..." : "Run Simulation"}
        </Button>
      </div>

      {results.length > 0 ? (
        <div className="space-y-6">
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="#f59e0b" 
                  fillOpacity={1} 
                  fill="url(#colorEquity)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-[8px] text-slate-500 uppercase font-bold block">Net Profit</span>
              <span className="text-xs font-mono font-bold text-emerald-400">+$1,420</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-[8px] text-slate-500 uppercase font-bold block">Sharpe</span>
              <span className="text-xs font-mono font-bold text-blue-400">2.14</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-[8px] text-slate-500 uppercase font-bold block">Max DD</span>
              <span className="text-xs font-mono font-bold text-rose-400">4.2%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-44 flex flex-col items-center justify-center border-2 border-dashed border-slate-900 rounded-xl text-slate-600">
          <Play size={32} className="mb-2 opacity-20" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Ready for Simulation</p>
        </div>
      )}
    </Card>
  );
};

export default BacktestPanel;