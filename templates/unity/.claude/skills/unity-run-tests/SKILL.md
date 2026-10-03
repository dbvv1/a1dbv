---
name: unity-run-tests
description: 用 Unity Test Runner 在命令行运行 EditMode/PlayMode 测试并汇总失败用例。改完逻辑代码后、修 Bug 验证时、或用户要求跑测试时使用。
allowed-tools: Bash(.claude/skills/unity-run-tests/scripts/run_tests.sh*) Read
argument-hint: [EditMode|PlayMode] [testFilter]
---

# 运行 Unity 测试

```bash
.claude/skills/unity-run-tests/scripts/run_tests.sh $ARGUMENTS
```

- 第 1 个参数：`EditMode`（默认）或 `PlayMode`
- 第 2 个参数（可选）：`-testFilter`，如 `MyGame.Combat` 或完整测试名；多个用 `;` 分隔

## 前提

- 编辑器**未打开**此项目（batchmode 需要独占项目）。若已打开，改用 Unity MCP / Unity CLI 运行 Test Runner。
- 找不到 Unity 时设置环境变量 `UNITY_EDITOR`。

## 结果处理

- 输出汇总（总数/通过/失败/跳过）与每个失败用例的名称、消息、堆栈前几行。
- 退出码：0 全部通过；1 有失败；2 环境问题（找不到 Unity、项目被锁、无结果文件）。
- 修复时**不要修改测试来让它通过**，除非测试本身有误并向用户说明。
- 修完后重新运行，直到全部通过。
