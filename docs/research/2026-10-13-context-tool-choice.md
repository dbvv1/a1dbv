主线：二，额外能力何时值得加
改变的建议：P73大文件先定点原文，摘要只缩小候选；接收先核成功与质量，成本路由不代批权限。P55先分动作表达、发现、接入与授权，认知纠偏可有限、权限不能耗尽放行；先缩小原生查询，再按缺口加能力；生成物命中须回到持久源并重生成核产物，同名多先核原生消歧、调用与诊断。旧快照查刷新，跨配置查构建范围，语义为空查导入／依赖，封装漏项查过滤／版本；定位与详情分开，省略不作不存在，全量验收读完整报告。导入规则区分源码字符串与解析目标；文档核版本，设计核组件契约，记忆核来源／身份／失效；异步结果分任务、工具与业务层，优先复用兼容 SDK；接入分工具面、凭证与输入信任；共享指令核宿主发现／导入与加载，会话动作按问题选。[经验／研究]
新证据：10-22补Spotify摘要反例、shunt固定实现与外部修复复测；旧模型路线只作候选，未运行上游。10-21补P55近期接口比较、Runme状态接入、OCA严格Hook撤回、Laminar分层及OpenAI受控部署，收益与迁移日期边界见首节；同日补P44直接coding记忆对照与公开发布范围，分信息价值与自动供给，未运行模型；10-18 补 fullsend-ai #861 原评审、固定回源补丁及原评审者重生成回执，缺 Agent 原始检索轨迹，不作工具效果比较；10-17 补 PostHog LSP 五题对照自报、撤回补丁与适配返工，缺原始运行产物，不推质量等价或 Codex 效果。其余按固定源码／官方契约／发布／测试定义[一手]、原帖与复测自报[社区]、历史数据复算[研究]、本仓标准库局部演示[经验]计证，日期与反证见各节。本仓未运行模型、上游客户端／服务或上游测试；源码与测试定义不等于执行，已修旧错不作现状；语义链仍缺修后原任务验收，不推端到端收益。

# 上下文获取：问题、版本与状态边界

## P73：定点原文与摘要委派

核实：2026-10-22（UTC+8）；起点98424adde。主线二，已有03页的深度补强，不新增页面或评分。**改变选择：先用原生检索定位需要判断／修改的原文；摘要只帮助筛选候选，先验工作结果再统计节省，暂不默认加装强制路由。** 本节是公开原文／固定源码核查与外部自报复核，没有本仓模型、宿主或插件运行。[研究]

### 最高水平卡

- **近期领先参照**：沿用已读 Cursor Katz／O’Keefe／Yee 2026-09-23 生产 harness 比较，保留高频原生读／搜入口并撤强烈探索委派；原文及组合效果范围见本记录 P52。不是用户配置单因素试验。[一手／研究]
- **候选与代际**：Spotify Dimitri Mazmanov 9-03 的 Portal／shunt 是近期工程路线，作者推广自家产品；工作模型 Gemini 2.5 Flash，主 Claude 具体模型未交代。最高同质量总投入方案未知。[一手／研究]
- **主流与可行基线**：原生检索、定点原文、必要时摘要续接；采用率未知。本仓推荐属于前沿比较后的条件默认，而非新工具胜出。外部使用者提供运行兼容性反例，不等独立质量对照或独立团队证明。[研究]

### 三条路径的采用与撤回

原生定点读保留判断依据，代价是执行判断的模型接收相关原文；按需摘要减少主侧信息量，但多了一次有损交接；强制Hook再增加路由、宿主协议及升级维护。读者先区分事实定位与正确修改，而不是按文件行数决定是否委派。Agent检索与回读，人核验收标准、关键约束及实际修改。[研究：机制比较，未测净收益]

