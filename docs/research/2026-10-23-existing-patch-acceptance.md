# 接收已有补丁：别把原子替换当成耐久落盘

核实：2026-10-23。🧪 **值得一试：让 Agent 接收真实现成补丁，再验证失败路径；不重复写一份同题修复。** 这里接收的是 python-dotenv 的未合并 PR，不是我们原创的库补丁。[本轮实测／一手]

## 你能直接复用什么

运行 `python3 experiments/replay_dotenv_acceptance.py`，入口会在新临时目录取官方源码、核验固定 PR、预检已有测试依赖，然后依次运行旧代码反例、补丁全套测试和真实 CLI 验收。将 [接收测试](../../experiments/test_dotenv_acceptance.py)放在[重放脚本](../../experiments/replay_dotenv_acceptance.py)同目录；需要 POSIX、Python 3.12+、Git、网络，以及当前 Python 已有 pytest、Click、IPython；脚本不会安装软件。输出目录含 `results.json`、测试日志及源码，保留供检查，不改已有项目。[本轮实测]

已具备测试依赖时，可用 `python3 experiments/replay_dotenv_acceptance.py --python .venv/bin/python`。本轮版本为 pytest 9.1.1、Click 8.5.0、IPython 9.17.1；入口记录实际版本，不能据此推定跨版本结果。为上游子进程测试在临时 PATH 中放置调用官方 `dotenv.__main__.cli` 的同名启动器，核验源码 CLI，不代表 wheel／console-script 打包通过。[实现]

## 真实问题，先找已有方案

维护者在 [#713](https://github.com/theskumar/python-dotenv/issues/713) 指出：`set_key`／`unset_key` 写临时文件后直接替换目标，没有强制同步内容。[PR #717](https://github.com/theskumar/python-dotenv/pull/717) 作者 Imkkey 已给出两行实现和回归，本例直接复验其方案，不新建重复上游 PR。查询时 PR 仍 open、未合并，未见 review/comment；作者自报通过不代替本轮验证。[一手]

固定基线 `0b2880591780a426b0551436f47a17e7a76d954f`；补丁 `15bb04fd15f91b48e81c2683fcab802165a889f3`。上游采用 BSD-3-Clause；分发补丁或源码须保留随附 [BSD 许可](../../experiments/dotenv-upstream-LICENSE.txt)，不把现成实现署名为本例原创；[固定上游补丁](../../experiments/dotenv-upstream-717.patch)一并保留。[一手]

## 这次接收了什么

| 检查 | 实际结果 |
|---|---|
| 将 PR 新测试放在旧实现上 | 7 项中 6 失败、1 通过；失败正是缺少 fsync 时序／失败传播 |
| 固定 PR 的项目测试 | Linux／CPython 3.12.14：295 通过、0 跳过 |
| 独立接收测试 | 7 通过：真实 CLI、同步失败、清理失败、替换失败与权限复制失败 |
| 静态检查 | 上游 Ruff check／format 与 mypy Python 3.12 目标通过；不是完整多解释器矩阵 |

真实子进程把 `GREETING=café` 和 `COUNT=2` 写进合成文件，读取、JSON 列出，再删除 COUNT；最终文件为 `GREETING='café'`，原 0640 权限保留，缺键查询返回 1。另外用进程内 Click CliRunner 验证缺失父目录和注入同步失败：返回 2，显示短错误而非 traceback；这组错误注入不是子进程实验。[本轮实测]

## 两行补丁怎样验，不能怎样夸

`写临时文件 → flush Python 缓冲 → fsync 文件 → close → 保留权限 → os.replace`

正常路径的测试会调用真实 fsync，再核替换顺序；故障路径模拟 fsync 抛错，要求替换不执行、旧文件不变、同一个异常继续向外传播。即使清理临时文件也失败，原异常仍保留，但会留下临时文件并发出警告，不能写“所有错误都无残留”。[本轮实测／源码]

当前源码将临时文件建在目标同目录并调用 `os.replace`，不是 `shutil.move` 的跨文件系统复制回退。本例注入 EXDEV 验证拒绝替换后保旧文件，没有实际跨盘试验。[源码／本轮实测]

**已证实的是调用契约、失败保护和 CLI 行为，不是断电不丢数据。** [Python 文档](https://docs.python.org/3/library/os.html#os.fsync)区分 flush 和 fsync；[Linux fsync 手册](https://man7.org/linux/man-pages/man2/fsync.2.html)明确文件同步不保证目录项已落盘。此 PR 没有目录 fsync，权限复制也在文件 fsync 之后，不能声称整个 rename／元数据事务耐久；并发写、多文件系统、真实断电、原生 Windows 和上游接收均未验。[一手／范围]

迁移到自己的 Agent 任务时，保留这个次序：**先核维护者意图和已有补丁，再让反例在旧代码失败，最后验证真实入口与异常边界。** 它证明这次补丁接收可重放，不证明某个模型、代码图或 Skill 普遍提升效率。[研究]

探索回执：沿既有编码示范自然续题；核 Click、HTTPX、attrs 等官方 issue／PR／源码避开重复修复，选 python-dotenv 维护者 #713 的现成 #717，以 Python os 文档与 Linux fsync 手册核边界；未做广域前沿或模型比较。[研究]
