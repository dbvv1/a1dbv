# 新读者记录 · A-MCP-TIME-MIGRATION-READER-20261107 · u1

角色：第一次读 `docs/decisions/migrations.md@65de22e9d1eae96ff7e68893f567a9ba546cf13a` 的读者。只照任务给出的页面全文与任务自身源码操作；未读 a1dbv 的其他文档、作者实作日志、其他读者报告或同主题教程，未替作者改页面。

## 做到哪一步

**迁移做到可接收，读者任务做到真实 stdio 两代消费者；原生异步测试、单测和 pyright 因环境缺依赖未验。**

1. 核对页面输入：从 GitHub 取固定提交的原文件，9628 字节，SHA-256 `0857615edf64dd7d75c12fdfeaf51fed64cd6092dee7c3eb0e2d95480cc95f73`，与任务预期一致。
2. 取任务仓固定基线 `2f8dc42931d96d083b45691a859619d45362713a` 与已有实现 `38fa696473ec9d83c87b470155693c174440c15d`，放在工作树之外的独占临时目录。
3. 只接 `src/time` 的 4 文件差量，生成 `migration.patch`（13184 字节）；在全新基线上重放，结果与已有实现逐字一致（CRLF 归一后）。
4. 用同一 CPython 3.13.5 与既有 uv 缓存依赖，跑真实 stdio 探针：`python -m mcp_server_time --local-timezone UTC` 子进程，分别固定 `legacy` 与 `2026-07-28` 客户端，比较基线与候选。
5. 候选通过全部检查：两代协商、工具有效、`convert_time` UTC 12:00→`Etc/GMT-5` 得 `17:00`/`+5.0h`、无效时区/缺参数/未知工具为工具 `isError`、现代 `ping` 与 `resources/list` 为 JSON-RPC `-32601`、关闭后新连接可用、原始 `server/discover` 返回新版字段。
6. 基线固定 2026-07-28 失败（`tools/list` 得 JSON-RPC `-32602`，进程未崩溃），legacy 旧行为保留；原始 `server/discover` 在基线为 `-32601`。
7. 记录原生测试与静态检查：pytest 94 收集、7 通过、87 失败、0 skip（86 项缺 `pytest-asyncio`，1 项控制台脚本未安装；`freezegun` 另导致一个模块收集失败）；ruff 0.17.3 基线 14→候选 13 条、无新增，格式检查通过；pyright 未跑。
8. 仓库检查：`scripts/check_repo.py` 退出 0（912 文件，无本地链接或 JSON/TOML 语法错误）；`scripts/check_public.py` 对新增文件做临时索引 `--staged` 扫描，`findings` 为空，`incomplete` 因仓库既有已跟踪图片和 8 个 `.wav` 等二进制被文本扫描器跳过。

产物（工作目录内，未提交、未推送、未切换分支）：

- `docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/result.md`
- `.../migration.patch`
- `.../probe-time-eras.py`（本次实际运行）
- `.../verification.json`
- `.../SERVERS-LICENSE.txt`
- 本记录：`reader-tests/A-MCP-TIME-MIGRATION-READER-20261107-u1.md`

## 卡点

### 1. “缺依赖先按项目支持方式准备；无法准备时记精确缺口”（§第一步）

- 缺什么：本机既有环境没有 `pytest-asyncio`、`freezegun`、`pyright`，也没有项目 pin 的 `ruff 0.8.1`；`src/time` 的 `uv.lock` 还 pin 了缓存中不存在的 `pydantic 2.12.5` / `pydantic-core 2.41.5` 等精确版本。
- 实际处理：按任务约束不安装、不下载、不同步；`mcp 2.3.0` 及运行依赖从既有 uv 缓存的已解包 wheel 内容通过 `PYTHONPATH` 只读使用，并用真实 stdio 消费者补齐协议行为验收。原生异步测试与单测如实记为未验，不用依赖桩或自造 runner 冒充。
- 做错过的：一开始想用 `uv sync --offline` 建 venv，随后意识到这仍是安装/隐式同步，改回只读 `PYTHONPATH`；没有把缓存中的较新版本说成锁文件原版本。

### 2. “SDK 2.3.1 固定新版使用 `mode: { pin: "2026-07-28" }`”（§自动协商成功）

