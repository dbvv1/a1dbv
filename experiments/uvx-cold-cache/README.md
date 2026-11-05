# 多会话 uvx 冷启动：预热只缓解同一解析的重复环境

**同一工具被多个编码会话同时冷启动时，可先串行完成一次相同命令的安全探针，再并发启动。** uv 0.13.7 的这次实跑中，八个调用全部成功，但冷缓存留下四个工具环境、只有一个被环境索引引用；预热后的同并发只留下一个环境。这是缓存占用风险，不是工具运行失败或环境内容损坏。

不要为了预热启动真实业务任务或长驻 MCP 后不退出。先确认工具有无副作用、会退出的探针，且和随后启动使用同一解释器、依赖解析与缓存目录；没有这种入口就不照搬 `--help`。频繁启动大型 MCP 的机器值得排查，单次调用或已有热缓存不必另加编排。

## 已验证的操作

本次固定官方 PyPI `uv==0.13.7`、`pycowsay==0.0.0.2`，同一个 Python 3.12.14、Linux。复现用户 #23115 的小工具路径，不接真实 MCP、云账户或模型。独立临时缓存中：

1. **冷并发**：八个 `uv tool run --from pycowsay==0.0.0.2 pycowsay --help` 均退出 0；四个 `pyvenv.cfg` 对应的环境只有一条 `environments-v2` 索引链接，三个不被该索引引用。
2. **随后三次串行**：均退出 0，仍有四个环境，不会仅因再次运行而收掉多余环境。
3. **另一全新缓存，先串行一次**：成功后八并发，再三次串行，始终只有一个环境和一条链接。

初始保留宿主配置的探针曾得到八个冷环境；最终隔离配置、显式 PyPI 的 runner 得到四个，二者都只留一条索引。这也说明重复数量受调度等条件影响，不能固定为并发数。全部环境只有同版 pycowsay；每组包内 Python 源文件哈希一致。没有据目录数推算实际磁盘占用、节省百分比或速度；硬链接、缓存其他内容及调度都会影响这些值。原作者关于 235 GB、多种 MCP 的报告是其自报，未由本仓重现。

**版本固定不等于完整依赖锁。** 本次 pycowsay 没有额外依赖；真实服务器只 pin 顶层版本，间接依赖仍可能改变解析并产生新环境。预热只缓解这次同解析的冷启动竞争，不清理历史环境、不解决长期版本增长，也不是跨进程去重保证。

## 复跑与判断

复制本目录到临时目录，先安装工具，再执行：

```sh
python3 -m venv tools
tools/bin/pip install -r requirements.txt
python3 replay.py tools/bin/uv
```

runner 使用当前 Python 的明确路径、禁自动下载解释器，忽略 uv 配置，显式指定官方 PyPI；HOME、`UV_CACHE_DIR`、`UV_TOOL_DIR` 都放新临时目录。沿用宿主已有代理与 CA 环境变量，不放宽 TLS 验证；不读取或清理用户缓存，不调用 `uv cache prune`，不改系统设置。PyPI 安装和冷启动需要联网。uv 为 MIT OR Apache-2.0，pycowsay 为 MIT。

[本次结果](result.json)记录逐阶段计数；stderr 给出保留的逐命令输出与临时目录。冷启动竞争依赖调度，复跑不保证正好八个环境；看 `coldDuplicationObserved` 与实际计数，不能把 runner 退出 0 单独当成复现成功。退出 0 表示调用成功、包内容核验成立且观察已完成。`warmControlSingleEnvironment` 单独报告预热控制结果。缺参数、uv 路径不存在、Python `-O` 均拒绝运行。

runner 整理时去掉宿主网络变量曾分别遇到 DNS／证书错误，未产生有效竞争结果；最终沿用已有代理和 CA 配置，并未禁用证书检查。原始探针第一次只指定 cache、没有指定 tool dir，因宿主 HOME 只读而退出 2，尚未进入所测竞争。随后改为明确隔离 tool dir 才获得上述成功结果；没有更改 HOME 权限。Python 3.12 对 pycowsay 的反斜线有 SyntaxWarning，但命令成功，原始输出保留，未把 warning 隐去当无告警。

## 一手机制与范围

[固定 uv 0.13.7 源码](https://github.com/astral-sh/uv/blob/316c827e058c16b71d5c507a20729c2995a7bcce/crates/uv-environment-operations/src/environment.rs)先以解析与解释器计算环境键，再读索引；未命中时各自创建临时环境、安装并 persist。该路径支持观察到的“多个环境对应同一索引键”，但不是整份并发实现的安全审计。

[官方缓存文档](https://github.com/astral-sh/uv/blob/316c827e058c16b71d5c507a20729c2995a7bcce/docs/concepts/cache.md)允许并发、明确不要直接修改缓存；提供 `uv cache prune` 清理不用内容，但它还涉及集中式项目环境，不能为本问题默认代用户执行。这里不提供手工删除 archive 子目录的做法。

**依据**：[真实使用者 #23115](https://github.com/astral-sh/uv/issues/23115)、上述固定源码及文档、官方 PyPI 安装包。本次查询 issue 为 open、无评论；latest 为 0.13.7。未测 macOS、Windows、真实 MCP 初始化、长期重复升级或完整 uv 测试，未修改上游、投稿或增加默认规则。核实与实跑：2026-11-05。
