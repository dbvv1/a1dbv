# A-PLAN-MODE-FACTS-20261103 · 计划模式的实际只读与执行边界
id: A-PLAN-MODE-FACTS-20261103
owner: dot-A
status: accepted
kind: build
page: docs/decisions/planning-and-tests.md@3ce1dad1ecd7ea676b4a492b5e586b4bddcfa03a
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 3ce1dad1ecd7ea676b4a492b5e586b4bddcfa03a
result_branch: relay/a-plan-mode-facts-20261103

## 目标
核现有规划页给读者的 Plan 入口与只读声明，防止把“先讨论再执行”误当严格隔离，或把批准计划误当所有外部动作已获授权。只核这段已有推荐，不改默认工作流、不开展模式收益对照。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README；fetch main 与负责人分支核同题产物／写者，重复只交归属与差量。
固定输入只含 planning-and-tests 页“先 Plan”段：`claude --permission-mode plan` 入口、“Plan 可运行获准 shell／可用 bypass 的交互会话另有例外”和“严格只读须读工具或只读挂载且无外部写凭据”三处。按原引用读 Claude 官方 permission-modes／best-practices，必要时追官方 CLI reference、版本变更与计划执行转换说明。
逐项核 CLI／交互／非交互入口范围、计划前后允许的工具动作、shell 与计划文件写入的文档例外、退出计划后权限如何继承；区分具体文档保证与页面作者安全建议。官方没有保证的当前客户端行为标未知，不据模式名、宣传或一条示例推断所有环境。
不把官方可用绕过选项变成当前环境操作建议；不读取或改变任何实际权限。只说明页面原句是否准确和必要限定，推荐“直接做／先计划”的条件由负责人保留，不因核查而改成一律先计划。
去重：A-PERMISSION-BOUNDARY-FACTS 核 Codex 原生 profile、Claude acceptEdits／sandbox 与配置层级，本卡不重做；A-MODEL-ENTRY-CONSISTENCY 核模型前提，本卡不涉及模型；A-SKILL-PAGE-FACTS 核 Skill 选择，本卡不重核 Superpowers／OpenSpec／Spec Kit，不重开两张广扫或旧 reader。
只读公开官方材料，不运行客户端、shell 示例、模型、浏览器或探针，不安装，不读本机配置、私人会话、进程、凭据或账号用量；不修改安全设置、接收脚本或调度。来源被明确拒绝就保留缺口，不换身份／代理绕过。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-PLAN-MODE-FACTS-20261103/facts.md`；接收端只另更新本卡状态与当前结果。不改页面、模板、TASKS、其他卡、代码、权限或计划，不合 main。
先列影响现有读者操作的事实差量，再列原句／位置、直接来源、原始日期与读取日、适用版本／平台、确认或更正及未知。没有变化就交真实已核范围，不为交差制造新结论；必要补句保持最小。

## 怎样算做成
非作者核出处直接支持和限定范围，严格区分官方工作模式、宿主权限、真正隔离与用户授权；不得把材料核对称为本机 Plan 实跑或安全保证。事实接收不升级页面或模板采用。
最多两小时，共享最多 4 并行由原接收端调度，不另开调用。跑 check_repo、check_public、git diff --check 与提交身份检查，仅推 result_branch，回 review_ready 供负责人接收；不用 accept: auto。

## 当前结果

- taskDone=true。已在 facts.md 先列 6 条读者操作相关事实差量，再逐项核对 planning-and-tests 页「先 Plan」段三处主张的官方出处：入口 `claude --permission-mode plan` 准确；Plan 并非只读，auto 可用且 useAutoModeDuringPlan 默认开启时 shell 由分类器逐条审（2.1.218 起含不能静态判定只读的 Bash）；bypass 例外仅限交互终端且同时放行计划阶段的文件编辑，-p/SDK/VS Code 聊天面板不适用；批准计划只切换到 auto/Manual/bypass，不等于外部写授权；严格只读属页面作者安全建议而非官方保证。另标出同页 L14 best-practices 锚点当前不可达（附项，页面未改），官方文档无内容日期、changelog 发布日期因 GitHub API 限流未取到。check_repo（719 files, 0 errors）、check_public（1181 files, 0 findings）、check_public --commits（0 findings）、git diff --check、编码与提交身份检查均通过；未运行客户端/交互 shell/模型/浏览器/探针，方法结论为文档契约核对而非本机 Plan 实跑或安全保证。pageStuck 不适用（非 reader-test）。openIssues 无。
- 产物：[a2b2fa0](https://github.com/dbvv1/a1dbv/commit/a2b2fa012f73902bd2472195001290559591f2ef)，分支 `relay/a-plan-mode-facts-20261103`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：负责人决定是否据 facts.md 修订页面（含同页 L14 锚点不可达与来源日期缺口）；接收端负责提交并推送 result_branch。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 负责人限定接收（2026-11-03）
- 接收 [a2b2fa01](https://github.com/dbvv1/a1dbv/commit/a2b2fa012f73902bd2472195001290559591f2ef) 的官方文档事实：CLI Plan 入口、auto／`useAutoModeDuringPlan` 的 shell 审核、仅交互终端 bypass 的编辑与 shell 例外、`-p`／SDK／VS Code 区分、默认计划目录、批准后的模式切换。页面负责人逐源独核并经非作者审查，将必要修订发布且逐字回读为 [6a82ac9a](https://github.com/dbvv1/a1dbv/commit/6a82ac9a2b352a8bb2a3fda151cde849a947de7b)；文档、公开内容、提交身份和空白检查通过，保留原推荐、评级和实证范围。
- 保留原报告，另作两处收窄：best-practices 页面可达，当前可见正文没有原引用章节；未核隐藏 HTML 兼容 ID 或历史版本，不将其概括为整个页面不可达。批准计划切换权限模式是官方事实，操作范围仍须符合本次任务授权是作者原则，不据此声称官方绝对否认用户对具体计划的有效授权。
- 接收不等于当前客户端实跑或安全保证；严格只读建议由工具、MCP／hook 和实际挂载边界推导。未验客户端、只读挂载失败行为、未批准退出 Plan 的模式去向及所有宿主／历史版本；来源发布日期缺口保留。原 `taskDone`／审查通过不替代上述限定，不新增 reader，不改变权限或配置，不升级地图。
