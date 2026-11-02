# 字符串没有原样到服务端：接回两个 CLI 的修复

**🧪 对这类跨入口参数缺陷，先固定协议含义，再分入口实现，最后由非作者运行构建产物核服务端实际收到什么。** 本次沿[长程路线](../../docs/decisions/long-tasks.md)处理 Inspector 的真实公开问题：同一个 prompt 参数在 one-shot CLI 和 mcpdo 都经过 JSON 解析，价格格式、超安全整数和空值会改变。共享 parser 与两入口接入已完成；Linux one-shot CLI 的限定消费者通过，项目完整门禁未通过，因此不是可发布的 Inspector 修复，也不改变长程页 🟡。

需要在自己的 Agent 任务中重用这个边界，可复制[实施与验收任务](task.md)。它是从本次结果整理的新任务模板，不是原始生成对话，不应冒充上游要求的“实际使用的 prompt”。

## 决定修在哪里

**prompt 值是字符串；工具参数与 metadata 仍然是 JSON。** 修复只将两个 `--prompt-args` 接到共享的文本 parser：按第一个 `=` 分隔，允许空值，保留后续等号、空白和字面引号，多次同键仍以后值为准。程序化 `getPrompt` 的兼容转换不改，不能为了修 CLI 一并改变其他调用者。

真实输入来自 [Inspector #2859](https://github.com/modelcontextprotocol/inspector/issues/2859)，而不是新造的待办。固定基线为 [`4fe3d9cc`](https://github.com/modelcontextprotocol/inspector/tree/4fe3d9cc5db17367e9e645ee05f707daf154267e)，Inspector 2.13.0、Linux、Node 24.22.1、npm 11.9.0。检查时 issue 仍开放，未分配维护者，关联编号及 `prompt-args` PR 搜索未发现对应开放修复；这不是上游已接受实现的证据。

**依据**：[官方协议](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts)规定 prompt arguments 是字符串映射；[真实使用反馈](https://github.com/modelcontextprotocol/inspector/issues/2859)报告了 `1.50`、指数形式及整数精度损失；[开源实现](https://github.com/modelcontextprotocol/inspector/blob/4fe3d9cc5db17367e9e645ee05f707daf154267e/clients/cli/src/cli.ts)及 mcpdo 的同名入口都先 JSON 解析。核实 2026-11-02。

## 实际接回与消费者结果

**分工只拆不同入口，协议契约由主线保留。** 主线写共享 parser、one-shot CLI 与相应回归；另一实现者只写 mcpdo 接入和参数层回归，交回后停止写入。主线核实际 diff、原失败和受检文件再整合，非作者审查七文件差量，并使用同一个独立脚本分别运行旧版与候选二进制。

消费者不是 import `runCli()` 的单测：它启动构建后的 CLI 子进程，让 CLI 再启动真实 stdio MCP 服务，比较服务端收到的 JSON-RPC 参数与 CLI 回显。服务只处理合成输入、无模型和账号；raw 协议回显器用于观察接收边界，不宣称验证完整服务器规范。

| 同一输入 | 原版实际收到／结果 | 本地候选实际收到／结果 |
|---|---|---|
| `price=1.50` | 字符串 `1.5` | 字符串 `1.50` |
| `price=1e3` | 字符串 `1000` | 字符串 `1e3` |
| `price=9007199254740993` | 字符串 `9007199254740992` | 原字符串 |
| `price=1e400`、`price=` | 拒绝，未发 prompt 请求 | 原字符串／空字符串 |
| 字面引号、带空格 JSON 文本、空白、Unicode、后续 `=`、重复键 | 部分值被改写 | 普通命名字段逐值一致 |
| 缺 `=`／空 key；工具数字和布尔 | 拒绝；保持 JSON 类型 | 同样通过 |
| `__proto__` 作为参数键 | 既有转换层丢键 | **仍失败，未修** |

完整的去路径输入、实际 wire 值及判定在 [wire-results.json](wire-results.json)：one-shot CLI **8 通过／11 失败 → 18 通过／1 失败**，不是“19 项全过”。候选的唯一失败是上表特殊键控制；不把普通字段的值保真外推为所有键都支持。未验证 Windows shell 的引号传递。

## 门禁和停止边界

**限定消费者通过不能覆盖项目失败。**

| 检查 | 实际结果 |
|---|---|
| one-shot CLI 新回归＋共享 parser | 原入口回归 9 失败／7 通过；修复后合计 28／28 通过 |
| mcpdo Commander → dispatch，daemon 边界 stub | 原 19 例中 15 失败／4 通过；修复后 19／19。失败数包含诊断措辞断言，不是独立用户故障数 |
| 两个 CLI 的 format、lint、typecheck、build | 通过；安装新鲜度检查通过 |
| one-shot CLI 完整 coverage 命令 | **exit 1**：786 通过、8 失败、2 skipped，共 796；八项为 `cli.test.ts` 的 roots、配置 header、logging、HTTP 路径 10 秒超时，未生成覆盖率通过证据 |
| 原版八超时对照 | 独立、未修改的同基线运行 `npm test --prefix clients/cli -- cli.test.ts`（实际匹配 2 文件）：55 通过／8 失败，失败名称逐条相同；证实修复前也发生，**没有定位根因** |
| mcpdo 构建二进制真实连接 | **exit 4，Unix socket `listen EPERM`**；已停止该路径，未换通道重试，不能用 stub 结果填补 |
| 项目 `local:gate` | 未运行：包含上述受阻 mcpdo 路径；没有把部分检查当完整 gate |

两次检查的命令与相同失败名见 [gate-comparison.json](gate-comparison.json)。原版对照只覆盖该文件过滤范围，不是原版全套 coverage。

源码未对上游发布。本地已保全完整基线与候选源码归档、差量、原始输出和消费者证据；公开记录只保留去路径观察，不附原始环境日志。候选 tree `9a699418c95a1659e349eb770d3200a20c2cf68b` 是本地 Git 对象标识，不是可点击的上游提交。

本例说明“先约定共享含义、单写者交回、整合后验真实入口”确实走到了普通 prompt 值的消费者；没有比较单作者与多代理的时间收益，也未通过完整开发路线门槛。

**依据**：本次云端原始回归、构建与独立消费者运行，2026-11-02；[上游投稿政策](https://github.com/modelcontextprotocol/inspector/blob/4fe3d9cc5db17367e9e645ee05f707daf154267e/CONTRIBUTING.md)只接受 issue／实际生成 prompt，不接受外部 PR 或 diff。没有向其评论、提 PR 或代维护者修改 board；后续仍应按最新政策，而不是把本地候选视为已被接收。
