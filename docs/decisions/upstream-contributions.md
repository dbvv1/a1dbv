# AI 辅助补丁怎样交给开源项目

**🟡 先按项目现行规则确认贡献范围，再决定实现和投稿；测试通过后仍要核当前上游、作者准入与人的责任。** 适合已有真实问题或候选补丁、准备向别人的仓库贡献的开发者。下列入口只做投稿前判断，不替贡献者签协议或承诺后续维护；本仓已有候选核查，完整投稿闭环仍待照做验证。

## 第一步：让 Agent 查清现在该做哪一步

准备目标仓库、issue、已有补丁／分支及实际测试记录；没有补丁也可以开始。在当前工作会话复制下面的任务，替换方括号：

```text
请为 [仓库] 的 [issue／真实问题] 做一次投稿前核查，已有材料是 [路径／分支]。
先只读当前 CONTRIBUTING、AGENTS、PR／issue 模板及其要求续读的规则，
记录所读提交和日期；规则沉默或访问失败的事项保留未知，不补成“允许”。
查看 issue 的最新状态、关联 PR、讨论与项目要求的准入状态；
对照当前目标分支的相关源码，判断旧补丁是否已被覆盖或还剩独立缺口。
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
| **Goose**：外部 PR 要实现项目看板上已到 `Ready` 的 issue；允许 AI 辅助代码，但 issue 要贡献者自己写 | 先参与问题与设计讨论，再按定下的验证计划实现。没有 `Ready` 时不为投稿先堆补丁；本地探索另按其例外处理。看板状态与 issue 的 open／closed、labels 分开查 |
| **Serena**：小修可直接提 PR；AI 辅助贡献须认真审查或实际测试；CLA 覆盖整个仓库，包括 SolidLSP | 实际小修可以先完成技术准备，协议交本人审阅决定。`license/cla` 是合并条件，不把“尚未签署”误写成 GitHub 不能创建 PR |
| **Ghostty**：提交 PR 前须获 vouch，AI 使用须披露工具与参与程度；Vouch Request 须本人写 | 先查自己的准入状态，再按该请求模板由本人表达；普通讨论允许什么，不能代替 Vouch Request 的专门规则 |
| **Linux**：移除了强制 `Assisted-by` 标签，仍保留提交者责任与透明说明；AI 不加 `Signed-off-by` | 不替人做 DCO 声明。按其 AI 查找并修复 bug 流程准备材料，交报告者审阅与发送，不从“取消标签”推出“无需披露／可自动代投” |

**准入按项目规则，不额外设置通用预审批。** issue 的 bot 标签不等于实现获准；项目允许小修直投时，也不必等维护者逐项批准。**项目要求本人写的材料，就由本人写。** Agent 可在允许范围内收集复现、源码位置和测试结果；不能把生成稿换个署名当成本人完成。项目未要求统一披露标签时，按它实际需要的方式说明工具怎样参与，不自行套用别的项目政策。

**依据**：[Goose 固定贡献规则](https://github.com/aaif-goose/goose/blob/6ec4e9a2abc0fdb13f8af2676ceaf848a1df716f/CONTRIBUTING.md)及[探索例外](https://github.com/aaif-goose/goose/blob/6ec4e9a2abc0fdb13f8af2676ceaf848a1df716f/AGENTS.md#contribution-workflow)；[Serena 固定贡献规则](https://github.com/oraios/serena/blob/ede329aaf0c824bea75455a2926f01420d7aa620/CONTRIBUTING.md)。[Ghostty 固定贡献规则](https://github.com/ghostty-org/ghostty/blob/fbed180a5f181915c92a8f2f561903a6e4645b5a/CONTRIBUTING.md#first-time-contributors)与[AI 政策](https://github.com/ghostty-org/ghostty/blob/fbed180a5f181915c92a8f2f561903a6e4645b5a/AI_POLICY.md)；Linux 的[规则修订](https://github.com/torvalds/linux/commit/1e035297ffdadf2184c3c773b8c098e372324aaf)、[生成内容要求](https://github.com/torvalds/linux/blob/1e035297ffdadf2184c3c773b8c098e372324aaf/Documentation/process/generated-content.rst)和[助手提交流程](https://github.com/torvalds/linux/blob/1e035297ffdadf2184c3c773b8c098e372324aaf/Documentation/process/coding-assistants.rst)。上述为项目规则，不是政策效果比较；核实 2026-10-30。

## 有旧补丁时：先核上游，再决定续做

**查关闭原因和关联实现，不只看 issue 颜色。** 已合并的实现覆盖了同一行为，就收起重复实现；关联 PR 尚未合并时，分清它拟覆盖与明确不覆盖的行为，避免重复实现，先就重叠和剩余差量协调。仍有独立失败路径时按项目要求推进，不把开放 PR 当成已修复，也不当成排他占用。标题相似、issue 关闭或搜索没结果，都不能单独证明代码已经修好。

本仓 Goose LiteLLM 候选原来缺的是：给代理别名补视觉能力，并在请求格式化前生效、保留显式布尔配置。10 月 30 日核到上游 [#13239](https://github.com/aaif-goose/goose/pull/13239) 已合入相应实现，因而停止重投旧修复，保留历史补丁与回归结果。当前分支已修与用户安装的 release 已修要分别核；旧测试也只对应当时的候选。

**依据**：[原问题 #13158](https://github.com/aaif-goose/goose/issues/13158)、[固定合入差量](https://github.com/aaif-goose/goose/commit/f131ff7e9bba223686b1d5e2243d6c1e07685097)、[本仓旧候选](../../experiments/candidate-reset-recovery/README.md)；Goose 来源及实现核对 2026-10-30，未运行当前 Goose。开放 PR 的部分覆盖见 [Qwen #15757](https://github.com/QwenLM/qwen-code/pull/15757)及[读者核查与纠正](../collaboration/local-jobs/artifacts/A-UPSTREAM-QWEN-GATE-READER-20261031/result.md)（2026-10-31）；本机附页／新读者隔离尚未独立证实，修改后照做验收仍待。

## 条件满足后：交可审结果，继续负责回应

**沿项目现成模板提交一个明确变化，写问题、关键取舍、实际验证和剩余风险。** 自己能解释改动为何成立、哪里仍没验；保留复现、检查命令和版本入口，把长日志留作按需材料。代码、测试与运行配置变了，就重验受影响路径。如何核真实消费者见[验证页](verification.md)。

**先处理实际退回原因。** Goose [#11322](https://github.com/aaif-goose/goose/pull/11322) 曾因缺 Ready issue 被关闭，作者补建 issue 后该 PR 后来重开并合并；Ghostty [#14946](https://github.com/ghostty-org/ghostty/pull/14946#issuecomment-6515068151) 则被 bot 明确以未获 vouch 关闭。前者不是永久拒收，后者不是代码质量结论；都不靠多跑一次测试解除。

投稿后读维护者的具体反馈；先核事实再修或简短解释，不让 Agent 自动把每条意见都改进代码。有人审、有人合并、后续有人维护是不同结果：接到 PR 只是开始，自己或明确接手的人仍须能说明与修复。

**依据**：[Goose 关闭理由](https://github.com/aaif-goose/goose/pull/11322#issuecomment-5346816362)、[作者补充](https://github.com/aaif-goose/goose/pull/11322#issuecomment-5352803414)及 PR 的重开／合入记录（事件 2026-08）；[Windows 安装器维护承诺](https://github.com/aaif-goose/goose/issues/11987#issuecomment-6029897376)、[贡献者接受](https://github.com/aaif-goose/goose/issues/11987#issuecomment-6030015023)及[合入 PR](https://github.com/aaif-goose/goose/pull/12869)（事件 2026-10）。核读 2026-10-30；仅确认准入与接收决定，合并后的维护成效未核。

**工具拒绝与项目准入分开处理。** `403` 先读响应和已知权限范围；结果未知先查远端，明确拒绝不换账号或通道绕过。项目允许投稿也不赋予工具写权限；技术检查失败则修技术问题，不用新 PR 或减少检查掩盖。被挡住只停相应动作，可继续准备允许的只读材料。

## 何时不走这条路线

**项目明确不接这类贡献、已有同等修复，或没人愿意理解与承担后续时，就不要把更多生成代码塞进评审队列。** 已有产品任务则先交自己的可用结果；内部团队推广另看 [18 团队落地](../18-team-adoption.md)，这里不制定组织政策，也不保证贡献一定获准或合并。
