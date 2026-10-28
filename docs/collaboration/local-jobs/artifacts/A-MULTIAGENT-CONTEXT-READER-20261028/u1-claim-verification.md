# u1 主张核查：context-management 本轮新增判断与引用

核查对象：`78c63efb2b1719037ab6011c1d1c5e77e8dc0b93:docs/decisions/context-management.md`
（候选分支 `dot-a/context-source-candidate-20261028`，base `405523084ed59127c27ba7ee7aab3954dbd9e869`）

核查范围：本轮 diff 新增的“同题压缩／纠错后重开、接续约束”判断，以及新增或改动的依据链接。未重做已接收的 HN 跟进、恢复故障广搜、在途并行接收来源任务。

核查日期：2026-10-28。
核查方式：本会话无原生子代理工具，三条调查线由同一读者顺序执行，不是真实委派；过程见 `u1-page-gaps-and-delegation.md`。

## 结论速览

| 编号 | 候选主张 | 判定 | 主要缺口 |
|---|---|---|---|
| C1 | Anthropic 长程应用：Sonnet 4.5 提前收尾、压缩不足，改用重开；Opus 4.5 后撤回重开并交给 Agent SDK 自动压缩 | **支持**，归类需收紧 | 原文不是“团队报告”，是 Labs 成员个人第一人称记述；原文无“checkpoint”一词 |
| C2 | Claude Code 官方建议：同一错误纠正两次仍复发时，用吸收教训的新提示重开 | **支持** | 无 |
| C3 | Reddit 原帖：有人每任务清空、有人自报 Opus 5.5 协调任务靠压缩、反对者担心丢掉“试过什么、为什么放弃” | **未核实（缺口）** | 原帖在本环境不可达，未取得任何可核对的原文或存档 |
| C4 | 10 月压缩研究：分数平稳时摘要仍丢工作方法与禁改范围；改造版 OpenCode、少量任务、三个模型；“1M 模型仅测 16%–38%”；44 条真实会话 LLM 判分；未测约束缺失对结果的影响 | **支持**，需补“预印本”限定 | 论文是 arXiv v1 预印本，未经同行评审；OpenCode 链接未固定 commit |
| C5 | 接续成功三条、恢复先核“撤回要求／排除旧方案理由” | **部分支持（推断）** | 三条是候选综合，不是论文结论；“撤回要求”“为什么放弃”未被论文直接测量 |

总体：C1、C2、C4 足以支撑候选的主要判断；C3 不能作为已核证据接收；C5 可作为本仓建议保留，但要标成推断而非“研究发现”。

---

## C1 Anthropic 长程应用实践

候选句（`docs/decisions/context-management.md`，本轮新增）：

> Anthropic 团队的长程应用实践中，Sonnet 4.5 会因自认为接近窗口上限而提前收尾，压缩不足以解决，团队采用检查点加重开；换到 Opus 4.5 后撤掉重开，整次构建改用 Agent SDK 自动压缩。……前者是团队实作报告，后者是操作建议……

**判定：支持（事实成立），但“团队实作报告”归类与“检查点”用词需收紧。**

原文：<https://www.anthropic.com/research/harness-design-long-running-apps>
发布：2026-03-24。作者：Prithvi Rajasekaran，文中自述为 “a member of our Labs team”。全文第一人称（“I've been working”“I designed”“I built”），文末有致谢；这是官方站发布的**个人实作记述**，不是多人团队的实践报告。

逐点对照：

| 候选说法 | 原文摘录 | 结论 |
|---|---|---|
| Sonnet 4.5 自认为接近窗口上限而提前收尾 | “Some models also exhibit ‘context anxiety,’ in which they begin wrapping up work prematurely as they approach what they believe is their context limit.”；“Claude Sonnet 4.5 exhibited context anxiety strongly enough…” | 支持 |
| 压缩不足以解决 | “…compaction alone wasn't sufficient to enable strong long task performance, so context resets became essential to the harness design.” | 支持 |
| 团队采用“检查点 + 重开” | “Context resets—clearing the context window entirely and starting a fresh agent” ＋ “combined with a structured handoff that carries the previous agent's state and the next steps” | 实质支持；原文用 **context reset + structured handoff**，没有 “checkpoint” 一词 |
| 换 Opus 4.5 后撤掉重开 | “Opus 4.5 largely removed that behavior on its own, so I was able to drop context resets from this harness entirely.” | 支持 |
| 整次构建改用 Agent SDK 自动压缩 | “The agents were run as one continuous session across the whole build” ＋ “…the Claude Agent SDK's automatic compaction handling context growth along the way.” | 支持 |

