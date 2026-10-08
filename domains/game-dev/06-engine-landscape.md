# 引擎格局：谁在用什么，以及对 AI coding 意味着什么

> 核实时间：2026-10-08。
> 回答三个问题：**大厂是不是都转向虚幻 5？独立游戏是不是仍以 Unity 和 Godot 为主？Unity 是否在向虚幻靠拢？** 最后一节讨论引擎选择对 AI coding 的影响。
> 主要数据：
> - VG Insights《The Big Game Engine Report of 2025》PDF 原文 **[一手：第三方数据商，估算]**；
> - GDC 2026 State of the Game Industry 官方摘要 **[一手]**；
> - Epic 的 UE 5.8 发布帖和发布说明 **[一手]**。

## 1. 结论先行

| 问题 | 回答 | 把握 |
|---|---|---|
| 大厂是否优先虚幻 5？ | **是，而且趋势很明确**：自研引擎的份额在持续让给 UE5。但头部大厂仍有大量自研引擎，“全面转向”言过其实 | 高 |
| 独立游戏是否仍以 Unity 为主？ | **按发行数量是**：Unity 约占 Steam 新游戏的一半，小游戏中占比最高。但 UE 在独立游戏中也在增长 | 高 |
| Godot 呢？ | **增长最快的小引擎**，但绝对份额仍小（约 5–7% 的发行量、约 1% 的销量） | 中高 |
| Unity 是否在借鉴虚幻？ | 更准确的说法是**两边在趋同**：Unity 6 的 GPU 驱动渲染、实时 GI、ECS、行为树等方向和 UE 相似；UE 也在补 Unity 的强项（风格化渲染、移动端、轻量 GI） | 中（属于分析判断） |

## 2. 数据：Steam 上的引擎份额（VGI，2024 年数据）

只统计生涯销量 ≥ 1,000 份的游戏 **[一手：VGI 报告 PDF]**：

| | Unity | Unreal | Godot | GameMaker | 自研及其他 |
|---|---|---|---|---|---|
| **2024 年新发行游戏数量** | **51%** | 28% | 5% | 4% | 约 12%（含 Ren'Py 2%） |
| **2024 年销量（份数）** | 26% | **31%** | 约 1% | 约 1% | **41%**（Frostbite、RAGE、Creation Engine 等） |

**按游戏规模拆分（2024 年销量）**：

| 规模 | Unity | Unreal | Godot + GameMaker | 自研及其他 |
|---|---|---|---|---|
| 极小（< 1 千份） | **50%** | 23% | 13% | 14% |
| 小（1 千–10 万份） | **48%** | 27% | 6% | 19% |
| 中（10 万–100 万份） | 35% | 32% | 5% | 29% |
| **大（100 万份以上）** | 22% | 31% | 1% | **46%** |

**长期趋势** **[一手：VGI]**：
- 自研引擎在新发行游戏中的占比从 2012 年的 71% 降到 2024 年的 13%；在销量中，2024 年**首次低于一半**（42%）。
- Unreal 的发行占比逐年上升（2012 年 17% → 2024 年 28%）；Unity 2021 年后略有下滑（53% → 50%）。
- UE5 在 2024 年发行的 UE 游戏中已占 72%；新版本引擎大约要 3–4 年才会反映到上市游戏里。
- VGI 预测到 2030 年，按销量 Unreal 约 40%、Unity 约 28%、自研约 27%、Godot 和 GameMaker 约 5%（预测，仅供参考）。
- 按类型：动作 RPG、类魂、FPS 这类**高画面要求**的游戏偏向 UE；策略、模拟、城市建造偏向 Unity。
- Godot 贡献了 2020 年以来小型公开引擎增长的三分之二以上。

## 3. 数据：从业者调查（GDC 2026）

[GDC 官方摘要](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/) **[一手]**：
- **主力引擎**：Unreal 42%，Unity 30%；
- **AA 工作室 59%、AAA 工作室 47% 用 Unreal**；
- **成立较久的独立工作室有 54% 仍用 Unity**；Godot 在新成立的独立团队中占 11%，在成熟工作室中很少。

**注意两组数据的差别**：GDC 调查的是“从业者”（大团队人多，所以 UE 占比高）；VGI 统计的是“游戏数量和销量”（小游戏多，所以 Unity 的发行占比高）。**两组数据并不矛盾，合起来正好说明：人多、预算高的项目用 UE，数量多、规模小的项目用 Unity。**

## 4. 大厂为什么转向 UE5

