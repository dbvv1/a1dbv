# A-CONTEXT-PAGE-CONTRACT-READER-20261029 读者测试 u2

## 做到哪一步，产物在哪

按页面第 7、13、16 行的做法，从任务卡指定的 `docs/collaboration/local-jobs/README.md`、`scripts/check_repo.py`、`tests/test_check_repo.py` 入手，完成仓库侧验收中可静态核的部分；接收端内部流程未运行。产物是本记录。合成探针只放任务独占的仓外临时目录，未写入 `docs/collaboration/local-jobs/`、未入队、未提交；工作树里已有的 `artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result.md` 属上一轮产物，本单元未覆盖。

### 受检版本

- 工作树／受检 commit：`0b5d66de`（`receiver/A-CONTEXT-PAGE-CONTRACT-READER-20261029`），base_ref `5847ea53`。
- 协议提交 `5561e38e` 是 `origin/main`（`cc70ecfd`）与 HEAD 的祖先。
- 受检文件 `docs/collaboration/local-jobs/README.md`、`scripts/check_repo.py`、`tests/test_check_repo.py` 在 base、HEAD、`origin/main` 三处的 blob 相同。
- page ref 解析：`dot-a/context-concise-reader-20261029` → commit `d0b9651b`，文件 blob `8a9cbae4`，内容 sha256 `700df4b6…`。`origin/main` 的同名页面是另一个 blob（`ecb9e233…`，149 行）：缺省 main 与固定分支会附到不同内容。

### 接收端附入全文的核验

任务卡运行副本的前 39 行与 `origin/main` 的任务文件逐行相同（`status: running`、`page:` 行俱在），其后是空行、`## 页面全文（…，接收端附上）` 和 82 行正文；而 `dot-a/four-reader-jobs-20261029` 上提交的任务文件只有 34 行、不含全文。因此 82 行正文能归因到接收端产物，不是作者贴进任务文件。

附入文本与 `git show origin/dot-a/context-concise-reader-20261029:docs/decisions/context-management.md` 的字节 sha256 相同。仍未观察到：接收端领取时把分支名解析到哪个 commit、是否落过记录。运行副本只写分支名，不写解析后的提交；任务卡“当前结果”里事先写下的 `d0b9651b` 与当前分支尖端相同，但这不是领取时刻的接收端记录。

### 文档规定的合法任务

README 第 5 行：任务头用 `id`、`owner`、`status`、`target_repo`、`base_ref`、`result_branch`，可选 `accept`、`kind`、`page`（`<本仓路径>[@<分支或提交>]`，缺省 main；接收端把该页全文附给执行模型）；正文只写目标、按哪个 Skill／规格做、写入范围、怎样算做成；未结束的任务文件不超过 80 行；“当前结果”只写产物链接、还差什么和下一步。第 13 行：reader-test 用 `page` 指定页面、不把全文贴进任务，读者只在结果分支记卡点、不改页面，不用 `accept: auto`。

### 检查器实际检查什么

`check_repo.py` 只覆盖下列内容，**不解析** `page` 字段、任务头字段，也不检查分支／提交是否存在。探针均为合成输入，放在仓外临时目录：

| 合成探针 | `python3 scripts/check_repo.py --root <probe>` |
|---|---|
| 22 行、字段齐全、`page:` 指向真实 main 页面的 reader-test 卡 | exit 0，1 文件，0 错误 |
| 同一张卡，`page:` 指向不存在的路径／分支 | exit 0，0 错误（不看 `page`） |
| 同一张卡，`page:` 不带 `@`（缺省 ref） | exit 0，0 错误（缺省 main 属接收端行为） |
| 80 行、`status: running` | exit 0 |
| 81 行、`status: running` | exit 1，`active job file has 81 lines (max 80)` |
| 81 行、`status: accepted` | exit 0（终态豁免） |
| 90 行卡放在 `local-jobs/sub/` 子目录 | exit 0（只查直属文件） |
| 只有一行文本、没有任务头 | exit 0（不校验字段） |
| 内联链接指向缺失文件 | exit 1，`missing link target` |
| `docs/collaboration/TASKS.md` 11000 字节 | exit 1，`over 10 KB` |
| `TASKS.md` 9000 字节 | exit 0 |

