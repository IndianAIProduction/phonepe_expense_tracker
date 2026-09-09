import React from 'react';
import { Sparkles, Lightbulb, CheckCircle, AlertOctagon } from 'lucide-react';

interface InsightsCardProps {
  insights: string[];
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5 border-phonepe-800/40 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-phonepe-950 border border-phonepe-700/60 flex items-center justify-center text-phonepe-400">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">AI & Smart Expense Insights</h3>
          <p className="text-[11px] text-slate-400">Key takeaways calculated from your PhonePe transaction pattern</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {insights.map((insight, idx) => {
          const isWarning = insight.includes('⚠️') || insight.includes('Alert');
          const isSuccess = insight.includes('✅') || insight.includes('Track');

          // Clean out emoji markers for clean rendering
          const cleanText = insight
            .replace('⚠️', '')
            .replace('✅', '')
            .replace('🏷️', '')
            .replace('📊', '')
            .replace('📅', '')
            .trim();

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                isWarning
                  ? 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                  : isSuccess
                  ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isWarning ? (
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                ) : isSuccess ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div
                className="prose prose-invert prose-xs"
                dangerouslySetInnerHTML={{
                  __html: cleanText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-phonepe-600/5 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
