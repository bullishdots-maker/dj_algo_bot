import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Globe, Twitter, ShieldAlert, Zap, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const GeoPoliticalPanel = () => {
  const events = [
    { 
      type: 'CONFLICT', 
      title: 'Middle East Tensions', 
      desc: 'Escalation in Red Sea shipping lanes reported.', 
      impact: 'CRITICAL',
      time: '12m ago'
    },
    { 
      type: 'SOCIAL', 
      title: 'Trump Alert', 
      desc: '"TARIFFS ARE THE GREATEST THING EVER MADE! CHINA WILL PAY!"', 
      impact: 'HIGH',
      time: '45m ago'
    },
    { 
      type: 'EVENT', 
      title: 'G7 Emergency Summit', 
      desc: 'Leaders meeting to discuss global trade sanctions.', 
      impact: 'MED',
      time: '2h ago'
    }
  ];

  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="text-emerald-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Geo-Political Intel</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">High Volatility Risk</span>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 space-y-2">
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
              {event.type === 'SOCIAL' && (
                <div className="flex items-center gap-1 text-[10px] text-slate-600">
                  <MessageSquare size={10} /> 12.4k
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-900">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase">
          <span>Global Risk Index</span>
          <span className="text-rose-400">78/100</span>
        </div>
        <div className="mt-2 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 w-[78%]" />
        </div>
      </div>
    </Card>
  );
};

export default GeoPoliticalPanel;