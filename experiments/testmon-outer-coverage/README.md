# 保留外层 coverage 的真实执行记录

**同时使用 `coverage run --branch -m pytest --testmon` 时，先确认外层报告仍记录测试实际执行的代码。** 当前固定 main 仍会暂停外层采集器；[整合补丁](current-main.patch)恢复已有的检测与提示分支，并修正旧版 coverage 缺少 `run:core` 时的异常捕获。上游已自行修好配置测试，不要再把旧补丁整份叠上去。候选尚待可写 fork；完整测试仍有下述未通过项。

## 在当前基线上复用

- 上游问题：[pytest-testmon #270](https://github.com/tarpas/pytest-testmon/issues/270)。固定基线：`6a7fa71d06e47f54f6c0e3c6f52f0f0fe230d349`。
- `current-main.patch` SHA-256：`ddeec4f289ed869bb9c6e983225503c5d27ef3210b1ef8ecc6546a328d3a3461`。

**先用 Python 3.11 与 coverage 7.8.2 复现这两个问题。** 准备 Git、Python 3.11，在新建工作目录中把整合补丁原始内容保存为 `current-main.patch`。以下只修改独立副本和新虚拟环境；自己的版本若已修复，沿用上游实现。

```sh
git clone https://github.com/tarpas/pytest-testmon.git src
cd src
git checkout --detach 6a7fa71d06e47f54f6c0e3c6f52f0f0fe230d349
git apply --check ../current-main.patch
git apply --index ../current-main.patch
git write-tree
```

索引树应为 `468804f7017eda3415bf425907372796de90cc19`。`--index` 同时纳入新增测试：上游忽略整个 `/tests/`，普通 `git add -A` 会漏掉它们。这里只核对，不需要提交。

留在 `src` 中安装项目与测试依赖；`-e .` 注册 pytest 插件入口，不能只设 `PYTHONPATH`。把新虚拟环境放在**当前终端**的 PATH 首位，是为了上游既有测试调用的裸 `coverage`／`python` 也使用同一环境。

POSIX：

```sh
python3.11 -m venv ../venv
../venv/bin/python -m pip install "pytest==8.3.5" "coverage==7.8.2" "pytest-cov==6.2.1" "pytest-xdist==3.8.0" -e .
export PATH="$(cd ../venv/bin && pwd):$PATH"
python -m pytest -c tox.ini tests/test_configure.py tests/test_coverage_detection.py tests/test_coverage_core.py tests/test_xdist_select.py tests/test_db_fingerprints.py tests/test_testmon.py::TestPytestReportHeader::test_deactivated_bc_coverage -v
```

Windows PowerShell（使用 Python Launcher；命令未在原生 Windows 实跑）：

```powershell
py -3.11 -m venv ../venv
& ../venv/Scripts/python.exe -m pip install "pytest==8.3.5" "coverage==7.8.2" "pytest-cov==6.2.1" "pytest-xdist==3.8.0" -e .
$env:Path = "$((Resolve-Path ../venv/Scripts).Path);$env:Path"
& ../venv/Scripts/python.exe -m pytest -c tox.ini tests/test_configure.py tests/test_coverage_detection.py tests/test_coverage_core.py tests/test_xdist_select.py tests/test_db_fingerprints.py tests/test_testmon.py::TestPytestReportHeader::test_deactivated_bc_coverage -v
```

预期 `30 passed`、退出码 0。pytest-xdist 与 pytest-cov 都要安装，分别覆盖 `-n` 与 `--cov` 分支；这个命令验证受影响行为，不代表全套通过。

## 当前基线的整合与验证

上游 `dd0bcd1` 已恢复两项配置测试及正确的 `TmConf` 调用；整合版保持它们原样，也保留新的连接清理、subprocess 与 xdist 代码。完整测试发现，修复让上游外层 coverage 测试严格 XPASS；整合版仅移除该测试的旧 xfail 标记，断言不变。

Linux／Python 3.11.17 实测；两组均安装 pytest-xdist 3.8.0：

| 范围 | 结果 |
|---|---|
| 原生产代码＋旧候选的 29 项回归，pytest 9.0.3／coverage 7.17.0／pytest-cov 7.1.0 | 4 failed／25 passed |
| 原生产代码＋同 29 项，pytest 8.3.5／coverage 7.8.2／pytest-cov 6.2.1 | 11 failed／17 passed／1 error；包含真实 `run:core` 配置错误 |
| 整合版，上面读者命令（增加既有 header 测试） | 两组各 30 passed |
| 上游完整原套件，当前锁定依赖 | 1 failed／246 passed／1 skipped／8 xfailed |
| 整合版完整套件，当前锁定依赖 | 1 failed／262 passed／1 skipped／7 xfailed |
| 整合版完整套件，coverage 7.8.2 组 | 2 failed／261 passed／1 skipped／7 xfailed |
| Ruff check／format check | 均通过，未改上游格式配置 |

当前锁定依赖的唯一失败与原基线相同：`test_failed_git_utilities` 假设临时目录的祖先没有 `.git`，此工作区不满足；未删改目录或跳过测试。7.8.2 组另有 `test_subprocess_testmon` 没有生成子进程采集文件：该环境缺少处理 `COVERAGE_PROCESS_START` 的启动 hook，而 7.17 环境安装包自带；这里未增装 hook，相关上游代码保持不变。**两个完整套件都不是全绿**；完整 tox 矩阵、Python 3.14／3.15 与原生 Windows 未验证。

## 历史实验与旧补丁

同一真实子进程中，三个分类断言原本全部执行，外层报告却漏记第 2–6 行。修后恢复这五行及其分支记录，报告从 10% 回到 100%；改变的是测量完整性，测试代码没有因此覆盖更多行为。

| 验证 | 实际结果 |
|---|---|
| 原生产代码＋外层测量回归 | 3 failed／5 passed，含正常与失败测试下的外层漏计 |
| 原生产代码＋旧 core 回归 | coverage 6.5／7.8.2 各 6 failed／1 passed |
| 两补丁，Python 3.11.17／pytest 8.3.5／coverage 6.5.0／pytest-cov 4.1.0 | 相关 29 passed |
| 两补丁，Python 3.11.17／pytest 8.3.5／coverage 7.8.2／pytest-cov 6.2.1 | 相关 29 passed |
| 两补丁，Python 3.12.14／pytest 9.1.1／coverage 7.17.0／pytest-cov 7.1.0 | 相关 29 passed |
| 两补丁全套，coverage 6.5 与 7.17 | 各 59 passed／2 failed；两项缺失 fixture 在原基线也失败 |

上述为 2026-10-27 旧基线 `94150742345d0bc3fb00a10c19c0ae26a0064c4e` 的实测，两份补丁分别经过新上下文审查者重放；负责人验过最终组合树与表中三组依赖。正常／xdist／pytest-cov 的依赖选测与真实失败退出码保留；新版本仍强制使用 ctrace，RuntimeError 与普通 CoverageException 继续抛出。Python 3.14 的默认 sysmon 路径待实际环境验证。

旧资产保留供恢复，不适用于当前基线：[fix.patch](fix.patch)，SHA-256 `5298e99c0fe08f0d3571572f00f8cc1cf9c57da144b7b94d1cecc483f178f1e2`；[coverage-core.patch](coverage-core.patch)，SHA-256 `67d6960051fde31c2f5a905d292bc00a725c931d5213e0986f4ee2cdcb0231ed`。旧组合索引树为 `2264b6155ff3e9d908c7d5d5894b2e13ec038168`。

## 做法与来源

这里的选择是复用 `Coverage.current()` 和现成 no-collection 分支，保留已约定的兼容行为；没有把合法工具组合一律改成拒绝。诊断和修复是本仓真实工具维护任务，未做模型或效率对照。

来源：[原始问题](https://github.com/tarpas/pytest-testmon/issues/270)、[当前固定检测与配置](https://github.com/tarpas/pytest-testmon/blob/6a7fa71d06e47f54f6c0e3c6f52f0f0fe230d349/testmon/configure.py)、[上游测试更新](https://github.com/tarpas/pytest-testmon/commit/dd0bcd1864345d3e81e6250014a819d72499f408)、[Coverage API](https://coverage.readthedocs.io/en/latest/api_coverage.html#coverage.Coverage.current)、[core 自 7.9 引入](https://coverage.readthedocs.io/en/7.14.0/config.html#run-core)；历史实验：2026-10-27 UTC；当前上游整合与实跑：2026-10-30 UTC。上游 MIT 许可随 [LICENSE](LICENSE) 保留。
