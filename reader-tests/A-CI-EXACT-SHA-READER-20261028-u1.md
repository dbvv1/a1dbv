# A-CI-EXACT-SHA-READER-20261028 · 新读者实测记录（u1）

## 做到哪一步、产物在哪

按页面全文从零执行，任务已完成：

1. 确认运行环境：Node.js v22.23.2、curl 8.22.0；仓库公开。
2. 对固定完整 SHA `a0c0d31501b3a86fba85962959da41c0bfb8794d` 匿名 GET 页内列出的三个接口，均带 `page=1&per_page=100`：status、check-runs（`filter=latest`）、actions runs（`head_sha`）。三源 HTTP 均为 200 OK，`Date` 头 02:26:12Z–02:26:18Z（2026-10-28 UTC）。
3. 将三份正文组装为仓外 `ci-input.json`（键 `sha`、`statuses`、`checks`、`actions`），原响应与 HTTP 分页头一并留在 Git 工作树之外的任务临时目录（运行目录下的 `tmp-ci/`，未提交，不写进产物）。
4. 从 `experiments/ci-result-projection/` 运行页内 `projectCI` 命令，末参数用仓外输入的绝对路径并保留双引号，退出码 0。
5. 复核三源：`total_count`、`returned_count`、`missing_count`、`page_complete` 与 `observation`；三源均为 total 0 / returned 0 / missing 0 / page_complete true / `no_records_observed`。三个响应都没有 `Link` 头，没有后续页。
6. 复算无缩进 `JSON.stringify` 字符数：输入 4,252，投影 924。
7. 运行页内回归 `node experiments/ci-result-projection/ci-projection.test.cjs`，输出 `46 tests passed`，退出码 0。

产物：

- `docs/collaboration/local-jobs/artifacts/A-CI-EXACT-SHA-READER-20261028/result.md`（任务要求的唯一新成果；含观察时间、完整 SHA、实际命令、三源 HTTP 结果、投影字段、未知范围）。
- 本记录 `reader-tests/A-CI-EXACT-SHA-READER-20261028-u1.md`。

结论口径：该 SHA 三源均无记录，写为“当前未观测到记录”，没有写成通过或排队；未判断能否合入。

## 卡点（页面位置、缺什么、做错过什么）

没有阻断性卡点；以下是页面表达不足、需要自行决定的点：

1. 页面“将三个响应正文组装为一个 JSON 对象，键为 `sha`、`statuses`、`checks`、`actions`”——只说了目标形态，没给组装命令或字段映射示例。缺一段可照抄的组装备份步骤。我的做法：用 Node 读三份文件并 `JSON.stringify` 成单行写入 `ci-input.json`，键直接取接口名。
2. 页面“本次输入与投影均按无缩进 `JSON.stringify` 计数，分别为 4,203 与 924 个字符”——但紧邻的示例命令用 `JSON.stringify(..., null, 2)` 输出缩进版，字符数口径与实际命令不一致。缺“计数时另跑一次无缩进序列化”的说明。我的做法：投影用页内命令取结果，再单独 `JSON.stringify(out)` 计数。第一次若直接数命令输出会把缩进算进去，这一步是自行纠正的。
3. 页面要求“原响应……放在 Git 工作树之外的任务临时目录”——没规定目录命名或保留期限的具体位置。我的做法：放在运行目录（工作树外）的 `tmp-ci/`，接收完成前不删。
4. 页面“交付只留必要字段与观察时间”——没定义观察时间的格式与时区。我的做法：取 HTTP `Date` 响应头，写 UTC 时间。
5. 页面“三来源分别输出……和原始状态，commit status 同时保留 `description`”——本例三源 `items` 全空，没有 `description` 或链接可输出；页面未说明空记录时这些字段如何呈现（结果为 `null`/空数组由投影决定）。未算卡住，只是结果里注明无链接、无说明。
6. 页面“数量缺口说明还需取后续页；本片段只处理已声明的第一页”与任务页“需后续页时照页推进”——本次三源总数均为 0 且无 `Link`，不需要后续页，因此没有遇到“取后续页”的操作细节缺失。
7. 页面引用“46 项回归”，实际运行输出 `46 tests passed`，一致，无卡点。

