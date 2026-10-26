# 原生符号误配：能解析，不等于配对正确

**先比模块身份，再读函数／行号。** 这个离线小实验编译同一源文件的两个版本：v1 遇缺失房间输出错误和真实本进程调用栈、退出 2；v2 输出可返回／重试的提示、退出 0。它只是命令行错误路径，不是真实游戏菜单、引擎崩溃或自动报告系统。

## 运行

需要 Linux x86_64、Python 3.11+、GCC 与 GNU binutils（`objcopy`、`strip`、`readelf`、`addr2line`）。脚本不安装依赖、不联网、不上传文件；缺必需工具会失败，不 skip。

```bash
python3 experiments/native-symbol-triage/test_triage.py
# 可选：使用已安装的官方 Sentry CLI；必须给可执行文件路径
python3 experiments/native-symbol-triage/test_triage.py --sentry-cli /path/to/sentry-cli
```

默认 **5 项必测**：正常／缺输入、旧错误与修复路径、正确符号的身份与行号、错符号仍可能给出可读结果、缺调试信息／缺文件。可选 CLI 增加第 6 项：两份符号均可用但 ID 不同，限定目录的 ID 查找正确命中、错配／缺失不命中。没传 CLI 就只声明默认 5 项，不能说 CLI 已验。

产物留在本目录 ignored `.work/run-*`：原始合成错误、两版完整／strip 二进制、debug companion、正确／错配解析文本；可选运行另留 `sentry-checks.json`。不会读取玩家数据、真实日志或用户目录。每次结果应与本次产物一起读，不拿别次地址解析。

## 观察与限制

2026-10-26，GCC 14.2.0、GNU binutils 2.44、Python 3.12.14 环境默认 5/5 通过；另用 Sentry CLI 3.8.2 跑含可选项 6/6 通过，无 skip。

- v1 的正确 companion 匹配 Build ID，地址解析到 `open_room`／`room.c:14`；另一版 ID 不同，同地址却解析到 `main`／`room.c:19`。错误的可读行号比 `??` 更容易误导。
- strip 发行二进制在本例无法提供行号；原始符号已另保，不靠事后重编。
- CLI `check --json` 对两份 companion 都给 `is_usable: true`；`find` 按 v1 Debug ID，在正确目录退出 0，在错配／空目录退出 1；缺文件检查也退出 1。
- 本例刻意使用 `-O0 -no-pie`，方便固定布局重现。不同工具链若不再得到误导性可读结果，测试会失败，应记录差异，不改断言凑通过。实际 ASLR／模块重定位、优化／内联、堆栈展开、平台格式及引擎符号必须用目标包核验。

**未运行 Unity／UE、IL2CPP 或远程接收。** v2 只是展示错误路径修改与同输入回归，不代表游戏已可返回菜单或已修复真实缺房原因。详细正常制作链见 [客户端发行后诊断](../../domains/game-dev/04-client-modules.md#发行后诊断从一条反馈找到原因再交付能继续玩的修复)。

本仓仅含原创实验代码，不分发编译器或 Sentry。可选 CLI 3.8.2 为 **FSL-1.1-MIT**，其允许用途／竞争性使用限制见[固定 LICENSE](https://github.com/getsentry/sentry-cli/blob/4602f5e5724d541c17df9119285adf5693c985be/LICENSE)；不要与 MIT 的 Sentry Unity SDK 混同。官方 [debug-files 文档](https://docs.sentry.io/cli/dif/)区分本地检查、查找与上传，本实验只做前两者。
