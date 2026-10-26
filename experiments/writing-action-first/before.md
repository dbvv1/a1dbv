> 旧稿写作比较素材；SDK 未运行。计数范围与使用方法见[说明](README.md)。

### 3.3 Claude Agent SDK：续接任务看累计

**✅ 比较完整任务投入时，先核实际启动的 Claude Code CLI 版本，再判断哪些结果可以相加。** `total_cost_usd` 是含子 Agent 的客户端费用估算；全树 token 看 `modelUsage`（Python：`model_usage`），不要拿只覆盖主流程的 `usage` 代替。它们用于开发比较，不是账单或订阅额度。

| 调用方式 | 正确取数 |
|---|---|
| 独立 `query()`，未用 `resume`／`continue` | 各调用没有继承旧累计，可以将各自最终总计相加；一次调用有多轮时先按下面两行收口 |
| streaming input，多轮但没有清空会话 | `total_cost_usd`／`modelUsage` 是运行累计，只取最新 `result`，不逐轮相加；`usage` 只含当前轮的主流程 |
| `/clear`、`/reset` 或 `/new` | 累计归零；保存每次重置前的最后总计，再加最后一段的总计。重置命令自己的 `result` 已属于新段 |
| 正常退出后 `resume` 或 fork 已保存的会话 | **CLI 2.1.277 起会恢复旧累计**，最新结果已经含之前投入，不再加旧结果。多个 fork 合计时共同的旧累计也只能算一次 |

**升级后检查原来的求和逻辑，而不只是改包版本。** CLI 2.1.277 以前，headless／SDK 恢复会话时从零累计；沿用当时“每次调用相加”的写法会重复计算。只比较续接或某个 fork 的新增投入时，应扣除已确认的恢复起点；起点不明就保留未知，不把继承投入算成本次新增。崩溃退出不保证保存，末个错误结果还可能清零，须保留之前有效读数并按官方恢复流程处理。

**Python 长连接从 0.2.137 起可接收 `ConversationResetMessage`，据此封存上一段；更旧版本须跟踪应用自己发送的清空命令。** 该事件的 `session_id` 属于刚结束的旧会话；新会话 ID 从后续消息读，不能拿 `new_conversation_id` 替代。核版本要看实际可执行文件：本次固定源码的 Python SDK 0.2.174 捆绑 CLI 2.1.310，但 `cli_path` 可覆盖它，SDK 包版本本身不能保证用了哪套累计规则。

**按模型汇总不等于按角色分账。** 主流程与多个子 Agent 共用模型时会落在同一模型项；保留按任务需要选模型的做法，不为拆出遥测而给每个角色换模型。`TaskUsage.total_tokens` 也不是已确认的角色费用替代物。

**依据**：[一手：官方契约] [跨调用累计](https://code.claude.com/docs/en/agent-sdk/cost-tracking#accumulate-costs-across-multiple-calls)、[streaming input](https://code.claude.com/docs/en/agent-sdk/cost-tracking#track-costs-in-streaming-input-mode)、[总计与全树范围](https://code.claude.com/docs/en/agent-sdk/cost-tracking#get-the-total-cost-of-a-query)、[CLI 2.1.277 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.277)；[一手：固定源码／社区：使用者反馈] Python 类型与解析器、TypeScript #293 见[素材来源](README.md#素材来源)。核实 2026-10-26；本仓只核公开文档与源码，未运行 SDK 或模型，也未采集账户用量。
