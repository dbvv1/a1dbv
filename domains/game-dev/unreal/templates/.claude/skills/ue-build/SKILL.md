---
name: ue-build
description: 用 UnrealBuildTool 在命令行编译 Unreal C++ 并提取编译错误。改了头文件、UPROPERTY/UFUNCTION、新增类或模块后，提交前，或用户要求检查编译时使用。只改了 .cpp 函数体且编辑器开着时，优先用 Unreal MCP 的 Live Coding。
allowed-tools: Bash(.claude/skills/ue-build/scripts/build.sh*) Read
argument-hint: "[Target] [Configuration]"
---

# Unreal 编译检查

```bash
.claude/skills/ue-build/scripts/build.sh $ARGUMENTS
```

## 选哪种编译方式

| 情况 | 做法 |
|---|---|
| 编辑器开着，**只改了 `.cpp` 函数体** | 通过 Unreal MCP 调用 `LiveCodingToolset.CompileLiveCoding`（会等到编译结束并返回诊断），不用本脚本 |
| 改了头文件、`UPROPERTY` / `UFUNCTION`、新增类或模块 | 请用户关闭编辑器 → 运行本脚本 → 通过后再打开编辑器 |
| CI，或者编辑器本来就没开 | 运行本脚本 |

- 不加参数时编译 `<项目名>Editor`、`Development`。
- 编译游戏本体：`build.sh <项目名> Development`。

## 处理结果

- 退出码：
  - 0：通过；
  - 1：有编译错误（stdout 中有去重后的错误）；
  - 2：环境问题（看 stderr 和日志末尾）；
  - 3：编辑器的 Live Coding 正在运行（按脚本提示二选一）。
- 逐条修复后**重新运行**，直到通过。
- UHT 报错（`): Error:`）通常是反射宏写错：检查 `UCLASS` / `USTRUCT` / `UPROPERTY` 的说明符和 `.generated.h` 的包含顺序（必须是最后一个 include）。
- 链接错误（`LNK2019` / `undefined reference`）通常是 `.Build.cs` 缺少模块依赖，或者跨模块使用的类没有 `<MODULE>_API` 导出。

## 注意

- 不确定某个引擎 API 的签名时，**先 grep 引擎头文件**（`Engine/Source/`），不要凭记忆写，UE 的 API 在版本之间变化很大。
- 不要为了通过编译而删除代码或注释掉调用；要找到根因。
- 不要把完整日志读进上下文，脚本已经过滤过了。
