# Agentic Workflows 与 dotnet/core API diff 的真实维护闭环

> 核实／读取日期：2026-11-03。范围：2026-10-28 GitHub Agentic Workflows GA 公告及其原链接的 gh-aw 文档；`dotnet/core@5f99c19c62154814a35716e0726c82be29c690de` 的 orchestrator、worker、lock 与同树调用脚本；PR #10482 的评审、评论、提交和时间线；同仓 #10487／#10493 的维护者变更。
> 方法：只读公开来源，不安装或运行 gh-aw、GitHub Actions、dotnet、浏览器或该仓脚本，未运行 gh-aw 的模型工作流，未创建 workflow／PR／评论，未读取运行日志。下文区分官方承诺、固定源码所见、公开回执与本仓未独立实跑；原日期不因读取日改变。

**结论先行：** 可借的是“确定性工具生成、模型只在窄 allowlist 内维护 PR、人负责 Ready 和合并”的分工；不值得照搬的是把 agent 只读当成整条流水线无外部写入；在使用默认 Copilot CLI 引擎时没有 Copilot 许可，或缺少确定性生成器、人工合并闸门，也不该硬上。dotnet/core 的公开证据是 pre-GA 的一个完整 PR 周期，不是 GA 后的效果证明。

**上手顺序：**

1. **先确认产物可由确定性脚本生成。** 源／目标版本、feed 和运行脚本固定，且有一套权威基线；若差异本身要靠模型判断，这套分工不成立。
2. **再确认运行前提。** 仓库有写权限、Actions 已启用；默认 Copilot CLI 引擎需要 Copilot 许可（本文按该引擎核对；换其他引擎按其认证准备），并按 Quick start 配置 Copilot 路径的认证：组织计费可用 per-run Actions token（`copilot-requests: write`），个人 token 路径才需 Account permissions 中 Copilot Requests: Read 的 fine-grained PAT；GitHub-hosted runner 即可；dotnet/core 的 10 个 `COPILOT_PAT_*` 池是项目自选，ARC／DinD 是可选的自托管拓扑（dotnet/core 未使用，见§5）。Windows 本地编译需 WSL。
3. **写 worker Markdown 并编译提交。** 先 `gh extension install github/gh-aw` 安装扩展，再 `gh aw compile` 从 `.md` 生成 `.lock.yml`（需 gh CLI v2.0.0+、已 `gh auth login --scopes repo,workflow` 并用 `gh auth status` 确认、仓库写权限），把源 `.md` 与 lock 一起提交。
4. **收窄写入后再上线。** agent 保持只读，写操作只放在 `safe_outputs`／`conclusion`；代码 allowlist 只覆盖报告树和两个排除文件；保留人工 Ready／merge，并接受定时触发带来的反馈延迟。

## 1. 仓内净增量

**这组材料补的是“GitHub 原生 Agent 工作流如何把写入收窄、又如何失败和恢复”，不是又一个 Agent 工具清单。**

- [13 前沿雷达](../../../../13-frontier-radar.md) 已有反馈闭环、按需流程、窄 Skill、worktree、Storybook 等机制，但没有 GitHub Agentic Workflows／gh-aw 条目，也没有“Markdown 编译为 Actions、agent 只读、独立 safe outputs 写入”的运维层材料。13 的 Copilot 一栏只讲使用面调查与 Copilot 运行时迁移，不涉及这类执行边界。
- [收件箱](../../../inbox.md) 与 [A-FRONTIER-SOURCE-COLLECTION-20261027](../A-FRONTIER-SOURCE-COLLECTION-20261027/sources.md) 已有 Effect `@effect/api-diff`、Biome codegen、Nx、cargo-semver-checks 等基线。它们分别处理消费端声明快照、生成物清单、下游发现和兼容检查；dotnet/core 的机制不同：**确定性脚本从已发布 NuGet 构建生成报告，模型只负责发布、维护 PR 正文和接收范围内的评审反馈，人负责 Ready 与合并**。新增的是分工与写入边界，不是另一套 API 兼容算法。
- 真实维护证据是 PR #10482 的一个完整周期：评审提出“只修正了描述文字拼写”的噪声差异，机器人提交临时排除，维护者按 Preview 7 构建复核后批准并合并。该周期发生在 **2026-07～08，早于 10-28 GA**；不能把它写成 GA 之后的实测。
- 还补了一条可操作的反例：safe outputs 的 `update_pull_request` 每轮上限为 1，一次仅改标题的调用会把额度耗尽，导致正文与 `generated_at` 水位没有推进；下一轮（实际是手动 dispatch）才补上。这不是“配置存在即生效”的证明。

