# 🕸️ GraphLens：上下文与知识图谱可视化工具

> GraphLens 是简悦 Karpathy LLM Wiki 方案中的知识图谱可视化工具。它能将 Wiki 文件中 `## 知识图谱（Knowledge Graph）` 里编写的 Mermaid 图谱自动渲染为可交互的 WebGL 网络图，让你以「看图」的方式理解知识点之间的关系。

![image-20260528191559140](https://res.cloudinary.com/simpread/image/upload/v1779966962/config/fafc4e47c23a6d28d50bbfd3b8109e65.png)

## 👥 适合谁用

已经在使用 [简悦 Karpathy LLM Wiki 方案](https://github.com/Kenshin/simpread-karpathy-llm-wiki-compiler) 的用户。GraphLens 读取的是项目根目录下 `wiki/` 文件夹里编译好的 `.md` 文件。

## ✨ 它能做什么？

- **一键查看**：从下拉菜单选择任意 Wiki 文件，自动提取其中的知识图谱并渲染

- **关系洞察**：不同类型的实体（人物、组织、事件）用不同颜色区分，一眼看出知识结构

- **快照直达**：点击任意节点或链接，直接打开对应的简悦本地快照原文

- **Peek 模式**：类似 Notion 的侧边预览，不离开当前页面即可阅读原始来源

- **多图谱支持**：一个 Wiki 文件中包含多个图谱时，可分别查看或合并展示

- **拖拽布局**：左右分栏宽度可自由拖拽调整

## 🚀 如何使用

### 🖥️ 独立使用方案

| 项目 | 要求 |
|------|------|
| Node.js | 任意活跃 LTS 版本即可（如 18、20） |
| 浏览器 | 支持 WebGL 的现代浏览器（Chrome / Edge / Firefox / Safari） |

不需要安装任何 npm 依赖，所有前端库都已内置在 `lib/` 目录中。

```bash
# macOS / Linux
cd tools/graph
./start.sh

# Windows
cd tools\graph
start.bat

# 指定端口（默认 9234）
./start.sh 8080
```

启动后在浏览器打开 `http://localhost:9234` 即可。

### 🔗 简悦用户

确保使用 [同步助手 1.5.3](https://simpread.pro/docs/#/Sync?id=下载)，直接在浏览器中打开 [http://localhost:7026/rag/wiki/index/](http://localhost:7026/rag/wiki/index/) 查看。

## 🖼️ 界面概览

页面分为左右两栏：

**左侧** — Wiki 文件选择器 + 文件内容的 Markdown 预览（含 Mermaid 原图）

<img src="https://res.cloudinary.com/simpread/image/upload/v1780636594/config/c168a75a65834c4b39aecb06d4f35442.png" height="500">

**右侧** — WebGL 知识图谱（Sigma.js 渲染）

![image-20260605131657941](https://res.cloudinary.com/simpread/image/upload/v1780636620/config/26267687865345f67b7ebf4d32be3d5c.png)

**中间** - 分隔条可以左右拖拽，调整两侧宽度。

![image-20260605132242290](https://res.cloudinary.com/simpread/image/upload/v1780636965/config/ac2dfc243e1601bac159b5102afa901c.png)

## 🎯 核心操作

### 🗂️ 选择图谱

1. 点击顶部下拉框，会自动列出 `wiki/` 中所有包含知识图谱的文件。
2. 如果某个 Wiki 文件内写了多组 `## 知识图谱（Knowledge Graph）`，下拉框会把它们拆成子项，方便单独查看。
3. 选择某项后，左侧 Markdown 预览和右侧图谱同时更新。

**ALL 选项：**

| 选项 | 含义 |
|------|------|
| `ALL（全部知识图谱）` | 合并所有文件的知识图谱，一次性查看全貌 |
| `文件名 → ALL` | 合并某个文件内的全部图谱 |
| `文件名 → 图谱名` | 仅查看指定的一个图谱 |

### 🔍 浏览图谱

| 操作 | 说明 |
|------|------|
| 拖拽空白处 | 平移画布 |
| 滚轮 / 双指缩放 | 缩放画布 |
| 鼠标悬停节点 | 高亮该节点及其邻居，其余节点变淡 |
| 点击节点 | 锁定选中，右上角出现节点信息面板 |
| 右下角 `+` / `−` / `⊡` 按钮 | 放大 / 缩小 / 适配画布 |

### 📌 查看节点详情

点击任意节点后，右上角弹出信息面板，显示：

- **节点名称** — 实体名
- **类型** — 实体分类（如有）
- **快照链接** — 对应的简悦本地快照地址

点击快照链接会以 **Peek 模式**（类似 Notion 的侧边预览）在左侧打开本地快照原文，无需离开当前页面。

### 👁️ Peek 模式

Peek 面板有两种触发方式：

**点击节点信息面板中的快照链接** — 在左侧（编辑区位置）弹出 Peek

![image-20260605131741415](https://res.cloudinary.com/simpread/image/upload/v1780636669/config/bebfab4c87fe0173ecbeaab1281d0ee6.png)

**点击 Markdown 预览中的快照链接** — 在右侧（图谱区位置）弹出 Peek

![image-20260605131836579](https://res.cloudinary.com/simpread/image/upload/v1780636719/config/eab8a1704a45fd05ffcdee4aa1311de1.png)

Peek 工具栏右上角有展开按钮，可在新标签页中完整打开快照。

## 📝 图谱输入格式

GraphLens 要求 Wiki 文件中包含特定格式的知识图谱区块：

````markdown
## 知识图谱（Knowledge Graph）

```mermaid
graph LR
    classDef org fill:#B594FF,stroke:#333,color:#fff;
    A["节点A"] -->|关系| B["节点B"]
    class A org;
```

**图谱实体快照索引**

| 实体 | 角色 | 关键快照 |
|------|------|---------|
| 节点A | 角色说明 | [123](http://localhost:7026/reading/123) |
````

格式要点：

- `## 知识图谱（Knowledge Graph）` 是区块的识别标志，标题后可加自定义名称（用冒号或空格分隔）
- ` ```mermaid ` 代码块内写 Mermaid 流程图语法，支持 `graph LR`、`graph TB` 等
- 节点标签中可用 `\n` 或 `<br>` 实现多行显示（如英文名和中文名分两行）
- `**图谱实体快照索引`** 表格将实体名称与简悦本地快照链接关联起来，实现点击跳转
- 一个文件内可以有多个 `## 知识图谱（Knowledge Graph）` 区块，GraphLens 会分别识别

上述结构已内置到 `skills/` 确保 **简悦 Andrej Karpathy LLM Wiki 方案** 版本为 2.1 版即可。

如已在 `wiki/` 存在文件，但并不没有上述格式，请通过 [此方案](/README.md#-如何升级) 自动升级。

## ❓ 常见问题

**Q: 打开页面后下拉框为空？**

确认 `wiki/` 目录存在且里面包含 `## 知识图谱（Knowledge Graph）` 的 `.md` 文件。GraphLens 只列出含图谱的文件。

**Q: 点击快照链接没有反应？**

Peek 模式需要简悦本地服务在 `localhost:7026` 运行。如果你没有使用简悦，快照链接将无法加载。这是正常的——图谱本身的渲染不依赖简悦。

**Q: 图谱渲染很慢？**

首次渲染时 ForceAtlas2 布局算法会运行约 200 次迭代。同一份数据再次切换时会跳过布局（坐标有缓存），速度会快很多。节点特别多（100+）时初次渲染可能需要几秒。

**Q: 想查看暗色模式效果？**

GraphLens 跟随系统主题自动切换。将系统设置为深色模式即可看到暗色界面。

## 🔗 相关链接

- [Wiki 方案主文档](https://github.com/Kenshin/simpread-karpathy-llm-wiki-compiler)
- [简悦官网](https://simpread.pro)