需修／建议：

1. 把“Anthropic 团队的长程应用实践中”“团队实作报告”改为“Anthropic Labs 成员的个人长程应用实验（官方站发布）”或“官方个人实作记述”。这是来源类型问题，影响候选自己“团队实作 vs 操作建议”的对照。
2. “检查点”是本页术语，不是原文术语；若要贴原文，写“清空上下文重开 + 结构化交接”。
3. 原文描述的是 Sonnet 4.5／Opus 4.5（2026-03 发布时），当前 Claude Code 文档已列到 Opus 5.5／Sonnet 5.5。候选已有“不能据此为其他模型设统一阈值”的限定，建议再点明“这是两代前的模型观察”，避免读者当成当前模型行为。

可复用引用（官方，个人实作，2026-03-24）：
> Opus 4.5 largely removed that behavior on its own, so I was able to drop context resets from this harness entirely.

---

## C2 Claude Code 官方“纠错两次就重开”

候选句：

> 当前 Claude Code 官方也建议：同一错误纠正两次仍复发时，用吸收教训的新提示重开。

**判定：支持。这是官方操作建议，不是实验结论。**

原文：<https://code.claude.com/docs/en/best-practices#steer-the-session>（2026-10-28 核对；页面无单列更新日期）

同一节的两处原文：

> “…after two failed corrections run `/clear` and write a better prompt instead of a third.”

> “If you've corrected the same thing twice and it's still wrong, a third correction mostly adds to a conversation that already contains two failed attempts for Claude to keep re-reading. `/clear` plus one new prompt that folds in what you learned works better almost every time.”

结论：候选的“纠正两次仍复发→吸收教训的新提示重开”与原文逐字对应。候选把它标为“操作建议”、与 C1 的实作记述区分，分类正确。

另外，同页还有两处可直接复用于本页“同题压缩 vs 换任务”的判断：

> “`/clear` between unrelated tasks. It costs nothing, and it means the next task doesn't keep paying for the previous one's history.”

> “`/compact` with a focus, like `/compact keep the API changes and the test commands`.”

这支持候选 hero 的“同题沿用压缩、换成无关任务再新开”，也支持表格里 `/compact` 可带保留指令。候选目前只把该页用在“纠错两次”处，可以补作 hero 的直接依据。

可复用引用（官方操作建议，2026-10-28 核对）：
> `/clear` plus one new prompt that folds in what you learned works better almost every time.

---

## C3 Reddit 社区分歧（缺口）

候选句：

> Reddit 原帖有人每完成一个任务就清空，也有人自报 Opus 5.5 的协调任务靠压缩持续运行；反对压缩者担心丢掉“试过什么、为什么放弃”。……原帖没有同条件任务对照，个人百分比和赞数不作为默认配置依据。

**判定：未核实。原帖在本环境不可达，未取得任何可核对的正文、评论、作者、分数或日期。**

尝试过的路径与结果：

| 路径 | 结果 |
|---|---|
| WebFetch `www.reddit.com/.../1x0jmvm/` | 工具明确返回“unable to fetch from www.reddit.com” |
| WebFetch `old.reddit.com`、`api.reddit.com`、`reddit.com` | 同上，域名级不可取 |
| Bash `curl` 与 Python `urllib` 取 `.json` | TLS 握手失败／`UNEXPECTED_EOF_WHILE_READING` |
| `api.allorigins.win` 代理取 `.json` | 返回 Reddit “You've been blocked by network security” 封锁页 |
| `api.codetabs.com`、`corsproxy.io` 代理 | 522／401，未取得内容 |
| `redlib.catsarch.com`、`freedit.eu`、`l.opnxng.com`、`perennialte.ch`、`safereddit.com` | “Socket is closed”，不可达 |
| Wayback availability API | “Socket is closed”，不可达 |
| WebSearch（标题、ID、Opus 5.5 + compaction + 关键词） | 未返回该帖或任何转载全文 |

因此以下细节全部未核：是否真有人“每完成一个任务就清空”；是否有“Opus 5.5 协调任务靠压缩持续运行”的自报；反对者是否用“试过什么、为什么放弃”这一理由；原帖是否有同条件对照、个人百分比与赞数。

