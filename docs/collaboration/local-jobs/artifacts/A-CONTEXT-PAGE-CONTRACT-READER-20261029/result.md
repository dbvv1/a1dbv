# A-CONTEXT-PAGE-CONTRACT-READER-20261029 结果

## 结论

- **合法任务卡的格式由 `docs/collaboration/local-jobs/README.md` 规定，不由检查器规定。** 任务头必填 `id`、`owner`、`status`、`target_repo`、`base_ref`、`result_branch`，可选 `accept`、`kind`、`page`；`page` 写 `<本仓路径>[@<分支或提交>]`，缺省 main；正文只写目标、按哪个 Skill／规格做、写入范围、怎样算做成；未结束卡不超过 80 行。
- **仓库里没有检查器校验任务头或 `page`。** `scripts/check_repo.py` 实际只查三件事：直属于 `docs/collaboration/local-jobs/` 的 Markdown 未结束卡不超过 80 行、JSON／TOML 语法、Markdown 内联本地链接目标存在。字段缺失、`kind` 取值、`page` 路径与 ref 都不在检查范围。
- **提交阶段的仓库侧保证只有 80 行和链接／语法。** page 能否解析、全文是否附入、缺省 main 与缺失目标怎么处理，都要接收端保证；接收端代码不在本仓，本次无法观察，记未知。

## 受检版本与入口

- 实际受检 commit（任务卡 base_ref，也是本工作树 HEAD）：`5847ea532dbf7437ca8c4865af031ce0d862a153`。
- 任务卡 page ref：`docs/decisions/context-management.md@dot-a/context-concise-reader-20261029`；本地解析到 `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8`（`origin/dot-a/context-concise-reader-20261029`）。
- 主要入口：`docs/collaboration/local-jobs/README.md`、`scripts/check_repo.py`、`tests/test_check_repo.py`。缺信息后扩大到 `docs/collaboration/operations.md` §3、git 历史（`5561e38e` 协议提交、`692bf2b2` 四张卡、`e979a9c7` 领取提交）、`scripts/check_execution_snapshot.py`、`experiments/absorption/runs/20261022-smoke-v1/run_batch.py`。

## 接收端附入的全文核对

本卡工作副本含“## 页面全文（docs/decisions/context-management.md@dot-a/context-concise-reader-20261029，接收端附上）”一节。把该节正文与 `git show d0b9651b:docs/decisions/context-management.md` 对比：去掉任务头与正文之间的一个空行后逐字节相同，82 行、9971 字节，sha256 `700df4b6d6e9a3fa85610b2f58bf042be663e2f1fa2a9527fb4f9efbe58d4599`，blob `8a9cbae46f165b9f723f8cec960d1a20742ec9ce`。

这是“已附全文且与固定版本一致”的核对；`git show` 只用于比对，没有用自行取回页面替代附入。

接收端内部步骤不可观察：是否解析 ref、是否把实际页面提交落盘。领取提交 `e979a9c7` 只把 `status: ready` 改成 `running`，未记录页面提交；“页面分支核对为 `d0b9651b`”写在任务卡“当前结果”里，是派发方写的，不是接收端落盘的。

## 检查器实际检查什么（本次实跑）

| 输入（合成，仓外临时目录） | 结果 |
|---|---|
| 20 行最小 reader-test 卡，`page` 指向真实分支提交 | `checked_files=1`，`errors=0` |
| 同上，`page` 改成不存在的 `docs/decisions/does-not-exist.md` | `checked_files=1`，`errors=0`（page 不检查） |
| 删除 `page` 字段 | `errors=0`（非必查） |
| 只留 `id`、`status`，其余头字段缺失、无 `kind` | `errors=0`（任务头不解析） |
| 同一卡扩到 100 行 | 1 条错误：active job file has 100 lines (max 80) |
| 100 行但 `status: accepted` | `errors=0`（终态卡不限行） |
| 卡内加一条指向 `no-such-file.md` 的内联链接 | 1 条错误：missing link target |

这些变体均在任务独占的仓外临时目录生成，明确标为合成输入，不代表接收端故障，也没有改仓库文件。

## 可公开的最小 reader-test 卡示例（未入队）

