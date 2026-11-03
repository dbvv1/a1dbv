# 指令依赖外部状态时先核入口：共享指令页最小补充候选

> 供 [`docs/decisions/instruction-files.md`](../../../../decisions/instruction-files.md) 的“何时不适用，怎么知道该改了”节采用，尚未改原页。本卡只用公开 PR、固定提交差量和仓内文件；未运行上游命令，未调用账户、组织、规则集或仓库设置接口，未做读者实测。核实日期：2026-11-03（UTC）。

## 一、最小正文候选

### 依赖外部活动状态的操作，先核权威状态再执行

**当一条操作依赖仓库外的活动状态（合并队列、规则集、允许列表、功能开关、发布通道）时，先按已有授权读权威状态，再决定是否执行或重试。** 仓库文件仍在、静态检查通过、没有机器人回执，都不能单独证明该入口当前可用。

**先写清权威来源和适用条件。** 指明具体系统、页面或官方命令，覆盖哪些分支和操作，以及谁有读权限。能用现有授权读到状态时只读一次；读不到就停在“未知”，不要求读者扩大权限、登录或改设置来完成判断。

| 可见状态 | 判断依据 | 下一步 |
|---|---|---|
| 未启用 | 权威来源显示该服务或入口从未开启，预期位置也没有对应检查 | 按说明中已确认有效的入口执行；说明未写明或需要改换合并方式时，交负责人确认，不自行改用旁路；不伪造该服务的提交动作 |
| 暂停 | 该服务／入口的直接权威状态或负责维护者的明确说明显示其曾启用、现已关闭，并写明时间与范围；具名规则集 `enforcement: disabled` 只说明该规则集不强制，GitHub 原生 `mergeQueue` 返回 `null` 只说明原生队列未配置，两者都不能单独推出第三方队列暂停 | 在说明中标注暂停的时间、范围；由负责人修正说明或确认原授权内仍有效的路径。原入口的评论／标签此时通常不产生队列检查，但无检查不能反过来证明暂停 |
| 排队 | 有该服务的排队记录或队列检查 | 按已有说明等待或跟踪；不重复提交 |
| 失败 | 有失败记录或错误回执 | 先区分瞬时失败与权限、审批或保护规则拒绝；只有能确认可重试的瞬时失败才重试 |
| 未知 | 读不到状态、无权限或来源不可读 | 保留未知和阻塞，记录已查入口，交负责人；不反复执行，也不自选有副作用的替代路径 |

**一个查询只回答它自己的对象，不能拼成外部服务的启停结论。** 具名规则集的 `enforcement` 只说明该规则集当前是否强制；GitHub 原生 `repository.mergeQueue` 返回 `null` 只说明原生队列未配置，既不能区分“从未启用”和“曾启用后关闭”，也不能判定 Trunk 等第三方队列的启停。第三方服务的暂停要看该服务／入口的直接权威状态或负责维护者的明确说明，并写明时间与范围。

**入口无回执时先查状态，不把沉默当暂停。** 预期检查没有出现、评论或标签没有反应，可能是未启用、暂停、排队、失败或入口本身不对；只有权威状态能区分。无法区分就记未知，不靠等待时间、文档措辞或反复执行来“试出来”。

**确认暂停或未启用只改变可走的入口，不改变授权。** 它不授权修改组织设置、绕过审批或分支保护、发评论、贴标或合并，也不授权读者自行选择有副作用的替代路径；替代路径只能由负责人确认在当前授权内。只读调查不等于排错执行授权。

**根约定与窄 Skill 冲突时，标范围而不是判废。** 根文件写触发条件和当前有效范围，窄 Skill 明确哪些步骤暂停、哪些仍适用；状态恢复时两处一起恢复并复核。不要整份判废，也不要长期保留两套互相冲突的流程。

**不适用：** 只依赖固定代码或文件的命令不必每次探测远端；已稳定入口不加轮询；路径或命令的旧描述失效就修说明，仍有效的目标、兼容或安全契约未被实现就修代码。外部状态只决定哪条入口当前可用，不改变这条双向取舍。

## 二、原句缺口

现页已有“代码与说明冲突”和“命令失效”的处理，但都假定问题能从仓库内观察到。补充分支缺的正是另一种情况：**代码和文件都没变，仓库外的活动状态变了。**

