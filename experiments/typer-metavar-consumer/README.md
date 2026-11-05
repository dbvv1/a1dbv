# Typer 参数名：显示修饰也要验原调用

**维护需要跨 Typer 版本运行的 CLI 时，显式写出要保留的选项名，并运行旧调用。** 本例 `typer.Option("--fuzzy-muffins", metavar="FUZZY_MUFFINS")` 在五个固定版本都接收小写选项；只写 metavar 则在 0.27 系列改变了实际解析，不只是帮助文字。这里是公开用户问题的最小 CLI 复现，不是业务应用验收。

## 实际结果

Linux、Python 3.12.14、Rich 15.0.0，同一环境从各固定源码导入。每版运行原声明、显式选项名、无关 metavar=`VALUE` 三种声明，分别调用默认值、小写选项、大写选项及 `--help`，共 60 次真实子进程调用；解析成功还核 `Hello reader` 回显，失败核 exit 2 与未知选项诊断。

| 源码 | 原声明接收的选项 | 显式小写声明 |
|---|---|---|
| 0.26.8，`b210c0e2` | `--fuzzy-muffins` | 小写成功 |
| 0.27.0，`60af34b6` | `--FUZZY-MUFFINS` | 小写成功 |
| PR 基线 0.27.2，`a80f6e5e` | `--FUZZY-MUFFINS` | 小写成功 |
| 已有 PR #1957，`09bf9a55` | `--fuzzy-muffins` | 小写成功 |
| 本次 master 0.27.3，`f2183bff` | `--FUZZY-MUFFINS` | 小写成功 |

无关 metavar 对照在五版均接小写。各臂还运行自身 `tests/test_core.py`：旧版 27 项，其余各 28 项通过；这也说明已有测试绿灯不能代替消费者旧调用。补丁只在既有 PR 内，当前主干仍保留问题；不建议为它直接采用整个未合并分支。若业务已经公开了大写选项，迁移前另核其兼容承诺，不能直接删掉。

## 复跑

使用官方仓库，保留每个检出的固定版本。以下命令在本实验外新目录执行；`uv` 的缓存、临时目录及 Python 位置按自己的可写环境设置。

```sh
git clone https://github.com/fastapi/typer.git typer-current
cd typer-current
git checkout f2183bffb2bae9a79b56e69561cbae32969451a3
git fetch origin refs/pull/1957/head
git worktree add ../typer-old b210c0e2376d99344f79f11fab3ad34cf890cc20
git worktree add ../typer-release 60af34b60ab2650a74af32c6ce340c5cfbceb3d8
git worktree add ../typer-base a80f6e5ecd74f32b983cca336a2f3cba98d9853a
git worktree add ../typer-pr 09bf9a55a86e88bc3a79b2e63682a599eed4ffc5
uv sync --python 3.12 --locked --group tests --no-default-groups
cd ..
python /path/to/replay.py --python typer-current/.venv/bin/python \
  --old typer-old --release typer-release --base typer-base \
  --pr typer-pr --current typer-current > results.json
```

`replay.py` 校验五个 HEAD、受跟踪的 typer 源码未改及每臂实际导入位置，临时生成最小命令并断言结果；它不安装依赖、不改源码、不联网、不调用模型。只读 Git 对象和源码，临时文件随完成清理。复跑环境版本保存在结果头；虚拟环境解释器路径不能先解析到其系统 Python 符号链接目标。

没有复现原帖 macOS／Python 3.14.5，没有运行完整 Typer 套件、shell completion、包构建或业务文件读写，也没有证明全部 API 兼容。初次准备仅因默认 uv 路径只读失败，改用工作区缓存及已有 Python；首次整理复跑脚本误解析 venv 解释器链接导致导入失败，已改为保留 venv 路径并完整重跑。本实验不修改答案页或评级。

**依据与准入**：[原问题及用户采纳的显式参数方案 #1900](https://github.com/fastapi/typer/discussions/1900)、[维护者现有修复 #1957](https://github.com/fastapi/typer/pull/1957)、[固定主干实现](https://github.com/fastapi/typer/blob/f2183bffb2bae9a79b56e69561cbae32969451a3/typer/main.py)、[贡献规范](https://tiangolo.com/open-source/contributing/)。原帖只报告帮助显示，本次另验解析成功和失败；原有回答也指出解析变化。上游要求先讨论、维护者邀请及有意义的人类介入，本轮仅读源码和验现有方案，不另发 PR 或评论。核实及实跑：2026-11-05；PR 当时 open、未合并。
