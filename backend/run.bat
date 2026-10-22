@echo off
title JARVIS NEXUS - Laptop Voice Service
echo ===================================================
echo   JARVIS NEXUS // Windows Local Voice Assistant
echo ===================================================
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
)
echo [STATUS] Starting FastAPI service on http://127.0.0.1:8000 ...
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
