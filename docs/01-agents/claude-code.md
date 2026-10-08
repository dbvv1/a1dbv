# Claude Code

> 核实时间：2026-10-08（最新版本 v2.1.294）。主要依据：[CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)、[官方文档](https://code.claude.com/docs)、[Anthropic 工程博客](https://www.anthropic.com/engineering) **[一手]**。
> 评级：✅ **采用**（主力 Agent 首选之一）

## 1. 定位

Anthropic 的 Agent 式编程环境：能读代码、改文件、跑命令、多步自主完成任务。可在终端、VS Code、JetBrains、桌面 App、Web（claude.ai/code，云端容器）、手机 App 上使用。它的扩展体系（CLAUDE.md、Skills、Hooks、Subagents、MCP、插件、LSP、Mods）是目前最完整的。

## 2. 模型与价格（v2.1.280–2.1.293 changelog）

| 模型 | ID | 上下文 | 价格（输入/输出，每百万 token） | 缓存读取 |
|---|---|---|---|---|
| Fable 5.1 | `claude-fable-5-1` | 1M | $10 / $50 | $0.25 |
| Opus 5.5（默认 Opus） | `claude-opus-5-5` | 1M | $4 / $20 | $0.20 |
| Sonnet 5.5（默认 Sonnet） | `claude-sonnet-5-5` | 1M | $2 / $10 | $0.10（2026-10 减半） |
| **Haiku 5.5**（默认 Haiku，v2.1.293） | `claude-haiku-5-5` | 1M | $0.10 / $0.50（超过 10 万 token 的请求为 $0.50 / $2.50） | — |

- `/model` 切换模型，`/effort` 调推理强度（low → max），`maxEffortLevel` 可设上限。
- 订阅用户（Pro/Max）受 5 小时与每周额度限制，这是社区头号痛点（见 [11](../11-community-pulse.md)）。
- `/cost` 能看到 prompt cache 命中率和缓存未命中的可能原因（v2.1.260）；`promptCacheTtl` 可设为 1 小时。
- **子 Agent 可以单独指定 effort**（v2.1.292，Agent 工具的 `effort` 参数）：配合 Haiku 5.5，可以让检索类子 Agent 用便宜模型、低 effort，主会话用 Opus 5.5。
- Max 和 Team 订阅开始每月附带 API 额度（Max 5x 100 美元、Max 20x 200 美元、Team 最多 500 美元）**[一手：Anthropic 公告]**。

## 3. 能力全景

### 3.1 指令与记忆
| 机制 | 说明 |
|---|---|
| `CLAUDE.md` | 托管策略 / 用户（`~/.claude/CLAUDE.md`）/ 项目（`./CLAUDE.md` 或 `./.claude/CLAUDE.md`）/ 本地（`CLAUDE.local.md`）四层；支持 `@path` 导入 |
| **AGENTS.md** | v2.1.277 起：项目**没有** CLAUDE.md 时读取 AGENTS.md；两者都有时默认只读 CLAUDE.md。可在 `/config` → Project instructions 改为 `claude-md-and-agents-md` |
| `.claude/rules/*.md` | 用 `paths:` glob 让规则只在处理匹配文件时加载 |
| 子目录 CLAUDE.md | Claude 读到该目录文件时按需加载；`claudeMdExcludes` 可排除不相关的 |
| Auto memory | Claude 自己记录的经验（按仓库存储，worktree 间共享），每次加载前 200 行或 25KB |

### 3.2 扩展
| 机制 | 何时用 | 上下文成本 |
|---|---|---|
| Skills | 可复用的流程、领域知识 | 低：常驻的只有描述 |
| Subagents | 隔离大量中间结果（检索、评审） | 与主会话隔离 |
| Hooks | 必须每次执行的规则 | 零（除非返回内容） |
| MCP | 连接外部系统 | 低：启动时只加载工具名，schema 按需加载 |
| LSP 插件 | 跳转定义、查引用、编辑后诊断 | 低，而且能减少文件读取 |
| 插件 | 打包分发以上所有东西 | 取决于内容 |
| Output style | 全局改变语气、长度、格式 | 每次请求都有 |
| Mods（v2.1.287） | 用 TypeScript 改界面（面板、按钮）和更深层的行为 | — |

### 3.3 并行与自动化（5 种并行方式）
| 方式 | 一句话 | 状态 |
|---|---|---|
| Subagents | 会话内委派，返回摘要 | 稳定 |
| Agent View（`claude agents`） | 一个界面派发、监控多个后台会话 | 研究预览 |
| Agent Teams | Lead 分配任务，队员互发消息、共享任务列表 | 实验，默认关闭；**不自动用 worktree 隔离** |
| Dynamic Workflows | Claude 写脚本编排大量子 Agent，并交叉验证结果 | 稳定（`/workflows`） |
| Projects | claude.ai/code 或桌面 App 里的长期对话，在云端开并行线程 | 公测（Pro/Max） |

配套：`--worktree`（`-w`）、`worktree.sparsePaths`（大仓库稀疏检出）、跨会话消息、`/batch`（把一个大改动拆给 5–30 个 worktree 子 Agent）、`/loop` 与 Routines（定时）、`/goal`（设完成条件，由独立评估器每轮检查）、Monitor 工具（订阅后台脚本事件）。

### 3.4 评审与安全
- `/code-review`（新鲜上下文找 bug，`--max-findings` 控制数量）、`/code-review ultra` 和 `claude ultrareview`（云端多 Agent 深度评审，可在 CI 里跑）、`/security-review`、`/simplify`。
- **Auto mode**（v2.1.283 起为交互会话默认）：分类器代替人工审批，详见 [06](../06-hooks-and-guardrails.md#4-auto-mode实测数据)。
- 沙箱：macOS Seatbelt / Linux bubblewrap，可设网络白名单（`sandbox.network.strictAllowlist`），可屏蔽凭证（`sandbox.credentials`）。
- `--safe-mode`：禁用所有自定义内容排查问题；`--restricted`：去掉执行类工具；`--bare`：脚本调用时跳过 hooks、LSP、插件。

### 3.5 诊断与维护
| 命令 | 用途 |
|---|---|
| `/context` | 看上下文各部分占用 |
| `/doctor prompt-audit` | 检查 CLAUDE.md、Skills、Agents 中“为旧模型写的”提示写法（v2.1.283） |
| `/skill-doctor` | 找出没用到的 Skill 及其上下文成本 |
| `/insights` | 回顾近期会话，估算 auto mode 能省掉多少次确认 |
| `/fewer-permission-prompts` | 扫描历史，生成只读命令白名单 |
| `claude plugin validate / eval` | 校验插件，并对插件跑评测打分 |
| `/code-review --max-findings <n>\|all` | 控制评审报告的问题数量；中等 effort 下对 Opus 5.5 和 Sonnet 5.5 也会报告清理类问题和违反 CLAUDE.md 约定的问题（v2.1.290） |

## 4. 用法要点（官方最佳实践精华）

1. **给它一个能自己跑的检查**：测试、构建退出码、截图对比。约束力从弱到强：写在提示里 → `/goal` → Stop hook → 独立验证子 Agent。
2. **探索 → 计划 → 实现 → 提交**。一句话能说清的改动就跳过计划。`Ctrl+G` 可以在编辑器里直接改计划。
3. **大功能先让它采访你**：“用 AskUserQuestion 详细采访我……最后写成 SPEC.md”，然后**开新会话**按 Spec 实现。
4. **积极管理上下文**：不相关的任务之间 `/clear`；同一问题纠正两次还错，就 `/clear` 后用更好的提示重来；`/btw` 问的问题不进入上下文。
5. **CLAUDE.md 逐行问自己**：“删掉这行会不会出错？”不会就删。规则被忽略往往说明文件太长。
6. **优先用 CLI**（`gh`、`aws`……），这是最省上下文的接外部服务方式。
7. **Writer / Reviewer 分离**：一个会话写，另一个新会话审；评审子 Agent 要告诉它“只报影响正确性的问题”，否则会过度挑刺。
8. **批量改动**：先让 Claude 列出文件清单，用 `claude -p` 循环处理；在前 2–3 个文件上调好提示词再全量跑。

## 5. 2026 下半年的重要变化

| 变化 | 说明 | 证据 |
|---|---|---|
| **Opus 5.5 / Sonnet 5.5** | Opus 5.5“在大多数工作上达到 Fable 5.1 水平”，价格比 Opus 5 便宜；写作更清楚，长任务更稳；有测试者在不到一天内完成了 68 万行的代码迁移 | [一手：Anthropic] |
| **auto mode 成为默认**（2026-08） | 交互会话默认由分类器审批 | [一手] |
| **Claude Projects**（2026-09 公测） | 在桌面 App 和 Web 中，一个对话就是一个项目，Claude 自动拆成线程、作为并行云端会话运行，你离开后也继续 | [一手] |
| **Mods**（v2.1.287） | 用 TypeScript 修改界面和更深层的行为，社区已经做出了在 Claude Code 里跑的俄罗斯方块 | [一手] |
| **Claude Mods 与内置的“You should know”**（v2.1.287–2.1.289） | Mods 让插件可以修改更深层的行为；内置 Mod“You should know”让一个旁观的子 Agent 帮你盯住你和 Claude 可能遗漏的事（`/plugin enable cc-plugin-you-should-know@builtin`） | [一手] |
| **Managed Agents 接入**（v2.1.290） | `/claude-api managed-agents-onboard` 可以把文档或控制台模板直接变成托管 Agent 的配置（见 [16 自建 Agent](../16-building-agents.md)） | [一手] |
| 无人值守和交互会话区别对待（v2.1.289–2.1.290） | 后台命令的时间限制只用于 `-p`、Agent SDK、CI 和云端会话；WebSearch 额度改为按小时恢复（每小时 100 次） | [一手] |
| auto mode 的长会话处理（v2.1.289） | 会话太长、客户端安全分类器审不过来时，会先压缩而不是逐次弹出确认或失败 | [一手] |
| 自然语言写的 Hook 更可靠（v2.1.294） | 修复了写成指令（如“Block commands that…”）的 `prompt` / `agent` Hook 放行了本该拦截的操作；Stop Hook 写成“构建失败就继续”时，Claude 更少提前停下 | [一手] |
| 原生读取 AGENTS.md（v2.1.277） | 早期版本曾出现“只在开启遥测时才读 AGENTS.md”的 bug，已修复 | [一手 + 社区] |

**Opus 5.5 的官方用法建议**（[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)）**[一手]**：
- 一条消息给出完整任务、完成标准和停下来的条件；
- 删掉“think hard”这类话，改用 effort 控制；
- 运行中可以直接追加消息；
- 在 CLAUDE.md 里写停止规则；
- 长任务把清单写进 TASKS.md；
- 规定总结格式为“Blocked on me / Changed / Found”；
- 评审只列“会因此拒绝合并”的问题；
- 要求它标出无法确认的内容。

本仓库的模板已采用这些做法。

## 6. 已知问题与社区反馈

- **额度**：Max 订阅“几天就用完周额度”是 issue 区点赞最高的问题（1498 个赞）；中文用户还普遍遇到**封号** **[社区]**。
- **Harness 开销大** **[社区：原文]**：Systima 实测，在你开口前 Claude Code 就发送约 33k token（OpenCode 约 7k），而且会在会话中反复重写缓存。本仓库在云端环境复现了同一量级（约 31.6k，其中约 26k 是工具定义，见 [19](../19-experiments.md)）。应对：精简 CLAUDE.md 和 MCP，开始前定好模型和 effort，用 `/cost` 观察缓存；headless 和 CI 场景用 `--tools=` 只开需要的工具。
- **透明度争议** **[社区：原文]**：v2.1.196 被逆向发现会根据 API 地址和时区，悄悄改变系统提示里日期字符串的写法（疑似为了识别蒸馏），HN 2445 票。阿里以“后门风险”为由禁止员工使用 Claude Code **[二手]**。
- **auto mode 被绕过** **[社区：原文]**：Embrace The Red 用“总结网页 → 让 Claude 自己写解码脚本并在攻击者目录里运行 → 被同名 `struct.py` 劫持”的链条，在小样本上做到了 60–80% 的成功率。**auto mode 不能代替隔离。**
- **Opus 5.5“太独立”**：有用户反馈它在 auto mode 下越权，授权在一个区域执行的操作被它扩展到了另外 5 个区域 **[社区]**。
- **质量波动**：“2 月更新后无法胜任复杂工程任务”（583 个赞）；附和用户、口头禅等问题 **[社区]**。
- **checkpoint 不跟踪 Bash 造成的文件改动**，它不能代替 git **[一手]**。

## 7. 推荐起步配置

```bash
# 1. 项目里生成 CLAUDE.md 初稿，再人工删减
/init
# 2. 装对应语言的 LSP 插件（以 TypeScript 为例）
/plugin install typescript-lsp@claude-plugins-official
# 3. 常用官方插件
/plugin install code-review@claude-plugins-official
/plugin install claude-md-management@claude-plugins-official
# 4. 让 Claude 推荐本项目适合的自动化
/plugin install claude-code-setup@claude-plugins-official
```

模板见 [templates/generic](../../templates/generic/)。

## 来源

- [anthropics/claude-code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- 官方文档：[Best practices](https://code.claude.com/docs/en/best-practices)、[Run agents in parallel](https://code.claude.com/docs/en/agents)、[Memory](https://code.claude.com/docs/en/memory)、[Extend Claude Code](https://code.claude.com/docs/en/features-overview)、[Large codebases](https://code.claude.com/docs/en/large-codebases)
- [Mods 源码](https://github.com/anthropics/claude-code/tree/main/mods)
- [GitHub issues（按点赞排序）](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- [Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)、[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)、[Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)、[隐写标记](https://thereallo.dev/blog/claude-code-prompt-steganography)、[Breaking auto mode](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)
- [Latent Space：Claude Code's Next Era](https://www.latent.space/p/thariq)
