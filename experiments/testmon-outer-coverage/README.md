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

当前锁定依赖的唯一失败与原基线相同：`test_failed_git_utilities` 假设临时目录的祖先没有 `.git`，此工作区不满足；未删改目录或跳过测试。7.8.2 组另有 `test_subprocess_testmon` 没有生成子进程采集文件：该环境缺少处理 `COVERAGE_PROCESS_START` 的启动 hook，而 7.17 环境安装包自带；这里未增装 hook，相关上游代码保持不变。**两个完整套件都不是全绿**；当轮未跑完整 tox 矩阵、Python 3.14／3.15 与原生 Windows，Python 3.14 后续补验见下节。

## Python 3.14 的现有候选补验

**现有补丁在 Python 3.14.8 保住外层测量与变更选测，但完整套件仍有同一基线失败。** 2026-11-01 沿上述固定 main 和原补丁实跑，补丁及索引树未变；两组均按上游锁文件安装 pytest 9.0.3、coverage 7.17.0、pytest-cov 7.1.0、xdist 3.8.0。报告者的 3.14.9 不在本轮 uv 可下载列表中，实际使用 3.14.8。表内百分比是启用 `--branch` 后的综合覆盖率；原 main 加 testmon 的纯语句覆盖率为 1/6。

| 原生检查／真实输入 | 原 main | 现有候选 |
|---|---|---|
| 完整 `pytest -c tox.ini -q tests` | 246 passed／1 failed／1 skipped／8 xfailed | 262 passed／1 failed／1 skipped／7 xfailed |
| 上文候选定向命令 | 本轮未跑该组合 | 30 passed |
| #270 三项分类断言，不加 testmon | 3 passed；外层记录 100% | 相同 |
| 同输入加 `--testmon` | 3 passed；外层只记第 1 行，10% | 3 passed；第 1–6 行及分支完整，100% |
| #277 两测试调用共享函数，改为等价实现 | 两项均重新执行并通过 | 相同 |
| 再将共享函数改成错误返回值 | 两项均失败，exit 1 | 相同 |