- 第一步写“先看项目的 CI、包配置和已有指令，填入实际能用的入口”，随后是“命令从当前项目复制并试跑；版本值指向配置，少维护一份会过期的副本。”试跑能发现报错，但发现不了“命令成功返回却无人处理”的暂停态；从 CI／包配置也读不出队列、规则集或第三方服务的活动状态。
- “何时不适用，怎么知道该改了”写“代码与说明冲突：先核当前任务、版本配置和相关验收。路径或命令的旧描述已失效，就修说明；仍有效的目标、兼容或安全契约未被实现，就修代码。不要把‘代码总优先’设成全局规则……”这只覆盖代码与说明之间的偏差，没有覆盖两者都与外部现状不符。
- 同节“已有稳定配置：只修具体缺口。命令失效、模块边界变化或新任务暴露遗漏时，同次更新……”没有区分“命令写错”和“入口被暂停”；“稳定配置”也可以在服务暂停时保持文本稳定。
- [`docs/18-team-adoption.md`](../../../../18-team-adoption.md) 的“仓库级……进版本控制，像代码一样评审”和“托管下发不等于安全边界”已经说明文本评审不等于执行状态，但没有给出单次操作前怎样读状态、读不到怎么办。

缺口可以压成四个问题：权威来源是哪一个；什么算可读证据；读不到时保留什么；哪些动作即使确认暂停也不能做。

## 三、两阶段固定证据

### 固定锚点

