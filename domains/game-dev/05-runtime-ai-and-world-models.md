# 运行时 AI 与世界模型

> 核实时间：2026-10-08。
> 前四篇讲的是“用 AI **做**游戏”，这一篇讲“AI **在**游戏里运行”：LLM 驱动的 NPC、新出现的“决策模型”，以及能直接生成可交互世界的“世界模型”。
> 这一块炒作多、落地少，**大部分信息是二手的**，评级相应保守。

## 0. 先看结论

| 方向 | 现状 | 评级 |
|---|---|---|
| LLM 驱动的对话 NPC | 有作品上线（inZOI、Suck Up! 等），口碑分化；**只有围绕它设计的游戏才成立** | 👀（玩法以它为核心时 🧪） |
| 决策模型（小型分类模型）驱动 NPC 决策 | 2026-09 才出现的新模型类别，还没有游戏案例；从特性看很适合 | 👀 值得做原型 |
| 世界模型（Genie、Marble） | 能生成约 1 分钟的可交互场景，**不是游戏引擎** | 👀 概念探索；⛔ 用来替代引擎 |

## 1. LLM 驱动的 NPC

### 已上线的例子 **[二手]**
- **inZOI**（Krafton，2025-03 抢先体验）：“Smart Zoi”基于 NVIDIA ACE，NPC 有自己的目标、关系，并会适应环境。Krafton 强调**全部在本地设备上运行**。2025-05 宣布使用生成式 AI 后遭到一波差评；之后评价下滑更多是因为性能和内容进度，而不是 NPC 本身。
- **Suck Up!**：玩家扮演吸血鬼，**设法骗 LLM 驱动的 NPC 请自己进门**。反响不错。
- **Mecha BREAK**：NVIDIA ACE 的首个展示作品，使用端侧小模型（Nemotron-4 4B）。
- Ubisoft 的 NEO NPC 仍是研究原型。

### 规律
**成功的例子都把“NPC 不可完全控制”变成了玩法本身**（Suck Up! 的核心就是骗 NPC），而不是拿 LLM 替代写好的对话树。原因很直接：

| 工程问题 | 说明 |
|---|---|
| 延迟 | 对话可以等一两秒，战斗决策不行 |
| 成本 | 云端推理按玩家时长计费，和买断制的收入模型冲突；所以 inZOI、Mecha BREAK 都选择端侧小模型 |
| 内容安全和分级 | 玩家一定会尝试越狱，输出可能违反分级要求 |
| 可测试性 | 输出不确定，回放和 bug 复现都更难（结合 [03 验证](03-verification-and-playtesting.md) 来看，这是很大的代价） |
| 存档 | NPC 的“记忆”要能存、能读、能迁移版本 |
| 玩家态度 | 生成式 AI 在玩家中的负面情绪在上升（见 [01](01-industry-and-sentiment.md)） |

## 2. 决策模型：可能更适合游戏的新方向

2026-09，TypeSafe AI 发布 **Jev**，提出“决策模型”（也叫 System One 模型）这一类别；随后几周内出现了大量同类模型 **[二手 + 社区]**：

| 模型 | 说明 | 来源 |
|---|---|---|
| Jev（TypeSafe AI） | 非自回归架构，一次并行计算给出所有答案；只能在**预先定义的选项**中选择，并给出**校准过的置信度**；不能生成自由文本。号称比前沿 LLM 快约 190 倍、便宜约 440 倍；独立测试（Every）在一个抽取任务上测得约快 25 倍 | Forkast 报道 **[二手]** |
| Clef / Clef-flash（Cloudflare） | 开源（Apache 2.0），兼容 Jev API；冻结 Qwen3.8-27B / Qwen3.5-9B 作为骨干，只做一次预填充，再对各选项打分；提供强化学习微调服务 | Cloudflare 博客 **[一手]** |
| Strands Decider 2B（AWS Strands） | 开源小模型，用于本地开发 | Strands 博客 **[一手]** |
| OpenAI Decisions API | 基于 GPT-6 Luna，提供同类能力 | HN 引述 **[社区]** |
| 社区复现 | 0.8B 模型约 30ms（Jeff、Gutsy，可在 CPU 上跑）；Ollama 0.35 起支持；Hugging Face 上已有 70 个复现 | HN **[社区]** |

