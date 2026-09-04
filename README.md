# 📱 PhonePe Monthly Expense Tracker

A production-grade Python project designed for students (Week 0–12 Python level).

## 🌟 Features
- Reads raw transaction data from `data/transactions.txt`.
- Auto-categorizes payments into **Food**, **Travel**, **Shopping**, **Bills**, or **Others**.
- Calculates monthly total spending and checks against budget limits set in `.env`.
- Exports a clean `summary.json` report.
- Features production-grade logging, custom decorators, error resilience, and modular OOP design.

## 🚀 Quickstart

1. **Run the Project:**
   ```bash
   python main.py
   ```

2. **Check the Output:**
   - Terminal prints formatted spending breakdown.
   - `summary.json` is created with detailed JSON data.
   - Execution logs are saved to `logs/tracker.log`.
