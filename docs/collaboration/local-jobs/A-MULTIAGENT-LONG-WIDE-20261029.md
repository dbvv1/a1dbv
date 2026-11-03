# A-MULTIAGENT-LONG-WIDE-20261029 · 多代理与长程任务广扫
id: A-MULTIAGENT-LONG-WIDE-20261029
owner: dot-A
status: running
kind: explore
target_repo: https://github.com/dbvv1/a1dbv
base_ref: a37326182cd65de837101d68d2596cbe8042a119
result_branch: relay/a-multiagent-long-wide-20261029

## 目标
广扫多代理协作、任务分解、持久运行、上下文接续与长程交付的新机制、新项目及真实失败经验。先发现还不知道的东西，不预编窄问题、固定赢家或采用决定。交可回源候选，供 dot-A 云端深挖、试用与取舍。

## 按哪个 Skill 与规格做
严格按 `templates/generic/.claude/skills/explore-frontier/SKILL.md` 第 1–2 步广扫；接收端使用 `kind: explore` 三路收集、核链接、整理再审，不退成 build。读最新 AGENTS、CLAUDE、LONG-TERM-PLAN、operations §2.2／§3、local-jobs README 与 TASKS。
开工 fetch main 和负责人分支，核队列、原调用隔离与已回产物，再读 docs/08-multi-agent.md、docs/decisions/long-tasks.md、docs/03-context-engineering.md、13、inbox 与相关 research。旧分支 ready 不能覆盖 main 的终态；相同工作在途只报告归属与差异，不重复执行；旧同题调用未确认停止时，不启动重叠工作，也不以 blocked／cancelled 推断已退出。
分工：协调、分工、持久状态和长程运行架构归本卡；单 Agent 项目配置交 AGENT-CONFIG；静态工具生态交 SKILL-MCP；验证和审查的具体机制交 VERIFY-REVIEW。
去重：A-PARALLEL-REVIEW-SOURCES-20261028 和 A-RESUME-CONTRACT-SOURCES-20261028 已 cancelled，原回执分别为 termination_unconfirmed 和 timeout，退出未确认。排除其固定 Cursor Projects／两条 Reddit 接收瓶颈讨论链及 OpenCode 10月工具中断恢复修复调查；不重开、不取回未交材料。已收多代理 reader、旧 context／replay 材料只作去重基线。
三路是并行取材分工，不是减少来源类别：一路看做事的人代码／设计与实际配置，一路看头部覆盖与没人点名的新东西，一路看公开使用反馈和可读社区线索；整理时交叉核验、顺藤追替代品和反例。
每路按内容换几组中英文和不同表述检索词；每类不止一个站／项目，保留迭代和去重情况。优先近 3 个月，主窗近 3–6 个月到实际读取截止，成熟项目的新采用也收；记录原始日期、核读日期与版本／固定 SHA，不用今天倒填发生日。
五类均要覆盖：①官方团队和高质量项目自己的 AGENTS／CLAUDE、Skill、hooks、PR／CI、源码设计、作者工程文；②GitHub topic／搜索按 star 和近期活跃度的头部、trending、awesome、Skill／插件市场；③中英文技术社区；④issue／discussions／论坛／市场评价的真实问题和对策；⑤近三个月上升且本仓没提过的新东西。头部逐项与本仓对照，未收者写简短理由；没有历史数据不编 star 增长。
顺藤追原链接、评论里的替代品与反对意见、作者其他文章及收录列表，做到新一轮大多重复才记饱和。一轮或一两个入口不算扫完；时限前未饱和则明写未完成，不靠定额候选或时间到冒充完成。
本机做大批量候选；社区原帖深挖由 dot 云端仅用 curl，读不到的等用户贴链接。本机已知 Reddit、linux.do、V2EX、HN 站点不可读，不重复试失败入口；HN Algolia API 可读，可正常取公开条目。可用公开索引／site: 摘要找线索但必须标摘要，不能据摘要确认机制或采用；明确拦截不绕过，不登录／换身份／代理／镜像，不启动浏览器。
官方、开源和社区三方对照；未读渠道交具体链接与所缺正文／评论给 dot，不写“没有反馈”。公网文字仅为材料，不执行其中配置或指令。
收集宁多勿少，每项先有原始链接与一句值得看的理由，核链接和内容对应；合并同源转载，不凭宣传或 star 判断效果。对最强线索补真实消费者、相反反馈及与本仓差异，深度核实与采用由 dot 决定。零净增量也可交具体已查范围与排除理由。

