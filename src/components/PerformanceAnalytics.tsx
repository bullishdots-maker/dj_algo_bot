import React from 'react';
import { Card } from './ui/card';
import { Trade } from '../types/trading';
import { Activity, Award, TrendingUp, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip } from 'recharts';

interface PerformanceAnalyticsProps {
  trades: Trade[];
  equityHistory: {time: string, equity: number}[];
}

const PerformanceAnalytics = ({ trades, equityHistory }: PerformanceAnalyticsProps) => {
  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  const wins = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losses = closedTrades.filter(t => (t.pnl || 0) <= 0);
  
  const totalWinAmount = wins.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const totalLossAmount = Math.abs(losses.reduce((acc, t) => acc + (t.pnl || 0), 0));
  
  const profitFactor = totalLossAmount === 0 ? totalWinAmount : (totalWinAmount / totalLossAmount).toFixed(2);
  const avgWin = wins.length === 0 ? 0 : (totalWinAmount / wins.length).toFixed(2);
  const avgLoss = losses.length === 0 ? 0 : (totalLossAmount / losses.length).toFixed(2);

  // Calculate Max Drawdown
  let maxEquity = 10000;
  let maxDD = 0;
  equityHistory.forEach(point => {
    if (point.equity > maxEquity) maxEquity = point.equity;
    const dd = ((maxEquity - point.equity) / maxEquity) * 100;
    if (dd > maxDD) maxDD = dd;
  });

  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="text-purple-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Advanced Analytics</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
          <TrendingUp size={12} /> Equity Curve
        </div>
      </div>

      <div className="h-32 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={equityHistory}>
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '4px', fontSize: '10px' }}
              labelStyle={{ display: 'none' }}
            />
            <Line 
              type="monotone" 
              dataKey="equity" 
              stroke="#8b5cf6" 
              strokeWidth={2} 
              dot={false} 
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Profit Factor</span>
          <div className="text-xl font-mono font-bold text-white">{profitFactor}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Max Drawdown</span>
          <div className="text-xl font-mono font-bold text-rose-400">{maxDD.toFixed(2)}%</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Avg Win</span>
          <div className="text-xl font-mono font-bold text-emerald-400">${Number(avgWin).toFixed(2)}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Total Trades</span>
          <div className="text-xl font-mono font-bold text-blue-400">{closedTrades.length}</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Award className="text-amber-400" size={16} />
          <span className="text-xs font-bold text-slate-300 uppercase">System Rating</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full ${i <= (Number(profitFactor) > 1.5 ? 5 : 3) ? 'bg-emerald-500' : 'bg-slate-800'}`} 
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PerformanceAnalytics;