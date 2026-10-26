# a1dbv — AI Coding 前沿知识库

> **先找当前最高水平的做法，再用证据判断是否采用。** 本仓库帮助开发者判断：面对具体任务，怎样用 **AI Coding** 获得更好的结果，哪些新工具与方法值得采用；主干是通用 AI coding，具体领域（如游戏开发 / Unity）作为分支放在 [`domains/`](domains/)。

## 读者问题 → 答案

**按你现在要解决的问题找答案。** ✅ 照做即可；🟡 有答案，仍在整理成一页；⏳ 整理中。

| 问题 | 先看 | 状态 |
|---|---|---|
| 选 Claude Code、Codex 还是 Cursor | [01 Agent 选择](docs/01-agents/README.md) | ✅ |
| 模型、推理档与强弱分工怎么选、多贵 | [按任务分工](docs/decisions/model-roles.md) · [计费明细](docs/02-models-and-cost.md) | ✅ |
| CLAUDE.md／AGENTS.md 怎么写 | [共享规则、加载首验与真实团队样例](docs/decisions/instruction-files.md) | ✅ |
| 怎样让 Agent 自己验证、别只报完成 | [07 §1](docs/07-workflows.md#1-核心验证闭环-)、[23 浏览器验证](docs/23-browser-verification.md) | 🟡 |
| 上下文怎么管、会话越聊越笨怎么办 | [03 §3](docs/03-context-engineering.md#3-会话层面的上下文管理)、[17 §2.6](docs/17-troubleshooting.md) | 🟡 |
| 该装哪些 Skill 与插件 | [按能力缺口选一项，附配置与起步](docs/decisions/skills-and-plugins.md) | ✅ |
| 该接哪些 MCP | [04 MCP](docs/04-mcp.md) | ✅ |
| Codex 过度防御、过度工程怎么治 | [按触发输入与契约收敛改动](docs/decisions/codex-overengineering.md) | ✅ |
| 子代理与多 Agent 怎么组织 | [08 多 Agent](docs/08-multi-agent.md) | 🟡 |
| 长任务与无人值守怎么跑 | [20 长任务](docs/20-codex-long-horizon.md) | 🟡 |
| 怎么审 AI 写的代码 | [09 评审](docs/09-review-and-quality.md)、[REVIEW 模板](templates/generic/REVIEW.md) | ✅ |
| 权限、沙箱与 Hooks 怎么配 | [10 安全](docs/10-security.md)、[06 Hooks](docs/06-hooks-and-guardrails.md) | 🟡 |
| 调试、Agent 跑偏或谎报完成 | [17 排障](docs/17-troubleshooting.md)、[15 调试](docs/15-task-playbooks.md) | ✅ |
| 测试驱动、规格驱动、计划模式 | [07 工作流](docs/07-workflows.md) | 🟡 |
| 前端与 UI 任务 | [23 浏览器验证](docs/23-browser-verification.md) | 🟡 |
| 遗留代码与大迁移 | [15 任务打法](docs/15-task-playbooks.md) | ✅ |
| 团队怎么推广 | [18 团队落地](docs/18-team-adoption.md) | ✅ |
| 本周值得试什么 | [本周 Top 5：按当前编码任务选](docs/13-frontier-radar.md#本周-top-5) | ✅ |
| 用 AI 做游戏 | [游戏分支](domains/game-dev/README.md) | 🟡 |

需要自己找当前最强的做法时，用 [explore-frontier Skill](templates/generic/.claude/skills/explore-frontier/SKILL.md)。


---

## 一句话

> **让 AI 扩大能做的事情，同时保留对结果的理解与判断。** 本仓库关注真实开发能力、人的关键反馈，以及工具和流程的收益与代价。→ [研究方向与选题标准](docs/research/README.md)、[14 深度分析](docs/14-synthesis.md)

## 一页纸：怎样把 AI 编程用好

**✅ 保留已经稳定达标的工作流；新任务按下表选入口和配置。** 本节只保留实践判断的摘要；详细条件、依据和反证详见[核心建议清单](docs/README.md#核心建议一致性清单)指定的主专题，入口与配置分档详见 [02](docs/02-models-and-cost.md#1-原则按任务分档而不是追榜单)。先确认入口实际支持该型号和配置：以下是仓库采用建议，不是产品出厂默认或模型实测排名。

| 任务 | 现在用什么、怎么配 | 何时调整 |
|---|---|---|
| 本机日常功能、补测试或小修复 | Codex CLI：`codex --model gpt-6.1-sol -c 'model_reasoning_effort="medium"'`；已有Claude Code则用`claude --model claude-sonnet-5-5 --effort medium` | 仅漏深度先升effort；缺资源／验证工具先补对应入口，不以换模型代替 |
| 困难跨模块重构、疑难bug或高兼容目标 | 同一入口可直接选GPT-6 Astra＋Light（CLI值`low`），或Opus 5.5＋`medium`；重验证可从`high`起 | 更强配置未改善质量，或等待、费用和返工不值，退回原配置；不必先失败才升档 |
| 可脱离本机、希望关机后继续 | Codex Cloud已发布环境，模型按上两行；先核仓库依赖和检查能在云端执行 | 必须用本机设备、登录或VPN才能验收，就留本机入口，不假定云端自动继承 |

Agent 调查、修改并交回实际检查结果，人核目标、旧行为与遗漏的调用方，UI／手感需体验。不能猜的契约先调查、补决定；体验未定先做可撤回样品，再验一次代表性的后续修改。配置命令、官方依据及撤回条件详见 [01](docs/01-agents/README.md#30-秒结论) 与 [14](docs/14-synthesis.md#0-30-秒结论按任务选入口交付到可继续修改)；Codex 的 `-c` 只覆盖本次启动。

**⛔ 不默认堆多套流程，或让 Agent 在没有验收出口时包办整个产品。** 有明确能力缺口或质量目标，才加最小工具／评审；可独立交付且有整合者时再并行。原路径无法访问必要资源、反复漏约束，或新方案的收益被等待和返工抵消，就调整或撤回该路径；这是采用边界，不是原生方案效果必胜的承诺。

1. **先定义可观察的完成标准。** 编译、业务测试、浏览器操作和人工判断各覆盖不同问题。先让 Agent 能实际启动目标路径并观察结果，不要只接受完成声明。→ [07 工作流](docs/07-workflows.md)、[23 浏览器验证](docs/23-browser-verification.md)
2. **上下文按任务提供。** 先定位相关事实，常驻规则只写必要信息；把暂时的搜索过程压缩为可复查的结论。长度、工具数量与推理强度都要通过任务对照决定。→ [03](docs/03-context-engineering.md)、[22](docs/22-agent-evaluation.md)
3. **原生起步，有可定位的能力缺口或有依据的质量目标时，再选择最小有效补充。** 先复用资料、项目约定与已有工具，不必等功能失败，也不默认增加 Skill；不要同时堆叠几套争夺控制权的完整流程。→ [05](docs/05-skills-and-plugins.md)、[24 社区工作流](docs/24-community-workflows.md)
4. **模型、工具、流程一起评估。** 必要行为不退步，目标质量、总费用、实际等待与人工审查／返工分别判断；API 账单、另购 credits 与订阅内额度分开记录，首次成功与重试也分开；选型分数与独立终评分开，避免只看排行榜、最佳一次结果或生成行数。→ [22 评估](docs/22-agent-evaluation.md)、[02 计费口径](docs/02-models-and-cost.md)
5. **原生按需委派，显式拆分要有收益和交付边界。** 能扩大证据覆盖、减少主上下文或缩短关键路径，且结果能整合时再要求并行；接口改变后也要更新尚未执行的计划。→ [08](docs/08-multi-agent.md)、[24](docs/24-community-workflows.md)
6. **自动运行需要故障恢复。** 进程结束、外部请求超时、旧记忆和日志截断都可能让“继续”变成重复或误判。显式状态、有限重试与写操作对账很重要。→ [20](docs/20-codex-long-horizon.md)
7. **约束由实际执行边界落实。** 类型 schema、Hook 和模型评审都有适用范围；权限、凭证与副作用不能只靠提示词声明。→ [10 安全](docs/10-security.md)、[06 Hook 边界](docs/06-hooks-and-guardrails.md)
8. **快速原型用来判断价值，真实交付需要补足证据。** 先比较现成方案、局部补充与完整替代，再打通有用的一步并试用；接入真实用户、数据或收费前检查权限、持久化、故障恢复和维护方式。→ [15 原型](docs/15-task-playbooks.md#10-原型和一次性脚本)、[18 交付与接管](docs/18-team-adoption.md)
9. **读实践者的失败记录，也读源码与官方规范。** 开源作者、维护者和使用者有不同目标；个人成功案例不代表普遍收益，社区热度不等于证据。→ [09 证据边界](docs/09-review-and-quality.md#1-质量数据ai-代码的真实代价)、[24 实践案例](docs/24-community-workflows.md)
10. **领域验证决定自主程度。** 游戏按问题组合编译、状态、画面和自动试玩证据，手感与乐趣仍需要人体验。→ [游戏验证](domains/game-dev/02-verification-and-playtesting.md)、[游戏路线图](domains/game-dev/06-indie-roadmap.md)

**依据**：[经验：综合建议] 本节实践判断摘要；[研究：2026-10-20] 入口与配置分档详见正文 02；[研究] 上文主专题；核实 2026-10-20。

## 按目标开始阅读

| 你现在要做什么 | 推荐入口 |
|---|---|
| 需要向外找方案、参照，判断复用还是自建 | [25 AI 探索任务](docs/25-ai-exploration.md) → [12 来源与待验证](docs/12-resources.md) |
| 已有失败，判断先补资料、工具还是流程 | [15 调试](docs/15-task-playbooks.md#2-调试) → [05 最小补充](docs/05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么) |
| 功能正常，希望改善信息表达、响应或可维护性 | [15 已有产品改进](docs/15-task-playbooks.md#102-已有产品按问题选择改进) → [22 比较与撤回](docs/22-agent-evaluation.md#7-何时推广何时停止) |
| 使用 Codex 或 Claude Code | [Codex](docs/01-agents/codex.md) → [Claude Code](docs/01-agents/claude-code.md) |
| 看真实开发者怎样使用 Skills 和 Agent | [24 社区工作流与失败案例](docs/24-community-workflows.md) |
| 比较年初与现在，判断旧建议是否过时 | [00 五维范式快照](docs/00-state-of-ai-coding.md#1-当前最高水平年初与-10-月到底变了什么) → [14 条件自主默认](docs/14-synthesis.md#0-30-秒结论按任务选入口交付到可继续修改) |
| 判断工作流是否对强模型仍有价值 | [24 的独立分析](docs/24-community-workflows.md#本仓库判断强-agent-的默认基线应更轻) |
| 改善 Agent 完成编码任务的能力 | [先选能力缺口](docs/15-task-playbooks.md#先动手改善-agent-的一项能力) → [按任务选打法](docs/15-task-playbooks.md#0-总表) |
| 判断新模型、Skill 或配置是否值得换 | [22 Agent 评估](docs/22-agent-evaluation.md) |
| 做长任务、自建 Agent 或无人值守流程 | [16 自建 Agent](docs/16-building-agents.md) → [20 可靠的长任务](docs/20-codex-long-horizon.md) |
| 查看长期研究重点和待验证问题 | [研究路线](docs/research/README.md) |
| 参与维护：开工规则、认领与评审 | [运行手册](docs/collaboration/LONG-TERM-PLAN.md)、[协作目录](docs/collaboration/README.md) |
| 核对已发布的整体审计与修复 | [10-15 整体审计（基于 795ec5b）](docs/collaboration/reviews/2026-10-15-795ec5b.md)；[五项问题的主要修复](https://github.com/dbvv1/a1dbv/commit/4fa347a)；[历史来源记录](docs/research/2026-10-10-audit.md) |

## 目录

### 主干：AI Coding

| 文档 | 内容 |
|---|---|
| [docs/README.md](docs/README.md) | 阅读路径、核心建议归属、逐页成熟度、评级与证据体系 |
| [00 现状总览](docs/00-state-of-ai-coding.md) | 2026 年 AI coding 的格局、趋势、共识与争议 |
| [01 Coding Agent](docs/01-agents/README.md) | Agent 对比矩阵与选型；Claude Code / Codex / Gemini CLI / 开源 Agent / IDE 类深度页 |
| [02 模型与成本](docs/02-models-and-cost.md) | 模型档位、价格、订阅 vs API、额度、国内 Coding Plan、本地模型、基准测试可信度 |
| [03 上下文工程](docs/03-context-engineering.md) | 原理、指令文件（含研究证据）、记忆、压缩、子 Agent |
| [04 MCP](docs/04-mcp.md) | 按能力缺口选择 CLI、MCP／插件与撤回，核对权限和结果契约 |
| [05 Skills 与插件](docs/05-skills-and-plugins.md) | 资料／Skill／插件的最小补充、宿主权限与迁移边界 |
| [06 Hooks 与护栏](docs/06-hooks-and-guardrails.md) | Hooks、权限模式、auto mode 实测数据、沙箱 |
| [07 工作流](docs/07-workflows.md) | 验证闭环、探索-计划-实现、访谈式 Spec、TDD、SDD（含批评）、Ralph 循环、长时任务 harness |
| [08 多 Agent 与并行](docs/08-multi-agent.md) | 5 种并行方式、“读并行、写串行”的证据、子 Agent 配置与委派写法、操作手册 |
| [09 评审与质量](docs/09-review-and-quality.md) | 质量数据、托管评审的实际数据、REVIEW.md、按风险选择评审层、给 AI 配置做评估 |
| [10 安全](docs/10-security.md) | 威胁模型、真实事件与四个案例拆解、auto mode 误差、沙箱手册、CI 安全、参考架构、清单 |
| [11 社区脉搏](docs/11-community-pulse.md) | 采用证据链、历史口碑、争议与生产力证据 |
| [12 资源索引](docs/12-resources.md) | 一手信息源、技术社区、精选清单、如何持续跟进 |
| [**13 前沿雷达**](docs/13-frontier-radar.md) | **最近 3–6 个月的大事件、价格战、新兴做法、争议，以及下季度值得关注的方向** |
| [**14 深度分析**](docs/14-synthesis.md) | **六条底层规律（现象 → 机制 → 推论 → 边界）、决策框架、成熟度路线，以及什么证据会推翻这些判断** |
| [**15 按任务类型的打法**](docs/15-task-playbooks.md) | 理解代码、调试、新功能、重构、迁移、补测试、性能、评审、文档、原型：每类任务的风险、打法、验证和提示词 |
| [16 自建 Agent](docs/16-building-agents.md) | 什么时候值得自己搭；Claude Agent SDK / Tool Runner / Managed Agents 与 OpenAI Agents API / SDK / Codex SDK 的对比和选择 |
| [**17 故障排查**](docs/17-troubleshooting.md) | Agent 跑偏怎么办：谎报完成、改测试、范围蔓延、过度请示、上下文腐化、API 幻觉、成本暴涨、破坏性操作……症状 → 原因 → 处理，附官方测试过的提示词 |
| [18 团队落地与治理](docs/18-team-adoption.md) | 推广路线、准入与数据政策、配置治理、成本治理、度量、评审规范、人的成长、检查清单 |
| [**19 实测记录**](docs/19-experiments.md) | 历史模型实验与当前离线回归；区分原始产物缺口、模拟检查与真实运行 |
| [**20 Codex 长程执行闭环**](docs/20-codex-long-horizon.md) | 验收 ID、恢复、子任务收集、版本证据与停止条件；连接可测试资产 |
| [**21 开源机制借鉴**](docs/21-agent-patterns.md) | Superpowers、Spec Kit、OpenSpec、GSD 等的当前机制、反例与采用边界 |
| [22 Agent 评估](docs/22-agent-evaluation.md) | 真实任务集、对照、留出集、行为与结果、成本、模型裁判与原始证据 |
| [23 浏览器验证](docs/23-browser-verification.md) | 用户路径、持久化、视觉、异常恢复、会话隔离与测试自修复 |
| [24 社区工作流](docs/24-community-workflows.md) | 七个开源项目、维护者与使用者原帖、工作流分歧和失败案例 |
| [25 AI 探索任务](docs/25-ai-exploration.md) | 定义、检索、甄别、收敛、转化、评估；借现成研究工具，输出有证据的选择与生成约束 |

### 分支：领域落地

| 领域 | 内容 |
|---|---|
| [domains/game-dev](domains/game-dev/README.md) | AI coding × 游戏开发：各环节怎么用 AI、引擎接入、**验证与 AI 试玩**、游戏中的生成式 AI |
| [domains/game-dev/unity](domains/game-dev/unity/README.md) | 大型 Unity 项目：官方 Unity CLI / 插件、社区 MCP、项目落地指南、配置模板 |
| [domains/game-dev/unreal](domains/game-dev/unreal/README.md) | 大型 Unreal 项目：UE 5.8 官方 MCP 与 Epic 插件、Live Coding 与 UBT 编译、命令行自动化测试、配置模板 |

### 可直接使用

| 路径 | 内容 |
|---|---|
| [templates/](templates/README.md) | 通用项目模板（AGENTS.md、CLAUDE.md、REVIEW.md、settings、Hooks、Skills、Subagents）与个人全局模板 |
| [ai-config/](ai-config/README.md) + [scripts/](scripts/) | 本地 AI 配置的脱敏导出（白名单 + 密钥扫描） |

## 维护约定

**维护按证据优先、有判断、标明时效三条约定执行。** 方向详见 [AGENTS.md 方向锚点](AGENTS.md)，怎样参与维护详见 [运行手册](docs/collaboration/LONG-TERM-PLAN.md)：AI coding 为主，游戏开发为重点领域；不以提交数量替代真实收益。

- **证据优先**：关键结论的来源、等级和日期集中写在每节末的“依据”行；一手来源（官方文档、源码、changelog）优先；只有搜索摘要的标注为二手。
- **有判断**：不堆链接，写“适合谁、不适合谁、坑在哪”。
- **会过时**：生态以周为单位变化，文档头部写核实日期；过时内容直接改或删。
- 本仓库是 **public**：禁止提交密钥、内部地址、公司代码。

## 许可证

[MIT](./LICENSE)
