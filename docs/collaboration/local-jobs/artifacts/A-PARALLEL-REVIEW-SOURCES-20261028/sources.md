# A-PARALLEL-REVIEW-SOURCES-20261028 · 并行实现之后怎样接得过来：候选来源排序

**决定：先判定本轮瓶颈类型；只有瓶颈确是“审查／读取”，且下列四类信号全部成立，才继续派新实现：(1) 风险档——改动在低风险阈值内，且 Bugbot／Security 没有需人看的发现；(2) 评审与检查可用——检查为绿且可信（非仅 neutral、未超大小上限、非 bot PR 配额耗尽、非 once-per-PR 旧提交），且评审队列没有未撤销的 Request Changes；(3) 写入面——每个 worker／任务有独占 checkout、写入面不重叠；(4) 接收容量——接收者还能按 diff 读完，而不是只看摘要。四类信号任一不成立时：若瓶颈不是审查／读取，按下一节对应动作先处理该瓶颈；若瓶颈就是审查／读取，再按失败项分流——队列被未撤销的 Request Changes 锁住，只能人工 dismiss 或改用 Comment＋必需状态检查，加一次审查解不开；写入面不独占，改为每任务独立 checkout／关键区串行，不靠加读者；风险档、检查失效或接收容量不足，转全新上下文的独立读者审查、修订、接收，不再加并行；判断不了就停下留人工批量处理。** 这是本单元对清单的归纳，不是任一来源的原话；官方文档自己写明自动批准“不替代完整代码评审”，社区与官方反向材料都把审查容量和跨组件盲点当硬约束。

本文件只排序任务给定的 42 项已核候选，不新增链接。排序依次看：能否直接改变“继续派还是先审”的下一步；证据是一手机制、可复核产物还是自报；动作是否依赖人的注意力、特定宿主或额外基础设施。所有百分比均为厂商自报或用户自报，没有真实使用中的同口径前后记录。

## 一、可改变取舍的发现

### 先判定本轮瓶颈类型（四类信号的前置）

四类信号只回答“审查与读取接不接得住”，不覆盖其他瓶颈；类型判错会把资源加到错误的一侧。先按证据判类型，再决定动作：

| 瓶颈类型 | 判断证据 | 动作 | 依据 |
|---|---|---|---|
| 产品决定未决 | 未决需求／待答问题在增加，同一产品问题反复回流 | 先清未决需求队列，不加派实现 | Planyy、Diver-Interesting |
| 本地测试与 CI 容量 | CI 排队变长，runner／VM 或人工测试成为限制 | 先补 runner／CI 或降并发，暂缓派发 | OldMall3667（人工测试、128GB、5 台 CI VM）、Euronymousua（云 runner） |
| 合并冲突与串行关键区 | 多个在途分支改同一批文件、冲突数上升、关键区排队 | 关键区串行、减少同区并行，不靠加读者 | GroovyCarrot、ricopan |
| 部署后回归 | 合并后才暴露回归、出现 revert、缺部署后检查 | 先加部署后检查再放行 | Rollouts 官方 |
| 审查／读取 | diff 已超过一人可读，或出现不看就 approve | 再套下面的四类信号 | shetritr、xqianliu、software-boulder |

判断不了时写原因停下、人工批量处理，不要默认归入审查／读取。

### 继续派新实现的最低信号组（四类同时成立）

| 信号 | 怎么用 | 依据 |
|---|---|---|
| 1. 风险档：改动在低风险阈值内，且 Bugbot／Security 没有需人看的发现 | 才可继续派下一项；自动批准只在这个范围内 | PR Routing & Approval 文档（官方） |
| 2. 评审与检查可用：检查为绿且可信（非仅 neutral、未超大小上限、非 bot PR 配额耗尽、非 once-per-PR 旧提交），且评审队列没有未撤销的 Request Changes | 才可把检查结果当接收证据、把队列当可用 | Bugbot 文档（官方）；论坛 staff：自动化不能撤销自己的 Request Changes |
| 3. 写入面：每个 worker／任务有独立 checkout，写入面不重叠 | 才可并行派发 | 论坛 staff：同一 checkout 多 worker 无文件协调 |
| 4. 接收容量：接收者还能按 diff 读完，而不是只看摘要 | 可继续加并行 | shetritr、xqianliu、software-boulder（自报） |