建议（供 dot-A 决定）：

- 若 dot-A 手上有原帖短摘录或可访问存档，补进候选并在依据行注明“原帖摘录，核实日期”。仅凭搜索摘要不算读过原帖。
- 若无法提供，C3 这段应降级为“社区意见（未见原文）”并删去具体模型与行为细节，或整段移除；至少不能写成“社区对两种做法仍有分歧”这种已核实口吻。
- 本条是本次唯一无法给出“支持/不足”结论的新增主张。

---

## C4 10 月压缩研究

候选句：

> 10 月的压缩研究发现，部分任务分数保持平稳时，摘要仍会丢掉工作方法和禁改范围。任务实验使用改造版 OpenCode、少量任务及 Opus 4.6、GPT-5.3-Codex、GPT-5.4 等模型，1M 模型仅测到窗口的 16%–38%；另以 LLM 判分检查 44 条真实会话，未测约束缺失对最终结果的影响。

**判定：支持。逐项都能在论文中找到对应；需补“预印本 v1”限定，并固定 OpenCode 链接。**

原文：

- 论文：<https://arxiv.org/abs/2610.31778>（永久入口）／正文 <https://arxiv.org/html/2610.31778v1>
- 题名：*Benchmarks Are Surprisingly Compaction-Friendly*
- 作者：Jeanne Salle、Hardik Bhatnagar、Matthias Bethge、Sahar Abdelnabi、Maksym Andriushchenko
- 版本：arXiv:2610.31778v1 [cs.LG]，2026-10-22 18:15:54 UTC；25 页；无 journal-ref；DOI 待注册。**是预印本，未经同行评审。**
- 公开实现：<https://github.com/aisa-group/compaction>（核查时 main = `7a282c7b4845514a2cbf2f8fde384d58f055b6da`）

逐点对照：

| 候选说法 | 原文摘录（§4.2／§5 及摘要） | 结论 |
|---|---|---|
| 分数平稳时摘要仍丢工作方法与禁改范围 | “compaction keeps around 81% of user constraints”；process instructions 丢失 35.9%，scope exclusions 丢失 36.8%，feature requirements 仅 6.2%；“Constraints that describe the deliverable can be recovered from the agent's own artifacts,” but “constraints that describe how the agent should behave cannot.”；“Claude Opus 4.6 and GPT-5.4 show no relationship between compactions and accuracy”；“even if the compaction doesn't change the performance metric,” “it can still silently remove the rules and constraints” | 支持 |
| 改造版 OpenCode | “We implement each compaction strategy inside OpenCode as a replacement for its default compaction logic.”；仓库自述“a **copy** of OpenCode … at upstream commit `41612b3db`”，加了额外压缩控制 | 支持 |
| 少量任务 | “We evaluate four models, three benchmarks and a few tasks per each benchmark.”；PaperBench 3 篇、ProgramBench 2 个任务、PostTrainBench 2 个基座模型 × 3 个目标基准 | 支持 |
| Opus 4.6、GPT-5.3-Codex、GPT-5.4 等模型 | 四个模型：Claude Opus 4.6、GPT-5.3-Codex、GPT-5.4、Gemini 3.1 Pro Preview（后者很少触发压缩，作者称对该问题无信息量） | 支持，“等模型”覆盖第四个 |
| 1M 模型仅测到窗口 16%–38% | “We vary the compaction threshold from 160K to 380K tokens.”；“for the 1M-context models … this range covers 16-38% of the window”，因此“does not test compaction near the scaffold default” | 支持 |
| 44 条真实会话、LLM 判分 | “We sampled 44 sessions with at least one compaction event”；提取出 269 条约束；“An LLM judge then labeled each constraint as preserved or dropped”；总体 81% 保留、19% 丢失 | 支持 |
| 未测约束缺失对最终结果的影响 | “Q4 measures how much of this is lost on real sessions, but not its effect on the final outcome.” | 支持 |

需修／建议：

