# A-MULTIAGENT-CONTEXT-READER-20261028 · u1 读者记录

任务：照 `docs/decisions/long-tasks.md` 的方法（全文由任务文件给出），核查候选 `78c63efb2b1719037ab6011c1d1c5e77e8dc0b93:docs/decisions/context-management.md` 本轮新增的“同题压缩／纠错后重开、接续约束”判断与引用。
单元：u1-a0-2026-10-28T155416927Z。日期：2026-10-28（会话跨至 10-29）。

## 做到哪一步

- 完成三条来源线的取证与逐条判定（C1–C5）：官方 2 条、研究 2 条（论文 + OpenCode 实现）、社区 1 条未取得原文。
- 结论：C1 支持但“团队实作”归类需收紧；C2 支持；C3 Reddit 未核实；C4 支持但需标预印本；C5 部分支持（推断）。
- **未完成页面的核心步骤“真实原生委派”**：本会话没有子代理／Task 工具，三条调查线由同一读者顺序执行，不是委派。页面没有写无委派工具时的退路。
- 未做实现类工作，因此没有 worktree、共享写者冲突、可运行测试或整合版本。

## 产物在哪

- 主张核查、原文摘录、可复用引用、缺口：`docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-CONTEXT-READER-20261028/u1-claim-verification.md`
- 照页卡点与委派记录：`docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-CONTEXT-READER-20261028/u1-page-gaps-and-delegation.md`
- 本记录：`reader-tests/A-MULTIAGENT-CONTEXT-READER-20261028-u1.md`

（任务文件要求产物写在 `docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-CONTEXT-READER-20261028/`；本次派发指令要求记录写进 `reader-tests/`。两处都写，正文不重复。）

## 卡点（页面哪一句、缺什么、做错过什么）

1. **“把能独立交付的调查或实现交给原生子代理”／“在支持子代理的 Codex 或 Claude Code 中打开项目”**
   - 缺：本会话 Claude Code 无原生子代理工具（`ToolSearch` 无 Task／spawn；`ListAgents` 只有 8 个无关用户会话）。
   - 做错：一度想用 `SendMessage` 把调查发给无关 peer 会话冒充委派；核对后放弃，属于占用他人环境且不是原生子代理。最终未发消息。
   - 页面缺：客户端不支持子代理时怎么办，页面没写。

2. **“可把渲染边界调查与偏好、导出消费者调查交给不同子代理”**
   - 缺：页面只给 Memos 实现任务的拆分例子，没有来源核查的拆分维度。只能自己按官方／社区／研究拆；其中只有社区线真正可独立交付。

3. **“要求返回代码位置、保留行为和可运行的检查”**
   - 缺：来源核查没有 `file:line` 和可运行检查。改成“永久链接 + 精确摘录 + 日期 + 来源类型”，是读者自己的映射。

4. **“每个共享文件只有一个写者”／“做成的标志是整合后的功能满足原验收”**
   - 缺：没有子代理和功能产物，这两条在本单元无法真正检验；写成 `u1-` 独占文件，验收改成“每条主张有判定与证据”。

5. **“本版指南的本机新读者照做仍待验”**
   - 结论：委派这一步在本环境做不了。原因分类：环境（无子代理工具）为主，不是页面表述或模型原因。

## 页面之外翻了什么

- 只读了任务对象：`docs/decisions/context-management.md` 的候选版与 base diff。
- 为取证读了候选引用的公开原文：Anthropic 长程应用文章、Claude Code best-practices、arXiv 2610.31778、`aisa-group/compaction`、Reddit 原帖（不可达，见下）。
- 没有读 `AGENTS.md`、`LONG-TERM-PLAN.md`、`TASKS.md`、其他决策页、同主题教程或既有 reader-test，避免旧答案污染。
- 没有读已接收的 HN 跟进、恢复故障广搜、在途并行接收来源任务。
- Reddit 原帖不可达：WebFetch 域名级拒绝；curl／urllib TLS 失败；allorigins 返回封锁页；codetabs／corsproxy 失败；多个 redlib 镜像与 Wayback 均 “Socket is closed”；站内搜索无副本。这是本次唯一无法判定的来源缺口。
- 未装软件、未开服务、未用凭据、未开可见浏览器、未操作桌面、未改任务文件。

## 核对

