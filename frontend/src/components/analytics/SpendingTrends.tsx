import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { DailySpend } from '../../types';

interface SpendingTrendsProps {
  trends: DailySpend[];
}

export const SpendingTrends: React.FC<SpendingTrendsProps> = ({ trends }) => {
  if (!trends || trends.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center h-64">
        <p className="text-slate-400 text-xs">No daily trend data available</p>
      </div>
    );
  }

  // Format date display for chart (e.g., '08-01')
  const chartData = trends.map((item) => {
    const parts = item.date.split('-');
    const shortDate = parts.length === 3 ? `${parts[1]}/${parts[2]}` : item.date;
    return {
      date: item.date,
      shortDate,
      amount: item.amount,
      count: item.count
    };
  });

  const maxSpend = Math.max(...chartData.map((d) => d.amount));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <div className="text-xs font-semibold text-slate-400 mb-1">{data.date}</div>
          <div className="text-sm font-extrabold text-white">
            ₹{data.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-phonepe-300 mt-0.5">
            {data.count} transaction{data.count > 1 ? 's' : ''}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Daily Spending Velocity</h3>
          <p className="text-xs text-slate-400">Day-by-day expenditure timeline</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-phonepe-500" />
          <span>Daily Spend (₹)</span>
        </div>
      </div>

      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="shortDate" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`bar-${index}`} 
                  fill={entry.amount === maxSpend ? '#a855f7' : '#5f259f'} 
                  fillOpacity={entry.amount === maxSpend ? 1 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
