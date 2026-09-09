import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface BudgetGaugeProps {
  totalSpent: number;
  budgetLimit: number;
  isOverBudget: boolean;
  onOpenBudgetModal: () => void;
}

export const BudgetGauge: React.FC<BudgetGaugeProps> = ({
  totalSpent,
  budgetLimit,
  isOverBudget,
  onOpenBudgetModal
}) => {
  const percentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
  const clampedProgress = Math.min(percentage, 100);

  // SVG Circular Gauge Math
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  let strokeColor = '#10b981'; // Emerald (<75%)
  if (percentage >= 100) {
    strokeColor = '#ef4444'; // Red (Over)
  } else if (percentage >= 75) {
    strokeColor = '#f59e0b'; // Amber Warning
  }

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Monthly Budget Velocity</h3>
          <p className="text-xs text-slate-400">Target threshold vs current expenditure</p>
        </div>
        <button
          onClick={onOpenBudgetModal}
          className="text-xs text-phonepe-300 hover:text-phonepe-200 hover:underline font-semibold"
        >
          Change Limit
        </button>
      </div>

      {/* Center Circular Radial Visual */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="#1e293b"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Dynamic Progress Arc */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-white tracking-tight">
            {percentage.toFixed(0)}%
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {isOverBudget ? 'Exceeded' : 'Consumed'}
          </span>
        </div>
      </div>

      {/* Bottom Alert / Status Pill */}
      <div className={`rounded-xl p-3 flex items-center gap-2.5 text-xs font-medium ${
        isOverBudget 
          ? 'bg-rose-950/60 border border-rose-800/80 text-rose-300' 
          : 'bg-emerald-950/50 border border-emerald-800/60 text-emerald-300'
      }`}>
        {isOverBudget ? (
          <>
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
            <span>Exceeded limit by <strong>₹{(totalSpent - budgetLimit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Budget healthy. <strong>₹{(budgetLimit - totalSpent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> remaining buffer.</span>
          </>
        )}
      </div>

    </div>
  );
};
