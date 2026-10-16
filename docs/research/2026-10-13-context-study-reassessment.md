主线：二，额外能力何时值得加
改变的建议：保留能改变任务行为的上下文，按事实变化维护；比较内容、加载方式、正确性和成本，不以文件长度、编辑频率或配置等级代替效果。[经验]
证据摘要：四项上下文研究的全文／固定代码；本仓复算公开 DB、113 对有效运行及分组／时间字段。效率改善未伴随完整正确性验证，维护关联也非配置因果效果；未重跑模型，不合并样本。[研究／一手／经验]

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

成熟度取 2025-11 终点快照；agent-first 的 L2+ 组仅 3.8% 在采用月之前已有首个配置。表 5 的百分比由 `log(Y+1)` 系数作 `100 × expm1(β)` 换算，约两倍是这两个换算值之比，不是原量算术均值直接涨幅或总复杂度之比。配置后置、未观察的模型能力／使用强度和共用匹配对照池限制解释；告警在采用前已有升高，识别比复杂度更弱。不能因这些限制删除关联证据，也不能承诺配置将质量成本减半。

§4 的维护观察窗约为 2025-01 至 2026-02；73.8% 是窗内单次提交，控制文件数后维护与成熟度关联不显著。§6.3 未回答维护或内容具体性是否改善结果。因此正文按事实变更修订的做法属于工程建议，而非本研究证明的最佳维护周期。

### 公开包：已核分组与算术，未重估效果

