# A-VERIFICATION-FACTS-20261102 · 验证反馈页的 Playwright 官方边界
id: A-VERIFICATION-FACTS-20261102
owner: dot-A
status: running
kind: build
page: docs/decisions/verification.md@74be0d09b201cc0aacf925625899cf2d9bd03d3d
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 21b5f4ab0d4c78c73a2ef57502a4a49ba70fb991
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

## 当前结果
尚未领取；事实产物待回传。
