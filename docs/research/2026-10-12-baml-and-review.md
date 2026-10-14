主线：二，额外能力何时值得加；三，连续修改仍然可靠
改变的建议：只为会改变实现的未知事实定向研究；按原需求验收并允许实现反馈推翻计划。额外评审按具体漏审风险试用，重复意见或处理负担过高时收窄／撤回。[研究]
证据摘要：BAML 同起点双 PR、Superpowers 固定交接配置、Crossplane 选择性采纳与降强度记录，另有评审论文和 Faros 指标核对。来源分别是固定产物、参与者自报及研究；未证明完整流程或额外 reviewer 的净收益。[一手／社区／研究]

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