**为什么值得游戏团队关注**（这是基于特性的推断，**还没有游戏案例**）**[经验]**：
- 游戏 AI 的大部分决策本来就是“**从有限选项中选一个**”：攻击、撤退、求援，选哪个目标，用哪句预写台词；
- 决策模型输出**一定落在选项内**，不会胡说八道，正好避开 LLM NPC 最大的风险；
- **置信度可以直接用于设计**：置信度低时退回到传统行为树，或者故意表现出犹豫；
- 0.8B–2B 的本地模型、几十毫秒的延迟，**可以放进游戏循环**。

**建议**：用 L2 无头模拟（见 [03](03-verification-and-playtesting.md#2-验证阶梯从便宜确定到昂贵主观)）对比“行为树”和“行为树 + 决策模型”，看玩家可感知的差异是否值得增加的复杂度。注意 Jev 的基准测试是和前沿模型的一致率，**不是对照真实标准答案**，独立评测仍然很少。

## 3. 世界模型

| 产品 | 状态 | 来源 |
|---|---|---|
| **Project Genie**（Google DeepMind，基于 Genie 3） | 2026-01 起向美国 Google AI Ultra 订阅用户（250 美元/月）开放的实验原型；会话约 60 秒、约 720p、24fps；没有目标、声音和持久化；擅长艺术风格，写实和物体交互较弱 | TechCrunch、VGC 等 **[二手]** |
| **Marble**（World Labs，李飞飞） | 从文本、图片、视频生成 3D 环境，面向娱乐内容和机器人训练仿真。**AMD 2026-09-28 宣布以约 82 亿美元全股票收购 World Labs**，预计年底完成 | 多家媒体报道 SEC 文件 **[二手]** |

- Take-Two 总裁的评价：Genie“**不是游戏引擎**”，引擎负责物理、光照、音频和玩法系统 **[二手]**。
- AMD 的收购理由主要是推理、机器人和物理 AI，**不是游戏**。世界模型的主要商业方向正在转向机器人仿真。

**对游戏团队的含义**：
- 现在适合用来**快速探索视觉概念和关卡氛围**，和概念图的作用类似；
- 不适合当作生产工具：没有持久状态、不可控、无法测试，也接不进现有管线；
- 值得持续关注：一旦能导出可编辑的 3D 场景（Marble 方向），就可能进入资产管线（见 [04](04-asset-pipeline.md)）。

## 4. 在 Unity 里接运行时 LLM

- [IvanMurzak/Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) 支持在**游戏运行时**接入 LLM（见 [unity/01-toolchain.md](unity/01-toolchain.md#2-社区-mcp)）。
- 无论用什么方案，都要把 LLM 调用放在**可替换的接口**后面：测试时用固定回复的假实现，正式运行时再接真模型。这样确定性测试和回放才能继续工作。

## 来源

- [Forkast：TypeSafe AI's Jev Is Not an LLM](https://forkast.news/typesafe-ais-jev-is-not-an-llm-and-that-may-be-the-point/)（二手）
- [Cloudflare：Introducing Clef](https://blog.cloudflare.com/clef-decision-models/)；[HN 讨论](https://news.ycombinator.com/item?id=49923692)
- [Strands Decider 2B](https://strandsagents.com/blog/introducing-strands-decider/)；[HN 讨论](https://news.ycombinator.com/item?id=49987076)
- [TechCrunch：Project Genie](https://techcrunch.com/2026/01/29/i-built-marshmallow-castles-in-googles-new-ai-world-generator-project-genie)；[VGC](https://www.videogameschronicle.com/news/google-rolls-out-prototype-of-project-genie-an-ai-tool-which-generates-playable-worlds)（二手）
- [Data Center Knowledge：AMD to Acquire World Labs for $8.2B](https://datacenterknowledge.com/data-center-chips/amd-to-acquire-world-labs-for-8-2b-to-advance-ai-models-and-robotics)（二手）
- inZOI、Suck Up!、Mecha BREAK：[Wikipedia：inZOI](https://en.wikipedia.org/wiki/InZOI)、[NVIDIA 博客](https://blogs.nvidia.com/blog/ai-decoded-gamescom-ace-nemotron-instruct)（二手）
