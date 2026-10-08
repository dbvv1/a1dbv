# 09 · 评审与质量

> 核实时间：2026-10-08。

## 1. 质量数据：AI 代码的真实代价

| 来源 | 发现 |
|---|---|
| GitClear × GitKraken《The Maintainability Gap》（2026），分析了 2023–2026 年的 6.23 亿次代码变更 **[一手：厂商报告，相关性]** | 重复代码块 **+81%**（每百万变更行从 40.3 增到 73.0）；同一提交内的复制粘贴 +41%；掩盖错误的代码 +47%；两周内返工 +15%；跨文件函数调用 −35%；重构式移动从占变更行的 13% 降到 **3.8%**（复制粘贴是它的约 5 倍）；对一年以上旧代码的更新 −74%。报告的概括是：默认的 AI 工作流倾向于交付“原子式”代码（只走通主路径、让一个测试通过、关掉一张工单），而复用、整合、暴露错误这些看不见的工作被拖欠了 |
| Faros AI《The Acceleration Whiplash》（2026 Q2，2.2 万名开发者、4,000 个团队、两年遥测）**[一手：厂商报告页，相关性]** | AI 采用度高时：PR 体积 **+51%**、每个 PR 的 bug **+28%**、评审时间中位数 **5 倍**、每个 PR 的事故 **3 倍**、代码返工 **10 倍**；报告称成熟团队也不能幸免，结论和 DORA 2025 相反。注意：厂商在卖相关产品，只读了公开摘要 |
| 开发者调查 **[二手]** | 约 66% 的开发者认为 AI 输出“几乎正确”：好到能合并，又坏到需要返工 |
| Anthropic 长时任务实验 **[一手]** | 模型自评时会“自信地夸奖平庸的工作” |
| *A Few Pages of Markdown*（arXiv 2608.25241，441 个仓库）**[研究：摘要原文]** | 在 Agent 主导的仓库里，没有提交 AI 配置的认知复杂度增幅约是有配置的两倍（+53% 对 +27%），静态分析告警增幅是 1.7 倍（观察性研究） |

**含义**：AI 倾向于**复制而不是复用、新增而不是重构**。评审时要特别关注重复、绕过错误处理、不触碰旧代码的“打补丁”式改动。

