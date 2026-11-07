# A-MCP-TIME-MIGRATION-READER-V2-20261107-u1 · 新读者记录

日期：2026-11-08
状态：**blocked**（源码核对完成，运行验证未执行）
角色：第一次读该修订页的新上下文读者；未读旧读者记录、作者日志、已有探针、验收报告或其他 a1dbv 教程。

## 做到哪一步

1. 核对输入：卡片声明的页面固定提交 `docs/decisions/migrations.md@9d0321cc594034fb8267540895075376157e3848` 为 10226 字节、SHA-256 `3c47c5f82ea1d074e17d4483880919381577a8c3ad45cc10661bf5bc96375497`；实测一致，附带正文与固定提交里的文件逐字节相等。未改用 `main`。
2. 按页面与卡片取得公开目标源码：`modelcontextprotocol/servers` 基线 `2f8dc42931d96d083b45691a859619d45362713a`、候选 `38fa696473ec9d83c87b470155693c174440c15d`。
3. 只取 `src/time` 四文件差量（README、server.py、test_protocol.py、新增 test_eras.py），生成可重放补丁；依赖、`uv.lock`、`.python-version`、CI 与其他 server 均未改。
4. 重放核对：补丁对基线 `git apply --check` 通过，应用后四个文件与候选 blob 4/4 一致；候选源码 `py_compile` 通过。
5. 环境实核：本机缺 `mcp`、`tzlocal`、`jsonschema`、`pytest`、`pytest-asyncio`、`freezegun`、`ruff`、`pyright`，也没有安装 `mcp-server-time` 发行包和控制台入口。按卡片“任一必需项仍缺即 blocked”，停在源码核对。
6. 未运行任何真实 stdio 客户端、原生测试、静态检查或控制台入口；未写 `probe-time-eras.py`（卡片要求真运行才交）。

一句话：页面要求的两代协议路线在源码上已对上，但本机无法启动真实入口，整卡不能写成运行通过。

## 产物在哪

工作目录内：

- `docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-V2-20261107/result.md`：结果与命令、退出码、版本、未验项
- `docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-V2-20261107/migration.patch`：四文件差量，SHA-256 `9ce2cdaeaaa2e5517c7c6f3fe2d8ea7f49adacd985ba46043d8ceebb10109755`
- `docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-V2-20261107/verification.json`：机器可读核对结果
- `docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-V2-20261107/SERVERS-LICENSE.txt`：目标仓根 LICENSE
- `reader-tests/A-MCP-TIME-MIGRATION-READER-V2-20261107-u1.md`：本记录

目标源码放在本单元临时目录下的独立 checkout（a1dbv 之外的新目录），未写入 u1 或云端读者工作树。原始环境探测日志留在私有临时区，未放进公开产物。

## 卡点

