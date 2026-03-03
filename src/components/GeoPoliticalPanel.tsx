import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Globe, Twitter, ShieldAlert, Zap, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeoPoliticalPanelProps {
  events: any[];
}

const GeoPoliticalPanel = ({ events }: GeoPoliticalPanelProps) => {
  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="text-emerald-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Geo-Political Intel</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Live Intel Feed</span>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {event.type === 'CONFLICT' && <ShieldAlert size={14} className="text-rose-500" />}
                {event.type === 'SOCIAL' && <Twitter size={14} className="text-blue-400" />}
                {event.type === 'EVENT' && <Zap size={14} className="text-amber-400" />}
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{event.title}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{event.time}</span>
            </div>
            
            <p className={cn(
              "text-xs leading-relaxed",
              event.type === 'SOCIAL' ? "italic text-blue-100/80 font-serif" : "text-slate-400"
            )}>
              {event.desc}
            </p>

            <div className="flex justify-between items-center pt-1">
              <Badge className={cn(
                "text-[8px] h-4 px-1.5",
                event.impact === 'CRITICAL' ? "bg-rose-600 text-white" :
                event.impact === 'HIGH' ? "bg-rose-500/20 text-rose-500 border-rose-500/30" :
                "bg-amber-500/20 text-amber-500 border-amber-500/30"
              )}>
                {event.impact} IMPACT
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GeoPoliticalPanel;