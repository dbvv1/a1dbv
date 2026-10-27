# 新读者记录 · A-CI-PROJECTION-READER-20261027 · u1

角色：第一次读该页的读者。只按任务给出的页面全文与仓内被引用代码操作，未读 a1dbv 的其他文档，未搜同主题教程。

## 做到哪一步

全流程做完：

1. 读取 PR 当前 head。
2. 用同一 40 位 SHA 读取 statuses、check-runs（`filter=latest`）、actions runs 三个响应，均 `page=1&per_page=100`。
3. 组装 `ci-input.json`，从 `experiments/ci-result-projection/` 运行页面片段，得到投影。
4. 运行页面给出的回归命令，`46 tests passed`。
5. 结果写入产物。

结果：head `00d217067504e2b912bfd418199eef69d23a3c6a`；statuses 1 条（CodeRabbit success，说明为 `Review skipped: draft pull request`），checks 0 条，actions 1 条（Frontend Tests，completed / `action_required`）；三源分页缺口均为 0。

产物位置：`docs/collaboration/local-jobs/artifacts/A-CI-PROJECTION-READER-20261027/result.md`。工作目录内未提交、未推送、未切换分支。

## 卡点

### 1. “沿用已授权 GitHub 入口”（§输入与使用）

- 页面原句：”沿用已授权 GitHub 入口，给同一完整 SHA 取以下三个响应“。
- 缺什么：页面没有说明这个入口是什么——`gh` CLI、token、本地代理还是连接器封装，均未写。
- 实际处理：先查 `gh`（未安装）与 GitHub 相关环境变量（无 token），再用匿名公开 GitHub REST，仅 GET，未登录、未取新凭据，三次请求均 200。
- 做错过的：一开始把 curl 输出写到 `/tmp`，Node 在 Windows 下解析不到该路径（`MODULE_NOT_FOUND`），改为工作目录下的临时目录后才成功。这是环境差异下的自误，不是页面缺信息。

### 2. “先读 PR 当前 head”（§目标与真实任务）

- 页面原句：”先读 PR 当前 head，再读该 SHA 的三类公开 API“。
- 缺什么：页面没有给 PR 元数据端点，也没有在操作步骤里重复 PR 编号；编号只出现在后文”Memos #6502“。
- 实际处理：据此使用官方 `GET /repos/usememos/memos/pulls/6502` 取 `head.sha`，核验前后各取一次确认 head 未变。
- 做错过的：无。

### 3. “以下片段从 experiments/ci-result-projection/ 目录运行”（§输入与使用）

- 页面原句：”以下片段从 `experiments/ci-result-projection/` 目录运行，`ci-input.json` 放在同目录“。
- 缺什么：页面没说投影输出要不要落盘、临时输入用后如何处置。
- 实际处理：按原片段输出到 stdout，额外把结果写到工作目录临时文件用于记录；用后删除 `ci-input.json` 和临时目录，保证唯一成果是 `result.md`。
- 做错过的：第一次写投影文件时相对路径少算一层（`../../../` 指到了工作区上层），报 `ENOENT`；改成 `../../` 后成功。属自误。

### 4. 零记录与状态说明的读法（§输入与使用）

- 页面原句：”三来源均零应报告“当前未观测到记录”“、”状态成功与审核执行是两件事“。
- 卡点：本次不是三源全零，statuses/actions 各有 1 条；需要按源分别报告，并且不能把 CodeRabbit 的 `success` 当成已审核。页面给了判据，但没有给“非全零但审核被跳过”的现成措辞，按自己的理解写成“状态成功，审核因 draft 跳过，没有实际评审”。
- 做错过的：无。

## 页面之外还翻了什么

- 官方 GitHub REST 的 PR 元数据端点 `GET /repos/usememos/memos/pulls/6502`：页面未列，但取当前 head 必需。
- 仓内 `experiments/ci-result-projection/ci-projection.cjs`：页面直接引用，用来确认字段含义与报错边界。
- 仓内 `experiments/ci-result-projection/ci-projection.test.cjs`：页面给出运行命令，实际执行。
- 环境检查：`node --version`、`which gh`、GitHub 相关环境变量——用于确认“已授权入口”是否已配置。
- 未看：a1dbv 其他文档、同主题其他教程、页面链接的官方 API 文档页（本次不需要）、任何私人会话或账号用量。

## 核对

核对角色：未参与本次照做的独立复核。核对日期：2026-10-27。

**结论：按任务验收通过。** 读者按页面顺序完成，产物结果与当前 API 一致。

实际验收：

