import React, { useState } from 'react';
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
import RiskRewardPanel from '../components/RiskRewardPanel';
import MT5Connector from '../components/MT5Connector';
import GeoPoliticalPanel from '../components/GeoPoliticalPanel';
import MarketDepth from '../components/MarketDepth';
import SystemLogs from '../components/SystemLogs';
import TradingViewChart from '../components/TradingViewChart';
import Header from '../components/Header';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Asset } from '../types/trading';
import { toast } from "sonner";
import { Download, User, Layout, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeAsset, setActiveAsset] = useState<Asset>('BTC/USD');
  const [lotSize, setLotSize] = useState(1.0);
  const [riskLevel, setRiskLevel] = useState(50);
  const [viewMode, setViewMode] = useState<'standard' | 'tradingview'>('standard');
  
  const { 
    candles, trades, orders, currentPrice, account, sentiment, equityHistory,
    news, geoEvents, ecoEvents, executeManualTrade, closeTrade 
  } = useTradingSim(isActive, activeAsset);

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
      <NewsTicker news={news} />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <Header />

        <div className="flex justify-between items-end">
          <AccountOverview account={account} />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportCSV}
              className="border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Export History
            </Button>
          </div>
        </div>

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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Terminal View</h3>
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button 
                    onClick={() => setViewMode('standard')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${viewMode === 'standard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Layout size={12} /> Standard
                  </button>
                  <button 
                    onClick={() => setViewMode('tradingview')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 ${viewMode === 'tradingview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <BarChart3 size={12} /> TradingView
                  </button>
                </div>
              </div>

              {viewMode === 'standard' ? (
                <PriceChart 
                  data={candles} 
                  activeAsset={activeAsset} 
                  trades={trades}
                  currentPrice={currentPrice}
                />
              ) : (
                <div className="h-[500px]">
                  <TradingViewChart asset={activeAsset} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TechnicalAnalysis candles={candles} />
              <MarketSentiment sentiment={sentiment} />
              <EconomicCalendar events={ecoEvents} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GeoPoliticalPanel events={geoEvents} />
              <MT5Connector />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskRewardPanel lotSize={lotSize} currentPrice={currentPrice} />
              <RiskSettings 
                lotSize={lotSize} 
                setLotSize={setLotSize} 
                riskLevel={riskLevel} 
                setRiskLevel={setRiskLevel} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <PerformanceAnalytics trades={trades} equityHistory={equityHistory} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
              <TradeLog trades={trades} />
              <SystemLogs isActive={isActive} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="h-[400px]">
              <MarketDepth activeAsset={activeAsset} currentPrice={currentPrice} />
            </div>
            <div className="h-[calc(100vh-600px)] min-h-[400px]">
              <OrderFlowTape orders={orders} activeAsset={activeAsset} />
            </div>
          </div>
        </div>

        <footer className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User size={12} />
            <span>© 2024 AlgoBot Pro. Developed by <span className="text-slate-300 font-bold">DJ trades</span>.</span>
          </div>
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.3em] animate-pulse">
            Dikshil Jagani - The Man Behind This Bot
          </div>
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;