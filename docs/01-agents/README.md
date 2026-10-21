# 01 · Coding Agent 对比与选型

> 编辑更新：2026-10-21（UTC+8）；本次比较交互界面、harness 与执行环境，产品配置保留各项原核实日期。

## 30 秒结论

**✅ 默认保留已能稳定达标的入口与配置；没有既有工作流时，按下面三类起步。** 这是本仓库建议，不是产品出厂默认或效果排名；先确认账号、客户端与服务商实际提供该型号。**[研究：采用判断；模型依据见 [02](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)]**

| 任务 | 入口与具体配置 | 交给 Agent 的完成目标 |
|---|---|---|
| 本机仓库里的日常功能、补测试、小改动 | **Codex CLI**：在项目目录启动 `codex --model gpt-6.1-sol -c 'model_reasoning_effort="medium"'`（只覆盖本次启动）；已有 Claude Code 工作流则用 `claude --model claude-sonnet-5-5 --effort medium`。核会话实际模型／effort，沿用项目权限与检查 | 实现目标、跑相关检查、交回 diff 和真实结果；补一个失败路径或边界用例 |
| 困难跨模块重构、疑难 bug，或明确要求旧调用方兼容、边界覆盖 | 保留上述本机入口；**Codex 选 GPT-6 Astra + Light（CLI 配置值 `low`）**，或 **Claude Code 选 Opus 5.5 + `medium`**，验证要求高可从 `high` 起。只有检查深度不足时，先试原模型 `medium` → `high` | 复现问题、查受影响调用方、保持旧契约；再做一次代表性的后续修改，检查改动是否仍局部可控 |
| 不依赖本机资源，希望关机后继续的仓库任务 | **Codex Cloud**：选择已发布环境；没有就先准备仓库、依赖和检查并核结果后发布。模型仍按上两行，不因“长任务”升最高档 | 在云环境实际跑同一验收，再交回可审改动；本机 VPN、浏览器登录或设备是必要条件时，留本机入口 |