做错过的动作：组装输入时先用了一个无意义的空循环（`for src in status checks actions`），不影响结果；此外没有执行失败后返工的动作。

## 页面之外还去翻了什么

- 读了页面链接的仓内脚本 `experiments/ci-result-projection/ci-projection.cjs`（页面明确引用，允许阅读），用于确认输入键与输出字段；没有读页面未引用的其他 a1dbv 文档。
- 为确认产物目录是否存在，列了 `docs/collaboration/local-jobs/artifacts/` 的目录名（只列名，没有打开其他任务的结果或记录）。
- 运行了页面给出的回归测试文件，但没有打开其源码逐条阅读。
- 没有联网查 GitHub 官方文档（页面已给出 source 链接与核实日期，本任务只核这一个 SHA，未触发分页或权限问题）；没有再搜同主题教程。

## 核对

核对者未参与照做，独立匿名重取同一 SHA 的三接口，并用保留的输入复跑页内命令与回归。结论：读者做成，数据与页面口径一致，无阻断性问题。

**做通（独立复核）**

- 三接口正文与 `tmp-ci/` 保留件逐字节相同（`cmp` 一致），ETag 也一致；重取 `Date` 为 02:33Z，比记录的 02:26Z 晚 7 分钟，属预期。三源均 200、无 `Link`。
- 用保留的 `ci-input.json` 复跑页内 `projectCI`，输出与 `projection-compact.json` 完全相同：三源 total/returned/missing 为 0/0/0，`page_complete` true，`observation` 为 `no_records_observed`，statuses 的 `combined_state=pending`，SHA 三条一致；compact 长度 924。
- 无缩进计数复核：输入 4,252、投影 924，与结果一致。
- `node experiments/ci-result-projection/ci-projection.test.cjs` 输出 `46 tests passed`、退出码 0。
- 工作树 `git diff` 为空，只有两个新增未跟踪文件；HEAD 仍是 `5dd280c0`、分支未变；任务文件 mtime 未变；产物与记录为 UTF-8/LF，无本机绝对路径或内网地址；原响应与输入在工作树外的运行目录 `tmp-ci/`。
- 结论口径正确：零记录写成“当前未观测到记录”，未报绿、未报排队，未判断能否合入，并列了查询上限等未验范围。

**卡点判断（page=页面缺信息或口径不一致；model=读者自行加码）**

1. 组装命令缺失 → page：页面只给键形态，没有可照抄的组装步骤。
2. 计数口径与示例命令不一致 → page：正文说按无缩进计数，相邻示例命令却用 `null, 2` 输出缩进版。
3. 临时目录位置与保留期 → model：页面已给“Git 工作树之外”和“保留到接收完成”两条约束，目录名不必再规定。
4. 观察时间格式与时区 → page：属小缺口；读者取 `Date` 头写 UTC 合理。
5. 空记录时字段如何呈现 → model：页面已有“缺少名称或可用链接时保留 `null`”，`projectCI` 固定输出 `items: []`。
6. 后续页路径未实测 → page：页面明确只处理已声明的第一页，本次 total 0 不触发；非阻断，但该路径仍未测。

**读者未意识到的问题**

- 结果表缺 `query_scope`：页面要求三来源分别输出该字段，投影也实际输出，但 `result.md` 未列。
- 页面写的输入计数 4,203 与读者实算 4,252 不符，差值 49 恰好等于顶层 `"sha":"<40 位十六进制>",` 键的长度；按页面自称的旧提交 `145801ec43790725a1c39ac765bdd3ba9721298b` 同法组装今天同样得 4,252。这提示页面的 4,203 很可能是在输入未含 `sha` 键时计数，而页内命令必须读 `input.sha`；读者既引用了 4,203 又算出 4,252，却没有指出这个矛盾。

**未验范围**

- 有记录时的 `description` 保留路径（三源 items 全空，未触发）。
- 后续页与分页缺口路径（无 `Link`、total 0，未触发）。
- GitHub 查询上限、必需检查规则，以及该 SHA 是否本应产生 CI。
- 只核了当前时刻；7 分钟后重取一致，仅此一次。

---

## 新读者实测（2026-10-28，独立上下文）

本节由未参与页面写作、未读旧实测记录的新读者，仅照 `experiments/ci-result-projection/README.md` 页面操作所得；旧记录未读、未改。

### 做到哪一步

