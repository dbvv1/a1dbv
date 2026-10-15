主线：三
改变的建议：20/22/24：Regression来源分类≠新增退化；22 区分大补丁与连续交付，并按错误所在层选择重算、重评或重新生成
新证据：固定runner/题库与局部探测；SWE-EVO 论文、评估器和48条公开数据；SWE-Milestone 维护修订与固定实现，只读核查，未复算其成绩

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

## 7. SWE-EVO：大补丁与连续交付的边界

> 核实：2026-10-15（北京时间）。只读论文、源码和公开数据，并用标准库复核集合／数量；没有安装依赖、运行模型、Docker、上游测试或重算排行榜。**[研究：范围]**

**✅ 借鉴发布差分任务，⛔ 不将其成绩代替第二次、第五次修改验收。** 本轮改变的是 22 的任务选择：连续开发必须继承 Agent 自己上一次交付的状态，并保留仍有效的旧契约检查；每次重新从人工版本开始，测不到自己引入的设计取舍如何影响下一需求。大补丁任务仍能检验多文件协调，不能因此说它没有价值。**[研究：采用判断]**

### 7.1 固定材料与问题定义

- **论文**：[arXiv:2512.18470v1](https://arxiv.org/html/2512.18470v1)，2025-12-20，读 §3 构造／指标、§4 设置／分析及局限。§3.1 取两个发布版本的差分，§3.2 给起点代码与发布说明，收一个最终补丁；§4 的 100 次迭代／调用是每实例内预算，不是 100 次已交付需求。多个上游 PR 被聚合成一题，不是 Agent 多次继承自身产物。**[一手：论文；研究：解释]**
- **实现**：[SWE-EVO/SWE-EVO `9b83d5af943ba7a17567336f5b18239f73960219`](https://github.com/SWE-EVO/SWE-EVO/tree/9b83d5af943ba7a17567336f5b18239f73960219)，提交时间 2026-05-03。重点读下列构造、评估和 SWE-agent 输入路径；不能保证该版本就是论文运行版本。**[一手：源码]**
- **公开数据**：[Fsoft-AIC/SWE-EVO revision `77310c70d3648d6815f6a7555ecc492bc28c44ec` 的 `SWE-EVO/hf_jsonl/test.jsonl`](https://huggingface.co/datasets/Fsoft-AIC/SWE-EVO/blob/77310c70d3648d6815f6a7555ecc492bc28c44ec/SWE-EVO/hf_jsonl/test.jsonl)，13,251,406 bytes；SHA-256 `a5dc7fccf7d839140e2005b09937e0f83910a61518027ef72d42134542246f87`。48 行，七个项目，其中 DVC 26 行；没有 Django／NumPy，不能照搬 README 的项目例子当作这份数据分布。数据含答案字段不代表 Agent 读到了答案。**[一手：公开数据；经验：只读计数]**

### 7.2 回归判据覆盖什么

[`get_test_directives`](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-bench/swebench/harness/test_spec/python.py#L229-L300)从 gold `test_patch` 的文件名提取执行目标，排除部分非测试扩展和删除文件，再作项目特例处理；[`make_eval_script_list_py`](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-bench/swebench/harness/test_spec/python.py#L414-L475)将这些目标接到测试命令后。不是默认执行仓库全部测试。目标文件内原有测试可以提供大量回归覆盖，但文件外旧契约不能由这些数量保证。**[一手：源码；研究：覆盖边界]**

[`generate_f2p_p2p.py`](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-bench/generate_f2p_p2p.py#L234-L262)比较应用测试补丁后的前／后日志：P2P 要两侧均为 PASSED；F2P 则接受前侧 FAILED、ERROR **或没有该 test ID**、后侧 PASSED。因此当前代码中的 F2P 不都代表曾实际执行并失败的行为；缺失可能来自收集差异，须看原日志才能归因。未取得这些历史日志，不推断其发生比例。**[一手：源码；研究：边界]**

两个数据反例更直接：**[经验：公开 JSON 集合复核；研究：解释]**

1. `iterative__dvc_0.52.1_0.53.1` 有 132 个 F2P、**0 个 P2P**；48 行中只有这一行 P2P 为空，F2P 全非空。[评分实现](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-bench/swebench/harness/grading.py#L206-L244)对空 P2P 返回 1；[Fix Rate 路径](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-bench/evaluate_instance.py#L222-L238)只查 P2P failure 列表为空。该题仍要解决 F2P，不能称为无条件成功；但这里没有 P2P 提供的旧行为保留证据。
2. Dask `2023.6.0→2023.6.1` 与 `2023.6.1→2023.7.0` 确实相邻：前题 `end_version_commit` 等于后题 `base_commit`，均为 `85c99bc20abc382774cfb6e5bf5f2db76ac09378`。然而前题 105 个 F2P 中，103 个 test ID 不在后题 F2P/P2P 联集中，包括 `dask/bag/tests/test_bag.py::test_map_total_mem_usage`；后题测试补丁只有三份文件，不含这个 bag 测试文件。不能把两题直接串起来就宣称累计回归覆盖。**ID 不在集合不等于行为一定无人覆盖或必然退化**；它说明需要逐项确认旧契约被什么验收替代。

全表 F2P 3,908 个、P2P 38,043 个，平均总数 873.979，吻合论文约 874 的描述；P2P 中位数却为 106.5。这里的意义不是另造排名，而是不能用平均测试数替代每轮保留行为的覆盖。**[经验：只读计数；研究：解释]**

### 7.3 什么是可见输入，什么仍未知

[SWE-agent `from_swe_bench`](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-agent/sweagent/run/batch_instances.py#L170-L191)取 `problem_statement`、`base_commit`、image 和 ID；这份数据没有 `image_assets`，故 extra_fields 为空。该路径没有把 `patch`、`test_patch` 或 `PRs` 注入任务。[默认模板](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-agent/config/default.yaml#L8-L27)呈现 problem_statement，要求修改非测试代码；文字声称已处理测试，并不能证明运行时已经应用目标测试补丁。**[一手：源码；研究：区别]**

[独立评分脚本](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-bench/evaluate_instance.py#L125-L146)读取完成轨迹的补丁，与 gold test_patch 合并后评估。这支持“评分时使用目标测试”，不证明 Agent 执行期间可见目标测试。公开 problem_statement 自带上游 PR／issue 引用；数据还含 gold patch、PR 补丁与目标提交。实际镜像、网络访问、Git 对象保留和完整轨迹未核查，不能宣称完全隔离，也不能指控发生答案泄漏。固定仓库缺少 README 所引用的 OpenHands evaluation 目录，故没有将 SWE-agent 的输入路径外推到该 scaffold。**[一手：源码／数据；研究：验证边界]**

此外，不把当前评分脚本直接当成论文每个分数的复算依据：找不到轨迹的题会在[加载阶段](https://github.com/SWE-EVO/SWE-EVO/blob/9b83d5af943ba7a17567336f5b18239f73960219/SWE-bench/evaluate_instance.py#L131-L147)跳过，最终分母是已加载 instances 数，未必固定 48。评分器的 `test_passed` 接受 PASSED/XFAIL，`test_failed` 接受缺失/FAILED/ERROR；SKIPPED 若被 parser 保留则不进任一列表，不能把输出分数无条件译为“每条都 PASSED”。源码显示这些边界，**没有原日志就不能判断论文运行是否受到影响**。**[一手：源码；研究：解释]**

### 7.4 只读复核方法与采用边界

将上述固定 JSONL 保存为 `test.jsonl`，以下标准库计算只读取文件，不加载评估器、不调用模型：**[经验：本轮已执行同等计算]**

```python
import hashlib, json, statistics
from pathlib import Path
raw = Path('test.jsonl').read_bytes()
assert hashlib.sha256(raw).hexdigest() == 'a5dc7fccf7d839140e2005b09937e0f83910a61518027ef72d42134542246f87'
rows = [json.loads(line) for line in raw.splitlines()]
f = [len(row['FAIL_TO_PASS']) for row in rows]
p = [len(row['PASS_TO_PASS']) for row in rows]
print(len(rows), sum(f), sum(p), p.count(0), f.count(0), statistics.median(p))
by_id = {row['instance_id']: row for row in rows}
a = by_id['dask__dask_2023.6.0_2023.6.1']
b = by_id['dask__dask_2023.6.1_2023.7.0']
print(a['end_version_commit'] == b['base_commit'])
print(len(set(a['FAIL_TO_PASS']) - set(b['FAIL_TO_PASS']) - set(b['PASS_TO_PASS'])))
```

输出为 `48 3908 38043 1 0 106.5`、`True`、`103`。没有据此重算成功率、归因模型效果或测试哪种架构更耐改。**[经验：复核结果]**

**给读者的最小改变**：要回答自己的第二次、第五次修改是否可靠，保存上一轮实际交付状态；下一轮从它继续，记录人工修复／参考替换，并检查之前通过且仍有效的契约。测试可保留隐藏部分，不必泄露参考实现；但旧验收删除、改名或换输入时，要说明它已被新契约取代还是仍需覆盖。新需求未通过与旧行为倒退分别报告。若只想比较一次发布差分任务，就采用相应口径，不添加整套连续评测框架。这个增量与前文 SlopCodeBench 的“旧债与新增回归”互补，不替代其真实保留工作区的任务形态。**[研究：采用与停止条件]**


## 8. SWE-Milestone：评估修正后重做哪一层

> 核实：2026-10-15。✅ 借用现成评估器的分层处理：算分、执行验收与 Agent 生成分别决定是否重做；无需另造评测框架。只读公开原帖、补丁与固定源码，未运行上游测试、镜像或模型。**[研究：采用判断]**

### 算分错，已有报告可能足够

[#24](https://github.com/DeepCommit-ai/SWE-Milestone/issues/24)报告评分键去掉 Jest／Pytest 测试的文件路径，导致不同文件中的同名测试相互影响；原始报告仍保留完整身份。[#34](https://github.com/DeepCommit-ai/SWE-Milestone/pull/34)于2026-08-22合入 `125009c64feb3bbf8056bd245f48d321abbe0418`，增加从保存报告重算的入口，不重新执行测试或 Agent。其历史数量、AI 辅助审阅和通过测试数均为作者报告，本轮不拿它们证明效果。**[一手：问题／合并记录]**

固定HEAD [`17a8f1593e172e26b36cea15e2b30fb9536c93f5`](https://github.com/DeepCommit-ai/SWE-Milestone/tree/17a8f1593e172e26b36cea15e2b30fb9536c93f5)的 [`rescore_cell`](https://github.com/DeepCommit-ai/SWE-Milestone/blob/17a8f1593e172e26b36cea15e2b30fb9536c93f5/harness/e2e/rescore.py#L525-L715)核可用的分类／仓库配置绑定及原结果能否由保存报告重现，再替换算分字段并保留基础设施、身份不可信等失败锁；缺报告、已检测到的分类／仓库配置漂移或可用分类版本无法解析时，会拒绝重算；它只记录测试配置 hash，仓库配置也须新旧 hash 均存在才比较，不能当成完整输入一致性保证。当前代码也接受多个候选在新旧评分投影均一致的情形，不能照抄PR的“必须唯一候选”当作最终实现。**[一手：固定源码；研究：静态机制核查]**

### 只修评估侧，可重评产物；改变生成条件另算

[固定环境修补规约](https://github.com/DeepCommit-ai/SWE-Milestone/blob/17a8f1593e172e26b36cea15e2b30fb9536c93f5/docs/maintainers/image-patching.md#L21-L32)将评估用镜像／覆盖层与 Agent 使用的 base、base-offline、隔离策略、提示分开：仅前者改变才可沿用冻结提交；后者改变，重评不能回答新条件下 Agent 会如何生成。文档中的旧版本号命名另有后续修订，本节不采用其 patch／minor 规则。**[一手：维护规约；研究：采用边界]**

两例都有公开修订产物：[element-web 的固定提交 `878fcd6`](https://huggingface.co/datasets/DeepCommit-ai/SWE-Milestone-data/commit/878fcd6b895dc85f8c6f7d6cca6ff018da29cf68)新增 milestone 评估镜像覆盖层，复用旧镜像／离线缓存，补 `html-react-parser` 及依赖；不是修改 base／base-offline。[nushell 的 `0ea8c72`](https://huggingface.co/datasets/DeepCommit-ai/SWE-Milestone-data/commit/0ea8c72bab1e2d3ec4506e95a1d1c08f198ca129)只修改4个SRS文件，明确 `execute_xpath_query` 四参、`parse_block` 五参及相关参数位置，改变 Agent 接到的规格。[维护者总结](https://github.com/DeepCommit-ai/SWE-Milestone/blob/17a8f1593e172e26b36cea15e2b30fb9536c93f5/docs/versioning.md#L107-L125)因此分别选择重评冻结提交与要求重新生成。公开diff支持修订对象的区别，历史执行结果仍是作者报告；本轮不引用提升数字。**[一手：固定数据补丁／维护报告；未运行或复算]**

公开清单也可局部核机制：[v1.0](https://github.com/DeepCommit-ai/SWE-Milestone/blob/17a8f1593e172e26b36cea15e2b30fb9536c93f5/manifests/digests-v1.0.tsv)与[v1.0.1](https://github.com/DeepCommit-ai/SWE-Milestone/blob/17a8f1593e172e26b36cea15e2b30fb9536c93f5/manifests/digests-v1.0.1.tsv)各115项；按镜像角色对齐、去掉版本标签比较digest，18处变化均为element评估镜像，14个base／base-offline未变。只是清单字符串比较，未拉镜像，也不能单凭此证明提示、规格和全部生成条件相同。**[一手：固定清单；研究：只读比对]**

### 保存不完整，重评也不能恢复事实

[#33](https://github.com/DeepCommit-ai/SWE-Milestone/issues/33)报告部分旧快照损坏或漏文件，既不能由报告重算，也不能靠冻结快照重评得到可信新结果；作者提出重跑或标无效。[后续纠正](https://github.com/DeepCommit-ai/SWE-Milestone/issues/33#issuecomment-5377900162)将一项“生成代际差”改判为丢失 `internal/` 与旧清理规则交互，说明连零分原因也须回到产物，而不能沿用首次标签。这里不重复已被纠正的分类数量。**[一手：作者调查与后续纠正；未独立复演]**

**采用范围**：先定位错误所在层，保留原产物与修订版本；新规格下给旧产物评分本身可行，只是不能代表模型收到新规格后的行为。修复 Agent 曾看到的环境或反馈也一样。重评范围还要包括受影响但没有有效结果的项，不能只搜到故障文字的项，见[维护者的范围规则](https://github.com/DeepCommit-ai/SWE-Milestone/blob/17a8f1593e172e26b36cea15e2b30fb9536c93f5/docs/versioning.md#L87-L105)。**[一手；研究：采用建议]**

**证据上限**：[原始轨迹仓库](https://huggingface.co/datasets/DeepCommit-ai/SWE-Milestone-log)读取文件要求登录并同意分享联系信息，本轮未申请、登录或绕过，因此没有复算原始日志、产物或排名；同仓记录也不是不同作者的独立重复研究。固定源码支持处理机制，作者报告支持其遇到过的维护问题，不证明普遍收益或某模型应升降级。
