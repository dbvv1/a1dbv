# 游戏开发 / Unreal Engine

> 核实时间：2026-10-08。上级目录：[游戏开发分支](../README.md)。为什么值得单独一个子目录，见 [01 引擎接入第 3 节](../01-engine-integration.md#3-引擎选择对-ai-coding-的影响)和 GDC 2026 调查：AA 工作室 59%、AAA 工作室 47% 用 Unreal，自研引擎的份额正在让给 UE5。
> 前置阅读：主干的 [07 工作流](../../../docs/07-workflows.md)（验证闭环）和 [03 上下文工程](../../../docs/03-context-engineering.md)。

| 文档 | 内容 |
|---|---|
| [01-toolchain.md](01-toolchain.md) | UE 5.8 官方 MCP（架构、配置、写自己的工具、**打包版也能跑 MCP**）、Epic 的 Claude Code 插件、5.8 中和 AI 相关的功能、UEFN 的 AI 功能、社区方案、IDE |
| [02-large-project-guide.md](02-large-project-guide.md) | 大型项目落地：二进制资产与禁区、Live Coding 和 UBT 两档编译、命令行自动化测试、PIE 和打包版的试玩验证、Perforce、评审清单 |
| [**03-engine-fundamentals.md**](03-engine-fundamentals.md) | **Unreal 基础知识**：对象模型、Gameplay Framework、反射与 UHT、GC、模块与构建、蓝图与 C++ 分工、常用系统（Subsystem、Enhanced Input、GAS、StateTree）、网络同步、资产管理、World Partition 与渲染、测试调试、版本路线；每节附“AI 要点” |
| [templates/](templates/README.md) | 可以拷进 UE 项目的配置：AGENTS.md、CLAUDE.md、保护 Hook、`ue-build` / `ue-run-tests` Skill、`ue-code-reviewer` 子 Agent |

## 一页纸推荐（2026-10）

先沿用当前项目的构建、测试和编辑器入口；只补确实缺少的操作能力。**[研究：采用判断]**

| 当前需要 | 起点与增加条件 |
|---|---|
| C++ 代码修改 | 已有 UBT／自动化测试与源码检索；不为纯代码先启用 MCP 或安装插件 |
| UE 5.8.1+ 的编辑器资产操作 | 已配置的 Editor 脚本或接口优先；缺入口时再评估实验性 Unreal MCP，只启用所需工具集，不默认 All Toolsets |
| UE 5.5–5.7 编辑器操作 | 沿用兼容 Editor Python 或既有入口；确有缺口再评估社区桥，按项目版本核能力 |
| 符号定位、重复构建或评审遗漏 | 需要时再选 Rider／clangd 或模板中的对应检查，不把整套 Skill／Hook／reviewer 当前置 |

选择边界与版本前提见 [01 工具链](01-toolchain.md)和[模板说明](templates/README.md)；没有安全入口时说明缺口，不直接改二进制资产或扩大全部工具权限。当前为文档建议，未验证具体项目接入效果。

## 四个最重要的认识

1. **保留现有 C++／蓝图分工，按任务核对读改和验证入口。** 二进制格式不等于接入工具后蓝图仍不可见；先确认工具 schema、状态回读和蓝图编译能力，缺必要入口时收窄自动修改范围，不默认迁成 C++。依据与局限见 [03 蓝图与 C++ 的分工](03-engine-fundamentals.md#6-蓝图与-c-的分工)（2026-10-14 核实）。**[一手／经验]**
2. **编译策略与工具发现分开。** 普通实现改动可用已验证的 Live Coding；反射／布局变化优先完整构建与重启作为保守策略，不宣称 Reinstancing 一概不支持。新增 MCP C++ 工具的 `UFUNCTION` 仍按其官方发现契约完整重启，见 [编译与重复运行边界](02-large-project-guide.md#3-编译验证)。
3. **让 Agent 去 grep 引擎头文件。** UE 的 API 在版本之间变化大，模型常写出旧 API；安装版自带引擎头文件，这是对付 API 幻觉最便宜、最可靠的手段。
4. **Unreal MCP 不只是“编辑器遥控器”。** 打包后的游戏也能托管 MCP 服务器 **[一手]**：在开发版里注册“导出状态、注入动作、加载场景”的工具，Agent 就能直接玩打包后的游戏，这是验证闭环的关键一环（见 [02 验证与试玩](../02-verification-and-playtesting.md)）。

## 和 Unity 分支的对照

| | Unity（[unity/](../unity/README.md)） | Unreal（本目录） |
|---|---|---|
| 官方 Agent 接入 | Unity CLI（命令行优先）+ 33 个 Skill；`unity mcp` | 编辑器内置 MCP（工具搜索 + 几百个工具）+ 3 个 Skill |
| 资产格式 | YAML 文本，引用脆弱 → 禁止手改 | 二进制 → 只能通过工具改 |
| 编译反馈 | `unity recompile` 秒级；batchmode 分钟级 | Live Coding 秒级（仅函数体）；UBT 分钟级 |
| 测试 | `unity test`，退出码清楚（8 失败 / 6 基础设施问题） | `UnrealEditor-Cmd -ExecCmds="Automation RunTest …"` + `index.json` 报告 |
| 运行时验证 | `frameCount` 判断游戏是否真的在运行 | PIE 状态；**打包版托管 MCP** |
| 隔离试错 | 版本控制分支 | 5.8 Sandboxes |
