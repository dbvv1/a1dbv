# A-CI-EXACT-SHA-READER-20261028 · 新读者照页实测（u2）

- 角色：首次读 `experiments/ci-result-projection/README.md` 的新上下文读者；只照该页做，页面文件未改。
- 目标：公开仓库 `dbvv1/a1dbv` 精确提交 `a0c0d31501b3a86fba85962959da41c0bfb8794d` 当前实际有哪些 CI 记录。
- 观察时间：2026-10-28T04:20:55Z（三次 GET 完成后取 UTC）。
- 结论：三来源均 HTTP 200、`total_count` 均为 0；按页应报“当前未观测到记录”。不报绿，也不把 combined status 的 `state: pending` 读成“CI 正在排队”。

## 做到哪一步

1. 匿名 `curl` GET 三个端点，均带 `page=1&per_page=100`，check-runs 另带 `filter=latest`；逐条保存响应正文与响应头到 Git 工作树外的任务临时目录。三条均一次返回 200。
2. 把三个响应正文原样组装为 `{sha, statuses, checks, actions}`，写入仓外 `ci-input.json`；无缩进 `JSON.stringify` 计数 4,252 字符。
3. 在 `experiments/ci-result-projection/` 下按页面给出的 `node -e` 命令运行 `projectCI`，退出码 0；投影无缩进计数 924 字符。
4. 运行页面给出的回归命令 `node experiments/ci-result-projection/ci-projection.test.cjs`：`46 tests passed`，退出码 0。
5. 逐源核对 total/returned/missing、`page_complete`、原始状态与响应头；三源均无 `Link` 头（无后续页）。

产物：

- 工作树内：`reader-tests/A-CI-EXACT-SHA-READER-20261028-u2.md`（本记录）。
- Git 工作树外的任务临时目录 `ci/`：`status.json`、`status.headers`、`check-runs.json`、`check-runs.headers`、`actions-runs.json`、`actions-runs.headers`、`ci-input.json`、`projection.json`、`observed-at.txt`。按页保留到接收完成，不提交；本记录不写这些文件的绝对路径。

## 实际命令

取三个响应（匿名，无凭据；`SHA` 为上述完整 40 位 SHA）：

```sh
curl -sS -D ci/status.headers -o ci/status.json -w "%{http_code}\n" \
  -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/dbvv1/a1dbv/commits/$SHA/status?page=1&per_page=100"
curl -sS -D ci/check-runs.headers -o ci/check-runs.json -w "%{http_code}\n" \
  -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/dbvv1/a1dbv/commits/$SHA/check-runs?filter=latest&page=1&per_page=100"
curl -sS -D ci/actions-runs.headers -o ci/actions-runs.json -w "%{http_code}\n" \
  -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/dbvv1/a1dbv/actions/runs?head_sha=$SHA&page=1&per_page=100"
```

组装（页面未给可复制命令，见卡点 1）：

```sh
node -e "const fs=require('node:fs'); const obj={sha:process.argv[1], statuses:JSON.parse(fs.readFileSync('status.json','utf8')), checks:JSON.parse(fs.readFileSync('check-runs.json','utf8')), actions:JSON.parse(fs.readFileSync('actions-runs.json','utf8'))}; fs.writeFileSync('ci-input.json', JSON.stringify(obj, null, 2));" "$SHA"
```

投影（照页面原命令，最后一个参数替换为仓外 `ci-input.json` 绝对路径）：

```sh
cd experiments/ci-result-projection
node -e "const fs = require('node:fs'); const {projectCI} = require('./ci-projection.cjs'); const input = JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); console.log(JSON.stringify(projectCI(input.sha, input), null, 2));" "<仓外临时目录>/ci/ci-input.json"
```

## 三来源结果

| source | 端点（第一页） | HTTP | total_count | returned_count | missing_count | page_complete | observation | query_scope |
| --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |
| statuses | `commits/{sha}/status?page=1&per_page=100` | 200 | 0 | 0 | 0 | true | `no_records_observed` | `commit_statuses_latest_per_context` |
| checks | `commits/{sha}/check-runs?filter=latest&page=1&per_page=100` | 200 | 0 | 0 | 0 | true | `no_records_observed` | `check_runs_filter_latest` |
| actions | `actions/runs?head_sha={sha}&page=1&per_page=100` | 200 | 0 | 0 | 0 | true | `no_records_observed` | `actions_head_sha_without_event_filter` |

