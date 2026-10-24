主线：三，兼二／四
改变的建议：续改分验有意改变与必须保留的行为；迁移核消费者、持久状态与真实运行入口，撤替代层前确认原生能力承接。[研究／经验]
新证据：2026-10-24 补[P49故障传播](#p49生成服务的故障证据)的Payment／flagd两路真实接收；10-21的完整三路传播仍有未运行部分；2026-10-20 补P27同一活动改稿／恢复的固定链和逐人判据（未运行）；2026-10-20 追加固定Prisma应用的两轮继承纸面包、GitLab修复链及工具边界；CPython等旧记录保原日期／运行边界，不由局部实试更新整页范围。[一手／研究]

2026-10-20历史提议：[P22](#p22有数据应用的两轮迁移)已交两轮继承纸面包与固定维护链，15§5据此明确迁移默认；[P23](#p23next应用迁出后仍值得保留吗)交固定shop两轮纸面包与发行包边界：博客先保Next并用有限缓存寿命；无文章回调，不承诺即时下架。均不代表运行效果。[研究]

# 开发条件：维护与迁移

✅ 先明确下一次修改需要保留的契约，再选共享或替换；⛔ 不把代码合入、启动成功或重复执行当成消费者恢复。需求或调用者变化时重新验收。[研究／经验]

Agent 负责追踪修改传播并给出候选实现；人须确认业务契约、真实消费者和可接受的恢复目标。

[总览与旧章节索引](2026-10-12-development-conditions.md)；[共同来源与阅读范围](2026-10-12-development-conditions.md#来源与阅读范围)；[有状态应用续改与故障诊断续篇](2026-10-12-development-stateful-diagnostics.md)。

<a id="s387"></a>

## 三、领域知识比通用规划更可能是持久资产

类型以外的舍入、时区、错误码、生产作业与可接受异常也决定正确性；可追踪案例和理由可能比通用规划提示更有增量。**[经验：待检验判断]**

S2 的迁移教程用 COBOL/JCL 数据流说明这点，但不能整套照搬：

- 它安排多份 overview/design/validation 文档，适合复杂迁移，不是每个小功能都需要四份文件。
- 第 3 阶段明确允许测试占位，之后才接入旧/新系统；因此“测试文件已生成”不是兼容性已验证。试点时应尽早确认旧系统是否真能运行，否则可能写出大量无法验证的迁移计划。
- 旧系统是行为基线，不是所有行为都正确。应分清必须兼容、明确要改变、仍有争议的行为；否则 Agent 会复制旧 bug，或擅自修正实际上必须兼容的细节。
- 教程出现 `.agent/AGENTS.md` 的规划例子。按已核对的 Codex 指令发现机制，不能由文件存在推断它在仓库根任务自动加载；要有适用目录或明确引用。这再次说明官方教程也需结合客户端机制阅读。

<a id="s398"></a>

### 迁移后的事实归属与旧调用方式

> 核实：2026-10-14 UTC。改变 15 §5 的试点范围：职责迁移后，输出相同仍不足以证明查询走在正确系统上。**[研究：采用判断]**

[Anthropic 源码管理团队复盘](https://www.anthropic.com/engineering/redesigning-source-control)发表于 2026-10-13；“What we learned building Scion”报告，多个系统让 Agent 线性读取提交日志来推算变更何时合入 main，而工程师要求改向代码评审工具查询。这里缺的不是更多逐文件验证，而是确定谁负责提供这项事实。**[一手：工程团队自述；研究：原因与建议提炼]** 因此在跨系统迁移试点中，检查查询来源及已退役的调用方式；不能仅因新旧输出相等就接受原有扫描或状态重建路径。

**保留兼容的反例。** [Sapling 官方介绍](https://sapling-scm.com/docs/introduction/)的“Why make a new version control?”说明，其内部抽象将体验与仓库格式分离，使内部扩展方案仍能与 Git 仓库交互。**[一手：官方设计说明，非同负载对照]** 所以采用的是事实归属检查，不是默认删除兼容：外部消费者仍需要旧接口，或新接口不能覆盖语义、权限及可用性要求时，保留适配或缩小迁移范围。**[经验：采用与撤回条件]**

**来源边界。** 只读官方原文；Scion 无对应补丁、固定源码、原始轨迹或独立复测，日期仅为发表时间。Sapling 为未固定历史版本的当前文档；未运行软件／模型、未测维护收益。

<a id="s408"></a>

## 四、游戏开发用来检验这个方向，而不是扩张引擎百科

游戏中的时间、输入、随机性、加载和镜头会影响观察；可借其接口设计检验通用方法，不能外推全部游戏。

假设要修“冲刺后偶尔穿墙”：保存初始位置、速度、碰撞体、输入序列与相关种子，配合固定步推进，有助于重复调查；同时还要通过真实输入链与实际帧时序复查。直接设置最终位置或只调用移动函数会跳过输入采样、动画与物理调度，不能证明用户路径修复。固定种子也不自动消除物理引擎、并发和平台差异。**[经验：案例设计，未运行引擎]**

状态定位机制、截图看呈现、试玩判断控制感与设计目标；三者不作永久成本排名。状态通过而画面不可玩须解释；玩家不接受机制可能要求改设计。

Jeff Schomay 原博客在原调查中访问受限，没有把旧文转述升级为一手复核。实际选型应回到对应领域页，不用“L3 性价比最高”或“AI 做不出好玩游戏”替代具体证据。**[研究：来源与适用边界]**

<a id="s418"></a>

## 五、我们应怎样安排研究，而不是怎样继续加任务

下列案例把项目知识、反馈与架构判断落实到真实后续修改。选择干预时须指出任务缺口、替代方案与额外成本；模型能力仍可能是瓶颈，撤回条件见本节末尾，不再沿早期 D4／D6 分工重复扩任务。**[经验：选材原则]**

<a id="s422"></a>

### Discourse：共享组件承接后续需求

✅ 对语义相同的新视图，先复用现有组件；真实需求出现时，再检查能否只扩展共享边界，不提前建立通用框架。**[研究：采用判断，2026-10-13]**

**起点与归属。** [#38888](https://github.com/discourse/discourse/pull/38888) 由 markvanlan 提交，2026-04-16 合并；[固定提交](https://github.com/discourse/discourse/commit/8feeaa5d69cd9462cc6aa4f560cb1e953e588e0b) 列 Claude Opus 4.6 及多位人类 coauthor，记录作者声明的 AI 参与，不包含生成过程，不能归因全部代码。[初始 header](https://github.com/discourse/discourse/blob/8feeaa5d69cd9462cc6aa4f560cb1e953e588e0b/frontend/discourse/app/components/nested-view-header.gjs) 直接导入并渲染已有 TopicCategory。**[一手：署名与源码]**

**真正的下一需求。** 8 月 11 日，另一贡献者 nullchristo 的 [#42520](https://github.com/discourse/discourse/pull/42520) 为客户插件在 category/tags 旁增加信息提供扩展点。[合并补丁](https://github.com/discourse/discourse/commit/e4f8b88ea34f1fe23474a62ddb1afb01b65f7b8e) 只改共享 TopicCategory 的包装 outlet 和 docked header 的 topic 参数；同版本 [nested/header](https://github.com/discourse/discourse/blob/e4f8b88ea34f1fe23474a62ddb1afb01b65f7b8e/frontend/discourse/app/components/nested/header.gjs) 仍调用它，未另改树加载或复制 nested 专属实现。作者与初始 coauthor 不同，但未证首次接手。**[一手：需求、补丁与调用链]**

**交付边界。** 后续 PR 获批准并合并。[core frontend 原日志](https://github.com/discourse/discourse/actions/runs/31506849232/job/93830516975) 核实运行版本为 `48d4571d4d747ae4fade0c49fd9e851fb693cd78`，即 head `cd63a1cc4b647701f505131af05bd7368fdf4bc5` 与 base `3908561e29d2187ac622eadd8a59fa3ba54ebac1` 的测试合并；`qunit:test` 汇总 6473 passed、0 skipped/failed。补丁没有新增测试，日志中通用 PluginOutlet 用例不等于新客户插件验收；原需求说将支持该插件，无客户部署／复测／工时；只读未复跑。**[一手：CI 原日志；研究：范围限定]**

**反例约束。** [真实管理员报告](https://meta.discourse.org/t/im-struggling-to-recover-deleted-post-how-to-fix/403161/1)显示，已删除 nested topic 的 500 阻断恢复。[#40134](https://github.com/discourse/discourse/pull/40134) 的[固定修复](https://github.com/discourse/discourse/commit/a051d96b6526c7a2ad2b7754863d7364e6401c28)给 OP 查询补接已有 visibility helper，并新增 staff show/context 返回 200 与 placeholder、non-staff 返回 404 的断言。修复作者 xfalcox 也是初始人类 coauthor，属团队维护；手工恢复未勾选，不能写用户已成功恢复。**[社区：用户原帖；一手：补丁]**

UI 复用未覆盖后台生命周期；继续核查看、删除和恢复，局部补接够用时不重写架构。**[研究：采用建议]**

<a id="s436"></a>

### Pydantic AI：取消契约改变，不代表正常完成也应改变

> 核实：2026-10-14 UTC。主线三；改变 22 §5：把“本次要改变的行为”与“相邻仍须保留的行为”成对验收，再判断修复应落在哪层。✅ 采用；未测模型效果。**[研究：采用判断]**

**固定演化链。** 以下源码均只读，未安装或执行 Pydantic AI：

| 阶段 | 固定来源／真实需求 | 能确认什么 |
|---|---|---|
| 初始产物 | [v1.91.0 的 `_agent_graph.py`](https://github.com/pydantic/pydantic-ai/blob/b83abdf23d2cfe9940a83b51b1ce7abe0fc9b807/pydantic_ai_slim/pydantic_ai/_agent_graph.py#L668-L677) | 共享节点在消费者返回后继续排空，注释说明用于完整 usage 统计；是行为基线，不是这条路径的历史通过日志 |
| 后续真实需求 | [#5132](https://github.com/pydantic/pydantic-ai/issues/5132)；[变更 `93a6104`](https://github.com/pydantic/pydantic-ai/commit/93a61042943d3887c737ba753b908f258e8ea162) | 报告者在 1.81.0 的取消复现中记录清理未完成、仍有 4 个任务；#5313 引入托管流的确定性清理，并移除共享节点的排空循环 |
| 用户故障与修复判定 | [#5769](https://github.com/pydantic/pydantic-ai/issues/5769)、[#5771](https://github.com/pydantic/pydantic-ai/pull/5771) | 报告涉及 1.92–1.105 的空响应／零 usage；维护者将条件收窄为 handler 正常返回但未消费完流，普通无 handler 路径不受影响 |
| 窄修复产物 | [最终 `49f62a3`](https://github.com/pydantic/pydantic-ai/commit/49f62a386041abd6e0d960dd629c3b4fe28eac63) | 只改 `agent/abstract.py` 与 `tests/test_streaming.py`：在三处 driver 的 handler 正常返回后排空，异常向外传播时不进入该语句；保留共享节点与公开 API |

源码／补丁 **[一手]**，故障为 **[社区：运行自述，非本仓复现]**。#5132 明确披露由 AI coding assistant 与用户协作提出；#5313／#5771 另有 Codex、Devin 自动评审，但不能据通用 AI checklist 推断实现由哪个模型生成。

**为什么不能恢复旧循环了事。** 正常返回的 handler 可以只观察部分事件，最终响应仍须完整。共享节点的旧循环位于 `yield` 后、`try` 内，向外传播的异常本来就会跳过它；#5771 指出的另一冲突是显式 `stream.cancel()` 后仍可正常退出上下文，旧循环仍会尝试排空。最终由 driver 在 handler 正常返回后补齐流，向外传播的取消／其他异常则跳过；handler 内部只 `break` 再正常返回仍属于应排空的路径。职责调整保留显式取消与正常完成两种契约。**[一手：前后控制流、修复说明；研究：决策解释]**

这也不是“内层已有抽象就绝不动外层”。[Devin 指出](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3349919895) `CallToolsNode` 内层自排空不保证 capability wrapper 完成；[作者明确回复](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3353383025)已修正，最终三处分支一致。[Codex 则提出](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3349656443)删除公开 `AgentStream.drain()` 会破坏调用者；[最终 `result.py`](https://github.com/pydantic/pydantic-ai/blob/49f62a386041abd6e0d960dd629c3b4fe28eac63/pydantic_ai_slim/pydantic_ai/result.py#L173-L177)仍保留该方法。前者获作者确认，后者仅产物对应；不独归因某条反馈。**[一手：评审、回复、源码]**

**成对验收与执行边界。** 最终新增四个正常完成测试，分别覆盖 `run`／`run_stream` 的完整文本与工具调用；另一个仅覆盖 `run` 的取消测试使用无限流，handler 抛出 `CancelledError`，要求只发生一次前置 lookahead。同时验完成与取消。[先前测试提交](https://github.com/pydantic/pydantic-ai/commit/95d9ff040d327a57423438df060b23bfb3e65d50)报告 `try/finally` 排空变体会失败；[后续提交](https://github.com/pydantic/pydantic-ai/commit/230e6d10ea4ec13198bd80fffc2014b2ac23e13f)将有限 sentinel 改为无限流与计数，以消除不可达的覆盖行。仅测试定义／mutation-testing 自述，缺红绿原日志。PR 页面显示 56 checks passed，也不能代替逐测试前后结果。**[一手：测试、提交说明与平台摘要]**

**最强反证。** #5771 明说用户最初贴的非流式例子并不触发该路径；#5769 当前正文已经过修改，非原始成功复现。修复 PR 正文还残留“CallToolsNode 分支不动”的描述，与最终补丁不同，故以上以固定产物和作者后续回复为准。[第三方历史复演](https://www.startearly.ai/regression-case-files/pydantic-ai-release-replay/)另报告 TestModel 在 1.91 通过、1.92 失败、1.106 通过；这是已知故障的事后复演，未重跑，不背书检测产品。**[一手：维护者解释；社区：第三方复演]**

<a id="s459"></a>

#### 累计到下一次需求：保存、重放、整轮取消不是同一个契约

> 核实：2026-10-14 UTC。本节接续同一取消／历史链。三项新增要求是**保存中断产物、重新使用这些产物、从外部停止整轮并取回状态**；需求次数不按评审／修 bug 计。**[研究：比较范围]**

| 阶段与真实要求 | 固定产物、责任与操作变化 | 保留什么，什么有意改变 |
|---|---|---|
| 1. 取消返回前完成清理；正常返回仍交付完整结果 | 上文 `93a6104` 将事件流清理交给托管迭代器；`49f62a3` 把正常完成排空放到 handler driver，而非恢复共享节点旧循环 | 取消不继续消费与正常完成不丢结果同时成立；先分清退出策略，不统一所有路径 |
| 2. 前端已显示的中断输出也要保存 | [#3219](https://github.com/pydantic/pydantic-ai/issues/3219) → [#5364／`35fb827`](https://github.com/pydantic/pydantic-ai/commit/35fb8271688f438844e43cb0020d371a34cdc47a)。图节点在异常路径记录部分 response／tool returns，消息增加 interrupted 状态；工具返回非空才追加 request | 从“完成产物”增加到“可辨识的部分产物”；尚未承诺所有捕获历史都可再次发给模型 |
| 3. 将中断历史用于下一轮，而非仅供观察 | [#5836](https://github.com/pydantic/pydantic-ai/issues/5836) → [#6319／`8602986`](https://github.com/pydantic/pydantic-ai/commit/86029861bb86b210c29b3d3f3f3d5660fefd8c57)。共享历史清理层修复未配对工具调用、处理孤立结果，UI adapter 往返保存 outcome；测试包括不应自动修复的 deferred frontier | 尚待处理的工具与已经中断的工具必须区分；原始记录与发送给 provider 的整理分层，不把修复散到所有调用者 |
| 4. stop 按钮、线程或工具要停止整轮并拿回状态 | [#5835](https://github.com/pydantic/pydantic-ai/issues/5835) → [#6497／`a19b68a`](https://github.com/pydantic/pydantic-ai/commit/a19b68adeb2d18efd3719bb3c7f738a853d41984)。增加 run-scoped controller、token、外层取消分类与清理完成后的快照；复用 stream/tool teardown，响应级 cancel 保持原义 | 外部 `CancelledError` 继续传播以保留 timeout／TaskGroup 语义，本方取消以 `RunCancelled` 携带状态。新的控制范围要求掌握整轮状态的责任边界，不能只在流末尾补判断 |
| 5. 新契约的实际反例：首个工具尚未返回就取消 | [用户 #7977](https://github.com/pydantic/pydantic-ai/issues/7977) 在 2.37.0 给出确定性复现；[#7993／`1467456`](https://github.com/pydantic/pydantic-ai/commit/1467456556b9109b5b92eb7c7def8eabb5287775) 去掉旧 `if output_parts` 门槛，保留空 interrupted request | 阶段 2 的“空数据不保存”已不成立：消息还承担“这些工具不会再返回”的恢复信号。错误路径精确消息计数有意改变；修复沿已有 repair 边界完成，无须再次重构整轮控制 |

固定补丁／测试 **[一手]**，复现 **[社区：用户运行]**；本轮未运行。历史 repair 与 run controller 是不同责任，不能把作用全部归给 #6497。#7993 新增带／不带新 prompt 的恢复、错误退出恢复及多个 dangling calls 覆盖；作者称前三例旧版失败、新版通过，本轮未取得其逐例红绿原日志。

**晚期仍可窄修，而非越改越大。** run 级能力已有后，[#7743](https://github.com/pydantic/pydantic-ai/pull/7743)针对用户 #7722 的 adapter 不接收 token，把可选参数经三个入口转发到已有 run API，并补 native／编码流／dispatch 测试。属于既有承诺的补接线，非新需求或 UI 专用控制器。**[一手：补丁与需求；研究：选择解释]**

<a id="s475"></a>

#### 接收者接下来做了什么：删除补偿层，而非恢复旧测试期待

**[一手：历史 CI；社区：接收者隔离报告]** [akgentic-llm #155](https://github.com/b12consulting/akgentic-llm/issues/155) 的 jltournay 调查了下游 healing／恢复测试失效。独立复核取得同一 `db899ae0e2ba32d9da3cdbf3465025f8dbb4afe5` 的[9 月 2 日 job](https://github.com/b12consulting/akgentic-llm/actions/runs/33616228928/job/100202578437) 885 passed，以及[9 月 3 日 job](https://github.com/b12consulting/akgentic-llm/actions/runs/33759029604/job/100660445431) 9 failed、876 passed。代码相同，环境不同：slim／graph、anyio、ast-serialize、prices、genai 等依赖均变化，不能把这组 CI 当作只改变 Pydantic AI 的对照。作者另报告隔离依赖后将八项定位到 2.37→2.38、另一项定位到 anyio；该因果定位仍归作者报告。

**[一手：最终产物]** [#156／`94779e1`](https://github.com/b12consulting/akgentic-llm/commit/94779e16adc47e964e0976c5311a276953fa6ca7)落实了接管选择：

- 原 `HealingCapability` 在错误钩子看到末尾已是空 request 后不再执行，上游下一轮会补工具返回；下游删除该能力、挂载顺序依赖、公开导出及专属常量，保留预算恢复决策 `LimitRecoveryCapability`。只删重复责任，未测工时
- 最初不改依赖下限的决定被[修正](https://github.com/b12consulting/akgentic-llm/issues/155#issuecomment-5619072935)：2.38 前首个工具未返回的失败路径不会留下该恢复标记，删除会破坏原来可恢复的路径。最终要求从 `>=2.32,<3` 改为 `>=2.38,<3`，保留已有主版本上限
- 删除公开名字而不留无效 shim，外部旧导入会报 `ImportError`；同时接受模型侧失败说明由项目特定文案变成上游通用 interrupted 文案。PR 要求下一 release 说明导出变化，作者把措辞损失留给 ADR owner 记录，仍有兼容与交付缺口
- 同批 anyio 修复没有使所有 workaround 都删除：下游保留清理整个 per-loop entry 的 `_evict_anyio_run_vars`，改掉“没有本地补偿就必定泄漏”的负对照。上游只修其中 root-task 缓存，须逐项比责任，不能升级即删本地层

**后期验收比数删改文件更有意义。** [新测试](https://github.com/b12consulting/akgentic-llm/blob/94779e16adc47e964e0976c5311a276953fa6ca7/tests/test_failed_run_history_resumes.py)经真实 `ReactAgent` 图和离线 `FunctionModel`，检查工具崩溃、预算耗尽后的下一轮模型输入有对应 call ID 的 interrupted return；通用失败要求同一异常对象及 traceback。另把失败事件经 `ModelMessagesTypeAdapter` JSON 往返，在新 agent 上 `restore_context` 后继续，验证持久化状态不会丢失恢复含义。**[一手：测试定义]**

[head CI job](https://github.com/b12consulting/akgentic-llm/actions/runs/34483676695/job/102892459538)绑定 `27ba731a2b696e6f57b7b84a5f46889e0ce9e4ed`，运行使用 slim 2.42.0／anyio 4.15.1，原日志为 **866 passed、99.10%**，包括新文件四例；与作者另报的本地 865 pass／98.3% 分开记录。它仅为历史确定性框架集成测试，非本仓／真实模型／OS 重启：恢复例的新工具名是 `kaboom_again`，下一轮直接返回文本，未证明原工具可以重新执行。**[一手：历史 CI 原日志；研究：运行边界]**

另一维护者 gpiroux 于 9 月 21 日合并，PR 无人工 review 记录，不能据此补写其理解工时。仅证下游采用，非陌生人首次接管。**[一手：合并；研究：采用边界]**

**发行与恢复分开核对（2026-10-16 UTC）。** [v2.3.0](https://github.com/b12consulting/akgentic-llm/releases/tag/v2.3.0)已于9月21日发布并列出#156；[固定发行源码](https://github.com/b12consulting/akgentic-llm/blob/637cb7db9abd8b3e10f95fead05a7f0fee2bebdb/src/akgentic/llm/__init__.py)已删除上述公开导出，[依赖下限](https://github.com/b12consulting/akgentic-llm/blob/637cb7db9abd8b3e10f95fead05a7f0fee2bebdb/pyproject.toml)为`>=2.38,<3`。核实时最新llm发行[v2.4.0](https://github.com/b12consulting/akgentic-llm/releases/tag/v2.4.0)仍用[同一下限](https://github.com/b12consulting/akgentic-llm/blob/e6e3b14e65b4419eac206db3ec8b9e5af5b24ea9/pyproject.toml)。同组织的[framework v2.15.0](https://github.com/b12consulting/akgentic-framework/releases/tag/v2.15.0)和[v2.17.0](https://github.com/b12consulting/akgentic-framework/releases/tag/v2.17.0)分别纳入llm 2.3.0和2.4.0，支持已进入组合发行，不证明服务恢复。llm v2.3.0说明只列删除healing的PR，没有列出两个被删名字的旧导入迁移；[agent #148](https://github.com/b12consulting/akgentic-agent/issues/148)仍open且无评论。最低支持版本的完整验收、ADR-016落地、外部旧导入迁移与真实恢复仍未取得新回执。**[一手：发行页、固定源码与公开状态；研究：交付缺口]**

<a id="s494"></a>

#### 后续依赖升级：旧观察点过时，不等于消费者结果可以丢

> 核实：2026-10-15 UTC；2026-10-16 UTC补核发行范围。以下#167／#172均在最新llm发行v2.4.0之后：已核[提交比较](https://github.com/b12consulting/akgentic-llm/compare/v2.4.0...45b089aba1d56a1cc9a18e2d4d05fe7ff9c79274)，不属v2.3.0／v2.4.0交付；未运行上下游或取得服务恢复回执。**[一手／研究：范围]**

**先区分观察时点与交付结果。** [#167／`5f18045`](https://github.com/b12consulting/akgentic-llm/commit/5f18045a8c9f3138d083318493bb0e896663fa93)将依赖下限从2.38提高到2.54，并把 limit-recovery 验收拆开：错误钩子看到的持久历史以 dangling response 结束；run 展开收尾后，历史仍须紧跟 interrupted marker。补丁改变钩子时点的断言，保留后续 conclusion 返回 `concluded` 的断言。作者在 [#169](https://github.com/b12consulting/akgentic-llm/issues/169)说明恢复行为未变；这不是恢复成功的新现场证据。[当前固定master](https://github.com/b12consulting/akgentic-llm/blob/28adec6d370b09af790abbd3f46ed281398183c6/pyproject.toml)要求`>=2.54,<3`，已发行的v2.3.0／v2.4.0仍声明`>=2.38,<3`；先核实际采用的版本，不把master下限套到旧发行，也不把发行声明当最低版本完整验收。**[一手：固定依赖、补丁与测试；社区：作者诊断]**

**另一次红测试则仍代表必须修的消费者结果。** 上游 [#9627／`107cac9`](https://github.com/pydantic/pydantic-ai/commit/107cac9ec0bdd05bd25085b202189c3787edb024)让动态 system prompt 重评时替换 run 内的消息副本，不再改调用者持有的历史对象；新增测试同时要求本轮得到新文本、旧历史不变，以及并发轮次互不污染。下游 [#171](https://github.com/b12consulting/akgentic-llm/issues/171)报告2.56使第二轮变更不再产生 `LlmSystemPromptEvent`：记录器仍读旧对象，算出的 hash 不变。observer 契约仍需两个事件，不能改为一个。**[一手：上游补丁与测试定义；社区：下游故障报告]**

下游 [#172／`45b089a`](https://github.com/b12consulting/akgentic-llm/commit/45b089aba1d56a1cc9a18e2d4d05fe7ff9c79274)把本轮 live history 显式传给 `record_system_prompt`，保留原有去重逻辑和[两轮事件断言](https://github.com/b12consulting/akgentic-llm/blob/45b089aba1d56a1cc9a18e2d4d05fe7ff9c79274/tests/test_capabilities.py#L363-L384)，没有恢复上游原地修改，也没有重建已删除的 healing 层。[固定 README](https://github.com/b12consulting/akgentic-llm/blob/1f5b7c7e514c853e09d5feadcad07a77000efa7a/README.md#system-prompt-rendering-events)说明该事件供 traces／frontend 显示每轮实际提示词；仅为消费者契约，未证前端恢复显示。可选 `messages` 参数保留旧调用形式，但默认读取旧 context 不能保证后续轮次内容新鲜；接入者仍要传对本轮数据。**[一手：实现、测试定义与公开契约]**

**采用边界。** 上游承担的是调用者历史不被改写，下游仍负责发布每轮有效内容；两者都应保留。依赖升级后，先追到消费者实际需要的值和时点，再决定更新内部断言还是修接线。作者称补丁兼容2.54和2.56，本轮未取得双版本完整原日志；未发行且缺旧导入迁移／服务恢复回执，不作交付闭环或工时收益。**[社区：兼容自述；研究：选择与限制]**

<a id="s506"></a>

#### 累计采用判断：下一需求改变了谁必须知道什么

生命周期需求先定触发、退出与保留结果，再分辨旧测试应保留还是更新。**[研究：本链采用条件]**

✅ **局部补丁**：责任不变时沿既有 API／repair 层补接并验原调用者；#7743、#7993 表明后期也能小修。**[研究]**

✅ **窄扩展点或责任重构**：先保留可用抽象；策略随控制范围、完成时点或退出分类，放到掌握区别的层，并验相邻路径／公开接口。#5771 driver 与 #6497 controller 各有范围，共用 finally 排空或统一异常不能表达两者；窄改仍无法表达才扩大。**[研究]**

✅ **删除过期扩展并交接**：上游已承担同一结果时，核最低版本和持久恢复，再删补偿；交代导出、文案、预算策略和跨仓说明。别为旧内部断言恢复重复责任，仍有独立责任的 workaround 保留。**[研究]**

尚缺最低支持版本完整验收、发行后导入迁移与真实恢复，不能据本链量化模型／架构维护收益。

<a id="s518"></a>

### 上游接管后的退出条件：aiohttp 误判修复版本

核实：2026-10-18（UTC+8）；主线三，改变 18 的旧实现退出选择。**上游已接管同一责任，本地却过早关闭补偿时，先修退出判定、保留受影响环境的补偿，不默认重建整层。** 以下为历史维护机制，非 AI 生成故障或服务恢复证明。**[研究／经验]**

**接管成立，发行门槛仍可能错。** [CPython #118960](https://github.com/python/cpython/pull/118960)让 SSL 外层 transport 的 `is_closing()` 反映内部关闭状态，使 `drain()` 能让出执行、传播 `connection_lost`；[固定补丁](https://github.com/python/cpython/commit/3f24bde0b6689b8f05872a8118a97908b5a94659)新增忙写遇 `BrokenPipeError` 后第二次写入须抛 `ConnectionResetError` 的测试。[3.12 回移](https://github.com/python/cpython/pull/125932)于 2024-10-26 合入；[3.12.7 源码](https://github.com/python/cpython/blob/v3.12.7/Lib/asyncio/sslproto.py)仍只返回 `self._closed`，[3.12.8 固定源码](https://github.com/python/cpython/blob/2dc476bcb9142cd25d7e1d52392b73a3dcdf1756/Lib/asyncio/sslproto.py)才含内部状态判定。**[一手：补丁、测试定义与发行源码]**

[aiohttp #9726 的固定补丁](https://github.com/aio-libs/aiohttp/commit/c3a9c3e67b6ad39e28095fd478e86053b34a7e45)据此退出 SSL 清理补偿，却把门槛写成 3.12.7：在被判为已修的环境，不仅发警告，还将用户传入的 `enable_cleanup_closed=True` 改为 False。[noop 测试](https://github.com/aio-libs/aiohttp/blob/c3a9c3e67b6ad39e28095fd478e86053b34a7e45/tests/test_connector.py#L1924-L1931)直接 mock `NEEDS_CLEANUP_CLOSED=False`，[旧清理 fixture](https://github.com/aio-libs/aiohttp/blob/c3a9c3e67b6ad39e28095fd478e86053b34a7e45/tests/conftest.py#L244-L252)则强制 True；它们验分支，不验真实版本归类，不能据此证明退出门槛正确。**[一手：固定实现与测试；研究：覆盖边界]**

[2026-01 的纠正 #11972](https://github.com/aio-libs/aiohttp/commit/4a51c4ba30b886b5d1505e4aed790df0cc7cd8d2)把 3.12 门槛改为 3.12.8；[v3.13.4 发行](https://github.com/aio-libs/aiohttp/releases/tag/v3.13.4)已列该修复，[固定发行实现](https://github.com/aio-libs/aiohttp/blob/9f7c7ab6f2924824e4a61a3b5c5c36475f4e25c6/aiohttp/connector.py#L91-L99)可核。发行说明只称纠正误报警告，源码同时改变是否启用补偿；这是历史交付证据，不是当前版本推荐。**[一手；研究：范围]**

**本轮纯离线核对。** 从上述旧／新实现摘出表达式 `(3,13,0) <= v < (3,13,1) or v < floor`，旧 `floor=(3,12,7)`、新 `floor=(3,12,8)`，用 Python 逐个代入版本元组，True 表示需要补偿：

| Python 版本 | 旧判定 | 新判定 |
|---|---|---|
| 3.12.6 | True | True |
| 3.12.7 | False | True |
| 3.12.8 | False | False |
| 3.13.0 | True | True |
| 3.13.1 | False | False |
| 3.14.0 | False | False |

仅验证表达式在六个输入的结果；未运行 aiohttp、上游测试、网络连接或模型，未取得真实服务恢复回执。原 akgentic 链的最低支持版本完整验收、旧导入迁移与真实恢复缺口仍在；本例只补“同责任已接管，但本地误判退出范围”的修法，不替代最低版本行为验收。**[经验：局部复核；研究：限制]**

<a id="s541"></a>

### CodeThread：下一次修改失败，先查继承了什么行为

> 核实：2026-10-14 UTC。主线三，关联四；改变 20 §4 的续改诊断：检查新功能依赖的旧函数行为，不只审最新 diff 或先降低复杂度。✅ 采用此诊断顺序；不新增指标门禁、Hook 或模型评判器。**[研究：采用判断]**

**新证据与选择条件。** [CodeThread v2](https://arxiv.org/html/2606.21804v2)发表于 2026-09-29（v1 为 6-19）。四模型在同一后续问题上继承历史人工实现或 Agent 重建实现；第一步须通过 P2P、仍失败于全部 F2P，每条件单次运行。四模型共有交集的 16 组比较中有四组持平或反向；该交集内最大下降 13.1 个百分点不是普遍损失，也不是各模型完整样本的最大值（附录 B 的 GLM／Multilingual 为下降 13.8 个百分点）。405 个结果不同且特征完整的样本中，输入／错误契约偏移的 OR 为 1.83（95% CI 1.15–2.92），本回归中圈复杂度／认知复杂度未显示显著关联。**[研究：论文 §3–5；非本仓运行]**

**反证。** v2 增加第二个 judge 与 50 例非盲人工核查，但没有“只移除偏移”的干预；262 个选定人工基线胜出的样本中，judge 仅将 54 例关联到保留的偏移。研究没有人类接管试验或第五次修改，不能证明普遍维护成本、更不能证明降低复杂度无用。**[研究：论文附录 D；解释边界]**

**构造源码限定了能说什么。** 固定仓库 [`158f6ab`](https://github.com/shaswatpatel123/CodeThread/tree/158f6abaadcf717f3175a8f402be7da4e8d48c76)的 [`data_gen_problems.py`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/dataset/scripts/data_gen_problems.py)把原函数交给模型，生成重建所需的说明，其中明确要求返回结构、异常、边界与操作步骤；人工分支保留原实现，未由人按同一说明重写。[公开数据卡](https://huggingface.co/datasets/shaswat123/CodeThread)列的是 1,377 个 stub／任务输入，不是 1,377 个成功配对运行。因此这是“重建保真度＋后续解题”的比较，P2P 通过不能证明未测输入上的行为等价；不可把全部后续差异归因于代码组织或接管难度。**[一手：固定源码、数据卡；研究：因果边界]**

本轮还只读 [`synthetic_chains.py`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/scripts/utils/synthetic_chains.py)的 P2P／F2P 分类与 [`run_swebench.sh`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/scripts/run_swebench.sh)的两阶段连接。只读未运行；固定仓库／数据卡未提供所需逐例配对产物、judge 标签及测试原日志，无法重算或复现。**[一手：检查范围]**

**采用条件。** 沿新功能调用链核继承实现的输入拒绝、缺值及错误契约，不能只看 diff。把查明的偏移写入最小回归；新需求有意改变旧行为时同步契约与调用者，不机械恢复历史代码。**[经验：未测净收益]**

与 Pydantic 的有意契约改变互补，本例提示继承行为可能已偏移。下一证据须同任务／预算仅修偏移后重测，或真实接管投入；复杂度榜单不能回答。

<a id="s579"></a>

### n8n：配置回退与独立导出入口

**核实：2026-10-14 UTC；主线三，兼四；改变 15 §5。** ✅ 回退设计应停止新格式写入，同时保留读取已落盘数据所需的依赖；用混合代次数据分别验服务和实际维护入口。相对 Git MIDX 的降级，本例补配置撤回及导出入口。**[研究：采用判断]**

**两步修订解决不同缺口。** [#37416](https://github.com/n8n-io/n8n/pull/37416)／[430bbe53](https://github.com/n8n-io/n8n/commit/430bbe53c3f784c20679c3a93b8da1feb52cab7e)先让模块和 provider 不再随轮换开关一起停用，但 cipher 自身仍检查开关。[#37603](https://github.com/n8n-io/n8n/pull/37603)／[9b10838d](https://github.com/n8n-io/n8n/commit/9b10838d9e1015d2198f3f48b9a6bc042239884a)才在 `packages/core/src/encryption/cipher.ts` 删除 `decryptV2` 的开关条件，按密文前缀查 key；`key-manager.service.ts` 的 `getActiveKey` 仍在关闭时返回旧格式 descriptor。读取已有新格式和继续写新格式因此分开。**[一手：固定补丁]**

#37603 作者报告在分支 `2f51d9d615` 经真实 REST API 与 SQLite 检查 on→off→on：开启时写入的数据在关闭后仍可读，关闭后的新写入恢复旧格式，混合数据可读且读取不改写存储值。但同一报告明确指出一次性导出命令不运行 module init，provider 未注册，仍无法读带 keyId 的数据，并误报密钥不同。原始可重跑 spec 未随报告公开，不能把服务端成功当作导出恢复成功。**[社区：作者运行与故障报告]**

随后 [#37972](https://github.com/n8n-io/n8n/pull/37972)／[93945cce](https://github.com/n8n-io/n8n/commit/93945cce5d97347d3dc3e1ac6249cd104ce5d708)在 `BaseCommand.init()` 数据库准备后调用 bootstrap，使服务、worker、webhook 和一次性命令较早获得 provider；原模块只保留管理 API 与前端设置。cipher 同时删除 provider 未注册时的隐式回退，改为明确失败。[afitzek 审批前一 PR](https://github.com/n8n-io/n8n/pull/37603#pullrequestreview-5100537985)后实际提交这次修复，再由 [sychovSaveliy 审批](https://github.com/n8n-io/n8n/pull/37972#pullrequestreview-5134188188)，为实际接管修改。两个固定提交均有 Claude 共同署名；只证署名参与，非代码归属／工时。**[一手：补丁、PR 元数据与审查]**

**测试实际覆盖什么。** #37603 的 core 单测覆盖两种格式、未知 key ID 和不合格旧格式 descriptor；[固定 integration 测试](https://github.com/n8n-io/n8n/blob/93945cce5d97347d3dc3e1ac6249cd104ce5d708/packages/cli/src/encryption/__tests__/encryption-bootstrap.service.integration.test.ts)分别检查开启／关闭时的真实 key store 与 cipher 往返，未在同一用例内做完整 on→off→on。后续 [bootstrap 单测](https://github.com/n8n-io/n8n/blob/93945cce5d97347d3dc3e1ac6249cd104ce5d708/packages/cli/src/encryption/__tests__/encryption-bootstrap.service.test.ts)验证禁止 seed 或非 main 时不创建部署级 key、仍注册读取 provider；`commands/__tests__/execute.test.ts` 把 bootstrap mock 为 no-op，不能算实际导出测试。**[一手：测试定义，未执行]**

**回退边界。** 轮换 active key、关闭新格式写入、降级旧程序是三件事：前者仍需保留旧 key 以读旧密文；关闭写入不批量还原已经落盘的数据；同版本回退成功也不保证旧程序兼容。[官方当前说明](https://github.com/n8n-io/n8n-docs/blob/main/docs/deploy/host-n8n/configure-n8n/security/rotate-encryption-keys.md)把安全停用发布边界列为 2.40.3，并保留降级和缺少自动逆向转换的警告。不可将该节点写成首次解除读取门控：[#38910 固定补丁](https://github.com/n8n-io/n8n/commit/a8e0e7c3844510321894bf661cc0610baeae8fc3)实际补的是第三种 legacy DEK 存储形态，而读取门控已在 #37603 解耦。**[一手；研究：边界比较]**

**验证与采用范围。** 只读补丁、测试、作者报告与接管链，未运行 n8n／数据库／上游测试；缺最终 CLI 成功重试的独立回执及人工投入。仅对新持久格式或独立维护入口采用，复用已有覆盖。**[研究]**

<a id="s595"></a>

### Grafana：回退的恢复时间点与保护性拒绝

**核实：2026-10-14 UTC；主线三／四；改变 15 §5。** ✅ 对已迁移持久数据的回退，除旧程序能否读取，还要查恢复时间点和升级期间新增／修改的处理方式；在隔离数据上验证恢复方案，由负责人明确接受损失后才有条件使用强制回退。不能仅为恢复启动删保护或清表。本例补业务恢复目标。**[研究：采用判断]**

**原失败不等于检测到了新增数据。** [Grafana #50421](https://github.com/grafana/grafana/issues/50421)原报告者从 8.5.5 升到 9.0.0-beta3，因 polystat 面板插件不兼容降回 8.5.5，随后启动 panic；他明确说没有新建警报。[维护者说明](https://github.com/grafana/grafana/issues/50421#issuecomment-1152151626)将阻断解释为避免用户不知情地删除新警报系统数据。[PR #50470](https://github.com/grafana/grafana/pull/50470)已合并，固定修订 [30f035ca](https://github.com/grafana/grafana/commit/30f035ca347d9f6ba02bc48c0e1f183c885227c5)只澄清 panic 信息，没有实现无损反向迁移，也没有移除保护。**[社区：原报告与维护者解释；一手：固定补丁]**

**历史发布版的删除契约。** v9.0.0 对应固定 SHA [`b5c56f63`](https://github.com/grafana/grafana/commit/b5c56f63710e09f37b8557ddd8b99ae3fc583169)。其 [ualert.go L52–96](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/ualert.go#L52-L96)按迁移日志和启用状态选择回退，缺少 `ForceMigration` 时阻止；开启后安排删除迁移，并清掉原迁移标记，供将来再迁移。因此阻断不证明实际存在升级后的新增警报；新旧警报都关闭时还有直接返回的分支。[删除实现 L517–570](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/ualert.go#L517-L570)涉及新警报规则、规则版本、配置、实例及 silence 文件，不是单纯换回旧二进制。[同版回退文档](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/docs/sources/alerting/migrating-alerts/roll-back.md)明确恢复的是升级时的警报状态，新系统中新增警报及修改会被删除。**[一手：固定发布源码与文档]**

**启动恢复与业务恢复是两个结果。** [另一用户的后续报告](https://github.com/grafana/grafana/issues/50421#issuecomment-1150915431)称按讨论中的清表办法恢复启动，但已没有警报。这不是无损恢复，也不是推荐手工删表；须约定损失并验业务，不能只验启动／关闭 issue。该回执不是原报告者的修订版复测。**[社区：用户运行报告；研究：采用边界]**

**测试名不是有效断言的证明。** [同版 migration_test.go L24–115](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/migration_test.go#L24-L115)包含名为“force migration is disabled…should panic”的表项，但未设置 `shouldPanic: true`；defer 吞掉 panic，只在该字段为真且没有 panic 时报告失败。对应表项又将删除迁移列为 expected，故不能把用例名称当作“移除拒绝也会被检出”的证据。本轮仅作静态核对，未做变异或上游执行。**[一手：测试定义；研究：断言范围]**

**反证、归属与验证范围。** 不推断所有降级都会丢数据，不将这项历史错误解释修订说成当前 Grafana 的操作指南；支持的是针对具体迁移契约选择恢复目标。GitHub compare 显示 PR merge SHA 与 v9.0.0 为 diverged（ahead_by=261、behind_by=367），不可宣称该 merge commit 为发布版祖先；发布版包含澄清信息是直接读上述固定源码确认的。未取得本例的 AI 参与证据，未安装或运行 Grafana、模型及上游测试，未核验 CI，也没有原报告者的最终无损回退回执或维护收益测量。**[一手：提交关系与源码；研究：边界]**

<a id="s609"></a>

### 能推翻或改变这个优先级的证据

知识、环境和反馈充分却受复杂推理限制时，提高模型／effort 对照优先级；接口维护贵于人工复现或仅一次性使用时，撤回专门改造。更强模型已解决旧失败则删多余流程；内部状态绕过真实故障则降低其验收权重。

案例分别记录知识、访问、反馈、顺序和模型变化；多项同改只能评完整方案。缺耗时、返工与后续记录时不报收益百分比。

<a id="s678"></a>

## 重复代码迁移：语法规则、类型分析与第二次执行

**主线二／三；改变 15 §4–5。** 核实时间：2026-10-15（UTC+8）。✅ 同一规则覆盖多处、已有适用迁移器时，先复用；少量异质调用或业务语义需逐项决定时，直接让 Agent 补丁并验证。前者的收益是复用明确的匹配与变换规则，不能由此推出当前强 Agent 的净收益。以下来自三个不同项目的历史迁移、维护回复与固定源码，没有安装或运行它们。**[研究：采用判断；一手／社区：下述证据]**

<a id="s682"></a>

### 语法匹配能省重复劳动，但不等于完成迁移

- **正面使用与遗漏同时存在。** TanStack Query [#6204](https://github.com/TanStack/query/issues/6204) 的 gillkyle 报告，v5.0.0 codemod 成功处理多处 `invalidateQueries`／`refetchQueries`，且[明确说节省了时间](https://github.com/TanStack/query/issues/6204#issuecomment-1772989068)；但其最小复现输出 `0 errors / 1 unmodified / 0 ok`，仍留下自定义 hook 的两种旧调用。约 30 分钟是作者整次升级自报，不是 codemod 对照耗时。**[社区：真实迁移单例]**
- **第二次核验没有把“已修”视为全部通过。** slax57 在 [5.13.4 复测](https://github.com/TanStack/query/issues/6204#issuecomment-1857715221)中确认 `useQuery` 已处理，指出 `useMutation` 仍遗漏；维护者要求另建 [#6548](https://github.com/TanStack/query/issues/6548)，报告版本为 5.14.0。随后该报告者提交 [#7187](https://github.com/TanStack/query/pull/7187)，维护者批准，2024-04-02 合入 [`798124d`](https://github.com/TanStack/query/commit/798124da1c3e21c8e95b037466905489e19cd029)。补丁将 `useMutation` 纳入匹配并增加带／不带 options 的输入输出夹具。这里只确认固定补丁与维护接收，不把旧版本遗漏当当前缺陷。**[社区：他人复测；一手：修订／夹具]**
- **解析 TS 语法不是建立完整类型程序。** 本轮固定 [`a8af0e2`](https://github.com/TanStack/query/tree/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads)：[utils](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/utils/index.cjs)沿 AST scope 找变量声明并看是否为数组表达式；[default-import 输出夹具](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/__testfixtures__/default-import.output.tsx)明确保留从另一模块导入的 query key 调用。[测试入口](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/__tests__/remove-overloads.test.cjs)用 `tsx` parser 比较两个输入输出 fixture，不能据此声称跨文件类型推断、全量语义或二次运行已验证。**[一手：源码／测试，只读]**

先核调用覆盖、未改项和警告；成功退出、能解析 `.tsx` 或 issue 关闭均不等于完成。混合调用须分别验该改、保留及待定项。**[经验]**

<a id="s690"></a>

### 类型与框架分析值得增加的具体条件

Angular signal input 的迁移不只是给名字加 `()`，还会改模板、host binding 与 TS 引用。[官方说明](https://angular.dev/reference/migrations/signal-inputs)默认跳过不安全的 input；`--best-effort-mode` 可造成构建破坏，`--analysis-dir` 会静默漏过目录外引用，而 `--path` 限定修改范围不等于限定分析范围。**[一手：文档，2026-10-15 核实]**

固定 [`731ad651`](https://github.com/angular/angular/tree/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration)的 [incompatibility 枚举](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration/src/passes/problematic_patterns/incompatibility.ts)区分继承冲突、写入、accessor、模板 narrowing 等；[golden 输出](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration/test/golden.txt)既有提取局部变量后保持 narrowing 的变换，也有写入或不支持模式的跳过及原因。能在语法之外核对这些约束，是复用框架迁移器的具体理由；保守跳过也是有效结果，不应为提高改动文件数直接强制转换。**[一手：固定源码／期望夹具，未执行]**

**选择边界。** 来源／形状统一且规则覆盖时用语法迁移器；依赖跨文件、继承或 narrowing 时选能解析本项目的类型／框架工具。少量例外交 Agent；例外占多数则退回直接补丁。无通用文件数阈值或同任务 Agent 对照。**[研究／经验]**

<a id="s698"></a>

### 批量入口：先选改法，再选执行方式

2026-10-15 UTC回读：[Claude官方fan-out配方](https://code.claude.com/docs/en/best-practices#fan-out-across-files)仍建议前2–3个文件调提示，再全量执行；[commands的/batch条目](https://code.claude.com/docs/en/commands)仍描述5–30个独立单元、计划批准后各在worktree执行。数字本身没有过时，但不是迁移覆盖或操作授权的通用门槛。[Angular当前文档](https://angular.dev/reference/migrations/signal-inputs#configuration-options)则明确：`--path`限修改范围，默认仍分析全workspace；缩小`--analysis-dir`会静默遗漏外部引用。只按文件分片可能破坏现成分析的前提。**[一手：当前官方契约，只读]**

[Anthropic迁移复盘](https://claude.com/resources/articles/ai-code-migration)（2026-07-16）的依赖图与Step 2还区分保结构移植和重设计：三文件逐行比较适用前者，后者改为设计审阅与可丢弃的端到端试跑。这是厂商经验，不证明所有迁移都需相同评审层或扔掉首产。结合本节TanStack再使用反馈及Angular固定机制，15总表／§5与Claude入口统一为“先选改法、按差异试点、再按依赖和风险扩量”，不再把少量文件通过或有测试等同于全量迁移可高自主执行。工具功能表保留真实5–30描述；没有新增模型实验或净收益测量。**[一手：作者复盘；经验：入口收敛]**

<a id="s704"></a>

### 重复执行与第二次需求不是同一项保证

**同一次批处理也可能重复修改同一文件。** Angular 用户 Wandang 的 [#61611](https://github.com/angular/angular/issues/61611)（Angular 19.2.12）报告模板出现 `title()()` 与重复 TODO。维护者[指向已修复的 #61421](https://github.com/angular/angular/issues/61611#issuecomment-2901248608)，其根因是多个 tsconfig 的源文件重叠。固定 [run_in_devkit.ts](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/utils/tsurge/helpers/angular_devkit/run_in_devkit.ts)用文件到编译单元的归属表，避免同一源文件在不同单元重复分析／生成替换；这不是证明所有变换均幂等。维护者通过 [#61612](https://github.com/angular/angular/pull/61612)回移到 19.2.x（落地提交 [`2ae69f7`](https://github.com/angular/angular/commit/2ae69f77e7ef9a6431303cfad54cabb068435d6f)）；本轮只读核对 19.2.13 与 20.0.0 标签的同路径均已包含归属去重，未独立运行或取得该用户修复版复测。**[社区：故障报告；一手：维护回复与源码]**

**调用方的次数也需核对。** Renovate [#8220](https://github.com/renovatebot/renovate/issues/8220) 的 marcodejongh 报告：依赖升级从一次调用变为逐依赖调用后，同仓五处依赖使 codemod 执行五次，部分非幂等变换破坏代码。后续 [#8725](https://github.com/renovatebot/renovate/pull/8725)增加 `executionMode: branch`，历史固定 [`6afbcf8`](https://github.com/renovatebot/renovate/commit/6afbcf8d18afd3e63e0d4d253be64c5a21e736c5)的 [index.spec.ts](https://github.com/renovatebot/renovate/blob/6afbcf8d18afd3e63e0d4d253be64c5a21e736c5/lib/workers/branch/index.spec.ts)在两项升级配置下断言命令只调用一次；作者勾选单元测试及真实仓库验证，发布回复标为 24.109.0。该测试约束调度次数，不检验具体 codemod 输出；`branch` 也不承诺后续重新生成分支时永不再执行。**[社区：使用与作者验证报告；一手：补丁／断言，只读]**

**验收与停止。** 试点含旧／已迁移形状、跨文件及业务例外，核跳过原因并验类型／行为。重试先在首轮产物上重跑；一次性工具则从可恢复起点重做。分片须文件归属不重叠；额外变换、覆盖不明或例外增多即暂停扩量。**[经验：未运行迁移实验]**

幂等不等于行为正确或适应新需求；映射／契约改变后，更新规则、回归与版本，从上次交付状态验新旧行为。只读夹具不证明模型或维护收益。**[研究]**


<a id="s930"></a>

## OCRmyPDF：兼容修复按输入机制分流

核实：2026-10-15 UTC；主线四，兼三；改变 15 §2。**兼容性未必随版本改善：修一种映射仍可能损坏另一输入。按输入机制选择修生产端、换消费者或条件绕过，保留仍有用途的能力。** 一次通过不保证全数据集；最终消费者、备份和恢复沿用既有规则。**[经验：采用判断]**

**乱码未导致整体回退渲染器。** 2026-09-15，olafure 在[OCRmyPDF #1747](https://github.com/ocrmypdf/OCRmyPDF/issues/1747)报告外观正常、复制乱码，提出回退默认 fpdf2 renderer；[fpdf2 #1952](https://github.com/py-pdf/fpdf2/issues/1952)记 fpdf2 2.8.8、Ghostscript 10.02.1、Linux/Python 3.13，个人书库 57 本书刊受影响。分析由 Claude 协助，用户只明确确认两份脚本复现，不是全部分析、影响比例或恢复判断的独立核实。150 个输入字符生成 117 条映射，101 个只有 96 条，因此触发条件是**单块映射超过 100 条**，非文档超过 100 字符。**[社区：原报告与复现确认]**

[维护者回执](https://github.com/ocrmypdf/OCRmyPDF/issues/1747#issuecomment-5691459605)以同文件比较 Ghostscript：9.55 保留映射，10.02.1 丢弃，10.05 保留但警告，10.06 保留，因此选择生产端拆块而非回退 renderer。[7e3007746fe646f561f1fe0eb3a501f6c6136747](https://github.com/ocrmypdf/OCRmyPDF/commit/7e3007746fe646f561f1fe0eb3a501f6c6136747)将 fpdf2 写出的 CMap 按最多 100 条分块，覆盖 bfchar、bfrange、cidchar、cidrange；它包装私有输出注册方法，`FPDF2_CMAP_BLOCKS_FIXED=None` 表示尚未设补偿退出版本，不能宣称维护成本已消失。**[社区：维护者运行报告；一手：固定补丁]**

随后合入[fpdf2 #1954](https://github.com/py-pdf/fpdf2/pull/1954)（`2082d9c01d17decfab10ddd741de836283eab397`），处理两条 ToUnicode 路径；[后续 #1956](https://github.com/py-pdf/fpdf2/pull/1956)（`82981ecd2769ffb3f0f57ac44dd996f2ac138da4`）扩至 Encoding 的 cidchar。仅核合入代码，未核首次正式发布或下游补偿撤除，不能泛称升级 fpdf2 已修复。**[一手：跨项目修订]**

**另一输入的反证。** kmn5 在[#1744](https://github.com/ocrmypdf/OCRmyPDF/issues/1744)报告 OCRmyPDF 17.11.0／Ghostscript 10.6.0 的 PDF/A 丢失 fi／ff 等连字文字，普通 PDF 和 sidecar 正确；PDF/A-2b 合规不保证文本可搜索。[ffee83231532f4f67b8c0e756cddec67446570c9](https://github.com/ocrmypdf/OCRmyPDF/commit/ffee83231532f4f67b8c0e756cddec67446570c9)诊断 10.05–10.06 会丢多字符 ToUnicode 映射：不可见拉丁等无需上下文整形的文字改逐字符编码、去掉可选连字；复杂文字保留必要整形并对受影响 Ghostscript 警告，可见调试文字仍整形。**超长块安全不代表连字安全，绕过须按用途收窄。** 未独立核 Ghostscript 上游完整修复链，不另推荐当前版本。**[社区：独立用户故障；一手：固定实现；研究：机制比较]**

**运行与恢复边界。** #1747 定义 Ghostscript 往返测试，缺依赖即跳过；抽取断言还需 pdftotext，仅查大写字母样例，不覆盖连字、全部文字或 57 本书库。#1744 另有逐字符映射与抽取测试，均非本轮执行或全部 CI 核验。维护者建议用修订后的 OCRmyPDF 重做原扫描件，但未见原用户全库恢复回执，关闭 issue 不能替代恢复。只读讨论、源码和测试，未安装或运行 OCR、PDF 工具、模型；Claude 协助诊断不证明故障代码由 AI 生成或有净收益。**[一手：测试范围；社区：恢复建议；研究：限制]**

**采用与撤回。** 按触发输入保留必要能力，优先窄格式修复／条件绕过；全部支持输入都无需该能力才考虑删除。复用消费者验收；分流破坏语义时撤回、缩范围或换已验证消费者，不推广到任意格式。**[经验]**


<a id="s947"></a>

## 退役实现选择器：保留独立禁用能力

核实：2026-10-18（UTC+8）；改变15 §5。已有配置迁移的阶段／设备边界、上游接管的版本退出条件，不能代替此处的行为分类。以下只读固定补丁与公开回执，未运行上游、浏览器或模型。**[研究：范围]**

**早稿删两种开关，最终只退役选择器。** Jetpack [#51395最终补丁`d46d387`](https://github.com/Automattic/jetpack/commit/d46d387ba5f095852bb1c8cf2da80fda5b047e95)于2026-09-09合入：删除`jetpack_forms_alpha`六处读取，却保留`jetpack_forms_dashboard_enable`原过滤调用及默认true。后者控制是否调用`Dashboard::init()`，不是切换新旧UI，也不关闭全部Forms功能；新增测试同时断言默认接线和false不接线。[作者回执](https://github.com/Automattic/jetpack/pull/51395#issuecomment-5360285177)报告通过及变异检查，不是本轮复测。合并消息包含被撤回的“两个都删”方案，事实以最终diff为准。**[一手：固定实现／测试；社区：报告]**

**兼容不能只保函数名。** 旧alpha回调不再执行，false不能选回旧实现，因此用通知而非继续应用返回值。通知最终在`admin_notices`发出；[局部对照回执](https://github.com/Automattic/jetpack/pull/51395#issuecomment-5357904764)确认提前输出曾破坏重定向、污染ajax响应，修订后恢复。这不证明所有扩展兼容。旧slug也仍有Creative Mail与My Jetpack等当前消费者；后续[#52296固定删除](https://github.com/Automattic/jetpack/commit/80123dc707743cd8162f1bd9f4db12e6b61c4bb1)保留向前重定向，而非随旧树删除。**[一手：补丁；社区：局部运行报告]**

**联动配置先解除，部署另验。** [#51397固定补丁`d0c3311`](https://github.com/Automattic/jetpack/commit/d0c33114f5ee2bea6aa028dc9714d5630fb81761)先撤同一sticker对仪表盘选择器和编辑器标志的两条接线；只撤前者，会让新Forms页面列出尚未注册的`jetpack_form`类型。两包随Jetpack及wpcomsh／mu-wpcom-plugin不同路径交付，先合入不保证先到全部环境。[公开计划](https://github.com/Automattic/jetpack/issues/50712)明确当时仅合入、未核部署；2026-08-24零sticker是历史枚举自报，不是当前全站状态。本轮确认两项合入及后续删树，未取得全环境到达顺序回执。**[一手／社区；研究：边界]**

**选择与撤回。** 只需禁用入口时保独立总开关；仍有旧URL消费者就保窄适配。受支持扩展仍需旧行为，或前置配置修订未到达且混装会破坏功能时，先迁移消费者、补混装兼容或推迟删除，不用保留符号／发通知冒充行为兼容。此例支持机制选择，不证明AI维护收益或所有旧链接参数无损。**[经验／研究]**

<a id="s959"></a>

## 配置迁移：保留作用阶段与设备边界

核验：2026-10-15（UTC）。配置归属之外，还须区分生效阶段与设备。先复用分层、优先级和选择性同步；共同交付保持一致，编辑期合法差异与机器衍生值分别处理。不为统一配置另建框架，调查也不授权改变用户安全或同步设置。**[经验：采用判断]**

<a id="s963"></a>

### Ruff：个人覆盖可合并，但文件替代仍可能失去同步

[讨论15991](https://github.com/astral-sh/ruff/discussions/15991)中，stinodego 希望个人编辑规则不强加同事；维护者建议独立配置合并项目，2025-02-25 用户初试符合需要。jtchen2k 报告外部文件生效却失去跨设备同步；ilCatania 要求团队共用但仅编辑期生效，以保留探索代码、提交时清理。三者分别支持范围、同步和阶段需求，非同一用户的无损迁移闭环。**[社区：使用与初试；一手：维护者建议]**

[PR16296](https://github.com/astral-sh/ruff/pull/16296)于 2025-02-26 合并，固定 be03cb04c13cbd74467acdb4a1501b620db16975 新增内联配置并保留路径形式；[配置合并实现与测试](https://github.com/astral-sh/ruff/blob/be03cb04c13cbd74467acdb4a1501b620db16975/crates/ruff_server/src/session/index/ruff_settings.rs)处理两种输入，测试特定编辑器设置相对内联配置的优先级。VS Code 需配套[#702](https://github.com/astral-sh/ruff-vscode/pull/702)，不保证旧客户端支持。**[一手：固定源码与测试定义，未运行]**

[当前官方设置文档](https://docs.astral.sh/ruff/editors/settings/)保留两入口，内联自 0.9.8 引入；未设编辑器配置时读项目配置，冲突可选编辑器优先、文件优先或仅编辑器。原生能力可承载个人体验，无需改变共享规则或自建同步。未获 jtchen2k 对最终内联版的跨设备回访，前一用户初试不能证明这项收益。**[一手：文档；研究：边界]**

<a id="s971"></a>

### Firefox：依赖本机OS的偏好，收窄到单项停止同步

[Bug1851024](https://bugzilla.mozilla.org/show_bug.cgi?id=1851024)涉及`general.smoothScroll`：默认随各机器OS减少动态效果设置变化，用户报告显式关闭后仍被重新开启，涉及Mac与Windows。[维护者最终取舍](https://bugzilla.mozilla.org/show_bug.cgi?id=1851024#c31)是停止同步这一项。固定[ff976fb221cb17c7bec216b8ca2cfa3d913a19a1](https://github.com/mozilla-firefox/firefox/commit/ff976fb221cb17c7bec216b8ca2cfa3d913a19a1)于2024-08-16仅移除`services.sync.prefs.sync.general.smoothScroll=true`并留下注释，相邻其他同步项保留；记录标Firefox131修复。**[社区：使用反馈；一手：决定与固定补丁]**

原作者与 QA 曾无法复现，不启用偏好同步者也报类似症状，不能全部归因 Sync。未见原作者最终版回访，QA 白板非通过回执；补丁只改默认同步集合，不保证覆盖自定义规则，也不支持停止全部同步。**[研究：反证与结果边界]**

[Bug1928570](https://bugzilla.mozilla.org/show_bug.cgi?id=1928570#c12)报告 132 版类似症状，维护者排除 Sync，用户定位到 Resist Fingerprinting；维护者解释为预期设计并[以 INVALID 关闭该 issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1928570#c16)。它不是同步补丁复发，也说明停止同步不能解决一切滚动问题；这里只区分配置来源，不建议关闭隐私功能。**[社区：后续定位；一手：维护者解释]**

<a id="s979"></a>

### 反向约束：共同产物仍须一致

[Prettier官方配置说明](https://prettier.io/docs/configuration)不支持全局配置，以保持换电脑后的项目格式一致；从被格式化文件位置查配置，并允许项目内限定覆盖。设计目的不是收益测量，但反对把 Ruff 个人覆盖推广为所有工具都应个人优先。**[一手：官方设计；研究：反例]**

**证据边界。** 用户初试、源码与设计分开计证；未运行客户端／同步／上游测试，未测 AI 收益。**[研究]**


<a id="s996"></a>

## rclone：预演不能替下一轮提交控制状态

主线三；核实：2026-10-16（UTC+8）。
改变15 §6：预演验收除业务数据外，还须保护下一轮正式执行所依赖的接受状态；允许日志与隔离预演产物，不要求一概零写入。
新证据：rclone过滤规则hash修复、连续场景预期、贡献者后续使用，以及CLI／rc入口的分次修订。**[研究：采用判断]**

[2023-04-16原报告](https://forum.rclone.org/t/bisync-bugs-and-feature-requests/37636)中，定时 bisync 使用 `--filters-file`；改规则后先跑 `--resync --dry-run`、尚未正式采用，下一次普通运行却未拒绝新规则。预演写入 `.md5`，更新了接受基线。报告只讨论潜在损失，没有这一路径实际删除业务文件的回执。**[社区：原报告；研究：边界]**

[固定提交f4dd862](https://github.com/rclone/rclone/commit/f4dd86238d5b5993a5f104c58b2f34c2d6fdad56)在 `applyFilters` 中仅为非 DryRun 的 resync 保存 hash；普通运行仍拒绝 hash 缺失或不符。它保留独立 `-dry` 列表文件，因此要求是隔离预演产物与正式接受基线，不是一概零写入。**[一手：补丁；研究：机制]**

[固定scenario](https://github.com/rclone/rclone/blob/f4dd86238d5b5993a5f104c58b2f34c2d6fdad56/cmd/bisync/testdata/test_filtersfile_checks/scenario.txt)先 resync 建 hash、确认普通运行成功，再换过滤文件并预期拒绝；新增预演 resync 成功、下一普通运行仍拒绝两步。[golden日志](https://github.com/rclone/rclone/blob/f4dd86238d5b5993a5f104c58b2f34c2d6fdad56/cmd/bisync/testdata/test_filtersfile_checks/golden/test.log)表达相同预期。这是历史连续验收设计，未本轮执行，且 scenario 注明不测过滤的实际效果。**[一手：历史测试产物；研究：范围]**

原报告者也是修复贡献者：[补回漏交的golden日志后报告GitHub测试通过](https://github.com/rclone/rclone/pull/6971#issuecomment-1520596549)，按评审[把相关代码、文档和测试重新组织到各提交](https://github.com/rclone/rclone/pull/6971#issuecomment-1632281021)，又在[数周真实使用后再补一处问题](https://github.com/rclone/rclone/pull/6971#issuecomment-1666839385)。这支持持续使用与修改，不是独立接收者对 filter-hash 的最终复测，也不证明单项工时收益。**[社区：贡献者报告；一手：修订过程]**

**各入口分次修复。** [48ab67f](https://github.com/rclone/rclone/commit/48ab67f090fd630c3ed9cc66d6fe83eca769ce12)才把 rc 专属 `dryRun` 传入 `Options.DryRun`；[v1.64.0的cmd.go](https://github.com/rclone/rclone/blob/v1.64.0/cmd/bisync/cmd.go)与[rc.go](https://github.com/rclone/rclone/blob/v1.64.0/cmd/bisync/rc.go)分别含两项修复。2026-10-14 合入[#10015](https://github.com/rclone/rclone/pull/10015)，再补全局 `_config.DryRun`／flat `dry_run`：配置应用移到公共 `Bisync` 入口，全局预演不能被 rc 的 `dryRun:false` 取消。这是本接口取舍，不是通用优先级。**[一手：源码、标签与 PR]**

[固定rc测试](https://github.com/rclone/rclone/blob/be46eaa1f0fe8df62f522bf4fab22c30d0d92d1d/cmd/bisync/rc_test.go)经 `jobs.NewJob` 检查专属、全局及冲突参数，再观察目标新文件；仅本地路径，非云存储。[合并快照changelog](https://github.com/rclone/rclone/blob/be46eaa1f0fe8df62f522bf4fab22c30d0d92d1d/docs/content/bisync.md)列 v1.76，核实时[最新发布仍为v1.75.2](https://github.com/rclone/rclone/releases/tag/v1.75.2)，因此本次合并尚未发行给接收者。**[一手：测试、changelog 与发行；研究：边界]**

**采用范围。** 有持久基线时复用预演前后及下一正式调用的连续检查；换入口只补参数传递和效果。纯计算预览无需本项。未运行 rclone／模型或独立核 CI，缺独立逐例复测及 AI 收益证据。**[经验／研究]**


<a id="s1017"></a>

## 清 lint：保留异步调用契约，还是删除 async

主线：三，兼二；改变 15 §4 清理诊断时的选择。
改变的建议：先核执行上下文及调用者契约；有意的异步边界可窄范围豁免，不机械删除或添加无业务需要的等待；确实无异步契约时仍可重构。
新证据：Ruff 原用户报告、合入的文档修订与固定规则／运行器源码；ESLint 对 Promise 拒绝处理的独立反例。核实：2026-10-16（UTC+8）。**[一手／社区；经验：采用判断]**

[Ruff #23196](https://github.com/astral-sh/ruff/issues/23196)作者在 FastAPI 中用 pytest-asyncio 测 `ContextVar` helper：缩减复现用 `asyncio.run` 执行 coroutine 得 `1/1/1`，删 `async` 直接外层调用得 `1/2/3`。版本为 Python 3.11.11、Ruff 0.15.0，缺 pytest-asyncio 版本、配置及完整项目。维护者归因执行时机和上下文；RUF029 只报缺异步语法，无 autofix。因此不是 Ruff 自动破坏路由，也不是完整框架复测。**[社区：用户与维护者讨论]**

[#26641](https://github.com/astral-sh/ruff/pull/26641)于 2026-07-09 合入[`04d831a`](https://github.com/astral-sh/ruff/commit/04d831a7202b1274a1e1973c4d8443d754a51faa)，只补文档：无 `await` 的测试或 callback 也可依赖 async context，按需加真实 await 或局部禁规则。[同提交规则源码](https://github.com/astral-sh/ruff/blob/04d831a7202b1274a1e1973c4d8443d754a51faa/crates/ruff_linter/src/rules/ruff/rules/unused_async.rs)仅调用 `report_diagnostic`，已有 class methods、stubs、识别的 FastAPI routes、`asynccontextmanager` 豁免，[fixture](https://github.com/astral-sh/ruff/blob/04d831a7202b1274a1e1973c4d8443d754a51faa/crates/ruff_linter/resources/test/fixtures/ruff/RUF029.py)表达预期。这不是新增行为修复；Test Plan 非本轮回执，未获原用户复测。**[一手：补丁与测试定义；研究：边界]**

**隔离取决于运行方式。** pytest-asyncio [`f287e5e` 的测试入口](https://github.com/pytest-dev/pytest-asyncio/blob/f287e5e0f5425380b24c32b64037dfb2ed3cb937/pytest_asyncio/plugin.py#L561-L571)复制 async test context，经[包装器](https://github.com/pytest-dev/pytest-asyncio/blob/f287e5e0f5425380b24c32b64037dfb2ed3cb937/pytest_asyncio/plugin.py#L891-L908)传给 `runner.run`；async fixture 另有传播和恢复，不能统称状态隔离。[Python Task 契约](https://docs.python.org/3/library/asyncio-task.html#asyncio.Task)允许显式 context，默认才复制。只证当前机制，未证历史项目用了此实现；同一任务内 await 函数也不保证独立上下文。**[一手：源码与契约；研究：边界]**

[ESLint `require-await` 的 When Not To Use It](https://eslint.org/docs/latest/rules/require-await#when-not-to-use-it)给出无 await 而直接抛异常的 async 反例：调用者用 Promise 的 `.catch()`，改同步会直接抛出，须改变调用者，因此可以禁用规则。机制不同于 Python context，但都要求保住调用契约，不是保留所有无 await 函数。**[一手：官方反例；研究：比较]**

**适用性反例，不追加另一套流程。** [RUF055 #27024](https://github.com/astral-sh/ruff/issues/27024)中 bytes 正则搜索 `memoryview` 与改写后的成员判断不等价；[维护者拒绝 #27040](https://github.com/astral-sh/ruff/pull/27040#issuecomment-5050042567)也反对把所有 bytes-pattern 修复一律标不安全，因为 bytes 目标仍有有效情况，问题在目标类型与规则适用范围。核实时 #27024 仍 open，#27040／#27233／#27715 均关闭未合并；不能拿候选 PR 的测试或安全分类当已交付修复。固定 current main [`9e3ea63` 规则源码](https://github.com/astral-sh/ruff/blob/9e3ea63fb43040782a2ff00147cacf8861674615/crates/ruff_linter/src/rules/ruff/rules/unnecessary_regular_expression.rs)仍按 pattern、参数数量和真假值使用条件筛选，未核目标类型，修复的 Safe／Unsafe 分类取决于 comments。本轮另用手写 Python 3.12.14 标准库表达式核对：`memoryview(b"abcdef")` 上 `bool(re.search(b"abc", value))` 为 True、`b"abc" in value` 为 False；bytes 对照为 True／True。这只是局部语义见证，没有执行 Ruff 修复或当前发行版，也不是原用户框架复测；不推断全部修复不可信。**[一手／社区；经验：本轮标准库局部核对；研究：修订状态与采用边界]**

**采用范围。** 核真实调用者／运行器；有必要契约才窄范围豁免并验行为，否则正常重构。不能为消警告默认加 `sleep(0)`，它会改变调度。除上述标准库表达式外仅只读，未运行 Ruff／pytest／上游测试或测长期收益。**[经验／研究]**


<a id="s1078"></a>

## 依赖解析修复：排除坏组合，同时保留支持面

2026-10-17 UTC+8 核实；主线三／四，改变15 §5依赖升级的选择。**✅ 先分清错误组合由旧元数据、实际二进制还是业务兼容门槛造成，再选临时限版、抬直接依赖下限或继续迁移。** 以下是2024年历史维护链，不是当前安装版本建议或AI收益证据。**[研究／经验]**

**失败落在消费路径，不是安装声明。** [NumPy #26710](https://github.com/numpy/numpy/issues/26710)中，Airflow维护者报告Python 3.12 eager-upgrade将NumPy 1.26.4升至2.0.0，同时将pandas 2.1.4降至2.1.1；`pip check`通过，Google provider经aiplatform／bigquery导入pandas时却出现dtype尺寸不符。原帖给解析diff、栈和[失败job链接](https://github.com/apache/airflow/actions/runs/9537986684/job/26286749479)，本轮未取回job日志。这里的“仅3.12”是当时该轮解析结果，不是ABI故障仅可能发生于3.12。**[社区：下游原始报告]**

**修过新版本，不会使旧可选项自动安全。** 固定[pandas 2.1.1元数据](https://github.com/pandas-dev/pandas/blob/e86ed377639948c64c429059127bcf5b359ab6be/pyproject.toml#L30-L38)未给NumPy上限；[2.1.2元数据](https://github.com/pandas-dev/pandas/blob/a60ad39b4a9febdea9a59d602dad44b1538b0ea5/pyproject.toml#L30-L38)对三个Python分支均加`<2`，但要求Python≥3.9。[NumPy维护者答复](https://github.com/numpy/numpy/issues/26710#issuecomment-2172373298)认可排除坏旧版，并指出该历史发布的元数据无法事后修正；本节不据此概括所有包平台。**[一手：固定声明与维护者解释]**

**真正二改是支持范围，而非把所有下限一起抬高。** [Airflow #40272](https://github.com/apache/airflow/pull/40272)先针对3.12；随后作者报告[lowest-direct也暴露问题](https://github.com/apache/airflow/pull/40272#issuecomment-2171883989)，尝试统一下限，又因[Python 3.8不支持pandas 2.1.2](https://github.com/apache/airflow/pull/40272#issuecomment-2171886409)改为分段。最终[合并补丁81c331e](https://github.com/apache/airflow/commit/81c331e29a0e112380b634966c69342fa69bdd55)更新13个provider声明与生成依赖表：在当时支持的Python范围内，≥3.9使用`pandas>=2.1.2,<2.2`，<3.9保留`>=1.5.3,<2.2`。上限仍服务于既有SQLAlchemy／FAB兼容要求，见固定[common-sql说明](https://github.com/apache/airflow/blob/81c331e29a0e112380b634966c69342fa69bdd55/airflow/providers/common/sql/provider.yaml#L61-L70)。**[一手：固定补丁；社区：作者修订记录]**

**竞争方案与停止线。** 临时`numpy<2`可以阻止已知坏组合，不是错误方案；Airflow选择利用pandas已修元数据收窄直接依赖，同时保住解释器支持面。[pandas 2.2.2发布说明](https://pandas.pydata.org/docs/whatsnew/v2.2.2.html#pandas-2-2-2-is-now-compatible-with-numpy-2-0)明确其wheel兼容NumPy 1／2，但当时直接升级会越过Airflow的`pandas<2.2`门槛。已有兼容版本无法满足必要业务时继续限版，只有相关消费者都通过后才放开组合；若自己产出C扩展，另按[NumPy 2.0构建契约](https://numpy.org/doc/2.0/dev/depending_on_numpy.html#numpy-2-0-specific-advice)处理构建／运行依赖与wheel验证，不能只修声明。**[一手；经验：选择与边界]**

**交付证据仍有限。** [作者后续](https://github.com/numpy/numpy/issues/26710#issuecomment-2173315601)称分段限制解决Airflow问题，并提醒用户用项目推荐的constraints安装；[接收者询问发行](https://github.com/apache/airflow/pull/40272#issuecomment-2183125147)后，维护者在6月21日答复尚未发行，可在安装时加相应pandas范围。这不是接收者修后成功回执。最终PR head为`a3d23597f2542f5d20369bbf7eba8bc7e6b277be`；本轮该head的status／PR workflow查询返回空，未取得可核对的修后全矩阵结果，不能据合并补作CI全绿或业务恢复。仅只读源码、元数据、原帖与文档，未安装依赖、运行上游测试／模型；主动维护投入和长期净收益未知。**[社区／一手：声明；研究：验证范围]**

<a id="s1092"></a>

## 原生替换：请求取消之后消费者能否继续

核实：2026-10-18（UTC+8）；事件为2024年。改变15 §5：用原生接口替换成熟依赖时，比较窄适配与保留依赖，验已有消费者的选项、错误识别及后续业务动作。无AI实现归属；只读公开PR、评论与固定源码，未运行固件、浏览器或测试。**[经验：选择；研究：范围]**

**收益存在，普通请求通过仍漏旧契约。** GP2040-CE [#988](https://github.com/OpenStickCommunity/GP2040-CE/pull/988)于05-03合入，以自写Http包装原生fetch替换Axios。作者报告debug board的GET／POST可用，构建输出的gzip JS减少11.31kB，并[解释这是固件内压缩体积](https://github.com/OpenStickCommunity/GP2040-CE/pull/988#issuecomment-2081180149)，不是运行性能或维护净收益。[固定head的Http](https://github.com/OpenStickCommunity/GP2040-CE/blob/3b4ffabeb942b7584f63c2791bd6174261c5c80b/www/src/Services/Http.ts)把get第二参数当headers展开；[同版WebApi](https://github.com/OpenStickCommunity/GP2040-CE/blob/3b4ffabeb942b7584f63c2791bd6174261c5c80b/www/src/Services/WebApi.js)却仍传`{signal: abortSignal}`。返回仍是`{data: ...}`，选项语义已不同。**[一手：固定源码；社区：作者构建／试用自报]**

**修完连接还须修消费者。** 非原迁移作者asturur在[#1001](https://github.com/OpenStickCommunity/GP2040-CE/pull/1001)报告：0.7.8能用的引脚映射skip、cancel和关闭按钮在当时master失效，并展示错误的signal header；不能写成已发行故障。首补丁[`0c4ef7f`](https://github.com/OpenStickCommunity/GP2040-CE/commit/0c4ef7f79ce31dc06023fbb131b649ad9d74bb81)分开headers和signal、把signal传给fetch，作者[随后说连接能中止但功能未恢复](https://github.com/OpenStickCommunity/GP2040-CE/pull/1001#issuecomment-2094922235)。原因还包括WebApi仍按Axios的`ERR_CANCELED`代码返回`{canceled:true}`。中间补丁[`00f3eb5`](https://github.com/OpenStickCommunity/GP2040-CE/commit/00f3eb504602a05a4f6372f9b6d52a85ef5e7678)暂造同名Error并改按message识别。**[社区：实际操作与修复自报；一手：补丁]**

**保留迁移，撤掉仿造错误。** 评审者[建议直接识别原生AbortError](https://github.com/OpenStickCommunity/GP2040-CE/pull/1001#discussion_r1590436695)，[指出应读name而非message](https://github.com/OpenStickCommunity/GP2040-CE/pull/1001#pullrequestreview-2039825476)。最终05-07合入[`cdce584`](https://github.com/OpenStickCommunity/GP2040-CE/commit/cdce584b9b5bdb796f0ee0b9da441feb2402e4f6)，保留fetch与signal转发，去掉自造错误，WebApi用`error?.name === 'AbortError'`继续给UI返回业务结果`{canceled:true}`。[固定CaptureButton](https://github.com/OpenStickCommunity/GP2040-CE/blob/cdce584b9b5bdb796f0ee0b9da441feb2402e4f6/www/src/Components/CaptureButton.tsx)在此结果下另调设备端`abortGetHeldPins`，随后按stop／是否还有下一项选择关闭重置或继续捕获。这里保住的是自有消费者行为，不是旧库每个错误字段；也不代表任意取消原因都应这样分类。**[一手：评审与固定消费者；研究：解释范围]**

**采用与证据边界。** 有明确体积目标且必要行为能窄适配时，可保留原生替换；接不上业务收尾或适配负担不合算时保留成熟依赖，是本例支持的条件推论，并非项目实际回退Axios。作者评论后补的“fixed”属于中间修改回执，未绑定最终合入版本；最终接收与源码不能补作独立端到端复验。没有长期维护、跨浏览器完整通过或AI收益数据，也没有流式、重试或cookie故障证据。**[经验：取舍；研究：局限]**

## CPython：两种解析路径之后，保留哪条维护路径

核实：2026-10-20（UTC+8）。主线三／P6；改变22的保留选择，15只作入口。以下是历史人工维护的采用链，未运行 CPython、候选、模型或引擎，不是本仓库的 AI 效果实验。

**✅ 先比较下一项已确定修改的落点，再决定保留谁。** 公共路径能承接新需求并保住必要旧行为时优先复用；旧实现同样局部可改、迁移却增加消费者与接管责任时保旧。这里比较的是规则、诊断和消费者之间的修改传播，不把删行数当维护工时。**[研究／经验：采用判断]**

### 旧行为先限定，双入口必须真的不同

[Python 3.9 发布说明](https://docs.python.org/3.9/whatsnew/3.9.html#new-parser)声明新 PEG parser 生成与旧实现相同的 AST，并保留 oldparser 切换。[PR19778](https://github.com/python/cpython/pull/19778)在2020-04-30（UTC+8）修正过“新 parser 与自身对比”的测试；其[固定分派源码](https://github.com/python/cpython/blob/69e802ed812e38cb68a4ab74af64b4f719b6cc78/Modules/_peg_parser.c)按 oldparser 选择旧 PyParser_ASTFromString 或新 PyPegen_ASTFromString。对照输入相同还不够，Agent 要核真实入口。**[一手：官方说明／源码]**

**旧行为通过范围并不完整。** [v3.9.0 固定测试](https://github.com/python/cpython/blob/9cf6752276e6fcfd0c23fdb064ad27f448aaaf75/Lib/test/test_peg_parser.py)对 TEST_SOURCES／EXPRESSIONS_TEST_SOURCES 比较含位置的 AST；GOOD_BUT_FAIL_SOURCES 的三类 f-string 去掉位置后比较，带位置仍为 expectedFailure。FAIL_SOURCES 检查新 parser 拒绝，并非旧新非法输入全域等价。[PEP617验证](https://peps.python.org/pep-0617/#validation)报告标准库及约3800个 PyPI 包对照，也承认非法程序拒绝未充分探索。这里只能称兼容目标及所列旧行为对照，不能称两个实现全域正确。**[一手：测试定义／PEP；研究：证据边界]**

### 采用之后，下一轮需求改变保留理由

PEG 由[PR19503](https://github.com/python/cpython/pull/19503)于2020-04-23（UTC+8）合入；后续3.10开发线的[PR20768](https://github.com/python/cpython/pull/20768)于06-12移除旧 parser。[3.10固定发布说明](https://github.com/python/cpython/blob/b494f5935c92951e75597bfe1c8b1f3112fec270/Doc/whatsnew/3.10.rst)记录带括号的多 context manager 语法及诊断改进。旧 grammar→CST→AST 的跨层转换与新 grammar／AST 动作有不同修改落点；新语法是后来增加的要求，不证明旧实现未完成原任务。**[一手：合入／发行记录；研究：范围判断]**

**3.12 的 f-string 是后续维护，不是首次 PEG 切换已经解决的事。** [PEP701](https://peps.python.org/pep-0701/)将此前另行手工处理的 f-string 纳入语法，为引号复用、反斜杠、注释及更准确诊断承接新要求；旧输出语义继续保留，调试表达式原始空白也不能丢。[PR102855](https://github.com/python/cpython/pull/102855)于2023-04-20（UTC+8）合入；[固定语法](https://github.com/python/cpython/blob/1ef61cf71a218c71860ff6aecf0fd51edb8b65dc/Grammar/python.gram)增加 replacement_field／format_spec，并复用表达式规则和错误规则。[对应测试](https://github.com/python/cpython/blob/1ef61cf71a218c71860ff6aecf0fd51edb8b65dc/Lib/test/test_fstring.py)保输出／格式行为并改位置、诊断和新增语法验收，不能统称 AST 所有属性不变。**[一手：PEP／固定源码与测试定义]**

**公共路径减少一处专用处理，却把责任带到下游。** PR102855 的 string_parser.c 为 +35／−1054 行，tokenizer.c 为 +483／−6，action_helpers.c 为 +449／−90；这些差异含搬移，不能相减得到收益。随后[PR104323](https://github.com/python/cpython/pull/104323)于2023-05-21（UTC+8）继续改公开 tokenize、inspect、tabnanny 及测试。接手者须理解 token、公共辅助函数和消费者契约，不能只接收主 parser 补丁。**[一手：补丁／合入记录；研究：成本边界]**

**表现改善应单列，而不是只看接收／拒绝。** [3.12固定发行说明](https://github.com/python/cpython/blob/0fb18b02c8ad56299d6a2910be0bab8ad601ef24/Doc/whatsnew/3.12.rst#pep-701-syntactic-formalization-of-f-strings)展示同一非法 f-string 在3.11／3.12均被拒绝，后者能显示完整源行并更准确定位。人应确认此类诊断质量是否是当前目标；没有旧新同条件制作／维护工时，不能据历史采用推算节省幅度。**[一手：发行说明；研究：取舍]**

### 当前现成方案与撤回边界

**默认先复用目标所需的表示，而不是复制 CPython 的选型。** Python 语义分析优先目标版本的[ast](https://docs.python.org/3/library/ast.html)，但 parse 得到 AST 不等于整个编译阶段通过；保注释／空白的修改应看[LibCST的无损表示](https://libcst.readthedocs.io/en/latest/why_libcst.html)，它保留更多结构正是目标所需。自有 DSL 可先比较[pegen固定说明](https://github.com/we-like-parsers/pegen/blob/813cf0879bc5e2dac8f7eca158c96aec3e481d59/README.md)所供 Python 生成器，不能把 CPython 内部 C 生成器当通用 C 工具；编辑器的增量、残缺源码目标则先看[Tree-sitter](https://tree-sitter.github.io/tree-sitter/)。这些是2026-10-20核对的不同目标边界，未运行，也不是同题胜负榜。**[一手：项目文档；研究：现成替代]**

**撤回替换建议的条件**：原实现仍可局部满足下一需求；公共路径无法保住所需行为；或新增 token／接口迁移与接管责任超过已确认收益。Agent 提出两条修改路径和覆盖缺口，人决定必要契约与诊断目标；本链只支持这一选择机制，不支持 PEG 普遍更优或 AI 已降低维护成本。**[经验：取舍；研究：局限]**

## 连续修改深项目提议（2026-10-20）

本节保留2026-10-20纸面提议；P22／P23后续状态见迁移分册。P27保同一活动的两轮继承、合成账本与原生重选反例，未证明实际恢复效果。[研究]

[阅读本节](2026-10-12-development-stateful-diagnostics.md#连续修改深项目提议2026-10-20)

### P22：有数据应用的两轮迁移

[阅读本节](2026-10-12-development-migrations.md#p22有数据应用的两轮迁移)

#### 固定源码、读写闭包与执行门

[阅读本节](2026-10-12-development-migrations.md#固定源码读写闭包与执行门)

#### 第一轮：布尔发布→审核状态

[阅读本节](2026-10-12-development-migrations.md#第一轮布尔发布审核状态)

#### 第二轮：继承S6，增加定时发布

[阅读本节](2026-10-12-development-migrations.md#第二轮继承s6增加定时发布)

#### 当前工具契约：不混入另一套执行权限

[阅读本节](2026-10-12-development-migrations.md#当前工具契约不混入另一套执行权限)

#### 真实维护链：先封新写入，再重排与收尾

[阅读本节](2026-10-12-development-migrations.md#真实维护链先封新写入再重排与收尾)

### P23：Next应用迁出后仍值得保留吗

[阅读本节](2026-10-12-development-migrations.md#p23next应用迁出后仍值得保留吗)

### P27：发送中改稿与在途恢复

已交源码分析、合成账本输入与离线判据；实际两轮运行账本仍缺，不据此承诺恢复或exactly-once。[研究]

[阅读本节](2026-10-12-development-stateful-diagnostics.md#p27发送中改稿与在途恢复)

#### 固定链与两轮继承（2026-10-20）

[阅读本节](2026-10-12-development-stateful-diagnostics.md#固定链与两轮继承2026-10-20)

#### C1：R1账本直接进入R2

[阅读本节](2026-10-12-development-stateful-diagnostics.md#c1r1账本直接进入r2)

#### 同场景取舍与交付边界

[阅读本节](2026-10-12-development-stateful-diagnostics.md#同场景取舍与交付边界)

## P49：生成服务的故障证据

保留10-21三路静态传播证据及10-24 Payment／flagd正常与注入两路实试；未覆盖Checkout／frontend、错误目标、完整遥测后端或模型诊断收益。[一手／研究／本仓局部实试]

[阅读本节](2026-10-12-development-stateful-diagnostics.md#p49生成服务的故障证据)

### 当前最高水平卡

[阅读本节](2026-10-12-development-stateful-diagnostics.md#当前最高水平卡)

### 固定源码与三路判别（静态证据）

[阅读本节](2026-10-12-development-stateful-diagnostics.md#固定源码与三路判别静态证据)

### 反例：用户提示不是故障分类

[阅读本节](2026-10-12-development-stateful-diagnostics.md#反例用户提示不是故障分类)

### 最小诊断交付包与接收条件

[阅读本节](2026-10-12-development-stateful-diagnostics.md#最小诊断交付包与接收条件)
