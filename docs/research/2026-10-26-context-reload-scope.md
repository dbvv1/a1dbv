# 全量重读循环：减小分块不等于减少输入总量

**先查全量重读来自哪里，再决定缩小单次输出、减少实际索引范围，还是退出全量流程按任务读源码。**
AOCI 固定版本要求压缩后完整重读；分块仍传同一正文，不能靠更小的块解决累计内容装不下。
本轮独立核读公开原帖、回复、文档和源码；AOCI 未试用，未重放报告者现场或测量模型恢复收益。

> 核实：2026-10-26。读者入口：[17 §2.6](../17-troubleshooting.md#26-越聊越笨上下文腐化与压缩丢失)。这是对既有排障建议的补充，不是 AOCI、context-mode 或 QMD 的选型比较。

## 什么证据支持什么判断

| 来源 | 核到的内容 | 能说明什么 |
|---|---|---|
| [Claude Code thrashing 排查](https://code.claude.com/docs/en/troubleshooting#auto-compaction-stops-with-a-thrashing-error)，官方当前文档 | 压缩成功后，大文件或工具输出又填满窗口；建议定向读行段／函数、定向压缩或子 Agent；清空后复发则查 Messages 与启动加载项 | 缩小任务所需输入有用；不是保证把同一全量正文改成小块便能容纳。 |
| [AOCI #114 原帖](https://github.com/aoci-spec/aoci-code/issues/114)，使用者历史报告 | Windows Codex、rc18；先前 Overview 元数据为 936 Entry、151,592 estimated tokens、39 块，chunk_tokens=4000；报告未读完便压缩并再次重载。作者当次调查只核版本和源码，没有主动重放多轮循环或运行 rc20 | 这是使用者反馈与当时元数据，不是本仓复现；不能把传输未完成计为成功。 |
| [维护者回应](https://github.com/aoci-spec/aoci-code/issues/114#issuecomment-6137035635)，上游解释 | 确认所讨论 rc20/main 没有防循环机制；分块只控单次响应，建议减少 Managed Scope 的实际索引；分层交付和容量停止条件列入 0.2.0 计划 | 支持区分单次大小与累计量；计划不是已发布能力，回复中的减半建议不是通用安全阈值。 |
| [另一使用者的 rc21 成功路径](https://github.com/aoci-spec/aoci-code/issues/114#issuecomment-6409686617)，公开补充反馈 | macOS arm64 Codex；330 Entry、57,352 estimated tokens、15 块，完成交付、确认和 Attestation 后继续任务；明确未复现死循环，小任务重载仍感觉负担较大 | 反例说明并非每次全量交付都失败；该反馈没有独立性能基准，也不证明缩减范围后的收益。 |

`estimated_tokens` 是工具估算，不是实际模型输入或计费量；后一回复也明确不能把逐块 `op=overview` 事件数当完整读取次数，或把每块重复携带的总量相加。这里据机制做条件判断：**完整必读量若超过宿主可用空间，保持总量不变的分块不能消除容量冲突**；具体宿主能容纳多少仍须实际观察。

## 固定源码怎样把这个循环连起来

以下均固定到 [`7351c9de64d2e6de7837f505b921669caf2c1b6f`](https://github.com/aoci-spec/aoci-code/commit/7351c9de64d2e6de7837f505b921669caf2c1b6f)，即本次 fetch 所见 main；与原帖历史核查的 rc20/main 身份分开。

| 环节 | 固定入口 | 结论 |
|---|---|---|
| 全量要求来自工具合同 | [cognition-refresh.md L78–104](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/docs/cognition-refresh.md#L78-L104)、[runtime-rules.txt 第 2a 条](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/textassets/en-US/contracts/runtime-rules.txt#L21) | 已知宿主压缩后，先重新完整 Overview，跟完 next_cursor 到 completed=true，再确认和 Attestation；check_only／probe 不能代替。不是 Codex 对所有工具的普遍要求。 |
| 部分 Attestation 可继续，也仍有完整传输前提 | 同上 L86–93；[overview-delivery.md L69–99](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/docs/overview-delivery.md#L69-L99) | 完整且确认的刷新传输后，满足身份／治理条件的部分或失败 Attestation 可消耗该代并继续 source-bound 任务；这没有解决“传输尚未完成便压缩”。 |
| 分块传的是同一正文 | [交付选择 L194–274](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/internal/mcptools/overview_delivery_v1.go#L194-L274)、[切块 L503–572](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/internal/mcptools/overview_delivery_v1.go#L503-L572)、[取片 L404–435](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/internal/mcptools/overview_delivery_v1.go#L404-L435) | 先 frame 同一 Content，再按 Entry 边界覆盖到正文末尾，最后取对应字节片段；没有按相关性删掉正文。更小块只改变运输分段，还会带各块元数据。 |
| chunk 设置的适用问题 | [overview-delivery.md L10–30、L69–82](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/docs/overview-delivery.md#L10-L30) | 默认 7000、合法范围 4000–24000；宿主单次截断时可调小后重启，但不检测宿主总容量，也不改变正式认知内容。 |

由此选下一步：先确认是**单次输出被截断**，还是**完整链还没结束，累计读入就触发压缩**。前者才直接匹配调小块；后者要改实际必读量或全量认知工作流。新开会话／子 Agent 若仍遵循同样的全量重读要求，也没有改变根因。

## 减少实际范围，要走真实的 Scope Change

**先判断哪些内容确实不值得进入正式索引，再按当前工具流程变更；不要按 token 目标随手砍掉必读材料。** `index`、`observe`、`exclude` 是不同治理角色：observe 保留变化感知而不生成 Entry；变更索引角色不等于删除业务源码。

1. 用 `aoci scope show`、`aoci scope explain <path>`、`aoci scope status` 查当前与期望范围，保留对任务重要的约束和依赖。提出规则只改期望配置，还要由 `scope activate` 或当前 Guide 指定的 preview/apply 流程激活。
2. 既有 Entry 的退出须完成 Retention Review；预览判定覆盖缩减时，按返回流程处理独立审查。当前文档写明需要交互批准时会保存预览并给出 `scope approve`、`scope apply` 顺序，approve 要真实 TTY。这里说的是 AOCI 自身的治理门，不是本仓提交或平台权限的新要求。
3. 检查生效后的角色、Entry 数和完整交付状态，再判断容量是否改善。源码明确把 `transport_constraint` 当作不可放行的缩减理由；运行合同也不允许因批次／token 限制裁掉 Maintain 已返回候选。不能把维护者的简写理解成绕过这些门的两条万能命令。

**任务只需具体源码、又不需要这份全量认知时，明确退出全量流程，按任务读当前源码和相关测试，并保留认知范围说明。** 这是调整工作流的选择，不是把 AOCI 未完成的链改报成功，也不是已有合同内的自动豁免；仍需要全系统判断时，应先解决范围或容量问题。

依据：[Managed Scope 文档 L3–35、L67–75、L112–135](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/docs/managed-scope-and-budget.md#L3-L35)；[角色变更与 CoverageReduction 实现 L223–253](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/internal/scopechange/plan.go#L223-L253)；[授权分类 L260–287](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/internal/scopechange/authorization.go#L260-L287)；[上游测试定义：index→observe 后 Entry 退出、observe 指纹保留](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/internal/scopechange/transaction_test.go#L160-L191)；[合同第 14 条](https://github.com/aoci-spec/aoci-code/blob/7351c9de64d2e6de7837f505b921669caf2c1b6f/textassets/en-US/contracts/runtime-rules.txt#L63)。测试只核定义，未运行。

探索回执：这是已有排障缺口的定向核查，读了 Claude Code 官方现行排障、GitHub 原 issue 全文与两条回复、AOCI 固定文档／实现／测试定义；未做全渠道重扫或产品性能比较。网页缓存最初只显示维护者回复，GitHub API 补得第二条用户评论；固定文件网页抓取未命中缓存后由已 fetch 的公开 Git checkout 核读，无登录或权限绕过。
