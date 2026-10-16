# 01 · Coding Agent 对比与选型

> 更新：2026-10-15

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
| 主力模型 | Claude Opus 5.5 / Sonnet 5.5 / Fable 5.1 / Haiku 5.5 | GPT-6.1 Sol / GPT-6 Sol、Luna、Astra（GPT-5.5 于 10-14 退役仅限 ChatGPT 登录；API-key 登录不受影响） | CLI 以实际可选模型为准；Gemini 4 Argon 于 10-13 在 API／AI Studio GA，不等于 CLI 默认已变（[02](../02-models-and-cost.md)）；v0.63 起非交互模式可自主执行计划 | 任意（BYOK、本地模型） |
| 订阅可用 | Pro / Max / Team / Enterprise | 按入口和 rollout 分档；Free／Go 的桌面 Luna 与各集成例外分别核，见 [Codex 资格](codex.md#1-形态与入口) | 消费者 Google 登录路径已停；API／旧企业合同分别核，见 [接入选择](gemini-cli.md#1-基本情况) | 取决于所接的服务商 |
| 指令文件 | CLAUDE.md（+ AGENTS.md，v2.1.277 起）、`.claude/rules/` 按路径生效 | AGENTS.md | GEMINI.md（可配置） | AGENTS.md |
| Skills | ✅（规范起源方，扩展字段最多） | ✅ | ✅ | ✅ |
| 插件市场 | ✅ 官方 315 个 | ✅（2026-03 起） | Extensions | 插件 |
| Hooks | ✅ 约 30 种事件；支持 command / http / mcp_tool / prompt / agent 五种类型 | ✅ | ✅ | ✅ |
| 子 Agent / 并行 | 子 Agent、Agent View、Agent Teams（实验）、Dynamic Workflows、Projects（云端或有条件的本机线程） | 子 Agent（已 GA）、云端任务 | 子 Agent | `@general` 子 Agent |
| LSP 代码智能 | ✅ 官方插件；[需服务器二进制，官方云会话不启动](../05-skills-and-plugins.md#3-插件与市场) | 原生语义导航按客户端／扩展核查，见 [LSP 边界](codex.md#lsp修复反馈与语义操作不能混为一谈) | — | ✅ |
| 沙箱 | macOS Seatbelt / Linux bubblewrap，可配网络白名单 | 默认沙箱（macOS Seatbelt / Linux bubblewrap / Windows sandbox） | v0.63.0 需显式启用；[核有效配置与隔离范围](gemini-cli.md#沙箱启用与隔离范围) | — |
| 自动审批 | auto 分类器；v2.1.283 起交互终端／VS Code 内建默认，受设置与可用性影响，见 [06](../06-hooks-and-guardrails.md#4-auto-mode实测数据) | Auto-review 审查 Agent（`approvals_reviewer = "auto_review"`，策略开源） | Unified Auto Mode | — |
| 回滚 | checkpoint + `/rewind` | CLI 会话与文件同步恢复仍有历史诉求；按实际入口保留检查点，见 [Codex](codex.md#4-优势与短板) | 编辑记录 `/rewind`／项目快照 `/restore`（需启用），[范围不同](gemini-cli.md#恢复范围) | TUI `/undo`／`/redo`；文件恢复依赖 Git 与快照，[范围见深页](open-source-agents.md#opencode规划与撤回边界) |
| 云端 / 远程 | Web、手机、Remote Control、Routines、**Projects**（云端并行；本机资源另选 Remote Control 线程） | Codex Cloud（**可复用的云端环境**，2026-09）、ChatGPT 桌面 App、常驻 Agent **Dots**；并行不以 Ultra 为唯一入口，见 [模型选择](codex.md#2-模型按任务与实际用量选择) | — | 桌面 App（Beta） |
| Harness 开销 | 历史版本测得较高固定输入；当前按任务、缓存与工具配置核查，见 [开销边界](claude-code.md#6-已知问题与社区反馈) | — | — | 不用旧版本输入量推定当前净成本 |
| 程序化调用 | `claude -p`、Claude Agent SDK、Managed Agents（见 [16](../16-building-agents.md)） | `codex exec`、Codex SDK、app-server、Agents API | 非交互模式 | `opencode run` 等 |
| 跨工具迁移 | 读 AGENTS.md | `/import` 可导入 Claude Code、Cursor 的配置 | — | 读 AGENTS.md |

**[一手]** 各列均来自对应仓库源码、changelog 或官方文档；Harness 开销来自 Systima 的抓包实测 **[社区：原文]**。

## 选型建议

| 场景 | 推荐 | 理由 |
|---|---|---|
| 复杂、长程、跨模块任务 | 🧪 Claude Code／Codex | 先沿用已有工具与项目验证入口；再按同一任务的正确性、后续修改和总投入选择，生态数量不证明净收益。见 [15](../15-task-playbooks.md)与[22](../22-agent-evaluation.md) **[研究]** |
| 等待或预算已成为瓶颈 | 🧪 对比候选模型与当前入口 | 分开记录质量、等待、费用与主动工时；不能用零散口碑代替当前账户、任务和模型配置的对照。见 [02](../02-models-and-cost.md) **[研究]** |
| 交叉评审 / 第二意见 | 🧪 按风险增加新上下文评审 | 同模型或跨模型都可能共享盲点；按 [09](../09-review-and-quality.md#2-评审手段)比较新增有效发现、误报与成本，不默认必须换品牌 **[研究]** |
| 考虑 Google 编码入口 | 🧪 先核 **Gemini CLI** 的认证／合同；个人入口另评估 **Antigravity CLI** | 不再以旧个人免费额度新采用 Gemini CLI；保留可用 API／旧企业合同路径，迁移先核必要配置，见 [接入与迁移](gemini-cli.md) **[一手；研究：采用判断]** |
| 模型自由、本地模型、私有部署 | 🧪 **OpenCode** / **Qwen Code** / **Goose** | 多服务商、可接本地模型 **[一手]** |
| 已有 JetBrains 工程 | 🧪 先核 AI Chat 集成／ACP 是否覆盖必要路径 | 平台、认证与所需操作满足时保留现有 IDE；CLI 可用不证明 IDE 入口同配置兼容，见 [JetBrains 边界](ide-and-others.md#jetbrainsintellij--rider--pycharm) **[一手；研究：采用判断]** |
| 愿意自己定制 harness 并维护隔离 | 🧪 **Pi** | 默认启用 4 个工具，可扩展 MCP／codemode；按进程权限运行，隔离需另设。工具少不证明净成本低，见 [固定来源与边界](../research/2026-10-12-community-source-records.md#2026-10-15-选型补核默认工具不是成本或隔离边界) **[一手；研究：采用判断]** |
| 新项目依赖持续的模型／接口适配 | ⛔ 暂缓新采用 **Aider** | main 末次提交仍为 2026-05-22，维护风险需考虑；main 已有较新模型配置，不等于稳定版已发布。已有稳定工作流不据此迁移，见 [维护与兼容边界](../research/2026-10-12-community-source-records.md#2026-10-15-aider维护节奏与模型兼容分开判断) **[一手；研究：采用判断]** |

## 能力趋同之后，真正的差异在哪

1. **模型本身**：长程一致性、指令遵循、“话多不多”。
2. **Harness 细节**：上下文管理（压缩、按需加载）、工具设计、审批机制。
3. **额度与价格**：按当前套餐、入口及实际任务用量比较；社区个案可提示检查方向，不能代表普遍可用时长。见 [02](../02-models-and-cost.md)与[个案核对](../research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)。**[研究：采用边界]**
4. **生态**：插件、Skills、团队配置分发。

> 实用建议：**主力用一家，配置尽量用开放格式**（AGENTS.md、Skills、MCP），并定期用另一家跑几个固定任务做对照。

来源与核实日期见各工具深度页及[选型证据记录](../research/2026-10-12-community-source-records.md)；近期变化见 [13 前沿雷达](../13-frontier-radar.md)。
