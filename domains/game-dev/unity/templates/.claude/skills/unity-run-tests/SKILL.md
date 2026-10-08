---
name: unity-run-tests
description: 在命令行运行 Unity EditMode/PlayMode 测试并汇总失败用例。改完逻辑代码后、修 bug 验证时、用户要求跑测试时使用。
allowed-tools: Bash(.claude/skills/unity-run-tests/scripts/run_tests.sh*) Read
argument-hint: "[EditMode|PlayMode] [testFilter]"
---

# 运行 Unity 测试

```bash
.claude/skills/unity-run-tests/scripts/run_tests.sh $ARGUMENTS
```

- 第 1 个参数：`EditMode`（默认）或 `PlayMode`。
- 第 2 个参数（可选）：过滤条件，例如命名空间 `MyGame.Combat` 或完整测试名。
- 装了 Unity CLI 时脚本会用 `unity test`，否则用编辑器的 `-runTests` batchmode。
- 只想跑受改动影响的测试（需要 Unity CLI）：`unity test . --affected --since origin/main`。

## 前提

编辑器**不能**打开着这个项目。如果打开了，就通过 Unity CLI 或 MCP 在编辑器内运行 Test Runner。

## 处理结果

- 退出码：0 全部通过；1 有失败（stdout 中有失败用例的名称、消息和堆栈）；2 环境问题（编译错误、找不到 Unity、项目被锁、没有生成结果文件）。
- 退出码为 2 且输出中有 `error CS`：先用 `unity-compile-check` 修好编译错误。
- **不要修改测试来让它通过**，除非测试本身写错了，并且要向用户说明理由。
- 修完后重新运行，直到全部通过；最后报告结果时附上汇总那一行作为证据。