**[一手：[Codex 模型](https://learn.chatgpt.com/docs/models)、[单次 CLI 覆盖](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)、[Claude 模型／effort](https://code.claude.com/docs/en/model-config)、[云环境与本机边界](https://learn.chatgpt.com/docs/environments/modes)；研究：任务分流与质量目标，2026-10-20 核，未运行客户端／模型]** 已有 IDE、桌面或 Claude 云端路径能完整验收，就继续用，不为统一入口迁移；其他具体入口见下表。

**人检查目标、兼容行为和验收覆盖，UI／手感亲自体验。** Agent 可能漏调用方、只满足现有测试，或在资源不可达时给出完成自报。必要资源／数据边界不满足就撤回该入口；更强配置未改善质量，或等待、费用与返工抵消收益，就退回原配置。质量目标明确时可预先升档，不必等一次失败。**[研究：风险与撤回；见 [09](../09-review-and-quality.md)、[22](../22-agent-evaluation.md)]**

**⛔ 不以更换 Agent、全程 Ultra 或整套插件作为起手式。** 只为具体能力缺口或质量目标加最小补充；例如缺浏览器验证先补验证入口，而不是只换模型。**[研究：采用边界，见 [05](../05-skills-and-plugins.md)]**

## 当前最高水平：先分层，再决定迁移

<!-- frontier: status=仅候选 gap=2 gen=2026-10 checked=2026-10-21 -->

**当前最佳入口未知；本页保留可验收的原方案，属于可行默认。** 近期领先参照包括 Google 10-13 的[生产 profile 驱动改稿](gemini-cli.md#当前最高水平)和 Anthropic 9-23 的[真实客户端验证](ide-and-others.md#当前最高水平)；两者支持补运行证据，尚未给出原生 CLI、IDE 与开源 harness 的完整迁移收益对照。主流采用率也未知。[一手：团队自报；研究：差距2]

**同一个已有 Web 仓库，修复用户可见问题并保留原验收，先问缺口在哪一层。** 以下是同题的机制比较，不是把不同团队的成绩拼成排名。[研究]

| 缺口 | 最小改变 | 必须保留／新增的验收 |
|---|---|---|
| 只缺会话整理、切换与通知 | 保留原 CLI；可试 [Zed Terminal Threads](ide-and-others.md#zed)，只换交互界面 | 原 CLI 的有效配置、测试与恢复仍可用 |
| 需要逐段审查、交互调试或编辑器上下文 | 试 IDE 原生或 ACP 集成；ACP 是宿主桥接，不是新模型 | 必需工具、审批可完成，原指令实际加载，后续修改能接续 |
| 需要自选模型、改工具循环，或把重复质量要求变成可执行反馈 | 先核现有 harness 能否补足，再试[开源入口](open-source-agents.md#当前最高水平) | 比较模型与 harness 的组合，计入适配、隔离与升级维护 |
| 必须脱离本机继续执行 | 换到确有独立执行环境的路线 | 必要依赖、数据与同一验收能在远端运行；桌面后台不等于云端 |

**换路也可以由新质量目标触发，不必等旧测试失败。** Shopify 的 [Helix（9-21）](https://shopify.engineering/helix)将既有应用的行为和同状态画面变成迁移反馈；若原入口能承载所需检查，先补循环而非换品牌。评审无新增发现时应收敛，不能照搬无限重试。[一手：团队实践；研究：与[复审反例](../09-review-and-quality.md)比较]

**三层可以组合。** IDE 可以承载原 CLI，开源 harness 也能接 IDE 或在远端运行；[Zed 两条路径](https://zed.dev/docs/ai/terminal-threads)与[Google 入口指南（6-10）](https://cloud.google.com/blog/topics/developers-practitioners/choosing-your-surface-antigravity-20-antigravity-cli-antigravity-ide-or-antigravity-sdk)给出这样的职责划分，而不是三种互斥产品类别。[一手；研究]

**试换时保留同一仓库基线、任务与验收，再加一次后续修改。** Agent 交回补丁、检查结果和可体验页面，人核兼容、失败覆盖及体验；比较主动工时、等待、费用、返工和配置接续成本。必要审批／工具无法完成，或新增质量／能力收益不足以抵偿迁移与维护投入，就退回原路；这是待执行的比较方法，非本仓实测。[研究；证据与未决项见[研究记录](../research/2026-10-12-community-source-records.md#p54入口选择先分界面harness与执行环境)]

## 选型建议

| 你的任务或约束 | 起点 | 何时增加或换路 |
|---|---|---|
| 复杂、长程、跨模块修改 | ✅ 沿用可验收的 **Codex／Claude Code** 入口；困难任务按顶部 Astra／Opus 起点，保项目检查 | 当前入口无法完成必要操作，或同题比较显示质量／后续修改／总投入有明确收益时再换；见 [15](../15-task-playbooks.md)与[22](../22-agent-evaluation.md) **[研究]** |
| 已有 JetBrains 工程，需要 IDE 上下文 | 🧪 先核 AI Chat／ACP 能否覆盖必要操作 | 平台、认证或工具路径不兼容时再退回 CLI；CLI 能运行不保证 IDE 集成同配置可用，见 [JetBrains 边界](ide-and-others.md#jetbrainsintellij--rider--pycharm) **[一手；研究]** |
| 任务可脱离本机，想减少占用与等待 | 🧪 评估 Codex 云端任务／Claude 云端入口 | 先确认依赖和验收能在该环境运行；需要本机资源时按下方[环境表](#对比矩阵终端--通用-agent)选择 **[研究]** |
| 等待或预算已成为瓶颈 | 🧪 在当前入口对比候选模型 | 按同一验收分别记录质量、等待、费用与主动工时，再决定是否连 Agent 一起换，见 [02](../02-models-and-cost.md) **[研究]** |
| 高风险改动，需要第二意见 | 🧪 增加针对明确风险的新上下文评审 | 用新增有效发现与误报核查成本决定保留；同模型与跨模型均可能共享盲点，见 [09](../09-review-and-quality.md#2-评审手段) **[研究]** |
| 需要自选服务商或本地模型 | 🧪 从 **OpenCode／Qwen Code／Goose** 中选能接所需协议的入口 | 先核工具调用与任务质量，再承担模型服务、适配和升级维护，见 [开源 Agent](open-source-agents.md)与[本地模型](../02-models-and-cost.md#5-本地--开源权重模型) **[一手；研究]** |
| 代码或任务数据必须留在内网 | 👀 先核模型端点、联网工具与扩展的数据路径 | 只有可部署、可约束且能验收的组合才进入试用；OpenCode 的具体反例见[下文](#本地模型与数据边界) **[一手；研究]** |
| 考虑 Google 编码入口 | 🧪 先核 **Gemini CLI** 认证／合同；个人入口另评估 **Antigravity CLI** | 不再依据旧个人免费额度新采用 Gemini CLI；API／旧企业合同与迁移条件见 [接入选择](gemini-cli.md#1-基本情况)及[深页](gemini-cli.md) **[一手；研究]** |
| 愿意自己定制 harness 并维护隔离 | 🧪 **Pi** | 默认启用 4 个工具，可扩展 MCP／codemode；按进程权限运行，隔离需另设，见 [固定来源](../research/2026-10-12-community-source-records.md#2026-10-15-选型补核默认工具不是成本或隔离边界) **[一手；研究]** |
| 新项目需要持续的模型／接口适配 | ⛔ 暂缓新采用 **Aider** | 既有核查中 main 末次提交为 2026-05-22；较新模型配置不等于稳定版发布。已有稳定工作流可继续用，见 [维护边界](../research/2026-10-12-community-source-records.md#2026-10-15-aider维护节奏与模型兼容分开判断) **[一手；研究]** |

## 对比矩阵（终端 / 通用 Agent）

这里比较**会改变入口选择的条件**。模型名、订阅资格与插件数量回深度页维护，避免用一个功能勾选推定适合所有客户端。**[研究：组织原则]**

| 必须满足什么 | Codex | Claude Code | Gemini CLI／开源入口 |
|---|---|---|---|
| 使用本机文件、应用与设备 | 先核 CLI／桌面入口及当前连接，见 [形态与入口](codex.md#1-形态与入口) | 本机 CLI／Remote Control；Projects 的本机资源另选相应线程，见 [深页](claude-code.md) | 按本机进程、IDE 宿主或扩展实际可见资源核查 |
| 在独立环境中执行 | 云端任务可用复用环境；模型并行条件见 [模型选择](codex.md#2-模型按任务与实际用量选择) | Web／Projects 等云端入口，先确认依赖和必要工具可用 | 自行搭环境会增加运维责任，先核产品支持路径 |
| 限制文件与网络访问 | 按实际平台核沙箱与审批 | 按实际平台核沙箱与审批；auto 边界见 [06](../06-hooks-and-guardrails.md#4-auto-mode实测数据) | Gemini CLI 需[显式启用并核隔离范围](gemini-cli.md#沙箱启用与隔离范围)；其他工具逐项核查 |
| 出错后恢复改动 | 按实际入口留检查点，见 [恢复边界](codex.md#4-优势与短板) | checkpoint／`/rewind`，范围见 [深页](claude-code.md) | Gemini 的 [rewind／restore](gemini-cli.md#恢复范围)不同；OpenCode 的 [undo／redo](open-source-agents.md#opencode规划与撤回边界)依赖 Git 与快照 |
| 任务确实需要语义导航 | [LSP 边界](codex.md#lsp修复反馈与语义操作不能混为一谈)按客户端／扩展核查 | 官方插件需要服务器二进制，官方云会话不启动，见 [05](../05-skills-and-plugins.md#3-插件与市场) | 回对应深页核必要操作与版本，不仅看“支持 LSP” |

**[一手：各深页所引官方文档与固定源码；研究：入口选择]** 表中“恢复”只应按已核范围使用；例如 OpenCode 文件快照不会替你撤销外部服务副作用，详见[固定实现反例](../research/2026-10-12-community-source-records.md#opencode规划权限与文件恢复分开选择)。

### 本地模型与数据边界

**需要内网处理时，先选可约束的完整组合，再考虑开源 Agent 品牌。** OpenCode 官方支持本地模型，企业文档也提供内部 AI gateway 的采用路径；这支持把它列为候选，但没有替读者验证目标部署的数据边界。**[一手：[模型](https://opencode.ai/docs/models/)、[企业部署](https://opencode.ai/docs/enterprise/)；研究：采用判断，2026-10-17 核]**

**反例：模型在本机，工具仍可联网。** 官方工具文档列出 `webfetch`；固定提交 `f40dc433` 的实现先检查该工具对目标 URL 的权限，再发出 HTTP 请求。这条路径独立于模型推理端点；是否调用取决于任务与有效权限，不能据此声称默认上传代码。**[一手：[工具文档](https://opencode.ai/docs/tools/#webfetch)、[固定源码](https://github.com/anomalyco/opencode/blob/f40dc433cb52eeb3ff5ec7a755f0ba0162216a51/packages/core/src/tool/plugin/webfetch.ts)；原文／源码已读，未运行客户端，2026-10-17 核]**

采用前把允许的数据目的地写清：模型、网络工具和外部扩展分别核查。OpenCode 的 `enabled_providers` 限定模型服务商，工具另有权限配置；严格内网要求还应核部署层的出口控制。若必要工具依赖未经批准的外部服务，就暂缓这套组合，而不是只更换模型。**[一手：[配置](https://opencode.ai/docs/config/#enabled-providers)、[工具权限](https://opencode.ai/docs/tools/#configure)；研究：部署建议，2026-10-17 核]**

此处只核 OpenCode 的具体机制；Qwen Code／Goose 的完整离线性、组织策略强制性及目标环境实际隔离仍须另查，不能由同属开源推定。**[研究：证据范围]**

## 能力趋同之后，真正的差异在哪

**优先比较完成任务与继续修改的总投入。** 保留项目原有验收，再看质量、等待、费用和主动工时；模型、上下文管理与工具配置都可能影响结果。历史固定输入量仅适合定位检查方向，见 [Claude 开销边界](claude-code.md#6-已知问题与社区反馈)及[套餐／本地模型个案](../research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)。**[研究：采用边界]**

**配置迁移也算维护成本。** 可复用的任务说明与验收放在项目里，工具专属的权限、恢复与扩展配置另行核查；换入口后先确认必要内容实际加载，再判断迁移是否值得。见 [03 上下文](../03-context-engineering.md)、[05 能力补充](../05-skills-and-plugins.md)、[22 保留或撤回](../22-agent-evaluation.md#7-何时推广何时停止)。**[研究：采用建议]**

## 深度页

| 你下一步需要决定什么 | 页面 |
|---|---|
| Codex 的入口、模型与当前任务用法 | [codex.md](codex.md) |
| Claude Code 的任务用法、扩展与已知问题 | [claude-code.md](claude-code.md) |
| Google 入口的认证、迁移与执行边界 | [gemini-cli.md](gemini-cli.md) |
| 自选模型、定制或维护开源 harness | [open-source-agents.md](open-source-agents.md) |
| 保留 IDE 工作流或选择其他集成 | [ide-and-others.md](ide-and-others.md) |
| 嵌入产品或自动化流水线，选择程序化调用方式 | [16 自建 Agent](../16-building-agents.md) |

来源与分项日期见各深度页及[选型证据记录](../research/2026-10-12-community-source-records.md)；近期改变建议的更新见 [13 前沿雷达](../13-frontier-radar.md)。本页核心选路建议已独立复核；各客户端深页保留各自核查范围，未验证目标部署隔离或真实任务跨入口效果。
