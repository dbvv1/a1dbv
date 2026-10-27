# A-CI-PROJECTION-READER-20261027 · u2 结果（Datasette #3015 新读者核验）

状态：已接收 CI 观测与命令可用结果；严格新读者验收未通过。

读者最初按新读者任务执行，但随后自报读取第一轮 reader-tests 前 1200 字符；本轮不能作为未接触旧记录的独立读者证据。原始回包和复核见 [8e9421c](https://github.com/dbvv1/a1dbv/commit/8e9421c94f75915b764437d0cc416973c9cf5d11)。

观察时间：读者回报 2026-10-27 17:15 UTC，三源头时间为 17:15:30、17:15:33、17:15:36。PR 头未保存，17:15:15 只有终端观察自报。dot-A 于 17:45–17:46 UTC 独立重取同一 head 和三源并运行改页后的命令，下面的数量、状态与说明一致。

## 核验对象与精确 head

- PR：[simonw/datasette#3015](https://github.com/simonw/datasette/pull/3015)，`state=open`，标题 `Draft: opt-in integer bindings for SQL query parameters`，`mergeable_state=unstable`，`updated_at=2026-10-25T19:01:53Z`。
- `GET /repos/simonw/datasette/pulls/3015` → HTTP 200。
- `head.sha` = `a6f3ade873fbe91d3c6a58a76a50d359217b5c90`。与本页记载的固定 head 相同；下方数值全部来自本轮当前 GET，不引用页面历史数字。

## 实际命令

匿名 REST GET，无登录、无凭据；原始响应保存在 Git 工作树之外的 `<task-temp>`，仅匿名 `User-Agent`：

```sh
SHA=a6f3ade873fbe91d3c6a58a76a50d359217b5c90
curl -sS -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" -H "User-Agent: a1dbv-reader-test" \
  "https://api.github.com/repos/simonw/datasette/pulls/3015" -o "<task-temp>/pull.json"

curl -sS -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" -H "User-Agent: a1dbv-reader-test" \
  "https://api.github.com/repos/simonw/datasette/commits/$SHA/status?page=1&per_page=100" -o "<task-temp>/statuses.json"

curl -sS -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" -H "User-Agent: a1dbv-reader-test" \
  "https://api.github.com/repos/simonw/datasette/commits/$SHA/check-runs?filter=latest&page=1&per_page=100" -o "<task-temp>/checks.json"

curl -sS -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" -H "User-Agent: a1dbv-reader-test" \
  "https://api.github.com/repos/simonw/datasette/actions/runs?head_sha=$SHA&page=1&per_page=100" -o "<task-temp>/actions.json"
```

组装 `ci-input.json`（键为 `sha`、`statuses`、`checks`、`actions`）后，按页面片段运行：

```sh
node -e "const fs = require('node:fs'); const {projectCI} = require('./ci-projection.cjs'); const input = JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); console.log(JSON.stringify(projectCI(input.sha, input), null, 2));" "<task-temp>/ci-input.json"
```

工作目录：`experiments/ci-result-projection/`。

## HTTP 结果与三源原始状态

三个响应均 HTTP 200；均无 `Link` 头，未取后续页。

| source | 端点（同一 SHA，`page=1&per_page=100`） | total_count | returned_count | missing_count | page_complete | 原始状态 |
| --- | --- | --- | --- | --- | --- | --- |
| statuses | `/commits/{sha}/status` | 1 | 1 | 0 | true | 合并状态 `state=success` |
| checks | `/commits/{sha}/check-runs?filter=latest` | 0 | 0 | 0 | true | 无记录 |
| actions | `/actions/runs?head_sha={sha}` | 6 | 6 | 0 | true | 6 条均 `status=completed`、`conclusion=action_required` |

必要字段：

- statuses（1 条）：`context=docs/readthedocs.org:datasette`，`state=success`，`description=Read the Docs build succeeded!`，`sha` 与请求一致，`target_url` 为 https。
- checks（0 条）：`total_count=0`，投影 `observation=no_records_observed`。
- actions（6 条，均 `event=pull_request`、`head_sha` 与请求 SHA 一致）：
  - `Test`（completed / action_required）
  - `Playwright`（completed / action_required）
  - `Check JavaScript for conformance with Prettier`（completed / action_required）
  - `Test in Pyodide with shot-scraper`（completed / action_required）
  - `Test SQLite versions`（completed / action_required）
  - `Check spelling in documentation`（completed / action_required）

投影输出的 `query_scope` 分别为 `commit_statuses_latest_per_context`、`check_runs_filter_latest`、`actions_head_sha_without_event_filter`；statuses 的 `description` 与 actions 的 `action_required` 均原样保留。

回归：`node experiments/ci-result-projection/ci-projection.test.cjs` → `46 tests passed`，退出码 0。

## 结论

- 投影片段可运行，输出与当前 GET 一致；三源 `missing_count=0`、`page_complete=true`。该字段只表示对当前接口第一页的完整性，不是合入资格，也不覆盖 GitHub 查询上限或必需检查规则。
- **不能把该 head 的 CI 接收为“通过/绿色”**：6 条 Actions run 全部是 `action_required`，`checks` 为 0，唯一的 success 是 Read the Docs 构建状态。具体所需操作须看相应工作流页面；这些字段不能单独确定六条都因等待批准而未执行。
- 可接收的表述是“已核验：当前 head 有 6 条 action_required，不能报告 CI 全绿”。
- 仓外输入命令已由 dot-A 重放通过；公开扫描卡点没有通过放宽检查解决。读取旧记录造成的新读者条件缺失仍保留，不提升页面状态。

## 接收时校正

- 回包把 combined status 说成不支持分页，这是错误判断。[GitHub 官方参数](https://docs.github.com/en/rest/commits/statuses#get-the-combined-status-for-a-specific-reference)明确列出 `per_page`（最大 100）和 `page`。单条结果、没有 Link 头不足以推翻该契约，页面的三源第一页要求保持原样。
- 原始复核称任务完全通过，但同时指出读者看过旧记录、PR 头时间缺证据。接收范围按上述实证收窄；46 项测试是夹具回归，实际 API 核验另由本次重取支持。

## 保留与合规

- 原始响应（含 PR 元数据）与 `ci-input.json` 保存在 Git 工作树之外的 `<task-temp>`，保留到接收完成；未提交原响应或整份元数据。
- 本工作树 `experiments/ci-result-projection/` 下没有 `tmp-raw/`、`tmp-u2/` 或 `ci-input.json`，本轮“移出工作树”无可移动对象。
- 未提交、未推送、未切换分支；未登录、未查找凭据、未用浏览器/GUI。
