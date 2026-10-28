# A-CI-EXACT-SHA-READER-20261028 · 新发布提交的真实 CI 核验
id: A-CI-EXACT-SHA-READER-20261028
owner: dot-A
status: cancelled
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5dd280c04b1a5a79d10724a01ed390f34bb4b5f4
result_branch: relay/a-ci-exact-sha-reader-20261028

## 目标与规格
发布负责人要知道 a1dbv 精确提交 `a0c0d31501b3a86fba85962959da41c0bfb8794d` 当前实际有哪些 CI 记录、哪些仍未知；这是未核过三来源的新发布任务，不重做 Memos／Datasette。
按 write-task-guide 的新读者实测及 operations §3 的 reader-test Workflow：接收端将任务规格与下方全文交给未参与页面写作、未读旧实测记录的新上下文读者，只许照此页做；仓内引用脚本与官方 API 文档可读。旧 result.md／result-u2.md、历史原响应和任务答案不交给读者；页面历史数字不能充当本次结果。
下方是基线 `experiments/ci-result-projection/README.md` 全文原样；四反引号仅用于包裹原始 Markdown，相对链接按原页面目录解析。Memos #6502 的 `00d217067504e2b912bfd418199eef69d23a3c6a` 是页内已完成同类任务，不重复执行。
只读公开 API，原响应、输入和 HTTP 分页头均留在 Git 工作树外的任务临时目录至接收完成；不读凭据、环境 token、私人记录或账号用量，不登录、触发／重跑 CI、改仓库设置、开 PR 或合并。不因拒绝换身份；技术失败记具体动作与原错误。

## 写入范围与验收
本次只修 `docs/collaboration/local-jobs/artifacts/A-CI-EXACT-SHA-READER-20261028/result.md` 及同 ID 支撑记录 `reader-tests/A-CI-EXACT-SHA-READER-20261028-u1.md`（保留读者与独立复核证据），另由接收端回写本任务状态；不删证据，不改页面、代码或默认分支。
短结果写观察时间、固定完整 SHA、实际命令、三源 HTTP 结果及必要投影字段／说明／链接；逐源核返回数量与总数、分页和查询上限。需后续页时照页推进，页内方法不足就记卡点，不自行补教程；不把第一页完整等同全部必需检查完整，不把无记录或跳过报绿。
读者以外的验证者核对保留的原响应、实际运行的 projectCI 输出及结果；确认 SHA 同一、状态／description 未丢失、分页与缺失正确，分别写做通、卡点及未验范围。能否合入不在结论内；环境／权限／页面／模型卡点分别记录，不改答案页。
沿 result_branch 交结果、回 review_ready，由 dot-A 接收，不用 accept: auto；本单元最多两小时，纳入共享四并行，不需 GPU。

## 页面全文（逐字保留）
````markdown
# 让 Agent 读 CI 契约字段，不读整份仓库元数据

核精确提交的 CI 时，先取完整 API JSON，再用 [ci-projection.cjs](ci-projection.cjs) 提取状态、数量、分页缺口与检查链接。`pending` 加空 statuses 应读成“当前没有 status 记录”，不能报成“CI 正在排队”。函数只读输入，不请求网络，也不决定能否合入。

## 输入与使用

需要 Node.js 18+。公开仓库可用匿名 GitHub REST GET，也可沿用已有连接器或 `gh`；本例无需登录或查找凭据。核 PR 时，先取 `GET /repos/{owner}/{repo}/pulls/{number}` 的 `head.sha`；核已发布提交时直接用完整 SHA。给同一 SHA 取以下三个响应，均明确 `page=1&per_page=100`：

- `GET /repos/{owner}/{repo}/commits/{sha}/status` → `statuses`
- `GET /repos/{owner}/{repo}/commits/{sha}/check-runs?filter=latest` → `checks`
- `GET /repos/{owner}/{repo}/actions/runs?head_sha={sha}` → `actions`

将三个响应正文组装为一个 JSON 对象，键为 `sha`、`statuses`、`checks`、`actions`，保存为 `ci-input.json`；取错页、额外过滤事件或状态会改变结果范围。不要把连接器的包装对象当 API 正文。原响应（包括 PR 元数据）和输入都放在 **Git 工作树之外**的任务临时目录，保留到接收完成；仓内未跟踪或被忽略的目录也不用于存放原响应。

从 `experiments/ci-result-projection/` 目录运行下列命令，将最后一个参数替换为仓外 `ci-input.json` 的绝对路径，保留双引号。Bash 与 Windows PowerShell 使用同一命令；Windows PowerShell 可用 `Resolve-Path`、Bash 可用 `realpath` 取得已有文件的绝对路径。

```sh
node -e "const fs = require('node:fs'); const {projectCI} = require('./ci-projection.cjs'); const input = JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); console.log(JSON.stringify(projectCI(input.sha, input), null, 2));" "替换为仓外 ci-input.json 的绝对路径"
```

交付只留必要字段与观察时间，不提交原响应、输入或本机绝对路径；公开扫描仍照常运行。

