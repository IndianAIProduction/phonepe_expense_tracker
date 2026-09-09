import React from 'react';
import { 
  Wallet, 
  UploadCloud, 
  Download, 
  Settings, 
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

import { PhonePeLogo } from '../common/PhonePeLogo';

interface HeaderProps {
  budgetLimit: number;
  totalSpent: number;
  isOverBudget: boolean;
  onOpenBudgetModal: () => void;
  onTriggerFileUpload: () => void;
  onLoadDemoData: () => void;
  onExport: (format: 'csv' | 'json') => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  budgetLimit,
  totalSpent,
  isOverBudget,
  onOpenBudgetModal,
  onTriggerFileUpload,
  onLoadDemoData,
  onExport,
  isLoading
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <PhonePeLogo size={42} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-white tracking-tight">
                PhonePe <span className="text-transparent bg-clip-text bg-gradient-to-r from-phonepe-300 via-purple-300 to-indigo-200">Expense Intelligence</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-phonepe-950 text-phonepe-300 border border-phonepe-700/50">
                PRO Desktop
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
                by Indian AI Production
              </span>
            </div>
            <p className="text-xs text-slate-400">Automated statement analytics & budget intelligence</p>
          </div>
        </div>

        {/* Action Controls & Budget Pill */}
        <div className="flex items-center gap-2.5">
          
          {/* Active Budget Pill Button */}
          <button
            onClick={onOpenBudgetModal}
            className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isOverBudget
                ? 'bg-rose-950/40 border-rose-800/50 text-rose-300 hover:bg-rose-900/50'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-phonepe-500/50 hover:bg-slate-850'
            }`}
            title="Click to edit monthly budget"
          >
            <Wallet className={`w-3.5 h-3.5 ${isOverBudget ? 'text-rose-400' : 'text-phonepe-400'}`} />
            <span>Budget: <strong className="text-white">₹{budgetLimit.toLocaleString('en-IN')}</strong></span>
            <Settings className="w-3 h-3 text-slate-400 group-hover:text-phonepe-300 transition-transform group-hover:rotate-45" />
          </button>

          {/* Quick Demo Data Button */}
          <button
            onClick={onLoadDemoData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
            title="Load sample PhonePe statement"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Load Demo</span>
          </button>

          {/* Native File Selector */}
          <button
            onClick={onTriggerFileUpload}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-phonepe-700 hover:bg-phonepe-600 text-white text-xs font-semibold shadow-md shadow-phonepe-950/40 transition-all active:scale-95"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          {/* Export Dropdown / Button */}
          <div className="relative group">
            <button
              onClick={() => onExport('csv')}
              disabled={isLoading || totalSpent === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all disabled:opacity-40 disabled:pointer-events-none"
              title="Export as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
