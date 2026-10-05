# 12 · 资源索引

> 只收录读过、并且能说明“为什么值得看”的资源。核实时间：2026-10-05。

## 1. 一手信息源（优先级最高）

| 来源 | 为什么看 | 频率 |
|---|---|---|
| [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（[RSS](https://github.com/anthropics/claude-code/blob/main/feed.xml)） | 最快了解新功能；每个版本都有 | 每周 |
| [Claude Code 文档](https://code.claude.com/docs)（[llms.txt 索引](https://code.claude.com/docs/llms.txt)） | 官方用法；llms.txt 方便让 Agent 直接读 | 按需 |
| [Anthropic Engineering](https://www.anthropic.com/engineering) | 质量最高的 Agent 工程文章（上下文工程、长时任务、工具设计、auto mode、安全隔离、评估） | 每月 |
| [openai/codex Releases](https://github.com/openai/codex/releases) 与源码 | Codex 更新；官方文档访问不了时可直接读源码 | 每周 |
| [gemini-cli changelogs](https://github.com/google-gemini/gemini-cli/tree/main/docs/changelogs) | Gemini CLI 每周发布 | 每两周 |
| [MCP 规范仓库](https://github.com/modelcontextprotocol/modelcontextprotocol)（`blog/`、`seps/`） | 规范演进、路线图 | 每月 |
| [Agent Skills 规范](https://github.com/agentskills/agentskills) | Skill 格式与编写方法 | 按需 |
| [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | 官方市场里新增了什么 | 每月 |

### Anthropic 工程博客必读清单
1. [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)：Agent 架构基础
2. [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
3. [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
4. [Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
5. [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) / [Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use)
6. [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) / [Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
7. [Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
8. [Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode) / [How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)
9. [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
10. [Multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

## 1.5 技术社区与一线博客（了解“真正好用什么”）

| 来源 | 为什么看 | 怎么读 |
|---|---|---|
| **[Simon Willison 的博客](https://simonwillison.net)** | 最勤奋、最可信的一线实践者：新模型首日评测、价格对比、安全问题（“致命三要素”就是他提出的）、年度复盘 | [Atom 订阅](https://simonwillison.net/atom/everything/)；必读：[Agentic Engineering Patterns](https://simonwillison.net/guides/agentic-engineering-patterns/)、[2026 in LLMs](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/) |
| **Hacker News** | 新工具和新模型的第一反应，评论区常有一线实测 | 用 Algolia API 按热度和时间筛选：`https://hn.algolia.com/api/v1/search?query=claude%20code&tags=story&numericFilters=points>150` |
| **[Lobsters](https://lobste.rs/t/ai)** | 比 HN 更偏技术、更冷静，常有对 AI 编程的批判性讨论 | 在 `.json` 结尾的地址拿结构化数据 |
| **[Latent Space](https://www.latent.space)** | AI 工程领域最重要的播客和日报（AINews）；常有厂商核心成员的访谈 | [RSS](https://www.latent.space/feed) |
| **[Embrace The Red](https://embracethered.com)** | Agent 安全攻防的一线研究（提示注入、auto mode 绕过） | 重大发布后看 |
| **[METR](https://metr.org/blog/)** | 关于 AI 生产力和能力的最严谨研究 | 每月 |
| **V2EX、知乎、掘金、linux.do** | 中文社区的实际痛点：封号、额度、国产模型接入、团队协作 | V2EX 有公开 API（`/api/topics/show.json?node_name=claude`）；linux.do 拦截机房 IP |
| Reddit（r/ClaudeAI、r/ClaudeCode、r/codex、r/LocalLLaMA） | 用户量最大，适合看问题的普遍程度 | 拦截机房 IP，需要在本地浏览器看 |

## 2. 精选清单

| 清单 | 说明 |
|---|---|
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 人工精选，分类清晰（入门、编排、Skills、记忆、安全、可观测性、配置、测试、Linting）；仓库里的 CSV 文件便于检索 |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | 300+ 个 Skills，来自官方团队和社区 |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | 160+ 个 Subagent 定义 |
| [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | MCP 服务器大全 |
| [openai/codex Discussion #16329](https://github.com/openai/codex/discussions/16329) | Codex 生态 150+ 个工具 |

## 3. 入门与深入

| 资源 | 说明 |
|---|---|
| [Writing a good CLAUDE.md（HumanLayer）](https://www.humanlayer.dev/blog/writing-a-good-claude-md) | “指令预算”、渐进式披露 |
| [shareAI-lab/learn-claude-code](https://github.com/shareAI-lab/learn-claude-code) | 拆解 Coding Agent 的组成，理解原理 |
| [zebbern/claude-code-guide](https://github.com/zebbern/claude-code-guide) | 单页速查，与官方文档同步 |
| [obra/superpowers](https://github.com/obra/superpowers) | 一整套 Skill 化的开发方法论，值得读它的 Skill 是怎么写的 |
| [Martin Fowler：Exploring Gen AI 系列](https://martinfowler.com/articles/exploring-gen-ai.html) | 对 SDD 等方法的冷静分析 |

## 4. 实用小工具

| 工具 | 用途 |
|---|---|
| [ccusage](https://github.com/ccusage/ccusage) | `npx ccusage`：分析 Claude Code 本地日志里的用量和成本 |
| [rulesync](https://github.com/dyoshikawa/rulesync) | 用一份源配置生成多种 Agent 的规则、MCP、命令配置 |
| [agnix](https://github.com/agent-sh/agnix) | CLAUDE.md、AGENTS.md、SKILL.md、hooks、MCP 配置的 linter 和 LSP |
| [claude-code-otel](https://github.com/ColeMurray/claude-code-otel) | 用 OpenTelemetry 加 Grafana 观测 Claude Code |
| [Plannotator](https://github.com/backnotprop/plannotator) | 在图形界面里批注 Plan 模式的计划 |

## 5. 如何持续跟进

1. **每周**：看 Claude Code、Codex 的 changelog，把重要变化记进对应文档。
2. **每月**：读 Anthropic 工程博客的新文章，看 MCP 规范仓库的博客，浏览官方插件市场新增的插件。
3. **发现新东西**：先记进下面的“待验证”，验证后再写进正文。
4. **每季度**：重跑私有评估集，审视自己的配置（`/doctor prompt-audit`、`/skill-doctor`），删掉过时内容。

## 6. 待验证（Backlog）

**2026-10-05 已完成**：读了 arXiv 原文（2602.11988、2606.15828、2607.27250、2601.20404、2608.25241、2607.04697 等）、METR 原始报告、GitClear 报告、官方榜单数据、Codex 官方文档、Cursor 官方页面、Unity 官方文档；读了 HN、Lobsters、V2EX 原帖。

**仍待验证**：
- [ ] Reddit（r/ClaudeAI、r/ClaudeCode、r/codex、r/LocalLLaMA）的社区反馈：需要在本地浏览器看
- [ ] linux.do、知乎上的中文实践经验
- [ ] Antigravity、Kiro、JetBrains Junie 的官方文档
- [ ] danluu《What's the best programming language for coding agents?》（当前网络策略拦截）
- [ ] Terminal-Bench 4.0 的具体排名（页面由 JS 渲染）
- [ ] 实测：Claude Projects、Codex Ultra 模式、Agent Teams 的成本和收益
- [ ] 实测：Superpowers 在中型项目中的效果与开销
- [ ] 实测：GLM-5.3 / Qwen 3.8 27B 配合 OpenCode 或 Pi 做日常开发
- [ ] 实测：Claude Code 的 harness 开销（复现 Systima 的测量）
- [ ] Gemini 4 Argon 开放后的评测
