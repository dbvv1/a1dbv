# AI 辅助补丁怎样交给开源项目

**🟡 先按项目现行规则确认贡献范围，再决定实现和投稿；测试通过后仍要核当前上游、作者准入与人的责任。** 适合已有真实问题或候选补丁、准备向别人的仓库贡献的开发者。下列入口只做投稿前判断，不替贡献者签协议或承诺后续维护；本仓已有候选核查，完整投稿闭环仍待照做验证。

## 第一步：让 Agent 查清现在该做哪一步

准备目标仓库、issue、已有补丁／分支及实际测试记录；没有补丁也可以开始。在当前工作会话复制下面的任务，替换方括号：

```text
请为 [仓库] 的 [issue／真实问题] 做一次投稿前核查，已有材料是 [路径／分支]。
先只读当前贡献规则、AGENTS、PR／issue 模板及其要求续读的规则；
常见文件不存在时，从 README／文档导航找等价入口，记录实际文件、提交和日期。
规则沉默或访问失败的事项保留未知，不补成“允许”。
查看 issue 的最新状态、关联 PR、讨论与项目要求的准入状态；
对照当前目标分支的差分与源码，按输入、输出和兼容契约判断旧补丁是否已被覆盖；
分清只供某个功能绕过限制的做法、通用修复，以及仍需验证的共存路径。
区分：项目是否接这类贡献、是否允许使用 AI、谁必须亲自写／提交、
CLA／DCO／vouch 等个人步骤、验证要求、后续响应，以及当前工具是否获准发出。
只返回：现在可做的下一步、仍缺的证据／决定、对应原文入口。
先不要创建／重开 issue 或 PR，不签协议，不重新运行已有完整有效的测试。
若下一步可实施，列出受当前变动影响、需要补跑的检查；投稿按已有授权另行执行。
```

**做到这里应能选出一个具体动作：继续实现、补验证、请本人处理准入、按项目入口讨论，或收起已被上游覆盖的补丁。** “贡献规则看过了”不是结果；说明卡在哪条规则、谁能解除即可，不新造一份治理台账。

## 准入、AI 使用和投稿主体分开核

| 项目当前规则 | 读者该怎么做 |
|---|---|
| **Codex**：接受 issue 中的问题复现、根因与设计讨论，不接受外部代码贡献或 PR | 先找已有报告，只补新的诊断证据；不要把修复实现当作投稿入口。完整的本地测试也不会改变这项准入规则 |
| **Goose**：外部 PR 要实现项目看板上已到 `Ready` 的 issue；允许 AI 辅助代码，但 issue 要贡献者自己写 | 先参与问题与设计讨论，再按定下的验证计划实现。没有 `Ready` 时不为投稿先堆补丁；本地探索另按其例外处理。看板状态与 issue 的 open／closed、labels 分开查 |
| **Serena**：小修可直接提 PR；AI 辅助贡献须认真审查或实际测试；CLA 覆盖整个仓库，包括 SolidLSP | 实际小修可以先完成技术准备，协议交本人审阅决定。`license/cla` 是合并条件，不把“尚未签署”误写成 GitHub 不能创建 PR |
| **Ghostty**：提交 PR 前须获 vouch，AI 使用须披露工具与参与程度；Vouch Request 须本人写 | 先查自己的准入状态，再按该请求模板由本人表达；普通讨论允许什么，不能代替 Vouch Request 的专门规则 |
| **Linux**：移除了强制 `Assisted-by` 标签，仍保留提交者责任与透明说明；AI 不加 `Signed-off-by` | 不替人做 DCO 声明。按其 AI 查找并修复 bug 流程准备材料，交报告者审阅与发送，不从“取消标签”推出“无需披露／可自动代投” |

