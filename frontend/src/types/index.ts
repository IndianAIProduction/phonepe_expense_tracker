export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  type: 'DEBIT' | 'CREDIT';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

export interface TopCategory {
  name: string;
  amount: number;
  percentage: number;
}

export interface DailySpend {
  date: string;
  amount: number;
  count: number;
}

export interface AnalysisResponse {
  total_spent: number;
  budget_limit: number;
  remaining_budget: number;
  is_over_budget: boolean;
  over_budget_amount: number;
  category_totals: Record<string, number>;
  categories: CategoryBreakdown[];
  top_category: TopCategory | null;
  daily_trends: DailySpend[];
  transactions: Transaction[];
  insights: string[];
  total_transactions: number;
}

export interface AppConfig {
  budget_limit: number;
  currency_symbol: string;
  theme: string;
}

export interface PyWebViewApi {
  get_config: () => Promise<{ success: boolean; config?: AppConfig; error?: string }>;
  update_budget: (newBudget: number) => Promise<{ success: boolean; budget?: number; summary?: AnalysisResponse; error?: string }>;
  analyze_file: (filePath: string) => Promise<{ success: boolean; data?: AnalysisResponse; error?: string }>;
  analyze_raw_text: (content: string) => Promise<{ success: boolean; data?: AnalysisResponse; error?: string }>;
  load_demo_data: () => Promise<{ success: boolean; data?: AnalysisResponse; error?: string }>;
  open_file_dialog: () => Promise<{ success: boolean; data?: AnalysisResponse; cancelled?: boolean; error?: string }>;
  export_report: (format: 'csv' | 'json') => Promise<{ success: boolean; path?: string; cancelled?: boolean; error?: string }>;
}

declare global {
  interface Window {
    pywebview?: {
      api: PyWebViewApi;
    };
  }
}
