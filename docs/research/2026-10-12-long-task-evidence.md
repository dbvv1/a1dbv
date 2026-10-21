主线：三，兼二
改变的建议：分清请求超时与任务截止；续接恢复最新目标、约束、执行事实与活跃资源，按当前验收核结果。派发前保留回执丢失后仍可查的任务身份，失败先对账再恢复／重试；循环只补真实续接／反馈缺口，撤回固定重置和逐功能工作流。可选子任务显式降级，必需验收换执行者，停不掉共享写入者则暂停相关交付；依赖子结果先复用宿主前台返回。P57 分开复用编码循环与自建产品控制层，以下一次提交和真实关闭接收维护任务。P60 升级验到首次新写后的冷读与下一轮，确认旧补丁没有遮蔽原生修复。[经验／研究]
新证据：P60 补迁移丢写、正式修复与补丁退役链。其余汇总既有官方设计、固定实现／测试定义、社区单例及历史产物链，日期与反证见各节。压缩修复须核发布 tag，响应完成不保证持久化；Claude thrashing／StopFailure、Ralph 控制与历史 harness 分开计证。2026-10-16（UTC+8）本仓 Git 正反例只核续接分支／HEAD；SDK／HTTPX2／Go 超时边界来自契约与实现。gstack 降级、CAO 身份缺口及 Symphony 恢复契约按模板／源码／测试定义与公开报告计证，未作本仓真实恢复实测；本页补核未运行新模型恢复实验。2026-10-18（UTC+8）补 Claude 2.1.302 默认前台发行与三种非交互入口的父消费复测自报；显式后台仍有未唤醒报告，Desktop／VS Code 只核发行，不作本仓实测。[一手／社区／研究／经验]

# 长程任务：来源、反例与实验边界

> 资料整理：2026-10-12（UTC）。对应[20 · Codex 长程任务](../20-codex-long-horizon.md)，本页只保存正文省略的来源与细节。正文原有核实时间为 2026-10-11（UTC+8，检索截至 2026-10-10 UTC）；后续补充按所链接研究页的日期定位。本次阅读分层没有重新核实全部外部网页或发布状态。

