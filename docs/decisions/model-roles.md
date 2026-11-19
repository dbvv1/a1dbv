# 强弱模型、推理档位和成本怎么选

**已有配置达标就保留；没有稳定配置的日常新任务，Codex 有 GPT-6.2 Sol 就先试客户端选定的 effort 和 Standard 速度，Claude Code 仍从 Sonnet 5.5＋`medium` 起步。** 边界验证与代码审查可按缺口试同模型 `high`，不把速度档当推理档。🟡 见 [02](../02-models-and-cost.md#1-从默认起步按缺口调整)；本仓未验证 6.2 相对已有配置的净收益。

## 第一步：只改这一次任务

**在已有项目中，按已能使用的客户端二选一启动，再给它目标、必须保留的行为和已有检查命令。**

```bash
# Codex
codex --model gpt-6.2-sol

# Claude Code
claude --model claude-sonnet-5-5 --effort medium
```

上述参数只覆盖本次启动。Codex CLI 需 0.166.0+；用 `/model` 核实际型号与 effort；`--model` 不重置已保存的速度，按下方步骤确认 Standard。6.2 不可用时保留已验证配置。Sonnet 5.5 需 Claude Code v2.1.284+，Haiku 5.5 需 v2.1.293+。第三方提供方沿用已获准入口；无法确认实际模型或档位就记未知，不按客户端名称推断。[6.2 CLI 与账号资格](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex)（2026-11-19 核读）

**按原标准接收，再决定是否沿用配置。** 看实际 diff 是否完成目标并保留约束，运行相关检查；修 bug 要重放触发路径。检查缺依赖且当前不允许安装时，列明未跑项，保留验收缺口；不能据此判为模型能力不足，`taskDone` 或审查标签也不能替代实际结果。比较漏项、纠正轮次和等待，把主 Agent、子 Agent、重试、检查与返工的投入一起算。

**依据**：[官方配置] [Codex 单次覆盖](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)、[Claude CLI 参数](https://code.claude.com/docs/en/cli-reference)、[Claude 型号与版本要求](https://code.claude.com/docs/en/model-config#model-aliases)；原核实 2026-10-26，Haiku 版本要求补核 2026-10-28。本地帮助核验针对旧入口；6.2 命令以现行官方文档为据，未启动模型任务。

**读者反馈**：[jrnl 配置修复](../collaboration/local-jobs/A-MODEL-EFFORT-READER-20261029.md)：读者沿用表外后端、effort 未知；返工的本机真实 CLI／官方测试仍缺，未完整验收。记录核读 2026-11-01，不新增模型优劣结论或修订页照做验收。

### 确认速度后再开始任务

**先读当前速度，不盲输切换命令。** Codex CLI 会保存速度选择，单次 `--model` 覆盖不保证回到 Standard。在 CLI 输入 `/` 查看当前模型可用命令，核界面显示的活动速度；CLI 0.170.0 可在 `/statusline` 启用 `model-with-reasoning`，在页脚同时看模型、推理档与 `fast`／`ultrafast`。速度标签依赖当前模型目录；没显示标签不等于 Standard。若明确处于 Fast，重复 `/fast`；若明确处于 Ultrafast，重复 `/ultrafast`，再确认已回到 Standard。已是 Standard 就不切换，无法确认则先查清，不把“未写速度参数”当作 Standard。速度选择会保存，不属于上面仅本次生效的模型参数。

**依据**：[官方 CLI 速度控制](https://learn.chatgpt.com/docs/agent-configuration/speed#codex-cli-controls)、[CLI 0.170.0 页脚实现](https://github.com/openai/codex/blob/rust-v0.170.0/codex-rs/tui/src/chatwidget/status_surfaces.rs#L726-L730)及[快照测试](https://github.com/openai/codex/blob/rust-v0.170.0/codex-rs/tui/src/chatwidget/tests/status_and_layout.rs#L4509-L4576)，2026-11-19 核读；未实跑新版界面，页脚也不代表服务端实扣。

## 按任务分配，而不是全员一起升档

| 眼前的工作 | Codex 起点 | Claude Code 起点 | 保留这项选择的条件 |
|---|---|---|---|
| 范围清楚的功能、测试与日常协调 | GPT-6.2 Sol＋客户端选定的 effort（可用时） | Sonnet 5.5＋`medium` | 能按现有要求交付，检查与返工可接受 |
| 跨文件审查、追调用链、查边界遗漏 | 同模型试 `high` | 同模型试 `high` | 找到更多可核实的问题或补足关键验证；协调器无需跟着升档 |
| 架构取舍、跨模块疑难 bug、复杂重构 | Astra＋`low`（Light）起步 | Opus 5.5＋`medium`；重验证可试 `high` | 有明确的推理或质量需要，可以直接选，不必先用轻量模型失败一次 |
| 明确的检索、提取、按既有模式批量小改 | Luna＋`high` | Haiku 5.5＋`medium` | 输出容易核对；发现遗漏或返工抵消节省就恢复原配置 |

**先补缺上下文和有效检查，再判断能力缺口。** 子 Agent 也按任务难度选：探索未知根因、解决矛盾证据，不能仅因它是“子任务”就降档。Codex 子 Agent 未显式配置时继承父级模型与 effort；分档时明确指定该角色的两项设置。需要额外角色时用[原生委派](../08-multi-agent.md#6-操作手册从一个大任务到并行执行)，已有单 Agent 能完成的工作保持原样。

Codex 的 Sol effort 默认随客户端而异；本页沿用客户端实际选定值，不统一指定 `medium`。Luna 的 `high`、Astra 的 `low` 来自官方起步建议；同名 effort 不能跨模型当成同等投入。

**依据**：[官方任务定位与档位] [OpenAI Models](https://learn.chatgpt.com/docs/models#pick-a-reasoning-effort)、[子 Agent 模型选择](https://learn.chatgpt.com/docs/agent-configuration/subagents#choosing-models-and-reasoning)、[Claude effort](https://code.claude.com/docs/en/model-config#choose-an-effort-level)；[既有判断](../02-models-and-cost.md#1-从默认起步按缺口调整)，原核实 2026-10-22；官方入口重核 2026-10-26。

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
| Claude Code 的 Pro／Max／Ultra 订阅 | `/usage` 的套餐用量条 | Session 美元数是按 token 估算的 API 成本；订阅支出看套餐与实际额外用量 |
| API key 或已开启的额外 credits | 对应服务的账单／用量入口 | 核实际模型、缓存、输出和速度档；API 与 credits 分开计。Codex credits 没有独立缓存写入费，API 按 API 价表 |

**依据**：[官方计费与查看入口] [OpenAI Work／Codex](https://learn.chatgpt.com/docs/pricing)、[Claude Code `/usage`](https://code.claude.com/docs/en/costs#using-the-usage-command)；查看入口核读 2026-10-28，套餐名称按 [02](../02-models-and-cost.md#3-订阅额度与成本控制)补核 2026-10-31；未读取账户用量。

- **重复读长材料、重复派同一调查**：先收窄输入与分工；长会话中途只换 effort 时，核对[保缓存入口](../02-models-and-cost.md#同模型换推理档保留缓存前缀)。
- **质量已达标，只是等得太久**：再比较提速选项；模型、effort、速度模式分开选择。

**从 6.1 Sol 换到 6.2 Sol，先重跑一项已验收的代表任务。** 从原修复前的同一提交开两个工作树，用同一客户端、提示、推理档和速度档，只换模型。先确认回归检查在原提交会失败，再用它验收两份补丁，最后比较从启动到验收的时间和实际用量；漏过已知回归就保留旧配置，别把更快返回当成更快修好。若两组都达标，再按同样方法比较升档是否值得。

外部结果说明为什么要分开看：Corti 两轮用 OpenCode `max` 跑相同六个公开 bug，6.1 Sol 约 19 分钟、6/6，6.2 Sol 14 分钟、5/6（含失败）；这是竞品团队分日各跑一次的自报。VulcanBench 的 23 项旧程序重建中，6.2 Sol 的 `low` 和 `xhigh` 都是 23/23，但分别为 2.8 和 8.2 分钟／题，约 $0.23 和 $0.46／题；同任务的 6.1 历史组用 CLI 0.159.0，6.2 用 0.166.0，不能把耗时差全归给模型。同一评测的 6.1 组里，`medium` 过 22/23、约 $0.40／题，`high` 反而过 23/23、约 $0.33／题：升档也可能减少整项投入，仍须看本轮结果。VulcanBench 美元数不含裁判费用，是按 token 回算的 API 等价费用，不是 Codex 订阅实扣。

**依据**：[Corti 6.1 一轮](https://corti.ai/blog/corti-s1-model-race)、[6.2 一轮](https://corti.ai/blog/corti-s1-gpt-6-2-model-race)；[VulcanBench 6.2 五档及 6.1 历史组](https://vulcanbench.com/benchmarks/swe-v4-gpt62-sol-v331.html)、[6.1 原结果](https://vulcanbench.com/benchmarks/swe-v4-gpt61-sol-v318.html)及[6.1 固定复现范围](https://github.com/morganlinton/VulcanBenchCOM/blob/e4c7e6f6d345d72d8299db37cff1165f8d33007a/assets/data/swe-v4-gpt61-sol-v318/REPRODUCING.md)。2026-11-20 核读，未复跑模型；VulcanBench 可重算公开指标，补丁和隐藏答案未公开。

**换审查配置时，逐项对照新增与丢失的发现，再算完整流程成本。** CodeRabbit 冻结输入回放 13 个真实 PR，保持按角色的 `low/medium/high` 阶梯，只切换 Sonnet 5.5 thinking：按常规可执行评论计，开启抓到 6 项、关闭抓到 5 项；开启补获两项，却把关闭能正常报告的一项只报到 diff 外。每次 $0.47／$0.41 是 Claude 调用按价表回算的费用，不含摘要、验证小模型与人工处理；这不是单独升 effort 的效果。另与 Sonnet 5 对照的 44 PR 组尚未完成质量裁判，评论减少不代表质量改善。

**依据**：[一手／评审工具团队回放] [CodeRabbit 配置、漏项与成本](https://www.coderabbit.ai/blog/sonnet-5-5-model-review)，2026-09-28 发布、2026-10-28 核读；本仓未复跑。

真实使用反馈也有分歧：V2EX 的 ezioswj 自述用 Sol 开荒、将路径明确的工作交给 Luna；另一位用户报告 Sol 6.1 `low` 仍慢、额度消耗高。它们适合提醒你检查自己的任务形状，不能据此估算能用几天或承诺某档更省。

**便宜实现＋强审查也可能不省。** Reddit 用户 msw3age 自报两项任务均由 Opus 5.5 规划、两模型用 `high`；Sonnet 实现后交 Opus 审查并退修或代修，都比 Opus 单独完成更慢、更贵，但代修组合额外抓到一个 bug。具体费用与代码未公开，适合提醒比较返工和新增发现，不据此改为全员强模型。

**依据**：[社区原帖] [V2EX：模型分工（#2）](https://www.v2ex.com/t/1247018)、[V2EX：低档仍慢的反馈](https://www.v2ex.com/t/1248411)（2026-10-26 核读、2026-10-28 重核）；[Reddit：混合模型返工反例与作者补充](https://www.reddit.com/r/ClaudeCode/comments/1wsqfzk/comment/pcnxwy4/)（2026-10-28 核读，用户自报，未复跑）。

## 何时不适用

- **任务难以核验、错误代价高**：保留强能力与必要的人工／专业检查，不拿轻量输出代替验收。
- **模型在当前入口不可用，或数据不能走该服务**：沿用合规可用的配置，不为照抄表格换账户或购买套餐。
