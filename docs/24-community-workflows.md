# 24 · 社区开发者怎样使用 AI：工作流、分歧与失败案例

> 调查时间：2026-10-10；h3o 于 10-11 补核，BAML、Codex 交付、alchemy-utils 与 VibeTunnel 连续变更于 10-12 补核；SlopCodeBench 于 10-13 追查。直接阅读相关源码、Skill 与社区原帖，固定来源见下文。
> **证据边界**：配置与经验帖不自动证明效率提升。另有本仓库浏览器对照及下述 SQLite 行为复测；没有调用模型做效果对照。
> HN Algolia 与 Lobsters 请求被网络代理拒绝，本轮社区观察来自 GitHub，不代表整个开发者群体。

## 1. 先看分歧：不存在一种适合所有人的工作流

以下评级是本仓库对**试用价值**的判断，不是项目性能排名。**[经验：选型判断，依据 C1–C7]**

| 路线 | 代表 | 人主要做什么 | 值得借鉴 | 代价与适用边界 | 评级 |
|---|---|---|---|---|---|
| 流程完整的开发方法 | Superpowers | 对齐目标、审设计与最终结果 | 计划、分任务执行、验证与评审的衔接 | 与强 Agent 原生能力重叠时可能增加等待和成本 | ⛔ 暂缓全局强制；🧪 针对明确失败试用 |
| 小而可组合的 Skills | Matt Pocock Skills | 选择过程、定义领域语言与测试边界 | 访谈、术语表、ADR、公共接口测试 | 需要使用者判断何时调用，约定可能与现有团队冲突 | 🧪 按需试用 |
| 复杂仓库的上下文工程 | HumanLayer | 审研究、计划、架构与切片 | 先研究依赖再实现，有意识压缩和交接 | 前期阅读成本高；收益为作者案例，非普遍倍数 | ✅ 借鉴方法 |
| 可定制的轻量 harness | Pi | 自己决定流程并选择扩展 | 工具组合、可检查的会话与扩展 | 权限隔离与扩展维护由使用者承担 | 🧪 适合愿意定制的人 |
| 人在循环中的结对 | Aider | 选择文件、讨论方案、审 diff | ask/code、repo map、测试反馈 | 需要主动引导，文档里的旧模型建议需另核实 | ✅ 借鉴结对方式 |
| 常驻任务控制台 | OpenHands Agent Canvas | 管后端、触发器、权限和结果 | 多 Agent 后端、定时/事件驱动自动化 | 要负责服务运维与自动写入边界 | 🧪 有重复任务再部署 |
| 规格驱动与过程模板 | Spec Kit | 审规格、技术计划和验收 | 可追踪产物，区分新功能、修 bug、想法评估 | 文档同步成本；不能让形式上的一致代替功能验证 | 🧪 中大型改动试用 |

这些不是互斥阵营。可以用 Aider/Pi 风格的轻量循环实现局部任务，用一个 Skill 做系统性调试，在大功能上再采用规格与多阶段评审。不要把几套完整方法同时装进全局指令，让 Agent 面对相互冲突的流程。**[经验：工程建议]**

## 2. Superpowers：重点看 Skill 之间怎样衔接

本轮直接读了 brainstorming、writing-plans、subagent-driven-development、systematic-debugging、verification-before-completion 等文件。**[一手：项目配置 C1]**

它的具体做法包括：

- 需求不清楚时先访谈；当前 brainstorming 也明确允许简单清楚的任务直接执行、用户要求跳过问题时继续做。
- 计划写清文件、接口和验证，按能够独立验收的任务拆分。
- 每个实现任务可用新的子 Agent，上下文由调度者准备；任务完成后检查规格与代码质量，最后检查整条分支。
- 调试先复现、查最近变更、跨组件收集证据，再针对假设修改。
- 宣称完成前读取当前验证结果，不以 Agent 自述代替证据。

**值得照搬的是行为目标，未必是全部硬规则。** 例如“没有新证据不宣称修好”很有价值；但若代码和环境没有变化，不能机械地为每次回复重跑全部测试。子 Agent 也不是每个任务的默认最优选择，要计入上下文和审查成本。**[经验：工程判断]**

### 社区暴露的两个失败模式

**Issue #2470：计划里的代码与测试共同带着盲点。** 发帖者报告，在两个项目约十个任务中，实现者照计划复制代码，评审者又按同一计划检查，导致一些授权、空值和异步边界问题漏过。提出的改进是针对每个风险做反例探测，并检查与未修改代码的交界。**[社区：原帖，发帖者自述，未独立复现；C8]**

