# 结果：流式 Chat Completions 手动完整历史在 `64fbde5` 上可复现

**结论：按页面“去掉服务端会话参数、下一轮回传 `to_input_list()` + 新用户消息”的分支，在固定 SDK `64fbde5d02b42ae5f9db668eb0184cdb3fc9d775` 上，流式与非流式两轮请求都保留了完整历史，且没有混入服务端 ID、`session` 或服务端续接。流式 `last_response_id` 在本 SHA 仍是 `__fake_id__`，非流式是 `None`；消费者不使用该值，所以不影响手动 replay。**

- 实收页面全文 SHA-256：`b6b6c905b568f68e598831944d03cff251bffc1600734e55bf18e28fae6b873c`（9,577 字节 / 5,361 字符，与任务卡给的值一致）。
- 消费者脚本：`consumer.py`；脱敏请求与输出：`captures/streaming.json`、`captures/nonstreaming.json`、`captures/summary.json`；复跑：`rerun.sh`。
- 每轮实际发出 3 个 Chat Completions 请求：第 1 轮 2 个（工具调用、工具结果后的最终回答），第 2 轮 1 个（完整历史 + 新用户消息）。
- 两种模式共 46 项请求级断言全部通过；SDK 相关测试 434 项通过。Mock 只证明客户端按页面组装并发送了请求，不证明真实模型记忆或服务端接收，也没有调用真实 API。

## 实收正文与独立性

本结果由第一次读本页的读者完成。开始工作前工作目录里没有本任务的 artifact 目录或 `reader-tests/A-CONTEXT-CHAT-STREAM-READER-20261114-u1.md`；未读取作者实验、其他读者答案或本任务已有结果，未修改页面。任务卡内嵌 JSON 的 `page_text` 由本角色自行解析并计算哈希，未用页面链接或摘要代替。

页面给手动历史分支定的规则被直接当作实现约束：

- 使用 `OpenAIChatCompletionsModel`，应用自己持有完整历史；
- 不传 `conversation_id`、`previous_response_id`，`auto_previous_response_id` 保持默认 `False`；
- 不接自动保存历史的 `session`；
- 下一轮输入是 `result.to_input_list()` 加新用户消息；
- 流式先消费完 `result.stream_events()`，再取历史；
- 验收看实际请求，不只看 `final_output`。

## 做法

- SDK 固定在 `64fbde5d02b42ae5f9db668eb0184cdb3fc9d775`（包版本字符串仍是 `0.24.0`，提交日期 2026-11-11）。从该提交的公开源码运行。
- 用 `httpx2.MockTransport` 响应全部 Chat Completions 请求；`AsyncOpenAI(base_url="https://api.openai.com/v1", api_key="sk-test-not-a-real-key", max_retries=0)` 只作为请求入口，不产生网络调用。`RunConfig(tracing_disabled=True)` 关闭 trace exporter，避免它另开真实连接。
- 合成两轮：第 1 轮用户消息触发一次 `lookup_order` 工具调用，Mock 先返回 `tool_calls`，SDK 执行本地工具后再返回最终文本；第 2 轮把第 1 轮 `to_input_list()` 加上新用户消息再运行。
- 流式用 `Runner.run_streamed` 并完整迭代 `stream_events()` 后取历史；非流式用同一 Agent/同一 Mock 脚本跑 `Runner.run` 作对照。两种模式分别写 captures。

## 实际请求（脱敏）

三个请求的 `messages` 只含合成的 system/user/assistant/tool 内容，不含真实账户、密钥或本机路径。关键形态：

| 请求 | `stream` | roles | 说明 |
|---|---|---|---|
| 第 1 轮 #1 | `true` / 非流式省略 | system, user | 只有初始用户，尚无工具消息 |
| 第 1 轮 #2 | `true` / 非流式省略 | system, user, assistant, tool | assistant 带 `tool_calls`，tool 的 `tool_call_id` 匹配 |
| 第 2 轮 #1 | `true` / 非流式省略 | system, user, assistant, tool, assistant, user | 完整 replay + 新用户消息 |

所有请求同时带 `store: true`（SDK 对官方 base_url 的默认值），流式请求还带 `stream_options.include_usage: true`；`store` 不把任何 response ID 带入下一轮，消费者也没有读取或回填它。

第 2 轮实际发出的消息（流式与非流式逐字相同）：

