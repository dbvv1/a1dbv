# 17 · Agent 跑偏了怎么办：故障排查手册

> 核实时间：2026-10-08。
> 按“**症状 → 原因 → 处理**”组织。每个处理方法都尽量给出可以直接用的提示词或配置。
> 依据：
> - Anthropic 的模型迁移和提示指南（Claude API 官方 Skill 中的 `model-migration.md`）**[一手]**。其中的提示词是 Anthropic 在 Fable 5.1 上测试过的，**原文是英文、部分句子“承重”**，下文给出原文和中文意思；用在其他模型上效果需要自己验证 **[经验]**；
> - Claude Code 官方最佳实践和 changelog **[一手]**；
> - 社区案例 **[社区]**、研究 **[研究]**。

## 0. 先看诊断工具

| 想知道 | 用什么 |
|---|---|
| 上下文被什么占满了 | Claude Code `/context` |
| 钱花在哪里、缓存为什么失效 | `/cost`（显示命中率和失效原因）、`/usage`、`npx ccusage` |
| 配置里有没有为旧模型写的过时指令 | `/doctor prompt-audit`、`/skill-doctor` |
| Agent 到底做了什么 | 会话记录（transcript）、Agent View；团队可以接 OpenTelemetry |
| 是模型的问题还是配置的问题 | `--safe-mode`（禁用所有自定义内容）对比 |

## 1. 症状速查表

