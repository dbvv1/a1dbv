# A-CI-PROJECTION-READER-20261027 · 上游 CI 核验结果

观察时间：2026-10-27T13:42Z。对象：usememos/memos PR #6502。

## 结论

- 精确 head：`00d217067504e2b912bfd418199eef69d23a3c6a`（PR 状态 open，draft=true，head 分支 `reading-mode-prototype`）。核验前后各取一次 PR 元数据，head 未变化。
- statuses：`state=success`，`total_count=1`，返回 1 条；CodeRabbit 记录 `state=success`，`description="Review skipped: draft pull request"`，无可用链接（`null`）。无分页缺口。
- checks：`total_count=0`，返回 0 条，投影为 `no_records_observed`。
- actions：`total_count=1`，返回 1 条；Frontend Tests（`pull_request`）`status=completed`、`conclusion=action_required`。无分页缺口。

按页面的读法：

- **状态成功与审核执行是两件事。** CodeRabbit 的 `state` 是 success，但说明写明因 draft PR 跳过审核，即没有实际评审结果可读。
- **`action_required` 保留原始终态**，没有合成为绿色；该 run 等待人工动作，不是成功。
- **checks 零记录**读作“当前未观测到记录”，不推断为排队或通过。
- 三来源并非全零（statuses 与 actions 各有 1 条），因此不套用“三来源均零”的表述。
- 页面提醒的边界仍成立：`page_complete` 只对照各接口上报的总数；GitHub 查询上限、未接入的 CI 和必需检查规则不在该判断内。

## 实际命令与返回

入口：匿名公开只读 GitHub REST API（未登录、未使用 token，仅 GET）。工作目录为仓库根。

读取 PR 当前 head：

```sh
curl -sS -m 20 -H 'Accept: application/vnd.github+json' \
  https://api.github.com/repos/usememos/memos/pulls/6502 -o .reader-tmp/pr.json \
  -w '%{http_code} %{size_download}\n'
```

返回 `200 25371`。取到 head `00d217067504e2b912bfd418199eef69d23a3c6a`、`draft: true`、`state: open`。完成前复取一次，返回 `200`，head 相同。

同一完整 SHA 的三源，均 `page=1&per_page=100`：

```sh
SHA=00d217067504e2b912bfd418199eef69d23a3c6a
curl -sS -m 30 -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2022-11-28' \
  "https://api.github.com/repos/usememos/memos/commits/$SHA/status?page=1&per_page=100" \
  -o .reader-tmp/statuses.json -w '%{http_code} %{size_download}\n'      # 200 5411
curl -sS -m 30 -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2022-11-28' \
  "https://api.github.com/repos/usememos/memos/commits/$SHA/check-runs?filter=latest&page=1&per_page=100" \
  -o .reader-tmp/checks.json -w '%{http_code} %{size_download}\n'        # 200 47
curl -sS -m 30 -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2022-11-28' \
  "https://api.github.com/repos/usememos/memos/actions/runs?head_sha=$SHA&page=1&per_page=100" \
  -o .reader-tmp/actions.json -w '%{http_code} %{size_download}\n'       # 200 14304
```

原始响应中的必要字段：

- statuses：`{"state":"success","sha":"00d2170…","total_count":1,"statuses":[{"id":57211940898,"context":"CodeRabbit","state":"success","description":"Review skipped: draft pull request","target_url":null,"created_at":"2026-10-25T18:21:18Z","updated_at":"2026-10-25T18:21:18Z"}]}`
- checks：`{"total_count":0,"check_runs":[]}`
- actions：`{"total_count":1,"workflow_runs":[{"id":40220835403,"name":"Frontend Tests","event":"pull_request","status":"completed","conclusion":"action_required","head_sha":"00d2170…","head_branch":"reading-mode-prototype","run_attempt":1,"created_at":"2026-10-25T18:21:12Z","updated_at":"2026-10-25T18:21:12Z","html_url":"https://github.com/usememos/memos/actions/runs/40220835403"}]}`

