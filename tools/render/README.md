# 👁️ RenderPeek：HTML 渲染产物预览工具

> RenderPeek 是简悦 Karpathy LLM Wiki 方案中的 HTML 预览工具。它能将 `/render` 流程生成的 HTML 文件在本地浏览器中即时预览，让你快速检查排版效果而无需手动打开文件。

![](https://res.cloudinary.com/simpread/image/upload/v1781162914/config/74be15dc8ce217077dea3b642c30cf1a.png)

## 👥 适合谁用

已经在使用 [简悦 Karpathy LLM Wiki 方案](https://github.com/Kenshin/simpread-karpathy-llm-wiki-compiler) 的用户。RenderPeek 读取的是项目根目录下 `outputs/` 文件夹里编译好的 `.html` 文件。

## 🚀 如何使用

### 🖥️ 独立使用方案

| 项目 | 要求 |
|------|------|
| Node.js | 任意活跃 LTS 版本即可（如 18、20） |
| 浏览器 | 任何现代浏览器（Chrome / Edge / Firefox / Safari） |

不需要安装任何 npm 依赖。

```bash
# macOS / Linux
cd tools/render
./start.sh

# Windows
cd tools\render
start.bat

# 指定端口（默认 9235）
./start.sh 8080
```

启动后在浏览器打开 `http://localhost:9235` 即可。

## 🖼️ 界面概览

页面分为两部分：

**顶部** — 浮动控制面板（半透明，hover 时显现）

- 下拉菜单列出 `outputs/` 目录下所有 `.html` 文件
- 右侧显示可用文件数量

**主区域** — iframe 预览区

- 选择文件后，完整渲染该 HTML 页面
- 未选择文件时显示空状态提示

控制面板默认低透明度（18%），不遮挡预览内容；鼠标移入时完全显现。

## 🎯 核心操作

### 📂 选择文件

1. 点击左上角下拉框，自动列出 `outputs/` 中的所有 HTML 文件（按中文排序）
2. 选择某项后，主区域 iframe 立即加载对应文件
3. 切换其他文件时实时刷新预览

### 🔄 典型工作流

```
使用 /render [主题] 生成 HTML
         ↓
  HTML 输出到 outputs/ 目录
         ↓
  启动 RenderPeek (start.sh)
         ↓
  浏览器选择文件、检查排版效果
         ↓
  如需修改 → 重新 /render → 刷新预览
```

## 📁 文件结构

```
tools/render/
├── index.html    — 前端预览界面（控制面板 + iframe）
├── server.js     — Node.js HTTP 服务器（API + 静态文件）
├── start.sh      — macOS / Linux 启动脚本
├── start.bat     — Windows 启动脚本
└── publish.sh    — 发布脚本（同步到外部项目仓库）
```

## ❓ 常见问题

**Q: 打开页面后下拉框显示"无可用文件"？**

确认 `outputs/` 目录存在且里面包含 `.html` 文件。RenderPeek 只列出 HTML 文件。如果还没有生成过，请使用 `/render [主题]` 先生成一份。

**Q: 预览内容没有更新？**

RenderPeek 已禁用浏览器缓存，但如果你使用了浏览器扩展的强缓存策略，可以尝试硬刷新（Cmd+Shift+R / Ctrl+Shift+R）。更换下拉选项再切回来也可触发重新加载。

**Q: 端口 9235 被占用？**

启动时指定其他端口即可：`./start.sh 8080`。

**Q: 想查看暗色模式效果？**

RenderPeek 跟随系统主题自动切换。将系统设置为深色模式即可看到暗色界面。

## 🔗 相关链接

- [Wiki 方案主文档](https://github.com/Kenshin/simpread-karpathy-llm-wiki-compiler)
- [简悦官网](https://simpread.pro)
