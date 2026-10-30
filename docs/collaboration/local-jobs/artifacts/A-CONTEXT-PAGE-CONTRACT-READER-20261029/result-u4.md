# A-CONTEXT-PAGE-CONTRACT-READER-20261029 · u4 独立验收

本文件是本单元（独立读者 u4）的仓库侧验收结果。任务卡的“写域”只写“新增 `result.md`”；HEAD 上已有前序单元提交的 `result.md`，按任务要求本读者此前未读旧诊断，也不覆盖前序证据，故本单元另记 `result-u4.md`，不改 `result.md`。卡片没有说明“同一 reader-test id 的后续单元如何命名产物”，这是本次遇到的一个卡片缺口。

## 受检版本与 page ref

- 受检 worktree HEAD：`5087a91180b06f6af505261d4eea8bbba88952b0`（receiver 分支，基于任务 `base_ref` `5847ea532dbf7437ca8c4865af031ce0d862a153`）。
- page：`docs/decisions/context-management.md@dot-a/context-concise-reader-20261029`。该 ref 只存在于 `origin/dot-a/context-concise-reader-20261029`，尖端为提交 `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8`（“Consolidate context-management guidance without changing defaults”）。
- 附入全文核验：任务文件“页面全文（接收端附上）”段（正文第 43–125 行）与 `d0b9651b:docs/decisions/context-management.md` 逐字节相同：同为 9971 字节，sha256 同为 `700df4b6d6e9a3fa85610b2f58bf042be663e2f1fa2a9527fb4f9efbe58d4599`，`diff` 为空。
  - 已验：附入文本内容等于该提交版本。
  - 未直接观察：接收端“附入”这个动作本身；只能看到任务文件里的结果，附件与 ref 解析时机在接收端，仓内不可见。

## 协议实现位置与实际命令

- 实现只有文档，没有代码：
  - `docs/collaboration/local-jobs/README.md` 第 5 行：任务头可选字段 `page`（`<本仓路径>[@<分支或提交>]`，缺省 main；接收端把该页全文附给执行模型）。
  - 同文件第 13 行：照做实测任务用 `page` 指定页面，不把全文贴进任务；读者只在结果分支记卡点、不改页面、不用 `accept: auto`。
  - 协议来源提交：`5561e38e47b1a60166192660b15440a58c24e5ed`（“Let reader-test jobs name their page instead of pasting it”），为 HEAD 的祖先。
- 实际命令与退出（本 worktree）：
  - `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v` → `Ran 9 tests ... OK`，exit 0。
  - `python3 scripts/check_repo.py`（默认 root）→ `checked_files: 563`，`errors: []`，exit 0；写入本单元两个新文件后复跑为 565 文件、仍 0 错误、exit 0。
  - `scripts/check_repo.py` 内没有任何 `page` 处理；`tests/test_check_repo.py` 也没有 `page` 用例。

## 现行写法如何提交一个合法任务

按 README 第 5、13 行，合法任务由以下组成：

- 头字段：`id`、`owner`（dot-A／dot-B）、`status`、`target_repo`、`base_ref`、`result_branch`；可选 `accept`、`kind`（build／reader-test／explore）、`page`。
- 正文四件事：目标、按哪个 Skill 或规格做、写入范围、怎样算做成。
- 未结束任务文件 ≤80 行（`check_repo.py` 检查）；“当前结果”只写产物链接、还差什么、下一步。
- reader-test 特有：`kind: reader-test`，用 `page:` 指页而不贴全文；读者只记卡点、不改页面、不用 `accept: auto`。
- 入队：在 main 或 `dot-a/*`／`dot-b/*` 分支上，`status: ready` 或 `revision_requested`；接收端领取后先在 main 写 `running`。

以上是 README 的规定。`check_repo.py` 实际只检查 JSON/TOML 语法、Markdown 内联本地链接目标、`TASKS.md` ≤10KB 与活动任务 ≤80 行；它不检查头字段是否齐全或合法、`owner`／`status`／`kind` 取值，也不检查 `page` 的路径与 ref 是否存在。

## 最小卡片示例与验证

合成示例（`status: draft`，保持未入队；放在仓外任务独占临时目录的 `docs/collaboration/local-jobs/A-EXAMPLE-READER-001.md`）：

