# 游戏开发 / Unity

> 核实时间：2026-10-08。上级目录：[游戏开发分支](../README.md)（AI 与游戏开发的结合全景、引擎接入对比、验证与试玩、游戏中的生成式 AI）。
> 前置阅读：主干的 [07 工作流](../../../docs/07-workflows.md)（验证闭环）和 [03 上下文工程](../../../docs/03-context-engineering.md)。

| 文档 | 内容 |
|---|---|
| [01-toolchain.md](01-toolchain.md) | Unity 官方（Unity CLI、官方插件、Unity AI）与社区 MCP 的对比和选型 |
| [02-large-project-guide.md](02-large-project-guide.md) | 大型项目落地：禁区、编译和测试闭环、Play 模式验证、大仓库 |
| [**03-engine-fundamentals.md**](03-engine-fundamentals.md) | **Unity 基础知识**：对象模型、生命周期、序列化、程序集与 Domain Reload、null 语义、资源、渲染管线、输入和 UI、性能、测试、版本路线；每节附“AI 要点” |
| [../03 游戏中的生成式 AI](../03-generative-ai-in-games.md#1-资产管线agent-负责搬运和规范) | AI 生成 3D、2D、音频、动画资源（跨引擎，已上移） |
| [Unreal 分支](../unreal/README.md) | 对照阅读：两个引擎在 AI 接入上的差异 |
| [templates/](templates/) | 可以拷进 Unity 项目的配置（在 [templates/generic](../../../templates/generic/) 基础上增加 Unity 专用部分） |

## 一页纸推荐（2026-10）

```
Unity 6+：
  Claude Code 或 Codex
  + Unity 官方插件 unity@unity-agent-plugin（33 个 Skills + Unity CLI）
  + Unity CLI 的 Pipeline 包（com.unity.pipeline）→ Agent 可以直接驱动打开中的编辑器
  + csharp-lsp 插件（C# 语义导航和诊断）
  + 本目录 templates（AGENTS.md、保护 Hook、编译和测试 Skill、评审子 Agent）

Unity 2021.3 / 2022 LTS：
  Claude Code + 社区 MCP（CoplayDev/unity-mcp）+ csharp-lsp + 本目录 templates
  （验证闭环用 batchmode 脚本）
```

## 三个最重要的认识

1. **让 Agent 驱动编辑器，不要手改场景和 Prefab 的 YAML。** Unity 官方 Skill 原话：“有编辑器可用时，驱动它，而不是手工编辑场景或资源文件” **[一手]**。
2. **进入 Play 模式不等于验证通过。** 失去焦点的编辑器可能停在第 1 帧，而状态仍显示“playing”。用 `unity status --format json` 的 `frameCount` / `playerLoopTicking` 确认帧确实在推进，再读 Console、截图 **[一手]**。
3. **编译错误会让编辑器进入 Safe Mode，这时 CLI 连不上编辑器。** 要从 Editor.log 里过滤出 `error CS####` 并修正源码，不能指望通过编辑器修复 **[一手]**。