```text
id: A-CONTEXT-PAGE-EXAMPLE-20261030
owner: dot-A
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5847ea532dbf7437ca8c4865af031ce0d862a153
result_branch: relay/a-context-page-example-20261030
kind: reader-test
page: docs/decisions/context-management.md@d0b9651b5db9039975d1abde4efe8f0cfd3a43b8

## 目标
读者照所附页面完成一个只读仓库检查，交回支持范围、实际命令与退出结果。

## 按什么做
只照 `page` 所附页面；项目指令、目标源码与测试是工作材料。

## 写入范围
只在结果分支新增 `docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-EXAMPLE-20261030/result.md`；不改页面与检查器。

## 怎样算做成
实际命令有退出码；失败、未运行、未知分开；不把检查通过报成所有链接均有效。
```

该示例只作为 `check_repo.py` 的输入验证（20 行、0 错误），没有写入 `docs/collaboration/local-jobs/`，没有置 `ready`。

## page 的默认 ref、固定 ref 与缺失目标

- **默认 ref = main**：`README` 写“缺省 main”。没有代码落实。实测 `origin/main` 上同一页面 blob 为 `ecb9e2336803948b788f5b66b4fc43ecb7f1a654`，与固定版本 `8a9cbae4…` 相差 113 增 46 删；因此省略 `@ref` 会附入实质不同的页面。
- **固定 ref**：协议允许 `@<分支或提交>`。本次四张读者卡都写分支（`@dot-a/...`），分支可变；只有 `@<40 位提交>` 才不可变。四个分支本地都能解析、页面文件都存在：

| page | 解析提交 |
|---|---|
| `docs/decisions/model-roles.md@dot-a/model-effort-reader-dispatch-20261029` | `a666f3fc0507affa26dfbe50da767eb28ad4137a` |
| `docs/decisions/skills-and-plugins.md@dot-a/skills-round-20261029` | `017a3363db3294f11e6f4965869bfac426569c44` |
| `docs/decisions/verification.md@dot-a/verification-page-candidate-20261029` | `2c55a5a54aec7f1410e2e0368468eb26250efe39` |
| `docs/decisions/context-management.md@dot-a/context-concise-reader-20261029` | `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8` |

- **缺失目标**：`README` 没写，`check_repo.py` 不查（上表第二行已证）。接收端遇到 page 路径或 ref 不存在时是回输入卡点还是静默换版，本仓没有代码可读，记未知。

## 相关实现对照

`experiments/absorption/runs/20261022-smoke-v1/` 已有更严的页面固定做法：任务写 `page_revision`，每个页面再写 `blob` 与 `sha256`，`run_batch.py` 读出后用 `require(blob == item['blob'] and digest(body) == item['sha256'], 'frozen_page_changed')` 拒绝被改页面。新 `page` 协议没有等价的提交号／内容哈希记录，因此“附入的是固定版本”只能像本记录这样事后比对，不能由检查器或任务卡自证。

`scripts/check_execution_snapshot.py` 的 `repository_identity` 复用了 local-jobs 的 `target_repo` URL 规范（`https://github.com/owner/repo`，不带 `.git`、查询或片段），但它检查的是执行快照 JSON 的单元，不检查 Markdown 任务卡；任务卡上的 `target_repo` 目前没有仓库侧校验。

## 已运行命令与结果

- `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v`：9 项通过，退出 0。
- `python3 scripts/check_repo.py`（仓库根）：加入本记录前 `checked_files=559`、`errors=0`；加入两个新 Markdown 后 `checked_files=561`、`errors=0`；两次退出均为 0。
- 合成输入探针（`--root` 指向仓外临时目录的合成根）：最小卡、page 指向不存在目标、100 行但 `status: accepted` 均为 exit 0；100 行未结束卡、缺失链接为 exit 1；删除 `page` 字段同样 0 错误。输入明确标为合成。
- `git rev-parse --verify origin/<page ref>^{commit}` 与 `git cat-file -e <ref>:<page>`：四个 page ref 均解析、页面文件均存在。
- 全文比对：`git show d0b9651b:docs/decisions/context-management.md` 与附入正文 sha256 相同。

**失败、未运行、未知分开**：本次没有命令失败；“接收端如何解析 ref、如何附入、缺省／缺失目标行为”未运行也无可读实现，记未知；仓内没有接收端代码，因此没有对接收端做任何实跑。

## 短检查点

