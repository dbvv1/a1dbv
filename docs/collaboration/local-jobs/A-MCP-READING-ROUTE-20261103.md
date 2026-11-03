# A-MCP-READING-ROUTE-20261103 · 把真实长报告消费接入 MCP 选择路线
id: A-MCP-READING-ROUTE-20261103
owner: dot-A
status: revision_requested
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 04f31d0c534cb674546e7a1771f3278b8636ea92
result_branch: relay/a-mcp-reading-route-20261103

## 目标
为已有 MCP 服务、工具目录或长返回占上下文的读者，给出“先缩查询／分页，何时试目录压缩，缺完整原文怎样安全恢复”的可操作选择。复用本轮已完成的真实来源报告消费，不新造演示、装软件或再跑同一试验。
本单元只交 docs/04-mcp.md §2 的有限操作建议稿；原页旧写者退出尚无确证，不改页面，不在其他位置建立可启用替代页。负责人核清写域后另接收采用。

## 按哪个 Skill 与规格做
读最新 AGENTS、CLAUDE、TASKS、手册§7和原入口，核同题在途；按 write-task-guide 从真实读者问题、已有实际消费、可复制第一步和必要换路条件组织。禁止为满足步骤编第二个任务。
真实作者任务：从已返回的 Skill/MCP 长报告取尾部具体缺口；固定公开输入9f905b0166278975f9831e7d142b9ca4cae423c5 的 docs/collaboration/local-jobs/artifacts/A-SKILL-MCP-WIDE-20261029/sources.md，140329字符/223099字节。作者通过官方filesystem真实stdio读、compressor压缩和full恢复完成。不是原生coding客户端或模型采用。
固定主证据：25faf6722775955a211e4ab326d9209e530b54da 的 experiments/mcp-compressor-reading/{README.md,receipt.json,trial.py,runtime/package.json,runtime/package-lock.json}。先只读原始回执与公开脚本，不能将摘要当全部证据；不执行该脚本或其子进程，不下载/安装/改MCP配置。
官方源码固定 atlassian-labs/mcp-compressor@7efc49552101005e93e12588c669d68b9b3c5f7c，必要时只读docs/usage/shrinkfit.md；不把后续版本当本轮实测。
对照最新 docs/04-mcp.md §2 的工具发现、原生过滤、CI投影和MCPorter入口，以及docs/03-context-engineering.md的原生读取/输出过滤；合并相同建议，只补此次改变选择的增量。不得改现有推荐默认或扩成综合工具目录。
建议主线：已知单文件/单字段先原生查询/head/tail/过滤；大量低频工具schema且原生工具仍有可测负担时，才把0.40.0 medium作为🧪候选，链接已验配置/复现入口。不能把本轮14工具的机制检查泛化为所有服务收益。
必须区分：tools/list目录、另取schema/init/display_meta、content文本与structuredContent/整个result。实测12579→2331字符只对应目录；shrinkfit=10000时text9072、整包152111字符。字符不是token/账单，不给通用省费比例。
完整恢复仅沿已有只读请求/full=true；固定源码说明缓存未命中可能重执行后端，因此不可推荐写操作盲重试。完整文档恢复SHA256一致；本轮未测缓存命中/驱逐与写工具。错误与原字段保真但多了display_meta，不称整包字节相同。
把第一步指向现有实验已实跑的准备/命令入口，不复制长安装段、不引入默认代理配置。指导读者先确认实际host收到哪些字段，再判断总开销；无原生宿主证据保持未验。
在建议末尾明确：这是已完成真实消费的路线回流，后续仍需未参与写作的新读者带独立自然任务照页实做；本单元不充当reader-test、不升级🟡/地图，不为占位补造reader任务。
不读私人会话/账号用量、用户配置/凭据或旧进程；不触碰取消任务、未知调用、既有socket拒绝、原Skills写域或13。没有新来源必要时直接沿固定证据，不再广扫。

## 写入范围
仅 docs/collaboration/local-jobs/artifacts/A-MCP-READING-ROUTE-20261103/proposal.md。给建议放入的原位置、最小候选段落、与原文的合并/取舍、固定事实来源及待自然reader条件；不另建日志/框架/工具。
不改docs/04-mcp.md、03、13、决策页、模板、源码、测试、依赖、既有实验、其他卡或长期规则。模型不提交/推送；接收端按原流程仅回结果分支review_ready，不用accept:auto，不合main。

