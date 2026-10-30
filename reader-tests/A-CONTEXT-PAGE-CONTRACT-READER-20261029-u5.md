# A-CONTEXT-PAGE-CONTRACT-READER-20261029 · u5 读者测试记录

- 身份：独立新上下文读者；此前未读 `docs/decisions/context-management.md`，未参与该页写作或旧诊断。
- 任务卡：只照接收端附入的页面全文，完成 job 卡里的「新 page 输入合同真实仓库验收」。
- 页面 ref：`docs/decisions/context-management.md@dot-a/context-concise-reader-20261029`，尖端 `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8`。
- 独立性说明（先记）：开工时工作目录已有未跟踪的 `docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result-u5.md`，以及已提交的 `result.md`、`result-u4.md` 和 `reader-tests/...-u4.md`。我打开过遗留 `result-u5.md` 全文、`result.md` 前 30 行和 `u4` 记录前 20 行，超出「只照页面、不找旧读者答案」的要求，记在下方「做错的事」。本记录的事实全部用我自己的命令复跑核对过；遗留 `result-u5.md` 有两处事实错误，已改写纠正。

## 做到哪一步

仓库侧可观察的部分基本做完：

1. **核附入全文**：任务卡「页面全文（接收端附上）」段 82 行、9971 字节、sha256 `700df4b6…`，与 `origin/dot-a/context-concise-reader-20261029`（`d0b9651b…`）的 `docs/decisions/context-management.md` 逐字节一致（`diff` 为空）。同时发现 `origin/main` 上的同名页是 149 行、18373 字节、sha256 `35cff5a0…`，与附入文本不同——说明附入的是固定 ref 版本，不是默认 main 版本。附入动作本身看不到。
2. **定位协议实现**：`docs/collaboration/local-jobs/README.md` 第 5、13 行两处文档，来源提交 `5561e38e…`（只改这两行）；`scripts/check_repo.py` 与 `tests/test_check_repo.py` 都没有 `page` 代码或用例。
3. **复跑页面给的命令**：`python3 -m unittest discover -s tests -p 'test_check_repo.py' -v` → 9 项通过（exit 0）；`python3 scripts/check_repo.py` → 567 文件、0 错误（exit 0）；`python3 scripts/check_public.py` → 993 文件、0 发现（exit 0）。
4. **用仓外合成输入验证边界**：26 行最小合法卡 `errors: []`；`page` 指向不存在页面、删掉 `page`、只留两个头字段，检查器一律 0 错误；80 行活动卡通过、81 行报超限、`accepted` 豁免；链接探针确认 fragment 被丢弃但路径仍检查，纯 `#锚点` 与外链跳过。
5. **核默认／固定／缺失 ref**：默认 main（fetch 后）有该页但版本不同；固定 ref 需 `origin/` 前缀；缺失目标没有规定，检查器不拦。
6. **写了验收结果与检查点**：`result-u5.md` 含受检版本、实现位置、命令与退出、最小卡、边界、文档／检查器／真实证据对照、页面卡点和六项检查点。

产物：

- 验收结果：`docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result-u5.md`
- 本记录：`reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u5.md`

## 卡点

1. **页面「下面这项本仓任务可直接照做；换项目时换目标与入口。」+ 示例任务「核对本仓文档检查器是否检查 Markdown 链接里的 `#锚点`」。**
   - 缺什么：这句让第一次读的人以为示例就是全部任务，但卡片任务是对 `page` 输入合同做仓库侧验收；页面没有写页面与卡片的对应关系，也没有 `page` 字段、默认 ref、固定 ref、缺失目标、最小卡、接收端附入全文这些验收对象的任何内容。
   - 做错什么：我一开始照示例先跑锚点探针，后来才按卡片转到 page 合同，白走了一小段。
2. **页面「`check()` 与 `test_existing_and_external_links` 表明：检查本地文件存在，跳过 `#锚点` 与外链。」**
   - 缺什么：这句容易读成「带 `#` 的链接整条跳过」。实际实现是 `urlsplit` 丢掉 fragment、仍检查 fragment 前的路径：文件存在时带缺失锚点不报错；文件不存在时 `b.md#missing-anchor` 仍报 `missing link target`；只有纯 `#本地锚点` 才整条跳过。页面没给这个边界。
   - 做错什么：工作目录里遗留的上一版 `result-u5.md` 按字面把它记成「`b.md#missing-anchor` 不报错」，我实跑复现后发现不对，已改正。
