主线：二，额外能力何时值得加；三，连续修改仍然可靠
改变的建议：按不可猜的契约与可观察偏好选择短规格、测试或样品；只为会改变实现的未知事实定向研究；按原需求验收并允许实现反馈推翻计划。额外评审按具体漏审风险试用，重复意见或处理负担过高时收窄／撤回；先确认真实入口、计费和成功报告，再考虑 CI 门槛。[研究]
证据摘要：GIF 优化器原任务与固定实现、Anthropic 原型与评价反例、BAML 同起点双 PR、Superpowers 固定交接配置、Crossplane 选择性采纳与降强度记录，另有评审论文、Faros 指标核对及 10-14 官方评审入口／失败契约、SO 调查分母、模型客户引言、Cursor 当前计费、GitClear 公开图页的指标口径，以及 Intercom 原文、第三方集成固定来源与配置诊断／插件评估范围补核。来源分别是固定产物、参与者自报及研究；未证明完整流程或额外 reviewer 的净收益。[一手／社区／研究]

# 实现决策与评审：让原需求和运行反馈纠正计划

## BAML：实现反馈纠正研究计划
> 整合归属：本文来自对端固定提交 `cdfe3b50be30579469af21b9fe46f62bfe7d786c`，保留其当轮来源阅读、判断与执行记录。下文“本轮”“独立”等指对端原研究，不是本侧整合时重新执行；本侧未复跑浏览器、BAML 或模型，也未独立取得 BAML 上游 Git 对象证明同父关系。

> 核实：2026-10-12（北京时间）。对象为 2025 年 Claude Code 历史案例，不是当前 Codex/Astra 或 Claude 的效果测试。评级：✅ 借鉴“围绕实现决策调查并继续核验”；🧪 按明确不确定性选择前置研究；不据此默认采用完整 RPI。新增工作是直接读取原始问题、两个计划、两条 PR、固定补丁和测试入口，以及重审作者前后文章。未运行 BAML、模型或视频会话。

### BAML：实现反馈纠正研究计划 · 1. 先把作者故事拆成可核对的主张

HumanLayer 的《Getting AI to Work in Complex Codebases》报告：作者尝试修复 BAML #1252，首次研究错误地判定 bug 无效；他丢弃后重新指导研究，又分别运行无研究计划和使用研究结果的计划，提交 #2258 与 #2259。后者被维护者接受，前者关闭。作者认为两者都能解决问题，但有研究方案选择了更好的位置和测试方式。**[社区：S1 作者自述]**

这包含四种不同主张：事情确实发生；补丁有什么差异；差异来自研究；研究值得付出的时间。前两项可通过公共产物交叉核对，后两项需要更多过程与成本数据。不能从“一个合并、一个关闭”直接跳到后两项。

### BAML：实现反馈纠正研究计划 · 2. 独立核对到的同任务差异

