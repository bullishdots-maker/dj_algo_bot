import React, { useState, useEffect } from 'react';
import { useTradingSim } from '../hooks/useTradingSim';
import PriceChart from '../components/PriceChart';
import OrderFlowTape from '../components/OrderFlowTape';
import BotStatus from '../components/BotStatus';
import TradeLog from '../components/TradeLog';
import AccountOverview from '../components/AccountOverview';
import RiskSettings from '../components/RiskSettings';
import PerformanceAnalytics from '../components/PerformanceAnalytics';
import MarketSentiment from '../components/MarketSentiment';
import EconomicCalendar from '../components/EconomicCalendar';
import ManualControls from '../components/ManualControls';
import NewsTicker from '../components/NewsTicker';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Asset, Strategy } from '../types/trading';
import { toast } from "sonner";
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeAsset, setActiveAsset] = useState<Asset>('EUR/USD');
  const [strategy, setStrategy] = useState<Strategy>('MEAN_REVERSION');
  const [lotSize, setLotSize] = useState(1.0);
  const [riskLevel, setRiskLevel] = useState(50);
  
  const { 
    candles, 
    trades, 
    orders, 
    currentPrice, 
    account, 
    sentiment, 
    equityHistory,
    executeManualTrade, 
    closeTrade 
  } = useTradingSim(isActive, activeAsset, strategy);

  const openTrades = trades.filter(t => t.status === 'OPEN');

  const handleExportCSV = () => {
    const headers = ['ID', 'Asset', 'Time', 'Type', 'Price', 'Status', 'PnL', 'Reason'];
    const rows = trades.map(t => [
      t.id, t.asset, t.time, t.type, t.price, t.status, t.pnl || 0, t.reason
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `trade_history_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Trade history exported successfully");
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-blue-500/30">
      <NewsTicker />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-end">
          <AccountOverview account={account} />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            className="border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" /> Export History
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <BotStatus 
              isActive={isActive} 
              setIsActive={setIsActive} 
              currentPrice={currentPrice}
              activeAsset={activeAsset}
              setActiveAsset={setActiveAsset}
              strategy={strategy}
              setStrategy={setStrategy}
            />
          </div>
          <div className="lg:col-span-4">
            <ManualControls 
              onBuy={() => executeManualTrade('BUY', currentPrice)}
              onSell={() => executeManualTrade('SELL', currentPrice)}
              onCloseAll={() => openTrades.forEach(t => closeTrade(t.id, currentPrice))}
              openTradesCount={openTrades.length}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <PriceChart 
              data={candles} 
              activeAsset={activeAsset} 
              trades={trades}
              currentPrice={currentPrice}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TechnicalAnalysis candles={candles} />
              <MarketSentiment sentiment={sentiment} />
              <EconomicCalendar />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskSettings 
                lotSize={lotSize} 
                setLotSize={setLotSize} 
                riskLevel={riskLevel} 
                setRiskLevel={setRiskLevel} 
              />
              <PerformanceAnalytics trades={trades} equityHistory={equityHistory} />
            </div>
            <div className="h-[400px]">
              <TradeLog trades={trades} />
            </div>
          </div>

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