可操作的启发：评审不能只问“是否按计划实现”，还要问“计划的假设会在哪个输入下失效”。例如权限规则除了正常允许路径，还检查空值、其他账号和批量写入。不能据此推断项目所有版本都有同样缺陷。**[经验：工程建议]**

**Issue #2450：修改了接口，却没有更新尚未执行的计划。** 发帖者描述某次修复收紧了脚本参数，代码修对了，后续任务的文本仍引用旧调用方式。建议修复接口时搜索剩余计划和待派发 brief，更新调用契约。**[社区：原帖，未独立复现；C8]**

这是长任务中特别实用的一条：**尚未执行的计划也是接口的消费者。** 不只更新源码调用点，还要更新下一位 Agent 将读取的指令。**[经验：工程建议]**

## 3. Matt Pocock：控制权与领域语言

作者 README 自述每天用这些 Skills 做工程工作，主张小、可修改、可组合，反对流程工具过度接管。这是作者立场，不是对其他框架效果的客观裁决。**[社区：作者自述；C2]**

实际配置里值得研究的是：**[一手：Skill 文件 C2]**

- `grill-with-docs` 组合访谈和领域建模；README 解释术语表与 ADR 如何降低沟通歧义。
- `tdd` 强调通过公共边界观察行为，不耦合私有实现，不写“用相同算法再算一次期望值”的同义反复测试。
- 一次实现一个纵向行为切片，而不是先批量写完所有猜测中的测试，再批量补实现。

也要看不适合照搬的约定：当前 `tdd` 要求先与用户确认测试边界，并把重构安排在 review 阶段；这是一套特定协作约定，不是 TDD 的唯一含义。已有明确验收与授权时，不应因为引入一个模板而重复询问每一步。**[经验：工程判断]**

**最容易先尝试的改进**：把团队反复使用却容易混淆的 5–10 个概念写成短术语表，给每个术语一个代码位置或例子；先看下一次需求讨论是否更清晰，而不是先安装全部 Skills。**[经验：工程建议]**

## 4. HumanLayer：从研究与计划，到把人的评审重新放回来

《Getting AI to Work in Complex Codebases》描述 research → plan → implement 和 frequent intentional compaction：将搜索、理解与计划的结果压缩成下一阶段所需材料，并在人最能纠偏的地方审查。作者报告了在 BAML 上的实践。**[社区：作者经验原文；C3]**

### BAML 双 PR：研究帮助选位置，实施仍需纠正计划

