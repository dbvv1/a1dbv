# 接回压缩会话：fork 能写出，还要能完整读回

**🧪 自己用 Claude Agent SDK 做会话接续时，分别验 fork 产物和公共读取接口，再验两者串起来的结果。** 本次接回两个已有补丁：一个修 fork 后的压缩引用，另一个修读取保留消息。单独任一补丁都没完成本例的 fork→read；组合后，磁盘与内存 SessionStore 均取回预期的摘要、保留消息和后续消息。适用于 SDK 恢复器的接收验收；原生 CLI／模型接续仍待实际验证。

## 同一消费者为何需要两个实现

真实输入来自 #1419 的压缩会话 fork 引用失效，以及 #1411 的读取遗漏。固定当前 main `2146f9d8985513053e904b13200c8f744b36785a`（包版本 0.2.176），分别应用已有 #1420、#1412 的增量，得到 main、仅 fork、仅 read、组合四份源码。没有另写第三套修复。

**接旧 PR 只移植其增量，保留主干新能力。** #1412 基于较早版本；直接拿其整份 `sessions.py` 覆盖，会丢掉主干后来增加的 parallel-tool 返回恢复。本次两份原 diff 直接应用，保留该逻辑及其测试。

| 同一合成输入，disk／store 结果一致 | 读取原会话 | fork 后再读取 | fork 内已知压缩引用 |
|---|---|---|---|
| 当前 main | S、u3、a3 | S、u3、a3 | 仍指源 UUID |
| 仅 #1420 | S、u3、a3 | S、u3、a3 | 已重映射 |
| 仅 #1412 | S、u2、a2、u3、a3 | S、u3、a3 | 仍指源 UUID |
| 两项组合 | S、u2、a2、u3、a3 | S、u2、a2、u3、a3 | 已重映射 |

S 是摘要，u2／a2 是压缩时明确保留的消息，u3／a3 是后续消息；更早的 u1／a1 不在预期恢复范围。表中不是完整压缩前历史，也不是模型是否遵守约束的测量。四个观察进程都 exit 0，正确性由读回内容判断。

**来源**：[真实 fork 问题 #1419](https://github.com/anthropics/claude-agent-sdk-python/issues/1419)、[读取问题 #1411](https://github.com/anthropics/claude-agent-sdk-python/issues/1411)、[#1420 固定 head](https://github.com/anthropics/claude-agent-sdk-python/commit/c9fd2015343128825b4903414b8dc541885b070f)、[#1412 固定 head](https://github.com/anthropics/claude-agent-sdk-python/commit/7e532db9d8bd1aa2a36261261ab1f25237e657f7)。两 PR 仍开放，未合并；各 3 项托管 workflow 为 `action_required`，不是 CI 通过。核实 2026-11-02。

## 读者可复用的接收步骤

1. **先定恢复契约和输入。** 准备获准使用的最小会话，明确摘要、保留消息、截断点和源不可变要求；不要为了试验去取私人 transcript。本例只重建公开 issue 的合成布局。
2. **分别验写端与读端，再连起来验。** 磁盘路径调用 `fork_session()` 后对新 session ID 调 `get_session_messages()`；store 路径用同一 `SessionStore` 的 `fork_session_via_store()` 与 `get_session_messages_from_store()`。对照消息顺序、正文与新 UUID，不把文件存在或记录总数当恢复成功。
3. **检查截断没有偷偷带回排除项。** 只重映射已写入的记录；原本缺失的历史 ID、未知 metadata 和本次主动排除的 ID 分开处理。读回后再核源文件字节／源 store 对象未变。
4. **固定最终组合再跑项目门禁。** 依赖相同不代表实现可各自验收；本例每次在独立进程明确导入对应源码，防止 editable 安装默认指回基线。保留未通过与未运行项，不从两个 PR 各自测试通过推断组合可用。

完整 list、segment、两种 metadata 并存及无压缩对照均已实跑。partial-list 另使用公开评论提出的前向引用压力形状：保留列表包含截断点后的 u3，在 S 截断后，组合只读回 S、u2、a2，未带回 u3／a3；这不是对真实 CLI 产生该形状频率的判断。字符串 anchor 指向原本缺失记录的控制仍返回 S、u3、a3，组合没有修复坏源。

## 已验与未验

- Linux、Python 3.12.14、MCP 2.3.0；四次独立公共 API 消费于 06:07:40–06:07:43 UTC 完成。每组独立 HOME／配置目录，只读自建合成记录；源数据、正文和未知 metadata 均保留。
- 组合相关四测试文件 **356 passed**；完整 `tests/` **1,719 passed、6 skipped**。Ruff check、format check、mypy 均通过，原日志与投影见 [results.json](results.json)。未运行远端 store 服务、真实 CLI／模型恢复、取消、其他 OS；6 项跳过保留，不称完整 CI 通过。
- 非作者分别核源码增量、原协议式 API 返回和源不变条件。本实验不改原生压缩／新开会话的默认选择，也不提升上下文页的 🟡 状态。上游没有收到本次评论、补丁或 PR。

**依据**：[当前主干读取实现](https://github.com/anthropics/claude-agent-sdk-python/blob/2146f9d8985513053e904b13200c8f744b36785a/src/claude_agent_sdk/_internal/sessions.py)、[项目检查要求](https://github.com/anthropics/claude-agent-sdk-python/blob/2146f9d8985513053e904b13200c8f744b36785a/CLAUDE.md)，本仓合成数据公共 API 实跑与非作者证据审查，核实 2026-11-02。

完整固定源码、组合补丁与原消费者证据已保全：255 件、632,097 字节，SHA256 `7478706cce4f888e5e958d1041e0658a35e06b94a6da5c1ea89984fee16eed45`；基线 160 个 Git blob 逐字核对一致。公开页仅含结果投影，未上传会话文件或执行环境。
