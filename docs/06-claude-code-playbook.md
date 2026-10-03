# Claude Code 进阶手册

> 核实时间：2026-10。官方文档：<https://code.claude.com/docs>

## 1. 记忆与指令（CLAUDE.md）

| 位置 | 作用域 | 用途 |
|---|---|---|
| `~/.claude/CLAUDE.md` | 你本机所有项目 | 个人偏好：语言、代码风格、沟通方式 |
| `<项目>/CLAUDE.md` | 项目（提交到 git） | 项目结构、命令、规范、禁区 |
| `<子目录>/CLAUDE.md` | 进入该目录时加载 | 模块级规则（如 `Assets/Scripts/Network/CLAUDE.md`） |

- `/init` 自动生成初稿，然后**人工精简**。
- 支持 `@path/to/file` 导入其他文件，避免重复。
- 跨工具共享：写一份 `AGENTS.md`，`CLAUDE.md` 中 `@AGENTS.md` 导入（Codex、Cursor、Copilot 等都读 AGENTS.md）。
- **写什么**：Agent 自己猜不到、猜错代价大的东西（命令、约定、禁区、坑）。**不写什么**：显而易见的通用知识、长篇架构文档（放 docs 里按需引用）。

## 2. 权限与模式

- 模式：`default`（逐项确认）/ `acceptEdits`（自动接受编辑）/ `plan`（只读规划）/ `auto`（分类器自动判定风险）/ `dontAsk` / `bypassPermissions`（仅限隔离环境）。
- `Shift+Tab` 循环切换模式；大改动前先用 **Plan 模式**出方案。
- 规则写在 `.claude/settings.json`（团队共享）或 `.claude/settings.local.json`（个人，不提交）：

```json
{
  "permissions": {
    "allow": ["Bash(git status*)", "Bash(git diff*)", "Bash(./tools/*)"],
    "ask":   ["Bash(git push*)"],
    "deny":  ["Edit(Library/**)", "Read(.env*)", "Bash(rm -rf*)"]
  }
}
```

- `/fewer-permission-prompts`：扫描历史，自动生成只读命令白名单。

## 3. Hooks（确定性自动化）

Hooks 在特定事件触发 shell 命令/HTTP/MCP 工具/提示词，**不依赖模型是否“记得”**。

常用事件：`SessionStart`、`UserPromptSubmit`、`PreToolUse`、`PostToolUse`、`Stop`、`SubagentStop`、`PreCompact`、`Notification`、`FileChanged`、`WorktreeCreate` 等。

- `PreToolUse` + 退出码 `2` → **阻止**该操作，stderr 反馈给 Claude。
- 也可输出 JSON：`{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"..."}}`
- `PostToolUse` 适合编辑后格式化/静态检查，可返回 `additionalContext` 提示 Claude。
- 脚本路径用 `${CLAUDE_PROJECT_DIR}`。

示例：[`templates/unity/.claude/hooks/`](../templates/unity/.claude/hooks/)

## 4. Subagents（子 Agent）

- 文件：`.claude/agents/<name>.md`（项目）或 `~/.claude/agents/`（个人）。
- frontmatter：`name`、`description`（必需），`tools`、`model`、`permissionMode`、`skills`、`memory`、`isolation: worktree`、`effort` 等。
- 价值：**上下文隔离**（检索/评审的大量中间信息不污染主会话）+ **角色专精** + **降本**（检索类用小模型）。
- 内置：`Explore`（只读检索）、`Plan`（方案设计）、`general-purpose`。

示例：[`templates/unity/.claude/agents/`](../templates/unity/.claude/agents/)

## 5. Skills 与插件

见 [05-skills-plugins](05-skills-plugins.md)。常用内置：`/code-review`、`/simplify`、`/security-review`、`/run`、`/loop`、`/init`。

## 6. LSP（代码智能）

安装语言服务器插件后，Claude Code 获得跳转定义、查引用、实时诊断：

```bash
dotnet tool install --global csharp-ls        # 轻量，社区维护
# 或 Microsoft 官方 roslyn-language-server（需 .NET 10+）
/plugin install csharp-lsp@claude-plugins-official
```

对 Unity 大项目尤其重要：编辑后立即拿到编译诊断，不用等 Unity 重新编译。

## 7. 上下文管理

| 命令 | 用途 |
|---|---|
| `/context` | 查看上下文占用（MCP、Skills、记忆各占多少） |
| `/compact [指示]` | 压缩历史，可指定保留重点 |
| `/clear` | 开新话题时清空（**最被低估的命令**） |
| `/rewind` / `Esc Esc` | 回退到之前的检查点（代码 + 对话） |
| `/mcp`、`/skills`、`/agents` | 管理扩展 |

## 8. 自动化与无头模式

```bash
claude -p "解释 Assets/Scripts/Combat 的架构" --output-format json
git diff main | claude -p "评审这段 diff，只列高风险问题"
```

- **GitHub Actions**：[`anthropics/claude-code-action`](https://github.com/anthropics/claude-code-action)，在 PR/Issue 中 `@claude` 触发。
- **Agent SDK**（TS / Python）：把 Claude Code 的 Agent 循环嵌入自己的工具。
- **Routines / 定时任务**、`/loop`：周期性任务（如每日依赖检查）。

## 9. 多端与并行

- 终端、VS Code、JetBrains、桌面 App、Web（claude.ai/code，云端容器）、手机 App。
- `claude remote-control`：在本机运行会话并从手机/网页继续操作——**适合需要本地 Unity 编辑器的任务**。
- git worktree + 多会话并行（见 [07-workflows](07-workflows.md#并行-agent)）。

## 10. 实用小技巧

- 粘贴截图（Unity 报错、UI 效果）直接给 Claude 看。
- `@文件` 精确引用，比让它自己搜更省上下文。
- 让 Claude 写完后**自己验证**：“改完跑一遍 EditMode 测试并修到全绿”。
- 纠正一次的问题 → 立刻写进 CLAUDE.md 或 Skill，避免重复踩坑。
- 状态栏（statusline）显示模型、上下文占用、分支。