共享函数未改时，两组均明确 deselect 两项；错误返回是本轮追加的失败控制。独立启动探针读到默认 coverage 为 `SysMonitor`、原 `TestmonCollector` 为 `CTracer`：当前 main 已强制使用后者，本补丁保留该行为，**不是试用了上游 [#278](https://github.com/tarpas/pytest-testmon/pull/278) 的保留 sysmon 方案**。候选 Ruff check／format 也通过。

唯一完整套件失败仍是 `test_failed_git_utilities`：本轮临时目录的祖先存在 `.git` 目录，`common.git_path()` 自行向上扫描并返回它；原生 Git 在探针中却报“不是仓库”。拟用 Git ceiling 隔离的控制在这个前提检查即收口，没有用它重跑 pytest、删除挂载或修改断言，首次失败完整保留。

[原始结果的公开投影](python314-results.json)保存 7 条检查、18 条消费者命令、实际导入源／包版本及未继续的 Git 探针，只替换执行路径并附原文件哈希。此项补的是既有代码候选的云端版本验收；完整 tox 矩阵、Python 3.15、原生 Windows 与本机新读者仍待验，不新增操作指南或性能结论。

**依据**：[原输入 #270](https://github.com/tarpas/pytest-testmon/issues/270)、[共享函数输入 #277](https://github.com/tarpas/pytest-testmon/issues/277)、[固定 Git 辅助实现](https://github.com/tarpas/pytest-testmon/blob/6a7fa71d06e47f54f6c0e3c6f52f0f0fe230d349/testmon/common.py#L101-L109)及本轮实际运行；核实／实跑 2026-11-01 UTC。

<a id="sysmon-candidate-choice"></a>

## 是否切换到保留 sysmon 的 #278 候选

**已经用当前 main 的 CTracer 方案保住共享函数选测时，不凭这轮结果改用未合并的 #278。** 候选确实能保留 SysMonitor，并在本例中重新选中两个受影响测试；但没有速度收益证据，仍未修复本页的外层 coverage 漏计，格式检查也未通过。这里保留当前默认，不提供新的安装或切换指南。

本轮独立检出 [#278](https://github.com/tarpas/pytest-testmon/pull/278) 的 `0f9852e61323920ba9bad0114f8cc97edf86216e`，未改源码、未叠加本仓 #270 补丁。Linux／CPython 3.14.8，按候选 `uv.lock` 安装 pytest 9.0.3、coverage 7.17.0、pytest-cov 7.1.0、xdist 3.8.0；不是报告者的 Python 3.14.9／pytest 9.2.0。既有 main 结果复用上一节，没有重跑。

| 原真实输入／检查 | sysmon 候选结果 | ctrace 对照 |
|---|---|---|
| #277 两测试调用共享函数，串行及单 worker | 两种方式初次各 2 passed；未改时 0 执行；等价修改后两项均重跑通过；错误返回时两项均失败、exit 1 | 相同 |
| #270 三项分类断言，外层 `coverage run --branch` 加 `--testmon` | 3 passed，但外层只记第 1 行，漏 2–6 行；综合覆盖率仍 10% | 相同 |
| 候选完整 pytest 套件 | 248 passed／1 failed／1 skipped／7 xfailed | 247 passed／1 failed／1 skipped／8 xfailed |
| Ruff 0.17.3 check／format | check 通过；format 失败，3 个修改文件需换行 | 同一源码检查，不重复执行 |

环境探针确认默认及显式 sysmon 的 testmon 采集器均为 `SysMonitor`。候选通过每测试单独采集、把无 context 的记录归到该测试来保住依赖；**不是 sysmon 新增了动态 contexts**。原报告说多 worker 可能遮住漏选，本轮保留串行和单 worker，不用两测试恰好分到不同进程的绿结果代替。

两套唯一失败都是 `test_failed_git_utilities` 对祖先无 `.git` 的假设，与上一节 main 的既有失败相同；未删目录、改断言或跳过测试。format 是[上游 CI](https://github.com/tarpas/pytest-testmon/blob/0f9852e61323920ba9bad0114f8cc97edf86216e/.github/workflows/ci.yml)也执行的锁定环境检查，不是额外门禁；pre-commit 另锁 Ruff 0.14.7，不能混作本轮结果。尚未核 hosted 运行，不把本地失败说成远端 CI 已失败。

[完整输入与结果投影](sysmon-candidate-results.json)保留命令、stdout／stderr、实际环境、源码与输入 hash，仅归一化试验路径；独审接受这些窄范围事实。未验 Windows、完整 tox 矩阵、全部依赖映射精度或性能；两套运行时长不是受控对照，也没有升级旧读者验收。

**依据**：[#277 原始共享函数输入](https://github.com/tarpas/pytest-testmon/issues/277)、[#270 原始外层测量输入](https://github.com/tarpas/pytest-testmon/issues/270)、[候选固定实现](https://github.com/tarpas/pytest-testmon/blob/0f9852e61323920ba9bad0114f8cc97edf86216e/testmon/testmon_core.py)与本轮实际运行；核实／实跑 2026-11-01 UTC。

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

上述为 2026-10-27 旧基线 `94150742345d0bc3fb00a10c19c0ae26a0064c4e` 的实测，两份补丁分别经过新上下文审查者重放；负责人验过最终组合树与表中三组依赖。正常／xdist／pytest-cov 的依赖选测与真实失败退出码保留；新版本仍强制使用 ctrace，RuntimeError 与普通 CoverageException 继续抛出。原整合补丁的 Python 3.14.8 结果见“Python 3.14 的现有候选补验”；该轮未运行 sysmon 方案，后续独立试用见 [#278 候选](#sysmon-candidate-choice)。

旧资产保留供恢复，不适用于当前基线：[fix.patch](fix.patch)，SHA-256 `5298e99c0fe08f0d3571572f00f8cc1cf9c57da144b7b94d1cecc483f178f1e2`；[coverage-core.patch](coverage-core.patch)，SHA-256 `67d6960051fde31c2f5a905d292bc00a725c931d5213e0986f4ee2cdcb0231ed`。旧组合索引树为 `2264b6155ff3e9d908c7d5d5894b2e13ec038168`。

## 做法与来源

这里的选择是复用 `Coverage.current()` 和现成 no-collection 分支，保留已约定的兼容行为；没有把合法工具组合一律改成拒绝。诊断和修复是本仓真实工具维护任务，未做模型或效率对照。

来源：[原始问题](https://github.com/tarpas/pytest-testmon/issues/270)、[当前固定检测与配置](https://github.com/tarpas/pytest-testmon/blob/6a7fa71d06e47f54f6c0e3c6f52f0f0fe230d349/testmon/configure.py)、[上游测试更新](https://github.com/tarpas/pytest-testmon/commit/dd0bcd1864345d3e81e6250014a819d72499f408)、[Coverage API](https://coverage.readthedocs.io/en/latest/api_coverage.html#coverage.Coverage.current)、[core 自 7.9 引入](https://coverage.readthedocs.io/en/7.14.0/config.html#run-core)；历史实验：2026-10-27 UTC；当前上游整合与实跑：2026-10-30 UTC。上游 MIT 许可随 [LICENSE](LICENSE) 保留。
