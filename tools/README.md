# 🔧 SimpRead MCP & Skills 工具使用指南

> **通过 MCP 协议直接查询简悦本地快照，实现高效的知识检索与内容综合。**

[![SimpRead](https://img.shields.io/badge/Made%20for-SimpRead-blue)](https://simpread.pro/)
[![MCP](https://img.shields.io/badge/Protocol-MCP-green)](https://modelcontextprotocol.io/)

![](https://res.cloudinary.com/simpread/image/upload/v1779179008/config/64a69521cfb0035d8da85fed1c606da3.png)

## 📖 概述

`simpread-mcp-helper` 是一个专为简悦（SimpRead）用户设计的 MCP & Skill 工具集，它允许 AI 通过 Model Context Protocol 直接访问和查询你的简悦本地快照库，同时辅以 Skill 规则可以让查询更加的语义化和智能化。

相比传统的文件扫描方式，这套工具提供了**更精准、更高效**的内容检索能力，特别适合处理**大量已收藏的阅读材料**。

## 📝 使用前提

1️⃣ 此项目是基于 [MCP (Model Context Protocol)](https://www.claudemcp.com/) 开发的，需要在你的系统中安装 Node.js 环境。

2️⃣ 因为需要获取你本地的 `simpread_config.json` 文件，因此需要安装并配置同步助手，而同步助手则是高级账户功能，如有需要 [请升级](https://simpread.pro/price)

3️⃣ 需要配置同步助手的 **自动同步** 与 **本地快照** 功能，如有需要 [请看此教程](https://www.yuque.com/kenshin/simpread/wkswh7)

4️⃣ 用户需要熟悉 AI 工具中的 MCP 和 Skill 安装和使用方式，如何安装可以参考 [安装配置](#-安装配置)

## 🎯 核心能力

### 1️⃣ 智能搜索

通过关键词、标签或内容全文搜索你的简悦未读/已读列表。

### 2️⃣ 时间窗口过滤

按日期范围（今天、昨天、本周、最近7天、最近30天）快速筛选内容。

### 3️⃣ 快照直达

直接获取本地快照内容（`http://localhost:7026/reading/{id}`），无需手动查找文件。

### 4️⃣ 内容综合

将搜索结果转化为结构化的阅读回顾、主题简报、时间线或比较摘要。

### 5️⃣ 支持简悦 Andrej Karpathy LLM Wiki 方案

完美结合 [简悦 Andrej Karpathy LLM Wiki 方案](https://github.com/Kenshin/simpread-karpathy-llm-wiki-compiler) 实现更高级的知识检索与内容综合。

📚 简悦 LLM Wiki 负责 Wiki 的生成，负责深度功能。

🔎 简悦 MCP 负责检索 `simpread_config.json` 中的稍后读，实现更实时的内容简报，负责精准度功能。

## 📚 使用场景与工作流

### 📖 帮助

输入 `简悦阅读助手帮助` 可以得到这个工具的使用帮助。

### 参数说明

`~r`：此参数后可将本地快照转换为原文链接，手机端（Happy）或微信端使用时无法访问本地快照时使用。

`简报`： 当用户提到此 `简报`, `生成简报`, or `输出简报` 时会调用系统默认的简报模板，生成包含 `核心架构图`, `关键演进/事实表`, `深度逻辑拆解`, `简报总结与行动建议` 的完整简报结构输出。

`--kami`：跨环境通用排版修饰符。追加在任何命令末尾，将输出内容通过 kami 长文档模板排版为专业 HTML 文件，保存至 `outputs/` 目录。需要安装 kami 技能。与 `~r` 可同时使用（先替换链接，再排版输出）。

`--lite`：跨环境通用排版修饰符（默认）。追加在任何命令末尾，将输出内容通过轻量模板排版为 HTML 文件，零依赖开箱即用，保存至 `outputs/` 目录。支持暗色模式，快照链接显示为纯数字 ID。与 `~r` 可同时使用。不指定 `--lite` 或 `--kami` 时默认走 `--lite`。

### 📅 日期筛选类

#### `get_daily` - 按日期获取未读内容

按时间范围获取简悦未读列表，支持：

- `today` - 今天
- `yesterday` - 昨天
- `daily` - 今日（含昨天）
- `week` - 本周
- `last7` - 最近7天
- `last30` - 最近30天

**示例：**
```
今日阅读回顾
→ get_daily(type="today") 以简报形式返回今日阅读内容

今日阅读回顾 ~r
→ get_daily(type="today") 以简报 + 原文链接形式返回今日阅读内容

获取最近一周的未读文章
→ get_daily(type="last7") 以简报形式返回最近一周的阅读回顾
```

### 🔍 内容搜索类

#### `search_content` - 全文搜索

按任意关键词搜索简悦内容的标题和正文。

**示例：**
```
请查询关键词 OpenAI
→ search_content(str="OpenAI") 以简报形式返回 OpenAI 相关的内容

查询 Anthropic 仅返回列表 ~r
→ search_content(str="Anthropic") 以列表 + 原文链接形式返回 Anthropic 相关的内容

查询关键词 openai 在此结果检索 马斯克 内容，并生成简报 ~r
→ search_content(str="openai") 在检索结果中继续检索关键词 `马斯克` 以简报 + 原文链接形式返回马斯克相关内容的简报
```

#### `search_tag` - 标签搜索

按简悦标签筛选内容。

**示例：**
```
获取标签为 AI 的文章，并生成简报
→ search_tag(tag="AI") 以简报形式返回 AI 相关的内容

查找"科技史话"标签下的内容 ~r
→ search_tag(tag="科技史话") 以简报 + 原文链接形式返回科技史话相关的内容。
```

## 💡 高级技巧

### 🔗 结合【简悦 Andrej Karpathy LLM Wiki】方案

MCP 工具可以与 [简悦 Andrej Karpathy LLM Wiki 方案](https://github.com/Kenshin/simpread-karpathy-llm-wiki-compiler) 无缝结合：

```
请查询关键词 OpenAI 在此结果中查询与 马斯克 的相关内容，并生成简报 -m ~r
```

**解析：**
- 在稍后读中搜索 "OpenAI"（MCP 环境，检索 `simpread_config.json` 中的稍后读）
- 在结果中筛选 "马斯克" 相关内容（MCP 环境）
- 使用 `-m` 参数（Wiki 环境，使用 Mermaid 方案生成图表报告）
- 使用 `~r` 将本地快照链接转换为原始 URL（MCP 环境）

### 🎨 结合 Kami 排版输出

[Kami](https://kami.tw93.fun/index-zh.html) 是一套适合 AI 时代的排版设计系统，可将 Markdown 转换为专业级 HTML 文件。

使用 `--kami` 修饰符可将 MCP 检索结果直接排版为专业 HTML 文件：

```
查询关键词 星巴克 在此结果中找出与新任CEO相关内容 --kami
→ MCP 检索 + kami 排版 → outputs/星巴克-新任CEO.html

/render 星巴克
→ Wiki 条目 星巴克.md 排版为专业 HTML 文件（outputs/星巴克.html）

查询标签 AI战争 并生成简报 -r --kami
→ 标签检索 + 原文链接替换 + kami 排版 → outputs/AI战争.html
```

**解析：**
- `--kami` 是跨环境通用修饰符，不需要 `::mcp:` 前缀
- 若同时使用 `-r` 和 `--kami`，先执行链接替换，再执行排版
- 需要安装 kami 技能，否则会提示安装

详见 [tools/template/README.md](/tools/template/README.md)

### 🪶 结合 Lite 轻量排版输出

`--lite` 是默认排版方案，零依赖开箱即用。使用 `tools/template/lite.html` 模板，生成自包含 HTML 文件，支持暗色模式，默认 Mermaid 转手绘 SVG 方案，支持八种 SVG 图表组件。

```
查询关键词 星巴克 在此结果中找出与新任CEO相关内容 --lite
→ MCP 检索 + lite 排版 → outputs/星巴克-新任CEO.html

/render 星巴克 --lite
→ Wiki 条目排版为轻量 HTML 文件（outputs/星巴克.html）

查询标签 AI战争 并生成简报 -r --lite
→ 标签检索 + 原文链接替换 + lite 排版 → outputs/AI战争.html

今日阅读回顾 --lite
→ 阅读回顾 + lite 排版 → outputs/今日阅读回顾.html
```

**解析：**
- `--lite` 是跨环境通用修饰符，不需要 `::mcp:` 前缀
- 零依赖，不需要安装任何额外 skill
- 若同时使用 `-r` 和 `--lite`，先执行链接替换，再执行排版
- 不指定 `--lite` 或 `--kami` 时，默认走 `--lite`

详见 [tools/template/README.md](/tools/template/README.md)

### 🧷 定制环境变量

`PROMPT`：内置 `omni` 关键词，可生成更加专业的阅读回顾或主题简报，同时也支持自定义提示词。

`MIN_PAGING`：最小分页数，默认值为 30，不建议修改，当检索的结果数量超过 30 时会自动分页，为避免 LLM 偷懒不完整读取全部检索结果。

`STEP`：每页的稍后读数量，默认值为 20，不建议修改。

## 🔍 常见问题

### Q: 为什么搜索结果为空？

**A:** 检查以下几点：
1. [简悦同步助手](https://simpread.pro/docs/#/Sync) 是否正在运行
2. [本地知识库](https://www.yuque.com/kenshin/simpread/wkswh7) 是否已正确配置
3. 搜索的关键词是否存在于 `simpread_config.json` 中

### Q: 快照链接无法访问？

**A:** 确保：
1. 简悦本地服务运行中（`http://localhost:7026`）
2. 快照 ID 是否正确
3. 对应的文章是否已保存本地快照

### Q: 如何提高搜索精度？

**A:** 建议：
1. 使用标签搜索代替全文搜索
2. 结合时间范围缩小搜索范围
3. 使用更具体的关键词组合

## 🎓 最佳实践

1. **优先使用标签搜索**：比全文搜索更精准
2. **结合时间范围**：减少无关结果干扰
3. **善用快照 ID**：建立稳定的引用关系
4. **定期整理标签**：提高检索效率
5. **利用 Wiki 命令**：实现内容的深度整合

---

## 🔧 安装配置

### 📥 下载

`git clone git@github.com:Kenshin/simpread-karpathy-llm-wiki-compiler.git` 或 **手动下载并解压缩到任意目录**

本工具需要安装两个组件：

- **MCP 服务器**：`simpread-karpathy-llm-wiki-compiler/tools/mcp/simpread-mcp/` - 负责与简悦本地数据通信
- **Skill 技能**：`simpread-karpathy-llm-wiki-compiler/tools/skills/simpread-mcp-helper/` - 提供智能检索和内容综合能力

将 `/simpread-mcp-helper/` 文件夹放到任意位置或你的项目中；而 `skills/simpread-mcp-helper/` 的位置跟你使用的具体工具相关。（下面会详细介绍）

### 📱 Claude Desktop

#### 步骤 1：安装 MCP 服务器

找到 Claude Desktop 的配置文件：

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

在配置文件中添加以下内容（如果文件不存在则创建）：

```json
{
  "mcpServers": {
    "simpread_mcp": {
      "command": "node",
      "args": [
        "/之前放置的目录/simpread-mcp/index.js"
      ],
      "env": {
        "PROMPT": "default"
      }
    }
  }
}
```

⚠️ **注意**：请将 `/之前放置的目录/simpread-mcp/index.js` 替换为你的 MCP 文件实际路径。

#### 步骤 2：安装 Skill 技能

Desktop 安装 skills 最简单的方案是将 `/simpread-mcp-helper`  打包为 zip 文件，然后直接安装即可。

打开 Settings → Capabilities → Customize → Upload a skill 下图所示

![image-20260515130934776](https://res.cloudinary.com/simpread/image/upload/v1778821785/config/8c8265e2f8ac737dde5834c917000949.png)

#### 步骤 3：重启 Claude Desktop

配置完成后，重启 Claude Desktop 使配置生效。

#### 步骤 4：验证安装

在 Claude Desktop 中输入：
```
简悦阅读助手帮助
```

如果看到帮助信息，说明安装成功。

### 💻 Claude Code (CLI)

#### 步骤 1：安装 MCP 服务器

在项目根目录创建或编辑 `.mcp.json` 文件：

```json
{
  "mcpServers": {
    "simpread_mcp": {
      "command": "node",
      "args": [
        "/之前放置的目录/simpread-mcp/index.js"
      ],
      "env": {
        "PROMPT": "default"
      }
    }
  }
}
```

⚠️ **注意**：请将 `/之前放置的目录/simpread-mcp/index.js` 替换为你的 MCP 文件实际路径。

#### 步骤 2：安装 Skill 技能

将 skill 文件夹复制到 Claude Code 的 skills 目录：

```bash
# macOS / Linux
cp -r tools/skills/simpread-mcp-helper ~/.claude/skills/

# Windows (PowerShell)
Copy-Item -Recurse tools\skills\simpread-mcp-helper $env:USERPROFILE\.claude\skills\
```

#### 步骤 3：验证安装

在 Claude Code 中输入：
```
简悦阅读助手帮助
```

### 🤖 Codex CLI & Codex Desktop

因为 Codex CLI 和 Codex Desktop 使用同一套配置文件，所以仅配置一个即可。

#### 步骤 1：安装 MCP 服务器

找到 Codex Desktop 的配置文件：

- **macOS**: `~/.codex/config.toml`
- **Windows**: `$env:USERPROFILE\.codex\config.toml`

在配置文件添加：

```toml
[mcp_servers.simpread_mcp]
type = "stdio"
command = "node"
args = ["/之前放置的目录/simpread-mcp/index.js"]
enabled = true

[mcp_servers.simpread_mcp.env]
PROMPT = "default"

[mcp_servers.simpread_mcp.tools.get_daily]
approval_mode = "approve"

[mcp_servers.simpread_mcp.tools.search_tag]
approval_mode = "approve"

[mcp_servers.simpread_mcp.tools.search_content]
approval_mode = "approve"

[mcp_servers.simpread_mcp.tools.get_snapshot]
approval_mode = "approve"

[mcp_servers.simpread_mcp.tools.get_unread_list]
approval_mode = "approve"

[mcp_servers.simpread_mcp.tools.get_unread_by_idx]
approval_mode = "approve"
```

⚠️ **注意**：请将 `/你的项目路径/simpread-kb/` 替换为你实际的项目路径。

#### 步骤 2：安装 Skill 技能

将 skill 文件夹复制到 Codex Desktop 的 skills 目录：

```bash
# macOS / Linux
cp -r tools/skills/simpread-mcp-helper ~/.codex/skills/

# Windows (PowerShell)
Copy-Item -Recurse tools\skills\simpread-mcp-helper $env:USERPROFILE\.codex\skills\
```

#### 步骤 3：重启 Codex Desktop

配置完成后，重启 Codex Desktop 使配置生效。（ Codex Cli 无须重启）

#### 步骤 4：验证安装

在 Codex Desktop 或 Codex CLI 中输入：
```
简悦阅读助手帮助
```

### ✅ 安装验证清单

无论使用哪个平台，请确认以下几点：

- [ ] Node.js 已安装（`node --version`）
- [ ] [简悦同步助手](https://simpread.pro/docs/#/Sync) 已运行
- [ ] 本地知识库已配置（`http://localhost:7026` 可访问）
- [ ] MCP 服务器路径配置正确
- [ ] Skill 文件已复制到正确位置
- [ ] 输入"简悦阅读助手帮助"能看到帮助信息

## 📖 相关资源

- [简悦官网](https://simpread.pro/)

- [简悦文档](https://simpread.pro/docs/)

- [MCP 协议规范](https://modelcontextprotocol.io/)

- [本地知识库配置](https://www.yuque.com/kenshin/simpread/wkswh7)

---

**SimpRead + MCP: 让你的阅读收藏真正活起来。**

*Made with ❤️ for SimpRead community.*