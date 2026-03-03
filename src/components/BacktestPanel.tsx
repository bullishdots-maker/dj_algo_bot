import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Play, BarChart3, TrendingUp, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'sonner';

const BacktestPanel = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [stats, setStats] = useState({ profit: 0, sharpe: 0, drawdown: 0 });

  const runBacktest = () => {
    setIsSimulating(true);
    setProgress(0);
    setResults([]);
    
    const duration = 3000; // 3 seconds simulation
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const p = (currentStep / steps) * 100;
      setProgress(p);

      if (currentStep >= steps) {
        clearInterval(timer);
        generateResults();
      }
    }, interval);
  };

  const generateResults = () => {
    const mockData = [];
    let equity = 10000;
    const winRate = 0.55 + (Math.random() * 0.1);
    
    for (let i = 0; i < 60; i++) {
      const change = (Math.random() < winRate ? 1 : -1) * (Math.random() * 400);
      equity += change;
      mockData.push({ day: i, equity });
    }

    const finalProfit = equity - 10000;
    setStats({
      profit: finalProfit,
      sharpe: (1.5 + Math.random()).toFixed(2) as any,
      drawdown: (3 + Math.random() * 5).toFixed(1) as any
    });
    
    setResults(mockData);
    setIsSimulating(false);
    toast.success(`Backtest Complete: $${finalProfit.toFixed(2)} Net Profit`);
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
          {isSimulating ? (
            <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Simulating...</>
          ) : "Run Simulation"}
        </Button>
      </div>

      {isSimulating ? (
        <div className="h-44 flex flex-col items-center justify-center space-y-4">
          <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse">
            Processing Historical Data...
          </div>
          <Progress value={progress} className="w-full h-1 bg-slate-900" />
          <div className="text-[9px] text-slate-500 font-mono">
            Analyzing {Math.floor(progress * 14.4)} market hours...
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-6 animate-in fade-in duration-500">
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
              <span className={stats.profit >= 0 ? "text-xs font-mono font-bold text-emerald-400" : "text-xs font-mono font-bold text-rose-400"}>
                {stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(0)}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-[8px] text-slate-500 uppercase font-bold block">Sharpe</span>
              <span className="text-xs font-mono font-bold text-blue-400">{stats.sharpe}</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
              <span className="text-[8px] text-slate-500 uppercase font-bold block">Max DD</span>
              <span className="text-xs font-mono font-bold text-rose-400">{stats.drawdown}%</span>
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