**已公开的迁移案例** **[二手：媒体报道，以官方公告为准]**：
- CD Projekt 的《巫师 4》从 REDengine 换成 UE5，并与 Epic 建立多年合作。官方的说法是要摆脱自研引擎每代游戏都要重新维护的负担，而不是因为《赛博朋克 2077》首发出了问题。
- Halo Studios（原 343）宣布后续作品从 Slipspace 换成 UE5。
- 2K 的 Hangar 13 放弃自研的 Fusion 引擎，《四海兄弟：故乡》改用 UE5。

**VGI 总结的利弊** **[一手：VGI]**：

| 换成公开引擎的好处 | 坏处 |
|---|---|
| 新团队第一天就能开工 | 市场集中后，引擎商可以涨价 |
| Nanite、Lumen 这类技术的质量有保证 | 很多项目仍需要大量魔改 |
| 不用自己维护引擎 | 老团队迁移成本高 |
| **能招到熟悉引擎的人**，文档和教程多 | 定制引擎能为特定品类做出独特优势 |
| | 依赖别人的路线图 |

**反面声音：UE5 的性能问题**。《潜行者 2》《寂静岭 2 重制版》《黑神话：悟空》等 UE5 游戏都因卡顿（尤其是着色器编译卡顿）被批评。Epic CEO Tim Sweeney 认为主要是开发团队把优化留到了最后 **[二手]**。

UE 5.8（2026-06-17 发布）**[一手：Epic 发布帖和发布说明]** 的重点就是稳定和性能：
- 减少多个子系统的着色器变体，PSO 预缓存可以在数据未就绪时优雅失败；
- MegaLights 达到正式可用（Production-Ready），目标是当代主机上 60 FPS；
- 新增 **Lumen Lite**，速度约为 Lumen 高质量模式的两倍，面向掌机和低端 PC。

Tom Looman 认为这些改动“对所有人都是好消息” **[社区：原文]**。社区报道称下一个大版本 UE6 的抢先体验目标是 2027 年底 **[二手]**。

## 5. 中国市场

- 手游和跨平台项目大量使用 Unity。米哈游的《原神》《崩坏：星穹铁道》、腾讯的《王者荣耀》都基于 Unity **[二手]**。
- 主机和 PC 的 3A 项目倾向 UE（如《黑神话：悟空》）**[一手：VGI 列出了它的引擎]**。
- **团结引擎 2.0**（Unity 中国，2026-07-28 发布）**[二手：IT 之家、南都报道]**：
  - 重构了底层架构，首次支持 PS5、Xbox Series X|S、Switch；
  - 推出 AI 开发智能体“**团结 Codely**”，覆盖理解需求、写代码、搭场景、运行测试、修复报错。官方把理念称为“**Loop Engineering**”：AI 的价值是交付经过验证的结果，而不只是生成代码。这和本仓库的核心判断一致（见 [docs/14](../../docs/14-synthesis.md)）；
  - Unity 中国 CEO 在采访中提醒：AI 能快速生成代码，但后续调试和维护的综合成本“大概率更高”。
- Unity 国际版：Unity 7 计划 2026-12 开启早期 Beta，2027 年第一季度正式发布；CoreCLR 脚本运行时计划在 Unity 6.7 / 6.8 落地 **[二手：社区和论坛转述，以官方路线图为准]**。

## 6. Unity 和 UE：趋同而不是单向借鉴

下表是常见功能的对照。**“趋同”是本仓库的分析判断** **[经验]**，Unity 一侧的功能名来自 Unity 6 公开资料。

| 方向 | Unreal | Unity | 说明 |
|---|---|---|---|
| GPU 驱动渲染 / 海量几何 | Nanite | GPU Resident Drawer、GPU 遮挡剔除 | 思路相近，能力差距仍大 |
| 实时全局光照 | Lumen、Lumen Lite（5.8） | Adaptive Probe Volumes；路线图上有 Surface Cache GI **[二手]** | Unity 在补实时 GI |
| 渲染管线组织 | RDG（Render Dependency Graph） | Render Graph（URP，Unity 6） | 同一类架构 |
| 数据导向 / 大规模实体 | Mass Framework | DOTS / ECS（Entities） | Unity 更早，UE 后来跟进 |
| AI 行为 | Behavior Tree、**StateTree**、EQS、Smart Objects | Behavior 包（行为图）、第三方插件 | Unity 在补官方工具 |
| 可视化脚本 | Blueprint（核心工作流） | Visual Scripting（边缘） | **最大的文化差异**：UE 团队大量逻辑在蓝图里 |
| 过场动画 | Sequencer | Timeline | 对等 |
| 程序化内容 | **PCG**（5.8 增强） | 第三方为主 | UE 领先 |
| 数字人 | **MetaHuman**（5.8 支持单摄像头无标记动捕） | 无对等的官方方案 | UE 独有优势 |
| 风格化渲染 | **Toon Shader**（5.8 实验性） | 强项（URP + Shader Graph） | **UE 在补 Unity 的强项** |
| 移动端 | 5.8 重点改善 | 传统强项 | UE 在补 Unity 的强项 |
| 脚本运行时 | C++ + Verse（UEFN） | C#，正在迁移 CoreCLR | — |

