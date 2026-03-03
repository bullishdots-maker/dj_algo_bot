import React from 'react';
import { Card } from './ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

const PortfolioAllocation = () => {
  const data = [
    { name: 'BTC/USD', value: 45, color: '#3b82f6' },
    { name: 'ETH/USD', value: 25, color: '#8b5cf6' },
    { name: 'XAU/USD', value: 20, color: '#f59e0b' },
    { name: 'XAG/USD', value: 10, color: '#94a3b8' },
  ];

  return (
    <Card className="p-6 bg-slate-950 border-slate-800 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <PieIcon className="text-blue-400" size={20} />
        <h3 className="text-slate-200 font-semibold">Portfolio Allocation</h3>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
            <span className="text-[10px] font-mono text-slate-200 ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PortfolioAllocation;