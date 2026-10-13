# a1dbv — AI Coding 前沿知识库

> 帮助开发者判断：面对具体任务，怎样用 **AI Coding** 获得更好的结果，哪些新工具与方法值得采用。
> 主干是通用的 AI coding；具体领域（如游戏开发 / Unity）作为分支放在 [`domains/`](domains/)。

**本轮更新：2026-10-13**：以 **Codex 为主、Claude Code 为辅**，dot 主导，Claude 与云端 Codex 的建议作补充。[任务级入口](docs/01-agents/codex.md#先给什么遇到什么再增加能力)、正文分层与协作归档已完成；[整体评估与专项审计](docs/collaboration/reviews/2026-10-13-331e093.md)修正模板覆盖、默认流程和撤回结论回流问题。[四条长期研究任务](docs/research/BACKLOG.md#四条长期任务以真实开发结果组织研究)继续追产品试用、能力增量、连续修改和接管成本；新增内容的证据及验证范围见各页。

执行资产与历史验证见 [维护路线](docs/maintenance-roadmap.md)、[长程执行](docs/20-codex-long-horizon.md) 与 [开源机制](docs/21-agent-patterns.md)。证据等级见 [说明](docs/README.md#评级与证据体系)。

---

## 一句话

> **让 AI 扩大能做的事情，同时保留对结果的理解与判断。** 本仓库关注真实开发能力、人的关键反馈，以及工具和流程的收益与代价。→ [研究方向与选题标准](docs/research/README.md)、[14 深度分析](docs/14-synthesis.md)

## 一页纸：怎样把 AI 编程用好

以下是本仓库的实践判断 **[经验：综合建议]**；对应章节区分来源事实、作者经验和未验证假设。

1. **先定义可观察的完成标准。** 编译、业务测试、浏览器操作和人工判断各覆盖不同问题。不要只接受 Agent 的完成声明。→ [07 工作流](docs/07-workflows.md)、[23 浏览器验证](docs/23-browser-verification.md)
2. **上下文按任务提供。** 先定位相关事实，常驻规则只写必要信息；把暂时的搜索过程压缩为可复查的结论。长度、工具数量与推理强度都要通过任务对照决定。→ [03](docs/03-context-engineering.md)、[22](docs/22-agent-evaluation.md)
3. **先解决一个反复出现的失败，再增加一个 Skill。** 访谈、调试、评审、交接各有用途；不要同时堆叠几套争夺控制权的完整流程。→ [05](docs/05-skills-and-plugins.md)、[24 社区工作流](docs/24-community-workflows.md)
4. **模型、工具、流程一起评估。** API 账单、另购 credits 与订阅内额度分开记录；比较首次成功、重试、总费用、人工审查和返工，避免只看排行榜、最佳一次结果或生成行数。→ [02](docs/02-models-and-cost.md)、[22](docs/22-agent-evaluation.md)
5. **并行要有清楚的交付边界。** 任务可分、上下文可交接、结果有人整合时才值得拆分；接口改变后也要更新尚未执行的计划。→ [08](docs/08-multi-agent.md)、[24](docs/24-community-workflows.md)
6. **自动运行需要故障恢复。** 进程结束、外部请求超时、旧记忆和日志截断都可能让“继续”变成重复或误判。显式状态、有限重试与写操作对账很重要。→ [20](docs/20-codex-long-horizon.md)
7. **约束由实际执行边界落实。** 类型 schema、Hook 和模型评审都有适用范围；权限、凭证与副作用不能只靠提示词声明。→ [06](docs/06-hooks-and-guardrails.md)、[10](docs/10-security.md)
8. **快速原型用来发现问题，真实交付需要补足证据。** 先打通核心路径，亲自试用；接入真实用户、数据或收费前检查权限、持久化、故障恢复和维护方式。→ [24](docs/24-community-workflows.md)
9. **读实践者的失败记录，也读源码与官方规范。** 开源作者、维护者和使用者有不同目标；个人成功案例不代表普遍收益，社区热度不等于证据。→ [11](docs/11-community-pulse.md)、[24](docs/24-community-workflows.md)
10. **领域验证决定自主程度。** 游戏中的编译、状态与自动试玩可以逐步自动化，手感与乐趣仍需要人体验。→ [游戏开发](domains/game-dev/README.md)

## 实用工具独立模块

[按实际问题选工具](docs/practical-tools/README.md)：账号与网关、用量与会话、工作树、代码与文档检索、浏览器诊断、评审自动化。先比较原生能力，再看工具增量、数据出口和退出成本；本轮为来源与文档评估，未安装实测。**[经验：采用入口，2026-10-12]**

## 按目标开始阅读

| 你现在要做什么 | 推荐入口 |
|---|---|
| 优化主力 Codex，兼顾 Claude Code | [Codex](docs/01-agents/codex.md) → [Claude Code](docs/01-agents/claude-code.md) |
| 看真实开发者怎样使用 Skills 和 Agent | [24 社区工作流与失败案例](docs/24-community-workflows.md) |
| 判断工作流是否对强模型仍有价值 | [24 的独立分析](docs/24-community-workflows.md#本仓库判断强-agent-的默认基线应更轻) |
| 解决具体编码任务 | [15 按任务类型的打法](docs/15-task-playbooks.md) |
| 判断新模型、Skill 或配置是否值得换 | [22 Agent 评估](docs/22-agent-evaluation.md) |
| 做长任务、自建 Agent 或无人值守流程 | [16 自建 Agent](docs/16-building-agents.md) → [20 可靠的长任务](docs/20-codex-long-horizon.md) |
| 查看长期研究重点和待验证问题 | [研究路线](docs/research/README.md) |
| 查看两端分工、实施任务和提交评审 | [协作入口](docs/collaboration/README.md) |
| 核实最新审计范围与仓库问题 | [整体评估](docs/collaboration/reviews/2026-10-13-331e093.md)；[历史来源审查](docs/research/2026-10-10-audit.md) |

## 目录

### 主干：AI Coding

| 文档 | 内容 |
|---|---|
| [docs/README.md](docs/README.md) | 阅读顺序、评级与证据体系、维护流程 |
| [00 现状总览](docs/00-state-of-ai-coding.md) | 2026 年 AI coding 的格局、趋势、共识与争议 |
| [01 Coding Agent](docs/01-agents/README.md) | Agent 对比矩阵与选型；Claude Code / Codex / Gemini CLI / 开源 Agent / IDE 类深度页 |
| [02 模型与成本](docs/02-models-and-cost.md) | 模型档位、价格、订阅 vs API、额度、国内 Coding Plan、本地模型、基准测试可信度 |
| [03 上下文工程](docs/03-context-engineering.md) | 原理、指令文件（含研究证据）、记忆、压缩、子 Agent |
| [04 MCP](docs/04-mcp.md) | 规范演进、MCP vs CLI 争论、推荐服务器、如何写好工具 |
| [05 Skills 与插件](docs/05-skills-and-plugins.md) | Agent Skills 规范、编写与评估方法、插件市场与值得装的东西 |
| [06 Hooks 与护栏](docs/06-hooks-and-guardrails.md) | Hooks、权限模式、auto mode 实测数据、沙箱 |
| [07 工作流](docs/07-workflows.md) | 验证闭环、探索-计划-实现、访谈式 Spec、TDD、SDD（含批评）、Ralph 循环、长时任务 harness |
| [08 多 Agent 与并行](docs/08-multi-agent.md) | 5 种并行方式、“读并行、写串行”的证据、子 Agent 配置与委派写法、操作手册 |
| [09 评审与质量](docs/09-review-and-quality.md) | 质量数据、托管评审的实际数据、REVIEW.md、分层评审流水线、给 AI 配置做评估 |
| [10 安全](docs/10-security.md) | 威胁模型、真实事件与四个案例拆解、auto mode 误差、沙箱手册、CI 安全、参考架构、清单 |
| [11 社区脉搏](docs/11-community-pulse.md) | 痛点排行、口碑、争议、生产力证据 |
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

长期方向与下一批待验证问题见 [维护路线](docs/maintenance-roadmap.md)：AI coding 为主，游戏开发为补充；不以提交数量替代真实收益。

- **证据优先**：每条事实注明来源；一手来源（官方文档、源码、changelog）优先；只有搜索摘要的标注为二手。
- **有判断**：不堆链接，写“适合谁、不适合谁、坑在哪”。
- **会过时**：生态以周为单位变化，文档头部写核实日期；过时内容直接改或删。
- 本仓库是 **public**：禁止提交密钥、内部地址、公司代码。

## 许可证

[MIT](./LICENSE)
