主线：二为主，兼四
改变的建议：24：原生能力足够时保持轻量，拆开领域知识与控制步骤；h3o 交付需核对目标环境与范围
新证据：10-10/11 来源资料在 10-12 迁移：Skill 配置、社区首帖、h3o 固定产物；不是 10-12 新效果研究。工具逐项概述和重复问题可删减，独有来源保留

# 社区工作流：固定来源与案例资料

> 资料迁移：2026-10-12。以下承接 [24 正文](../24-community-workflows.md) 中尚无独立研究页的配置阅读、原帖范围、Starlette/DSPy/h3o 案例和待核问题，保留原记录的日期、精确数字与反证；迁移没有重新运行上游或模型。
> 调查时间：原配置与社区调查为 2026-10-10，h3o 于 10-11 补核。HN Algolia 与 Lobsters 请求被网络代理拒绝，社区样本来自 GitHub，不代表整个开发者群体。
> 已有专页的完整资料继续在 [BAML/HumanLayer](2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)、[SlopCodeBench](2026-10-13-slopcodebench.md)、[alchemy-utils](2026-10-12-alchemy-utils-evolution.md)、[VibeTunnel](2026-10-12-vibetunnel-maintenance.md)、[Ra & Apep/KPI](2026-10-12-codex-delivery-cases.md)，不复制成另一套案例记录；这些页保留本侧/对端的执行归属。

## 2. Superpowers：重点看 Skill 之间怎样衔接

本轮直接读了 brainstorming、writing-plans、subagent-driven-development、systematic-debugging、verification-before-completion 等文件。**[一手：项目配置 C1]**

它的具体做法包括：

- 需求不清楚时先访谈；当前 brainstorming 也明确允许简单清楚的任务直接执行、用户要求跳过问题时继续做。
- 计划写清文件、接口和验证，按能够独立验收的任务拆分。
- 每个实现任务可用新的子 Agent，上下文由调度者准备；任务完成后检查规格与代码质量，最后检查整条分支。
- 调试先复现、查最近变更、跨组件收集证据，再针对假设修改。
- 宣称完成前读取当前验证结果，不以 Agent 自述代替证据。

### 社区暴露的两个失败模式

**Issue #2470：计划里的代码与测试共同带着盲点。** 发帖者报告，在两个项目约十个任务中，实现者照计划复制代码，评审者又按同一计划检查，导致一些授权、空值和异步边界问题漏过。提出的改进是针对每个风险做反例探测，并检查与未修改代码的交界。**[社区：原帖，发帖者自述，未独立复现；C8]**

**Issue #2450：修改了接口，却没有更新尚未执行的计划。** 发帖者描述某次修复收紧了脚本参数，代码修对了，后续任务的文本仍引用旧调用方式。建议修复接口时搜索剩余计划和待派发 brief，更新调用契约。**[社区：原帖，未独立复现；C8]**

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

**OpenHands 当前主仓库的 Agent Canvas**：支持本地/远端后端、不同 Agent、定时和 webhook 自动化；自托管文档明确能访问 agent server 的人可以借它操作机器。因此“常驻”带来的是触发、运维和权限管理责任，不能只看长时间自动运行的演示。**[一手：C6]**

**Spec Kit 当前文档**：新功能 SDD、bug 修复、想法评估是独立入口；修 bug 不必先走整个 SDD，最终区分 `verified`、`partial`、`failed`。这比把任何小改动都塞进完整规格流程更值得学习。**[一手：C7]**

## 7. 真实人类仍在承担的工作

Ghostty 的 [PR #8289](https://github.com/ghostty-org/ghostty/pull/8289) 中，维护者 Mitchell Hashimoto 一边说明自己使用 AI，一边要求贡献者披露 AI 使用，强调贡献者应能审查生成代码，尊重接收方的评审与维护时间。该 PR 页面显示已合并。**[社区：维护者原帖；一手：PR 状态；C9]**

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

优先沿着具体问题追踪，而不是按 star 排名继续堆项目：

- [ ] 对比完整流程与单个 Skill：同一批小修复/跨模块任务，计入人工打断和评审时间。
- [ ] 跟踪 #2450/#2470 的维护者回应、修复与回归用例，确认用户建议是否真正进入实现。
- [ ] 读取 Orbi 的源码及帖子链接的交付链，检查 reviewed-head、重试和发布边界。
- [x] 离线复算 pi-trim 的原始对照；[记录](2026-10-10-pi-trim.md)区分作者数据、离线执行与未验证的因果。
- [ ] 在真实仓库比较 repo map、LSP 与普通搜索；记录遗漏和维护成本。
- [ ] 网络可用后补 HN、Lobsters、V2EX 的原帖与反方反馈，避免只采样工具作者的成功叙事。

每个候选最终都应产生“适合什么任务、如何试、什么证据算有效、何时放弃”，而不只是新增一个链接。
