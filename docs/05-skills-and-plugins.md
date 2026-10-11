# 05 · Agent Skills 与插件

> 核实时间：2026-10-08。规范依据 [agentskills/agentskills](https://github.com/agentskills/agentskills) 仓库文档原文 **[一手]**。

## 1. Agent Skills 规范要点

```
skill-name/            # 目录名必须与 name 字段一致
├── SKILL.md           # 必需：YAML frontmatter + Markdown 指令
├── scripts/           # 可选：可执行脚本
├── references/        # 可选：按需读取的参考资料
└── assets/            # 可选：模板、资源
```

| 字段 | 必需 | 约束 |
|---|---|---|
| `name` | ✅ | 不超过 64 字符；只能用小写字母、数字和连字符；不能以连字符开头或结尾，不能出现连续连字符；**必须与目录名一致** |
| `description` | ✅ | 不超过 1024 字符；写清“做什么 + 什么时候用”，包含触发关键词 |
| `license` | | 许可证名或许可文件 |
| `compatibility` | | 不超过 500 字符；说明环境要求（目标产品、系统依赖、网络等） |
| `metadata` | | 任意键值对 |
| `allowed-tools` | | 预授权工具，空格分隔（实验性） |

**渐进式披露的三个阶段**：发现（只加载 name 和 description）→ 激活（读取完整 SKILL.md）→ 执行（按需运行脚本、读取参考文件）。所以装很多 Skill 也只占很少的上下文。

**Claude Code 的扩展字段** **[一手]**：`disable-model-invocation`（只能手动调用）、`user-invocable: false`（只给模型用）、`context: fork` + `agent`（在子 Agent 里运行）、`paths`（按文件 glob 自动激活）、`effort`、`model`、`arguments`、`hooks`；正文可以用 `$ARGUMENTS`、`${CLAUDE_SKILL_DIR}`，以及 `` !`cmd` `` 动态注入命令输出。注意 Claude Code 中 description 加 when_to_use 合计超过 **1536 字符会被截断**。

## 2. 写好 Skill（规范仓库的最佳实践 [一手]）

### 从真实经验提炼
- 从一次**亲手完成的任务**中提取：哪些步骤有效、你纠正过 Agent 什么、输入输出长什么样、你补充了哪些项目特有的背景。
- **只写 Agent 不知道的**，它已经知道的不要写。

### 控制力度
- **按脆弱程度决定写多细**：可以有多种做法时给自由并解释原因；操作脆弱、顺序重要时写成明确步骤。
- **给默认选项，不给选项菜单**；写步骤，不写空泛声明。
- 加一节 **“Gotchas（坑）”**；需要固定格式时给**输出模板**。

### description 怎么写
- 用祈使句，比如“Use this skill when…”。
- 写用户的意图，而不是实现细节。
- **宁可“积极”一点**：列出适用的场景，包括用户没有直接点名这个领域的情况。

### 脚本设计（给 Agent 调用的脚本）
- 不要交互式提示；提供 `--help`；错误信息要有用。
- **结构化数据输出到 stdout，诊断信息输出到 stderr**。
- 幂等；遇到含糊的输入就报错，不要猜；支持 `--dry-run`；**不同错误用不同的退出码**。
- **控制输出大小**：很多 harness 会把超过 1 万到 3 万字符的输出截断。
- 一次性命令要**固定版本**（`npx eslint@9.0.0`）。

### 评估
- 先写 2–3 个测试用例：提示词要多样、真实，至少包含一个边界情况。
- **对比“有 Skill”和“没有 Skill”**：两边都通过的断言不宜用于夸大增益，但必要的业务与安全底线仍要保留。只在候选方案通过的结果是改进线索，还需重复运行排除偶然性。**[经验：工程建议，参考官方评估指南]**
- 测触发效果：准备“应该触发”和“不应该触发”的查询，多跑几次；按 60/40 划分训练集和验证集，避免过拟合。
- Claude Code 中：`/skill-doctor` 查成本和使用率；`claude plugin eval` 跑评测。

完整的任务选择、对照、留出集、原始产物和人工复查方法见 [20 评估 Agent](20-agent-evaluation.md)，按真实任务决定是否需要增加流程。本轮重新读取的官方评估指南见 [S2](research/2026-10-10-audit.md)。

## 2.5 主力 Codex：Skill 应补什么，又可能增加什么

OpenAI 官方 [skill-creator](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.system/skill-creator/SKILL.md) 明确写着 “Default assumption: Codex is already very smart”，要求只增加模型不具备的上下文，按任务脆弱性选择自由度，并把参考资料按需加载。这里支持的是**领域知识、可靠脚本、特定工具契约与真实约束**；不等于官方保证任何短 Skill 都更有效。**[一手：固定提交，2026-10-10 读取；研究：解释]**

但官方出品也必须逐项检查。[gh-fix-ci](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/gh-fix-ci/SKILL.md) 提供 GitHub Actions 日志定位脚本与字段兼容方法，同时明确要求先出计划、经显式批准再实施，并将外部 CI 提供商排除。✅ 日志定位方法值得借鉴；🧪 完整 Skill 是否适合日常自主修 CI，取决于你是否需要这个人工关口。如果用户已授权修复且希望持续执行，不能仅凭“官方”二字认定该流程匹配。研究这个文件不代表已在本会话调用它。**[一手；研究：采用判断]**

Superpowers 的轻量分支也要和入口规则一起看：[using-superpowers](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/using-superpowers/SKILL.md) 要求哪怕仅 1% 可能相关也先调用 Skill，并要求未 brainstorm 时在进入 Plan 前调用 brainstorming；后者又允许清楚的小任务直接执行、用户跳过问题。因此准确判断是：**存在广泛触发与额外衔接的可能，同时存在跳过路径**，不是所有任务都必跑全套，也不是有轻量路径就没有额外成本。**[一手；研究：配置分析，未测延迟]**

✅ 选择原则：优先采用减少重复摸索的具体资源；若 Skill 引入额外提问、确认、委派或评审，明确它解决哪个已观察到的失败。不要把 token 长度当成唯一成本——要求多等一轮人的短指令也可能比长参考资料更打断工作。删掉步骤时仍需保留范围与失败反馈，见 [Codex 续接反例](research/2026-10-10-codex-continuity.md)。**[研究：采用判断]**

对“是否真的有用”，还应检查运行环境：官方合作示例中，独立工具循环与 Codex 收到的 server instructions 不同，结果也不同；但其评分器又漏检答案数值和调用顺序。本轮已重评记录并运行定向反例，见 [插件评估核对](research/2026-10-11-codex-cookbook.md#5-插件评估真实环境更有意义但评分器仍要核查)。✅ 验证实际安装与行为，不只拿 Skill 文本单独问模型打分。**[研究]**

## 3. 插件与市场

插件 = Skills + Subagents + Hooks + MCP +（可选）LSP、Output style、Mods 的打包。

```bash
# Claude Code
/plugin marketplace add <owner>/<repo>
/plugin install <plugin>@<marketplace>
# Codex
codex plugin marketplace add <owner>/<repo>
codex plugin add <plugin>@<marketplace>
```

### Claude Code 官方市场（315 个插件）里值得关注的 [一手]

| 类别 | 插件 | 评级 |
|---|---|---|
| **代码智能** | `typescript-lsp`、`pyright-lsp`、`gopls-lsp`、`rust-analyzer-lsp`、`csharp-lsp`、`jdtls-lsp`、`kotlin-lsp`、`clangd-lsp`、`swift-lsp`、`php-lsp`、`ruby-lsp`、`lua-lsp` | ✅ 强类型项目必装 |
| **Anthropic 官方工作流** | `code-review`、`code-simplifier`、`pr-review-toolkit`、`feature-dev`、`commit-commands`、`claude-md-management`、`claude-code-setup`、`hookify`、`security-guidance`、`claude-security`、`skill-creator`、`plugin-dev`、`mcp-server-dev` | 🧪 按需 |
| **方法论** | `superpowers`、`mattpocock-skills`、`ralph-loop` | 🧪 见下文 |
| **文档 / 检索** | `context7`、`serena`、`lumen`（本地语义代码搜索） | 🧪 |
| **浏览器** | `playwright`、`chrome-devtools-mcp`、`browser-use` | 🧪（Web 项目） |
| **评审 / 安全** | `coderabbit`、`greptile`、`qodo`、`semgrep`、`sonarqube` | 👀 |
| **游戏引擎** | `unity`、`unreal-engine-skills-for-claude-code` | 见 [domains](../domains/README.md) |

### 方法论类插件

| 名称 | 是什么 | 评价 |
|---|---|---|
| [Superpowers](https://github.com/obra/superpowers) | 一整套开发方法论：头脑风暴出 Spec → 分块评审设计 → 写一份“连缺乏判断力的新手都能照做”的计划 → 子 Agent 驱动开发并逐个评审 → TDD、系统化调试、worktree、完成前验证 | ⛔ **暂缓设为全局默认**；🧪 有明确流程缺陷再试。强 Agent 已具备的规划、验证能力不必重复叠加；当前版本也提供轻量分支。见 [23 的配置分析与采用判断](23-community-workflows.md#本仓库判断强-agent-的默认基线应更轻) |
| Ralph Wiggum 循环（官方 `ralph-loop`） | “Ralph 就是一个 bash 循环”：用 Stop hook 拦住退出，把同一个提示反复喂给 Agent，直到输出约定的完成标记 | 🧪 **试用**：适合有明确、可机器检查的完成条件的任务；**一定要设 `--max-iterations`** |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin)（Every） | 把每次犯的错沉淀成经验和规则 | 👀 思路很好 |
| [gstack](https://github.com/garrytan/gstack)（Garry Tan） | YC 总裁的个人“软件工厂”配置 | 👀 学习参考 |

> ⚠️ **插件、Skill 本质上是给 Agent 的可执行指令加脚本**。官方建议：只从可信来源安装，安装前审阅内容（尤其是脚本依赖和让 Agent 访问外部网络的指令）。社区有扫描工具：[NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector)，以及用于锁定 Skill 版本的 [SkilLock](https://github.com/skills-lock/skil-lock)。

## 3.5 Skill 正在变成跨平台的“知识分发格式”（2026 下半年）

| 平台 | Skill 的形态 | 来源 |
|---|---|---|
| Claude Code / Claude API | `SKILL.md` 文件夹；API 的 Skills 已结束 beta；Managed Agents 可以在会话开始时从 GitHub 仓库根目录的 `.claude/skills` 加载 | **[一手]** |
| OpenAI | Agents API / Responses 支持 Skills；ChatGPT 插件把工具、Skill 和界面扩展打包在一起；Claude Code 插件也可以提交到 OpenAI 的插件目录 | developers.openai.com、learn.chatgpt.com **[一手]** |
| Unity | 官方插件 33 个 Skill；`npx skills add Unity-Technologies/skills` 给其他 Agent 安装 | **[一手]** |
| Unreal | 除了给 Claude Code 的 3 个 Skill，**引擎内部还有一套 Agent Skill**（Python 类或 UAsset），编辑器里的 Agent 通过 `AgentSkillToolset` 发现，“项目 Skill 优先于通用默认做法” | Epic 插件源码 **[一手]** |
| Roblox | Studio MCP 提供 `skill` 工具，按需返回调试、设备模拟等参考资料 | **[一手]** |

**Epic 给 Skill 作者的六条原则**（`unreal-skill` Skill，适用于任何平台）**[一手]**：
- **Novel**：只写 Agent 不知道、用工具也查不到的东西；
- **Collegial**：像给懂行的同事做简报，而不是写文档；
- **Flexible**：概念解释和步骤说明按需混合；
- **Durable**：不要写会变的属性名和工具名，否则改名后会悄悄失效；
- **Agnostic**：不提编排系统、角色名、模型名；
- **Parsimonious**：每个 token 都有成本，“删掉不会被想念的句子”。

这和 [03](03-context-engineering.md) 的研究结论一致：**只写 Agent 猜不到的、写错代价大的**。

## 4. Skill、MCP、Subagent、Hook、CLAUDE.md 怎么选

| 你遇到的情况 | 加什么 |
|---|---|
| Agent 把某个约定或命令搞错了两次 | CLAUDE.md / AGENTS.md 加一行 |
| 第三次粘贴同一段操作流程 | **Skill** |
| 总在从浏览器复制 Agent 看不到的数据 | **MCP**（或 CLI） |
| Agent 为找一个符号读了很多文件 | **LSP 插件** |
| 某个支线任务的输出淹没了对话 | **Subagent** |
| 某件事必须每次都发生 | **Hook** |
| 第二个仓库也要用同一套配置 | 打包成**插件** |
| 想要固定的回答风格或长度 | **Output style** |

（改编自 Claude Code 官方文档《Extend Claude Code》 **[一手]**）

## 来源

- [agentskills.io 规范](https://agentskills.io/specification)、[规范仓库 docs/skill-creation](https://github.com/agentskills/agentskills/tree/main/docs/skill-creation)
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Code Skills 文档](https://code.claude.com/docs/en/skills)、[Extend Claude Code](https://code.claude.com/docs/en/features-overview)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)、[anthropics/claude-code/plugins](https://github.com/anthropics/claude-code/tree/main/plugins)
- [obra/superpowers](https://github.com/obra/superpowers)、[hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
