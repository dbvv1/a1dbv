# Chat Completions：本地会话跨进程续接

真实故障 https://github.com/openai/openai-agents-python/issues/5454 的客户端替代方案验证：需要落盘历史时使用 SQLiteSession，每轮只传新输入，不叠加服务端 ID 或完整 replay。

SDK 固定 main 64fbde5d02b42ae5f9db668eb0184cdb3fc9d775，版本 0.24.0，Python 3.12.14。consumer.py 使用真实 Runner、OpenAIChatCompletionsModel、文件型 SQLiteSession；HTTP 为 MockTransport，响应和工具值为合成夹具，不调用真实模型或发送私人数据。

结果：错误 previous_response_id 路径第二次请求只有 1 条 tool；SQLiteSession 第二次请求为 user、assistant tool_calls、tool，共 3 条；新进程打开同库、同 session ID，仅传新问题，实际请求含原来的 4 条和新 user 共 5 条，工具值和调用 ID 保留，无重复原输入。请求见 result.json。

复制方式：session = SQLiteSession("conversation-id", "history.db")，然后 await Runner.run(agent, "本轮新消息", session=session)。重启后仍只传新消息。已有页面的显式完整历史方案仍保留，本试验补另一种状态所有者选择。

在固定 SDK checkout 的锁定运行环境运行 consumer.py。阶段为独立子进程，脚本断言持久化与恢复的 PID 不同，临时数据库自动清理。检查实际请求与断言，不只看 final_output，模拟端故意仍接受错误请求。

首次试跑遇到默认 trace provider 构造 HTTP 客户端缺 SOCKS 可选依赖；夹具改成显式无处理器 provider 保持离线，未改 SDK 源码或依赖锁。

独审：非作者复跑 exit 0，原进程 PID 13、恢复进程 17；实际请求序列、工具调用 ID 和 blue 值相符。SDK 工作树干净。

范围：非上游修复、真实模型质量、原生客户端压缩、长期无人值守、流式或并发验收，尚无新读者。文件不是访问控制或加密。固定 mock 回答不能证明模型记住了内容。

来源：上述 issue；固定源码 docs/running_agents.md 与 src/agents/memory/sqlite_session.py。核实 2026-11-14。
