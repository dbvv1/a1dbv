主线：二，额外能力何时值得加
改变的建议：03/19/22 不按文件长度承诺收益，区分信息内容、加载方式、正确性、耗时和费用口径
新证据：Context Files 的公开 DB/脚本复算与 AGENTS 效率研究 113 对运行复算；两个研究保留各自模型、样本和局限，不合并统计

# 上下文文件研究复核：正确性、耗时与内容分别判断

## Context Files：失败解释与分析参数
> 核实：2026-10-13（UTC+8）。**[研究：论文全文；一手：固定公开源码及历史产物；经验：本仓只读 SQL／算术复算]** 未运行模型、gold tests、作者 Python 模块或 Monte Carlo。

### Context Files：失败解释与分析参数 · 采用判断

**✅ 遇到失败先核对任务描述、补丁和验收之间的差别，再决定补事实还是改实现。** 通用指南没有显示收益，不能据此删除有用的领域事实，也不是扩写整个 wiki 的理由。比较加载方式时尽量保持信息内容一致；本次没有证明哪种替代方案能提高模型成功率。

### Context Files：失败解释与分析参数 · 1. 全文比摘要更限定

[论文 v1](https://arxiv.org/html/2607.27250v1) §4.1 明确把等价边界称作描述性结果，不作充分功效的等价性主张；研究只涉及三个 Python 仓库。§3.3 中两仓的 selective 语料更大且不匹配；§5.2 的近失误探针只有两题。自然文件发现没有直接测量，模型与注入渠道也有限定。

**本仓判断**：更多文本不必然只带来优势，仍可能增加噪声和选择负担；该对照不能隔离这些解释。none 仍可读仓库代码，删除额外指南也不等于移除全部项目知识。既不能由小样本宣布论文无效，也不能把观察到的边界当作所有任务的收益上限。

### Context Files：失败解释与分析参数 · 2. #907 不能统一解释成“没选对实现模式”

固定上游提交：[cfa048e5a83284ac1ba768c0928ec03e6f381865](https://github.com/codeprakhar25/context-files-coding-agents/commit/cfa048e5a83284ac1ba768c0928ec03e6f381865)。以下是本次直接阅读，不是论文摘要转述。

[tasks/probe.json](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/tasks/probe.json) 中 Firebase #907 的 prompt 要求首次调用成功，并具体建议鉴权错误后内部重试；gold_diff 则先初始化凭据，且包含 Bearer 格式修正。输入本身携带了修复假设。

抽查 [probe_codex.db](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/data/probe_codex.db) 的该题 repeat_index=0：

| 条件 | 保存补丁中的路径 | 保存的测试摘要 |
|---|---|---|
| none | HTTPError 后 refresh／重试 | 107 pass / 3 fail |
| selective | 错误后 refresh／重试 | 107 pass / 3 fail |
| always_on | 组装 payload 前调用初始化方法 | 109 pass / 1 fail |

因此“失败”并不都等于仍采用 reactive retry。提示里的假设、行为要求和工程遗漏都是待区分解释；本次未证明提示导致失败，也不能从摘要定位剩余一项失败，更不能断言就是 Bearer 格式。只抽查这三条，不推广为全部失败分类。

### Context Files：失败解释与分析参数 · 3. 补上 E5 原 CSV 缺少的取舍依据

[power_analysis.py](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/power_analysis.py#L18-L31) 实际按 `eval_method IS NOT NULL AND (error IS NULL OR error='')` 纳入记录，而非按时间选最早／最新。对 [experiment_full.db](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/data/experiment_full.db) 独立查询得到 288 条：

| 条件 | Claude：通过/纳入 | Codex：通过/纳入 |
|---|---:|---:|
| none | 24/45 | 30/51 |
| always_on | 25/45 | 29/51 |
| selective | 25/45 | 27/51 |

排除的三条分别是 Claude opshin605/none/0、pdm3797/always_on/1、opshin616/none/1；都有 error 和 tests 标签，其中最后一条 task_passed=1。因此不能简单称为三条都没有评估结果。它解释作者分析实现，**不证明全部重跑原因、事前政策或成本分母**，也未推翻通过率。

旧 E5 的 CSV 最早／最新计算保留为敏感性分析，不将它冒充作者规则。

### Context Files：失败解释与分析参数 · 4. 模拟参数不是截断后的总体平均差

[同一脚本](https://github.com/codeprakhar25/context-files-coding-agents/blob/cfa048e5a83284ac1ba768c0928ec03e6f381865/power_analysis.py#L138-L162) 从 none 的经验任务成功率采样，再把加上 delta 的概率截断到 [0,1]。本次仅算 `mean(min(1,p+delta)-p)`：

| delta 参数 | Codex 期望平均差 | Claude 期望平均差 |
|---|---:|---:|
| 0.10 | 5.882pp | 5.333pp |
| 0.15 | 8.824pp | 8.000pp |
| 0.30 | 17.647pp | 16.000pp |

两组各有七个基线成功率已为 1 的任务，正向增量被截断。这里是模拟基线分布对应的精确期望，**不是本次模拟实现值或真实模型收益**。因此引用功效数字时，应说明 delta 是截断前参数；这也不否定观测数据的 bootstrap 区间，两者是不同问题。

### Context Files：失败解释与分析参数 · 5. 零模型成本的复算

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

## AGENTS 效率：耗时与正确性的边界
### AGENTS 效率：耗时与正确性的边界 · 可直接采用的判断

**[研究：全文；经验：采用判断]** **单一 GPT-5.2-Codex、10 仓库124个小型PR任务；公开数据实际113对有效运行。两组运行时间／输出token中位数分别低28.6%／16.6%，不代表同等正确率下的成本收益。** 综合结论宜写“效率可能改善，需随正确性一起验证”，不把效率作为指令文件固有收益。

保留什么上下文：这篇只比较整个文件有／无，并未消融目录、命令或行为约束。不能据此承诺“越精简越省”，也不能证成“目录概览应一律删除”；保留可验证改变定位、实施或验收行为的信息仍是合理采用判断，不是本研究单独证明的内容配方。

### AGENTS 效率：耗时与正确性的边界 · 论文方法边界 [研究：全文]

[arXiv v2 全文](https://arxiv.org/html/2601.20404v2)（2026-03-30）§3：同题、同快照配对；只保留根指令含约定、架构、项目描述的仓库，任务限≤100变更行／≤5文件；任务提示由PR diff生成。§3.1.8的完成检查只是随机50题人工确认非空、非琐碎且方向符合，未测测试通过率或语义正确性。§5把具体内容和机制效果留作后续研究。

### AGENTS 效率：耗时与正确性的边界 · 附录独立复算 [一手：公开数据／源码；经验：标准库复算]

来源：[Zenodo 18348507](https://zenodo.org/records/18348507)，v1.0；[公开ZIP](https://zenodo.org/api/records/18348507/files/Dataset_and_Replication_Package.zip/content)，19,869,181字节，MD5 `cf015529276d734f61bd19eb1950213f`，与[API](https://zenodo.org/api/records/18348507)一致。以下路径均以包内 `Dataset_and_Replication_Package/` 为根。

- 数据：`Data/replicated_pr_outputs/{FULL_FILE,NONE}/Codex/*_pr_replication_data.json`。各124项，其中各11项均FOSSBilling checkout失败，且两边是同11题；表1来自其余113对，全部prompt与日志commit_hash配对一致。不能把124候选任务写成124个有效运行，也不能将这11题算模型失败。
- 原表精确复算：NONE→FULL_FILE的时间中位数98.573995→70.343017秒，输出2925→2440；均值162.9416517→129.9090449秒、5744.814159→4591.460177。原百分比是两组中位数之比，并非“典型单题省28.6%”：逐题相对降幅中位数分别13.65%／13.05%；79/113对更快、76/113对输出更少。这些是不同估计量，不应混用。
- `PullRequestReplicator/PullRequestReplicator.py::main_agent_logic`只在`agent.run`前后计时；clone、checkout、复制指令和事后diff采集不计入。故这是agent进程耗时，不是端到端交付时间，更不是CPU成本／美元账单。
- `RunCodexAgent/CodexAgent.py::run`用`codex exec --model gpt-5.2-codex --json`，容器内绕过审批／内建沙箱；没有显式timeout、token／step预算或reasoning-effort。Docker安装未pin CLI。公开session_meta有0.84.0／0.87.0／0.88.0／0.89.0；15对online-go.com的FULL_FILE为0.88.0、NONE为0.87.0，其余98对同版本。排除这15对后中位数比降幅仍为17.93%／10.53%；这只是样本敏感性检查，不估计CLI版本因果效应。
- `JAWs_Analysis/stats.py`把非字符串条目视为“successful”；取`turn.completed.usage`。它不检查测试通过或补丁正确性。226个有效运行各只有一个turn.completed。
- **费用不能从表1 Total直接读。** 226条CLI usage全部与其末次公开日志`token_count.info.total_token_usage`的对应input／cached／output值一致；日志中total=input+output。表1 v2 Total却可精确复现为input+cached+output：NONE均值687632.13、FULL_FILE619321.70。运行时total实际均值358754.82→323242.97，中位数119259→125164。可明确说表1 Total不是运行时total且额外加了cached；不再由该列推算钱，也不需借用另一研究或当前Codex格式猜字段。这里仅讨论本研究的统计列。

### AGENTS 效率：耗时与正确性的边界 · 验证范围

完成：读全文v1/v2、附录README、采集／分析源码；自写Python标准库对公开JSON复算。未运行任何上游代码、模型、Docker或安装依赖；未读取凭据文件。


ZIP SHA256：`528bab4960610887f71c89422334a0407377b0230d65dceba118d2c6c12a9512`。复核者可用下段标准库程序读取固定 ZIP；不解包、不执行归档中的代码、不输出完整日志：

```sh
python3 - "$ZIP" <<'PY'
import collections, hashlib, json, statistics, sys, zipfile
p = sys.argv[1]
with open(p, "rb") as f:
    if hashlib.sha256(f.read()).hexdigest() != "528bab4960610887f71c89422334a0407377b0230d65dceba118d2c6c12a9512":
        raise SystemExit("source hash mismatch")
rows, failures = {}, collections.Counter()
with zipfile.ZipFile(p) as z:
    for name in z.namelist():
        if "/replicated_pr_outputs/" not in name or not name.endswith(".json") or name.startswith("__MACOSX"):
            continue
        mode = name.split("/replicated_pr_outputs/")[1].split("/")[0]
        for key, d in json.loads(z.read(name)).items():
            if not isinstance(d, dict):
                failures[mode] += 1
                continue
            u = [e["usage"] for e in d["agent_decoded_output"] if e.get("type") == "turn.completed"][-1]
            rows[mode, (d["repository"], key)] = (d["replication_time_seconds"], u["output_tokens"])
print("setup failures", dict(failures))
keys = {k for m, k in rows if m == "NONE"}
if keys != {k for m, k in rows if m == "FULL_FILE"}:
    raise SystemExit("unpaired records")
print("valid pairs", len(keys))
for i, label in enumerate(("seconds", "output_tokens")):
    a = [rows["NONE", k][i] for k in keys]
    b = [rows["FULL_FILE", k][i] for k in keys]
    print(label, "medians", statistics.median(a), statistics.median(b), "ratio_reduction", 1 - statistics.median(b) / statistics.median(a))
    print("paired_median_reduction", statistics.median((x-y)/x for x,y in zip(a,b)))
PY
```

本次实际运行得到 113 对、每臂 11 条准备失败，时间中位数 98.573995 / 70.343017，输出 2925 / 2440；逐题相对下降中位数分别 0.1364731848 / 0.1304728546。版本与 total 字段的上述核查另以标准库只读解析公开元数据／usage字段完成，没有复跑 Codex。

## A Few Pages：分组、时间与维护

> 核实：2026-10-14（UTC+8）。**[研究：v2 全文及原研究方法；经验：采用判断]** 本次未复跑分类器或效果估计。

**保留短配置试用，改正样本与时间口径，不把维护频率或 RAMP 等级当采用目标。** [v2 §5、§7、附录 C](https://arxiv.org/html/2608.25241v2) 的 441 个企业仓库用于开发分类器；效果分析另有 509 个开源处理仓库，agent-first 中 L1／L2+ 为 214／182。L1 表示未检出可计级的已提交配置，不能排除仓库外规则；L2+ 是有可计级产物，未证明其实际加载或执行。

[原研究 §3.1–3.3](https://arxiv.org/html/2601.13597v2#S3.SS1) 以首次 Agent PR 定采用月，采集期为 2024-01 至 2025-11，要求至少 10 stars、10 个 Agent PR；agent-first 是整个采集期未发现 Copilot／Cursor／Windsurf IDE 配置痕迹，不是 Agent 贡献多数，代理检测可能漏掉实际使用。采用前活动匹配、分期差分和仓库聚类标准误提供了比简单横截面更强的比较，但不等于随机配置试验。

成熟度取 2025-11 终点快照；agent-first 的 L2+ 组仅 3.8% 在采用月之前已有首个配置。表 5 的百分比由 log 系数转换，约两倍是增幅之比，不是总复杂度之比。配置后置、未观察的模型能力／使用强度和共用匹配对照池限制解释；告警在采用前已有升高，识别比复杂度更弱。不能因这些限制删除关联证据，也不能承诺配置将质量成本减半。

§4 的维护观察窗约为 2025-01 至 2026-02；73.8% 是窗内单次提交，控制文件数后维护与成熟度关联不显著。§6.3 未回答维护或内容具体性是否改善结果。因此正文按事实变更修订的做法属于工程建议，而非本研究证明的最佳维护周期。

**公开包检查边界**：[Zenodo 21406147](https://zenodo.org/records/21406147) 的 API 元数据确认 CC-BY-4.0、文件 `repo-maturity-and-software-outcomes-main-updated.zip`（43,251,402 字节，MD5 `150bc76bdcb4601fddc605451a0a6e05`）。本次只核元数据，未读包内容、未独立复算分组／时间／维护分母；这个验证缺口不构成反驳论文结果的证据。
