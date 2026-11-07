# 协议迁移：固定旧／新客户端，再验构建产物

**🧪 MCP 协议升级先固定两代客户端，别用自动回退后的成功证明新版可用。** 本例接收官方 #5131 中 sequentialthinking 的既有差量：同一个 SDK 版本，旧入口只服务旧协议，换成 `serveStdio` 工厂后才服务两代。它是公开真实迁移的固定版本复现，不是新的上游采用。

## 在独立副本复跑

需 Node 22、npm、Git、公开 npm／GitHub 网络；实跑为 Linux、Node 22.23.2、npm 11.9.0，锁定的 SDK client/server 均为 2.3.1。准备同层目录 `a1dbv/`（本仓）与 `mcp-servers/`；命令从它们的父目录开始。只用公开合成 thought，不需要模型、真实账号或业务数据。

```sh
git clone https://github.com/modelcontextprotocol/servers.git mcp-servers
cd mcp-servers
git checkout c32f931c53f21d6b9623b47330640ac5afb4de93
npm ci --ignore-scripts --no-audit --no-fund
npm run validate -w src/sequentialthinking
node ../a1dbv/experiments/mcp-protocol-migration/probe-built-eras.mjs . baseline
```

基线消费者应给出：旧协议两次独立连接各有 `history: [1, 2]`，缺参数被拒；固定 `2026-07-28` 的新版连接抛 `ERA_NEGOTIATION_FAILED`，明确没有提供该版本。脚本只接受这项特定拒绝，安装、构建、断言或普通连接失败都不能算预期结果。

已有官方实现，所以只接收本 server 的源码、测试、说明和 changeset，不移植另三个 server 或改依赖：

```sh
git diff c32f931c53f21d6b9623b47330640ac5afb4de93 7bb70f6f78acea1e986fe0c1f716304bb6bdcc2d -- \
  src/sequentialthinking .changeset/sequentialthinking-modern-era.md > ../sequentialthinking-modern.patch
git apply --check ../sequentialthinking-modern.patch
git apply ../sequentialthinking-modern.patch
npm run validate -w src/sequentialthinking
npm run coverage -w src/sequentialthinking
node ../a1dbv/experiments/mcp-protocol-migration/probe-built-eras.mjs . candidate
git diff -- package.json package-lock.json
```

候选消费者应给出四次成功：`legacy`／`modern` 各两次，均 `[1, 2]`，缺参数仍被拒。每次连接都重新启动真实 `dist/index.js`，因此也核到了新连接不继承上轮历史。最后的依赖 diff 应为空。原生 suite 还核进程内连接隔离、新版 wire 字段和不支持的协议版本；构建后再测试，避免 stdio smoke 因缺产物而 skip。

**SDK 与 Inspector 的选项别混用。** Inspector CLI 的 `--protocol-era modern` 对应本例 SDK 的 `versionNegotiation: { mode: { pin: "2026-07-28" } }`，不是字符串 `mode: "modern"`。`auto` 可回退到旧协议；验证迁移时必须核实际 era。脚本既固定版本又断言返回 era，前版失败与后版成功使用同一消费者。

## 验证范围

2026-11-07 实跑：基线 101 项、候选 107 项均通过且无 skip；两侧格式、lint、类型与构建通过，候选原生 coverage 命令通过；上述真实 stdio 消费者通过。未跑全仓 `local:gate`、其他 server、HTTP、LLM 客户端、原生 Windows 或发布矩阵，不向上游投稿，也不改产品默认。

**依据**：[真实需求 #4852](https://github.com/modelcontextprotocol/servers/issues/4852)、[官方实现 #5131](https://github.com/modelcontextprotocol/servers/pull/5131)（2026-10-12 已合）；[固定 client-smoke 规则](https://github.com/modelcontextprotocol/servers/blob/7bb70f6f78acea1e986fe0c1f716304bb6bdcc2d/.claude/skills/client-smoke/SKILL.md)与 npm client 2.3.1 的 `VersionNegotiationMode` 类型。原项目代码按其[混合许可说明](https://github.com/modelcontextprotocol/servers/blob/7bb70f6f78acea1e986fe0c1f716304bb6bdcc2d/LICENSE)使用；复跑在来源仓库内生成补丁，未在本仓重发上游源码。来源与单 server 复现核实 2026-11-07。
