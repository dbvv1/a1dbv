# Vue 项目中用 Serena 从接口找到实现类

**遇到 `find_implementations` 的 `Unhandled method textDocument/implementation (-32601)`，先核实际语言服务器路由。** [真实问题 #2218](https://github.com/oraios/serena/issues/2218)中，Vue adapter 把请求交给不支持它的 Vue LS；[本补丁](fix.patch)按已有 definition／rename 路径委派给 companion TypeScript server，并声明相应能力。已有 IDE／TS 服务能完成查询时，继续原入口即可。

## 已审候选与恢复条件

- 上游基线：[773a77e19f0da348f505640c33a8b4e1d7817dc2](https://github.com/oraios/serena/commit/773a77e19f0da348f505640c33a8b4e1d7817dc2)。补丁 5 文件、55 行新增，其中生产改动 12 行；没有改依赖或 hover。
- 补丁 SHA-256：`3a803ea2a23f783bbbe802c5d3a1be3eb48143d9e8d0730ba11d8a69cd31ca26`。可在该固定基线应用 `fix.patch` 后复跑下方检查。
- 本地候选提交：`195392e55503f44804995028de325c1506d7b446`，尚未在上游或 fork 发布；公开可恢复产物是本目录补丁。
- 独立新上下文审查通过。等待可写 fork；发表前重查上游是否已有修复，保留每项目最多一个开放 PR。[CLA](https://github.com/oraios/serena/blob/773a77e19f0da348f505640c33a8b4e1d7817dc2/CLA.md)须贡献者本人审阅决定，尚未代为接受。

## 真实验证

Linux、Python 3.13.5；Vue language-server／typescript-plugin 3.1.5、TypeScript 5.9.3、typescript-language-server 5.1.3。使用隔离 HOME 与 Serena 配置目录，关闭 usage reporting。

| 检查 | 实际结果 |
|---|---|
| 最终两项新测试＋原 adapter | 两项均以真实 LS 的 `-32601` 失败 |
| 修后 Vue suite＋Serena 工具层 | 43 passed，83 deselected；默认调用准确返回唯一 `Square` |
| 项目 format、src／test type-check、空白检查 | 通过 |

在已应用补丁并按上游安装开发依赖的 Serena 根目录运行：

```sh
TEST_HOME=$(mktemp -d)
SERENA_USAGE_REPORTING=false SERENA_HOME="$TEST_HOME" HOME="$TEST_HOME" \
  uv run --no-sync poe test test/solidlsp/vue test/serena/test_serena_agent.py -m vue -q
uv run --no-sync poe format
uv run --no-sync poe type-check
git diff --check
```

验证的是 Vue 项目里的 TypeScript 接口及默认工具参数；独立的 `include_info`／hover 问题未扩修。

## 真实 MCP stdio 入口

**先识别接口模式，再调用符号查询。** 此基线的新建配置默认 REPL，只暴露 `activate_project`、`initial_instructions`、`serena_repl`；需要一工具一操作时，启动参数显式加 `--agent-interface tools`。工具数量不同是接口选择，不必因此重装语言服务器。

本次用官方 MCP Python SDK 2.2.0 的 `ClientSession` 启动实际 Serena stdio 子进程，执行 `initialize` → `tools/list` → `initial_instructions` → 查询。项目 `language_servers: ["vue"]`，使用补丁内 `src/shapes.ts` 夹具；各端项目、HOME、配置和 LSP 缓存独立，dashboard／GUI 关闭。已核实际导入源文件与对应固定 commit 的字节和哈希。

| 路径 | 真实结果 |
|---|---|
| 原基线，显式 tools 接口 | 通信正常，工具 `isError=true`，内容为 LSP `-32601` |
| 已审补丁，同一 tools 输入 | `isError=false`，唯一返回 `Square`／`Class`／`src/shapes.ts` |
| 已审补丁，全新配置默认 REPL | 同一查询返回相同 Square；此项仅补丁 smoke |

tools 接口的 `tools/call` 参数只有：

```json
{"name":"find_implementations","arguments":{"name_path":"Shape","relative_path":"src/shapes.ts"}}
```

REPL 先从 `initial_instructions` 取得本次 session id，再向 `serena_repl` 传 `session` 与 `code`。同一 session 先查 `s.info("lsp.find_implementations")`，再执行 `s.lsp.find_implementations(name_path="Shape", relative_path="src/shapes.ts")`；`s` 是该 REPL 提供的对象，这些代码不是 shell 命令。

协议协商为 `2025-11-25`，Serena `2.1.1.dev0`、Python 3.13.5、Node 24.22.1；语言服务器版本同上。新上下文独立核过协议回执与实际加载来源，修复补丁保持原哈希。范围为 Linux SDK／stdio／Vue-TypeScript 路径；模型、IDE、其他平台／语言及 `.vue` 组件实现语义待验。

**同一成功查询，REPL 用更小的首次服务器应答换一次发现往返。** 对已有两条成功协议复算 `tools/list`、`initial_instructions`、必要的 `s.info` 和最终查询的 `result` JSON：

| 本次实际口径 | Tools | 默认 REPL |
|---|---:|---:|
| 上述四类返回合计，Unicode 码点 | 53,508 | 24,842 |
| 实际 `tools/call` 次数 | 2 | 3（多一次 `s.info`） |

算法为 `len(json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(',', ':')))`；保留嵌套字符串及重复的 content／structuredContent，双方共同的 initialize 430 码点另计。最终结果完全相同。已有直接工具调用流程可保留 Tools；更在意该路径初始返回体积时，可沿原生 REPL。这里量的是 SDK 返回 JSON，客户端给模型的包装、token／费用、稳定时延与长会话摊销未测。

## 来源与许可

[贡献规范](https://github.com/oraios/serena/blob/773a77e19f0da348f505640c33a8b4e1d7817dc2/CONTRIBUTING.md)允许经实际测试／认真审查的小型 AI 辅助修复。补丁保留上游组件许可，新增 SolidLSP 测试与夹具有 MIT SPDX；[Serena／SolidLSP 原许可](https://github.com/oraios/serena/blob/773a77e19f0da348f505640c33a8b4e1d7817dc2/LICENSE)继续适用。核实与运行：2026-10-27。
