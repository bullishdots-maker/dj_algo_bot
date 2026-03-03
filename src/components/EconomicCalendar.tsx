import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';

const EconomicCalendar = () => {
  const events = [
    { time: '14:30', currency: 'USD', event: 'Core CPI m/m', impact: 'HIGH', forecast: '0.3%', actual: '-' },
    { time: '16:00', currency: 'USD', event: 'Consumer Confidence', impact: 'MED', forecast: '103.9', actual: '-' },
    { time: '18:30', currency: 'EUR', event: 'ECB President Lagarde Speaks', impact: 'HIGH', forecast: '-', actual: '-' },
  ];

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

      <div className="mt-4 p-2 rounded bg-amber-500/5 border border-amber-500/20 flex gap-2 items-start">
        <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[9px] text-amber-200/70 leading-tight">
          High impact news expected in 2 hours. Volatility may increase significantly.
        </p>
      </div>
    </Card>
  );
};

export default EconomicCalendar;