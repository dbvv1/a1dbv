# A-CONTEXT-CHAT-STREAM-READER-20261114 · u1 读者记录

## 做到哪一步

任务卡第 1–4 条都实际执行完毕，产物在工作目录：

- 消费者与断言：`docs/collaboration/local-jobs/artifacts/A-CONTEXT-CHAT-STREAM-READER-20261114/consumer.py`
- 脱敏请求/输出：同目录 `captures/streaming.json`、`captures/nonstreaming.json`、`captures/summary.json`
- 复跑：同目录 `rerun.sh`
- 结果：同目录 `result.md`

实际结果：固定 SDK `64fbde5d02b42ae5f9db668eb0184cdb3fc9d775` 上，页面“完整本地历史 + 下一轮 `to_input_list()` 加新用户消息”的分支，在流式（`Runner.run_streamed`，完整消费 `stream_events()`）和非流式（`Runner.run`）两种模式下各发 3 个 Chat Completions 请求；第 2 轮请求保留了初始用户、带 `tool_calls` 的 assistant、匹配 `tool_call_id` 的 tool 消息、上一轮最终回答和新用户消息，各只出现一次；所有请求都没有 `previous_response_id`/`conversation_id`，也没有接 `session`。46 项请求级断言全部通过；SDK 相关测试 434 项通过。流式 `last_response_id` 为 `__fake_id__`，非流式为 `None`，消费者没有使用该值。

开始时确认工作目录里没有本任务的 artifact 目录，也没有 `reader-tests/A-CONTEXT-CHAT-STREAM-READER-20261114-u1.md`；本角色是第一次读本页，没有读作者实验、其他读者答案或本任务已有结果，没有改页面。

## 卡点（按页面原句）

| 页面原句 | 缺什么 | 我怎么做 / 做错过什么 |
|---|---|---|
| “**🧪 使用 `OpenAIChatCompletionsModel` 且应用已持有完整历史时，去掉 `conversation_id`、`previous_response_id`，保持 `auto_previous_response_id=False`；下一轮回传 `result.to_input_list()` 加新用户消息。**” | 只有 `Runner.run` 两轮片段；没有流式 `Runner.run_streamed` 的写法，也没有 `OpenAIChatCompletionsModel` 的构造方式和 MockTransport 接线。 | 读固定提交的 `src/agents/models/openai_chatcompletions.py` 和安装包 API，用 `OpenAIChatCompletionsModel(model=..., openai_client=AsyncOpenAI(http_client=async_client))`；Mock 用 `httpx2.MockTransport`（本版本 `openai` 走 `httpx2` 而不是 `httpx`）。 |
| “流式运行先消费完 `result.stream_events()`，再取历史。” | 只说了顺序，没有流式示例，也没说提前取会怎样。 | 在 `async for event in result.stream_events()` 完全结束后才调用 `to_input_list()` 和读取 `final_output`/`last_response_id`。 |
| “不要只传 `final_output` 或工具结果；历史必须保留用户、带 `tool_calls` 的 assistant 和匹配 `tool_call_id` 的 tool 消息。” | 没有给出在 Mock 下捕获“实际发出的请求”的具体手段。 | 用 `httpx2.MockTransport` 的 handler 记录每个请求 body；断言针对请求消息而不是 `final_output`。第一次写断言时把“工具调用”检查误套到了第 1 个请求（它只是携带初始用户、还没有工具消息），导致 6 项误报；后来拆成“初始请求”和“工具结果请求”两组检查。 |
| “**适配器忽略服务端参数，不代表 Runner 没裁历史。** 在 SDK `1fc77bbc`，三个设置均可让第二次 Chat 请求只剩工具消息；`strict_feature_validation=True` 能挡两个显式 ID，却不能可靠挡 `auto_previous_response_id`。” | 页面绑定的是 `1fc77bbc`，任务固定 `64fbde5`；两者行为不一定相同，页面没说怎么在当前 SHA 复核。 | 读 `64fbde5` 源码：显式 ID 在适配器里默认警告后忽略，`strict_feature_validation=True` 会抛 `UserError`；`auto_previous_response_id` 仍在 Runner 层创建服务端会话跟踪器。没有预设旧 issue 一定存在，而是直接看源码并用请求断言确认本消费者路径无服务端字段。 |
| “**下一轮回传 `result.to_input_list()` 加新用户消息。**”/“不要同时再接自动保存历史的 `session`。” | 没有说 `session` 在哪里传，也没说 `to_input_list()` 里可能带内部字段。 | 完全不传 `session`；捕获实际请求确认 `provider_data.response_id`、`__fake_id__` 等内部字段没有进入 Chat Completions body。 |
| 页面没有提 tracing，也没有提 `last_response_id` 的流式占位值。 | 只接 MockTransport 时 trace exporter 仍可能去真实网络；`last_response_id` 的流式差异不在页面内。 | 用 `RunConfig(tracing_disabled=True)` 关闭 exporter；单独记录 `last_response_id`，发现流式为 `__fake_id__`、非流式为 `None`，消费者不使用该值。页外核对 issue #5451 与源码。 |

