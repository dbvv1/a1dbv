主线：二为主，兼四
改变的建议：文件排除须确认有效 profile 与实际入口，不能据关闭状态放行；原生能力足够时保持轻量；普通文档先自审，只为具体遗漏按次保留独立检查；h3o 交付仍须验目标环境与范围。[经验]；历史口碑不支持默认双工具采用，撤下未核商业消息迁移理由。[研究]；社区体验不支持统一降档、手写必需或低迁移成本，额度六折只保留作者自述。[研究]；Pi 只对愿维护扩展与隔离者试用，Aider 暂缓限依赖持续适配的新项目。[研究]
证据摘要：Codex 文件排除的固定实现、发布祖先关系、历史入口反例及当前配置优先级；固定 Skill 配置及 Superpowers 撤回文档评审循环的补丁、维护者成本自述；h3o 产物与作者本机反馈。配置不证明净收益，h3o 的宽兼容声明超过验证范围；未新跑模型。[一手／社区] 两串 HN 完整原帖显示任务范围不同、跨工具检查无可追查修复与对照；只支持撤回泛化，不裁定当前工具优劣。[社区／研究] 本轮读取 HN 相关任务反例及 V2EX 完整回复，撤回未控制档位、任务和窗口的额度推广。[社区／研究] 2026-10-15 补核 Pi 固定默认工具／权限边界，以及 Aider 停更日期与 main 较新模型配置；均未运行。[一手]

# 社区工作流：固定来源与案例资料

> 资料迁移：2026-10-12。以下承接 [24 正文](../24-community-workflows.md) 中尚无独立研究页的配置阅读、原帖范围、Starlette/DSPy/h3o 案例和待核问题，保留原记录的日期、精确数字与反证；迁移没有重新运行上游或模型。
> 调查时间：原配置与社区调查为 2026-10-10，h3o 于 10-11 补核。HN Algolia 与 Lobsters 请求被网络代理拒绝，社区样本来自 GitHub，不代表整个开发者群体。
> 已有专页的完整资料继续在 [BAML/HumanLayer](2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)、[SlopCodeBench](2026-10-13-slopcodebench.md)、[alchemy-utils](2026-10-12-alchemy-utils-evolution.md)、[VibeTunnel](2026-10-12-vibetunnel-maintenance.md)、[Ra & Apep/KPI](2026-10-12-codex-delivery-cases.md)，不复制成另一套案例记录；这些页保留本侧/对端的执行归属。

## 2. Superpowers：重点看 Skill 之间怎样衔接

本轮直接读了 brainstorming、writing-plans、subagent-driven-development、systematic-debugging、verification-before-completion 等文件。**[一手：项目配置 C1]**

配置按任务清晰度选择访谈或直接执行，计划列文件／接口／验证，调度者准备子任务上下文，并检查任务和整条分支；调试先定位根因，完成须读当前验证结果。简单清楚的任务允许直接做，不应概括为强制全套流程。**[一手：C1]**

### 社区暴露的两个失败模式

**Issue #2470：计划里的代码与测试共同带着盲点。** 发帖者报告，在两个项目约十个任务中，实现者照计划复制代码，评审者又按同一计划检查，导致一些授权、空值和异步边界问题漏过。提出的改进是针对每个风险做反例探测，并检查与未修改代码的交界。**[社区：原帖，发帖者自述，未独立复现；C8]**

**Issue #2450：修改了接口，却没有更新尚未执行的计划。** 发帖者描述某次修复收紧了脚本参数，代码修对了，后续任务的文本仍引用旧调用方式。建议修复接口时搜索剩余计划和待派发 brief，更新调用契约。**[社区：原帖，未独立复现；C8]**

### 文档评审循环：实际撤回与按需保留

补核：2026-10-13 UTC。只读公开提交、测试与原帖，未运行模型；本段支持 05 §2.5 的窄建议。

- **固定撤回。** [e6221a48](https://github.com/obra/superpowers/commit/e6221a48c54141e0ef04adaea4895a8150fc57a1) 将 brainstorming／writing-plans 的独立 reviewer、修改与再派发循环改成同会话自审，检查占位符、规格覆盖和接口一致性；用户读规格的关口仍保留。**[一手：补丁]**
- **实际采用者的取舍。** [#1130 维护者回复](https://github.com/obra/superpowers/issues/1130#issuecomment-4270863186) 说明此前采用后收到用户负面反馈，自行评测未见结果改善，因等待和 token 成本拒绝恢复默认流程。[提案作者随后撤回上游推动](https://github.com/obra/superpowers/issues/1130#issuecomment-4275742384)，但保留自己复杂计划的按次独立检查，并承认没有反驳数据。**[社区：双方使用自述与决定]**
- **数值仍是自报。** 撤回提交说明报告五个版本共25次比较、约25分钟额外等待，quality scores 未见改善；本轮限定检索只找到摘要，没有逐次评分、用时和完整模型配置。共同署名不能确定全部运行模型，补丁又同时补强自审约束，不能据此计算当前模型净收益或宣称纯原生无 Skill 等价。**[一手：作者报告；研究：边界]**
- **公开测试不是该对照。** [同 SHA 的测试](https://github.com/obra/superpowers/blob/e6221a48c54141e0ef04adaea4895a8150fc57a1/tests/claude-code/test-document-review-system.sh) 只构造含 TODO／推迟说明的规格、调用一次 Claude 并检查输出，没有自审对照或上述评分表；本轮未执行。**[一手：测试阅读]**
- **当前仍保留窄的独立检查。** 固定 v7.0.0 的 [writing-plans](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/writing-plans/SKILL.md) 仍用自审，其 Native 执行路径仍含最终独立分支检查；[brainstorming](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/SKILL.md) 对书面设计采用单轮 builder check，找实施者还需确认的问题。这不是恢复通用审批循环，本轮也未证明其净收益。**[一手：固定配置]**

**采用判断**：先让同会话核对普通文档内容；发现实施者无法决定的具体问题，或独立检查确实补上遗漏时，再按次保留。只有通用意见与额外等待时可撤回该循环，仍保留必要测试与验收。这里的内容 reviewer 不是工具执行权限的安全 Auto-review，也不能替代或取消用户确认。**[经验：建议范围]**

复访需要逐次原始对照，或复杂真实计划中独立发现、修复与后续使用结果；不靠重复抱怨或更多字面检查扩大结论。**[研究：下一证据条件]**

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

旧正文把下列内容连成迁移理由：定价抱怨很多；2026-08 用量页和 CSV 移除费用；2026-06 SpaceX 以 600 亿美元收购 Cursor；2026-08 OpenAI 停止模型供应；转售 API 无法竞争官方补贴订阅，很多人因此转向 Claude Code／Codex。**这些仅记录此前撤回对象，不可整体当事实引用；收购完成与供模计划现已由下文一手资料补核，其他断言未因此恢复。**

旧来源只有 [Cursor 论坛总帖](https://forum.cursor.com/t/pricing-megathread-and-q-a/116395)，未逐项连接官方交易／供应声明、具体产品通知与可核对迁移者。此前未重做商业新闻调查，也未据缺证据判断真伪；先从正文撤回强断言，避免历史未核内容担当采用依据。以下补核替代其中已取得证据的缺口，仍不能依靠旧段整套推论决定迁移。**[研究：撤回原因与范围]**


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
