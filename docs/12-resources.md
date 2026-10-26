# 12 · 资源索引

> 更新：2026-10-18（UTC+8；收敛旧待验证入口，来源保留原核查范围）。按要做的决定查找原始资料；采用条件回对应主专题，历史核查范围见第 6 节。

## 30 秒结论：从问题进入，不从名单安装

**✅ 先在主专题选做法，再用本页找到原始资料，核对自己的版本与任务。** 使用顺序是：**当前问题 → 主专题的条件判断 → 对应原文／源码 → 决定是否采用**。本页是查证索引，收录、官方身份和社区热度不代表评级或效果。

| 现在要决定什么 | 先读哪里 | 接着查什么 |
|---|---|---|
| 答案不在代码库里，要找现成方案或设计参照 | [25 AI 探索](25-ai-exploration.md) | 先用已有 Agent 定向检索，核官方文档、固定源码或原作品；资料分散才考虑已有权限的 Research 产品，候选或维护证据有缺口才扩渠道 |
| 指令没加载、上下文该增还是减 | [03 上下文](03-context-engineering.md) | 查目标客户端加载文档、项目指令与研究原文；文件名和篇幅不能说明实际效果 |
| 是否新增服务连接 | [04 MCP](04-mcp.md) | 核客户端与服务端契约、源码和权限；已有 CLI／资料够用就沿用 |
| 是否加 Skill、插件或完整流程 | [05 Skills](05-skills-and-plugins.md)、[24 社区工作流](24-community-workflows.md) | 核固定配置、作者实际改动与反例，针对能力缺口或有依据的质量目标补最小环节 |
| 是否增加评审或配置诊断 | [09 评审](09-review-and-quality.md) | 对照官方入口、实际报告与独立比较，确认现有检查漏了什么再补 |
| 热帖是否足以支持换工具 | [11 社区](11-community-pulse.md) | 追原帖、发布实现与实际任务结果；点赞和 issue 关闭不能代替采用证据 |

**证据不足就保留为线索；新增环节没有净收益就缩减或撤回。** 采用前核清适用版本、任务结果与可查工件；等待、失败与人工处理超过收益时，回主专题调整。历史实测只支持原记录的范围，历史读取与待验证项集中放在页末的折叠区。

