# A-FRONTIER-SELECTION-001 · 选择下一项值得真实采用的强开发方法

id: A-FRONTIER-SELECTION-001
owner: dot-A
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 30210eb122fc5c93eee59744cef1b8dbe192434a
result_branch: relay/a-frontier-selection-001

## 目标

按 TASKS 当前重点恢复约两成前沿发现：面向完整功能交付、连续修改和开发周转，找当前值得采用的更强做法，交有证据的选择与下一实际消费者，不交热度列表。优先读近三至六个月头部团队、真实使用者和当前开源实现，成熟方法也可胜出；不以发布日期新或模型品牌强作为结论。

本任务是选择与真实任务准备，不先规定必须找到某工具。把当前原生 Agent＋源码／项目反馈作为基线，与有竞争力的候选比：具体多获得什么能力、适合什么开发条件、维护和人介入代价是什么、哪里开始、什么时候不用。能形成明确选择即可，不要求行业最优证明或正式方法 A/B。

## 先去重，再找增量

先看 13、15、23 及近期 local-jobs：MDX、Memos、Memoh、Sphinx、Maka／Storybook 和 beets 均已有结果，不再逐案例扩测试。MCP 资料工具仍未试用，不从故事通过推断其收益；Memos／Memoh／Maka 的实际应用欠项按 TASKS 保留，不能换工具绕过身份或浏览器待决项。04 试点待双方接收，批量正文改写暂停，不接管 B。

已筛过的低优先线索也不重复包装：普通 mutation／属性测试及 Meta ACH 已覆盖；testmon 已实试；Schemathesis 的真实 API 状态链可能有价值，但本轮未找到已获准、可重置状态且有自然未决功能的消费者，Formbricks 现成 CI 仅 examples、微软 dataviewer 已合入且有数据集 skip。没有新的真实需求，不为它另造服务或自动注册身份。cspell 未采用和通用修库系列不重启。

## 调查与交付

1. 以会改变开发者选择的能力缺口检索，不按工具名单轮询。官方能力、真实实践者／社区（至少一个中文渠道作交叉线索）与开源代码／issue 三方对照；看负反馈、撤回和真实产物，而不只 README。已有固定资料直接复用，只查新缺口。
2. 值得继续的候选，给一个自然、可消费的应用任务：仍未解决的真实需求、已有实现／PR 是否已覆盖、实际入口、可复用依赖与检查、必要数据／权限及明确完成条件。优先免费本地 CLI／真实组件或已有测试入口，不要求新账号、真实私有数据、持久服务或特权设施。
3. 交一项最有价值的条件推荐；若来源或消费者不足，给具体负结果与恢复条件，不凑数量。可先做已授权的窄试来决定是否值得采用，但只测试决定性未知，不扩为边界矩阵；完整产品实施另由负责人按本结论续接，避免与已有成果重叠。
4. 重要结论说明实际读到和试到什么、什么改变了选择；正式方法对照不做。来源显示时间与执行时间分开，记录渠道截止、不可读入口与实际模型响应字段，别把摘要或别名升级为原文／后端证明。

只写本任务；资料充分且有实际增量时可改 13 对应候选入口，不做普遍文案改写、不改 TASKS／其他专题、不新增目录或编号。原始输出留私有工作区，公开不含身份、私人路径、凭据或无关材料。沿已配置正常原生 Workflow，复用一次有效独审；单次运行最多两小时，不扩费用／权限，不重试明确拒绝。仅推指定结果分支；适用检查、公开文件／实际新增提交身份和空白扫描后回固定 SHA，状态 `review_ready`。

认领：dot 本地协作；2026-10-25T11:43Z。来源 main 固定 `bbea6d2`；先复用现有结果去重，再沿正常原生 Workflow 调查、选择与准备一个自然消费者。只交条件推荐或具体负结果，不启动完整产品实施、不重开旧案例／04 批量／B 任务；仅推指定结果分支。

