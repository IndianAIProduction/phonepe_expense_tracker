"""
Data models for PhonePe Expense Tracker
"""
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional


@dataclass
class Transaction:
    id: str
    date: str
    merchant: str
    amount: float
    category: str = "Other"
    type: str = "DEBIT"
    status: str = "SUCCESS"


@dataclass
class CategoryBreakdown:
    category: str
    amount: float
    percentage: float
    count: int
    color: str


@dataclass
class TopCategory:
    name: str
    amount: float
    percentage: float


@dataclass
class DailySpend:
    date: str
    amount: float
    count: int


@dataclass
class ExpenseSummary:
    total_spent: float
    budget_limit: float
    remaining_budget: float
    is_over_budget: bool
    over_budget_amount: float
    category_totals: Dict[str, float]
    categories: List[CategoryBreakdown]
    top_category: Optional[TopCategory]
    daily_trends: List[DailySpend]
    transactions: List[Transaction]
    insights: List[str]
    total_transactions: int

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class AppConfig:
    budget_limit: float = 10000.0
    currency_symbol: str = "₹"
    theme: str = "dark"

    def to_dict(self) -> dict:
        return asdict(self)
