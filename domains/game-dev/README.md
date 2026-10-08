# 领域分支：AI coding × 游戏开发

> 核实时间：2026-10-08。
> 这个分支回答：**主干里的 AI coding 方法，放到游戏开发里具体怎么用？** 重点是 AI 与游戏开发的结合；Unity 和 Unreal 子目录里也有**引擎基础知识**，作为和 AI 协作的前提（每节都标出 Agent 在这里容易犯的错）。
> 前置阅读：[07 工作流](../../docs/07-workflows.md)（验证闭环）、[14 深度分析](../../docs/14-synthesis.md)（底层规律）。

## 1. 结合方式全景：游戏开发每个环节里 AI 做什么

| 环节 | AI 做什么 | 怎么接入 | 怎么验证 | 人做什么 | 详见 |
|---|---|---|---|---|---|
| **策划 → 规格** | 把玩法描述整理成规格：状态机、数值表、边界情况、验收标准 | 访谈式 Spec（`spec-interview` Skill） | 人审规格 | **定核心玩法和“好玩”的标准** | [07](../../docs/07-workflows.md#3-大功能访谈式-spec-) |
| **玩法和系统代码** | 写 C# / C++ 逻辑、补测试、重构 | Claude Code / Codex + 引擎 LSP | 编译 + 单元测试（L0–L1） | 定架构和接口，按切片评审 | [unity/02](unity/02-large-project-guide.md)、[unreal/02](unreal/02-large-project-guide.md) |
| **编辑器和资产操作** | 搭场景、改 Prefab / 蓝图、批量设置导入参数 | **引擎官方 MCP / CLI**（Unity CLI、Unreal MCP、Roblox Studio MCP） | 检查工具返回值，存盘点 | 不让 Agent 手改序列化文件或二进制资产 | [01](01-engine-integration.md) |
| **运行时验证** | 自己试玩：导出状态、注入输入、加载测试场景、批量模拟 | 试玩接口（自定义命令或 MCP 工具） | 验证阶梯 L2–L5 | **手感、乐趣、美术**（L6） | [**02**](02-verification-and-playtesting.md) |
| **工具和管线** | 编辑器扩展、导入后处理、配置表解析、构建脚本 | 通用编码工作流 | 脚本测试 | — | [unity/02](unity/02-large-project-guide.md#9-哪些任务适合交给-ai) |
| **资产生成** | 调 3D / 2D / 音频生成 API，批量导入、规范化、记录来源 | API 或 MCP + 编辑器脚本 | 导入检查 | 美术把关风格 | [03](03-generative-ai-in-games.md#1-资产管线agent-负责搬运和规范) |
| **游戏内 AI** | NPC 对话、决策（新兴的决策模型） | 运行时推理（本地或云端） | 无头模拟、可替换接口 | 定设计目标 | [03](03-generative-ai-in-games.md#2-游戏运行时的-ai) |
| **构建和 CI** | 编译、测试、打包、分析失败日志 | 引擎命令行（`unity test`、`UnrealEditor-Cmd`、BuildCookRun） | 退出码 + 报告解析 | 审批发布 | 各引擎子目录 |

## 2. 和普通软件相比，游戏的三个特殊点

1. **资产不是纯文本**：Unity 的 YAML 引用脆弱，Unreal 的 `.uasset` 是二进制。所以**编辑器操作必须走引擎官方的 Agent 接口**，不能让 Agent 手改文件。各引擎的接法见 [01](01-engine-integration.md)。
2. **验证最难**：实时、状态多、涌现行为，而且“好不好玩”没有自动判定标准。所以要把游戏**改造成 Agent 能玩的形态**，并把人工试玩当作结构性的必需环节。这是本分支最重要的内容，见 [02](02-verification-and-playtesting.md)。
3. **内容侧有外部约束**：
   - GDC 2026 调查中 52% 的从业者认为生成式 AI 对行业有害（2024 年是 18%）；
   - Steam 要求披露 AI 生成内容；
   - Godot 已不再接受 AI 生成的代码贡献。

   争议几乎都集中在**玩家看得见的内容**（美术、配音），代码、工具、测试很少引起争议。所以 **AI 的主战场在工程侧**，见 [03](03-generative-ai-in-games.md#3-外部约束披露与玩家态度)。

## 3. 按引擎的起点

| 引擎 | 起点 |
|---|---|
| **Unity 6+** | [unity/](unity/README.md)：Unity CLI + 官方插件（33 个 Skill）+ 本仓库模板 |
| **Unreal 5.8+** | [unreal/](unreal/README.md)：Unreal MCP + Epic 插件 + 本仓库模板 |
| Roblox | [01 第 2.3 节](01-engine-integration.md#23-roblox把-agent-能力直接做进编辑器)：Studio 内置 MCP，用好 `playtest` 子 Agent |
| Godot / 自研 / Web | 通用编码工作流 + [02](02-verification-and-playtesting.md) 的“Agent 可试玩”改造 |

引擎格局速览（VGI 对 Steam 2024 年的统计 **[一手：报告原文]**）：
- 新游戏中 Unity 占 51%、Unreal 占 28%、Godot 占 5%；
- 但百万销量以上的游戏里，自研引擎占 46%、Unreal 占 31%；
- AA、AAA 工作室越来越多地从自研引擎转向 UE5；独立游戏仍以 Unity 为主，Godot 增长最快。

引擎选择对 AI coding 的影响见 [01 第 3 节](01-engine-integration.md#3-引擎选择对-ai-coding-的影响)。

## 4. 目录

| 文档 | 内容 |
|---|---|
| [01 引擎接入](01-engine-integration.md) | Unity、Unreal、Roblox、Godot、Blender 的官方 Agent 接入；三种设计思路；引擎选择对 AI coding 的影响 |
| [**02 验证与试玩**](02-verification-and-playtesting.md) | 验证阶梯 L0–L6、“Agent 可试玩”改造、真实案例、什么必须留给人 |
| [03 游戏中的生成式 AI](03-generative-ai-in-games.md) | Agent 驱动的资产管线、游戏运行时的 AI（NPC、决策模型、世界模型）、披露与玩家态度 |
| [unity/](unity/README.md) | Unity：**引擎基础知识**（每节附 AI 要点）、Unity CLI 和官方插件、大型项目的编译和测试闭环、配置模板 |
| [unreal/](unreal/README.md) | Unreal：**引擎基础知识**（每节附 AI 要点）、UE 5.8 官方 MCP 和 Epic 插件、Live Coding 与 UBT、自动化测试、配置模板 |
