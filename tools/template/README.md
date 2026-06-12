# 🎨 排版系统

> **零依赖、屏幕优先的 Wiki 轻量排版方案。** 将 Wiki 条目、简报、搜索结果一键渲染为高质量 HTML 文件。

## 📝 支持方案

1️⃣ Lite：排版系统的默认模式，不依赖任何外部 skill，开箱即用，使用 `--lite` 标识。

2️⃣ Kami：内置 Kami 方案，直接使用 需安装 [Kami](https://github.com/tw93/kami) skill，使用 `--kami` 标识。

## 🌟 核心定位

| 维度 | `--lite`（默认） | `--kami` |
|------|-----------------|----------|
| 依赖 | 零依赖 | 需要安装 kami skill |
| 定位 | 屏幕优先 | 屏幕 + 打印 |
| 模板来源 | `tools/template/lite.html` | kami `assets/templates/` |
| 图表组件 | 自有 8 种 | kami 14 种 |
| 字体 | LXGW WenKai + Source Han Serif | TsangerJinKai02 |
| 暗色模式 | 支持 | 不支持 |
| PDF 输出 | 不支持 | 支持（WeasyPrint） |

## ✨ `--lite` 特点

- **零依赖开箱即用**：不需要安装任何 skill 或外部工具，生成自包含 HTML 文件，浏览器直接打开
- **暗色模式**：自动跟随系统偏好 + 手动 toggle 按钮，CSS 变量覆盖实现，kami 不支持
- **Mermaid 知识图谱**：默认 AI 将 Mermaid 转为内联 SVG（零 JS），图谱过于复杂（>20 节点）时自动降级为 CDN 渲染
- **8 种 SVG 图表组件**：Timeline / Bar / Donut / Line / Quadrant / Tree / Waterfall / Venn
- **LXGW WenKai 字体**：开源中文字体，屏幕可读性佳，CDN 异步加载不阻塞渲染
- **支持超长文档**：支持超长文档的读取和整理

## 🚀 触发方式

`--lite` / `--kami` 是跨环境通用修饰符，可附加在任何产出内容的命令之后：

```
/render 星巴克 --lite          ← 直接排版 wiki/星巴克.md
/report 星巴克 --lite          ← 生成简报后排版
/ask 星巴克相关问题 --lite      ← 生成回答后排版
查询关键词 星巴克 --lite        ← MCP 搜索后排版
```

| 入口命令 | 内容来源 | 输出文件名 |
|----------|----------|-----------|
| `/render {主题} --lite` | `wiki/{主题}.md` | `{主题}.html` |
| `/report {主题} --lite` | AI 基于 wiki/ 生成的简报 | `{主题}-简报.html` |
| `/ask {问题} --lite` | AI 基于 wiki/ 生成的回答 | `{主题}.html` |
| MCP 搜索 `--lite` | AI 搜索/生成的动态内容 | `{主题}-{关键词}.html` |

不指定 `--lite` 或 `--kami` 时，默认走 `--lite`。

---

## 🛠️ 参数一览

```
/render [主题] [--lite|--kami] [--mermaid] [--pdf] [--svg] [--type <类型>]
```

| 参数 | 说明 |
|------|------|
| `--lite` | 轻量排版（默认，与 `--kami` 互斥） |
| `--kami` | kami 专业排版（需安装 skill） |
| `--mermaid` | 仅 `--lite`：知识图谱使用 Mermaid CDN 渲染 |
| `--pdf` | 仅 `--kami`：同时生成 PDF（需 WeasyPrint） |
| `--svg` | 仅 `--kami`：Mermaid 转手绘 SVG |
| `--type <类型>` | 仅 `--kami`：覆盖文档类型（`long-doc` / `one-pager` / `equity-report` / `portfolio` / `slides` / `letter`） |

---

## 💡 示例

```
/render 星巴克
→ 读取 wiki/星巴克.md → 输出 outputs/星巴克.html（--kami 默认）

/render 星巴克 --lite
→ 读取 wiki/星巴克.md → 使用 tools/template/lite.html → 输出 outputs/星巴克.html

/render 霸王茶姬 --svg --pdf
→ 读取 wiki/霸王茶姬.md → Mermaid 转手绘 SVG + PDF

/report 星巴克 --lite
→ 生成简报 → 使用 tools/template/lite.html → 输出 outputs/星巴克-简报.html

查询关键词 星巴克 在此结果中找出与新任CEO相关的内容 --lite
→ MCP 搜索 → 结构化内容 → 输出 outputs/星巴克-新任CEO.html
```

输出完成后，若 `outputs/` 下已存在同名文件，会暂停并提供选项：覆盖 / 按模式命名 / 自定义文件名 / 取消。

---

## 📂 文件清单

| 文件 | 用途 |
|------|------|
| `lite.html` | 主模板：CSS + HTML 骨架 + 暗色模式 + TOC 逻辑 |
| `lite-diagrams.md` | 图表组件规范：8 种 SVG 模板 + 数据填充规则 |

## 🎯 内容编译规则

### 标题清洗

Wiki 文件名或 `#` 标题含标签前缀时自动清洗：

| 文件名 | 渲染标题 |
|--------|---------|
| `标签@观察_新消费_奢侈品` | 新消费观察：奢侈品市场深度分析 |
| `标签@科技史话_AI战争` | 科技史话：AI战争与人工智能发展 |
| `标签@观察_商业历史_外卖大战` | 商业历史：2025年中国外卖大战 |

### 内容模式

| Wiki 总行数 | 模式 | 说明 |
|-------------|------|------|
| ≤ 800 行 | 一比一模式 | 1:1 完整还原，禁止精简 |
| > 800 行 | 提炼模式 | 允许密度优化，核心内容（图谱/时间线/Sources）禁止精简 |

### 本地快照链接

Wiki 中的 `[本地快照](http://localhost:7026/reading/4873)` 渲染为纯数字 ID 链接：

```html
<a class="snapshot" href="http://localhost:7026/reading/4873" target="_blank" rel="noopener">4873</a>
```

- 链接文本仅保留快照 ID 数字
- 所有非锚点链接在 HTML 中直接写入 `target="_blank" rel="noopener"`
- TOC 的 `#` 锚点链接不开新标签

### Mermaid 知识图谱

| 模式 | 渲染方式 |
|------|----------|
| `--lite`（默认） | AI 将 Mermaid 转为内联 SVG（零 JS 依赖） |
| `--lite --mermaid` | 使用 Mermaid CDN 加载 |
| 节点 > 20 个 | 自动降级为 Mermaid CDN |

### ASCII Art 转换

Wiki 中的 ASCII art 图表（矩阵、关系图、树状结构等）会自动识别并转换为语义化输出，不直接保留 `<pre>` 原文。

| ASCII art 结构 | 转换目标 | 典型场景 |
|---------------|----------|----------|
| 矩阵/网格布局 | HTML `<table>` 或 Quadrant SVG | 核心玩家矩阵、阵营对比 |
| 框线+箭头关系图 | Tree SVG 或 Mermaid graph | 关键人物关系图 |
| 缩进树状结构（├── └──） | Tree SVG 或嵌套列表 | 产业链机会、层级架构 |
| 流程图（A → B → C） | Mermaid flowchart | 决策流程、演进路径 |

---

## 🎨 设计系统

### 字体

| 用途 | 字体栈 |
|------|--------|
| 正文 | LXGW WenKai → Source Han Serif SC → Songti SC → Georgia → serif |
| 标题 | Source Han Serif SC → LXGW WenKai → Songti SC → Georgia → serif |
| 代码 | JetBrains Mono → SF Mono → Consolas → LXGW WenKai → monospace |

- LXGW WenKai 通过 CDN 加载：`https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css`
- Source Han Serif SC 通过 Google Fonts CDN 加载
- 使用 `media="print" onload="this.media='all'"` 异步加载，避免阻塞渲染

### 排版参数

| 参数 | 值 | 说明 |
|------|-----|------|
| 行高 | 1.75 | 中文方块字符需要更宽松的行距 |
| 正文字号 | 15px | 屏幕阅读舒适区 |
| 正文字间距 | 0.05em | LXGW WenKai 结构紧凑，需要呼吸空间 |
| 标题字间距 | -0.02em | 标题适当收紧 |
| 最大宽度 | 780px | 居中显示 |

### 响应式

| 档位 | 宽度 | Metric Cards |
|------|------|-------------|
| 桌面 | > 880px | 4 列 |
| 平板 | 640–880px | 2 列 |
| 手机 | < 640px | 2 列 |

### 页面流

```
header → metric cards → TOC → 知识图谱 → 正文章节 → Sources → footer
```

---

## 🧩 组件

### Header

```
[eyebrow]  新消费观察 · 黄金专题          ← 可选，从文件名推导
[标题]     黄金
[副标题]   聚焦黄金作为货币、商品与投资品的多重属性...
[meta]     SimpRead KB · 2026-06-07 · 基于简悦稍后读快照编译
```

### Metric Cards

从 Wiki 正文"核心数据"表格自动提取 4 个关键指标。无数据则跳过。

### TOC（目录）

仅 h1 章节标题，`<a href="#id">` 锚点跳转，带编号竖排列表。

### 图表组件库

详见 `lite-diagrams.md`。独立于 kami，使用 `--lite` 自己的 CSS token，收录 8 种：

| 图表 | 数据特征 | 典型场景 |
|------|----------|----------|
| Timeline | 时间轴 + 里程碑 | 品牌发展历程、历史节点 |
| Bar Chart | 分类对比 | 营收对比、市场份额 |
| Donut Chart | 单系列占比 ≤6 项 | 营收结构、需求分布 |
| Line Chart | 多时间点趋势 | 金价走势、增长曲线 |
| Quadrant | 2×2 定位 | 品牌战略定位 |
| Tree | 层级关系 ≥2 层 | 组织架构、品牌体系 |
| Waterfall | 正负贡献求和 | 利润分解、收入桥 |
| Venn | 集合交集 2-3 组 | 用户重合度 |

---

## 🌙 暗色模式

- 自动跟随系统：`@media (prefers-color-scheme: dark)`
- 手动切换：页面右上角 toggle 按钮
- 实现方式：CSS 变量覆盖，不改变布局结构

### 颜色映射

| 浅色 token | 浅色值 | 暗色值 |
|------------|--------|--------|
| `--parchment` | `#FDF8F0` | `#1a1a1a` |
| `--surface` | `#FFFFFF` | `#242424` |
| `--ink` | `#1B365D` | `#6B9FD4` |
| `--text` | `#2C2C2C` | `#e0e0e0` |
| `--border` | `#D6CFC3` | `#3a3a3a` |
