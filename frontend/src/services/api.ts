import { AnalysisResponse, AppConfig } from '../types';

// Built-in sample fallback data for browser-only development
const MOCK_SUMMARY: AnalysisResponse = {
  total_spent: 15346.00,
  budget_limit: 10000.00,
  remaining_budget: 0.00,
  is_over_budget: true,
  over_budget_amount: 5346.00,
  category_totals: {
    Shopping: 5498.00,
    Bills: 3608.00,
    Food: 2480.00,
    Travel: 2320.00,
    Health: 1440.00,
  },
  categories: [
    { category: 'Shopping', amount: 5498.00, percentage: 35.8, count: 4, color: '#8b5cf6' },
    { category: 'Bills', amount: 3608.00, percentage: 23.5, count: 5, color: '#3b82f6' },
    { category: 'Food', amount: 2480.00, percentage: 16.2, count: 7, color: '#10b981' },
    { category: 'Travel', amount: 2320.00, percentage: 15.1, count: 5, color: '#f59e0b' },
    { category: 'Health', amount: 1440.00, percentage: 9.4, count: 2, color: '#ef4444' },
  ],
  top_category: {
    name: 'Shopping',
    amount: 5498.00,
    percentage: 35.8,
  },
  daily_trends: [
    { date: '2026-08-01', amount: 350, count: 1 },
    { date: '2026-08-02', amount: 180, count: 1 },
    { date: '2026-08-03', amount: 1450, count: 1 },
    { date: '2026-08-04', amount: 220, count: 1 },
    { date: '2026-08-05', amount: 600, count: 1 },
    { date: '2026-08-06', amount: 999, count: 1 },
    { date: '2026-08-07', amount: 60, count: 1 },
    { date: '2026-08-08', amount: 299, count: 1 },
    { date: '2026-08-10', amount: 40, count: 1 },
    { date: '2026-08-11', amount: 1299, count: 1 },
    { date: '2026-08-12', amount: 215, count: 1 },
    { date: '2026-08-13', amount: 1850, count: 1 },
    { date: '2026-08-14', amount: 850, count: 1 },
    { date: '2026-08-15', amount: 799, count: 1 },
    { date: '2026-08-16', amount: 500, count: 1 },
    { date: '2026-08-17', amount: 1750, count: 1 },
    { date: '2026-08-18', amount: 75, count: 1 },
    { date: '2026-08-19', amount: 420, count: 1 },
    { date: '2026-08-20', amount: 350, count: 1 },
    { date: '2026-08-21', amount: 750, count: 1 },
    { date: '2026-08-22', amount: 240, count: 1 },
    { date: '2026-08-23', amount: 540, count: 1 },
    { date: '2026-08-24', amount: 310, count: 1 },
    { date: '2026-08-25', amount: 1200, count: 1 },
  ],
  transactions: [
    { id: 'txn-1', date: '2026-08-01', merchant: 'Swiggy', amount: 350, category: 'Food', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-2', date: '2026-08-02', merchant: 'Uber Ride', amount: 180, category: 'Travel', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-3', date: '2026-08-03', merchant: 'DMart Supermarket', amount: 1450, category: 'Shopping', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-4', date: '2026-08-04', merchant: 'Zomato Food', amount: 220, category: 'Food', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-5', date: '2026-08-05', merchant: 'Petrol Pump HPCL', amount: 600, category: 'Travel', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-6', date: '2026-08-06', merchant: 'Amazon Purchase', amount: 999, category: 'Shopping', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-7', date: '2026-08-07', merchant: 'Canteen Snacks', amount: 60, category: 'Food', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-8', date: '2026-08-08', merchant: 'Mobile Recharge Jio', amount: 299, category: 'Bills', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-9', date: '2026-08-10', merchant: 'Tea Stall', amount: 40, category: 'Food', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-10', date: '2026-08-11', merchant: 'Flipkart Order', amount: 1299, category: 'Shopping', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-11', date: '2026-08-12', merchant: 'Ola Mini Ride', amount: 215, category: 'Travel', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-12', date: '2026-08-13', merchant: 'Bescom Electricity Bill', amount: 1850, category: 'Bills', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-13', date: '2026-08-14', merchant: 'Restaurant Dinner', amount: 850, category: 'Food', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-14', date: '2026-08-15', merchant: 'Broadband Wifi Bill Airtel', amount: 799, category: 'Bills', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-15', date: '2026-08-16', merchant: 'Metro Card Recharge', amount: 500, category: 'Travel', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-16', date: '2026-08-17', merchant: 'Myntra Fashion Shopping', amount: 1750, category: 'Shopping', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-17', date: '2026-08-18', merchant: 'Rapido Bike Taxi', amount: 75, category: 'Travel', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-18', date: '2026-08-19', merchant: 'Swiggy Instamart', amount: 420, category: 'Food', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-19', date: '2026-08-20', merchant: 'Cinema Movie Ticket', amount: 350, category: 'Bills', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-20', date: '2026-08-21', merchant: 'Petrol Pump BPCL', amount: 750, category: 'Travel', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-21', date: '2026-08-22', merchant: 'Pharmacy Medical Store', amount: 240, category: 'Health', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-22', date: '2026-08-23', merchant: 'Zomato Delivery', amount: 540, category: 'Food', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-23', date: '2026-08-24', merchant: 'Water Bill Payment', amount: 310, category: 'Bills', type: 'DEBIT', status: 'SUCCESS' },
    { id: 'txn-24', date: '2026-08-25', merchant: 'Gym Membership', amount: 1200, category: 'Health', type: 'DEBIT', status: 'SUCCESS' },
  ],
  insights: [
    '⚠️ **Budget Alert**: You exceeded your ₹10,000 limit by ₹5,346.00 (53.5% over limit).',
    '🏷️ **Top Spend Category**: **Shopping** represents the highest expense at ₹5,498.00 (35.8% of total).',
    '📊 **Concentration**: **Shopping** and **Bills** together account for 59.3% of your spending.',
    '📅 **Peak Spending Day**: 2026-08-13 had the highest spending of ₹1,850.00 across 1 transaction(s).'
  ],
  total_transactions: 24,
};

