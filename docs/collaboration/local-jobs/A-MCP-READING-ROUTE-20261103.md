# A-MCP-READING-ROUTE-20261103 · 把真实长报告消费接入 MCP 选择路线
id: A-MCP-READING-ROUTE-20261103
owner: dot-A
status: ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 17c984ae31ac532fe69bce0f89e72572f6651545
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
