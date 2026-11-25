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

第三方客户端另做一次[真实工具入口检查](#第三方入口排障聊天可用但工具任务失败)。

**按原标准接收，再决定是否沿用配置。** 看实际 diff 是否完成目标并保留约束，运行相关检查；修 bug 要重放触发路径。检查缺依赖且当前不允许安装时，列明未跑项，保留验收缺口；不能据此判为模型能力不足，`taskDone` 或审查标签也不能替代实际结果。比较漏项、纠正轮次和等待，把主 Agent、子 Agent、重试、检查与返工的投入一起算。

**依据**：[官方配置] [Codex 单次覆盖](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)、[Claude CLI 参数](https://code.claude.com/docs/en/cli-reference)、[Claude 型号与版本要求](https://code.claude.com/docs/en/model-config#model-aliases)；原核实 2026-10-26，Haiku 版本要求补核 2026-10-28。本地帮助核验针对旧入口；6.2 命令以现行官方文档为据，未启动模型任务。

**读者反馈**：[jrnl 配置修复](../collaboration/local-jobs/A-MODEL-EFFORT-READER-20261029.md)：读者沿用表外后端、effort 未知；返工的本机真实 CLI／官方测试仍缺，未完整验收。记录核读 2026-11-01，不新增模型优劣结论或修订页照做验收。

### 确认速度后再开始任务

**先读当前速度，不盲输切换命令。** Codex CLI 会保存速度选择，单次 `--model` 覆盖不保证回到 Standard。在 CLI 输入 `/` 查看当前模型可用命令，核界面显示的活动速度；CLI 0.170.0 可在 `/statusline` 启用 `model-with-reasoning`，在页脚同时看模型、推理档与 `fast`／`ultrafast`。速度标签依赖当前模型目录；没显示标签不等于 Standard。若明确处于 Fast，重复 `/fast`；若明确处于 Ultrafast，重复 `/ultrafast`，再确认已回到 Standard。已是 Standard 就不切换，无法确认则先查清，不把“未写速度参数”当作 Standard。速度选择会保存，不属于上面仅本次生效的模型参数。

**页脚只核所选速度，不证明服务端实际处理档或扣费。** 做速度对照时，另记到验收的耗时和可归因用量；实际处理档没有回执就记未知。直连 Responses API 则看响应返回的 `service_tier`，请求值与返回值可以不同，不把 API 规则套到 Codex 订阅。

**依据**：[官方 CLI 速度控制](https://learn.chatgpt.com/docs/agent-configuration/speed#codex-cli-controls)、[CLI 0.170.0 页脚实现](https://github.com/openai/codex/blob/rust-v0.170.0/codex-rs/tui/src/chatwidget/status_surfaces.rs#L726-L730)及[快照测试](https://github.com/openai/codex/blob/rust-v0.170.0/codex-rs/tui/src/chatwidget/tests/status_and_layout.rs#L4509-L4576)（2026-11-19）；[CLI 0.171.0 完成事件](https://github.com/openai/codex/blob/rust-v0.171.0/codex-rs/codex-api/src/sse/responses.rs#L519-L540)、[Responses 返回字段](https://developers.openai.com/api/reference/resources/responses/methods/create)（2026-11-23 核读）。未实跑速度对照。

## 按任务分配，而不是全员一起升档

| 眼前的工作 | Codex 起点 | Claude Code 起点 | 保留这项选择的条件 |
|---|---|---|---|
| 范围清楚的功能、测试与日常协调 | GPT-6.2 Sol＋客户端选定的 effort（可用时） | Sonnet 5.5＋`medium` | 能按现有要求交付，检查与返工可接受 |
| 跨文件审查、追调用链、查边界遗漏 | 同模型试 `high` | 同模型试 `high` | 找到更多可核实的问题或补足关键验证；协调器无需跟着升档 |
| 架构取舍、跨模块疑难 bug、复杂重构 | GPT-6.2 Astra＋客户端选定的 effort（可用时）；试旧 GPT-6 Astra 才从 Light（`low`）起步 | Opus 5.5＋`medium`；重验证可试 `high` | 有明确的推理或质量需要，可以直接选，不必先用轻量模型失败一次 |
| 明确的检索、提取、按既有模式批量小改 | Luna＋`high` | Haiku 5.5＋`medium` | 输出容易核对；发现遗漏或返工抵消节省就恢复原配置 |

**先补缺上下文和有效检查，再判断能力缺口。** 子 Agent 也按任务难度选：探索未知根因、解决矛盾证据，不能仅因它是“子任务”就降档。在读取本地配置的 Codex 中，普通新子 Agent 以父级本轮的模型和 effort 为起点；调用没指定的项先查 `[agents]` 默认值，自定义角色的显式设置还能覆盖。调用或 `[agents]` 选了型号、两处都没设 effort 时，用该型号的默认档。给轻量任务单独分档时，同时指定 `gpt-6-luna` 与 `high`，不要只换型号。需要额外角色时用[原生委派](../08-multi-agent.md#6-操作手册从一个大任务到并行执行)，已有单 Agent 能完成的工作保持原样。

GPT-6.2 Astra 和 Sol 都先核客户端实际选定的 effort；用 CLI `/model` 核对完整型号与档位，不把旧 Astra 的 Light 或另一个客户端的默认值套进来。Luna 的 `high` 也是该型号的起步建议；同名 effort 不代表同等投入。

**依据**：[官方任务定位与档位] [OpenAI Models](https://learn.chatgpt.com/docs/models#pick-a-reasoning-effort)、[子 Agent 模型选择](https://learn.chatgpt.com/docs/agent-configuration/subagents#choosing-models-and-reasoning)、[0.170.0 子线程配置实现](https://github.com/openai/codex/blob/rust-v0.170.0/codex-rs/core/src/agent/child_config.rs#L222-L278)、[Claude effort](https://code.claude.com/docs/en/model-config#choose-an-effort-level)；[既有判断](../02-models-and-cost.md#1-从默认起步按缺口调整)，原核实 2026-10-22；官方入口重核 2026-10-26。GPT-6.2 与旧 Astra 的起步区别按官方模型指南复核于 2026-11-21；子 Agent 官方指南、固定源码和内置目录补核 2026-11-20。未跑 Work 或子线程模型。

## 先委派哪种小任务，何时收回

**轻量模型先试输入固定、做法明确、结果能逐项核对的执行单元，负责人保留取舍与接收。** 下面两类已有本仓接收记录：

| 可以先交出去 | 派发时写清 | 负责人怎样接收 |
|---|---|---|
| 按现成命令提取固定提交的 CI 状态 | 完整 SHA、三个来源（commit statuses／check-runs／workflow runs）和只读入口；保留 `query_scope`、计数、原状态与 `description`；原响应留到接收 | 对照原响应和实际投影，核对“成功但跳过审核”、零记录、`action_required`；收数据，不让执行者代定能否合入 |
| 有明确输入契约的小修复与回归 | 独占实现／测试文件，给失败输入、必须保留的合法输入与检查命令 | 从真实 CLI 重放非法与合法输入，再跑定向回归；本仓 JSON 语法修复由负责人重放 25 项 CLI 输入与 9 项回归后接收 |

**数据正确但指定文件没改，就只接收数据，把剩余工作改成定点编辑。** CI 任务已有反例：交付补项连续两轮重新取数，却仍未补必需字段。遇到这种重复，先停止旧任务并确认写者已停，再复用保留结果修订；补齐输入后仍反复误解契约，才提高对应角色投入。要增加委派时，把子 Agent 的[等待、缓存和摘要开销](../02-models-and-cost.md#缓存与总成本)计入整题，不套用别人的成本倍率。

**依据**：[本仓真实委派与接收] [CI 结果与盲读卡点](../collaboration/local-jobs/A-CI-PROJECTION-READER-20261027.md)、[停止重复修订的记录](../collaboration/local-jobs/A-CI-EXACT-SHA-READER-20261028.md)、[JSON 修复接收](../collaboration/local-jobs/A-JSON-SYNTAX-READER-001.md)；核读 2026-10-28。Memos 状态与跳过说明已正确区分，JSON 修复已重放接收；Datasette 数据已复核，盲读验收未通过。记录支持任务划分与接收方式，尚无模型档位、总耗时与返工成本的同题比较。

## Cloudflare 实际怎么配：审查升档，协调不跟涨

**按角色比较新增可核发现和返工，不按整条链统一加档。** [模型与成本](../02-models-and-cost.md#换模型与升-effort先过行为门再比较新增质量)保留 Cloudflare 的生产对照、采用指标和安全／性能反例。

## 成本高时，先改哪一项

**先查自己实际使用的计费入口，再按上面的任务分档调整。**

| 你用的入口 | 现在看哪里 | 怎样读数字 |
|---|---|---|
| Codex 的 ChatGPT 订阅 | CLI `/status` 或用量面板 | 看剩余额度与重置时间；credits 单价不能直接换算订阅能用几天 |
| Claude Code 的 Pro／Max／Ultra 订阅 | `/usage` 的套餐用量条 | Session 美元数是按 token 估算的 API 成本；订阅支出看套餐与实际额外用量 |
| API key 或已开启的额外 credits | 对应服务的账单／用量入口 | 核实际模型、缓存、输出和速度档；API 与 credits 分开计。Codex credits 没有独立缓存写入费，API 按 API 价表 |

**依据**：[官方计费与查看入口] [OpenAI Work／Codex](https://learn.chatgpt.com/docs/pricing)、[Claude Code `/usage`](https://code.claude.com/docs/en/costs#using-the-usage-command)；查看入口核读 2026-10-28，套餐名称按 [02](../02-models-and-cost.md#3-订阅额度与成本控制)补核 2026-10-31；未读取账户用量。

- **重复读长材料、重复派同一调查**：先收窄输入与分工；长会话中途只换 effort 时，核对[保缓存入口](../02-models-and-cost.md#同模型换推理档保留缓存前缀)。
- **换成 6.2 后，自建 Responses 的缓存读突然下降**：先用相同内容对照 [`instructions` 与头部 `developer` 消息](../02-models-and-cost.md#gpt-62-responses-cache-compare)；现成 OpenCode 先核版本，别先改模型或缩短任务。
- **质量已达标，只是等得太久**：再比较提速选项；模型、effort、速度模式分开选择。

## 换模型：先用自己的任务比

**从 6.1 Sol 换到 6.2 Sol，先重跑一个与你想改善的工作同类、已经验收的任务。** 固定客户端版本、起始提交、提示、推理档、速度档和可用工具；同题只换模型。两次争用同一个本机资源时交错跑。先判交付过不过，再比从启动到验收的时间和实际用量；成本回算与实际扣费分开记，拿不到实扣就写未知。

| 想改善什么 | 固定的验收 | 什么情况不换 |
|---|---|---|
| 修复或实现 | 修复前先触发同一条回归，再用它验两份补丁。已解决的问题用[隔离 Git 历史的副本](../22-agent-evaluation.md#4-一次可复查的运行)，不用共享对象的 worktree | 旧版能通过的关键回归，新版没过 |
| 读代码或解释行为 | 先从固定代码写下必答事实：真实调用入口、触发条件、例外与回退；只给两边同一问题，不给答案 | 新版漏掉会改变决定的事实 |
| 审查代码 | 同一批已复核的真实 PR，逐项记重要问题新增／漏掉、人工复核分钟和完整成本；核对意见的触发条件、后果与代码依据 | 新增有效发现抵不过漏检或核查负担，不拿评论总量抵消 |

**每个配置记一行**：`模型 / effort / 速度档 | 首次验收 | 最终验收 | 总耗时 | 重试及原因 | 费用或用量（来源）`。失败和重试留在总账。6.1／6.2 的一次五工单真实回放中，首次都过 3/5；是否计入一单重复跑全套测试，费用比较方向相反。代码审查也一样：一次 42 PR 的管线回放里可执行评论从 187 增到 290，已知问题命中只从 58 增到 60。它们提醒你记重试与人工负担，不给你的仓库定默认。

<a id="effort-tool-time"></a>

**只升 effort 时，别把整段变慢算给测试。** 比较总耗时与工具起止区间的并集；并发工具的重叠时间只算一次，剩余时间也不直接标成模型推理。具体反例和原始材料见[换版证据](../research/gpt-62-switch-evidence.md#工具区间复算)。

**从 Codex 迁到直连 API／自建 Agent 时，另外验阻塞能否如实报告。** 在隔离副本中故意缺一个必需输入，或令一个必需工具不可用，再重跑同一任务。能完成的部分照做，交付要写明哪项没验证、观察到的阻碍和继续条件；用原工具记录对照，不把「已完成」当证据。OpenAI 的 [GPT-6.2 系统卡：Blocker Deception](https://deploymentsafety.openai.com/gpt-6-2-astra-sol/blocker-deception)在人为阻断的编码题上发现，Codex 的开发者提示能减少 Astra／Sol 漏报已知阻碍；直连 API 不会自动带上该评测所用的 Codex 开发者提示。这不是线上漏报率，也不是本仓模型实测。提示可以短，不删交付边界；只迁模型时固定宿主，迁宿主时单独复测这条行为。

**依据**：[同题实测、公开评测和审查回放](../research/gpt-62-switch-evidence.md)。具体任务选对应分项；不按排行榜名次替换已经达标的配置。

## 第三方入口排障：聊天可用但工具任务失败

用同一个入口分别试普通回复和一项已知可用的工具任务，再核实际模型与可用推理档。连第一项工具任务都没发给模型，先查客户端版本、路由与配置，不把这次失败计入模型质量比较。

OpenClaw 2026.11.6 的两份实际报告：已有聊天可回复，但 system-agent 单独拒绝 Codex 路由；原生入口只覆写 `contextTokens` 后，Gateway 的 `models.list` 只列 `off/ultra`，同样设置在 6.1 Sol 上未降档。依据：[管理路由原报](https://github.com/openclaw/openclaw/issues/203019)、[档位原报与检查命令](https://github.com/openclaw/openclaw/issues/203150)、[后续目录变更](https://github.com/openclaw/openclaw/pull/200766)。2026-11-22 核对原报与 2026.11.6 发行包的静态模型声明，未复跑带认证的 Gateway。

## 何时不适用

- **任务难以核验、错误代价高**：保留强能力与必要的人工／专业检查，不拿轻量输出代替验收。
- **模型在当前入口不可用，或数据不能走该服务**：沿用合规可用的配置，不为照抄表格换账户或购买套餐。