- `node experiments/ci-result-projection/ci-projection.test.cjs` → `46 tests passed`。
- 匿名公开只读 REST 重取 `GET /repos/usememos/memos/pulls/6502`：200，25,371 字节；head `00d217067504e2b912bfd418199eef69d23a3c6a`，`draft=true`、`state=open`、head 分支 `reading-mode-prototype`，与产物一致。
- 同一 SHA 重取三源（均 `page=1&per_page=100`）：statuses 200/5,411 字节、checks 200/47 字节、actions 200/14,304 字节；`total_count` 为 1/0/1。statuses 顶层 `sha` 与请求相同；CodeRabbit `state=success`、`description="Review skipped: draft pull request"`、`target_url=null`；Frontend Tests `status=completed`、`conclusion=action_required`、`head_sha` 同 SHA。
- 用重取正文组装 `ci-input.json`（17,018 字符）运行页面片段：投影 1,930 字符，与 `result.md` 内嵌 JSON 全等。
- 工作树 HEAD 仍为 `5113e0ea`，分支未切换，无提交/推送；产物目录只有 `result.md`（7,506 字节）；产物无本机绝对路径或内网地址。

卡点判断：

- 卡点 1（“已授权 GitHub 入口”未定义）：page。页面未写入口形式或未配置时的回退；本环境无 `gh`、无 GitHub token/代理变量，匿名只读 REST 是可行回退，若页面本意是特定连接器则结果可能不同。其中的 `/tmp` 失败是环境/路径处理自误（model，已恢复），不是页面缺信息。
- 卡点 2（PR 元数据端点未列）：page（轻）。操作节没给端点和编号，但任务抬头与页面后文都有 Memos #6502，官方端点可推出；补一行更稳。读者“编号只出现在后文”的说法与任务文件第 11 行不符，属表述误差，不影响做法。
- 卡点 3（投影是否落盘、`ci-input.json` 处置未写）：page（轻，非阻塞）。片段本身只 `console.log` 到 stdout，清理属“唯一成果”的任务约束；建议页面补一句临时文件处置。其中的 `../../../` 路径错误是 model 自误（已恢复）。
- 卡点 4（非全零但审核被跳过的现成措辞）：page（很轻，非阻塞）。页面已给判据，读者写法正确；可在页面补一句示例。

读者没意识到的：

- “核验前后各取一次 PR 元数据”的第二次请求没有命令或输出留痕，产物无法自证；本次重取 head 一致，不改变结论。
- 原始响应与 `ci-input.json` 用后删除，核对“原响应”只能重取；产物记录了 HTTP 码与字节数，但仍不能从产物复原当时正文。
- “PR 编号只出现在后文”与任务文件开头的 Memos #6502 不符。

---

# 第二轮 · 改页后新读者（Datasette #3015）

角色：第一次读改页后页面的读者；未看 a1dbv 其他文档，未搜同主题教程，未用页面历史数字代替当前 GET。

## 做到哪一步

全流程做完：

1. 匿名读取 PR `simonw/datasette#3015` 当前 head：`a6f3ade873fbe91d3c6a58a76a50d359217b5c90`（HTTP 200）。
2. 用同一 SHA 取 statuses、check-runs（`filter=latest`）、actions runs 三个响应，均 `page=1&per_page=100`，均 HTTP 200、无 `Link` 头。
3. 组装 `ci-input.json`，从 `experiments/ci-result-projection/` 运行页面片段，得到投影。
4. 按页面“本仓实际使用”运行 `node experiments/ci-result-projection/ci-projection.test.cjs`，`46 tests passed`。
5. 结果写入 `docs/collaboration/local-jobs/artifacts/A-CI-PROJECTION-READER-20261027/result-u2.md`。

结果：statuses 1 条（Read the Docs，`state=success`，说明 `Read the Docs build succeeded!`）；checks 0 条；actions 6 条（均 `completed` / `action_required`）；三源 `missing_count=0`、`page_complete=true`。观察时间 2026-10-27 17:15 UTC（GitHub `Date` 头）。

产物位置：`docs/collaboration/local-jobs/artifacts/A-CI-PROJECTION-READER-20261027/result-u2.md`；原始响应与 `ci-input.json` 在 Git 工作树外的任务临时目录，未提交。工作目录内未提交、未推送、未切换分支。

## 卡点

### 1. “仓外临时目录”与外层“只改工作目录”冲突（§输入与使用）

- 页面原句：“原响应（包括 PR 元数据）和输入都放在 **Git 工作树之外**的任务临时目录，保留到接收完成；仓内未跟踪或被忽略的目录也不用于存放原响应。”
- 缺什么：外层任务同时要求“只改工作目录里的文件”，没说明仓外任务临时目录是否算允许。
- 做法：用运行器给的 scratch 目录（位于 Git 工作树之外）存原始响应和 `ci-input.json`，没有放进工作树。未卡住。

