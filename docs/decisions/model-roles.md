# 强弱模型、推理档位和成本怎么选

**已有配置达标就保留；日常新任务用 Sol 6.1＋`medium` 或 Sonnet 5.5＋`medium` 起步，重验证与代码质量审查可直接试同模型 `high`。** 🟡 日常起点来自官方定位与研究判断；生产升档反馈来自 Sonnet 代码质量审查，迁移到 Sol 或其他角色及本仓净收益仍待验证。

## 先完成眼前这一项任务

**已有会话能完成任务就沿用；需要新开时，按可用客户端二选一，不改全局配置。**

```bash
# Codex
codex --model gpt-6.1-sol -c 'model_reasoning_effort="medium"'
# Claude Code
claude --model claude-sonnet-5-5 --effort medium
```

型号与档位须在当前账号、客户端和提供方可用；第三方 Claude 服务用其实际模型 ID。Sonnet 5.5 要求 Claude Code v2.1.284+，Haiku 5.5 要求 v2.1.293+。型号不可用或数据不能走该服务，就沿用合规可用入口，不为照抄表格换账户或购买套餐。

1. 给 Agent 正在做的目标、必须保留的行为和项目原检查；缺上下文或有效检查，先补齐，不把信息不足当成模型弱。
2. 按原标准接收 diff；修 bug 重放原触发路径，新增回归须能暴露原问题。人核漏项与检查覆盖；难以核验的任务保留强能力，高风险改动保留必要人工／专业检查。
3. 再决定是否沿用配置：把实现、子 Agent、重试、审查和返工一起算，比较新增有效发现、纠正轮次、等待与费用；收益被复核抵消就退回原配置。实际模型、effort、单任务账单或工时不可核就分别记未知，不从一次成功推断档位优劣。

