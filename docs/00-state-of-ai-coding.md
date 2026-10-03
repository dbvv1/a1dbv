# 00 · AI Coding 现状总览（2026-10）

> 核实时间：2026-10-03。评级与证据标记见 [docs/README](README.md#评级与证据体系)。

## 1. 格局：从“补全”到“Agent 舰队”

```
2023  补全 / 聊天          Copilot 补全、ChatGPT 问答
2024  IDE 内 Agent        Cursor Composer、Copilot Edits
2025  终端 Agent           Claude Code、Codex CLI、Gemini CLI；MCP 普及；Skills 出现
2026  Agent 平台化         插件市场、后台/云端 Agent、多 Agent 编排、开放标准收敛、
                          auto mode（分类器代替人审批）、引擎/平台厂商官方入场
```

今天主流 Coding Agent 的能力已经高度趋同 **[一手]**：它们都支持 MCP、Skills、Hooks、Subagents、Plan 模式、AGENTS.md、后台/云端任务、插件市场。两大厂商 issue 区里点赞最高的功能请求（Hooks、Subagents、Plan 模式、AGENTS.md、ACP）几乎都已实现（见 [11-community-pulse](11-community-pulse.md)）。**差异更多体现在模型、harness 细节、价格与额度上。**

## 2. 七个关键趋势

### 2.1 开放标准收敛 ✅
| 标准 | 作用 | 状态（2026-10） |
|---|---|---|
| **MCP** | Agent 连接外部工具/数据 | 2026-07-28 版：无状态核心、Header 路由、可缓存列表、授权加固；Tier-1 SDK 月下载近 5 亿 **[一手]** |
| **Agent Skills** (`SKILL.md`) | 可移植的“操作手册”包 | 2025-12 开放；40+ 客户端支持 **[一手]** |
| **AGENTS.md** | 跨工具的项目指令文件 | Codex、Cursor、Copilot、Gemini CLI 等支持；Claude Code v2.1.277 起原生读取 **[一手]** |
| **ACP** (Agent Client Protocol) | 任意 Agent 接入编辑器 | JetBrains 2026 版、Zed、ReSharper 2026.2 支持 **[二手]** |

**含义**：把配置投资在这些格式上，换工具时成本很低。

### 2.2 插件化与市场 ✅
Claude Code 官方市场已有 **315 个插件** **[一手]**（含 13 个语言服务器插件、各大 SaaS 官方插件、Unity/Unreal 等引擎插件）；Codex 2026-03 推出插件；Superpowers 这类方法论插件已同时进入 Claude 与 Codex 两家官方市场 **[一手]**。

### 2.3 自主性提升：auto mode / guardian
人工逐条审批导致“审批疲劳”——Anthropic 披露用户约 **93%** 的权限请求都点了同意 **[一手]**。于是两家都引入了“用模型审模型”：
- Claude Code **auto mode**（v2.1.283 起成为交互会话默认模式）：真实流量最终误拦率 0.4%，但对真实“过度执行”动作的漏放率 **17%** **[一手]**。
- Codex **guardian / auto-review** 子 Agent（2026-04）**[二手]**。

→ 自主性提高了，但**不能代替环境隔离**（见 [10-security](10-security.md)）。

### 2.4 长时任务与多 Agent
- Claude Code：子 Agent、Agent View（`claude agents`）、Agent Teams（实验）、Dynamic Workflows、云端 Projects，共 5 种并行方式 **[一手]**。
- Anthropic 用 16 个 Agent 并行两周、花费约 2 万美元写出了能编译 Linux 内核的 C 编译器；结论是“**验证器必须近乎完美**” **[一手]**。
- 社区共识：并行适合独立任务，耦合任务反而更慢；评审是瓶颈 **[社区]**。

### 2.5 上下文工程取代提示词工程
重点从“怎么措辞”转向“给模型看什么”：按需加载（Skills、MCP 工具搜索、LSP）、子 Agent 隔离、压缩、外置笔记 **[一手]**。→ [03](03-context-engineering.md)

### 2.6 厂商与平台官方入场
游戏引擎（Unity 官方 CLI + 插件 + MCP）、云厂商（AWS/Azure/GCP 插件）、SaaS（Stripe、Sentry、Linear……）都在发布官方 Skills/MCP/插件 **[一手]**。领域知识正在以 Skill 的形式标准化分发。

### 2.7 安全问题从理论走向现实
- 2026-06：通过 Sentry 错误事件注入指令，劫持 Claude Code / Cursor / Codex 执行攻击者命令（“agentjacking”）**[二手]**。
- Gemini CLI 2026 年 8–9 月的版本几乎全是安全加固（间接提示注入、MCP OAuth SSRF、凭证泄漏）**[一手]**。

## 3. 共识（可以放心照做）

| 共识 | 证据 |
|---|---|
| 给 Agent 可执行的验证（测试/构建/截图），让它自己闭环 | Anthropic 最佳实践第一条；C 编译器案例 **[一手]** |
| 先探索、再计划、后实现；一句话能描述的改动跳过计划 | 官方最佳实践 **[一手]** |
| 上下文要主动管理：无关任务之间 `/clear`；纠正两次仍错就重开 | 官方最佳实践 **[一手]** |
| 做事的 Agent 和评判的 Agent 要分开 | Anthropic 长时任务 harness 研究 **[一手]** |
| 指令文件要短、要人写、只写 Agent 猜不到的 | 官方文档 + 2026 研究 **[一手][研究]** |
| 必须强制的规则写成 Hook，而不是写进指令文件 | 官方文档 **[一手]** |
| 只装需要的 MCP/插件，安装前读内容 | 官方安全指引 + 真实供应链事件 **[一手][二手]** |

## 4. 争议（看清再选）

| 争议 | 一方 | 另一方 | 本仓库判断 |
|---|---|---|---|
| MCP vs CLI | MCP 有类型契约、可隔离凭证、便于团队发现工具 | CLI 便宜 2–3 倍、可组合（管道/jq）| 有 shell 就优先 CLI + Skill；MCP 用于无 shell、凭证隔离或团队工具发现 → [04](04-mcp.md) |
| Spec 驱动开发 (SDD) | 先写规格再实现，减少返工 | “瀑布回归”：Spec Kit 给一个日期显示功能生成 1300 行 Markdown | 中大型、需求稳定的功能用轻量 SDD；小改动和探索期不用 → [07](07-workflows.md#5-spec-驱动开发sdd) |
| 多 Agent 并行 | 产能倍增 | 冲突、评审瓶颈、成本倍增 | 2–3 个独立任务并行；耦合任务串行 → [08](08-multi-agent.md) |
| AI 到底提效多少 | 2026 年成熟工作流用户自报 1.4–2 倍产出 | METR 2025 RCT：资深开发者慢 19%，但自认为快 20% | 收益高度依赖使用方式；要自己度量 → [11](11-community-pulse.md#4-生产力证据) |
| Claude Code vs Codex | Claude Code 生态最全、长程任务强 | Codex 更快、更省、更“听话”，2026 年差距明显缩小 | 两者都值得会用；交叉评审很有价值 → [01](01-agents/README.md) |

## 5. 对个人/团队的建议

1. **选一个主力 Agent 用深**（Claude Code 或 Codex），再配一个做交叉评审。
2. **先建验证闭环**（测试、类型检查、LSP），再谈自主和并行。
3. **配置用开放格式**：AGENTS.md + Skills + MCP，方便迁移。
4. **度量**：记录哪些任务 AI 做得好或差，定期修剪指令和 Skill（`/skill-doctor`、`/doctor prompt-audit`）。
5. **安全基线**：沙箱 / 容器、最小权限、不可信输入隔离、密钥不进上下文。

## 来源

- Claude Code changelog（v2.1.0–2.1.288）与官方文档 [code.claude.com/docs](https://code.claude.com/docs)
- Anthropic Engineering：[Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode)、[How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)、[Building a C compiler](https://www.anthropic.com/engineering/building-c-compiler)、[Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [MCP 2026-07-28 规范发布说明](https://blog.modelcontextprotocol.io/posts/2026-07-28/)、[agentskills.io](https://agentskills.io)、[agents.md](https://agents.md)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- 社区与研究出处见 [11-community-pulse](11-community-pulse.md)
