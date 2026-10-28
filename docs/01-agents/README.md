# 01 · Coding Agent 对比与选型

> 编辑更新：2026-10-22（UTC+8）；本次比较交互界面、工具／harness 与执行环境，产品配置保留各项原核实日期。

## 30 秒结论

**🟡 默认保留已能稳定达标的入口与配置；没有既有工作流时，按下面三类起步。** 本页 🟡 是待真实任务验证的选路建议，不是产品出厂默认或效果排名。先用现有仓库的小任务确认客户端能启动、模型能返回并完成验收；`--version`／`--help` 成功不等于模型可用。**[研究：采用判断；模型依据见 [02](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)]**

**编辑器与执行 Agent 可以分开选。** 已在 Cursor 看代码、审 diff，就保留编辑器，在集成终端沿用原有 Codex／Claude Code。确需另一入口时，先让它读取同一份项目规则、跑同一验收，再比较结果与总投入。

- **Claude 面板与终端表现不同**：在扩展列表查看 Claude Code 扩展版本，再运行 `claude --version` 核终端版本。扩展自带一份 CLI，终端使用独立安装，两者版本可能不同；缺 CLI 专属功能时先回终端，核实际模型、权限与必要功能。
- **云端构建失败**：先核任务实际使用的环境 build、其中的配置与依赖，再在该环境重跑项目原验收。Cursor Cloud 曾修复忽略仓库 `.cursor/environment.json`、指定 build 却使用其他配置的问题；先查这一层，再决定是否换 Agent。