## 选择与消费者准备结果（2026-10-25）

**状态**：`review_ready`。本任务只做选择与消费者准备：未实现 #2946、未运行 datasette 测试、未提交上游、未 commit/push。公开改动仅本文件与 `docs/13-frontier-radar.md` 的一条候选入口；Git 提交、推送与独立复核由 root 处理。

**执行通道／模型**：Claude Code 原生 Workflow（focused-discovery → select-and-prepare → delivery-check），本席为第二段；未启嵌套 reviewer、Explore、其他 Workflow 或 CLI 模型。请求别名 `deepseek-v4.1-flash[1m]`；检查到的原始流 assistant `message.model` 均为 `deepseek-flash`，客户端 stderr 为 `[claude-code:unrecognized_model]`。别名、请求字段与实际响应字段分开，不用别名推断后端。探索读取截止 2026-10-25（UTC+8）；本段执行自 11:46Z 起，至约 12:05Z 记录，远低于单次 2h 上限。

**delivery-check 修正**：已按机械检查修正 #2994 fallback 事实（其已有 open PR #2995，经 GitHub timeline／PR API 复核）、coverage 环境缺 `pytest-cov`、全量门禁未含扩展编译／lint／插件 shell、`DatasetteError` 需显式 `status=400`；并补记 pip 缓存与 exit-code 日志留存限制。主选择与 #2946 消费者准备未因此改变。

### 条件推荐

**在已有测试套件的连续修改中，给 Agent 加一层“变更行覆盖证明”：用 `diff-cover` 从本次 diff 生成可机器读的未执行行清单，并可用 `--fail-under` 阻断；选测复用已有入口，全量套件仍是最终兜底。** 不新增 TDD 流程，不做服务化 TIA。基线仍是原生 Agent＋源码／项目反馈；本项只补“改动行是否被执行”这一层，不替代测试、评审或全量。

**相比基线（原生 Agent 直接跑相关测试或全量并读输出）**，本项多的是：不依赖 Agent 主动去读覆盖率、给出逐行未执行清单、可机器回灌并阻断；代价是多一次覆盖率插桩和一个包装命令，且仍需人判断 ignore 注释与断言强度。

| 决策项 | 内容 |
|---|---|
| 能力增益 | 把“测试跑绿”升级为“本次新增／修改的哪些行没有任何测试执行”；JSON `src_stats[*].violation_lines` 可直接回灌 Agent，`--fail-under` 可让门失败；必须使用当前源码的新报告，未测量行不算已覆盖。 |
| 适用条件 | 项目已有可运行测试与覆盖率报告；变更跨共享模块，或全量套件有实际等待成本。 |
| 默认起点 | `coverage xml` → `diff-cover --compare-branch=<固定基线SHA> --include-untracked --fail-under=<阈值> --format json:<file>`；先跑相关测试，把未覆盖行回灌 Agent，最后全量。 |
| 强替代 | 套件几分钟内跑完：直接全量／分层分片；monorepo 已有可靠构建图：`nx affected`／Bazel；只关心断言强度：mutation testing（本仓已覆盖，不重复）；已有 TIA 历史、队列积压及并发／存储维护需求时，再比较 listener＋selector 的服务化成本；Anthropic 的六个月 CI 增长 25 倍仅是该案例背景，不是最低适用规模（内部实现，无公开准确率／成本指标）。 |
| 维护与人介入 | 需让 coverage 覆盖被改源文件；新文件必须 `--include-untracked`；比较基线要固定 SHA，不能用会前进的 `main`；不传 `--fail-under` 时只报告不阻断（本次已验）；本次新增的 `# pragma: no cover`／ignore 注释可刷绿，包装脚本要拒绝；行覆盖≠断言覆盖，flaky 与真回归要分开；人仍需看实际子集、未覆盖行与全量结果。 |
| 哪里开始 | datasette 固定 `a8e13cc` 的 #2946：先建全绿基线，做最小 opt-in typed-param 切片，跑相关测试，`coverage xml`＋`diff-cover`，再全量（含 serial）。 |
| 什么时候不用 | 没有测试或测试稀疏：先补测试；目标文件明确且套件快：直接跑目标／全量；编译器／解释器／VM 或强共享核心：全量／分片；动态耦合重、静态图不可靠：全量兜底；不要用本门替代最终全量。 |

