主线：二，额外能力何时值得加；三，连续修改仍然可靠
改变的建议：按不可猜的契约与可观察偏好选择短规格、测试或样品；只为会改变实现的未知事实定向研究；按原需求验收并允许实现反馈推翻计划。额外评审按具体漏审风险试用，重复意见或处理负担过高时收窄／撤回；先确认真实入口、计费和成功报告，再考虑 CI 门槛；跨仓修复须核实际依赖版本，不能只按本 PR head 判断复审覆盖。[研究]
新证据：10-21 P38补维护审计及保代码续做／摘要辅助独立重试的同题比较；P45补当前维护产物取舍、固定设计配方与贡献要求信息条件对照，未新跑模型；10-20新增存量安全审计的curl／Mozilla接收与降级反例，区分候选、人工补丁、发行及缺失回归回执；10-16新增 ComfyUI 目录 PR 的人工／机器人发现、作者确认、固定补丁与复审跳过／完成链；以下为既有证据汇总（日期见各节，非本次新增）：GIF 优化器原任务与固定实现、Anthropic 原型与评价反例、BAML 同起点双 PR、Superpowers 固定交接配置、Crossplane 选择性采纳与降强度记录，另有评审论文、Faros 指标核对及 10-14 官方评审入口／失败契约、SO 调查分母、模型客户引言、Cursor 当前计费、GitClear 公开图页的指标口径，以及 Intercom 原文、第三方集成固定来源与配置诊断／插件评估范围补核。来源分别是固定产物、参与者自报及研究；未证明完整流程或额外 reviewer 的净收益。[一手／社区／研究]

# 实现决策与评审：让原需求和运行反馈纠正计划

## P38：同题维护审计的配置比较

核实2026-10-21（UTC+8）。本段复用S05公开报告，比较对象是配置投入，不重复下节P45的产物收益。**当前整体最优未知**；[C05最高水平卡](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c05--模型与成本)的价表／重定价只能作基线，新增一手同题案例更接近采用问题，仍缺等待和人工总成本。[研究]

[Roim／OpenAI，2026-10-14](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family)报告在一个仓库指定子目录用同一提示审计过期实验，作者复核发现；原文标签和数字如下。费用包含研究子Agent与goal自动续轮，是该次标准API成本，不是当前报价、订阅配额或本账号数据。[一手：厂商作者报告]

| 配置标签 | 报告发现数 | 该次API成本（USD） |
|---|---:|---:|
| GPT-6 Astra Ultra | 142 | 109.06 |
| GPT-6.1 Sol Ultra | 131 | 15.12 |
| GPT-6.1 Sol Medium | 86 | 5.27 |

131/142≈92.25%，15.12/109.06≈13.86%。这只是数量／费用比：真值总集、交集、拒绝数及重复试验分布未公开，不能算召回、正确率或“只漏11项”。作者指出部分差异是作为其他flag依赖的常量flag；没有证明补提示后差距已消失。[一手；研究：算术与边界]

