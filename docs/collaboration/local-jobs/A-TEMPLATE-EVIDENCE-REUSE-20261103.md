# A-TEMPLATE-EVIDENCE-REUSE-20261103 · 最小包的证据复用一致性
id: A-TEMPLATE-EVIDENCE-REUSE-20261103
owner: dot-A
status: running
kind: build
page: docs/decisions/long-tasks.md@b1427c5e4bfb172d1dd9e39b424c05514115444d
target_repo: https://github.com/dbvv1/a1dbv
base_ref: b1427c5e4bfb172d1dd9e39b424c05514115444d
result_branch: relay/a-template-evidence-reuse-20261103

## 目标
为已确认的模板与路线冲突交一份最小可接收建议：task-decisions §7“旧版通过不沿用”无条件排除旧证据，但当前长程页／handoff 已允许核受检范围后复用未受影响的结果。修订目标是准确区分复用原证据与冒充新运行，不是增加每次任务的登记或验收层。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README，fetch main 与负责人分支核同题在途；按固定 base 逐字回读下面的原句和上下文，再作建议。新事实只补来源，不改固定输入。
固定矛盾：templates/generic/.claude/skills/task-decisions/SKILL.md §7 的“完成按当前版本的原验收核对……旧版通过不沿用”；对照 docs/decisions/long-tasks.md“检查有效，但 main 或提交 SHA 已变”行、templates/generic/.claude/skills/handoff/SKILL.md 的“只有提交 SHA 变化或无关文件改动，不自动使全部结果失效”及 templates/generic/CLAUDE.md 的既有结果复用条款。给准确原句／位置，不先把任何版本变更当无需复验。
权限与归属前提：dot-a/skills-round-20261029@017a3363 的未合候选只改同一 Skill 的 §3，旧写者退出仍未知。本卡不得修改该 Skill 或在其他路径复制一份可启用替代品，不合旧候选、不接管其写域；仅交独占建议文件供原写者/负责人核清后选择。
去重：A-SKILL-TEMPLATE-READER-20261029 已 accepted 的写域是 AGENTS／模板 README，明确不改 Skill；本卡只处理未覆盖的 §7，不重做其加载/匹配路径或任何 reader，不追两张 blocked 广扫，不重复 Worktree 隔离事实卡。
候选只改一处必要条件句，保留通过／失败／未运行／阻塞区分、预算停止不是完成、发布须在授权内且核实际渠道。不要改 frontmatter、显式调用、其他小节、既有评级或历史实测日期；不把它扩成整套恢复框架。
用三个最小版本影响例子核建议含义：仅不相关文档／提交 SHA 变化；受检代码、直接消费者或相关依赖环境确实改变；影响无法确定或只有旧版成功自报。说明哪些原证据可保留、为何可复用或须复验，保原版本和失败记录，不重贴标签。例子仅核规则含义，不称代码／模型／客户端实跑。
只读本仓公开固定文件与历史，不读取私人会话、原写者进程、本机设置、凭据或用量，不安装／调用模板 Skill／客户端／模型／浏览器，不执行恢复、清理或外部写操作；不尝试解除旧写者隔离。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-TEMPLATE-EVIDENCE-REUSE-20261103/proposal.md`；接收端仅另更新本卡状态与当前结果。不改模板、页面、TASKS、其他卡、源码、脚本或设置，不生成补丁自动应用器，不合 main。
产物先给原句→最小候选句及必要理由，再列三个语义例子与固定来源；结尾明确旧写者核清前不能应用、模板未改和实际采用未验。若发现新的同题产物则只交归属差异，不复制另一套。

## 怎样算做成
非作者逐字核真实冲突及最小范围：既不强迫重跑所有旧检查，也不放过有影响／影响不明的路径；事实版本、依赖环境和原验收条件齐备才允许复用。只接建议材料，不称目标模板已改、安装或采用，不升级地图。
最多两小时，共享最多 4 并行由原接收端调度，不另起调用。check_repo、check_public、git diff --check 与提交身份检查通过后仅推 result_branch，回 review_ready；不用 accept: auto。

## 当前结果
尚未领取；独立建议任务输入齐备，产物待交；同文件旧写者归属仍未解除。
