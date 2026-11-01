# A-LONG-ROUTE-FOREMERGE-READER-20261101 · 接收结果

读者：未参与[长程开发页](../../../../decisions/long-tasks.md)和本次 Foremerge 试验。页面全文已原样附入任务正文，与 `docs/decisions/long-tasks.md@0004f093` 逐字节一致（105 行，sha256 `31a55caeda6854b6569237d615c0468eed080ede175ad44074f7cad390786854`）。本文件只写接收结果；未改页面、`inbox.md`、`TASKS.md` 或 `input.json`。

## 判断

**保留 Foremerge 0.6.0 作为“发布回执核对”的试用候选；不采用为默认协调方式；0.5.1 不适用于该用途。**

| 对象 | 判断 | 依据 |
|---|---|---|
| Foremerge 0.6.0 | 🧪 试用，限“记录实际落地提交并核对已接受内容是否真的落地” | 对同树、同父、互不为祖先的候选／落地提交，按内容核为 `COMMITTED`（`integration.method=content`，2 个路径） |
| Foremerge 0.5.1 | ⛔ 不适用该用途 | 对同一实际落地提交返回 `TARGET_DIVERGED`，漏报已正确落地的结果 |
| 现有协调方式 | 不改变 | 本例单写者、两文件、无并发 Agent、无模型参与；只支持落地回执核对这一层 |

本例支持的是“版本选择＋发布后落地回执核对”的结论，不支持“编辑前协调收益”“多 Agent 协调收益”“长程提速”或“替代接收端”。编辑前的意图声明、写域冲突暴露、符号提示完整性都没有在本回放中出现，仍是未试用项。默认仍是现有 worktree＋明确写域＋主线连续接收；只有已经并行编辑、且需要跨写者核对“接受到的内容是否真的落地”时，才考虑试用 0.6.0，且不能把这项回执核对当作编辑前协调已经验证。

**何时不适用**：单写者或 `git` 已足够的小改动；需要编辑前意图声明、冲突暴露或符号完整性；需要消费者／运行时验收；有意只落地部分内容（应新发布 revision，而不是让回执核对通过）；候选来源无法确认。上述任一成立时，保留现有 worktree＋明确写域，不引入 Foremerge。

## 建议替换文字（inbox Foremerge 段落）

以下文字用于替换 `docs/collaboration/inbox.md` 中“Foremerge 候选的准确边界”“怎么取舍”两段，并用新的“依据”行替换原“依据与核读范围”里关于固定源码核读的描述；本次未实际改动 inbox。

```markdown
**Foremerge｜🧪 试用（仅发布回执核对，0.6.0；0.5.1 不适用）**：真实两文件 CLI 回放中，0.6.0 能把与已接受候选同树、但不是其后代的实际落地提交按内容核为 COMMITTED（`integration.method=content`，核 2 个路径）；0.5.1 对同一落地返回 `TARGET_DIVERGED`，不能记录 squash／rebase 式落地。两版都拒绝只含 README、缺 `results.json` 的部分落地，0.6.0 还会指出缺哪个路径。适合已并行编辑、需要核对“接受到的内容是否真的落地”的仓库；不替代本仓接收端，也不证明多 Agent 协调收益。编辑前的意图声明与冲突暴露仍未试用，本例只覆盖发布后的回执核对。回放只覆盖单写者、两文件、`check_repo` 命名检查；未跑 hosted CI、原 prek 试验或完整套件，消费者验收仍按项目要求。落地已回读：`c735c8ed` 在远端 main 历史中，两文件 blob 与当时公开内容一致。

**怎么取舍**：保留 0.6.0 作为发布回执核对的试用候选；0.5.1 不用于该用途。默认仍是现有 worktree＋明确写域＋主线连续接收；本回放没有并发协调、冲突暴露或模型参与，不足以改变现有协调方式，也不能当作编辑前协调已通过。

**依据**：[issue #38](https://github.com/naw103/foremerge/issues/38)、[PR #51](https://github.com/naw103/foremerge/pull/51)、[v0.6.0 release](https://github.com/naw103/foremerge/releases/tag/v0.6.0)、[实际落地 c735c8ed](https://github.com/dbvv1/a1dbv/commit/c735c8ed27334f2d4cc9218fece214fa8f83c41b)、[回放结果](local-jobs/artifacts/A-LONG-ROUTE-FOREMERGE-READER-20261101/result.md)；回放与核对 2026-11-01。
```

## 关键证据

### 版本、返回与落地

