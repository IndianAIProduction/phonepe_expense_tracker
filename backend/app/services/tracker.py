"""
Expense Tracker Service: Aggregation, Analytics & Insights
"""
from typing import List, Dict, Optional
from collections import defaultdict
from ..models.expense import (
    Transaction,
    CategoryBreakdown,
    TopCategory,
    DailySpend,
    ExpenseSummary
)
from .categorizer import get_category_color
from .parser import TransactionParser
from ..config.settings import get_budget_limit, DEFAULT_TRANSACTION_FILE
from ..utils.logger import setup_logger

logger = setup_logger("ExpenseTrackerService")


class ExpenseTrackerService:
    """Core analytics engine for computing spending summaries and insights"""

    def __init__(self, budget_limit: Optional[float] = None):
        self.budget_limit = budget_limit if budget_limit is not None else get_budget_limit()

    def set_budget(self, new_limit: float) -> None:
        self.budget_limit = float(new_limit)

    def analyze_transactions(self, transactions: List[Transaction]) -> ExpenseSummary:
        """Computes comprehensive metrics and breakdown from transaction list"""
        if not transactions:
            return ExpenseSummary(
                total_spent=0.0,
                budget_limit=self.budget_limit,
                remaining_budget=self.budget_limit,
                is_over_budget=False,
                over_budget_amount=0.0,
                category_totals={},
                categories=[],
                top_category=None,
                daily_trends=[],
                transactions=[],
                insights=["No transactions found in this statement. Upload or paste a valid statement."],
                total_transactions=0
            )

        total_spent = sum(t.amount for t in transactions)
        category_sums: Dict[str, float] = defaultdict(float)
        category_counts: Dict[str, int] = defaultdict(int)
        daily_sums: Dict[str, float] = defaultdict(float)
        daily_counts: Dict[str, int] = defaultdict(int)

        for txn in transactions:
            category_sums[txn.category] += txn.amount
            category_counts[txn.category] += 1
            daily_sums[txn.date] += txn.amount
            daily_counts[txn.date] += 1

        # Format category breakdowns
        categories: List[CategoryBreakdown] = []
        for cat, amt in sorted(category_sums.items(), key=lambda x: x[1], reverse=True):
            pct = (amt / total_spent * 100) if total_spent > 0 else 0
            categories.append(
                CategoryBreakdown(
                    category=cat,
                    amount=round(amt, 2),
                    percentage=round(pct, 1),
                    count=category_counts[cat],
                    color=get_category_color(cat)
                )
            )

        # Identify top category
        top_cat_obj: Optional[TopCategory] = None
        if categories:
            top = categories[0]
            top_cat_obj = TopCategory(
                name=top.category,
                amount=top.amount,
                percentage=top.percentage
            )

        # Format daily trends sorted by date
        daily_trends: List[DailySpend] = []
        for date_str in sorted(daily_sums.keys()):
            daily_trends.append(
                DailySpend(
                    date=date_str,
                    amount=round(daily_sums[date_str], 2),
                    count=daily_counts[date_str]
                )
            )

        # Budget calculations
        is_over_budget = total_spent > self.budget_limit
        over_budget_amount = round(total_spent - self.budget_limit, 2) if is_over_budget else 0.0
        remaining_budget = round(max(0.0, self.budget_limit - total_spent), 2)

        # Generate smart insights
        insights = self._generate_insights(total_spent, self.budget_limit, categories, daily_trends)

        return ExpenseSummary(
            total_spent=round(total_spent, 2),
            budget_limit=round(self.budget_limit, 2),
            remaining_budget=remaining_budget,
            is_over_budget=is_over_budget,
            over_budget_amount=over_budget_amount,
            category_totals={k: round(v, 2) for k, v in category_sums.items()},
            categories=categories,
            top_category=top_cat_obj,
            daily_trends=daily_trends,
            transactions=transactions,
            insights=insights,
            total_transactions=len(transactions)
        )

    def analyze_file(self, file_path: str) -> ExpenseSummary:
        """Parses and analyzes statement from file path"""
        transactions = TransactionParser.parse_file(file_path)
        return self.analyze_transactions(transactions)

    def analyze_raw_text(self, content: str) -> ExpenseSummary:
        """Parses and analyzes statement from text content"""
        transactions = TransactionParser.parse_text(content)
        return self.analyze_transactions(transactions)

    def analyze_default_file(self) -> ExpenseSummary:
        """Loads default transaction file for quick startup or demo"""
        if DEFAULT_TRANSACTION_FILE.exists():
            return self.analyze_file(str(DEFAULT_TRANSACTION_FILE))
        return self.analyze_transactions([])

    def _generate_insights(
        self,
        total_spent: float,
        budget: float,
        categories: List[CategoryBreakdown],
        daily_trends: List[DailySpend]
    ) -> List[str]:
        """Generates actionable bulleted insights for the user"""
        insights: List[str] = []

        # Budget insight
        if total_spent > budget:
            pct_over = ((total_spent - budget) / budget) * 100
            insights.append(f"⚠️ **Budget Alert**: You exceeded your ₹{budget:,.0f} limit by ₹{(total_spent - budget):,.2f} ({pct_over:.1f}% over limit).")
        else:
            remaining = budget - total_spent
            pct_used = (total_spent / budget * 100) if budget > 0 else 0
            insights.append(f"✅ **Budget on Track**: You have ₹{remaining:,.2f} remaining ({pct_used:.1f}% of budget used).")

        # Top category insight
        if categories:
            top = categories[0]
            insights.append(f"🏷️ **Top Spend Category**: **{top.category}** represents the highest expense at ₹{top.amount:,.2f} ({top.percentage}% of total).")
            if len(categories) > 1:
                second = categories[1]
                combined_pct = top.percentage + second.percentage
                insights.append(f"📊 **Concentration**: **{top.category}** and **{second.category}** together account for {combined_pct:.1f}% of your spending.")

        # Peak day insight
        if daily_trends:
            peak_day = max(daily_trends, key=lambda d: d.amount)
            insights.append(f"📅 **Peak Spending Day**: {peak_day.date} had the highest spending of ₹{peak_day.amount:,.2f} across {peak_day.count} transaction(s).")

        return insights
