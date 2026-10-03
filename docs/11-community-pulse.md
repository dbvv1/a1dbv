# 11 · 社区脉搏

> 核实时间：2026-10-03。
> 数据来源：GitHub issue 区（直接读取，**[一手]**）、HN 讨论（通过搜索摘要，**[社区：摘要]**）、厂商论坛、研究报告。
> 局限：Reddit、HN 原帖、X/Twitter 在整理环境中无法直接访问，这部分需要在网络更开放的环境中补充。

## 1. 痛点排行：issue 区点赞数（2026-10-03）

### anthropics/claude-code
| 排名 | Issue | 👍 | 状态 |
|---|---|---|---|
| 1 | Max 订阅瞬间用完额度 | 1498 | 开放 |
| 2 | 2026-03-23 起 Max 计划会话额度异常快速耗尽 | 873 | 开放 |
| 3 | 手机号验证 | 742 | 开放 |
| 4 | “2 月更新后 Claude Code 无法胜任复杂工程任务” | 583 | 已关闭 |
| 5 | 支持 OpenCode 使用 Max 计划 | 410 | 已关闭 |
| 6 | 支持 AGENTS.md | 409 | 已关闭（v2.1.277 实现） |
| 7 | 终端滚动、闪烁（多个相关 issue） | 187–354 | 部分开放 |
| — | “You're absolutely right!”式附和 | 179 | 已关闭 |
| — | 新模型重复的口头禅 | 138 | 已关闭 |
| — | Visual Studio 2026 集成 | 154 | 开放 |

### openai/codex
| 排名 | Issue | 👍 | 状态 |
|---|---|---|---|
| 1 | token 消耗太快 | 630 | 已关闭 |
| 2 | GPT-5.5 下 Plus 计划额度消耗涨了 10–20 倍 | 211 | 已关闭 |
| 3 | Linux 桌面 App | 209 | 已关闭 |
| 4 | macOS Intel 桌面 App | 190 | 已关闭 |
| 5 | GPT-5.5 推理 token 退化 | 188 | 已关闭 |
| — | 子 Agent 支持 | 103 | 已关闭（已实现） |
| — | 排除敏感文件 | 92 | 已关闭 |
| — | 恢复 `/undo` | 87 | 开放 |
| — | LSP 集成 | 68 | **开放** |

### 解读
1. **额度与成本的不可预测性是两家共同的头号痛点。** 订阅制“无限用”的预期和实际额度之间差距很大，而且规则经常变化（促销、高峰时段）。
2. **模型更新带来的质量波动**让用户不安（“2 月更新后无法胜任”“推理 token 退化”）。依赖单一模型的工作流很脆弱。
3. **功能在趋同**：Hooks、子 Agent、Plan 模式、AGENTS.md、ACP 这些高票需求两家基本都实现了。
4. **终端体验**（闪烁、滚动）是 Claude Code 长期的槽点。

## 2. Claude Code vs Codex：口碑变化 **[社区：摘要]**

- 2025 年：Claude Code 被普遍认为明显领先。
- 2026 年 4 月前后的 HN 讨论（“Ask HN: Is Codex really on par with Claude Code?”）：**Claude Code 不再是明显赢家**。
  - 倾向 Codex 的理由：**更快**；话少；“严格按要求做事、不自作主张”；处理 CLI 工具和任务更新更好；**性价比高**。
  - 倾向 Claude Code 的理由：面对宽泛任务时做出的 UI 更好；更像一个“通用 Agent 运行时”（持久会话、后台任务、Skill 体系）。
- 常见做法：**两个都用**，一个主力，另一个用于评审或处理特定任务。

## 3. Cursor：定价争议 **[社区]**

论坛中“新定价太离谱”“成本莫名上涨”“Bugbot 按量计费惩罚迭代式工作流”等帖子很多。Cursor 3 新界面的反馈也褒贬不一。

## 4. 生产力证据

| 研究 | 结论 | 证据 |
|---|---|---|
| METR 2025 随机对照试验 | 资深开源开发者使用 AI 后**慢了 19%**，但他们自己认为**快了 20%** | [研究：摘要] |
| METR 2026-02 更新 | 改变研究设计：30–50% 的受邀开发者拒绝参加“不能用 AI”的组，造成选择偏差；新队列（57 人，800 多个任务）为 −4%（置信区间 −15% 到 +9%） | [研究：摘要] |
| 2026-05 跟进 | 工作流成熟的技术人员自报**产出提高 1.4–2 倍** | [二手] |
| GitClear 2026 | 重复代码 +81%，重构 −70%（见 [09](09-review-and-quality.md)） | [二手] |

**结论**：
- 收益**高度依赖使用方式**：知道什么时候信任、什么时候放慢核对；把任务组织成 AI 有足够上下文的形式；像评审同事代码一样评审 AI 的输出，而不是直接盖章通过。
- **主观感受不可靠**（METR 实验中感受和实测方向相反），需要**自己度量**。

## 5. 正在被讨论的话题

| 话题 | 主要观点 | 本仓库对应文档 |
|---|---|---|
| MCP 的价值 | “MCP 一开始就是个坏主意？” vs “它解决了凭证隔离和工具发现” | [04](04-mcp.md#2-mcp-vs-cli社区争论与数据) |
| SDD 是否是“瀑布回归” | 产出物过重、规格漂移 vs 分钟级反馈 | [07](07-workflows.md#5-spec-驱动开发sdd) |
| 多 Agent 并行是否值得 | 分布式系统问题、评审瓶颈 | [08](08-multi-agent.md) |
| 指令文件有没有用 | 研究显示对正确率影响很小 | [03](03-context-engineering.md#22-指令文件到底有没有用研究证据) |
| 模型的“性格” | 附和、口头禅、话太多；社区写了专门的提示词来纠正 | — |

## 6. 中文社区

- **Coding Plan 价格战**：GLM、Kimi、MiniMax、MiMo 等纷纷推出编程订阅，“Claude Code 加国产模型”是常见组合；GLM Coding Plan 经常限量、很快售罄 **[二手]**。
- 主要讨论阵地：知乎、CSDN、掘金、V2EX、linux.do（本次无法直接访问）。

## 来源

- [claude-code issues（按点赞排序）](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)、[codex issues（按点赞排序）](https://github.com/openai/codex/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- HN：[Ask HN: Is Codex really on par with Claude Code?](https://news.ycombinator.com/item?id=47750069)、[Ask HN: Claude Code or Codex?](https://news.ycombinator.com/item?id=48989357)、[Claude Code now reads AGENTS.md](https://news.ycombinator.com/item?id=49760187)
- [Cursor 论坛：Pricing megathread](https://forum.cursor.com/t/pricing-megathread-and-q-a/116395)
- METR 相关报道：[letsdatascience](https://letsdatascience.com/blog/developers-thought-ai-made-them-faster-the-data-said-otherwise)、[ingenire：METR 2026](https://ingenire.com/blog/metr-2026-developer-productivity-study)（二手）
