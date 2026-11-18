# 读者记录：A-MIGRATION-CATTRS-DECIMAL-READER-20261114 · u1

- 日期：2026-11-18
- 页面：`docs/decisions/migrations.md@6764ab019c94d63fe02af06596a5c0e1f8d9446f`（随任务附全文；工作区 HEAD 与页面哈希一致）
- 身份：未参与该页或本任务先前运行的新读者；只照该页执行

## 做到哪一步

消费者接收验证已做完，未提交、未推送、未改页面。

1. 重新核对固定源码：PR head 仍为 `2e883761ca61b076c3de45a5d976952226347c2c`；任务基线 `e9239b7082206f18e3cec873b11451aff35beb9c`。发现 PR 的父提交 `bde101a5a67997c61a3ee0e971386a82fe141d4e` 就是与基线的 merge-base，PR 落后基线 6 个提交。
2. 按页面“已有 PR 只接必要差量，保留主干新增功能”，在基线上 cherry-pick PR 的唯一提交，得到整合提交 `653efccbf73ab5890d7480986e3815e14ae707f4`；仅 `HISTORY.md` 的 NEXT 段冲突，保留 PR 的 Decimal 条目与主干的 typed-deque 条目。
3. 分别构建基线、PR head、整合三棵树 wheel，在三个独立 CPython 3.12.15 venv 中各只安装一个 wheel。
4. 用同一消费者（attrs `Order(amount: Decimal)`）对 JSON、PyYAML 做前后对照：`19.99`、`0.1`、40 位有效数字值、`1.10`；核 dumps 为字符串、loads 为 Decimal 且 `as_tuple()` 保留；另测数字输入、无效字符串、纯非 Decimal 对象与混合字段对象。
5. 跑消费者 pytest、cattrs 原生 `tests/test_preconf.py`，并用基线测试文件对三个 wheel 跑 typed-deque 回归。
6. 写结果 JSON、可复跑命令、`result.md` 和本记录。

产物：

- `artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/consumer/test_decimal_consumer.py`
- `artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/results/base.json`
- `artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/results/pr-head.json`
- `artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/results/integrated.json`
- `artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/results/metadata.json`
- `artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/commands.md`
- `artifacts/A-MIGRATION-CATTRS-DECIMAL-READER-20261114/result.md`

结果摘要：基线 wheel 的 Decimal 用例全部失败（JSON dumps `TypeError`，PyYAML `RepresenterError`，loads `StructureHandlerNotFoundError`）；PR head 与整合 wheel 的字符串路径全部保留精度，无效字符串抛 `InvalidOperation`（类级为 `ClassValidationError` 包裹）；数字输入因后端先解成 float 而产生二进制展开，单独记录、不归因于候选。PR head 原树丢掉主干 6 个提交，typed-deque 回归 6/11 失败；整合树 11/11 通过。

## 页面卡点

1. **“依赖大版本升级／接收旧 PR | 先核所有仍支持入口的版本契约，再读跨版本指南、用当前包管理器更新声明和锁文件”**
   - 缺什么：这一格没有区分“依赖大版本升级”和“接收代码 PR”。本 PR 不改依赖声明，也没有跨版本指南可读；我判断不需要改 `uv.lock` 或依赖声明，只接代码差量。页面若直接照字面执行，容易被引到无关的依赖更新。
   - 建议补一句：只接代码差量时以提交为粒度，不升级依赖、不改锁文件。

2. **“已有 PR 只接必要差量，保留主干新增功能。”**
   - 缺什么：只给目标，没给检查与执行方法。我自行用 `git merge-base`、`git rev-list --count` 判断祖先后，用 cherry-pick 接单个提交，并手工解决 `HISTORY.md` 冲突。页面没写“PR head 不是基线祖先时怎么办”和冲突取舍规则。
   - 建议补：先核 `merge-base` 与落后提交数；在基线上 cherry-pick PR 独有提交，冲突处保留主干与 PR 两侧的新增内容。

