---
name: unity-compile-check
description: 在命令行检查 Unity C# 是否能编译通过，并提取编译错误。改完 C# 代码后、提交前、或用户要求检查编译时使用。
allowed-tools: Bash(.claude/skills/unity-compile-check/scripts/compile_check.sh*) Read
argument-hint: [--dotnet | --unity]
---

# Unity 编译检查

运行：

```bash
.claude/skills/unity-compile-check/scripts/compile_check.sh $ARGUMENTS
```

## 模式

| 参数 | 方式 | 速度 | 前提 |
|---|---|---|---|
| `--dotnet`（默认先尝试） | `dotnet build` 已生成的 `.sln` | 快 | 已生成 sln/csproj；新增/删除文件后需 Unity 重新生成 |
| `--unity` | Unity `-batchmode` 完整编译 | 慢（分钟级） | 编辑器**未打开**此项目 |
| 无参数 | 有 `.sln` 用 dotnet，否则用 Unity | — | — |

## 结果处理

- 脚本只输出去重后的 `error CS####` 行，退出码非 0 表示有错误。
- 逐条修复后**重新运行**，直到通过。
- 如果提示“项目被锁定”（编辑器已打开）：改用 Unity MCP / Unity CLI 读取编辑器 Console，或使用 `--dotnet`。
- `--dotnet` 通过但新增了 `.cs` 文件时，提醒用户：最终以 Unity 编辑器编译为准。
