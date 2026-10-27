# 保留外层 coverage 的真实执行记录

**同时使用 `coverage run --branch -m pytest --testmon` 时，先确认外层报告仍记录测试实际执行的代码。** pytest-testmon 固定 main 的检测器始终返回 False，会暂停外层采集器；[第一份补丁](fix.patch)接回已有检测与提示分支，保留外层测量。验证又发现其声明支持的 coverage 6／7.8 会因缺少 `run:core` 直接报错；[配套补丁](coverage-core.patch)只捕获实际的 `ConfigError`，让旧版沿原兼容路径运行。两份均已独审，待可写 fork 后一并提交。

## 复用已审补丁

- 上游问题：[pytest-testmon #270](https://github.com/tarpas/pytest-testmon/issues/270)。基线：`94150742345d0bc3fb00a10c19c0ae26a0064c4e`。
- 补丁 SHA-256：`5298e99c0fe08f0d3571572f00f8cc1cf9c57da144b7b94d1cecc483f178f1e2`；包含生产检测器、恢复被同名覆盖的配置测试和真实子进程回归。
- 配套补丁 SHA-256：`67d6960051fde31c2f5a905d292bc00a725c931d5213e0986f4ee2cdcb0231ed`。

**先用 Python 3.11 与 coverage 7.8.2 这一组复现。** 准备 Git、已安装的 Python 3.11（记录实际补丁版本即可），在新建工作目录中把上面两份补丁的原始内容分别保存为 `fix.patch`、`coverage-core.patch`。以下只修改独立副本和新虚拟环境，原项目与原环境保持不动；若自己的版本已修复，沿用上游实现。

先取固定源码并应用补丁，POSIX 与 Windows 均在这个新工作目录运行：

```sh
git clone https://github.com/tarpas/pytest-testmon.git src
cd src
git checkout --detach 94150742345d0bc3fb00a10c19c0ae26a0064c4e
git apply --check ../fix.patch
git apply ../fix.patch
git apply --check ../coverage-core.patch
git apply ../coverage-core.patch
git add -u
git add -f tests/test_coverage_detection.py tests/test_coverage_core.py
git write-tree
```

`git write-tree` 应输出 `2264b6155ff3e9d908c7d5d5894b2e13ec038168`。这需要把两份新增测试也暂存：上游忽略整个 `/tests/`，普通 `git add -A` 会漏掉它们。这里只核对索引树，不需要提交。

然后留在 `src` 目录创建虚拟环境、安装测试依赖和项目，再运行相关测试。**不要省略 `-e .` 这一步项目安装：它注册 pytest 插件入口点，仅设 `PYTHONPATH` 无法让 pytester 找到 `--testmon`。** 命令直接指定虚拟环境解释器，不需要激活，也不需要 `PYTHONPATH`。

POSIX：

```sh
python3.11 -m venv ../venv
../venv/bin/python -m pip install "pytest==8.3.5" "coverage==7.8.2" "pytest-cov==6.2.1" "pytest-xdist==3.8.0" -e .
../venv/bin/python -m pytest tests/test_configure.py tests/test_coverage_detection.py tests/test_coverage_core.py tests/test_xdist_select.py tests/test_db_fingerprints.py -v
```

Windows PowerShell（使用 Python Launcher 选择 3.11）：

```powershell
py -3.11 -m venv ../venv
& ../venv/Scripts/python.exe -m pip install "pytest==8.3.5" "coverage==7.8.2" "pytest-cov==6.2.1" "pytest-xdist==3.8.0" -e .
& ../venv/Scripts/python.exe -m pytest tests/test_configure.py tests/test_coverage_detection.py tests/test_coverage_core.py tests/test_xdist_select.py tests/test_db_fingerprints.py -v
```

Git Bash 使用上面 Windows 三行时，去掉后两行开头的 `& `；不要改回裸 `python` 或设置 MSYS 风格的 `PYTHONPATH`。预期为 `29 passed`、退出码 0；pytest-xdist 支持 `-n` 分支，pytest-cov 支持 `--cov` 分支，二者都要安装。下表 coverage 6.5.0 行保留此前实测结果，不是本次复现的必装版本；索引不提供 6.5.0 时无需切换索引，7.8.2 同样覆盖缺少 `run:core` 的兼容路径。

## 实际变化与验证

同一真实子进程中，三个分类断言原本全部执行，外层报告却漏记第 2–6 行。修后恢复这五行及其分支记录，报告从 10% 回到 100%；改变的是测量完整性，测试代码没有因此覆盖更多行为。

| 验证 | 实际结果 |
|---|---|
| 原生产代码＋外层测量回归 | 3 failed／5 passed，含正常与失败测试下的外层漏计 |
| 原生产代码＋旧 core 回归 | coverage 6.5／7.8.2 各 6 failed／1 passed |
| 两补丁，Python 3.11.17／pytest 8.3.5／coverage 6.5.0／pytest-cov 4.1.0 | 相关 29 passed |
| 两补丁，Python 3.11.17／pytest 8.3.5／coverage 7.8.2／pytest-cov 6.2.1 | 相关 29 passed |
| 两补丁，Python 3.12.14／pytest 9.1.1／coverage 7.17.0／pytest-cov 7.1.0 | 相关 29 passed |
| 两补丁全套，coverage 6.5 与 7.17 | 各 59 passed／2 failed；两项缺失 fixture 在原基线也失败 |

两份补丁分别经过新上下文审查者重放；负责人随后验最终组合树与上表三组合法依赖。正常／xdist／pytest-cov 的依赖选测与真实失败退出码保留；新版本仍强制使用 ctrace，RuntimeError 与普通 CoverageException 继续抛出。Python 3.14 的默认 sysmon 路径待实际环境验证。

## 做法与来源

这里的选择是复用 `Coverage.current()` 和现成 no-collection 分支，保留已约定的兼容行为；没有把合法工具组合一律改成拒绝。诊断和修复是本仓真实工具维护任务，未做模型或效率对照。

来源：[原始问题](https://github.com/tarpas/pytest-testmon/issues/270)、[固定检测与配置](https://github.com/tarpas/pytest-testmon/blob/94150742345d0bc3fb00a10c19c0ae26a0064c4e/testmon/configure.py)、[Coverage API](https://coverage.readthedocs.io/en/latest/api_coverage.html#coverage.Coverage.current)、[core 自 7.9 引入](https://coverage.readthedocs.io/en/7.14.0/config.html#run-core)；核实与实跑：2026-10-27 UTC。上游 MIT 许可随 [LICENSE](LICENSE) 保留。
