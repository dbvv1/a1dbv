# A-UPSTREAM-DATASETTE-DELTA-READER-20261107 读者测试记录（u1）

- 执行时间：2026-11-07T23:17Z
- 被测页面：`docs/decisions/upstream-contributions.md@a25b151c8cfbe38121d6de604a485146a0170cc8`
- 对象：`simonw/datasette` 的 #2946、#3015，以及新输入 #3038
- 能力边界：只读公开接口与源码；不运行应用、测试或浏览器，不写 GitHub，不安装依赖

## 做到哪一步

按页面《第一步》的投稿前核查走完，并给出一个具体动作：

1. 核对任务附页与固定版本：附页 70 行，与 `a25b151c` 的页面文件逐行 diff，退出 0。
2. 读 Datasette 当前贡献规则（`docs/contributing.rst@3cb0f1b`），确认没有 CLA／DCO／vouch、没有 AI 政策、没有 PR／issue 模板。
3. 重核 #2946／#3015／#3038 的当前状态、正文、讨论、文件、提交、check-run、workflow run、里程碑与 release；记录实际提交和日期。
4. 读 #3038 的完整差分与 `main` 上的相关源码，判断它是否覆盖 #3015 的行为。
5. 做一次只读合并核对（`git merge-tree`），把文本冲突与语义重叠分开。
6. 在 `docs/collaboration/local-jobs/artifacts/A-UPSTREAM-DATASETTE-DELTA-READER-20261107/result.md` 写出当前下一步、依据、变化、仍缺的决定、卡点和未运行范围。

结论不是“继续实现”或“关闭”二选一：**继续 #3015，但先做有边界的 rebase + 冲突解决 + 跨特性回归 + 受影响检查；设计方向与 CI 批准仍要维护者决定。**

## 产物在哪

- `docs/collaboration/local-jobs/artifacts/A-UPSTREAM-DATASETTE-DELTA-READER-20261107/result.md`（任务要求的唯一新增结果）
- `reader-tests/A-UPSTREAM-DATASETTE-DELTA-READER-20261107-u1.md`（本记录）

未改页面、旧记录、TASKS 或产品代码；未提交、未推送。

## 每个卡点（按页面原句）

| 页面位置与原句 | 卡在什么／缺什么／做错什么 |
|---|---|
| 《第一步》任务模板：“先只读当前 CONTRIBUTING、AGENTS、PR／issue 模板及其要求续读的规则” | Datasette 没有根级 `CONTRIBUTING.md`、`AGENTS.md`、PR／issue 模板，贡献规则文档是 `docs/contributing.rst`。按字面执行会误报“规则缺失”。我改为在仓库树里找等价入口，并把“实际规则文件是 docs/contributing.rst”记入结果。 |
| 《第一步》任务模板：“对照当前目标分支的相关源码，判断旧补丁是否已被覆盖或还剩独立缺口” | “覆盖”在“已合并的 PR 用另一种做法绕开同一限制”时没有定义。#3038 用前端 SQL 字面量内联绕开字符串绑定，但没实现 #2946 问的机制。只看标题和状态会误判为已覆盖；必须读合并差分和源码。 |
| 《有旧补丁时：先核上游，再决定续做》：“已合并的实现覆盖了同一行为，就收起重复实现；关联 PR 尚未合并时，分清它拟覆盖与明确不覆盖的行为……先就重叠和剩余差量协调。” | 只给了“已合并且同一行为”和“关联 PR 尚未合并”两种情形。#3038 是“已合并、改了同一段代码、但没有实现同一行为”。页面没有对应规则。我按“仍有独立失败路径时按项目要求推进”处理，并用 `git merge-tree` 确认文本冲突只在 `tests/test_playwright.py`。 |
| 《第一步》任务模板：“区分：项目是否接这类贡献、是否允许使用 AI、谁必须亲自写／提交、CLA／DCO／vouch 等个人步骤、验证要求、后续响应，以及当前工具是否获准发出。” | Datasette 对 AI、CLA／DCO／vouch、谁必须亲自提交都没有明文。只能把 AI 准入记为未知，不能把维护者自己的 #3038（Claude Code 生成）当成外部贡献的准入规则。页面另一处“规则沉默或访问失败的事项保留未知，不补成‘允许’”在任务模板里，不在规则表，容易漏读。 |
| 《有旧补丁时》：“本仓 Goose LiteLLM 候选……”一节 | 那是本仓自己的历史例子，不能当作 Datasette 的判断依据。本次只把它当方法示例（先核上游再决定续做），没有搬用其结论，也没有读它链接的旧候选记录。 |
| 任务输入段（`job.md` 目标与输入）：“接收端须把完整输入的完整页面原样附入本次任务；先核实际附页与固定版本一致，缺页即报告入口卡点” | 工作树里没有 `artifacts/A-UPSTREAM-DATASETTE-DELTA-READER-20261107/input.txt`。但页内附文完整且与 `a25b151c` 逐行一致，所以不是缺页；我把它记为“接收端独立 input 产物缺失”，没有自行取回后冒称已附入。 |

