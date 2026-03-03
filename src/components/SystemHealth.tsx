import React from 'react';
import { Card } from './ui/card';
import { Cpu, Zap, Globe, ShieldCheck } from 'lucide-react';
import { Progress } from './ui/progress';

const SystemHealth = () => {
  return (
    <Card className="p-6 bg-slate-950 border-slate-800 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="text-emerald-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Engine Health</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Latency</span>
            </div>
            <span className="text-xs font-mono text-emerald-400">42ms</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[15%] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">CPU Load</span>
            </div>
            <span className="text-xs font-mono text-blue-400">12.4%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[25%] shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">API Sync</span>
            </div>
            <span className="text-xs font-mono text-purple-400">Stable</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[98%] shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-rose-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Risk Buffer</span>
            </div>
            <span className="text-xs font-mono text-rose-400">Optimal</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 w-[85%] shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SystemHealth;