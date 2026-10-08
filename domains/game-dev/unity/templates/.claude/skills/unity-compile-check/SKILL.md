---
name: unity-compile-check
description: 检查 Unity C# 能否编译通过并提取编译错误。改完 C# 代码后、提交前、用户要求检查编译时，或怀疑有编译错误导致编辑器进入 Safe Mode 时使用。
allowed-tools: Bash(.claude/skills/unity-compile-check/scripts/compile_check.sh*) Read
argument-hint: "[--editor | --dotnet | --batch]"
---

# Unity 编译检查

```bash
.claude/skills/unity-compile-check/scripts/compile_check.sh $ARGUMENTS
```

## 选哪种模式

| 情况 | 参数 |
|---|---|
| 编辑器已打开，Unity 6+，装了 Unity CLI 和 Pipeline 包 | `--editor`（`unity recompile`，最准确，秒级） |
| 只想快速检查，已生成 .sln | `--dotnet` |
| 编辑器关闭，需要完整编译 | `--batch`（几分钟） |
| 不确定 | 不加参数：有 .sln 和 dotnet 就用 dotnet，否则用 batch |

## 处理结果

- 退出码：0 通过；1 有编译错误（stdout 中有去重后的 `error CS####`）；2 环境问题（看 stderr）。
- 逐条修复后**重新运行**，直到通过。
- `--editor` 报告 **Safe Mode**：编辑器启动时就有编译错误，CLI 连不上。改用 `--dotnet` 定位错误，修好后请用户重启编辑器。
- `--batch` 报告项目被锁：编辑器已经打开了，改用 `--editor` 或 `--dotnet`。
- `--dotnet` 通过了但这次新增或删除了 `.cs` 文件时，要提醒用户：csproj 可能过时，最终以 Unity 编译为准。

## 注意

- 不要为了让编译通过而删掉代码或注释掉调用；要找到根因。
- 不要把整份 Editor.log 读进上下文，脚本已经过滤过了。
