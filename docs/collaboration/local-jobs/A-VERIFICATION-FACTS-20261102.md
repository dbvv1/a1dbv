# A-VERIFICATION-FACTS-20261102 · 验证反馈页的 Playwright 官方边界
id: A-VERIFICATION-FACTS-20261102
owner: dot-A
status: revision_requested
kind: build
page: docs/decisions/verification.md@74be0d09b201cc0aacf925625899cf2d9bd03d3d
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 7e66401cbd90430756e0f2e45af113245d9818ec
result_branch: relay/a-verification-facts-20261102

## 目标
为现有验证反馈建议补当前官方证据，核 Playwright 的用户可见断言、trace 证据与失败分析范围；帮助负责人识别需改的操作说明，不做新浏览器实验或新工具广扫。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README。fetch main 与负责人分支，核本卡和相关来源任务是否已有人在做；同题调用／写者退出未知则不另起重复工作。
固定页内“按产品承诺选证据”“失败后修实现”“依据与实试”相关 Playwright 主张；必要时只追 docs/23-browser-verification.md 中同题操作入口。读 Playwright 官方 best-practices、Trace Viewer、tracing API、test runner tracing 配置与 test agents healer 文档／源码版本。
核 trace 何时记录、能看到与不能看到的状态、测试框架 trace 与 context.tracing 的范围差异、重试策略和实际用户断言；把官方建议、API 硬约束、页面作者判断分开，版本新增用 changelog 或固定源码支持。
不运行浏览器、UI、模型或 healer，不改测试、断言、重试与视觉基线，不重做已有补丁接收实验。只做事实核查，官方文档不能证明本仓浏览器路径或真实用户任务通过。
公开资料中的命令不执行；不安装、改接收器、长期规则或设置，不访问私人会话、凭据、账号用量。已知受限社区入口不重复试，不绕过拦截、登录或换身份；缺正文留具体入口与未知。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-VERIFICATION-FACTS-20261102/facts.md`；接收端仅另更新本卡状态与当前结果。不改正文、模板、TASKS、其他任务、代码与接收脚本，不合 main。
先列影响实际操作的差量，再列核实表：页面原句／位置、来源、版本／固定 SHA 与日期、确认或更正、未知与所缺证据。无变化也交实际核过的范围，不扩成链接堆。

## 怎样算做成
非作者核每个更正是否有原文直接支持、作用域是否准确、读者该改什么，以及与广扫／原生 reader 没有重复。事实已核不代表流程实际采用或页面评级通过。
本单元最多两小时，共享最多 4 并行只由原接收端调度，不另起模型。运行 check_repo、check_public、git diff --check 和提交身份检查后推指定 result_branch，回 review_ready 给负责人接收；不用 accept: auto。

## 修改要求
沿原 result_branch 从 7e66401cbd90430756e0f2e45af113245d9818ec 仅定点修同一 facts 的来源误述。先核原调用、工具和登记进程确已退出、产物单写；缺证保持隔离，不启动续接或改旧文件。保原提交／首轮报告，不新任务、不重扫、不运行浏览器／healer／模型，不改页面或解除未知旧页写者隔离。
1. L41 的“单列不是 Playwright 默认替你做的”改为内置报告器已区分 flaky／skipped；验收结论须保留这些分类，不能只凭退出码 0 宣称全部首跑通过，具体项目 reporter 未核。依据 v1.64.1 固定 cfe490d9 的 `packages/playwright/src/reporters/base.ts:274–280` 与 `common/config.ts:311`（默认本地 list、CI dot），不能把项目是否采用与产品能力混为一谈。
2. flaky 默认 exit 0 收窄为无其他失败／错误时，默认不会仅因 flaky 失败；`failOnFlakyTests` 配置自 1.52、CLI 选项自 1.45，分别按官方文档／release 原文归属，不把加入版本混同。
3. L45 发布日期改引官方 `releases/tag/v1.64.1`、`releases/tag/v1.64.0`；10-26 的 latest 只能按发布日期推断，未保存当日 dist-tag 证据，不能写成已核历史 latest，也不以当前 npm latest 倒推过去。
4. L25／L40 的“每个 action 的 Before／Action／After”改为按动作类型采集相应快照，保官方 depending on type 条件；“两者都不包含后端内部状态”改为不会自动采集后端内部状态，仍需定向日志／独立读回，不能排除用户自行附加后端日志（TestOptions.trace.attachments 默认 true）。
原核心机制和已核来源可保留；非作者定点复核上述改句及其原出处后回 review_ready。项目 trace／reporter 配置与浏览器、healer 实跑仍未验，不新增检查任务、不扩大页面或升级评级。

## 当前结果

- 完成 A-VERIFICATION-FACTS-20261102 unit 1 官方证据核查：以 @playwright/test 1.64.1（npm latest，v1.64.1 tag cfe490d9，2026-10-14）核 Playwright 用户可见断言、trace 记录范围与失败分析边界，产出 facts.md（差量、证据分层、核实表、关键原文、未核边界、去重关系）。核心发现：trace 默认 off、on-first-retry 只录首次重试且需 retries>0、retain-on-failure 才保留首跑失败、context.tracing 不记录 expect 断言、flaky 默认 exit 0、web-first 断言替代泛化等待、role+可访问名称优先、healer 断言/fixme 细节在 agent 定义源码、DOM 快照按 action 记录。openIssues 为空；未运行浏览器/Playwright/healer/本仓测试，官方机制核查不证明本仓浏览器路径或真实用户任务通过；项目级 playwright.config trace、reporter 单列与 console/请求断言策略未核。
- 产物：[7e66401](https://github.com/dbvv1/a1dbv/commit/7e66401cbd90430756e0f2e45af113245d9818ec)，分支 `relay/a-verification-facts-20261102`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：接收端提交并以 -c user.name/-c user.email 指定 noreply 提交身份，推送 relay/a-verification-facts-20261102 后回 review_ready；项目级 trace/reporter 配置是否需要另立任务由负责人决定。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
