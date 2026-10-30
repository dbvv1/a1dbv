# A-CONTEXT-PAGE-CONTRACT-READER-20261029 单元 3 读者记录

- 读者前提：此前未读 `docs/decisions/context-management.md`，未参与该页写作或前两单元；本单元只按任务卡所附页面全文与页面给出的方法做，没有打开 `reader-tests/…-u1.md`、`…-u2.md`，也没有另找上下文管理教程或旧读者答案。
- 工作树分支：`receiver/A-CONTEXT-PAGE-CONTRACT-READER-20261029`；任务卡 `base_ref`：`5847ea532dbf7437ca8c4865af031ce0d862a153`；开始与结束的实际 HEAD：`51d4dbd8a26db193978ddb69ac134004a719eacb`。
- 页面：`docs/decisions/context-management.md@dot-a/context-concise-reader-20261029`；该分支在 `origin` 指向 `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8`。
- 平台：Windows，Python 3.13.5；只做读文件、git 只读查询、仓外临时目录里的合成输入和本地测试，未提交、未推送、未切换分支、未改任务卡。

## 做到哪一步

原任务卡（job.md）“原任务验收”的六条都做了，实跑与静态核对分开记录：

1. **固定受检版本**：实际 HEAD `51d4dbd8…`，`base_ref` `5847ea53…`；page 分支解析为 `d0b9651b…`。实现入口 `scripts/check_repo.py` 与 `tests/test_check_repo.py` 已读全；`scripts/validate_task.py` 经查是长任务 spec/report 一致性校验，不处理 local-jobs 卡，排除。
2. **最小 reader-test 卡示例**：在仓外临时根生成 20 行合成卡（`kind: reader-test`，`page` 用 40 位提交），用 `python3 scripts/check_repo.py --root <临时根>` 实跑，`errors=[]`、exit 0；没有写入 `docs/collaboration/local-jobs/`、没有置 `ready`、没有入队。
3. **page 默认／固定／缺失边界**：默认 main、固定 `@<分支或提交>`、缺失目标三项都核对；默认 ref 与缺失目标没有代码实现，只有 README 文字或干脆没写；缺失目标用合成输入证明检查器不查。
4. **仓库测试**：`python3 -m unittest discover -s tests -p 'test_check_repo.py' -v` 9 项通过、exit 0；仓库根 `python3 scripts/check_repo.py` 为 `checked_files=562`、`errors=[]`、exit 0。
5. **检查点**：按页面第 66–74 行六项写进 `docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result.md` 的“单元 3 独立复核”节。
6. **非读者复核入口**：result.md 里留了可复跑命令、合成输入表、字节级全文核对方法和未知项清单。

## 产物

- `docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result.md`：追加“单元 3 独立复核（新上下文读者，2026-10-30）”一节，含受检版本、字节级附入核对、检查器探针表、合成最小卡、page 边界、六项检查点、页面卡点。
- 本文件 `reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u3.md`：读者过程、卡点、误判与页面外查证记录。
- 未新增其他仓库文件；临时测试输入都在系统临时目录，用完即删。

## 卡点（页面哪一句、缺什么）

1. **页面第 7 行“沿实现与检查补足信息。”**
   - 缺什么：这条只说“沿实现与检查”，没有给“接收端附入的全文是否等于 page 固定版本”的核对步骤——没有 ref→提交解析、没有取该提交下文件、没有 blob／sha256 或字节对照。
   - 影响：照字面从 `scripts/check_repo.py`／`tests/test_check_repo.py` 入手，得到的是“链接／语法／行数都通过”，无法回答“页面是否已附、版本是否正确”。这部分只能自己补方法。
2. **页面第 16 行“从仓库根目录运行 `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v`，已验证 9 项通过。`check()` 与 `test_existing_and_external_links` 表明：检查本地文件存在，跳过 `#锚点` 与外链。”**
   - 缺什么：这段把可运行入口指向检查器的“链接”行为，但任务卡的 `page` 字段、`kind` 取值、任务头字段都不在被指向的代码里；页面没有提示“任务卡头部字段没有仓库侧检查器”这一点。
   - 影响：若把“检查通过”当成“卡合法、页面已固定”，就会把静态通过说成接收端已完成，这是任务卡明确禁止的。
3. **页面第 10–13 行的示例任务（“核对本仓文档检查器是否检查 Markdown 链接里的 #锚点”）**
   - 缺什么：示例对象与真实任务（page 输入合同）不同，页面没给两者之间的迁移说明；“先看链接解析实现与相关用例，缺信息再扩大搜索”这一步不覆盖 `page` 字段。
   - 影响：需要扩大到 `docs/collaboration/local-jobs/README.md`、协议提交 `5561e38e` 和 ref 解析，才能拼出合同全貌。
