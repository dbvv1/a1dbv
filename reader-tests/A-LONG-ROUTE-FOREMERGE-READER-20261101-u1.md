# 新读者记录 · A-LONG-ROUTE-FOREMERGE-READER-20261101 · u1

角色：第一次读该页的读者。只按任务给出的页面全文、任务输入 `input.json` 和仓内必要约定操作；未参与该页或 Foremerge 试验。未读 a1dbv 的其他研究文档，未搜同主题教程，未重跑 Foremerge／prek／完整套件，未读旧广扫运行材料、私人会话或模型网关材料。

## 做到哪一步

内容流程做完，交付动作受外层约束未完成：

1. 核对页面全文：与 `docs/decisions/long-tasks.md@0004f093` 逐字节一致，105 行，sha256 `31a55caeda6854b6569237d615c0468eed080ede175ad44074f7cad390786854`。
2. 读取 `docs/collaboration/local-jobs/artifacts/A-LONG-ROUTE-FOREMERGE-READER-20261101/input.json`，拆出 `run.json`、`downloads.json`、`remote-readback.json`、`metadata.json` 四份记录。
3. 按页面“先分类再行动”核对两版 Foremerge 的发布、验证、接受、失败控制与实际落地；用本地 Git 复核 `c735c8ed` 的身份、树、祖先和两个文件 blob，用 `54ebf662` 与当前 base `0004f093` 交叉核远端回读。
4. 按页面“最终接收分开看受验版本和实际落地”给出按版本判断：0.6.0 保留为发布回执核对的试用候选，0.5.1 不适用该用途，现有协调方式不改变。
5. 写 inbox Foremerge 段落的替换建议和未验清单。

产物位置：`docs/collaboration/local-jobs/artifacts/A-LONG-ROUTE-FOREMERGE-READER-20261101/result.md`。本记录是外层 reader-test 要求的卡点日志，不属于任务的 inbox／TASKS 写入范围。

工作目录内未提交、未推送、未切换分支，未改页面、`input.json`、`inbox.md`、`TASKS.md` 或模板。

## 卡点

### 1. “先核…已有结果和当前写者”（页面“从当前任务开始”段）

- 页面原句：“先核最新需求、项目规则、实际版本及改动、已有结果和当前写者。”
- 缺什么：页面没有写去哪里核同项结果和写者。
- 实际处理：查本产物目录（只有 `input.json`，无 `result.md`）、`docs/collaboration/local-jobs/` 下同 ID 任务文件（无）、`docs/collaboration/TASKS.md` 的 Foremerge／本 ID 行（无）。结论：本单元只有 artifacts 目录里的输入，没有已登记结果或可确认的写者；不宣称全局空闲，也没有接管旧卡。
- 做错过的：无。
- 归属：页面（轻，非阻塞）；仓内 `local-jobs/README.md` 的约定足以补上。

### 2. “已获准发布时串行提交并回读…”（页面“交出去什么，收到后核什么”后段）

- 页面原句：“已获准发布时串行提交并回读目标仓库／分支与实际内容，另核该版本 CI。”
- 缺什么：外层任务明确禁止提交、推送和切换分支，因此没有固定提交、没有按 `result_branch` 推送，也没有核 hosted CI。
- 实际处理：把判断、替换文字和证据写进工作树产物；记录所有检查命令和结果；在结果里把“固定提交／推送／CI”列为未完成的交付动作，不写成完成。
- 做错过的：无；这是约束冲突，不是操作失误。
- 归属：环境／外层任务，不是页面。

### 3. “核实际差量、运行输出与受检版本”（页面“从当前任务开始”段）

- 页面原句：“结果回来后，核实际差量、运行输出与受检版本，判断接收、返工或阻塞。”
- 缺什么：候选提交 `53cc161e…` 的对象不在接收 clone 中，无法本地 `git show`；候选身份、树和“互不为祖先”只能取自 `run.json` 的记录。
- 实际处理：本地复核落地提交 `c735c8ed…` 的树 `163c202…`、父 `185b1f63…`、作者身份、祖先关系和两文件 blob；落地树与记录中的候选树相同，缩小但不能完全替代候选本体的缺口；在结果中明确标为“记录值，未独立复核”。
- 做错过的：无。
- 归属：环境／证据，不是页面。

