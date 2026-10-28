# u1 照页记录：多代理长任务页在本单元的执行情况

页面：`8e1b44d925bb820fa67acd78ca83a9beadd1ffba:docs/decisions/long-tasks.md`（全文由任务文件给出，未改任务文件，未改页面所在文件）
真实任务：核查候选 `78c63efb2b1719037ab6011c1d1c5e77e8dc0b93:docs/decisions/context-management.md` 本轮新增的“同题压缩／纠错后重开、接续约束”判断与引用
单元日期：2026-10-28（会话跨至 10-29）

## 做到的步骤

1. **先给目标和验收**（页面第一、二步）：把本任务收敛成“每条新增主张给出支持／不足、永久链接、精确摘录、日期、来源类型，足以让 dot-A 决定接收或修”。
2. **找可独立的工作**：把来源核查拆成三条调查线——官方能力（Anthropic 文章、Claude Code 文档）、社区原文（Reddit）、研究（arXiv 论文 + OpenCode 实现）。三条线结论互不依赖，可并行；本次因无委派工具改为顺序执行。
3. **尝试原生委派**：确认本会话没有子代理／Task 工具（见卡点 1），未发生真实委派。
4. **收回证据并整合验收**：逐条判定 C1–C5，标出可复用引用与缺口，见同目录 `u1-claim-verification.md`。
5. **未做**：没有实现类工作，因此没有 worktree、共享写者、单测入口或整合版本；页面“实施交出去，验收收回来”的后半段不适用于本任务。

## 卡点（按页面原句）

### 1. “把能独立交付的调查或实现交给原生子代理”／“在支持子代理的 Codex 或 Claude Code 中打开项目”

- **缺什么**：本会话的 Claude Code 没有原生子代理工具。可用工具里只有 Bash／Read／Write／Grep／WebFetch／WebSearch／SendMessage／TaskStop 等；`ToolSearch` 查 “spawn subagent task agent delegate” 只返回 `TaskStop`、`SendMessage`、`EnterWorktree`、`CronCreate`，没有 Task／spawn。`ListAgents` 只列出 8 个与本任务无关的用户 Desktop 会话，没有属于本任务的队员。
- **做错什么**：一开始考虑用 `SendMessage` 把“官方线／研究线”发给某个 peer 会话，伪装成委派。核对后放弃：那些是用户正在用的无关交互会话，借用属于占用他人环境、跨会话越权，而且不是页面说的“原生子代理”。最终没有发任何消息。
- **页面缺什么**：页面假设客户端支持子代理，没有写“客户端不支持时怎么办”。任务规格补了“无委派工具就报告具体缺口，不独演”，但那是任务文件的话，不是页面的方法。照页执行会停在这一步。
- **影响**：三条调查线由同一读者顺序完成，证据可信度靠原始链接可回看，不靠“独立代理交叉验证”。这不能替代页面要求的委派，也不能证明页面方法在本机可跑通。

### 2. “可把渲染边界调查与偏好、导出消费者调查交给不同子代理”

- **缺什么**：页面只给了 Memos 实现任务的拆分例子（渲染边界／偏好与导出消费者），没有给“来源核查”这类研究任务的拆分维度。
- **怎么做的**：按来源类型拆成官方／社区／研究三条线。这是读者自己的映射，不是页面给的。
- **风险**：官方线与研究线都要读原文，边界不完全独立；社区线才是真正可独立交付的。若真有子代理，应该把社区原文核查单独交出去，其余两条留在主线。

### 3. “要求返回代码位置、保留行为和可运行的检查”

- **缺什么**：来源核查没有 `file:line`、没有可运行检查。页面把交付物默认成代码产物，没有覆盖研究核查的验收格式。
- **怎么做的**：改成“永久链接 + 精确段落／短摘录 + 版本日期 + 来源类型（官方能力／团队实作／用户自报／推断）”。这也是读者自己的映射。
- **后果**：无法用“跑一遍检查”来验收，只能靠回看原文；页面“检查结果须指向该产物”的要求对本文不适用。

### 4. “实现按独立目标派发，每个共享文件只有一个写者”

- **缺什么**：没有子代理，只有我一个写者；这条约束在本单元没有被真正检验。
- **怎么做的**：所有产物都用 `u1-` 前缀单独成文件，没有改任何答案页、候选页或其他任务文件。

### 5. “做成的标志是整合后的功能满足原验收”

- **缺什么**：本任务没有“功能”可整合。页面用功能验收作收尾，没有给“核查任务怎样算做成”。
- **怎么做的**：映射为“每条主张都有判定、证据与可复用引用；缺口明确列出，dot-A 能据此决定接收或修”。这是读者自定的验收，不是页面的。

### 6. “本版指南的本机新读者照做仍待验”

- 本单元正是这句话的验证。结论：**委派那一步在本环境做不了**；不是页面文字不清，而是页面默认的客户端能力不存在。
- 分类：环境原因（无子代理工具）为主，不是模型原因，也不是页面表述错误。页面的方法本身在支持子代理的客户端里仍可能成立。

## 页面之外翻了什么

- `docs/decisions/context-management.md` 的候选版本与 base 版本 diff：任务对象，必须读。
- 候选引用的公开原文：
  - <https://www.anthropic.com/research/harness-design-long-running-apps>
  - <https://code.claude.com/docs/en/best-practices#steer-the-session>
  - <https://www.reddit.com/r/ClaudeCode/comments/1x0jmvm/when_do_you_use_clear_vs_compact_in_your_daily/>（不可达）
  - <https://arxiv.org/abs/2610.31778>、<https://arxiv.org/html/2610.31778v1>
  - <https://github.com/aisa-group/compaction>
- 没有读 `AGENTS.md`、`docs/collaboration/LONG-TERM-PLAN.md`、`docs/collaboration/TASKS.md`，也没有读其他决策页、同主题教程或既有 reader-test 记录，避免给这次“新读者”测试引入旧答案。
- 没有读已接收的 HN 跟进、恢复故障广搜、在途并行接收来源任务，按任务边界避开重叠。
- 未安装软件、未开服务、未用凭据、未开可见浏览器、未操作桌面、未修改任务文件。

## 产物位置

- 主张核查与可复用引用：`docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-CONTEXT-READER-20261028/u1-claim-verification.md`
- 本记录：`reader-tests/A-MULTIAGENT-CONTEXT-READER-20261028-u1.md`
- 另一份照页卡点记录：`docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-CONTEXT-READER-20261028/u1-page-gaps-and-delegation.md`

## 给 dot-A 的接收建议（仅基于本次核查）

- C1、C2、C4 可接收，按 `u1-claim-verification.md` 的“需修”改三处：C1 的来源类型与术语、C4 的预印本身份与链接固定。
- C3（Reddit）在拿到可回看的原文摘录前不要按已核事实接收；最稳妥是删去具体模型和行为细节，或标“未见原文”。
- C5 的三条验收可保留，但要标成本仓建议／推断，不与论文结论混写。
