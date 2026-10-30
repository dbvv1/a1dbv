# A-CONTEXT-PAGE-CONTRACT-READER-20261029 · u4 读者测试记录

- 身份：独立新上下文读者；此前未读 `docs/decisions/context-management.md`，未参与该页写作或旧诊断；未读 `reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u1..u3.md`，也未读 HEAD 上既有的 `docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result.md`。
- 任务卡：只照接收端附入的页面全文，完成 job 卡里的“reader-test page 引用协议”仓库侧验收。
- 页面 ref：`docs/decisions/context-management.md@dot-a/context-concise-reader-20261029`，尖端 `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8`。

## 做到哪一步

基本做完了仓库侧可观察的部分：

1. 核了接收端附入：任务文件“页面全文（接收端附上）”段与 `d0b9651b:docs/decisions/context-management.md` 逐字节一致（9971 字节，同一 sha256，`diff` 为空）。附入文本确认是全文本；“附入动作”本身看不到。
2. 定位了协议实现：只有 `docs/collaboration/local-jobs/README.md` 第 5、13 行两处文档，来源提交 `5561e38e`；`scripts/check_repo.py` 无任何 `page` 代码。
3. 复跑了页面给的命令：`python3 -m unittest discover -s tests -p 'test_check_repo.py' -v` → 9 项通过（exit 0）；`python3 scripts/check_repo.py` → 563 文件、0 错误、exit 0（写入本单元两个新文件后复跑为 565 文件、仍 0 错误）。
4. 用仓外合成输入验证了边界：最小合法卡通过；`page` 缺省／分支 ref／commit ref／缺失目标、以及非法头字段，检查器一律 0 错误；112 行活动卡报行数超限，终态卡豁免；坏相对链接报错（阳性对照）。
5. 写了验收结果与检查点。

产物：

- 验收结果：`docs/collaboration/local-jobs/artifacts/A-CONTEXT-PAGE-CONTRACT-READER-20261029/result-u4.md`
- 本记录：`reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u4.md`
- 合成卡片与命令输出在仓外任务独占临时目录，未提交。

没做到的：接收端附入过程、page ref 解析时机、缺失目标的接收端处理，都只能记未知；`check_public` 不在本次验收范围，未跑。

## 卡点：页面哪一句、缺什么、做错过什么

### 卡点 1：页面主题与任务主题错配

- 页面哪一句：页面第 5、7 行“**说清目标、保留行为和起点，沿实现与检查补足信息。**”以及第 9–14 行示例任务框（“核对本仓文档检查器是否检查 Markdown 链接里的 #锚点”）。
- 缺什么：页面通篇是上下文管理（压缩、重开、CLI 命令、恢复），没有一句讲 reader-test 的 `page: <路径>[@<ref>]`、合法卡头字段或接收端附入。要完成本任务，我是靠任务卡正文点名的 `local-jobs/README.md` 才拿到协议规格；页面只提供了“按需找原文 + 跑测试 + 检查点”的通用方法，不足以推出“现行写法怎样提交合法任务”。

### 卡点 2：页面给的测试命令覆盖不到 page 协议

- 页面哪一句：页面第 16 行“从仓库根目录运行 `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v`，已验证 9 项通过。”
- 缺什么：命令我照跑确实 9 项通过，页面关于“检查本地文件存在、跳过 #锚点与外链”的结论也和源码一致；但这 9 项没有一项覆盖 `page` 字段或任务头字段。页面把“检查器行为”讲清了，却没有 page 协议的测试入口，我只能自己合成卡片输入来试边界。

### 卡点 3：检查点模板可用，但没讲 ref 稳定性与缺失目标

- 页面哪一句：页面第 62 行标题与第 66–74 行的 6 项检查点模板。
- 缺什么：模板正好可用于验收第 5 条检查点，但页面没区分“固定 commit”与“分支 ref”。本卡写的是分支 `@dot-a/context-concise-reader-20261029`，我是从分支尖端解析出 `d0b9651b` 的；分支会动，只有 commit 不可变，卡片本身没锁 commit。页面也没说 page 目标缺失时接收端怎么办（检查器不查，接收端行为未知）。

### 做错的地方

- 页面第 16 行的命令我照跑后，先把检查输出重定向到 `/tmp/...`，又在 Python `-c` 里用 `/c/...` 打开该文件，报 `FileNotFoundError`。原因是 Git Bash 只把命令行参数里的 POSIX 路径转成 Windows 路径，不转字符串里的路径。改用 `C:/...` 后通过。这是我自己 shell 用法出错，不是页面内容问题。

### 另记

- 任务卡“当前结果”一节描述了前序单元的产物与 6 条未关闭审查问题。我把它当作派发上下文，没有据此修改既有 `result.md`，也没有读旧记录；本单元按独立读者从零验收，结果写进 `result-u4.md`。卡片没有说明重复 reader-test 单元该怎样命名产物，我按“不覆盖前序证据”处理。

## 页面之外还去翻了什么

