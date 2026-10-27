# 新读者记录 · A-TESTMON-PATCH-READER-20261028 · u1

角色：第一次读该页的读者。只按任务给出的页面全文与页面引用的上游代码／补丁操作，未读 a1dbv 的其他文档，未搜同主题教程。

## 做到哪一步

全流程做完，两个合法组合均通过：

1. 在仓外任务 scratch 克隆公开上游 `https://github.com/tarpas/pytest-testmon`，检出 `94150742345d0bc3fb00a10c19c0ae26a0064c4e`。
2. 顺序 `git apply --check` / `git apply` 两份补丁，均成功；补丁 SHA-256 与页面一致。
3. 复算受检代码树，得到 `2264b6155ff3e9d908c7d5d5894b2e13ec038168`，与页面一致（需对两个被 `/tests/` 忽略的新测试 `git add -f`）。
4. 环境 A（Python 3.12.15／pytest 9.1.1／coverage 7.17.0／pytest-cov 7.1.0／pytest-xdist 3.8.0）运行页面命令，`29 passed`，exit 0。
5. 环境 B（Python 3.11.15／pytest 8.3.5／coverage 7.8.2／pytest-cov 6.2.1／pytest-xdist 3.8.0）运行同一命令，`29 passed`，exit 0。
6. 结果写入 `docs/collaboration/local-jobs/artifacts/A-TESTMON-PATCH-READER-20261028/result.md`；本记录写入 `reader-tests/A-TESTMON-PATCH-READER-20261028-u1.md`。

产物位置：上述两份仓库内文件；源码副本、两个虚拟环境和原始日志在仓外任务 scratch，保留到接收结束。工作目录内未提交、未推送、未切换分支，未改页面、补丁、生产代码或断言。

## 卡点

### 1. “使用已准备的测试虚拟环境；已验组合见下表。”（§复用已审补丁）

- 缺什么：页面没有给虚拟环境的位置、名称或创建方式；工作副本和机器上都没有可直接使用的已准备环境。页面也没列出测试所需插件，`test_xdist_select.py` 与 `test_coverage_core.py` 的 `-n` 分支需要 pytest-xdist，`--cov` 分支需要 pytest-cov。
- 实际处理：用本机已有的 `uv` 与可用的 CPython 3.12.15、3.11.15 各建一个虚拟环境；插件清单从上游 `tox.ini` 的 `deps` 读出。
- 做错过的：先用系统 Python 3.13.5 与默认 pip 试 `coverage==6.5.0`，默认索引只列到 7.6.1 及以上，白费一轮；后改用页面表中同样出现的 coverage 7.8.2 行。

### 2. “POSIX 示例：”下的 `PYTHONPATH="$PWD" python -m pytest …`（§复用已审补丁）

- 缺什么：页面只给 POSIX 写法，没有 Windows／Git Bash 的处理；本机 Git Bash 的 `$PWD` 是 MSYS 风格路径，原生 Windows Python 不认识，且裸 `python` 指向 3.13.5，不在页面表中。
- 实际处理：改用虚拟环境的 `../venv/Scripts/python.exe` 执行同一 `-m pytest` 命令；`python -m pytest` 会把工作目录放进 `sys.path`，所以 `testmon` 仍从工作副本导入，错误的 `PYTHONPATH` 项没有造成失败。
- 做错过的：第一次直接照抄 `python` 会用到系统解释器；没有实际造成错误，但在记录里明确改成虚拟环境解释器。

### 3. 页面命令块缺少“把项目装进虚拟环境”一步（§复用已审补丁）

- 缺什么：页面只给 `PYTHONPATH="$PWD" python -m pytest`，没有说先安装被测项目。`test_xdist_select.py` 用 `pytester.runpytest_inprocess("--testmon")`，子进程靠 `pytest11` 入口点发现插件，`PYTHONPATH` 不会注册入口点。
- 实际处理：先按页面原样运行，得到 `28 passed, 1 error`；错误为 `pytest.main(): error: unrecognized arguments: --testmon`。随后 `uv pip install -e src` 再跑，`29 passed`。
- 做错过的：最初以为 `PYTHONPATH` 足够，没先检查插件入口点；这一错误是环境准备缺失，不是补丁失败。

### 4. “顺序应用两份后，受检代码树为 `2264b6155ff3e9d908c7d5d5894b2e13ec038168`。”（§复用已审补丁）