### 为什么选它：去重与三方对照

- **仓内去重**：13 已有 `pytest-testmon` 选测（2.2.0 历史重放）与 Playwright／Storybook 等入口，15 有 testmon 任务卡；全仓检索没有 `diff-cover`／“变更行覆盖”入口（仅一篇 baml 记录提到 Codecov patch 23.07%，且收集方法未核）。本项是新增量，不是 testmon 重跑，也不重开 MDX／Memos／Memoh／Sphinx／Maka／Storybook／beets。
- **官方／一手**：diff-cover 10.6.0（PyPI 2026-09-22，Apache-2.0，Python >=3.10，wheel／sdist）；datasette 固定 SHA 的 CI 与 `codecov.yml`；#2946 当前状态。
- **实践者／社区**：Hammant 2026-10-20 指出 Agent 猜测试会漏反射、DI、注解／配置、字符串键、序列化、SQL、跨进程，压力下还会少跑并宣布成功；Anthropic 2026-09-14 官方文章把 TIA 作为 agentic coding 的 CI 问题，但未给选择准确率、逃逸缺陷、CI 时长或成本指标，且无开源实现，只能作问题与架构依据。
- **中文交叉线索**：CSDN 2026-10-24 的运维规则（漏斗叠加、红线不可跳过、PR 子集＋夜间全量、逃逸率 <5%、L1/L2/L3 灰度）；作者只在 7 用例最小仓库验证脚本，非受控实验，只作交叉线索。linux.do 原帖读取失败（`Socket is closed`），只记摘要，不当原帖证据。
- **研究**：TDAD arXiv 2603.17973（2026-03-18；本段重取摘要确认）报告回归 6.08%→1.82%，仅加 TDD 流程提示升至 9.94%；仓库 MIT、仅 Python、两个小模型、100／25 实例。发现阶段读全文记录 Phase 1 解决率 31%→29%，不能把回归下降写成普遍净收益。
- **选择变化**：Anthropic 把问题提升为官方 CI 问题但不证明净收益；Hammant＋TDAD 支持“补受影响测试上下文，不补 TDD 流程”；CSDN 补上红线与逃逸率；siftwise 自报 rdflib 仍选约 99%、节省主要来自 lint-only PR，TDAD 解决率下降。因此不采用 TDAD／siftwise／Anthropic 服务，只采用 diff-cover 作为本地证明层。

