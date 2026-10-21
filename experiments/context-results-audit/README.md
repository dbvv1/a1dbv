# 公开上下文实验：离线结果表审计

核实时间：2026-10-10 UTC。✅ 可用于学习实验单元、重跑取舍和可复核记录；**不是新模型实验，也不是论文因果结论的复现**。

本目录包含本仓库新写的 Python 标准库分析器和合成单测；下方P48另附人工选择账与固定报告器的离线记录，不附带第三方 CSV，不联网、不调用模型、不安装依赖。接收外部 CSV 后，把全行、每单元最早、每单元最新三种口径同时输出为 JSON。

## 固定来源

原作者：Prakhar Khatri；仓库：`codeprakhar25/context-files-coding-agents`。

| 项目 | 值 |
|---|---|
| commit | `084c40708e7211b0e6a0fe8d74337b2e048a832c` |
| 路径 | `data/results_summary.csv` |
| 字节数 | 56,354 |
| SHA256 | `96809726f635925bfe7cc0f91cbfea85d2b5ff7fc116a5934e168e2e280505f9` |
| Git blob SHA1 | `7355c52e1d06f26d11655e7862c3d7101df198b5` |

固定链接：[CSV](https://github.com/codeprakhar25/context-files-coding-agents/blob/084c40708e7211b0e6a0fe8d74337b2e048a832c/data/results_summary.csv)、[原作者计数溯源](https://github.com/codeprakhar25/context-files-coding-agents/blob/084c40708e7211b0e6a0fe8d74337b2e048a832c/paper/data/key_numbers.md)、[README 的 groupby 示例](https://github.com/codeprakhar25/context-files-coding-agents/blob/084c40708e7211b0e6a0fe8d74337b2e048a832c/README.md)。本次取得内容后自行计算 Git blob SHA1，与 GitHub 返回的值一致。

## 取得来源并复核

在仓库根目录运行；下载的是上述固定版本的公开数据，不需要 API key。临时目录位于仓库外，不应加入提交。

```sh
python3 -m unittest discover -s experiments/context-results-audit -v
audit_tmp="$(mktemp -d)"
curl --fail --location \
  https://raw.githubusercontent.com/codeprakhar25/context-files-coding-agents/084c40708e7211b0e6a0fe8d74337b2e048a832c/data/results_summary.csv \
  -o "$audit_tmp/results_summary.csv"
python3 experiments/context-results-audit/analyze_context_results.py \
  "$audit_tmp/results_summary.csv" --require-source-hash \
  > "$audit_tmp/findings.json"
cat "$audit_tmp/findings.json"
```

`--require-source-hash` 不匹配就失败。主动分析其他文件时可省略它，输出会明确标记不是本次固定来源。不要把标准输出重定向到输入文件。分析器不修改输入。

## 观测结果 [经验：离线算术复核]

291 行、288 个实验单元、**0 条完全相同的额外重复行**；3 个单元各有两条不同记录。54 条 Codex 记录没有 run ID，分析器会报告，不能把空 ID 当唯一键。

| agent / condition | 所有行：通过/行数 | 每单元取最新：通过/单元数 |
|---|---:|---:|
| claude_code / none | 25/47 | 24/45 |
| claude_code / always_on | 25/46 | 25/45 |
| claude_code / selective | 25/45 | 25/45 |
| codex / none | 30/51 | 30/51 |
| codex / always_on | 29/51 | 29/51 |
| codex / selective | 27/51 | 27/51 |

每单元取最早与最新的正确性结果相同，且都对应原作者的计数。全行 groupby 的 Claude none/always_on 比率则为 53.19%/54.35%，而非单元口径的 53.33%/55.56%。

重复单元的公共键：

| agent | strategy | task_id | repeat_index | 两条 pass 标签 |
|---|---|---|---|---|
| claude_code | none | OpShin__opshin__605 | 0 | 0 / 0 |
| claude_code | none | OpShin__opshin__616 | 1 | 1 / 1 |
| claude_code | always_on | pdm-project__pdm__3797 | 1 | 0 / 0 |

其时间、run ID、耗时和工具数并不相同。例如 pdm 单元的工具数为 0 与 72；它们不是被复制粘贴的同一整行。完整输出包含公共 run ID、时间、差异列和选取政策。

## 取舍规则与边界

- 单元键为 `(agent, strategy, task_id, repeat_index)`；最早/最新按 `created_at` 比较，同时间按 `run_id` 字典序破同值
- 时间严格接受无时区 `YYYY-MM-DD HH:MM:SS`，避免混用 aware/naive；这是原表的格式，不推断其实际时区
- 重复列名、无效二元标签、缺关键字段、空数据，以及同一单元内同时间同 ID 却不同 pass 标签，均拒绝处理
- 最早/最新只是**敏感性分析**，并不声称恢复了原作者的重试规则。CSV 无法说明为什么重跑、哪次应计入成本；标签相同也不意味着成本相同
- 此结果说明 README 汇总示例与单元平衡口径有歧义，不说明作者有不当行为，也没有证明论文结论反转
- 没有重跑 agent、gold tests、显著性/等效性检验或成本效果分析。13 个单测通过只验证这个分析器的行为

## 后续资料（2026-10-13）

[公开 DB 与作者脚本复核](../../docs/research/2026-10-13-context-study-reassessment.md#context-files失败解释与分析参数)补上 error 过滤依据，并提供只读 SQL 与精确算术复算。上面的 CSV 三种口径保留为历史敏感性分析；本目录分析器未改为推断 CSV 中不存在的 error 字段，也未重跑模型。

## 许可与公开边界

已读固定 commit 的 [MIT LICENSE](https://github.com/codeprakhar25/context-files-coding-agents/blob/084c40708e7211b0e6a0fe8d74337b2e048a832c/LICENSE)，版权为 2026 Prakhar Khatri；同版本 README 明确把 `data/` 聚合结果置于相同条款。若另行转载 CSV，应保留原许可和归属。这不授权转载未公开日志、凭据或其他目标仓库。本目录只保留来源链接/hash和新写的分析代码；第三方数据不随仓库分发。


## P48：分数参与选择后，怎样解释终评

这是人工数据角色回放，不是模型实验或完整优化器复现。使用同一组Skill描述与人工聚合分数，在三个假设历史中解释选型与终评；不是同一次真实运行的三个阶段。采用判断见[22](../../docs/22-agent-evaluation.md#自动优化后先区分选型分数与独立终评)。

```sh
python3 -m unittest discover -s experiments/context-results-audit -p 'test_p48_selection_replay.py' -v
python3 experiments/context-results-audit/p48_selection_replay.py
```

输入[p48-selection-fixture.json](p48-selection-fixture.json)明确标synthetic_not_model_result，固定一种Skill描述、候选顺序、方向与门槛；预注册相等时取较早轮，不声称复制官方指南的全部策略。输出[p48-selection-result.json](p48-selection-result.json)是本次实际脚本回放：

- A使用test选到v2，只能称selection_only；它不运行模型，也没有重现官方的训练改善及噪声检查。
- B选优函数只接ID／val分数，先冻结v1，再只读基线／v1的test；门槛不满足则reject，不根据v2较高的test重选。
- C假设v2因旧终评反馈而修改，旧test已为开发证据，fresh_eval缺失则defer。本窄脚本不实现新终评调度，非空fresh_eval须另评而非自动接受。

人工投入总计来自所有候选，含落选者；不是美元、模型成本、人的工时，也不是A/B路径的实际运行费用。投影只说明代码职责，不是进程／权限隔离。输入是人工聚合分数，不能给统计显著性、泛化或真实采用收益结论。

### 官方lite报告器的限定执行记录

[p48-report-contract.json](p48-report-contract.json)保存固定原脚本的源哈希、人工输入、实际起止／退出码、TSV与人工核对的摘要；未将原脚本或生成HTML复制入库。原脚本及许可链接见[研究记录](../../docs/research/2026-10-12-experiment-records.md#p48优化skill描述后如何接受收益)。

复查时先取得记录固定commit的build-report-lite.mjs并核SHA-256，再将某个cases项的inputs逐文件写到全新普通临时目录，运行 `node build-report-lite.mjs FIXTURE_DIR`；预期两例均exit 0、TSV与记录一致。Node本次为v24.19.0，不需SDK。不要使用真实用户轨迹或覆盖已有报告；这项外部原脚本检查不由默认unittest自动下载或运行。

报告只消费已经保存的数据。缺失rep不补零，失败状态与errors sidecar的计数不同；best徽章读显式轮次。记录中的selection故意含未选v2的test以检查消费语义，不能拿它作为合规三分终评日志。结果完整性仍需对照实际执行账和预定样本，不能从HTML标签推断。
