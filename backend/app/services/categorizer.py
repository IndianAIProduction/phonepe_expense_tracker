"""
Smart merchant categorizer with color assignments for frontend visualization
"""
from typing import Dict, List, Tuple

CATEGORY_MAP: Dict[str, List[str]] = {
    "Food": [
        "swiggy", "zomato", "canteen", "tea", "restaurant", "cafe", "coffee",
        "starbucks", "mcdonalds", "kfc", "burger", "pizza", "dominos", "bakery",
        "instamart", "blinkit", "zepto", "dhaba", "dinner", "lunch", "breakfast"
    ],
    "Travel": [
        "ola", "uber", "rapido", "metro", "petrol", "diesel", "fuel", "hpcl",
        "bpcl", "iocl", "shell", "flight", "indigo", "irctc", "railway",
        "redbus", "bus", "taxi", "toll", "fastag", "parking", "auto"
    ],
    "Shopping": [
        "dmart", "amazon", "flipkart", "myntra", "ajio", "reliancedigital",
        "croma", "zara", "h&m", "retail", "store", "mall", "market", "clothing",
        "fashion", "electronics", "supermarket", "grocery"
    ],
    "Bills": [
        "recharge", "electricity", "bescom", "tneb", "mseb", "wifi", "airtel",
        "jio", "vi", "vodafone", "broadband", "ticket", "bill", "gas", "cylinder",
        "water", "dth", "tata play", "dish tv", "insurance", "lic", "loan", "emi",
        "rent", "maintenance", "cinema", "movie", "bookmyshow", "netflix", "spotify"
    ],
    "Health": [
        "pharmacy", "medical", "apollo", "1mg", "pharmeasy", "gym", "fitness",
        "cult", "hospital", "clinic", "doctor", "lab", "diagnostics", "dental",
        "opticals", "lenskart", "medicine"
    ]
}

CATEGORY_COLORS: Dict[str, str] = {
    "Food": "#10b981",       # Emerald
    "Travel": "#f59e0b",     # Amber
    "Shopping": "#8b5cf6",   # Purple
    "Bills": "#3b82f6",      # Blue
    "Health": "#ef4444",     # Rose / Red
    "Other": "#64748b"       # Slate
}

def get_category(merchant_name: str) -> str:
    """Classifies merchant into predefined category"""
    merchant_clean = merchant_name.lower().strip()

    for category, keywords in CATEGORY_MAP.items():
        for keyword in keywords:
            if keyword in merchant_clean:
                return category

    return "Other"

def get_category_color(category: str) -> str:
    """Returns the visual theme color for a category"""
    return CATEGORY_COLORS.get(category, CATEGORY_COLORS["Other"])
