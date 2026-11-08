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

**Python 同样要固定两代 client，但选项写法不同：mcp 2.3.0 用 `mode="legacy"` 和 `mode="2026-07-28"`。** 不套 TypeScript 的 `{ pin: ... }`。启动项目真实入口；下方先以 editable 安装运行 `python -m mcp_server_time`，修改后重启进程；按 wheel 交付时仍须重建、独立安装，见末节。原生 suite 另核已安装的 `mcp-server-time` 控制台脚本。

未参与页面写作的读者只照固定迁移答案与项目材料，接收 #5126 的 time 四文件差量，完成两代 stdio、基线固定新版失败、工具／输入契约及失败路径。其 Windows 缓存环境缺测试依赖，不能据此判完整通过；负责人在 Linux 用原锁文件独立补验。需 Git、uv、Python 3.12、Node／npm（coverage 及 pyright 需要）和公开 PyPI／npm 网络；固定项目声明 >=3.10，负责人首次补验为 3.12.14；后续独立云读者另按 `.python-version` 的 3.10 实做，结果见下。

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

2026-11-07 独立补验：基线 122／122、候选 133／133，零失败、错误或 skip；两侧格式、ruff、pyright、wheel／sdist 构建及原生 coverage gate 通过，各文件行／分支覆盖均 100%。原读者探针的摘要遗漏 legacy 断言等检查，接收时补齐并以 9 项回归测试防漏；原记录与后续云验分开保留。本次负责人补验不算修订页的首次冷读，不提升读者地图评级。

### 修订页的独立云读者：Python 3.10 已实跑，本机门槛仍未过