3. **页面全文没有 page 输入合同与接收端行为。**
   - 缺什么：任务卡的六条验收里，「合法任务怎么写」「默认 ref」「固定 ref」「缺失目标」「接收端是否附全文」都不在页面里，只能靠任务卡点名的 README、检查器和测试补。页面提供的是方法（给入口、按需找原文、检查点），不是这些具体规则。
   - 做错什么：一开始把本地 `main` 当成默认 main，差点沿用「默认目标缺失」的旧结论；改用接收端实际会 fetch 的 `origin/main` 后，发现默认 ref 是「有页但版本不同」。
4. **页面「已验证 9 项通过」与六项检查点模板（第 108–116 行）。** 这两处可用，不是卡点：9 项通过复跑一致；检查点模板直接套用。记在这里供核对哪些页面内容实际起了作用。

## 页面之外去翻了什么

- `docs/collaboration/local-jobs/README.md`（任务卡点名的入口；第 5、7、13 行）
- `scripts/check_repo.py`、`tests/test_check_repo.py`（任务卡点名的源码与测试）
- `docs/collaboration/operations.md` §3（README 指向的运行规则，确认 reader-test 的验收分工）
- `scripts/` 目录清单与 `validate_task.py`、`validate_relay.py`、`check_public.py`、`check_execution_snapshot.py` 的文件头／grep（确认没有别的检查器解析 local-jobs 卡的 `page`）
- git 历史与 ref：`5561e38e` 的 diff、`origin/main`、`origin/dot-a/context-concise-reader-20261029`、`5847ea53`、本地 `main`
- 遗留产物：未跟踪的 `result-u5.md` 全文、`result.md` 前 30 行、`reader-tests/...-u4.md` 前 20 行（超出独立性要求，见上）

未翻：页面链接指向的外部来源（OpenAI／Cursor／Anthropic 等）、其他 `docs/` 页面正文、`AGENTS.md`、`LONG-TERM-PLAN.md`、`TASKS.md`、其他 reader-test 记录正文。

## 约束执行

未修改页面、检查器、任务协议、长期规则、接收端和用户设置；未创建或发布 `ready` 任务；未提交、未推送、未切换分支；合成输入只放本任务独占的仓外目录；产物只含可公开材料，没有本机绝对路径或内网地址。

## 核对（非读者验证者，2026-10-30）

本节由未参与照做、只做核对的新上下文写成；未改页面、检查器、任务卡或读者已写的上文。

### 复跑证据

- **附入全文**：从 job.md 的「## 页面全文（…）」标记行后取正文（去掉与标题之间的一个空行），82 行、9971 字节、sha256 `700df4b6…4599`，与 `git cat-file -p d0b9651b:docs/decisions/context-management.md` 逐字节相同。`origin/main` 与 base `5847ea53` 的同名页是 149 行、18373 字节、sha256 `35cff5a0…`、blob `ecb9e233…`。工作树检出的 `docs/decisions/context-management.md` 也是这版 149 行，不是附入的 82 行版。
- `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v`：`Ran 9 tests … OK`、exit 0。
- `python3 scripts/check_repo.py`：`checked_files=567`、`errors=[]`、exit 0（含本单元两个未跟踪新文件）。
- `python3 scripts/check_public.py`：`checked_files=993`、`findings=[]`、exit 0。
- **合成探针**（仓外临时根，输入明确标为合成）：26 行最小卡在临时根与 `docs/collaboration/local-jobs/` 下均 `errors=[]`；`page` 指向不存在页面、删 `page`、只留两个头字段均 0 错误；80 行 `running` 0、81 行 `running` 1 条 `active job file has 81 lines (max 80)`、81 行 `accepted` 0；`b.md#missing-anchor` 在 `b.md` 不存在时报 `missing link target`，在 `b.md` 存在时不报；纯 `#local-anchor` 与外链跳过。
- **git**：`origin/main:docs/decisions/context-management.md` 为 blob；本地 `main` 无该路径（exit 128），落后 `origin/main` 651 个提交；字面 `dot-a/context-concise-reader-20261029` 不存在（exit 128），`origin/dot-a/…` → `d0b9651b`；`5847ea53` 是 HEAD 与 `origin/main` 的祖先。
- **实现位置核对**：`check_repo.py` 的 `record_limits` 28–36、`check` 39–93、链接循环 80–89、limits 91–93；`tests/test_check_repo.py` 22–23、63–71；README 第 5、7、13 行；`5561e38e` 只改 README 第 5、13 行（2 增 2 删）；`validate_task.py`／`validate_relay.py`／`check_public.py`／`check_execution_snapshot.py` 均不解析 `page`。以上与读者记录一致。
- 产物无本机绝对路径或内网地址；工作树只有本单元两个未跟踪文件。

### 卡点判定