| # | 卡点 | 页面对应句 | 缺什么 | 做错／纠正 |
|---|---|---|---|---|
| 1 | 无法启动真实 stdio 入口 | “Python time 无需 TypeScript 式重建，按项目安装后重启 `python -m mcp_server_time`；原生套件另核控制台入口。” | 缺 `mcp`；`mcp-server-time` 未安装，`python -m mcp_server_time` 返回 `No module named mcp_server_time`；`mcp-server-time` 不在 PATH。`server.py` 还用 `version("mcp-server-time")` 读发行元数据，未安装即导入失败。 | 没把源码树直接当已安装环境；按页面“按项目安装后”的前提记录缺口，未用 PYTHONPATH 或伪造 dist-info 绕过。 |
| 2 | 无法固定两代客户端跑真实消费者 | “**照这个顺序做：固定两代协议 → 验基线消费者 → 接必要入口差量 → 有构建先构建，重启真实入口 → 重跑相同消费者。**” | 缺 `mcp`，无法构造 `mcp.Client`，`legacy` 与 `2026-07-28` 两种 `mode` 都跑不了。 | 只从源码确认 `test_eras.py` 的 `mode` 写法，不把未运行的测试当成通过。 |
| 3 | 无法验证新版客户端成功／基线新版失败 | 表格行：“两代真实调用各自通过，旧版失败路径与状态隔离保留；自动回退后的成功不能证明新协议可用。” | 同上：没有 `mcp` 和可用入口；无法从真实 stdio 观察基线拒绝与候选成功。 | 没有用 `auto` 或内存传输替代，也没有引用旧报告。 |
| 4 | 无法核对 Python pin 写法在运行时成立 | “Python mcp 2.3.0 则用 `mode="2026-07-28"`，旧代用 `mode="legacy"`。`auto` 能回退，只验请求成功会漏掉新版仍不支持。” | `mcp 2.3.0` 未安装，无法确认 `Client(mode=...)` 接受这两个值。源码侧只核到测试写法与 `uv.lock` 的 `mcp 2.3.0` 一致。 | 区分“源码一致”与“运行验证”，不把前者写成后者。 |
| 5 | 原生套件与静态检查不能跑 | “原生套件另核控制台入口。” | 缺 `pytest`、`pytest-asyncio`、`freezegun`、`ruff`、`pyright`。 | 只用 `py_compile` 做语法核对，并明确它不是 ruff／pyright／导入成功。 |
| 6 | 卡片第 16 节的错误分层与重启检查不能做 | 页面依据行只给到“两代真实调用”；具体到 JSON-RPC error／工具 `isError`／进程失败、关闭后新进程连接是卡片要求，不是页面原句。 | 同上，需要真实客户端与进程。 | 列为未运行，不推断结果。 |
| 7 | `convert_time` 的 17:00／+5.0h 不能实测 | 页面依据行提到 time 两代 stdio 已由他人跑过；卡片要求本次自己跑 UTC 12:00→`Etc/GMT-5`。 | 同 #1。候选 `test_eras.py` 有该断言，但未执行。 | 不把测试源码里的期望值当作实测输出。 |

关于“缺依赖先按项目支持方式准备；无法准备时记精确缺口”这一句：本机被禁止安装／下载包，也没有现成项目环境，因此按卡片记录精确缺口与恢复条件，未尝试 `uv sync`／`uv run`（会触发下载）。

### 做错过什么

- 第一次用相对路径查页面文件时没有先切到工作目录（Bash 调用之间工作目录会重置），得到“文件不存在”的假象；随后改用固定提交 `git show` 核指纹，确认工作树 HEAD 本来就没有该路径，也没有拿 HEAD 的文件冒充固定提交。
- 用 `git fetch --depth 1` 取候选提交时输出 “Nothing new to pack”，一度无法判断对象是否到位；用 `git cat-file -t` 确认两个提交都在后才继续。
- `py -0p` 列出过临时 hook 目录下的一个 3.15 解释器；意识到它不是项目环境，也未用它 import 依赖或拼环境。
- 目标源码 checkout 的 `git checkout`／`git apply` 都在本单元独立目录内做，没有动 a1dbv 工作树；公开产物里没有写本机绝对路径。

## 页面之外还去翻了什么

- **原 issue／PR（卡片允许）**：GitHub REST 读 `modelcontextprotocol/servers` 的 issue `#4853`（标题 “Spec Refactor Wave 2 Part 2: Modern-era Python servers”，state closed）与 PR `#5126`（标题同候选提交，state closed，`merged_at` 2026-10-12T02:48:03Z）。只取标题／状态，未读评论作为结论。
- **目标源码与项目规则／README（卡片允许）**：基线与候选的 `src/time` 四文件全文与 diff；`test_entrypoints.py`、`__init__.py`、`__main__.py`；`pyproject.toml`、`uv.lock`、`.python-version`、`README.md`；仓库根 `LICENSE`。
- **本机环境**：`python -VV`、`pip show`、`import` 探测、`ruff`／`pyright` 命令、PATH 上的 `mcp-server-time`、`uv --version`／`uv tool list`／`uv python list`，以及本机其他 Python 解释器是否装有所需包。
- **没有读**：`reader-tests/` 下已有的旧读者文件（含 `A-MCP-TIME-MIGRATION-READER-20261107-u1.md`）、`experiments/mcp-protocol-migration/` 等探针／报告、其他 a1dbv 教程或分工文档。页面自身引用的实验 README 也没有作为运行依据。

## 未验清单（与 result.md／verification.json 一致）