**依据**：[官方：Claude 的两种入口与版本](https://code.claude.com/docs/en/vs-code#vs-code-extension-vs-claude-code-cli)、[Cursor Cloud 10-19 当周环境修复](https://prod.cursor.com/docs/release-notes)；[实际配置：Sentry 共享项目规则](https://github.com/getsentry/sentry/blob/65d8ecc0bd1b4825afbde7bd05e5fd52e3511c4d/AGENTS.md)。[三工具采用讨论](https://www.reddit.com/r/cursor/comments/1wfeim1/claude_code_vs_codex_vs_cursorwhat_are_you/)同时包含偏好 IDE 交互与额度不足的使用者自报，供识别个人缺口；跨入口效果仍待真实任务验证。2026-10-28 核，未运行上述客户端／环境。

| 任务 | 入口与具体配置 | 交给 Agent 的完成目标 |
|---|---|---|
| 本机仓库里的日常功能、补测试、小改动 | **Codex CLI**：在项目目录启动 `codex --model gpt-6.1-sol -c 'model_reasoning_effort="medium"'`（只覆盖本次启动）；已有 Claude Code 工作流则用 `claude --model claude-sonnet-5-5 --effort medium`。核会话实际模型／effort，沿用项目权限与检查 | 实现目标、跑相关检查、交回 diff 和真实结果；补一个失败路径或边界用例 |
| 困难跨模块重构、疑难 bug，或明确要求旧调用方兼容、边界覆盖 | 保留上述本机入口；**Codex 选 GPT-6 Astra + Light（CLI 配置值 `low`）**，或 **Claude Code 选 Opus 5.5 + `medium`**，验证要求高可从 `high` 起。只有检查深度不足时，先试原模型 `medium` → `high` | 复现问题、查受影响调用方、保持旧契约；再做一次代表性的后续修改，检查改动是否仍局部可控 |
| 不依赖本机资源，希望关机后继续的仓库任务 | **Codex Cloud**：选择已发布环境；没有就先准备仓库、依赖和检查并核结果后发布。模型仍按上两行，不因“长任务”升最高档 | 在云环境实际跑同一验收，再交回可审改动；本机 VPN、浏览器登录或设备是必要条件时，留本机入口 |

**[一手：[Codex 模型](https://learn.chatgpt.com/docs/models)、[单次 CLI 覆盖](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)、[Claude 模型／effort](https://code.claude.com/docs/en/model-config)、[云环境与本机边界](https://learn.chatgpt.com/docs/environments/modes)；研究：任务分流与质量目标，2026-10-20 核，未运行客户端／模型]** 已有 IDE、桌面或 Claude 云端路径能完整验收，就继续用，不为统一入口迁移；其他具体入口见下表。

**一个目标先在原生入口内完成。** 修复检查中发现的问题并复验，不以交回首版代替完成；多个独立目标的排队、归属和接续成为瓶颈时，再考虑外层派发。缺必要用户决定、授权或资源时暂停依赖动作，不自行放宽边界。见[Codex持续责任](codex.md#长时运行与-dots按能力缺口增加任务)及[Claude Code](claude-code.md)。[研究：P67／P68既有判断回流主入口]

**人检查目标、兼容行为和验收覆盖，UI／手感亲自体验。** Agent 可能漏调用方、只满足现有测试，或在资源不可达时给出完成自报。必要资源／数据边界不满足就撤回该入口；更强配置未改善质量，或等待、费用与返工抵消收益，就退回原配置。质量目标明确时可预先升档，不必等一次失败。**[研究：风险与撤回；见 [09](../09-review-and-quality.md)、[22](../22-agent-evaluation.md)]**

**⛔ 不以更换 Agent、全程 Ultra 或整套插件作为起手式。** 只为具体能力缺口或质量目标加最小补充；例如宿主兼容时，缺浏览反馈先补工具；质量要求须跨步骤强制执行，再定制工作流，而不是只换模型。**[研究：采用边界，见 [05](../05-skills-and-plugins.md)]**

## 当前最高水平：补齐反馈，再决定换哪一层

**🟡 默认沿用能完成当前质量目标的原生入口，缺哪层就先改哪层。** 对同一已有 Web 仓库的可见问题与后续改稿，近期领先实践把实际运行反馈接回 Agent，而不是靠更换界面保证质量；Google 的[生产 profile 改稿](gemini-cli.md#当前最高水平)、Anthropic 的[真实客户端验证](ide-and-others.md#当前最高水平)与 Shopify 的[行为和同状态画面对照](https://shopify.engineering/helix)提供不同团队的参照。哪款入口整体最好仍未知，主流采用比例也未知；本仓推荐是比较后的可行默认。[一手：团队实践；研究]

**三层可以组合。** IDE 可承载原 CLI，浏览工具可接现有 harness，独立环境也可运行这些组合；选择题是需要改变什么，不是三个产品类别选一个。[一手：[Zed两条路径](https://zed.dev/docs/ai/terminal-threads)、[Nous采用](https://github.com/NousResearch/hermes-agent/pull/81958)；研究]

| 同一修改缺什么 | 当前选择 | 比较理由、验收与撤回 |
|---|---|---|
| 只缺会话整理、通知；代码与检查已可完成 | 🟡 原 CLI，必要时放进 Terminal Threads；需要逐段审查、编辑器上下文才试原生 IDE／ACP | Zed区分界面与CLI配置，用户曾因审批摩擦退回终端。Agent须实际加载原指令并走完必要审批，人核可审diff；审批／恢复失效就撤回集成，不用关闭保护换成功 |
| 缺目标页面、性能或交互反馈 | 🟡 宿主兼容时先补浏览工具与目标环境，保留原 harness | Browser Use撤下自建循环，复用Pi／Codex／OpenCode；Nous实际采用后又修复了浏览目标切换。Agent须回读实际页面，切换后不再操作旧目标；观察不到必要状态或连接切错，就暂停新连接而保留原验收 |
| 现有工具接口／循环无法表达持续质量目标，或必须自选模型 | 🧪 先扩展现有 harness，仍不足再迁 Pi／OpenCode 等；不为“可定制”本身迁移 | Browser Use的撤自建与Pi工具契约的维护链给出两面：少维护循环，但新模型仍可能不适配工具。Agent交回全部预期修改及后续改稿，人核漏改与兼容；新接口吞改动、隔离或配置不能接续，就撤回该组合 |
| 关项目窗口后继续，或离开／关闭当前主机 | 🧪 只关窗口先比较持久host；关主机才选独立远端或托管环境 | VS Code Agent Host与Cursor目标环境解决不同缺口；客户端贡献工具可能仍依赖原窗口。Agent在目标环境走同一验收，人核执行位置、批准与恢复，见[IDE迁移验收](ide-and-others.md#迁移前验四件事)；必要路径不成立就保留原环境 |

**补工具足够，就不自建循环；需要强制质量门时，再定制工作流。** [Browser Use](https://browser-use.com/posts/bitter-lesson-browser-agents)需要的是可编程观察，现成coding harness已经承担循环；[Shopify Helix](https://shopify.engineering/helix)则发现通用LLM的开箱输出难以稳定满足其迁移质量，让每个checkpoint通过行为、同状态画面与代码审查再继续，默认再由人批准。应用到本页Web修改：只缺看见页面先补工具；持续漏旧行为、架构或视觉验收时，把这些要求做成可执行门，而不是再加一段提醒。只有现有入口承载不了这些操作与接续时，才换harness；复审无新增有效发现时应[收敛](../09-review-and-quality.md)，不照搬无限重试。[一手：不同任务的团队复盘；研究：条件迁移]

**浏览反馈要核实际对象，不只看“已连接”。** Nous的[10-02修复](https://github.com/NousResearch/hermes-agent/pull/131623)处理了状态已换、常驻daemon仍驱动旧浏览器的问题。升级或换环境后，Agent应在隔离的验收目标上证明新页面已接管、旧目标不再被触及，人核目标身份和可见结果。[一手：采用者维护；研究]

**较省token不自动成为新的默认。** Browser Use的[10-14同模型浏览工具比较](https://browser-use.com/posts/best-mcp-servers-to-control-a-browser)未检出质量胜者，较低模型费用与较短等待也不在同一方案上。它能帮助筛工具，不能替代本仓Web修复及二改的验收。[一手：厂商评测；研究]

**迁移后保留质量目标，允许撤回实现路线。** Agent交补丁、原检查、可体验页面与一次代表性后续改稿，人核兼容、边界覆盖和体验；合计适配、主动工时、等待、费用及返工。新能力没有改善目标结果，或维护投入抵消收益，就撤回新路线。本文为原文与公开维护产物比较，未运行这些客户端／模型；证据与范围见[研究记录](../research/2026-10-12-community-source-records.md#p54续补缺浏览反馈先补工具迁移后验实际对象)。[研究]

## 选型建议

| 你的任务或约束 | 起点 | 何时增加或换路 |
|---|---|---|
| 复杂、长程、跨模块修改 | 🟡 沿用可验收的 **Codex／Claude Code** 入口；困难任务按顶部 Astra／Opus 起点，保项目检查 | 当前入口无法完成必要操作，或同题比较显示质量／后续修改／总投入有明确收益时再换；见 [15](../15-task-playbooks.md)与[22](../22-agent-evaluation.md) **[研究]** |
| 已有 JetBrains 工程，需要 IDE 上下文 | 🧪 先核 AI Chat／ACP 能否覆盖必要操作 | 平台、认证或工具路径不兼容时再退回 CLI；CLI 能运行不保证 IDE 集成同配置可用，见 [JetBrains 边界](ide-and-others.md#jetbrainsintellij--rider--pycharm) **[一手；研究]** |
| 任务可脱离本机，想减少占用与等待 | 🧪 评估 Codex 云端任务／Claude 云端入口 | 先确认依赖和验收能在该环境运行；需要本机资源时按下方[环境表](#对比矩阵终端--通用-agent)选择 **[研究]** |
| 等待或预算已成为瓶颈 | 🧪 在当前入口对比候选模型 | 按同一验收分别记录质量、等待、费用与主动工时，再决定是否连 Agent 一起换，见 [02](../02-models-and-cost.md) **[研究]** |
| 高风险改动，需要第二意见 | 🧪 增加针对明确风险的新上下文评审 | 用新增有效发现与误报核查成本决定保留；同模型与跨模型均可能共享盲点，见 [09](../09-review-and-quality.md#2-评审手段) **[研究]** |
| 需要自选服务商或本地模型 | 🧪 从 **OpenCode／Qwen Code／Goose** 中选能接所需协议的入口 | 先核工具调用与任务质量，再承担模型服务、适配和升级维护，见 [开源 Agent](open-source-agents.md)与[本地模型](../02-models-and-cost.md#5-本地--开源权重模型) **[一手；研究]** |
| 代码或任务数据必须留在内网 | 👀 先核模型端点、联网工具与扩展的数据路径 | 只有可部署、可约束且能验收的组合才进入试用；OpenCode 的具体反例见[下文](#本地模型与数据边界) **[一手；研究]** |
| 考虑 Google 编码入口 | 🧪 先核 **Gemini CLI** 认证／合同；个人入口另评估 **Antigravity CLI** | 迁移需验真实宿主、返回语义与续接，不只看配置导入；API／旧企业合同与迁移条件见 [接入选择](gemini-cli.md#1-基本情况)及[深页](gemini-cli.md) **[一手；研究]** |
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

同一桌面 App 的 Work／Codex，先按是否需要开发视图选择，再核环境、记忆与 Hook 承接；能力重叠不代表上下文和自动检查相同，见 [Codex 入口](codex.md#1-形态与入口)。**[一手／研究：2026-10-22]**

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

来源与分项日期见各深度页及[选型证据记录](../research/2026-10-12-community-source-records.md)；近期改变建议的更新见 [13 前沿雷达](../13-frontier-radar.md)。本页已有独立资料复核，核心选路仍缺真实编码任务的采用验证；各客户端深页保留各自核查范围，未验证目标部署隔离或真实任务跨入口效果。
