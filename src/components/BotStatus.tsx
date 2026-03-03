import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Play, Square, Activity, ShieldCheck } from 'lucide-react';

interface BotStatusProps {
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  currentPrice: number;
}

const BotStatus = ({ isActive, setIsActive, currentPrice }: BotStatusProps) => {
  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">AlgoBot v1.0</h2>
            <p className="text-slate-400 text-sm">Price Action & Order Flow Engine</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-blue-400">
              {currentPrice.toFixed(5)}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Live EUR/USD</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Activity size={16} />
              <span className="text-xs font-semibold uppercase">Strategy</span>
            </div>
            <div className="text-sm text-slate-200">Mean Reversion + Delta</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <ShieldCheck size={16} />
              <span className="text-xs font-semibold uppercase">Risk Mode</span>
            </div>
            <div className="text-sm text-slate-200">Conservative (1%)</div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
          <div className="flex items-center gap-3">
            <Switch 
              checked={isActive} 
              onCheckedChange={setIsActive}
              className="data-[state=checked]:bg-emerald-500"
            />
            <Label className="text-slate-200">Auto-Trading System</Label>
          </div>
          <Button 
            variant={isActive ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsActive(!isActive)}
            className={isActive ? "" : "bg-emerald-600 hover:bg-emerald-700"}
          >
            {isActive ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? "Stop Bot" : "Start Bot"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BotStatus;