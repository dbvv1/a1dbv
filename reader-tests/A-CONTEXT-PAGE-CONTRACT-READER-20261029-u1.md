# A-CONTEXT-PAGE-CONTRACT-READER-20261029 · 读者记录 u1

- 身份：首次读 `docs/decisions/context-management.md@dot-a/context-concise-reader-20261029` 的本会话；此前未参与该页写作、未读该页旧诊断，未读其它读者对同页的记录。
- 页面全文：任务副本已含“页面全文（接收端附上）”，正文与 `git show d0b9651b:docs/decisions/context-management.md` 去掉一个分隔空行后逐字节相同（82 行、9971 字节、sha256 `700df4b6…599`）。
- 做到哪一步：仓库侧验收已做完。提交阶段（格式由文档规定、检查器只查 80 行／链接／语法）、page 默认与固定 ref、缺失目标边界、合成最小卡及负例探针、相关测试与命令退出结果，均已写进结果文档。
- 产物：`docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result.md`。本记录是读者侧支撑记录。未提交、未推送、未切分支；页面文件未改。
- 任务卡实际受检 commit：`5847ea532dbf7437ca8c4865af031ce0d862a153`；page ref 解析到 `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8`。

## 卡点：页面哪一句、缺什么、做错什么

1. **页面第 44–51 行（“下面这项本仓任务可直接照做”及其 #锚点示例）**
   - 缺什么：页面只给了一个“核对检查器是否检查 #锚点”的示例任务，没有本任务要做的 reader-test `page` 输入合同、任务卡字段、80 行限制或接收端职责。照页面本身无法知道一份合法任务卡长什么样。
   - 做错什么：第一反应是把页内这个示例当成“真实任务”去做；读到任务卡正文才发现真实任务是 page 合同验收。没有真的执行错方向，但这是明确的误读风险。
   - 补法：按任务卡指示读 `docs/collaboration/local-jobs/README.md` 第 5、13 行和 `scripts/check_repo.py`。

2. **页面第 53 行（“`check()` 与 `test_existing_and_external_links` 表明：检查本地文件存在，跳过 `#锚点` 与外链”）**
   - 缺什么：只说明检查器会做什么，没说它**不**做什么——尤其不解析任务头、不校验 `page`、不校验 `kind`。若照这句推断“检查器已验证任务卡”，会得出错误结论。
   - 做错什么：没有直接出错；靠读 `scripts/check_repo.py` 的 `record_limits` 与 `check()` 才确认边界，并用合成输入实测。

3. **页面第 44 行（“沿实现与检查补足信息”）**
   - 缺什么：没有给“确认接收端实际附入的是固定版本”的方法。页面默认信息都在仓内可查，但接收端是否解析 ref、是否记录页面提交，页面没有入口。
   - 做错什么：无；自己补了 `git show <commit>:<path>` 与 sha256 比对。但这是页面没写的做法，需由非读者复核可信度。

4. **页面第 40 行（“缺信息先重读必要原文，环境和权限缺口先解决”）**
   - 缺什么：没有说明“保证存在于仓库之外（接收端）时怎么办”。本任务的关键保证正是这一类，页面把它当成可读原文处理。
   - 做错什么：无；按“无法观察记未知”处理，没有把模型自报当成接收端通过。

5. **页面第 99–115 行（检查点格式）**
   - 缺什么：模板面向任务续接，不含“文档规定／检查器实际／本次真实证据”三分的写法，也不含 page ref 这类输入合同字段。
   - 做错什么：无；借用其六项结构，另加了三类证据区分。

6. **页面第 55 行的两个延伸链接（`instruction-files.md`、`long-tasks.md`）**
   - 缺什么：与本次 page 合同验收无直接关系。
   - 做错什么：没有点开；按任务“不另找教程／旧答案”的约束跳过。这属于页面之外本可去、但没去的地方。

## 做错过的具体操作

- 第一次跑 `python3 scripts/check_repo.py` 时把输出重定向到 MSYS 的 `/tmp`，Python 侧读不到同一路径，报 `FileNotFoundError`；改到本任务独占的仓外临时目录后重跑，得出 559 文件、0 错误、退出 0。结果文档只记了成功的命令与结果。
- 为找格式参照，读过旧卡 `A-CI-EXACT-SHA-READER-20261028` 的前 20 行；另外用 `grep` 扫仓库时看到过 `A-TESTMON-PATCH-READER-20261028` 的 result 与 reader 记录片段。都不是同页答案，也未用于本任务结论，但属于“看了页面之外材料”，在此披露。
- 没有修改页面、检查器、任务协议或接收端；没有创建或发布 `ready` 任务；没有提交或推送。

## 页面之外还翻了什么

- 工作材料（任务卡明确要求）：`docs/collaboration/local-jobs/README.md`、`scripts/check_repo.py`、`tests/test_check_repo.py`。
- 相关实现与规则：`docs/collaboration/operations.md` §3（reader-test Workflow）、`docs/collaboration/TASKS.md`（P81 行提到的 80 行历史阻塞）、`scripts/check_execution_snapshot.py`（`target_repo` URL 规范）、`experiments/absorption/runs/20261022-smoke-v1/run_batch.py` 与 `task.json`（`page_revision`＋`blob`＋`sha256` 的页面固定先例）。
- git 历史与 ref：`5561e38e`（page 协议提交及其 diff）、`d0b9651b`（page 固定版本）、`692bf2b2`（四张读者卡）、`8be3ebc0`、`e979a9c7`（领取提交，仅改 `status`）；`origin/main` 与四个 `dot-a/*` 页面分支、页面文件存在性检查。
- 其它：`git diff/rev-parse/cat-file/hash` 若干只读命令。

