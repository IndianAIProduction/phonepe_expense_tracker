"""
Configuration management with JSON persistence and environment variable support
"""
import os
import sys
import json
from pathlib import Path
from typing import Dict, Any

# Root paths
if getattr(sys, 'frozen', False):
    PROJECT_ROOT = Path(sys.executable).resolve().parent
    DATA_DIR = Path(os.getenv("LOCALAPPDATA", str(PROJECT_ROOT))) / "PhonePeExpenseTracker"
    LOGS_DIR = DATA_DIR / "logs"
else:
    BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
    PROJECT_ROOT = BACKEND_DIR.parent
    DATA_DIR = PROJECT_ROOT / "data"
    LOGS_DIR = PROJECT_ROOT / "logs"

CONFIG_FILE = DATA_DIR / "user_config.json"
DEFAULT_TRANSACTION_FILE = DATA_DIR / "transactions.txt"

try:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
except Exception:
    pass

# Default configuration
DEFAULT_CONFIG: Dict[str, Any] = {
    "budget_limit": 10000.0,
    "currency_symbol": "₹",
    "theme": "dark"
}

def load_user_config() -> Dict[str, Any]:
    """Load configuration from JSON file or create defaults"""
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return {**DEFAULT_CONFIG, **data}
        except Exception:
            pass
    
    save_user_config(DEFAULT_CONFIG)
    return DEFAULT_CONFIG.copy()

def save_user_config(config: Dict[str, Any]) -> None:
    """Save configuration to JSON file"""
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=2)
    except Exception as e:
        print(f"Error saving user config: {e}")

def get_budget_limit() -> float:
    """Get the current budget limit"""
    config = load_user_config()
    return float(config.get("budget_limit", 10000.0))

def set_budget_limit(new_limit: float) -> float:
    """Update and persist budget limit"""
    config = load_user_config()
    config["budget_limit"] = float(new_limit)
    save_user_config(config)
    return config["budget_limit"]