3. **“发布 wheel／库时从独立环境安装产物，不拿源码目录的成功代替发行包。”**
   - 缺什么：没有提醒候选 wheel 的版本号可能因分支落后而低于基线。实际构建出 PR head 为 `26.2.2.dev15`、基线为 `26.2.2.dev20`；若按版本号大小判断会把候选认错。我改用 git 提交与 wheel SHA-256 标识。
   - 建议补：版本号由提交距离生成时，以提交/哈希为准，不按 PEP 440 版本比较新旧。

4. **“先确认原生环境和源码完整，再按实际交付形式检查。……Windows 使用原生解释器和短工作路径，不用 WSL 结果替代。”**
   - 缺什么：本任务指定的临时目录较长，但没有触发路径长度问题，所以不算阻塞。我按要求用原生 CPython 3.12.15，没有用 WSL。记录为已满足。

5. **“先选一个真实受影响的消费者，记录原结果；试改后用同一输入核正常与失败路径。”**
   - 缺什么：没有规定“Decimal 精度保留”的判定粒度。我额外用 `Decimal.as_tuple()` 相等覆盖指数和尾零（如 `1.10`），比数值相等更严格；这是页面未写、我补充的判定。

## 做错过什么

1. 消费者第一版把“非 Decimal 行为”用例写成含 Decimal 字段的混合类，导致基线该用例也失败，无法证明普通对象行为未变。改为拆成“纯非 Decimal 对象”和“Decimal + 非 Decimal 混合字段”两组，纯对象组在基线与候选上都通过。
2. 第一版无效字符串断言直接在类级期待 `InvalidOperation`；实际 cattrs 包成 `ClassValidationError`，子异常才是 `InvalidOperation`。探测异常链后改为同时核直接 `structure` 与类级子异常。
3. 首次安装 wheel 时用了通配符，三个 wheel 都进了同一个 venv；随后全部卸载并按环境 `--force-reinstall` 指定唯一 wheel，重新核对 `importlib.metadata.version` 与导入路径。
4. 首次跑原生 pytest 退出码 4：项目 `pyproject.toml` 的 addopts 需要 pytest-benchmark 的参数，而 venv 未装该插件。按项目原有入口装上 `pytest-benchmark` 后原命令重跑，未删参数或降低断言。

## 页面之外还去翻了什么

- 固定提交上的 cattrs 源码：`src/cattrs/preconf/json.py`、`src/cattrs/preconf/pyyaml.py`、`tests/test_preconf.py`、`tests/preconf/test_msgspec_cpython.py`、`pyproject.toml`、`HISTORY.md`。
- PR #822 的完整 diff（`git show`）、`refs/pull/822/head` 的远端 ref、`git merge-base`、`git rev-list`、`git log` 与两树差异。
- wheel 构建日志、venv 依赖版本、`pip` 安装/卸载记录；Python 标准库 json 与 PyYAML 的数字解码行为（用于区分数字输入的 float 路径）。
- 未读 a1dbv 的其他文档、其他 cattrs 实验或旧读者答案；未搜索同主题的外部教程。

## 未验项

- 只测 CPython 3.12.15 / Windows 11 x64；未测其他 Python 版本、PyPy 或其他系统。
- 只测 stdlib json 与 PyYAML preconf；未测 orjson、ujson、msgpack、msgspec、bson、tomlkit、tomllib 等后端上的 Decimal。
- 未跑完整 cattrs 测试套件，只跑 `tests/test_preconf.py` 与 typed-deque 子集。
- 只用合成数据；未接触真实数据、生产、凭据或付费服务。
- 未向上游提交、评论或修改 PR；未改 `uv.lock`（PR 不涉及依赖声明）。

## 核对

独立复核（未参与 u1 执行），2026-11-18。按工作目录、固定源码和实际重跑核对，不采信自报。

**结论：按本卡验收，读者做成了（taskDone 为是）。** 消费者、三棵树 wheel、基线失败、整合回归均可复现；页面未改，产物无本机绝对路径。以下卡点判断和漏检只涉及页面措辞与记录完整性，不改变结论。提交/推送未执行（读者自述未提交、未推送，`git status` 只剩未跟踪产物），属工作流后续步骤，不计入本次读者验收。