页面任务已完成：对公开仓库 `dbvv1/a1dbv` 的精确提交 `a0c0d31501b3a86fba85962959da41c0bfb8794d` 取三源第一页原始响应，在 Git 工作树外的任务临时目录组成 `ci-input.json`，用仓内 `projectCI` 投影；另按页面运行了回归。

产物位置：投影 JSON、三源原始响应、HTTP 头与输入只存在于 Git 工作树外的任务临时目录（接收后可清），未入库；本记录保存必要字段与命令。未提交原响应、输入或本机绝对路径。

### 实算结果

- 观察时间（GitHub 响应 `Date` 头，UTC）：statuses `2026-10-28T03:47:11Z`，checks `03:47:16Z`，actions `03:47:19Z`；本机 UTC 窗口 `03:47:08Z`–`03:47:20Z`。
- 固定完整 SHA：`a0c0d31501b3a86fba85962959da41c0bfb8794d`（本地 `git cat-file -t` 为 `commit`；提交时间 `2026-10-27T19:08:00-07:00`）。
- 实际命令（`$TMP` 为 Git 工作树外的任务临时目录）：

```sh
curl -sS -D "$TMP/statuses.headers" -o "$TMP/statuses.json" \
  "https://api.github.com/repos/dbvv1/a1dbv/commits/a0c0d31501b3a86fba85962959da41c0bfb8794d/status?page=1&per_page=100"
curl -sS -D "$TMP/checks.headers" -o "$TMP/checks.json" \
  "https://api.github.com/repos/dbvv1/a1dbv/commits/a0c0d31501b3a86fba85962959da41c0bfb8794d/check-runs?filter=latest&page=1&per_page=100"
curl -sS -D "$TMP/actions.headers" -o "$TMP/actions.json" \
  "https://api.github.com/repos/dbvv1/a1dbv/actions/runs?head_sha=a0c0d31501b3a86fba85962959da41c0bfb8794d&page=1&per_page=100"

# 组装（页面只给键名，未给命令，此行由读者自写，保留三个响应完整正文）
node -e "const fs=require('node:fs');const sha='a0c0d31501b3a86fba85962959da41c0bfb8794d';const input={sha,statuses:JSON.parse(fs.readFileSync('$TMP/statuses.json','utf8')),checks:JSON.parse(fs.readFileSync('$TMP/checks.json','utf8')),actions:JSON.parse(fs.readFileSync('$TMP/actions.json','utf8'))};fs.writeFileSync('$TMP/ci-input.json',JSON.stringify(input));"

# 页面原命令，在 experiments/ci-result-projection/ 下执行
node -e "const fs = require('node:fs'); const {projectCI} = require('./ci-projection.cjs'); const input = JSON.parse(fs.readFileSync(process.argv[1], 'utf8')); console.log(JSON.stringify(projectCI(input.sha, input), null, 2));" "$TMP/ci-input.json"
```

- HTTP 结果：三源均 `HTTP/1.1 200 OK`；无 `Link` 分页头（三源 `total_count` 均为 0，无后续页）。
- 三源投影：

| source | query_scope | 原始状态 | total_count | returned_count | missing_count | page_complete | observation |
|---|---|---|---|---|---|---|---|
| statuses | commit_statuses_latest_per_context | combined_state=`pending`，`statuses` 空 | 0 | 0 | 0 | true | no_records_observed |
| checks | check_runs_filter_latest | `check_runs` 空 | 0 | 0 | 0 | true | no_records_observed |
| actions | actions_head_sha_without_event_filter | `workflow_runs` 空 | 0 | 0 | 0 | true | no_records_observed |

- 结论：三源均零，按页面报“当前未观测到记录”。`statuses` 的 `pending` 是 combined status 的默认值，不读成“CI 正在排队”，也不等于通过；未触发或重跑 CI，未把无记录记绿。
- 计数：`ci-input.json` 无缩进 `JSON.stringify` 为 4,252 字符，投影为 924 字符。页面“本仓实际使用”的 4,203 对应提交 `145801ec43790725a1c39ac765bdd3ba9721298b`，与本次不是同一份响应；差值来源未核实，不据此推算原因，也不强行统一。
- 回归：`node experiments/ci-result-projection/ci-projection.test.cjs` 输出 `46 tests passed`（exit 0）。

