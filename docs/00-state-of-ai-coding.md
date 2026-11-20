# 00 · AI Coding 现状总览（2026-10）

> 核实：2026-10-08；2026-10-15（UTC+8）按 03／04／05／08／09／10 已核证据收敛入口建议，补核产品演变、模型分层及生产力依据；代际复核 2026-10-21。评级见 [docs/README](README.md#评级与证据体系)，最近 3 个月的事件、价格与新做法见 [13 前沿雷达](13-frontier-radar.md)。

## 30 秒结论

**✅ 把一个可验收的端到端结果交给 Agent，让它连续实现、自验，人按风险接收。** 给清目标、授权、关键契约和运行反馈，完整小应用或一轮产品改进都可以自主执行；体验由真实使用接收，既有产品迁移还要保住旧用户和下游消费者。

| 你现在要决定什么 | 当前默认 | 何时调整 |
|---|---|---|
| 一次交多大的任务 | 交完整、可验收的结果，不按任务体量设自主上限 | 检查不到目标行为、返工不收敛或结果不明时，补反馈、对账并收紧对应范围 |
| 要不要显式拆多个 Agent | 沿用原生按需委派 | 能扩大证据覆盖、减少主上下文或缩短关键路径时，再并行独立支线 |
| 人在哪一步介入 | 处理价值判断、关键契约、风险与真实结果 | 验收规则本身有争议时接管这个判断，解决后恢复自动实现 |

本文及 [07](07-workflows.md)／[08](08-multi-agent.md)／[14](14-synthesis.md)／[20](20-codex-long-horizon.md) 的“10 月修订／保留”表示建议状态；完整交付与按需并行属于 10 月修订，按反馈收紧范围属于跨代保留。“跨代保留”指仍有理由保留的工程约束，既不是本仓运行新模型的认证，也不是全部产品契约或实测认证。

**依据**：官方文档、团队复盘、公开研究、社区原文与本仓比较，逐节列于节末。以上为研究支持的条件默认，反例与采用条件见下表、14 和 08；核实 2026-10-08（代际复核 2026-10-21）。

<a id="1-格局从补全到agent-舰队"></a>

## 1. 当前最高水平：年初与 10 月到底变了什么

**现在应交完整任务，而不是逐步陪写；要补强的是运行反馈和接收能力。** 年初前沿团队就已这样工作，8–10 月的变化主要是完整产品的跨轮改进、按风险接收，以及原生编排的调整。下表比较前沿团队与实践者，不代表行业普及率；目前没有同任务、同预算的统一自主时长增益。

| 维度 | 2026 年初前沿 | 2026 年 8–10 月可核变化 | 现在的选择 |
|---|---|---|---|
| 人的角色 | OpenAI 2-11 已是“Humans steer. Agents execute.”，人构造目标、环境和反馈 | Claude Code 团队 10-15 按变更风险分审批层；Willison 10-20 少读生成代码但大量试玩 | 人集中于价值、关键契约、风险与实际结果，不必逐步陪写或逐行审完所有改动 |
| 自主时长 | OpenAI 2-11 自报单任务常达六小时以上；Cursor 1-14 的周级项目是多 Agent、多循环 | Willison 8-7 报项目用时 52 分钟，另记人工纠错提示，无人介入连续段未知；10-20 报告玩法改进、Three.js 迁移各过夜一轮 | 允许完整可验收轮次自主执行；记录时分清单次 run、无人介入段和项目日历跨度，不能概括为“小时跃升为周” |
| 并行方式 | Cursor 1-14 已有 planner／worker／judge 与数百并发，按角色选模 | Cursor 9-23 撤掉强鼓励探索子 Agent 的提示；Battle Drones 使用 Claude Code Web Ultracode 动态多 Agent | 沿用当前原生编排，显式拆分要有收益依据；固定角色数不是先进程度 |
| 瓶颈位置 | Cursor 1 月已遇协调与漂移；OpenAI 2 月已把可运行环境、UI 与日志反馈放在核心 | Claude Code 10-15 把验证、风险评审、分阶段发布与回滚连起来；Anthropic 10-16 指出人类注意力瓶颈 | 让 Agent 取得实际反馈，人处理决定与结果取舍，单催生成速度解决不了交付瓶颈 |
| 模型与工具 | Cursor 1 月比较 GPT-5.2／GPT-5.1-Codex／Opus 4.5；Anthropic 2-5 用 Opus 4.6 与 Claude Code | 公开实践用 GPT-5.6 Sol Ultra／Codex Desktop（8-7）、GPT-6 Astra High（10-9）、Opus 5.5／Claude Code Web（10-20） | 按 [02](02-models-and-cost.md) 选起点；表中是来源实际使用的代际，不是型号排名，内部模型也不是公开可用默认 |

本仓已比较代际、整轮自主与生产迁移接收，采用上述条件默认，差距记为 1。**当前最高水平整体、跨任务最优与完整投入仍未知**；领先参照是个人完整游戏的跨轮改进、团队按风险自动验收与发布。Battle Drones 仍由作者试玩修订，音频联机导致不适后加警告并改走网络联机，尚不能作为商业游戏发行认证。年初材料只作时间线基线，五页复核与撤回理由见[研究记录](research/2026-10-12-long-task-evidence.md#2026-10-21范式快照与代际复核)。

**依据**：一手团队自报——OpenAI [harness engineering（2-11）](https://openai.com/index/harness-engineering/)、Claude Code 团队 [10-15 评审](https://claude.dev/blog/solving-code-review-at-anthropic/)、Anthropic [10-16 观察研究](https://www.anthropic.com/research/employment-at-anthropic)、[C 编译器（2-5）](https://www.anthropic.com/research/building-c-compiler)、Cursor [1-14](https://cursor.com/blog/scaling-agents)、[9-23 复盘](https://cursor.com/blog/improved-token-efficiency)；社区作者原文——Willison [8-7](https://simonwillison.net/2026/Aug/7/moonlight-mayhem/)、[10-9](https://simonwillison.net/2026/Oct/9/built-using-my-voice/)、[10-20](https://simonwillison.net/2026/Oct/20/battledrones/)；层级差距为本仓原文比较，详见研究记录。核实 2026-10-15（代际复核 2026-10-21）。

### 整轮自主实现，在哪一步接管？

**✅ Agent 负责把实现修好，人确认哪些行为可以改变、哪些差异可以忽略。** 既有产品升级可以连续实现、自验和修复；一旦修绿需要改权限语义或忽略真实内容差异，就先接收契约修改。争议解决后恢复自动推进，接管的是判断，不是剩余全部编码。

近期 VS Code 的 Copilot SDK 升级给出一条具体路径：目标都是保住原审批行为，完成桌面／远端依赖及宿主验证。

| 路径 | 公开结果 | 可以照做的动作 |
|---|---|---|
| 自动升包、自动修复至可审 | preview.1 的自动 PR #341830 遇门禁／权限回放差异，未发布其候选修复 | 保留可恢复候选与失败原因；先判断权限差异，保住门禁 |
| 同目标，针对争议接管 | #341861 同样升级 preview.1；修窄路径归一化，保留正文差异的负例，最终合入 | 人确认可忽略差异，让 Agent 修实现和测试；这里是回放适配，不是放宽产品权限 |
| 下一轮恢复自动推进 | preview.2 的 #341922 再走自动修复与产品构建，之后经人审合入 | 恢复原门禁下的自动推进，以当前版本的接收结果结束 |

**把等价规则和正反样本一起交给接收器。** 文件路径分隔符可以等价，作者正文里的反斜杠或转义内容仍须区分。比较器若放过错身份、漏事件或正文变化，补上应失败的样本、修正比较器，再核最终版本；暂停使用的是这份接收结果，而不是整轮自主目标。旧版通过、PR 合入、终端用户采用要分别记录。

Shopify 的 Shop 原生迁移展示了同一原则的生产采用：运行比较允许时间戳与页面 UUID 自然变化，同时核事件与页面／实体的关系。**保留行为关系，比要求每次输出逐字相同更有用。** 与 SDK 的窄路径修复一样，可忽略差异应在实现、自验前确定，而不是失败后扩大。

**原生反馈够用就沿用；需要跨端状态与事件比较时，再补窄迁移流程。** Shop 使用定制 Pi 流程，由工程师接收需求与计划；旧用户登录、通知和下游事件连续性都在交付目标内。架构或跨端契约变化先接收设计，既定边界内连续执行。Stephen Toub 的 Copilot runtime 迁移也保留了人对设计与验收的持续判断，实际消费方反馈又触发修订。

这些案例支持“扩大自主实现，同时扩大接收能力”。VS Code SDK 链只追到主干合入；Shop 是生产采用，几者是公开路径比较，不是不同模型的随机对照。

**依据**：本仓 P61 条件默认、比较器采用与撤回判断见[最高水平卡与固定产物](research/2026-10-12-long-task-evidence.md#p61整轮交付与争议接管)；一手团队复盘——[Shop 原生迁移](https://shopify.engineering/shop-app-migration)（2026-09-10）、VS Code Copilot SDK 升级及窄路径修复、Stephen Toub 2026-09-16／09-23 复盘，固定来源见同一记录。核实 2026-10-15。

### 历史入口演变

```
2023  补全 / 聊天          Copilot 补全、ChatGPT 问答
2024  IDE 内 Agent        Cursor Composer、Copilot Edits
2025  终端 Agent           Claude Code、Codex CLI、Gemini CLI；MCP 普及；Skills 出现
2026  Agent 平台化         插件市场、后台/云端 Agent、多 Agent 编排、开放标准收敛、
                          auto mode（分类器参与动作审批）、引擎/平台厂商官方入场
2026 下半年  常驻 Agent      Dots、Claude Projects：有自己云端环境、在对话之间持续工作的 Agent；
                          长驻生命周期与托管入口发展（按角色选模在 1 月已出现）
```

**迁移工具时，逐项核对加载、权限和生命周期。** 功能同名只说明值得比较，实际入口看[指令加载](03-context-engineering.md)、[MCP 工具与权限](04-mcp.md)、[Skill／插件宿主支持](05-skills-and-plugins.md)和[子 Agent 运行形态](08-multi-agent.md)。此前根据历史点赞请求推断“功能趋同”的结论已撤回，原因见 [11](11-community-pulse.md#1-已关闭的需求是否已适合采用)。

**依据**：历史与代际来源见本节五维比较；入口迁移为已有专题的采用判断，核实 2026-10-15（代际复核 2026-10-21）。

<a id="2-九个关键趋势"></a>

## 2. 从趋势到选型：到对应答案核实际入口

<a id="21-开放格式共享内容分别核对入口-"></a>
<a id="22-插件化按新增能力采用-"></a>
<a id="25-上下文按需取回保留必要指导"></a>
<a id="26-官方接口先核覆盖再接入"></a>

**格式可以共享，宿主行为不能假定相同。** 迁移时核 [AGENTS.md 的加载](03-context-engineering.md#21-各工具的加载规则一手)、[Skill／插件权限](05-skills-and-plugins.md#能加载不等于权限语义可移植)和 [MCP 的任务覆盖与结果回读](04-mcp.md#3-按任务选择服务与权限)；官方标签不等于实际覆盖。[游戏引擎接入](../domains/game-dev/01-engine-integration.md)按同一原则验收。

<a id="23-自主性提升审批与隔离分别判断"></a>
<a id="27-不可信输入可信服务也会返回外部内容"></a>

**审批不等于隔离，可信服务返回的文字也不授予权限。** 先核[沙箱和审批](10-security.md)，再决定自动化范围；从[日志、工单或依赖得到的命令](04-mcp.md#日志与工单读取可信服务不等于相信内容)仍须核来源和授权。

<a id="24-长时任务与多-agent"></a>
<a id="28-从会话到常驻完成与恢复需要证据"></a>

**运行更久不等于已经交付。** 按[任务拆分与结果接收](08-multi-agent.md)选择并行，按[长任务恢复和对账](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)核真实结果；要决定先出小样还是先定契约，查[工作流选路](07-workflows.md#5-spec-驱动开发sdd)。

<a id="29-模型分层与harness-engineering之争"></a>

**按任务缺口选模型与评审。** 型号和速度档查[模型选路](decisions/model-roles.md)，有限选项才比较[决策模型](02-models-and-cost.md#21-新类别决策模型2026-09-起)，新增评审按[有效发现与验证成本](09-review-and-quality.md#1-质量数据ai-代码的真实代价)决定。具体版本和实测范围由对应页维护，概览不再另列默认型号。

<a id="5-对个人团队的建议"></a>

## 3. 可直接采用的起点

手头已有真实任务，先按[首页读者地图](../README.md#按目标开始阅读)找对应答案。要决定新流程是否值得换，用[同一真实任务比较质量与总投入](decisions/tool-adoption.md)；要追原理再读[深度分析](14-synthesis.md)。

## 4. 争议（看清再选）

**按任务和可核结果选方案，不必先站队。**

| 争议 | 一方 | 另一方 | 本仓库判断 |
|---|---|---|---|
| AI 到底提效多少 | METR 2026 问卷：技术人员自报价值提升 1.4–2 倍；实践者说“2 倍，不是 10 倍” | METR 2025 RCT：资深开发者慢 19%，却自认为快 20%；2026 后续实验有提速点估计，但选择偏差与计时问题使幅度不可靠，正在调整设计（2026-10-15 补核） | 收益高度依赖使用方式；要自己度量 → [11](11-community-pulse.md#4-生产力证据来源范围见各行) |
| 能不能不读代码（“软件工厂”） | StrongDM：代码不由人写、也不由人审，靠验证体系保证质量 | “四骑士”：slop、疏离、技能退化、团队失和；团队出现“离开 AI 就定位不了问题” | 验证体系要先于“不读代码”；关键模块必须有人真正理解 → [13](13-frontier-radar.md#4-争议与反思) |

**依据**：METR [2026 后续实验](https://metr.org/blog/2026-02-24-uplift-update/)（2026-10-15 补核）；其余争议与采用边界见对应专题。核实 2026-10-15。

## 来源

- Claude Code changelog（v2.1.0–2.1.288）与官方文档 [code.claude.com/docs](https://code.claude.com/docs)
- Anthropic Engineering：[Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode)、[How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)、[Building a C compiler](https://www.anthropic.com/engineering/building-c-compiler)、[Harness design for long-running apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [MCP 2026-07-28 规范发布说明](https://blog.modelcontextprotocol.io/posts/2026-07-28/)、[agentskills.io](https://agentskills.io)、[agents.md](https://agents.md)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- 社区与研究出处见 [11-community-pulse](11-community-pulse.md)
