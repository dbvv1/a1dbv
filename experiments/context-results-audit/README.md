# 公开上下文实验：离线结果表审计

核实时间：2026-10-10 UTC。✅ 可用于学习实验单元、重跑取舍和可复核记录；**不是新模型实验，也不是论文因果结论的复现**。

本目录只有本仓库新写的 Python 标准库分析器和合成单测，不附带第三方 CSV，不联网、不调用模型、不安装依赖。接收外部 CSV 后，把全行、每单元最早、每单元最新三种口径同时输出为 JSON。

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

## 许可与公开边界

已读固定 commit 的 [MIT LICENSE](https://github.com/codeprakhar25/context-files-coding-agents/blob/084c40708e7211b0e6a0fe8d74337b2e048a832c/LICENSE)，版权为 2026 Prakhar Khatri；同版本 README 明确把 `data/` 聚合结果置于相同条款。若另行转载 CSV，应保留原许可和归属。这不授权转载未公开日志、凭据或其他目标仓库。本目录只保留来源链接/hash和新写的分析代码；第三方数据不随仓库分发。
