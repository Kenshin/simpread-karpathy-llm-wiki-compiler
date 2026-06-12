# Changelog

## [3.0.0] - 2026-06-12

### 🎉 重大更新：知识可视化与专业排版

本版本引入 **GraphLens 知识图谱**和**专业排版系统**，让 Wiki 不仅能整理知识，更能以精美的方式呈现知识。

---

### ✨ 新增功能

#### 1. GraphLens：知识图谱自动生成

Wiki 页面自动生成 Mermaid 知识图谱，直观展示实体关系网络，一眼看清知识结构。

- **Mermaid 图谱**：自动从正文提取实体与关系，生成 `graph LR` 图谱
- **实体快照索引**：每个图谱实体都关联对应的本地快照，形成「图谱实体快照索引」表格，点击即可溯源
- **多图谱支持**：复杂主题可生成多个子图谱（如"塞北民族体系"、"西域民族体系"）
- **可视化入口**：置于头部摘要之后，作为 Wiki 可视化入口
- **一致性约束**：图谱内容必须与当前 Wiki 正文强相关，不得引入正文中未出现的实体或关系

详见 [graph/README.md](tools/graph/README.md)

#### 2. 排版系统：专业级 HTML 输出

内置两套排版方案，将 Markdown Wiki 转化为精美 HTML 文件，输出到 `outputs/` 目录。

**方案对比：**

| 维度 | `--lite`（默认） | `--kami` |
|------|-----------------|----------|
| 依赖 | 零依赖开箱即用 | 需安装 kami skill |
| 定位 | 屏幕优先 | 屏幕 + 打印 |
| 暗色模式 | ✅ 支持 | ❌ 不支持 |
| PDF 输出 | ❌ 不支持 | ✅ 支持（WeasyPrint） |
| 图表组件 | 8 种 SVG | 14 种 |
| 字体 | LXGW WenKai + Source Han Serif | TsangerJinKai02 |

**`--lite` 核心特点：**

- **零依赖**：生成自包含 HTML，浏览器直接打开
- **暗色模式**：自动跟随系统偏好 + 手动 toggle 按钮，CSS 变量覆盖实现
- **Mermaid 知识图谱**：AI 转内联 SVG（零 JS），复杂图谱（>20 节点）自动降级 CDN
- **8 种图表组件**：Timeline / Bar / Donut / Line / Quadrant / Tree / Waterfall / Venn
- **LXGW WenKai 字体**：开源中文字体，屏幕可读性佳，CDN 异步加载不阻塞渲染
- **响应式设计**：桌面/平板/手机三档适配
- **超长文档支持**：支持超长文档的读取和整理

**触发方式：**

```
/render 星巴克 --lite          ← 直接排版 wiki/星巴克.md
/report 星巴克 --lite          ← 生成简报后排版
/ask 星巴克相关问题 --lite      ← 生成回答后排版
查询关键词 星巴克 --lite        ← MCP 搜索后排版
```

不指定 `--lite` 或 `--kami` 时，默认走 `--lite`。

详见 [tools/template/README.md](tools/template/README.md)

#### 3. RenderPeek：HTML 渲染预览

轻量本地预览工具，用于即时查看排版系统输出的 HTML 文件效果。

- **即时预览**：下拉菜单选择 `outputs/` 中的 HTML 文件，iframe 内即时渲染
- **零配置**：无需安装 npm 依赖，Node.js 一条命令启动
- **暗色适配**：跟随系统主题自动切换
- **禁用缓存**：始终显示最新渲染结果

```bash
cd tools/render && ./start.sh    # 访问 http://localhost:9235
```

详见 [render/README.md](tools/render/README.md)

#### 4. index_map.txt 生成工具

新增独立的映射表生成脚本，无需依赖同步助手即可创建 `index_map.txt`。

- **自动扫描**：扫描 `raw/{主题}/` 目录下所有 `.md` 文件
- **快照提取**：自动提取 `[本地快照](http://localhost:7026/reading/xxx)` 中的 ID
- **URL 提取**：自动提取 `[原文地址](https://...)` 中的原文链接
- **标准格式**：生成 `@文件名:快照ID列表` 格式，与 2.0 映射表机制完全兼容

**使用方式：**

Node.js

