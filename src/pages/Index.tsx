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
import NewsTicker from '../components/NewsTicker';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import RiskRewardPanel from '../components/RiskRewardPanel';
import MT5Connector from '../components/MT5Connector';
import GeoPoliticalPanel from '../components/GeoPoliticalPanel';
import MarketDepth from '../components/MarketDepth';
import SystemLogs from '../components/SystemLogs';
import TradingViewChart from '../components/TradingViewChart';
import NeuralMatrix from '../components/NeuralMatrix';
import QuantChat from '../components/QuantChat';
import MarketWatchlist from '../components/MarketWatchlist';
import SystemHealth from '../components/SystemHealth';
import BacktestPanel from '../components/BacktestPanel';
import SessionMap from '../components/SessionMap';
import CorrelationMatrix from '../components/CorrelationMatrix';
import LiquidityHeatmap from '../components/LiquidityHeatmap';
import PortfolioAllocation from '../components/PortfolioAllocation';
import NeuralNarrative from '../components/NeuralNarrative';
import WhaleTracker from '../components/WhaleTracker';
import StrategyCustomizer from '../components/StrategyCustomizer';
import TradingJournal from '../components/TradingJournal';
import AlertsPanel from '../components/AlertsPanel';
import Header from '../components/Header';
import NeuralTrainingMonitor from '../components/NeuralTrainingMonitor';
import GlobalMacroView from '../components/GlobalMacroView';
import ManualTradePanel from '../components/ManualTradePanel';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Asset } from '../types/trading';
import { toast } from "sonner";
import { Download, User, Layout, BarChart3, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeAsset, setActiveAsset] = useState<Asset>('BTC/USD');
  const [lotSize, setLotSize] = useState(1.0);
  const [riskLevel, setRiskLevel] = useState(50);
  const [viewMode, setViewMode] = useState<'standard' | 'tradingview'>('standard');
  
  const { 
    candles, trades, orders, currentPrice, account, sentiment, equityHistory,
    news, geoEvents, ecoEvents, quantChat, neuralWeights, executeManualTrade, closeTrade 
  } = useTradingSim(isActive, activeAsset);

  const handleExportCSV = () => {
    const headers = ['ID', 'Asset', 'Time', 'Type', 'Price', 'Status', 'PnL', 'Reason'];
    const rows = trades.map(t => [
      t.id, t.asset, t.time, t.type, t.price, t.status, t.pnl || 0, t.reason
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `DJ_ALGO_History_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Trade history exported successfully");
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-sans selection:bg-blue-500/30">
      <NewsTicker news={news} />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <Header />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1 w-full">
            <AccountOverview account={account} />
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportCSV}
              className="border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
            >
              <Download className="mr-2 h-4 w-4" /> Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <BotStatus 
              isActive={isActive} 
              setIsActive={setIsActive} 
              currentPrice={currentPrice}
              activeAsset={activeAsset}
              setActiveAsset={setActiveAsset}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Market Terminal</h3>
                </div>
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 backdrop-blur-sm">
                  <button 
                    onClick={() => setViewMode('standard')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'standard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Layout size={12} /> Standard
                  </button>
                  <button 
                    onClick={() => setViewMode('tradingview')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'tradingview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <BarChart3 size={12} /> TradingView
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NeuralMatrix weights={neuralWeights} />
              <NeuralTrainingMonitor />
              <SystemHealth />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeuralNarrative />
              <PortfolioAllocation />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CorrelationMatrix />
              <LiquidityHeatmap />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BacktestPanel />
              <SessionMap />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GeoPoliticalPanel events={geoEvents} />
              <QuantChat messages={quantChat} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TechnicalAnalysis candles={candles} />
              <StrategyCustomizer />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ManualTradePanel 
                activeAsset={activeAsset} 
                currentPrice={currentPrice} 
                onExecute={executeManualTrade} 
              />
              <RiskSettings 
                lotSize={lotSize} 
                setLotSize={setLotSize} 
                riskLevel={riskLevel} 
                setRiskLevel={setRiskLevel} 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskRewardPanel lotSize={lotSize} currentPrice={currentPrice} />
              <PerformanceAnalytics trades={trades} equityHistory={equityHistory} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[450px]">
              <TradingJournal trades={trades} />
              <SystemLogs isActive={isActive} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <MarketWatchlist 
              activeAsset={activeAsset} 
              onSelect={setActiveAsset} 
              currentPrice={currentPrice} 
            />
            <GlobalMacroView />
            <MarketSentiment sentiment={sentiment} />
            <AlertsPanel />
            <div className="h-[400px] shadow-2xl">
              <WhaleTracker />
            </div>
            <div className="h-[450px] shadow-2xl">
              <MarketDepth activeAsset={activeAsset} currentPrice={currentPrice} />
            </div>
            <div className="h-[calc(100vh-600px)] min-h-[500px] shadow-2xl">
              <OrderFlowTape orders={orders} activeAsset={activeAsset} />
            </div>
          </div>
        </div>

        <footer className="pt-12 pb-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <ShieldCheck size={14} className="text-blue-500" />
            </div>
            <span>© 2024 DJ ALGO BOT. Developed by <span className="text-slate-200 font-bold">Dikshil Jagani</span>.</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] animate-pulse">
              The Man Behind The Machine
            </div>
            <div className="text-[9px] font-bold text-blue-500/50 uppercase tracking-widest">
              Dikshil Jagani - Quantitative Engineer
            </div>
          </div>
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;