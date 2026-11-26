# 文档说明

> 核实：页面成熟度 2026-10-15（UTC+8），双轴试评 2026-10-21，维护流程 2026-10-14，来源审查 2026-10-10；各节依据见节末。

**先按你的处境在「阅读顺序」里选一行，沿该行的路径读；要判断某个结论能不能直接照做，再看页面成熟度级别和证据等级。** 本页是文档入口与标准说明，不另立开发流程。

## 阅读顺序

**不确定从哪开始时，从下表选一行。** 标粗的是该路径的关键页，数字是主干专题编号。

| 你的情况 | 建议路径 |
|---|---|
| 答案不在代码库里，需要找现成方案或设计参照 | [25 AI 探索任务](25-ai-exploration.md) → [12 来源与待验证](12-resources.md)；先明确决定和硬约束，再按问题与团队来源名册检索 |
| 已有失败，想知道先补什么 | [15 调试](15-task-playbooks.md#2-调试) → [05 最小能力补充](05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么) → [22 保留或撤回](22-agent-evaluation.md#7-何时推广何时停止) |
| 功能正常，但有明确的质量目标 | [15 已有产品改进](15-task-playbooks.md#102-已有产品按问题选择改进) → [05 领域依据](05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么) → [22 质量比较](22-agent-evaluation.md#5-如何计分而不自欺)；不必先制造失败 |
| 想看真实社区做法与失败案例 | [24 社区工作流](24-community-workflows.md) → [15 按任务类型的打法](15-task-playbooks.md) |
| 想评估配置、跑长任务或验收前端 | [22 评估](22-agent-evaluation.md) → [20 可靠性](20-codex-long-horizon.md) → [23 浏览器验证](23-browser-verification.md) |
| 判断年初经验是否仍适用 | [00 五维快照](00-state-of-ai-coding.md#1-当前最高水平年初与-10-月到底变了什么) → [14 自主范围](14-synthesis.md#0-30-秒结论按任务选入口交付到可继续修改) |
| 刚开始用 AI coding | 00 → 01 → 07 → **15** → 03 |
| 已在用，想用得更好 | **15** → 03 → **19** → 07 → 06 → 05 → 09 |
| 用 Codex 改善当前任务 | **[Codex 任务入口](01-agents/codex.md#6-使用建议从实际问题选择方法)** → [15 任务打法](15-task-playbooks.md)；出现跨会话恢复问题再看 [20](20-codex-long-horizon.md)，需要组件再选 [模板](../templates/codex/README.md) |
| 想把 Agent 嵌进自己的产品或流水线 | **16** → 04 → 10 → 06 |
| 要给团队落地 | 00 → **18** → 01 → 10 → 06 → 05 → 09 → 19 → 11 |
| Agent 用得不顺、总跑偏 | **17** → 15 → 03 → 07 |
| 关注前沿与争议 | **13** → 00 → 11 → 08 → 04 |
| 想理解“为什么”、做判断和规划 | **14** → 07 → 09 → 10 → 13 |
| 游戏开发 | 07 → **14** → [domains/game-dev](../domains/game-dev/README.md) |

**依据**：[经验：阅读路径] 按读者处境编排；入口一致性核对 2026-10-15；代际复核 2026-10-21 覆盖 00、07、08、14、20 及 P52 的 [02](02-models-and-cost.md)、[03](03-context-engineering.md)、[05](05-skills-and-plugins.md)、[09](09-review-and-quality.md)、[15](15-task-playbooks.md)、[22](22-agent-evaluation.md)。

## 核心建议一致性清单

**查一条建议的完整依据（含条件和反证），只去它的「唯一主专题」；其他入口只做摘要和链接。** 主专题的建议改变时，同一提交核对本行相关入口，入口之间才不会各说一套，读者也不用在多页之间拼条件。

| 核心建议（短摘要） | 唯一主专题 | 相关入口 |
|---|---|---|
| 1. 完成由可观察的验收决定；计划深度与会话切换按未知和上下文负担选择 | [07 工作流](07-workflows.md) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[Claude §4](01-agents/claude-code.md#4-按任务选择的用法要点)、[14](14-synthesis.md)、[15](15-task-playbooks.md) |
| 2. 先比较现成方案、局部补充与完整替代，用真人任务判断价值，分清没机会、没理解、运行失败与不值得继续 | [15 任务打法 §10](15-task-playbooks.md#10-原型和一次性脚本) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[Codex §6](01-agents/codex.md#6-使用建议从实际问题选择方法)、[24](24-community-workflows.md)、[游戏路线图](../domains/game-dev/06-indie-roadmap.md) |
| 3. 按任务保留必要上下文，核对加载、版本和来源；不靠固定长度判断价值 | [03 上下文工程](03-context-engineering.md) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[Codex](01-agents/codex.md)、[Claude](01-agents/claude-code.md)、[14](14-synthesis.md)、[18](18-team-adoption.md) |
| 4. 原生起步；已有能力缺口或有依据的质量目标，都可选择最小有效补充，不默认加 Skill | [05 Skills §2.5](05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[Codex §6](01-agents/codex.md#6-使用建议从实际问题选择方法)、[Claude §7](01-agents/claude-code.md#7-推荐起步先原生扩展按需选择)、[14 §8](14-synthesis.md#8-成熟度路线)、[22](22-agent-evaluation.md)、[24](24-community-workflows.md#本仓库判断强-agent-的默认基线应更轻)、[13](13-frontier-radar.md) |
| 5. 必要行为不退步；目标质量、费用、等待、主动工时及首试／重试分别比较，无目标收益或代价不可接受就撤回 | [22 Agent 评估](22-agent-evaluation.md) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[02](02-models-and-cost.md)、[05](05-skills-and-plugins.md)、[09](09-review-and-quality.md)、[19](19-experiments.md)、[24](24-community-workflows.md) |
| 6. 原生按需委派；明确覆盖／关键路径收益才显式拆分，把整合和人的审查计入并行成本 | [08 多 Agent](08-multi-agent.md) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[07](07-workflows.md)、[14](14-synthesis.md)、[20](20-codex-long-horizon.md)、[24](24-community-workflows.md) |
| 7. 额外评审须补明确风险或遗漏，用新增有效发现与核查负担决定保留；换模型不自动获得独立证据 | [09 评审与质量](09-review-and-quality.md#按风险选择评审层不默认逐层叠加) | [00](00-state-of-ai-coding.md)、[Agent 选型](01-agents/README.md)、[Claude §4](01-agents/claude-code.md#4-按任务选择的用法要点)、[05](05-skills-and-plugins.md)、[08](08-multi-agent.md)、[14](14-synthesis.md)、[21](21-agent-patterns.md) |
| 8. 恢复先核最新目标、证据版本和外部结果；未知副作用先对账，不盲目重试 | [20 长程执行](20-codex-long-horizon.md) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[Codex](01-agents/codex.md)、[Claude](01-agents/claude-code.md)、[03](03-context-engineering.md)、[17](17-troubleshooting.md)、[21](21-agent-patterns.md) |
| 9. 权限与副作用由实际执行边界落实；Hook、审批模型和预算配置只在各自覆盖范围生效 | [10 安全](10-security.md) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[06](06-hooks-and-guardrails.md)、[14](14-synthesis.md)、[16](16-building-agents.md)、[18](18-team-adoption.md) |
| 10. 先选动作与权限面，再选 CLI／MCP 等接入；工具发现不代替授权，不设通用快慢或费用排名 | [04 MCP](04-mcp.md) | [00](00-state-of-ai-coding.md)、[Claude §4](01-agents/claude-code.md#4-按任务选择的用法要点)、[05](05-skills-and-plugins.md)、[16](16-building-agents.md)、[23](23-browser-verification.md) |
| 11. 交付要满足接收渠道的准入、恢复与维护责任；下一位维护者的实际修改比交接文档存在更有说服力 | [18 团队落地](18-team-adoption.md) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[14](14-synthesis.md)、[15](15-task-playbooks.md)、[24](24-community-workflows.md) |
| 12. 事实、统计与收益结论保留来源、分母和适用范围；社区单例、厂商自报与相关性不升级为普遍因果 | [09 质量证据](09-review-and-quality.md#1-质量数据ai-代码的真实代价) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[00](00-state-of-ai-coding.md)、[11](11-community-pulse.md)、[14](14-synthesis.md)、[19](19-experiments.md)、[游戏资产总览](../domains/game-dev/03-generative-ai-in-games.md) |
| 13. 游戏资产先定玩法／设备规格，再核代码、权重、输出和发布规则；现成或程序化资源满足时不重生成 | [游戏 03 资产总览](../domains/game-dev/03-generative-ai-in-games.md) | [游戏入口](../domains/game-dev/README.md)、[2D](../domains/game-dev/assets/2d.md)、[3D](../domains/game-dev/assets/3d.md)、[动画](../domains/game-dev/assets/animation.md)、[材质](../domains/game-dev/assets/materials.md)、[音频](../domains/game-dev/assets/audio.md)、[视频](../domains/game-dev/assets/video.md)、[18](18-team-adoption.md) |
| 14. 资产导入沿用已有引擎入口；替换和第二次修改要保引用、身份与原消费者，不以首次导入代替生产验证 | [游戏 01 引擎接入](../domains/game-dev/01-engine-integration.md) | [游戏入口](../domains/game-dev/README.md)、[Unity](../domains/game-dev/unity/README.md)、[Unreal](../domains/game-dev/unreal/README.md)、[游戏路线图](../domains/game-dev/06-indie-roadmap.md)、[07](07-workflows.md) |
| 15. 游戏按要回答的问题组合逻辑、状态、画面和真人试玩证据；功能通过不代替响应、辨识、手感或乐趣的取舍 | [游戏 02 验证与试玩](../domains/game-dev/02-verification-and-playtesting.md) | [首页](../README.md#一页纸怎样把-ai-编程用好)、[14](14-synthesis.md)、[23](23-browser-verification.md)、[客户端模块](../domains/game-dev/04-client-modules.md)、[gameplay](../domains/game-dev/05-gameplay-architecture.md)、[游戏路线图](../domains/game-dev/06-indie-roadmap.md) |
| 16. 开放探索先定决定与硬约束；关键结论回原文核查，候选转成约束与验收，不以热度、引用数或多 Agent 一致证明质量 | [25 AI 探索任务](25-ai-exploration.md) | [首页](../README.md)、[12 来源与待验证](12-resources.md)、[研究依据](research/2026-10-15-exploration-evidence.md) |

**依据**：[研究：文档一致性核对] 2026-10-15（UTC+8）核对；本表是入口摘要的维护清单，不是额外开发流程。

### 两种情境的入口走读

**A（已有明确失败）和 B（功能检查通过，但有依据和可比较标准的质量目标，例如让多项结果更容易比较）都先保留必要行为与权限边界，再决定补资料、短契约、工具还是窄 Skill；B 不要求先制造失败，A 也不自动安装全套流程。** 两列的差别只在判断起点：A 用失败命令、预期和版本复现，B 直接用质量目标比较。

| 入口与核对位置 | A：已有失败 | B：功能正常，有质量目标 |
|---|---|---|
| [首页读者地图的扩展与模型选择](../README.md) | 定位缺口，选最小补充 | 质量目标可直接进入；质量与代价分开判断 |
| [Codex §6](01-agents/codex.md#6-使用建议从实际问题选择方法) | 用失败命令、预期和版本复现 | 复用 brief／设计系统，明确目标操作和保留行为 |
| [Claude §4／§7](01-agents/claude-code.md#7-推荐起步先原生扩展按需选择) | 原生检查不足才按条件补能力 | 有依据的质量目标也可选最小补充，不必先装插件 |
| [14 §8](14-synthesis.md#8-成熟度路线) | 按缺口选投入 | 从质量目标进入 05／22，不走工具安装等级 |
| [22 §1／§5／§7](22-agent-evaluation.md#1-要回答的是一个决策) | 比较目标缺口是否改善 | 预设质量标准，保留回归；允许两边功能都通过 |
| [24 默认基线](24-community-workflows.md#本仓库判断强-agent-的默认基线应更轻) | 调试或验证证据补具体问题 | 领域依据可改善信息关系／任务引导，不默认整套 Skill |

**依据**：[研究：内容基线评估] 2026-10-15（UTC+8）的文档情境核对，不是运行 Agent 的收益实验；具体保留／缩减／撤回按 [22 §7](22-agent-evaluation.md#7-何时推广何时停止)。

## 评级与证据体系

**判断一个结论能不能直接用，看两件事：页面成熟度（能否照做）和证据等级（结论怎么来的）。** 证据标签之间没有高低之分，成熟度才有级别；成熟度见下一节，本节定义采用评级和证据标签。

### 评级（借鉴 ThoughtWorks 技术雷达）

| 标记 | 含义 |
|---|---|
| ✅ **采用** | AI coding 主干的核心推荐已有真实采用，且新读者按页实际做成；只覆盖注明的任务与条件，不表示整页所有功能或模型收益已验证；局部改写只作废受改动步骤影响的旧回执，未变步骤不连带降级 |
| 🟡 **待补实做／采用** | 已有答案，但新读者实际做成或核心推荐的真实采用仍待补 |
| 🧪 **试用** | 值得在真实项目中小范围试，可能有明显收益 |
| 👀 **评估** | 有潜力但不成熟、证据不足或争议大，先观察 |
| ⛔ **暂缓** | 有明显问题（维护停滞、风险、性价比低），不建议新采用 |

AI coding 主干的 ✅／🟡 与[首页读者入口](../README.md#按目标开始阅读)一致；工具候选保留 🧪／👀 等评级。下文 L1–L4 与原核实日期记录历史内容成熟度，不据此推定历史页面已完成运行验证；游戏分支沿用既有细则。

### 证据等级

| 标记 | 含义 |
|---|---|
| **[一手]** | 直接阅读了官方文档、源码、changelog、规范原文或官方博客 |
| **[社区]** | 使用者、维护者的公开经验与讨论；注明单例或多份独立来源，标签本身不表示共识 |
| **[研究]** | 论文、系统性调查或本仓库有明确方法的分析；注明外部研究/本仓库分析，以及实际阅读或验证范围 |
| **[二手]** | 只有搜索摘要或单一第三方文章，未能读到原文，需谨慎 |
| **[经验]** | 业内常见做法或作者经验判断，没有单一出处 |

这些标签标识来源或论证类型，**不是从高到低的可信度分数**。官方文档可确认产品契约，不能自动证明生产力；源码可确认实现路径，不能替代运行结果；本仓库分析不能借用论文标签的权威。使用 `[研究：本仓库分析]` 时写出推理依据；采用建议通常标 `[经验：采用判断]`。新页和已改写的页面把标签写在节末“依据”行；旧页逐句标注的标签含义相同。

### 核实轮次与证据约定

**下面是各轮实际读到的材料和未覆盖范围，判断标签适用范围时以此为准。**

- **第二轮（2026-10-05）**：直接读取 arXiv 原文或摘要、METR 原始报告、GitClear 公开摘要／报告图示、SWE-bench 与 Scale 官方榜单、OpenAI（learn.chatgpt.com）／Cursor／Unity 官方文档，以及 HN（Algolia API 读原帖和评论）、Lobsters、V2EX、Simon Willison 博客和 Latent Space。更正了上一轮基于搜索摘要的结论，例如 AGENTS.md 研究、METR 数据方向、Codex Auto-review 配置名、并行冲突率含义。未覆盖 Reddit、linux.do（拦截机房 IP）和少数被网络策略拦截的博客。`[研究：摘要]` 表示只读 arXiv 摘要原文，`[研究：原文]` 表示读了正文。
- **第三轮（2026-10-08）**：新增 [14 深度分析](14-synthesis.md)，从前两轮材料提炼六条底层规律、决策框架和成熟度路线，每条标明「什么证据会推翻它」；游戏开发分支扩展为 [domains/game-dev](../domains/game-dev/README.md)，克隆阅读 Epic 的 Unreal 官方插件，读 Roblox、Blender 官方文档、GDC 2026 调查和 Steam 全量统计原文；读 HumanLayer、Lilian Weng、Will Larson 关于 harness engineering 和软件工厂的原文，以及 10 月第一周的模型和产品发布。
- **第六轮（2026-10-08）**：在云端用 `claude -p` 做三组实验，写成 [19 实测记录](19-experiments.md)，证据等级标为 `[经验：实测]`；读 Anthropic 多 Agent 研究系统、Code Review、安全 SDLC 原文，Cognition 的反方观点，Claude Code 沙箱、Agent Teams、子 Agent 文档，Nx、AWS 安全公告，据此加厚 08、09、10。
- **证据补充约定（2026-10-11）**：单个 issue 或实践者报告写 `[社区：单例]`，不能据此称普遍现象；官方和作者的效果自报不等于独立验证。`[经验：设计]`／`[经验：待验证]` 表示本仓库建议，`[经验：合成测试]` 只表示固定夹具通过。重要事实同时注明来源、日期、适用版本与读取程度，未确认首次修复版本就明确未知。

## 核心页面成熟度

**AI Coding 当前采用状态只看[首页答案地图](../README.md#按目标开始阅读)。** 旧 L1–L4 是资料成熟度，不等于读者已实做或当前方法最优；不与 ✅／🟡 换算。

<a id="双轴试评事实可用不等于已知最优"></a>
<a id="主干页面"></a>

[旧主干逐页成熟度与差距表（固定版本）](https://github.com/dbvv1/a1dbv/blob/6a87de308738a21125519931bc57ee706d9577ff/docs/README.md#核心页面成熟度) · [原双轴试评与反例](collaboration/reviews/2026-10-21-p42-dual-axis.md)。下方游戏页仍按自己的资料尺度阅读。

### 游戏核心页面

> 本表 L3 级别仅反映公开资料与源码分析完成度（各页均附固定引用与适用边界），不代表商业担保或真实游戏发布验收通过。

| 页面 | 当前级别 | 核心依据与待补 |
|---|---|---|
| [游戏总入口](../domains/game-dev/README.md) | L3 | 全文选路与主专题一致性复核；待补真实案例覆盖 |
| [01 引擎接入](../domains/game-dev/01-engine-integration.md) | L3 | 原生入口、依赖批次、序列化迁移与恢复边界；引擎运行未测 |
| [02 验证与试玩](../domains/game-dev/02-verification-and-playtesting.md) | L3 | 近期反馈对比、按事件日志与按键探针分流；真人手感闭环待补 |
| [03 资产与运行时 AI](../domains/game-dev/03-generative-ai-in-games.md) | L3 | 原型/资产/运行时选路图与三段简报；整套成品成本待补 |
| [04 客户端模块](../domains/game-dev/04-client-modules.md) | L3 | 11 模块替代比较与二改边界；真实设备性能与引擎运行未测 |
| [05 Gameplay 架构](../domains/game-dev/05-gameplay-architecture.md) | L3 | 状态所有权、技能编排与二改接收；完整实机演出待补 |
| [06 独立游戏路线图](../domains/game-dev/06-indie-roadmap.md) | L3 | 阶段划分、内容冻结与玩家二改检查；全流程单人实战样本补充中 |
| [2D 资产](../domains/game-dev/assets/2d.md) | L3 | 十组生产选路、图集二改与导入契约；待真实资产族复用 |
| [3D 资产](../domains/game-dev/assets/3d.md) | L3 | 生成源/Blender `bpy`/减面/蒙皮接入合同；高面数与光照待配合材质页 |
| [动画与绑定](../domains/game-dev/assets/animation.md) | L3 | 同骨架/IK/状态机分工；待真实动作组全流程验收 |
| [材质与特效](../domains/game-dev/assets/materials.md) | L3 | PBR 通道打包、材质族替换与粒子边界；待真实 GPU 性能复测 |
| [音频资产](../domains/game-dev/assets/audio.md) | L3 | 13 组路线与混音事件调度；真实试听与多段疲劳待人审 |
| [视频与过场](../domains/game-dev/assets/video.md) | L3 | 源镜头、分任务编辑与渠道合规对比；未试用 |
| [Unity 入口](../domains/game-dev/unity/README.md) | L3 | 编译、CLI/MCP 与文本例外核查；目标工程运行未测 |
| [Unreal 入口](../domains/game-dev/unreal/README.md) | L3 | 工具集选型与开发边界；实际构建未测 |

**依据**：2026-10-15 内容基线评估（AI Coding 当前状态见 [首页答案地图](../README.md#按目标开始阅读)；各节来源详情见 [审查记录](research/2026-10-10-audit.md)）。

## 来源审查与验证状态（2026-10-10；目录于 10-11 整合）

**来源类型和验证状态分开记：一手文档/社区单例不等于本仓库已实测。**
- **易变事实**（价格、版本、权限、API）附核实日期、直接来源与固定提交；
- **实验记录**附输入、配置、脚本、逐次结果与失败边界；工程推论单独标出，访问受阻直接记未验证。

长期研究路线见 [研究路线](research/README.md)。

## 维护流程

**新结论先进 Backlog，验证后再进正文；过时内容直接删，保留 Git 历史即可：**
1. **跟踪一手源**（[12-resources](12-resources.md#5-什么变化值得继续跟进)）：核对主流工具 changelog 与官方文档，同步改变建议的内容至正文与 [13 前沿雷达](13-frontier-radar.md)；
2. **先入队列再吸收**：候选先记入 `inbox.md` / `12-resources.md`，复核后再入主干；
3. **结论配依据**：无来源不写，二手来源标明；
4. **动态事实维护**：价格、许可与权限注明核实日期及触发重核的事件；
5. **定期清理**：被取代的过时数字与多余声明直接删除。