- 原始状态：statuses 的 combined `state` 为 `pending`，与空 `statuses` 数组同时出现，按页读作“当前没有 status 记录”；checks/actions 无记录，逐条原始状态为空。
- 响应头：三源均无 `Link` 头，说明没有下一页可取；`X-RateLimit-Limit` 60，本组请求后剩余分别为 15、14、57（匿名额度，与结果无关）。
- SHA：statuses 正文的 `sha` 与目标一致；checks/actions 无记录可核 `head_sha`，端点查询用同一完整 SHA。
- 链接：无任何记录，因而没有检查链接可做格式筛选或可达性判断。

## 卡点（页面原句 → 缺什么 → 我怎么处理/做错什么）

1. **“将三个响应正文组装为一个 JSON 对象，键为 `sha`、`statuses`、`checks`、`actions`，保存为 `ci-input.json`”**：页面给了字段名和目标文件名，但没给可复制的组装命令，也没说明是整份响应正文还是仅取数组/计数。我按“整份正文原样放入对应键”理解，自写了一条 `node -e` 一行命令；结果投影正常，输入计数 4,252 与本次实算要求一致。这是本次唯一实际卡点。
2. **“原响应（包括 PR 元数据）和输入都放在 Git 工作树之外的任务临时目录”**：页面没给临时目录的命名/位置约定，也没要求保存 HTTP 状态码和分页头。我在任务运行目录下的 `scratch/ci/` 建目录，并用 `curl -D` 另存响应头，便于核对 200、`Link` 和额度；这属于页面外的自定做法。
3. **“三来源分别输出 `query_scope`、`total_count`、`returned_count`、`missing_count`、`page_complete` 和原始状态”**：记录数为 0 时，“原始状态”没有逐条可输出；实际只保留 statuses 的 combined `state`（`pending`）与 `observation: no_records_observed`。页面没写零记录时原始状态怎么摆，我按投影输出原样记录。
4. **“从 `experiments/ci-result-projection/` 目录运行下列命令，将最后一个参数替换为仓外 `ci-input.json` 的绝对路径”**：页面只提示 Bash 可用 `realpath` 取得绝对路径，没写 Git Bash 下的 Windows 路径形式。我直接把盘符形式的仓外绝对路径放进双引号，一次成功；为遵守产物不写本机路径的要求，本记录用占位符替换。
5. 页面没有规定观察时间放在哪：`projectCI` 输出没有时间字段。我在本记录单列 UTC 观察时间，未改动投影输出。

做错/返工：首次组装把 `ci-input.json` 写成了缩进 JSON；页面计数口径是无缩进 `JSON.stringify`，随后用无缩进形式复算得到 4,252，投影不受缩进影响，无功能返工。三次 API 请求均一次 200，无重试。

## 页面之外还翻了什么

- 读了页面自己引用的 `experiments/ci-result-projection/ci-projection.cjs`（页面允许读仓内脚本），用于确认 `projectCI` 的入参键、零记录分支和字段语义；没有改它。
- 运行环境自检：`node --version`（v22.23.2，满足 Node.js 18+）、`git log -1` 确认工作树基线；只用 `curl` 匿名请求，未用 `gh`、连接器、凭据或环境 token。
- 未读本仓库其他文档，未打开旧实测记录（列目录时看到 `A-CI-EXACT-SHA-READER-20261028-u1.md` 等文件名，未读取），未搜索同主题教程，未查官方 API 文档，未做联网搜索。
- 未触发或重跑 CI、未登录、未改仓库设置、未开 PR。

## 未验范围

- 三源均 0 条，未取到后续页，`page_complete` 只说明“当前接口回报的总数=第一页返回数”，不等于全部 CI 完整。
- GitHub 的查询上限（页面提到的 checks 最近 1,000 个 check suites、Actions 的运行查询上限）与必需检查规则未触发，仍在该判断之外。
- 零记录只说明“当前未观测到记录”，不能读成 CI 通过或可合入；无检查链接可验证可达性。

## 核对（2026-10-28 本轮，独立复核）

核对者未参与本次照做。结论：照页实测与数据独立复现无误，目标 SHA 三源确为 0，按页应报“当前未观测到记录”；但按任务文件的交付验收仍未做成——读者只写了本记录，任务指定的 `docs/collaboration/local-jobs/artifacts/A-CI-EXACT-SHA-READER-20261028/result.md` 未更新，三来源表仍缺 `query_scope`，观察时间仍是 02:26 UTC。故 taskDone=false：实测做通，交付仍需补项。另：本轮按 reader-test 派发重新取数（三次 GET），与任务文件修改要求 #1“不重跑或新开读者实测、不新增 CI API 调用”不符；属派发与任务要求不一致，不是读者数据错误。

