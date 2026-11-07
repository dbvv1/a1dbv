# A-MCP-TIME-MIGRATION-READER-V2-20261107 · 读者实做结果

状态：**blocked**（源码核对完成；运行验证因本机缺依赖未执行）
日期：2026-11-08
角色：新读者，未参与旧页、u1、负责人补验或云端冷读；只照本卡附带的修订页做。

## 结论

修订页要求的两条路线已按源码核对：用 `server.run()` 让 2026-07-28 与 2025-11-25 两代协议并存，并用固定 `mode` 的真实客户端分别验证两代。本机缺 `mcp`、`tzlocal`、`jsonschema`、`pytest`、`pytest-asyncio`、`freezegun`、`ruff`、`pyright`，也没有安装 `mcp-server-time` 控制台入口，因此无法启动真实 stdio 入口、无法运行原生套件、静态检查或两代客户端。按卡片要求记为 blocked，只保留能完成的源码核对。

已完成的源码核对（可重放）：

- 页面指纹与附带正文一致：10226 字节、SHA-256 `3c47c5f82ea1d074e17d4483880919381577a8c3ad45cc10661bf5bc96375497`。
- 目标仓只接 `src/time` 四文件差量，共 +195/−30；依赖、锁文件、`.python-version`、CI 与其他 server 未改。
- `migration.patch` 可对基线 `2f8dc42` 干净应用，应用后四个文件与候选 `38fa696` 的 blob 完全一致。
- 候选源码语法编译通过（`py_compile`，非 ruff／pyright）。

未验：两代真实 stdio 调用、`convert_time` 实际输出、工具列表与输入契约、无效时区／缺参数／未知工具／未支持方法的错误分层、关闭后新进程连接、原生测试、静态检查、控制台入口。

## 输入核对

卡片给出的页面固定提交为 `docs/decisions/migrations.md@9d0321cc594034fb8267540895075376157e3848`，声明 10226 字节、SHA-256 `3c47c5f82ea1d074e17d4483880919381577a8c3ad45cc10661bf5bc96375497`，并要求接收端附上完整正文。

实测：

```text
git cat-file -t 9d0321cc594034fb8267540895075376157e3848        → commit, rc=0
git show 9d0321cc...:docs/decisions/migrations.md | sha256        → 10226 bytes, 3c47c5f8…5497
```

附带正文与固定提交中的文件逐字节相等（10226 字节，字符串比较一致）。未改用 `main`。工作树当前 `HEAD` 没有该路径，核指纹改用固定提交本身，不改页面文件。

注：卡片自带的“答案页完整正文”省略了空行，与“页面全文”段落等价；两处都按卡片原样使用，未改动页面。

## 目标仓库与范围

- 仓库：`https://github.com/modelcontextprotocol/servers`（公开只读）
- 基线：`2f8dc42931d96d083b45691a859619d45362713a`（2026-10-11，`Merge pull request #5120`）
- 已有实现：`38fa696473ec9d83c87b470155693c174440c15d`（2026-10-11，`feat(fetch,git,time): serve the 2026-07-28 era beside 2025-11-25`）
- 仓库根 `LICENSE` 随产物提供，见 `SERVERS-LICENSE.txt`

只取 `src/time` 的四个文件：

| 文件 | 变化 |
|---|---|
| `src/time/README.md` | +7/−1：新增 “Protocol versions” 一节，开发段补 `test_eras.py` |
| `src/time/src/mcp_server_time/server.py` | +10/−15：删 `serve_loop` 分支，改用 `await server.run(read_stream, write_stream, options)` |
| `src/time/tests/test_protocol.py` | +14/−10：旧测试 `test_modern_era_is_not_served` 改为 `test_server_discover_answers_the_2026_07_28_era`，断言原始 JSON-RPC 结果 |
| `src/time/tests/test_eras.py` | 新增 157 行：用真实 `mcp.Client` 固定 `mode` 跑两代 |

候选提交同一个 commit 还改了 `src/fetch`、`src/git` 和 `.claude/skills/client-smoke/SKILL.md`，按卡片要求全部不接。

依赖核对：

```text
git diff --stat 2f8dc42 38fa696 -- src/time/uv.lock src/time/pyproject.toml src/time/.python-version
→ 空输出，rc=0
```

