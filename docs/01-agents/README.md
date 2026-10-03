# 01 · Coding Agent 对比与选型

> 核实时间：2026-10-03。功能变化以周计，以各自 changelog 为准。

## 深度页

| 页面 | 内容 |
|---|---|
| [claude-code.md](claude-code.md) | Claude Code：能力全景、2026 新功能、用法要点、已知问题 |
| [codex.md](codex.md) | OpenAI Codex（CLI / App / Cloud） |
| [gemini-cli.md](gemini-cli.md) | Google Gemini CLI 与 Antigravity |
| [open-source-agents.md](open-source-agents.md) | OpenCode、Cline、Kilo Code、Goose、Qwen Code、Pi、Aider 等 |
| [ide-and-others.md](ide-and-others.md) | Cursor、JetBrains（Junie/ACP）、VS Code/Copilot、Kiro，以及国内工具 |

## 对比矩阵（终端 / 通用 Agent）

| 维度 | Claude Code | Codex | Gemini CLI | OpenCode |
|---|---|---|---|---|
| 厂商 / 许可 | Anthropic / 闭源（插件与 mods 源码公开） | OpenAI / 开源（Rust） | Google / Apache-2.0 | 社区 / 开源 |
| 主力模型 | Claude Opus 5.5 / Sonnet 5.5 / Fable 5.1 / Haiku | GPT-5.x 系列 | Gemini 3 系列 | 任意（BYOK、本地模型） |
| 订阅可用 | Pro / Max / Team / Enterprise | ChatGPT Plus / Pro / Business / Enterprise | 个人 Google 账号有免费额度 | 取决于所接的服务商 |
| 指令文件 | CLAUDE.md（+ AGENTS.md，v2.1.277 起）、`.claude/rules/` 按路径生效 | AGENTS.md | GEMINI.md（可配置） | AGENTS.md |
| Skills | ✅（规范起源方，扩展字段最多） | ✅ | ✅ | ✅ |
| 插件市场 | ✅ 官方 315 个 | ✅（2026-03 起） | Extensions | 插件 |
| Hooks | ✅ 约 30 种事件；支持 command / http / mcp_tool / prompt / agent 五种类型 | ✅ | ✅ | ✅ |
| 子 Agent / 并行 | 子 Agent、Agent View、Agent Teams（实验）、Dynamic Workflows、云端 Projects | 子 Agent（已 GA）、云端任务 | 子 Agent | `@general` 子 Agent |
| LSP 代码智能 | ✅ 13 种语言官方插件 | ❌（issue #8745 仍开放） | — | ✅ |
| 沙箱 | macOS Seatbelt / Linux bubblewrap，可配网络白名单 | 默认沙箱（macOS Seatbelt / Linux bubblewrap / Windows sandbox） | Seatbelt / Docker | — |
| 自动审批 | auto mode（分类器） | guardian / auto-review 子 Agent | Unified Auto Mode | — |
| 回滚 | checkpoint + `/rewind` | `/undo` 被移除（issue #9203），`/rewind` 未实现（issue #11626） | checkpointing + rewind | — |
| 云端 / 远程 | Web、手机 App、Remote Control、Routines | Codex Cloud、桌面 App | — | 桌面 App（Beta） |

**[一手]** 各列均来自对应仓库源码、changelog 或官方文档；Codex 的 guardian 为 **[二手]**。

## 选型建议

| 场景 | 推荐 | 理由 |
|---|---|---|
| 复杂、长程、跨模块任务 | ✅ **Claude Code** | 生态最全（Skills / Hooks / 插件 / LSP / 多种并行方式）；社区普遍认为长程推理强 **[社区]** |
| 追求速度、指令精确执行、性价比 | ✅ **Codex** | 社区反馈更快、话少、“只做被要求的事” **[社区]**；默认沙箱 |
| 交叉评审 / 第二意见 | 🧪 用**另一家**的 Agent 审 | 不同模型盲区不同；Writer/Reviewer 模式是官方推荐做法 **[一手]** |
| 预算有限 / 多模态输入 | 🧪 **Gemini CLI** | 个人账号有免费额度、1M 上下文 **[一手]** |
| 模型自由、本地模型、私有部署 | 🧪 **OpenCode** / **Qwen Code** / **Goose** | 多服务商、可接本地模型 **[一手]** |
| 主力在 JetBrains IDE | 🧪 Rider/IntelliJ + ACP 接入 Claude/Codex | 2026 版 AI Chat 可选 Claude Agent、Codex 等 **[二手]** |
| 想极简、自己掌控 harness | 👀 **Pi** | 只有 4 个工具，其余靠扩展；适合想理解 Agent 原理的人 **[二手]** |
| Aider | ⛔ 不建议新采用 | 主仓库最后提交在 2026-05，README 仍推荐 Claude 3.7，维护明显放缓 **[一手]** |

## 能力趋同之后，真正的差异在哪

1. **模型本身**：长程一致性、指令遵循、“话多不多”。
2. **Harness 细节**：上下文管理（压缩、按需加载）、工具设计、审批机制。
3. **额度与价格**：两家社区的头号痛点都是额度（见 [11](../11-community-pulse.md)）。
4. **生态**：插件、Skills、团队配置分发。

> 实用建议：**主力用一家，配置尽量用开放格式**（AGENTS.md、Skills、MCP），并定期用另一家跑几个固定任务做对照。