另一未参与旧页与补验的新上下文，只读[固定修订页](https://github.com/dbvv1/a1dbv/blob/9d0321cc594034fb8267540895075376157e3848/docs/decisions/migrations.md)与目标项目／依赖资料，在独立 Linux 副本按原锁安装 Python 3.10.22、mcp 2.3.0 和真实 time 发行包。它自行写 stdio 消费者，先验基线再接相同四文件差量：基线固定新版 `tools/list` 被拒，候选两代均得到 17:00／+5.0h；完整工具声明相同，无效时区、缺参数、未支持方法分层及关闭后新进程连接通过。基线 122／候选 133 项原生测试、格式、lint、类型、构建及逐文件覆盖门槛均通过，零 skip。未复用旧探针或旧报告作为执行结果。

**固定新版后仍要验真实响应，不能只看客户端的版本字段。** Python mcp 2.3.0 的显式现代 `mode` 会直接采用指定版本，并可合成 discovery 信息；只有实际请求被候选服务端处理成功，才证明新版可用。基线的真实失败与候选的真实成功是这轮迁移的判断依据。

复跑这一轮时，把上文 `UV_PYTHON` 改为 `3.10`，准备命令用 `uv sync --frozen --all-extras --dev`，后续原生命令沿用。受限云目录还需分别把 `UV_CACHE_DIR`、`UV_PYTHON_INSTALL_DIR`、`PYRIGHT_PYTHON_CACHE_DIR` 与 `npm_config_cache` 指向任务自己的可写目录：仅设置 uv 缓存不会重定向 Pyright 的 npm 包装器缓存。该读者两侧首次 Pyright 因默认缓存目录不可写而失败，改用支持的独立缓存后重跑均为 0 errors；未放宽检查或改变系统权限。

本次只补上修订页的云端冷读与 Python 3.10 证据。[本机 V2](../../docs/collaboration/local-jobs/A-MCP-TIME-MIGRATION-READER-V2-20261107.md)仍缺真实安装、测试依赖和控制台入口，禁止安装条件未变，`taskDone=false`；云读者不替代它，也不提升读者地图评级。独立 wheel 消费者随后补验，见下节。

**依据与完整结果**：[读者交付及接收说明](../../docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/result.md)、[双环境结果与命令](../../docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/verification.json)、[Python SDK 2.3.0 固定模式实现](https://github.com/modelcontextprotocol/python-sdk/blob/v2.3.0/src/mcp/client/client.py#L452-L467)、[真实需求 #4853](https://github.com/modelcontextprotocol/servers/issues/4853)、[已合实现 #5126](https://github.com/modelcontextprotocol/servers/pull/5126)。原始四文件补丁遵循[上游许可](../../docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/SERVERS-LICENSE.txt)。云端冷读核实 2026-11-07；固定修订页 SHA-256 为 `3c47c5f82ea1d074e17d4483880919381577a8c3ad45cc10661bf5bc96375497`，10226 字节。未验 Windows 原生全套、HTTP、其他 server、LLM 客户端、全仓发布门槛；未修改上游分支或部署。


## wheel 交付：离开源码，再验实际安装包

**editable 安装可直接读到修改后的源码，wheel 消费者读的是上次构建的包。** 用同一个版本号也不能区分两者：本轮基线与四文件迁移后的 wheel 都叫 `mcp-server-time 2026.10.10`，但前者只支持旧协议，后者支持两代。把发布产物安装到新环境，核导入与发行元数据来自该环境，再跑真实入口。

下面从已应用上文四文件补丁的 `src/time` 开始；使用新的树外目录，运行依赖从原锁导出，不让安装过程顺便换 SDK。基线对照时在未打补丁的固定副本重复构建与安装，另用一个消费环境。

```sh
ARTIFACTS=$(mktemp -d)
export UV_PYTHON=3.10
uv export --frozen --no-dev --no-emit-project --output-file "$ARTIFACTS/runtime.txt"
uv build --wheel --out-dir "$ARTIFACTS/wheels"
uv venv --python 3.10 "$ARTIFACTS/consumer"
uv pip install --python "$ARTIFACTS/consumer/bin/python" --require-hashes -r "$ARTIFACTS/runtime.txt"
uv pip install --python "$ARTIFACTS/consumer/bin/python" --no-deps "$ARTIFACTS"/wheels/*.whl
uv pip check --python "$ARTIFACTS/consumer/bin/python"
# 把下段保存为 $ARTIFACTS/installed-smoke.py。
cd "$ARTIFACTS"
env -u PYTHONPATH ./consumer/bin/python installed-smoke.py
```

以下候选 smoke 实际运行模块与控制台入口，各验两代工具列表、相同 schema 和时间转换；打印四行 `PASS`。它不代替错误路径或全发布门槛。

```python
"""Run with the wheel venv's Python, outside checkout, PYTHONPATH unset."""
import asyncio
import importlib.metadata as md
import json
import os
from pathlib import Path
import sys
import sysconfig
import mcp_server_time
from mcp import Client
from mcp.client.stdio import StdioServerParameters

async def main():
    assert 'PYTHONPATH' not in os.environ
    site = Path(sysconfig.get_paths()['purelib']).resolve()
    assert Path(mcp_server_time.__file__).resolve().is_relative_to(site)
    assert Path(md.distribution('mcp-server-time').locate_file('')).resolve() == site
    commands = [(sys.executable, ['-m', 'mcp_server_time']),
                (str(Path(sys.executable).parent / 'mcp-server-time'), [])]
    for command, args in commands:
        schemas = []
        for mode, version in [('legacy', '2025-11-25'), ('2026-07-28', '2026-07-28')]:
            params = StdioServerParameters(command=command, args=args + ['--local-timezone', 'UTC'], env=dict(os.environ))
            async with Client(params, mode=mode, read_timeout_seconds=20) as client:
                assert client.session.protocol_version == version
                listed = await client.list_tools()
                assert [t.name for t in listed.tools] == ['get_current_time', 'convert_time']
                schemas.append([t.model_dump(by_alias=True, exclude_none=True) for t in listed.tools])
                result = await client.call_tool('convert_time', {'source_timezone': 'UTC', 'time': '12:00', 'target_timezone': 'Etc/GMT-5'})
                assert not result.is_error
                data = json.loads(''.join(b.text for b in result.content if b.type == 'text'))
                assert data['target']['datetime'].endswith('T17:00:00+05:00')
                assert data['time_difference'] == '+5.0h'
            print(Path(command).name, mode, 'PASS')
        assert schemas[0] == schemas[1]

asyncio.run(main())
```

**2026-11-08 独立补验**：Linux／Python 3.10.22、mcp 2.3.0；两侧使用相同 `uv.lock` 运行依赖与 Hatchling 1.33.0 构建环境。安装后 `uv pip check` 各核 32 个发行包通过。两侧包字节与对应 wheel 一致，`direct_url.json` 指向各自 wheel，环境无 `.pth`／`.egg-link`；在源码外且没有 `PYTHONPATH` 时，模块、SDK 与发行元数据均来自新环境的 `site-packages`。

- **基线两个入口**：旧代各 9 项契约断言通过；固定新版的实际 `tools/list` 返回 `-32602`，原始 `server/discover` 返回 `-32601` 且进程正常退出，不是安装或启动失败。
- **候选两个入口**：各 20 项既有消费者断言通过，包括两代转换、完整工具契约一致、无效时区／缺参数／未知工具的 `isError`、`ping`／`resources/list` 的准确 JSON-RPC 错误、原始 discovery 与关闭后的新进程连接。两侧两个入口的无效 `--local-timezone` 均 exit 1、无 traceback；上面的最小 smoke 另实跑四项通过。

本次使用[既有探针](../../docs/collaboration/local-jobs/artifacts/A-MCP-TIME-MIGRATION-READER-20261107/probe-time-eras.py)的消费者与断言函数，传入独立安装的命令和干净环境；没有调用会注入源码 `PYTHONPATH` 的 `main_async()`。以下哈希绑定本次实测的包，不表示其他构建工具版本一定重现相同字节。

| 产物 | SHA-256 |
|---|---|
| 固定基线 wheel | `9b377d218c7a05e3da38e5f04a5ccfaf82f95b60956244b6b6c9c92dbb2ce061` |
| 四文件补丁后的 wheel | `cbaac1fc7ae67f77dbbd8fded224237b057f22127e77463ad5a946aab966e0b0` |

**范围**：接收的是这两个固定 wheel 的真实 stdio 消费者，不是新读者实做或本机 V2 通过。源码及锁文件未变，前节 122／133 项原生测试是原轮次证据，本轮未重跑；sdist 独立安装、Windows、HTTP、LLM 客户端与全仓发布门槛未验。固定基线、候选四文件与许可入口沿用前节。