**为什么会这样（训练层面的解释）**：HumanLayer 的 Dex 指出，编码模型用“测试过没过”这类快速验证器做强化学习，SWE-bench 类任务的奖励只有“修好了指定问题、没弄坏其他测试”，**糟糕的设计不受惩罚**；可维护性的代价要几周到几年才显现，没有快速判定标准，所以训练不出来。更多评审 Agent 能**抬高下限，抬不高上限** **[社区：原文]**。已有评测在尝试补上这一块（Cognition Frontier Code 惩罚“改动前就不会失败的测试”，并用裁判模型审查 diff）。完整分析见 [14 规律一](14-synthesis.md#1-规律一能力地图就是验证器地图)。

**对评审的启示**：
1. 把评审重心前移到**设计**（类型、接口、调用关系），而不是等 2000 行 diff 出来再看；
2. 让 Agent 按**垂直切片**提交，每次 100–200 行；
3. 测试代码本身要像需求一样认真审。

## 2. 评审手段

### 本地 / 会话内
| 手段 | 说明 | 评级 |
|---|---|---|
| `/code-review`（Claude Code 内置） | 在新鲜上下文里审当前 diff 找 bug；`--max-findings` 控制数量；v2.1.290 起中等 effort 下对 Opus 5.5 / Sonnet 5.5 也会报告清理类问题和违反 CLAUDE.md 约定的问题 | ✅ |
| `/code-review ultra` / `claude ultrareview` | 云端多 Agent 深度评审，会验证发现的问题；CLI 形式可放进 CI | 🧪 |
| `/security-review`、`security-guidance` 插件 | 安全审查；后者在编辑时就提示 9 类常见风险 | 🧪 |
| `/simplify` | 只看复用、简化、效率，不找 bug | 🧪 |
| 自定义评审子 Agent | 按项目规范评审（模板：[code-reviewer](../templates/generic/.claude/agents/code-reviewer.md)） | ✅ |
| **另一家的模型交叉评审** | Claude 写的让 Codex 审，反之亦然 | ✅ |

**评审子 Agent 的提示要点（官方 [一手]）**：只给它 diff 和评判标准，不给实现过程中的推理；明确要求“**只报告影响正确性或违背需求的问题，不报告风格偏好**”。被要求找问题的评审者几乎总能找出点什么，追着每一条改会导致过度设计。

Anthropic 给 Opus 5.5 的评审提示：“Review the diff on this branch against main. **List only problems you'd block the merge for.** For each one, give the file and line, why it's wrong, and how to show it fails.” 有测试者反馈，Opus 5.5 在最低 effort 下找到的 bug 比 Opus 5 在高 effort 下还多，误报也更少 **[一手]**。

### PR / CI
| 工具 | 说明 | 评级 |
|---|---|---|
| [Claude Code GitHub Action](https://github.com/anthropics/claude-code-action) | 在 PR 或 Issue 中 `@claude` 触发；也能做自动评审 | 🧪 |
| Claude Code Code Review（托管） | 多 Agent 自动审 PR | 🧪 |
| Codex `/review`、Codex Cloud | 与 ChatGPT 订阅绑定 | 🧪 |
| Cursor Bugbot / Security Review / Rollouts | Bugbot 2026-05 改为按次计费（约 1–1.5 美元/次），社区不满；2026-09 新增安全评审和部署监控机器人（Teams / Enterprise） | 👀 |
| Codex `@codex review` / `@codex security review` | 可以在 AGENTS.md 里写自定义评审规则 | 🧪 |
| **Codex Security Cloud**（研究预览，2026-09 DevDay） | 扫描已连接的 GitHub 仓库或监控新提交，给出发现、**验证证据**和补丁，再生成草稿 PR | 👀 **[一手]** |
| CodeRabbit、Greptile、Qodo | 第三方评审服务，都有 Claude Code 官方插件 | 👀 |

### 托管多 Agent 评审的实际数据：Claude Code Review

Anthropic 在 2026-03 推出 Code Review 时公布了内部使用的数据 **[一手：厂商自述，内部数据]**：

| 指标 | 数值 |
|---|---|
| 收到实质性评审意见的 PR 比例 | 从 **16%** 提高到 **54%** |
| 被工程师标为“错误”的发现 | **不到 1%** |
| 超过 1000 行的 PR | 84% 有发现，平均 7.5 个问题 |
| 少于 50 行的 PR | 31% 有发现，平均 0.5 个问题 |
| 耗时和成本 | 平均约 20 分钟；每次 15–25 美元，按 token 计费 |

**两个真实例子**：
- Anthropic 内部一个看似常规的单行改动，被标为严重问题：它会让某个生产服务的认证失效；
- TrueNAS 在重构 ZFS 加密时，评审发现**相邻代码里一个早已存在的**类型不匹配，它会在每次同步时悄悄清空加密密钥缓存。

**机制**（官方文档）：
- 多个 Agent 各查一类问题，再由一个**验证步骤**对照实际代码行为过滤误报，然后去重、按严重度排序；
- 严重度分三级：🔴 合并前应修的 bug、🟡 小问题、🟣 这次 PR 之前就存在的 bug；
- check run 永远是中性结论，**不会阻止合并**。要拿它做合并门槛，就在自己的 CI 里解析 check run 输出末尾的 JSON（如 `{"normal": 2, "nit": 1, "pre_existing": 0}`），`normal` 大于 0 就拦下。

**一个旁证**：Intercom 自动批准 19% 的 PR，由破坏性变更导致的停机时间下降了 35%（Anthropic 博客转述，**[一手：厂商自述]**）。

**怎么看这些数字**：
- 它们说明“验证后再报告”的多 Agent 评审能把误报压得很低；
- 但都是厂商自己的数据。“实质性意见比例”衡量的是覆盖面，不等于逃逸缺陷减少了多少；
- 每次 15–25 美元，在“每次推送都评审”的模式下成本会成倍增加。小团队可以先用本地 `/code-review`（订阅内）加关键 PR 手动 `@claude review`。

### 用 REVIEW.md 调教评审

Code Review 会读两个文件 **[一手：文档]**：
- `CLAUDE.md`：新引入的违规按 🟡 报告。如果改动让 CLAUDE.md 的某条描述过时了，也会提示更新文档；
- `REVIEW.md`：只用于评审，直接交给查找和验证问题的 Agent，**比写在长 CLAUDE.md 里更能稳定生效**。

官方总结的高效写法：

| 写什么 | 例子 |
|---|---|
| **重新定义严重度** | “只有会破坏行为、泄露数据、阻碍回滚的才算 Important；风格和命名最多算 Nit” |
| **限制小问题数量** | “每次最多 5 条 Nit，其余在总结里写‘另有 N 条类似问题’” |
| **跳过规则** | 生成代码、lockfile、vendor 目录，以及 CI 已经管的 lint、格式、类型错误 |
| **仓库特有的检查** | “新 API 路由必须有集成测试”“日志里不能出现邮箱、用户 ID、请求体”“查询必须按租户隔离” |
| **证据门槛** | “关于行为的断言必须引用源码的 `file:line`，不能从命名推断” |
| **复审收敛** | “第一轮之后不再提新的 Nit，只报 Important”：防止一行修复被风格问题拖到第七轮 |
| **总结格式** | 开头一行写统计，如“2 个事实问题、4 个风格问题”；没有阻塞问题就直接说 |

REVIEW.md 也要短：越长，关键规则越被稀释。本仓库提供了一个起点：[templates/generic/REVIEW.md](../templates/generic/REVIEW.md)。

> 注意：本地的 `/code-review` 读 CLAUDE.md，**不读 REVIEW.md**；`--fix` 的改动在后台完成，`/rewind` 撤销不了，要用 git 回退。

### 分层评审流水线（推荐）

| 层 | 什么时候 | 用什么 | 拦什么 |
|---|---|---|---|
| 0. 确定性检查 | 每次保存或提交 | 格式化、lint、类型检查、单元测试（Hook 或 pre-commit） | 一切机器能判定的问题。**不要让 AI 评审去报这些** |
| 1. 作者自查 | 推送前 | `/code-review low`（只报最有把握的）；改动大时用 `/code-review high` | 明显的 bug |
| 2. 独立评审 | 开 PR 时 | 托管 Code Review、CI 里的评审 Agent，或另一家模型交叉评审 | 逻辑错误、安全问题、跨文件影响 |
| 3. 人工评审 | 合并前 | 按 [第 1 节](#1-质量数据ai-代码的真实代价)的重点看：设计、重复、被吞掉的错误、测试是否真的在测 | AI 看不出的问题：需求是否理解对了、设计是否合理 |
| 4. 抽样复盘 | 每周或每月 | 抽查已合并的 AI PR、AI 评审漏掉的线上问题 | 校准前三层：把漏网的问题写进 REVIEW.md 或测试 |

这和 Anthropic 内部的做法一致：评审 Agent 职责要窄，**必须证明自己的发现成立**，对自动批准的结果按风险抽样给人复核（见 [10 第 3.4 节](10-security.md#34-参考架构anthropic-如何保护80-代码由-claude-写的开发流程)）。

## 3. 给自己的 AI 配置做评估

改 CLAUDE.md、Skills 或模型后，怎么知道是变好还是变坏？做一个**私有评估集**。

方法（Anthropic《Demystifying evals for AI agents》+ Agent Skills 评估指南 **[一手]**）：
1. **从真实失败中挑 20–50 个任务**（早期 5–10 个也行，因为改动的效果通常很明显）。
2. 每个任务要有**无歧义的通过标准**（两个专家会独立给出相同判定）和**参考答案**（证明任务可解）。
3. 正反都要覆盖：既测“应该这么做”，也测“不应该这么做”。
4. 评判方式组合使用：代码检查（快、客观，但对合理的变体不够宽容）+ 模型打分（灵活但不确定）+ 人工抽检。
5. 区分 **pass@k**（k 次里至少成功一次）和 **pass^k**（k 次全部成功，衡量可靠性）。
6. **读执行记录**：失败到底是 Agent 的问题还是评估本身的问题？
7. 全部通过了说明评估“饱和”，需要加更难的任务。
8. 工具：Claude Code 的 `claude plugin eval`（可对比“没有插件”的基线，并在 CI 里按分数设门槛）。

一个最小的例子见 [19 实测记录](19-experiments.md)。它用 `claude -p --output-format stream-json` 在固定任务上比较三种 CLAUDE.md，每次运行后检查测试是否通过、新增的测试在旧代码上是否真的失败、跑了哪些命令。脚本思路可以直接复用到你自己的仓库。

**评分要看结果，也要看过程**：
- 只看“测试通过”会漏掉很多差异。在实测中，所有条件都修好了 bug，区别体现在**用了什么测试命令、是否装了额外依赖、回归测试放在哪里**；
- 这些信息要从执行记录里提取，也就是 Anthropic 说的“读执行记录”。

## 4. 实践清单

- [ ] 每个 PR 至少一次 AI 评审，加上人工评审
- [ ] 评审重点：重复代码、被吞掉的错误、旧代码是否该改却没改、测试是否真的在测
- [ ] 关键路径用交叉模型评审
- [ ] 维护一个私有评估集，换模型或大改配置时重跑
- [ ] 定期检查 AI 配置本身：`/doctor prompt-audit`、`/skill-doctor`，以及社区 linter [agnix](https://github.com/agent-sh/agnix)、[ctxlint](https://github.com/ctxlint/Ctxlint)

## 来源

- [Faros AI：The Acceleration Whiplash](https://www.faros.ai/research/ai-acceleration-whiplash)（厂商报告页）
- [HumanLayer：Why Software Factories Fail](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md)
- [GitClear：The Maintainability Gap（2026）](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)（二手）
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Agent Skills：Evaluating skills](https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/evaluating-skills.mdx)
- [Code Review for Claude Code](https://claude.com/blog/code-review)（2026-03，内部数据）、[How Anthropic secures its AI-native SDLC](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle)（Intercom 数据）
- [Claude Code：Code review](https://code.claude.com/docs/en/code-review)、[Ultrareview](https://code.claude.com/docs/en/ultrareview)、[Plugin evals](https://code.claude.com/docs/en/plugin-evals)
- [Cursor Bugbot 计费变更](https://cursor.com/blog/may-2026-bugbot-changes)