| 阶段 | PR | `merged_at`（GitHub REST，UTC） | 合并提交 | 作者 | 文件差量 |
|---|---|---|---|---|---|
| 暂停文档 | [#75873](https://github.com/PostHog/posthog/pull/75873) | 2026-07-31T13:15:36Z | [`1057b672e4d195f3d1c2229f9bbda82238f0e2a5`](https://github.com/PostHog/posthog/commit/1057b672e4d195f3d1c2229f9bbda82238f0e2a5) | Twixes | 仅 `AGENTS.md`，10 增 9 删 |
| 恢复文档 | [#76456](https://github.com/PostHog/posthog/pull/76456) | 2026-08-03T01:22:27Z | [`d9e416841117402b20ee91dd98cbd35921239a6a`](https://github.com/PostHog/posthog/commit/d9e416841117402b20ee91dd98cbd35921239a6a) | gantoine | `AGENTS.md` 9 增 10 删；另改 `desktop-test.yml` 64 增 12 删 |

两份 PR 的正文都写作 “AGENTS.md (symlinked as `CLAUDE.md`)”：根 `CLAUDE.md` 是 `AGENTS.md` 的符号链接（仓库树中 `CLAUDE.md` 标为 symbolic link，内容即 `AGENTS.md`），因此指令改动只落在 `AGENTS.md`、不另见 `CLAUDE.md`；恢复提交 76456 另含 `.github/workflows/desktop-test.yml`（第二题，本卡不展开）。日期按 GitHub REST 写 UTC：创建时间 2026-08-02T23:32:51Z，合并时间 2026-08-03T01:22:27Z。

### 暂停稿：三处改的是入口说明，安全限制仍在正文

75873 正文标题为“chore: Document Trunk pause”。维护者在正文明确写 “We've paused our use of Trunk, and the "Trunk merge" ruleset is disabled.”（2026-07-31；范围是 PostHog 对 Trunk 的使用，具体分支与执行者覆盖未说明）。这是对第三方服务状态的直接说明；本卡只读该公开正文，没有独立运行核验。同正文另列规则集、原生队列与合并方法三类观察，它们各回答自己的对象，不能互相替代。三处修改与恢复稿一一对应：

| 位置 | 暂停稿写成 | 恢复稿恢复为 |
|---|---|---|
| `### Merging PRs` | “Merges into `master` currently go through `gh pr merge <number> --squash`.” 并加粗说明队列暂停、`/trunk merge`、`/trunk cancel` 与 `trunk-merge-queue-submit` 标签是 no-op | “All merges into `master` go through the Trunk merge queue.” 与 “Never run `gh pr merge` or click the GitHub merge button — both are blocked by branch ruleset.” |
| `#### Stacked PRs` | `If the Trunk merge queue is re-enabled (it is paused, see below), never restack while any branch in the stack is sitting in it...` | `Never restack while any branch in the stack is sitting in the merge queue — the force-push removes it from the queue.` |
| 必用 Skill 列表 | `/merging-prs` 条目注明“babysitting one through CI (written for the Trunk queue, so partly stale while it's paused)” | `/merging-prs` 条目恢复为“babysitting one through the Trunk merge queue” |

**暂停稿把安全与审批要求写进正文，恢复稿的 straight revert 又把这整段说明删掉。** 暂停稿明确写：“Branch protection on `master` is unchanged and still enforced: an approving review, code owner review, the required status checks, and signed commits. `gh pr merge` refuses until all of those pass.” 同一段还新增了一条 mergeability 缓存过期的重试说明。76456 是对 1057b672 的 straight revert，反向差量把这两项说明一并移除，所以恢复后的 `AGENTS.md` 正文里不再有 approving review／code owner／signed commits 和缓存说明。这只证明仓库文本删除了说明；底层分支保护、审批与签名规则是否仍然有效，本卡没有查设置接口，保持未知。不能把“文档里没了”读成“限制已取消”。

**窄 Skill 被标记部分过时，没有另行改动其流程。** 这两次提交都没有改动 `.agents/skills/merging-prs/SKILL.md`；暂停稿只在根文件中写“is still written for the Trunk flow, so it's stale pending a follow-up. Its preflight and CI failure-handling advice still applies; its enqueue and queue-watching steps don't.” 正文也写“Deliberately not edited here, that's a follow-up.” 这是“保留整份 Skill、停用其中会失效的步骤”的做法，不是把 Skill 整体判废。

### 恢复稿：三处恢复，Skill 注释随 revert 移除

76456 正文把工作描述为“Two things, both tied to re-enabling Trunk.”，并说“We're re-enabling the queue, so that guidance is about to be wrong in the other direction”。文档部分是“straight revert of #75873 (`git revert 1057b672e4d`, clean on master)”，明确“Restores three spots: the merging section, the stacked-PR force-push warning, and the `/merging-prs` line in the mandatory skill list.” 提交差量逐行对应上表三处。

Skill 文件仍未改动。恢复稿写：“`.agents/skills/merging-prs/SKILL.md` needs nothing. #75873 deliberately left it alone and only flagged it stale inline, so reverting drops the stale note and the skill is already written for the Trunk flow.” 所以“Skill 注释移除”指根文件里那条过时说明随 revert 移除，不是另改了 Skill 正文。作者说明为“ahead of the re-enable”而 revert，并称 `AGENTS.md` 回到“byte-identical known-good state”；按提交比较，被 revert 的三处 hunk 与暂停提交的父提交 `0fed8417` 相同；整份文件并非 byte-identical——同期其他提交在 `AGENTS.md` 第 181 行改过 Frontend quill／LemonUI 一段，`d9e41684` 保留了那处差异。

**76456 的合并记录只说明这一次历史合入所走的路径。** 该 PR 的 `merged_by` 是 `trunk-io[bot]`；[官方 bot 评论](https://github.com/PostHog/posthog/pull/76456#issuecomment-5160877534)报告合并成功并链接其队列页面（该评论 `created_at` 为 2026-08-02T23:32:55Z，`updated_at` 为 2026-08-03T01:22:28Z，与记录的 `merged_at` 2026-08-03T01:22:27Z 对齐；本卡不访问所链 `app.trunk.io`）。这两项可作该次合入经 Trunk 路径的旁证。它们都不证明规则集或服务在合并前后持续启用，更不证明当前状态。正文把恢复定位为“tied to re-enabling Trunk”“ahead of the re-enable”；文档合入是仓库文本变化，与实际服务启停分开。该 PR 还改了 desktop 上传门控，那是第二题，本卡不展开，也不审其 CI 收益。

## 四、作者自报与未知边界

**作者自报（只按自报记录，不复算）：** Twixes 写自己在当天一个 PR 上“burned about 45 minutes on the documented path: two `/trunk merge` comments and the `trunk-merge-queue-submit` label, all silently ignored. No `Trunk Merge Queue (master)` check run ever appeared and the bot never replied. `gh pr merge --squash` then merged it immediately.” 这只能说明作者当时的操作与观察；本卡没有复跑，也没有把 45 分钟当作可复核的测量值。

**“无回执”不是暂停的证据；本例的暂停依据是维护者对服务的明确说明。** 同一正文把几类信息分开列出：[PR 75873](https://github.com/PostHog/posthog/pull/75873) 维护者关于 Trunk 的明确说明——“We've paused our use of Trunk”；规则集查询——`gh api repos/PostHog/posthog/rulesets` 显示“Trunk merge”为 `enforcement: disabled`，其余规则集仍 active；GitHub 原生队列查询——`repository.mergeQueue(branch: "master")` 返回 `null`；合并设置——`allow_squash_merge=true`、`allow_merge_commit=false`、`allow_rebase_merge=false`；以及 `gh pr merge --squash` 当天合入了一个 PR。这些是作者自报的查询结果，写在公开 PR 正文中，本卡没有调用这些接口独立复核；维护者说明同样只是公开正文中的自述，本卡没有独立运行核验。三类状态对象不能互换：`enforcement: disabled` 只说明该具名规则集不强制；原生 `mergeQueue` 为 `null` 只说明原生队列未配置，不能判定 Trunk 等第三方队列启停；作者报告原生 `mergeQueue` 为 `null` 这一点也只是本例的自报。暂停依据取维护者的直接说明，不取规则集状态、原生队列返回值或“机器人没回复”；当前状态未知。

**保留未知，不拿静态文案、时间经过或沉默代替：**

- 暂停的起止时间、覆盖的分支与执行者范围未知；本卡只固定了两份 PR 的合并时间，未还原完整时间线。
- 作者列出的规则集、原生队列与合并方法状态是否仍成立未知；本卡未调用规则集、mergeQueue 或仓库设置接口。
- 45 分钟、两次评论和一次贴标是否为完整操作记录未知；未复算，也不据此推断团队影响。
- 76456 合入后 Trunk 服务与规则集 enforcement 是否持续启用、当前状态未知；按任务边界，本卡不调查现在 PostHog 该怎样合并。
- `AGENTS.md` 在各类客户端中的加载与缓存行为未核；文档合入只证明仓库文本改变，不证明每个会话已读到新文本。
- desktop 上传门控是否正确、是否带来 CI 收益未审；它是 76456 的第二题。
- 没有读者实测、没有页面采用、没有部署或队列实跑。

**“瞬时失败再试”不是本卡的通用建议。** 暂停稿提到 force-push 或改标签后 mergeability 缓存可能过期，第一次 `gh pr merge` 报“the base branch policy prohibits the merge”，稍后重试成功。这是作者当时在 `gh pr merge` 路径上的观察，不能推广为“权限拒绝、审批未过或保护规则拒绝也可以当缓存重试或换入口”。

## 五、逐题回答（供非作者复核）

1. **文件与静态检查正确，能否证明队列在工作？** 不能。75873 明确是“Docs only. No behavior change, no code touched.”，测试栏写“Nothing to test automatically, this is a markdown-only change.”，通过的是 `hogli ci:preflight --fix`（以及 pre-push 的 `--strict`）这类文本与格式检查，不查询任何外部状态。作者另列了规则集、原生队列、合并设置三类查询，但它们各回答自己的对象：规则集 `enforcement` 说明该规则集是否强制，原生 `mergeQueue` 说明原生队列是否配置，都不能判定 Trunk 第三方队列启停；本例的暂停依据是维护者明确说明“We've paused our use of Trunk”。静态检查只证明文本和工具链，不证明外部服务。
2. **没有机器人回执，能否证明暂停？** 不能。没有检查出现、评论或标签无反应，可能是未启用、暂停、排队、失败、标签未被处理、权限不足或机器人故障，单凭沉默区分不了。本例的暂停依据是维护者在 PR 75873 正文的明确说明“We've paused our use of Trunk”（2026-07-31；范围是 PostHog 对 Trunk 的使用，具体分支与执行者覆盖未说明），不是“机器人没回复”，也不是 `enforcement: disabled`、原生 `mergeQueue` 为 `null` 或某次 `gh pr merge --squash` 能合入；后三者分别只说明该规则集不强制、原生队列未配置、当时这条规则未拦截该合并。本卡没有独立运行核验，当前状态未知。
3. **8-03 的合并证明了什么？** 证明恢复文档已合入仓库，`AGENTS.md` 的三处 hunk 回到暂停前文本（整份文件并非 byte-identical，见上）。恢复证据只限本次历史合入：`merged_by=trunk-io[bot]` 与[官方 bot 评论](https://github.com/PostHog/posthog/pull/76456#issuecomment-5160877534)报告合并成功并链接队列，可作为该次合入走 Trunk 路径的旁证。它不证明规则集或服务在合并前后持续启用，不证明当前远端开关仍开启，更不证明 desktop 门控正确。恢复稿正文自己把这次改动定位为“tied to re-enabling Trunk”和“ahead of the re-enable”，文档合入与实际服务启停是两件事。
4. **查到暂停，是否授权换合并路径？** 不授权。暂停只说明原入口当前不可用；改组织设置、绕过审批或分支保护、发评论、贴标、合并，以及替读者选择有副作用的替代路径，都需要负责人在现有授权内确认。只读调查不等于排错执行授权，也不等于可以改入口重试。

## 六、两个反例

- **安全／审批要求不随队列暂停失效：** 暂停稿把“approving review、code owner review、required status checks、signed commits”明确留在正文，并称 branch protection “unchanged and still enforced”、`gh pr merge` 在这些条件满足前会拒绝。这是暂停稿的作者说明；本卡未查仓库设置接口，能确认的是入口说明与安全契约在文本上被分开处理。不能因队列暂停就绕过审批或保护。
- **实际服务状态未知：** 文档仍是 markdown、作者自述的测试只有 `hogli ci:preflight` 这类文档／格式检查、8-03 的记录只是一次历史合入（`merged_by=trunk-io[bot]`），都不能证明当前规则集仍在执行或 Trunk 队列仍可用。没有可读状态时保留“未知”，不把历史暂停或文档恢复写成现状。

## 七、去重与未做

- 原卡 [A-TEAM-POLICY-DELIVERY-20261103](../../A-TEAM-POLICY-DELIVERY-20261103.md) 仍为 `blocked`，只作边界去重：它问的是组织托管策略是否送达，本题问的是操作依赖外部活动状态时怎样核状态；不接其 blocked 调用，不复用其未完成结论。
- 在本卡基线工作树检索 `75873`、`76456`、`1057b672`、`d9e41684`，未见同题产物；两广扫不在本单元重跑，旧共享指令页写者是否退出仍未证，本卡只交 artifact，不接页面写权。
- gcx 宿主模式、Sentry 依赖迁移与本题不同，不重做。
- 只读公开 PR 正文、提交 patch、PR 元数据与讨论；未访问 bot 评论所链的 `app.trunk.io`，未调用账户、组织、规则集权限或当前仓库设置接口，未运行上游命令，未发评论、贴标或合并。
- 未改 `docs/decisions/instruction-files.md`、`docs/18-team-adoption.md`、README、模板、13、TASKS、其他卡或接收器；未做读者实测。

## 八、来源

| 来源 | 固定版本／时间 | 本卡使用范围 |
|---|---|---|
| [PostHog PR #75873](https://github.com/PostHog/posthog/pull/75873) | merged_at `2026-07-31T13:15:36Z`；body、comments 与 REST 元数据 | 暂停稿的三处修改、作者自报、作者列出的状态查询 |
| [提交 1057b672](https://github.com/PostHog/posthog/commit/1057b672e4d195f3d1c2229f9bbda82238f0e2a5) | 2026-07-31T13:15:35Z；仅 `AGENTS.md` | 三处 diff、保留的安全限制、Skill 过时注记 |
| [PostHog PR #76456](https://github.com/PostHog/posthog/pull/76456) | merged_at `2026-08-03T01:22:27Z`；`merged_by=trunk-io[bot]`；body、comments 与 REST 元数据 | 恢复说明、三处恢复、Skill 未改、提前恢复的定位、该次合入路径 |
| [trunk-io bot 评论 #5160877534](https://github.com/PostHog/posthog/pull/76456#issuecomment-5160877534) | created_at `2026-08-02T23:32:55Z`；updated_at `2026-08-03T01:22:28Z`；报告合并成功并链接队列 | 该次合入的旁证；不访问所链 `app.trunk.io`，不充当服务状态证据 |
| [提交 d9e41684](https://github.com/PostHog/posthog/commit/d9e416841117402b20ee91dd98cbd35921239a6a) | 2026-08-03T01:22:26Z；`AGENTS.md` 与 `desktop-test.yml` | 三处反向 diff、被移除的安全／缓存说明、与 `0fed8417` 的比对、第二题边界 |
| [`docs/decisions/instruction-files.md`](../../../../decisions/instruction-files.md) | 工作树 `ec246c5d` 基线 | 现有“第一步”“代码与说明冲突”“已有稳定配置”原句 |
| [`docs/18-team-adoption.md`](../../../../18-team-adoption.md) | 工作树 `ec246c5d` 基线 | “进版本控制、像代码一样评审”与“托管下发不等于安全边界” |

PR 正文与提交 patch 为公开原文；页面与 REST 元数据于 2026-11-03 读取。机器人评论只作合并路径旁证，不单独充当服务状态证据。本候选是只读核查与文档写作，不表示页面已采用、团队已推广或任何队列／客户端实测通过。
