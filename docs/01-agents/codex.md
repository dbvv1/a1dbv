# OpenAI Codex（CLI / App / Cloud）

> 核实时间：2026-10-03（CLI v0.160.0，2026-10-01）。OpenAI 文档站在整理环境中无法访问，以下内容通过 [openai/codex 源码](https://github.com/openai/codex)、[Releases](https://github.com/openai/codex/releases) 和 issue 区核实 **[一手]**；标 **[二手]** 的来自搜索摘要。
> 评级：✅ **采用**（主力或交叉评审）

## 1. 形态

| 形态 | 说明 |
|---|---|
| **Codex CLI** | 开源，用 Rust 编写；`curl -fsSL https://chatgpt.com/codex/install.sh \| sh`、`npm i -g @openai/codex` 或 `brew install --cask codex` |
| **Codex App** | 桌面应用，运行 `codex app` 打开 |
| **Codex Cloud / Web** | chatgpt.com/codex 上的云端任务 |
| IDE 扩展 | VS Code、Cursor、Windsurf 等 |

推荐用 ChatGPT 订阅（Plus / Pro / Business / Edu / Enterprise）登录，也可以用 API Key **[一手]**。

## 2. 关键机制（源码核实）

### AGENTS.md 加载规则（`codex-rs/core/src/agents_md.rs`）
- 从**项目根目录逐级向下到当前目录**，收集沿途所有 `AGENTS.md`；
- 同一目录下 `AGENTS.override.md` 优先，适合放个人本地覆盖；
- 可通过 `project_doc_fallback_filenames` 配置备用文件名，比如把 `CLAUDE.md` 也纳入；
- 总大小上限 `project_doc_max_bytes`，默认 **32 KiB**，超出部分会被截断。

### 审批与沙箱
- 审批策略：`untrusted` / `on-request` / `on-failure` / `never`；沙箱模式：`read-only` / `workspace-write` / `danger-full-access`。
- Linux 默认用 **bubblewrap** 做文件系统隔离（优先用系统 `bwrap`，否则用内置的）；macOS 用 Seatbelt；Windows 有独立的 sandbox 实现。WSL1 不支持沙箱。
- **Guardian / auto-review**（2026-04）：由审查子 Agent 代替人做审批，只把真正有风险的操作上报给用户；配置 `approvals_reviewer = "guardian_subagent"`，使用专用模型 `codex-auto-review` **[二手]**。

### 源码里能看到的功能模块
`codex-rs/` 下有：`code-mode`（让模型写代码来调用工具）、`memories`（记忆读写流水线）、`agent-roles`、`agent-message-board`（Agent 之间互发消息）、`hooks`、`skills`、`plugin`、`worktree`、`cloud-tasks`、`external-agent-migration`（从其他 Agent 迁移配置与记忆）、`ollama` / `lmstudio`（本地模型）、`realtime-webrtc` / `voice-host`（语音）、`windows-sandbox-rs`。功能开关里还能看到 `Goals`、`BrowserUse`、`ComputerUse`、`ImageGeneration`、`MemoryTool`、`GuardianApproval` 等 **[一手]**。

### 2026 年主要更新（时间线）
| 时间 | 内容 | 证据 |
|---|---|---|
| 2026-03-25 | 插件：打包 Skills、应用集成和 MCP 配置，有官方插件目录 | [二手] |
| 2026-04 | GPT-5.5；Goals（`/goal`）；浏览器使用；Guardian 自动审查 | [二手] |
| 2026 年内 | 子 Agent 正式发布（issue #2604 已关闭）、事件 Hooks（#2109 已关闭）、Plan 模式（#2101 已关闭） | [一手] |
| 2026-08-26 | v0.150：用 `@` 引用其他任务，Agent 可以读取、创建任务或给任务发消息 | [二手] |
| 2026-10-01 | v0.160：Agent 指挥中心可浏览历史任务；Guardian 可读取早先的用户指令和交接上下文 | [一手] |

## 3. 优势与短板

**优势**
- 社区普遍反馈**更快**、**话更少**、**严格按指令做事，不自作主张** **[社区]**。
- 默认沙箱，安全基线更好。
- 开源，可以审计、自己编译。
- 用 ChatGPT 订阅即可使用，社区认为“性价比高” **[社区]**。

**短板（来自 issue 区）**
- **没有 LSP 集成**（#8745 仍开放），大型强类型项目里只能靠 grep 定位代码。
- 回滚体验弱：`/undo` 被移除（#9203），`/rewind` 未实现（#11626）。
- 额度与成本：“token 消耗太快”（630 个赞），“GPT-5.5 下 Plus 计划的额度消耗涨了 10–20 倍”（211 个赞）**[社区]**。

## 4. 与 Claude Code 配合使用

- **交叉评审**：Claude Code 写的代码让 Codex 用 `/review` 审，反过来也一样。
- **共享配置**：两边都读 AGENTS.md；Skills 用同一格式；插件生态里有 Superpowers 这类同时进入两家官方市场的插件。
- 在 Claude Code 中调用 Codex：社区有 [skill-codex](https://github.com/skills-directory/skill-codex) Skill。

## 来源

- [openai/codex](https://github.com/openai/codex)（README、`codex-rs/` 源码、`docs/config.md`）
- [Releases](https://github.com/openai/codex/releases)
- [Issues（按点赞排序）](https://github.com/openai/codex/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- HN：[Ask HN: Is Codex really on par with Claude Code?](https://news.ycombinator.com/item?id=47750069)、[A week of using Codex more than Claude](https://news.ycombinator.com/item?id=49393051)（摘要）
- [Codex CLI Guardian Approval（Daniel Vaughan）](https://codex.danielvaughan.com/2026/04/20/codex-cli-guardian-approval-configuring-auto-review-policies/)（二手）