两个记录使用同一受验版本输入：候选 `53cc161e062ec78d63c3981a943a227631ea4cd6`，实际落地 `c735c8ed27334f2d4cc9218fece214fa8f83c41b`，共同父提交 `185b1f636724994a2c20491425594531a7157b96`。候选与落地树都是 `163c202aaee5b70414893f47d7eab6c105173d13`，互不为祖先，`git diff --exit-code` 为 0；候选由 dot-A 的 Agent 固定身份提交，落地由公开提交作者提交。

| 检查 | 0.5.1 | 0.6.0 |
|---|---|---|
| 版本自报 | `foremerge 0.5.1` | `foremerge 0.6.0` |
| 发布前生命周期 | 先 publish（状态 `INTENT`）→ `INVALID_TRANSITION`；补 `work claim`＋`work start` 后重试成功 | 先 claim＋start 再 publish，一次成功 |
| 发布／验证／接受 | 发布、`check_repo` 通过、接受均成功 | 同上；`check_repo` 通过、接受成功 |
| 部分落地（只含 README） | `TARGET_DIVERGED`，只有泛化消息 | `TARGET_DIVERGED`，指出 `experiments/prek-clean-filter/results.json (missing)` |
| 实际落地 `c735c8ed` | `TARGET_DIVERGED`（假阴性）；改记候选自身后才 `COMMITTED` | `COMMITTED`；`integration.method=content`，merge base `185b1f63`，2 个路径 |
| 最终状态 | `COMMITTED` 到候选 `53cc161e`，不是实际落地 | `COMMITTED` 到实际落地 `c735c8ed` |

`check_repo` 两版都报 `checked_files: 639`、`errors: []`、退出 0；其自带限制是只查仓内行内链接目标和 JSON/TOML 语法，不查外部链接、事实或消费者行为。因此这 639 个文件只是命名检查范围，不是发布成功或协作收益。

### 失败控制与首次失败

- **首次失败是驱动顺序，不是 CLI 回归。** 0.5.1 第一次 `changeset publish` 在 `INTENT` 状态被拒：`INVALID_TRANSITION: cannot publish a ChangeSet revision while state is INTENT; expected CLAIMED or IN_PROGRESS or PROVISIONAL or VALIDATED`。补 `work claim`＋`work start` 后同一发布成功；0.6.0 记录从一开始就用正确顺序，所以没有这次失败。
- **0.5.1 对实际落地的失败未被该版本修正。** 同一实际落地返回 `TARGET_DIVERGED: recorded integration commit does not contain the accepted candidate`；随后用候选自身做正控制才得到 `COMMITTED`，最终 `integration_commit` 仍是候选，不是实际落地。这个正控制与 0.6.0 的内容式回退对照，说明 0.5.1 的落地检查只走祖先关系，不走内容等价。
- **0.6.0 对部分落地的拒绝是正确失败。** 只含 README 的对照提交被拒，并点名缺少 `results.json`；这证明内容检查没有把“少一个文件”当成已落地。

### 身份与远端回读

- 本地 `git show` 复核落地 `c735c8ed`：树 `163c202…`、父 `185b1f63…`、作者为公开提交作者；`185b1f63` 下没有 `experiments/prek-clean-filter/`，落地 diff 是新增 README 与 `results.json` 两个文件。
- `remote-readback.json` 在 2026-11-01T19:25:45Z 观测：`refs/heads/main` 为 `54ebf662c06eea9af98522654ee2ef28c13ac958`；README blob `89e6f28f5053a1788c914eae14d640b24d49a633`、results blob `a953e33ec6e3893469150428ff36b83c19d1f384` 均为当时公开内容。`metadata.json` 的 `remote_followthrough` 另记 19:25:57Z 对落地 `c735c8ed` 的祖先检查退出 0。
- 本地复核同一事实：`c735c8ed` 是 `54ebf662` 与当前任务 base `0004f093` 的祖先（两次 `merge-base --is-ancestor` 均退出 0），两文件 blob 在 `c735c8ed`、`54ebf662`、`0004f093` 上一致，说明回读不是只存在于报告里。
- **hosted CI 未确认**：本次没有查 hosted CI 运行证据，不写成通过，也不写成“确认未触发”。消费者验收未运行。

### 输入与页面完整性

