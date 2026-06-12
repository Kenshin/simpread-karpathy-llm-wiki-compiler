@echo off
REM RenderPeek 启动脚本
REM 支持 Windows

cd /d "%~dp0"

set PORT=%1
if "%PORT%"=="" set PORT=9235

echo 正在启动 RenderPeek 服务...
echo 访问地址: http://localhost:%PORT%
echo 按 Ctrl+C 停止

node server.js %PORT%
