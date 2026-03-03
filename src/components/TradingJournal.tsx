import React from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { BookOpen, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Trade } from '../types/trading';
import { cn } from '@/lib/utils';

interface TradingJournalProps {
  trades: Trade[];
}

const TradingJournal = ({ trades }: TradingJournalProps) => {
  const closedTrades = trades.filter(t => t.status === 'CLOSED');

  return (
    <Card className="bg-slate-950 border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-emerald-400" />
          <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Trading Journal</h3>
        </div>
        <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
          {closedTrades.length} Logged
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {closedTrades.length === 0 && (
            <div className="text-center py-10 text-slate-600 italic text-xs">
              No closed trades to analyze yet.
            </div>
          )}
          {closedTrades.map((trade) => (
            <div key={trade.id} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 group hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded",
                    (trade.pnl || 0) > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {(trade.pnl || 0) > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white uppercase">{trade.asset}</div>
                    <div className="text-[8px] text-slate-500 font-mono">{trade.time}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={8} 
                      className={cn(
                        s <= ((trade.pnl || 0) > 0 ? 5 : 2) ? "text-amber-400 fill-amber-400" : "text-slate-700"
                      )} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-2 line-clamp-2">
                {trade.reason}
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                <span className="text-[9px] text-slate-600 uppercase font-bold">Quality: {(trade.pnl || 0) > 0 ? 'A+' : 'C-'}</span>
                <span className={cn(
                  "text-[10px] font-mono font-bold",
                  (trade.pnl || 0) > 0 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {(trade.pnl || 0) > 0 ? '+' : ''}${trade.pnl?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TradingJournal;