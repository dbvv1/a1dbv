# 04 · MCP（Model Context Protocol）

> 核实时间：2026-10-08。规范部分依据 [modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol) 仓库中的规范与博客原文 **[一手]**。

## 1. 现状

- **规范版本**：2024-11-05 → 2025-03-26 → 2025-06-18 → 2025-11-25 → **2026-07-28（当前）**。
- **治理**：已交给 Linux 基金会旗下的 Agentic AI Foundation（AAIF）；OpenAI、Google、AWS 等都已采用。
- **规模**：Tier-1 SDK（TypeScript / Python / Go / C#）月下载量接近 5 亿，TS 和 Python 累计都超过 10 亿。

### 2026-07-28 版本改了什么

| 变化 | 意义 |
|---|---|
| **无状态核心**：取消 `initialize` 握手和 `Mcp-Session-Id` | 服务端可以水平扩展、走普通负载均衡；需要状态时，由工具返回显式句柄，让模型作为参数传回 |
| `Mcp-Method` / `Mcp-Name` HTTP 头 | 网关、限流、WAF 只看 header 就能路由和鉴权 |
| **MRTR**（多轮请求）取代服务端主动发起的 elicitation / sampling / roots | 不再需要长连接的双向流 |
| 列表结果可缓存（`ttlMs`、`cacheScope`、确定性排序） | 客户端能缓存工具清单，**上游的 prompt cache 也更稳定** |
| 授权加固：RFC 9207 issuer 校验、凭证绑定 issuer、**DCR 弃用改用 CIMD** | 修补授权服务器混淆类漏洞 |
| 正式的扩展框架：Tasks、MCP Apps（交互式 UI）、企业托管授权 | 新功能以扩展形式加入 |
| **弃用 Roots、Sampling、Logging**（至少保留 12 个月）；旧的 HTTP+SSE 传输停用 | 新实现不应再用这些 |

**路线图（2026-08-22）** 五个方向：Agent 消息原语（长循环、流式、中途调整）、HTTP 原生传输、Agent 身份与企业安全（DPoP、工作负载身份联合）、改进原语（结果处理、**工具数量膨胀后的渐进式披露**）、SDK 开发体验。

## 2. MCP vs CLI：社区争论与数据

| | MCP | CLI（配合 Skill 说明用法） |
|---|---|---|
| Token 成本 | 社区基准：GitHub MCP 比 `gh` CLI 贵 **2–3 倍**；Code Mode 最省，但仍约为 CLI 的 2 倍，而且更慢 **[社区：摘要]** | 最低 |
| 可组合性 | 一次调用一个工具 | 管道、jq、tail，可以分块处理 |
| 参数契约 | 有类型 schema，可校验/拒绝不合法参数；不保证模型不会生成错误调用 | 要靠 `--help`，不够稳 |
| 凭证 | 可以完全不进入模型上下文 | 往往在环境变量或命令行里 |
| 适用 | **没有 shell 的环境**、需要隔离凭证、团队级工具发现、SaaS 远程服务 | 本地开发、Agent 有 shell |

**Anthropic 官方的立场**也在往“少直接调用工具”的方向走 **[一手]**：
- Claude Code 文档：“CLI 工具是与外部服务交互最省上下文的方式”。
- 《Code execution with MCP》：把 MCP 服务器以**代码 API 的形式放在文件系统上**，让模型写代码调用、在沙箱里过滤数据，示例从 15 万 token 降到 2 千 token（-98.7%）。
- 《Advanced tool use》：Tool Search（按需发现工具，上下文 -85%）、Programmatic Tool Calling（-37% token）、Tool Use Examples（复杂参数准确率 72% → 90%）。
- Claude Code 现在启动时**只加载 MCP 工具名**，完整 schema 按需加载，单个工具描述上限 2048 字符。

**2026 下半年的风向回转** **[社区：原文]**：
- 2025 年到 2026 年 3 月，“MCP 已死、CLI 赢了”的说法很流行（Garry Tan 等人都这么说）。
- 无状态规范发布后，**Simon Willison** 重新看好 MCP：给 Agent 一个能上网的 shell 风险很高，而且需要强模型才能驾驭；MCP 工具更容易审计和控制，**小的本地模型也能用好**。
- 一直反对 MCP 的极简 harness **Pi** 在 1.0 中把 MCP 纳入了核心（《You said no MCP》），理由是 MCP 改进了，而且支持它所需的改动（一个解释器沙箱，即 code mode）本身就很有用。但他们也指出，**可组合性差仍然是 MCP 最大的问题**。
- 新的用途：给桌面应用暴露 MCP，用自然语言配置它们（本地 Qwen + Pi 就能驱动）。

**本仓库的判断**：
- ✅ 强模型 + 有 shell 的本地开发：**首选 CLI + Skill**（便宜、可组合）。
- ✅ 以下场景用 MCP：
  - 浏览器自动化、SaaS 远程服务；
  - 需要隔离凭证的数据库或内部系统；
  - 没有 CLI 的系统（比如游戏引擎编辑器）；
  - **用小模型或本地模型驱动**；
  - **不想给 Agent 开放 shell 和网络的高风险环境**。

