# 09 · 评审与质量

> 编辑日期：2026-10-20（UTC+8）；本次补API修改与测试重试的确定性反馈选择。[历史核实范围](research/2026-10-10-audit.md#09-评审页历史核实范围)。

## 30 秒结论

✅ 先保留确定性检查和按风险的人审；写代码时需要第二视角，先用原生本地评审。🧪 只有具体漏审风险值得额外核查费用时，再选云端多 Agent 或交叉模型；同名命令、成功退出和空评论都不能证明完成了同一种评审。规则应放到该入口实际读取的位置。额外层只重复发现、制造无效修改或费用失控时，收窄／撤回。**[研究：采用判断]**

## 1. 质量数据：AI 代码的真实代价

| 来源 | 发现 |
|---|---|
| GitClear × GitKraken《The Maintainability Gap》（2026-06；2023–2026 年中累计数据），本轮读公开摘要与报告图页，未取得完整 PDF **[一手：厂商公开材料，观察性]** | 报告的重复指标相对增加 **81%**，但落地页正文与报告图页的单位冲突，不能据此设重复率阈值；代码移动占变更行由 2023 年 **12.7%** 降至 2026 YTD 的 **3.8%**，只是重构代理指标的占比，非重构工作量下降。旧代码更新也按占比统计，不能推断维护绝对量减少。可提示抽检重复、复用与错误处理；公开材料不足以把变化归因于默认 AI 工作流，方法及口径边界见[核对记录](research/2026-10-12-baml-and-review.md#gitclear维护信号的分母与采用边界) |
| Faros AI《The Acceleration Whiplash》（2026 Q2，2.2 万名开发者、4,000 个团队、两年遥测）**[一手：厂商公开页及详解，观察性]** | 同一组织最低与最高 AI 采用时期相比，事故数／已合并 PR 数之比约 **3.4 倍**，PR 在评审中停留时间中位数约 **5.4 倍**；代码 churn（季度内已合并代码删行／加行比）约 **9.6 倍**，不能全部译成返工，也可能含有益重构。事故比率不是单个 PR 致事故概率，评审停留不等于主动阅读工时；[公开详解](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways)未提供完整方法，不能外推本团队恶化幅度 |
| [Stack Overflow 2025 调查](https://survey.stackoverflow.co/2025/ai)，该多选题 31,476 人作答 **[一手：自报调查]** | 66% 选择遇到“几乎正确但仍有问题”的 AI 方案，45% 选择调试 AI 代码更费时；这是受访者遇到的挫折，不是输出缺陷率、合并率或实测返工成本 |
| Anthropic 长时应用开发复盘（2026-03）**[一手：作者实验自述]** | 自评偏宽松在主观设计上尤其明显；作者也发现新模型已能独立完成的任务中，额外 evaluator 会成为负担。只支持对具体缺口增加外部验证，不支持固定多轮互评；[原文与撤去环节](research/2026-10-12-long-task-evidence.md#3-历史-harness-自己已经撤去哪些环节) |
| *A Few Pages of Markdown*（arXiv 2608.25241v2）**[研究：全文；一手：分析代码；经验：分组／换算复核]** | 441 个仓库用于开发分类器，另在 509 个开源处理仓库中的 agent-first 分层比较：观察期未检出 AI IDE 配置痕迹的仓库，无／有提交配置组的 +52.7%／+26.7% 是作者对认知复杂度 `log(Y+1)` 系数作 `expm1` 的换算，非原量均值直接涨幅。终点配置多在采用 Agent 同期或之后出现，不能把增幅差归因于配置；[分组与方法边界](research/2026-10-13-context-study-reassessment.md#a-few-pages分组时间与维护) |

**实践推论 [经验：建议]**：这些相关性和厂商数据值得用来选择抽检重点，但不能单独证明 AI 导致了上述变化。评审可特别检查重复是否造成同步修改负担、异常处理是否真正吞掉必要信号、改动是否绕开已有抽象；不要为提高指标而机械增加旧代码改动、函数调用或重构配额。

**评估缺口与训练解释分开**：Dex 从快速测试型奖励的局限推测模型难学维护性、更多评审不能提高上限 **[社区：作者假设]**。应检查后续修改，但公开 benchmark 不代表全部训练信号，生成与评审的输入、搜索机会也不同，不能据此断言模型不可能改善。[BAML 双 PR 与原文复核](research/2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)记录具体反例和边界；更广的采用分析见 [14](14-synthesis.md#1-规律一验证覆盖与自主权分开判断) **[研究]**。

**对评审的启示**：
1. 把评审重心前移到**设计**（类型、接口、调用关系），而不是等 2000 行 diff 出来再看；
2. 让 Agent 按可运行、可评审的**垂直切片**提交；按行为、接口和风险设置检查点，不以固定行数作为审批门槛 **[经验：采用判断]**；
3. 测试代码本身要像需求一样认真审。

## 2. 评审手段

### 本地 / 会话内
| 手段 | 说明 | 评级 |
|---|---|---|
| `/code-review`（Claude Code 内置） | 本地评审，按正常用量计费；读 `CLAUDE.md`，不读 `REVIEW.md`。默认后台运行；终端 fork 继承历史，覆盖随模型、effort 变化 | ✅ 定向使用 |
| Codex `/review` | 本地选择未提交改动、某次提交或相对基线；报告发现，不改工作树；认证可选 ChatGPT 或其他支持方式，不能统称为仅订阅入口 | ✅ 定向使用 |
| `/code-review ultra` / `claude ultrareview` | 云端多 Agent，需 claude.ai 认证，正常本地用量之外计费；先确认实际启动云端及评审基线，CI 完成条件见下文 | 🧪 高风险变更 |
| `/security-review` | 按需安全审查；与自动运行的安全插件分开选择 | 🧪 定向使用 |
| `security-guidance` 插件 | 官方市场 2.0.13 含编辑提醒、Stop diff 与 commit／push 评审；依赖、外发和费用见下文 **[一手：固定源码]** | 🧪 有持续安全评审缺口时 |
| `/simplify` | 只看复用、简化、效率，不找 bug | 🧪 |
| 自定义评审子 Agent | 已有明确的漏审类型或复杂变更需要独立检查时使用（模板：[code-reviewer](../templates/generic/.claude/agents/code-reviewer.md)） | 🧪 按风险试用 |
| **另一家的模型交叉评审** | 比较新增有效发现、误报和审查成本；换品牌不自动获得独立证据 | 🧪 不默认每次互审 |

**安全插件先选运行层。** `security-guidance` 2.0.13 的模型评审把 diff／相关代码送往配置的 Anthropic、网关或第三方 provider，默认跟随最新 Opus。只需模式提醒可关模型层，但独立的 SessionStart SDK 引导安装仍在；不能接受自动依赖准备就先不装。保留模型评审前核数据路径、预算与完成情况：编辑提醒不证明模型层运行，空结果不证明安全。[固定实现与真实失败反例](research/2026-10-12-baml-and-review.md#安全插件从提醒到自动模型评审)。**[一手；研究：采用判断，2026-10-14 UTC，未运行]**

**独立审阅先核输入。** 终端 `/code-review` 默认 fork 继承历史，适合就地复查；确需排除实现推理时，另起干净会话或非 fork 子 Agent，只传需求、验收与可核查产物，不默认叠加 reviewer。前台例外和版本范围见[证据记录](research/2026-10-12-baml-and-review.md#评审窗口与输入历史的区别)。**[一手：2026-10-15 UTC 官方契约；研究：采用判断]**

**评审子 Agent 的提示要点**：给 diff 和能追到原需求或已确认验收的判据，不灌入实现过程中的推理；明确要求“**只报告影响正确性或违背需求的问题，不报告风格偏好**”。遇权限、解析或接口变化，沿具体风险查未改的消费者，必要时用能区分假设的输入核验；计划合规与用户目标成立分别判断。复用已有判据，不要求所有任务另写 spec 或增加 reviewer。固定源码与反证见[输入交接记录](research/2026-10-12-baml-and-review.md#后续任务相同-brief-与过期接口)。**[研究：采用判断]**

**合并前按最终差异核测试。** 撤掉用例或再次整合主干后，分开记录作者称跑过的测试、最终树保留的覆盖及运行回执对应的树；按风险补回归，不机械恢复所有删例。[Immich 的故障测试撤回](research/2026-10-13-immich-handover.md#补充证据新对象通过不等于原失败对象已恢复)与[LangGraph 的复测树与最终整合树](research/2026-10-12-long-task-evidence.md#完成状态正确已完成动作仍可能被重新执行)支持这一区分。**局限：源码中的测试定义不是运行结果，测试未随补丁保留也不证明作者从未运行过。** [一手／社区／研究]

**✅ 必须阻止间歇失败进入交付时，保留有限重试用于诊断，另设放行条件。** Playwright 1.52+的 `failOnFlakyTests` 可让重试后通过的 flaky 结果仍以错误退出，再由现有必需检查接收失败结果；无需为此关闭重试或添加模型评审。定位首轮失败时，`on-first-retry` 只记录重试，应选 `retain-on-first-failure` 保留首轮失败 trace；它会录制首轮，仍有成本。已有报告和门槛足够就复用，是否容许已知 flaky 继续交付由风险决定。见[原生回归与两项目取舍](research/2026-10-12-development-conditions.md#测试重试诊断证据与放行条件分开)。**[一手；经验：条件选择，未运行候选]**

**依赖升级后，先追消费者要的值与时点，再改红测试。** 上游不再原地改历史时，记录器应读本轮副本，保留两次不同渲染产生两个公开提示词事件的要求；仅错误钩子提前时才改时点断言，仍验收尾持久结果。不要为保绿统一改预期或恢复已去掉的副作用。见[同一下游的两种修订](research/2026-10-12-development-conditions.md#后续依赖升级旧观察点过时不等于消费者结果可以丢)。**[一手：固定补丁与测试定义；研究：采用判断，2026-10-15 UTC]** 局限：未运行这些测试，公开事件契约不等于真实服务已恢复。

**模型与 effort 不按客户引言直接选**：Opus 5.5 发布页的低 effort 优势来自 Deloitte 客户转述，未公开其缺陷集、样本量与误报判定。可作为候选线索，不能据此默认低 effort 足够或替代本仓配对评估。[原始归属与边界](research/2026-10-12-baml-and-review.md#调查模型转述与第三方服务的采用边界)。**[一手：厂商刊载客户自述；研究：采用判断]**

本地入口依据：[Claude 评审文档](https://code.claude.com/docs/en/code-review#review-a-diff-locally)、[Ultrareview 比较](https://code.claude.com/docs/en/ultrareview#how-ultrareview-compares-to-code-review)、[Codex CLI](https://learn.chatgpt.com/docs/codex/cli)。**[一手：2026-10-14 UTC]**

### PR / CI
| 工具 | 说明 | 评级 |
|---|---|---|
| [Claude Code GitHub Action](https://code.claude.com/docs/en/github-actions) | 自有 workflow 内运行 Claude；触发、权限、提示由工作流决定，可用 API key 或订阅 OAuth。不是托管 Code Review 的等价入口 **[一手]** | 🧪 需自管 CI |
| Claude Code Code Review（托管） | Team／Enterprise 研究预览，需组织启用；单独 usage credits 计费，不能由本地订阅可用推断托管可用 **[一手]** | 🧪 关键 PR |
| [Cursor Bugbot](https://cursor.com/docs/bugbot#pricing) / [Security Agents](https://cursor.com/docs/security-agents) | Bugbot 按用量计费，旧 seat 方案仍有过渡；先核账户实际方案与预算，不用 5 月平均单次成本作当前报价。Security Reviewer 查 PR，Vulnerability Scanner 查存量代码；部署监控 Rollouts 不能替代评审 **[一手：2026-10-14 UTC 文档；研究：选择边界]** | 👀 已用 Cursor 且有对应缺口时 |
| [Codex `@codex review` / `@codex security review`](https://learn.chatgpt.com/docs/third-party/github) | 先连接仓库并配置评审；规则写入根／适用子目录的 `AGENTS.md`。安全评审是额外的定向评审，不能把普通评审无发现当安全验收 **[一手]** | 🧪 |
| **Codex Security Cloud**（研究预览，2026-09 DevDay） | 扫描已连接的 GitHub 仓库或监控新提交，给出发现、**验证证据**和补丁，再生成草稿 PR | 👀 **[一手]** |
| CodeRabbit、Greptile、Qodo | Claude Code 官方市场收录的**第三方集成**，不等于 Anthropic 自研或已证明更有效；先核服务资格、数据外发与是否自动增加评审轮次。[固定来源与差异](research/2026-10-12-baml-and-review.md#配置诊断插件评估与第三方集成的范围) **[一手；研究：采用边界]** | 👀 有具体缺口再接 |

### 云端入口和 CI：先辨认完成了什么

**[一手：2026-10-14 UTC，官方契约]** `/code-review ultra` 不可用时可能退回本地评审；需要云端能力时，核对实际运行位置。脚本用 `claude ultrareview` 等待结果，不能用会提前退出的 `claude -p '/code-review ultra'` 代替。前者退出码 `0` 只表示完成，**有发现也返回 0**；`--json` 返回原始 `bugs.json`，不是托管 check 的严重度统计。

🧪 Ultrareview 当前通常每次 5–25 美元 usage credits；Pro／Max 用户每账号有一次性 3 次免费额度，并非周期刷新。CI 超时后云任务可能仍在跑，重试会新建并再次计费。先核查旧任务再重试；子命令由用户直接执行时视为接受计费／条款，缺少 merge base 还可能扩大到整仓，接 CI 前须明确预算和范围，不直接照搬命令。[官方入口与计费](https://code.claude.com/docs/en/ultrareview#run-ultrareview-non-interactively)。**[研究：采用判断]**

### 重复的窄评审：何时接 Codex Action

**👀 每个 PR 重复相同窄评审时，再评估 [Codex Action](https://github.com/openai/codex-action)。** 基线是手动 Codex 评审、确定性 CI 与人工判断；隔离 runner、最小权限和预算具备后，才试统一触发与报告，不默认批准/合并。固定 [Action SHA](https://github.com/openai/codex-action/blob/bdf19a4a223ec2549a3e2274a0cf61556bc07675/action.yml)及 CLI 依赖；该版本 Windows 仅接受 unsafe，应改用合适的隔离 runner。**关键局限**：自动化不保证更多有效发现，空/失败报告不算无问题；按[安全文档](https://github.com/openai/codex-action/blob/main/docs/security.md)隔离不可信 PR 与凭据、特权步骤，误报或费用失控就保留手动。**[一手；经验：采用判断，2026-10-12，未运行]**

### 托管多 Agent 评审的实际数据：Claude Code Review

Anthropic 在 2026-03 推出 Code Review 时公布了内部使用的数据 **[一手：厂商自述，内部数据]**：

| 指标 | 数值 |
|---|---|
| 收到实质性评审意见的 PR 比例 | 从 **16%** 提高到 **54%** |
| 被工程师标为“错误”的发现 | **不到 1%** |
| 超过 1000 行的 PR | 84% 有发现，平均 7.5 个问题 |
| 少于 50 行的 PR | 31% 有发现，平均 0.5 个问题 |
| 耗时和成本 | 平均约 20 分钟；每次 15–25 美元，按 token 计费 |

**两个真实例子**：
- Anthropic 内部一个看似常规的单行改动，被标为严重问题：它会让某个生产服务的认证失效；
- TrueNAS 在重构 ZFS 加密时，评审发现**相邻代码里一个早已存在的**类型不匹配，它会在每次同步时悄悄清空加密密钥缓存。

**机制**（官方文档）：
- 多个 Agent 各查一类问题，再由一个**验证步骤**对照实际代码行为过滤误报，然后去重、按严重度排序；
- 严重度分三级：🔴 合并前应修的 bug、🟡 小问题、🟣 这次 PR 之前就存在的 bug；
- check run 为 neutral，失败／超时也如此；不能靠它的结论直接阻止合并。官方提供末尾 `bughunter-severity` JSON，`normal` 是 Important 数量。**[一手]**

**确需门槛时 [经验：设计条件]**：核报告来自预期应用、对应当前 PR head SHA、评审成功完成，再验字段类型并按团队严重度阈值处理。待完成、失败、额度跳过、缺失／解析失败／过期均转人工或不通过，不能填零。门槛须另设 required check；`normal > 0` 是待处理发现，非独立证实的 bug。不能辨认成功报告就保留提示型评审。[官方输出与失败语义](https://code.claude.com/docs/en/code-review#check-run-output)。

**独立的组织案例，不能当作本产品效果**：[Intercom 原文](https://www.intercom.com/blog/ai-is-approving-our-pull-requests-heres-how-we-made-it-safe)报告其自建审批系统在两个主代码库中自动批准超过 19% 的 PR；停机时间下降 35% 是整体研发转型期间的组织结果。系统限制大而复杂的变更，发布者仍须监控并能回滚；不能据此默认开自动批准或把下降归因于托管 Claude Code Review。**[一手：使用方自述；研究：归因边界]**

**怎么看这些数字**：
- 它们是“验证后再报告”的内部使用信号；“被标为错误不到 1%”缺少完整独立判定的分母，不能直接当成整体误报率、精确率或召回率；
- 但都是厂商自己的数据。“实质性意见比例”衡量的是覆盖面，不等于逃逸缺陷减少了多少；
- 15–25 美元是平均范围而非报价上限；逐 push 会累加。先用本地正常用量评审，符合托管资格且启用服务时，才对关键 PR 手动 `@claude review`。当前裸命令只触发一次，`always` 才订阅后续推送；fork PR 不会因 `always` 自动跟随后续推送。**[一手：2026-10-14 UTC 官方文档；研究：成本选择]**

### 用 REVIEW.md 调教评审

托管 Code Review 会读两类文件；不要把此契约推广到本地、Action 或 ultrareview **[一手：文档；研究：范围边界]**：
- `CLAUDE.md`：新引入的违规按 🟡 报告。如果改动让 CLAUDE.md 的某条描述过时了，也会提示更新文档；
- 根目录 `REVIEW.md`：给查找、验证及报告阶段使用。官方称这比长 `CLAUDE.md` 更可靠；这是厂商对输入机制的说明，**不是已测的遵循率或强制执行保证**。

以下是官方给出的写法示例，按仓库取舍，不是统一政策：
- **严重度与证据**：例如约定行为破坏、泄露或阻碍回滚才算 Important；行为断言引用 `file:line`，不从命名推断
- **检查范围**：按需约定跳过哪些生成代码、lockfile、vendor 或 CI 已管的问题；补仓库特有的 API 测试、日志隐私、租户隔离要求
- **报告与收敛**：限制 Nit 数量，先报事实／风格统计；复审只报 Important，无阻塞直接说明

保持简短，避免稀释关键规则；起点见 [REVIEW.md 模板](../templates/generic/REVIEW.md)。

> 注意：后台 `--fix` 修改不在会话 checkpoint 内，须用 git 回退；前台运行的修改可随 `/rewind` 撤销。是否读规则与是否执行规则须分开核验。

### 按风险选择评审层，不默认逐层叠加

| 层 | 什么时候 | 用什么 | 拦什么 |
|---|---|---|---|
| 0. 确定性检查 | 每次保存或提交 | 格式化、lint、类型检查、单元测试（Hook 或 pre-commit） | 机器能判定的问题；增量运行另核[相关测试是否被选中](15-task-playbooks.md#6-补测试)。**不要让 AI 评审去报这些** |
| 1. 作者自查 | 推送前 | 先对照需求、diff 和现有测试；仍有具体风险时调用原生评审 | 实现遗漏与尚未覆盖的行为 |
| 2. 额外 Agent 评审 | 已有检查仍漏掉某类问题，且新增发现值得人的核查投入时 | 先比较单 Agent 的提示调整／原生能力，再试独立或多模型评审 | 目标风险上的新增有效发现；不重复 CI 已报问题 |
| 3. 人工评审 | 按项目准入与变更风险，合并前 | 按 [第 1 节](#1-质量数据ai-代码的真实代价)看设计、重复、错误处理及测试；先自行确认关键路径，再核对 AI 意见 | 需求取舍、设计与未被建议覆盖的风险，不只批准 AI 列出的项目 |
| 4. 抽样复盘 | 每周或每月 | 抽查已合并的 AI PR、AI 评审漏掉的线上问题 | 校准前三层：把漏网的问题写进实际入口读取的规则文件或测试 |

**API 修改先补缺失的确定性反馈，不默认再加评审模型。** ✅ 已有成本可接受、覆盖所需版本与真实请求／响应的集成测试，就先复用。维护公开 OpenAPI 时，比较已发布契约与本次生成契约，检查会破坏旧客户端的变化；schema差异工具只比较声明，仍须验实现与声明相符。🧪 可识别的消费者与提供方独立演进、双方愿维护验证和测试状态时，再评估 Pact：用真实消费者代码生成交互契约，由 provider 验证；只有消费者 mock 通过不够。陌生公共 API、对方不参与或状态不可控时，不为“有契约测试”强接 Pact。**局限：契约匹配不证明数据库副作用、完整业务或所有已部署版本兼容，保留相应集成／端到端检查。** [官方范围、成熟项目两种采用与反例](research/2026-10-12-development-conditions.md#api修改声明差异消费者契约与真实集成)。**[一手：固定文档与实现；经验：采用判断]**

**采用判断 [研究]**：新增评审须补已有缺口，评论数不算收益。CRBugBench 同模型比较中，调整单评审提示可用更低代价取得接近五候选集成的历史缺陷检出率，收益随模型变化。人工受控实验中，AI 意见集中人的注意力，未检出审查时间收益；故高风险人审保留自己的范围。研究未证明当前 Codex／Claude 在你的仓库优于测试加定向人审，采纳评论或改代码也不等于修对 bug。[比较、人的负担与边界](research/2026-10-12-baml-and-review.md#额外评审的增量与人的负担)。

**处理负担过大就收窄 [研究：采用判断]**：可先关重复状态评论、收窄问题类型，不为清空意见扩大修改。[Crossplane](research/2026-10-12-baml-and-review.md#crossplane有用意见与收窄评审可以同时成立)选择性采纳后降低强度、关闭状态评论但保留 GitHub 检查；这不证明净工时或缺陷改善。

**跨仓修复后，按实际依赖版本复核，不只看本 PR 的 head。** 上游修复而目录 PR 未变时，增量评审可能跳过；全量完成也不证明实际分发版本已核实。分开记录机器人发现、作者确认、固定补丁与行为复测；缺产物或验证时保留人审，不以重复调用代核验。[ComfyUI 目录 PR 的实际链条](research/2026-10-12-baml-and-review.md#跨仓修复本-pr-未变不等于评审对象未变)有确认与补丁，未随补丁新增所要求的回归测试，目录 PR 仍未合并；不提高评级。**[一手／社区；研究：采用判断，2026-10-16 UTC]**

Anthropic 内部实践也强调：评审 Agent 职责要窄，**必须证明自己的发现成立**，对自动批准的结果按风险抽样给人复核（见 [10 第 3.4 节](10-security.md#34-参考架构anthropic-如何保护80-代码由-claude-写的开发流程)）。

## 3. 给自己的 AI 配置做评估

改 CLAUDE.md、Skills、规划或模型后，先回答“**在哪些任务上，以什么代价，哪项结果改善了**”。✅ 建议做配对评估；不把一张排行榜当成因果证据。

### 3.1 独立结果与方法边界

以下读过正文及原始工件，核对日期为 2026-10-10 UTC；没有重跑其模型实验。

| 证据 | 能支持什么 | 不能支持什么 |
|---|---|---|
| [AGENTS.md 研究 v3](https://arxiv.org/html/2602.11988v3)，300 个 Lite + 138 个 CTXbench 任务，4 个模型配置 **[研究：受控比较]** | 未检出相对无文件的显著成功率改善；生成文件增加约 20–23% 推理费用；应核查具体指令的作用 | 不能从旧版标题推成“所有文件必然降低正确率”；单次/条件、Python 仓库不代表所有项目 |
| [SkillsBench v4](https://arxiv.org/html/2602.12670v4)，87 个任务、18 个模型—harness 配置 **[研究：配对比较]** | 人工整理包的平均验证器得分 33.9→50.5；Codex GPT-5.5 配置 +19.7 个百分点 | 主分数含部分得分；严格 solved 另报 31.3→47.7%。优先选健康替补运行，不等于首次尝试可靠性；模块数量分组不是长度随机实验 |
| [规划研究 v3](https://arxiv.org/html/2604.12147v3)，21,120 条 SWE-agent 轨迹，4 个模型、8 种计划 **[研究：消融]** | 短的定位→复现→修复→验证流程有受控支持；额外阶段也可能伤害结果。[原始轨迹](https://github.com/Intelligent-CAT-Lab/Planning-Analysis/tree/main/raw_trajectories)可查 | 不等于原生 Codex 的规划模式或所有任务都该写长计划；遵循计划与成功相关不单独证明因果 |
| [多 Agent 扩展研究 v3](https://arxiv.org/html/2512.08296v3)，260 配置/6 基准 **[研究：受控比较]** | 协作收益随任务变化；先比较单体与候选，不只凭 45% 或 87% 决定新任务的单体／多体架构；[完整候选组评估与静态复算](research/2026-10-12-experiment-records.md#架构阈值与完整候选组不能按45或87硬路由)于 10-15 补核 | 新协议与论文 87% 的评价单位不同；编码每基准 20 任务，阈值依赖收益端点，迭代数也不等于 token／金额预算 |
| [重复运行研究](https://arxiv.org/html/2609.33812v1)，584 次单一 ML 任务运行 **[研究：重复实验]** | 少量运行的排名不稳；违规高分需先过滤；[原始结果、程序和分析](https://github.com/earino/identical-runs-different-results)可离线复核 | 多次重复同一任务不能代替多样任务，也不能证明某 harness 一般更强 |

🧪 **工件可用性也算证据**：SWE-Skills-Bench 的 [论文](https://arxiv.org/html/2603.15401v1)仅用 Haiku 4.5，报告小幅收益；其 [声明仓库](https://github.com/GeniusHTX/SWE-Skills-Bench)在核对日经网页与 GitHub API 均返回 404，且正文的注入位置描述不一致。不能标为本仓库已复现。持续记忆的选样、检索和工件边界见 [03](03-context-engineering.md)。

**测试通过不等于能合并 [研究]**：[METR](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/)请 4 名维护者审 296 个 AI 补丁，并以 47 个人工历史补丁校准；归一化后的维护者接受率平均比自动评分低约 24 个百分点。人工旧补丁也只有 68% 被接受，不能省略这个基线。[OpenAI 的失败子集审计](https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/)还发现测试缺陷与污染；其中 59.4% 指被审计的困难子集，不是整个 Verified。

### 3.2 最小可靠设计

结合上述研究与 [官方评估指南](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)，以下为 **[经验：方法建议]**：

1. **先锁任务和判据**：从真实失败取样，也放入普通任务、反例、无需修改与仅部分修复的任务，分别检查不必要的修改和仍有缺陷却提前停止；不要只以补丁更少判断改进。见[双向失败的选样依据](research/2026-10-12-baml-and-review.md#无需修改与部分修复要一起评估)。5–10 个用于先导检查；小差异不能靠这个规模定论。扩展到 20–50 个独立任务后，仍按方差与目标差异决定样本量。
2. **一次只改一项**：同一任务配对，固定模型/版本、effort、工具、权限、环境和总预算；随机交错 A/B，使用干净快照与新会话。对比不同 harness 不能归因给其中某个 Skill。
3. **独立验证**：隐藏验收测试不进入 agent 工作区；参考补丁证明可解；新增回归测试须在旧代码上失败。模型自评和“读过 Skill”都不能代替验收。多 Agent 要测合并后的行为。
4. **完整计账**：保留所有尝试，区分基础设施错误、agent 超时和语义失败；预先规定重试和同一单元的取舍。记录首试与重试后结果，包含协调、记忆生成、人工修复/评审时间。
5. **避免假独立**：按任务汇总配对差异和不确定区间；29 个检查点不是 29 个任务，重复三次也不保证有统计把握。全过/全失败只能说明量表饱和，不能临时挑有利任务。
6. **明确指标**：严格通过、部分得分、流程合规、人工可合并性分开；pass@k 是多次中至少一次，实际交付还需要可执行的选择器；pass^k 是多次都过。不显著不等于等效。
7. **保留可复核记录**：固定输入、补丁/配置 hash、任务×条件×重复编号、模型版本、测试日志、失败类别、重试关系和分析脚本。公开前去除凭据、私人信息与内部路径。

[19 的 E5](19-experiments.md#8-e5公开结果表的离线复核)给出真实 CSV 的取舍敏感性核对；[工作流消融夹具](../experiments/workflow-ablation/)只验证评估器机制，不提供模型效果数据。E1–E3 缺完整原始工件，未独立复现，不宜凭汇总数字推广或声称精确可复现。

**按评估对象选工具 [一手；研究：采用判断]**：测 Claude Code 插件／Skill 行为可评估 [`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals) 的有／无插件对照；它不加载项目 `CLAUDE.md` 等配置，不能直接替代整个工作流的配对评估。运行及模型裁判均耗额度／API 费用，先核预算与报告发布选项；语法、调用次数和评分不等于可交付。[范围核对](research/2026-10-12-baml-and-review.md#配置诊断插件评估与第三方集成的范围)。

### 将配置评估变成可复查的记录

进一步落地见 [22 评估 Agent](22-agent-evaluation.md)：区分任务成功率与断言通过率，保留失败和重试成本，使用留出集并校准模型裁判。

## 4. 实践清单

- [ ] 按风险选择 AI 评审；保留独立测试和必要的人工评审，不把“每次都用”当成已证实收益
- [ ] 评审重点：重复代码、被吞掉的错误、旧代码是否该改却没改、测试是否真的在测
- [ ] 关键路径可试交叉模型评审，并抽查误报、漏报与人工处理成本
- [ ] 维护一个私有评估集，换模型或大改配置时重跑
- [ ] 配置有冲突或上下文负担时，先检查实际加载内容；Claude Code 可用时用 `/doctor prompt-audit` 找过时／冲突指令，用 `/skill-doctor` 查看调用与上下文成本。它们不能证明效果，少用也不是删除依据；不为这项检查默认安装额外 linter。命令版本与连接限制见[范围核对](research/2026-10-12-baml-and-review.md#配置诊断插件评估与第三方集成的范围) **[一手；研究：采用判断]**

## 来源

- [Faros AI：The Acceleration Whiplash](https://www.faros.ai/research/ai-acceleration-whiplash)（厂商报告页）；[十项详解](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways)，口径与缺口见[核查附注](research/2026-10-12-baml-and-review.md#faros公开指标的口径补核)
- [HumanLayer：Why Software Factories Fail](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md)
- [GitClear：The Maintainability Gap（2026）](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)（一手：公开摘要与报告图页；完整 PDF 未取得）
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [Agent Skills：Evaluating skills](https://github.com/agentskills/agentskills/blob/main/docs/skill-creation/evaluating-skills.mdx)
- [Code Review for Claude Code](https://claude.com/blog/code-review)（2026-03，内部数据）、[How Anthropic secures its AI-native SDLC](https://claude.com/blog/how-anthropic-secures-its-ai-native-software-development-lifecycle)（组织实践）；[Intercom 审批原文](https://www.intercom.com/blog/ai-is-approving-our-pull-requests-heres-how-we-made-it-safe)
- [Claude Code：Code review](https://code.claude.com/docs/en/code-review)、[Ultrareview](https://code.claude.com/docs/en/ultrareview)、[Plugin evals](https://code.claude.com/docs/en/plugin-evals)
- [Cursor Bugbot 当前计费](https://cursor.com/docs/bugbot#pricing)、[Security Agents](https://cursor.com/docs/security-agents)、[Rollouts](https://cursor.com/docs/rollouts)

## 可执行案例：独立验证要独立到什么程度

[Catalog Compare 复核](research/2026-10-10-catalog-compare.md) 提供一个具体例子：原项目使用另一个 CSV 解析器核对导出，但这并未独立核对全部业务数值。本轮运行公开检查并补充原 CSV → Python Decimal → 实际输出的比较，41 个匹配行通过；同时发现旧浏览器记录未覆盖当前 HTML hash。**[研究：离线执行]**

✅ 采用多种验证视角时，说明独立的是预期、解析实现、计算方式还是执行环境。多开一个 reviewer 不自动获得这些独立性；反过来，一份可重跑的确定性检查可能比另一段赞同意见更有用。不要把检查数当作质量分数。**[研究：采用判断]**
