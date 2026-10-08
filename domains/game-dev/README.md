# 领域分支：游戏开发

> 核实时间：2026-10-08。
> 主干（`docs/`）讲通用的 AI coding；这个分支只写游戏开发相对主干的**增量**：行业环境、引擎工具链、游戏特有的验证难题、资产管线和运行时 AI。
> 前置阅读：[07 工作流](../../docs/07-workflows.md)（验证闭环）、[14 综合分析](../../docs/14-synthesis.md)（底层规律）。

## 目录

| 文档 | 回答的问题 |
|---|---|
| [01 行业数据与态度](01-industry-and-sentiment.md) | 行业里谁在用、怎么看？玩家和平台的规则是什么？哪些用法有商业回报？ |
| [02 引擎工具链对比](02-engines-and-agent-tooling.md) | Unity、Unreal、Roblox、Godot、Blender 的官方 Agent 接入有什么区别？三种设计思路各有什么取舍？ |
| [**03 验证与试玩**](03-verification-and-playtesting.md) | **游戏为什么难验证？怎么让 Agent 自己试玩？什么必须留给人？**（本分支最重要的一篇） |
| [04 资产管线](04-asset-pipeline.md) | 3D、2D、音频、动画生成工具的现状；Agent 在管线里该做什么 |
| [05 运行时 AI 与世界模型](05-runtime-ai-and-world-models.md) | LLM NPC、决策模型、Genie / Marble 离生产还有多远 |
| [unity/](unity/README.md) | 大型 Unity 项目落地：Unity CLI 和官方插件、编译和测试闭环、配置模板 |

## 一页纸结论（2026-10）

1. **AI 在游戏行业是“工程侧放心用，内容侧要谨慎”。** 从业者中认为 AI 有害的比例两年内从 18% 涨到 52%；争议几乎都集中在美术、配音这类玩家看得见的内容。代码、工具、管线、测试才是主战场。→ [01](01-industry-and-sentiment.md)
2. **三大引擎都有了官方 Agent 接入，但思路不同。** Unity 走 CLI + Skill，Unreal 把几百个工具藏在“工具搜索”后面以节省上下文，Roblox 直接在编辑器里内置了试玩子 Agent 和玩家输入模拟。→ [02](02-engines-and-agent-tooling.md)
3. **游戏的瓶颈在验证，不在生成。** 截图式验证又慢又不可靠；最划算的做法是把游戏改造成“Agent 能玩”的形态：状态可导出、输入可注入、时间可控、场景可加载。→ [03](03-verification-and-playtesting.md)
4. **“好不好玩”没有自动判定标准，所以人工试玩是结构性的必需，不是补救。** Agent 能做出“像游戏的东西”，做不出“好玩的东西”。→ [03](03-verification-and-playtesting.md#5-什么必须留给人)
5. **AI 带来的是数量，不是质量。** Steam 上约 1/3 的新游戏声明使用 AI，但它们取得小有成功的概率只有非 AI 游戏的约 55%；只拿 AI 出美术的作品失败最集中。→ [01](01-industry-and-sentiment.md#3-市场steam-上的-ai-游戏)
6. **运行时 AI 先看决策模型，再看对话 NPC。** 游戏 AI 的多数决策是“从有限选项中选一个”，2026-09 出现的决策模型正好擅长这个；世界模型目前只适合概念探索。→ [05](05-runtime-ai-and-world-models.md)

## 按引擎的推荐起点

| 引擎 | 起点 |
|---|---|
| Unity 6+ | [unity/](unity/README.md)：官方插件 + Unity CLI + 本仓库模板 |
| Unreal 5.8+ | [02 第 2.2 节](02-engines-and-agent-tooling.md#22-unreal几百个工具藏在工具搜索后面)：启用 ModelContextProtocol + Epic 插件，照搬它的五条安全规则 |
| Roblox | [02 第 2.3 节](02-engines-and-agent-tooling.md#23-roblox把-agent-能力直接做进编辑器)：Studio 内置 MCP，用好 `playtest` 子 Agent |
| Godot / 自研 / Web | 通用编码工作流 + [03](03-verification-and-playtesting.md) 的“Agent 可试玩”改造 |
