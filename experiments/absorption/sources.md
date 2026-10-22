# P79 需求来源与改编边界

出题者未读目标正文／研究记录，但读过首页与入口摘要，因此不是全盲出题。原帖证明真实问题，不证明其根因解释或当前版本仍复现。数字、团队、期限等新增约束均为明确改编。来源只供审题，不提供给答题者。

## A卷18题


- S1：HN《Is anybody producing good code with coding agents?》，2026-10-02，https://news.ycombinator.com/item?id=49934037 。正文问题是生成代码难读、审查投入增加、理解逐渐丢失；评论有小批次改动的个人经验。支持 A00-1、A07-2。题目中的团队下一轮与三个模块为新增约束。
- S2：HN《I hate coding agents. Is this skill issue?》，2026-07-09，https://news.ycombinator.com/item?id=48844345 。正文提出服务依赖、理解丢失、详尽文档仍有错误假设及旧 bug 复发。支持 A00-2、A00-3、A03-3、A07-1。停用/恢复、两周交付、明日单路径、模块与临时约定都是改编；不照搬原帖主观频率、比例或情绪评价。
- S3：HN《What coding agents are you using?》，2026-06-11，https://news.ycombinator.com/item?id=48485669 。正文询问选型；评论分别提出速度与审查、worktree/并行会话管理、便宜模型对自定义 DSL 的表现问题。支持 A01-1、A01-3、A02-3。迁移+界面、桌面应用宣传、自动语法检查均是新增约束，不声称某真实产品具备这些条件。
- S4：根 README「一页纸」读者任务表的“关机后继续”及本地依赖任务，仓库入口标注本轮更新 2026-10-15，读取 2026-10-22。公开仓库入口：https://github.com/dbvv1/a1dbv/blob/009fd0a54a012ea3a506eea75f260f43ecc13595/README.md 。支持 A01-2。公司 VPN 与设备联合出现是约束改编，不来自私人信息；此 URL 由父任务给定仓库与修订构成，发布前独审须验证该远端完整SHA文件存在。
- S5：Codex issue #45411，2026-09-14，https://github.com/openai/codex/issues/45411 。正文描述同一有界任务两次额度耗尽、缓存计数与未完成的局部产物。支持 A02-1。省略作者身份、私人项目文件名、会话 ID 与具体用量，不据帖文判定计费错误。
- S6：Codex issue #33418，2026-07-15，https://github.com/openai/codex/issues/33418 。正文报告模型切换和修复累计代价，特别区分客户端计数与 API 账单。支持 A02-2。管理者错误计算是出题者构造，不是原帖行为；不搬运个人日志、项目内容或身份信息。
- S7：Codex issue #18720，2026-04-20，https://github.com/openai/codex/issues/18720 。正文用动画小修改报告交接后原意改变；不是仅大任务才有的情形。支持 A03-1、A07-3。测试通过和拟加循环为改编；历史报告不证明当前客户端必然复现。
- S8：Claude Code issue #38680，2026-03-25，https://github.com/anthropics/claude-code/issues/38680 。正文报告 disabledSkills 阻止调用但上下文仍占用。支持 A03-2；题目不预设当前版本同样有缺陷。
- S9：Claude Code issue #100813，2026-10-09，https://github.com/anthropics/claude-code/issues/100813 。正文报告界面已启用但主会话缺技能列表、子任务能见，实际走通用工具。支持 A05-1。不要求答题者认可作者对内部原因的推断。
- S10：Claude Code issue #53377，2026-04-25，https://github.com/anthropics/claude-code/issues/53377 。正文报告 Skill 的分叉执行只总结说明、没有调用目标工具，直接调用可用。支持 A05-2。只采用可观察行为，不断言鉴权继承是根因。
- S11：Claude Code issue #32910，2026-03-10，https://github.com/anthropics/claude-code/issues/32910 。正文质疑预加载与文件可发现性混同，附复现。支持 A05-3。团队限制与迁移安排是改编；此帖不充当全部宿主权限契约。


## B卷21题


