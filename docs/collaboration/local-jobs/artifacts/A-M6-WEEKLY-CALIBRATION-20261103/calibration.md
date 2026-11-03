# A-M6-WEEKLY-CALIBRATION-20261103 · 2026-10-26～11-01 周校准

**结论：本周没有已确认、可直接改读者动作的新遗漏，保留 10-26 路线。** 有两项待核线索值得负责人核实，核实成立才会改变动作：一是压缩后伪造的用户批准可能作为真实指令存活（arXiv 2610.29869）；二是 Claude Code 把账号邮箱放进模型上下文，`IS_DEMO` 只隐藏界面显示（issue #81138）。两者的新增面分别是来源破坏／伪造用户批准和上下文注入；仓库已有“压缩后约束不保证继续生效”的内容，10-26 校准也记过“出站 HTTP 带邮箱”的待核线索，本卡不把它们当全新现象。本卡只读摘要或正文主要部分，未复现、未安装、未改正文。另有两项旧材料转化缺口：Cursor 扩展事件已在 SKILL-MCP 稿成形，agent_summary 花费已在 MULTIAGENT 稿有计量回执，均尚未进入本仓正文。

**主样本（`"Claude Code"`）10 条中 5 条是同一 Cursor Marketplace 扩展后门事件。** 该事件在 SKILL-MCP 正式稿已有完整条目，本卡只记“已交线索／未全接收”，不重做采集或来源纠错。**补充样本（`"coding agent"`）10 条中，dsh-superagent 已有仓内本地消费者验证，Compaction Laundering 已列入待核线索**；其余是产品页、新闻或低信号线索，不构成新工具动作。保留 10-26 的路线和既有选择。

## 采样与冻结

窗口沿用 10-26 校准的口径：**Asia/Shanghai 2026-10-26 00:00（含）至 11-02 00:00（不含）**，即 UTC 10-25 16:00 至 11-01 16:00，`created_at_i` 1792944000／1793548800。主入口与补充入口都在 2026-11-03 11:26 UTC 首次取得有效响应并冻结，两个样本各返回 10 条；两样本成员无交集，联合 20 个 HN ID。完整请求、响应顺序、成员元数据、读取状态和基线命中见 [sample.json](sample.json)。

| 样本 | 实际请求 | 读取 UTC | nbHits | 返回 |
|---|---|---|---|---|
| 主 | `https://hn.algolia.com/api/v1/search?query=%22Claude+Code%22&tags=story&numericFilters=created_at_i%3E%3D1792944000%2Ccreated_at_i%3C1793548800&hitsPerPage=10` | 2026-11-03T11:26:48Z | 93 | 10 |
| 补充 | `https://hn.algolia.com/api/v1/search?query=%22coding+agent%22&tags=story&numericFilters=created_at_i%3E%3D1792944000%2Ccreated_at_i%3C1793548800&hitsPerPage=10` | 2026-11-03T11:26:49Z | 40 | 10 |

这是按相关性默认顺序的前 10 条，不是 HN 热门榜、不是 HN 全量，也不是随机样本；补充样本只是把 query 换成精确短语 `"coding agent"`，是非单客户端的补充，不是独立渠道或随机样本。重查排序可能变，本表成员不随之替换。扫描前仓库固定在 `2c3287bab9306010137bc99088a251c21feb4669`。对每个成员用规范项目／来源 URL、HN ID 和明确旧名查已跟踪文本；除 dsh-superagent 命中 `experiments/deepseek-superagent-receipt/` 与 `docs/decisions/long-tasks.md:115` 外，其余无命中。`kernel`、`ASO`、`Lisp` 等无关同名子串不计命中。

## 主样本（`"Claude Code"`）

