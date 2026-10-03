# Coding Agent 与 AI IDE

> 核实时间：2026-10。版本号和价格变化快，选型以官方页面为准。

## 一、终端 / CLI Agent

| 工具 | 厂商 | 特点 | 适合 |
|---|---|---|---|
| **Claude Code** | Anthropic | 长程复杂任务、推理深；生态最全（Skills / Plugins / Hooks / Subagents / MCP / LSP）；支持终端、VS Code、JetBrains、桌面 App、Web（云端）多端 | **主力推荐**；Unity 官方插件首发平台之一 |
| **Codex CLI** | OpenAI | 默认沙箱执行更安全；支持 AGENTS.md、Skills、Plugins、Subagents、Hooks；有云端任务 | 次主力/交叉验证；Unity 官方也提供 Codex 插件 |
| **Gemini CLI** | Google | 多模态输入，API 价格较低，长上下文 | 截图/视觉相关任务、预算敏感 |
| **Antigravity** | Google | “Agent 优先”的 IDE + 托管 Agent，可异步编排 | 想尝试 Google 生态的 Agent IDE |
| **GitHub Copilot CLI** | GitHub | 与 GitHub Issue/PR 深度集成 | 团队重度使用 GitHub |
| **OpenCode** | 开源 | 模型无关，BYOK，可接本地模型 | 需要灵活换模型/本地推理 |
| **Junie CLI** | JetBrains | 与 JetBrains IDE 同源（2026-06 正式版），走 ACP | Rider 用户 |
| **Aider** | 开源 | 老牌、轻量、git 友好 | 小改动、纯终端党 |
| **Goose / Amp / Kilo** 等 | 多家 | 各有特色 | 按需尝试 |

## 二、IDE 形态

| 工具 | 特点 | Unity 相关性 |
|---|---|---|
| **JetBrains Rider** | Unity 开发首选 C# IDE；2026 版 AI Chat 可选 Junie、Claude Agent、Codex 等，并通过 **ACP Registry** 一键接入外部 Agent；Unity Profiler 深度集成 | ⭐⭐⭐ 强烈推荐作为 Unity 主 IDE |
| **VS Code + 扩展** | Claude Code / Codex / Copilot 扩展齐全；原生支持 Agent Skills | ⭐⭐ 搭配 C# Dev Kit + Unity 扩展 |
| **Cursor** | 自研 Composer 模型，Background/Cloud Agents、Bugbot PR 评审、并行子 Agent | ⭐⭐ C# 支持依赖扩展，Unity 调试体验不如 Rider |
| **Visual Studio** | 微软官方，Copilot 集成；ReSharper 2026.2 起支持 ACP | ⭐⭐ Windows 传统 Unity 工作流 |
| **Kiro** | AWS 出品，Spec 驱动 IDE（EARS 需求格式） | ⭐ 适合学习 Spec 驱动思路 |
| **Windsurf / Zed / Trae** 等 | 各有特色 | ⭐ 按需 |

## 三、推荐组合（大型 Unity 项目）

```
主 IDE：     Rider（写/调试 C#、Profiler）
主 Agent：   Claude Code（终端或 Rider/VS Code 内）
              + Unity 官方插件（Skills + Unity CLI + MCP）
              + C# LSP 插件
交叉验证：   Codex CLI（同样装 Unity 官方插件），用于第二意见/评审
后台任务：   Claude Code on the web / Codex Cloud（不依赖编辑器的纯代码任务）
```

> **为什么不只用 Unity 内置的 Unity AI Assistant？**
> 内置 Assistant 擅长编辑器内的小任务（场景操作、单脚本、资产生成），但大型项目的跨模块重构、架构理解、测试驱动开发，仍是外部 Coding Agent 更强。两者可以并用：Unity AI 的 **AI Gateway** 允许在编辑器内直接驱动你自己的 Claude/Codex，且不消耗 Unity 点数。

## 四、选型要点

1. **能否跑命令并读结果**（编译、测试、日志）——这是“自主”的前提。
2. **扩展生态**：是否支持 MCP、Agent Skills、Hooks。
3. **上下文管理**：大仓库下的检索能力（LSP、语义搜索、子 Agent 隔离上下文）。
4. **权限与沙箱**：能否精细控制可执行命令、可写路径。
5. **成本**：订阅 vs API 计费；高频任务用快/便宜模型，难任务用强模型。

## 参考

- [Best AI Coding Agents (2026) – Firecrawl](https://www.firecrawl.dev/blog/best-ai-coding-agents)
- [Best CLI AI Coding Agents in 2026 – devtoollab](https://devtoollab.com/blog/top-cli-ai-coding-agents)
- [What's New in Rider 2026.1](https://www.jetbrains.com/rider/whatsnew/2026-1/)
- [Junie leaves Beta (2026-06)](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/)
- [Codex changelog](https://developers.openai.com/codex/changelog)
