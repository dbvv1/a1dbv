主线：三，兼二
改变的建议：请求超时与整项任务截止时间分别核实；恢复最新目标、约束、执行事实与活跃资源；旧绿灯、存在的文件及部分压缩摘要均不能代替当前验收。跨执行者派发前核对回执丢失后仍可查询的任务身份；失败后先查原结果和外部状态，再决定恢复或重试；07 按真实续接／反馈缺口采用循环，撤回固定重置和逐功能工作流；可选子任务可显式降级，必需验收换执行者，停不掉共享写入者则暂停相关交付。[经验／研究]
新证据：原研究证据汇总（日期见各节，非本次编辑新增）；官方设计、固定恢复实现／测试定义及社区单例；10-14 核对失败压缩修复与发布 tag，当时已读 tag 仍含旧分支。响应完成也不保证持久化成功；10-15（UTC+8）补核 Claude Code thrashing 与 StopFailure，区分缩小输入、清空与停止控制；另补 Ralph 固定控制实现／未合并回归及不同作者产物链，纠正历史 harness 的模型条件；未运行新模型恢复实验；10-16（UTC+8）补续接前分支／HEAD检查的单仓观察与离线Git正反例，以及已发布 OpenAI Python SDK／HTTPX2 的超时、重试与流读取边界；Go 整次请求超时作对照；10-17（UTC+8）补gstack可选降级／必要接管的固定模板与失败状态后续修复，区分提示约定、测试覆盖和真实恢复；同日补 CAO 固定结果保存／身份发现缺口及 Symphony 既有 issue 恢复契约，未做真实恢复实测。[一手／社区／研究／经验]

# 长程任务：来源、反例与实验边界

> 资料整理：2026-10-12（UTC）。对应[20 · Codex 长程任务](../20-codex-long-horizon.md)，本页只保存正文省略的来源与细节。正文原有核实时间为 2026-10-11（UTC+8，检索截至 2026-10-10 UTC）；后续补充按所链接研究页的日期定位。本次阅读分层没有重新核实全部外部网页或发布状态。