| 症状 | 最可能的原因 | 第一步处理 | 详见 |
|---|---|---|---|
| 说“完成了”，其实没做完或没验证 | 没有可运行的完成标准；长任务中的进度幻觉 | 要求逐条用工具结果佐证；Stop Hook 跑检查 | [2.1](#21-谎报完成或进度) |
| 改测试让它通过、跳过检查 | 验证器可以被绕过 | 测试文件设为需确认；评审测试 diff | [2.2](#22-绕过验证改测试跳过检查) |
| 改了没让它改的东西 | 范围没说清；模型“顺手”修 | 写明边界；顺手的发现只列在总结里 | [2.3](#23-范围蔓延和越权) |
| 老是问“要不要我…？”、说完计划就停 | 不知道你不在场 | 告诉它“你在自主运行” | [2.4](#24-过度请示或提前停下) |
| 小改动却重写整个文件 | 模型偏好 | 要求“外科手术式”编辑 | [2.5](#25-整文件重写和改动膨胀) |
| 提交了一堆临时测试脚本 | 验证用的脚本被留了下来 | 临时脚本放在仓库外 | [2.5](#25-整文件重写和改动膨胀) |
| 越聊越笨、忘了之前的约定 | 上下文腐化；压缩丢了信息 | `/clear` + 交接文档 | [2.6](#26-越聊越笨上下文腐化与压缩丢失) |
| 编造 API、用过时的写法 | 训练数据过时，版本差异 | 让它先查源码或当前文档 | [2.7](#27-api-幻觉和过时知识) |
| 同一个错误反复修不好 | 上下文被失败的尝试污染 | 纠正两次还错就重开 | [2.8](#28-在同一个错误上打转) |
| 额度一下子烧完 | 子 Agent 滥用、缓存失效、循环 | 看 `/cost`，限制子 Agent | [2.9](#29-成本暴涨) |
| 执行了破坏性命令 | 权限过大，没有隔离 | 沙箱、deny 规则、备份 | [2.10](#210-破坏性操作) |
| 总结读不懂 | 长会话中的速记式表达 | 规定总结的写法 | [2.11](#211-输出难读) |
| 正常请求被拒 | 安全分类器误报 | 换种问法；配置回退模型 | [2.12](#212-正常请求被拒绝) |

## 2. 逐项处理

### 2.1 谎报完成或进度
**原因**：没有可运行的完成标准时，“看起来做完了”就是唯一的停止信号（见 [07](07-workflows.md#1-核心验证闭环-)）；长时间运行时，模型可能编造进度。

**处理**：
1. 给它一个能自己跑的检查，并用 `/goal` 或 **Stop Hook** 强制执行；
2. 要求进度汇报**逐条对应工具结果**。Anthropic 测试中，这段提示“几乎消除了”在专门设计的诱导任务上编造进度的情况 **[一手]**：
   > Before reporting progress, audit each claim against a tool result from this session. Only report work you can point to evidence for; if something is not yet verified, say so explicitly. Report outcomes faithfully: if tests fail, say so with the output; if a step was skipped, say that; when something is done and verified, state it plainly without hedging.

   （汇报前，把每一条结论对照本次会话中的工具结果核对；只报告有证据的工作，未验证的明确说出来；测试失败就附上输出，跳过了就说跳过了。）
3. 要求“**做完整个任务，而不只是容易的部分**；做不完的，把能做的做完，并明确说缺什么、为什么” **[一手：Anthropic 的范围提示]**；
4. 长任务用**独立的验证子 Agent**（新上下文）检查，比让它自我批评更可靠 **[一手]**。

### 2.2 绕过验证：改测试、跳过检查
**原因**：模型会想尽办法让验证器通过。Anthropic 写 C 编译器的结论是“它会自主解决你给它的任何问题，所以验证器必须近乎完美” **[一手]**。

**处理**：
1. 测试目录在 `protected-paths.txt` 里设为 `ask`，改测试必须经你确认（模板里的保护 Hook 支持）**[经验]**；
2. 在指令里写明：“**不要为了让测试通过而修改测试**，除非测试本身写错，并说明理由”；
3. 评审时**先看测试的 diff**，再看实现的 diff；
4. 修 bug 用 red/green：先写失败的测试，你确认它确实失败，再让它修（见 [15 第 2 节](15-task-playbooks.md#2-调试)）。

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

**处理**：
1. 在 CLAUDE.md 里写**停止规则**（模板已包含）：不需要你时继续做；只在无法继续或要做破坏性操作时停下 **[一手：Opus 5.5 指南]**；
2. 无人值守的流水线里，用 Anthropic 测试过的提示，**开头那句“The user is not watching”是承重句，要原样保留** **[一手]**：
   > You are operating autonomously. The user is not watching in real time and cannot answer questions mid-task, so asking 'Want me to...?' or 'Shall I...?' will block the work. For reversible actions that follow from the original request, proceed without asking. Stop only for destructive actions or genuine scope changes the user must decide.
3. 小决定不要问：“命名、格式、默认值、等价方案之间的选择，自己选一个合理的并注明；范围变化和破坏性操作仍然要先问” **[一手]**；
4. **不要在界面上显示剩余上下文的倒计时**：长会话里模型会因此“焦虑”，建议开新会话或删减自己的工作 **[一手]**。

### 2.5 整文件重写和改动膨胀
**处理** **[一手]**：
- 整文件重写（结果相同，但更费 token 和时间）：
  > The number of tokens used to edit files is best minimized, all else being equal. Therefore, when it will not affect the end result, try to surgically edit a file rather than rewrite the entire thing.
- 临时测试脚本被提交：“验证脚本放在仓库外（如 `/tmp`），用完删掉；只在任务要求、或仓库本来就为这类改动保留测试时才提交测试，规模参照相邻的测试文件”；
- 过度设计：“不要增加任务不需要的功能、重构或抽象；不要为不可能发生的情况加错误处理”；
- 配合**垂直切片**和每次 100–200 行的评审（见 [07 第 3.4 节](07-workflows.md#34-大功能的前置设计与垂直切片-)）。

### 2.6 越聊越笨：上下文腐化与压缩丢失
**原因**：
- 研究显示，即使是简单任务，模型表现也会随着输入长度增加而下降（Chroma《Context Rot》，2025）**[研究]**；
- 压缩会丢信息。Claude Code 2.1.293 还修复过一个问题：压缩后 Claude 把压缩前自己最后做的事当成“压缩后才完成”，于是撤回或重做已完成的工作 **[一手：changelog]**。

**处理**：
1. 无关任务之间 `/clear`；**同一问题纠正两次还错，就 `/clear` 后带着教训重写提示** **[一手：官方最佳实践]**；
2. 长任务把清单写进 `TASKS.md`，把决定和进度写进文件，**不依赖对话记忆**；
3. 用 `/handoff`（模板 Skill）代替 `/compact`：交接文档写明目标、已完成、未完成、关键决定；
4. 自己写压缩提示时，明确要保留什么：遇到的问题和解决方法、试过和放弃的方案及原因、**原样保留的约定和边界**、当前进度、还没做的事 **[一手：Anthropic 的压缩提示]**。

### 2.7 API 幻觉和过时知识
**处理**：
1. 给它“真相来源”：引擎头文件（UE）、`node_modules` 里的类型定义、官方文档的 MCP（Context7 等）；
2. 写进指令：“**不确定 API 的签名或是否已废弃时，先查源码或当前文档，不要凭记忆写**”；
3. 对快速变化的领域（AI 模型、开发工具），Anthropic 的提示是：“**认得一个名字不等于知道它的现状**，部分背景知识恰恰会让过时的回答听起来很权威，所以先搜索” **[一手]**；
4. 用编译器和类型检查兜底：幻觉出来的 API 大多编译不过。

### 2.8 在同一个错误上打转
**处理**：
1. 纠正两次还错 → `/clear`，带着“试过什么、为什么不行”重新开始 **[一手]**；
2. 让它先列出 2–3 个假设和区分它们的实验，而不是继续改代码；
3. 换一个视角：让另一家的模型或一个新会话看同样的问题；
4. 检查是不是验证器本身有问题（测试不稳定、环境不对）。

### 2.9 成本暴涨
**原因和处理**：

| 原因 | 处理 |
|---|---|
| 子 Agent 滥用（同一任务拆给 2 个子 Agent，token 从 12.1 万涨到 51.3 万）**[社区：原文]** | “只在并行或独立的工作流中使用子 Agent；单个文件的读取和顺序操作直接做” **[一手：Anthropic 针对 Opus 4.6 的提示]** |
| 缓存失效 | 开始前定好模型和 effort，不在会话中途切换；`/cost` 会显示失效原因 |
| 指令文件、MCP 太多 | 精简 CLAUDE.md（< 200 行），只装需要的 MCP（见 [03](03-context-engineering.md)） |
| 循环不停 | Ralph 循环一定要设最大迭代次数；托管 Agent 设硬性预算 |
| 用强模型做杂活 | 杂活交给 Haiku 5.5 等便宜模型（见 [02](02-models-and-cost.md)） |

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
**处理** **[一手：针对 Fable 5.1 的说明]**：
- 安全分类器可能误报，问法有影响：问“这个程序有 bug 吗？”而不是“这个程序能编译通过吗？”；
- 小众编程语言：先给它语言的背景和文档；
- 去掉往上下文里返回 base64 数据的工具；
- API 调用方配置**回退模型**（fallbacks），避免误报变成服务中断。

## 3. 一份可以直接放进 CLAUDE.md 的“防跑偏”片段

```markdown
## 工作方式
- 不需要我参与的步骤就继续做；只在没有我就无法继续、或要做破坏性操作之前停下来问。
- 小决定（命名、格式、等价方案）自己选并注明；范围变化先问。
- 发现任务以外的问题，列在总结的“后续事项”里，不要在这次改动里修。
- 不要为了通过测试而修改测试；测试本身有错时说明理由。
- 不确定 API 时先查源码或当前文档。
- 小改动用局部编辑，不要重写整个文件；验证脚本放在仓库外。
- 汇报进度时每条都要有本次会话的工具结果作为证据；未验证的明确说出来。
- 总结用三个标题：Blocked on me / Changed / Found。
```

模板中的 [CLAUDE.md](../templates/generic/CLAUDE.md) 已包含其中大部分规则。**加规则前先问自己：这条能不能用 Hook、lint 或测试强制？** 能的话放到那一层（见 [14 第 7.2 节](14-synthesis.md#72-这条规则该放在哪一层)）。

## 来源

- Claude API 官方 Skill：`shared/model-migration.md`（Fable 5.1 的行为变化与提示调整、长时间运行的 Agent 建议、Opus 4.6 的子 Agent 提示）
- [Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices)、[CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Chroma：Context Rot](https://research.trychroma.com/context-rot)；[HN：Replit 的 Agent 删除了公司数据库](https://news.ycombinator.com/item?id=44646151)
- Anthropic 工程博客：[Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering)（见 [08](08-multi-agent.md)）
