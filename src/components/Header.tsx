import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Globe, ShieldCheck, Zap } from 'lucide-react';

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 border border-blue-400/30">
          <Zap className="text-white" size={28} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
            DJ ALGO <span className="text-blue-500">BOT</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">
            Engineered by <span className="text-blue-400">Dikshil Jagani</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 bg-slate-950/80 border border-slate-800 px-6 py-3 rounded-2xl backdrop-blur-md shadow-2xl">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market Time (UTC)</span>
          <div className="flex items-center gap-2 text-xl font-mono font-bold text-slate-200">
            <Clock size={16} className="text-blue-400" />
            {format(time, 'HH:mm:ss')}
          </div>
        </div>
        <div className="h-10 w-[1px] bg-slate-800" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-tight">Live Execution Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;