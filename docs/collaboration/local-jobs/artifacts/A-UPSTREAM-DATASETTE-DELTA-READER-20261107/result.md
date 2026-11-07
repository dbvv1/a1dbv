# A-UPSTREAM-DATASETTE-DELTA-READER-20261107 结果

## 结论：继续 #3015，先做一次有边界的更新，不收起、不新开入口

**#3038 已合入，但它没有实现 issue #2946 问的机制。** 它只在列统计的前端把参数内联成 SQL 字面量，绕开 `/-/query.json` 把每个参数都按字符串绑定的限制。 #2946 仍 open、带 `research` 标签、挂在 “Datasette 1.0 stable” 里程碑，#3015 仍是唯一关联 PR，独立缺口还在。但 `main` 相对 #3015 的分支基点已前进 63 个提交（#3038 合入后又走 4 个），并改了同一段参数取值管线，旧分支已经不能合并，必须先更新。

## 当前可执行下一步

由补丁作者（fork 分支所有者）执行；维护者不能直接改这个分支（`maintainer_can_modify=false`，且 `rebaseable=false`，不能靠 GitHub 一键 rebase）。

1. 以 `main@3cb0f1b`（2026-11-07T22:32:41Z）为基线更新 `typed-sql-params-prototype@a6f3ade`。

2. 解决 `tests/test_playwright.py` 的两处冲突：
   - 导入写法：`main` 已改用 `import urllib.parse` 并多引 `re`，分支用 `from urllib.parse import parse_qs, urlencode, urlsplit`；
   - 两个 PR 在同一位置追加测试造成的大段相邻冲突（约 1800 行）。要把 `main` 的既有测试、#3038 的列统计测试和 #3015 的 typed 参数测试都保留，不要整段取一边。

3. 在合并结果上保持两处契约（`datasette/views/database.py`、`datasette/templates/query.html`）：
   - `_query_page_data` 继续接收按 SQL 基名键控的 `named_parameter_values`。本地合并树实测已是这样，`column-stats.js` 的 `inlineParams` 不会因为 typed 键报 `No value for parameter :age`。
   - `QueryContext.named_parameter_values` 不要改成 typed 键。分支当前把 `typed_parameter_values`（键如 `age::int`）传给这个字段；`docs/template_context.rst` 把它定义为“按去掉 `:` 的参数名键控”的稳定契约（直到 Datasette 2.0）。应让这个字段继续用基名，另加一个供表单回填使用的 typed 名字映射。

4. 补一条跨特性回归：带 `_typed_params=1` 的查询页打开列统计，确认 `:age` 以整数内联、统计查询正常；同时保留一个列统计失败路径的断言。

5. 按受影响范围补跑，不缩小原有覆盖：
   - `tests/test_typed_params.py`
   - `tests/test_playwright.py`（Chromium、Firefox、WebKit，按 `.github/workflows/playwright.yml` 矩阵）
   - query/stored-query 视图与 HTML 测试（含 `tests/test_html.py`、`tests/test_table_html.py` 中与 query 页相关的用例）
   - `docs/template_context.rst` 的生成与文档测试、Sphinx 构建
   - `black --check`、`npm run prettier -- --check`、拼写检查

6. 更新 PR 正文的验证记录，把 #3038 合入后的基线、列统计共存测试和本轮实际结果写进去。

**顺序上的取舍**：如果维护者先在设计方向上给否定，rebase 就没有意义。可以在 #3015（或 #2946）的公开讨论里先问“是否仍要服务端通用机制”，入口是 issue tracker。但发问不改变分支必须更新的技术要求；本读者无权代发，所以两条分开记录。

**不做**：不新开 issue／PR／fork，不评论、不签协议、不申请 CI。若维护者明确表示不需要通用机制，则停止重复实现、保留补丁并收起 #3015；这一步只能由维护者决定。

## 依据（本次实际所读）

- **页面固定版本**：`docs/decisions/upstream-contributions.md@a25b151c8cfbe38121d6de604a485146a0170cc8`。已提取并与任务附页逐行比对，diff 退出 0（70 行）。任务引用的独立 `artifacts/A-UPSTREAM-DATASETTE-DELTA-READER-20261107/input.txt` 在工作树中不存在，但页内附文完整且与固定版本一致，因此不构成缺页。
- **项目规则**：`docs/contributing.rst@3cb0f1b`（2026-11-07T22:32:41Z 的 `main` 头）。仓库没有根级 `CONTRIBUTING.md`、`AGENTS.md`、PR／issue 模板；贡献规则文档是 `docs/contributing.rst`。其中没有 CLA／DCO／vouch，也没有 AI 使用政策（规则沉默，记为未知，不推成允许）。要求：`main` 保持可发布、未完成功能放分支、理想提交同时带实现／测试／文档并链接 issue、新用户可见视图和文档一起更新；CI 覆盖测试矩阵、Playwright 三浏览器、Prettier、拼写、Pyodide、SQLite 版本。
- **#2946**：open，label `research`，milestone “Datasette 1.0 stable”，唯一评论是 asg017 的 `::int` 命名建议（2026-09-17）。
- **#3015**：open／draft，作者 dbvv1，head `a6f3ade`（2026-10-25T18:55:17Z），base `a8e13cc`（2026-10-22T21:18:35Z），2 提交、7 文件、+1279/−30；`mergeable=false`、`rebaseable=false`；相对 `main` 落后 63 个提交；0 review、0 comment；6 个 workflow run 自 2026-10-25 起停在 `action_required`，0 check-run，只有 Read the Docs 构建成功。
- **#3038**：open→merged，作者／合并者 simonw，创建 2026-11-06T19:04:18Z，合入 2026-11-07T20:38:55Z，head `06fa5be`，merge `c261804`，7 提交、13 文件、+3554/−2；12 个 check 全绿；0 review；正文含 “Generated with Claude Code”。`main` 此后又走 4 个提交到 `3cb0f1b`。
- **本地合并实测**（`git merge-tree --write-tree main a6f3ade`）：只有 `tests/test_playwright.py` 内容冲突；`datasette/views/database.py`、`datasette/templates/query.html` 自动合并。合并后的 `database.py` 把基名 `named_parameter_values` 传给 `_query_page_data`，把 typed 名 `typed_parameter_values` 传给 `QueryContext.named_parameter_values`。
- **#3038 的方向证据**：正文与 `column-stats.js` 注释都写明 “`/-/query.json` binds every parameter as a string”，所以列统计把参数改为字面量内联。这是维护者当前对同一限制的处理方式，不是新的通用机制。
- **发布状态**：最新 release 是 1.0a41（2026-09-24），早于 #3038 合入和 #3015，因此两者都不在任何发布版中。