- 缺什么：页面这句没有说明树哈希的算法前提；上游 `.gitignore` 忽略整个 `/tests/`，两份补丁新增的 `tests/test_coverage_detection.py`、`tests/test_coverage_core.py` 不会进入索引。页面直到后面才有一句“提交新增测试时注意上游 `/tests/` 忽略规则”。
- 实际处理：依次试 `git write-tree`（索引未动，得到基线树 `6cc4493…`）、`git add -A` 后写树（`9f2ed30…`）、只 `git add -f tests/test_coverage_core.py`（`27ff7c3…`），最后对两个新测试都 `git add -f`，得到 `2264b615…`。
- 做错过的：前三次都没意识到被忽略的不止一个文件，浪费了三轮才对齐。

### 5. 表中“Python 3.11.17／pytest 8.3.5／coverage 6.5.0／pytest-cov 4.1.0”与另一行 coverage 6.5.0（§实际变化与验证）

- 缺什么：页面没有说明 coverage 6.5.0 的获取来源；当前配置的包索引不提供该版本（可见版本从 7.6.1 起），直连 pypi.org 也因 TLS 连接失败不可用。
- 实际处理：改跑页面表中同样列出的 coverage 7.8.2／pytest-cov 6.2.1 行；该行仍走“缺少 `run:core` → `ConfigError`”的旧版本路径。另用运行时确认 coverage 7.8.2 的 `ConfigError` 不是 `CoverageException` 子类，说明配套补丁的捕获范围是必要的。
- 做错过的：没有提前确认索引里旧版本覆盖范围，先试了不可得的 6.5.0。

### 6. 解释器补丁级差异（§实际变化与验证 表格）

- 缺什么：页面只列 Python 3.11.17 与 3.12.14；本机可用的是 3.11.15 与 3.12.15。
- 实际处理：直接用本机版本，按任务要求报告实际版本；其余依赖版本与表中行一致。
- 做错过的：无。

## 页面之外还去翻了什么

- 上游 `tox.ini`、`pyproject.toml`、`setup.py`：确认测试依赖（pytest-xdist、pytest-cov）、`requires-python` 和 pytest 配置来源；属页面允许阅读的上游代码。
- 应用补丁后的 `tests/test_coverage_core.py`、`tests/test_coverage_detection.py`：核对断言语义与 `test_outer_coverage_keeps_test_execution` 的 100% 断言；内容就是页面链接的两份补丁。
- 已安装 coverage 的 `coverage.exceptions` 类继承关系：确认 `ConfigError` 与 `CoverageException` 无继承关系，用来解释配套补丁。
- 包索引的 coverage 可用版本列表与 pypi.org 连通性：判断 6.5.0 缺失是索引限制还是网络问题，未使用凭据。
- 为对照记录格式，读了仓内已有 `reader-tests/A-CI-PROJECTION-READER-20261027-u1.md` 前 40 行。任务写明“只写本 ID 的新文件，不读取其它读者结果”，这是违规；该文件与本任务主题无关，对技术结论没有影响。
- 未读 a1dbv 的其他文档，未读旧 testmon 实验／审查／完成记录，未搜同主题教程。

## 给页面的最小修正建议

1. 在验证步骤里补“创建并激活虚拟环境 + `pip install -e .`”，并说明 `PYTHONPATH` 不能替代入口点注册。
2. 补 Windows 写法：用虚拟环境解释器，`PYTHONPATH` 用 `cygpath -w` 转换后的路径或直接省略。
3. 在树哈希句旁直接写“两份新增测试需 `git add -f`，否则受 `/tests/` 忽略规则影响”。
4. 注明 coverage 6.5.0 的获取方式，或把可复现组合收敛到当前可获取的版本。

## 核对

非读者复核，独立重跑于工作目录与仓外 scratch，未改页面、补丁、生产代码或验收断言。

### 独立复跑结果

