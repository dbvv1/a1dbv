# Aider 确认函数：空输入与 EOF

🧪 **在固定版本中，`explicit_yes_required=True` 仍会把空输入和 EOF 归到默认回答；默认 `y` 时返回 True。** 因此，评估“必须明确确认”的契约时，要核默认值和缺失输入，不能只看参数名。
本实验只调用确认函数并注入输入，没有执行 shell、模型、CLI、真实 TTY 或压缩流程；不改产品默认，也不提出通用安全修复。

## 已观察到什么

固定 [Aider `5dc9490`](https://github.com/Aider-AI/aider/tree/5dc9490bb35f9729ef2c95d00a19ccd30c26339c)，每个场景新建 `InputOutput(yes=None, fancy_input=False)`，直接调用 `confirm_ask(..., explicit_yes_required=True)`：

| 注入 `builtins.input` | `default` | 实际返回 |
|---|---|---|
| 空字符串 | 省略，源码为 `y` | True |
| 抛出 `EOFError` | 省略，源码为 `y` | True |
| 空字符串 | `n` | False |
| 抛出 `EOFError` | `n` | False |
| `n` | 省略，源码为 `y` | False |

`default='n'` 两项只是函数参数的负控，没有验证它是用户可配置的 CLI 开关或完整产品修复。传入的 `ConfirmGroup` 只有一个合成项，源码会关闭分组；多项分组和已有组偏好未测。

另运行上游原有 `test_confirm_ask_explicit_yes_required`：`yes=True/False` 配合显式确认时返回 False，`yes=None` 输入 `y` 返回 True，非显式确认且 `yes=True` 返回 True。合计 **2 个 unittest 方法，其中新增方法有 5 个子场景**，不能累计成 9 个 CLI 测试。

源码先在 EOF／空输入时取默认值，再判断回答首字母。真实 shell 调用点使用显式确认且未覆盖默认值，但本实验止于布尔返回值，没有调用该执行链。Python 审计钩子记录的外部调用尝试为零；它是本探针的防误触保护，不是 OS 沙箱或整产品安全证明。

来源与核实：2026-11-03，固定源码 [确认函数](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/io.py#L807-L925)、[单项组判定](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/io.py#L81-L88)、[原测试](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/tests/basic/test_io.py#L176-L206)、[shell 调用点，仅静读](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/coders/base_coder.py#L2450-L2475)。

## 证据与复现

- [receipt.json](receipt.json) 是原执行结果的公开摘录，保留五项返回、提示文字、时间、源码哈希与计数，删除绝对路径和运行环境字段；原件哈希用于核对来源。
- [unittest-output.txt](unittest-output.txt) 保留原测试输出字节，显示两方法通过。
- [trial.py](trial.py) 保留相同测试逻辑，将原固定机器路径改为参数，增加固定源码哈希检查和新输出目录要求。它是可移植复现封装，不冒充原执行源码。
- [replay.json](replay.json) 单列公开封装的实际复跑结果和外层退出码，不回填原执行。

原执行时间为 2026-11-03 12:56:20–12:56:21 UTC，保留文件缺外层退出回执。公开封装另于同日 13:08:49–13:08:50 UTC，在独立目录使用现有依赖与固定源码副本实际复跑：外层退出 0、stderr 为空、两方法通过，五项返回与原轮一致；受检源码和三份旧原件哈希均未改变。`receipt.json` 中“摘录准备时未复跑”保留先后关系，新轮结果见 `replay.json`。

下面是公开封装的复现命令，不是原启动命令逐字副本。本次只用过 Python 3.12.14。复现时在独立工作区准备官方固定源码及测试依赖；已有合适环境可省略安装。不要运行 `aider` CLI：

```sh
git clone https://github.com/Aider-AI/aider.git aider-source
git -C aider-source checkout --detach 5dc9490bb35f9729ef2c95d00a19ccd30c26339c
python3 -m venv probe-env
probe-env/bin/python -m pip install \
  prompt-toolkit==3.0.52 Pygments==2.19.2 rich==14.3.3 oslex==0.1.3 \
  wcwidth==0.6.0 markdown-it-py==4.0.0 mdurl==0.1.2
TERM=dumb probe-env/bin/python -I experiments/aider-confirm-boundary/trial.py \
  --source aider-source --output aider-confirm-run
```

从本仓根目录执行最后一条；输出目录必须不存在，以免覆盖旧回执。复现结果写入其中，验收应核五项返回值、两方法通过、源码未变、审计事件为空，并另存外层退出码。真实终端行为和下游命令执行不在本实验范围。
