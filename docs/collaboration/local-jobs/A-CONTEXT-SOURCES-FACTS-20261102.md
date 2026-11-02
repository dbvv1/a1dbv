# A-CONTEXT-SOURCES-FACTS-20261102 · 上下文页文件与检索来源事实核查
id: A-CONTEXT-SOURCES-FACTS-20261102
owner: dot-A
status: ready
kind: build
page: docs/decisions/context-management.md@74be0d09b201cc0aacf925625899cf2d9bd03d3d
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 21b5f4ab0d4c78c73a2ef57502a4a49ba70fb991
result_branch: relay/a-context-sources-facts-20261102

## 目标
为现有上下文管理页核文件内容引用与检索来源的当前官方事实，交影响读者定位和恢复的最小差量；不做多代理／长程广扫，不发起压缩、恢复或模型调用实验。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README。fetch main 与负责人分支，核本卡和相关来源任务是否已有人在做；同题调用／写者退出未知则不另起重复工作。
限固定页“搜索为零”“指定页面版本”及检查点段的文件引用、源内容与路径区别：核 Claude @ 文件输入和压缩后 Referenced file 的官方语义、Codex @ 文件选择是否只加入路径、Cursor ignore/worktree 检索边界，以及 Git ref 固定与 hash-object --no-filters 的官方契约。
不重复 A-INSTRUCTION-FACTS 的 AGENTS/CLAUDE 启动发现、优先级、导入批准核查；不核模型/effort、不查真实会话与账号用量。历史 Cursor 故障的修复版本若官方未交代就写未知，不从发布时间或搜索摘要猜已修。
只从原页已有一手链接追当前官方正文、changelog、公开源码与公开维护者澄清；记录版本、原始日期与本次读取日。公开使用报告保留自报标签，不能将源码可读、文档存在当作实际客户端检索或接续通过。
公开资料中的命令不执行；不安装、改接收器、长期规则或设置，不访问私人会话、凭据、账号用量。已知受限社区入口不重复试，不绕过拦截、登录或换身份；缺正文留具体入口与未知。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-CONTEXT-SOURCES-FACTS-20261102/facts.md`；接收端仅另更新本卡状态与当前结果。不改正文、模板、TASKS、其他任务、代码与接收脚本，不合 main。
先列影响实际操作的差量，再列核实表：页面原句／位置、来源、版本／固定 SHA 与日期、确认或更正、未知与所缺证据。无变化也交实际核过的范围，不扩成链接堆。

## 怎样算做成
非作者核每个更正是否有原文直接支持、作用域是否准确、读者该改什么，以及与广扫／原生 reader 没有重复。事实已核不代表流程实际采用或页面评级通过。
本单元最多两小时，共享最多 4 并行只由原接收端调度，不另起模型。运行 check_repo、check_public、git diff --check 和提交身份检查后推指定 result_branch，回 review_ready 给负责人接收；不用 accept: auto。

## 当前结果
尚未领取；事实产物待回传。