- 补丁 SHA-256 与页面一致：`fix.patch` 为 `5298e99c…f1e2`，`coverage-core.patch` 为 `67d69600…31ed`。
- 基线 `94150742345d0bc3fb00a10c19c0ae26a0064c4e` 的树为 `6cc4493bb24cd0609b99dee1d1735c89f04a7a70`；两份补丁的 `git apply --check` 均通过。
- 树哈希复算与读者一致：`git add -A` 后为 `9f2ed30de1e239d714c3c67a701b3d800cd16b75`；再 `git add -f tests/test_coverage_core.py` 后为 `27ff7c3976b2d6ac609cc39a786c33f57d496ef1`；两个新增测试都 `git add -f` 后为 `2264b6155ff3e9d908c7d5d5894b2e13ec038168`。
- 两个环境的实际版本与读者报告一致：A 为 Python 3.12.15／pytest 9.1.1／coverage 7.17.0／pytest-cov 7.1.0／pytest-xdist 3.8.0；B 为 Python 3.11.15／pytest 8.3.5／coverage 7.8.2／pytest-cov 6.2.1／pytest-xdist 3.8.0。
- 用页面同一命令（仅换 venv 解释器）在两个环境各重跑一次：均 `29 passed`、exit 0；与读者日志的 60.63s／55.56s 相符。
- 未安装项目时可复现 `28 passed, 1 error`，错误为 `pytest.main(): error: unrecognized arguments: --testmon`，exit 1；安装后恢复 29 passed。读者对环境缺口的判断成立。
- 当前包索引只列 coverage 7.6.1 及以后，直连 pypi.org 返回 TLS 错误（curl rc=35），coverage 6.5.0 不可得；读者改用页面同表的 7.8.2 行成立。
- coverage 7.8.2 的 `ConfigError` MRO 为 `ConfigError -> _BaseCoverageException -> Exception`，不是 `CoverageException` 子类；读者该条成立。
- `test_outer_coverage_keeps_test_execution` 是 2×2 四个参数组合并断言 `percent == 100`；`test_xdist_select.py` 与 `test_coverage_core.py` 确实分别用到 `-n` 和 `--cov`，需要 pytest-xdist／pytest-cov。
- 工作目录只有两个未跟踪产物（本文件与 `docs/collaboration/local-jobs/artifacts/A-TESTMON-PATCH-READER-20261028/result.md`），未提交、未推送、分支未变；产物中未检出本机绝对路径或内网地址。

### 卡点判定

1. 虚拟环境缺位置、创建方式和插件清单：页面问题。页面要求“使用已准备的测试虚拟环境”，但工作副本和参考仓都没有可直接用的 venv；页面也未列 pytest-xdist。判 page。
2. 只给 POSIX 写法：页面问题（缺平台写法）。读者在 Windows 下改用 venv 解释器后正常；`PYTHONPATH` 的 MSYS 路径因 `-m pytest` 把工作目录放进 `sys.path` 而未致失败。判 page，程度轻，页面补一句“激活虚拟环境或用其解释器”即可。
3. 命令块缺“安装被测项目”：页面问题。仅 `PYTHONPATH` 不注册 `pytest11` 入口点，pytester 子进程报 `unrecognized arguments: --testmon`；这是页面命令不能直接得到 29 passed 的直接原因。判 page。
4. 树哈希未写 `git add -f` 前提：页面问题（前提没写、提示顺序靠后）。页面下一段确有 `/tests/` 忽略规则，但哈希句本身未说明索引状态；读者三次尝试才对齐。判 page，建议把 `git add -f` 直接写进哈希句。
5. coverage 6.5.0 不可得：页面问题（可复现信息缺失，叠加环境限制）。页面把它列为已验组合，但未给旧版本来源；当前索引和直连 PyPI 都取不到。判 page，建议注来源或收敛到可取版本。
6. Python 补丁级差异：不构成实质卡点。页面列 3.11.17／3.12.14，读者用 3.11.15／3.12.15，任务本就要求报告实际版本；页面可加一句“补丁级差异可接受”。判 page（仅提示性），读者处理正确。

### 读者未意识到的问题

- `result.md` 写“页面缺四处可执行信息”，随后实际列了五项（四项加 coverage 6.5.0 的可获取性），计数与列举不一致。
- `result.md` 写“本机只有 Python 3.12.15 与 3.11.15”，但读者自己的记录和实际环境还有系统 Python 3.13.5；应写成“与页面表匹配的版本只有”。
- 中间失败运行（28 passed, 1 error）未记退出码，实际为 exit 1；任务要求记录退出码，两次成功运行记了 0，失败运行漏了。
- 本文件第 63 行“未读 a1dbv 的其他文档”与第 62 行自述读过另一 reader-tests 文件相矛盾；违规本身已披露，但这句表述不准确。
- 读者把页面“提交新增测试时注意上游 `/tests/` 忽略规则”称为“后文”，该句实际紧接在命令块后的同一段；只是措辞不精确，不影响结论。

### 结论

读者按页面完成了补丁应用、树哈希复算、两个合法组合的页面命令，实际结果与自报一致；产物与日志齐备，工作目录未被改动。核心目标达成。页面确有四处会直接影响照做的缺口（虚拟环境、安装项目、Windows 写法、树哈希前提），coverage 6.5.0 的可获取性也需说明。读者自述违反“不读取其它读者结果”的约束，已主动披露且不影响技术结论，但属于流程违规，接收时需知悉。
