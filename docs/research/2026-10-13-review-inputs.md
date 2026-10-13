# 计划与评审：先改变判据输入，再决定是否增加评审

核实：2026-10-13（UTC+8）。本轮读取 GitHub 原帖、评论、固定源码与作者实验材料；未运行上游代码或模型。

## 可以改变的建议

✅ 复用原请求、现有验收或已确认规格作为判据，不只把同一份计划摘要交给实现者和评审者。接口或行为约束改变时，让受影响的剩余任务失效并更新后再派发。简单任务已有充分检查时，不另写 spec、不增 reviewer；独立会话并不等于独立判据。**[研究：采用判断]**

## 原帖与固定实现

[#2470](https://github.com/obra/superpowers/issues/2470) 报告计划内代码、测试共用错误模型：新用途 JWT 被旧登录验证器接受、字符串前缀检查与实际 URL 解析不一致等。它指向未改代码接缝和反例不足；作者的约 40 个 probe 成功报告没有公开应用补丁／日志，未独立复现。[#2450](https://github.com/obra/superpowers/issues/2450) 则报告正确修复收紧 CLI 调用后，后续计划仍用旧接口；作者说 scoped 与 final review 最终发现，问题是发现太晚，不是所有评审都漏掉。**[社区：作者原帖]**

核实时两 issue 均 open，评论和 timeline 为空；按 issue 号搜提交无结果。只能说所查入口未见维护者回应或直接关联修复，不能证明没有其他相关改进。下述八九月提交早于两个十月 issue，不是它们的响应。**[一手：GitHub 状态；检索边界]**

主分支固定 `bb92a77741419a4ab5f06e711a283343f1ada0c3`；dev 为 `d079e1b85c8f964cb52da5e2be678c9fdfc8759b`，二者 tree 均为 `4ac675daa3415bc836f707c7e60237ac7b66c7d5`。相关机制如下。**[一手：Git 元数据与源码]**

- [SDD setup](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L155-L181) 已要求读 spec、按其裁决计划冲突；[task reviewer](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/task-reviewer-prompt.md) 可报 plan-mandated 缺陷，也可按具体风险查 diff 外代码、运行 focused test。因此不能概括为“只能服从计划”或“禁止独立验证”。
- reviewer 与 implementer 明确共用同一 brief；[task-brief](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/scripts/task-brief#L30-L36) 仅抽取计划的 Task 文本。SDD dispatch 另要求带先前接口决策，故存在补交信息通路，但依赖 controller 正确使用。
- [fix loop](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L354-L443) 未在接口变化后明确要求刷新剩余计划和已生成未派发 brief；这是流程缺口，不是实际 agent 必然漏做的证明。
- [inline final review](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/executing-plans/SKILL.md#L234-L268) 明确传 plan、spec、Review Focus；[SDD final review](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/SKILL.md#L445-L468) 明确 diff 和 deferred/parked ledger，却无相同输入列表。只据评审数量不能推断覆盖面。
- [brainstorming](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/SKILL.md) 已要求区分用户选择与 agent 自定并让用户确认描述；但 [builder check](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/brainstorming/builder-check-prompt.md) 只拿设计文档，检查能否规划，不直接对照原请求。其通过不能证明设计忠实于用户原意。

## #2086：小补丁支持什么，实验不能证明什么

已合并 [PR #2086](https://github.com/obra/superpowers/pull/2086) 的[固定补丁](https://github.com/obra/superpowers/commit/538d65120be78ad147fc82ea392da2ed0edc4cdc)仅两文件 +7/-1：plan header 加 Spec 路径，执行端读取。作者报告同一六任务、五项合成冲突中，无 spec 解决 0–1/5，spec-present stock 三次为 4/5、5/5、4/5。它是作者历史实验报告，不是五个独立项目或本轮运行。**[一手：补丁及合并状态；社区：作者实验报告]**

本轮独立读取研究仓库固定 `6e6f33ff0e6a724c6568c5d9252d001a15559b0b` 的材料后，结论需收窄。**[研究：实验设计与夹具阅读]**

1. **文件与权威确认混在一起。** [spec 组 story](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/story.md) 不仅增加文件，开场还点名它，模拟用户遇冲突会明确回复 spec 有权威性。[作者日志 L342–380](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/logs/2026-08-03-plan-decomposition-campaign.md#L342-L380) 明言 stock control 检出五项后，靠该答复才继续裁决；[无 spec 组](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-consistency/story.md) 没有此答复。可支持上位判据可达且权威明确，不能隔离成文件自身净效应。
2. **不同不自动等于错。** [答案表](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/seeded-truth-ledger.md) 中不同组件 timeout、命名或入口 priority 下限，在真实系统可能有意不同；[新增 spec](https://github.com/prime-radiant-inc/superpowers-autoresearch/blob/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/scenarios/cp-x10-spec/fixtures/docs/superpowers/specs/job-queue-spec.md) 明确要求统一后才可判违规。0–1/5 不是一般漏洞漏检率。
3. **公开叙述日志不等于原轨迹。** PR 称 raw records public；本轮取得日志、报告和合成 fixture，未在未截断的递归 tree 中定位 cp-x10 各 rep 原始 rollout／最终树，不能独立重算。[预设完成树](https://github.com/prime-radiant-inc/superpowers-autoresearch/tree/6e6f33ff0e6a724c6568c5d9252d001a15559b0b/campaigns/cost-pathologies/fixtures/cp-x10-consistency-outcomes/complete)不是模型输出。日志还披露判分曾把空 root 当缺陷消失、随后修正手查；此处保留限制，不重复开展判定器审计。

另一个[固定补丁 7474980](https://github.com/obra/superpowers/commit/7474980bb9649fe818aace41ea0724b6a6e11def) 已要求最终 reviewer 不因 spec 沉默忽略实际使用行为，列出 Declined to judge，并让 inline 传 Review Focus。这反驳“完全没有挑战 spec 的设计”，但不能代替原请求→spec 的核对。**[一手：补丁；研究：边界]**

## 最小动作、成本与停止条件

- 原意遗漏：选原请求中的具体成功条件对照实际使用路径；只有用户能决定的歧义才问，不能凭“合理用户”创造新需求。
- 接缝遗漏：按具体风险检查新产物→旧消费者、旧输入→新路径，例如新 token 到旧 verifier；已有测试未区分假设时再补反例，不统一规定 probe 数量。
- 接口改变：定位受影响的剩余任务、交付命令和已生成 brief，更新后再派发，并核验实际消费者路径，不重审整仓。

这些动作增加少量来源阅读、影响面定位和定向验证；本轮未测净时间／费用收益。判据已在输入、无跨任务消费者且已有独立检查的简单修改可不叠加；额外 reviewer 若只重复发现，应撤掉而保留必要的输入与运行检查。**[研究：条件建议]**

本轮已区分错误计划自洽、原意遗漏、未改代码接缝及后续计划过期，08/09 只作最小建议修订。下一阶段需要原报告的公开补丁与同条件复测，或不同真实任务中新增发现、误报与人工处理成本；没有这些证据，不为完成流程新建模板或重复本轮审计。
