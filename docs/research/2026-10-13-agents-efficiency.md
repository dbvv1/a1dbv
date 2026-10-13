# AGENTS.md 效率研究复核（2026-10-13）

## 可直接采用的判断

**[研究：全文；经验：采用判断]** **单一 GPT-5.2-Codex、10 仓库124个小型PR任务；公开数据实际113对有效运行。两组运行时间／输出token中位数分别低28.6%／16.6%，不代表同等正确率下的成本收益。** 综合结论宜写“效率可能改善，需随正确性一起验证”，不把效率作为指令文件固有收益。

保留什么上下文：这篇只比较整个文件有／无，并未消融目录、命令或行为约束。不能据此承诺“越精简越省”，也不能证成“目录概览应一律删除”；保留可验证改变定位、实施或验收行为的信息仍是合理采用判断，不是本研究单独证明的内容配方。

## 论文方法边界 [研究：全文]

[arXiv v2 全文](https://arxiv.org/html/2601.20404v2)（2026-03-30）§3：同题、同快照配对；只保留根指令含约定、架构、项目描述的仓库，任务限≤100变更行／≤5文件；任务提示由PR diff生成。§3.1.8的完成检查只是随机50题人工确认非空、非琐碎且方向符合，未测测试通过率或语义正确性。§5把具体内容和机制效果留作后续研究。

## 附录独立复算 [一手：公开数据／源码；经验：标准库复算]

来源：[Zenodo 18348507](https://zenodo.org/records/18348507)，v1.0；[公开ZIP](https://zenodo.org/api/records/18348507/files/Dataset_and_Replication_Package.zip/content)，19,869,181字节，MD5 `cf015529276d734f61bd19eb1950213f`，与[API](https://zenodo.org/api/records/18348507)一致。以下路径均以包内 `Dataset_and_Replication_Package/` 为根。

- 数据：`Data/replicated_pr_outputs/{FULL_FILE,NONE}/Codex/*_pr_replication_data.json`。各124项，其中各11项均FOSSBilling checkout失败，且两边是同11题；表1来自其余113对，全部prompt与日志commit_hash配对一致。不能把124候选任务写成124个有效运行，也不能将这11题算模型失败。
- 原表精确复算：NONE→FULL_FILE的时间中位数98.573995→70.343017秒，输出2925→2440；均值162.9416517→129.9090449秒、5744.814159→4591.460177。原百分比是两组中位数之比，并非“典型单题省28.6%”：逐题相对降幅中位数分别13.65%／13.05%；79/113对更快、76/113对输出更少。这些是不同估计量，不应混用。
- `PullRequestReplicator/PullRequestReplicator.py::main_agent_logic`只在`agent.run`前后计时；clone、checkout、复制指令和事后diff采集不计入。故这是agent进程耗时，不是端到端交付时间，更不是CPU成本／美元账单。
- `RunCodexAgent/CodexAgent.py::run`用`codex exec --model gpt-5.2-codex --json`，容器内绕过审批／内建沙箱；没有显式timeout、token／step预算或reasoning-effort。Docker安装未pin CLI。公开session_meta有0.84.0／0.87.0／0.88.0／0.89.0；15对online-go.com的FULL_FILE为0.88.0、NONE为0.87.0，其余98对同版本。排除这15对后中位数比降幅仍为17.93%／10.53%；这只是样本敏感性检查，不估计CLI版本因果效应。
- `JAWs_Analysis/stats.py`把非字符串条目视为“successful”；取`turn.completed.usage`。它不检查测试通过或补丁正确性。226个有效运行各只有一个turn.completed。
- **费用不能从表1 Total直接读。** 226条CLI usage全部与其末次公开日志`token_count.info.total_token_usage`的对应input／cached／output值一致；日志中total=input+output。表1 v2 Total却可精确复现为input+cached+output：NONE均值687632.13、FULL_FILE619321.70。运行时total实际均值358754.82→323242.97，中位数119259→125164。可明确说表1 Total不是运行时total且额外加了cached；不再由该列推算钱，也不需借用另一研究或当前Codex格式猜字段。这里仅讨论本研究的统计列。

## 验证范围

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
