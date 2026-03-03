import React, { useState, useEffect } from 'react';
import { useTradingSim } from '../hooks/useTradingSim';
import PriceChart from '../components/PriceChart';
import OrderFlowTape from '../components/OrderFlowTape';
import BotStatus from '../components/BotStatus';
import TradeLog from '../components/TradeLog';
import AccountOverview from '../components/AccountOverview';
import RiskSettings from '../components/RiskSettings';
import PerformanceAnalytics from '../components/PerformanceAnalytics';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Asset } from '../types/trading';
import { toast } from "sonner";

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeAsset, setActiveAsset] = useState<Asset>('EUR/USD');
  const [lotSize, setLotSize] = useState(1.0);
  const [riskLevel, setRiskLevel] = useState(50);
  
  const { candles, trades, orders, currentPrice, account } = useTradingSim(isActive, activeAsset);

  // Notify on new trade execution
  useEffect(() => {
    if (trades.length > 0 && trades[0].status === 'OPEN') {
      const latestTrade = trades[0];
      toast.info(`New ${latestTrade.type} Order`, {
        description: `${latestTrade.asset} executed at ${latestTrade.price.toFixed(activeAsset === 'EUR/USD' ? 5 : 2)}`,
        duration: 3000,
      });
    }
  }, [trades.length]);

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Account Stats Row */}
        <AccountOverview account={account} />

        {/* Header & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <BotStatus 
              isActive={isActive} 
              setIsActive={setIsActive} 
              currentPrice={currentPrice}
              activeAsset={activeAsset}
              setActiveAsset={setActiveAsset}
            />
          </div>
          <div className="lg:col-span-4">
            <div className="h-full p-6 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex flex-col justify-center">
              <h4 className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-2">System Health</h4>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium">Engine Online</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold">
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
          {/* Left Column: Chart & Log */}
          <div className="lg:col-span-8 space-y-6">
            <PriceChart 
              data={candles} 
              activeAsset={activeAsset} 
              trades={trades}
              currentPrice={currentPrice}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskSettings 
                lotSize={lotSize} 
                setLotSize={setLotSize} 
                riskLevel={riskLevel} 
                setRiskLevel={setRiskLevel} 
              />
              <PerformanceAnalytics trades={trades} />
            </div>
            <div className="h-[400px]">
              <TradeLog trades={trades} />
            </div>
          </div>

          {/* Right Column: Order Flow Tape */}
          <div className="lg:col-span-4 h-full">
            <div className="sticky top-6 h-[calc(100vh-100px)]">
              <OrderFlowTape orders={orders} activeAsset={activeAsset} />
            </div>
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