## 做错 / 走过的弯路（非页面错误）

1. **第 1 个请求误查工具调用。** 第一版断言把“应有 assistant `tool_calls`”也用在第 1 轮 #1；但该请求发出时模型还没返回工具调用。修正为：请求 #1 只查初始用户和消息顺序；请求 #2 才查 `tool_calls`/`tool_call_id`/工具值。
2. **`pip install -e .` 失败。** 在很长的临时目录里构建 editable wheel 时 `shutil.copy2` 报 `WinError 3`。改用 `PYTHONPATH=<SDK>/src` 直接运行固定提交源码，并把这一替代写法写进 `rerun.sh`。
3. **依赖版本漂移。** 先用 PyPI 最新的 `openai 3.55.0` 跑 SDK 测试，4 个 span 参数化用例因 `input_tokens_details.cache_write_tokens_details` 期望值不同而失败；按该提交 `uv.lock` 固定 `openai 3.29.0`、`httpx2 2.14.0`、`pydantic 2.14.2` 后 186 项全过。最终捕获也用这组版本，避免把依赖差异当成通过或失败。
4. **`test_agent_runner_streamed.py` 起初无法收集。** 该测试直接 `import httpx`，与运行时的 `httpx2` 不是同一个包；安装公开依赖 `httpx 0.28.1` 后 210 项通过。

## 页面之外查了什么

