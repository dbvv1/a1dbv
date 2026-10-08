# 16 · 自建 Agent：什么时候值得、用什么搭

> 核实时间：2026-10-08。
> 依据 **[一手]**：
> - Anthropic：Claude API 官方 Skill（随 Claude Code 2.1.294 分发）中的方案比较、Agent 设计和 Managed Agents 文档；克隆查看了 [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)；
> - OpenAI：developers.openai.com 的 [Agents](https://developers.openai.com/api/docs/guides/agents) 和 [Decisions](https://developers.openai.com/api/docs/guides/decisions) 指南，learn.chatgpt.com 的 [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk)、[app-server](https://learn.chatgpt.com/docs/app-server)、[codex exec](https://learn.chatgpt.com/docs/non-interactive-mode)（Markdown 版）；
> - Google ADK、AWS Strands、OpenAI Agents SDK 的仓库（只确认了活跃度，2026-10 都有提交）。
>
> 前面的章节讲“怎么用现成的 Coding Agent”。这一篇讲**什么时候该自己搭**，以及各家的搭建方式。

## 1. 先问：真的需要自建吗？

**多数情况下不需要。** 先按这个顺序排除：

| 需求 | 先试试 | 原因 |
|---|---|---|
| 在 CI 里让 Agent 修测试、写发布说明、做评审 | `claude -p`、`codex exec`、Gemini CLI 非交互模式（v0.63 起可以自主执行计划） | 现成的 harness 已经很强，脚本调用即可 |
| 团队共享的流程和知识 | Skill、插件、Hook | 不用写 Agent 循环 |
| 定时任务、长期跟进 | Claude Code 的 `/loop`、Routines；Codex 的云端任务；Dots | 平台已经托管 |
| 接公司内部系统 | 写一个 MCP 服务器或 CLI，给现成 Agent 用 | 比自建 Agent 省事得多（见 [04](04-mcp.md)） |

**值得自建的情况**：
- 要把 Agent **嵌进自己的产品**（给用户用，而不是给开发者自己用）；
- 需要**自定义的权限边界和审批流程**，现成工具的权限模型不够；
- 需要**托管在自己的基础设施上**（数据合规、内网）；
- 任务有固定的结构，适合**工作流**（代码控制流程）而不是开放式 Agent。

Anthropic 官方 Skill 给出的四条检查标准，任何一条答案为“否”，就应该停在更简单的方案（单次调用或固定工作流）**[一手]**：

1. **复杂度**：任务是否多步骤、难以事先完全写清？
2. **价值**：结果是否值得更高的成本和延迟？
3. **可行性**：模型是否擅长这类任务？
4. **出错代价**：错误能否被发现和恢复（测试、评审、回滚）？

## 2. 两个关键问题：谁提供 harness，谁提供部署

Anthropic 的划分方式最清楚：**harness**（Agent 循环、上下文管理）和**部署**（运行在哪里）是两个独立的问题 **[一手]**。

| 方案 | 你写什么 | harness | 部署 | 自带的工具 | 适用 |
|---|---|---|---|---|---|
| **Claude API 手写循环** | `while stop_reason == "tool_use"` 循环 | 自己写 | 自己托管 | 只有你定义的 | 要完全掌控循环 |
| **Claude API Tool Runner** | 只写工具函数 | SDK 提供循环（有每轮 Hook：审批、拦截、重试、压缩） | 自己托管 | 只有你定义的 | **自定义工具的 Agent，多数情况的首选** |
| **Claude Agent SDK** | 提示词 + 选项 | **就是 Claude Code 的 harness**（内置读写、编辑、Bash、搜索、子 Agent、Hook、权限、会话） | 自己托管 | 内置文件和 Bash 工具 + MCP | 要在自己的基础设施上跑一个“现成的编码 Agent” |
| **Claude Managed Agents**（beta） | Agent 配置 + 你的工具结果 | Anthropic 运行循环 | **Anthropic 为每个会话提供容器**（也可以自托管沙箱） | 容器内的 Bash、文件、代码执行 + Skill + MCP | 长时间运行、需要工作区、定时运行、要求“做到达标为止” |

OpenAI 的对应划分 **[一手：developers.openai.com]**：

| 方案 | 说明 | 对应 Anthropic 的 |
|---|---|---|
| **Agents API** | OpenAI 托管的 **Codex harness**，自动压缩上下文、多 Agent 编排、程序化工具调用、MCP；沙箱可以是 OpenAI 托管、自托管或不用 | Managed Agents |
| **Agents SDK** | 在你的应用里运行 Agent 循环和交接（handoff）；开源，支持 100 多种模型 | Tool Runner + 自己的编排 |
| **Responses API** | 直接调模型，从零搭 | 手写循环 |
| **Codex SDK**（TypeScript / Python） | 程序化控制**本地的 Codex**（启动、继续、恢复线程），用于 CI 和内部工具 | Claude Agent SDK |
| **Codex app-server** | Codex 给 VS Code 扩展等富客户端用的接口（认证、会话历史、审批、事件流），开源；`codex mcp-server` 已被移除，迁移到这里 | — |

其他值得知道的 **[一手：仓库]**：
- Google **ADK**（Agent Development Kit）：开源、代码优先的 Python 框架，覆盖构建、评估、部署；
- AWS **Strands Agents**：开源 SDK，配有 Strands Decider 决策模型；
- 极简路线：**Pi**（4 个工具 + TypeScript 扩展）、**DeepSeek Harness**（“一切皆插件”），适合想理解原理或高度定制的人（见 [01 开源 Agent](01-agents/open-source-agents.md)）。

## 3. 怎么选

```
需要嵌入产品，或自定义权限和审批？
├─ 否 → 用现成 Agent 的非交互模式（claude -p / codex exec）+ Skill / MCP。到此为止。
└─ 是 → 需要文件系统和 Bash 这类“编码能力”吗？
         ├─ 是 → 想自己托管？
         │        ├─ 是 → Claude Agent SDK / Codex SDK
         │        └─ 否 → Managed Agents / OpenAI Agents API
         └─ 否（只调用你自己的业务工具）→ Tool Runner / OpenAI Agents SDK
                  （模型厂商可能要换？→ 选支持多模型的框架：OpenAI Agents SDK、ADK、Strands）
```

**两个容易混淆的点** **[一手]**：
- **Tool Runner 不等于 Claude Agent SDK。** 前者是普通 Anthropic SDK 里的一个辅助功能，没有内置工具、没有文件系统；后者是“打包成库的 Claude Code”。Python 版 Agent SDK 需要另外安装 Claude Code CLI，它在底层驱动的就是 Claude Code。
- **Agent Skills 不等于 Managed Agents。** 前者是给模型加载的知识包，后者是托管的运行环境。

## 4. 设计要点（不管用哪家）

### 4.1 工具面：先用 Bash 求广度，再把关键动作提升为专用工具
Anthropic 的 Agent 设计指南 **[一手]**：Bash 能做几乎所有事，但 harness 只能看到一串不透明的命令。以下情况要把动作**提升为专用工具**：

| 情况 | 原因 |
|---|---|
| **需要把关** | 难以撤销的动作（调外部 API、发消息、删数据）适合放在确认之后。`send_email` 工具容易拦截，`bash -c "curl -X POST …"` 不容易 |
| **需要防过期** | 专用的 edit 工具可以在“文件在上次读取后被改过”时拒绝写入，Bash 做不到 |
| **需要渲染** | 比如把“向用户提问”做成工具，才能弹出选项并阻塞循环 |
| **需要并行** | `grep`、`glob` 这类只读工具可以标记为可并行；走 Bash 时 harness 分不清 `grep` 和 `git push`，只能串行 |

这和 [10 安全](10-security.md) 的结论一致：**审批要放在动作级别，而不是命令字符串级别**（4 万局审批数据中，藏在 `npm run` 后面的恶意脚本漏检率超过一半）。

### 4.2 上下文：按需加载，保持前缀稳定
- 工具多时用**工具搜索**（Anthropic 的 `tool_search_tool_*`、Unreal MCP 的 3 个元工具）：按需追加工具定义，而不是替换，**不会破坏提示缓存**；
- 流程知识放进 **Skill**：常驻上下文的只有描述；
- 长时间运行：**上下文编辑**（清掉旧的工具结果）+ **压缩**（接近上限时总结）+ **记忆**（跨会话）配合使用；
- **不要在会话中途改系统提示、换模型、增删工具**，这些都会让缓存失效。需要补充指令时，在消息里追加一条 system 消息；需要便宜模型时，开一个子 Agent，主循环保持同一个模型 **[一手]**。

### 4.3 组合工具调用：程序化工具调用
多个串行工具调用、或中间结果很大时，让模型**写一段脚本来调用工具**，中间结果在脚本里过滤，只把最终结果放进上下文。Anthropic（Programmatic Tool Calling）和 OpenAI（Agents API）都已支持 **[一手]**。

### 4.4 质量：把“完成标准”交给独立的评判者
- Managed Agents 的 **outcomes**：定义一组评分标准（5–10 条具体、可独立判定的标准），由**独立的评判者**反复评估，直到达标 **[一手]**；
- 这正是 [14 规律一](14-synthesis.md#1-规律一能力地图就是验证器地图) 的落地：能锐化的验证器就锐化，干活的和评判的分开。

### 4.5 安全与成本
- **凭证不进沙箱**：Managed Agents 的 vault 把密钥存在服务端，在出口处替换，沙箱里看不到 **[一手]**；
- **硬性预算**：Managed Agents 支持按会话设美元上限，到达后暂停而不是终止，历史和沙箱都保留 **[一手]**；
- **网络工具默认关闭**：Managed Agents 的 web_search / web_fetch 不受环境网络设置约束，不需要就关掉，需要就用域名白名单 **[一手]**；
- **决策交给决策模型**：路由、分类、“下一步做什么”这类判断，可以交给 OpenAI Decisions API（public beta，目前只支持 `gpt-6-luna`，官方称比 Responses API 快约 10 倍，支持“概率 / 选项 / 评分”三类问题）或开源的决策模型，用置信度决定是否交给人 **[一手]**（见 [02](02-models-and-cost.md#21-新类别决策模型2026-09-起)）。

## 5. 成本参考

| 项目 | 价格 | 来源 |
|---|---|---|
| Managed Agents 会话运行时间 | $0.08 / 小时（另加模型 token 和工具费用） | 官方 Skill 中的会话预算说明 **[一手]** |
| 网页搜索 | $10 / 1000 次 | 同上 |
| 子 Agent 用的便宜模型 | Claude Haiku 5.5：$0.10 / $0.50；GPT-6 Luna：$0.10 / $0.50 | [02](02-models-and-cost.md) |

**按“完成一个任务的成本”衡量，而不是按单次请求**：便宜模型如果需要更多轮次或重试才能完成，就不一定更便宜。先试“同一个强模型 + 更低的 effort”，再考虑多模型级联 **[一手：官方成本优化指南]**。

## 6. 评级

| 方案 | 评级 | 说明 |
|---|---|---|
| 现成 Agent 的非交互模式（`claude -p`、`codex exec`） | ✅ | 绝大多数自动化需求的起点 |
| Claude API Tool Runner / OpenAI Agents SDK | ✅ | 自定义业务工具的 Agent |
| Claude Agent SDK / Codex SDK | 🧪 | 在自己的基础设施上跑编码 Agent；注意它们依赖对应 CLI 的版本 |
| Managed Agents / OpenAI Agents API | 🧪 | 托管运行，长时间、定时、需要工作区的任务；都还是较新的产品 |
| 从零手写 Agent 循环 | 👀 | 只在需要特殊控制流时才值得 |

## 来源

- Anthropic：Claude API 官方 Skill（`shared/agent-design.md`、`shared/managed-agents-*.md`）；[Claude Agent SDK 文档](https://code.claude.com/docs/en/agent-sdk)；[claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)
- OpenAI：[Agents](https://developers.openai.com/api/docs/guides/agents)、[Decisions](https://developers.openai.com/api/docs/guides/decisions)、[Codex SDK](https://learn.chatgpt.com/docs/codex-sdk)、[Codex app-server](https://learn.chatgpt.com/docs/app-server)、[Non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)、[openai-agents-python](https://github.com/openai/openai-agents-python)
- [google/adk-python](https://github.com/google/adk-python)、[strands-agents/sdk-python](https://github.com/strands-agents/sdk-python)