## 2. 可借的机制

**如果你的产物可以由确定性工具生成、又需要模型在 PR 上维护它，这套分工比“让模型从头写产物”更容易审。**

- **生成与发布分离**：`api-diff-discover.cs` 只查 NuGet feed，确定本轮要生成哪些 diff；`api-diff-generate.sh` 调 `RunApiDiff.ps1` 从固定版本／feed 生成报告。`RunApiDiff` 非零退出，或三家 SDK 均未产出报告（`report_count=0`）时才整体不发布；单个 SDK 无报告按零变化处理，其余报告照常发布（3b 注释称其为 legitimate zero-change result）。脚本头注释写的 “any missing SDK report” 与此实现自相矛盾。模型拿到的是已生成的报告和 `target.json`，不再负责“算差异”。
- **状态回读放在 PR 正文里**：PR 正文末尾有一个可见 YAML 注释块，记录 `current-version`、`status`、`generated-at` 和 identity marker。下一轮只读这个块，就能判断无变化、只刷新元数据、继续追加，还是重新生成。`generated_at` 在生成开始前取时间，避免把运行期间到达的评审反馈误标为已处理。
- **每轮先判 gate，再决定是否写**：`blocked`（人工已拥有同一 diff）、`noop`（版本、状态、反馈都没变）、`metadata_only`（只改正文／Ready／排除项）、`produce`（完整生成）分开。PR 发现查询或反馈查询失败时 fail-closed，不推进水位、下轮重试，而不是在残缺数据上写。
- **写入域用 allowlist 固定**：代码写入只允许 `release-notes/*/preview/*/api-diff/**`、`release-notes/*/*.0/api-diff/**` 和两个全局排除文件；PR 只建一个、正文只整体替换、标题不更新、不合并；`push-to-pull-request-branch` 只追加，不 amend／rebase／force。
- **评审反馈只接“可执行的窄动作”**：这里只接受属性／程序集排除请求，按固定格式写入排除文件并同步删报告中的条目；流程问题、改语义的请求、要求改正文的请求都记为 out of scope，不由模型执行。trust 由平台的 integrity filtering 处理（`min-integrity: approved`），模型不再自己做作者信任判断。
- **人工接管入口**：人可以按目标分支手工起一个 PR，自动化为其写入 marker 后接管；只带 `api-diff` 标签、没有 `automation` 的 PR 被视为人工所有，自动化对同一内容 stand down。

## 3. 什么条件下不值得采用

**这套东西的成本不低，且它解决的是“窄写入 + 定时维护 + 人工合并”，不是通用自主开发。**

- **没有确定性生成器或权威基线**：模型只能发布已生成的产物；如果差异本身要靠模型判断，或者没有可复现的源／目标版本，这套分工不成立。
- **不在 GitHub Actions、使用默认 Copilot CLI 引擎时没有 Copilot 许可，或无法配置所选引擎认证**：官方公告明确默认 Copilot CLI 引擎需要 Copilot 许可；Quick start 提供组织计费（per-run Actions token，需组织 Copilot 集中计费）与个人 fine-grained PAT（Copilot Requests: Read）两条认证路径。dotnet/core 还用了 `copilot-pat-pool` 环境和 10 个 `COPILOT_PAT_*` 占位，这是项目特定的认证机制，不是通用前提；GitHub-hosted runner 默认即可。没有这些条件，不应为了这套流程新建账号或凭据。
- **一次性或低量评审**：本地脚本生成 + 人工开 PR 更便宜。dotnet/core 的日报、90 分钟超时、单目标串行和完整 safe-output 框架，是为持续、可并行的发布节奏服务的。
- **需要模型写任意代码或做语义决定**：allowlist 只覆盖报告树和两个排除文件；模型被要求不改 diff 语义、不合并、不评论。需要更宽写入时，应换机制，而不是放宽这套 allowlist。
- **不能接受定时延迟**：反馈处理是 schedule-driven，没有 `pull_request_review` 触发；评审反馈最多等到下一轮。要即时响应，得另加入口，但这会改变信任与限流边界。
- **需要强安全证明**：官方文档把 threat detection 定位为 defense in depth，默认 warn；它不证明任意代码或产物安全。agent 还有 full bash、网络 allowlist 和 PAT 池，不能把“agent token 只读”当成整条流水线无外部写入。
- **发布就绪是人的判断**：这套自动化的 `status: code-complete` 是“主分支已 fork 到下一 major”的确定状态；真实的“API 形状已锁定、可以 Ready”可能早于这个状态，需要人工覆盖。PR #10482 就是这种覆盖的例子。