### 我做错或走弯的地方

- 一开始按 `job.md` 的路径找 `input.txt`，发现不存在；随后改用 `job.md` 内附页与本地固定版本比对，而不是去远端抓页面。
- 一开始推测 #3038 的 `_query_page_data` 会收到 #3015 的 typed 键（`age::int`），从而让 `column-stats.js` 的 `inlineParams` 报 `No value for parameter :age`。做合并树后纠正：合并结果传给 `_query_page_data` 的是基名 `named_parameter_values`，所以这条不成立；真正的问题是 `QueryContext.named_parameter_values` 被换成了 typed 键，违反 `docs/template_context.rst` 的稳定契约。
- `curl` 取 `.diff` 时第一次没加 `-L`，得到 0 字节；随后加 `-L` 重取。

## 页面之外还去翻了什么

只翻了任务允许的目标项目公开材料：

- GitHub REST API：`simonw/datasette` 仓库信息、最新 `main` 提交；#3015／#3038 的 PR 元数据、评论、review、提交、文件、check-run、commit status、workflow run；#2946 的 issue、labels、milestone、timeline；提及 2946 的搜索；release 列表。
- 固定 SHA 的原始文件：`docs/contributing.rst`、`docs/sql_queries.rst`、`docs/template_context.rst`、`datasette/views/database.py`、`datasette/templates/query.html`、`.github/workflows/test.yml`、`playwright.yml`、`prettier.yml`。
- 两个 PR 的 `.diff`。
- 只读合并核对：`git clone --filter=blob:none` + `git fetch` 分支 head + `git merge-tree --write-tree main a6f3ade`。

没读：PR 正文链接的 `A-DATASETTE-TYPED-PARAMS-001.md` 实现报告、任何 a1dbv 历史处置、任务结果、研究记录、作者解法或其他读者答案。为定位输入文件列过 `docs/collaboration/local-jobs/artifacts/` 的目录名，但没有打开其中任何旧记录。

## 没跑的

- 没有跑 Datasette 的 Python／Playwright 测试、没有启动应用或浏览器。
- 没有批准或触发 #3015 的 6 个 `action_required` workflow run。
- 没有 rebase／push、没有评论 #3015、没有新建 issue／PR／fork。
- #3015 正文里的本地测试数字没有复核；上游 CI 仍无结果。

## 核对（独立验证，2026-11-08）

**结论：本卡验收通过。** 读者实际附页与固定版本逐行一致；当前规则、PR 元数据、相关源码、合同文档与结论所引证据均独立复核成立；结论给出的是具体可执行的投稿判断，不是“规则看过了”。以下差异只影响表述精度，不改变判断。

### 附页与输入

- 从 `job.md` 的“页面全文”段提取 70 行，与 `a25b151c:docs/decisions/upstream-contributions.md` 逐行 `diff`，退出 0；文件 11,924 字节、Git blob `3bb764d2`。
- 只读参考副本 `repos/dbvv1__a1dbv` 中 `docs/collaboration/local-jobs/artifacts/A-UPSTREAM-DATASETTE-DELTA-READER-20261107/input.txt` 确实存在（`83bce683` 新增，117 行），其 `BEGIN/END EXACT PAGE` 段内的页面同样与固定版本 `diff` 0。工作树停在 `base_ref` `e2628b9f`，所以工作树看不到这份后加产物；附页本身完整，不构成缺页。

### 事实复核（自行取数）