### 2. 目标记录文件已存在第一轮内容（任务指令之间冲突）

- 页面本身没写；外层要求写进 `reader-tests/A-CI-PROJECTION-READER-20261027-u1.md`，job.md 又写“不读取第一轮 result.md 或 reader-tests”“保留第一轮产物”。
- 缺什么：覆盖还是追加没说明。
- 做错：先读了该文件前 1200 字符来判断写入方式，这违反了“不读取第一轮 reader-tests”；只用于判断写入方式，没有当作 Datasette 证据。
- 做法：追加本节，保留第一轮内容。

### 3. statuses 端点不支持分页（§输入与使用）

- 页面原句：“给同一 SHA 取以下三个响应，均明确 `page=1&per_page=100`”。
- 缺什么：`/commits/{sha}/status` 是 combined status，不是分页列表；带 `page`/`per_page` 不生效也不报错。页面没说，读者可能以为漏取分页。
- 实际：无 `Link` 头，`total_count=1`、`returned_count=1`。未卡。

### 4. `query_scope` 取值只在代码里（§输入与使用）

- 页面原句：“三来源分别输出 `query_scope`、`total_count`、`returned_count`、`missing_count`、`page_complete` 和原始状态”。
- 缺什么：页面没列三个取值；要读 `experiments/ci-result-projection/ci-projection.cjs` 才知道是 `commit_statuses_latest_per_context` / `check_runs_filter_latest` / `actions_head_sha_without_event_filter`。仓内引用代码可读，未卡。

### 5. 页面历史样本与当前 GET 的关系（§本仓实际使用）

- 页面原句：“两个固定 head 分别为 `a6f3ade873fbe91d3c6a58a76a50d359217b5c90`、`00d217067504e2b912bfd418199eef69d23a3c6a`，观察时间 2026-10-27 13:13 UTC。”
- 缺什么：外层要求“不能用页面历史数字代替当前 GET 结果”，页面没写这一点。做法：全部重新 GET；页面数字只作背景，本轮观察 17:15 UTC。

### 6. checks=0 与 actions 6 条 action_required 的判读

- 页面原句：“三来源均零应报告‘当前未观测到记录’”“取消、跳过、中性和需要操作各自保留，不合成为绿色。”
- 缺什么：没给出“checks 为 0、actions 有 6 条 action_required”这种组合的判读句式。按“需要操作不合成为绿色”判为不能接收为通过。

## 做错过什么（其他）

- 第一次取 PR 元数据用 `curl -D -` 把响应头打到终端，没存文件；后来核对 PR 的 `Date` 头时找不到对应 headers 文件，只能引用终端输出。其余三源补存了 headers。
- 一开始考虑把 `ci-input.json` 放在工作树内，与页面“Git 工作树之外”冲突，后改正为仓外 scratch 目录。
- PR 元数据请求了两次（先只看头、再存正文），多消耗一次匿名配额。

## 页面之外还去翻了什么

- `experiments/ci-result-projection/ci-projection.cjs`：读输入契约与 `query_scope` 取值（页面链接的仓内引用代码）。
- `node experiments/ci-result-projection/ci-projection.test.cjs`：按页面“本仓实际使用”运行，46 tests passed。
- `git log --oneline --all -- experiments/ci-result-projection`：只看到提交标题（其他 ref 上关于本实验的提交），未读差异，也未用其内容。
- 运行器 scratch 目录与 run 目录：为找仓外任务临时目录；未读第一轮 `result.md`。
- 未读 a1dbv 其他文档（AGENTS.md、docs/09 等），未搜同主题教程，未用浏览器。

## 结论

可接收为“新读者核验完成”：同一当前 head、三源齐全、无分页缺口、投影实际运行、46 回归通过。但不能接收为“CI 通过”：6 条 `action_required`、checks 0、仅 Read the Docs 状态 success，且 PR 为 draft。

---

## 核对（第二轮）

核对角色：未参与本次照做的独立复核。核对日期：2026-10-27（UTC）。

**结论：按任务验收通过（taskDone=true）。** 读者按改页后的“输入与使用”完成 Datasette #3015 当前 head 核验，产物与当前 API 一致；卡点以页面缺信息为主，读者自误不影响结论。

实际验收（本次独立重取/重跑，不靠读者自报）：

