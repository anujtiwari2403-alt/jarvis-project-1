# =========================================================
# JARVIS NEXUS - Automated Windows Laptop Setup Script
# Run in PowerShell: .\setup.ps1
# =========================================================

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "   JARVIS NEXUS // WINDOWS SETUP AUTOMATION SYSTEM      " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# 1. Check Python installation
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python is not installed. Please download Python 3.10 or 3.11 from python.org" -ForegroundColor Red
    Exit 1
}

$pythonVersion = python --version
Write-Host "[OK] Detected: $pythonVersion" -ForegroundColor Green

# 2. Create Virtual Environment
$venvPath = ".\venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "[1/4] Creating Python virtual environment in .\venv..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "[OK] Virtual environment created." -ForegroundColor Green
} else {
    Write-Host "[1/4] Virtual environment already exists." -ForegroundColor Green
}

# 3. Upgrade pip and install requirements
Write-Host "[2/4] Activating venv and installing packages..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

# 4. Download OpenWakeWord pre-trained models
Write-Host "[3/4] Downloading OpenWakeWord models (includes 'hey_jarvis')..." -ForegroundColor Yellow
python -c "import openwakeword; openwakeword.utils.download_models()"

# 5. Run Backend Verification Tests
Write-Host "[4/4] Running automated safety and routing tests..." -ForegroundColor Yellow
pytest test_backend.py -v

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green
Write-Host " [SUCCESS] JARVIS NEXUS Setup Completed!                " -ForegroundColor Green
Write-Host " Start the backend: .\run.bat or python -m backend.main  " -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green
