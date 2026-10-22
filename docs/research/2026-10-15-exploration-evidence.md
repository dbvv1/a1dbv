主线：M6／主线 1、2，外部探索怎样支持可采用的选择。
改变的建议：借现成检索综合与评测量规，只补决定性证据、失败状态和生成交接，不先自建研究框架。
新证据：2026-10-21 补六线团队来源名册、三篇自用条件卡与Cursor环境／Claude Code评审漏检校准；2026-10-20 补本仓深链检查的前向需求、候选固定源码与真实采用成本，维持原法而未产生可直接采用的陌生增量；2026-10-15 核读托管研究说明、三个固定开源实现、评测论文与评分源码；补核 Steam 公告同源正文读取及限长对照，区分抽取失败、来源身份与权限边界；重读 OpenCode 同提交文档／实现及 Unity 6.3 弃用／保留绑定，补来源冲突的处置。

# AI 探索：系统与评测证据

核实时间：2026-10-15。以下来源由本轮调查读取，重要源码以固定 SHA 定位；独立核查修正了空上下文守卫的范围、ALCE CLI 输入契约、DRB II 版本与禁源边界。资料核验不等于模型效果实测。

## 摘要：建议和证据各到哪一步

- ✅ 采用需求卡、决定性证据核查、条件决定与生成交接的设计，正文见 [25 AI 探索](../25-ai-exploration.md)
- 🧪 按来源与控制需求选一个已有权限的托管 Research 产品，不要求每题比较三家；额外核查按风险选择
- 👀 有来源控制／固定版本缺口时评估开源管线；LangChain 归档方案暂缓原样新部署，GPT Researcher 的局部守卫不等于全部无证据路径已解决
- 评测借原子量规、引用支持和缺项分析；不把引用数、Agent 投票或短答案榜单当开放探索总质量
- 三类纸面走查见[案例记录](2026-10-15-exploration-cases.md)；它们围绕熟悉来源构造，未证明未知发现或实际净收益