### 4. 两版结果不同的表述（页面“接回之后，走到当前目标的终点”段）

- 页面原句：“先分类再行动，保留失败和仍有效的结果。”
- 缺什么：页面没有给“同一工具两版对同一落地结果不同”的现成写法。
- 实际处理：按“保留失败和仍有效的结果”分版本判断，保留 0.5.1 的 `TARGET_DIVERGED` 假阴性和首次 `INVALID_TRANSITION`，保留 0.6.0 的内容式成功和部分落地的正确拒绝。
- 做错过的：无。
- 归属：页面（很轻，非阻塞）；原则足以推出做法，任务正文也要求保留首次失败和修正经过。

### 自误（环境／模型）

第一次用 Python 把页面内容打印到 Windows 控制台时，GBK 编码无法输出页面里的 emoji，`UnicodeEncodeError` 导致后续写文件没执行；改用 `PYTHONIOENCODING=utf-8` 和文件比对后正常。属模型／环境自误，已恢复，不是页面缺信息。

## 页面之外还翻了什么

- `docs/collaboration/local-jobs/README.md`：确认 reader-test 产物、`result_branch` 和“不改页面”的约定；页面没有定义这些流程。
- `docs/collaboration/operations.md` §1：确认 `check_repo`／`check_public`、空白检查和提交身份要求；页面只说“适用检查”，没给命令。
- `docs/collaboration/inbox.md` 的 Foremerge 段：确认替换目标和原文边界。
- `docs/collaboration/TASKS.md`：核同 ID 是否已登记、是否有其他写者；未改。
- `scripts/check_repo.py`、`scripts/check_public.py`：确认检查范围与“只查行内链接／语法”的限制。
- `reader-tests/A-CI-PROJECTION-READER-20261027-u1.md`：参考既有 reader-test 记录格式。
- 输入内已有的官方来源：Foremerge issue #38、PR #51、v0.6.0 release 页；用于核对 0.5.1／0.6.0 的行为差异是否正是官方描述的 squash／rebase 场景。
- 本地 Git 对象与历史：`c735c8ed`、`54ebf662`、`0004f093`、两个 blob；用于独立复核落地和远端回读。
- 未看：a1dbv 其他研究文档、同主题其他教程、私人会话、旧广扫运行材料、模型网关地址或凭据。

## 核对

核对角色：本单元读者对输入、页面和结果的自核，不是独立第三方复核。核对日期：2026-11-01。

- 页面：`git show 0004f093:docs/decisions/long-tasks.md` 与任务正文页面段 `diff` 为空，sha256 相同。
- 输入 hash：`downloads.json`、`remote-readback.json`、`metadata.json` 的 `raw_sha256` 可由嵌入内容按 pretty JSON＋LF 复算；`run.json` 复算不出，符合“路径／作者名脱敏、保留原始 hash”的说明。
- 本地 Git：`c735c8ed` 是 `54ebf662` 与 `0004f093` 的祖先（退出 0）；`c735c8ed` 的树为 `163c202…`，父为 `185b1f63…`；README／results 的 blob 为 `89e6f28…`／`a953e33…`，在 `c735c8ed`、`54ebf662`、`0004f093` 上一致；`185b1f63` 下无该实验目录，落地 diff 为新增两文件。
- `python scripts/check_repo.py`：当前仓库 `checked_files: 643`、`errors: []`、退出 0；回放记录中的两次检查各 639 个文件，是在候选提交上的范围，不与当前仓库文件数互换。
- `python scripts/check_public.py`：把两份新文件以 intent-to-add 纳入后扫描 1099 个文件，`findings: []`、退出 0；扫描器自述只做模式扫描，不替代人工读 diff。
- `git diff --check`：退出 0，无空白错误；两份新文件均 UTF-8／LF、无行尾空白。
- 提交身份：工作树 `user.email` 是内部地址，不是 noreply；本次未提交，若提交须按运行细则§1 用 `-c user.email=<noreply>` 覆盖。
- 交付状态：内容产物已写；无固定提交、无推送、无 CI 证据，原因见卡点 2。结论保留为“内容做成、交付未完成”，不冒充已接收或已发布。

### 非作者复核（2026-11-02）

