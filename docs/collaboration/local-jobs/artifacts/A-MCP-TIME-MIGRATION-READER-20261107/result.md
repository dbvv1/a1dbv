# A-MCP-TIME-MIGRATION-READER-20261107 · Python time 双协议迁移接收

## 结论

**迁移可接收；真实读者任务做到真实 stdio 消费者与失败路径，原生异步测试和类型检查因环境缺依赖未验。**

- 必要差量只落在固定基线的 4 个 `src/time` 文件：`README.md`、`src/mcp_server_time/server.py`、`tests/test_protocol.py`、新增 `tests/test_eras.py`。
- `migration.patch` 可从固定基线重放；重放后的 `src/time` 与已有实现提交 `38fa696473ec9d83c87b470155693c174440c15d` 逐字一致（CRLF 归一后），说明没有整份替换、没有夹带其他文件。
- 真实 stdio 下，候选同时通过 2025-11-25 与 2026-07-28 两代固定客户端；基线只通过旧协议，固定 2026-07-28 客户端明确失败。原始 `server/discover` 在基线返回 `-32601`，在候选返回带 `supportedVersions`、`resultType`、`ttlMs`、`cacheScope` 的结果。
- 不能把本卡判成“原生测试通过”：`pytest-asyncio`、`freezegun`、`pyright` 在本机既有环境中不可用，异步测试与单测未跑；这部分如实列为未验。

## 输入与固定点

- 页面：`docs/decisions/migrations.md@65de22e9d1eae96ff7e68893f567a9ba546cf13a`，9628 字节，SHA-256 `0857615edf64dd7d75c12fdfeaf51fed64cd6092dee7c3eb0e2d95480cc95f73`，与任务预期指纹一致。
- 任务仓：`modelcontextprotocol/servers`，固定基线 `2f8dc42931d96d083b45691a859619d45362713a`，已有实现 `38fa696473ec9d83c87b470155693c174440c15d`（“feat(fetch,git,time): serve the 2026-07-28 era beside 2025-11-25”）。
- 产品范围仅 `src/time` 的上述 4 个文件；未改依赖、锁文件、CI 或其他 server。

## 环境与依赖来源

- 解释器：CPython 3.13.5（系统 `python`，未创建 venv）。
- 依赖来源：本机既有 uv 包缓存（未打包的 wheel 内容）通过 `PYTHONPATH` 只读使用；未安装、未下载、未同步、未改全局配置。实际解析版本：`mcp 2.3.0`、`mcp-types 2.3.0`、`anyio 4.15.1`、`httpx2 2.13.1`、`httpcore2 2.13.1`、`jsonschema 4.26.0`、`pydantic 2.13.4`、`pydantic-core 2.46.4`、`tzlocal 5.4.5`、`tzdata 2026.6`、`cryptography 50.0.2`、`cffi 2.1.1`。
- 这些版本与 `src/time/uv.lock` 的 pin 不完全相同（锁里是 `pydantic 2.12.5` / `pydantic-core 2.41.5` / `tzlocal 5.3.1` / `tzdata 2024.2` 等，缓存中没有这些精确版本）。这是“使用既有缓存”的取舍，已记录，不声称复现了锁文件环境。
- 服务端 `importlib.metadata.version("mcp-server-time")` 需要发行版元数据；由于未安装项目，只在任务临时目录放了一个最小 `mcp-server-time 2026.10.10` 的 `dist-info` 供解析，不冒充安装。

## 页面如何帮助选路

页面“按改动形状选路”表的第四行直接对应本任务：**“协议升级，要兼容两代客户端” → 分别固定旧／新协议，运行真实构建产物；已有实现只接目标 server 的差量**。因此采用：

1. 固定两代协议；
2. 先验基线消费者；
3. 只接 `serve()` 入口差量；
4. 重建候选；
5. 重跑相同消费者。

页面“自动协商成功：还要固定新版客户端”的顺序也被照做；没有只用 `auto` 证明新协议可用（`auto` 在基线上会回退到旧协议，不能说明 2026-07-28 被服务）。

## 必要差量与实现

- `server.py`：去掉 `from mcp.server.runner import serve_loop`，把 `serve_loop(...)` 调用替换为 `await server.run(read_stream, write_stream, options)`；注释改为双协议说明。
- `README.md`：新增 “Protocol versions” 一节，说明 2026-07-28 无会话发现与 2025-11-25 握手由客户端首个请求决定；开发测试说明加入 `test_eras.py`。
- `tests/test_protocol.py`：把“现代协议不应被服务”的旧预期改为 `server/discover` 的原始 JSON-RPC 结果断言（这是有意的协议预期变化，单列在 `verification.json`）。
- `tests/test_eras.py`：新增按 `mode` 固定的两代客户端测试。

## 真实 stdio 实测

服务端以 `python -m mcp_server_time --local-timezone UTC` 子进程启动，客户端用 `mcp 2.3.0` 的 `Client` 走真实 stdio，分别固定 `mode="legacy"` 与 `mode="2026-07-28"`。要点：

