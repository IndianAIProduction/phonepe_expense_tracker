"""
PhonePe Expense Tracker CLI Entrypoint
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT / "backend") not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT / "backend"))

from backend.app.utils.logger import setup_logger
from backend.app.services.tracker import ExpenseTrackerService
from backend.app.services.file_service import FileExportService
from backend.app.config.settings import get_budget_limit, DEFAULT_TRANSACTION_FILE, DATA_DIR


def main():
    logger = setup_logger("CLI")
    logger.info("Initializing PhonePe Expense Tracker CLI....")

    budget_limit = get_budget_limit()
    service = ExpenseTrackerService(budget_limit=budget_limit)

    summary = service.analyze_default_file()
    
    # Save JSON summary
    output_json = DATA_DIR / "summary.json"
    FileExportService.export_json(summary, output_json)
    logger.info(f"Summary data written to {output_json}")

    print("\n" + "=" * 50)
    print(" 📊 PHONEPE EXPENSE ANALYSIS REPORT 📊")
    print("=" * 50 + "\n")
    print(f"Total Money Spent: ₹{summary.total_spent:.2f}")
    print("\nSpending Breakdown by Category:")

    for category, amount in summary.category_totals.items():
        print(f"     {category:12s} : ₹{amount:.2f}")

    print("-" * 50)

    if summary.is_over_budget:
        print(f"\n⚠️ WARNING: You have exceeded your monthly budget limit of ₹{budget_limit:.1f}")
    else:
        print(f"\n🎉 Congratulations! You are within your budget limit of ₹{budget_limit:.1f}")

    print("=" * 50 + "\n")


if __name__ == "__main__":
    main()