实现位置：`scripts/check_repo.py:17-21`（`TASKS_FILE`、`JOB_DIR`、80 行、终态集合），`28-36`（`record_limits`），`39-93`（`check`），`78-80`（只查内联链接、不查片段的正则与注释）。用例：`tests/test_check_repo.py:22-23`（跳过 `#锚点` 与外链），`63-71`（80 行、终态豁免、README 豁免、TASKS 10KB）。

仍须接收端验证：`page` 路径在该 ref 存在、ref 能解析成 commit、附入文本等于该 commit、缺省 main 的实际附页、领取时先写 `running`、结果分支产物与 `review_ready` 回写、任务是否真的入队。这些静态检查器都不覆盖。

### 实际命令与退出

- `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v` → exit 0，9 项 OK。
- `python3 scripts/check_repo.py` → exit 0，`checked_files=561`，`errors=[]`（写本记录前；写入后复跑为 562 文件、仍 0 错误）。
- 上表探针：通过／报错均按预期复现；报错是检查器对违规输入的预期行为，不是仓库检查失败。
- 未运行：接收端领取、分支解析、附页、写回 `running`／`review_ready` 的内部流程。没有自然跨压缩或新会话，原生接续未验。
- 过程失误：一次把检查器输出写到仓外临时目录后交给 Windows Python 打开，两边路径映射不同导致 `FileNotFoundError`；改为 shell 重定向加 stdin 读取后重跑。另一次用 shell 循环生成 80／81 行探针，命令替换吃掉末尾换行，行数少 1；改用 Python 写文件后才得到准确边界。两者都不是仓库命令失败。

### 最小 reader-test 卡示例（合成，保持未入队）

```text
id: SYNTH-READER-001
owner: dot-A
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5847ea532dbf7437ca8c4865af031ce0d862a153
result_branch: relay/synth-reader-001
kind: reader-test
page: docs/decisions/context-management.md@main

# Synthetic reader-test card (not queued)

## Goal
Return whether the checker inspects the page field.

## Spec
Follow the attached page.

## Write scope
Only result.md on the result branch.

## Done
Record support scope, source location, command and exit result.
```

只放在仓外临时目录，`check_repo.py --root` 的结果是 exit 0／1 文件／0 错误。验证范围仅限：22 行未超 80 行、无内联链接、JSON/TOML 不涉及；`page` 目标、字段语义、是否入队均不在检查器范围。

### 检查点

- 目标：验收 `page` 输入合同，只读检查器与任务协议。
- 已验：协议字段与 reader-test 规则；检查器覆盖与边界；附入文本与 `d0b9651b` 一致；9 项单测与 561 文件检查；上表合成探针。
- 未知：领取时解析的提交与附页动作、缺省 `main` 的实际附页、分支在领取后移动的处理。这些都不是静态检查器能证明的。
- 下一步：若继续，按任务卡“下一步”修 `result.md` 的行号与措辞，并复跑上面两条命令；不要用检查器通过宣称附页成功或任务已启动。

## 卡点