将三份正文组装为键 `sha`/`statuses`/`checks`/`actions` 的紧凑 JSON（`ci-input.json`，17,018 字符），从 `experiments/ci-result-projection/` 目录运行页面片段：

```sh
cd experiments/ci-result-projection && node -e "
const fs = require('node:fs');
const {projectCI} = require('./ci-projection.cjs');
const input = JSON.parse(fs.readFileSync('ci-input.json', 'utf8'));
console.log(JSON.stringify(projectCI(input.sha, input), null, 2));
"
```

输出为下方投影（1,930 字符）。

回归：

```sh
node experiments/ci-result-projection/ci-projection.test.cjs
```

返回 `46 tests passed`。

## 投影原样输出

```json
{
  "sha": "00d217067504e2b912bfd418199eef69d23a3c6a",
  "sources": [
    {
      "source": "statuses",
      "sha": "00d217067504e2b912bfd418199eef69d23a3c6a",
      "query_scope": "commit_statuses_latest_per_context",
      "combined_state": "success",
      "total_count": 1,
      "returned_count": 1,
      "missing_count": 0,
      "page": 1,
      "per_page": 100,
      "page_complete": true,
      "observation": "records_observed",
      "items": [
        {
          "id": 57211940898,
          "name": "CodeRabbit",
          "sha": "00d217067504e2b912bfd418199eef69d23a3c6a",
          "status": "success",
          "conclusion": null,
          "observation": "success",
          "description": "Review skipped: draft pull request",
          "url": null
        }
      ]
    },
    {
      "source": "checks",
      "sha": "00d217067504e2b912bfd418199eef69d23a3c6a",
      "query_scope": "check_runs_filter_latest",
      "combined_state": null,
      "total_count": 0,
      "returned_count": 0,
      "missing_count": 0,
      "page": 1,
      "per_page": 100,
      "page_complete": true,
      "observation": "no_records_observed",
      "items": []
    },
    {
      "source": "actions",
      "sha": "00d217067504e2b912bfd418199eef69d23a3c6a",
      "query_scope": "actions_head_sha_without_event_filter",
      "combined_state": null,
      "total_count": 1,
      "returned_count": 1,
      "missing_count": 0,
      "page": 1,
      "per_page": 100,
      "page_complete": true,
      "observation": "records_observed",
      "items": [
        {
          "id": 40220835403,
          "name": "Frontend Tests",
          "sha": "00d217067504e2b912bfd418199eef69d23a3c6a",
          "status": "completed",
          "conclusion": "action_required",
          "observation": "action_required",
          "url": "https://github.com/usememos/memos/actions/runs/40220835403"
        }
      ]
    }
  ]
}
```

## 是否照页完成

已完成。按页面顺序：先读 PR 当前 head，再用同一 40 位 SHA 读三源，均声明 `page=1&per_page=100`，未换旧 head、未加事件或状态过滤；用页面给出的投影片段与测试命令。未触发 CI、未回复评论、未改 PR。

## 缺信息与原因

1. 页面只写“沿用已授权 GitHub 入口”，没有说明入口形式（`gh`、token、代理或连接器）。环境中没有 `gh`，也没有 GitHub token 环境变量；改用匿名公开只读 REST（仅 GET、未登录），三次请求均返回 200。若页面本意是某个已授权的连接器/代理，本次结果可能与其不同，这一点无法从页面判定。
2. 页面要求“先读 PR 当前 head”，但没有给出 PR 元数据端点或 PR 编号来源；本任务上文出现 Memos #6502，据此使用 `GET /repos/usememos/memos/pulls/6502`（官方 API，页面未列）。
3. 页面说 `ci-input.json` 放在 `experiments/ci-result-projection/` 同目录，但未说用后是否保留。为遵守“唯一成果为 result.md”，临时输入与原始响应在记录后删除；核验者可用同 SHA 重取。
4. Node 版本 v22.23.2，满足页面要求的 18+；无其他前提缺失。
