@echo off
title BISNESS FLY.AI - SYSTEM SHUTDOWN
color 0C

echo ===================================================
echo      BISNESS FLY.AI - KILLING NEURAL PROCESSES
echo ===================================================
echo.
echo Apagando todos los procesos de Node.js (Backend ^& Frontend)...
echo.

taskkill /F /IM node.exe

echo.
echo ===================================================
echo Todos los procesos del nucleo han sido terminados.
echo ===================================================
timeout /t 3 >nul
exit
