"""
File export service for generating CSV, JSON, and summary reports
"""
import csv
import json
from pathlib import Path
from typing import Dict, Any, List
from ..models.expense import Transaction, ExpenseSummary


class FileExportService:
    """Handles exporting analysis results and transaction logs"""

    @staticmethod
    def export_csv(transactions: List[Transaction], output_path: str | Path) -> str:
        """Exports transactions to a CSV file"""
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["ID", "Date", "Merchant", "Category", "Amount (INR)", "Type", "Status"])
            for t in transactions:
                writer.writerow([t.id, t.date, t.merchant, t.category, f"{t.amount:.2f}", t.type, t.status])

        return str(path.resolve())

    @staticmethod
    def export_json(summary: ExpenseSummary, output_path: str | Path) -> str:
        """Exports full summary data to JSON"""
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "w", encoding="utf-8") as f:
            json.dump(summary.to_dict(), f, indent=2)

        return str(path.resolve())