- **#3015**：open／draft，head `a6f3ade`，base `a8e13cc`（author 2026-10-22T21:18:35Z），2 提交、7 文件、+1279/−30；`mergeable=false`、`rebaseable=false`、`maintainer_can_modify=false`；0 review、0 comment；6 个 workflow run 全为 `action_required`，check-run 为 0，combined status 仅 Read the Docs success；相对当前 main 落后 63 提交。
- **#3038**：已合入，作者／合并者 simonw，创建 2026-11-06T19:04:18Z、合入 2026-11-07T20:38:55Z，head `06fa5be`、merge `c261804`，7 提交、13 文件、+3554/−2；12 个 check-run 全 success；0 review；正文含 “Generated with Claude Code”；main 在 merge 后又走 4 提交到 `3cb0f1b`。
- **当前 main**：`3cb0f1b`（2026-11-07T22:32:41Z）。**#2946**：open、`research`、milestone “Datasette 1.0 stable”，1 条评论（asg017，2026-09-17）；timeline 唯一 cross-reference 是 #3015。
- **规则**：main 无根级 `CONTRIBUTING.md`、`AGENTS.md`、PR／issue 模板；`docs/contributing.rst@3cb0f1b` 无 CLA／DCO／vouch、无 AI 政策；其余要求与读者摘要一致。
- **合同**：`docs/template_context.rst` 明写模板上下文是稳定契约（到 Datasette 2.0），`named_parameter_values` 键为“去掉前导 `:` 的参数名”。
- **合并**：自行 clone 后 `git merge-tree --write-tree main a6f3ade`，退出 1；仅 `tests/test_playwright.py` 内容冲突（两处，第二处 2417–4219 行、约 1800 行），`database.py`、`query.html` 自动合并。合并树中 `_query_page_data(..., named_parameter_values, ...)` 收基名，`QueryContext(named_parameter_values=typed_parameter_values)` 收 typed 键，与读者一致。
- **代码**：分支把 `typed_parameter_values` 传给 `QueryContext.named_parameter_values`；`resolve_typed_parameters` 会 `del resolved[key]; resolved[base] = integer`，所以 `_query_page_data` 的 `params` 是整数；`column-stats.js` 的 `inlineParams` 缺键会抛 `No value for parameter :...`。读者对初判的纠正成立。
- **发布**：按发布日期最新是 `1.0a41`（2026-09-24，prerelease）；GitHub `/releases/latest` 返回稳定版 `0.65.5`。读者“最新 release 是 1.0a41”未说明 prerelease，但“两者不在任何发布版”成立。
- **符号**：main 无 `datasette/typed_params.py`、无 `::int`；`_typed_params` 只作为子串出现在 #3038 的测试名 `test_column_statistics_filter_links_and_typed_params` 中，不是该功能符号。

### 卡点归类

- 第 1 条（CONTRIBUTING／AGENTS／PR 模板）：**页面（前提未写）**。模板点名常见文件名，Datasette 用 `docs/contributing.rst`；读者已按等价入口处理，非阻塞。
- 第 2、3 条（“覆盖”在“已合并但用另一做法”下无定义）：**页面（缺规则）**。页面只写“已合并同行为→收起／关联未合→协调”，未定义第三种；读者读差分＋源码＋merge-tree 是正确做法。
- 第 4 条（规则沉默保留未知只写在任务模板）：**页面（放置问题，轻）**。读者已按模板保留未知。
- 第 5 条（`input.txt`）：属于工作树／`base_ref` 与只读参考副本的差异，不是页面文档缺陷；读者“不缺页”的判断正确，但“接收端产物缺失”的表述不准（见下）。
- 第 6 条（只读边界）：**既不是页面也不是读者能力问题**，是本次任务的执行边界；读者正确记录了“只能给出下一步、不能执行”。

### 读者没意识到的错误

1. 只读参考副本 `repos/dbvv1__a1dbv` 的 `docs/collaboration/.../A-UPSTREAM-DATASETTE-DELTA-READER-20261107/input.txt` 已存在（`83bce683` 新增，HEAD `b0ab5282`），且其 exact page 与固定版本一致；工作树停在 `e2628b9f` 才看不到它。“接收端的独立 input 产物缺失”不成立。
2. “main 上不存在这些符号”过绝对：`_typed_params` 作为子串出现在 #3038 的测试名 `test_column_statistics_filter_links_and_typed_params`；功能实现确实不存在。
3. “最新 release 是 1.0a41”未说明它是 prerelease；`/releases/latest` 返回 `0.65.5`。判断不受影响。
4. 任务要求记录本次模型／effort（不可核写未知），`result.md` 与本记录都没有该栏。

### 未独立验证的范围

- 未运行 Datasette Python／Playwright／浏览器／应用；未复核 #3015 正文中的本地测试数字；未实际 rebase／push／评论／批准 CI。
- “读者未接触旧答案”只能核产物与 scratch：产物没有旧答案内容，scratch 只含公开材料；无法从工具调用日志证明其从未打开旧记录。
- 本次结论只针对投稿判断，不证明投稿完成、程序测试通过或新版行为。
