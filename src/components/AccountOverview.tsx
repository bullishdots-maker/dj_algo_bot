import React from 'react';
import { Card } from './ui/card';
import { AccountStats } from '../types/trading';
import { Wallet, TrendingUp, Percent, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountOverviewProps {
  account: AccountStats;
}

const AccountOverview = ({ account }: AccountOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-slate-950 border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Wallet size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Balance</span>
        </div>
        <div className="text-2xl font-mono font-bold text-white">
          ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </Card>

      <Card className="p-4 bg-slate-950 border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <BarChart3 size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Equity</span>
        </div>
        <div className="text-2xl font-mono font-bold text-white">
          ${account.equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </Card>

      <Card className="p-4 bg-slate-950 border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <TrendingUp size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Total P/L</span>
        </div>
        <div className={cn(
          "text-2xl font-mono font-bold",
          account.totalProfit >= 0 ? "text-emerald-400" : "text-rose-400"
        )}>
          {account.totalProfit >= 0 ? '+' : ''}
          ${account.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </Card>

      <Card className="p-4 bg-slate-950 border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Percent size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Win Rate</span>
        </div>
        <div className="text-2xl font-mono font-bold text-white">
          {account.winRate.toFixed(1)}%
        </div>
      </Card>
    </div>
  );
};

export default AccountOverview;