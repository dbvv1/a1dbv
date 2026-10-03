# a1dbv

> 一站式收集整理 **AI 与 AI Coding** 的工具、Agent、Skill、MCP、工作流与配置模板。
> 核心是 AI / AI Coding 本身；**大型 Unity 游戏开发**是重点落地分支。

## 项目目标

1. **全景地图**：持续追踪 AI coding 生态里最有效、最先进的东西（模型、Agent、IDE、MCP、Skills、编排、评审……）。
2. **方法论**：沉淀可复用的工作流与最佳实践，而不是只堆链接。
3. **可直接落地的配置**：提供能拷进项目就用的 `CLAUDE.md` / `AGENTS.md` / subagent / skill / hook 模板。
4. **Unity 分支**：把以上内容具体化到“本地大型 Unity 项目 + AI 协作”的场景。
5. **个人配置备份**：脱敏后的本地 AI coding 配置（见 `ai-config/`）。

## 目录导航

| 路径 | 内容 |
|---|---|
| [`docs/00-roadmap.md`](docs/00-roadmap.md) | 落地路线图：从单 Agent 到多 Agent 并行，分阶段要做什么 |
| [`docs/01-landscape.md`](docs/01-landscape.md) | AI coding 全景分层图，各层代表工具 |
| [`docs/02-coding-agents.md`](docs/02-coding-agents.md) | Coding Agent / AI IDE 对比与选型 |
| [`docs/03-models.md`](docs/03-models.md) | 模型选择原则、云端 vs 本地模型 |
| [`docs/04-mcp.md`](docs/04-mcp.md) | MCP 协议与推荐服务器 |
| [`docs/05-skills-plugins.md`](docs/05-skills-plugins.md) | Agent Skills 标准、插件与市场、如何写好一个 Skill |
| [`docs/06-claude-code-playbook.md`](docs/06-claude-code-playbook.md) | Claude Code 进阶手册（记忆、权限、Hooks、Subagent、无头模式…） |
| [`docs/07-workflows.md`](docs/07-workflows.md) | 工作流方法论：上下文工程、Spec 驱动、TDD、并行 Agent、AI 评审 |
| [`docs/08-security.md`](docs/08-security.md) | 安全：密钥、提示词注入、MCP 风险、权限边界 |
| [`docs/09-resources.md`](docs/09-resources.md) | Awesome 列表、官方文档、值得关注的资源 |
| [`unity/`](unity/README.md) | **Unity × AI 分支**：官方/社区工具链、大型项目落地指南、AI 资产生成 |
| [`templates/`](templates/README.md) | 可直接拷贝使用的配置模板（Unity 项目 / 全局个人配置） |
| [`ai-config/`](ai-config/README.md) | 个人本地 AI 配置的脱敏导出区 |
| [`scripts/`](scripts/) | 辅助脚本（如本地配置导出） |

## 快速上手（Unity 项目）

1. 读 [`unity/README.md`](unity/README.md) 了解官方与社区工具链，选定方案。
2. 把 [`templates/unity/`](templates/unity/) 下的 `CLAUDE.md`、`AGENTS.md`、`.claude/` 拷进你的 Unity 项目根目录，按注释改项目信息。
3. 安装 Unity 官方 Claude Code 插件（或 Codex 插件）+ C# LSP。
4. 按 [`docs/00-roadmap.md`](docs/00-roadmap.md) 的阶段逐步启用更多能力。

## 维护约定

- 每条工具信息尽量注明**来源链接**和**核实时间**；生态变化很快，过时内容直接改或删。
- 只收录**用过或有可靠来源**的内容；未验证的标注「待验证」。
- 本仓库是 **public**：不要提交任何密钥、内部地址、公司项目代码。

## 许可证

[MIT](./LICENSE)