### 先让独立读者审查、修订、接收的信号

| 信号 | 动作 | 依据 |
|---|---|---|
| 四类信号任一不成立 | 当瓶颈判定为审查／读取时，停止派新实现，按失败项分流：队列锁→人工 dismiss 或 Comment＋必需状态检查（见下一行）；写入面不独占→每任务独立 checkout／关键区串行，不另起读者；风险档、检查失效或接收容量不足→插入一次全新上下文的独立审查 | 本单元归纳 |
| 仅评审队列被未撤销的 Request Changes 锁住 | 人工 dismiss，或改用 Comment＋必需状态检查；不要用再加一次审查来解 | 论坛 staff（2026-10-19） |
| 产物来自 Project worker | 在其推的分支另起 agent 做 `/review`；不要假设 worker 自带 | 论坛 staff：Project worker 拿不到 `/review` |
| 开始出现“3 个以上不看就 approve” | 收回审查、缩小并行 | software-boulder |
| 批准后 PR 又被更新、风险升高 | 重新评估并撤销批准，再决定是否继续派 | 官方 Automations 模板 |
| agent 评审只覆盖眼前 diff，漏跨组件 | 关键路径保留人或独立读者 | ungoogleable |
| 审完＋解冲突后并不比串行快 | 先测“折叠／缩小并行”，不要只加读者 | GroovyCarrot、Anthropic 折叠判据 |

**“先接收再补位”目前只有自报形态**：Faire 在合并后才派下一个（厂商客户故事），TheNerdyJockGamer 用单一 hub＋backlog 让协调者自动拉下一个（自报），TrickySite0 夜间批量答 5-6 个问题、批 2-3 个改动（自报）。三者都没有同口径的前后记录，不能证明能提高交付。

### 不能单独当信号

- PR 数、agent 数、运行整夜、合并比例。Projects 的 30%／6x、Amplitude 的 60–70%、WorkOS 的 35%、Faire 的 2x 都是厂商自报或厂商选样客户故事，没有漏检、返工、等待与协调投入的同口径数据。
- 检查全绿。Bugbot 的发现默认 neutral，单靠该检查不阻止合并；超限 PR 直接跳过；bot PR 有复审配额；once-per-PR 会跳过后续提交。
- “评审意见已回复／已修”。自动化不能撤销自己的 Request Changes，后续全绿也可能仍卡住。
- 高并发回复里的并发数。TheGronne、nokafein、speederaser 都指出要么任务很小、要么没审；Euronymousua 的 100+ agent 依赖约 250 核／500GB 云 runner。

### 对 dot 的最小动作

**先处置已回结果（当前时点）。** 清点本轮所有已回结果，逐项按上面四类信号核：风险档是否低，且 Bugbot／Security 没有需人看的发现；评审与检查是否可用（绿色检查是否有效：非仅 neutral／未超大小上限／非 bot 配额耗尽／非 once-per-PR 旧提交；队列是否无未撤销的 Request Changes）；是否独占写入面；diff 是否仍读得完。全过的按 long-tasks 的 R/A/V/N 记录接收时点；任一不过时按失败项分流：队列被 Request Changes 锁住，人工 dismiss 或改用 Comment＋必需状态检查，不要用再加一次审查来解；写入面不独占，改为每任务独立 checkout／关键区串行，不另起读者；风险档、检查失效或接收容量不足，立即转给全新上下文的独立读者，按原验收只看最终 diff，不由原实现者自证；独立读者也判断不了的，写清原因停下、留人工批量处理。这一批处置完，再决定是否派下一项。