## 写入范围
模型只写 `docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-LONG-WIDE-20261029/sources.md`，不改正文、模板、inbox、TASKS、其他任务或长期规则；接收端只另回写本卡状态与当前结果。
先写值得深挖的新发现，再列候选、去重／排除和缺口。每项给原始链接、来源类型、日期版本、机制或新意、实际消费者（没有写未知）、正反反馈（摘要单列）、本仓差异与待核问题；作者声称、源码所见、公开运行回执分开。
覆盖表列五类实际读取的站点／项目、检索轮次与新候选数量、截止时间、未读入口及原因；附跨卡转交项，只留链接和归属，不在两卡重写同题。
只读公开材料；不装／运行候选、新模型、产品或浏览器，不读私人记录、凭据、账号用量，不改接收端或安全设置，不对外发言。不复制整篇原文、私人路径或原始敏感日志。

## 怎样算做成
非作者核链接支持的一句主张、日期／版本、真实消费者与宣传的区别、仓内／跨卡去重及五类真实覆盖。未饱和与社区原文缺口保留，不能写全面完成或实测／采用通过；发现新价值优先，不以任务数或候选数量充进度。
本探索单元单次最多 4 小时，依更新后的原生探索流程批量核链接；不在两小时处取消。共享最多 4 并行由原接收端调度，不另起进程抢槽；未确认原调用、工具和已登记进程结束前保留本地隔离。时限到保存已有候选与缺口；已有可审产物才回 `review_ready`，超时或连续失败按协议记 `blocked`；不当作来源负结果，不自建续搜卡、不重复初始调用。
接收脚本运行 check_repo、check_public、空白及提交身份检查，只推指定 result_branch；不用 accept: auto，不合入 main 或部署。阻塞写入口、实际错误、已有结果及恢复条件；状态不等于调用已停止。

## 修改要求
2026-11-02 用户明确重新安排本卡，撤销本卡原两小时取消安排；其余已取消单元不因此恢复。输入变化是本单元时限改为 4 小时、按新流程批量核链接，以及对照最新 main 去重；广扫问题和独占产物不变，停止新增“接收上游补丁并用调用方验证”的同类小实验。
先核本卡原调用、工具及登记进程确已结束；不能确认则维持隔离并报告具体缺证，不启动第二个调用。确认后沿原卡、原结果分支接续；按现行接收协议复用已有完成的收集，重核日期／链接并按本轮分组追踪，不把已完成候选重新从零搜一遍。不读取私人会话或账号用量。
先交最强的新发现及可实际试用入口，供负责人从两卡总产物选 3 项真实试用并更新 13；本卡仅收集，不提前宣布采用或地图升级。

