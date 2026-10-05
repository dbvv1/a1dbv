# 11 · 社区脉搏

> 核实时间：2026-10-05。
> 数据来源：GitHub issue 区、HN（经 Algolia API 读取原帖和高赞评论）、Lobsters、V2EX、METR 和 GitClear 原始报告，均为直接读取。
> 局限：Reddit 和 linux.do 拦截机房 IP，本轮未覆盖。最近 3 个月的事件和新做法见 [13 前沿雷达](13-frontier-radar.md)。

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

## 2. Claude Code vs Codex：口碑变化 **[社区]**

- 2025 年：Claude Code 被普遍认为明显领先。
- 2026 年 4 月前后的 HN 讨论（“Ask HN: Is Codex really on par with Claude Code?”）：**Claude Code 不再是明显赢家**。
  - 倾向 Codex 的理由：**更快**；话少；“严格按要求做事、不自作主张”；处理 CLI 工具和任务更新更好；**性价比高**。
  - 倾向 Claude Code 的理由：面对宽泛任务时做出的 UI 更好；更像一个“通用 Agent 运行时”（持久会话、后台任务、Skill 体系）。
- 2026-09 新一轮（HN 原帖）：GPT-6 Sol 首发口碑差（有人说相比 5.6 Sol 明显退步，转而只用 Opus 5.5）；Opus 5.5 评价很高（有人放手跑 9 小时，产出 12 个缩短 CI 时间的 PR），但也有“太独立”、在 auto mode 下越权的反馈；GPT-6.1 Sol 主打“接近 Astra 的能力、五分之一的价格”。
- 常见做法：**两个都用**，一个主力，另一个用于评审或处理特定任务。

## 3. Cursor：定价争议与被收购 **[社区]**

论坛中“新定价太离谱”“成本莫名上涨”“Bugbot 按量计费惩罚迭代式工作流”等帖子很多，2026-08 Cursor 还从用量页面和 CSV 导出里移除了费用信息。2026-06 SpaceX 宣布以 600 亿美元收购 Cursor，2026-08 OpenAI 随即停止向 Cursor 提供模型。HN 上的普遍看法是：转卖其他厂商 API 的模式，拼不过有补贴的官方订阅；不少人已经转向 Claude Code 或 Codex。

## 4. 生产力证据（已读原始报告）

| 研究 | 结论 | 证据 |
|---|---|---|
| METR 2025 随机对照试验（2025 年 2–6 月数据） | 资深开源开发者使用 AI 后，完成任务的时间**多了 19%**（置信区间 +2% 到 +39%），但他们**事后认为快了约 20%** | [研究：原文] |
| METR 2026-02 更新（2025-08 开始的新实验） | 原有参与者的耗时变化为 **−18%**（置信区间 −38% 到 +9%，即可能变快）；新招募的开发者为 **−4%**（−15% 到 +9%），**都不显著**。METR 认为数据不可靠：很多开发者不愿意“不用 AI 工作”，30–50% 的人刻意不提交不想手工做的任务；时薪从 150 美元降到 50 美元；同时开多个 Agent 时耗时测不准。METR 判断 2026 年初的提速大概率比 2025 年大，但这组数据只是“非常弱的证据”，正在重新设计实验 | [研究：原文] |
| METR 2026-05 问卷（349 名技术人员，2026 年 2–4 月） | 自报的**价值提升中位数为 1.4–2 倍**，速度提升中位数为 3 倍；回溯 2025-03 约 1.3 倍，预测 2027-03 为 2.5 倍。METR 提醒：问卷通常高估，2025 年的实验里人们平均高估了约 40 个百分点 | [研究：原文] |
| GitClear 2026（6.23 亿次变更，厂商数据） | 重复代码 +81%，重构 −70%（见 [09](09-review-and-quality.md)）；同一家 2026-01 的报告：重度 AI 用户跟自己过去相比只快约 25% | [一手：厂商报告，相关性] |
| 实践者自述 | 《2x, not 10x》：个人实感约 2 倍；评审 AI 代码要花自己写的 2–3 倍时间；真正的增量来自“原本不会动手的项目” | [社区] |

**结论**：
- 可靠的实验数据很少，而且实验本身越来越难做（人们已经不愿意不用 AI）。
- 主观感受系统性偏高，**必须自己度量**：在固定任务上对比，或者看交付周期和缺陷率。
- 收益高度依赖做法：验证闭环、任务拆分、像审同事代码一样审 AI 的代码。

## 5. 正在被讨论的话题

| 话题 | 主要观点 | 本仓库对应文档 |
|---|---|---|
| MCP 的价值 | “MCP 一开始就是个坏主意？” vs “它解决了凭证隔离和工具发现” | [04](04-mcp.md#2-mcp-vs-cli社区争论与数据) |
| SDD 是否是“瀑布回归” | 产出物过重、规格漂移 vs 分钟级反馈 | [07](07-workflows.md#5-spec-驱动开发sdd) |
| 多 Agent 并行是否值得 | 分布式系统问题、评审瓶颈 | [08](08-multi-agent.md) |
| 指令文件有没有用 | 研究显示对正确率影响很小 | [03](03-context-engineering.md#22-指令文件到底有没有用研究证据) |
| 模型的“性格” | 附和、口头禅、话太多；社区写了专门的提示词来纠正 | — |

## 6. 中文社区（V2EX 直接读取）

- **封号**：中文用户频繁遇到 Claude 账号被封（有人用了两年的 Max 订阅号在半夜被封）。社区推测与使用语言、额度用满、作息异常有关，但官方没有解释。实用建议：定期备份 `~/.claude` 下的会话记录（默认只保留 30 天，可以调整）。
- **额度“重置”**：10 月 3 日 Codex 重置后，多人反馈总额度大约打了六折；也有人认为 GPT-6.1 Sol 很耐用，Astra 配合 6.1 Sol 使用最划算。
- **团队失控**：有帖子反映同事“离开 AI 就定位不了问题，说不清组件的输入输出”，回复普遍认为责任在人，团队流程需要随之调整。
- **国产模型 + Coding Plan**：“Claude Code / OpenCode + GLM、Kimi、MiniMax 订阅”很常见；常用 **cc-switch** 在多个服务商之间切换。注意 GLM 官方 Agent ZCode 被曝静默上传 git 历史 **[二手]**。
- 其他讨论阵地：知乎、掘金、linux.do（linux.do 拦截机房 IP，本轮未读）。

## 来源

- [claude-code issues（按点赞排序）](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)、[codex issues（按点赞排序）](https://github.com/openai/codex/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- HN：[Ask HN: Is Codex really on par with Claude Code?](https://news.ycombinator.com/item?id=47750069)、[Ask HN: Claude Code or Codex?](https://news.ycombinator.com/item?id=48989357)、[Claude Code now reads AGENTS.md](https://news.ycombinator.com/item?id=49760187)
- [Cursor 论坛：Pricing megathread](https://forum.cursor.com/t/pricing-megathread-and-q-a/116395)
- METR：[2025 RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)、[2026-02 实验设计更新](https://metr.org/blog/2026-02-24-uplift-update/)、[2026-05 问卷](https://metr.org/blog/2026-05-11-ai-usage-survey/)
- [2x, not 10x](https://obryant.dev/p/2x-not-10x/)、V2EX：[封号](https://www.v2ex.com/t/1246477)、[额度](https://www.v2ex.com/t/1246316)、[团队失控](https://www.v2ex.com/t/1246486)