[Zenodo 21406147](https://zenodo.org/records/21406147)，API 元数据许可 CC-BY-4.0。公开 ZIP `repo-maturity-and-software-outcomes-main-updated.zip` 已读取，43,251,402 字节，官方 MD5 `150bc76bdcb4601fddc605451a0a6e05` 一致；SHA256 `efd25b9f0d6427ac7eb629ab03d7d4f8f5c21fa2fa0355568108c8875e24ad7b`。以下路径均以包内 `repo-maturity-and-software-outcomes-main/` 为根。**[一手：固定公开包；经验：标准库复核]**

- `study2/data/maturity_levels.csv` 的 509 行分组为 L1／L2／L3／L4＝236／210／23／40。与 `agent_first.txt` 相交为 214／155／5／22（396）；与 `ide_first.txt` 相交为 22／55／18／18（113）。两名单原有 401／117 项，不应把名单总数当可访问且已分类的分母。
- `study2/notebooks/DiffinDiff.Rmd` 第 92–105 行实际采用 `log(Y+1)`；`study2/results/static_effects_agent_subset.csv` 的 12 行 `Percent_Change` 与 `100 × expm1(Estimate)` 的最大绝对误差为 8.7e-14。这里只核公开系数的换算，没有独立拟合 DiD，也未验证模型假设。
- `study1/analyzer/src/temporal_health.py` 第 132–171 行把单条历史立即归为 set-and-forget，不要求最短随访时间；它不等于已证实失效。`docs/PACKAGE_MANIFEST.md` 与 `study1/REPRODUCE_STUDY1.md` 明确企业逐仓及时间序列输入不公开；已读 Study2 标签／面板没有首配置日期，3.8%与73.8%仍未独立复算。

**动态时间轴的条件性实现风险。** 同一 Rmd 第 64–70 行将年月转成 `YYYYMM` 整数，动态调用传入 `horizon=-6:6`、`pretrends=-6:-2`。[didimputation 固定提交 69b4f8d（DESCRIPTION 0.5.0）第 127–130 行](https://github.com/kylebutts/didimputation/blob/69b4f8dfe16b007474721fc5610859b56a80cdc6/R/did_imputation.R#L127-L130)直接相减，不重新映射连续月份，因此这组脚本／库组合把 2025-01 相对 2024-12 算作 89 而非 1。按公开面板的 AF 分层标志、真实日历 ±6 月范围计数，L1 有 236 个采用前／41 个采用后仓库月跨年错位，L2+ 为 210／18；其中采用前计数覆盖 −6…−1，实际 `pretrends=-6:-2` 对应 L1／L2+ 的 228／207 行。这些行不会落入对应的前趋势虚拟变量，不等于退出回归；计数还包含结果缺失，不能称为最终估计样本损失。包未锁库版本、未附运行会话版本，本次也未重估，因此仅将“六个月动态轨迹／前趋势已充分核实”收紧为待核；静态调用不设这些事件窗，不能据此宣布 +52.7%／+26.7% 被推翻。

复核入口（仅读既有 ZIP，不解包或执行其代码；`ZIP` 指向上述固定包）：

```sh
python3 - "$ZIP" <<'PY'
import collections, csv, hashlib, io, math, sys, zipfile
csv.field_size_limit(2_000_000)
b = open(sys.argv[1], "rb").read()
assert hashlib.sha256(b).hexdigest() == "efd25b9f0d6427ac7eb629ab03d7d4f8f5c21fa2fa0355568108c8875e24ad7b"
with zipfile.ZipFile(io.BytesIO(b)) as z:
    root = "repo-maturity-and-software-outcomes-main/"
    def text(p): return z.read(root + p).decode()
    def rows(p): return list(csv.DictReader(io.StringIO(text(p))))
    levels = rows("study2/data/maturity_levels.csv")
    print("levels", collections.Counter(r["maturity_level"] for r in levels))
    for group in ("agent_first", "ide_first"):
        names = set(text("study2/data/" + group + ".txt").splitlines())
        print(group, len(names), collections.Counter(r["maturity_level"] for r in levels if r["repo_name"] in names))
    effects = rows("study2/results/static_effects_agent_subset.csv")
    print("conversion max error", max(abs(100 * math.expm1(float(r["Estimate"])) - float(r["Percent_Change"])) for r in effects))
    panel = rows("study2/data/panel_event_monthly.csv")
    for flag in ("l1_agent_subset", "l2+_agent_subset"):
        counts = collections.Counter()
        for r in panel:
            if r[flag] != "True" or r["event"] in ("", "NA", "0"):
                continue
            y, m = map(int, r["time"].split("-"))
            ey, em = map(int, r["event"].split("-"))
            calendar = 12 * (y - ey) + m - em
            numeric = 100 * (y - ey) + m - em
            if -6 <= calendar <= 6 and calendar != numeric:
                counts["pre" if calendar < 0 else "post"] += 1
                if -6 <= calendar <= -2:
                    counts["pretrends"] += 1
        print(flag, dict(counts))
PY
```

上述分组、换算、日期计数已用标准库实际执行；未安装依赖、运行上游 R／Python 模块、分类器或模型。建议仍是短配置试用、按事实变化维护，新增实现风险不替代对任务正确性、返工和费用的实际比较。

## Agent READMEs：维护与内容口径

> 核实：2026-10-14（UTC+8）。**[研究：v2 全文；一手：固定公开源码；经验：采用判断]** 仅阅读论文与采集／分析代码，未运行上游程序或模型，未独立复算大数据文件。

**保留按事实变化维护；安全、性能按任务需要补充，不以编辑频率或凑齐 16 类内容为目标。** [v2（2026-08-09）§3、§4.3、§7.2](https://arxiv.org/html/2511.12884v2) 从 AIDev 中至少 5 stars 的 8,370 个仓库筛出 1,925 个仓库、2,303 个文件，三种指定文件名为 CLAUDE.md、AGENTS.md、copilot-instructions.md。内容分析另按三类比例抽样 332 个英文文件，由人工作多标签分类。安全 14.8%、性能 14.5%只表示主题是否出现，不衡量深度、正确性或执行效果，也不能判断仓库外文档、CI 和其他治理是否存在。正文因此只建议补充任务必需且难从代码或已有验证获得的具体约束。

### 维护的三个分母

- **文件**：§4.2 报告 CLAUDE／AGENTS／Copilot 各有 67.0%／59.4%／59.8%的文件被多次提交触及，包含首次创建在内的历史计数；不是同样比例的仓库持续维护。
- **已发生的相邻间隔**：中位数分别为 23.8／22.3／68.0 小时。[固定版本分析代码](https://github.com/woraamy/Agent-Context-File-Analysis/blob/77b16a9a53c99efcda1c98c98c4afcd807f7227c/scripts/analysis/ipynb_analysis/RQ3_analysis.ipynb)按 owner、repo、file_path 分组并计算 `diff().dropna()`：单次提交文件不贡献间隔，最后一次提交后的静默期也不计入，活跃文件贡献更多间隔。因此不是全部文件平均每隔一至三天维护，不能推出最佳周期，时间间隔本身也不足以排除 prompt tuning 等动机。
- **抽样维护提交**：v2 对排除首次创建的 100 个提交人工检查，92%含增加、修改或删除指令；这是维护发生时的内容比例，不是 92%的文件持续维护，也未证明这些修改改善任务结果。

[固定版本采集器](https://github.com/woraamy/Agent-Context-File-Analysis/blob/77b16a9a53c99efcda1c98c98c4afcd807f7227c/manifest_analysis/collectors/commit_collector.py)按文件路径读取历史，不设日期过滤。本次在全文和所读源码中未核得统一采集截止日，不将其写成固定一年观察窗。它与 A Few Pages 的窗内单次提交比例，在样本、观察窗和计数对象上不能直接作相反结论。

### 有限行为证据不能替代内容效果评估

v2 §4.3 另有两个仓库加入四空格缩进规则前后的违规率下降案例；作者明确两案例不能建立因果。它们提供有限的格式遵从线索，不能说全文完全没有行为证据，也不能据此证明安全、性能指令或某个维护周期有效。内容分类的出现率与这两个前后案例应分开解释。

## 历史页首核实范围

2026-10-16（UTC+8）编辑轮从 03 页首原样迁入以下历史记录；各项核实仍以原日期和范围为准，本次编辑不代表全页重新核实。共享指令与会话动作的详细证据见[上下文工具选择记录](2026-10-13-context-tool-choice.md)。

> 核实时间：2026-10-08；2026-10-11（UTC+8）补充论文版本、记忆/压缩边界与反例；10-13 新增固定项目指令对照、检索工具状态边界，并复核 Context Files 论文全文与公开数据，其余未重验。2026-10-14（UTC+8）补核 A Few Pages of Markdown v2 全文；10-15 补核公开包分组及换算口径，以及 Agent READMEs v2 的维护和内容分类边界；同日补核共享指令的发现、显式导入与加载观测，以及 Claude Code／Codex CLI 的会话动作契约；加载与会话动作仅作文档核查，未运行客户端或模型。
