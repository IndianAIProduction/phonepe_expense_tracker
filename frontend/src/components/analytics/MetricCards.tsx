import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  CreditCard, 
  Tag,
  Receipt
} from 'lucide-react';
import { AnalysisResponse } from '../../types';

interface MetricCardsProps {
  data: AnalysisResponse;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ data }) => {
  const {
    total_spent,
    budget_limit,
    remaining_budget,
    is_over_budget,
    over_budget_amount,
    top_category,
    total_transactions
  } = data;

  const budgetUsagePct = budget_limit > 0 ? (total_spent / budget_limit) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total Money Spent */}
      <div className="glass-card glass-card-hover rounded-2xl p-4.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent</span>
          <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-white tracking-tight">
            ₹{total_spent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <Receipt className="w-3.5 h-3.5 text-slate-500" />
          <span>Across <strong>{total_transactions}</strong> verified transactions</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-600/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 2. Monthly Budget Target */}
      <div className="glass-card glass-card-hover rounded-2xl p-4.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget Target</span>
          <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-white tracking-tight">
            ₹{budget_limit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Burn velocity:</span>
          <strong className={budgetUsagePct > 100 ? 'text-rose-400' : 'text-emerald-400'}>
            {budgetUsagePct.toFixed(1)}%
          </strong>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 3. Budget Variance Status (Dynamic Danger/Success) */}
      <div className={`glass-card glass-card-hover rounded-2xl p-4.5 relative overflow-hidden border ${
        is_over_budget ? 'border-rose-900/60 bg-rose-950/20' : 'border-emerald-900/60 bg-emerald-950/20'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget Status</span>
          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
            is_over_budget 
              ? 'bg-rose-950 border-rose-800 text-rose-400' 
              : 'bg-emerald-950 border-emerald-800 text-emerald-400'
          }`}>
            {is_over_budget ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-extrabold tracking-tight ${is_over_budget ? 'text-rose-400' : 'text-emerald-400'}`}>
            {is_over_budget ? `+₹${over_budget_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : `₹${remaining_budget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium">
          {is_over_budget ? (
            <span className="text-rose-300 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Exceeded by ₹{over_budget_amount.toFixed(0)}
            </span>
          ) : (
            <span className="text-emerald-300 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Safe ₹{remaining_budget.toFixed(0)} remaining
            </span>
          )}
        </div>
        <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-xl pointer-events-none ${
          is_over_budget ? 'bg-rose-600/15' : 'bg-emerald-600/15'
        }`} />
      </div>

      {/* 4. Top Category */}
      <div className="glass-card glass-card-hover rounded-2xl p-4.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Spend Category</span>
          <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Tag className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-white tracking-tight truncate">
            {top_category?.name || 'N/A'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 font-bold">
            {top_category?.percentage ?? 0}%
          </span>
        </div>
        <div className="mt-2.5 text-xs text-slate-400">
          Total: <strong className="text-slate-200">₹{top_category?.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</strong>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-600/10 rounded-full blur-xl pointer-events-none" />
      </div>

    </div>
  );
};
