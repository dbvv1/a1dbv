# Gemini CLI：尾窗恢复了诊断，完整报告仍要读 artifact

**结构化检查报告保留完整文件，再交给机器解析；后台日志尾窗只用于定位。** Gemini CLI 的真实 ESLint 消费者中，既有候选恢复了末尾诊断，但截断 JSON 仍无法解析，完整文件才能接住全部错误并完成修复、复测。
**🧪 #29978 可作为尾窗显示修复接收，不能替代完整报告。** 基线对超长单行返回空内容，还标为 `Full Log Output`；候选返回尾部并明确提示截断。
**本次仅验内部编译生产模块。** 使用自有合成项目和默认普通子进程入口，不启动 Gemini CLI／模型／PTY；[长程路线](../../docs/decisions/long-tasks.md)的默认与读者状态不变。

## 实际输入与结果

真实公开问题 #29944 报告大于 64 KiB 的单行日志丢失。本次不再手工填入进程历史：两版本分别通过 `ShellExecutionService.execute` 启动真实 ESLint，转到后台，再由 `ReadBackgroundOutputTool` 读取该进程日志。

独立消费者生成含 501 个未声明标识符的 JavaScript 文件，使用同一 `no-undef` 规则。ESLint 的 JSON formatter 自然生成约 103 KB 单行输出；同一份实际 formatter 结果同时写完整 artifact 与 stdout，没有预写期待日志或模拟文件系统。

| 验收项 | 基线 | 既有候选 |
|---|---:|---:|
| 实际单行日志大小 | 102,811 bytes | 102,816 bytes |
| 工具返回的正文 | 0 bytes | 65,535 bytes |
| 最后一个诊断可见 | 否 | 是 |
| 正文可解析为完整 JSON 报告 | 失败 | 失败 |
| 完整 artifact 解析出的错误数 | 501 | 501 |
| 根据完整报告修复后的真实 ESLint | 0 错误，exit 0 | 0 错误，exit 0 |

两臂报告大小差异来自各自文件路径长度，源文件与规则相同。修复程序只从实际完整报告提取未声明标识符、补入声明，再跑 ESLint；这是合成项目的诊断闭环，不是业务语义或模型改码质量评测。候选修复的是诊断可见性，完整 artifact 路线在两版都能完成任务。

短日志两版均能解析 1 个错误；空输出均显示 `Log is empty.`。使用另一个自有 session ID 读取同一 PID，两版均拒绝。没有读取真实会话、修改产品源码或发送上游评论。

## 接收后台结果时，本次实际分开核了什么

- **转后台**：固定版本的 `background()` 返回 `void`；真实 `handle.result.backgrounded === true` 且执行方式为 `child_process`。这个提前返回不是进程终态。
- **进程结束**：另核退出事件、历史记录 `exited` 和本 service 不再持有活跃进程。最初 lint 的 exit 1 原样保留，不能被外层观察程序 exit 0 掩盖。
- **日志完整可读**：退出后等待自有日志与 producer 完整 artifact 逐字节相等，才读取工具。源码退出路径没有等待日志 stream 收尾，因此退出事件单独不足以证明 flush；本次也没有声称观察到底层 stream close。

固定版本仍只读取最后 64 KiB。需要完整 JSON、完整诊断集合或可审计原输出时，不能把尾片段接给完整报告解析器。正在写入／被截短日志、短读、PTY、Windows／macOS与整机后代清理未在本次消费者中验证。

## 检查与来源

固定基线 `363a131`、候选 `40e67bf`，差量仅读取工具及其测试两文件；核查时 main `6814e00d` 的读取实现仍与基线一致。Linux、Node 24.22.1、npm 11.9.0；锁定依赖安装忽略生命周期脚本，代码为 Apache-2.0。

- 两版 core／test-utils 构建通过；读取工具、shell service、lifecycle 三个文件共 **123 → 129 测试通过**，无失败或跳过。候选两文件 ESLint／Prettier 通过。
- 首次安装遗漏已配置 CA 环境变量而遇 TLS 错误；中断后保留既有 CA 重试，未关闭证书验证。首次误序先构建 test-utils 失败；按项目构建入口的 generate → core → test-utils 顺序修正。原始失败保留在结果记录，未改源码或依赖来抹平。
- 没跑全仓 preflight、完整 CLI 或模型端到端。上游固定 head 的功能 CI／E2E 为 `action_required`，评估为 `waiting`；其他成功检查不补成整套通过。

原输入、输出、精确版本与本地保全摘要见 [results.json](results.json)。原始归档仅在工作区保全，没有随本页公开。

**依据**：[真实使用问题 #29944](https://github.com/google-gemini/gemini-cli/issues/29944)、[既有补丁与作者／独立参与者讨论 #29978](https://github.com/google-gemini/gemini-cli/pull/29978)、[固定读取实现](https://github.com/google-gemini/gemini-cli/blob/40e67bf26995100ca55bc5c762fb28f07f27b266/packages/core/src/tools/shellBackgroundTools.ts)、[固定执行生命周期](https://github.com/google-gemini/gemini-cli/blob/40e67bf26995100ca55bc5c762fb28f07f27b266/packages/core/src/services/executionLifecycleService.ts)。本轮为该真实问题的定向源码／使用反馈与独立消费者比较，未覆盖其他社区或声称当前最高水平；核实 2026-11-02。
