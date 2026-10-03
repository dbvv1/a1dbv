# AI 生成游戏资源

> 核实时间：2026-10。价格和许可条款变化快，**商用前必读最新条款**。

## 3D 模型

| 工具 | 强项 | 注意 |
|---|---|---|
| [Meshy](https://www.meshy.ai) | 一站式：文/图生 3D、多视图、AI 贴图、自动绑骨、引擎导出；网格干净 | 免费档模型公开且为 CC BY 4.0；Pro 起私有 |
| [Tripo](https://www.tripo3d.ai) | 生成最快（约 30–45 秒/个），基础网格干净，适合原型 | 免费档不可商用 |
| [Rodin (Hyper3D)](https://hyper3d.ai) | 高保真主角级资产、有机生物/数字人 | 下载与商用需付费 |
| [Hunyuan3D](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1)（腾讯，开源） | 图生 3D 细节好，可自部署 | 自部署有门槛；使用腾讯混元社区许可，含地区与规模限制，商用前确认 |
| [TRELLIS / TRELLIS.2](https://github.com/microsoft/TRELLIS)（微软，开源） | 开源图生 3D，PBR 材质 | 需 GPU |

> 现状：PBR（金属度/粗糙度）贴图已是标配；拓扑与 UV 仍常需人工整理，**适合原型、背景物件、灰盒替换**，主角级资产仍需美术把关。

## 2D / 贴图 / 概念图

- **Unity AI 生成器**（Unity 6 编辑器内）：Sprite、贴图、材质、动画等占位资源。
- [Scenario](https://www.scenario.com)：可用自有画风训练模型，保持风格一致。
- ComfyUI + 开源图像模型：本地可控、批量化；适合有技术美术的团队。
- 通用图像模型（GPT Image / Gemini 图像 / Midjourney 等）：概念图、UI 图标草稿。

## 音频

- 音效：ElevenLabs Sound Effects 等文生音效。
- 配音：ElevenLabs 等 TTS（注意角色声音授权）。
- 音乐：Suno、Udio 等（**商用许可差异大**，务必确认）。

## 动画

- 视频/文本生成动作（动捕替代）类工具：适合原型；导入后通常需要重定向与清理。
- Meshy 等平台的自动绑骨 + 基础动作库可快速出可玩原型。

## 接入 Unity 的工作流建议

1. **AI 生成物统一放** `Assets/_Generated/<来源>/`，与正式资源隔离，便于后续替换和许可审计。
2. 记录来源：在同目录放 `SOURCES.md`（工具、日期、提示词、许可）。
3. 用 Agent + 编辑器脚本批量做导入设置（压缩格式、Read/Write、Mipmap、碰撞体），而不是手点。
4. 很多平台提供 API/MCP，可让 Coding Agent 直接调用生成→下载→导入一条龙（注意 API 费用）。
