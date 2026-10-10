# OpenAI Codex（CLI / App / Cloud）

> 核实时间：2026-10-08。依据 [openai/codex 源码](https://github.com/openai/codex)和 [Releases](https://github.com/openai/codex/releases)，以及官方文档（**已迁移到 [learn.chatgpt.com](https://learn.chatgpt.com/llms.txt)**，在页面地址后加 `.md` 可以拿到 Markdown 原文）**[一手]**。
> 评级：✅ **采用**（主力或交叉评审）

## 1. 形态与入口

| 形态 | 说明 |
|---|---|
| **Codex CLI** | 开源，用 Rust 编写；`curl -fsSL https://chatgpt.com/codex/install.sh \| sh`、`npm i -g @openai/codex` 或 `brew install --cask codex` |
| **ChatGPT 桌面 App（Codex / Work）** | 2026 年 Codex App 并入 ChatGPT 桌面 App（“ChatGPT Work”）；Linux 版 2026-08 预览 |
| **Codex Cloud** | 云端任务，可复用的云端环境（DevDay 2026） |
| IDE 扩展、GitHub / GitLab（beta）、Slack、Linear 集成 | 在 PR 里用 `@codex review` 做代码评审，`@codex security review` 做安全评审 |

ChatGPT 的 Free、Go、Plus、Pro、Business、Edu、Enterprise 各档都包含 Codex，额度不同 **[一手：Pricing 文档]**。

## 2. 模型（2026-10）

| 模型 | 说明 |
|---|---|
| **GPT-6.1 Sol** | DevDay 2026（9 月底）发布；官方称“接近 Astra 的能力、五分之一的价格”；`codex --model gpt-6.1-sol` |
| GPT-6 Sol / Luna | 2026-09-22 发布，价格约为 GPT-5.6 的一半；Sol Medium 适合日常和复杂编码，Luna High 适合聚焦、可重复的任务。**社区对 GPT-6 Sol 首发的评价偏差** **[社区]** |
| GPT-6 Astra | 2026-09 发布，推理 + computer use，适合高难度工作；500 美元 Pro 档有 Ultrafast 模式 |
| **GPT-5.5** | **2026-10-14 在 ChatGPT 和 Codex 中退役**（API 不受影响）。所有写死了 `gpt-5.5` 的配置、自定义 Agent、定时任务和脚本都要改 |
| Ultra 模式 | 不再是单 Agent 运行，而是把大任务拆给多个子 Agent |

注意：2026-07 Codex 的上下文窗口从 372k 缩到 272k（PR #33972）**[社区：HN]**。

## 3. 关键机制

### AGENTS.md（官方文档 + 源码 `codex-rs/core/src/agents_md.rs`）
- **全局**：`~/.codex/AGENTS.override.md` 存在时只用它，否则用 `~/.codex/AGENTS.md`；
- **项目**：从项目根目录（通常是 git 根）逐级走到当前目录，每一级优先用 `AGENTS.override.md`，否则用 `AGENTS.md`；
- 按从根到当前目录的顺序拼接，越靠近当前目录的越晚出现、优先级越高；
- 合计上限 `project_doc_max_bytes`，默认 **32 KiB**；
- 可以用 `project_doc_fallback_filenames` 把 `CLAUDE.md` 等也纳入。
- 代码评审的自定义规则也写在 AGENTS.md 里。

### 审批、沙箱与 Auto-review
- 审批策略：`on-request` / `never` / 细粒度策略；2026-10-10 的当前配置参考已将显式 `untrusted` 列为不支持（不要与项目 `trust_level = "untrusted"` 混淆），`on-failure` 已弃用。见 [配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)；沙箱模式：`read-only` / `workspace-write` / `danger-full-access`。Linux 默认用 bubblewrap，macOS 用 Seatbelt，Windows 有独立的沙箱实现。
- **Auto-review**：配置 `approvals_reviewer = "auto_review"`，CLI 用 `--approve-for-me`，桌面 App 里叫“Approve for me”（上一版写的 `guardian_subagent` 有误，已更正）**[一手]**
  - 只在交互式审批下生效：需要越过沙箱边界时（提权执行命令、被拦的网络请求、写可写目录以外的文件、需要审批的 MCP 调用、Computer Use 访问新域名），由**独立的审查 Agent** 代替人来决定。
  - 它是“换一个审批者”，**不会扩大权限**（不会增加可写目录，也不会放开网络）。
  - 拦截目标：把私有数据或密钥发往不可信目的地、探测凭证、大范围或持久地削弱安全设置、不可逆的破坏性操作。
  - 审查策略开源：`codex-rs/core/src/guardian/policy.md`；企业可用 `guardian_policy_config` 定制，个人可用 `[auto_review].policy` 定制。

### 子 Agent、Hooks、Skills、插件、记忆
- **子 Agent 默认开启**；有内置 Agent（如 `default`），可以在 `config.toml` 的 `[agents]` 里设默认值，也可以写自定义 Agent 文件。
- Hooks、Rules、Skills、Plugins（2026-03 推出；0.147 起支持可移植的 Agent Plugins 和多个插件目录搜索）、Memories、Goals 都已提供 **[一手：文档目录]**。
- **从其他 Agent 导入**（2026-08-11）：桌面 App 在 Settings > Import、CLI 用 `/import`，可以从 **Claude Code、Claude Cowork、Cursor** 导入指令、设置、Skills、插件、项目和近期工作，并可保持同步 **[一手]**。

### 源码里能看到的模块
`codex-rs/` 下有：`code-mode`、`memories`、`agent-roles`、`agent-message-board`、`hooks`、`skills`、`plugin`、`worktree`、`cloud-tasks`、`external-agent-migration`、`ollama` / `lmstudio`、`windows-sandbox-rs` 等。功能开关里还能看到 `Goals`、`BrowserUse`、`ComputerUse`、`MemoryTool`、`GuardianApproval` 等 **[一手]**。

## 3.5 DevDay 2026（2026-09-29）的变化 **[一手：learn.chatgpt.com]**

| 变化 | 说明 |
|---|---|
| **GPT-6.1 Sol** | “接近 Astra 的性能、更低的价格”，用于复杂编码；API 里支持 Responses 的多 Agent beta 和欧盟数据驻留 |
| **Astra Ultrafast** | Codex 和 Work 中更快的 GPT-6 Astra，只对 500 美元/月的 Pro 档和部分企业、教育计划开放 |
| **可复用的云端环境** | 描述开发环境 → Codex 准备并测试 → 发布；之后的新任务都在用这个文件系统的隔离工作区里启动，电脑休眠时云端任务也能继续 |
| **Codex Security Cloud**（研究预览） | 扫描已连接的 GitHub 仓库或监控新提交，给出发现、验证证据和补丁，再创建草稿 PR |
| **Dots**（常驻 Agent） | 由 GPT-6 Astra 驱动，有自己的云端电脑和浏览器；在对话之间持续推进工作，需要判断时再找你；可以连接一台本地电脑；在 Codex 或 Work 里启动的任务照常计入额度 |
| **企业 Agent Security** | 统一管控本地和 Codex Cloud 执行时能用的工具、文件和网络访问 |
| **MCP Events** | 让 ChatGPT 订阅 MCP 服务器的事件并据此行动（要求 MCP 2.0，基于草案规范的 webhook 投递） |

**含义**：OpenAI 在把 Codex 从“你发起的会话”推向“**常驻、云端、有自己环境的 Agent**”，和 Claude Projects 是同一个方向（见 [13](../13-frontier-radar.md#24-云端大脑本地双手会话管理正在被托管)）。

## 3.6 从说明到可验证配置（2026-10-11 增补）

按需采用 [Codex 原生模板](../../templates/codex/README.md)，先核对运行时支持与生效状态，再选择受控写入范围；长任务使用 [验收和恢复记录](../20-codex-long-horizon.md)。TOML 可解析不是运行兼容性证明。模板未在真实 Codex 客户端执行，不会自动安装或扩大权限。

## 4. 优势与短板

**优势**
- 社区普遍认为 Codex **更快**、**话更少**、**严格按指令做事，不自作主张** **[社区]**。
- 默认开启沙箱，Auto-review 的策略开源可审计。
- 开源，可以自己编译和审计；可接本地模型。
- 迁移成本低：能直接导入 Claude Code 的配置。

**短板**
- **没有 LSP 集成**（#8745 仍开放）。
- 回滚体验弱：`/undo` 已移除（#9203），`/rewind` 未实现（#11626）。
- **额度和成本**：issue 区点赞第一是“token 消耗太快”（630 个赞）；200 美元 Pro 档额度被下调；10 月 3 日重置后用户普遍觉得额度缩水 **[社区]**。
- 透明度争议：2026-07 起子 Agent 的提示词被加密（issue #28058），HN 425 票讨论 **[社区]**。

## 5. 与 Claude Code 配合使用

- **交叉评审**：Claude Code 写的代码让 Codex 评审（`/review` 或 `@codex review`），反过来也一样。
- **共享配置**：两边都读 AGENTS.md；Skills 用同一格式；Codex 可以直接 `/import` Claude Code 的配置。
- 在 Claude Code 中调用 Codex：社区有 [skill-codex](https://github.com/skills-directory/skill-codex)。

## 来源

- [learn.chatgpt.com：What's new](https://learn.chatgpt.com/docs/whats-new)、[DevDay 2026](https://learn.chatgpt.com/docs/whats-new/devday-2026)、[Dots](https://learn.chatgpt.com/docs/dots)（Markdown 版：在 URL 后加 `.md`）

- [openai/codex](https://github.com/openai/codex)、[Releases](https://github.com/openai/codex/releases)、[Issues（按点赞排序）](https://github.com/openai/codex/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- 官方文档：[What's new](https://learn.chatgpt.com/docs/whats-new)、[Models](https://learn.chatgpt.com/docs/models)、[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)、[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Import](https://learn.chatgpt.com/docs/import)
- HN：[GPT 6.1 Sol](https://news.ycombinator.com/item?id=49896586)、[Codex 上下文缩减](https://news.ycombinator.com/item?id=48965850)、[子 Agent 提示词加密](https://news.ycombinator.com/item?id=48905028)、[A week of using Codex more than Claude](https://news.ycombinator.com/item?id=49393051)
