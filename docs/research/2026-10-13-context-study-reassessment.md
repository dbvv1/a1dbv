# 上下文文件研究：区分样本结果、失败解释与分析参数

> 核实：2026-10-13（UTC+8）。**[研究：论文全文；一手：固定公开源码及历史产物；经验：本仓只读 SQL／算术复算]** 未运行模型、gold tests、作者 Python 模块或 Monte Carlo。

## 采用判断

**✅ 遇到失败先核对任务描述、补丁和验收之间的差别，再决定补事实还是改实现。** 通用指南没有显示收益，不能据此删除有用的领域事实，也不是扩写整个 wiki 的理由。比较加载方式时尽量保持信息内容一致；本次没有证明哪种替代方案能提高模型成功率。

## 1. 全文比摘要更限定

[论文 v1](https://arxiv.org/html/2607.27250v1) §4.1 明确把等价边界称作描述性结果，不作充分功效的等价性主张；研究只涉及三个 Python 仓库。§3.3 中两仓的 selective 语料更大且不匹配；§5.2 的近失误探针只有两题。自然文件发现没有直接测量，模型与注入渠道也有限定。

**本仓判断**：更多文本不必然只带来优势，仍可能增加噪声和选择负担；该对照不能隔离这些解释。none 仍可读仓库代码，删除额外指南也不等于移除全部项目知识。既不能由小样本宣布论文无效，也不能把观察到的边界当作所有任务的收益上限。

## 2. #907 不能统一解释成“没选对实现模式”

固定上游提交：[cfa048e5a83284ac1ba768c0928ec03e6f381865](https://github.com/codeprakhar25/context-files-coding-agents/commit/cfa048e5a83284ac1ba768c0928ec03e6f381865)。以下是本次直接阅读，不是论文摘要转述。

[tasks/probe.json](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/tasks/probe.json) 中 Firebase #907 的 prompt 要求首次调用成功，并具体建议鉴权错误后内部重试；gold_diff 则先初始化凭据，且包含 Bearer 格式修正。输入本身携带了修复假设。

抽查 [probe_codex.db](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/data/probe_codex.db) 的该题 repeat_index=0：

| 条件 | 保存补丁中的路径 | 保存的测试摘要 |
|---|---|---|
| none | HTTPError 后 refresh／重试 | 107 pass / 3 fail |
| selective | 错误后 refresh／重试 | 107 pass / 3 fail |
| always_on | 组装 payload 前调用初始化方法 | 109 pass / 1 fail |

因此“失败”并不都等于仍采用 reactive retry。提示里的假设、行为要求和工程遗漏都是待区分解释；本次未证明提示导致失败，也不能从摘要定位剩余一项失败，更不能断言就是 Bearer 格式。只抽查这三条，不推广为全部失败分类。

## 3. 补上 E5 原 CSV 缺少的取舍依据

[power_analysis.py](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/power_analysis.py#L18-L31) 实际按 `eval_method IS NOT NULL AND (error IS NULL OR error='')` 纳入记录，而非按时间选最早／最新。对 [experiment_full.db](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/data/experiment_full.db) 独立查询得到 288 条：

| 条件 | Claude：通过/纳入 | Codex：通过/纳入 |
|---|---:|---:|
| none | 24/45 | 30/51 |
| always_on | 25/45 | 29/51 |
| selective | 25/45 | 27/51 |

排除的三条分别是 Claude opshin605/none/0、pdm3797/always_on/1、opshin616/none/1；都有 error 和 tests 标签，其中最后一条 task_passed=1。因此不能简单称为三条都没有评估结果。它解释作者分析实现，**不证明全部重跑原因、事前政策或成本分母**，也未推翻通过率。

旧 E5 的 CSV 最早／最新计算保留为敏感性分析，不将它冒充作者规则。

## 4. 模拟参数不是截断后的总体平均差

[同一脚本](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/power_analysis.py#L138-L162) 从 none 的经验任务成功率采样，再把加上 delta 的概率截断到 [0,1]。本次仅算 `mean(min(1,p+delta)-p)`：

| delta 参数 | Codex 期望平均差 | Claude 期望平均差 |
|---|---:|---:|
| 0.10 | 5.882pp | 5.333pp |
| 0.15 | 8.824pp | 8.000pp |
| 0.30 | 17.647pp | 16.000pp |

两组各有七个基线成功率已为 1 的任务，正向增量被截断。这里是模拟基线分布对应的精确期望，**不是本次模拟实现值或真实模型收益**。因此引用功效数字时，应说明 delta 是截断前参数；这也不否定观测数据的 bootstrap 区间，两者是不同问题。

## 5. 零模型成本的复算

主 DB SHA256：`0452de98f57674e9de44b6b6474cabd9fded7b6f0c77d04fb021916c01b515bd`；probe_codex DB：`c98fbf72b475e4ea3a40ce1b1635ceb1ccbc2d87d5dccb17331c7ba2f56e8643`。从上述固定版本取得主 DB 后，把路径作为参数传给下段；仅依赖标准库，不导入上游代码：

```sh
python3 - "$DB" <<'PY'
import hashlib, pathlib, sqlite3, statistics, sys
p = pathlib.Path(sys.argv[1]).resolve()
h = hashlib.sha256(p.read_bytes()).hexdigest()
if h != '0452de98f57674e9de44b6b6474cabd9fded7b6f0c77d04fb021916c01b515bd':
    raise SystemExit('source hash mismatch')
c = sqlite3.connect(p.as_uri() + '?mode=ro', uri=True)
f = "eval_method IS NOT NULL AND (error IS NULL OR error='')"
print(c.execute('select agent,strategy,sum(task_passed),count(*) from runs where ' + f + ' group by agent,strategy').fetchall())
for agent in ('codex', 'claude_code'):
    rows = c.execute('select avg(coalesce(task_passed,0)) from runs where ' + f + ' and agent=? and strategy=? group by task_id', (agent, 'none')).fetchall()
    rates = [r[0] for r in rows]
    print(agent, len(rates), {d: statistics.mean(min(1,p+d)-p for p in rates) for d in (.1,.15,.3)})
c.close()
PY
```

本次实际执行只读查询和独立算术，输出对应上面两表；未重跑作者功效模拟、模型或 gold 评估。后续如要识别信息价值，应在新任务中分开症状、根因猜测和所需事实，而非让 Agent 模仿已公开的 hidden gold 答案。