- 缺什么：本任务的 `uv.lock` 与既有缓存是 `mcp 2.3.0`，`Client` 的 `mode` 只接受 `"legacy"`、`"auto"` 或现代版本字符串，不接受页面写的 `{ pin: ... }` 映射。
- 实际处理：读缓存里的 SDK 源码确认 `mode="2026-07-28"` 是 2.3.0 的 pin 形式，用它分别固定两代；`auto` 只作为对照信息，没有用 `auto` 成功替代新版验收。
- 做错过的：第一版探针把 legacy 的 `mode` 写成 `"2025-11-25"`，客户端报 `ValueError`；看 SDK 报错后改为 `mode="legacy"`（协商结果仍是 2025-11-25）。

### 3. “分别固定旧／新协议，运行真实构建产物”（§按改动形状选路）

- 缺什么：页面按“构建产物”描述，Python server 没有构建步骤；页面也没给 Python 的启动入口。任务合同给的是真实 stdio 启动 time CLI，我按 `python -m mcp_server_time --local-timezone UTC` 做。
- 实际处理：真实子进程 + `mcp` 客户端 stdio，不用内存传输、不直接调处理函数、不只跑 `auto`。
- 做错过的：探针首次运行时日志目录尚未创建，JSON 写盘报 `FileNotFoundError`（行为本身已跑完）；补建目录后重跑。基线固定新版的失败先被包在 `ExceptionGroup` 里，只看到 “unhandled errors in a TaskGroup”；补了子异常展开后才定位到 `MCPError -32602`。

### 4. “已有迁移先接收，不从零重写”（§按改动形状选路）

- 缺什么：`git diff` 产出的补丁在非 git 目录用 `git apply` 时只打印 “Skipped patch”，不报具体原因。
- 实际处理：工作副本用 GNU `patch -p1` 应用；另建一次性 git 仓库验证 `git apply --check` 与 `git apply` 均成功，并确认重放结果等于已有实现提交。
- 做错过的：首次比较“候选 vs 已有实现”时把 CRLF 检出与 LF 补丁的差异误当成内容不一致；统一换行后确认逐字相同。

### 5. “原生 101 项测试通过并不代表支持新协议”（§自动协商成功）；任务合同另要求跑 time 原生测试与静态检查

- 缺什么：`pytest-asyncio` 缺失使 74+11 项异步测试全部报 “async def functions are not natively supported”；`freezegun` 缺失使 `test_server.py` 收集失败；`pyright` 未安装。页面强调原生测试数不能替代新协议验收，但任务合同仍要求把原生测试作为证据，两者都要交代。
- 实际处理：如实记录 94 收集 / 7 通过 / 87 失败及每类原因，不删测试、不降断言、不把 7 项通过当双协议验收；ruff 用缓存 0.17.3 跑真实检查并与基线对比。
- 做错过的：无（失败原因逐项核对过，不是迁移引入）。

## 页面之外还去翻了什么

- 从 GitHub 固定提交取回 `docs/decisions/migrations.md` 原文件，仅用于核对字节数与 SHA-256（页面全文已由任务内嵌，未读其他 a1dbv 文档）。
- 任务仓 `modelcontextprotocol/servers` 固定基线与实现提交的 `src/time` 源码、测试、`pyproject.toml`、`uv.lock`、`LICENSE`（任务自身源码与许可）。
- 缓存中的 `mcp 2.3.0` SDK 源码：`Client` 的 `mode` 语义、`StdioServerParameters`、`CallToolResult` 字段（必要依赖文档）。
- 本机 uv 缓存中的包清单与 wheel 标签，用于确认哪些依赖“已经具备”；没有跨其他任务或用户目录搜环境。
- 明确未看：`experiments/mcp-protocol-migration/README.md`（页面虽作为复跑入口，但属作者实作日志）、其他 a1dbv 教程、其他读者报告、同主题外部教程。

## 核对

本记录由实际执行的读者填写；迁移补丁范围、真实输出与环境缺项已写入 `verification.json`，待读者以外的审查者复核。

### 审查者复核（读者以外，独立重跑）

**结论：迁移可接收；读者任务在环境允许范围内做通（taskDone=true），但原生异步测试、`test_server.py` 单测与 pyright 仍为未验。**

独立复核（未复用读者日志，未安装任何依赖）：

