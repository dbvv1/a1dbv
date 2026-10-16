# Claude Code

> 更新：2026-10-15
> 评级：✅ **采用**（日常开发 Agent 选项之一）

## 1. 定位

Anthropic 的 Agent 式编程环境：能读代码、改文件、跑命令、多步自主完成任务。可在终端、VS Code、JetBrains、桌面 App、Web（claude.ai/code，云端容器）、手机 App 上使用。它提供指令文件、Skills、Hooks、Subagents、MCP、插件等扩展；是否需要这些能力，应按任务判断，不能仅由扩展数量推断实际效率。**[研究：采用判断]**

## 2. 模型与价格（v2.1.280–2.1.293 changelog）

| 模型 | ID | 上下文 | 价格（输入/输出，每百万 token） | 缓存读取 |
|---|---|---|---|---|
| Fable 5.1 | `claude-fable-5-1` | 1M | $10 / $50 | $0.25 |
| Opus 5.5（默认 Opus） | `claude-opus-5-5` | 1M | $4 / $20 | $0.20 |
| Sonnet 5.5（默认 Sonnet） | `claude-sonnet-5-5` | 1M | $2 / $10 | $0.10（2026-10 减半） |
| **Haiku 5.5**（默认 Haiku，v2.1.293） | `claude-haiku-5-5` | 1M | $0.10 / $0.50（超过 10 万 token 的请求为 $0.50 / $2.50） | — |

