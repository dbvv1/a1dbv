# 游戏开发 / Unreal Engine

> 核实时间：2026-10-08。上级目录：[游戏开发分支](../README.md)。为什么值得单独一个子目录，见 [06 引擎格局](../06-engine-landscape.md)：AA 工作室 59%、AAA 工作室 47% 用 Unreal，自研引擎的份额正在让给 UE5。
> 前置阅读：主干的 [07 工作流](../../../docs/07-workflows.md)（验证闭环）和 [03 上下文工程](../../../docs/03-context-engineering.md)。

| 文档 | 内容 |
|---|---|
| [01-toolchain.md](01-toolchain.md) | UE 5.8 官方 MCP（架构、配置、写自己的工具、**打包版也能跑 MCP**）、Epic 的 Claude Code 插件、5.8 中和 AI 相关的功能、UEFN 的 AI 功能、社区方案、IDE |
| [02-large-project-guide.md](02-large-project-guide.md) | 大型项目落地：二进制资产与禁区、Live Coding 和 UBT 两档编译、命令行自动化测试、PIE 和打包版的试玩验证、Perforce、评审清单 |
| [templates/](templates/README.md) | 可以拷进 UE 项目的配置：AGENTS.md、CLAUDE.md、保护 Hook、`ue-build` / `ue-run-tests` Skill、`ue-code-reviewer` 子 Agent |

## 一页纸推荐（2026-10）

```
UE 5.8.1+：
  Claude Code 或 Codex
  + Unreal MCP（编辑器内置，实验性）+ All Toolsets
  + Epic 官方插件 unreal-engine-skills-for-claude-code（unreal-mcp / create-toolset / unreal-skill）
  + Rider 或 clangd（compile_commands.json）
  + 本目录 templates（命令行编译和测试、二进制资产保护、UObject 评审清单）

UE 5.5–5.7：
  Claude Code + 通用编码工作流（C++）+ 本目录的命令行编译和测试
  + 需要操作编辑器时：UnrealClaude（社区）
```

## 四个最重要的认识

1. **UE 项目的 AI 化程度，取决于“逻辑有多少在 C++ 里”。** `.uasset` 和蓝图是二进制的，通用编码 Agent 看不见；C++ 能被 Agent、编译器和测试同时检查。新功能的逻辑优先写 C++，蓝图只做组装和配置。
2. **编译分两档，选错就浪费时间。** 只改 `.cpp` 函数体 → MCP 调 Live Coding，秒级；改头文件、反射宏、新增类 → 关编辑器、命令行完整编译。Live Coding 不会传播新增的 `UFUNCTION`，这是官方文档写明的 **[一手]**。
3. **让 Agent 去 grep 引擎头文件。** UE 的 API 在版本之间变化大，模型常写出旧 API；安装版自带引擎头文件，这是对付 API 幻觉最便宜、最可靠的手段。
4. **Unreal MCP 不只是“编辑器遥控器”。** 打包后的游戏也能托管 MCP 服务器 **[一手]**：在开发版里注册“导出状态、注入动作、加载场景”的工具，Agent 就能直接玩打包后的游戏，这是验证闭环的关键一环（见 [03 验证与试玩](../03-verification-and-playtesting.md)）。

## 和 Unity 分支的对照

| | Unity（[unity/](../unity/README.md)） | Unreal（本目录） |
|---|---|---|
| 官方 Agent 接入 | Unity CLI（命令行优先）+ 33 个 Skill；`unity mcp` | 编辑器内置 MCP（工具搜索 + 几百个工具）+ 3 个 Skill |
| 资产格式 | YAML 文本，引用脆弱 → 禁止手改 | 二进制 → 只能通过工具改 |
| 编译反馈 | `unity recompile` 秒级；batchmode 分钟级 | Live Coding 秒级（仅函数体）；UBT 分钟级 |
| 测试 | `unity test`，退出码清楚（8 失败 / 6 基础设施问题） | `UnrealEditor-Cmd -ExecCmds="Automation RunTest …"` + `index.json` 报告 |
| 运行时验证 | `frameCount` 判断游戏是否真的在运行 | PIE 状态；**打包版托管 MCP** |
| 隔离试错 | 版本控制分支 | 5.8 Sandboxes |
| 模型熟悉程度 | 高 | 中（宏多、版本差异大） |