**依据**：[官方配置] [Codex 单次覆盖](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)、[Claude CLI](https://code.claude.com/docs/en/cli-reference)、[型号与版本](https://code.claude.com/docs/en/model-config#model-aliases)；原核实 2026-10-26，Haiku 版本补核 10-28。命令已核文档与 Codex 帮助，未用这两条命令启动模型任务；验收与取舍为本页建议。

## 按角色分档，不全员一起升

| 工作 | Codex 起点 | Claude Code 起点 | 保留条件 |
|---|---|---|---|
| 范围清楚的功能、测试、日常协调 | Sol 6.1＋`medium` | Sonnet 5.5＋`medium` | 原验收达标，检查与返工可接受 |
| 跨文件审查、追调用链、查边界遗漏 | 同模型试 `high` | 同模型试 `high` | 多找到可核问题或补足关键验证；协调器按自身发现与投入另判 |
| 架构取舍、疑难 bug、复杂重构 | Astra＋`low`（Light） | Opus 5.5＋`medium`；重验证可试 `high` | 有明确质量需要即可选，不必先用轻量模型失败一次 |
| 明确检索、提取、按既有模式批量小改 | Luna＋`high` | Haiku 5.5＋`medium` | 结果易核对，遗漏与返工未抵消节省 |

Sol 的默认 effort 随客户端而异，`medium` 是本页明确选择；Luna `high`、Astra `low` 来自官方起步建议。同名 effort 不跨模型等量。子任务遇未知根因或矛盾证据也不能自动降档；Codex 子 Agent 未显式配置会继承父级模型与 effort，需要分档时明确两项设置，原生委派见 [08](../08-multi-agent.md#6-操作手册从一个大任务到并行执行)。

**依据**：[官方定位与档位] [OpenAI Models](https://learn.chatgpt.com/docs/models#pick-a-reasoning-effort)、[子 Agent 配置](https://learn.chatgpt.com/docs/agent-configuration/subagents#choosing-models-and-reasoning)、[Claude effort](https://code.claude.com/docs/en/model-config#choose-an-effort-level)；[02 的完整取舍](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)。原核实 2026-10-22，官方入口重核 10-26。

## 团队实践：看新增与丢失的发现

**Cloudflare 支持按角色分别判断，而非统一升档。** 其 Sonnet 5.5 代码质量审查随机分流后，`high` 带来更多引起后续修改的发现，团队转向高档；Opus 5.5 协调器升 `high` 却增费而无有意义发现增量，保留 `medium`。安全／性能仍用 `medium`，其中重要性能发现减少，团队计划继续试高档。作者改了被标行不代表发现正确，模型裁判也有局限，最新观察仅一天。

**更便宜或评论更少不等于审查更好。** CodeRabbit 回放 13 个真实 PR，保留同一 effort 阶梯，只切换 Sonnet 5.5 thinking：thinking 开／关分别通过常规可执行评论抓到 6／5 个已知问题，两组各有漏项。每次 $0.47／$0.41 是按价表回算的 Claude 调用费，不含摘要、验证小模型和人工；不是单独升 effort 的效果，另组 44 PR 的质量裁判尚未完成。

**依据**：[生产采用团队自报] [Cloudflare](https://blog.cloudflare.com/obsessive-inference-optimization/)（10-19 发布、10-26 重核）；[评审团队回放] [CodeRabbit](https://www.coderabbit.ai/blog/sonnet-5-5-model-review)（09-28 发布、10-28 核）。本仓未复跑；更多指标边界见 [02](../02-models-and-cost.md#当前最高水平为质量缺口分配投入而不是统一加档)。

## 成本高时，先找浪费在哪

| 入口 | 看哪里 | 不要混算什么 |
|---|---|---|
| Codex 的 ChatGPT 订阅 | CLI `/status` 或用量面板 | 额度／重置时间不等于 API 美元；credits 单价不能换算套餐可用天数 |
| Claude Code Pro／Max | `/usage` 套餐用量条 | Session 美元数是 API 等价估算；订阅支出看套餐与实际额外用量 |
| API key／额外 credits | 对应账单与用量入口 | 核实际模型、缓存、输出、速度档；API 与 credits 分开，Codex credits 无独立缓存写入费 |

**依据**：[官方计费] [OpenAI](https://learn.chatgpt.com/docs/pricing)、[Claude `/usage`](https://code.claude.com/docs/en/costs#using-the-usage-command)；2026-10-28 核，未读取账户用量。重复读材料／派同一调查先收窄输入；中途只换 effort 核[保缓存入口](../02-models-and-cost.md#同模型换推理档保留缓存前缀)。质量已够而等待过长，才另比较速度档。

**高 effort 也可能整项更省，但不能据此设成省钱默认。** VulcanBench 作者在同一 Codex 0.159.0／Sol 6.1 上每档各跑一次 23 道旧程序题，`medium`／`high` 分别通过 22／23 题，API 等价每题费用 $0.40／$0.33；原因是高档总 token 更少。它实际用 ChatGPT Pro，估算不含裁判且非订阅实扣；补丁与隐藏答案未公开。

**便宜实现加上强审查也可能不省。** Reddit 用户自报两项已由 Opus 5.5 规划的任务，两模型均用 `high`；Sonnet 5.5 实现后交 Opus 审查并退修或代修，都比 Opus 单独完成更慢更贵，但 Opus 代修组合补获一个 bug。代码与费用未公开，不能据此改为全员强模型。

**依据**：[独立作者评测] [VulcanBench](https://vulcanbench.com/benchmarks/swe-v4-gpt61-sol-v318.html)与[固定复现范围](https://github.com/morganlinton/VulcanBenchCOM/blob/e4c7e6f6d345d72d8299db37cff1165f8d33007a/assets/data/swe-v4-gpt61-sol-v318/REPRODUCING.md)（10-01 发布）；[社区反例](https://www.reddit.com/r/ClaudeCode/comments/1wsqfzk/comment/pcnxwy4/)；均于 2026-10-28 核读，未复跑。可借的是整项接收成本，不是轻重模型的通用胜负。