可行默认是先用现成入口做小范围、可人工核验的初筛；覆盖重要间接依赖时直接比较更深投入与强模型。是否保留看有效覆盖、等待与核查负担，不按发现越多越好。更强档无新增价值就保旧配置；现成工具足够也不加模型。主建议唯一归[02](../02-models-and-cost.md#同题维护审计低成本起点不等于相同覆盖)。[研究：采用]

公开提示省略细则，模型快照、执行顺序、子Agent具体配置和完整人工工时缺失；标签不提供CLI参数映射，Ultra结果不替Light／high背书。P38修复／跨层修改／质量优化三类实际对照仍未完成；本段没有新模型运行，Datasette安装403与本地连接阻塞没有重试或换路。[研究]

独立复核：全新上下文审阅本次四文件增量及公开原文，限定通过；报告标识 `p38-public-config-independent-review-20261021`，SHA-256 `dc1312e6bd6a2ed227a400e5c86cb15768f820ba4c9d30ab148c913a818934b8`。范围仅本节证据与采用边界，不是模型复测；最终树离线另验。

### P38补充：未完成与诊断失败，选择不同的再投入

核实2026-10-21（UTC+8）。**最高水平卡**沿[C05](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c05--模型与成本)的整项交付／投入标准：问题是额外推理怎样变成有效修复；领先候选为Microsoft等的LoopsBench（8-10 v2）残余需求续做、Meta等Kim团队（4-16 v1）的PDR＋RTV轨迹摘要选择与再生成。参照是原生单Agent继续任务，采用率未知；本仓推荐属可行默认，不宣称当前整体最优。[研究]

**保代码续做，对照执行到第一段结束。** [LoopsBench表2](https://arxiv.org/html/2608.00267v2#S3.SS1)在112题中报告Opus4.7／Claude Code的完成率16.96%→25.00%；各配置主结果一次trial。附录Q说明续轮保工作区、换shell；附录F的任务预算为2–24小时，不是日常短题。反例：附录M的无外层续做PR序列子集29题，最优仅3.45%，不能把整体提升当维护链已可靠。附录J只给续做臂token，不能算两臂增量费用。此处支持试续做，不推同预算优势。[一手：论文§3.1、附录F／I／J／M／Q；研究]

**换重试输入，而非沿同一失败判断反复执行。** [PDR＋RTV表1](https://arxiv.org/html/2604.16529v1#S3.SS2.SSS2)在随机100道SWE-bench Verified题、每题每轮16条rollout中，Sonnet4.5的初轮平均通过率为69.87%；次轮只用各自旧摘要为70.87%，随机四摘要75.06%，筛选四摘要78.06%。这是跨题／rollout的平均，不是100题各选一个补丁的成功率，也非仅对首轮失败题统计。§2.1明确次轮用新容器，继承的是经验而非代码；表2中四份前例都错时仍难修复。完整费用未给出，不据次轮步数下降称整项更便宜。[一手：论文§2.1、§3.2.2表1／2；研究]

**采用决定**：主建议归[02](../02-models-and-cost.md#任务没做完先续做还是另开候选)。有效代码仍可承接确定需求时先续做；重复错误诊断才窄试独立候选，并用实际代码／测试选择结果。摘要和模型投票帮助探索，不是验收。上述研究不能证明“两个候选”便复制16路研究效果，故不推荐照搬完整编排。未安装、运行上游或模型；P38三类真实对照及P44端到端验收仍未完成。[研究]

## P45：功能能跑以后，先改善哪种质量

核实：2026-10-21（UTC+8）；沿用审计[C11质量机会卡](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c11--前沿雷达)。**当前最高水平未知**，下面比较领先候选与可行原生起点，不把版本新、合入或作者自报当最优。主流采用率未测；每项都保现成工具起点、实际代价与撤回条件。[研究]

### 运行质量：先减少真实负担，不按清理量计成果

[Rodrigo Roim／OpenAI Core Experimentation，2026-10-14](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family)报告同产物维护前后收益，例如补缺失mock后63项测试由592.6秒到29.8秒；也承认有建议的复杂度不值收益。这是内部作者自报，无公开补丁SHA／分布／完整人工工时；测试数保留不证明覆盖不退步。[一手]

领先候选是Agent按运行证据发现小改动并由人取舍；可行基线是原profiler、测试和维护清单。推荐层是🧪试用：固定一项负担、相同输入和环境，比较行为、测量分布与新增维护项。没有可观察收益或只是删验收变快就保旧方案。唯一建议归[15§7](../15-task-playbooks.md#7-性能优化)，不从上述数字推当前模型收益。[研究]

### 体验质量：先给方向，独立反馈按缺口增加

Anthropic官方frontend-design在2026-09-03合入的[固定修订41bbe19](https://github.com/anthropics/skills/blob/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design/SKILL.md)要求按具体brief形成视觉选择、既定方向优先，并保响应式、键盘焦点和减弱动效等底线；这是可复用配方，未提供有无Skill质量对照。文件自身的[LICENSE.txt](https://github.com/anthropics/skills/blob/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design/LICENSE.txt)为Apache-2.0，复用与再分发遵其条件；本次未安装或复制配方。[一手]

[S02的2026-03作者实验](https://www.anthropic.com/engineering/harness-design-long-running-apps)把质量标准首轮作用与追加反馈分开，并报告中间版有时更好、复杂度增加。旧模型、任务及预算不同；不能据此固定5–15轮或默认完整harness。[一手：作者自报]

资料取舍为“原生已有要求”→“短设计方向／按需领域配方”→“针对缺失行为的独立检查”→“完整循环”；只增加当前确实缺的部分。前沿候选是明确质量标准并观察实际产物，可行默认仍复用项目组件和已有验证；当前同预算四路最优未知。人核真实任务与偏好，Agent实现并保旧行为；唯一主建议归[07](../07-workflows.md#已有界面能跑但还不像可交付的产品)。[研究]


### 交付质量：要求存在，不等于已送达或实际满足

[SWE-CC v1，Dang等，2026-10-05](https://arxiv.org/html/2610.06193v1)比较Native贡献文档入口与Consolidated本地全量政策；两条件都要求读规则，不是“无规则／有规则”。四模型平均合规指标在两scaffold提高8.7／8.8个百分点，功能解决率均值略降；触发政策集合也变化，不能当固定分母的净交付收益。它没有测试“当前任务短条件”胜过全量政策。[研究：原文；非本仓模型运行]

[固定源码02ee1f3](https://github.com/dangtruong01/swe-cc-arxiv/tree/02ee1f3c8db8768ab745ba6944de08cc3cadfee6)及[数据说明](https://github.com/dangtruong01/swe-cc-arxiv/blob/02ee1f3c8db8768ab745ba6944de08cc3cadfee6/DATASHEET.md)限定了信号：2026-08政策配历史任务，529／823项为近似checker，人工审计后未剔除被拒项；无全部历史轨迹可独立重评。合规率只计适用且可判定的政策，不是PR退回率，评分也不是merge-readiness判决。固定CSV复核为16格各500次；无判定与部分解析缺失保留，未重跑模型。[一手：固定数据／代码；研究]

领先候选是可追溯的政策送达与结果核查；可行默认仍为原生读取、现有确定性工具和人的接收判断。🧪 只有具体遗漏时，才补本任务适用要求并同时核功能；过时、重复或误报则撤回补充层。全量checker还需规则更新、轨迹适配和人工审阅，未公布完整时间／token成本对照，不据离线毫秒评分称整套便宜。唯一主建议归[18](../18-team-adoption.md#pr-准入与协作约定)，当前最高水平未知，不新增本仓审计机制。[研究]

### 本轮未纳入的候选

S04的提示／Skill重检已由05覆盖，未补新的产物质量对照；CodeThread既有固定证据不重复写作；基础设施噪声资料只提醒比较条件，不能解释本仓未知超时或作为扩容提质的默认。以上不是未查资料，也不凑成第四项机会。三项均为有范围的资料比较，没有本仓当前模型净收益实验。[研究]

七文件经全新上下文独审限定通过；原文、固定许可及SWE-CC数据范围已核。封版报告SHA256：`577fb975f4913ff5cab8059b22a326c10b1ba3a9915eded242135fc693e8b951`（只读报告身份，非下载链接）；完整离线入口另验，不把资料审查称模型实测。[研究]

## BAML：实现反馈纠正研究计划
> 整合自对端 `cdfe3b50be30579469af21b9fe46f62bfe7d786c`；下文“本轮／独立”均指原研究。本侧未重跑浏览器、BAML、模型，亦未独立取得上游Git对象证明同父关系。

> 核实2026-10-12（北京时间），2025年Claude Code历史案例。✅ 围绕实现决策调查并继续核验；🧪 有明确未知时前置研究，不默认完整RPI。已读原问题、双计划／PR、固定补丁、测试入口及作者前后文章；未运行BAML、模型或视频会话，不代表当前模型效果。

### BAML：实现反馈纠正研究计划 · 1. 先把作者故事拆成可核对的主张

HumanLayer 的《Getting AI to Work in Complex Codebases》报告：作者尝试修复 BAML #1252，首次研究错误地判定 bug 无效；他丢弃后重新指导研究，又分别运行无研究计划和使用研究结果的计划，提交 #2258 与 #2259。后者被维护者接受，前者关闭。作者认为两者都能解决问题，但有研究方案选择了更好的位置和测试方式。**[社区：S1 作者自述]**

公共产物可核事件和补丁差异；研究的因果贡献与时间收益仍缺过程／成本数据。

### BAML：实现反馈纠正研究计划 · 2. 独立核对到的同任务差异

原始 [Issue #1252](https://github.com/BoundaryML/baml/issues/1252) 要求：测试中误用单 `@assert` 应报 linter 错误。公开回复给出单 `@` 测试悄悄通过、双 `@@` 才执行预期断言的示例；本轮读正文与代码片段，未运行示例或查看截图内容。**[社区：原始报告]**

本轮获取 Git 对象并核对：两条最初实现提交拥有完全相同的父提交 `63f45d4b34b4682b297e024e5ac96b15030a2fcf`，比只比较两张 PR 截图更能控制代码起点。**[一手：Git 对象]**

| 项目 | 无研究路线 #2258 | 使用研究路线 #2259 |
|---|---|---|
| 最初实现 | `2c36444bc62115594f65c7fb0350eb6b8e1810cb` | `86029cc4dfd0ca081d3751d11b11e12a5b9d81b0` |
| 实际修改位置 | parser-database 的 `visit_test_case` | baml-core 的 test validator |
| 范围 | 拒绝 `assert/check`，并额外拒绝 `description/alias/skip` | 只拒绝测试字段上的 `assert/check` |
| 验证实现增量 | 38 行 | 18 行，含 import |
| 新测试 | 两个 `.baml` 诊断样例 | 两个 `.baml` 诊断样例 |
| 公共结果 | 维护者写“closing in favor of #2259”，关闭 | 维护者表示预计当晚发布；页面与 Git 显示已合并 |

表据完整diff与讨论 **[一手]**；行数仅定位差异。两路均未改语法定义，且基线 `visit_test_case` 已校验重复property／非法参数，不能将parser-database路线直接判为架构错误。

#2259沿用测试validator且少禁其他属性，范围更贴近原问题；这是源码比较判断，非维护者完整论证，也未证另一方案不能工作。**[研究]**

合并提交为 `f741e4319b4f95657a08e46f4404d258a1d91e5a`；相对其父提交，最终改动是三个文件、58 行。初始提交还带两份调查/计划文档，后续专门移除。独立比较确认三个实现/测试文件从 `86029cc` 到合并提交未变化。**[一手：Git diff]** 研究有价值不等于研究文档必须成为目标项目的永久内容；本案例只证明发生了移除，没有证据说明维护者要求移除。

### BAML：实现反馈纠正研究计划 · 3. 最重要的新发现：有研究的计划也在实施中被纠正

公开演示仓库保存的原始计划，把断言样例写在 `args` 内部的 `input/count` 键值上。PR 最初提交里的回填计划则明确写道：原计划假设测试参数能带字段属性，但它们是键值对；应检查的是测试块的 `functions`、`args` 字段。最终两个测试也确实分别把属性放在 `functions` 后、`args` 块后。**[一手：S2 原计划、S3 回填计划与最终测试]**

证据链为：作者自述纠正首次研究→研究选定位置→文档／测试显示实施纠错→PR与Git证明接收。计划的 `attr.name()` 最终适配为 `attr.name.name()`；未读完整会话，不归因具体工具或参与者。

保留位置选择理由与未决假设，允许实现反馈推翻计划；本例同时支持研究定位与局部纠错。**[研究：采用判断]**

### BAML：实现反馈纠正研究计划 · 4. 自动评审和测试记录能证明多少

两PR的Ellipsis均回“Looks good to me”，未公开区分方案；不据此判评审无用或解释维护者取舍，耗时／阅读行数也不是开发速度对照。**[一手：回执；研究]**

独立读合并版本的 `build.rs` 和 `validation_tests.rs` 后，可确认普通构建路径会递归生成验证测试；末尾注释被当作预期诊断，与实际诊断比较。设置 `UPDATE_EXPECT=1` 会改写预期，并返回而不走最后的失败分支。故更新快照是准备步骤，随后普通模式的检查才检验保存的预期。两份实际新增测试使用同一框架，不能把“有研究才采用仓库测试约定”概括得过强。**[一手：测试源码；未执行]**

复选框和PR“全测通过”仅为当时报称，命令文本不是运行日志；Codecov的23.07692% patch coverage因收集方法未核，不能判测试未跑或修复失败。

### BAML：实现反馈纠正研究计划 · 5. 这个对照仍然不能回答什么

同父不等于随机对照，仍有以下限制：

- “无研究”计划也分析过代码；先前调查、指导、执行顺序、采样和预算未隔离。
- 单次合并偏好不等于成功率；缺完整会话、主动工时、全部尝试及后续维护记录。
- 这个历史小bug支持位置选择，不证明当前强Agent采用完整RPI更快或更可维护。**[研究]**

### BAML：实现反馈纠正研究计划 · 6. 重读作者的后来复盘：哪里值得借，哪里不能跟随

WSFF自述团队从2025年7月少读代码后遇难题重写；早期ACE已强调读测试、纠正研究和团队理解，不能写成“早期不要人”，也不能把BAML外部贡献当作重写对象。**[社区：S1/S4；研究]**

WSFF从测试奖励与维护反馈慢推到“模型学不会、评审无法提高上限”，因果证据不足：

1. benchmark不代表全部训练信号；缺长期奖励不排除从代码／偏好学设计。
2. 生成困难不排除换输入、搜索或评审后识别更好方案。
3. 团队重写未隔离需求、模型能力与团队熟悉度等影响。

这些边界既不证明模型已解决维护性，也不支持harness不可能改善。**[研究]**

S5的50%／10%返工、十分钟消除80%痛苦及手写零返工均是假设，且混用概率与损失。**[一手：S5；研究：统计口径]**

“30分钟计划省几小时”“稳定快2–3倍”也缺可复算对照。应检验前置工作能否减少后续昂贵错误，而非固定时长或四阶段。**[研究]**

### BAML：实现反馈纠正研究计划 · 7. 对仓库方向的实际修正

研究以开发决策为单位：未知事实会改变实现位置、兼容边界或验收时才定向调查；只能通过运行回答时，短实现或探针可能比长报告更有信息价值，不另设审批关口。代码结构难改与人不理解系统是不同缺口，不能统一归为“技术债”后都加前置设计。**[经验：限定采用]**


### BAML：实现反馈纠正研究计划 · 来源与复核范围

- **S1**：[ACE 固定原文](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/ace-fca.md)。本轮重点读案例全过程、失败、人的参与和 mental alignment。
- **S2**：[演示产物目录](https://github.com/ai-that-works/ai-that-works/tree/738a9c18b0302737d5d354d9988f34482966cce6/2025-08-05-advanced-context-engineering-for-coding-agents/thoughts/shared)。完整读一个研究文件及有/无研究两个计划；不是完整会话。
- **S3**：[无研究提交](https://github.com/BoundaryML/baml/commit/2c36444bc62115594f65c7fb0350eb6b8e1810cb)、[有研究提交](https://github.com/BoundaryML/baml/commit/86029cc4dfd0ca081d3751d11b11e12a5b9d81b0)、[最终合并](https://github.com/BoundaryML/baml/commit/f741e4319b4f95657a08e46f4404d258a1d91e5a)、[PR 2258](https://github.com/BoundaryML/baml/pull/2258)、[PR 2259](https://github.com/BoundaryML/baml/pull/2259)。核对 Git 父关系、完整补丁、回填计划、相关基线源码、测试生成与执行源码及可见讨论；未运行 BAML/CI。
- **S4**：[WSFF 固定原文](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/wsff.md)。本轮读团队复盘、训练论证、评估与四阶段建议；作者披露经营相关协作工具公司，利益关系提示取样问题，不自动否定内容。
- **S5**：[Where does the time go](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/side-quests/where-does-the-time-go.md)，本轮完整读取。
- 本轮尝试读取 OpenAI harness engineering、StrongDM 工厂、Faros 报告原页，均被网络代理拒绝；它们在 S4 中的转述没有升级为本轮已读一手资料。GitHub API 和 PR `.diff` 入口亦受限，改用公开 HTML、raw 文件与 Git 对象取得上述材料，没有绕过权限或执行外部工作流。

## 后续任务：相同 brief 与过期接口
核实：2026-10-13（UTC+8）。本轮读取 GitHub 原帖、评论、固定源码与作者实验材料；未运行上游代码或模型。

### 后续任务：相同 brief 与过期接口 · 可以改变的建议

✅ 复用原请求、现有验收或已确认规格作为判据，不只把同一份计划摘要交给实现者和评审者。接口或行为约束改变时，让受影响的剩余任务失效并更新后再派发。简单任务已有充分检查时，不另写 spec、不增 reviewer；独立会话并不等于独立判据。**[研究：采用判断]**

### 后续任务：相同 brief 与过期接口 · 原帖与固定实现

[#2470](https://github.com/obra/superpowers/issues/2470) 报告计划内代码、测试共用错误模型：新用途 JWT 被旧登录验证器接受、字符串前缀检查与实际 URL 解析不一致等。它指向未改代码接缝和反例不足；作者的约 40 个 probe 成功报告没有公开应用补丁／日志，未独立复现。[#2450](https://github.com/obra/superpowers/issues/2450) 则报告正确修复收紧 CLI 调用后，后续计划仍用旧接口；作者说 scoped 与 final review 最终发现，问题是发现太晚，不是所有评审都漏掉。**[社区：作者原帖]**

核实时两 issue 均 open，评论和 timeline 为空；按 issue 号搜提交无结果。只能说所查入口未见维护者回应或直接关联修复，不能证明没有其他相关改进。下述八九月提交早于两个十月 issue，不是它们的响应。**[一手：GitHub 状态；检索边界]**

主分支固定 `bb92a77741419a4ab5f06e711a283343f1ada0c3`；dev 为 `d079e1b85c8f964cb52da5e2be678c9fdfc8759b`，二者 tree 均为 `4ac675daa3415bc836f707c7e60237ac7b66c7d5`。相关机制如下。**[一手：Git 元数据与源码]**

- [SDD setup](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L155-L181) 已要求读 spec、按其裁决计划冲突；[task reviewer](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/task-reviewer-prompt.md) 可报 plan-mandated 缺陷，也可按具体风险查 diff 外代码、运行 focused test。因此不能概括为“只能服从计划”或“禁止独立验证”。
- reviewer 与 implementer 明确共用同一 brief；[task-brief](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/scripts/task-brief#L30-L36) 仅抽取计划的 Task 文本。SDD dispatch 另要求带先前接口决策，故存在补交信息通路，但依赖 controller 正确使用。
- [fix loop](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L354-L443) 未在接口变化后明确要求刷新剩余计划和已生成未派发 brief；这是流程缺口，不是实际 agent 必然漏做的证明。
- [inline final review](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/executing-plans/SKILL.md#L234-L268) 明确传 plan、spec、Review Focus；[SDD final review](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L445-L468) 明确 diff 和 deferred/parked ledger，却无相同输入列表。只据评审数量不能推断覆盖面。
- [brainstorming](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/SKILL.md) 已要求区分用户选择与 agent 自定并让用户确认描述；但 [builder check](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/builder-check-prompt.md) 只拿设计文档，检查能否规划，不直接对照原请求。其通过不能证明设计忠实于用户原意。

### 后续任务：相同 brief 与过期接口 · #2086：小补丁支持什么，实验不能证明什么

已合并 [PR #2086](https://github.com/obra/superpowers/pull/2086) 的[固定补丁](https://github.com/obra/superpowers/commit/538d65120be78ad147fc82ea392da2ed0edc4cdc)仅两文件 +7/-1：plan header 加 Spec 路径，执行端读取。作者报告同一六任务、五项合成冲突中，无 spec 解决 0–1/5，spec-present stock 三次为 4/5、5/5、4/5。它是作者历史实验报告，不是五个独立项目或本轮运行。**[一手：补丁及合并状态；社区：作者实验报告]**

本轮独立读取研究仓库固定 `6e6f33ff0e6a724c6568c5d9252d001a15559b0b` 的材料后，结论需收窄。**[研究：实验设计与夹具阅读]**

1. **文件与权威确认混在一起。** [spec 组 story](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/story.md) 不仅增加文件，开场还点名它，模拟用户遇冲突会明确回复 spec 有权威性。[作者日志 L342–380](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/logs/2026-08-03-plan-decomposition-campaign.md#L342-L380) 明言 stock control 检出五项后，靠该答复才继续裁决；[无 spec 组](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-consistency/story.md) 没有此答复。可支持上位判据可达且权威明确，不能隔离成文件自身净效应。
2. **不同不自动等于错。** [答案表](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/seeded-truth-ledger.md) 中不同组件 timeout、命名或入口 priority 下限，在真实系统可能有意不同；[新增 spec](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/fixtures/docs/superpowers/specs/job-queue-spec.md) 明确要求统一后才可判违规。0–1/5 不是一般漏洞漏检率。
3. **公开叙述日志不等于原轨迹。** PR 称 raw records public；本轮取得日志、报告和合成 fixture，未在未截断的递归 tree 中定位 cp-x10 各 rep 原始 rollout／最终树，不能独立重算。[预设完成树](https://github.com/prime-radiant-inc/superpowers-autoresearch/tree/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/fixtures/cp-x10-consistency-outcomes/complete)不是模型输出。日志还披露判分曾把空 root 当缺陷消失、随后修正手查；此处保留限制，不重复开展判定器审计。

另一个[固定补丁 7474980](https://github.com/obra/superpowers/commit/7474980bb9649fe818aace41ea0724b6a6e11def) 已要求最终 reviewer 不因 spec 沉默忽略实际使用行为，列出 Declined to judge，并让 inline 传 Review Focus。这反驳“完全没有挑战 spec 的设计”，但不能代替原请求→spec 的核对。**[一手：补丁；研究：边界]**

### 后续任务：相同 brief 与过期接口 · 最小动作、成本与停止条件

- 原意遗漏：选原请求中的具体成功条件对照实际使用路径；只有用户能决定的歧义才问，不能凭“合理用户”创造新需求。
- 接缝遗漏：按具体风险检查新产物→旧消费者、旧输入→新路径，例如新 token 到旧 verifier；已有测试未区分假设时再补反例，不统一规定 probe 数量。
- 接口改变：定位受影响的剩余任务、交付命令和已生成 brief，更新后再派发，并核验实际消费者路径，不重审整仓。

判据已在输入、无跨任务消费者且已有独立检查时，不叠加流程；额外reviewer只重复发现就撤掉，保留必要输入与运行检查。上述动作的净时间／费用未测；进一步取证须有原报告补丁及同条件复测，或真实任务的新增发现、误报和人工投入。08／09仅据此收窄建议，不新建模板或重复审计。**[研究]**


## 额外评审的增量与人的负担

核实：2026-10-14（UTC）。主线二；改变 09 §2 的“每次 PR 都加独立 Agent”默认值。以下为论文正文核对，未运行模型、上游程序或复算原始轨迹。

### 近期评测：先试单 Agent 的提示调整

[CRBugBench v1](https://arxiv.org/html/2610.13668v1)（2026-10-09），Table 2/3 的 `gpt-5.6-sol xhigh`、`copilot-cli 1.0.74`、Fix 组（合并后才被发现的历史缺陷）：固定前五条发现的观察口径，未匹配计算预算。**[一手：作者实验]**

| 配置 | recall@5 | 作者估算美元／任务 | 分钟／任务 |
|---|---:|---:|---:|
| 默认单 Agent | 49.0% | 2.03 | 5.2 |
| 单 Agent comprehensive 提示 | 54.0% | 1.81 | 8.1 |
| 五个独立候选评审＋协调者汇总 | 53.6% | 11.47 | 28.5 |

这支持先比较原生单评审的提示调整，而非默认堆 reviewer；不证明新提示普遍更好：同表 Opus 5 的 Fix recall@5 从 64.2% 降至 62.4%。该指标是前五条意见命中历史已知缺陷，不是意见精确率或线上修复率。**[研究：采用边界]**

任务删除后续 Git 引用、限制联网；历史公开答案仍有训练污染可能。三模型判分并有 40 样本人工校准，不等于全量独立运行证实。两轨各抽 500 题，因此论文“人只抓 50%”不能当随机真人对照；也没有原生测试单独一组或人的核查成本。**[一手：§3；研究：比较边界]**

### 人的注意力：新增意见不等于新增重要发现

[Tufano 等 v2](https://arxiv.org/html/2411.11401v2)（ICSE 2025）分析 29 位有职业经验者的 72 次评审：小型 Java/Python 程序共注入 48 个质量问题，比较手动、GPT-4 意见起步与人工构造的完整意见。AI 辅助组和手动组检出注入问题的中位数均为 50%；前者增加较低严重度问题，注意力更集中于已有提示位置；时间差未显著，不能写成已证明变慢或等效。**[一手：受控实验，§II–III]**

据此建议人在高风险任务先确定自己的检查范围，再看 AI 提示；“先人审后显示 AI”只是待验证措施，实验没有直接比较这种顺序。旧模型、短程序与人工注入不代表当前 Agent 的检出能力，也不证明 AI 不能增加价值。**[研究：条件建议]**

### 现场补充：修改发生了，仍须核对是否修对

[RevMate 原论文 v1](https://www.mozillafoundation.org/documents/462/2411.07091v1.pdf)（2024-11；Mozilla 在 2026-01 发布介绍，不是新一轮实验），GPT-4o、Mozilla/Ubisoft 现场研究：**[一手：§VI–VII]**

- Ubisoft 按每条评论打开到提交评价的区间累加，每个 patch 的中位数约 43 秒；含切换／分心，是检查耗时上界估计，不是总评审提速。
- 完成评审后的 69 条已采纳生成意见，有 51 条所在 hunk 后续变化（73.9%）；研究外其他 patch 的 1,211 条人工意见为 887 条（73.2%）。这是关联修改，作者明确承认可能与意见无直接关系；不能当正确修复率或随机同任务对照。
- 接受意见、判定正确、实际修复、漏掉缺陷、作者处理时间须分别记录；该研究未给完整缺陷召回或作者修复工时，不能与 CRBugBench 拼成同一条净收益证据。**[研究：解释边界]**

### 最小采用与停止条件

✅ 保留确定性检查和按风险的人审；🧪 只有明确漏审类型时才试额外 Agent。先用同类变更核对其新增、可行动且正确的发现，以及人的验证／修复投入；若只重复已有检查、引入大量无效修改或没有改善目标风险，撤回额外层。新提示也按同样标准，而非因单篇论文一律替换。**[研究：采用判断]**

仍缺当前强Agent相对“现有测试＋定向人审”的同任务净收益：新增正确发现、漏检、实际修复及人的投入；不另造评测平台。

### Crossplane：有用意见与收窄评审可以同时成立

核实：2026-10-14（UTC）。主线二／三；细化 09 的撤回建议：低价值输出挤占人审时，可先收窄评审强度与状态评论，不必接受全部建议或撤掉全部能力。本轮只读公开 PR、评论、固定配置和代码，未运行 Crossplane、模型或 CI。**[研究：范围与采用判断]**

**实际改变了什么。** Crossplane 维护者 negz 在真实功能 PR [#6777](https://github.com/crossplane/crossplane/pull/6777) 试用 CodeRabbit 后，[说明 assertive 太啰嗦并改为 chill](https://github.com/crossplane/crossplane/pull/6777#issuecomment-3272858121)。[#6794](https://github.com/crossplane/crossplane/pull/6794) 的理由同时承认部分 nit 有用，但不值得投入过多处理时间，也担心新贡献者的负担；该配置修改已合并为 `389bee346cf0d0efea512994aeeeb311ff1ccc00`。随后 [#6795](https://github.com/crossplane/crossplane/pull/6795) 关闭评审前后状态评论，作者[明确保留 GitHub check](https://github.com/crossplane/crossplane/pull/6795#issuecomment-3272904222)。其合并版本 [2ef13c0 的配置](https://github.com/crossplane/crossplane/blob/2ef13c01f8916d4d161ba687c2f2941400cf2b8a/.coderabbit.yaml#L24-L50)同时包含 `profile: "chill"` 与 `review_status: false`。**[社区：维护者取舍；一手：PR 元数据与固定配置]**

这不是“机器人毫无帮助”的案例。同一个 #6777 中可核对以下不同结果：

| 意见及人的处理 | 固定产物／反证 | 能证明什么 |
|---|---|---|
| [机器人建议接口参数并加 nil guard](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334776323)；[作者接受前者、拒绝后者](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334832276) | [合并版 mapfunc.go](https://github.com/crossplane/crossplane/blob/221af7eb52a671f9462da4619c89776c593464d2/internal/circuit/mapfunc.go#L28-L34)使用 `Breaker` 参数，没有建议中的 nil guard | 建议被拆分、选择性采纳；未证明修复了已触发的运行时缺陷 |
| [机器人建议编译期接口断言](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334840022)；[作者接受但改放测试文件](https://github.com/crossplane/crossplane/pull/6777#discussion_r2335051593) | [合并版 token_bucket_test.go](https://github.com/crossplane/crossplane/blob/221af7eb52a671f9462da4619c89776c593464d2/internal/circuit/token_bucket_test.go#L32)包含断言 | 维护预防措施进入合并代码，不是发现一例真实接口错误 |
| [机器人判定整数 range 无法编译](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334861081)；[作者指出建议错误](https://github.com/crossplane/crossplane/pull/6777#discussion_r2335194071) | [合并版 go.mod](https://github.com/crossplane/crossplane/blob/221af7eb52a671f9462da4619c89776c593464d2/go.mod#L3)指定 Go 1.24；[Go 1.22 官方说明](https://go.dev/doc/go1.22#language)已支持整数 range | 此项语言断言可独立反证；本轮没有编译运行 |
| [机器人建议状态消息加入时间](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334839986)；[作者认为会引发 condition thrashing](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334869687) | 作者解释条件更新会触发新的 reconcile | 展示核查系统行为的必要性；这一风险仍是维护者判断，未独立复现 |

表中机器人原意见、作者答复及固定代码分别为 **[一手：公开产物]**、**[社区：作者判断]**、**[一手：源码]**；解释为 **[研究]**。#6777 最终合并 SHA 为 `221af7eb52a671f9462da4619c89776c593464d2`。不能把意见被接受、代码出现、真实 bug 被修复、上线风险下降视为同一结果。

**负担边界。** 线程有纠错、拒绝额外代码和降强度决定，但无主动工时、等待或完整意见分母。#6794“近200条”含非CodeRabbit评论；无chill前后同任务对照，不能算误报率、净损失或节时。**[社区／研究]**

**排重与排除。** 既有 CRBugBench／Tufano／RevMate 不重复取样。[cuda-python #2137](https://github.com/NVIDIA/cuda-python/issues/2137)有历史关停的作者自述，但本轮所见重启仍是提议；[CCCL #8930](https://github.com/NVIDIA/cccl/pull/8930)确有启用自动评审的合并记录，却没有正确修复与人的投入对照，均不作为净收益证据。Crossplane #6794/#6795 的搜索网页旧缓存显示 open，本轮通过 GitHub 连接器重新取得两者 `merged: true`、合并 SHA、diff 与评论，未沿用缓存状态。**[一手：公开元数据；研究：排除判断]**

**评级不变。** 提升需同类任务的新增真缺陷、正确修复及人的主动投入／等待对照，单项目取舍不足。**[研究]**


## 跨仓修复：本 PR 未变不等于评审对象未变

主线二／三；核实：2026-10-16 UTC。改变09的复审条件：上游修复在另一仓库时，同时核固定修复与实际分发版本，不把本 PR head 对应的完成报告当作整个依赖链已验证。新增证据为公开意见、作者确认、固定补丁和复审回执；未运行模型、上游程序或测试。**[研究：范围]**

**发现与处理分开归属。** [ComfyUI-Manager #3295](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295)只新增一个 JSON 目录条目，引用外部节点管理器。维护者 ltdrdata [先要求补访问控制](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295#issuecomment-5777249417)，作者随后发布0.3.0。CodeRabbit [9月23日新增意见](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295#discussion_r4088352548)指出该版本的 token 入口仍缺 Host 校验，并要求覆盖 token、安装和重启的回归测试。最初访问控制问题不能归给机器人；新增意见也不是对目录 JSON 语法的检查。**[一手：公开评审链；社区：参与者判断]**

**确认落到固定补丁，但验证不完整。** [作者9月25日回复](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295#issuecomment-5833035126)明确确认问题，并报告正常请求成功、非本地域名请求被拒绝；这是作者复测自述，不是本仓运行回执。0.3.0 对应 `e6dd8330b510ac5f8b0b7da2d9f41fe907b35182`，修复提交 [`3fe7cd8cb041ab96cb83158dea9e4133d5ece567`](https://github.com/Raykosan/ComfyUI-Custom-Node-Manager/commit/3fe7cd8cb041ab96cb83158dea9e4133d5ece567)领先一提交，CHANGELOG 明确注明由 CodeRabbit 报告；[security.py](https://github.com/Raykosan/ComfyUI-Custom-Node-Manager/blob/3fe7cd8cb041ab96cb83158dea9e4133d5ece567/security.py#L85-L133)在原 loopback peer 检查之外加入 Host 校验，[消费者入口](https://github.com/Raykosan/ComfyUI-Custom-Node-Manager/blob/3fe7cd8cb041ab96cb83158dea9e4133d5ece567/CustomNode.py#L564-L567)确实使用该检查。完整补丁只有 CHANGELOG.md、pyproject.toml、security.py，没有随此提交新增机器人要求的回归测试；不能据作者的 token 请求检查宣称完整安装／重启链已复测，也不能据补丁未加测试断言作者从未运行测试。**[一手：固定源码与比较；社区：作者复测；研究：边界]**

**后续复审不能只看请求或 head。** 作者10月3日[称0.4.0已修复并请求普通 review](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295#discussion_r4174822484)，机器人[明确未执行](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295#issuecomment-5973405140)：最后提交已经评审。作者随后[请求 full review](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295#discussion_r4174934324)，收到[完成回执](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295#issuecomment-5973643270)，所以不能写成所有复审都跳过。但[更新后的摘要](https://github.com/Comfy-Org/ComfyUI-Manager/pull/3295#issuecomment-5730509824)虽无新增 actionable comments，仍说明实际发布版本及其控制尚未确定、建议固定修订。连接器核实目录 PR 仍 `open`、`merged: false`，head 为 `62b57af030c69444d17d72eb3fac42d31fac872c`；目录增量只含未固定版本的仓库 URL。本文未继续验证0.4.0，不把该回复代替已核的0.3.1固定补丁，也不声称已进入目录或上线。**[一手：PR 元数据、diff与回执；研究：覆盖范围]**

**采用与成本。** 跨仓对象变更后，核实际版本与行为证据，勿对未变的目录PR反复增量评审；已有可靠验证则不加全量，未覆盖产物则保人审。作者确有核实、修补、复测说明与重触发，但缺工时／费用及误漏报分母，时间戳不能代工时；不提高评级或声称净收益。**[研究]**


## Faros：公开指标的口径补核

核实：2026-10-14（UTC+8）。主线四；改变 09／18：按事故比率、评审停留与代码 churn 选择观察项，不把它们写成逐 PR 致事故概率、人工工时或全部返工。本次已读公开原页与作者详解；上文 10-12 访问失败是当时记录，不回写成当时已读。[研究]

[一手：厂商公开报告] [Q2 2026 原页](https://www.faros.ai/research/ai-acceleration-whiplash)给出两年、22,000 名开发者、4,000 个团队的总体范围，摘要为事故／PR 3X、评审中位 5X、churn 10X。[官方详解](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways)明确比较同一组织最低与最高 AI 采用时期：事故数／已合并 PR 数 +242.7%，评审停留中位 +441.5%，季度内已合并代码删行／加行比 +861%。按“1 + 增幅”换算分别为 3.427、5.415、9.61 倍；摘要是粗略概括，不是另一组相互矛盾的数据。

[一手／研究] 详解标题曾用 probability，但紧随的正文明确这是比率而非概率：一份 PR 可关联多个事故，事故也未必归因于最近合并。该页也分别列首次评审等待、平均评审时间和中位停留，不能混作同一个人工投入指标。churn 可来自替换不足代码，也可来自有益重构；只靠删行／加行比不能诊断是哪一种。具体任务应回到变更来源、返工原因、评审等待和实际缺陷，不因比率上升惩罚必要删除或重构。原页还报告 PR 体积约 +51%、bugs／PR 约 +28%，并主张成熟团队也出现恶化、与 DORA 2025 调查不同；这些原结论保留为厂商主张，不在缺少可比样本和模型时宣布推翻 DORA。

[一手：作者方法限制] [后续方法说明](https://www.faros.ai/blog/why-cheaper-ai-models-can-cost-more-hidden-model-tax)承认报告为观察性研究，建立关联而非隔离 AI 采用的因果效果。本次未取得完整下载报告及方法附录；各指标有效样本、采用强度定义、聚合权重、准确观察起止、计时端点及混杂控制仍未核实，不能把 2025 报告的方法移植到 2026 版，也不能把总体样本当每一项指标分母。

[研究] 保留“同时观察交付、评审与可靠性”的建议，撤回“churn 全是返工”的译法；这些数字不预测某团队会恶化多少，亦未证明前置评审、特定模型或厂商治理产品能改善结果。未取得逐团队原始数据，不做伪精确因果复算；本轮完成原页、详解、限定语核对及上述算术，未运行模型或团队实验。


## 工作流首选：契约与可观察偏好

核实：2026-10-15（UTC+8）。主线二／三；改变 07 的访谈 Spec、TDD 开局与 SDD 适用条件。✅ 按尚未确定的行为／交付契约和需要观察的偏好分流，撤回仅按任务大小决定是否写规格。以下是原文及固定产物核查，不是本仓模型实验。**[研究：采用判断]**

### 原任务到产物：GIF 优化器

Simon Willison 的[原文](https://simonwillison.net/guides/agentic-engineering-patterns/gif-optimization/)说明，他要用浏览器比较 GIF 压缩效果，特意未规定全部 presets；发现 WASM 构建涉及补丁后，追加固定源码、保存构建脚本／补丁并提交 bundle 的要求，以便静态托管直接使用。他展示自己用产物优化演示图，但不满意 Agent 额外加入的 URL 输入，因为存在跨域限制。前者支持保留可观察选择，后者反驳“没写的功能让 Agent 猜就总合适”。**[社区：作者任务、使用与取舍自述]**

[合入提交 `ea924805`](https://github.com/simonw/tools/commit/ea924805f14bc826ca3c51686613cd476ff02251)保留初始任务和追加提示。只读固定文件得到：
- [HTML](https://github.com/simonw/tools/blob/ea924805f14bc826ca3c51686613cd476ff02251/gif-optimizer.html)的 presets 包含无损、有损、减色与缩放，`processPresets` 展示大小和预览，`setManualControlsFromArgs` 把选中参数带入手动控件，`getManualArgs` 再生成命令。大小可量化，视觉是否可接受仍需判断；源码没有把“最小文件”直接当最终选择。
- 同文件 URL 入口直接 `fetch(url)`，没有跨域代理；这是作者顾虑的实现路径，并非本轮实测所有 URL 均失败。固定版本仍有该入口，不能把“可能以后删除”写成已删。
- [build.sh](https://github.com/simonw/tools/blob/ea924805f14bc826ca3c51686613cd476ff02251/lib/gifsicle/build.sh)检出 `07f5c4c`、应用补丁并复制 JS／WASM；[补丁](https://github.com/simonw/tools/blob/ea924805f14bc826ca3c51686613cd476ff02251/lib/gifsicle/gifsicle-wasm.patch)增加调用入口，提交文件表含 WASM。脚本没有固定完整工具链；这证明追加交付要求落到代码，不证明可重复构建已验收。**[一手：固定源码／提交；研究：证据范围]**

初始任务已明确比较、下载、调整，不是无需求；保留可验证目标，让人用反馈决定偏好，并补回新交付约束。已读原文、提交及文件，未读完整会话或运行构建／浏览器／模型，未测返工和主动工时，不据此称省规格更快。**[研究]**

### 不同作者的补充与反例

Anthropic 的 [Finding your unknowns](https://claude.com/resources/articles/a-field-guide-to-claude-fable-finding-your-unknowns?fcdaa149_sort_date=desc&query=workflow)（2026-07-06，Thariq Shihipar）提出先用假数据做工具栏布局、暂不连接真实应用；访谈优先问会改变架构的歧义。作者实际视频制作中先试 Remotion 与转录同步，但调色时发现自己连好坏也不会判断，转而学习评价依据。它支持“样品能否帮助决策”的分界，**不支持没有标准就无限试样品**。这是厂商工程师经验，不是独立收益对照；不照搬其每次 brainstorming、新会话或测验习惯。**[一手：作者原文；研究：采用边界]**

[Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices#explore-first-then-plan-then-code)同时给出直接修小改与先规划的示例，并在 Develop your intuition 承认探索时可跳过规划。本文不将其“多文件”提示升级成强制关卡。测试预期来源沿用[既有回归研究](2026-10-12-development-conditions.md#生成回归测试先保留预期再决定是否新增)，不因新增短入口再推广 TDD。**[一手；研究]**

**未采用的近期证据。** [Vibe Coding: An experiment with test-driven development](https://link.springer.com/article/10.1007/s10664-026-10950-z)于 2026-10-09 发布；已读 §3–7，研究在人类／协作、GPT-3.5 全自动与 MGX（GPT-5／Sonnet 4）间改变模型和交互方式，使用两个无需复杂 API／类结构知识的简单任务，并非同模型只改变先测／后测的对照。故不据摘要的工作流优劣建议扩大 07 的 TDD 采用范围；本轮未取得并复算工件。**[研究：排除理由]**

**撤回与缺口。** 行为明确且检查充分就撤额外访谈／规格／重复测试；样品无法支持选择则先补参照。跨组件兼容、不可逆数据与外部交付仍须先决定；提高推荐强度需同题同模型同预算的顺序对照及后续修改成本。**[经验／研究]**


## 评审入口、费用与完成契约

核实：2026-10-14（UTC）。主线二／四；改变 09 §2：云端命令不等于云端实际执行，运行成功不等于无缺陷。以下核查公开官方原文及既有固定 Action 源码，未安装或运行客户端、模型、托管评审、付费 CI，也未新增检查器。**[研究：范围]**

### 新证据如何改变选择

1. [Code Review 的云端升级说明](https://code.claude.com/docs/en/code-review#escalate-to-ultrareview)明确：ultra 不可用时退回本地。故要求云端多 Agent 的任务，应看实际会话执行位置；有结果本身不能确认采用了预期能力。普通本地不读 `REVIEW.md` 是已有证据，本次只是移到入口，不算新发现。**[一手；研究]**
2. [Ultrareview CLI 契约](https://code.claude.com/docs/en/ultrareview#run-ultrareview-non-interactively)把完成与发现分开：退出 `0` 可带发现，`1` 是启动／运行／超时失败，`130` 是中断；`--json` 为 `bugs.json`。不能把退出码当质量门槛，也不能套托管的 `normal/nit/pre_existing` schema。超时后远端可能继续，重新执行不是续跑，须防止重复付费。**[一手；研究]**
3. [托管故障说明](https://code.claude.com/docs/en/code-review#retrigger-a-failed-or-timed-out-review)与[输出说明](https://code.claude.com/docs/en/code-review#check-run-output)共同反证“neutral 即有效结果”。正文因此撤回只比较 `normal > 0` 的直接门槛建议，补充应用身份、当前 head SHA、完成状态和 schema 条件；这些是本仓推导的接入要求，不冒充已发布或已测的检查器。**[一手；研究]**

### 仍成立的机制与反证

- `REVIEW.md` 更可靠并非原文没有依据：[官方确实作此主张](https://code.claude.com/docs/en/code-review#what-you-can-tune)，理由是直接传给相关评审 Agent。本次保留机制和厂商归属，只撤回可将它理解为强制保证的措辞；本轮没有遵循率对照。ultrareview 文档未在所读章节承诺同样文件加载路径，因此不从名称或多 Agent 架构推断。**[一手：厂商说明；研究：边界]**
- [Claude Action](https://code.claude.com/docs/en/github-actions)是 workflow／SDK 集成，支持 API key 和订阅 OAuth；不能借托管服务的价格、读取规则或验证流程为任何 Action 提示担保。[Codex GitHub](https://learn.chatgpt.com/docs/third-party/github)明确使用适用目录的 `AGENTS.md`；[CLI](https://learn.chatgpt.com/docs/codex/cli)另有本地 review。把规则放对位置仍不代替测试／准入策略。**[一手；研究]**
- 重读 [Codex Action 固定 action.yml](https://github.com/openai/codex-action/blob/bdf19a4a223ec2549a3e2274a0cf61556bc07675/action.yml)，仍按既有 runner／权限建议使用；固定 Action 不等于固定 CLI，不能把普通 exec 的产物误认成上述托管报告。未运行此 Action，不新增能力或净收益结论。**[一手：固定源码；研究]**

### 撤回与页级剩余缺口

**[经验：采用判断]** 接入前还不能区分运行失败、报告失效与有无发现时，只用提示型评审；可控且重复的窄任务才进入自动化。规则无新增有效发现就精简，托管／ultra 的额外费用不能混入“订阅内免费”比较。没有证据支持所有入口同能力，也没有证据支持云端一律比本地值得。

**历史状态：该轮09为L2。** 后续调查、模型转述、服务及诊断补核见下文；当时缺的是全页关键事实核对，而非必须实测才能达到L3。**[研究]**

**验证记录。** 独立 reviewer 以新上下文核对这两文件的 diff、官方原文和固定 Action 源码，未发现会改变采用选择的事实问题，认可维持 L2。完整 `python3 scripts/check_offline.py` 14 阶段及 `git diff --check` 通过；这些只验证本仓离线套件和补丁，不证明评审服务或模型效果。**[经验：执行记录]**


## 调查、模型转述与第三方服务的采用边界

核实：2026-10-14（UTC）。主线二／三；只改 09 的三处采用依据，不重做入口与失败契约，也不提升 L2。公开原页阅读，不含模型、客户端或服务实验。**[研究：范围]**

- **调查分母与反证。** [SO 2025 原题](https://survey.stackoverflow.co/2025/ai)为多选题，31,476 人作答（全调查的64.2%），66%／45%分别表示遇到近似正确方案／调试更费时。[方法](https://survey.stackoverflow.co/2025/methodology)写明2025-05-29至06-23收集，主要经自有渠道招募，活跃用户更易入样。故删除“好到能合并”的添加解释；既不能从受访者比例推成代码缺陷比例，也不能预测2026模型效果。保留按实际行为验证的建议，不据此计算返工预算。**[一手：问卷、方法；研究：解释]**
- **模型优势的归属。** [Opus 5.5 发布页](https://www.anthropic.com/claude-opus-5-5)把低 effort 检出已知缺陷72%、Opus 5高 effort 56%及误报更少，列为Deloitte CIO Carl Bennett的客户引言；未在此处给出任务数、缺陷数、抽样、误报分母及可复查产物。这是正面线索，不能直接选定默认 effort，亦不能与独立评审研究合并成同一个对照。正文撤下具体优势和未在此页找到的逐字提示，沿用已有“给需求、位置、可证明失败”的建议。**[一手：厂商刊载客户自述；研究：边界]**
- **当前服务契约优先于旧价格新闻。** [Bugbot 当前文档](https://cursor.com/docs/bugbot#pricing)说明用量计费并保留旧seat方案入口，Teams从预付额度或旧Teams按需支出扣除；[当前价格页](https://cursor.com/pricing)按方案列可用功能，未给可用于所有PR的固定单价。[5月公告](https://cursor.com/blog/may-2026-bugbot-changes)中的1–1.5美元是当时均价，老客户在6月8日后下一次续费才转制；[6月更新](https://cursor.com/blog/bugbot-updates-june-2026)又报告成本下降，并已列Security Review入口。因此撤回当前固定按次报价与统一9月新增的描述，不用22%降幅推算新单价。当前[Security Agents](https://cursor.com/docs/security-agents)区分PR评审与存量扫描，按团队用量扣费；[Rollouts](https://cursor.com/docs/rollouts)监控部署，不能凭同一品牌或合并介绍当评审替代。删除未给原帖的“社区不满”，不作价值判断。**[一手：官方文档／历史公告；研究：采用边界]**

**历史状态：该轮仍为L2；** GitClear与配置／第三方集成的后续补核见下文。**[研究]**

**验证记录。** 全新上下文独立 reviewer 交叉核对上述原页与两文件 diff，未发现会改变采用选择的事实问题，认可维持L2。实际运行 `python3 scripts/check_offline.py`，14阶段全部通过（非空套件、无skip）；`git diff --check`通过。仅验证本仓离线套件和补丁，不代表模型、客户端或托管服务已验证。


## GitClear维护信号的分母与采用边界

核实：2026-10-14（UTC）。主线三；改变 09 §1：将厂商维护代理信号用于定向抽检，不据此认定默认 AI 工作流导致维护退化，亦不设旧代码改动或重构配额。完整 PDF 未取得，以下是公开原页与原报告图页核对，不宣称完整方法已经审完。**[研究：范围与采用判断]**

### 可核查的一手材料与访问范围

[官方落地页](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)公开摘要、图页与下载表单；[报告封面](https://asset.gitclear.com/assets/pages/maintainability-gap-cover-c12f3032b5fc3cbd106b35a69dcff15c2ba0e31daf7c1e7c2d05c36d565effae.png)署 William Harding、2026-06、v2026.6.0，GitClear 与 GitKraken 赞助。作者的[9月发布说明](https://www.gitclear.com/blog/annual_ai_code_quality_research_2026_diff_digest_git_ai_diff_viewer)内嵌原文说明下载需登录或验证邮箱。本轮未提交邮箱或注册账号，公开搜索未取得可核验完整 PDF。官网公开[指标与方法说明](https://www.gitclear.com/industry_stats/ai_code_quality_signal_graphs)可读取 HTML；网页提取工具一度返回 403，普通公开请求可读，同属官方的[GitKraken 子域页面](https://gitkraken.gitclear.com/industry_stats/ai_code_quality_signal_graphs)亦可读。两页是动态数据，不能将其当前总量当作六月报告样本。**[一手；研究：访问边界]**

### 五项会改变采用的发现

1. **重复指标单位冲突，不能拿绝对值设门槛。** 落地页正文把 40.3→73.0 写成每百万变更行；其直接展示的[原报告第8页](https://asset.gitclear.com/assets/pages/maintainability-gap-block-duplication-10c7322d192693dad8b141b15740d29ebd77147127544f51bba38a0662327329.png)图轴及图注却是每千变更行中的重复行，年份为 2023→2026 YTD。相对增幅约81%不受这处单位差异影响，但不是缺陷率，也不能默认为重复块数量。正文保留厂商报告的相对信号并明示冲突，不擅自裁定哪个版本正确。**[一手：正文与原图；研究：解释]**
2. **移动比例不是全部重构量。** [第11页](https://asset.gitclear.com/assets/pages/maintainability-gap-refactor-vs-paste-66d0411f642c9c302a181f26f32a300ebe83e677ad1a6d1168bd8ebaf9ccd78f.png)图示变更行中移动占比12.7%→3.8%，正文取整为13%；“−70%”是两占比的相对变化，不能换成重构次数、工时或绝对量。该图2026复制粘贴15.7%，除以3.8约4.1，并不支持正文“约5倍”的精确比较。撤下该倍数，不据此预留固定重构百分比。**[一手：原图；研究：计算与边界]**
3. **旧代码更新占比下降不等于绝对维护量减少。** [第13页](https://asset.gitclear.com/assets/pages/maintainability-gap-legacy-code-b6aa26e7eaa4cfa69dfc5b4504d7569c87110ae5d4c64bfc76ac11daee8c9d37.png)写的是更新或删除超过十二个月未触碰代码的变更占比，2023为1.71%、2026 YTD为0.46%；旁列各年检查行规模10m、12m、46m、58m，不能当同等规模或固定仓库面板。落地页导语写“vs 2022”，正文和图则指2023。即使占比核对无误，分母增长、样本更替、仓库年龄与需求类型都可能改变解释；这只是待控制因素，不声称已经证实哪一种造成变化。**[一手：原图；研究：推论边界]**
4. **防御性语法与短期删改不是已确认坏代码。** 第8页将 rescue/catch、safe-navigation 和 stubbed methods 等构造作为错误掩盖信号；当前官方指标页又把 null checks、mock guards 等列作防御性惯用法，说明更多通常代表更谨慎。当前页把 churn 定义为两周内被改写或移除的已写行占比。当前定义不保证与六月每项历史计算完全一致，却足以说明不能跳过具体行为核验，把构造密度直接译为已证实吞错、把 churn 全译成缺陷返工。应检查错误是否被掩盖，而非要求减少 catch 或空值检查。**[一手：原图与当前定义；研究：采用边界]**
5. **公开材料支持预警，不识别工作流因果。** 报告封面总量为6.23亿 changes，不能转述为同数提交、开发者或独立观察。已读部分呈现跨年代理信号；当前指标页说明按模型指纹分组，基线为人类或未归因提交，不等于证实未用AI的对照组。仓库构成、归因阈值和验证细节仍指向完整报告；本轮无法核实其控制语言、任务、仓库年龄、使用者选择等混杂的程度。这不证明报告为假，也不能反向声称完整报告完全没有控制。**[一手：公开方法；研究：因果边界]**

**采用。** 用重复／移动等信号选抽检对象，不为统计强改：独立演化、刻意异常处理或无需改旧代码都可成立。上述趋势未测额外reviewer净收益；该轮09仍L2、完整方法及其余转述待核。**[经验／研究]**

**验证记录。** 全新上下文独立 reviewer 核对两文件 diff、公开原图、当前官方定义与算术，未发现会改变采用或需修正的事实错误，认可保留历史口径不确定及完整 PDF 未取得的边界。实际执行 `python3 scripts/check_offline.py`，14阶段通过（非空套件、无skip）；`git diff --check`通过。仅验证本仓离线检查和补丁，不代表模型效果、维护成本或报告完整方法获验证。


## 配置诊断、插件评估与第三方集成的范围

核实：2026-10-14（UTC）。主线二／三；撤回“收录插件或运行诊断就值得加一层”的隐含选择。只读官方文档及固定公开源码，未安装、运行模型或连接服务。**[研究：范围]**

- **组织结果不归给托管产品。** [Intercom 2026-04-21 原文](https://www.intercom.com/blog/ai-is-approving-our-pull-requests-heres-how-we-made-it-safe)在两个主代码库报告超过19%自动批准；35%停机下降放在九个月整体研发转型、部署翻倍的背景。自建子Agent审批有仓库指导，拒绝大／复杂／宽范围PR，工程师可改请人审并负责上线监控回滚。其百余PR试点、后续497个自主PR不是随机分配证明；原文没有足够资料分离选样、变更大小和其他流程变化。故不能作为托管Claude Code Review的效果或默认自动批准依据。**[一手：使用方自述；研究：边界]**
- **自评反例不推出固定互评。** Anthropic 3月复盘关于主观设计自评偏宽松的原句成立，但同文也明确新模型能力范围内evaluator可能是额外负担；沿用[已有原文核对](2026-10-12-long-task-evidence.md#3-历史-harness-自己已经撤去哪些环节)，不另复制实验数字。采用只看具体漏项和净收益，不要求按案例复制轮次。**[一手：作者实验自述；研究：选择]**
- **诊断不是行为评估。** [Commands](https://code.claude.com/docs/en/commands)及[Skills](https://code.claude.com/docs/en/skills#check-your-setup-with-doctor)确认 `/doctor prompt-audit` 从v2.1.283可用，是模型驱动的过时／冲突指令审计，不能因另有 `/claude-api prompt-audit` 就认定它不存在。`/skill-doctor` 从v2.1.252可用，依赖feature-flag fetching，报告对象是当前会话中的skills，排除bundled及enterprise；这不限定调用历史的统计窗口；[Remote Control不支持，须在宿主终端使用](https://code.claude.com/docs/en/skills#find-unused-skills)。[环境文档](https://code.claude.com/docs/en/env-vars#features-that-need-feature-flag-fetching)说明第三方provider、gateway及禁用相关流量的会话通常不取flags。缺此命令时可直接查加载内容，不要求为了诊断更改隐私设置；调用少不足以证明无用。**[一手：动态契约；研究：选择]**
- **插件行为评估有明确宿主。** [Plugin evals](https://code.claude.com/docs/en/plugin-evals)适用于Claude Code插件／skills-directory插件，要求v2.1.269+；它使用正常会话的认证／provider，运行与裁判都计入用量。默认有／无插件各三次，不是三次就足够证明收益。隔离运行不加载用户／项目CLAUDE.md、其他插件或配置，即使scaffold写入也不加载；这让插件增量可测，却不能直接测整个真实配置组合。语法/schema用`plugin validate`，会话内skill-creator的格式也不互通。具备条件的订阅账户直接从shell运行可能发布私有artifact，`--no-publish`保留本地；hooks／真实MCP代码不受agent隔离保护，评估通过也不证明插件安全。这些是选工具及设预算的边界，不意味着该工具无用。**[一手：官方契约，未运行]**
- **市场管理者不等于集成作者。** Anthropic市场固定于[`c2bdb427`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/.claude-plugin/marketplace.json)：CodeRabbit指向[`3e8763d2`](https://github.com/coderabbitai/skills/blob/3e8763d24d543b48615b82535d02288de3ddae40/README.md)的CLI集成，Greptile指向[`6b725af2`](https://github.com/greptileai/claude-plugin/blob/6b725af2636072cab79e0a5426f6a960b0fd29ef/plugins/greptile/README.md)的MCP及随插件发布的CLI，Qodo指向[`866d301d`](https://github.com/qodo-ai/qodo-skills/blob/866d301dfbec39d5bb18bde72ac0dc770cc759a1/README.md)的skills包且需另装CLI。收录证明存在可接入路径，不证明评审能力、账户可用或净收益。**[一手：固定市场及发布方源码]**
- **安装可能改变工作流。** 同一Qodo固定版本的[`qodo-review/SKILL.md`](https://github.com/qodo-ai/qodo-skills/blob/866d301dfbec39d5bb18bde72ac0dc770cc759a1/packages/qodo/skills/qodo-review/SKILL.md)包含编码checkpoint与最终评审指导，并说明发送diff及提供的会话context至服务；默认auto可选择deep，不是花费上限。固定版本还声明`qodo review`处于closed preview，未加入的组织会被拒绝；这不是重试可解决的故障。它也禁止对无进展重复发现无限购买评审。不是本仓实际触发观测，但足以支持接入前读触发、外发及费用契约，而不是为已有原生评审再默认加插件。**[一手：固定指令，未运行；研究：采用边界]**

**历史状态。** 本轮补核四组事实，未自动升L3；GitClear完整报告、独立效果与本仓模型实测仍缺。当时全页入口一致性仍待独审，风险分层及原生起点不变。**[研究]**

**验证记录。** 全新上下文 reviewer 独立读取官方文档及固定源码，指出 Qodo closed preview 的资格门槛遗漏；补明后复核无剩余事实或采用问题。完整 `python3 scripts/check_offline.py` 14阶段通过（非空、无skip），`git diff --check`通过；仅验证本仓离线套件和补丁，不代表模型、插件或托管服务效果已验证。**[经验：执行与复核]**


## 安全插件：从提醒到自动模型评审

核实：2026-10-14（UTC）。主线二；改变09中将 security-guidance 当作“编辑时提示9类风险”的采用判断。新增证据是官方市场固定实现及真实失败／修复链；只读下载源码，没有安装、调用模型或运行插件。**[研究：范围]**

**来源身份。** 官方市场 [`c2bdb427`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/.claude-plugin/marketplace.json) 的 `security-guidance` 指向该仓库 `./plugins/security-guidance`，版本2.0.13；下述文件均固定同一SHA。`anthropics/claude-code` 另有同名目录，但不是该市场条目的实际源，不能把两个仓库的默认模型与安装逻辑混用。**[一手：配置与源码]**

**会改变选择的机制。**

- [`hooks.json`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/hooks.json)在编辑后注入模式提示，Stop及Bash commit／push匹配时安排后台评审；[`security_reminder_hook.py`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/security_reminder_hook.py)默认开启模式、模型、Stop与commit层，并检查凭据及具体运行条件。因此“默认开启”不是每次都执行成功。`ENABLE_CODE_SECURITY_REVIEW=0`关闭Stop与commit／push模型层；`ENABLE_STOP_REVIEW=0`仅关闭Stop层，不是全部模型调用开关。**[一手：配置和调用路径]**
- 同一hooks文件独立注册SessionStart的[`ensure_agent_sdk.py`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/ensure_agent_sdk.py)：SDK不可用时尝试建立持久venv并`pip install claude-agent-sdk`，特定失败下可改用`pip --target`；继承pip registry设置，未固定SDK版本。这个bootstrap没有读取模型层开关或`SECURITY_GUIDANCE_DISABLE`，所以“关闭模型评审／总开关”不能当作“不会准备依赖”的保证。这里仅证明代码可走到该路径，不声称本机发生安装；不接受这一副作用时不默认安装该插件。**[一手：独立入口与分支阅读；研究：选择]**
- [`llm.py`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/llm.py) 的 `_anthropic_base_url()`默认使用Anthropic端点，支持`ANTHROPIC_BASE_URL`网关；`_call_claude()`在Bedrock／Vertex／Foundry／Mantle等provider标志下转SDK／子CLI，继承provider环境。agentic reviewer允许Read／Grep／Glob查相关代码，`setting_sources=[]`且不启用bypassPermissions。故新增的是后台模型调用和输入范围，不能推断一定新传到一个额外第三方平台，也不能由主会话能调用模型就认定全部评审路径可用。**[一手：实现；研究：范围]**
- [`README`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/README.md)说明diff／相关代码发送给配置的模型端点；`llm.py`实际直连路径通过该端点的模型列表选最新Opus，失败时使用固定fallback，SDK路径使用CLI的`opus`别名。升级可改变模型与成本，固定模型需分别考虑`SECURITY_REVIEW_MODEL`及`SG_AGENTIC_MODEL`。组织安全指导拼入diff分析，但agentic路径没有同一`guidance_block()`调用，不能把一处规则文件当所有评审层共同的强制规则。**[一手：说明与实现交叉核对]**

**真实反例与修复范围。** [#2071](https://github.com/anthropics/claude-plugins-official/issues/2071)的作者报告2.0.0在其macOS Python3.9环境下模式提醒可用、SDK评审却未运行；另建3.12 venv仍被3.9宿主导入失败，暴露“bootstrap健康”与实际消费者不一致。该issue已由[#2073](https://github.com/anthropics/claude-plugins-official/pull/2073)关闭，固定2.0.13的[`sg-python.sh`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/sg-python.sh)优先兼容SDK的Python3.10+，bootstrap也检查宿主版本。它支持“提醒存在不等于深审可用”的反证，不支持声称当前版本仍普遍失效；README的Python3.8+前提也不足以单独证明SDK层可用。**[社区：作者失败报告；一手：修复状态及固定源码；研究：边界]**

**采用。** 原生定向评审足够就不加持续插件；需要时分清模式／Stop／commit／push层，核依赖政策、路由、预算及实际完成。模型层未运行、重复发现挤占核查或费用不合适即关层／撤回，保SAST、依赖扫描与风险人审；收益、召回和修复效果未测。**[研究]**

**限定独立复核。** 全新上下文reviewer重新读取上述固定市场／实现及失败修复链，核对独立bootstrap、provider路由、默认开关与正文页头，无剩余事实或采用问题。新增本地章节目标存在，`git diff --check`通过；完整离线验收由整合单元串行执行，结果见TASKS。未安装或执行上游插件，不声称真实运行或安全收益。**[经验：验证范围]**


## 评审窗口与输入历史的区别

主线三；核实：2026-10-15 UTC。改变的建议：撤回 Claude 入口中将内置 `/code-review` 视为“新鲜上下文”的说法，只在需要隔离实现历史时选择干净会话或非 fork reviewer。新增证据为两份当前官方客户端文档的交叉核对，未运行客户端或模型。**[研究：范围]**

[Code Review](https://code.claude.com/docs/en/code-review#review-a-diff-locally) 的普通命令步骤先说明后台子 Agent 有独立窗口，随后明确终端使用 forked subagent；[Subagents 的 fork 对照](https://code.claude.com/docs/en/sub-agents#how-forks-differ-from-other-subagents)则明确 fork 继承完整会话历史、系统提示和工具。这里不是要求用户另传 `--fork` 才成立的可选评审方式。独立窗口说明后续评审输出不充满主会话，不证明起始输入未含实现推理。**[一手：当前客户端文档]**

**范围及反例。** [评审前台例外](https://code.claude.com/docs/en/code-review#run-in-the-foreground)包括已有评审运行时再次启动、`-p`／SDK 和禁用后台任务；该页标记默认后台自2.1.218起。子 Agent 页另将一般交互 fork mode 默认标记为2.1.232起，不能把它当作 `/code-review` fork 机制首次发布版本。本文只确认读取日的默认终端契约，不推定所有宿主、历史版本或特殊配置等价。同一实现会话内启动默认评审是“窗口独立、历史继承”的具体反例；它可以利用已有背景，也可能继承原假设，但文档本身不证明实际误报率或独立 reviewer 的净收益。**[一手；研究：推论边界]**

**采用。** 就地复查保留内置命令；确需输入隔离才用干净会话／非fork并限定交接。已同步Claude入口与09，未改模板或重核权限／套餐。**[研究]**


## 无需修改与部分修复要一起评估

主线二／三；核实：2026-10-15 UTC。改变09的选样：同时检查已修任务的误改与部分修复任务的误停，不以补丁更少单独判断配置改进。**[研究：采用判断]**

[FixedBench论文v1 §3.2](https://arxiv.org/html/2605.07769v1#S3.SS2)报告：显式允许不改，在已修任务上减少无必要修改，却在先应用错误补丁的任务上增加误停。这是作者实验结果，支持增加对照任务，未由本仓独立复算，也不证明任何提示的绝对净收益。**[一手：作者论文；研究：范围]**

作者公开的同一Django任务两条轨迹中，[直接要求修复](https://www.sri.inf.ethz.ch/assets/blog/fixedcode/django__django-11239-fix.traj.html)仍改写已有证书参数传递；[允许不改](https://www.sri.inf.ethz.ch/assets/blog/fixedcode/django__django-11239-fix-or-abstain.traj.html)以mock捕获传给子进程的参数，确认已有实现后留下空补丁。它们只展示有限行为机制，不等于真实TLS连接验证。**[一手：公开轨迹]**

本轮未取得完整运行manifest或部分修复原始产物；论文Best／Worst同时改变Git历史与依赖准备，不能拆成环境收益。允许无补丁交付仍需核当前行为，不能依据历史commit自动停止。未运行上游代码或模型。**[研究：边界]**

## 工作流页历史页头

历史原文转存：2026-10-16（UTC+8），来自 `docs/07-workflows.md` 的原页头。以下保留当时的核查日期、范围和来源说明；相对链接以原页面路径为基准。

```text
> 核实时间：2026-10-08；Hook 与迁移建议于 10-11 复核，HumanLayer 效果说法于 10-12 核对；10-13 收窄 Plan 和新会话的默认要求，10-14 补充第二次需求修改的验收建议；10-15（UTC+8）按契约与反馈收窄 Spec／TDD 首选，并复核 Ralph／长时 harness 的采用与撤回、`/goal` 的证据／成本边界及纠错后的流程选择；2026-10-15（UTC+8）独立审阅全文核心建议与相关入口，收敛工具与计划入口冲突；10-16（UTC+8）核Kiro显式修订能力与历史批评范围，并限定Plan示例的客户端／权限范围；不代表所有外链或当前模型效果已重新验证。
```

## 存量安全审计：候选发现到维护者接收

**2026-10-20（UTC+8），P20／主线二、四。** 在既有静态分析、测试和人审之外，仅对安全／数据授权、目标版本和接收人明确的漏项试定向Agent审计。仅泛泛告警或边界不清就不启动批量扫描／自动上报。[研究]

AI梳理路径、对照契约、拟复现与补丁；人判输入可达、信任边界、误报、修复完整性和发行。AI独立完成比例未知。[研究]

本轮只读公开修复资料，未运行扫描、漏洞、模型或上游测试，也未扩代码访问／披露权限。[研究]

### 先比较现成路线，不为审计另造平台

**已能稳定发现目标问题的检查先保留。** 编译器、静态分析和 fuzzing 有各自覆盖，Agent可补代码意图、文档和跨路径推理，但不能把未发现解释为无漏洞。[Mozilla接收方2026-03-06复盘](https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/)明确，已有长期 fuzzing／静态分析／安全审查后，新的AI辅助方法仍带来可验证发现；也有断言失败与传统 fuzzing 覆盖重叠。不同类型问题应分别记录，不能将全部报告都计作新增安全价值。[一手／研究]

**只需一次窄核查，先比较现有原生评审；持续需要证据管理再评专用工具。** 当前 [Codex Security官方总览](https://learn.chatgpt.com/docs/security)区分连接仓库的Cloud、交互式本地插件、重复扫描CLI与SDK；OpenAI推理需相应访问资格，Cloud另需工作区权限、GitHub连接及兼容云环境。入口齐全不证明当前任务更有效或已经获准部署。本轮未安装、连接或运行，也未核个人资格／费用；不把研究建议写成已经接入。[一手／研究]

### 接收方的证据，比报告自称确认更重要

Mozilla原文称最小测试帮助工程师复核并在Firefox148前修复；22项安全问题与90项普通bug分列，支持验证材料＋工程师接收，不证明无人审计、普遍优胜或净收益。[一手／研究]

**curl的正面经验也包含熟练工程师，而非只交模型输出。** [维护者2026-10-14对Aisle审计的回顾](https://daniel.haxx.se/blog/2026/10/14/a-curl-audit-by-aisle/)强调长期合作、详细准确发现和多项人工代码贡献。原文所述约一年合作的累计结果，不等于单次扫描产出，更不能拿来算单价、模型排名或节省工时；本轮未取得同口径成本与漏报分母。[一手／研究]

**反例要求先核契约，而不让模型的 confirmed 成为门禁。** [curl维护者2026-05-11记录](https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/)中，五项自称已确认的安全问题，经团队核查只剩一项低严重度漏洞，另三项是API文档已说明的限制，一项是普通bug。此单仓单轮不是普遍误报率；先前工具已修掉许多问题、扫描顺序不同，数量也不能横比模型强弱。[一手／研究]

### 一条已发行修复链，保留缺失的回归证据

**CVE-2026-92392证明发现与修补可以由不同角色完成。** [curl官方公告](https://curl.se/docs/CVE-2026-92392.html)记2026-09-15报告、10-14随8.23.0发布修复；报告署名Luna with Claude，补丁作者Stefan Eissing。它不是Aisle发现，不把两条采用证据合成同一产品效果。公告涉及HTTP/2上传中的对象生命周期错误，实际利用有附加环境条件；本研究不展开攻击实现。[一手／研究]

**固定修复不等于已经得到完整回归回执。** [补丁8b0744af5b1b631da5b938ca31c3f9895ad5a321](https://github.com/curl/curl/commit/8b0744af5b1b631da5b938ca31c3f9895ad5a321)只修改lib/multi.c，没有随此提交新增测试文件。本轮只读变更与公告，未执行测试或核指定发行树CI；因此只确认修复进入发行，不能称“新回归已通过”。采用者还应取得覆盖错误处理路径与正常上传的验证定义、环境和结果，避免修复异常路径却破坏正常功能。[一手／研究；回归要求为建议]


### 从汇总追到具体接受与降级

**Firefox的一个发现已有修复及维护方验证，不只汇总数字。** [148安全公告](https://www.mozilla.org/en-US/security/advisories/mfsa2026-13/#CVE-2026-2773)将CVE-2026-2773归于Anthropic团队使用Claude；[Bug2014832](https://bugzilla.mozilla.org/show_bug.cgi?id=2014832#c3)记录ASan环境下独立复现。人工评审后的[固定补丁63376b3965e8bd473b578a24573f71d76b1acb3e](https://github.com/mozilla-firefox/firefox/commit/63376b3965e8bd473b578a24573f71d76b1acb3e)在声道变化时重建重采样器，替换前释放旧实例；[148回移2f7c633b0e64e64a70edea4904ee1684f0a87f99](https://github.com/mozilla-firefox/firefox/commit/2f7c633b0e64e64a70edea4904ee1684f0a87f99)与公告提供发行链。[一手：源码／维护记录]

**修复验证与回归长期留存须分开。** [Bugmon评论23](https://bugzilla.mozilla.org/show_bug.cgi?id=2014832#c23)记在20260215214423-7edce67f9460验证修复，这是维护方自动验证，不是本仓复跑或整套测试全绿。[D282787，diff1202218](https://phabricator.services.mozilla.com/D282787)定义音频解码等待结束的崩溃回归并注册列表，没有正常音频输出断言；当前显示Accepted，未取得该回归的落地及运行回执。Bug评论12说明按安全策略延后测试，covered=yes不能充运行证据。[一手／研究]

**报告内部降级与维护者最终驳回不能混算。** [维护者公开的固定报告](https://gist.github.com/bagder/c9b83a19f30e82e41b11f6315465b17a/2c5cf7f8d4afa5e1ce6e4eb81742ee16a5e65c5c)将HAPROXY连接复用项移出安全发现：调用方控制相关handle并选择上游，宜按文档说明或普通bug处理。这是报告自身明确的分类修订，不能算入最终五项confirmed中的驳回数量。[一手／研究]

**同版本API契约可以直接推翻候选的支持范围。** 上述报告F5假定并发线程共享HSTS，而目标树455bebc2c76223a1be26042f6d2393715c0df0cd的[CURLSHOPT_SHARE文档](https://github.com/curl/curl/blob/455bebc2c76223a1be26042f6d2393715c0df0cd/docs/libcurl/opts/CURLSHOPT_SHARE.md#curl_lock_data_hsts)明确不支持该用法。可判其安全论证越出支持契约；维护者原文没有给三项误报的编号映射，故不虚构“维护者逐项驳回F5”的回执。没有CVE也不等于所有相关改进都无价值。[一手／研究]

已核发现→人工补丁→发行、维护方验证及分类修订；Firefox永久回归落地／运行回执仍缺。2012018／2012608访问被拒后跳过，未登录、绕过或执行报告命令；仅补公开证据，未新增实验权限或模型／项目净收益结论。[研究]

### 采用与撤回

**先交有边界的候选。** 固定版本、输入／权限假设、文档契约、预期／实际差异及影响，区分源码推理、受控复现、维护者确认、补丁和发行。测试也要审；已修、非目标配置及硬化建议分列。[研究]

**处理成本超过新增有效发现就收窄或停止。** 先剔除重复报告、已有工具结果和文档允许行为，再缩到风险路径；仍无可复核材料则转人工，互评投票不能替事实。保原CI、人审与安全发布，候选不自动授权合并、上报或部署。[研究]

**按接收结果衡量。** 同一窗口记录可复核、被接受及实际修复的数量，另列重复／驳回数量、核查与返工时间、环境成本及漏检来源。现有链缺同题费用及完整工时，不设收益比例或默认新付费服务。[研究]

本轮未运行模型、扫描、漏洞、客户端或上游测试；离线检查不改变此边界。[研究]


## P52评审代际复核

核实：2026-10-21（UTC+8），基线c484b1a；按P51提示检验09是否仍应原生起步，以及何时扩量／减人审。**确认确定性检查与按风险人审，扩量同时考察漏审及有害误改。** 当前整体最优未知；领先参照的审批表不直接移植，本仓采用原生定向评审这一可行基线。[研究]

| 原始来源／本次相关正文 | 比较与决定 |
|---|---|
| [Claude Code团队复盘](https://claude.dev/blog/solving-code-review-at-anthropic/)，Addy Osmani／Morgan Westlee Lunt／Qing Wang，10-15；风险、校准及收敛节 | 事故案例与无须修改的PR一起校准，避免评审诱发错误修补；规模／具体评审模型／完整人力成本未披露。借校准机制，不复制其全量托管或人审人数。[一手：团队自报] |
| [Code Review文档](https://code.claude.com/docs/en/code-review)，滚动页10-21核；[GA公告](https://claude.com/resources/articles/code-review-is-now-generally-available)，10-15 | 官方确认已离开研究预览，Team／Enterprise按仓库选三档。修正09入口状态；GA不升级质量评级，三月数据留作历史。[一手] |
| [CRBugBench v1](https://arxiv.org/html/2610.13668v1)，Chenyang Yang等／Microsoft，10-09；方法与模型范围 | GPT5.6-Sol、Opus5及copilot-cli1.0.74的单评审／五候选比较，预算不匹配；不能外推GPT6.1或5.5下多Agent无益。原数值沿用既有核查，不伪称本次重算。[一手：论文／研究] |
| [Bugbot更新](https://cursor.com/blog/bugbot-updates-june-2026)，Jason Smale／Yuri Volkov／Michael Zhao，6-10；重复diff与增量复审 | 确认复审先查新差异、避免重复意见；该代模型与harness自报不是10月当前效果实测。[一手] |
| [Maintaining software](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family)，Rodrigo Roim，10-14；维护清理段 | 更强Agent可自主扩大取证，实际清理仍交相应团队评审；不是评审产品比较。[一手：背景反证] |
| [The End of Code Review v1](https://arxiv.org/html/2606.13175v1)，Martin Monperrus，6-11；摘要及论证定位 | 人审冗余为观点论证，不是新实证结果，不足以推翻风险准入默认；不把其转引当本轮新实验。[一手：观点原文／研究] |

只读原文、没有运行上述服务或模型。新增层先在单仓比较，评论回到原需求和授权筛选；有害误改或事故增加就收紧，不因轮次减少自动通过。既有2025调查与跨年观察数据仍只指导抽检，不估当前模型缺陷率。[研究]

**P51回执（执行者自报）。** 提示blob为98f326ab4975771d797b1a14348694cbd3b3f744；11:30:02 UTC开始，11:32:05冻结来源／决定，11:32:58完成候选稿；11:33:25补同源署名，未回改冻结计数。冻结前墙钟123秒、撰稿53秒，纯阅读／等待未知。N=7/F=7，D=5/FD=5；已知原文重读5，GA与反方观点新读2。决定性为团队复盘、当前文档、GA公告、CRBugBench、Bugbot五项，OpenAI维护与观点为背景反证；正文读取仅相关节。预先读过C10不构成盲测；尚无完整独立漏检分母。09与02／03合算P52一次自用。[研究]
