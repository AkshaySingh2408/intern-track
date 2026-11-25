@echo off
title Launch InternTrack
echo ========================================================
echo   Launching InternTrack - Full-Stack Application
echo ========================================================
echo.
start "InternTrack Backend" "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
start "InternTrack Frontend" "%~dp0run_frontend.bat"
timeout /t 3 /nobreak >nul
echo.
echo Opening InternTrack in your default web browser...
start http://localhost:5173
echo.
echo ========================================================
echo  InternTrack is now running!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://localhost:8000
echo  - Interactive Swagger Docs: http://localhost:8000/docs
echo ========================================================