1. **目标与完成条件**：验收 reader-test 的 `page` 输入合同，说明现行写法如何提交合法任务、哪些保证仍须接收端验证。禁改范围：页面、检查器、任务协议、长期规则、接收端与本机设置；不建／不发 `ready` 任务。
2. **仓库与基线**：分支 `receiver/A-CONTEXT-PAGE-CONTRACT-READER-20261029`，基线 `5847ea53`。未提交新增：本 `result.md` 与 `reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u1.md`。
3. **已确认事实**：协议文本在 `README` 第 5、13 行；`check_repo.py` 只查 80 行／链接／JSON-TOML；本卡全文与 `d0b9651b` 一致；四张卡用分支 ref；领取提交未记录页面提交；absorption 批次已有 `page_revision`＋`blob`＋`sha256` 的先例。
4. **已运行**：见上节，均记录退出结果。
5. **在途与外部**：无在途调用。接收端行为未知。
6. **下一步**：非读者验证者复跑本记录的两条命令与合成探针；若要补强，由接收端在领取时记录解析到的页面提交（最好再记 blob／sha256），并明确缺省 main、ref 不存在、页面缺失时的回卡点规则；这些都不应由检查器假装覆盖。

## 单元 3 独立复核（新上下文读者，2026-10-30）

本节由未读过本页、未参与前两单元的新读者独立完成：先做完所有实跑探针，之后才打开本文件追加，未改写上文章节。与上文重复的结论保留，下列数字为本单元实测。

### 实际受检版本

- 工作树 HEAD（开始与结束一致）：`51d4dbd8a26db193978ddb69ac134004a719eacb`；任务卡 `base_ref` 是 `5847ea532dbf7437ca8c4865af031ce0d862a153`。上文第 11 行把 base_ref 写成 HEAD，不准确。
- page 引用：`docs/decisions/context-management.md@dot-a/context-concise-reader-20261029`。`git ls-remote --heads origin` 得 `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8`，与本地 `origin/dot-a/context-concise-reader-20261029` 一致。该 ref 是**分支**，可变；只有写 40 位提交 `d0b9651b…` 才不可变。
- 页面对象：`d0b9651b:docs/decisions/context-management.md`，blob `8a9cbae46f165b9f723f8cec960d1a20742ec9ce`，82 行、9971 字节，sha256 `700df4b6d6e9a3fa85610b2f58bf042be663e2f1fa2a9527fb4f9efbe58d4599`。

### 附入全文核对（字节级）

取任务文件里“页面全文（docs/decisions/context-management.md@dot-a/context-concise-reader-20261029，接收端附上）”标记之后的剩余字节，与 `git cat-file -p d0b9651b:docs/decisions/context-management.md` 直接比较：长度同为 9971、逐字节相等、无多余尾字节，sha256 相同。结论：本单元收到的附入全文等于该分支当时尖端。接收端内部解析步骤仍不可观察（未知）。

**注意**：工作树磁盘上的 `docs/decisions/context-management.md` 是另一版（149 行，blob `ecb9e2336803948b788f5b66b4fc43ecb7f1a654`，sha256 `35cff5a013701ef0d4aa52f8b80c85dc30edaaf425c1dea8ca4bcb4bd716d2c3`），与附入页不同；以磁盘文件或 HEAD 版当“页面”会核错对象。本单元第一次就是这样比对，得到 82 vs 149 不一致，改用 `d0b9651b` 后一致。

### 检查器实际行为（本单元重跑）

- 仓库根 `python3 scripts/check_repo.py`：`checked_files=562`、`errors=[]`、退出 0。
- `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v`：9 项通过，退出 0；与页面第 16 行“已验证 9 项通过”一致。
- 合成探针（仓外临时根，输入明确标为合成，不代表接收端故障）：

| 输入 | 结果 |
|---|---|
| 合法 20 行卡，`page` 用固定 branch ref | exit 0 |
| 合法 20 行卡，`page` 省略 `@ref`（默认 main） | exit 0 |
| `page: docs/decisions/does-not-exist.md@dot-a/missing` | exit 0（不检查 page） |
| `page: ../../../etc/passwd@main`（路径逃逸） | exit 0（不检查 page） |
| `kind: explore` 用在 reader-test 卡上 | exit 0（不检查 kind） |
| 正文内联链接指向不存在文件 | exit 1，`missing link target` |
| 80 行 + `status: running` | exit 0 |
| 81 行 + `status: running` | exit 1，`active job file has 81 lines (max 80)` |
| 81 行 + `status：ready`（全角冒号） | exit 1（status 正则接受全角冒号） |
| 81 行 + `status: accepted` | exit 0（终态豁免） |
| `docs/collaboration/TASKS.md` 10240 字节 | exit 0 |
| `docs/collaboration/TASKS.md` 10241 字节 | exit 1，`over 10 KB` |

