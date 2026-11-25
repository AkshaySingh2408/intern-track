@echo off
title InternTrack Backend API
cd /d "%~dp0backend"
echo ==============================================
echo   Starting InternTrack FastAPI Backend Server
echo ==============================================
echo API: http://localhost:8000
echo Swagger Docs: http://localhost:8000/docs
echo.
if exist "%~dp0..\.tools\python\python.exe" (
    "%~dp0..\.tools\python\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else if exist "%~dp0.tools\python\python.exe" (
    "%~dp0.tools\python\python.exe" -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) else (
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
)
pause
