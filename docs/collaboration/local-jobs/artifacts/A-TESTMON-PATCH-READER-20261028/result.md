# A-TESTMON-PATCH-READER-20261028 · 结果

## 原始目标

把已审的两份补丁（`experiments/testmon-outer-coverage/fix.patch`、`coverage-core.patch`）接到公开上游 pytest-testmon 的固定基线 `94150742345d0bc3fb00a10c19c0ae26a0064c4e`，在独立工作副本中顺序应用，并在实际 Python 环境跑通页面列出的相关测试；报告真实版本、命令、退出码与通过／失败范围。

## 执行步骤

1. 在仓外任务 scratch 克隆公开上游 `https://github.com/tarpas/pytest-testmon`，检出 `94150742345d0bc3fb00a10c19c0ae26a0064c4e`，`git rev-parse HEAD` 与该基线一致。
2. 按页面 POSIX 顺序先 `git apply --check` 再 `git apply` 两份补丁，两条检查均通过。
3. 复算受检代码树：普通 `git add -A` 后 `git write-tree` 为 `9f2ed30de1e239d714c3c67a701b3d800cd16b75`，与页面不符；原因是上游 `/tests/` 忽略规则，两份补丁新增的测试没有进索引。`git add -f tests/test_coverage_detection.py tests/test_coverage_core.py` 后为 `2264b6155ff3e9d908c7d5d5894b2e13ec038168`，与页面一致。
4. 环境 A：Python 3.12.15 虚拟环境，安装 pytest 9.1.1、coverage 7.17.0、pytest-cov 7.1.0、pytest-xdist 3.8.0，并 `uv pip install -e src`。
5. 在工作副本根目录执行页面命令（解释器换成该虚拟环境的 `python`）：

   ```sh
   PYTHONPATH="$PWD" ../venv/Scripts/python.exe -m pytest tests/test_configure.py tests/test_coverage_detection.py tests/test_coverage_core.py tests/test_xdist_select.py tests/test_db_fingerprints.py -v
   ```

   退出码 0，`29 passed in 60.63s`。
6. 环境 B：Python 3.11.15 虚拟环境，安装 pytest 8.3.5、coverage 7.8.2、pytest-cov 6.2.1、pytest-xdist 3.8.0，同样命令。退出码 0，`29 passed in 55.56s`。

## 真实版本

| 环境 | Python | pytest | coverage | pytest-cov | pytest-xdist | 结果 |
|---|---|---|---|---|---|---|
| A | 3.12.15 | 9.1.1 | 7.17.0 | 7.1.0 | 3.8.0 | 29 passed，exit 0 |
| B | 3.11.15 | 8.3.5 | 7.8.2 | 6.2.1 | 3.8.0 | 29 passed，exit 0 |

页面表中对应行是 Python 3.12.14／pytest 9.1.1／coverage 7.17.0／pytest-cov 7.1.0，以及 Python 3.11.17／pytest 8.3.5／coverage 7.8.2／pytest-cov 6.2.1；本机只有 Python 3.12.15 与 3.11.15，存在补丁级差异，其余版本一致。

## 通过与失败范围

- 页面列出的 5 个测试文件、29 个测试项，在两个环境中全部通过。
- `test_outer_coverage_keeps_test_execution` 的 4 个参数组合通过；该测试直接断言外层 coverage 对被测模块为 100%，即页面所述“报告从 10% 回到 100%”的检查项。
- `test_coverage_core.py::test_missing_core_option` 与 `test_unrelated_error_is_not_hidden` 通过；在 coverage 7.8.2 下确认 `ConfigError` 不是 `CoverageException` 的子类，旧捕获逻辑会漏掉它，配套补丁的捕获范围与实际异常一致。
- 一次中间失败：安装项目本身之前运行同一命令得到 `28 passed, 1 error`，错误是 pytester 子进程报 `unrecognized arguments: --testmon`。这是环境未注册插件入口点，不是补丁或测试失败；`pip install -e .` 后消失。
- 未执行：页面表中的基线红测（3 failed／5 passed、6 failed／1 passed）、三组矩阵重跑、完整上游套件。未向上游推送、未开 PR／评论。
- 页面表中 coverage 6.5.0 的两行未执行：当前配置的包索引只提供 coverage 7.6.1 及以上版本，`coverage==6.5.0` 无法解析。7.8.2 行同样覆盖“缺少 `run:core`、抛 `ConfigError`”的旧版本路径。

## 是否需要页外帮助

需要。页面缺四处可执行信息：已准备测试虚拟环境的位置与创建方式；必须把项目安装进虚拟环境（仅 `PYTHONPATH` 不够）；Windows／Git Bash 下 `PYTHONPATH="$PWD"` 与 `python` 的替代写法；复现 `2264b615…` 树哈希需对 `/tests/` 下新测试 `git add -f`。coverage 6.5.0 的可获取性也需页面确认。详见 `reader-tests/A-TESTMON-PATCH-READER-20261028-u1.md`。

## 产物

- 本文件。
- 读者记录：`reader-tests/A-TESTMON-PATCH-READER-20261028-u1.md`。
- 源码副本、两个虚拟环境与原始日志在仓外任务 scratch，保留到接收结束；未提交、未推送。