[Spotify 原文](https://engineering.atspotify.com/2026/9/portal-by-spotify-cut-my-claude-code-token-usage-by-90)已读 Routing、benchmarks、What doesn't work：从可忽略的 CLAUDE.md 指引改 Hook＋Skill；摘要漏线程安全细节，编辑需回读。四个 Java 场景的约90%是主侧 bulk-read token 自报，不是总费用或质量收益；往返和重复传源也有代价。上述遗漏是作者非受控个案。[一手：作者自报]

因此保留原生为默认；仅在大量可隔离事实查询时试摘要，返回可定位依据。摘要没有命中不证明代码不存在，改前回读相关实现。若遗漏约束、反复取全文或维护成本抵消收益，就撤回这条委派路径，不要求撤掉所有子 Agent。[研究：本仓选择]

### 固定版本、外部二改与未采用边界

官方观察提交为[cd5f40fb](https://github.com/spotify/portal-ai-plugins/commit/cd5f40fb98a2c61c6041b228d11766a5318dc312)，shunt 0.2.0；外部修复为[b4a11157](https://github.com/calvinchengx/portal-ai-plugins/commit/b4a11157d863ac39a4ceb2d3475376e7dd03ae7d)。截至本次官方PR列表及当前源码核查，未发现该修复合入，不写成官方第二版。[一手：固定源码／公开状态]

1. **官方路由覆盖有限。** [Read Hook](https://github.com/spotify/portal-ai-plugins/blob/cd5f40fb98a2c61c6041b228d11766a5318dc312/plugins/shunt/hooks/check-file-size)默认阈值350行，非空 offset／limit 直接走放行分支；[Bash Hook](https://github.com/spotify/portal-ai-plugins/blob/cd5f40fb98a2c61c6041b228d11766a5318dc312/plugins/shunt/hooks/check-bash-read)只解析开头数种读文件命令，遇管道或含 `>` 的重定向提前放行，未取输入 cwd 或展开 HOME。因此它是成本路由，不是读权限沙箱。[一手：源码]
2. **故障结论必须对齐宿主版本。** [#10 的2.1.270复测](https://github.com/spotify/portal-ai-plugins/issues/10#issuecomment-5664905410)及[2.1.286复测](https://github.com/spotify/portal-ai-plugins/issues/10#issuecomment-5922231309)都称旧 block 有效、allow 报格式错。后者固定 main 3c24ca3／shunt0.2.0，并提醒更新会覆盖其本地修补。不能沿用最初“全部不阻断”的概括，也不能把作者本地修补写成官方已修。[社区：外部使用者自报]
3. **合法输出与正确权限语义不同。** [外部分支 Read Hook](https://github.com/calvinchengx/portal-ai-plugins/blob/b4a11157d863ac39a4ceb2d3475376e7dd03ae7d/plugins/shunt/hooks/check-file-size)将放行改为 permissionDecision=allow。[宿主协议](https://code.claude.com/docs/en/hooks#pretooluse-decision-control)允许退出0无输出保留正常权限流；显式allow通常跳过提示，但仍评估deny／ask规则并有例外。成本路由无意见不等于主动批准；不能将问题夸大成绕过全部权限。[一手：源码／协议；研究：设计取舍]
4. **修复分支也需要二改回归。** [#21](https://github.com/spotify/portal-ai-plugins/issues/21)作者Susanta2102在9-25报告 b4a1115 仍有cwd／路径解释问题，并新增glob退化；作者未确认宿主实际启动cwd。该回归属于外部分支，不能说是官方main新增；这里是实际公开再检查，不是本仓复现或已闭合的官方修复链。[社区／研究]

### 节省数字之前的接收门槛

固定[evals/run.sh](https://github.com/spotify/portal-ai-plugins/blob/cd5f40fb98a2c61c6041b228d11766a5318dc312/plugins/shunt/evals/run.sh)中 run_eval 直接执行Hook并检查顶层decision，不经Claude宿主；token_estimate以 Shell 字符串长度按 `(长度+3)/4` 估计，bulk-read调用失败后仍继续按返回字符串长度计数，code-write也忽略失败并将主侧with_tokens置0。没有答案质量断言，也未纳入完整工作模型成本。[一手：固定源码]

**该脚本不是博客 Java 场景的原始运行产物。** [#10 原报](https://github.com/spotify/portal-ai-plugins/issues/10)指出其 fixture 与公开表格不同；这里检查可复用测量入口，不据脚本缺陷倒推博客运行失败。[社区／研究：归因边界]

这意味着失败或空响应可能进入节省计算，是静态控制流判断，不是本轮观察到一次失败运行。先验成功状态、答案与原文一致、目标修改可通过相关检查，再比较含回读／往返／重试的全投入。脚本内部路由断言通过，只能回答脚本是否输出预期字段，不能证明宿主接受或任务等质。[研究：接收建议]

### 读取与交付范围

开工先读P51提示词，源版本沿用cbbb996。当前原生参考与P52列输入已知；Spotify及其仓库、#10／#21由规划研究新发现，本节作者再次读取决定性正文、两官方Hook、外部分支Read Hook、评估脚本与宿主协议，重复读取不计新发现。本节复核窗口为18:11:09–18:15:45 UTC，研究与编写交错，净工时未知；独立于规划复用，限定新增读取集合N=8／F=8、决定性D=8／FD=8（博客、两issue、三官方源码、一个外部分支源码、宿主协议；同文件失败后读成不重复计）。这只是列明集合的读取覆盖，不是全网覆盖；旧Cursor复用不计新读。尚无独立漏检统计分母；本仓未测当前模型总投入。内容、整页独审及最终树检查合起来才构成本项目资料交付，不以本节新增或gap1标记重算验收。[研究]

## P55：能力接入、纠偏与授权边界

主线二；同题比较修复／运维中的能力、反馈与授权。04管接口，06分认知纠偏与授权，10管执行边界。核实2026-10-21，起点3b5ad27；只读公开材料，未安装或运行模型／客户端／引擎。[研究]

### 最高水平卡与选择

- **近期领先参照**：OpenAI 8-25 Runme复盘在应用状态层接入；Ramp 9-09 OCA撤回严格服从证明但保留权限／人审；10-20 Laminar分开发现与授权。作者与原文见下。9月企业任务研究另比较开放shell与固定目录。[一手／研究]
- **主流参照／可行起点**：已有文件、CLI、typed工具、项目检查及有效权限，不代表有采用率统计。保留有效能力，有明确缺口或质量／总投入收益才试新增，不要求复制平台。[研究]
- **推荐层级**：同题比较后的领先机制，非全球最优。获准且可隔离的开放执行用shell，固定业务目录保留窄工具。认知提醒按反馈目标收敛，授权不能耗尽放行。Agent取证与实施，人保留资源及高后果动作决定。[研究]
- **差距**：缺当前Astra／Opus5.5同权限同能力面对照、Hook单因素与真实二改总投入；不报净收益或安全率。三页gap1由独审核实。[研究]

### 决定性证据：支持什么、反例在哪里

1. **动作表达不等于传输协议。** Hazel Mak、Susheel Suresh等，Microsoft／CMU，[Is Bash All You Need?](https://arxiv.org/html/2609.11999v1)，2026-09-10 v1。已读方法、结果、讨论与相关附录；作者有Copilot Studio机构关系。174个TheAgentCompany／480个APEX任务，Opus-4.8／GPT-5.5比较typed、bash、组合、合成工具与PTC；shell臂质量较高，叠工具无可检测pooled增益，PTC省token却不稳定增质量。**APEX的Bash本身经MCP提供；TheAgentCompany的60工具目录未覆盖shell全部endpoint。** 因而不能归因为CLI击败MCP或同权限安全优势。开发期曾发现读取答案／同事文件的捷径，报告试验加入阻断；成本为估计推理费，不含人的总投入。[研究：作者实验，未复现]

2. **已有应用状态优先，不只为endpoint新造后端。** Jeremy Lewi，[Automating repetitive work at OpenAI with Codex](https://developers.openai.com/blog/automating-repetitive-work-at-openai-with-codex)，2026-08-25；已读评估、notebook协作及末段。Runme用notebook保留目标、计划、输出和决定，经浏览器WebMCP操作；对静态客户端，传统MCP endpoint另需后端，改变运维与数据位置。人审核评估系统、新基础设施及配额不足时的已批准替代。团队规模、模型版本、完整耗时／失败率未知，自用“更快”不外推为效果。[一手：作者复盘]

   原文直链的[固定注册文件](https://github.com/runmedev/web/blob/4a74e79efa18d78d63930112818b560bb10a0bb3/app/src/components/WebMcp/WebMcpToolRegistrationHost.tsx)已读147行：先查modelContext入口，注册ExecuteCode，选择sandbox模式、保存输出／失败并在清理时注销；readOnlyHint=false。只确认非只读注册路径，不证明隔离／审批全链或浏览器普遍支持；入口缺失、状态不准或边界不清时退回原入口。[一手：固定源码；研究：撤回]

3. **严格Hook的失败与实际撤回。** Richard Marmorstein、Austin Ray，[How we built OCA](https://builders.ramp.com/post/how-we-built-oca-our-ai-on-call-assistant)，可见发布日期2026-09-09。初版发Slack报告前查日志，要求证明加载指定Skill，出现拒绝与重复撞闸；后改成六个各触发一次的取证／自查detour，最后不要求服从证明便允许报告。生产调查仍广泛只读、写入受限，修复PR由人合入；认知指导的撤回不扩大执行授权。[一手：团队自述]

   团队随模型升级重验旧配置；正文Astra“过去一周”的实际日期未知。没有Hook单因素效果、公开配置、失败日志或原始评分，不用整体人时自报量化Hook收益，不证明全部提醒实际执行或照抄次数。[一手／研究：边界]

4. **反证：不按“强模型”一律删typed工具。** Run-Ze Fan、Zihao Zhang等，[An Empirical Study of Harness Design for Coding Agents](https://arxiv.org/html/2609.20804v1)，2026-09-17 v1；已读实验设置、动作空间与限制。四个开放模型，动作空间仅T4／128k条件消融；Mistral-Medium-3.5-128B在SWE-Bench从全工具68.6%降至bash-only45.4%，Terminal-Bench则37.08%升至43.82%。模型与任务改变结果；不代表Astra／Opus5.5。保留有效工具，撤回后仍验同任务产物。[研究：作者实验，未复现]

5. **发现和授权独立维护。** Sam Kronick，[Building Laminar](https://builders.ramp.com/post/building-laminar)，2026-10-20；Kiryl Liaushun的[Tools](https://builders.ramp.com/post/building-laminar/tools)、Vincent Capol的[Connectors](https://builders.ramp.com/post/building-laminar/connectors)未显示独立日期。工具从100+预装schema改为按需搜索，同时保留常用直供、小集合直接提供；connector集中凭证使用者与操作权限，检测上游变化。工具隐藏只改变可见入口，不撤销底层权限。三页正文已直读；团队取舍不证明搜索普遍更省或connector天然安全。[一手：团队复盘；研究：分层默认]

6. **受控执行与事后核查。** OpenAI，[Running Codex safely](https://openai.com/index/running-codex-safely/)，2026-05-08；主执行者直接读内部部署相关节。组合沙箱、边界审批、受控网络及强制配置，关联请求、审批与结果供安全人员判断。10借此核“获准／实际发生”，不默认存全量对话或秘密。安全率、团队人数、模型版本未知；结合10月实践，不当当前客户端安全认证。[一手：内部部署自述；研究：适用边界]

### P51使用回执与后验补读

本研究线先用提示词blob98f326ab4975771d797b1a14348694cbd3b3f744，12:47:10 UTC读任务，约12:47:30开始外查，12:52:00冻结来源与决定；墙钟约4分30秒含等待，净阅读工时未知。冻结时去重N=12，直接读相关正文F=10；另2项OCA／Laminar取得原站索引连续全文，不能混写成直读。决定性D=5、FD=4：上面企业论文、Runme复盘、固定注册、OCA、harness论文；OCA当时只有索引全文。已知重读1、新读11只表示受查docs未检出，不证明历史从未读过。[研究：执行者自报]

其余7个冻结对象为：[How we contain Claude](https://www.anthropic.com/research/how-we-contain-claude)（5-25，已知重读）、[Seeing like an agent](https://claude.dev/blog/seeing-like-an-agent/)（Thariq Shihipar，4-10，旧工具撤回与新增澄清工具）、[Introducing eve](https://vercel.com/blog/introducing-eve)（6-17）、[mods教程](https://claude.dev/blog/getting-started-with-claude-code-mods/)（Addy Osmani，10-01）、Laminar总述、[Runme README](https://github.com/runmedev/web)、[WebMCP explainer](https://github.com/webmachinelearning/webmcp)。后二者只核实现／设计范围，未复制代码；4月文章只作历史演化，其余不新增推荐。[一手／研究]

主执行者并行于12:48 UTC直读OpenAI部署相关全文，冻结后12:53直读OCA完整可见正文及Laminar三页；后者两深页链接取自原站。项目补入不回填本研究线F／FD或冻结发现数。已知审计背景，非盲测；无独立遗漏分母，不报零遗漏或方法净收益。三页只计一个P55项目。[研究：计数边界]

## P44：独立记忆层的两类coding比较

**当前唯一最佳未知；保原生起点，同时追状态对齐的质量上限。** 核实2026-10-21（UTC+8），沿[C06](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c06--上下文工程)与[C15](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#c15--agent-评估)卡。前沿候选为Fan等／中科院与Alibaba的VibeMemBench（9-20 v1）和Xu等／SJTU、Theseus、MemTensor的MemTrace（10-10 v3）。主流参照是原生文件、摘要与搜索，不声称采用率；当前代码＋短恢复包是可行默认，尚无同口径的当前原生客户端最优证明。[研究]

**先分信息价值与自动供给。** [VibeMemBench v1](https://arxiv.org/html/2609.23570v1)用111目标、90仓、每条件4seed；reference先保留历史注入有益的目标，再冻结经验跨模型。直接经验的5组正向／持平比较的95%置信区间均跨零；4记忆系统×3solver有11组不超off，不能把reference筛选优势算留出收益。主对照在运行前注入top-1，非在线连续修改；附录单组Mem0×deepseek-v4-pro的k=1–5仍未超off。solver token不含记忆侧总费用。该协议确认“找得到历史”还不足采用，不证明所有服务无效。[论文报告；研究]

**同任务恢复有正证，也有投入代价。** [MemTrace v3](https://arxiv.org/html/2610.04838v3)固定deepseek-v4-flash-0731-high，比较Native、masking及仅Python的RepoGraph。以下均为Native→MemTrace：Codex CLI0.144.4下，DeepSWE成功40→64/113，均时42.02→54.17分钟；SWE-EVO22→32/46，30→82.05分钟。相反，mini-swe-agent下两集均时分别103.77→75.30、170.97→114.03分钟，不能概括为所有harness都更慢。其组合绑定执行关系、仓库状态及有效性检查，不能归因存储一项，也不外推GPT／Sonnet。主结果重复试验／效果置信区间与完整费用未取得；Trace Store消融还排除1个missing结果。SWE-Milestone的98阶段只来自7条连续路线，不是98个独立项目。[论文报告；研究]

### 公开可得，不等于论文全部复现齐全

- Vibe[固定源码7152cf9](https://github.com/AlibabaResearch/DAMO-ConvAI/tree/7152cf96809b45343ccc1caf7115a7d3fa43f956/VibeMemBench)有评估骨架，但memory_systems只有demo与初始化文件，未见四被测服务适配器及全部逐run账目。[HF固定revision](https://huggingface.co/datasets/Tongyi-ConvAI/VibeMemBench/tree/11164976b4f920cdb0d0cd570ca572e49acea1e8)元信息确认公开、未设gate，列3634个轨迹文件名和test.parquet，纠正README陈旧coming-soon徽章；本轮未下载或检查数据内容，复用仍逐任务核上游许可。[一手：公开树／元信息]
- MemTrace[固定5508f8b](https://github.com/theseus-labs-rsi/MemTrace/tree/5508f8be81025d8aa90726b1e06aef4ea484e577)把发布面限定DeepSWE；另两benchmark的兼容代码不是完整复现承诺。[release gate](https://github.com/theseus-labs-rsi/MemTrace/blob/5508f8be81025d8aa90726b1e06aef4ea484e577/results/manifests/release-gate.json)有91项离线自报，6项真实smoke因该发布环境缺凭据而BLOCKED。它限制公开包验证，不反推作者论文未跑；未见全部campaign回执。README profile的200turn／14400秒与论文无显式step限也须另对齐，不能直接照命令声称复现论文。[一手：发布包；研究]

### 采用与撤回

主建议唯一归[03](../03-context-engineering.md#46-独立记忆层先验信息价值再验自动供给)。先用有来源、不含目标答案的相关经验对照实际代码结果；有帮助后，再核自动提取／更新／检索是否保住帮助及全部投入。不是要求预知答案，也不把特选有益经验当现成产品。恢复证据要核测试及依赖版本，历史在后不等于自动取代旧结论。[研究：采用]

本轮比较对象不同，不做服务榜单；未安装、运行模型／服务或下载轨迹。两论文都不是最新原生GPT／Claude配短恢复包的直接胜负证明，独立长期保留／撤回与人工总投入仍缺。P44本仓完整端到端验收未完成，03整体最优仍未知。[研究]

六文件资料独审通过；修正两harness耗时方向、Native基线、top-1与剂量附录范围，并拆短正文。报告标识`coding-memory-independent-review-20261021`，SHA256 `c51ff523cd520acaace8c12c09c74b5f5669dec78b44aa87cd1aa9b391952fdc`；最终树离线另验，非模型／服务实测。[研究]

## 源码检索：map、语义引用与当前状态
> 核实时间：2026-10-13（UTC+8）。只读固定源码、测试和原帖，未运行 Aider、clangd、测试或模型。**[一手：固定源码与测试；社区：失败报告；研究：采用判断]**

### 源码检索：map、语义引用与当前状态 · 1. 最具体的新反例：文件已经保存，map 仍可按设计返回旧内容

Aider API 当时 main 固定为 `5dc9490bb35f9729ef2c95d00a19ccd30c26339c`（2026-05-22）：

- [get_ranked_tags_map，L585–625](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/repomap.py#L585-L625)：map 缓存键含文件集合、预算，auto 另含提及的文件／标识符，不含内容或 mtime。此前生成耗时大于 1 秒时，auto 可命中 map_cache，跳过下层按 mtime 更新 tags。
- [test_repo_map_refresh_auto，L106–158](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/tests/basic/test_repomap.py#L106-L158)：官方测试先让生成耗时 1.1 秒，向磁盘文件追加 functionNEW，随后断言普通获取与旧 map 相等；force_refresh 后才断言出现新函数。files 模式测试也断言内容变更而文件集合不变时 map 不变（L49–100）。
- [cmd_map_refresh，L1426 起](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/commands.py#L1426-L1431) 已调用 force_refresh=True，不需另建索引系统。

**改变选择**：外部工具改过源码而 map 缺新符号时，先刷新或读／搜当前文件；不以增大 map 预算作为旧快照的修复方案。调用者可能主动强刷，方法测试不能代表所有交互轮次。**[一手：固定源码／测试；经验：建议]**

### 源码检索：map、语义引用与当前状态 · 2. repo map 给的是启发式入口，不能据此认定跨模块调用者

[同一 SHA 的 repomap.py L451–514](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/repomap.py#L451-L514) 用 tag.name 聚合 definitions/references，并对同名 referencer × definer 连边；同名定义超过五个会降权，并没有借此变成类型／作用域解析。

真实失败原帖 [Aider #2341](https://github.com/Aider-AI/aider/issues/2341)：jbellis 在编辑 Cassandra 时报告 getName 同名碰撞令不相关 FilterPipelineTask 定义排前。当前源码仍是名称图，但已有降权启发式；本轮未复现 2024 年排名失败在当前版的表现，issue 关闭且标 stale 也不证明已修复。**[社区：原帖；一手：当前机制]**

**改变选择**：map 只作定位入口；先核导入、调用关系与已有检查，仍无法确认引用身份时，再试能解析该项目的语言服务器／类型系统，不以扩大排名上下文代替消歧。采用条件见[同名重命名](#同名重命名新增lsp还是沿用原生搜索)。

### 源码检索：map、语义引用与当前状态 · 3. LSP 能区分语义身份，但它返回的是特定状态下的结果

[clangd 官方索引设计](https://clangd.llvm.org/design/indexing)：引用按 SymbolID 查询；动态 FileIndex 覆盖正在编辑的文件；后台索引依赖编译数据库，逐源文件排队构建。这是语义身份的增量，不保证结果完整。

LLVM 当时 main 固定为 `f1136210323eb4cf169ea544c48fa650275a8c79`（2026-10-13）：

- [Merge.cpp L125–155](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/index/Merge.cpp#L125-L155) 对动态层已覆盖的文件丢弃静态层引用；[IndexTests.cpp L448–515](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/unittests/IndexTests.cpp#L448-L515) 专门构造旧引用，断言动态版本优先、动态删除后旧引用不复活。不能声称 clangd 普遍“没有更新机制”。
- 但 [clangd #2548](https://github.com/clangd/clangd/issues/2548) 的 Chromium 用户报告：插入空行、保存并等索引后，旧位置仍和新位置一起出现，重启才消失。报告版本为 Windows clangd 22.0.0git，配置先跳过后台索引再选择部分目录构建；作者随后明确最小项目无法复现；截至本次可见页面仍 open。它只提示真实异常，未确定当前 SHA 的根因或修复。**[社区：原帖，未复现]**

**改变选择**：位置明显对不上当前文本，先读目标位置、核查日志／编译范围／刷新，不继续沿旧引用自动修改；反过来，文本同名命中也不是语义引用确认。

### 源码检索：map、语义引用与当前状态 · 4. 未保存缓冲不是“LSP 一定比磁盘更新”的简单关系

当前 clangd [ClangdServer.h L188–189](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.h#L188-L189) 中 UseDirtyHeaders 默认 false；[L483–485](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.h#L483-L485) 用该选项选择 DirtyFS 或底层 TFS。[ClangdServer.cpp L304–313](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.cpp#L304-L313) 则明确：当前文件使用客户端 Contents，头文件通过 getHeaderFS 读取。[CLI L508–512](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/tool/ClangdMain.cpp#L508-L512) 对应隐藏选项 use-dirty-headers。

**具体边界**：头文件里未保存的新声明，在另一个翻译单元解析时默认不一定可见；同时磁盘 grep 也看不见该未保存声明。任务若针对编辑器当前状态，应读取对应 buffer 或在用户认可的保存状态上核验，而不是在 LSP 和磁盘搜索之间盲目切换。若目标是磁盘提交版本，也不能把 buffer 引用结果直接套用到磁盘行号。**[一手：源码；经验：推导]**

### 源码检索：map、语义引用与当前状态 · 5. 字符串／动态关系：文本搜索补入口，也不是完整证明

Aider 自身就有具体例子：[commands.py L276–296](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/commands.py#L276-L296) 枚举 cmd_ 方法并将命令名替换连字符后拼成 cmd_{name}，通过 getattr 分派。[Python 官方 getattr](https://docs.python.org/3/library/functions.html#getattr) 解释按字符串取属性的运行语义。

针对命令重命名，不仅查某个 cmd_* 方法的普通调用引用，还要读该分派规则、搜索用户输入的命令字符串及文档／测试。若字符串运行时拼接，搜完整方法名也可能只看到定义；应沿构造／注册处追踪。不能写“所有 LSP 都漏所有字符串引用”，有些语言服务器可解析字面量访问；本轮未实跑任一 Python LSP，所以只断言存在动态分派契约，不能断言特定 LSP 的返回集。**[一手：源码／官方文档；经验：建议]**

### 源码检索：map、语义引用与当前状态 · 6. 客户端接入边界

补核：2026-10-13（UTC）。[Claude Code 官方 Code intelligence](https://code.claude.com/docs/en/plugins/code-intelligence) 将插件配置与服务器二进制分开：用户另行准备二进制，安装插件后验证实际诊断或查询。页面明确官方云会话不启动插件语言服务器；[Tools reference 的 LSP 行为](https://code.claude.com/docs/en/tools-reference#lsp-tool-behavior)也确认云会话不激活该工具。此处的云会话指 Claude Code 产品的 cloud sessions，不能外推为所有云机器上运行的 CLI。**[一手：官方文档]**

**改变选择**：撤回 05 的“强类型项目必装”及 Claude 起步配置中的无条件安装。日常修错先复用已有类型检查；确有语义引用或编辑后诊断缺口时，再核对当前会话、服务器启动及项目解析。Claude 的导航工具只读，不因后端是 LSP 就假定该入口能执行重命名。安装后仍不可用时先区分会话不支持与服务器／项目配置问题，不反复增装插件。**[一手：官方工具边界；经验：采用判断]**

### 复杂类型诊断：原始信息也可能省略约束关系

> 补核：2026-10-19（UTC+8）。历史人工研究与公开数据算术复核；未执行 Argus、Rust、上游实验或模型。

**先分清宿主少显示了什么，与编译器原始诊断没有解释什么。** 完整取得报错仍无法理解复杂 Rust trait 错误时，继续查对应定义与推断分支；[Argus 论文](https://arxiv.org/html/2504.18704v1#S5)用可交互约束树展示失败关系，支持把窄诊断能力作为候选，而非只增加同一报错的篇幅。定位了原因，仍须另验修复是否正确。**[研究：机制与选择范围]**

论文在 2024 年 9–10 月开展人工研究：25 人各做 7 类题中的 4 题，先安装培训，可用 AI 等调试资源。按固定 [公开数据及分析程序](https://github.com/gavinleroy/pldi25-artifact/blob/9618278ebb79abcc0f0f4ebbf645b01fcb185f7a/evaluation/notebook.jl)复算，Argus／对照各 50 题次，定位 42／19，修复 25／16；这两个总体指标按程序口径并不嵌套，不能据此算“定位后修复率”。研究者选题、受试选择及小程序范围限制外推；论文也记录信息过载。结果支持历史条件下的诊断价值，不提供当前 Agent 或生产总投入的优势证明。**[研究：作者实验及本仓数据复算，非实验复现]**

**本轮只留研究候选。** [rustc JSON](https://doc.rust-lang.org/rustc/json.html#diagnostics)已有子诊断、位置与建议；[rust-analyzer 2026-05-04 更新](https://rust-analyzer.github.io/thisweek/2026/05/04/changelog-326.html)又加入原生 trait 诊断，历史对照不能代表当前能力。Argus [#77](https://github.com/cognitive-engineering-lab/argus/issues/77)只报告查找 `Cargo.toml` 时 panic，不能泛化为所有 workspace 失败。当前原生是否仍缺关键关系、Argus 的兼容运行与接入成本尚未闭合；取得这些证据再决定是否试用交互约束树，不据本文推荐安装。**[一手：官方契约；社区：问题报告；研究：采用边界]**

### 源码检索：map、语义引用与当前状态 · 范围与后续价值

两个原始失败报告、固定源码与测试定义支持撤回无条件替代建议。后续应在跨模块修改中区分动态使用、旧状态与配置范围。本轮未安装或执行第三方代码、客户端，未模型付费；端到端表现、模型正确性、上下文成本与人的总投入均未验证。

## 文档检索：版本选择与生成内容刷新
> 核实时间：2026-10-13（UTC+8）。本次只读公开源码、测试及原帖，未运行客户端、真实查询或模型。**[一手：固定源码与测试；社区：原帖；经验：采用判断]**

**🧪 维持按需试用。** 缺少实际版本时，不把近邻版本当成已核实兼容；回目标版本官方文档或源码确认关键行为。返回片段还须分清真实项目原文与生成摘要，普通刷新不能自动证明所有内容层都已重建。

### 文档检索：版本选择与生成内容刷新 · 固定研究对象

GitHub API 在本轮返回 master 为 [`33414e6e3fc157c936348ca8ddba25e50dacaeee`](https://github.com/upstash/context7/commit/33414e6e3fc157c936348ca8ddba25e50dacaeee)，提交时间 2026-10-12 21:51:03（UTC+8）。该提交的 package.json 分别标记 [MCP 4.3.0](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/package.json)、[ctx7 CLI 0.6.0](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/package.json)。这是固定主分支快照的包版本，不声称 npm 发布物逐字相同。**[一手：固定源码]**

### 文档检索：版本选择与生成内容刷新 · 从输入到返回的实际边界

1. **resolve 不解析项目依赖。** [MCP 工具 schema/说明](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/index.ts#L220-L287) 接收 `libraryName` 和用于相关性排序的 `query`，提示 Agent 从 Versions 中选择 `/org/project/version`。查询链不读 lockfile、项目版本或比较 semver；自然语言 query 中的版本只是检索信息，不是约束字段。**[一手：源码；推断限于所读公开查询链]**

2. **query-docs 的版本选择在 libraryId 字符串中。** [ContextRequest](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/lib/types.ts) 只有 `query`、`libraryId`、可选 `language`；[API 实现 L185–225](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/lib/api.ts#L185-L225) 把它们发给 `/v2/context`，不核实 ID 所指版本等于项目版本。`language` 是例子排序提示，不是版本选择器。**[一手：源码]**

3. **Skill 的宽松退路正是项目级使用需要覆盖的地方。** [find-docs L51、L90–104](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/skills/find-docs/SKILL.md#L90-L104) 要求查 ID，并建议选择用户所需版本的 closest match；3 次查询仍不满足则用手头 best result。其配额错误段要求披露失败后可用训练知识作答。这是 Agent 指令；客户端没有最近 semver 选择算法或兼容验证。**[一手：Skill/源码；经验：不接受其作为版本承诺]**

4. **客户端不会自动把缺失版本降级成最新版。** 所读 MCP 实现遇非 2xx 返回 error，空字符串返回 not_found，非空文本返回 success；没有去掉版本段重试的代码。MCP 工具层只在 `outcome === "error"` 时设置 `isError: true`，not_found 不属于协议错误，所以 `isError=false` 不表示找到有效文档，更不表示版本正确。[工具返回](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/index.ts#L365-L390)。后端未开源，不能从这个结论外推后端永不重定向或回退。**[一手：公开客户端实现]**

5. **CLI 同样是传参/呈现层。** [docs.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/commands/docs.ts#L108-L187) 检查 ID 大体格式，经 `recoverLibraryId` 修正 Git Bash 路径，再传给 API。字符串响应直接打印；有 redirectUrl 的错误提示新 ID、设置失败退出码，没有自己重新查询该 ID。零片段只警告并返回，不能只用进程成功判断命中。[getLibraryContext](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/utils/api.ts) 也没有依赖版本验证。**[一手：源码]**

### 文档检索：版本选择与生成内容刷新 · 测试究竟证明什么

- [library-id.test.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/__tests__/library-id.test.ts) 明确测试 `/vercel/next.js/v15.1.8` 不被改写、Windows 路径恢复保留版本段，仅证明字符串保留的设计，未验证服务端索引存在或版本片段正确。**[一手：测试源码，未运行]**
- [MCP integration.test.ts L150–159、L520–551](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/test/integration.test.ts#L520-L551) 使用本地 stub API；断言转发 `/vercel/next.js` 和 query，并原样得到 `STUB_DOCS`，错误场景返回 `isError=true`。测试名含 end to end 不等于真实文档后端或特定版本正确性验证。**[一手：测试源码，未运行]**
- [find-docs-skill-alignment.test.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/__tests__/find-docs-skill-alignment.test.ts) 检查调用风格、库名与安装建议顺序；没有验证 closest match 的兼容性。**[一手：测试源码，未运行]**
- [SDK GetContextCommand](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/sdk/src/commands/get-context/index.ts) 及其 [测试](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/sdk/src/commands/get-context/index.test.ts) 将返回 code/info snippets 映射成文档，或原样返回文本；测试用 fixture。其公开片段类型没有强制 resolvedVersion 字段，不可据此宣称所有后端响应都没有版本信息。**[一手：源码/类型与测试，未运行]**

### 文档检索：版本选择与生成内容刷新 · 社区原帖：支持、反证与已解决状态

#### 文档检索：版本选择与生成内容刷新 · #3309：默认值实质不匹配，且刷新未覆盖生成内容

[原帖](https://github.com/upstash/context7/issues/3309) 由 react-broadcast-sync 维护者于 2026-10-03 提交：索引中的 `_autodocs/types.md` 片段仍说 telemetry 默认 true，而 2.0.0 起已 opt-in，默认关闭；多次 Refresh 后普通 README 已变，片段未变。**[社区：具体报告，未复现]**

[Context7 维护者 10月6日回复](https://github.com/upstash/context7/issues/3309#issuecomment-6012188572) 纠正了报告者的一点前提：那不是仓库中被删除的文件，而是 Context7 生成的文档页，生成于默认值变化前几分钟；这种页当时按月重建，因此普通 Refresh 没更新。回复说已从 main 重建，现已正确显示默认关闭，issue 当日以 completed 关闭。**[社区：维护者解释与处理结果]**

关键默认值须查目标版本源码；SOURCE 样式链接、刷新时间或固定版本 ID 均不足以排除生成文档风险。该已解决单例不代表所有文档按月刷新，也不代表当前仍返回错片段。**[经验：证据边界]**

#### 文档检索：版本选择与生成内容刷新 · #2772：Versions 列表与最新内容不能混为一谈

[原帖](https://github.com/upstash/context7/issues/2772) 2026-06-16 提供了 Agent 工具调用记录：把 `/ant-design/ant-design` 搜索结果中最高列出的 5.26.2 称为最新发布，报告者指出应是 6.4.4。**[社区：具体调用记录，未复现]**

[维护者回复](https://github.com/upstash/context7/issues/2772#issuecomment-4716597579) 说明当时无版本 ID 的索引已刷新、实际内容对应 6.4.4；Versions 提供的是额外旧标签，不一定枚举最新版本。issue 当日关闭。**因此这是 Agent 解释元数据错误的强例，不是证实 query-docs 返回旧片段的证据。** 回复里使用过 `@版本` 写法，当前固定 Skill/schema 采用 `/org/project/version`；不要把历史回复的语法当成当前推荐命令。**[社区：原帖及维护者反证；一手：当前 schema]**

#### 文档检索：版本选择与生成内容刷新 · #236：精确标签覆盖缺口，保留但不再重复扩写

既有正文已引用 [#236](https://github.com/upstash/context7/issues/236)，本轮读完回复补上结论：维护者在 [2025年5月确认标签尚未索引](https://github.com/upstash/context7/issues/236#issuecomment-2915567105)，并在 [6月20日说明可自行解析 tag/release](https://github.com/upstash/context7/issues/236#issuecomment-2991422342)，随后关闭。它支持“可拼出的版本 ID 不等于已有覆盖”，不能支持今天该标签仍缺失，也不值得另增正文。**[社区：历史单例]**

### 文档检索：版本选择与生成内容刷新 · 验证范围

本节证据限于固定查询链、测试定义与三帖回复，支持收紧采用条件；未运行目标库编译或复现当前后端响应，不能将历史问题泛化为全部内容不可靠。其余未执行范围见节首。

## 工具接口：先缩小原生查询，再判断是否补接口

> 核实：2026-10-14（UTC）。主线二；改变 04 §2 的通用成本排名与“CLI 必配 Skill”；新证据是公开历史运行数据的只读复算和作者给出的具体轨迹摘录，未安装、运行上游程序或调用模型。

### 固定来源与干预边界

- **O1**：[论文 v1](https://arxiv.org/html/2607.10569v1)，2026-07-12。比较 Claude Code / Sonnet 4.6 与 Codex CLI / GPT-5.5 的原生、受限 shell、单一 `execute_code` 工具面；不是保持原生工具不变、仅加一个 MCP 的实验。Codex 限制由提示词实施，不能视为权限隔离。[研究：作者历史实验]
- **O2**：[公开逐次 CSV](https://github.com/hyang0129/onlycodes/blob/7548222e5f33b4e760b3cbeb193e5403f8e2e6cc/paper/data/raw/all_results.csv)，固定仓库 SHA `7548222e5f33b4e760b3cbeb193e5403f8e2e6cc`，内容 blob `04d9e998cf695ff3e8e260b0a394d467e127bfa4`。本节只复算其中 Codex SWE-bench 的 100 题、每臂 3 次；这些行记录 `codex-cli 0.130.0`，不是当前客户端表现。[一手：公开数据]
- **O3**：[作者轨迹摘录](https://github.com/hyang0129/onlycodes/blob/7548222e5f33b4e760b3cbeb193e5403f8e2e6cc/paper/investigations/concrete_examples_h1_h2.md)，blob `04008109f5e056e11f5438296af8489c12f012b4`。本轮读到的是带命令的摘录，未取得并独立重放完整模型轨迹。[一手：作者摘录]
- **O4**：[统计脚本](https://github.com/hyang0129/onlycodes/blob/7548222e5f33b4e760b3cbeb193e5403f8e2e6cc/paper/data/scripts/paired_contrasts.py)先按任务跨 seed 求均值，排除 `env_fail`；本轮未执行该第三方脚本。论文成本作缓存调整，并非用户账单或额度；未显著发现通过率差异也不是等价检验。[一手：源码；研究：解释]

### 已复算：同目标的成本与等待并不一起改善

本轮用 Python 标准库读取 O2，逐臂确认 300 行、100 个任务、300 个不同 `(instance_id, seed)`；所选行没有 `env_fail`。三次运行均等权，因此累计成本比与先按任务求均值再比较的成本比相同。[研究：本轮数据复算]

| Codex SWE-bench 臂 | PASS / 运行 | `cost_usd` 合计 | `cost_usd_adjusted` 合计 | `wall_secs` 合计 |
|---|---:|---:|---:|---:|
| baseline | 139 / 300 | 200.762607 | 193.352943 | 35,908 |
| bash_only | 136 / 300 | 210.302009 | 202.696505 | 39,811 |
| onlycode | 140 / 300 | 164.927510 | 154.859030 | 36,489 |

只读算术：`154.859030 / 193.352943 - 1 = -19.91%`；`36489 / 35908 - 1 = +1.62%`。少工具的 `bash_only` 调整成本却比 baseline 高 4.83%。这确认此历史数据里的成本差，不能证明人的主动投入减少，也不能把累计任务用时当实际并行 campaign 的完成时间。[研究：本轮复算]

复算方式：从 O2 下载 CSV 到自己的工作目录后，执行以下标准库代码；不调用模型、不执行上游代码。没有拿到 CSV 时不要把这段说明当作已运行结果。

```bash
python3 - all_results.csv <<'PY'
import collections, csv, sys
rows = list(csv.DictReader(open(sys.argv[1], newline='')))
reference_keys = None
for arm in ('baseline', 'bash_only', 'onlycode'):
  r = [x for x in rows if x['benchmark'] == 'swebench'
       and x['agent'] == 'codex' and x['arm'] == arm]
  assert len(r) == 300 and not any(x['verdict'] == 'env_fail' for x in r)
  counts = collections.Counter(x['instance_id'] for x in r)
  assert len(counts) == 100 and set(counts.values()) == {3}
  keys = {(x['instance_id'], x['seed']) for x in r}
  assert len(keys) == 300
  if reference_keys is None:
    reference_keys = keys
  assert keys == reference_keys
  print(arm, sum(x['verdict'] == 'PASS' for x in r),
        *(round(sum(float(x[k]) for x in r), 6)
          for k in ('cost_usd', 'cost_usd_adjusted', 'wall_secs')))
PY
```

**缺失值与统计口径**：Claude `onlycode` 的 300 行中只有 299 个数值成本（`sphinx-doc__sphinx-9229` seed 2 缺失）；按 O4 先对每题的可用 seed 求均值、再平均任务，得到 0.58603623525，与 `paired_contrasts.csv` 一致；直接平均 299 行得到 0.5686354765886288。差异来自权重与缺失值处理，不能据此判断数据过期。上表 Codex 每题均有三次完整记录；本轮只复算该子集，不声称重现整篇统计推断或重新运行模型。[研究：本轮独立复算]

### 具体任务给出的更窄选择

O3 的 `django__django-11848` seed 1，两臂均 PASS。原生调用把符号与年份等多个词 OR 到一次 `rg` 中，命中无关 fixture 数据后截断；代码接口臂只搜 `parse_http_date`。O2 对应记录的输入 token 为 454,946 对 108,245，等待 78 对 50 秒。这是一个具体有利结果，但查询内容同时变化；原生 shell 本来也能只搜符号，不能据此证明必须增加代码接口。[一手：O2/O3；研究：因果边界]

Sphinx 摘录中三次原生读取与一次脚本读取也不是逐字相同的查询：文件范围与符号定位不同。它展示可组合方式，不能隔离“少两次工具调用”的独立效果。作者选择这些案例来解释总体差异，并非随机抽取的全部任务。[一手：O3；研究：解释]

**采用判断**：这些混杂因素支持先改查询、再比较接口，而非按协议排名；采用与撤回条件统一见 [04 §2](../04-mcp.md#2-mcp-vs-cli按任务与调用路径选择)，成本结论不放宽权限或隔离。[经验]

**未采用的候选**：[WebDev-Skills-Bench](https://arxiv.org/html/2608.23067v1)的按钮命名重试与空元素可见性案例能提出假设，但主要对应测试定位器；其每次强制注入、近似等字节的无关 Skill 对照也不等于原生按需加载。匿名工件页本轮未取得文件，故不以该例推出当前 Skill 的净收益或建议改变产品文案。[研究：论文阅读边界]


## 工具输出：显示裁剪与采集丢失

> 核实时间：2026-10-14（UTC）。证据为官方固定修复、回归源码与自写 Python 标准库演示；未运行上游 Rust 测试、Codex 客户端或模型，结论限于所读历史源码。**[一手；经验：局部演示]**

**改变 04 的建议**：定位符号时，原生查询缩小范围通常已足够；需要判断全部记录或验收结果时，则在命令执行侧保存完整报告、保留原退出码，再用原生解析器提取字段。返回给模型的首尾不是完整报告，提高显示预算不能恢复采集阶段已丢内容。若没有完整报告且重跑会重复写入、发布或扣费，先查任务的权威状态和已有产物，不为补日志自动重跑；不因此推荐额外 Skill 或 MCP。**[研究：采用判断]**

### 固定来源与修复范围

- **已合并的 unified exec 修复**：[PR #32150](https://github.com/openai/codex/pull/32150) 于 2026-07-10 合并，固定 SHA `6138909d6ec58b2fbe635ef973e02caecad5a5aa`。它将多次 drain 的收集器改为有界 head/tail 缓冲，并传递遗漏数量；修的是无界累积及遗漏信息丢失，不是让所有输出无损。修复没有给 legacy shell 同步更换采集器。**[一手：补丁]**
- [buffer 回归 L47–63](https://github.com/openai/codex/blob/6138909d6ec58b2fbe635ef973e02caecad5a5aa/codex-rs/core/src/unified_exec/head_tail_buffer_tests.rs#L47-L63)断言 12 字节仅保留 10 字节，drain 后仍有 `omitted=2`、`total=12`；[collector 回归 L238–324](https://github.com/openai/codex/blob/6138909d6ec58b2fbe635ef973e02caecad5a5aa/codex-rs/core/src/unified_exec/process_manager_tests.rs#L238-L324)覆盖反复 drain 仍有界、已有遗漏元数据不丢。这些是回归定义，未执行。**[一手：测试源码]**
- [输出回归 L2883–2981](https://github.com/openai/codex/blob/6138909d6ec58b2fbe635ef973e02caecad5a5aa/codex-rs/core/tests/suite/unified_exec.rs#L2883-L2981)使用 mock 模型响应及进程输出夹具，断言 `HEAD`、`TAIL`、遗漏标记和观察总大小；它明确含 Windows、无网络、沙箱跳过条件。未核实 CI 结果，合并不证明各平台通过。**[一手：测试源码；研究：证据边界]**
- **另一条历史 legacy shell 路径**：固定 SHA `a6645b6b8a656360fa16fb7e1c6721d0697d3d6a` 的 [append_capped L835–843](https://github.com/openai/codex/blob/a6645b6b8a656360fa16fb7e1c6721d0697d3d6a/codex-rs/core/src/exec.rs#L835-L843)只留前缀；[read_output L1141–1153](https://github.com/openai/codex/blob/a6645b6b8a656360fa16fb7e1c6721d0697d3d6a/codex-rs/core/src/exec.rs#L1141-L1153)继续读到 EOF，但不把超出上限的字节加进返回缓冲；[formatter L77–101](https://github.com/openai/codex/blob/a6645b6b8a656360fa16fb7e1c6721d0697d3d6a/codex-rs/core/src/tools/mod.rs#L77-L101)再裁剪已采集内容。因此该路径的显示尾部可能只是采集前缀的末尾，而非进程真实 EOF。未核实十月发行版或当前会话是否仍有此缺陷。**[一手：固定源码；研究：机制推论]**

### 标准库最小演示与反证

以下自写演示在本轮离线执行通过，只模拟两种采集方式的信息边界，不执行上游程序，也不模拟模型决策。`cap` 是演示参数，不是当前客户端能力探针。**[经验：局部演示]**

```python
cap = 1024 * 1024
prefix = b'x' * cap
streams = [prefix + b'\nFINAL=PASS\n', prefix + b'\nFINAL=FAIL\n']
def headtail(data):
  return data if len(data) <= cap else data[:cap // 2] + data[-cap // 2:]
assert streams[0][:cap] == streams[1][:cap]                 # 不同终态，同一前缀
assert [headtail(x).splitlines()[-1] for x in streams] == [b'FINAL=PASS', b'FINAL=FAIL']
a = b'H' * cap + b'\nFAIL test_middle\n' + b'T' * cap
b = b'H' * cap + b'\nPASS test_middle\n' + b'T' * cap
assert headtail(a) == headtail(b) and b'FAIL' not in headtail(a)
assert b'FAIL' in a and b'FAIL' not in b                    # 全文才能区分
print('4 assertions passed')
```

输出：`4 assertions passed`。反证尤其重要：保住首尾也不保证中间没有失败；官方修复改善可观察性，不能替代完整报告中的业务判据。只有所需字段已经完整、可核对地返回时，才无需再读全文；本轮未测模型成功率、等待时间或额外工具净收益。**[经验：局部演示；研究：采用边界]**


## 设计上下文：结构输入与组件契约

> 核实：2026-10-15（UTC+8；读取发生于 10-14 UTC）。主线二；改变 04 原空白 Figma 推荐：从“设计稿转代码”改为按缺失信息试用，并给出退出条件。仅阅读公开文档、固定类型声明、问题及维护者回复；没有账户访问、插件安装、设计调用、模型对照或付费测试。**[一手／社区；经验：采用判断]**

### 设计输入改变哪项选择

截图能交代外观；现有组件示例／源码能交代实现契约，二者已够用时不新增连接。若尚缺布局结构、变量身份或组件对应关系，Figma 的结构输入才有增量；官方明确服务端提供上下文，最终代码与设计系统适配仍由 Agent 完成，而非自动交付成品。[MCP 与 Agent 分工](https://developers.figma.com/docs/figma-mcp-server/mcp-vs-agent/) **[一手；经验：基线选择]**

[Code Connect 集成](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/)区分 UI 与 CLI：UI 路径／名称关联不等于完整的属性映射；CLI 可提供人为定义的用法片段及属性对应。反复需要将设计的 Size／状态翻译为代码 props 时，维护显式映射比只给颜色和尺寸更直接，但并未证明模型净收益。组件 API 变化后须同步映射。**[一手；经验：选择]**

### 当前维护路径与可核查例子

- [Writing template files](https://developers.figma.com/docs/code-connect/template-files/)的示例显式把 Size 的 Small／Medium／Large 映射到 sm／md／lg，并单独读取 Disabled；这解决的是语义对应，而非截图相似度。嵌套子组件需要自己的关联；slot 的 connectedInstances 只含直接、已连接实例，不含普通文本／图层及更深层实例，不能把返回当完整子树。**[一手：文档示例]**
- [旧 React 指南](https://developers.figma.com/docs/code-connect/react/)已警告框架专用 parsers 不再更新／支持，template files 是当前维护路径。新建议不再复制旧 `.figma.tsx` 接入教程。**[一手：动态契约]**
- 固定仓库 `figma/code-connect` 于 `1f75978328b9c3609565f31c4bc7d5d353976f77`（提交时间 2026-10-14T18:12:35Z）；[cli/package.json](https://github.com/figma/code-connect/blob/1f75978328b9c3609565f31c4bc7d5d353976f77/cli/package.json)声明版本 2.0.2。[cli/figma-types.d.ts L36–38](https://github.com/figma/code-connect/blob/1f75978328b9c3609565f31c4bc7d5d353976f77/cli/figma-types.d.ts#L36-L38)也把 SlotResult.connectedInstances 标为 shallow；[L119–140](https://github.com/figma/code-connect/blob/1f75978328b9c3609565f31c4bc7d5d353976f77/cli/figma-types.d.ts#L119-L140)区分 slot、嵌套检索与模板返回。只核声明，不据此声称已执行服务端或验证全部运行语义；仓库版本也不是远端服务版本。**[一手：固定声明]**

### 独立维护反馈与反证

- [Carbon #17607](https://github.com/carbon-design-system/carbon/issues/17607)由该设计系统维护者记录实际接入差异：同一 Figma 菜单项依上下文对应两个 React 组件、单项与整组的 skeleton／props 层级不同。该 2024 年起的清单含划除的已修项，不能把整页当当前缺陷清单；它支持“映射需维护语义差异”，不支持整个产品无效。**[社区：独立项目原帖]**
- [Code Connect #397](https://github.com/figma/code-connect/issues/397)报告 1.4.4 的嵌套 variant 多余 imports。Figma 维护者 2026-06-02 建议改用 templates；06-04 确认模板与真实代码解耦，组件 prop 改名不会由模板类型检查捕获，并提及 preview。06-06 关闭不是 parser 缺陷已修证明。结论是模板可减少表达限制，却仍须按当前源码核查片段；不把 preview 当应用编译或交互通过。**[社区：用户报告；一手：维护者说明，未复现旧版]**
- [Code Connect #407](https://github.com/figma/code-connect/issues/407)，2026-08-17 用户报告空 map 可能来自库／设计文件范围混淆或大节点查询超时，而非确实没有映射；本次可见状态 open。仅作为单例提醒，未验证全部客户端。不要因空结果自动重造组件；先查范围与实际组件来源。**[社区：原帖，未复现]**

### 接入限制与撤回

1. [大 frame 官方说明](https://developers.figma.com/docs/figma-mcp-server/avoid-large-frames/)承认慢、错误及不完整返回；只取目标区域，不能靠扩大上下文保证完整。**[一手]**
2. [当前访问规则](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/)按 seat／plan 限流且限制支持的客户端；还要求对文件已有权限。此为服务契约，不代表任一读者账户已具备访问。为避免把易变配额写成承诺，实际选择前重查该页。**[一手]**
3. [Code Connect 当前 Help](https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect)列 Professional／Organization／Government／Enterprise、Full 或 Dev seat；Professional 限一个 active library 和 framework，停用的连接不会返回给 MCP。MCP 可用与 Code Connect 可用须分别判断，不能沿用旧的 Org／Enterprise-only 概括。**[一手：动态事实]**
4. [平台输出说明](https://developers.figma.com/docs/figma-mcp-server/server-returning-web-code/)指出类 React 输出是设计上下文，不代表项目必须改用 React；多框架关联时，桌面端取 Dev Mode 当前选择，远端的设计上下文请求需使用准确的映射 label。连接故障或错框架先查对应上下文，不添加另一套组件实现。**[一手；经验：排查选择]**

**保留／退出判断**：选一个已有组件的实际任务，确认连接是否补齐原先缺失的 token、结构或属性对应；若仍只返回通用布局、映射与当前 API 不符，或维护成本超过少做的查找，就缩减到少数常用组件或退出，回到当前源码／示例。运行后的视觉、键盘、状态与保存验收仍按 [23](../23-browser-verification.md)进行。以上是待实际任务检验的工程判断，没有声称更快、更准确或省 token；当前阶段不执行对照实验。**[经验：采用与撤回条件]**


## 导入纠错：先选已有规则能判断的对象

> 核实时间：2026-10-19（UTC+8）。补充 03 §4 将工程经验沉淀为 lint 的选择；只读官方契约与固定项目配置，未安装或运行 ESLint、解析器、VS Code、上游测试或模型。

**按约束对象复用，而不是一遇导入错误就自写规则。** [ESLint 10.8.0 的 `no-restricted-imports`](https://github.com/eslint/eslint/blob/749dfed106f44d77bf3af2402ebfae20cdbf59ee/docs/src/rules/no-restricted-imports.md)可按模块路径／模式、导入名限制静态导入，并给出项目替代入口的提示；对应再导出也可受限，动态 `import()` 不在此规则覆盖内。它判断源中的导入写法，不能把别名字符串命中当作解析后的文件身份。若问题只是“别直接用这个包，改用项目包装器”，先用已有配置即可。**[一手：规则契约；经验：采用判断]**

**目录依赖另核目标解析。** [eslint-plugin-import 2.32.0 的 `no-restricted-paths`](https://github.com/import-js/eslint-plugin-import/blob/01c9eb04331d2efa8d63f2d7f4bfec3bc44c94f3/docs/rules/no-restricted-paths.md)用 `target`／`from`、例外及消息描述依赖方向，判断导入解析后的文件位置。[固定实现](https://github.com/import-js/eslint-plugin-import/blob/01c9eb04331d2efa8d63f2d7f4bfec3bc44c94f3/src/rules/no-restricted-paths.js#L219-L244)在 `resolve` 未返回路径时直接返回，不报告该次受限路径违规。因此有别名、TypeScript 或不同解析配置时，先核实际解析与覆盖；不能由该规则没有诊断推定架构合规，也不能据此断言整个 lint 没有其他错误。**[一手：源码机制，未运行]**

**实际采用同时保留范围与例外。** VS Code 固定 [`d130167`](https://github.com/microsoft/vscode/blob/d130167196c2e38a00cb742b168de2bb4a751778/eslint.config.js#L1601-L1621)对 `src/**/*.ts` 的 `dompurify*` 静态导入配置 `warn` 并提示改用 `domSanitize`；[Copilot 源码／测试配置](https://github.com/microsoft/vscode/blob/d130167196c2e38a00cb742b168de2bb4a751778/eslint.config.js#L2666-L2760)另用 `import/no-restricted-paths` 区分 common、node、vscode、worker 等目录，同样为 `warn`，有忽略文件及 [chatLibMain 单文件关闭](https://github.com/microsoft/vscode/blob/d130167196c2e38a00cb742b168de2bb4a751778/eslint.config.js#L3056-L3063)。这证明固定项目配置采用，不证明所有导入受检、警告会阻止提交或 CI 实际执行通过。**[一手：配置，未运行]**

项目也保留[本地导入模式规则](https://github.com/microsoft/vscode/blob/d130167196c2e38a00cb742b168de2bb4a751778/.eslint-plugin-local/code-import-patterns.ts)，按目标文件与运行环境生成允许模式，并对相对路径作词法归一；其存在不证明现成插件必然不足，更不是完整 TypeScript 符号解析。先用能表达约束的现成规则；确有仓库专属判据再评估定制与维护。触发入口、等级和例外沿用项目验收；本例没有 Agent 遵循率、缺陷减少或维护工时数据，不作工具排名或净收益证明。**[一手：实现；经验：选择与证据边界]**

## 跨会话记忆：追加观察与事实失效

> 核实：2026-10-15（UTC+8；读取于 10-14 UTC）。主线二；将 04 的“方案太多、质量不一”改成具体采用／撤回条件。只读公开固定源码和文档，无安装、模型调用、服务端实验或私人记录访问。**[一手；经验：工程判断]**

### 基线与真正需要新增的能力

续接基线沿用 [20 §4](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)。已知位置的当前记录不需要新增检索服务；这里只比较跨任务事实检索、更新与撤销。**[经验：采用边界]**

### M1：官方 reference memory 是追加图，不是当前决定寄存器

固定 `modelcontextprotocol/servers` SHA `bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c`：

- [数据结构 L89–104](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L89-L104)只有实体 name／entityType／observations 与关系端点／类型；没有结构化来源、项目范围、有效期或替代版本字段。这些信息可手动编码，但 schema 不自动维护。**[一手：固定源码]**
- [创建与追加 L517–585](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L517-L585)：createEntities 以 name 跳过既有实体；addObservations 对现有字符串作 includes 去重后 push。具体反例是同一实体先存“使用 A”、后存“改用 B”：两条不同字符串均保留，不产生 supersedes 关系；以相同 name 为另一个项目创建对象也被跳过。这是源码推论，未测模型失败率。**[一手；研究：反例推导]**
- [删除 L587–646](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L587-L646)按完整 observation 字符串删除，删实体同时删相连关系；[查询 L655–684](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L655-L684)是 name／类型／观察的小写子串匹配，返回匹配实体，未筛选当前有效观察。不能把它描述为语义召回或自动清理矛盾事实。**[一手：固定源码]**
- 反证：[每次变更的锁及保存链](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L436-L529)有锁和临时文件替换，不能沿用旧版印象声称当前实现“完全没有并发／落盘保护”；存储保护仍不等于语义冲突裁决。**[一手；研究：限定]**

该实现存储实体／关系；当前决定、名称范围和来源仍须另行维护。**[经验：选择]**

### M2：Graphiti 增加时间与来源，但冲突和删除仍有契约边界

固定 `getzep/graphiti` SHA `5126eae0c7659ef521a043b04084506018c9cfcc`，与 M1 为不同作者／实现：

- [MCP 文档](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/mcp_server/README.md#available-tools)提供 group_id、episode 来源追溯、valid_at／invalid_at 筛选和 episode 删除；FalkorDB 按 group 分图，读取／删除需使用原 group。分组可用于范围区分，不能直接当成认证授权隔离保证。README 明标实验性，列出图数据库、LLM 和 embedding 提供方；这些运行与维护成本应纳入选择，不因本地部署就假定无需模型／索引资源。**[一手：文档]**
- [写入 L403–533](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/mcp_server/src/graphiti_mcp_server.py#L403-L533)将 add_memory 送队列，返回 queued；reference_time 表示事件发生时间，省略时用当前时间。排队成功不代表事实已提取或可检索；晚录入旧决定时须保留原发生时间，不以到达次序冒充事实新旧。**[一手；经验：采用判断]**
- [冲突解析 L940–1035](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/graphiti_core/utils/maintenance/edge_operations.py#L940-L1035)以完全相同端点和规范化事实文本作快速去重，否则向模型请求重复／矛盾候选；[时态处理 L715–783](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/graphiti_core/utils/maintenance/edge_operations.py#L715-L783)再按有效时间裁决失效。相较 M1，它支持事实演化，但结果仍依赖候选识别、实体解析与时间输入。**[一手；研究：机制边界]**
- **删除反例来自文档与实现差异**：[MCP delete_episode L729–755](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/mcp_server/src/graphiti_mcp_server.py#L729-L755)说明保留其他 episode 支持的事实，调用客户端 remove_episode；同一提交的 [core remove_episode L2164–2192](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/graphiti_core/graphiti.py#L2164-L2192)却以 edge.episodes[0] 等于被删 episode 作为删边条件，没有要求只剩一个 episode；去重路径会追加后续 episode UUID，因此删除第一来源时，即使仍有重复支持，该边也会被选中删除。节点另按提及次数判断，不能把节点条件套到边。此为同仓库静态契约差异；[MCP 依赖声明](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/mcp_server/pyproject.toml)使用 `graphiti-core[falkordb]>=0.30.2`，不固定为这份源码，实际行为须按安装依赖核验。未运行数据库，不能据此宣称生产故障已复现或推广到其他版本／托管服务。**[一手；研究：反例推导]**

因此，多来源撤销须核目标依赖版本的共享事实删除与衍生摘要语义；字段存在不证明所需语义成立。**[经验：选择]**

### 保留与撤回条件

采用与撤回统一见 [04 的记忆入口](../04-mcp.md#跨会话记忆先区分检索与当前状态)，生命周期见 [03 §4.4](../03-context-engineering.md#44-最小生命周期而不是无限追加)。本节仅建立静态机制差异，未比较模型完成率、长期召回、成本或当前服务端行为；授权与外部状态仍须查权威来源。**[经验／研究：范围]**


## 异步工具：任务终态与业务结果

> 核实：2026-10-15（UTC+8）。主线二；改变 04 的异步工具接入验收，20 的对账原则不重复扩写。只读固定公开源码、协议与测试定义，未安装 SDK、运行模型／服务或执行上游测试。**[一手；研究：范围]**

### 具体缺口与采用判断

`completed` 或 SDK 正常返回仍可包含工具错误；工具成功又可能仅代表入队。接入判断见 [04 异步工具](../04-mcp.md#异步工具完成的是哪一层)；以下固定版本区分这三层。**[研究：失败链推导]**

### 固定来源与实现链

| 来源 | 固定版本与观察 | 证明范围 |
|---|---|---|
| MCP Tasks 扩展 | [规范 2026-07-28](https://github.com/modelcontextprotocol/ext-tasks/blob/899c1bbc869567670093face3591b39c28ce3219/specification/2026-07-28/tasks.md#capability-negotiation)；`899c1bbc869567670093face3591b39c28ce3219` | 客户端在每次请求声明扩展能力；服务端决定返回直接结果或任务句柄，没有声明不能返回任务。并非所有 MCP 服务默认启用 |
| TypeScript 扩展客户端 | 同提交 [package.json](https://github.com/modelcontextprotocol/ext-tasks/blob/899c1bbc869567670093face3591b39c28ce3219/packages/ext-tasks/package.json) 声明 `@modelcontextprotocol/ext-tasks` 0.2.2；[api.ts L363–370](https://github.com/modelcontextprotocol/ext-tasks/blob/899c1bbc869567670093face3591b39c28ce3219/packages/ext-tasks/src/client/api.ts#L363-L370) | `resultFromTaskOutcome` 对 completed 原样返回 result；failed 抛 error，cancelled 抛取消错误。它不检查 result.isError |
| C# 新实现 | `00adf5489910388749686bee2a6a32ae1b149ba6`；[版本声明](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/src/Directory.Build.props)为 2.2.0；[后台包装 L245–307](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/src/ModelContextProtocol.Extensions.Tasks/Server/McpTasksBuilderExtensions.cs#L245-L307) | 普通结果序列化后 SetCompleted；非协议异常也可包装成 IsError=true 并 SetCompleted。版本号是所读源码声明，不是本地安装或发行验证 |
| C# 客户端 | 同提交 [轮询 L252–279](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/src/ModelContextProtocol.Extensions.Tasks/Client/McpTasksClientExtensions.cs#L252-L279) | CompletedTaskResult 反序列化成 CallToolResult 直接返回；failed／cancelled 另抛异常，因此只捕获异常仍会漏掉工具错误 |
| C# 官方回归定义 | 同提交 [McpTaskStoreTests L627–653](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/tests/ModelContextProtocol.Tests/Server/McpTaskStoreTests.cs#L627-L653) | `ToolReturnsCallToolResultWithIsError_AsTask_StoresAsCompleted_NotFailed` 同时断言 Completed 和结果 isError=true；这里阅读测试，未运行 |
| 旧版反例 | C# v1.4.1，`2b7fd35fbe58dfb9f00eae8b3393e1a7361b5e01`；[McpTaskStatus L60–68](https://github.com/modelcontextprotocol/csharp-sdk/blob/2b7fd35fbe58dfb9f00eae8b3393e1a7361b5e01/src/ModelContextProtocol.Core/Protocol/McpTaskStatus.cs#L60-L68) | 旧实验性 Tasks 将 isError=true 列入 Failed；这是版本化定义反例，不声称旧实现有缺陷或所有客户端已迁移 |

上述均为**[一手：固定规范／源码／测试定义]**。新版规范的 [Task Execution Errors](https://github.com/modelcontextprotocol/ext-tasks/blob/899c1bbc869567670093face3591b39c28ce3219/specification/2026-07-28/tasks.md#task-execution-errors)明确：JSON-RPC 错误用 failed，普通工具结果即使 isError=true 也用 completed。C# 的[迁移说明](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/docs/concepts/tasks/tasks.md)区分 v2 扩展与 v1.3／v1.4 实验协议；不能用旧版状态分支直接解释新版响应。

### 反例、选择与未证事项

- **不是 SDK 吞错。** SDK 按协议保留工具结果，宿主必须读它；将 completed 一律判成功才是本例的错误接法。正常直接返回也要检查同一工具结果，不能只修异步分支。**[研究：实现推论]**
- **不是工具无错误就证明外部任务完成。** 前文 Graphiti 固定实现的 add_memory 返回 queued，已说明工具可能只负责提交；即使外层没有 isError，事实提取和检索可见性仍是另一层。此处复用该例，新增证据仅为 Tasks 和 SDK 的终态解包路径。**[一手；研究：边界]**
- **回执缺少最终结果查询路径时，不能承诺无人值守完成。** 重试沿用 [20 对账原则](../20-codex-long-horizon.md#9-超时后动作究竟发生了吗)，工具错误本身不授权重试。**[经验]**
- 失败链来自固定代码推导，缺少 Agent 误报轨迹；SDK 净收益、服务持久性与业务幂等性均未验证。**[研究：验证范围]**

## 服务接入：工具面、凭证与外部内容

> 核实：2026-10-15（UTC+8；读取于 10-14 UTC）。主线二；04 撤回“小模型、浏览器、高风险环境就用 MCP”，改按已有能力、服务权限与退出条件选择。证据为官方权限契约、固定服务实现、已修安全公告与原研究；不重复前述成本、Figma、记忆和 Tasks。**[一手；经验：选择]**

### 接口与装配不是执行边界

- [MCP 2026-07-28 授权规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)适用于 HTTP；stdio SHOULD 从环境取凭证。CIMD 为 SHOULD，DCR 为保留兼容的 MAY；不能把“弃用”写成现有服务已停止支持。规范本身不保证凭证永不进入进程环境，也不提供 OS 沙箱。**[一手；研究：界定]**
- [同版 HTTP 规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http#server-validation)要求按方法携带 metadata headers，服务端校验 header／body 一致。04 撤回“只看 header 就能鉴权”的过强表述；请求字段不替代身份、权限和业务授权。**[一手；经验：选择]**
- [Claude 插件 manifest](https://code.claude.com/docs/en/plugins-reference#mcpservers)可同时包含 Skills、Hook、LSP 与 MCP 配置；MCP 配置可为本地文件、内联或 bundle。[MCP 文档](https://code.claude.com/docs/en/mcp#plugin-provided-mcp-servers)明确启用插件会启动其 MCP，工具与手工配置一起提供。[沙箱范围](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)明确本地 MCP、Hook、LSP 等不受 Bash 沙箱包裹。因此插件可减少装配工作，但没有第三种天然安全边界。这里是 Claude 的实际机制，不外推所有产品的插件格式。**[一手；研究：采用判断]**
- 同一 MCP 文档的 project scope 区分交互审批与 print／SDK／cloud 启动；后者不能弹提示。正文不再只给“共享 `.mcp.json` + npx 最新包”的安装例子，而让读者先核已有连接、实际组件、固定本地版本与启动审批。该文档描述当前产品，未实跑客户端；组织设置仍按其运行表面配置。**[一手；经验：采用判断]**

### G1：GitHub 的只读与 lockdown 不能替代凭证权限

固定 `github/github-mcp-server` 于 `c59e8c199efbf14467211861de44afaeeb6873e3`（本轮 GitHub commits API 返回的 main）：

- [filters.go L24–54](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/pkg/inventory/filters.go#L24-L54)先检查工具自身 Enabled，再按 readOnly／IsReadOnly 过滤，之后处理工具组与显式工具。它选择可用工具，不重签或缩小 GitHub token。[README](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/README.md#lockdown-mode)明确 lockdown 是 best-effort 内容过滤，私有仓库不受同样过滤；不改变底层凭证的读写权限，同一内容可能仍能经其他工具／API 获取。**[一手：固定实现与文档]**
- [remote-server.md](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/docs/remote-server.md)定义 `/readonly`、单工具组路径和 `X-MCP-Toolsets`／`X-MCP-Readonly`。这证明已有窄接口可复用，不需要为 PR 排障自建新服务器；本轮未登录托管端点，也未确认其部署 SHA。**[一手；经验：选择]**
- **实际故障与修复边界**：[官方 GHSA-pjp5-fpmr-3349](https://github.com/github/github-mcp-server/security/advisories/GHSA-pjp5-fpmr-3349)列受影响版本 `>=0.22.0, <1.1.2`、修复版 `1.1.2`。条件是 HTTP + lockdown，多用户请求曾复用首个用户的 GraphQL client，使内容信任判断跨身份混淆；不是单用户 stdio 的同等故障，也不是“读到了所有其他用户私有数据”的证明。**[一手：维护者安全公告，未复现]**
- **当前实现反证**：[dependencies.go L463–487](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/pkg/github/dependencies.go#L463-L487)按请求取客户端并带 identity，新建 RepoAccessCache；[lockdown.go L102–113](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/pkg/lockdown/lockdown.go#L102-L113)绑定传入客户端。[官方测试 L134–158](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/pkg/lockdown/lockdown_test.go#L134-L158)分别创建 attacker／victim 缓存并断言作者信任判断不同；另有 identity scoped keys 测试。这些未运行的回归定义与源码反驳了“当前仍使用该 singleton”。**[一手：固定源码／回归定义，未运行]**

**选择**：已有 `gh` 足够时不加层；确需受限远程工具时，按任务选工具面，按目标仓库限底层凭证，按输入来源处理内容。自托管多人 HTTP + lockdown 的旧部署须先升级到至少公告修复版；版本门槛只针对该已知漏洞，不保证所有安全问题消失，也不要求已修部署重新搭建。**[经验：采用边界]**

### D1：Supabase 的项目、查询与用户身份是不同范围

[当前官方 MCP 指南](https://supabase.com/docs/guides/ai-tools/mcp#configuration-options)给出 `project_ref`、`read_only=true`、`features`；安全部分明确开发者 MCP 按开发者权限运行，不应直接交给应用终端用户。生产证据确有必要才访问生产项目；只读不会把敏感列自动变成非敏感数据。此为供应方契约，不是本仓库对实际账户权限的认证。**[一手；研究：范围]**

固定 `supabase/mcp` 于 `f46b3d2996d93baad25cce1b94b46440dcc44ecb`：

- [server.ts L251–275](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/server.ts#L251-L275)在指定 projectId 时不装配 account tools，并把 projectId／readOnly 传给数据库工具；[L346–351](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/server.ts#L346-L351)在只读模式隐藏写工具。**[一手：固定源码]**
- [database-operation-tools.ts L461–476](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/tools/database-operation-tools.ts#L461-L476)明确阻止只读模式 apply_migration；[L626–635](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/tools/database-operation-tools.ts#L626-L635)把 read_only 送入 executeSql 并包裹不可信结果；[api-platform.ts L204–222](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/platform/api-platform.ts#L204-L222)调用 Management API 的 `/v1/projects/{ref}/database/query`，不是以客户 JWT 调应用查询接口。不能据此笼统声称所有 MCP 都绕过 RLS；它只支持不要把这个开发者入口当终端用户隔离。**[一手；研究：机制边界]**
- [server.database.test.ts L73–123](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/server.database.test.ts#L73-L123)定义只读查询通过与写入错误断言；[L696–718](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/server.database.test.ts#L696-L718)断言迁移错误。本轮只读测试，未执行数据库或确认远端角色／RLS 实际状态。**[一手：回归定义，未运行]**

**选择**：查线上问题只开放目标项目的必要读操作；改 schema 继续用开发环境和现有迁移链；给客户查其订单则继续用应用已验证的逐用户授权接口。三种任务不因同属“数据库”而共享开发者权限。若项目只需生成类型或查 schema，避免额外拉取整表业务数据。**[经验：采用判断]**

### S1：agentjacking 原研究证明哪条失败链

直接读取 [Tenet 原文](https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/)（页面更新 2026-06-17），替换此前只有 CSA 二手转述的依据。研究者报告经公开 DSN 注入伪造错误，Agent 经 Sentry MCP 读取后执行验证包；文中把它称为受控真实环境验证，并给脱敏捕获。该报告的成功率与组织数未由本仓库复算；不能写成当前所有客户端必然中招、所有沙箱无效或已确认恶意攻击规模。**[一手：原研究作者报告，非独立复现]**

此例说明可信服务可返回外部作者指令，读取后仍有执行边界。对于日志／工单中推荐的修复包，先回源码与官方来源核查，再依据用户批准执行；CLI 读取同样内容也不自动免疫。没有必要因这一受控研究一律停用观测工具，也不能只加一句提示词就承诺自动修复安全。**[经验：选择与反证]**

### 验证范围与收敛

本节只读公开文档、固定源码／测试与安全报告，未安装软件、执行服务／利用代码、访问私人账户或调用付费模型；没有模型质量、成本或防御成功率数据。删去规模、口碑与无条件安装例子后，接入判断以任务、权限和输入来源为准。

## 接入验收：nullable与optional分开核对

**改变选择：裸 stdio 读成功后，还要在目标客户端验最小参数调用；客户端报缺键时先核发布的 schema，不急着换协议或放宽全部校验。** `null` 是一个值，省略是没有这个键；MCP 的 `inputSchema` 用 JSON Schema 定义工具参数，而 `required` 要求列出的键实际存在。可空字段可以同时是必填字段；只有服务端本来允许省略、schema 却要求带键时，才是这里的契约不一致。

### 真实故障、修复与保留的约束

- **修前用户报告**：anymd #881（2026-10-09）给出 8.5.1、Linux 与 OpenCode 的复现。`read.required` 误含 `transcript`、`download_asr_model`、`images`、`revisions`，`search.required` 误含 `case_sensitive`、`whole_word`。OpenCode 省略时报缺键；显式传入这些 nullable 字段成功，裸 stdio 的 `read` 只传 `source` 也返回 Markdown。这个对照把“直调能读”与“目标客户端接受最小调用”分开了。
- **生成源**：固定 `71fb95b521588241af5a23fa2de701207ac93430` 的 `schema.rs` 说明 `schema_with` 覆盖了 schemars 对 `Option` 的识别；修复在这些字段上显式加 `#[serde(default)]`，让生成的省略规则与解码一致，仍保留 nullable 类型与枚举。
- **回归定义**：同提交 `lib.rs` 的 omission 测试检查四个公开工具的 `required`，并把逐字段省略后的键检查与实际参数解码对照：`read`／`outline` 只要求 `source`，`search` 只要求 `query`，`inspect` 仍要求 `operation` 和 `sources`。另一测试保留类型、枚举、`source`／`query` 最小长度、token／结果数／scale 边界；这不是把 schema 清空来求兼容。
- **发布与验证范围**：8.5.3 发布说明确认修复，issue 中的修后测试通过是维护者自报；未见外部用户修后客户端回执。本次读取原帖、固定源码与测试定义，未安装 anymd／OpenCode、未运行上游测试或客户端。

**采用与撤回**：现有用户按当前安全公告选版本，除 schema 修复外还须包含 8.5.5 的后续安全修复，目标客户端重新发现工具后，用同一低风险输入验省略调用与结果；需要定位时再对照语义允许的显式 `null`。自建工具则修生成源，并保留真正必填字段与值约束的回归。未通过目标客户端验收前继续用可靠的 CLI／资料入口，不把裸调用成功当成连接已可替代原入口。

**依据**：[一手] [MCP 2026-07-28 Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools#tool)、[JSON Schema 2020-12 §6.5.3 required](https://json-schema.org/draft/2020-12/json-schema-validation#section-6.5.3)、[null 与缺键的区别](https://json-schema.org/understanding-json-schema/reference/object#required-properties)；[社区：用户修前报告／维护者修后自报] [anymd #881](https://github.com/SylphxAI/anymd/issues/881)；[一手：固定源码／测试定义] [schema.rs 生成约定](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/schema.rs#L12-L37)、[ReadArgs](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/schema.rs#L642-L665)、[SearchArgs](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/schema.rs#L718-L723)、[omission／解码回归](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/lib.rs#L824-L878)、[约束保真回归](https://github.com/SylphxAI/anymd/blob/71fb95b521588241af5a23fa2de701207ac93430/crates/anymd/src/lib.rs#L880-L931)、[8.5.3 发布](https://github.com/SylphxAI/anymd/releases/tag/v8.5.3)、[后续安全公告](https://github.com/SylphxAI/anymd/security/advisories/GHSA-xrc8-gj3q-m8vm)；核实 2026-10-26。

## 共享指令：发现、导入与加载证据

> 核实：2026-10-15（UTC+8，对应 10-14 UTC）。只读官方动态文档与固定发布记录；未启动 Claude Code／Codex、未修改真实配置、未执行模型或加载实验。**[一手：文档与发布记录；研究：采用判断]**

### 共享指令：改变的选择与范围

03 原有“只用 AGENTS.md（Claude Code 现在也会读）”省略了会让共享约定消失的实际条件。改为：已确认原生发现可只留 AGENTS；团队有项目内 `CLAUDE.local.md`、混合版本或附加仓库时，先保留明确的导入入口。公共约定仍保留一份，无需同步工具；插件权限沿用 05。**[研究]**

### 共享指令：直接来源及反证

| 来源 | 已读范围与结论 | 对选择的影响 |
|---|---|---|
| [Claude memory](https://code.claude.com/docs/en/memory#when-claude-code-reads-agentsmd) | 原生回退检查当前及祖先的 CLAUDE／`.claude/CLAUDE.md`／CLAUDE.local；不将用户级或 managed CLAUDE、rules 当抑制项；AGENTS.override 不被这个入口发现 | 项目路径增加 `CLAUDE.local.md` 可能让原共享约定不再加载；不能把 Codex override 当跨工具规则 |
| 同页 [Project instructions](https://code.claude.com/docs/en/memory#choose-which-instruction-files-load) | 默认二选一；共同加载模式按目录先 CLAUDE 后 AGENTS，并去重已导入文件；选项读取用户、`--settings`、managed，忽略 project/local。插件 ID 在 v2.1.285 前后有变化 | 需要全队可复制时不依赖项目内无效选项；不把后出现解释成硬覆盖 |
| 同页 [导入](https://code.claude.com/docs/en/memory#import-additional-files)及[额外目录](https://code.claude.com/docs/en/memory#load-from-additional-directories) | 相对导入按包含文件定位；代码块／行内代码中的 `@` 不导入。额外目录开关加载 CLAUDE 与 rules，原生 AGENTS 不在覆盖内；原生 AGENTS 的外部导入须此前获准，不弹新批准框 | “请读 AGENTS”的自然语言和实际导入不同；额外目录可读不等于约定已加载 |
| 同页 [差异](https://code.claude.com/docs/en/memory#where-agentsmd-differs-from-claudemd)与[排障](https://code.claude.com/docs/en/memory#my-agentsmd-isnt-loading) | 原生发现与 CLAUDE 导入的事件不同；v2.1.280 前原生 AGENTS 不显示在 `/memory`／`/context`，新版本可核路径 | 旧版 UI 无路径，或当前契约下原生入口无 Hook 事件，均不能单独证明 AGENTS 缺失 |
| [Hooks：InstructionsLoaded](https://code.claude.com/docs/en/hooks#instructionsloaded) | CLAUDE 导入 AGENTS 触发 `include`，可记录 `parent_file_path`；原生 AGENTS 不触发。事件异步、不能阻止或修改加载，输出决策字段被忽略 | 日志只证明其覆盖的加载路径，不是执行合规或规则生效验收 |
| [Codex AGENTS](https://learn.chatgpt.com/docs/agent-configuration/agents-md#how-codex-discovers-guidance) | 启动时建立链，全局与项目分开；项目每层至多一个文件，override 优先，默认项目预算 32 KiB | 文件名可以共享，发现时机、override 与合并路径不能共享假设 |

**顺序与触发补充**：Claude 的 CLAUDE 层级先 managed、再 user，项目路径从文件系统祖先向当前目录拼接，同目录 local 在后；子目录 CLAUDE 在访问相关文件时按需加载。原生 AGENTS 的官方子目录说明指定 Read 触发，不能把 CLAUDE 的所有触发操作自行外推过去。共同加载模式也不是冲突解决器：应移除互相矛盾的约定。**[一手：上述 memory 原文；研究：边界判断]**

**固定版本反证**：[Claude changelog `94506ff0d3bd9185f1752da36e968775021fb48f`](https://github.com/anthropics/claude-code/blob/94506ff0d3bd9185f1752da36e968775021fb48f/CHANGELOG.md)（本次 HEAD，顶版 2.1.300）记录 2.1.277 引入 AGENTS，2.1.281 扩展到 Bedrock／Vertex／Foundry／网关及禁遥测会话，2.1.290 修复子目录文件被 `@` 提及时未附带 AGENTS 的问题。它支持“版本与触发路径影响加载”，不证明任意客户端当前构建已实测。动态 memory／hooks 正文按核实日引用，不能假装它们全部固定在这个 SHA。**[一手：固定发布说明]**

### 共享指令：采用、撤回与未验证

公共内容与导入入口的取舍统一见 [03 加载规则](../03-context-engineering.md#21-各工具的加载规则一手)。删除入口前仍须核其 Claude 专属内容、旧会话兼容、外部导入或日志用途。未取得客户端日志、遵循率或成本／质量数据；加载与任务行为须分别验。**[研究]**

## 会话动作：按问题与宿主选择

> 核实：2026-10-15（UTC+8，对应 10-14 UTC）。只读公开官方文档；未运行客户端、模型、真实配置或私人日志。**[一手：契约；研究：采用判断]**

**改变的选择**：03 不再将“长任务中途”当压缩触发器，或把子 Agent 固定为干净输入加 1–2k 摘要；先区分腾空间、舍弃旧思路、解释已有信息与独立查询。17 已有 thrashing／故障分流，20 已有恢复记录和失败压缩边界，本轮只引用，不再造恢复框架。

### 会话动作：直接证据

- [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 的 multi-agent 段把 1,000–2,000 token 写成常见摘要示例，不是接口上限；收益场景是复杂研究，不能据此规定 coding 调查的输出大小。压缩与结构化笔记也按任务选择。**[一手：工程博客]**
- [Claude sub-agents：选择主会话或子任务](https://code.claude.com/docs/en/sub-agents#choose-between-subagents-and-main-conversation)支持把可独立交付、输出冗长的工作拆出；频繁往返和共享背景可留主会话。[fork 差异](https://code.claude.com/docs/en/sub-agents#how-forks-differ-from-other-subagents)明确继承全历史；普通子 Agent 使用委派输入。文档给 `/subtask` 的版本起点为 2.1.212，交互式默认 fork mode 为 2.1.232；模式可用不意味着每次委派都采用 fork。此为 Claude 契约，不外推其他产品。**[一手]**
- [Claude commands](https://code.claude.com/docs/en/commands)区分 `/clear` 的新对话与 `/compact` 的同会话摘要；[上下文处理](https://code.claude.com/docs/en/how-claude-code-works#when-context-fills-up)说明会自动管理空间，也可能丢早期细节。故手动压缩按实际负担选择，不因时间长而强制执行。**[一手；研究：判断]**
- [Checkpointing](https://code.claude.com/docs/en/checkpointing#guide-a-summary)的摘要不改磁盘文件，原消息仍留在 transcript；两个摘要方向分别处理选中点之前／之后。原消息留存不等于每轮全部进入模型输入，摘要也不是代码回滚。**[一手；研究：边界]**
- [Claude 侧问答](https://code.claude.com/docs/en/interactive-mode#side-questions-with-btw)可见现有会话但无工具，问答不进入主历史。用于解释已有信息；不能靠它读取刚变的源码或查询最新外部事实，后续执行所依赖的结论应明确带回主会话。**[一手；研究：判断]**
- [Codex CLI 官方命令](https://learn.chatgpt.com/docs/developer-commands?surface=cli)的 compact／new／resume 分别总结、开新聊天、加载保存历史；fork 复制聊天而非上述 Claude 子 Agent。同名命令不保证同样语义；此为核实日动态文档，非固定发行版实测。**[一手]**

### 会话动作：保留的收益与撤回条件

§4.2 已分别记录 AGENTS 缺原文档时的收益、Agent KB 同模型 pass@1 迁移收益，以及 Complexity Trap 在不同模型上的收益／退化；没有新模型数据，不合并这些设置，也不删除正面结果来支持“一律少上下文”。指令加载证据足够但行为失败时，检查任务、内容和执行边界；历史过长才处理历史，当前事实缺失则补事实，跨任务检索反复缺失才评估记忆服务。**[研究：既有证据范围；经验：采用判断]**

本轮还撤回正文中“规则忽略通常因为文件长”、一律排除代码可推知信息，以及以第二次出错作维护触发的表述，它们和已经建立的加载、保留价值及事实变化判据冲突。自动记忆与旧研究仍沿各自核实日期，无新增实测收益。**[经验：全文一致性修订]**

**全文复审补核**：[Claude Read and Edit](https://code.claude.com/docs/en/permissions#read-and-edit)明确 deny 规则覆盖内置文件工具、识别的 Bash 文件命令及重定向，但不覆盖隐式递归读取或任意 Python／Node 子进程间接读写；03 因此撤回“不让 Agent 读”的全入口承诺，硬路径边界交回 10。另核 [Commands](https://code.claude.com/docs/en/commands)仍有 `/doctor prompt-audit`（v2.1.283+），未因另有 `/claude-api prompt-audit` 就删除前者。均为文档核查，未执行隔离或命令测试。**[一手；经验：独立审阅后的收窄]**


## Serena：定位与附加详情的成本取舍

> 核实：2026-10-15（UTC）。主线二；改变 03 §2.5：语义能力已经有用时，先区分定位与附加信息的成本，不因后者太慢直接弃用工具。本轮只读公开原帖、固定源码与测试定义，未安装、运行 LSP／模型或重放作者实验。**[社区／一手；经验：采用判断]**

### 用户反馈、复测与实际采用的机制

[Serena #951](https://github.com/oraios/serena/issues/951)中，n-r-w 于 2026-01-18 报告 Linux、clangd 21.1.0 的已索引大型 C++ 项目：引用查询附带详情时超时，关闭后立即返回；后来明确涉及 1000 多条记录、300 多个文件。作者曾怀疑关闭详情也慢，随后撤回，说明没有等索引结束。维护者作内容 hash 惰性计算后，**同一用户复测说仍未解决带详情的等待**，继而提出 hover 预算；不能把优化已合并当作用户收益。**[社区：实际使用与复测自报，未取得项目或完整轨迹]**

[#956](https://github.com/oraios/serena/pull/956)最终合并为 [`dcbf08520d9b6bccafc9f994284ea2be22458c56`](https://github.com/oraios/serena/commit/dcbf08520d9b6bccafc9f994284ea2be22458c56)：

- `find_referencing_symbols` **移除** `include_info` 参数及逐引用 hover，保留引用附近代码；`find_symbol` 的附加详情改为批量查询。不是给所有语义操作统一加一个参数。
- 最终配置名 `symbol_info_budget`，默认 10 秒，项目可覆盖；0 表示不提前停止。达到预算后不再发下一次 hover，已得详情保留，其余为 None，不取消已开始的请求。
- [固定测试](https://github.com/oraios/serena/blob/dcbf08520d9b6bccafc9f994284ea2be22458c56/test/serena/test_symbol.py)以模拟时间断言五个符号只查前两个、其余 None，并覆盖预算 0 及项目覆盖。未找到原报告者在合并版上的端到端成功复测；早期关闭详情的成功自报不证明预算机制有效。**[一手：补丁／测试；研究：证据边界]**

**采用判断**：批量查询先保符号身份、位置与引用，需要理解具体契约时，再读取少量目标的正文或详情。附加查询慢时可保留语义定位，而非一律退回文本搜索；慢查询也未推广到所有语言后端。**[经验]**

### 后续反证：预算省略不等于本来没有

[另一报告者的 #2006](https://github.com/oraios/serena/issues/2006)在 2026-09-09 引用 `701e7c84` 指出：预算耗尽仅有 DEBUG 留痕，工具缺少 info 的结果与真正无文档相同。该帖主要作代码诊断，未提供模型错误修改轨迹。**[社区／一手：诊断范围]**

[修订 PR #2010](https://github.com/oraios/serena/pull/2010)本轮核查仍 **open、draft、未合并**。最初拟逐符号加说明，[维护者质疑重复 token](https://github.com/oraios/serena/pull/2010#discussion_r4021141582)后，[作者改为每批一行遗漏计数](https://github.com/oraios/serena/pull/2010#discussion_r4025859992)，head 为 `4d680c856e9b6f8835919bb2db321ab0313287be`。每批计数尚未合并；作者自报测试通过，未验证 MCP 客户端端到端收益。**[社区：评审／自报；一手：未合并补丁]**

当前固定提交 [`0c1091394eda5644887dc3399621e479d9f33aa3`](https://github.com/oraios/serena/commit/0c1091394eda5644887dc3399621e479d9f33aa3)（2026-10-15T08:52:59Z）交叉核对：

- [`symbol.py L627–728`](https://github.com/oraios/serena/blob/0c1091394eda5644887dc3399621e479d9f33aa3/src/serena/symbol.py#L627-L728)仍在下一次 hover 前检查累计时间，到限后 None、仅 DEBUG 计数；每文件打开也在预算分支外。**它不是整次调用硬时限，更不能约束单个已开始的 hover。**
- 当前已经重构，实际信息过滤见 [`repl/api/lsp_api.py L353–362`](https://github.com/oraios/serena/blob/0c1091394eda5644887dc3399621e479d9f33aa3/src/serena/repl/api/lsp_api.py#L353-L362)，[L127–169](https://github.com/oraios/serena/blob/0c1091394eda5644887dc3399621e479d9f33aa3/src/serena/repl/api/lsp_api.py#L127-L169)只将非空 info 渲染入结果，未传出预算原因。不能只读旧工具文件确认当前行为。
- [当前工具签名](https://github.com/oraios/serena/blob/0c1091394eda5644887dc3399621e479d9f33aa3/src/serena/tools/symbol_tools.py)中 find_symbol 的 include_info 仍默认 false，find_referencing_symbols 已无此参数。固定 main 不等于读者安装版本。**[一手：源码；研究：机制边界]**

因此，资料缺省时先缩小目标再读，不直接认定不存在；也不为追求全量附加信息无限放宽预算。不同报告者仍来自同一项目，本轮未证明跨产品普遍收益、模型正确率或人的总投入。**[经验／研究]**

### 对照：移除无关启动开销不必减少所需证据

[另一作者的 #2012](https://github.com/oraios/serena/issues/2012)报告 Serena 1.7.0 默认 CHAR_COUNT 仍在启动时加载 Anthropic SDK；Windows 局部修改后 CLI import 自报从 5.13 秒降到 2.89 秒，新 Codex CLI 会话仍能调用初始指令、C# overview 和诊断。此时间不是完整 MCP ready 时间，也未证明该 import 是所有初始工具缺失的根因。**[社区：使用者自报]**

[#2013](https://github.com/oraios/serena/pull/2013)由另一作者提交，2026-09-16 合并 [`16322651bb8a18c7a4d43a539dac308bbed02c50`](https://github.com/oraios/serena/commit/16322651bb8a18c7a4d43a539dac308bbed02c50)：类型导入移入 TYPE_CHECKING，真正选择该计数器才加载 SDK。维护者虽讨论删除计数器，实际合并的是惰性导入，不是删除功能。[第三位参与者的固定版本复测](https://github.com/oraios/serena/pull/2013#pullrequestreview-5191963066)比较 `403ad0a` 与 `8f121d51`，在 clean container 确认模块不再提前加载并报告四项测试通过；属于独立自报，不是本仓执行，也不是 API 计数或全客户端发现率验证。**[一手：补丁；社区：独立复测自报]**

这个对照只支持先找具体成本来源：无关启动依赖可以延迟加载；附加详情降级则留下需要补查的信息。两者不能合并成“少工具／少信息必然更好”，不另扩正文启动诊断。**[经验：适用边界]**


## Serena：语义检索为空时先核项目导入

> 核实时间：2026-10-16（UTC+8；读取于 10-15 UTC）。只读公开原帖、固定源码、测试定义和发布记录；未安装或运行 Serena／JDTLS，未执行上游测试或模型任务。**[社区：原帖；一手：固定实现与发布；经验：采用判断]**

**改变选择**：源码明确存在而符号查询为空时，先用原生文件／文本搜索定位，核对语言服务器的项目导入配置与依赖解析。修正导入后，以已知定义和调用点核验，再恢复跨文件语义操作；不靠扩大查询、增加上下文或无差别清缓存解决。问题在于构建／导入上下文未成立，或旧 workspace 掩盖错误配置，有别于源码内容缓存。修后原任务验收缺失，详见本节末尾。**[经验：选择与证据边界]**

### 实际调用与报告者恢复：不要把空结果当目标不存在

- [Serena #1174](https://github.com/oraios/serena/issues/1174) 的 2026-03-16 日志来自 Windows Java/Maven 项目，Serena 日志版本为 0.1.4、后端为 LSP。`serena project index` 报告索引 2,400 个 Java 文件；随后 `find_symbol` 查 `MultilingualConfigGenerationService`，以及该类的 `generate`，均返回空数组。两次调用都未限定 `relative_path`，`include_body=False`、`include_info=False`，不是附加详情预算导致的缺省。3 月 18 日报告者确认符号存在、普通搜索可用，符号工具仍失败；对已定位 Java 文件的健康检查也返回空。维护者最初判断为慢启动，后重新打开，最终因无法复现关闭，不能把首次关闭当成修复。**[社区：原调用日志及作者复述，未复现]**
- 同一报告者在 2026-06-03 的 [#1541](https://github.com/oraios/serena/issues/1541) 补充：Windows 11、JDTLS 1.58.0-SNAPSHOT、23 个 Maven 模块，父 POM 依赖非默认配置指向的仓库；其称在 `project.local.yml` 补上 Maven 配置路径后可工作。更有辨别力的复现是：正确配置下健康检查通过，移除该配置仍通过；清掉对应 JDTLS workspace 后，才暴露父 POM 无法解析及空符号结果。该帖的 Serena 版本只写 latest，不能补成精确版本。**这是修复前的配置恢复自述，不是后来补丁发布后的用户重试。** **[社区：报告者环境／复现自述，未复现]**

索引文件数只说明扫描范围，旧 workspace 下的成功也不能单独验证当前配置。文本搜索确认存在后，跨模块引用仍须在正确构建上下文里核验。**[经验：从该单例推导的诊断选择]**

### 固定修复与发布：自动失效覆盖哪些变化

[PR #1576](https://github.com/oraios/serena/pull/1576) 于 2026-06-28 合并，merge SHA 为 `88fe650f357aa47fcb851a068424f9fbbb14c332`：

- [workspace hash 实现](https://github.com/oraios/serena/blob/88fe650f357aa47fcb851a068424f9fbbb14c332/src/solidlsp/language_servers/eclipse_jdtls.py#L777-L813) 在项目根与 launcher 路径之外，纳入七项显式配置值：`maven_user_settings`、`gradle_user_home`、`gradle_wrapper_enabled`、`gradle_java_home`、`java_home`、`use_system_java_home`、`maven_offline`。legacy INITIAL 默认配置仍保留原 hash；设置受跟踪项后才退出该兼容路径。**[一手：固定源码]**
- [新增测试 L458–478](https://github.com/oraios/serena/blob/88fe650f357aa47fcb851a068424f9fbbb14c332/test/solidlsp/java/test_jdtls_path_resolution.py#L458-L478) 检查 Maven 配置路径变化会改变 hash，以及 legacy 配置增加显式 Gradle 路径会改变 hash。测试定义不涉及真实多模块导入或 Agent 编辑。**[一手：测试源码，未运行]**
- 修复已进入 2026-07-16 发布的 [v1.6.0](https://github.com/oraios/serena/releases/tag/v1.6.0)，固定 tag SHA `93b9544ea9def8e93cb6a90f8ea67befe3c8fee4` 的 [changelog](https://github.com/oraios/serena/blob/93b9544ea9def8e93cb6a90f8ea67befe3c8fee4/CHANGELOG.md) 明列 #1576，[源码 L752 起](https://github.com/oraios/serena/blob/93b9544ea9def8e93cb6a90f8ea67befe3c8fee4/src/solidlsp/language_servers/eclipse_jdtls.py#L752-L800) 包含此机制，不能把历史缺陷写成当前版本仍普遍存在。**[一手：发布与固定源码]**
- 2026-10-13 发布的 v2.0.0，固定 SHA `4c4268f9c0adf8743a75e6dda2ef1fa635f34cc3` 的 [实现 L691 起](https://github.com/oraios/serena/blob/4c4268f9c0adf8743a75e6dda2ef1fa635f34cc3/src/solidlsp/language_servers/eclipse_jdtls.py#L691-L750) 仍保留该机制，另纳入 `runtimes`、Maven／Gradle 导入开关、build configuration、autobuild 和 custom JRE 等配置。hash 取配置值，不读取同一路径下 Maven 配置文件的内容，也不纳入 branch／HEAD；**这只限定这一层的自动失效范围，不能据此断言其他机制不会刷新或重新导入。** **[一手：固定源码；经验：边界解释]**

未找到原报告者在 #1576 后的重试验收或跨模块修改 diff／测试产物。本链只支持针对性检查导入环境，不能据此无条件清缓存、更换后端或保证升级后完成原任务。**[经验：采用边界]**

## Serena：原生引用存在但封装过滤漏掉

> 核实时间：2026-10-16（UTC+8）。只读公开原始报告、固定补丁与测试定义、发布版本源码；未运行 Serena、Gleam、上游测试或模型。**[社区／一手；经验：采用判断]**

**改变选择**：03 §2.5 将“语义结果不全”进一步分流：原生 LSP 已返回、封装工具却漏掉的调用者，先核包装过滤和版本，临时沿用已核验的原生结果；不能用扩大上下文、增加文档服务或重建索引修复这层丢失。文本搜索可以发现可疑遗漏，仍不能单独确认语义身份。这不改变“先对照 IDE、确认覆盖再编辑”的采用门槛。**[经验]**

- **真实查询差异**：[Serena #2133](https://github.com/oraios/serena/issues/2133) 的报告者于 2026-10-05 给出 Serena 1.7.0、Claude Code、Windows 11、Gleam 1.17.0 环境与三文件代码：`a.run`、`c.run` 都调用 `b.run`，`find_referencing_symbols` 仅返回前者，而直接 `textDocument/references` 返回两者。报告者声明实际遇到此问题；这证明的是引用查询失败，未提供最终修改产物或编辑验收。**[社区：原始报告，未复现]**
- **固定修复**：[#2134](https://github.com/oraios/serena/pull/2134) 于 2026-10-06 合并为 [`c4a2fd425cbe0fb59db62f39e9db735d33a2dd4c`](https://github.com/oraios/serena/commit/c4a2fd425cbe0fb59db62f39e9db735d33a2dd4c)。旧实现见到目标声明后，将后续同 name、同 kind 的包含符号当成 import；新增条件要求引用位置还须落在该符号名称的 `selectionRange` 内，函数体内的调用不再仅因同名被过滤。PR 作者以 Gleam 1.19.0 自报修前／修后对照，并说明旧版表现受返回顺序影响；这不是原报告者回执。修复仍依赖语言服务器的 range 表达，作者没有验证所有后端。**[一手：补丁；社区：作者复测自报]**
- **测试定义与防假绿**：[固定单元测试 L59–85](https://github.com/oraios/serena/blob/c4a2fd425cbe0fb59db62f39e9db735d33a2dd4c/test/solidlsp/test_referencing_symbols.py#L59-L85) 用脚本化 LSP 响应将声明排在两个同名调用者之前，再断言两者均返回，确保触发旧过滤条件；[Gleam 后端测试 L110–126](https://github.com/oraios/serena/blob/c4a2fd425cbe0fb59db62f39e9db735d33a2dd4c/test/solidlsp/gleam/test_gleam_basic.py#L110-L126) 验证相应三模块场景，但旧版是否失败受实际返回顺序影响，不能只以一次旧版通过判定没有缺陷。PR 自报测试通过，未由本仓执行或验证 Agent 编辑。**[一手：测试定义；经验：验证边界]**
- **已发布边界**：[v2.0.0](https://github.com/oraios/serena/releases/tag/v2.0.0) 发布于 2026-10-13；[固定版本 `4c4268f9` 的实现 L2545–2569](https://github.com/oraios/serena/blob/4c4268f9c0adf8743a75e6dda2ef1fa635f34cc3/src/solidlsp/ls.py#L2545-L2569) 包含该过滤修正。不能把 1.7.0 的报告写成当前版本普遍仍有此故障，或因此无条件更换后端。原 issue 无评论，PR 讨论也未提供原报告者修复后回执；本链满足原报告、固定修复与测试定义，不满足端到端编辑收益。**[一手：发布与源码；研究：证据范围]**


## 跨配置修改：原生引用也有构建范围

> 核实时间：2026-10-17（UTC+8）。主线二；收窄 03 §2.5 的“对照 IDE、确认覆盖”：相同后端与构建可能共同遗漏其他配置。只读版本化官方文档、固定实现与原帖；未运行 gopls、上游代码／测试或模型。**[一手／社区；经验：采用判断]**

**改变选择**：任务涉及多个平台或 build tags 时，先从目标配置核对相关文件与必要调用点；语义结果未覆盖的候选可用局部文件／文本搜索找出，再在对应配置中确认身份。仅修改当前构建时不追加全仓扫描。此处补的是查询范围，保留原生语义工具，不因这类遗漏增加封装或检索框架。**[经验]**

- **版本化契约**：已核 [gopls/v0.23.0](https://github.com/golang/tools/tree/gopls/v0.23.0) 对应提交 `014f87ff5c01915bc90f4f11a6bb8aea3e0edbd7`。[workspace.md L53–76](https://github.com/golang/tools/blob/014f87ff5c01915bc90f4f11a6bb8aea3e0edbd7/gopls/doc/workspace.md#L53-L76) 明确 References／Implementations 只查询所选文件的默认 build，不合并所有可能构建；自动匹配其他 GOOS/GOARCH 文件不等于跨构建引用合并，也不能自动推断任意用户自定义 tags。[navigation.md L73–77](https://github.com/golang/tools/blob/014f87ff5c01915bc90f4f11a6bb8aea3e0edbd7/gopls/doc/features/navigation.md#L73-L77) 再次明确 Windows 文件发起的查询不含 Linux 文件。当前[官方 workspace 文档](https://go.dev/gopls/workspace)仍保留该范围，不能把它写成已经修复的历史问题。**[一手：固定版本／动态契约]**
- **实现交叉核对**：[References 入口 L28–37](https://github.com/golang/tools/blob/014f87ff5c01915bc90f4f11a6bb8aea3e0edbd7/gopls/internal/server/references.go#L28-L37) 用 `FileOf` 取一个 snapshot，传给 Go 引用查询；[FileOf 与 view 选择 L447–498](https://github.com/golang/tools/blob/014f87ff5c01915bc90f4f11a6bb8aea3e0edbd7/gopls/internal/cache/session.go#L447-L498) 沿 `SnapshotOf` 和匹配 view 取得文件上下文。这里没有遍历所有 view 合并引用的入口逻辑；这只佐证该版本的文档范围，不外推其他 LSP。**[一手：固定源码，未执行]**
- **真实需求及未闭合边界**：[meling 的 #65089](https://github.com/golang/go/issues/65089) 把教学模板、解答与测试放在同一目录，用 `!solution`／`solution` 区分；报告者自述命令行两种配置分别失败／通过，但编辑器需手动切换 tag 才能使用字段或类型重命名。它证明实际多配置维护需求与操作阻碍，未给出漏改后交付产物，版本也未指定。核查时仍 open；[唯一评论](https://github.com/golang/go/issues/65089#issuecomment-2184197333)讨论显式配置或提示，不是原报告者修复验收。[#65755](https://github.com/golang/go/issues/65755) 的跨 view 合并仍是 open 提案，性能与客户端部分结果支持是讨论中的取舍，不能当成可用功能。**[社区：原报告；一手：维护者设计讨论]**

官方[手动配置段](https://github.com/golang/tools/blob/014f87ff5c01915bc90f4f11a6bb8aea3e0edbd7/gopls/doc/workspace.md#L115-L135)给出 `build.env` 的 GOOS／GOARCH 与 `build.buildFlags` 的 tags 路径。采用时按任务所需配置核验，不要求枚举全部可能组合；文本搜索仅找候选，同名命中仍需语义判断。未取得配置核查前后的人力、耗时或模型正确率数据。**[一手；经验：适用范围]**


## 同名重命名：新增LSP还是沿用原生搜索

> 核实时间：2026-10-17（UTC+8）。主线二；收窄 Codex 页“同名多／跨语言重构就试语义工具”的触发条件。只读公开 PR、评审、固定补丁与官方契约，未运行插件、模型或上游测试。**[一手／社区；研究：采用判断]**

**改变选择**：先看导入、调用关系与已有检查能否完成本次修改。同名数量和工程规模不单独证明需要增加 LSP；仍无法确认接收对象／引用身份时再试语义工具。插件故障处置与新增替代插件分开决定：先恢复可用基线，再看新能力是否实际被使用、反馈是否覆盖编辑路径，以及是否值得维护。**[研究：采用判断]**

### 从故障修复到撤回新增集成

[PostHog #103618](https://github.com/PostHog/posthog/pull/103618) 于 2026-09-21 合并，最终提交为 [`1fd1ae9`](https://github.com/PostHog/posthog/commit/1fd1ae945b97afec0d7a92c1fd2dac45ebb9636f)。作者报告原 TypeScript 插件无法找到有效安装，既有 AGENTS 的 Pyright 指令也不符合实际环境。最初方案是在仓库内提供 tsgo／ty 插件、启动包装脚本和优先使用 LSP 的指令。[人类评审](https://github.com/PostHog/posthog/pull/103618#pullrequestreview-5266831733)追问新增收益、维护与 Agent 专用配置成本，促成对照和缩减。**[一手：合并与补丁；社区：作者／评审反馈]**

[`fa252da` 撤回补丁](https://github.com/PostHog/posthog/commit/fa252daf46d938c09093c27410247853ac57a381)删除新插件、两个包装脚本、仓库 marketplace 和 LSP 优先指令；最终保留停用原 TypeScript 插件、移除错误 Pyright 说明和修正阻止共享配置变更的提交检查。是**本次拟议集成在合入前被撤回**，不是已长期采用后测得收益消失。**[一手：固定差异]**

维护负担不只有推测：[`9cd762b`](https://github.com/PostHog/posthog/commit/9cd762ba5ea737cd514bd1301a1d57917e0ccf8d)修复轻量 worktree 缺依赖与继承错误虚拟环境；[`dce64d6`](https://github.com/PostHog/posthog/commit/dce64d612e1e1dc8a06927c1c4499310e7d5955b)去掉 PATH 中未锁版本的 tsgo 回退；[`cccae49`](https://github.com/PostHog/posthog/commit/cccae49d38d9c7fbaec523774581c3dae30e04a3)拒绝空虚拟环境并提高插件版本，让缓存拿到修正。这些公开变更证明适配工作真实发生，不提供工时或安全风险的量化。marketplace 是仓库目录，服务器取既有锁定依赖，不能写成另接第三方远程服务。**[一手：固定补丁；研究：成本范围]**

### 五题报告证明了什么

[详细评审报告](https://github.com/PostHog/posthog/pull/103618#pullrequestreview-5268138633)明确标注为主动要求并引导的 Agent review。作者称在相同代码上比较 `claude -p` 两臂：插件加 AGENTS 指引，对照 master 配置；三题同名符号重命名（`ensure_utc`、`get_github_token`、`humanize`）、一题生产调用文件查询、一题可由 grep 完成的 Django 设置重命名。每题 Sonnet 5 每臂两次、Opus 5 每臂一次；将 diff 应用到干净树，检查遗留引用、误改同名对象及新 ty／tsgo 错误。**[社区：项目方 Agent 辅助自报，未独立复测]**

作者报告两臂各 15 次均正确（Sonnet 各 10 次、Opus 各 5 次），新增臂只调用 LSP 一次。**30 次报告通过不证明质量等价**；时间、轮次和费用在两模型间方向不同，且一轮新增臂选择额外跑测试，不能给出统一节省率。**[社区：作者汇总；研究：可比性边界]**

报告称 grep 加 import 行分清了测试中的同名对象，还找到字符串 mock 路径；所有重命名经 Bash 的 sed／perl 完成，未走 Edit／Write，所以 ty 自动诊断未触发。当前[官方文档](https://code.claude.com/docs/en/plugins/code-intelligence#see-what-claude-gains)将编辑后诊断与只读导航区分，支持核对反馈路径；本轮未复现 Bash 行为。**[社区：运行报告；一手：官方契约]**

**反证与未闭合项**：作者明确未测 `obj.run()` 一类方法／属性引用，导入路径不能直接揭示其所属类；不能采纳“调用少所以该任务也难有收益”的外推。未在已读 PR、评论与提交链取得逐轮 transcript、评分脚本或结果工件，无法核对运行版本、完整验收和成本；两臂也同时改变插件及指引。这里是有实际撤回补丁的项目选择，不是受控收益证明，更不是 Codex／Serena 的效果实验。**[研究：证据边界]**

自动诊断没触发时保留显式 typecheck；已有语义工具确有收益时，不据本例撤回。**[研究：保留条件]**


## 生成代码：运行产物与持久修改源

> 核实时间：2026-10-18（UTC+8）。主线二；补充 03 §2.4 的生成代码维护任务。只读公开 PR、固定实现和复测回执，未运行上游构建、测试或模型。**[一手／社区；经验：采用判断]**

**改变选择**：文本或符号检索找到运行文件后，还要区分它是否由其他文件生成。先沿来源标记与构建规则回源修改，再重生成、核对产物；已有原生搜索能追清这条关系时，不因此新增索引服务。此处关注持久修改位置，不扩展评审工具选型。**[经验]**

### 原发现、固定修正与复测

[fullsend-ai/agents #861](https://github.com/fullsend-ai/agents/pull/861) 为 Claude Code 辅助的风险标签功能 PR，最终合并为 `f20826eb1ac75fa1db4b58d52ca9959a33f9b638`。**[一手：PR／固定补丁]**

- **发现**：waynesun09 的 [8 月 19 日（UTC）原评审](https://github.com/fullsend-ai/agents/pull/861#discussion_r3815368916)自述在 `bd98ef7d16bad4e9e4e6cf05dc4317de730782f5` 重生成后，风险逻辑消失。该版本的 [post-review.sh](https://github.com/fullsend-ai/agents/blob/bd98ef7d16bad4e9e4e6cf05dc4317de730782f5/scripts/post-review.sh#L838-L902)有风险块，第 2 行注明生成来源；[post-review.src.sh](https://github.com/fullsend-ai/agents/blob/bd98ef7d16bad4e9e4e6cf05dc4317de730782f5/scripts/post-review.src.sh)却没有该块。**[社区：评审者自报；一手：固定源码]**
- **修正**：[627c6ad](https://github.com/fullsend-ai/agents/commit/627c6ad114446c4b6fe9463e103a4c7dbc9b30c7)把风险逻辑加入 `post-review.src.sh`，同时更新 bundle；作者 [8 月 20 日（UTC）回复](https://github.com/fullsend-ai/agents/pull/861#discussion_r3823464068)确认已回源修改并执行 `make script-build`。**[一手：补丁；社区：作者回执]**
- **复测**：原评审者在 [8 月 25 日（UTC）最终批准](https://github.com/fullsend-ai/agents/pull/861#pullrequestreview-5021538511)中，以 `e6862041552c117c3359e70dea4b1a82141f6ce0` 为头，报告两个 bundle 重生成后字节一致，相关脚本测试通过。这是包含多项后续修改的整轮复测，不能将所有通过项归因于这一次回源修正，也不是本仓独立复现。**[社区：原评审者复测自报]**

### 为什么运行入口仍不足以决定编辑目标

固定修复版本的 [harness/review.yaml L67–68](https://github.com/fullsend-ai/agents/blob/627c6ad114446c4b6fe9463e103a4c7dbc9b30c7/harness/review.yaml#L67-L68)将 `post-review.sh` 配为运行后处理脚本；[Makefile L4–6、L24–38](https://github.com/fullsend-ai/agents/blob/627c6ad114446c4b6fe9463e103a4c7dbc9b30c7/Makefile#L4-L38)则将 `.src.sh` 映射为 `.sh`。因此本例不是“搜到未使用文件”：产物确实会运行，但只改产物的功能不能在重新生成后保留。**[一手：固定实现；经验：机制解释]**

`script-build` 调生成器写回产物；`check-bundle` 只在临时目录生成并比较，不覆盖提交文件。原评审标题将后者写成会抹掉功能，须以实现纠正。[CI L35–44](https://github.com/fullsend-ai/agents/blob/627c6ad114446c4b6fe9463e103a4c7dbc9b30c7/.github/workflows/script-test.yml#L35-L44)定义了一致性检查及 source／bundled 两路测试，但定义本身不证明执行成功。**[一手：固定实现／CI 定义]**

**比较与反证**：原生文件／文本读取可以发现来源头和构建映射；语义索引即使正确指到执行文件，也不自动回答哪个源文件负责生成它，这是机制推论，未做工具对照。生成物仍可能是检查实际执行内容所必需的输入，因此不能把“不直接修改”推广为“不读取”。本例只支持已有生成链上的回源修改，不要求普通手写文件增加一套生成检查。未取得原始 Agent 检索轨迹、该修正独立的人工投入或正确率数据，不推新增 LSP、扩大上下文或增加评审轮次的收益。**[经验／研究：适用范围]**


## P52上下文代际复核

核实：2026-10-21（UTC+8），基线c484b1a；问题是升级强模型后，预供哪些信息、让Agent自行取回哪些信息。先用P51提示并复用C06／P46名册。**确认必要上下文与原生检索，修正旧规则继承：按任务路由文档，不给所有模型统一“极简化”。** 03最高水平节是近期团队方法比较，当前跨任务最优未知；主流采用率与本仓净收益均未测。[研究]

| 输入已知来源／本次读取 | 支持与反证 |
|---|---|
| [Cursor9-23](https://cursor.com/blog/improved-token-efficiency)，Katz／O’Keefe／Yee，提示、工具及委派节 | 从旧补偿提示转向按需上下文；仍保留高频工具入口。组合A/B不能给单一删规则报效果，也不是所有工具都动态化的证据。[一手：团队自报] |
| [OpenAI9-11](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)，Eric Provencher，AGENTS与Persistence节 | Astra可按任务选文档，完成状态仍要明确；Sol／Luna可能需要更多指导。只撤冗余催促，不撤项目独有约束、实际验收或授权边界。[一手：厂商实践] |
| [AGENTS.md v3，9-29](https://arxiv.org/html/2602.11988v3)，Gloaguen等，§4及附录B | 实验是Sonnet4.5／GPT5.2等旧模型，不能因更新日新就当当前代实测；人为移除文档后生成上下文有益，反驳“越短越好”。[一手：论文] |

删减后若丢约束、漏相关测试或只交首版，补回那项具体要求；不因此回到每次全仓预读。旧Anthropic2025-09思路仅保留被近期机制再次支持的部分，未重读的旧材料不列入本轮原文数。现有引用图、压缩恢复与客户端契约未重新做全量认证。[研究]

**回执（执行者自报）。** 11:29:46 UTC开始采用提示，11:30:52冻结来源与决定，11:32:02候选稿及局部检查完成。研究墙钟66秒、后续撰写整理70秒，净工时未知。N=3/F=3、D=3/FD=3，均为已知来源重读，新发现0；预先读C06卡不叫盲测，也不报0%漏检。整合及独立评审由项目统一执行，03不另计P51自用。[研究]
