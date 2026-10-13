主线：三
改变的建议：20/22/24：Regression来源分类≠新增退化；区分会话/规格/反馈条件并先核判定器
新证据：固定runner/题库/第三方审计核查；原断言24排列和原复制函数实测；无原campaign绑定/模型成绩重算

# 连续开发评测：SlopCodeBench 测到了什么，哪些结论仍不能下

> 核实：2026-10-13（北京时间）。读取固定 runner、题库、社区报告及第三方审计；另做两个标准库局部探测。没有运行模型 campaign、Docker、完整 pytest 或参考答案，没有重算模型排名。✅ 借鉴连续需求的任务形态；⛔ 不把汇总 Regression 失败数直接当作“新增改坏”的次数；🧪 作为具体工作流比较前先核对任务、反馈和判定器。**[研究：采用判断]**

## 1. 这次调查改变了什么判断

本仓库此前已记录 HumanLayer 十月报告的单次 campaign、checkpoint 相关性和计费缺口。本轮继续追到测量机制，得到三个更具体的限制：**[一手：源码；研究：解释]**

1. **旧需求未满足，不等于曾经正确而后退化。** Regression 是测试来源／marker 分类，不查询该测试历史是否通过。需要逐测试前后结果才能区分持续失败与新增回归。
2. **连续修改同时改变了几项开发条件。** 已查默认路径保留代码工作区，重置会话上下文，只传当前规格，并不把隐藏评分结果回馈给下一轮。不能把该设置下的结果直接归为代码架构差、模型忘记一切，或现实开发者无法持续维护。
3. **局部评分设施确有可复现的限制。** meshctl 的一个测试要求规格未要求的错误顺序；其每测试工作区复制函数会遗漏普通拆分模块。不能仅从低 Strict 分推出需要更高 effort 或更多人工设计。

这些限制没有推翻“当前结果仍未满足全部验收”的观察，也没有证明模型其实完成得很好。作者 README 自称开放评估原语、初始版本，并非已定型 benchmark；应保留这一定位。

## 2. 固定来源与范围

