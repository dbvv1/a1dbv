# 保留外层 coverage 的真实执行记录

**同时使用 `coverage run --branch -m pytest --testmon` 时，先确认外层报告仍记录测试实际执行的代码。** pytest-testmon 固定 main 的检测器始终返回 False，会暂停外层采集器；[本补丁](fix.patch)接回已有检测与提示分支：保留 coverage 测量，让测试照常运行，同时停用 testmon 自身的采集。本补丁已独审，待可写 fork 后向上游提交。

## 复用已审补丁

- 上游问题：[pytest-testmon #270](https://github.com/tarpas/pytest-testmon/issues/270)。基线：`94150742345d0bc3fb00a10c19c0ae26a0064c4e`。
- 补丁 SHA-256：`5298e99c0fe08f0d3571572f00f8cc1cf9c57da144b7b94d1cecc483f178f1e2`；包含生产检测器、恢复被同名覆盖的配置测试和真实子进程回归。
- 在该上游基线的独立工作副本应用，原项目和已安装环境保持不动。POSIX 示例：

```sh
git checkout 94150742345d0bc3fb00a10c19c0ae26a0064c4e
git apply --check /path/to/fix.patch
git apply /path/to/fix.patch
PYTHONPATH="$PWD" python -m pytest tests/test_configure.py tests/test_coverage_detection.py tests/test_xdist_select.py tests/test_db_fingerprints.py -v
```

使用已准备的测试虚拟环境；已验组合见下表。若自己的版本已修复，沿用上游实现；提交新增测试时注意上游 `/tests/` 忽略规则，核实际提交清单。

## 实际变化与验证

同一真实子进程中，三个分类断言原本全部执行，外层报告却漏记第 2–6 行。修后恢复这五行及其分支记录，报告从 10% 回到 100%；改变的是测量完整性，测试代码没有因此覆盖更多行为。

| 验证 | 实际结果 |
|---|---|
| 原生产代码＋新增回归 | 3 failed／5 passed，含正常与失败测试下的外层漏计 |
| Python 3.12／pytest 9.1.1／coverage 7.17.0 | 相关 22 passed；正常选测、pytest-cov 与真实失败退出码保留 |
| Python 3.11／pytest 8.3.5／coverage 7.10.7 | 相关 22 passed |
| 全套上游测试 | 52 passed／2 failed；两项缺失 fixture 在原基线也失败 |

新上下文审查者独立重放红绿、两组相关测试与基线失败，核补丁哈希一致。最低声明版本 coverage 6.5 的外层检测路径另有作者实测；普通选测仍遇上游原有 `run:core` 配置错误，未扩修该独立问题。当前选择与回归结果以表中两组环境为准。

## 做法与来源

这里的选择是复用 `Coverage.current()` 和现成 no-collection 分支，保留已约定的兼容行为；没有把合法工具组合一律改成拒绝。诊断和修复是本仓真实工具维护任务，未做模型或效率对照。

来源：[原始问题](https://github.com/tarpas/pytest-testmon/issues/270)、[固定检测与配置](https://github.com/tarpas/pytest-testmon/blob/94150742345d0bc3fb00a10c19c0ae26a0064c4e/testmon/configure.py)、[Coverage API](https://coverage.readthedocs.io/en/latest/api_coverage.html#coverage.Coverage.current)；核实与实跑：2026-10-27 UTC。上游 MIT 许可随 [LICENSE](LICENSE) 保留。
