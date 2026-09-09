import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Receipt,
  ArrowUpRight
} from 'lucide-react';
import { Transaction } from '../../types';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'merchant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Extract unique categories for filter pills
  const categories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return ['ALL', ...Array.from(set)];
  }, [transactions]);

  // Filter & sort logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = 
          t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.date.includes(searchTerm) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortField === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortField === 'merchant') {
          return sortOrder === 'asc' 
            ? a.merchant.localeCompare(b.merchant) 
            : b.merchant.localeCompare(a.merchant);
        } else {
          return sortOrder === 'asc' 
            ? a.date.localeCompare(b.date) 
            : b.date.localeCompare(a.date);
        }
      });
  }, [transactions, searchTerm, selectedCategory, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: 'date' | 'amount' | 'merchant') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Food': return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
      case 'Travel': return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'Shopping': return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
      case 'Bills': return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      case 'Health': return 'bg-rose-950/80 text-rose-300 border-rose-800/60';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      
      {/* Table Title & Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-4 h-4 text-phonepe-400" />
            <span>Transaction Ledger</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
              {filteredTransactions.length} of {transactions.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400">Search, filter, and inspect individual expense entries</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search merchant, date..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-phonepe-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-phonepe-700 text-white shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transactions Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-2.5 px-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('merchant')}
              >
                <div className="flex items-center gap-1">
                  <span>Merchant / Description</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-4">Category</th>
              <th 
                className="py-2.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount (₹)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-850/60 transition-colors group">
                  <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                    {txn.date}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-white group-hover:text-phonepe-200 transition-colors">
                    {txn.merchant}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryBadgeClass(txn.category)}`}>
                      {txn.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-white font-mono">
                    ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-900/50">
                      Paid <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                  No matching transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filteredTransactions.length)}</strong> of{' '}
            <strong>{filteredTransactions.length}</strong> transactions
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
