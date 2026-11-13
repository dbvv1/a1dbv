# A-MIGRATION-HERMES-V2-CONSUMERS-20261113 · Anthropic SDK 2.x 源代码消费者核对

## 结论

**固定 Hermes `c9b20d7` 的源代码消费者核对完成，供云端 0.125→2.x 实现者当轮核对。未修改任何 Hermes 源码、未安装依赖、未调用模型或真实 API；本文是静态源码核对，不是运行通过。** 本单元只新增本文件，状态可交 `review_ready`，不自动合 main。

按 SDK 2.3.0 与 API 2026-10-21 契约，固定源码有四个会直接改变验收的失效层：

1. **API-key 路由会丢认证。** 构造函数走 `api_key=`，同时用 `Authorization: Omit()` 防止环境 token 混入；2.x 把 API key 本身改放 `Authorization: Bearer`，这个旧 `Omit` 会删掉唯一的认证头，请求既无 `X-Api-Key` 也无 `Authorization`。影响原生 Console key、Kimi 和第三方 Anthropic 协议代理；OAuth、Bearer（MiniMax/Foundry 静态 key 等）仍保留 `Authorization`。
2. **采样参数已从 2.x SDK 方法签名移除。** 固定源码仍有 `temperature` 生成点：旧模型手动 thinking 分支和辅助请求透传。请求会在 SDK 调用前 `TypeError`，即使不走 SDK 也会被 API 以 400 拒绝（默认值也拒绝）。省略后按默认值采样，包括 `temperature=1.0`：旧 thinking 的 `temperature: 1` 删除是行为保持；辅助调用方的非默认值（0.3/0 等）会失去效果，官方明确“No other setting replaces it”，只能接受默认 1.0 的行为变化或把该请求留在 `2023-06-01`。`top_p`/`top_k` 没有找到进入 Messages 请求体的生成点。
3. **传给 SDK 的 HTTP 对象仍是 `httpx` 类型。** `_client_timeout` 返回 `httpx.Timeout`，Entra Bearer hook 返回 `httpx.Client`；2.x 在构造时按模块名拒绝 `httpx` 对象并抛 `TypeError`。
4. **user-role citations 入口存在但未找到仓内生产者。** 转换器会给任意 `text` part 附 `citations`；仓内唯一 citations 生产者是 assistant 流累积，assistant 回放在新 API 仍允许。没有发现 `document` block 生产者。

`AnthropicBedrock` 仍可从顶层 `anthropic.AnthropicBedrock` 访问（`__init__.py` 的 star import），未发现类被移除；Bedrock 的剩余问题是 timeout 类型，以及 API `2026-10-21` 在 Bedrock 只对 Claude 4.7+ 开放：4.6 及以下若继续用 SDK，官方要求留在今天的 SDK 版本，全局 `anthropic>=2` pin 与这些模型直接冲突。硬编码 `anthropic-version: 2023-06-01` 的直接 HTTP 路由不经过 SDK，保持可用，不建议全局替换。

## 输入与固定点

