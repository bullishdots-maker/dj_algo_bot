import React from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, User, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantChatProps {
  messages: any[];
}

const QuantChat = ({ messages }: QuantChatProps) => {
  return (
    <Card className="bg-slate-950 border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-purple-400" />
          <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Quant Intel Feed</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Live Signals</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-900 border border-slate-800">
                    <User size={10} className="text-slate-400" />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight">{msg.user}</span>
                </div>
                <div className="flex items-center gap-2">
                  {msg.type === 'BULL' && <TrendingUp size={12} className="text-emerald-500" />}
                  {msg.type === 'BEAR' && <TrendingDown size={12} className="text-rose-500" />}
                  {msg.type === 'NEUTRAL' && <Minus size={12} className="text-slate-500" />}
                  <span className="text-[10px] text-slate-600 font-mono">{msg.time}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-6 border-l border-slate-900 ml-2">
                {msg.msg}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default QuantChat;