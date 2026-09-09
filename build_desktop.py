"""
PhonePe Expense Tracker — Master Desktop Automation Tool
Handles Building, Running, and Packaging the Desktop Application
"""
import os
import sys
import subprocess
from pathlib import Path

# Fix Windows console UTF-8 output
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT_DIR / "frontend"
BACKEND_DIR = ROOT_DIR / "backend"
DIST_DIR = ROOT_DIR / "dist"


def get_python_exe() -> str:
    """Finds the virtualenv Python or falls back to sys.executable"""
    venv_python_win = ROOT_DIR / ".venv" / "Scripts" / "python.exe"
    venv_python_nix = ROOT_DIR / ".venv" / "bin" / "python"
    
    if venv_python_win.exists():
        return str(venv_python_win)
    elif venv_python_nix.exists():
        return str(venv_python_nix)
    return sys.executable


def build_frontend():
    print("\n=======================================================")
    print(" 🚀 [1/2] Building Optimized React Frontend Bundle...")
    print("=======================================================\n")
    subprocess.run(["npm", "run", "build"], cwd=FRONTEND_DIR, shell=True, check=True)
    print("\n✅ Frontend compiled to backend/app/dist")


def run_desktop(dev_mode: bool = False):
    python_exe = get_python_exe()
    print(f"\n🚀 [2/2] Launching PhonePe Expense Intelligence Desktop App...")
    cmd = [python_exe, "backend/desktop_main.py"]
    if dev_mode:
        cmd.append("--dev")
    subprocess.run(cmd, cwd=ROOT_DIR, check=True)


def package_standalone_exe():
    """Builds frontend and packages into a single standalone .exe with PyInstaller"""
    build_frontend()
    
    python_exe = get_python_exe()
    sep = ";" if sys.platform == "win32" else ":"
    
    dist_data = f"{BACKEND_DIR / 'app' / 'dist'}{sep}app/dist"
    sample_data = f"{ROOT_DIR / 'data' / 'transactions.txt'}{sep}data"
    ico_path = FRONTEND_DIR / "src" / "assets" / "phonepe.ico"
    
    print("\n=======================================================")
    print(" 📦 [2/2] Packaging into Single Standalone .exe...")
    print("=======================================================\n")
    
    cmd = [
        python_exe, "-m", "PyInstaller",
        "--noconfirm",
        "--onefile",
        "--windowed",
        "--name", "PhonePeExpenseTracker",
        "--icon", str(ico_path),
        "--add-data", dist_data,
        "--add-data", sample_data,
        "--hidden-import", "webview",
        "--hidden-import", "webview.platforms.winforms",
        "--hidden-import", "webview.platforms.edgechromium",
        "--hidden-import", "clr",
        "--hidden-import", "pythonnet",
        "--clean",
        str(BACKEND_DIR / "desktop_main.py")
    ]
    
    subprocess.run(cmd, cwd=ROOT_DIR, check=True)
    
    output_exe = DIST_DIR / "PhonePeExpenseTracker.exe"
    if output_exe.exists():
        size_mb = output_exe.stat().st_size / (1024 * 1024)
        print("\n" + "=" * 60)
        print(" 🎉 SINGLE EXECUTABLE CREATED SUCCESSFULLY!")
        print("=" * 60)
        print(f"📁 Location : {output_exe}")
        print(f"⚖️ File Size: {size_mb:.2f} MB")
        print("✨ You can now share this single .exe file with anyone!")
        print("=" * 60 + "\n")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="PhonePe Expense Tracker Desktop Automation Tool")
    parser.add_argument("--package", action="store_true", help="Package single standalone .exe via PyInstaller")
    parser.add_argument("--dev", action="store_true", help="Run desktop against Vite dev server with hot reload")
    parser.add_argument("--build-only", action="store_true", help="Only compile React frontend without running")
    args = parser.parse_args()

    if args.package:
        package_standalone_exe()
    elif args.dev:
        run_desktop(dev_mode=True)
    elif args.build_only:
        build_frontend()
    else:
        build_frontend()
        run_desktop(dev_mode=False)