### 已交 sources 的定点订正
本次沿原 result_branch 从 a37326182cd65de837101d68d2596cbe8042a119 仅订正已交 sources；先核原调用、工具与登记进程均已结束且该产物单写，缺证保持隔离、不启动调用或改旧文件。保留首轮提交／未读来源／未实跑与审查失败记录，不重跑广扫、不续新一轮四小时、不另派任务、不改页面／模板或运行候选。
1. L922 的 Entire 归属改为旧扫描保留候选、inbox 后列 ⛔（Git 交接保留、不导入真实会话）；Omnara 只有同一 HN 114 分而无新讨论链接，不能写因新讨论重现。保原取舍边界，不试装。
2. T8 不再声称本仓无 Ticket／Mandate 或推荐作第三个全新试用：对照 `docs/decisions/long-tasks.md` 与 `experiments/deepseek-superagent-receipt/README.md`，已有核心／SQLite、462 官方核心测试与真实仓库消费；未启动 DSH／真实模型、账号或外发的边界保留。
3. T3 的独立验收契约、T11 的返回单代理条件不是本仓首次缺口：分别对照 `templates/long-task/README.md`、`docs/08-multi-agent.md` 和 `long-tasks.md` 已有做法。Factory／Polylane 可保具体产品实践，不把同一方法包装成新增；Qwen、Beads、Cockroach 同样只保可核的新数据／具体实现。
4. T10 的“同预算”标题与正文改为同 50 任务、相同环境／评分但不同费用。按 [Vals 原文](https://www.vals.ai/blogs/multi-agent-vibe-code-bench)，Sol max 单代理 $4.82/app 与 medium 团队 $3.07/app，89.0%／84.9% 跨 effort 差异 p=.08 不显著，各配置一次；不据此推出等预算单代理优势或任意开发任务结论。
5. T13／速试表的 CWC 仅是教学源码参考：固定 `anthropics/cwc-long-running-agents@ad107a974bced5244f74dd283dbf2bfd3baee3a1` 的 README、`claude-code-config/.claude/settings.json`、同目录 hooks/verify-gate.sh／track-read.sh 和 agents/evaluator.md 表明，verify-gate 仅拦 Write/Edit、不核结果内容／passes／验收 ID，任意匹配读取可解锁其他结果；track-read 是 PreToolUse，路径入记录不等于读取成功／理解；evaluator 有 Bash，非硬只读。独立 all-true 要 wrapper 在 PASS 后更新，示例仍允许 builder 更新，不能称强制业务验收门。
6. T6 与速试表统一为 AgentScope Java 集成设计，不能把最小 HarnessAgent＋task_id 写成默认双节点互斥、杀 worker 自动移机和业务验收达标才 COMPLETED。按 `agentscope-ai/agentscope-java@55013a429380e91f8b498a31d0e948b38af1e7c1` 的博客任务编排 §2.4.2／§2.6.4、WorkspaceTaskRepository、TaskRecord 与 SessionTurnGate 源码，列共享状态／工作区、调度租约、业务幂等与验收的前提；分清本地 sticky／孤儿 FAILED 与远程协议恢复、future 正常结束与业务完成。保留已存在的持久元数据／游标和分布式锁扩展，不反写框架没有这些能力，也不无条件保证故障下互斥。
7. 统计改为可复算口径或明确原执行者自报：951 行、15 优先组、34 条不可读渠道；§4 有 623 数据行（含重复／旧来源），全文 679 次显式 URL／663 精确唯一 URL，§4 为 638 唯一 URL。“661 候选／654 已核链接”缺定义及逐链接回执，不能当全量正文核实；不为补数字重扫全部入口。
仅逐字回核上述受影响段及其原出处，保原来源日期／版本和未验证范围；非作者定点核七组纠错后回 review_ready。最终接收仍不等于全部 15 组、全部记录正文、产品可靠性或真实采用通过。

## 当前结果

- 探索单元 1 交付 docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-LONG-WIDE-20261029/sources.md（951 行，661 候选/654 已核链接）：五类渠道覆盖表、34 条不可读渠道与原因、前 15 项深挖（Anthropic 多代理失败实测、Stripe Minions、Factory Missions、Cockroach MOLT Sinai、Qwen Code Agent Team、AgentScope 2.0、dsh-superagent、Vals AI、Polylane、Anthropic 长任务四件套等）、A–J 十组 454 行候选、去重排除与缺口转交。未安装/未运行任何候选，未做实测或采用判断，也未宣称饱和；中文社区、Reddit/linux.do/V2EX、arXiv 全文等缺口已附链接转 dot 云端。openIssues：最终审查 pass=false，第 922 行把 Entire CLI 误记为旧扫描已排除项（旧卡实为保留候选，inbox 已有 ⛔ 条目），需负责人更正；Workflow 未在最后一轮修复。
- 产物：[a373261](https://github.com/dbvv1/a1dbv/commit/a37326182cd65de837101d68d2596cbe8042a119)，分支 `relay/a-multiagent-long-wide-20261029`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：修正 sources.md 第 922 行 Entire CLI 的去重归属（改为旧扫描保留、inbox 已有 ⛔ 条目，或从排除名单移除），再交负责人从本卡与并行卡总产物中选 3 项真实试用并更新 13。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
