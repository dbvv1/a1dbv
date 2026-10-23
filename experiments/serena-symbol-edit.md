# Serena：让 Agent 按方法编辑，而不是维护旧行号

核实：2026-10-24（UTC+8）。Serena 2.1.0、Python/Jedi 后端，临时 stdio MCP 实试。[本仓实试]

**🧪 Agent 已找到要改的方法、但宿主缺少符号编辑接口时，值得试 Serena：用文件＋符号名替换整方法或相邻插入，不必自己维护编辑位置。** 本次插行后仍命中目标；关键限制是它不会保护读取后被别人改过的方法正文。[本仓实试／研究]

## 它解决什么问题，什么时候值得接入

编码 Agent 常先搜索、读代码，再提交修改。搜索解决“在哪儿”，而真正编辑时仍需要明确“改哪个类的哪个方法、从哪里到哪里”。Serena 把这个目标表达成文件内符号路径，例如 `User/to_dict`，由工具定位范围后写入；本次同名方法不明确时拒绝写入，文件前方插行后仍找到原方法。[本仓实试／研究]

| 这次任务 | 优先选择 | Serena 的实际增量 |
|---|---|---|
| 找字符串、配置项或未知实现 | 文本搜索，命中后读相关代码 | 不是搜索的替代品；符号目标确定后才进入编辑 |
| 只改方法内一两行、注释或文档 | 局部文本补丁 | 不必为小改动重发整个方法；有旧文本校验的补丁也可发现上下文变化 |
| 替换完整方法，或在指定方法旁新增定义 | 宿主已有符号编辑则沿用；没有时试 Serena | Agent 可直接传文件＋符号路径，不依赖旧行号；本次验证了插行后的定位 |
| 重命名及其引用更新 | 已有 IDE／语言工具 | 原生 Jedi 的 rename 已跑通，接 Serena 不是获得 rename 能力的必要条件 |
| 多人或多 Agent 正在改同一方法 | 先协调编辑归属，再读当前正文 | Serena 没有旧正文／hash 冲突锁，不能靠符号身份解决并发覆盖 |

以上是任务分流建议，不是工具胜负排名。[经验；原生 Jedi 与 Serena 的固定试用见下]

**值得接入的场景**：Agent 经常需要整方法替换或相邻插入，目标语言后端可用，而当前宿主尚未提供合适的符号编辑工具。只做零散文本修改、已有原生重构足够，或主要难点是多人并发写入，就没有理由仅为本次发现多装一层。[研究：采用判断]

## 最短用法：查当前方法 → 按符号改 → 验结果

配置好项目与 MCP 服务后，先调用 `initial_instructions`，再走三步：[本仓实试]

1. 读目标：`find_symbol(name_path_pattern="User/to_dict", relative_path="test_repo/models.py", include_body=true)`，确认类、方法与当前正文。
2. 整方法替换：`replace_symbol_body(name_path="User/to_dict", relative_path="test_repo/models.py", body=新完整方法正文)`；保留检索正文对应的缩进。需要相邻定义时用 `insert_after_symbol`，仍指定文件与符号。
3. 看差量、重新查符号，跑项目语法／类型检查及针对性行为测试；写入成功只代表工具完成写入。

可给 Agent 的短指令：“在指定文件中定位目标方法，读当前正文后按符号替换；只改这个方法，核对差量并运行相关测试。若有人同时改该方法，先停下协调。”[经验：操作建议]

