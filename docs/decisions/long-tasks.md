# 子代理怎么分工，长任务怎样接回验收

**🟡 一位主 Agent 保留完整目标、共享决定和最终验收，把能独立交付的调查或实现交给原生子代理。** 从读代码、查日志、找测试缺口起步；实现先定接口和写入归属，收到结果就核产物，最后在整合版本验收。原生委派够用就沿用，出现写入冲突或协调缺口时再加隔离与编排。本仓已有委派与接收实践，本版指南的本机原生委派照做仍待验。

## 第一步：拿正在做的需求，跑通一次交回

**先给目标和验收，再让主 Agent 找可独立的工作。** 在 Codex 或 Claude Code 中打开项目，确认本会话有子代理工具，项目指引、依赖、测试入口和权限可用。没有子代理工具，就由主线按同一验收串行完成，如实记为未委派；不访问或借用无关私人会话，也不绕过权限拒绝。下面按 Memos 的真实“隐藏已完成任务”需求与已实施取舍整理；用在自己的项目时，替换功能和验收，不必重做 Memos。

```text
给 Memos 的清单阅读增加“隐藏已完成任务”开关，默认关闭；
偏好只保存在当前浏览器。未完成子项仍保留父项上下文，
编辑和分享图片使用完整原文，不新增服务端字段。

你负责完整交付。先读项目指引、实际渲染链、偏好存储和测试入口。
可把渲染边界调查与偏好、导出消费者调查交给不同子代理，
要求返回代码位置、保留行为和可运行的检查；主线据此确定接口。
实现按独立目标派发，每个共享文件只有一个写者；紧耦合部分一起做。
交回基线版本、完整改动、实际检查命令与结果，以及剩余问题。
你收到结果后核对实际差量和证据；需要独立判断时补针对风险的审查。
按依赖整合，跑受影响测试，再在实际页面检查隐藏与恢复、嵌套上下文、
键盘操作、刷新后偏好、编辑原文和分享图片。未运行项明确列出。
```