失败、未运行、未知分开：以上无失败；接收端行为（ref 解析、缺省 main、缺失目标时回卡点还是静默换版）仓内无实现，未运行，记未知。

### 最小可公开 reader-test 卡（合成，未入队）

```text
id: A-SYNTH-PAGE-CARD-001
owner: dot-A
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5847ea532dbf7437ca8c4865af031ce0d862a153
result_branch: relay/a-synth-page-card-001
kind: reader-test
page: docs/decisions/context-management.md@d0b9651b5db9039975d1abde4efe8f0cfd3a43b8

## 目标
读者按所附页面完成一项真实任务，并只记录卡点。

## 依据
照 `page` 指向的页面全文与项目指令做，从仓库根目录按页面给出的入口开始。

## 写域
只新增 `docs/collaboration/local-jobs/artifacts/A-SYNTH-PAGE-CARD-001/result.md`。

## 做成标准
产物存在；每个卡点标到页面的具体句子；页面本身不改。
```

该卡只在仓外临时根的 `--root` 下被 `check_repo.py` 读过（20 行、`errors=[]`、exit 0），没有写入 `docs/collaboration/local-jobs/`，没有置 `ready`、没有入队。验证范围仅限行数与内联链接；字段语义、page 解析不在检查范围。

### page 的默认 ref、固定 ref、缺失目标

- **默认 ref = main**：文档规定（README 第 5 行）缺省 main，无代码落实。`origin/main` 上同一页面 blob 为 `ecb9e233…`（149 行），与固定分支 `8a9cbae4…`（82 行）不同；省略 `@ref` 会附入另一版页面。
- **固定 ref**：`@<分支或提交>`。本次 page 用的是分支，当前指向 `d0b9651b`；分支可移动，要真正固定须写 40 位提交。上文表里四张卡也全是分支 ref。
- **缺失目标**：README 未写，`check_repo.py` 不查（上表已证），接收端行为未知。
- **`page@提交` 与 blob／sha256 的区别**：`page: <路径>@<分支或提交>` 只说明“去哪取、取哪一版标识”，不是内容指纹；要证明“附入的就是那一版”，必须另算该提交下文件的 blob 或 sha256。任务卡本身不携带、检查器也不校验这个指纹。

### 检查点（按页面第 66–74 行六项）

1. 目标与完成条件：验收 reader-test 的 `page` 输入合同——现行写法如何提交合法任务、哪些保证仍须接收端验证。最新约束／禁改范围：不改页面、检查器、任务协议、长期规则、接收端与本机设置；不建／不发 `ready` 任务；不提交不推送；只用仓外合成输入。
2. 仓库、分支、基线：worktree 分支 `receiver/A-CONTEXT-PAGE-CONTRACT-READER-20261029`，`base_ref=5847ea53…`，实际 HEAD `51d4dbd8…`；未提交修改：本 `result.md` 追加节与 `reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u3.md`。
3. 已确认事实与入口：协议在 `README` 第 5、13 行；`check_repo.py` 只查直属于 local-jobs 的未结束卡 80 行、TASKS.md 10 KB、JSON／TOML 语法、内联本地链接；附入全文与 `d0b9651b` 字节一致；磁盘页面是另一版。
4. 已运行命令与结果：见上节，无失败；接收端未运行。
5. 在途／外部操作：无；接收端状态未知。
6. 下一步：非读者验证者复跑 `check_repo.py`、9 项测试与合成探针，独立重算附入全文 sha256；若要补强，由接收端在领取时落盘解析到的页面提交（最好连 blob／sha256），并写明缺省 main、ref 不存在、页面缺失时的回卡点规则。

### 页面让我卡住或需补查的位置

- **页面第 7 行“沿实现与检查补足信息”**：对“附入全文是否等于 page 固定版本”没有给 ref→提交解析与 blob／sha256 对照步骤。页面第 16 行指向的 `scripts/check_repo.py`、`tests/test_check_repo.py` 完全不涉及 `page` 字段；照页面入口走只会得到“检查通过”，那只说明行数／语法／链接，不说明页面已附或版本正确。
- **页面第 10–13 行**的示例任务是“检查 Markdown 链接 #锚点”，与本任务的 page 输入合同不是同一对象；页面没说明如何把“检查器实际检查什么”迁移到任务卡头部字段。
- **页面第 16 行“已验证 9 项通过”**：本单元可复现（9 项、退出 0），但没给适用 Python／平台版本；本机为 Python 3.13.5、Windows。
