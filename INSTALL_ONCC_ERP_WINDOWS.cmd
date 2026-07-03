@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows-app\install-oncc-erp-windows.ps1"
pause