- 任务仓：`NousResearch/hermes-agent`，固定提交 [`c9b20d7bc08dec1e10779a06d7d9073bc6e7e418`](https://github.com/NousResearch/hermes-agent/commit/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418)。隔离副本 `git rev-parse HEAD` 与之一致；实际读取文件的 `git hash-object` 与 `HEAD:<path>` 逐项相同。
- 主要读取文件（固定链接）：[`agent/anthropic_adapter.py`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py)（885 行）、[`agent/auxiliary_client.py`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py)（8270 行）、[`agent/anthropic_message_convert.py`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_message_convert.py)（787 行）、[`agent/azure_identity_adapter.py`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/azure_identity_adapter.py)（358 行）。
- 为追调用链另读：`agent/anthropic_credentials.py`、`agent/anthropic_endpoints.py`、`agent/transports/anthropic.py`、`agent/agent_init.py`、`agent/agent_runtime_helpers.py`、`agent/client_lifecycle.py`、`agent/chat_completion_helpers.py`、`agent/bedrock_adapter.py`、`agent/relay_llm.py`、`hermes_cli/*` 的相关直接 HTTP 路由，以及 `tests/agent/` 下的认证、辅助、Azure/Bedrock 测试。
- 源码文件 SHA-256：`anthropic_adapter.py` `d40c5260063e222cc85424c70d77883d80d67b60bcc5fe9b136b3c2bbf1bc164`；`auxiliary_client.py` `6ea785756c3a47c8b4b6d954bd26d9eb2525bf70b398c99220f3661398a1208d`；`anthropic_message_convert.py` `141c5aae18d9d20647910b24cf0a19e2e3c767b03e9d355ab9c6b6cbd011dd4e`；`azure_identity_adapter.py` `3c3203717daecbafc91f3b18c9f5a5688ba112e43674de9a20d47957c337df7d`。
- 依赖现状：`pyproject.toml` 两处 pin 仍是 `anthropic==0.125.0`（可选 `anthropic` extra 与 `test` group），Hermes 自身直接用 `httpx[socks]==0.28.1`；`httpx2==2.15.1` 目前只出现在 `mcp`、`computer-use` 和 `dev` group。SDK 2.3.0 自身依赖 `httpx2>=2.0,<3`。
- 固定副本在 Windows 上因路径长度少落盘 22 个 `website/`、`plugins/config_backends/` 文档/夹具文件，均不在本单元读取或核对范围；本单元引用文件全部完整且 blob 与固定提交一致。
- 另用 Python AST 机械核对 SDK 2.3.0 源码：`messages.create`/`stream` 的 keyword-only 参数列表均无 `temperature`/`top_p`/`top_k`；`Omit` 仍在顶层导出；`_reject_httpx_object` 与 `http_client` 的 `httpx2.Client` 类型检查存在。该检查只证明符号/签名形状，不替代运行时请求。

## 官方 2.3.0 契约（只列会改变验收的事实）

来源：[SDK v2.3.0 `MIGRATION.md`](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/MIGRATION.md)、[API 2026-10-21 迁移指南](https://platform.claude.com/docs/en/api/migration-2026-10-21)、[SDK v2.3.0 源码](https://github.com/anthropics/anthropic-sdk-python/tree/v2.3.0)、[issue #142796 原帖](https://github.com/NousResearch/hermes-agent/issues/142796)（2026-11-13 读取：open，0 条评论）。

| 契约 | 明确来源 | 对 Hermes 的含义 |
|---|---|---|
| Python 升到 `anthropic>=2` 后请求使用 API `2026-10-21` | 迁移指南 “Switch to 2026-10-21”；`_constants.py` 的 `ANTHROPIC_API_VERSION` | 0.125.0 的 `2023-06-01` 行为不再保留 |
| `temperature`、`top_p`、`top_k` 从 Messages 请求和 SDK 方法移除，带了即 400（默认值也拒绝） | 迁移指南 “Sampling parameters are removed”；v2.3.0 `messages.py` 的 `create`/`stream` 签名无这三个参数 | Hermes 的采样参数生成点必须先删，不能等 400 后重试 |
| 省略后按默认值采样，含 `temperature=1.0`，与 `2023-06-01` 省略时相同；依赖非默认值的请求会失去该效果，官方明确“No other setting replaces it” | 迁移指南 “Sampling parameters are removed” | 旧 thinking 的 `temperature: 1` 删除属行为保持；辅助调用方的 0.3/0 等非默认值删除是行为变化，需产品验收决定接受默认 1.0，还是为该路由保留 `2023-06-01` |
| API key 改为 `Authorization: Bearer <key>`；`X-Api-Key` 不再由 `api_key=` 发出 | 迁移指南 “API keys are sent as Authorization: Bearer”；`_client.py` 的 `_api_key_auth` | `_new_sdk_client` 的 `Authorization: Omit()` 会删除唯一认证头 |
| 一个 client 只持有一个凭据；显式传入时不再读环境中的另一凭据 | 迁移指南 “A client holds one credential” | Hermes 的 `api_key`/`auth_token` 二选一构造方式本身兼容；问题在 `Omit` |
| `Omit` 仍存在；`extra_headers={"X-Api-Key": omit}` 不再能阻止 key，需改成 `Authorization: omit` | 迁移指南；`_types.py` 的 `Omit` | Hermes 用 `sdk.Omit()` 编译通过，但语义已反转 |
| `httpx.Client`/`httpx.Timeout` 传给 SDK 会立刻 `TypeError`，必须用 `httpx2` 或 SDK re-export | `MIGRATION.md` “The SDK is built on httpx2”；`_base_client.py` 的 `_reject_httpx_object`、`http_client` 类型检查 | Hermes 两处生成点都要改 |
| `citations` 非空数组出现在 user 的 `text` block 会 400；assistant 回放仍允许 | 迁移指南 “Citations in user messages return an error” | 需确认 user 路径是否可达，不能只改 assistant |
| assistant 消息中的 `document` block 会 400 | 迁移指南 | 固定源码未找到生产者 |
| Bedrock 上 API `2026-10-21` 只对 Claude 4.7+ 开放；4.6 及以下应留在今天的 API 版本。**使用 SDK 的调用应留在今天的 SDK 版本；只有自行设置 API 版本的非 SDK 调用才保持今天的版本** | 迁移指南 “On Amazon Bedrock…” | Hermes 支持更老 Bedrock Claude；全局 `anthropic>=2` pin 会强制这些调用走 `2026-10-21`，与 4.6 及以下模型冲突。保留旧模型需分客户端/分 SDK 版本，或证明 per-request 版本覆盖可行（未验证），不能只写留在 API 版本 |
| 2.0.0 起许可证由 MIT 改为 Apache 2.0 | v2.3.0 `LICENSE`、`LICENSE-MIT` | Hermes 是 MIT；分发/声明需按依赖许可复核 |

## 消费者矩阵

“是否经过适配层”指是否进入 `agent/anthropic_adapter.py` 构造的 SDK client。

| 链路 | 入口与符号 | 经过适配层 | 实际 SDK client 与输出 | 2.3.0 风险 |
|---|---|---|---|---|
| 主请求构造 | [`_init_anthropic_client`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/agent_init.py#L641-L686)、[`_build_direct_anthropic_client`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/client_lifecycle.py#L500-L514)、[`_build_anthropic_client_from_runtime`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/agent_runtime_helpers.py#L1115-L1127) | 是，`build_anthropic_client` | `anthropic.Anthropic` | 认证、timeout |
| 主请求发送 | [`_anthropic_messages_create`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/client_lifecycle.py#L1007-L1018) 与 [`_call_anthropic`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/chat_completion_helpers.py#L3360-L3386) | 是，`create_anthropic_message` 或直接 `messages.stream()` | `MessageStreamManager` → `MessageStream` → `anthropic.types.Message` | 采样参数、流内部 `_raw_stream` 兼容 |
| 主请求 kwargs | [`_build_anthropic_kwargs`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/chat_completion_helpers.py#L1378-L1392) → [`AnthropicTransport.build_kwargs`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/transports/anthropic.py#L55-L62) → `build_anthropic_kwargs` | 是（只产 kwargs） | 请求 dict，随后交给上述 client | 旧模型 thinking 的 `temperature: 1` |
| 辅助请求 | [`_AnthropicCompletionsAdapter.create`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L1703-L1816) | 是，`build_anthropic_kwargs` + `create_anthropic_message` | `anthropic.Anthropic`；返回由 `Message` 经 `normalize_response` 归一化得到的 OpenAI 形状 `SimpleNamespace`（`choices[0].message` 含 `content`/`tool_calls`/`reasoning`），不含原始 `Message` | 采样参数、认证、timeout |
| 辅助 provider 解析 | [`_try_anthropic`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L3044-L3100)、[`_maybe_wrap_anthropic`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L1911-L1948)、[`_try_custom_endpoint`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L2916-L2933)、[named custom](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L5055-L5070)、[`_try_azure_foundry`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L3038-L3041)、[minimax-oauth registry](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client_registry.py#L108-L116) | 是，均走 `build_anthropic_client` | `anthropic.Anthropic` | 认证、Entra hook/timeout |
| copy / `with_options` | [named custom `with_options(default_headers=...)`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L5062-L5067) | 是 | `Anthropic.copy()` 返回同类 `Anthropic` | 复制会继承 `Omit`；API-key 复制后仍无认证头 |
| Bedrock 主/辅 | [`build_anthropic_bedrock_client`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L523-L544)、[`bind_bedrock_runtime`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/bedrock_adapter.py#L491-L513)、[aux `_build_bedrock_client`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L4646-L4684) | 是 | `anthropic.AnthropicBedrock`（顶层仍可访问）；输出 `Message` | `httpx.Timeout` 构造失败；4.6 及以下旧模型需留在今天的 SDK 版本 |
| Foundry 静态 key | `_auth_style` → `_requires_bearer_auth` 为真 | 是 | `Anthropic`，`auth_token=` → Bearer | 认证可用；timeout 需改 |
| Foundry Entra ID | [`_build_anthropic_client_with_bearer_hook`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L400-L431) | 是 | `Anthropic` + 自定义 `http_client` | `httpx.Client` 被 2.x 拒绝 |
| Bedrock Converse / OpenAI-wire | `BedrockAuxiliaryClient`、`build_bedrock_openai_http_client` | 否（boto3 / OpenAI SDK） | Converse 响应 / OpenAI 类型 | 不受本次 Anthropic SDK 升级影响；`top_p` 只在此路 |

补充：辅助异步路径没有构造 `AsyncAnthropic`。[`_AsyncCompletionsAdapter`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L1630-L1638) 用 `asyncio.to_thread` 跑同一个同步 `create`，[`_AsyncAuxiliaryClientBase`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L1641-L1661) 只做包装，因此风险与同步辅助链相同。

## 参数、citations、认证头的生成点

### temperature / top_p / top_k

| 命中 | 固定行链接 | 可达性 | 原有测试入口 |
|---|---|---|---|
| 旧模型手动 thinking 写入 `temperature: 1` | [`_thinking_kwargs`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L617-L643) 的 `temperature` key（L641） | 可达。`build_anthropic_kwargs` 收到 `reasoning_config` 且模型匹配 `_LEGACY_MANUAL_THINKING_CLAUDE_SUBSTRINGS`（claude-3、4.0/4.1/4.5 等）时进入；4.6+ adaptive、Kimi/Moonshot、pre-thinking Haiku 不进入 | [`test_reasoning_config_maps_to_manual_thinking_for_pre_4_6_models`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/tests/agent/test_anthropic_adapter.py#L936-L947) 断言 `temperature == 1` |
| 辅助适配器按调用方传入的 temperature 回填 | [`_AnthropicCompletionsAdapter.create`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L1750-L1764) 的 `anthropic_kwargs["temperature"] = temperature`（L1763） | 可达。`temperature is not None` 且 `_forbids_sampling_params(model)` 为假时进入；对旧 Claude 与第三方非 Claude Messages 模型为假 | [`test_non_kimi_models_preserve_temperature`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/tests/agent/test_auxiliary_client.py#L2347-L2358)；参数梯子测试在同文件 |
| 辅助请求 kwargs 构造 | [`_build_call_kwargs`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L6553-L6580) 的 `kwargs["temperature"] = temperature`（L6579） | 可达。上游传 temperature 的调用方包括 [`run_oneshot` 默认 0.3](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/oneshot.py#L80-L108)、[`approval_smart` 传 0](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/tools/approval_smart.py#L120-L126)、[MoA preset](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/moa_loop.py#L848-L857) | 同上；`test_auxiliary_client.py` 的 temperature 用例 |
| 唯一主动剥离点 | [`build_anthropic_kwargs`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L703-L707) 仅在 `_forbids_sampling_params(model)` 为真时 pop 三个键 | 只覆盖 Opus 4.7+ 与未知 Claude；不覆盖旧 Claude、第三方非 Claude、`kimi` | [`test_reasoning_config_maps_to_adaptive_thinking_for_4_6_models`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/tests/agent/test_anthropic_adapter.py#L949-L963) 断言 4.6 无 temperature |
| `top_p` / `top_k` | — | **没有找到进入 Anthropic Messages 请求体的生成点。** `top_p` 只在 Bedrock Converse 路径由 [`_BedrockCompletionsAdapter.create`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/auxiliary_client.py#L1838-L1873) 传给 `call_converse`，由 [`build_converse_kwargs`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/bedrock_adapter.py#L1314-L1331) 生成 `topP`；`top_k` 无生产代码命中 | 不适用（boto3 Converse，不是 Messages SDK） |

结论：2.x 验收不能只保留“对 4.7+ 剥离”的安全网；旧 Claude 的 thinking 路径和辅助 `temperature` 都要在 Messages 边界统一删除或改为按路由能力控制。删除后默认 `temperature=1.0`：旧 thinking 的 `1` 属行为保持，辅助调用方的非默认值则是行为变化，验收要逐调用方记录是否接受，或为该路由保留 `2023-06-01`。

### citations 与 document

| 命中 | 固定行链接 | 可达性判断 | 原有测试入口 |
|---|---|---|---|
| `_text_block_with_citations` 给 `text` block 附非空 `citations` | [`anthropic_message_convert.py` L49-L54](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_message_convert.py#L49-L54) | 入口存在，对 user/assistant 都调用 | [`test_anthropic_output_field_leak.py`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/tests/agent/test_anthropic_output_field_leak.py#L20-L60) 只断言 null/空 citations 被去掉，未区分角色 |
| user 消息转换路径 | [`_convert_user_message`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_message_convert.py#L481-L490) → `_convert_content_to_anthropic` → [`_convert_content_part_to_anthropic`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_message_convert.py#L187-L206)（L197） | **入口可达；仓内没有确认的 user-role citations 生产者。** 外部导入/旧会话若存了这种 part 会原样发出 | 无 user-role 用例 |
| assistant 回放路径 | [`_replay_text`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_message_convert.py#L290-L296)（L296） | 可达；生产代码中创建 citations 的位置是 [`AnthropicStreamAccumulator`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/relay_llm.py#L630-L642) 的 `citations_delta`，落在 assistant block；新 API 仍接受 | 同上 |
| `document` block | — | 未找到任何 Anthropic `document` block 生产者；不构成当前入口 | 无 |

判断：在转换边界按角色删除 user 的 `citations` 是低风险防线；但仅凭固定源码不能证明线上历史里一定没有这种 user part，验收应包含一条合成历史请求。

### X-Api-Key / Authorization

| 命中 | 固定行链接 | 实际行为 |
|---|---|---|
| 认证方式选择 | [`_auth_style`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L472-L487) | `kimi`/`api_key`/`bearer`/`oauth` 四类；后两类用 `auth_token`，前两类用 `api_key` |
| 构造参数写入 | [`build_anthropic_client`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L490-L520)（L508） | `kwargs["auth_token" if style in ("bearer","oauth") else "api_key"]` |
| 单凭据保护 | [`_new_sdk_client`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L434-L456)（L445-L449） | `api_key` 存在且无 `auth_token` → `Authorization = sdk.Omit()`；反向 → `X-Api-Key = sdk.Omit()` |
| SDK 2.x 结果 | [`_client.py` `_api_key_auth` L375-L380](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/src/anthropic/_client.py#L375-L380)、[`_base_client.py` `build_headers` L2773-L2791](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/src/anthropic/_base_client.py#L2773-L2791)、[`_client.py` `_validate_headers` L405-L421](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/src/anthropic/_client.py#L405-L421) | `api_key` 产生 `Authorization: Bearer`，随后被 `Omit` 删除；`_base_client._build_headers`（L551-L575）调用上述 `build_headers` 删头，再由 `_validate_headers` 因 `"authorization" in omitted` 直接返回，不报错。**API-key 路由发出时两种头都没有**（源码事实 + 静态推断，未发真实请求） |
| OAuth / Bearer | 同上 | `auth_token` 产生的 `Authorization` 不被删，`X-Api-Key: Omit` 在 2.x 无副作用；这两类认证保留 |

影响面：原生 Console key（`sk-ant-api/usr/svc/admin`）和所有 `_auth_style` 判为 `api_key`/`kimi` 的第三方 Anthropic 协议端点。Foundry 静态 key 与 MiniMax/Portal 等走 `bearer`，不受这条影响。

原有测试已把旧契约写死，升级后应改写而不是删除：[`test_console_key_families_carry_x_api_key_without_claude_code_identity`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/tests/agent/test_anthropic_client_auth.py#L69-L82)、[`test_third_party_request_on_the_wire_carries_no_foreign_bearer`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/tests/agent/test_anthropic_client_auth.py#L55-L80)、[Portal Bearer + copy 用例](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/tests/agent/test_nous_portal_anthropic_wire.py#L193-L225)；另有 29 个测试文件出现 `x-api-key` 字样，其中多数是脱敏、诊断或直接 HTTP fake，不等于都断言 SDK 线格式。

### httpx / httpx2

| 命中 | 固定行链接 | 2.3.0 行为 |
|---|---|---|
| SDK timeout | [`_client_timeout`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L378-L382) `from httpx import Timeout` → `httpx.Timeout(...)`；被 [`_base_client_kwargs`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/anthropic_adapter.py#L385-L397) 放进 `kwargs["timeout"]` | `Anthropic`/`AnthropicBedrock` 构造时 `_reject_httpx_object("timeout", ...)` 按模块名识别 `httpx` 并抛 `TypeError` |
| Entra HTTP client | [`build_bearer_http_client`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/azure_identity_adapter.py#L313-L343)（L323 import `httpx`，L343 返回 `httpx.Client`） | `Anthropic(http_client=...)` 要求 `httpx2.Client`，否则 `TypeError("Invalid http_client argument; Expected an instance of httpx2.Client...")` |
| 不受影响 | `agent/model_metadata.py` 等直接 HTTP 路由 | 它们不把对象交给 Anthropic SDK；继续用 `httpx`/`urllib` 即可 |

实现提示（不是本单元改动）：`_base_client_kwargs` 还被 [`doctor_connectivity._anthropic_messages_probe`](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/hermes_cli/doctor_connectivity.py#L205-L218) 调用，但只取 `default_query`。若把 timeout 类型改成必须 import `anthropic` 的实现，注意不要让未安装可选 SDK 的 doctor 路径先 import 失败；`httpx2` 会随 `anthropic>=2` 传递安装，但当前 `pyproject.toml` 未在核心 group 直接 pin。

## 不受新 API 影响的直接 HTTP 路由

这些路由自己发请求，不经过 `anthropic` SDK，也不会因 SDK 2.x 改变；新 API 仍接受 `X-Api-Key`（迁移指南明确“API 接受任一头部”）。**不建议为升级全局替换这些旧版本头**。

- [`agent/model_metadata.py` L1639](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/agent/model_metadata.py#L1639)：`x-api-key` + `anthropic-version: 2023-06-01` 查 `/v1/models`。
- [`hermes_cli/models.py` L2140-L2146](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/hermes_cli/models.py#L2140-L2146) 与 [L2346](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/hermes_cli/models.py#L2346)。
- [`hermes_cli/doctor_connectivity.py` L163](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/hermes_cli/doctor_connectivity.py#L163) 与 [L214](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/hermes_cli/doctor_connectivity.py#L214)。
- [`hermes_cli/azure_detect.py` L177](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/hermes_cli/azure_detect.py#L177)。
- [`hermes_cli/models_validate.py` L515](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/hermes_cli/models_validate.py#L515)、[`hermes_cli/web_routers/config_env.py` L986](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/hermes_cli/web_routers/config_env.py#L986)、[`plugins/model-providers/anthropic/__init__.py` L28](https://github.com/NousResearch/hermes-agent/blob/c9b20d7bc08dec1e10779a06d7d9073bc6e7e418/plugins/model-providers/anthropic/__init__.py#L28)。
- 这些路由的 `anthropic-version: 2023-06-01` 是否要跟进是可选的独立决定，不是 SDK 升级的必要条件。

## 非作者独立核对

本实施者未参与 #142796 的实现，也未修改 Hermes 候选；以下是对固定源码的独立静态核对，不是运行结果，也不是第二个人的复核。

1. **主请求链。** 从 `agent_init._init_anthropic_client`、`client_lifecycle._build_direct_anthropic_client`/`_build_anthropic_client_for_key`、`agent_runtime_helpers._build_anthropic_client_from_runtime` 三个构造入口追到 `build_anthropic_client`；从 `chat_completion_helpers._build_anthropic_kwargs` 经 `transports.anthropic.AnthropicTransport.build_kwargs` 追到 `build_anthropic_kwargs`；发送端同时存在 `client_lifecycle._anthropic_messages_create` → `create_anthropic_message` 和 `chat_completion_helpers._call_anthropic` → `request_client.messages.stream()` 两条。引用闭合，未发现另一条主请求构造路径。
2. **辅助请求链。** `_AnthropicCompletionsAdapter.create` 是唯一实际组装 Messages 请求的辅助适配器；`_try_anthropic`、`_maybe_wrap_anthropic`、`_try_custom_endpoint`、named-custom、`_try_azure_foundry`、minimax-oauth registry 均构造 `AnthropicAuxiliaryClient`。异步路径复用同一同步 adapter，无独立 `AsyncAnthropic`。引用闭合。
3. **认证链。** `anthropic_credentials` 的 token/OAuth 分类 → `anthropic_endpoints._requires_bearer_auth`/`_is_third_party_anthropic_endpoint` → `_auth_style` → `build_anthropic_client` 的 `api_key`/`auth_token` 选择 → `_new_sdk_client` 的 `Omit`，再由 `azure_identity_adapter.build_bearer_http_client` 处理 Entra 每请求刷新。与 SDK 2.3.0 的 `_api_key_auth`、`_bearer_auth`、`build_headers`、`_reject_httpx_object` 逐项对照，确认上述失效层。

与 #142796 原帖（固定 main `55ee4ac`）对照：原帖四项在固定 SHA 均成立，行号仅小幅平移（`_thinking_kwargs` 640→641、strip 704-705→703-707、aux 1759-1764→1760-1763、builder 508 不变）。本次额外确认了原帖未展开的 SDK 2.x 层：`httpx.Timeout`/`httpx.Client` 构造拒绝、`with_options` 继承 `Omit`、Bedrock 旧模型 API 版本限制、Apache 2.0 许可；同时排除了 `AnthropicBedrock` 类移除、Text Completions、Models `betas=`、`MessageParam(...)` 调用这几项（固定源码无相应使用）。

## 潜在遗漏与 unknown

- **未运行真实 SDK 2.3.0。** 没有安装/更新依赖，也没有构造 client 或发请求；所有 `TypeError`/无认证头结论来自固定源码逐行推断。验收必须用真实 `anthropic==2.3.0` 加 `httpx2.MockTransport` 捕获当次请求。
- **Bedrock 旧模型版本策略未知。** 官方对 4.6 及以下给的是两条：使用 SDK 的调用应留在今天的 SDK 版本，只有自行设置 API 版本的非 SDK 调用才保持今天的版本。全局升到 `anthropic>=2` 会把 API 版本切到 `2026-10-21`，与旧 Bedrock 模型直接冲突；保留旧模型需分客户端/分 SDK 版本，或证明 per-request `extra_body={"anthropic_version": ...}` 能覆盖 `AnthropicBedrock._prepare_options` 的 `setdefault`，本单元未验证。默认 Bedrock 模型仍是 `anthropic.claude-haiku-4-5...`，属于会受影响的旧模型。
- **第三方端点的 `anthropic-version` 接受度未知。** MiniMax、Kimi、Z.AI、LiteLLM、OpenCode 等是否接受/忽略 2.x 自动发送的 `2026-10-21`，未请求验证。
- **user-role citations 的线上历史未知。** 固定源码没有生产者，但旧会话、导入记录或插件可能写入；需要一条合成历史请求验收。
- **流内部与错误类型。** `_raw_stream`、`get_final_message()`、`Message.stop_details`、`Usage`/`MessageDeltaUsage` 在 2.3.0 仍存在（已核源码）；`relay_llm`、watchdog、错误分类对 `httpx2` 异常类型和 pydantic 事件的行为未运行验证。
- **许可与锁文件。** 两处 `anthropic==0.125.0` pin 和 `uv.lock` 都要由实现者重生成；Apache 2.0 声明/分发审查不在本单元范围。
- **测试契约冲突。** 现有认证测试断言 `x-api-key`；它们是 v1 事实的回归，不应通过删断言来“修绿”，而应按新契约改写并保留旧路由测试。

## 可直接运行的原项目测试命令（未运行）

以下是固定源码自带入口，未在本单元运行：任务范围禁止安装/更新依赖，且这些测试在未适配的 2.3.0 树上预期会暴露上述旧契约失败，不能当作通过证据。按 Hermes `CONTRIBUTING.md`，必须先由 PM 构建独立测试环境，不能用裸 pip/uv 改环境：

```bash
# 在固定 SHA 的独立 clone 根目录；输出目录必须不存在
python -m pm.build_env --source . --out ../hermes-v2-test-env --group dev --group test --extra bedrock
export HERMES_PYTHON="$(cd ../hermes-v2-test-env && pwd)/bin/python"
bash scripts/run_tests.sh -j 2 --file-retries 0 --file-timeout 120 \
  tests/agent/test_anthropic_client_auth.py \
  tests/agent/test_nous_portal_anthropic_wire.py \
  tests/agent/test_auxiliary_client_azure_foundry.py \
  tests/agent/test_azure_identity_adapter.py \
  tests/agent/test_anthropic_adapter.py \
  tests/agent/test_anthropic_kwargs_sanitize.py \
  tests/agent/test_auxiliary_anthropic_timeout.py \
  tests/agent/test_anthropic_stream_fallbacks.py \
  tests/agent/test_anthropic_request_client_reuse.py \
  tests/agent/test_bedrock_request_timeout.py \
  tests/agent/test_bedrock_1m_context.py \
  tests/agent/test_bedrock_guardrail_claude_route.py
"$HERMES_PYTHON" scripts/check --base c9b20d7bc08dec1e10779a06d7d9073bc6e7e418
```

第一次运行需要网络下载锁定依赖；本单元没有执行。`scripts/run_tests.sh` 支持 `--file-timeout`/`--file-retries`，参数含义以其 `--help` 为准；上面的路径和 group 来自本固定 SHA 的 `CONTRIBUTING.md` 与 `pyproject.toml`。

## 还缺的产品验收

- 真实 2.3.0 构造矩阵：原生 API key、OAuth、Bearer（MiniMax/Foundry/Palantir/CommandCode）、Entra（连续两次请求验证刷新与单 Bearer）、Kimi、第三方 `/anthropic` 代理、Bedrock SigV4。
- 出站请求断言：body 不含 `temperature`/`top_p`/`top_k`；API-key 路由恰好一个认证头且值来自预期凭据；`anthropic-version` 符合各路由策略；user 消息无 `citations`。
- 主请求 stream 与非 stream、`create_anthropic_message` 的流不可用回退、`normalize_stream_usage` 的 `usage: null` 分支。
- 辅助全部调用方（oneshot 0.3、approval 0、MoA preset、压缩摘要、标题生成、vision/TTS）在 Anthropic 路由上的真实请求；逐项记录删除非默认 `temperature` 后是接受默认 1.0 的行为变化，还是为该请求保留 `2023-06-01`。
- Bedrock 4.6 及以下模型的客户端/版本策略（分客户端或分 SDK 版本，而非仅 per-request 覆盖，且该覆盖尚未验证）与 4.7+ 的版本策略；Foundry `api-version` 查询参数与 Entra hook 在 2.x 下的实际行为。
- 完整 Hermes 会话、fallback 链、重试、异步线程路径、OS/发布矩阵；本单元均未覆盖。

## 仓库检查

- `python scripts/check_repo.py`：退出 0，971 个文件，`errors: []`。
- `python scripts/check_public.py --staged`：退出 2，`findings: []`；`status: incomplete` 仅因仓库既有 54 个二进制/音频/图片条目被文本扫描器跳过，本文件不在 `skipped_entries` 中。模式扫描只覆盖凭据、私钥、本机路径和邮箱，仍需人工读 diff。
- `git diff --cached --check`：退出 0，无空白错误。

## 产物与边界

- 产物：本文件。未修改 Hermes 源码、测试、依赖或候选分支，未向官方/维护者发消息，未调用模型或真实 API。
- 只覆盖公开源码的静态消费者核对；`review_ready` 表示可交实现者当轮核对测试范围，不表示 2.x 升级已通过，也不决定升级默认或推荐。
