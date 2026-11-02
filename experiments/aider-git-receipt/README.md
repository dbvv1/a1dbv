# 接回路径修复：核 Git 的真实目标，不只看界面

**🧪 Agent 显示正在操作仓库 A，不代表它启动的 Git 子进程也在 A。** 本轮沿[长程接收路线](../../docs/decisions/long-tasks.md)验证 Aider 已有 [PR #5846](https://github.com/Aider-AI/aider/pull/5846)：受验 main 从 B 启动、指定 A 后，`/git add change.txt` 实际暂存了 B；候选改为 A。两者 Aider 退出码都是 0，必须读回实际 index，不能只验界面、函数测试或进程退出。

**仍使用本次受验 main 逻辑时，先从目标仓库根启动，或给 `/git -C` 一个明确的绝对目标，再核暂存差量。** 这两种控制在两版都成立；并非建议安装未合并候选。相对 `-C` 的基准会受工作目录影响，本轮没有证明它保持原语义。

## 接收的真实输入

公开 PR 要解决两种已有使用场景：从仓库子目录执行根相对 Git 命令，以及从另一个仓库启动 Aider、用位置参数指定目标仓库。基线固定为 `5dc9490bb35f9729ef2c95d00a19ccd30c26339c`，候选为 `fc41b0bd581145ad10ac2aedba24093796dc75b1`。原补丁只有两文件：`Commands.cmd_git()` 的 `subprocess.run()` 增加 `cwd=self.coder.root`，以及两个参数化回归用例；没有依赖变更。

原回归直接构造 `Commands`，所以另交给非作者验证真实 CLI 的仓库识别，而不是重写同题修复。PR 仍 open、未合并、无评论或评审；CLA status 成功不是维护者接受或测试通过。本轮没有提交上游补丁、评论或协议。

依据：[原需求与补丁](https://github.com/Aider-AI/aider/pull/5846)、固定版 [cmd_git](https://github.com/Aider-AI/aider/blob/fc41b0bd581145ad10ac2aedba24093796dc75b1/aider/commands.py#L966-L988)及[贡献政策](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/CONTRIBUTING.md)，核实 2026-11-02 UTC。

## 可复用的消费者验收

1. **把“该改什么”和“不得动什么”一起交出去。** 每版另建合成 A/B 仓库，放同名但内容不同的 `change.txt`；B 预先暂存一个 sentinel。先记录两仓 HEAD、index tree、stage 中的文件内容及全部工作文件字节。B 原本非空，不能用“B 暂存区为空”替代保留检查。
2. **从真实入口启动。** 本例执行固定源码的 `python -m aider --message "/git add change.txt"`，分别改变 cwd 与位置参数；不直接调用 Python 函数。非作者自己写驱动，负责人接回后另读实际 Git 对象与文件，不只接受驱动自报。
3. **读回效果和未变项。** 目标仓库暂存的应是该仓库新内容，另一仓库 index tree 必须保持；两仓 HEAD、工作文件字节、既有 sentinel 的 stage 内容均保持。再加根目录、显式绝对 `-C` 和只读 `rev-parse --show-toplevel` 控制，区分新默认 cwd 与显式目标。
4. **保留错误与未验证面。** Aider 的命令退出码没有传播 Git 子命令失败。本例子目录 baseline 输出 `fatal: pathspec 'change.txt' did not match any files`，Aider 仍 exit 0；不能把它计作成功。

| 实际 CLI 输入 | 基线 main | PR 候选 |
|---|---|---|
| cwd A/nested，`/git add change.txt` | Git 报 pathspec；A 未暂存 | 只暂存 A 的新内容 |
| cwd B，位置参数 A，同一命令 | 错误暂存 B 的新内容 | 只暂存 A；B 原 index tree 不变 |
| cwd A 根目录，同一命令 | 只暂存 A | 只暂存 A |
| cwd A，`/git -C <绝对 B> add change.txt` | 只暂存 B | 只暂存 B |
| cwd A/nested，只读 rev-parse | 返回 A | 返回 A |
| cwd B、位置参数 A，只读 rev-parse | 返回 B | 返回 A |

六组输入各跑两版；所有进程 exit 0，所有 HEAD、工作文件与既有 sentinel 内容保持。这里的“符合预期”包含成功复现基线错误，不是十二次产品成功，更不是效果或速度指标。

**模型不是本任务消费者。** 使用新 HOME、合成仓库、环境白名单、独立历史文件与明确的本地模型元数据；没有真实账号、API key 或产品 monkeypatch。`--env-file` 仍会附加搜索默认文件，不能单靠这个参数隔离用户配置。LiteLLM 使用其本地成本表开关，官方 tokenizer 在准备阶段预下载并校验；元数据中的数字仅为合成启动配置，不是价格事实。具体参数与输入见 [results.json](results.json)。初次 strace 在产品启动前被 ptrace 权限拒绝，未重试；随后只执行独立获准的 CLI，因此没有系统调用级“零联网”证明。完整 pytest 另有联网与自动安装尝试，不能套用消费者的隔离描述。

## 项目检查：局部可接收，完整版本未通过

环境为 Linux、Python 3.12.14、Git 2.52.0，源码 CLI 显示 `0.86.3.dev+import`。runtime 使用仓库锁定 requirements；测试使用 pytest 9.0.2、pytest-env 1.6.0，后续为诊断补装 boto3 1.43.123。

| 检查 | 实际结果 |
|---|---|
| 原 PR 新回归 | 隔离后的基线 2 failed；候选 2 passed |
| 候选原 commands 测试 | 70 passed |
| 改动两文件 Flake8 7.3.0、补丁空白 | 通过；不是完整 pre-commit 或构建验证 |
| 候选完整 pytest，补依赖后 | **475 passed / 14 failed / 1 skipped / 5 errors；67 subtests passed** |
| sendchat 独立文件对照 | 两版各 12 passed；不能覆盖候选全套中的两处失败 |
| 精确候选的托管状态 | 4 个 workflow 均为 `action_required`，0 check-runs；唯一成功 status 是 CLA，不能称 CI 绿 |

完整套件中的两处 sendchat 失败是 `print` 调用次数不符，独立运行两版该文件均通过，根因尚未定位。其余失败包括 DNS 错误、PortAudio library 缺失、browser/Playwright 可选组件未就绪；5 个 help setup errors 涉及 extras 安装失败。没有执行基线完整套件，不能声称两版全套差异为零；不为此任务安装额外模型或构造音频设备。

**首轮失败也保留。** 第一次基线回归直接指定候选测试的绝对路径，pytest 收集时导入了候选，得到的 2 passed 无效；改用逐字复制的测试与 importlib 隔离后，基线才正确复现两项失败。第一次完整套件在 240 秒外层时限停止；两版受限诊断均指向既有测试的 `Model` mock 误入 Bedrock 依赖检查，并等待安装子进程。补齐官方 boto3 后，两版该点各 1 测试／15 子例通过，才重跑未完成的候选全套；并未抹去最终剩余失败。消费者的首次后验脚本还误把终端折行当成路径差异，修正最终输出段的折行比较后通过，没有重跑或改动产品结果。

原源码、原补丁、驱动、失败与修正日志及合成 Git 夹具保全；公开 JSON 是去路径的精选投影。只接收当前 Linux `/git` 目标与保存不变量证据，不等于通用 shell 隔离、Windows/macOS、相对 `-C`、真实模型会话或整个 Aider 版本通过。未改上游源码，也未升级长程页默认或新读者状态。
