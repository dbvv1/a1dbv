---
name: ue-build
description: 用 UnrealBuildTool 在命令行编译 Unreal C++ 并提取编译错误。改了头文件、UPROPERTY/UFUNCTION、新增类或模块后，提交前，或用户要求检查编译时使用。只改 .cpp 函数体且编辑器开着、已有可用入口时，可用 Live Coding；不要求 MCP。
allowed-tools: Bash(.claude/skills/ue-build/scripts/build.sh*) Read
argument-hint: "[Target] [Configuration]"
---

# Unreal 编译检查

```bash
.claude/skills/ue-build/scripts/build.sh $ARGUMENTS
```

## 选哪种编译方式

**默认用本脚本编译 `<项目名>Editor`、`Development`；只有「编辑器开着 + 只改 `.cpp` 函数体 + 已有可用 Live Coding 入口」时才留在编辑器内编译。**

| 情况 | 做法 |
|---|---|
| 编辑器开着，**只改了 `.cpp` 函数体**，已有可用 Live Coding 入口 | 使用项目既有入口；仅当已配置 MCP 暴露该工具时，调用 `LiveCodingToolset.CompileLiveCoding`，等待诊断，不同时运行本脚本 |
| 编辑器开着，但没有可用 Live Coding 入口 | 请用户关闭编辑器，再沿用本脚本或项目已有 UBT 命令；不为此安装 MCP |
| 改了头文件、`UPROPERTY` / `UFUNCTION`、新增类或模块 | 请用户关闭编辑器 → 运行本脚本 → 通过后再打开编辑器 |
| CI，或者编辑器本来就没开 | 运行本脚本 |

- 先核对项目已采用本 Skill/脚本且能定位引擎；未采用时沿用 AGENTS 登记的既有构建命令，不要求复制整套模板。
- 编译游戏本体：`build.sh <项目名> Development`。

## 处理结果

- 退出码：
  - 0：通过；
  - 1：有编译错误（stdout 中有去重后的错误）；
  - 2：环境问题（看 stderr 和日志末尾）；
  - 3：编辑器的 Live Coding 正在运行；脚本提到 MCP 不代表该接口存在。只有函数体改动且已有可用入口时才改用 Live Coding，否则请用户关闭编辑器后重试完整构建。
- 逐条修复后**重新运行**，直到通过。
- UHT 报错（`): Error:`）通常是反射宏写错：检查 `UCLASS` / `USTRUCT` / `UPROPERTY` 的说明符和 `.generated.h` 的包含顺序（必须是最后一个 include）。
- 链接错误（`LNK2019` / `undefined reference`）通常是 `.Build.cs` 缺少模块依赖，或者跨模块使用的类没有 `<MODULE>_API` 导出。

## 注意

- 不确定某个引擎 API 的签名时，**先 grep 引擎头文件**（`Engine/Source/`），不要凭记忆写，UE 的 API 在版本之间变化很大。
- 不要为了通过编译而删除代码或注释掉调用；要找到根因。
- 不要把完整日志读进上下文，脚本已经过滤过了。