验证者独立复核（2026-10-29）：候选 diff `40552308..78c63efb`、三条官方／研究来源、公开实现仓库、工具环境与产物边界。不采信自报。

**主张判定：与读者结论一致。**

- C1：Anthropic 文章作者 Prithvi Rajasekaran 自述为 Labs 成员，页脚 2026-03-24，第一人称；“compaction alone wasn't sufficient…”、“context resets—clearing the context window…structured handoff”、“Opus 4.5 largely removed that behavior…drop context resets”、“Agent SDK's automatic compaction”均在原文。读者“团队实作报告”需收紧的判断成立。
- C2：镜像页 `## Steer the session` 下三句与读者摘录逐字一致（“after two failed corrections run `/clear`…”、“`/clear` between unrelated tasks”、“`/compact` with a focus, like `/compact keep the API changes and the test commands`”）。
- C4：arXiv 2610.31778v1 核实：44 sessions／269 constraints、81% preserved、160K–380K 对应 16–38%、process 35.9%／scope 36.8%、“not its effect on the final outcome”、四模型（Opus 4.6、GPT-5.3-Codex、GPT-5.4、Gemini 3.1 Pro Preview）、PaperBench 3 篇／ProgramBench 2 任务／PostTrainBench 2 基座×3 目标；`aisa-group/compaction` HEAD=`7a282c7b…`，`docs/COMPACTION.md` 确写 “copy of OpenCode … at upstream commit `41612b3db`”。读者各项修正有据。
- C3：本环境 WebFetch／WebSearch 均取不到 Reddit 原帖，与读者一致；缺口判定成立。
- C5：三条验收与“撤回要求／排除旧方案理由”确非论文直接测量，读者“推断”定位正确。

**卡点判定：五条都主要是页面缺信息，不是纯环境。**

- 1／5：页首已写“在支持子代理的 Codex 或 Claude Code 中打开项目”，前提并非没写；缺的是无子代理工具时的动作（可与“何时不拆”的单 Agent 路径衔接）。读者归为“环境为主、页面无错”不完整。
- 2：页面只有 Memos 实现拆分例，没给来源核查的拆分维度，成立。
- 3：页面已有“读密集支线交简短结论和 `file:line`”，读者“默认代码产物”说过头；真正缺的是外部来源核查的交付／验收格式。
- 4：页面只用“功能满足原验收”定义做成，未覆盖核查类任务，成立。

**读者没意识到的错误**

1. 卡点1标题引了“在支持子代理的 … 中打开项目”，正文却又说“页面假设客户端支持子代理”，前后矛盾；前提写了，缺的是不支持时的动作。
2. 页面末节“何时不拆”已给“小改动、共享状态多、交接反复或整合积压时，用一位 Agent 连续完成”的单 Agent 退路，读者说“页面没有写退路”过宽。
3. 页面“做成的标志…”段前一句已写“读密集支线交简短结论和 `file:line`”，卡点3说“页面把交付物默认成代码产物”过宽。
4. C2 建议“候选目前只把该页用在‘纠错两次’处”不准确：候选该段依据行已列“Claude Code 会话引导”链接；可补的是把 `/clear` 与 `/compact` focus 两句摘录进正文。
5. 读者称“官方线与研究线都要读原文，边界不完全独立；只有社区线真正可独立交付”——独立性应按结论是否互相依赖判断；官方线与研究线来源、结论互不依赖，可以分别派发。
6. C3 只写“原帖不可达”，未区分“网络封锁”与“引用本身可能不存在／写错”（WebSearch 也检索不到该帖或标题）；两者对 dot-A 的处理不同：找存档 vs 改引用。
7. 未记录开工核最新 main／负责人分支与同题在途重叠（任务边界要求），产物无这项检查结果。

**验收**

- 代跑 `scripts/check_repo.py`：541 文件，0 错误；`scripts/check_public.py`：952 文件，0 发现；产物无本机绝对路径，无 CRLF、tab、行尾空格。读者未记录这几项与 review_ready 状态。
- 写入边界：`git status` 只有本任务 artifacts 与 reader-tests 两份未跟踪文件，未改答案页、候选页或配置。
- 结论：主张与引用对应、主线确实核过证据、结果足以让 dot-A 逐条决定接收或修；委派缺口按任务约定已如实报告。读者整体做成，但卡点归因偏向环境，低估了页面缺退路／缺核查验收格式这两处。
