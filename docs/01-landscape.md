# AI Coding 全景图

> 核实时间：2026-10。生态变化极快，以官方文档为准。

把 AI coding 生态拆成 7 层来看，就不容易被眼花缭乱的新工具带跑：

```
┌───────────────────────────────────────────────────────────────┐
│ 7. 协作与治理   AI Code Review / CI 集成 / 度量 / 安全策略      │
├───────────────────────────────────────────────────────────────┤
│ 6. 编排层       多 Agent 并行、worktree、云端 Agent、任务看板   │
├───────────────────────────────────────────────────────────────┤
│ 5. 方法论       上下文工程 / Spec 驱动 / TDD / Plan→Act        │
├───────────────────────────────────────────────────────────────┤
│ 4. 扩展层       MCP · Skills · Plugins · Hooks · Subagents     │
│                 · LSP · ACP                                     │
├───────────────────────────────────────────────────────────────┤
│ 3. 指令/记忆层  CLAUDE.md · AGENTS.md · Cursor Rules · Memory   │
├───────────────────────────────────────────────────────────────┤
│ 2. Agent 运行时 Claude Code · Codex · Gemini CLI · Cursor ·     │
│                 Copilot · Junie · OpenCode · Kiro …             │
├───────────────────────────────────────────────────────────────┤
│ 1. 模型层       Claude · GPT · Gemini · 开源权重(Qwen/GLM/      │
│                 DeepSeek/Kimi…)                                 │
└───────────────────────────────────────────────────────────────┘
```

## 各层要点

| 层 | 关键问题 | 本仓库文档 |
|---|---|---|
| 1. 模型 | 用哪个模型做哪类任务？成本/速度/质量怎么平衡？ | [03-models](03-models.md) |
| 2. Agent 运行时 | 终端 CLI 还是 IDE？能否跑命令、多步自主执行？ | [02-coding-agents](02-coding-agents.md) |
| 3. 指令/记忆 | Agent 每次启动时“知道”项目什么？ | [06-claude-code-playbook](06-claude-code-playbook.md) |
| 4. 扩展 | Agent 能“看到/操作”什么外部系统？ | [04-mcp](04-mcp.md)、[05-skills-plugins](05-skills-plugins.md) |
| 5. 方法论 | 怎么拆任务、怎么验证、怎么避免跑偏？ | [07-workflows](07-workflows.md) |
| 6. 编排 | 多个 Agent 如何并行不打架？ | [07-workflows](07-workflows.md#并行-agent) |
| 7. 治理 | 安全边界、评审、成本控制 | [08-security](08-security.md) |

## 2026 年的几个关键趋势

1. **开放标准收敛**
   - **MCP**（Model Context Protocol）已成为工具接入的事实标准，治理移交 Linux 基金会旗下的 Agentic AI Foundation（AAIF）；2026-07-28 版规范转为**无状态核心**，便于云端水平扩展。
   - **Agent Skills**（`SKILL.md`，agentskills.io）由 Anthropic 于 2025-12 开放为标准，Claude Code、Codex、Gemini CLI、Cursor、Copilot/VS Code、OpenCode、Junie、Kiro 等数十个工具支持——**一份 Skill 多处复用**。
   - **AGENTS.md** 成为跨工具的项目指令文件约定；**ACP**（Agent Client Protocol）让任意 Agent 接入 JetBrains/Zed 等 IDE。
2. **插件化分发**：Claude Code、Codex 都有插件市场，插件 = Skills + MCP + Hooks + Subagents 的打包。
   - 游戏行业代表：**Unity 官方 Claude Code / Codex 插件**（2026-09 发布），见 [`unity/01-unity-ai-stack.md`](../unity/01-unity-ai-stack.md)。
3. **引擎/工具厂商官方入场**：Unity 发布 Unity AI（编辑器内 Agent + AI Gateway + MCP Server）以及 **Unity CLI**（含 `unity mcp` 模式）。
4. **从单 Agent 到 Agent 舰队**：worktree 并行、云端后台 Agent（Cursor Cloud Agents、Codex Cloud、Claude Code on the web）、编排桌面应用（Conductor 等）。
5. **验证闭环比生成更重要**：LSP 诊断、测试、浏览器/编辑器实机检查、AI 评审，构成“生成—验证—修正”闭环。