## #3038 带来的具体变化

1. **基线变化**：#3015 从“落后”变成“不能合并”。必须在当前 `main` 上更新；`rebaseable=false` 表示不能靠 GitHub 一键 rebase。
2. **代码衔接点**：`main` 新增 `query_page_data`、`_query_page_data`、`column-stats.js`；它使用 `named_parameter_values` 内联查询参数。typed 参数分支必须保持这个字典的基名语义。
3. **新的设计对照**：维护者用前端字面量内联解决列统计的数值过滤，没有选择改 `/-/query.json` 的绑定类型。提案现在要回答“为什么还需要服务端通用机制”，例如 API 客户端、stored query、避免在客户端拼 SQL 字面量。
4. **证据不能复用**：#3038 的 12 个绿色 check 只属于 `06fa5be`；#3015 仍没有上游 CI 结果，PR 正文里的本地测试数字也不能当上游结论。
5. **未覆盖**：#3038 没有改 `datasette/typed_params.py`，也没有实现 `_typed_params` 或 `::int`；`main` 上不存在这些符号。

## 仍缺的决定与证据

- **维护者 simonw（设计）**：是否接受 `_typed_params=1` + `::int` 的契约、兼容取舍和“重复控制键也返回 400”的选择。这是 PR 自己列出的离 draft 前置条件。
- **维护者 simonw（CI）**：是否批准 6 个 `action_required` 的 workflow run。作者的首次贡献者 fork workflow 需要维护者或有写权限的人批准；在此之前不能把 CI 写成通过。
- **维护者 simonw（方向）**：面对 #3038 的内联先例，是否仍要通用 typed-binding 机制。若否，应保留补丁并收起 #3015，而不是继续加代码。
- **补丁作者（实现）**：`named_parameter_values` 的模板上下文契约怎么保持；是新增一个 typed 回填字段，还是只改表单 `name`。
- **补丁作者（验证）**：PR 正文列出的本地缺口（AF_UNIX 拒绝、HTTPS 脚本未跑、编辑器 delta 只跑 Chromium、基线 1–2 个失败）需要补跑，或由维护者明确接受。
- **分支写权**：`maintainer_can_modify=false`，冲突解决必须由作者完成。

## 实际卡点

- 页面《有旧补丁时：先核上游，再决定续做》只给了两种情形：已合并覆盖同一行为 → 收起；关联 PR 尚未合并 → 先协调重叠。它没有覆盖“已合并的 PR 改了同一段代码、用另一种做法绕开限制，但没有实现同一行为”。判断“是否覆盖”必须读合并差分和源码；本次靠本地 merge-tree 才把文本冲突与语义重叠分开。
- 页面《第一步》要求先读 CONTRIBUTING、AGENTS、PR／issue 模板；Datasette 这些文件都不存在，规则在 `docs/contributing.rst`。按字面执行会误报“规则缺失”。本次通过仓库树找到等价入口。
- 页面把“是否允许使用 AI”列为要核的项，但 Datasette 的规则对此沉默；只能保留为未知。维护者自己的 #3038 用了 Claude Code，但这不能推出外部 AI 贡献的准入规则。
- 任务要求的 `artifacts/A-UPSTREAM-DATASETTE-DELTA-READER-20261107/input.txt` 在工作树中不存在；页内附文已核对为固定版本原文，因此不构成缺页，但接收端的独立 input 产物缺失。
- 本读者按边界只做只读：不能 rebase／push、不能评论、不能批准 CI、不能跑测试或应用。

## 页外帮助与未运行范围

页外只读了任务允许的目标项目公开材料：GitHub REST API 的 PR／issue／评论／提交／文件／check-run／status／workflow run／milestone／release，`raw.githubusercontent.com` 上固定 SHA 的 `docs/contributing.rst`、`docs/sql_queries.rst`、`docs/template_context.rst`、`datasette/views/database.py`、`datasette/templates/query.html`、三个 workflow YAML，以及两个 PR 的 `.diff`；另用 `git clone --filter=blob:none` + `git fetch` + `git merge-tree` 做只读合并核对。没有安装依赖，没有运行应用、测试或浏览器。

未读：PR 正文链接的 `A-DATASETTE-TYPED-PARAMS-001.md` 实现报告、任何 a1dbv 历史处置、任务结果、研究记录、作者解法或其他读者答案。

未运行：#3015 的本地测试、上游 CI、浏览器矩阵、发布验证。以上结论只针对投稿判断，不证明投稿完成或新版行为。