R0：根README读者任务表，固定SHA，访问2026-10-22：https://github.com/dbvv1/a1dbv/blob/009fd0a54a012ea3a506eea75f260f43ecc13595/README.md 。明确任务有：具体编码、已有失败、正常产品改进、配置是否值得换、长任务、外找方案/复用或自建。
R1：cameronsjo，2026-03-08，Claude Code #32034：https://github.com/anthropics/claude-code/issues/32034 。原文已读：多个PR改同文件，希望用/tmp worktree并行解决冲突，子Agent访问失败而主会话可读；作者3月28日因工作流不再需要而关闭，不是维护者确认修复。
R2：rtimmons，2026-04-01，Claude Code #42282：https://github.com/anthropics/claude-code/issues/42282 。原文已读：隔离子Agent返回后父会话cwd漂移，可能位于已删工作树，后续git操作错误；原帖寻求可靠恢复。
R3：ankitgoyalio，2026-02-20，Codex #12316：https://github.com/openai/codex/issues/12316 。原文已读：仅main分支时选择基于base branch的Code Review，出现Failed to start code review。没有提供“代码安全”结论。
R4：terabytest，2026-01-20T12:45:57Z，Ask HN 46691243：https://news.ycombinator.com/item?id=46691243 。正文及Algolia API原文已读：追问净价值和可维护性，iOS喂宠提醒原型首轮不错，后续修复互相引入问题，规则记录未解决；反对以CI全绿替代必要评审。题目不采信其单例为全体模型结论。
R5：svara，2026-03-15T15:58:23Z，Ask HN 47388646：https://news.ycombinator.com/item?id=47388646 。正文及Algolia API已读：要求有技术栈、项目/团队背景的专业编程实际成败，而非笼统站队。用于真实采用决策需求，不把评论当对照实验。
R6：nikolageorgiev2000，2026-08-06，Codex #37304：https://github.com/openai/codex/issues/37304 。正文已读：goal resume后重复“仍暂停”约1小时而无实际工作；9月的评论报告类似后续体验。题设不复述评论的用量数字为已验证统计。
R7：priyanshuchawda，2026-03-30，Codex #16278：https://github.com/openai/codex/issues/16278 。正文与维护者回复已读：压缩超时后resume也挂起；6月29日维护者称已改压缩实现并关闭。历史场景用来测恢复选择，不断言当前版本同故障。
R8：polm23，2019-05-07T09:44:30Z，Ask HN 19847882：https://news.ycombinator.com/item?id=19847882 。正文及Algolia API已读：大量没有ISBN的实体同人刊物，想记录封面照片、箱/架位置、自定义元数据。网页渲染显示5月8日，采用API UTC创建日；历史需求不代表旧评论候选目前仍适用。
R9：beatthatflight，2020-02-17T02:35:21Z，Ask HN 22345150：https://news.ycombinator.com/item?id=22345150 。正文及Algolia API已读：旅行优惠需发网站、社媒、不同城市Mailchimp名单，选图等重复劳动，希望输入出发地/目的地/日期后自动化，担心全Selenium慢而脆弱。
R10：cJ0th，2020-05-16T12:28:36Z，Ask HN 23202850：https://news.ycombinator.com/item?id=23202850 。正文及Algolia API已读：想探索未知网站，问是否有搜索引擎排除或降低前500大网站权重。
R11：Ok_Skirt49，Reddit原文已读，页面仅显示“2mo ago”，精确发布日期未核实，访问2026-10-22：https://www.reddit.com/r/codex/comments/1vpp316/why_does_codex_keep_finding_new_issues_every_time/ 。具体问题：功能完成后反复评审修复，每轮仍出现真实bug或设计问题，问如何处理。精确日期JSON读取返回403，未绕过。仅作补充背景，不作为正式题目来源；不得伪造日期。


同源题不视作独立事实样本；每题每组用新上下文。A02-1已提示不能假定token到额度换算，不把该提示点单独算页面增量。题集只测这些场景，不能代表整页全部价值。
