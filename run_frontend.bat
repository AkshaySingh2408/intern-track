@echo off
title InternTrack Frontend (React + Vite)
cd /d "%~dp0frontend"
echo ==============================================
echo   Starting InternTrack React Frontend
echo ==============================================
echo App: http://localhost:5173
echo.
if exist "%~dp0..\.tools\node\node.exe" (
    "%~dp0..\.tools\node\node.exe" "node_modules\vite\bin\vite.js" --host
) else if exist "%~dp0.tools\node\node.exe" (
    "%~dp0.tools\node\node.exe" "node_modules\vite\bin\vite.js" --host
) else (
    npm run dev
)
pause
