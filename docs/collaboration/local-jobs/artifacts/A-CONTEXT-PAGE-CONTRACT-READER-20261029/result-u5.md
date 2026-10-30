# U5 独立读者：新 page 输入合同仓库侧验收

本文件是 u5 单元（首次读页、独立新上下文）的新增产物。任务卡写域只写「新增 `result.md`」，没有规定同名 reader-test 多单元的产物名；u1 的 `result.md`、u4 的 `result-u4.md` 保持不动，按前例另写 `result-u5.md`。

## 结论

- **接收端本次附入的是固定 ref 的版本，不是默认 main 的版本。** 任务卡「页面全文」82 行、9971 字节、sha256 `700df4b6…`，与 `origin/dot-a/context-concise-reader-20261029`（`d0b9651b…`）的 `docs/decisions/context-management.md` 逐字节一致；`origin/main` 上的同名页是 149 行、18373 字节、sha256 `35cff5a0…`，内容不同。附入文本等于固定 ref 版本这一条可以直接观察；接收端内部如何取页、如何拼装任务卡不在仓库里，记未知。
- **现行写法的合法任务由 `docs/collaboration/local-jobs/README.md` 规定，不由检查器规定。** 任务头必填 `id`、`owner`、`status`、`target_repo`、`base_ref`、`result_branch`，可选 `accept`、`kind`、`page`；`page` 写 `<本仓路径>[@<分支或提交>]`，缺省 main，接收端把该页全文附给执行模型；正文只写目标、按哪个 Skill／规格做、写入范围、怎样算做成；未结束卡不超过 80 行。协议来源 `5561e38e…`，只改 README 第 5、13 行。
- **仓库检查器不核对 `page`。** `scripts/check_repo.py` 只查三类：直接位于 local-jobs 的 Markdown 活动卡行数、JSON／TOML 语法、Markdown 内联本地链接目标。合成卡把 `page` 指向不存在的页面、删掉 `page`、只留两个头字段，检查器一律 0 错误；9 项单测没有 `page` 用例。
- **默认 ref 的边界是「内容会换」，不是「目标缺失」。** 省略 `@` 时按 main 取页。本 worktree 的本地 `main` 落后 `origin/main` 651 个提交、没有 `docs/decisions/`，但接收端每次运行先 fetch main（README 第 7 行），实际 `origin/main` 与 base `5847ea53` 都有该页（149 行版本）。所以写 `page: docs/decisions/context-management.md` 不会取不到，而是取到与固定 ref 不同的版本；仓库里没有哪条规则提醒这种版本漂移。
- **缺失目标未规定。** 页面路径不存在或 ref 无法解析时，README、检查器、运行细则都没有处理规则。合成缺页卡在检查器下 0 错误；接收端会不会拦截、如何记卡点，仓库内没有证据，记未知。

## 受检对象

| 项 | 值 |
|---|---|
| worktree HEAD | `0e18010fa6fd78983cf2c915d55dab518dc819ef` |
| 任务卡 `base_ref` | `5847ea532dbf7437ca8c4865af031ce0d862a153`（已核为 HEAD 祖先，且是 `origin/main` 祖先） |
| 协议改动 commit | `5561e38e47b1a60166192660b15440a58c24e5ed`（`Let reader-test jobs name their page instead of pasting it`，只改 README 第 5、13 行，2 增 2 删） |
| page 引用 | `docs/decisions/context-management.md@dot-a/context-concise-reader-20261029` |
| page 固定 ref | `d0b9651b5db9039975d1abde4efe8f0cfd3a43b8`（`origin/dot-a/context-concise-reader-20261029` 尖端，2026-10-29） |
| page 固定版本 | 82 行 / 9971 字节 / sha256 `700df4b6d6e9a3fa85610b2f58bf042be663e2f1fa2a9527fb4f9efbe58d4599` / blob `8a9cbae46f165b9f723f8cec960d1a20742ec9ce` |
| page 默认 main 版本 | 149 行 / 18373 字节 / sha256 `35cff5a013701ef0…` / blob `ecb9e2336803948b788f5b66b4fc43ecb7f1a654` |
| 附入全文 | 任务卡「页面全文」段 82 行，与固定版本逐字节一致 |

