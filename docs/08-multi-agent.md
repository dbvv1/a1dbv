# 08 · 多 Agent 与并行

> 核实时间：2026-10-03。
> 一句话：**并行能提高吞吐量，但评审是瓶颈。只在任务彼此独立时并行。**

## 1. 证据

| 来源 | 发现 |
|---|---|
| Anthropic C 编译器项目 **[一手]** | 16 个 Opus 4.6 实例并行约 2 周，近 2000 个会话，20 亿输入 token 和 1.4 亿输出 token，花费约 2 万美元，写出 10 万行的 Rust C 编译器。**专业分工有效**（解析、代码生成、性能、代码质量、文档）；但当所有 Agent 卡在同一个瓶颈（编译 Linux 内核）上时会互相覆盖修改，解决办法是随机把大部分文件交给 GCC 编译，只把剩下的文件交给自研编译器 |
| arXiv 2607.04697（Agent PR 的合并冲突率）**[研究：摘要]** | 相同 Agent 实例并行工作时，文本冲突率约 **19.8%** |
| 并行加速研究 **[研究：摘要]** | 组件独立的任务加速 11–52%；**强耦合任务每字符反而慢 5.8%** |
| HN 实践者 **[社区：摘要]** | 在对正确性要求高的工作上，2–3 个专注的 Agent 比 6–8 个互相竞争的更可靠；“几分钟的合并冲突处理就可能抵消并行的收益”；评审和编排的认知负担很重 |
| Claude Code 官方 **[一手]** | “同时运行多个会话或子 Agent 会成倍增加 token 用量” |

## 2. Claude Code 的 5 种并行方式（官方文档 [一手]）

| 方式 | 谁来协调 | Agent 之间通信 | 文件隔离 | 状态 |
|---|---|---|---|---|
| **Subagents** | Claude 在一个会话内委派、收集结果 | 只向父会话汇报 | 可以给每个子 Agent 配 worktree | 稳定 |
| **Agent View**（`claude agents`） | 你派发独立任务，回头再看 | 只向你汇报（可用跨会话消息） | 派发后的会话会自动进入独立 worktree | 研究预览 |
| **Agent Teams** | 由 Claude 担任 lead，负责计划、分配和监督 | 队员之间直接发消息，共享任务列表 | **不自动隔离**，需要按文件划分任务 | 实验，默认关闭 |
| **Dynamic Workflows** | 由一个**脚本**持有计划，而不是靠 Claude 一轮轮判断 | 结果之间交叉验证 | — | 稳定 |
| **Projects** | 一个长期对话，在云端开并行线程 | 共享仓库、指令和记忆 | 云端会话 | 公测 |

辅助：`--worktree`、`.worktreeinclude`（指定复制进 worktree 的未跟踪文件）、`worktree.sparsePaths`、跨会话消息、`/batch`（拆成 5–30 个 worktree 子 Agent）。

**怎么选**：
- 支线调查会把主对话塞满 → **Subagent**
- 手上有几个独立任务，想交出去、只在需要时介入 → **Agent View**
- 一个大型迁移或审计，要处理成百上千个文件 → **Dynamic Workflow**（或 `/batch`，或用 `claude -p` 写循环）
- 需要多个 Agent 持续协作讨论 → **Agent Teams**（实验功能，token 消耗大）

## 3. 第三方编排工具

| 工具 | 形态 | 评级 |
|---|---|---|
| [Claude Squad](https://github.com/smtg-ai/claude-squad) | tmux + worktree 的终端 TUI，支持 Claude Code、Codex、Gemini、Aider | 🧪 |
| [Conductor](https://conductor.build) | macOS 桌面应用，每个 Agent 一个 worktree | 🧪 **[二手]** |
| [container-use](https://github.com/dagger/container-use)（Dagger） | 每个 Agent 一个容器加 git 分支 | 🧪（需要隔离运行环境时） |
| [Happy Coder](https://github.com/slopus/happy) | 在手机或桌面上并行控制多个 Claude Code | 👀 |
| [Vibe Kanban](https://github.com/BloopAI/vibe-kanban) | 开源看板 | ⛔ **已宣布停止维护** |
| Cursor 3 Agents Window、Codex 指挥中心 | 厂商内置 | 🧪 |

> 厂商内置的并行能力越来越强，第三方编排工具的生存空间在缩小。先用内置功能，确实不够再考虑第三方。

## 4. 实操建议

1. **只并行彼此独立的任务**：不同模块、不同文件、不同仓库。共享文件多的任务应串行。
2. **2–3 个起步**：先确认自己有足够的评审带宽。
3. **每个 Agent 都要有验证闭环**，否则并行只会更快地制造 bug。
4. **一写一审**：Writer / Reviewer 分在两个会话，比“多个 Writer”更稳。
5. **注意环境成本**：每个 worktree 可能需要重建依赖或缓存（大型 Unity、C++、Node 项目尤其明显），可以用 `.worktreeinclude` 和稀疏检出缓解。
6. **监控成本**：并行成倍消耗额度，可以用 `/usage` 和 `ccusage` 看。

## 来源

- [Run agents in parallel](https://code.claude.com/docs/en/agents)、[Agent teams](https://code.claude.com/docs/en/agent-teams)、[Dynamic workflows](https://code.claude.com/docs/en/workflows)、[Worktrees](https://code.claude.com/docs/en/worktrees)
- [Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)
- HN：[Parallel coding agents with tmux and Markdown specs](https://news.ycombinator.com/item?id=47218318)、[Embracing the parallel coding agent lifestyle](https://news.ycombinator.com/item?id=45489884)、[Multi-agentic software development is a distributed systems problem](https://news.ycombinator.com/item?id=47761625)（摘要）
- [arXiv 2607.04697](https://arxiv.org/pdf/2607.04697)（摘要）
