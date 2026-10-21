主线：二为主，兼四
改变的建议：[经验／研究] 长命观察由接续交付者持有，进程移交须连同投递与恢复核查；清理指令保留默认／条件，未决实现与规格冲突先不改写；计划陷入构建与转抄循环时，先保留接口与断言、缩减实现正文；原生够用时保持轻量，普通文档先自审，独立检查按具体遗漏保留；工具选择须核有效入口、宿主配置、权限、认证资格与维护负担。社区口碑和单人自述不支持默认双工具、统一降档、必须手写、免审或低迁移成本；评审倍率与新增任务数不代替净收益，兼容与交付声明仍须核目标环境和范围
新证据：[一手／社区] 中文／Reddit／实践者的流程包、单项 Skill 与语义检索采用取舍及当前 star 快照；Hermes 子进程退出清理的故障报告、发布实现与 notify／gateway 反例；doc-cleanup 语义误缩自报及撤回“代码为准”的固定修订；Superpowers #2333 的计划配方修订、分模型作者重放与无 Skill 反例；Copilot CLI Free／本地BYOK接入与组织限制、MCP治理官方口径冲突，gstack Windows指纹路径修复与Bun调用入口反例，Gemini v0.63.0 沙箱默认值、环境变量覆盖及 Seatbelt 读／网络边界，CodeBuddy地区／客户端与计划权限契约、国内工具订阅资格／续费与额度契约、Kiro显式规格修订契约、历史小bug试用与维护逐字稿，以及固定配置与源码、发布关系、撤回补丁、官方说明及社区完整原帖支持正文的条件选择与归因修正。[研究] 未核商业消息不作迁移理由，第三方订阅批准仍有待核项；未新跑模型或相关客户端，配置与自述不证明净收益或当前工具优劣

# 社区工作流：固定来源与案例资料

## P34 最高水平卡

核实：2026-10-21（UTC+8）。问题：强coding Agent的规划、上下文与委派，额外补什么才能改善最终软件，而非只增加流程？本卡先比较近期前沿结果，再定位下文三个修订案例。[研究]

