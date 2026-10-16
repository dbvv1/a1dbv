主线：三，连续修改仍然可靠；兼二
改变的建议：区分首输出慢、工具等待、权限阻塞和回合停工；重置后先核外部结果，历史读取先核原生修复，入口、子 Agent 与记忆按实际客户端和有效配置选择。[研究]
新证据：2026-10-10 起原研究的固定控制流、恢复补丁、配置实现与测试定义，以及社区失败和同一历史样本的升级恢复报告；各次补核日期见正文，未运行客户端或模型，不将修复合并当作目标续接已通过。[一手／社区／研究]

# Codex：慢、停止与上下文续接的证据核对

> 核实时间：2026-10-10；2026-10-14 补 §6 原生历史恢复；2026-10-15（UTC+8）补 §7 导入与同步边界、§8 客户端入口与资格、§9 模型选择与历史断言边界。范围：官方开源实现与公开使用记录；没有重跑模型对照，没有核实用户私人日志。本页保存证据，实际建议并入 [Codex](../01-agents/codex.md)、[上下文](../03-context-engineering.md) 与 [长任务](../20-codex-long-horizon.md)。

当前结论：模型定位不是实测排名，Ultra 不是多 Agent 的唯一入口；历史窗口与单价倍率不当作当前统一任务预算；先按任务核客户端入口、套餐与开通资格，不由源码模块或“包含 Codex”推定能力齐全；导入按客户端与项目范围选择，重复导入不当作覆盖同步，关闭更新不当撤销；先区分首输出慢、工具等待、权限阻塞和回合停工；明确 runtime reset 后先核对外部结果，历史读取故障优先核原生修复与实际版本，不默认清库或加续接循环。[研究]
证据：官方固定控制流／恢复补丁与测试定义、社区失败及同一历史样本升级恢复报告；未运行客户端或模型。[一手／社区]
关键边界：回合完成、修复合并与发布部署不是同一事实；历史可见性恢复也不证明模型已正确续接目标。[研究：证据边界]

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


## 7. 导入入口、配置合并与自动更新

主线：三，兼二。改变 Codex §3 的无差别导入／同步建议；§4 的“低迁移成本”仅同步 00／03／05／11 已有结论，不算新证据。**[研究]**
新证据：2026-10-15（UTC+8；10-14 UTC 读取）当前官方 Import 契约、发行 0.162.1 的实际选择器和合并实现，以及两个公开导入后问题报告。**[一手／社区]**
采用判断：先选导入对象与客户端，核目标配置再继续工作；自动更新、完整历史备份和可撤销迁移是不同要求。**[经验]**

### 当前契约与已发行实现分别证明什么

