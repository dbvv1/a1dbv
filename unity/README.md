# Unity × AI 分支

> 服务于本地**大型 Unity 项目**的 AI 协作方案。核实时间：2026-10。

| 文档 | 内容 |
|---|---|
| [01-unity-ai-stack.md](01-unity-ai-stack.md) | 官方（Unity AI / Unity CLI / 官方插件）与社区（MCP）工具链对比与选型 |
| [02-large-project-guide.md](02-large-project-guide.md) | 大型项目落地指南：让 AI 安全、可验证地改 Unity 项目 |
| [03-asset-generation.md](03-asset-generation.md) | AI 生成 3D / 2D / 音频 / 动画资源 |
| [`../templates/unity/`](../templates/unity/) | 可直接拷进 Unity 项目的配置模板 |

## 一句话推荐方案（2026-10）

```
Unity 6+ 项目：
  Claude Code（或 Codex）
  + Unity 官方插件 unity-agent-plugin（Skills + Unity CLI + MCP 实时编辑器控制）
  + C# LSP 插件
  + 本仓库 templates/unity（CLAUDE.md、Hooks、编译/测试 Skill、评审 Subagent）

Unity 2021.3 / 2022 LTS 老项目：
  Claude Code + 社区 MCP（CoplayDev/unity-mcp）+ C# LSP + 本仓库模板
```