**当前最高水平：跨任务的唯一最佳未知；有对照结果的前沿候选是决定／验收外置、职责分离和按真实失败改造harness。** Cursor的Wilson Lin于[2026-07-20](https://cursor.com/blog/agent-swarm-model-economics)比较同任务、模型与设定时限的新旧swarm，四种配置的新方案均提高隐藏SQL测试表现；旧Grok臂提前停止，不能把设定预算当实际等时完成。新方案由规划者保设计决定、执行者做局部实现，结合共享决定、可编译检查的引用和解耦审查；这是厂商组合实验，没有把三项P34建议分别消融。[一手：团队实验自报；研究：归因边界]

**前沿追踪也包括撤掉已过时的结构。** Anthropic的Prithvi Rajasekaran在[2026-03-24](https://www.anthropic.com/research/harness-design-long-running-apps)先展示Opus4.5的sprint契约与运行验收：单Agent20分钟／9美元，对照完整harness6小时／200美元且功能更多。同文后来换Opus4.6，撤掉sprint，保规划者并将评估移至完整产物后；作者认为评估者只在超出模型可靠单做范围时值得。后例任务、模型和提示均改变，不能把费用下降当受控效率增益，更不能把旧sprint结构当当前最高水平。[一手：工程案例；研究：继承与撤回]

**近期优化与反证。** Cursor的Jediah Katz、Connor O’Keefe、Calvin Yee于[2026-09-23](https://cursor.com/blog/improved-token-efficiency)报告生产A/B中按需上下文等组合使token成本降7%、质量不降；公开页未给完整样本量／质量量表，不能把7%归给一条清理规则。ETH SRI的Gloaguen等在[AGENTS.md评测v3（2026-09-29）](https://arxiv.org/html/2602.11988v3)报告所测仓级上下文总体未显著改善成功率、平均推理成本增逾20%；对象不是所有记忆／计划。近期更强系统仍可能需要删减无收益约束，而非堆全套流程。[一手：生产自报；研究：论文与范围]

**主流做法。** [Stack Overflow 2026调查](https://survey.stackoverflow.co/2026/ai/data)这道多选题的13,162名受访者中，76.5%会本地运行AI答案、63.9%对照代码库、53.0%检查测试／安全。它支持该样本中验证后采用常见，不代表全部强Agent用户；本项目三个具体流程的采用率仍未知。[一手：自选调查]

**可行做法与本仓推荐层级。** ✅ 目标清楚时先用原生能力，遇计划转抄才调整产物，清理指令保默认／条件，长观察由后续交付者持有；这些是面向已知故障的**可行补充**，不是已证最佳或主流。前两项接近上述前沿机制；第三项缺直接收益对照。公开修订帮助落地，不抬高证据等级。新增等待／维护却未减少遗漏时撤回额外流程，保留实际验收。[经验：当前条件默认]

**尚有差距。** 当前没有相同强模型、任务及总预算下的“原生／三项分别添加／完整harness”对照，也没有真实二改的缺陷、返工与人工时间闭包；这些才是继续追最高水平的验收方向。跨社区可比采用率、满意度与维护净收益仍未知；下文的窄样本比较只补采用边界，不能用三个案例或本地冒烟补齐这项缺口。[研究]

> 资料迁移：2026-10-12。以下承接 [24 正文](../24-community-workflows.md) 中尚无独立研究页的配置阅读、原帖范围、Starlette/DSPy/h3o 案例和待核问题，保留原记录的日期、精确数字与反证；迁移没有重新运行上游或模型。
> 调查时间：原配置与社区调查为 2026-10-10，h3o 于 10-11 补核。HN Algolia 与 Lobsters 请求被网络代理拒绝，社区样本来自 GitHub，不代表整个开发者群体。
> 已有专页的完整资料继续在 [BAML/HumanLayer](2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)、[SlopCodeBench](2026-10-13-slopcodebench.md)、[alchemy-utils](2026-10-12-alchemy-utils-evolution.md)、[VibeTunnel](2026-10-12-vibetunnel-maintenance.md)、[Ra & Apep/KPI](2026-10-12-codex-delivery-cases.md)，不复制成另一套案例记录；这些页保留本侧/对端的执行归属。

## 跨社区采用比较：维护任务先选补什么

核实：2026-10-21（UTC+8）。八类覆盖表复用既有审计快照并标空白；三条评级理由保留在下方原生／流程与上下文采用比较，不扩为全类别排名。先沿用上面的前沿卡，再用实际采用与撤回判断适用范围；未安装或运行模型。**[研究]**

### 八类覆盖与明确空白

这张表回答“当前维护缺口要不要多加一层”，不要求装齐八类。复用[审计热度卡](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#社区与开源热度快照)的 12 项目原仓库链接与 API 快照；卡标注读取日 **2026-10-21**，未给精确时刻，下表不补造时区或时刻。括号为该卡 stars，只作发现信号；**八类的 90 天增长全部未知**。**[一手：既有快照；研究：分类与边界]**

| 层／类别 | 何时才需要这一层 | 已有代表、热度与本仓选择 | 尚缺什么／撤回条件 |
|---|---|---|---|
| Agent CLI | 本机仓库要编辑、运行检查和交回 diff | Codex（130300）、Claude Code（152816）：✅ 沿用已稳定达标的入口；OpenCode（218681）、Pi（116667）属可另核的开源／定制路线，入口见 [01](../01-agents/README.md) | 不是同任务优胜排序；现入口满足需求就不因 stars 迁移，定制另负维护与隔离责任 |
| 工作流框架 | 反复遗漏的环节需要衔接，或未决契约需要保存 | Superpowers（302505）：⛔ 全局强制、🧪 窄试；Spec Kit（142102）按未决契约选择流程；单项 Matt Skills 作轻量对照，沿用下表理由 | 产物无后续用途时收缩；有单项缺口不等于要整包。未深读的 planning-with-files／oh-my-opencode 只留审计候选，不给新评级 |
| MCP 服务 | 当前 CLI／原生工具缺目标接口或语义操作 | Serena（30480）：🧪 按语义缺口试；[04](../04-mcp.md#1-先决定是否需要新增连接)先核客户端兼容与实际权限 | 本表没有给一般 MCP 服务评优；已有连接足够就不重复包装，接口接上不等于隔离成立 |
| 上下文与记忆 | 跨会话反复丢失目的、位置或决定线索 | Serena 项目记忆是已见采用线索；独立记忆已补[直接coding资料比较](2026-10-13-context-tool-choice.md#p44独立记忆层的两类coding比较)，尚无可迁移净收益赢家；按 [03](../03-context-engineering.md)先核当前代码与知识有效性 | Serena 与上一行是同一代表，不是两份独立样本；记忆不免除重新调查，旧推理不能直接继承 |
| 用量监控 | 原生状态不能解释历史异常消耗 | ccusage（19093）：🧪 [只补历史诊断](../02-models-and-cost.md#31-查异常消耗ccusage-只补历史诊断) | 不能解释差异就不加；日志估算不是实扣或剩余额度，缺失日志不能补造 |
| 多 Agent 编排 | 有独立可验收支线，或原生委派不够管理重复任务 | OpenHands（91396）：🧪 有重复任务且能负担部署再试；[08](../08-multi-agent.md#30-秒选择)默认先原生子 Agent | 算到汇总、整合与验收结束；审批送不到或结果归属不清时缩回单层／串行，不以并发数证明收益 |
| GUI 外壳 | 需要可视化管理多个工作区／任务，而非增加模型能力 | Vibe Kanban（28409）：👀 按维护承受能力评估本地版，暂缓依赖原托管协作；[08 的服务边界](../08-multi-agent.md#3-第三方编排工具) | GUI 与编排有交叉，不作额外独立样本；`archived=false` 不证明维护质量，缺可靠接管就不迁入 |
| 模型路由 | 固定模型／固定分工在重复任务上已有可测瓶颈 | 动态模型路由的可比开源代表**空白／未评**；邻近的 CC Switch（146774）仅沿用 👀 配置／供应商管理评级，不能填作自动按任务选模型的证据 | [02](../02-models-and-cost.md#3-订阅额度与成本控制)先比较固定分工；CC Switch 4.0 有 Routing／Aggregation 入口，但没有本表所需任务级模型选择收益证据；配置切换与自动模型路由不混为一类 |

星数沿用一份审计快照，不与下文 18:44 UTC 的三项目快照相减算增长。审计获取 Serena／ccusage 带时间的 stargazers 首次分页返回 401 后停止，未取得历史；这是数据缺口，不是零增长。本表扩充的是覆盖与采用入口，未新增客户端／模型运行或八类效果比较。**[研究：取证与验证边界]**

### 三渠道如何影响采用

沿用审计已读原帖，不重复抓取或用摘要票数算口碑：[HN Superlite](https://news.ycombinator.com/item?id=50147492)（2026-10-19）同时有维护负担、少量分析并行与扩大自主工作的不同意见；[Reddit 正面 Superpowers](https://www.reddit.com/r/ClaudeCode/comments/1r9y2ka/claude_codes_superpowers_plugin_actually_delivers/)（02-20）认可结构／测试但有计划执行混淆，[强模型去留串](https://www.reddit.com/r/ClaudeCode/comments/1w0irg8/are_better_models_replacing_superpowers/)（08-28）有 gym 应用成本对照自报及保留 TDD 的反例；[V2EX 两套工作流](https://v2ex.com/t/1199505)（03-19）提示实际触发冲突，[Claude＋Codex](https://v2ex.com/t/1198247)（03-14）说明减少传递的动机，双方一致却不证明可靠。具体阅读范围、日期／热度元数据均回[原取样卡](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#社区与开源热度快照)。这些材料共同确认检查触发、产物与交接，而非全装或全卸；各工具的可比满意度、长期采用分母仍未知。**[社区：复用已读原帖记录；研究：归纳]**

### 三条条件评级的采用理由

| 已有选择／当前评级 | 谁在用、用来做什么 | 正面与反面原帖 | 读者的选择 |
|---|---|---|---|
| Superpowers／⛔ 暂缓全局强制，🧪 针对缺口试用 | V2EX 用户做小改动、跨模型计划交接；Luca Cavallin 做 iOS 侧项目 | 07-14 的 deplives 自报流程膨胀后卸载；同串 1874w 认可详细计划对交接实施的价值。Luca 09-16 仍将它放在常用核心，同时清理低使用率扩展 | 小改动先原生；持续需要相连环节时才按项目试整包，不因卸载帖一概停用，也不因仍有人用就强制启用 |
| Matt Pocock Skills／🧪 按需试用 | Faruk 重审 Java CRUD 的架构决定；Reddit 使用者尝试替代 Superpowers | Faruk 08-02 自报明确重新访谈后补齐决定，未走完整 spec／ticket 链；fschwiet 却因 GitHub issue 产物杂乱退出，考虑改仓内产物再试 | 需要补问答、术语或测试边界时选单项；先核实际触发和产物去向，不能由“小而可组合”推断没有额外维护负担 |
| Serena／🧪 原生搜索或现有 LSP 有具体缺口再试 | Reddit 使用者跨仓消费 API client，另一人维护约 110k LOC；V2EX 用户尝试代码探索 | 跨仓作者认可项目记忆；110k LOC 作者认可效率却仍需反复调查，明确希望保留目的／位置／关联，而非旧推理；10-16 中文短试者未感明显差异 | 有具体语义操作缺口再试；跨仓记忆只是采用线索，实施仍核当前代码。不把重新阅读本身当失败，技术核查回 [03](../03-context-engineering.md#25-跨文件符号检索何时补-serena) |

上述评级沿用本仓条件建议，不是社区评分。原帖支持不同任务的取舍，缺同模型、同任务、同预算及后续缺陷结果，不能判出净收益赢家。**[社区；经验：采用判断；研究：局限]**

### 来源、日期与归属

- **中文正反意见**：[V2EX 1227194](https://v2ex.com/t/1227194) 首帖为 2026-07-14；API 核对第 7 条 deplives 回复为 08:37:49 UTC、第 10 条 1874w 为 10:51:37 UTC。前者报告卸载后完成小改动，后者描述 Codex 规划后交较低模型实施；没有公开任务补丁、精确插件版本或可复算成本。OP 尚未用 Matt 完成整个需求，不计作成功采用。[05-11 另一原帖](https://www.v2ex.com/t/1211943)同时自报结果更好与调用过重，补充正面取舍，不合并为好评率。**[社区：使用自述；一手：日期元数据]**
- **实践者保留与收缩**：[Luca Cavallin，2026-09-16](https://www.lucavallin.com/blog/how-i-actually-use-claude-code)报告仍用 Superpowers、Serena 等核心工具，同时按实际调用清理长尾。它反驳“强模型用户都已卸载”，但调用次数不能证明质量或成本优势。[Faruk，2026-08-02](https://blog.faruk.dev.br/articles/agents/matt-pocock-skills-harness-product-crud/)记录同一套技能在两次提示下的不同结果；[90526d2 固定补丁](https://github.com/farukzahra/faruk-base2/commit/90526d2bf3bd1c6593452328d4a53280e615cdbe)可核决定落为配置、测试与说明变更。作者的测试通过是自报，未独立重跑，不能隔离 Skill 与明确提示各自收益。**[社区；一手：补丁]**
- **Reddit 的退出反例**：[fschwiet 原串评论](https://www.reddit.com/r/ClaudeCode/comments/1vjx7n0/removed_by_moderator/)描述试用 Matt 后因 GitHub issue 杂乱退出，与同串转用 Matt 的正面回复并存。原根帖已删除，评论仍可读；页面仅相对日期，精确评论日未核。自动 TLDR 对“共识”的总结未作证据。**[社区；研究：读取边界]**
- **上下文工具的具体任务**：[跨仓 API client 原帖](https://www.reddit.com/r/ClaudeCode/comments/1t56o4y/cc_setup_of_lead_data_engineer_working_on_big/)由 Altruistic_Stage3893 自述；[110k LOC 原帖](https://www.reddit.com/r/ClaudeCode/comments/1r3e07j/maintain_project_understanding/)由 amerikiwi-traveller 自述。检索分别显示 2026-05-06、02-13，已读原页只显示相对月数，精确日未由原页元数据复核。前者同时用多种工具，尚在短试 claude-mem，不能将组合收益归给 Serena 或算作记忆服务成功采用。[V2EX 1249379](https://www.v2ex.com/t/1249379)的 TrackBack 于 10-16 短试未感明显差异，API 核首帖 07:18:32 UTC；缺语言、版本和代码规模，不能直接与跨仓体验比较。**[社区；一手：V2EX日期]**

### 热度不改变评级

2026-10-20 18:44 UTC 附近读取 GitHub repo API： [Superpowers](https://api.github.com/repos/obra/superpowers) 302,516 stars、[Matt Pocock Skills](https://api.github.com/repos/mattpocock/skills) 298,447、[Serena](https://api.github.com/repos/oraios/serena) 30,482。它们只是发现信号，不是用户数或持续采用。**90 天增长、可比讨论量／好评率、跨社区采用率均未知**；本轮没有统一采样框或可复算历史，不将三个代表外推为全类别热度地图。**[一手：当前快照；研究：未知项]**

**收口**：确认原生处理清楚维护、单项补具体遗漏、整包按持续需要试用的默认；额外产物未服务后续工作时收缩流程。社区材料补了来源广度，没有提升“当前最高水平”的证据等级，八类已列出代表或空白，但不等于八类效果或最高水平比较完成。**[经验／研究]**

## 2. Superpowers：重点看 Skill 之间怎样衔接

本轮直接读了 brainstorming、writing-plans、subagent-driven-development、systematic-debugging、verification-before-completion 等文件。**[一手：项目配置 C1]**

配置按任务清晰度选择访谈或直接执行，计划列文件／接口／验证，调度者准备子任务上下文，并检查任务和整条分支；调试先定位根因，完成须读当前验证结果。简单清楚的任务允许直接做，不应概括为强制全套流程。**[一手：C1]**

### 社区暴露的两个失败模式

**Issue #2470：计划里的代码与测试共同带着盲点。** 发帖者报告，在两个项目约十个任务中，实现者照计划复制代码，评审者又按同一计划检查，导致一些授权、空值和异步边界问题漏过。提出的改进是针对每个风险做反例探测，并检查与未修改代码的交界。**[社区：原帖，发帖者自述，未独立复现；C8]**

**Issue #2450：修改了接口，却没有更新尚未执行的计划。** 发帖者描述某次修复收紧了脚本参数，代码修对了，后续任务的文本仍引用旧调用方式。建议修复接口时搜索剩余计划和待派发 brief，更新调用契约。**[社区：原帖，未独立复现；C8]**

### 计划变成实现：先改变产物

核实：2026-10-21 UTC+8。主线二；改变 07 §2 的选择：出现计划构建／转抄循环时，先改交付物，不先加 reviewer 或按分钟细拆。只读公开补丁、发布与作者报告，未运行模型，未读取报告所链的会话。**[研究：范围]**

- **实际修订与发布。** [#2333](https://github.com/obra/superpowers/pull/2333) 于 09-18 提出、09-25 合并为 [71069323964d12f2dca6a1c52066165f4e43ade0](https://github.com/obra/superpowers/commit/71069323964d12f2dca6a1c52066165f4e43ade0)，实际差异头为 [0983b9e3389fef7890e6690cc9fcbc919b779d8a](https://github.com/obra/superpowers/commit/0983b9e3389fef7890e6690cc9fcbc919b779d8a)。它将每步写完整代码改成接口、文件、规格值与断言；保留无法由接口／测试确定的算法和规格指定的精确内容。跨任务引用接口而非复制代码，自审检查比例与歧义，取消固定分钟粒度。[v6.4.2](https://github.com/obra/superpowers/releases/tag/v6.4.2) 于 09-25 发布；本轮比对该 tag、合并提交与既有固定 [v7.0.0 文件](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/writing-plans/SKILL.md)，内容相同，不把旧修订当本周新功能。**[一手：源码／发布]**
- **PR 正文的实验层。** 提交身份为 Fable 5.1／Claude Code 2.1.273；作者列出的评估则是 Bedrock Opus 5 规划、Sonnet 5 执行，同宿主版本。两种设计比较不同配方；简短计划的 9/9 是三次执行中三个植入缺陷探针的通过数，不是九个真实项目，也不是 Opus 5.5 执行结果。作者另试仅列测试名／调用／预期的方案，但因它把测试编写移交执行者而未采用；缩减实现正文不等于删掉测试代码。**[社区：作者实验报告，未独立复跑]**
- **09-25 后续评论的实验层。** [评论 5835302470](https://github.com/obra/superpowers/pull/2333#issuecomment-5835302470) 记录 specrater 现场版本为 Superpowers 6.4.1／CC 2.1.280／Opus 5.5；后续 Opus 5.5／CC 2.1.282 重放比较旧配方、新配方及额外禁止构建段。作者报告旧臂五次都在计划外构建产品，新臂五次均未如此；API／源码调查与小型探针不计为该失败。合成规格的无 Skill 臂也发生构建，所有臂继承强 TDD／验证指令；因此不能把失败单独归因于插件。作者明确这些是单次规划而非现场长程轨迹，未测新计划在 Opus 5.5 上的执行。**[社区：后续报告；研究：归因边界]**

**采用与撤回。** ✅ 对这一失败模式，先让计划保存实施者无法猜出的决定；保留测试断言、关键算法、真实调查和验证条件。若缩减使实施者重新猜接口／验收，就补回缺失决定，不恢复整套代码转抄。比例只作检查信号，不推广固定长度或提速倍数。没有该故障就不增加新流程。**[经验：窄建议]**

补检 [Reddit 的新模型／Superpowers 去留原帖](https://www.reddit.com/r/ClaudeAI/comments/1wt84ix/opus_55_is_the_superpowers_skill_still_needed/)和 [V2EX 的慢速自述](https://www.v2ex.com/t/1210981)，正反意见未提供可追查的同任务产物；它们未改变既有最小补充默认，不据此新增排行或第三项建议。**[研究：本单元负结果]**

### 文档评审循环：实际撤回与按需保留

补核：2026-10-13 UTC。只读公开提交、测试与原帖，未运行模型；本段支持 05 §2.5 的窄建议。

- **固定撤回。** [e6221a48](https://github.com/obra/superpowers/commit/e6221a48c54141e0ef04adaea4895a8150fc57a1) 将 brainstorming／writing-plans 的独立 reviewer、修改与再派发循环改成同会话自审，检查占位符、规格覆盖和接口一致性；用户读规格的关口仍保留。**[一手：补丁]**
- **实际采用者的取舍。** [#1130 维护者回复](https://github.com/obra/superpowers/issues/1130#issuecomment-4270863186) 说明此前采用后收到用户负面反馈，自行评测未见结果改善，因等待和 token 成本拒绝恢复默认流程。[提案作者随后撤回上游推动](https://github.com/obra/superpowers/issues/1130#issuecomment-4275742384)，但保留自己复杂计划的按次独立检查，并承认没有反驳数据。**[社区：双方使用自述与决定]**
- **数值仍是自报。** 撤回提交说明报告五个版本共25次比较、约25分钟额外等待，quality scores 未见改善；本轮限定检索只找到摘要，没有逐次评分、用时和完整模型配置。共同署名不能确定全部运行模型，补丁又同时补强自审约束，不能据此计算当前模型净收益或宣称纯原生无 Skill 等价。**[一手：作者报告；研究：边界]**
- **公开测试不是该对照。** [同 SHA 的测试](https://github.com/obra/superpowers/blob/e6221a48c54141e0ef04adaea4895a8150fc57a1/tests/claude-code/test-document-review-system.sh) 只构造含 TODO／推迟说明的规格、调用一次 Claude 并检查输出，没有自审对照或上述评分表；本轮未执行。**[一手：测试阅读]**
- **当前仍保留窄的独立检查。** 固定 v7.0.0 的 [writing-plans](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/writing-plans/SKILL.md) 仍用自审，其 Native 执行路径仍含最终独立分支检查；[brainstorming](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/SKILL.md) 对书面设计采用单轮 builder check，找实施者还需确认的问题。这不是恢复通用审批循环，本轮也未证明其净收益。**[一手：固定配置]**

**采用判断**：先让同会话核对普通文档内容；发现实施者无法决定的具体问题，或独立检查确实补上遗漏时，再按次保留。只有通用意见与额外等待时可撤回该循环，仍保留必要测试与验收。这里的内容 reviewer 不是工具执行权限的安全 Auto-review，也不能替代或取消用户确认。**[经验：建议范围]**

复访需要逐次原始对照，或复杂真实计划中独立发现、修复与后续使用结果；不靠重复抱怨或更多字面检查扩大结论。**[研究：下一证据条件]**

## 指令清理：保留条件与契约意图

核实：2026-10-21 UTC+8。主线二；补 03 §2.3 清理退出条件。证据限公开使用自报、前后配方与机械检查源码；未取得原产品补丁或运行记录，未安装或执行工具／模型。**[研究：范围]**

- **使用者问题与反例。** [Reddit 原帖](https://www.reddit.com/r/ClaudeAI/comments/1us9hfz/asked_claude_what_in_my_docs_was_hurting_its/)中 eliaff 报告旧表只在脚注被更正、已合入工作仍标待合入，并公布 doc-cleanup；页面仅显示相对日期，不补造发帖日。[07-09 固定 README](https://github.com/aka-luan/doc-cleanup/blob/5fb58667b996a4e77f43969f9c2cee5d60bd1253/README.md)另自报首次清理的子 Agent 把 Premium 可解锁手动审核压成“审核：手动”，最终逐行审阅才发现默认行为被改写。原文没有该产品 diff；缩短行数不是质量证明，提交共同署名也不能确定实际清理子 Agent 的型号。**[社区：作者报告；一手：公开历史文件]**
- **实际撤回而非安装倡议。** [07-14 修订 69dcb952](https://github.com/aka-luan/doc-cleanup/commit/69dcb9528cde90218a95015df85f29e8ce8ac0af)撤掉旧配方“代码胜过漂移规格”的处理，改为代码证明实现、不必然证明意图；无法证实权威已替换时，保留未决冲突，不静默重写契约。[固定 Skill](https://github.com/aka-luan/doc-cleanup/blob/69dcb9528cde90218a95015df85f29e8ce8ac0af/skills/doc-cleanup/SKILL.md)保留有效规则／陷阱，要求逐项列依据与最小处置。该提交也删除默认便宜模型委派段，但不能据此推断模型档位导致错误；未取得新版使用结果。采用的是窄检查条件，不照搬整套审批流程。**[一手：补丁；研究：采用边界]**
- **机械检查的反向边界。** [check-docs 09-19 固定源码](https://github.com/ipaulsmith/check-docs/blob/4bd90cbb80ec02b393ab549f00048f294ea23caf/check-docs.sh)检查特定路径写法、相对导入和手工列出的删除名称；Git 内按索引判断路径存在，要求指令编辑先暂存，绝对／仓库外导入跳过。它不能判定默认行为、适用条件或谁有权改变规格，不能因它通过就批准上述语义清理。不推荐默认安装。**[一手：源码；研究：范围]**

**采用与撤回。** ✅ 已证实的旧路径与状态继续修；保留会改变行为的条件、例外和领域陷阱。遇到实现／意图冲突，只暂停这处语义改写并明确依据，不阻塞无争议清理。压缩后若默认值或条件改变，恢复所需表述；不要靠删除领域知识解决所谓“上下文噪声”。作者自报、公开配置修订和独立效果是三种证据，本单元仅有前两种。**[经验：窄建议；研究：局限]**

## 3. Matt Pocock：控制权与领域语言

作者 README 自述每天用这些 Skills 做工程工作，主张小、可修改、可组合，反对流程工具过度接管。这是作者立场，不是对其他框架效果的客观裁决。**[社区：作者自述；C2]**

实际配置里值得研究的是：**[一手：Skill 文件 C2]**

- `grill-with-docs` 组合访谈和领域建模；README 解释术语表与 ADR 如何降低沟通歧义。
- `tdd` 强调通过公共边界观察行为，不耦合私有实现，不写“用相同算法再算一次期望值”的同义反复测试。
- 一次实现一个纵向行为切片，而不是先批量写完所有猜测中的测试，再批量补实现。

也要看不适合照搬的约定：当前 `tdd` 要求先与用户确认测试边界，并把重构安排在 review 阶段；这是一套特定协作约定，不是 TDD 的唯一含义。已有明确验收与授权时，不应因为引入一个模板而重复询问每一步。**[经验：工程判断]**

### 小型入口的知识与控制成本

[官方 skill-creator 固定快照](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.system/skill-creator/SKILL.md)建议补非显然知识、按脆弱性选择自由度，不证明某个 Skill 已有效；C2 的短 TDD 入口仍要求先确认边界，C1 的调试入口有串行阶段并继续加载 TDD／验证要求。比较完整触发路径与人工等待，不按文件长度判断开销。**[一手：已读配置；研究：采用判断]**

C1 调试入口将多次失败关联架构，并写出无根因案例的百分比，但未给对应统计；保留“停止重复猜测、改变诊断方式”，不以次数确诊架构或把该比例当仓库事实。已有明确授权和验收时也不为通用模板重复询问；契约未定时确认仍可能有价值。**[一手：原文；研究：反证与边界]**

## 5. Pi：少预设流程，开放可组合能力

当前 README 主张 minimal/extensible，不内置子 Agent 和 plan mode，让扩展或使用者决定流程。文档同时已有 MCP 和 codemode，不能继续简单描述为“只有四个工具、没有 MCP”。**[一手：项目文档 C4]**

codemode 允许脚本调用工具、并行读取与过滤大结果，再把需要的输出送回模型。文档明确：脚本失败**不会回滚已经发生的工具副作用**，未等待的调用也有生命周期限制。它减少模型处理的中间文本，但开发者需要检查每个结果的错误与截断状态。**[一手：C4；实践含义为工程判断]**

Pi README 还明确它没有内置的文件/进程/网络/凭证权限限制系统，默认继承运行进程权限。选择这条路线时，隔离由容器、沙箱或部署边界承担。**[一手：C4]**

### 2026-10-15 选型补核：默认工具不是成本或隔离边界

固定 Pi main `b06c1f2cf1dea6af8748ddeee18c23587d2cb7c6`（提交于 2026-10-14；本轮于 10-15 UTC 读取），[package.json](https://github.com/earendil-works/pi/blob/b06c1f2cf1dea6af8748ddeee18c23587d2cb7c6/packages/coding-agent/package.json) 标为 1.2.0，[许可](https://github.com/earendil-works/pi/blob/b06c1f2cf1dea6af8748ddeee18c23587d2cb7c6/LICENSE) 为 MIT；这是固定源码版本，不据包内版本号宣称用户已安装或稳定渠道已发布。**[一手：固定文件]**

- [CLI 工具选择](https://github.com/earendil-works/pi/blob/b06c1f2cf1dea6af8748ddeee18c23587d2cb7c6/packages/coding-agent/docs/cli.md#tools)确认默认启用 `read`、`bash`、`edit`、`write`，不是只有这四种能力；MCP 可按需启用 codemode／tool_search。[MCP 曝光](https://github.com/earendil-works/pi/blob/b06c1f2cf1dea6af8748ddeee18c23587d2cb7c6/packages/coding-agent/docs/mcp.md#control-tool-exposure)还区分直接声明和间接发现，因此工具数不能推出完整任务净成本。**[一手；研究：边界]**
- [安全文档](https://github.com/earendil-works/pi/blob/b06c1f2cf1dea6af8748ddeee18c23587d2cb7c6/packages/coding-agent/docs/security.md)明确：工具、扩展和子进程默认继承运行账户权限；工作目录和 project trust 不是工具运行的隔离边界。若需要保护主机资源，应检查整个进程的容器／虚拟机／沙箱边界，不能仅靠工具审批。**[一手；研究：采用判断]**

**建议与反例**：适合愿意定制并维护隔离的人试用；撤下“默认四工具所以省钱”的迁移理由，但保留默认四工具的事实。这些文件既不证明 Pi 更便宜，也不证明更贵或效果差。只读源码和文档，未安装、运行或测量模型净成本；C4 的历史快照继续保留。**[研究：验证范围]**

### 三个近期使用者帖子

以下都读到了首帖；页面显示无回复，不能当成社区共识。**[社区：原帖 C10]**

| 帖子 | 作者实际报告的做法 | 值得验证的问题 |
|---|---|---|
| **Orbi，10 月 8 日** | Issue 标 `ai-ready` 后运行；实现和评审分会话；只合并审过的 head；每次 attempt 保留 run ID、日志、分支和 PR；卡住标 `ai-blocked` | 审查后代码又变时会否重新审？重试和发布是否去重？作者提供交付链链接，但本轮未运行或审计 Orbi |
| **单次运行硬预算，10 月 7 日** | 通过 provider headers 给网关传 work ID 和预算，网关先预留最大费用，超额返回 402；作者用固定 token 的模拟上游测试 | 并发预留是否原子？取消是否结算？所有请求是否都经过网关？发帖者是该网关维护者，存在产品推广因素 |
| **pi-trim，10 月 1 日** | 删除有限的 harness 样板文字，保留项目规则与工具 schema，提供 diff；作者报告一组十题对照输入减少但费用估计反而增加 | token 减少不等于省钱；缓存、工具定义和定价口径要一起记录。已完成[离线复算](2026-10-10-pi-trim.md)，未重跑模型任务 |

## 6. Aider、OpenHands、Spec Kit：三种不同的控制位置

**Aider 的结对方式**：用 `/ask` 讨论，`/code` 编辑；`architect` 让一个模型提出改法、另一个负责具体编辑。repo map 给出重要符号与签名，实际变更时只加入相关文件；`/test` 或配置的自动测试将真实错误送回模型。**[一手：项目文档 C5]**

适合借鉴的是人随时缩小范围、提供错误和审查 diff 的短循环。文档仍包含较老的模型例子，本轮只引用工作方式，不把 README 的模型列表当成当前最佳推荐。**[经验：选型判断]**

### 2026-10-15 Aider：维护节奏与模型兼容分开判断

本轮重新读取官方 commits API，main 仍是 `5dc9490bb35f9729ef2c95d00a19ccd30c26339c`，提交日期 2026-05-22。[同一提交](https://github.com/Aider-AI/aider/commit/5dc9490bb35f9729ef2c95d00a19ccd30c26339c)合入较新 Claude 模型识别；[HISTORY 的 main branch](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/HISTORY.md)列出 Claude 4.5／4.6 等支持，[模型配置](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/resources/model-settings.yml#L2352)已有 GPT-5.5。旧 README 推荐不代表支持只到旧模型。**[一手：固定源码与历史]**

**建议与反例**：依赖持续模型／接口适配的新项目暂缓采用；没有发现维护恢复，不撤回维护风险。但已有稳定模型与 repo map／显式编辑流程的用户，不必仅凭提交日期迁移。main 支持不等于安装的稳定版支持，也不证明当前所有新模型兼容；未安装或运行，实际可用性仍应按安装版本和所选服务商确认。**[研究：采用判断与验证范围]**

**OpenHands 当前主仓库的 Agent Canvas**：支持本地/远端后端、不同 Agent、定时和 webhook 自动化；自托管文档明确能访问 agent server 的人可以借它操作机器。因此“常驻”带来的是触发、运维和权限管理责任，不能只看长时间自动运行的演示。**[一手：C6]**

**Spec Kit 当前文档**：新功能 SDD、bug 修复、想法评估是独立入口；修 bug 不必先走整个 SDD，最终区分 `verified`、`partial`、`failed`。这比把任何小改动都塞进完整规格流程更值得学习。**[一手：C7]**

### Kiro：规格修订能力与采用边界

核实：2026-10-16（UTC+8）。主线二／三；改变 IDE 工具页与07的Kiro建议：需要保存和审阅跨步骤决定时条件试用，撤回“只适合学习SDD”的依据；额外文档未补实际缺口时收窄流程。以下是官方契约与作者原文核查，没有当前客户端、模型或效率对照实测。**[研究：采用边界]**

**官方修订契约。** [Feature Specs](https://kiro.dev/docs/specs/feature-specs/)（页更新2026-08-04）提供需求先行／设计先行，两者均产出需求、设计、任务文件；EARS是需求表示法，不保证内容完整正确。[Best practices](https://kiro.dev/docs/specs/best-practices/)（页更新2026-09-25）说明：
- 需求先行：手改或要求修改 `requirements.md` → 在spec会话要求更新 `design.md` → 在 `tasks.md` 选择 **Sync Files**，生成映射新需求的任务
- 设计先行：手改或要求修改设计 → 要求验证并重新生成需求 → **Sync Files** 更新任务
- 对别的会话已实现的任务，可用Sync Files或要求扫描代码来标记完成

这些是显式触发路径，不是实现发现约束后必然自动反向同步，也不是测试验收。[Quick Spec](https://kiro.dev/docs/specs/quick-spec/)省去三份产物间的审批；需要迭代需求／设计时仍可保留标准流程。本文只用它反驳“当前只有固定重流程”，不据官方收益措辞宣称更快、更可靠。**[一手：官方文档；研究：能力不等于效果]**

**历史反例归属。** [Understanding SDD](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)作者为 **Birgitta Böckeler**，发布于2025-10-15，记录2025-09试用；文章托管于Martin Fowler网站，不应署名为Martin Fowler。Kiro具体案例是小bug产生四个user stories、十六条验收标准，作者认为负担过重，并提示工具演进快、真实长期维护证据不足。这支持匹配任务，而非当前普遍故障。**[社区：作者试用]**

旧文“12个以上任务、各4个以上子任务”及“实现约束不会自动回写”未能在上述文章、[Zaninotto的2025-11-12原文](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html)或[指定HN讨论](https://news.ycombinator.com/item?id=45935763)中定位。本轮通过Algolia读取该讨论全部189节点，核对Kiro相关评论；这里只记录原引用未支持，不断言全网不存在。旧两项保留为**未验证的历史措辞**，不再用于当前采用评级。**[研究：归因核查与撤回]**

**实际维护中的人工澄清。** [Chad Kluck的2026-02-12逐字稿](https://chadkluck.net/cdx/dev-with-me/2026-02-12-updating-cache-data-using-kiro-part-2/)记录Cache-Data 1.3.8更新：既有API行为不得改变；26:51章节中，他发现分页默认值与maxRetries是否含首次尝试未说明，提问后Kiro更新设计。这是不同作者在已有项目中识别并保留具体约束的使用报告，不是厂商功能复述。页面自称AWS未赞助，不据此推定独立认证或推荐可靠性。**[社区：作者逐字稿]**

该报告仍把分页／重试故障测试列为后续工作。本轮未看完整视频、固定实现提交或复跑，不能声称最终实现通过；没有普通会话基线或工时对照，不能声称净收益。试用时应看人工审阅是否补上真实遗漏、第二次修改是否同步到相关任务与验证；若文档只重复已有内容或持续漏掉已确认约束，退回短说明与现有检查。**[研究：未验范围；经验：撤回条件]**

## 7. 真实人类仍在承担的工作

Ghostty 的 [PR #8289](https://github.com/ghostty-org/ghostty/pull/8289) 中，维护者 Mitchell Hashimoto 一边说明自己使用 AI，一边要求贡献者披露 AI 使用，强调贡献者应能审查生成代码，尊重接收方的评审与维护时间。该 PR 页面显示已合并。**[社区：维护者原帖；一手：PR 状态；C9]**

**Ghostty：已采用重构上的跨人新交互。** 2026-10-19（UTC+8）补核。[#7523](https://github.com/ghostty-org/ghostty/pull/7523) 作者 mitchellh 明确大量重构代码由 AI 起草、逐行人工审阅并手改；2025-06-05 合入 [`efc1ceab`](https://github.com/ghostty-org/ghostty/commit/efc1ceab5d8fd853a0279249df66fb7f11993832)。2025-11-09，不同贡献者 seankit 的 [#9524](https://github.com/ghostty-org/ghostty/pull/9524) 合入 [`84082c2b`](https://github.com/ghostty-org/ghostty/commit/84082c2b965aa59a8f376edcb8d40b41960db96b)：沿原视图层加入 `onEqualize`，取被点击节点的 `leftmostLeaf().surface`，调用已有均分动作；作者自述 Claude Code Plan 模式帮助理解结构，代码自己编写。该链确认已采用的 AI 辅助重构获跨人功能续改及上游接收；接续者的正式维护者身份未核实。**[一手：固定补丁与合入；社区：AI 范围；研究：增量]**

**替代方案与采用限度。** 未合入的 [#8364](https://github.com/ghostty-org/ghostty/pull/8364) 先局部设置 `split = 0.5`，审阅指出三栏应均分；改用既有动作后，又被指出 [focusedSurface 未必属于点击视图](https://github.com/ghostty-org/ghostty/pull/8364#discussion_r2317315808)。#9524 改从节点取 surface，经 bo2themax 审阅批准。当前固定 `765ea37a` 的 [SplitView](https://github.com/ghostty-org/ghostty/blob/765ea37ad64f7e3a48f6ac27a70ad7fb6f31b9bb/macos/Sources/Features/Splits/SplitView.swift#L24-L25) 与 [TerminalSplitTreeView](https://github.com/ghostty-org/ghostty/blob/765ea37ad64f7e3a48f6ac27a70ad7fb6f31b9bb/macos/Sources/Features/Splits/TerminalSplitTreeView.swift#L81-L84) 仍保留双击入口与节点 surface 路径，不代表整个接口未变。[接收说明](https://github.com/ghostty-org/ghostty/issues/8357#issuecomment-3533391178)仅称已实现，未见原报告者修后复测；限定检索未找到撤回，不证明没有回归。这里只确认既有业务动作上的窄扩展可被接收；没有理解／返工工时，未运行 Ghostty、macOS、模型或测试，不证明 AI 净收益、架构优势或 SGLang codec 的跨人验证。**[一手：当前固定源码；社区：审阅与接收；研究：边界]**

### 本仓库判断：强 Agent 的默认基线应更轻

本节只保存判断所依赖的入口配置与反证；任务选择表和净收益建议统一维护在 [24 正文](../24-community-workflows.md#本仓库判断强-agent-的默认基线应更轻)。

补读入口文件后，可以更具体地解释成本来源：[using-superpowers](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/using-superpowers/SKILL.md) 要求哪怕 1% 可能相关也先加载，采用极低触发阈值，并在 Plan 前安排 brainstorming。这与 Codex 原生 Plan 已包含探索与澄清存在功能重叠；是否实际重复取决于所装版本、任务与运行路径，未做组合实测。[官方 Skill 也可能带额外批准关口](../05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么)，不能只批评社区项目。**[一手；研究：采用判断]**

同时避免稻草人：本轮读取的 Superpowers 允许简单任务直接做，也有 inline 执行路径。应检查所装版本的实际触发情况，不把它概括成“任何任务都会强制全套流程”。用户采用率是否下降，需要另外的数据；本轮没有这样的证据。**[一手：C1 + 分析边界]**

### 不同作者的实践补充：把新知识交给 Agent，再检查实际产物

Simon Willison 的 [research 仓库](https://github.com/simonw/research/tree/4f5f23ed56019c498baabe9063a646f50a386a73) 保存异步 Agent 的研究产物，根 README 提醒报告多为 AI 生成，并尝试在 PR/提交保留提示和轨迹。因此它适合追到具体材料，不能把每篇生成报告直接当作作者亲自验证的结论。其博客本轮不可访问，只引用实际读到的 GitHub 文件。**[一手：仓库说明；研究：使用边界]**

[Starlette 1.0 Skill](https://github.com/simonw/research/tree/4f5f23ed56019c498baabe9063a646f50a386a73/starlette-1-skill) 保存了领域 Skill、一个短的应用需求提示和生成的任务管理 demo。这展示了一种值得试的分工：人明确要什么，Skill 补版本特定 API 知识，Agent 实现。正文约 1,300 行，触发描述也很宽；本轮只读部分内容与 demo 入口，未运行或验证所有 API，不能声称它比简短参考资料更有效。**[一手/社区；研究：采用判断]**

同仓库 [DSPy / Datasette prompt 研究](https://github.com/simonw/research/tree/4f5f23ed56019c498baabe9063a646f50a386a73/dspy-datasette-agent-prompts) 报告优化后训练得分上升、留出集下降，并解释评分器误判“语义上的零”和并列第三名。保存的结果 JSON 只有汇总分数，不足以独立重算逐题表现；本轮没有重跑模型。这组旧模型、小数据结果不外推到 Astra。**[社区：AI 生成报告；一手：文件检查；研究：判断]**

### Codex 实际开发：需求、纠正与本机验证是不同的工作

Simon Willison 的 [research PR #10](https://github.com/simonw/research/pull/10) 保存了 **2025-11-03 的 Codex Cloud** 原始需求及后续反馈，任务是为 Rust 地理索引库 h3o 写 Python 绑定。它补充了 Catalog Compare 之外的作者与任务类型；不是当前 Astra 的能力测试，页面没有足够信息确认具体模型。**[社区：作者原帖]**

| 过程 | 可读证据 | 能借鉴什么 |
|---|---|---|
| 明确交付 | 提示要求可构建 wheel、pytest、README、持续 notes，以及 PR 不含二进制资产 | 用实际使用方式描述产物，不只要求“写绑定” |
| 人纠正范围 | 作者说首次尝试失败后，追加不得提交检出的上游源码、控制 PR 大小 | 把失败变成具体交付约束；这里没有首次失败的完整 diff，不能独立断定全部原因 |
| Agent 留下实现 | 合并快照有 Rust/Python 包装、构建配置、锁文件、7 个测试函数与笔记 | 可追查输出；笔记中的“已测试”仍是生成记录，不等于独立验收 |
| 人实际使用 | 作者报告本机构建、导入和坐标转换成功，另测 Python 3.12 成功、3.14 构建失败 | 检验发布产物和目标环境，而不只复述 Agent 的 pytest 总结 |

本轮读取固定合并提交 [`f7bffaf`](https://github.com/simonw/research/tree/f7bffaf8054aa64db93d0b69e3fd3121097fbdbf/h3o-python) 下全部 7 个非锁文件，并检查含锁文件的 8 文件清单；未重新构建 Rust 扩展，未读取所链接的完整 ChatGPT 会话。因此可以还原公开需求、人的反馈和最终源码，不能还原每次工具调用、统计成本或证明首次失败到最终成功的唯一原因。**[一手：源码；研究：本仓库检查范围]**

独立审查还发现三处值得保留的边界：**[研究：本仓库分析，依据同一固定提交]**

- `pyproject.toml` 声明 `requires-python = ">=3.8"`，README 也写 Python 3.8 或更新；但作者已报告 3.14 失败，依赖仍是 PyO3 0.21。宽泛兼容声明超过了公开验证范围；不要照抄成今天可用的打包建议。
- 坐标测试注释声称约 100 米，断言却允许经纬度各偏差 0.01 度；纬度 0.01 度约 1.1 公里，注释比实际断言严格。测试存在不等于测试保证了宣传的精度。
- notes 记录“把面积预期改为库的精确返回值”。这可能是正确修正，也可能削弱独立预期；缺少原始断言与修改依据，不能定性为篡改测试。保留官方常量或独立参考计算，才能判断这次修改是否合理。

作者另用 Gemini 生成 API 文档，但原帖不能证明该步骤改善了最终绑定质量。**[社区；研究：归因边界]**

## 8. 来源与阅读范围

### 项目固定快照

- **C1 Superpowers**，`bb92a77741419a4ab5f06e711a283343f1ada0c3`：[README](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/README.md)、[计划](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/writing-plans/SKILL.md)、[子 Agent 执行](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md)、[调试](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/systematic-debugging/SKILL.md)、[完成验证](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/verification-before-completion/SKILL.md)、[访谈](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/SKILL.md)。阅读相关流程；没有在本仓库安装或执行这些 Skills。
- **C2 Matt Pocock Skills**，`49dd158d1076134a641b33efb035946536778336`：[README](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md)、[TDD](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/tdd/SKILL.md)、[grill-with-docs](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/skills/engineering/grill-with-docs/SKILL.md)。阅读作者经验与配置；未验证其跨模型效果。
- **C3 HumanLayer**，`1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e`：[上下文工程](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/ace-fca.md)、[软件工厂复盘](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/wsff.md)、[10 月 SlopCodeBench 报告](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/benchmarking-new-models-on-slop-code-bench.md)。阅读相关论述与报告；没有复算其原始实验。
- **C4 Pi**，`42a3497d03ad17e308a2299fa824727894f2c0ec`：[README](https://github.com/badlogic/pi-mono/blob/42a3497d03ad17e308a2299fa824727894f2c0ec/README.md)、[codemode](https://github.com/badlogic/pi-mono/blob/42a3497d03ad17e308a2299fa824727894f2c0ec/packages/coding-agent/docs/codemode.md)、[MCP](https://github.com/badlogic/pi-mono/blob/42a3497d03ad17e308a2299fa824727894f2c0ec/packages/coding-agent/docs/mcp.md)。旧仓库入口已跳转到 earendil-works/pi；引用固定提交，不据 main 推断已安装版本行为。
- **C5 Aider**，`5dc9490bb35f9729ef2c95d00a19ccd30c26339c`：[Tips](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/website/docs/usage/tips.md)、[Modes](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/website/docs/usage/modes.md)、[repo map](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/website/docs/repomap.md)、[lint/test](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/website/docs/usage/lint-test.md)。阅读机制，不采用旧模型排名。
- **C6 OpenHands**，`5a8c3832154b14d2dad651801c0ab3f74c96f02e`：[README](https://github.com/OpenHands/OpenHands/blob/5a8c3832154b14d2dad651801c0ab3f74c96f02e/README.md)、[Self-hosting](https://github.com/OpenHands/OpenHands/blob/5a8c3832154b14d2dad651801c0ab3f74c96f02e/docs/SELF_HOSTING.md)。阅读当前产品入口与部署边界，未部署。
- **C7 Spec Kit**，`0443760542e7e5269724744a2ac55c4bd386d095`：[README](https://github.com/github/spec-kit/blob/0443760542e7e5269724744a2ac55c4bd386d095/README.md)。阅读三条过程入口；未执行流程。

### 技术社区原帖

- **C8 Superpowers 问题反馈**：[#2470 计划与测试的共同盲点](https://github.com/obra/superpowers/issues/2470)、[#2450 接口变更后的计划漂移](https://github.com/obra/superpowers/issues/2450)。本轮读取首帖，未将用户报告提升为已复现缺陷或维护者结论。
- **C9 公开交付与维护者反馈**：[BAML #2259](https://github.com/BoundaryML/baml/pull/2259)、[Ghostty #8289](https://github.com/ghostty-org/ghostty/pull/8289)。读取 PR 描述、可见讨论与合并状态；未重新运行测试。
- **C10 Pi 使用者分享**：[Orbi #10687](https://github.com/earendil-works/pi/discussions/10687)、[运行预算 #10581](https://github.com/earendil-works/pi/discussions/10581)、[pi-trim #10304](https://github.com/earendil-works/pi/discussions/10304)。读取首帖；pi-trim 另已读取源码并完成离线检查与数据复算，未重跑模型效果。其他项目不据首帖认定运行可靠性。

## 9. 下一轮怎么继续探索

后续问题统一进入 [BACKLOG](BACKLOG.md)，不在本页重复排队。已开展的 [brief／接口追查](2026-10-12-baml-and-review.md#后续任务相同-brief-与过期接口)、[pi-trim 复算](2026-10-10-pi-trim.md)和[检索工具机制核查](2026-10-13-context-tool-choice.md)以各自记录为准；仍缺完整流程的同任务净收益、Orbi 交付链验证及更广社区原帖，不把机制检查当成已补足这些缺口。**[研究：证据状态]**


## Codex 文件排除：从关闭请求到采用条件

核实：2026-10-15（UTC+8）。主线二，支持 [10 的唯一采用建议](../10-security.md#codex-文件排除的采用条件)与 [11 的社区案例](../11-community-pulse.md#1-已关闭的需求是否已适合采用)。只读公开资料；没有运行客户端、模型或沙箱，不改变权限，不访问真实秘密。**[研究：范围]**

### 请求、实现、发布与后续

1. [#2847 首帖](https://github.com/openai/codex/issues/2847)要求确定性排除文件读取与传给模型，同时保留其他代码检索；不是只要求搜索降噪。关闭日期为 2026-06-29。**[社区：需求；一手：元数据]**
2. [固定提交 46f30d02828bd4c52827e5f0482a6f2a982cce5b](https://github.com/openai/codex/commit/46f30d02828bd4c52827e5f0482a6f2a982cce5b)（#18202，2026-05-12）补 Windows deny-read：`core/src/exec.rs` 将拒绝路径交给 elevated 后端，`windows-sandbox-rs/src/spawn_prep.rs` 同步应用 ACL 后才启动；legacy unelevated 的 `WRITE_RESTRICTED` token 不能保证读取拒绝，故拒绝带 deny-read 的运行。`unified_exec/tests.rs::legacy_non_tty_cmd_rejects_deny_read_overrides`包含对应拒绝断言。读取源码与测试定义不等于已执行测试。**[一手：固定补丁]**
3. [CLI rust-v0.138.0](https://github.com/openai/codex/releases/tag/rust-v0.138.0)于 2026-06-08 发布；[固定提交到该 tag 的比较](https://github.com/openai/codex/compare/46f30d02828bd4c52827e5f0482a6f2a982cce5b...rust-v0.138.0)返回 `status=ahead`、`ahead_by=801`、`behind_by=0`，`merge_base_commit.sha` 为该固定提交。证明这个已发布版本包含实现，不宣称它是首个发布版本，也不证明 Desktop 构建对应关系。**[一手：GitHub 发布与祖先关系]**
4. [维护者 6 月 29 日回复](https://github.com/openai/codex/issues/2847#issuecomment-4834554458)指向 Beta permission profiles，说明 CLI 能运行时切换，而 App 有更多 agent-loop 创建入口，当时仍在完善。[关闭回复](https://github.com/openai/codex/issues/2847#issuecomment-4835603738)以 Beta 已实现为由关闭并要求另报后续问题。**[一手：维护者说明]**
5. [7 月 24 日后续](https://github.com/openai/codex/issues/2847#issuecomment-5069244554)报告同用户、同机、同配置：CLI 0.145.0 拒绝读取，Windows App 26.721.31836 仍读取被排除文件。评论请求返回 92 条，检查关闭当日及之后的回复，末条为这项报告，未见其后的维护者修复确认；没有全面搜索所有后继工单或复现，不推断当前 10 月 App 仍有此故障。**[社区：使用者自报；研究：检索限度]**

### 当前契约与会改变选择的边界

[官方 Permissions](https://learn.chatgpt.com/docs/permissions)当前仍标 Beta。普通配置选择中，任一已加载 `sandbox_mode`、显式 `--sandbox` 或选中 config profile 的 `sandbox_mode` 会选择旧沙箱设置，覆盖 `default_permissions` 的使用；托管 `allowed_permission_profiles` 会要求使用权限 profile，是明确例外。这解释为何“已经写入 deny”仍不足以判断生效，不能把旧 `--sandbox read-only` 当成新 profile 上附加的一层保护。**[一手：当前官方契约；研究：采用影响]**

平台现状与旧反例须分开：macOS 用 Seatbelt；Linux／WSL 用 bubblewrap 与 seccomp，不能执行所需操作的宿主无法运行受限策略；Windows 当前有 MXC，另有 legacy elevated 与能力较弱的 unelevated，不能执行的策略应拒绝。该页面声明本地命令控制范围，不把它扩展为 MCP、浏览器、连接器和云环境的一份通用策略，也不以 CLI 源码证明具体 App 已部署。**[一手]**

固定 Windows 补丁把 glob 展开为启动前已有匹配，精确不存在路径则可先物化后拒绝；当前文档仍说明 Linux／WSL／Windows 的 glob 预展开与 `glob_scan_max_depth` 条件。因此，任务中会新建的秘密或深层路径不能仅凭启动时 glob 匹配成功就放行；稳定秘密优先留在环境外，采用固定目录排除时还需核对更具体的允许条目，官方允许更具体路径重新开放子树。此边界支持暂缓放入秘密，不建议自行改 ACL 或靠反复调权限解决。**[一手：固定实现及当前文档；经验：采用边界]**

### 反证、撤回与后续验收设计

- 反对“无法排除文件”：实现与已发布 CLI 确实存在；官方现在支持原生 Windows，旧 App 报告不能当永久平台禁令。**[一手／研究]**
- 反对“关闭等于所有入口已解决”：维护者当时明确区分入口，随后用户报告不同结果；当前配置优先级仍要求确认真正生效策略。没有当前 App 独立成功或失败结果，保留未知。**[一手／社区／研究]**
- 后续只在获准的隔离测试环境用无秘密夹具：记录版本、入口、实际 profile 与后端，对照允许文件可读／指定拒绝文件不可读；若采用 glob，覆盖所需深度和任务中新建文件的情境。入口或后端变化后重验；不能用 CLI 通过替代 App 或 MCP 验收。当前阶段只预注册，没有执行。**[研究：后续设计]**

本轮撤回 11 的旧点赞排行和据其推导的整体痛点／趋同结论，不重新认证其他历史社区段落，不把这一个需求升级为社区共识，也不复制 19 的审批策略来源研究。**[研究：收敛范围]**

## 历史口碑不能直接推出双工具采用

核实：2026-10-15（UTC+8）；对应 11 §2–3。只读公开资料，未运行模型、客户端或付费实验。**[研究：范围]**

### 本轮新增证据与采用变化

通过公开 Algolia API 读取 [47750069 完整串](https://hn.algolia.com/api/v1/items/47750069)与 [48989357 完整串](https://hn.algolia.com/api/v1/items/48989357)，包括嵌套回复；web 打开失败后普通 HTTPS 读取成功。前者发于 2026-04-13，后者发于 2026-07-21；这次重读不把历史模型与价格当当前事实。以下均为作者自述，不是实测或总体统计。**[社区：原帖；一手：读取范围]**

| 原帖作者与日期 | 实际证据 | 对旧泛化的限制 |
|---|---|---|
| [kypro，4 月 13 日](https://news.ycombinator.com/item?id=47750736) | 同事有人改用 Codex，同时建议已有良好 Claude Code 工作流的人不必换 | 赞许不等于推荐所有人迁移 |
| [d-lo，4 月 13–14 日](https://news.ycombinator.com/item?id=47751351)，[补充](https://news.ycombinator.com/item?id=47756314)，[CLI 细节](https://news.ycombinator.com/item?id=47760598) | 偏好 GPT-5.4 high 的自建 CLI 任务更新；说宽泛 UI 任务 Claude 较好，但给设计与明确要求后 Codex 也可用；后续又说两者都能很好遵循 tracker Skill | 不能据此得出固定“Claude 做 UI、Codex 管任务”分工；未公开 tracker 产物或逐次失败记录 |
| [vampiregrey，4 月 13 日](https://news.ycombinator.com/item?id=47751252) | 用 Claude Code 持久会话、计划任务与远程 Playwright；明确没有以相同深度试 Codex | 不是两工具能力对照，不能据此给另一工具判缺功能 |
| [beecasthurlbow，7 月 21 日](https://news.ycombinator.com/item?id=48990675) | 自述 Sol 在小型非遗留项目上墙钟时间更快、话少，也更易被旁支话题带偏 | 速度有任务限定；关于上下文窗口的因果解释只是作者猜测，不采用为事实 |
| [aykutulis，7 月 21 日](https://news.ycombinator.com/item?id=48995909) | 认为复杂系统中 Claude 修改所需返工更少，因此可能更便宜 | 构成“Codex 普遍性价比高”的样本内反例，不证明 Claude 普遍更便宜 |
| [wek，7 月 21 日](https://news.ycombinator.com/item?id=48996640) | 两者全天使用、互查，并认为 harness 同样重要 | 确有双工具用法；相关评论未附具体修复、复测或费用账本 |
| [bicepjai，7 月 21 日](https://news.ycombinator.com/item?id=48999094) | Claude 计划执行、Codex 评审；把三次无发现与测试覆盖率当收敛条件 | 描述个人规则，没有同任务单工具对照或逃逸缺陷数据，不能证明该规则有效，也不推荐照抄次数门槛 |

**证据缺口与撤回**：两串包含不同作者，足以确认存在多种做法，但交叉检查评论没有提供可沿链读取的维护者修复与实际复测产物。不能从偏好数量推采用率，也不能把没有公开产物写成“从未修好”。因此撤回 11 §2 的年度胜负、速度／UI／性价比固定分工和默认“双持”，而不是用这些弱样本推荐另一套工具。若已有工具没有具体阻塞，保留现状；需要第二视角时只链接 09 的既有判断，不在 11 再维护评审方法。**[研究：采用判断]**

**重新考虑条件**：出现可追查的原始任务、单工具遗漏、第二工具发现、人的修复与目标环境复测，并能说明新增等待与费用时，可据其任务范围补一条窄建议；即便出现一条成功链，也不能恢复“社区普遍如此”或固定工具分工。当前没有做模型收益对照。**[研究：下一证据条件]**

### 11 §3 已撤回的旧主张（不作为事实引用）

撤回对象：旧正文仅引 [Cursor 论坛总帖](https://forum.cursor.com/t/pricing-megathread-and-q-a/116395)，却将定价抱怨、2026-08 用量页／CSV移除费用、2026-06 SpaceX以600亿美元收购、8月停止供模、转售API难敌官方补贴订阅及大量用户迁移连成因果链。下节官方公告已闭合收购完成，供模则纠正为终止计划；金额、费用展示和普遍迁移等断言仍未恢复，不能引用旧链决定迁移。**[研究：撤回对象与纠正范围]**


### Cursor 供模计划与实际入口：2026-10-15 补核

- [OpenAI 8月28日声明](https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/)宣布拟终止供模合同，提出11月12日截止且不提供未来模型；[当前帮助页](https://help.openai.com/en/articles/20001506-using-openai-models-in-cursor)明确最终日期仍待双方确认，Cursor 可提前结束。因此13旧“8月停止供应”把计划写成已执行，不能沿用；也不承诺过渡期可用至某日。**[一手：计划与当前说明]**
- **入口不能互换**：该帮助页区分独立 Codex IDE 扩展与本地 Chat／Agent 的 BYOK；扩展不改变 Cursor 原生服务用的模型，BYOK 不覆盖 Tab、Auto、Cloud／Background Agents、Automations、CLI、API／SDK，API 费用也独立于订阅。[Cursor 自身文档](https://cursor.com/help/models-and-usage/api-keys)还把 OpenAI BYOK 限于 standard non-reasoning chat models，以实际模型选择器为准；Teams／Enterprise 另有 Cursor Token Rate，Cursor 的 ZDR 不覆盖 BYOK，请求仍经过其后端构造提示。不能把“可带密钥”当任意模型、云端任务或纯本地路径的替代保证。**[一手：双方当前入口契约]**
- [Cursor 8月14日公告](https://cursor.com/blog/joining-spacex)确认收购完成，取代“收购事件未核”的旧缺口；它不证明实际性能、费用或迁移收益。Reuters 旧链接本轮未能读取，600亿美元金额不影响当前选择，从13新闻正文撤下，旧断言仍在上节留作审查定位。**[一手：收购完成；研究：收窄范围]**

**采用判断**：仅当必要路径不满足才考虑迁移，先分别核入口、模型支持、费用及数据政策。这里是公开契约核查，未安装客户端、配置凭据或验证真实账户；未恢复旧段“普遍涨价／大量用户迁移”的无据概括。**[经验：条件建议]**

同轮收敛13的指令长度入口：[Claude 官方说明](https://code.claude.com/docs/en/memory#write-effective-instructions)以每份 `CLAUDE.md` 少于200行为建议目标，不是加载截断；`MEMORY.md` 在会话启动时加载首200行或25KB，以先达到者为准。官方另说明 `CLAUDE.md` 不超过4MiB时完整加载、超过则跳过；这不是200行建议的含义，imports也不降低启动加载量。13回链03按任务价值取舍，不把该建议扩成所有指令的硬门槛，未做遵从或成本实验。**[一手；研究：范围]**


## 社区体验、额度与迁移不能代替采用证据

核实：2026-10-15（UTC+8）；主线二、三、四，对应 11 §6–7。只读公开原帖，未运行模型或迁移实验，不保存个人用量明细、账号信息或社会事件细节。**[研究：范围]**

### 新读取范围

HN 的 [成本串](https://hn.algolia.com/api/v1/items/49997161)（10 月 7 日）、[乐趣串](https://hn.algolia.com/api/v1/items/49979306)（10 月 6 日）、[常驻工具串](https://hn.algolia.com/api/v1/items/49896604)（9 月 29 日）、[Haskell 讨论串](https://hn.algolia.com/api/v1/items/49854875)通过普通 HTTPS 取得完整嵌套 JSON；web 的 Algolia 入口失败，HN 网页可读。正文只使用下列实际阅读的相关回复，不声称逐条审计四串。V2EX [额度](https://www.v2ex.com/t/1246316)及[交付](https://www.v2ex.com/t/1246486)均读取首帖与全部回复 API（分别 12、10 条）；网页抽取漏掉部分回复，不能仅据网页空白判断不存在六折自述。**[一手：读取范围]**

### 会改变选择的证据与反证

- **降档不是统一预算结论。** 成本串 [49999802](https://news.ycombinator.com/item?id=49999802)报告例行调试、依赖和测试任务适用较低档模型；[49998245](https://news.ycombinator.com/item?id=49998245)区分健康检查与需要业务上下文的 SRE 调查，报告工具使用障碍；[49998590](https://news.ycombinator.com/item?id=49998590)又报告其基础 SRE 分析够用。都是使用自述，无共同任务、质量结果和费用账本。反证限制的是“不分任务统一降档”，不是证明某模型永远不适合 SRE。公司新闻与帖子分数无法证明本团队硬预算的必要阈值或执行能力，预算合同只在 02／18 维护。**[社区／研究]**
- **体验不推出手写配额。** 乐趣串 [49980570](https://news.ycombinator.com/item?id=49980570)以乐器类比担心技能生疏；[49984233](https://news.ycombinator.com/item?id=49984233)则描述人负责目标与设计反馈、委托实现。这是不同偏好与工作方式，非长期技能或缺陷对照。V2EX 交付串的责任论与继续依赖 AI 的回复并存，没有产物可复验。撤回“关键模块必须手写”和“回复普遍认为”，不撤回交付与接手责任。**[社区／研究]**
- **开放格式不是迁移验收。** [49903477](https://news.ycombinator.com/item?id=49903477)提出让 Agent 输出 Markdown；[49901636](https://news.ycombinator.com/item?id=49901636)将切换容易建立在能导出记忆／历史的前提上，同时指出 API 连接。两条相关回复没有实际导出、导入、行为恢复与耗时记录，不能证明格式涵盖全部状态或权限。若迁移是采用前提，应核所需产物与目标入口；未来只有具体迁移链能支持窄的成本判断，不能把提议升级为已验证收益。**[社区／研究]**
- **六折有出处，但仍只是自述。** V2EX 额度串第 7 条回复明确自报跨档位、同模型后得出六折；不是“没找到所以是假”。没有公开可复算任务与前后基线；第 8–9 条提供相反耐用感受，第 5 条报告显示与限额不同步，第 12 条提到不同推理设置。订阅档位、任务、模型／推理设置、计量窗口均未控制，不能把这些体验合成统一降额，更没有“最划算”的完成质量与总成本比较。只在确有自己任务的限制或交付失败时重新考虑套餐／模型，正式规则回 02。**[社区／研究]**

### 收敛与验证边界

11 删除点数／情绪排行及不改变具体选择的新闻，撤下未经本轮核实的账号原因猜测、保留期限、采用率和工具指控；不保留或新增敏感个人细节，不裁定事件真假。保留三项条件选择和额度反证，未另建价格表或专题。重新扩大建议需同任务的质量／成本对照、可接手产物或实际迁移记录；更多赞数与体验帖不能替代。**[研究：撤回与重新考虑条件]**

L2 入口一致性补核：只对照 03 的有限研究样本与记忆采用条件、04 的凭证／进程边界、10 的模拟审批范围及 18 开头预算判断，收窄 11 §4–5 的五处泛化；未重新认证全部历史动态事实，不因此声称达到 L3。**[研究：本轮修订范围]**


## JetBrains：同名 Agent 不等于原 CLI 环境

核实：2026-10-15。对应01选型与JetBrains深页；只读公开文档及原帖，未安装、登录或运行客户端。🧪 已有IDE入口满足必要路径时可继续用；不因同名Agent出现在AI Chat，就推断它继承原CLI的执行环境、认证、命令或插件。**[研究：采用判断]**

- **当前接入契约**：[ACP 2026.2文档](https://www.jetbrains.com/help/ai-assistant/acp.html)（页日期10月7日）区分Registry与自定义agent；Registry安装时IDE管理所需运行时，已有兼容runtime可复用，自定义agent则由IDE作为子进程启动；ACP无需JetBrains AI服务订阅，但当前列WSL不支持。MCP／IDE MCP须按所需能力选择暴露，不等于自动继承全部IDE工具。此WSL限制仅按该ACP页面表述，不外推全部JetBrains产品。**[一手]**
- **认证与插件分别核**：[Codex集成](https://www.jetbrains.com/help/ai-assistant/codex-agent.html)有JetBrains AI订阅、ChatGPT登录、OpenAI API key三路；只有BYOK限定OpenAI直接key，第三方key即使提供同品牌模型也不支持。[Claude Agent](https://www.jetbrains.com/help/ai-assistant/claude-agent.html)明确不同于独立Claude Code [Beta]插件，slash commands仅支持子集。两种集成都不遵从AI Assistant的`.aiignore`；需要排除敏感文件时沿用[10的实际权限边界](../10-security.md)，不能把编辑器排除规则当通用安全隔离。**[一手：当前产品契约]**
- **历史使用反例**：[LLM-28234](https://youtrack.jetbrains.com/issue/LLM-28234)原报告在PyCharm26.1.2打开WSL工程，CLI经第三方服务可用，AI Chat却认证失败；改Windows侧认证后仅认证通过，API错误仍在。5月29日维护者解释，IDE管理独立runtime／认证状态，agent跟随IDE backend所在host；直接从Windows打开WSL路径不等于使用WSL CLI状态。6月2日原报告者后续反馈两种Codex入口分别路径失败与provider检测失败，维护者说明当时legacy native／ACP过渡。6月22日因缺补充信息自动关闭为Incomplete，没有最终恢复回执。**[社区：同一用户的初报与后续反馈；一手：维护者解释，未复现]**

原帖及全部4条评论通过匿名公开YouTrack API读取。维护者历史上提出Remote Development等绕过，不足以覆盖当前文档的WSL支持限制；不据旧β标签识别当前实现，不把自动关单当修复。未核到对应闭源客户端固定实现，不用第三方ACP适配器源码冒充该集成；没有当前账户运行结果或效率对照，不能升级为跨平台支持或迁移收益保证。**[研究：证据边界]**


## Gemini：编辑记录撤回与项目快照恢复

核实：2026-10-15。对应01回滚矩阵与Gemini深页。🧪 原生编辑记录撤回够用就不加工具；要恢复项目快照时，先核人机混改与实际文件范围，不能用同名“回滚”能力决定迁移。固定源码为main的`06d329873703ddabe8a842d962342ac4ad779e83`，不是稳定发布版已实测结果；未安装、运行客户端或执行恢复。**[研究：采用判断与验证边界]**

- **两个入口**：[官方 rewind](https://geminicli.com/docs/cli/rewind/)限定AI编辑工具记录，不覆盖shell或人工改动；[checkpointing](https://geminicli.com/docs/cli/checkpointing/)默认关闭，启用后保存shadow Git快照，`/restore`恢复项目与对话并重新提出工具调用。[固定 rewindFileOps](https://github.com/google-gemini/gemini-cli/blob/06d329873703ddabe8a842d962342ac4ad779e83/packages/cli/src/ui/utils/rewindFileOps.ts#L175-L280)读取工具的fileDiff，内容相符则撤回；已有后改则尝试逆补丁，冲突会告警。因此也不保证任意重叠人工改动都能保留。**[一手：契约与固定实现]**
- **实际Git环境**：[GitService](https://github.com/google-gemini/gemini-cli/blob/06d329873703ddabe8a842d962342ac4ad779e83/packages/core/src/services/gitService.ts#L105-L233)在项目根运行，`GIT_DIR`指向history目录的`.git`，`GIT_WORK_TREE`指向实际项目根；[Storage](https://github.com/google-gemini/gemini-cli/blob/06d329873703ddabe8a842d962342ac4ad779e83/packages/core/src/config/storage.ts#L326-L330)按项目标识取history目录。因此元数据与索引属于shadow，修改的是项目文件；项目自身Git的tracked/untracked分类不能直接代替shadow分类。环境另设global/system配置，不沿用用户全局Git配置。**[一手]**
- **忽略与快照范围**：setup复制项目根`.gitignore`到history目录，但实际Git工作树仍为项目根，不能把树外副本当作唯一有效规则。按[Git忽略契约](https://git-scm.com/docs/gitignore)，工作树各级`.gitignore`、所用Git目录的`info/exclude`及有效excludesFile共同决定忽略；项目自身`.git/info/exclude`不是shadow的exclude，代码也未把`.geminiignore`转成Git规则。快照对整个工作树执行add/status/commit，并非仅存本次编辑文件；已被shadow跟踪的路径不因新增ignore自动停止跟踪。[checkpointUtils](https://github.com/google-gemini/gemini-cli/blob/06d329873703ddabe8a842d962342ac4ad779e83/packages/core/src/utils/checkpointUtils.ts)还允许创建快照失败后退回当前shadow commit并记录错误，有checkpoint名不证明取到了新的调用前快照。**[一手；研究：范围推断]**
- **恢复与清理范围**：GitService按目标commit恢复工作树，没有回退shadow HEAD/index；[Git restore契约](https://git-scm.com/docs/git-restore)允许移除shadow已跟踪但目标树不存在的路径。随后清理shadow未跟踪、当时未忽略的文件及目录；[Git clean契约](https://git-scm.com/docs/git-clean)区分普通清理、忽略文件和嵌套仓库，该实现没有要求清除所有ignored文件或强制清除嵌套Git仓库。若恢复也改变了`.gitignore`，后续清理看到的规则会随之改变，不能承诺恢复前ignored的文件始终保留；更不恢复外部数据库或远端副作用。**[一手：命令契约；研究：组合推断，未执行]**
- **调用者检查的边界**：[CLI restoreCommand](https://github.com/google-gemini/gemini-cli/blob/06d329873703ddabe8a842d962342ac4ad779e83/packages/cli/src/ui/commands/restoreCommand.ts)仅在启用checkpointing时注册，检查文件名在目录列表中及JSON/schema后调用[performRestore](https://github.com/google-gemini/gemini-cli/blob/06d329873703ddabe8a842d962342ac4ad779e83/packages/core/src/commands/restore.ts)。后者先交付历史恢复，再检查Git服务并恢复文件；已读CLI→core→GitService链未见人工修改备份、dry-run或冲突预检。[ACP](https://github.com/google-gemini/gemini-cli/blob/06d329873703ddabe8a842d962342ac4ad779e83/packages/cli/src/acp/commands/restore.ts)与[A2A](https://github.com/google-gemini/gemini-cli/blob/06d329873703ddabe8a842d962342ac4ad779e83/packages/a2a-server/src/commands/restore.ts)也调用同一核心，但各有入口检查；本轮不据此宣称所有客户端外层均无安全机制。**[一手：静态调用链；研究：审查范围]**

历史[#11243](https://github.com/google-gemini/gemini-cli/issues/11243)是Windows／0.8.1用户报告对话似已恢复、文件却未恢复，后来以stale／not planned关闭，本轮未取得最终恢复回执；只作历史失败反例，不证明当前版本仍坏。上述来源足以区分恢复机制，不证明当前跨平台成功率、混改保留率或相对其他客户端的净收益。**[社区：原始自报；研究：不可外推范围]**


## 实践者倍率：分清作者与收益口径

核实：2026-10-15 UTC。对应11 §4及13 §4；直接读取[文章原文](https://obryant.dev/p/2x-not-10x/)与[HN完整嵌套JSON](https://hn.algolia.com/api/v1/items/49047839)，实际阅读下列相关评论及回复，未逐条审计全串。未运行模型或取得完整工时记录。**[研究：范围]**

- **文章作者，2026-07-25。** 《2x, not 10x》试探性地说可能有约2倍改善，未提供测量，描述生成初稿后仍需大量结构迭代；没有“评审需手写2–3倍时间”或“真正增量来自原本不会做的项目”这两项结论。原文可读，不是历史材料失联。**[社区：作者原文]**
- **评审负担，2026-07-31。** [Xcelerate](https://news.ycombinator.com/item?id=49118572)自报Claude生成较快，但认真评审耗时是自己手写全部代码所需时间的2–3倍；这是另一位作者，未提供可复算任务与工时。[taberiand](https://news.ycombinator.com/item?id=49118606)则说自己的评审投入接近审初级程序员代码；[devinparadise](https://news.ycombinator.com/item?id=49126785)提出另一Agent评审。这些回复既不支持统一倍率，也未证明额外评审的净收益。**[社区：不同作者自述与建议]**
- **新增任务，2026-07-30。** [5555watch](https://news.ycombinator.com/item?id=49116268)描述过去不会尝试的论文复现，也抱怨生成代码冗长；[andy99](https://news.ycombinator.com/item?id=49116562)描述新增前端任务，同时报告部分任务浪费时间后改回手写。任务集合变化是可保留的自述，不等于这些产物已验收、长期有用或创造统一价值倍数。**[社区／研究：范围]**

**修订与采用。** 撤回把三种口径归到同一篇文章的写法，保留各自出处；既有任务比较完整交付成本，新任务先验证用途，不按单人倍率要求手写或免审，评审条件仍回09。13同步回链11，并修正团队交付行遗留的“回复普遍认为”，沿用[既有V2EX证据](#社区体验额度与迁移不能代替采用证据)，不另扩调查。GitClear完整PDF仍沿用09的未取得边界。本轮不据局部补核升级整页L3。**[研究：收敛与验证边界]**


## 11 社区脉搏的核实范围

承接正文原页首范围，迁移于2026-10-15 UTC，不表示整页重新核实。2026-10-15（UTC+8）的既有核查包括：第1节文件排除证据链；第2节两串HN原帖及默认双工具／固定强项的撤回；第3节供模计划与接入范围；第6–7节预算、编程体验、迁移与额度原帖，以及由情绪推出的采用结论的撤回。2026-10-15 UTC另核第4节实践者归因，范围见上节。其余历史内容沿用2026-10-08记录，未因此重新核实。**[研究：日期与覆盖范围]**

历史资料来源包括GitHub issue、HN（经Algolia读取原帖及评论）、Lobsters、V2EX、METR原始报告及GitClear公开摘要／报告图示；GitClear完整PDF仍未取得，方法范围见09及其研究记录。旧页首记录当时Reddit和linux.do因机房IP访问受限而未覆盖，这是历史访问记录，本轮未重试，不代表当前全站不可用。**[研究：来源与访问边界]**


### 全页采用边界复核：2026-10-16（UTC+8）

本轮通读11并对照主专题：§1–3、§6–7及§4实践者归因复用上列精确来源和反证，不重复认定为新读原帖；§4重新读取[METR 2025 RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)、[2026-02实验更新](https://metr.org/blog/2026-02-24-uplift-update/)、[2026-05问卷](https://metr.org/blog/2026-05-11-ai-usage-survey/)及[GitClear公开页](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)，支持现有数字、历史范围与自报／因果限制。完整GitClear PDF仍未取得，但当前仅用公开代理信号提示抽检，不据其设阈值或计算维护成本，故该缺口不阻止这条窄建议；扩大定量或因果主张时须重新核方法。**[研究：覆盖与边界]**

§5对照03／04／07／08／09／10／14／18：SDD和并行原来只有争论标签，现回链07／08的具体条件；软件工厂入口同步13 §2.8，区分Dex的团队自报、训练假设与流程倡议，采用结论只在14维护。既有[原文复核](2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)已限制“无法训练”“评审抬不高上限”和“稳定快2–3倍”；初次网页请求未取得内容，随后独立复核已通过GitHub读取固定[`wsff.md@1a9b65e`](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/wsff.md)，确认这些属于作者假设／倡议，且作者自己也按任务缩减流程：小任务直接做或少量反馈，中等合并设计，大变更才用完整步骤，不把作者的任务占比推广给读者。Weng、Larson及HN对照观点保留历史来源范围，未重新认证。**[研究：入口一致性与读取范围]**

原“模型性格／社区写提示词纠正”没有明确作者、产物或效果来源，移出正文，只留作历史待核线索，不生成新的提示词方案。上述复核没有运行模型、客户端或迁移实验，也不代表所有外链和动态事实重新认证；页级成熟度另经独立审阅决定。**[研究：撤回与验证范围]**


## Gemini：接入资格与 Antigravity 迁移

核实：2026-10-16（UTC+8）。对应01入口与Gemini深页；主线二。撤回“个人免费额度→预算敏感或批量任务首试Gemini CLI”，改按消费者、API及已有企业合同区分；Antigravity仅作需核配置与费用的迁移候选。新证据为官方消费者／企业弃用说明、迁移公告及当前迁移／认证文档；只读，无安装、登录、API调用或客户端迁移实验。**[一手；研究：采用范围]**

| 来源与日期 | 已读事实 | 对选择的影响 |
|---|---|---|
| [消费者弃用页](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals)，页面更新2026-10-09 | 6月18日起，individuals、Google AI Pro／Ultra的Code Assist IDE与Gemini CLI停止服务，该消费者路径不能继续Login with Google | 旧个人免费额度不再作为新采用理由；仅针对所列消费者服务路径；公告未限定版本或地区，不外推其他认证与API路径停用 |
| [5月19日迁移公告](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) | 同样明确消费者6月18日截止；另保留付费Gemini／Enterprise Agent Platform API key；当时企业入口不变；Antigravity初期非1:1功能对等 | 消费者停用与API分别判断；不由付费API可用推出免费API key仍有旧额度；5月企业说明不能覆盖后来的弃用规则 |
| [企业弃用页](https://docs.cloud.google.com/gemini/docs/codeassist/sunset)，页面更新2026-10-13 | 10月9日起不再新购Standard／Enterprise；旧合同继续支持；加席和年度续订截止2027-01-31，月度续订截止2027-12-31 | 新团队不能按旧订阅表选购；已有团队按自己的合同安排转换，不一律立即迁移 |
| [Cloud quotas](https://docs.cloud.google.com/gemini/docs/quotas)，页面更新2026-10-13 | 仍列Standard／Enterprise的CLI额度，IDE agent mode与CLI合并计量；一次提示可能产生多次请求 | 额度表不是新订阅资格，不能按请求数计算可完成任务数 |
| [Antigravity迁移](https://antigravity.google/docs/cli/gcli-migration) | 首次启动可选导入扩展／全局配置及迁移会话token到系统keyring；部分兼容；workspace skills改到`.agents/skills/`；MCP独立配置，部分远程URI字段改为`serverUrl` | 不把安装、导入或同名功能当作认证、权限、全部配置与行为已恢复；没有证据证明自动转换覆盖所有路径 |
| [Antigravity安装与认证](https://antigravity.google/docs/cli/install/#using-a-gemini-api-key) | API key路径要求`modelProvider`设为`gemini`并提供`GEMINI_API_KEY`；单独环境变量无效；启动只检查非空，实际模型权限可能首次请求才失败 | 迁移要核实际provider与认证；此处不提供凭据、不运行验证，不承诺原免费权益继承 |

**旧页面冲突保留。** [Gemini CLI quota页](https://geminicli.com/docs/resources/quota-and-pricing/)仍列个人1000/day、免费API key 250/day，页尾为2026-06-18；[terms页](https://geminicli.com/docs/resources/tos-privacy/)仍列消费者Google登录及不同API服务分类，其个人隐私链接实际重定向到上述弃用页。后者与5月公告交叉支持特定消费者路径已停，不能用旧表继续承诺60/min、1000/day或免费API替代。Vertex的Express／付费模式仍需按所用项目资格与计费核对，不从消费者变更推导其免费可用或全部关闭。此为公开文档之间的范围与时序核对，不是账号实测。**[一手；研究：冲突取舍]**

**历史读取范围与未覆盖。** 原Gemini深页“未能直接核实Antigravity文档”属于2026-10-08的记录；本轮已直接读取迁移与认证页，撤下该当前化说法及未支撑首步选择的旧二手产品描述。未重核所有Gemini功能矩阵、当前稳定版、模型输入／上下文、Antigravity额度和价格；恢复机制沿用本页既有固定源码，EDK／Auto Memory沿用audit S3的原范围。01仍为L2，不把局部接入补核升级为整页认证。采用前若合同、认证或必要操作变化，回到对应官方契约复核；真实迁移是否成功仍待授权实验。**[研究：边界]**

## OpenCode：规划权限与文件恢复分开选择

核实：2026-10-15；主线二，改变01矩阵对OpenCode“无回滚”的排除及深页“Plan绝对只读”的读法。固定来源为版本同步提交 [`f40dc433cb52eeb3ff5ec7a755f0ba0162216a51`](https://github.com/anomalyco/opencode/commit/f40dc433cb52eeb3ff5ec7a755f0ba0162216a51)（v2.0.30）；本轮只读官方文档／源码，未安装或运行客户端。开源Agent深页本轮补核限OpenCode规划与撤回，Pi／Aider沿用2026-10-15专项核查，其余项目沿用2026-10-08范围，未全量重核。**[一手；研究：采用判断]**

- **撤回可以作为采用条件，但先核Git与快照。** 同提交的[TUI文档](https://github.com/anomalyco/opencode/blob/f40dc433cb52eeb3ff5ec7a755f0ba0162216a51/packages/web/src/content/docs/tui.mdx)列出`/undo`和`/redo`及Git项目要求；[snapshot.ts](https://github.com/anomalyco/opencode/blob/f40dc433cb52eeb3ff5ec7a755f0ba0162216a51/packages/core/src/snapshot.ts)的`capture`在快照停用、不支持或捕获失败时可返回undefined，恢复按文件映射取快照内容，映射外文件保持不动。[revert.ts](https://github.com/anomalyco/opencode/blob/f40dc433cb52eeb3ff5ec7a755f0ba0162216a51/packages/core/src/session/revert.ts)从目标消息后的assistant消息收集`snapshot.files`和起点，不能据“撤回”推定外部服务副作用也被撤销。按文件恢复不做后续人工修改的语义合并；保留混改再检查diff是采用建议，不是已复现的数据丢失案例。**[一手：固定实现；研究：边界]**
- **Plan权限以实际版本核查，不能抄文档默认值。** 同提交[agents.mdx](https://github.com/anomalyco/opencode/blob/f40dc433cb52eeb3ff5ec7a755f0ba0162216a51/packages/web/src/content/docs/agents.mdx)写编辑和bash默认`ask`，但[plugin/plan.ts](https://github.com/anomalyco/opencode/blob/f40dc433cb52eeb3ff5ec7a755f0ba0162216a51/packages/core/src/plugin/plan.ts)注册`edit`全局deny、专用计划目录allow；提示要求只在用户明确请求时写计划，其他文件不得修改。该局部实现与模式标签均不证明全部shell、子Agent或扩展路径的写隔离；正文因此只推荐用其做规划，并要求严格只读需求核查有效权限，不宣称已验证绕过或全面隔离。**[一手：文档与实现差异；研究：适用范围]**

## Cline：审批按宿主与有效设置判断

核实：2026-10-16（UTC+8）。主线二；只修正01开源Agent页“每步人工审批”的选择依据，保留🧪试用及06／10既有最小权限、环境隔离建议。固定main为[`3834735da26b70503aa5c0aa377949612a2816ad`](https://github.com/cline/cline/commit/3834735da26b70503aa5c0aa377949612a2816ad)，其中[`apps/vscode/package.json`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/vscode/package.json)标4.1.24、[`apps/cli/package.json`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/cli/package.json)标3.0.71；这些是源码包版本，不证明已发布或用户已安装。未安装或运行客户端、模型、真实审批及隔离实验；不改变Kilo等未复核项目的评级。**[一手；研究：范围]**

- **IDE可配置，不是每步必审。** [官方Auto Approve页](https://docs.cline.bot/features/auto-approve)确认按工具调用类别决定是否询问，也介绍YOLO。固定VS Code路径的[`AutoApprovalSettings.ts`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/vscode/src/shared/AutoApprovalSettings.ts)中内置值为read/edit/web/MCP开启、commands关闭；[`state-keys.ts`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/vscode/src/shared/storage/state-keys.ts#L263-L267)将其登记为默认设置。[`SdkController`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/vscode/src/sdk/SdkController.ts#L415-L424)逐次读取当前全局设置，交给[`sdk-tool-policies`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/vscode/src/sdk/sdk-tool-policies.ts)按类别判断；[`sdk-interaction-coordinator`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/vscode/src/sdk/sdk-interaction-coordinator.ts#L118-L132)命中后直接批准，否则进入人工审批。该路径不以legacy `enabled`字段作额外总开关；但已有设置／宿主适配仍须另核，不能据内置常量断言所有已安装IDE实例都自动编辑。**[一手：固定实现]**
- **旧菜单说明不能当当前命令边界。** 官方IDE页仍讲工作区内外子开关，以及模型的`requires_approval`标记；固定源码将外部文件与`executeAllCommands`字段标为legacy，[当前菜单](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/vscode/webview-ui/src/components/chat/auto-approve-menu/constants.ts)只列五个类别，上述SDK判断按命令类别开关而非该模型标记批准。这里只记录文档与该路径差异，不断言所有版本／宿主的实现相同，也不把命令类别或字符串规则当OS沙箱。**[一手；研究：边界]**
- **普通CLI、ACP和交互开关分开。** [官方CLI概览](https://docs.cline.bot/usage/cli-overview)列`--auto-approve`默认true。[固定main](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/cli/src/main.ts#L881-L895)把有效值传入全局工具策略；[`startup-settings.ts`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/cli/src/utils/startup-settings.ts#L21-L31)优先级是显式参数、已保存`toolAutoApprove`、内置true。普通单次任务的[`run-agent.ts`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/cli/src/runtime/run-agent.ts#L165-L180)传递该策略；ACP则[只认显式true](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/cli/src/main.ts#L802-L819)，不能推广普通CLI默认。交互路径[`tool-policies.ts`](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/cli/src/runtime/tool-policies.ts)关闭自动批准时仍保留部分读／搜索等工具自动批准（可有显式单工具例外）；因此也不写“false保证每步必审”。普通终端审批回调在无TTY时[返回拒绝](https://github.com/cline/cline/blob/3834735da26b70503aa5c0aa377949612a2816ad/apps/cli/src/utils/approval.ts#L69-L77)，桌面IPC另走分支；无头运行不意味着可以弹出人工审批，也不等于自动获得环境隔离。**[一手：契约与固定实现；研究：采用边界]**

## Goose：订阅接入先核适配器、身份与资格

核实：2026-10-16（UTC+8）。主线二；只修正01开源Agent表的订阅接入判断，不改变多服务商候选评级。新证据为Goose当前文档、固定main [`0df818175bc854229746c81f01ea154b1c6c5e9e`](https://github.com/aaif-goose/goose/commit/0df818175bc854229746c81f01ea154b1c6c5e9e)及服务商认证说明；固定main不代表已发行／已安装版本。**[一手；研究：范围]**

- **先核外部适配器与身份。** [ACP专页](https://goose-docs.ai/docs/guides/acp-providers/)要求Node.js/npm、对应适配器可被找到、底层CLI已认证可用且未超额度；Claude用`@agentclientprotocol/claude-agent-acp`，Codex用`@agentclientprotocol/codex-acp`，后者可复用兼容的Codex登录。固定[`claude_acp.rs`](https://github.com/aaif-goose/goose/blob/0df818175bc854229746c81f01ea154b1c6c5e9e/crates/goose/src/providers/claude_acp.rs#L22-L104)与[`codex_acp.rs`](https://github.com/aaif-goose/goose/blob/0df818175bc854229746c81f01ea154b1c6c5e9e/crates/goose/src/providers/codex_acp.rs#L21-L95)解析外部二进制并连接ACP，不由协议本身授予模型访问。Goose将Codex的ChatGPT Plus/Pro与API credits列为不同路径；[OpenAI认证文档](https://developers.openai.com/codex/auth)也区分订阅登录与按量API认证，不能把API key调用当作订阅额度。**[一手；研究：采用前提]**
- **Claude订阅不能仅靠客户端自述保证。** Goose专页宣传可复用Claude Code订阅，但其链接的[固定适配器源码](https://github.com/agentclientprotocol/claude-agent-acp/blob/872e93f11fde8abc528822d29cebcc542b05e9e8/src/acp-agent.ts#L11013)选择Claude可执行文件，经SDK的[`query()`](https://github.com/agentclientprotocol/claude-agent-acp/blob/872e93f11fde8abc528822d29cebcc542b05e9e8/src/acp-agent.ts#L11148-L11156)启动CLI，属于SDK封装CLI路径；[Anthropic当前SDK说明](https://code.claude.com/docs/en/agent-sdk/overview#get-started)规定第三方开发者未经事先批准，不得在其产品中提供claude.ai登录／额度。本轮未取得该具体集成获批证据，因此只能确认Goose提供接入机制，不把客户端自述升级为无条件订阅保证；该条款针对第三方开发者，不等于每位本地用户都须另行申请批准，也不据此断言Goose未获批或所有ACP集成被禁止。**[一手：双方文档；研究：证据缺口]**
- **Gemini不再按旧订阅入口推荐。** [当前CLI provider说明](https://goose-docs.ai/docs/guides/cli-providers/)将`gemini-cli`与`gemini_oauth`列为弃用，推荐Google provider的Gemini API key或Vertex AI；固定[`gemini_oauth.rs`](https://github.com/aaif-goose/goose/blob/0df818175bc854229746c81f01ea154b1c6c5e9e/crates/goose/src/providers/gemini_oauth.rs#L931-L947)也在元数据中标明替代路径。[注册代码](https://github.com/aaif-goose/goose/blob/0df818175bc854229746c81f01ea154b1c6c5e9e/crates/goose/src/providers/init.rs#L112-L120)仍保留旧provider，不能把弃用写成代码已删除。此前README笼统宣传三家订阅经ACP接入，不覆盖这些当前限制；消费者6月18日停止旧Login with Google路径的事实及API／企业区别，沿用[本页Gemini核对](#gemini接入资格与-antigravity-迁移)，不扩成Gemini API停用或所有自定义ACP方案不可用。**[一手；研究：撤回范围]**

读者应先选择明确支持自己的认证／计费路径，再决定是否试用Goose；仅有订阅或看到“支持ACP”不足以完成选型。未访问账户、检查凭据、安装适配器、运行客户端／模型，也没有迁移成功或成本收益实测。**[研究：验证边界]**

## Qwen Code：内置不等于默认启用

核实：2026-10-16（UTC+8），主线二。保留内置能力与试用评级，只区分采用前的启用／接入步骤，不把固定 main 当已发行版本或客户端实测。**[一手；研究：范围]**

固定 `c24e99e9cb74ce616e0b3ff0e0e5b582dbf4b617` 的 [settingsSchema](https://github.com/QwenLM/qwen-code/blob/c24e99e9cb74ce616e0b3ff0e0e5b582dbf4b617/packages/cli/src/config/settingsSchema.ts#L2442-L2480)列 auto memory 默认开启、Auto Skill 默认关闭及保存确认；[CLI 配置](https://github.com/QwenLM/qwen-code/blob/c24e99e9cb74ce616e0b3ff0e0e5b582dbf4b617/packages/cli/src/config/config.ts#L2701)与 [Auto Skill 传递](https://github.com/QwenLM/qwen-code/blob/c24e99e9cb74ce616e0b3ff0e0e5b582dbf4b617/packages/cli/src/config/config.ts#L2832-L2839)分别保留 Agent Team／Auto Skill 默认关闭。[core Team 开关](https://github.com/QwenLM/qwen-code/blob/c24e99e9cb74ce616e0b3ff0e0e5b582dbf4b617/packages/core/src/config/config.ts#L10170-L10175)另接受环境变量启用，[Auto Skill getter](https://github.com/QwenLM/qwen-code/blob/c24e99e9cb74ce616e0b3ff0e0e5b582dbf4b617/packages/core/src/config/config.ts#L11047-L11054)还区分受限运行模式。[官方协作说明](https://qwenlm.github.io/qwen-code-docs/en/users/features/multi-agent-coordination/)将 Agent Team 标为实验性；未启用时的普通子 Agent 调查不等于团队协作。**[一手：固定实现与文档]**

[官方 Channels](https://qwenlm.github.io/qwen-code-docs/en/users/features/channels/overview/)及[固定文档](https://github.com/QwenLM/qwen-code/blob/c24e99e9cb74ce616e0b3ff0e0e5b582dbf4b617/docs/users/features/channels/overview.md)说明适配器内置，仍需机器人／账号认证、渠道配置与启动。因此期待自动积累技能、协作团队或聊天接入的读者，应先核相应开关与外部身份，不把安装完成当接入完成。未安装、登录、验证权限或运行客户端；配置存在不证明团队收益，02 的套餐资格与 endpoint 边界仍适用。**[一手；研究：采用边界]**


## 国内工具：订阅入口与持续成本

核实：2026-10-16（UTC+8）；主线二。只纠正01已有国内工具行的购买依据，不扩工具名单；02的Kimi资格已核正确，本轮仅同步入口。公开网页正文读取不等于账号资格、结算页或客户端实测。**[一手；研究：范围]**

- **TRAE CN免费不等于无额度约束。** 直接读取[套餐与计费](https://docs.trae.cn/ide_plans-and-billing)：内置模型调用消耗积分，免费用户通过登录、签到和活动获取有限积分；自定义模型不消耗TRAE积分，不等于模型服务商免费。Lite单月¥49；连续包月¥45，付费新用户首期¥39、第二期恢复¥45；自动续费按31天周期。因此撤回“国内核心免费”这一笼统成本依据，比较持续使用时区分单月与连续订阅。**[一手；研究：选择]**
- **TRAE国际版保留入口差异。** 直接读取[无参数定价页](https://www.trae.ai/pricing)，本次显示Free限Auto mode及有限用量、Pro $20/月自动续费；[计费文档](https://docs.trae.ai/ide/new-plans-and-billing)未返回可读正文。搜索索引另有带产品／跳转参数的官方定价页显示Lite $3/月；未取得可比的当前正文与适用范围，不保存含用户标识的索引URL。该差异不能证明$3全部是首月优惠、已经失效，也不能证明$20是所有地区／入口的最低价。正文撤回无条件“$3起”，引导按实际入口核套餐、免费范围和续费；索引只作待核线索。**[一手：无参数页；二手：索引；研究：未决]**
- **Qoder现价可保留，资格须写清。** 直接读取[国际版价格](https://docs.qoder.com/zh/account/pricing)与[CN全家桶账号和订阅](https://docs.qoder.cn/product-overview/account-and-subscription)：Pro分别为$20/月与¥59/月，各含2,000 Credits/月。国际版按月自动续费；CN个人订阅需阿里云主账号，RAM子账号不能用个人付费功能，CN全家桶共享额度；CN新购所选月付／年付决定自动续费周期。上述月价未标首期促销，不能把跨区同名套餐或Credits数字等同为可互通权益或相同任务成本。干净的中外定价首页未返回完整价表，最终采用直接读到的官方文档正文，不将搜索索引的¥59当正文验证。**[一手；研究：范围]**
- **灵码按订单产品线识别。** 直接读取[CN计费说明](https://docs.qoder.cn/product-overview/billing-description)，分CN全家桶、CN原灵码、通义灵码存量页签；这支持修正旧名字的购买入口，不把所有存量订单视为已自动迁移。**[一手；研究：入口]**
- **Kimi沿用单一主专题。** 直接复核[中国区套餐表](https://www.kimi.com/en/help/membership/membership-overview)：新Go ¥49不含Code，Plus ¥99起含Code，旧Andante等保留原资格；与02 §4一致，仅删除01的¥49／99笼统Code订阅说法。CodeBuddy模型和模式在本次订阅核查中未覆盖，后续范围见下节。**[一手；研究：同步与边界]**

未登录、购买、检查个人账户、安装或运行客户端；未验证所有地区可购性、税费、结算优惠、当前模型质量或完成任务成本。仅当上述资格和必要功能满足时条件试用，不据低标价推荐迁移。**[研究：验证边界]**


## CodeBuddy：入口与计划权限

核实：2026-10-16（UTC+8）；主线二。把01的统一三模式／模型名单收窄到实际客户端与地区，07的只读调查示例限定为Claude Code；只读公开文档，未登录、安装、运行客户端或模型。**[研究：范围]**

- **先区分地区与形态。** [官方产品概述](https://www.codebuddy.cn/docs/plugin/产品简介/产品概述)区分插件、IDE和CodeBuddy Code CLI，IDE另列国内／国际入口；[国际站CLI快速开始](https://www.codebuddy.ai/docs/cli/quickstart)区分国内站、国际站、企业域及iOA认证，国内／国际站对应不同模型供给。此处只确认契约分类，不保证所有账号、地区或客户端拥有同一模型清单。国际IDE概览本轮正文抓取超时，索引摘要不作为已核正文。**[一手；研究：接入范围与未决]**
- **CN IDE按实际审阅需要选模式。** [IDE概览](https://www.codebuddy.cn/docs/ide/User-guide/Overview)写明Ask不直接改代码、Craft生成与修改、Plan先给任务清单并经确认执行；[Plan专页](https://www.codebuddy.cn/docs/ide/Features/Plan-Mode)提供方案编辑、开始执行、执行中暂停／调整及计划保存机制。需要先对齐会影响实现的取舍时才试Plan，目标清楚的局部修改不因此增加必经阶段；计划存在、任务勾选或厂商效率描述不证明验收通过或净收益。**[一手：工作流契约；研究：采用边界]**
- **CN插件不能套用IDE的三入口描述。** [Craft使用](https://www.codebuddy.cn/docs/plugin/操作指南/Craft%20智能体/Craft%20的使用)列VS Code、JetBrains IDEs与微信开发者工具，入口为Ask／Craft；生成计划（Plan模式）、自动运行与自动修改文件是分开的设置。该页称三项默认开启，只作这些插件的文档契约，不外推其他客户端。**[一手]**
- **模型名单只在来源范围内成立。** [CN插件模型配置](https://www.codebuddy.cn/docs/plugin/操作指南/模型配置)列混元、DeepSeek、智谱及Kimi-K2-Thinking／K2.5；Craft使用页仅列混元与DeepSeek，说明不同页面的型号粒度并不一致。专门模型页可支持CN插件有这些模型家族，不能推出所有端的完整当前型号、账号资格或国际版供给；因此撤回正文的跨端名单，采用前核目标入口。IDE自定义模型的[models.json契约](https://www.codebuddy.cn/docs/ide/Features/models)也不代表订阅内置模型权益。**[一手；研究：取舍与限制]**
- **CLI的plan不构成只读隔离。** [权限模式](https://www.codebuddy.cn/docs/cli/permission-modes)明确：plan期间Read／Bash委托前置权限模式，Edit只对当前session计划文件额外放行，其他目标委托前置模式；从default进入时普通Edit／Bash仍询问，从acceptEdits进入时非计划文件Edit仍按该基线自动放行。页面另行描述退出时恢复前置模式，故此处不是把恢复后的行为误读为计划期间行为。权限模式只是求值的一层，deny／allow／ask规则及受保护目标仍须核对，不能写成任何文件都可直接改；也不能据CLI契约断言IDE底层行为相同。**[一手：文档契约，未执行验证]**

**最小选择与撤回。** 保留能完成必要任务的现有入口；只有需要先审方案时才采用相应Plan流程。必要模型、工具或实际权限边界不满足，就撤回该入口选择，而非因同名模式或模型宣传迁移。需要只读或隔离时，核实际权限与环境，沿用[10的环境边界原则](../10-security.md#3-防护原则)；02既有资格／用途／endpoint规则不变。上述证据不证明当前模型质量、迁移成功或节省成本，不新增工具排名。**[研究：采用与验证边界]**

## IDE 页历史页头

2026-10-16（UTC+8）转存 `docs/01-agents/ide-and-others.md` 原页头；保留原日期／范围，相对链接仍以原页面为基准，不表示重新核实。

```text
> 核实时间：CodeBuddy客户端／权限范围、国内工具订阅边界与Kiro规格采用边界于2026-10-16（UTC+8）补核，JetBrains 接入条件于2026-10-15补核，Cursor迁移入口同步11；其余沿用2026-10-08。Cursor 和 GitHub Copilot 部分直接读取了官方 changelog；其余未标注的为 **[二手]**。
```


## Gemini：沙箱启用与有效边界

核实：2026-10-16（UTC+8），主线二，对应01矩阵与Gemini深页。🧪 需要隔离时，先核有效配置、隔离对象与读／写／网络范围；不能仅凭“支持沙箱”、`-s`或自动审批作选择。本轮只读公开文档和固定发行版源码；无安装、客户端／模型运行、实际隔离或安全配置修改。**[研究：范围]**

**发行关系与默认值。** [v0.63.0发布页](https://github.com/google-gemini/gemini-cli/releases/tag/v0.63.0)指向固定提交[`573846625af9e93b3b968e0e0b86bb093a4c9b16`](https://github.com/google-gemini/gemini-cli/commit/573846625af9e93b3b968e0e0b86bb093a4c9b16)，不是用main实现推定已经发布。[设置定义](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/config/settingsSchema.ts#L1557-L1569)将`tools.sandbox`标作完整进程沙箱，默认undefined；同文件[工具级设置](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/config/settingsSchema.ts#L1835-L1843)的`security.toolSandboxing`默认false。[未配置用例](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/config/sandboxConfig.test.ts#L67-L85)明确预期不返回完整进程沙箱配置；[启动路径](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/gemini.tsx#L684-L735)据该配置决定是否进入`start_sandbox`。这是发行源码与上游测试的阅读，未运行这些测试，也不保证其他版本或受管配置的默认行为。**[一手；研究：版本边界]**

**现行文档与发行实现有冲突。** [当前官方沙箱页](https://geminicli.com/docs/cli/sandbox/#configuration)写命令行flag优先于环境变量，再到settings；固定[解析代码](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/config/sandboxConfig.ts#L43-L59)却用非空`GEMINI_SANDBOX`覆盖传入选项，再把`false`／`0`解析为关闭。[同版测试](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/config/sandboxConfig.test.ts#L453-L467)也要求环境变量优先于CLI与settings。具体反例：已有`GEMINI_SANDBOX=false`时，只增加`-s`，按该版本解析仍不启用完整进程沙箱；这不排除另行启用的工具级隔离或外部容器。当前文档的“如何关闭工具沙箱”措辞也不能代替该发行版默认值。采用时检查对应版本与实际有效边界，不照搬文档优先级，也不把此冲突外推成所有当前客户端均如此。**[一手；研究：静态反例，非实测]**

**默认Seatbelt不是项目外读取或网络隔离保证。** 固定[启动实现](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/utils/sandbox.ts#L123-L138)选`permissive-open`；该[profile](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/utils/sandbox-macos-permissive-open.sb)允许广泛文件读取与出站网络，写入允许项还包括临时、缓存及额外目录，另明确拒绝部分敏感文件、配置和容器通道。[官方说明](https://geminicli.com/docs/cli/sandbox/#1-macos-seatbelt-macos-only)同样提示广泛读取及联网。若需求是阻止读取项目外普通私人文件或阻断联网，仅开启这个默认profile不足；也不能反过来说所有文件都可读。审批解决是否准许某次动作，不替代上述OS边界。**[一手；研究：采用反例]**

**后端存在不等于同范围可用。** 固定[配置解析](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/cli/src/config/sandboxConfig.ts)还接纳Podman、runsc、LXC及windows-native；runsc需Linux与Docker并显式选择，LXC需用户已有运行容器，当前官方页将其标为实验性。版本中另有[Linux工具级实现](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/core/src/sandbox/linux/LinuxSandboxManager.ts)与[Windows实现](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/core/src/sandbox/windows/WindowsSandboxManager.ts)。这里不将后端名、解析接纳或类存在写成端到端保证；未完整核每个平台的调用链、工具覆盖与宿主依赖，不据此给所有平台统一启用方案。**[一手；研究：未覆盖范围]**

**LSP本轮不扩写。** 固定发行版[内置工具名](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/core/src/tools/tool-names.ts)与[工具注册](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/packages/core/src/config/config.ts)未核到原生定义跳转、引用查找或语义重命名工具；[IDE集成说明](https://github.com/google-gemini/gemini-cli/blob/573846625af9e93b3b968e0e0b86bb093a4c9b16/docs/ide-integration/index.md#L7-L48)列出近期文件、光标、选择文本与diff，以及另一路ACP集成，不能据此改为CLI原生LSP支持。矩阵“—”继续表示本轮未核到该原生能力，不表示MCP扩展或其他宿主永远不能提供。未出现改变该项选择的新证据。**[一手；研究：负面证据范围]**


## gstack：Windows指纹修复与实际调用入口

核实：2026-10-16（UTC+8）。支持[21验证回执](../21-agent-patterns.md#验证回执能复用什么)的条件采用：撤回“盘符路径仍未修”，保留从实际消费者入口验收的要求；不因此引入整套框架。仅阅读公开源码、原帖与CI记录，未安装或运行gstack、Windows、模型或POSIX模拟。**[研究：范围]**

- **原失败与原用户的局部恢复。** [#3101](https://github.com/garrytan/gstack/issues/3101)的dmfrede报告Git for Windows／Git Bash、1.91.68.0（`20eb6202`），linked worktree中`--git-path index/objects`返回盘符绝对路径，被仅识别`/`的分支重复加上根目录，导致指纹为空及review-start失败。原帖自述本地改两个分支后，start／finish及完整`/ship`成功；这是手动补丁后的Windows使用自报，不是后来上游版本的重试。截至核查issue已closed、0评论，未取得发布后接收者回执。**[社区：原帖及范围]**
- **不是仅关闭issue。** [合并提交e6edff026519da3e06dce1e91d83932c43527a8d](https://github.com/garrytan/gstack/commit/e6edff026519da3e06dce1e91d83932c43527a8d)于10月11日经[#3140](https://github.com/garrytan/gstack/pull/3140)进入main；[wtree L57–63](https://github.com/garrytan/gstack/blob/e6edff026519da3e06dce1e91d83932c43527a8d/bin/gstack-wtree#L57-L63)对index及objects共用[absolute helper](https://github.com/garrytan/gstack/blob/e6edff026519da3e06dce1e91d83932c43527a8d/bin/gstack-path-spelling.sh#L70-L73)，接纳斜杠根路径和盘符后接正／反斜杠，真正相对路径才补根目录。[#3108采纳说明](https://github.com/garrytan/gstack/pull/3108#issuecomment-6111347983)确认测试与Windows筛选条目一并进入。VERSION及CHANGELOG标1.91.89.0；本轮查询`v1.91.89.0`与`1.91.89.0` Git refs及前者release API均404，因此只称标号提交，不补称已核tag或GitHub Release。**[一手：固定源码、合并与版本文件；研究：发布证据边界]**
- **测试分平台，不合并成一份Windows证明。** [固定测试L51–88](https://github.com/garrytan/gstack/blob/e6edff026519da3e06dce1e91d83932c43527a8d/test/gstack-wtree-windows-paths.test.ts#L51-L88)第一例建真实linked worktree／私有对象目录，通过显式`bash`启动并核对`HEAD^{tree}`；第二例仅在非Windows用git shim合成盘符路径，Windows跳过。[PR #3108](https://github.com/garrytan/gstack/pull/3108)作者的失败→通过及mutation均为Linux记录，并明确只撤掉index修复时测试仍绿：HEAD回退能生成相同哈希，故该用例不单独证明index快路径。上游[Windows Free Tests运行38156016750](https://github.com/garrytan/gstack/actions/runs/38156016750)成功，运行元数据关联PR head `f16fbc6e4dd6247eca6069ff94103049dc643fa4`，实际checkout日志为合成合并提交`42ca1cb`；六分片job日志标Windows Server 2025；固定curation强制纳入此测试，但可读job日志未给出该例逐条结果，不能写成本轮逐例核验或完整`/ship`复测。**[一手：测试、CI元数据与日志；社区：作者本地测试报告]**
- **后续失败发生在脚本启动前。** [10月15日#3197](https://github.com/garrytan/gstack/issues/3197)的exGeni报告Windows 11／Bun1.4.2、1.91.101.0（`47d639abffa882b8cbb641d7d1dedf08ecada9ec`）：Git Bash手动运行脚本返回tree id，同一脚本被Bun直接spawn则找不到可执行文件；显式bash的独立探针成功。pregate与restamp是实际失败，gate-diff记录`+nowtree`；evidence路径仅源码阅读、未运行。[固定regen调用](https://github.com/garrytan/gstack/blob/47d639abffa882b8cbb641d7d1dedf08ecada9ec/lib/regen.ts#L131-L136)及[evidence调用](https://github.com/garrytan/gstack/blob/47d639abffa882b8cbb641d7d1dedf08ecada9ec/bin/gstack-evidence#L198-L206)确实直接spawn脚本并在失败时丢失指纹。不能把evidence也写成用户已复现，更不能把此故障当盘符修复回退；显式bash的路径回归没有覆盖Bun直接调用。**[社区：单一环境及探针；一手：调用源码；研究：机制区分]**
- **待修与采用边界。** #3197无评论；其[#3204修复层](https://github.com/garrytan/gstack/pull/3204)及[#3209整合层](https://github.com/garrytan/gstack/pull/3209)本次均open、未合并，不记作已发布恢复。下一次值得改结论的证据是实际消费者入口上的修复与复验，尤其回执确有指纹且被后续检查使用；更多脚本存在、模拟绿灯或版本标题不足以升级平台保证。**[一手：PR状态；研究：复访条件]**


## 21 页历史页头

2026-10-16（UTC+8）转存 `docs/21-agent-patterns.md` 原页头；保留原日期／范围，相对链接仍以原页面为基准，不表示重新核实。

```text
> 核实时间：2026-10-11（UTC+8；原有条目检索截至 2026-10-10 UTC；验证回执小节于 2026-10-11 UTC 补核，Windows 维护链于 2026-10-16 UTC+8 复核）。
> 评级针对机制的采用范围，不是项目排名。本轮没有安装这些框架，没有跑生产力对照；星数、市场收录和厂商效果宣称都不等于已证明适合本仓库。

```


## Gemini 页历史页头

2026-10-16（UTC+8）转存 `docs/01-agents/gemini-cli.md` 原页头；保留原日期／范围，相对链接仍以原页面为基准，不表示重新核实。

```text
> 核实时间：接入、迁移与沙箱边界于 2026-10-16（UTC+8）补核；恢复范围为 2026-10-15，其余为 2026-10-08。依据 [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) 仓库的 README、`docs/` 与 `docs/changelogs/`（v0.38–v0.63）**[一手]**。
> 评级：🧪 **有条件试用**（已有可用 API／企业合同路径）；个人新接入另评估 Antigravity CLI

```


## Copilot CLI：接入与治理范围

核实：2026-10-16（UTC+8）；主线二兼四。改变01深页“需要订阅”的笼统接入门槛，以及跨CLI／IDE推荐“强企业治理”的读法。仅阅读官方当前契约与固定文档，未安装、运行CLI、登录账户或配置组织策略；不以文档仓库证明发行二进制实现或所有版本已上线。**[研究：范围]**

### 接入资格与任务能力分开

- **Free明确包含CLI。** [官方CLI产品页](https://github.com/features/copilot/cli/)的访问FAQ明确列Free；[套餐页](https://docs.github.com/en/copilot/get-started/plans)概览也将CLI列为全部套餐共有功能。Free仍有能力和模型选择限制，不由“可接入”推成无限使用。固定[`github/copilot-cli@c01c66377d25426dda70c21750e1956e4dd25657/README.md`](https://github.com/github/copilot-cli/blob/c01c66377d25426dda70c21750e1956e4dd25657/README.md)仍写“An active Copilot subscription”；该提交日期为2026-10-14、对应changelog 1.0.98，只固定README原说法，不用它否定当前明确的Free资格，也不把subscription自行解释为仅付费。**[一手：当前资格与固定README]**
- **本地BYOK免登录不等于GitHub任务完整。** [认证页](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/authenticate-copilot-cli#unauthenticated-use)说明可直接连接provider而无需GitHub账号／token；此时`/delegate`、GitHub MCP及Code Search不可用。[应用卡](https://docs.github.com/en/copilot/responsible-use/agents)同时确认此范围。选择用于Issue／PR流程前须核实际所需认证和服务资格，不凭BYOK可启动推定云端委派可用。`COPILOT_OFFLINE=true`关闭GitHub联络及遥测，但只有provider也在本地／隔离环境才是隔离运行；普通免登录BYOK仍可发遥测，不能由免登录推定不外发。**[一手；研究：任务边界]**
- **组织限制仍适用。** [BYOK说明](https://docs.github.com/en/copilot/concepts/models/bring-your-own-key)区分本地配置与服务器侧Enterprise BYOK，后者仍需Copilot许可和联网。[CLI配置参考](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference#mdm-managed-settings)的`forceLoginOrgs`可将设备登录锁到指定组织，并拒绝BYOK/API-key认证；应走获准入口，不把本地BYOK推荐为组织限制的替代路径。该配置页已读取固定[文档源码](https://github.com/github/docs/blob/cb051611377a0d2904411e6157154e9b4953d870/content/copilot/reference/copilot-cli-reference/cli-config-dir-reference.md)。**[一手；研究：准入前提]**

### MCP治理不能只看品牌或单页概览

本轮固定官方文档仓库`github/docs@cb051611377a0d2904411e6157154e9b4953d870`（2026-10-15T23:30:02Z）。这是文档快照，不是CLI源码或运行结果；同一快照内部存在以下冲突：

1. [CLI概览](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-cli#known-mcp-server-policy-limitations)称CLI不支持组织级“MCP servers in Copilot”和“MCP Registry URL”；[固定原文](https://github.com/github/docs/blob/cb051611377a0d2904411e6157154e9b4953d870/content/copilot/concepts/copilot-surfaces/copilot-cli.md)也保留此说法。
2. [策略支持表](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies)的[固定Markdown](https://github.com/github/docs/blob/cb051611377a0d2904411e6157154e9b4953d870/content/copilot/reference/supported-surfaces-for-policies.md)却将CLI的“MCP servers in Copilot”和“Restrict MCP access to registry servers”标Supported。网页文本提取会漏掉勾叉，本轮读取源码确认，不从空单元格猜测支持状态。
3. [CLI命令参考的Enterprise MCP allowlist](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#enterprise-mcp-allowlist)及[固定文档](https://github.com/github/docs/blob/cb051611377a0d2904411e6157154e9b4953d870/content/copilot/reference/copilot-cli-reference/cli-command-reference.md)明确描述：检测企业registry策略或实验开关后，对非默认服务器计算命令／参数／URL指纹，向企业端点评估，错误时阻止连接；内建默认服务器豁免。不能把这段描述当所有已安装版本的实测保证，也不能用概览作“CLI没有此能力”的定论。**[一手：同版本文档冲突；研究：未决范围]**

**可采用路径仍有条件。** [MCP管理页](https://docs.github.com/en/copilot/concepts/enterprise/mcp-management)推荐托管设置而非仅registry名称匹配；[托管设置参考](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#allowedmcpservers)及[固定支持表](https://github.com/github/docs/blob/cb051611377a0d2904411e6157154e9b4953d870/content/copilot/reference/enterprise-administrators/enterprise-managed-settings.md)列CLI和VS Code均支持`allowedMcpServers`／`deniedMcpServers`，但空allowlist不禁止内建默认服务器，第一方内建服务器也豁免deny；因此这两个键不能承诺“禁止所有MCP”。[VS Code官方策略页](https://code.visualstudio.com/docs/enterprise/policies)另有`ChatMCP`、allow/deny及registry配置，它们属于VS Code入口，不能直接移植为CLI保证。**[一手；研究：采用边界]**

**当前建议与重开条件。** 个人先按任务选择Free／已具资格的GitHub认证／获准的本地BYOK，不为CLI接入预设付费，也不忽略免登录损失的GitHub能力。团队先确认目标客户端版本、设备与账号策略、必需MCP服务器及内建例外；严格准入要求无法证实时保留既有合规入口。升级客户端、改变认证／组织／任务所需GitHub功能或官方解决上述冲突时重核，准备企业部署前提前复核。不更新其他功能快照，不据此把01页升为L3。**[研究：选择与撤回]**

**2026-10-17 选型入口核心复核。** 以已发布`f6be22ca`的01全文为基线，独立核对环境、权限、恢复、语义工具与多服务商的选择和相关深页，首选／换路／撤回条件已闭合。补读[Google消费者弃用](https://developers.google.com/gemini-code-assist/docs/deprecations/code-assist-individuals)、[JetBrains ACP](https://www.jetbrains.com/help/ai-assistant/acp.html)、[OpenCode工具](https://opencode.ai/docs/tools/)及[服务商配置](https://opencode.ai/docs/config/#enabled-providers)、[Claude Projects](https://code.claude.com/docs/en/claude-projects)与[Remote Control](https://code.claude.com/docs/en/remote-control)，与入口判断一致。支持选型入口L3，不连带升级深页，也不认证全部客户端能力、目标部署隔离、恢复实测或跨入口效果；历史来源保留原日期和范围。[一手：本轮官方阅读；研究：范围内成熟度]

## 观察者要比实施子任务活得久

核实：2026-10-21（UTC+8）；P34，主线二兼四，对应20§5。改变的是派发内容：CI／远程任务需跨过实施子任务寿命时，默认返回任务身份，由接续交付者使用现有查询入口；不要求新框架、服务或扩大授权。[研究]

- **真实采用与固定发布。** [Hermes #105125](https://github.com/NousResearch/hermes-agent/pull/105125)作者在9月7日PR中报告父任务等待数小时，而child-owned watcher已被退出清理、完成通知被父端过滤。补丁增加显式handoff与遗留／未读结果说明；公开文档仍优先建议child返回PR与SHA、parent自己观察。PR于9月7日合并为`869228cab4a8276d3b4c78da9d9939670c47bd0f`。GitHub比较确认它是同日发布[v0.21.1／`v2026.9.7`](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.7)（固定`2237be355906fbe6065ce1815711eee52b2d646e`）的祖先：ahead 47、behind 0、merge base即该提交；不是由关闭状态猜发布。[社区：故障报告；一手：合并与发布关系]
- **移交实际做什么。** [发行固定源码](https://github.com/NousResearch/hermes-agent/blob/2237be355906fbe6065ce1815711eee52b2d646e/tools/process_registry.py#L1878-L1892)（L1878–1892、2063–2101）只接受活着且属于调用child的进程，在锁内更新owner、task、session key与purpose，每child最多三次；拒绝已退出、外来或非child请求。正文默认来自这种寿命边界，不从“共享终端”推导继承，也不把这个Hermes实现移植为Codex保证。[一手：源码阅读]
- **验证范围与成本。** #105125报告真实父／子`gpt-5.6-terra`的12场景通过，固定head为`9061c176b8936c3b53bf32c4c6c6ae322174eb0a`，[公开脚本](https://github.com/NousResearch/hermes-agent/blob/9061c176b8936c3b53bf32c4c6c6ae322174eb0a/evals/subagent_process_handoff/stress_handoff_live.py)。它读取运行时归属、遗留与完成事件，不只评分模型文字；含wait后正常返回、移交后父端poll／kill及拒绝越界等反分支。对象是sleep／echo，不是12次真实CI交付；模型报告、假Agent加真实进程测试与源码阅读分别计证。本仓未运行。脚本每场景父模型默认最多12次迭代及420秒观察循环，后者在初始模型调用返回后才起算，不是整项硬预算；没有完整费用／人工工时分母，不能称节省多少。[社区：作者复测；一手：固定测试；研究：局限]
- **保留失败分支，不默认升级移交承诺。** [#108479](https://github.com/NousResearch/hermes-agent/issues/108479)在9月11日固定main `8226c2f6a283c48fb97c1750a0ec2907739146d0`报告Windows／Python3.13／Git Bash复现：notify-off无完成事件、gateway watcher仍指child、checkpoint保留旧owner；原notify-on CLI用例仍通过。发行实现也未在transfer中更新notify或写checkpoint。[#108483](https://github.com/NousResearch/hermes-agent/pull/108483)拟补三者并明确finite session需主动查询；本轮API仍open、未合并。作者报告六项handoff测试通过，相关大组仍有六项基线失败，不能称全绿或已发布修复。[社区：独立报告与测试自报；一手：状态／补丁]

**当前选择与撤回。** 观察任务仍在原授权范围内时，优先让最终消费结果的主任务持有它；原生前台返回已经够用就不加后台观察。确需接管现有进程，先核实际入口的移交和查询能力；结果未知时查原任务，不重派外部作业补通知。须跨主任务重启继续而现有入口无保证时，记录阻塞与恢复入口，不靠模型承诺常驻。下一条值得升级的证据是notify-off／gateway／恢复后父端实际消费，而非更多同一CLI绿灯。[经验：采用与撤回]