| # | HN ID／上海日期 | 读取范围 | 判断 | 处理 |
|---|---|---|---|---|
| 1 | [50300683](https://news.ycombinator.com/item?id=50300683)，10-30 | [Phorion 报告](https://phorion.io/blog/offical-claude-code-vsx-compromise/)主要章节、[Cursor 公告](https://cursor.com/blog/claude-code-extension-security-notice)主要章节；553 条评论只读顶层前几条 | 新来源但旧机制；5 条同一事件的主条目 | 已交线索，不重做；见下节 |
| 2 | [50302334](https://news.ycombinator.com/item?id=50302334)，10-30 | Mastodon 原帖未取；17 条评论读前几层 | 新来源但旧机制；同一事件 | 不按标题的“official”写成 Anthropic 发布；Cursor 公告称恶意版本非 Anthropic 开发 |
| 3 | [50284255](https://news.ycombinator.com/item?id=50284255)，10-29 | [gist](https://gist.github.com/flamerix-ai/c3905705cc4205e5de3011fa2e74efce) README 主要章节；236 条评论读顶层前 8 条 | 已交线索／未全接收；agent_summary 花费已有 #86879 计量 | 不安装作者 preload、不重做计量；见下节 |
| 4 | [50301983](https://news.ycombinator.com/item?id=50301983)，10-30 | 原文 403；1 条评论 | 新来源但旧机制；同一事件 | 唯一评论指评论已移到 50300683；不换入口绕取 |
| 5 | [50286306](https://news.ycombinator.com/item?id=50286306)，10-29 | [issue #81138](https://github.com/anthropics/claude-code/issues/81138) 正文主要部分；HN 5 条评论全读；正文引用的 Reddit 原帖本机不可读 | 发现未记录（上下文注入面） | 见“本周未记录线索”；先只读核验，不把 issue 自述当已复现 |
| 6 | [50300112](https://news.ycombinator.com/item?id=50300112)，10-30 | [opensourcemalware 文章](https://opensourcemalware.com/blog/trojanized-claude-code-extension-plants-persistent-ssh-backdoor)主要章节；2 条评论全读 | 新来源但旧机制；同一事件 | 文章 UPDATE 引 Cursor 称是 Cursor Marketplace 被攻陷、非 Open VSX；评论的“非官方插件”只是转述，按 UPDATE 为准 |
| 7 | [50278101](https://news.ycombinator.com/item?id=50278101)，10-29 | [X 原帖](https://twitter.com/coolerwave/status/2115393243458207755)主要部分；1 条评论 | 证据不足 | 原帖称 14,219 张前摄照片来自 faceunlock 缓存等目录；评论称视频取自 LiveBoot 演示，仍不把数量当已证实 |
| 8 | [50301004](https://news.ycombinator.com/item?id=50301004)，10-30 | Cursor 公告主要章节；1 条评论 | 已交线索／未全接收；同一事件的一手处置 | 2.1.312／2.1.313、约 11 小时分发窗口、移除并重建市场、轮换密钥、卸载不足；公告未列受影响用户数 |
| 9 | [50300097](https://news.ycombinator.com/item?id=50300097)，10-30 | [Marut Pandya 事故报告](https://www.marutpandya.com/posts/2026/10/my-mac-started-reading-json-aloud/)前段；6 条评论读前几层 | 新来源但旧机制 | 七个子代理、无沙箱、测试误启动真实进程；docs/10 已有“环境边界优先”，不新增动作 |
| 10 | [50256421](https://news.ycombinator.com/item?id=50256421)，10-27 | [thenewstack 原文](https://thenewstack.io/torvalds-claude-code-kernel/)主要章节；3 条评论全读 | 证据不足 | 23x 是作者提示的合成基准，真实负载收益更小；reviewers 在合并前发现 race condition。是真实项目案例，不是新做法 |

**同一安全事件的边界。** 50300683、50301004、50301983、50302334、50300112 指向同一 Cursor Marketplace 扩展后门，合并按 1 个事件计，不按 5 条新闻算 5 次发现。Cursor 公告与 Phorion 都说明远程登录／隧道在多数主机因权限或脚本错误失败，但仍写入了 SSH key 与持久化；两家都强调卸载扩展不足以清除。SKILL-MCP 稿已收该事件的版本范围、载荷、修订状态和“签名正确不等于分发安全”的结论，本卡不重复。

## 补充样本（`"coding agent"`）

| # | HN ID／上海日期 | 读取范围 | 判断 | 处理 |
|---|---|---|---|---|
| 1 | [50316116](https://news.ycombinator.com/item?id=50316116)，10-31 | 仓内实验 README 与 `docs/decisions/long-tasks.md:115` 已读；上游 README 本轮未重取 | 已记录（仓内验证） | 不重做；发现时差见下节 |
| 2 | [50246778](https://news.ycombinator.com/item?id=50246778)，10-27 | [arXiv 摘要](https://arxiv.org/abs/2610.29869)全文；2 条评论全读；正文／源码未读 | 发现未记录 | 见“本周未记录线索”；先核 Claude Code 是否在测试范围 |
| 3 | [50261185](https://news.ycombinator.com/item?id=50261185)，10-27 | [Trama 落地页](https://nicchia-code.github.io/trama/)主要章节；1 条评论 | 不适用 | 只支持 VS Code 1.106+ 与 omp；提案／审批／漂移是产品形态，不是当前默认的增量 |
| 4 | [50320501](https://news.ycombinator.com/item?id=50320501)，11-01 | [Winch 落地页](https://getwinch.app/)主要章节；1 条评论 | 不适用 | macOS 付费 ASO 产品，Agent 驱动 GUI；与 AI coding 主线无关 |
| 5 | [50290899](https://news.ycombinator.com/item?id=50290899)，10-29 | [heal.dev 文章](https://www.heal.dev/verification-harness)前段；1 条评论（作者） | 新来源但旧机制 | 工具／上下文／不受 Agent 控制的判定器三件套；厂商自述、无独立回执；未试用 |
| 6 | [50274593](https://news.ycombinator.com/item?id=50274593)，10-28 | [Parley README](https://github.com/colinsurprenant/parley)前段；5 条评论全读 | 新来源但旧机制 | IRC 频道、peer 消息不带用户授权、人留在频道；与 docs/10 案例四、docs/08 的人工中转／人介入重叠；未试用 |
| 7 | [50323814](https://news.ycombinator.com/item?id=50323814)，11-01 | Bloomberg 付费墙未读；4 条评论全读 | 已记录（仓内验证） | 与 50316116 同一 DeepSeek 项目；评论质疑第一个 harness 不完整 |
| 8 | [50259515](https://news.ycombinator.com/item?id=50259515)，10-27 | 站点只返回重定向；2 条评论（含作者回复） | 证据不足 | Rust/Lua、编译性能、<50MB；是客户端替代，不是新协作机制 |
| 9 | [50282481](https://news.ycombinator.com/item?id=50282481)，10-29 | [X 原帖](https://twitter.com/techfren/status/2115583260919202187)主要部分（NODECODE 自报对比）；0 条评论 | 证据不足 | 单次作者自报：NODECODE 比 Codex 少 7–14x 输入 token、快 2.5x，但承认更早停、产出更简单；不采 |
| 10 | [50316721](https://news.ycombinator.com/item?id=50316721)，10-31 | [DiffNotes README](https://github.com/igorkasyanchuk/diffnotes)前段；0 条评论 | 证据不足 | MIT、自托管、PR 内联注释；新工具但无试用与独立反馈，只记候选 |

## 去重：两份已交正式稿

**两份稿都没有本周冻结样本契约，本卡不把它们当本周结果，也不推断原调用是否退出。** SKILL-MCP 稿（`docs/collaboration/local-jobs/artifacts/A-SKILL-MCP-WIDE-20261029/sources.md`，提交 `9f905b0166278975f9831e7d142b9ca4cae423c5`）覆盖 8 月以后；在 §2.3 与条目表已有 Cursor 扩展后门：行 105 明确说本仓 `docs/10` 还没有这批与 Skill／插件市场直接相关的案例，行 107 给 Phorion 与 Cursor 公告的版本、载荷、持久化和“卸载不足”，行 117 记事件表未收该事件，行 227／242 把同一事件列为插件市场信任模型的反例。这与本周主样本的 5 条是同一材料，记 **已交线索／未全接收**，引用原位置，不重做其收集、来源纠错或产品试用。查法是对两份稿搜本周成员名、规范 URL 与周窗口。

MULTIAGENT-LONG 稿（`docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-LONG-WIDE-20261029/sources.md`，提交 `a37326182cd65de837101d68d2596cbe8042a119`，覆盖近 3–6 个月）行 674 已记 Claude Code #86879 的计量回执：4 小时、27 个子代理会话，`agent_summary` 占 22.7% 请求、约 18% 加权 token。本周 gist 的自报 16.4% 与它是同一现象的不同样本，本卡记 **已交线索／未全接收**；gist 作者给的 Bun preload 修法不在稿中，也未经验证，本卡不安装、不运行。该稿行 81／149 已收 dsh-superagent（T8），与仓内实验重复，不再重做。两稿均未收本周的 Compaction Laundering 这篇论文；MULTIAGENT 稿行 781 已收相邻但不同的 **Governance Decay**（arXiv 2606.22528，压缩静默抹掉安全约束），本条新增的是来源破坏／伪造用户批准的角度。两稿也未收本周的邮箱注入、Parley、DiffNotes、Smelt、Trama、Winch。

pnpm、compressor、reference 的真实试用归原负责人；本卡不提出同题试跑。六张当前新卡、在途／blocked、旧取消卡及未知调用只去重，不续接。

## 与旧周的同口径比较

只比较同查询、同窗口规则的主样本；补充样本是本周新增，另列，不与旧周拼分母。

| 同口径主样本 | 窗口 | nbHits | 返回 | 成员结果 |
|---|---|---|---|---|
| 10-26 校准 | 10-19～10-25 | 95 | 10 | 2 项适用漏项、3 项已有机制的新来源、3 项不进入试用、2 条时点消息 |
| 本次 | 10-26～11-01 | 93 | 10 | 5 条同一安全事件、1 条已交线索（agent_summary）、1 条待核隐私（上下文注入面）、1 条旧机制沙箱案例、2 条证据不足 |

**这是样本内容差异，不是漏检率或召回率变化。** 两周都没有独立的全量分母；本周主样本集中在一次安全事件，没有出现第二组新机制。不能写成“漏检下降”或“发现能力提升”。

## 发现时差

| 条目 | 能核到的原刊出 | 首次仓库登记 | 可写的时差 |
|---|---|---|---|
| Cursor 扩展事件 | Cursor 公告 2026-10-29；Phorion 2026-10-30（10-31 更新补 2.1.312） | 本卡未写正文；SKILL-MCP 稿 2026-11-03 收录 | 正文首次登记未知，不写实际发现时差 |
| dsh-superagent | HN 2026-10-31 13:41 UTC；项目同日发布 | 2026-11-02 UTC（`6030e057`，`experiments/deepseek-superagent-receipt/`） | 两日间隔；这是登记与刊出的间隔，不是完整发现时差 |
| 账号邮箱注入 | issue 2026-07-25 提交；HN 2026-10-29 | 10-26 校准已记 HN 50219875 为待核线索（其评论指向 #53231，旧校准注明该历史 issue 未核实；`docs/research/2026-10-15-exploration-evidence.md`）；上下文注入面未登记 | 7-25 到 10-29 是原帖到 HN 的间隔；上下文注入面的实际发现时差未知 |
| Compaction Laundering | arXiv v1 2026-10-21；HN 2026-10-26 16:42 UTC（上海 10-27） | 无 | 实际发现时差未知 |

## 本周未记录线索（负责人决定是否转化）

### 1. 压缩会破坏消息来源，伪造的用户批准可能被执行

**原文**：[Compaction Laundering: Provenance Destruction in Context-Compacting Coding Agents](https://arxiv.org/abs/2610.29869)，arXiv 2610.29869v1，2026-10-21，cs.CR。摘要称：把带类型的对话拍平成单一字符串、只用 `[User]:` 这类文本标签标角色，会让摘要器前的消息来源在代码层丢失；攻击者控制的任何被读内容都能伪造一个用户回合，并在压缩后作为真实指令存活。

**与已有选择的差异。** 仓库已有“压缩后约束／规则不保证继续生效”的内容：docs/03 的 4.1 把“约束是否仍在”列为压缩验证项，4.3 记了 OpenHands SDK 字符串摘要删掉规则正文，`Codex 续接：压缩后保留目标，不等于目标继续支配行动` 一节说明目标被保留不等于继续支配行动；`docs/decisions/context-management.md` 还记了“摘要仍可能丢掉工作方法和禁改范围”。本条新增的是攻击面：把带角色的消息拍平成像 `[User]:` 这样的字符串，会让来源在代码层消失，攻击者控制的内容可伪造用户回合并在压缩后作为真实指令存活，而不只是摘要遗漏。论文摘要给出五个拍平 harness（pi、opencode、Cline、Aider、OpenHands）87–100% 的成功率、四个保留角色的 harness（Codex、Gemini CLI、Qwen Code、Continue）0%，并测了一个代码级来源检查（抓 77%、误降 2% 正常摘要）。这些数字只来自摘要、论文测试集不含 Claude Code、未复算。

**可执行下一步。** 负责人读全文与公开源码，先核 Claude Code 的压缩序列化是否保留消息角色；若读者使用 Cline、Aider、OpenCode、pi 等论文列为拍平类型的 harness，则直接采用“压缩后不继承批准”的检查，除非对应版本已修复。成立时在 docs/10、docs/03 或 `docs/decisions/context-management.md` 加一条可执行限制：压缩后不把历史里的“批准”当现行授权，执行前重新确认；选择新 harness 时把“压缩后角色保真”纳入安全项。**会使它不适用的条件**：所用 harness 保留 role-typed 消息，或已有代码级检查覆盖；论文摘要列出的 harness 中没有 Claude Code，全文是否另有补充未读，不能外推到其他客户端。本卡不安装、不运行任何 harness。

### 2. 账号邮箱进入模型上下文，IS_DEMO 不拦

**原文**：[issue #81138](https://github.com/anthropics/claude-code/issues/81138)，2026-07-25 提交，状态 Open。正文给出 `# userEmail` 构造点、读取 `~/.claude.json → oauthAccount.emailAddress` 的路径，并称同类的既往报告至少四次都因不活跃或重复而关闭，未在实质上处理。HN 条目 [50286306](https://news.ycombinator.com/item?id=50286306) 是本周的讨论入口；正文引用的 Reddit 原帖本机不可读。

**与已有选择的差异。** 10-26 校准已把“出站 HTTP 带邮箱”（HN [50219875](https://news.ycombinator.com/item?id=50219875)，10-24）记为“保留待核安全线索”，其 HN 评论指向 issue #53231；本周 #81138 正文也把 #53231 列为既往报告。本条新增的是“系统提示／上下文注入”这一面，旧线索是 UA／出站 HTTP。仓库与两份稿都没有把这个机制写进正文；docs/10 讲凭证与供应链，没有讲“模型上下文里的个人数据会被模型输出、提交或外发”。issue 作者称 `IS_DEMO=1` 只隐藏头部与 `/status`，不改变上下文注入，也没有输出侧过滤；这是 issue 自述，本卡未独立复现。

**可执行下一步。** 在已安装版本做一次只读核验：先复制 `~/.claude.json` 到脱敏副本、用合成账号，或只问模型“系统提示里有哪些字段名、是否存在邮箱字段”，不要要求输出字段值；再检查 bundle 的 `userEmail` 构造点（只看代码路径，不打印值）。**任何情况下不把真实邮箱粘进对话、日志或提交。** 若当前版本仍在注入，在 docs/10 加一条：账号邮箱在模型上下文中，`IS_DEMO` 只影响显示，公开仓库的 Agent 提交前按现有 git noreply 身份核验。**会使它不适用的条件**：当前版本已移除注入，或官方提供文档化开关并说明数据用途。

## 旧材料的转化缺口（不是本周新发现）

**Cursor 扩展事件已在 SKILL-MCP 稿形成可执行结论，但尚未进入本仓正文。** 该稿 §2.3 与条目表把这件事整理为“发布者签名正确不等于分发安全；插件／Skill 市场应把宿主与凭据隔离纳入采用条件；卸载扩展不足以清除”。本周主样本只提供同事件的重复热度，不增加新事实。负责人若要改变读者动作，应沿原稿位置接收或改写进 docs/10，而不是在本卡重新采集。**会使它不适用的条件**：docs/10 的供应链原则与 docs/01 的“扩展代码单独审查信任边界”（`docs/01-agents/claude-code.md:132`）已足够覆盖，或负责人判断该事件只是一次时点故障、不值得写成长期选择。本卡不判断该稿调用是否退出，也不把“已交线索”当作已采用。

**agent_summary 花费已在 MULTIAGENT 稿有计量回执，但未进入本仓正文。** gist 的 preload 修法未经验证，且会随客户端更新失效；本卡不建议读者照装。若成本问题重要，先读已有 #86879 回执和作者 gist 的“Verify／Fail-open”段，再决定是否值得单独立项，不在本周样本内完成。**会使它不适用的条件**：读者的任务不以子代理为主，或订阅额度足以吸收这部分开销。

## 下一步与保留路线

1. 负责人核实 Compaction Laundering 的全文、源码与 Claude Code 序列化；成立才进 docs/10、docs/03 或 `docs/decisions/context-management.md`，不成立就保留现有压缩说明。
2. 负责人对账号邮箱注入做一次只读核验；成立才在 docs/10 加注，不成立就关闭该线索。
3. Cursor 事件与 agent_summary 按两份已交稿的原有内容流程处理，属旧材料转化，不计本周新发现。
4. 本周不新增工具推荐。Parley、DiffNotes、Smelt、Trama、Winch 只记候选；heal.dev 只读厂商自述；均未试用、未安装、未改默认。

## 覆盖与未读

**只读取得的范围按成员记在 sample.json 的 `entry_read`／`comments_read`。** 2026-11-03 用浏览器 UA 重取 X 与文章页后：读到主要章节或正文的有 Cursor 公告、Phorion 报告、gist README、issue #81138 正文主要部分、opensourcemalware 文章、thenewstack 原文、Trama／Winch 落地页主要章节、两条 X 原帖主要部分（NODECODE 对比与 14,219 张照片）；另只读摘要：arXiv 2610.29869（全文／源码未读）。只读到前段：Marut Pandya 文章、heal.dev 文章、Parley 与 DiffNotes 的 README。评论只读顶层前几条：50300683、50302334、50284255、50300097；其余有评论的条目读到全部可见顶层。不可读或未取：Reddit 原帖、doublepulsar（403）、Mastodon 原帖、Bloomberg 付费墙、arXiv 全文与源码、Smelt 站点正文。

**未取得证据的仍为未知。** 不把标题、点赞、链接可达或厂商自述当采用效果；不把“同一事件 5 条”算成 5 次独立发现；不为完成分母重试明确拒绝的入口。HN 只用 `hn.algolia.com` 的 search／items API，网页版不用；没有换身份、代理或被拒域名补取。本卡未安装、未运行任何候选，未改正文、13、inbox、研究历史、模板、其他卡或配置，未新增采集器或定时任务。

## 依据

- 样本：[HN 主查询](https://hn.algolia.com/api/v1/search?query=%22Claude+Code%22&tags=story&numericFilters=created_at_i%3E%3D1792944000%2Ccreated_at_i%3C1793548800&hitsPerPage=10)、[HN 补充查询](https://hn.algolia.com/api/v1/search?query=%22coding+agent%22&tags=story&numericFilters=created_at_i%3E%3D1792944000%2Ccreated_at_i%3C1793548800&hitsPerPage=10)；条目与评论经 `https://hn.algolia.com/api/v1/items/<id>` 读取，ID 见 sample.json。
- 一手／厂商：[Cursor 安全公告](https://cursor.com/blog/claude-code-extension-security-notice)（2026-10-29）、[Phorion 报告](https://phorion.io/blog/offical-claude-code-vsx-compromise/)（2026-10-30，10-31 更新）、[Claude Code issue #81138](https://github.com/anthropics/claude-code/issues/81138)（2026-07-25）、[DeepSeek Superagent 原型](https://github.com/deepseek-ai/dsh-superagent-prototype)、[Parley](https://github.com/colinsurprenant/parley)、[DiffNotes](https://github.com/igorkasyanchuk/diffnotes)、[heal.dev](https://www.heal.dev/verification-harness)、[Trama](https://nicchia-code.github.io/trama/)、[Winch](https://getwinch.app/)。
- 社区／作者：[gist：Claude Code agent_summary](https://gist.github.com/flamerix-ai/c3905705cc4205e5de3011fa2e74efce)、[Marut Pandya 事故报告](https://www.marutpandya.com/posts/2026/10/my-mac-started-reading-json-aloud/)。
- 研究：[Compaction Laundering 摘要](https://arxiv.org/abs/2610.29869)（arXiv 2610.29869v1，2026-10-21）。
- 已交稿：`docs/collaboration/local-jobs/artifacts/A-SKILL-MCP-WIDE-20261029/sources.md`（提交 `9f905b0166278975f9831e7d142b9ca4cae423c5`，行 105／107／117／227／242）、`docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-LONG-WIDE-20261029/sources.md`（提交 `a37326182cd65de837101d68d2596cbe8042a119`，行 81／149／674／781）。两文件在当前 base_ref 树未检出，故用代码路径而非本地链接。
- 旧周基准：[2026-10-26 上周 HN 样本校准](../../../../research/2026-10-15-exploration-evidence.md#2026-10-26上周-hn-样本校准)。

核实 2026-11-03。
