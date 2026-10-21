# IDE 类工具与其他

> 编辑更新：2026-10-21（UTC+8）；本次补原 CLI 承载与 ACP 迁移的选择，其他产品保留分项[核查日期](../research/2026-10-12-community-source-records.md#ide-页历史页头)。

## 30 秒结论

**✅ 只想集中管理已可验收的 CLI 会话，先保留 CLI，不连 harness 一起换。** 例如 [Zed 的终端线程](#zed)可以只承担整理层；需要集成式 diff、编辑器上下文或交互调试，再试 ACP／原生 IDE Agent。[一手；研究：2026-10代际条件默认]

**⛔ 不因带浏览器或 Agent 面板就迁移。** Agent 应交回能复现问题的实际运行结果，人核兼容与体验；审批、必要工具或恢复链不通，就回到原可用入口。[研究]

## 当前最高水平

<!-- frontier: status=仅候选 gap=2 gen=2026-10 checked=2026-10-21 -->

**当前最佳 IDE／CLI 组合未知，本页推荐属于可行默认。** Zed 团队的[终端线程设计（5-20）](https://zed.dev/blog/terminal-threads)与当前契约，支持“只换组织界面”的候选；8 月的[ACP 撤回反馈](https://github.com/zed-industries/zed/discussions/57402)提示审批接续也是迁移成本。没有同任务成果与人工投入对照，主流采用率未知。[一手：设计；社区：个案；研究：差距2]

**更近的领先实践把真实体验作为反馈，而非把 IDE 当答案。** Wang、Attard 与 Issac G. 在 Anthropic [9-23 工程复盘](https://claude.dev/blog/how-we-made-claude-ai-faster/)中报告：headless 检查未发现真实 Chrome 新标签页的布局变化，员工录屏才补上缺口。采用时先问现有入口能否取回同样证据，这不是 IDE 优于 CLI 的比较。[一手：内部团队自报；研究]

同题选择与试换方法集中在[总览](README.md#当前最高水平先分层再决定迁移)，详细版本、失败分支与未决范围见[研究记录](../research/2026-10-12-community-source-records.md#p54入口选择先分界面harness与执行环境)。[研究]

## Cursor

| 项 | 内容 |
|---|---|
| 形态 | VS Code 分支。**Cursor 3** 是重新打造的、以 Agent 为中心的界面：多仓库工作区、所有本地和云端 Agent 集中在侧栏（包括从手机、Web、Slack、GitHub、Linear 发起的）、本地和云端之间**快速交接**、云端 Agent 会附上演示和截图供你核验、完整的 LSP、内置浏览器、**插件市场**（MCP、Skills、子 Agent，支持团队私有市场）**[一手]** |
| 自研模型 | **Composer 2**（官方称“自家的前沿编码模型，额度高”）**[一手]** |
| 2026-10 新功能 | **Remote Control**：在 Cursor iOS 应用里查看并回复电脑上运行的本地 Agent（Agent 仍在你的电脑上运行；企业版默认关闭）**[一手：changelog 10-06]** |
| 2026-09 新功能 | **Rollouts** 机器人：为每个 PR 写监控计划，按环境跟踪部署健康度，发现回归后可以开回滚 PR；**Security Review** 机器人；Cursor Projects；自托管机器；`/goal`；云端子 Agent 各自运行在独立机器上 **[一手：changelog]** |
| 供模与迁移 | 按实际模型入口、目标任务与合同变化判断，供模过渡及替代路径统一见 [11 §3](../11-community-pulse.md#3-cursor按实际接入路径判断是否迁移)；不把收购新闻或旧口碑当迁移收益证据 **[一手；研究：2026-10-15入口同步]** |
| 评级 | 🧪 **条件试用**：必要路径、费用和数据政策满足时可保留现有工具；出现具体阻塞才比较替代方案，不因旧“已停供／归属不确定”叙述自动迁移 |


## JetBrains（IntelliJ / Rider / PyCharm…）

🧪 **先用覆盖必要路径的现有 IDE 入口，不把同名 Agent 当原 CLI 的透明替代。** AI Chat 集成、ACP Registry／自定义 agent 与独立 Claude Code 插件须分开；Claude Agent 官方页明确它不同于 Claude Code [Beta] 插件。ACP 无需 JetBrains AI 服务订阅，但当前 ACP 文档列 WSL 不支持，这不代表全部 JetBrains 入口或原 CLI 都不能用。**[一手：2026-10-15官方契约]**

Codex 集成可用 JetBrains AI 订阅、ChatGPT 登录或 OpenAI API key；仅 BYOK 路径限定 OpenAI 直接发行的 key。先核目标执行环境、认证及必要命令／插件，满足再替换原路径；原 CLI 已可用而集成缺能力时保留原路径。[官方来源与历史失败](../research/2026-10-12-community-source-records.md#jetbrains同名-agent-不等于原-cli-环境)说明运行时和配置可能不同，未取得当前客户端实测或原用户最终恢复回访。**[一手；社区；研究：采用边界]**

- C# / Unity 项目先沿用能满足当前任务的 IDE、编译与验证入口；确有诊断／调试缺口时再评估 Rider 等现成支持，不因选择某个 Agent 就默认迁移 IDE。见 [Unity 的条件起点](../../domains/game-dev/unity/README.md#一页纸推荐2026-10)。**[研究：入口一致性；未作跨 IDE 效果排名]**

## VS Code + GitHub Copilot（CLI / App / VS Code）

形态：Copilot 现在有 **Copilot CLI、GitHub Copilot 桌面应用、VS Code、JetBrains** 等多个入口，以及把 Issue 指派给 Copilot 的云端 coding agent；指令文件支持 `.github/copilot-instructions.md` 和 AGENTS.md；VS Code 原生支持 Agent Skills。

2026-09 到 10 月的重要更新 **[一手：GitHub Changelog]**：

| 更新 | 说明 |
|---|---|
| **本地沙箱正式可用**（10-07） | Copilot CLI、Copilot 应用和 VS Code 中，Agent 执行的命令受限于开发者或组织定义的策略：可读写的目录、网络、Git 和 GitHub CLI 凭证；基于微软的 MXC，在 Windows、macOS、Linux 上转换为系统原生控制；**企业可以强制开启、开发者无法放宽** |
| **Dynamic workflows**（10-01） | 用代码定义编排：哪些步骤自动执行、哪些交给 Agent、哪些并行，结构化结果在阶段间传递；在 Copilot CLI、Copilot 应用和 Copilot SDK 中可用。和 Claude Code 的 Dynamic Workflows 思路相同 |
| **Computer use**（10-01，公开预览） | 在 macOS 和 Windows 上操作桌面应用（读取界面、点击、输入），用于没有 API、CLI 或 MCP 的旧软件；每个应用都要先批准，组织可以禁用 |
| **HydraFusion**（研究预览） | 出现在模型选择器里，但不是单一模型，而是**编排多个模型**：单模型直接做、便宜模型先做再由质量门决定是否升级到强模型、或者由另一家族的模型做只读评审后修改一次 |
| 模型 | Claude Opus 5.5、Sonnet 5.5、Haiku 5.5，GPT-6 Sol / Luna、GPT-6.1 Sol，Grok 4.7 都已接入 |
| 治理 | 企业托管设置的校验器、用量指标 API（含 PR 评审阶段、CLI 定制）、影响力仪表盘、预算提额申请、OpenTelemetry |

评级：✅ **采用**（VS Code 作为承载各家 Agent 的编辑器）；Copilot 本身 🧪 **条件试用**，按所需 GitHub 能力和实际治理覆盖选择入口。

### Copilot：接入与治理边界

**CLI 不必先付费订阅。** 当前官方套餐包含 Free；本地 BYOK 在组织策略允许时可免 GitHub 账号／登录；未登录时没有 GitHub MCP、Code Search 和 `/delegate`。需要这些能力时另核认证与服务资格；企业托管 BYOK 仍需 Copilot 许可和联网，受管设备的强制组织登录也可能拒绝本地 BYOK。不能把“自带模型”当作完整 GitHub 工作流或组织准入的替代。**[一手；研究：2026-10-16接入选择]**

**团队先核具体客户端、策略和有效设置，再决定采用。** CLI 的 MCP 组织策略在官方概览与参考文档中仍有冲突，不能据品牌或 VS Code 支持就认定 CLI 同样受控，也不能概括为 CLI 没有治理。托管 MCP allow/deny 有明确内建服务器例外；若任务要求全部 MCP 禁用或严格准入，须确认目标版本实际覆盖，不满足就保留已符合要求的入口。原文、固定文档与范围见[接入核查](../research/2026-10-12-community-source-records.md#copilot-cli接入与治理范围)。未运行客户端或验证账户、组织策略。**[一手；研究：采用与撤回边界]**

**观察**：本地沙箱、动态工作流、多模型编排这三项，Claude Code、Codex 和 Copilot 在两个月内都做了类似的东西，**功能趋同还在继续**（见 [00](../00-state-of-ai-coding.md)）。

## Kiro（AWS）

🧪 **条件试用**：需要在实现前审阅、跨步骤保留需求与设计决定时，可试原生规格流程；已有任务与测试足够，就不额外生成三份文档。若文档只是重复已有信息、审阅没有补上实际缺口，退回短说明与现有验证。**[经验：采用与撤回条件]**

官方支持需求先行／设计先行，产出 `requirements.md`、`design.md`、`tasks.md`；修订时需手改或要求 Agent 更新相关文件，再在任务页触发 **Sync Files**。实现发现新约束后仍要确认需求／设计变化并核对受影响任务、代码和验证结果；同步入口及自动勾选不保证语义正确或验收通过。**[一手：官方契约；研究：边界]**

历史小 bug 试用确有文档过重的反例，但不能据此断言当前没有修订能力或仅适合学习 SDD。原文范围、实际维护中的人工澄清案例与未验证项见[规格修订核查](../research/2026-10-12-community-source-records.md#kiro规格修订能力与采用边界)；通用选择见 [07](../07-workflows.md#5-spec-驱动开发sdd)。**[社区；研究：条件试用并非已测收益]**

## Zed

**🧪 只缺会话整理时，先试 Terminal Threads；需要集成编辑／审查时，再试 ACP。** 前者在编辑器内运行原 CLI，后者通过协议承载外部 Agent；换面板不代表换模型。[一手：[终端线程](https://zed.dev/docs/ai/terminal-threads)、[外部 Agent](https://zed.dev/docs/ai/external-agents)；研究：选择]

**终端路径保留 CLI 管理认证、模型、工具与指令的职责。** Zed 自身的 Agent 设置不会自动套用，远程项目读的是远端环境；关闭终端线程也不会存入 Zed Thread History。需要会话恢复时另核 CLI 的恢复路径。[一手：终端线程契约]

**ACP 迁移先验审批能完成，再验配置与历史接续。** [#62788](https://github.com/zed-industries/zed/issues/62788)报告 Zed 1.15.0／macOS 12.3 的 Claude ACP 有审批通知却无可操作卡片；单个历史版本故障不能推出当前全线不可用。若必要审批卡住，就退回原路排查，不靠关闭审批获得表面上的成功。[社区：2026-08-18故障原报；研究：撤回条件]

## 国内工具（面向中文开发者）

🧪 **先按地区、账号和必要功能核资格，再比较续费价与额度。** 免费额度、试用和首期优惠不代表持续工作成本；不满足目标功能或额度需求时，撤回仅凭低标价的选择。以下只补核已有条目的订阅边界，未实测客户端收益；[来源与未决范围](../research/2026-10-12-community-source-records.md#国内工具订阅入口与持续成本)另列。**[研究：选择，2026-10-16]**

| 工具 | 厂商 | 要点与采用边界 |
|---|---|---|
| Trae | 字节跳动 | 国内免费用户受积分约束；[CN计费](https://docs.trae.cn/ide_plans-and-billing)的Lite单月¥49，连续包月每31天¥45，付费新用户首期优惠¥39。国际版按[实际定价入口](https://www.trae.ai/pricing)核套餐与续费；本次可读页与索引中的$3档口径不同，不能据此确认统一最低价 **[一手；研究：入口未决]** |
| Qoder | 阿里巴巴 | [国际版Pro](https://docs.qoder.com/zh/account/pricing)$20/月自动续费；[CN全家桶个人Pro](https://docs.qoder.cn/product-overview/account-and-subscription)¥59/月、需阿里云主账号，RAM子账号不能使用个人付费功能。两者各列2,000 Credits/月，不能按数值相同推断跨区共享或相同工作量 **[一手；研究：范围]** |
| 通义灵码 | 阿里巴巴 | 存量订单须区分CN全家桶、CN原灵码和通义灵码存量；按[官方计费页对应产品线](https://docs.qoder.cn/product-overview/billing-description)核权益，不只凭旧名称购买 **[一手；研究：入口]** |
| CodeBuddy | 腾讯 | 🧪 **按地区与客户端选入口**：CN IDE 用 Ask 问答，需要先审方案时才用 Plan；CN 插件的 Plan 是 Craft 设置，CLI 的 `plan` 不保证只读。先核目标入口的模型与权限，现有路径够用就保留；必要能力或权限条件不满足时撤回该入口选择，不按跨端通用模型名单迁移。[官方契约与范围](../research/2026-10-12-community-source-records.md#codebuddy入口与计划权限) **[一手；研究：条件选择，未实测]** |
| Kimi Code | 月之暗面 | 中国区新套餐Plus ¥99/月起含Code，Go ¥49/月不含；存量资格与用途限制统一见[02 §4](../02-models-and-cost.md#4-国内-coding-plan)，不要按低价会员档推断Code权限 **[一手；研究：入口同步]** |
| Qwen Code | 阿里通义 | 开源，见 [open-source-agents](open-source-agents.md) |

> 国内另一条常见路线是：**Claude Code / OpenCode 这类 harness + 国产模型的 Coding Plan**（GLM、Kimi、MiniMax 等提供与 Anthropic 兼容的接口）。见 [02 模型与成本](../02-models-and-cost.md#4-国内-coding-plan)。

## 来源

- [Meet the new Cursor（Cursor 3）](https://cursor.com/blog/cursor-3)、[Cursor changelog](https://cursor.com/changelog)、HN：[SpaceX 收购 Cursor](https://news.ycombinator.com/item?id=48553224)、[OpenAI 对 Cursor 的决定](https://news.ycombinator.com/item?id=49486172)、[Cursor Origin](https://news.ycombinator.com/item?id=49334209)、[Updates to Bugbot（2026-05）](https://cursor.com/blog/may-2026-bugbot-changes)、[论坛：Bugbot 按量计费的讨论](https://forum.cursor.com/t/the-new-usage-based-bugbot-pricing-punishes-iterative-workflows-and-power-users/161134)、[论坛：成本上涨的讨论](https://forum.cursor.com/t/cursor-costs-are-climbing-without-a-clear-reason/157233)
- GitHub Changelog：[本地沙箱 GA](https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available)、[Dynamic workflows](https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app)、[Computer use](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps)、[HydraFusion](https://github.blog/changelog/2026-09-30-hydrafusion-in-vs-code-and-the-github-copilot-app)
- [What's New in Rider 2026.1](https://www.jetbrains.com/rider/whatsnew/2026-1/)、[Junie 结束 Beta](https://blog.jetbrains.com/junie/2026/06/junie-coding-agent-out-of-beta/)
- [Kiro Feature Specs](https://kiro.dev/docs/specs/feature-specs/)、[修订与 Sync Files](https://kiro.dev/docs/specs/best-practices/)
- [Birgitta Böckeler：Understanding SDD（Martin Fowler 网站）](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- 国内工具：[CSDN：2026 年 7 月国内 Coding Plan 对比](https://blog.csdn.net/zhangay1998/article/details/162555439)、[CSDN：TRAE / Kimi Code / Qoder 实测](https://www.csdn.net/article/2026-08-24/164033550)、[codingplan.org](https://codingplan.org/en)