以上为经验性阅读与采用建议。按团队找作者和原文，可查[来源名册与漏检校准](research/2026-10-15-exploration-evidence.md#p46按团队追踪来源与漏检校准)。

## 1. 官方来源：核对用法与实现

**升级、排错或接入前，先定位具体版本的官方文档与实现。** 下列一手入口用于核对契约，使用范围是本页的经验建议。

| 来源 | 什么时候读 |
|---|---|
| [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（[RSS](https://github.com/anthropics/claude-code/blob/main/feed.xml)） | 升级或排查版本差异，追到变更影响的官方文档 |
| [Claude Code 文档](https://code.claude.com/docs)（[llms.txt 索引](https://code.claude.com/docs/llms.txt)） | 核对加载、命令、权限与调用入口 |
| [Anthropic Engineering](https://www.anthropic.com/engineering) | 研究上下文、工具、长程任务、安全或评估机制；文章案例不直接证明自己的收益 |
| [openai/codex Releases](https://github.com/openai/codex/releases) 与源码 | 核对发行行为；文档不足时追对应版本实现 |
| [gemini-cli changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs) | 使用 Gemini CLI 且遇到版本相关问题时 |
| [MCP 规范仓库](https://github.com/modelcontextprotocol/modelcontextprotocol) | 核对协议契约与提案；再确认目标客户端／服务端是否实现 |
| [Agent Skills 规范](https://github.com/agentskills/agentskills) | 核对格式；触发与权限另查目标宿主 |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 已有明确组件需求时核对插件来源与内容；官方收录不代替权限审查 |

### Anthropic 工程文章：按问题选读

按正在解决的问题选一篇；这些是一手设计说明与案例，适合借鉴机制，不用于排列通用效果名次。

1. 架构取舍：[Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
2. 上下文选择：[Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
3. 工具接口：[Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
4. Skill 配方：[Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
5. 工具调用与过滤：[Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) / [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
6. 长程任务：[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) / [Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
7. 并行案例：[Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
8. 权限与隔离：[Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) / [How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)
9. 评估：[Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
10. 多 Agent 案例：[Multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

## 1.5 社区与研究：找任务、结果和反例

**✅ 按问题找原帖，再看任务、结果和反例。** 分清作者自述、受控研究与用户评论；估计普遍程度还需要任务与用户分母。采用判断见 [11](11-community-pulse.md) 与 [24](24-community-workflows.md)，下表保留各类来源的读法。

| 来源 | 用途与读法 |
|---|---|
| [Simon Willison 的博客](https://simonwillison.net) | 查具体实践与可复核产物；[Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/) 和 [2026 年阶段回顾](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)作入口，结论追到项目与运行记录 **[社区：作者经验]** |
| [Hacker News](https://news.ycombinator.com/) | 按工具、问题和版本找原帖及反例，不设点赞门槛；[Algolia 查询示例](https://hn.algolia.com/api/v1/search?query=claude%20code&tags=story)只用于定位，再读正文和评论 **[社区]** |
| [Lobsters](https://lobste.rs/t/ai) | 寻找具体技术讨论与不同意见，核对评论指向的原文 **[社区]** |
| [Latent Space](https://www.latent.space) | 访谈作为作者观点与项目线索；能力和价格回官方来源核对 **[社区／二手]** |
| [Embrace The Red](https://embracethered.com) | 安全研究追攻击条件、版本和修复，单例不推总体发生率 **[一手：研究者报告]** |
| [METR](https://metr.org/blog/) | 读原始研究的方法、样本与局限；不同任务和模型不能直接外推，相关判断见 [09](09-review-and-quality.md) **[研究]** |
| V2EX、知乎、掘金、linux.do、Reddit | 发现额度、接入与协作问题；保存具体原帖和版本，不按用户量或热度判定共识。访问受限时记录缺口，不把摘要当原帖 **[社区；经验：读取边界]** |

## 2. 清单只用于定位候选

**👀 缺候选时查目录，选中后回原仓库核用途、许可、权限和维护。** 收录量、star 与市场身份适合帮助定位，不是安装整套配置的理由；按 [04](04-mcp.md)、[05](05-skills-and-plugins.md) 的条件选最小所需组件。此处为经验性筛选建议。

| 索引 | 用来找什么 |
|---|---|
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Claude Code 的分类资源 |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | Skill 候选 |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | 子 Agent 定义示例 |
| [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | MCP 服务候选 |
| [openai/codex Discussion #16329](https://github.com/openai/codex/discussions/16329) | Codex 社区工具线索 |

## 3. 入门与深入：阅读不等于采用

| 资源 | 什么时候值得读 |
|---|---|
| [Writing a good CLAUDE.md（HumanLayer）](https://www.humanlayer.dev/blog/writing-a-good-claude-md) | 需要整理项目指令时，结合 [03](03-context-engineering.md) 的加载和效果边界看 **[社区：作者经验]** |
| [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) | 想理解 Coding Agent 的组成时读实现；教学实现不等于生产配置 **[一手：项目源码]** |
| [zebbern/claude-code-guide](https://github.com/zebbern/claude-code-guide) | 查用法线索；命令和版本回官方文档确认 **[社区]** |
| [obra/superpowers](https://github.com/obra/superpowers) | 研究 Skill 衔接；先读 [24](24-community-workflows.md#2-superpowers重点看-skill-之间怎样衔接) 的采用条件与失败案例，不默认全局强制 **[一手：项目配置；经验：采用边界]** |
| [Martin Fowler：Exploring Gen AI 系列](https://martinfowler.com/articles/exploring-gen-ai.html) | 比较规格与开发流程的不同取舍，回自己的任务判断 **[社区：作者分析]** |

## 4. 需要额外工具时，先回主专题

**先诊断缺口，再决定是否加工具。** 下表沿用主专题的条件判断；尚未形成判断的工具仍作线索，不在索引里另给推荐。

| 具体问题 | 条件入口 |
|---|---|
| 多种 Agent 的配置重复维护 | 先按 [03 §2.1](03-context-engineering.md#21-各工具的加载规则一手)确认实际加载；确需多工具生成配置时再评估 rulesync，生成成功不等于客户端已加载 |
| 指令冲突、上下文负担或 Skill 调用异常 | 先核实际加载内容，再用目标宿主可用的诊断入口，见 [09 检查清单](09-review-and-quality.md#4-实践清单)；诊断不证明效果，不默认安装额外 linter |
| 不清楚费用为何增加 | 先核计费口径、额度与任务成本，见 [02 成本控制](02-models-and-cost.md#3-订阅额度与成本控制)；本页不默认执行日志分析工具或增加观测栈 |
| 计划或评审没有暴露实现问题 | 先按 [09](09-review-and-quality.md) 和 [24](24-community-workflows.md#4-humanlayer从研究与计划到把人的评审重新放回来) 检查证据与接口假设；需要的是可验证反馈，不因存在图形工具就加一层 |

## 5. 什么变化值得继续跟进

**把新线索落到一个未决问题，只补会改变选择的证据。** 沿 [25 AI 探索](25-ai-exploration.md) 的路径处理：**决定什么 → 已有证据 → 还缺什么 → 下一次查证与停止条件 → 采用／改造／自建／放弃**。先复用同任务材料，每条线索无需另建完整报告、加独立核查者或比较三家产品。

| 触发变化 | 下一步 |
|---|---|
| 升级或遇到具体阻塞 | 核目标版本的 changelog、文档与实现；把改变采用、使用或撤回判断的变化写回主专题，动态入口见 [13 前沿雷达](13-frontier-radar.md) |
| 发现新文章、工具或帖子 | 先回答它改变哪项选择；有具体未解问题才保留待验证入口，只有名称、宣传或热度的材料不进入推荐 |
| 配置事实变化或出现失败反例 | 复核实际加载与结果，按 [03](03-context-engineering.md) 和 [09](09-review-and-quality.md#3-给自己的-ai-配置做评估) 决定保留、缩减或撤回；少用不等于无用，定期检查也不要求增加新闻或插件 |

**按实际回答的问题更新状态。** 读完原文／源码可关闭资料问题；净收益、真实质量或长期维护没测，就保留这些未决问题。抓取失败记未核实，工具结束后仍要核目标结果。

以上是经验性阅读维护方法（原方法记录 2026-10-15），不刷新历史研究的日期或验证范围。后续候选见[研究队列](research/BACKLOG.md)；页末记录保留原日期、来源与勾选，不作为当前推荐、最新状态或执行承诺。

<details>
<summary>历史读取与待验证线索（保留原核查范围；需要追溯时展开）</summary>

## 5.5 历史调查入口（2026-10-10）

2026-10-10 调查的入口与固定来源见 [24 社区工作流](24-community-workflows.md)：Superpowers、Matt Pocock Skills、HumanLayer、Pi、Aider、OpenHands、Spec Kit；另读取了 Superpowers 的失败 Issue、Pi 使用者 Discussion、BAML 与 Ghostty 的公开 PR。按“具体做法—证据—限制—怎样试”整理，而不按 star 排名。

官方规范和运行时补核见 [来源记录](research/2026-10-10-audit.md)：Claude Code 2.1.295–296、Agent Skills、Gemini 行为评估和记忆、Codex app-server、MCP 2026-07-28、Python Agent SDK、Playwright MCP。

**本轮以文档/源码调查为主**；pi-trim 另做了离线检查及数据复算，没有模型效果重跑。研究现以 Codex 为主、Claude Code 为辅，其他项目提取思想；下一步见 [长期队列 R15](research/BACKLOG.md)。本轮 HN、Lobsters 网络受限，历史读取记录不作为本轮新证据。

## 6. 历史读取记录与待验证线索

“本轮”“已完成”均指所在条目的历史日期；本次索引整理没有重新读取、执行或补勾。原核查范围如下。

### 6.1 新线索怎样进入判断（2026-10-15）

此处保留方法设计与检索先导的原始状态；新增线索的处理路径已并入[第 5 节](#5-什么变化值得继续跟进)。

- [x] **2026-10-15 M6 资料与方法设计**：决定如何把外部探索变成采用判断；已核现成研究系统与评测的公开材料，完成三类纸面走查，见 [25](25-ai-exploration.md) 与[证据记录](research/2026-10-15-exploration-evidence.md)。采用需求卡、决定性证据核查和生成交接；不把此项关闭解释为模型效果通过。**[一手／研究；经验：设计]**
- [x] **2026-10-17 M6 三题检索先导**：普通检索与显式反向查采用／问题原帖均找到相同的资料支持路径，未改变首选；见[结果与采用决定](research/2026-10-12-experiment-records.md#三题检索先导实际结果与采用决定)。沿用普通检索，候选、采用依据或维护风险有缺口时才扩渠道。三题为合成需求、每路一次，未接入候选，不证明策略普遍无效或整套方法有收益。**[本仓：公开检索先导与匿名资料核查，UTC+8]**
- [ ] **M6 方法在真实需求中的实际增益**：上述先导未验证整套方法、真实接入质量或长期收益，完整费用与逐候选复核成本仍缺。下一次由自然出现的真实未决需求和明确基线触发，先复用可比样本；不足时依 [22](22-agent-evaluation.md) 预注册并另获实验授权，不重考三题制造提升。没有目标收益或成本不可接受则撤回额外 Skill／核查层；当前不新增安装或运行。


- [x] **2026-10-13 SlopCodeBench 测量边界**：读固定官方 runner／题库和第三方审计，独立复核 Regression 分类、规格／反馈可见性，局部执行工作区复制函数及错误顺序断言。✅ 采用连续需求和失败转换分析，不据汇总榜选择 effort；[记录](research/2026-10-13-slopcodebench.md)包含固定链接、未取得的原始产物与未运行范围。**[一手；社区；经验：局部实测]**


- [x] VibeTunnel 的 Codex 移植后维护：已追到固定移植快照、贡献者所有权修复及修复的修复，见[来源记录](research/2026-10-12-vibetunnel-maintenance.md)。源码与历史 CI 已核对，运行结果仍为项目自述；未复测生产力或长期维护成本。

- [x] alchemy-utils 的 Codex 原型到真实 CSV 优化：已核对公开需求、人的架构修正、两版源码与历史 CI，见 [D4 来源记录](research/2026-10-12-alchemy-utils-evolution.md)；随后对端报告固定版本的 30 次 SQLite API 调用，本侧只读源码核查分批机制、未复跑，完整执行材料缺口见该记录；未重跑模型、性能或上游全套数据库测试，长期维护效果仍未知。**[一手：来源调查与源码核查；经验：对端运行报告]**

**2026-10-11 不同作者样本**：已选读 [simonw/research](https://github.com/simonw/research/tree/4f5f23ed56019c498baabe9063a646f50a386a73) 中 Starlette Skill/demo 与 Datasette prompt 研究，分析并入 [24](24-community-workflows.md)。不是 Codex 专属实测，也不是全部项目审计；博客本轮代理拒绝。需继续追有原始轨迹的案例。


**2026-10-11 官方 Cookbook**：已读取 GitHub 固定原文中的 ExecPlan、Goals、阶段流程与迭代修复，对实际选用及教学条件形成[独立分析](research/2026-10-11-codex-cookbook.md)。未执行付费修复流程，旧模型示例不作为 Astra 最新参数指南。


**2026-10-10 正向案例复核**：[Catalog Compare](research/2026-10-10-catalog-compare.md) 已从社区原帖追到固定源码，完成公开核心/导出测试和补充精确数值检查；浏览器与商业结果未实测。采用其可复核验收思路，不推断模型排名。


**2026-10-10 后续实读**：Codex #52555/#51670/#52345/#50771 已按[证据记录](research/2026-10-10-codex-continuity.md)分析；发现反例但不计总体故障率。OpenAI [skills](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431) 的 skill-creator 与 gh-fix-ci 已读，结论并入 [05](05-skills-and-plugins.md)；未安装。待追的是具备公开任务与改动结果的正向实践，以及这些具体问题的修复轨迹，不继续堆相似抱怨。


**2026-10-10 Codex 使用机制补充**：已读 [KPI 项目求助 #52835](https://github.com/openai/codex/discussions/52835)、[跨会话记忆 #52372](https://github.com/openai/codex/discussions/52372) 及 LSP/撤销讨论；分析并入 [Codex 专题](01-agents/codex.md)。前两项没有独立产品验证，记忆演示也不等于自动回忆。待继续寻找不同作者的使用记录，避免把同一回复者在两帖中的意见当成两份独立效果证据。

**2026-10-05 已完成**：读了 arXiv 原文（2602.11988、2606.15828、2607.27250、2601.20404、2608.25241、2607.04697 等）、METR 原始报告、GitClear 报告、官方榜单数据、Codex 官方文档、Cursor 官方页面、Unity 官方文档；读了 HN、Lobsters、V2EX 原帖。

**2026-10-08 第三轮已完成**：克隆阅读了 Epic 的 Unreal 插件和 Claude 官方插件市场清单；读了 Roblox Studio MCP 和 Blender Lab MCP 的官方文档；读了 GDC 2026 调查摘要和 Steam AI 游戏全量统计原文；读了 HumanLayer《Why Software Factories Fail》、Lilian Weng 的 harness 文章、Will Larson 的软件工厂实验、Scale X 审批数据、Cloudflare Clef 博客、Mistral Large 4 文档、Claude Code 2.1.292–2.1.293 changelog；读了 HN 上 Godot 禁止 AI 代码、AI 试玩、Dots、DeepSeek Harness、Wikimedia 等讨论。

**2026-10-08 第四轮已完成**：游戏分支压缩为“AI 与游戏开发的结合”；主干新增 [15 按任务类型的打法](15-task-playbooks.md)、[16 自建 Agent](16-building-agents.md)；读了 OpenAI DevDay 2026、Agents、Decisions、Codex SDK 官方文档，Claude Code 2.1.289–2.1.294 和 Gemini CLI v0.63 changelog，以及 Claude API 官方 Skill 中关于 Agent 设计和 Managed Agents 的说明。

**2026-10-08 第五轮已完成**：新增 [17 故障排查](17-troubleshooting.md)、[18 团队落地与治理](18-team-adoption.md)、Unity / Unreal 引擎基础；读了 Claude API 官方 Skill 中的模型行为与提示调整说明、GitHub Copilot 和 Cursor 的最新 changelog。

**2026-10-08 第六轮已完成**：在云端环境做了三组实测（[19](19-experiments.md)）；加厚了 [08 多 Agent](08-multi-agent.md)（两种立场的调和、子 Agent 配置、委派写法）、[09 评审](09-review-and-quality.md)（Code Review 数据、REVIEW.md、分层评审）和 [10 安全](10-security.md)（四个案例拆解、auto mode 误差、沙箱手册、CI 安全、Anthropic 的 SDLC）。

**2026-10-11 第七轮（Codex 与长程任务）**：按当前默认分支 `73905442` 盘点 86 个文件；重点读取 Codex 官方 AGENTS/Skills/Subagents/配置/安全文档及近期社区 issue，阅读 Superpowers、Spec Kit、OpenSpec、GSD Core、OpenHands SDK 的固定版本，见 [20](20-codex-long-horizon.md)、[21](21-agent-patterns.md)。新增可执行验收记录、Codex 模板及离线回归测试；没有安装这些第三方框架，也没有进行真实 Codex/引擎或收费模型对照。本文其余专题的旧核实日期不因此自动更新。

历史访问范围见[社区记录](research/2026-10-12-community-source-records.md#11-社区脉搏的核实范围)；UE MCP 已核资料见[工具链](../domains/game-dev/unreal/01-toolchain.md)，真实引擎验证仍后置。

**新增待验证**：
- [ ] Codex 模板在目标客户端上的加载、角色权限、技能触发与执行；本轮只做静态检查
- [ ] 真实引擎报告 schema 与通过/失败/取消状态；模拟引擎回归不能替代
- [ ] 长任务冷恢复、压缩、迟到 worker、未知外部副作用的真实运行对照
- [ ] 重做有原始工件留存的 E1–E3，隔离指令内容与长度的影响
- [ ] Hook 的完整路径语义与异常策略；当前模板只作部分编辑工具护栏，不是安全沙箱

**仍待验证**：
- [ ] 当前 Codex 项目的后续交付与维护：[Ra & Apep 与 KPI 案例](research/2026-10-12-codex-delivery-cases.md)已读原帖；前者由对端记录完成六场景本地浏览器对照，本侧未独立复跑，后者没有公开源码/具体故障，均未取得模型成本或长期维护效果，不把新帖当成新模型实验。
- [ ] HumanLayer/BAML 的长期收益：对端记录已核对原问题、双 PR 同起点补丁、原/回填计划与测试入口，见[案例复核](research/2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)；可支持具体位置选择与计划纠错分析，未运行 BAML、读取完整会话或取得发布后维护数据，不据此给 RPI 或当前模型提效结论。
- [ ] 项目知识与运行反馈对实际 AI Coding 的影响：官方 Playwright interactive/CLI Skill 与 Codex 迁移教程的指定段落已读，见[方向分析](research/2026-10-12-development-conditions.md)；真实任务收益、游戏原始运行轨迹仍待验证。未安装这些 Skills，未将官网教程当作效果实测。
- [ ] linux.do、知乎上的中文实践经验
- [ ] danluu《What's the best programming language for coding agents?》（当前网络策略拦截）
- [ ] 实测：Claude Projects、Codex Ultra 模式、Agent Teams 的成本和收益
- [ ] 实测：Superpowers 在中型项目中的效果与开销
- [ ] 实测：GLM-5.3 / Qwen 3.8 27B 配合 OpenCode 或 Pi 做日常开发
- [x] ~~实测：Claude Code 的 harness 开销（复现 Systima 的测量）~~：已在云端环境复现，见 [19](19-experiments.md)
- [ ] 实测：在本地机器（非云端会话）上重测 E1，区分云端额外工具带来的开销；`--bare` 模式下的最小开销
- [ ] 实测：E2、E3 扩大样本（更多任务、更多仓库、Opus），以及“更难的 bug”下指令文件的作用
- [ ] Godot 基金会博客原文（本轮只读到 PC Gamer 的转述）
- [ ] GDC 2026 完整报告 PDF（本轮只读了官方摘要）；Faros 完整报告（只读了公开摘要）
- [ ] TypeSafe Jev 的官方技术说明和独立评测（本轮只有二手报道）
- [x] ~~OpenAI Dots 的官方说明~~：已通过 learn.chatgpt.com 的 Markdown 版读到（在 URL 后加 `.md`）；openai.com 新闻页仍返回 403
- [ ] 实测：在 Unity 项目中做“Agent 可试玩”改造（状态导出 + 输入注入 + 场景加载）的成本和效果
- [ ] 实测：用决策模型（Clef / Strands Decider）做 NPC 决策原型，和行为树对比
- [ ] llmskirmish（Agent 可以玩的 RTS）、nunu ai（像素级游戏测试）的原文
- [ ] 实测：Unreal 模板脚本（`ue-build`、`ue-run-tests`）在真实 UE 5.8 项目上运行（本轮只用伪造的引擎测试过）；确认 `index.json` 的字段与真实报告一致
- [ ] 实测：UE 5.8 打包版托管 MCP 做自动试玩的可行性和性能开销
- [ ] Epic 官方的 UE 5.8 新闻页（unrealengine.com 对本环境返回 403，读的是论坛发布帖和 dev.epicgames.com 的发布说明）；UE6 时间表的官方来源
- [ ] 团结引擎 2.0 与“团结 Codely”的官方资料（本轮只有媒体转述）

</details>
