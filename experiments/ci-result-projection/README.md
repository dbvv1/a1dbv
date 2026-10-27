# 让 Agent 读 CI 契约字段，不读整份仓库元数据

核精确提交的 CI 时，先取完整 API JSON，再用 [ci-projection.cjs](ci-projection.cjs) 提取状态、数量、分页缺口与检查链接。`pending` 加空 statuses 应读成“当前没有 status 记录”，不能报成“CI 正在排队”。函数只读输入，不请求网络，也不决定能否合入。

## 输入与使用

需要 Node.js 18+。沿用已授权 GitHub 入口，给同一完整 SHA 取以下三个响应，均明确 `page=1&per_page=100`：

- `GET /repos/{owner}/{repo}/commits/{sha}/status` → `statuses`
- `GET /repos/{owner}/{repo}/commits/{sha}/check-runs?filter=latest` → `checks`
- `GET /repos/{owner}/{repo}/actions/runs?head_sha={sha}` → `actions`

将响应正文保存为一个 JSON 对象，键为 `sha`、`statuses`、`checks`、`actions`；取错页、额外过滤事件或状态会改变结果范围。不要把连接器的包装对象当 API 正文。以下片段从 `experiments/ci-result-projection/` 目录运行，`ci-input.json` 放在同目录：

```js
const fs = require('node:fs');
const {projectCI} = require('./ci-projection.cjs');
const input = JSON.parse(fs.readFileSync('ci-input.json', 'utf8'));
console.log(JSON.stringify(projectCI(input.sha, input), null, 2));
```

三来源分别输出 `query_scope`、`total_count`、`returned_count`、`missing_count`、`page_complete` 和原始状态，commit status 同时保留 `description`。数量缺口说明还需取后续页；本片段只处理已声明的第一页。必要状态／计数字段缺失、畸形记录或 SHA 不符直接报错；缺少名称或可用链接时保留 `null`。取消、跳过、中性和需要操作各自保留，不合成为绿色。

`page_complete` 只比较当前接口的总数与返回数。GitHub 的查询上限、未接入的 CI 和必需检查规则仍在这个判断之外；三来源均零应报告“当前未观测到记录”。HTTP(S) 检查链接仅做格式筛选，未验证可达。

## 本仓实际使用

2026-10-27 发布核验中，读取提交 `145801ec43790725a1c39ac765bdd3ba9721298b` 的三个响应：statuses 的原始 `state` 为 `pending`，但三来源的 `total_count` 均为 0。投影保留这个区别，没有触发 CI 或把无记录记为通过。

本次三响应封装为紧凑 JSON 共 4,203 个字符，投影结果 924 个字符；减少的是返回给阅读者的仓库元数据，不是已测 token、费用或总耗时收益。原始响应与投影在云工作区实际运行；不把该空记录样本推广成全部 CI 场景。

```sh
node experiments/ci-result-projection/ci-projection.test.cjs
```

46 项回归覆盖空记录、pending/error、分页缺口、畸形字段、SHA 错配、非成功终态、状态说明及链接过滤；回归使用夹具。未配置为本仓发布门禁。

随后在 [Datasette #3015](https://github.com/simonw/datasette/pull/3015) 与 [Memos #6502](https://github.com/usememos/memos/pull/6502) 的真实跟进中再用：Actions 的 `action_required` 被保留，但首版漏掉 CodeRabbit 的 `description`，只剩 `success`。Memos 的说明实际是 `Review skipped: draft pull request`；现版保留原状态及说明，重放原响应后可读出跳过审核。状态成功与审核执行是两件事，接收时仍要读说明和目标报告。两个固定 head 分别为 `a6f3ade873fbe91d3c6a58a76a50d359217b5c90`、`00d217067504e2b912bfd418199eef69d23a3c6a`，观察时间 2026-10-27 13:13 UTC。

## 来源

[GitHub combined status](https://docs.github.com/en/rest/commits/statuses#get-the-combined-status-for-a-specific-reference)说明无 statuses 也返回 pending；[check runs](https://docs.github.com/en/rest/checks/runs#list-check-runs-for-a-git-reference)说明 latest 与分页、最近 1,000 个 check suites 范围；[Actions runs](https://docs.github.com/en/rest/actions/workflow-runs#list-workflow-runs-for-a-repository)说明 head_sha 过滤和查询上限。核实：2026-10-27。
