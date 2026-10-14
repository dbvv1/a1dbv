# 11 · 社区脉搏

> 核实时间：2026-10-15（UTC+8）仅补核第 1 节的文件排除证据链，撤回旧点赞排行及其推广结论；其他历史内容沿用 2026-10-08 记录，未因此重新核实。
> 数据来源：GitHub issue 区、HN（经 Algolia API 读取原帖和高赞评论）、Lobsters、V2EX、METR 和 GitClear 原始报告，均为直接读取。
> 局限：Reddit 和 linux.do 拦截机房 IP，本轮未覆盖。最近 3 个月的事件和新做法见 [13 前沿雷达](13-frontier-radar.md)。

## 本轮新增：实际工作流与失败案例（2026-10-10）

本轮直接读取的 GitHub 原帖汇总在 [24 社区工作流](24-community-workflows.md)：Superpowers 计划与测试共享盲点、接口修改后的计划漂移；Pi 用户的 Issue 驱动开发、单次硬预算和提示裁剪；BAML 的公开交付与 Ghostty 的维护者责任讨论。单个帖子按作者报告处理，不包装为全社区统计。

HN Algolia 与 Lobsters 本轮请求返回代理 403，以下历史社区记录未因此重新核实。

## 1. 已关闭的需求，是否已适合采用

**30 秒结论：issue 关闭只能说明维护者如何处理这项请求，采用判断还要看发布实现与实际入口。** 原来的 2026-10-03 点赞排行没有任务、用户或版本分母，不再据此判断“共同头号痛点”或“两家功能基本趋同”。成本、质量与平台选择回到各自专题。**[研究：撤回范围]**

以 Codex 的[敏感文件排除请求 #2847](https://github.com/openai/codex/issues/2847)为例：

- **实现确实存在。** Windows deny-read 的[固定补丁](https://github.com/openai/codex/commit/46f30d02828bd4c52827e5f0482a6f2a982cce5b)已包含于已发布的 CLI 0.138.0；维护者 6 月因 Beta 权限 profile 已提供该能力而关闭请求，同时说明 App 接入当时仍在完善。**[一手：源码、版本与维护者说明]**
- **关闭后仍有不同入口的反例。** 7 月使用者报告，同机同配置下 CLI 0.145.0 拒绝读取，而 Windows App 26.721.31836 仍读取；这是历史自报，不能当成当前 App 故障已复现。**[社区：原帖后续]**
- **当前采用条件已变化。** 官方现在列出原生 Windows 等平台支持，但权限 profile 仍为 Beta，且旧沙箱配置可能覆盖它的选择。具体如何选、何时暂缓，统一见 [10：Codex 文件排除的采用条件](10-security.md#codex-文件排除的采用条件)。**[一手：当前文档]**

限制：本轮没有当前 App 构建的实际拒绝结果，不把 CLI 发布、旧用户反馈或测试定义外推为所有入口已经修复；[完整证据与反证](research/2026-10-12-community-source-records.md#codex-文件排除从关闭请求到采用条件)另列。

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
| MCP 的价值 | “MCP 一开始就是个坏主意？” vs “它解决了凭证隔离和工具发现” | [04](04-mcp.md#2-mcp-vs-cli按任务与调用路径选择) |
| SDD 是否是“瀑布回归” | 产出物过重、规格漂移 vs 分钟级反馈 | [07](07-workflows.md#5-spec-驱动开发sdd) |
| 多 Agent 并行是否值得 | 分布式系统问题、评审瓶颈 | [08](08-multi-agent.md) |
| 指令文件有没有用 | 研究显示对正确率影响很小 | [03](03-context-engineering.md#22-指令文件到底有没有用研究证据) |
| 模型的“性格” | 附和、口头禅、话太多；社区写了专门的提示词来纠正 | — |
| 软件工厂能不能不读代码 | HumanLayer 复盘全自动实验以重写告终 vs “做好 harness 就行” | [13](13-frontier-radar.md#28-harness-engineering之争工程能不能替代读代码)、[14](14-synthesis.md) |
| 记忆还是文档 | 记忆插件是“RAG 抽奖”，该沉淀的是仓库里的文档和 lint 规则 | [03](03-context-engineering.md#4-跨会话记忆) |
| 人工审批是否可靠 | 4 万局数据：漏掉 1/3 的威胁；“靠用户永不出错的安全模型从没成功过” | [10](10-security.md#2-2026-年的真实事件与研究) |

## 6. 2026-10 第一周的社区情绪 **[社区：HN 原帖与评论]**

| 话题 | 观点分布 | 对实践的含义 |
|---|---|---|
| **成本清算**（Meta、微软被报道压缩员工的 Claude 用量，HN 287 分） | 从“鼓励 tokenmaxxing”转向“管理层出面控成本” | 团队要有按项目、按人的用量度量，以及硬性上限（见 [02](02-models-and-cost.md#3-订阅额度与成本控制)） |
| **编程还好玩吗**（《Vibecoding isn't as fun as writing code by hand》192 分；Haskell 社区《How to keep enjoying programming in a world of LLMs》353 分） | 两极分化：有人觉得“讨厌的部分一夜之间消失了”，领域专家说“终于能实现以前要雇人才能做的想法”；也有人担心**技能退化**（“连一个很小的项目都突然想不清架构”）；有人预测 12 个月内会回摆到“手写为主 + AI 结对” | 关键模块保持亲手写和亲手读；把 AI 当结对而不是代写，是可持续的折中（见 [14 第 10 节](14-synthesis.md#10-几个反直觉的结论)） |
| **隐私**（Anthropic 向警方报告用户的“日记”内容，829 分） | 一方理解“不报告也会被骂”；另一方提醒“你不是在和秘密好友聊天，而是在和大科技公司聊天”，并转向本地模型 | 敏感内容不要放进云端对话；企业用户要了解数据保留和合规条款（见 [10](10-security.md)） |
| **常驻 Agent 的锁定风险**（OpenAI Dots，769 分） | 担心集成、工作历史都在对方云上，难以迁移；也有人认为多个常驻 Agent 分工协作很有价值 | 配置和知识沉淀在开放格式里（AGENTS.md、Skills、MCP），降低迁移成本 |
| **开源 harness 的数据流向**（DeepSeek Harness，416 分） | 桌面版默认开启遥测，有人给出关闭方法；也有人质疑二进制和插件自更新的安全性 | 安装前看遥测和更新机制；企业环境要有允许使用的工具清单 |
| **欧洲模型**（Mistral Large 4，1997 分） | 欢迎开源权重和欧洲主权；也有人认为进步慢于中美 | 有数据主权要求的团队多了一个开源权重选项 |

## 7. 中文社区（V2EX 直接读取）

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
- HN（10 月）：[Meta 和微软压缩 Claude 用量](https://news.ycombinator.com/item?id=49997161)、[Vibecoding isn't as fun](https://news.ycombinator.com/item?id=49979306)、[How to keep enjoying programming](https://news.ycombinator.com/item?id=49854875)、[Anthropic 报告用户日记](https://news.ycombinator.com/item?id=49961057)、[Dots](https://news.ycombinator.com/item?id=49896604)、[DeepSeek Harness](https://news.ycombinator.com/item?id=49929489)、[Mistral Large 4](https://news.ycombinator.com/item?id=49977979)
- [2x, not 10x](https://obryant.dev/p/2x-not-10x/)、V2EX：[封号](https://www.v2ex.com/t/1246477)、[额度](https://www.v2ex.com/t/1246316)、[团队失控](https://www.v2ex.com/t/1246486)
