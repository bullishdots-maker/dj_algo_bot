import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Bar, 
  Line, 
  Cell, 
  ReferenceLine,
  Scatter,
  CartesianGrid
} from 'recharts';
import { Candle, Asset, Trade } from '../types/trading';
import { Card } from './ui/card';

interface PriceChartProps {
  data: Candle[];
  activeAsset: Asset;
  trades: Trade[];
  currentPrice: number;
}

const PriceChart = ({ data, activeAsset, trades, currentPrice }: PriceChartProps) => {
  const precision = activeAsset === 'XAG/USD' ? 3 : 2;

  const tradeMarkers = trades
    .filter(t => t.asset === activeAsset)
    .map(t => ({
      time: t.time,
      price: t.price,
      type: t.type,
      status: t.status
    }));

  return (
    <Card className="p-4 bg-slate-950 border-slate-800 h-[500px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-slate-200 font-semibold">{activeAsset} Advanced Terminal</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live Data</span>
          </div>
        </div>
        <div className="flex gap-4 text-[10px] uppercase font-bold tracking-tight">
          <span className="text-emerald-500 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Buy
          </span>
          <span className="text-rose-500 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-500" /> Sell
          </span>
          <span className="text-amber-500 flex items-center gap-1">
            <div className="w-2 h-0.5 bg-amber-500" /> MA(7)
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#334155" 
            fontSize={10} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="#334155" 
            fontSize={10} 
            orientation="right"
            tickFormatter={(val) => val.toFixed(precision)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#f1f5f9', fontSize: '12px' }}
            labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}
            formatter={(value: number) => [value.toFixed(precision), 'Price']}
          />
          
          <Bar dataKey="delta" yAxisId={0} opacity={0.1}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.delta > 0 ? '#10b981' : '#f43f5e'} />
            ))}
          </Bar>

          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            dot={false} 
            strokeWidth={2}
            animationDuration={300}
          />

          <Line 
            type="monotone" 
            dataKey="ma7" 
            stroke="#f59e0b" 
            dot={false} 
            strokeWidth={1.5}
            strokeDasharray="5 5"
            opacity={0.6}
            animationDuration={300}
          />

          <ReferenceLine 
            y={currentPrice} 
            stroke="#3b82f6" 
            strokeDasharray="3 3" 
            label={{ 
              position: 'right', 
              value: currentPrice.toFixed(precision), 
              fill: '#3b82f6', 
              fontSize: 10,
              fontWeight: 'bold'
            }} 
          />

          <Scatter data={tradeMarkers}>
            {tradeMarkers.map((entry, index) => (
              <Cell 
                key={`trade-${index}`} 
                fill={entry.type === 'BUY' ? '#10b981' : '#f43f5e'} 
                stroke="#fff"
                strokeWidth={2}
                r={6}
              />
            ))}
          </Scatter>
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="absolute bottom-6 left-8 flex gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Volatility</span>
          <span className="text-xs font-mono text-emerald-400">Optimal</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Spread</span>
          <span className="text-xs font-mono text-slate-300">Low</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Engine</span>
          <span className="text-xs font-mono text-blue-400">Alpha-Pro v4.2</span>
        </div>
      </div>
    </Card>
  );
};

export default PriceChart;