4. **页面第 66–74 行检查点模板**
   - 缺什么：模板第 2 项写“基线 commit”，但没有区分任务卡 `base_ref` 与实际工作树 HEAD；本例两者不同（`5847ea53` vs `51d4dbd8`），照抄会把基线记错（前一份 result.md 就写错了）。

## 做错过什么

1. **先拿磁盘上的页面比对，核错对象。** 第一次把附入全文与工作树里的 `docs/decisions/context-management.md` 对比，得到 82 行 vs 149 行不一致。原因：`page` 指向的是分支 `dot-a/context-concise-reader-20261029`，其页面是新版（82 行）；磁盘／HEAD 上是另一版（149 行）。改为 `git ls-remote` 解析分支、`git cat-file -p d0b9651b:…` 取对应 blob 后一致。教训：任务卡里的 `page` 不等于“当前检出目录里的同名文件”。
2. **初次比对用 `strip("\n")` 归一化，可能掩盖尾字节差异。** 后来改为按任务文件原始字节切片、与 `git cat-file -p` 输出直接比长度和逐字节内容，才敢说“字节一致”。
3. **一度假设仓库里有校验 `page` 字段的脚本。** 在 `scripts/`、`tests/` 里搜 `page`／`local-jobs` 后确认没有：只有 `check_repo.py` 的 80 行与链接规则，`validate_task.py` 是另一套长任务 spec 校验。中途差点把 `validate_task.py` 当成本任务的检查器。
4. **用 `write_text` 造 TASKS.md 超限探针时长度多 1 字节。** Windows 文本模式把 `\n` 转成 `\r\n`，导致 10240 字节断言失败；改用 `write_bytes` 后才得到准确的 10240／10241 边界结果。

## 页面之外还去翻了什么（及为什么）

- `docs/collaboration/local-jobs/README.md`：任务卡字段与 `page` 协议的唯一文字来源（页面本身没写）。
- `scripts/check_repo.py`、`tests/test_check_repo.py`：页面第 11、16 行指定的入口；读全后确认它们只查 80 行／TASKS 10 KB／JSON-TOML／内联链接。
- `scripts/validate_task.py`：为排除“是否有另一个检查器管任务卡”而读；结论是它管长任务 spec/report，不相关。
- `docs/collaboration/operations.md` §3 与 `docs/collaboration/game-taskbook.md` 的 `reader-test` 行：为确认 `kind: reader-test` 的含义与接收端流程，只读了相关小段。
- git 只读历史：`5561e38e`（page 协议提交的 diff）、`d0b9651b`（页面固定提交的元数据与父提交）、`origin/*` 分支与 blob 解析。
- 本任务先前单元留下的 `result.md`：在所有独立探针跑完之后才打开，仅用于追加而不覆盖；没有用它替代自己的验证。没有打开 u1／u2 的读者记录。

## 一句结论

现行协议的“合法任务”只由 README 的文字定义，仓库侧检查器只保证“未结束卡不超过 80 行、TASKS 不超 10 KB、JSON／TOML 语法、内联本地链接目标存在”。`page` 能否解析、缺省 main 取到哪一版、缺失目标如何处理、接收端是否真的附入全文并固定在某一提交，全部是接收端保证，本仓无法验证，只能事后比对；本次能确认的只是“本单元收到的附入全文与 `d0b9651b` 字节一致”，不能推广成“任务已按该版本启动”。

## 核对（非读者验证者，2026-10-30）

本节由未参与照做、只做核对的新上下文写成；未改页面、检查器、任务卡或读者已写的上文。

### 实际复跑

- `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v`：9 项通过，exit 0（Python 3.13.5，Windows）。
- `python3 scripts/check_repo.py`：`checked_files=563`、`errors=[]`、exit 0。读者记录写 562；差 1 是本单元新增的未跟踪 `reader-tests/…-u3.md`，复跑仍 0 错误。
- 合成探针复现：80 行 active exit 0；81 行 active exit 1（`active job file has 81 lines (max 80)`）；81 行 accepted exit 0；81 行 `status：ready`（全角冒号）exit 1；`page` 不存在／路径逃逸／`kind: explore` 均 exit 0；缺失内联链接 exit 1（`missing link target`）；`TASKS.md` 10240 字节 exit 0、10241 字节 exit 1（`over 10 KB`）。与读者表一致。
- 附入全文：从 job.md 的 `## 页面全文（…）` 标记行后取内容，按页面标题起算 9971 字节、sha256 `700df4…`、blob `8a9cbae4…`，与 `git cat-file -p d0b9651b:docs/decisions/context-management.md` 逐字节相同。标记行后有一个空行分隔，原始剩余字节为 9972；读者单元 3 节写“标记之后的剩余字节…9971”不精确，但结论成立（result.md 上文“去掉任务头与正文之间的一个空行后逐字节相同”是准确写法）。
- 磁盘／HEAD 页面：149 行、sha256 `35cff5…`、blob `ecb9e233…`，与读者警告一致。四个 page 分支均解析、页面文件均存在；`origin/main` 页面与 `d0b9651b` 的 diff 为 113 增 46 删；`5561e38e` 是 page 协议提交（README 2 行）；`e979a9c7` 只把 `ready` 改成 `running`；absorption 的 `frozen_page_changed` 与 `check_execution_snapshot.py` 的 `repository_identity` 描述属实。