**再决定下一项（派发时点）。** 下一个自然任务开始前，先按上一节判定瓶颈类型；瓶颈不是审查／读取时按该类型动作处理，不套四类信号。瓶颈确为审查／读取时，在派发单上逐项填同一套四类信号：1) 风险档——改动在低风险阈值内，且 Bugbot／Security 没有需人看的发现；2) 评审与检查可用——检查为绿且可信（非仅 neutral、未超大小上限、非 bot PR 配额耗尽、非 once-per-PR 旧提交），且评审队列没有未撤销的 Request Changes；3) 写入面——每个 worker／任务有独立 checkout、写入面不重叠；4) 接收容量——接收者还能按 diff 读完，而不是只看摘要。四项都过才继续派；任一不过按失败项分流：队列被 Request Changes 锁住，人工 dismiss 或改用 Comment＋必需状态检查，不要用再加一次审查来解；写入面不独占，每任务独立 checkout／关键区串行，不另起读者；风险档、检查失效或接收容量不足，转一次全新上下文的独立读者，按原验收看最终 diff；判断不了就写原因停下、人工批量处理。接收时按 long-tasks 的 R/A/V/N 记录时点，不用绿色检查或 PR 数代替。

## 二、最值得深挖的前六项

1. **[PR Routing & Approval 文档](https://cursor.com/docs/approval-agents)** 是唯一给出完整“批准还是转人”规则的一手材料：风险分＋最大风险阈值＋`APPROVAL_POLICY.md`／`ROUTING.md`＋AI 评审发现＋最多约 8 分钟等待；发现需人看就不批；策略文件改动按 base 分支版本读，读不到就要求人审；并明说“不替代完整代码评审”。深挖点是把阈值、等待语义和 policy schema 翻成 dot 的派发检查表。它不能证明漏检率、返工，也不能外推到 Cursor 之外的宿主。
2. **[Bugbot 文档](https://cursor.com/docs/bugbot)** 定义了绿色检查失真的边界：neutral 默认、单检查不阻止合并、超大小上限跳过、bot PR 复审配额、once-per-PR。深挖点是列出哪些检查结果可以进入接收证据。它不能证明各跳过条件的实际发生频率。
3. **[论坛 staff：自动化不能撤销自己的 Request Changes](https://forum.cursor.com/t/dismiss-review-only-removes-an-approval-so-an-automation-cannot-clear-its-own-request-changes/175336/7)**（2026-10-19）把“评论已改＝队列解锁”证伪，并给出人工 dismiss 或 Comment＋状态检查两条替代。深挖点是核这个 workaround 在目标仓库 branch rules 下是否可用。它不能证明 GitHub 之外评审工具的行为。
4. **[论坛 staff：Project worker 拿不到 /review](https://forum.cursor.com/t/review-bots-failed-in-projects/171712/6)**（2026-09-15）说明 Project 派出的 worker 不带 Bugbot／Security Review，要审只能在其推的分支另起 agent；Project 的接收仍由人承担。深挖点是这决定了“加独立读者”的真实步骤与成本。它不能证明其他宿主 worker 是否同样。
5. **[论坛 staff：同一 checkout 多 worker 无文件协调](https://forum.cursor.com/t/project-coordinator-with-local-agents/175337/10)**（2026-10-19）说明两个 worker、甚至单 worker 多 agent 会同时写同一批文件，“没有东西协调文件编辑”。深挖点是把它变成派发前的独占写入面检查（每任务一 worktree）。worktree 之外的端口、数据库、缓存隔离另见仓内 08。
6. **[Cursor Projects 发布公告](https://cursor.com/blog/projects)**（2026-09-10，beta）给出厂商自述的渐进接收规则：迁移早期逐 PR 细审，修复站得住后减少审查；设计系统 Project“on track to touch 20–100 PR／天”，工程师只在需要处 check in；30%／6x 为自报。深挖点是把“修复持续站得住”转成可观测的减审条件。它不能证明漏检、返工与完整投入，“on track”还是将来时。

**与第 6 项配套的反向必读：[Anthropic 折叠 subagent 的 eval 判据](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)**。它主张逐个把 subagent 折回主循环、共享上下文，并给出“折叠后分数不变差才保留”的可证伪判据。方向与继续加并行相反，应该作为对照试验，而不是只读支持加读者的材料。

如果只追一个效果数字，先追 **Amplitude 的 60–70%**：它是清单里唯一给出“低风险 PR 无需额外开发者工作即合并”比例的采用者样本，但要先核它的风险分档口径与分母。社区侧只追一条，先追 **xqianliu**：它把验收标准、独立 review session、判断不了就停下写原因，排成了可照做的顺序。

## 三、排序清单

### A. 判定规则与失效边界（官方一手机制，可直接写成闸门）

| 来源 | 日期／版本 | 保留理由（含限制） |
|---|---|---|
| [PR Routing & Approval 文档](https://cursor.com/docs/approval-agents) | 页面无日期；Cursor 文档 | 官方把接收决策写成风险分＋AI 评审发现＋策略文件：阈值可配（官方文档未给默认值；官方模板示例把 Very Low／Low 设为可自动批准），发现需人看就不批，等待 AI 检查最多约 8 分钟，策略按 base 分支读，明说不能替代完整代码评审。 |
| [Bugbot 文档](https://cursor.com/docs/bugbot) | 页面无日期；Cursor 文档 | 列出绿色检查失真的边界：发现默认 neutral、单靠该检查不阻止合并、超过大小上限的 PR 直接跳过、bot 开的 PR 有复审次数上限、once-per-PR 会跳过后续提交。 |
| [论坛 staff：自动化无法撤销自己的 Request Changes](https://forum.cursor.com/t/dismiss-review-only-removes-an-approval-so-an-automation-cannot-clear-its-own-request-changes/175336/7) | 2026-10-19；Cursor review tool | 支持确认自动化只能 dismiss 自己留下的 approval、不能撤销自己的 Request Changes；后续修复即使检查全绿 PR 仍被卡住，只能人工 dismiss 或改用 Comment＋状态检查。 |
| [论坛 staff：Project worker 拿不到 /review](https://forum.cursor.com/t/review-bots-failed-in-projects/171712/6) | 2026-09-15；Cursor Projects／cloud agents | `/review` 只挂在从 cursor.com/agents、IDE 或 CLI 启动的 cloud agent 上，Project 派出的 worker 不会带上 Bugbot／Security Review，要审只能在 worker 推的分支另起 agent。 |
| [论坛 staff：同一 checkout 多个 local worker 无文件协调](https://forum.cursor.com/t/project-coordinator-with-local-agents/175337/10) | 2026-10-19；Cursor self-hosted workers | 同一仓库同时开桌面 self-hosted worker 与 CLI worker 会得到两个互不协调的写者、单个 worker 也能同时接多个 agent，“没有东西协调文件编辑”；建议每任务独立 checkout。 |
| [Cursor Projects 发布公告](https://cursor.com/blog/projects) | 2026-09-10；Projects beta | 官方给出“迁移早期逐 PR 细审、修复站得住后减少审查”的渐进接收规则，并以数百 PR 迁移、设计系统 Project 预计触及 20–100 PR／天说明持续维护；30%／6x 与“在轨”均为厂商自报，页内无漏检、返工或完整投入。 |
| [Cursor Projects 产品文档](https://cursor.com/docs/agent/projects) | 页面无日期；Projects beta | 维护中的契约只写到协调者“把成品带回来给你检查”，未定义 Project worker 的 PR 审查门或合并条件，说明 Project 的接收仍由人承担、不能从产品机制推断已验收。 |
| [Cursor 工程复盘：cloud agent 的阻塞代价与信任 ratchet](https://cursor.com/blog/cloud-agent-lessons) | 2026-06-02；Cursor cloud agents | 官方自述云端阻塞的代价远高于本地（可能几小时没人看），因此鼓励更自主，并随着模型变强逐步把“每个任务后 double-check”等 harness 逻辑移出、交给 agent 控制；给出“信任够了就减检查”的同源 ratchet。 |
| [Rollouts／Security Review 发布：PR 之后的瓶颈](https://cursor.com/blog/rollouts-and-security-reviewer) | 2026-09-23；Cursor | 官方把瓶颈定位在 PR 之后：安全审查、看部署、判断延迟抖动、找出十一处改动中哪一处弄坏 checkout；Rollouts 在合并前后按遥测核回归，按配置可开 revert PR 待批、通知作者或暂停渐进发布；接收信号应含部署后证据而不只是评审通过。 |

### B. 可比较的接收比例与流程样本（厂商客户故事／厂商基准，方向可用、数字打折）

| 来源 | 日期／版本 | 保留理由（含限制） |
|---|---|---|
| [Amplitude：风险分诊＋Bugbot 首审](https://cursor.com/blog/amplitude) | 2026-04-15；Cursor Bugbot | 明说手工代码评审是瓶颈，改用“风险自动化＋Bugbot 首审／自动修复”，约 60–70% 的低风险 PR 无需额外开发者工作即合并、高风险才路由给人；厂商客户故事，无漏检与返工。 |
| [Faire：合并后才派下一个的 Swarm](https://cursor.com/blog/faire) | 2026-05-26；自建 Swarm，早于 Projects | 真实采用者用自建 Swarm 在“一个 agent 完成并合并 PR 后”才派下一个，并按作者／风险／大小给每个 PR 路由到定制评审流；2x PR 吞吐、18 个月迁移压到一名工程师，但这是厂商客户故事、发生在 Projects 之前。 |
| [Vercel：深审＋stacked PR 的接收方式](https://cursor.com/blog/vercel) | 2026-07-28；Cursor | 关键后端改动每个都走深审、把 agent 产物拆成 stacked PR 让团队增量审，并跟踪 PR 速度、首次评审时间、合并时间与评审轮数；说明高风险面并不会随信任上升而减少人工审查。 |
| [WorkOS：跨模型评审＋autofix 的作者流程](https://workos.com/blog/cursor-bugbot-autoreview-claude-code-prs) | 2026-03-16；Claude Code＋Cursor Bugbot | 开发者自述用 Claude Code 写、Bugbot 跨模型审并在人打开 PR 前推 autofix，人只在更干净的基线上审架构／业务正确性，35% 的 autofix 改动会被合并；单一从业者、厂商相邻、无对照。 |
| [Bugbot 解决率基准](https://cursor.com/blog/bugbot-learning) | 2026-04-08；50,310 个公开 PR | 厂商以“合并时是否被处理”为代理指标报告 78.13% 的解决率、比次高产品高 15 个百分点，意味着约两成发现未在合并前解决（厂商解释为误报），支持“AI 先审”但不能当成零漏检。 |

### C. 边界、反向与现成实现（限制 A／B 的结论）

| 来源 | 日期／版本 | 保留理由（含限制） |
|---|---|---|
| [Anthropic：When to fold subagents into your main agent loop](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop) | 2026-10-22；Diane Sarkis | 主张按 eval 逐个把 subagent 折回主循环、共享上下文与减少有损交接，并给出“折叠后分数不变差才保留”的可证伪判据，方向与继续加并行相反；帖内被用来反驳高并发。 |
| [Agent swarms：解耦 review lens 与返工对照](https://cursor.com/blog/agent-swarm-model-economics) | 2026-07-20；Cursor 研究 | 同一团队的实验显示 review 用不同信息／不同模型的解耦 lens 叠加、且评审算力远比被审工作便宜，并给出 70,000 余→不足 1,000 合并冲突和 64,305→9,908 行引擎代码的返工对照，说明独立评审可分层但仍需人抽查作弊／走捷径；本仓研究页已引用该文。 |
| [官方 Automations 模板：评估 PR 风险并指派评审者](https://cursor.com/workflows/autonomous-agents/assign-pr-reviewers) | 模板页无日期 | 默认阈值是 Very Low／Low 可自动批准、High 绝不批准、最多 2 名评审者、批准后风险升高要撤销，并把 PR 内容当对抗输入，可直接借作“继续派发还是转人审”的判定规则。 |
| [官方 Automations 模板：自动处理 PR 评审评论](https://cursor.com/workflows/autonomous-agents/autofix-pr-review-comments) | 模板页无日期 | 让代理先修 reviewer 的 inline 评论并在线程回报，遇到含糊或需人判断就说明而不猜、且明确不批准 PR，示范了如何自动化“修订”这一步而不把接收权交出去。 |
| [Sentry React Native：signal-over-noise 的 BUGBOT.md](https://github.com/getsentry/sentry-react-native/pull/5716) | 2026-02-25 合并 | 成熟 SDK 仓库把 AI reviewer 的目标写成“signal over noise”：只在实质正确性／安全隐私／性能／API 质量上评论、测试里的问题不报、给最小修复，且 PR 正文的两项 test plan 均未勾选、未见验证记录，说明这类规则本身也需要被验证。 |
| [srcfl/ftw：APPROVAL_POLICY.md 限制 PR Routing 误 ping](https://github.com/srcfl/ftw/pull/1072) | 2026-09-04 合并 | 真实仓库因 Cursor PR Routing 按 commit history 而非 CODEOWNERS 反复 ping 非 owner，加入 APPROVAL_POLICY.md＋ROUTING.md 限定只按 CODEOWNERS 请求评审、不重复请求、明确不授权自动批准，并记录 router 读的是 base 分支策略。 |
| [Open Walnut](https://github.com/EvanZhang008/open-walnut) | 仓库；日期未知 | 帖中评论者指向的自建工具，README 提供 per-session diff 审查、Focus／Satellite／Parked 分层与“任务需要你”收件箱，是把接收队列产品化的可复核产物；评论者与仓库作者是否同一人未证实，README 有厂商式背书。 |
| [zeroshot](https://github.com/the-open-engine/zeroshot) | 仓库；日期未知 | 帖内评论者推广的开源 harness，把“写代码的 agent 不该自己宣布通过”做成强制的独立 reviewer 与 repair 回路，是“先让独立读者审”的现成实现；厂商自述，近期 issue 多为内部 CI／功能，未见接收瓶颈的用户证据。 |

### D. 社区真实取舍（自报，用于生成假设，不作效果证据）

| 来源 | 日期／版本 | 保留理由（含限制） |
|---|---|---|
| [xqianliu](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/peubok9/) | 2026-10-09 | 4 个并行的 diff 已超过一人能读的量；做法是任务先写验收标准，另开 review session 作为第一读者核对最终 diff，agent 不能决定时写原因停下、人工批量处理，产品取舍不外包；自报无对照。 |
| [shetritr](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjjb1x4q2n4/) | 2026-10-23 16:56；存档分 1 | 一句话给出可操作的派发上限——会话能扩、读 diff 的速度不能扩——可直接转成 dot 的接收速率闸门（自报经验，非测量）。 |
| [software-boulder](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjkerip6g2s/) | 2026-10-23 | “到 3 个以上我会不看就点 approve”给出接收质量失效的可观测症状，支持把“盲批出现”而不是固定并发数当作收回审查的触发条件。 |
| [ricopan](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjkdfheh2ar/) | 2026-10-23 17:20；存档分 1；opus 5.5／Fable（自述；另期待 Fable 5.5） | 少数承认瓶颈已从人转到协调者、且信任协调者“有时因此受伤”的回复，具体列了关键区串行导致合并过复杂、协调模型多球过载、上万测试需逐步验证三类约束，并称 Fable 太贵、期待 Fable 5.5 能补上这个角色，可用来判断先加独立读者还是先加协调层。 |
| [OldMall3667](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjj9uonqs4j/) | 2026-10-23 16:55；存档分 1 | 40 个 agent 并行下仍卡在人工测试和“未被 review agent 自动放行”的代码审查，并给出 128GB 内存与 5 台 CI VM 的投入，说明自动审查只削掉一部分接收队列（自报）。 |
| [_haiderfarooq](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjk2i6o0nol/) | 2026-10-23 17:13；存档分 1 | 把“可审”与“可略读”分开：同仓两棵 worktree 各一个会话，第三个只开给文档、补测试这类扫 diff 就够的活，是一条可直接照搬的分流规则（自报）。 |
| [ungoogleable](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/pewrd1f/) | 2026-10-09 | 反驳 sapplefi：agent 评审只看眼前代码，漏跨组件交互和长期架构，导致重复实现反复出现；支持关键路径保留人类或独立读者，不能把 agent 自审当最终接收。 |
| [GroovyCarrot](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/pequd6z/) | 2026-10-08 | 并行流在“审完全部改动＋处理冲突”后并不比串行更快，且能中途讨论改向更有价值；是对“并行实现＝提速”的直接反证，但为自报、无对照。 |
| [FlanComprehensive164](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/peqng4v/) | 2026-10-08 | 从 3-6 个并行改为 4 小时规划后由 orchestrator 带 10 个 agent 跑 12 小时，自报产出翻倍、投入减半，但“最后 10% 的审查与测试”仍未解决；没有基线口径和产物，不能当效果证据。 |
| [TrickySite0](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/pes3sgq/) | 2026-10-09 | 把想法做成带可测退出条件的卡片，第二模型先审再交人批，夜间只答 5-6 个问题、批 2-3 个改动；给出一个接收闸门的具体配置，自报无产物。 |
| [sapplefi](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/pes0mpu/) | 2026-10-09 | 25+ sessions、14 个 Max／Team 计划，明确不再逐条读计划／测试／输出，把研究、测试、评审交给 agent 并形成 backlog；机制含盲审／对抗／安全／性能评审和验收标准，但全是自报，无公开产物。 |
| [Planyy](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjj88wdb17p/) | 2026-10-23 16:54；存档分 2 | 跑 4-8 个会话的人把最大瓶颈直接归到“决策”而非审查或算力，支持在派新实现前先看未决需求队列（自报）。 |
| [TheNerdyJockGamer](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rl6bmam3qp1/) | 2026-10-24 14:59；存档分 1 | 描述单一 hub＋backlog＋协调者自动拉下一个 story、只把未定义任务回流给人的接收设计，是“先接收再补位”的具体形态（自报，无产物）。 |
| [Euronymousua](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjjuqy4nbvl/) | 2026-10-23 17:08；存档分 7（回复中最高） | 10+ 会话、100+ agent 的前提是租了约 250 核／500GB 内存的云 runner，说明高并发依赖额外基础设施，不能直接外推到共享 4 并行的 dot（自报，成本未核）。 |
| [TheGronne](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjj8sm37g11/) | 2026-10-23 16:55；存档分 5 | 对“19 个会话”的公开质疑——任务要么是一行活、要么根本没审——标出整帖高并发数字普遍缺产物的证据缺口，提醒不能把回复里的并发数当通用基准（评论者推断，非核实）。 |
| [nokafein](https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/19rjjch3qkn36/) | 2026-10-23 16:57；存档分 3 | 给出低并发一侧的完整工作法：两任务轮转、一次只专注一个、约 30 分钟切换一次，并称更高并发是“肉代理点 yes”，可作 dot 缩小并行时的参照（自报且立场强烈）。 |
| [speederaser](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/pet4798/) | 2026-10-09 | “声称 20 agents 跑 20 小时的人多在产垃圾”；自己白天约 4 个、睡前再排几个，靠客户验收质量；对高并发自报的可信度约束，不能把代理数当目标。 |
| [Diver-Interesting](https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/peqlqxv/) | 2026-10-08；归档最高赞（45） | busy != productive，先想清楚产品要做什么，否则 code factory 建在流沙上；提醒“继续派发”不能替代产品决定。 |

### E. 仓内基线与去重

| 来源 | 日期／版本 | 保留理由（含限制） |
|---|---|---|
| [08 §6 已有接收原则](https://github.com/dbvv1/a1dbv/blob/4282fee1684ba2c6a6412f58d6f52a12d913221c/docs/08-multi-agent.md#L215-L258) | base 4282fee | 已写“评审积压就减少同时在写的任务”“一次有效独审”“接收不等于验收”；本轮社区材料主要是佐证，新增的是可观测触发信号，不是新原则。 |
| [long-tasks 的 R/A/V/N 口径](https://github.com/dbvv1/a1dbv/blob/4282fee1684ba2c6a6412f58d6f52a12d913221c/docs/decisions/long-tasks.md#L124-L145) | base 4282fee | 仓内已用 R/A/V/N 记录接收时点与返工；两条 Reddit 讨论都没有同口径的前后记录，效果只能记未知，不能填这张表。 |

## 四、未知与限制

- **没有真实使用中的同口径前后对照**：42 项都没有真实使用中的同口径前后记录；Agent swarms 的厂商实验（同一任务、同模型、同时间预算）给出返工对照，但衡量的是 swarm 设计的冲突与代码量，不是真实采用或接收流程；效果数字仍来自厂商或用户自报，官方文档与论坛回复只说明机制，GitHub 产物只证明改动存在。缺合格交付、漏检、返工与等待／协调投入的分母；PR 数、合并比例、agent 数不能单独当效果。
- **版本与模型未知**：Cursor 文档是活页、论坛回复只说“当前行为”、Projects 为 beta、多数社区评论未给模型（ricopan 提到 opus 5.5、Fable，并期待 Fable 5.5）；表中未写版本即未知。
- **官方数字的口径**：8 分钟是约数、超时不批准，不是 SLA；78.13% 是“合并时已解决”的代理，不是漏检率，未解决的两成被厂商解释为误报但无人工复核。
- **论坛回复无公开复现**，只描述当时的产品行为；`/review` 的缺失与 workaround 都可能随版本变化。
- **外推限制**：独立读者、批量接收、盲批判断与产品取舍都依赖人的注意力；PR Routing、Bugbot、Projects 与论坛回复绑定 Cursor 宿主；高并发依赖云 runner／CI VM，Open Walnut／zeroshot 需部署且本仓未试用。
- **仓内增量有限**：08 §6 已有原则，long-tasks 的 R/A/V/N 没有数据可填；本轮新增的是可观测触发信号与闸门语义。
- **覆盖缺口**：第一帖 software-boulder 与第二帖七条评论未在已抓取副本中复核，按候选清单采信；Anthropic 文章、zeroshot README 未在本单元重读；官方文档页面无发布日期。

## 五、核实范围

候选清单由前序采集给出。本单元在已抓取的原文副本上复核了 PR Routing、Bugbot、Projects 两页、cloud agent 复盘、Rollouts、Bugbot 基准、Agent swarms，三则论坛 staff 回复，四个客户故事（Amplitude、Faire、Vercel、WorkOS），两项开源 PR（Sentry、srcfl/ftw），两份 Automations 模板与 Open Walnut README 的关键句、日期或合并状态；并抽查第一帖九条评论的正文与时间。论坛与评论链接均指向具体楼层，官方文档与博客按整页主张引用、未标行号。未运行任何产品、未登录、未安装候选，未新增链接。
