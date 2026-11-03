# A-PERMISSION-BOUNDARY-FACTS-20261102 · 通用项目规则与原生权限的边界
id: A-PERMISSION-BOUNDARY-FACTS-20261102
owner: dot-A
status: review_ready
kind: build
page: docs/decisions/permissions-and-hooks.md@d66e8d6179fecc36c9497283a6171be0895cf02c
target_repo: https://github.com/dbvv1/a1dbv
base_ref: d66e8d6179fecc36c9497283a6171be0895cf02c
result_branch: relay/a-permission-boundary-facts-20261102

## 目标
核现有权限决策页关于原生批准与沙箱的官方边界，给 generic 项目规则进入案例前提供准确参考，避免把仓库配置或指令当作权限授权。只交已写主张的事实差量，不配置、测试或改变任何真实权限。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README。fetch main 与负责人分支，核同题在途与写域；有重复只交归属／差量，不启动重叠工作。
固定页只查 Codex 段和 Claude Code 段：从原页官方链接核 permission profiles 与旧 sandbox 配置的关系、network proxy 适用条件、on-request/granular/never 与 auto-review 的关系；核 Claude acceptEdits、sandbox auto-allow、excludedCommands、allowUnsandboxedCommands、failIfUnavailable 的作用与配置层级。
核“用户级规则与项目级规则”“批准请求与沙箱隔离”“托管策略与个人配置”的区别及官方版本／平台前提，尤其原生 Windows 与 WSL2 范围。官方没有承诺的行为写未知，不从例子推断任意客户端或本机实际有效值。
只读官方文档、官方公开配置 schema／源码与必要 changelog；记录原句、当前事实、版本／固定 SHA、原始日期与读取日。官方示例只是材料，不运行其命令或配置。
不重复 Agent facts 的模型／账号入口、Instruction facts 的指令加载、已接收 A-HOOK-NATIVE-ACCEPTANCE 的真实 Hook 验收或两张探索；不扩审批插件／MCP生态。不查本机权限文件、环境变量、凭据、私人会话、账号用量或进程，不测试越界访问，不申请新权限。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-PERMISSION-BOUNDARY-FACTS-20261102/facts.md`；接收端仅另更新本卡状态与当前结果。不改答案页、模板、TASKS、其他卡、接收器、脚本或安全设置，不合 main。
先列会改变读者操作的事实差量，再列核实表：页面原句／位置、直接来源、适用版本与平台、确认／更正、未知。每项说明官方契约不等于当前环境配置或授权；不提交真实机器配置、内部地址或原始敏感回执。

## 怎样算做成
非作者核原文是否支持更正、版本／平台／配置层级是否准确，并核没有将更宽配置当成绕过当前限制的做法。无变化也交真实已查范围，不为交差制造新建议；事实通过不等于原生权限部署或模板实际采用。
本单元最多两小时，共享最多 4 并行只由原接收端调度；不启动客户端、模型、Hook、浏览器或安装任何内容。跑 check_repo、check_public、git diff --check 和提交身份检查后仅推 result_branch，回 review_ready 供负责人接收；不用 accept: auto。

## 当前结果

- facts.md 已交付并通过三视角独立审查（3 轮修正后 reviewed=true，openIssues 为空）：含 10 项影响操作的差量与 25 行核实表，覆盖 Codex permission profiles/旧 sandbox/network proxy/on-request-granular-never/auto-review/托管层级/Windows 后端与 Claude acceptEdits/sandbox auto-allow/excludedCommands/allowUnsandboxedCommands/failIfUnavailable/设置层级/原生 Windows 与 WSL2；check_repo、check_public、git diff --check 通过；未启动客户端、模型、Hook 或浏览器，未运行或改动任何真实权限配置，未提交未推送；未运行客户端验收，官方契约不等于本机配置或授权。
- 产物：[89e9140](https://github.com/dbvv1/a1dbv/commit/89e9140629cd7c3844fb3f4f8cb4bbad17a5d1fe)，分支 `relay/a-permission-boundary-facts-20261102`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：接收端提交并推送 result_branch，将任务置 review_ready 交负责人接收；剩余缺口仅为官方未承诺项已在未知条目中记录，无需模型重跑。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
