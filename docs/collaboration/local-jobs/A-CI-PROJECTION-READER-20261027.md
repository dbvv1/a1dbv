# A-CI-PROJECTION-READER-20261027 · 新读者完成真实上游 CI 核验
id: A-CI-PROJECTION-READER-20261027
owner: dot-A
status: review_ready
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5113e0ea0c760cf69a1fb63b18f97b52bb6f32a2
result_branch: relay/a-ci-projection-reader-20261027

## 目标与真实任务
为正在跟进的 Memos #6502 核对当前 head 的 CI，区分状态成功、实际评审、等待动作与没有记录；这是上游跟进，不触发 CI、不回复评论、不改 PR。
由没有读过此页的读者，仅照下方全文与仓内引用代码操作，先读 PR 当前 head，再读该 SHA 的三类公开 API；不拿旧 head 或页面里的旧观察代替当前结果。
不额外看研究文、作者笔记或本任务以外的解题说明；页面引用的代码、官方 API 链接可以读。遇缺信息只记录卡点，不自行补教程。
使用已配置的公开只读入口；不登录、不取新凭据、不改环境安全设置，不使用浏览器/GUI/键鼠，不读私人会话或账号用量。拒绝停该入口，技术失败记原错误，不换身份绕过。
按 kind: reader-test Workflow 实做及非读者验收；只记操作、观察与卡点，不改页面、源码或配置。没有 Node 18+ 等前提就如实报告，不以模拟成功替代实际运行。

## 写入与验收
唯一成果 docs/collaboration/local-jobs/artifacts/A-CI-PROJECTION-READER-20261027/result.md：精确 head、三源结果摘要、实际命令/返回、是否照页完成、缺信息及原因。只保公开且必要字段，不提交整份仓库元数据。
以实际 API 和脚本结果验收：同 head；分页缺口保留；状态说明能解释审核是否执行；零记录、action_required 和成功不混淆。由读者以外的角色核对原响应与结果。
任务回 review_ready，推指定 relay，不用 accept: auto；dot-A 接收。单元最多两小时，使用共享四并行队列，不用 GPU。

## 页面全文（固定 5113e0ea；相对链接改为同 SHA 地址）

# 让 Agent 读 CI 契约字段，不读整份仓库元数据

核精确提交的 CI 时，先取完整 API JSON，再用 [ci-projection.cjs](https://github.com/dbvv1/a1dbv/blob/5113e0ea0c760cf69a1fb63b18f97b52bb6f32a2/experiments/ci-result-projection/ci-projection.cjs) 提取状态、数量、分页缺口与检查链接。`pending` 加空 statuses 应读成“当前没有 status 记录”，不能报成“CI 正在排队”。函数只读输入，不请求网络，也不决定能否合入。

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

## 当前结果

- 读者按页面完成 Memos PR #6502 的 CI 投影实测：同一 40 位 SHA 取三源，statuses 1 条 success（draft 跳过审核）、checks 0 条（no_records_observed）、actions 1 条 action_required，46 tests passed，taskDone=true；openIssues 无。页面仍有 4 处非阻塞卡点：未定义“已授权 GitHub 入口”、操作节缺 PR 元数据端点、未写临时输入处置、未给非全零措辞示例。
- 产物：[ef5f69b](https://github.com/dbvv1/a1dbv/commit/ef5f69b96ec1fb2a3144f5f1a7440315c0553912)，分支 `relay/a-ci-projection-reader-20261027`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：无剩余工作单元；产物交接收端提交推送。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（reader-test）。
