# FastMCP：目录可读，不代表工具返回的资源链接可用

**🧪 接收组合 MCP 服务时，照工具实际返回的 ResourceLink 取上下文，再完成下游任务。** 本次两个 namespace 的资源目录都正常，工具也返回成功，客户端跟链接却找不到资源；不能用“目录看得见”代替这一步。当前主干上的本地整合候选修复了链接，但首次独审又发现 raw 结果字段丢失，补修后才接收。

## 接收已有修复，而非照搬旧 PR

FastMCP 约 2.83 万 Star，Apache-2.0。[用户 #4154](https://github.com/PrefectHQ/fastmcp/issues/4154)报告：Namespace 改写资源目录和读取路由，却保留 `tools/call` 中的上游 URI。维护者关闭了专用 wrapper 的旧方案，要求通用结果转换能力，避免接管 task、middleware 和 tracing 的执行细节。

[既有 Draft PR #4845](https://github.com/PrefectHQ/fastmcp/pull/4845)沿这一方向修复。它的旧基线与本次 main 已相差 940 文件；补丁在两处不能直接应用，协作者也已要求 rebase。因此本次在固定 main `588297eb53c00d8a60291b05d4315fe753355c10` 上整合，保留新的 URI 与异常处理行为，而不是把旧 PR 通过当作当前可采用。未向上游发代码、评论或新 PR。

## 同一个真实 stdio 消费任务

两个自有上下文服务分别挂在 `alpha`、`beta`，内部都提供 `resource://spec`，外层没有同名兜底资源。非实现者通过真实 stdio 客户端列工具／资源、调用工具，再把**返回的 URI 原样传给 `read_resource`**。子服务是 in-process mount；不是两个远程服务的代理测试。

| 消费步骤 | 当前 main | 最终本地候选 |
|---|---|---|
| 按目录 URI 读取两个资源 | 都成功 | 都成功 |
| 工具返回 ResourceLink | 两个均为旧 `resource://spec` | 分别为 `resource://alpha/spec`、`resource://beta/spec` |
| 按返回链接实际读取 | 两次 `Resource not found` | 两份 JSON 正确 |
| 用读回配置完成代码任务 | 停止，没有借目录阳性绕过坏链接 | 固定 JS 模板由真实 Node 执行，分别输出 `42`、`63` |
| 缺资源错误后，在同一客户端上下文继续 | 正常读与工具调用可继续，链接仍旧 | 正常读与调用可继续 |

配置只含本次自编的操作类型和有界整数，客户端检查后才代入固定模板；不执行资源中的任意代码，也未接模型。两版均退出客户端并关闭 transport，原服务 PID 确认不存在；SDK 未提供服务退出码，未据此填成 exit 0。

## 独审使首个“成功候选”再修一次

首版移植已完成上表的普通配置任务，157 项相关测试也通过。但非作者另走公开 `call_tool`，发现 Namespace 重建 `ToolResult` 时丢掉原 raw `CallToolResult`：SDK 支持的开放 `result_type` 和显式子类字段消失。普通未知 JSON extra 在 SDK 输入验证时就会被丢弃，不能拿它冒充这个回归。

最终小修复制原 raw 模型、只替换 content；新回归先在首版失败，再核最终候选的 URI、结果类型、子类字段和原输入不变。**158 项相关测试通过**；独立 installed-wheel 探针复核 raw 结果、普通 content／structured／error／meta、无链接及 InputRequired 的直接身份保持。由于生产代码变更，另补最终候选的完整 stdio 消费；旧两臂未覆盖或重跑。没有把直接 InputRequired 检查写成完整多轮交互通过。

## 能采用什么，仍缺什么

可采用的是这条接收判据：**资源目录、工具结果与实际消费必须指向同一对象；改链接时还要保留结果封套。** 本次不是通用 MCP 升级建议。EmbeddedResource、structured-content 内任意 URI、远程 HTTP／proxy、完整任务与 MRTR 生命周期未由这条消费者覆盖；现有默认和读者状态不变。

环境为 Linux、Python 3.12.14、当前源码构建版 `0.0.1.dev1+588297e`，不是正式发布版本。按当前锁文件安装非 editable wheel，149 项外部依赖相同；最终 FastMCP 与 tasks 共 292 个生产 Python 文件与固定树一致。7 个改动文件 Ruff lint／format、正确工作区路径的 ty 通过。初次 ty 混用 installed 与源码，29 项诊断；轮子重建后仍有 23 项同名类型解析冲突，指定工作区搜索路径后通过。loq 两版均有 36 项超长，相关两个文件本次各增一行，阈值未放宽；未运行完整 prek／gitleaks 或全套平台矩阵。

原 PR 仍 Draft，所读 head 的历史 `Tests` 和静态工作流为 failure，jobs 返回空，原因未获证；本地整合树没有托管 CI。原补丁应用失败、首版缺口、修复和所有实际回执均已在云端保全，源码对象恢复校验通过，未公开原始档案。固定树、时间、检查及哈希见 [results.json](results.json)。

**依据与核实**：[原问题及维护者方向 #4154](https://github.com/PrefectHQ/fastmcp/issues/4154)、[旧方案 #4156](https://github.com/PrefectHQ/fastmcp/pull/4156)、[现有候选与 rebase 要求 #4845](https://github.com/PrefectHQ/fastmcp/pull/4845)、[固定主干 Namespace](https://github.com/PrefectHQ/fastmcp/blob/588297eb53c00d8a60291b05d4315fe753355c10/fastmcp_slim/fastmcp/server/transforms/namespace.py)、[原 raw 结果契约](https://github.com/PrefectHQ/fastmcp/blob/588297eb53c00d8a60291b05d4315fe753355c10/fastmcp_slim/fastmcp/tools/base.py)，核实 2026-11-02。
