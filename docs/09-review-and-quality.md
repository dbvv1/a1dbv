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
| `/code-review`（Claude Code 内置） | 在新鲜上下文里审当前 diff 找 bug；`--max-findings` 控制数量 | ✅ |
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
| CodeRabbit、Greptile、Qodo | 第三方评审服务，都有 Claude Code 官方插件 | 👀 |

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
- [Claude Code：Code review](https://code.claude.com/docs/en/code-review)、[Ultrareview](https://code.claude.com/docs/en/ultrareview)、[Plugin evals](https://code.claude.com/docs/en/plugin-evals)
- [Cursor Bugbot 计费变更](https://cursor.com/blog/may-2026-bugbot-changes)
