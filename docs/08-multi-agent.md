# 08 · 多 Agent 与并行

> 核实时间：2026-10-08。
> 一句话：**并行能提高吞吐量，但评审是瓶颈。只在任务彼此独立时并行。**

## 1. 证据

| 来源 | 发现 |
|---|---|
| Anthropic C 编译器项目 **[一手]** | 16 个 Opus 4.6 实例并行约 2 周，约 2000 个会话，20 亿输入 token 和 1.4 亿输出 token，花费约 2 万美元，写出 10 万行的 Rust C 编译器。**专业分工有效**；但当所有 Agent 卡在同一个瓶颈上时会互相覆盖修改 |
| **AI Agent PR 的合并冲突**（arXiv 2607.04697，33,596 个 Agent PR）**[研究：摘要原文]** | 40.2% 的仓库出现过同时活跃的 Agent PR。真实重放 747 次三方合并：**同一种 Agent 的并发 PR 冲突率 19.8%，不同 Agent 之间 41.7%**；84.4% 的冲突文件是源代码，约 42% 是结构性冲突（修改/删除、同时新增） |
| **CodeCRDT**（arXiv 2510.18893，600 次实验）**[研究：摘要原文]** | 有的任务最多**加速 21.1%**，有的任务反而**慢 39.4%**；语义冲突率 5–10%。成败取决于任务结构 |
| **Co-Coder**（arXiv 2606.00953）**[研究：摘要原文]** | 先用静态分析建依赖图，按内聚度切分任务再并行：相比顺序执行、按文件并行以及 **Claude Code Agent Teams**，通过率最多 +14%、提速最多 2.1 倍、API 成本最多 −35%；依赖越密的项目收益越大 → **怎么切分比开多少个 Agent 更重要** |
| Systima token 实测 **[社区：原文]** | 同一个小任务直接做花 12.1 万 token，分给 2 个子 Agent 做花 **51.3 万**（每个子 Agent 每轮都重读自己的系统提示和工具定义） |
| HN 与 Lobsters 实践者 **[社区]** | 对正确性要求高的工作上，2–3 个专注的 Agent 比 6–8 个互相竞争的更可靠；“瓶颈在**理解**而不在生成，Agent 集群只加快生成”；有人一下开了 7 个子 Agent，还没完成就把额度烧光了 |
| Anthropic 对 Opus 5.5 的建议 **[一手]** | 审计、迁移、跨大代码库的评审适合拆给子 Agent 并行，**但主 Agent 要逐个检查子 Agent 交回的证据**，最后汇总成一张表 |
| Anthropic 多 Agent 研究系统（2025-06）**[一手：工程博客]** | Opus 4 主 Agent 加 Sonnet 4 子 Agent，在内部研究评测上比单 Agent 的 Opus 4 **高 90.2%**；BrowseComp 上 95% 的表现差异由三个因素解释，**仅 token 用量就占 80%**；Agent 的 token 消耗约是聊天的 4 倍，多 Agent 约 **15 倍**。早期失败：简单问题也开 50 个子 Agent、子 Agent 之间重复劳动、互相发太多消息 |
| Cognition《Don't Build Multi-Agents》（2025-06）**[社区：厂商博客原文]** | 两条原则：“共享上下文，而且要共享完整的执行轨迹，而不只是消息”；“行动隐含决策，相互冲突的决策带来坏结果”。例子：做 Flappy Bird，一个子 Agent 画出马里奥风格的背景，另一个做出的鸟风格不搭，主 Agent 拼不起来 |
| Claude Code Agent Teams 文档 **[一手]** | 建议起步 3–5 个队员，每人 5–6 个任务；“3 个专注的队员常常胜过 5 个分散的”；token 成本随队员数**线性增长**；新手先从**研究和评审**开始，不要一上来就并行写代码 |
| 本仓库实测（E2）**[经验：实测]** | 同一个只读调查任务，直接做与拆给 2 个子 Agent 的成本和结果对比，见 [19 实测记录](19-experiments.md#5-e2子-agent-的成本) |

### 两种立场怎么调和

Anthropic 的“多 Agent 提升 90%”和 Cognition 的“不要做多 Agent”看似矛盾。其实两者说的是**不同性质的任务**：

| | 读为主（研究、调查、评审、审计） | 写为主（实现功能、重构） |
|---|---|---|
| 子任务之间 | 基本独立，结果可以简单合并 | 每个动作都隐含设计决策，彼此会冲突 |
| 并行的收益 | 覆盖面变大，相当于多花 token 换更多信息（token 用量解释了 80% 的差异） | 风格、接口、假设不一致，合并时要返工 |
| 推荐 | 并行子 Agent，**每个只交回压缩后的结论和证据** | 单线程 Agent；或者先由一个 Agent（或人）定好接口，再按模块并行 |

这也解释了 Anthropic 对 Opus 5.5 的建议为什么集中在审计、迁移和评审上：这些都是“读为主、可以按文件切开”的任务。

> 上一版里“并行加速 11–52%、耦合任务慢 5.8%”这两个数字找不到出处，已删除。

## 2. Claude Code 的 5 种并行方式（官方文档 [一手]）

| 方式 | 谁来协调 | Agent 之间通信 | 文件隔离 | 状态 |
|---|---|---|---|---|
| **Subagents** | Claude 在一个会话内委派、收集结果 | 只向父会话汇报 | 可以给每个子 Agent 配 worktree | 稳定 |
| **Agent View**（`claude agents`） | 你派发独立任务，回头再看 | 只向你汇报（可用跨会话消息） | 派发后的会话会自动进入独立 worktree | 研究预览 |
| **Agent Teams** | 由 Claude 担任 lead，负责计划、分配和监督 | 队员之间直接发消息，共享任务列表 | **不自动隔离**，需要按文件划分任务 | 实验，默认关闭 |
| **Dynamic Workflows** | 由一个**脚本**持有计划，而不是靠 Claude 一轮轮判断 | 结果之间交叉验证 | — | 稳定 |
| **Projects** | 一个长期对话，Claude 自己拆成线程，作为并行云端会话运行，你离开后也继续 | 共享仓库、指令和记忆 | 云端会话 | 公测（2026-09） |

辅助：`--worktree`、`.worktreeinclude`（指定复制进 worktree 的未跟踪文件）、`worktree.sparsePaths`、跨会话消息、`/batch`（拆成 5–30 个 worktree 子 Agent）。

**怎么选**：
- 支线调查会把主对话塞满 → **Subagent**
- 手上有几个独立任务，想交出去、只在需要时介入 → **Agent View**
- 一个大型迁移或审计，要处理成百上千个文件 → **Dynamic Workflow**（或 `/batch`，或用 `claude -p` 写循环）
- 需要多个 Agent 持续协作讨论 → **Agent Teams**（实验功能，token 消耗大）

## 3. 第三方编排工具

| 工具 | 形态 | 评级 |
|---|---|---|
| [Claude Squad](https://github.com/smtg-ai/claude-squad) | tmux + worktree 的终端 TUI，支持 Claude Code、Codex、Gemini、Aider | 🧪 |
| [Conductor](https://conductor.build) | macOS 桌面应用，每个 Agent 一个 worktree | 🧪 **[二手]** |
| [container-use](https://github.com/dagger/container-use)（Dagger） | 每个 Agent 一个容器加 git 分支 | 🧪（需要隔离运行环境时） |
| [Happy Coder](https://github.com/slopus/happy) | 在手机或桌面上并行控制多个 Claude Code | 👀 |
| [Vibe Kanban](https://github.com/BloopAI/vibe-kanban) | 开源看板 | ⛔ **已宣布停止维护** |
| Cursor 3 Agents Window、Codex 指挥中心 | 厂商内置 | 🧪 |

> 厂商内置的并行能力越来越强，第三方编排工具的生存空间在缩小。先用内置功能，确实不够再考虑第三方。

## 4. 实操建议

1. **只并行彼此独立的任务**：不同模块、不同文件、不同仓库。共享文件多的任务应串行。
2. **2–3 个起步**：先确认自己有足够的评审带宽。
3. **每个 Agent 都要有验证闭环**，否则并行只会更快地制造 bug。
4. **一写一审**：Writer / Reviewer 分在两个会话，比“多个 Writer”更稳。
5. **注意环境成本**：每个 worktree 可能需要重建依赖或缓存（大型 Unity、C++、Node 项目尤其明显），可以用 `.worktreeinclude` 和稀疏检出缓解。
6. **监控成本**：并行成倍消耗额度，可以用 `/usage` 和 `ccusage` 看。

## 5. 其他厂商的并行与多 Agent 方式（2026-10）

| 方式 | 说明 | 来源 |
|---|---|---|
| Codex 云端任务 + **可复用的云端环境** | 准备一次开发环境，之后每个新任务在独立的隔离工作区里启动；适合同时派出多个云端任务 | learn.chatgpt.com **[一手]** |
| OpenAI **Dots** | 常驻 Agent 可以在后台开多个 Agent 并行处理几件事，你继续和它对话 | 同上 |
| OpenAI Responses **多 Agent beta**、Agents API 的多 Agent 编排 | API 层的多 Agent | developers.openai.com **[一手]** |
| Claude **Managed Agents 多 Agent 会话** | 协调者 + 子 Agent 的“名册”；官方建议先只放 `self`（让 Agent 委派给自己的副本），再把读大量资料的子任务交给更便宜的 worker 模型（如 Haiku 5.5）；一个预算由所有线程共享 | Claude API 官方 Skill **[一手]** |

## 6. 操作手册：从一个大任务到并行执行

1. **先画依赖**：让 Agent 列出要改的模块和文件，以及它们之间的调用和数据依赖（一张表或 Mermaid 图），人确认 **[经验，思路来自 Co-Coder 研究]**；
2. **按内聚度切分**：依赖紧密的放在同一个 Agent 里，只把**真正独立**的部分拆出去。共享接口先由一个 Agent 定下来（或人定），其他 Agent 再基于它并行；
3. **算评审带宽**：并行数不超过你当天能认真评审的 PR 数。按每个 PR 100–200 行的切片来算，通常是 2–3 个 **[社区]**；
4. **每个分支都有独立验证**：worktree 里能单独跑编译和测试；否则并行只会更快地制造 bug；
5. **合并顺序**：先合接口和底层，再合上层；每合一个就在主干上跑一次完整测试，冲突交给最了解上下文的那个会话处理；
6. **复盘成本**：用 `/usage`、`ccusage` 对比“并行”与“串行”的 token 和时间。子 Agent 每轮都要重读系统提示和工具定义，小任务拆开反而更贵（同一任务 12.1 万 → 51.3 万 token）**[社区：原文]**。

## 7. 子 Agent 配置手册（Claude Code）

**frontmatter 里最有用的字段** **[一手：文档]**（`.claude/agents/<name>.md`；只有 `name` 和 `description` 必填）：

| 字段 | 用途 | 建议 |
|---|---|---|
| `tools` / `disallowedTools` | 工具白名单 / 黑名单 | 只读调查类的去掉 `Write`、`Edit`；不需要再委派的去掉 `Agent` |
| `model` | `haiku`、`sonnet`、`opus` 或 `inherit` | **读得多、判断少**的交给 `haiku`；评审和验证用和主 Agent 同级或更强的模型 |
| `maxTurns` | 最多轮数 | 防止子 Agent “找不存在的东西”一直找下去（Anthropic 研究系统的失败模式之一） |
| `isolation: worktree` | 在临时 worktree 里运行 | 会改文件的子 Agent 用它，避免和主会话互相覆盖 |
| `effort` | 推理强度 | 机械性任务用 `low` |
| `permissionMode` | 权限模式 | 只读子 Agent 可以用 `plan` |
| `skills` / `mcpServers` | 预加载 Skill、只给这个子 Agent 的 MCP | 把重型 MCP 限定在需要它的子 Agent 上，主会话就不必加载它的工具定义 |

**全局控制**：
- `CLAUDE_CODE_SUBAGENT_MODEL` 统一指定子 Agent 的模型；再加上 `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` 会强制所有子 Agent 使用它；
- 子 Agent 默认最多嵌套 3 层（`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`，设为 1 就禁止嵌套）；最多同时运行 20 个（`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`）；
- **fork**（复制当前对话）会继承父会话的提示缓存，比新开一个子 Agent 便宜，适合需要相同上下文的任务。

**什么时候用子 Agent**（官方文档）：
- 任务会产生大量你不会再看的输出（测试日志、大段文件内容），只需要摘要回到主上下文；
- 需要限制工具或权限；
- 任务自成一体，能用一段摘要交差。

**什么时候不用**：
- 需要反复来回沟通；
- 多个阶段共享大量上下文；
- 改动很小；
- 对延迟敏感（非 fork 的子 Agent 要从零收集上下文）。

## 8. 委派提示的写法

Anthropic 研究系统的经验 **[一手]**：**委派写得含糊，子 Agent 就会重复劳动或漏掉内容。** 每次委派写清四件事：

```text
目标：找出 src/payments/ 中所有直接拼接 SQL 的位置。
输出格式：表格，列为 file:line、拼接的变量、变量是否来自用户输入（是/否/不确定）。
工具和方法：先 Grep "execute(" 和 "f\"SELECT"，再逐个 Read 上下文；不要运行任何命令。
边界：只看 src/payments/，不看 tests/；不要修改任何文件；最多 15 次工具调用。
```

**按复杂度给配额**（同一来源）：
- 简单的事实查找：1 个 Agent，3–10 次工具调用；
- 比较类任务：2–4 个子 Agent，每个 10–15 次调用；
- 复杂研究：可以超过 10 个子 Agent。

不写这些规则时，模型容易在简单问题上过度投入。

**汇总时**：要求子 Agent 交回**证据**（`file:line`、命令输出），主 Agent 逐条核对后再采纳。子 Agent 的大段输出可以写进文件，只把路径交回来，减少主上下文的占用。

## 9. 两个值得照搬的并行模式

1. **按视角并行评审**：三个子 Agent（或队员）分别只看安全、性能、测试覆盖，主 Agent 汇总。单个评审者往往一次只盯一类问题 **[一手：Agent Teams 文档]**。
2. **相互竞争的假设**：根因不明时，让 3–5 个 Agent 各持一种假设，**互相反驳**，最后写下“存活下来”的结论。单个 Agent 容易找到一个说得通的解释就停下，后续调查也会被它锚定 **[一手：同上]**。

用 Agent Teams 时，可以用 Hook 做质量闸门：
- `TaskCompleted` 以退出码 2 退出，可以阻止任务被标记完成，比如测试没过；
- `TeammateIdle` 以退出码 2 退出，可以让队员继续工作。

## 来源

- [Run agents in parallel](https://code.claude.com/docs/en/agents)、[Agent teams](https://code.claude.com/docs/en/agent-teams)、[Dynamic workflows](https://code.claude.com/docs/en/workflows)、[Worktrees](https://code.claude.com/docs/en/worktrees)
- [Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic，2025-06）、[Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)（Cognition，2025-06）
- [Subagents](https://code.claude.com/docs/en/sub-agents)（frontmatter、嵌套与并发上限）
- HN：[Parallel coding agents with tmux and Markdown specs](https://news.ycombinator.com/item?id=47218318)、[Embracing the parallel coding agent lifestyle](https://news.ycombinator.com/item?id=45489884)、[Multi-agentic software development is a distributed systems problem](https://news.ycombinator.com/item?id=47761625)（摘要）
- 论文：[arXiv 2607.04697](https://arxiv.org/abs/2607.04697)、[arXiv 2510.18893](https://arxiv.org/abs/2510.18893)、[arXiv 2606.00953](https://arxiv.org/abs/2606.00953)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)
