"""
PyWebView Desktop API Bridge
Exposes Python methods directly to JavaScript in the React frontend
"""
import os
import json
from pathlib import Path
from typing import Dict, Any, Optional

try:
    import webview
except ImportError:
    webview = None

from ..services.tracker import ExpenseTrackerService
from ..services.file_service import FileExportService
from ..config.settings import (
    get_budget_limit,
    set_budget_limit,
    load_user_config,
    DEFAULT_TRANSACTION_FILE
)
from ..utils.logger import setup_logger

logger = setup_logger("DesktopBridge")


class DesktopAPI:
    """
    Desktop API exposed via window.pywebview.api in frontend.
    Only public methods (without leading underscores) are exposed to JS.
    """

    def __init__(self, window_getter=None):
        self._window_getter = window_getter
        self._service = ExpenseTrackerService()
        self._last_summary = None

    def _get_window(self):
        """Internal helper to get the active PyWebView window instance without exposing it to JS reflection"""
        if self._window_getter:
            return self._window_getter()
        if webview and webview.windows:
            return webview.windows[0]
        return None

    def get_config(self) -> Dict[str, Any]:
        """Returns application preferences & budget configuration"""
        try:
            cfg = load_user_config()
            return {"success": True, "config": cfg}
        except Exception as e:
            logger.error(f"Error loading config: {e}")
            return {"success": False, "error": str(e)}

    def update_budget(self, new_budget: float) -> Dict[str, Any]:
        """Updates and persists monthly budget limit"""
        try:
            budget = float(new_budget)
            if budget <= 0:
                return {"success": False, "error": "Budget limit must be greater than zero"}

            set_budget_limit(budget)
            self._service.set_budget(budget)

            # If we already have data loaded, re-calculate summary with new budget
            if self._last_summary and self._last_summary.transactions:
                self._last_summary = self._service.analyze_transactions(self._last_summary.transactions)
                return {
                    "success": True,
                    "budget": budget,
                    "summary": self._last_summary.to_dict()
                }

            return {"success": True, "budget": budget}
        except Exception as e:
            logger.error(f"Error updating budget: {e}")
            return {"success": False, "error": str(e)}

    def analyze_file(self, file_path: str) -> Dict[str, Any]:
        """Analyzes a statement file from given path"""
        try:
            logger.info(f"Analyzing statement file: {file_path}")
            summary = self._service.analyze_file(file_path)
            self._last_summary = summary
            return {"success": True, "data": summary.to_dict()}
        except Exception as e:
            logger.error(f"Error analyzing file {file_path}: {e}")
            return {"success": False, "error": str(e)}

    def analyze_raw_text(self, content: str) -> Dict[str, Any]:
        """Analyzes multi-line statement text dropped or pasted into the UI"""
        try:
            logger.info("Analyzing raw statement text")
            summary = self._service.analyze_raw_text(content)
            self._last_summary = summary
            return {"success": True, "data": summary.to_dict()}
        except Exception as e:
            logger.error(f"Error analyzing raw text: {e}")
            return {"success": False, "error": str(e)}

    def load_demo_data(self) -> Dict[str, Any]:
        """Loads sample statement data for quick preview"""
        try:
            logger.info("Loading demo transaction data")
            if DEFAULT_TRANSACTION_FILE.exists():
                summary = self._service.analyze_file(str(DEFAULT_TRANSACTION_FILE))
            else:
                # Built-in sample dataset fallback
                sample_text = (
                    "2026-08-01, Swiggy, 350\n"
                    "2026-08-02, Uber Ride, 180\n"
                    "2026-08-03, DMart Supermarket, 1450\n"
                    "2026-08-04, Zomato Food, 220\n"
                    "2026-08-05, Petrol Pump HPCL, 600\n"
                    "2026-08-06, Amazon Purchase, 999\n"
                    "2026-08-07, Canteen Snacks, 60\n"
                    "2026-08-08, Mobile Recharge Jio, 299\n"
                    "2026-08-10, Tea Stall, 40\n"
                    "2026-08-11, Flipkart Order, 1299\n"
                    "2026-08-12, Ola Mini Ride, 215\n"
                    "2026-08-13, Electricity Bill Bescom, 1850\n"
                    "2026-08-14, Restaurant Dinner, 850\n"
                    "2026-08-15, Broadband Wifi Bill Airtel, 799\n"
                    "2026-08-16, Metro Card Recharge, 500\n"
                    "2026-08-17, Myntra Fashion Shopping, 1750\n"
                    "2026-08-18, Rapido Bike Taxi, 75\n"
                    "2026-08-19, Swiggy Instamart, 420\n"
                    "2026-08-20, Cinema Movie Ticket, 350\n"
                    "2026-08-21, Petrol Pump BPCL, 750\n"
                    "2026-08-22, Pharmacy Medical Store, 240\n"
                    "2026-08-23, Zomato Delivery, 540\n"
                    "2026-08-24, Water Bill Payment, 310\n"
                    "2026-08-25, Gym Membership, 1200\n"
                )
                summary = self._service.analyze_raw_text(sample_text)

            self._last_summary = summary
            return {"success": True, "data": summary.to_dict()}
        except Exception as e:
            logger.error(f"Error loading demo data: {e}")
            return {"success": False, "error": str(e)}

    def open_file_dialog(self) -> Dict[str, Any]:
        """Triggers native OS file picker dialog"""
        win = self._get_window()
        if not win or not webview:
            return {"success": False, "error": "Native window dialog unavailable"}

        try:
            file_types = ("Text and CSV files (*.txt;*.csv)", "All files (*.*)")
            result = win.create_file_dialog(
                webview.OPEN_DIALOG,
                allow_multiple=False,
                file_types=file_types
            )

            if result and len(result) > 0:
                selected_path = result[0]
                return self.analyze_file(selected_path)
            return {"success": False, "cancelled": True}
        except Exception as e:
            logger.error(f"File dialog error: {e}")
            return {"success": False, "error": str(e)}

    def export_report(self, export_format: str = "csv") -> Dict[str, Any]:
        """Exports parsed data or summary to CSV/JSON via native Save dialog"""
        if not self._last_summary or not self._last_summary.transactions:
            return {"success": False, "error": "No transaction data to export"}

        win = self._get_window()
        if not win or not webview:
            return {"success": False, "error": "Native window dialog unavailable"}

        try:
            fmt = export_format.lower()
            if fmt == "csv":
                file_types = ("CSV files (*.csv)",)
                default_name = "phonepe_expense_report.csv"
            elif fmt == "json":
                file_types = ("JSON files (*.json)",)
                default_name = "phonepe_expense_summary.json"
            else:
                return {"success": False, "error": f"Unsupported format '{export_format}'"}

            save_path = win.create_file_dialog(
                webview.SAVE_DIALOG,
                save_filename=default_name,
                file_types=file_types
            )

            if not save_path:
                return {"success": False, "cancelled": True}

            if isinstance(save_path, (list, tuple)):
                save_path = save_path[0]

            if fmt == "csv":
                saved = FileExportService.export_csv(self._last_summary.transactions, save_path)
            else:
                saved = FileExportService.export_json(self._last_summary, save_path)

            return {"success": True, "path": saved}
        except Exception as e:
            logger.error(f"Export error: {e}")
            return {"success": False, "error": str(e)}