两代真实 stdio 调用；`convert_time` UTC 12:00→`Etc/GMT-5`；工具列表与输入契约；无效时区、缺参数、未知工具、未支持方法；JSON-RPC error／工具 `isError`／进程失败的分层；关闭后新进程连接；基线与候选原生测试；ruff；pyright；`python -m mcp_server_time` 与控制台脚本；mcp 2.3.0 的 `Server.run`／`Client(mode=...)` 内部 API。

## 核对

日期：2026-11-08。审查者未参与本读者执行，只按任务验收核对工作目录内的产物与公开源码。结论：**读者记录可信、源码核对项可独立复现；运行验收未执行，整卡按卡片仍为 blocked，taskDone=false。** 没有发现伪造通过：本机确实缺运行依赖，且卡片禁止安装／下载。

独立复现（在单元临时目录内的目标 checkout 重建）：

- 页面固定提交 `9d0321cc...` 为 10226 字节、SHA-256 `3c47c5f8…5497`；任务文件内的“页面全文”与 `git show` 的 blob 逐字节相同。
- `migration.patch` SHA-256 `9ce2cdae…9755`、296 行、4 个 `diff --git` 头；对基线 `2f8dc42` 的 `git apply --check` 通过，应用后 4 个文件 blob 与候选 `38fa696` 全部一致。
- `src/time` 的 `uv.lock`、`pyproject.toml`、`.python-version` 在基线与候选间无差异；`mcp` 锁 2.3.0，依赖声明与读者记录一致。
- `py_compile` rc=0；目标仓根 `LICENSE` 与 `SERVERS-LICENSE.txt` 的 SHA-256 相同（12227 字节）。
- 环境缺口复现：3.13.5 下 `mcp`、`tzlocal`、`jsonschema`、`pytest`、`pytest_asyncio`、`freezegun` 均 `ModuleNotFoundError`；`ruff`、`pyright`、`mcp-server-time` 不在 PATH；`uv 0.11.7`、`uv tool list` 为空；另查 3.12.15 解释器同样缺 `mcp`／`pytest`。源码树内 `python -m mcp_server_time` 为 `No module named mcp_server_time`。
- `python scripts/check_repo.py` rc=0（916 文件），`python scripts/check_public.py` rc=0（1464 文件）；新增文件未含本机路径、邮箱、凭据；工作树只有本任务两组未跟踪产物。

两处修订核对（只读公开依赖源码）：

- Python pin：mcp v2.3.0 `src/mcp/client/client.py` 把 `mode` 校验为 `"legacy"`、`"auto"` 或现代协议版本字符串；`mcp.client._transport.TransportStreams`、`mcp.shared.memory.create_client_server_memory_streams`、`mcp.types.METHOD_NOT_FOUND` 均存在。`Server.run` 在 `src/mcp/server/lowlevel/server.py`，是双代 loop。页面的 Python 写法成立。
- TypeScript pin：typescript-sdk v2.3.1 `packages/client/src/client/versionNegotiation.ts` 定义 `'legacy' | 'auto' | { pin: string }`。页面的 TS 写法成立。
- 真实入口：`__main__.py` 调 `main()`、`[project.scripts] mcp-server-time`、README 的 `python -m mcp_server_time` 均在，`test_entrypoints.py` 覆盖三种入口；页面“无需 TypeScript 式重建”成立。

读者未意识到的错误：

- `result.md` 的逐文件改动数有两处错：`README.md` 实为 +6/−1（读者写 +7/−1），`test_protocol.py` 实为 +22/−14（读者写 +14/−10）。按读者表相加是 +188/−26，与其自己写的总数 +195/−30 也不一致；总数和补丁哈希正确，补丁本身不受影响。
- 读者把 `Client(mode=...)` 是否接受这两个值说成只能运行确认；mcp v2.3.0 公开源码可直接核对参数校验（卡片允许读必要依赖文档），这一步本可补上，但不改变运行时无法验证的 blocked 结论。

卡点判定：六条卡点都由本机缺依赖、且卡片禁止安装／下载引起，落在页面／任务前提一侧；页面已写“按项目安装后”“无法准备时记精确缺口”，卡片也规定此情形 blocked，因此不是读者能力不足，读者按 blocked 记录精确缺口是正确做法。第 4 条中页面写法本身正确，读者只差一步公开 SDK 源码核对；第 6 条读者正确指出 `test_eras.py` 走内存流、不能替代真实 stdio。
