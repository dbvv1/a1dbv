# DeepSeek Superagent：把收到输入和完成任务分开

**🧪 值得借的是任务状态设计，不是默认部署整套宿主。** 已有异步子代理或检查回传时，区分原任务授权、输入是否读入、这次执行是否结束与目标是否验收，可以避免重复接单和过早报完成。普通几步编辑仍用原生连续任务；本次没有证明引入编排平台更快或更省。

## 这次实际接了什么

用官方 `Engine` 与 SQLite `Store` 接收本仓固定版本的交付检查，独立本地适配器实际执行 `check_repo.py` 和 `check_public.py`，再读原始输出决定报告。任务判断是预先固定的人工 assessment，不是模型自主判断；消息身份、相关线程和中断均为合成控制输入。

| 要分清的事 | 实际对照结果 |
|---|---|
| 同一请求到达多次 | 同一 trigger 在重开数据库前后重投，仍只有一个主 Ticket；恢复产生第二个 assignment，不是第二次接单 |
| 相关内容与原任务授权 | context-only 消息带扩权、执行命令的文本，仍只记作上下文，原 mandate 未变；适配器仅执行固定 argv |
| 主线与执行者谁接追问 | 执行者仍拥有的追问不能由主线再次 accept；handback 后才产生新候选，本次明确 ignore |
| 已投递与已读入 | 已投递的输入仍可是 `readAt: null`；由适配器明确记录读入，不代表模型确实理解了内容 |
| 回合结束与目标完成 | `turnEnded` 后 Ticket 仍开；实际检查及回执核验完成后，显式 ready 才结束 |
| 恢复输入与重做操作 | 关闭 SQLite、结束进程后重新打开，再由适配器显式报告人工注入的 assignment 中断；只重排未读 trigger，另带恢复提示，已读输入不重排 |

正常检查分别核了 662 个文档／配置文件和 1120 个公开文件，均通过。恢复后适配器复核已保存输出的哈希，没有重跑这两项命令。另在隔离副本放入合成坏 JSON，真实检查 exit 1；适配器报告 failed，核心拒绝为该 Ticket 生成结果回复。坏文件移出后，固定消费树恢复干净。这不是原 main 的缺陷。

三个 Node 进程均正常结束，SQLite 完整性检查为 `ok`。成功结果重复入本地 outbox 只保留一条 pending 记录；没有发送器或外部发送。原项目 core、Store、Policy、admission-context 四模块共 462 测试通过，未运行完整 `pnpm check`。精确输入、时间与结果见 [results.json](results.json)。

## 怎样用于已有长程路线

**保留原任务，只给执行和输入各自记状态。** 本次接收用的是下面这组事实，而不是把一个 `running` 或“已回传”字段当作验收：

| 记录对象 | 本次验收所需事实 |
|---|---|
| 原任务 | 固定目标版本、允许执行的检查、不能扩大的范围 |
| 每条输入 | 稳定 ID、相关上下文还是原任务追问、投递与读入状态、当前接收者 |
| 每次执行 | assignment、实际开始／结束、原始输出、退出码；执行中断不抹掉原结果 |
| 最终交付 | 谁核过哪些产物、失败与未验项；外部动作另读实际落地状态 |

这补强[长程路线的接回验收](../../docs/decisions/long-tasks.md#接回之后走到当前目标的终点)，不替换其原生协调默认，也没有新增完整路线读者通过。

## 不应从这次结果推出什么

**核心相信执行适配器的报告，不替你证明 ready。** 本次坏 JSON 的失败判定和旧结果复用由适配器完成；core 的未读输入重排不是外部操作 exactly-once。SQLite 的有序关闭重开也不是断电、发送成功后未落账或并发宿主的完整恢复验证。

官方公开的是 MIT 研究原型，不是正式产品，且与文章中的系统不完全相同。真实宿主为会话设置 `danger-full-access`；目录和命令包装器不是 OS 权限边界。本次只运行领域核心与存储，未启动 DSH 宿主、模型、来源账号或后台调度，不能据此直接接入真实账户。来源身份可信度、模型判断范围、成本与跨平台表现仍未验证。

**依据**：[官方原型与定位](https://github.com/deepseek-ai/dsh-superagent-prototype/tree/6337fc823ce20251c8de8085948165c81aaa701e)、[授权设计](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/docs/002-authorization.md)、[执行设计](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/docs/003-execution.md)、[架构与未定信任问题](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/6337fc823ce20251c8de8085948165c81aaa701e/docs/007-architecture.md)。机制逐项对照实际源码并做上述本地消费者；这是用户指定项目的定向核验，未取得独立社区生产使用对照，不宣称最佳编排方案。核实 2026-11-02。
