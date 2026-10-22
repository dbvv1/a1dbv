# IDE 类工具与其他

> 整页比较更新：2026-10-22（UTC+8）；本次核工作区、审批、恢复与接收。既有套餐及接入资格保留分项核查日期，不作客户端效果排名。

## 30 秒结论

**✅ 保留已能完成任务的入口，缺哪层就补哪层。** 只缺多会话整理，先把原 CLI 放进终端工作台；需要审计划、看 diff 或交互调试，保留有效的 IDE 集成；只关项目窗口，先核现有宿主能否继续；要关闭本机后仍执行，才考虑另一台持续运行的主机或云端，并确认所需工具不依赖本机客户端。[研究：条件默认]

**⛔ 不因“后台、worktree、自托管、支持 ACP”就整套迁移。** 先核实际执行主机、必要审批、失败恢复与最终验收；其中一项不满足，就保留原路或缩小委派。[研究]

Agent负责在目标入口完成同一任务，交回改动、检查和未完成项；人核实际文件状态、必要权限和可体验结果。换面板不能补足缺失的运行环境，也不自动保留原 CLI 的全部能力。[研究]

## 当前最高水平

<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-22 -->

**近期领先机制是持久宿主、可运行环境和可接收的工作状态，而不是统一赢家。** VS Code [8-26 Agent Host](https://code.visualstudio.com/blogs/2026/08/26/agent-host-architecture)把会话生命周期移出单个窗口；Cursor [7-30 工程复盘](https://cursor.com/blog/cloud-agent-environment)先简化启动和长期进程，再接浏览验证。Spotify [8-10 Xirp](https://portal.spotify.com/blog/introducing-xirp)独立展示跨 harness 整理与上下文接续；其自有产品推广不是效果复现。[一手：不同团队自报；研究]

| 主要选择 | 近期领先替代与反例 | 本仓决定 |
|---|---|---|
| 原 CLI、IDE 原生还是 ACP | Zed 分离整理层；Spotify 跨 harness 工作台；Thoughtworks 保留 IDE 监督的采用观察 | 只缺整理不换 harness；需要编辑器监督才试集成，逐项验能力对等 |
| 本地窗口、持久宿主还是云端 | VS Code Agent Host；Cursor 运行环境；独立 Monzo 任务环境 | 先区分关窗口与关主机；必要工具仍依赖客户端时保留该客户端 |
| 并行副本与权限怎样组合 | VS Code 分聊天、worktree、权限与 sandbox；Copilot worktree 有自动批准边界 | 隔离代码与授权分开验；不能为并行便利丢掉任务要求的人工门禁 |
| 怎样减少确认而不失控 | Kiro 本地命令隔离与云端限制；作者 headless 修复后恢复受阻的反例 | 先核实际覆盖和正常／恢复路径；不靠全局跳过批准修集成问题 |
| 接续聊天还是回退实现 | ACP 协商恢复能力；Kiro rewind／checkpoint；Zed 不同历史路径 | 迁移前验内容与文件，不把侧栏条目当完整接续 |
| 何时接收与合入 | Cursor 可运行演示；Shopify River 当前 head、人工接管及撤回 | 接最终树和原验收；证据过期或已有人接管就停止对应自动动作 |
| 规格流程与中文入口值不值得换 | Kiro 规格修订；既有跨地区资格与权限核查 | 只为具体需求／能力缺口试用；中文入口同题最优与整体迁移收益仍未覆盖 |

资料比较覆盖这些主要选择，**当前最佳完整组合、长期人工净收益仍未知**。Anthropic [9-23 真实 Chrome 复盘](https://claude.dev/blog/how-we-made-claude-ai-faster/)也提醒 headless 检查可能漏掉真实客户端变化；需要这类反馈时先补观察，不据此判 IDE 胜 CLI。详细证据与负结果见[P86研究](../research/2026-10-12-community-source-records.md#p86ide入口从功能清单到执行与接收)。[一手／研究；未运行客户端或模型]

## 迁移前验四件事

1. **执行在哪里**：关闭项目窗口、退出应用、断开客户端和关闭主机分别会怎样；构建、浏览器、私网与设备是否仍可达。
2. **审批怎样生效**：核目标 harness、工作区和组织策略；既验正常修改，也验出错后的诊断与获准恢复。
3. **接续什么状态**：聊天内容、代码分支、未提交文件和外部动作分别确认；多个会话是否正在改同一份代码。
4. **接收什么结果**：看实际 diff、未跟踪文件、当前 head 的检查及真实体验；Agent 的完成自报只作线索。

以上用于同一任务的小范围试换，不要求为每个产品新建测试框架。已有结果可复用；必要能力缺失就退回原路，获准修复后再验。[研究]

## Cursor

**🧪 需要独立执行和运行反馈时再试 Cloud Agents，不为侧栏迁移。** Cursor 的工程复盘先处理 Mac／Linux 开发差异，再以统一启动入口和进程 supervisor 减少复杂命令的维护负担；补 Skills 只改善了部分问题。对已有项目，先让目标环境能跑原验收，再判断浏览演示是否补上真实缺口。[一手：7-30内部复盘；研究：不照搬其平台]

### 远程执行为什么值得换：Navan的能力缺口

[Navan 10-16 案例](https://cursor.com/pt-BR/blog/navan)描述从依赖开启桌面会话转向自托管执行；这是供应商客户案例。独立的[Monzo Chip 8-13](https://monzo.com/blog/building-agent-chip)也把任务环境、受控访问和工程师接收放在入口背后。两者确认应按执行缺口试换，没有同题 IDE／CLI 净收益对照。[一手：供应商案例／独立团队自报；研究]

**自托管只解决明确的运行位置需求。** 当前[运行位置文档](https://cursor.com/docs/cloud-agent/self-hosted/choose-runtime)把 checkout 和工具执行放到自有硬件，agent loop 与推理仍在 Cursor 云端；要求全部数据不出域时，这不构成满足条件的证明。[一手：10-22契约]

My Machines 的在线和环境健康由使用者维护，Team Pools 还增加镜像、容量与重置责任。托管环境已经满足资源与数据要求，就不先建机器池；特殊系统、硬件或不可达资源确有需求时再承担这层维护。[一手；研究]

## JetBrains（IntelliJ / Rider / PyCharm…）

**🧪 需要 IDE 语义、调试和审查时先保留现有工程入口，分清 AI Chat 集成、ACP 与独立插件。** [Claude Agent](https://www.jetbrains.com/help/ai-assistant/claude-agent.html)与独立 Claude Code Beta 插件不是同一路径；[ACP 当前文档](https://www.jetbrains.com/help/ai-assistant/acp.html)仍列 WSL 不支持，不能外推为所有 JetBrains 入口都不可用。[一手：10-22核]

**先检查真正传入的上下文和排除规则。** 当前[Codex](https://www.jetbrains.com/help/ai-assistant/codex-agent.html)／Claude 集成的自动上下文是当前文件与选区，不是所有打开文件；两页均说明不遵循 `.aiignore`。Agent应核目标文件与诊断，人核数据边界；依赖该排除保证时不要直接迁移。[一手；研究]

认证、运行时与必要命令仍按[既有接入核查](../research/2026-10-12-community-source-records.md#jetbrains同名-agent-不等于原-cli-环境)分路径判断。C#／Unity项目也先沿用能完成编译和验证的 IDE，确有缺口再比较 Rider 等支持，见[Unity条件起点](../../domains/game-dev/unity/README.md#一页纸推荐2026-10)。[研究；未作跨IDE效果排名]

## VS Code + GitHub Copilot（CLI / App / VS Code）

**✅ 已有 VS Code 工作流可先保留；是否用 Copilot、Claude 或 Codex 另核 harness 与有效策略。** 当前[Agent Host](https://code.visualstudio.com/docs/agents/concepts/agent-host)能让会话跨窗口接续，本地模式仍须应用和主机保持运行；客户端贡献的工具也可能随客户端断开而不可用。[一手：10-22契约]

**并行前同时选代码隔离与批准方式。** 当前[审批文档](https://code.visualstudio.com/docs/agents/run/approvals)明确 Copilot harness 的 Worktree sessions 使用 Allow all。需要人工确认的任务不能默认选这组；先选实际满足门禁的工作区／harness。sandbox 是另一层边界，不覆盖所有工具。[一手；研究]

[会话管理](https://code.visualstudio.com/docs/agents/run/sessions/manage-sessions)允许同一工作树内多个聊天；fork对话也不自动分离代码。Agent开工先核分支与当前改动，人确认并行任务不会互相覆盖；不能把第二个标签页当隔离副本。[一手；研究]

### Copilot：接入与治理边界

**按目标客户端和组织有效设置采用。** Free、BYOK、企业托管与 GitHub 能力不是同一资格，见[已有接入核查](../research/2026-10-12-community-source-records.md#copilot-cli接入与治理范围)。严格MCP准入还须核CLI的具体覆盖及内建服务器例外，不满足就保留原合格入口。当前 VS Code 托管 Copilot 策略生效时，Claude／Codex harness 可能被禁用，不用另一家同名集成绕过策略。[一手：当前审批文档；研究]

**评审按钮不是文件写入闸门。** [Review and revert](https://code.visualstudio.com/docs/agents/run/review-code-edits)说明相关入口已直接落盘，Local 的 pending／Keep是评审状态。Agent交回全部修改与未跟踪文件，人对当前树复验；checkpoint也不撤销部署和网络等外部状态。[一手；研究]

## Kiro（AWS）

**🧪 规格有助于跨步骤保留决定时采用，不把三份文档当目标。** 原生需求／设计／任务及 Sync Files 可保留；实现出现新约束后仍核受影响需求、代码和检查。额外文档不改变决定时，退回短说明；依据见[规格修订核查](../research/2026-10-12-community-source-records.md#kiro规格修订能力与采用边界)。[一手／社区／研究]

**当前 Kiro 也要按执行位置和门禁选。** [云会话](https://kiro.dev/docs/cloud-sessions/)可跨 IDE／CLI／Web接续，服务端克隆仓库，不上传本地工作副本；现有限制却不提供 Supervised 或逐修改批准。需要这类人工门禁时保留符合要求的本地路径。[一手：10-21更新，10-22核]

**本地命令隔离先看有效状态与覆盖。** [10-14工程说明](https://kiro.dev/blog/local-sandboxing/)提出用 OS 边界减轻审批疲劳；[当前契约](https://kiro.dev/docs/sandbox/)只覆盖 shell 子进程，stdio MCP需另启包装，内建文件工具及远程MCP不在其中。显示 Unavailable 时不能当已隔离。[一手；研究]

**回聊天与回文件是两件事，支持入口也不同。** [能力表](https://kiro.dev/docs/checkpoints/)中，IDE提供checkpoint，CLI提供rewind；CLI checkpoint仅列为v2实验功能，Web／Mobile均不支持两者。rewind只分叉对话，checkpoint回文件与上下文；后者不跟踪bash／MCP改动，并可能覆盖已快照文件上的后续人工修改，回退前先核Git diff和外部状态。[一手：10-22核；研究]

异步改代码还要验失败恢复。作者公开的[Kiro headless实验](https://github.com/nobu-13/article06-kiro-agentic-cicd/tree/0148056517d95cb4dad354e93c26e6e67ab11403)报告误写后连诊断命令也受阻；本仓只核公开配置及汇总，原始轨迹未公开。它支持预演必要恢复路径，不证明增加护栏一定提升成功率。[社区：9月作者实验；研究]

## Zed

**🧪 只缺会话整理，先试 Terminal Threads；需要结构化编辑／审查才试 ACP。** [终端线程](https://zed.dev/docs/ai/terminal-threads)由Zed整理，认证、模型、工具和指令由原CLI管理；远程项目用远程环境。关闭线程不进入Zed Thread History，另验CLI恢复。[一手；研究]

**ACP先验协商能力，再验真实审批和接续。** [v1规范](https://agentclientprotocol.com/protocol/v1/session-setup)的历史加载是可选能力；[权限流程](https://agentclientprotocol.com/protocol/v1/tool-calls)也依赖客户端实现和设置。Agent应在允许的测试任务完成取消／继续，人核内容和配置；支持协议不等于原CLI完整对等。[一手；研究]

[#62788](https://github.com/zed-industries/zed/issues/62788)的历史审批卡缺失报告当前仍Open，无关联修复；范围限所报1.15.0／macOS 12.3。必要批准不能完成就退原路排查，不据此判当前全线失败，也不称已修复。[社区：10-22复核]

**接续要看内容，不只看条目。** native-agent的退出落盘修复与Terminal Threads由CLI管理历史是不同路径；[原采用和维护链](../research/2026-10-12-community-source-records.md#p82独立层的采用与维护责任)不合并成统一恢复保证。[一手／社区／研究]

## 国内工具（面向中文开发者）

🧪 **先按地区、账号和必要功能核资格，再比较续费价与额度。** 免费额度、试用和首期优惠不代表持续工作成本；不满足目标功能或额度需求时，撤回仅凭低标价的选择。以下只补核已有条目的订阅边界，未实测客户端收益；[来源与未决范围](../research/2026-10-12-community-source-records.md#国内工具订阅入口与持续成本)另列。**[研究：选择，2026-10-16]**

| 入口 | 先核什么 | 不满足时怎么办 |
|---|---|---|
| Trae、Qoder／通义灵码、Kimi Code | 地区、账号类型、存量／新套餐及实际 Code 权益；资格和续费回[原核查](../research/2026-10-12-community-source-records.md#国内工具订阅入口与持续成本)及[02](../02-models-and-cost.md#4-国内-coding-plan) | 不把同名、相同 Credits 或首月价当跨区等价；先保留已有合格入口 |
| CodeBuddy | CN IDE 的 Ask／Plan、插件 Craft 和 CLI `plan` 分开核；CLI 计划模式不保证只读 | 需要只读规划时选确实符合边界的模式，见[原契约核查](../research/2026-10-12-community-source-records.md#codebuddy入口与计划权限) |
| Qwen Code | 自选服务商、工具协议及维护成本 | 回[开源 Agent](open-source-agents.md)比较，不因免费或同模型就换入口 |

> 国内另一条常见路线是：**Claude Code / OpenCode 这类 harness + 国产模型的 Coding Plan**（GLM、Kimi、MiniMax 等提供与 Anthropic 兼容的接口）。见 [02 模型与成本](../02-models-and-cost.md#4-国内-coding-plan)。

## 接收与长期维护

**把“可演示”接到当前代码上。** [Shopify River](https://shopify.engineering/river-vulnerability-remediation)在rebase后弃用旧head的绿CI，遇人工接管交回维护者，并撤回需求不成立的补丁。迁移时借这些接收规则，不照搬它的专用平台。[一手：9-02独立团队自报；研究]

保留原任务的测试、实际使用路径和后续修改要求，比较适配、等待、人工复核与返工。新入口未补足缺口或维护负担抵消收益就撤回；没有同题完整投入数据时，不把更多PR、截图或会话数写成效率优势。[研究]

## 来源

本页决定性原文、作者、时间、读取范围和被排除的评测，集中见[P86证据记录](../research/2026-10-12-community-source-records.md#p86ide入口从功能清单到执行与接收)。套餐、模型与一般工作流分别回[02](../02-models-and-cost.md)、[01总览](README.md)和[20](../20-codex-long-horizon.md)，避免在入口页维护第二份名单。
