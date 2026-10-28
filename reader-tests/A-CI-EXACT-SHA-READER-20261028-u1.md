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
