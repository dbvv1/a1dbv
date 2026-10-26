> 新稿写作比较素材；SDK 未运行。计数范围与使用方法见[说明](README.md)。

### 3.3 Claude Agent SDK：续接任务看累计

**✅ 比较完整任务投入：先核实际 Claude Code CLI 版本，独立调用加总；CLI 2.1.277 起，正常退出并保存的会话在 `resume`／fork 后取最新累计；清空会话按段相加。** 全树费用取客户端估算 `total_cost_usd`（含子 Agent），全树 token 取 `modelUsage`（Python：`model_usage`）；`usage` 只含当前轮主流程。

| 调用方式 | 取数与迁移动作 |
|---|---|
| 独立 `query()`，未用 `resume`／`continue` | 加各调用最终总计；单调用多轮先按下列累计／重置规则收口 |
| streaming input，多轮未清空会话 | `total_cost_usd`／`modelUsage` 是运行累计，只取最新 `result` |
| 正常退出后 `resume` 或 fork 已保存的会话 | **CLI 2.1.277 起恢复旧累计**，取最新结果；多个 fork 合计时共同历史只计一次。此前 headless／SDK 恢复从零累计，升级时把旧的跨调用求和改为取最新累计 |
| `/clear`、`/reset` 或 `/new` | 累计归零；封存每次重置前最后总计，再加末段。重置命令自己的 `result` 已属新段 |

**Python 长连接按重置事件封存上一段。** 0.2.137 起接收 `ConversationResetMessage`，旧版本跟踪应用发出的清空命令。事件的 `session_id` 属于旧会话；新会话 ID 读后续消息，不能用 `new_conversation_id` 替代。核 CLI 时以实际启动文件为准：本次固定源码的 Python SDK 0.2.174 捆绑 CLI 2.1.310，`cli_path` 可覆盖它。

**何时不适用：** 只求续接／某个 fork 的新增投入时，扣除已确认的恢复起点；起点未知就标未知，保留缺口。崩溃可能未保存累计，末个错误结果还可能清零：保留此前有效读数，按官方恢复流程处理，缺数留待核实。要按角色分账时另核计量方案：同模型的主／子 Agent 合并在一个模型项，`TaskUsage.total_tokens` 尚无角色费用替代依据；仍按任务选模型，不为遥测换模型。这些估算用于开发比较，账单与订阅额度另查服务商。

**依据**：[一手：官方契约] [跨调用累计](https://code.claude.com/docs/en/agent-sdk/cost-tracking#accumulate-costs-across-multiple-calls)、[streaming input](https://code.claude.com/docs/en/agent-sdk/cost-tracking#track-costs-in-streaming-input-mode)、[总计与全树范围](https://code.claude.com/docs/en/agent-sdk/cost-tracking#get-the-total-cost-of-a-query)、[CLI 2.1.277 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.277)；[一手：固定源码／社区：使用者反馈] Python 类型与解析器、TypeScript #293 见[素材来源](README.md#素材来源)。核实 2026-10-26；本仓只核公开文档与源码，未运行 SDK 或模型，也未采集账户用量。
