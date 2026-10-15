# 16 · 自建 Agent：什么时候值得、用什么搭

> 核实时间：2026-10-15（UTC+8）局部复核 SDK／托管选型、配置、缓存、预算与程序化工具调用；方案概览基线为 2026-10-08。2026-10-15 完成全文核心建议独立审阅，补 outcomes 终止条件并归一模型价表入口；不代表真实 SDK 或模型效果已验证。
> 依据 **[一手]**：
> - Anthropic：Claude API 官方 Skill（随 Claude Code 2.1.294 分发）中的方案比较、Agent 设计和 Managed Agents 文档；克隆查看了 [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)；
> - OpenAI：developers.openai.com 的 [Agents](https://developers.openai.com/api/docs/guides/agents) 和 [Decisions](https://developers.openai.com/api/docs/guides/decisions) 指南，learn.chatgpt.com 的 [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk)、[app-server](https://learn.chatgpt.com/docs/app-server)、[codex exec](https://learn.chatgpt.com/docs/non-interactive-mode)（Markdown 版）；
> - Google ADK、AWS Strands、OpenAI Agents SDK 的仓库（只确认了活跃度，2026-10 都有提交）。
>
> 前面的章节讲“怎么用现成的 Coding Agent”。这一篇讲**什么时候该自己搭**，以及各家的搭建方式。

## 1. 先问：真的需要自建吗？

**30 秒结论：多数情况下不需要自建循环。** CI 小任务先用非交互 CLI；需要嵌入应用、结构化事件或回调再用 SDK；愿意把循环和会话状态交给服务商才选托管。只因需要内网工具或缓存优化，不足以推导出必须重写 harness；若工具输入输出也不能出网，则先排除不符合数据边界的托管方案。**[研究：依据下文 §3、§4.2、§4.5]**

先按这个顺序排除：

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
| **Claude Managed Agents**（beta） | Agent 配置 + 你的工具结果 | Anthropic 运行循环 | **Anthropic 为每个会话提供容器**（也可以自托管沙箱） | 容器内的 Bash、文件、代码执行 + Skill + MCP | 长时间运行、需要工作区、定时运行、需要按明确 rubric 迭代的任务 |

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
         ├─ 是 → 需要自己运行 harness？
         │        ├─ 是 → Claude Agent SDK / Codex SDK
         │        └─ 否 → Managed Agents / OpenAI Agents API
         └─ 否（只调用你自己的业务工具）→ Tool Runner / OpenAI Agents SDK
                  （模型厂商可能要换？→ 选支持多模型的框架：OpenAI Agents SDK、ADK、Strands）
```

**两个容易混淆的点** **[一手]**：
- **Tool Runner 不等于 Claude Agent SDK。** 前者是普通 Anthropic SDK 里的一个辅助功能，没有内置工具、没有文件系统；后者是“打包成库的 Claude Code”。**2026-10-10 更正**：Python 版 Agent SDK 的官方发行包已捆绑 Claude Code CLI，默认无需另外安装；可用 `ClaudeAgentOptions(cli_path=...)` 指定其他 CLI。见 [官方 README 固定来源 S6](research/2026-10-10-audit.md) **[一手：安装文档，未运行验证]**。
- **Agent Skills 不等于 Managed Agents。** 前者是给模型加载的知识包，后者是托管的运行环境。

**复用 SDK 时，先固定运行契约，不急着重写循环**（2026-10-15）**[一手；研究：采用判断]**：
- Claude Python SDK 优先使用捆绑 CLI；显式 `cli_path` 会改用另一套运行时。当前文档和固定源码支持省略 `setting_sources` 时继承文件配置，`[]` 关闭 user／project／local 来源；产品或 CI 应显式选择来源与 `cwd`，但空列表不关闭 managed policy、全局配置及独立的自动记忆。
- Codex Python SDK 的发行包带固定 CLI runtime，通过本地 app-server 通信；需要自定义客户端的认证、审批和事件交互时选 app-server，普通自动编码仍用 CLI／SDK。
- CLI／SDK 更新会带来默认模型和环境行为变化。Anthropic 自己的 issue-triage 曾因默认模型改变而失败，维护者用显式模型修正；这支持锁定可用的模型与运行时组合，不支持为了防升级就自建 harness。

固定实现、测试定义及维护者原帖见 [S6a 选型补核](research/2026-10-10-audit.md#s6a--2026-10-15-sdk托管选型补核)；源码和当前文档不证明读者已经安装对应版本。

## 4. 设计要点（不管用哪家）

### 4.1 工具面：先用 Bash 求广度，再把关键动作提升为专用工具
Anthropic 的 Agent 设计指南 **[一手]**：Bash 能做几乎所有事，但 harness 只能看到一串不透明的命令。以下情况要把动作**提升为专用工具**：

| 情况 | 原因 |
|---|---|
| **需要把关** | 难以撤销的动作（调外部 API、发消息、删数据）适合放在确认之后。`send_email` 工具容易拦截，`bash -c "curl -X POST …"` 不容易 |
| **需要防过期** | 专用的 edit 工具可以在“文件在上次读取后被改过”时拒绝写入，Bash 做不到 |
| **需要渲染** | 比如把“向用户提问”做成工具，才能弹出选项并阻塞循环 |
| **需要并行** | `grep`、`glob` 这类只读工具可以标记为可并行；走 Bash 时 harness 分不清 `grep` 和 `git push`，只能串行 |

这和 [10 安全](10-security.md) 的结论一致：**关键动作要有明确的权限和执行边界，不能只审命令字符串**；相关审批案例和样本局限统一在 10 维护。**[研究：采用建议]**

### 4.2 上下文：先复用按需加载，再按 API 契约保缓存
- 多工具先试宿主已有的工具搜索和 Skill，不因“工具多”就手写循环。Anthropic 的 deferred tool search 把定义通过引用加入对话、保持前缀；普通增删顶层 `tools` 不自动享有这个性质，也不能把同一保证套给任意 MCP 元工具。**[一手：[工具搜索](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)；研究：选择]**
- 需要中途改变业务工具时，先查目标模型／平台支持的追加接口：Claude 支持的模型可追加 system 消息，inline-tools beta 可追加工具定义；不要改写旧前缀，也不要为保缓存拒绝必要的模型或权限调整。顶层工具、系统、消息与 effort 的分层规则统一见 [02 缓存边界](02-models-and-cost.md#2-价格快照api-美元百万-token)。**[一手：[中途变更契约](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages)；研究：选择]**
- 长任务先用现成 harness 的上下文编辑、压缩与跨会话记录；只有所需状态或控制流无法表达时，才补自己的逻辑。**[研究]**

这些是特定 API 的契约，不代表 CLI／SDK 已暴露每个 beta 开关；具体反例和适用模型见 [S6a](research/2026-10-10-audit.md#s6a--2026-10-15-sdk托管选型补核)。

### 4.3 组合工具调用：程序化工具调用
**🧪 只在代码能替代中间判断时采用**：批量独立查询、大结果过滤／聚合，或后续参数可由代码直接算出的依赖调用，先试现成 API／harness 的程序化工具调用；每步都要模型重新判断、用户审批或保留原生引用／文件时，默认直接调用，不因“调用多”就改写循环。Anthropic 与 OpenAI 当前文档均按任务形状区分；前者还报告过顺序单调用评测成本上升、质量未变的反例。**[一手：[Claude](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)、[OpenAI](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)；研究：采用判断]**

**先验适配层，再启用**：API 支持不等于所用框架已支持。OpenAI Responses 路径须保留程序事件、原始调用来源 `caller` 和结果关联；缺失时留在直接调用或换已支持该契约的接口，不能只加一个开关。普通业务工具仍先用 Tool Runner／Agents SDK，不新增自建 harness。**[一手：固定源码；研究]** 限制：节省与兼容性都依赖具体任务、版本和执行路径，真实失败及固定源码见 [S6b](research/2026-10-10-audit.md#s6b--2026-10-15-程序化工具调用的采用边界)。

### 4.4 质量：把“完成标准”交给独立的评判者
- Managed Agents 的 **outcomes** 用独立上下文的 grader，按明确 rubric 在迭代上限内反馈。应用应读取 outcome result：`satisfied` 才表示 rubric 满足，迭代耗尽、失败或中断须另行处理；转为 `idle` 不等于达标。模型评分不替代测试或人工验收，见 [22](22-agent-evaluation.md)。**[一手：[outcomes 契约](https://platform.claude.com/docs/en/managed-agents/define-outcomes)，2026-10-15 UTC+8]**
- 这正是 [14 规律一](14-synthesis.md#1-规律一验证覆盖与自主权分开判断) 的落地：能锐化的验证器就锐化，干活的和评判的分开。

### 4.5 安全与成本
- **凭证不进沙箱**：Managed Agents 的 vault 把密钥存在服务端，在出口处替换，沙箱里看不到 **[一手]**；
- **先选预算范围**：Claude CLI／Agent SDK 的运行预算按客户端 API 费用估算，恢复历史费用不纳入本次上限；Managed Agents 则按会话累计公开标价，达到后暂停新增模型请求并保留历史与沙箱。托管仍允许执行中的请求及其工具完成并超额，不能当作总账绝不超支。跨任务额度需应用另行累计。**[一手：[CLI reference](https://code.claude.com/docs/en/cli-reference)、[Session budgets](https://platform.claude.com/docs/en/managed-agents/budgets)；研究：选择]**；
- **内网工具不必等于自建循环**：Managed Agents 可自托管沙箱，让执行、文件和网络出口留在己方；但工具输入输出仍发送到 Anthropic 控制面。若要求这些内容也不得出网，这条路径不合适，换 SDK 也不自动改变云模型的数据边界。**[一手：[Self-hosted sandboxes](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes)；研究：撤回条件]**；
- **网络工具默认关闭**：Managed Agents 的 web_search / web_fetch 不受环境网络设置约束，不需要就关掉，需要就用域名白名单 **[一手]**；
- **决策交给决策模型**：路由、分类、“下一步做什么”这类判断，可以交给 OpenAI Decisions API（public beta，目前只支持 `gpt-6-luna`，官方称比 Responses API 快约 10 倍，支持“概率 / 选项 / 评分”三类问题）或开源的决策模型，置信度阈值须按目标任务校准，不能代替权限审批 **[一手；经验：采用边界]**（见 [02](02-models-and-cost.md#21-新类别决策模型2026-09-起)）。

## 5. 成本参考

| 项目 | 价格 | 来源 |
|---|---|---|
| Managed Agents 会话运行时间 | $0.08 / 小时（另加模型 token 和工具费用） | [当前会话预算文档](https://platform.claude.com/docs/en/managed-agents/budgets)（公开标价，2026-10-15）**[一手]** |
| 网页搜索 | $10 / 1000 次 | 同上 |
| 子 Agent 的候选轻量模型 | 先核任务能力、长输入分档与缓存口径，不在这里重复维护模型价表 | [02 模型与成本](02-models-and-cost.md#2-价格快照api-美元百万-token) |

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
