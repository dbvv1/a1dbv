# 游戏开发 / Unreal Engine

> 核实时间：2026-10-08；2026-10-15 UTC 入口全文复核，补核编译、MCP 权限与运行时采用边界（未运行引擎）。上级目录：[游戏开发分支](../README.md)。本目录单列 UE 的资产、编译与运行入口；引擎选择见 [01 第 3 节](../01-engine-integration.md#3-引擎选择对-ai-coding-的影响)。
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
3. **先核目标版本的引擎头文件与编译诊断。** 用项目实际安装版本的声明核对生成代码，不把模型记忆或其他版本的 API 示例直接当作当前契约。**[经验]**
4. **打包版缺少必要观察或动作入口时，再评估窄 MCP 工具。** 开发／测试版可通过 `AddTool()` 显式注册工具，编辑器工具集不会自动发现；服务器无认证，不对本机外开放，也不随正式发行版启用（[官方运行时与安全边界](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-mcp-in-unreal-editor)）**[一手／经验]**。调用成功不等于真实输入或体验验收通过，已有入口足够就不增加 MCP（见 [02 验证与试玩](../02-verification-and-playtesting.md)）。

## 和 Unity 分支的对照

| | Unity（[unity/](../unity/README.md)） | Unreal（本目录） |
|---|---|---|
| 官方 Agent 接入 | 缺实时入口时评估 CLI／Pipeline；CLI／MCP 按客户端能力选择，Skill 按知识缺口添加 | 缺实时入口时评估 5.8.1+ 实验性 MCP 与所需工具集，Skill 按知识缺口添加 |
| 资产格式 | 默认经 Editor API；文本修改只作项目已验证的受限例外，保留 GUID／fileID 并核引用 | .uasset／.umap 经 Editor API 修改，不做文本补丁 |
| 编译反馈 | 沿用已有编译入口；CLI 已配置时可用 recompile，不承诺固定时长 | 普通实现改动优先 Live Coding；反射／布局变化默认完整构建重启，详见上文编译边界 |
| 测试 | 先用已有入口；`unity test` 区分 8／6 并核报告与范围，异步 Editor 测试另取终态 | 命令行自动化测试＋结果报告；核实际执行范围，不以退出成功代替验收 |
| 运行时验证 | 帧持续推进＋Console／截图／任务断言 | PIE 状态＋任务断言；打包版缺观测时再评估窄 MCP 工具 |
| 隔离试错 | 沿用项目版本控制与恢复点 | 同样保留版本控制与恢复点；5.8 Sandboxes 可补充编辑器内容试错，不替代代码与资产历史（[官方版本控制说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/collaboration-and-version-control-in-unreal-engine)） |