### 卡点归因

1. **页面第 7 行**：cause=page。页面只给“沿实现与检查”，本任务的 page 校验没有仓库侧实现／检查器（`check_repo.py` 不解析 page），页面也没说外部／接收端保证无法观察时如何取证或标注未知。读者只能自行补 ref→commit、`git cat-file`、blob／sha256 对照；照页面字面只到链接／行数／语法通过。属页面缺信息（任务卡本身也要求该核对，所以不是读者不会）。
2. **页面第 16 行**：cause=model。该句有明确范围（“`check()` 与 `test_existing_and_external_links` 表明…”，“这个实例验证检查器行为…”），并未声称校验任务头／page／kind；任务卡也明确禁止把静态通过报成已附全文或已启动。读者把“检查器入口”理解成应覆盖任务头字段，是超出页面承诺的推断；实际未误报，属读者过度外推，不是页面缺信息。
3. **页面第 10–13 行**：cause=page。页面的具体示例是“核对文档检查器的 #锚点行为”，与 page 输入合同不是同一对象；页面只说“换项目时换目标与入口”，没有说明同一仓内换任务对象时如何迁移验证点，也没指向 README／协议提交。读者必须自行扩大到 README、`5561e38e` 和 git ref 解析才能拼出合法卡写法；这是页面缺少迁移前提（任务卡虽给了起始文件，减轻了影响）。
4. **页面第 66–74 行**：cause=page。检查点模板第 2 项“仓库、分支、基线 commit”没有区分任务卡 `base_ref` 与当前工作树 HEAD；本例 `base_ref=5847ea53`、HEAD=`51d4dbd8`，照模板抄会记错基线（本任务先前 result.md 就写错了）。读者在 u3 记录里已同时记下两者，但这条卡点没有写进 result.md 的卡点节。

### 读者没意识到的错误／产物缺口

- **result.md 结论漏掉 TASKS.md 10 KB 检查。** 开头仍写 `check_repo.py`“实际只查三件事”（80 行、JSON／TOML、链接），并写“仓库侧保证只有 80 行和链接／语法”；实际还有 `docs/collaboration/TASKS.md` ≤10 KB（`TASKS_MAX_BYTES`，10241 字节探针 exit 1），读者自己的单元 3 节、探针表和短检查点也写了它。结论与后文自相矛盾，读结论的人会低估检查器。
- **单元 3 的 `checked_files=562` 不是最终状态。** 新增未跟踪 `reader-tests/…-u3.md` 后复跑为 563、`errors=[]`；读者没有在全部写入后复跑并更新计数（复跑仍 0 错误，但证据不是最终工作树）。
- **“补记首次 FileNotFoundError 与重试”没有落实。** 任务卡“当前结果”的下一步明确要求，result.md 与 u3 记录都没有这条，也没有说明本轮未遇到该错误。
- **第 4 条卡点只留在写域外的记录里。** result.md 的“页面让我卡住或需补查的位置”只有 3 条，页面第 66–74 行检查点模板的 `base_ref`／HEAD 歧义只写在 reader-tests/u3.md；任务写域是 result.md，前一步也要求“卡点改用页面行号并写入 result.md”。
- **result.md 开头的受检版本仍写错。** “实际受检 commit（任务卡 `base_ref`，也是本工作树 HEAD）”不对（`base_ref=5847ea53`，HEAD=`51d4dbd8`）；单元 3 节已注明，但原句未改。读者知悉，未计入“没意识到”。

### 结论

taskDone=true：六条原任务验收的核心都做了——实际 commit／page 固定、附入全文字节核对、最小卡实跑且未入队、默认／固定／缺失边界、9 项测试与检查器复跑、检查点与卡点；我复跑的关键命令与探针结果和记录一致。上面的错误是产物内部不一致、计数未按最终状态更新、以及把一条卡点留在写域外的记录里，均可在 result.md 内修正，不推翻已完成的核心工作。