| 来源 | 固定位置 | 本次读到哪里 |
|---|---|---|
| HumanLayer 十月 campaign | [H：`1a9b65e`](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/benchmarking-new-models-on-slop-code-bench.md) | 完整文章、表格与方法；没有逐 checkpoint 产物／原始 campaign 配置 |
| 官方 runner | [S：`06b5c06`](https://github.com/SprocketLab/slop-code-bench/tree/06b5c0687d4c05ee502e9696a4d0c22fc1eec5e0) | runner 任务生成、续接、评估顺序、停止策略；测试收集／分类、指标抽取；Codex/Claude 默认命令构造 |
| 检索时 runner head | [`31ceea3`](https://github.com/SprocketLab/slop-code-bench/tree/31ceea3add480edb33431e70475c4c70597e6b31) | 与 S 比较上述关键路径；runner 相关变化不改变本文分类／续接结论，不将整个 head 差异视为全审 |
| 官方题库 | [P：`ef6a9dd`](https://github.com/gabeorlanski/scb-problems/tree/ef6a9dd13911566b6b01075ca121758c9f7b5c5f) | 所有顶层 config 计数；meshctl 的 cp1–3 规格、cp4 排序规则、config、conftest 复制与执行路径、cp3 两个顺序断言 |
| 检索时题库 head | [`9cd9ca3`](https://github.com/gabeorlanski/scb-problems/tree/9cd9ca3a51c3d3e2a99d2488a25baf73a2204451) | 对 P 的 meshctl 子树 diff 为空；不代表其他题目未变 |
| 第三方审计线索 | [A：`44ac078`](https://github.com/kimjune01/slopcodebench-audit/tree/44ac078877d4980af80a4e278ef46969bf62366a) | README、F0/F4/F9、runner visibility、meshctl probe；用来发现检查点，未接收它的全库缺陷比例或作者身份推断 |

H 是 **[社区：作者实验报告]**，S/P 是 **[一手：代码与规格]**，A 是 **[社区：第三方审计]**。下面实际运行另标 **[经验]**。arXiv 正文与摘要请求本轮均被代理拒绝；未根据 A 的转述宣称读过论文。H 说使用 pinned v1.0，但已读报告没有足够信息把其实际运行严格绑定到本文 S/P；**本文定位具体实现及方法限制，不能替 H 更正某个模型的分数**。

## 3. Regression、Strict 和继续执行是三件事

[`collection.py`](https://github.com/SprocketLab/slop-code-bench/blob/06b5c0687d4c05ee502e9696a4d0c22fc1eec5e0/src/slop_code/evaluation/collection.py)与 [`pytest_runner.py`](https://github.com/SprocketLab/slop-code-bench/blob/06b5c0687d4c05ee502e9696a4d0c22fc1eec5e0/src/slop_code/evaluation/pytest_runner.py)将来自较早 checkpoint 的测试归为 Regression；当前文件也可用 regression marker。此分类不读取先前结果。**[一手]**

因此，同一个旧测试从未通过和通过后变坏，都会在末次落入“Regression failed”。Core 与 Strict 的差距还可来自当前功能性／错误处理测试，不能全部分配给旧行为退化。要判断是否改坏，至少区分：**[研究：诊断要求]**

| 可比较的同一行为／测试 | 能支持的结论 | 下一调查 |
|---|---|---|
| 前次通过 → 本次失败 | 新发生的不满足；若规格和环境不变，才进一步归因代码改动 | 对照 diff、环境及接口变化 |
| 前次失败 → 本次仍失败 | 已存在的未完成需求 | 检查此前遗漏是否持续、反馈是否可见 |
| 前次失败 → 本次通过 | 恢复或补齐 | 查修复依据及其他行为是否受影响 |
| 测试新增、删除、改预期或先前跳过 | 缺少直接可比的前值 | 先对齐测试版本与需求变更 |

H 已明确说 checkpoint 2 失败后，后续 Core 仍可能通过。本文补充的是如何解释失败的来源，并非指控 H 隐藏这一事实。相同 test ID 若断言或输入变了，也不自动是同一测量。

[`extractors.py`](https://github.com/SprocketLab/slop-code-bench/blob/06b5c0687d4c05ee502e9696a4d0c22fc1eec5e0/src/slop_code/metrics/checkpoint/extractors.py)中的单 checkpoint `strict_pass_rate` 是已通过测试数／总测试数；H 报告的 Strict 则统计所有类别都通过的 checkpoint 比例。两层分母不同，读取原始字段不能仅凭名字套用文章口径。**[一手；社区：H 的定义]**

[`PassPolicy.ANY_CASE`](https://github.com/SprocketLab/slop-code-bench/blob/06b5c0687d4c05ee502e9696a4d0c22fc1eec5e0/src/slop_code/evaluation/report.py)的检查是至少一项测试通过；但 [`_should_early_stop`](https://github.com/SprocketLab/slop-code-bench/blob/06b5c0687d4c05ee502e9696a4d0c22fc1eec5e0/src/slop_code/agent_runner/runner.py)在 ANY_CASE 下不因测试失败停止，Agent 错误／限流仍可停止。**继续下个 checkpoint 既不是 Strict 通过，也不保证至少一项已通过。** H 的 any-case 运行策略与其严格算分并不矛盾。**[一手：控制路径；研究：解释]**

## 4. 代码留下了，哪些信息没有自动留下

S 的 `run_checkpoint` 只读取当前 checkpoint 的规格；后续 `_setup_for_checkpoint` 调用 `finish_checkpoint(reset_context=True)`，复用工作区。评估在保存快照后运行；任务生成函数没有接收隐藏评估报告的参数。Codex 默认 `exec` 与 Claude 默认 `--print` 路径并未启用续接，显式 retry 才走 resume/continue。这里描述默认源码，不假定 H 没有额外配置，也不声称 Agent 不能自行保存规格或读取工作区记录。**[一手]**

因此，连续开发比较应标注两条独立条件：旧要求能否恢复，以及能否得到运行反馈。把它们都改掉再比较两个工作流，即使结果提升，也不能只归给“架构更好”。反过来，隐藏测试有助于评估对未知输入的泛化，不应一概开放标准答案；可以保留独立隐藏验收，同时允许读取真实项目原有测试、历史接口约定和实际报错。**[研究：实验与实践建议]**

**对 Codex/Claude 使用者的最小改变**：跨会话前保留不能仅从实现推导的行为约束和决定理由；续接时让 Agent 能执行相关回归并取得输出。已有这些条件，就没有从该报告推出必须新增记忆平台的依据。维护文件也有成本：失效规格要被当前决定替代，不能让保存更多旧文本固化错误需求。详见 [20](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)。

## 5. 两个局部问题的独立探测

### 5.1 错误内容相同，顺序不同就失败

P 的 [`meshctl/checkpoint_3.md`](https://github.com/gabeorlanski/scb-problems/blob/ef6a9dd13911566b6b01075ca121758c9f7b5c5f/meshctl/checkpoint_3.md)明确 “Vault error order is not part of the contract”；cp1/cp2 也不要求错误排序。[`test_checkpoint_3.py`](https://github.com/gabeorlanski/scb-problems/blob/ef6a9dd13911566b6b01075ca121758c9f7b5c5f/meshctl/tests/test_checkpoint_3.py)的 `test_vault_update_mixed_errors` 却将四个 field/type 对组成的列表与固定顺序直接比较。cp4 才要求按 field、type 排序。**[一手]**

**[经验：断言局部执行]** 用 Python AST 从固定源码提取该原始 `assert`，对其预期四对元素的 24 种排列执行：1 种通过、23 种 AssertionError，错误多重集合完全相同。这直接展示顺序判定超过 cp3 的约定。没有执行 fixture、完整 CLI 或参考答案；不能说“23 个模型答案被误判”或给模型加分。

### 5.2 入口运行正常，拆出的模块在测试复制时消失

[`meshctl/tests/conftest.py`](https://github.com/gabeorlanski/scb-problems/blob/ef6a9dd13911566b6b01075ca121758c9f7b5c5f/meshctl/tests/conftest.py)的 `_copy_entrypoint_workspace` 只复制 `meshctl`、`meshctl.py`、`requirements.txt`，run_cli 在复制目录执行；规格指定入口名，没有据此限制所有实现只能放入口文件。**[一手]**

**[经验：原函数局部执行]** 提取未修改的复制函数，注入其标准库依赖 Path/shutil，以两个公开合成程序探测。入口均用相对 `python3 meshctl.py`，新临时目录，无安装依赖：

| 合成布局 | 原目录执行 | 原函数复制后执行 |
|---|---|---|
| `meshctl.py` 直接输出 ok | exit 0，ok | exit 0，ok |
| `meshctl.py` 导入同目录 `helper.py` 的 value 后输出 | exit 0，ok | exit 1，`No module named 'helper'` |

两次复制都只留下入口和 requirements；合计四次子进程，结果已逐项核对。该探测执行了真实复制函数，没有执行完整 runner、uv 或 Docker；官方环境的 eval 命令为 `uv run`，没有把本地 Python 启动冒充相同环境。它证明一种常规源码组织会在此局部夹具丢文件，不证明任何已发表模型采用了这个布局，也不覆盖显式安装为依赖的包或特殊路径安排。

### 5.3 也收窄第三方审计的说法

A/F9 开头概括每轮重跑全部先前测试，但官方开关允许例外。独立读取 P 的 36 个问题、196 个 checkpoint 配置，发现 6 个问题的 12 个 checkpoint 显式关闭 `include_prior_tests`：dynamic_config_service_api 3/4、execution_server 6、l2m 2–5、meshctl 6–8、metric_transform_lang 5、mvvault 6。A 的 meshctl 明细其实也披露了此例外。**[经验：配置计数；一手：源码默认值与例外]**

应采用明细中的限定说法。关闭旧文件自动加入，不等于当前文件没有自带回归测试，也不证明设置错误。第三方提供了有价值的线索，但其概括和缺陷总数仍需独立检查；本轮只确认上述局部问题。

## 6. 对长期方向的实质影响

**先诊断失败属于哪一层，再决定加什么。** 持续遗漏、真实退化、信息不可见、运行环境变化和评分越界需要不同修法；单一 Strict 总分不能替代这一诊断。测试隔离若遗漏模块，再要求模型“更模块化”甚至可能使测量更差，而不表示模块化本身有害。**[研究]**

**下一步有价值的证据**是同一 campaign 的固定规格／题库版本、可见输入、逐测试结果和代码快照。拿不到这些，就无法量化上述问题解释了多少失败，也不能据此否定 xhigh 或宣传某个 Skill 能解决。后续先查公开产物是否补齐，不重新整理同一排行榜，不因局部评测问题无限扩建本仓库的检查器。

本轮支持更新评估方法、跨会话建议及长期研究队列；它不直接证明某种架构、记忆或反馈机制提升了真实模型表现。