- `docs/collaboration/local-jobs/README.md`：任务卡点名入口，页面未提；page 协议规格只在这里。
- `scripts/check_repo.py`、`tests/test_check_repo.py`：页面第 16 行点名；用于确认检查器实际检查范围。
- `scripts/validate_task.py`、`tests/test_validate_task.py`：扩查是否另有 job 卡校验；结论是它只校验 long-task spec/report JSON，与 `page` 无关。
- `docs/collaboration/operations.md`：查接收端如何附入页面；只写“脚本和配置只在本机”，没有 page 附入细节。
- git 历史与状态：提交 `5561e38e` 的 diff、分支尖端 `d0b9651b`、`origin/main` 与本地 `main`、HEAD `5087a91` 的文件状态。
- 未读：u1–u3 记录、既有 `result.md`、同主题别的教程。

## 结论

页面足以支撑“找到入口文件 + 跑测试 + 按模板留检查点”这部分，但对本任务的核心——reader-test `page:` 引用协议本身——没有任何说明；合法任务的写法、page 的默认／固定／缺失边界、哪些保证要靠接收端，都必须到 `local-jobs/README.md` 和源码里补。页面没有写错，但与本次任务的需求不匹配。

## 核对

非读者核对：在 worktree HEAD `5087a911` 上复跑并比对读者产物与自报，未把模型自报当通过。

**复跑结果**

- 附入全文：任务文件“页面全文（接收端附上）”段（第 43–125 行）与 `d0b9651b:docs/decisions/context-management.md` 同为 9971 字节、sha256 `700df4b6d6e9a3fa85610b2f58bf042be663e2f1fa2a9527fb4f9efbe58d4599`、`diff` 为空；`d0b9651b` 是 `origin/dot-a/context-concise-reader-20261029` 尖端，无本地分支或 tag 指向它。
- `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v` → 9 项 OK。
- `python3 scripts/check_repo.py` → 565 文件、0 错误、exit 0；去掉本单元两个新文件为 563，与读者计数一致。
- 合成输入复现：最小卡 `--root` 仓外临时根 → 1 文件、0 错误；`page` 无 ref／分支 ref／commit ref／缺失目标、非法头字段均 0 错误；>80 行活动卡报错、`accepted` 豁免；坏相对链接报错。
- `scripts/check_repo.py` 与 `tests/test_check_repo.py` 无 `page` 代码或用例；协议只在 `docs/collaboration/local-jobs/README.md` 第 5、13 行，来源提交 `5561e38e` 为 HEAD 祖先；本地 `main` 无该文件，`origin/main` 与 HEAD 均为 18373 字节。
- 读者所述 `/tmp` 字符串导致 `FileNotFoundError` 可复现同类（Python 字符串里的 `/tmp` 落到 Windows 根），确属 shell 用法，不是页面问题。
- 两个产物无具体本机绝对路径或内网地址（仅有 `/tmp/...`、`C:/...` 这类通用占位）；`result-u4.md` 与 `reader-tests/...-u4.md` 均为未跟踪文件。

**卡点判定**

1. 页面主题与任务错配：cause=model。页面第 7 行定位是通用方法（说清目标、保留行为、给起点），任务卡也已指定 README、源码与测试为工作材料；读者把“页面不含协议规格”记为页面缺口，是归因偏差，页面内容无需改。
2. 第 16 行测试不覆盖 page：cause=model。9 项通过、结论与源码一致；页面只承诺验证检查器行为，没有承诺覆盖 page 协议。读者自合成输入补边界是正确做法。
3. 检查点模板未讲 ref 稳定性与缺失目标：cause=model。这两点属协议层，页面不负责；且页面第 69 行模板第 2 项已写“仓库、分支、基线 commit”，读者“没区分固定 commit 与分支 ref”的说法不成立。
4. `/tmp` 的 FileNotFoundError：cause=model。读者已自认，复现一致。
5. 产物命名：cause=page。任务卡（派发文档，非所附页面）未规定同一 reader-test id 后续单元的产物文件名；读者按不覆盖前序证据另写 `result-u4.md` 合理，但严格落在“只新增 result.md”写域之外。

**读者未意识到的错误**

- 最小卡用 `status: draft` 表示“保持未入队”，但 README 与 operations 未定义 draft；“未入队”实际由放在仓外、未提交到可发现分支保证。读者把它归入“以上是 README 的规定”，示例并非严格按现行协议。
- “实现只有文档，没有代码”说过头：本仓无 page 解析代码，但 README 明说接收端负责附入，接收端实现不在仓内；应写“本仓无实现，接收端侧不可观察”。
- 卡点 3 称页面“没区分固定 commit 与分支 ref”，与页面第 69 行模板第 2 项不符（已并列“分支、基线 commit”）。
- `page: ../../etc/passwd` 只作“头字段不校验”的例子，0 错误即收；未指出它越出仓库、检查器不拦、接收端行为未知，属协议与检查缺口。
- 结论句“页面没有写错”超出实际核验范围：只复跑了第 16 行测试与检查器行为，其余上下文管理断言未验；应限定为“未发现与本任务相关的错误”。

**总评**

仓库侧验收（受检 commit、page ref、协议位置、最小卡、边界、证据分级、检查点）均已做成，复跑一致；除上述 missed 外未发现虚报。taskDone：是。选页与产物命名问题属任务卡／派发层：后续卡片宜写明“同名 reader-test 后续单元的产物文件名”，并明确 reader-test 所选页面是否必须能教读者做成本任务。