正文核查沿革补记：2026-10-12 仅调整阅读分层；2026-10-14 补 §4 继承行为诊断、原生历史恢复与失败压缩边界。2026-10-15 补 §5 续接输入接受／处理差异与 §7 dot 停止范围，详细来源见[dot 长任务核对](2026-10-12-development-conditions.md#dot-长任务续接接受处理与停止范围)；其余外部事实仍按各记录日期，不表示本轮全部复核。**[经验：维护范围]**

## 官方来源与历史时点

下表保存直接出处；设计指南、开源文档与客户端实测分别计证据，不能互相替代。

| 来源 | 正文使用的依据 | 版本、状态与检查边界 |
|---|---|---|
| [Astra 提示与 Skills 指南](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) | 缩短常驻指令，按需读文档，避免复杂技能流程束缚模型 | 2026-09-11，面向特定模型代际；不支持删除所有脚手架的泛化判断。**[一手]** |
| [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | 项目指导入口、同层 override 优先与默认 32 KiB 总上限 | 文档机制不能证明会话中改文件后已自动重载。**[一手]** |
| [Build skills](https://learn.chatgpt.com/docs/build-skills) | `.agents/skills/<name>/SKILL.md`，元信息先加载、正文按需加载 | 可发现、触发、执行与结果正确是不同检查；没有由目录存在推断有效。**[一手]** |
| [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | 边界清楚、读多写少的任务适合拆分，主任务整合结果 | 本地 Codex 与托管 Work 的角色、配置及权限模型不能混用。**[一手]** |
| [OpenAI 长时任务实验](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex) | 持久化需求、计划和状态 | 报告的约 **25 小时**运行是特定实验，不是任意任务的时长或交付承诺。**[一手]** |
| [ExecPlans 旧文](https://developers.openai.com/cookbook/articles/codex_exec_plans) | 以文件保持可续接的计划 | 旧文已标为 **archived**；文件名是约定，不是系统保证。后续示例比较、固定源码与适用范围见 [Cookbook 复核](2026-10-11-codex-cookbook.md)。**[一手]** |
| [Goals 指南](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) | 可度量目标、验证、预算及停止原因 | 指南标注 **Codex 0.128.0 起支持**，不表示 dot 或任意 API runner 都暴露同一 `/goal`；线程续接条件与教程读取范围见 [Goals 复核](2026-10-11-codex-cookbook.md#2-goals官方设计与实际使用报告一起看)。**[一手]** |

[Codex 配置示例](../../templates/codex/README.md)是可选、未自动安装的示例；其中 Sol 6.1 / high 只是成本与能力的选择，原资料没有将其验证为任意任务的最优档位。**[经验：示例范围]**

## 社区故障与修复状态

以下保留原帖和当时状态，不把单例合并成故障率，也不从 issue 关闭推断整个故障类别已消失。阅读社区报告不等于本仓库独立复现。**[社区；研究：证据边界]**

| 原始来源 | 报告或变更内容 | 原核查中保留的反证与限制 |
|---|---|---|
| [Spec Kit #3752](https://github.com/github/spec-kit/issues/3752) | 把 **16 个场景压成 4 条故事**，导致误判完成 | 单例支持验收粒度被压缩的故障模式，不支持普遍发生率 |
| [Codex #42695](https://github.com/openai/codex/issues/42695) | 压缩后回到旧任务 | 与其他压缩失败分开观察，不能预设同一根因 |
| [Codex PR #44659](https://github.com/openai/codex/pull/44659) | 触发元信息传播修复，已合并 | 未确认首次发布版本，也没有证明修复全部“回旧任务”症状。**[一手：PR]** |
| [Codex #38969](https://github.com/openai/codex/issues/38969) | **10 月**仍有压缩失败报告 | 不同环境的根因未必相同，不能借一个旧 issue 关闭排除这类问题 |
| [Codex #40932](https://github.com/openai/codex/issues/40932) | 父任务过早结束，也有父任务仍在等待而结果投递停滞的报告 | 单加“不要提前结束”不能覆盖全部唤醒路径 |
| [Codex #38989](https://github.com/openai/codex/issues/38989) | 大量递归评审、重复测试及巨量记录 token | 记录 token 不等于实际账单，原文没有据此计算用户费用 |
| [Superpowers #1040](https://github.com/obra/superpowers/issues/1040) | 研究返回主 checkout 的绝对路径，后续写错位置 | 历史单例；工作树位置与实际写权限是不同条件 |
| [Superpowers #2050](https://github.com/obra/superpowers/issues/2050) | 子任务提交到 main | 原核查时已关闭，不能当作所有当前版本仍受影响的证据 |
| [Codex #52345](https://github.com/openai/codex/issues/52345)、[#50771](https://github.com/openai/codex/issues/50771) | 已有完成标准、知道未完成却结束；承认修正后没有行动 | 公开记录、成功控制案例、附件读取范围以及源码与部署未对应等细节统一保存在[连续性复核](2026-10-10-codex-continuity.md#c-知道目标与继续执行目标可能脱节) |

`needs_follow_up`、Stop hook 路径及后续相关修复的固定源码见[连续性复核](2026-10-10-codex-continuity.md#回合结束不等于完成用户目标)；它们说明可以在哪里观察续接，没有直接证明上述报告的部署根因。**[一手；研究：机制边界]**

## 恢复涉及哪些状态

这是原文用于区分恢复对象的状态表，属于设计分析，不是已运行的恢复实验。**[经验：设计]**

| 状态 | 例子 | 对应恢复载体或检查 |
|---|---|---|
| 用户目标与约束 | 兼容旧接口、不得发布 | 任务契约与后续变更 |
| 工作产物 | diff、生成文件、测试数据 | 文件系统、Git、制品存储 |
| 执行事实 | 测试运行、服务错误、已完成动作 | 日志、报告、外部操作回执 |
| 推理上下文 | 为什么放弃某种方案 | 有范围的交接摘要，必要时重新查证 |
| 活跃资源 | 进程、端口、浏览器、认证 | 重建与检查；旧 PID 不能证明存活 |

“记录存在但当前未加载”的实现反例见 [03 的实际运行反例](../03-context-engineering.md#43-实际运行中的反例)：激活标记不是路径规则或 Skill 正文仍在上下文中的证据。**[一手/社区：见该节来源；研究：解释]**

[SlopCodeBench 复核](2026-10-13-slopcodebench.md#4-代码留下了哪些信息没有自动留下)（2026-10-13，北京时间）保存固定 runner 依据：默认路径保留代码、重置会话、只给新规格，隐藏评分不反馈给 Agent。该页分别核查旧约束可恢复性和运行反馈可取得性，记录默认路径与实际 campaign 配置的对应缺口；据此无法直接推出日常项目必须部署记忆服务。**[一手：运行机制；研究：适用范围]**

## 工具、预算与权限：复用已有固定证据

不在本页复制完整技术审计，以下指向已维护的提交、版本、来源与读取范围。

| 主题 | 详细证据位置 | 原文需要保留的范围 |
|---|---|---|
| Codex app-server | [S4](2026-10-10-audit.md#s4--codex-app-server) | main 源码中区分关闭拒绝新工作、历史读取失败与历史耗尽；实验性 read-state 使用 `expectedRevision`，冲突后需重读。read-state 是线程已读状态，不能当作通用业务恢复数据库；最小发布版本未确认。**[一手]** |
| MCP 传输和结果 | [S5](2026-10-10-audit.md#s5--mcp-2026-07-28-规范) | **2026-07-28** 移除协议级会话和 SSE 消息重投，跨调用状态改用显式句柄；断流后重新发起请求不提供业务 exactly-once 保证。MRTR `input_required`、必需 `resultType` 及旧版缺字段兼容行为来自规范，未做客户端兼容性测试。**[一手；经验：业务含义推论]** |
| Hook 失败策略 | [S1](2026-10-10-audit.md#s1--claude-code-2129521296) 与 [06 返回值](../06-hooks-and-guardrails.md#返回值) | **2.1.295** 的 command/HTTP Hook 增加 `onFailure: "block"`；**2.1.296** 修复部分 managed hooks。Stop、SubagentStop、TaskCompleted、TeammateIdle 和 async 等有排除条件；原材料未做客户端实测，后续规则以 06 为准。**[一手]** |
| Auto Memory | [S3](2026-10-10-audit.md#s3--gemini-cli) | 源码文档标记实验性、默认关闭，patch/Skill 草稿进入 inbox 后由用户审阅；不能将 main 文档的全部功能归入某一安装版本。**[一手]** |

本仓库[独立 spec 与运行报告模板](../../templates/long-task/README.md)及[校验器](../../scripts/validate_task.py)只检查记录一致性：不执行检查、不打开证据、不证明证据真实、不阻止同时篡改 spec 与报告，也不是完整 agent harness。模板自己的“信任边界与坑”保留具体限制；其合成测试不是模型驱动恢复实验。**[经验：实现范围]**

## 请求超时、重试与整项任务截止时间

核实：2026-10-16（UTC+8）；对应 [16 §4.5](../16-building-agents.md#45-安全与成本)，20 §7 仅交叉引用。改变的选择是：需要总耗时上限时，先核现有执行环境的总时限／取消覆盖范围，而不是仅缩短 SDK 请求超时或增加重试。**[研究：采用判断]**

**版本先于字段名。** [官方 Python SDK 文档](https://developers.openai.com/api/reference/python)当前使用 `httpx2.Timeout`；[v3.31.0 发布](https://github.com/openai/openai-python/releases/tag/v3.31.0)为 2026-10-14，固定提交 `86cae50785fb7b7bf2a5d2383370b214b304acd2`。[依赖文件](https://github.com/openai/openai-python/blob/86cae50785fb7b7bf2a5d2383370b214b304acd2/pyproject.toml)要求 `httpx2>=2.12.0,<3`；[默认值](https://github.com/openai/openai-python/blob/86cae50785fb7b7bf2a5d2383370b214b304acd2/src/openai/_constants.py)为 `Timeout(600, connect=5)`、`max_retries=2`。本轮另读 HTTPX2 [v2.13.1](https://github.com/pydantic/httpx2/releases/tag/v2.13.1)，固定提交 `d91c9f4236523eb5978ca800944fa0078f17409f`：它是满足该依赖范围的一份具体传输实现，不证明所有安装都使用它，也不能用旧 HTTPX 文档冒充当前 SDK 依赖。**[一手：发布、依赖与固定源码]**

| 范围 | 已核契约与实现 | 读者不能据此推定什么 |
|---|---|---|
| 单次阶段等待 | [HTTPX2 超时文档](https://pydantic.dev/docs/httpx2/advanced/timeouts/)区分连接、读取、写入及连接池等待；read 限制等待下一块数据。[Timeout 实现](https://github.com/pydantic/httpx2/blob/d91c9f4236523eb5978ca800944fa0078f17409f/src/httpx2/httpx2/_config.py)把单个数值赋给各阶段；[同步 HTTP/1.1](https://github.com/pydantic/httpx2/blob/d91c9f4236523eb5978ca800944fa0078f17409f/src/httpcore2/httpcore2/_sync/http11.py)读循环重复传入 read timeout，[socket 后端](https://github.com/pydantic/httpx2/blob/d91c9f4236523eb5978ca800944fa0078f17409f/src/httpcore2/httpcore2/_backends/sync.py)逐次设置超时后读取 | 持续收到数据时，总时长可以超过 read timeout；网络数据到达也不等于任务有有效进展。**[一手；研究：推论]** |
| SDK 请求重试 | [固定请求实现](https://github.com/openai/openai-python/blob/86cae50785fb7b7bf2a5d2383370b214b304acd2/src/openai/_base_client.py)在 `max_retries+1` 次尝试内重新复制选项、构建请求；超时且请求体可重放才继续。退避在发送之外等待，本地指数退避带 jitter、上限 8 秒；支持的服务端 Retry-After 可到 120 秒 | 重试次数不是总时限；不能用 `timeout×3` 算硬上限，也不能把请求体可重放当业务幂等保证。**[一手；研究：边界]** |
| 流迭代 | 成功响应离开请求重试循环后才交给响应处理；[固定 Stream／AsyncStream 实现](https://github.com/openai/openai-python/blob/86cae50785fb7b7bf2a5d2383370b214b304acd2/src/openai/_streaming.py)把迭代读取的超时／连接错误归一为 SDK 异常，没有重新进入上述请求重试循环 | “默认超时重试两次”不保证流中途断开后自动续流或重放，更不保证整轮业务工具操作重试。**[一手：实现范围]** |
| 整次 HTTP 请求的对照 | [Go net/http Client.Timeout](https://pkg.go.dev/net/http#Client)包含连接、重定向和响应体读取，`Do` 返回后仍可中断 Body 读取 | 不能把所有名为 timeout 的设置都说成 inactivity；该契约仍不自动覆盖应用后来发起的请求和工具步骤。**[一手；研究：对照]** |

已回读 OpenAI Python main 为 [`9998c1a3806afda55cb3923de1f7f49adcff5a7f`](https://github.com/openai/openai-python/commit/9998c1a3806afda55cb3923de1f7f49adcff5a7f)（2026-10-15），相关请求重试与流异常处理边界仍可见；正文依据以上已发布版本，不把 main 的其他能力当发行能力。**[一手：版本核对]**

采用边界：检查现有总时限是否覆盖重试等待、流消费和工具步骤；已覆盖就复用，不为此另写计时框架。总时限触发后的结果核对仍沿用 [20 §9](../20-codex-long-horizon.md#9-超时后动作究竟发生了吗)。本轮仅阅读文档与源码，未安装或运行 SDK／真实客户端，未调用模型、测量延迟或费用；这些来源不能说明 Codex／dot 的实际产品停止行为，也不能解释本仓执行服务异常的原因。**[研究：采用与验证边界]**

## 待运行实验矩阵

以下是原文保留的实验设计，尚未成为真实模型或跨会话运行结果。**[经验：实验设计]**

| 实验 | 负面样例 | 判定 |
|---|---|---|
| 恢复 | 写完未测、测试失败、测试通过后又改代码、进程终止或活跃资源失效 | 不用旧绿灯宣称新版本完成 |
| 验收 | 缺 ID、只测快乐路径、零测试、skipped、输出截断 | 明确 incomplete/blocked |
| 子任务 | 仅进度、迟到、失败、结果未收集 | 必要结果未验证前不收尾 |
| 权限 | 目标变了、授权过期、外部写结果未知 | 先核对，不重放危险动作 |
| 成本 | 单 agent、分组读、逐项 reviewer | 同任务、同预算、记录质量与成本 |
| 技能 | 正例两种说法、近邻反例、旧版本配置 | 分开测发现、触发、执行、结果 |

已运行证据的类型是仓库确定性检查和模拟引擎回归，实际记录见 [19](../19-experiments.md)；表中真实模型、跨会话实验仍待执行。恢复设计还需覆盖并发文件修改、旧记忆中的失效命令；检查输出须读取完整报告并保留原退出码，不能据输出尾部猜通过。**[经验：验证范围与剩余问题]**

## 失败压缩的提交边界

> 核实：2026-10-14 14:30 UTC。主线三；改变 20 §4：失败摘要不能代替原结果，恢复前区分响应完成、历史替换和持久化；不新增检查点框架。**[研究：采用判断]**

### 固定修复与回归覆盖

官方 [PR #53932](https://github.com/openai/codex/pull/53932) 于 2026-10-14 09:44 UTC 合并，固定 SHA `400f2356d60c4663d46817a40b4d09c5c86f35ad`。[compact.rs L826–920](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/src/compact.rs#L826-L920) 的旧非 PostTurn 路径在 `OutputItemDone` 就记录压缩输出；修复后先缓冲，收到 `Completed` 才记录，因此断流或 incomplete 的部分摘要不再进入后续模型输入。这修的是本地压缩响应流的历史污染，不是解释器重置、历史序号投影或工具输出截断。**[一手：固定源码与补丁]**

- [断流／重启回归 L1311–1416](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/tests/suite/compact.rs#L1311-L1416)：先执行产生 `ORIGINAL_TOOL_RESULT` 的命令，压缩输出部分摘要后断流；正常续接和 restart 后再压缩的输入，都须保留相同的原消息与工具调用／结果，断流时原 token usage 不变。**[一手：测试定义，未运行]**
- [incomplete 回归 L1161–1307](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/tests/suite/compact.rs#L1161-L1307)：原超大历史仍超限，下轮仍须压缩，且不包含 `DISCARDED_INCOMPLETE_SUMMARY`。带 usage 的 incomplete 会被单独记账，因此不能把“摘要丢弃”解释为请求未发生或不耗额度。**[一手：测试定义与实现，未运行]**
- [成功路径 L1525–1636](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/tests/suite/compact.rs#L1525-L1636)：成功输出在响应完成通知前可观察，且带 compaction metadata 写入 rollout。该正常路径断言不覆盖任意磁盘故障或突然终止。**[一手：测试定义，未运行]**

### 反证：响应完成不是持久化事务成功

同一 SHA 的 [session/mod.rs L4322–4382](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/src/session/mod.rs#L4322-L4382) 先替换 live history，再调用持久化；[L4745–4754](https://github.com/openai/codex/blob/400f2356d60c4663d46817a40b4d09c5c86f35ad/codex-rs/core/src/session/mod.rs#L4745-L4754) 对追加失败记录错误并返回 false。因此 #53932 不能被写成完整原子落盘修复，也不能用响应完成事件证明恢复后的磁盘记录一定完整。**[一手：固定源码；研究：边界]**

采用动作：失败时保留原数据，核对实际后端版本，再通过正常续接／恢复检查原消息与工具结果；有原结果就先复用和核对，不因压缩失败重跑外部写入。出现持久化错误、恢复缺项或工具结果未知时，仍按 20 §9 重读当前产物、查权威操作状态后决定重试。修复不验证摘要的语义正确性，也不承诺任意取消／崩溃都恢复成功。**[经验：由机制推导的建议]**

### 发布边界与实际验证范围

本轮读取[官方发布列表](https://github.com/openai/codex/releases)：最新稳定版 [0.162.1](https://github.com/openai/codex/releases/tag/rust-v0.162.1) 发布于 10 月 9 日，最新预发布 [0.163.0-alpha.11](https://github.com/openai/codex/releases/tag/rust-v0.163.0-alpha.11) 发布于 10 月 14 日 03:27 UTC，早于本修复合并。另直接读取两个 tag 的 [稳定版 compact.rs](https://github.com/openai/codex/blob/rust-v0.162.1/codex-rs/core/src/compact.rs) 与 [预发布 compact.rs](https://github.com/openai/codex/blob/rust-v0.163.0-alpha.11/codex-rs/core/src/compact.rs)，均仍有旧的非 PostTurn 立即记录分支；同期 main 已有缓冲修复。不能建议“升级当前最新版即可解决”，也没有建立 Desktop 部署对应。后续采用前须重新核对发布内容与实际运行后端。**[一手：发布元数据与 tag 源码；研究：采用边界]**

已完成固定补丁、实现、回归断言和两个 tag 的只读核查；没有安装或运行 Codex、模型、上游 Rust 回归，也没有读取私人会话或用量。测试使用 mock 响应且有 `skip_if_no_network`，测试存在或 PR 已合并不等于本轮执行通过；没有另做只能重复控制流的模拟实验。**[研究：验证范围]**

## 2026-10-15：按故障选择压缩、清空与停止检查

> 核实日期：2026-10-15（UTC+8）。改变 [17 §2.1、§2.6、§2.8](../17-troubleshooting.md)：撤回默认清空、交接替代压缩及“强制执行必然完成”的暗示；06 只补停止事件边界。**[研究：采用判断]**

| 一手来源（本轮读取正文） | 改变选择的新证据 | 反证与边界 |
|---|---|---|
| [Troubleshooting：auto-compaction thrashing](https://code.claude.com/docs/en/troubleshooting#auto-compaction-stops-with-a-thrashing-error) | 压缩成功后仍可被大文件／工具输出立即填满；应缩小读入、定向压缩或隔离调查。清空后复发须区分 Messages 与启动项占用 | 这是成功压缩后的再填满，不是上一节 Codex 失败压缩的部分摘要污染；同样表现为“打转”不等于同一根因 |
| [Best practices：纠偏](https://code.claude.com/docs/en/best-practices#course-correct-early-and-often)与[上下文管理](https://code.claude.com/docs/en/best-practices#manage-context-aggressively) | 保留反复纠正错误思路后清空重来的建议；同一任务仍可定向压缩 | 没有据此把清空或交接设成通用恢复默认；次数建议不证明根因 |
| [Goal：评估机制](https://code.claude.com/docs/en/goal#how-evaluation-works)与[要求](https://code.claude.com/docs/en/goal#requirements) | 会话级 prompt 型 Stop Hook，评估器依赖已展示证据，不独立检查文件或执行命令 | 工作区信任和 Hook 设置可使功能不可用；本轮未确认首次支持版本，不能套用 Codex 的版本号或承诺全部模型／客户端支持 |
| [Hooks：Stop](https://code.claude.com/docs/en/hooks#stop)与[StopFailure](https://code.claude.com/docs/en/hooks#stopfailure) | API 错误走 StopFailure 而非 Stop；输出／退出码无继续决策权 | terminalSequence 是显示例外；应用自身的恢复动作与 Hook 返回值控制续跑是两件事，不能由此推断 `/goal` 自身绝无重试 |

### 07 采用入口补核：续接不等于验收或硬限额

2026-10-15（UTC+8）重读当前官方 [Goal](https://code.claude.com/docs/en/goal)，新增核对停止、成本与恢复段落；据此收窄 07 §1 的“约束强度”阶梯，不重复 §6–7 已完成的 Ralph／harness 比较。**[一手：文档；研究：修订范围]**

- **退出不等于完成**：[评估机制](https://code.claude.com/docs/en/goal#how-evaluation-works)除 met，还有 impossible；[需处理的错误](https://code.claude.com/docs/en/goal#errors-you-have-to-fix-clear-the-goal)也能清除目标。读者须核停止原因与项目证据，不能看目标消失就收货。
- **边界由谁执行**：[条件编写](https://code.claude.com/docs/en/goal#write-an-effective-condition)中的轮数／时间条款由模型依据会话判断，不是确定性硬限额；[恢复说明](https://code.claude.com/docs/en/goal#resume-with-an-active-goal)还说明恢复 active goal 时轮数、计时与 token-spend baseline 重置，不能拿这一会话显示代替跨恢复累计预算。
- **额外成本**：[评估模型与成本](https://code.claude.com/docs/en/goal#evaluation-model-and-cost)明确评估 token 另按配置的小模型计费；即使官方称通常相对主轮次很小，也不能推导整套续接工作流省钱，因为后续实现、验证与审阅仍有成本。

这些来源是功能契约，不是本仓库对模型判定、费用或取消路径的实测；官方也提供清除目标与暂停路径，不能反向说它只能无限续跑。07 因而仅在明确验收下仍提前收尾时试用，已有可靠闭环就保持原流程；硬预算沿用执行环境真正提供的控制，不另建框架。**[一手；经验：采用与撤回]**

07 其余入口仅消除既有主专题冲突：§8 的“两次错误／第三次粘贴”不再自动触发常驻配置或 Skill，沿用 03／05 的增量与成本判断；§9 不按纠正次数清空，也不把全部文字规则搬成 Hook。重读[官方最佳实践](https://code.claude.com/docs/en/best-practices#course-correct-early-and-often)可见次数仍是其经验建议，不是因果证据。当前[完整命令表](https://code.claude.com/docs/en/commands)未列 `/handoff`，故 §3.5 撤回无来源的 HN 偏好推荐，改为按交接需要使用现有记录及普通提示；这不证明任何自定义扩展都不存在该命令，也不要求读者放弃已验证的扩展。**[一手：读取范围；经验：入口一致性]**

历史反证保留：17 原有依据包括 [Chroma《Context Rot》](https://research.trychroma.com/context-rot)（2025）关于输入增长与表现下降的研究，以及 [Claude Code changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) 2.1.293 所记的压缩后时序误判修复：把压缩前完成的动作当成压缩后发生，继而撤回或重复已有工作。两者提醒读者，缩小输入并不能排除真实的信息损失或压缩语义缺陷；本轮从正文移至此处保留，没有重新核实这两项历史来源，也不据旧修复断言当前全部压缩故障已消失。**[研究：历史研究；一手：原有 changelog 引用；经验：反证边界]**

采用判断：保留 20 的已有恢复记录建议，不新建框架；需要腾空间先控制输入，错误思路累积再清空，执行失败先查原结果与外部状态。最低版本未确认处只写当前官方文档，不推断发布范围。**[经验：综合建议]**

本轮只读官方页面并修改文档；未安装或运行 Claude Code、真实模型、引擎或恢复实验。仓库离线检查仅用于链接目标、配置及确定性回归，不证明上述恢复建议的模型效果。**[研究：验证边界]**


## 循环采用核查：续接、重置与新增反馈

> 核实：2026-10-15（UTC+8）；对应 07 §6–7。只读公开源码、测试定义与作者原文，没有运行客户端、模型或上游脚本。本节只补原记录未核对的具体采用边界；通用的自报不等于验收、未知结果先对账继续由 20 维护。

### 1. 官方同会话循环不等于每轮重置

[官方 marketplace 固定提交 `c2bdb42`](https://github.com/anthropics/claude-plugins-official/tree/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/ralph-loop) 的 [stop-hook.sh](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/ralph-loop/hooks/stop-hook.sh) 读取同一项目状态及 transcript，匹配 promise 或检查迭代上限，否则返回 `decision: block` 并重送原提示。它不启动新 CLI，也不运行项目测试。故不能把社区 fresh-context 经验直接归给该插件。**[一手：固定源码]**

采用前还应区分“有上限参数”和“终止路径可靠”：[#5605](https://github.com/anthropics/claude-plugins-official/pull/5605) 核实时仍 open、未合并；其 head [`a310cc1` 的七项回归](https://github.com/anthropics/claude-plugins-official/blob/a310cc1ae637b67ba7fd14c6f5c21e97d07d48d0/plugins/ralph-loop/tests/stop-hook.test.sh) 用合成 transcript／状态文件检查裸词误完成、promise 空白不对称、无空格计数不增长，以及合法标签、正常增长与上限对照。已读 main 仍保留相应旧分支。测试作者报告七项通过，本文只读定义，未复跑；即使这些修复通过，也没有检验生成代码或业务验收。不要将 PR 存在写成已发布修复，也不把这些受特定输入触发的问题推成所有运行必然失败。**[一手：PR／测试；研究：范围]**

### 2. 不同作者的实际采用链与反证

| 作者与任务 | 可核对的链 | 改变采用判断的限制 |
|---|---|---|
| hironori-maruoka，10×20 浏览器表格，公式、依赖重算与环检测 | [2026-01-30 原文](https://developer.mamezou-tech.com/en/blogs/2026/01/30/kiro_cli_ralph/) → [`47b0652` 的循环脚本](https://github.com/hironori-maruoka/kiro-ralph/blob/47b0652978540f56ff2c7e56d485ba6e2ef92e39/afk-ralph.sh) 每轮启动 Kiro CLI、读规格与进度 → [引擎测试](https://github.com/hironori-maruoka/kiro-ralph/blob/47b0652978540f56ff2c7e56d485ba6e2ef92e39/spreadsheet-sample/tests/engine/engine.test.ts) 包含链式更新、错误传播、打破循环后恢复数值 | 脚本以任务勾选和 promise 退出，不独立运行测试；作者观察到进度文件位置漂移，并限制会挂起的 watch／交互命令。博客报126 tests，但同提交 [PROJECT_COMPLETE](https://github.com/hironori-maruoka/kiro-ralph/blob/47b0652978540f56ff2c7e56d485ba6e2ef92e39/spreadsheet-sample/PROJECT_COMPLETE.md) 报115，故不引用统一通过数或称本仓复测。无普通会话基线。**[社区：作者运行；一手：源码／测试]** |
| Johannes Barop，Ralph 台词浏览／投票应用 | [作者原文](https://www.codecentric.ai/en/knowledge-hub/blog/the-ralph-wiggum-loop-autonomous-code-generation-with-a-fresh-context) → [`ee5d9d1` 的循环](https://github.com/jbarop/unpossible-app/blob/ee5d9d1499d432eb99597f6c849b7e95fa200ce6/ralph-wiggum-loop.sh) → [prompt](https://github.com/jbarop/unpossible-app/blob/ee5d9d1499d432eb99597f6c849b7e95fa200ce6/prompt.md) 要求读规格、选择待办、测试后提交 | 作者报告得到能用的应用；脚本实际只 grep 计划中的完成句，或到50次停止；测试由提示要求，非脚本验收。逐阶段新进程是其实现选择，没有同任务不重置对照，不能证明普通会话不足。**[社区：作者运行；一手：固定脚本]** |

两条链来自不同作者、不同应用，可支持“能这样做”，不能支持“应当这样做”。两份脚本还使用宽权限参数，本文不复制其授权做法。测试存在、作者自述与当前部署结果分开；本轮未启动应用，也没有取得独立使用者的后续维护数据。**[研究：横向判断]**

补充撤回范围：[Konstantin Burkalev 的两个月使用复盘](https://blog.ksdaemon.com/dev/my-take-on-ralph-loop/) 明确把按钮／小端点留给普通提示，且其循环任务完成后仍需大量审阅与修改。它是作者经验，未提供对应任务的公开前后补丁和工时原始表；不采纳其 1.6–1.8 倍估计为效果证据，也不将其按任务大小的门槛升级为通则。这里只支持把审阅与返工纳入采用成本。**[社区：自报；研究：采用边界]**

### 3. 历史 harness 自己已经撤去哪些环节

[Prithvi Rajasekaran，2026-03-24](https://www.anthropic.com/engineering/harness-design-long-running-apps) 的原文比 07 旧摘要更有条件性：Sonnet 4.5 的上下文焦虑促成重置；Opus 4.5 已可使用连续会话和自动压缩；4.6 再取消 sprint，并把评价改为整轮构建后进行。保留评价的实质证据是 DAW 的拖动／录音等交互缺口仍会被发现，而非任务数量。作者还报告大幅删减一度损害结果，随后改为逐项移除；这也反对一口气取消所有检查。**[一手：历史作者实验]**

早期游戏制作器比较同时改变预算、规划范围和评价结构；后续 DAW 又换了模型与任务，不是受控消融。没有据此推定“现在只需最终评审”，也不将作者扩展产品范围的偏好等同用户想要更多功能。**[研究：外推边界]**

### 4. 本轮收敛的选择

- 普通会话已能实现并验证：不安装循环，不为“任务长”自动切会话
- 有明确可继续工作却停止：先核对停止原因，再试有上限、可取消的续接；原有[提前停止案例](2026-10-10-codex-continuity.md)说明缺口可能存在，但尚未证明 Ralph 能修复该客户端故障
- 连续上下文确实失效：才试新会话＋最小恢复信息，不能用同会话 Stop 插件代替重置
- 结果有可观察缺口：补会带来新证据的检查；反复催促、重复同一判断或预算用尽不算质量提升
- 模型／任务变化：一次移除一个可选环节，保留风险所需的中间契约与检查；只有现实缺口消失才撤回，不预设固定轮数

以上为 **[经验：条件建议]**，不是新的模型效果实验。后续若获准对照，应固定目标质量与范围，分别比较普通会话、同会话续接和新进程循环，纳入未完成行为、误报完成、返工及人工审阅成本；当前不执行。


## 续接提交前检查分支与本地基线

> 核实：2026-10-16（UTC+8）。对应20 §9与运行手册 §4.5；只补本地续接的前置条件，不新增检查框架。**[经验：采用范围]**

**观察与发布状态分开**：公开提交 [`a8f70dc`](https://github.com/dbvv1/a1dbv/commit/a8f70dc) 与本地原提交 `d93ca2a` 同父，tree 均为 `44f3fd1b762f507a2fe0f1868f981b7b12181361`。本地续接又产生 `2d4598b`，其父为 `d93ca2a`，只新增 TASKS 的一个空行和同义状态段；这个重复提交未发布。核对远端已发布内容后，保留原本地分支并从远端成果继续，没有改写已发布历史。可用 `git show -s --format='%h %p %T %s'` 与 `git diff <commit>^ <commit>` 核对对象和增量；本地未发布对象不保证在公开克隆中可取得。以上只证明该次内容与提交关系，不推断续接原因或用户取消。**[经验：单仓Git对象与发布核对]**

**改变的选择**：仅靠发布时远端CAS，不能阻止本地先做出重复提交。开始操作时保存预期分支与HEAD，恢复及暂存／提交前对照；不同或缺失先对账，不能在异常后重新采当前值让旧操作通过。原成果已发布且没有实质增量则不重做；需要新工作时，先确认新范围再建立新基线。下例只检查普通单父提交；整合提交须按整合计划核对父集合。**[经验：条件建议]**

以下在独立临时仓库、已安装Git下离线运行；没有访问原会话、凭据，也没有运行模型或引擎。代码仅构造Git状态，不重放原执行过程：

```sh
set -eu
repo=$(mktemp -d)
git -C "$repo" init -q -b task
git -C "$repo" config user.name offline-check
git -C "$repo" config user.email offline@example.invalid
printf 'base\n' > "$repo/content"
git -C "$repo" add content
git -C "$repo" commit -qm base
expected_branch=$(git -C "$repo" symbolic-ref HEAD)
expected_head=$(git -C "$repo" rev-parse HEAD)
check_base() {
  test -n "$expected_branch" && test -n "$expected_head" &&
  test "$(git -C "$repo" symbolic-ref -q HEAD)" = "$expected_branch" &&
  test "$(git -C "$repo" rev-parse HEAD)" = "$expected_head"
}
git -C "$repo" switch -qc other
if check_base; then exit 1; fi
test "$(git -C "$repo" rev-parse HEAD)" = "$expected_head"
echo 'same-HEAD/wrong-branch: rejected'
git -C "$repo" switch -q task
printf 'work\n' >> "$repo/content"
check_base
git -C "$repo" add content
checked_tree=$(git -C "$repo" write-tree)
check_base
git -C "$repo" commit -qm work
test "$(git -C "$repo" rev-parse HEAD^)" = "$expected_head"
test "$(git -C "$repo" rev-parse HEAD^{tree})" = "$checked_tree"
echo 'normal-path: passed; parent/tree: matched'
original=$(git -C "$repo" rev-parse HEAD)
printf 'redundant status\n' > "$repo/status"
if check_base; then exit 1; fi
test "$(git -C "$repo" rev-parse HEAD)" = "$original"
test -z "$(git -C "$repo" diff --cached --name-only)"
test -f "$repo/status"
echo 'advanced-HEAD: rejected; HEAD/index unchanged; work preserved'
published=$(printf 'counterpart\n' | git -C "$repo" commit-tree "$checked_tree" -p "$expected_head")
test "$published" != "$original"
test "$(git -C "$repo" rev-parse "$published^{tree}")" = "$checked_tree"
echo 'different-commit/same-tree: confirmed'
expected_head=''
if check_base; then exit 1; fi
echo 'missing-expected-HEAD: rejected'
```

实际输出（退出码0）：

```text
same-HEAD/wrong-branch: rejected
normal-path: passed; parent/tree: matched
advanced-HEAD: rejected; HEAD/index unchanged; work preserved
different-commit/same-tree: confirmed
missing-expected-HEAD: rejected
```

**边界**：相等检查不是原子锁，检查后仍可能发生并发checkout／commit；因此不替代串行整合、受检树核对、发布前的父提交核对或远端CAS。同HEAD下的语义重复也可能通过；提交不同而tree相同只说明快照相同，须结合原操作和发布回执判断是否已交付。未测真实客户端恢复、失败率或节省时间，不声称机制已防住所有重复。**[经验：确定性检查及局限]**


## 16 页历史页头

历史原文转存：2026-10-16（UTC+8），来自 `docs/16-building-agents.md` 的原页头。以下保留当时的核查日期、范围和来源说明；相对链接以原页面路径为基准，不表示本次重新核实。

```text
> 核实时间：2026-10-16（UTC+8）补请求超时范围；2026-10-15（UTC+8）局部复核 SDK／托管选型、配置、缓存、预算与程序化工具调用；方案概览基线为 2026-10-08。2026-10-15 完成全文核心建议独立审阅，补 outcomes 终止条件并归一模型价表入口；不代表真实 SDK 或模型效果已验证。
> 依据 **[一手]**：
> - Anthropic：Claude API 官方 Skill（随 Claude Code 2.1.294 分发）中的方案比较、Agent 设计和 Managed Agents 文档；克隆查看了 [claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python)；
> - OpenAI：developers.openai.com 的 [Agents](https://developers.openai.com/api/docs/guides/agents) 和 [Decisions](https://developers.openai.com/api/docs/guides/decisions) 指南，learn.chatgpt.com 的 [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk)、[app-server](https://learn.chatgpt.com/docs/app-server)、[codex exec](https://learn.chatgpt.com/docs/non-interactive-mode)（Markdown 版）；
> - Google ADK、AWS Strands、OpenAI Agents SDK 的仓库（只确认了活跃度，2026-10 都有提交）。
>
> 前面的章节讲“怎么用现成的 Coding Agent”。这一篇讲**什么时候该自己搭**，以及各家的搭建方式。

```


## 完成状态正确，已完成动作仍可能被重新执行

核实：2026-10-16（UTC+8）。主线三／M4；改变20的恢复验收：扩大嵌套委派或更换续接入口时，核已完成动作是否重做，不只核最终状态。此项不同于请求超时、结果未知后的重试。[研究]

- **使用报告与复测分开。** [#9106](https://github.com/langchain-ai/langgraph/issues/9106)报告嵌套工具逐项审批后的外部重复记录；公开最小复现用计数器。另一个参与者的[跨进程复测](https://github.com/langchain-ai/langgraph/issues/9106#issuecomment-5908176242)使用持久 checkpoint 与独立 SQLite 副作用表，逐次正常退出再启动；它支持该合成案例跨进程发生，不证明真实 API、崩溃窗口或并发恢复的 exactly-once。[社区：报告与复测者自报]
- **固定修复与正常重入分开。** [b0482d0](https://github.com/langchain-ai/langgraph/commit/b0482d0627ec8fdf7c91fba7ffd17403583c59d0)于北京时间2026-10-16 03:51合入，区分最新 checkpoint 的续接、主动 time travel 和已被推进的旧 checkpoint。[实现](https://github.com/langchain-ai/langgraph/blob/b0482d0627ec8fdf7c91fba7ffd17403583c59d0/libs/langgraph/langgraph/pregel/_loop.py#L943-L973)不再只据键存在决定重放。正常 interrupt 恢复仍从未完成节点开头进入，见[契约](https://github.com/langchain-ai/langgraph/blob/b0482d0627ec8fdf7c91fba7ffd17403583c59d0/libs/langgraph/langgraph/types.py#L906-L925)；不能要求每个节点只进入一次。[一手：固定源码]
- **计数位置决定验收含义。** [test_pregel](https://github.com/langchain-ai/langgraph/blob/b0482d0627ec8fdf7c91fba7ffd17403583c59d0/libs/langgraph/tests/test_pregel.py#L7737-L7853)新增 interrupt 后的 answered 计数，两个子图的 human、dolphin 各应为2；另一些测试在 interrupt 前计数，包含合法重新进入，不能把它当副作用次数。[主动回放反例](https://github.com/langchain-ai/langgraph/blob/b0482d0627ec8fdf7c91fba7ffd17403583c59d0/libs/langgraph/tests/test_time_travel.py#L1180-L1214)仍要求重新提问。[一手：测试定义，未运行]
- **测试回执不跨树继承。** [11例复测报告](https://github.com/langchain-ai/langgraph/pull/9315#issuecomment-6200581015)针对05379f4c、内存 checkpointer、同步图 API 和合成副作用；最终合并树还包含额外的 main 整合；回执指向整合前的提交，不据此推定实际测试与整合的先后。它不是最终合并树、完整 pytest 矩阵或生产环境通过的证明。[社区]
- **合入不等于已发行。** 所核[1.2.15 release](https://github.com/langchain-ai/langgraph/releases/tag/1.2.15)先于补丁，其[08a3456源码](https://github.com/langchain-ai/langgraph/blob/08a345637fb2bd499f69c90056a22c478a468817/libs/langgraph/langgraph/pregel/_loop.py#L352)仍按 checkpoint_id 键存在判断 replay；不能建议升级该版即可解决，也未在本仓运行该版复现。根图某个入口正常不能覆盖显式当前 head ID 等其他入口。[一手／研究]

**采用判断。** 复用现有执行记录与原生恢复机制，先核实际安装版本和续接入口；业务去重仍由真正执行动作的一层承担。只读任务或已有足够验收的未变流程不因此增加框架。此次只读公开源码、原帖、测试定义与发行元数据，未运行模型、LangGraph、外部 API 或上游测试；下一有价值证据是发行后在原触发条件下的接收方复测，不继续堆相同模拟变体。[研究]


## 可选子任务可降级，必要验收换执行者

核实：2026-10-17（UTC+8）。主线三／四，M3／M4；改变20 §5的失败处置：不把所有子任务都当阻断条件，也不把失败当通过。沿已有发布工作流借用分支选择，不推荐整套框架，不重复§9的未知写入对账。[研究]

**同一工作流已有不同可行解。** gstack [#2772](https://github.com/garrytan/gstack/pull/2772)于2026-09-01合并为`0d1bd5616c0ef096bb7ccee336f63c60ee408618`，版本文件／变更记录标1.79.0.0；其模板按缺失结果的用途处理：[一手：合并、固定模板]

- **必要检查换执行者。** [覆盖审计L23](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/ship/sections/test-coverage.md.tmpl#L23)要求先停仍运行的子任务，再由父任务内联审计；[计划完成审计L17–23](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/ship/sections/plan-completion.md.tmpl#L17-L23)沿同一分类逻辑接管，父任务仍失败则须明示选择，默认停止修复。源码允许用户另行选择跳过并记录，不是Agent自行把失败改成通过。[一手；研究：采用边界]
- **可选补充允许缺席，但不能仍有写入者。** [文档同步L30–39](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/ship/sections/pr-body.md.tmpl#L30-L39)允许省略PR的Documentation段并标未完成；恢复前先停止共享工作树的子任务，停不掉则再等一段，仍在运行就停整次ship。已产生提交须检查整个新增序列，只要祖先含非允许文件就不推；未提交内容保留。这里的可选项是该流程的文档同步，不能推广为迁移说明、使用者必需文档或任意验收均可省略。[一手；研究]
- **仅在父任务分支写“不可用”仍会漏错。** 同版[Greptile L13–24](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/ship/sections/greptile.md.tmpl#L13-L24)虽给派发失败设UNAVAILABLE，却让子任务把API错误、无PR与零评论都返回`total:0`，父任务随后静默跳过。因此降级判定必须从子任务结果契约一直到交付记录区分失败与成功空结果。[一手：历史模板反例；研究：不是实际运行复现]

**后续修改已修历史反例，不把旧错当现状。** [#3057](https://github.com/garrytan/gstack/pull/3057)已合并为`28f1385eac65cab592fe267956f07b205271df1b`（2026-10-06，版本标1.91.32.0）。[修订模板L29–46](https://github.com/garrytan/gstack/blob/28f1385eac65cab592fe267956f07b205271df1b/ship/sections/greptile.md.tmpl#L29-L46)分别返回`complete/no_pr/unavailable`，未知／缺失状态按不可用；只在成功抓取后允许报告零评论，并要求确认运行中子任务已停。当前核对的[f47321e6模板](https://github.com/garrytan/gstack/blob/f47321e6158f37d1393d8e58d5725fb161cc8ffa/ship/sections/greptile.md.tmpl)仍保留该区分。[一手：固定源码与PR元数据]

**证据不能升级成超时保证。** #2772自报派发与正常doc-sync E2E通过，但明确列出“仍被后台化后的deadline恢复”“再次push拒绝”“Greptile unavailable”三条未做E2E的分支。其[测试L90–101](https://github.com/garrytan/gstack/blob/0d1bd5616c0ef096bb7ccee336f63c60ee408618/test/run-in-background-guidance.test.ts#L90-L101)只钉住恢复／scope字符串；约10分钟是返回后台launch metadata之后的提示约定，不是可打断前台调用的watchdog。模板要求停止不等于已证实停止后没有遗留进程写入。此次未运行客户端、模型、上游测试或恢复实验，未取得故障注入恢复及接收方完整重试回执。[一手：测试定义；社区：作者测试报告；研究：范围]

**借用分支判断，不照抄宿主字段。** 后续[f67c478f的共享派发规则L222–228](https://github.com/garrytan/gstack/blob/f67c478f05d8e0b39339599ad11c91a3478515ae/scripts/resolvers/constants.ts#L222-L228)已改成参数存在才请求前台，收到launch receipt就等完成通知；[官方当前说明](https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background)也区分fork模式与非交互入口。无需关闭宿主控制来迁就旧模板。[一手；研究]

**采用与后续。** 按[20 §5](../20-codex-long-horizon.md#5-子任务应缩短关键路径不应制造评审树)分流；原验收要求独立审阅时，父任务内联接管不能替代独立执行者。后续追真实失败分支的停止／恢复及最终交付回执；作者“第三次复发”或合并数量不作可靠性统计。[研究]


## 跨执行者派发：先保证任务身份可重新发现

核实：2026-10-17（UTC+8）；主线三／四，M4。改变 20 首表及 §5 的派发选择：发送前核对回执丢失后能否用双方已知的身份找到同一任务；§9 已有“结果未知先查再重试”，本节补的是能够查询的前提，不新增状态机或模板。[研究]

**实际故障与合并范围。** [CAO #447](https://github.com/awslabs/cli-agent-orchestrator/issues/447)报告 Codex 的 600 秒 MCP 截止早于 900 秒 handoff 等待，worker 可能继续；重复派发有重复工作的风险。[#453](https://github.com/awslabs/cli-agent-orchestrator/pull/453)于 2026-09-19 合入 `9233416d22e52027a4a129c11a6a3aa1b2bc7cac`，增加结果保存与查询，但明确保留早期 ID 交付缺口；issue 关闭不能作为完整恢复回执。[社区：原始故障；一手：PR 及固定实现]

- [固定 `orchestration.py` L932–964](https://github.com/awslabs/cli-agent-orchestrator/blob/9233416d22e52027a4a129c11a6a3aa1b2bc7cac/src/cli_agent_orchestrator/utils/orchestration.py#L932-L964)：[L1244](https://github.com/awslabs/cli-agent-orchestrator/blob/9233416d22e52027a4a129c11a6a3aa1b2bc7cac/src/cli_agent_orchestrator/utils/orchestration.py#L1244) 在内部生成随机 `job_id`，HTTP 等待为 `timeout + 180` 秒；该超时分支等待内部 HTTP 截止后才返回 `pending` 及 ID。provider 先断开时，持久化结果可能存在，调用方却没有查询身份。源码注释明确把此缺口留给 #715。[一手：固定源码]
- [固定 `agent_step.py`](https://github.com/awslabs/cli-agent-orchestrator/blob/9233416d22e52027a4a129c11a6a3aa1b2bc7cac/src/cli_agent_orchestrator/services/agent_step.py)在提取结果后、清理 terminal 前尝试保存；[测试 L594–668](https://github.com/awslabs/cli-agent-orchestrator/blob/9233416d22e52027a4a129c11a6a3aa1b2bc7cac/test/services/test_agent_step.py#L594-L668)既断言保存先于删除，也明确规定保存失败仍清理并返回成功。因此该提交是 best-effort 保存，不能称 crash-safe 交接；未确认首个发行版本或当前部署行为。[一手：实现与测试定义；研究：范围]
- [#715](https://github.com/awslabs/cli-agent-orchestrator/issues/715)于本次读取仍 open：记录 key 对应 terminal 不等于记录是否已提交；跳过发送可能丢任务，重发可能重复。相关 PR 撤掉对外 `--idempotency-key` 选项，缺少的 run record 仍待实现。这里引用维护者记录的缺口，不把建议状态机当成已提供功能。[社区／一手：公开维护记录]

**已有载体是可选起点。** 独立项目 Symphony 固定于 `be10a1b79df723d6d7612b5651c8522704dafb2e` 的[WORKFLOW L82–87、L142–147](https://github.com/openai/symphony/blob/be10a1b79df723d6d7612b5651c8522704dafb2e/elixir/WORKFLOW.md#L82-L147)从已知 issue 读取并复用单一 workpad comment，保存 comment ID，后续在[同一记录留下 commit 与验证摘要](https://github.com/openai/symphony/blob/be10a1b79df723d6d7612b5651c8522704dafb2e/elixir/WORKFLOW.md#L221-L227)；PR 关联放 issue 字段。它示范复用现有任务系统，不证明必须安装 Symphony 或 Git 优于其他存储。[SPEC §14.3](https://github.com/openai/symphony/blob/be10a1b79df723d6d7612b5651c8522704dafb2e/SPEC.md#L1690-L1705)将重启恢复限定为 tracker 与保留 workspace 重新发现工作，不恢复原 retry timers 或假定运行会话可恢复；[调度认领由单一权威串行更新](https://github.com/openai/symphony/blob/be10a1b79df723d6d7612b5651c8522704dafb2e/SPEC.md#L725-L731)，不能把可读的认领文件当互斥锁。[一手：固定工作流与设计契约]

**采用边界。** 派发身份应能关联基线、交付版本与接收方处理结果；已有 issue／PR 或共享任务记录能做到就保留，确有发现／事件处理缺口再评估补充。通知与结果查询仍分开，失联后先核原工作，未确认是否投递就不自动重派。未运行上游测试、真实客户端、故障注入或模型；不主张上述实现具备完整确认回执、跨主机恢复、恰好一次执行或效率优势。[研究：采用判断与未验证范围]
