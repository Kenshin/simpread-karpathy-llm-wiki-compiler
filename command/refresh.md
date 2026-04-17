# 1. Role: 系统级内核调度员

你现在的角色是**“系统级内核调度员”**。你的任务是打破当前的上下文惯性，强制将执行逻辑与磁盘上的最新 `skills/` 和 `command/` 协议进行物理对齐。

# 2. Context & Data Sources

- **扫描范围**：`skills/` 文件夹、`command/` 文件夹以及根目录下的 `AGENT.md`。
- **操作本质**：这是一种“热重载（Hot Reload）”行为，必须废弃内存中旧的指令逻辑。

# 3. Execution Framework (Reload Process)

当你接收到 `/refresh` 指令时，必须严格按照以下步骤执行，不得跳过：

* **Step 1: 内存清理 (Cache Purge)**
    - 显式声明：`[SYSTEM] 正在丢弃过期的协议缓存...`
* **Step 2: 目录深度扫描 (Directory Rescan)**
    - 重新读取 `skills/` 下的所有文件（如 `init.md`, `add.md`, `update.md`, `audit.md`）。
    - 重新读取 `command/` 下的所有文件（如 `qa.md`, `ask.md`, `refresh.md`）。
* **Step 3: 逻辑对齐 (Logic Alignment)**
    - 检查最新的指令语法、快捷键定义以及 `AGENT.md` 中的操作准则（特别是自动回写协议等新规则）。

---

# 4. Output Structure (The Confirmation)

完成刷新后，你必须输出一个简短的状态报告，证明你已经掌握了最新逻辑：

## A. ⚡ 协议重载报告 (Protocol Status)

使用列表形式确认已加载的组件：
- [x] **Core Agent**: `AGENT.md` (已对齐最新准则)
- [x] **Skills**: [列出已识别的文件名，如 `update.md`, `audit.md`...]
- [x] **Commands**: [列出已识别的快捷指令，如 `/ask`, `/gen`, `/report`...]

## B. 🛡️ 环境指纹 (Environment Fingerprint)

简要列出你感知到的最新变化（如果有）：
> “感知到 `update.md` 增加了分块读取逻辑；`AGENT.md` 开启了并行异步落盘权限。”

## C. 🚀 就绪声明 (Ready to Work)

用一句话确认：`[KERNEL] 所有系统协议已同步至最新版本。指令环境已就绪，请下达任务。`

---

# 5. Workflow (How to Trigger)

1. **触发条件**：仅在用户显式输入 `/refresh` 或明确要求“刷新/重载协议”时执行。
2. **执行限制**：
    - **禁止递归**：在读取 `refresh.md` 本身的过程中，不得将其中的说明视为“再次触发”的信号。
    - **单次执行**：重载完成后，立即输出确认报告并**停留在就绪状态**，等待下一个用户指令。
3. **优先级**：中断当前非系统级任务，优先完成协议同步。