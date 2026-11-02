# A-CONTEXT-SOURCES-FACTS-20261102 · 上下文页文件与检索来源事实核查
id: A-CONTEXT-SOURCES-FACTS-20261102
owner: dot-A
status: review_ready
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

- 已写入 facts.md（55 行），核对固定页输入版本与 74be0d09 blob 字节一致；确认 Claude @ 的 25,000 token/256KB/目录/二进制/禁用变量条件、压缩后最多重读 5 个文件且超过 5,000 token 只留 Referenced file、Codex @ 官方仅说明加入路径、Cursor 两帖症状区分且修复版本未知、Git 契约成立；发现 best-practices#provide-rich-content 锚点失效应改指 #write-a-specific-prompt。check_repo/check_public/git diff --check 均 exit 0；未启动客户端实测，未复跑页面提到的 rg/grep 阳性对照，GitHub 远端页面未能取回。openIssues: []
- 产物：[1803ea2](https://github.com/dbvv1/a1dbv/commit/1803ea20df306698a4d9fb702085c2fb482a4c72)，分支 `relay/a-context-sources-facts-20261102`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：接收端提交 facts.md、推送 relay/a-context-sources-facts-20261102 并回 review_ready；正文更正（锚点与阈值精度）需负责人另行决定，本卡不改正文
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