## 实现位置

- `docs/collaboration/local-jobs/README.md` 第 5 行：头字段与 `page` 格式（缺省 main、接收端附全文）、80 行上限；第 7 行：每次运行先 fetch main 与负责人分支；第 13 行：reader-test 用 `page` 指定页面、不把全文贴进任务、读者只记卡点不改页面、不用 `accept: auto`。
- `scripts/check_repo.py`：`record_limits` 第 28–36 行只处理直接位于 local-jobs 的活动卡行数；`check` 第 39–93 行只处理 `.md`／`.json`／`.toml`；第 80–89 行只扫内联本地链接；第 91–93 行自述「不查锚点、不查外链、不查事实」。全文没有 `page` 字段处理。
- `tests/test_check_repo.py` 第 22–23 行：存在的本地文件带缺失锚点、外链都不报错；第 63–71 行：80 行上限与终态豁免。没有 `page` 用例。
- `docs/collaboration/operations.md` §3 第 2 条：`reader-test` 读者只照页面做，非读者按验收核对并分清页面卡点。
- `scripts/validate_task.py`、`scripts/validate_relay.py` 是另一套 JSON 长任务／relay 记录校验器，不解析 local-jobs Markdown 卡；`scripts/check_public.py` 只做公开内容模式扫描；`scripts/check_execution_snapshot.py` 只复用 local-jobs 的 `target_repo` URL 身份。三者都不核对 `page`。

## 实际命令与退出结果

| 命令 | 退出 | 结果 |
|---|---|---|
| `python3 -m unittest discover -s tests -p 'test_check_repo.py' -v` | 0 | `Ran 9 tests ... OK` |
| `python3 scripts/check_repo.py` | 0 | `checked_files: 567`，`errors: []`（写入本单元两个新文件后） |
| `python3 scripts/check_public.py` | 0 | `checked_files: 993`，`findings: []` |
| 仓外合成根 `check()`：26 行最小合法卡（下节示例） | — | `checked_files: 1`，`errors: []` |
| 仓外合成根 `check()`：`page` 指向不存在页面 | — | `checked_files: 1`，`errors: []` |
| 仓外合成根 `check()`：删掉 `page`、只留两个头字段 | — | `checked_files: 1`，`errors: []` |
| 仓外合成根 `check()`：80／81 行活动卡 | — | 80 行无错；81 行报 `active job file has 81 lines (max 80)`；终态 `accepted` 豁免 |
| 仓外合成根链接探针：内联链接目标分别为 `b.md#missing-anchor`、`#local-anchor`、`no.md#x` | — | `b.md#missing-anchor` 与 `no.md#x` 报 `missing link target`；纯 `#local-anchor` 跳过 |
| `git cat-file -t origin/main:docs/decisions/context-management.md` | 0 | `blob`（默认 main 上有该页） |
| `git cat-file -e main:docs/decisions/context-management.md` | 128 | 本地 `main` 落后 651 个提交，无此路径 |
| `git rev-parse --verify dot-a/context-concise-reader-20261029` | 128 | 本 worktree 无字面分支引用 |
| `git rev-parse --verify origin/dot-a/context-concise-reader-20261029` | 0 | `d0b9651b…` |
| 附入全文 vs `d0b9651b` 文件 / vs `origin/main` 文件 | — | 与前者逐字节一致（82 行）；与后者不同（149 行） |

环境：Windows 原生，Python 3.13.5，git 2.56.0。非 0 的只有「字面分支名不存在」与「本地 main 落后」两条探针，不是检查器故障；接收端取页、ref 解析、缺页处理未运行、未观察，记未知。

## 最小 reader-test 卡示例（合成，未入队）

