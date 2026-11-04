# Python 导入归属：源码开发与 wheel 验收分开核

**验收 wheel 时，核实际加载的模块是否来自已安装的指定产物，而不是要求它落在源码树。** 安装元数据的版本正确，仍可能被当前目录的同名源码遮住。
**namespace package 要核具体子模块和预期搜索位置。** 顶层 `__file__` 可以为空，允许多个根也不代表每个子模块的归属都正确。
本实验在临时环境用四个真实 Python 子进程验证这两个分支；是合成机制试验，不是完整应用、原生 Windows 或长程路线读者验收。

## 怎么复跑

需要 Python 3.9+，且该解释器的 `venv`／`ensurepip` 可用。在仓库根目录运行：

```bash
python3 experiments/python-import-provenance/test_provenance.py
```

脚本创建一次性 venv，用标准库制作无第三方依赖的合成 wheel，再通过该环境的 pip 以 `--isolated --no-index --no-deps --no-cache-dir` 安装。不会连接包仓库、安装全局软件或改已有环境；完成后清理本次临时目录。缺 venv／ensurepip 时测试失败，不跳过或联网补装。

## 四个真实消费者检查

| 场景 | 检查和本次结果 |
|---|---|
| wheel 正常安装 | 隔离解释器实际导入；模块解析路径等于该 distribution 的目标文件，版本为 1.0，模块字节 SHA-256 与指定 wheel 内文件相同，行为值正确。通过。导入位于环境内，不在源码根。 |
| 当前目录遮住 wheel | 已安装元数据仍返回 1.0，但实际行为来自当前目录同名源码；路径断言以 `WRONG_ARTIFACT` 失败。测试确认这次拒绝，不把预期失败算验收通过。 |
| namespace 的合法多根 | 顶层 `__file__ is None`；`__path__` 和 spec 搜索位置均与两个预期根一致；分别核 alpha／beta 的实际路径与行为。通过。 |
| namespace 错根抢先导入 | 搜索根前后交换，并在错误根提供同名 alpha；实际加载错误行为，归属断言以 `WRONG_NAMESPACE_OWNER` 失败。测试确认这次拒绝。 |

2026-11-04 云端 POSIX，Python 3.12.14：4/4 测试通过，包含两条消费者预期失败路径。每次检查启动新解释器，避免旧 `sys.modules` 缓存掩盖导入选择；示例路径以 `resolve()` 后的归属比较，不用字符串前缀。

## 用到自己的项目

- **源码开发**：让运行测试的同一解释器核实际受测模块在目标 worktree 的源码根下，然后再验行为。工作目录正确不是导入来源证明。
- **wheel 验收**：用干净环境安装固定构建产物，在源码目录之外运行消费者；按项目包映射核 distribution 安装位置、实际模块路径、产物内容及行为。`python -I` 可排除当前目录／环境变量参与，但有些应用需要明确入口配置，应按实际部署入口复验。
- **namespace**：先约定哪些子模块归哪个发行包／源码根，再核受测具体模块；若多根是合法设计，就比较整组允许的搜索位置，不能要求所有内容只有一个根。

本试验用纯 Python 包、手制最小 wheel 和显式 namespace 搜索根。未验构建后端、native extension、动态 namespace 变更、editable 安装、原生 Windows、包名与发行包名复杂映射或实际业务应用；不将这四项通过升级为整套依赖隔离或工具推荐。手制 wheel 只是离线夹具，生产交付仍使用项目的正式构建流程。关联的[长程开发路线](../../docs/decisions/long-tasks.md)保持原评级。

## 依据

2026-11-04 的可复跑证据是同目录 `test_provenance.py`；操作语义参照 [Python namespace packages](https://docs.python.org/3/reference/import.html#namespace-packages)、[Python -I](https://docs.python.org/3/using/cmdline.html#cmdoption-I)、[importlib.metadata](https://docs.python.org/3/library/importlib.metadata.html)、[wheel 格式规范](https://packaging.python.org/en/latest/specifications/binary-distribution-format/)。这些链接作为规范入口，本单元未重新回核其在线正文，不将实验日期写成外部来源核实日期。
