# AI 资产管线：3D、2D、音频、动画

> 核实时间：2026-10-08（第三轮：更新了版本，加入引擎内生成和市场数据）。
> 工具信息多来自厂商页面和第三方评测 **[二手]**，其中不少评测出自厂商自己；开源仓库的状态为 **[一手]**（直接克隆查看最近提交）。
> 价格和许可条款变化很快，**商用前务必阅读最新条款**。

## 0. 先看结论

1. **AI 资产适合原型、占位、背景物件和批量变体，不适合主角级资产和主视觉。** 拓扑、UV、风格一致性仍需要美术把关。
2. **市场数据不支持“只靠 AI 出美术”**：Steam 上失败的 AI 游戏中，72% 的声明内容是 AI 美术，而成功作品的 AI 用法更多样（配音、本地化、文本）。见 [01 行业数据](01-industry-and-sentiment.md#3-市场steam-上的-ai-游戏)。
3. **Coding Agent 在资产管线里最大的价值不是“生成”，而是“搬运和规范”**：调 API 批量生成、导入、设置压缩格式和碰撞体、记录来源和许可。这些机械工作 Agent 做得又快又稳。

## 1. 3D 模型

| 工具 | 当前版本（2026-10） | 强项 | 注意 |
|---|---|---|---|
| [Meshy](https://www.meshy.ai) | Meshy 6 | 一站式：文生 / 图生 3D、贴图、自动绑骨、引擎导出；四边面拓扑和 A/T 姿势控制方便绑骨 | 免费档模型公开，并按 CC BY 4.0 授权 |
| [Tripo](https://www.tripo3d.ai) | Tripo 3.1 | 迭代最快；几何和拓扑在一篇对比测试中领先 | 免费档不可商用 |
| [Rodin（Hyper3D）](https://hyper3d.ai) | Gen-2.5 | 高保真，适合有机生物和数字人 | 下载和商用需要付费 |
| [Hunyuan3D](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1)（腾讯） | 开源仓库停在 **2.1**（最近提交 2025-10）**[一手]**；托管版已到 Pro 3.x **[二手]** | 图生 3D 细节好；2.x 可以自部署 | 3.x 的开源权重是否发布**未能确认**；许可有地区和规模限制 |
| [TRELLIS.2](https://github.com/microsoft/TRELLIS.2)（微软，开源） | 最近提交 2026-06 **[一手]** | 开源图生 3D，带 PBR 材质 | 需要 GPU |
| **Roblox 内置生成** | Studio MCP 的 `generate_mesh`、`generate_material`、`generate_procedural_model` **[一手]** | 直接在引擎里生成并插入，Agent 可以调用 | 仅限 Roblox |

- 一篇对比测试（作者自称 Meshy 员工，2026-04 至 05 通过官方 API 测试 Meshy 6、Tripo 3.1、Rodin Gen-2.5）的结论是**没有全面领先者**：Tripo 几何和拓扑更好，Meshy 贴图更好 **[二手：厂商员工]**。
- 现状：PBR 贴图已是标配，**拓扑和 UV 仍常需人工整理**。

## 2. 2D、贴图、概念图

- **引擎内生成**：Unity AI 生成器（Unity 6，Sprite、贴图、材质、动画占位）。
- [Scenario](https://www.scenario.com)：可以用自有画风训练模型，保持风格一致；也托管 Hunyuan 3D 等模型。
- ComfyUI + 开源图像模型（如 2026-10 发布的 FLUX 3 **[社区：HN]**）：本地可控、可批量，适合有技术美术的团队。
- 通用图像模型（GPT Image、Gemini 图像、Midjourney 等）：概念图、UI 图标草稿。

## 3. 音频

- 音效：ElevenLabs Sound Effects 等文生音效。
- 配音：ElevenLabs 等 TTS。**角色声音必须有授权**；Steam 数据显示 AI 配音在成功作品中更常见（24% vs 8%）**[社区：全量统计]**，但这是相关性。
- 音乐：Suno、Udio 等，**商用许可差异很大**，务必确认。

## 4. 动画

- 视频或文本生成动作（替代动捕）：适合原型，导入后通常要重定向和清理。
- Meshy 等平台的自动绑骨 + 基础动作库，可以快速做出可玩原型。

## 5. DCC 工具里的 Agent：Blender

- **官方**：Blender Lab 的 MCP 服务器（Blender 5.1+），定位是**场景分析和 Python API 文档查询**。官方示例：让模型找出“面数高但在镜头里很小”的物体，发现一个 2 万面的字母装饰和一个 3.7 万面的外套，可以改成贴图或降低细分 **[一手]**。
- **社区**：[ahujasid/blender-mcp](https://github.com/ahujasid/blender-mcp)，偏资产获取和生成，教程最多。
- ⚠️ 两者都会**直接执行模型生成的 Python 代码，没有防护**。官方建议在虚拟机或没有敏感数据的机器上使用 **[一手]**。

## 6. 推荐的管线做法（跨引擎）

1. **隔离**：AI 生成物统一放在单独目录（Unity：`Assets/_Generated/<来源>/`），和正式资源分开，方便替换和许可审计。
2. **记录来源**：同目录放 `SOURCES.md`，写明工具、版本、日期、提示词、许可。发售时的商店披露就从这里汇总（见 [01](01-industry-and-sentiment.md#5-对团队的实际建议)）。
3. **让 Agent 做规范化**：用编辑器脚本批量设置导入参数（压缩格式、Read/Write、Mipmap、碰撞体、LOD），而不是手动点。
4. **API 一条龙**：多数平台提供 API 或 MCP，Agent 可以完成“生成 → 下载 → 导入 → 设置”整条流程。注意 API 费用，**在脚本里设置数量上限**。
5. **占位资源要有替换计划**：开发早期的 AI 占位贴图也可能在发售后引发争议（见 [01 第 4 节](01-industry-and-sentiment.md#4-社区与规则几个标志性事件)）。

## 来源

- 各工具官网；Hunyuan3D-2.1、TRELLIS.2、blender-mcp 仓库（2026-10-08 浅克隆查看最近提交）
- [Roblox Studio MCP 文档](https://create.roblox.com/docs/en-us/studio/mcp)；[Blender Lab MCP Server](https://www.blender.org/lab/mcp-server/)
- 3D 生成对比：[HackerNoon：How I stress tested 3 AI 3D generators](https://hackernoon.com/how-i-stress-tested-3-ai-3d-generators-on-the-same-inputs-what-the-numbers-actually-show)（作者为 Meshy 员工，二手）；[Scenario：Hunyuan 3D Models](https://help.scenario.com/articles/5967392966-hunyuan-3d-models-the-essentials)（二手）
- [Sulka Haro：Three years of AI on Steam](https://fragwyz.substack.com/p/three-years-of-ai-on-steam)