按 README 第 5、13 行写的最小卡，只放进本次独占的仓外临时目录做验证，没有写入 `docs/collaboration/local-jobs/`，也没有创建或发布 `ready` 任务。`page` 用 `docs/README.md@main`，因为该文件在 `origin/main` 上确实存在，便于说明「可解析」的样子。

```text
id: A-EXAMPLE-READER-002
owner: dot-A
status: ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5847ea532dbf7437ca8c4865af031ce0d862a153
result_branch: relay/example-reader-002
kind: reader-test
page: docs/README.md@main

# Example reader task

## Goal

Read the attached page and follow its method to reproduce a small check.

## Spec

Use the attached page only; record gaps instead of inventing context.

## Write scope

Add result.md on the result branch only.

## Done when

The actual command and its result are recorded.
```

验证范围：这张卡 26 行，`record_limits` 无报错，放进临时根后 `check()` 返回 `errors: []`。这只证明它满足检查器能查的部分——行数／状态、JSON／TOML、内联本地链接——不证明 `page` 指向的页面存在、ref 可解析或接收端会附全文。检查器完全不解析 `page`，所以「合法」在仓库侧只剩格式自检。

## 默认 ref、固定 ref 与缺失目标

- **默认 ref（省略 `@`）**：按 README 落到 main，接收端每次运行先 fetch main。fetch 后的 `origin/main` 与 base `5847ea53` 都有 `docs/decisions/context-management.md`，是 149 行的版本；任务卡意图的固定 ref 版本是 82 行的精简版，两者不同。误读点：本 worktree 的本地 `main` 落后 651 个提交、没有 `docs/decisions/`，只看本地 `main` 会误判成「默认目标缺失」。
- **固定 ref**：任务卡写 `@dot-a/context-concise-reader-20261029`。在本 worktree 里字面 `git rev-parse dot-a/...` 失败，只有 `origin/dot-a/...` 解析到 `d0b9651b…`；说明负责人分支名与本地 remote-tracking ref 之间需要接收端先 fetch 并加前缀（或等价解析）。这一步是接收端保证，仓库文本没有写解析规则。
- **缺失目标**：不存在的页面路径、无法解析的 ref，README 只说「缺省 main」，没有规定报错、回退还是照发。合成缺页卡在检查器下 0 错误，证明检查器不拦；接收端会不会拦、怎么记卡点，仓库内没有证据，记未知。合成输入已明确标为合成，不代表真实接收端故障。

## 文档规定 vs 检查器实际 vs 本次真实证据

| 问题 | 文档规定 | 检查器实际 | 本次真实证据 |
|---|---|---|---|
| 任务头与正文范围 | README 第 5 行：六个必填头字段 + 可选 `page` 等；正文四件事 | 只识别 `status` 与行数，不校验字段名／取值 | 19 行最小卡通过；只留两个头字段也 0 错误 |
| `page` 格式 | `<本仓路径>[@<分支或提交>]`，缺省 main | 无 `page` 代码路径 | 缺页卡、删 `page` 卡都 0 错误 |
| 全文附入 | 接收端把全文附给执行模型 | 仓库不检查 | 任务卡含 82 行全文，与固定 ref 逐字节一致，与 main 版本不同 |
| 80 行上限 | README 第 5 行；检查器检查 | `record_limits`：非终态且 >80 行报错 | 80 行通过、81 行报错、`accepted` 豁免 |
| 锚点与外链 | — | `urlsplit` 取 `path`，`#fragment` 被丢弃；纯 fragment 跳过；外链跳过 | 探针与 9 项单测一致 |
| 接收端解析 ref、缺页处理 | README 只写「接收端把该页全文附给执行模型」 | 不适用 | 未观察，未知 |

## 页面卡点与做错的地方