### 做通（独立复核）

- 读任务运行目录下 Git 工作树外的 `scratch/ci/` 保留件：三份正文与记录一致。statuses 正文 HTTP 200、`state: pending`、`statuses: []`、`total_count: 0`、`sha` 与目标 SHA 相同；checks/actions 均 `total_count: 0`、数组为空。三份响应头均无 `Link`，`Date` 分别为 04:20:49Z、04:20:52Z、04:20:55Z，与记录的 04:20:55Z 相符。
- 用保留的 `ci-input.json` 在 `experiments/ci-result-projection/` 复跑页内 `projectCI`：输出与 `projection.json` 深度相等；输入无缩进 4,252 字符、投影 924 字符，与记录一致。
- 三源字段复核：`query_scope` 分别为 `commit_statuses_latest_per_context`、`check_runs_filter_latest`、`actions_head_sha_without_event_filter`；total/returned/missing 均 0/0/0，`page_complete` true，`observation` 为 `no_records_observed`，statuses `combined_state=pending`，三条 SHA 一致。
- `node experiments/ci-result-projection/ci-projection.test.cjs` 输出 `46 tests passed`、退出码 0。
- `a0c0d315…` 为仓内 commit（提交时间 `2026-10-27T19:08:00-07:00`）。
- 工作树只有本次 u2 记录未跟踪；页面 `experiments/ci-result-projection/README.md` 与 `result.md` 均未改；记录 UTF-8/LF，无本机绝对路径或内网地址。

### 卡点判断（page=页面缺信息或口径；model=读者自行加码、误读或环境细节）

1. 组装命令缺失 → page：页面只给键名和目标文件名，没给可复制命令，也没明说“整份响应正文”还是仅取数组/计数；读者自写 node 一行，做法与结果正确。
2. 临时目录命名与保存 HTTP 头 → model：页面已限定“Git 工作树之外”和“保留到接收完成”，目录名不必规定；保存状态码与 `Link` 头是额外的正确核对手段，任务文件也要求留分页头。
3. 零记录时“原始状态”如何摆 → model：页面已写“三来源均零应报告‘当前未观测到记录’”，投影固定输出 `combined_state`/`observation`/`items: []`，读者读脚本后处理正确。
4. Git Bash 下的 Windows 绝对路径写法 → model：页面已给 Bash `realpath`、PowerShell `Resolve-Path`；盘符路径是平台细节，读者一次成功。
5. 观察时间放在哪、用什么格式 → page（轻微）：页面要求交付观察时间，投影无时间字段；读者单列 UTC 观察时间，合理，不阻塞。

### 读者未意识到的问题

- 交付文件未更新：任务“写入范围与验收”要求把短结果写进 `result.md`（含三源 `query_scope`、观察时间），读者只写了本记录。`result.md` 仍是 02:26 UTC、表内无 `query_scope`；这是本轮交付未做成的直接原因，记录中没有指出。
- 实际命令不可按序复现：curl 段写入 `ci/…`，组装命令却读裸文件名 `status.json`、`check-runs.json`、`actions-runs.json` 并写 `ci-input.json`；实测前者在 `scratch/` 下运行、后者须在 `scratch/ci/` 下运行。记录漏了切换目录这一步，照抄会在组装时 ENOENT（另：第 19 行写 `ci/`、第 66 行写 `scratch/ci/`，实际在 `scratch/ci/`）。
- 未对照页面历史计数：页面“本仓实际使用”写输入 4,203 字符，读者实算 4,252，仅写“与本次实算要求一致”，没有指出页面数字对应另一提交 `145801ec…`，也未说明 49 字符差未核实。
- 速率额度读数未说明异常：三次请求 `X-RateLimit-Remaining` 为 15/14/57，第三个响应的 `X-RateLimit-Reset`（1793163886）与 `x-github-edge-region`（fra）同前两者（1793162819、westus3）不同，分属不同出口/额度窗口；不影响结果，但记录把三者并成“本组”剩余额度。

### 未验范围

- 有记录时的 `description` 与链接保留路径、后续页与分页缺口路径（三源 total 0、无 `Link`，未触发）。
- GitHub 查询上限、必需检查规则、该 SHA 是否本应产生 CI；只核了这一时刻的保留件，未重新请求 API。
- 能否合入不在本结论内。