三来源分别输出 `query_scope`、`total_count`、`returned_count`、`missing_count`、`page_complete` 和原始状态，commit status 同时保留 `description`。数量缺口说明还需取后续页；本片段只处理已声明的第一页。必要状态／计数字段缺失、畸形记录或 SHA 不符直接报错；缺少名称或可用链接时保留 `null`。取消、跳过、中性和需要操作各自保留，不合成为绿色。

`page_complete` 只比较当前接口的总数与返回数。GitHub 的查询上限、未接入的 CI 和必需检查规则仍在这个判断之外；三来源均零应报告“当前未观测到记录”。HTTP(S) 检查链接仅做格式筛选，未验证可达。

## 本仓实际使用

2026-10-27 发布核验中，读取提交 `145801ec43790725a1c39ac765bdd3ba9721298b` 的三个响应：statuses 的原始 `state` 为 `pending`，但三来源的 `total_count` 均为 0。投影保留这个区别，没有触发 CI 或把无记录记为通过。

本次输入与投影均按无缩进 `JSON.stringify` 计数，分别为 4,203 与 924 个字符；减少的是返回给阅读者的仓库元数据，不是已测 token、费用或总耗时收益。原始响应与投影在云工作区实际运行；不把该空记录样本推广成全部 CI 场景。

```sh
node experiments/ci-result-projection/ci-projection.test.cjs
```

46 项回归覆盖空记录、pending/error、分页缺口、畸形字段、SHA 错配、非成功终态、状态说明及链接过滤；回归使用夹具。未配置为本仓发布门禁。

随后在 [Datasette #3015](https://github.com/simonw/datasette/pull/3015) 与 [Memos #6502](https://github.com/usememos/memos/pull/6502) 的真实跟进中再用：Actions 的 `action_required` 被保留，但首版漏掉 CodeRabbit 的 `description`，只剩 `success`。Memos 的说明实际是 `Review skipped: draft pull request`；现版保留原状态及说明，重放原响应后可读出跳过审核。状态成功与审核执行是两件事，接收时仍要读说明和目标报告。两个固定 head 分别为 `a6f3ade873fbe91d3c6a58a76a50d359217b5c90`、`00d217067504e2b912bfd418199eef69d23a3c6a`，观察时间 2026-10-27 13:13 UTC。

[本机新读者照页实测](../../docs/collaboration/local-jobs/artifacts/A-CI-PROJECTION-READER-20261027/result.md)在同日 13:42 UTC 完成 Memos 当前 head 核验，区分了成功但跳过审核、零 checks 与 `action_required`，46 项回归通过。按其卡点补上匿名只读入口、PR 元数据端点与临时输入保留方式。

2026-10-27 又以同一冻结 Memos 响应、同一外部检查调用实际 `projectCI` 接口：基线 `56b00ee2` → 最终补丁 `5113e0ea` → 完整撤回，description 断言退出码为 **1→0→1**；正常控制全过，除新增 description 外完整输出一致。撤回的全树与基线相等，各臂实际加载模块的路径与哈希已核。这里只借用 Trail of Bits 的窄三臂机制，未运行整套插件；证明该输入的修复因果，不等于全部回归安全。做法与来源见 [09 的接收提示](../../docs/09-review-and-quality.md#从实现产物到可接收交付)。

## 来源

[GitHub combined status](https://docs.github.com/en/rest/commits/statuses#get-the-combined-status-for-a-specific-reference)说明无 statuses 也返回 pending；[check runs](https://docs.github.com/en/rest/checks/runs#list-check-runs-for-a-git-reference)说明 latest 与分页、最近 1,000 个 check suites 范围；[Actions runs](https://docs.github.com/en/rest/actions/workflow-runs#list-workflow-runs-for-a-repository)说明 head_sha 过滤和查询上限。核实：2026-10-27。
````

## 修改要求
1. 沿既有分支 `relay/a-ci-exact-sha-reader-20261028` 的 `63970ab608bf01b63c777089c0013d30e9769c44` 修订，不重跑或新开读者实测；只从已留存的实际投影补齐 result.md 三来源的 `query_scope`，不新增 CI API 调用。
2. 独立复核既已指出缺字段，结论须保留“实测做通”与“交付仍需补项”的区别，不再概括为无问题／全部一致；原读者及复核证据保留。
3. 保留本次实算输入 4,252／投影 924；页面历史输入 4,203 对应另一提交，差值来源尚未核实，不能把 49 字符或 sha 键猜测当作已证原因，不强行统一数字。
## 当前结果
- 取消重复修订单元：`5a491838`、`14da3a80` 连续重新取三源 GET、只增读者记录，仍未补 result.md 的 `query_scope`，违背“仅用留存投影、不新增 CI API 调用”的修改要求；实测做通不等于交付补项完成。
- 保留原结果分支 `relay/a-ci-exact-sha-reader-20261028`，取消时已核尖端为 `14da3a80e007bf63c5051778d235334d660a73de`。
- 接收端在安全边界停止本任务，不再派发读者或新增 CI API 调用；保留现有结果、原读者与复核记录及仓外原响应／输入／投影，不改页面、不清理证据。后续由负责人改用定点修订接续，不重复原工作流。
