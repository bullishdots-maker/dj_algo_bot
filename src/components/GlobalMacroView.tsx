import React from 'react';
import { Card } from './ui/card';
import { Globe2, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const GlobalMacroView = () => {
  const indices = [
    { name: 'S&P 500', value: '5,241.53', change: '+1.2%', status: 'UP' },
    { name: 'NASDAQ', value: '16,384.47', change: '+1.5%', status: 'UP' },
    { name: 'DXY Index', value: '104.22', change: '-0.3%', status: 'DOWN' },
    { name: 'US 10Y Yield', value: '4.21%', change: '+0.02', status: 'UP' },
    { name: 'VIX Index', value: '13.42', change: '-4.2%', status: 'DOWN' },
  ];

  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Globe2 className="text-blue-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Global Macro View</h3>
      </div>

      <div className="space-y-3">
        {indices.map((index) => (
          <div key={index.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/30 border border-slate-800/50">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{index.name}</span>
              <span className="text-xs font-mono font-bold text-white">{index.value}</span>
            </div>
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded",
              index.status === 'UP' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {index.status === 'UP' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {index.change}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GlobalMacroView;