关键来源落点（复用本次已读内容，未再调查）：[Anthropic TIA 扩容案例](https://claude.com/blog/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic)、[siftwise 的 PyPI 自述](https://pypi.org/project/siftwise/)、[DEV 的 diff-cover 实践者教程](https://dev.to/gabrielanhaia/your-agents-diff-has-lines-no-test-runs-find-them-with-diff-cover-before-you-land-42j)。团队自述、工具作者自述与实践者教程各守其证据范围；中文线索与不可读项见上文及边界。

### 决定性窄试（实际执行）

在私有 scratch 建独立 git 仓库，`pip install --target` 安装 `diff-cover==10.6.0`（只把包写入本次 scratch；pip 仍写入默认 wheel 缓存，未改全局配置或安装；若严格按无全局写入口径，下次应加 `--no-cache-dir`；无服务或账号）。基线提交只有 `app.py`；工作树新增 `classify()` 分支，手写 Cobertura `coverage.xml` 把 `return "nonpos"` 标为 0 次执行；再新增未跟踪 `newfile.py`，其 `return 0` 标为 0 次。

| 命令 | 实际结果 |
|---|---|
| `diff-cover coverage.xml --compare-branch=HEAD --format json:... --fail-under=100` | 退出 1；`app.py` 75%，`violation_lines [8]`、`covered_lines [5,6,7]`、`total_num_violations 1` |
| 同命令去掉 `--fail-under` | 退出 0，仍报告 `Missing lines 8` → 阻断必须显式设阈值 |
| 不加 `--include-untracked` | 只统计 `app.py` 4 行；未跟踪 `newfile.py` 完全不出现在 `src_stats` |
| 加 `--include-untracked` | 统计 8 行；`newfile.py` 出现且 `violation_lines [4]` |

这验证了“机器可读未执行行＋可阻断”的机制，也验证了两个常见误用点；退出码来自当次运行输出，仅 JSON 与结果留存，未单独留存 stderr／exit 日志。未验证真实项目速度、模型质量或净收益。`raw.githubusercontent.com` 在本机因 schannel 吊销检查失败（`CRYPT_E_NO_REVOCATION_CHECK`），改用 GitHub contents API 取同一 SHA 源码；PyPI 同样以 `--ssl-no-revoke` 取数（只关闭吊销查询，保留证书链校验）。两处传输限制均记录，不把取数失败当内容不存在。

### 自然消费者（已核当前状态）

| 项 | 事实 |
|---|---|
| 项目／许可 | `simonw/datasette`，Apache-2.0，默认 `main`，`requires-python >=3.11` |
| 固定源码 | `a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b`（author 2026-10-22T21:18:35Z；committer 21:19:28Z） |
| 未决需求 | #2946「Support for SQLite non-string parameters」open、label `research`、milestone「Datasette 1.0 stable」、1 条评论；正文：`?param=` 全按字符串传，`where age > :age` 靠列类型 coercion 可用，`where age + 1 > :age` 失效，问是否需要机制传整数；评论提议 `$id::integer`／`?age::int=200`，并警告 URL escaping |
| 已有实现／去重 | #2946 无 PR；timeline 只有 labeled／milestoned／commented，无 cross-referenced／connected；GitHub PR 搜索 `2946` 为 0 条。#3004 已有 open PR #3006，避开；#2994「未知 `?_search*` 返回 500 而非 400」已被 open PR #2995（`Fixes #2994`，2026-10-10 创建、2026-10-20 更新，非 draft、mergeable）覆盖，不作为 fallback |
| 实际入口 | `datasette/views/database.py` 769–792（`params = {key: request.args.get(key) ...}`；`named_parameter_values` 缺省 `or ""`）；`datasette/filters.py` 206–214（已有 `_coerce_numeric_filter_value` 先例）；`datasette/utils/__init__.py` 1436–1441（`derive_named_parameters` 兼容入口） |
| 相关测试 | `tests/test_numeric_filter_values.py`、`tests/test_filters.py`、`tests/test_queries.py`、`tests/test_stored_queries.py`、`tests/test_api.py`、`tests/test_table_api.py`、`tests/test_table_html.py` |
| 检查入口 | `.github/workflows/test.yml`：Python 3.11–3.15；仅 3.14 跑 `--cov=datasette --cov-config=.coveragerc`，先 `pytest -n auto -m "not serial"`，再 `pytest -m "serial" --cov-append --cov-report xml:coverage.xml`，随后 HTTPS server shell 测试；`codecov.yml` 的 project／patch 均 `informational: true`，当前没有阻断性 patch 门 |
| 数据／权限 | 仓库内 fixture SQLite；`datasette.client` 或 `datasette --get`；不读真实用户库、不建账号／服务、不需要私有数据 |
| 规模 | 固定 SHA 下 84 个 `tests/test_*.py` 模块（共 112 个 `tests/` 文件，含 2 个 shell 脚本与 `test_templates/`） |

### 可接手起点（给实施端，不是本任务已实施）

1. 在独占临时目录 clone／fetch datasette，checkout `a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b`；使用已激活的本任务 venv，以下安装和运行均由同一 `python` 执行，不装全局服务：
   ```sh
   python -m pip install --no-cache-dir . --group dev
   python -m pip install --no-cache-dir pytest-cov diff-cover==10.6.0
   ```
   `dev` 组不含 pytest-cov 或 diff-cover；CI 也另装 pytest-cov。本任务窄试的 `--target` 目录不属于这个新消费者环境。
2. 先跑全绿基线，按 CI 的 3.14 覆盖命令生成 `coverage.xml`：
   ```
   pytest -n auto -m "not serial" --cov=datasette --cov-config=.coveragerc --cov-report=
   pytest -m "serial" --cov=datasette --cov-config=.coveragerc --cov-append --cov-report xml:coverage.xml
   ```
3. 做 #2946 最小 opt-in 切片（建议先只支持 `int`；字符串行为不变；因 #2946 仍是 `research`，先交设计说明，不直接改默认行为）。
4. 改代码后，为**当前工作树**重建相关测试的覆盖率，不能复用第 2 步的基线 XML。原项目普通 pytest 不会自动更新该文件；下列是交接命令，本任务尚未在 datasette 执行：
   ```sh
   python -m coverage erase
   python -c "from pathlib import Path; Path('coverage.xml').unlink(missing_ok=True)"
   python -m pytest tests/test_queries.py tests/test_stored_queries.py tests/test_numeric_filter_values.py --cov=datasette --cov-config=.coveragerc --cov-report=xml:coverage.xml
   python -m diff_cover.diff_cover_tool coverage.xml --compare-branch=a8e13cc489b41f2f9a5aa691f5eb1bedf99a0e0b --include-untracked --fail-under=90 --format json:diff-cover.json
   python -c "import json; r=json.load(open('diff-cover.json')); assert r['total_num_lines'] > 0, 'No measured changed lines: no coverage evidence'"
   ```
   每条命令失败先处理失败，不用旧文件继续报绿；相关文件集合随实际修改调整。90 是示例阈值，接手时按项目既有约定确定，不把它当普适门槛。把 `src_stats[*].violation_lines` 回灌 Agent；新增产品代码若不在 XML 测量范围中，或测量改动行数为零，记为无覆盖证据，先核数据路径与范围，不能拿 diff-cover 的空分母 100% 证明执行。新增 ignore 注释仍须人工核用途与断言强度。
5. 再按 `.github/workflows/test.yml` 跑完整门禁：编译扩展（`gcc ext.c … ext.so`，否则 `test_load_extensions.py` 的 3 个用例按 skipif 跳过）、`pytest` 全量（含 serial 与 HTTPS shell 测试）、`tests/test-datasette-load-plugins.sh`，以及 Black／Ruff／cog／blacken-docs；交回实际子集、未覆盖行、失败路径。不要用本门替代全量。

### 明确完成条件

1. 文档化的 opt-in typed-param 语法，至少支持 `int`（可再加 `float`／`bytes`），字符串参数行为不变。
2. fixture DB 的真实请求中 `where age + 1 > :age` 返回预期行；非法类型显式返回 `DatasetteError(..., status=400)`（默认 500，必须写明），不是 500。
3. 新增／修改测试；`coverage.xml`＋`diff-cover` 显示新分支被执行；按 `test.yml` 的完整门禁（含扩展编译、lint、serial、HTTPS 与插件 shell 测试）通过。
4. 文档更新；无新服务／账号／私有数据／上游 PR。

**条件与恢复**：#2946 是 `research`，维护者尚未决定语法；第一交付应是“设计说明＋opt-in 原型”，不是改默认行为。若维护者不接受，需另选一个经 issue timeline／PR 搜索确认无覆盖的 open issue，再套用同一验证契约；#2994 已被 open PR #2995 覆盖，不可再用。不接 #3004（已有 open PR #3006）。

### 未读／未试与边界

- **未读原帖**：linux.do topic/1769057 直接读取失败（`Socket is closed`），只有搜索摘要；不把摘要升级为原帖或社区权威。微信／B 站 TDAD 只有搜索片段；CSDN 的 TDAD 解读为二手，未用其数字作独立证据。
- **本段未重读全文**：Anthropic 2026-09-14、Hammant 2026-10-20、CSDN 2026-10-24 采用发现阶段的固定读取；本段重取了 TDAD 2603.17973 摘要并确认 6.08%→1.82%、TDD 9.94%。发布日期与读取时间分开记录，不把摘要当原文。
- **未运行**：datasette 测试、真实项目 diff-cover、其他覆盖率格式（Clover／JaCoCo／LCov）、模型效果对照、正式方法 A/B。窄试只覆盖 Cobertura XML。
- **版本快照**：diff-cover 10.6.0 的版本、许可、上传时间本次由 PyPI JSON 核；star 数与 GitHub release 未在本次重核，不写入结论。
- **公开写入**：仅本任务文件与 13 的一条候选入口；未改 TASKS／15／23／04 或其他专题，未新增目录／编号／台账，未 commit／push。Git 回执与最终发布由 root 处理。

**下一步**：请 root 在本调用后安排一次全新上下文独立复核；通过后由负责人决定是否接收 13 入口，并把 #2946 交给实施端（替代消费者须先重新核查无 PR 覆盖）。完整产品实施不在本任务范围。

## 本地执行端独立审查修订

新上下文只读审查发现三处实际问题：改动后可能复用旧 XML、新环境漏装 diff-cover、从单个公司增长推导排他规模门槛。现已补齐同环境的固定版本安装、当前工作树覆盖率重建与无测量结果处理，并按实际 TIA 积压／维护需求作条件选择；原始发现保留，不重跑合成窄试或 datasette。报告中的退出码虽未单独存成日志，仍在原 Workflow 命令输出中保留；JSON 工件只证明合成报告消费，不是实际覆盖率生产链。

本地执行端最终独立复核：原调用实际起止 2026-10-25T11:45:48.512Z—12:13:43.636Z（UTC），正常退出。同一独立只读审查者复核三项修订，确认旧覆盖率复用、漏装工具、排他规模门槛均已关闭，未新增调查或探针。实际模型字段 `deepseek-flash` 与请求别名分别保留。结论支持文档与准备结果交接；datasette 产品测试、当前项目覆盖率生产链、速度／维护净收益及模型效果均未执行或未证明，仍由负责人决定下一实施任务，#2946 的语法设计未获上游决定。

最终回传：结果分支 `relay/a-frontier-selection-001`，固定提交 [`099a98d54f53c20db18a1c1f6a6637534790712c`](https://github.com/dbvv1/a1dbv/commit/099a98d54f53c20db18a1c1f6a6637534790712c)，保留最新 main `7c784cc` 父链；相对 main 仅 13 候选入口与本任务。最终文档 377 文件、公开内容／实际新增提交身份 638 文件、空白检查通过。main 只回传原任务，13 入口由 dot-A 接收，状态 `review_ready`；未启动完整产品实施，合成窄试与真实项目未验范围不混用。

## dot-A 接收（2026-10-25 12:37 UTC）

接收固定 `099a98d54f53c20db18a1c1f6a6637534790712c` 的发现、合成报告消费与消费者准备，复用已有独立审查及三项修订复核；13 入口缩为读者可直接取用的起点。diff-cover 仅是候选反馈层，不称真实开发收益已证；后续以 datasette 的真实参数类型需求消费它，不再扩合成探针。历史取数中的 `--ssl-no-revoke` 不沿用；后续保持正常 TLS 校验，证书阻塞不绕过。
