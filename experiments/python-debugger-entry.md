# Agent 调试 Python：先用 pdb，再选 MCP 入口

核实时间：2026-10-24 UTC+8 / 2026-10-23 UTC。

**已有 shell 的 Python Agent 先用 pdb；需要具名 MCP 调试工具时再试 standalone。** 两条入口都完成本次观察，没有模型收益证据。DebugMCP 的程序输出在 host stderr，不在工具正文中，实际客户端能否交给 Agent 尚未验证。[本仓实试／研究]

## 固定对象

- 公开消费者：dbvv1/a1dbv，commit `95019c15f5a973a7d9774f8e5fc3e0235529c3ba` 的 `scripts/scoreboard.py`。
- 用 `git archive` 原样复制完整快照，不改应用、不造 bug；输入固定 `--today 2026-10-24`，两路线使用同一文件和数据快照。CLI 项目配置单独加入，不被该消费者读取。
- 源文件 SHA256：`7b73f4ec1d7f4583cb645f0c9b6466a1bc204e881b00fe3b2499d0b361f18972`。
- 598 个原样输入文件清单 SHA256：`c2be1fddedf771a799d06504d5abc5859dac8d0cd60c29f75e58a0f9ae71fd80`。
- 消费者只是已有真实程序载体；本回执不公布或解读其评分输出，不开展新审计。

## 预期与实得

| 验收 | pdb | DebugMCP 0.1.2 + debugpy 1.8.22 |
|---|---|---|
| 断点 | `age_days:62` 暂停 | DAP `stopped.reason=breakpoint`，MCP `paused=true` |
| 已知输入 | `checked='2026-10-22'`，`today=datetime.date(2026,10,24)` | 列出 checked/str、today/date；按名读 checked，精确求值 today.isoformat() 得 `2026-10-24` |
| 中间值 | 计算与单步后 `days=2` | 求值为2，单步返回调用方后按名读 days=2 |
| 分支 | `row['stale']=False` | 单步到103行，求值得 False |
| 当前路径 | `docs/00-state-of-ai-coding.md` | 同值 |
| 程序输出 | 与直接执行一致 | 从 MCP 进程 stderr 中提取 debuggee 日志，与直接执行一致 |
| 自然结束 | sys.exit(0)，pdb重新回入口后 q | DAP exited(0)、terminated；MCP no-session |

完整 stdout 是1904字节；直接执行、pdb输出区段、DebugMCP日志输出区段 SHA256 均为 `7ac7d624fadb5b0b7703966e79f82fcf8d5151a79c0ff2492202173dd3d5d881`。提取时去除调试器提示符或 `[info] debuggee:` 包装，本次为一个日志块；CLI 自身会 trimEnd，不能把这种日志路径推广为任意二进制或逐字节流的无损传输。

没有自然异常，故异常路径未测。未测试交互 stdin、测试发现、attach、多语言、真实模型比较或长期稳定性。

## 最短复现

环境：Linux x86_64，Python 3.12.14，Node v24.19.0，npm 11.9.0。在隔离目录中准备原样公开快照为 `consumer/`。

```sh
python3 -m venv .venv
.venv/bin/python -m pip install debugpy==1.8.22
npm --cache ./npm-cache pack debugmcp@0.1.2
tar xzf debugmcp-0.1.2.tgz
.venv/bin/python consumer/scripts/scoreboard.py --today 2026-10-24
.venv/bin/python -m pdb consumer/scripts/scoreboard.py --today 2026-10-24
```

pdb 命令依次为：

```text
b 62
c
p checked
p today
p (today - date.fromisoformat(checked)).days
n
n
p days
p str(path.relative_to(root))
n
p row["stale"]
clear 1
c
q
```

DebugMCP 使用临时 stdio client 启动 `node package/dist/debugmcp.js serve --stdio --timeout 30`，不执行 configure、不注册到个人 MCP 客户端、不安装个人 Skill。项目适配器配置指向隔离 Python 的 `-m debugpy.adapter`，type=python、extensions=[.py]、transport=stdio；launch 包含 program=${file}、cwd=${workspaceFolder}、python=隔离解释器、args=[--today,2026-10-24]、console=integratedTerminal、justMyCode=true。本次为取原始 DAP 证据，在 stdio 前加了不改字节的记录 shim。

JSON-RPC initialize/initialized 后工具序列：