- `/model` 切换模型，`/effort` 调推理强度（low → max），`maxEffortLevel` 可设上限。
- 订阅用户（Pro/Max）受 5 小时与每周额度限制，是否够用应按实际任务与账户用量判断，社区个案不能代表普遍可用时长（见 [11](../11-community-pulse.md)）。
- `/cost` 能看到 prompt cache 命中率和缓存未命中的可能原因（v2.1.260）；`promptCacheTtl` 可设为 1 小时。
- **子 Agent 可以单独指定 effort**（v2.1.292，Agent 工具的 `effort` 参数）：配合 Haiku 5.5，可以让检索类子 Agent 用便宜模型、低 effort，主会话用 Opus 5.5。
- Max 和 Team 订阅开始每月附带 API 额度（Max 5x 100 美元、Max 20x 200 美元、Team 最多 500 美元）；须领取并按运行入口核资格，不能抵所有 Code 用量，见 [18 成本治理](../18-team-adoption.md#5-成本治理)。**[一手：Anthropic 公告及资格说明，2026-10-15 补核]**。

## 3. 能力全景

### 3.1 指令与记忆
| 机制 | 说明 |
|---|---|
| `CLAUDE.md` | 托管策略 / 用户（`~/.claude/CLAUDE.md`）/ 项目（`./CLAUDE.md` 或 `./.claude/CLAUDE.md`）/ 本地（`CLAUDE.local.md`）四层；支持 `@path` 导入 |
| **AGENTS.md** | v2.1.277 起支持，但默认发现受父目录及 `CLAUDE.md`／`CLAUDE.local.md` 等条件影响；共享约定是否需显式导入、额外目录及加载观察边界见 [03 条件说明](../03-context-engineering.md)。配置模式不等于所有路径都自动加载 |
| `.claude/rules/*.md` | 用 `paths:` glob 让规则只在处理匹配文件时加载 |
| 子目录 CLAUDE.md | 按文件访问路径按需加载；2.1.288/293 分别修复 Write/Edit 和部分单文件 Bash 读取遗漏，见下文；`claudeMdExcludes` 可排除不相关的 |
| Auto memory | 默认机器本地，同仓库 worktree 共享；启动只加载索引前 200 行或 25KB（先到为准），主题按需读取。跨环境／委派所需事实仍须交接，见 [03 的记忆范围](../03-context-engineering.md#4-跨会话记忆) |

### 3.2 扩展
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
| 方式 | 一句话 | 状态 |
|---|---|---|
| Subagents | 会话内委派，返回摘要 | 稳定 |
| Agent View（`claude agents`） | 一个界面派发、监控多个后台会话 | 研究预览 |
| Agent Teams | Lead 分配任务，队员互发消息、共享任务列表 | 实验，默认关闭；**不自动用 worktree 隔离** |
| Dynamic Workflows | Claude 写脚本编排大量子 Agent，并交叉验证结果 | 付费套餐及支持的 API／云 provider 可用；Pro 需在 `/config` 开启，`/workflows` 管理运行 |
| Projects | Web、桌面或手机 App 的长期对话；通常开云端线程，需要本地资源时可指定 Remote Control 线程 | 公测（Pro/Max）；本机线程须保持电脑唤醒与连接进程运行 |

配套：`--worktree`（`-w`）、`worktree.sparsePaths`（大仓库稀疏检出）、跨会话消息、`/batch`（把一个大改动拆给 5–30 个 worktree 子 Agent）、`/loop` 与 Routines（运行位置和存续边界见下文）、`/goal`（会话级续接，评估器判断已展示证据而非独立验收，见 [07](../07-workflows.md#1-核心验证闭环-)）、Monitor 工具（订阅后台脚本事件）。

**按资源位置和持续时间选入口**：Projects 的本机线程可访问本地数据库、模拟器与 VPN 内资源，要求本机 Claude Code 2.1.280+；它使用本机工具与设置，带项目指令但不预载项目 memory，不能套用云端“关机后继续”的预期。Projects 可从 Web、桌面与手机 App 使用，不是 CLI／IDE 内的项目协调入口。[Projects 官方边界](https://code.claude.com/docs/en/claude-projects#run-a-thread-on-your-own-computer)。Dynamic Workflows 的启用和运行入口见[官方说明](https://code.claude.com/docs/en/workflows)。**[一手：2026-10-15 UTC，未运行客户端]**

**短轮询和独立定时分开选**：当前会话短轮询用 `/loop`；需要电脑关闭后仍运行，选云端 Routines（定时间隔至少一小时）；定时任务必须访问本地文件／工具时，可选 Desktop scheduled tasks，但电脑仍须开机。`/loop` 后台化可脱离终端，不能脱离运行机器；恢复会话会还原部分未过期的 `CronCreate` 任务，但已错过的一次性任务和 self-paced loop 不恢复，不能把“可恢复”当作退出后仍在执行。[调度比较与恢复例外](https://code.claude.com/docs/en/scheduled-tasks#limitations)、[Routines 间隔](https://code.claude.com/docs/en/routines#add-a-schedule-trigger)。**[一手：2026-10-15 UTC；研究：采用判断]**

**✅ 无人值守先限定停止与重试边界**：`claude -p` 可设 `--max-budget-usd` 和 `--max-turns`，但前者按客户端 API 费用估算停止，含子 Agent、可能超额，恢复进来的历史费用不计入本次上限；后者在 `--input-format stream-json` 中不阻止已排队消息开启各有上限的新一轮。因此它们不能代替跨运行预算或服务商账单上限。**[一手：[CLI reference](https://code.claude.com/docs/en/cli-reference)；研究：采用判断]**

2.1.299 修复了自发续写 mod 越过停止条件，以及重启／MCP 重连时的特定重复执行路径。恢复发布、提交或外部写入前，先查目标端是否已经完成，再决定重试；可控接口使用幂等键。涉及这些路径的旧运行器先评估升级，再做中断／恢复验收，别用多写一句“不要重复”替代运行器修复。修复记录不证明全部路径已具备 exactly-once 保证；本轮依据和未测范围见 [S1a](../research/2026-10-10-audit.md#s1a--2026-10-14-无人值守的停止与重试边界)。**[一手：固定 changelog；研究：采用判断]**

### 3.4 评审与安全
- `/code-review`（默认后台评审，终端 fork 继承当前历史；独立窗口不等于独立输入，见 [09](../09-review-and-quality.md#2-评审手段)；`--max-findings` 控制数量）、`/code-review ultra` 和 `claude ultrareview`（云端多 Agent 深度评审，可在 CI 里跑）、`/security-review`、`/simplify`。
- **Auto mode**（v2.1.283 起内建默认适用于交互终端与 VS Code，受配置和可用性影响）：规则及免审批路径先处理，其余适用动作交分类器，详见 [06](../06-hooks-and-guardrails.md#4-auto-mode实测数据)。
- 沙箱：macOS Seatbelt / Linux bubblewrap，可设网络白名单（`sandbox.network.strictAllowlist`），可屏蔽凭证（`sandbox.credentials`）。
- `--safe-mode`：排查被禁用的自定义内容，托管策略仍生效，不能据此排除全部配置原因；`--restricted`：去掉执行类工具。
- **`--bare` 不是普通 `-p` 的等价加速**：它跳过 `CLAUDE.md`、Skill、Hook、插件等自动发现；需显式提供任务所需上下文与工具，或保留普通模式。它也不复用订阅登录，切换前须确认已授权的认证与计费方式。自 2.1.286 起不发送系统提醒、不启动后台任务，超时命令停止而非转后台；详见[迁移时的选择与例外](../research/2026-10-12-development-conditions.md#交互试点转脚本bare-不是等价加速)。**[一手：官方文档与固定发布说明；经验：采用判断]**
- **✅ 扩展代码单独审查信任边界**：Bash 沙箱不覆盖命令型 Hook、MCP／LSP 服务或 mod 启动的进程；需要连这些扩展一起隔离时，把整个 Claude Code 进程放进受控容器／虚拟机。使用本地 `--plugin-dir` 的旧客户端应优先评估升级到 2.1.299：该版修复了沙箱命令改写插件目录、随后在沙箱外加载其代码的路径；不能由此推断插件本身已被隔离。**[一手：[沙箱范围](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)、[2.1.299 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.299)；研究：采用判断，未运行客户端]**
- **升级后 MCP 少了权限，先查匹配而非放宽权限**：2.1.299 收紧 allow 和子 Agent `tools:` 的服务器匹配；`mcp__a` 不再覆盖 `a__b` 或 `a_`。只需单个工具就列具体工具；确需整台服务器时使用完整规范化名 `mcp__<server>__*`，不要用宽泛前缀恢复旧行为。**[一手：[固定 changelog](https://github.com/anthropics/claude-code/blob/db93774d73e8fdbaf315a6f4c175ae99ad3d515a/CHANGELOG.md)；研究：采用判断]**

### 3.5 诊断与维护
| 命令 | 用途 |
|---|---|
| `/context` | 看上下文各部分占用 |
| `/doctor prompt-audit` | 检查 CLAUDE.md、Skills、Agents 中“为旧模型写的”提示写法（v2.1.283） |
| `/skill-doctor` | 找出没用到的 Skill 及其上下文成本 |
| `/insights` | 回顾近期会话，估算 auto mode 能省掉多少次确认 |
| `/fewer-permission-prompts` | 扫描历史，生成只读命令白名单 |
| `claude plugin validate / eval` | 校验插件，并对插件跑评测打分 |
| `/code-review --max-findings <n>\|all` | 控制评审报告的问题数量；中等 effort 下对 Opus 5.5 和 Sonnet 5.5 也会报告清理类问题和违反 CLAUDE.md 约定的问题（v2.1.290） |

## 4. 按任务选择的用法要点

1. **给它一个能自己跑的检查**：测试、构建退出码、截图对比。这些机制解决不同问题：Goal 维持目标，Hook 检查可执行条件，独立验证提供另一视角；不存在未经条件限定的强弱排序。**[研究：修正]**
2. **按未知和决策规划**：目标、兼容要求与授权清楚时，可以在执行中规划并连续完成；关键歧义会改变实现或验收时，再先调查、讨论或审方案。详见 [07 的规划分流](../07-workflows.md#2-标准节奏探索--计划--实现--提交-)。**[经验：采用判断]**
3. **大功能按需补 Spec，不强制换会话**：需求仍有关键取舍时，可用 AskUserQuestion 访谈并记录规格；需求明确且当前上下文仍有用时直接续做，探索历史成为负担或需要交接时再保存必要依据、开新会话。详见 [07 的访谈与会话条件](../07-workflows.md#3-大功能访谈式-spec-)。**[经验：采用判断]**
4. **积极管理上下文**：不相关的任务之间 `/clear`；同一问题反复纠正仍错时，先判断是错误上下文、实现缺陷还是验证缺口；若需要新会话，先保存产物和关键判断；`/btw` 问的问题不进入上下文。
5. **CLAUDE.md 按任务价值保留**：信息是否改善定位、必要行为或明确质量目标？删除重复、失效及无作用的内容；功能没出错不等于领域依据无价值，判据统一见 [03](../03-context-engineering.md)。规则未生效时先核加载路径和版本，不直接归因于文件太长。
6. **按任务选择 CLI 或结构化工具**（如 `gh`）：已有可靠命令可减少配置，但输出过长、权限不匹配或接口不稳定也会增加成本；没有跨工具对照时不称其“一定最省”。
7. **Writer / Reviewer 分离按风险试用**：原生检查与自查仍有明确缺口时，再用独立会话或评审子 Agent；以新增有效发现、误报和人工核查投入决定是否保留。高影响改动仍需必要的独立检查、人工判断与授权。评审输入和分层条件见 [09](../09-review-and-quality.md#按风险选择评审层不默认逐层叠加)，不默认每次叠加 reviewer。**[研究：采用判断]**
8. **批量改动**：先按 [15 §5](../15-task-playbooks.md#5-大规模迁移与升级)选现成迁移器或 Agent 补丁，按调用／类型差异试点；脚本调度可用 `claude -p`，并行或 `/batch` 只拆可独立验收的单元，共享依赖按顺序处理，自主度仍看风险与授权。

## 4.5 与 Codex 配合：先核对规则是否真的加载

固定 [Claude Code changelog](https://github.com/anthropics/claude-code/blob/2301018b1f61073c501a8e7a4813ef48c239163b/CHANGELOG.md) 记录了三个具体修复：2.1.287 避免 resume/压缩后同一文件夹的 CLAUDE.md 重复附加；2.1.288 修复 Write/Edit 访问范围内规则未加载；2.1.293 修复通过单文件 `cat/head/tail/sed -n/grep` 阅读时嵌套规则未加载。这些是官方发布说明，未在本轮运行对应旧版/新版对照。**[一手]**

✅ 当 Codex/Claude 表现不一致时，先查入口文件、导入、路径范围和实际版本，再判断是模型偏好还是提示太长。不要靠在两个文件里重复粘贴全部约束来补一个加载问题；也不要由这几条修复推断所有 shell 读取方式都会自动加载规则。**[研究：采用判断]**

🧪 交替使用 Codex 与 Claude Code 时，按当前任务交接明确的工作或独立问题，不强制每次修改都交叉评审。交接内容写当前目的、已完成产物、失败证据和需要检验的假设；若评审只复述另一端的总结，两种模型也可能共享同一个盲点。**[研究：采用判断]**

## 5. 2026 下半年的重要变化

| 变化 | 说明 | 证据 |
|---|---|---|
| **Opus 5.5 / Sonnet 5.5** | Opus 5.5“在大多数工作上达到 Fable 5.1 水平”，价格比 Opus 5 便宜；写作更清楚，长任务更稳；有测试者在不到一天内完成了 68 万行的代码迁移 | [一手：Anthropic] |
| **auto mode 成为默认**（2026-08） | 交互终端与 VS Code 的内建默认，受配置和可用性影响；不覆盖所有客户端或非交互任务 | [一手] |
| **Claude Projects**（2026-09 公测） | 在 Web、桌面与手机 App 中协调长期工作；云端线程可在电脑关闭后继续，需要本地资源时可指定 Remote Control 线程，但电脑须保持唤醒与连接 | [一手] |
| **Mods**（v2.1.287） | 用 TypeScript 修改界面和更深层的行为，社区已经做出了在 Claude Code 里跑的俄罗斯方块 | [一手] |
| **Claude Mods 与内置的“You should know”**（v2.1.287–2.1.289） | Mods 让插件可以修改更深层的行为；内置 Mod“You should know”让一个旁观的子 Agent 帮你盯住你和 Claude 可能遗漏的事（`/plugin enable cc-plugin-you-should-know@builtin`） | [一手] |
| **Managed Agents 接入**（v2.1.290） | `/claude-api managed-agents-onboard` 可以把文档或控制台模板直接变成托管 Agent 的配置（见 [16 自建 Agent](../16-building-agents.md)） | [一手] |
| 无人值守和交互会话区别对待（v2.1.289–2.1.290） | 后台命令的时间限制只用于 `-p`、Agent SDK、CI 和云端会话；WebSearch 额度改为按小时恢复（每小时 100 次） | [一手] |
| auto mode 的长会话处理（v2.1.289） | 会话太长、客户端安全分类器审不过来时，会先压缩而不是逐次弹出确认或失败 | [一手] |
| 自然语言写的 Hook 更可靠（v2.1.294） | 修复了写成指令（如“Block commands that…”）的 `prompt` / `agent` Hook 放行了本该拦截的操作；Stop Hook 写成“构建失败就继续”时，Claude 更少提前停下 | [一手] |
| 原生读取 AGENTS.md（v2.1.277） | 早期版本曾出现“只在开启遥测时才读 AGENTS.md”的 bug，已修复 | [一手 + 社区] |

**Opus 5.5 的官方用法建议**（[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)）**[一手]**：
- 一条消息给出完整任务、完成标准和停下来的条件；
- 删掉“think hard”这类话，改用 effort 控制；
- 运行中可以直接追加消息；
- 在 CLAUDE.md 里写停止规则；
- 长任务把清单写进 TASKS.md；
- 规定总结格式为“Blocked on me / Changed / Found”；
- 评审只列“会因此拒绝合并”的问题；
- 要求它标出无法确认的内容。

本仓库的模板已采用这些做法。

## 6. 已知问题与社区反馈

- **额度与账户事件只作个案参考**：[2026-02 的 Max 20x 用户报告](https://github.com/anthropics/claude-code/issues/26271)称在 Claude Code 2.1.44 上两三天耗尽周额度；[2026-10 的 V2EX 原帖](https://www.v2ex.com/t/1246477)自述账号被封。两者不证明当前套餐普遍可用天数、中文用户封号率或触发原因，不能据此决定套餐或规避账户限制；采用前核当前资格与实际用量，见 [18](../18-team-adoption.md)。**[社区：原帖；研究：撤回普遍断言，2026-10-15 补核]**
- **历史 Harness 开销案例**：Systima 在 2026-07、Claude Code 2.1.207／OpenCode 1.17.18 的隔离代理实验中测得首轮约 33k／7k 输入，并观察到缓存重写；不能据此判断当前默认开销或选择更省的客户端。先用 `/context` 与 `/usage` 检查实际工具负担、主会话缓存及重建原因，再删无用配置或在 headless／CI 中用 `--tools=` 收窄工具。自定义非第一方 API 网关默认关闭 tool search，兼容时可显式启用，但开关不能绕过服务端拒绝；不能把基础实验的差值归因于 MCP。原报告范围、当前诊断契约及代理例外见 [S1c](../research/2026-10-10-audit.md#s1c--2026-10-15-套餐与本地模型选型边界)，本仓库历史产物缺口见 [19](../19-experiments.md)。**[社区：历史实验；一手：当前契约；研究：采用边界，2026-10-15 补核]**
- **透明度争议** **[社区：原文]**：v2.1.196 被逆向发现会根据 API 地址和时区，悄悄改变系统提示里日期字符串的写法（疑似为了识别蒸馏），HN 2445 票。阿里以“后门风险”为由禁止员工使用 Claude Code **[二手]**。
- **auto mode 被绕过** **[社区：原文]**：Embrace The Red 用“总结网页 → 让 Claude 自己写解码脚本并在攻击者目录里运行 → 被同名 `struct.py` 劫持”的链条，作者迭代载荷后的三个变体各测 5 次，分别成功 3、3、4 次；只证明该攻击链可行，不代表生产绕过率。**auto mode 不能代替隔离。**
- **Opus 5.5“太独立”**：有用户反馈它在 auto mode 下越权，授权在一个区域执行的操作被它扩展到了另外 5 个区域 **[社区]**。
- **质量波动**：“2 月更新后无法胜任复杂工程任务”（583 个赞）；附和用户、口头禅等问题 **[社区]**。
- **checkpoint 不跟踪 Bash 造成的文件改动**，它不能代替 git **[一手]**。

## 7. 推荐起步：先原生，扩展按需选择

✅ 先确认任务目标、范围、完成标准与授权，复用项目已有指令和检查。目标清楚、原生能力与检查充分的小任务可以直接完成，不必先安装插件或增加独立评审；需要规划、换会话或独立检查时，按上文及 [07](../07-workflows.md)、[09](../09-review-and-quality.md) 的条件选择。**[经验：采用判断]**

下表是互相独立的条件示例，不是安装顺序：

| 已识别的需要 | 可选示例 |
|---|---|
| 项目缺少必要指令，需要生成初稿 | `/init`，再核对内容并删去重复或无关的说明 |
| 有诊断／语义引用缺口，现有检查与 IDE 无法满足，且当前会话支持 | 🧪 先准备语言服务器二进制，再试 `/plugin install typescript-lsp@claude-plugins-official`（TypeScript 示例） |
| 有明确漏审类型，需要在原生评审之外试用额外能力 | 🧪 `/plugin install code-review@claude-plugins-official` |
| 已有明确的项目指令维护问题，需要评估管理能力 | 🧪 `/plugin install claude-md-management@claude-plugins-official` |
| 有明确的重复人工步骤，需要评估自动化候选 | 🧪 `/plugin install claude-code-setup@claude-plugins-official` |

安装前核对来源、内容、权限与授权；按具体缺口或有依据的质量目标选最小补充，检查实际作用和新增负担后再决定保留、缩减或撤回，详见 [05](../05-skills-and-plugins.md#3-插件与市场)。官方云会话不启动插件语言服务器，不能用本地安装替代会话支持；候选插件也不代表已证明有净收益。模板见 [templates/generic](../../templates/generic/)。**[一手：LSP 会话边界；经验：采用判断]**

## 来源

- 分项核实日期与适用范围：[来源核查记录](../research/2026-10-10-audit.md)；执行位置、上下文与评审的专项证据见正文链接

- [anthropics/claude-code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- 官方文档：[Best practices](https://code.claude.com/docs/en/best-practices)、[Run agents in parallel](https://code.claude.com/docs/en/agents)、[Memory](https://code.claude.com/docs/en/memory)、[Extend Claude Code](https://code.claude.com/docs/en/features-overview)、[Large codebases](https://code.claude.com/docs/en/large-codebases)
- [Mods 源码](https://github.com/anthropics/claude-code/tree/main/mods)
- [GitHub issues（按点赞排序）](https://github.com/anthropics/claude-code/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- [Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5)、[Getting the most out of Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)、[Maximizing the value of your Claude Code sessions](https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions)
- [Systima token 开销实测](https://systima.ai/blog/claude-code-vs-opencode-token-overhead)、[隐写标记](https://thereallo.dev/blog/claude-code-prompt-steganography)、[Breaking auto mode](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)
- [Latent Space：Claude Code's Next Era](https://www.latent.space/p/thariq)
