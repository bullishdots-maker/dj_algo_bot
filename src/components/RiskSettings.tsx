import React from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Shield, Zap, Target } from 'lucide-react';

interface RiskSettingsProps {
  lotSize: number;
  setLotSize: (val: number) => void;
  riskLevel: number;
  setRiskLevel: (val: number) => void;
}

const RiskSettings = ({ lotSize, setLotSize, riskLevel, setRiskLevel }: RiskSettingsProps) => {
  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-blue-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Risk Management</h3>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              <Label className="text-xs text-slate-400 uppercase font-bold">Position Size</Label>
            </div>
            <span className="text-sm font-mono text-white">{lotSize.toFixed(2)} Lots</span>
          </div>
          <Slider 
            value={[lotSize]} 
            onValueChange={(val) => setLotSize(val[0])} 
            max={5} 
            step={0.1}
            className="py-2"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-rose-400" />
              <Label className="text-xs text-slate-400 uppercase font-bold">Aggression Level</Label>
            </div>
            <span className="text-sm font-mono text-white">{riskLevel}%</span>
          </div>
          <Slider 
            value={[riskLevel]} 
            onValueChange={(val) => setRiskLevel(val[0])} 
            max={100} 
            step={1}
            className="py-2"
          />
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Higher aggression increases signal frequency but may lead to higher drawdown.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RiskSettings;