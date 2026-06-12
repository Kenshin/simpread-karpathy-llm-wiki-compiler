#!/bin/bash
# RenderPeek 启动脚本
# 支持 macOS / Linux

cd "$(dirname "$0")"

PORT=${1:-9235}

echo "正在启动 RenderPeek 服务..."
echo "访问地址: http://localhost:${PORT}"
echo "按 Ctrl+C 停止"

node server.js "${PORT}"