正文核查沿革补记：2026-10-12 仅调整阅读分层；2026-10-14 补 §4 继承行为诊断、原生历史恢复与失败压缩边界。2026-10-15 补 §5 续接输入接受／处理差异与 §7 dot 停止范围，详细来源见[dot 长任务核对](2026-10-12-development-conditions.md#dot-长任务续接接受处理与停止范围)；其余外部事实仍按各记录日期，不表示本轮全部复核。**[经验：维护范围]**

## P61：整轮交付与争议接管

核实：2026-10-21；2026-10-22 补独立团队的生产接收比较。改变[00 的整轮委派](../00-state-of-ai-coding.md#整轮自主实现在哪一步接管)：交完整目标，把修实现与改变接受标准分开；争议解决后恢复自动推进，不按任务大小收缩。[研究]

### 最高水平卡

- **当前整体上限未知；领先实践已读并比较。** Stephen Toub [9-16 发布、9-23 更新的 Copilot runtime 迁移复盘](https://github.blog/ai-and-ml/generative-ai/migrating-the-github-copilot-runtime-to-rust-using-copilot/)说明 Agent 承担生产迁移，人持续定边界、追验收；真实消费又发现回归。自动合并循环曾为删除 SDK 方法加测试 waiver，人发现后纠正。月份跨度和生成量不作无人介入或净收益证据。[一手：团队自报]
- **当前代际参照：** 下述 10 月 VS Code 自动修复报告明确为 Copilot／GPT-6 Astra；人工账号提交的协作 PR 正文注明 Written by Copilot，具体模型未知。[一手：公开运行报告]
- **主流／可行：** 行业采用比例未知。完整目标交 Agent 实现、自验，按契约争议接管是可行路径；不要求固定阶段数、角色数或额外平台。[研究]
- **独立采用团队：** Shopify／Max Da Silva、Jason Kim、Quique Fagoaga 的 [2026-09-10 Shop 迁移复盘](https://shopify.engineering/shop-app-migration)已读结果、方法及局限。六名核心工程师及后加入的功能团队参与，模型未披露；它独立于 Microsoft，但仍是采用者自报，不是外部复现。[一手]
- **本仓层级：比较后的条件默认，差距 1。** 原生整轮、争议接管、补窄迁移流程分别对应反馈和契约缺口；同版本 SDK 两条路径、下一版维护与独立生产接收互相校验选择，不能拼成同一产物的完整生命周期。跨任务最优及完整投入未知，限制效果声称，不要求退回逐步陪写。[研究]

### 同题：使用方升级同一 SDK，不能顺手改变审批契约

**自动候选停住，不等于产品一定错。** [#341830](https://github.com/microsoft/vscode/pull/341830)在 10-15 升 Copilot SDK preview.0→1、runtime 1.0.99-0→-1。第一次[停止报告](https://github.com/microsoft/vscode/pull/341830#issuecomment-6200842651)是可信 gate 查找旧 suite 名；第二次[停止报告](https://github.com/microsoft/vscode/pull/341830#issuecomment-6202451598)是 managed Assisted replay 失配，候选未推送。二者原因不合并，bot 对权限变化的解释也须再验。10-21 核查仍 draft、未合并。[一手：bot 自报与 PR 状态]

**接管验收语义，Agent 仍继续完成升级。** 同目标 [#341861](https://github.com/microsoft/vscode/pull/341861)由 roblourens 提交、Copilot 协作，10-15 经人审合入 [`009603bfc85917533f30054f0bfeccc7c1ed70f0`](https://github.com/microsoft/vscode/commit/009603bfc85917533f30054f0bfeccc7c1ed70f0)。作者用原审批／文件系统断言的 live recording 区分新 judge 调用与旧 replay 序列错位；没有证明 live 权限被绕过。未找到 A→B 显式交接，只称同题路径。[一手：作者诊断与合并元数据]

**验收器也会被修坏。** 该 PR 记录路径归一化曾把后续正文差异吞掉，实际 [diff](https://github.com/microsoft/vscode/pull/341861/files)新增录制／回放负控制：路径分隔符可等价，正文反斜杠、换行与 Unicode 转义拼写变化必须失败。实现缩窄路径 token，不再重编码整段引号内容。最终 head 为 `efca0346322c09f600ab105d21d57d440287837a`；本地回放／live 通过属作者记录，正文最终 CI 仍是运行中历史快照，本仓未独立核完整全平台终态。[一手：固定实现与作者运行，非本仓复跑]

**下一改仍可交回自动修复。** [#341922](https://github.com/microsoft/vscode/pull/341922)在 10-16 升 preview.1→2、runtime -1→-2，修复报告仍标 GPT-6 Astra。[bot 报告](https://github.com/microsoft/vscode/pull/341922#issuecomment-6210817468)产品构建 485101 succeeded，之后三名人类批准，合入 [`be4f9ba6ec05394c6f6456e8006358140a1262bf`](https://github.com/microsoft/vscode/commit/be4f9ba6ec05394c6f6456e8006358140a1262bf)。本仓核了公开报告和 review 元数据，未独立读取 Azure job 或证明所报测试 tree 等于最终 head；不是精确提交 CI 全绿认证。[一手：公开运行自报与主干采用]

### 独立采用对照：允许变化，不抹掉关系

**同题是迁移时怎样接收行为，不是比较模型排名。** VS Code 可等价的是路径分隔符，不能吞正文与转义；Shop 的可变值与关系检查见[00 正文](../00-state-of-ai-coding.md#整轮自主实现在哪一步接管)。两者支持把差异规则与应失败样本一起交付，不是一律严格回放或一律放宽快照。[研究]

**补流程是为可见的接收缺口服务。** Shop 的计划接受绑定内容 hash，改计划后原接受失效；其一周原型尚未生产可用，专家仍处理架构与性能。不能将定制流程的生产结果当作“仅交目标、最后看结果”的证明，也不能把该机制要求为所有任务的前置阶段。[一手；研究]

**已发行不等于后续自主收益已证。** Shop 是消费者应用，不是 Helix 的 Shopify 商家应用；其发布后具体 Agent 二改接收与完整人工投入尚缺。商店后续发版不能补齐这一证据。SDK 合入、生产采用与无人介入效果分别记录；页级条件默认可成立，不声称跨任务最好。[研究]

本轮来源来路：Shop 与战略原文 [Back to native](https://shopify.engineering/back-to-native)均已读，前者改变接收选择，后者用于区分两款应用与未来收益计划；旧 Toub／VS Code 固定链复用，不计新发现或本轮全部重读。P51 提示词在最初来源读取后才重读，本次不追认独立自用项目。App Store 版本历史只证明继续发版，不进入 AI 效果证据。[经验]

全页比较结论：近期 Willison 的整轮实现与试玩、Anthropic 的风险接收、Toub 的迁移判断，加独立 Shopify 生产团队，支撑整轮自主与有争议契约接管；Cursor 的提示删减及 08 的独立比较支撑按缺口增加编排。权限／格式条目仍按主专题契约使用。未把无人介入净收益作为 gap1 的必需条件，也未将上述机制拼成统一质量冠军。[研究]

## P60：任务未完时升级执行逻辑与保存格式

核实：2026-10-21。改变 [20 §4.1](../20-codex-long-horizon.md#41-任务未完执行逻辑却要升级)：不紧急就到可核边界换版，热续接须验证新写与恢复；与 P47 请求回退／工具绑定分开。[研究]

### 最高水平卡

- **问题：** 已交代码、旧测试通过、CI／评审仍在途，如何升级执行逻辑与保存格式，同时保住交付？
- **当前最高水平整体未知；领先参照已比较。** Cursor／Josh Ma [2026-06-02 生产复盘](https://cursor.com/blog/cloud-agent-lessons)将常驻 workflow 改为单任务后退出的较短 workflow，方便版本升级，并分离执行循环、conversation 与 VM；LangChain／Sydney Runkle [2026-05-12 Delta Channels](https://www.langchain.com/blog/delta-channels-evolving-agent-runtime)提供兼容升级机制，7–9 月维护链检验其失效与修复。前者是头部编码产品实践，后者不是完整编码效果对照。[一手：团队自报；研究]
- **主流与可行：** 固定版本、兼容续接均有原生机制，行业采用比例未知；沿现有宿主恢复／任务入口是可行基线，不要求读者搭平台。[一手；研究]
- **本仓层级：比较领先机制后的条件默认。** 三路同题见正文；分别承担保旧部署、保兼容行为、保交接契约的成本，总投入未知。[研究]

### 先核宿主契约，再选路线

**旧版排空必须真的固定执行代码。** Temporal [Worker Versioning](https://docs.temporal.io/production-deployment/worker-deployments/worker-versioning)区分 Pinned 与 Auto-Upgrade；后者仍需手工保持 replay-safe。保留旧 worker 的代价与能否及时结束一起比较，紧急安全／权限停止要求优先于排空。[一手：滚动契约；研究：选择]

**换一个 run 未必换版本。** Temporal [Continue-as-New 升级](https://docs.temporal.io/production-deployment/worker-deployments/worker-versioning/upgrade-on-continue-as-new)是 Public Preview；Pinned 默认跨该边界仍沿用旧版，启用升级也要保持新旧输入兼容。切回流量[不会移动既有 Pinned 任务](https://docs.temporal.io/production-deployment/worker-deployments/recover-pinned-workflows)。不据此要求 Codex 用户迁入 Temporal。[一手；研究]

**热续接须兼容执行位置和业务语义。** LangGraph [兼容文档](https://docs.langchain.com/oss/python/langgraph/backward-compatibility)说明既有线程使用最新 graph：旧节点名、字段与必要的行为分支要保留至不再依赖。Functional API，以及 Graph 节点内的 task／interrupt，还须保住恢复点前的调用位置。保旧行为不保留已撤销权限；这些契约不能推定托管 Codex 的升级能力。[一手；研究]

### 从透明升级到首次新写：可追维护链

1. **机制声明。** 上述 Delta 工程文说明 Deep Agents v0.6／LangGraph 1.2 用旧 plain-value checkpoint 作新 delta 基底；自定义 reducer 须满足分批合并不变性。文章的 coding 工作负载是 mock、InMemorySaver、无模型调用，存储收益不是编码完成率。[一手：作者基准]
2. **旧读正常仍会丢新写。** Aarkin Karnik [#8384，7-19](https://github.com/langchain-ai/langgraph/issues/8384)在 LangGraph 1.2.9／checkpoint 4.1.1 同一 thread 迁移：旧值 a 后写 b，invoke 返回 a、b，冷 get_state 仅见 a。故障落在首次非 snapshot 写入；全量 snapshot 频率设为 1 会掩盖它。[社区：自含复现与作者输出，未自行运行]
3. **修复已经发行。** Elior Nataf Lackritz [#8526，8-07](https://github.com/langchain-ai/langgraph/pull/8526)合入 [`a90ab4435853b8a5b6f82b20220b4c76af0e46d1`](https://github.com/langchain-ai/langgraph/commit/a90ab4435853b8a5b6f82b20220b4c76af0e46d1)，删除 InMemorySaver 把 seed 自身 pending writes 当作已合入的判断；[checkpoint 4.2.0 同日发行](https://github.com/langchain-ai/langgraph/releases/tag/checkpoint==4.2.0)。迁移回归覆盖同步／异步冷读、多次新写和消息 ID 保留；SQLite 没有同一丢写 bug。[一手：固定实现、测试定义与发行]
4. **依赖升级后还须退役旧补丁。** DeerFlow／Vanzeren 提交、Willem Jiang 9-23 合入 [#5734](https://github.com/bytedance/deer-flow/pull/5734)，固定 [`31bfd40f38fc2bf844f754e88e42e7783d8d0d65`](https://github.com/bytedance/deer-flow/commit/31bfd40f38fc2bf844f754e88e42e7783d8d0d65)。旧补丁按核心 langgraph 版本判断退役，而 saver 属于独立 checkpoint 包；升包后仍会遮蔽已修实现。修订删对应补丁、抬 checkpoint≥4.2.0 与 postgres≥3.1.2 下界，保留同线程 full→delta 迁移回归。默认仍 full、核心仍 langgraph 1.2.9，其他兼容补丁没有全删。Postgres 修的是 plain-seed 识别造成的多余回放成本，不是同一丢写。[一手：固定应用修订；作者解释]

**运行结果只按作者报告记账。** DeerFlow 作者自报去补丁后 4.1.1 失败、4.2.0 的 memory／sqlite 通过，并核方法来自原生模块；定点 47 passed／4 skipped，Postgres 未跑。全套曾有失败，最终修订后未整套重跑，不能称全套通过或发行认证。[一手：作者运行自报]

**本仓验收与缺口。** Agent 沿已有回归核“旧状态→首次新写→冷读→下一轮”，再核实际包和实现；人决定新要求的追溯范围，旧测试按其输入／环境／语义复用。此次只核原文、固定补丁与发行，未安装或运行 SDK、模型、宿主或新增探针。20 登记资料机制“已比较、gap 2”；完整三路真实编码效果、外部副作用恰好一次和净人工总投入仍未知，不因来源新而降分。[研究]

## 官方来源与历史时点

下表保存直接出处；设计指南、开源文档与客户端实测分别计证据，不能互相替代。

| 来源 | 正文使用的依据 | 版本、状态与检查边界 |
|---|---|---|
| [Astra 提示与 Skills 指南](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) | 缩短常驻指令，按需读文档，避免复杂技能流程束缚模型 | 2026-09-11，面向特定模型代际；不支持删除所有脚手架的泛化判断。**[一手]** |
| [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | 项目指导入口、同层 override 优先与默认 32 KiB 总上限 | 文档机制不能证明会话中改文件后已自动重载。**[一手]** |
| [Build skills](https://learn.chatgpt.com/docs/build-skills) | `.agents/skills/<name>/SKILL.md`，元信息先加载、正文按需加载 | 可发现、触发、执行与结果正确是不同检查；没有由目录存在推断有效。**[一手]** |
| [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | 边界清楚、读多写少的任务适合拆分，主任务整合结果 | 本地 Codex 与托管 Work 的角色、配置及权限模型不能混用。**[一手]** |
| [OpenAI 长时任务实验](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex) | 持久化需求、计划和状态 | 报告的约 **25 小时**运行是特定实验，不是任意任务的时长或交付承诺。**[一手]** |
| [ExecPlans 旧文](https://developers.openai.com/cookbook/articles/codex_exec_plans) | 以文件保持可续接的计划 | 旧文已标为 **archived**；文件名是约定，不是系统保证。后续示例比较、固定源码与适用范围见 [Cookbook 复核](2026-10-11-codex-cookbook.md)。**[一手]** |
| [Goals 指南](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) | 可度量目标、验证、预算及停止原因 | 指南标注 **Codex 0.128.0 起支持**，不表示 dot 或任意 API runner 都暴露同一 `/goal`；线程续接条件与教程读取范围见 [Goals 复核](2026-10-11-codex-cookbook.md#2-goals官方设计与实际使用报告一起看)。**[一手]** |

[Codex 配置示例](../../templates/codex/README.md)是可选、未自动安装的示例；其中 Sol 6.1 / high 只是成本与能力的选择，原资料没有将其验证为任意任务的最优档位。**[经验：示例范围]**

## 社区故障与修复状态

以下保留原帖和当时状态，不把单例合并成故障率，也不从 issue 关闭推断整个故障类别已消失。阅读社区报告不等于本仓库独立复现。**[社区；研究：证据边界]**

| 原始来源 | 报告或变更内容 | 原核查中保留的反证与限制 |
|---|---|---|
| [Spec Kit #3752](https://github.com/github/spec-kit/issues/3752) | 把 **16 个场景压成 4 条故事**，导致误判完成 | 单例支持验收粒度被压缩的故障模式，不支持普遍发生率 |
| [Codex #42695](https://github.com/openai/codex/issues/42695) | 压缩后回到旧任务 | 与其他压缩失败分开观察，不能预设同一根因 |
| [Codex PR #44659](https://github.com/openai/codex/pull/44659) | 触发元信息传播修复，已合并 | 未确认首次发布版本，也没有证明修复全部“回旧任务”症状。**[一手：PR]** |
| [Codex #38969](https://github.com/openai/codex/issues/38969) | **10 月**仍有压缩失败报告 | 不同环境的根因未必相同，不能借一个旧 issue 关闭排除这类问题 |
| [Codex #40932](https://github.com/openai/codex/issues/40932) | 父任务过早结束，也有父任务仍在等待而结果投递停滞的报告 | 单加“不要提前结束”不能覆盖全部唤醒路径 |
| [Codex #38989](https://github.com/openai/codex/issues/38989) | 大量递归评审、重复测试及巨量记录 token | 记录 token 不等于实际账单，原文没有据此计算用户费用 |
| [Superpowers #1040](https://github.com/obra/superpowers/issues/1040) | 研究返回主 checkout 的绝对路径，后续写错位置 | 历史单例；工作树位置与实际写权限是不同条件 |
| [Superpowers #2050](https://github.com/obra/superpowers/issues/2050) | 子任务提交到 main | 原核查时已关闭，不能当作所有当前版本仍受影响的证据 |
| [Codex #52345](https://github.com/openai/codex/issues/52345)、[#50771](https://github.com/openai/codex/issues/50771) | 已有完成标准、知道未完成却结束；承认修正后没有行动 | 公开记录、成功控制案例、附件读取范围以及源码与部署未对应等细节统一保存在[连续性复核](2026-10-10-codex-continuity.md#c-知道目标与继续执行目标可能脱节) |

`needs_follow_up`、Stop hook 路径及后续相关修复的固定源码见[连续性复核](2026-10-10-codex-continuity.md#回合结束不等于完成用户目标)；它们说明可以在哪里观察续接，没有直接证明上述报告的部署根因。**[一手；研究：机制边界]**

## 恢复涉及哪些状态

这是原文用于区分恢复对象的状态表，属于设计分析，不是已运行的恢复实验。**[经验：设计]**

| 状态 | 例子 | 对应恢复载体或检查 |
|---|---|---|
| 用户目标与约束 | 兼容旧接口、不得发布 | 任务契约与后续变更 |
| 工作产物 | diff、生成文件、测试数据 | 文件系统、Git、制品存储 |
| 执行事实 | 测试运行、服务错误、已完成动作 | 日志、报告、外部操作回执 |
| 推理上下文 | 为什么放弃某种方案 | 有范围的交接摘要，必要时重新查证 |
| 活跃资源 | 进程、端口、浏览器、认证 | 重建与检查；旧 PID 不能证明存活 |

“记录存在但当前未加载”的实现反例见 [03 的实际运行反例](../03-context-engineering.md#43-实际运行中的反例)：激活标记不是路径规则或 Skill 正文仍在上下文中的证据。**[一手/社区：见该节来源；研究：解释]**

[SlopCodeBench 复核](2026-10-13-slopcodebench.md#4-代码留下了哪些信息没有自动留下)（2026-10-13，北京时间）保存固定 runner 依据：默认路径保留代码、重置会话、只给新规格，隐藏评分不反馈给 Agent。该页分别核查旧约束可恢复性和运行反馈可取得性，记录默认路径与实际 campaign 配置的对应缺口；据此无法直接推出日常项目必须部署记忆服务。**[一手：运行机制；研究：适用范围]**

## 工具、预算与权限：复用已有固定证据

不在本页复制完整技术审计，以下指向已维护的提交、版本、来源与读取范围。

| 主题 | 详细证据位置 | 原文需要保留的范围 |
|---|---|---|
| Codex app-server | [S4](2026-10-10-audit.md#s4--codex-app-server) | main 源码中区分关闭拒绝新工作、历史读取失败与历史耗尽；实验性 read-state 使用 `expectedRevision`，冲突后需重读。read-state 是线程已读状态，不能当作通用业务恢复数据库；最小发布版本未确认。**[一手]** |
| MCP 传输和结果 | [S5](2026-10-10-audit.md#s5--mcp-2026-07-28-规范) | **2026-07-28** 移除协议级会话和 SSE 消息重投，跨调用状态改用显式句柄；断流后重新发起请求不提供业务 exactly-once 保证。MRTR `input_required`、必需 `resultType` 及旧版缺字段兼容行为来自规范，未做客户端兼容性测试。**[一手；经验：业务含义推论]** |
| Hook 失败策略 | [S1](2026-10-10-audit.md#s1--claude-code-2129521296) 与 [06 返回值](../06-hooks-and-guardrails.md#返回值) | **2.1.295** 的 command/HTTP Hook 增加 `onFailure: "block"`；**2.1.296** 修复部分 managed hooks。Stop、SubagentStop、TaskCompleted、TeammateIdle 和 async 等有排除条件；原材料未做客户端实测，后续规则以 06 为准。**[一手]** |
| Auto Memory | [S3](2026-10-10-audit.md#s3--gemini-cli) | 源码文档标记实验性、默认关闭，patch/Skill 草稿进入 inbox 后由用户审阅；不能将 main 文档的全部功能归入某一安装版本。**[一手]** |

本仓库[独立 spec 与运行报告模板](../../templates/long-task/README.md)及[校验器](../../scripts/validate_task.py)只检查记录一致性：不执行检查、不打开证据、不证明证据真实、不阻止同时篡改 spec 与报告，也不是完整 agent harness。模板自己的“信任边界与坑”保留具体限制；其合成测试不是模型驱动恢复实验。**[经验：实现范围]**

## 请求超时、重试与整项任务截止时间

核实：2026-10-16（UTC+8）；对应 [16 §4.5](../16-building-agents.md#45-安全与成本)，20 §7 仅交叉引用。改变的选择是：需要总耗时上限时，先核现有执行环境的总时限／取消覆盖范围，而不是仅缩短 SDK 请求超时或增加重试。**[研究：采用判断]**

**版本先于字段名。** [官方 Python SDK 文档](https://developers.openai.com/api/reference/python)当前使用 `httpx2.Timeout`；[v3.31.0 发布](https://github.com/openai/openai-python/releases/tag/v3.31.0)为 2026-10-14，固定提交 `86cae50785fb7b7bf2a5d2383370b214b304acd2`。[依赖文件](https://github.com/openai/openai-python/blob/86cae50785fb7b7bf2a5d2383370b214b304acd2/pyproject.toml)要求 `httpx2>=2.12.0,<3`；[默认值](https://github.com/openai/openai-python/blob/86cae50785fb7b7bf2a5d2383370b214b304acd2/src/openai/_constants.py)为 `Timeout(600, connect=5)`、`max_retries=2`。本轮另读 HTTPX2 [v2.13.1](https://github.com/pydantic/httpx2/releases/tag/v2.13.1)，固定提交 `d91c9f4236523eb5978ca800944fa0078f17409f`：它是满足该依赖范围的一份具体传输实现，不证明所有安装都使用它，也不能用旧 HTTPX 文档冒充当前 SDK 依赖。**[一手：发布、依赖与固定源码]**

| 范围 | 已核契约与实现 | 读者不能据此推定什么 |
|---|---|---|
| 单次阶段等待 | [HTTPX2 超时文档](https://pydantic.dev/docs/httpx2/advanced/timeouts/)区分连接、读取、写入及连接池等待；read 限制等待下一块数据。[Timeout 实现](https://github.com/pydantic/httpx2/blob/d91c9f4236523eb5978ca800944fa0078f17409f/src/httpx2/httpx2/_config.py)把单个数值赋给各阶段；[同步 HTTP/1.1](https://github.com/pydantic/httpx2/blob/d91c9f4236523eb5978ca800944fa0078f17409f/src/httpcore2/httpcore2/_sync/http11.py)读循环重复传入 read timeout，[socket 后端](https://github.com/pydantic/httpx2/blob/d91c9f4236523eb5978ca800944fa0078f17409f/src/httpcore2/httpcore2/_backends/sync.py)逐次设置超时后读取 | 持续收到数据时，总时长可以超过 read timeout；网络数据到达也不等于任务有有效进展。**[一手；研究：推论]** |
| SDK 请求重试 | [固定请求实现](https://github.com/openai/openai-python/blob/86cae50785fb7b7bf2a5d2383370b214b304acd2/src/openai/_base_client.py)在 `max_retries+1` 次尝试内重新复制选项、构建请求；超时且请求体可重放才继续。退避在发送之外等待，本地指数退避带 jitter、上限 8 秒；支持的服务端 Retry-After 可到 120 秒 | 重试次数不是总时限；不能用 `timeout×3` 算硬上限，也不能把请求体可重放当业务幂等保证。**[一手；研究：边界]** |
| 流迭代 | 成功响应离开请求重试循环后才交给响应处理；[固定 Stream／AsyncStream 实现](https://github.com/openai/openai-python/blob/86cae50785fb7b7bf2a5d2383370b214b304acd2/src/openai/_streaming.py)把迭代读取的超时／连接错误归一为 SDK 异常，没有重新进入上述请求重试循环 | “默认超时重试两次”不保证流中途断开后自动续流或重放，更不保证整轮业务工具操作重试。**[一手：实现范围]** |
| 整次 HTTP 请求的对照 | [Go net/http Client.Timeout](https://pkg.go.dev/net/http#Client)包含连接、重定向和响应体读取，`Do` 返回后仍可中断 Body 读取 | 不能把所有名为 timeout 的设置都说成 inactivity；该契约仍不自动覆盖应用后来发起的请求和工具步骤。**[一手；研究：对照]** |

已回读 OpenAI Python main 为 [`9998c1a3806afda55cb3923de1f7f49adcff5a7f`](https://github.com/openai/openai-python/commit/9998c1a3806afda55cb3923de1f7f49adcff5a7f)（2026-10-15），相关请求重试与流异常处理边界仍可见；正文依据以上已发布版本，不把 main 的其他能力当发行能力。**[一手：版本核对]**

采用边界：检查现有总时限是否覆盖重试等待、流消费和工具步骤；已覆盖就复用，不为此另写计时框架。总时限触发后的结果核对仍沿用 [20 §9](../20-codex-long-horizon.md#9-超时后动作究竟发生了吗)。本轮仅阅读文档与源码，未安装或运行 SDK／真实客户端，未调用模型、测量延迟或费用；这些来源不能说明 Codex／dot 的实际产品停止行为，也不能解释本仓执行服务异常的原因。**[研究：采用与验证边界]**

## 待运行实验矩阵

以下是原文保留的实验设计，尚未成为真实模型或跨会话运行结果。**[经验：实验设计]**

| 实验 | 负面样例 | 判定 |
|---|---|---|
| 恢复 | 写完未测、测试失败、测试通过后又改代码、进程终止或活跃资源失效 | 不用旧绿灯宣称新版本完成 |
| 验收 | 缺 ID、只测快乐路径、零测试、skipped、输出截断 | 明确 incomplete/blocked |
| 子任务 | 仅进度、迟到、失败、结果未收集 | 必要结果未验证前不收尾 |
| 权限 | 目标变了、授权过期、外部写结果未知 | 先核对，不重放危险动作 |
| 成本 | 单 agent、分组读、逐项 reviewer | 同任务、同预算、记录质量与成本 |
| 技能 | 正例两种说法、近邻反例、旧版本配置 | 分开测发现、触发、执行、结果 |

已运行证据的类型是仓库确定性检查和模拟引擎回归，实际记录见 [19](../19-experiments.md)；表中真实模型、跨会话实验仍待执行。恢复设计还需覆盖并发文件修改、旧记忆中的失效命令；检查输出须读取完整报告并保留原退出码，不能据输出尾部猜通过。**[经验：验证范围与剩余问题]**

## 失败压缩的提交边界

> 核实：2026-10-14 14:30 UTC。主线三；改变 20 §4：失败摘要不能代替原结果，恢复前区分响应完成、历史替换和持久化；不新增检查点框架。**[研究：采用判断]**

### 固定修复与回归覆盖

官方 [PR #53932](https://github.com/openai/codex/pull/53932) 于 2026-10-14 09:44 UTC 合并，固定 SHA `400f2356d60c4663d46817a40b4d09c5c86f35ad`。[compact.rs L826–920](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/src/compact.rs#L826-L920) 的旧非 PostTurn 路径在 `OutputItemDone` 就记录压缩输出；修复后先缓冲，收到 `Completed` 才记录，因此断流或 incomplete 的部分摘要不再进入后续模型输入。这修的是本地压缩响应流的历史污染，不是解释器重置、历史序号投影或工具输出截断。**[一手：固定源码与补丁]**

- [断流／重启回归 L1311–1416](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/tests/suite/compact.rs#L1311-L1416)：先执行产生 `ORIGINAL_TOOL_RESULT` 的命令，压缩输出部分摘要后断流；正常续接和 restart 后再压缩的输入，都须保留相同的原消息与工具调用／结果，断流时原 token usage 不变。**[一手：测试定义，未运行]**
- [incomplete 回归 L1161–1307](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/tests/suite/compact.rs#L1161-L1307)：原超大历史仍超限，下轮仍须压缩，且不包含 `DISCARDED_INCOMPLETE_SUMMARY`。带 usage 的 incomplete 会被单独记账，因此不能把“摘要丢弃”解释为请求未发生或不耗额度。**[一手：测试定义与实现，未运行]**
- [成功路径 L1525–1636](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/tests/suite/compact.rs#L1525-L1636)：成功输出在响应完成通知前可观察，且带 compaction metadata 写入 rollout。该正常路径断言不覆盖任意磁盘故障或突然终止。**[一手：测试定义，未运行]**

### 反证：响应完成不是持久化事务成功

同一 SHA 的 [session/mod.rs L4322–4382](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/src/session/mod.rs#L4322-L4382) 先替换 live history，再调用持久化；[L4745–4754](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/src/session/mod.rs#L4745-L4754) 对追加失败记录错误并返回 false。因此 #53932 不能被写成完整原子落盘修复，也不能用响应完成事件证明恢复后的磁盘记录一定完整。**[一手：固定源码；研究：边界]**

采用动作：失败时保留原数据，核对实际后端版本，再通过正常续接／恢复检查原消息与工具结果；有原结果就先复用和核对，不因压缩失败重跑外部写入。出现持久化错误、恢复缺项或工具结果未知时，仍按 20 §9 重读当前产物、查权威操作状态后决定重试。修复不验证摘要的语义正确性，也不承诺任意取消／崩溃都恢复成功。**[经验：由机制推导的建议]**

### 发布边界与实际验证范围

本轮读取[官方发布列表](https://github.com/openai/codex/releases)：最新稳定版 [0.162.1](https://github.com/openai/codex/releases/tag/rust-v0.162.1) 发布于 10 月 9 日，最新预发布 [0.163.0-alpha.11](https://github.com/openai/codex/releases/tag/rust-v0.163.0-alpha.11) 发布于 10 月 14 日 03:27 UTC，早于本修复合并。另直接读取两个 tag 的 [稳定版 compact.rs](https://github.com/openai/codex/blob/rust-v0.162.1/codex-rs/core/src/compact.rs) 与 [预发布 compact.rs](https://github.com/openai/codex/blob/rust-v0.163.0-alpha.11/codex-rs/core/src/compact.rs)，均仍有旧的非 PostTurn 立即记录分支；同期 main 已有缓冲修复。不能建议“升级当前最新版即可解决”，也没有建立 Desktop 部署对应。后续采用前须重新核对发布内容与实际运行后端。**[一手：发布元数据与 tag 源码；研究：采用边界]**

已完成固定补丁、实现、回归断言和两个 tag 的只读核查；没有安装或运行 Codex、模型、上游 Rust 回归，也没有读取私人会话或用量。测试使用 mock 响应且有 `skip_if_no_network`，测试存在或 PR 已合并不等于本轮执行通过；没有另做只能重复控制流的模拟实验。**[研究：验证范围]**

## 2026-10-15：按故障选择压缩、清空与停止检查

> 核实日期：2026-10-15（UTC+8）。改变 [17 §2.1、§2.6、§2.8](../17-troubleshooting.md)：撤回默认清空、交接替代压缩及“强制执行必然完成”的暗示；06 只补停止事件边界。**[研究：采用判断]**

| 一手来源（本轮读取正文） | 改变选择的新证据 | 反证与边界 |
|---|---|---|
| [Troubleshooting：auto-compaction thrashing](https://code.claude.com/docs/en/troubleshooting#auto-compaction-stops-with-a-thrashing-error) | 压缩成功后仍可被大文件／工具输出立即填满；应缩小读入、定向压缩或隔离调查。清空后复发须区分 Messages 与启动项占用 | 这是成功压缩后的再填满，不是上一节 Codex 失败压缩的部分摘要污染；同样表现为“打转”不等于同一根因 |
| [Best practices：纠偏](https://code.claude.com/docs/en/best-practices#course-correct-early-and-often)与[上下文管理](https://code.claude.com/docs/en/best-practices#manage-context-aggressively) | 保留反复纠正错误思路后清空重来的建议；同一任务仍可定向压缩 | 没有据此把清空或交接设成通用恢复默认；次数建议不证明根因 |
| [Goal：评估机制](https://code.claude.com/docs/en/goal#how-evaluation-works)与[要求](https://code.claude.com/docs/en/goal#requirements) | 会话级 prompt 型 Stop Hook，评估器依赖已展示证据，不独立检查文件或执行命令 | 工作区信任和 Hook 设置可使功能不可用；本轮未确认首次支持版本，不能套用 Codex 的版本号或承诺全部模型／客户端支持 |
| [Hooks：Stop](https://code.claude.com/docs/en/hooks#stop)与[StopFailure](https://code.claude.com/docs/en/hooks#stopfailure) | API 错误走 StopFailure 而非 Stop；输出／退出码无继续决策权 | terminalSequence 是显示例外；应用自身的恢复动作与 Hook 返回值控制续跑是两件事，不能由此推断 `/goal` 自身绝无重试 |

### 07 采用入口补核：续接不等于验收或硬限额

2026-10-15（UTC+8）重读当前官方 [Goal](https://code.claude.com/docs/en/goal)，新增核对停止、成本与恢复段落；据此收窄 07 §1 的“约束强度”阶梯，不重复 §6–7 已完成的 Ralph／harness 比较。**[一手：文档；研究：修订范围]**

- **退出不等于完成**：[评估机制](https://code.claude.com/docs/en/goal#how-evaluation-works)除 met，还有 impossible；[需处理的错误](https://code.claude.com/docs/en/goal#errors-you-have-to-fix-clear-the-goal)也能清除目标。读者须核停止原因与项目证据，不能看目标消失就收货。
- **边界由谁执行**：[条件编写](https://code.claude.com/docs/en/goal#write-an-effective-condition)中的轮数／时间条款由模型依据会话判断，不是确定性硬限额；[恢复说明](https://code.claude.com/docs/en/goal#resume-with-an-active-goal)还说明恢复 active goal 时轮数、计时与 token-spend baseline 重置，不能拿这一会话显示代替跨恢复累计预算。
- **额外成本**：[评估模型与成本](https://code.claude.com/docs/en/goal#evaluation-model-and-cost)明确评估 token 另按配置的小模型计费；即使官方称通常相对主轮次很小，也不能推导整套续接工作流省钱，因为后续实现、验证与审阅仍有成本。

这些来源是功能契约，不是本仓库对模型判定、费用或取消路径的实测；官方也提供清除目标与暂停路径，不能反向说它只能无限续跑。07 因而仅在明确验收下仍提前收尾时试用，已有可靠闭环就保持原流程；硬预算沿用执行环境真正提供的控制，不另建框架。**[一手；经验：采用与撤回]**

07 其余入口仅消除既有主专题冲突：§8 的“两次错误／第三次粘贴”不再自动触发常驻配置或 Skill，沿用 03／05 的增量与成本判断；§9 不按纠正次数清空，也不把全部文字规则搬成 Hook。重读[官方最佳实践](https://code.claude.com/docs/en/best-practices#course-correct-early-and-often)可见次数仍是其经验建议，不是因果证据。当前[完整命令表](https://code.claude.com/docs/en/commands)未列 `/handoff`，故 §3.5 撤回无来源的 HN 偏好推荐，改为按交接需要使用现有记录及普通提示；这不证明任何自定义扩展都不存在该命令，也不要求读者放弃已验证的扩展。**[一手：读取范围；经验：入口一致性]**

历史反证保留：17 原有依据包括 [Chroma《Context Rot》](https://research.trychroma.com/context-rot)（2025）关于输入增长与表现下降的研究，以及 [Claude Code changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 2.1.293 所记的压缩后时序误判修复：把压缩前完成的动作当成压缩后发生，继而撤回或重复已有工作。两者提醒读者，缩小输入并不能排除真实的信息损失或压缩语义缺陷；本轮从正文移至此处保留，没有重新核实这两项历史来源，也不据旧修复断言当前全部压缩故障已消失。**[研究：历史研究；一手：原有 changelog 引用；经验：反证边界]**

采用判断：保留 20 的已有恢复记录建议，不新建框架；需要腾空间先控制输入，错误思路累积再清空，执行失败先查原结果与外部状态。最低版本未确认处只写当前官方文档，不推断发布范围。**[经验：综合建议]**

本轮只读官方页面并修改文档；未安装或运行 Claude Code、真实模型、引擎或恢复实验。仓库离线检查仅用于链接目标、配置及确定性回归，不证明上述恢复建议的模型效果。**[研究：验证边界]**


## 循环采用核查：续接、重置与新增反馈

> 核实：2026-10-15（UTC+8）；对应 07 §6–7。只读公开源码、测试定义与作者原文，没有运行客户端、模型或上游脚本。本节只补原记录未核对的具体采用边界；通用的自报不等于验收、未知结果先对账继续由 20 维护。

### 1. 官方同会话循环不等于每轮重置

[官方 marketplace 固定提交 `c2bdb42`](https://github.com/anthropics/claude-plugins-official/tree/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/ralph-loop) 的 [stop-hook.sh](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/ralph-loop/hooks/stop-hook.sh) 读取同一项目状态及 transcript，匹配 promise 或检查迭代上限，否则返回 `decision: block` 并重送原提示。它不启动新 CLI，也不运行项目测试。故不能把社区 fresh-context 经验直接归给该插件。**[一手：固定源码]**

采用前还应区分“有上限参数”和“终止路径可靠”：[#5605](https://github.com/anthropics/claude-plugins-official/pull/5605) 核实时仍 open、未合并；其 head [`a310cc1` 的七项回归](https://github.com/anthropics/claude-plugins-official/blob/a310cc1ae637b67ba7fd14c6f5c21e97d07d48d0/plugins/ralph-loop/tests/stop-hook.test.sh) 用合成 transcript／状态文件检查裸词误完成、promise 空白不对称、无空格计数不增长，以及合法标签、正常增长与上限对照。已读 main 仍保留相应旧分支。测试作者报告七项通过，本文只读定义，未复跑；即使这些修复通过，也没有检验生成代码或业务验收。不要将 PR 存在写成已发布修复，也不把这些受特定输入触发的问题推成所有运行必然失败。**[一手：PR／测试；研究：范围]**

### 2. 不同作者的实际采用链与反证

| 作者与任务 | 可核对的链 | 改变采用判断的限制 |
|---|---|---|
| hironori-maruoka，10×20 浏览器表格，公式、依赖重算与环检测 | [2026-01-30 原文](https://developer.mamezou-tech.com/en/blogs/2026/01/30/kiro_cli_ralph/) → [`47b0652` 的循环脚本](https://github.com/hironori-maruoka/kiro-ralph/blob/47b0652978540f56ff2c7e56d485ba6e2ef92e39/afk-ralph.sh) 每轮启动 Kiro CLI、读规格与进度 → [引擎测试](https://github.com/hironori-maruoka/kiro-ralph/blob/47b0652978540f56ff2c7e56d485ba6e2ef92e39/spreadsheet-sample/tests/engine/engine.test.ts) 包含链式更新、错误传播、打破循环后恢复数值 | 脚本以任务勾选和 promise 退出，不独立运行测试；作者观察到进度文件位置漂移，并限制会挂起的 watch／交互命令。博客报126 tests，但同提交 [PROJECT_COMPLETE](https://github.com/hironori-maruoka/kiro-ralph/blob/47b0652978540f56ff2c7e56d485ba6e2ef92e39/spreadsheet-sample/PROJECT_COMPLETE.md) 报115，故不引用统一通过数或称本仓复测。无普通会话基线。**[社区：作者运行；一手：源码／测试]** |
| Johannes Barop，Ralph 台词浏览／投票应用 | [作者原文](https://www.codecentric.ai/en/knowledge-hub/blog/the-ralph-wiggum-loop-autonomous-code-generation-with-a-fresh-context) → [`ee5d9d1` 的循环](https://github.com/jbarop/unpossible-app/blob/ee5d9d1499d432eb99597f6c849b7e95fa200ce6/ralph-wiggum-loop.sh) → [prompt](https://github.com/jbarop/unpossible-app/blob/ee5d9d1499d432eb99597f6c849b7e95fa200ce6/prompt.md) 要求读规格、选择待办、测试后提交 | 作者报告得到能用的应用；脚本实际只 grep 计划中的完成句，或到50次停止；测试由提示要求，非脚本验收。逐阶段新进程是其实现选择，没有同任务不重置对照，不能证明普通会话不足。**[社区：作者运行；一手：固定脚本]** |

两条链来自不同作者、不同应用，可支持“能这样做”，不能支持“应当这样做”。两份脚本还使用宽权限参数，本文不复制其授权做法。测试存在、作者自述与当前部署结果分开；本轮未启动应用，也没有取得独立使用者的后续维护数据。**[研究：横向判断]**

补充撤回范围：[Konstantin Burkalev 的两个月使用复盘](https://blog.ksdaemon.com/dev/my-take-on-ralph-loop/) 明确把按钮／小端点留给普通提示，且其循环任务完成后仍需大量审阅与修改。它是作者经验，未提供对应任务的公开前后补丁和工时原始表；不采纳其 1.6–1.8 倍估计为效果证据，也不将其按任务大小的门槛升级为通则。这里只支持把审阅与返工纳入采用成本。**[社区：自报；研究：采用边界]**

### 3. 历史 harness 自己已经撤去哪些环节

[Prithvi Rajasekaran，2026-03-24](https://www.anthropic.com/engineering/harness-design-long-running-apps) 的原文比 07 旧摘要更有条件性：Sonnet 4.5 的上下文焦虑促成重置；Opus 4.5 已可使用连续会话和自动压缩；4.6 再取消 sprint，并把评价改为整轮构建后进行。保留评价的实质证据是 DAW 的拖动／录音等交互缺口仍会被发现，而非任务数量。作者还报告大幅删减一度损害结果，随后改为逐项移除；这也反对一口气取消所有检查。**[一手：历史作者实验]**

早期游戏制作器比较同时改变预算、规划范围和评价结构；后续 DAW 又换了模型与任务，不是受控消融。没有据此推定“现在只需最终评审”，也不将作者扩展产品范围的偏好等同用户想要更多功能。**[研究：外推边界]**

### 4. 本轮收敛的选择

- 普通会话已能实现并验证：不安装循环，不为“任务长”自动切会话
- 有明确可继续工作却停止：先核对停止原因，再试有上限、可取消的续接；原有[提前停止案例](2026-10-10-codex-continuity.md)说明缺口可能存在，但尚未证明 Ralph 能修复该客户端故障
- 连续上下文确实失效：才试新会话＋最小恢复信息，不能用同会话 Stop 插件代替重置
- 结果有可观察缺口：补会带来新证据的检查；反复催促、重复同一判断或预算用尽不算质量提升
- 模型／任务变化：一次移除一个可选环节，保留风险所需的中间契约与检查；只有现实缺口消失才撤回，不预设固定轮数

以上为 **[经验：条件建议]**，不是新的模型效果实验。后续若获准对照，应固定目标质量与范围，分别比较普通会话、同会话续接和新进程循环，纳入未完成行为、误报完成、返工及人工审阅成本；当前不执行。


## 续接提交前检查分支与本地基线

> 核实：2026-10-16（UTC+8）。对应20 §9与运行手册 §4.5；只补本地续接的前置条件，不新增检查框架。**[经验：采用范围]**

**观察与发布状态分开**：公开提交 [`a8f70dc`](https://github.com/dbvv1/a1dbv/commit/a8f70dc) 与本地原提交 `d93ca2a` 同父，tree 均为 `44f3fd1b762f507a2fe0f1868f981b7b12181361`。本地续接又产生 `2d4598b`，其父为 `d93ca2a`，只新增 TASKS 的一个空行和同义状态段；这个重复提交未发布。核对远端已发布内容后，保留原本地分支并从远端成果继续，没有改写已发布历史。可用 `git show -s --format='%h %p %T %s'` 与 `git diff <commit>^ <commit>` 核对对象和增量；本地未发布对象不保证在公开克隆中可取得。以上只证明该次内容与提交关系，不推断续接原因或用户取消。**[经验：单仓Git对象与发布核对]**

**改变的选择**：仅靠发布时远端CAS，不能阻止本地先做出重复提交。开始操作时保存预期分支与HEAD，恢复及暂存／提交前对照；不同或缺失先对账，不能在异常后重新采当前值让旧操作通过。原成果已发布且没有实质增量则不重做；需要新工作时，先确认新范围再建立新基线。下例只检查普通单父提交；整合提交须按整合计划核对父集合。**[经验：条件建议]**

以下在独立临时仓库、已安装Git下离线运行；没有访问原会话、凭据，也没有运行模型或引擎。代码仅构造Git状态，不重放原执行过程：

```sh
set -eu
repo=$(mktemp -d)
git -C "$repo" init -q -b task
git -C "$repo" config user.name offline-check
git -C "$repo" config user.email offline@example.invalid
printf 'base\n' > "$repo/content"
git -C "$repo" add content
git -C "$repo" commit -qm base
expected_branch=$(git -C "$repo" symbolic-ref HEAD)
expected_head=$(git -C "$repo" rev-parse HEAD)
check_base() {
  test -n "$expected_branch" && test -n "$expected_head" &&
  test "$(git -C "$repo" symbolic-ref -q HEAD)" = "$expected_branch" &&
  test "$(git -C "$repo" rev-parse HEAD)" = "$expected_head"
}
git -C "$repo" switch -qc other
if check_base; then exit 1; fi
test "$(git -C "$repo" rev-parse HEAD)" = "$expected_head"
echo 'same-HEAD/wrong-branch: rejected'
git -C "$repo" switch -q task
printf 'work\n' >> "$repo/content"
check_base
git -C "$repo" add content
checked_tree=$(git -C "$repo" write-tree)
check_base
git -C "$repo" commit -qm work
test "$(git -C "$repo" rev-parse HEAD^)" = "$expected_head"
test "$(git -C "$repo" rev-parse HEAD^{tree})" = "$checked_tree"
echo 'normal-path: passed; parent/tree: matched'
original=$(git -C "$repo" rev-parse HEAD)
printf 'redundant status\n' > "$repo/status"
if check_base; then exit 1; fi
test "$(git -C "$repo" rev-parse HEAD)" = "$original"
test -z "$(git -C "$repo" diff --cached --name-only)"
test -f "$repo/status"
echo 'advanced-HEAD: rejected; HEAD/index unchanged; work preserved'
published=$(printf 'counterpart\n' | git -C "$repo" commit-tree "$checked_tree" -p "$expected_head")
test "$published" != "$original"
test "$(git -C "$repo" rev-parse "$published^{tree}")" = "$checked_tree"
echo 'different-commit/same-tree: confirmed'
expected_head=''
if check_base; then exit 1; fi
echo 'missing-expected-HEAD: rejected'
```

实际输出（退出码0）：

```text
same-HEAD/wrong-branch: rejected
normal-path: passed; parent/tree: matched
advanced-HEAD: rejected; HEAD/index unchanged; work preserved
different-commit/same-tree: confirmed
missing-expected-HEAD: rejected
```

**边界**：相等检查不是原子锁，检查后仍可能发生并发checkout／commit；因此不替代串行整合、受检树核对、发布前的父提交核对或远端CAS。同HEAD下的语义重复也可能通过；提交不同而tree相同只说明快照相同，须结合原操作和发布回执判断是否已交付。未测真实客户端恢复、失败率或节省时间，不声称机制已防住所有重复。**[经验：确定性检查及局限]**


## 16 页历史页头

历史原文转存：2026-10-16（UTC+8），来自 `docs/16-building-agents.md` 的原页头。以下保留当时的核查日期、范围和来源说明；相对链接以原页面路径为基准，不表示本次重新核实。

```text
> 核实时间：2026-10-16（UTC+8）补请求超时范围；2026-10-15（UTC+8）局部复核 SDK／托管选型、配置、缓存、预算与程序化工具调用；方案概览基线为 2026-10-08。2026-10-15 完成全文核心建议独立审阅，补 outcomes 终止条件并归一模型价表入口；不代表真实 SDK 或模型效果已验证。
> 依据 **[一手]**：
> - Anthropic：Claude API 官方 Skill（随 Claude Code 2.1.294 分发）中的方案比较、Agent 设计和 Managed Agents 文档；克隆查看了 [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)；
> - OpenAI：developers.openai.com 的 [Agents](https://developers.openai.com/api/docs/guides/agents) 和 [Decisions](https://developers.openai.com/api/docs/guides/decisions) 指南，learn.chatgpt.com 的 [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk)、[app-server](https://learn.chatgpt.com/docs/app-server)、[codex exec](https://learn.chatgpt.com/docs/non-interactive-mode)（Markdown 版）；
> - Google ADK、AWS Strands、OpenAI Agents SDK 的仓库（只确认了活跃度，2026-10 都有提交）。
>
> 前面的章节讲“怎么用现成的 Coding Agent”。这一篇讲**什么时候该自己搭**，以及各家的搭建方式。

```


## 完成状态正确，已完成动作仍可能被重新执行

核实：2026-10-16（UTC+8）。主线三／M4；改变20的恢复验收：扩大嵌套委派或更换续接入口时，核已完成动作是否重做，不只核最终状态。此项不同于请求超时、结果未知后的重试。[研究]

- **使用报告与复测分开。** [#9106](https://github.com/langchain-ai/langgraph/issues/9106)报告嵌套工具逐项审批后的外部重复记录；公开最小复现用计数器。另一个参与者的[跨进程复测](https://github.com/langchain-ai/langgraph/issues/9106#issuecomment-5908176242)使用持久 checkpoint 与独立 SQLite 副作用表，逐次正常退出再启动；它支持该合成案例跨进程发生，不证明真实 API、崩溃窗口或并发恢复的 exactly-once。[社区：报告与复测者自报]
- **固定修复与正常重入分开。** [b0482d0](https://github.com/langchain-ai/langgraph/commit/b0482d0627ec8fdf7c91fba7ffd17403583c59d0)于北京时间2026-10-16 03:51合入，区分最新 checkpoint 的续接、主动 time travel 和已被推进的旧 checkpoint。[实现](https://github.com/langchain-ai/langgraph/blob/b0482d0627ec8fdf7c91fba7ffd17403583c59d0/libs/langgraph/langgraph/pregel/_loop.py#L943-L973)不再只据键存在决定重放。正常 interrupt 恢复仍从未完成节点开头进入，见[契约](https://github.com/langchain-ai/langgraph/blob/b0482d0627ec8fdf7c91fba7ffd17403583c59d0/libs/langgraph/langgraph/types.py#L906-L925)；不能要求每个节点只进入一次。[一手：固定源码]
- **计数位置决定验收含义。** [test_pregel](https://github.com/langchain-ai/langgraph/blob/b0482d0627ec8fdf7c91fba7ffd17403583c59d0/libs/langgraph/tests/test_pregel.py#L7737-L7853)新增 interrupt 后的 answered 计数，两个子图的 human、dolphin 各应为2；另一些测试在 interrupt 前计数，包含合法重新进入，不能把它当副作用次数。[主动回放反例](https://github.com/langchain-ai/langgraph/blob/b0482d0627ec8fdf7c91fba7ffd17403583c59d0/libs/langgraph/tests/test_time_travel.py#L1180-L1214)仍要求重新提问。[一手：测试定义，未运行]
- **测试回执不跨树继承。** [11例复测报告](https://github.com/langchain-ai/langgraph/pull/9315#issuecomment-6200581015)针对05379f4c、内存 checkpointer、同步图 API 和合成副作用；最终合并树还包含额外的 main 整合；回执指向整合前的提交，不据此推定实际测试与整合的先后。它不是最终合并树、完整 pytest 矩阵或生产环境通过的证明。[社区]
- **合入不等于已发行。** 所核[1.2.15 release](https://github.com/langchain-ai/langgraph/releases/tag/1.2.15)先于补丁，其[08a3456源码](https://github.com/langchain-ai/langgraph/blob/08a345637fb2bd499f69c90056a22c478a468817/libs/langgraph/langgraph/pregel/_loop.py#L352)仍按 checkpoint_id 键存在判断 replay；不能建议升级该版即可解决，也未在本仓运行该版复现。根图某个入口正常不能覆盖显式当前 head ID 等其他入口。[一手／研究]

**采用判断。** 复用现有执行记录与原生恢复机制，先核实际安装版本和续接入口；业务去重仍由真正执行动作的一层承担。只读任务或已有足够验收的未变流程不因此增加框架。此次只读公开源码、原帖、测试定义与发行元数据，未运行模型、LangGraph、外部 API 或上游测试；下一有价值证据是发行后在原触发条件下的接收方复测，不继续堆相同模拟变体。[研究]


## 可选子任务可降级，必要验收换执行者

核实：2026-10-17（UTC+8）。主线三／四，M3／M4；改变20 §5的失败处置：不把所有子任务都当阻断条件，也不把失败当通过。沿已有发布工作流借用分支选择，不推荐整套框架，不重复§9的未知写入对账。[研究]

**同一工作流已有不同可行解。** gstack [#2772](https://github.com/garrytan/gstack/pull/2772)于2026-09-01合并为`0d1bd5616c0ef096bb7ccee336f63c60ee408618`，版本文件／变更记录标1.79.0.0；其模板按缺失结果的用途处理：[一手：合并、固定模板]

- **必要检查换执行者。** [覆盖审计L23](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/ship/sections/test-coverage.md.tmpl#L23)要求先停仍运行的子任务，再由父任务内联审计；[计划完成审计L17–23](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/ship/sections/plan-completion.md.tmpl#L17-L23)沿同一分类逻辑接管，父任务仍失败则须明示选择，默认停止修复。源码允许用户另行选择跳过并记录，不是Agent自行把失败改成通过。[一手；研究：采用边界]
- **可选补充允许缺席，但不能仍有写入者。** [文档同步L30–39](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/ship/sections/pr-body.md.tmpl#L30-L39)允许省略PR的Documentation段并标未完成；恢复前先停止共享工作树的子任务，停不掉则再等一段，仍在运行就停整次ship。已产生提交须检查整个新增序列，只要祖先含非允许文件就不推；未提交内容保留。这里的可选项是该流程的文档同步，不能推广为迁移说明、使用者必需文档或任意验收均可省略。[一手；研究]
- **仅在父任务分支写“不可用”仍会漏错。** 同版[Greptile L13–24](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/ship/sections/greptile.md.tmpl#L13-L24)虽给派发失败设UNAVAILABLE，却让子任务把API错误、无PR与零评论都返回`total:0`，父任务随后静默跳过。因此降级判定必须从子任务结果契约一直到交付记录区分失败与成功空结果。[一手：历史模板反例；研究：不是实际运行复现]

**后续修改已修历史反例，不把旧错当现状。** [#3057](https://github.com/garrytan/gstack/pull/3057)已合并为`28f1385eac65cab592fe267956f07b205271df1b`（2026-10-06，版本标1.91.32.0）。[修订模板L29–46](https://github.com/garrytan/gstack/blob/28f1385eac65cab592fe267956f07b205271df1b/ship/sections/greptile.md.tmpl#L29-L46)分别返回`complete/no_pr/unavailable`，未知／缺失状态按不可用；只在成功抓取后允许报告零评论，并要求确认运行中子任务已停。当前核对的[f47321e6模板](https://github.com/garrytan/gstack/blob/f47321e6158f37d1393d8e58d5725fb161cc8ffa/ship/sections/greptile.md.tmpl)仍保留该区分。[一手：固定源码与PR元数据]

**证据不能升级成超时保证。** #2772自报派发与正常doc-sync E2E通过，但明确列出“仍被后台化后的deadline恢复”“再次push拒绝”“Greptile unavailable”三条未做E2E的分支。其[测试L90–101](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/test/run-in-background-guidance.test.ts#L90-L101)只钉住恢复／scope字符串；约10分钟是返回后台launch metadata之后的提示约定，不是可打断前台调用的watchdog。模板要求停止不等于已证实停止后没有遗留进程写入。此次未运行客户端、模型、上游测试或恢复实验，未取得故障注入恢复及接收方完整重试回执。[一手：测试定义；社区：作者测试报告；研究：范围]

**借用分支判断，不照抄宿主字段。** 后续[f67c478f的共享派发规则L222–228](https://github.com/garrytan/gstack/blob/f67c478f05d8e0b39339599ad11c91a3478515ae/scripts/resolvers/constants.ts#L222-L228)已改成参数存在才请求前台，收到launch receipt就等完成通知；[官方当前说明](https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background)也区分fork模式与非交互入口。无需关闭宿主控制来迁就旧模板。[一手；研究]

**采用与后续。** 按[20 §5](../20-codex-long-horizon.md#5-子任务应缩短关键路径不应制造评审树)分流；原验收要求独立审阅时，父任务内联接管不能替代独立执行者。后续追真实失败分支的停止／恢复及最终交付回执；作者“第三次复发”或合并数量不作可靠性统计。[研究]


## 跨执行者派发：先保证任务身份可重新发现

核实：2026-10-17（UTC+8）；主线三／四，M4。改变 20 首表及 §5 的派发选择：发送前核对回执丢失后能否用双方已知的身份找到同一任务；§9 已有“结果未知先查再重试”，本节补的是能够查询的前提，不新增状态机或模板。[研究]

**实际故障与合并范围。** [CAO #447](https://github.com/awslabs/cli-agent-orchestrator/issues/447)报告 Codex 的 600 秒 MCP 截止早于 900 秒 handoff 等待，worker 可能继续；重复派发有重复工作的风险。[#453](https://github.com/awslabs/cli-agent-orchestrator/pull/453)于 2026-09-19 合入 `9233416d22e52027a4a129c11a6a3aa1b2bc7cac`，增加结果保存与查询，但明确保留早期 ID 交付缺口；issue 关闭不能作为完整恢复回执。[社区：原始故障；一手：PR 及固定实现]

- [固定 `orchestration.py` L932–964](https://github.com/awslabs/cli-agent-orchestrator/blob/9233416d22e52027a4a129c11a6a3aa1b2bc7cac/src/cli_agent_orchestrator/utils/orchestration.py#L932-L964)：[L1244](https://github.com/awslabs/cli-agent-orchestrator/blob/9233416d22e52027a4a129c11a6a3aa1b2bc7cac/src/cli_agent_orchestrator/utils/orchestration.py#L1244) 在内部生成随机 `job_id`，HTTP 等待为 `timeout + 180` 秒；该超时分支等待内部 HTTP 截止后才返回 `pending` 及 ID。provider 先断开时，持久化结果可能存在，调用方却没有查询身份。源码注释明确把此缺口留给 #715。[一手：固定源码]
- [固定 `agent_step.py`](https://github.com/awslabs/cli-agent-orchestrator/blob/9233416d22e52027a4a129c11a6a3aa1b2bc7cac/src/cli_agent_orchestrator/services/agent_step.py)在提取结果后、清理 terminal 前尝试保存；[测试 L594–668](https://github.com/awslabs/cli-agent-orchestrator/blob/9233416d22e52027a4a129c11a6a3aa1b2bc7cac/test/services/test_agent_step.py#L594-L668)既断言保存先于删除，也明确规定保存失败仍清理并返回成功。因此该提交是 best-effort 保存，不能称 crash-safe 交接；未确认首个发行版本或当前部署行为。[一手：实现与测试定义；研究：范围]
- [#715](https://github.com/awslabs/cli-agent-orchestrator/issues/715)于本次读取仍 open：记录 key 对应 terminal 不等于记录是否已提交；跳过发送可能丢任务，重发可能重复。相关 PR 撤掉对外 `--idempotency-key` 选项，缺少的 run record 仍待实现。这里引用维护者记录的缺口，不把建议状态机当成已提供功能。[社区／一手：公开维护记录]

**已有载体是可选起点。** 独立项目 Symphony 固定于 `be10a1b79df723d6d7612b5651c8522704dafb2e` 的[WORKFLOW L82–87、L142–147](https://github.com/openai/symphony/blob/be10a1b79df723d6d7612b5651c8522704dafb2e/elixir/WORKFLOW.md#L82-L147)从已知 issue 读取并复用单一 workpad comment，保存 comment ID，后续在[同一记录留下 commit 与验证摘要](https://github.com/openai/symphony/blob/be10a1b79df723d6d7612b5651c8522704dafb2e/elixir/WORKFLOW.md#L221-L227)；PR 关联放 issue 字段。它示范复用现有任务系统，不证明必须安装 Symphony 或 Git 优于其他存储。[SPEC §14.3](https://github.com/openai/symphony/blob/be10a1b79df723d6d7612b5651c8522704dafb2e/SPEC.md#L1690-L1705)将重启恢复限定为 tracker 与保留 workspace 重新发现工作，不恢复原 retry timers 或假定运行会话可恢复；[调度认领由单一权威串行更新](https://github.com/openai/symphony/blob/be10a1b79df723d6d7612b5651c8522704dafb2e/SPEC.md#L725-L731)，不能把可读的认领文件当互斥锁。[一手：固定工作流与设计契约]

**采用边界。** 派发身份应能关联基线、交付版本与接收方处理结果；已有 issue／PR 或共享任务记录能做到就保留，确有发现／事件处理缺口再评估补充。通知与结果查询仍分开，失联后先核原工作，未确认是否投递就不自动重派。未运行上游测试、真实客户端、故障注入或模型；不主张上述实现具备完整确认回执、跨主机恢复、恰好一次执行或效率优势。[研究：采用判断与未验证范围]

## 嵌套结果回收：先复用原生前台返回

核实：2026-10-18（UTC+8）；M4，改变 20 §5 的执行选择。下一步依赖子结果时，先核宿主的前台返回；后台并行才另定接收与整合者，不默认增加轮询层。[研究]

**扩大委派暴露了消费缺口。** [Claude Code #90256](https://github.com/anthropics/claude-code/issues/90256)报告 2.1.250、Linux／WSL2 的第三方 headless 宿主中，根任务下的协调者再派三个研究 worker；已有完整结果却未交给协调者，根任务重复派发，协调者最后靠文件轮询交付。这是带身份与队列时间线的公开自报，不把成本估计当统计；未读取未脱敏 gist。[社区；研究：范围]

**发行改变默认路径，修后回执核到消费者。** [2.1.302](https://github.com/anthropics/claude-code/releases/tag/v2.1.302)于 2026-10-17 04:53:06（UTC+8）正式发布；[固定 changelog 第 36 行](https://github.com/anthropics/claude-code/blob/c017428c8c27e604840435048d5bce6a9a22c040/CHANGELOG.md#L36)将子 Agent 自己的 Agent 调用在 `-p`／SDK／Desktop／VS Code 中改为默认前台。[一手]

[#91140 原报告者的修后复测](https://github.com/anthropics/claude-code/issues/91140#issuecomment-6226311364)在 macOS 上固定版本与提示：子任务等待后返回 `C-DONE`；父任务只有在工具结果中收到该标记才写 `INLINE` 并返回 `MGR-INLINE`。省略后台参数的五个旧构建（2.1.280、290、299、300、301）合计 30 次均搁置；2.1.302 在 `-p` 根忙、stream-json 根闲、TypeScript SDK 根闲三个入口合计 9 次均 inline。显式后台调用仍未唤醒中间父任务；这不是后台投递修复。公开提示与回执闭合到标记消费，不等于真实工程集成成功；本仓未运行。[社区：控制复测自报；研究：范围]

**保留反例与退出条件。** [当前官方嵌套契约](https://code.claude.com/docs/en/sub-agents#let-subagents-spawn-their-own-subagents)说明，非交互／SDK 的启动者结束后，嵌套后台结果交给根会话。故依赖结果时优先原生前台；确需异步时明确接收、续接与整合责任，结果未知仍先查原产物，不重派补通知。Desktop／VS Code 这里只核发行说明，不继承 9 次消费回执；不推广所有后台 Agent、恢复旧任务或长期收益。仅只读公开文档、发行与原帖，未复制复测者特殊权限、运行客户端／模型或上游测试。[一手；研究：采用与验证边界]

## P47：模型回退，历史兼容不等于工具可重放

主线：2／3，额外路由能力与第二次配置修改；核实2026-10-21。
改变建议：20 §9新增编码Agent的回退采用门槛；保留原生恢复，不用删历史或重跑工具掩盖模型调用失败。
新证据：两套发行实现的流式边界、跨商历史投影测试，以及第三套领先SDK的配置序列化契约；本仓原函数摘录宿主13项通过，不是SDK／模型实测。

### 最高水平卡与具体选择

**问题。** 编码Agent已读文件、发出或执行工具，模型请求断流；增加备用提供商后，又改备用顺序或保存重载配置，能否接着工作而不重做写入？本项目不评模型排名、成本路由收益或新编排框架。

**领先参照。** Anthropic工程团队2026-04-08[Managed Agents](https://www.anthropic.com/research/managed-agents)将持久事件日志、harness与执行环境分离，日志不是易失context。OpenAI Agents[重试安全契约](https://openai.github.io/openai-agents-python/models/#safety-boundaries)区分已开始输出、有状态请求与本地副作用重放。它们提供当前头部工程参照，不证明跨提供商整体最优；本题端到端最高水平与效果赢家未知。[一手；研究]

**主流／可行。** 现成网关重试和Agent原生fallback均已有成熟实现；本轮没有采用率调查，不能称两者代表普遍实践。本仓默认属于有源码与回归定义支持的条件选择：已有Agent先保留原生路径，确有可用性缺口才加回退；候选的能力／历史兼容与执行阶段分别验收，任一不明就暴露可恢复失败。Agent可生成配置、对齐历史并准备故障测试；人确认写入语义、允许的提供商与回退目标，不能把模型自报“未执行”作为去重证据。[研究]

### 固定发行、许可与同题比较

| 对象 | 固定发行与commit | 本题机制与局限 |
|---|---|---|
| LiteLLM Router | [v1.106.1](https://github.com/BerriAI/litellm/releases/tag/v1.106.1)，`978b4d1e4e91cdaaab2e16fbd02d855439e143c1` | [router.py L477–494](https://github.com/BerriAI/litellm/blob/978b4d1e4e91cdaaab2e16fbd02d855439e143c1/litellm/router.py#L477-L494)把tool_calls、thinking等也视为已生成内容；模型请求fallback不拥有应用的工具执行账。 |
| PydanticAI FallbackModel | [v2.58.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.58.0)，`b40096c4c91e4db361ee3f23b0e3f6b85569faa2` | [fallback.py L634–661](https://github.com/pydantic/pydantic-ai/blob/b40096c4c91e4db361ee3f23b0e3f6b85569faa2/pydantic_ai_slim/pydantic_ai/models/fallback.py#L634-L661)交出流前先窥首个模型事件，再完整交给消费者；后续错误传播，不等于自动重开整个Agent。 |
| OpenAI Agents：领先参照／配置反例 | [v0.24.0](https://github.com/openai/openai-agents-python/releases/tag/v0.24.0)，`17d994bd3045dae71acda676a4ef4762ed8ecd94` | [retry.py L209–230](https://github.com/openai/openai-agents-python/blob/17d994bd3045dae71acda676a4ef4762ed8ecd94/src/agents/retry.py#L209-L230)的policy是runtime-only，保存次数／backoff不保存回调；必须把重载行为纳入二改验收。 |

两实现不同层，不评总榜赢家。LiteLLM所选文件在非enterprise区域，MIT；PydanticAI、OpenAI Agents所选文件亦MIT。完整许可、commit、文件Git blob SHA、原样摘录范围与SHA-256见[p47_sources.json](../../experiments/recovery-outcome/p47_sources.json)。摘录不是完整依赖闭包。[一手]

**发行与滚动源码不可混用。** 初查LiteLLM滚动main存在`enable_mid_stream_fallback_continuation`及纯文本prefill限制；固定1.106.1的router.py没有该参数。本次推荐与探针只基于1.106.1，不把main功能写成可用发行配置；未来升级须重新核tag及回归。Pydantic所选fallback文件在本次main读取与2.58.0的blob相同，但结论仍固定发行。[一手：本次读取；研究]

### 兼容矩阵：协议可接受只是第一道门

| 输入或故障 | 固定材料回答什么 | 采用验收与尚缺部分 |
|---|---|---|
| 普通文本／工具／多模态／结构化输出 | [OpenAI官方混合模型说明](https://openai.github.io/openai-agents-python/models/#mixing-models-across-providers)要求逐提供商核特性；OpenAI-only优先原生Responses路径 | 列任务实际依赖，不默认所有OpenAI-compatible端点等价；本轮未调用提供商核能力。 |
| 工具动态可见性、旧历史跨商 | Pydantic[固定test_fallback.py L222起](https://github.com/pydantic/pydantic-ai/blob/b40096c4c91e4db361ee3f23b0e3f6b85569faa2/tests/models/test_fallback.py#L222-L282)用模拟客户端核Anthropic→OpenAI及反向的tool-reveal重投影 | 不是所有tool-call/result、签名thinking或服务端response ID都可跨商复用；实际旧历史接收链待验。 |
| 首输出前故障 | LiteLLM[wire测试L138起](https://github.com/BerriAI/litellm/blob/978b4d1e4e91cdaaab2e16fbd02d855439e143c1/tests/integration/sdk/test_router_sync_stream_fallback_wire.py#L138-L188)核sync／async转备用；Pydantic[首事件前测试](https://github.com/pydantic/pydantic-ai/blob/b40096c4c91e4db361ee3f23b0e3f6b85569faa2/tests/models/test_fallback.py#L1121-L1159)核保事件 | HTTP收到200、生命周期帧与模型首事件不是同一边界；本仓只复核helper，未复跑上游wire／SDK套件。 |
| 首事件后、部分工具参数后故障 | LiteLLM同一wire文件test_dies_after_first_chunk只打primary；Pydantic[首事件后测试](https://github.com/pydantic/pydantic-ai/blob/b40096c4c91e4db361ee3f23b0e3f6b85569faa2/tests/models/test_fallback.py#L1161-L1184)向消费者报错 | 不因没有自然语言输出就允许重放；本仓伪chunk证明工具片段会命中原分类器，不证明工具已执行。 |
| 工具提交后回执缺失 | 网关和模型fallback不能据此决定业务动作未发生 | 复用[已有unknown／对账探针](../../experiments/recovery-outcome/README.md)，不重造幂等系统；工具账与跨商旧历史联动仍未闭合。 |
| 第二次配置保存／加载 | OpenAI[序列化测试L313、367](https://github.com/openai/openai-agents-python/blob/17d994bd3045dae71acda676a4ef4762ed8ecd94/tests/model_settings/test_serialization.py#L313-L385)明确policy不参与JSON round-trip | 按应用需要显式重绑定并验证；丢回调是明确契约，不是漏洞，也不意味着SDK自动越过重放保护。 |

[一手：固定源码与测试定义；研究：采用门槛。上游测试存在不等于本仓运行过。]

### 本仓首批限定执行

命令：`timeout 10s python3 experiments/recovery-outcome/p47_probe.py`。固定摘录加载宿主13项通过，涵盖空／缺失输入、工具片段、首事件前后故障、原事件不丢、空流、两次配置round-trip及两个负对照。负对照之一是只看text的分类器漏掉tool_calls；另一项显式验证“policy保存后还在”的断言会失败。结果与首次0测试失败记录见[p47_results.json](../../experiments/recovery-outcome/p47_results.json)。首次失败为宿主未向dataclasses登记模块；跨Python完整性检查另遇AST空字段表示与Ellipsis归一化问题，修宿主后Python3.13的19项通过，最终13项probe再次通过。修的是宿主，不是上游函数。[经验：限定离线复核]

**宿主范围。** LiteLLM输入是SimpleNamespace伪chunk／error；Pydantic模型与response是伪异步迭代器，使用同版PeekableAsyncStream和已安装anyio，deadline只允许None透传，非None明确拒绝；OpenAI只加载配置dataclass及辅助函数，使用已安装pydantic。没有导入三套SDK、安装依赖、调用模型／HTTP／业务工具；没有执行完整FallbackModel或Router链。原函数体不改，编译宿主只补future annotations、显式依赖名和无deadline适配。原始文件身份加摘录hash用于复查，不是供应链签名或安全沙箱。[经验：执行与限制]

`python3 -m unittest discover -s experiments/recovery-outcome -v`为原14项＋新增标准库源码完整性5项，共19项通过（system Python3.13；旧SQLite用例有未关闭连接的ResourceWarning，未隐藏或改无关代码）。完整离线入口仅纳入这5项完整性检查；13项依赖现有anyio／pydantic的限定probe单独运行，不能因为CI未安装它们而偷偷下载、跳过或冒充执行。[经验]

### 整项目验收：尚未完成

P47为0.5–3天项目，首批是发行比较与摘录反例，不按13项数目认定项目交付。冻结同一编码任务的B0→B1→B2：B0原生单提供商保存工具与历史；B1加兼容备用并注入首事件前后、工具提交回执缺失；B2调整备用配置／重载策略后消费B1旧历史。每步记录请求候选、事件、稳定业务操作ID、工具执行次数和最终文件；不同新动作不误去重，同动作换tool-call ID不变成新许可。[研究：待执行验收]

已有SDK环境时优先复用上述固定上游fake-client／wire测试，补旧历史与执行账联动；现环境未装这两套SDK，完整调用链保持未运行；本项目没有发生过SDK安装尝试或拒绝。若无法在授权环境执行，只能交资料／摘录层结论，不能把原创协议模拟包装成SDK验证。失败要能明确归为能力不兼容、已输出不能重播、业务结果未知或配置回调需重绑；任何一类被删历史／盲重试掩盖都算失败。该验收无模型排名或生产exactly-once声称。[研究：后续范围]

## 2026-10-21：范式快照与代际复核

**P50 最高水平卡。** 主线一／二／三／四；复核年初自主范围、工作流与并行默认。修订：撤回 14 的“完整产品不得无人值守”体量禁令；撤回 08 的“独立探索先开子 Agent”机械起点。默认端到端自主实现、自验，按授权、反馈和后果接收；原生委派，有具体收益才干预。[研究：本仓判断]

**当前最高水平整体未知；近期领先参照**：Willison 10-20 的 Opus 5.5／Claude Code Web Ultracode 游戏跨轮改进，Claude Code 团队 10-15 的按风险评审与发布，Cursor 9-23 随模型能力删去探索委派提示。**主流参照**仍是人在关键需求与接收处介入、原生 Agent 执行并回传证据；本轮没有行业采用分布，不能称多数人已采用这些前沿做法。**本仓条件默认**：可运行、可验收、可恢复且授权清楚的端到端任务直接交给 Agent。跨任务最优、安全自主时长与复制后的净收益未知。[一手／社区：下列公开原文；研究：分层比较]

核实：2026-10-21，复用 P46 名册，对齐 C08／C09／C12／C14。仅原文比较，未运行模型或游戏；年初仅作基线。本节与旧 P47 模型回退无关。

### 五维时间线与代际

| 维度 | 年初基线：作者、日期与实际条件 | 近期原文与变化 | 不能由此推得 |
|---|---|---|---|
| 人的角色 | OpenAI Ryan Lopopolo，2-11，内部 beta 产品；人构造目标、可运行 worktree、UI／日志反馈，Agent 执行 | Claude Code 团队 10-15 按变更风险分批准层；Willison 10-20 主要靠试玩反馈而非读完代码 | 年初仍逐行陪写，或 10 月不再需要人理解结果 |
| 单次自主时长 | OpenAI 自报单任务常达六小时以上；Cursor Wilson Lin 1-14 的周级浏览器／迁移是多个 Agent、多个循环 | Willison 8-7 报项目用时 52 分钟，另记人工纠错提示，无人介入连续段未知；10-20 两轮不同目的的改进各过夜 | 小游戏时间是能力上限；项目周数是单体不中断时长；不同任务的新旧耗时构成提速比较 |
| 并行方式 | Cursor 1-14 已用 planner／worker／judge 和按角色选模；Anthropic Carlini 2-5 用 Opus 4.6 多实例写编译器 | Cursor 9-23 撤探索必委派倾向；Willison 10-20 使用 Ultracode 动态多 Agent | 10 月才出现多 Agent；更多角色天然更好；减人工编排等于禁用子 Agent |
| 瓶颈 | 年初已遇协调、漂移、运行环境和验证不足 | Claude Code 10-15 将验证接到分阶段发布／回滚；Anthropic 10-16 内部研究指出注意力瓶颈 | 全行业瓶颈已统一转移；Agent 工作小时等于人的产出倍数 |
| 模型／工具 | 1 月 Cursor 比较 GPT-5.2／GPT-5.1-Codex／Opus 4.5；2 月编译器用 Opus 4.6；3 月 harness 比较 Sonnet 4.5→Opus 4.5／4.6 | 8 月 Codex Desktop GPT-5.6 Sol Ultra；10 月公开实践有 Astra High、Opus 5.5／Claude Code Web；当前原生 harness 随模型迭代 | 型号更新本身证明工作方式更优，或内部预览模型是公开可用默认 |

[一手：团队自报；社区：开发者实践。原文及反证如下。]

### 原文与影响推荐的事实

**E1：年初上限，不能写成补全。** [Cursor／Wilson Lin，2026-01-14](https://cursor.com/blog/scaling-agents)明确研究自主运行数周的群体项目。平级锁协调出现问题后转分工、删 integrator；周级迁移仍需审阅。按角色选模和删协调步骤早已存在。[一手：前沿压力实验]

**E2：早已允许完整产物的反例。** [OpenAI／Ryan Lopopolo，2026-02-11](https://openai.com/index/harness-engineering/)原文“Humans steer. Agents execute.”，自述内部 beta 产品代码由 Agent 写，单任务可达六小时以上；人提供目标、环境、反馈，Agent 逐渐承担相互评审。这足以使“所有完整产品都不宜长自主”失去绝对依据，但不证明任意产品无需人工价值和体验判断。[一手：内部团队自报]

**E3：大工程与失败并存。** [Anthropic／Nicholas Carlini，2026-02-05](https://www.anthropic.com/research/building-c-compiler)用 Opus 4.6 多实例构建编译器，仍有兼容、性能与回归缺口；这是能力压力实验，规模不证明质量。[一手]

**E4：旧补丁随代际撤回。** [Anthropic／Prithvi Rajasekaran，2026-03-24](https://www.anthropic.com/research/harness-design-long-running-apps)：Sonnet 4.5 的强制 reset 到 Opus 4.5 可删，Opus 4.6 又删 sprint；任务与预算不同，不把耗时差归因于删步骤。[一手]

**N1：近期直接改变并行起点。** [Cursor／Jediah Katz、Connor O’Keefe、Calvin Yee，2026-09-23](https://cursor.com/blog/improved-token-efficiency)撤掉强鼓励代码探索委派的提示，理由是模型已学会选择且协调有成本；生产 A/B 的成本下降来自提示、工具、缓存等组合，不能归因一条提示。不同模型的子任务选用仍由用户或 harness 指定。迁移：沿用当前原生委派，再对可观察的遗漏或重复劳动干预，而非手工预设每次探索都拆。[一手：团队自报]

**N2：整轮自主改进，不是从零一轮成功。** [Simon Willison，2026-10-20，Battle Drones](https://simonwillison.net/2026/Oct/20/battledrones/)从 7 月 Fable 5 原型推进到 10 月 Opus 5.5／Claude Code Web Ultracode；玩法改进、Three.js 迁移各做一轮过夜执行，前者用模拟对战反馈。作者少读大部分代码，但明确大量试玩并反复改目标。[公开产物](https://github.com/simonw/battledrones)可追溯，文章中的 Agent 发布说明和模拟数字不是独立复测。作者对乐趣改善的评价支持撤回“不能改善乐趣”的绝对断言，不是独立质量评估，却不是商业独立游戏展或 Steam 可发布质量认证。音频联机造成头痛后，作者加警告并改走网络联机；这正是实际使用验收不可被内部全绿替代的反例。总投入未知，不以提交数或 token 评价质量／效率。[社区：同一作者的前后实践]

**N3：完整小应用仍会漏检。** [Willison，2026-08-07](https://simonwillison.net/2026/Aug/7/moonlight-mayhem/)用 Codex Desktop GPT-5.6 Sol Ultra 做完整可玩小游戏，报告项目用时 52 分钟，并另记人工纠错：虽查截图仍漏掉巨大眼球，作者用两条提示纠正；计时未拆分，无人介入连续段未知。存在性正例不等于通用可靠率。[社区]

**N4：生产采用按风险，不是统一无人批准。** [Addy Osmani、Morgan Westlee Lunt、Qing Wang，2026-10-15，Claude Code 自用评审](https://claude.dev/blog/solving-code-review-at-anthropic/)可信作者低风险变更可零人工批准，普通一人、高风险两人，配自动验证、评审、分阶段发布与回滚；互审失控后限轮、差量重审。仅支持按风险接收变更。回滚改善自报不证明单一机制因果。[一手]

**N5：生产反例。** [Willison，10-09](https://simonwillison.net/2026/Oct/9/built-using-my-voice/)用 Astra High 做博客功能，仍人工修订、读 PR 再部署；不照搬过夜游戏的接收强度。[社区]

[Anthropic／Nathan Wilmers 等，10-16](https://www.anthropic.com/research/employment-at-anthropic)的内部遥测与访谈补充注意力瓶颈观察；采用者非随机，Agent 工作时长与估算人时不同口径，不推效率倍数或单任务时长。[研究：观察研究]

### 五页推荐逐项复核与撤回条件

| 页面 | 保留／修订及层级 | 何时再撤回或重核 |
|---|---|---|
| 00 | 新增五维时间线；纠正“下半年才按角色选模”；30 秒给端到端自主与原生委派两条当前条件默认 | 新一代主力模型／工具发布后，重核实际做法，不只换型号；如无近期原文，保留历史日期 |
| 14 | **撤回体量禁令**；完整可验收结果可自主做，人验关键契约、实际体验与风险；现有型号起点沿用 02，不称效果排名 | 运行反馈只到编译、迭代不收敛、不可恢复或需要未授权动作时收紧对应边界 |
| 07 | 明确就做、不可猜契约先查、已知行为补 red/green、体验先样品均跨代保留；样品允许整轮自主，不机械切微任务 | 新证据表明某流程已被模型内化，删该步骤后核原行为；缺可评价标准先补依据 |
| 08 | **撤回独立探索必先委派**；当前原生按需，覆盖／上下文／关键路径有益才显式要求；Teams 仍按协调需求试用 | 原生遗漏独立问题则显式拆分；重复劳动、等待或整合负担抵消收益则缩减 |
| 20 | 恢复、版本绑定、外部结果对账与授权跨代保留；长任务不再按体量设上限，也不要求固定 reset／sprint | 可靠原生恢复已覆盖时不加重复记录；外部结果未知先查事实，不因模型更强直接重放 |

存在性证据足以撤回绝对禁止，却不足以证明同预算普遍最优；完成仍看真实结果与后续修改。[研究：结论强度]


## P47续查：配置改变后旧工具在哪执行

核实：2026-10-21；主线二／三。改变20的B2验收：除历史兼容与retry policy重绑，还要验未决工具的目录／定义绑定。已有unknown对账原则不重算增量，本节不新增探针。[研究]

**最高水平卡。** 同题整体最优未知。Moe Abadi的[Temporal实验（10-08）](https://temporal.io/blog/the-immortal-life-of-pi-running-the-pi-coding-agent-on-temporal)与Earendil Engineering的[Pi Durable（10-01）](https://earendil.com/posts/pi-durable/)是近期恢复机制参照，非生产优胜证据；主流采用率未知。可行基线仍是原宿主可核的恢复入口。只缺模型端可用性，保现成fallback；缺进程恢复才比较耐久宿主，不能把两层职责相加当完成保障。[一手：团队自报；研究：取舍]

### 同一任务的三个绑定层

| 变化／状态 | 已核契约 | 当前取舍 |
|---|---|---|
| 下一次模型请求 | Pi Durable请求准备时固定model、prompt与offered tools；后改配置从下一请求生效 | model-only修改与执行环境修改分开，不一概停掉所有热配置。 |
| 已发出、尚未落定的工具 | 同版文档明确：tool/hook在任务phase解析当前agent，环境按当前cwd构造；extension／cwd变化可到达模型已发出的调用 | 改这些绑定前先落定旧调用，或由宿主明确保留其执行环境／定义。不能从历史call ID尚在推断目标未变；这不是已证漏洞。 |
| 回放历史中的工具名和缺失结果 | PydanticAI固定文档：reveal记录只保名字，定义来自当前run；provider-valid修复可合成interrupted结果，live frontier无新user_prompt时仍可能执行 | 合成结果不是业务回执；先核实际结果和当前定义。此条来自冻结后的独立参照，不冒充本轮自主发现。 |

Pi契约固定至`6e491cfa95b53e656e31b72f91a0839046a8da1b`：[README L378–439](https://github.com/earendil-works/pi/blob/6e491cfa95b53e656e31b72f91a0839046a8da1b/packages/durable/README.md#L378-L439)，blob `b6c28f99781f979ed5752d5d7db5955c150b714d`；[规范L918–934](https://github.com/earendil-works/pi/blob/6e491cfa95b53e656e31b72f91a0839046a8da1b/packages/durable/docs/spec.md#L918-L934)，blob `3e206cf8e89118443504b6aca25d50fb1af4521a`。规范明确恢复重跑取当时cwd。它存extension/tool名字而非代码，包标Experimental；这里核的是同版文档契约，不是实现运行或某稳定发行认证。[一手]

PydanticAI v2.58.0固定`b40096c4c91e4db361ee3f23b0e3f6b85569faa2`，[history L364–405](https://github.com/pydantic/pydantic-ai/blob/b40096c4c91e4db361ee3f23b0e3f6b85569faa2/docs/message-history.md#L364-L405)，blob `6891ce693dbeac39c3b0f80dea9e679e7ec958f7`。是否能发给provider、工具是否应继续、外部效果是否已提交是不同问题；不能把合成interrupted当未执行，也不能为新prompt随意丢弃仍待回答的调用。[一手／研究]

### 为什么暂不换整套耐久宿主

[pi-temporal固定保证](https://github.com/temporalio/pi-temporal/blob/09d7c82576eeb34656403e692354bedf5e8e1fbd/docs/guarantees.md)（`09d7c82576eeb34656403e692354bedf5e8e1fbd`，blob `994ca67feea114e4c753ec5ca2fff023ec7dadee`）把模型步骤、工具claim、transcript fence和项目树迁移分开。当前fence用顺序而非lease到期，树迁移另有lease；不能把10-08文章的简述当当前全部实现。文档明确跨NFS客户端的transcript恢复无保证、旧writer混用与迁移有缺口、暂无runtime compatibility gate。只有当前宿主确缺相应能力且部署条件可满足时才进入采用比较，不因新文章默认移植。[一手／研究]

**给Agent的B2输入。** B1保留一条已发出未落定工具及其原目标；B2分别只换模型、再改cwd／toolset，核旧call最后使用的环境、定义和业务操作ID。配置保存／读回不能代替这项验收。人决定旧目标能否保留与当前权限；若授权撤销就不再执行，保绑定不等于保旧权限。仍复用既有账，不再做另一个假对象探针。[研究：拟验收]

此次只读公开原文与固定文档，没有安装／运行SDK、模型或耐久宿主。P47完整B0→B1→B2仍未完成；提示词的前瞻自用记录及后验查漏见[P51回执](2026-10-15-exploration-evidence.md#p51第一次前瞻自用p47)。[研究：范围]

## P57：复用循环与跨次控制的同题比较

核实：2026-10-21；主线二／三。改变 [16](../16-building-agents.md) 的“嵌入产品就值得自建”和 [21](../21-agent-patterns.md) 的框架入口，依据团队实际采用、撤回与维护。**[研究]**

### 最高水平卡

- **问题：** 同一代码／CI／依赖维护请求，在审查期间仓库又变了。复用现成循环、原生委派还是自建控制层，哪条能保质量并减少后续投入？
- **当前最高水平未知。** 领先参照是 Spotify 的 SDK 持续采用、Cursor 撤掉任务硬编码但保留平台、Shopify River 的跨次接收；作者、近期日期及原文见下表。没有当前同模型、同任务、同验收的效果对照。**[一手；研究]**
- **主流与可行：** 主流采用率未知；现成 CLI／编码 SDK 是可行基线，已有原生委派先核能否覆盖完整目标。**本仓层级：比较后的条件默认**，不是已证最佳。先复用动态读改测，仅补缺失控制责任；有可验质量／时延目标也可直接比较自建，无须先等事故。**[研究]**

### 采用与撤回：按同一责任读原文

| 来源、是谁、日期 | 决定性事实与选择边界 |
|---|---|
| [Spotify Honk Part 2](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)，Max Charas、Marc Bruggmann，2025-11-24 | 自建循环要求用户选文件，跨文件修改与上下文管理暴露限制，后来改用 Claude Code，保留验证与受限工具。支持撤回重复维护循环，不是对今天所有开源 Agent 的判决。 |
| [Spotify Code with Claude 回顾](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)，Spotify Engineering 整理 Niklas Gustavsson 演讲，2026-06-03 | Honk 继续用 Agent SDK，自有 Kubernetes／Fleetshift 管目标、排程、进度及 CI 接入。支撑旧撤回在近期仍有效；前提包括多年平台和标准化投入。这里只用文字回顾，未看视频。 |
| [Spotify Honk Part 4](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)，Devon Edwards Joseph，2026-04-22 | 当次因 guardrail 不开放 Skills／自定义配置和外部 schema／文档，Scio 全量提示难维护而放弃；dbt／BigQuery 继续，但缺构建时单测，需下游手测。6 月采用 SDK 不证明 Scio 后来已解决；估计手工工期不是实测净节省。 |
| [River 从修复到合入](https://shopify.engineering/river-vulnerability-remediation)，Erin Son、Kaiyi Li，2026-09-02 | 过期 PR 的当前版本接收、人工接管与撤回补丁见 21。漏查任务说明提示不保证枚举；作者要求分页、去重、当前 head 与核算逐步确定化，而非宣称全部已实现。 |
| [Under the River](https://shopify.engineering/under-the-river)，Burke Libbey、Javier Moreno、River，2026-05-28 | World／Nix 迁移连带 CI、merge queue、缓存和测试设施改造；Aquifer 将持久会话、可替换循环与沙箱分开，发布时仍在逐步部署。共享平台可复用，但不是免费前提；headless pi 是另一 profile，不据此推 River 内层 SDK。 |
| [Cursor cloud agents](https://cursor.com/blog/cloud-agent-lessons)，Josh Ma，2026-06-02 | CI Autofix 从宿主搬日志转为 GitHub CLI＋大输出文件，放松多仓任务编排；仍维护持久执行、VM 与会话，长流程拆成短任务便于升级。撤的是“下一步怎么做”的硬编码，不是运行责任，也不构成本仓权限或自动推送依据。 |

以上均为**[一手：团队自报]**。精确模型／SDK 版本、团队人数和完整建设／维护工时未取得；River 下一轮行为有叙述，但缺可独立核验的对应补丁、CI 与后续修改链。**[研究：证据强度]**

### 同题比较与接收

固定交付：一个真实维护请求及下一次仓库变化，三条候选均交**当前版本修改、全部目标处置、实际检查、人工待决项与关闭证据**。质量同时看保住无关新改动、撤回误修和真正接收；不同公司案例只比较责任机制，不能拼成一场统一实验。**[研究]**

| 候选 | 保留什么／自己承担什么 | 当前取舍 |
|---|---|---|
| 现成 CLI／编码 SDK | 原生探索、编辑与测试；沿用已有 CI、任务源和人审 | 单次已能完整交付就保留；嵌入产品本身不是重写循环的理由 |
| 原生委派 | 复用批量运行与结果回收；核全目标及失败状态 | 已能满足任务与接收就不再建调度层；[当前 workflows 契约](https://code.claude.com/docs/en/workflows)是能力依据，不是收益实证 |
| SDK＋薄控制层 | 同一编码循环，补明确缺失的目标、版本、审批与交付约束 | 接受这些责任的持续维护，避免用提示承诺保证 |

**实际投入要问到下一次改动。** 上述提示／映射、人工测试和平台改造是已知投入，总额未知。比较应计任务准备、环境、模型／接口升级、等待／费用、复核、返工和接收，不能只算 SDK 接入或 token。**[一手；研究：成本口径]**

**当前默认与撤回：** Agent 做可验证修改，人定业务语义与风险，已有系统守控制责任。额外层无所需收益，或二改出现状态滞后、规格膨胀和人工回流，就停对应自动动作、删重复编排或收窄覆盖；目标／版本／接管未知先核事实，不降低质量标准。**[研究]**

**验收状态：** 16／21 已完成以上同题责任机制比较，登记“已比较、gap 2”。没有完整公开初改／二改成功链或同预算全投入对照，不降到 ≤1。本轮未安装框架、运行模型／客户端／引擎，未新增探针；资料比较不计效果验证。**[研究：范围]**

## 2026-10-22：综合判断的交付边界复核

**P71 改变的选择：把完整功能交给 Agent，但宿主、旧数据消费者或使用寿命改变时，更新验收范围，而不是固定拆小或加人工审批。** 14 的最高水平卡比较整轮实现、风险分层接收与只验新功能三条路径；保留可撤回的模型起点，不声称统一最优。当前代际跨任务净收益未知。

### 决定性原文与独立性

以下既有博客／团队来源来自 P46／P50 名册，不作新发现；本轮重新读相关原文。新增证据是公开 PR 的具体取舍及其合入后的真实二改，不是再增加一个博客案例。

| 原文、作者、日期 | 本轮实际读取及改变的判断 | 不支持什么 |
|---|---|---|
| [Built using my voice](https://simonwillison.net/2026/Oct/9/built-using-my-voice/)，Simon Willison，10-09 | 相关正文：作者以 Astra High 实现博客功能，人工修订／读 PR 后部署；整轮实现可行，接收仍有具体对象 | 自报时间不是同预算比较或本仓执行 |
| [PR719](https://github.com/simonw/simonwillisonblog/pull/719)，同作者，10-09；最终 head `afc5f900658432ca79b5b4080fdf3a9653252747`，合入 `0dc6acc7e0015bc6c92c93d944208feb3351706e` | 公开评论与相关导入／测试 diff：作者判断 Heroku 使用 Git 需要额外构建配置，改 HTTP/API；一次性 Substack 导入允许未来失效。运行宿主与生命周期改变方案选择 | 不是已发生生产事故；不把一次性取舍扩成长期非稳定 API 推荐 |
| [二改 3d9a3c83](https://github.com/simonw/simonwillisonblog/commit/3d9a3c83ae0831cc1bebbd919e10cc2a3484b12d)，同作者，10-09 12:34:07 UTC+8 | 完整 patch：已公开月刊新增提纲，改导入、模板、字段说明和测试；旧记录回填而不是只改新页面 | 三项同源产物不是三个独立团队，也不是受控模型对照 |
| [Solving code review](https://claude.dev/blog/solving-code-review-at-anthropic/)，Addy Osmani／Morgan Westlee Lunt／Qing Wang，10-15 | 主要正文：可信作者低风险变更可零人工批准，敏感路径仍核；新改动与最终树要重验，作者负责修复 | 厂商自身流程，不独立证明审批减少带来净收益 |
| [Building Agent Chip](https://monzo.com/blog/building-agent-chip)，Fabien Deshayes／Oli Haley，08-13 | 相关完整正文：非工程师委托 UX 等修改，工程师接收；每任务隔离、代理、团队责任和成本可归属 | 银行自报不是受控实验；整仓构建／运行／测试／部署在文中仍属后续方向 |
| [Quick](https://shopify.engineering/quick)，Daniel Beauchamp／Alex Pilon，06-10 | 相关完整正文：内部员工信任边界、固定后端能力；批量写入触发限流，随后调整实现 | 不能把内部信任模式推广到公共互联网，不能从采用规模推出最优 |

Monzo、Shopify 与 Anthropic 是不同团队，支持 14 卡中各自对应的责任／边界判断。上下文效果、模型差异和游戏质量另沿用专题的独立研究与限制；不是用两个团队替整页所有经验假设背书。原审计 C12 的差距是 1，补登记须经整页独审，不能报告 2→1。

### 同题比较：初次交付后，再增加旧数据的展示消费者

- **只改页面**：新记录展示可以成立，却可能漏掉存量没有提纲、重导覆盖人工编辑和搜索暴露范围。
- **整轮自主实现＋具体接收契约（推荐）**：保留原有实现与上下文，让 Agent 连带查旧记录、导入与消费者；人核实际使用者、宿主和生命周期。复用检查补缺口，不新建探针体系。
- **每步人工审批／预先重建长期平台**：能增加观察点，但这里没有证据证明净收益；一次性导入的可接受脆弱性反而说明不应统一过度建设。持续同步或关键依赖出现后再重估。

PR 最终测试 `test_public_promotion_preserves_editorial_fields_and_date` 用既有记录核重导后对象仍为一个、保留 slug／日期／人工提纲与编辑元数据，建立可搜索正文；`test_http_failure_leaves_whole_batch_unsaved` 覆盖批量获取失败不落库，非法索引测试在取正文前拒绝。

合入后二改新增 `test_public_reimport_backfills_missing_headings`：以同一 import_ref 回填旧公开记录提纲，断言 updated=1、总数=1；保存逻辑保留已有非空提纲。页面测试覆盖索引／年度页及字符转义，搜索内容不混入展示提纲。这里核的是公开实现和测试设计，没有运行测试，也未证明线上全量回填或 hosted CI 通过。完整后续维护总投入仍未知。

### P51 使用范围

本轮基线 `48dc9c617f142f85d473d3dd164818655fb17d5f`；公开原文准备约 2026-10-22 01:02 起，正文整合 01:10 起（UTC+8）。提示词为既有 10-21 版本，但最早原文打开先于提示词读取，**不追认完整事前自用项目**。表内去重来源 N=6、相关正文／代码已读 F=6；决定性 D=6、FD=6。同作者博客／PR／提交分别记录读取对象，独立团队只按作者来源计。原文准备与等待／复核用时没有完整起止账，不造净工时。

没有冻结的合格外部漏检参照，漏检率无可计算分母。旧博客未新增发现；新增公开二改补的是“已知来源未转成后续消费者验收”的转化缺口。没有新增脚本、JSON、安装、模型或引擎运行。
