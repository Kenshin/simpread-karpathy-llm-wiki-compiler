#!/bin/bash
# 简悦 Andrej Karpathy LLM Wiki 知识图谱 Explorer 启动脚本
# 支持 macOS / Linux

cd "$(dirname "$0")"

PORT=${1:-9234}

echo "正在启动服务..."
echo "访问地址: http://localhost:${PORT}"
echo "按 Ctrl+C 停止"

node server.js "${PORT}"
