import React, { useState } from 'react';
import { X, Wallet, Check, AlertCircle } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  currentBudget: number;
  onClose: () => void;
  onSave: (newBudget: number) => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  currentBudget,
  onClose,
  onSave,
}) => {
  const [budgetInput, setBudgetInput] = useState<string>(currentBudget.toString());
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setError(null);
    const parsed = parseFloat(budgetInput);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive budget amount.');
      return;
    }
    onSave(parsed);
    onClose();
  };

  const setPreset = (amount: number) => {
    setBudgetInput(amount.toString());
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-phonepe-950 border border-phonepe-700 flex items-center justify-center text-phonepe-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Set Monthly Budget</h3>
            <p className="text-xs text-slate-400">Configure your target expenditure limit</p>
          </div>
        </div>

        {/* Input Field */}
        <div className="my-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Budget Limit (₹ INR)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => {
                setBudgetInput(e.target.value);
                setError(null);
              }}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base focus:outline-none focus:border-phonepe-500 transition-colors"
              placeholder="10000"
              autoFocus
            />
          </div>
          {error && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Quick Preset Buttons */}
        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
            Quick Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {[5000, 10000, 15000, 20000, 30000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPreset(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  budgetInput === preset.toString()
                    ? 'bg-phonepe-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-phonepe-700 hover:bg-phonepe-600 text-white text-xs font-bold shadow-lg shadow-phonepe-950/50 flex items-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4" />
            Save Budget
          </button>
        </div>

      </div>
    </div>
  );
};
