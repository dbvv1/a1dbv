# 08 · 多 Agent 与并行

> 核实 2026-10-08；复核 2026-10-11、10-13、10-14、10-15、10-18、10-22、10-23、10-24、10-25（UTC+8）；依据为官方文档、厂商实践报告、公开研究、社区实践与本仓实际生产，部分外链与当前模型效果未复验。**把可独立验收的工作并行；是否更快，要算到汇总、整合与验收结束，不能只看生成速度。**

## 30 秒选择

- **✅〔10 月修订〕同一仓库并行多个独立目标时，先沿用原生 Agent 按需委派；由一位主 Agent 持有共享决定和最终整合，只把能独立验收或独立调查的部分拆出去。** 需要互不覆盖的独立写入面时再开 worktree；共享接口、验收和每个写入面的负责人先对齐。并行写不等于并行合 main，交回完整产物与证据后按实际文件重叠串行整合，详见 [§6](#6-操作手册从一个大任务到并行执行)。
- **🧪〔跨代保留〕确需共享任务协调或可重放的大规模编排，再试 Teams／Workflow。** 是否保留看质量、总成本和到整合验收结束的用时，不按角色数判断。
- **⛔〔跨代保留〕权限等待、结果缺失或不明写入时停止扩量，先核已有动作。** 启动前确认审批与结果收集路径；硬性只读用实际受限环境，不靠角色名称。

代际复核：2026-10-21，当前原生多模型 harness／Opus 5.5；标签定义见 [00](00-state-of-ai-coding.md#30-秒结论)。

**依据**：[一手／研究／经验] 条件建议，依据见本页 §1—§10；运行边界见 §2.1／§5.1；本仓实际生产见 §6；核实 2026-10-25。

## 当前最高水平与默认的变化

<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-22 -->

**默认让原生主 Agent 按需协调完整任务，不把减少人工编排误解成限制自主规模。** 近期领先参照是 Cursor 团队 Jediah Katz 等人的 9-23 原文：撤掉强制鼓励探索委派的提示，由已学会该能力的模型选择；不是取消子 Agent。

**独立实践支持保留自主大轮次。** Willison 的 Battle Drones（10-20）用 Opus 5.5／Ultracode 协调多 Agent 过夜修改，作者之后试玩；这支持“人审结果、需要时改目标”，不证明多 Agent 比单体更快。

| 同题选择 | 比较后的默认与撤回 | 第二来源及边界 |
|---|---|---|
| 原生按需，还是显式固定分工 | 原生能覆盖问题就沿用；漏掉独立证据或关键路径等待时才明确拆分 | Willison 的实际采用与 Cursor 的提示删减相互补充；一位实践者不是普遍质量保证 |
| 为质量加队员，还是为速度加队员 | 先找任务瓶颈；费用、质量、整合后等待分别验 | Cohere Labs 的 10-12 评测出现质量提高但更慢、更贵的团队；独立于被评厂商，但自身也是模型厂商，且所测为较早代模型 |
| 让人转发每次交接，还是由 lead 汇总 | ✅ 由 lead 收集证据、处理矛盾；确需逐次人判断才试人工中转 | APM 作者的配对研究中控制感与客观结果并不同步；五月至六月的整框架比较不是当前原生团队的单因素实验 |

主流参照是独立调查、worktree 与定向 review；可行基线是一位主 Agent 连续完成实现和验证。本仓推荐属于与近期领先机制比较后的条件默认，统一最佳拓扑仍未知。对应[C09卡](collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c09--多-agent)、[独立来源与代际边界](research/2026-10-12-experiment-records.md#p70原生协调与人工中转)；权限、恢复与隔离仍按下文入口契约，不由效果案例推定。

**依据**：[一手：厂商自报] Cursor 团队 [9-23 原文](https://cursor.com/blog/improved-token-efficiency)；[社区：作者实践] Willison [Battle Drones（10-20）](https://simonwillison.net/2026/Oct/20/battledrones/)；[研究] [Cohere Labs 的 10-12 评测](https://arxiv.org/html/2610.17471v1)、[APM 作者的配对研究](https://agentic-project-management.dev/research/)、[原生协调与人工中转的独立来源比较](research/2026-10-12-experiment-records.md#p70原生协调与人工中转)；核实 2026-10-22。



### 旧角色链要不要改成 Skill？

**🧪 先试合并共享同一任务状态的串行角色，不把每个子 Agent 原样改名为 Skill。** 适合自建的“规划→领域判断→执行”链；独立评审、可并行调查和确需权限隔离的执行者仍有单独上下文的理由。Anthropic 10-22 迁移指南讨论企业 Agent 架构，不能直接证明编码任务的最优拓扑。

1. **先保知识与行为，再去角色包装。** 原领域规则、工具和验收不变，比较原链与主循环＋按需知识；权限与硬前提由实际工具执行，不随提示删减撤掉。
2. **分清少交接的收益与 Skill 的收益。** 替代路线成立后，若要判断知识包是否必要，再保持工具、去掉候选 Skill 比较；没有独有知识就可只留工具，不强制造一个包。
3. **检查旁路，不只看总分。** 主循环新拿到工具后，可能绕过仍需其他知识的邻接任务；看原来跨角色的数据是否真的传到最终结果。发现必要行为退化，就修路由／知识或恢复原分工。

这些操作借自固定迁移步骤，是源码／方法核查，**本仓未运行模型迁移对照**；该套件自称不维护的参考实现，不作为生产依赖推荐。

Kim Olsen 的 10-23 报价 Agent 试验恰好说明归因问题：单循环每次加载全部 Skill，观察到的差异不能归给按需加载；多体组又只转发问题、不传原邮件且用自由文本交接。它支持检查交接丢失，不证明单循环普遍胜过良好分工。

以上是官方指南、固定开源步骤、作者试验与 Reddit 原讨论的核查；中文检索仅找到转述，未作独立采用证据。本仓未安装迁移套件，未新增评估或审批流程。

**依据**：[一手] Anthropic [10-22 迁移指南](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)；[一手／研究] [固定迁移步骤](https://github.com/anthropics/single-agent-loop-kit/blob/c43796287b83bec847db923f07131d1cc8de750d/skill/steps/03-fold.md)源码；[社区：作者合成任务实测，非编码对照] [Kim Olsen 的 10-23 报价 Agent 试验](https://dev.to/kimolsen/ai-sales-agent-test-four-subagents-vs-one-loop-with-skills-58eg)；[社区] [Reddit 原讨论](https://www.reddit.com/r/ClaudeAI/comments/1xdwquj/anthropics_new_guide_oct_22_argues_most_agents/)；[经验] 采用范围；核实 2026-10-24。


## 1. 证据

**这些证据共同支持的默认是：先减少共享写入与语义依赖，再按任务的整合与质量代价决定并行程度。**

| 来源 | 发现 |
|---|---|
| Anthropic C 编译器项目 | 2026-02-05，Opus 4.6 多实例、跨会话编译器压力实验展示专业分工；兼容、性能与修改回归仍有缺口，同一瓶颈会引起互相覆盖。项目日历跨度不是单次自主时长，产出规模不是质量证明 |
| **AI Agent PR 的合并冲突**（论文 v2） | 抽样 747 对、可评估 716 对：同类 Agent 为 119/601，不同 Agent 为 48/115。历史同时开放 PR 的文本合并观察不能支持同厂／异厂团队配对选择；先减少共享修改与语义依赖 |
| **CodeCRDT**（论文 v1） | 六项小型 UI 任务、两模式、各 50 次；有任务加速 21.1%，有任务慢 39.4%。终点为模型评估完成，不是交付验收；语义冲突仅 60/600 初步人工抽查，不能当完整冲突率。按具体任务的整合与质量代价选择 |
| **Co-Coder**（论文 v1，§4.2/表2） | 按依赖切分后，CodeProjectEval 平均单元测试通过比例由 20.1% 到 34.1%，生成阶段用时 2756→1315 秒；**计时排除测试**，不是完整交付提速。此处18项目、各3次，均用 gpt-5-mini；不能当当前 Claude 原生团队效果 |
| **Coding agent teams**（论文 v1，2026-10-12，表4） | ProgramBench 的 Sol 单体 PIV：reward .58、$0.38、2.5分钟；仅规划异步团队：.64、$1.24、5.1分钟。**质量提高但更贵、更慢**；各配置未匹配预算。详细口径与正反例见[研究记录](research/2026-10-12-experiment-records.md#外部并行研究预算与交付口径) |
| Systima 历史报告，2026-07-12 | Claude Code 2.1.207 的单次小任务，直接做与双子 Agent 的累计输入量为 12.1 万／51.3 万（含缓存）；旧版本、网关和小样本限制见 [S1c](research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)，不是当前费用或额度的固定倍率 |
| HN 与 Lobsters 实践者 | 对正确性要求高的工作上，2–3 个专注的 Agent 比 6–8 个互相竞争的更可靠；“瓶颈在**理解**而不在生成，Agent 集群只加快生成”；有人一下开了 7 个子 Agent，还没完成就把额度烧光了 |
| Anthropic 对 Opus 5.5 的建议 | 审计、迁移、跨大代码库的评审适合拆给子 Agent 并行，**但主 Agent 要逐个检查子 Agent 交回的证据**，最后汇总成一张表 |
| Anthropic 多 Agent 研究系统（2025-06） | Opus 4 主 Agent 加 Sonnet 4 子 Agent，在内部研究评测上比单 Agent 的 Opus 4 **高 90.2%**；BrowseComp 上 95% 的表现差异由三个因素解释，**仅 token 用量就占 80%**；Agent 的 token 消耗约是聊天的 4 倍，多 Agent 约 **15 倍**。早期失败：简单问题也开 50 个子 Agent、子 Agent 之间重复劳动、互相发太多消息 |
| Cognition，2025-06 原文与 2026-04 修订 | 对并行写入的冲突警告仍保留；已采用单一写入者配合其他 Agent 提供分析。评审不预载编码会话，由 diff 重查依据；咨询则需要当前任务上下文。不能把旧文的完整轨迹共享当统一规则；未公开同任务对照产物，见[核查范围](research/2026-10-12-experiment-records.md#cognition上下文按角色选择) |
| Claude Code Agent Teams 文档 | 建议起步 3–5 个队员，每人 5–6 个任务；“3 个专注的队员常常胜过 5 个分散的”；token 成本随队员数**线性增长**；新手先从**研究和评审**开始，不要一上来就并行写代码 |
| 本仓库实测（E2） | 同一个只读调查任务，直接做与拆给 2 个子 Agent 的成本和结果对比，见 [19 实测记录](19-experiments.md#5-e2子-agent-的成本) |

**依据**：[一手] Anthropic [C 编译器项目](https://www.anthropic.com/engineering/building-c-compiler)、[多 Agent 研究系统](https://www.anthropic.com/engineering/multi-agent-research-system)、Claude Code Agent Teams 文档、Opus 5.5 指南；[研究：正文复核] [AI Agent PR 合并冲突论文 v2](https://arxiv.org/html/2607.04697v2)、[CodeCRDT 论文 v1](https://arxiv.org/html/2510.18893v1)、[Co-Coder 论文 v1](https://arxiv.org/html/2606.00953v1)、[Coding agent teams 论文 v1](https://arxiv.org/html/2610.17471v1)；[社区：原文] [Systima 历史报告](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)；[社区] HN 与 Lobsters 实践者；[一手：厂商实践报告] Cognition [2026-04 修订](https://cognition.com/blog/multi-agents-working)；[经验：实测] E2；核实 2026-10-18。

### 两种立场怎么调和

**先判断子任务是否独立，再决定并行方式：读为主的任务可按需委派并行，写为主的任务保持单线程，或先定接口再按模块并行。** Anthropic 的研究系统与 Cognition 的编码实践面对不同任务；Cognition 已在 2026 年明确修订早期立场。

| | 读为主（研究、调查、评审、审计） | 写为主（实现功能、重构） |
|---|---|---|
| 子任务之间 | 可拆成相对独立的问题（需确认） | 每个动作都隐含设计决策，彼此会冲突 |
| 并行的收益 | 可能扩大覆盖；Anthropic 的 token 用量关联表现方差，不是等预算提速或因果分解 | 风格、接口、假设不一致，合并时要返工 |
| 推荐 | 原生按需；确有覆盖／关键路径收益时委派，**交回压缩后的结论和证据** | 单线程 Agent；或者先由一个 Agent（或人）定好接口，再按模块并行 |

**上下文按角色给**：独立评审先给变更与必要验收依据，不默认附上编码者的整段过程；由主 Agent 结合原需求核对发现。需要针对当前难点给建议的咨询 Agent，则带上相关状态、约束与已试路径，缺关键文件先补查。两者都不是空白上下文或全量轨迹的固定配方；沿用 [09 的评审输入](09-review-and-quality.md)。

**Claude Code：一次性缩小文件评审的启动输入。** 若任务所需规则已能写进委派，可用原生 `--agents` 定义临时子 Agent，无需安装评审框架；先用 `claude --version` 确认 **v2.1.271+**。在仓库目录启动（以下为 Bash／zsh）：

```sh
claude --agents '{"focused-reviewer":{"description":"核对指定文件与验收要求","prompt":"只核对委派中的工件、验收和必要项目规则；缺规则先报告，不猜测。指出具体文件证据；不能执行的验收标未验。","tools":["Read","Glob","Grep"],"omitClaudeMd":true}}'
```

随后明确要求使用 `focused-reviewer`，给实际变更文件、验收条件及必须遵守的项目规则；在委派记录核对确实调用了它。该定义只在本次会话存在，不固定模型；实际选择还受调用参数与子 Agent 模型配置影响。这里只适合文件核对，不能运行测试或接收浏览器页面；这些验收仍交给具备对应工具的执行者，不用“只读评审”替代实际接收。

`omitClaudeMd` 仅省略启动时的用户／项目／本地 CLAUDE.md 注入，不保证盲审；工作于子目录时仍会加载适用规则，也不适用于 `--agent` 主会话入口。依赖大量项目约定而无法完整交接时保留默认加载。结论来自官方子 Agent 入口与[源码／社区反例](research/2026-10-12-experiment-records.md#窄评审按任务缩小启动输入)，本仓尚未实跑此配置，不声称提升评审质量或降低总投入。

审计和评审中的独立调查较容易并行；迁移要分开看：调查可读并行，实际修改必须先对齐共享接口、数据契约和依赖顺序，再验证整合结果。**文件不同不代表语义独立**。这与 Anthropic 研究系统及 Agent Teams 对依赖与协调成本的限制一致。

并行加速 11–52%、耦合任务慢 5.8% 两个数字没有可核查出处，不采用。

**依据**：[一手] [Anthropic 多 Agent 研究系统](https://www.anthropic.com/engineering/multi-agent-research-system)、[Agent Teams 对依赖与协调成本的限制](https://code.claude.com/docs/en/agent-teams#when-to-use-agent-teams)、[子 Agent 官方入口](https://code.claude.com/docs/en/sub-agents#what-loads-at-startup)；[一手：Cognition 角色差异；经验：采用判断] Cognition [2026-04 修订](https://cognition.com/blog/multi-agents-working)；[经验] 选择与采用建议；核实 2026-10-18。

## 2. Claude Code 的 5 种并行方式（官方文档 [一手]）

**默认先用原生 Subagent 按需委派；需要独立派发、持续协作或可重放编排时，再按协调者、通信与隔离条件选 Agent View、Agent Teams、Dynamic Workflow 或 Projects。**

| 方式 | 谁来协调 | Agent 之间通信 | 文件隔离 | 状态 |
|---|---|---|---|---|
| **Subagents** | Claude 在一个会话内委派、收集结果 | 主会话收集结果；具名 Agent 可传消息 | 可以给每个子 Agent 配 worktree | 会话内委派 |
| **Agent View**（`claude agents`） | 你派发独立任务，回头再看 | 只向你汇报（可用跨会话消息） | 派发后的会话会自动进入独立 worktree | 研究预览 |
| **Agent Teams** | 由 Claude 担任 lead，负责计划、分配和监督 | 队员之间直接发消息，共享任务列表 | **不自动隔离**，需要按文件划分任务 | 实验，默认关闭 |
| **Dynamic Workflows** | 由一个**脚本**持有计划，而不是靠 Claude 一轮轮判断 | 脚本组织结果与交叉验证 | 需另选隔离方式 | 按账户／入口启用 |
| **Projects** | 长期对话协调线程；云端可离机继续，需本地资源时另选 Remote Control | 云端共享项目上下文；本机线程不预载项目 memory | 按云端／本机路径核环境，本机须唤醒且连接运行 | 公测；[入口及版本条件](01-agents/claude-code.md#33-并行与自动化5-种并行方式) |

辅助：`--worktree`、`.worktreeinclude`（复制匹配的忽略文件）、`worktree.sparsePaths`、跨会话消息、`/batch`（拆成 5–30 个 worktree 子 Agent）。

**怎么选**：
- 支线调查会把主对话塞满 → **Subagent**
- 手上有几个独立任务，想交出去、只在需要时介入 → **Agent View**
- 迁移先按 [15 §5](15-task-playbooks.md#5-大规模迁移与升级)选改法并试点，再选调度；迁移或审计确需可重放编排时试 **Dynamic Workflow**，脚本调度可用 `claude -p`，独立单元可选 `/batch`，不只按文件数量决定
- 需要多个 Agent 持续协作讨论 → **Agent Teams**（实验功能，token 消耗大）

**依据**：[一手] Claude Code 官方并行入口文档与版本条件（见文末来源）；核实 2026-10-08。

### 2.1 启动与撤回：后台不等于无人值守

- **普通子 Agent**：审批提示应回主会话；无人值守任务若会需要新审批，先拆出该步骤，别靠扩大权限消除等待。`/tasks` 查看并停止当前会话后台任务，不能把“已派发”当完成。
- **Agent Teams**：仍为实验；开启后，主会话给调用加 `name` 可将子 Agent 转成队员，frontmatter 的 worktree 隔离不能阻止转换。需隔离时让本次调用显式传 `isolation` 并核实际目录，或关闭 Teams。in-process 队员不能由 `/resume`／`/rewind` 恢复。需要可靠续接时先用单层委派；恢复后核实队员与产物再派发，不对旧名单继续发任务。
- **Dynamic Workflow**：适合可重复的批量调查／迁移；需要阶段间人工签字就拆成多个 run。重启可能重跑失败 Agent 之后已完成的 Agent，涉及提交、上传等写入时先按 [20 的对账建议](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)核实际结果，再决定恢复。

不同宿主的提示与结果投递仍有[公开失败报告](research/2026-10-12-experiment-records.md#子agent宿主契约并发权限与恢复)，本仓未运行客户端。

**依据**：[一手] [Subagents](https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background)、[Teams 限制](https://code.claude.com/docs/en/agent-teams#limitations)、[Workflow 恢复](https://code.claude.com/docs/en/workflows#which-agents-run-again)；[经验] 选择；核实 2026-10-15（UTC+8）。

## 3. 第三方编排工具

**先用厂商内置的并行能力，确实不够再考虑第三方编排。** 厂商内置的并行能力越来越强，第三方编排工具的生存空间在缩小。

| 工具 | 形态 | 评级 |
|---|---|---|
| Claude Squad | tmux + worktree 的终端 TUI，支持 Claude Code、Codex、Gemini、Aider | 🧪 |
| Conductor | 本地 worktree／Cloud microVM；桌面、iOS 与 API 入口按官方当前说明分别核对 | 🧪 核实际环境、权限与套餐；厂商隔离声明不代替项目验收 |
| container-use（Dagger） | 每个 Agent 一个容器加 git 分支 | 🧪（需要隔离运行环境时） |
| Happy Coder | 在手机或桌面上并行控制多个 Claude Code | 👀 |
| Vibe Kanban | 原公司与托管服务终止；官方称本地 workspaces 可继续用、项目转社区维护 | 👀 按维护承受能力选择本地版，暂缓依赖原托管协作；不据公告保证当前社区活跃 |
| Cursor 3 Agents Window、Codex 指挥中心 | 厂商内置 | 🧪 |

**依据**：[一手] [Claude Squad](https://github.com/smtg-ai/claude-squad)、[Conductor](https://www.conductor.build/)、[Cloud FAQ](https://www.conductor.build/docs/cloud/faq)、[container-use](https://github.com/dagger/container-use)、[Happy Coder](https://github.com/slopus/happy)、[Vibe Kanban](https://github.com/BloopAI/vibe-kanban)、[停运范围](https://www.vibekanban.com/blog/shutdown)；核实 2026-10-08。

### 工作树管理：何时补 Worktrunk

**🧪 新工作树总要重新准备依赖时，可试 Worktrunk 的同步创建 hook。** 在 `.worktreeinclude` 只列 `node_modules/`，将 `.config/wt.toml` 的 `[pre-start]` 配成 `copy = "wt step copy-ignored --require-include"`；把配置提交到创建基线后，执行 `wt switch --create task-a --base main --no-cd --execute npm -- test`，复制完成才启动现有测试。[配置与重放](../experiments/worktrunk-ready.md)给出完整入口；缺少清单时该复制命令只跳过、不报错，就绪仍须由测试验收。已有 Git＋准备脚本或 Agent 客户端入口够用时不必换；管理器不额外隔离数据库、端口等外部资源。

**本仓 v0.81.0 实试跑通“两树准备后可测试，一树改坏依赖不影响另一树”。** 使用真实 semver 依赖与自编消费断言，实际是完整文件复制；不是生产应用、模型提效或复制速度评测。准备失败会阻断启动但保留已建树，修复后应显式运行 `wt hook pre-start` 再启动，而不是直接跳过 hook。使用者反馈见[结果与使用者反馈](../experiments/worktrunk-ready.md)。

**依据**：[一手] [Worktrunk](https://github.com/max-sixty/worktrunk) 官方配置；[经验] 适用条件；[本仓实试／独立重放] v0.81.0 结果与使用者反馈；核实 2026-10-24。

### 有依赖的分支：更新父层，再接续消费者

🧪 **独立任务仍用普通 worktree；子任务要接着尚未合入的父层修改时，可试官方 `github/gh-stack`。** 它管理分支依赖与重新基于父层的接续，不替 Agent 判断冲突该保留哪种业务语义。不是同名的 `boneskull/gh-stack`，也不要求为已有简单流程引入整套编排器。

最短操作：在已建立、各自提交的父层 `contract` 与子层 `consumer` 上，用 `gh stack init --base main contract consumer` 登记依赖；父层修订后，在栈内工作树执行 `gh stack rebase --no-trunk`，只传播栈内父层变化，不更新 trunk。发生冲突时，**按输出到真正持有冲突的工作树处理并暂存**，再 `gh stack rebase --continue`；不要为了恢复而清空另一位 Agent 的目录。

**本仓实试跑通了“父契约更新→子层冲突→换目录恢复→消费者检查”。** 0.2.1 在子层所属树产生冲突；从另一个有在制文件的目录过早 continue 仍失败并保留恢复状态，解决所属树冲突后再从该目录 continue 成功。最终消费者接受新契约、父层成为其祖先，另一目录的已跟踪改动和未跟踪文件均逐字保留。[重放与记录](research/2026-10-22-frontier-trials.md#gh-stack依赖分支与跨目录恢复)是隔离合成试用，未验证远端 PR／合并队列或模型提效。

**先暂停受影响分支的写入者，再重排依赖。** 栈状态与恢复日志在同一 clone 共享；worktree 不是各自独立的栈管理器。若只是独立成果汇总或只有一次小合并，普通 Git 和明确交接通常足够；恢复目录不存在、状态不明时保留现场，不用自动 stash/reset 掩盖问题。

**依据**：[一手] [gh-stack 固定版本命令与实现](https://github.com/github/gh-stack/tree/29a36d314be664583705f18e41cebdf2b61ad514)、[GitHub 工作树契约](https://docs.github.com/en/pull-requests/reference/stacked-prs-cli-commands#worktree-support)；[研究] 依赖分支接续；[本仓实试／范围] [重放与记录](research/2026-10-22-frontier-trials.md#gh-stack依赖分支与跨目录恢复)；[经验] 采用与撤回；核实 2026-10-24。

## 4. 实操建议

**✅ 让主 Agent 汇总与处理矛盾，不默认让人搬运每次交接。** 人介入会改变目标、风险或验收的决定；若逐次审阅本身就是任务要求，再试人工中转。APM 研究的参与者更有信心，却没有明确的总体功能优势；这是旧模型上的整框架比较，不能把差异单独归因于人工中转。

收尾前处理会影响结论的支线结果，明确未返回、已取消及不再相关的工作；不能让主 Agent 先报完成，再把关键反例留在队员会话里。已有充分依据时不机械等待无关支线。

拆分、交回与整合的主路线见 [§6](#6-操作手册从一个大任务到并行执行)；这里保留几条跨任务判断。

1. **分支通过后，还要验生产者与消费者在同一集成树上的契约。** 把变更的字段、单位和失败语义交给依赖方，并在既有验收中检查它实际消费了新行为；干净合并或较高的测试通过比例不能替代这一项。原生测试已覆盖就复用，不另造协调平台。整合失败先[排除测试条件不同和单支已有问题](22-agent-evaluation.md#并行配置按集成依赖接收不只看测试总分)，再归因交接。两项独立研究的限定比较见[依赖接收](research/2026-10-12-experiment-records.md#p72审计补强并行结果按依赖接收)。
2. **按遗漏风险选择独立评审。** 复用原请求、现有验收或已确认规格作为判据，别只交同一份计划摘要；接口或行为约束改变时，先更新受影响的后续任务再派发。简单修改已有充分独立检查时，不另开评审会话；一次有效独审的复用与只复查变化见 §6。现有证据未证明固定“一写一审”普遍更稳，见[输入交接与反证](research/2026-10-12-baml-and-review.md#后续任务相同-brief-与过期接口)。
3. **按实际状态决定隔离，不把 worktree 当独立运行环境**：Git 配置默认共享；端口、测试数据库与外置输出目录也不会因换分支自动分开。先核对这些资源的实际目标，再决定拆开运行、只串行相关验证，或复用已有隔离环境。`.worktreeinclude` 只复制匹配的忽略文件，复制配置仍可能指向同一服务；稀疏检出减少检出范围，不隔离服务。缓存能按工具契约共享就保留，别把共享编译缓存和可被另一任务替换的最终产物混为一谈。见[状态边界与反证](research/2026-10-12-experiment-records.md#worktree隔离到哪里配置缓存与被测产物)。
4. **监控成本**：先用原生 `/usage`；需要历史诊断时再按 [02](02-models-and-cost.md#31-查异常消耗ccusage-只补历史诊断)试用 ccusage，区分日志估算与账户额度。

**依据**：[一手：作者研究] [APM 研究](https://agentic-project-management.dev/research/thesis/evaluation-results/)；[研究] [并行结果按依赖接收](research/2026-10-12-experiment-records.md#p72审计补强并行结果按依赖接收)；[经验] 采用建议与收尾条件；核实 2026-10-14。

### 接收已有产物：先核退出条件，再核目标结果

**✅ 保留原生产者单写者，让独立接收者用固定产物和原需求核对实际结果。** 从[固定交付接收模板](../templates/generic/fixed-delivery-review.md#交给审查者的输入)交入版本、验收目标与可重放命令；先复用已有检查，再把每项目标对应到测试断言、CLI 退出条件或输出字段。退出码只覆盖其中一部分时，读取剩余结果再决定是否接收，不为此新增编排平台或重审全部实现。

MOBA-Like 固定模拟产物的独立接收中，32 项测试通过；源码核对却表明 CLI 只因异常或回放哈希不一致失败，卡死、超时、时长和难度目标仍需读取输出。现有回放测试核了同命令的 hash／status／winner，但最长 120 秒且不要求产生胜者，因此不能据此接收“完整获胜对局可重放”。批量 CLI 因运行入口受限尚未执行；下一步是从原命令取得真实输出，对照原目标逐项接收，而非再跑同一组单测。生产者已完成的修复与本次接收发现分开归属。

**依据**：[本仓独立接收／源码核对，2026-10-25] [固定 CLI 的退出条件](https://github.com/dbvv1/MOBA-Like/blob/d5f465ce55e2f2280ba4cfe06ce0bcfad7843ce8/tools/sim.ts#L537-L539)、[回放测试](https://github.com/dbvv1/MOBA-Like/blob/d5f465ce55e2f2280ba4cfe06ce0bcfad7843ce8/tests/replay.test.ts#L7-L28)及[需求目标](https://github.com/dbvv1/MOBA-Like/blob/d5f465ce55e2f2280ba4cfe06ce0bcfad7843ce8/docs/brief.md#自动验收目标)；本次采用的是接收模板与独立消费，生产者是否采用该路线及其收益仍待反馈。

## 5. 其他厂商的并行与多 Agent 方式（2026-10）

**需要跨云端任务或 API 层编排时，先核各厂商当前的隔离环境与多 Agent 入口，再决定是否引入。**

| 方式 | 说明 | 来源 |
|---|---|---|
| Codex 云端任务 + **可复用的云端环境** | 准备一次开发环境，之后每个新任务在独立的隔离工作区里启动；适合同时派出多个云端任务 | learn.chatgpt.com |
| OpenAI **Dots** | 常驻 Agent 可以在后台开多个 Agent 并行处理几件事，你继续和它对话 | 同上 |
| OpenAI Responses **多 Agent beta**、Agents API 的多 Agent 编排 | API 层的多 Agent | developers.openai.com |
| Claude **Managed Agents 多 Agent 会话** | 协调者 + 子 Agent 的“名册”；官方建议先只放 `self`（让 Agent 委派给自己的副本），再把读大量资料的子任务交给更便宜的 worker 模型（如 Haiku 5.5）；一个预算由所有线程共享 | Claude API 官方 Skill |

**依据**：[一手] learn.chatgpt.com、developers.openai.com、Claude API 官方 Skill；核实 2026-10-08。

### 5.1 Codex 子 Agent：配置作用域先于人数

✅ 当前会话内独立调查可直接委派；自定义角色只在确需复用模型、指令或缩减能力时配置。现行文档与 **Codex 0.162.1 固定源码**均支持 `[agents].max_concurrent_threads_per_session`，旧 `max_threads` 是别名；该字段数的是子线程，不含主线程。默认值随执行后端而异，不把历史“6 个”写成跨宿主保证，也不把并发上限当总费用上限。

**权限在父会话选择。** 角色文件里的 `sandbox_mode`／`approval_policy` 不替换父会话权限；“只读 reviewer”的提示词不构成独立只读沙箱。需要硬性只读时，使用实际只读权限的父会话；交互 CLI 可处理子线程审批，不能展示新审批的非交互入口则会失败。具体有效配置沿 [01](01-agents/codex.md)／[10](10-security.md)核对，不能把 CLI 配置直接套给 ChatGPT Work。

**局限**：核过配置与代码路径，不等于各账户、宿主及已安装版本均已验证；具体实现与反证见[固定实现／反证](research/2026-10-12-experiment-records.md#子agent宿主契约并发权限与恢复)。

**依据**：[一手] [Codex 子 Agent 现行指南](https://learn.chatgpt.com/docs/agent-configuration/subagents#approvals-and-sandbox-controls)、Codex 0.162.1 固定源码；[经验] 建议；核实 2026-10-15（UTC+8）。

## 6. 操作手册：从一个大任务到并行执行

**同一真实仓库里并行推进多个独立目标时，默认由一位主 Agent 持有共享决定、验收和最终整合；只把能独立验收、能交回完整产物的部分拆出去，收回后按实际文件重叠串行集成。** 并行实现不等于并行合入 main——各分支可以同时写，主干仍要按依赖顺序接收；原生平台的子 Agent 也不等于独立账号或独立模型。默认顺序是原生按需委派；需要互不覆盖的独立写入面时再开 worktree；确需共享任务状态、可重放编排或把不同模型／账户显式分开时才加 Teams／Workflow 或第三方。三者按协调与隔离需要选，不是能力等级，也不按角色数或工具热度排名。

| 路线 | 什么时候值得 | 交回与边界 |
|---|---|---|
| **原生按需委派（默认）** | 一个主上下文能说清目标；子任务以读为主，或写入面已经切开；只需短交接 | 子 Agent 通常沿用父会话的权限、账户和计费；读为主交压缩结论与 `file:line` 证据，写为主交完整产物与验证；不同文件不等于语义独立 |
| **独立 worktree** | 多个目标要同时写、互不覆盖；或长任务需要独立检出继续 | 每个树要能独立准备依赖和验证；worktree 只隔离写入，不隔离端口、测试数据库、缓存、服务或账户 |
| **额外编排（Agent Teams／Dynamic Workflow／第三方）** | 需要队员共享任务状态、脚本可重放、跨会话派发，或需要把不同模型／账户显式分开；原生入口覆盖不了 | 协调、审查和 token 成本随规模增长；实验功能按当前版本核恢复与审批；不按人数判断收益 |

工作树的依赖准备与父层接续见 §3 的 Worktrunk／gh-stack 实试；它们减少准备和重放成本，不替 Agent 判断业务语义。

**一个主 Agent 已经能保留必要上下文并完成时，不拆。** 需要频繁来回沟通、多个阶段共享大量上下文、改动很小或对延迟敏感时，子 Agent 的启动与交接成本通常超过收益；官方清单与撤回条件见 §7，强 Agent 下的判断见 §10。只有仍有可独立验收的工作、汇总与评审跟得上时才加并发；2–3 个是起步经验，不是最优数量或可靠性保证，也不按论文的 45% 阈值或 87% 选择准确率给新任务硬路由；[完整候选组评估](research/2026-10-12-experiment-records.md#架构阈值与完整候选组不能按45或87硬路由)显示评价单位与已测输入条件会改变结论。

**先定共享决定，再拆独立写入。** 拆分按依赖而不是文件数：先找共享接口、数据和状态（调用图可用于找消费者），再按行为、接口与风险划可独立验收的切片，不按固定代码行数定并发；共享设计决定先收敛，评审积压就减少同时在写的任务。交接写清消费者要等的是语义决定、可用类型／桩，还是实际实现，以及哪条断言满足即可开工。开工前由主线写清共享接口、schema／数据契约、权限与失败语义、验收入口（文档任务则是标题／锚点、写作规则与证据格式），以及每个写入面的唯一负责人。只读调查可以并行；实现按独立目标拆。文件不同不代表语义独立——两个改动依赖同一个未定决定时，仍要先收敛再做。需要共享契约但暂时定不下来时，先交一个可用的桩或窄接口，把延期目标和验收写清；不能用删要求制造独立性，紧耦合部分仍由同一执行者处理。

**交什么才算可接手。** 每个独立目标回来时至少交回四项：固定 base SHA 与完整产物（commit／branch、可应用 patch，或完整正文而不是摘要）；自己实际跑过的验证命令、退出状态和关键输出；未验证项与缺失的权限／环境；对共享决定的遵守情况和需要主线先接收的契约。验证要指向自己的产物：核对启动目录、实际服务地址、数据目标和输出路径；共享端口上的旧服务不能算本分支验收，服务复用只检查可用性、不证明 checkout 身份。隔离测试数据库时，在导入应用配置／创建 engine 前统一绑定应用与测试夹具的配置，并核对实际连接目标；只改夹具可能仍漏到共享库，见 [Agenticos 修复](research/2026-10-12-experiment-records.md#并行测试换了夹具数据库应用连接也要一起换)；不能可靠区分时只串行该验证步骤。读为主的调查另交压缩结论和可核证据（`file:line`、命令输出、来源），大段输出写文件、只回路径。认领只说明有人接手，不等于已经在执行；看固定 base SHA 和实际产物判断进度，不看状态文字。

**收回来的顺序是先核证据，再做一次有效独审。** 主线逐个核对子任务交回的证据，不只看摘要；矛盾处回到原需求、验收或真实消费者判断。需要独立审查时，一次全新上下文覆盖本次 delta、推荐与证据即可；已有可信审查可直接复用，修订只复查变化，不例行叠加第二轮同题审查。代码或契约变化后重验受影响路径；无关文档合入不使既有消费者验证失效。判断不了新审查是否补上缺口时，按 [09 的评审层](09-review-and-quality.md#按风险选择评审层不默认逐层叠加)选最小一层。

**整合按实际重叠串行，保留双方历史。** 发布前 fetch 最新 main；目标文件在分支期间被改过，就以最新 main 为基线整合，不覆盖别人的成果。按实际文件与接口重叠排序：先合共享契约和底层，再合依赖它的上层；同一文件的两个分支不并发合入，冲突交给最了解上下文的执行者。合并后核实际树：产物、补丁、正文都在，冲突解决没有丢掉任一方的有效改动；保留结果分支和原提交，不用压缩或改写历史掩盖来源。代码或契约变化后在集成树上重跑受影响消费者；干净合并或子分支绿灯不能替代这一项，合并后要重新构建并验收整合产物，发布前执行目标项目要求的完整检查。

**接收不等于验收。** 部分真实消费者还没验时，把可接收的工程产物和仍缺的目标分开写：例如补丁、固定版本、组件测试和构建可接收，但真实浏览器交互、刷新和焦点仍待验。验收项要保留；工程接收只说明产物可用，不等于产品成品或方法收益。

**是否值得并行，算到验收结束。** 同一需求、相同验收下看正确性、总等待、总费用和人的评审／返工；区分固定总计算预算与多花计算换覆盖，不把 worker 用时之和当交付等待。只更快生成、却把时间移到整合修复时，不算交付提速；现有研究未证明人的评审负担不增加。

**能直接改给编码 Agent 的短起点：**

```text
在同一个仓库里并行完成这些独立目标：[目标 A]、[目标 B]。
共享决定由主线先定，子任务不得改：[接口／数据契约／权限／验收入口]。
每个目标只写：[文件或模块]；同一共享面只有一个写者。
交回：固定 base SHA、完整 commit／可应用 patch、验证命令与结果、未验证项。
读为主的调查交回压缩结论和 file:line 证据；大段输出写文件只回路径。
完成后由主线逐个核对证据，再按实际文件重叠串行整合，保留原提交；冲突交给最了解上下文的执行者。
代码或契约变化后重验受影响消费者；无关文档合入不用重跑。
```

**下一次自然变化从真实反馈来。** 功能会继续维护时，从真实待办、消费者故障或下一次需求取一个会触及旧边界的变化（阈值、新状态、新消费者、旧数据），保留旧要求并回归受影响路径；功能不会继续演进就停在这里，不为验证流程制造依赖冲突或第二轮需求。依赖卡住时，先核本次承诺能否独立交付：可以就把当前可用能力收在共享边界内，写明延期目标和验收；不能就把契约继续对齐，并保留原验收。例如只定位已安装来源时，先交 artifact 包内的来源查询、共享 resolver 不动；要跨机器或重装后的稳定 ID 时，原任务仍未完成。Agent 提出切片与接收断言，人确认是否仍满足本次目标；不要求等上游全部实现才开工。

**本仓刚完成的一次生产可以照这条路线读。** 之前的 08 有并行选项、证据和操作要点，但缺一条把独立目标交回、整合、继续改串起来的完整路线。组合后实际改变的是这条操作路线：读者可以按三层选择、四项交回、一次独审和按重叠整合开始，不必从工具清单里自行拼。这一轮几项工作用 Claude Code＋DeepSeek 的原生 Workflow 并行交回了三件可核产物：07 的[完整功能路线](07-workflows.md)、08 的推荐优先改写，以及 Memos 的真实功能补丁；各项产物由独占实施 Agent 完成、独立验证 Agent 复核，主负责人复用有效审查、只修有证据的 delta，按实际文件重叠核对后整合，最终树同时保留主干和两个结果分支的父链。先后落点是 07／08 正文进入主干，Memos 的[可应用补丁与工程报告](../experiments/memos-reading-adoption.md)进入 `experiments/`；它证明的是产物可接续、产品补丁可应用，不是并行更快、更便宜或质量更高。Memos 的真实浏览器验收仍未完成，这正好说明工程可接收与消费者已验收要分开记。

**依据**：[一手] Claude Code 的[子 Agent](https://code.claude.com/docs/en/sub-agents)、[worktree](https://code.claude.com/docs/en/worktrees)、[Agent Teams](https://code.claude.com/docs/en/agent-teams)、[Dynamic Workflow](https://code.claude.com/docs/en/workflows) 入口，[Anthropic 多 Agent 研究系统](https://www.anthropic.com/engineering/multi-agent-research-system)、[Cursor 9-23 原文](https://cursor.com/blog/improved-token-efficiency)、[Cognition 2026-04 修订](https://cognition.com/blog/multi-agents-working)；[一手：公开补丁] [Spec Kit 改稿链](research/2026-10-12-experiment-records.md#p81任务依赖按当前承诺重划边界)；[研究] [Coding agent teams 10-12 评测](https://arxiv.org/html/2610.17471v1)、[依赖接收](research/2026-10-12-experiment-records.md#p72审计补强并行结果按依赖接收)、[worktree 的状态边界](research/2026-10-12-experiment-records.md#worktree隔离到哪里配置缓存与被测产物)、[评审层选择](09-review-and-quality.md#按风险选择评审层不默认逐层叠加)；[经验：本仓实际生产] [A-DELIVERY-ROUTE-001](https://github.com/dbvv1/a1dbv/blob/795c8f6c06607b6931ae19b45451b949825c77ec/docs/collaboration/local-jobs/A-DELIVERY-ROUTE-001.md)、[A-STYLE-REWRITE-001](https://github.com/dbvv1/a1dbv/blob/795c8f6c06607b6931ae19b45451b949825c77ec/docs/collaboration/local-jobs/A-STYLE-REWRITE-001.md)、[A-STYLE-REWRITE-002](https://github.com/dbvv1/a1dbv/blob/795c8f6c06607b6931ae19b45451b949825c77ec/docs/collaboration/local-jobs/A-STYLE-REWRITE-002.md)、[A-MEMOS-READING-001](https://github.com/dbvv1/a1dbv/blob/795c8f6c06607b6931ae19b45451b949825c77ec/docs/collaboration/local-jobs/A-MEMOS-READING-001.md)、[最终整合](https://github.com/dbvv1/a1dbv/commit/795c8f6c06607b6931ae19b45451b949825c77ec)；核实 2026-10-25。

### 确定性模拟与版本化回放：先对齐内容版本，再只核修复差量

**✅ 确定性模拟、版本化回放这类能从固定输入重算的交付，验收时用“原任务固定版本＋内容版本／种子／命令”重放：正常局与真实失败／超时局分别复现，已有可信审查只核修复差量。** 作者自带的 checker 只验证作者写的断言；“最新”分支可能混入无关改动，无法把失败归到本次修复；同 seed 但内容版本不同会换掉实际对局、终局和 hash，绿不能证明原失败例已被覆盖。

1. **第一步只钉输入。** 从[固定交付接收输入](../templates/generic/fixed-delivery-review.md)复制任务，交给既有 [code-reviewer](../templates/generic/.claude/agents/code-reviewer.md)；填写原需求、受检固定 SHA／产物版本、内容版本、种子与完整命令序列或录制文件、预期哈希／终局状态／胜负／时长，以及正常与异常消费路径、失败样例、作者实得与目标偏差；缺项写“审查未完成”，不先看作者结论。
2. **正常与真实失败分开跑。** 在固定版本上重放正常局，再单独复现失败／超时局；超时／未终局保留 `timeout`、`winner=null` 等原状态，不静默排除或并入某一方胜负。同一版本、同一输入重放两次，哈希、胜负、时长和终局状态要逐项一致。
3. **原非作者只核修复差量。** 已有可信审查可直接复用，修订只复查本次 delta 与受影响输入，不重造全文审查；作者 checker 只作待核代码，不是独立预期。
4. **哈希合同变了就记录兼容选择。** 合法状态变化可能让旧 hash 对新固定版本不匹配，而同一命令的终局和时长仍不变；写清旧／新 hash、变化原因、哪些旧输入仍可读取及哪些终局哈希不再兼容；同一固定版本重放不一致仍须修复。

**只对确定性、可重放输入的交付设这条检查。** 纯文档、格式或无法固定内容版本的小修不做回放门槛；已有测试和本地评审够用时不再开独立会话；没有真实失败／超时样例就写缺口，不补造。它也不替代浏览器、视觉／手感或集成验收，不为此新增框架、审批或台账。

**本仓采用后补齐了一处异常覆盖。** MOBA-Like 的原非作者差量审查消费固定 `46a55ea` 的 reviewer 输入要求，补跑原 v1 seed600165 超时样例：v2 同 seed 的胜局不能证明 v1 失败例已覆盖。按准确内容版本复现后，该例与 v2 seed136／400327 都在 1200 秒超时、`winner=null`，同版本回放一致。实际改变的是异常证据复现范围，原三个代码缺陷在模板消费前已发现并由原调用修复，本轮同审关闭；没有把这些发现归功模板，也没有证明普遍效率或轮次收益。对应固定模拟的 32 项测试与正常 v2 seed1 整局／同命令回放通过；GC 修复使旧终局哈希不再兼容，兼容选择和详细实得见 [B 原任务](collaboration/local-jobs/B-MOBA-SIMULATION-001.md)。

**依据**：[本仓模板／实际消费] [code-reviewer 模板](../templates/generic/.claude/agents/code-reviewer.md) 固定 `46a55ea`，[A-CROSS-MODULE-SELECTION-001](collaboration/local-jobs/A-CROSS-MODULE-SELECTION-001.md)；消费者 MOBA-Like 受检 [`d5f465c`](https://github.com/dbvv1/MOBA-Like/commit/d5f465ce55e2f2280ba4cfe06ce0bcfad7843ce8)（修订 `2d66135`）、最终 main [`e6fed44`](https://github.com/dbvv1/MOBA-Like/commit/e6fed4460d00ec23175f1bd70bb20eb18a884b5e)；[经验：实际消费] Node 24.19.0 测试与单局重放、v1／v2 超时补测；详细日志私有，公开只留固定 SHA；核实 2026-10-26（UTC+8）。

## 7. 子 Agent 配置手册（Claude Code）

**按任务只给必要工具与上下文：模型可从 `inherit` 起步，会改文件的子 Agent 加 worktree 隔离，重型 MCP 只挂给需要的子 Agent。** frontmatter 里最有用的字段如下，写在 `.claude/agents/<name>.md`；只有 `name` 和 `description` 必填。

| 字段 | 用途 | 建议 |
|---|---|---|
| `tools` / `disallowedTools` | 工具白名单 / 黑名单 | 按任务只给必要工具；只读调查须同时限制编辑、Bash／MCP 等写入路径；不需要再委派的去掉 `Agent` |
| `model` | `haiku`、`sonnet`、`opus` 或 `inherit` | 可从 `inherit` 起步；目标明确、结果易检查且有成本或等待负担时试轻量模型，复杂评审保留足够判断能力，见 [02](02-models-and-cost.md#1-原则按任务分档而不是追榜单) |
| `maxTurns` | 最多轮数 | 防止子 Agent “找不存在的东西”一直找下去（Anthropic 研究系统的失败模式之一） |
| `isolation: worktree` | 在临时 worktree 里运行 | 会改文件的子 Agent 用它，避免和主会话互相覆盖 |
| `effort` | 推理强度 | 从适用模型／客户端的推荐值起步；等待或预算受限时试降档，质量变差或返工抵消节省就撤回，见 [02](02-models-and-cost.md#1-原则按任务分档而不是追榜单) |
| `permissionMode` | 权限模式 | 规划可用 `plan`；真正只读另靠工具权限与执行环境限制，见 [06](06-hooks-and-guardrails.md#3-权限模式) |
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

**依据**：[一手] Claude Code 子 Agent 官方文档（frontmatter、嵌套与并发上限，2026-10-15 UTC+8 复核）；[经验] 采用建议；核实 2026-10-15。

## 8. 委派提示的写法

**委派写清目标、输出格式、工具与方法和边界四件事，子 Agent 才不会重复劳动或漏掉内容。**

```text
目标：找出 src/payments/ 中所有直接拼接 SQL 的位置。
输出格式：表格，列为 file:line、拼接的变量、变量是否来自用户输入（是/否/不确定）。
工具和方法：先 Grep "execute(" 和 "f\"SELECT"，再逐个 Read 上下文；不要运行任何命令。
边界：只看 src/payments/，不看 tests/；不要修改任何文件；最多 15 次工具调用。
```

**按缺失证据与总预算给配额**：先说明这条支线要补什么、何时已有足够证据，给出调用或费用上限；只在仍有可独立验收的工作时增加并发。Anthropic 的人数／调用套餐来自 2025 年 Research 搜索系统的提示启发式，不是编码任务的通用配额，也不是最优人数的实测结论；范围核对见[范围核对](research/2026-10-12-experiment-records.md#人数配额与角色示例的适用范围)。

**汇总时**：要求子 Agent 交回**证据**（`file:line`、命令输出），主 Agent 逐条核对后再采纳；大段输出写进文件，只把路径交回来。完整的交回契约、独审复用与整合见 [§6](#6-操作手册从一个大任务到并行执行)。

**依据**：[一手] [Anthropic 多 Agent 研究系统](https://www.anthropic.com/engineering/multi-agent-research-system)、人数／调用套餐的原文范围；[经验] 采用判断；核实 2026-10-15。

## 9. 两个按需试用的并行模式

**只在确有独立风险或可竞争的假设时才拆并行调查；没有独立工作就保持串行。**

1. **按遗漏风险分评审视角**：安全、性能、测试覆盖中确有独立风险时，再分给不同调查者并由主 Agent 汇总；沿 §4 的判据检查新增发现，不为凑齐角色固定开三个会话。
2. **调查可竞争的假设**：根因不明且已有不同的可检验解释时，可以分别调查、互相找反证；最终用复现或检查结果排除假设，不以讨论共识代替验证。只有一个有效调查方向时先串行，不为凑人数制造假设。

🧪 以上借鉴 Agent Teams 的用例示例；文档中的三人评审、五人调查是示例提示，未给出同任务同预算的优势对照。若只重复发现或增加协调负担，就缩回单会话。

用 Agent Teams 时，可以用 Hook 做质量闸门：
- `TaskCompleted` 以退出码 2 退出，可以阻止任务被标记完成，比如测试没过；
- `TeammateIdle` 以退出码 2 退出，可以让队员继续工作。

**依据**：[一手] [Agent Teams 的用例示例](https://code.claude.com/docs/en/agent-teams#use-case-examples)与 Hook 契约；[经验] 采用与撤回判断；核实 2026-10-08。

## 10. 强 Agent 上何时不拆分

**单个 Agent 已能保留必要上下文并完成任务时，不拆分；拆分可能只增加交接和审查成本。** 不要按模型角色名称预设多 Agent 更可靠；同一计划派生的实现与评审也可能共享盲点。Superpowers 的真实配置、使用者失败反馈及 Codex + GPT-6 Astra 下的条件判断见 [24](24-community-workflows.md)。

**依据**：[经验] 采用判断；未做该组合对照；核实 2026-10-08。

## 来源

- [Run agents in parallel](https://code.claude.com/docs/en/agents)、[Agent teams](https://code.claude.com/docs/en/agent-teams)、[Dynamic workflows](https://code.claude.com/docs/en/workflows)、[Worktrees](https://code.claude.com/docs/en/worktrees)
- [Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)（Anthropic，2025-06）、[Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)（Cognition，2025-06）及其 [Multi-Agents: What's Actually Working](https://cognition.com/blog/multi-agents-working)（2026-04-22）
- [Subagents](https://code.claude.com/docs/en/sub-agents)（frontmatter、嵌套与并发上限）
- HN：[Parallel coding agents with tmux and Markdown specs](https://news.ycombinator.com/item?id=47218318)、[Embracing the parallel coding agent lifestyle](https://news.ycombinator.com/item?id=45489884)、[Multi-agentic software development is a distributed systems problem](https://news.ycombinator.com/item?id=47761625)（摘要）
- 论文：[arXiv 2607.04697](https://arxiv.org/abs/2607.04697)、[arXiv 2510.18893](https://arxiv.org/abs/2510.18893)、[arXiv 2606.00953](https://arxiv.org/abs/2606.00953)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)
