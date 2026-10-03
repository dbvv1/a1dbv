# 12 · 资源索引

> 只收录读过、并且能说明“为什么值得看”的资源。核实时间：2026-10-03。

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

- [ ] 在网络开放的环境中**读论文全文**：arXiv 2602.11988、2607.27250、2608.25241、2607.04697
- [ ] 读 METR 2026 原始报告，核实“−4%”和“1.4–2 倍”的数据
- [ ] 复核 Codex 2026 年时间线（官方 changelog）与 guardian 配置
- [ ] 复核 Cursor 3、Antigravity、Kiro 的官方文档
- [ ] 补充 Reddit（r/ClaudeAI、r/ChatGPTCoding、r/cursor）与 X 上的社区反馈
- [ ] 实测：Superpowers 在中型项目中的效果与开销
- [ ] 实测：Claude Code Agent Teams 与 Dynamic Workflows 的成本和收益
- [ ] 实测：国产 Coding Plan 接入 Claude Code 后的功能完整度
- [ ] 官方榜单（swebench.com、tbench.ai、Scale）的当前数据