1. **页面第 7 行“沿实现与检查补足信息”**：没有核对“接收端附入全文是否等于 page 固定 ref”的步骤、命令或判据。缺的是 ref→commit 的解析记录和附入文本的摘要对照；我自定为抽页面段 + `git show` + sha256。做错：先拿工作树里的 main 版（149 行）对照，发现与附入的 82 行不一致，才改从 page 分支取对象；页面没有提醒“附入页可能不是工作树当前版本”。
2. **页面第 9-14 行的具体任务**：页面唯一写出的任务是“核对检查器是否检查 `#锚点`”，本卡任务却是 page 输入合同验收；页面没有说“只照方法、不照示例任务”。我一度按字面准备 anchor 任务，后按任务卡写域与“完成本任务”改判。缺的是示例与方法的分离说明。
3. **页面第 16 行“从仓库根目录运行 … 9 项通过”**：命令可用且已复跑，但页面只证明检查器行为，没有说检查器不解析任务头／`page`／分支，也不覆盖接收端附页。缺的是“检查通过 ≠ 合同成立”的具体边界；我读源码并加探针才补上。
4. **页面第 66-74 行检查点模板**：没有“页面 ref 解析到的提交／附入文本摘要”字段；跨会话恢复时无法直接核“附的是不是同一版”。缺的是输入合同在检查点里的落点。
5. **页面第 3 行“缺信息先重读必要原文”与第 76 行“核实际内容”**：方向对，但没有给出“附入文本 vs 仓库对象”的对照入口；我用 git 对象和 sha256 自补。

## 页面之外翻的材料

- 任务卡指定的工作材料：`docs/collaboration/local-jobs/README.md`、`scripts/check_repo.py`、`tests/test_check_repo.py`。
- Git 对象与引用：`origin/main` 的任务文件与页面、`origin/dot-a/four-reader-jobs-20261029` 的任务文件、`origin/dot-a/context-concise-reader-20261029` 的页面、`5561e38e` 的 diff、相关 blob 与 sha。
- 未读：页面外的上下文管理教程、旧读者答案（本目录 `-u1` 记录）、`artifacts/.../result.md`、其他 a1dbv 文档、凭据与私人会话。
- 任务卡“当前结果”已带上一轮结论（含页面第 7 行卡点、561 文件等）；未拿它代替验证，但本单元不是完全盲测。

## 核对

核对角色：未参与本次照做；核对日期 2026-10-30。未改页面、检查器、任务文件，只在本记录末尾追加。

**结论：记录里的分析内容基本成立，复跑数字与读者一致；但本单元没有产出任务写域指定的 `artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result.md`，结果分支上的该文件仍是上一单元版本（任务卡“当前结果”已列其未关闭问题），本记录本身也未跟踪。按任务写域和“下一步”判未完成（taskDone=false）；若只按验收条目 1–5 的内容看，读者给出的证据可用。**

### 独立复跑证据

- 提交：HEAD `0b5d66de`，base_ref `5847ea53`；`5561e38e` 是 HEAD 与 `origin/main`（`cc70ecfd`）的祖先。
- 三份受检文件在 base／HEAD／origin/main 的 blob 相同：README `982e9a41…`、`scripts/check_repo.py` `fa5c66a8…`、`tests/test_check_repo.py` `c044e8c8…`。
- page ref：`origin/dot-a/context-concise-reader-20261029` → `d0b9651b`；页面 blob `8a9cbae4…`，82 行，sha256 `700df4b6…4599`。`origin/main` 页面 blob `ecb9e233…`，149 行；工作树页面文件也是这一版。
- 附入全文：运行副本 `job.md` 第 1–39 行与 `origin/main` 任务文件逐行相同；第 43–124 行（82 行）与 `git show origin/dot-a/context-concise-reader-20261029:docs/decisions/context-management.md` 逐字节相同（sha256 `700df4b6…4599`）。`dot-a/four-reader-jobs-20261029` 的任务文件 34 行、无页面正文。读者“附入正文等于 page 分支对象”的结论成立。
- 命令：`python3 -m unittest discover -s tests -p 'test_check_repo.py' -v` → 9 项 OK、exit 0；`python3 scripts/check_repo.py` → `checked_files=562`、`errors=[]`、exit 0（含本记录；去掉本记录即读者写的 561）。
- 合成探针 11 行按读者表全部复现：22 行卡 0 错误；page 不存在 0；无 `@` 0；80 行 0；81 行 running 1 条 `max 80`；81 行 accepted 0；90 行放 `sub/` 0；无任务头 0；缺失内联链接 1 条；`TASKS.md` 11000 字节 1 条 `over 10 KB`；9000 字节 0。示例卡 22 行，`check_repo.py --root` exit 0。
- 实现位置与用例行号核对一致：`check_repo.py:17-21/28-36/39-93/78-80`，`tests/test_check_repo.py:22-23/63-71`；README 第 5、13 行的协议摘要准确。
- 限制：读者当时的探针原始文件未保留（scratch 为空），以上是按记录重建的等价输入，不是读者原件；读者自述的两次过程失误（FileNotFoundError、shell 换行）无法独立复核。