```json
[
  {"role": "system", "content": "Use the lookup_order tool whenever the user asks about an order."},
  {"role": "user", "content": "Find order 1234 and tell me its status."},
  {"role": "assistant", "content": null, "tool_calls": [{"id": "call_order_1234", "type": "function", "function": {"name": "lookup_order", "arguments": "{\"order_id\":\"1234\"}"}}]},
  {"role": "tool", "tool_call_id": "call_order_1234", "content": "order 1234: shipped, arriving in 2 days"},
  {"role": "assistant", "content": "Order 1234 shipped and should arrive in 2 days."},
  {"role": "user", "content": "Is there anything else I need to do for that order?"}
]
```

初始用户只出现一次，assistant 的 `tool_calls` 只出现一次，tool 结果只出现一次且 `tool_call_id` 与 `call_order_1234` 匹配，新用户消息只出现一次并位于最后。`to_input_list()` 里带的 `provider_data.response_id` / `__fake_id__` 等内部字段没有进入 Chat Completions 请求体。

## 断言

`captures/summary.json` 记录两种模式各自的请求数、`last_response_id` 和失败项；`captures/*.json` 的 `checks` 为逐项布尔值。全部通过：

- 第 1 轮 #1：恰有 1 个初始用户；消息顺序 `system,user`；还没有 tool 消息；无 `previous_response_id` / `conversation_id`。
- 第 1 轮 #2：消息顺序 `system,user,assistant,tool`；assistant 恰有 1 个 `tool_calls`；工具名、参数、`tool_call_id`、工具返回值逐字匹配；无服务端状态字段。
- 第 2 轮：两个 user；初始用户和新用户各只出现一次，新用户在最后；assistant `tool_calls` 与 tool 结果各保留一次且 id 匹配；上一轮最终 assistant 文本保留；消息顺序与上表一致；无服务端状态字段。
- 流式结果在完整迭代 `stream_events()` 后才读取 `to_input_list()`；非流式用同一序列做对照。
- 跨模式对照：三个请求的 `messages` 逐字相同；`stream` 字段只在流式出现且为 `true`；两种模式的 6 个请求都无 `previous_response_id` / `conversation_id`；未传 `session`。

## `last_response_id`：流式与非流式不同

观察值（`captures/summary.json`）：

| 模式 | 第 1 轮 | 第 2 轮 |
|---|---|---|
| 流式 `Runner.run_streamed` | `__fake_id__` | `__fake_id__` |
| 非流式 `Runner.run` | `None` | `None` |

源码位置可以解释差异：非流式路径在 `src/agents/models/openai_chatcompletions.py:381` 显式返回 `response_id=None`；流式路径在 `:771` 用 `id=FAKE_RESPONSES_ID` 构造本地 `Response`，`chatcmpl_stream_handler.py:1349` 复制该对象作为终态，`result.py:538` 的 `last_response_id` 直接返回 `raw_responses[-1].response_id`。这是 issue #5451 报告的流式占位 ID 现象，在本 SHA 仍存在；本消费者从未把 `last_response_id` 回填到下一轮，因此没有把 `__fake_id__` 当作服务端续接 ID。

## 有限验证

在固定提交上运行了与 Chat Completions 请求/流式/会话跟踪直接相关的测试文件（Python 3.13.5，pytest 9.2.0）：

| 命令（SDK 根目录，`PYTHONPATH=src`） | 结果 |
|---|---|
| `pytest -q tests/models/test_openai_chatcompletions.py tests/models/test_openai_chatcompletions_stream.py` | 186 passed |
| `pytest -q tests/test_server_conversation_tracker.py tests/test_stream_events.py` | 38 passed |
| `pytest -q tests/test_agent_runner_streamed.py` | 210 passed |

合计 434 passed，退出码 0；`test_agent_runner_streamed.py` 需要额外安装公开依赖 `httpx`（0.28.1）。这不是全库测试。

第一次运行测试时用的是 PyPI 最新 `openai 3.55.0`，`test_stream_span_is_recorded_for_a_consumer_that_stops_at_the_terminal_event` 的 4 个参数化用例因 `input_tokens_details` 多出 `cache_write_tokens_details` 字段失败；按该提交 `uv.lock` 固定 `openai 3.29.0`、`httpx2 2.14.0`、`pydantic 2.14.2` 后全部通过。该 4 项失败属于依赖漂移，不是本消费者或 SDK 逻辑失败，记录在此以免被误读为已验证通过。