原始 [Issue #1252](https://github.com/BoundaryML/baml/issues/1252) 要求：测试中误用单 `@assert` 应报 linter 错误。公开回复给出单 `@` 测试悄悄通过、双 `@@` 才执行预期断言的示例；本轮读正文与代码片段，未运行示例或查看截图内容。**[社区：原始报告]**

本轮获取 Git 对象并核对：两条最初实现提交拥有完全相同的父提交 `63f45d4b34b4682b297e024e5ac96b15030a2fcf`，比只比较两张 PR 截图更能控制代码起点。**[一手：Git 对象]**

| 项目 | 无研究路线 #2258 | 使用研究路线 #2259 |
|---|---|---|
| 最初实现 | `2c36444bc62115594f65c7fb0350eb6b8e1810cb` | `86029cc4dfd0ca081d3751d11b11e12a5b9d81b0` |
| 实际修改位置 | parser-database 的 `visit_test_case` | baml-core 的 test validator |
| 范围 | 拒绝 `assert/check`，并额外拒绝 `description/alias/skip` | 只拒绝测试字段上的 `assert/check` |
| 验证实现增量 | 38 行 | 18 行，含 import |
| 新测试 | 两个 `.baml` 诊断样例 | 两个 `.baml` 诊断样例 |
| 公共结果 | 维护者写“closing in favor of #2259”，关闭 | 维护者表示预计当晚发布；页面与 Git 显示已合并 |

表格来自两份完整实现 diff 和公开讨论 **[一手]**。行数仅帮助定位差异，不是维护性评分。两条路线都没有修改语法定义，不能把前者简单称为“错误地修改 parser grammar”。基线的 `visit_test_case` 已包含重复 property、非法参数等校验，因此“只要在 parser-database 校验就违背架构”也不成立。

我的判断是：#2259 集中在已有测试约束验证位置，并避免额外禁止其他属性，修改范围更贴近原问题；这为偏好该方案提供了可见理由。但公开维护者评论没有写出完整比较论证，不能把我的判断归给维护者，更不能声称另一方案不能工作。**[研究：源码比较]**

合并提交为 `f741e4319b4f95657a08e46f4404d258a1d91e5a`；相对其父提交，最终改动是三个文件、58 行。初始提交还带两份调查/计划文档，后续专门移除。独立比较确认三个实现/测试文件从 `86029cc` 到合并提交未变化。**[一手：Git diff]** 研究有价值不等于研究文档必须成为目标项目的永久内容；本案例只证明发生了移除，没有证据说明维护者要求移除。

### BAML：实现反馈纠正研究计划 · 3. 最重要的新发现：有研究的计划也在实施中被纠正

公开演示仓库保存的原始计划，把断言样例写在 `args` 内部的 `input/count` 键值上。PR 最初提交里的回填计划则明确写道：原计划假设测试参数能带字段属性，但它们是键值对；应检查的是测试块的 `functions`、`args` 字段。最终两个测试也确实分别把属性放在 `functions` 后、`args` 块后。**[一手：S2 原计划、S3 回填计划与最终测试]**

因此本例不是“正确研究 → 正确计划 → 忠实执行 → 成功”。更接近：

**作者纠正第一次研究（作者自述） → 研究帮助选定位置 → 实施中修正测试设计（有文档差异） → 维护者接收（有 PR 和 Git）。**

原计划示例还使用了 `attr.name()` 等写法，最终代码用 `attr.name.name()`；这显示示例在实现时适配了实际 API，不应把计划里的代码块当成已编译代码。这里不推测究竟哪次工具调用或哪位参与者完成纠正，因为未读取完整会话。

这改变了可迁移建议：**研究产物应保留“为什么选这个位置”和未决假设，但允许实现反馈推翻局部方案。** 如果把“严格按计划”作为主要验收，反而可能保留计划中的错误。也不能由此推断研究无用；位置选择与局部纠错可以同时成立。**[研究：采用判断]**

### BAML：实现反馈纠正研究计划 · 4. 自动评审和测试记录能证明多少

两个 PR 的 Ellipsis 自动评审都写了 “Looks good to me”。这说明那两次可见评审没有公开否定任一路线；不代表评审毫无作用，也不能证明它们发现了维护者取舍的原因。自动评审的耗时与阅读行数更不能当作开发速度比较。**[一手：公开机器人回执；研究：解释边界]**

独立读合并版本的 `build.rs` 和 `validation_tests.rs` 后，可确认普通构建路径会递归生成验证测试；末尾注释被当作预期诊断，与实际诊断比较。设置 `UPDATE_EXPECT=1` 会改写预期，并返回而不走最后的失败分支。故更新快照是准备步骤，随后普通模式的检查才检验保存的预期。两份实际新增测试使用同一框架，不能把“有研究才采用仓库测试约定”概括得过强。**[一手：测试源码；未执行]**

回填计划的复选框、PR 中“全测通过”都是当时报告，不是本轮测试结果；其中命令文本也不能作为执行日志。页面另外显示 Codecov 报告 patch coverage 23.07692%，但没有核对覆盖收集方式，不能据此声称新增测试未运行或修复失败。

### BAML：实现反馈纠正研究计划 · 5. 这个对照仍然不能回答什么

共享基线是优点，但它不是随机对照：

- “无研究”计划自身也包含代码位置和当前行为分析，不是完全没读源码。比较的是有无单独研究产物及相应过程，不是思考与不思考。
- 作者先前调查、额外指导、执行顺序、模型采样及预算可能同时影响结果；没有完整会话就不能排除。
- 一次偏好选择不等于成功率差异；只有一个合并也不等于另一个失败。
- 没有可复算的人类主动时间、所有尝试成本、修复后的使用与维护记录，不能报告提效倍数或长期质量。
- 这是小范围历史 bug，不可推导“300k 行仓库中所有复杂任务都适用”，也不说明当前强模型仍需要同样阶段。

因此，“研究可能帮助定位正确的变更层次”有具体支撑；“RPI 比直接使用强 Agent 更快、更可维护”仍未得到证明。**[研究：证据取舍]**

### BAML：实现反馈纠正研究计划 · 6. 重读作者的后来复盘：哪里值得借，哪里不能跟随

《Why Software Factories Fail》自述团队从 2025 年 7 月减少读代码，之后遇到难解问题并重写。早期 ACE 本身也强调人的深入参与、读测试、纠正研究和保持团队理解。因此不能把两篇文章压缩成“作者早期完全不要人，后来发现需要人”，更不能把 BAML 外部贡献等同于团队后来重写的系统。**[社区：S1/S4；研究：叙事校准]**

后来文章提出：测试型奖励没有充分惩罚坏设计，维护性反馈慢，因此模型无法学会，更多评审也无法提高上限。前半段提出了值得调查的测量缺口；后半段跨越了尚未证明的因果链：

1. 公开 benchmark 的评分不能代表闭源模型的全部训练信号；作者也承认 benchmark 不等于训练验证器。
2. 没有直接的长期奖励，不等于无法从代码、设计解释、偏好反馈或推理中学到部分设计能力。
3. 难以一次生成，不等于换输入、搜索或评审后无法识别更好的方案。
4. 一次团队重写无法隔离模型能力、需求变化、团队熟悉度、任务选择和过程的影响。

这些是逻辑边界，不是证明模型已经解决长期维护性。合理结论是“不用单题分数替代长期质量证据”，而非“harness 不可能改善这个问题”。**[研究：推理审查]**

本轮新读其配套《Where does the time go》：50%/10% 返工几率、最初十分钟消除 80% 痛苦，出现在明确的假设示例中；把“全部手写”设为零返工也只是模型假设，真实人工代码同样可能返工。文中把概率与损失程度混在百分比里，也不能当成可复算指标。**[一手：S5 原文；研究：统计口径]**

“30 分钟计划省几小时审查”“稳定快 2–3 倍”可作为作者倡议，当前资料不足以成为我们的效果承诺。要研究的是新增前置工作是否减少了更昂贵的后续错误，而非先固定时长或固定四阶段。

### BAML：实现反馈纠正研究计划 · 7. 对仓库方向的实际修正

研究以开发决策为单位：未知事实会改变实现位置、兼容边界或验收时才定向调查；只能通过运行回答时，短实现或探针可能比长报告更有信息价值，不另设审批关口。代码结构难改与人不理解系统是不同缺口，不能统一归为“技术债”后都加前置设计。**[经验：限定采用]**

本例已形成公开产物链，但没有发布后维护轨迹；同父关系、合并和计划纠错仍不能升级成长期收益证明。

### BAML：实现反馈纠正研究计划 · 来源与复核范围

- **S1**：[ACE 固定原文](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/ace-fca.md)。本轮重点读案例全过程、失败、人的参与和 mental alignment。
- **S2**：[演示产物目录](https://github.com/ai-that-works/ai-that-works/tree/738a9c18b0302737d5d354d9988f34482966cce6/2025-08-05-advanced-context-engineering-for-coding-agents/thoughts/shared)。完整读一个研究文件及有/无研究两个计划；不是完整会话。
- **S3**：[无研究提交](https://github.com/BoundaryML/baml/commit/2c36444bc62115594f65c7fb0350eb6b8e1810cb)、[有研究提交](https://github.com/BoundaryML/baml/commit/86029cc4dfd0ca081d3751d11b11e12a5b9d81b0)、[最终合并](https://github.com/BoundaryML/baml/commit/f741e4319b4f95657a08e46f4404d258a1d91e5a)、[PR 2258](https://github.com/BoundaryML/baml/pull/2258)、[PR 2259](https://github.com/BoundaryML/baml/pull/2259)。核对 Git 父关系、完整补丁、回填计划、相关基线源码、测试生成与执行源码及可见讨论；未运行 BAML/CI。
- **S4**：[WSFF 固定原文](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/wsff.md)。本轮读团队复盘、训练论证、评估与四阶段建议；作者披露经营相关协作工具公司，利益关系提示取样问题，不自动否定内容。
- **S5**：[Where does the time go](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/1a9b65e53bcf2052b7ef1778fbcfe2af65858a1e/side-quests/where-does-the-time-go.md)，本轮完整读取。
- 本轮尝试读取 OpenAI harness engineering、StrongDM 工厂、Faros 报告原页，均被网络代理拒绝；它们在 S4 中的转述没有升级为本轮已读一手资料。GitHub API 和 PR `.diff` 入口亦受限，改用公开 HTML、raw 文件与 Git 对象取得上述材料，没有绕过权限或执行外部工作流。

## 后续任务：相同 brief 与过期接口
核实：2026-10-13（UTC+8）。本轮读取 GitHub 原帖、评论、固定源码与作者实验材料；未运行上游代码或模型。

### 后续任务：相同 brief 与过期接口 · 可以改变的建议

✅ 复用原请求、现有验收或已确认规格作为判据，不只把同一份计划摘要交给实现者和评审者。接口或行为约束改变时，让受影响的剩余任务失效并更新后再派发。简单任务已有充分检查时，不另写 spec、不增 reviewer；独立会话并不等于独立判据。**[研究：采用判断]**

### 后续任务：相同 brief 与过期接口 · 原帖与固定实现

[#2470](https://github.com/obra/superpowers/issues/2470) 报告计划内代码、测试共用错误模型：新用途 JWT 被旧登录验证器接受、字符串前缀检查与实际 URL 解析不一致等。它指向未改代码接缝和反例不足；作者的约 40 个 probe 成功报告没有公开应用补丁／日志，未独立复现。[#2450](https://github.com/obra/superpowers/issues/2450) 则报告正确修复收紧 CLI 调用后，后续计划仍用旧接口；作者说 scoped 与 final review 最终发现，问题是发现太晚，不是所有评审都漏掉。**[社区：作者原帖]**

核实时两 issue 均 open，评论和 timeline 为空；按 issue 号搜提交无结果。只能说所查入口未见维护者回应或直接关联修复，不能证明没有其他相关改进。下述八九月提交早于两个十月 issue，不是它们的响应。**[一手：GitHub 状态；检索边界]**

主分支固定 `bb92a77741419a4ab5f06e711a283343f1ada0c3`；dev 为 `d079e1b85c8f964cb52da5e2be678c9fdfc8759b`，二者 tree 均为 `4ac675daa3415bc836f707c7e60237ac7b66c7d5`。相关机制如下。**[一手：Git 元数据与源码]**

- [SDD setup](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L155-L181) 已要求读 spec、按其裁决计划冲突；[task reviewer](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/task-reviewer-prompt.md) 可报 plan-mandated 缺陷，也可按具体风险查 diff 外代码、运行 focused test。因此不能概括为“只能服从计划”或“禁止独立验证”。
- reviewer 与 implementer 明确共用同一 brief；[task-brief](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/scripts/task-brief#L30-L36) 仅抽取计划的 Task 文本。SDD dispatch 另要求带先前接口决策，故存在补交信息通路，但依赖 controller 正确使用。
- [fix loop](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L354-L443) 未在接口变化后明确要求刷新剩余计划和已生成未派发 brief；这是流程缺口，不是实际 agent 必然漏做的证明。
- [inline final review](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/executing-plans/SKILL.md#L234-L268) 明确传 plan、spec、Review Focus；[SDD final review](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L445-L468) 明确 diff 和 deferred/parked ledger，却无相同输入列表。只据评审数量不能推断覆盖面。
- [brainstorming](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/SKILL.md) 已要求区分用户选择与 agent 自定并让用户确认描述；但 [builder check](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/builder-check-prompt.md) 只拿设计文档，检查能否规划，不直接对照原请求。其通过不能证明设计忠实于用户原意。

### 后续任务：相同 brief 与过期接口 · #2086：小补丁支持什么，实验不能证明什么

已合并 [PR #2086](https://github.com/obra/superpowers/pull/2086) 的[固定补丁](https://github.com/obra/superpowers/commit/538d65120be78ad147fc82ea392da2ed0edc4cdc)仅两文件 +7/-1：plan header 加 Spec 路径，执行端读取。作者报告同一六任务、五项合成冲突中，无 spec 解决 0–1/5，spec-present stock 三次为 4/5、5/5、4/5。它是作者历史实验报告，不是五个独立项目或本轮运行。**[一手：补丁及合并状态；社区：作者实验报告]**

本轮独立读取研究仓库固定 `6e6f33ff0e6a724c6568c5d9252d001a15559b0b` 的材料后，结论需收窄。**[研究：实验设计与夹具阅读]**

1. **文件与权威确认混在一起。** [spec 组 story](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/story.md) 不仅增加文件，开场还点名它，模拟用户遇冲突会明确回复 spec 有权威性。[作者日志 L342–380](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/logs/2026-08-03-plan-decomposition-campaign.md#L342-L380) 明言 stock control 检出五项后，靠该答复才继续裁决；[无 spec 组](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-consistency/story.md) 没有此答复。可支持上位判据可达且权威明确，不能隔离成文件自身净效应。
2. **不同不自动等于错。** [答案表](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/seeded-truth-ledger.md) 中不同组件 timeout、命名或入口 priority 下限，在真实系统可能有意不同；[新增 spec](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/fixtures/docs/superpowers/specs/job-queue-spec.md) 明确要求统一后才可判违规。0–1/5 不是一般漏洞漏检率。
3. **公开叙述日志不等于原轨迹。** PR 称 raw records public；本轮取得日志、报告和合成 fixture，未在未截断的递归 tree 中定位 cp-x10 各 rep 原始 rollout／最终树，不能独立重算。[预设完成树](https://github.com/prime-radiant-inc/superpowers-autoresearch/tree/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/fixtures/cp-x10-consistency-outcomes/complete)不是模型输出。日志还披露判分曾把空 root 当缺陷消失、随后修正手查；此处保留限制，不重复开展判定器审计。

另一个[固定补丁 7474980](https://github.com/obra/superpowers/commit/7474980bb9649fe818aace41ea0724b6a6e11def) 已要求最终 reviewer 不因 spec 沉默忽略实际使用行为，列出 Declined to judge，并让 inline 传 Review Focus。这反驳“完全没有挑战 spec 的设计”，但不能代替原请求→spec 的核对。**[一手：补丁；研究：边界]**

### 后续任务：相同 brief 与过期接口 · 最小动作、成本与停止条件

- 原意遗漏：选原请求中的具体成功条件对照实际使用路径；只有用户能决定的歧义才问，不能凭“合理用户”创造新需求。
- 接缝遗漏：按具体风险检查新产物→旧消费者、旧输入→新路径，例如新 token 到旧 verifier；已有测试未区分假设时再补反例，不统一规定 probe 数量。
- 接口改变：定位受影响的剩余任务、交付命令和已生成 brief，更新后再派发，并核验实际消费者路径，不重审整仓。

这些动作增加少量来源阅读、影响面定位和定向验证；本轮未测净时间／费用收益。判据已在输入、无跨任务消费者且已有独立检查的简单修改可不叠加；额外 reviewer 若只重复发现，应撤掉而保留必要的输入与运行检查。**[研究：条件建议]**

本轮已区分错误计划自洽、原意遗漏、未改代码接缝及后续计划过期，08/09 只作最小建议修订。下一阶段需要原报告的公开补丁与同条件复测，或不同真实任务中新增发现、误报与人工处理成本；没有这些证据，不为完成流程新建模板或重复本轮审计。


## 额外评审的增量与人的负担

核实：2026-10-14（UTC）。主线二；改变 09 §2 的“每次 PR 都加独立 Agent”默认值。以下为论文正文核对，未运行模型、上游程序或复算原始轨迹。

### 近期评测：先试单 Agent 的提示调整

[CRBugBench v1](https://arxiv.org/html/2610.13668v1)（2026-10-09），Table 2/3 的 `gpt-5.6-sol xhigh`、`copilot-cli 1.0.74`、Fix 组（合并后才被发现的历史缺陷）：固定前五条发现的观察口径，未匹配计算预算。**[一手：作者实验]**

| 配置 | recall@5 | 作者估算美元／任务 | 分钟／任务 |
|---|---:|---:|---:|
| 默认单 Agent | 49.0% | 2.03 | 5.2 |
| 单 Agent comprehensive 提示 | 54.0% | 1.81 | 8.1 |
| 五个独立候选评审＋协调者汇总 | 53.6% | 11.47 | 28.5 |

这支持先比较原生单评审的提示调整，而非默认堆 reviewer；不证明新提示普遍更好：同表 Opus 5 的 Fix recall@5 从 64.2% 降至 62.4%。该指标是前五条意见命中历史已知缺陷，不是意见精确率或线上修复率。**[研究：采用边界]**

任务删除后续 Git 引用、限制联网；历史公开答案仍有训练污染可能。三模型判分并有 40 样本人工校准，不等于全量独立运行证实。两轨各抽 500 题，因此论文“人只抓 50%”不能当随机真人对照；也没有原生测试单独一组或人的核查成本。**[一手：§3；研究：比较边界]**

### 人的注意力：新增意见不等于新增重要发现

[Tufano 等 v2](https://arxiv.org/html/2411.11401v2)（ICSE 2025）分析 29 位有职业经验者的 72 次评审：小型 Java/Python 程序共注入 48 个质量问题，比较手动、GPT-4 意见起步与人工构造的完整意见。AI 辅助组和手动组检出注入问题的中位数均为 50%；前者增加较低严重度问题，注意力更集中于已有提示位置；时间差未显著，不能写成已证明变慢或等效。**[一手：受控实验，§II–III]**

据此建议人在高风险任务先确定自己的检查范围，再看 AI 提示；“先人审后显示 AI”只是待验证措施，实验没有直接比较这种顺序。旧模型、短程序与人工注入不代表当前 Agent 的检出能力，也不证明 AI 不能增加价值。**[研究：条件建议]**

### 现场补充：修改发生了，仍须核对是否修对

[RevMate 原论文 v1](https://www.mozillafoundation.org/documents/462/2411.07091v1.pdf)（2024-11；Mozilla 在 2026-01 发布介绍，不是新一轮实验），GPT-4o、Mozilla/Ubisoft 现场研究：**[一手：§VI–VII]**

- Ubisoft 按每条评论打开到提交评价的区间累加，每个 patch 的中位数约 43 秒；含切换／分心，是检查耗时上界估计，不是总评审提速。
- 完成评审后的 69 条已采纳生成意见，有 51 条所在 hunk 后续变化（73.9%）；研究外其他 patch 的 1,211 条人工意见为 887 条（73.2%）。这是关联修改，作者明确承认可能与意见无直接关系；不能当正确修复率或随机同任务对照。
- 接受意见、判定正确、实际修复、漏掉缺陷、作者处理时间须分别记录；该研究未给完整缺陷召回或作者修复工时，不能与 CRBugBench 拼成同一条净收益证据。**[研究：解释边界]**

### 最小采用与停止条件

✅ 保留确定性检查和按风险的人审；🧪 只有明确漏审类型时才试额外 Agent。先用同类变更核对其新增、可行动且正确的发现，以及人的验证／修复投入；若只重复已有检查、引入大量无效修改或没有改善目标风险，撤回额外层。新提示也按同样标准，而非因单篇论文一律替换。**[研究：采用判断]**

本轮未得到当前强 Agent 相对“现有测试＋定向人审”的完整净收益对照；下一证据应为同任务的有效新增发现、未发现缺陷与人实际处理投入，或明确修复后的行为。无需为此新建 benchmark 平台或重复既有合成案例。

### Crossplane：有用意见与收窄评审可以同时成立

核实：2026-10-14（UTC）。主线二／三；细化 09 的撤回建议：低价值输出挤占人审时，可先收窄评审强度与状态评论，不必接受全部建议或撤掉全部能力。本轮只读公开 PR、评论、固定配置和代码，未运行 Crossplane、模型或 CI。**[研究：范围与采用判断]**

**实际改变了什么。** Crossplane 维护者 negz 在真实功能 PR [#6777](https://github.com/crossplane/crossplane/pull/6777) 试用 CodeRabbit 后，[说明 assertive 太啰嗦并改为 chill](https://github.com/crossplane/crossplane/pull/6777#issuecomment-3272858121)。[#6794](https://github.com/crossplane/crossplane/pull/6794) 的理由同时承认部分 nit 有用，但不值得投入过多处理时间，也担心新贡献者的负担；该配置修改已合并为 `389bee346cf0d0efea512994aeeeb311ff1ccc00`。随后 [#6795](https://github.com/crossplane/crossplane/pull/6795) 关闭评审前后状态评论，作者[明确保留 GitHub check](https://github.com/crossplane/crossplane/pull/6795#issuecomment-3272904222)。其合并版本 [2ef13c0 的配置](https://github.com/crossplane/crossplane/blob/2ef13c01f8916d4d161ba687c2f2941400cf2b8a/.coderabbit.yaml#L24-L50)同时包含 `profile: "chill"` 与 `review_status: false`。**[社区：维护者取舍；一手：PR 元数据与固定配置]**

这不是“机器人毫无帮助”的案例。同一个 #6777 中可核对以下不同结果：

| 意见及人的处理 | 固定产物／反证 | 能证明什么 |
|---|---|---|
| [机器人建议接口参数并加 nil guard](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334776323)；[作者接受前者、拒绝后者](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334832276) | [合并版 mapfunc.go](https://github.com/crossplane/crossplane/blob/221af7eb52a671f9462da4619c89776c593464d2/internal/circuit/mapfunc.go#L28-L34)使用 `Breaker` 参数，没有建议中的 nil guard | 建议被拆分、选择性采纳；未证明修复了已触发的运行时缺陷 |
| [机器人建议编译期接口断言](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334840022)；[作者接受但改放测试文件](https://github.com/crossplane/crossplane/pull/6777#discussion_r2335051593) | [合并版 token_bucket_test.go](https://github.com/crossplane/crossplane/blob/221af7eb52a671f9462da4619c89776c593464d2/internal/circuit/token_bucket_test.go#L32)包含断言 | 维护预防措施进入合并代码，不是发现一例真实接口错误 |
| [机器人判定整数 range 无法编译](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334861081)；[作者指出建议错误](https://github.com/crossplane/crossplane/pull/6777#discussion_r2335194071) | [合并版 go.mod](https://github.com/crossplane/crossplane/blob/221af7eb52a671f9462da4619c89776c593464d2/go.mod#L3)指定 Go 1.24；[Go 1.22 官方说明](https://go.dev/doc/go1.22#language)已支持整数 range | 此项语言断言可独立反证；本轮没有编译运行 |
| [机器人建议状态消息加入时间](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334839986)；[作者认为会引发 condition thrashing](https://github.com/crossplane/crossplane/pull/6777#discussion_r2334869687) | 作者解释条件更新会触发新的 reconcile | 展示核查系统行为的必要性；这一风险仍是维护者判断，未独立复现 |

表中机器人原意见、作者答复及固定代码分别为 **[一手：公开产物]**、**[社区：作者判断]**、**[一手：源码]**；解释为 **[研究]**。#6777 最终合并 SHA 为 `221af7eb52a671f9462da4619c89776c593464d2`。不能把意见被接受、代码出现、真实 bug 被修复、上线风险下降视为同一结果。

**人的负担与测量边界。** 公开线程能看到作者纠正事实、拒绝额外防御代码与说明范围的工作，且有其降低强度的实际决定；没有主动工时、额外等待或完整意见判定分母。#6794 的“接近 200 条评论”明确包含非 CodeRabbit 内容，不作机器人产出数、误报率或净损失统计。也没有 chill 前后同任务对照，不能声称收窄已经改善质量或节省多少时间。**[社区：处理记录；研究：证据边界]**

**排重与排除。** 既有 CRBugBench／Tufano／RevMate 不重复取样。[cuda-python #2137](https://github.com/NVIDIA/cuda-python/issues/2137)有历史关停的作者自述，但本轮所见重启仍是提议；[CCCL #8930](https://github.com/NVIDIA/cccl/pull/8930)确有启用自动评审的合并记录，却没有正确修复与人的投入对照，均不作为净收益证据。Crossplane #6794/#6795 的搜索网页旧缓存显示 open，本轮通过 GitHub 连接器重新取得两者 `merged: true`、合并 SHA、diff 与评论，未沿用缓存状态。**[一手：公开元数据；研究：排除判断]**

**后续门槛。** 保持额外评审按风险试用；若要进一步提高采用评级，需要同类任务中新发现的真缺陷、接受后的正确修复，以及作者／审核者主动投入和等待的可比记录。单个项目的配置取舍不能替代这些测量。**[研究：采用边界]**


## Faros：公开指标的口径补核

核实：2026-10-14（UTC+8）。主线四；改变 09／18：按事故比率、评审停留与代码 churn 选择观察项，不把它们写成逐 PR 致事故概率、人工工时或全部返工。本次已读公开原页与作者详解；上文 10-12 访问失败是当时记录，不回写成当时已读。[研究]

[一手：厂商公开报告] [Q2 2026 原页](https://www.faros.ai/research/ai-acceleration-whiplash)给出两年、22,000 名开发者、4,000 个团队的总体范围，摘要为事故／PR 3X、评审中位 5X、churn 10X。[官方详解](https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways)明确比较同一组织最低与最高 AI 采用时期：事故数／已合并 PR 数 +242.7%，评审停留中位 +441.5%，季度内已合并代码删行／加行比 +861%。按“1 + 增幅”换算分别为 3.427、5.415、9.61 倍；摘要是粗略概括，不是另一组相互矛盾的数据。

[一手／研究] 详解标题曾用 probability，但紧随的正文明确这是比率而非概率：一份 PR 可关联多个事故，事故也未必归因于最近合并。该页也分别列首次评审等待、平均评审时间和中位停留，不能混作同一个人工投入指标。churn 可来自替换不足代码，也可来自有益重构；只靠删行／加行比不能诊断是哪一种。具体任务应回到变更来源、返工原因、评审等待和实际缺陷，不因比率上升惩罚必要删除或重构。原页还报告 PR 体积约 +51%、bugs／PR 约 +28%，并主张成熟团队也出现恶化、与 DORA 2025 调查不同；这些原结论保留为厂商主张，不在缺少可比样本和模型时宣布推翻 DORA。

[一手：作者方法限制] [后续方法说明](https://www.faros.ai/blog/why-cheaper-ai-models-can-cost-more-hidden-model-tax)承认报告为观察性研究，建立关联而非隔离 AI 采用的因果效果。本次未取得完整下载报告及方法附录；各指标有效样本、采用强度定义、聚合权重、准确观察起止、计时端点及混杂控制仍未核实，不能把 2025 报告的方法移植到 2026 版，也不能把总体样本当每一项指标分母。

[研究] 保留“同时观察交付、评审与可靠性”的建议，撤回“churn 全是返工”的译法；这些数字不预测某团队会恶化多少，亦未证明前置评审、特定模型或厂商治理产品能改善结果。未取得逐团队原始数据，不做伪精确因果复算；本轮完成原页、详解、限定语核对及上述算术，未运行模型或团队实验。


## 工作流首选：契约与可观察偏好

核实：2026-10-15（UTC+8）。主线二／三；改变 07 的访谈 Spec、TDD 开局与 SDD 适用条件。✅ 按尚未确定的行为／交付契约和需要观察的偏好分流，撤回仅按任务大小决定是否写规格。以下是原文及固定产物核查，不是本仓模型实验。**[研究：采用判断]**

### 原任务到产物：GIF 优化器

Simon Willison 的[原文](https://simonwillison.net/guides/agentic-engineering-patterns/gif-optimization/)说明，他要用浏览器比较 GIF 压缩效果，特意未规定全部 presets；发现 WASM 构建涉及补丁后，追加固定源码、保存构建脚本／补丁并提交 bundle 的要求，以便静态托管直接使用。他展示自己用产物优化演示图，但不满意 Agent 额外加入的 URL 输入，因为存在跨域限制。前者支持保留可观察选择，后者反驳“没写的功能让 Agent 猜就总合适”。**[社区：作者任务、使用与取舍自述]**

[合入提交 `ea924805`](https://github.com/simonw/tools/commit/ea924805f14bc826ca3c51686613cd476ff02251)保留初始任务和追加提示。只读固定文件得到：
- [HTML](https://github.com/simonw/tools/blob/ea924805f14bc826ca3c51686613cd476ff02251/gif-optimizer.html)的 presets 包含无损、有损、减色与缩放，`processPresets` 展示大小和预览，`setManualControlsFromArgs` 把选中参数带入手动控件，`getManualArgs` 再生成命令。大小可量化，视觉是否可接受仍需判断；源码没有把“最小文件”直接当最终选择。
- 同文件 URL 入口直接 `fetch(url)`，没有跨域代理；这是作者顾虑的实现路径，并非本轮实测所有 URL 均失败。固定版本仍有该入口，不能把“可能以后删除”写成已删。
- [build.sh](https://github.com/simonw/tools/blob/ea924805f14bc826ca3c51686613cd476ff02251/lib/gifsicle/build.sh)检出 `07f5c4c`、应用补丁并复制 JS／WASM；[补丁](https://github.com/simonw/tools/blob/ea924805f14bc826ca3c51686613cd476ff02251/lib/gifsicle/gifsicle-wasm.patch)增加调用入口，提交文件表含 WASM。脚本没有固定完整工具链；这证明追加交付要求落到代码，不证明可重复构建已验收。**[一手：固定源码／提交；研究：证据范围]**

因此该例不是“省略规格必然更快”，也不是没有需求：初始任务已经定义比较、下载和调整行为。可迁移的是**把当前能验证的目标交给实现，把需要人决定的偏好留给反馈；新发现的交付约束及时补回任务**。已读原文、合入提交及上述文件，未读取完整 Claude 会话，未运行构建、浏览器或模型，未测返工／主动工时。**[研究：采用与局限]**

### 不同作者的补充与反例

Anthropic 的 [Finding your unknowns](https://claude.com/resources/articles/a-field-guide-to-claude-fable-finding-your-unknowns?fcdaa149_sort_date=desc&query=workflow)（2026-07-06，Thariq Shihipar）提出先用假数据做工具栏布局、暂不连接真实应用；访谈优先问会改变架构的歧义。作者实际视频制作中先试 Remotion 与转录同步，但调色时发现自己连好坏也不会判断，转而学习评价依据。它支持“样品能否帮助决策”的分界，**不支持没有标准就无限试样品**。这是厂商工程师经验，不是独立收益对照；不照搬其每次 brainstorming、新会话或测验习惯。**[一手：作者原文；研究：采用边界]**

[Claude Code 最佳实践](https://code.claude.com/docs/en/best-practices#explore-first-then-plan-then-code)同时给出直接修小改与先规划的示例，并在 Develop your intuition 承认探索时可跳过规划。本文不将其“多文件”提示升级成强制关卡。测试预期来源沿用[既有回归研究](2026-10-12-development-conditions.md#生成回归测试先保留预期再决定是否新增)，不因新增短入口再推广 TDD。**[一手；研究]**

**未采用的近期证据。** [Vibe Coding: An experiment with test-driven development](https://link.springer.com/article/10.1007/s10664-026-10950-z)于 2026-10-09 发布；已读 §3–7，研究在人类／协作、GPT-3.5 全自动与 MGX（GPT-5／Sonnet 4）间改变模型和交互方式，使用两个无需复杂 API／类结构知识的简单任务，并非同模型只改变先测／后测的对照。故不据摘要的工作流优劣建议扩大 07 的 TDD 采用范围；本轮未取得并复算工件。**[研究：排除理由]**

**撤回与下一证据。** 若行为已明确且现有检查充分，撤掉额外访谈／规格／重复测试；若样品不能让人作出选择，先查参考与判据。遇到跨组件兼容、不可逆数据或外部交付约束，不能用“探索”跳过必要决定。进一步提高工作流推荐强度，需要同任务、同模型与预算的顺序对照及真实后续修改成本，不能由一个成功工具或新论文标题替代。**[经验：采用条件；研究：证据缺口]**


## 评审入口、费用与完成契约

核实：2026-10-14（UTC）。主线二／四；改变 09 §2：云端命令不等于云端实际执行，运行成功不等于无缺陷。以下核查公开官方原文及既有固定 Action 源码，未安装或运行客户端、模型、托管评审、付费 CI，也未新增检查器。**[研究：范围]**

### 新证据如何改变选择

1. [Code Review 的云端升级说明](https://code.claude.com/docs/en/code-review#escalate-to-ultrareview)明确：ultra 不可用时退回本地。故要求云端多 Agent 的任务，应看实际会话执行位置；有结果本身不能确认采用了预期能力。普通本地不读 `REVIEW.md` 是已有证据，本次只是移到入口，不算新发现。**[一手；研究]**
2. [Ultrareview CLI 契约](https://code.claude.com/docs/en/ultrareview#run-ultrareview-non-interactively)把完成与发现分开：退出 `0` 可带发现，`1` 是启动／运行／超时失败，`130` 是中断；`--json` 为 `bugs.json`。不能把退出码当质量门槛，也不能套托管的 `normal/nit/pre_existing` schema。超时后远端可能继续，重新执行不是续跑，须防止重复付费。**[一手；研究]**
3. [托管故障说明](https://code.claude.com/docs/en/code-review#retrigger-a-failed-or-timed-out-review)与[输出说明](https://code.claude.com/docs/en/code-review#check-run-output)共同反证“neutral 即有效结果”。正文因此撤回只比较 `normal > 0` 的直接门槛建议，补充应用身份、当前 head SHA、完成状态和 schema 条件；这些是本仓推导的接入要求，不冒充已发布或已测的检查器。**[一手；研究]**

### 仍成立的机制与反证

- `REVIEW.md` 更可靠并非原文没有依据：[官方确实作此主张](https://code.claude.com/docs/en/code-review#what-you-can-tune)，理由是直接传给相关评审 Agent。本次保留机制和厂商归属，只撤回可将它理解为强制保证的措辞；本轮没有遵循率对照。ultrareview 文档未在所读章节承诺同样文件加载路径，因此不从名称或多 Agent 架构推断。**[一手：厂商说明；研究：边界]**
- [Claude Action](https://code.claude.com/docs/en/github-actions)是 workflow／SDK 集成，支持 API key 和订阅 OAuth；不能借托管服务的价格、读取规则或验证流程为任何 Action 提示担保。[Codex GitHub](https://learn.chatgpt.com/docs/third-party/github)明确使用适用目录的 `AGENTS.md`；[CLI](https://learn.chatgpt.com/docs/codex/cli)另有本地 review。把规则放对位置仍不代替测试／准入策略。**[一手；研究]**
- 重读 [Codex Action 固定 action.yml](https://github.com/openai/codex-action/blob/bdf19a4a223ec2549a3e2274a0cf61556bc07675/action.yml)，仍按既有 runner／权限建议使用；固定 Action 不等于固定 CLI，不能把普通 exec 的产物误认成上述托管报告。未运行此 Action，不新增能力或净收益结论。**[一手：固定源码；研究]**

### 撤回与页级剩余缺口

**[经验：采用判断]** 接入前还不能区分运行失败、报告失效与有无发现时，只用提示型评审；可控且重复的窄任务才进入自动化。规则无新增有效发现就精简，托管／ultra 的额外费用不能混入“订阅内免费”比较。没有证据支持所有入口同能力，也没有证据支持云端一律比本地值得。

09 本轮维持 **L2**：这次补齐主要采用入口，但全页仍有未在本轮交叉核验的调查数字、模型效果转述、第三方服务与配置审计命令；正文头部保留历史核实范围。下一步应核对或删去仍影响决策的这些条目，不重复 CRBugBench、厂商相关性或再造评审评测平台。未实测本身不是 L3 的否决条件，缺的是全页关键事实的一致、可追溯核对。**[研究：成熟度判断]**

**验证记录。** 独立 reviewer 以新上下文核对这两文件的 diff、官方原文和固定 Action 源码，未发现会改变采用选择的事实问题，认可维持 L2。完整 `python3 scripts/check_offline.py` 14 阶段及 `git diff --check` 通过；这些只验证本仓离线套件和补丁，不证明评审服务或模型效果。**[经验：执行记录]**


## 调查、模型转述与第三方服务的采用边界

核实：2026-10-14（UTC）。主线二／三；只改 09 的三处采用依据，不重做入口与失败契约，也不提升 L2。公开原页阅读，不含模型、客户端或服务实验。**[研究：范围]**

- **调查分母与反证。** [SO 2025 原题](https://survey.stackoverflow.co/2025/ai)为多选题，31,476 人作答（全调查的64.2%），66%／45%分别表示遇到近似正确方案／调试更费时。[方法](https://survey.stackoverflow.co/2025/methodology)写明2025-05-29至06-23收集，主要经自有渠道招募，活跃用户更易入样。故删除“好到能合并”的添加解释；既不能从受访者比例推成代码缺陷比例，也不能预测2026模型效果。保留按实际行为验证的建议，不据此计算返工预算。**[一手：问卷、方法；研究：解释]**
- **模型优势的归属。** [Opus 5.5 发布页](https://www.anthropic.com/claude-opus-5-5)把低 effort 检出已知缺陷72%、Opus 5高 effort 56%及误报更少，列为Deloitte CIO Carl Bennett的客户引言；未在此处给出任务数、缺陷数、抽样、误报分母及可复查产物。这是正面线索，不能直接选定默认 effort，亦不能与独立评审研究合并成同一个对照。正文撤下具体优势和未在此页找到的逐字提示，沿用已有“给需求、位置、可证明失败”的建议。**[一手：厂商刊载客户自述；研究：边界]**
- **当前服务契约优先于旧价格新闻。** [Bugbot 当前文档](https://cursor.com/docs/bugbot#pricing)说明用量计费并保留旧seat方案入口，Teams从预付额度或旧Teams按需支出扣除；[当前价格页](https://cursor.com/pricing)按方案列可用功能，未给可用于所有PR的固定单价。[5月公告](https://cursor.com/blog/may-2026-bugbot-changes)中的1–1.5美元是当时均价，老客户在6月8日后下一次续费才转制；[6月更新](https://cursor.com/blog/bugbot-updates-june-2026)又报告成本下降，并已列Security Review入口。因此撤回当前固定按次报价与统一9月新增的描述，不用22%降幅推算新单价。当前[Security Agents](https://cursor.com/docs/security-agents)区分PR评审与存量扫描，按团队用量扣费；[Rollouts](https://cursor.com/docs/rollouts)监控部署，不能凭同一品牌或合并介绍当评审替代。删除未给原帖的“社区不满”，不作价值判断。**[一手：官方文档／历史公告；研究：采用边界]**

**该轮剩余盘点（后续补核见下节及文末）。** 当时尚未核实 GitClear 分母、Anthropic 自评、Intercom、第三方插件归属及配置审计命令，因此未把三项局部修订写成全页 L3。原生本地优先、按风险增加评审及无净增益时撤回的核心建议不变。**[研究：范围与成熟度]**

**验证记录。** 全新上下文独立 reviewer 交叉核对上述原页与两文件 diff，未发现会改变采用选择的事实问题，认可维持L2。实际运行 `python3 scripts/check_offline.py`，14阶段全部通过（非空套件、无skip）；`git diff --check`通过。仅验证本仓离线套件和补丁，不代表模型、客户端或托管服务已验证。


## GitClear维护信号的分母与采用边界

核实：2026-10-14（UTC）。主线三；改变 09 §1：将厂商维护代理信号用于定向抽检，不据此认定默认 AI 工作流导致维护退化，亦不设旧代码改动或重构配额。完整 PDF 未取得，以下是公开原页与原报告图页核对，不宣称完整方法已经审完。**[研究：范围与采用判断]**

### 可核查的一手材料与访问范围

[官方落地页](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)公开摘要、图页与下载表单；[报告封面](https://asset.gitclear.com/assets/pages/maintainability-gap-cover-c12f3032b5fc3cbd106b35a69dcff15c2ba0e31daf7c1e7c2d05c36d565effae.png)署 William Harding、2026-06、v2026.6.0，GitClear 与 GitKraken 赞助。作者的[9月发布说明](https://www.gitclear.com/blog/annual_ai_code_quality_research_2026_diff_digest_git_ai_diff_viewer)内嵌原文说明下载需登录或验证邮箱。本轮未提交邮箱或注册账号，公开搜索未取得可核验完整 PDF。官网公开[指标与方法说明](https://www.gitclear.com/industry_stats/ai_code_quality_signal_graphs)可读取 HTML；网页提取工具一度返回 403，普通公开请求可读，同属官方的[GitKraken 子域页面](https://gitkraken.gitclear.com/industry_stats/ai_code_quality_signal_graphs)亦可读。两页是动态数据，不能将其当前总量当作六月报告样本。**[一手；研究：访问边界]**

### 五项会改变采用的发现

1. **重复指标单位冲突，不能拿绝对值设门槛。** 落地页正文把 40.3→73.0 写成每百万变更行；其直接展示的[原报告第8页](https://asset.gitclear.com/assets/pages/maintainability-gap-block-duplication-10c7322d192693dad8b141b15740d29ebd77147127544f51bba38a0662327329.png)图轴及图注却是每千变更行中的重复行，年份为 2023→2026 YTD。相对增幅约81%不受这处单位差异影响，但不是缺陷率，也不能默认为重复块数量。正文保留厂商报告的相对信号并明示冲突，不擅自裁定哪个版本正确。**[一手：正文与原图；研究：解释]**
2. **移动比例不是全部重构量。** [第11页](https://asset.gitclear.com/assets/pages/maintainability-gap-refactor-vs-paste-66d0411f642c9c302a181f26f32a300ebe83e677ad1a6d1168bd8ebaf9ccd78f.png)图示变更行中移动占比12.7%→3.8%，正文取整为13%；“−70%”是两占比的相对变化，不能换成重构次数、工时或绝对量。该图2026复制粘贴15.7%，除以3.8约4.1，并不支持正文“约5倍”的精确比较。撤下该倍数，不据此预留固定重构百分比。**[一手：原图；研究：计算与边界]**
3. **旧代码更新占比下降不等于绝对维护量减少。** [第13页](https://asset.gitclear.com/assets/pages/maintainability-gap-legacy-code-b6aa26e7eaa4cfa69dfc5b4504d7569c87110ae5d4c64bfc76ac11daee8c9d37.png)写的是更新或删除超过十二个月未触碰代码的变更占比，2023为1.71%、2026 YTD为0.46%；旁列各年检查行规模10m、12m、46m、58m，不能当同等规模或固定仓库面板。落地页导语写“vs 2022”，正文和图则指2023。即使占比核对无误，分母增长、样本更替、仓库年龄与需求类型都可能改变解释；这只是待控制因素，不声称已经证实哪一种造成变化。**[一手：原图；研究：推论边界]**
4. **防御性语法与短期删改不是已确认坏代码。** 第8页将 rescue/catch、safe-navigation 和 stubbed methods 等构造作为错误掩盖信号；当前官方指标页又把 null checks、mock guards 等列作防御性惯用法，说明更多通常代表更谨慎。当前页把 churn 定义为两周内被改写或移除的已写行占比。当前定义不保证与六月每项历史计算完全一致，却足以说明不能跳过具体行为核验，把构造密度直接译为已证实吞错、把 churn 全译成缺陷返工。应检查错误是否被掩盖，而非要求减少 catch 或空值检查。**[一手：原图与当前定义；研究：采用边界]**
5. **公开材料支持预警，不识别工作流因果。** 报告封面总量为6.23亿 changes，不能转述为同数提交、开发者或独立观察。已读部分呈现跨年代理信号；当前指标页说明按模型指纹分组，基线为人类或未归因提交，不等于证实未用AI的对照组。仓库构成、归因阈值和验证细节仍指向完整报告；本轮无法核实其控制语言、任务、仓库年龄、使用者选择等混杂的程度。这不证明报告为假，也不能反向声称完整报告完全没有控制。**[一手：公开方法；研究：因果边界]**

**仍成立与撤回条件。** 重复实现可能增加同步修改负担，代理信号可帮助选择抽检对象；某段重复确实独立演化、异常被有意处理或旧代码无修改需求时，应接受具体解释，不能为了让统计好看强制改动。是否增设评审层仍按有效新增发现和成本决定；上述趋势没有检验额外 reviewer 的净收益。09 维持 L2，完整方法与其余效果转述仍未完成页级核查。**[经验：采用判断；研究：证据缺口]**

**验证记录。** 全新上下文独立 reviewer 核对两文件 diff、公开原图、当前官方定义与算术，未发现会改变采用或需修正的事实错误，认可保留历史口径不确定及完整 PDF 未取得的边界。实际执行 `python3 scripts/check_offline.py`，14阶段通过（非空套件、无skip）；`git diff --check`通过。仅验证本仓离线检查和补丁，不代表模型效果、维护成本或报告完整方法获验证。


## 配置诊断、插件评估与第三方集成的范围

核实：2026-10-14（UTC）。主线二／三；撤回“收录插件或运行诊断就值得加一层”的隐含选择。只读官方文档及固定公开源码，未安装、运行模型或连接服务。**[研究：范围]**

- **组织结果不归给托管产品。** [Intercom 2026-04-21 原文](https://www.intercom.com/blog/ai-is-approving-our-pull-requests-heres-how-we-made-it-safe)在两个主代码库报告超过19%自动批准；35%停机下降放在九个月整体研发转型、部署翻倍的背景。自建子Agent审批有仓库指导，拒绝大／复杂／宽范围PR，工程师可改请人审并负责上线监控回滚。其百余PR试点、后续497个自主PR不是随机分配证明；原文没有足够资料分离选样、变更大小和其他流程变化。故不能作为托管Claude Code Review的效果或默认自动批准依据。**[一手：使用方自述；研究：边界]**
- **自评反例不推出固定互评。** Anthropic 3月复盘关于主观设计自评偏宽松的原句成立，但同文也明确新模型能力范围内evaluator可能是额外负担；沿用[已有原文核对](2026-10-12-long-task-evidence.md#3-历史-harness-自己已经撤去哪些环节)，不另复制实验数字。采用只看具体漏项和净收益，不要求按案例复制轮次。**[一手：作者实验自述；研究：选择]**
- **诊断不是行为评估。** [Commands](https://code.claude.com/docs/en/commands)及[Skills](https://code.claude.com/docs/en/skills#check-your-setup-with-doctor)确认 `/doctor prompt-audit` 从v2.1.283可用，是模型驱动的过时／冲突指令审计，不能因另有 `/claude-api prompt-audit` 就认定它不存在。`/skill-doctor` 从v2.1.252可用，依赖feature-flag fetching，报告对象是当前会话中的skills，排除bundled及enterprise；这不限定调用历史的统计窗口；[Remote Control不支持，须在宿主终端使用](https://code.claude.com/docs/en/skills#find-unused-skills)。[环境文档](https://code.claude.com/docs/en/env-vars#features-that-need-feature-flag-fetching)说明第三方provider、gateway及禁用相关流量的会话通常不取flags。缺此命令时可直接查加载内容，不要求为了诊断更改隐私设置；调用少不足以证明无用。**[一手：动态契约；研究：选择]**
- **插件行为评估有明确宿主。** [Plugin evals](https://code.claude.com/docs/en/plugin-evals)适用于Claude Code插件／skills-directory插件，要求v2.1.269+；它使用正常会话的认证／provider，运行与裁判都计入用量。默认有／无插件各三次，不是三次就足够证明收益。隔离运行不加载用户／项目CLAUDE.md、其他插件或配置，即使scaffold写入也不加载；这让插件增量可测，却不能直接测整个真实配置组合。语法/schema用`plugin validate`，会话内skill-creator的格式也不互通。具备条件的订阅账户直接从shell运行可能发布私有artifact，`--no-publish`保留本地；hooks／真实MCP代码不受agent隔离保护，评估通过也不证明插件安全。这些是选工具及设预算的边界，不意味着该工具无用。**[一手：官方契约，未运行]**
- **市场管理者不等于集成作者。** Anthropic市场固定于[`c2bdb427`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/.claude-plugin/marketplace.json)：CodeRabbit指向[`3e8763d2`](https://github.com/coderabbitai/skills/blob/3e8763d24d543b48615b82535d02288de3ddae40/README.md)的CLI集成，Greptile指向[`6b725af2`](https://github.com/greptileai/claude-plugin/blob/6b725af2636072cab79e0a5426f6a960b0fd29ef/plugins/greptile/README.md)的MCP及随插件发布的CLI，Qodo指向[`866d301d`](https://github.com/qodo-ai/qodo-skills/blob/866d301dfbec39d5bb18bde72ac0dc770cc759a1/README.md)的skills包且需另装CLI。收录证明存在可接入路径，不证明评审能力、账户可用或净收益。**[一手：固定市场及发布方源码]**
- **安装可能改变工作流。** 同一Qodo固定版本的[`qodo-review/SKILL.md`](https://github.com/qodo-ai/qodo-skills/blob/866d301dfbec39d5bb18bde72ac0dc770cc759a1/packages/qodo/skills/qodo-review/SKILL.md)包含编码checkpoint与最终评审指导，并说明发送diff及提供的会话context至服务；默认auto可选择deep，不是花费上限。固定版本还声明`qodo review`处于closed preview，未加入的组织会被拒绝；这不是重试可解决的故障。它也禁止对无进展重复发现无限购买评审。不是本仓实际触发观测，但足以支持接入前读触发、外发及费用契约，而不是为已有原生评审再默认加插件。**[一手：固定指令，未运行；研究：采用边界]**

**页级剩余判断。** 本轮补核了此前明确留下的四组事实，不重复已核调查与评审入口，也不自动升级L3。GitClear完整报告、厂商独立效果与本仓模型实测仍未取得；这些不应靠更多引用伪装完成，正文已限制其推论。全页范围还须由独立审阅确认入口一致性及是否仍有影响选择的遗漏；固定风险分层、无需额外工具即可起步的核心建议保持不变。**[研究：成熟度范围]**

**验证记录。** 全新上下文 reviewer 独立读取官方文档及固定源码，指出 Qodo closed preview 的资格门槛遗漏；补明后复核无剩余事实或采用问题。完整 `python3 scripts/check_offline.py` 14阶段通过（非空、无skip），`git diff --check`通过；仅验证本仓离线套件和补丁，不代表模型、插件或托管服务效果已验证。**[经验：执行与复核]**


## 安全插件：从提醒到自动模型评审

核实：2026-10-14（UTC）。主线二；改变09中将 security-guidance 当作“编辑时提示9类风险”的采用判断。新增证据是官方市场固定实现及真实失败／修复链；只读下载源码，没有安装、调用模型或运行插件。**[研究：范围]**

**来源身份。** 官方市场 [`c2bdb427`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/.claude-plugin/marketplace.json) 的 `security-guidance` 指向该仓库 `./plugins/security-guidance`，版本2.0.13；下述文件均固定同一SHA。`anthropics/claude-code` 另有同名目录，但不是该市场条目的实际源，不能把两个仓库的默认模型与安装逻辑混用。**[一手：配置与源码]**

**会改变选择的机制。**

- [`hooks.json`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/hooks.json)在编辑后注入模式提示，Stop及Bash commit／push匹配时安排后台评审；[`security_reminder_hook.py`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/security_reminder_hook.py)默认开启模式、模型、Stop与commit层，并检查凭据及具体运行条件。因此“默认开启”不是每次都执行成功。`ENABLE_CODE_SECURITY_REVIEW=0`关闭Stop与commit／push模型层；`ENABLE_STOP_REVIEW=0`仅关闭Stop层，不是全部模型调用开关。**[一手：配置和调用路径]**
- 同一hooks文件独立注册SessionStart的[`ensure_agent_sdk.py`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/ensure_agent_sdk.py)：SDK不可用时尝试建立持久venv并`pip install claude-agent-sdk`，特定失败下可改用`pip --target`；继承pip registry设置，未固定SDK版本。这个bootstrap没有读取模型层开关或`SECURITY_GUIDANCE_DISABLE`，所以“关闭模型评审／总开关”不能当作“不会准备依赖”的保证。这里仅证明代码可走到该路径，不声称本机发生安装；不接受这一副作用时不默认安装该插件。**[一手：独立入口与分支阅读；研究：选择]**
- [`llm.py`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/llm.py) 的 `_anthropic_base_url()`默认使用Anthropic端点，支持`ANTHROPIC_BASE_URL`网关；`_call_claude()`在Bedrock／Vertex／Foundry／Mantle等provider标志下转SDK／子CLI，继承provider环境。agentic reviewer允许Read／Grep／Glob查相关代码，`setting_sources=[]`且不启用bypassPermissions。故新增的是后台模型调用和输入范围，不能推断一定新传到一个额外第三方平台，也不能由主会话能调用模型就认定全部评审路径可用。**[一手：实现；研究：范围]**
- [`README`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/README.md)说明diff／相关代码发送给配置的模型端点；`llm.py`实际直连路径通过该端点的模型列表选最新Opus，失败时使用固定fallback，SDK路径使用CLI的`opus`别名。升级可改变模型与成本，固定模型需分别考虑`SECURITY_REVIEW_MODEL`及`SG_AGENTIC_MODEL`。组织安全指导拼入diff分析，但agentic路径没有同一`guidance_block()`调用，不能把一处规则文件当所有评审层共同的强制规则。**[一手：说明与实现交叉核对]**

**真实反例与修复范围。** [#2071](https://github.com/anthropics/claude-plugins-official/issues/2071)的作者报告2.0.0在其macOS Python3.9环境下模式提醒可用、SDK评审却未运行；另建3.12 venv仍被3.9宿主导入失败，暴露“bootstrap健康”与实际消费者不一致。该issue已由[#2073](https://github.com/anthropics/claude-plugins-official/pull/2073)关闭，固定2.0.13的[`sg-python.sh`](https://github.com/anthropics/claude-plugins-official/blob/c2bdb427efe8673f190ae862c273cfa368d2390f/plugins/security-guidance/hooks/sg-python.sh)优先兼容SDK的Python3.10+，bootstrap也检查宿主版本。它支持“提醒存在不等于深审可用”的反证，不支持声称当前版本仍普遍失效；README的Python3.8+前提也不足以单独证明SDK层可用。**[社区：作者失败报告；一手：修复状态及固定源码；研究：边界]**

**采用与撤回。** 原生定向安全评审足够时，不为了更多提示增加持续插件。需要持续检查时先辨模式、Stop、commit／push层，确认依赖安装政策、实际数据路由与模型预算；只要模型层未成功运行、重复发现挤占核查或成本不合适，就关闭相应层或撤回插件。既有SAST／依赖扫描与风险人审保留；本轮不声称插件净收益、召回率或修复效果已经验证。**[研究：采用判断]**

**限定独立复核。** 全新上下文reviewer重新读取上述固定市场／实现及失败修复链，核对独立bootstrap、provider路由、默认开关与正文页头，无剩余事实或采用问题。新增本地章节目标存在，`git diff --check`通过；完整离线验收由整合单元串行执行，结果见TASKS。未安装或执行上游插件，不声称真实运行或安全收益。**[经验：验证范围]**


## 评审窗口与输入历史的区别

主线三；核实：2026-10-15 UTC。改变的建议：撤回 Claude 入口中将内置 `/code-review` 视为“新鲜上下文”的说法，只在需要隔离实现历史时选择干净会话或非 fork reviewer。新增证据为两份当前官方客户端文档的交叉核对，未运行客户端或模型。**[研究：范围]**

[Code Review](https://code.claude.com/docs/en/code-review#review-a-diff-locally) 的普通命令步骤先说明后台子 Agent 有独立窗口，随后明确终端使用 forked subagent；[Subagents 的 fork 对照](https://code.claude.com/docs/en/sub-agents#how-forks-differ-from-other-subagents)则明确 fork 继承完整会话历史、系统提示和工具。这里不是要求用户另传 `--fork` 才成立的可选评审方式。独立窗口说明后续评审输出不充满主会话，不证明起始输入未含实现推理。**[一手：当前客户端文档]**

**范围及反例。** [评审前台例外](https://code.claude.com/docs/en/code-review#run-in-the-foreground)包括已有评审运行时再次启动、`-p`／SDK 和禁用后台任务；该页标记默认后台自2.1.218起。子 Agent 页另将一般交互 fork mode 默认标记为2.1.232起，不能把它当作 `/code-review` fork 机制首次发布版本。本文只确认读取日的默认终端契约，不推定所有宿主、历史版本或特殊配置等价。同一实现会话内启动默认评审是“窗口独立、历史继承”的具体反例；它可以利用已有背景，也可能继承原假设，但文档本身不证明实际误报率或独立 reviewer 的净收益。**[一手；研究：推论边界]**

**采用与撤回。** 就地复查仍可使用内置命令。只有输入独立性属于当前风险要求时，才另起干净会话或非 fork 子 Agent，并限定交接内容；不把多开一层当作必经流程。Claude 入口与09同步这一判断，未改评审模板、未重做已有权限或套餐核查。**[研究：采用判断]**


## 无需修改与部分修复要一起评估

主线二／三；核实：2026-10-15 UTC。改变09的选样：同时检查已修任务的误改与部分修复任务的误停，不以补丁更少单独判断配置改进。**[研究：采用判断]**

[FixedBench论文v1 §3.2](https://arxiv.org/html/2605.07769v1#S3.SS2)报告：显式允许不改，在已修任务上减少无必要修改，却在先应用错误补丁的任务上增加误停。这是作者实验结果，支持增加对照任务，未由本仓独立复算，也不证明任何提示的绝对净收益。**[一手：作者论文；研究：范围]**

作者公开的同一Django任务两条轨迹中，[直接要求修复](https://www.sri.inf.ethz.ch/assets/blog/fixedcode/django__django-11239-fix.traj.html)仍改写已有证书参数传递；[允许不改](https://www.sri.inf.ethz.ch/assets/blog/fixedcode/django__django-11239-fix-or-abstain.traj.html)以mock捕获传给子进程的参数，确认已有实现后留下空补丁。它们只展示有限行为机制，不等于真实TLS连接验证。**[一手：公开轨迹]**

本轮未取得完整运行manifest或部分修复原始产物；论文Best／Worst同时改变Git历史与依赖准备，不能拆成环境收益。允许无补丁交付仍需核当前行为，不能依据历史commit自动停止。未运行上游代码或模型。**[研究：边界]**

## 工作流页历史页头

历史原文转存：2026-10-16（UTC+8），来自 `docs/07-workflows.md` 的原页头。以下保留当时的核查日期、范围和来源说明；相对链接以原页面路径为基准。

```text
> 核实时间：2026-10-08；Hook 与迁移建议于 10-11 复核，HumanLayer 效果说法于 10-12 核对；10-13 收窄 Plan 和新会话的默认要求，10-14 补充第二次需求修改的验收建议；10-15（UTC+8）按契约与反馈收窄 Spec／TDD 首选，并复核 Ralph／长时 harness 的采用与撤回、`/goal` 的证据／成本边界及纠错后的流程选择；2026-10-15（UTC+8）独立审阅全文核心建议与相关入口，收敛工具与计划入口冲突；10-16（UTC+8）核Kiro显式修订能力与历史批评范围，并限定Plan示例的客户端／权限范围；不代表所有外链或当前模型效果已重新验证。
```
