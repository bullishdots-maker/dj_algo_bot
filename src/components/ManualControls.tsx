import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, XCircle } from 'lucide-react';
import { Trade } from '../types/trading';

interface ManualControlsProps {
  onBuy: () => void;
  onSell: () => void;
  onCloseAll: () => void;
  openTradesCount: number;
}

const ManualControls = ({ onBuy, onSell, onCloseAll, openTradesCount }: ManualControlsProps) => {
  return (
    <Card className="p-6 bg-slate-950 border-slate-800">
      <div className="flex flex-col gap-4">
        <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wider">Manual Execution</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={onBuy}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12"
          >
            <TrendingUp className="mr-2" size={18} /> BUY
          </Button>
          <Button 
            onClick={onSell}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-12"
          >
            <TrendingDown className="mr-2" size={18} /> SELL
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={onCloseAll}
          disabled={openTradesCount === 0}
          className="border-slate-700 text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <XCircle className="mr-2" size={16} /> Close All Positions ({openTradesCount})
        </Button>
      </div>
    </Card>
  );
};

export default ManualControls;