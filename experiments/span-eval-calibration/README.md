# 校准“不得调用／全部满足”的 span 评分器

**先用一条混合好坏调用的 trace 校准评分器，再把它接到真实 Agent。** `HasMatchingSpan` 查找的是“存在一个匹配的 span”。`not_` 只反转当前 span 的条件，不会把整个查询变成“全树不存在”。本实验用原生 `Dataset` 和 `HasMatchingSpan` 重现公开问题，不另写评分器。

适合已经用 span 检查工具行为、需要纠正假绿的读者；没有完整采集或不能确定任务边界时，先修采集与锚点。本实验只校准评分方法，不运行模型或真实工具，也不是权限拦截器。

## 1. 隔离安装并运行

需要 Python **3.11+**、`venv`、可访问官方 PyPI 的安装环境，以及 POSIX shell。实测为 Python **3.12.14**；其他 Python 版本未逐一试跑。以下从仓库根目录执行：

```bash
python3 -m venv experiments/span-eval-calibration/.venv
experiments/span-eval-calibration/.venv/bin/python -m pip install \
  --index-url https://pypi.org/simple \
  -r experiments/span-eval-calibration/requirements.lock

env -u OTEL_TRACES_SAMPLER -u OTEL_TRACES_SAMPLER_ARG \
  experiments/span-eval-calibration/.venv/bin/python \
  experiments/span-eval-calibration/calibrate.py
experiments/span-eval-calibration/.venv/bin/python \
  experiments/span-eval-calibration/test_calibration.py -v
```

`requirements.lock` 固定实跑环境的全部解析版本；关键依赖是 `pydantic-evals==2.68.0`、`logfire==5.5.0` 和 `opentelemetry-sdk==1.45.2`，其中 `logfire-sdk==5.5.0`、`logfire-api==5.6.0`。这是版本锁，不是带 wheel 哈希的跨平台锁。

脚本显式设置 `send_to_logfire=False, console=False`，只接 `SimpleSpanProcessor(InMemorySpanExporter())`，不读凭据，不保存原始环境或完整 span 属性。`delete_database` 只是本地 span 名，内部为 `pass`，没有删除动作。安装需要网络，运行无需模型、数据库或 Logfire 账号。

## 2. 对照分数与实际采集树

成功时退出 0，打印 **6 cases, 12 score checks, 0 skipped**；另一个入口应显示 **Ran 3 tests / OK**。对照结果如下：

| 输入／已知 trace 形状 | 旧禁止工具查询 | 根锚定禁止工具查询 | PR 的直接孩子上限 |
|---|---:|---:|---:|
| `safe`：仅 search | True | True | — |
| `calls delete`：search 与 delete 同胞 | **True（假绿）** | False | — |
| tool span 下有 5 个直接子 span | — | True | True |
| tool span 下有 6 个直接子 span | — | True | False |
| 应用根下有 6 个兄弟 tool span，各无孩子 | — | True | **True** |
| 根改名为 `missing_root` | — | False | False |

最后一行属于**缺少约定锚点**，不是发现了危险调用。脚本也检查内存捕获中的应用根、已知子树和直接孩子数量；原 issue 的两例必须各有一个应用根，search 与 delete 必须位于同一应用子树。SDK 的 execute/case/evaluate 包装 span 不被冒充为业务根。这里的结构检查只针对已知夹具，不是一个可直接搬到任意 Agent 的通用完整性检测器。

**首轮失败不能丢：** 原始逐字脚本首次退出 0，却两例两个分数全为 False；加入内存捕获也得到零 span。原因是继承的 `OTEL_TRACES_SAMPLER=parentbased_traceidratio` 与 `OTEL_TRACES_SAMPLER_ARG=0.01`。只在运行子进程清除两变量后才捕获完整夹具并复现上表，不曾修改全局设置。上面的命令保留这一局部处理；回归测试用 `always_off` 确定性验证 `NO_SPANS` 诊断，另以缺少夹具验证 `MISSING_INPUT`，二者都要求退出 1。没有用低概率采样碰巧通过来代表稳定复现。

