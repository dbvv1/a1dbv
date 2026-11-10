# Qwen Code：保留工具发现失败的原始诊断

🧪 候选补丁，尚未提交上游。MCP 初始化成功而 `tools/list` 失败时，保留服务器原始错误，让 CLI 重连提示能指出故障，而不是误报“没有工具”。仅保存于候选分支，不作为答案页采用证据。

## 复现与核验

基线：[`QwenLM/qwen-code@41ffb223448847b4c8ea2a1e9b463650095b2890`](https://github.com/QwenLM/qwen-code/tree/41ffb223448847b4c8ea2a1e9b463650095b2890)。在该提交的干净副本执行 `git apply --check --unidiff-zero fix.patch`，再以 `git apply --unidiff-zero fix.patch` 应用补丁。按上游锁文件安装依赖，运行官方 `npm run build -- --cli-only`，不要跳过测试的构建前置检查。

定向回归入口（仓库根目录执行）：

```sh
cd packages/core
../../node_modules/.bin/vitest run src/tools/mcp-client.test.ts \
  --coverage.enabled=false --maxWorkers=1 \
  -t 'diagnostic|keeps optional missing tools method|keeps usable prompts after|all-collision server|discoverAndReturn throws "No prompts or tools found" when both empty|undefined tools'
```

实际协议复现条件：使用一次性 stdio JSON-RPC 服务器，`initialize` 返回协议 `2025-06-18`、`capabilities.tools = {}`；`tools/list` 返回错误 `-32603`、消息 `DIAGNOSTIC_FIXTURE: tool catalog unavailable`；其他未实现方法返回 `-32601`。将其配置为一次性工作目录的 MCP 服务器，运行构建产物 `node packages/cli/dist/index.js mcp reconnect --all`。无需真实模型、账号或远端 MCP。

| 路径 | 原始模块 | 补丁后 |
|---|---|---|
| SDK 真实 stdio：工具发现错误 | 通用空服务器错误 | 保留 `DIAGNOSTIC_FIXTURE` 错误 |
| SDK 真实 stdio：空工具列表 | 通用空服务器错误 | 不变 |
| SDK 真实 stdio：一个正常工具 | 连接成功，发现 1 个工具 | 不变 |
| 编译后的 CLI：错误／空／正常 | 未运行基线 CLI | 退出码分别为 1／1／0；错误提示保留原始原因 |

2026-11-10 已运行：定向测试 11 通过、174 未选中；官方 CLI 构建、修改文件 ESLint、Prettier 和补丁空白检查通过。独立审查覆盖错误对象、字符串、`undefined`、可选方法缺失、可用 prompts、重复工具回归及两个调用入口。现代协议分支只有单元测试，真实 stdio 使用上述旧协议版本。

## 去向与边界

下一步由 dot-A 补验上游完整 preflight 所缺范围，再按当前贡献规范决定投稿或放弃。此前 Unix socket 测试被执行环境拒绝，本候选未重试该动作；不把定向测试当完整 preflight。未验证真实第三方 MCP、现代协议端到端、基线 CLI 或当前答案页的新读者验收。重连命令属于独立 CLI 进程，不证明已有交互会话恢复。

问题背景：[上游 #15741](https://github.com/QwenLM/qwen-code/issues/15741)；[#15757](https://github.com/QwenLM/qwen-code/pull/15757) 已处理重复工具名，本补丁只处理剩余发现错误的诊断丢失，不重复其修复。补丁来自 Apache-2.0 项目，保留上游文件上下文与归属；来源与实测核对日期：2026-11-10。
