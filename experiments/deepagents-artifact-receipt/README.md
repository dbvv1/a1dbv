# Deep Agents：把模型可读文本与程序可读原件分开接收

**🧪 程序还要解析工具输出时，接完整数据，不从模型展示文字里猜 JSON。** Deep Agents 的既有候选提供按调用 ID 显式请求的 raw artifact；本次真实 ToolNode 消费中，基线的窗口标题让 JSON 解析失败，候选接回原字节后生成并读回正确汇总。
适合需要跨工具读取结构化文件的 SDK 开发者；这是未合候选的限定试用，不是要求现有 Agent 全部换框架。
`max_bytes` 只控制返回的 artifact 大小，后端先读完整文件；artifact 也不等于不留存，traces、消息状态或 checkpoints 仍可能持有内容。

## 实际接住了什么

公开使用者提出：持久化昂贵工具结果后再读 JSON，工具为模型加的展示格式会妨碍解析。本次接收已有 PR，不另写补丁；把同一份自有订单 JSON 交给真实 `FilesystemBackend` → `FilesystemMiddleware` → 同步 `StateGraph/ToolNode` → `ToolMessage`，再由固定 Python 消费者解析字段、计算并写出纯 JSON 汇总。没有调用模型或执行文件中的代码。

| 同一输入／入口 | 基线 | 候选 |
|---|---|---|
| 224 字节、16 行订单 JSON | `read_file` 报 success，但 content 带 `@@ lines` 标题；直接解析失败，没有汇总 | artifact 原字节一致；解析后生成并独立读回 **5 件、3700 分**及全部预设字段 |
| 限额恰好 224／少一字节 223 | 不支持该 raw 请求，仍返回展示文字 | 224 成功；223 返回 `file_too_large`，artifact 不含原字节 |
| 20 字节，含 CRLF、NUL 与非 UTF-8 | 返回解码错误 | 全部字节一致 |
| 缺文件后，继续使用同一图／middleware | 错误后可正常读文件，但仍是展示文字 | `file_not_found` 后下一次原件读取成功 |
| 错调用 ID／不请求 raw | 原文字、无 artifact | 与基线文字一致、无 artifact |
| deny 路径／指向该路径的自有 symlink | 拒绝读取 | `permission_denied`，不携带文件字节 |
| `ls`／`glob` | 展示文字 | 另附过滤后的 typed entries／paths；本例 `truncated=false` |

两次进程都 exit 0，表示测量结束，**不表示基线业务任务成功**。消费者每臂 11 次调用，输入哈希前后不变；没有剥掉标题来把基线补成成功。另跑候选原有 45 个 raw 用例，以及双方各 249 个相邻文件工具／权限用例，全部通过；候选三个变更文件的 Ruff／格式和整个 SDK 的类型检查通过。

## 接回同类结果时看哪里

本次沿用了[长程路线的完整产物验收](../../docs/decisions/long-tasks.md#交出去什么收到后核什么)：不仅核工具 success，还让后续消费者真的解析、产出并读回结果。与 [Gemini CLI 的尾窗／完整报告对照](../gemini-background-output/README.md)合看，终端尾窗、分页文本和完整机器数据应分别验收；不以“能看见内容”代替“下游能用”。

候选的 raw 请求位于 runtime config，并绑定一个 `tool_call_id`，不是工具参数或新授权凭证。原件读取沿用路径与 deny 检查；它忽略 `offset/limit`。普通文字路线保持不变，不能把这次结果概括为所有后端、人工审批或所有 Agent 的兼容保证。

## 固定范围与未覆盖

- 仓库 MIT；观察时 30,899 Stars，热度只用于选题。SDK 版本字符串两版均为 0.7.32，必须看固定源码，不能据此认为已发布版本包含候选。
- Linux、Python 3.12.14；两臂独立 noneditable 安装，54 个外部依赖版本一致；每臂 57 个 SDK Python 文件与源码、构建 wheel 三方逐字核对。比较限 SDK 三文件；整仓两个提交之间还存在其他包的历史差量，没有执行它们。
- 消费者不含完整模型循环、QuickJS、外部服务、HITL、真实 traces／checkpoint 保留验证或其他操作系统。作者 45 个用例含异步工具与图路由；这不把独立消费者扩大为异步业务通过。没有跑整仓全套。
- 精确候选 head 的托管检查为 **71 成功、5 跳过**，17 个 workflow 为 14 成功、3 跳过；PR 仍开放、未合。本仓路线仍 🟡，不新增读者通过或通用默认。

**依据**：[使用者原需求 #3897](https://github.com/langchain-ai/deepagents/issues/3897)、[既有 PR #7431](https://github.com/langchain-ai/deepagents/pull/7431)、[固定源码的 raw 契约及保留说明](https://github.com/langchain-ai/deepagents/blob/2f5d477c4dc01af5deb9493b213a02cc986c4518/libs/deepagents/deepagents/backends/protocol.py)、本次实测投影 [results.json](results.json)，核实 2026-11-02。原需求还涉及代码解释器，本次只验证独立 SDK 文件数据通道，不声称解决其完整流程。
