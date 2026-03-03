import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar, Line, Cell } from 'recharts';
import { Candle, Asset } from '../types/trading';
import { Card } from './ui/card';

interface PriceChartProps {
  data: Candle[];
  activeAsset: Asset;
}

const PriceChart = ({ data, activeAsset }: PriceChartProps) => {
  const precision = activeAsset === 'EUR/USD' ? 4 : 2;

  return (
    <Card className="p-4 bg-slate-950 border-slate-800 h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-200 font-semibold">{activeAsset} Price Action</h3>
        <div className="flex gap-4 text-xs">
          <span className="text-emerald-500">● Bullish Delta</span>
          <span className="text-rose-500">● Bearish Delta</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <XAxis dataKey="time" stroke="#475569" fontSize={12} />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="#475569" 
            fontSize={12} 
            tickFormatter={(val) => val.toFixed(precision)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
            itemStyle={{ color: '#f1f5f9' }}
            formatter={(value: number) => [value.toFixed(precision + 1), 'Price']}
          />
          <Bar dataKey="delta" yAxisId={0} opacity={0.3}>
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
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PriceChart;