**来源核查按互不依赖的主张或来源线拆分。** 每条交回支持／不足的判断、原始永久链接、精确段落或短摘录、版本日期与来源类型，未读到原文的列为缺口。主线按原任务逐项回看主张与来源是否对应，区分官方能力、实际使用反馈和推断，再决定采用、修订或保留缺口；这类任务验收证据与结论，不要求代码检查。高风险或已有漏审时加一次独立检查，已有有效审查可复用；交回与整合细节见 [08 §6](../08-multi-agent.md#6-操作手册从一个大任务到并行执行)。

本仓在这项需求中曾漏掉编辑器的 raw Markdown 列表，独立审查用真实组件的失败用例推动修复。这是接收时该追的证据：是否覆盖实际消费者，而非实现者是否说“完成”。实际补丁、运行入口和仍待验收的路径见[采用记录](../../experiments/memos-reading-adoption.md)；原需求见 [Memos #6476](https://github.com/usememos/memos/issues/6476)，实施与组件检查原核实 2026-10-25。

## 什么时候加 worktree 或团队编排

| 当前需要 | 选择 | 开始前确认 |
|---|---|---|
| 独立调查、日志分析、审查，或已切开的实现 | **原生按需委派，默认** | 一段交接能说清目标；主线能核对结果 |
| 多个独立目标同时写代码，需要隔离检出与分支 | **每个独立写入面一个 worktree** | 所需未跟踪资料、依赖、端口和测试数据目标各自就绪 |
| 原生委派已难以承担共享任务、自主认领与队员协调 | **再试 Agent Teams 等编排** | 当前客户端支持所需能力，权限、退出和恢复行为适合任务 |

**先定共享决定，再并行写入。** 接口、数据契约和失败行为未定时，先并行调查；涉及同一决定的实现先收敛。worktree 解决检出隔离，服务和数据库仍需分别安排。中文使用者遇到研究资料、项目 Skill 未被 Git 跟踪，因而没有随 worktree 带过去；准备这些输入比增加代理更先要紧。

**已经用 Portless 时，把代理启停交给一个协调者；独立代理须同时分开端口和状态目录。** worktree 子域已能区分应用，不必每个 Agent 各启一个代理。正式包 0.15.12 与当前固定主干的[真实 CLI 实试](../../experiments/portless-state-isolation/README.md)发现：同一 `PORTLESS_STATE_DIR` 下先启 A 再启 B，`stop -p A` 会停掉 B；独立目录的停止控制通过。入口给出当前版本的隔离做法和本地窄补丁，不把端口分开当成进程归属已隔离，也不保证并发启停安全。核实与 Linux 实试：2026-10-31。

**按协调缺口选 Teams，不把“能互发消息”当唯一分界。** Claude Code 当前的普通子代理在工具集保留 `SendMessage` 且知道有效目标时也能通信；具体入口与限制看官方文档。Teams 仍属实验功能，默认关闭，`/resume`、`/rewind` 当前不能恢复 in-process 队员。

**依据**：[官方] [Codex 子代理](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Claude Code 子代理通信](https://code.claude.com/docs/en/sub-agents#resume-subagents)及 [Teams 比较与限制](https://code.claude.com/docs/en/agent-teams#compare-with-subagents)；[社区原帖] [V2EX：worktree 资料缺失](https://v2ex.com/t/1243449)。选型与资料缺失原核实 2026-10-26，通信边界复核 2026-10-28。

## 实施交出去，验收收回来

**分工不变，按项目入口分开定向反馈与最终验收。**

| 阶段 | 怎么做 |
|---|---|
| 实现中的反馈 | 跑覆盖改动行为的定向检查；依赖图看不到动态消费者时补查，报告遗漏和零测试，不当成行为已验 |
| 同机重检查 | 并跑时超时或资源紧张，先核争用；确认后用已有队列或错峰，调查、实现继续。独立 runner 或无争用证据时，保现有并行 |
| 最终交付 | 实现支线交完整产物及对应检查；主线整合后，在最终版本跑项目要求的完整检查与真实入口。定向绿不代替交付通过 |

**不要统一降低 workers 或放宽超时。** n8n 的日常入口要求定向测试、单 worker，综合检查留 CI；Inspector 将同机门禁排队后，独跑比较中 cap=4 更慢、两档均零失败，保留默认。检查仍失败就查原因，不以重跑掩盖。本仓未实试该调度。

**借团队机制，不搬固定角色链。** HumanLayer 用短交接、由主线核证据并先修失败；Anthropic 将共享状态的串行角色合回主循环、按需加载 Skill；Cursor 撤掉过强的探索委派提示，也要防重复劳动和过期任务。RPI 整套插件本仓未试用。

**独立评审按风险加。** 社区有人认为跨模型评审值得等待，也有人逐提交评审两周、86 次仅挡住一次旧链接后停用；都是个人经验。保留与否看新增发现、等待、费用和返工，不看代理数。

**依据**：[项目实际配置] [HumanLayer 实施代理](https://github.com/humanlayer/skills/blob/653b6411c1f70c275a18e37673b042ff99f67ceb/plugins/rpi/agents/outline-implementer-agent.md)与[接收流程](https://github.com/humanlayer/skills/blob/653b6411c1f70c275a18e37673b042ff99f67ceb/plugins/rpi/skills/rpi/references/implement-outline/process.md#L13-L25)，流程原核实 2026-10-26；[团队实践] [Anthropic 10-22 原文](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)及[迁移套件验收规则](https://github.com/anthropics/single-agent-loop-kit/blob/c43796287b83bec847db923f07131d1cc8de750d/skill/steps/01-baseline.md)、[Cursor 9-23 原文](https://cursor.com/blog/improved-token-efficiency)；[社区原评论] [跨模型评审值得等待](https://www.reddit.com/r/ClaudeAI/comments/1xdwquj/comment/19rkaxueg03mo/)、[撤掉逐提交评审](https://www.reddit.com/r/ClaudeAI/comments/1xdwquj/comment/19rk91uae9oip/)。配置与原文复核 2026-10-28；本仓尚无同任务提速、节费比较。

**检查调度依据**：[项目实际配置] [n8n 定向入口](https://github.com/n8n-io/n8n/blob/2e85535612dcdf6c641dca981814fba176244146/AGENTS.md#L344-L358)、[Inspector 排队后的 worker 比较](https://github.com/modelcontextprotocol/inspector/blob/e3217388c8590bcf6796fd8d0528a875ade1ac1f/vitest.shared.mts#L81-L139)；[开源实现] [Pinchy 定向测试的覆盖边界](https://github.com/heypinchy/pinchy/blob/e21dacc823039ff61039ec84510a214b58d008de/scripts/test-related.mjs#L1-L14)；[社区原帖] [LINUX DO：多会话门禁超时](https://linux.do/t/topic/2913933)，未见解决后回执。源码与原帖核实 2026-10-28；项目测量为作者自报。

## 长任务离开前：保留能继续的入口和结果

**先确认执行环境、权限和预算能支持离开后的工作。** 本机执行需要电脑和客户端继续运行；要关机，就在开跑前选择已配置好的远端或云端环境。结果回来后仍由主线接收，后台运行本身不保证持续推进。

在现有任务记录留目标与取消项、版本及未提交差量、已验结果、待收子任务、下一步与停点。遇权限或输入缺口，只停依赖它的部分；外部操作结果不明，先查原任务、文件与远端，再决定重试。需要换执行者时，先确认原写者已停止，再交出同一写入面。恢复入口见 [20 §4](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)与 [checkpoint-resume 模板](../../templates/codex/.agents/skills/checkpoint-resume/SKILL.md)。

## 何时不拆

**小改动、共享状态多、交接反复或整合积压时，用一位 Agent 连续完成。** 同一上下文里的可复用流程可写成 Skill；目标含糊先补决定，必须真人判断的地方保留停点。先跑通一次“交回→核产物→整合验收”，再把更长的同类工作放到后台。
