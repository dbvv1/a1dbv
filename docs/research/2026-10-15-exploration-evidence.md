主线：M6／主线 1、2，外部探索怎样支持可采用的选择。
改变的建议：借现成检索综合与评测量规，只补决定性证据、失败状态和生成交接，不先自建研究框架。
新证据：2026-10-15 核读托管研究说明、三个固定开源实现、评测论文与评分源码；补核 Steam 公告同源正文读取及限长对照，区分抽取失败、来源身份与权限边界；重读 OpenCode 同提交文档／实现及 Unity 6.3 弃用／保留绑定，补来源冲突的处置。

# AI 探索：系统与评测证据

核实时间：2026-10-15。以下来源由本轮调查读取，重要源码以固定 SHA 定位；独立核查修正了空上下文守卫的范围、ALCE CLI 输入契约、DRB II 版本与禁源边界。资料核验不等于模型效果实测。

## 摘要：建议和证据各到哪一步

- ✅ 采用需求卡、决定性证据核查、条件决定与生成交接的设计，正文见 [25 AI 探索](../25-ai-exploration.md)
- 🧪 按来源与控制需求选一个已有权限的托管 Research 产品，不要求每题比较三家；额外核查按风险选择
- 👀 有来源控制／固定版本缺口时评估开源管线；LangChain 归档方案暂缓原样新部署，GPT Researcher 的局部守卫不等于全部无证据路径已解决
- 评测借原子量规、引用支持和缺项分析；不把引用数、Agent 投票或短答案榜单当开放探索总质量
- 三类纸面走查见[案例记录](2026-10-15-exploration-cases.md)；它们围绕熟悉来源构造，未证明未知发现或实际净收益

评级是条件设计判断，不是产品性能排名。官方说明证明其公开契约，静态源码支持具体路径，使用者帖子支持其报告的问题；没有一项自动构成本仓当前模型的真实任务结果。动态价格、模型、访问范围和版本只在上述核实日有效，准备采用时再核；访问失败保留未知，不更新为核实成功。完整执行成本与实际质量尚未观察，不填零或宣称领先。

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
