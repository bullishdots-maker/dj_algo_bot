import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Globe, ShieldCheck } from 'lucide-react';

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <ShieldCheck className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
            AlgoBot <span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Engineered by <span className="text-slate-300">DJ trades</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 bg-slate-950/50 border border-slate-800/50 px-6 py-3 rounded-2xl backdrop-blur-sm">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market Time (UTC)</span>
          <div className="flex items-center gap-2 text-lg font-mono font-bold text-slate-200">
            <Clock size={16} className="text-blue-400" />
            {format(time, 'HH:mm:ss')}
          </div>
        </div>
        <div className="h-8 w-[1px] bg-slate-800" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Session Status</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-500 uppercase">London / NY Open</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;