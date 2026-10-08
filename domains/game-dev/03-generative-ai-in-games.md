# 游戏中的生成式 AI：资产管线、运行时 AI 与外部约束

> 核实时间：2026-10-08。
> 前两篇讲 Coding Agent 怎么写游戏、怎么验证游戏；这一篇讲另外两种结合方式：**Agent 驱动的资产管线**和**在游戏里运行的 AI**，以及使用时必须考虑的外部约束。
> 这一块的工具信息多来自厂商页面和二手报道，评级相应保守。

## 1. 资产管线：Agent 负责搬运和规范

**核心观点**：Coding Agent 在资产管线里最大的价值**不是“生成”，而是“编排和规范”**。调 API 批量生成、下载、导入、设置参数、记录来源和许可，这些机械工作 Agent 做得又快又稳。

### 1.1 推荐流程（跨引擎）

```
生成（API / MCP）→ 下载到隔离目录 → 编辑器脚本批量导入并设置参数 → 记录来源 → 人工美术审核 → 替换或转正
```

1. **隔离**：AI 生成物统一放在单独目录（Unity：`Assets/_Generated/<来源>/`），和正式资源分开，方便替换和许可审计。
2. **记录来源**：同目录放 `SOURCES.md`，写明工具、版本、日期、提示词、许可。发售时的商店披露就从这里汇总。
3. **让 Agent 写编辑器脚本做规范化**：压缩格式、Mipmap、碰撞体、LOD、命名，不要手动点。
4. **在脚本里设置数量和费用上限**：生成 API 按次计费。
5. **占位资源要有替换计划**：开发早期的 AI 占位贴图也可能在发售后引发争议（见第 3 节）。

### 1.2 工具现状（2026-10）

| 类别 | 工具 | 状态 | 评级 |
|---|---|---|---|
| 3D 生成 | Meshy 6、Tripo 3.1、Rodin Gen-2.5 | 一篇对比测试（作者为 Meshy 员工）认为没有全面领先者：Tripo 几何和拓扑更好，Meshy 贴图更好 **[二手]**；拓扑和 UV 仍常需人工整理 | 🧪 原型、占位、背景物件 |
| 3D 开源 | TRELLIS.2（微软，2026-06 仍在更新）、Hunyuan3D 2.1（开源仓库停在 2025-10，托管版已到 3.x）**[一手：仓库]** | 可自部署，需要 GPU；Hunyuan 许可有地区和规模限制 | 👀 |
| 引擎内生成 | Roblox Studio MCP 的 `generate_mesh` / `generate_material`、Unity AI 生成器 **[一手]** | Agent 可以直接调用，生成即插入 | 🧪 |
| DCC 工具 | Blender Lab 官方 MCP（场景分析）、社区 blender-mcp（资产获取）| **都直接执行模型生成的 Python，没有防护**，官方建议放在虚拟机里 **[一手]** | 🧪 隔离环境中 |
| 2D / 概念图 | 通用图像模型、ComfyUI + 开源模型（如 FLUX 3）、Scenario（自有画风） | 成熟 | 🧪 |
| 音频 | ElevenLabs 等 TTS 和音效；Suno、Udio 等音乐 | **配音需要声音授权，音乐商用许可差异大** | 🧪 先查许可 |

## 2. 游戏运行时的 AI

