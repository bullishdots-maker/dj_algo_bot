import React from 'react';
import { MarketOrder } from '../types/trading';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface OrderFlowTapeProps {
  orders: MarketOrder[];
}

const OrderFlowTape = ({ orders }: OrderFlowTapeProps) => {
  return (
    <Card className="bg-slate-950 border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-slate-200 font-semibold">Order Flow Tape</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className={cn(
                "flex justify-between items-center p-2 rounded text-xs font-mono",
                order.imbalance ? "bg-slate-800/50 border border-slate-700" : "opacity-80"
              )}
            >
              <span className="text-slate-500">{order.time}</span>
              <span className={cn(
                "font-bold",
                order.side === 'BUY' ? "text-emerald-500" : "text-rose-500"
              )}>
                {order.side}
              </span>
              <span className="text-slate-300">{order.price.toFixed(5)}</span>
              <span className={cn(
                "px-1 rounded",
                order.imbalance && (order.side === 'BUY' ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400")
              )}>
                {order.size} Lots
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default OrderFlowTape;