- 页面全文与 `docs/decisions/long-tasks.md@0004f093` 逐字节一致，见页首 sha256。
- `input.json` 的 `downloads.json`、`remote-readback.json`、`metadata.json` 三份 `raw_sha256` 可由嵌入内容按 pretty JSON＋LF 复算；`run.json` 的 `raw_sha256` 复算不出，符合“路径／作者名已脱敏、保留原始 JSON hash”的说明，不能据此判输入被改。
- 候选 `53cc161e` 的对象不在接收 clone 中，候选身份、树和“互不为祖先”只能取自 `run.json` 记录的 stdout；落地树的本地复核值 `163c202…` 与记录中的候选树相同，缩小但不能完全替代这项缺口。

### 写者与槽位

本单元在 `docs/collaboration/local-jobs/artifacts/A-LONG-ROUTE-FOREMERGE-READER-20261101/` 有输入 `input.json`，没有 `result.md`；`docs/collaboration/local-jobs/` 没有同 ID 任务文件，`TASKS.md` 没有本 ID 或 Foremerge 行。结论：只有输入槽位，没有已登记结果或可确认写者。同一 artifacts 目录另有 18 个任务目录；本次未读取其内容、未重排或接管，也不据此宣称全局空闲。共享并行由既定接收器决定，本次未另起调度。

## 已验、未验与剩余必要动作

**已验**：0.5.1／0.6.0 的实际版本；发布、验证、接受与部分落地拒绝；0.6.0 的内容式落地记录；落地提交身份、祖先关系与两文件 blob；页面与输入 hash 的可复算部分。

**未验**：候选对象本体；`run.json` 脱敏前原文；hosted CI；完整测试套件；原 prek 两版本试验；真实消费者入口；并发 Agent、写域冲突、符号提示与意图漏项；其他操作系统和更多落地形态；0.6.0 源码／tag 的独立核读（本次只读官方 issue、PR 与 release 页）。

**剩余必要动作**：本单元只需保留候选，不要求重跑。若要把 0.6.0 提升为默认或替换接收端，至少还需一个真实并发多写者案例（含 claim 冲突与部分落地）、一个消费者验收，以及按该提交绑定的 hosted CI 证据；这些不在本单元范围。

## 页面卡点

**页面全文：已原样进入，无缺失。** 105 行与 base 版逐字节一致；任务正文没有只给链接或摘要。

**实际采用的步骤**：读 `input.json` 的两版记录；按页面“先分类再行动”核对版本、接收、落地与失败控制；用本地 Git 复核落地身份／祖先／blob；按页面“最终接收分开看受验版本和实际落地”分别判断；最后写判断与 inbox 替换文字。没有重跑 Foremerge、prek 或完整套件。

**页面本身无阻塞卡点。** 页面没有写“到哪查当前写者／同项结果”，我按仓内约定查了 `docs/collaboration/local-jobs/`、`TASKS.md` 和本产物目录：没有同 ID 任务文件或 `TASKS.md` 行，产物目录只有 `input.json`，没有 `result.md` 或其他写者。页面也没有规定两版工具结果不同时怎么表述，我按“保留失败和仍有效的结果”分别下判断；这不影响做法。

**环境／证据限制，不是页面缺陷**：

- 外层任务禁止提交、推送和切换分支，所以没有生成固定提交，也没有按 `result_branch` 交付；产物是工作树文件，需在允许提交的环境补固定提交。
- 工作树的 `user.email` 是内部地址，不能直接用于公开提交；本次未提交，若后续提交须按运行细则§1 用 noreply 身份覆盖（本文件不写该地址）。
- 候选对象不在接收 clone，候选身份只能依赖记录；远端和落地内容已用本地 Git 复核。

**这项真实接收做成与否**：内容层面做成——有版本区分、接收／落地证据、失败控制、未验清单和可替换文字；交付层面未完成——没有固定提交和推送，原因在上面的外层约束。

## 核查记录

- `python scripts/check_repo.py`：当前仓库 `checked_files: 643`、`errors: []`、退出 0；回放记录中的两次命名检查是在候选提交上各 639 个文件，不能与当前仓库的文件数直接互换。
- `python scripts/check_public.py`：把两份新文件以 intent-to-add 纳入后扫描 1099 个文件，`findings: []`、退出 0；扫描器自述只做模式扫描，不替代人工读 diff。
- `git diff --check`：退出 0，无空白错误；两份新文件均为 UTF-8／LF、无行尾空白。
- 提交身份：工作树配置的 `user.email` 不是 noreply，已在上文记为环境限制；本次没有创建提交。
- 未提交、未推送、未切换分支；未改页面、inbox、TASKS、模板或 `input.json`。两份新文件在工作树中为未跟踪状态。
