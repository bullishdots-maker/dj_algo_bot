import React, { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Target, ShieldAlert, TrendingUp } from 'lucide-react';

interface RiskRewardPanelProps {
  lotSize: number;
  currentPrice: number;
}

const RiskRewardPanel = ({ lotSize, currentPrice }: RiskRewardPanelProps) => {
  const [rrRatio, setRrRatio] = useState(2.0);
  const [riskPips, setRiskPips] = useState(10);

  const potentialLoss = (riskPips * 10) * lotSize; // Simplified calculation
  const potentialProfit = potentialLoss * rrRatio;

  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Target className="text-emerald-400" size={20} />
        <h3 className="text-slate-200 font-semibold">R:R Management</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] text-slate-500 uppercase font-bold">Risk to Reward Ratio</Label>
            <span className="text-sm font-mono text-emerald-400">1 : {rrRatio.toFixed(1)}</span>
          </div>
          <Slider 
            value={[rrRatio]} 
            onValueChange={(val) => setRrRatio(val[0])} 
            min={1} 
            max={5} 
            step={0.1}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
            <div className="flex items-center gap-1 mb-1">
              <ShieldAlert size={12} className="text-rose-500" />
              <span className="text-[10px] text-slate-500 uppercase font-bold">Est. Risk</span>
            </div>
            <div className="text-lg font-mono font-bold text-rose-400">-${potentialLoss.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-[10px] text-slate-500 uppercase font-bold">Est. Reward</span>
            </div>
            <div className="text-lg font-mono font-bold text-emerald-400">+${potentialProfit.toFixed(2)}</div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 leading-relaxed italic">
          *Calculations based on current lot size and {riskPips} pip stop loss.
        </p>
      </div>
    </Card>
  );
};

export default RiskRewardPanel;