### 卡点判定

1. 页面第 7 行“说清目标、保留行为和起点，沿实现与检查补足信息”：**page**。页面方法没有给“附入全文是否等于 page 固定 ref”的解析／摘要对照步骤，读者自补 `git show`＋sha256 正确。补充：读者先拿工作树 149 行 main 版对照、再换到 page 分支对象，这一步属 model 自误（任务卡 `page:` 已写明分支），但读者已披露并纠正。
2. 页面第 9–14 行示例任务：**model**。任务卡写“只照所附页面的方法完成本任务”，页面也写“换项目时换目标与入口”；示例与方法的分离已在任务卡里给出。
3. 页面第 16 行“9 项通过”：**model**。该句只限定检查器行为，没有声称校验任务头或 `page`；任务卡要求区分文档规定、检查器实际和本次证据，读者读源码加探针后补上，方向正确。
4. 页面第 66–74 行检查点模板：**model**。模板第 1、3、4 项已含“最新约束／禁改范围”“可重读的文件／符号／结果入口”“已运行命令、结果与适用版本”，可容纳 page ref 与摘要；缺的是读者没用上（见下）。
5. 页面第 3 行“缺信息先重读必要原文”与第 76 行“核实际内容”：**model**。任务卡已要求“先确认接收端实际附入…全文”；“核实际内容”实际在页面第 78 行，讲的是压缩后引用文件，不是本合同的对照入口；读者自补 git＋sha256 正确。

### 未意识到的错误

- 记录称“任务卡‘当前结果’里事先写下的 `d0b9651b`”，但实际派发的运行副本（= `origin/main` 的 39 行版）的“当前结果”没有这个值；它只出现在 `dot-a/four-reader-jobs-20261029` 的 34 行排队版。该句与读者自己“前 39 行与 main 相同”的结论矛盾。
- 卡点 5 写“页面第 76 行‘核实际内容’”，实际在第 78 行；第 76 行是“恢复时要求实际读取检查点…”。
- 检查点缺“最新约束／禁改范围”（任务验收第 5 条、页面模板第 1 项都要求），只写了目标、已验、未知、下一步。
- 记录把 `@dot-a/...` 称为“固定分支”，没有说明分支 ref 可变、只有 40 位提交才是固定版本；这是任务“核对固定 ref”边界里最关键的一句。
- 读者引 README 第 13 行“读者只在结果分支记卡点”，自己却把卡点放在未跟踪的 `reader-tests/…-u2.md`，未产出结果分支的 `result.md`，两处没有对齐。
- 任务卡“当前结果”已含上一单元的页面第 7 行卡点，读者也承认“不是完全盲测”；因此卡点 1 不是独立发现，作为页面缺口的证据需打折扣。

**接收端未知**：领取时 ref→commit 的解析、是否落盘、缺省 main 的附页、缺失目标的回退、入队与 `review_ready` 回写均不可观察；只确认本次附入文本与 `d0b9651b` 对象一致，不把模型自报当接收端通过。

### 写域与完成度

- 工作树只有未跟踪的 `reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u2.md`；`git diff` 为空，`artifacts/.../result.md` 未被本单元改动。
- 任务写域要求“只在结果分支新增 `…/result.md`，记录结果、必要复现输入、卡点和短检查点”；该文件在 HEAD 已存在（上一单元产物，任务卡“当前结果”已列其待修项），本单元既未更新也未新建。
- 因此按任务自己的写域和“下一步”本单元没有交付指定产物；分析、探针和未知边界可复核、可用，但不能替代 `result.md` 的交付。