`uv.lock` 在基线与候选中都把 `mcp` 钉在 `2.3.0`；`pyproject.toml` 声明的运行时依赖为 `jsonschema>=4.20.0`、`mcp>=2.2,<3`、`pydantic>=2.0.0`、`tzdata>=2024.2`、`tzlocal>=5.3.1`，开发依赖含 `freezegun>=1.5.1`、`pyright>=1.1.389`、`pytest>=8.3.3`、`pytest-asyncio>=1.4.0`、`pytest-cov>=7.1.0`、`ruff>=0.8.1`。锁文件与声明均未变。

## 已完成的源码核对

在目标仓 checkout 内执行，产物 `migration.patch` 由四文件差量生成：

```text
git diff --no-color 2f8dc42 38fa696 -- \
  src/time/README.md \
  src/time/src/mcp_server_time/server.py \
  src/time/tests/test_protocol.py \
  src/time/tests/test_eras.py > migration.patch
→ 296 行，4 个 diff --git 头，SHA-256 9ce2cdaeaaa2e5517c7c6f3fe2d8ea7f49adacd985ba46043d8ceebb10109755
```

重放验证：

```text
git checkout 2f8dc42
git apply --check --verbose migration.patch        → rc=0
git apply migration.patch                          → rc=0
git hash-object <4 files> 对比候选 blob
→ 4/4 MATCH：
  README.md            7103cafc82bf7e64f88e5cca496322a470cf1bff
  server.py            4a2cd187ae97af2fa8195169a8c88df15d499860
  test_protocol.py     e4daee641888c1f7cbf0c9581683cea1b2dc0021
  test_eras.py         5f2e35b45aa1eb25e2b98ce57c906f23f9b9e20e
```

语法编译（只证明文件可解析，不等于 ruff／pyright／导入成功）：

```text
python -m py_compile src/time/src/mcp_server_time/server.py \
  src/time/src/mcp_server_time/__init__.py \
  src/time/src/mcp_server_time/__main__.py \
  src/time/tests/test_protocol.py src/time/tests/test_eras.py \
  src/time/tests/test_entrypoints.py src/time/tests/test_server.py
→ rc=0
```

源码层面的测试函数计数（未 collect、未运行，仅 `ast` 统计）：`test_protocol.py` 25 个、`test_eras.py` 7 个；参数化后的实际用例数未知。

### 两处修订的源码核对

1. **pin 写法（TypeScript／Python 区分）**：页面写 “TypeScript SDK 2.3.1 … `mode: { pin: "2026-07-28" }`；Python mcp 2.3.0 则用 `mode="2026-07-28"`，旧代用 `mode="legacy"`”。候选 `test_eras.py` 正是 `MODERN = "2026-07-28"`、`LEGACY` 用字符串 `"legacy"`，并以 `Client(transport(), mode=mode)` 传入；`uv.lock` 钉 `mcp 2.3.0`。写法与页面一致。`Client` 实际是否接受这两个值未运行验证。
2. **真实入口**：页面写 “Python time 无需 TypeScript 式重建，按项目安装后重启 `python -m mcp_server_time`；原生套件另核控制台入口”。源码对上：`pyproject.toml` 有 `[project.scripts] mcp-server-time = "mcp_server_time:main"`；`__main__.py` 调用 `main()`；README 说明 pip 安装后用 `python -m mcp_server_time`；`test_entrypoints.py` 同时覆盖 `main()`、`python -m`、控制台脚本真实 stdio。注意 `server.py` 用 `version("mcp-server-time")` 读发行元数据，未安装时无法导入，页面“按项目安装后”这一前提是必要的。本机既未安装该发行包，也未装 `mcp`，故真实入口未启动。

## 环境实核

