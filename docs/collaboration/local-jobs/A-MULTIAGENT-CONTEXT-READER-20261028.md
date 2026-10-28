# A-MULTIAGENT-CONTEXT-READER-20261028 · 照多代理页核上下文候选
id: A-MULTIAGENT-CONTEXT-READER-20261028
owner: dot-A
status: running
kind: reader-test
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 405523084ed59127c27ba7ee7aab3954dbd9e869
result_branch: relay/a-multiagent-context-reader-20261028

目标：为待接收的真实上下文候选 `78c63efb2b1719037ab6011c1d1c5e77e8dc0b93:docs/decisions/context-management.md` 核本轮新增的“同题压缩／纠错后重开、接续约束”判断及可复用引用；候选在 `dot-a/context-source-candidate-20261028`。独立查官方、社区原文与研究能否支持具体主张，不重做已接收的 HN 跟进、恢复故障广搜或在途并行接收来源任务。
规格：按 write-task-guide 第4步及 reader-test Workflow，接收端将本任务交给未参与写作、此前未读该页的新上下文读者；只照下方 `8e1b44d925bb820fa67acd78ca83a9beadd1ffba` 的 long-tasks 全文完成任务，不给旧答案或作者辅导。读者自行划分独立调查，真实原生委派、收回证据并整合验收；无委派工具就报告具体缺口，不独演。本页四反引号仅包裹原文，相对链接按 `docs/decisions/` 解析；为补方法另翻文档须记卡点。
成果：模型只写 `docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-CONTEXT-READER-20261028/` 内的结果、独立调查证据与照页卡点，各写者独占文件；不修改任何答案页、其他任务或配置。交每条主张的支持／不足、原始永久链接与精确段落／短摘录、版本日期及可直接复用的引用，区分官方能力、团队实作、用户自报与推断；未读原文明确列为缺口，不收整篇原文。
验收：读者以外的验证者独立回看原文与实际委派／回收产物，核主张和引用对应、分工与写入不重叠、主线确实核过证据；结果须足以让 dot-A 判断候选哪些可接收、哪些需修。另记原生工具、实际交接与接收过程的公开摘要、卡点所在页段及补读内容，分清页面、环境、模型原因；不凭自报判做通，不把来源审查当压缩实测。check_repo、check_public、空白检查通过后回 review_ready，由 dot-A 接收，不自动接收。
边界：开工核最新 main 与负责人分支，同题已有在途执行就报告重叠；只读公开原文和候选，不读私人会话、凭据、账号用量或本机其他配置，不安装或新开服务，不绕拒绝，不触发 CI。接收端按共享四并行调度，本单元最多两小时；仅脚本另回写本任务状态并发布指定结果分支，保留现有产物；阻塞交具体动作、原错误、未完成项和恢复条件。
````markdown
# 子代理怎么分工，长任务怎样接回验收

**🟡 一位主 Agent 保留完整目标、共享决定和最终验收，把能独立交付的调查或实现交给原生子代理。** 从读代码、查日志、找测试缺口起步；实现先定接口和写入归属，收到结果就核产物，最后在整合版本验收。原生委派够用就沿用，出现写入冲突或协调缺口时再加隔离与编排。本仓已有委派与接收实践，本版指南的本机新读者照做仍待验。

## 第一步：拿正在做的需求，跑通一次交回

**先给目标和验收，再让主 Agent 找可独立的工作。** 在支持子代理的 Codex 或 Claude Code 中打开项目，确认项目指引、依赖、测试入口和权限可用。下面按 Memos 的真实“隐藏已完成任务”需求与已实施取舍整理；用在自己的项目时，替换功能和验收，不必重做 Memos。

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

