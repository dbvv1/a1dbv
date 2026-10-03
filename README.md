# a1dbv — AI Coding 前沿知识库

> 系统收集、验证、分析 **AI 辅助编程（AI Coding）** 的工具、方法与配置，追踪最前沿的进展。
> 主干是通用的 AI coding；具体领域（如游戏开发 / Unity）作为分支放在 [`domains/`](domains/)。

**最近一次全面核实：2026-10-03**。每条结论都标注了证据等级，见 [评级与证据体系](docs/README.md#评级与证据体系)。

---

## 一页纸结论（2026-10）

1. **验证闭环比模型选择更重要。** 给 Agent 一个它能自己跑的检查（测试/构建/截图），是“盯着它干活”和“放手让它干”的分水岭。Anthropic 官方最佳实践把这列为第一条。→ [07-workflows](docs/07-workflows.md)
2. **上下文是第一稀缺资源。** 上下文越满，模型越容易遗忘和出错（context rot）。`/clear`、子 Agent、按需加载的 Skill 都是在管理这一资源。→ [03-context-engineering](docs/03-context-engineering.md)
3. **指令文件（CLAUDE.md / AGENTS.md）有用，但没有想象中那么有用。** 2026 年两项研究表明：人写的比 LLM 生成的好；能提升效率、让 Agent 多做测试，但**几乎不改变正确率**。写短、写 Agent 猜不到的东西。→ [03-context-engineering](docs/03-context-engineering.md#22-指令文件到底有没有用研究证据)
4. **标准已收敛：** AGENTS.md（Claude Code 自 v2.1.277 原生读取）、Agent Skills（40+ 工具支持）、MCP（2026-07-28 版改为无状态）、ACP（Agent 接入 IDE）。投资这些格式的配置可以跨工具复用。
5. **MCP 不是万能的。** 社区基准显示同一任务 GitHub MCP 比 `gh` CLI 贵 2–3 倍；有 shell 的场景优先 CLI + Skill，MCP 用于无 shell、需隔离凭证或团队级工具发现的场景。→ [04-mcp](docs/04-mcp.md#2-mcp-vs-cli社区争论与数据)
6. **多 Agent 并行只对“可拆分的独立任务”有效。** 研究测得同构 Agent 并行的文本冲突率约 20%，强耦合任务反而更慢；瓶颈是人的评审。→ [08-multi-agent](docs/08-multi-agent.md)
7. **安全靠环境边界，不靠模型自觉。** Coding Agent 天然具备“致命三要素”（私有数据 + 不可信内容 + 外发能力）；2026 年已出现通过 Sentry 事件注入劫持 Claude Code / Cursor / Codex 的真实攻击。→ [10-security](docs/10-security.md)
8. **社区最大痛点是额度与成本不可预测**（两大厂商 GitHub issue 点赞第一都是额度问题），其次是模型更新后的质量波动。→ [11-community-pulse](docs/11-community-pulse.md)

## 目录

### 主干：AI Coding

| 文档 | 内容 |
|---|---|
| [docs/README.md](docs/README.md) | 阅读顺序、评级与证据体系、维护流程 |
| [00 现状总览](docs/00-state-of-ai-coding.md) | 2026 年 AI coding 的格局、趋势、共识与争议 |
| [01 Coding Agent](docs/01-agents/README.md) | Agent 对比矩阵与选型；Claude Code / Codex / Gemini CLI / 开源 Agent / IDE 类深度页 |
| [02 模型与成本](docs/02-models-and-cost.md) | 模型档位、价格、订阅 vs API、额度、国内 Coding Plan、本地模型、基准测试可信度 |
| [03 上下文工程](docs/03-context-engineering.md) | 原理、指令文件（含研究证据）、记忆、压缩、子 Agent |
| [04 MCP](docs/04-mcp.md) | 规范演进、MCP vs CLI 争论、推荐服务器、如何写好工具 |
| [05 Skills 与插件](docs/05-skills-and-plugins.md) | Agent Skills 规范、编写与评估方法、插件市场与值得装的东西 |
| [06 Hooks 与护栏](docs/06-hooks-and-guardrails.md) | Hooks、权限模式、auto mode 实测数据、沙箱 |
| [07 工作流](docs/07-workflows.md) | 验证闭环、探索-计划-实现、访谈式 Spec、TDD、SDD（含批评）、Ralph 循环、长时任务 harness |
| [08 多 Agent 与并行](docs/08-multi-agent.md) | 5 种并行方式、编排工具、证据与适用边界 |
| [09 评审与质量](docs/09-review-and-quality.md) | AI 代码评审、质量数据、给自己的 AI 配置做评估 |
| [10 安全](docs/10-security.md) | 威胁模型、2026 真实事件、防护清单 |
| [11 社区脉搏](docs/11-community-pulse.md) | 痛点排行、口碑、争议、生产力证据 |
| [12 资源索引](docs/12-resources.md) | 一手信息源、精选清单、如何持续跟进 |

### 分支：领域落地

| 领域 | 内容 |
|---|---|
| [domains/game-dev-unity](domains/game-dev-unity/README.md) | 大型 Unity 项目：官方 Unity CLI / 插件、社区 MCP、项目落地指南、AI 资产生成、配置模板 |

### 可直接使用

| 路径 | 内容 |
|---|---|
| [templates/](templates/README.md) | 通用项目模板（AGENTS.md、CLAUDE.md、settings、Hooks、Skills、Subagents）与个人全局模板 |
| [ai-config/](ai-config/README.md) + [scripts/](scripts/) | 本地 AI 配置的脱敏导出（白名单 + 密钥扫描） |

## 维护约定

- **证据优先**：每条事实注明来源；一手来源（官方文档、源码、changelog）优先；只有搜索摘要的标注为二手。
- **有判断**：不堆链接，写“适合谁、不适合谁、坑在哪”。
- **会过时**：生态以周为单位变化，文档头部写核实日期；过时内容直接改或删。
- 本仓库是 **public**：禁止提交密钥、内部地址、公司代码。

## 许可证

[MIT](./LICENSE)
