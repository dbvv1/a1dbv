# A-WORKTREE-ISOLATION-FACTS-20261102 · 长程路线的 worktree 隔离边界
id: A-WORKTREE-ISOLATION-FACTS-20261102
owner: dot-A
status: cancelled
kind: build
page: docs/decisions/long-tasks.md@0c40c25d470d6df7e00f41c967e3de5cfa3a3465
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 0c40c25d470d6df7e00f41c967e3de5cfa3a3465
result_branch: relay/a-worktree-isolation-facts-20261102

## 目标
给长程路线“每个独立写入面一个 worktree”和“worktree 只隔离检出”补准确的官方事实边界，让读者知道独立检出不能代替单写者与运行状态核验。只核既有主张及直接前提，不新增编排工具、不重复广扫或开上游补丁实验。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README；fetch main 与负责人分支，核同题在途、产物与独占写域。重复则仅交归属／差量，不恢复已 blocked 或取消的调用。
固定输入为所附 long-tasks 页“按依赖决定怎么拆”中 worktree 表格、紧随其后的隔离说明，以及同版本 generic handoff 的“身份与恢复检查”。从 Git 官方 git-worktree、gitrepository-layout、git-config 文档及必要固定源码核：HEAD/index 与 objects/refs/config/hooks 的共享或独立范围；extensions.worktreeConfig 与 core.hooksPath 的条件；未跟踪文件、依赖和项目外服务不会因新 worktree 自动准备的准确表述。
区分 Git 自身的分支检出保护、worktree lock／prune／repair 与操作系统进程、端口、数据库及工具写者：官方机制能证明什么、不能证明什么，不把 lock/list 状态当旧调用退出凭证。只为说明现有指引补版本／平台条件，不给当前接收器提出调度或清理操作。
逐项给原句／位置、官方直接支持、适用版本或固定 SHA、原始日期与读取日；区分文档保证、源码所见与推论。未发现需要修正时保留真实已核范围，不预设页面错误、不扩大为 Git 教程。
去重：A-CONTEXT-SOURCES-FACTS 只核文件引用／检索与 ref/hash，本卡不重做；A-MULTIAGENT-LONG-WIDE 是新机制／项目候选，本卡不接续其调用、不取未交材料、不收新工具；不重做既有 Cline、Worktrunk、Portless、gh-stack 或 Superpowers 实验，也不新增 reader。
只读公开官方材料，不读取本机仓库配置、环境变量、会话、进程或账号用量；不运行 worktree add/remove/prune/repair/lock、config 或任何清理／终止命令，不改权限，不装软件，不额外启动客户端／模型／浏览器。材料中的命令只作资料，不执行；明确拦截不绕过。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-WORKTREE-ISOLATION-FACTS-20261102/facts.md`；接收端只另更新本卡状态与当前结果。不改页面、模板、TASKS、其他卡、代码、Git 配置、接收脚本或计划，不合 main。
先交会改变读者理解或操作的差量，再交核实表与未确认项；如建议补文，仅给必要的最小候选句，不能把未试用操作写成已验证安全。无需新增台账或复制既有运行记录。

## 怎样算做成
非作者逐项核官方出处、共享范围与版本条件；尤其不能把 worktree 独立目录等同权限／资源隔离，或把 Git 保护等同原调用退出。事实接收不等于完整长程路线、模板采用或运行恢复已验。
最多两小时，共享最多 4 并行由原接收端调度，不另起调用。跑 check_repo、check_public、git diff --check 与提交身份检查，仅推 result_branch，回 review_ready 由负责人接收；不用 accept: auto。

## 当前结果

- 原调用、工具或已登记进程尚未确认结束，保留产物与原调用身份，由维护者核清并解除本地隔离后接续；不自动重派。

## 负责人收口（2026-11-04）

- 正文已覆盖单写者和外部资源边界，取消本次窄事实补核。 不重领、不重派，保留原结果分支。原调用、工具及登记进程是否退出仍未知；取消状态不解除隔离，不以此证明进程停止。