async function getPyWebViewApi(): Promise<any | null> {
  if (typeof window === 'undefined') return null;
  if (window.pywebview?.api) return window.pywebview.api;

  return new Promise((resolve) => {
    let resolved = false;
    const onReady = () => {
      if (!resolved) {
        resolved = true;
        resolve(window.pywebview?.api || null);
      }
    };

    window.addEventListener('pywebviewready', onReady, { once: true });
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(window.pywebview?.api || null);
      }
    }, 300);
  });
}

export const DesktopService = {
  async isDesktop(): Promise<boolean> {
    const api = await getPyWebViewApi();
    return !!api;
  },

  async getConfig(): Promise<AppConfig> {
    const api = await getPyWebViewApi();
    if (api) {
      const res = await api.get_config();
      if (res.success && res.config) return res.config;
    }
    return { budget_limit: 10000, currency_symbol: '₹', theme: 'dark' };
  },

  async updateBudget(newBudget: number): Promise<{ success: boolean; budget?: number; summary?: AnalysisResponse; error?: string }> {
    const api = await getPyWebViewApi();
    if (api) {
      return await api.update_budget(newBudget);
    }
    return { success: true, budget: newBudget };
  },

  async analyzeRawText(content: string): Promise<AnalysisResponse> {
    const api = await getPyWebViewApi();
    if (api) {
      const res = await api.analyze_raw_text(content);
      if (res.success && res.data) return res.data;
      throw new Error(res.error || 'Failed to analyze statement content');
    }
    return MOCK_SUMMARY;
  },

  async loadDemoData(): Promise<AnalysisResponse> {
    const api = await getPyWebViewApi();
    if (api) {
      const res = await api.load_demo_data();
      if (res.success && res.data) return res.data;
      throw new Error(res.error || 'Failed to load demo data');
    }
    return MOCK_SUMMARY;
  },

  async openFileDialog(): Promise<AnalysisResponse | null> {
    const api = await getPyWebViewApi();
    if (api) {
      const res = await api.open_file_dialog();
      if (res.cancelled) return null;
      if (res.success && res.data) return res.data;
      throw new Error(res.error || 'Failed to open statement file');
    }
    return MOCK_SUMMARY;
  },

  async exportReport(format: 'csv' | 'json'): Promise<{ success: boolean; path?: string }> {
    const api = await getPyWebViewApi();
    if (api) {
      const res = await api.export_report(format);
      if (res.cancelled) return { success: false };
      if (res.success) return { success: true, path: res.path };
      throw new Error(res.error || 'Export failed');
    }
    return { success: true, path: `Downloaded phonepe_report.${format}` };
  }
};