核对角色：未参与页面与试验的第三方复核；只认工作树产物和可复跑证据，不采信自报。

- 页面全文：任务正文第 36 行起与 `git show 0004f093:docs/decisions/long-tasks.md` 逐字节 `diff` 为空，105 行、sha256 `31a55cae…` 一致；全文确已进入正文。
- 输入 hash：`downloads.json`、`remote-readback.json`、`metadata.json` 按 pretty JSON＋LF 复算分别命中 `dbab0d…`、`13d90c…`、`a3cc10…`；`run.json` 复算为 `15f67f…`，与记录 `f08fb4…` 不同，符合脱敏后内容与原始 hash 分离的说明。
- 本地 Git：`c735c8ed` 树 `163c202…`、父 `185b1f63…`，对 `54ebf662` 与 `0004f093` 的 `merge-base --is-ancestor` 均退出 0；两文件 blob `89e6f28…`／`a953e33…` 在三个提交一致；`185b1f63` 无该实验目录，落地 diff 为新增两文件；候选 `53cc161e` 的 `git cat-file` 退出 128，确认对象不在接收 clone。
- 回放语义：逐 step 复核 `run.json`，0.5.1 首次 `changeset publish` 为 `INVALID_TRANSITION`（INTENT），补 claim／start 后成功；实际落地 `c735c8ed` 返回 `TARGET_DIVERGED`，候选自身正控制才 `COMMITTED`；0.6.0 对部分落地 `0588fd4f` 返回带 `results.json (missing)` 的 `TARGET_DIVERGED`，对实际落地返回 `COMMITTED`，`provenance.integration.method=content`、`paths_checked=2`；两版 `check_repo` 均 `checked_files: 639`、`errors: []`。与读者表格一致。
- 官方来源：issue #38 与 PR #51 独立核对，确认 0.5.1 只按祖先关系、0.6.0 增加内容回退并按路径说明拒绝原因；读者的“0.5.1 假阴性、0.6.0 内容式成功、部分落地正确拒绝”有官方依据。
- 当前检查：`check_repo.py` 为 `checked_files: 643`、`errors: []`、退出 0（含两份新文件）；两份新文件 intent-to-add 后 `check_public.py` 为 `checked_files: 1099`、`findings: []`、退出 0；UTF-8／LF、无行尾空白，`git diff --check` 退出 0；`user.email` 为内部地址，未提交。复核后已 `git reset` 撤回 intent-to-add。
- 写者／槽位：`docs/collaboration/local-jobs/` 无同 ID 任务文件，`TASKS.md` 无本 ID 或 Foremerge 行；`artifacts/` 共 19 个目录，另有 18 个未读目录。读者没有冒充全局空闲。
- 结论：内容层验收通过，判断、替换文字、证据、已验／未验／剩余动作和页面卡点均成立；没有把 639 个文件的命名检查写成发布成功或协作收益。交付层没有固定提交、推送或按提交绑定的 CI，原因是外层任务禁止提交、推送和切换分支，页面以“已获准发布时”限定该动作。按任务自己的验收（含“回固定提交供负责人本轮接收”），整体仍未完全做成；这是环境／外层约束，不是读者能力问题，也不是页面缺步骤。恢复条件：在允许提交的环境按运行细则§1 用 noreply 身份提交两份产物到 `result_branch`，再核对 hosted CI。
- 未采信的自报项：候选身份／树／互不为祖先仍只有 `run.json` 记录；hosted CI 与消费者验收未验证；0.6.0 源码／tag 未独立核读。与读者的“未验”一致。
- 读者未意识到的表述问题：①建议文案“两版都拒绝只含 README…”把 0.5.1 的祖先拒绝与 0.6.0 的内容拒绝并列，可能让读者以为 0.5.1 也检查了缺文件；正文已说明，建议在替换文案里点明 0.5.1 只是非祖先即拒。②新“依据”行未保留原“依据与核读范围”里的 HN／V2EX／linux.do 核读记录与 X／Reddit 缺口；若直接整段替换会丢现有来源记录，应显式保留原段其余部分。③“说明回读不是只存在于报告里”说得略强：本地能核内容、blob 和祖先，远端 ref 的观测事件本身仍来自记录，未在本轮重新观测。
