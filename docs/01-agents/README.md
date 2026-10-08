# 01 · Coding Agent 对比与选型

> 核实时间：2026-10-05。功能变化以周计，以各自 changelog 为准；最新动态见 [13 前沿雷达](../13-frontier-radar.md)。

## 深度页

| 页面 | 内容 |
|---|---|
| [claude-code.md](claude-code.md) | Claude Code：能力全景、2026 新功能、用法要点、已知问题 |
| [codex.md](codex.md) | OpenAI Codex（CLI / App / Cloud） |
| [gemini-cli.md](gemini-cli.md) | Google Gemini CLI 与 Antigravity |
| [open-source-agents.md](open-source-agents.md) | OpenCode、Cline、Kilo Code、Goose、Qwen Code、Pi、DeepSeek Harness、Aider 等 |
| [ide-and-others.md](ide-and-others.md) | Cursor、JetBrains（Junie/ACP）、VS Code/Copilot、Kiro，以及国内工具 |

## 对比矩阵（终端 / 通用 Agent）

| 维度 | Claude Code | Codex | Gemini CLI | OpenCode |
|---|---|---|---|---|
| 厂商 / 许可 | Anthropic / 闭源（插件与 mods 源码公开） | OpenAI / 开源（Rust） | Google / Apache-2.0 | 社区 / 开源 |
| 主力模型 | Claude Opus 5.5 / Sonnet 5.5 / Fable 5.1 / Haiku | GPT-6.1 Sol / GPT-6 Sol、Luna、Astra（GPT-5.5 于 10-14 退役） | Gemini 3.x（Gemini 4 Argon 尚未开放） | 任意（BYOK、本地模型） |
| 订阅可用 | Pro / Max / Team / Enterprise | ChatGPT Free / Go / Plus / Pro（$200、$500）/ Business / Enterprise | 个人 Google 账号有免费额度 | 取决于所接的服务商 |
| 指令文件 | CLAUDE.md（+ AGENTS.md，v2.1.277 起）、`.claude/rules/` 按路径生效 | AGENTS.md | GEMINI.md（可配置） | AGENTS.md |
| Skills | ✅（规范起源方，扩展字段最多） | ✅ | ✅ | ✅ |
| 插件市场 | ✅ 官方 315 个 | ✅（2026-03 起） | Extensions | 插件 |
| Hooks | ✅ 约 30 种事件；支持 command / http / mcp_tool / prompt / agent 五种类型 | ✅ | ✅ | ✅ |
| 子 Agent / 并行 | 子 Agent、Agent View、Agent Teams（实验）、Dynamic Workflows、云端 Projects | 子 Agent（已 GA）、云端任务 | 子 Agent | `@general` 子 Agent |
| LSP 代码智能 | ✅ 13 种语言官方插件 | ❌（issue #8745 仍开放） | — | ✅ |
| 沙箱 | macOS Seatbelt / Linux bubblewrap，可配网络白名单 | 默认沙箱（macOS Seatbelt / Linux bubblewrap / Windows sandbox） | Seatbelt / Docker | — |
| 自动审批 | auto mode（分类器，2026-08 起默认） | Auto-review 审查 Agent（`approvals_reviewer = "auto_review"`，策略开源） | Unified Auto Mode | — |
| 回滚 | checkpoint + `/rewind` | `/undo` 被移除（issue #9203），`/rewind` 未实现（issue #11626） | checkpointing + rewind | — |
| 云端 / 远程 | Web、手机、Remote Control、Routines、**Projects**（云端并行线程） | Codex Cloud、ChatGPT 桌面 App、Ultra 多 Agent 模式 | — | 桌面 App（Beta） |
| Harness 开销 | 开口前约 33k token（Systima 实测） | — | — | 约 7k token |
| 跨工具迁移 | 读 AGENTS.md | `/import` 可导入 Claude Code、Cursor 的配置 | — | 读 AGENTS.md |

**[一手]** 各列均来自对应仓库源码、changelog 或官方文档；Harness 开销来自 Systima 的抓包实测 **[社区：原文]**。

## 选型建议

| 场景 | 推荐 | 理由 |
|---|---|---|
| 复杂、长程、跨模块任务 | ✅ **Claude Code** | 生态最全（Skills / Hooks / 插件 / LSP / 多种并行方式）；社区普遍认为长程推理强 **[社区]** |
| 追求速度、指令精确执行、性价比 | ✅ **Codex** | 社区反馈更快、话少、“只做被要求的事” **[社区]**；默认沙箱；GPT-6.1 Sol 性价比高。但注意额度下调和 GPT-6 Sol 首发的口碑问题 |
| 交叉评审 / 第二意见 | 🧪 用**另一家**的 Agent 审 | 不同模型盲区不同；Writer/Reviewer 模式是官方推荐做法 **[一手]** |
| 预算有限 / 多模态输入 | 🧪 **Gemini CLI** | 个人账号有免费额度、1M 上下文 **[一手]** |
| 模型自由、本地模型、私有部署 | 🧪 **OpenCode** / **Qwen Code** / **Goose** | 多服务商、可接本地模型 **[一手]** |
| 主力在 JetBrains IDE | 🧪 Rider/IntelliJ + ACP 接入 Claude/Codex | 2026 版 AI Chat 可选 Claude Agent、Codex 等 **[二手]** |
| 想极简、自己掌控 harness，或接本地模型 | 🧪 **Pi** | 只有 4 个工具、系统提示极小（省 token）；1.0 已发布并内置 MCP；HN 上很多人用它配合本地模型 **[社区]** |
| Aider | ⛔ 不建议新采用 | 主仓库最后提交在 2026-05，README 仍推荐 Claude 3.7，维护明显放缓 **[一手]** |

## 能力趋同之后，真正的差异在哪

1. **模型本身**：长程一致性、指令遵循、“话多不多”。
2. **Harness 细节**：上下文管理（压缩、按需加载）、工具设计、审批机制。
3. **额度与价格**：两家社区的头号痛点都是额度（见 [11](../11-community-pulse.md)）。
4. **生态**：插件、Skills、团队配置分发。

> 实用建议：**主力用一家，配置尽量用开放格式**（AGENTS.md、Skills、MCP），并定期用另一家跑几个固定任务做对照。
