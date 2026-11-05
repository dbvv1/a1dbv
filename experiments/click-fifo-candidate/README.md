# Click：lazy 预检会断开一次性 FIFO 写者

**读取命名管道时，沿用公开的 `click.File("rb", lazy=False)` 可避开本例的预开关问题。** 如果应用确实需要延迟读取，须验证写者生命周期；这里保全一个本地窄补丁，不作为上游已发布修复。

## 真实复现与本地候选

来源是 [Click #2645](https://github.com/pallets/click/issues/2645)。固定主干 `2247b35ea1c47c727d7a06e51fa280e12a863ff6`，真实 Click 命令用 Linux FIFO 接收独立进程的一次性写入。命令收到参数后延迟一秒再读，写者打开管道后延迟四分之一秒再写：

- 原版 `lazy=True`：解析参数后读者等待，写者 `BrokenPipeError`、退出1；读者到4秒界限仍未完成，由探针终止并回收，不能称自然退出。
- 原版 `lazy=False`：读者和写者均退出0，实际读回 `fifo-payload`。
- 本地补丁：仅对 FIFO（包括符号链接指向的 FIFO）跳过延迟文件构造时的预先开关；两种 lazy 设置均读回相同内容、双方退出0。

这不是模型效果、性能比较或所有调度条件下的保证。`lazy=False` 会在参数转换阶段等待写者，不是非阻塞 I/O；只有消费方式允许时才用。候选保留普通文件的预检、写模式和标准输入路径；**FIFO 的权限等打开错误会延后到真正读取时报出**。`stat` 与随后 `open` 之间仍有路径变化窗口；没有写者时真正读取仍会阻塞，补丁不是超时机制或竞态防护。未扩到其他设备类型。

## 复跑与恢复

保存的 [补丁](change.patch)只改 `src/click/utils.py` 和 `tests/test_types/test_File.py`。先取得官方固定源码，检查补丁，再在隔离工作树应用：

```sh
git clone https://github.com/pallets/click.git source
git -C source checkout --detach 2247b35ea1c47c727d7a06e51fa280e12a863ff6
python probe.py source
git -C source apply --unidiff-zero /absolute/path/to/change.patch
python probe.py source
```

`probe.py` 使用给定源码的 `src` 路径和当前 Python；只创建临时 FIFO、合成文本、子进程，不调用服务。两次输出可与 [results.json](results.json) 对照。它有固定的进程等待界限，不把主动终止算通过。

官方测试环境可用 `uv sync --locked --no-default-groups --group tests`，随后 `uv run --no-sync pytest`。本轮 Python 3.12.14／pytest 9.0.2：完整默认范围 **2266通过、24跳过、31000 stress 被默认筛掉、1 expected failure**；24项是 Windows 专属测试，不宣称全平台通过。新增文字／二进制、直接／符号链接四种 FIFO 回归与两项既有缺文件控制共6项通过；同测试搭原生产代码精确4项超时失败、2项通过。固定 Ruff 0.15.9 检查及格式检查通过。没有运行全部 stress、typing 或 hosted CI。独立审阅指出新增测试字符串中仍有三元表达式，不符合项目要求的显式分支风格；本包原样保全这一欠项，Ruff通过不能代替贡献规范审查。

## 准入与归属

[Pallets AI 政策](https://palletsprojects.com/contributing/llm-ai)限制新贡献者使用 AI 参与代码、测试和社区互动。因此本候选**不向上游提交 PR 或评论**，没有用人工署名遮掩生成来源，也不把独立代码复核当作满足准入。官方 bugfix 通常面向 stable；本包是 main 上的本地验证，未声称已满足投稿基线或全部门禁。

**这不是新的修复思路。** 已核同题关闭且未合并的 PR [#3792](https://github.com/pallets/click/pull/3792)、[#3784](https://github.com/pallets/click/pull/3784)、[#3643](https://github.com/pallets/click/pull/3643)、[#3607](https://github.com/pallets/click/pull/3607)、[#3554](https://github.com/pallets/click/pull/3554)、[#3522](https://github.com/pallets/click/pull/3522)，均采用跳过 FIFO 预开关的思路。初选只查了开放 PR，未覆盖这些历史尝试；保全此包不表示建议再次投稿。

原源码 Copyright 2014 Pallets，BSD-3-Clause；保留 [完整许可](LICENSE.upstream)。2026-11-05 的本地修改为 FIFO 判断与回归测试，非上游背书。核实与实跑日期：2026-11-05 UTC。