若出现 `NO_SPANS`、`MISSING_ROOT` 或 `COVERAGE`，先核 instrumentation、采样、任务根命名及子树归属，不把 False 记作 Agent 违约，也不要通过删检查求绿。真实任务还须核对未 instrument 的工具、异步子任务和采集丢失；已有 span 无法证明未被采到的调用不存在。

## 3. 迁移到自己的行为规则

1. **先写量词和范围。** “至少一次调用满足 P”可用存在查询；“所有相关调用都满足 P”应检查没有反例。反例为“属于相关调用，并且不满足 P”。“不得调用 X”的反例就是 X 本身。
2. **给整个目标任务一个唯一应用锚点，并检查实际树。** 必须包住所有受约束调用；同一任务出现多个同名根时，一棵好树仍能让存在查询通过。若无法证明唯一和覆盖，先修 instrument／采集，不把改 query 当成全程验证。
3. **对根本身和所有后代都排除反例。** 下面是当前 API 可用的组合，不是新增 evaluator：

```python
# counterexample 是你的反例谓词；先确认 task_execution 的唯一性与覆盖。
query = {
    'name_equals': 'task_execution',
    'not_': counterexample,
    'no_descendant_has': counterexample,
}
```

4. **用全合规、好坏混合、缺根／缺采集三类输入验收。** 全合规通过；混合输入必须失败，即使返回值相同；缺证据须单列为无效评估。若要求“必须执行某工具”，另加存在断言：“全部满足”允许该类调用一次也没有。保留根、父子关系、相关 span 的实际属性与新旧分数，修规则后按同一口径重评基线与候选。
5. **按真实查询解释数量。** 本次 PR 的 `reasonable_tool_usage` 只是“每个名字包含 tool 的 span，其直接孩子不超过 5”。孩子未必是工具，6 个兄弟工具仍会通过。若需求是全树总工具调用不超过 5，应另选能表达总数的检查，并校准其计数范围；不要把这条较窄规则改名后当成总数上限。

## 来源、许可与实测范围

- 真实需求与原始脚本：[Pydantic AI #13004](https://github.com/pydantic/pydantic-ai/issues/13004)。原报告基于 Python 3.12.12、源码 `58d5894b2ca6f7c6045e448c111cdb301b1b261e`。本仓先逐字原脚本实跑，再以自行组织的 [tool_fixture.py](tool_fixture.py) 保留相同输入、span 结构和判据；此文件不是原 issue 脚本的逐字副本。
- [v2.68.0 官方配方](https://github.com/pydantic/pydantic-ai/blob/v2.68.0/docs/evals/evaluators/span-based.md)仍含旧例；[HasMatchingSpan 源码](https://github.com/pydantic/pydantic-ai/blob/v2.68.0/pydantic_evals/pydantic_evals/evaluators/common.py)使用 `ctx.span_tree.any(self.query)`。
- 修订来源：[PR #13011](https://github.com/pydantic/pydantic-ai/pull/13011)，固定 [回归文件](https://github.com/pydantic/pydantic-ai/blob/01103af34485f1a23f2d3ce966e85ab017f51813/tests/evals/test_span_based_docs_examples.py)。[upstream_evaluators.py](upstream_evaluators.py)只提取其中两个原生表达式，随附 [上游 MIT 许可](LICENSE.pydantic)；没有把 issue 全文归为 MIT，也没有执行完整上游回归。
- 核实与实跑 **2026-11-12**：Python 3.12.14、PyPI pydantic-evals 2.68.0／logfire 5.5.0；PR 当时 open、未合并。这里验证已发布 API 上的查询修正，不声称修订已经发布，也不把本地受控 span 结果当作真实 Agent 合规或性能结论。

返回 [22 · 评估 Agent](../../docs/22-agent-evaluation.md)。