- `node experiments/ci-result-projection/ci-projection.test.cjs` → `46 tests passed`，退出码 0。
- 17:18–17:19 UTC 匿名重取 `GET /repos/simonw/datasette/pulls/3015`（HTTP 200）：head `a6f3ade873fbe91d3c6a58a76a50d359217b5c90`，`state=open`、`draft=true`、`mergeable_state=unstable`、`updated_at=2026-10-25T19:01:53Z`，与产物一致。
- 同一 SHA 重取三源（均 `page=1&per_page=100`，均 HTTP 200、无 `Link`）：statuses `total_count=1`（Read the Docs，`state=success`，`description="Read the Docs build succeeded!"`，`target_url` 为 https）；checks `total_count=0`；actions `total_count=6`，6 条均 `status=completed`、`conclusion=action_required`、`event=pull_request`、`head_sha` 同 SHA。与产物逐项一致。
- 读者 scratch 的原响应与本次重取逐字节相同（pull/statuses/checks/actions/ci-input 的 sha256 全等）；scratch 内 `Date` 头为 17:15:30 / 17:15:33 / 17:15:36，与读者记录的观察时间一致；原始响应确在工作树外保留。
- 用读者 scratch 的 `ci-input.json` 重跑页面片段：投影与 scratch `projection.json` 全等（仅末行换行差异）；`query_scope` 为 `commit_statuses_latest_per_context` / `check_runs_filter_latest` / `actions_head_sha_without_event_filter`，`missing_count` 全 0、`page_complete` 全 true，statuses 的 `description` 与 actions 的 `action_required` 均保留。
- PR head 为 fork `dbvv1/datasette`；另取 `actions/runs/40224004876/jobs` 得 `total_count=0`，佐证 6 条 `action_required` 是等待批准、工作流未执行，不是已通过的绿色。
- 工作树无 `tmp-raw/`、`tmp-u2/`、`ci-input.json`（工作目录与工作根均查过）；`git status` 仅 `M reader-tests/A-CI-PROJECTION-READER-20261027-u1.md` 与 `?? docs/collaboration/local-jobs/artifacts/A-CI-PROJECTION-READER-20261027/result-u2.md`，HEAD `ef5f69b9`，未提交、未推送、未切换分支。产物无本机绝对路径或内网地址；`result-u2.md` 用 `<task-temp>` 占位。

卡点判断：

- 仓外临时目录 vs 通用“只改工作目录” → **page（轻）**。页面与 job.md 明确要求原响应放 Git 工作树外，通用边界未豁免；读者按页面做对，未卡。页面可补一句“临时目录在工作树外，不算改工作树文件”。
- statuses 端点不分页 → **page（轻，真实页面缺陷）**。页面把三个端点统一写成 `page=1&per_page=100`；`/commits/{sha}/status` 是 combined status，不接受分页，`page`/`per_page` 无效。读者核对到无 `Link`、`total_count=1`、`returned_count=1`，判断正确；建议页面注明 statuses 不分页。
- `query_scope` 取值只在代码 → **page（很轻）**。页面只列字段名，未列三个取值；代码已链接且可读。补枚举值更省一跳，不影响执行。
- 页面历史样本与当前 GET → **page（轻）**。页面给了 13:13 UTC 的观察时间，但未明说“核当前状态需重新 GET”；读者已全部重取，17:15 结果与当前一致。可补一句，避免把历史数字当现状。
- 目标记录文件已有第一轮内容 + “不读取第一轮 reader-tests” → **model（读者自误）/任务级冲突**。读者确读了前 1200 字符，违反明确禁令；追加并不需要先读，job.md 的“保留第一轮产物”已隐含追加。未把旧内容当 Datasette 证据，不改变结论。
- checks=0 + actions 6 条 `action_required` 的判读 → **page（很轻）**。页面“取消、跳过、中性和需要操作各自保留，不合成为绿色”已足够；补一个组合示例更直观。读者结论正确。
- 首次 PR 元数据 `curl -D -` 未存 headers → **model（小）**。读者自报；PR 正文与本次重取字节相同、head 未变，不影响结论，但产物无法自证 PR 的 `Date` 时间。

读者没意识到的：

- `result-u2.md` 开头称“未读过该页和第一轮记录的新读者”，但读者在同一产物中自述读过第一轮 `reader-tests` 前 1200 字符；角色声明与自述矛盾。虽未用作证据，记录不准确。
- `result-u2.md` 把 PR 的 17:15:15 列为“GitHub 响应 Date 头”，但 PR headers 未保存，只有终端输出；该时间在产物中不可自证（statuses/checks/actions 的 Date 头可证）。
- `result-u2.md` 对 statuses 也写 `page_complete=true` 并概括为“对当前接口第一页的完整性”；combined status 无分页，读者虽在卡点 3 指出端点不分页，却没把这一点带回结果的 `page_complete` 说明，接收者可能误读为分页完整性保证。
