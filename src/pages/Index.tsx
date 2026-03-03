import React, { useState } from 'react';
import { useTradingSim } from '../hooks/useTradingSim';
import PriceChart from '../components/PriceChart';
import OrderFlowTape from '../components/OrderFlowTape';
import BotStatus from '../components/BotStatus';
import TradeLog from '../components/TradeLog';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const { candles, trades, orders, currentPrice } = useTradingSim(isActive);

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BotStatus 
              isActive={isActive} 
              setIsActive={setIsActive} 
              currentPrice={currentPrice} 
            />
          </div>
          <div className="hidden lg:block">
            <div className="h-full p-6 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex flex-col justify-center">
              <h4 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-2">System Health</h4>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium">Engine Online</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Latency</span>
                  <span className="text-slate-200">14ms</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Chart & Log */}
          <div className="lg:col-span-8 space-y-6">
            <PriceChart data={candles} />
            <div className="h-[400px]">
              <TradeLog trades={trades} />
            </div>
          </div>

          {/* Right: Order Flow Tape */}
          <div className="lg:col-span-4 h-[824px]">
            <OrderFlowTape orders={orders} />
          </div>
        </div>

        <footer className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-500">
            © 2024 AlgoForex Systems. For simulation purposes only.
          </div>
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;