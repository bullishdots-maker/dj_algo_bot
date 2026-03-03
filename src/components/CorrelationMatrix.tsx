import React from 'react';
import { Card } from './ui/card';
import { Asset } from '../types/trading';
import { Layers, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const CorrelationMatrix = () => {
  const assets: Asset[] = ['BTC/USD', 'ETH/USD', 'XAU/USD', 'XAG/USD'];
  
  // Simulated correlation data (-1 to 1)
  const data: Record<string, Record<string, number>> = {
    'BTC/USD': { 'BTC/USD': 1, 'ETH/USD': 0.85, 'XAU/USD': -0.12, 'XAG/USD': -0.08 },
    'ETH/USD': { 'BTC/USD': 0.85, 'ETH/USD': 1, 'XAU/USD': -0.15, 'XAG/USD': -0.10 },
    'XAU/USD': { 'BTC/USD': -0.12, 'ETH/USD': -0.15, 'XAU/USD': 1, 'XAG/USD': 0.92 },
    'XAG/USD': { 'BTC/USD': -0.08, 'ETH/USD': -0.10, 'XAU/USD': 0.92, 'XAG/USD': 1 },
  };

  const getBgColor = (val: number) => {
    if (val === 1) return 'bg-blue-500/20 text-blue-400';
    if (val > 0.7) return 'bg-emerald-500/20 text-emerald-400';
    if (val > 0.4) return 'bg-emerald-500/10 text-emerald-500/70';
    if (val < -0.4) return 'bg-rose-500/20 text-rose-400';
    return 'bg-slate-900 text-slate-500';
  };

  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Layers className="text-blue-400" size={20} />
          <h3 className="text-slate-200 font-semibold">Correlation Matrix</h3>
        </div>
        <Info size={14} className="text-slate-600 cursor-help" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr>
              <th className="p-2"></th>
              {assets.map(a => (
                <th key={a} className="p-2 text-slate-500 uppercase font-bold">{a.split('/')[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map(row => (
              <tr key={row}>
                <td className="p-2 text-slate-500 uppercase font-bold border-r border-slate-900">{row.split('/')[0]}</td>
                {assets.map(col => (
                  <td key={`${row}-${col}`} className="p-1">
                    <div className={cn(
                      "h-10 flex items-center justify-center rounded-lg font-bold transition-all border border-transparent hover:border-white/10",
                      getBgColor(data[row][col])
                    )}>
                      {data[row][col].toFixed(2)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center text-[9px] text-slate-600 uppercase font-bold tracking-widest">
        <span>Inverse (-1.0)</span>
        <div className="flex-1 mx-4 h-1 bg-gradient-to-r from-rose-500 via-slate-800 to-emerald-500 rounded-full" />
        <span>Positive (1.0)</span>
      </div>
    </Card>
  );
};

export default CorrelationMatrix;