## 核对

**结论：结果基本成立，可按验收接收；有一处主结果与支撑记录矛盾，需修正后才算完全通过。**

**复跑证据（2026-10-30）**
- `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v`：9 项通过，退出 0。
- `python3 scripts/check_repo.py`：`checked_files=561`、`errors=0`、退出 0（含本记录与 `result.md` 两个新增 Markdown）。
- 仓外临时根复现合成探针，结果与 `result.md` 表一致：20 行最小卡 0 错误；`page` 指向不存在目标 0；删 `page` 0；只留 `id`、`status` 0；100 行 `running` 1 条 `max 80`；100 行 `accepted` 0；内联坏链接 1 条；同样 100 行放 `local-jobs/artifacts/<id>/` 子目录 0（`record_limits` 只限直属 `local-jobs/` 的文件）。
- 附入全文：任务副本页面节与 `git show d0b9651b:docs/decisions/context-management.md` 逐字节相同（9971 字节、82 行、sha256 `700df4b6…4599`、blob `8a9cbae4…c9ce`）。
- 四个 `page` ref 均解析且页面文件存在；`origin/main` 页面 blob 为 `ecb9e233…`，与固定版 113 增 46 删；`e979a9c7` 只改 `status`；`run_batch.py` 的 `blob`／`sha256` 冻结与 `check_execution_snapshot.py` 的 `target_repo` 规范化与记录一致。

**卡点判定（页面／读者）**
1. 页面示例任务（记录写第 44–51 行，实为任务副本行号；页面第 7–14 行）：**model**。页面是上下文管理决策页，不是 reader-test 协议；任务卡标题与 README 第 5、13 行已给真实任务和字段，读者按页面方法转去源码，方向正确。
2. “`check()` 与 `test_existing_and_external_links`…”（记录写第 53 行；页面第 16 行）：**model**。该句只限定链接存在性，准确且未称校验任务头或 `page`；任务卡也明确要求从 `scripts/check_repo.py`、tests 入手。
3. “沿实现与检查补足信息”（记录写第 44 行；页面第 7 行）：**page**。页面方法只覆盖仓内可读原文，没有“附入内容是否等于固定 ref”的核对步骤；读者自补的 `git show`＋sha256 正确（已复核），但这是页面方法对本任务的一处真实缺口。
4. “缺信息先重读必要原文，环境和权限缺口先解决”（记录写第 40 行；页面第 3 行）：**model**。页面检查点第 5 项已有“在途任务／外部操作……未知结果先标待查询”，任务卡也写“无法观察的接收端行为记未知”；读者称页面完全没说明属漏读，处理本身正确。
5. 检查点模板（记录写第 99–115 行；页面第 62–76 行）：**model**。模板面向续接，确实不含“文档规定／检查器实际／本次真实证据”三分与 `page` ref 字段；但第 4 项已要求“失败、未运行分别列明”，读者没把它用到自己的失败尝试上（见下）。

**未意识到的错误**
- 行号引用错位：记录写“页面第 44–51／53／40／99–115 行”，实际是任务副本（job.md）的绝对行号；页面只有 82 行，第 99–115 行不存在，实际对应页面第 7–14、16、3、62–76 行。同一记录又写“82 行”，前后矛盾。
- `result.md` 第 92 行称“本次没有命令失败”，但支撑记录披露首次 `check_repo.py` 因 MSYS 临时路径报 `FileNotFoundError`；任务验收要求“失败、未运行、未知分开”，页面检查点第 4 项也要求“失败、未运行分别列明”。主结果应记录该失败／重试，或改为“最终运行未失败”。
- 记录称页面没有说明外部保证怎么办，但页面检查点第 5 项已写“在途任务／外部操作的 ID 和状态；未知结果先标待查询”，任务卡也写“无法观察的接收端行为记未知”；该项属漏读，非页面缺失。
- 工作树 `HEAD`（`base_ref 5847ea53`）的 `docs/decisions/context-management.md` 是 main 版（blob `ecb9e233…`、149 行），不是附入的 `d0b9651b` 版（blob `8a9cbae4…`、82 行）。记录核了 `origin/main` 与固定版差异，却没提醒“直接打开工作树页面文件会读到另一版”。
- 卡点写在 reader-tests 支撑记录而非 `result.md`；任务写域要求 `result.md` 记录卡点。内容可用，位置与写域不完全一致。
- `result.md` 第 6 行说 `check_repo.py`“实际只查三件事”，漏了 `TASKS.md` 超过 10 KB 的检查；对 local-jobs 卡结论不变，但作为“实际检查什么”的概述不完整。
- `result.md` 第 80 行“新 page 协议没有等价的提交号／内容哈希记录”措辞不精确：协议允许 `page@<40 位提交>`，缺的是接收端落盘的 blob／sha256 记录；读者前文已写对，但该句容易被读成协议不能写提交号。

**接收端未知**：读者身份（首次读本页、未参与写作／旧诊断）为自报，仓库证据无法独立核实；接收端是否解析 ref、是否落盘页面提交、缺省 main 与缺失目标的行为均不可观察，只能确认本次附入文本与固定 commit 一致，不把模型自报当接收端通过。
