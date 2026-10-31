# a1dbv — AI Coding 前沿知识库

> **先找当前最高水平的做法，再用证据判断是否采用。** 本仓库帮助开发者判断：面对具体任务，怎样用 **AI Coding** 获得更好的结果，哪些新工具与方法值得采用；主干是通用 AI coding，具体领域（如游戏开发 / Unity）作为分支放在 [`domains/`](domains/)。

<a id="按目标开始阅读"></a>
## 读者问题 → 答案

**按你现在要解决的问题找答案。** ✅ 新读者实做可用且核心推荐有真实采用；🟡 已有答案，实做或真实采用待补；⏳ 整理中。

| 问题 | 先看 | 状态 |
|---|---|---|
| 选 Claude Code、Codex 还是 Cursor | [01 Agent 选择](docs/01-agents/README.md) | 🟡 |
| 模型、推理档与强弱分工怎么选、多贵 | [按任务分工](docs/decisions/model-roles.md) · [计费明细](docs/02-models-and-cost.md) | 🟡 |
| CLAUDE.md／AGENTS.md 怎么写 | [共享规则、加载首验与真实团队样例](docs/decisions/instruction-files.md) | 🟡 |
| 怎样让 Agent 自己验证、别只报完成 | [按目标行为选检查、修复与接收](docs/decisions/verification.md) | ✅ 真实用户路径／输出读回 |
| 上下文怎么管、会话越聊越笨怎么办 | [按症状压缩、重开与恢复检查点](docs/decisions/context-management.md) | 🟡 |
| 该装哪些 Skill 与插件 | [按能力缺口选一项，附配置与起步](docs/decisions/skills-and-plugins.md) | 🟡 |
| 该接哪些 MCP | [04 MCP](docs/04-mcp.md) | ✅ 既有授权接入查 CI |
| Codex 过度防御、过度工程怎么治 | [按触发输入与契约收敛改动](docs/decisions/codex-overengineering.md) | ✅ 新读者完成真实脚本修复 |
| 子代理怎么组织，长任务怎么无人值守 | [委派、整合验收与中断续接](docs/decisions/long-tasks.md) | 🟡 委派已用／持续自动续接待验 |
| 怎么审 AI 写的代码 | [09 评审](docs/09-review-and-quality.md)、[REVIEW 模板](templates/generic/REVIEW.md) | ✅ 真实补丁评审 |
| 权限、沙箱与 Hooks 怎么配 | [工作区自主执行与必要边界](docs/decisions/permissions-and-hooks.md) | 🟡 |
| 调试、Agent 跑偏或谎报完成 | [17 排障](docs/17-troubleshooting.md)、[15 调试](docs/15-task-playbooks.md) | ✅ 因果定位／回归 |
| 测试驱动、规格驱动、计划模式 | [按缺口选计划、测试与规格](docs/decisions/planning-and-tests.md) | ✅ Oil UI 失败先行／回归 |
| 前端与 UI 任务 | [真实组件、用户路径与失败恢复](docs/decisions/verification.md) | ✅ 真实交互／窄屏回归 |
| 遗留代码与大迁移 | [15 任务打法](docs/15-task-playbooks.md) | 🟡 |
| 新模型、工具或流程值得换吗 | [用真实任务比较质量与总投入](docs/decisions/tool-adoption.md) | ✅ exporter 同题比较／保留 |
| 已有产品正常工作，还应怎样改 | [按具体问题选择后续改进](docs/decisions/product-improvement.md) | ✅ exporter 输入校验改进 |
| 团队怎么推广 | [18 团队落地](docs/18-team-adoption.md) | 🟡 |
| AI 辅助补丁怎样贡献给开源项目 | [先核准入、上游现状与投稿主体](docs/decisions/upstream-contributions.md) | 🟡 准入核查／投稿待验 |
| 本周值得试什么 | [本周 Top 5：按当前编码任务选](docs/13-frontier-radar.md#本周-top-5) | ✅ Top 1 真实 CLI 实做 |
| 用 AI 做游戏 | [游戏分支](domains/game-dev/README.md) | 🟡 |

需要自己找当前最强的做法时，用 [explore-frontier Skill](templates/generic/.claude/skills/explore-frontier/SKILL.md)。


---

## 一句话

> **让 AI 扩大能做的事情，同时保留对结果的理解与判断。** 本仓库关注真实开发能力、人的关键反馈，以及工具和流程的收益与代价。→ [研究方向与选题标准](docs/research/README.md)、[14 深度分析](docs/14-synthesis.md)

## 一页纸：怎样把 AI 编程用好

**沿用已经有效的工具，从眼前一个真实任务开始；需要改变选择时，用上面的读者地图。**

1. **交代目标和保留行为。** 说明谁要完成什么、已有行为哪些必须留下；项目命令与特殊约定放进[共享指令](docs/decisions/instruction-files.md)。
2. **补齐会改变实现的决定。** 目标清楚就实现，未知事实先调查；需要计划、测试或持久规格时，按[任务缺口](docs/decisions/planning-and-tests.md)选一种起步。
3. **让 Agent 取得实际反馈。** 跑项目原生检查，再按任务核对真实组件、浏览器路径或后端读回；[验证页](docs/decisions/verification.md)给出可复制的任务与接收方式。体验与高影响取舍由人判断。
4. **按结果补能力，再继续修改。** 查版本资料、读领域配方、调模型投入或拆分独立任务，分别看[扩展选择](docs/decisions/skills-and-plugins.md)、[模型分工](docs/decisions/model-roles.md)与[长任务接收](docs/decisions/long-tasks.md)。保留质量和总投入确有改善的做法。

原理、比较与历史实试在下方证据目录；当前推荐与第一步集中在读者地图链接的答案页。

## 目录

### 主干：AI Coding

| 文档 | 内容 |
|---|---|
| [docs/decisions/](docs/decisions/) | 按读者问题给出选择、可复制起步与何时不适用 |
| [docs/README.md](docs/README.md) | 证据层阅读路径、核心建议归属、逐页成熟度与评级 |
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
| [**13 前沿雷达**](docs/13-frontier-radar.md) | **本周 Top 5、候选采用判断与原始研究依据** |
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

**维护按证据优先、有判断、标明时效三条约定执行。** 方向详见 [AGENTS.md 方向锚点](AGENTS.md)，怎样参与维护详见 [运行手册](docs/collaboration/LONG-TERM-PLAN.md)：AI coding 为主，游戏开发为重点领域；以读者能采用的选择和实际结果衡量工作。

- **证据优先**：关键结论的来源、等级和日期集中写在每节末的“依据”行；一手来源（官方文档、源码、changelog）优先；只有搜索摘要的标注为二手。
- **有判断**：给当前推荐、可复制起步和“何时不适用”。
- **会过时**：来源和核实日期放在对应依据处，过时内容就地修订。
- 本仓库是 **public**：禁止提交密钥、内部地址、公司代码。

研究与维护入口：[研究路线](docs/research/README.md)、[协作目录](docs/collaboration/README.md)。历史复核：[10-15 整体审计（固定树）](docs/collaboration/reviews/2026-10-15-795ec5b.md)、[相关修复](https://github.com/dbvv1/a1dbv/commit/4fa347a)、[历史来源记录](docs/research/2026-10-10-audit.md)。

## 许可证

[MIT](./LICENSE)
