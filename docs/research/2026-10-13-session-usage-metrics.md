# 会话用量与速度：ccusage 能诊断什么

> 核实时间：2026-10-13。🧪 试用历史消耗归因；👀 评估整轮吞吐视图，不推荐为纯生成 tok/s 工具。
> 固定公开源码：ccusage [`06581604`](https://github.com/ccusage/ccusage/tree/06581604247a48118ba071e0dd96e7e84756652e)；Codex [`f82e3659`](https://github.com/openai/codex/tree/f82e36592278a0a782fb0d0fc97e5fa10e832ac2)。以下是源码和上游测试阅读，不是本仓运行结果，不保证旧客户端或所有日志包含新字段。**[一手]**

## 改变采用建议的证据

当前 [`session --id`](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/docs/guide/session-reports.md) 可接受完整 UUID、sessionId、文件名和 thread URI，足以先提供手动选定会话的消耗明细。[report.rs](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/report.rs#L54-L132) 只给分项 token、成本、lastActivity 等字段；[speed.rs](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/speed.rs) 选择计价策略，不测量生成速度。**[一手]**

| 已有数据 | 合适的指标 | 不能推出 |
|---|---|---|
| ccusage session JSON | 会话／模型消耗分项、API 等价成本估算 | 订阅剩余额度、纯生成 tok/s |
| 两次同口径快照及采样时间 | 窗口记账增长率，如 ΔoutputTokens/Δ秒 | 模型解码速率；中间可能包含等待或延迟落盘 |
| 完整 TokenUsageRecord + 正常 TurnComplete | 按轮平均输出 tok/s、TTFT | 每次模型调用或可见正文的生成速率 |
| token_count 最早／最晚 timestamp | 有用量事件覆盖的墙钟跨度 | 会话起止、有效生成时长 |

第一行是源码字段，其余是计量推导；不把能相除的数字自动称为模型性能。**[一手；经验]**

额度诊断仍先用原生状态或服务商。Codex [protocol](https://github.com/openai/codex/blob/f82e36592278a0a782fb0d0fc97e5fa10e832ac2/codex-rs/protocol/src/protocol.rs#L2465-L2532) 的 rate_limits 可带 used_percent、窗口与重置时间，但它是带时间的服务端快照，不是某会话 token 到订阅额度的兑换公式；ccusage 当前报告不解析该字段。**[一手；经验：采用边界]**

## 时间字段确实可以落盘，但不是解码计时

Codex [tasks/mod.rs](https://github.com/openai/codex/blob/f82e36592278a0a782fb0d0fc97e5fa10e832ac2/codex-rs/core/src/tasks/mod.rs#L288-L313) 在 start_task 阶段记录 Instant，结束任务时[计算 duration_ms 并发终态事件](https://github.com/openai/codex/blob/f82e36592278a0a782fb0d0fc97e5fa10e832ac2/codex-rs/core/src/tasks/mod.rs#L808-L868)。正常结束产生 TurnComplete，abort 分支产生 TurnAborted；TurnComplete 也可能有 error。它测任务生命周期，不是每次请求的解码时间。**[一手]**

[turn_timing.rs](https://github.com/openai/codex/blob/f82e36592278a0a782fb0d0fc97e5fa10e832ac2/codex-rs/core/src/turn_timing.rs#L388-L447) 的 TTFT 从轮开始算到首次满足条件的模型响应信号：文本／推理 delta，带非空文本／推理的 OutputItemAdded/Done，以及工具调用或压缩 item 都可触发。后者包括 LocalShellCall、FunctionCall、CustomToolCall、ToolSearchCall、WebSearchCall、ImageGenerationCall、Compaction、ContextCompaction。因此不是首个可见正文 token 的保证；单独的 ToolCallInputDelta 不触发，不意味着工具调用 item 也不触发。**[一手]**

[上游测试](https://github.com/openai/codex/blob/f82e36592278a0a782fb0d0fc97e5fa10e832ac2/codex-rs/core/src/turn_timing_tests.rs#L19-L217) 验证未开始、Created 不计，首个文本 delta 计且后续不重记；另明确断言 FunctionCall、CustomToolCall、非空 assistant message 可触发，空 message 和 FunctionCallOutput 不触发。压缩 item 的判断来自实现分支，不把它写成上述测试已覆盖。**[一手：源码与测试阅读，未本地执行]**

[rollout policy](https://github.com/openai/codex/blob/f82e36592278a0a782fb0d0fc97e5fa10e832ac2/codex-rs/rollout/src/policy.rs#L22-L226) 在 Legacy／Paginated 模式均保留 TurnStarted、TurnComplete、TurnAborted、TokenCount 和 TokenUsageRecord；RawResponseCompleted、文本／推理 delta 则为 transient，不常规落盘。因此不是“只有 app-server 才有时间字段”，也不能从常规日志恢复丢弃的输出时间序列。时间字段为 optional，旧日志不保证存在。**[一手]**

上游[用量落盘测试](https://github.com/openai/codex/blob/f82e36592278a0a782fb0d0fc97e5fa10e832ac2/codex-rs/core/tests/suite/token_usage_rollout.rs) 用合成 SSE 验证一轮两次 response 为 120+80，resume 后下一轮为 30；逐记录的 (turn total, thread total) 为 (120,120)、(200,200)、(30,230)，缺 usage 的完成不产生新用量记录。这支持按 turn_id 关联，也直接反驳“一轮就是一次请求”。**[一手：测试阅读]**

如果后续做整轮小视图，按 response_id 去重，再按 turn_id 汇总 `usage.output_tokens`，除以有效 `duration_ms/1000`；不能把每条累计 `turn_token_usage` 相加，也不能再叠加 token_count。仅正常完成、无 error、时长大于零、用量完整时显示；abort、缺终态、缺 usage 或字段缺失显示不可计算。`duration−TTFT` 仍包含工具和再次采样，不当纯解码分母；并行子会话的时长之和不当父会话墙钟。**[经验：由字段与测试推导的显示规则，尚未实现]**

## 用量分项与两条修复链

当前 [parser](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/parser.rs#L489-L580) 优先取累计快照变化时的 last_token_usage，否则对 total_token_usage 做逐字段饱和差分；[loader 回归](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/loader.rs#L2243-L2288) 防止累计未变却重复记录 last_usage。下降截零不等于能恢复任意累计重置。**[一手]**

报告 inputTokens 已扣除 cache read/write；缓存读取占比分母应包含三种输入。reasoning 是 output 子集，不应再加一次；[类型实现](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/types.rs) 对缺失／零 total 以 input+output 补出，非零已记录 total 则保留。**[一手；经验：比率解释]**

| 真实问题 | 修复 | 当前回归依据 |
|---|---|---|
| [#988](https://github.com/ccusage/ccusage/issues/988)：18.0.11 分叉历史重复计数个案 | [#1156](https://github.com/ccusage/ccusage/pull/1156)，2026-05-25 20:08 UTC 合并 `c95deda6`；Rust vector loader 用不含 session_id 的事件指纹及固定文件顺序 | [loader](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/loader.rs#L615-L688) 的父／分叉夹具只保留 1200 父用量及 850 分叉增量，覆盖串行／并行 |
| [#1617](https://github.com/ccusage/ccusage/issues/1617)：cache-write 漏算 | [#1663](https://github.com/ccusage/ccusage/pull/1663)，2026-08-29 21:26 UTC 合并 `15b3bef8`；补 parser、aggregate、replay、pricing、JSON/table | [loader](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/loader.rs#L942-L995) 累计 cache-write 差分、[parser](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/parser.rs#L1386-L1432) 重置／缓存系列归一化及 [lib.rs](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/lib.rs) 费用回归 |

问题为社区单例，修复与断言为一手证据，均未在本机重跑。它们支持定期校准解析／计价，不证明当前仍有同一 bug，也不证明模型变快。**[社区；一手；经验]**

## 验证与停止条件

已固定公开源码并交叉核对字段、emit、持久化策略与上游测试；未运行 ccusage 或 Rust 测试。环境没有 cargo/rustc/ccusage/nix/direnv，也没有现成构建产物；Node 包装测试不能验证 Rust 用量逻辑，故未以手写替代实现冒充实测。未安装、调用付费模型、读取私人日志或做账户对账。**[经验：本轮执行记录]**

下一步只在已有可运行环境及具体会话诊断需求出现时，以合成目录和隔离配置复跑上述回归，再决定是否增加整轮视图；本轮不建分析工具或自动窗口跟随。使用建议已回填[工具页](../practical-tools/usage-and-sessions.md)，无需为结论继续扩采数据。**[经验：采用判断]**
