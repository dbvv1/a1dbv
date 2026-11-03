# A-INSTRUCTION-LIVE-STATE-20261103 · 指令依赖外部状态时先核入口
id: A-INSTRUCTION-LIVE-STATE-20261103
owner: dot-A
status: running
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: ec246c5d314e9280edb221695bd3ab71f3ad7a8f
result_branch: relay/a-instruction-live-state-20261103

## 目标
给按AGENTS执行却一直无回执的开发者一条窄判断：指令依赖仓外队列/规则集的活动状态时，先核权威状态和已有授权，别因文件仍在、静态检查绿就反复执行，也不能擅换发布路径。
共享指令页已讲代码/说明冲突与过时命令，但外部状态可能变了而代码和文件都没变。补该分支，不重写全页、不扩成运行监控平台。

## 按哪个 Skill 与规格做
读AGENTS、CLAUDE、TASKS、手册§7、operations§2.2与local-jobs README；只读write-task-guide保真实问题和未试用边界，不执行广扫/另造reader。
固定本仓输入：base_ref的docs/decisions/instruction-files.md“第一步”及“何时不适用，怎么知道该改了”、docs/18-team-adoption.md相关约定、原A-TEAM-POLICY-DELIVERY卡只作边界去重，不接其blocked调用。
一手失败：https://github.com/PostHog/posthog/pull/75873 ，作者称旧AGENTS规定Trunk必用但实际暂停，45分钟两次评论/贴标无响应。只把这些作为当时作者操作自报，不复算耗时、不把无回执一概断为暂停。
暂停说明固定1057b672e4d195f3d1c2229f9bbda82238f0e2a5（2026-07-31 13:15:36 UTC合并），只改AGENTS.md三处。核其仍保审批/code-owner/检查/签名限制，以及明确标记merging-prs Skill部分过时而没偷偷改其流程。
恢复说明：https://github.com/PostHog/posthog/pull/76456 ，固定d9e416841117402b20ee91dd98cbd35921239a6a（2026-08-03 01:22:27 UTC合并）。正文说提前为重新启用队列恢复指令；核AGENTS三处恢复和Skill注释移除。
日期用REST merged_at的UTC，不沿网页时区写8-02；“恢复文档已合”不是当时/当前远端服务开关已生效的证明。此卡不调查现在PostHog该怎样合并。
原75873作者列出ruleset enforcement、原生mergeQueue与允许merge方法作为其当时核查依据；只核公开PR/固定差量，不实际调用账户、组织、规则集权限或当前仓库设置接口。
76456还改desktop上传门控，本卡不展开该第二题、不审CI更改收益。75873的“瞬时失败再试”不是本卡推荐，不能据此把权限拒绝当缓存而反复重试或改入口。
先给instruction-files现有维护节最小补充稿：对依赖外部活动状态的操作写出权威来源和适用条件；入口无回执时先读已授权的可见状态，区分未启用/暂停/排队/失败/未知，再交负责人修说明或确认原授权内的有效路径。
没有可读状态时保留未知与阻塞，不拿静态文案、时间经过或无bot回复当证据；不要求扩大权限/登录来完成读者判断。
同步检查根约定与实际调用的窄Skill是否矛盾，暂时失效的步骤明确停用范围；不要把整个Skill全部判废，也不永久保留与当前正文冲突的两个操作流程。
操作权与事实分开：确认服务暂停不授权改组织设置、绕过批准/保护、评论、贴标或合并；无新授权不替读者选择有副作用的替代路径。只读调查不等于排错执行授权。
不适用：只依赖固定代码/文件的命令无需每次远端探测；已稳定的入口不加轮询；实际规则仍有效而实现违约时修实现，不以外部状态为由删契约。
去重：固定树与两广扫未见75873/76456/Trunk暂停同题；Team-policy是设置送达，gcx是宿主模式，Sentry是依赖迁移，均不重做。旧共享指令页写者未证退出，保持artifact-only。
不安装、运行上游或模型、不触用户电脑、不联系第三方、不读取私有Slack/账户/凭据、不改权限、发评论/标签或合并。只用公开来源，不执行其建议命令。

## 写入范围
只写docs/collaboration/local-jobs/artifacts/A-INSTRUCTION-LIVE-STATE-20261103/proposal.md；接收端只另更新本卡状态及当前结果。
最前给未来共享指令页的最小正文候选，再附原句缺口、两阶段固定证据、作者自报与未知边界；不改instruction-files/18/其他正文、研究页、模板、13、TASKS、其他卡或接收器。

## 怎样算做成
非作者逐源回答：文件/静态检查正确能否证明队列工作；无bot回执能否证明暂停；8-03合并证明什么；查到暂停是否授权换合并路径。至少核“仍有效的安全/审批要求”和“实际服务状态未知”两个反例。
候选须保现有代码/说明双向取舍，不把历史暂停或文档恢复说成现状、不把只读审稿称部署/队列或模型实跑；缺关键源就标未知，不以摘要替代。
一个45–75分钟单元，最多2小时；共享最多4并行由原接收端调度。按既有Workflow非作者审查、check_repo、check_public、git diff --check与身份检查，仅推result_branch回review_ready；不用accept:auto，不合main。