- 页面输入：从本仓 git 对象 `docs/decisions/migrations.md@65de22e9` 取原文，9628 字节，SHA-256 `0857615edf64dd7d75c12fdfeaf51fed64cd6092dee7c3eb0e2d95480cc95f73`，与任务预期一致；内嵌全文与解析提交一致。
- 固定点：`2f8dc42931d96d083b45691a859619d45362713a` 与 `38fa696473ec9d83c87b470155693c174440c15d` 均存在于任务仓；基线 `src/time` 与 `2f8dc42`、已有实现与 `38fa696`、候选与 `38fa696` 在 CRLF 归一后逐字一致。
- 补丁：`migration.patch` 与 `git diff 2f8dc42 38fa696 -- src/time` 在换行归一后逐字节相同（13184 字节，SHA-256 `9ce2cdaeaaa2e5517c7c6f3fe2d8ea7f49adacd985ba46043d8ceebb10109755`）；在全新基线上 GNU `patch -p1` 与 `git apply --check --whitespace=error-all` 均成功，重放结果等于 `38fa696`。范围恰为 4 个 `src/time` 文件，未触依赖、锁文件、其他 server 或 CI。
- 真实 stdio（与读者同一缓存环境：CPython 3.13.5、mcp 2.3.0）：重跑 `probe-time-eras.py`，基线退出 1、候选退出 0。基线 legacy 正常，固定 2026-07-28 的 `tools/list` 为 JSON-RPC -32602、原始 `server/discover` 为 -32601；候选两代 `convert_time` 均为 `17:00 +05:00` / `+5.0h`，无效时区、缺 `target_timezone`、未知工具均为工具 `isError`，现代 `ping` 与两代 `resources/list` 为 -32601，关闭后两代均可重连，原始 `server/discover` 返回 `supportedVersions=["2026-07-28"]`、`resultType=complete`、`ttlMs=0`、`cacheScope=private`。基线/候选的进程失败路径同为退出码 1、单行 stderr、无 traceback。
- 原生测试：重跑 `pytest`（既有缓存 9.2.0）得 94 收集、7 通过、87 失败；87 = 86 项因缺 `pytest-asyncio` + 1 项因 console script 未安装；`test_server.py` 因缺 `freezegun` 收集失败。与读者记录一致，所见失败由环境缺口阻止执行，不能判断未执行测试是否有迁移回归。
- 静态检查：ruff 0.17.3 基线 14 条 → 候选 13 条，唯一变化为 SIM117 4→3，无新增；`ruff format --check` 退出 0。pyright 未安装，未跑。
- 仓库检查：`scripts/check_repo.py` 退出 0（912 文件，0 errors）；`scripts/check_public.py --staged` 对新增文件 `findings=0`，`status=incomplete` 仅来自既有已跟踪图片与 `.wav` 等二进制；补丁通过 `git diff --check` 与 `--whitespace=error-all`；无新增提交，HEAD 仍为 `4d4d9349`，工作树仅两处未跟踪产物；`SERVERS-LICENSE.txt` 与上游 `LICENSE` 逐字一致；artifacts 内未见本机绝对路径、个人邮箱或内网地址。

**卡点归属**：页面缺口主要在“SDK 2.3.1 的 `mode: { pin: "2026-07-28" }` 未标明是 TypeScript 写法”（本任务 Python mcp 2.3.0 只接受 `mode="2026-07-28"`），以及“运行真实构建产物”未覆盖无构建步骤的 Python 入口（读者按任务合同改用 `python -m mcp_server_time`）。依赖缺失、pyright 缺失属环境能力，不是页面或读者错误，读者如实记录且未用依赖桩。非 git 目录 `git apply` 只打印 “Skipped patch”、CRLF 误判、探针日志目录未建，均为读者已自行修正的小错，不构成页面缺口。

**未验**：原生异步测试、`test_server.py` 单测、pyright、控制台脚本入口、锁文件精确版本、HTTP/其他 server、上游自报的 133 项；与读者所列未验项一致。

**读后小偏差（不影响结论）**：`result.md` 摘要把 `freezegun` 与 87 项失败并列归因，实际 `freezegun` 只导致 `test_server.py` 收集失败、不计入 94/87；`check_public` 的 `incomplete` 除图片外还含既有 `.wav`，结论不变。

### 负责人接收边界

接收原读者的真实 stdio 局部成果及两处页面卡点，不把 `taskDone=true` 扩大为整张合同或修订版页面通过。上面的“关闭后可重连”实际为新子进程、新连接，不证明同一运行实例的状态隔离；原探针摘要覆盖不足，报告结论须逐项看输出。负责人另在 Linux 固定锁环境补完 122／133 项原生测试、静态、构建、覆盖与加严探针，见[接收说明](../docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/result.md#负责人独立接收2026-11-07)。这是后续验收，不是本读者重做或新读者首次通过。