1. **页面没有覆盖本任务。** 页面「下面这项本仓任务可直接照做；换项目时换目标与入口。」引出的示例是「核对本仓文档检查器是否检查 Markdown 链接里的 `#锚点`」，而任务卡要求的是 page 输入合同验收。页面没有写两者的关系，也没有 page 字段、默认 ref、缺失目标、最小卡、接收端附入全文的验收方法。第一次读很容易把示例任务当成全部任务；我实际先按示例跑了锚点探针，确认它只覆盖验收里很小一块，真正的验收对象要靠 README、检查器和测试补齐。缺的是「页面与本次任务的对应关系」。
2. **页面「`check()` 与 `test_existing_and_external_links` 表明：检查本地文件存在，跳过 `#锚点` 与外链。」表述不够精确。** 实现是 `urlsplit` 丢掉 fragment，但仍检查 fragment 前的路径是否存在；纯 `#本地锚点` 与外链才整条跳过。带缺失锚点但文件存在的链接不报错；文件不存在的 `b.md#missing-anchor` 仍报 `missing link target`。工作目录里遗留的上一版 `result-u5.md` 把这个探针记成「`b.md#missing-anchor` 不报错」，与实跑不符；我复跑后改正。
3. **页面「已验证 9 项通过」可用。** 我复跑得到 `Ran 9 tests ... OK`，与页面一致；页面第 60 行给「检查器」与「测试」两个入口，直接对应任务卡要求的实现位置和验证命令。
4. **页面第 108–116 行的六项检查点模板可用。** 本文件的检查点直接套用，省去自己设计格式；页面「恢复时要求实际读取检查点与当前项目指令，先核最新约束和撤回项，再核 Git 状态、diff、产物与在途结果」也照做（开工时 `git status` 只有本单元新增文件）。
5. **任务卡产物命名缺口（不是页面缺口）。** 写域只写「新增 `result.md`」，没有规定同名 reader-test 多单元如何命名；u1 已占用 `result.md`、u4 另写 `result-u4.md`，本单元只能沿用为 `result-u5.md`。

## 检查点

1. **当前目标、完成条件、最新约束**：验收新 `page` 输入合同在仓库侧能做什么、哪些仍须接收端验证；完成条件是按任务卡验收给出证据并区分文档、检查器、真实执行。禁改页面、检查器、任务协议、长期规则、接收端和用户设置；不创建或发布 `ready` 任务；不提交、不推送、不切分支；临时输入只放仓外。
2. **仓库、分支、基线**：worktree 分支 `receiver/A-CONTEXT-PAGE-CONTRACT-READER-20261029`，HEAD `0e18010f…`，基线 `5847ea53…`；page 固定 ref `d0b9651b…`；未提交修改只有本文件与 `reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u5.md`。
3. **已确认事实、关键决定**：附入全文与固定 ref 逐字节一致、与 main 版本不同；协议在 README 第 5、13 行、来源 `5561e38e`；检查器无 `page` 处理；默认 main 有页但版本不同；字面负责人分支名需经 `origin/` 解析；缺页处理未规定。排除的旧说法：把本地落后 `main` 当成默认目标缺失、把带锚点链接整条当成跳过。
4. **已运行命令与结果**：见上表；9 项单测通过、全仓 567 文件 0 错误、公开扫描 993 文件 0 发现、合成卡／缺页卡／删 `page` 卡 0 错误、80／81 行边界与链接探针符合预期。
5. **在途任务与未知**：接收端取页、ref 解析与缺页处理未观察；页面全文如何拼进任务卡未观察；本轮未提交、未推送。
6. **下一步具体动作**：由非读者验证者复跑上表命令并核对本次任务卡全文；接收端补一条「`page` 解析失败／目标缺失」的处理规则与记录字段，并补「固定 ref 与默认 main 版本不同时如何提示」；任务卡补单元产物命名规则。

## 约束

未修改页面、检查器、任务协议、长期规则、接收端和用户设置；未创建或发布 `ready` 任务；未提交、未推送、未切换分支；合成输入只在本任务独占的仓外目录；本文件在上一版未跟踪草稿上改写，与 `reader-tests/A-CONTEXT-PAGE-CONTRACT-READER-20261029-u5.md` 同为本次新增文件。
