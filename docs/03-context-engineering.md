# 03 · 上下文工程

> 核实时间：2026-10-08；2026-10-11（UTC+8；检索截至 2026-10-10 UTC）补充论文版本、记忆/压缩边界与反例。
> 一句话：**先区分需求、环境、模型能力、上下文和验证器问题；上下文应提供必要信息，而非尽可能堆满。**

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

> 2026-10-05 读了原文后修正：上一版根据搜索摘要写的“人写的比 LLM 生成的好，并且对除 Claude Code 外都有提升”，只说对了一部分，下面以原文为准。

| 研究 | 设置 | 发现 |
|---|---|---|
| **Evaluating AGENTS.md**（ETH Zurich 等，arXiv 2602.11988，v3 2026-09） | Claude Code（Sonnet 4.5）、Codex（GPT-5.2 / 5.1 mini）、Qwen Code；SWE-bench Lite 300 题 + 新建的 CTXbench（138 题，来自 12 个**自带开发者手写指令文件**的仓库） | **LLM 生成的文件**：成功率 −0.5% / −2%（不显著），**成本 +20–23%**（显著）。**开发者手写的文件**：平均 +2.4%（p=0.21，不显著），但**显著优于 LLM 生成的**（p=0.038），对 Claude Code 以外的 Agent 都有提升，成本最多 +19%。指令会被遵守（更多测试、更广的探索、更多推理 token），但在该研究设置中**没有观察到仓库概览的可靠收益**（Sonnet 生成的文件 100% 都写了概览）。文件长度没有显著影响。**局限：只测了 Python**，在训练数据较少的语言和工具链上效果可能不同 **[研究：原文]** |
| **Do Context Files Help Coding Agents?**（arXiv 2607.27250，2026-07） | Claude Code + Codex，3 个仓库 17 个任务，288 次运行 | 上下文策略对正确率没有可测出的影响（等价性检验的上界是 10–15 个百分点）；失败原因是**实现能力**而不是缺仓库知识；真实的 AGENTS.md 从未把“差一点”变成“通过” **[研究：摘要]** |
| **On the Impact of AGENTS.md Files on Efficiency**（arXiv 2601.20404，2026-01） | 10 个仓库、124 个 PR，有无 AGENTS.md 对照 | **运行时间中位数 −28.6%，输出 token −16.6%**，完成情况相当 **[研究：摘要]** |
| **Configuration Smells in AGENTS.md Files**（arXiv 2606.15828，2026-07） | 灰色文献综述 + 100 个热门仓库 | 6 种“配置坏味道”，见 2.3 节；**Lint 泄漏 62%、上下文膨胀 42%、Skill 泄漏 35%** **[研究：原文]** |
| **A Few Pages of Markdown**（arXiv 2608.25241，2026-08） | 441 个仓库，RAMP 成熟度模型 | 引入 Agent 后提交数增加 28–38%（与成熟度无关）。但在 Agent 主导的仓库里，**没有提交 AI 配置**的认知复杂度增幅约是有配置的两倍（+53% 对 +27%），静态分析告警增幅是 1.7 倍。73.8% 的配置文件提交后再没改过（“设了就忘”）。属观察性研究，只能作为假设 **[研究：摘要]** |
| **Agent READMEs**（arXiv 2511.12884） | 1,925 个仓库的 2,303 个指令文件 | 指令文件像配置代码一样频繁小改；内容以测试步骤（75.9%）、实现细节（70.8%）、架构（68.1%）为主；**安全（14.8%）和性能（14.5%）很少写** **[研究：摘要]** |

**综合结论**：
1. 指令文件的价值在于**效率**（少走弯路、省 token）、**行为约束**（命令、禁区、非标准约定）和**长期质量**（相关性证据），不能据这些样本保证提高正确率，也不能排除在其他任务中的收益。
2. **不要让 AI 生成后原样提交**：上述研究在其 Python 仓库、模型和任务样本中观察到 LLM 生成文件增加成本而未显著提高成功率，不能外推到所有仓库和最新模型。把 `/init` 产出当草稿，保留可验证改变行为的项目特有信息，再做有无配置的对照。
3. **不要自动复制完整概览、目录树和逐文件说明**。只在它们提供难以从代码发现的信息、并有任务价值时保留；上述研究不构成对所有架构地图的否定。
4. 越是小众的语言或工具链（比如 Unity 特有的编辑器和序列化约定），越值得写进去，因为模型的先验知识更少。
5. 安全和性能这类非功能要求最常被遗漏，值得补上。