2026-10-12 进一步追到原始 Issue、两个计划与 Git 对象：[无单独研究的 #2258](https://github.com/BoundaryML/baml/pull/2258) 和[使用研究结果的 #2259](https://github.com/BoundaryML/baml/pull/2259) 从同一个提交出发。前者在 parser-database 的 test visitor 中校验，除 `assert/check` 外还禁止其他属性；后者在已有 test validator 中只拒绝相关断言。维护者关闭前者、合并后者。**[一手：补丁、父提交与公开讨论；完整来源见下方复核]**

有研究的原计划也有错误：把测试属性放在 `args` 内部键值上；PR 中回填计划明确纠正，最终测试改为放在测试块的 `functions/args` 字段上。两个 PR 的自动评审都给了肯定意见。这里能学到的是定位合适的变更层次、控制范围，并允许实际实现反馈修正计划；不能概括为“只要先研究，再照计划执行就会成功”。**[一手：原/回填计划与测试；研究：采用判断]**

🧪 **按决策需要研究**：不知道应改哪一层、哪些旧行为必须保留时，先追调用链、现有约定和测试；已清楚的小修复无需额外长报告。这是历史单例支持的条件建议，不是 RPI 对当前强模型的净收益证明。“无研究”计划本身也有代码分析，完整会话、尝试预算与后续维护数据缺失，无法隔离流程因果或报告提速。见[详细复核](research/2026-10-12-baml-and-review.md)。

后来的《Why Software Factories Fail》自述减少读代码后的维护困境与重写，主张产品、架构、程序设计和切片评审；但早期文章已经强调人的深入参与与纠正研究。两篇文章不能压成“先完全无人、后来重新需要人”，BAML 外部贡献也不能与团队重写自动视为同一系统。**[社区：C3；研究：叙事校准]**

作者提出的训练解释也需分开判断：快速行为测试不足以代表长期质量，值得重视；由此推出“没有快验证器，所以模型学不会维护性、更多评审抬不高上限”，则缺少训练与因果证据。配套时间分析中的 50%/10%、前十分钟消除 80% 痛苦是明确假设示例，不是实测收益。**[研究：原文推理审查，来源和反驳见详细复核]**

### 前沿评估线索：连续需求比单题更接近日常维护

同一仓库的 10 月 SlopCodeBench 报告关注连续需求下的 Core／Strict 表现；每个模型/effort 一个 campaign，checkpoint 相关，费用和代码质量统计也有已披露缺口。报告正文并未将单次高 effort 结果解释为严格因果证明，标题“xhigh considered harmful”不宜直接变成配置建议。**[社区：实验报告 H/C3]**

**2026-10-13 追查后的判断**：固定 runner 的 Regression 按旧测试来源或 marker 分类，不要求以前通过；默认路径保留工作区、重置会话，只传当前规格，不自动提供隐藏评估反馈。这种任务形态有研究价值，但总失败数混合了持续遗漏与新增退化，不能直接代表真实仓库里保有文档和可执行回归时的维护能力。配置复核还发现题库 12/196 个 checkpoint 显式关闭自动纳入旧测试文件，不应笼统写每轮都覆盖全部旧测试。**[一手：固定源码；经验：配置计数；研究：解释]**

本轮从第三方审计线索回到原题，局部复现 meshctl 的两个限制：规格不要求错误顺序，断言却只接受 24 种排列中的一种；测试复制函数遗漏普通拆分模块，两个原本成功的合成程序中，模块版复制后无法导入。没有模型产物可判断已发表分数受影响程度，也没有据此接受第三方全部缺陷统计。详见[原始证据与复现范围](research/2026-10-13-slopcodebench.md)。**[经验：局部执行；研究：限定判断]**

✅ 借鉴连续需求与行为保留的评估方向；先查失败转换、可见信息和判定器，再决定提高 effort、补知识或改工作流。不能用这份汇总榜证明当前 Astra 不会维护，也不能反过来用夹具缺陷宣布模型表现没有问题。原文表中 32 与 29 相差 3、文字却说 2 的不一致仍保留，不复述该排名差额。**[研究：采用判断；经验：算术核对]**

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
| **pi-trim，10 月 1 日** | 删除有限的 harness 样板文字，保留项目规则与工具 schema，提供 diff；作者报告一组十题对照输入减少但费用估计反而增加 | token 减少不等于省钱；缓存、工具定义和定价口径要一起记录。已完成[离线复算](research/2026-10-10-pi-trim.md)，未重跑模型任务 |

这些具体案例比“多装几个插件会更强”更有用：它们给出了配置思路、运行边界和可被检验的失败条件。

## 6. Aider、OpenHands、Spec Kit：三种不同的控制位置

**Aider 的结对方式**：用 `/ask` 讨论，`/code` 编辑；`architect` 让一个模型提出改法、另一个负责具体编辑。repo map 给出重要符号与签名，实际变更时只加入相关文件；`/test` 或配置的自动测试将真实错误送回模型。**[一手：项目文档 C5]**

适合借鉴的是人随时缩小范围、提供错误和审查 diff 的短循环。文档仍包含较老的模型例子，本轮只引用工作方式，不把 README 的模型列表当成当前最佳推荐。**[经验：选型判断]**

**OpenHands 当前主仓库的 Agent Canvas**：支持本地/远端后端、不同 Agent、定时和 webhook 自动化；自托管文档明确能访问 agent server 的人可以借它操作机器。因此“常驻”带来的是触发、运维和权限管理责任，不能只看长时间自动运行的演示。**[一手：C6]**

**Spec Kit 当前文档**：新功能 SDD、bug 修复、想法评估是独立入口；修 bug 不必先走整个 SDD，最终区分 `verified`、`partial`、`failed`。这比把任何小改动都塞进完整规格流程更值得学习。**[一手：C7]**

## 7. 真实人类仍在承担的工作

Ghostty 的 [PR #8289](https://github.com/ghostty-org/ghostty/pull/8289) 中，维护者 Mitchell Hashimoto 一边说明自己使用 AI，一边要求贡献者披露 AI 使用，强调贡献者应能审查生成代码，尊重接收方的评审与维护时间。该 PR 页面显示已合并。**[社区：维护者原帖；一手：PR 状态；C9]**

由这些材料可提炼出几项可以迁移的实践，而不是统一的“人类开发者都这样做”：**[经验：综合判断]**

- 人确定什么值得做、什么算完成，以及哪些风险不能靠演示掩盖。
- 在实现前检查关键假设、接口和领域词汇；实现中用真实反馈纠偏。
- Agent 卡住时改变诊断材料、缩小问题或人工完成一步，不只重复“继续”。
- 把可反复执行的知识变成测试、脚本和短 Skill；对失败记录同样认真。
- 发布或贡献时交付可解释的改动与证据，不把生成成本转嫁为别人的理解成本。

快速原型可用“真实场景 → 一条可运行路径 → 亲自试用 → 可复现反馈”的短循环。处理真实用户、数据或收费前，再补权限、持久化、故障恢复和回归验证。不要把每个原型都升级为完整流程平台。具体任务方法见 [15](15-task-playbooks.md)，对照方法见 [22](22-agent-evaluation.md)。

### 本仓库判断：强 Agent 的默认基线应更轻

如果 Codex + GPT-6 Astra 在你的任务上已经能自主规划、谨慎修改并实际验证，我不建议默认叠加完整 Superpowers。理由是能力重叠：新访谈、细化计划、任务交接与多轮评审可能没有覆盖新的失败模式，却增加串行等待、重复上下文和人工打断。**[经验：条件判断，未做该组合的对照实测]**

| 任务与已观察到的问题 | 采用判断 |
|---|---|
| 目标清楚的小修复，现有 Agent 已能完成 | 直接执行并做相关验证；不增加全套流程 |
| 文档/配置修改，被访谈和计划拖慢 | 缩短前置阶段，保留有实际作用的检查 |
| 经常做错需求 | 试一次短需求对齐；不因此增加多轮代码评审 |
| 经常猜修复或谎报完成 | 只引入系统性调试或当前验证证据要求 |
| 跨系统改动，错误假设代价高 | 前置研究、关键接口审查；按需要增加独立验证 |
| 有明确可分任务且上下文拥挤 | 再考虑子 Agent，连同整合成本一起算 |

这是我的采用建议，不以“缺少全面实测”为由回避取舍；但也不把建议伪装成已证明的性能结论。模型名称本身不能说明每个工作流都可靠，必要验收仍要保留。

评价净收益要看完成质量、总耗时/费用、人工打断和返工。可以比较原生工作流、增加单项 Skill、完整流程三种方案。若质量相同而后者更慢更贵，它对该任务就是负收益；不能用“过程更规范”掩盖这个结果。**[经验：评价原则]**

补读入口文件后，可以更具体地解释成本来源：[using-superpowers](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/using-superpowers/SKILL.md) 要求哪怕 1% 可能相关也先加载，采用极低触发阈值，并在 Plan 前安排 brainstorming。这与 Codex 原生 Plan 已包含探索与澄清存在功能重叠；是否实际重复取决于所装版本、任务与运行路径，未做组合实测。[官方 Skill 也可能带额外批准关口](05-skills-and-plugins.md#25-主力-codexskill-应补什么又可能增加什么)，不能只批评社区项目。**[一手；研究：采用判断]**

同时避免稻草人：本轮读取的 Superpowers 允许简单任务直接做，也有 inline 执行路径。应检查所装版本的实际触发情况，不把它概括成“任何任务都会强制全套流程”。用户采用率是否下降，需要另外的数据；本轮没有这样的证据。**[一手：C1 + 分析边界]**

### 不同作者的实践补充：把新知识交给 Agent，再检查实际产物

Simon Willison 的 [research 仓库](https://github.com/simonw/research/tree/4f5f23ed56019c498baabe9063a646f50a386a73) 保存异步 Agent 的研究产物，根 README 提醒报告多为 AI 生成，并尝试在 PR/提交保留提示和轨迹。因此它适合追到具体材料，不能把每篇生成报告直接当作作者亲自验证的结论。其博客本轮不可访问，只引用实际读到的 GitHub 文件。**[一手：仓库说明；研究：使用边界]**

[Starlette 1.0 Skill](https://github.com/simonw/research/tree/4f5f23ed56019c498baabe9063a646f50a386a73/starlette-1-skill) 保存了领域 Skill、一个短的应用需求提示和生成的任务管理 demo。这展示了一种值得试的分工：人明确要什么，Skill 补版本特定 API 知识，Agent 实现。正文约 1,300 行，触发描述也很宽；本轮只读部分内容与 demo 入口，未运行或验证所有 API，不能声称它比简短参考资料更有效。🧪 借鉴知识补充方式，按自己的框架版本提取需要的部分。**[一手/社区；研究：采用判断]**

同仓库 [DSPy / Datasette prompt 研究](https://github.com/simonw/research/tree/4f5f23ed56019c498baabe9063a646f50a386a73/dspy-datasette-agent-prompts) 报告优化后训练得分上升、留出集下降，并解释评分器误判“语义上的零”和并列第三名。保存的结果 JSON 只有汇总分数，不足以独立重算逐题表现；本轮没有重跑模型。✅ 借鉴“先审评估器，再优化提示”的问题意识，👀 不将这组旧模型、小数据结果外推到 Astra。**[社区：AI 生成报告；一手：文件检查；研究：判断]**

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

**✅ 采用**：给 Codex 明确产物与范围；将实际失败变成针对性约束；关键兼容性在使用环境核验。适合绑定、依赖升级、CLI 打包等任务。无需由此增加每步审批、全套访谈或多模型互审；作者另用 Gemini 生成 API 文档，但原帖不能证明该步骤改善了最终绑定质量。**[经验：采用判断]**

### 2026-10-12：当前 Codex 的交付与使用案例

**Ra & Apep：用原生链接补足无脚本路径。** [作者 #51298](https://github.com/openai/codex/discussions/51298) 报告用 Codex 改进互动故事网站。[PR #2](https://github.com/o1tean/ra-and-apep/pull/2) 将重启按钮换为锚点并删除 JS 点击处理器。本轮独立获取固定前后提交，在本地 Chromium 运行无 JS、动画、静态三种模式：旧版无 JS 时点击不动，新版回到开头；其余四个启用 JS 的场景均可导航，且都通过原有 12 项滚动计算自检。**[社区：使用过程；一手：补丁；经验：六场景功能复测]**

✅ 借鉴的是把产品承诺转成相应运行状态的检查，并考虑平台原生功能能否减少自建逻辑；不是要求所有应用无 JS 可用。未全面验视觉、手机、系统 reduced-motion 或线上部署，也未复跑模型。原帖的一个反馈者明确自称由人运营的 agent，不能把所有评论算成人类使用研究。固定版本、操作与实际结果见[详细记录](research/2026-10-12-codex-delivery-cases.md)。

**KPI 项目：代码产出与可接管的系统之间仍有距离。** [#52835](https://github.com/openai/codex/discussions/52835) 作者自述不是开发者，为约 25 人做系统三四个月，已有代码、测试与文档，却没有可靠端到端应用，也不确定代码与部署是否一致。其约束包括现有 Microsoft 365 许可、员工数据与非技术人员维护。**[社区：自述，未取得源码与具体故障]**

🧪 此时优先调查当前部署版本及一个最小业务闭环，再判断修复、简化或平台选择；不能仅凭工具列表推荐重写。对 AI Coding 的研究也应包括“现有产品能否满足需求、谁承担维护”，而不只优化生成过程。这是本仓库的条件建议，尚无作者执行后的结果。同期 [#53079](https://github.com/openai/codex/discussions/53079) 的通用工作流建议和产品推荐缺少效果记录，不把它们当成已验证方案。**[研究：取舍]**

### 从原型到第二次修改：alchemy-utils 的真实 CSV 改变了什么

**✅ 采用：把实际输入规模与必须保留的行为一起交给 Codex；🧪 按已出现的变化调整局部结构。** 适合原型已经能运行、但真实使用暴露新约束的任务。不必先重写整个项目，也不能把首次测试通过当成性能或长期维护证明。**[经验：采用判断]**

Simon Willison 在 2026-08-12 用 Codex／GPT-5.6 Sol Ultra 探索一个基于 SQLAlchemy、兼容部分 sqlite-utils API 的跨数据库工具。这里能追到同一项目的初始需求、人的架构纠正、CLI 扩展和发布后的性能修改，而不只是一次成功截图。其模型信息和使用经历来自[作者原文](https://simonwillison.net/2026/aug/12/alchemy-utils/)；不是当前 Astra 的效果对照。**[社区]**

1. **先证明能做什么。** 原始需求指定 insert/upsert、建表和内省，要求 SQLite、PostgreSQL、DuckDB 测试，并提供已有 sqlite-utils 和 PostgreSQL 测试项目作参考。运行中出现 DuckDB 主键／JSON 反射差异后，人明确要求把各引擎的可移植性逻辑放进各自文件，建议使用 Database 子类；[`768c090`](https://github.com/simonw/alchemy-utils/commit/768c090145d57ce4e71d1b36a2fca29a7425d5f7) 随后引入 per-engine modules。人又追加可用 CLI，形成 0.1a0。这不是预先一次写完规格，而是已有结果暴露下一步需求。**[社区：公开对话；一手：提交；完整定位见来源记录]**
2. **真实使用改变取舍。** 作者报告用 CLI 把旧金山树木 CSV 导入 DuckDB，首次接近一小时，于是要求 Codex 优化，后来约 35 秒。初版源码确实把输入变成列表并忽略 batch_size，README 也把它列为有意保留的 spike 限制；不能倒写成一开始就违反需求。性能要求出现后，这个取舍才需要改变。时间是作者自述，本轮没有复测，也没有每项改动的消融数据。**[社区：时间与触发；一手：初版及补丁]**
3. **保留边界，改变执行方式。** [`e3b8d03`](https://github.com/simonw/alchemy-utils/commit/e3b8d03e040867b256aeff7db322a0b0eb1f8b06) 将 CSV/TSV 读取改成迭代器、真正按 batch_size 分批，减少主键重复内省；DuckDB 缺 pandas 时的临时缓存处理放进此前形成的引擎子类。共享层仍管理批次；`alter=True` 或新表的非流式输入仍全量扫描以推断列。这展示了早先边界在第二次修改中被复用，不能量化它节省了多少时间；多项优化一起发生，不能把整个速度变化归给某个技巧。**[一手：代码；经验：解释边界]**
4. **检查新方式有没有破坏旧承诺。** 补丁新增已创建表上跨批次重复主键失败后表仍为空、第三条记录读取前已有插入、非流式新表能发现后续记录新列、主键只内省一次等测试。它们检查具体行为，而非只比较耗时。0.1a1 的[历史 CI](https://github.com/simonw/alchemy-utils/actions/runs/31662692544)显示 Python 3.10–3.14 五个 job 成功；本轮读到的 3.10 日志为 178 passed、1 skipped，跳过项对应 DuckDB 不支持的 partial index。没有据此宣称所有行为或平台都已覆盖。**[一手：测试、CI 状态及日志；未本地重跑]**

**仍有代价。** 0.1a1 的 [README](https://github.com/simonw/alchemy-utils/blob/c2432fb580317dd6a8cdf3e3451a2fc6a85631f7/README.md) 一处写 CSV 已分批，限制段却仍说 batch_size 未使用。代码变更已落地，旧说明没有完全同步。跨批原子性测试也不等于所有输入兼容：本仓库随后直接运行固定优化前／后源码，完成 SQLite 的 30 个合成调用，发现相同稀疏输入在新版 `batch_size=1` 时使用默认值／保留旧值，`batch_size=2` 时却写 NULL；显式 NULL、完整字段和全部缺失的控制情境结果稳定。原因是字段并集从全体输入变成逐批计算。应明确缺失字段的接口契约，再判断保留旧行为还是改变语义，不能把“更快”当作完整兼容；这不是作者 CSV 的性能复测。全局 `sys.modules` 的并发影响仍未验证。**[一手：文件差异；经验：本地 API 复测；研究：契约判断]**

**读者今天可做的最小改变：** 原型小样例通过后，选一个真实规模、可安全复位的输入和实际命令，补充哪些旧行为不能变，例如失败回滚、后续记录出现新列、默认值。让 Codex 优化这条路径并检查相关说明是否过期；已有清楚目标时无需先加完整 Skill 流程。若只运行一次、当前耗时可接受，保留简单实现可能更合算。这里新增的关键信息是使用规模和反馈，不是发现了某个必装框架。**[经验]**

[来源与未覆盖范围](research/2026-10-12-alchemy-utils-evolution.md)保留精确版本、公开对话范围和候选取舍；本例只有早期第二次修改，没有长期用户负担、人的主动时间或受控对照，不能据它证明普遍提效或长期可维护。

### 不同作者的后续维护：VibeTunnel 的内存所有权修复

**✅ 采用：跨语言移植保留外部契约，同时检查新语言里的所有权边界。** 适合从垃圾回收语言迁到手工管理内存的组件；不是要求所有迁移都重写架构或增加全套评审流程。**[经验：采用判断]**

Peter Steinberger 在 [2025-12-28 复盘](https://steipete.me/posts/2025/shipping-at-inference-speed)中报告：此前搁置的终端转发器转换，后来由 Codex 经五小时以上运行完成。原始会话未取得，具体模型与人的主动耗时未知；不能把周围的模型讨论当作这次运行的精确配置。文章链接的 [`a81b29e` 快照](https://github.com/amantus-ai/vibetunnel/tree/a81b29ee3de6a2c85fd9fa41423d968dcc000515/native/vt-fwd)和计划保留了目标：降低每会话延迟／内存占用，使用独立 Zig 进程，继续通过 session 文件和 IPC 与 Node 服务交互。这说明一次原先未完成的改造有了可追查产物，不证明已达到性能目标。**[社区：作者经历；一手：固定产物]**

后续变化值得看的是一个具体边界，而非“AI 代码后来有 bug”：**[一手：源码／提交；社区：故障报告]**

1. **移植快照已有的遗漏。** `detectGitInfo` 返回仓库／分支字符串的切片，却在返回前释放相应内存；调用者再把切片放进 `SessionInfo` 写入文件。源码可确认生命周期不匹配；这里只定位到快照，不说 `a81b29e` 这一笔 diff 引入了问题。
2. **贡献者把故障变成所有权修改。** ndraiman 的 [PR #566](https://github.com/amantus-ai/vibetunnel/pull/566)于 2025-12-27 提交；仍可读的原始提交先去掉过早释放，再让 `GitInfo` 持有 arena、由调用者清理。原提交说明指出没有 upstream 的 Git 仓库会触发崩溃。这是具体外部贡献，不是博客作者重复自述成功；但账号署名不证明每行代码都由人手写。
3. **修复还要符合自己的清理契约。** 2026-06-11 整理后的补丁加入无 upstream 仓库测试；最后的 [`a48f1114`](https://github.com/amantus-ai/vibetunnel/commit/a48f1114e667a8bedd28d96e3d02f5ac482b9d5f)改从返回对象的 `info.arena` 取得 allocator，避免通过另一个被复制的 arena 分配、清理时却找不到那些分配。最终三文件修复已合并；外部 session／IPC 边界不需要随之重写。

**结果分开看。** PR 当前描述报告旧版本五次均崩溃、Zig 0.15.2 回归和原生 Linux E2E 通过；本轮未重跑。可独立读取的[精确 head CI](https://github.com/amantus-ai/vibetunnel/actions/runs/27350878910)只有变更检测成功，Node／Mac／iOS job 都跳过，不能用总状态代替运行证明。测试源码检查函数返回后的字段内容并清理 allocator，不等于完整会话或重复文件写入验证。十二月提交、六月合并也不是六个月的人工修复耗时。**[一手：测试及 CI；社区：执行报告；经验：边界]**

**读者可做的最小改变：** 让 Codex 沿“分配 → 返回 → 最后一次消费 → 清理”检查这一条跨文件路径，并把真实失败条件（本例为没有 upstream 的仓库）变成回归。既检查值还能读取，也检查资源确实释放；已有局部修法时先保留可用的外部契约。逐文件编译、同一个 happy-path 命令或再加一个通用 Skill，都不能替代这条语义检查。**[经验：由本例推导，不是收益对照]**

[固定来源与归属限制](research/2026-10-12-vibetunnel-maintenance.md)保留原始／重写历史、测试范围及未选线索。后来转成 Rust 的 PR 确实合并，但本轮已读材料未说明选择动机；不把它解释为此 bug 导致的重写，也不据它宣布 Zig 失败或 Rust 降低了维护成本。

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
- [x] 离线复算 pi-trim 的原始对照；[记录](research/2026-10-10-pi-trim.md)区分作者数据、离线执行与未验证的因果。
- [ ] 在真实仓库比较 repo map、LSP 与普通搜索；记录遗漏和维护成本。
- [ ] 网络可用后补 HN、Lobsters、V2EX 的原帖与反方反馈，避免只采样工具作者的成功叙事。

每个候选最终都应产生“适合什么任务、如何试、什么证据算有效、何时放弃”，而不只是新增一个链接。