1. **页面「下面这项本仓任务可直接照做；换项目时换目标与入口。」+ 示例任务（#锚点）：cause=model。** 任务卡「目标与做法」已写明本单元是 page 输入合同验收，并点名 README、`check_repo.py`、`tests/test_check_repo.py` 为工作材料；页面第 7 行本身也写「换项目时换目标与入口」。先把示例任务当全部任务是读者没先对齐卡片目标，方向很快纠正，不算页面缺口。页面若补一句「示例只示范方法」会更清楚，但不影响可做性。
2. **页面第 16 行「检查本地文件存在，跳过 `#锚点` 与外链」：cause=page（小）。** 这句把两种行为压成一句，没写「fragment 前的路径仍检查；文件不存在时带 fragment 仍报 missing」这一边界；读者遗留草稿正是按字面读错、复跑后才改正。正确行为可从源码和该句前半句推出，读者最终也写对了，属可补精确度的页面小缺口，不是硬错误。
3. **页面全文没有 page 输入合同与接收端行为：cause=model。** 这是上下文管理方法页，不是 reader-test 合同规格；任务卡明确说「只照所附页面的方法完成本任务」，并把 README、源码、测试列为工作材料。读者把页面当合同规格来期待，是归因偏差。
4. **页面「已验证 9 项通过」与检查点模板（读者写「第 108–116 行」）：cause=model（非卡点）。** 9 项复跑一致、模板可用；但读者记的行号是 job.md 的绝对行号，不是页面行号（见下）。

### 未意识到的错误

- **把 `@dot-a/context-concise-reader-20261029` 当成「固定 ref」，没写分支可变。** 卡片写的是分支，`d0b9651b` 只是当前尖端；只有写 40 位提交才不可变。任务验收明确要求核对「固定 ref」边界，读者全文没有这句，结论「附入的是固定 ref 的版本」容易被读成版本已被钉住。u2 核对已就同一句提过，本单元重复。
- **行号引用错位。** 「页面第 60 行给「检查器」与「测试」两个入口」「第 108–116 行六项检查点模板」都是 job.md 的绝对行号：页面只有 82 行；检查器／测试链接在页面第 18 行，检查点模板在 66–74 行；页面第 60 行是 CLI 依据。记录同时写「附入全文 82 行」，前后不一致，按页面无法复现这些引用。
- **`check_repo.py`「只查三类」漏掉 `docs/collaboration/TASKS.md` ≤10 KB。** `record_limits` 28–36 行除 local-jobs 活动卡行数外，还检查 `TASKS.md` 超过 `TASKS_MAX_BYTES`（10×1024）；u1、u3 核对都提过同一处，本单元仍写成「只处理直接位于 local-jobs 的活动卡行数」。对 page 结论无影响，但「检查器实际查什么」的概述不完整。
- **「本 worktree 的本地 main … 没有 docs/decisions/」把本地 `main` 分支与工作树检出混在一起。** 本地 `main`（`6d517cc4`）确实没有该目录，但当前 worktree 检出的 `docs/decisions/context-management.md` 是 149 行 main 版（blob `ecb9e233…`），不是附入的 82 行版；读者只比较了 `origin/main`，没提醒「直接打开工作树文件会核错对象」。u4 结果里有这条提醒。
- **最小卡「26 行，`record_limits` 无报错」的验证范围说宽了。** 若卡放在临时根而非 `docs/collaboration/local-jobs/` 下，`record_limits` 的 `relative.parent == JOB_DIR` 不成立，行数／状态根本不会检查；80／81 行边界是另做的探针，不能用来支撑这张 26 行卡的「行数／状态已查」。属表述精度问题，不改结论。

### 独立性

读者自报开工时读过遗留 `result-u5.md` 全文、`result.md` 前 30 行、u4 记录前 20 行，违反任务卡「不另找旧读者答案」。本核对能确认记录里的事实都由可复跑命令支撑（上面已复跑），但这一单元的「新读者能否只靠页面做成」信号已被污染：它先看到了旧答案和旧草稿。若流程需要干净的 reader-test 结论，应换未读旧产物的读者重跑；本单元只能作为「结果正确、独立性不合格」的验收证据。

### 总评

仓库侧验收的核心都做了且可复跑：附入全文与 `d0b9651b` 逐字节一致、协议位置与检查器边界、最小卡实跑未入队、9 项测试与 `check_repo`／`check_public` 复跑、检查点与卡点。未发现虚报；上面是固定 ref 可变性、行号引用、TASKS.md 检查和几处表述精度问题。taskDone=true（结果可接收）；独立性不合格，需在后续单元注意。

**接收端未知**：ref→commit 的解析、是否落盘页面提交、缺省 main 与缺失目标的处理均不可观察；只确认本次附入文本与 `d0b9651b` 对象一致，不把模型自报当接收端通过。
