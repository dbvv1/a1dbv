# A-SENTRY-MIGRATION-CONTRACT-20261103 · 分清迁移阶段并撤除临时规则
id: A-SENTRY-MIGRATION-CONTRACT-20261103
owner: dot-A
status: running
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 147f3353dfaf0640f9e9a129da3bd9b6f82ae152
result_branch: relay/a-sentry-migration-contract-20261103

## 目标
给正在让 Agent 分阶段升级依赖的开发者一个可直接判断的答案：何时可用新 API、应该跑哪套验证、何时撤掉双版本与兼容指令。以 Sentry 已完成的真实迁移为证，不另造迁移任务。
现有15 §5已讲差异试点、类型与真实消费者，但未区分新导入路径、有效运行时、配套adapter与不同环境；共享指令页“版本值指向配置”也不足以解释别名阶段。不是否定现有建议，新增只针对并行版本迁移。

## 按哪个 Skill 与规格做
读 AGENTS、CLAUDE、TASKS、手册§7、operations§2.2 与 local-jobs README；只读 write-task-guide 以保真实任务、可用动作和未试用边界，本卡不执行其广扫或另造读者。
固定本仓输入：base_ref 的 docs/15-task-playbooks.md §5、docs/decisions/instruction-files.md 第一步、docs/collaboration/inbox.md“SDK迁移与按改动构建”；先核最新同题与写域，不重复已排卡或修改未知旧写者页面。
固定反馈一：https://github.com/getsentry/sentry/pull/126570#discussion_r4198722076 ，2026-10-06 人工指出两条AGENTS规则不清楚应采用V6还是V8；修订 https://github.com/getsentry/sentry/commit/8891ab865ca741f83cbcd20349bd21c03ad92ffc 区分V8导入和V6 runtime。
固定阶段二：9d75e921c32de2d4c122fbc5e4cff39d16175172 的 build-utils/react-router.ts、react-router.test.ts、static/AGENTS.md；核开发/生产/preview/CI/test选择、router与Nuqs adapter共同切换，以及bundle内版本/共享context/导航断言。
固定反馈二：https://github.com/getsentry/sentry/pull/127030#discussion_r4232760642 质疑双typecheck的成本；https://github.com/getsentry/sentry/pull/127030#discussion_r4232753329 要求标明迁移后清理项。只作真实取舍反馈，不把评论等同错误已证。
固定退场：de3060f736c6dd55836bfae104336a967ec41d8d（PR128415，2026-10-22）删除V6依赖、双版本runner/CI与迁移专用检查，同时改AGENTS；当前固定638617e31ccc9d303c6fd113d2e2fcd633257a60（2026-11-03）的static/AGENTS.md和static/app/package.json已是V8。
逐项追到官方固定文件，区分历史阶段和当前状态；PR自述85项/121项等检查只能标作者自报，源码存在和合并不能算本卡实际运行或模型收益。不要裁定未充分核证的AI review真伪。
先给15 §5的一段最小可采用补充稿：按实际解析/环境选择决定写法和验证，兼容层与配套依赖一起核，完成切换后清理临时规则和重复检查；必要时只列共享指令页的链接同步建议，不另写第二份长指南。
一条代表性指令示例需同时说清允许的导入/API、有效runtime、适用环境、相应检查和撤除条件；标为据源码归纳的示例，不伪称Sentry逐字原文或当前应继续V6。
不适用须包括：单版本无分阶段迁移不加双矩阵；只改导入不能称升级完成；同包版本号不能替代别名/adapter解析；退出条件未满足不能仅因测试成本删旧支持。
去重：本仓固定树与两广扫已查无126570/127030/128415/reactRouterV6；inbox旧SDK为Anthropic/Hermes，与本题不同。这里保留核查范围，不由Git无差量推未知写者已退出。
只读公开源码和反馈；不安装、构建、运行Sentry或模型，不访问账户/配置/凭据/真实用户数据，不投稿、接PR或执行来源建议命令。网络无法读到关键固定来源时报告缺口，不以摘要替代。

## 写入范围
只写 docs/collaboration/local-jobs/artifacts/A-SENTRY-MIGRATION-CONTRACT-20261103/proposal.md；接收端只另更新本卡状态及当前结果。
最前给可直接合入15的最小正文候选，随后附原句缺口、阶段→固定来源、反馈与适用限制；正文链接按未来15落点核对。不得改15/共享指令正文、研究页、模板、13、指导文件、TASKS、其他卡或接收器。

## 怎样算做成
非作者从固定原文和源码独立回答：V8导入是否足以允许V8行为；阶段二哪些环境运行哪个major/adapter；切完后哪些临时验证和规则应撤、哪些行为仍保留。逐问给证据与候选位置，至少核一个反例。
候选不得把历史V6写成现状，不承诺普适收益，不把静态审稿升为真实迁移/新读者通过；若现有15实际已覆盖同一选择，返回负结果而非硬添一段。
一个45–75分钟单元，最多两小时；原接收端共享最多4并行调度，不另起调用。按既有Workflow非作者审查、check_repo、check_public、git diff --check与身份检查，仅推result_branch回review_ready；不用accept:auto，不合main。
