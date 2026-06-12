@echo off
REM Usage:
REM   generate.bat -a
REM   generate.bat -m "霸王茶姬" "瑞幸"
setlocal
set "SCRIPT_DIR=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%generate.ps1" %*