## 3. 推荐的 MCP 服务器

> 原则：只装当前工作需要的；安装前读源码或确认官方来源；固定版本号。

| 服务器 | 用途 | 评级 | 备注 |
|---|---|---|---|
| [Context7](https://github.com/upstash/context7) | 拉取库和框架的**最新文档**，减少 API 幻觉 | ✅ | 官方插件市场有 |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) / Chrome DevTools MCP | 浏览器自动化、前端验证 | ✅（Web 项目） | 长时任务 harness 用它做端到端验证 |
| [GitHub MCP](https://github.com/github/github-mcp-server) | Issue、PR、CI | 🧪 | 本地有 `gh` 时优先用 CLI |
| [Serena](https://github.com/oraios/serena) | LSP 驱动的语义检索与编辑 | 🧪 | 用 Claude Code 的话，官方 LSP 插件可能已经够用 |
| Sentry / Datadog / Grafana 等可观测性服务 | 查线上问题 | 🧪 | ⚠️ **数据来源不可信**（见下方 agentjacking 事件） |
| 数据库（Postgres、Supabase 等） | 查数据 | 🧪 | 只读账号 |
| Figma | 设计稿转代码 | 🧪 | |
| 记忆类 MCP | 跨会话记忆 | 👀 | 方案太多，质量不一 |

**安全提醒**：2026-06 的“agentjacking”研究中，攻击者用公开的 Sentry DSN 往错误事件里注入指令，Claude Code、Cursor、Codex 通过 Sentry MCP 读到这些事件后执行了攻击者的命令 **[二手]**。**任何“外部人员能写入”的数据源都是注入入口**。

## 4. 写好给 Agent 用的工具

摘自 Anthropic《Writing effective tools for agents》（2025-09）**[一手]**：

1. **少而精**：把常用工作流合成一个工具（如 `schedule_event`），而不是给每个 API 端点各包一个工具。
2. **命名空间**：`asana_projects_search`、`asana_users_search`，避免模型混淆。
3. **返回有意义的内容**：用人类可读的标识代替 UUID；提供 `response_format`（简洁 / 详细）参数。
4. **控制 token**：默认分页、过滤、截断；**错误信息要告诉模型下一步该怎么做**。
5. **工具描述就是提示词**：像给新同事写文档一样写清楚。
6. **评估驱动**：用真实任务跑评估，读 Agent 的执行记录，让 Claude 帮你改进工具。

**大型工具集的范例：Epic 的 Unreal MCP** **[一手：Epic 官方插件]**：
- 几百个工具分在 30 多个工具集里，但服务器整个会话**只公开 3 个元工具**（`list_toolsets`、`describe_toolset`、`call_tool`），具体工具在服务端分发，不进 `tools/list`。官方理由是保持上下文小、**提示缓存命中**。
- Epic 给工具作者定的四条原则：**Clean**（比底层 API 更简单）、**Complete**（CRUD 对称：能 set 就能 get，能 create 就能 delete）、**Composable**（同类操作用一致的类型）、**DRY**（不重复已有的通用工具）。
- 工具失败时往往只返回状态而不抛异常，所以 Skill 里要求 Agent “**不是明确的成功，就当作失败**”。
- 详见 [game-dev/01](../domains/game-dev/01-engine-integration.md#22-unreal几百个工具藏在工具搜索后面)。

在 2026-07-28 规范下写服务端还要注意：**不要依赖会话状态**（需要状态就返回句柄）；列表结果设置缓存提示；用 CIMD 做客户端注册。

## 5. 在 Claude Code 中使用

```bash
claude mcp add --scope project context7 -- npx -y @upstash/context7-mcp
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
/mcp                     # 查看状态、认证；/mcp reconnect all 重连所有服务器
```

- 项目级 `.mcp.json` 提交到仓库给团队共享；token 用 `${ENV_VAR}` 引用，不要写死。
- 组织可以用 `managedMcpServers` 统一下发。

## 来源

- [MCP 2026-07-28 规范发布说明](https://blog.modelcontextprotocol.io/posts/2026-07-28/)、[2026-08-22 路线图](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/blog/content/posts/2026-08-22-mcp-roadmap.md)
- [EpicGames/unreal-engine-skills-for-claude-code-plugin](https://github.com/EpicGames/unreal-engine-skills-for-claude-code-plugin)（克隆阅读）
- Anthropic：[Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)、[Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)、[Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Simon Willison：Stateless MCP has recaptured my interest](https://simonwillison.net/2026/Jul/31/stateless-mcp/)、[Earendil（Pi）：You said no MCP](https://earendil.com/posts/you-said-no-mcp/)
- HN：[I benchmarked GitHub CLI, MCP, Tool Search, Code Mode](https://news.ycombinator.com/item?id=47495475)、[When does MCP make sense vs CLI?](https://news.ycombinator.com/item?id=47208398)、[MCP was always a bad idea?](https://news.ycombinator.com/item?id=49779329)（摘要）
- [CSA 研究笔记：Agentjacking（MCP + Sentry 注入）](https://labs.cloudsecurityalliance.org/research/csa-research-note-agentjacking-mcp-sentry-injection-20260612/)（二手）