**Codex 依据**：[固定贡献规则](https://github.com/openai/codex/blob/67f0994b532b8740f14b5b738af7b7b2a915b1d6/docs/contributing.md)；本仓据此把 [MCP schema 问题](../../experiments/codex-mcp-schema/README.md)收窄为原包诊断，没有准备外部修复投稿。核实与诊断：2026-10-31。

**准入按项目规则，不额外设置通用预审批。** issue 的 bot 标签不等于实现获准；项目允许小修直投时，也不必等维护者逐项批准。**项目要求本人写的材料，就由本人写。** Agent 可在允许范围内收集复现、源码位置和测试结果；不能把生成稿换个署名当成本人完成。项目未要求统一披露标签时，按它实际需要的方式说明工具怎样参与，不自行套用别的项目政策。

**依据**：[Goose 固定贡献规则](https://github.com/aaif-goose/goose/blob/6ec4e9a2abc0fdb13f8af2676ceaf848a1df716f/CONTRIBUTING.md)及[探索例外](https://github.com/aaif-goose/goose/blob/6ec4e9a2abc0fdb13f8af2676ceaf848a1df716f/AGENTS.md#contribution-workflow)；[Serena 固定贡献规则](https://github.com/oraios/serena/blob/ede329aaf0c824bea75455a2926f01420d7aa620/CONTRIBUTING.md)。[Ghostty 固定贡献规则](https://github.com/ghostty-org/ghostty/blob/fbed180a5f181915c92a8f2f561903a6e4645b5a/CONTRIBUTING.md#first-time-contributors)与[AI 政策](https://github.com/ghostty-org/ghostty/blob/fbed180a5f181915c92a8f2f561903a6e4645b5a/AI_POLICY.md)；Linux 的[规则修订](https://github.com/torvalds/linux/commit/1e035297ffdadf2184c3c773b8c098e372324aaf)、[生成内容要求](https://github.com/torvalds/linux/blob/1e035297ffdadf2184c3c773b8c098e372324aaf/Documentation/process/generated-content.rst)和[助手提交流程](https://github.com/torvalds/linux/blob/1e035297ffdadf2184c3c773b8c098e372324aaf/Documentation/process/coding-assistants.rst)。上述为项目规则，不是政策效果比较；核实 2026-10-30。

## 有旧补丁时：先核上游，再决定续做

**查清关闭原因，再按输入、输出和兼容契约核“是否覆盖”。** issue 颜色或是否改了同一文件都不够。 已合入的实现解决了同一行为，就收起重复部分；它若只为某个功能绕过限制，则保留通用路径的独立缺口，先核两种做法怎样共存。关联 PR 尚未合并时，先协调重叠和剩余差量，不把提案当成已修复或排他占用。更新旧分支时，文本冲突与行为冲突分开查，补跨功能回归；干净合并也不能证明旧契约仍成立。

本仓 Goose LiteLLM 候选原来缺的是：给代理别名补视觉能力，并在请求格式化前生效、保留显式布尔配置。10 月 30 日核到上游 [#13239](https://github.com/aaif-goose/goose/pull/13239) 已合入相应实现，因而停止重投旧修复，保留历史补丁与回归结果。当前分支已修与用户安装的 release 已修要分别核；旧测试也只对应当时的候选。

**依据**：[原问题 #13158](https://github.com/aaif-goose/goose/issues/13158)、[固定合入差量](https://github.com/aaif-goose/goose/commit/f131ff7e9bba223686b1d5e2243d6c1e07685097)、[本仓旧候选](../../experiments/candidate-reset-recovery/README.md)；Goose 来源及实现核对 2026-10-30，未运行当前 Goose。

**Qwen 已发行重名恢复，只续查剩余诊断差量。** #15757 已于 2026-10-31 合入并关闭 #15741，正式版 v0.26.6 于 2026-11-02 发布且包含该实现；不用再等它合并。它跨页统计工具名、丢弃整个重名组并保留唯一工具，所以旧 `create/create/inspect` 夹具现在应留下 `inspect`，不能继续预期重名转换抛错。原 14 项回归中依赖该夹具的 6 项预期已过时，其余 8 项也须在修订候选上补验。v0.26.6 源码的外层工具发现失败仍只返回空结果；没有其他能力且未发生可见性过滤时，调用方仍报通用空服务器错误。续做时保留已合分页／重名策略，用确实仍失败的非重名路径验证原因保留。发行与源码核查不等于当前客户端实测，旧基线的 409 项通过不能搬作新版结果；原 Unix socket 拒绝仍未解除。

**依据**：[Qwen #15757](https://github.com/QwenLM/qwen-code/pull/15757)、[v0.26.6 发布记录](https://github.com/QwenLM/qwen-code/releases/tag/v0.26.6)、[该版本固定源码](https://github.com/QwenLM/qwen-code/blob/042c023b7beb4ad2a9ef95b2906b3564e3f23089/packages/core/src/tools/mcp-client.ts)、[旧候选测试](../../experiments/candidate-reset-recovery/qwen/change.patch)；合入、发行与测试预期静态核查 2026-11-06，未运行新版 Qwen。[原读者核查与纠正](../collaboration/local-jobs/artifacts/A-UPSTREAM-QWEN-GATE-READER-20261031/result.md)仅对应 2026-10-31；本机附页／新读者隔离尚未独立证实，修改后照做验收仍待，页面保持 🟡。

**Datasette：列统计的内联方案没有替代服务端参数类型。** 已合入的 #3038 把参数写成 SQL 字面量，供列统计查询使用；#3015 的 `_typed_params=1`／`::int` 则是服务端绑定提案，仍为 draft。读者核对两者后发现，不能因改了同一段代码就收起旧提案：应沿原 PR 更新当前上游，并保留 `named_parameter_values` 按 SQL 基名键控的模板契约，另处理 typed 表单回填。对已发布分支，当前任务只授权快进，就合并上游后补交，不用 rebase／强推改写历史。列统计与 typed 查询的共存回归、设计取舍和该提交的 CI 仍须分别解决。

**依据**：[Datasette #3038](https://github.com/simonw/datasette/pull/3038)、[#3015](https://github.com/simonw/datasette/pull/3015)、[固定模板契约](https://github.com/simonw/datasette/blob/3cb0f1b/docs/template_context.rst)、[订正后的读者结论](../collaboration/local-jobs/artifacts/A-UPSTREAM-DATASETTE-DELTA-READER-20261107/result.md)；读者观察 2026-11-07，接收复核至 2026-11-08。已收判断与页面卡点，读者隔离未独立证实，修页后照做仍待；没有运行新组合或代替上游 CI，页面及地图保持 🟡。

## 条件满足后：交可审结果，继续负责回应

**沿项目现成模板提交一个明确变化，写问题、关键取舍、实际验证和剩余风险。** 自己能解释改动为何成立、哪里仍没验；保留复现、检查命令和版本入口，把长日志留作按需材料。代码、测试与运行配置变了，就重验受影响路径。如何核真实消费者见[验证页](verification.md)。

**先处理实际退回原因。** Goose [#11322](https://github.com/aaif-goose/goose/pull/11322) 曾因缺 Ready issue 被关闭，作者补建 issue 后该 PR 后来重开并合并；Ghostty [#14946](https://github.com/ghostty-org/ghostty/pull/14946#issuecomment-6515068151) 则被 bot 明确以未获 vouch 关闭。前者不是永久拒收，后者不是代码质量结论；都不靠多跑一次测试解除。

投稿后读维护者的具体反馈；先核事实再修或简短解释，不让 Agent 自动把每条意见都改进代码。有人审、有人合并、后续有人维护是不同结果：接到 PR 只是开始，自己或明确接手的人仍须能说明与修复。

**依据**：[Goose 关闭理由](https://github.com/aaif-goose/goose/pull/11322#issuecomment-5346816362)、[作者补充](https://github.com/aaif-goose/goose/pull/11322#issuecomment-5352803414)及 PR 的重开／合入记录（事件 2026-08）；[Windows 安装器维护承诺](https://github.com/aaif-goose/goose/issues/11987#issuecomment-6029897376)、[贡献者接受](https://github.com/aaif-goose/goose/issues/11987#issuecomment-6030015023)及[合入 PR](https://github.com/aaif-goose/goose/pull/12869)（事件 2026-10）。核读 2026-10-30；仅确认准入与接收决定，合并后的维护成效未核。

**工具拒绝与项目准入分开处理。** `403` 先读响应和已知权限范围；结果未知先查远端，明确拒绝不换账号或通道绕过。项目允许投稿也不赋予工具写权限；技术检查失败则修技术问题，不用新 PR 或减少检查掩盖。被挡住只停相应动作，可继续准备允许的只读材料。

本仓 `agents-md-lint` 的实际尝试中，已审补丁成功发布到自己的公开 fork，回读确认父提交、完整文件树与既有 Linux 验证对应；创建上游 Draft PR 却返回 `403 Resource not accessible by integration`，随后查询确认没有 PR。这是**“补丁已保全、投稿未发出”**，不是维护者拒收，也不是测试失败。该精确 head 的 workflow run、check run 都为 0；上游工作流只由 `main` 推送、PR 或手动触发，因此不能把空检查列表当成“CI 正在跑”，也不靠补跑 Linux 测试解除投稿权限。macOS、Windows 和 hosted 矩阵仍未验；完整投稿闭环仍待验证。

**实测依据**：[fork 固定提交与五文件差量](https://github.com/dbvv1/agents-md-lint/commit/54313ea9007f22b582991d9023a75c282b5606cf)、[原补丁与 Linux 结果](../../experiments/instruction-file-lint/README.md)、[上游 CI 触发条件](https://github.com/openintelligence-labs/agents-md-lint/blob/9f852cf5b970cd9f283a61ef4ae6308cb4aeb047/.github/workflows/ci.yml)。拒绝响应、PR 查询及精确 head 检查为本次执行观察，核实于 2026-11-01 18:05 UTC。

## 何时不走这条路线

**项目明确不接这类贡献、已有同等修复，或没人愿意理解与承担后续时，就不要把更多生成代码塞进评审队列。** 已有产品任务则先交自己的可用结果；内部团队推广另看 [18 团队落地](../18-team-adoption.md)，这里不制定组织政策，也不保证贡献一定获准或合并。
