# A-MODEL-ENTRY-CONSISTENCY-20261102 · 已接收入口事实的跨页一致性
id: A-MODEL-ENTRY-CONSISTENCY-20261102
owner: dot-A
status: accepted
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 99c1c1fc6114188d9a18d05f628f6f08e368ac00
result_branch: relay/a-model-entry-consistency-20261102

## 目标
让读者从已修正的 Agent 总览进入深度页后仍得到一致、可用的启动条件。总览 73dbfe66 已修 Cloud 模型选择与客户端前提；核深页的具体残留或歧义，只交必要的更正候选，不重做模型排名或客户端实验。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README。fetch main 与负责人分支，核同题在途；不修改现有 reader／facts 的产物或重派其任务。
基准为已接收的 docs/01-agents/README.md@73dbfe668a4fde4577e949613a25626f02098929 及 A-AGENT-CHOICE-FACTS-20261102 的限定接收结论；原事实报告有未采纳项，不能整份照抄。
仅核 base_ref 的 docs/01-agents/codex.md、docs/02-models-and-cost.md、docs/decisions/model-roles.md 中入口选择和启动命令。重点看 Codex 深页“模型按 §2”是否被误用到 Cloud、模型 ID／客户端最低版本、provider 与账号可用性前提是否与总览矛盾；先看整段语境，不能把省略都判错。
已定位的待核原句：Codex 深页 §3.5“模型按 §2”；02 与 model-roles 开头均有 `claude --model claude-sonnet-5-5 --effort medium`。对照总览 73dbfe66 的 Cloud 默认模型与 Claude 客户端前提、该段直接引用的官方模型／CLI 文档；这些是核查起点，不预判所有简写都应改。
只对会造成错误动作的地方给最小改写，或明确指向唯一权威前提，避免每页重复整套限制。用总览已核官方来源核必要差量，版本不同保留各自原核实日；不重新核价格／benchmark、不改变推荐模型或 effort，不将 desktop 套餐限制泛化到 CLI。
明确排除已接收 Agent facts 的同一篇重写、旧 MODEL-EFFORT reader 的接收、三张 jrnl 任务及两广扫。只读公开页面／文档，不启动客户端、模型、浏览器或调用API，不检查账号、额度、凭据、私人会话，不安装或更改配置。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-MODEL-ENTRY-CONSISTENCY-20261102/proposed-changes.md`；接收端只另回写本卡状态与当前结果。不改三页正文、模板、TASKS、其他卡、产物、规则或接收器，不合 main。
先列有实质影响的差量：固定页面／原句、上下文、官方依据、读者可能做错什么、建议最小替换或交叉引用。再列看似不同但应保留的表述与理由；无实质错误就交明确已核范围，不为凑差量改文案。

## 怎样算做成
非作者逐项核来源、客户端与版本范围、实际操作影响和跨页一致性；不把别页简写自动当事实错误。产物只是供页面负责人采用的候选，不算真实客户端、模型效果或地图验收。
最多两小时，共享最多 4 并行只由原接收端调度；不另起模型。跑 check_repo、check_public、git diff --check 与提交身份检查后仅推 result_branch，回 review_ready，由负责人决定是否修改页面；不用 accept: auto。

## 当前结果

- 已交付 proposed-changes.md，列出两处实质差量（codex.md §3.5 的 Cloud/Dots 模型入口限定；02 的 Claude Sonnet 5.5 客户端最低版本 v2.1.284+）；check_repo 717 文件 0 errors、check_public 0 findings、git diff --check 通过。reviewed=false：3 轮修正后仍有 2 条 openIssues——第 39 行建议句把依据链塞进正文且层级不清，第 27/43/103 行把命令参数表未列 --model/-c 写成绝对断言。三页正文、模板、TASKS 未改，未提交未推送，不替代页面负责人验收。
- 产物：[2d096b3](https://github.com/dbvv1/a1dbv/commit/2d096b3591347758d80a4a1f754af06e2efcae31)，分支 `relay/a-model-entry-consistency-20261102`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：页面负责人按 2 条未关闭审查意见调整候选后验收；接收端提交时须用合规的 -c user.name/-c user.email 身份。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 负责人限定接收（2026-11-03）
- 接收 [2d096b3](https://github.com/dbvv1/a1dbv/commit/2d096b3591347758d80a4a1f754af06e2efcae31) 的两项事实差量：Codex 深页本地／Cloud 模型入口歧义、02 中 Sonnet 5.5 命令的 Claude Code v2.1.284+ 前提。页面负责人逐项回核官方来源、经非作者独立审查后，将最小修订发布并逐字回读为 [c1aa6a48](https://github.com/dbvv1/a1dbv/commit/c1aa6a4802a9d8ce87bdeb8542c66277d1fb3381)；model-roles 已有相应前提，不改。
- 原报告的两条 openIssues 属实；不采纳由子命令参数表未列 `--model`／`-c` 推导的全局不支持断言，也不复制冗长依据链。最终正文分清本地 CLI、Cloud 默认模型与主 dot／委派 Work／Codex 控件；主 dot 分界由官方管理文档补强。此为负责人另行最小修订，不称原候选全量审查通过。
- 上述原回传记录保留；其中“未提交未推送”是原模型阶段自述，正式产物已由接收端发布到所列结果提交。页面修订的文档、公开内容、身份及空白检查通过；接收仅限所核官方事实与跨页一致性，未运行客户端、模型或账号验证，不变更默认模型／effort 推荐，不接收旧 MODEL-EFFORT 或 Agent reader 任务，不升级地图。
