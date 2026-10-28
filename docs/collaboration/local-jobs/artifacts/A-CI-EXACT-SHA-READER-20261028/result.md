# A-CI-EXACT-SHA-READER-20261028 结果

观察时间：2026-10-28 02:26 UTC（三个响应 `Date` 头分别为 02:26:12Z、02:26:16Z、02:26:18Z）。

- 仓库：`dbvv1/a1dbv`（公开）
- 固定完整 SHA：`a0c0d31501b3a86fba85962959da41c0bfb8794d`
- 方式：匿名 GitHub REST GET，未登录、未使用任何凭据或连接器包装对象。

## 实际命令

三个请求均明确 `page=1&per_page=100`，未加 state/event 过滤：

```sh
curl -sS -D status.headers -o status.json \
  "https://api.github.com/repos/dbvv1/a1dbv/commits/a0c0d31501b3a86fba85962959da41c0bfb8794d/status?page=1&per_page=100"
curl -sS -D checks.headers -o checks.json \
  "https://api.github.com/repos/dbvv1/a1dbv/commits/a0c0d31501b3a86fba85962959da41c0bfb8794d/check-runs?filter=latest&page=1&per_page=100"
curl -sS -D actions.headers -o actions.json \
  "https://api.github.com/repos/dbvv1/a1dbv/actions/runs?head_sha=a0c0d31501b3a86fba85962959da41c0bfb8794d&page=1&per_page=100"
```

三份正文按 `sha`、`statuses`、`checks`、`actions` 组装为仓外 `ci-input.json`，再进入 `experiments/ci-result-projection/` 运行页内 `projectCI` 命令，最后一个参数为仓外输入的绝对路径并保留双引号。原响应、输入与 HTTP 分页头均保存在 Git 工作树之外的任务临时目录，保留到接收完成，未提交。

## 三来源结果

| 来源 | HTTP | total_count | returned_count | missing_count | page_complete | observation | 原始状态与说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| statuses | 200 OK | 0 | 0 | 0 | true | no_records_observed | `combined_state=pending`，`statuses` 为空；`sha` 与固定 SHA 一致 |
| checks | 200 OK | 0 | 0 | 0 | true | no_records_observed | `check_runs` 为空 |
| actions | 200 OK | 0 | 0 | 0 | true | no_records_observed | `workflow_runs` 为空 |

- 三个响应均无 `Link` 头，即没有后续页；每个接口的 `total_count` 都是 0，就各接口自报总数而言第一页已完整。
- statuses 的 `pending` 是 combined status 在没有任何 status 记录时的固定返回，应读成“当前没有 status 记录”，不能读成“CI 正在排队”。投影把 `combined_state` 与 `observation` 分开保留。
- 三来源 `items` 均为空，没有名称、`description` 或检查链接可保留，也没有可点链接。
- 逐源核对：total_count 与 returned_count 相等且 `missing_count=0`，`page=1`、`per_page=100`；没有发现需要取后续页的缺口。

## 结论与未验范围

截至观察时间，该精确 SHA 在三个接口都没有观测到 CI 记录（`no_records_observed`）。这既不是通过，也不是“CI 正在排队”。

仍未知、本结果不覆盖的范围：GitHub 查询上限（check suites 只看最近 1,000 个、Actions runs 列表的查询上限）、未接入这三个接口的其他 CI、分支保护与必需检查规则，以及该提交按预期是否应当产生 CI。`page_complete` 只比较当前接口的总数与返回数，不能等同“全部必需检查完整”。本结果不判断能否合入。

## 投影与回归

- 投影输出 SHA 与输入一致，三来源 `missing_count` 均为 0。
- 按页内无缩进 `JSON.stringify` 口径复算：输入 4,252 字符，投影 924 字符。
- 页内回归 `node experiments/ci-result-projection/ci-projection.test.cjs`：`46 tests passed`，退出码 0。
