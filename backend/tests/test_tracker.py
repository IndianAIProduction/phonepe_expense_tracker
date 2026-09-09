"""
Unit tests for backend parser, categorizer and tracker service
"""
import pytest
import sys
from pathlib import Path

# Add backend to path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.parser import TransactionParser
from app.services.categorizer import get_category
from app.services.tracker import ExpenseTrackerService


def test_categorizer():
    assert get_category("Swiggy") == "Food"
    assert get_category("Uber Ride") == "Travel"
    assert get_category("Amazon Purchase") == "Shopping"
    assert get_category("Bescom Electricity Bill") == "Bills"
    assert get_category("Apollo Pharmacy") == "Health"
    assert get_category("Random Merchant XYZ") == "Other"


def test_parser_sample_data():
    sample_text = """
    2026-08-01, Swiggy, 350
    2026-08-02, Uber Ride, 180
    2026-08-03, DMart Supermarket, 1450
    2026-08-09, Invalid Line Without Comma
    """
    transactions = TransactionParser.parse_text(sample_text)
    assert len(transactions) == 3
    assert transactions[0].merchant == "Swiggy"
    assert transactions[0].amount == 350.0
    assert transactions[0].category == "Food"


def test_tracker_service_summary():
    tracker = ExpenseTrackerService(budget_limit=10000.0)
    sample_text = """
    2026-08-01, Swiggy, 2480
    2026-08-02, Uber Ride, 2320
    2026-08-03, Amazon Purchase, 5498
    2026-08-04, Electricity Bill, 3608
    2026-08-05, Pharmacy, 1440
    """
    summary = tracker.analyze_raw_text(sample_text)
    assert summary.total_spent == 15346.00
    assert summary.is_over_budget is True
    assert summary.over_budget_amount == 5346.00
    assert summary.category_totals["Shopping"] == 5498.00
    assert summary.top_category.name == "Shopping"
    assert len(summary.insights) > 0


if __name__ == "__main__":
    test_categorizer()
    test_parser_sample_data()
    test_tracker_service_summary()
    print("All backend tests passed successfully!")