### 实跑复核

- 源码与整合：`pr822` = `2e883761...`（任务给定 head），基线 `e9239b708...`；`git merge-base` = `bde101a...`，`pr822..e9239b7` 为 6 个提交；PR 独有提交 1 个、无 merge。`integ` = `653efccb...`，父提交 `e9239b7`；相对基线 diff 仅 `HISTORY.md`、`src/cattrs/preconf/json.py`、`src/cattrs/preconf/pyyaml.py`、`tests/test_preconf.py`，`HISTORY.md` 同时保留 Decimal 与 typed-deque 条目。
- wheel：三个 SHA-256 与 `results/metadata.json` 一致；Decimal hook 只出现在 PR/整合 wheel 的 `json.py`/`pyyaml.py`；三个 venv 的 `cattrs.__file__` 均指向各自 site-packages，版本 `26.2.2.dev20/dev15/dev21` 与记录一致；已装依赖版本与 metadata 一致。
- 消费者重跑：base 退出 1（22 failed / 2 passed）；PR head 24 passed（退出 0）；integrated 24 passed（退出 0）。
- 原生检查重跑：`tests/test_preconf.py` 三树 61/65/65 passed、22 skipped，均退出 0；用 `wt-base` 的 `tests/preconf/test_msgspec_cpython.py -k deque` 打三个 wheel：base 11 passed、PR head 6 failed / 5 passed、integrated 11 passed。
- 逐用例：JSON dumps `{"amount": "19.99"}`、YAML `amount: '19.99'`；loads 为 `Decimal` 且 `as_tuple()` 相等；`1.10` 指数 `-2`、40 位有效数字逐位保留；数字输入按后端 float 路径记录（整数 42 精确）；无效字符串为 `ClassValidationError` 包 `InvalidOperation`；纯非 Decimal 对象三树一致。PR head 与 integrated 的 cases/summary 除 label 和 `cattrs_version` 外完全相同。
- 页面与清洁：HEAD = `6764ab01`；`git hash-object docs/decisions/migrations.md` = `8219bc30...`；job.md 附的页面全文与仓库页面逐字相同；`git status` 只有 artifacts 和读者记录两个未跟踪项，页面/TASKS 未改；artifacts 无本机绝对路径。复核时在 consumer 目录跑 pytest 产生的 `__pycache__`/`.pytest_cache`/`.benchmarks` 已删除，不属读者产物。

### 卡点判断

1. “依赖大版本升级／接收旧 PR”合为一格 — **page（低）**。这一格把代码 PR 引向“读跨版本指南、更新声明和锁文件”，本 PR 不改依赖，读者只接代码差量的判断正确；建议拆句，不影响验收。
2. “已有 PR 只接必要差量”缺核对与执行方法 — **page（低）**。读者用 merge-base/rev-list 核祖先、在基线上 cherry-pick 唯一提交并解 HISTORY 冲突，做法正确；页面可补祖先检查与冲突规则。注意“保留两侧新增”只适用于并列条目，代码冲突仍需语义合并。
3. wheel 版本号可能低于基线 — **page（低）**。`hatch-vcs` 令 PR wheel 为 `26.2.2.dev15`、基线为 `dev20`；读者改用提交/wheel 哈希识别，正确。页面可补“不按 PEP 440 版本大小认候选”。
4. 原生环境与短路径 — **不是实际卡点**。读者用原生 CPython 3.12.15，未触发路径长度问题并自评已满足；页面要求已满足，不建议改页面。这一条只是记录方式，不构成页面缺陷。
5. Decimal 精度判定粒度 — **page（低，可选）**。页面要求保留原行为但未写判定粒度；读者补充的 `as_tuple()` 相等（含指数/尾零）正确。页面可加“精度敏感类型按表示级结果记录”，但不是必需。

### 漏掉的错误

- `result.md` 末尾产物清单写 `results/pr.json`、`results/integ.json`，这两个文件不存在；实际是 `results/pr-head.json`、`results/integrated.json`（`commands.md` 与 reader-tests 记录用的是正确名）。读者未发现这处文档不一致。