- 原 issue [openai/openai-agents-python#5451](https://github.com/openai/openai-agents-python/issues/5451)：流式 Chat Completions 的 `response_id` 是 `__fake_id__`、非流式是 `None`，并会被误当作服务端 ID；与本地观察一致。
- 原 issue [#5454](https://github.com/openai/openai-agents-python/issues/5454)：设置 `conversation_id`/`previous_response_id`/`auto_previous_response_id` 时 Runner 的服务端会话跟踪器会让第二次请求只剩工具消息；用于理解页面“适配器忽略服务端参数，不代表 Runner 没裁历史”的含义。
- 固定提交 `64fbde5` 的源码：`src/agents/models/openai_chatcompletions.py`（非流式 `response_id=None`、流式 `Response(id=FAKE_RESPONSES_ID)`、服务端参数校验与警告）、`src/agents/models/chatcmpl_stream_handler.py`（终态 `model_copy()`）、`src/agents/result.py`（`to_input_list()`、`last_response_id`）、`src/agents/run.py` / `run_internal/oai_conversation.py`（服务端会话跟踪器）。
- 该提交的 `pyproject.toml` 与 `uv.lock`：确认 `openai 3.29.0`、`httpx2 2.14.0`、`pydantic 2.14.2` 是它锁定的版本，也确认运行时依赖清单。
- `openai 3.29.0` / `httpx2 2.14.0` 的公开 API：`AsyncOpenAI(http_client=...)`、`httpx2.MockTransport`、SSE 响应格式。没有查私有网关或凭据。

以上页外信息只用于搭运行环境和解释观察，没有替代页面步骤；页面给出的手动历史做法本身仍在 Mock 请求中逐条得到验证。

## 验证与产物入口

- 复跑：`docs/collaboration/local-jobs/artifacts/A-CONTEXT-CHAT-STREAM-READER-20261114/rerun.sh`（或按头部注释安装依赖后运行 `consumer.py --out-dir captures`）。
- 结果：同目录 `result.md`；逐项断言见 `captures/summary.json` 与 `captures/*.json`。
- 未验项：真实模型记忆/服务端接收、服务端会话组合与完整 replay 的混用、SQLiteSession 新推荐、Responses 压缩、原生客户端、SDK 全库测试、非 Windows/非 Python 3.13.5 环境。

## 核对

核对角色独立复跑，未采用读者日志直接判过。2026-11-18 核对结果：

- **页面与哈希**：任务卡内嵌 `page_text` 解码后 SHA-256 为 `b6b6c905b568f68e598831944d03cff251bffc1600734e55bf18e28fae6b873c`，5,361 字符 / 9,577 字节；工作区 `docs/decisions/context-management.md` 与它逐字相同，且相对 `4ac4f0f9` 无 diff。页面未被改。
- **消费者复跑**：用 codeload 取回的 `64fbde5d02b42ae5f9db668eb0184cdb3fc9d775` 源码（`src/`、`tests/`、`pyproject.toml`、`uv.lock` 与读者所用源码逐字一致）在 Python 3.13.5、openai 3.29.0、httpx2 2.14.0、pydantic 2.14.2 下重跑 `consumer.py`，退出码 0；两种模式各 3 个请求，共 46 项断言全过；`last_response_id` 流式为 `__fake_id__`、非流式为 `None`；`captures/*.json` 与读者产物逐字相同。
- **SDK 测试**：独立跑 `186 + 38 + 210 = 434 passed`，三次退出码均为 0，命令与 result.md 一致。
- **来源核对**：issue #5451 标题确认流式 `response_id` 为 `__fake_id__`、非流式为 `None`；#5454 标题确认服务端会话参数会丢历史；固定提交源码中的 `response_id=None`、`FAKE_RESPONSES_ID`、`to_input_list()`、`last_response_id` 与读者引用一致。
- 产物只在 `docs/collaboration/local-jobs/artifacts/A-CONTEXT-CHAT-STREAM-READER-20261114/` 与 `reader-tests/A-CONTEXT-CHAT-STREAM-READER-20261114-u1.md`，未发现本机绝对路径或内网地址；页面与 SDK 未改。

**结论：按本任务验收，读者确实做成。** 核心分支（`OpenAIChatCompletionsModel` + 不接 session/服务端 ID + `to_input_list()` + 新用户）在流式与非流式请求中可复现；未验项读者已列明。

### 卡点判断

| 卡点 | 判断 | 说明 |
|---|---|---|
| 缺 `run_streamed` 示例、模型构造、MockTransport 接线 | 页面（部分）+ 任务侧 | 页面只有 `Runner.run` 片段，流式示例是可补的页面缺口；模型/Mock 接线属任务环境，不应由该页承担。读者查固定提交源码补齐，正确。 |
| 流式取历史只有一句顺序 | 页面（小） | 无示例且未说明提前取历史的后果；页面顺序本身足以实现，读者按顺序做对。 |
| 结论绑定 `1fc77bbc`，任务固定 `64fbde5` | 页面（版本绑定） | 页面已明示证据提交，读者按任务 SHA 复核是对的；页面对 `auto_previous_response_id` 的旧结论不能直接移植，读者未预设旧 issue 仍在，处理正确。 |
| 无捕获实际请求的手段 | 读者（已自纠） | 捕获请求是任务侧测试手段，不是页面内容；首版把工具调用断言误套到第 1 个请求造成 6 项误报，拆成初始/工具结果两组后修正，属读者实现错误。 |
| `session` 未给入口 | 页面（小） | 页面只写禁令；读者完全不传并断言无服务端字段，正确。 |
| 未提 `last_response_id` 流式差异/tracing | 读者（任务侧） | 前者是任务卡要求，后者是 Mock 环境问题，均非本页应覆盖；读者从 #5451 和源码补出，且关闭 exporter，未把外查当页面步骤。 |

### 读者没意识到的错误

1. `consumer.py` 顶部注释仍写 “openai 3.55.0; httpx2 2.16.2”，与最终验证及 `result.md`/`rerun.sh` 锁定的 openai 3.29.0、httpx2 2.14.0 矛盾。按该注释装依赖可能重现读者自己记录过的 4 个 span 用例失败；读者未改这处。
2. `result.md` 第 7 行写“每轮实际发出 3 个 Chat Completions 请求”，实际是每种模式 3 个（第 1 轮 2 个、第 2 轮 1 个）；同句后半段已自行拆开，属未修正的表述错误。

（独立性声明无法从产物外证实；本次核对只验证了产物、源码和可复跑结果。）


### 负责人后续接收（2026-11-18）

上列两处首交错误已修正；Linux/Python 3.12.14 独立复跑的 46 项请求断言及 434 项相关测试通过，捕获与首交逐字相同。首次复跑的代理环境初始化失败及处理范围见[结果记录](../docs/collaboration/local-jobs/artifacts/A-CONTEXT-CHAT-STREAM-READER-20261114/result.md#负责人接收复核2026-11-18)。本次 `reviewed=true` 仅表示产物接收，不覆盖首交当时的 `reviewed=false`，不证明读者独立性、真实服务或工作流采用。答案页未改、评级未升级。
