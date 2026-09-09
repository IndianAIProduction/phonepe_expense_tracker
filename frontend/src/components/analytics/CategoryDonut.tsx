import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryBreakdown } from '../../types';

interface CategoryDonutProps {
  categories: CategoryBreakdown[];
  totalSpent: number;
}

export const CategoryDonut: React.FC<CategoryDonutProps> = ({ categories, totalSpent }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center h-full min-h-[300px]">
        <p className="text-slate-400 text-xs">No category data available</p>
      </div>
    );
  }

  const chartData = categories.map((c) => ({
    name: c.category,
    value: c.amount,
    percentage: c.percentage,
    color: c.color,
    count: c.count
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="text-xs font-bold text-white">{data.name}</span>
          </div>
          <div className="text-sm font-extrabold text-slate-100">
            ₹{data.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {data.percentage}% ({data.count} txns)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white tracking-tight">Category Breakdown</h3>
          <span className="text-xs text-slate-400">{categories.length} Categories</span>
        </div>
        <p className="text-xs text-slate-400 mb-2">Spending distribution across categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 my-auto">
        {/* Donut Chart Visual */}
        <div className="md:col-span-6 h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="#0f172a"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-semibold text-slate-400">Total</span>
            <span className="text-sm font-black text-white">
              ₹{(totalSpent / 1000).toFixed(1)}k
            </span>
          </div>
        </div>

        {/* Category List & Mini Progress Bars */}
        <div className="md:col-span-6 flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div key={cat.category} className="group flex flex-col gap-1 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="font-semibold text-slate-200">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">₹{cat.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  <span className="text-[11px] text-slate-400 w-9 text-right font-mono">{cat.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
