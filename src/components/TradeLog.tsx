import React from 'react';
import { Trade } from '../types/trading';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Info, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradeLogProps {
  trades: Trade[];
}

const TradeLog = ({ trades }: TradeLogProps) => {
  return (
    <Card className="bg-slate-950 border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-slate-200 font-semibold">Execution Log</h3>
        <Badge variant="outline" className="text-slate-400 border-slate-700">
          {trades.length} Signals
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {trades.length === 0 && (
            <div className="text-center py-10 text-slate-600">
              <Info className="mx-auto mb-2 opacity-20" size={32} />
              <p className="text-sm">Waiting for market signals...</p>
            </div>
          )}
          {trades.map((trade) => (
            <div key={trade.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {trade.type === 'BUY' ? (
                    <TrendingUp className="text-emerald-500" size={18} />
                  ) : (
                    <TrendingDown className="text-rose-500" size={18} />
                  )}
                  <span className={trade.type === 'BUY' ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                    {trade.type} @ {trade.price.toFixed(5)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {trade.status === 'OPEN' ? (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] flex gap-1 items-center">
                      <Clock size={10} /> OPEN
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[10px] flex gap-1 items-center">
                      <CheckCircle2 size={10} /> CLOSED
                    </Badge>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono">{trade.time}</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                {trade.reason}
              </p>

              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-2">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                    SL: {(trade.price - (trade.type === 'BUY' ? 0.0010 : -0.0010)).toFixed(5)}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                    TP: {(trade.price + (trade.type === 'BUY' ? 0.0020 : -0.0020)).toFixed(5)}
                  </Badge>
                </div>
                {trade.status === 'CLOSED' && (
                  <span className={cn(
                    "text-xs font-mono font-bold",
                    (trade.pnl || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {(trade.pnl || 0) >= 0 ? '+' : ''}${trade.pnl?.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TradeLog;