| 项 | 实测 | 退出码 | 结果 |
|---|---|---|---|
| Python | 3.13.5（64-bit） | 0 | 可用；项目 `.python-version` 为 3.10，实际解释器高于此 |
| `uv` | 0.11.7 | 0 | 存在；未执行 `uv sync/run`（会下载依赖，卡片禁止） |
| `import mcp` | ModuleNotFoundError: No module named 'mcp' | 1 | 缺 |
| `import tzlocal` | ModuleNotFoundError | 1 | 缺 |
| `import jsonschema` | ModuleNotFoundError | 1 | 缺 |
| `import pytest` | ModuleNotFoundError | 1 | 缺 |
| `import pytest_asyncio` | ModuleNotFoundError | 1 | 缺 |
| `import freezegun` | ModuleNotFoundError | 1 | 缺 |
| `ruff --version` | command not found | 127 | 缺 |
| `pyright --version` | command not found | 127 | 缺 |
| `pip show mcp` | Package(s) not found | 1 | 未安装 |
| `pip show mcp-server-time` | Package(s) not found | 1 | 项目未安装，发行元数据不存在 |
| `which mcp-server-time` | not found | 1 | 控制台入口不存在 |
| `python -m mcp_server_time`（源码树内，未安装） | No module named mcp_server_time | 1 | 入口未就绪 |

另核了本机可用的其他 Python 解释器（uv 管理的 3.9／3.10／3.11 与系统 3.13）：均未安装 `mcp`／`pytest`。`uv tool list` 为空。未从缓存拼 `PYTHONPATH`，未伪造 `dist-info`，未使用依赖桩。

据此，卡片列出的必需项仍缺，判定 blocked。

## 未运行项与原因

- **两代真实 stdio 客户端（`legacy` / `2026-07-28`）**：缺 `mcp`，项目未安装。
- **`convert_time` UTC 12:00 → `Etc/GMT-5` 得 17:00／+5.0h**：同上；候选 `test_eras.py` 里有这条断言，但未执行。
- **工具列表／输入契约、无效时区、缺参数、未知工具、未支持方法，以及 JSON-RPC error / 工具 `isError` / 进程失败的区分**：需要真实客户端与 stdio，未执行。
- **关闭后新进程连接可用**：未执行。
- **基线固定新版失败、候选新版成功**：未执行。
- **原生 pytest 套件（基线与候选）**：缺 `pytest`、`pytest-asyncio`、`freezegun`。
- **ruff／pyright**：未安装。
- **`python -m mcp_server_time` 与控制台入口**：缺 `mcp` 与项目安装元数据。
- **mcp 2.3.0 内部 API（`Server.run`、`Client(mode=...)`）**：未安装依赖，未读 SDK 源码；只核到候选测试与锁文件的用法一致。
- **候选测试的私有导入路径**：`test_eras.py` 从 `mcp.client._transport` 导入 `TransportStreams`；该私有路径是否与 `mcp 2.3.0` 的实际布局一致，未安装未核，只有运行测试才能确认。
- **候选测试不能替代真实 stdio 验证**：`test_eras.py` 用 `create_client_server_memory_streams()` 走内存流（其注释称与 stdio 走同一条 JSON-RPC 路径），但卡片明确要求从项目真实 stdio CLI 启动、不只用内存传输。即使原生套件将来通过，仍需单独做真实进程验证；本次两者都未运行。

## 恢复条件

1. 在本机准备一个项目真实安装环境：按 `src/time/uv.lock` 同步 `mcp==2.3.0` 及运行时依赖，并安装 `mcp-server-time`（`uv sync` 或等价的允许方式），使 `import mcp_server_time`、`pip show mcp-server-time`、`mcp-server-time` 入口均可用。
2. 安装开发依赖 `pytest`、`pytest-asyncio`、`freezegun`、`ruff`、`pyright`（版本按 `pyproject.toml` 下限与锁文件）。
3. 用与项目一致的 Python（`.python-version` 为 3.10；若用其他版本需记录差异）在 `src/time` 运行 `pytest`、`ruff check`、`pyright`。
4. 从真实 stdio 入口分别固定 `legacy` 与 `2026-07-28` 客户端重跑本卡第 16 节的检查，并保留下原始日志。

任一项未就绪时，本卡不应把源码核对写成运行通过。

## 产物

- `result.md`（本文件）
- `migration.patch`：四文件差量，可对基线重放
- `verification.json`：机器可读的核对结果与环境缺口
- `SERVERS-LICENSE.txt`：目标仓根 `LICENSE`（12227 字节）
- `reader-tests/A-MCP-TIME-MIGRATION-READER-V2-20261107-u1.md`（仓库根相对）：读者记录

`probe-time-eras.py` 未提交：卡片要求“真运行才交”，本次没有可运行环境。

未包含本机绝对路径、邮箱、凭据或私人调用 id。原始探测日志私下保留，未放进产物。
