import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Play, Square, Globe, ShieldCheck, Cpu } from 'lucide-react';
import { Asset } from '../types/trading';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface BotStatusProps {
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  currentPrice: number;
  activeAsset: Asset;
  setActiveAsset: (asset: Asset) => void;
}

const BotStatus = ({ isActive, setIsActive, currentPrice, activeAsset, setActiveAsset }: BotStatusProps) => {
  const formatPrice = (price: number) => {
    if (activeAsset === 'XAG/USD') return price.toFixed(3);
    if (activeAsset === 'XAU/USD') return price.toFixed(2);
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <Card className="p-6 bg-slate-950 border-slate-800 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
        <Cpu size={120} className="text-blue-500" />
      </div>
      
      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">DJ ALGO <span className="text-blue-500">CORE</span></h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">v4.2 Neural Engine</p>
            </div>
            <div className="h-12 w-[1px] bg-slate-800 mx-2" />
            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Asset Selection</Label>
              <Select value={activeAsset} onValueChange={(val) => setActiveAsset(val as Asset)}>
                <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800 text-white h-9 font-bold">
                  <SelectValue placeholder="Select Asset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="BTC/USD">Bitcoin (BTC/USD)</SelectItem>
                  <SelectItem value="ETH/USD">Ethereum (ETH/USD)</SelectItem>
                  <SelectItem value="XAU/USD">Gold (XAU/USD)</SelectItem>
                  <SelectItem value="XAG/USD">Silver (XAG/USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-mono font-black text-blue-400 tracking-tighter">
              {formatPrice(currentPrice)}
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              <Globe size={12} className="text-emerald-500" />
              Real-Time Feed
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 rounded-xl bg-blue-500/5 border border-blue-500/20 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Switch 
                checked={isActive} 
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-emerald-500"
              />
              <Label className="text-slate-200 font-bold text-sm uppercase tracking-tight">Auto-Execution</Label>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <ShieldCheck size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Risk Shield Active</span>
            </div>
          </div>
          <Button 
            variant={isActive ? "destructive" : "default"}
            size="lg"
            onClick={() => setIsActive(!isActive)}
            className={isActive ? "font-black uppercase tracking-widest" : "bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"}
          >
            {isActive ? <Square className="mr-2 h-4 w-4" fill="currentColor" /> : <Play className="mr-2 h-4 w-4" fill="currentColor" />}
            {isActive ? "Terminate" : "Initialize"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BotStatus;