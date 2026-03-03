import React from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Anchor, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const WhaleTracker = () => {
  const whales = [
    { id: '1', asset: 'BTC/USD', size: 142.5, price: 64230.50, side: 'BUY', time: '2m ago' },
    { id: '2', asset: 'ETH/USD', size: 2500.0, price: 3450.20, side: 'SELL', time: '5m ago' },
    { id: '3', asset: 'BTC/USD', size: 85.2, price: 64190.00, side: 'BUY', time: '12m ago' },
    { id: '4', asset: 'XAU/USD', size: 1200.0, price: 2350.45, side: 'BUY', time: '15m ago' },
  ];

  return (
    <Card className="bg-slate-950 border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
        <div className="flex items-center gap-2">
          <Anchor size={16} className="text-blue-400" />
          <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Whale Tracker</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Institutional</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {whales.map((whale) => (
            <div key={whale.id} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 flex items-center justify-between group hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  whale.side === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}>
                  {whale.side === 'BUY' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase">{whale.asset}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{whale.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "text-xs font-mono font-bold",
                  whale.side === 'BUY' ? "text-emerald-400" : "text-rose-400"
                )}>
                  {whale.side === 'BUY' ? '+' : '-'}{whale.size.toLocaleString()} Lots
                </div>
                <div className="text-[10px] text-slate-600 font-bold uppercase">{whale.time}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default WhaleTracker;