# 08 · 多 Agent 与并行

> 核实时间：2026-10-08；任务拆分边界于 2026-10-11（UTC+8）对照官方文档复核；10-13 补充按遗漏风险选用及评审输入交接；10-14 复核并行研究的计时、预算、验收与 worktree 状态边界，10-15（UTC+8）补核子Agent启动、权限、并发与恢复契约；其余未重验。
> 一句话：**把可独立验收的工作并行；是否更快，要算到汇总、整合与验收结束，不能只看生成速度。**

## 30 秒选择

✅ 能独立验收、只需回传证据的支线，先用当前会话的子 Agent；Codex 任务需要硬性只读边界时开受限父会话，不把角色名称当沙箱。🧪 需要共享任务协调或可重放的大规模编排，再试 Teams／Workflow。启动前确认审批能送达、结果由谁收集；出现权限等待、缺失汇总或不明写入结果，先停扩量、核对已有动作，再缩回单层委派或串行相关步骤。**[一手；经验：采用判断，依据见 §2.1／§5.1]**

## 1. 证据

| 来源 | 发现 |
|---|---|
| Anthropic C 编译器项目 **[一手]** | 16 个 Opus 4.6 实例并行约 2 周，约 2000 个会话，20 亿输入 token 和 1.4 亿输出 token，花费约 2 万美元，写出 10 万行的 Rust C 编译器。**专业分工有效**；但当所有 Agent 卡在同一个瓶颈上时会互相覆盖修改 |
| **AI Agent PR 的合并冲突**（arXiv 2607.04697，33,596 个 Agent PR）**[研究：摘要原文]** | 40.2% 的仓库出现过同时活跃的 Agent PR。真实重放 747 次三方合并：**同一种 Agent 的并发 PR 冲突率 19.8%，不同 Agent 之间 41.7%**；84.4% 的冲突文件是源代码，约 42% 是结构性冲突（修改/删除、同时新增） |
| **CodeCRDT**（arXiv 2510.18893，600 次实验）**[研究：摘要原文]** | 有的任务最多**加速 21.1%**，有的任务反而**慢 39.4%**；语义冲突率 5–10%。成败取决于任务结构 |
| **Co-Coder**（[论文 v1](https://arxiv.org/html/2606.00953v1)，§4.2/表2）**[研究：正文复核]** | 按依赖切分后，CodeProjectEval 平均单元测试通过比例由 20.1% 到 34.1%，生成阶段用时 2756→1315 秒；**计时排除测试**，不是完整交付提速。此处18项目、各3次，均用 gpt-5-mini；不能当当前 Claude 原生团队效果 |
| **Coding agent teams**（[论文 v1](https://arxiv.org/html/2610.17471v1)，2026-10-12，表4）**[研究：作者实验]** | ProgramBench 的 Sol 单体 PIV：reward .58、$0.38、2.5分钟；仅规划异步团队：.64、$1.24、5.1分钟。**质量提高但更贵、更慢**；各配置未匹配预算。详细口径与正反例见[研究记录](research/2026-10-12-experiment-records.md#外部并行研究预算与交付口径) |
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
| 子任务之间 | 可拆成相对独立的问题（需确认） | 每个动作都隐含设计决策，彼此会冲突 |
| 并行的收益 | 可能扩大覆盖；Anthropic 的 token 用量关联表现方差，不是等预算提速或因果分解 | 风格、接口、假设不一致，合并时要返工 |
| 推荐 | 并行子 Agent，**每个只交回压缩后的结论和证据** | 单线程 Agent；或者先由一个 Agent（或人）定好接口，再按模块并行 |

审计和评审中的独立调查较容易并行；迁移要分开看：调查可读并行，实际修改必须先对齐共享接口、数据契约和依赖顺序，再验证整合结果。**文件不同不代表语义独立**。这与 [Anthropic 研究系统](https://www.anthropic.com/engineering/multi-agent-research-system)及 [Agent Teams](https://code.claude.com/docs/en/agent-teams#when-to-use-agent-teams)对依赖与协调成本的限制一致。**[一手：文档；经验：采用建议]**

> 上一版里“并行加速 11–52%、耦合任务慢 5.8%”这两个数字找不到出处，已删除。

## 2. Claude Code 的 5 种并行方式（官方文档 [一手]）

| 方式 | 谁来协调 | Agent 之间通信 | 文件隔离 | 状态 |
|---|---|---|---|---|
| **Subagents** | Claude 在一个会话内委派、收集结果 | 主会话收集结果；具名 Agent 可传消息 | 可以给每个子 Agent 配 worktree | 会话内委派 |
| **Agent View**（`claude agents`） | 你派发独立任务，回头再看 | 只向你汇报（可用跨会话消息） | 派发后的会话会自动进入独立 worktree | 研究预览 |
| **Agent Teams** | 由 Claude 担任 lead，负责计划、分配和监督 | 队员之间直接发消息，共享任务列表 | **不自动隔离**，需要按文件划分任务 | 实验，默认关闭 |
| **Dynamic Workflows** | 由一个**脚本**持有计划，而不是靠 Claude 一轮轮判断 | 脚本组织结果与交叉验证 | 需另选隔离方式 | 按账户／入口启用 |
| **Projects** | 一个长期对话，Claude 自己拆成线程，作为并行云端会话运行，你离开后也继续 | 共享仓库、指令和记忆 | 云端会话 | 公测（2026-09） |

辅助：`--worktree`、`.worktreeinclude`（复制匹配的忽略文件）、`worktree.sparsePaths`、跨会话消息、`/batch`（拆成 5–30 个 worktree 子 Agent）。

**怎么选**：
- 支线调查会把主对话塞满 → **Subagent**
- 手上有几个独立任务，想交出去、只在需要时介入 → **Agent View**
- 一个大型迁移或审计，要处理成百上千个文件 → **Dynamic Workflow**（或 `/batch`，或用 `claude -p` 写循环）
- 需要多个 Agent 持续协作讨论 → **Agent Teams**（实验功能，token 消耗大）

### 2.1 启动与撤回：后台不等于无人值守

- **普通子 Agent**：审批提示应回主会话；无人值守任务若会需要新审批，先拆出该步骤，别靠扩大权限消除等待。`/tasks` 查看并停止当前会话后台任务，不能把“已派发”当完成。
- **Agent Teams**：仍为实验；开启后，主会话给调用加 `name` 可将子 Agent 转成队员，frontmatter 的 worktree 隔离不能阻止转换。需隔离时让本次调用显式传 `isolation` 并核实际目录，或关闭 Teams。in-process 队员不能由 `/resume`／`/rewind` 恢复。需要可靠续接时先用单层委派；恢复后核实队员与产物再派发，不对旧名单继续发任务。
- **Dynamic Workflow**：适合可重复的批量调查／迁移；需要阶段间人工签字就拆成多个 run。重启可能重跑失败 Agent 之后已完成的 Agent，涉及提交、上传等写入时先按 [20 的对账建议](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)核实际结果，再决定恢复。

依据：[Subagents](https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background)、[Teams 限制](https://code.claude.com/docs/en/agent-teams#limitations)、[Workflow 恢复](https://code.claude.com/docs/en/workflows#which-agents-run-again)，2026-10-15（UTC+8）**[一手；经验：选择]**。局限：不同宿主的提示与结果投递仍有[公开失败报告](research/2026-10-12-experiment-records.md#子agent宿主契约并发权限与恢复)，本轮没有运行客户端。

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

### 工作树管理：何时补 Worktrunk

**🧪 跨终端/IDE/Agent 的目录已难管理时，再试 [Worktrunk](https://github.com/max-sixty/worktrunk/blob/main/README.md)。** 基线是 Git/Codex worktree 与 Handoff，一两项应用内任务通常够用；增量是分支寻址、状态列表和生命周期管理。先在一次性仓库验证原生 Git 可接管；维护成本高于收益就退出。**关键局限**：管理器不增加隔离，[脏子模块误清理的历史修复](https://github.com/max-sixty/worktrunk/releases/tag/v0.80.0)提醒先验删除安全；不清理未知目录，不因拦截关闭防护，Hook/复制 `.env` 仍需逐项审查。**[一手；经验：采用判断，2026-10-12，未安装]**

## 4. 实操建议

1. **按依赖而非文件数决定并行**：先找共享接口、数据和状态，再拆可独立验收的工作；同一写入表面设唯一负责人。不同文件也可能需要串行，同一文件的只读调查则可并行。
2. **并发数随可独立验收的工作调整**：先拆当前瓶颈；只有仍有独立工作、汇总与评审能跟上时才加人。2–3 个只是起步经验，不是最优数量或可靠性保证。**[经验：采用建议]**
3. **每个 Agent 都要有验证闭环**，否则并行只会更快地制造 bug。
4. **按遗漏风险选择独立评审**：复用原请求、现有验收或已确认规格作为判据，别只交同一份计划摘要；接口或行为约束改变时，先更新受影响的后续任务再派发。简单修改已有充分独立检查时，不另开评审会话。现有证据未证明固定“一写一审”普遍更稳，见[输入交接与反证](research/2026-10-12-baml-and-review.md#后续任务相同-brief-与过期接口)。**[研究：采用判断]**
5. **按实际状态决定隔离，不把 worktree 当独立运行环境**：Git 配置默认共享；端口、测试数据库与外置输出目录也不会因换分支自动分开。先核对这些资源的实际目标，再决定拆开运行、只串行相关验证，或复用已有隔离环境。`.worktreeinclude` 只复制匹配的忽略文件，复制配置仍可能指向同一服务；稀疏检出减少检出范围，不隔离服务。缓存能按工具契约共享就保留，别把共享编译缓存和可被另一任务替换的最终产物混为一谈。见[状态边界与反证](research/2026-10-12-experiment-records.md#worktree隔离到哪里配置缓存与被测产物)。**[一手；经验：采用建议]**
6. **监控成本**：先用原生 `/usage`；需要历史诊断时再按 [02](02-models-and-cost.md#31-查异常消耗ccusage-只补历史诊断)试用 ccusage，区分日志估算与账户额度。

## 5. 其他厂商的并行与多 Agent 方式（2026-10）

| 方式 | 说明 | 来源 |
|---|---|---|
| Codex 云端任务 + **可复用的云端环境** | 准备一次开发环境，之后每个新任务在独立的隔离工作区里启动；适合同时派出多个云端任务 | learn.chatgpt.com **[一手]** |
| OpenAI **Dots** | 常驻 Agent 可以在后台开多个 Agent 并行处理几件事，你继续和它对话 | 同上 |
| OpenAI Responses **多 Agent beta**、Agents API 的多 Agent 编排 | API 层的多 Agent | developers.openai.com **[一手]** |
| Claude **Managed Agents 多 Agent 会话** | 协调者 + 子 Agent 的“名册”；官方建议先只放 `self`（让 Agent 委派给自己的副本），再把读大量资料的子任务交给更便宜的 worker 模型（如 Haiku 5.5）；一个预算由所有线程共享 | Claude API 官方 Skill **[一手]** |

### 5.1 Codex 子 Agent：配置作用域先于人数

✅ 当前会话内独立调查可直接委派；自定义角色只在确需复用模型、指令或缩减能力时配置。现行文档与 **Codex 0.162.1 固定源码**均支持 `[agents].max_concurrent_threads_per_session`，旧 `max_threads` 是别名；该字段数的是子线程，不含主线程。默认值随执行后端而异，不把历史“6 个”写成跨宿主保证，也不把并发上限当总费用上限。**[一手：文档／源码]**

**权限在父会话选择。** 角色文件里的 `sandbox_mode`／`approval_policy` 不替换父会话权限；“只读 reviewer”的提示词不构成独立只读沙箱。需要硬性只读时，使用实际只读权限的父会话；交互 CLI 可处理子线程审批，不能展示新审批的非交互入口则会失败。具体有效配置沿 [01](01-agents/codex.md)／[10](10-security.md)核对，不能把 CLI 配置直接套给 ChatGPT Work。**[一手；经验：建议]**

来源：[现行指南](https://learn.chatgpt.com/docs/agent-configuration/subagents#approvals-and-sandbox-controls)与[固定实现／反证](research/2026-10-12-experiment-records.md#子agent宿主契约并发权限与恢复)，2026-10-15（UTC+8）。局限：核过配置与代码路径，不等于各账户、宿主及已安装版本均已验证。

## 6. 操作手册：从一个大任务到并行执行

1. **先画依赖**：让 Agent 列出要改的模块和文件，以及它们之间的调用和数据依赖（一张表或 Mermaid 图），人确认 **[经验，思路来自 Co-Coder 研究]**；
2. **按内聚度切分**：依赖紧密的放在同一个 Agent 里，只把**真正独立**的部分拆出去。共享接口先由一个 Agent 定下来（或人定），其他 Agent 再基于它并行；
3. **算整合与评审负担**：按行为、接口与风险划可验收切片，不按固定代码行数定并发；独立模块可并行，共享设计决定先收敛，评审积压就减少同时在写的任务 **[经验：采用建议]**；
4. **每个分支的验证要指向自己的产物**：除了在该 worktree 编译，还要核对启动目录、实际服务地址、数据目标与输出路径；共享端口上的旧服务不能算本分支验收。不能可靠区分时只串行该验证步骤，代码调查和独立实现仍可并行；合并后重新构建并验收整合产物，不能直接沿用子任务绿灯。Playwright 的服务复用只检查可用性，不证明 checkout 身份，见上述[状态边界记录](research/2026-10-12-experiment-records.md#worktree隔离到哪里配置缓存与被测产物)。**[一手；经验：采用建议]**
5. **合并顺序**：先合接口和底层，再合上层；每合一个就在主干上跑一次完整测试，冲突交给最了解上下文的那个会话处理；
6. **比较到验收结束**：同一需求、相同验收下分别看正确性、总等待、总费用及人的评审/返工；区分固定总计算预算与多花计算换覆盖，不把 worker 用时之和当交付等待。只更快生成、却把时间移到整合修复时，不算交付提速；现有研究未证明人的评审负担不增加。**[研究：口径；经验：采用建议]**

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

**会话控制（2026-10-15 UTC+8 文档复核）**：
- `CLAUDE_CODE_SUBAGENT_MODEL` 统一指定子 Agent 的模型；再加上 `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` 会强制所有子 Agent 使用它；
- 默认嵌套 3 层，`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1` 禁止继续嵌套；普通 `Agent` 启动在已有 20 个运行时拒绝，可用 `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` 调整。**这不是全局硬上限**：手动 `/subtask` 与 resume 可越过，Teams／Workflow 另计，ultracode 不受此限；遇限额先收结果，不自动加大值。
- **fork** 继承当前对话与缓存，适合需要相同上下文的支线；缓存复用不证明整个任务更便宜。Agent View 开启时 `/subtask` 是会话内 fork，`/fork` 是独立后台会话，别混用恢复与生命周期假设。

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

## 10. 强 Agent 上何时不拆分

如果单个 Agent 已能保留必要上下文并完成任务，拆分可能只增加交接和审查成本。不要按模型角色名称预设多 Agent 更可靠；同一计划派生的实现与评审也可能共享盲点。Superpowers 的真实配置、使用者失败反馈及 Codex + GPT-6 Astra 下的条件判断见 [24](24-community-workflows.md)。**[经验：采用判断，未做该组合对照]**

## 来源

- [Run agents in parallel](https://code.claude.com/docs/en/agents)、[Agent teams](https://code.claude.com/docs/en/agent-teams)、[Dynamic workflows](https://code.claude.com/docs/en/workflows)、[Worktrees](https://code.claude.com/docs/en/worktrees)
- [Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic，2025-06）、[Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)（Cognition，2025-06）
- [Subagents](https://code.claude.com/docs/en/sub-agents)（frontmatter、嵌套与并发上限）
- HN：[Parallel coding agents with tmux and Markdown specs](https://news.ycombinator.com/item?id=47218318)、[Embracing the parallel coding agent lifestyle](https://news.ycombinator.com/item?id=45489884)、[Multi-agentic software development is a distributed systems problem](https://news.ycombinator.com/item?id=47761625)（摘要）
- 论文：[arXiv 2607.04697](https://arxiv.org/abs/2607.04697)、[arXiv 2510.18893](https://arxiv.org/abs/2510.18893)、[arXiv 2606.00953](https://arxiv.org/abs/2606.00953)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)
