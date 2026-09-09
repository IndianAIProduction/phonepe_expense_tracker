"""
PhonePe Expense Tracker Desktop Application Launcher
Uses lightweight local server for 100% reliable, deadlock-free Edge WebView2 rendering
"""
import sys
import os
import socket
import threading
import functools
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
import webview

# Ensure backend root is in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from app.api.bridge import DesktopAPI
from app.utils.logger import setup_logger

logger = setup_logger("DesktopMain")


def find_free_port() -> int:
    """Finds an available TCP port on localhost"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def start_local_static_server(dist_dir: Path, port: int):
    """Starts a lightweight static file server on 127.0.0.1 to avoid WebView2 file:// deadlocks"""
    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(dist_dir))
    server = HTTPServer(('127.0.0.1', port), handler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    return server


def main():
    logger.info("Initializing PhonePe Expense Tracker Desktop App...")

    dev_mode = "--dev" in sys.argv or os.environ.get("DESKTOP_DEV", "0") == "1"

    # Static assets paths (support both normal Python runtime and PyInstaller _MEIPASS)
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        base_dir = Path(sys._MEIPASS)
        dist_paths = [
            base_dir / "app" / "dist",
            base_dir / "dist",
            base_dir / "backend" / "app" / "dist",
            base_dir
        ]
    else:
        dist_paths = [
            CURRENT_DIR / "app" / "dist",
            PROJECT_ROOT / "frontend" / "dist",
            CURRENT_DIR / "dist"
        ]

    prod_dist = None
    for p in dist_paths:
        if (p / "index.html").exists():
            prod_dist = p
            break

    api = DesktopAPI()

    if dev_mode:
        entry_url = "http://localhost:5173"
        logger.info(f"Running in DEV mode with URL: {entry_url}")
    elif prod_dist:
        port = find_free_port()
        start_local_static_server(prod_dist, port)
        entry_url = f"http://127.0.0.1:{port}"
        logger.info(f"Running in PRODUCTION mode with local server: {entry_url}")
    else:
        entry_url = "http://localhost:5173"
        logger.warning("Production build not found in dist/. Defaulting to Vite dev server: http://localhost:5173")

    window = webview.create_window(
        title="PhonePe Expense Intelligence",
        url=entry_url,
        js_api=api,
        width=1240,
        height=840,
        min_size=(1024, 680),
        background_color="#0b0f19",
        text_select=True
    )

    webview.start(http_server=False, debug=dev_mode)


if __name__ == "__main__":
    main()
