import React from 'react';
import { Card } from './ui/card';
import { Globe, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const SessionMap = () => {
  const sessions = [
    { name: 'Sydney', hours: '22:00 - 07:00', active: false },
    { name: 'Tokyo', hours: '00:00 - 09:00', active: false },
    { name: 'London', hours: '08:00 - 17:00', active: true },
    { name: 'New York', hours: '13:00 - 22:00', active: true },
  ];

  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="text-blue-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Market Sessions</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
          <Clock size={12} /> UTC Time
        </div>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  session.active ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-700"
                )} />
                <span className={cn(
                  "text-xs font-bold uppercase tracking-tight",
                  session.active ? "text-white" : "text-slate-500"
                )}>
                  {session.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{session.hours}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  session.active ? "bg-blue-600 w-[60%] shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-slate-800 w-[30%]"
                )} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-900">
        <p className="text-[9px] text-slate-600 leading-relaxed italic text-center">
          *High volatility expected during London/NY overlap (13:00 - 17:00 UTC).
        </p>
      </div>
    </Card>
  );
};

export default SessionMap;