## 4. 权限与写入边界：只读 agent 不等于整条流水线不写

**这是本案最容易被发布稿误导的一点。** 官方架构文档说 agent job 是 minimal read-only、写操作交给独立 job；这不等于“整条流水线没有外部写入”，也不等于“agent 没有任何凭据”。

固定 SHA 的 lock 文件实际 job 权限：

| Job | 权限（lock 原文） | 能做什么 |
|---|---|---|
| orchestrator `discover` | `contents: read` | 只读、跑 C# 发现脚本 |
| orchestrator `api_diff` | `contents: write`、`pull-requests: write`、`issues: write`、`actions: read`、`packages: read` | 把写权限授予被调用的 worker，使 safe-output job 可写 |
| worker `agent` | `actions: read`、`contents: read`、`issues: read`、`pull-requests: read` | GitHub token 权限只读；不等于沙箱内没有其他凭据 |
| worker `safe_outputs` | `contents: write`、`issues: write`、`pull-requests: write` | 执行 create／update／push／mark-ready 等 safe outputs |
| worker `detection` | `contents: read` | 只读检测 |
| worker `conclusion` | `contents: write`、`issues: write`、`pull-requests: write` | 汇总、失败处理、`report_incomplete` 建 issue |

代码写入 allowlist 只覆盖：

- `release-notes/*/preview/*/api-diff/**`
- `release-notes/*/*.0/api-diff/**`
- `release-notes/ApiDiffAttributesToExclude.txt`
- `release-notes/ApiDiffAssembliesToExclude.txt`

但还有两类写入不在这个 allowlist 里：

- `create_report_incomplete_issue` 在 lock 中是自动加入的，`conclusion` job 的 `report_incomplete` step 以 `GH_AW_REPORT_INCOMPLETE_CREATE_ISSUE: "true"` 建／更新 issue（默认 max 5）。因此“代码写入只在报告树”成立，“所有 GitHub 写入只在报告树”不成立。
- `update_pull_request` 只允许 body，`allow_title: false`，每轮 max 1；`create_pull_request` max 1；`push_to_pull_request_branch` 默认 max 1；`noop` max 1。它们是 per-run 硬额度，不是无限重试。

此外，固定 worker 里 agent 拥有 `bash: [":*"]`、`network.allowed: defaults,dotnet,github,node`、`tools.github.mode: gh-proxy`、`min-integrity: approved`、`integrity-reactions: true`，并通过 `environment: copilot-pat-pool` 取 Copilot PAT。官方架构文档也提醒：“A read-only `GITHUB_TOKEN` does not remove other credentials or privileged host access.” 公开配置能证明的是 **agent job 的 `permissions` 是只读、GitHub 侧写路径由 safe-output／conclusion job 承担**；它不能证明 agent 沙箱内没有 `GH_AW_GITHUB_TOKEN`／Copilot PAT 等其他凭据，也不能证明所有外部副作用都被 allowlist 覆盖。

## 5. 主张 → 来源 → 实际范围／未知

