# 01 · Coding Agent 对比与选型

> 编辑更新：2026-10-17（UTC+8）。按工程环境、数据边界和维护投入选择入口。

## 30 秒结论

**先选能接触真实工程、运行验收的入口，再选模型。** 已有 Codex／Claude Code 工作流时，先用它完成一个实际任务及后续修改；只有环境、质量或总投入出现明确缺口，才比较替代入口。**[研究：采用建议，依据见下表]**

- **想少维护一套工具**：沿用现有 CLI／IDE，原生起步；按 [15 任务打法](../15-task-playbooks.md)补所缺能力
- **任务依赖本机应用、文件或设备**：先选能使用这些资源的本机入口；任务能在独立环境复现时再考虑云端
- **想换模型**：评估多服务商 Agent；**代码必须留在内网**则先核完整数据路径，接上本地模型只是其中一步
- **准备迁移**：比较完整任务的质量、等待、费用与主动工时；维护和返工抵消收益时，保留原工作流，见 [22 评估](../22-agent-evaluation.md)

以上是选路建议，不是模型能力排名。**[研究]**

## 选型建议

| 你的任务或约束 | 起点 | 何时增加或换路 |
|---|---|---|
| 复杂、长程、跨模块修改 | 🧪 沿用 **Codex／Claude Code** 与项目已有验证入口 | 当前入口无法完成必要操作，或同题比较显示质量／后续修改／总投入有明确收益时再换；见 [15](../15-task-playbooks.md)与[22](../22-agent-evaluation.md) **[研究]** |
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

来源与分项日期见各深度页及[选型证据记录](../research/2026-10-12-community-source-records.md)；近期改变建议的更新见 [13 前沿雷达](../13-frontier-radar.md)。本页尚未完成全部客户端能力的交叉核查，也没有本仓真实任务的跨入口效果对照。
