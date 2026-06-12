@echo off
REM 简悦 Andrej Karpathy LLM Wiki 知识图谱 Explorer 启动脚本
REM 支持 Windows

cd /d "%~dp0"

set PORT=%1
if "%PORT%"=="" set PORT=9234

echo 正在启动服务...
echo 访问地址: http://localhost:%PORT%
echo 按 Ctrl+C 停止

node server.js %PORT%
