# Unity AI 工具链（官方 + 社区）

> 核实时间：2026-10。部分官方页面在本次整理环境中无法直接访问，信息来自 GitHub 仓库与多方报道，**以 Unity 官方文档为准**。

## 一、官方

### 1. Unity 官方 Agent 插件（Claude Code / Codex）⭐ 首选

- 仓库：[Unity-Technologies/unity-agent-plugin](https://github.com/Unity-Technologies/unity-agent-plugin)
- 发布：2026-09-09
- 内容：Unity 维护的工程 **Skills** + **Unity CLI** 集成（连接打开中的编辑器，创建 GameObject、改导入设置、执行 C# 代码等）+ 通往实时编辑器控制的 MCP。
- 要求：**Unity 6 及以上**；项目需在版本控制下（插件会直接改文件）。

```bash
# Claude Code
/plugin marketplace add Unity-Technologies/unity-agent-plugin
/plugin install unity@unity-agent-plugin
# 验证：输入 /unity: 能看到技能列表

# Codex
codex plugin marketplace add Unity-Technologies/unity-agent-plugin
codex plugin add unity@unity-agent-plugin
```

Skills 列表（2026-10 仓库快照，会持续增加）：

| 类别 | Skills |
|---|---|
| 项目与工具 | `new-unity-project`、`unity-cli`、`unity-package-management`、`generate-editor-search-query` |
| UI | `ui`、`ui-ugui`、`ui-uitk`、`ui-imgui`、`optimize-text-mesh-pro` |
| 2D | `2d-pixel-perfect`、`sprite-editor`、`sprite-segment-3x3grid`、`manage-sprite-atlas`、`tilemap-palette-create`、`tilemap-ruletile-createempty`、`tilemap-ruletile-createfromsegment` |
| 渲染 | `migrate-birp-to-urp`、`urp-postprocessing`、`validate-urp-render-graph-renderer-feature`、`shader-graph-create-custom-node` |
| 物理/导航 | `physics-3d-collision`、`initialize-ai-navigation` |
| 音频 | `audio-setup-mixers`、`optimize-audio` |
| 多人/服务 | `setup-multiplayer-services`、`setup-vivox-voice-chat`、`build-live-game` |
| 商业化 | `implement-in-app-purchases`、`levelplay-unity-integration` |
| 平台/其他 | `optimize-web`、`localization`、`build-gtk`、`asset-transformer-toolkit` |

### 2. Unity Skills（跨 Agent）

- 仓库：[Unity-Technologies/skills](https://github.com/Unity-Technologies/skills)
- `npx skills add Unity-Technologies/skills`，可装到 Cursor、Copilot、Cline 等 50+ Agent。
- Claude Code / Codex 用户直接装上面的官方插件即可（含自动更新）。

### 3. Unity CLI（含 MCP 模式）

- Unite 2026 发布，2026-06-30 进入 1.0 beta；Unity Hub 会自动安装。
- `unity mcp`：启动 MCP Server，把**已连接 Unity 编辑器**的命令暴露为 MCP 工具（stdio）。
- `unity mcp configure`：一步写入 AI 客户端配置（支持 Claude Code、Cursor、VS Code 等 16 种客户端）。
- 控制编辑器需要在项目中安装 **Unity Pipeline** 包。
- CLI 与 MCP 免费，无并发限制。
- 文档：[Unity CLI reference](https://docs.unity.com/en-us/unity-cli/unity-cli-reference)、[Release notes](https://docs.unity.com/en-us/unity-cli/release-notes)

### 4. Unity AI（编辑器内，Unity 6）

2026-05-04 开放 Beta，三部分：

| 组件 | 说明 |
|---|---|
| **AI Assistant** | 编辑器内 Agent，Ask / Agent / Plan 三种模式；写脚本、按图搭场景、生成占位资源 |
| **AI Gateway** | 在编辑器内接入你自己的 Claude / GPT 等，**不消耗 Unity 点数** |
| **MCP Server** | 让 IDE 里的 Agent 接入 Unity 运行上下文 |

- 计费：Personal 14 天试用（1000 点数），之后 $10/月 1000 点；Pro / Enterprise / Industry 席位含点数与 MCP Server。
- 学习：[Build with Unity AI](https://learn.unity.com/collection/build-with-unity-ai)

### 5. 其他官方

- [Unity-Technologies/industry-ai-workflows](https://github.com/Unity-Technologies/industry-ai-workflows)：实验性 Claude Code 插件市场，面向 Asset Manager、Asset Transformer（CAD/3D 处理）、管线自动化。

## 二、社区 MCP

| 项目 | Stars（约） | Unity 版本 | 特点 |
|---|---|---|---|
| [CoplayDev/unity-mcp](https://github.com/CoplayDev/unity-mcp)（MCP for Unity） | 14.7k | 2021.3 LTS ~ 6.x | 最流行；47 个工具入口：资产、场景、脚本、测试、Profiling、构建；需 Python 3.10+ / uv；MIT |
| [IvanMurzak/Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) | 4.4k | — | 70+ 工具；**支持游戏运行时**（NPC、调试）；一行特性自定义工具；有 `unity-mcp-cli` 安装器 |
| [CoderGamester/mcp-unity](https://github.com/CoderGamester/mcp-unity) | 1.9k | 6+ | Node.js + WebSocket；30+ 能力，含测试执行、Play 模式控制 |

安装示例（CoplayDev，UPM Git URL）：

```
https://github.com/CoplayDev/unity-mcp.git?path=/MCPForUnity#main
```

## 三、选型建议

| 场景 | 推荐 |
|---|---|
| Unity 6+，用 Claude Code / Codex | **官方插件**（首选），需要更多编辑器操作时补充社区 MCP |
| Unity 2021/2022 LTS | **CoplayDev/unity-mcp** |
| 需要游戏运行时接入 LLM | **IvanMurzak/Unity-MCP** |
| 习惯在编辑器内对话、小任务 | Unity AI Assistant；通过 AI Gateway 接 Claude |
| CI / 无编辑器批处理 | Unity 命令行 `-batchmode`（见 [02](02-large-project-guide.md)）+ Unity CLI |

> ⚠️ 同时装多个 Unity MCP 会造成工具重复、上下文膨胀、Agent 选错工具。**选定一个主方案**。

## 来源

- [Unity-Technologies/unity-agent-plugin](https://github.com/Unity-Technologies/unity-agent-plugin)
- [Unity plugin – Claude plugins directory](https://claude.com/plugins/unity)
- [Unity MCP: How to get started – Unity Blog](https://unity.com/blog/unity-ai-mcp-how-to-get-started)
- [Unity AI open beta – Unity Discussions](https://discussions.unity.com/t/unity-ai-s-open-beta-now-live-for-unity-6/1718560)
- [Announcing the Unity CLI – Unity Discussions](https://discussions.unity.com/t/announcing-the-unity-cli-a-new-way-to-connect-your-tools-and-agents/1731104)
- [MCP servers and game development – Unity Blog](https://unity.com/blog/mcp-servers-game-development)