[Import 官方页面](https://learn.chatgpt.com/docs/import)区分 Desktop 与 CLI：Cowork 和自动更新属于桌面入口；CLI 接收 Claude Code／Cursor，`/import` 不能用于运行中任务、远程会话或已连接本地 app-server daemon 的会话，近期聊天限近 30 天最多 50 个。页面将已有项目文件夹的目标明确列为使用同一文件夹的项目。**[一手：当前文档]**

这些条件会改变实际选择：不要为了迁 Cowork 而找 CLI 命令，也不要用近期聊天导入代替完整历史备份；原项目目录导入不是隔离副本。官方保证的是原 Agent setup 不被导入修改／删除，不是后续编码对原项目无副作用。**[研究：契约推导]**

固定版本为 [0.162.1](https://github.com/openai/codex/releases/tag/rust-v0.162.1)（2026-10-09），annotated tag `7a078f6bb4ce0dc2a81408b334ce52979d92c603` 解析到提交 `092d3acd6bec3e3a14bdc7e7a2810ab628ab759d`；以下不是拿 main 模块存在推定已发布，更不代指 Desktop 捆绑版本。**[一手：tag 元数据]**

| 固定来源 | 已读行为 | 选择影响 |
|---|---|---|
| [TUI source](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/tui/src/external_agent_config_migration/source.rs#L25-L47)、[flow](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/tui/src/external_agent_config_migration/flow.rs#L255-L325) | 实际来源枚举与检测循环包含 Claude Code、Cursor；[slash 帮助](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/tui/src/slash_command.rs#L115)却仍只写 Claude Code | 单条帮助文案也可能落后；核实际选择器，不反过来否认 Cursor 支持 **[一手：源码]** |
| [model 默认限额](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/external-agent-migration/src/model.rs#L5-L23)与上述 flow | 默认 30 天／50 个；TUI detect 对年龄和数量传 `None`，使用默认值 | 仅证明这条入口的默认值，不推广为所有服务 API 的硬上限 **[一手：源码]** |
| [service 设置／MCP 写入](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/external-agent-migration/src/service.rs#L570-L642)、[config_values](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/external-agent-migration/src/config_values.rs#L8-L75) | 设置递归补缺键，已有非表值保留；MCP 按 server 名补入，已有同名项整体保留 | 重导不能保证新的源端值进入目标；核对 Codex 实际值，而非导入成功提示 **[一手：源码；经验：建议]** |

不从上述合并函数推断桌面后台自动更新的冲突、删除传播或双向同步语义；当前文档没有在所读页面给出这些保证。需要这些性质才采用的项目，应先验证所需行为，不默认依赖。原有 Hook／插件迁移契约沿用 05／06，本轮不再研究其全部适配。**[研究：范围]**

### 真实反例与不能推出的结论

- [#39923](https://github.com/openai/codex/issues/39923)：2026-08-21 的 Windows 使用者报告导入后不稳定，关闭自动同步并禁用导入 Skills 后，UI 删除仍报错；重装后登录也未解决。版本自报 `151.0.7922.170`。截至本轮 open、无评论，没有维护者根因或修复验证；只支持“不承诺关闭同步／重装就完整撤销”，不能证明导入必然导致崩溃或当前版本仍必现。**[社区：首帖自述，未复现]**
- [#53175](https://github.com/openai/codex/issues/53175)：2026-10-11 的 macOS 使用者报告 `26.1007.21159` 把源端工具生成的 transcript 也导入聊天，期望路径排除；主问题是外部归档／删除后的 sidebar 残留。两种现象不合并为同一根因，也不据单帖认定所有版本无过滤能力。本页不复制其内部数据库修复方法。**[社区：首帖，未复现／未审全部讨论]**

因此先按最小所需范围导入，检查聊天和配置，再决定是否开启持续更新；已有状态的去留通过受支持管理入口处理，不把停止同步当回滚。未运行 Codex、Desktop、Rust 测试或迁移夹具；未访问私人文件、安装或调用模型；没有证明迁移净工时或同步可靠性。**[经验：建议；研究：验证边界]**


## 8. 客户端入口、资格与安全评审边界

主线：二。改变 Codex §1 的入口选择和 §3.5 的无条件能力理解，不重做 §6 工作法。**[研究]**
改变的建议：先按实际执行位置和能力选入口，再查套餐、rollout 与工作区资格；普通评审、PR Security Review 和 Cloud 仓库扫描分开选择。**[经验]**
新证据：2026-10-15（UTC）直接读取当前官方各入口文档及 Markdown 正文；它们是当日公开契约，不是固定发行客户端实测。**[一手]**

### 入口与套餐不能只按产品名判断

| 直接来源 | 核到的边界 | 对采用的影响 |
|---|---|---|
| [Pricing](https://learn.chatgpt.com/docs/pricing) | Free／Go 列桌面 App 的 Luna Standard，注明 rollout；Plus 明列 web／CLI／IDE／iOS 和云端代码评审、Slack 集成 | “各档都含 Codex，额度不同”漏掉入口和模型差异；选择前核对应入口 **[一手；经验]** |
| [GitLab beta](https://learn.chatgpt.com/docs/third-party/gitlab) | 专页明确支持所有 ChatGPT plans，在 Codex cloud 执行；桌面 GitHub 风格的 Create pull request 控件不在该 beta 内 | 不反向把 Pricing 的简表当作所有 Free／Go 集成均不可用的证明 **[一手；研究]** |
| [Browser](https://learn.chatgpt.com/docs/browser) | 内置 Browser 在 web／desktop 提供，CLI／IDE 不提供；桌面内置浏览器 profile 与普通浏览器分离 | 页面交互选相应入口；需要已有普通浏览器会话时另查浏览器扩展，不能假定自动继承登录 **[一手；经验]** |
| [Computer Use](https://learn.chatgpt.com/docs/computer-use)、[Linux App](https://learn.chatgpt.com/docs/linux/linux-app) | 桌面 Computer Use 列 macOS／Windows、受支持地区和插件设置；macOS 需 Screen Recording／Accessibility，Windows 需目标处于活动桌面；Linux App 仍为 preview | 可安装 Linux App 不证明可操作本机 GUI；按任务所需系统、插件及权限核对 **[一手；经验]** |
| [Codex environments](https://learn.chatgpt.com/docs/environments/modes)、[Cloud](https://learn.chatgpt.com/docs/cloud) | Cloud 使用已发布环境，每任务独立文件；本机文件、进程、浏览器登录和 VPN 不自动迁入 | 本机依赖不能只靠切 Cloud 继续；任务改动也不自动成为下次环境起点 **[一手；经验]** |
| [Get started with Work](https://learn.chatgpt.com/docs/get-started-with-work) | Work 可跨 desktop／web／mobile 继续符合条件的任务；依赖本机资源的步骤仍需连接电脑，旧任务不会因启用同步自动变成新模式 | Work 不是桌面 App 的别名，也不是 Codex Cloud 环境的同义词 **[一手；研究]** |

### 三种安全检查的入口和费用

[GitHub Code Review](https://learn.chatgpt.com/docs/third-party/github)的普通评审可发现安全相关问题；专门的 [Security Review](https://learn.chatgpt.com/docs/security/security-review)更深入检查 PR diff、仓库上下文和威胁模型，处于研究预览。当前专页列 Pro／Business／Edu／Enterprise，明确不含 Plus；配置要求已连接 GitHub 的 Codex cloud，以及相应仓库权限。已有 Security scan 是可选条件，不能写成必须先买／跑一次全仓扫描。该 PR 流程消耗所含 Codex 用量或 ChatGPT credits。**[一手：当前官方正文]**

[Security Cloud setup](https://learn.chatgpt.com/docs/security/setup)则是单独插件，在 Cloud 扫描连接的 GitHub 仓库或持续监控提交；本机仓库扫描使用另一个 Codex Security 插件。[Cloud access and prerequisites](https://learn.chatgpt.com/docs/security#codex-security-cloud-access-and-prerequisites)另明确要求工作区具有 Codex Security Cloud access、已连接的 GitHub 仓库和兼容 Codex cloud 环境；连接与环境可在设置扫描时建立，缺访问资格则找工作区管理员。PR Security Review 的套餐清单不能证明 Cloud 仓库扫描已开通，支付能力也不替代该准入门槛。当前 [Cloud FAQ 的 Billing](https://learn.chatgpt.com/docs/security/faq#billing)写明：2026-10-01 12:53 PM Pacific 后设置的仓库和连续扫描按套餐 token rates 计费，依账单计划使用 credits 或 USD，不在套餐 included usage allowance 中；符合条件的免费扫描 credits 先抵扣。早于该时点设置的连续扫描免费到 2026-10-21，此后需启用付费用量才继续，否则暂停。因此“Codex 额度可用”不能单独回答是否应启动 Cloud 扫描，也不能把 PR Security Review 的用量规则套给它。**[一手；研究：选择影响]**

### 常驻能力和源码模块的证据限度

[Dots access](https://learn.chatgpt.com/docs/dots#access)当前列 Pro 100／200／500（18 岁以上，EEA／英国／瑞士之外）、Business Premium 和 Enterprise；Enterprise 默认关闭，需管理员启用，所有符合条件账户仍受渐进 rollout 影响。正文仅保留资格链接，避免把“各档含 Codex”扩展为常驻 dot 可用。**[一手；经验]**

源码目录和 feature 名称本来就仅能证明实现存在，不证明各客户端公开提供相同入口；本页原“源码里能看到的模块”标题已作此区分，不将其追认成事实错误。反向也不能因存在 feature flag 而否认已文档化的能力：[Long-running work](https://learn.chatgpt.com/docs/long-running-work)明确给出 App／CLI／IDE 的 `/goal`；[Memories](https://learn.chatgpt.com/docs/customization/memories)说明本地 Codex 记忆默认关闭、需启用，且与 Work 的 ChatGPT memory 控制不同。这里只核公开边界，不推断实际同步或各构建部署。**[一手；研究：反证与范围]**

未运行任何客户端、扫描、插件或模型；未测试真实套餐账户、地区或管理员开通状态。没有用源码版本推定托管服务上线，亦未重核模型成本、导入、权限及子 Agent 单元的全部实现。当前文档若变动或账户 rollout 与文档不同，入口和费用判断须按当时设置重新核对。**[研究：验证边界]**


## 9. 模型选择、成本口径与历史断言的适用范围

主线：额外能力何时值得加；改变的建议：不为并行强制选择 Ultra，不用历史窗口或统一价格倍率作当前模型选择；新证据：2026-10-15（UTC+8）官方 Models／Subagents／Pricing 原文、0.144 变更前后与 0.162.1 固定模型目录。**[一手；研究]**

### 模型定位和 effort：候选依据，不是收益证明

[Models](https://learn.chatgpt.com/docs/models)当前以 6.1 Sol 作为复杂工作候选、Luna 用于聚焦可重复任务、Astra 用于最困难工作；[Model selection](https://learn.chatgpt.com/docs/model-selection)明确建议同任务比较，并把页面建议作为起点。因此撤下旧表对 6 Sol Medium 的无条件定位及首发社区总体评价，不把官方建议改写为本仓跨模型胜率。当前文档也提醒不同代际 effort 不精确对应。**[一手；研究]**

[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)分入口说明：Work web 的 Ultra 使用最大推理并允许主动委派，其他 intelligence levels 可直接请求子 Agent；App／CLI／IDE 的当前本地版本由直接请求或适用项目／Skill 指令触发。Models 另区分 Max 的单任务深推理与 Ultra 的并行任务分解；Luna 支持到 Max、不支持 Ultra。原“Ultra 不再是单 Agent”并非凭空捏造，但省略其他 effort 的并行入口会误导选择，应补边界，不宣称 Ultra 保证加速或适合所有任务。**[一手；研究]**

Models 的 GPT-5.5 retirement 明确时点为 2026-10-14 19:00 UTC（北京时间 10 月 15 日 03:00），仅针对 ChatGPT 登录的 Codex；API-key Codex 也不受影响。“所有写死配置都要改”应限受该退役影响的登录方式。**[一手]**

### 价格和上下文：保留口径，撤回统一外推

[Pricing 的 token rates](https://learn.chatgpt.com/docs/pricing#token-rates)列 Standard 每百万 token 的 credits：Astra 输入／缓存输入／输出为 250／25／1250，6.1 Sol 为 50／2.5／250。因此非缓存输入和输出是五分之一，缓存输入是十分之一；该页明确单价不决定订阅内含用量、API 定价独立。[Speed](https://learn.chatgpt.com/docs/agent-configuration/speed)还区分订阅内含用量与付费 credits 的速度档倍率。正文保留较低成本定位，不能保证同任务总费用降至五分之一。**[一手；研究]**

[PR #33972](https://github.com/openai/codex/pull/33972)是 2026-07-18 对 0.144 发布线的 bundled 元数据回移。比较 [base 215fb464](https://github.com/openai/codex/blob/215fb464f1932b5fd7beb5d4615bc1927d80fbf7/codex-rs/models-manager/models.json)与 [head b06f4fa9](https://github.com/openai/codex/blob/b06f4fa9f5602daee76468a957aa78ac173d7333/codex-rs/models-manager/models.json)：5.6 Sol／Terra／Luna 的 context_window 从 372000 改为 272000，5.5 等此前已是 272000，并非全部模型统一缩窗。**[一手：固定源码]**

0.162.1 标签解析到 [092d3acd6bec3e3a14bdc7e7a2810ab628ab759d](https://github.com/openai/codex/tree/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d)，其 [models.json](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/models-manager/models.json)中 Astra／6.1 Sol／6 Sol／6 Luna 为 272000，Daybreak Red 为 372000。[manager.rs](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/models-manager/src/manager.rs)另有远程目录刷新及缓存策略，因此 bundled 数值不证明每个在线会话的有效窗口，更不能替代 API 规格或自动压缩阈值。**[一手；研究]**

### 短板断言与交叉评审入口

[#11626](https://github.com/openai/codex/issues/11626)截至读取仍开放，其首帖具体请求 CLI 同时回退会话和文件，并描述 Esc 回退仅影响历史；本轮读取首帖与末 8 条评论，后段有第三方实现自述及 10 月 10 日文件恢复诉求，未审完全部 48 条评论。它不是全客户端不存在回滚的证明。[#9203](https://github.com/openai/codex/issues/9203)同样仍开放；保留下文探索前做检查点的建议，撤回顶部无客户端范围的弱体验断言。**[社区；研究]**

旧“点赞第一、630赞、200美元 Pro 下调、10月3日后普遍缩水”没有在正文绑定可复核原帖与样本范围。本次读取 [#14593](https://github.com/openai/codex/issues/14593)是 2026-03-13 Business／VS Code／5.3及5.4 High 的个人耗量报告，与上述当期普遍判断不相同；GitHub 检索亦有 10 月个别用量投诉，未提供代表性分母或官方下调证明。故撤回旧普遍断言，改引用本记录已核的 [#51670](https://github.com/openai/codex/issues/51670)作为具体体验报告；没有认定下调从未发生。点赞数和排序不用于证明故障率或选型。**[社区；研究：证据不足的撤回]**

[#28058](https://github.com/openai/codex/issues/28058)首帖创建于 2026-06-13，指向 6 月 5 日合并的 #26210，限定含该变更且开启 MultiAgentV2 的实现；报告对象是 spawn／send／follow-up 的任务／消息载荷及可读审计副本，不是所有子 Agent 的全部提示词。首帖另有 7 月 22 日状态更新，不能把这个日期写成加密起始日期，也未由其证明 10 月全部客户端仍有相同表现。撤下 HN 票数和笼统起始时间，保留按实际版本检查委派记录的选择。**[社区：首帖；研究：范围判断，未重核当前加密实现]**

正文 §5 的无条件交叉评审与 [09](../09-review-and-quality.md)已有条件选择不一致，按该主专题同步：具体漏审风险值得成本时再试，而非每次互审。未新增模型运行、客户端测试或成本实验；本节只证明文档契约、固定源码字段和公开报告的范围。**[研究：同步与验证边界]**


## Windows启动层补研：卷枚举失败不等于命令被拒

核实：2026-10-16 14:53（UTC+8）。主线三／M4；改变17的执行失败排查：先区分启动器、权限判定与目标命令失败，不靠重复提示或扩大权限解决启动故障。证据全部来自公开原帖、固定源码与官方文档；不包含私人设备诊断。[研究]

[公开问题51665](https://github.com/openai/codex/issues/51665)给出MXC launcher枚举卷失败这一类报告；错误发生在哪层应看原始前缀，单凭exit1、无输出或云端／本地标签不能判断。[社区／研究] Microsoft将[Windows错误64](https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes--0-499-)定义为网络名不再可用，与错误65的网络访问拒绝不同；错误号仍不能独自确定根因或授权状态。[一手／研究]

[PR54363](https://github.com/openai/codex/pull/54363)于2026-10-16 01:37（UTC+8）合入[3df96b0](https://github.com/openai/codex/commit/3df96b085c666b33d3775aa4e77219ec1ed828a0)：展开隐式根读取时，过滤无法检查文件系统身份的网络根，保留可检查共享以及包含策略／命令工作目录的根；策略检查与启动使用同一筛选。显式授权不变，根写入与拒绝仍展开到全部执行器卷。[一手：固定补丁] 因而这是特定策略物化路径的修订，不是忽略所有网络盘错误或通用授权绕过。[研究]

截至所核时刻，GitHub latest仍为[rust-v0.163.0](https://github.com/openai/codex/releases/tag/rust-v0.163.0)，其[policy.rs](https://github.com/openai/codex/blob/rust-v0.163.0/codex-rs/mxc-sandbox/src/policy.rs)未含上述过滤；不能因发布时间晚于合并就推定包含修复，也不能承诺升级该版解决。首个包含修复的公开发行版、桌面包与当前执行器的对应需要分别确认；此处未运行任何版本复现。[一手／研究]

**处置选择。** 记录所用执行器身份和非敏感错误类型，按[官方Windows沙箱说明](https://learn.chatgpt.com/docs/windows/windows-sandbox)检查适用条件；有必要且已授权时只做原环境最小无副作用探测，不反复重跑目标写操作。保持既有隔离，等待或采用已确认包含相关修复的受支持版本；仍失败则保留范围，不改驱动／网络安全设置或删除映射来求绿。另一终端成功不能证明原执行器、策略和二进制一致。[研究] 本轮没有运行客户端／沙箱，也未验证该补丁覆盖所有错误64场景或任何具体账号恢复。


## 子Agent配置补研：角色、默认与显式覆盖

核实：2026-10-16（UTC+8）。主线二／M3；改变Codex§3的默认值选择：机械支线的轻量模型与effort要核解析来源，仅换模型可能未降低投入或启动失败。固定发行rust-v0.163.0经tag解析为83086188ae0614bd882818ff1aa23f3194962012；不以本会话工具定义代产品契约。[研究]

**普通新子线程的顺序。** [child_config.rs](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/agent/child_config.rs#L51-L85)先取父回合有效配置，显式spawn逐字段优先于对应agents默认，再应用角色文件；[role.rs](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/agent/role.rs#L182-L201)使角色显式model／effort最终生效。[角色覆盖回归](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/tests/suite/subagent_notifications.rs#L3292-L3332)断言角色覆盖显式spawn。[一手：固定实现／测试定义，未运行] 不把完整历史fork的V1／V2条件推广成所有fork无条件应用角色；上述child_config分支保留例外。[研究]

**两种只换模型不同。** [解析实现](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/agent/child_config.rs#L204-L260)中，spawn或agents选了模型、两者都没给effort时，用选定模型默认effort；[独立解析测试](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/tests/suite/subagent_notifications.rs#L2025-L2064)覆盖这一选择。角色文件只换model则保留此前已解析effort；[model-only反例](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/tests/suite/subagent_notifications.rs#L3375-L3444)将Ultra带给不支持的模型并预期报错，不能称自动降级。[一手]

**设置适用到哪里。** 当前[Developer settings](https://learn.chatgpt.com/docs/developer-settings#agent-configuration)说明App的Codex agent与CLI／IDE共享配置，同页明确Work不读取本地Codex配置；[配置层级](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence)另有用户、profile、受信项目和会话覆盖。[一手] 个人文件不是所有云任务的全局开关，也不证明当前会话已重载。权限边界沿08，模型／effort选择不自动缩小权限，角色名也不是隔离依据；[固定角色权限测试](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/core/src/agent/role_tests.rs#L391-L540)与现有父权限建议一致。[一手／研究]

**采用。** 固定角色同时选有效model和受支持effort；希望临时逐任务覆盖的放在agents默认，不让角色硬值悄悄覆盖临时选择。任务边界、结果核验及返工成本仍决定是否委派，不以小模型标签证明划算。当前仅公开文档、固定源码／测试静读，未运行客户端、模型或这些回归，也未修改任何读者配置；实际加载和目标任务收益需另验。[研究]


## 记忆控制补研：读取、贡献与持久设置分别核

核实：2026-10-16（UTC+8）。主线二／M3；改变Codex页原生记忆试用条件：不把关闭生成当关闭读取，也不假定同名菜单在所有入口只影响当前聊天。原“不默认安装记忆服务”建议不变，不据此升级整页成熟度。[研究]

**读取与贡献独立。** 0.163.0固定83086188的[读取入口](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/ext/memories/src/extension.rs#L45-L73)按features.memories及use_memories决定注入，不以generate_memories为读取条件。[测试定义](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/tui/src/app/tests.rs#L3248-L3290)保留use=true、generate=false，断言当前线程贡献模式disabled。[一手：固定源码／测试，未运行] 因而禁用生成不是无记忆基线，也不是删除现有记忆的操作。[研究]

**文档与固定TUI的范围分歧。** 当前[官方Memories页](https://learn.chatgpt.com/docs/customization/memories#control-local-memories-per-chat)明确将desktop及Codex TUI的/memories称为聊天级、不改变全局；本地默认关闭与Work另用ChatGPT控制的既有边界继续保留。[一手] 但该发行的[slash分派](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/tui/src/chatwidget/slash_dispatch.rs#L486-L488)进入设置菜单，[处理器](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/tui/src/app/config_persistence.rs#L929-L1015)先保存两个值，再在生成选项改变时更新当前线程贡献状态；失败路径区分设置已保存但线程更新失败。[一手]

[配置请求](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/tui/src/config_update.rs#L138-L170)写memories.use_memories／generate_memories并要求重载用户配置；[服务端](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/app-server/src/config_manager_service.rs#L218-L237)将未指定file_path的写入定位到用户配置，[持久化代码](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/app-server/src/config_manager_service.rs#L412-L417)实际写配置文件；[回归](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/tui/src/app/tests.rs#L3205-L3245)读取文件并断言两个值改变。这是固定执行路径依据，不只是UI字符串推断。[一手]

**2026-10-17 补核。** [Developer commands](https://learn.chatgpt.com/docs/developer-commands#configure-memories-with-memories) 对同一 CLI `/memories` 明写设置影响未来会话，Memories 页则明确覆盖 TUI 且称不改全局；两份官方文档自身也未统一作用域，不能只归因于 App／CLI 入口不同。未取得文档与已部署版本映射，采用建议仍是核入口／版本、持久配置与线程状态；本轮只重读官方页面，未重跑客户端或既有源码测试。[一手；研究]

**采用与未解范围。** 只想排除一个聊天时，先核该入口／版本的作用域、持久配置和当前线程状态；部分失败不能当两项均已生效。官方页未给与固定发行的部署映射，保留差异，不宣称源码普遍胜出或所有App都如此。不读取私人记忆、不改设置、不运行客户端／模型／回归；未验证真实会话加载及关闭后的上下文行为，也不把本轮边界检查当记忆收益实验。[研究]

**未采用的扩题。** /goal的[固定runtime](https://github.com/openai/codex/blob/83086188ae0614bd882818ff1aa23f3194962012/codex-rs/ext/goal/src/runtime.rs#L436-L478)依赖live thread与Active状态，但现有正文未承诺停机后仍持续，不再另加同义警告。Skills已有05的宿主／加载／权限边界，本轮未找到新采用错误，不以本轮局部核查授整页L3。[一手／研究]

**2026-10-17 核心选择独立复核。** 通读已发布 `4b1cf7e` 的 Codex 全文及相关入口，对照当前官方[Models](https://learn.chatgpt.com/docs/models)、[Pricing](https://learn.chatgpt.com/docs/pricing)、[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)、[配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[Browser](https://learn.chatgpt.com/docs/browser)、[Cloud](https://learn.chatgpt.com/docs/cloud)、[Import](https://learn.chatgpt.com/docs/import)、[安全评审](https://learn.chatgpt.com/docs/security/security-review)与[扫描计费](https://learn.chatgpt.com/docs/security/faq#billing)。入口／资格、模型投入、有效权限、原生起步与续接选择可独立指导决定，和01／02／03／06／10／15／20及模板的相关建议无核心冲突，支持正文L3。官方记忆文档差异保留并限制采用，未因此承诺部署行为；未全量重核历史链接、运行客户端／审批／恢复实验、核任何账户rollout或证明模型净收益，不是L4。[一手：本轮官方阅读；研究：范围内成熟度]
