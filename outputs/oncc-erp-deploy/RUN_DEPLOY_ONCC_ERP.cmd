@echo off
set SCRIPT_DIR=%~dp0
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%deploy_to_real_oncc_repo.ps1"
echo.
echo Fertig. Falls oben ein Fehler steht, bitte nicht schliessen und Codex Bescheid sagen.
pause