投影全文（不含本机路径）：

```json
{
  "sha": "a0c0d31501b3a86fba85962959da41c0bfb8794d",
  "sources": [
    {
      "source": "statuses",
      "sha": "a0c0d31501b3a86fba85962959da41c0bfb8794d",
      "query_scope": "commit_statuses_latest_per_context",
      "combined_state": "pending",
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
      "source": "checks",
      "sha": "a0c0d31501b3a86fba85962959da41c0bfb8794d",
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
      "sha": "a0c0d31501b3a86fba85962959da41c0bfb8794d",
      "query_scope": "actions_head_sha_without_event_filter",
      "combined_state": null,
      "total_count": 0,
      "returned_count": 0,
      "missing_count": 0,
      "page": 1,
      "per_page": 100,
      "page_complete": true,
      "observation": "no_records_observed",
      "items": []
    }
  ]
}
```

### 卡点（页面原句 / 缺什么 / 做错过什么）

1. 页面“将三个响应正文组装为一个 JSON 对象，键为 `sha`、`statuses`、`checks`、`actions`”——未给组装命令，也未说明正文要保留哪些字段。我按字面保留三个响应完整正文（含 statuses 的 `repository` 元数据）自写 node 一行；若只留 `statuses`/`check_runs`/`workflow_runs` 与 `total_count`，输入字符数会不同。非阻塞缺口。
2. 页面“从 `experiments/ci-result-projection/` 目录运行下列命令，将最后一个参数替换为仓外 `ci-input.json` 的绝对路径，保留双引号”——未说明 Windows Git Bash 下盘符路径写法。我用正斜杠形式，node 读取成功；未试反斜杠写法。属环境细节缺口，不影响结果。
3. 页面“也可沿用已有连接器或 `gh`”——本机无 `gh`，故按页面首选用匿名 REST GET（curl），无需登录。记环境事实。
4. 页面“需要 Node.js 18+”——本机 v22.23.2，满足。
5. 页面“公开扫描仍照常运行”——本任务未执行，页面未给命令；三源核验不需要，未阻塞。
6. 页面“本次输入与投影均按无缩进 `JSON.stringify` 计数，分别为 4,203 与 924 个字符”——该数是另一提交的历史样本；本次同法计数为 4,252/924，输入多 49 字符。页面未说明差值来源，我未猜测（如 sha 键或字段差异），只如实记录。
7. 页面“取错页、额外过滤事件或状态会改变结果范围”——我额外发了 `Accept: application/vnd.github+json` 与 `X-GitHub-Api-Version: 2022-11-28` 请求头；两者不改变结果范围，但页面未列，记作偏离项。
8. 页面“交付只留必要字段与观察时间，不提交原响应、输入或本机绝对路径”——未给“必要字段”的固定模板；我按三源 `query_scope`、计数、状态、`observation` 与结论组织。非阻塞。
9. 做错过什么：`statuses.json` 有 4.5 KB，我一度以为出现了记录；核对 `total_count: 0` 与空 `statuses` 后纠正——体积来自 `repository` 元数据，不是 CI 记录。

### 页面之外还翻了什么

- `experiments/ci-result-projection/ci-projection.cjs`（页面链接的仓内脚本）：确认输入契约（`statuses.statuses`、`checks.check_runs`、`actions.workflow_runs`、`total_count`、SHA 校验）。
- 三个原始 API 响应与 HTTP 头：核对 `total_count`、`state`、`Date`、`Link` 与匿名速率限制；未把连接器包装当 API 正文。
- `experiments/ci-result-projection/ci-projection.test.cjs`（页面提到的脚本）：实际运行，46 项通过。
- 本地 git 只做 `git cat-file -t` 与 `git log -1`，确认该 SHA 是仓内 commit 及提交时间。
- 未读其他 a1dbv 文档、未搜同主题教程、未开可见浏览器窗口；旧 `result.md` 未读。

---

## 核对（2026-10-28 本轮，独立复核）

核对者未参与本轮照做。结论：三源实测、保留输入与投影数据独立复现无误，“当前未观测到记录”的结论成立；但任务文件要求的交付修订没有发生——`result.md` 未改，三来源表仍缺 `query_scope`，观察时间仍是上一轮的 02:26 UTC。按任务验收不算做成，交付仍需补项。

