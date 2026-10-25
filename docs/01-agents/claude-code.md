# Claude Code

> 核实 2026-10-22（UTC+8）；页内为文档、发布说明与独立团队实践的比较，非模型／客户端实测；依据集中在本页各节末，价格与接口保留各自核实日期。
> 评级：✅ **采用**（日常开发 Agent 选项之一）；核心建议成熟度 L3

## 30 秒结论：先用什么，何时换

- **✅ 默认与第一步**：已有可靠配置先保留；新起步、范围清楚的日常开发，用 **Claude Code 原生能力＋Sonnet 5.5／medium**，按 [§7](#7-推荐起步先原生扩展按需选择)做一个能验收的小任务，复用项目指令与现有检查。官方 effort 指南支持这一使用范围；这是本仓起点，不是统一出厂配置或实测最优。
- **升档按缺口决定**：输入与工具齐全却漏读、漏测，先在同模型从 `medium` 试 `high`；**跨文件代码质量审查可直接比较 `high`，不要求先失败，也不把协调器一起升档**；困难跨模块任务或已有明确更高质量目标，可直接用 **Opus 5.5／medium**。缺上下文、工具或验收先补缺口；完整分档只在 [02§1](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)维护。
- **⛔ 不推荐**：默认 Fable、所有任务最高 effort、先装整套流程插件，或为追新替换可靠配置。更强模型／扩展只在明确缺口或质量目标需要时试用，先确认入口可用、权限与预算允许；按对应任务的结果与返工决定保留，收益不足就撤回，不扩成全局默认。
- **人把关结果，Agent 执行**：Agent 读代码、做范围内修改、检查并交付 diff 与检查结果；人复核跨文件影响与关键行为，检查通过不等于功能达标。目标与授权由人确认，高风险外部动作不随升档获准。
- **无人值守先定位置和审批出口**：按 [§3.3](#33-并行与自动化5-种并行方式)选执行位置和审批出口；恢复时核当前文件与外部结果。

**依据**：[一手] [官方 effort 指南](https://code.claude.com/docs/en/model-config#choose-an-effort-level)（2026-10-20 补核）；[研究] 采用判断、角色分档与风险边界（2026-10-22，未运行模型对比）；核实 2026-10-22。

## 当前最高水平：原生起步，按失败类型补能力与接收证据

<!-- frontier: status=已比较 gap=1 gen=2026-10 checked=2026-10-22 -->

**按失败类型补能力：日常先走原生入口，再按缺口加窄扩展，并用当前结果决定接收。** 当前跨任务最优未知；这里比较的是整页主要选择，不给某套流程封冠军。近期领先参照为 Claude Code 团队10-15自用评审与9-22 Opus 5.5整任务指导；独立团队 Cloudflare10-19、Cursor7-30、Shopify9-02分别补角色分档、运行环境和接收／撤回。它们不是同宿主消融，也不能拼成原生或整包的净收益证明。主流参照为已有项目指令、检查与维护者接收，采用率未知；推荐是比较后的条件默认。原文与证据角色详见[P68](../research/2026-10-12-community-source-records.md#p68claude-code-整页选择与产品接收)。

| 主要选择 | 领先替代／同题参照 | 本仓决定 |
|---|---|---|
| 日常实现、协调与质量审查是否统一档位 | Cloudflare按角色比较Sonnet／Opus与effort；型号契约见02 | **保留并收窄**Sonnet medium日常起点；跨文件质量审查可先试high，不连带全部角色升档，完整分档回02 |
| 直接做、先计划或另写规格 | Opus 5.5整任务指导与07的未知分流 | **保留**目标清楚则连续完成；仅为改变实现／验收的未知先调查、讨论，不固定换会话 |
| 指令、记忆与上下文维护 | Claude团队短项目规则、按风险写review指引；03当前加载比较 | **保留**必要定位与行为边界，删失效重复；先核加载，记忆中的状态仍回实际结果验证 |
| 原生、窄扩展或整包流程 | P59同题小修复；Cursor从堆构建Skill转简化运行接口 | **修正**运行入口脆弱先修环境；原生够用不加包，重复缺口再补最小Skill／Hook／工具，并保必要验收 |
| 串行、子Agent或长程编排 | Bun成熟产品迁移与River独立工作项；并非并行数量对照 | **保留**只拆可独立验收单元，共享依赖顺序做；编译或多reviewer一致不能替代产品行为 |
| 本机／云端、续接／重开和无人值守 | Cursor环境可运行性、River恢复核live state；§3.3当前入口契约 | **补强**先核资源、输入与取回；续接核当前head及对应检查，不继承旧绿灯，权限另选 |
| 自查、独立review与人工接收 | Claude风险分层／复审收敛；Cloudflare发现质量；River产品取舍 | **补强**按风险加独立检查，重复问题转规则／确定性检查，后期关注差量；人保语义和风险判断 |
| 安全、诊断、升级与撤回 | §3.4／§6权限隔离契约；Bun真实输入复核后撤guard、River撤错误加固 | **保留并补强**不为跑通放宽权限；先辨配置／环境／真实行为，旧判断失效则重验或撤回，不按检查数量宣布完成 |

**差距1的范围**：主要选择已有近期领先与独立来源的条件比较；尚缺当前Claude同一成熟产品任务的原生／窄补充／整包长期二改与完整人工成本对照。Bun与Claude Code同属Anthropic，不算两支独立企业；没有把产品guard等同agent harness。登记不是效果实测或通用最优认证。

**依据**：[一手／研究] Claude Code 团队 10-15 自用评审、9-22 Opus 5.5 整任务指导；Cloudflare 10-19、Cursor 7-30、Shopify 9-02 独立团队实践；[研究] 整页选择、证据边界与产品接收（2026-10-22，见正文 [P68](../research/2026-10-12-community-source-records.md#p68claude-code-整页选择与产品接收)）；核实 2026-10-22。

## 1. 定位

**需要能读代码、改文件、跑命令并多步完成任务的编程 Agent 时，Claude Code 是候选入口。** Anthropic 的 Agent 式编程环境：可在终端、VS Code、JetBrains、桌面 App、Web（claude.ai/code，云端容器）、手机 App 上使用。它提供指令文件、Skills、Hooks、Subagents、MCP、插件等扩展；是否需要这些能力，应按任务判断，不能仅由扩展数量推断实际效率。

**依据**：[研究] 产品定位、入口与扩展采用判断；官方产品文档（见页尾）；核实 2026-10-22。

## 2. 模型与价格（v2.1.280–2.1.293 changelog）

**日常从 Sonnet 5.5／medium 起步；需要更强模型或更高 reasoning effort 时按任务更换，成本按 API 标准价核算。** 下表是 Claude API Standard 基础价，非订阅内额度；2026-10-17 复核，长上下文、缓存写入及其他条件详见 [02 统一价表](../02-models-and-cost.md#2-价格快照api-美元百万-token)。

| 模型 | ID | 上下文 | 价格（输入/输出，每百万 token） | 缓存读取 |
|---|---|---|---|---|
| Fable 5.1 | `claude-fable-5-1` | 1M | $10 / $50 | $0.25 |
| Opus 5.5（默认 Opus） | `claude-opus-5-5` | 1M | $4 / $20 | $0.20 |
| Sonnet 5.5（默认 Sonnet） | `claude-sonnet-5-5` | 1M | $2 / $10 | $0.10（2026-10 减半） |
| **Haiku 5.5**（默认 Haiku，v2.1.293） | `claude-haiku-5-5` | 1M | $0.10 / $0.50（超过 10 万 token 的请求为 $0.50 / $2.50） | $0.01（总输入 >100K：$0.05） |

- `/model` 切换模型，`/effort` 调推理强度（low → max），`maxEffortLevel` 可设上限。
- 订阅用户（Pro/Max）受 5 小时与每周额度限制，是否够用应按实际任务与账户用量判断，社区个案不能代表普遍可用时长（详见 [11](../11-community-pulse.md)）。
- 用 `/usage` 的 Session 区查主会话缓存命中与重建原因（原因提示需 v2.1.260+），不代表子 Agent 合计；更多诊断见 §6。
- **子 Agent 可以单独指定 effort**（v2.1.292，Agent 工具的 `effort` 参数）：目标清楚、结果可检查且有成本或等待缺口时，可试轻量模型；不因任务叫“检索”就固定低 effort。模型与 effort 按[02 的任务选择](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)调整，跨文件代码质量审查可直接比较high；协调、实现与其他审查角色分别选档，复杂调查、漏约束或验证不足时保留较强配置。
- Max 和 Team 订阅开始每月附带 API 额度（Max 5x 100 美元、Max 20x 200 美元、Team 最多 500 美元）；须领取并按运行入口核资格，不能抵所有 Code 用量，详见 [18 成本治理](../18-team-adoption.md#5-成本治理)。

**依据**：[一手] [官方价格](https://platform.claude.com/docs/en/about-claude/pricing)、[费用与缓存文档](https://code.claude.com/docs/en/costs#prompt-cache-statistics)、官方 changelog（v2.1.280–2.1.293、v2.1.292 子 Agent effort）、Anthropic 额度公告及资格说明（2026-10-15 补核）；[研究] 分档与采用边界（2026-10-17 补核）；核实 2026-10-17。

## 3. 能力全景

### 3.1 指令与记忆

**项目约定先写进 `CLAUDE.md`，再按路径与记忆范围补细分机制。** 下表是各机制的分工；共享约定是否真正加载，按路径和版本核对，不只看文件存在。

| 机制 | 说明 |
|---|---|
| `CLAUDE.md` | 托管策略 / 用户（`~/.claude/CLAUDE.md`）/ 项目（`./CLAUDE.md` 或 `./.claude/CLAUDE.md`）/ 本地（`CLAUDE.local.md`）四层；支持 `@path` 导入 |
| **AGENTS.md** | v2.1.277 起支持，但默认发现受父目录及 `CLAUDE.md`／`CLAUDE.local.md` 等条件影响；共享约定是否需显式导入、额外目录及加载观察边界见 [03 条件说明](../03-context-engineering.md)。配置模式不等于所有路径都自动加载 |
| `.claude/rules/*.md` | 用 `paths:` glob 让规则只在处理匹配文件时加载 |
| 子目录 CLAUDE.md | 按文件访问路径按需加载；2.1.288/293 分别修复 Write/Edit 和部分单文件 Bash 读取遗漏，见下文；`claudeMdExcludes` 可排除不相关的 |
| Auto memory | 默认机器本地，同仓库 worktree 共享；启动只加载索引前 200 行或 25KB（先到为准），主题按需读取。跨环境／委派所需事实仍须交接，见 [03 的记忆范围](../03-context-engineering.md#4-跨会话记忆) |

**🧪 长会话常停一小时，先试内建 idle compaction，而非先装压缩插件。** 2.1.299 发布说明描述终端在上下文 200K 及以上（原文 200K+）、闲置约 54 分钟时压缩，意图赶在一小时缓存过期前减少恢复重读；规模阈值用 `CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS` 调整，`"idleCompaction": false` 可关闭，两项控制需 2.1.290+，不是说能力只从 2.1.299 才有。先核终端版本与配置，不把它推广到桌面等所有表面，也不为短会话硬降阈值；压缩前保存未完步骤和约束，用实际压缩事件、恢复后的任务状态及压缩／重读／返工成本判断是否保留，丢状态或净成本更高就调整、关闭或改为人工阶段压缩。

**依据**：[一手] [2.1.299 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.299)（10-14）、官方 Memory 文档（见页尾）；[研究] 试用选择（2026-10-22，未运行客户端，编码收益未知）；核实 2026-10-22。

### 3.2 扩展

**默认不加扩展；只在任务缺知识、需要隔离或确有重复自动化时补最小一项。** 下表按机制列出适用场景与上下文成本。

| 机制 | 何时用 | 上下文成本 |
|---|---|---|
| Skills | 可复用的流程、领域知识 | 低：常驻的只有描述 |
| Subagents | 隔离大量中间结果（检索、评审） | 与主会话隔离 |
| Hooks | 必须每次执行的规则 | 零（除非返回内容） |
| MCP | 连接外部系统 | 通常只预载工具名与服务器说明，schema 按需加载；自定义 API 网关等路径先核 tool search，见下文 |
| LSP 插件 | 当前会话支持且有诊断／语义导航缺口时，见 [05 的采用条件](../05-skills-and-plugins.md#3-插件与市场) | 取决于诊断与查询返回量，净收益需按任务验证 |
| 插件 | 打包分发以上所有东西 | 取决于内容 |
| Output style | 只需短回答先用偏好或内置 Concise；自定义 style 还会改变编程指令，见 [05 的保留条件](../05-skills-and-plugins.md#4-skillmcpsubagenthookclaudemd-怎么选) | 主会话每次请求都有；普通子 Agent 不继承 |
| Mods（v2.1.287） | 用 TypeScript 改界面（面板、按钮）和更深层的行为 | — |

### 3.3 并行与自动化（5 种并行方式）

**先按资源位置和持续时间选并行入口，再只拆可独立验收的单元。** 下表是各入口的当前状态。

| 方式 | 一句话 | 状态 |
|---|---|---|
| Subagents | 会话内委派，返回摘要 | 稳定 |
| Agent View（`claude agents`） | 一个界面派发、监控多个后台会话 | 研究预览 |
| Agent Teams | Lead 分配任务，队员互发消息、共享任务列表 | 实验，默认关闭；**不自动用 worktree 隔离** |
| Dynamic Workflows | Claude 写脚本编排大量子 Agent，并交叉验证结果 | 付费套餐及支持的 API／云 provider 可用；Pro 需在 `/config` 开启，`/workflows` 管理运行 |
| Projects | Web、桌面或手机 App 的长期对话；通常开云端线程，需要本地资源时可指定 Remote Control 线程 | 公测（Pro/Max）；本机线程须保持电脑唤醒与连接进程运行 |

配套：`--worktree`（`-w`）、`worktree.sparsePaths`（大仓库稀疏检出）、跨会话消息、`/batch`（把一个大改动拆给 5–30 个 worktree 子 Agent）、`/loop` 与 Routines（运行位置和存续边界见下文）、`/goal`（会话级续接，评估器判断已展示证据而非独立验收，见 [07](../07-workflows.md#1-核心验证闭环-)）、Monitor 工具（订阅后台脚本事件）。

**按资源位置和持续时间选入口**：Projects 的本机线程可访问本地数据库、模拟器与 VPN 内资源，要求本机 Claude Code 2.1.280+；它使用本机工具与设置，带项目指令但不预载项目 memory，不能套用云端“关机后继续”的预期。Projects 可从 Web、桌面与手机 App 使用，不是 CLI／IDE 内的项目协调入口。Dynamic Workflows 的启用和运行入口见官方说明。

**转云先核输入和取回路径**：CLI `--cloud` 新建云任务，不搬走当前终端会话；有 GitHub 连接也可能转为本地仓库打包。完整克隆的 bundle 可含所有分支历史与已跟踪文件的未提交修改，却不含未跟踪文件；部分平台的敏感文件排除不等于历史已脱敏。先确认允许上传的范围、让必要输入进入所选路径，再在云任务核分支／提交、必要文件与结果取回路径，之后才投入长执行。仅需从手机继续原本地工作时，用 Remote Control，电脑仍须在线。历史版本有意外打包、缺 remote 与取回失败的公开报告；它们不证明当前普遍故障，也不支持绕过权限或一律改用另一入口，详见[交接证据](../research/2026-10-12-development-conditions.md#claude-转云输入创建成功不等于输入齐全或成果可取回)。

**短轮询和独立定时分开选**：当前会话短轮询用 `/loop`；需要电脑关闭后仍运行，选云端 Routines（定时间隔至少一小时）；定时任务必须访问本地文件／工具时，可选 Desktop scheduled tasks，但电脑仍须开机。`/loop` 后台化可脱离终端，不能脱离运行机器；恢复会话会还原部分未过期的 `CronCreate` 任务，但已错过的一次性任务和 self-paced loop 不恢复，不能把“可恢复”当作退出后仍在执行。

**✅ 同任务默认续接，但先比较休眠恢复费用与重建代价。** 2.1.304 会在 Pro／Max 恢复会明显消耗五小时额度时警告，可继续或新开后引用旧会话。依赖未沉淀决策、失败尝试与细节时保留历史；只需少量背景且恢复成本明显时，再带目标、约束、已完成与未完成验证新开。若漏约束、重复调查或返工抵消节省，就撤回这次精简，不把“更短”当“更省”。Agent 整理交接，人核关键约束与实际文件；未测净节省，详见[续接证据](../research/2026-10-10-codex-continuity.md#有效配置与续接动作2026-10-20)。

**无人值守仍须选权限与审批出口。** 已停止会话用 `claude -p --resume <session-id>` 时显式选本次权限模式、补临时配置与目录；旧 plan 历史不保证新运行仍为 plan。无人审批可用 2.1.259+ 的 `--permission-prompts none` 拒绝需新批准的动作，不放宽权限跑通。仍活着的后台 resume 是 attach，不能当冷加载副本。

**预算与重试分开控制**：`--max-budget-usd` 是本次运行的 API 费用估算，含子 Agent、可能超额且不计恢复历史；`--max-turns` 也不能阻止 stream-json 队列消息另起一轮限额。两者不代替累计预算或账单上限。使用会派生／重启子 Agent 的插件做非交互任务时，应先核客户端包含 **2.1.304 的停止修复**：官方报告该路径曾越过轮数上限、Stop 或输入结束继续运行，不能只凭已有 2.1.299 修复就认定覆盖。恢复发布等外部写入前仍先查目标结果，可控接口使用幂等键。版本修复不构成 exactly-once 保证；依据及续接例外详见 [S1a](../research/2026-10-10-audit.md#s1a--2026-10-14-无人值守的停止与重试边界)。

**恢复日志不是当前事实。** 续接前让Agent核当前文件／PR head及对应检查结果；rebase或别人续改后，旧提交的绿灯不能继承，也不覆盖人的新提交。Shopify River的独立生产实践支持这条状态边界，不证明Claude恢复机制有同样实现；人接产品／风险决定，Agent交当前证据，详见[P68](../research/2026-10-12-community-source-records.md#p68claude-code-整页选择与产品接收)。

**依据**：[一手] [Projects 本机线程边界](https://code.claude.com/docs/en/claude-projects#run-a-thread-on-your-own-computer)、[Dynamic Workflows](https://code.claude.com/docs/en/workflows)、[调度限制](https://code.claude.com/docs/en/scheduled-tasks#limitations)、[Routines 间隔](https://code.claude.com/docs/en/routines#add-a-schedule-trigger)、[恢复契约](https://code.claude.com/docs/en/sessions)、[CLI 参考](https://code.claude.com/docs/en/cli-reference)、2.1.304 发布与成本契约；[研究] 入口选择、续接与无人值守边界（2026-10-20，未运行客户端）；[一手：团队自报] Shopify River 状态边界；[社区] 转云打包与取回失败的公开报告；[经验] 转云输入与取回（2026-10-16）；核实 2026-10-22。

### 3.4 评审与安全

**先用原生评审、隔离与最小权限；扩展代码、托管配置和版本升级再单独核信任边界。**

- `/code-review`（默认后台评审，终端 fork 继承当前历史；独立窗口不等于独立输入，详见 [09](../09-review-and-quality.md#2-评审手段)；`--max-findings` 控制数量）、`/code-review ultra` 和 `claude ultrareview`（云端多 Agent 深度评审，可在 CI 里跑）、`/security-review`、`/simplify`。
- **Auto mode**（v2.1.283 起内建默认适用于交互终端与 VS Code，受配置和可用性影响）：规则及免审批路径先处理，其余适用动作交分类器，详见 [06](../06-hooks-and-guardrails.md#4-auto-mode实测数据)。
- 沙箱：macOS Seatbelt / Linux bubblewrap，可设网络白名单（`sandbox.network.strictAllowlist`），可屏蔽凭证（`sandbox.credentials`）。
- `--safe-mode`：排查被禁用的自定义内容，托管策略仍生效，不能据此排除全部配置原因；`--restricted`：去掉执行类工具。
- **`--bare` 不是普通 `-p` 的等价加速**：它跳过 `CLAUDE.md`、Skill、Hook、插件等自动发现；需显式提供任务所需上下文与工具，或保留普通模式。它也不复用订阅登录，切换前须确认已授权的认证与计费方式。自 2.1.286 起不发送系统提醒、不启动后台任务，超时命令停止而非转后台；详见[迁移时的选择与例外](../research/2026-10-12-development-conditions.md#交互试点转脚本bare-不是等价加速)。
- **✅ 扩展代码单独审查信任边界**：Bash 沙箱不覆盖命令型 Hook、MCP／LSP 服务或 mod 启动的进程；需要连这些扩展一起隔离时，把整个 Claude Code 进程放进受控容器／虚拟机。使用本地 `--plugin-dir` 的旧客户端应优先评估升级到 2.1.299：该版修复了沙箱命令改写插件目录、随后在沙箱外加载其代码的路径；不能由此推断插件本身已被隔离。
- **升级后 MCP 少了权限，先查匹配而非放宽权限**：2.1.299 收紧 allow 和子 Agent `tools:` 的服务器匹配；`mcp__a` 不再覆盖 `a__b` 或 `a_`。只需单个工具就列具体工具；确需整台服务器时使用完整规范化名 `mcp__<server>__*`，不要用宽泛前缀恢复旧行为。

- **托管 MCP 升级前核实际加载集合**：v2.1.305（10-21 UTC+8）不再用 `allowedMcpServers` 过滤 `managed-mcp.json` 中仅 `env` 使用 `${VAR}` 的 stdio 服务。此前因未列入白名单而未加载的此类服务，升级后可能加载；仍须禁用时用 `deniedMcpServers` 明确拒绝，再核实际结果。当前管理文档仍将 `env` 列入白名单检查，不能把新版例外推广到所有托管服务；版本与差异详见 [S1g](../research/2026-10-10-audit.md#s1g--2026-10-21-claude-21305-升级边界)。

**依据**：[一手] [沙箱范围](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)、[2.1.299 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.299)、[固定 changelog](https://github.com/anthropics/claude-code/blob/db93774d73e8fdbaf315a6f4c175ae99ad3d515a/CHANGELOG.md)、v2.1.305 固定发布说明与托管 MCP 文档；[经验／研究] 采用判断、信任边界与升级范围（2026-10-21，未运行客户端）；核实 2026-10-22。

### 3.5 诊断与维护

**先按问题类型跑对应诊断命令，再改配置或权限。** 下表按用途列命令。

| 命令 | 用途 |
|---|---|
| `/context` | 看上下文各部分占用 |
| `/doctor prompt-audit` | 检查 CLAUDE.md、Skills、Agents 中“为旧模型写的”提示写法（v2.1.283） |
| `/skill-doctor` | 找出没用到的 Skill 及其上下文成本 |
| `/insights` | 回顾近期会话，估算 auto mode 能省掉多少次确认 |
| `/fewer-permission-prompts` | 扫描历史，生成只读命令白名单 |
| `claude plugin validate / eval` | 校验插件，并对插件跑评测打分 |
| `/code-review --max-findings <n>\|all` | 控制评审报告的问题数量；中等 effort 下对 Opus 5.5 和 Sonnet 5.5 也会报告清理类问题和违反 CLAUDE.md 约定的问题（v2.1.290） |

**依据**：[一手] 官方扩展文档（见页尾）；[研究] 扩展按缺口选择、诊断先于改配置（2026-10-22）；核实 2026-10-22。

## 4. 按任务选择的用法要点

1. **给它一个能自己跑的检查**：测试、构建退出码、截图对比。这些机制解决不同问题：Goal 维持目标，Hook 检查可执行条件，独立验证提供另一视角；不存在未经条件限定的强弱排序。
2. **按未知和决策规划**：目标、兼容要求与授权清楚时，可以在执行中规划并连续完成；关键歧义会改变实现或验收时，再先调查、讨论或审方案。详见 [07 的规划分流](../07-workflows.md#2-标准节奏探索--计划--实现--提交-)。
3. **大功能按需补 Spec，不强制换会话**：需求仍有关键取舍时，可用 AskUserQuestion 访谈并记录规格；需求明确且当前上下文仍有用时直接续做，探索历史成为负担或需要交接时再保存必要依据、开新会话。详见 [07 的访谈与会话条件](../07-workflows.md#3-大功能访谈式-spec-)。
4. **积极管理上下文**：不相关的任务之间 `/clear`；同一问题反复纠正仍错时，先判断是错误上下文、实现缺陷还是验证缺口；若需要新会话，先保存产物和关键判断；`/btw` 问的问题不进入上下文。
5. **CLAUDE.md 按任务价值保留**：信息是否改善定位、必要行为或明确质量目标？删除重复、失效及无作用的内容；功能没出错不等于领域依据无价值，判据统一详见 [03](../03-context-engineering.md)。规则未生效时先核加载路径和版本，不直接归因于文件太长。
6. **按任务选择 CLI 或结构化工具**（如 `gh`）：已有可靠命令可减少配置，但输出过长、权限不匹配或接口不稳定也会增加成本；没有跨工具对照时不称其“一定最省”。
7. **Writer / Reviewer 分离按风险试用**：原生检查与自查仍有明确缺口时，再用独立会话或评审子 Agent；以新增有效发现、误报和人工核查投入决定是否保留。高影响改动仍需必要的独立检查、人工判断与授权。评审输入和分层条件详见 [09](../09-review-and-quality.md#按风险选择评审层不默认逐层叠加)，不默认每次叠加 reviewer。**重复发现先区分新风险、旧缺陷与误报，能确定性检查的转规则／测试；后续重审关注改动影响及未关闭风险，不为凑轮数重审。** Claude团队10-15实践支持收敛，固定轮数与人审人数不外推；详见[09](../09-review-and-quality.md)。
8. **批量改动**：先按 [15 §5](../15-task-playbooks.md#5-大规模迁移与升级)选现成迁移器或 Agent 补丁，按调用／类型差异试点；脚本调度可用 `claude -p`，并行或 `/batch` 只拆可独立验收的单元，共享依赖按顺序处理，自主度仍看风险与授权。

**依据**：[一手：团队实践] Claude 团队 10-15 评审收敛；[研究] 检查、规划与上下文管理机制的条件比较；[经验] 采用判断（2026-10-22，见正文各链接）；核实 2026-10-22。

## 4.5 与 Codex 配合：先核对规则是否真的加载

✅ **当 Codex/Claude 表现不一致时，先查入口文件、导入、路径范围和实际版本，再判断是模型偏好还是提示太长。** 不要靠在两个文件里重复粘贴全部约束来补一个加载问题；也不要由这几条修复推断所有 shell 读取方式都会自动加载规则。

固定 Claude Code changelog 记录了三个具体修复：2.1.287 避免 resume/压缩后同一文件夹的 CLAUDE.md 重复附加；2.1.288 修复 Write/Edit 访问范围内规则未加载；2.1.293 修复通过单文件 `cat/head/tail/sed -n/grep` 阅读时嵌套规则未加载。这些是官方发布说明，未运行对应旧版/新版对照。

🧪 **交替使用时按任务交接，不强制每次修改都交叉评审。** 按当前任务交接明确的工作或独立问题；交接内容写当前目的、已完成产物、失败证据和需要检验的假设。若评审只复述另一端的总结，两种模型也可能共享同一个盲点。

**依据**：[一手] [固定 Claude Code changelog](https://github.com/anthropics/claude-code/blob/2301018b1f61073c501a8e7a4813ef48c239163b/CHANGELOG.md)（2.1.287／2.1.288／2.1.293 修复，未运行旧版／新版对照）；[研究] 采用判断；核实 2026-10-22。

## 5. 2026 下半年的重要变化

**先按结果验收长任务与 auto mode，再决定是否依赖新能力。** 下表按变化列出当前边界。

| 变化 | 说明 | 证据 |
|---|---|---|
| **Opus 5.5 的长任务用法** | 官方报告多步骤工作改善，但也说明长任务可能停在进度总结；先给完整目标、完成标准与停止条件，再按实际改动和检查结果验收，不用迁移行数估算工期。来源与单例限制详见[核查记录](../research/2026-10-10-audit.md#s1--claude-code-2129521296) | 单例；可能停在进度总结 |
| **auto mode 成为默认**（2026-08） | 交互终端与 VS Code 的内建默认，受配置和可用性影响 | 不覆盖所有客户端或非交互任务 |
| **Claude Projects**（2026-09 公测） | 在 Web、桌面与手机 App 中协调长期工作；云端线程可在电脑关闭后继续，需要本地资源时可指定 Remote Control 线程 | Remote Control 线程须保持电脑唤醒与连接 |
| **Mods**（v2.1.287） | 用 TypeScript 修改界面和更深层的行为，社区已经做出了在 Claude Code 里跑的俄罗斯方块 | — |
| **Claude Mods 与内置的“You should know”**（v2.1.287–2.1.289） | Mods 让插件可以修改更深层的行为；内置 Mod“You should know”让一个旁观的子 Agent 帮你盯住你和 Claude 可能遗漏的事（`/plugin enable cc-plugin-you-should-know@builtin`） | — |
| **Managed Agents 接入**（v2.1.290） | `/claude-api managed-agents-onboard` 可以把文档或控制台模板直接变成托管 Agent 的配置（详见 [16 自建 Agent](../16-building-agents.md)） | — |
| 无人值守和交互会话区别对待（v2.1.289–2.1.290） | 后台命令的时间限制只用于 `-p`、Agent SDK、CI 和云端会话；WebSearch 额度改为按小时恢复（每小时 100 次） | 仅适用于上述非交互入口 |
| auto mode 的长会话处理（v2.1.289） | 会话太长、客户端安全分类器审不过来时，会先压缩而不是逐次弹出确认或失败 | — |
| 自然语言写的 Hook 更可靠（v2.1.294） | 修复了写成指令（如“Block commands that…”）的 `prompt` / `agent` Hook 放行了本该拦截的操作；Stop Hook 写成“构建失败就继续”时，Claude 更少提前停下 | — |
| 原生读取 AGENTS.md（v2.1.277） | 早期版本曾出现“只在开启遥测时才读 AGENTS.md”的 bug，已修复 | 早期 bug 已修复 |

**Opus 5.5 的官方用法建议**：
- 一条消息给出完整任务、完成标准和停下来的条件；
- 删掉“think hard”这类话，改用 effort 控制；
- 运行中可以直接追加消息；
- 在 CLAUDE.md 里写停止规则；
- 长任务把清单写进 TASKS.md；
- 规定总结格式为“Blocked on me / Changed / Found”；
- 评审只列“会因此拒绝合并”的问题；
- 要求它标出无法确认的内容。

本仓库的模板已采用这些做法。

**依据**：[一手] [Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)、官方发布说明与 changelog；[一手：官方指南] 长任务用法；[一手＋社区] AGENTS.md 早期读取 bug 的发布说明与反馈；[研究] 采用判断、单例限制（详见[核查记录](../research/2026-10-10-audit.md#s1--claude-code-2129521296)，2026-10-17 补核）；核实 2026-10-17。

## 6. 已知问题与社区反馈

**遇到下列现象，先按对应入口核对当前版本、配置与本地证据，不把单个案例当普遍结论。**

- **额度与账户事件只作个案参考**：采用前先核当前资格与实际用量，不据个案决定套餐或规避账户限制。2026-02 的 Max 20x 用户报告称在 Claude Code 2.1.44 上两三天耗尽周额度；2026-10 的 V2EX 原帖自述账号被封。两者不证明当前套餐普遍可用天数、中文用户封号率或触发原因，详见 [18](../18-team-adoption.md)。
- **历史 Harness 开销案例先按当前实际开销判断**：先用 `/context` 与 `/usage` 检查实际工具负担、主会话缓存及重建原因，再删无用配置或在 headless／CI 中用 `--tools=` 收窄工具。Systima 在 2026-07、Claude Code 2.1.207／OpenCode 1.17.18 的隔离代理实验中测得首轮约 33k／7k 输入，并观察到缓存重写；不能据此判断当前默认开销或选择更省的客户端。旧实验差值不能归因于 MCP；当前网关选择见下一条。原报告范围、当前诊断契约及代理例外详见 [S1c](../research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)，本仓库历史产物缺口详见 [19](../19-experiments.md)。
- **网关拒绝 tool search，先核版本，不盲目强开**：v2.1.304 将网关默认改为开启，但相关拒绝回退有回归；应核采用版本包含 **2.1.305 修复**（10-21 UTC+8）。官方契约规定 2.1.305+ 可对未知原因的 400／422 去掉 tool search 重试；成功后预载 MCP 工具，无需再操作。不保证所有错误可恢复。
  - **已知网关不支持时，可显式关闭**：用 `ENABLE_TOOL_SEARCH=false` 避免稍后再次探测产生的拒绝请求，代价是工具全部预载；回退不改变服务端限制，净成本未测。固定来源与文档差异详见 [S1g](../research/2026-10-10-audit.md#s1g--2026-10-21-claude-21305-升级边界)。
- **MCP 已连接却缺工具，先比清单与 schema，不先换模型**：2026-07-28 协议放宽了 schema 关键词；9-19 的单例报告根级组合／条件结构使工具被静默丢弃，同样关键词在属性内可用。对照服务声明和客户端实际清单，以最小 schema 定位协议、宿主与模型 API 的兼容边界；适配或拆工具须保互斥语义：移到属性内会改变参数形状，放宽宿主 schema 时仍需服务端验证原约束，再验合法／非法输入和真实调用；也可换已支持的客户端。所读 issue 为 Open 不代表新版普遍仍有问题，改写无效或语义变弱就撤回重查。
- **HTTP MCP 已重连，不等于在途调用已结束**：2.1.307 修复了调用中途断连后的重复发送，仅在这条恢复路径重试只读或幂等工具；使用 HTTP MCP 写操作时，先核客户端是否包含该修复。但 10-22 作者的 Linux 双版本复现在 2.1.307 仍观察到 GET 流已重连、原 POST 仍待决，升级不等于挂起问题也已解决。先核服务端业务结果，未知结果按[对账原则](../20-codex-long-horizon.md#9-超时后动作究竟发生了吗)处理，不为解除等待给所有工具套自动重试。`readOnlyHint`／`idempotentHint` 是服务声明，不代替已验证的业务幂等性；协议要求谨慎信任注解。

- **短 Hook 也可能改变跨轮缓存前缀，先核历史修复是否已覆盖**：7 月报告称 `PostToolUse additionalContext` 跨轮重序列化改变历史前缀，作者 8-20 反馈 2.1.237 已修；同版官方说明只确认 gateway／custom base URL 缓存修复，未独立确认该 Hook 的精确根因。这是历史诊断线索，不是近四周新缺陷；先核版本、接入路径和当前复现，再以相同任务做有无注入的小对照，比较同轮／跨轮缓存和请求结构，升级后复核原症状与 Hook 功能。不要先压缩规则、换模型或长期禁用有价值的 Hook；无改善或功能受损就恢复必要能力并重定位。
- **历史透明度争议（v2.1.196）**：原作者逆向报告描述自定义 API 条件下日期字符串变化；其报告明确默认官方端点不触发该路径。识别转售／蒸馏是作者猜测，不能据此认定当前所有入口有同样行为；选型仍核目标版本和实际外发路径。
- **auto mode 被绕过**：Embrace The Red 用“总结网页 → 让 Claude 自己写解码脚本并在攻击者目录里运行 → 被同名 `struct.py` 劫持”的链条，作者迭代载荷后的三个变体各测 5 次，分别成功 3、3、4 次；只证明该攻击链可行，不代表生产绕过率。**auto mode 不能代替隔离。**
- **长任务仍需检查执行范围**：10 月 3 日的用户原报称单区域操作被扩到其他区域，但没有复现材料。它提示核对实际外部改动是否超出授权，不能据此断言 Opus 5.5 普遍越权；权限选择见 §3.4。
- **遇到质量退化先核任务与配置**：4 月历史报告涉及复杂并行工程；维护者回应区分了推理显示与实际推理，并说明当时默认配置变化。先核实际模型与 effort，保留失败输入、diff 和检查结果，按 [22](../22-agent-evaluation.md)比较；热帖票数与思考文本长短不能代替任务质量证据。
- **撤回并行修改先核实际 diff**：当前会话捕获的编辑可用 `/rewind`；Bash、子 Agent 或其他会话共同改过的工作，按 Git diff／提交确认撤回范围，不能假定主会话 rewind 覆盖整项任务。前台 fork skill 等例外详见官方范围，它不能代替 Git。

**依据**：[社区：原帖] [Max 20x 用户报告](https://github.com/anthropics/claude-code/issues/26271)、[V2EX 原帖](https://www.v2ex.com/t/1246477)；[社区：历史实验] [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)；[一手] [MCP 网关 tool search 契约](https://code.claude.com/docs/en/mcp#tool-search-through-an-llm-gateway)、当前 `/context`／`/usage` 诊断契约、[2.1.307 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.307)、[2.1.237 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.237)、[checkpointing 范围](https://code.claude.com/docs/en/checkpointing#subagent-edits-not-restored)；[一手：协议] [2026-07-28 协议 changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog)、[工具注解要求](https://modelcontextprotocol.io/specification/2026-07-28/server/tools#tool)；[社区：单例] [issue #95504](https://github.com/anthropics/claude-code/issues/95504)、[作者 Linux 双版本复现](https://github.com/anthropics/claude-code/issues/104166)、[7 月 Hook 报告](https://github.com/anthropics/claude-code/issues/81077)、[10 月 3 日 HN 原报](https://news.ycombinator.com/item?id=49948034)、[4 月质量退化报告](https://github.com/anthropics/claude-code/issues/42796)；[一手] [维护者回应](https://github.com/anthropics/claude-code/issues/42796#issuecomment-4194007103)；[社区：历史分析] [隐写标记分析](https://thereallo.dev/blog/claude-code-prompt-steganography)；[社区：原文] [Breaking auto mode](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)；[经验／研究] 诊断选择与证据范围（2026-10-24，本仓未运行客户端，不证明恰好一次执行；2026-10-22 MCP 协议未复现、Hook 未复现）；核实 2026-10-24（个别条目 2026-10-17／10-22 补核）。

## 7. 推荐起步：先原生，扩展按需选择

**首个任务这样配**：已有可靠配置不改；没有既有配置时，在项目目录以 `claude --model claude-sonnet-5-5 --effort medium` 启动本次会话，确认会话显示的实际模型与 effort。先交代“目标、允许改哪些文件、完成检查、不允许的外部动作”，让 Agent 完成一个可验收的小改动并报告实际结果。账号／provider 未提供该模型时，不绕过限制，保留可用的可靠配置并按 [02](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)另选。此命令是单会话起点，不要求改全局配置；上述 medium 建议针对 Claude Code，不应当作 API 默认值。

✅ **先确认任务目标、范围、完成标准与授权，复用项目已有指令和检查。** 目标清楚、原生能力与检查充分的小任务可以直接完成，不必先安装插件或增加独立评审；需要规划、换会话或独立检查时，按上文及 [07](../07-workflows.md)、[09](../09-review-and-quality.md) 的条件选择。

**先修验证入口，再补流程。** 若Agent连已有服务都不能稳定启动或观察，先简化运行命令、补目标环境与可检查输出；Cursor的7-30复盘中，构建Skills只带来边际改善，简化运行接口才使端到端检查可靠。这不是要求复制其平台，也不证明Claude收益相同。已有入口可靠后，再按下表加窄能力，详见[07](../07-workflows.md)。

**完成与撤回看真实路径，不数检查。** Bun的release构建漏执行注册调用，即使debug正常也不能接收；根因修复后，另一个guard因目标构建不再生成故障输入而关闭未合并。手造红测或“没有崩溃”不自动证明下一次用户操作正确。Agent交构建模式、真实输入和行为证据，人裁决语义；缺证据保待验，根因已修且目标路径复核支持时可撤无用兜底。这里撤的是产品补丁，不据此证明该撤工作流，详见[P68固定链](../research/2026-10-12-community-source-records.md#p68claude-code-整页选择与产品接收)。

下表是互相独立的条件示例，不是安装顺序：

| 已识别的需要 | 可选示例 |
|---|---|
| 项目缺少必要指令，需要生成初稿 | `/init`，再核对内容并删去重复或无关的说明 |
| 有诊断／语义引用缺口，现有检查与 IDE 无法满足，且当前会话支持 | 🧪 先准备语言服务器二进制，再试 `/plugin install typescript-lsp@claude-plugins-official`（TypeScript 示例） |
| 有明确漏审类型，需要在原生评审之外试用额外能力 | 🧪 `/plugin install code-review@claude-plugins-official` |
| 已有明确的项目指令维护问题，需要评估管理能力 | 🧪 `/plugin install claude-md-management@claude-plugins-official` |
| 有明确的重复人工步骤，需要评估自动化候选 | 🧪 `/plugin install claude-code-setup@claude-plugins-official` |

安装前核对来源、内容、权限与授权；按具体缺口或有依据的质量目标选最小补充，检查实际作用和新增负担后再决定保留、缩减或撤回，详见 [05](../05-skills-and-plugins.md#3-插件与市场)。官方云会话不启动插件语言服务器，不能用本地安装替代会话支持；候选插件也不代表已证明有净收益。模板见 [templates/generic](../../templates/generic/)。

**依据**：[一手] [模型与 effort 配置](https://code.claude.com/docs/en/model-config)（2026-10-20 补核）、LSP 会话边界；[一手：独立团队自报] Cursor 7-30 复盘；[一手：公开接收／撤回] Bun 构建漏注册与 guard 撤回；[研究] 任务安排、扩展按缺口选择（未运行客户端，未运行产品）；核实 2026-10-22。

## 来源

- 分项核实日期与适用范围：[来源核查记录](../research/2026-10-10-audit.md)；执行位置、上下文与评审的专项证据见正文链接

- [anthropics/claude-code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- 官方文档：[Best practices](https://code.claude.com/docs/en/best-practices)、[Run agents in parallel](https://code.claude.com/docs/en/agents)、[Memory](https://code.claude.com/docs/en/memory)、[Extend Claude Code](https://code.claude.com/docs/en/features-overview)、[Large codebases](https://code.claude.com/docs/en/large-codebases)
- [Mods 源码](https://github.com/anthropics/claude-code/tree/main/mods)
- [GitHub issues（按点赞排序）](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- [Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)、[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)、[Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)、[隐写标记](https://thereallo.dev/blog/claude-code-prompt-steganography)、[Breaking auto mode](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)
- [Latent Space：Claude Code's Next Era](https://www.latent.space/p/thariq)