**做成的标志是整合后的功能满足原验收。** 读密集支线交简短结论和 `file:line`；实现支线交完整提交、可应用补丁或可核对的完整工作区差量，检查结果须指向该产物。主线逐项核对、修正遗漏，再在最终版本走真实入口。高风险或已有漏审时加一次独立检查，已有有效审查可复用；细节见 [08 §6](../08-multi-agent.md#6-操作手册从一个大任务到并行执行)。

本仓在这项需求中曾漏掉编辑器的 raw Markdown 列表，独立审查用真实组件的失败用例推动修复。这是接收时该追的证据：是否覆盖实际消费者，而非实现者是否说“完成”。实际补丁、运行入口和仍待验收的路径见[采用记录](../../experiments/memos-reading-adoption.md)；原需求见 [Memos #6476](https://github.com/usememos/memos/issues/6476)，实施与组件检查原核实 2026-10-25。

## 什么时候加 worktree 或团队编排

| 当前需要 | 选择 | 开始前确认 |
|---|---|---|
| 独立调查、日志分析、审查，或已切开的实现 | **原生按需委派，默认** | 一段交接能说清目标；主线能核对结果 |
| 多个独立目标同时写代码，需要隔离检出与分支 | **每个独立写入面一个 worktree** | 所需未跟踪资料、依赖、端口和测试数据目标各自就绪 |
| 原生委派已难以承担共享任务、自主认领与队员协调 | **再试 Agent Teams 等编排** | 当前客户端支持所需能力，权限、退出和恢复行为适合任务 |

**先定共享决定，再并行写入。** 接口、数据契约和失败行为未定时，先并行调查；涉及同一决定的实现先收敛。worktree 解决检出隔离，服务和数据库仍需分别安排。中文使用者遇到研究资料、项目 Skill 未被 Git 跟踪，因而没有随 worktree 带过去；准备这些输入比增加代理更先要紧。

**按协调缺口选 Teams，不把“能互发消息”当唯一分界。** Claude Code 当前的普通子代理在工具集保留 `SendMessage` 且知道有效目标时也能通信；具体入口与限制看官方文档。Teams 仍属实验功能，默认关闭，`/resume`、`/rewind` 当前不能恢复 in-process 队员。

**依据**：[官方] [Codex 子代理](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Claude Code 子代理通信](https://code.claude.com/docs/en/sub-agents#resume-subagents)及 [Teams 比较与限制](https://code.claude.com/docs/en/agent-teams#compare-with-subagents)；[社区原帖] [V2EX：worktree 资料缺失](https://v2ex.com/t/1243449)。选型与资料缺失原核实 2026-10-26，通信边界复核 2026-10-28。

## 实施交出去，验收收回来

**借团队实践的机制，不照搬固定角色链。** 以下三项能改变怎么派、怎么收：

- **HumanLayer：短交接，主线验收。** 实施代理实际配置 `model: inherit`；主线传文档路径和范围，收到结果后检查验证证据、先修失败再推进。没有 outline 也可直接实施；借这条接收方式即可，整套 RPI 插件本仓未试用。
- **Anthropic：共享状态的串行角色合回主循环。** 团队在企业代理部署中发现，路由、规划和领域角色的多次交接会丢信息、增加延迟；把领域程序按需加载为 Skill，保留真正独立的并行工作。其迁移套件以端到端任务完成评价设计，适合借作验收原则。
- **Cursor：不强迫每次探索都委派。** 团队撤掉强烈鼓励代码探索子代理的提示，让委派更均衡；独立上下文也会带来重复劳动和过期任务，要随结果调整分工。

**社区反馈有分歧，独立评审按实际风险加。** 有使用者认为跨模型评审值得更长等待，也有人自报逐提交评审两周、86 次仅挡住一次注释旧链接后停用。两者都是个人经验；判断是否保留，看新增发现与最终交付的等待、费用和返工，而非代理数量。

**依据**：[项目实际配置] [HumanLayer 实施代理](https://github.com/humanlayer/skills/blob/653b6411c1f70c275a18e37673b042ff99f67ceb/plugins/rpi/agents/outline-implementer-agent.md)与[接收流程](https://github.com/humanlayer/skills/blob/653b6411c1f70c275a18e37673b042ff99f67ceb/plugins/rpi/skills/rpi/references/implement-outline/process.md#L13-L25)，流程原核实 2026-10-26；[团队实践] [Anthropic 10-22 原文](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)及[迁移套件验收规则](https://github.com/anthropics/single-agent-loop-kit/blob/c43796287b83bec847db923f07131d1cc8de750d/skill/steps/01-baseline.md)、[Cursor 9-23 原文](https://cursor.com/blog/improved-token-efficiency)；[社区原评论] [跨模型评审值得等待](https://www.reddit.com/r/ClaudeAI/comments/1xdwquj/comment/19rkaxueg03mo/)、[撤掉逐提交评审](https://www.reddit.com/r/ClaudeAI/comments/1xdwquj/comment/19rk91uae9oip/)。配置与原文复核 2026-10-28；本仓尚无同任务同验收下的提速、节费比较。

## 长任务离开前：保留能继续的入口和结果

**先确认执行环境、权限和预算能支持离开后的工作。** 本机执行需要电脑和客户端继续运行；要关机，就在开跑前选择已配置好的远端或云端环境。结果回来后仍由主线接收，后台运行本身不保证持续推进。

在现有任务记录留目标与取消项、版本及未提交差量、已验结果、待收子任务、下一步与停点。遇权限或输入缺口，只停依赖它的部分；外部操作结果不明，先查原任务、文件与远端，再决定重试。需要换执行者时，先确认原写者已停止，再交出同一写入面。恢复入口见 [20 §4](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)与 [checkpoint-resume 模板](../../templates/codex/.agents/skills/checkpoint-resume/SKILL.md)。

## 何时不拆

**小改动、共享状态多、交接反复或整合积压时，用一位 Agent 连续完成。** 同一上下文里的可复用流程可写成 Skill；目标含糊先补决定，必须真人判断的地方保留停点。先跑通一次“交回→核产物→整合验收”，再把更长的同类工作放到后台。
````