```text
id: A-EXAMPLE-READER-001
owner: dot-A
status: draft
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5847ea532dbf7437ca8c4865af031ce0d862a153
result_branch: relay/a-example-reader-001
page: docs/decisions/context-management.md@d0b9651b5db9039975d1abde4efe8f0cfd3a43b8

## 目标
让没读过该页的读者只按页面方法核对检查器对 #锚点的处理。
## 做法
按 kind: reader-test 的 Workflow；从页内入口 scripts/check_repo.py 与 tests/test_check_repo.py 入手。
## 写入范围
只新增 artifacts/A-EXAMPLE-READER-001/result.md；不改页面与检查器。
## 怎样算做成
给出源码位置、实际命令与退出结果，区分失败、未运行与未知；回 review_ready，不用 accept: auto。
```

实际验证：把这张卡放进仓外临时根的同名路径，运行 `python3 scripts/check_repo.py --root <仓外临时根>` → `checked_files: 1`，`errors: []`，exit 0。输入是合成卡片；验证范围仅限 check_repo 的现有规则（行数／链接／JSON／TOML），不证明接收端会接收或附入该页。

## page 的默认 ref、固定 ref 与缺失目标（合成输入）

| 合成输入 | check_repo 结果 | 说明 |
|---|---|---|
| `page: docs/decisions/context-management.md`（无 ref） | 0 错误 | README 缺省 main；检查器不解析 ref |
| `page: ...@dot-a/context-concise-reader-20261029` | 0 错误 | 分支 ref |
| `page: ...@d0b9651b5db9039975d1abde4efe8f0cfd3a43b8` | 0 错误 | commit ref |
| `page: docs/decisions/does-not-exist.md@deadbeefdeadbeefdeadbeefdeadbeefdeadbeef` | 0 错误 | 检查器不校验 page 目标 |
| `status: nonsense` + `kind: not-a-kind` + `page: ../../etc/passwd` | 0 错误 | 检查器不校验头字段 |
| 112 行、`status: draft` | 1 错误（active job file over 80 lines） | 活动任务行数限制 |
| 112 行、`status: accepted` | 0 错误 | 终态豁免 |
| 相对链接指向缺失文件 | 1 错误（missing link target） | 阳性对照：链接确实在查 |

补充观察：本 worktree 的本地 `main` 是旧提交，`main:docs/decisions/context-management.md` 不存在；`origin/main` 与 HEAD 都有该文件（均 18373 字节）。README 的“缺省 main”因此必须理解为接收端每次 fetch 后的 main，而不是本地可能滞后的 main 分支。以上测试输入均为合成，不代表接收端真实故障。

## 证据分级

- 文档规定：`docs/collaboration/local-jobs/README.md` 第 5、13 行（page 字段、reader-test 用法）。
- 检查器实际检查：`scripts/check_repo.py`（行数、链接、JSON/TOML）与 `tests/test_check_repo.py` 9 项通过；不含 page／头字段。
- 本次真实执行证据：附入文本字节一致（9971 字节、sha256 相同）；9 单测通过；仓库根 check_repo 由 563 增至 565 文件均 0 错误；合成卡片与边界输入的实际输出如上。
- 未知／未运行：接收端附入动作、page ref 解析时机、缺失目标的接收端处理为未知；`check_public` 本次未在验收范围。

## 检查点（按页面第 66–74 行模板）

1. 目标与完成条件：仓库侧验收 page 引用协议，给出合法任务写法与仍需接收端验证的保证；本文件即完成条件的主要证据。
2. 仓库／分支／基线：本 worktree HEAD `5087a91`，任务 `base_ref` `5847ea53`；未提交修改。
3. 已确认事实：page 协议仅文档；check_repo 不校验 page／头字段；附入文本等于 `d0b9651b`。
4. 已运行命令：9 单测（exit 0）、仓库根 check_repo（563／565 文件均 0 错误／exit 0）与合成输入的 check_repo（见上表）。
5. 在途／外部：无。接收端附入与 ref 解析为未知，待接收端侧确认。
6. 下一步：非读者复跑合成输入与字节比较；在接收端日志或工作副本侧确认附入与缺失目标行为。