| 检查 | 基线 | 候选 |
|---|---|---|
| legacy 协商 | 2025-11-25，工具可用 | 2025-11-25，工具可用 |
| 固定 2026-07-28 | 失败：`tools/list` 得到 JSON-RPC `-32602` | 成功：2026-07-28，工具可用 |
| `convert_time` UTC 12:00 → Etc/GMT-5 | legacy 下 `17:00 +05:00`、`+5.0h` | 两代均 `17:00 +05:00`、`+5.0h` |
| 工具清单与输入契约 | legacy 可列出 | 两代逐字段相同；`get_current_time` 必填 `timezone`，`convert_time` 必填 `source_timezone/time/target_timezone` |
| 无效时区 `Nope/Nowhere` | legacy 下工具 `isError` | 两代均工具 `isError` |
| 缺 `target_timezone` | legacy 下工具 `isError`（Input validation error） | 两代均工具 `isError` |
| 未知工具 | legacy 下工具 `isError` | 两代均工具 `isError` |
| `ping` | legacy 可用 | legacy 可用；2026-07-28 为 JSON-RPC `-32601` |
| `resources/list` | 两代（基线仅 legacy 可测）均为 JSON-RPC `-32601` | 两代均为 `-32601` |
| 关闭连接后新连接 | legacy 可重连；2026-07-28 重连失败 | 两代均可重连 |
| 原始 `server/discover` | `-32601 Method not found` | 结果含 `supportedVersions=["2026-07-28"]`、`resultType="complete"`、`ttlMs=0`、`cacheScope="private"` |

失败分类：

- **JSON-RPC 错误**：现代 `ping`、两代 `resources/list` 均返回 `-32601`，没有当作执行成功。
- **工具 `isError`**：无效时区、缺参数、未知工具由服务端校验后作为工具结果返回，`result_type="complete"`。
- **进程失败**：`--local-timezone Nope/Nowhere` 退出码 1，stderr 单行错误、无 traceback，基线与候选一致。
- **连接级失败**：基线固定 2026-07-28 时 `tools/list` 抛 `MCPError -32602`（不是进程崩溃；服务端进程未退出），重连仍只服务旧协议。

日期取实际运行输出（2026-11-07），未硬编码上游运行日。

## 原生测试与静态检查

- `pytest 9.2.0`（既有缓存）：共收集 94 项。
  - `tests/test_entrypoints.py`：9 收集，7 通过，2 失败（1 项因缺 `pytest-asyncio` 的异步测试，1 项因项目未安装、找不到 `mcp-server-time` 控制台脚本）。
  - `tests/test_protocol.py`：74 收集，0 通过，74 失败，全部为 `pytest-asyncio` 缺失导致的 “async def functions are not natively supported”。
  - `tests/test_eras.py`：11 收集，0 通过，11 失败，原因同上。
  - `tests/test_server.py`：收集失败，`freezegun` 缺失。
  - 因此原生异步测试与单测是**未验**，不能算迁移回归，也不能拿 7 项通过替代双协议验收。
- `ruff 0.17.3`（缓存版本；项目 pin 的 0.8.1 不可用）：基线 14 条、候选 13 条，少一条 `SIM117`，无新增；`ruff format --check` 候选 7 个文件全部已格式化，退出 0。
- `pyright`：未跑，环境未安装，`npx` 会触发下载，按约束拒绝。

## 仓库检查

- `scripts/check_repo.py`：退出 0，912 个文件，无 Markdown 本地链接或 JSON/TOML 语法错误。
- `scripts/check_public.py`：对本次新增文件用临时 Git 索引做 `--staged` 扫描，`findings` 为空；返回 `incomplete` 仅因为仓库既有已跟踪的图片等二进制被文本扫描器跳过，与本次新增文件无关。另用人工规则核对新增文件，无本机绝对路径、个人邮箱或内网地址。

## 未验项

- 原生异步测试（缺 `pytest-asyncio`）与 `test_server.py`（缺 `freezegun`）。
- `pyright` 类型检查。
- 控制台脚本入口（项目未安装，改用 `python -m`）。
- 锁文件精确版本的依赖组合（只能用缓存中兼容的较新版本）。
- HTTP 传输、其他 server、TypeScript sequentialthinking、发布矩阵。
- 上游自报的 133 项测试不是本次实跑结果。

## 产物

- `docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/result.md`（本文件）
- `.../migration.patch`（标准相对路径 `src/time/...`，13184 字节）
- `.../probe-time-eras.py`（本次实际运行的双协议 stdio 探针）
- `.../verification.json`（输入指纹、提交、环境、两代实测、测试与静态检查）
- `.../SERVERS-LICENSE.txt`（上游仓库 LICENSE，含 MIT 段落，LF 归一）

完整原始运行日志保留在任务私有临时目录，未放入公开产物。