## 怎样算做成
非作者只读候选及固定证据，回答真实决策：单个已知长文件是否值得加代理；目录变短是否证明整包受限；需要缺失正文时怎样恢复；写工具为何不能沿用恢复结论。答案能从候选找到且与回执/源码一致才接收。
计数、预算对象、元数据额外成本、原失败与当前未验范围逐项保真；当前默认/原实例不被覆盖，候选不称新实跑或完整可照做验收。没有独立自然读者任务时明确保待验，不创建替身任务。
这是纯文档建议，适用check_repo.py、check_public.py、git diff --check及身份/实际diff审查；不跑check_offline、无关实验或目标运行。缺检查依赖则如实报告，不安装或修改接收器。
完成上述建议即回传，不为填满时长扩题；通常60–90分钟，最多两小时。原接收端核退出/单写并按共享最多4并行领取，同一id不重复派发；碰到同题在制或明确拒绝停对应动作并保现状。

## 修改要求
沿原 result_branch 从 04f31d0c534cb674546e7a1771f3278b8636ea92 仅修 proposal.md 的三组事实与必要同步；原受检输入仍为 9f905b0／25faf672，不随续接 base_ref 改变。先核原调用、工具和登记进程均已结束及原产物单写；缺证保持隔离，不启动续接或改旧文件。不重跑实验、不新读者／新任务，不改 04、其他页、模板、既有实验或接收器。
1. L8–14 的尾部缺失必须逐项对照原公开输入与缩短 content，不称只留节名或把仍保留的事实列为丢失：缩短文本仍完整包含“本轮未饱和，以下缺口按未读到…”及 §6 不安装／运行／登录的整句；实际缺失可定位到固定 sources.md L805 括注“URL 未保留，无法补读”、L808“528 项均未安装、未运行、未调用”及 L809“标‘摘要’的条目不能当当前机制；标‘作者自报’的数字不能当独立结论”；L805 仅保开头，后两行被省略标记替代。保恢复完整正文的真实用途，不将部分内容缺失夸成整组事实全部消失。
2. L28／57 的调用与计数收窄：本轮按需取一次 schema 并复用于后续调用，不是每次调用都另取；medium／max 各一次供四次 invoke，medium-shrink 一次供五次 invoke（含 full 恢复），direct 无额外 schema 调用；971 字符额外 metadata 只适用于本轮后端 read_text_file 结果，不含 initialize、tools/list 或 schema。L30 写实际 Python 3.12.14；3.11+ 仅是复现前提，不能当本轮运行版本。保已核目录 12579→2331、schema 2021、text 9072／整包 152111 等原值及其对象，不扩为所有服务固定开销。
3. full=true 限定为已启用 shrinkfit 的标准 MCP *_invoke_tool 包装入口，参数位于 tool_input 外，须保持原 tool、参数与 context；缓存命中取原响应，未命中可能重执行后端而产生新的完整结果。故只沿既有只读请求恢复，不把恢复 SHA 一致泛化为缓存命中证明或写工具安全重试；保未测缓存命中／驱逐／写工具及原字段外新增 display_meta 的边界。§7 第四项“解释写风险”须伴随独立自然任务的真实操作，解释本身不能替代新读者照做实测。
非作者只读固定回执、公开脚本／源码与本次差量逐项核对，之后回 review_ready；保首轮 101 行产物和审查自报于原历史，不将 pass=true／fixRounds=0 当完整验收。不据此次建议稿升级🟡／地图；旧 04 写者退出仍未知，正文不动。

## 当前结果

- Workflow completed implement plus reader/facts/run three-lens review with pass=true, fixRounds=0, openIssues=[]; only one new file docs/collaboration/local-jobs/artifacts/A-MCP-READING-ROUTE-20261103/proposal.md (101 lines) was added, containing the bounded 04-mcp §2 proposal with exact insertion point, paste-ready paragraphs, merge rationale, fixed-fact table and natural-reader conditions. I re-ran check_repo.py (734 files, 0 errors), check_public.py (1200 files after git add -N, 0 findings, index reset afterward) and git diff --check (pass); no changes to docs/04-mcp.md, 03, 13, templates, experiments or dependencies, and nothing was committed or pushed. Reader-test was not run by design; the candidate stays experimental pending an uninvolved natural reader.
- 产物：[04f31d0](https://github.com/dbvv1/a1dbv/commit/04f31d0c534cb674546e7a1771f3278b8636ea92)，分支 `relay/a-mcp-reading-route-20261103`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：Owner verifies the write domain and then accepts/merges the proposal; later an uninvolved reader must run a natural task against the candidate paragraphs before any 🟡/map upgrade.
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