| 方向 | 现状 | 评级 |
|---|---|---|
| **LLM 驱动的对话 NPC** | 已上线的例子：inZOI（NVIDIA ACE，端侧运行）、Suck Up!（玩法就是“骗 NPC 开门”）、堡垒之夜 UEFN 的 Conversations（2026-04 实验功能）**[二手]**。**成功的例子都把“NPC 不可完全控制”变成了玩法本身**，而不是拿 LLM 替代写好的对话树 | 👀（玩法以它为核心时 🧪） |
| **决策模型驱动 NPC 决策** | 2026-09 出现的新模型类别（Jev、Cloudflare Clef、Strands Decider 等）：只从预定义选项中选择并给出置信度，0.8B–2B 模型延迟几十毫秒（详见 [docs/02](../../docs/02-models-and-cost.md#21-新类别决策模型2026-09-起)）。游戏 AI 的多数决策本来就是“从有限选项中选一个”，**特性上很适合，但还没有游戏案例** **[经验：推断]** | 👀 值得做原型 |
| **世界模型** | Google Project Genie（基于 Genie 3，会话约 60 秒，没有持久状态）；World Labs 的 Marble（AMD 2026-09 宣布约 82 亿美元收购，主要方向是机器人仿真）**[二手]**。Take-Two 总裁：“不是游戏引擎” | 👀 概念探索；⛔ 替代引擎 |

**运行时 AI 的工程要点**（和 Coding Agent 的验证闭环直接相关）：
1. **LLM 调用放在可替换的接口后面**：测试和回放时用固定回复的假实现，正式运行再接真模型。否则确定性测试和 bug 复现都会失效。
2. **先用无头模拟评估**：比如“行为树”对比“行为树 + 决策模型”，看玩家可感知的差异是否值得增加的复杂度（见 [02 验证阶梯 L2](02-verification-and-playtesting.md#2-验证阶梯从便宜确定到昂贵主观)）。
3. **成本和延迟**：云端推理按玩家时长计费，和买断制冲突；所以已上线的作品多选端侧小模型（UE 可以用 NNE 运行 ONNX 模型 **[一手：UE 5.8 发布说明]**）。
4. **内容安全**：玩家一定会尝试越狱，要有输出过滤和分级合规方案。

## 3. 外部约束：披露与玩家态度

| 事实 | 来源 |
|---|---|
| GDC 2026：36% 的从业者在工作中用生成式 AI（程序相关用途中“代码辅助”占 47%）；但 **52% 认为它对行业有害**（2025 年 30%，2024 年 18%），美术（64%）、策划（63%）、程序（59%）最负面 | GDC 官方摘要 **[一手]** |
| Steam：约 1/3 的新游戏声明使用 AI；它们取得小有成功（≥100 条评测）的概率只有非 AI 游戏的约 55%；**只用 AI 出美术的作品失败最集中**，而成功作品更多把 AI 用在本地化、配音等环节 | 53,597 款游戏的全量统计 **[社区：原文]** |
| 2025-12，《光与影：33 号远征队》因早期用过 AI 占位贴图（发售前已替换）被撤销 Indie Game Awards 年度游戏 | HN 讨论 **[社区]** |
| 2026-07，**Godot 不再接受 AI 生成的代码贡献**：“我们无法信任重度使用 AI 的人足够理解自己的代码并修复它” | PC Gamer 转述官方博客 **[二手]** |

**对团队的含义**：

| 用途 | 建议 |
|---|---|
| 代码、工具、管线、测试、本地化 | ✅ 放心用，这是主战场 |
| 配音、辅助文本 | 🧪 有授权、经人工审核、如实披露 |
| 正式美术（角色、主视觉、宣传图） | ⚠️ 慎用；概念和占位要有替换计划 |
| 向开源引擎或插件贡献代码 | 先读对方的贡献政策 |
| 商店披露 | 如实、具体地写明用途和人工审核环节 |

## 来源

- 资产工具：各工具官网；TRELLIS.2、Hunyuan3D-2.1、blender-mcp 仓库（2026-10-08 查看最近提交）；[Roblox Studio MCP 文档](https://create.roblox.com/docs/en-us/studio/mcp)；[Blender Lab MCP Server](https://www.blender.org/lab/mcp-server/)；[HackerNoon：3D 生成器对比](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)（二手）
- 运行时 AI：[Cloudflare：Introducing Clef](https://blog.cloudflare.com/clef-decision-models/)、[Forkast：Jev](https://forkast.news/typesafe-ais-jev-is-not-an-llm-and-that-may-be-the-point/)（二手）、[TechCrunch：Project Genie](https://techcrunch.com/2026/01/29/i-built-marshmallow-castles-in-googles-new-ai-world-generator-project-genie)（二手）、[Data Center Knowledge：AMD 收购 World Labs](https://datacenterknowledge.com/data-center-chips/amd-to-acquire-world-labs-for-8-2b-to-advance-ai-models-and-robotics)（二手）、[Wikipedia：inZOI](https://en.wikipedia.org/wiki/InZOI)
- 外部约束：[GDC 2026 State of the Game Industry](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/)、[Sulka Haro：Three years of AI on Steam](https://fragwyz.substack.com/p/three-years-of-ai-on-steam)、[PC Gamer：Godot](https://www.pcgamer.com/gaming-industry/open-source-game-engine-godot-will-no-longer-accept-ai-authored-code-contributions-we-cant-trust-heavy-users-of-ai-to-understand-their-code-enough-to-fix-it/)、[HN：Clair Obscur](https://news.ycombinator.com/item?id=46342902)