**对 Unity 团队的建议**：
- 借鉴 UE 的**架构思想**（数据驱动、GPU 驱动、状态树式 AI、PCG），而不是照搬 API。
- 让 AI 帮你“把 UE 的某个做法移植到 Unity”时，**先让它列出两边概念的对应关系和差异，再动手**，否则容易产出混用两套概念的代码。

## 7. 引擎选择对 AI coding 的影响

| 因素 | Unity | Unreal | Godot |
|---|---|---|---|
| 训练语料 | **C# 和 Unity 代码极多**，模型非常熟悉 | UE C++ 宏多（`UCLASS`、`UPROPERTY`、`GENERATED_BODY`），**版本间 API 变化大**，模型容易写出旧版本 API | GDScript 语料较少，Godot 3 → 4 的 API 变化大，模型常混用 |
| “真相来源” | 引擎闭源，只有 C# 参考源码 | **引擎源码随安装版提供头文件**（源码版可得完整源码），**让 Agent 去 grep 引擎头文件**是对付 API 幻觉的最有效手段 | 开源，可以直接读引擎源码 |
| 资产可读性 | YAML 文本，但引用脆弱 | `.uasset` / `.umap` 是**二进制**，只能通过编辑器工具操作 | `.tscn` 纯文本，最友好 |
| 编译循环 | 秒级到分钟级（domain reload） | 改 `.cpp` 用 Live Coding 秒级；**改头文件或反射宏要完整编译并重启编辑器**，分钟级 | 脚本即改即用 |
| 官方 Agent 接入 | Unity CLI + 33 个 Skill | **UE 5.8 内置 MCP（实验性）**+ Epic 的 Claude Code 插件 | 无官方 |
| 逻辑在哪里 | C# 为主 | **C++ 和蓝图混合**：蓝图里的逻辑 Agent 只能通过工具读改 | GDScript / C# |

**推论**：
- **UE 项目的 AI 化程度，很大程度取决于“逻辑有多少在 C++ 里”**。蓝图越重，越依赖官方 MCP；C++ 越多，通用编码 Agent 越能发挥。
- **UE 项目要给 Agent 指明引擎源码的位置**，并要求“不确定的 API 先查头文件”。这一条在 UE 项目里的价值比在 Unity 项目里更大。
- Unity 的优势在于模型更熟悉，Unity 6 + Unity CLI 的命令行闭环也更成熟；UE 的优势在于官方 MCP 的工具覆盖面更广（几百个工具），并且**打包后的游戏也能运行 MCP 服务器**（见 [unreal/01](unreal/01-toolchain.md)）。

## 来源

- [VG Insights：The Big Game Engine Report of 2025（PDF）](https://app.sensortower.com/vgi/assets/reports/The_Big_Game_Engines_Report_of_2025.pdf)
- [GDC 2026 State of the Game Industry 摘要](https://gdconf.com/article/gdc-2026-state-of-the-game-industry-reveals-impact-of-layoffs-generative-ai-and-more/)
- [Epic 论坛：Unreal Engine 5.8 Released](https://forums.unrealengine.com/t/unreal-engine-5-8-released/2729274)（2026-06-17）、[UE 5.8 发布说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes)
- [Tom Looman：Unreal Engine 5.8 Performance Highlights](https://tomlooman.com/unreal-engine-5-8-performance-highlights/)
- 迁移案例：[VGC：CD Projekt Red 换用 UE5 的原因](https://videogameschronicle.com/news/cd-projekt-reds-move-from-redengine-to-ue5-for-the-witcher-4-wasnt-because-of-cyberpunks-launch-co-ceo-says)、[KrASIA：Game studios turn to Unreal Engine 5](https://kr-asia.com/game-studios-turn-to-unreal-engine-5-as-proprietary-tools-fall-from-favor)（二手）
- UE5 性能争议：[Windows Central：Tim Sweeney 谈 UE5 性能问题](https://windowscentral.com/gaming/epic-games-ceo-tim-sweeney-explains-unreal-engine-5-performance-problems)（二手）
- 团结引擎 2.0：[IT 之家](https://www.ithome.com/0/982/616.htm)、[南都](https://m.mp.oeeee.com/a/BAAFRD0000202607281634388.html)（二手）
- Unity 路线图：[Unity 论坛：CoreCLR, Scripting, and Serialization Update - June 2026](https://discussions.unity.com/t/coreclr-scripting-and-serialization-update-june-2026/1723299)、[Unity 7 计划](https://wnhub.io/zh/news/engines/item-51494)（二手）
