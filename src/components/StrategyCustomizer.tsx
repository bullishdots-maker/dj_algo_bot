import React from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Settings2, Zap, Activity, Shield } from 'lucide-react';

const StrategyCustomizer = () => {
  return (
    <Card className="p-6 bg-slate-950 border-slate-800 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="text-blue-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Strategy Customizer</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              <Label className="text-[10px] text-slate-500 uppercase font-bold">RSI Period</Label>
            </div>
            <span className="text-xs font-mono text-white">14 Periods</span>
          </div>
          <Slider defaultValue={[14]} max={30} min={2} step={1} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-amber-400" />
              <Label className="text-[10px] text-slate-500 uppercase font-bold">MA Length</Label>
            </div>
            <span className="text-xs font-mono text-white">7 Periods</span>
          </div>
          <Slider defaultValue={[7]} max={50} min={1} step={1} />
        </div>

        <div className="pt-4 border-t border-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase">Trend Filter</span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase">Volatility Scaler</span>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StrategyCustomizer;