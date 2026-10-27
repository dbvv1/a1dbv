# A-TESTMON-PATCH-READER-20261028 · 已审补丁页的实际接入
id: A-TESTMON-PATCH-READER-20261028
owner: dot-A
status: accepted
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: cafdfdbe49723577b9b4620d749d14e93414cb42
result_branch: relay/a-testmon-patch-reader-20261028

## 目标与范围
让没读过这页的读者只按下方全文，把两份已审补丁接到公开上游固定基线，并在一个实际环境跑通页内相关检查；这是新资产的照做验收，不是重做历史选测题或模型 benchmark。
不读旧 testmon 实验／审查／完成记录；页面引用的上游代码、补丁、许可和官方文档可读。读者只记卡点，不改页面、生产代码、补丁或验收断言；另由非读者核实际 diff、版本和命令输出。
在运行器允许的仓外任务 scratch 中准备公开源码副本、虚拟环境与日志。沿已有 Python 和官方依赖，优先页内一个合法组合，报告实际版本；缺运行时或平台审批就保原错误，不装系统工具、不改接收端、不关闭 TLS 校验或绕拒绝。不访问私人会话／配置／账号用量，不用 GUI、浏览器或键鼠。
不重跑三组矩阵、基线红测或完整上游套件；只做同一副本的应用检查与页内相关命令，核真实失败是否原有缺口。不向上游推送、发 PR／评论，不改账号、权限或服务设置；仅接收端按既有流程发布本任务结果分支。

## 独占产物与验收
结果只写 docs/collaboration/local-jobs/artifacts/A-TESTMON-PATCH-READER-20261028/result.md；记录原始目标、具体步骤卡点、真实版本／命令／退出码／通过与失败范围，以及是否需要页外帮助。原日志留仓外到接收结束，不提交原始路径或整份元数据。
本任务是新 reader-test ID；若运行器需 reader-tests 记录，只写本 ID 的新文件，不读取其它读者结果。回 review_ready，不用 accept: auto，由 dot-A 接收；共享最多四并行，无 GPU，单元最多两小时。

## 页面全文（相对链接固定到本轮基线）

# 保留外层 coverage 的真实执行记录

**同时使用 `coverage run --branch -m pytest --testmon` 时，先确认外层报告仍记录测试实际执行的代码。** pytest-testmon 固定 main 的检测器始终返回 False，会暂停外层采集器；[第一份补丁](https://github.com/dbvv1/a1dbv/blob/cafdfdbe49723577b9b4620d749d14e93414cb42/experiments/testmon-outer-coverage/fix.patch)接回已有检测与提示分支，保留外层测量。验证又发现其声明支持的 coverage 6／7.8 会因缺少 `run:core` 直接报错；[配套补丁](https://github.com/dbvv1/a1dbv/blob/cafdfdbe49723577b9b4620d749d14e93414cb42/experiments/testmon-outer-coverage/coverage-core.patch)只捕获实际的 `ConfigError`，让旧版沿原兼容路径运行。两份均已独审，待可写 fork 后一并提交。

## 复用已审补丁

- 上游问题：[pytest-testmon #270](https://github.com/tarpas/pytest-testmon/issues/270)。基线：`94150742345d0bc3fb00a10c19c0ae26a0064c4e`。
- 补丁 SHA-256：`5298e99c0fe08f0d3571572f00f8cc1cf9c57da144b7b94d1cecc483f178f1e2`；包含生产检测器、恢复被同名覆盖的配置测试和真实子进程回归。
- 配套补丁 SHA-256：`67d6960051fde31c2f5a905d292bc00a725c931d5213e0986f4ee2cdcb0231ed`。顺序应用两份后，受检代码树为 `2264b6155ff3e9d908c7d5d5894b2e13ec038168`。
- 在该上游基线的独立工作副本应用，原项目和已安装环境保持不动。POSIX 示例：

```sh
git checkout 94150742345d0bc3fb00a10c19c0ae26a0064c4e
git apply --check /path/to/fix.patch
git apply /path/to/fix.patch
git apply --check /path/to/coverage-core.patch
git apply /path/to/coverage-core.patch
PYTHONPATH="$PWD" python -m pytest tests/test_configure.py tests/test_coverage_detection.py tests/test_coverage_core.py tests/test_xdist_select.py tests/test_db_fingerprints.py -v
```

使用已准备的测试虚拟环境；已验组合见下表。若自己的版本已修复，沿用上游实现；提交新增测试时注意上游 `/tests/` 忽略规则，核实际提交清单。

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

来源：[原始问题](https://github.com/tarpas/pytest-testmon/issues/270)、[固定检测与配置](https://github.com/tarpas/pytest-testmon/blob/94150742345d0bc3fb00a10c19c0ae26a0064c4e/testmon/configure.py)、[Coverage API](https://coverage.readthedocs.io/en/latest/api_coverage.html#coverage.Coverage.current)、[core 自 7.9 引入](https://coverage.readthedocs.io/en/7.14.0/config.html#run-core)；核实与实跑：2026-10-27 UTC。上游 MIT 许可随 [LICENSE](https://github.com/dbvv1/a1dbv/blob/cafdfdbe49723577b9b4620d749d14e93414cb42/experiments/testmon-outer-coverage/LICENSE) 保留。

## 当前结果

已接收[两环境各 29 项通过及安装卡点](artifacts/A-TESTMON-PATCH-READER-20261028/result.md)；读者读过其他任务记录，未通过独立盲读验收。页面已补环境准备，待自然任务再验。