| 主张 | 固定来源／维护者回执 | 实际范围／未知 |
|---|---|---|
| GitHub Agentic Workflows 于 2026-10-28 GA；Markdown 编译为标准 Actions YAML；agent 默认只读；写入经 safe outputs 和独立 threat detection；默认 Copilot CLI 引擎需要 Copilot 许可；github.com 的 Free／Team／Enterprise 可用；自托管可用 ARC + Docker-in-Docker。 | [GA 公告](https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/)，2026-10-28。 | 官方承诺。公告没有给出 safe-output 动作清单、审批流程、配额、模型版本或 runner 规格；这些要看原链接文档。 |
| 编译入口是 `gh aw compile`，生成 `.lock.yml`，源 `.md` 与 lock 都要提交；前置是安装 gh-aw 扩展（`gh extension install github/gh-aw`）、gh CLI v2.0.0+ 并已 `gh auth login --scopes repo,workflow`（`gh auth status` 确认）、仓库写权限、Actions 已启用；Windows 需 WSL。 | [Quick start](https://github.github.com/gh-aw/setup/quick-start/)，读取 2026-11-03；[Architecture](https://github.github.com/gh-aw/introduction/architecture/)。 | 官方文档。未安装扩展、未实际编译；不证明当前版本在本机可用。 |
| safe outputs 的 agent 请求与执行分离；`update-pull-request` 默认 max 1；`create-pull-request` 默认 max 1、可配置；agent 没有所请求操作的写权限。 | [Safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/)，读取 2026-11-03；固定 lock 中 `update_pull_request.max: 1`、`allow_title: false`、`create_pull_request.max: 1`。 | 文档 + 源码。配额是 per-run 硬限制；实际失败案例见 PR #10482 的 7-23 评论。 |
| dotnet/core 的发现是确定性、无 agent：`api-diff-discover.cs` 查 dnceng NuGet feed，输出目标 JSON；orchestrator 的 `discover` 只读，`api_diff` 通过 `workflow_call` 调用 worker，`max-parallel: 1`。 | [orchestrator.yml](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/workflows/api-diff-orchestrator.yml)，固定 SHA，commit 日期 2026-10-30T22:17:02Z；[discover.cs](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/scripts/api-diff-discover.cs)。 | 源码所见。`workflow_call` 是为了继承 orchestrator 的 actor，满足 gh-aw 的 activation role check；GITHUB_TOKEN 直接 dispatch 会以 `github-actions[bot]` 运行、没有 repo role 而失败。未运行。 |
| worker 的 host 生成是 `api-diff-generate.sh` → `RunApiDiff.ps1`，从固定 previous／current 版本与 feed 生成；`RunApiDiff` 非零退出、或三家 SDK 均无报告（`report_count=0`）时 `produce=false`；单个 SDK 无报告按零变化发布，其余报告照常发布。 | [generate.sh](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/scripts/api-diff-generate.sh)；[worker.md](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/workflows/api-diff-worker.md)。 | 源码所见。脚本头注释“any missing SDK report”与 3b 实现自相矛盾；生成需要 `pwsh`、feed 访问和 .NET SDK；未实际运行。 |
| worker 的 agent 只读；发布走 create／push／update／mark-ready／noop；不合并；只在 `status == code-complete` 时 Ready。 | worker.md frontmatter 与 “Invariants”；固定 [lock](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/workflows/api-diff-worker.lock.yml)。 | 源码所见。lock 中没有 merge safe output；agent 被要求 never merge。实际 Ready／合并见下节，均不是自动化的完整闭环。 |
| runner 与调度：orchestrator 每日 `17 13 * * *`（约 06:17 PT）；worker 把超时设为 90 分钟；discover／agent／detection 跑 `ubuntu-latest`，safe_outputs／conclusion 跑 `ubuntu-slim`；agent 在 AWF 容器与网络 allowlist 内运行。官方默认是 GitHub-hosted 或 Linux self-hosted 上的 Docker 隔离；ARC + DinD 是可选自托管拓扑，Cloud Hypervisor 仍是 preview。 | orchestrator.yml 的 `on.schedule`；worker.md 的 `timeout-minutes: 90`；lock 的 `runs-on`；[Architecture](https://github.github.com/gh-aw/introduction/architecture/)；[Frontmatter reference](https://github.github.com/gh-aw/reference/frontmatter/)（“Agentic step timeout, defaults to 20 minutes”）。 | 源码 + 官方文档。dotnet/core 没有使用 ARC／DinD 或 Cloud Hypervisor；未验证自托管路径。gh-aw 文档给的 agent job 默认超时是 20 分钟，worker 的 90 分钟是覆盖值。 |
| 模型与许可：默认 Copilot CLI 引擎需要 Copilot 许可；dotnet/core 使用 `engine.id: copilot`，通过 `environment: copilot-pat-pool` 和 10 个 `COPILOT_PAT_*` 占位取 token。7-28 run 的 footer 记录 `engine: copilot, version: 1.0.68, model: claude-sonnet-4.6`。 | GA 公告；worker.md `engine` 与 `imports`；PR #10482 正文 footer。 | 官方 + 源码 + 公开回执。当前 markdown 没有 pin 模型，footer 只是一次运行的观察；PAT 池是 dotnet/core 项目特定认证，不是 gh-aw 通用要求。 |
| 状态回读靠 PR 正文的可见 YAML 块：marker、`current-version`、`status`、`generated-at`；post-step 在发布前校验 full-body PR 写是否带全这些字段。 | worker.md “Automation state” 与 post-steps；lock 中 `Validate agent output identity`。 | 源码所见。marker 必须是可见 YAML 注释，不能是 HTML 注释；人类删掉 marker 会使该 PR 不再满足 silent no-op。 |
| gate 包括：人工 PR 拥有同一内容 → blocked；版本／状态／反馈都没变 → noop；只改状态或反馈 → metadata_only；查询失败 → fail-closed、不推进水位；分支被占 → collision suffix；增量只 append。 | generate.sh 第 0～4 节；worker.md。 | 源码所见。未构造这些分支实跑；不能证明所有 gate 在真实 GitHub 状态下都按预期命中。 |
| PR #10482 的评审要求“只修正描述文字拼写”的属性差异应从 diff 中移除；机器人提交临时排除，维护者按 Preview 7 构建复核后批准，PR 被 squash merge。 | [PR #10482](https://github.com/dotnet/core/pull/10482)；[内联评审 4772446945（comment 3644749035）](https://github.com/dotnet/core/pull/10482#pullrequestreview-4772446945)；[approval 4903418754](https://github.com/dotnet/core/pull/10482#pullrequestreview-4903418754)；commit [218d9c6](https://github.com/dotnet/core/commit/218d9c6211b4db632a6ed28e754f69ee6042e454)；merge commit [89e9c56](https://github.com/dotnet/core/commit/89e9c56afec8dd6ab23decd6385526907095e083)。 | 公开回执。PR 创建 2026-07-18，评审 2026-07-24，Ready 2026-08-07，批准与合并 2026-08-11；属于 pre-GA 实践，不是 GA 后实测。 |
| safe outputs 的 `update_pull_request` 额度曾被仅改标题的调用耗尽，正文没有刷新、`generated_at` 未推进；随后由 19:07 的手动 dispatch 补刷，维护者在次日用 #10493 把增量更新改为 body-only，禁止 title-only。 | [svick 评论 5060003219](https://github.com/dotnet/core/pull/10482#issuecomment-5060003219)，2026-07-23T15:03:48Z；[恢复评论 5062399074](https://github.com/dotnet/core/pull/10482#issuecomment-5062399074)，2026-07-23T19:17:44Z；[#10493](https://github.com/dotnet/core/pull/10493)，merged 2026-07-24T09:22:09Z。 | 公开回执。额度耗尽发生在 7-23 的 run 30013343944（结论 success，但 `update_pull_request` 失败；footer engine 1.0.68）；7-22 结论 failure 的 run 29926059198 footer 是 engine 1.0.63。恢复 run 是 `workflow_dispatch`（30036662379），不是“下一次计划任务”；#10493 的正文明确说“body-only so a title-only update cannot exhaust the per-run update limit”。未在修复后故意重放该失败。 |
| Ready 与合并的公开时间线：8-07 计划 run 失败后，jeffhandley 在 19:51 把 PR 标为 Ready 并请求评审；8-11 批准后 11 秒 squash merge。 | PR timeline；[run 31183989173](https://github.com/dotnet/core/actions/runs/31183989173)（2026-08-07 计划 run，结论 failure，未读日志）；approval 4903418754；merge commit 89e9c56。 | 公开时间线。Ready 的 actor 是 jeffhandley；配置没有 merge safe output，worker 文本要求人不合并。公开数据不能区分“网页人工操作”与“同账号 PAT”，但没有证据表明 agent 执行了 Ready／merge。 |
| 最终 PR 正文的人类可读 Status 说“Ready for review with Preview 7 locked down”，机器状态块仍写 `status: "in-development"`、`generated-at: "2026-07-28T13:59:36Z"`。 | PR #10482 最终正文；commit 5bd113c（2026-07-28T14:22:18Z）。 | 公开回执。两种状态表示在合并后的 PR 上不一致；说明自动化的 `code-complete` 判定与人的“API 形状已锁定”判定没有对齐，且 Ready 后没有观察到正文刷新。原因未知，未读日志。 |
| threat detection 默认是 warn 模式，可在发现威胁或检测无法完成时仍发布可审阅输出；strict blocking 需显式配置；它是 defense in depth，不证明产物安全。 | [Architecture](https://github.github.com/gh-aw/introduction/architecture/)；worker.md 未显式配置 strict。 | 官方文档。未构造威胁样本；不能把“有 detection job”当成安全通过。 |
| gh-aw 是 MIT 许可；GA 前后发布 v1.0.0（2026-10-26）、v1.0.1（2026-10-27）；固定 10-30 lock 的 setup step 使用 `github/gh-aw-actions/setup` v0.93.2。 | [github/gh-aw](https://github.com/github/gh-aw)、[releases](https://github.com/github/gh-aw/releases)；固定 lock manifest。 | 源码／发布页。公告只写“open source project from GitHub Next”，未写许可证；MIT 来自仓库元数据。lock 的 manifest 头另列 setup v0.82.6，与实际 step 的 v0.93.2 不一致，未追；版本号与 7 月 PR footer 的 engine 1.0.68 也不是同一层，不能互相替代。 |
| 当前编排的近期计划 run 在公开 run 列表上 10 次均为 failure（2026-10-24～11-02）。 | `https://github.com/dotnet/core/actions/workflows/api-diff-orchestrator.yml` 的 run 列表，读取 2026-11-03。 | 仅 run 级结论；未读日志，未重跑。run 成功也可能隐藏 safe-output 失败（见 7-23），run 失败也可能仍有刷新（见 7-22），所以不能据此判断当前端到端健康。 |

## 6. PR #10482 的真实维护闭环

时间线按公开事件，保留原日期；PR 是 **pre-GA** 的实践。

| 时间（UTC） | 事件 | 证据 |
|---|---|---|
| 2026-07-18 23:22 | `github-actions[bot]` 创建 draft PR，新增 30 个报告 .md（31 个文件含 README）；正文 `generated_at: 2026-07-18T23:07:21Z`。 | PR #10482；commit b1455bd |
| 2026-07-20 09:39 | svick（MEMBER）问旧的 code-owner 通知流程如何衔接。机器人 14:03 回复：流程问题，out of scope，未应用排除。 | issue comment 5020828800 / 5023120389 |
| 2026-07-21 08:30 | jeffhandley 说明 #10487 保留 draft→ready，并新增 repo／library area owner 检查清单；已开 PR 会在下一轮继承。 | issue comment 5031801496；#10487 merged 2026-07-23T12:56:18Z |
| 2026-07-22 14:02 | 机器人摘要称 metadata-only refresh；该 run 在 run 列表上是 failure，但仍有评论输出。 | issue comment 5046989941；run 29926059198 |
| 2026-07-23 14:03 | 机器人摘要称正文刷新到 `2026-07-23T13:56:37Z`、检查清单更新；run 结论 success；footer 记录 engine 1.0.68。 | issue comment 5059336891；run 30013343944 |
| 2026-07-23 15:03 | svick 引用 `report_incomplete` 警告：第一次 `update_pull_request` 仅发标题，耗尽 1 次额度；第二次带完整正文被拒；正文仍是 `2026-07-22T13:56:21Z`，水位未推进。 | [issue comment 5060003219](https://github.com/dotnet/core/pull/10482#issuecomment-5060003219) |
| 2026-07-23 19:07 | 手动 `workflow_dispatch` 启动恢复 run；19:17 机器人评论称正文已刷新、水位推进到 `2026-07-23T19:09:59Z`。 | issue comment 5062399074；run 30036662379（event=workflow_dispatch） |
| 2026-07-24 09:22 | #10493 合并：移除 routine timeline comment，增量更新改为 body-only，`title: false`，明确“never emit a title-only or bodyless update”。 | #10493 body 与 merge commit 0e9eb88 |
| 2026-07-24 10:39 | jeffhandley 内联评审：指出 `Microsoft.Extensions.Identity.Stores` 的差异只是 `annoated` → `annotated` 的拼写修正，要求抑制这类 attribute property typo corrections。 | review 4772446945 / review comment 3644749035 |
| 2026-07-24 14:02 | 机器人提交 [218d9c6](https://github.com/dotnet/core/commit/218d9c6211b4db632a6ed28e754f69ee6042e454)：新增 per-report `ApiDiffAttributesToExclude.txt`（`T:System.Diagnostics.CodeAnalysis.UnconditionalSuppressMessageAttribute`），把该报告改为“No API changes.”。 | commit 218d9c6；bot comment 5070695232 |
| 2026-07-28 14:22 | 机器人提交 [5bd113c](https://github.com/dotnet/core/commit/5bd113c18e79ef8894c2fbc4761aae6b0cba7fe6)：新一轮报告刷新；正文 `generated_at: 2026-07-28T13:59:36Z`，机器状态块 `report-count: 38`。 | commit 5bd113c；bot comment 5105375872 |
| 2026-08-07 13:43 | 计划 run 启动，run 列表结论 failure；未读日志。 | run 31183989173 |
| 2026-08-07 19:51 | jeffhandley 将 PR 标为 Ready for review，并请求 rbhanda、leecow 评审。 | PR timeline（actor jeffhandley） |
| 2026-08-11 06:13:03 | jeffhandley 批准：“I verified this against the Preview 7 builds, and verified the agent removed the noisy attribute changes that only fixed typos in description text.” | [approval 4903418754](https://github.com/dotnet/core/pull/10482#pullrequestreview-4903418754) |
| 2026-08-11 06:13:14 | jeffhandley squash merge；merge commit 89e9c56，PR head 5bd113c，3 commits。 | PR timeline；merge commit 89e9c56 |

**这组回执说明什么：**

- 评审反馈的“窄动作”确实被执行：临时排除文件 + 删除报告中的噪声条目，随后维护者按 Preview 7 构建复核，不是只信机器人摘要。
- 自动化的 body 刷新不是“run success 就成功”：7-23 的 run 结论 success，但正文没刷新；7-22 的 run 结论 failure，却仍有评论。run 级结论只能当线索。
- 恢复不是自动的“下一次计划任务”：实际是 19:07 的手动 dispatch；公开记录不能证明计划任务会自行恢复。
- 公开时间线把 Ready 与 merge 记为 jeffhandley；配置没有 merge safe output，worker 文本要求人不合并，没有看到 agent 执行 Ready／merge 的证据。最终正文的机器状态块仍写 `in-development`，与人类可读 Status 不一致，所以不能把这个 PR 写成“agent 自动完成 Ready→merge”。

## 7. 与 13／inbox／既有 sources 的差异

- 与 [13](../../../../13-frontier-radar.md) 的“反馈闭环／运行＋回归保护”相比：13 讲的是把一次发现的错误变成下次会失败的检查；这里讲的是把**写入动作**放到独立的 safe-output job，并让 agent 只读。两者都属“反馈”，但后者是权限与发布边界，不是测试闭环。
- 与 [13](../../../../13-frontier-radar.md) 的“按需流程／Superpowers”相比：Superpowers 是任务流程分流；这里是 GitHub Actions 原生的定时工作流，状态与恢复靠 PR 正文和 run gate。
- 与 [收件箱](../../../inbox.md) 的 Effect `api-diff` 相比：Effect 比较两个 revision 的 TypeScript 声明快照并生成迁移文档；dotnet/core 比较已发布 NuGet 构建的 .NET 公开 API，模型只维护报告 PR。语言、产物、消费者都不同，不能合并成一条“API diff 工具”。
- 与 [A-FRONTIER-SOURCE-COLLECTION-20261027](../A-FRONTIER-SOURCE-COLLECTION-20261027/sources.md) 的 Biome／Nx／cargo-semver-checks 相比：那些是生成物清单、下游发现、兼容 lint；本项是“确定性报告 + 模型发布 + 人工合并”的运维分工，补的是这些材料没有的 safe-output 与 PR 状态回读。
- 与 API 兼容检查基线（ApiCompat／API Extractor／Griffe）相比：dotnet/core 不给 semver 结论，也不阻断合并；它产出供人评审的公开 API diff 报告。适合“发布前需要人看差异”的流程，不适合替代兼容性闸门。

## 8. 未闭合与待核

- **当前端到端健康未知**：2026-10-24～11-02 的 10 次计划 run 在公开列表上均为 failure（10/10）；未读日志，无法区分发现、生成、agent、safe-output 或 conclusion 哪一段。不能据此说当前流水线失效，也不能说它正常。
- **Ready 的人工覆盖原因未知**：8-07 的计划 run 失败后，人类在 19:51 标 Ready；最终正文的机器状态仍是 `in-development`。是人的“API 形状锁定”判断早于自动化的 `code-complete`，还是正文刷新漏跑，公开数据不能区分。
- **实际 no-op／blocked 未单独取证**：worker 文本说 no-op 是常规结果，generate.sh 也有 no-op 与 blocked gate；但公开 PR 上能看到的是 metadata-only 刷新与一次失败，没有找到一条明确记录为 no-op 的 run 或“人工 PR 拥有同一内容”的 blocked 样本。这两条仍是源码与设计事实，不是本案实测。
- **修复是否彻底未知**：#10493 把更新改为 body-only、禁止 title-only，固定 lock 也保持 `allow_title: false`；但没有在修复后故意重放“title-only 耗尽额度”的输入，不能声称该失败已复验消失。
- **写入边界仍有未知**：公开 lock 能证明 agent job 的 GitHub token 权限只读、safe-output／conclusion job 有写权限；不能证明 agent 在沙箱内没有其他凭据，也不能证明所有外部副作用都在 allowlist 内。需要读 AWF cli-proxy 策略与 secret scope 才能进一步核，未做。
- **merge 边界只到配置层**：lock 没有 merge safe output，worker 文本要求 never merge；但 agent 有 full bash，工作流也传入 PAT／token，公开配置不能证明 agent 在沙箱内无法调用 `gh pr merge` 或其他写命令。实际 PR 的 merge actor 是 jeffhandley，仍需日志／策略才能确认是谁执行。
- **模型身份不固定**：7-28 run 的 footer 记录 `engine: copilot, version: 1.0.68, model: claude-sonnet-4.6`；当前 worker markdown 没有 pin 模型，模型会随 provider／router 变化，不能把这一次的模型当成稳定依赖。
- **Related API proposals 的准确率未知**：worker 让模型把新增 API 与 `dotnet/apireviews`／提案仓匹配；PR #10482 最终正文没有该 section，无法判断是“无匹配”还是“未生成”。这是一段纯模型关联，未独立核准确率。
- **成本与收益未知**：PR footer 的 AIC 数字是平台计费／用量标记，不是可比的 token 或人工成本；没有同任务对照，不能据此说省时或省钱。
- **GA 后的行为未知**：真实 PR 周期是 7～8 月、PR footer 记录的 engine 为 1.0.68；10-30 固定配置是 GA 后源码，但没有观察到 GA 后的同类 PR 闭环。官方文档的新能力不能倒推这份 7 月实践已复验。

## 9. 来源与日期

| 来源 | 原日期 | 读取日期 | SHA／版本 |
|---|---|---|---|
| [GitHub Agentic Workflows GA 公告](https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/) | 2026-10-28 | 2026-11-03 | 页面无 commit |
| [gh-aw Quick start](https://github.github.com/gh-aw/setup/quick-start/)、[Architecture](https://github.github.com/gh-aw/introduction/architecture/)、[Safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/)、[Engines](https://github.github.com/gh-aw/reference/engines/)、[Frontmatter](https://github.github.com/gh-aw/reference/frontmatter/) | 页面未标日期 | 2026-11-03 | 站点文档 |
| [github/gh-aw](https://github.com/github/gh-aw)、[releases](https://github.com/github/gh-aw/releases) | v1.0.0 2026-10-26；v1.0.1 2026-10-27 | 2026-11-03 | MIT；release tag |
| [dotnet/core orchestrator](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/workflows/api-diff-orchestrator.yml)、[worker.md](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/workflows/api-diff-worker.md)、[lock](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/workflows/api-diff-worker.lock.yml)、[discover.cs](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/scripts/api-diff-discover.cs)、[generate.sh](https://github.com/dotnet/core/blob/5f99c19c62154814a35716e0726c82be29c690de/.github/scripts/api-diff-generate.sh) | commit 2026-10-30T22:17:02Z | 2026-11-03 | `5f99c19c62154814a35716e0726c82be29c690de` |
| [PR #10482](https://github.com/dotnet/core/pull/10482) | created 2026-07-18T23:22:32Z；merged 2026-08-11T06:13:14Z | 2026-11-03 | head `5bd113c18e79ef8894c2fbc4761aae6b0cba7fe6`；merge `89e9c56afec8dd6ab23decd6385526907095e083` |
| PR #10482 评审 4903418754 | 2026-08-11T06:13:03Z | 2026-11-03 | APPROVED |
| PR #10482 内联评审 4772446945 / comment 3644749035 | 2026-07-24T10:39:05Z | 2026-11-03 | COMMENTED |
| PR #10482 评论 5060003219 | 2026-07-23T15:03:48Z | 2026-11-03 | svick（MEMBER） |
| PR #10482 恢复评论 5062399074 | 2026-07-23T19:17:44Z | 2026-11-03 | run 30036662379（workflow_dispatch） |
| dotnet/core commit 218d9c6 | 2026-07-24T14:02:31Z | 2026-11-03 | `218d9c6211b4db632a6ed28e754f69ee6042e454` |
| dotnet/core commit 5bd113c | 2026-07-28T14:22:18Z | 2026-11-03 | `5bd113c18e79ef8894c2fbc4761aae6b0cba7fe6` |
| [PR #10487](https://github.com/dotnet/core/pull/10487) | merged 2026-07-23T12:56:18Z | 2026-11-03 | merge `2b9a7641e588733b5feffa1e47adf5cc436e5f5e` |
| [PR #10493](https://github.com/dotnet/core/pull/10493) | merged 2026-07-24T09:22:09Z | 2026-11-03 | merge `0e9eb8828b73f69cfae6bd74ec93b6e438b8e77d` |
| dotnet/core Actions run 列表 | 2026-07-17～08-13；2026-10-24～11-02 | 2026-11-03 | run 级结论，未读日志 |

**未做**：未安装 gh-aw 扩展，未运行 `gh aw compile`，未运行 GitHub Actions、dotnet、`RunApiDiff.ps1`、浏览器或 gh-aw 的模型工作流；未在 fork 中重放 safe-output 配额失败；未读取任何私有对话、凭据、账号用量或运行日志。本文件只作事实材料，不宣称试用、采用或替代现有默认。
