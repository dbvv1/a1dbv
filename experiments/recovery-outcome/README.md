# 外部动作中断：先核对结果，再决定重试

核实时间：2026-10-10 UTC。🧪 适合学习有外部副作用的任务恢复；不用于生产执行、授权判断或 exactly-once 保证。**[经验：采用范围]**

## 运行与结果

本仓库原创的 Python 标准库实验，不联网、不调用模型、不安装 SDK、不执行真实发布。仓库根目录运行：**[经验：实现行为]**

```sh
python3 -m unittest discover -s experiments/recovery-outcome -v
python3 experiments/recovery-outcome/outcome_probe.py
```

14 个测试通过。子进程在模拟服务 SQLite commit 后、调用方回执写入前直接退出：盲重试产生 **2 次**副作用；精确查询认出已提交后只返回核对结论，保持 **1 次**。这是故意设计的故障模型，不是 OpenHands 的运行结果或模型质量收益。**[经验：离线实测]**

测试还覆盖发送前/回执后退出、查询不可用、陈旧空结果、旧请求仍在执行、授权撤销、参数冲突、已有重复结果及重复只读核对。`decide()` 是纯函数，不执行重试、不写成功记录、不实施权限检查。**[经验：实现与测试边界]**

## 上游到底修了什么

观察版本：[OpenHands/software-agent-sdk c4b9329](https://github.com/OpenHands/software-agent-sdk/commit/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9)，完整 commit 和所读文件的 Git blob SHA 见 [sources.json](sources.json)。**[一手：源码/API]**

- [#2298](https://github.com/OpenHands/software-agent-sdk/issues/2298) 报告旧匹配逻辑忽略 AgentErrorEvent，崩溃恢复后同一个工具调用被重派；[PR #2300](https://github.com/OpenHands/software-agent-sdk/pull/2300) 已于 2026-03-04 合并，merge commit 为 `5015e72c2ae5a05a33c2dc7fc144fc3e72754abf`。**这不是当前待修 bug。** **[社区：单例；一手：合并状态]**
- 当前 [state.py L677–716](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/openhands-sdk/openhands/sdk/conversation/state.py#L677-L716) 用 action_id 配对 Observation/UserReject，用 tool_call_id 配对 AgentError；[agent.py L714–723](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/openhands-sdk/openhands/sdk/agent/agent.py#L714-L723) 会先执行未匹配动作。但更外层 [event_service.py L1328–1371](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/openhands-agent-server/openhands/agent_server/event_service.py#L1328-L1371) 已在恢复旧 RUNNING 会话时改成 ERROR，必要时给首个未匹配动作写 AgentErrorEvent，闭合旧调用。不能只读内层就断言产品总会重跑。**[一手：当前实现]**
- [匹配回归测试 L227–260](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/tests/sdk/conversation/test_get_unmatched_actions.py#L227-L260) 构造 action + error，验证未匹配列表为空；[服务测试 L2239–2318](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/tests/agent_server/test_event_service.py#L2239-L2318) 用 mock 验证状态与错误事件。[恢复 benchmark L125–139](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/scripts/event_sourcing_benchmarks/bench_replay_and_recovery.py#L125-L139) 计时反序列化与未匹配扫描。这些检查不验证外部动作是否只发生一次。**[一手：测试范围]**

这里仅阅读上游源码和测试，未运行上游测试。探针只模拟业务副作用，**未实现 SDK 的 crash marker 或工具调用配对**。旧调用已闭合，仍不代表业务动作没提交；换一个 tool_call ID 重试同一业务动作也不会自然获得去重。**[经验：推论与实验范围]**

## 借鉴规则与限制

恢复时将外部结果分为三类：**确认已提交**则收集已有结果；**确认未提交且旧执行已结束**才考虑在当前授权内重试；**未知**则停下核对。动作标识须带目标/账户/任务范围并固定参数；冲突或多个匹配结果应调查，不能自行挑一个成功。适合补充恢复清单，不值得为简单只读任务新增状态框架。**[经验：设计建议]**

实验明确保留一个限制反例：查询时为空 → 另一个写者提交 → 原调用方按旧决定重试，最终仍是 **2 次**。这是顺序构造的确定性交错，不是并发压力测试。查询后重试有 TOCTOU；最终一致的空搜索结果也不能证明未提交。实际自动重试需要服务端原子幂等键、条件写入或等价保证，并核实键作用域、保存期与参数冲突规则。**[经验：实测反例与采用条件]**

`authoritative`、`quiescent`、`authorized_now` 是可信测试夹具提供的假设，程序不验证其真实性；不能让模型自报这些值就放行。只模拟进程退出：JSON 意图/回执未调用 fsync，不保证断电持久性；不覆盖网络分区、多副本一致性、真实服务或模型遵循率。14 项通过不等于任务完成率或生产力提高。**[经验：实现边界]**

## 许可

观察版本的上游 [LICENSE](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/LICENSE) 为 MIT，版权为 2026 OpenHands contributors。本目录探针和测试为原创，未复制上游实质代码或 prompts；若以后复制，应保留对应许可与声明。**[一手：许可；经验：本仓库来源说明]**
