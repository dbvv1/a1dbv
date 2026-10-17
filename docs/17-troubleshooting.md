# 17 · Agent 跑偏了怎么办：故障排查手册

> 更新：2026-10-18（UTC+8）
> 按“**症状 → 原因 → 处理**”组织。每个处理方法都尽量给出可以直接用的提示词或配置。
> 依据：
> - Anthropic 的模型迁移和提示指南（Claude API 官方 Skill 中的 `model-migration.md`）**[一手]**。其中的提示词是 Anthropic 在 Fable 5.1 上测试过的，**原文是英文、部分句子“承重”**，下文给出原文和中文意思；用在其他模型上效果需要自己验证 **[经验]**；
> - Claude Code 官方最佳实践和 changelog **[一手]**；
> - 社区案例 **[社区]**、研究 **[研究]**。

## 0. 先看诊断工具

| 想知道 | 用什么 |
|---|---|
| 上下文被什么占满了 | Claude Code `/context` |
| 钱花在哪里、缓存为什么失效 | 先用原生 `/usage`、Codex `/status` 与服务商账单，再按 [02](02-models-and-cost.md#31-查异常消耗ccusage-只补历史诊断)试用 ccusage；面板不能代替根因定位 |
| 配置里有没有为旧模型写的过时指令 | `/doctor prompt-audit`、`/skill-doctor` |
| Agent 到底做了什么 | 会话记录（transcript）、Agent View；团队可以接 OpenTelemetry |
| 被禁用的自定义配置是否影响行为 | `--safe-mode` 对比；托管策略仍生效，结果不变不能排除全部配置原因，见[当前 CLI 边界](https://code.claude.com/docs/en/cli-reference#cli-flags) |

## 1. 症状速查表

| 症状 | 最可能的原因 | 第一步处理 | 详见 |
|---|---|---|---|
| 说“完成了”，其实没做完或没验证 | 没有可运行的完成标准；长任务中的进度幻觉 | 先给可运行检查，再选择提示、`/goal` 或命令型 Stop Hook | [2.1](#21-谎报完成或进度) |
| 改测试让它通过、跳过检查 | 验证器可以被绕过 | 核原生权限与匹配编辑事件的确认；评审测试 diff | [2.2](#22-绕过验证改测试跳过检查) |
| 改了没让它改的东西 | 范围没说清；模型“顺手”修 | 写明边界；顺手的发现只列在总结里 | [2.3](#23-范围蔓延和越权) |
| 老是问“要不要我…？”、说完计划就停 | 授权／任务边界不清，或确有提前停 | 先核停止原因与授权；范围明确仍提前停时才试自主提示 | [2.4](#24-过度请示或提前停下) |
| 小改动却重写整个文件 | 模型偏好 | 要求“外科手术式”编辑 | [2.5](#25-整文件重写和改动膨胀) |
| 提交了一堆临时测试脚本 | 验证用的脚本被留了下来 | 临时脚本放在仓库外 | [2.5](#25-整文件重写和改动膨胀) |
| 越聊越笨、忘了之前的约定 | 历史过长、信息丢失或输入反复填满 | 先 `/context` 定位；按原因压缩、缩小输入或交接 | [2.6](#26-越聊越笨上下文腐化与压缩丢失) |
| 编造 API、用过时的写法 | 训练数据过时，版本差异 | 让它先查源码或当前文档 | [2.7](#27-api-幻觉和过时知识) |
| 同一个错误反复修不好 | 错误思路累积，也可能是输入过大或验证环境故障 | 先分清推理打转、thrashing 与执行失败 | [2.8](#28-在同一个错误上打转) |
| 额度一下子烧完 | 多 Agent、缓存变化、循环等候选原因 | 先区分订阅额度与 API 费用，再看会话/子任务用量 | [2.9](#29-成本暴涨) |
| 执行了破坏性命令 | 权限过大，没有隔离 | 沙箱、deny 规则、备份 | [2.10](#210-破坏性操作) |
| 总结读不懂 | 长会话中的速记式表达 | 规定总结的写法 | [2.11](#211-输出难读) |
| 正常请求被拒 | 模型拒答、工具权限或 API 故障 | 先看原始拒绝信号，再选澄清、授权或故障恢复 | [2.12](#212-正常请求被拒绝) |
| 一次抓取失败就说网站／能力不可用 | 能力未暴露、执行路径失败或页面拒绝尚未区分 | 核当前入口与原始结果；允许时用正常浏览器读取同一公开 URL | [2.13](#213-一次读取失败就判断整体不可用) |

## 2. 逐项处理

### 2.1 谎报完成或进度
**原因**：没有可运行的完成标准时，“看起来做完了”就是唯一的停止信号（见 [07](07-workflows.md#1-核心验证闭环-)）；长时间运行时，模型可能编造进度。

**处理**：
1. ✅ 先在提示中写清检查命令和通过条件；需要跨轮继续时，Claude Code 可用 `/goal`，需要程序化判定时用命令型 **Stop Hook**。官方区分了三者：`/goal` 是会话级 prompt 型 Stop Hook，其评估器只读对话证据，不独立跑测试；命令型 Hook 才执行配置的检查。**[一手：[最佳实践](https://code.claude.com/docs/en/best-practices#give-claude-a-way-to-verify-its-work)、[Goal 评估](https://code.claude.com/docs/en/goal#how-evaluation-works)]**；
2. 要求进度汇报**逐条对应工具结果**。Anthropic 测试中，这段提示“几乎消除了”在专门设计的诱导任务上编造进度的情况 **[一手]**：
   > Before reporting progress, audit each claim against a tool result from this session. Only report work you can point to evidence for; if something is not yet verified, say so explicitly. Report outcomes faithfully: if tests fail, say so with the output; if a step was skipped, say that; when something is done and verified, state it plainly without hedging.

   （汇报前，把每一条结论对照本次会话中的工具结果核对；只报告有证据的工作，未验证的明确说出来；测试失败就附上输出，跳过了就说跳过了。）
3. 要求“**做完整个任务，而不只是容易的部分**；做不完的，把能做的做完，并明确说缺什么、为什么” **[一手：Anthropic 的范围提示]**；
4. 现有检查漏掉关键行为或假设时，才试用新上下文验证者；厂商针对 Fable 5.1 的观察不保证跨模型净收益。没有新增依据、或已有可靠检查时不叠加，见 [07](07-workflows.md#1-核心验证闭环-)。**[一手；经验：采用边界]**

局限：这些机制不保证任务必定完成；Stop 有事件与循环上限，API 错误走无继续决策权的 StopFailure，具体边界见 [06](06-hooks-and-guardrails.md#返回值)。

### 2.2 绕过验证：改测试、跳过检查
**原因**：模型会想尽办法让验证器通过。Anthropic 写 C 编译器的结论是“它会自主解决你给它的任何问题，所以验证器必须近乎完美” **[一手]**。

**处理**：
1. 先核原生权限；模板 `protected-paths.txt` 的 `ask` 只对匹配的编辑事件请求确认，不覆盖任意 Bash 写入、符号链接等路径，不能据此认定测试目录全面受保护，见 [06](06-hooks-and-guardrails.md#1-为什么需要-hooks)。**[经验：覆盖边界]**；
2. 在指令里写明：“**不要为了让测试通过而修改测试**，除非测试本身写错，并说明理由”；
3. 评审时**先看测试的 diff**，再看实现的 diff；
4. 修 bug 用 red/green：Agent 核实失败来自目标缺陷、保存证据后，在授权范围内修复并重跑；预期不明或涉及必须由人决定的取舍时再询问（见 [15 第 2 节](15-task-playbooks.md#2-调试)）。

### 2.3 范围蔓延和越权
**症状**：修 bug 时顺手重构了周边代码；创建了你没要求的备份分支；社区反馈 Opus 5.5 在 auto mode 下把在一个区域执行的授权扩展到了另外 5 个区域 **[社区]**。

**处理**：
1. Anthropic 测试过的范围提示（大意）**[一手]**：
   > If, while working or testing, you find a pre-existing bug, a performance concern, or behavior the task doesn't mention, don't fix, optimize or extend it in this change unless the requested behavior cannot work without it; report it as a follow-up in your summary.

   （工作中发现的其他 bug、性能问题、任务没提到的行为，**不要在这次改动里修**，除非不修就做不成；在总结里列为后续事项。）
2. 当你只是在描述问题或提问时，明确它的产出是“评估”而不是“修复”：
   > When the user is describing a problem, asking a question, or thinking out loud rather than requesting a change, the deliverable is your assessment. Report your findings and stop.
3. 改变系统状态的命令（重启、删除、改配置）之前，要求它“确认证据确实支持这个具体动作”；
4. 权限层面：`permissions.deny` 写死不允许的命令和目录；**auto mode 不能代替隔离**（见 [06](06-hooks-and-guardrails.md)、[10](10-security.md)）。

### 2.4 过度请示或提前停下
**症状**：不停地问“要不要我…？”；在消息末尾写“接下来我会运行 X”然后就停了，需要你回一句“continue”。

**处理（只用于已授权、范围明确的任务）**：
1. 把可以自主处理的动作和必须确认的例外写清；必要权限、不可猜的业务取舍、破坏性操作或范围变化仍需停下。可逆不等于已经授权。**[一手；经验：采用边界]**
2. 厂商针对 Fable 5.1 的无人值守提示可能减少澄清概率，不能脱离产品必需确认直接复制；出现误解范围或跳过必要确认时撤回该提示，先澄清任务。命名、格式等已授权范围内的小决定可自行选择并注明。**[一手：[模型迁移指南](https://raw.githubusercontent.com/anthropics/skills/main/skills/claude-api/shared/model-migration.md)；经验：撤回条件]**
3. 若自有 harness 持续向模型注入剩余上下文倒计时，可按该模型指导避免反复注入；来源讨论模型可见输入，不是用户界面状态栏，也不要求隐藏人的预算与进度信息。不能控制宿主时不假定提示能改变其注入行为。**[一手；经验：适用范围]**

### 2.5 整文件重写和改动膨胀
**处理** **[一手]**：
- 整文件重写（结果相同，但更费 token 和时间）：
  > The number of tokens used to edit files is best minimized, all else being equal. Therefore, when it will not affect the end result, try to surgically edit a file rather than rewrite the entire thing.
- 临时测试脚本被提交：“验证脚本放在仓库外（如 `/tmp`），用完删掉；只在任务要求、或仓库本来就为这类改动保留测试时才提交测试，规模参照相邻的测试文件”；
- 过度设计：“不要增加任务不需要的功能、重构或抽象；不要为不可能发生的情况加错误处理”；
- 配合**垂直切片**，按行为、接口与风险确定评审点；100–200 行只是作者参考，不是强制拆分或等待人工批准的门槛（见 [07 第 3.4 节](07-workflows.md#34-大功能的前置设计与垂直切片-)）。

### 2.6 越聊越笨：上下文腐化与压缩丢失
✅ **先区分“历史太长”“压缩后立刻填满”和“必要信息不见了”，不要默认清空。** 在 Claude Code 用 `/context` 查看占用，再选动作：

- **仍在同一任务，只需腾出空间**：用 `/compact <保留重点>`，保留目标、约束和验证结果；不必用交接替代正常压缩。
- **明确出现 auto-compaction thrashing**：按行段／函数读大文件，缩小工具输出，必要时把大文件调查移到子 Agent；再定向压缩。清空后仍复发时，对照 `/context`：`Messages` 最大就查新读入的内容，其他行合计更大就精简启动加载项。
- **任务已换、旧思路需要丢弃，或关键约定已丢**：先核对当前文件和原结果；需要新会话时，只带最新目标、决定、进度和证据。已有任务记录足够就复用，[20 §4](20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)说明应保留什么；`/handoff` 只是本仓模板 Skill，不是原生命令或 `/compact` 的通用替代。**[经验：采用判断]**

主要依据：官方[最佳实践](https://code.claude.com/docs/en/best-practices#manage-context-aggressively)支持定向压缩；[thrashing 排查](https://code.claude.com/docs/en/troubleshooting#auto-compaction-stops-with-a-thrashing-error)指出此时压缩已成功，但新输入再次撑满窗口。**[一手：2026-10-15（UTC+8）]** 局限：这些是 Claude Code 当前文档的机制与处置建议，不是所有模型／客户端都适用或已实测有效的恢复保证。

### 2.7 API 幻觉和过时知识
**处理**：
1. 给它“真相来源”：引擎头文件（UE）、`node_modules` 里的类型定义、官方文档的 MCP（Context7 等）；
2. 写进指令：“**不确定 API 的签名或是否已废弃时，先查源码或当前文档，不要凭记忆写**”；
3. 对快速变化的领域（AI 模型、开发工具），Anthropic 的提示是：“**认得一个名字不等于知道它的现状**，部分背景知识恰恰会让过时的回答听起来很权威，所以先搜索” **[一手]**；
4. 用编译器和类型检查兜底：幻觉出来的 API 大多编译不过。

### 2.8 在同一个错误上打转
✅ **先看重复的是错误思路，还是同一个运行故障。**

- 多次纠正后仍沿用错误思路：`/clear` 后用更具体的提示，保留“试过什么、为什么不行”；再要求列出可区分的假设，而非继续盲改。
- 压缩后又被大输入撑满：按 [2.6](#26-越聊越笨上下文腐化与压缩丢失)缩小输入或启动负载，不能只反复清空。
- API／工具失败或测试不稳定：先查原错误、验证环境和已有执行结果；外部写入结果未知时，按 [20 §9](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)核对状态再重试。**[经验：诊断建议]**

**告警仍在、后续操作却已成功时，区分当前健康与历史完整性。** 日志曾丢失且尚未补回，就保留用于选择反馈来源的丢失标记；需要显示恢复时，另设当前状态或调整提示，不在下一次成功后直接清零。Codex 的[固定实现、恢复测试与用户报告](research/2026-10-10-codex-continuity.md#恢复后告警当前可写与历史完整性)支持这一修法选择；内存回退也可能舍弃旧历史。**[一手／社区；研究：采用判断，未运行客户端或验证新提示方案]**

**Windows 工具在命令启动前失败时，先查执行器，不继续改项目代码或提示词。** 若错误指向 MXC launcher 的卷枚举，核实际执行的二进制／版本、工作目录与沙箱路径；常量命令也只能在已授权的原环境检查，另一个终端成功不证明该入口正常。公开[网络卷修复](https://github.com/openai/codex/pull/54363)只收窄隐式读取根的展开，不能把它当作权限不足而直接提权、关闭沙箱或删除映射。[一手／研究] **局限：补丁合入不等于已进入所用客户端；所核稳定CLI仍未包含该修复。** 原错误、修复范围和发行边界见[连续性记录](research/2026-10-10-codex-continuity.md#windows启动层补研卷枚举失败不等于命令被拒)。

主要依据：官方[纠偏建议](https://code.claude.com/docs/en/best-practices#course-correct-early-and-often)针对同一问题纠正超过两次、失败思路累积的情形推荐清空重来。**[一手]** 局限：纠正次数是经验提示，不是故障诊断阈值，不能据此跳过输入与执行状态检查。

### 2.9 成本暴涨
**原因和处理**：

| 原因 | 处理 |
|---|---|
| 子 Agent 滥用（同一任务拆给 2 个子 Agent，token 从 12.1 万涨到 51.3 万）**[社区：原文]** | “只在并行或独立的工作流中使用子 Agent；单个文件的读取和顺序操作直接做” **[一手：Anthropic 针对 Opus 4.6 的提示]** |
| 缓存命中下降 | 对照模型/effort、请求前缀、TTL 和代理/模板处理；Claude Code 当前统计入口与口径见 [02](02-models-and-cost.md#2-价格快照api-美元百万-token)，用量面板不能代替根因定位 **[经验]** |
| 指令文件、MCP 太多 | 先核实际加载与成本，删重复／失效指令，只保留当前任务有用的约定与连接，不按固定行数裁剪（见 [03](03-context-engineering.md)） |
| 循环不停 | Ralph 循环一定要设最大迭代次数；托管 Agent 设硬性预算 |
| 大量读取或模式化生成占用主模型 | 问题明确且结果可检查时才评估轻量模型分流；包含 worker、重读与返工的总成本无收益就撤回，不能把调试当读文件杂活（见 [02](02-models-and-cost.md#3-订阅额度与成本控制)） |

**经过本地服务或兼容网关时，先定位哪一层改变了请求。** 对同一会话的相邻两次请求，核对客户端消息顺序、服务端规范化结果、模板渲染后的前缀，再对照后端实际缓存计数；只按自己能观察到的层定位。角色序列能缩小范围，完整前缀比较还需要内容；脱敏替换应稳定，避免自己制造差异。oMLX 的[固定版本探测](research/2026-10-13-omlx-postmerge.md#7-云端独立执行相同测试与实际渲染路径)中，合成请求只追加 system 提醒，合法降级却把提醒合入开头，改变已有渲染文本；“没有换模型”不能排除这类原因。**[经验：确定性探测与排查建议]**

**局限**：探测使用上游测试替身，未测真实模型缓存；不能为提高命中率随意把 system 降为 user、丢掉提醒或拆散 tool-call 配对。

#### 会话用量与速度不能混算

ccusage 的 `--speed` 选计价档，不测生成速度；先按 [02](02-models-and-cost.md#31-查异常消耗ccusage-只补历史诊断)定位异常会话。Codex rollout 的可选计时/用量字段齐全时，可另算含思考、工具与等待的整轮平均 tok/s，ccusage 尚未解析计时字段。**局限**：常规日志没有完整流式 delta，不能恢复纯生成速度；缺字段、error/abort 不补零，TTFT 也不保证是正文首 token。见[计时与落盘证据](research/2026-10-13-session-usage-metrics.md#时间字段确实可以落盘但不是解码计时)。**[一手；经验：计量边界，2026-10-13]**

### 2.10 破坏性操作
**案例**：2025-07，Replit 的 AI Agent 删除了一家公司的生产数据库，CEO 公开道歉 **[社区：HN 讨论]**。

**处理**（环境边界优先，见 [10](10-security.md)）：
1. Agent 用的凭证**没有删除生产数据的权限**；生产环境和开发环境的凭证分开；
2. 沙箱和出网白名单；`permissions.deny` 拦截 `rm -rf`、`DROP`、`terraform destroy` 这类命令；
3. 一切可恢复：版本控制、数据库备份、可回滚的部署；
4. 提示层面：“改变系统状态之前，确认证据支持这个具体动作；**看起来像已知故障的信号，可能有别的原因**” **[一手]**。提示只是补充，不能代替前三条。

### 2.11 输出难读
**处理** **[一手]**：
- “**先说结果**：完成后的第一句话回答‘发生了什么’或‘发现了什么’；可读比简短更重要，靠选择内容来变短，而不是把句子压缩成碎片”；
- 长时间无人值守后的总结要“重新交代背景”：读者没看到中间过程，先说结果，再说需要他做的一两件事；
- 统一总结格式：**Blocked on me / Changed / Found**（模板已采用）。

### 2.12 正常请求被拒绝
✅ **先判断是哪一层拒绝，不要先改提示或换模型。** 保留客户端版本、原始错误和 request ID；不要把密钥或私人请求正文贴到公开 issue。

- **工具调用被权限／沙箱拒绝**：检查具体动作、路径与 `/permissions`，由有权的人决定是否授予必要权限；提示词不能改写客户端权限，不用改命令拼写或切换工具绕过。见 [10](10-security.md)。**[一手：[权限机制](https://code.claude.com/docs/en/permissions#manage-permissions)；经验：处理顺序]**
- **API 返回 HTTP 错误或流式 error 事件**：401／403 查身份和资源权限；429 先区分短期限流与花费上限，后者不会靠等待重试恢复；对短期限流／临时 5xx 才走有界退避。HTTP 200 也可能随后流式报错，不能只看状态码。**[一手：[错误契约](https://platform.claude.com/docs/en/api/errors)]**
- **确为模型拒答**：Claude API 的 `stop_reason: "refusal"` 与以上两类不同。先读 `stop_details`，澄清合法任务的目的与范围；不要把拒答自动判成误报。若请求要求披露完整内部推理，改为要求结论、证据或简短解释，而非反复换模型。**[一手：[拒答处理](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback)；经验：诊断建议]**

**需要服务连续性时，再选对应回退机制。** Claude API 的拒答 `fallbacks` 与 Claude Code CLI 的 `--fallback-model` 不是同一触发器：前者处理分类器拒答，后者处理模型过载／不可用。先核接入平台、模型与请求特性支持，再按服务商允许的方式回退，并检查最终拒答状态与实际返回模型。**[一手：[API 回退](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback#server-side-fallback)、[CLI 参数](https://code.claude.com/docs/en/cli-reference#cli-flags)]**

局限：回退可能仍被拒或失败，也不能替代权限授权与内容安全要求；这些是当前 Claude 文档的协议边界，未做真实请求复测。平台限制与反例见[研究记录](research/2026-10-12-development-conditions.md#拒绝诊断先区分权限模型与服务故障)。

### 2.13 一次读取失败就判断整体不可用

✅ **先定位失败的是哪条路径，再判断缺不缺能力。** 检查当前环境实际提供的入口：能力未暴露就核支持范围；调用失败就查执行结果；目标页面返回错误就按页面信号处理。抓取失败且没有明确访问禁令时，可用已有、受支持的正常公开 GET 或浏览器读取同一公开 URL，先确认结果确实包含所需正文；HTTP 200 或出现帖子 ID 不等于读到了完整内容，浏览器还可核对原文、刷新复测；遇登录、验证码或权限阻塞则按要求处理，不通过换身份、代理或提高权限绕过。**[经验：诊断与采用建议]**

主要依据：2026-10-15 的 [dot 云端现场观察](research/2026-10-12-development-conditions.md#dot-实际能力诊断公开网页读取的路径差异)中，同一组 X 公开 URL 的抓取返回 403，Chrome 却直接读到原帖且刷新成功，未经过登录或验证码；因此失败只能落到该次抓取路径，不能写成“X 整体不可读”。**[经验：实际观察]** 局限：单次环境观察不保证其他账号、地区或时点可复现，也不足以确定 403 的根因。

若任务已经产生外部副作用或涉及中断续接，继续按 [20](20-codex-long-horizon.md#9-超时后动作究竟发生了吗)核对实际结果，不把“换一条读取路径”推广为重新发布、重新调度或重跑写入。**[经验：适用边界]**

## 3. 一份可以直接放进 CLAUDE.md 的“防跑偏”片段

```markdown
## 工作方式
- 在已授权、范围明确的任务内继续做；缺必要权限、关键业务判断或遇到破坏性操作、范围变化时先确认。可逆不代表已获授权。
- 已授权范围内的小决定（命名、格式、等价方案）自己选并注明；发现关键歧义先澄清，不用自主提示掩盖缺失决定。
- 发现任务以外的问题，列在总结的“后续事项”里，不要在这次改动里修。
- 不要为了通过测试而修改测试；测试本身有错时说明理由。
- 不确定 API 时先查源码或当前文档。
- 小改动用局部编辑，不要重写整个文件；一次性临时探针可放仓库外，项目需要的回归测试和检查脚本按既有惯例保留。
- 汇报进度时每条都要有本次会话的工具结果作为证据；未验证的明确说出来。
- 总结用三个标题：Blocked on me / Changed / Found。
```

模板中的 [CLAUDE.md](../templates/generic/CLAUDE.md) 已包含其中大部分规则。**加规则前先问自己：这条能不能用 Hook、lint 或测试强制？** 能的话放到那一层（见 [14 第 7.2 节](14-synthesis.md#72-这条规则该放在哪一层)）。

## 来源

- Claude API 官方 Skill：`shared/model-migration.md`（Fable 5.1 的行为变化与提示调整、长时间运行的 Agent 建议、Opus 4.6 的子 Agent 提示）
- [Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices)、[CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Chroma：Context Rot](https://research.trychroma.com/context-rot)；[HN：Replit 的 Agent 删除了公司数据库](https://news.ycombinator.com/item?id=44646151)
- Anthropic 工程博客：[Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering)（见 [08](08-multi-agent.md)）
