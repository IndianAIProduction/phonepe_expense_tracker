"""
Resilient Statement Parser for PhonePe and generic expense statements
"""
import re
import uuid
from typing import List, Tuple
from pathlib import Path
from ..models.expense import Transaction
from .categorizer import get_category
from ..utils.logger import setup_logger

logger = setup_logger("TransactionParser")


class TransactionParser:
    """Parses statement files or raw string contents into structured Transaction objects"""

    @staticmethod
    def _clean_amount(amount_str: str) -> float:
        """Removes currency symbols, commas, and extracts float value"""
        cleaned = re.sub(r"[^\d.]", "", amount_str.strip())
        return float(cleaned) if cleaned else 0.0

    @staticmethod
    def _is_header_row(line: str) -> bool:
        """Detects if a row is a CSV / table header"""
        line_lower = line.lower()
        return "date" in line_lower and ("merchant" in line_lower or "description" in line_lower or "amount" in line_lower)

    @classmethod
    def parse_line(cls, line: str, line_idx: int = 0) -> Tuple[Transaction, None] | Tuple[None, str]:
        """Parses a single text line into a Transaction or returns an error message"""
        line_str = line.strip()
        if not line_str or line_str.startswith("#") or cls._is_header_row(line_str):
            return None, "Empty, comment or header line"

        # Split by comma (standard), tab, or pipe
        if "," in line_str:
            parts = [p.strip() for p in line_str.split(",")]
        elif "\t" in line_str:
            parts = [p.strip() for p in line_str.split("\t")]
        elif "|" in line_str:
            parts = [p.strip() for p in line_str.split("|")]
        else:
            return None, f"Unsupported delimiter in line: '{line_str}'"

        if len(parts) < 3:
            return None, f"Insufficient columns ({len(parts)}/3) in line: '{line_str}'"

        date_str = parts[0]
        merchant_str = parts[1]
        amount_str = parts[2]

        try:
            amount = cls._clean_amount(amount_str)
            if amount <= 0:
                return None, f"Non-positive amount '{amount_str}'"

            category = get_category(merchant_str)
            txn_id = f"txn-{line_idx + 1}-{uuid.uuid4().hex[:6]}"

            txn = Transaction(
                id=txn_id,
                date=date_str,
                merchant=merchant_str,
                amount=amount,
                category=category,
                type="DEBIT",
                status="SUCCESS"
            )
            return txn, None
        except Exception as e:
            return None, f"Failed to parse line '{line_str}': {e}"

    @classmethod
    def parse_text(cls, content: str) -> List[Transaction]:
        """Parses multi-line raw text content"""
        transactions: List[Transaction] = []
        lines = content.splitlines()

        for idx, line in enumerate(lines):
            txn, err = cls.parse_line(line, idx)
            if txn:
                transactions.append(txn)
            elif err and "Empty" not in err:
                logger.debug(f"Line {idx + 1} skipped: {err}")

        logger.info(f"Successfully parsed {len(transactions)} transactions from text input")
        return transactions

    @classmethod
    def parse_file(cls, file_path: str | Path) -> List[Transaction]:
        """Reads and parses a statement file from disk"""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Statement file not found: {path}")

        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            return cls.parse_text(content)
        except UnicodeDecodeError:
            # Fallback for ISO-8859-1 or Windows-1252 encodings
            with open(path, "r", encoding="latin-1") as f:
                content = f.read()
            return cls.parse_text(content)