1. 依据行或正文补一句“arXiv 预印本 v1，未经同行评审；本仓未复现”。候选已有“本仓未复现该研究”，只差预印本身份。
2. OpenCode 链接目前指向 `main/docs/COMPACTION.md`，会漂移；建议固定到 `7a282c7b4845514a2cbf2f8fde384d58f055b6da`。同时可把论文链接改为 `/abs/` 作永久入口，`/html/v1` 留在正文引用。
3. “部分任务分数保持平稳时，摘要仍会丢掉……”是把论文两组结果（分数对压缩不敏感；摘要按类别丢约束）合在一句。论文有同向结论句（“even if … it can still silently remove …”），可以保留；若要更严谨，写“论文分别观察到……”，避免读者以为同一实验逐任务联合测量。

可复用引用（预印本，2026-10-22）：
> 81% of constraints are preserved and 19% dropped.
>
> Q4 measures how much of this is lost on real sessions, but not its effect on the final outcome.

---

## C5 接续三条与“撤回要求／排除旧方案理由”

候选句：

> 接续成功要看三件事：最新限制仍被遵守；能指出下一步及其证据入口；没有重复已完成或结果未知的写入。
>
> 恢复先核最新约束，尤其禁改范围与撤回要求，再核当前进度……
>
> 3. 已确认事实、关键决定及排除旧方案的理由……

**判定：部分支持。三条检查与“为什么放弃旧方案”属于候选综合／推断，不是论文直接结论。**

- 论文直接支持的是：约束（尤其“怎么做”“不要碰什么”）在摘要中丢失率显著高于功能需求；作者明确说这类约束无法从产物恢复。因此“先核限制”“不要只留文件名”有依据。
- 论文没有单独测量“已撤回的要求”（revoked requests），也没有测量“排除旧方案的理由”（why abandoned）；它测的是 process instructions 与 scope exclusions 两个类别。把这两项写进检查点是合理的工程推断，但不应放在“研究发现”句里。
- “接续成功三件事”是候选自己的验收定义，论文没有这三条。建议在段首标“本仓建议”，或与“研究发现”句分段。

可保留的写法：

> 本仓据此把接续验收定为三条：最新限制仍被遵守；能指出下一步及其证据入口；没有重复已完成或结果未知的写入。

---

## 可直接复用的引用清单

| 用途 | 链接 | 短摘录 | 类型 | 日期 |
|---|---|---|---|---|
| Sonnet 4.5 压缩不足、需重开 | <https://www.anthropic.com/research/harness-design-long-running-apps> | “compaction alone wasn't sufficient … context resets became essential” | 官方，Labs 成员个人实作 | 2026-03-24 |
| Opus 4.5 撤回重开 | 同上 | “Opus 4.5 largely removed that behavior on its own, so I was able to drop context resets” | 官方，个人实作 | 2026-03-24 |
| 纠错两次就重开 | <https://code.claude.com/docs/en/best-practices#steer-the-session> | “after two failed corrections run `/clear` and write a better prompt instead of a third” | 官方操作建议 | 2026-10-28 核对 |
| 无关任务才清空 | 同上 | “`/clear` between unrelated tasks” | 官方操作建议 | 2026-10-28 核对 |
| `/compact` 可带保留指令 | 同上 | “`/compact` with a focus, like `/compact keep the API changes and the test commands`” | 官方操作建议 | 2026-10-28 核对 |
| 约束丢失率 | <https://arxiv.org/abs/2610.31778> | process 35.9%、scope 36.8% 丢失；“81% of constraints are preserved” | 预印本 v1 | 2026-10-22 |
| 未测最终影响 | 同上 | “not its effect on the final outcome” | 预印本 v1 | 2026-10-22 |
| 研究用 OpenCode | <https://github.com/aisa-group/compaction/blob/7a282c7b4845514a2cbf2f8fde384d58f055b6da/docs/COMPACTION.md> | “a copy of OpenCode … extended with extra context-compaction controls” | 公开实现 | 核查 2026-10-28 |
| Reddit 原帖 | <https://www.reddit.com/r/ClaudeCode/comments/1x0jmvm/when_do_you_use_clear_vs_compact_in_your_daily/> | 未取得原文 | 社区（缺口） | 未核 |

## 未读／缺口

- Reddit 原帖正文与评论（C3）：本环境不可达，未读；无存档。
- Anthropic 文章里“团队”与“个人”的边界：读到作者署名与第一人称自述；未读到该项目的团队分工细节。
- 论文全文只读了摘要、§4.2、§5 与相关段落，未逐页读完 25 页；未复现实验。
- 候选引用的其他既有来源（Cline、Codex、V2EX 等）不在本轮新增范围，未重核。