### 做通（独立复核）

- 2026-10-28T04:05Z 匿名重取同一 SHA 三接口：均 `HTTP/1.1 200 OK`，`total_count` 与返回数均为 0，无 `Link`；三份正文与 Git 工作树外保留件逐字节相同，`ETag`（`4d79…`、`f1a4…`、`dd47…`）与读者 03:47Z 记录一致。
- 用保留的 `ci-input.json` 在 `experiments/ci-result-projection/` 复跑页内 `projectCI`：输出与 `projection.json` 深度相等；三源 `query_scope`、`0/0/0`、`page_complete=true`、`no_records_observed`、statuses `combined_state=pending` 均与记录一致，SHA 三条一致。
- 计数复核：输入 4,252、投影 compact 924，与记录一致；`a0c0d315…` 为仓内 commit，提交时间 `2026-10-27T19:08:00-07:00`。
- 回归 `node experiments/ci-result-projection/ci-projection.test.cjs`：`46 tests passed`，exit 0。
- `python scripts/check_public.py`：930 文件、无发现，exit 0；u1 与 `result.md` 均无本机绝对路径、内网地址，UTF-8/LF。
- 工作树只有 u1 修改，HEAD 仍为 `63970ab6`，页面文件未改；`observed_at_before/after` 与记录的 03:47:08Z–03:47:20Z 一致。

### 卡点判断（page=页面缺信息或口径；model=读者自行加码、误读或环境事实）

1. 组装命令与保留字段 → page（轻微）：页面只给键名，没有可照抄的组装步骤；但“三个响应正文”已隐含保留完整正文，读者做法正确，计数差异也因此合理。
2. Windows Git Bash 盘符路径 → model：页面已给 Bash `realpath`、PowerShell `Resolve-Path`；正斜杠可用，属平台细节，非页面缺口。
3. 本机无 `gh` → model（环境事实）：页面把匿名 REST 列为首选，读者按首选执行，正确，非卡点。
4. Node.js 18+ → model（环境事实）：v22.23.2 满足，非缺口。
5. “公开扫描仍照常运行”未给命令 → model：这是仓库级检查（本轮实跑 `scripts/check_public.py` 通过），由接收端或脚本执行，不是读者必须完成的页面步骤；读者读成了自身待办。
6. 4,203 与 4,252 差 49 → model：页面已写明 4,203 属另一提交 `145801ec…` 的历史样本；按修改要求 #3 不猜差值，读者处理正确。页面该数字是否漏算 `sha` 键仍未核实，但不构成本轮新增卡点。
7. 额外 `Accept` 与 `X-GitHub-Api-Version` 头 → model：无害标准请求头，结果范围未变；页面无需逐项列出。
8. “必要字段”无模板 → model：页面下段已列 `query_scope`、三计数、`page_complete`、原始状态与 `description`；读者表格式符合，真正缺口是这些字段没有落到 `result.md`（见下）。
9. 4.5 KB `statuses.json` 误当记录 → model：读者按 `total_count=0` 与空数组自纠，正确。

### 读者未意识到的问题

- `result.md` 未更新：本轮只新增 u1，产物仍是 `63970ab` 的版本，三来源表没有 `query_scope`，与修改要求 #1“只修 `result.md` 及同 ID 支撑记录、从留存投影补齐 `query_scope`”不符。
- 产物与本轮证据的观察时间不一致：`result.md` 写 02:26 UTC（上一轮），本轮 u1 是 03:47 UTC；读者没有指出。
- 修改要求 #2 要求保留“实测做通”与“交付仍需补项”的区别；u1 本轮结论直接写“页面任务已完成”，没有说明交付仍缺项。
- 本轮按页面全文重新取数、新增三次 CI API 调用，与修改要求 #1“不重跑或新开读者实测、不新增 CI API 调用”冲突；这是工作流派发与该任务要求不一致，不是数据错误，但结果是要求的产物修订没有做。

### 未验范围

- 有记录时的 `description` 与链接保留路径，以及后续页与分页缺口路径（三源 total 0、无 `Link`，未触发）。
- GitHub 查询上限、必需检查规则、该 SHA 是否本应产生 CI；只做了一次当前时刻重取（04:05Z）。
- 能否合入不在本结论内。
