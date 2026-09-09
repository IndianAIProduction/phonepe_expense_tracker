import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { FileDropzone } from './components/upload/FileDropzone';
import { MetricCards } from './components/analytics/MetricCards';
import { BudgetGauge } from './components/analytics/BudgetGauge';
import { CategoryDonut } from './components/analytics/CategoryDonut';
import { SpendingTrends } from './components/analytics/SpendingTrends';
import { InsightsCard } from './components/analytics/InsightsCard';
import { TransactionTable } from './components/transactions/TransactionTable';
import { BudgetModal } from './components/common/BudgetModal';
import { DesktopService } from './services/api';
import { AnalysisResponse } from './types';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load initial demo data & config on startup
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const initialData = await DesktopService.loadDemoData();
        setData(initialData);
      } catch (err: any) {
        showToast(err.message || 'Failed to initialize expense tracker', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  // Handle Drag-and-Drop file content
  const handleFileLoaded = async (content: string, fileName: string) => {
    setIsLoading(true);
    try {
      const result = await DesktopService.analyzeRawText(content);
      setData(result);
      showToast(`Successfully parsed statement: ${fileName}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to process statement file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Native OS File Dialog
  const handleTriggerNativeUpload = async () => {
    setIsLoading(true);
    try {
      const result = await DesktopService.openFileDialog();
      if (result) {
        setData(result);
        showToast('Statement loaded successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to open statement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Demo Data Reload
  const handleLoadDemo = async () => {
    setIsLoading(true);
    try {
      const result = await DesktopService.loadDemoData();
      setData(result);
      showToast('Loaded sample PhonePe statement data', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to load sample statement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Monthly Budget Update
  const handleSaveBudget = async (newBudget: number) => {
    try {
      const res = await DesktopService.updateBudget(newBudget);
      if (res.success) {
        if (res.summary) {
          setData(res.summary);
        } else if (data) {
          // Re-calculate locally if summary not returned directly
          const isOver = data.total_spent > newBudget;
          setData({
            ...data,
            budget_limit: newBudget,
            is_over_budget: isOver,
            remaining_budget: Math.max(0, newBudget - data.total_spent),
            over_budget_amount: isOver ? data.total_spent - newBudget : 0
          });
        }
        showToast(`Budget limit updated to ₹${newBudget.toLocaleString('en-IN')}`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update budget', 'error');
    }
  };

  // Handle CSV/JSON Export
  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const res = await DesktopService.exportReport(format);
      if (res.success && res.path) {
        showToast(`Report exported to ${res.path}`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Export failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-phonepe-700 selection:text-white">
      
      {/* App Header */}
      <Header
        budgetLimit={data?.budget_limit ?? 10000}
        totalSpent={data?.total_spent ?? 0}
        isOverBudget={data?.is_over_budget ?? false}
        onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        onTriggerFileUpload={handleTriggerNativeUpload}
        onLoadDemoData={handleLoadDemo}
        onExport={handleExport}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top Alert Banner for Budget Overrun */}
        {data && data.is_over_budget && (
          <div className="rounded-2xl bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-rose-950/90 border border-rose-600/50 p-4 shadow-xl shadow-rose-950/40 flex items-center justify-between gap-4 animate-pulse-subtle">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-900 border border-rose-500 flex items-center justify-center text-rose-200 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">
                  Monthly Budget Limit Exceeded!
                </h4>
                <p className="text-xs text-rose-200/90 mt-0.5">
                  Your expenses have surpassed your ₹{data.budget_limit.toLocaleString('en-IN')} threshold by <strong className="text-white underline">₹{data.over_budget_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="shrink-0 px-3.5 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow"
            >
              Adjust Budget Limit
            </button>
          </div>
        )}

        {/* File Dropzone Section */}
        <FileDropzone
          onFileLoaded={handleFileLoaded}
          onLoadDemo={handleLoadDemo}
          isLoading={isLoading}
        />

        {/* Dashboard Analytics & Visualizations */}
        {data && (
          <>
            {/* 1. Metric Cards Grid */}
            <MetricCards data={data} />

            {/* 2. Charts & Gauge Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Budget Gauge & Insights */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                <BudgetGauge
                  totalSpent={data.total_spent}
                  budgetLimit={data.budget_limit}
                  isOverBudget={data.is_over_budget}
                  onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                />
              </div>

              {/* Right Column: Category Donut Breakdown */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                <CategoryDonut
                  categories={data.categories}
                  totalSpent={data.total_spent}
                />
              </div>
            </div>

            {/* 3. Daily Velocity Trend & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6">
                <SpendingTrends trends={data.daily_trends} />
              </div>
              <div className="lg:col-span-6">
                <InsightsCard insights={data.insights} />
              </div>
            </div>

            {/* 4. Searchable & Sortable Ledger Table */}
            <TransactionTable transactions={data.transactions} />
          </>
        )}

      </main>

      {/* Footer & Copyright */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md py-6 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Built & Engineered by <strong className="text-white font-bold tracking-tight">Indian AI Production</strong></span>
          </div>
          <div className="text-slate-500 text-[11px]">
            🔒 100% Offline & Secure • Local Device Processing
          </div>
          <div className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} <strong className="text-slate-300">Indian AI Production</strong>. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Budget Limit Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        currentBudget={data?.budget_limit ?? 10000}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
      />

      {/* Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold backdrop-blur-md ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-700 text-rose-200'
              : toastMessage.type === 'info'
              ? 'bg-purple-950/90 border-purple-700 text-purple-200'
              : 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
