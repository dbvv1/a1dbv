# MCP（Model Context Protocol）

> 核实时间：2026-10。

## 是什么

MCP 是让 AI 应用以统一方式连接外部工具/数据的开放协议（常被比作“AI 的 USB-C”）。
一个 MCP Server 可以暴露三类能力：**Tools**（可调用的操作）、**Resources**（可读的数据）、**Prompts**（预置提示模板）。

- 治理：已移交 Linux 基金会下的 **Agentic AI Foundation (AAIF)**，OpenAI、Google 等均已采用。
- 最新规范：**2026-07-28** 版——无状态协议核心、多轮请求（Multi Round-Trip Requests）、基于 Header 的路由、可缓存的列表结果、授权加固、正式的扩展框架。TS / Python / Go / C# 四个一级 SDK 已跟进。
- 传输方式：本地 `stdio`（子进程）与远程 `HTTP`（Streamable HTTP）。

## 在 Claude Code 中使用

```bash
# 添加（默认 local 作用域；--scope project 会写入项目的 .mcp.json 供团队共享）
claude mcp add --scope project context7 -- npx -y @upstash/context7-mcp
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

claude mcp list          # 查看
/mcp                     # 会话内查看状态、认证
```

项目级 `.mcp.json` 示例见 [`templates/unity/.mcp.json.example`](../templates/unity/.mcp.json.example)。

## 推荐服务器（通用开发）

> 原则：**只装当前工作真正需要的**。每个 MCP 都会占用上下文（工具描述），也会增加攻击面。

| 服务器 | 作用 | 优先级 |
|---|---|---|
| [GitHub MCP](https://github.com/github/github-mcp-server)（官方） | Issue/PR/代码搜索/CI 日志 | ⭐⭐⭐ |
| [Context7](https://github.com/upstash/context7) | 拉取库/框架的**最新文档**，减少 API 幻觉 | ⭐⭐⭐ |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | 浏览器自动化（基于可访问性快照） | ⭐⭐（Web 相关时） |
| [Serena](https://github.com/oraios/serena) | 基于 LSP 的语义代码检索与编辑 | ⭐⭐（大仓库） |
| Sequential Thinking / Memory 类 | 结构化思考、跨会话记忆 | ⭐ 视需求 |
| 数据库类（Postgres / SQLite / Supabase） | 查询数据 | ⭐ 视需求 |
| Figma Dev Mode MCP | 设计稿 → UI 代码 | ⭐ UI 密集项目 |
| Linear / Jira / Notion / Slack | 任务与知识库 | ⭐ 团队协作 |

## Unity 相关 MCP

详见 [`unity/01-unity-ai-stack.md`](../unity/01-unity-ai-stack.md)。速览：

| 方案 | 维护方 | 说明 |
|---|---|---|
| **Unity CLI `unity mcp`** | Unity 官方 | `unity mcp` 启动 MCP Server，`unity mcp configure` 一键写入 Claude Code/Cursor/VS Code 等客户端配置；免费 |
| **Unity AI MCP Server** | Unity 官方 | Unity AI（Unity 6）组件之一 |
| [CoplayDev/unity-mcp](https://github.com/CoplayDev/unity-mcp) | 社区（最流行） | 资产、场景、脚本、测试、Profiling、构建；Unity 2021.3 ~ 6.x |
| [IvanMurzak/Unity-MCP](https://github.com/IvanMurzak/Unity-MCP) | 社区 | 70+ 工具，**支持运行时（游戏内）**，一行特性即可自定义工具 |
| [CoderGamester/mcp-unity](https://github.com/CoderGamester/mcp-unity) | 社区 | Node.js 服务端 + WebSocket，Unity 6+ |

## 自己写 MCP Server

- 官方 SDK：TypeScript / Python / Go / C#（C# SDK 对 Unity/.NET 工具链很友好）。
- 什么时候值得写：团队内部工具（如关卡配置表、打包平台、内部 Wiki）需要被 Agent 反复调用时。
- 什么时候**不必**写：如果一个 CLI 命令 + Skill 说明就能搞定，优先用 Skill（更省上下文）。

## 资源

- 规范与文档：<https://modelcontextprotocol.io>
- 2026-07-28 规范发布说明：<https://blog.modelcontextprotocol.io/posts/2026-07-28/>
- 官方参考服务器：<https://github.com/modelcontextprotocol/servers>
- 发现服务器：[MCP Registry](https://registry.modelcontextprotocol.io)、[mcpservers.org](https://mcpservers.org)、[awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
