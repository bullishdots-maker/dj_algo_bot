import React from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Bell, Plus, Trash2, Zap } from 'lucide-react';
import { Button } from './ui/button';

const AlertsPanel = () => {
  const alerts = [
    { id: '1', asset: 'BTC/USD', condition: 'Price > 65,000', active: true },
    { id: '2', asset: 'ETH/USD', condition: 'RSI < 30', active: true },
    { id: '3', asset: 'XAU/USD', condition: 'Price < 2,300', active: false },
  ];

  return (
    <Card className="bg-slate-950 border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-amber-400" />
          <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Alerts Manager</h3>
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white">
          <Plus size={14} />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-2 rounded bg-slate-900/30 border border-slate-800/50 group">
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${alert.active ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'}`} />
                <div>
                  <div className="text-[10px] font-bold text-white uppercase">{alert.asset}</div>
                  <div className="text-[9px] text-slate-500 font-mono">{alert.condition}</div>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-rose-500">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-3 bg-slate-900/40 border-t border-slate-800">
        <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase font-bold">
          <Zap size={10} className="text-amber-500" />
          <span>Push Notifications Active</span>
        </div>
      </div>
    </Card>
  );
};

export default AlertsPanel;