```bash
node tools/indexes/generate.js -a
node tools/indexes/generate.js -m 霸王茶姬 瑞幸
```

Python

```bash
python3 tools/indexes/generate.py -a
python3 tools/indexes/generate.py -m 霸王茶姬 瑞幸
```

**使用场景：**
- 从其他来源导入 raw 文件，需要快速生成映射表
- 同步助手版本不支持自动生成 index_map.txt
- 需要重建或修复已有的 index_map.txt

详见 [indexes/README.md](tools/indexes/README.md)

---

### 🔧 改进优化

- **知识图谱协议**：Wiki 编写规范新增 GraphLens 章节，定义图谱生成规则和实体快照索引格式
- **排版命令**：`--lite` / `--kami` 成为跨环境通用修饰符，可附加在任何产出内容的命令之后
- **文档更新**：新增 graph/README.md、tools/template/README.md、indexes/README.md

---

### 📦 升级指南

1. 更新代码：`git pull origin main`
2. 重新加载协议：`/refresh`
3. 体验排版系统：`/render {主题} --lite`
4. （可选）生成 index_map.txt：`python3 tools/generate-index-map.py raw/`
5. （可选）批量修复 Sources：`/gen fix.md`

**Full Changelog**: https://github.com/Kenshin/simpread-karpathy-llm-wiki-compiler/compare/v2.0.0...v3.0.0

---

## [2.0.0] - 2026-05-27

### 🎉 重大更新：Token 消耗降低 5-10 倍

本版本引入 **index_map.txt 映射表机制**，实现增量感知，大幅减少不必要的文件读取，显著降低 Token 消耗。

---

### ✨ 新增功能

#### 1. index_map.txt 映射表机制

全新的文件映射系统，实现高效增量更新。仅需读取几行映射表即可判断文件变化，无需扫描所有 raw 文件。

`index_map.txt` 功能由 [同步助手 1.5.2+](https://simpread.pro/docs/#/Sync?id=%E4%B8%8B%E8%BD%BD) 提供。

**性能对比：**

| 场景 | 1.x 版本 | 2.0 版本 | 提升 |
|------|---------|---------|------|
| 变更检测 (10 个文件) | 读取 10,000 行 | 读取 10 行 | ~50x |
| 增量更新 | 全量对比 | 精准定位 | ~5-10x |
| Sources 维护 | 全量重建 | 自动对齐 | ~3x |

#### 2. 知识图谱（Knowledge Graph）

Wiki 页面新增知识图谱支持，自动生成 Mermaid 图谱，每个实体关联本地快照。

#### 3. Sources 映射表增强

Wiki 页面底部的 Sources 区块全面升级，采用结构化表格格式，与 index_map.txt 自动同步。

#### 4. fix.md - Sources 账本修复工具

新增专用修复工具，支持单主题修复 (`/gen fix.md {主题}`) 和批量修复 (`/gen fix.md`)。

#### 5. MCP 工具集成

全新 MCP (Model Context Protocol) 支持，实现实时内容检索。详见 [tools/README.md](tools/README.md)

#### 6. 跨环境命令解析协议

新增 Wiki 环境与 MCP 环境的无缝协作机制，支持 `~r` 缩写语法。

---

### 📦 升级指南

1. 更新代码：`git pull origin main`
2. 检查 index_map.txt（可选）
3. 修复 Sources 映射表：`/gen fix.md`
4. 重新加载协议：`/refresh`
5. 配置 MCP 工具（可选）：参考 [tools/README.md](tools/README.md#-安装配置)

**Full Changelog**: https://github.com/Kenshin/simpread-karpathy-llm-wiki-compiler/compare/v1.0.0...v2.0.0

---

## [1.0.0] - 2026-04-30

### 🎉 首次发布

基于 Andrej Karpathy LLM Wiki 理念构建的个人知识库自动化构建方案。

---

### ✨ 核心功能

- **Wiki 编译器**：将 raw/ 目录的碎片化素材编译为结构化 Wiki
- **双路径输入协议**：支持 index_map.txt 映射和原始扫描两种模式
- **原子化溯源**：每个知识点附带本地快照链接
- **Skills 系统**：init / add / update / audit 等技能
- **命令系统**：/ask / /report / /gen / /topic 等命令

详见 [README.md](README.md)
