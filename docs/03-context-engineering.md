# 03 · 上下文工程

> 核实时间：2026-10-03。
> 一句话：**模型能力已经够强，效果差多半是上下文的问题。给少了它会猜，给多了它会分心。**

## 1. 原理（Anthropic《Effective context engineering》，2025-09 [一手]）

| 概念 | 含义 | 实践 |
|---|---|---|
| **Context rot** | token 越多，模型越难准确召回其中的信息，所有模型都有这个现象 | 上下文是有限资源，要“花得值” |
| **注意力预算** | Transformer 的两两注意力是 n² 关系，长上下文会摊薄注意力 | 每加一段内容，都要问它值不值 |
| **系统提示的“高度”** | 太具体（if-else 式）会脆弱，太抽象又没有指导性 | 给启发式规则和原因，不要给死规则 |
| **工具** | 自包含、容错、用途清晰；工具集要精简 | 见 [04 MCP](04-mcp.md#4-写好给-agent-用的工具) |
| **示例** | 几个多样、典型的示例胜过一长串规则 | 给 Agent 指一个“照着这个写”的现成文件 |
| **即时检索** | 只保存轻量的标识（路径、查询、链接），需要时再加载 | `@file` 精确引用；用 LSP 代替整文件阅读 |
| **压缩** | 接近上限时高保真地总结历史 | `/compact 保留XX`；在 CLAUDE.md 里写明压缩时要保留什么 |
| **结构化笔记** | 把进度和决策写到上下文之外的文件 | `PROGRESS.md`、feature 清单（JSON） |
| **子 Agent** | 在干净的上下文里做专项任务，只返回 1–2k token 的摘要 | 检索和评审交给子 Agent |

## 2. 指令文件：CLAUDE.md / AGENTS.md / 规则文件

### 2.1 各工具的加载规则（[一手]）

| 工具 | 文件 | 规则 |
|---|---|---|
| Claude Code | `CLAUDE.md`（托管 / 用户 / 项目 / 本地）、`.claude/rules/*.md`（`paths:` glob） | 只有 AGENTS.md、没有 CLAUDE.md 时读 AGENTS.md；两者都有时默认只读 CLAUDE.md（可设置为两者都读）；子目录文件按需加载 |
| Codex | `AGENTS.md`、`AGENTS.override.md` | 从项目根到当前目录逐级收集；总上限 32 KiB；可配置备用文件名 |
| Gemini CLI | `GEMINI.md`（可配置为其他文件名） | — |
| Cursor / Copilot / OpenCode 等 | AGENTS.md（另有各自的规则格式） | — |

**跨工具推荐做法**：
- **只用 AGENTS.md**（Claude Code 现在也会读）；或者
- 以 `CLAUDE.md` 为主，在其中写 `@AGENTS.md` 导入，Claude 专属内容写在下面（本仓库模板采用这种方式）。
- 规则很多的团队可以用 [rulesync](https://github.com/dyoshikawa/rulesync) 从一个源头生成各工具的配置 **[一手：README]**。

### 2.2 指令文件到底有没有用？（研究证据）

| 研究 | 发现 |
|---|---|
| *Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?*（arXiv 2602.11988，2026-02） | **人写的**比 LLM 生成的效果好（4 个 Agent 都是）；Agent 会遵循其中的指令，表现为更多测试、更广的探索；但作为“仓库概览”效果不好，总体只有边际作用 **[研究：摘要]** |
| *Do Context Files Help Coding Agents? A Two-Agent Ablation Study*（arXiv 2607.27250，2026-07） | 不同上下文策略对**正确率**没有可测出的影响（等价性检验把影响限定在 10–15 个百分点以内）；Agent 失败的原因是实现能力（设计、模式选择、接线），而不是缺少仓库知识；真实的 AGENTS.md 从未把一次失败变成成功 **[研究：摘要]** |
| 另一项研究 | 有 AGENTS.md 时，运行时间中位数降低 29%，输出 token 减少 17% **[研究：摘要]** |
| *A Few Pages of Markdown*（arXiv 2608.25241） | 提交了 AI 配置的仓库在引入 Coding Agent 后质量成本更低 **[研究：仅标题]** |

**结论**：
1. 指令文件的主要价值是**效率和行为约束**（用什么命令、遵守什么约定、别碰什么），而不是让 Agent“更聪明”。
2. **别让 AI 生成它，然后原样提交**。`/init` 生成的只是草稿，必须人工删减。
3. 不要写成仓库介绍。“文件逐个说明”这类内容，Agent 自己读代码就能得到。

### 2.3 写什么、不写什么（官方最佳实践 [一手]）

| ✅ 写 | ❌ 不写 |
|---|---|
| Agent 猜不到的命令（构建、测试、单测怎么跑） | 读代码就能知道的东西 |
| 与默认习惯不同的代码风格 | 语言的标准约定 |
| 测试方式与首选的测试运行器 | 详细 API 文档（给链接） |
| 仓库礼仪（分支命名、PR 约定） | 经常变化的信息 |
| 项目特有的架构决策 | 长篇解释、教程 |
| 开发环境的坑（必需的环境变量等） | 文件逐个说明 |
| 常见陷阱、反直觉的行为 | “写干净的代码”这类空话 |

- **检验标准**：对每一行问“删掉它，Claude 会不会犯错？”不会就删。
- **规则被忽略** → 通常是文件太长、重点被淹没；`IMPORTANT` 只给最关键的一两行用。
- **何时该加一行**：同一个约定或命令被 Agent 搞错**两次**。
- **必须执行的规则**写成 Hook，而不是写在这里（指令文件是建议，Hook 是强制）。
- 定期运行 `/doctor prompt-audit`，它会找出“为旧模型写的”提示写法 **[一手]**。典型例子是过度强调和全大写警告：新模型指令遵循更强，这类强调反而容易让它反应过度 **[经验]**。

推荐延伸阅读：[Writing a good CLAUDE.md（HumanLayer）](https://www.humanlayer.dev/blog/writing-a-good-claude-md)，讨论了“指令预算”和渐进式披露。

### 2.4 大仓库 / Monorepo（官方指南 [一手]）

| 需求 | 做法 |
|---|---|
| 只加载当前模块的约定 | 子目录 CLAUDE.md，或 `.claude/rules/` 加 `paths:` |
| 排除无关包的 CLAUDE.md | `claudeMdExcludes` |
| 不让 Agent 读构建产物、生成代码、第三方依赖 | `permissions.deny` 里加 `Read(...)` 规则 |
| 符号定位 | 装 LSP 插件，代替全文搜索 |
| worktree 太大 | `worktree.sparsePaths` 稀疏检出 |
| 跨仓库 | `--add-dir` / `additionalDirectories` |
| 规模化分发约定 | 做成内部插件市场里的插件 |

## 3. 会话层面的上下文管理

| 动作 | 时机 |
|---|---|
| `/clear` | 换不相关的任务时（**最被低估的命令**） |
| 重开会话 | 同一问题纠正两次还没好时，带着教训写个更好的提示重来 |
| `/compact <要保留什么>` | 长任务中途 |
| `/rewind` → Summarize from here | 只压缩部分历史 |
| `/btw` | 问一个不想进入上下文的小问题 |
| 子 Agent | 需要大量读文件的调查 |
| `--continue` / `--resume` + `/rename` | 把会话当分支管理 |

## 4. 跨会话记忆

| 方式 | 说明 | 评级 |
|---|---|---|
| 进度文件 + git log | Anthropic 长时任务 harness 的做法：`claude-progress.txt` 加 feature 清单（JSON，因为模型不太会乱改 JSON） | ✅ |
| Claude Code auto memory | Claude 自动记录偏好和纠正，按仓库存储 | 🧪（定期审阅它记了什么） |
| Gemini CLI 的 memory 收件箱 | 记忆要经人审阅后才生效 | 🧪 |
| 第三方记忆 MCP（MAMA、Selvedge、roampal 等） | 方案很多，质量参差不齐 | 👀 |

## 来源

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- 官方文档：[Best practices](https://code.claude.com/docs/en/best-practices)、[Memory](https://code.claude.com/docs/en/memory)、[Large codebases](https://code.claude.com/docs/en/large-codebases)
- Codex `codex-rs/core/src/agents_md.rs`、`codex-rs/config/src/config_toml.rs`
- 论文：[arXiv 2602.11988](https://arxiv.org/abs/2602.11988)、[arXiv 2607.27250](https://arxiv.org/abs/2607.27250)、[arXiv 2511.12884](https://arxiv.org/abs/2511.12884)、[arXiv 2608.25241](https://arxiv.org/abs/2608.25241)（均通过搜索摘要获取，未读全文）