评级是条件设计判断，不是产品性能排名。官方说明证明其公开契约，静态源码支持具体路径，使用者帖子支持其报告的问题；没有一项自动构成本仓当前模型的真实任务结果。动态价格、模型、访问范围和版本只在上述核实日有效，准备采用时再核；访问失败保留未知，不更新为核实成功。本节所比较研究产品／管线的完整执行成本与实际质量尚未由本仓观察，不填零或宣称领先；后续三题渠道策略先导另见[实际结果](2026-10-12-experiment-records.md#三题检索先导实际结果与采用决定)，不作为这些产品的效果比较。

## 六环节覆盖，而非功能名单

“有”表示资料可见机制；“需补”表示本次查到的交付契约未覆盖 M6 要求，并非证明产品绝不具备此能力。

| 系统及定位 | 定义 | 检索 | 甄别 | 收敛 | 转化 | 评估 |
|---|---|---|---|---|---|---|
| ChatGPT Deep Research，交互式受控研究 | 可审改计划、澄清 | Web/指定站点/上传/支持的 apps | 引用、来源清单、活动历史；需另核证据支持，是否独立按风险选择 | 结构化报告 | 可导出；需加约束与验收交接 | 未见面向用户的任务级真值评估契约 |
| Claude Research，多方向广度搜索 | lead agent 分工 | 连续搜索、连接器；移动端有范围差异 | 历史工程披露有独立引用定位 | lead 汇总 | 需补生成任务契约 | 内部评估是厂商自报，不能当独立质量证明 |
| Gemini Deep Research / Max API，异步整合 | 可开启计划协商，默认关闭 | 搜索、MCP、URL、文件/多模态 | 引用可回查，仍需核验 | 长报告、比较 | 可视化不是验收；不支持结构化输出 | 需外置评估与费用记录 |
| LangChain open_deep_research，归档图式架构 | 澄清与 research brief | 可配置搜索与研究并发 | 压缩研究，保留 raw_notes；无错误完成保障 | final_report_generation | 需补决定契约 | 有 DRB 导出流程，但历史结果不能证明当前效果 |
| GPT Researcher，检索/正文管线 | query/subqueries | 多 retriever、抓取、上下文筛选 | 当前版本有 snippet/full-text 区分和空上下文拒答守卫 | report writer | 需补约束与验收 | 有 factual / quality / hallucination 多套评估；指标语义须读代码/定义 |
| smolagents 示例，代码管理者+搜索者 | question；有限澄清 | 搜索、翻页、档案、文件、视觉工具 | 自带步数边界；需补来源账本 | 回答，不是决策表 | 能计算不等于可靠交接 | GAIA 历史自报；数据手工预处理限制可比性 |

## 现成方案按来源和控制需求选择

### ChatGPT Deep Research：🧪 试用“要明确限定来源、审计划”的任务

[一手] 当前帮助页支持计划预审与运行中调整，站点可选“仅这些站点”或“优先但允许全网”；输出有来源和活动历史。连接器研究仅用读取动作。剩余额度依订阅与产品计数器，不把旧的每月次数写成当前定额。[官方说明](https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt)

[经验：条件判断] 值得借的是“来源范围是可检查配置”。官方资料优先检索与独立使用反例检索应分开，避免只允许厂商站点后把宣传当成熟度证据。不适合把一次长报告直接当安装/购买结论。

[社区] 2026-10-04 的原帖报告特定账户返回 0 搜索、0 引用，并描述同机另一账户的对照；后续回复一人称恢复、另一人仍称失败。这只支持把“运行结束但无可检查来源”列为异常验收项，不能外推整个产品失效，也不能宣称官方确认了根因。[原帖与后续](https://community.openai.com/t/account-specific-deep-research-failure-0-searches-0-citations-for-months-case-15420179/1403206)

采用条件：交付须列实际打开的决定性来源；失败时返回未完成，不能接受无来源的常识型替代报告。撤回条件：关键硬约束不能定位到可打开的原文，或报告忽略指定来源边界。

### Claude Research：🧪 试用“问题可拆成互不依赖搜索方向”的任务

[一手] 2026-10-15 帮助页写明付费计划可用，研究消耗共享会话用量；移动端发起时只查 Web、不会使用连接器且不提示跳过；也不能使用 Desktop 本地 MCP。当前说明为 Opus 5.5，必要时回退 Opus 4.8，不应把 2025 工程文章的 Opus 4 / Sonnet 4 当当前配置。[当前产品说明](https://support.claude.com/en/articles/11088861-use-research-on-claude)

[一手，历史工程披露] 2025-06 的 orchestrator-worker 与 CitationAgent 分离值得借。作者披露过重复研究、过度派发、无结果仍继续等失败；其多 Agent 约为聊天 15 倍 token 的观察是该系统历史数据，不是当前价格或普适倍率。内部“提升 90.2%”不转为推荐理由。[工程原文](https://www.anthropic.com/engineering/multi-agent-research-system)

[经验：条件判断] 适合按渠道/问题分工，不适合各 worker 都写同一份总报告。子任务必须交代目标、输出、来源范围与终止条件；独立核查者应读原证据，不能只批评汇总文风。需要内部来源而使用移动端时不采用该路径。

### Gemini Deep Research / Max：🧪 试用产品；👀 评估 API 接入

[一手] 2026-04-21 发布采用 Gemini 3.1 Pro 的标准/Max 研究代理、MCP、计划协商及多模态输入。厂商对“最高质量”的判断和内部 win-rate 图不算独立比较。[发布原文](https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/)

[一手] 当前 API preview 的 agent IDs 为 deep-research-preview-04-2026 / deep-research-max-preview-04-2026；协商计划默认关闭；暂无结构化输出，最长研究 60 分钟，后台存储有要求。官方估计标准任务 $1–3、Max $3–7，按底层 token 与工具计费，不是封顶报价。不要将它等同 Gemini App 的订阅额度或认定 Max 对每题都更划算。[开发文档，2026-10-13 更新](https://ai.google.dev/gemini-api/docs/deep-research)

[社区] 开发者论坛有 Max 在 in_progress 后 500、同请求标准版可完成的对照报告；未经本轮复测，不当作当前普遍故障。[原帖](https://discuss.ai.google.dev/t/regression-deep-research-max-via-interactions-api-fails-with-http-500-after-in-progress-while-standard-deep-research-works/171823)

[经验：条件判断] 需要异步来源整合时值得评估；若后续获准进行 API 试用，先评估标准版，只有困难案例显示真实覆盖不足才评估 Max。机器消费输出须再做 schema 验证；超时、失败与无来源不能混成完成。计划审批不是费用硬上限，必须另设预算终止/人工升级条件。

## 开源架构：固定版本读机制与失败，不以 stars 评级

### 1. LangChain open_deep_research：机制可借，原样部署暂缓

[一手] 仓库 2026-08-21 已归档；本轮确认最新 commit 为 1b7d2e80db9faa586165c60e09096dbbfd483a64（2026-08-10）。[仓库状态](https://github.com/langchain-ai/open_deep_research) / [固定提交](https://github.com/langchain-ai/open_deep_research/commit/1b7d2e80db9faa586165c60e09096dbbfd483a64)

[一手，源码] 澄清、brief、supervisor、研究子图、压缩与最终报告分层；保留 raw_notes。并发和迭代可配，不等于总 token/美元预算。[主图](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/src/open_deep_research/deep_researcher.py) / [配置](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/src/open_deep_research/configuration.py)

[社区 + 一手源码复核，未运行] #283 的子研究异常被视作正常结束，最新 SHA 的 L334 仍为 `is_token_limit_exceeded(...) or True`；外层 L715 会进入 final_report_generation。故“有报告”不能证明全部研究分支完成。[原报告](https://github.com/langchain-ai/open_deep_research/issues/283) / [固定错误路径](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/src/open_deep_research/deep_researcher.py#L332-L344)

[一手] README 的 DRB 评估与成本属于历史配置，不能视为当前成本。可借研究和压缩分模、raw_notes 留存、可配置并发；要复用则必须先明确 complete/partial/failed，验证一成功一失败的 fan-out 不会伪装全成功。现在没有必要为 M6 安装这个已归档执行器。[固定 README](https://github.com/langchain-ai/open_deep_research/blob/1b7d2e80db9faa586165c60e09096dbbfd483a64/README.md)

### 2. GPT Researcher：👀 评估可控来源管线，不能跳过引用核查

[一手] 本轮最新 commit 3582a6841fe7dc801e2a34e34ee408641aea9bce，2026-10-10。Apache-2.0 项目，代码许可不授予抓取材料或第三方服务的使用权。[固定 README](https://github.com/assafelovic/gpt-researcher/blob/3582a6841fe7dc801e2a34e34ee408641aea9bce/README.md)

[一手，源码] 检索器可声明结果是摘要还是已获取正文，前者须抓取；当前 writer 对空上下文直接拒绝撰写可靠报告。可借“输入契约明确 + 空上下文拒答”，不要照搬 README 关于多站点频繁出现即更可信的假设。[retrieval L897–924](https://github.com/assafelovic/gpt-researcher/blob/3582a6841fe7dc801e2a34e34ee408641aea9bce/gpt_researcher/skills/researcher.py#L897-L924) / [writer L77–88](https://github.com/assafelovic/gpt-researcher/blob/3582a6841fe7dc801e2a34e34ee408641aea9bce/gpt_researcher/skills/writer.py#L77-L88)

[社区，历史反例] #1572 为自定义 RAG 没搜到材料却生成来源；当前源码已增加空上下文拒答守卫；这不证明所有无有效证据的路径均已解决，也不能说历史问题现在仍必然复现。#2100 为 prefetched 正文被用到但未入引用列表，2026-09-26 已按 #2123 修复预取来源未记入引用集合的问题；当前源码确有 visited_urls 更新。此处只做静态核对，未验证所有去重边界。[空来源原帖](https://github.com/assafelovic/gpt-researcher/issues/1572) / [引用丢失原帖及关闭记录](https://github.com/assafelovic/gpt-researcher/issues/2100)

[一手] evals 分事实、报告质量、幻觉；尤其其 Citation Faithfulness 指“参考条目有没有在正文引用”，并不是引用语义是否支持结论；另有 Unsupported Claim Rate。评估名称本身会误导，必须拆指标。域名后缀 authority heuristic 也不能证明商业工具实际可用。[固定评估定义](https://github.com/assafelovic/gpt-researcher/blob/3582a6841fe7dc801e2a34e34ee408641aea9bce/evals/README.md)

[经验：条件判断] 成本必须合并模型、搜索/抓取、上下文筛选、重试、核查与部署维护；作者的 $0.4/o3-mini 与特定 filter benchmark 均不是本任务报价。试用前记录 model/search/filter/commit；空结果、来源缺字段、某分支失败、抓取受阻四类验收不过则暂缓部署。

### 3. Hugging Face smolagents Open Deep Research：👀 评估工具组合，不当生产模板

[一手，源码] 固定 SHA 96f33faaf028479119ec8d34507b47694cf14e34（2026-10-06）；CodeAgent 管理搜索 ToolCallingAgent，网页/文件工具分工，12/20 步上限与每 4 步计划。示例仍默认 o1，manager 的 additional_authorized_imports 为通配符，不能原样当安全隔离方案。[固定 run.py](https://github.com/huggingface/smolagents/blob/96f33faaf028479119ec8d34507b47694cf14e34/examples/open_deep_research/run.py)

[一手，作者自报限制] README 的 GAIA 分数不是开放选型报告质量；作者披露对单页 PDF/XLS 手工生成 PNG 并替换输入，不能把该分数当任意原始文件零人工流程的效果。[固定 README](https://github.com/huggingface/smolagents/blob/96f33faaf028479119ec8d34507b47694cf14e34/examples/open_deep_research/README.md)

[经验：条件判断] 对要读文档、跨网页计算的题可借工具边界与步数控制；要形成引用账本、授权筛选、候选决策与生成约束仍需外围设计。模型与搜索服务费用、文件工具维护、执行隔离都要计入。未找到足以证明当前示例在真实选型任务稳定交付的独立使用记录，故不升“试用”评级。

[研究] WARP v2（2026-09-03）在 STORM、Co-STORM、OmniThink 上模拟检索投毒：多次搜索可能反复命中同一 UGC 页面，引用真实 URL 仍可传播植入推荐；去掉 UGC 又损失有用信息。商业系统的来源分布观察不是对其成功投毒实验。不能把该结果泛化成某厂商当前必然易受攻击，也不能把“只搜官方”当全任务解法。[论文原文](https://arxiv.org/html/2605.24245v2)


## 评测证据：先分清测量对象

| 方法 | 可以借的能力 | 不应外推的能力 | M6评级 |
|---|---|---|---|
| BrowseComp | 难找但可核对的短事实、多跳检索耐心 | 优秀工具选型、设计品味、权衡、开放候选覆盖 | 👀 仅作检索子能力 |
| Researchy Questions | 非事实型、多视角任务素材 | 点击日志不是优质答案标签，不能把高点击当可信 | 👀 任务素材 |
| ResearchRubrics | 明确/隐含需求、综合、引用、表达等原子量规；区分必选和可选 | 不能由生成者自己编量规再自评分即称独立通过 | ✅ 借纸面结构；👀 自动judge |
| DeepResearch Bench / RACE+FACT | 报告质量与引用支持分开；claim–URL去重核对 | “有效引用数”奖励量；参考报告/自动生成量规可能偏置 | 🧪 借核查结构，暂缓照搬总分 |
| DeepResearch Bench II | 从专家报告提炼信息、分析、表达要求 | 被参考报告限制的覆盖，不是开放空间的全部；禁参考源不适用于复用任务 | 🧪 借专家锚点设计 |
| DRACO | 含购物/UX等更接近日常决策的专家量规；错误可扣分 | 单轮、文本、静态英语任务；产品黑箱差异无法归因给多Agent | 🧪 借负面条件 |
| ALCE / TREC RAG | 引用是否支持、应有支持却未引用、信息点覆盖分开 | 支持不等于原来源正确，封闭语料结果不等于实时网页质量 | ✅ 借定义；👀 借代码 |

依据：[S1–S8]。这是方法适配评级，不是产品排名。

### 一项会改变推荐的反例：找到参考文到底算不算作弊

DRB II 使用专家文章构造量规，并按具体源文章的标题/URL排查直接使用这些文章的泄漏（不是封禁整个域名），适合区分独立调研与检索现成答案。[研究，S5] 但M6明确要求先找已有好答案：若用户要选已有方案，找到并核查优秀比较文章是成功的一部分。不能把DRB II的禁源策略无条件搬入M6。

应预先分两类任务：
- “发现与复用”：允许原比较文作为发现入口，但必须核查许可、版本和读者约束；不能把原文推荐原样当自己的独立比较
- “独立重建/综合能力”：才屏蔽已知报告；若工具无法保证屏蔽，结果记污染/不确定，不能靠一句禁止访问宣称有效

这一区分来自任务目标推导，而非某个基准作者替M6作出的保证。[经验：设计推断]

## 评分源码：借定义前先核输入契约

### ALCE：原样 CLI 会把长报告截到首行

固定提交 `246c476a4edfc564266b7346b6e29ef4861ae937` 的 `eval.py`：
- L483 的CLI默认 `at_most_citations=3`：对每个句子的引用列表至多取前三条，不是整篇报告只允许三引文；底层函数参数可取None
- L508 的CLI主流程把输出按首个换行截断；这是该脚本预处理，不是ALCE指标本身要求
- `compute_autoais` 同时核查联合支持与多引文中的冗余，并分开返回 citation_rec / citation_prec

因此将完整 Markdown 报告交给原样 CLI 可能只评分标题；应先适配输入和引文截断设置，不能据此说 ALCE 算法无法评长文。这是源码静态事实，不是运行复现。[一手：固定源码，C1]

### ResearchRubrics：加权分不能替代门槛

固定提交 `2dc80e2d4c38ddd80439517c259d93c6954b193f` 的评分脚本按每个sample累加 score×weight，再除以正权重和。[一手：固定源码，C2] M6若把许可证错误与几项表达优点一起平均，会掩盖不可采用项。故只借原子判断；硬约束列为门槛，不用新造复杂权重体系。[经验：设计推断]

### DRB II：评分依据是报告文本；“有引用”并非独立网页核查

固定提交 `b38f360603db9531b102aef8c166cedb8509b6f6`：`run_evaluation.py` 的提示词区分满足、遗漏、引用被屏蔽的任务源文章，要求报告中的支持句；有150000字符截断配置。`aggregate_scores.py` 统计score=1占全部已返回数字条目比例，另报blocked_rate；0和-1仍在分母，不能被注释中的“ignored”误导。这里借的是报告对量规的匹配，不是自动证明每条引用真实。[一手：固定源码，C3]

只读核查不足以证明容错、安全、执行成本或对中文任务的可靠性。代码和数据许可也须分开：DRB II README声明代码Apache-2.0、数据逐任务沿用来源许可；论文特别提醒含非商业许可来源。不应把公开下载等同于可以将数据整包商用再分发。[S5、C3]

## 最小评价：沿用需求卡与证据表

以下是建议的最低记录，不是已被实测的阈值。任务开始前固定需求和必查项，结束后核对原文；若误判后果、来源冲突或作者盲点值得额外检查，再由未参与写结论的人／核查 Agent 补核。人工最终复核会改变采用决定的分歧，不要求每次都增加独立评审。

### A. 三个门槛，任何一个失败都不能写“采用”

1. **硬约束**：成本、平台、许可、隐私/离线、目标用户等已经在需求卡指定的条件，逐项满足/不满足/未知。未知不能自动算满足
2. **决定性结论有支持**：所有会改变采用/放弃的事实，记录原文位置、日期/版本和适用范围；无支持就撤回或降级，不以流畅表达补偿
3. **比较没有致命缺项**：主要备选/不做/继续现成方案有被合理考虑；至少解释最强反例或为何某路线不合约束。是否值得加某方案，必须对照不加时的基线

这是对现有rubric方法的轻量化应用。[S3、S6；设计推断]

### B. 只报告四项诊断和成本，不合成质量总分

1. **要求覆盖**：逐条核心问题“已用证据回答/部分/未回答”，必选与附加分开。回答字多不增加覆盖。可借 core/background/follow-up 分类，但必须按本任务指定权重或仅分组，不把自动拆分当完整问题空间。[S9]
2. **引用支持**：对决定性事实全部核查；其余若抽样，写明抽样方法与数量。按TREC的完全/部分/不支持标记，另外保留“原文无法访问/无法判断”，不把抓取失败当事实错误。复合断言先拆原子项；同句数字、比较范围、日期任一缺失不能记完全支持。[S7、S8；无法判断项为M6保守扩展]
3. **已知好答案发现**：评审者事先确定的小集合中，发现并正确处理了几个；记录发现入口与原文。只命中名字却错误推荐不算通过。锚点没有出现时核对其是否已过时/不合需求；如果新候选更好，保留新增价值而不是惩罚“偏离答案”
4. **来源风险**：逐个决定性证据标“原始/转述/厂商自述/推广利益/已过时或版本不符/未知”。报告发现的具体问题，以及它是否流入最终建议；不要用广告链接比例直接当质量分

成本只列实际研究与复核工时、读取/搜索次数、API/订阅支出（如无观测则未知）。以后比较策略时，同时固定总预算、题目、日期窗口和工具权限；多Agent并行省墙钟时间不代表少总工时/token。[经验：设计推断]

### C. 一条足够用的记录格式

“要求或决定性断言 → 支持它的原文位置/固定版本 → 来源的原始生产者及利益关系 → 满足/不满足/未知 → 对采用决定的影响”。

不是要求每个背景句都建表；先做影响选择的部分。短任务可以只写几行，长任务按未决问题分组。以原文和可复核理由解决分歧，不靠票数解决。[经验：设计推断]

## 来源多样、SEO与独立性

### 不把域名数量当独立来源

同一厂商的官网、GitHub、博客是不同页面但相同利益主体；十篇转载同一新闻稿仍然只有一个上游证据。同一代码库的README与源码可互相查实施是否一致，却不构成外部效果复现。不同模型读取同一网页同样不会产生第二份外部证据。[经验：方法推断]

建议只对重要结论追溯一层上游：谁产生事实、谁独立观察、是否引用同一实验/数据。任务需要互补渠道，例如开发者源码核实机制、使用方复盘核实部署代价；没有必要为域名配额添加无关网站。官方文档足以证明某API签名，无需人为凑三方；“明显提升生产效率”则需要独立使用证据或实验。

### 一手来源冲突：按断言决定下一步

2026-10-16（UTC+8）补核。✅ 对齐版本只是起点；还要分清公开契约、具体实现、当前配置与服务资格。已有 Agent 权限与游戏 API 的核查支持这一步分流，不支持“源码总比文档可信”的等级表。**[经验：条件建议]**

- **同版本仍可能不一致**：重读 [OpenCode 既有核查](2026-10-12-community-source-records.md#opencode规划权限与文件恢复分开选择)所引 `f40dc433` 的 `agents.mdx` 与 `plugin/plan.ts`：前者写编辑／bash 默认 ask，后者注册 edit 全局 deny、计划目录 allow。下一步是核目标入口的有效权限，不把文档默认值照搬，也不把局部实现升级为所有写入路径的隔离证明。**[一手：同提交文档与源码]**
- **表面冲突可能回答不同问题**：重读 [Unity 物理查询核查](2026-10-14-game-wp10-client-modules.md#物理查询补研刚改位置不等于物理查询已看到新位置)所引6.3手册、6000.3.0f1发布说明和 `c57f9f00` 固定绑定：手册仍教设置 `autoSyncTransforms`，发布说明已弃用，绑定仍保留带 `Obsolete(..., false)` 的 extern get/set。新代码采用显式同步，不据兼容保留推荐新用旧属性，也不把弃用写成已删除。**[一手：手册、发布说明与公开绑定]**

**迁移边界**：这两例支持按问题限定证据用途，不证明任一类来源总正确。固定 main 不证明已发行；源码默认值不证明当前实例的配置；接入实现也不能代替提供方资格与条款。无法消解且影响硬约束时，暂停依赖该保证的采用，指出缺哪项发布／配置／资格证据；不凭来源票数裁决。只读核验，未运行客户端、引擎或模型，没有实际收益或完整安全验证。**[经验：处置与边界]**

### SEO/广告：用风险标签和抗干扰案例，不做万能过滤器

Webis的2024纵向研究考察产品评测查询，发现SEO、联盟营销与低质重复内容相关；其范围不能推广为“所有商业网站都不可信”。[研究，S10] GEO论文表明加引用、统计或引语能提升生成引擎可见性，但可见性指标不等于真实性。[研究，S11]

可纸面加入的两个失败案例：
- 高排名“最佳工具”列表只复述厂商宣传且有返佣；候选可保留，性能结论必须追原始测试，不按排名采用
- 厂商定价页带销售按钮但给出当前金额；仍是价格的一手来源，不能因为商业属性屏蔽

将“营销利益”和“错误/无支持”分开；也区分结果中的污染与最终建议受污染。不能仅凭文风、FAQ结构、关键词密度判定AI生成或广告。[经验：设计推断]

最新观察：2026-10-10的GEO预印本研究两个商业市场的引用，提示模型先验、品牌和检索选择影响可见性；仅作追踪信号，不作为普遍因果定律或既定检测器。[研究：新预印本，S12]

### 多Agent只提供另一轮检查，不自动提供独立证据

MAD研究在其9基准/4基础模型设置中发现，增加辩论计算并未可靠击败强单Agent基线；异构模型可能改善但不保证事实来源独立。[研究，S13] M6里应区分：
- 自评：作者或同上下文Agent评价自己的结果，仅为查漏
- 独立核查流程：核查者先拿需求、断言、原始材料，避免先看作者分数/赞同结论；记录新发现与争议
- 独立外部证据：不同上游数据/观察者/实验，这不能通过加Agent创造

TREC支持度研究也显示，群体系统排名相关高，不代表每个断言一致可靠；从零标注与看到模型标签后修改是不同条件。[S8] 所以允许Agent预筛，但决定性冲突交原文/人工，不写“3个Agent通过所以可信”。

## 小众问题：从相关节点扩展检索

2026-10-15 补核。🧪 借已有 snowballing／citation chasing 方法补首轮检索之后的动作：沿相关节点向上游和下游继续找，保留跨群落关键词入口；不自建搜索框架。关系链接用于发现候选，不作为质量或真实采用的认证。以下是文献检索方法向工程选型的有限迁移，未验证 Agent 效果。**[经验：条件建议]**

- [Wohlin 2014 方法原文](https://www.wohlin.eu/ease14.pdf) §3.1–3.2 要求种子覆盖不同作者／社区，并对新纳入材料继续双向追踪；互不引用的群落会漏检。其复现第二轮223候选只纳入1篇，实际工时未测。可借扩展机制，不能将高被引种子启发式改造成小众项目排名，也不能承诺更省时。**[一手：历史方法与复现]**
- [Mourão等2020原始对照](https://www.wohlin.eu/ist20.pdf) Table 9：第一项综述回放，同一Scopus种子完整交叉追踪找到44/51，前后向分开、不交叉扩展为19/51；审查候选分别1174与292。覆盖更广伴随更多筛查，不能把两路各自结束当同等覆盖。§7说明分母包含后续质量筛选剔除的论文；这是相对既有选集的历史回放，不是全网召回、优质资源发现率或当前Agent提效。**[一手：研究对照]**
- [GitHub当前官方说明](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-graph#dependents-and-used-by-data)：侧栏Used by显示条件包括超过100个依赖仓库、受支持生态及包与公开仓库关联等；仅代表其中一个包，dependents不报告私有仓库。因此缺标记不能推出无人采用；此动态条件只在本核实日确认。**[一手]**
- [2024 Dependency Graph准确性研究](https://mdipenta.github.io/files/ease2024-dependencies.pdf) §3–5：2023年采样297个Java与338个Python项目，核对图谱、dependents和manifest/lock，发现关系不一致。样本要求至少100 stars、100 commits等，不代表小众项目总体或当前错误率；本轮只读论文，未复现。**[一手：历史挖掘研究]**

**转成当前动作**：新找到的采用项目可以继续查其替代方案、迁移和失败记录；若新增材料总出自同一作者圈而目标生态仍未覆盖，改用那个生态的术语与入口。只对改变选择的采用证据核固定版本依赖及实际调用／交付说明，区分示例、测试和生产用途；引用也可能是批评。没有公开关系的新品仍可能漏检，不能靠追踪消除选择偏差；停止沿用需求卡的决定与预算，不另设固定深度或数量规则。**[经验：工程迁移与边界]**

## 原文抽取失败：先核同源正文入口

2026-10-16（UTC+8）补核。✅ 决定性来源只返回标题、摘要或截断内容时，先查已有权限内、官方支持的正文入口，再决定是否保留未知；明确访问拒绝则停止，不换路绕过。已有“使用 API／不升级摘要”原则还不足以指导这一步分流。此建议由下面的单例与接口契约支持，不证明跨站恢复率、搜索质量或工时改善。**[经验：条件建议]**

- **官方契约**：[Steam GetNewsForApp v2](https://partner.steamgames.com/doc/webapi/ISteamNews) 的 `maxlength=0` 返回接口持有的完整内容，非零值限制返回内容长度，内容超过限制时生成摘要；`enddate` 选取早于指定 Unix 时间的条目，`feeds` 限定信息源。普通接口与另需 publisher key 的 Authed 接口分开，不能因普通入口失败而请求或借用额外凭据。**[一手：官方文档]**
- **实际补读与截断对照**：既有 [WP11 镜头研究](2026-10-14-game-wp11-gameplay-architecture.md#1-tiny-glade按设备改变支点政策不是修正坐标计算)使用的 [Tiny Glade 1.11.2 公告](https://steamcommunity.com/games/2198150/announcements/detail/543346166601876516)，网页抽取本轮仍仅有标题／图像；通过[公开 API](https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2198150&count=5&maxlength=0&enddate=1737072000&feeds=steam_community_announcements)取得正文。目标 `appid=2198150`、`gid=1788945554756976`、`author=anopara`、`date=1736947659`（2025-01-15 13:27:39 UTC）、标题版本 `1.11.2`、`feedname=steam_community_announcements`。相同筛选参数下，`maxlength=0` 的 `contents` 为3903字符／3943 UTF-8字节，含 Rotation、Zoom、Misc 和作者结尾；改为 `maxlength=200` 仅203字符并以省略号结尾。完整 `contents` 的 SHA-256 为 `c562a284adc420d6f54a7ab2b5e32611b7e975ac967feae8fef97aa0da21e571`。独立复核还读取了原公告的公开 HTML：`announcement_body.gid=543346166601876516`、`posttime=1736947659`，其 `body` 与 API 正文逐字符相等且哈希一致；问题是网页抽取不完整，不是网站没有正文。`maxlength=0` 本身不保证转载 feed 含被转载原文全文。这是同一来源的文本完整性核验，未播放动图或验证游戏行为。**[一手：公开响应读取]**
- **对象和作者不能只凭域名判断**：目标响应的[新闻 URL](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1788945554756976)经 HTTP 重定向到上述公告，确认 API gid 与网页公告 ID 的对应；不同命名空间不要求 ID 字面相等。未限定 `feeds` 的同一 API 还返回 GamingOnLinux 转载，故官方接口不等于每条内容都由官方作者生产；要核信息源、作者和对象。目标官方公告自身的 `is_external_url=true` 也不能单独判成转载。**[一手：公开响应及重定向读取]**
- **GitHub 只补接口契约，不算第二个恢复实测**：[Contents API](https://docs.github.com/en/rest/repos/contents#get-repository-content)支持 raw 内容与 `ref`；公开资源可免认证。1–100 MB文件在 object 模式的 `content` 可能为空，应按文档取 raw，不能将空字段认作空文件。[固定链接说明](https://docs.github.com/en/repositories/working-with-files/using-files/getting-permanent-links-to-files)区分会变化的分支与固定 commit；补读应核仓库、路径和 commit，不能拿当前分支替代所引历史版本。**[一手：官方文档]**

**采用边界**：只改变“首次抽取不完整后做什么”，不把读取失败归因为产品没有搜索能力。正文仍缺、身份映射不清或版本不符时保留缺口；遇真实拒绝、需新增权限或超预算则停止该路径。补读恢复的是同一上游原文，不增加独立证据数量；多个核查者读到同一文本也不等于外部复现。不安装抓取框架，不把全文读取等同于结论成立。**[经验：边界判断]**

## 不确定性与停止依据

### 三种停止结果必须分开

- **已能决定**：硬条件已查、决定性主张有依据、最可能推翻结论的反证已处理，剩余未知不改变当前可逆选择
- **预算到限，仍不可决定**：交付缺口、最有价值的下一次查证，以及会改变哪项选择；不能写“调研完成所以最优”
- **路线不值得继续**：硬约束已排除或新增资料不再改变这次决定；解释依据，并保留撤回条件

“连续两轮没有新结果”只能是成本启发式，不能证明穷尽或95%召回。系统综述的统计停止法依赖有限候选池与剩余文档抽样；公开Web搜索的总体未知、结果相关且排序偏置，不能直接套置信区间。[研究S14 + 适用边界推断]

不确定性应写缺口而非模型自报“90%信心”：例如“只有厂商自测，尚无独立长期运行案例”，并给出若出现什么证据就改判。长期运行稳定性、视觉风格适配和手感等不能从引用正确率推导。

已知答案检测另有时效陷阱：LiveBrowseComp诊断提示静态难题可能变成模型已有知识的确认任务；该论文的44.5%是其closed-book pass@4结果，不能转述为单次正确率。借其“新鲜事实/无工具基线/移除支持证据”的诊断思想，未来实测需预注册，当前不运行。熟悉案例和命中已知答案不足以证明发现未知好答案的能力；未来评价须有未参与探索者设置的留出任务。[研究，S15]

### 检索后重查解释：缺事实与错配答案分流

2026-10-15 补核。🧪 读证据后若发现年份、对象或定义会改变答案，对已发现且有证据的分支保留“条件→答案”；用户意图决定选择时先澄清。已知分支缺事实才定向补搜；证据已齐而回答错配或漏答，则转逐条件核验。未找到证据不证明无解，也不要求穷尽所有解释。这是开放域问答失败分析向工程探索的有限迁移，未测实际工时或选型收益。**[经验：条件建议]**

- **检索后才显现的歧义**：[AmbigQA §6.2 / Table 5](https://aclanthology.org/2020.emnlp-main.466.pdf#page=6) 中，先消歧、后读证据的 DISAMBIG-FIRST 会编造年份等解释条件，歧义识别接近多数类基线。作者指出部分歧义须读材料才显现；支持重开需求解释，不给出通用澄清阈值。**[研究：作者离线实验，未复算]**
- **材料已足，答案仍错配**：[ASQA Table 6，PDF第15页](https://aclanthology.org/2022.emnlp-main.566.pdf#page=15) 的 St Petersburg 市长选举问句缺年份；检索输入已含2017年正确胜负，生成答案仍编造2016年选举、错写2017年赢家，随后自相矛盾。实际读取的[固定数据](https://storage.googleapis.com/gresearch/ASQA/data/ASQA.json?generation=1656095458999436)定位 `dev['-1422989764069069118']`，按2009、2013、2017年区分答案；文件 SHA-256 为 `8de0c824824372243b73b10314727dac1a02d9ecc729c34c752c30f8a3c1e58a`。§5.1 的 T5-O-5 是 Open Book、JPR 前5段输入，不是另列的 Oracle。此例支持先核条件—事实绑定，不能证明继续检索总无益。**[研究：作者失败样本；一手：固定公开数据]**
- **反向约束**：ASQA Table 3 的更多检索段落配置改善消歧指标，但各配置训练与上下文长度不同，不能推成“再搜一次必好”。[官方修复](https://github.com/google-research/language/commit/60b3abae79a4199e19f28013754bd69f65ad670f)涉及 ROUGE／DR 实现 bug，本建议不引用那些绝对分数。可借[固定转换源码 L24–38](https://github.com/google-research/language/blob/60b3abae79a4199e19f28013754bd69f65ad670f/language/asqa/convert_to_roberta_format.py#L24-L38)的结构：逐个消歧问题核对生成答案中的对应回答，而非只看答案词出现；手工核对即可，不需安装评分模型。**[研究；一手：固定源码]**
- **搜索与弃答都有代价**：[OverSearchQA 原论文](https://aclanthology.org/2026.eacl-long.361.pdf) §4–5 中，检索帮助可回答题，却损害部分缺上下文、错误前提等题的适当弃答；§5.4 弃答提示改善弃答，同时损伤可回答题准确性。Appendix H Case 4 的问题缺“我们／哪场战争”指代，无搜索时要求澄清，检索后改列多个冲突并突出其中一场的时长，仍未消除指代；[固定公开数据](https://github.com/apple-aiml-research/ml-over-searching/blob/6b6a964bde646d89c7d8efc466026fcdec1d1483/data/UC.json)可定位 `id=84b55d24ec5a`。其弃答判定允许澄清或多解释，且不评事实准确性，不能把弃答分当答案质量。论文合成负证据实验也不授权伪造反证；决策只用真实支持与反驳。**[研究：作者实验及个案，未复算]**

**来源与外推限制**：这些是离线问答实验，不是当前 Agent 的真实用户搜索收益，也没有可直接采用的最优搜索次数。ASQA 与 OverSearchQA 有共同作者 Bhuwan Dhingra，AmbigQA 与 ASQA 又有数据渊源；它们提供互补机制，不算三项独立复现。OverSearchQA 的平衡题集不代表部署分布，公开仓库提供数据而非完整判定器实现。本轮只读论文、数据和源码，未运行模型。**[研究边界与经验判断]**

## 来源与固定版本

以下均于2026-10-15读取。论文经验结果统一标[研究]，源码行为标[一手：固定源码]；本稿结合任务提出的边界和流程标[经验：设计推断]，未把作者自述提升为外部复现。

- S1 [研究/一手说明] BrowseComp，2025-04；[论文v1](https://arxiv.org/abs/2504.12516v1)、[官方解释其短答案边界](https://openai.com/index/browsecomp/)
- S2 [研究] Researchy Questions，2024-02；[论文](https://arxiv.org/abs/2402.17896)、[作者数据](https://huggingface.co/datasets/corbyrosset/researchy_questions)
- S3 [研究] ResearchRubrics，2025-11；[论文v1](https://arxiv.org/html/2511.07685v1)，任务量规与失败分析§4
- S4 [研究] DeepResearch Bench，2025-06；[论文v1](https://arxiv.org/html/2506.11763v1)，RACE/FACT §3，参考报告§4.1，局限Appendix A
- S5 [研究] DeepResearch Bench II，v1=2026-01-13、v2=2026-01-30、最新v3=2026-09-10；[提交历史](https://arxiv.org/abs/2601.08536v3)、[论文v3](https://arxiv.org/html/2601.08536v3)，泄漏§5.2/7，许可§8
- S6 [研究] DRACO，2026-02-12；[论文v1](https://arxiv.org/html/2602.11685v1)，四维量规§4，单轮/静态/英语/judge局限§6；[公开数据](https://huggingface.co/datasets/perplexity-ai/draco)；[作者引用的评分库](https://github.com/paper-instruments/rubric)（只确认地址/设计，未运行）
- S7 [研究] ALCE，EMNLP 2023；[论文/出版页](https://aclanthology.org/2023.emnlp-main.398/)
- S8 [研究] TREC 2024 support evaluation，2025-04；[论文v1](https://arxiv.org/html/2504.15205v1)，支持分级、人工和LLM分歧、只查第一引文的预算限制；[TREC 2026官方指南](https://github.com/TREC-RAG/trec-rag-skills/blob/main/skills/trec-rag-2026-track-guidelines/references/rag-task.md)明确继续分开支持精度/覆盖，2026指南为动态页面，不据此声称2026完整结果已发布
- S9 [研究] Sub-Question Coverage，NAACL 2025-04；[论文](https://aclanthology.org/2025.naacl-long.301.pdf)，§7说明自动分解、judge与问题重要性局限
- S10 [研究] Webis SEO spam，ECIR 2024；[作者机构论文](https://downloads.webis.de/publications/papers/bevendorff_2024a.pdf)，范围限定产品评测
- S11 [研究] GEO，所读v3，2024；[论文v3](https://arxiv.org/html/2311.09735v3)，§9未测优化对检索排名影响
- S12 [研究：预印本] What Drives AI Citations，2026-10-10；[论文v1](https://arxiv.org/html/2610.15033v1)，近期补充，未独立复现
- S13 [研究：预印本摘要核读] Stop Overvaluing Multi-Agent Debate，2025-06-21 v3；[作者论文v3](https://arxiv.org/html/2502.08788v3)。该HTML只含摘要和参考文献，不据此引用更细实验表或泛化统计
- S14 [研究] Statistical stopping criteria，2020；[原始论文DOI页面](https://link.springer.com/article/10.1186/s13643-020-01521-4)，有限池随机抽样与启发式局限；[作者代码](https://github.com/mcallaghan/rapid-screening)仅为定位，未读/运行全部实现
- S15 [研究：预印本] LiveBrowseComp，2026-05-27；[论文v1](https://arxiv.org/html/2605.28721v1)，§2 pass@4与检索诊断
- C1 [一手：固定源码] [ALCE eval.py](https://github.com/princeton-nlp/ALCE/blob/246c476a4edfc564266b7346b6e29ef4861ae937/eval.py#L483-L508)。HEAD通过git ls-remote核实，完整脚本读取；SHA256 e0f63bf865cacc64d7390fc62669c82b2653b1628f40051de0efdf5518064091
- C2 [一手：固定源码] [ResearchRubrics评分](https://github.com/scaleapi/researchrubrics/blob/2dc80e2d4c38ddd80439517c259d93c6954b193f/src/calculate_metrics/calculate_compliance_score.py)。HEAD通过git ls-remote核实；SHA256 2a0b9582f7f5dbe6b53c11441ffce4ae374f15ded45fab14b98682707a416596
- C3 [一手：固定源码] [DRB II evaluator](https://github.com/imlrz/DeepResearch-Bench-II/blob/b38f360603db9531b102aef8c166cedb8509b6f6/run_evaluation.py)、[聚合](https://github.com/imlrz/DeepResearch-Bench-II/blob/b38f360603db9531b102aef8c166cedb8509b6f6/aggregate_scores.py)、[README许可](https://github.com/imlrz/DeepResearch-Bench-II/blob/b38f360603db9531b102aef8c166cedb8509b6f6/README.md)。HEAD通过git ls-remote核实；evaluator SHA256 04ec1698c970f1a3c8a565a4e7b63e9c11845e6680472c4dcf30c5139eb8d775；aggregate SHA256 ad567d824ca7ae04976c890edf5f224c61634c27cab608aeac0c7025dc1e9ca1

## 实际验证状态

已通过：M6锚点/长期目标读取；以上主要论文方法/局限核读；三个仓库HEAD确认与指定脚本只读检查；支持结论的固定源记录。
未运行：模型推理、benchmark、独立人工实验、许可法律判断、完整框架执行/安全测试。
待人工判断：每个真实任务的硬约束与核心问题是否正确；视觉/手感价值；取舍是否符合读者；争议来源是否足以支持重大采用决定。

### 复核增量（2026-10-15）

S5日期以arXiv提交历史为准：v2是2026-01-30，不能把其HTML正文显示的August 24, 2026当作版本日期。已补读最新v3（2026-09-10）的§3.1.2、§5.2、§7/8。并对公开v2/v3 HTML提取文本作只读差分：可见变化为标题Report改为Reports、版本/正文日期、致谢新增制图贡献者；未发现影响上述方法、泄漏或许可边界的文本变化。因此不改变采用结论。此比较不等于PDF图像或TeX字节级完整差分。

## 公开报告漏检：先核原生能力的排除依据

2026-10-16（UTC+8）补核。**改变的选择**：报告因原生能力缺失而推荐绕路时，先定向核发行、提供方和启用条件；只重开被反证影响的分支，不扩成新工具名单。以下是一个公开产物的遗漏修正，未证明未知发现能力、方法收益或整个系统的漏检率。**[经验：条件建议]**

### 固定任务与原推荐

Onyx 的 [DRB id=68 完整问题、六项研究任务与报告](https://github.com/onyx-dot-app/onyx_deep_research_bench/blob/41f404cc61e287ffff18df0f23ce8456503a94bc/report_logs/68.md)要求随业务请求调整 Kubernetes 节点数，峰前扩容、低谷缩容，询问预测式或定时式方案。原问题未指定云、截止日期、Karpenter 版本或“只许 GA”；也没有禁止占位 Pod。“非弹性节点组”是它提出的可能不适配情形，不等于基础设施绝对禁止改变节点数。不能另加这些条件来制造失败。**[一手：公开任务]**

[固定 README L48–55](https://github.com/onyx-dot-app/onyx_deep_research_bench/blob/41f404cc61e287ffff18df0f23ce8456503a94bc/README.md#L48-L55)自述使用 Onyx `nightly-latest-20260207`、GPT-5.2、Serper、Firecrawl；构建标签不是实际运行时间。日志中的研究任务指向2025–2026年资料，但只公开任务摘要和最终答案，不是完整工具调用轨迹。本轮核对 [raw JSONL 第68条](https://github.com/onyx-dot-app/onyx_deep_research_bench/blob/41f404cc61e287ffff18df0f23ce8456503a94bc/eval_results/onyx_raw_results.jsonl#L68)的 prompt／article 均逐字出现在日志中；完整日志 SHA-256：`2a0434f6aaa351bc21c17492c5bcec97c1ed692994e0c987f943ba39c92ee181`。**[一手：产物身份核对；运行配置为作者自述]**

报告§5.1把 Karpenter 归为等待不可调度 Pod 的方案，§5.2建议峰前提高 NodePool limits／启用池，其他分支建议占位 Pod、外围基线容量管理。全文未处理 StaticCapacity／静态 NodePool replicas。问题不只是来源年份：**提高允许的上限，与要求控制器补足目标节点数，不是同一个动作**；若后者已可用，实施层的选择就需要重开。**[一手：完整报告；经验：影响判断]**

### 独立反证：发行能力与实际启用链

- **已发布实现**：[上游 v1.8.0 发行](https://github.com/kubernetes-sigs/karpenter/releases/tag/v1.8.0)包含 Static Capacity；固定 SHA `38e728c99b530f660f685d53d01f2e9ec9696668` 的 [NodePool API L64–75](https://github.com/kubernetes-sigs/karpenter/blob/38e728c99b530f660f685d53d01f2e9ec9696668/pkg/apis/v1/nodepool.go#L64-L75)将 replicas 定义为独立于 Pod demand 的目标节点数，标注 alpha。[扩容控制器 L69–116](https://github.com/kubernetes-sigs/karpenter/blob/38e728c99b530f660f685d53d01f2e9ec9696668/pkg/controllers/static/provisioning/controller.go#L69-L116)按节点数差额创建 NodeClaims；[缩容控制器 L75–130](https://github.com/kubernetes-sigs/karpenter/blob/38e728c99b530f660f685d53d01f2e9ec9696668/pkg/controllers/static/deprovisioning/controller.go#L75-L130)按减少后的目标删除多余 NodeClaims。这是固定源码检查，不是本轮运行结果。**[一手]**
- **提供方已接入，但默认关闭**：AWS provider [v1.8.1 发行](https://github.com/aws/karpenter-provider-aws/releases/tag/v1.8.1)于2025-10-09（UTC）发布，修复 gate 的 chart 大小写；固定 SHA `1ad0d78f8fa452cf27f4cf607377dd092489e2a0` 的 [go.mod L49](https://github.com/aws/karpenter-provider-aws/blob/1ad0d78f8fa452cf27f4cf607377dd092489e2a0/go.mod#L49)依赖上游1.8.0，[values L229–231](https://github.com/aws/karpenter-provider-aws/blob/1ad0d78f8fa452cf27f4cf607377dd092489e2a0/charts/karpenter/values.yaml#L229-L231)明确 alpha、默认 false，[deployment L128–129](https://github.com/aws/karpenter-provider-aws/blob/1ad0d78f8fa452cf27f4cf607377dd092489e2a0/charts/karpenter/templates/deployment.yaml#L128-L129)将配置传入控制器。[维护者2025-10-14答复](https://github.com/aws/karpenter-provider-aws/issues/8626)确认 AWS v1.8.x 支持。发行与确认早于报告自述的构建标签；不依赖推定实际运行日，也不把 upstream main 当托管服务已上线。**[一手]**

### 修正后的条件决定与停止边界

**只重开自管 AWS Karpenter 的定时容量分支**：支持版本、CRD／NodeClass与 gate 条件满足，且任务允许 alpha 时，先评估由定时任务调整静态 NodePool replicas，再决定是否需要占位 Pod 或另一套容量管理。它满足“可在工作负载需求出现前请求节点”的机制要求，但不是内置预测器／定时器；预测仍须决定何时需要多少节点。默认关闭和 alpha 不因被找到就变成默认采用。**[经验：基于实现的条件建议]**

该[固定 API L39–41、64–90](https://github.com/kubernetes-sigs/karpenter/blob/38e728c99b530f660f685d53d01f2e9ec9696668/pkg/apis/v1/nodepool.go#L39-L90)还限制静态／动态模式切换、limits 与 weight，并忽略静态池的普通 consolidation 设置；不能直接给任意既有动态池补 replicas。目标数不是到点 Ready 保证，配额、启动和排空约束仍须验收；未证明成本、可靠性或低谷缩容延迟达标。此证据不覆盖 EKS Auto Mode、AKS NAP、GKE 的托管支持状态，不推翻原报告其他方案。原任务未给最终环境，所以只形成条件推荐，不选全题赢家。**[一手：API约束；经验：采用边界]**

**不扩搜的反例**：同一报告§4.1已把 KEDA Cron 限定为提前改变工作负载副本、再由节点扩容器响应；其引用的 [KEDA 2.18 官方文档](https://keda.sh/docs/2.18/scalers/cron/)确实以工作负载和时间窗口为对象。这一间接路径已被正确限定，不因它不是节点预测器而追加缺项或重搜。若实际环境不支持 gate，或任务明确排除 alpha，静态容量分支也应停止；保留已有可行方案，不为候选数量扩搜。**[一手；经验：停止判断]**

验证范围：已读完整公开产物、固定发行源码与提供方配置，并核任务／答案身份；没有运行模型、Kubernetes、benchmark或比较人工工时。本例只支持“核对决定性的能力排除依据”，不支持穷尽检索或方法性能结论。


## 真实迁移报告补核：协议可用与服务身份分开判断

2026-10-17（UTC+8）核读。SpotOn 的真实迁移链补强现有硬约束门槛，不新增方法或改 25 推荐：PKCE 可以解决旧认证失败，但“取得 token”“自有配额”“旧调用仍兼容”是不同条件。**[研究：公开产物与反馈核查；经验：适用判断]**

**需求、报告与采用**：[用户#91](https://github.com/stiefenm/spoton/issues/91)报告 Keymaster 403 导致库浏览失败；[维护者 7 月 3 日 14:59:56 UTC 回复](https://github.com/stiefenm/spoton/issues/91#issuecomment-4877480922)链接研究报告，宣布采用 PKCE＋Direct API，并称其使用 SpotOn 身份取得自有配额。[完整报告固定修订](https://gist.github.com/stiefenm/1f8c1231462ec6c41e29832e758f338d/6d2fd05386cec555e3538482d70ed0e46f5f45b9)将 D 列为唯一满足全部要求的方案，同时承认吞吐未测、grandfathering 条件未公开。报告自述 100 agents／三票核验，未公开原始 prompt 或调用轨迹；API 返回正文未截断，最终修订为当日 15:20:18 UTC，晚于维护者引用，不能把最终全文逐字当作当时已采用版本。可确定的是维护者回复本身宣布的选择。**[一手：产物与维护者回执；研究：身份边界]**

**决定性前提仍缺证据**：[6 月 5 日固定提交](https://github.com/stiefenm/spoton/commit/d7948c4a196fe7333a6726b7b89133897be84762)已将 bundled 身份切到 ncspot；[报告发布前固定实现](https://github.com/stiefenm/spoton/blob/4e7239724a89ca13de2da03880420731f5f3c4ad/Plugins/SpotOn/API/Client.pm#L28-L31)仍沿用它。[Spotify 限流契约](https://developer.spotify.com/documentation/web-api/concepts/rate-limits)按 app 计算请求，Development 与 Extended 模式不同。因此，bundled 可用不能独自证明 SpotOn 拥有独立配额；本轮未核到另一个由 SpotOn 控制的 Extended 注册，也不能证明它绝不存在。选择应保留 PKCE，但将“已满足自有配额”降为待核，分别核借用身份与自有 Dev App 的条件。[2026 年 2 月官方变更](https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security)对新 Dev App 限定端点，3 月又推迟既有集成的端点变化；不同身份不能仅凭同用 PKCE 互换保证。**[一手：固定实现、提供方契约；经验：条件判断]**

**实际迁移需要适配，原故障最终解决**：[#118](https://github.com/stiefenm/spoton/issues/118)中用户证明有效 PKCE token 的小分页直接请求成功，应用 Search 仍 400；[维护者定位分页限制](https://github.com/stiefenm/spoton/issues/118#issuecomment-5002946504)后，[用户确认 Search 恢复但另有端点失败](https://github.com/stiefenm/spoton/issues/118#issuecomment-5003246835)。维护者随后宣称动态限额已覆盖，[用户复测仍指出 Artist Albums 路径遗漏](https://github.com/stiefenm/spoton/issues/118#issuecomment-5010756553)，最终[v3.1 回执确认 Artist→Albums→Tracks 可用](https://github.com/stiefenm/spoton/issues/118#issuecomment-5012103275)。[原#91 也确认 PKCE 解决 403 并恢复播放](https://github.com/stiefenm/spoton/issues/91#issuecomment-5012132890)。这些支持按实际身份与必需调用路径交接，不能倒推报告导致缺陷，或把 PKCE 迁移判为失败；用户回执仅覆盖其环境。**[社区：原用户复测；一手：维护者修订；研究：因果边界]**

**未扩大结论**：报告的“localhost callback”未给完整 URI；[官方 2025 年迁移公告](https://developer.spotify.com/blog/2025-10-14-reminder-oauth-migration-27-nov-2025)早已禁止 localhost 别名、仍允许 loopback IP，但不能据简称断定其计划必然不符合回调契约。此链不证明全部引用正确、陌生候选发现增益或多 Agent 收益；只补“真实探索产物被采用后，仍须核服务身份与目标调用条件”的证据。未运行候选、模型或认证流程；不改变 25 已有门槛。**[研究]**

## 探索增益验证：选题与判定契约

2026-10-16（UTC+8）。**[经验：设计修订，未运行对照]** 本节把已有留出／盲评原则落到可判定对象，改变首轮选题和验收，不新增方法有效的事实结论。依据为本记录既有评价方法及其局限，没有新增运行结果。

| 题型 | 冻结的需求 | 可判定依据 | 本阶段不能证明 |
|---|---|---|---|
| 技术／开源实现 | 运行环境、版本、许可、输入边界、依赖约束 | 固定文档／源码对条件的支持、失败及接入入口；允许原生方案或暂缓 | 接入后的维护净收益 |
| 游戏模块 | 实际问题、引擎及平台（相关时）、生命周期和资源限制 | 实现是否覆盖边界、撤回条件是否充分 | 玩家手感、性能及实际引擎兼容性 |
| 故障／迁移选择 | 症状、版本、预期行为及不可改变的条件 | 同版本修复链与反例；区分相关报告和可应用修复 | 本环境已修复 |
| 商品跨域题 | 地区、具体型号、预算、用途及价格日期 | 独立测量与规格适配；同名不同型号不能混用 | 舒适度、长期可靠性及唯一最佳品牌 |
| 网站／视觉参照 | 使用目标、已有参照、硬约束 | 访问及内容核查，加使用者匿名偏好／任务判断 | 仅凭 AI 评分得出的审美或使用收益 |

没有可靠证据判定关键条件的题，可测是否正确保留未知，不用它证明选型成功。既有 TanStack、Flexi／ModiBuff、Karpenter 和 GOV.UK 案例只做回归；未知发现题按问题家族留出，不能只替旧题换版本。使用者此前不知道候选，只证明对使用者陌生，不证明模型训练中未见过。

### 最小比较与固定分母

运行前由未参与探索者冻结真实需求、允许决定、关键排除条件和少量隐藏参照，再比较现行普通检索与只改变一项策略的增强检索。新候选按同一契约补核，不按是否命中唯一项目名计分。先用少量不同题型检查评审能否稳定判定；不能看完结果后删难题、改通过条件或把校准题改称留出。具体任务、数量、预算和授权须在真正开跑前补齐，本节不是已启动实验。

每题两路各交最多 3 个候选和决定；少于 3 个保留空位，不用未验证名字凑数。逐题报告：
- **可用候选／3**：关键硬条件有证据支持，当前建议没有决定性反证；仅指资料支持进入下一步，不是实测通过
- **陌生且有用候选／3**：在上述集合中，使用者确认此前未知、愿意进一步考虑；未反馈就待判，不由模型代填
- **误导候选／3**：最终推荐中有足以导致错误采用的断言；另列无法判定的数量，不能把未发现错误当确认正确
- **决定完成情况**：可决定、合理暂缓、关键问题未回答；预设关键备选漏检和已知候选纠错分别列出，零推荐不能只凭零错误获胜
- **成本**：探索耗时与可观测资源、重试、主／子 Agent、使用者筛选及统一盲评工时分账，并报告总量；不可观测项写未知

三候选是固定输出槽位，不是全网召回率。新增候选是否改变采用／改造／自建／放弃的选择需另写一句，更多名字本身不算增益。

同预算比较须冻结工具、访问权限、模型、时间窗口和资源上限，策略可自行分配搜索次数。并行须合计所有执行者；统一事后复核不能只算给增强组。观测不到费用或模型工作量时，只能声称匹配已观测的限制，不能宣称完全同成本。打乱方法标签后核原始证据；争议保留未决，不用另一个模型投票替代事实核查。

### 保留或撤回

按任务报告成对结果及胜／平／负的具体理由，不把链接数当独立样本，不用任意加权总分掩盖错误采用。没有新增有用候选或纠错，只有更长报告和更多核查负担时沿用基线；收益只出现在某种题型时仅保留该范围。小规模试跑不足以宣称普遍提效。后续实际接入验收另取执行授权与未泄漏验收输入，不与纸面正确性合并。

## 真实未决选择：本仓深链检查先复用还是扩写

核实：2026-10-20（UTC+8）。**当前保留路径检查＋改动范围专项深链核验，暂不接入候选，也不把正则扩成 Markdown 解析器。** 新发现改变了两个候选的采用资格；没有新增已可直接采用的路径，不据此声称陌生发现能力或方法提效。[研究：本次决定]

### 需求先于候选

P3 拆分暴露的真实需求是：文件仍在但标题变了，链接也应能报错。[固定入口](https://github.com/dbvv1/a1dbv/blob/d16a9322cba5e9054100dae52719968985e1dc47/scripts/check_repo.py#L54-L69)明确只验路径，原测试允许缺失片段通过；这是既定范围，不是实现违反契约。本轮原计划是继续路径检查和专项核验，或复用现成深链检查，尚未决定扩写。[一手：本仓固定源码]

11:38:25（UTC+8）由未参与搜索者先冻结需求；11:39 补核固定 `d16a9322`，随后开始检索。实际输入包含中文重复标题、HTML 旧 id、围栏、同页／跨文件链接，以及 [WP1 的 reference links](https://github.com/dbvv1/a1dbv/blob/d16a9322cba5e9054100dae52719968985e1dc47/docs/research/2026-10-14-game-wp1-licensing.md#L163-L193)。门槛是离线只读、无需账号，能解析这些输入并明确报告缺失／未核；越界拒绝和原 JSON／TOML 检查仍须保留。新增运行时只是成本候选，本轮不安装、运行或新增对照。[本仓：前向需求与公开输入；研究]

预先保留的反例包括合法旧 id、自然编号与重复标题碰撞、百分号编码片段、reference 目标越界，以及缺输入／未支持却显示成功。核心解析重写不算薄适配；文件枚举、结果转译和利用已有解析结果加策略层才可能属于有界接入。[研究：冻结判据]

### 现成方案能借什么，为什么还不能直接用

| 路线 | 已核可复用部分 | 阻止本轮直接采用的事实 |
|---|---|---|
| lychee 稳定版 0.24.2 | 结构化 Markdown／HTML 解析，reference、id/name、跨文件片段、来源位置及离线文件检查 | 已发布版尚不含 GitHub Unicode 修复；标题编号碰撞仍有静态反例；root-dir 不拒绝仓库外目标 |
| lychee 开发提交 `ad0ce3d` | GitHub Unicode 规则已改进，不能借给稳定版宣传 | 反向编号碰撞仍未闭合；追开发提交增加维护责任，不因此升为可采用 |
| remark-validate-links 13.1.0 | AST、reference、github-slugger；CLI/fileset 可核跨文件，单文件 API 不等价 | 原始 HTML id 不自动进入其 data 属性；片段编码处理另有缺口；需 Node 工具链和桥接，不是零依赖脚本 |
| 扩写现有脚本 | 无新运行时，可保当前输出契约 | reference、HTML、围栏、slug 状态和诊断都需承担维护，不把一批正则叫小补丁 |

[一手：固定源码；研究：范围判断，未运行候选] 单页 fragment lint 未解决拆文件后的目标，不能与路径检查拼成“跨文件深链已全验”；没有据此否定它们在单页任务中的价值。

**lychee 版本与修复分开。** [最新稳定发布](https://github.com/lycheeverse/lychee/releases/tag/lychee-v0.24.2)为 2026-05-01 的 0.24.2，固定 `2bba271`；[GitHub fragment 修复 #2153](https://github.com/lycheeverse/lychee/pull/2153)于 2026-07-05 才合并，解决中文混 emoji 等差异。稳定版不能因当前文档或开发源码较新就获放行。[一手]

**编号碰撞不是“再升级就好”。** 稳定版[生成器](https://github.com/lycheeverse/lychee/blob/2bba271688c1abb1503097a064e6c3bc1d1b6a9b/lychee-lib/src/extract/markdown.rs#L325-L334)只记录基础 slug 的计数；开发版[消歧](https://github.com/lycheeverse/lychee/blob/ad0ce3d33e71c3650c8eac167dbf6ba4846c4c84/lychee-lib/src/extract/fragments.rs#L109-L129)仅在基础 id 已有记录时调用占用检查。按这两段代码逐步推导，标题依次 A、A、A-1 均可产生 a、a-1、a-1，不满足 [GitHub 的唯一编号规则](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#section-links)。这是未执行的静态反例，不是已证明本仓存在的坏链。[一手／研究]

**root-dir 是路径解释，不是读取边界。** 稳定版 [request 测试](https://github.com/lycheeverse/lychee/blob/2bba271688c1abb1503097a064e6c3bc1d1b6a9b/lychee-lib/src/utils/request.rs)明确允许解析至 `file:///parent`。采用前要在读取前检查所有解析后本地目标的归属；只保旧脚本不能覆盖 reference 或 HTML 目标。非 Markdown 片段的未核范围也须单列，而不是用总成功代替逐类核验。[一手／研究]

**remark 的 AST 不等于已识别原始 HTML。** 固定 [13.1.0 实现](https://github.com/remarkjs/remark-validate-links/blob/22799a03c5412aab5dd24e70158b1b71ff6ac971/lib/index.js#L302-L350)读取节点的 data 属性，没有将原始 HTML value 自动解析成 id；[normalize](https://github.com/remarkjs/remark-validate-links/blob/22799a03c5412aab5dd24e70158b1b71ff6ac971/lib/index.js#L758-L794)解码路径但只把 hash 小写。加入 HTML 桥接不自动解决编码片段。CLI 的跨文件能力、警告失败开关和只读使用也需分别配置。[一手：源码；研究：未运行的适配判断]

### 真实采用与总投入

[Apache Airflow #66356](https://github.com/apache/airflow/pull/66356)提供了反对“现成方案都不可用”的证据：评审者发现初版离线配置漏开 fragment，补开后作者报告找到三个真实断锚，并修链接／补显式 id。[已合配置](https://github.com/apache/airflow/blob/5936cf8b71a6c131baf7886abc992e93ffa67556/.pre-commit-config.yaml#L403-L431)使用离线 fragment 检查；同一 PR 因二进制与 Ubuntu 22.04 的 glibc 不兼容改用 Docker。这里能借的是已采用的解析与检查方式，不能把离线写成无需安装，也未独立核到具体 lychee job 的成功日志。[一手：配置；社区：作者／评审运行报告]

lychee 为 Apache-2.0 OR MIT，后续可以选择固定的官方二进制，不必必然安装 Rust；自改核心则增加构建与维护责任。remark 为 MIT，但需 Node、插件和依赖树。版本、平台兼容、补丁与误报处理都是采用成本；本轮没有费用或人工工时对照，不报告净收益。[一手／研究]

### 采用决定与后续边界

✅ 保留现法，遇到标题／结构修改仍专项核验受影响深链。若继续研究复用，优先补齐 lychee 的唯一编号、方言、越界和未核状态，再决定是否值得新增依赖；它是较近的研究基座，不是已通过的接入方案。[研究]

⛔ 不直接升级浮动开发版，也不批量改合法旧 id 来迁就检查器。若核心差异需要持续自建解析器，或安装／平台成本超过专项核验价值，就撤回接入；只有后续固定版本和必要回归能闭合缺口，才重开采用。[研究]

本轮完成真实需求、候选、排除理由与保留现法决定的资料交付，但不计 P4 陌生发现的完整验收。专项核验沿用临时脚本、独立 Agent 与定点浏览器检查，不代表用户投入人工，也不将临时核验器升级为通用解析器。没有新增已可直接采用的陌生候选；使用者是否陌生／愿用、实际接入、第二次修改收益均未知。未运行候选、模型或引擎；唯一浏览器观察是读取本仓固定 GitHub 文档的已渲染标题，不是候选测试或 hosted CI。既有 25 已覆盖版本对齐和现成／薄层的区分，因此不为这个案例再加同义正文。[研究：负结果与交付价值]

## P62：运行升级问题的定向查证负结果

2026-10-21：为P60继续查旧版排空／兼容续接／边界交接哪条总负担最低，未取得匹配的公开比较。新读[AI21 6-24报告合并](https://www.ai21.com/blog/merging-weak-agents-into-a-state-of-the-art-deep-researcher/)与[DRFlow v2](https://arxiv.org/html/2606.18191v2)：前者合并已有报告，后者用合成资料评价步骤／条件／支持度；它们可借的机制已在25，不新增推荐、标记或框架。转载9月日期不能代替AI21原文日期，DRFlow输出token成本代理不是完整研究总投入。[一手；研究：有界负结果]

P60已核维护链没有新增运行结果，本轮不重报发现。没有两路冻结报告或完整相关集，不报召回率、错误引用率，也不声称原生方法胜出。恢复条件是出现同任务升级后的交付接收与累计维护投入，而非新增榜单／长报告；不重做M6旧三题。[研究]

## P46：按团队追踪来源与漏检校准

**先修可运行、可观察的验证入口，再加流程。** 本轮比较三篇指定自用复盘，并补Cursor环境与Claude Code评审两项遗漏，改变07／20的环境优先级、确认09的收窄默认；25补团队检索步骤。核实：2026-10-21；以下为一手团队自报与本仓研究判断，未运行其产品或测量本仓效果。

### 最高水平卡

唯一优胜未知。强工程参照是Anthropic 10-13/10-15与Cursor7-30/9-23：让环境可运行、反馈可观察、约束可执行。多个官方来源共有短入口、可运行检查与按风险评审，但行业采用率未知。本仓默认采用可行的定向检索，比较领先机制后只补实际缺口；不复制整套基础设施或预算。发现有用遗漏不证明检索法的净收益。

### 六线来源名册

名册按“谁持续产生证据”维护，不按产品名堆名单。代表作是本轮已核的最近相关作品，不保证作者全部作品中的绝对最新。

| 主线 | 团队／个人与稳定入口 | 最近相关代表作、入选理由与边界 |
|---|---|---|
| Agent 工具 | Cursor 工程；Mathew Hogan、Arvind Saripalli；[工程博客](https://cursor.com/blog)、同站 changelog | [7-30 云端环境复盘](https://cursor.com/blog/cloud-agent-environment)：自己产品的 monorepo 实践，区分“补 Skill”与“修难用命令”。可借启动入口和进程管理机制，内部采用率不是质量因果证明。 |
| 上下文 | Cursor harness；Jediah Katz、Connor O’Keefe、Calvin Yee；同上 | [9-23 token efficiency](https://cursor.com/blog/improved-token-efficiency)：生产 A/B、提示删减、动态工具、缓存和子 Agent 协调代价一起报告。组合成本自报不能归因于某一条规则。 |
| 长程 | OpenAI／Ryan Lopopolo；[Engineering 原文](https://openai.com/index/harness-engineering/)及文内 Cookbook 链；Anthropic Engineering 与 Claude.dev | OpenAI 2-11 的可观察工作树和版本化知识；Anthropic [10-08 automations](https://claude.dev/blog/building-effective-agent-automations/)给出来源失败不能当静默、游标与回执机制。示例配置不等于真实恢复可靠率。 |
| 多 Agent | Anthropic／Nicholas Carlini；[Engineering](https://www.anthropic.com/engineering)及作者链接项目 | [2-05 C 编译器](https://www.anthropic.com/research/building-c-compiler)：16 agents、约2000会话、2万美元的极端案例，公开验证器与协调局限；当前成本与模型下的最优分工未知。另以 Cursor 9-23 的撤掉强烈鼓励委派的提示作反证。 |
| 评审 | Anthropic Claude Code／Addy Osmani、Morgan Westlee Lunt、Qing Wang；[Claude.dev 原文](https://claude.dev/blog/solving-code-review-at-anthropic/)；Anthropic Engineering 的 Scion 团队 | 10-15 评审复盘同时给风险分层、回退、失控复审和噪音指标，胜过仅列“多个 reviewer”的教程。Claude Code 独立仓库和 Scion monorepo 不得混为同一审批制度。 |
| 评估 | Anthropic／Lance Martin；Claude.dev Playbooks；独立校准看 ETH SRI／Thibaud Gloaguen 等的版本化论文，以及 METR 原始研究 | [9-28 eval/hillclimbing](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)有噪声、grader、成本和过拟合检查；[AGENTS.md v3，9-29](https://arxiv.org/abs/2602.11988v3)为指令收益提供反证（本轮核摘要及版本，正文已由仓内记录覆盖）；[METR 10-06](https://metr.org/blog/2026-10-06-ai-systems-could-cover-up-misbehavior/)提醒呈现层也须独立核查。 |

产品判断名册补充（P52）：Vercel／John Phamous的[2026-06-25 product-design实践](https://vercel.com/blog/teaching-agents-product-design-at-vercel)，从[官方博客](https://vercel.com/blog)追产品决策与机械检查的分工；文案评估不是整个设计流程胜率。详见[05代际研究](2026-10-13-domain-skill-contract.md#p52技能代际复核)。[一手／研究]

长程名册补充（P47前瞻自用）：沿[Temporal／Moe Abadi的10-08工程文](https://temporal.io/blog/the-immortal-life-of-pi-running-the-pi-coding-agent-on-temporal)与[Earendil Engineering的10-01发布](https://earendil.com/posts/pi-durable/)追耐久执行的当前契约和失败边界；先区分模型请求与工具执行状态，不把实验宿主直接列为生产默认。[一手／研究]

性能维护名册补充（P66，2026-10-22）：从[Shopify历史autoresearch复盘](https://shopify.engineering/autoresearch)的直接链接追pnpm优化，再核十月[两版修复的纠正](https://github.com/pnpm/pnpm/pull/16663)。新增的是当前Agent维修的完成判据与恢复入口，不把四月循环写成十月胜例；固定链与未覆盖no-op见[P66记录](2026-10-13-domain-skill-contract.md#p66共享状态优化保快路径还是撤完成证明)。[一手／研究]

模型取舍名册补充（P65，2026-10-22）：新读[Stet作者的同题维护对照](https://www.stet.sh/blog/gpt-6-1-sol-vs-gpt-6-sol)，核公开提示／补丁／清单并追[Tor固定测试覆盖产物](https://github.com/Tor-Production/sol-coding-benchmark/tree/af860aa8cbbcbbca3dde3b44d48e7dda292b9238)；真实维护与构造题分开，判定器过窄不冒充模型能力差。最高水平卡、排除项及取舍归[P65记录](2026-10-10-audit.md#p65模型换代与effort的实际质量差异)。[一手／社区／研究]

交付接收名册补充（P61，2026-10-21）：新读[Stephen Toub 的 Copilot runtime 生产迁移复盘](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/)，追[VS Code 同版本接管产物](https://github.com/microsoft/vscode/pull/341861)及[下一版采用](https://github.com/microsoft/vscode/pull/341922)；不把自动修绿视为可以改权限／判定器。固定链与自报／未核范围见[长任务研究](2026-10-12-long-task-evidence.md#p61整轮交付与争议接管)。[一手／研究]

升级维护名册补充（P60，2026-10-21）：从[LangChain／Sydney Runkle的Delta Channels](https://www.langchain.com/blog/delta-channels-evolving-agent-runtime)追存储兼容承诺，再核LangGraph发行与[DeerFlow公开补丁退役](https://github.com/bytedance/deer-flow/pull/5734)。原文与固定修订已读，首次新写冷读及后续轮次的范围归[长任务研究](2026-10-12-long-task-evidence.md)；mock基准、作者运行和本仓验证分列。[一手／研究]

维护控制名册补充（P57，2026-10-21）：从[Spotify Engineering](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)的Honk系列追循环采用与迁移撤回；从[Shopify／Erin Son、Kaiyi Li](https://shopify.engineering/river-vulnerability-remediation)追跨次接收及人工接管；从[Cursor／Josh Ma](https://cursor.com/blog/cloud-agent-lessons)追任务编排撤回与运行责任。原文已读，采用条件与缺口统一归[长任务研究](2026-10-12-long-task-evidence.md)，不据厂商产量或估算成本声称净收益。[一手／研究]

维护控制名册续补（P57，2026-10-22）：新增[Shopify／Zack Deveau的Dispatch实践](https://shopify.engineering/building-an-agentic-harness-that-outlasts-the-model)与[Anthropic／Eugene Yan、Henna Dattani的方法原文](https://claude.com/resources/articles/using-llms-to-secure-source-code)，追领域证明与实际接收边界；后者参考仓已声明不维护，保留作机制来源，不列生产依赖。源码分项与当前专用入口的同题取舍见[P57续补](2026-10-12-long-task-evidence.md#p57续补专用入口与领域证明链)。[一手／研究]

团队接收名册补充（P58，2026-10-21）：沿[Will Larson](https://lethain.com/small-changes/)追窄放行试点的结果与长期调参；[Shopify Quick／Daniel Beauchamp、Alex Pilon](https://shopify.engineering/quick)追受限共享平台的真实维护；[Monzo／Fabien Deshayes、Oli Haley](https://monzo.com/blog/building-agent-chip)追非专家发起、工程师接收与团队归属。相关原文已读，只借用途与接收边界，不采产量或单机价格作为整体收益。[一手／研究]

工作流实验名册补充（P59，2026-10-21）：[Bartłomiej Krupa](https://bartlomiejkrupa.dev/articles/does-superpowers-beat-no-plugin/)公开固定案例、轨迹及判定器纠正，可追整包与原生的产物差别；作者另有工具项目，按方法与原始证据核，不当中立裁决。原文及关键轨迹已读，完整范围归[社区研究](2026-10-12-community-source-records.md)。[一手／社区／研究]

跨线个人雷达：[Simon Willison](https://simonwillison.net/)及其[9-27演讲整理](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)。本人经验为一手，转引追原作者；本仓已收录，不计新增。

### 三篇指定校准卡

#### A. Anthropic：Redesigning source control

[正式原文](https://www.anthropic.com/research/redesigning-source-control)，2026-10-13发布，10-15补先行项目说明；旧 engineering URL 重定向此页。作者为 Nick G. 与源码管理团队（原文署名 S.G.、R.K.、Dan C.、Garrett H.、Ben L.、Colin M.、Joe P.）。

七人五个月构建 Scion、Antique及相关系统；单仓主线历史近100GB、压缩工作副本25GB、CI每天约2500万checkout，9月日合入逾3万。使用内部 Claude Mythos Preview/Claude Tag；未给可复算总token或费用，作者明确内部预算远高一般企业。每项变更仍由人审意图；迁移中人纠正跨系统权威来源与对抗评审过度防御。可借不变量、隔离模拟和模糊测试；不能推一般仓库应离开Git。

定位：原文“Growing our monorepo”“What we learned building Scion”“Contributing to the wider ecosystem”。正文第130行明确Scion不是通用Git替代。对07/20：确认人管目标与系统边界，修正“再加一次评审就更可靠”的直觉。无独立复测。

#### B. OpenAI：Harness engineering

[正式原文](https://openai.com/index/harness-engineering/)，2026-02-11，Ryan Lopopolo。此前仓内为403缺口；本次该公开正文直接可读，没有绕过访问拒绝。

新建产品内部beta，初始三名工程师后增至七名，五个月约1500PR；初始Codex CLI/GPT-5，后续完整模型组合和算力未知。团队将工作树应用、浏览器、日志与指标直接交给Agent，并将知识设为短入口加版本化文档、结构约束可执行。人可能审PR但非必需，仍负责目标、验收和结果。其少阻塞合入取舍依赖高吞吐及低纠错成本，不能迁移成普通项目默认。

定位：“We started with an empty git repository”“Increasing application legibility”“We made repository knowledge the system of record”“Throughput changes the merge philosophy”。对07/20：从“给检查命令”补到“能启动并观察真实目标”；确认短入口，不导出统一100行上限。工时提效为估计。

#### C. Anthropic：How Anthropic teams use Claude Code

[当前正式原文](https://claude.com/resources/articles/how-anthropic-teams-use-claude-code)，页面日期2025-07-24；旧 anthropic.com/news URL 重定向。机构采访内部多团队，无个人署名、统一样本数、模型版本或预算。

团队用途包括导航、故障诊断、测试与设计原型。安全团队先讨论伪代码再做TDD并间歇检查；设计团队让Agent运行测试循环，最后审核解法。可迁移的是按任务未知选择样品、行为检查或人工判断，不是所有任务必须同一流程。对07确认条件分流，对20仅支持局部工作流可行；不能用它证明2026年长程上限。文中节省时间为访谈自报，不作本仓收益。

定位：“Testing and code review”“Prototyping and feature development”。重要时间边界：该旧卡用于校准演化，不占近三个月新增数量。

### 两项本轮真正改变建议的补漏

#### 1. 先修运行入口，不靠更多 Skill 补脆弱环境

Cursor [2026-07-30，How we set up our cloud agent environment](https://cursor.com/blog/cloud-agent-environment)，Mathew Hogan、Arvind Saripalli。原文“A simpler interface for agents”说写构建运行Skills只有边际帮助，命令本身复杂；后来 anydev 统一启动、help和supervisor管理长进程，Agent才可稳定运行并端到端验证。是内部monorepo自报，未披露同题对照、团队人数、模型组合和完整费用。

正文建议：07验证闭环补“先修稳定启动与可观察环境”；20引用它，不重复造框架。人核环境是否代表交付和权限边界。

#### 2. 评审必须收敛，不能按轮数累加安全感

[Claude.dev 10-15原文](https://claude.dev/blog/solving-code-review-at-anthropic/)，上述三位作者。官方关联链：anthropic.com/news/how-anthropic-teams-use-claude-code → claude.com/resources/articles/how-anthropic-teams-use-claude-code → Related articles的“How the Claude Code team does code review”直接指向claude.dev该页。资源页标10-16，正文标10-15，采用正文日期并留差异；不凭域名认官方。

“How we make the reviewer better”自报一次PR过50轮，约59%发现所在代码从首轮就存在；后改限轮、后期差量重审、按bug类别修、去重。“Human approval, scaled by risk”分0/1/2人且限定可信作者，Agent不能顶替所需人工；“Merge queue”仍有合入队列，与Scion不同。

建议07/09确认按风险默认，再加：循环没有收敛时，区分当前改动的新增风险、既存缺陷和重复发现，再停止无增量的往复，回到缺陷类别和方案审查；后续只核变更影响与未关闭风险。不要把作者“三轮”定成通用数值。该文自报吞吐/回滚变化无独立因果比较；审批政策也不是本仓新增授权。

### 近三个月回扫（2026-07-21至10-21）

查重基线：P46编辑树e0ec3d0；全docs按正式URL slug查找，另查作者、anydev、评审失败关键短语。未命中只证明未在受查文档找到，不证明历史从未读过。原因除Scion外均为本轮推断。

| 结果 | 来源 | 重要性／漏检原因与处置 |
|---|---|---|
| 历史漏检，已补局部 | Scion 10-13 | 用户先带入，已在development-maintenance与development-migrations，不报成新发现；补三篇校准与适用层级。 |
| 新补、优先 | Cursor 7-30环境复盘 | 未找到URL/anydev；按工具功能搜容易漏团队自用基础设施。直接改变07/20建议。 |
| 新补、优先 | Claude.dev 10-15评审 | 未找到slug/作者；Engineering列表没有此篇，官方出口分散。加强09/07复审收敛与风险层次。 |
| 已覆盖，不计新增 | Cursor 9-23 token efficiency；ETH AGENTS.md v3；Willison9-27演讲整理 | community-source-records等已有；仅作为名册和反证，不重报成果。 |

## 后续选题资格：从来源名册到可交付问题

**优先补故障证据和优化后的接受判断，不重开工具名单。** 2026-10-21从覆盖地图与上述名册筛选；以下是项目提议和资格证据，不是项目已经完成。此前PBT、ACH／JiTTest、PerfAgent／Shinka等已有研究被排除，避免换标题重复。最高水平整体优胜均未知。[研究：规划判断]

### P48：优化后的分数是否足以换掉旧Skill描述

近期参照是Lance Martin的[9-28指南](https://claude.dev/blog/automating-eval-design-and-hillclimbing/)，现成对照是[DSPy 3.1.3](https://dspy.ai/3.1.3/learn/optimization/overview/)。本题不再复算P44的既有指标，而问分数怎样参与选择：即使不让优化者读取失败正文，反复用同一分数选优也会改变其证据角色。[一手；研究：问题界定]

**官方已经提供两条路径，先复用。** 固定[Skill指南](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/claude-api/shared/evals/eval-hillclimb.md)（blob `7e16832bef17a195ee87da35a4fd4df1b6fc9264`）默认train／test逐轮选优，另可选train／validation／test，最后只在test比较基线与胜出版本。已核同commit的[lite报告](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/claude-api/shared/evals/report/build-report-lite.mjs)能标train／val／test，胜出轮取显式best.round；[runner骨架](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/claude-api/shared/evals/report/runner-scaffold.mjs#L386-L443)的loadCases仍需编排，分集标签不会自动阻止终评提前运行。因此本项目要比较可正确执行的现成路径，不仅对照指南措辞。文中“约150+”是路径提示，不是统计充分的保证。不能把文章默认流程解释成官方缺少独立终评，也不能据此断言其14题实例已泄漏。[一手；研究：可用能力核查]

项目交付限定为Skill描述优化：同一公开可复查候选账，分别回放逐轮分数选优、validation选优后独立终评、读终评再改配置三条路径；记录每项反馈的去向、全部尝试投入和二次修改后的接受／延后决定。确定性反例只验证选择机制；真实模型优化收益另验。预计1–2天，正文落22，复用现有实验目录，不新造优化框架。[研究：验收设计]

### P49：Agent生成服务交付后，故障信号能否区分原因

近期[可观测代码研究（2026-07-07）](https://arxiv.org/html/2607.05785)将功能可运行与故障特异证据分开；[Cursor Rollouts（9-23）](https://cursor.com/blog/rollouts-and-security-reviewer)从变更制定观察计划。前者在生成时补诊断语义，后者消费已有遥测判断发布，两者不是互相替代。默认复用已有信号，只有不能区分目标故障才补埋点。[一手；研究：同题责任分层]

现成底座为OpenTelemetry Astronomy Shop：[官方故障开关](https://opentelemetry.io/docs/demo/feature-flags/)区分付款调用报错与Checkout使用错误地址导致的Payment不可达。项目只取正常、`paymentFailure`、`paymentUnreachable`三路；交固定源码—信号发出位置—预期证据—可排除原因矩阵，以及接收者实际应查什么。它是源码推导资料包，不拿预期信号冒充运行日志；demo或真实模型执行不作为资料验收的隐藏前提。[一手；研究：验收设计]

预计1.5–3天，落15调试／18接管及既有维护研究。当前公开源码和配置尚未固定为同一版本，不能拼接浮动网页称已证运行。仓库头查询因审批初始化错误未执行，原因不是缺少用户仓库授权；该动作未换路重试。真实部署、引擎和私人遥测不在本项目范围。[研究：资格缺口]

### 待补证候选：修改之前，取得可核而非无限承诺的引用集合

[Unity Insight（2026-09-23）](https://arxiv.org/html/2609.27585)把代码与序列化资产关联交给Agent；论文只测探索成本，索引构建在计时外，不能推导引用正确率或改动安全性。现成对照为[InnoGames Asset Relations Viewer](https://github.com/innogames/asset-relations-viewer)：Reload、Update和完整重建并非一回事，场景对象与Addressables也各有覆盖条件。[一手；研究：采用前提]

候选取RedRunner的固定静态问题：脚本meta→场景／Prefab→字段fileID→被引用对象，和代码中的消费位置对应。GameManager题目前缺序列化消费者正文；论文公开的Chest Big→Animator→Controller→Open.anim只能作校准／回归锚点，不冒充陌生发现。取得同版原件后，再比较正确的手动GUID查找与正确刷新的现成索引，交答案包、刷新成本及必须回编辑器的条件。预计1–2天；不运行引擎，静态无引用不授权删除。[研究：提议，待补资格]

### 未独立立项：任务感知选模

[Cursor 7-22](https://cursor.com/blog/router)与[8-06技术文](https://cursor.com/blog/how-cursor-router-works)补出逐轮分类、换模型缓存成本及用户后续行为代理。02已有相对固定分流核总投入的默认，这些自报还不足以单独改变该选择；先归既有时效维护，不重做Scrouting，不与P47故障回退混为一题。只有补出具体可控路径和可改变的采用决定，才重开立项。[一手；研究：负结果]

## P51：自用起点与漏检诊断

核实：2026-10-21（UTC+8），基线c4f280f。主线一／二；改变25第二、六步：按失败机制补团队自用出口，按冻结参照识别行动性遗漏。P51只把方法用于本仓内容，不另评研究产品。[研究]

**最高水平卡。** 整体最佳探索方法未知；继承[C17](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c17--ai-探索)的原文核实、行动性遗漏与产物评价。近期强参照是P46的Cursor7-30环境与Claude Code10-15评审复盘：它们确实改变正文先做什么；这不是搜索方法的对照实验。主流采用比例未知；可行基线为已有Agent定向检索。本仓默认先复用名册、把失败机制带入检索，再追原站明确关联的出口，不为每题装框架。[一手／研究；经验：采用层级]

### 首份历史诊断，不是新方法成绩

固定历史对象是P46编辑树e0ec3d0与2026-07-21至10-21回扫；原账见上文“近三个月回扫”。本轮重核遗漏原文，未重新独立发现。单位为去重原始来源，不是URL、转载、页面或审计卡数量。[研究：历史重读]

| 同期参照 | P46当时状态 | 会改变的选择／漏因与处理 |
|---|---|---|
| [Cursor7-30环境](https://cursor.com/blog/cloud-agent-environment) | 受查docs未找到URL／anydev，后补 | 命令本身复杂时，Skill说明只有边际帮助；先修可运行接口与长进程管理。按工具功能搜漏团队基础设施是推断，后续用启动／验证失败机制补搜。 |
| [Claude.dev10-15评审](https://claude.dev/blog/solving-code-review-at-anthropic/) | 未找到slug／作者，后补 | 反复评审应先分新风险、既存缺陷与重复发现，让循环收敛；不是继续加轮。出口分散是推断，沿已核官方Related articles与作者补查，不凭域名自认官方。 |
| Cursor9-23 token efficiency | 已覆盖 | 保留已有harness减法反证，不计新增。 |
| ETH AGENTS.md v3 | 已覆盖 | 保留指令收益反证，不计新增。 |
| Willison9-27演讲整理 | 已覆盖 | 保留跨线个人雷达，不计新增。 |

这份挑选的同期诊断样本为**遗漏2／参照5**，不是总体召回率或“最高水平全集”的漏检率。不能把补录后的0/5当方法提升；P46的完整检索用时、来源总数和原文读取比例未测，不能用本次重读倒填。[研究：分母边界]

[Scion10-13](https://www.anthropic.com/research/redesigning-source-control)另记历史外部带入1项：P46时已局部补录，不能混入上述“当时未覆盖”分母。它用于比较资源、人工审意图与系统边界，不建议一般仓库改换Git。[一手／研究]

审计29张卡不是29次来源遗漏：同源会复用，已读但未比较是转化缺口；审计基线8eb897d与P46也不同。原审计为正文隔离的先验比较，不升级为完全盲测。只读简介／摘要的候选先列读取缺口，待正文支持相关性后再判；外部Onyx漏检案例不混入本仓统计。[研究]

### 新提示词与自用边界

[执行提示词](../collaboration/prompts/2026-10-21-exploration-self-use.md)落实25既有六步，不安装Skill，不增加脚本／JSON／调度。记录实际起止、可核作业与等待、去重来源数／正文读取数；正文比例不是质量分。已知来源、主动发现、外部补入分列，阶段结束后先冻结再对照。[研究：设计]

**首批截止17:38（UTC+8）实际使用0/3。** P46／P49／P50不得追认，本次准备提示词和名册也不拆成三个内容项目。后续在真实内容项目开始研究前使用并留下产物；同一项目多卡只计一次。按既定双周审计汇总已知相关参照的遗漏及原因，无合格分母写未知。P51仍未完成，方法净收益仍归P41／P38。[研究：验收状态]

社区产品维护名册补充（P82）：跟踪[Tw93原周刊](https://weekly.tw93.fun/posts/280)与[宝玉原文](https://baoyu.io/blog/2026-08-24/ai-native-dev-workflow)，追产品自己的issue、发行资产和后续使用结果；不是泛读推荐清单。对应中文实证边界归[社区记录](2026-10-12-community-source-records.md#p82中文实践与真实交付)，闭源部分只作自述。[一手／社区]

### G1与客户端核心机制来源名册

按生产环节找持续产出证据的作者，不把这张表当工具榜或最高水平认证。下列“已读”指本轮相关正文；“继承”不计本轮新读。游戏正文仍由对应项目维护，本节只补探索入口。[研究]

| 环节／持续作者入口 | 代表作、读取状态与读者选择 |
|---|---|
| 概念／试玩：[Brian G Cronin，GDC作者页](https://schedule.gdconf.com/speaker/cronin-brian/21059)；Supergiant官方博客及作品更新 | [超小团队试玩讲义](https://media.gdcvault.com/gdc2026/Slides/Cronin_Brian_PlaytestingProcessForUltraSmallTeams.pdf)，GDC2026年3月会期，单场日未知，正文已读。定向假设与整段玩家体验都要取证。Supergiant Hades II 2025-07-02／2026-06更新继承WP4／WP11，追修改理由，不把补丁量当收益。 |
| 2D／补帧：Shahar Bar（SBS Games）；Kenneth Alonso、Gustavo Patow（GILAB） | [SBS9-23](https://sbsgames.dev/blog/ai-sprite-animation)、[补帧论文10-12](https://arxiv.org/html/2610.16423)相关节已读，均已有仓内来源。前者检整段比例／对齐／接缝，后者核RGBA与边缘；作者单次样本、指标不证明完整零手修动作生产胜出。 |
| 3D／PBR：TiMi L1 Leon Zhang、Zhipeng Tan；Unity Generators团队 | [GDC2026生产管线](https://media.gdcvault.com/gdc2026/Slides/Zhang_Leon_Tan_Zhipeng_TheScalableGameAssetAssistedProductionPipelineOfHonorOfKings.pdf)本轮提取大小受限，继承WP3已核图页；[Unity Sprite4-28](https://unity.com/blog/unity-ai-sprite-generator)与[Material5-14](https://unity.com/blog/unity-ai-material-generator)正文已读。先核原型／成品目标及专业人工投入，再比细节质量，不用编辑器内生成代替生产就绪。 |
| 材质／VFX／渲染：Natalya Tatarchuk组织的Advances；IO Interactive Alexander Mueller | [Smolder讲义](https://advances.realtimerendering.com/s2026/content/AlexanderMueller_Smolder_Siggraph26.pdf)，材料更新2026-08-03；本次补读相关正文及关键图，范围见下节。借降规格后的重建契约与失败验收，不把Glacier实现当Unity插件。PSSR／VRRT仍仅入口候选，当前最高水平未知。 |
| 动画／控制：Epic动画团队、Daniel Holden、Videocult开发者 | [GASP5.8，8-12](https://www.unrealengine.com/tech-blog/download-the-latest-game-animation-sample-project-now-updated-for-ue-5-8)、[Holden锁足，7-30](https://theorangeduck.com/page/inverse-kinematics-foot-locking)、[Rain World访谈，2025-09-25](https://unity.com/blog/exploring-procedural-design-rain-world)相关节已读。分状态选择／姿态检索、源动作／接触／锁足；程序动画仍有逐类代码。样例或作者名气不证明二改成本最优。 |
| 音频：Nintendo／Naoto Kubo；Game Audio Insights／Jorge Peirano；Wube及独立开发者afeique | [Bananza访谈，2025-07-15](https://www.nintendo.com/en-gb/News/2025/July/Ask%2Dthe-Developer-Vol-19-Donkey-Kong-Bananza-Chapter-2-2871378.html)与[Speedstorm复盘，2025-05-09](https://gameaudioinsights.com/2025/05/09/the-audio-direction-of-disney-speedstorm/)本次补读：查高频／并发下的取舍，详见下文。FFF407历史参照及[Rainboids多轮生产链](2026-10-14-game-wp6-audio.md#31-jsfxr参数化可局部修改但存参数位级复现是错的)继承已有研究，后者为名册转化缺口，不计新发现。两篇Audiokinetic候选的旧读取缺口保留。 |
| 引擎接入／客户端观察：Unity AI、Epic技术博客与版本文档 | [Unity AI5-05入口](https://unity.com/blog/unity-ai-how-to-get-started)已读，继承S12；Unity Insight沿审计S13，非本轮新读。区分文件代码与场景／引用／编辑器状态；原文入口不等于安装、实际修改或恢复已验。 |
| 测试分发／发行：Valve Steamworks团队 | [Playtest](https://partner.steamgames.com/doc/features/playtest)、[Content Survey](https://partner.steamgames.com/doc/gettingstarted/contentsurvey)对应节已读，滚动文档未标发布日，核实10-21。访问分发与反馈获取分开；生成内容可用性不等于平台发行资格，平台规则也不是体验证据。 |

### P53接收：把游戏Agent来源接到具体修改决策

先查消费者再改共享资产；把已确认的试玩发现固化为回归；共享能力升级要单独验证旧游戏。以下接收B在WP9§14、WP13§6与WP11近期二改及固定提交e42ec124中的来源判断，不是本轮新增发现或原文重读；原冻结读取数与漏检分母不变。[研究]

| 持续来源入口／已有研究 | 改变的读者选择与证据资格 |
|---|---|
| Unity Insight作者、TheArcForge／Hades、Epic资产查询文档；[WP9§14](2026-10-14-game-wp9-engine-handoff.md#14-p53改共享资产前先查消费者) | 先用已有Editor API交消费者清单，再按重复追踪成本评估增量索引。Insight的两游戏28问未评分正确率，Hades小样本同时改变工具与指导；跨作者不等于独立同题胜出。语义相似与引用遍历不能互代。 |
| UnityDataTools问题报告者SkowronskiAndrew；[issue121，2026-07-24](https://github.com/Unity-Technologies/UnityDataTools/issues/121)及WP9补查 | 构建“为何被带入”查询不等于编辑器消费者全集；零引用链不能授权删除。v2.1.0行为为未关闭的使用者报告，非Unity确认或本仓复现，也不是GetDependencies的缺陷证明。 |
| EA／RAID、Meeka／Deckhand、NetEase／TITAN、Second Chance；[WP13§6](2026-10-14-game-wp13-agent-config.md#6-p53探索发现与修复验收分账) | 保既有测试，先校验测试器，再把人确认的发现变为旧策略／动作回归。RAID是强化学习，TITAN是较早GPT-4o参照；独立作者报告补发现与验收的失败机制，没有提供同题完整修复链与总成本优胜证据。 |
| PhaserStudio、rushdygames、SHAN；[WP11近期二改](2026-10-14-game-wp11-gameplay-architecture.md#近期-coding-agent-二改缓冲寿命与时钟信任) | 复用窄规则／能力叶子，但人验手感、可信时钟与快照寿命。SHAN后续修复有固定代码可追，Agent归属未知；不同项目不是同题架构排名。 |
| PhaserStudio[9月22日版本发布](https://phaser.io/news/2026/09/opus-5-5-grok-4-7-and-muse-spark-1-3-in-the-phaser-game-agent)与[7月23日引擎说明](https://phaser.io/news/2026/07/no-you-didn-t-miss-a-3d-update)；WP11补查 | 新游戏能力修复不自动回灌旧模型／引擎绑定，旧游戏需选择局部修复或显式迁移并复验。AE不是Phaser4公共API；两篇同厂商材料不算第二个独立团队。 |

P53的三页内容与来源交接范围闭合，游戏01／02／05仍保留差距2／1／2；01查询正确率与05领先架构同题比较缺口未消失。本次仅接收资料证据，不新增模型、客户端或引擎实测。[研究]

**两项本次定向补漏。** 在c4f280f的docs与domains/game-dev按正式slug、作者、标题片段查重，未命中Cronin讲义及Unity Material正式页；不证明历史从未读过。Cronin的PDF第47–51页（零基46–50）从假设、试玩、归纳到行动，提醒玩家面对整个游戏且不知道开发者假设；支持把程序正确与玩家理解分别找来源。仅凭正文文字，相关页截图未取得，不声称审图。Material正文将工具定位于原型占位、后期换美术成品；这不是商用禁令或所有生成物不可用，只改变候选进入比较前的阶段核查。Sprite相同定位、SIGGRAPH简介已有，不能重报新增。[一手／研究]

**读取记录（执行者自报）。** 研究09:28:17–09:32:46 UTC，历时4分29秒含去重、检索和记录，非纯阅读净工时。限定目标16篇：Cronin、SBS、补帧、TiMi、Unity Sprite／Material、SIGGRAPH、GASP、Holden、Rain World、FFF407、两篇音频、Unity AI、Playtest、Content Survey；其中相关正文已读12，目标读取比例12/16；四项为TiMi获取受限、SIGGRAPH仅简介、两音频不可读。导航页、重复URL与继承卡不计；不是全网召回或提示词效果。本次在新提示准备完成前已开始研究，不计自用项目。名册有全链入口，近期音频原文、VFX完整讲义和同题质量比较仍缺。[研究：范围]

### P51第一次前瞻自用：P47

本次P47新增读者问题是“第二次配置修改后，旧工具是否仍在原环境／定义下执行”，不是重跑旧13项。研究前已读[提示词](../collaboration/prompts/2026-10-21-exploration-self-use.md)，版本cbbb996，内容SHA-256 `5b7ad180b1eb83c8fb00419b551ba9da7e27ef61108cf6145f3772d8eef7ff08`。首次工作树见本地b39ac5f，提示词与其已发布映射cbbb996逐字一致；之后从远端基线接续。既有fallback发行、unknown对账和策略重绑标输入已知，不当新发现。[研究：前瞻记录]

执行者记录起始2026-10-21 09:58:19 UTC、来源／判断冻结10:00:06，检索阅读及输入复核窗口1分47秒；整理至10:02:00，总窗口3分41秒，纯阅读与等待分量未知。冻结名单如下，同页重复访问／重定向不加次数：[研究：执行者自报]

| 来源（冻结时） | 读取与作用 |
|---|---|
| [Temporal10-08团队实验](https://temporal.io/blog/the-immortal-life-of-pi-running-the-pi-coding-agent-on-temporal)、[pi-temporal README](https://github.com/temporalio/pi-temporal)、[guarantees](https://github.com/temporalio/pi-temporal/blob/main/docs/guarantees.md) | 3项相关正文；实验参照与部署反例，非生产效果。 |
| [Earendil10-01发布](https://earendil.com/posts/pi-durable/)、[Pi Durable README](https://github.com/earendil-works/pi/blob/main/packages/durable/README.md)、[pi-ai README](https://github.com/earendil-works/pi/blob/main/packages/ai/README.md) | 3项相关正文；工具阶段绑定与跨商投影；发布文不是独立复现。 |
| [Pydantic Temporal文档](https://pydantic.dev/docs/ai/capabilities/durable_execution/temporal/)、[Cloudflare10-02](https://developers.cloudflare.com/changelog/post/2026-10-02-pi-harness/)、[LangGraph持久化](https://docs.langchain.com/oss/python/langgraph/persistence) | 3项相关正文；原生注册／采用／持久化边界，没有据此新排框架榜。 |
| Pi `packages/ai/src/transform-messages.ts` 猜测raw路径 | 404，未读，不支持实现断言；保留失败来源，不当不存在转换能力。 |

冻结时N=10、F=9；决定性来源D=5（Temporal实验、Pydantic Temporal、Pi Durable、pi-ai、guarantees），FD=5。它们只是限定名单的读取覆盖，不是正确率、全集召回或方法收益。冻结后将Pi与pi-temporal文档固定SHA，并补规范交叉核实，见[P47正文证据](2026-10-12-long-task-evidence.md#p47续查配置改变后旧工具在哪执行)；不回改原名单提高比例。[研究]

**独立参照产生一项补读。** 另一份小卡于09:59:16开始、10:00:27冻结；未读本轮稿，但读过P47基线，故不是对既有内容完全盲测。它的fallback首事件边界和retry policy两项是输入已知；新增PydanticAI历史修复／当前run工具定义的原文未在本次新检索核查，归读取缺口。冻结后补读固定v2.58.0文档，将合成interrupted与真实结果分开。三项断言不是三个独立最高水平来源，不能据此报1/3整体漏检率。[研究：后验查漏]

这次查漏使25增加跨层状态核查：找到耐久执行方案后，仍回原生SDK核请求、执行和历史修复各层的契约；不只沿新框架作者链走。新内容与20二改选择一起交付，记**1个自用内容项目／目标3个**，P47整体B0→B1→B2未验收，P51仍未完成；不把独立卡、固定版本核查或旧研究拆成多次使用。[研究：验收状态]


### P51音频补漏：从单次效果到使用密度

核实：2026-10-21（UTC+8），基线33b0cfe；属于P51名册补全，不另算自用项目。**本次改变25的取样选择：先比较实际重复频率、同时事件与使用阶段，再决定是否增加素材或层次。** 不重做已有“原型不能静音判断玩法”的结论。[研究]

**最高水平卡。** 同约束的最佳AI音频生产路线仍未知。近期领先作品机制参照为Nintendo音频总监Naoto Kubo的Bananza访谈与音频总监Jorge Peirano的Speedstorm制作复盘；两者讲人工团队的质量取舍。主流普及率未知；可行基线是保留必要反馈、复用合格素材。本仓采用的是参照检索与取样方法，不把AAA人力或声音资产迁移给单人项目。[一手／研究]

| 原始来源／位置 | 本次已读证据与取舍 |
|---|---|
| Nintendo英国页，[Ask the Developer 19第二章](https://www.nintendo.com/en-gb/News/2025/July/Ask%2Dthe-Developer-Vol-19-Donkey-Kong-Bananza-Chapter-2-2871378.html)，2025-07-15；Kubo谈音效的段落 | 常见破坏声会被听到数千次，团队手录材质变体、加入轻微程序随机并调整响度／高频；特殊物件另用更华丽的声效。用于比较重复使用的疲劳风险，而非让每次反馈都更强烈。[一手：团队自报] |
| Jorge Peirano，[The Audio Direction of Disney Speedstorm](https://gameaudioinsights.com/2025/05/09/the-audio-direction-of-disney-speedstorm/)，2025-05-09，页面另列05-16；Sound Design & Voice Design、Mixing | 同时事件多时删去赛中持续轮胎声／环境铺底，赛前仍保留；发动机、轮胎与nitro按情境让位。说明应搜“删了什么、什么时候保留”，不只搜新增混音功能；不推广为所有赛车都删环境声。[一手：作者自报] |

**反例与采用边界。** 孤立样本出色不能证明密集触发清楚；反过来，赛中删掉的层在赛前可能有用。Agent可把参照拆成高频、并发、状态切换的核查条件，人判断实际听感；现有简单方案已清楚时不为模仿大作增加随机化或复杂混音。本次只读文本，没有试听、模型／引擎运行或收益比较。[研究]

**补漏归类。** 基线docs与domains按Bananza／Naoto Kubo／文章ID及Speedstorm／作者／域名查重均未命中，记为本次新检索候选，不断言历史从未看过。WP6已有Rainboids生产链却未进入持续作者名册，归转化缺口并补内部链接；不重复计算其来源发现。两篇既有Audiokinetic候选仍未读，本次未重试，原先12/16的历史读取分母不改写。没有冻结的外部完整参照集合，不计算总体漏检率。[研究]

**使用回执（执行者自报）。** 先读33b0cfe所含P51提示词再研究，11:04:20 UTC开始，11:05:51冻结来源与决定，约11:07整理结束。1分31秒为研究墙钟历时，检索、阅读与等待未分离，不能称净工时。限定目标N=3、相关正文已读F=3：新增原文2篇，既有[FFF396](https://factorio.com/blog/post/fff-396)重读1篇；决定性新增来源D=2、FD=2。主执行者随后重读两新增原文不重复计数，提示词自用仍为1/3，P51整体未完成。[研究：局部读取覆盖，非效果指标]


### P51讲义补读：Smolder不是通用降规格处方

核实：2026-10-21（UTC+8），基线c7524ec。**保留WP5原生运行时＋合格烘焙细节的默认，不建议单人项目移植Glacier。** 本次补审计S20已知的正文读取缺口，不新增规则或升级材质／特效页评级。[研究]

**最高水平卡补证。** Alexander Mueller／IO Interactive的[Smolder讲义](https://advances.realtimerendering.com/s2026/content/AlexanderMueller_Smolder_Siggraph26.pdf)是近期高端生产机制参照；[课程](https://advances.realtimerendering.com/s2026/index.html)在2026-07-21举行，材料标08-03更新。最佳同约束方案仍未知。主流参照及可行基线沿用审计A04的参数材质、原生粒子和flipbook；本次比较对象是作者自己的失败方案与修正机制，不是跨引擎质量排名。[一手／研究]

- **PDF第93、95、97–100页（从1计）：** 整体半／四分辨率产生重影；改为按透射率共享光照采样后，仍须恢复逐像素蓝噪声插值，并保留逐像素深度及雾等集成。稀薄体积收益较低。[一手：作者讲义]
- **第91、107页：** 重建器／预设需分别处理，性能表排除了异步阴影成本。不能拿局部毫秒数当完整特效预算。[一手：作者讲义]

**交接选择。** Agent可把这些失败条件加入已有降规格对照记录，人检查目标重建器下的拖影、遮挡和玩法可读性；场景不匹配或要改专有管线时撤回移植候选。WP5已经要求动态与设备验收，因此本次不再给25追加同义步骤，也不把作者静态图视作本仓动态效果验证。[研究]

**范围与回执（执行者自报）。** 113页PDF补读90–102、107–112页讲者注释，核视91、93、95、97、98、99、107页；未逐页审完整讲义或观看动态视频。文件SHA256为`1db757c81568181f812a279d97f42fb2ce691b2018f5111e407ef1cb72316268`。网页工具因文件大小读取失败，同一官方PDF普通获取成功，无访问拒绝或安装；PDF及图片不入库。先用既有P51提示，11:12:36–11:13:43 UTC冻结来源与决定，墙钟1分7秒，净作业／等待未分离。N=1、F=1、D=1、FD=1，入口不另计；同源失败后补读不拆分，旧来源补读1、新发现0。此为名册子任务，自用仍1/3，无合格独立漏检分母。[研究：读取覆盖]


### P51第二个前瞻自用项目：P52三页代际复核

2026-10-21按用户分工从c484b1a接续02／03／09，开工前采用同一[P51提示](../collaboration/prompts/2026-10-21-exploration-self-use.md)，三页统一研究、整合、独审与发布，不拆成三次自用。P52另三页05／15／22不在本批，项目整体验收未完成；完成本批后自用累计**2/3项目**，P51仍未完成。[研究：验收口径]

**改变的选择。** [02](2026-10-10-audit.md#p52模型与成本代际复核)先区分推理不足与可控harness开销；[03](2026-10-13-context-tool-choice.md#p52上下文代际复核)把模型升级作为重检旧提示的触发条件；[09](2026-10-12-baml-and-review.md#p52评审代际复核)用事故及干净PR校准扩量，并修正托管评审已GA的旧状态。没有新探针／JSON或模型运行。[研究]

**先冻结再对照。** 02于11:31:55、03于11:30:52、09于11:32:05 UTC冻结来源与决定；各页起止和读取表见上述链接，均为墙钟记录，不合计成净工时。页面N/F分别5/5、3/3、7/7，D/FD分别5/5、3/3、5/5；跨页共用Cursor9-23，项目来源去重后N=14/F=14、D=12/FD=12，根重读不另计。GA公告与反方观点为09新读，其余以已有路线重核为主，读取覆盖不等于探索收益。[研究]

独立参照在11:31:50–11:33:19 UTC以旧基线三页及审计卡冻结，未读新稿；这是对新稿独立，不是对旧内容盲测。三项压力点分别是02维护审计的覆盖目标、03模型升级后规则失效、09[同模型评审意见回流](https://cognition.com/blog/multi-agents-working)须核原任务范围。前两项已覆盖；第三项在08及既有研究已有，本批09也已写不为清空意见扩大修改，因此不新增机制或计新发现。根在冻结后读原文、查全仓补证，不回填上述读取分母。没有合格完整外部参照集合，漏检率未知，不报0%。[研究：有限查漏]


**P52续接05／15／22（2026-10-21）。** 从f346814按同一提示继续，先核main／活动分支与计分板，剩余三页没有活跃认领。05把领域判断与机械规则／冗余流程分开；15区分请求覆盖和补丁粒度，切片不冒充完成；22区分包级采用与因果归因，修grader后重新对齐基线。三页整批交付，不新增自用项目，P51仍2/3。[研究]

回执分别见[05](2026-10-13-domain-skill-contract.md#p52技能代际复核)、[15](2026-10-12-baml-and-review.md#p52任务打法的覆盖范围与交付终点)、[22](2026-10-12-experiment-records.md#p52评估代际复核)：本批N/F为5/5、5/5、2/2，D/FD为3/3、3/3、2/2，三路原始URL去重后12/12、8/8。这是本批读取覆盖，不与上批14/14相加成项目独立来源数；共享旧来源及根复核不重复记发现。没有新增独立外部盲测分母，不报漏检率下降。[研究]


### P51第三个前瞻自用项目：P54入口分层选择

2026-10-21从c39619b按同一提示推进01总览、Gemini、IDE与开源四页，问题固定为“已有仓库修改已可验收，值得换哪一层”。新选择是只缺会话整理时保原CLI，先比较终端承载；要集成审改才核ACP；有质量目标、模型供应或控制策略缺口时比较开源harness。Google近期生产profile实践支持补运行证据，不能归因到入口。四页作为一个内容项目，当时自报累计**3/3自用项目**；该使用门槛验收于10-22撤回，见下文P80更正，历史内容不重计。[研究]

**回执为执行者自报。** 主入口链12:10:56–12:14:22 UTC冻结，N=18／F=14、D=7／FD=7；Gemini链12:14:13–12:14:48 UTC冻结，N=3／F=3、D=2／FD=2。前者含4个正文未成功读取目标，后者排除一篇只有企业发布与引用的材料。两个窗口并行，不能相加为净工时。旧P44输入不计新读；主执行者随后补入Scaffold Effect论文，属于冻结后的补充，未回填原两链计数。详见[入口证据](2026-10-12-community-source-records.md)。[研究：读取覆盖]

**本轮尚无可计算漏检分母。** 独审复核决定性断言和推荐范围，不把参与整合后的材料称独立盲测。此前写“P51的三项目使用门槛已达到”，现撤回该验收；保留按双周核行动性遗漏的接续；C3漏检率下降和P41／P38方法收益仍待证。新增来源入口保Zed工程博客／ACP实际撤回、Google Antigravity内部生产复盘；查的是交互、执行与配置哪层失效，不是增加产品名单。[研究]

### P72校准参照回流（2026-10-22）

固定审计f3ed2bca带入的6项漏检候选中，dot-A本批转化Code2Skill、NP-Bench、AsynCodeBench与ReviewBench四项；这不是全网漏检率或四个独立团队效果复现。程序知识回05／03，集成依赖回08／22，评审离线筛选与生产窄试回09；决定性原文及版本分别在[Skill研究](2026-10-13-domain-skill-contract.md#p72审计补强程序卡放在能用它的地方)、[并行研究](2026-10-12-experiment-records.md#p72审计补强并行结果按依赖接收)、[评审研究](2026-10-12-baml-and-review.md#p72审计补强离线评审怎样进入放量)。独立源新增到相应问题的名册，不以标题／引用数作为完成。Spec2Game／SPRITE归B的游戏补强，本端不重开；已引用游戏材料的转化缺口另计。[研究]

团队接收名册续补（P58，2026-10-22）：从[Spotify Engineering](https://engineering.atspotify.com/)读到Tyson Singer的[9-16质量复盘](https://engineering.atspotify.com/2026/9/ai-changed-how-spotify-builds-what-we-learned-and-fixed-about-quality-at-higher-velocity)，把生成能力与生产接收容量分开；明确引用的7月事故只补因果边界，不与依赖升级混成同一链。四路比较及未验范围见[P58](2026-10-12-community-source-records.md#p58续接生成与生产放量分开)。[一手／研究]


## P80：探索整页比较与校准漏检

2026-10-22；起始main `64200e3afefc6a2a00fb011864b3f45d17d485ec`。读者决定是“现有Agent的检索何时升级、怎样避免搜到却没正确用上、何时停止”，不是挑一张研究产品榜。复用P46来源名册与P51提示词；本批不做游戏内容，也不运行模型或安装框架。[研究]

**采用轻量证据闭环，保留普通检索起点。** 当前代企业检索参照支持按问题分配步骤，ATLAS另补广覆盖需求；独立研究给出综合端引用失真及过早／过晚停止的具体反例。因此改25：下一次查询绑定未决条件，最终综合保留单源支持，结束搜索后再验明确选择。下面比较的是同题机制与迁移条件，完整最优产品未知；缺少本仓模型效果不等于不能完成资料层的整页比较。[研究／经验]

| 原始来源、日期／读取范围 | 同题证据与反例 | 采用／保留、独立性边界 |
|---|---|---|
| [Databricks AIR](https://www.databricks.com/blog/adaptive-instructed-retriever-frontier-quality-search-2x-lower-latency)，Wang等，9-09；Training、Online RL与图2 | 当前代检索比较含Sonnet 5、GPT-5.6 Luna；单步与顺序搜索按证据需求分配 | 保留简单问题定向检索；和广覆盖参照一起支持按缺口升级的设计判断；厂商混合内外部任务自报，不外推开放网页选型收益 |
| [EDR](https://aclanthology.org/2026.acl-industry.116.pdf)，Salesforce，ACL Industry 7月；§3.1、5.1–5.4、限制 | 10个销售场景中去掉完成条件，HAA 82.09→73.67，耗时47→43分钟；少搜可能只是少完成 | 采用覆盖目标与依赖信息分流，保留预算终止；GPT-4.1／5.1及内部评价不当当前模型效果 |
| [RAAC v1](https://arxiv.org/html/2608.15191v1)，Radboud／Thomson Reuters Labs，8-15；§3.3、4、附录C | 重复与覆盖信号可指导换路；失败例多搜32→63次，另一例搜到材料却未明确回答就停 | 采用“缺口→换路／停止”检查，不装控制器、不照搬阈值；封闭检索短答案与Sonnet4.5控制器范围 |
| [Who is the Agent to Blame? v1](https://arxiv.org/html/2608.24306v1)，Bar-Ilan／UNC／UT Austin，8-25；§4–7、限制 | AI-Q 50个英语题，综合笔记换带来源片段，引用召回64.5→69.7、精度87.6→94.1，RACE 52.6→52.4；另一短引用提示也改善 | 采用决定性断言的单源支持交接，而不是默认再加评审Agent；独立大学团队；AI-Q主控／计划GPT-5.2、研究员Nemotron Nano 30B，judge GPT-5-mini；排除表格，支持不等来源真实 |
| [DuMate v1](https://arxiv.org/html/2606.07299v1)，Baidu AI Cloud，6-05；§2–3、表3 | 动态计划、递归搜索、固定／临时rubric分开；报告rubric消融降0.42，再去流程rubric仅额外0.08 | 保留固定硬约束、按证据更新缺口指导，暂不照搬递归管线。原文rubric是行动指导而非数值自评：Writer用固定，Planner／Search兼用临时；基线含既有榜单结果，不作同预算优胜证明 |
| [ATLAS](https://exa.ai/blog/atlas-benchmark)，Goldberg等／Exa，10-08；构建、审计、评分 | 当前代含Astra／Opus5.5；实体发现、单元格属性、整行正确分账，未定单元格不评分 | 采用“找到名字”和“正确判断条件”分开；厂商预览与待发布数据／grader不构成独立产品排名 |

六项新源为本次检索输入之外取得；这里的“新”仅指25与本研究记录未收录，不证明全仓无人读过。[研究：来源边界]

**其他主要选择继续保留。** 来源真伪、利益关系及独立性沿用原始上游核查；本次校准证明只追工具团队会漏邻近学术机制，因此增加跨术语回扫。生成交接保留已读GOV.UK真实改稿与P41任务资产证据，不把研究报告评分当实际接入效果。原有DRB II v3专家量规与DRACO负面条件供评价结构，本轮主端重读相关方法段，不算新发现；已有好比较可以复用，不能把基准的禁参考策略无条件套给复用任务。[一手／研究]

### 首份校准漏检统计：固定树与参照集

**这组有界参照的确认重要发现遗漏为6/25＝24%，另2项行动重要性待判。** 不是全网漏检率，也不是未来任务召回。指定六项是后验挑出的遗漏候选，确认6/6＝100%只能叫“候选确认比例”；补录不能让历史24%变成0%。[研究：本仓诊断]

固定对象为[校准审计](../collaboration/reviews/2026-10-22-calibration-audit.md)的截止树 `f3ed2bca44bac831743a1c529e314dcd7c750cac`（提交时间10-22 03:16:34 UTC+8），观察18个抽审页及对应研究。按正式名称、稳定arXiv ID、canonical URL／slug在固定树检索，通用词sprite不算论文命中；这能证明仓库记录状态，不能证明执行者从未读过原文。[一手：Git；研究]

**分母可复算。** 审计S1–S16的多源单元拆成22篇，再加后验ReviewBench、已引Play2Code和RSIGame，共25篇去重、审计已读相关正文的参照。排除Ramp正文未取、GameDevBench仅摘要、发布时间不明且截止后补查的Shopify索引；未抽审23页与全网不在范围。参照是后验选择，不能据比例做统计推断。[研究]

| 截止树记录状态 | 完整参照成员（沿审计S编号） | 数量／处理 |
|---|---|---|
| 同篇标识已记录 | S1；S2 Browser Use／Helix；S3；S4；S5 efficiency／Router；S6 Astra迁移／Vercel；S7；S11 Chip／River；S12 Pi Durable；S13；S15；Play2Code；RSIGame | 17/25＝68%；其中最后两项有转化缺口，另报不加发现分子 |
| 未记录且确认会补具体选择 | S8 Code2Skill；S9 NP-Bench／AsynCodeBench；S14 Spec2Game；S16 SPRITE；ReviewBench | 6/25＝24%；六项候选均确认 |
| 同篇原文未记录，行动重要性待判 | S10 Auto-review；S12 Agents API公告 | 2/25；已有其他同产品契约文档，不能仅因缺该文认定重要机制遗漏 |

严格按同篇来源标识，缺失8/25＝32%；这是记录覆盖缺口，不是重要漏检率。两项待判始终留在分母，不悄悄删成6/23；若以后确定其重要性，另记判定日期，不回写审计原始发现。[研究]

| 确认遗漏 | 改变的读者选择 | 风险原因与本次方法修订 |
|---|---|---|
| [Code2Skill](https://arxiv.org/html/2609.05571)，9-04 | 程序知识提炼与文档摘要分别比较，选择放计划还是评审 | 工具自用博客之外，补“程序知识／源码盲重建”等邻近论文术语 |
| [NP-Bench](https://arxiv.org/html/2610.07261)，10-05 | 共享契约迁移检查实际merge结果 | 从多Agent拓扑／速度转向contract migration与集成接收的失败机制 |
| [AsynCodeBench](https://arxiv.org/html/2609.32662)，9-26 | 上下游依赖与最终集成分验 | 补异步依赖／integration checker入口，不以分支测试替代 |
| [Spec2Game](https://arxiv.org/html/2610.04253)，10-03 | 运行、规格和呈现分验 | 累积修改之外补开环生成的评价覆盖研究；内容已由B转化，本批不重做 |
| [SPRITE](https://arxiv.org/html/2604.18591)，2026公开 | 原生UI、切片、结构重建按条件分流 | 资产生成之外查HCI结构重建／引擎输出；内容由B接收，不外推整族零手修 |
| [ReviewBench](https://github.blog/ai-and-ml/reviewbench-an-open-benchmark-for-ai-code-review/)，10-05 | 离线筛选接生产窄试与修补核验 | 补GitHub工程出口；这是审计后验定点补查，和最初五项分层保留 |

上述原因是从缺口推导的检索风险，历史执行日志不足，不能当已证实的停工或个人操作原因。A四项已在7073ede转化，B的Spec2Game见9a0eba3／main bbce056、SPRITE见ad2210e；这些是事后接收状态，不倒填“自主发现”。[研究]

**读取与转化分别记。** Play2Code／RSIGame在截止树已有引用，审计指出相关结果没进入“何时追加真人／识别假阻塞”的决定；列两项转化缺口，不称此前没读。今后每个主要选择同时核“候选找到没有、相关原文取得没有、决定用上没有”，让漏检回扫先修对应层，而不是一律追加搜索。[研究／经验]

**下个双周窗口保持任务范围、截止日、来源去重与待判规则可比。** 新的完整参照应由未参与本轮探索者先冻结；已知六题仅供修复，不重考作方法提效。若窗口范围改变，分别列新旧分母，不用一个下降百分比掩盖样本变化。[研究：接续条件]

### 自用与验收记录

本项目开工采用P51设计，初始提示词SHA256 `5b7ad180b1eb83c8fb00419b551ba9da7e27ef61108cf6145f3772d8eef7ff08`。独立研究子问题03:49:14–03:51:00 UTC取得7个目标相关正文（其中6个用于决定，Astra-26仅候选）；这是阶段性读取回执，不单独计一次自用验收。主端随后重核决定性原文、固定树分母、整页转化与独审；研究净工时、等待和复核未完整分离，均不虚填。校准六项是输入已知参照，不能当本轮陌生发现。[研究]

**更正旧P51验收。** P47／P52／P54的历史回执与内容产物保留，但“累计3/3，已达使用门槛”撤回；秒级打开原文及来源数不足以证明真实研究。后续以完整内容项目的需求、比较、负结果、独立查漏与实际交付验收，不按时长凑门槛，也不把本项目多次检查拆成使用次数。[研究：10-22质量更正]
