import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';

interface EconomicCalendarProps {
  events: any[];
}

const EconomicCalendar = ({ events }: EconomicCalendarProps) => {
  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-blue-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Economic Calendar</h3>
      </div>

      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-mono text-slate-500 flex flex-col items-center">
                <Clock size={12} className="mb-1" />
                {event.time}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{event.currency}</span>
                  <Badge className={
                    event.impact === 'HIGH' ? "bg-rose-500/20 text-rose-500 border-rose-500/30 text-[8px] h-4" : 
                    "bg-amber-500/20 text-amber-500 border-amber-500/30 text-[8px] h-4"
                  }>
                    {event.impact}
                  </Badge>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{event.event}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Forecast</div>
              <div className="text-xs font-mono text-slate-300">{event.forecast}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default EconomicCalendar;