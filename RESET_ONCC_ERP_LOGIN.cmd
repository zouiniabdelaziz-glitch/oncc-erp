@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows-app\reset-oncc-erp-login.ps1"
pause
