@echo off
if "%~1"=="stealth" goto :stealth_launch

title BISNESS FLY.AI - SYSTEM ORCHESTRATOR
color 0A

echo.
echo ===================================================
echo      BISNESS FLY.AI - NEURAL SWARM INITIALIZING
echo ===================================================
echo.
echo Preparando inyeccion de nucleos en MODO OCULTO (Stealth)...
echo Las consolas de procesos funcionaran en el background invisiblemente.
echo.

:: Launch the stealth sequence silently
powershell -WindowStyle Hidden -Command "Start-Process cmd -ArgumentList '/c \"\"%~dp0start.bat\"\" stealth' -WindowStyle Hidden"

echo DUAL-CORE INITIATION COMPLETE.
echo Abriendo Dashboard Tactico en 5 segundos...
timeout /t 5 >nul
start http://localhost:3000
exit

:stealth_launch
:: Stealth execution of servers
cd /d "%~dp0"
start /B "" npm run start:dev

cd /d "%~dp0frontend"
start /B "" npm run dev
exit