## 页内卡点与页外帮助

- **页面只给了非流式片段。** “**🧪 使用 `OpenAIChatCompletionsModel` ... 下一轮回传 `result.to_input_list()` 加新用户消息。**”下面的代码是 `Runner.run` 两轮示例，没有 `Runner.run_streamed` 的写法、如何注入 `OpenAIChatCompletionsModel`，也没有 MockTransport 的接线。页外帮助：读固定提交的 `src/agents/models/openai_chatcompletions.py` 确认构造参数，读 `openai`/`httpx2` 包确认 `http_client` + `MockTransport` 入口。
- **流式取历史的时序只在正文一句。** “流式运行先消费完 `result.stream_events()`，再取历史。”没有说明在流结束前取 `to_input_list()` 会怎样，也没有流式示例。实现上先完整迭代事件流，再调用 `to_input_list()`。
- **`last_response_id` 的流式差异不在页面内。** 页面没有提到 `__fake_id__`。任务要求单独记录，页外帮助：issue #5451 说明了该现象，固定提交源码确认其仍存在；本消费者不使用该值。
- **页面对 SDK 行为的结论绑定在另一个提交。** “**适配器忽略服务端参数，不代表 Runner 没裁历史。** 在 SDK `1fc77bbc` ... `strict_feature_validation=True` 能挡两个显式 ID...”在本任务固定的 `64fbde5` 上，适配器对显式 `previous_response_id`/`conversation_id` 默认是警告后忽略，`strict_feature_validation=True` 会抛 `UserError`；`auto_previous_response_id` 仍由 Runner 建服务端会话跟踪器。页面这句话不能直接当作当前 SHA 的已验证结论，需按固定提交复核。
- **“不要同时再接 `session`”没有给出位置。** 页面没说 `session` 是 `Runner.run*` 的参数；实现上就是完全不传，并用请求断言确认没有服务端状态字段。
- **页面没有提 tracing。** 只接 MockTransport 时，SDK 的 trace exporter 仍可能自行发起真实连接；页外帮助：`RunConfig(tracing_disabled=True)` 关闭它，本消费者的模型请求只经过 MockTransport。

页外还核对了原 issue #5451 与 #5454 的标题、状态和复现描述，确认 #5451 的“流式 `response_id` 为 `__fake_id__`、非流式为 `None`”与本地观察一致；本任务不投稿、不评论上游。

## 未验项与限制

- Mock 响应不证明真实模型能记住历史、也不证明服务端实际接收了完整 replay；没有真实 API、账户或凭据。
- 没有验证服务端会话组合（`conversation_id`、`previous_response_id`、`auto_previous_response_id=True`）与完整 replay 的混用；只验证了本消费者不混用。
- 没有验证 SQLiteSession 新推荐、Responses 压缩或原生客户端；这些不在本页手动历史分支内。
- 没有跑 SDK 全库测试；只跑了上表 434 项相关测试。
- 只在 Windows 11、Python 3.13.5 上运行；仓库 SDK 支持的其他 Python 版本未复测。
- 断言基于合成请求体的字段和顺序；没有对真实 provider 的额外字段（如 provider 特定 `provider_data`）做兼容性验证。

## 版本

- openai-agents-python：`64fbde5d02b42ae5f9db668eb0184cdb3fc9d775`（包版本 `0.24.0`）
- Python：3.13.5
- openai：3.29.0（`uv.lock` 固定值）
- httpx2：2.14.0；httpx：0.28.1（仅测试需要）
- pydantic：2.14.2
- pytest：9.2.0；pytest-asyncio：1.5.0；inline-snapshot：0.37.0

## 复跑与产物

```bash
cd docs/collaboration/local-jobs/artifacts/A-CONTEXT-CHAT-STREAM-READER-20261114
./rerun.sh          # 或按 rerun.sh 头部注释装好依赖后运行 python consumer.py --out-dir captures
```

产物（均在本目录下）：

- `consumer.py`：两轮流式/非流式 Mock 消费者与断言。
- `captures/streaming.json`、`captures/nonstreaming.json`：三个请求的消息、`stream`/`store`/`stream_options`、服务端状态字段检测、两轮 `to_input_list()`/`final_output`/`last_response_id`、逐项断言。
- `captures/summary.json`：模式汇总、失败项、流式/非流式对照。
- `rerun.sh`：复跑命令与依赖说明。
- `result.md`：本结果。
