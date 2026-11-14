# 外层 deadline：退出与解锁不代表整树停止

**保留已有进程组超时入口，不直接采用这个 launcher 作为整树清理保证。** 对公开 `agent-harness` 固定版本的 `run.sh` 做实际消费者验收：1 秒限时后 launcher 返回 143 并删除锁，合成孙进程仍持续写入。源码只查直接子进程；未启动真实 Agent、模型或调度。

社区 [Claude Code #107256](https://github.com/anthropics/claude-code/issues/107256) 的讨论提出外层限时，末尾作者链接了[固定 launcher](https://github.com/fainir/agent-harness/blob/f5fddce0778e9cbfbb9799063ae37c8911514150/skills/run-company/scripts/run.sh)。其报告的直接子进程关闭不覆盖本次三代路径。原脚本默认带放宽权限参数，不作为本仓推荐；本测将 `claude` 明确替换为临时假程序，并覆盖 flags。

## 复跑

本探针需要 Linux `/proc`、Python 3.11+ 的 pidfd API 与 bash/pgrep/pkill。先取得上方固定源码，保存为 `run.sh`，不安装或配置任何计划。探针核源码 SHA-256 后才运行：

```bash
python3 experiments/launcher-deadline-consumer/probe.py run.sh
```

只用临时合成文件；假 leader、child、grandchild 最长各存活 8 秒，finally 以 Linux pidfd 和启动标记核同一进程后发终止信号。测试核三者实际启动、launcher 在 4 秒内返回、退出 143、锁删除，随后比较两次孙进程写入。所有断言成立才退出 0，结果见 `result.json`。异常慢启动或主机停顿会失败，不计为通过。

这不是 Claude 的实际 Stop 循环、费用、macOS 或任意逃逸进程清理测试；不证明僵尸进程回收。采纳粒度是拒绝将该源码的退出/锁状态当整树结束证据，未改长期规则或答案页。核实 2026-11-14。
