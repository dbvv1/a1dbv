# a1dbv — AI Coding 前沿知识库

> 系统收集、验证、分析 **AI 辅助编程（AI Coding）** 的工具、方法与配置，追踪最前沿的进展。
> 主干是通用的 AI coding；具体领域（如游戏开发 / Unity）作为分支放在 [`domains/`](domains/)。

**最近一次核实：2026-10-08**（第四轮：游戏分支压缩为“AI 与游戏开发怎么结合”，主干补上[按任务类型的打法](docs/15-task-playbooks.md)和[自建 Agent](docs/16-building-agents.md)，并同步了 OpenAI DevDay、Claude Code 2.1.294 等最新变化）。每条结论都标注了证据等级，见 [评级与证据体系](docs/README.md#评级与证据体系)。

---

## 一句话

> **生成已经很便宜，验证、理解和判断仍然昂贵。** 模型擅长什么、上下文为什么要省、评审为什么崩、安全为什么只能靠边界、团队为什么越用越乱，都可以从这个不对称推出来。→ [14 深度分析](docs/14-synthesis.md)

## 一页纸结论（2026-10）

1. **验证闭环比模型选择更重要。** 给 Agent 一个它自己能跑的检查（测试、构建、截图），这是“得盯着它干活”和“可以放手”的分水岭。Fable 级模型（Opus 5.5、GPT-6 Astra）只要有**清晰的完成标准、约束和工具**，就能靠蛮力把问题做完，**定义问题**成了最核心的技能。→ [07](docs/07-workflows.md)、[13](docs/13-frontier-radar.md)
2. **上下文和 token 都是成本。** 上下文越满，效果越差；实测 Claude Code 在你开口前就发送约 33k token，一个 72KB 的指令文件让每次请求多约 2 万 token，拆给子 Agent 后 token 会成倍增加。→ [03](docs/03-context-engineering.md)、[02](docs/02-models-and-cost.md)
3. **指令文件（CLAUDE.md / AGENTS.md）主要提升效率，而不是正确率。** 2026 年的研究（读了原文）：LLM 生成的指令文件让成本增加 20% 以上，却不提高成功率；人写的略好但不显著；**仓库概览没用**；62% 的文件把 linter 该管的规则写了进去。写短、人工写、只写 Agent 猜不到的东西。→ [03](docs/03-context-engineering.md#22-指令文件到底有没有用研究证据)
4. **价格战已经开打，模型在按角色分层。** 2026-09 同档模型价格下降 40–50%；Opus 5.5 达到 Fable 5.1 的水平、价格更低；Haiku 5.5 降到 $0.10 / $0.50，适合做子 Agent；新出现的“决策模型”专做路由和分类。但订阅额度在收紧。开源权重模型（GLM-5.3、Qwen 3.8）逼近前沿。→ [02](docs/02-models-and-cost.md)
5. **标准已经收敛，迁移成本很低。** AGENTS.md（Claude Code 原生读取）、Agent Skills、MCP（无状态版）、ACP；Codex 甚至能直接 `/import` Claude Code 的配置。→ [00](docs/00-state-of-ai-coding.md)
6. **MCP 和 CLI 各有用处。** 强模型加 shell 的场景，CLI + Skill 更便宜、更好组合；小模型、本地模型和高风险环境里，MCP 更易审计、更好控制。→ [04](docs/04-mcp.md)
7. **多 Agent 并行只对能拆分的任务有效。** 真实 Agent PR 的冲突率在 20–42%；按依赖关系切分任务比多开 Agent 更重要；瓶颈在理解和评审。→ [08](docs/08-multi-agent.md)
8. **安全靠环境边界，不靠审批。** auto mode 已经被实测绕过，AI 实验室自己训练的 Agent 都突破过沙箱；4 万局模拟数据显示，人工逐条审批平均漏掉 1/3 的威胁。隔离、出网白名单、硬性预算上限，以及审查 Agent 引入的依赖，都不能省。→ [10](docs/10-security.md)
9. **模型在“有快速验证器”的地方进步飞快，在可维护性、架构、产品判断上进步缓慢**，因为后者没法用来做强化学习。所以“全自动软件工厂”只适合验证器锐利的部分，其余部分要人在前期定设计、按垂直切片评审。→ [14](docs/14-synthesis.md)、[07](docs/07-workflows.md#34-大功能的前置设计与垂直切片-)
10. **游戏开发的瓶颈在验证，不在生成。** 把游戏改造成“Agent 能玩”的形态（状态可导出、输入可注入），比让 Agent 看截图有效得多；“好不好玩”仍然只能由人判断。→ [domains/game-dev](domains/game-dev/README.md)
11. **社区最大的痛点是额度和成本不可预测**，其次是模型更新后的质量波动、透明度争议（隐写标记、加密的子 Agent 提示词）以及中文用户的封号问题。→ [11](docs/11-community-pulse.md)

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
| [12 资源索引](docs/12-resources.md) | 一手信息源、技术社区、精选清单、如何持续跟进 |
| [**13 前沿雷达**](docs/13-frontier-radar.md) | **最近 3–6 个月的大事件、价格战、新兴做法、争议，以及下季度值得关注的方向** |
| [**14 深度分析**](docs/14-synthesis.md) | **六条底层规律（现象 → 机制 → 推论 → 边界）、决策框架、成熟度路线，以及什么证据会推翻这些判断** |
| [**15 按任务类型的打法**](docs/15-task-playbooks.md) | 理解代码、调试、新功能、重构、迁移、补测试、性能、评审、文档、原型：每类任务的风险、打法、验证和提示词 |
| [16 自建 Agent](docs/16-building-agents.md) | 什么时候值得自己搭；Claude Agent SDK / Tool Runner / Managed Agents 与 OpenAI Agents API / SDK / Codex SDK 的对比和选择 |

### 分支：领域落地

| 领域 | 内容 |
|---|---|
| [domains/game-dev](domains/game-dev/README.md) | AI coding × 游戏开发：各环节怎么用 AI、引擎接入、**验证与 AI 试玩**、游戏中的生成式 AI |
| [domains/game-dev/unity](domains/game-dev/unity/README.md) | 大型 Unity 项目：官方 Unity CLI / 插件、社区 MCP、项目落地指南、配置模板 |
| [domains/game-dev/unreal](domains/game-dev/unreal/README.md) | 大型 Unreal 项目：UE 5.8 官方 MCP 与 Epic 插件、Live Coding 与 UBT 编译、命令行自动化测试、配置模板 |

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
