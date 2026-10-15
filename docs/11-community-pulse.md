# 11 · 社区脉搏

> 更新：2026-10-15 UTC。[来源与核实范围](research/2026-10-12-community-source-records.md#11-社区脉搏的核实范围)；近期事件与新做法见 [13 前沿雷达](13-frontier-radar.md)。

## 本轮新增：实际工作流与失败案例（2026-10-10）

本轮直接读取的 GitHub 原帖汇总在 [24 社区工作流](24-community-workflows.md)：Superpowers 计划与测试共享盲点、接口修改后的计划漂移；Pi 用户的 Issue 驱动开发、单次硬预算和提示裁剪；BAML 的公开交付与 Ghostty 的维护者责任讨论。单个帖子按作者报告处理，不包装为全社区统计。

2026-10-10 的 HN Algolia 与 Lobsters 请求曾返回代理 403；本轮已读取第 2 节指定的两串 HN 原帖，其余历史社区记录未因此重新核实。

## 1. 已关闭的需求，是否已适合采用

**30 秒结论：issue 关闭只能说明维护者如何处理这项请求，采用判断还要看发布实现与实际入口。** 原来的 2026-10-03 点赞排行没有任务、用户或版本分母，不再据此判断“共同头号痛点”或“两家功能基本趋同”。成本、质量与平台选择回到各自专题。**[研究：撤回范围]**

以 Codex 的[敏感文件排除请求 #2847](https://github.com/openai/codex/issues/2847)为例：

- **实现确实存在。** Windows deny-read 的[固定补丁](https://github.com/openai/codex/commit/46f30d02828bd4c52827e5f0482a6f2a982cce5b)已包含于已发布的 CLI 0.138.0；维护者 6 月因 Beta 权限 profile 已提供该能力而关闭请求，同时说明 App 接入当时仍在完善。**[一手：源码、版本与维护者说明]**
- **关闭后仍有不同入口的反例。** 7 月使用者报告，同机同配置下 CLI 0.145.0 拒绝读取，而 Windows App 26.721.31836 仍读取；这是历史自报，不能当成当前 App 故障已复现。**[社区：原帖后续]**
- **当前采用条件已变化。** 官方现在列出原生 Windows 等平台支持，但权限 profile 仍为 Beta，且旧沙箱配置可能覆盖它的选择。具体如何选、何时暂缓，统一见 [10：Codex 文件排除的采用条件](10-security.md#codex-文件排除的采用条件)。**[一手：当前文档]**

限制：本轮没有当前 App 构建的实际拒绝结果，不把 CLI 发布、旧用户反馈或测试定义外推为所有入口已经修复；[完整证据与反证](research/2026-10-12-community-source-records.md#codex-文件排除从关闭请求到采用条件)另列。

## 2. Claude Code 与 Codex：何时需要第二工具

**30 秒结论：已有工作流能交付，就不因口碑增加第二套工具；遇到具体能力缺口时，再按次试用。** 本页撤回“常见做法是两个都用”作为默认采用理由，也不再把速度、UI 或性价比写成两家的固定强项。**[研究：采用判断]**

重读 [4 月原帖](https://news.ycombinator.com/item?id=47750069)与 [7 月原帖](https://news.ycombinator.com/item?id=48989357)后，能保留的是使用条件，而不是胜负：

- **任务不同，偏好也不同。** [d-lo](https://news.ycombinator.com/item?id=47751351) 说 Codex 更合自己的 CLI 任务管理方式；[beecasthurlbow](https://news.ycombinator.com/item?id=48990675) 的速度感受限定于小型非遗留项目；[aykutulis](https://news.ycombinator.com/item?id=48995909) 则认为复杂系统中 Claude 少返工。这些都是历史作者自述。**[社区：不同作者原帖]**
- **确有交叉使用，尚不证明值得默认双持。** [wek](https://news.ycombinator.com/item?id=48996640) 与 [bicepjai](https://news.ycombinator.com/item?id=48999094) 描述交叉检查，但相关评论未附可追查的漏检、修复与复测产物，也没有单工具对照。评审是否值得加一层，统一按 [09 的采用条件](09-review-and-quality.md#30-秒结论)判断；没有补上实际缺口，就撤回额外层。**[社区／研究：证据范围与建议]**

局限：两串自选回复不能估计采用率，也不能区分模型、harness、提示与任务差异的贡献；[作者、日期与反证](research/2026-10-12-community-source-records.md#历史口碑不能直接推出双工具采用)另列。

## 3. Cursor：按实际接入路径判断是否迁移

**核实：2026-10-15。OpenAI 已宣布拟终止对 Cursor 的供模合同，提出 2026-11-12 作为过渡截止日期；最终日期尚待确认，不保证此前一直可用。** 这是[官方计划与过渡条件](https://help.openai.com/en/articles/20001506-using-openai-models-in-cursor)，不能写成8月已全面停供。**[一手]**

先核自己的必要路径：Cursor 原生模型入口、编辑器内独立 Codex 扩展与本地自带 API key 的支持范围、费用和数据政策不同，不能互当替代。只有所需能力无法满足时才考虑迁移；收购本身、未核的普遍涨价或用户流失不构成迁移依据。未实际验证账户可用性；[来源与入口限制](research/2026-10-12-community-source-records.md#cursor-供模计划与实际入口2026-10-15-补核)另列，成本口径见 [02](02-models-and-cost.md#3-订阅额度与成本控制)。**[研究：采用判断与边界]**

## 4. 生产力证据（来源范围见各行）

| 研究 | 结论 | 证据 |
|---|---|---|
| METR 2025 随机对照试验（2025 年 2–6 月数据） | 资深开源开发者使用 AI 后，完成任务的时间**多了 19%**（置信区间 +2% 到 +39%），但他们**事后认为快了约 20%** | [研究：原文] |
| METR 2026-02 更新（2025-08 开始的新实验） | 原有参与者的耗时变化为 **−18%**（置信区间 −38% 到 +9%，即可能变快）；新招募的开发者为 **−4%**（−15% 到 +9%），**都不显著**。METR 认为数据不可靠：很多开发者不愿意“不用 AI 工作”，30–50% 的人刻意不提交不想手工做的任务；时薪从 150 美元降到 50 美元；同时开多个 Agent 时耗时测不准。METR 判断 2026 年初的提速大概率比 2025 年大，但这组数据只是“非常弱的证据”，正在重新设计实验 | [研究：原文] |
| METR 2026-05 问卷（349 名技术人员，2026 年 2–4 月） | 自报的**价值提升中位数为 1.4–2 倍**，速度提升中位数为 3 倍；回溯 2025-03 约 1.3 倍，预测 2027-03 为 2.5 倍。METR 提醒：问卷通常高估，2025 年的实验里人们平均高估了约 40 个百分点 | [研究：原文] |
| GitClear 2026（厂商公开摘要与图示） | 重复指标上升、移动占比下降可提示抽检；单位与定义冲突不支持直接计算维护成本或 AI 因果，见 [09](09-review-and-quality.md)。另条 2026-01 效率报告未在本轮复核，不据此预测当前团队提速 | [一手：公开材料；研究：边界] |
| 不同实践者的自述 | [《2x, not 10x》作者](https://obryant.dev/p/2x-not-10x/)描述初稿后仍需大量结构迭代；[另一评论者](https://news.ycombinator.com/item?id=49118572)自报评审耗时为手写的2–3倍；[研究任务使用者](https://news.ycombinator.com/item?id=49116268)描述过去不会尝试的任务，也抱怨代码冗长。三者不是同一人的完整成本记录 | [社区：历史原文与原帖] |

**采用判断**：这些研究与自述的任务、样本和收益口径不同，不能据此预测本团队提速。METR 2025 实验中，自评提速与实测方向相反，说明主观感受不能单独承担采用判断。准备改变工作流时，在代表性任务上比较完成质量、返工和总投入；新增环节未补上缺口或成本超过收益，就收窄／撤回。对原本不做的新任务，先验证产物是否有用，不能用任务数量当净收益；也不按单人评审倍率决定手写或免审。[作者与反例](research/2026-10-12-community-source-records.md#实践者倍率分清作者与收益口径)另列，方法见 [09](09-review-and-quality.md) 与 [18](18-team-adoption.md)。**[研究：证据边界；经验：采用判断]**

## 5. 正在被讨论的话题

| 话题 | 主要观点 | 本仓库对应文档 |
|---|---|---|
| MCP 的价值 | 已有 CLI 足够就不新增；缺少状态或受限接口时再试 MCP。凭证权限与进程隔离须单独核对，协议本身不是沙箱 **[一手／经验：见 04]** | [04](04-mcp.md#2-mcp-vs-cli按任务与调用路径选择) |
| SDD 是否是“瀑布回归” | 产出物过重、规格漂移 vs 分钟级反馈 | [07](07-workflows.md#5-spec-驱动开发sdd) |
| 多 Agent 并行是否值得 | 分布式系统问题、评审瓶颈 | [08](08-multi-agent.md) |
| 指令文件有没有用 | 有限样本未检出稳定正确率收益，不等于普遍无效；保留项目特有命令与边界，按正确性、返工和成本判断增删 **[研究／经验：见 03]** | [03](03-context-engineering.md#22-指令文件到底有没有用研究证据) |
| 模型的“性格” | 附和、口头禅、话太多；社区写了专门的提示词来纠正 | — |
| 软件工厂能不能不读代码 | HumanLayer 复盘全自动实验以重写告终 vs “做好 harness 就行” | [13](13-frontier-radar.md#28-harness-engineering之争工程能不能替代读代码)、[14](14-synthesis.md) |
| 记忆还是文档 | 最新任务记录够用就不加记忆服务；确有跨任务检索缺口时，再核来源、失效处理与总成本，持续召回过期决定就撤回 **[经验：见 03]** | [03](03-context-engineering.md#4-跨会话记忆) |
| 人工审批是否可靠 | 模拟审批游戏提示漏判风险，不能据此估计生产漏检率或取消审批；按风险保留审批，并验证权限与环境隔离 **[研究／经验：见 10]** | [10](10-security.md#2-2026-年的真实事件与研究) |

## 6. 社区体验能改变哪些选择

**30 秒结论：不因热帖分数统一降模型档位，不因乐趣争论要求关键模块必须手写，也不因文件格式开放就认定常驻工具容易迁移。** 以下原帖只支持按具体任务检查，不能代表社区共识。**[研究：撤回与采用边界]**

| 选择 | 原帖中可保留的证据与反证 | 本页判断 |
|---|---|---|
| 是否用更便宜的模型 | 同串讨论里，[例行调试使用者](https://news.ycombinator.com/item?id=49999802)报告低档模型够用；[SRE 使用者](https://news.ycombinator.com/item?id=49998245)则区分例行健康检查与动态调查，报告后者有工具使用障碍 | 只为边界清楚的任务考虑降档，遇到诊断或工具障碍就撤回；这些自述没有同任务质量与费用对照，不足以推荐具体型号。正式成本与预算规则回 [02](02-models-and-cost.md#3-订阅额度与成本控制)／[18](18-team-adoption.md) **[社区／研究]** |
| 是否必须亲手写关键模块 | [一位作者](https://news.ycombinator.com/item?id=49980570)担心技能生疏；[另一位作者](https://news.ycombinator.com/item?id=49984233)描述自己定目标、反馈设计而委托实现 | 乐趣与担忧不是长期维护实验，撤回“必须手写”的推论；交付是否可接手按 [09](09-review-and-quality.md) 的质量要求判断 **[社区／研究]** |
| 是否因开放格式采用常驻工具 | [导出 Markdown 的提议](https://news.ycombinator.com/item?id=49903477)没有迁移结果；[另一回复](https://news.ycombinator.com/item?id=49901636)也把可导出作为前提，并指出 API 连接的重要性 | 暂不凭 AGENTS.md、Skills 或 MCP 就承诺低迁移成本；依赖迁移能力时，先核对所需内容能否导出、目标能否接入，权限问题回 [10](10-security.md) **[社区／研究]** |

旧版公司成本新闻、社会事件、产品热度与点数表已删除：它们不提供这里所需的任务结果、预算执行或迁移证据；删除不是对事件真假的裁定。[原帖范围与反证](research/2026-10-12-community-source-records.md#社区体验额度与迁移不能代替采用证据)另列。**[研究：范围]**

## 7. 中文社区：额度与交付自述

**不要根据“额度打六折”或“搭配最划算”升级订阅、换模型。** [额度原帖](https://www.v2ex.com/t/1246316)的第 7 条回复确实自报跨档位、同一模型试用后得到六折判断，但没有公开可复算的任务、前后基线或计量过程；第 8–9 条回复感受相反，第 5 条还报告显示与限额不同步。档位、任务、推理设置和五小时／周窗口不能混为一项额度，百分比变化不能直接换算统一降额或性价比排名。具体预算判断仍回 [02](02-models-and-cost.md#3-订阅额度与成本控制)。**[社区：原帖；研究：撤回范围]**

[团队交付原帖](https://www.v2ex.com/t/1246486)描述成员不理解组件输入输出；回复既有强调理解责任的，也有支持继续依靠 AI 定位的，不再写“回复普遍认为”。这只能提示检查能否解释、修改和接手自己的产物，不能证明 AI 普遍造成技能退化或必须改回手写。**[社区／研究]**

旧版封号原因猜测、会话保留天数、国产组合采用率与未核工具指控已撤下，不作为迁移、备份配置或安全选择的依据；对应契约回 [10](10-security.md) 与 [18](18-team-adoption.md)，本轮不扩展账户事件调查。**[研究：撤回范围]**

## 来源

- [claude-code issues（按点赞排序）](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)、[codex issues（按点赞排序）](https://github.com/openai/codex/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- HN：[Ask HN: Is Codex really on par with Claude Code?](https://news.ycombinator.com/item?id=47750069)、[Ask HN: Claude Code or Codex?](https://news.ycombinator.com/item?id=48989357)、[Claude Code now reads AGENTS.md](https://news.ycombinator.com/item?id=49760187)
- [Cursor 论坛：Pricing megathread](https://forum.cursor.com/t/pricing-megathread-and-q-a/116395)
- METR：[2025 RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)、[2026-02 实验设计更新](https://metr.org/blog/2026-02-24-uplift-update/)、[2026-05 问卷](https://metr.org/blog/2026-05-11-ai-usage-survey/)
- HN（10 月）：[Meta 和微软压缩 Claude 用量](https://news.ycombinator.com/item?id=49997161)、[Vibecoding isn't as fun](https://news.ycombinator.com/item?id=49979306)、[How to keep enjoying programming](https://news.ycombinator.com/item?id=49854875)、[Dots](https://news.ycombinator.com/item?id=49896604)
- [2x, not 10x](https://obryant.dev/p/2x-not-10x/)、V2EX：[额度](https://www.v2ex.com/t/1246316)、[团队失控](https://www.v2ex.com/t/1246486)