文件与符号名来自本次公开夹具，换项目须替换参数；首次接入的固定版本与服务命令见[页底研究记录](#研究记录固定环境与执行细节)。

## 本次发现与采用结论

- **能按目标改，而非按旧位置改。** 替换 `User/to_dict` 并相邻插入方法后，解析、真实 import 与窄运行断言通过，其他类／User 其他方法 AST 及其他文件保持不变；读取后在文件首插两行，也仍命中目标并保留插行。[本仓实试]
- **不明确的目标会被挡住。** 缺失的 `User/no_such_method` 报错；未限定的 `to_dict` 报四个候选歧义，两者均不写文件。[本仓实试]
- **符号仍是同一个，不等于正文仍是旧版本。** 外部修改方法返回值后，预先准备的旧正文覆盖新增字段并返回 OK。因此编辑前读当前正文、协调同方法归属；重读本身也不是原子锁。[本仓实试／研究]

**结论：保留原生搜索和重构，把 Serena 当作缺少符号编辑接口时的可选补充。** 五个场景已经足够支持这一窄采用判断；没有测得真实业务任务、token、耗时或模型修复率收益，不据此宣布它胜过文本补丁或原生语言工具。[研究]

本轮工具边界检查到此收口，结论已回流 [03 上下文工程](../docs/03-context-engineering.md#25-跨文件符号检索何时补-serena)。下一项应解决实际修改任务，而不是扩充测试矩阵；已有页面批注后的真实改稿可作为独立工作推进，不算本次 Serena 的收益证据。[范围／后续]

## 研究记录：固定环境与执行细节

以下供复核，不是采用 Serena 的前提清单。

### 环境与启动

按[官方安装文档](https://oraios.github.io/serena/02-usage/010_installation.html)在独立项目副本准备 `serena-agent==2.1.0`；本次固定 `jedi==0.19.2`、`jedi-language-server==0.47.0`、MCP SDK 2.2.0、Python 3.12，并在项目 `.serena/project.yml` 显式选 `language_servers: [python_jedi]`。[本仓实试]

给 MCP 客户端启动的服务命令如下；这是 stdio 服务，不是在 shell 中直接执行工具名。

```sh
SERENA_USAGE_REPORTING=false SERENA_HOME="$PWD/taskhome" \
  HOME="$PWD/taskhome" XDG_CACHE_HOME="$PWD/cache" PATH="$PWD/venv/bin:$PATH" \
  venv/bin/serena start-mcp-server --project "$PWD/fixture" \
  --transport stdio --agent-interface tools \
  --enable-web-dashboard false --open-web-dashboard false \
  --enable-gui-log-window false --log-level WARNING
```

本次客户端是 Python `ClientSession`，完成 initialize／list_tools 后调用 `initial_instructions`；`desktop-app` 只是 Serena 的默认 context 名称，不代表运行了桌面客户端。所有试用服务器已结束，未注册持久 MCP 或调用模型；上面是手动操作入口，不是一键重放包。[本仓实试／范围]

### 固定样本、缩进与复核

[固定公开 Python 夹具](https://github.com/oraios/serena/tree/5e4f5cd173c7ff3eed37ee3f1de6c266b937c5dc/test/resources/repos/python/test_repo)的 20 个文件均与 Git blob 一致；每个场景用干净副本，人工扰动只用于工具契约测试，没有制造新的产品 bug。[本仓实试]

最初调用者把后续行缩进降为 4 空格，工具返回 OK 但 Python 解析失败；按检索正文保留后续行 8 空格、插入方法首行 4 空格后，完整五场景得到上述结果。这个缩进数只属于本夹具，不是跨语言配方。[本仓实试／范围]

原生 Jedi 0.19.2 的 `Script.rename → get_diff → apply` 也实际跑通并通过运行断言。独立评审核了原始 MCP 调用、固定文件／wheel、差异及运行回执，没有重复工具测试。范围限 Python/Jedi 和合成编辑边界，未测真实业务修改、多文件事务、其他后端或模型收益；完整日志不作为读者正文发布。[本仓实试／范围]

### 使用统计与网络观察

首轮启动曾尝试向 `https://oraios-software.de/serena_usage.php` 发送 os、dashboard、version、backend、context、agent_interface 六类字段；本次该请求源码未含代码或账号字段。日志显示 DNS 失败、未见成功响应，非数据包审计，不能宣称绝无送达。[源码／本仓实试]

固定 2.1.0 的 `SERENA_USAGE_REPORTING=false` 在构造请求参数与启动发送线程前返回；本次据此完成全部五场景干净重跑，日志没有使用统计尝试。[源码／本仓实试]

### 源码、历史反馈与许可

[固定编辑实现](https://github.com/oraios/serena/blob/5e4f5cd173c7ff3eed37ee3f1de6c266b937c5dc/src/serena/code_editor.py)会重新解析符号范围，但没有 expected-old-body/hash 参数；这不等于历史位置刷新问题仍全部未修复。[源码／研究]

[#1833](https://github.com/oraios/serena/issues/1833)是写入后调用超时的历史反馈，未证明本版仍复现；[#1956](https://github.com/oraios/serena/issues/1956)及[#1972](https://github.com/oraios/serena/pull/1972)涉及另一语言的声明范围问题，不把本次 Python 结果外推到 TypeScript。[社区／范围]

执行 [PyPI 2.1.0](https://pypi.org/pypi/serena-agent/2.1.0/json) 发布 wheel，SHA-256 `cc6ae542c39b4de5d98cdf35a4ceb0b551f316c5f22e9d0f0b0c5f35d6b95d87`；四份关键源码与固定 `5e4f5cd` 及安装 wheel 逐字节相符，不等于完整供应链审计。当前 main 的 2.1.1.dev0 不是本次运行版本。[一手／本仓实试]

[许可](https://github.com/oraios/serena/blob/5e4f5cd173c7ff3eed37ee3f1de6c266b937c5dc/LICENSE)区分应用 GPL-3.0-or-later 与 SolidLSP 的 MIT 部分，`test/resources/` 也明确列在 MIT 部分；本仓不再分发其包或夹具。[一手]