```text
add_breakpoint(fileFullPath=<scoreboard.py>, line=62)
start_debugging(fileFullPath=<scoreboard.py>, workingDirectory=<consumer>, configurationName=python)
get_debug_status()
list_variable_names(scope=local)
get_variables_values(scope=local, variableNames=[checked,today])
evaluate_expression((today - date.fromisoformat(checked)).days)
evaluate_expression(today.isoformat())
step_over()
step_over()
get_variables_values(scope=local, variableNames=[days])
evaluate_expression(str(path.relative_to(root)))
step_over()
evaluate_expression(row['stale'])
get_debug_status()
clear_all_breakpoints()
continue_execution()
get_debug_status()  # running；不是完成
get_debug_status()  # no-session
stop_debugging()    # No active debug session to stop
```

## 试到的边界

MCP 入口有具名工具与参数 schema，但取值／求值主要仍是 content 中的人类可读文本，不是统一的强类型结果；没有证明比终端更好解析或更省上下文。[源码／本仓实试]


[经验] 读取 date 对象的具名变量结果包含很长的特殊方法类型树，精确求值更直接。本次 `continue_execution` 后首次状态仍为 running，约0.5秒后再查为 no-session。第一次探索回合立即 stop，第二回合补齐自然退出证据。

[经验] 自然完成后 MCP 主进程在 stdin EOF 后8秒仍未退出，测试 harness 对其进程组发送 SIGTERM，退出码-15；这是 host 清理，不是应用失败。结束后的独立进程检查未见本次程序或 debugpy.adapter；机器回执中的清理叙述本身不是进程扫描记录。

[一手+经验] 本次 stdout 在 host stderr 日志，不在 tools/call 正文中；普通 MCP 客户端是否把 stderr 呈现给 Agent 未验证。源码的 runInTerminal 使用 `stdio: ['ignore','pipe','pipe']`，不应把 integratedTerminal 名称理解成可交互终端。未测试交互输入。

[一手] CLI README 明确不支持 VS Code 测试发现 API；同包 debug-live Skill 却仍建议 testName 路由该 API，不能照搬。需配置 adapter launch 来运行测试 runner。

## 来源与供应链记录

- [Microsoft DebugMCP 固定源码](https://github.com/microsoft/DebugMCP/tree/0c4cae41769e8ce80f7eca25ed83bef1c649ebb4)：取回 main 为该 SHA，2026-10-18 提交；根 package.json 是扩展2.4.3，npm/cli 是0.1.2，分开计版本。
- [npm registry debugmcp 0.1.2](https://registry.npmjs.org/debugmcp/0.1.2)：repository 指向 microsoft/DebugMCP，包内 LICENSE 为 Microsoft MIT。实际执行 registry 发布包，不是将最新源码假称发布包。metadata gitHead=`53915b972f6ca9c5814c1c009849d287ca59172d`，与当前 HEAD 不同；两 SHA 的 src/cli 无差异。
- tarball SHA256=`ac1a9c4f05fbc37a1f4098cfb456628fcefb221d5df4e0d64cc26ce5284ebbeb`；SHA1、SHA512 与 registry dist 字段逐字节匹配。SHA512=`ABANd/7yTNNUQRivJeaioiBcVKMdmcvJp6GO6Wms/SX1dext6CwwLzNnu6QYx+4YhGcrKdUmdu0BPElFjb7ing==`。metadata 有 registry signatures，但本次未独立验签；无 attestations 字段，不能称已验证构建 provenance 或源码可复现构建。
- [Microsoft debugpy](https://github.com/microsoft/debugpy) / [PyPI 1.8.22](https://pypi.org/project/debugpy/1.8.22/)：MIT；wheel `debugpy-1.8.22-cp312-cp312-manylinux_2_34_x86_64.whl` SHA256=`8a697acec45dbc70d17fb5d9f4f61989fc294d273c69de487fd10cb35fdd75eb`，与 PyPI 元数据匹配。
- [pdb 官方文档](https://docs.python.org/3/library/pdb.html)：CLI断点、单步、状态检查及完成后重启行为。
- [上游 #31](https://github.com/microsoft/DebugMCP/issues/31)：真实诉求是解除 IDE 依赖，维护者于2026-09-27以独立CLI发布关闭；不能继续写“必须VS Code”。
- [AGRO 集成原文](https://agro.mifune.dev/docs/integrations/debugmcp)：2026-06-23的Python调试实践走 VS Code attach-to-container + 扩展2.0.1；不是独立CLI采用证据，也不能代表当前广泛采用。

探索回执：本轮是已有候选的限定实试，核对官方源码／README、npm与PyPI元数据、上游原始issue、AGRO原文、Python文档；没有重复全渠道前沿扫描，没有宣称当前最强。

独立评审核了固定快照、原始 pdb／MCP／DAP 记录、输出提取与当前无残留状态，没有重复运行。本文给出手动命令与工具序列，不承诺一键完整重放。[范围]
