# 强弱模型、推理档位和成本怎么选

**已有配置达标就保留；日常新任务用 Sol 6.1＋`medium` 或 Sonnet 5.5＋`medium` 起步，边界验证和代码质量审查直接试同模型 `high`。** 🟡 本页起点沿用 [02 的选择](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)；本仓真实任务上的模型与 effort 净收益仍待验证。

## 第一步：只改这一次任务

**在已有项目中，按已能使用的客户端二选一启动，再给它目标、必须保留的行为和已有检查命令。**

```bash
# Codex
codex --model gpt-6.1-sol -c 'model_reasoning_effort="medium"'

# Claude Code
claude --model claude-sonnet-5-5 --effort medium
```

Codex 的 `-c`、Claude 的 `--effort` 都只覆盖本次启动；型号与档位须在当前账号和客户端可用。Sonnet 5.5 要求 Claude Code v2.1.284+，下表的 Haiku 5.5 要求 v2.1.293+。第三方 Claude 提供方用其实际模型 ID。

**按原标准接收，再决定是否沿用配置。** 看实际 diff 是否完成目标并保留约束，运行相关检查；修 bug 要重放触发路径。比较漏项、纠正轮次和等待，把主 Agent、子 Agent、重试、检查与返工的投入一起算。

**依据**：[官方配置] [Codex 单次覆盖](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)、[Claude CLI 参数](https://code.claude.com/docs/en/cli-reference)、[Claude 型号与版本要求](https://code.claude.com/docs/en/model-config#model-aliases)；原核实 2026-10-26，Haiku 版本要求补核 2026-10-28。命令参数已核文档与本地 Codex 帮助，未启动模型任务。

## 按任务分配，而不是全员一起升档

| 眼前的工作 | Codex 起点 | Claude Code 起点 | 保留这项选择的条件 |
|---|---|---|---|
| 范围清楚的功能、测试与日常协调 | Sol 6.1＋`medium` | Sonnet 5.5＋`medium` | 能按现有要求交付，检查与返工可接受 |
| 跨文件审查、追调用链、查边界遗漏 | 同模型试 `high` | 同模型试 `high` | 找到更多可核实的问题或补足关键验证；协调器无需跟着升档 |
| 架构取舍、跨模块疑难 bug、复杂重构 | Astra＋`low`（Light）起步 | Opus 5.5＋`medium`；重验证可试 `high` | 有明确的推理或质量需要，可以直接选，不必先用轻量模型失败一次 |
| 明确的检索、提取、按既有模式批量小改 | Luna＋`high` | Haiku 5.5＋`medium` | 输出容易核对；发现遗漏或返工抵消节省就恢复原配置 |

**先补缺上下文和有效检查，再判断能力缺口。** 子 Agent 也按任务难度选：探索未知根因、解决矛盾证据，不能仅因它是“子任务”就降档。Codex 子 Agent 未显式配置时继承父级模型与 effort；分档时明确指定该角色的两项设置。需要额外角色时用[原生委派](../08-multi-agent.md#6-操作手册从一个大任务到并行执行)，已有单 Agent 能完成的工作保持原样。

Codex 的 Sol effort 默认随客户端而异；这里明确选 `medium` 是本页起点。Luna 的 `high`、Astra 的 `low` 来自官方起步建议；同名 effort 不能跨模型当成同等投入。

**依据**：[官方任务定位与档位] [OpenAI Models](https://learn.chatgpt.com/docs/models#pick-a-reasoning-effort)、[子 Agent 模型选择](https://learn.chatgpt.com/docs/agent-configuration/subagents#choosing-models-and-reasoning)、[Claude effort](https://code.claude.com/docs/en/model-config#choose-an-effort-level)；[既有判断](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)，原核实 2026-10-22；官方入口重核 2026-10-26。

## 先委派哪种小任务，何时收回

**轻量模型先试输入固定、做法明确、结果能逐项核对的执行单元，负责人保留取舍与接收。** 下面两类已有本仓接收记录：

| 可以先交出去 | 派发时写清 | 负责人怎样接收 |
|---|---|---|
| 按现成命令提取固定提交的 CI 状态 | 完整 SHA、三个来源（commit statuses／check-runs／workflow runs）和只读入口；保留 `query_scope`、计数、原状态与 `description`；原响应留到接收 | 对照原响应和实际投影，核对“成功但跳过审核”、零记录、`action_required`；收数据，不让执行者代定能否合入 |
| 有明确输入契约的小修复与回归 | 独占实现／测试文件，给失败输入、必须保留的合法输入与检查命令 | 从真实 CLI 重放非法与合法输入，再跑定向回归；本仓 JSON 语法修复由负责人重放 25 项 CLI 输入与 9 项回归后接收 |

**数据正确但指定文件没改，就只接收数据，把剩余工作改成定点编辑。** CI 任务已有反例：交付补项连续两轮重新取数，却仍未补必需字段。遇到这种重复，先停止旧任务并确认写者已停，再复用保留结果修订；补齐输入后仍反复误解契约，才提高对应角色投入。

**依据**：[本仓真实委派与接收] [CI 结果与盲读卡点](../collaboration/local-jobs/A-CI-PROJECTION-READER-20261027.md)、[停止重复修订的记录](../collaboration/local-jobs/A-CI-EXACT-SHA-READER-20261028.md)、[JSON 修复接收](../collaboration/local-jobs/A-JSON-SYNTAX-READER-001.md)；核读 2026-10-28。Memos 状态与跳过说明已正确区分，JSON 修复已重放接收；Datasette 数据已复核，盲读验收未通过。记录支持任务划分与接收方式，尚无模型档位、总耗时与返工成本的同题比较。

## Cloudflare 实际怎么配：审查升档，协调不跟涨

Cloudflare 的生产代码评审链在 10 月复盘中公布了按角色取舍的实际结果：

| 角色 | 复盘时配置 | 为什么值得借鉴 |
|---|---|---|
| 协调器 | Opus 5.5＋`medium` | 同模型升到 `high` 增加成本，未带来有意义的发现增量 |
| 代码质量审查 | Sonnet 5.5：从 `medium` 转向 `high` | 随机分流后，高档产生更多被作者后续修改的发现 |
| 安全、性能审查 | Sonnet 5.5＋`medium` | 裁判评估的重要性能发现减少，团队计划继续试高档；这两项不宜直接当作低档成功样板 |

“被采用”按作者后续修改被标行衡量，另有模型裁判；最新观察窗口很短。保留某档要看该角色的重要发现和总投入，不能只看整条链降本。

**依据**：[一手／采用团队生产自报] [Cloudflare 工程复盘](https://blog.cloudflare.com/obsessive-inference-optimization/)，2026-10-19 发布、2026-10-26 重核；独立于被比较模型厂商。细节与指标限制见 [02](../02-models-and-cost.md#当前最高水平为质量缺口分配投入而不是统一加档)。

## 成本高时，先改哪一项

**先查自己实际使用的计费入口，再按上面的任务分档调整。**

| 你用的入口 | 现在看哪里 | 怎样读数字 |
|---|---|---|
| Codex 的 ChatGPT 订阅 | CLI `/status` 或用量面板 | 看剩余额度与重置时间；credits 单价不能直接换算订阅能用几天 |
| Claude Code 的 Pro／Max 订阅 | `/usage` 的套餐用量条 | Session 美元数是按 token 估算的 API 成本；订阅支出看套餐与实际额外用量 |
| API key 或已开启的额外 credits | 对应服务的账单／用量入口 | 核实际模型、缓存、输出和速度档；API 与 credits 分开计。Codex credits 没有独立缓存写入费，API 按 API 价表 |

**依据**：[官方计费与查看入口] [OpenAI Work／Codex](https://learn.chatgpt.com/docs/pricing)、[Claude Code `/usage`](https://code.claude.com/docs/en/costs#using-the-usage-command)；核读 2026-10-28，未读取账户用量。

- **重复读长材料、重复派同一调查**：先收窄输入与分工；长会话中途只换 effort 时，核对[保缓存入口](../02-models-and-cost.md#同模型换推理档保留缓存前缀)。
- **质量已达标，只是等得太久**：再比较提速选项；模型、effort、速度模式分开选择。

**高 effort 的整项费用也可能更低。** VulcanBench 作者用同一 Codex 0.159.0、Sol 6.1，在 23 道旧程序重建题上每档各跑一次：`medium` 通过 22 题，`high` 通过 23 题；按 token 回算的每题 API 等价费用从 $0.40 降到 $0.33，原因是 high 的整项 token 更少。可借的是比较完成任务的投入，而非把 high 设为省钱档。该次使用 ChatGPT Pro，美元数不含裁判费用、不是订阅实扣；公开材料可重算分数与费用，候选补丁及隐藏答案未公开。

**依据**：[独立作者评测] [VulcanBench 五档结果](https://vulcanbench.com/benchmarks/swe-v4-gpt61-sol-v318.html)、[固定复现范围](https://github.com/morganlinton/VulcanBenchCOM/blob/e4c7e6f6d345d72d8299db37cff1165f8d33007a/assets/data/swe-v4-gpt61-sol-v318/REPRODUCING.md)；2026-10-01 发布、2026-10-28 核读，未复跑模型。

真实使用反馈也有分歧：V2EX 的 ezioswj 自述用 Sol 开荒、将路径明确的工作交给 Luna；另一位用户报告 Sol 6.1 `low` 仍慢、额度消耗高。它们适合提醒你检查自己的任务形状，不能据此估算能用几天或承诺某档更省。

**依据**：[社区原帖] [V2EX：模型分工（#2）](https://www.v2ex.com/t/1247018)、[V2EX：低档仍慢的反馈](https://www.v2ex.com/t/1248411)；2026-10-26 核读、2026-10-28 重核。

## 何时不适用

- **任务难以核验、错误代价高**：保留强能力与必要的人工／专业检查，不拿轻量输出代替验收。
- **模型在当前入口不可用，或数据不能走该服务**：沿用合规可用的配置，不为照抄表格换账户或购买套餐。
