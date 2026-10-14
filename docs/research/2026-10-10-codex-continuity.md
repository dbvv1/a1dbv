# Codex：慢、停止与上下文续接的证据核对

> 核实时间：2026-10-10；2026-10-14 补 §6 原生历史恢复。范围：官方开源实现与公开使用记录；没有重跑模型对照，没有核实用户私人日志。本页保存证据，实际建议并入 [Codex](../01-agents/codex.md)、[上下文](../03-context-engineering.md) 与 [长任务](../20-codex-long-horizon.md)。

## 1. 官方实现能确认什么

固定源码提交：[c3d3b142d10f4316b46e35aad7e5317e7e506cb7](https://github.com/openai/codex/tree/c3d3b142d10f4316b46e35aad7e5317e7e506cb7)。这是源码快照，不代表所有发布客户端都已部署该版本；也不是 Astra 的全部模型提示词。以下均为只读核对。**[一手]**

| 来源 | 直接观察 | 不应推出的结论 |
|---|---|---|
| [Default 模板](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/collaboration-mode-templates/templates/default.md) | 倾向合理假设后执行，结构化提问用于有实质帮助的可选问题 | 任意缺失信息或权限都可自行猜测 |
| [Plan 模板](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/collaboration-mode-templates/templates/plan.md) | 允许只读探索/不修改仓库内容的验证，禁止实施修改；`update_plan` 不等于进入 Plan 模式 | 做计划必须切换 Plan，或说“继续”就能覆盖当前模式 |
| [模式预设](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/models-manager/src/collaboration_mode_presets.rs)与 [TUI settings](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/tui/src/chatwidget/settings.rs) | 此 bundled Plan 预设是 Medium；Plan 有单独 effort 覆盖，普通 effort 更新不修改活动 Plan mask | 所有产品的 Plan 一律 Medium，或改一个 effort 就改变所有模式 |
| [配置 schema](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/config.schema.json) | 有 `model_reasoning_effort`、`plan_mode_reasoning_effort`；`model_instructions_file` 覆盖内建指令，说明明确强烈不建议使用 | 字段存在就值得调；替换底层提示必然提效 |
| [压缩提示](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/prompts/templates/compact/prompt.md) | 要求保留进度、决定、约束、剩余动作和关键资料 | 每次压缩都完整保留了内容，或所有压缩路径只使用此提示 |

### 回合结束不等于完成用户目标

[stream_events_utils.rs](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/stream_events_utils.rs) 的工具调用路径设置 `needs_follow_up = true`；[session/turn.rs](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/session/turn.rs) 将模型续接标志与待处理输入组合，响应 `end_turn=false` 也能要求续接。没有续接时进入 Stop hook 路径；带有效续接内容的阻止结果可继续循环，没有续接提示则警告并忽略该 block。**[一手：源码]**

这里处理的是回合控制。不能仅凭回合 completed、没有报错或最后一段文本说明“还有什么未完成”，认定实际任务已验收。反过来，这些代码也没有证明某份用户报告的根因，尚未将源码与其部署构建逐一对应。**[研究：机制分析]**

🧪 Stop hook 可作为具体、可判定条件的实验入口，例如缺少要求的文件或已知测试仍失败；不默认安装一个只会说“继续”的循环。它仍需识别用户取消、真实外部阻塞、预算边界与条件本身是否适用，不能把不断续接当成进步。长期开放研究尤其没有一个“所有内容研究完”的机械判据。**[研究：采用判断]**

## 2. 社区报告：分开观察，不合并成故障率

### A. 长会话慢不等于模型在想得更多

[#52555](https://github.com/openai/codex/issues/52555)（10 月 9 日）作者报告同为 Astra/medium、同一句“Are you ready?”，新会话首 token 2.924 秒，旧会话 42.330 秒；两次 reasoning token 均为零、无工具调用。旧会话输入约 209,857，新会话约 28,295；旧会话缓存比例约 99.73%，历史经历 80 次压缩。**[社区：原帖表格，未下载附件或验证私人完整历史]**

这些数字支持作者观察到的差异，却不是只改变“历史文件大小”的受控实验：活动输入规模不同，单对测量也未控制时段/服务端状态。帖子上方 App 版本与附加信息中的版本号不同，不能随意选一个作为精确复现环境。不能据此推广 14.5 倍平均降速，不能断言缓存失效、后端路由或本地日志解析就是根因。**[研究：证据审查]**

✅ 若自己遇到类似现象，先保存必要的项目状态，再用同模型/effort 的新会话作小规模比较，同时记录活动输入规模；不要假定 `/compact` 等于新建线程或高缓存命中必然低延迟。只有真实出现退化才尝试迁移，避免每个小任务都重建上下文。**[研究：建议]**

### B. 高 effort 抱怨有价值，但不是因果对照

[#51670](https://github.com/openai/codex/issues/51670)（10 月 7 日）描述 Astra/Sol 高推理下慢、停在中途、耗额度。作者提供 App/平台，但没有同任务低/高 effort 对照，也没有逐次轨迹；可见 bot 的相似 Issue 推荐不是维护者确认根因。它证明存在这样的公开体验报告，不证明降低 effort 必然修复问题。**[社区；研究：边界]**

### C. “知道目标”与“继续执行目标”可能脱节

[#52345](https://github.com/openai/codex/issues/52345)（10 月 9 日）作者描述 Astra/ultra 在有明确验收要求时，两次准确报告完整范围尚未完成，却结束回合；补发继续指令后，无需新增材料或授权便恢复工作。其另一案例是底层条件从 unknown 变 false，底层执行结果改变，但面向使用者的审查对象完全未变。原始私有记录未公开，本轮读取公开正文，不把这些自述写成本仓库已复现。**[社区]**

这对“强模型只需更短提示”的建议构成有价值的反例：删流程时应保留它原来承担的反馈功能。知道还有缺口不等于缺口会改变下一步；审查者能指出问题也不等于执行者会修复。该报告自己也明确：没有新旧 harness A/B，不能断言删掉某条规则造成了全部问题，更不能因此恢复所有繁重环节。**[研究：独立分析]**

[#50771](https://github.com/openai/codex/issues/50771)（10 月 4 日起）汇集“承认问题后无行动结束”、压缩后回旧任务、局部修复未交付等记录，提供部分结构化事件。正文区分了成功的小型控制案例和失败序列，没有宣称每次必现。本轮阅读首帖叙述、部分嵌入记录及可见回复，未逐条验证其全部附件、相关链接或私人数据。**[社区]**

回复里，有人报告外部 checker 在一个刻意构造的“文件缺失却停止”小任务上拦住结束；也有 CLI 使用者报告无工具、空回复、零 usage 的不同症状。前者不能证明一般长期任务都可机械验收；后者不能直接与正常文本后停工合并为同一缺陷。讨论中的项目推广只是候选，不是本仓库安装推荐。**[研究：判断]**

## 3. 对当前工作流的修正

✅ 保留原生执行和必要反馈：目标、用户新修正、已知反例必须影响实际动作。删掉重复访谈、重复计划、例行多轮 reviewer，并不意味着删掉范围核对与产品验收。对目标清楚的工作，先执行；对有真实选择分歧的问题，澄清会改变实现的部分。**[研究：采用判断]**

区分四种“慢”：等待模型首输出、等待工具/网络、阻塞在输入或权限、已经输出但没有继续做。它们的处理分别是查延迟与输入状态、查工具耗时、解决具体前提、追查行动与结束条件。统一开更高 effort、统一加 Superpowers，或统一降 effort，都没有足够证据。**[研究：采用判断]**

后续问题：寻找用户可公开验证的修复/成功轨迹，尤其是减少流程后仍保持交付质量的案例；社区 Issue 搜索刻意偏向问题，不能据此评价整体成功率。官方 Astra skills/prompts 文章是报告中的引用线索，本文未读到原文，不转述为官方建议。

## 4. 2026-10-11 追查：有相关修复，不等于整个问题已解决

官方 [PR #49598](https://github.com/openai/codex/pull/49598) 于 9 月 30 日合并，主题是把显式用户 Goal 修改持久化到模型历史。它区分 `origin=user` 与 `automatic`；自动生命周期更新不能提供新的用户授权；压缩输入快照之后接受的 Goal 修改须保留。已读取 PR 说明，并核对上述固定源码 `core/src/session/mod.rs` 的 replacement history 合并与 `core/src/session/tests.rs` 的并发 clear 用例，未运行 Rust 测试。**[一手]**

这修补的是明确的数据保存/排序路径，不是给所有“长期任务停工”开出的修复证明。[#49022](https://github.com/openai/codex/issues/49022) 在 10 月 10 日仍出现新的用户报告：自动 Goal 回合在压缩后回答已解决的旧问题。报告承认存在无法检查语义的加密压缩项，不能断言 Goal 从所有模型输入中完全消失。本轮没有建立该客户端与 PR 的部署对应关系，也不能因此断言 PR 无效。**[社区；研究：证据边界]**

另读 [#48802](https://github.com/openai/codex/issues/48802)：作者在定制 CLI、代理与单组顺序比较中报告，resume 后 request-level effort 基线改变，候选实现的缓存读取比例不同。此例不是官方原版客户端对照。固定源码 `core/src/session/reasoning_effort.rs` 确实区分 request baseline 与追加的可信 `ConfigurationUpdate`；因此只看请求顶层 effort，可能漏掉后续配置更新，不能直接断言用户选择没生效。缓存比例与费用、延迟也不能相互替代。**[一手：源码；社区：报告；研究：解释]**

✅ 借鉴：排查时分开“目标编辑是否进入历史”“压缩是否保留变更”“模型是否实际遵循”“回合是否继续”。检查一个层面的修复，不能自动关闭其他层面的问题。对用户日常使用，先保留明确续接状态和当前版本；没有实测依据时，不推荐安装报告中的私有候选补丁、频繁切 effort 或反复压缩。**[研究：采用判断]**

## 5. 2026-10-13：解释器重置，先对账再恢复

官方 [PR #52825](https://github.com/openai/codex/pull/52825) 于 2026-10-10 08:51 UTC 合并，提交 `806d9732c974bc8a51b8317c1bd8985544fe627c`，是本页原固定快照的下一提交。[恢复实现](https://github.com/openai/codex/blob/806d9732c974bc8a51b8317c1bd8985544fe627c/codex-rs/code-mode/src/grpc_session/reconnect.rs) 在创建 execute/wait 请求时捕获运行时 generation；若恢复替换了运行时，旧 generation 的请求被拒并收到明确重置错误。错误说明运行中 cell 与存值丢失，但先前外部工具操作可能已经完成，应先检查结果，再发起新 `exec`。**[一手：源码]**

[gRPC 回归测试](https://github.com/openai/codex/blob/806d9732c974bc8a51b8317c1bd8985544fe627c/codex-rs/code-mode-host/tests/grpc.rs) 覆盖并发请求、恢复前创建但恢复后才轮询的请求、新调用成功而旧存值为空。[PR #52952](https://github.com/openai/codex/pull/52952) 于同日 18:26 UTC 合并，提交 `b871a1b9f6eb58aa21ec6c307b5b08b1ba5b2613`；其 [hung-host 恢复测试](https://github.com/openai/codex/blob/b871a1b9f6eb58aa21ec6c307b5b08b1ba5b2613/codex-rs/core/src/code_mode_host_tests.rs) 进一步断言被拒的恢复调用没有写入值，下次新执行才成功。本轮只读实现与测试定义，未运行 Rust 测试或模型对照。**[一手：测试定义，非实测]**

✅ 对应 [20 §9](../20-codex-long-horizon.md#9-超时后动作究竟发生了吗)：遇到明确 runtime reset，先核对先前工具操作和外部任务的实际结果，再重建解释器内所需状态并继续。cell 或 `store` 值丢失，不能推出外部 subprocess、worker 已停止，也不能推出外部写入已撤销；结果未知时先对账，不原样重放整段带副作用操作。**[研究：采用判断]**

发布边界：2026-10-13 10:45 UTC 核对官方 [release 列表](https://github.com/openai/codex/releases)，最新可见稳定版 [0.162.1](https://github.com/openai/codex/releases/tag/rust-v0.162.1) 发布于 10 月 9 日，最新可见预发布 [0.163.0-alpha.5](https://github.com/openai/codex/releases/tag/rust-v0.163.0-alpha.5) 发布于 10 月 10 日 00:26 UTC，均早于这两项合并；没有建立 Desktop 部署对应。此证据支持安全恢复动作，不证明未完成目标会自动续接或子结果会自动唤醒父任务，原 §7.1 的受限 Stop 试用判断不变。**[一手：发布元数据；研究：边界]**

## 6. 2026-10-14：原生恢复已够时，撤回手工修复

**采用判断：** 对已定位的历史读取故障，先核对原生修复及实际运行版本，再验证原先缺失的内容；不要因为曾需要补偿脚本，就在原生恢复后继续默认修改内部数据库。该增量改变 [20 §4](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)，不新增交接模板。**[经验：采用判断]**

### 失败、修订与同一故障样本的恢复

[#38792](https://github.com/openai/codex/issues/38792) 的 rezzminator 最初报告分页历史仅显示开头，原始 rollout 仍在；旧投影游标与记录序号不一致。其 [9 月 14 日修正](https://github.com/openai/codex/issues/38792#issuecomment-5663495014)使用另一个真实重复边界样本：由 CLI 0.149.1 创建，`token_count(1259)` 后紧接同序号的 `thread_settings_applied`，投影停在该边界。升级至 0.154.0 后仅 resume 一次，不编辑 SQLite 或 JSONL，投影到达文件尾，轮次从 5 增到 8、条目从 415 增到 651，三轮缺失历史重新可见。这是同一故障样本前后的作者报告，不是把最初 0.146.1 的样本误认成最终复测样本。**[社区：公开报告，未独立复现]**

原报告者同时撤回早期数据库重建建议的泛化：重复序号样本在旧版从头重放仍失败，清理派生数据可能把尚可见的前缀也变成空白。因此本页不复制历史数据库修改步骤，也不把第三方修复工具列为默认采用项。**[社区：作者修正；经验：采用边界]**

### 原生改动与版本证据

- [PR #42369](https://github.com/openai/codex/pull/42369)，固定提交 [095ac4f131e759b204fa6368dc42d2feff6eb21a](https://github.com/openai/codex/commit/095ac4f131e759b204fa6368dc42d2feff6eb21a)：`read_projection_steps` 对重复／回退序号推进字节位置并跳过该记录，对向前缺口生成 `SkippedOrdinalRange`，使后续可读历史继续投影；对应测试改为检查异常后仍能取得后续轮次。跳过异常不是重建异常记录中的信息。**[一手：固定补丁与测试定义，未运行]**
- [PR #42378](https://github.com/openai/codex/pull/42378)，固定提交 [69cebb5d15939bf9b6c1b4647b53879beab91ba2](https://github.com/openai/codex/commit/69cebb5d15939bf9b6c1b4647b53879beab91ba2)：统一先解为 `serde_json::Value` 的持久化记录读取路径；[序号扫描](https://github.com/openai/codex/blob/69cebb5d15939bf9b6c1b4647b53879beab91ba2/codex-rs/rollout/src/ordinal.rs#L56-L88)改用 canonical scanner，避免因嵌套小数解码失败而从较早记录续号。PR 描述包含带小数 rate-limit 的恢复回归。它处理后续读取／续号来源，不能单独替代前项对既有异常的恢复。**[一手：固定源码与 PR]**
- 官方 [0.154.0 发布页](https://github.com/openai/codex/releases/tag/rust-v0.154.0)日期为 2026-09-09，changelog 列出两项 PR；本轮另读该 [tag 的投影实现](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/thread-store/src/local/thread_history_materialization.rs#L150-L290)，确认包含重复／缺口处理。不依赖“已合并”推定已发布，也不据此确定所有 Desktop 捆绑后端的版本。**[一手：发布页与 tag 源码]**

### 可采用的部分与未填平的缺口

保留原数据后，核对受影响后端实际版本并采用含修复的受支持版本；用正常恢复入口检查原来缺失的轮次。若仍失败，保存现象与版本并继续定位，不把清空内部存储当通用重试。对于运行中的后端，磁盘包已升级也不能代替实际进程版本核对。**[经验：由版本与恢复证据推导的建议]**

AI 归属仅到公开调查过程：原帖明确以 Claude 代理身份报告并称用户已审阅；这不证明缺陷或上游补丁由 AI 生成。这里补上的是实际接收修订后的恢复结果，未测接管人的主动工时，也不是职业维护者完成第二次代码修改的证据。原始记录真的删除、其他解码／界面故障、恢复后的模型是否正确理解任务，均不在此次结果内。全程只读公开 issue、PR、固定源码与发布内容；未读取私人日志、运行 Codex、安装修复工具或执行上游 Rust 测试。**[研究：归属与验证范围]**
