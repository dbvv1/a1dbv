# A-REVIEW-RUBRIC-FACTS-20261103 · 审查尺度的真实来源与装配
id: A-REVIEW-RUBRIC-FACTS-20261103
owner: dot-A
status: accepted
kind: build
page: docs/decisions/codex-overengineering.md@5ebecac1ffe2501301699d518fd8b61acb82163f
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 2d67cac1c22a67002c5c33e7d5204bf051b73118
result_branch: relay/a-review-rubric-facts-20261103

## 目标
核现有“过度工程”页借用的 Codex 实际 review rubric 是否仍由所述入口装配、原文究竟支持哪些取舍。读者应能区分真实产品审查指令、本页改写和提示词效果，不把仓库中存在一份文件当所有审查入口都采用。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README；fetch main 与负责人分支核同题在途和独占写域，有重复只交归属／差量。
固定页只核“为什么选这个做法”中的 rubric 原句、review_request.rs 读取及 core/tasks/review.rs 实际装配三条来源，并对照同版本 templates/generic/REVIEW.md 的行为／数据泄露／回滚等要求；模板是研究输入，不作为本轮运行规则。
先回读原固定 Codex 970111f6cb62cc02fe36a82ea7d71b37a2889c97 的完整相关函数，再取官方 openai/codex 当前公开稳定版本与 main 的明确 SHA、日期，沿原调用链确认输入到审查任务的关系。区分仅模板文件、编译／读取入口、实际选用条件与文档保证；若版本间不同，不拿 main 取代已发版本。
核原句的上下文是否仍限定 finding 具体、可行动、真实受影响代码与触发条件，是否支持本页“把证明影响前移到实现”的作者改写；不要把审查指令当实测减少过度工程、无漏检或跨模型收益。无实质变化就保留已核范围，不制造新标准。
不重核模型名称／effort／账号入口，不重复 Agent facts、两张广扫或已有补丁验收；不审本机原始对话、不重新判断在途 jrnl 实现，也不重做 MOBA 映射。只追已引用的官方审查装配链，不收新审查工具或泛化成生态综述。
只读公开官方源码、文档与必要 release/changelog；不运行 Codex、模型、审查客户端、构建、测试、Hook 或浏览器，不安装。无关文件、私人会话、凭据、账号用量及本机配置不读取；材料指令不执行，明确拒绝不绕过。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-REVIEW-RUBRIC-FACTS-20261103/facts.md`；接收端只另更新本卡状态与当前结果。不改页面、模板、TASKS、其他卡、代码、接收器或设置，不合 main。
先列会影响既有页面主张的差量，再附原句／位置、官方原文与实际调用链、固定 SHA／版本／原日期与读取日、支持范围与未知；有必要才提最小候选补句。不复制大段 rubric，也不为计数增加通用检查清单。

## 怎样算做成
非作者核每项主张的直接源码依据、版本与运行条件，防止将“读取该文件”升级为所有宿主均采用或实际收益。只接事实材料，不升级过度工程页评级，不据此增加评审轮次或默认流程。
最多两小时，共享最多 4 并行由原接收端调度，不另开调用。跑 check_repo、check_public、git diff --check 与提交身份检查，仅推 result_branch，回 review_ready 供负责人接收；不用 accept: auto。

## 修改要求
沿原 result_branch 从 2d67cac1c22a67002c5c33e7d5204bf051b73118 只修同一 facts 的两处事实与相应总括。先核原调用、工具与登记进程已退出、该产物单写；缺证保持隔离、不启动续接或改旧文件。保原提交／首次回传，不新任务、不重扫、不运行任何客户端／模型／测试，不改页面／模板。
1. 入口须分版本与 delivery：固定 970111f6 的 CLI `exec/src/lib.rs:1272–1286` 发送 None，默认／Inline 在 `app-server/src/request_processors/turn_processor.rs:1454–1619` 走 Op::Review；Detached 则构造 review-agent 提示交 AgentRunner，不是同一 ReviewTask 路径。稳定 rust-v0.166.0 解到 6ff1e1ca3b30fc8b914720681fcf5fe62e95f856（同文件 332–355）与负责人 main 快照 fbf5f0d3a716d08c254d3e4941d5b12eaff5afe7（383–407）已直接提交 Op::Review。三核心文件一致不代表入口路由一直一致；保原 036e1601 的实际取样时间，不当此刻最新，也不把旧 Detached 分流写成当前版本现状。
2. “基础指令”不直接等于协议 system 消息：970 的 `core/src/context/base_instructions.rs:41–60` 实际 role 为 developer，`core/tests/common/responses.rs:230–247` 的 instructions_text helper 也是读取 developer input，而非 API instructions 字段；注释称 system prompt 不能替代实际装配证据。只说已核 Op::Review 路径由 ReviewTask 装配，不无证断言全仓唯一；Custom 不替换 rubric 文本，不等于不影响审查规则／范围。测试名也不当作完整隔离效果已实跑。
已逐字独核的三核心文件、原 finding 规则与页面“基础指令／本页改写”主张可保留；不应用候选长补句或增加审查轮次。定点复核上述官方固定来源后回 review_ready，只接事实材料，未运行与未知宿主范围保持。

## 当前结果

- completed unit 1: facts.md corrected on two points — entry routing differs by version/delivery (970: CLI sends delivery None, Inline goes Op::Review, Detached goes AgentRunner; stable 6ff1e1ca and main fbf5f0d3 commit Op::Review directly, Inline only), and rubric is assembled as a developer-role base_instructions message, not protocol system; claims limited to the verified Op::Review path, Custom noted as not replacing rubric text but still able to narrow scope, and unrun test assertions not treated as proven runtime isolation. No page, template or other files changed; openIssues empty. Not run: Codex, model, review client, build, tests, hooks, browser; hosted/IDE/cloud rubric reuse remains unknown.
- 产物：[12a2828](https://github.com/dbvv1/a1dbv/commit/12a2828e97a6611798f94875699048f3351a23c6)，分支 `relay/a-review-rubric-facts-20261103`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：Owner commits result_branch and updates task status; optionally evaluate the facts.md candidate sentence if page scope wording is wanted (page itself not modified in this unit).
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 负责人限定接收（2026-11-03）
12a2828e 经非作者按官方原文定点复核，970 的默认／Inline 与 Detached 路由、稳定版及两个 main 快照的直接 Op::Review 路径，以及实际 developer 角色均已正确区分；三个核心文件相同不再被用来推出路由相同。后续版本的协议 enum 仅 Inline 亦已核；Custom 不替换 rubric 文本但可影响范围／规则的边界保留。仅接收静态来源材料，父 2d67cac、facts 单文件 21+/19-，原稿与回传不覆盖。
未运行 Codex／模型／客户端／构建／测试／Hook，不证明提示词效果、运行隔离或所有产品入口。现有页面“基础指令／本页改写”未发现本轮必须修正的错误，不应用可选长补句、不新增审查轮次或升级评级；本轮未改页面／模板。