**本仓库的小实验**（[19 第 4 节](19-experiments.md#4-e3指令文件长短)，n 很小）**[经验：实测]**：同一个 bug 修复任务，27 次运行**全部成功**，有没有指令文件不影响成败，这和上面的研究一致。但两行的短文件让回归测试从 2/9 提高到 9/9，并让 Agent 用了项目自己的测试命令，成本只多约 6%。LLM 生成的 526 行长文件也改变了行为，但起作用的只是其中“测试怎么加”的一段，成本却是无文件时的 1.6–2.7 倍。

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
- 可机械检查的规则可以接入 Hook，但要验证匹配、错误和替代路径；硬权限由沙箱等运行时边界执行，见 [06](06-hooks-and-guardrails.md)。
- 定期运行 `/doctor prompt-audit`，它会找出“为旧模型写的”提示写法 **[一手]**。典型例子是过度强调和全大写警告：新模型指令遵循更强，这类强调反而容易让它反应过度 **[经验]**。

推荐延伸阅读：[Writing a good CLAUDE.md（HumanLayer）](https://www.humanlayer.dev/blog/writing-a-good-claude-md)，讨论了“指令预算”和渐进式披露。

#### 六种“配置坏味道”（arXiv 2606.15828 [研究：原文]）

| 坏味道 | 表现 | 怎么改 |
|---|---|---|
| **Lint 泄漏**（62%） | 命名、格式、import 顺序、行宽这类 linter 和 formatter 能检查的规则 | 交给 linter、formatter、pre-commit；指令里删掉 |
| **上下文膨胀**（42%） | 文件过长、塞满低优先级细节 | 每个文件不超过 200 行（Anthropic 文档建议）；有个 PR 把 598 行删到 149 行 |
| **Skill 泄漏**（35%） | 只在特定场景用的流程写进了常驻指令 | 拆成按需加载的 Skill |
| **盲引用** | 只写“见 docs/xxx.md”，不说明用途 | 写清楚**为什么、什么时候**去读，否则“Claude 经常会忽略” |
| **初始化化石** | `/init` 生成后从没改过 | 同一错误出现第二次、代码评审发现 Agent 本该知道的事、新人也需要这条信息时，就更新 |
| **指令冲突** | 前后矛盾 | 定期通读，用 `/doctor prompt-audit` 或社区 linter（agnix、ctxlint）检查 |

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

**记忆还是文档？** Kevin Liao 的 [文章](https://liao.gg/blog/agents-dont-need-memory)（2026-10-03，10-05 更新）描述自己的 Operator Memory 和人工整理经验，属于 **[社区：作者实践/产品观点]**，不是独立比较试验；热度不证明效果：
- 观点：记忆插件本质上是“**RAG 抽奖**”，存进去的东西什么时候被召回、召回得对不对都不可控；Agent 真正需要的是**写在仓库里、人也能读的文档**。
- HN 评论的补充：
  - “代码本身就是文档”：好的命名和结构比任何记忆都可靠；
  - 把约定写成 **lint 规则，并附上解释性错误信息**，Agent 犯错的那一刻就能得到原因（比指令文件更及时、更确定）；
  - 用**架构决策记录（ADR）**记下“为什么这样设计”，例如 mattpocock/skills 里的做法。
- **本仓库的判断**：
  - 优先把会话中学到的东西沉淀成**文档、测试或 lint 规则**，它们可评审、可 diff、可回滚，对人也有用；
  - 自动记忆也可以保存有来源、范围和失效条件的工程经验；先做对照，不把一次成功升格为永久规则。Markdown 和数据库都可能陈旧或可审计，取决于实现。
  - 分析见 [14 规律二](14-synthesis.md#2-规律二上下文是预算信息应该拉而不是推)。

### 4.1 先区分三种干预

| 干预 | 保存什么 | 主要验证问题 |
|---|---|---|
| 跨任务记忆 | 以前任务的经验，用于新任务 | 是否真正迁移、是否污染未来任务、维护成本何时回本 |
| 同任务压缩/观察遮蔽 | 当前轨迹的摘要或部分观察 | 约束是否仍在、缓存影响、失败轨迹是否被拖长 |
| 新上下文恢复 | 当前代码 + 权威需求 + 恢复包 | 是否漏掉依赖、重复工作或沿用过期证据 |

三者可以同时存在，不能用其中一项的收益证明另外两项有效。新上下文不等于丢弃代码和证据，数据库也可以给新上下文提供可审计事实。**[经验：实验分类]**

### 4.2 有收益，也有反例：不要只记摘要结论

| 来源与版本 | 本轮读到的关键结果 | 采用边界 |
|---|---|---|
| [Evaluating AGENTS.md v3](https://arxiv.org/html/2602.11988v3)，2026-09-29，附录 B | 在生成上下文后人为移除原有文档，自动生成的上下文反而改善平均成功率 | 信息是否重复影响边际收益；不是建议删真实文档，也不代表当前仓库收益已证明 |
| [The Complexity Trap v3](https://arxiv.org/html/2508.21433v3)，2025-10-27 | SWE-bench Verified 上，Qwen3-Coder 480B 遮蔽旧观察：53.4%→54.8%（+1.4 个百分点，不显著），每题 $1.29→$0.61；Gemini 2.5 Flash thinking 的遮蔽/摘要分别显著下降 4/9 个百分点 | 遮蔽不是普遍无损；窗口和混合策略依模型/harness 调参，统计完整成本而非只数 token |
| [Agent KB v5](https://arxiv.org/html/2507.06229v5)，2025-10-27 | SWE-bench Lite、同为 pass@1、最多 50 次迭代时，GPT-4.1/OpenHands 24.3%→28.3%，SWE-agent 24.3%→31.7% | 有正面工程经验迁移证据；更大的 pass@1→pass@3 headline 不是公平的记忆单变量比较，离线知识构建也有成本 |
| [ContextWeaver v1](https://arxiv.org/html/2604.23069v1)，2026-04-24 | SWE-bench Verified 的同模型构图/执行条件下，Sonnet 4 有提升，GPT-5 与 Gemini 3 Flash 略降；多次运行子集均值差较小 | 图更复杂不等于更好；计入控制器成本，本轮未核实对应开源实现 |
| [Compaction Cliff v1](https://arxiv.org/html/2608.22752v1)，2026-08-24 | 分类保留约束可改善某些下游表现，但依赖分类召回，且部分比较未匹配保留 token 量 | 主要是医疗/零售/航空代理，不是 coding 收益证据；约束仍须真实执行边界 |

表内为 **[研究：相关方法、结果与局限原文]**，不是本仓独立复现。旧模型/Python issue 修复结果不能直接替代当前 Codex 大功能和多日任务测量。可先测简单基线，避免默认引入复杂存储或图控制器。

### 4.3 实际运行中的反例

[OpenHands SDK #4544](https://github.com/OpenHands/software-agent-sdk/issues/4544) 报告（1.42.1，2026-08-19）：规则的“已激活”状态保留，但承载规则的事件被压缩删除，阻止后续再注入。issue 9 月因不活跃自动关闭，不等于已修复。**[社区：单例，有最小探针；本轮未复测]**

截至观察版本 [`c4b93299`](https://github.com/OpenHands/software-agent-sdk/commit/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9)，源码仍保留该故障链：路径规则正文挂在事件 `extended_content`，激活标记按会话去重；压缩删除承载事件却未同步重置标记。更细的差异是 [observation 的字符串转换](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/openhands-sdk/openhands/sdk/event/llm_convertible/observation.py#L68-L86)不带该扩展正文，而 [condenser](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/openhands-sdk/openhands/sdk/context/condenser/llm_summarizing_condenser.py#L247-L251)使用字符串摘要。日志表示不一定等于模型实际输入。**[一手：2026-10-10 UTC 源码复核；未独立运行当前 SDK]**

[PR #4565](https://github.com/OpenHands/software-agent-sdk/pull/4565) 截至核实时仍未合并，提供历史真实模型失败报告及 [固定版本的回归测试](https://github.com/OpenHands/software-agent-sdk/tree/86e067dadd0a2398f6140c9f16220790be38af35/tests/integration/tests)。作者的 Opus 5 运行针对旧 commit，不是本仓复测当前 main；不能把 open PR 当已发布修复。测试的两个重要防假绿条件是：先证明承载事件确实被压缩移出，再区分注入通道中保留或重新出现的标记与摘要偶然回显；标记检查本身不等于完整正文校验。场景没有建立应标无效，不能算复现或通过。**[社区：作者历史实测；一手：未合并测试源码]**

测试不能只问“恢复包存在吗”，还要问当前规则是否实际可见、可重载，最新取消是否仍生效。真实验收应核对实际模型输入或权威来源重载；上游测试只检查特定注入通道的方式不应直接成为所有 harness 的标准。现有恢复清单足够，不为此增加规则登记框架或另一套合成探针。**[经验：采用与不采用判断]**

[PMPA](https://arxiv.org/html/2609.13889v1) 与 [SkillJack v2](https://arxiv.org/html/2608.03509v2) 分别展示了跨会话恶意规则持久化及由污染轨迹产生技能后删除源仍留衍生物的故障方式。**[研究：原文，限定 harness/模型/合成任务]** PMPA 使用替代后端模型和模拟工作区；SkillJack 主要统计路由层面的策略违规代理指标，不是实际外部服务被攻破。不可把这些数字外推为默认 Codex/Claude 产品事故率；但这些故障方式支持将来源信任、授权和记忆召回分开处理。

### 4.4 最小生命周期，而不是无限追加

**[经验：设计建议]** 复用的工程经验至少带来源、适用仓库/模块、观察版本、验证状态和失效条件；发现相反证据时记录替代关系。记忆中的事实不提供新权限，最新的不可信文本也不能覆盖用户约束。

删除/纠正一条事实时，检查派生的摘要、索引和 Skill 是否仍保留旧结论，并测试重启后不会从旧轨迹复活。保持当前任务状态、可复用经验、验收证据和授权依据的区别。

采用门槛：在同模型、工具、预算与时间顺序下，和“新上下文 + 当前仓库 + 短恢复包”比较；把提取、整理、检索、缓存、重试、失败和人工维护全计入。任务完成率不降且总成本确有收益，关键权限/隔离/删除反例通过，才逐步自动化。检索命中率只是诊断指标，不是最终效果。

## 来源

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- 官方文档：[Best practices](https://code.claude.com/docs/en/best-practices)、[Memory](https://code.claude.com/docs/en/memory)、[Large codebases](https://code.claude.com/docs/en/large-codebases)
- Codex `codex-rs/core/src/agents_md.rs`、`codex-rs/config/src/config_toml.rs`
- 论文：[arXiv 2602.11988](https://arxiv.org/abs/2602.11988)（读了正文）、[arXiv 2606.15828](https://arxiv.org/abs/2606.15828)（读了正文）、[arXiv 2607.27250](https://arxiv.org/abs/2607.27250)、[arXiv 2601.20404](https://arxiv.org/abs/2601.20404)、[arXiv 2608.25241](https://arxiv.org/abs/2608.25241)、[arXiv 2511.12884](https://arxiv.org/abs/2511.12884)（读了 arXiv 摘要原文）
- [liao.gg：Agents don't need memory, they need documentation](https://liao.gg/blog/agents-dont-need-memory)（[HN](https://news.ycombinator.com/item?id=49945933)）
- Harness 开销实测：[Systima](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)（72KB 指令文件让每次请求多约 2 万 token）
