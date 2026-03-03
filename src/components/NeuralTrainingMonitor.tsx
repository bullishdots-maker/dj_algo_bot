import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { BrainCircuit, Activity, Zap, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip } from 'recharts';

const NeuralTrainingMonitor = () => {
  const [epoch, setEpoch] = useState(1420);
  const [loss, setLoss] = useState(0.042);
  const [history, setHistory] = useState<{step: number, loss: number}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEpoch(prev => prev + 1);
      const newLoss = Math.max(0.01, loss + (Math.random() - 0.5) * 0.005);
      setLoss(newLoss);
      setHistory(prev => [...prev.slice(-19), { step: epoch, loss: newLoss }]);
    }, 3000);
    return () => clearInterval(interval);
  }, [epoch, loss]);

  return (
    <Card className="p-6 bg-slate-950 border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-purple-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Neural Training Monitor</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          <RefreshCw size={10} className="text-purple-500 animate-spin" />
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Optimizing</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Current Epoch</span>
          <div className="text-xl font-mono font-bold text-white">{epoch}</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Loss Function</span>
          <div className="text-xl font-mono font-bold text-purple-400">{loss.toFixed(4)}</div>
        </div>
      </div>

      <div className="h-24 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <XAxis dataKey="step" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Line 
              type="monotone" 
              dataKey="loss" 
              stroke="#a855f7" 
              strokeWidth={2} 
              dot={false} 
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
          <span>Model Convergence</span>
          <span className="text-emerald-400">94.2%</span>
        </div>
        <Progress value={94.2} className="h-1 bg-slate-900" />
      </div>
    </Card>
  );
};

export default NeuralTrainingMonitor;