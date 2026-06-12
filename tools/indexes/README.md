# 🔧 index_map.txt 生成工具

> **扫描 `raw/` 目录下的 `.md` 文件，自动提取本地快照 ID 或原文地址，生成 `index_map.txt` 索引文件。**

## 📖 概述

`index_map.txt` 是 LLM Wiki 方案中 `raw/{主题}/` 目录下的可选映射表，用于建立原始 `.md` 文件与简悦本地快照（`http://localhost:7026/reading/{id}`）之间的映射关系，实现 Wiki 条目的精准溯源。

本工具提供 **4 种语言实现**，可根据运行环境选用，输出完全一致。

## 📝 使用前提

1️⃣ `raw/` 目录下需存在按主题分类的子文件夹，每个文件夹内包含若干 `.md` 源材料。

2️⃣ `.md` 文件需包含以下格式的链接：

```
[原文地址](https://36kr.com/p/2944350265236358)
[本地快照](http://localhost:7026/reading/3265)
```

## 🎯 生成规则

- 优先提取 `[本地快照](http://localhost:7026/reading/{id})` 中的数字 ID
- 若文件不含本地快照，降级提取 `[原文地址](...)` 中的 URL
- 同一文件内多个快照 ID 按数值升序排列
- 文件名纯数字的 `.md` 按数字排序，非数字按字典序排列
- 输出末尾保留换行符

## 📚 平台方案

| 文件 | 平台 | 依赖 | 说明 |
|------|------|------|------|
| `generate.sh` | macOS + Linux | bash, sed, awk | 纯 shell，无需额外安装 |
| `generate.js` | 跨平台 | Node.js | 项目主方案 |
| `generate.py` | 跨平台 | Python 3.9+ | 备选方案 |
| `generate.bat` + `generate.ps1` | Windows | PowerShell 5.1+ | `.bat` 为入口包装 |

## 🔧 使用方式

### macOS / Linux

```bash
# 扫描 raw/ 下全部目录
bash tools/indexes/generate.sh -a

# 扫描指定目录（可传多个）
bash tools/indexes/generate.sh -m 霸王茶姬 瑞幸
```

### Node.js

```bash
node tools/indexes/generate.js -a
node tools/indexes/generate.js -m 霸王茶姬 瑞幸
```

### Python

```bash
python3 tools/indexes/generate.py -a
python3 tools/indexes/generate.py -m 霸王茶姬 瑞幸
```

### Windows

```cmd
generate.bat -a
generate.bat -m "霸王茶姬" "瑞幸"
```

或直接调用 PowerShell：

```powershell
pwsh generate.ps1 -a
pwsh generate.ps1 -m "霸王茶姬" "瑞幸"
```

## 📄 输出格式

```text
@0: 3265, 3284, 3296, 3387, 3432, 3466, 3478
@1: 3664, 3688, 3754, 3755, 3791, 3820, 4050
@2: 4165, 4207, 4475, 4717, 4746, 4793
@3: 4880, 4999, 5178, 5240
```

- `@文件名: 快照ID列表` — 有本地快照时
- `@文件名: URL列表` — 仅有原文地址时降级输出

## ⚠️ 兼容性说明

- `generate.sh` 中 `sed` 使用 `\(..\)` 分组 + `\{0,1\}`，同时兼容 macOS BSD sed 与 GNU sed
- 避免使用 `grep -P`（macOS 不支持 PCRE）和 `paste -sd`（BSD 多字符分隔符行为不一致）
- `generate.py` 兼容 Python 3.9+（未使用 3.10 的 `X | Y` 类型语法）
