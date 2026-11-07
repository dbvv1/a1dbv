# 协议迁移：固定旧／新客户端，再验构建产物

**🧪 MCP 协议升级先固定两代客户端，别用自动回退后的成功证明新版可用。** 本例接收官方 #5131 中 sequentialthinking 的既有差量：同一个 SDK 版本，旧入口只服务旧协议，换成 `serveStdio` 工厂后才服务两代。同一路线的独立读者又接收 Python time 双协议差量，负责人补完其原生验证，见下方。这些是公开真实迁移的固定版本复现，不是新的上游采用。

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

**依据**：[真实需求 #4852](https://github.com/modelcontextprotocol/servers/issues/4852)、[官方实现 #5131](https://github.com/modelcontextprotocol/servers/pull/5131)（2026-10-12 已合）；[固定 client-smoke 规则](https://github.com/modelcontextprotocol/servers/blob/7bb70f6f78acea1e986fe0c1f716304bb6bdcc2d/.claude/skills/client-smoke/SKILL.md)与 npm client 2.3.1 的 `VersionNegotiationMode` 类型。原项目代码按其[混合许可说明](https://github.com/modelcontextprotocol/servers/blob/7bb70f6f78acea1e986fe0c1f716304bb6bdcc2d/LICENSE)使用；本节复跑在来源仓库内生成补丁，未在本仓重发 sequentialthinking 源码。来源与单 server 复现核实 2026-11-07。

## Python time：接读者结果，再补完整原生验证

**Python 同样要固定两代 client，但选项写法不同：mcp 2.3.0 用 `mode="legacy"` 和 `mode="2026-07-28"`。** 不套 TypeScript 的 `{ pin: ... }`。启动项目真实入口；本项目以 editable 安装运行 `python -m mcp_server_time`，不需要 TypeScript 式重建，但须重启进程。原生 suite 另核已安装的 `mcp-server-time` 控制台脚本。

未参与页面写作的读者只照固定迁移答案与项目材料，接收 #5126 的 time 四文件差量，完成两代 stdio、基线固定新版失败、工具／输入契约及失败路径。其 Windows 缓存环境缺测试依赖，不能据此判完整通过；负责人在 Linux 用原锁文件独立补验。需 Git、uv、Python 3.12、Node／npm（coverage 及 pyright 需要）和公开 PyPI／npm 网络；固定项目声明 >=3.10，本次为 3.12.14，未测其 `.python-version` 的 3.10。

下面从含 `a1dbv/` 的父目录开始，另建副本，不复用上方已改过的 TypeScript 工作树：

```sh
git clone https://github.com/modelcontextprotocol/servers.git mcp-time
cd mcp-time
git checkout 2f8dc42931d96d083b45691a859619d45362713a
export UV_PYTHON=python3.12
cd src/time
uv sync --frozen --all-groups
uv run --frozen pytest
uv run --frozen python ../../../a1dbv/docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/probe-time-eras.py --project-root . --json-out baseline.json
cd ../..
git apply --check ../a1dbv/docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/migration.patch
git apply ../a1dbv/docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/migration.patch
cd src/time
uv run --frozen ruff check .
uv run --frozen ruff format --check .
uv run --frozen pyright
uv run --frozen pytest
uv build
node ../../scripts/coverage-py.mjs time
uv run --frozen python ../../../a1dbv/docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/probe-time-eras.py --project-root . --json-out candidate.json
git diff -- pyproject.toml uv.lock
```

基线探针 exit 1 只有在 **legacy 各项为真、新版 tools/list 是 -32602、原始 server/discover 是 -32601** 时才是预期拒绝；依赖缺失或普通启动失败不能算。候选应 exit 0，20 个断言为真；两代转换均为 UTC 12:00 → `Etc/GMT-5` 17:00／+5.0h，工具错误与 JSON-RPC 错误分别核对。日期取实际运行日。两代“重连”是新子进程的新连接，不代表同一运行实例的状态隔离。末条依赖 diff 为空。

2026-11-07 独立补验：基线 122／122、候选 133／133，零失败、错误或 skip；两侧格式、ruff、pyright、wheel／sdist 构建及原生 coverage gate 通过，各文件行／分支覆盖均 100%。原读者探针的摘要遗漏 legacy 断言等检查，接收时补齐并以 9 项回归测试防漏；原记录与后续云验分开保留。修订页仍须新读者照做，不提升读者地图评级。

**依据与完整结果**：[读者交付及接收说明](../../docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/result.md)、[双环境结果与命令](../../docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/verification.json)、[真实需求 #4853](https://github.com/modelcontextprotocol/servers/issues/4853)、[已合实现 #5126](https://github.com/modelcontextprotocol/servers/pull/5126)。原始四文件补丁遵循[上游许可](../../docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/SERVERS-LICENSE.txt)。未验 Windows 原生全套、Python 3.10、HTTP、其他 server、LLM 客户端、全仓发布门槛；未修改上游分支或部署。
