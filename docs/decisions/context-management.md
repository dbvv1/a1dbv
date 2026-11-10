# 上下文怎么管，会话越聊越笨怎么办

**🟡 同一编码任务正常推进，沿用工具的自动压缩；新任务或纠正后仍反复回到旧方案，保存短检查点再开新会话。** 给 Agent 目标、必须保留的行为和文件／失败测试入口，让它按需找原文，不先贴整仓或安装记忆服务。

这条选择以 Anthropic 长任务团队实践、Claude Code 会话指导和 Cursor 按需取回为主：压缩还是重开应随任务和模型效果调整，不设固定轮数或百分比阈值。依据：[Anthropic 团队实作](https://www.anthropic.com/research/harness-design-long-running-apps)、[Claude 会话引导](https://code.claude.com/docs/en/best-practices#steer-the-session)（核实 2026-10-28）、[Cursor 按需取回](https://cursor.com/blog/improved-token-efficiency)（核实 2026-10-26）。

## 起手：给当前任务，不贴全部历史

```text
在 [项目] 完成 [功能或修复]，保留 [现有行为与禁改范围]。
入口是 [文件／符号／issue]；复现输入与失败结果是 [具体内容]。
先读项目指令，再沿调用和相关测试找必要上下文；缺信息才扩大搜索。
已有补丁先核当前 diff 和已返回结果，只接剩余工作。
按项目检查和真实使用路径验收，交回改动、依据与已验／未验项。
```

## 按症状选路

| 现在遇到什么 | 先做什么 |
|---|---|
| 同题正常推进，只是历史变长 | 保持自动压缩；必要时保存检查点再手动压缩 |
| 漏约定、引用旧文件或反复全量重读 | 重读权威文件，明确哪条旧要求已被替换；只给下一步所需日志和文件入口 |
| 无关新任务，或同一错误两次纠正仍复发 | 保存检查点，用新目标和排除理由开新会话，不用 resume 假装清空 |
| 编码途中只想问一句、不改要求 | 用[原生侧问](#侧问不改变主任务)，需要修改仍回主会话 |
| 压缩报错、断流，无法确认操作是否完成 | 保留工作区和会话，先查 diff、产物及在途结果，再接剩余步骤 |
| 自建 Chat Completions Agent 调工具后丢历史 | 核[状态策略](#agents-chat-history)，不要先调压缩阈值 |

## 同题继续：压缩、新开和恢复分开用

下面输入在 **CLI 会话内**，不是 shell；其他客户端以自身 `/` 菜单为准。

| 目的 | Claude Code | Codex CLI |
|---|---|---|
| 看上下文 | `/context` 看分类和加载来源 | `/status` 看上下文／token 信息 |
| 同题腾空间 | `/compact 保留目标、最新约束、撤回要求、失败测试、排除理由和下一步` | 先写下节检查点，再 `/compact` |
| 开干净会话 | `/clear` | `/new`；`/clear` 也开新聊天并清终端显示 |
| 回旧会话 | `/resume` | `/resume`，或 shell 的 `codex resume` |

新会话不会自动撤销工作区改动；resume 和 fork 带旧历史，不能用来丢掉旧假设。Codex `/recap` 只回顾摘要。全仓迁移、系统审查仍须覆盖任务范围，不把少读文件当目标。

默认自动压缩够用就不调。确曾手改时，Claude Code 支持的版本可用 `/autocompact auto` 恢复自动设置（v2.1.221 起，会保存设置），先核环境变量等覆盖来源；Codex 撤回随意添加的 `model_auto_compact_token_limit`，`model_context_window` 应与实际服务能力一致。

依据：[Claude 命令](https://code.claude.com/docs/en/commands)与[压缩配置](https://code.claude.com/docs/en/model-config#set-the-auto-compact-window)、[Codex 命令](https://learn.chatgpt.com/docs/developer-commands)与[配置](https://learn.chatgpt.com/docs/config-file/config-reference)，核实 2026-10-26。

<a id="跨压缩或新会话检查点保留下一步用得上的内容"></a>

## 跨压缩或新会话：保留下一步需要的事实

复用现有任务记录，短任务直接留消息；不保存密钥和私人对话全文。

```text
请更新检查点，供下一次继续：
1. 当前目标、完成条件、最新约束、取消或被取代的要求。
2. 仓库、分支、基线 commit；未提交修改及位置。
3. 关键事实、决定及排除旧方案的理由；可重读的文件／符号／结果入口。
4. 已运行命令、结果与适用版本；失败、未运行分别列明。
5. 在途任务／外部操作的 ID 和状态；未知结果标待查询。
6. 下一步具体动作，以及尚缺输入或授权。
```

恢复时让 Agent **实际读取检查点和项目指令，先核最新约束与撤回项，再核 Git 状态、diff、产物和在途结果**。成功标准是限制仍遵守、下一步能定位证据、不重复已完成或结果未知的写入。指定页面版本的任务还须固定提交并核实际收到的正文，不能用工作树同名文件代替。

路径出现在摘要里，不代表内容已经恢复。Claude 最多重读本会话读过或改过的 5 个文件，最近修改优先，超过 5,000 token 的文件只返回引用路径；普通 `@文件` 受 Read 限额约束。Codex `@` 主要给路径，仍要明确要求读取。不要等自动重读覆盖所有关键文件。

摘要中的“用户批准”也需要真实用户来源；外部材料经过摘要不会获得新权限。已有真实批准不因压缩自动失效。

依据：[Codex 固定压缩提示](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/prompts/templates/compact/prompt.md)、[Codex 文件入口](https://learn.chatgpt.com/docs/developer-commands#interactive-shortcuts)（核实 2026-10-26）；[Claude 引用](https://code.claude.com/docs/en/common-workflows#reference-files-and-directories)与[压缩重读范围](https://code.claude.com/docs/en/context-window#what-survives-compaction)（复核 2026-11-04）；[授权来源](../03-context-engineering.md#压缩后保留授权来源)。

<a id="编码途中想问一句先选侧问改变要求仍回主线"></a>

## 侧问不改变主任务

| 目的 | 入口及边界 |
|---|---|
| 解释 Claude 已读代码或刚才的决定 | `/btw 为什么保留旧接口？` 只用已有上下文，无工具；本地回答浮层按 `f` 可转为带工具的后台子代理 |
| Cursor 中另查做法并连续追问 | 本地 Agent `/side 只调查替代方案，不修改文件，给出依据与适用条件`；`/btw` 是别名，在主线用 `@` 引入侧聊后明确采用的结论 |
| 撤回要求、改方向或制止错误修改 | 直接纠正执行中的主会话，必要时停止；侧问不是修改主任务的入口 |

Cursor 侧聊有父背景，不是摆脱旧假设的干净会话，也不是只读权限隔离；目前不支持 Cloud Agents。云端沿用可用主会话或独立调查入口。

依据：[Claude 侧问](https://code.claude.com/docs/en/interactive-mode#side-questions-with-btw)、[Cursor 侧聊](https://cursor.com/help/ai-features/side-chats)、[原生入口](https://cursor.com/changelog/side-chat)，核读 2026-11-09。

<a id="agents-chat-history"></a>

## 自建 Agent：先选对历史管理方式

**🧪 使用 `OpenAIChatCompletionsModel` 且应用已持有完整历史时，去掉 `conversation_id`、`previous_response_id`，保持 `auto_previous_response_id=False`；下一轮回传 `result.to_input_list()` 加新用户消息。** 不要同时再接自动保存历史的 `session`。

```python
from agents import Runner

result = await Runner.run(agent, "第一条用户消息")
next_input = result.to_input_list() + [
  {"role": "user", "content": "接着上一轮继续"}
]
result = await Runner.run(agent, next_input)
```

不要只传 `final_output` 或工具结果；历史必须保留用户、带 `tool_calls` 的 assistant 和匹配 `tool_call_id` 的 tool 消息。流式运行先消费完 `result.stream_events()`，再取历史。检查实际发出的请求，而不只看最终回复。

**适配器忽略服务端参数，不代表 Runner 没裁历史。** 在 SDK `1fc77bbc`，三个设置均可让第二次 Chat 请求只剩工具消息；`strict_feature_validation=True` 能挡两个显式 ID，却不能可靠挡 `auto_previous_response_id`。去掉这些设置是避开该组合，不是 SDK 修复。需要服务端续接时走支持它的 Responses API，按契约传增量，不再叠加完整历史；只在服务端的旧历史也不会自动回到本地。

依据：[OpenAI Agents SDK 官方状态策略](https://github.com/openai/openai-agents-python/blob/1fc77bbc8ac1446690f6ba62dd0d52779bdcf43f/docs/running_agents.md#choose-a-memory-strategy)、[实际故障 #5454](https://github.com/openai/openai-agents-python/issues/5454)、[参数校验源码](https://github.com/openai/openai-agents-python/blob/1fc77bbc8ac1446690f6ba62dd0d52779bdcf43f/src/agents/models/openai_chatcompletions.py#L543-L574)，核实 2026-11-09。

---

[验证范围与个例](../research/2026-11-10-context-case-evidence.md)：本页 🟡；SDK／Git 离线结果不等于当前页原生压缩与新会话推荐已实测，旧读者回执不验收新版；侧问未试用。继续阅读：[常驻指令](instruction-files.md) · [长任务](long-tasks.md)。
