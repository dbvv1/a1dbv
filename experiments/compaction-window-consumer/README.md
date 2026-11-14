# 压缩包装器与历史窗口：先核真正送给模型的工具配对

🧪 **为有限历史的 SQLiteSession 套压缩包装器时，不只看任务返回成功；核送给模型的工具调用与结果是否仍成对。** 当前原例中，把同一个限额显式交给 `RunConfig.session_settings`，无需改 SDK 就能恢复本例正确输入；作者的未发布补丁也通过同题消费者。压缩本身尚未触发，本例不是压缩质量比较。

## 真实任务与结果

任务来自 [用户 #6007](https://github.com/openai/openai-agents-python/issues/6007)：SDK `OpenAIResponsesCompactionSession` 包住 `SQLiteSession(limit=2)` 后，限额对 Runner 不可见，截断后的工具结果进入模型输入，原调用已经在窗口之外。用真实 SDK Runner、内存 SQLite 和公开合成天气记录运行同步／流式两入口；模型是官方 `ScriptedModel`，不是生成服务。`AsyncOpenAI` 使用抛错的 MockTransport，未发生 API 请求，tracing 关闭。

| 输入路线（每项同步/流式各一次） | main 64fbde5d | 发布包 0.24.0 | 候选 4e0047c3 |
|---|---|---|---|
| 直接 SQLite、store limit=2 | 只发 assistant/user | 相同 | 相同 |
| 包装器、只在 store 设 limit=2 | 孤立 function_call_output + assistant/user | 相同缺口 | 只发 assistant/user |
| 包装器、store 与 RunConfig 均设 limit=2 | 只发 assistant/user | 相同 | 相同 |
| 包装器、无限窗口 | 保留用户、工具调用、工具结果、助手与新用户五项 | 相同 | 相同 |

三个版本各 8 路，共 24 路。main 与发布包各有 2 路出现孤立结果，候选 0 路；所有路线的 `final_output` 都为 `ok`，所以“最终回答成功”不能验收输入契约。全部路线保存 6 项历史且原调用仍在库里，输入清理未被误当作删除存储。结果字段 `input_types`/`orphan_outputs` 来自模型接收到的实际 SDK 输入，不是只调用内部 helper。

当前可复制的窄改法：已有包装器保持不变，将既定窗口显式交给当前 run，不借机扩大或缩小限额：

```python
from agents import RunConfig
from agents.memory import SessionSettings

run_config = RunConfig(session_settings=SessionSettings(limit=2))
# 将 run_config 与原 session 一起交给 Runner.run / Runner.run_streamed。
```

这里的 2 仅复现原问题，不推荐作为应用窗口默认值。它会丢弃缺配对的输出，不会补回窗口外的信息；需要保留工具上下文时，应使用足够完整的窗口，而不是把删除孤立结果当作语义完整。未验证真实 Responses API、HTTP 400、压缩调用／内容质量、Windows 或用户生产历史；本次不修改上下文答案页、地图状态和默认模板。

## 固定源与复跑

- main：`64fbde5d02b42ae5f9db668eb0184cdb3fc9d775`。
- 候选：[作者 fork](https://github.com/devteamaegis/openai-agents-python/commit/4e0047c35662a2b5329433fe85a326cbd9a57240)，唯一父提交为上述 main；只比较现有补丁，不改上游、不投稿。
- 发布包：`openai-agents==0.24.0`；依赖见 `requirements.txt`。Python 3.12.14，Linux；官方 OpenAI Python 包为 3.51.0。

在独立虚拟环境安装该依赖清单，分别取回两个固定源码版本；从本仓根目录运行，替换 `SOURCE` 为对应公开 SDK checkout（其下有 `src/agents`）：

```sh
PYTHONPATH=SOURCE/src python experiments/compaction-window-consumer/probe.py --expect hidden-orphan > result.json
# 候选源码使用 --expect clean；不设 PYTHONPATH，使用 --expect hidden-orphan，消费安装的 0.24.0 发布包。
python experiments/compaction-window-consumer/verify.py
```

第一条重新运行真实 SDK 消费者并断言8组预期、工具配对与存储保留；缺少 --expect 退出2，预期与实际不符则失败；最后一条仅验证入库的三份结果断言，不等于重新运行 SDK。候选预期没有孤立结果，main／发布包预期只有 hidden-limit 两路有 `call_1`。`should_trigger_compaction=False` 是原问题明确范围，不为绕过失败而取消应运行的压缩。

首次运行因 SDK 初始化 HTTP 客户端缺少 SOCKS 适配包而失败，补齐 `socksio` 依赖后重跑；未删除代理配置或换网络入口。没有将初始化失败计入 24 路成功运行。

## 支持范围与实现判断

按上游 implementation-strategy，要求是已支持 SQLite 限窗经现有压缩包装器后保持工具配对清理；保留无限历史和显式 RunConfig 覆盖；不扩展到自定义多层 wrapper、callback 自定窗口、实际压缩或服务端持久会话。现有替代是 RunConfig 显式限额。本轮是消费者调查，不实现新 resolver。

[官方限窗用法](https://openai.github.io/openai-agents-python/sessions/#limiting-retrieved-history)给出 RunConfig 覆盖；[压缩包装器说明](https://openai.github.io/openai-agents-python/sessions/#openai-responses-compaction-sessions)说明包装现有 backend；[固定输入准备实现](https://github.com/openai/openai-agents-python/blob/64fbde5d02b42ae5f9db668eb0184cdb3fc9d775/src/agents/run_internal/session_persistence.py)只按外层可见限额进入边界清理。候选读取一层 `underlying_session.session_settings.limit` 仅作清理判据，不改 get_items 调用。只验证表中组合，不称整个候选或 SDK 全套已验收。

定向核查覆盖官方源码、文档、用户公开报告与已有候选；#6007 暂无评论，不虚构维护者认可。没有开展跨框架广扫；本次结果用于避免误用包装器限窗，不得外推模型净收益或最佳长期记忆方案。核实 2026-11-14。
