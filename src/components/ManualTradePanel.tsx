import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { TrendingUp, TrendingDown, Zap, ShieldAlert } from 'lucide-react';
import { Asset } from '../types/trading';

interface ManualTradePanelProps {
  activeAsset: Asset;
  currentPrice: number;
  onExecute: (type: 'BUY' | 'SELL', price: number, reason: string) => void;
}

const ManualTradePanel = ({ activeAsset, currentPrice, onExecute }: ManualTradePanelProps) => {
  const [size, setSize] = useState('1.0');

  const handleTrade = (type: 'BUY' | 'SELL') => {
    onExecute(type, currentPrice, `Manual ${type} Execution via Terminal`);
  };

  return (
    <Card className="p-6 bg-slate-950 border-slate-800 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="text-blue-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Manual Execution</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] text-slate-500 uppercase font-bold">Position Size (Lots)</Label>
            <span className="text-[10px] text-blue-400 font-mono">Max: 5.00</span>
          </div>
          <Input 
            type="number" 
            value={size} 
            onChange={(e) => setSize(e.target.value)}
            className="bg-slate-900 border-slate-800 text-white h-10 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => handleTrade('BUY')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-emerald-500/20"
          >
            <TrendingUp className="mr-2 h-4 w-4" /> Buy
          </Button>
          <Button 
            onClick={() => handleTrade('SELL')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest h-12 shadow-lg shadow-rose-500/20"
          >
            <TrendingDown className="mr-2 h-4 w-4" /> Sell
          </Button>
        </div>

        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
          <ShieldAlert className="text-blue-400 shrink-0" size={16} />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Manual trades bypass the neural engine's filters but are still subject to the global risk shield and stop-loss protocols.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ManualTradePanel;