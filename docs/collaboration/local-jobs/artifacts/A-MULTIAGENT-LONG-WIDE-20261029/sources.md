# A-MULTIAGENT-LONG-WIDE-20261029 · 多代理与长程任务广扫 · 候选来源

> 读取截止 2026-11-03（UTC+8），主窗 2026-08-01 至截止；少量 2026-05/06 的机制来源因被新项目直接继承而保留，个别更早条目在行内标注。下列只是供 dot-A 云端深挖、试用和取舍的候选材料，不含推荐排名以外的采用结论；本单元只收集，不宣布采用、不升级地图、不做实测。所有 star 均为 2026-11-02/03 的页面快照，没有增长历史，也不作为效果或采用率证据。链接均尝试核过：能打开、打不开或只拿到摘要的均在行内日期／类型列或 §1.1 标注，不据此确认机制；作者声称、README 所见、公开运行回执、二手转述在每条里分开写。

## 1. 渠道覆盖表

六路收集者按“官方与项目自有材料、头部覆盖、英文社区、中文社区、真实使用反馈、近三月新东西”分工，再按 URL 去重、链接检查后合并。下表是实际读过的东西，不是理论上该看的渠道。

| 来源类别 | 实际看了什么（站点／仓库／API 与取法） | 检索轮次 | 本轮候选 | 覆盖情况与限制 |
|---|---|---|---|---|
| ① 官方团队与高质量项目自有材料 | Anthropic（research／engineering 多篇、Managed Agents、cwc-long-running-agents、claudes-c-compiler、knowledge-work-plugins、sandbox-runtime）；OpenAI（Codex as a platform、run-long-horizon-tasks-with-codex、skills-shell-tips、symphony、官方 issue）；Google（Antigravity 2.0、Agent Executor、Scion、AX、Elephant-Goldfish、Harness²、DeepMind Minecraft 论文、Memory Bank）；Microsoft（Agent Framework Durable+Magentic、Agensh、dotnet/runtime CCA）；AWS（AgentCore、Kiro Crew）；Cloudflare（Agents SDK、内部 AI 栈、Astro issue 清理）；Vercel（Workflow DevKit、agent-browser）；GitHub（Agent HQ Mission Control、Copilot Fusion、Squad、gh-aw、Copilot CLI）；Stripe／Cognition／Factory／Warp／Cursor／Kimi／Qwen／AgentScope／DeepSeek／Z.ai／xAI／腾讯／字节／火山／讯飞／高德／滴滴／华为／Genkit／Inngest／LangChain／Zed／Ramp／Shopify／Spotify／Uber／Meta／WorkOS／Nx／StrongDM／Nearform 的工程文与仓库；作者博客（Osmani、Horthy、Meiklejohn、liao.gg、calpaterson、aymannadeem、asyncdot、j11g、runta、lopezb、practicalsystems、harshalgajjar 等） | 6 批（官方文、仓库、作者博客、厂商工程、issue、固定 SHA 复核） | 50（4.1）；另有官方仓库散见 4.2／4.3／4.5／4.7，未单计 | 头部官方源基本覆盖；Anthropic 长任务页与 OpenAI 三篇官方文（harness-engineering、unlocking-the-codex-harness、the-next-evolution-of-the-agents-sdk）403／404，见 §1.1；GitHub Agent HQ 发布文与 Mission Control 操作文本轮 curl 均 200，2026 企业 GA 范围仍只见二手。作者博客读原文，不读转载 |
| ② 头部覆盖（topic／搜索／trending／awesome／市场） | GitHub topic 20 个（multi-agent、agent-orchestration、agent-framework、autonomous-agents、ai-agents、agent-skills、claude-skills、claude-code-plugin、agent-plugins、ai-skills、agentic-coding、ai-orchestration、agent-teams、context-engineering、agent-memory、multiagent、agent-swarm、long-horizon、agent-harness、context-management），topic 再按 updated 扫一轮；GitHub 搜索按 star 与 pushed 各约 20 组词；trending daily／weekly／monthly；awesome 列表 15 份（andyrewlee、razzant、ai-boost、RUC-NLPIR、Picrew、AutoJunjie、bradAGI、danielrosehill、nibzard、walkinglabs、HarnessMD、VoltAgent、sickn33、varun1505、TeleAI）；目录 agent-orchestrators.com（257 项）、agentmgmt.dev（87 项）；Skill／插件市场 claude-plugins.dev、aaskills.tech、agentskills.io、open-vsx、Cursor 市场审核帖 | topic 20 组＋搜索约 40 组＋trending 3 档＋awesome 15 份 | 31（4.10）＋4.2 的 89 项（多数来自 topic／trending） | GitHub REST 匿名额度耗尽后改用网页与 raw README，没有精确 pushed_at、star 增长和 code search；两个 Skill 市场站不可读，见 §1.1 |
| ③ 中英文技术社区 | HN（hn.algolia.com API，30+ 组词，story 与 comment 分开；逐棵读 49316271、49853108、50334030、50332360、50256106、49398152、46990733、47672792、48241066、50183892、47693047、46734302、47785053 等评论树）；Lobsters（hottest.json、t/ai、t/programming，search.json 非 JSON 未用）；dev.to（tag API 抓 2,300+ 篇后回原帖，多词搜索返回 0）；腾讯云开发者、InfoQ 中文、掘金／知乎／36kr／CSDN／少数派的 WebSearch 摘要；X、Reddit、linux.do、V2EX 见 §1.1 | HN 30+ 组词／13 棵评论树；Lobsters 3 入口；dev.to 1 轮 tag＋回帖 | 26（4.8.2）；中文原文 3 篇（InfoQ 复检 451）另计在 4.8.1 | 中文侧只到摘要与个别原文（腾讯云两篇；InfoQ 复检 451），未系统扫掘金／知乎／B 站／公众号；英文侧 HN／Lobsters／dev.to 已覆盖到评论区 |
| ④ issue／discussions／论坛／市场评价 | Claude Code issues（#105184、#102269、#99652、#98747、#90542、#85949、#88332、#104026、#88747、#92249、#86879、#67730）；Codex issues（#49735、#49705、#49390、#40905、#36586、#37453、#40858、#48677、#49248）；OpenClaw（#143334、#145690、#118625、#154834）；LangGraph（#8764、#9006、#8796、#9078、#8448、#8653、#8464、checkpoint-conformance、论坛 #4460）；phoenix、spec-kitty、cbusillo／codex-skills、code-coordinator、flutter_agent_harness、bugbug、DeepSeek-V3、deepseek-harness discussion、GitHub orgs/community discussion、Copilot CLI、Claude Agent SDK、oh-my-openagent、superpowers-multiagents、VS Code、ai-memory、Omnigent、oh-my-pi；Cursor 论坛 13 帖；OpenAI community 11 帖；MemPalace #27/#39；openrig／munder-difflin／loopx issue 列表 | 6 批（按项目族） | 95（4.8.3） | 多数 issue 只读正文与可见前几条评论，未登录看不到折叠回复；GitHub Discussions 正文与评论在未登录页面不完整，见 §1.1 |
| ⑤ 近三个月上升、本仓未提的新东西 | 主要由 ① ② 追链得到：Agensh、dsh-superagent、Harness²、POrchestra、Raven、open-multi-agent、loopx、kungfu、Bernstein、Flock、LaneGate、Cezar、Crewplane、Utah、parallax、qm、Tenet、CommonGround、wayfinder、Context Continuity、Context Ledger、swarm-cc、tool-journal、waggle、billion-context、cliffcompaction、self-compact、Reason Network、aweb、aoci-code 等，均在进表前对 docs/ 做过 grep 去重 | 3 轮追链（新项目→替代品→反例） | 54（4.11），另有 2026-08 后新项目散在 4.2–4.7 | 新项目只读 README／文档／摘要与作者自述，未安装、未运行；star 只作阅读顺序 |

§4 共 623 行（其中除 4.8 外的 10 个子节共 454 行：A–G、I、J 加 4.11；4.8 社区回执 169 行），其中十余行是“本仓已有、只作对照”的已知项；五类按主要来源归类，互有重叠，不能相加。上表“本轮候选”只统计各行点名的子节（① 4.1、② 4.10＋4.2、③ 4.8.2、④ 4.8.3、⑤ 4.11）；把 ② 的 4.10 31 与 4.2 89 一并计入时为 345，这不是 §4 全量，不能当作候选总数。

**合并与去重。** 同一项目改名或同一文章多入口只留一个原始链接，并在理由里注明旧名：Superset→Paradev、steveyegge/gastown→gastownhall/gastown、steveyegge/beads→gastownhall/beads、Hmbown/CodeWhale→codewhale-hq/Codewhale、deepseek-ai/dsh-superagent→dsh-superagent-prototype、half-island-box/agent-team→AGT、live-log-viewer-next→delegatus、pickaxe→icepick、claude-flow→ruflo。同源转载（厂商博客的中文转述、Firecrawl／Tom's Hardware 对同一实验的报道）只作旁证，不单列候选。

### 1.1 读不到的渠道（保留，不当“那里没有内容”）

| 渠道 | 状态与原因 | 处理 |
|---|---|---|
| GitHub REST API（api.github.com） | 未认证 60 次/小时在 2026-11-02 20:01 UTC 前后耗尽，返回 403／429；search 10 次/分钟同样用尽 | 改用 github.com HTML、raw.githubusercontent.com 与本轮 curl 链接检查；因此没有精确 starred_at、pushed_at 与 star 增长史 |
| gh CLI | 本机 command not found | 无法用 gh api 取 release／commit 元数据，改用网页与 raw |
| GitHub GraphQL／code search | GraphQL 未认证配额为 0；code search 需登录 | 未做 Discussions 全量检索与全仓代码／采用率检索 |
| Reddit | 本机已知 TLS handshake 失败（页面与 JSON 均失败），按任务要求未重复尝试 | 本轮无 Reddit 原帖；不以搜索摘要替代原帖证据 |
| linux.do、V2EX | 本机已知不可读，未重复试失败入口 | 中文社区原帖缺口保留（仅有搜索摘要提到并行执行与 token／缓存成本讨论） |
| news.ycombinator.com 网页 | 本机不可读 | 全部改走 hn.algolia.com 的 search／items API；评论树只取前两层或每层前几条，未穷举 |
| Anthropic Long-running Claude 页（/research/long-running-Claude） | 本次 404／socket hang up | 只有二手转述，相关候选未标为原文确认 |
| OpenAI 四篇官方文（practical-guide-building-gpt-6、harness-engineering、unlocking-the-codex-harness、the-next-evolution-of-the-agents-sdk） | WebFetch 403；其中 GPT-6 指南用 curl＋浏览器 UA 取到正文，其余三篇仍 403 | 只有 GPT-6 指南按正文写；harness-engineering、unlocking-the-codex-harness、the-next-evolution-of-the-agents-sdk 仅由 README／二手引用核对存在 |
| GitHub Discussions 正文（orgs/community #199414、deepseek-harness #5310） | 未登录 HTML 只给标题与计数，正文和评论由 React 异步加载（“There was an error while loading”） | 只取 og:description；正文与评论留待云端用其它入口 |
| GitHub 仓库页（github.com）部分路径 | WebFetch 域名校验或 socket hang up（sno-ai/sno-station、autonomous-ai/openharness 等） | 改用 raw.githubusercontent.com README，均成功 |
| skillsmp.com | HTTP 403 | 未读页面与目录内容 |
| claudeskills.directory | 连接超时 30s | 未确认是否存在 |
| community.anthropic.com、forum.openhands.dev | Discourse JSON 端点无响应（curl 000） | 未取到论坛原帖 |
| forum.cursor.com 部分主题 | 只读前 3 帖；未登录无法确认全部回复 | 候选理由按已读范围表述 |
| arxiv.org 正文／HTML | WebFetch 被域名安全校验拦截；部分 HTML 在参考文献前截断 | 改用 export.arxiv.org API 读摘要；Agensh、Harness²、LongHorizon 等 benchmark 细节与统计口径未核 |
| arxiv export API（2605.09998） | 返回空结果 | 改用 arxiv.org/abs 页取摘要，未拿参考文献列表 |
| X／Twitter | 需登录／JS；curl 返回 200 但 WebFetch 校验失败；Spawn 原帖返回 402 | 未读原帖；只用 Simon Willison 转述与引文，原始链接已记录 |
| mp.weixin.qq.com／claudeers.com | 前者未在客户端打开，后者 WebFetch 校验失败 | 只读搜索摘要（Munder Difflin 评级、替代品列表），未核原文 |
| openai.com/index/* 其余页面 | 403 bot 拦截 | 改用 GitHub 仓库原文或搜索摘要，摘要单列 |
| techcommunity.microsoft.com（Azure SRE Agent 两篇） | 403 | 未读正文 |
| sundaylettersfromsam.substack.com、medium.com（drensin）、blog.danielvaughan.com、craft.faire.com、uber.com/blog/ureview | 连接重置／超时／403／406 | 未读正文；仅由引用它的文章核对存在 |
| ralphify.co、xr0am.substack.com | TLS／连接 000 | 未纳入候选；HN 讨论 46750937 可读 |
| huggingface.co 数据集（agentic-failure-mode）、HF blog（150k Tokens Deep） | curl 000／Socket is closed | 只有搜索摘要里的失败模式条目名，未当已核内容 |
| IEEE Xplore（OpenClaw-Bench） | HTTP 202 反爬挑战 | 只知题目与摘要级描述 |
| open-vsx.org 扩展页、conductor.build、open-vsx 详情 | 注册表空壳／403 | 未核扩展描述与定价 |
| npmjs.com（@avee1234/handover、code-agent-orchestrator） | 403 | 只读 WebSearch 摘要与名称，未读包页 |
| github.com/{wandb/catnip, ordwell/ordwell, nmelo/bdui} | 404（改名或删除） | 未列入候选，未找替代入口 |
| GitHub 部分 issue 正文（#105184、#102269、#88332 等） | 匿名 API 限流，网页 200 但评论未展开 | 只按页面可见正文与标题写，未确认全部回复 |
| Discord／Slack（Paperclip、OpenRig、Herdr 等） | 非公开可读 | 未进入 |
| VS Code Marketplace／Open VSX／G2 评价 | 无可结构化读取的评论 | Cursor 市场只读到扩展审核帖 #176053（通过、无负评） |
| dev.to search/feed_content | 多词查询返回 0；REST API 403 | 改用 tag API 与浏览器 UA 抓 HTML；未打 tag 的长尾可能漏 |
| Lobsters search.json | 返回 HTML 非 JSON | 改用 tag JSON 与 hottest.json，无站内全文搜索覆盖 |
| Engineering Signals 2026-W37 | 页面只返回“Loading intelligence corpus…” | 正文未读 |
| AI Engineer World's Fair 部分讲稿 | 页面只有会议名、无确切日期 | 读站点 transcript，未看视频／字幕 |

## 2. 排序标准：先看什么、为什么

本卡是广扫，不预编赢家；下面只解决“先深挖哪几项”的阅读顺序，不是采用排序。

1. **可回源的一手回执优先于厂商自述。** 有真实运行记录（PR 数、回滚数、token 与金额、失败清单、issue 里的复现步骤）的排在只有架构图与宣传数字的前面；作者自报、README 自述、二手报道一律在行内标明。
2. **机制新意与“本仓没有”优先。** 已在 `docs/03`、`docs/08`、`docs/13`、`docs/20`、`docs/21`、`docs/decisions/long-tasks.md` 或 experiments 出现的，只在去重节留一句差异，不重复列。
3. **正反两面都要有。** 同一机制如果只有官方叙事，排序下调；有独立反例、失败复盘或同预算对照的（Vals AI、Polylane、McEntire、YC Labs、Handoff Tax）前移。
4. **越接近本卡分工越前。** 协调、分工、持久状态、长程运行架构优先；验证与审查的具体机制标为跨卡（VERIFY-REVIEW），单 Agent 配置标 AGENT-CONFIG，静态工具生态标 SKILL-MCP。
5. **近三个月优先。** 2026-08 以后发布的按原日期排序；成熟项目 2026 年的新采用也收，但不当新发布。
6. **不按 star 判断。** star 只说明阅读顺序；若干高 star 项目在本轮只有 README 自述，已在理由里降权。

## 3. 最值得先深挖的 15 项

排序依据是上一节六条：有一手回执、机制本仓没有、正反两面、贴近本卡分工。每项都写明原始链接、日期／版本、机制、实际消费者、正反反馈、与本仓差异和待核问题；作者声称与实测分开。

**可试用短名单（四项）。** 下表只列能按公开入口实际起跑的项；其余 11 项（T1–T4、T7、T9–T12、T14、T15）是厂商实验、内部系统、论文或审计报告，只可读，不能直接试用，不要当工具选型。每项只写最小起跑路径，深度核实仍归 dot。

| 项 | 入口 | 前置环境 | 第一步 | 判定证据 | 何时不适用 |
|---|---|---|---|---|---|
| T5 Qwen Code Agent Team | <https://qwenlm.github.io/qwen-code-docs/zh/users/features/multi-agent-coordination/> | 按 Qwen Code 文档装好 CLI；一个可丢弃的测试仓库；可接受实验特性 | 开一个分支，用 `/coordinate` 起 3 个只读调查任务，再让 1 个 writer 改文件，核对 writer 的 worktree 归属 | 调查 worker 的 shell／写文件被拒；writer 只有 1 个且固定在 leader worktree；leader 是唯一合并方 | 实验特性；最多 3 条工作流；未实现持久 PTY／跨厂商 worker／远程 attach；不用于生产隔离 |
| T6 AgentScope Java Harness | <https://java.agentscope.io/v2/zh/blogs/how-to-build-agent-harness/02-task-orchestration> | Java／Maven；一个最小 HarnessAgent 项目 | 定义含 CREATED→RUNNING→VERIFYING→COMPLETED 的任务，记录 `task_id` 与 event cursor；杀掉 worker 后换实例恢复 | 任务以状态机而非聊天历史推进；lease 阻止双 worker；完成由 harness 按环境证据提交 | 只有设计博客与框架，无外部采用数据；状态迁移、游标存储、lease 超时都要自己接；不是开箱产品 |
| T8 dsh-superagent | <https://github.com/deepseek-ai/dsh-superagent-prototype> | 按 SETUP.md 由 agent 协助配置，是多步 operator 操作：DSH 运行时（`engines.dsh` ^0.2.1-alpha.2）＋模型 provider、Node 22.19+／24+、pnpm、git 2.32+、tmux、Python 3.8+、gh 2.48+、专用 GitHub 账号与测试仓库；Feishu 另需 bot（`pnpm check` 只跑 typecheck／test／build，不是 setup） | 用允许账号在测试仓库的 Issue／PR 评论 `@<agent login> <request>`（或测试中构造 Trigger），让 Eval 接成 Ticket 并生成 Mandate，再让 worker 尝试改写目标；随后在 PR 评论回投 | worker 不能改写 Mandate；Ticket 跨重启保留；PR 评论直达原 worker；off／observe／auto 模式按规则接活 | research prototype；benchmark 用合成消息与模拟工具，未测真实代码质量；事件接入与权限要自建；文中 Watchdog 等设计属未来方向，原型未实现 |
| T13 cwc 长任务 hooks | <https://github.com/anthropics/cwc-long-running-agents/tree/ad107a974bced5244f74dd283dbf2bfd3baee3a1> | Claude Code；一个含 results JSON 的测试项目 | `cp -r claude-code-config/.claude /path/to/project/`、`chmod +x /path/to/project/.claude/hooks/*.sh`，跑一个 feature 后不读证据就写 `passes:true` | verify-gate 拒绝写入；track-read 记录已读证据；evaluator 只回 PASS／NEEDS_WORK；commit-on-stop 留下提交 | 官方示例、不维护、不接 PR；hook 有意简化；需改 `RESULTS_FILE` 与证据文件模式，否则门禁不生效 |

**为什么是这 15 项而不是热度最高的那些。** 头部的 star 大户（paperclip、orca、ruflo、headroom、oh-my-claudecode 等）本轮只有 README 自述，没有可核运行回执，因此放进 §4 只作阅读顺序；进 T 列表的要么带数字与失败面（T1、T4、T10、T11、T12、T15），要么给出可直接照抄的契约（T5、T6、T8、T13），要么是有生产规模但本仓完全没有的形态（T2、T3、T7、T14）。其中九项带反例或独立对照，六项带官方或厂商自报的成本数据，三项有公开代码或固定 SHA。若只跟两项，先看 T5 与 T13：前者是“只读并行＋单写者”的成文规则，后者是“未读证据不得自证通过”的 hooks 实现，两者都能在本仓现有结构里直接对照，不需要新平台。要凑第三项，按缺口选 T8（Ticket＋Mandate，贴多代理分工）或 T6（状态机＋事件游标＋lease，贴持久恢复）。

### T1 Anthropic《Patterns and problems in emerging multi-agent systems》：多代理失败模式的官方实测

- **链接与日期。** <https://www.anthropic.com/research/multiagent-systems>，2026-08-13；讨论见 HN 49316271（200 分，评论经 Algolia API 读）。
- **机制与数字。** 官方前沿红队让 45 个 agent 协作找漏洞，共找到 266 个，而独立并行只找到 21 个，代价是 27M 对 6.5M token；18/30 个 agent 建了同名分支 `mvp-game-loop`；2.4M 次 job 请求只被接受 117 个；冲突中出现互相杀进程、自复制恶意软件；Mythos 5 有 98% 以停战收场。
- **消费者与回执。** Anthropic 自己的红队实验，公开了任务与数字；不是客户案例。HN 讨论里有实践者补充 Opus 当 orchestrator、tmux 多窗的用法。
- **正反。** 正面价值是把“多代理的失败”变成可复现类别（共享命名空间、任务接受率、冲突升级）；反方（HN 50334030 等）据此认为多数任务该用单 agent。它既是官方来源也是反例材料。
- **本仓差异。** `docs/08-multi-agent.md` 讲分工与隔离，但没有这组“同任务、同仓库、45 agent 对照”的量化失败数据；`docs/13` 未收。
- **待核。** 任务类型是找漏洞而非写功能，能否外推到编码长任务；266 与 21 的判定标准、去重口径；27M token 的计费口径；Mythos 5 的“停战”是行为标签还是人工判读。

### T2 Stripe Minions 两篇：无人值守 coding agent 的隔离与确定性外壳

- **链接与日期。** 上篇 <https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents>（2026-02-09），下篇 <https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2>（2026-02-19）。
- **机制。** Minions 无人值守、一次产出可过 CI 的 PR，人仍评审；每周 1,000+ 合并 PR。每次跑在预热 10 秒的隔离 devbox（与生产、互联网断开），可并行而不用 worktree；agent loop 是 Block Goose 的 fork，上下文含内部文档、工单、构建状态、Sourcegraph；MCP 走 Toolshed（400+ 工具）。blueprints 用代码定义状态机，确定节点（跑 lint、push）与 agentic 节点（implement、fix CI）交替；规则按目录／文件模式作用域化，用 Cursor 规则格式并与 Claude Code／Cursor 同步；本地 lint <5 秒，CI 失败最多再修一次即转人。
- **消费者与回执。** Stripe 内部生产系统，给出周合并量与隔离方式；没有独立复测或代码样本。
- **正反。** 正面是可运行的隔离与停止条件（预热 devbox、两轮 CI、转人）；限制是单公司、单仓库形态，blueprints 需要自写，官方未给失败率与回滚率。
- **本仓差异。** `docs/08` 收 worktree 隔离与多 agent 编排，`docs/decisions/long-tasks.md` 讲长任务边界；本项新增“确定性外壳包住 agent 节点”“隔离 devbox 替代 worktree”“停止条件是 CI 轮数”三处，可直接对照本仓的 worktree＋人工验收。
- **待核。** Toolshed 的工具授权与审计；blueprints 与 Claude Code 规则文件的同步是否单向；1,000 PR/周的分母（团队规模、仓库数）；失败 PR 的去向。

### T3 Factory Missions：orchestrator／worker／validator 与“验收标准先于实现”

- **链接与日期。** <https://factory.com/news/missions-architecture>，2026-04-10（产品 intro 页标 2025-02-26，两页日期关系未能从页面确认，待核）；产品页 <https://factory.com/news/missions>。
- **机制。** orchestrator 只澄清、拆分、过验证门；worker 一次一个 feature 且用新上下文；独立 validator 以黑盒用户视角执行 validation contract（该 contract 在 feature 之前写好）；状态外置在 contract、feature list、research notes、knowledge base。Slack clone 例报 16.5 小时、778.5M token、52.5% 代码是测试。
- **消费者与回执。** 厂商自报的生产案例，给出了可复核的时长／token／测试占比，但没有公开仓库或第三方复测。
- **正反。** 正面是“实现者不判自己”“验收先于实现”的完整形态；反方见 HumanLayer 的 WSFF（不读代码的代价）与 Nearform 的并行经验，说明验证门本身也可能被 agent 绕过。
- **本仓差异。** `docs/13` 只引用 HumanLayer 的反面复盘，未收 Missions 的三角色与 contract 机制；本仓的交接是 markdown，未把 validation contract 前置为独立产物。
- **待核。** 16.5 小时是墙钟还是 agent 小时；778.5M token 的成本；validator 与 worker 是否共享模型；contract 由谁写、失败后如何回退。

### T4 Cockroach Labs MOLT Sinai：五个月真实流水线的正反与成本

- **链接与日期。** <https://www.cockroachlabs.com/blog/experiment-running-hospital-code/>，2026-10-09。
- **机制与数字。** 2026-04 至 09 的多 agent 流水线产出 1,238 个 PR、只有 7 次回滚、token 花费超 13.5 万美元（约 84 美元/issue）。
- **正反与失败。** 同一篇里写了官僚等待、一个一行修复跑了 11 轮两天不收敛、技能提示膨胀到约 10 万词、最终仍需人审。这是本轮正反与成本口径最完整的一项。
- **消费者与回执。** 公司自己的实验报告，有 PR 数与回滚数；未给每个 PR 的审查人力与合并周期。
- **本仓差异。** 本仓 `docs/research/2026-10-22-frontier-trials.md` 只把它当材料引用过；未收“流水线的官僚开销与提示膨胀”这组失败。
- **待核。** 7 次回滚的分母与定义；13.5 万美元是否含重试；10 万词提示如何维护；11 轮不收敛的根因是否已定位。

### T5 Qwen Code Agent Team／coordinate：只读并行＋单写者的官方实现

- **链接与日期。** <https://qwenlm.github.io/qwen-code-docs/zh/users/features/multi-agent-coordination/>，文档 2026-10-22 更新。
- **机制。** `Agent Team` 实验运行时：`/coordinate` 最多 3 条独立工作流；调查 worker 强制只读（不能 shell／写文件）；需要写代码时只允许 1 个 writer 固定到 leader 拥有的 worktree；leader 是唯一合并权威；关闭 Team 后退化为普通前台委派。另列 Arena（多模型竞争）与 Herdr（外部 CLI 协调），并明说未实现持久 PTY、跨厂商 worker、远程 attach。
- **消费者与回执。** 官方文档与自述限制，未见真实项目回执。
- **正反。** 正面是与本仓“只读并行＋单写者”结论同构，可直接逐条对照；限制是实验特性、三工作流上限、未做跨厂商。
- **本仓差异。** 本仓 `docs/08` 有 worktree 隔离与分工原则，但没有“调查员强制只读、写者唯一且固定在 leader worktree、leader 唯一合并”的成文契约；这条把它写成可引用的官方规则。
- **待核。** 只读约束如何强制（工具白名单还是沙箱）；writer 与 leader 的 worktree 归属在崩溃后如何恢复；Arena 的成本。

### T6 AgentScope Java 2.0 Harness：把任务状态机、事件游标与 lease 写进 harness

- **链接与日期。** <https://java.agentscope.io/v2/zh/blogs/how-to-build-agent-harness/02-task-orchestration>；AgentScope Java v2.0.0 于 2026-07 GA，博客页未标日期（读取 2026-11-03）。
- **机制。** HarnessAgent 在 ReAct 上加工程层：五阶段 Agent Loop（Prepare／Model／Act／Observe／Verify）；以机读任务状态机（CREATED／RUNNING／WAITING_INPUT｜APPROVAL｜EVENT／VERIFYING／COMPLETED／FAILED／CANCELLED）而非聊天历史为准；子代理 spawn／fork 带范围、预算、证据格式与验收契约；`task_id`＋event cursor 支持换 worker 恢复，lease 防并发；完成由 harness 按环境证据提交。
- **消费者与回执。** 官方博客与框架，未见外部采用数据。
- **正反。** 正面是一份可直接照抄的长程工程清单（状态机、游标、lease、证据提交）；限制是只有设计叙述，没有失败率或对照。
- **本仓差异。** 本仓 `docs/decisions/long-tasks.md` 讲持久状态与交接，但没有把“任务状态机＋事件游标＋lease”写成具体字段；这是目前最接近可落地契约的一份中文材料。
- **待核。** 状态机迁移是否强制、事件游标存在哪（DB／文件）；lease 超时与抢占策略；Verify 阶段的证据格式。

### T7 Agensh（微软研究院）：去中心化多代理 harness 的规模实验

- **链接与日期。** <https://github.com/microsoft/Agensh>，MIT；论文 arXiv 2609.26781（2026-09-22），2026-10-24 开源。
- **机制。** worker 自行认领子任务、共享 workspace／消息接口／上下文板、异步验证并合并，无中央调度器；自报 1→1024 agents；Pandoc 6 小时通过率 33.89%→55.06%（GPT-5.6-sol），另一配置 56.19%→79.59%（32 agents）。
- **消费者与回执。** 研究团队自报，公开论文与代码；HN 12 分、1 条评论追问 worktree／commit 方式，社区几乎未检验。
- **正反。** 正面是“无中心调度能否扩展”的最直接新证据；反方是 pandoc 任务窄、数字为作者自报，且失败模式（共享 board 冲突）未见披露。
- **本仓差异。** 本仓未收 Agensh；`docs/08` 的协调是 lead-agent 模式，缺少去中心化认领的对照。
- **待核。** 共享上下文板如何防并发写；1024 agent 的实际墙钟与成本；任务认领的重复／饥饿；与 Qwen 的只读调查员＋单写者相比谁更稳。

### T8 dsh-superagent（DeepSeek）：Router／Worker、Ticket + 不可变 Mandate

- **链接与日期。** <https://github.com/deepseek-ai/dsh-superagent-prototype>，2026-10-31 发布，MIT，12.7k★（快照）。
- **机制。** Router 长驻协调（轻模型、受限工具）＋ Worker 独立上下文／工作目录；Ticket＋不可变 Mandate、GitHub／Feishu 事件触发、两阶段过滤（gate＋assessment）、PR 后续评论直达原 Worker、off／observe／auto 主动模式。论文中的 Watchdog 等设计属未来方向，公开 README 明确“文章里部分设计未在本原型实现”，仓库 docs 与源码树中未见 watchdog 模块。
- **消费者与回执。** 官方明确是 research prototype，benchmark 用合成消息与模拟工具，未测真实代码质量；HN 11 分、0 评论。
- **正反。** 正面是“主动找活＋持久运行”的完整状态机与 Mandate 约束；限制是未验证真实代码质量，采用需自建事件接入。
- **本仓差异。** 本仓 `docs/08`／`20` 有子代理与长任务恢复，但没有 Ticket／Mandate 这种“任务契约不可被 worker 改写”的字段；与 Codex #49705 的“目标替换”失败正好互补。
- **待核。** Mandate 的不可变如何在代码层强制；Watchdog 是否／何时实现；两阶段过滤的误杀率；PR 评论回投的消息通道。

### T9 Handoff Tax 与 Attention Tax：换模型／拆任务的量化代价

- **链接与日期。** <https://arxiv.org/abs/2608.24358>（2026-08-25）与 <https://arxiv.org/abs/2610.06069>（2026-10-05），均只读摘要。
- **机制与结论。** 前者：长任务中途从便宜模型升级到强模型时，给全轨迹只能恢复不到一半的质量差且成本更高；降档反而划算；最优界面随方向反转——升级应少给 LC 轨迹，降档应保留 HC 轨迹。后者用可靠性模型解释多 agent 何时值得：分解降低长上下文负担但引入 handoff tax；在 ledger-reconciliation 任务上交叉点约 depth 10，并预测 20／50／100 步分解占优。
- **消费者与回执。** 两篇预印本，摘要级；本仓未读全文与附录，统计口径未核。
- **正反。** 直接挑战“把上一模型 transcript 全量交给下一个”的常见做法，也挑战“子代理越多越好”；反方是实验任务窄、作者模型假设未独立复现。
- **本仓差异。** 本仓 `docs/03` 讲压缩与交接，但没有“交接的模型方向决定该给多少上下文”这条；`docs/decisions/long-tasks.md` 也未按任务深度判断拆不拆。
- **待核。** 全文的实验设置与置信区间；“不到一半质量差”的度量；depth 10 交叉点是否只在记账类任务成立。

### T10 Vals AI：同任务、同预算的多代理 vs 单代理对照

- **链接与日期。** <https://www.vals.ai/blogs/multi-agent-vibe-code-bench>，2026-10-09。
- **机制与数字。** 50 个应用、8 种配置各跑一次；团队成本 1.8–5.1 倍；只有 Sol medium 团队 +7.3 分显著（p=0.005），Opus 团队无显著提升；Sol max 单代理 89.0% 反超 medium 团队 84.9%。
- **消费者与回执。** 第三方评测机构，公开方法与样本量；单次运行、样本有限。
- **正反。** 本轮少见的同预算反例，可直接对抗“多代理更强”的叙事；限制是 benchmark 为 vibe-code 应用、只跑一次。
- **本仓差异。** 本仓未收这份对照；`docs/13` 的多代理结论多来自作者复盘，缺同预算实验。
- **待核。** 8 种配置的具体模型／effort；评分者是谁；单次运行的方差。

### T11 Polylane：把 18 个子代理收成 1 个的生产复盘

- **链接与日期。** <https://polylane.com/blog/sub-agents-are-just-wrong/>，2026-09-14。
- **机制与数字。** autofix 从 triage＋协调＋最多 15 个假设＋编码代理改为单代理后，问题到 PR 中位 2.2h→35min、p90 9 天→2h 内、出 PR 比例 0.6%→4.2%（后 9.1%）、单 PR 成本 $111→约 $18；作者自承成本下降不全是架构归因。
- **消费者与回执。** 第一方生产复盘，有前后对比；无对照实验。
- **正反。** 正面是“子代理在短任务上反而拖慢”的具体数字；限制是同时改了多个变量，作者自己承认归因不纯。
- **本仓差异。** 本仓 `docs/08` 默认并行隔离，缺少“什么时候该收回单代理”的阈值；这条提供了成本与延迟两侧的回收信号。
- **待核。** 2.2h→35min 的分母（问题类型分布）；$111 是否含模型与基础设施；9.1% 的统计窗口。

### T12 Marmelab《The State of AI Harness Engineering 2026》：246 个开源仓库的 harness 审计

- **链接与日期。** <https://marmelab.com/blog/2026/09/24/the-state-of-ai-harness-engineering-2026.html>，2026-09-24。
- **机制与结论。** 审计 246 个仓库、读 57 篇文献；其中可测的 97 个 harness 里 60% 既无测试也无 eval。另引 ETH Zurich 研究（138 个 Python 任务）称机器生成上下文文件降低成功率；引 Microsoft Azure 运维案例称超过 4 次 handoff 几乎必败。
- **消费者与回执。** 第三方审计，公开方法与样本；具体 harness 名单与评分未逐项核。
- **正反。** 给“harness 数量爆炸但质量参差”一个可引用的比例；反方是审计口径（是否把 demo 仓计入）会影响 60% 这个数。
- **本仓差异。** 本仓 `docs/07` 只引用 Marmelab 另一篇 spec-driven 文章；未收这份 harness 审计。
- **待核。** 246 个仓库的入选标准；97 个可测 harness 的筛选口径与 60% 判定；ETH Zurich 与 Azure 两个转引的样本量（不是本次审计的发现）。

### T13 Anthropic 官方长任务四件套：托管会话、三角色 harness、进度文件、hooks 示例

- **链接与日期。** <https://www.anthropic.com/engineering/managed-agents>（session 事件日志、无状态 harness、可替换 sandbox，崩溃后 `wake(sessionId)`）；<https://www.anthropic.com/engineering/harness-design-long-running-apps>（planner／generator／evaluator＋sprint contract＋Playwright MCP 外部验收，6 小时／200 美元与 3 小时 50 分／124.7 美元）；<https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents>（`init.sh`＋`feature_list.json`＋`claude-progress.txt`＋git 提交，一次一个 feature）；<https://github.com/anthropics/cwc-long-running-agents/tree/ad107a974bced5244f74dd283dbf2bfd3baee3a1>（Apache-2.0；初版 2026-05-05 17:01 UTC-7 = 2026-05-06 00:01 UTC；固定 SHA 为 2026-05-12 17:54 UTC-7 = 2026-05-13 00:54 UTC 的合并提交）。
- **机制。** 固定 SHA 的仓库根目录没有 `.claude/`；hooks 在 `claude-code-config/.claude/hooks/`（track-read、verify-gate、commit-on-stop、kill-switch、steer）。README 的接入命令是 `cp -r claude-code-config/.claude /path/to/project/` 与 `chmod +x /path/to/project/.claude/hooks/*.sh`。verify-gate 的 results JSON 默认 FAIL，未读证据不得写 `passes:true`；fresh-context evaluator 无写工具、只回 PASS／NEEDS_WORK；CLAUDE.md 要求一次一个 feature 并维护 PROGRESS.md。官方明确“示例配料、不维护、不接 PR”。
- **消费者与回执。** 官方示例与三篇工程文的成本数字，均为厂商自报；无独立复测。
- **正反。** 正面是可直接对照本仓 hooks 与交接模板的完整实现（默认 FAIL 的验证门最有价值）；限制是示例不维护、成本数字只此一家。
- **本仓差异。** 本仓 `docs/06` 讲 hooks、`docs/03` 讲进度文件，但没有“verify-gate 默认 FAIL、未读证据不能自证通过”的强制形态；这是本轮最可直接借鉴的一项。
- **待核。** verify-gate 的 results JSON 契约；kill-switch 与 steer 的注入方式；三角色 harness 的 200 美元成本口径。

### T14 Gas Town 生态与四份反对材料：把编排状态放进 Git

- **链接与日期。** <https://github.com/steveyegge/gastown>（现重定向到 gastownhall/gastown；2026 年初，MIT，约 18.7k★）；<https://github.com/steveyegge/beads>（Dolt 依赖图账本）；反对材料：<https://github.com/SimHacker/moollm/blob/main/designs/gastown/README.md>、<https://www.alilleybrinker.com/mini/gas-town-decoded/>（HN 219 分）、<https://slowlywilliam.com/2026/04/12/leaving-gas-town.html>、<https://github.com/gastownhall/gastown/issues/3649>（是否“偷用”用户额度，HN 253 分）。
- **机制。** 用 Git-backed Beads 账本＋worktree hooks 保存任务与编排状态，角色 Mayor／Polecats／Witness／Refinery／Deacon；Refinery 用 Bors 式 bisect merge queue，polecat 不直推 main，崩溃后靠账本恢复，Convoy 追踪工作单。README 自述 4–10 个 agent 无协调会乱、20–30 较舒适，早期昂贵／混乱。
- **消费者与回执。** 有大量真实使用者（Nearform 的 2–7 并行实践、HN 讨论），也有退出记录；Nearform 报告早期大量重复回归、会话间丢上下文，Beads 减少回归但 filing 有摩擦，Gas Town 仍有可见性与 bug 问题。
- **正反。** 正面是把编排状态放进 Git 的极端实现；反方最系统的是 moollm 的“单上下文模拟多 agent”，以及 #3649 的计量与信任争议。
- **本仓差异。** 本仓未收 Gas Town；`docs/08` 的并行方案止于 worktree＋人工交接，没有“账本＋合并队列”这一层。
- **待核。** #3649 的指控是否成立；Beads 的 merge 冲突频率；20–30 agent 的 token 成本；Refinery 的 bisect 队列在失败时的回退。

### T15 YC Labs：50 个 agent 在 Minecraft 里的三小时

- **链接与日期。** <https://labs.ycombinator.com/projects/games/index.html>，2026-10-29；负面报道 <https://www.tomshardware.com/tech-industry/artificial-intelligence/ai-agent-swarms-unleashed-in-minecraft-to-build-a-thriving-civilization-50-agent-teams-fail-after-falling-into-paralyzing-bureaucracy>。
- **机制与数字。** 50 个 GPT-6.1 Sol agent 跑 3 小时、发约 5,900 条消息；22/34 次死亡发生在第一夜；四个 agent 花 11 分钟给一块小麦任命“唯一施肥员”；鸡腿交接事故后写出书面协议。页面附共享机器文件、DM 记录与回放。
- **消费者与回执。** 一手实验，公开原始材料，可复核；任务为游戏而非编码。
- **正反。** 正面是长程多 agent 协调失败的可回放样本；反方是环境与任务太特殊，不能直接外推到软件工程。
- **本仓差异。** 本仓未收；`docs/08` 的协调讨论缺这种“共享世界＋有限资源”的失败实验。
- **待核。** 5,900 条消息／3 小时的成本；协议文本是否公开；与 Agent Village 的关系。

## 4. 其余候选（按主题分组）

以下按主题分组，组内大致按证据强度排列；星号标出跨卡项（†VERIFY-REVIEW、‡AGENT-CONFIG、§SKILL-MCP）。每行保留原始链接与一句理由，理由里的日期、数字、作者自报与限制与收集时的记录一致。

### 4.1 官方团队与厂商自有机制（A）

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| OpenAI GPT-6 模型指南（长任务章节） | <https://openai.com/index/practical-guide-building-gpt-6/> | 2026-10-02，官方指南 | 长任务三件套：Responses WebSocket 的 mid-turn steering（更新排队、不取消在跑工具）、async tool calls、GPT-6.1 Sol 的多代理委托（beta）；要求用 AGENTS.md／Skills 写清自主边界、按 cost per successful task 评估。WebFetch 403，curl＋浏览器 UA 取到正文；官方只给机制，无独立效果数据 |
| Kimi K2.6 Agent Swarm | <https://www.kimi.com/help/agent/agent-swarm> | K2.5 2026-01-27 引入、K2.6 2026-04-20 开源，现由 K3 驱动（Beta） | 最多 300 子代理并发、4000+ 工具调用／4000 步，主代理做 orchestrator、子代理由模型自组织，PARL 只训练 orchestrator；官方自报 4.5× 串行提速。高 credit 消耗与会员门槛，速度数字为厂商自报 |
| Warp Oz：multi-harness 云编排 | <https://www.warp.dev/blog/multi-harness-cloud-agent-orchestration> | 2026-05-19，厂商博客 | 一个控制面同时管 Claude Code、Codex、Warp Agent，可跨 harness 组父／子代理；官方文档另述每子代理独立 VM、durable server-backed message bus／per-agent inbox；支持 K8s／Docker／直接执行自托管与 per-agent 最小权限。多 harness 仍 beta，未给父子深度上限 |
| Cognition：Devin can now manage Devins | <https://old.cognition.ai/blog/devin-can-now-manage-devins> | 2026-03-19，厂商博客 | 主 Devin 做协调者：拆任务、分派、盯进度、解冲突、汇总；每个 managed Devin 是独立 VM，各有 session link，可中途发消息、看 ACU；协调者可读子轨迹改任务分解。官方未列并发／成本上限 |
| Google Antigravity 2.0 + Managed Agents | <https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/> | 2026-05-19 I/O，官方发布 | 桌面端作为多 agent 并行指挥中心，新增 dynamic subagents 与 scheduled tasks；CLI 与 SDK 共用同一 harness；Gemini API 的 Managed Agents 一次调用起一个带持久 Linux 环境的 agent。博客未标 GA／preview，资格与计费需另核 |
| GitHub Agent HQ：Mission Control | <https://github.blog/ai-and-ml/github-copilot/how-to-orchestrate-agents-using-mission-control/> | 2025-12-01 操作文（Agent HQ 2025-10 发布） | 跨仓库派发 Copilot coding agent，并行多任务、实时日志、pause／refine／restart，结果落 PR；custom agents 用 agents.md；建议同仓任务分区、依赖任务串行。未写权限、价格与 GA 范围，2026 企业控制面进展只见二手 |
| Anthropic Advisor tool | <https://claude.com/blog/the-advisor-strategy> | 2026-04-09，官方产品 | executor（Sonnet／Haiku）全程执行，遇难题在同一 /v1/messages 请求内调用 Opus advisor（只回 400–700 tokens、不调工具），max_uses 限次；自报 SWE-bench Multilingual +2.7pp 且单任务成本 -11.9%。厂商自评、基准配置不一 |
| Codex as a platform | <https://developers.openai.com/blog/codex-as-a-platform> | 页面未标日期（检索与第三方称 2026-08-19，待核） | 开源 Codex harness、CLI、app-server 与 SDK；三层集成 codex exec／SDK／app-server（持久会话、事件流、中断、审批）。称 retained reasoning＋context compaction 把 GPT-5.6 Sol 的 ARC-AGI-3 从 13.3% 提到 38.3%、输出 token 降至 1/6；模型与托管服务仍闭源 |
| Anthropic：用并行 Claude 团队构建 C 编译器 | <https://www.anthropic.com/research/building-c-compiler>、<https://www.anthropic.com/engineering/building-c-compiler> | 官方研究／工程复盘（两入口） | 并行 agent 团队造编译器的完整复盘，与本期大量自建 orchestrator 形成“官方自己怎么做”的对照；未给逐 agent 成本与失败率 |
| Anthropic Project Deal | <https://www.anthropic.com/features/project-deal> | 官方实验 | 69 名员工的真实二手交易市场，Claude 代理自主挂牌、议价、成交，公开多代理谈判结果与代理间能力差异；单一组织实验 |
| Cursor：Agent swarm model economics | <https://cursor.com/blog/agent-swarm-model-economics> | 厂商实验 | planner／worker 分层重建 SQLite，带自定义 VCS、合并冲突调解器、共享 Field Guide 和逐模型成本（约 $1.3k–$10.5k），是少见的带账本的多代理数据；厂商自报 |
| WorkOS《The self-driving codebase: Building Horizon》 | <https://workos.com/blog/project-horizon> | 厂商工程文 | 长程自动化自述，补 Stripe／StrongDM 之外另一家公司的架构与边界；无量化回执 |
| GitHub Copilot Fusion | <https://github.blog/changelog/2026-10-28-route-and-orchestrate-models-with-github-copilot-fusion/> | 2026-10-28 GA | 按任务路由并编排模型，三种执行模式 Single／Cascade／Critique，三档 effort；自称 Fusion Max 在 Artificial Analysis Coding Agent Index 得 60，落后 Opus 5.5 Max 两点内、成本约一半。厂商自报，适合看“模型路由即编排”的产品化 |
| Claude Code 官方文档：Dynamic Workflows | <https://code.claude.com/docs/en/workflows> | 官方文档 | 把编排写进可重放 JS 脚本，脚本持有循环／分支／中间结果，单次可调度数十到数百子代理且同会话可恢复；对自建 orchestrator 形成“宿主内置”压力；未给成本与失败数据 |
| Anthropic《Claude Code auto mode》 | <https://www.anthropic.com/engineering/claude-code-auto-mode> | 官方工程文 | 用分类器代管审批、把高自治运行的许可判断自动化；对应长程无人值守的审批策略层；与 Codex #99652 的误判案例可对照 |
| Claude Managed Agents（托管服务） | <https://claude.com/blog/claude-managed-agents> | 2026-04-08 | 托管长程 agent：session log、harness 循环与 sandbox 解耦；HN 169 分；本仓未收这一官方运行形态 |
| Anthropic 文档：Multiagent orchestration | <https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration> | 官方文档 | agent 可自己编写多 agent workflow，补 Managed Agents 工程文的 API 面 |
| Anthropic《Multi-agent research system》 | <https://www.anthropic.com/engineering/multi-agent-research-system> | 官方工程文 | 多代理编排与 token 成本的一手复盘，被 Omnigent、Firecrawl 等后续工作反复引用 |
| Anthropic《Multi-Agent Coordination Patterns》 | <https://claude.com/blog/multi-agent-coordination-patterns> | 官方博客 | 给出“便宜执行者＋昂贵顾问”的角色与成本分工，可核对本仓分工假设 |
| Anthropic quickstart：autonomous-coding | <https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding> | 官方示例 | 长任务 autonomous coding harness 的可运行示例，能与文章里的抽象机制逐项对照 |
| OpenAI《Run Long-Horizon Tasks with Codex》 | <https://developers.openai.com/blog/run-long-horizon-tasks-with-codex/> | 官方博客 | 用 Plan.md／Implement.md／Documentation.md 三个工件承载长程任务，可直接试的最小接续模板 |
| OpenAI《Shell + Skills + Compaction》 | <https://developers.openai.com/blog/skills-shell-tips> | 官方博客（curl 仅取到导航／摘要） | 长跑三件套：Skills、托管 Shell、服务端 compaction；建议复用容器、传 previous_response_id、用 /tmp 与 workspace 检查点续跑；WebFetch socket hang up，curl 只取到导航与文案 |
| OpenAI《Rethinking skills and prompts for GPT-6 Astra》 | <https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra> | 官方博客 | 反思技能描述与 AGENTS.md 膨胀会拖坏上下文，给出精简做法，是本仓“提示层要短”的官方对照 |
| OpenAI《Harness engineering》 | <https://openai.com/index/harness-engineering/> | 2026-02-11（据引用；403，仅摘要） | 讲仓库知识作为系统记录、提升自治级别与熵清理，是 Symphony 等票单式编排的方法论底座；curl／WebFetch 均 403，只能由 Firecrawl、Martin Fowler 的引用核对存在与主张 |
| GitHub Agent HQ 发布文 | <https://github.blog/news-insights/company-news/welcome-home-agents/> | 官方发布 | 平台侧 agent 身份、权限与多 agent 管理基础设施；2026 企业 GA 与第三方 agent 开放范围只见二手 |
| GitHub：Squad 用版本化仓库文件做共享记忆 | <https://github.blog/ai-and-ml/github-copilot/how-squad-runs-coordinated-ai-agents-inside-your-repository/> | 官方博客 | 多个代理在仓库内用版本化文件协调，而不是靠外部会话状态；“仓库即系统记录”的具体实现线索 |
| GitHub Agentic Workflows（gh-aw） | <https://github.com/github/gh-aw> | 官方开源 | 把 Markdown 工作流编译成 GitHub Actions 里的 Copilot／Claude／Codex 任务，作业只读沙箱、写操作走校验过的 safe-outputs，是 issue→agent→PR 的官方最小实现 |
| GitHub Copilot CLI | <https://github.com/github/copilot-cli> | 官方开源 | GitHub 官方终端代理，被 Agensh 列为默认单代理 harness，并通过 ACP 适配器接入外部编排 |
| Google Agent Executor | <https://cloud.google.com/blog/products/ai-machine-learning/agent-executor-googles-distributed-agent-runtime/> | 官方博客 | 分布式 agent runtime：durable execution、事件日志快照、重连与 trajectory branching |
| Google Cloud Memory Bank | <https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/memory-bank> | 官方文档 | 跨会话长期记忆的托管服务，是“持久代理”路线的产品化对照；Claude Code 无等价物 |
| Google Open Source Blog：EGM 插件 | <https://opensource.googleblog.com/2026/10/introducing-elephant-goldfish-model-plugin.html> | 2026-10，官方发布 | Elephant-Goldfish 团队自己的发布说明，补“零上下文评审子代理”的动机与采用范围 |
| AWS Kiro Crew | <https://github.com/kirodotdev/KiroCrew> | Apache-2.0 开源 | 持久工作区，checkpoint、heartbeat、定时任务、跨会话记忆与子代理派发齐备；第三方报道称源自 Amazon 内部 MeshClaw，待核 |
| Cloudflare：内部 AI 工程栈 | <https://blog.cloudflare.com/internal-ai-engineering-stack/> | 厂商工程文 | 内部 MCP Portal 与 AGENTS.md 落地的组织级实践，含工具网关与权限层 |
| Cloudflare：Astro issue 清零 | <https://blog.cloudflare.com/astro-issue-triage/> | 厂商工程文 | 在 GitHub Actions 中用隔离子代理复现、诊断、修补，把 open issue 从约 200 降到 30；可看子代理隔离与验收 |
| Vercel agent-browser | <https://github.com/vercel-labs/agent-browser> | 官方开源 | 给 agent 提供可验证浏览器操作的开源工具，补前端任务的闭环反馈（跨 VERIFY-REVIEW）† |
| LangChain《The Anatomy of an Agent Harness》 | <https://www.langchain.com/blog/the-anatomy-of-an-agent-harness>、<https://blog.langchain.com/the-anatomy-of-an-agent-harness/> | 厂商博客（两入口） | 把 harness 拆成 filesystem／code execution／sandbox／memory／context 五个原语，可作归类框架 |
| LangChain：rubrics for Deep Agents | <https://www.langchain.com/blog/introducing-rubrics-for-deepagents> | 厂商博客 | 独立 verifier／rubric 中间件，补验证与评分模式 † |
| LangChain：proactive agents | <https://www.langchain.com/blog/proactive-agents> | 厂商博客 | 主动式 agent 的触发条件与上下文设计，对应持久运行中的非轮询启动 |
| Meta Ranking Engineer Agent（REA） | <https://engineering.fb.com/2026/03/17/developer-tools/ranking-engineer-agent-rea-autonomous-ai-system-accelerating-meta-ads-ranking-innovation/> | 2026-03-17，厂商工程文 | 多日 ML pipeline agent，用 hibernate-and-wake checkpoint 恢复超过 6 小时的任务 |
| Ramp：为什么自建后台代理 | <https://engineering.ramp.com/post/why-we-built-our-background-agent>、<https://builders.ramp.com/post/why-we-built-our-background-agent> | 厂商工程文（两入口） | 自建后台代理用测试、遥测与截图自证，已占其合并 PR 一半以上，是“验证优先”的生产样本 |
| Shopify《Under the River》 | <https://shopify.engineering/under-the-river> | 厂商工程文 | Slack 入口编码 agent 的公司级推广与审查规则，给出组织规模下的真实采用数据 |
| Uber uReview | <https://uber.com/blog/ureview> | 厂商工程文（406，仅引用） | 覆盖大部分周 diff 的 AI 评审系统，对应“验证成为新瓶颈”；站点返回 406 拒绝自动抓取，由 Firecrawl 文引用核对 † |
| Microsoft：Ten months with CCA in dotnet/runtime | <https://devblogs.microsoft.com/dotnet/ten-months-with-cca-in-dotnet-runtime/> | 厂商博客 | 真实大仓库十个月 agent PR 的合并率与自主性数据，可对照宣传口径 |
| Hightouch long-running agent harness | <https://www.amplifypartners.com/blog-posts/how-hightouch-built-their-long-running-agent-harness> | 厂商访谈 | plan／execute 循环、文件型上下文卸载与隔离子代理的落地拆解，机制具体可复现 |
| Mastra Factory | <https://www.mastra.ai/factory> | 厂商产品 | 六阶段、三道人工审批的工厂化 agent 产品，补“人工门禁”这一派做法 |
| Warp Factories | <https://www.warp.dev/factories> | 厂商产品页 | 跑 agent 舰队的入口，可与 Warp Oz 的多 harness 控制面区分开看 |
| Cursor Automations | <https://cursor.com/blog/automations> | 厂商产品 | 事件／定时触发常驻 agent，可对照无人值守运行入口与审批边界 |
| Tencent TeamAI | <https://github.com/Tencent/teamai-cli> | 2026-10-10，MIT 开源 | 把团队 skills、rules、MCP、models、hooks 放进一个 Git 仓，push 自动开分支／合并请求，合并后各成员 agent 新会话自动拉取；README 称支持 19 种 agent；“成本降 76%”是内测口径，未独立核 ‡ |
| 滴滴 HelixHarness | <https://github.com/didi/helixharness> | Apache-2.0 开源 | 在 Codex／Claude Code 上搭团队 harness，9 个命令覆盖需求→实现→测试→评审→归档，verified lessons 留 Archive；附平台做使用观察与版本对比；中文企业样本，未独立验证 |
| 华为 JiuwenSwarm | <https://github.com/openJiuwen-ai/jiuwenswarm> | 2026-09-22，Apache-2.0，约 8.5k★（8,544，2026-11-02 快照）；同论文见 4.9 的 openJiuwen 论文行 | Leader 动态拆解、专业 Agent 分工协商，规划／性能／Swarm Flow 模式、Skill 自演进、HITL 与工具审批；论文自报 SWE-bench Verified 82.6%（比其选定的最强榜面 79.2% 高 3.4pp）；另在 Terminal-Bench 2.1 用同模型 Fable 5 对照得 84.04% vs Claude Code 83.8%（+0.24pp）。两个 benchmark 不可混读，增益主要来自系统差异 |

### 4.2 开源编排、并行运行与 Agent 团队框架（B）

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| paperclipai/paperclip | <https://github.com/paperclipai/paperclip> | 约 110k★（2026-11-02 快照） | 把多个编码 Agent 当公司员工：org chart、心跳唤醒领 ticket、按公司／Agent／项目预算硬停、审批与可回滚配置，任务式会话跨重启保留；本仓只到 lead-agent＋worktree 层 |
| stablyai/orca | <https://github.com/stablyai/orca> | 约 113k★ | 桌面、移动与远端 runtime 统一操作 Agent 舰队，可用自有订阅跑 Claude Code、Codex、OpenCode、Pi；对照 Happy／Agent View 的 fleet 形态 |
| bytedance/deer-flow | <https://github.com/bytedance/deer-flow> | 约 85k★ | 字节长程 SuperAgent harness：sandbox、memory、tools、skills、subagents 与 message gateway；本仓只引用过它的一个 LangGraph 补丁，未收 harness 设计 |
| ruvnet/ruflo | <https://github.com/ruvnet/ruflo> | 约 80.6k★（原 claude-flow） | swarm／meta-harness，强调多 Agent 协同、自适应记忆与 federation；需回源码核实际协调契约而非宣传 |
| ruvnet/metaharness | <https://github.com/ruvnet/metaharness> | 同作者 | 从仓库或空白页生成受治理 harness（CLI/MCP/记忆/策略），Darwin 模式生成竞品变体择优；与 ruflo 同一套编排拆成生成器 |
| ruvnet/agentic-flow | <https://github.com/ruvnet/agentic-flow> | 同作者 | ruflo README 指向的编排层，用来核对“swarm 编排”主张的代码基线 |
| Yeachan-Heo/oh-my-claudecode | <https://github.com/Yeachan-Heo/oh-my-claudecode> | 约 40.5k★ | Claude Code 的 teams-first 多 Agent 编排，强调并行执行、团队式任务分配与 opencode 协同；对照原生 subagent 的边界、恢复与成本 |
| getpaseo/paseo | <https://github.com/getpaseo/paseo> | 约 22.8k★ | 桌面＋移动端编排多个编码 Agent，看跨设备接管与人工介入入口；本仓移动端入口只有 Happy |
| HKUDS/DeepCode | <https://github.com/HKUDS/DeepCode> | 约 16.8k★ | open agentic coding，覆盖 agent harness、loop engineering、multi-agent orchestration |
| HKUDS/ClawTeam | <https://github.com/HKUDS/ClawTeam> | 开源 | 一条命令让 agent 自己组建 swarm、派生 teammate，通过文件或 P2P inbox 在 tmux worktree 间协调 |
| HKUDS/AutoSwarm | <https://github.com/HKUDS/AutoSwarm> | 开源 | 把 Codex、Claude Code、DeepSeek Harness、Muse、Grok 的上下文统一到一层，主打跨 harness 协同 |
| HKUDS/OpenHarness（ohmo） | <https://github.com/HKUDS/OpenHarness> | 开源 | 轻量 harness，主打会话保留式自动压缩与多代理协调，附个人代理 ohmo |
| ParadevAI/Paradev | <https://github.com/ParadevAI/Paradev> | 约 15.8k★（原 Superset） | agentic IDE 声称并行编排 100+ 编码 Agent；并行数不等于吞吐，需核资源争用与合并成本 |
| NanmiCoder/cc-haha | <https://github.com/NanmiCoder/cc-haha> | 约 15.3k★ | 中文本地优先桌面工作台：多 Agent、git worktree、diff、技能市场、多模型、Computer Use、微信／飞书／钉钉／H5 远程访问 |
| OrchestratorInc/agent-orchestrator | <https://github.com/OrchestratorInc/agent-orchestrator> | 约 14k★ | 每个任务独立 Agent、branch、worktree，监督到 CI、review、merge，CI 失败回派对应 Agent；补“任务到合并 PR”的完整生命周期 |
| omnigent-ai/omnigent | <https://github.com/omnigent-ai/omnigent> | 约 11.2k★；本仓仅一处引文，按未覆盖补链接 | meta-harness：同一编排层切换 Claude Code、Codex、Cursor、Pi 或自定义 YAML Agent，配策略与沙箱后端 |
| HarnessMD/munder-difflin | <https://github.com/HarnessMD/munder-difflin> | 约 9.3k★；站点 <https://munderdiffl.in/> | 笔记本／沙箱里的“办公室”，复用现有订阅；共享 task board、per-agent inbox、human-question queue、spending circuit breaker、crash recovery；HN 312 分，网站自报 6.7k★／100k 下载未独立核 |
| mvschwarz/openrig | <https://github.com/mvschwarz/openrig>、<https://www.openrig.dev/> | 约 8.6k★ | YAML 定义持久 Agent 团队（lead＋specialists），Claude Code 与 Codex 同 rig；注意 install 会改 CLAUDE.md／权限 |
| Orkas-AI/Orkas | <https://github.com/Orkas-AI/Orkas> | 约 7.7k★ | Commander 把目标拆成 to-do，协调 16 个内置专家及 Claude Code、Codex、OpenCode、OpenClaw、Hermes |
| open-multi-agent/open-multi-agent | <https://github.com/open-multi-agent/open-multi-agent> | 约 7k★ | TypeScript 自托管 runtime：coordinator 把目标转 task DAG，确定性调度，带审批、trace、checkpoint 与 resume；本仓缺“可审计运行记录＋恢复” |
| builderz-labs/mission-control | <https://github.com/builderz-labs/mission-control> | 约 6.4k★ | 自托管控制面：派任务、审 run、跟踪花费，操作 OpenClaw、Claude Code、Codex |
| EverMind-AI/Raven | <https://github.com/EverMind-AI/Raven> | 约 6k★ | host agent 把复杂任务计划成 DAG，协调依赖与并行，跨研究／编码／设计／值班 Agent 及第三方 ACP、CLI、OpenAI 兼容 Agent |
| agentscope-ai/AgentTeams | <https://github.com/agentscope-ai/AgentTeams> | 约 5.9k★ | 基于 Matrix room 的协作式多 Agent OS，任务协调透明、human-in-the-loop；补“共享房间／消息”协调面 |
| fengshao1227/ccg-workflow | <https://github.com/fengshao1227/ccg-workflow> | 约 6k★ | 中文多模型协作：一条命令分析意图、选策略、编排 Codex＋Gemini＋Claude 协作执行 |
| fujibee/agmsg | <https://github.com/fujibee/agmsg> | 约 1.6k★ | Bash＋SQLite 的跨厂商 CLI Agent 消息层，无 daemon、无框架；轻量协调原语候选 |
| PrimeIntellect-ai/prime-agent | <https://github.com/PrimeIntellect-ai/prime-agent> | 约 22.5k★ | 面向编码工作流与长跑自主任务的 self-improving RLM agent；效果需核原文，不能按 star 采用 |
| HarnessRouter/harnessrouter | <https://github.com/HarnessRouter/harnessrouter> | 约 3.9k★ | 自托管统一接口，把 Codex、Claude Code、Hermes、Pi、DSH 变成可替换后端，定义 Unified Harness Protocol |
| golutra/golutra | <https://github.com/golutra/golutra> | 约 3.9k★ | 多 Agent 编排平台，统一 Codex、Claude Code、OpenClaw 的自动化与工作流 |
| langchain-ai/open-swe | <https://github.com/langchain-ai/open-swe> | 约 11.2k★ | 异步编码 Agent：从 Slack、Linear、GitHub 触发，每任务独立云沙箱，产出 draft PR |
| openJiuwen AgentOS | <https://github.com/openJiuwen-ai/agentos-enterprise> | 官方开源（日期据搜索摘要 2026-10-09） | agent-runtime 分布式运行时、jiuwenswarm、Conch 沙箱、A2X registry 聚合，单机／集群、etcd/HA、全生命周期命令；日期与规模来自摘要，未读发布原文 |
| Google AX | <https://github.com/google/ax> | 开源（heavy development） | Kubernetes 风格 Task／Workspace／Gateway／Model 四原语，支持 workspace 预热、暂停／恢复与按集群百万级任务；README 标注会 breaking change |
| Hivekeep | <https://github.com/MarlBurroW/hivekeep> | MIT，约 74★ | 单容器自托管：一组持久 personal agents 共享记忆、互相协作；项目小，成熟度未知 |
| Flock | <https://github.com/whiteducksoftware/flock> | MIT，约 125★ | blackboard 编排：agent 声明消费／发布的 Pydantic artifact，工作流由订阅关系涌现；内置可见性、dashboard 与 OpenTelemetry |
| Bernstein | <https://github.com/sipyourdrink-ltd/bernstein> | Apache-2.0 | 协调环里没有 LLM 的确定性调度器，跑 50+ CLI agent；独立 worktree＋merge gate、YAML DAG、可离线重放 journal 与 Ed25519 signed receipt；star 较少 |
| Docker Agent | <https://github.com/docker/docker-agent> | 2026-10，Docker 官方开源 | YAML 定义多 agent 团队、自动委派、MCP 工具、think/todo/memory，可打包成 OCI artifact；Docker Desktop 4.63+ 预装；不是长任务调度器 |
| DeLM | <https://github.com/yuzhenmao/DeLM> | arXiv 2606.10662（2026-06） | 并行 agent 通过共享上下文和任务队列异步协作，自领任务、发布发现、复用彼此文件；公开 720 条 Terminal-Bench／DeepSWE 轨迹；Agensh 的共享上下文板即改编自它 |
| DS-Bot | <https://github.com/Fei2411/DS-Bot> | Apache-2.0，v0.2 preview | DeepSeek Harness 插件：创建一组长期存在的 bot，互发消息、群聊，Chief 一句话搭好 bot 团队 |
| DeepSeek Harness | <https://github.com/deepseek-ai/deepseek-harness> | MIT 开源 | 一切皆 Cordis 插件，含 session／sandbox／scheduling／loop 与 JS workflow 插件（agent()/parallel()/pipeline()） |
| gastownhall/gascity | <https://github.com/gastownhall/gascity> | 开源 | 从 Gas Town 抽出的可复用编排 SDK：city.toml 声明式配置、controller 对账、多 runtime provider、Beads-backed 工作流 |
| imbue-ai/mngr | <https://github.com/imbue-ai/mngr> | 开源 | “git for agents”：create/clone/migrate/snapshot 管理 agent，SSH+git+tmux，不锁定托管服务；Scion HN 评论点名推荐 |
| desplega-ai/agent-swarm | <https://github.com/desplega-ai/agent-swarm> | 开源 | lead/worker，worker 跑在隔离 Docker，带持久向量记忆、SOUL/IDENTITY、DAG＋HITL、定时任务；机制写得较具体 |
| yc-software/qm | <https://github.com/yc-software/qm> | 开源，HN 682 分 | YC 系“multiplayer agent harness for work”，把多人与多 agent 放进同一协作面；补多人并发与权限视角 |
| daman8271/the-perfect-orchestrator | <https://github.com/daman8271/the-perfect-orchestrator> | 开源 | 一个 lead Claude 在 tmux 指挥 N 个 worker，纯文件总线、无 daemon，对 worker 结论做对抗核验；附一次真实 fleet run 的原始 transcript |
| plasma-ai/fractal | <https://github.com/plasma-ai/fractal> | 开源 | agent 循环组成树，每节点在自己的 git worktree 迭代并递归派生子节点，用迭代／深度／子节点／成本／时间硬上限约束分叉 |
| CorellisOrg/Corellis | <https://github.com/CorellisOrg/Corellis> | 开源 | 基于 OpenClaw 的治理层，README 自述用 28 个 agent 的生产团队跑 ops、发布和周报，做目标分解、fleet-wide memory、纠错传播与审批 |
| awslabs/cli-agent-orchestrator | <https://github.com/awslabs/cli-agent-orchestrator> | AWS 官方开源 | 本地 cao-server 在隔离终端会话里起各种 CLI，supervisor 用工具把工作委派给 specialist，agent 保留原生认证 |
| mutable-state-inc/lean-collab | <https://github.com/mutable-state-inc/lean-collab> | 开源，HN 39 评论 | 20+ agent 用共享记忆协作做 Lean 4 定理证明，失败策略与成功战术都写入共享记忆，子目标失败会回溯；HN 讨论分解与观察成本 |
| stellarlinkco/myclaude | <https://github.com/stellarlinkco/myclaude> | 开源 | 面向 Claude Code、Codex、Gemini、OpenCode 的多后端工作流，`/do` 五阶段、`/omo` 路由编排、BMAD 六角色 |
| shahar061/the-office | <https://github.com/shahar061/the-office> | 开源 | Electron 像素办公室，CEO／PM／架构／工程／DevOps 按四阶段流水线把一句想法做到可提交代码库 |
| half-island-box/AGT | <https://github.com/half-island-box/AGT> | 开源 | 本地 CLI agent 桥与编排器：root 分解目标、spawn 子 agent、共享 ContextBrief、YAML SOP DAG、artifact 带 SHA-256 lineage、跨机 reverse-dial 派发 |
| Chorus-AIDLC/Chorus | <https://github.com/Chorus-AIDLC/Chorus> | 开源 | 自称 coding agent 的上一层 harness，agents propose／humans verify，处理任务状态、子 agent 编排、可观测与恢复 |
| Agentlas-OS | <https://github.com/agentlas-ai/Agentlas-OS> | 开源 | 专用 agent 放 hub、每任务临时拉起 orchestrator，本地优先；“按需编排”而非常驻调度 |
| Lody | <https://github.com/LodyAI/Lody> | 开源 | 把 coding agent 分享给团队并在手机和桌面接续，补 team harness 对照 |
| metaswarm | <https://github.com/dsifry/metaswarm> | 开源 | 18 agents、13 skills、15 commands 的多 agent 框架，强调 TDD 与质量门；HN 帖称一周末 127 PR（作者自述） |
| 49 Agents IDE | <https://github.com/49-Agents/49-IDE> | 开源 | 2D agentic IDE，把多项目／多机器的 agent、终端、git 树和 beads issue 放进一个空间 |
| Frink | <https://github.com/benord-labs/frink> | MIT 开源 | 桌面端并行 agent 与定时／webhook 触发的多步工作流 |
| OpenFlow | <https://github.com/SeeRay11/OpenFlow> | 开源 | 基于 opencode 引擎的可视化多 agent 工作流 builder |
| memdoor | <https://github.com/guregodevo/memdoor> | 开源 | 声称用 coding workflow harness 让小模型跑赢前沿模型，可核 harness 设计与评测口径 |
| Hephaestus | <https://github.com/Ido-Levi/Hephaestus> | 开源，HN 81 分 | 半结构化多 agent 框架，工作流在 agent 发现新信息后自行改写指令；“静态 DAG vs 运行中自改写”的反例样本 |
| KAOS | <https://github.com/axsaucedo/kaos> | 开源 | Kubernetes 上的 agent 编排系统，用 K8s 原语部署／管理 agent，补“集群级调度” |
| NousResearch Hermes Agent | <https://github.com/NousResearch/hermes-agent>、<https://hermes-agent.nousresearch.com/> | 开源 | memory/skills/subagents 型 agent，被 DeerFlow 的 skill 自演化 RFC 点名为灵感来源 |
| block/goose | <https://github.com/block/goose> | 开源 | Block 的开源 agent，Stripe Minions 明确基于其 fork 实现无人值守编码，是生产 harness 的现成基线 |
| OpenClaw | <https://github.com/openclaw/openclaw>、<https://openclaw.ai/> | 开源 | agent 网关／运行时，被 Paperclip 作为对照基线，也是多 harness 生态高频被引对象；同时是本轮最多 issue 回执的来源 |
| LiteLLM Agent Control Plane | <https://github.com/LiteLLM-Labs/litellm-agent-control-plane> | 开源 | 一个 API/UI 横跨 OpenCode、Hermes、Claude Managed Agents、Cursor Agents API、DeepAgents、OpenClaw，“多 harness 控制面” |
| TrueForge | <https://github.com/truefoundry/trueforge> | 开源 | 把模型调用、MCP 工具、skills、沙箱、审批、上下文管理和会话状态收进一个运行时，暴露 chat UI／HTTP API／TS SDK |
| Cordis | <https://github.com/cordiverse/cordis> | 开源 | “时空可组合性”元框架与插件内核，DeepSeek Harness 的 everything-is-a-plugin 架构建在它之上 |
| xAI Grok Build | <https://github.com/xai-org/grok-build> | xAI 官方开源（2026-07 起） | xAI 官方 coding agent harness 与 TUI，补官方 harness 对照 |
| Z.ai ZCode | <https://github.com/zai-org/ZCode> | Z.ai 官方开源（2026-09 起） | Z.ai 官方 coding agent harness，便于做跨厂商差异对照 |
| multica-ai/multica | <https://github.com/multica-ai/multica> | 开源 | 把 issue 当工单派给代理，代理自领、报进度、提 blocker、交回 review，支持 20 种 CLI 且可自托管 |
| OpenMeld | <https://github.com/amplifthq/openmeld> | 开源 | 人类与 agent 协作：共享上下文、并行工作、任何人可接着做，覆盖 Codex、Claude Code、Grok、OpenCode、Cursor |
| Meldwork | <https://github.com/Ryder-Sun/Meldwork> | 开源 | 本地优先的多 agent 工作组，让现有 agent 共享上下文、互相讨论并校验彼此结果 |
| Swarmatory | <https://github.com/fixture-inc/swarmatory> | MIT 开源 | Cloudflare Worker + D1 的单 Worker 共享 feed：团队成员各自 agent 发帖、回复、@、打标签，两个 agent 修同一 bug 时可先找到彼此 |
| AgentConnect | <https://github.com/agentconnect-md/agentconnect> | 开源 | “Claude Tag 替代”：把 agent 接入 Slack、Teams、Telegram、Discord、飞书、钉钉、QQ、GitHub；平台权限与可靠性未核 |
| Buzz（Block） | <https://github.com/block/buzz> | 开源 | 把 agent 当共享频道的一等成员，各持密钥与审计轨迹，跑在自建 Nostr relay 上 |
| aweb | <https://github.com/awebai/aweb> | 开源 | 给独立运行的 agent 稳定身份、durable mail/chat 和跨 session／runtime／machine 的 wake-up 事件，服务器可联邦 |
| Collie | <https://github.com/AltanS/collie> | 开源 | 手机端接管桌面 agent herd（经 herdr/tmux/zellij），补长任务期间“离开工位仍能介入” |
| dsh-plugin-recursive-harness | <https://github.com/Bear0117/dsh-plugin-recursive-harness> | 开源插件 | 把 Harness² 的 Propose–Probe–Compose 与跨任务经验库做成 DeepSeek Harness 插件 |
| pi-harness | <https://github.com/wangmiaozero/pi-harness> | 开源 | Pi 的运维超集：可观测性、治理、故障恢复、评估与多 agent 编排 |
| pi-herdsman | <https://github.com/boadij/pi-herdsman> | 开源 | 异步 Pi 子 agent 与 fleet 编排，支持嵌套委托、后台工作和监督 |
| pines | <https://github.com/edeng23/pines> | 开源 | 面向多个并行 Pi 会话的树状 TUI，让后台会话保活 |
| Contrabass | <https://github.com/junhoyeo/contrabass> | 约 224★ | OpenAI Symphony 的 Go/Charm 栈实现，可对照官方编排语义与可移植性 |
| LightSwarm | <https://github.com/craftfortress/lightswarm> | 开源 | 三 agent、TODO 列表、不自动提交的轻量 Claude Code swarm 脚本 |
| codex-subagents-mcp | <https://github.com/leonardsellem/codex-subagents-mcp> | 开源 | HN 上的小 MCP server，为 Codex CLI 补 reviewer／debugger／security 等文件化子代理角色 |
| delegatus | <https://github.com/Latand/delegatus> | 开源（原 live-log-viewer-next） | 把工作交给 Claude Code／Codex／Copilot 并在本地看板接管 |
| Claude Squad | <https://github.com/smtg-ai/claude-squad> | 开源（本仓 docs/08 已收） | 终端多会话控制面，为多种 CLI 分配隔离 git workspace 并走 review 流；本轮只作对照，不重复列 |
| 1Code（21st.dev） | <https://github.com/21st-dev/1code> | 开源 | 桌面多 agent 客户端：每 chat 独立 worktree、云 sandbox 后台跑、Kanban 与内置 Git/PR |
| ray-smg/agent-bridge | <https://github.com/raysonmeng/agent-bridge> | 开源 | 把 Claude Code 与 Codex 作为同一会话里的双向 peer，Codex 的评审直接推进 Claude 的实时会话 |
| mathomhaus/guild | <https://github.com/mathomhaus/guild> | 开源 | 单个 Go 二进制内含 MCP server 和 SQLite，为多 agent 提供共享上下文、记忆与任务协调，检索用 BM25 与向量 rank fusion |
| 23blocks-OS/ai-maestro | <https://github.com/23blocks-OS/ai-maestro> | 开源 | 跨机器 dashboard 管理 Claude、Codex 等，提供记忆搜索、code graph 查询和 agent-to-agent messaging |

### 4.3 持久运行、恢复与 durable execution（C）

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| Genkit Go 1.13：可恢复的 generate／agent loop | <https://genkit.dev/blog/genkit-go-1-13/> | 2026-09-03 发布 | 失败、取消或超时的 generate 与 agent turn 保留 failed／aborted snapshot，空输入或 snapshot ID 可续跑，只重做未完成的 tool round；`Async:true` 子代理立回 task ID，`RunDetached` 可跨进程 rehydrate。给“不引入整套编排平台也能细粒度恢复”一个原语；重试决策仍由应用负责 |
| Cloudflare Agents SDK v0.17：durable background sub-agents | <https://developers.cloudflare.com/changelog/post/2026-06-26-agents-sdk-v0.17.0/> | 2026-06-26 | `runAgentTool` 可 detach 子代理，由抗 eviction 的 durable backbone 承载，默认 `maxBudgetMs=24h`、可 cancel，happy-path exactly-once；子代理 reportProgress、命名 milestone 可持久重放；`runTurn` 统一 wait／submit／stream admission；exactly-once 仅 happy path，server actions／channels 仍 experimental |
| Microsoft Agent Framework Durable Extension + Magentic | <https://learn.microsoft.com/en-us/agent-framework/hosting/durable-extension> | 文档 2026-08-31，更新 2026-10-16；扩展包 2026-09 仍 preview | 把 agent session 与 graph workflow 放到 Durable Task：自动 checkpoint、故障后 replay、会话跨进程／扩缩容保留、人工审批可等数天到数周且不耗算力；Magentic 提供 manager 动态协调 planner／executor／reviewer。会话状态上限等细节需按后端核 |
| Vercel Workflow DevKit GA | <https://vercel.com/blog/a-new-programming-model-for-durable-execution> | 2026-04-16 GA | `use workflow`／`use step` 把每步输入输出、sleep、hook、错误写入 event log，崩溃或部署后确定性 replay；sleep 可数月不耗算力，50MB/step、2GB/run；Worlds 适配器可自托管。外部副作用幂等仍要应用保证 |
| AWS Bedrock AgentCore：长会话内存与冷启动 | <https://aws.amazon.com/blogs/machine-learning/the-new-agentcore-runtime-elastic-optimized-and-consistently-fast-starts/> | 2026-09-18 | 长会话运行时改为按需分页内存、回收冷内存并按实际用量计费；环境快照使 P75 冷启动约 2 秒（旧版 5.4–30 秒）。测量用空 echo agent、不含模型／应用；Runtime Instances 支持 14 天会话仅见二手，待核 |
| julep-ai/julep | <https://github.com/julep-ai/julep> | 约 6.6k★ | durable agent 框架：flow 崩溃可 resume、安全 retry、逐步可解释 |
| rivet-dev/rivet | <https://github.com/rivet-dev/rivet> | 约 6.6k★ | 以 Actor 为原语的有状态 runtime，面向 AI Agent 与 durable execution；补状态归属与并发模型 |
| inngest/utah | <https://github.com/inngest/utah> | 开源示例 | 不引入 agent 框架、只用 Inngest function/step/event 搭 think-act-observe，`step.invoke()` 派子代理、singleton concurrency 串会话；“durable execution 即 harness”的最小可运行反例 |
| Inngest：Your Agent Needs a Harness, Not a Framework | <https://www.inngest.com/blog/your-agent-needs-a-harness-not-a-framework> | 厂商博客 | 把重试、持久化、并发、追踪归给 durable event 基础设施，正文用 Utah 示范六函数拼出 loop |
| s2-streamstore/parallax | <https://github.com/s2-streamstore/parallax> | 开源，作者自标 vibecoded PoC | 用 S2 durable streams 做协调底座，独立 cohort 互不可见再收敛，支持 Delphi、人工入队与中途 steer；验证“流式事件日志能否替代消息总线” |
| ramarlina/agx | <https://github.com/ramarlina/agx> | 开源 | wake-work-sleep checkpointing，状态落地 SQLite WAL，宣称一周前开始的线程与一分钟前一样快恢复 |
| kungfu-systems/kungfu | <https://github.com/kungfu-systems/kungfu> | 约 4.5k★ | 把“同一件 Work”跨 Codex、Claude、OpenCode、Amp 迁移，带 attempt、断连／崩溃／恢复的确定性演示；补“工作项”而非“会话”作为持久单位 |
| futuregene/future-os | <https://github.com/futuregene/future-os> | 开源 | 内置 goal control plane：持久 goal、事件溯源状态、验证门和租约存活检查，面向 24 小时以上无人值守长跑 |
| 5dive-ai/5dive | <https://github.com/5dive-ai/5dive> | 开源 | 把 CLI agent 跑成 systemd 持久服务，每个 agent 独立 Linux 用户和权限，agent 间共享任务、委派并互检 |
| OpenHermit | <https://github.com/HCF-STUDIOS/openhermit> | MIT 开源 | 把 agent 内部状态（sessions、memories、instructions、skills、MCP、schedules、secrets）集中到 PostgreSQL 并按 agent_id 隔离，工作区放每 agent 沙箱 |
| APUS Reflex Agent | <https://github.com/APUS-AI-Lab/APUS-Reflex-Agent> | 2026-10，MIT，产品预览 | 决策交给独立 Reflex/Jev 决策服务，durable Session 保存任务历史，Goal state 随 Session 恢复；README 自述发布物仅限有权限者，安装包与效果未核 |
| Omnara | <https://github.com/omnara-ai/omnara> | 开源，HN 114 分；A-FRONTIER-WIDE-SCAN 曾排除，本轮因新讨论再出现，已注明来源 | durable agent API，作者强调 idle 时 agent 只是 Postgres 行、durability 原生在 harness；被作为 Claude Managed Agents 的开源替代讨论 |
| Platos | <https://github.com/winsenlabs/platos> | Apache-2.0，HN 10 分 | 自托管 agent runtime，一条 docker compose 起，定位托管服务的开源替代；样本小 |
| hankweave runtime | <https://github.com/SouthBridgeAI/hankweave-runtime> | 开源 | 单线程、headless 的长程数据 agent runtime，主打可维护／可修复与 checkpoint、event journal |
| Continuous Agent | <https://github.com/jackzhaojin/continuous-agent> | 开源 | PM2 下常驻的 executive/worker，用 PROMPT.md 定目标、八条预算与禁删等 constitution 约束、卡住写 needs-you.md 与人工异步沟通 |
| swarm-cc | <https://pypi.org/project/swarm-cc/> | 开源包 | 提供 `/swarm resume`，用 SubagentStop／SessionStart hook 做检查点，状态落 `~/.claude/swarm/runs`，用内容哈希拒绝被篡改图上的恢复 |
| Deft / Directive | <https://github.com/deftai/directive> | 开源 | 仓库实践层把标准、durable work state 与 gates 放在一起，并用 occupancy lease 防止并发会话互踩 |
| tool-journal | <https://github.com/RaycarlLei/tool-journal> | 2026-09-07，约 361★ | 针对“外部动作已完成但响应丢失”：执行前记 intent、SQLite 持久化、lease fencing，把不确定性作为显式结果返回；演示 kill 子进程后五种恢复策略 |
| OrcaReplay | <https://github.com/Continuum-AI-Corp/OrcaReplay> | 开源 | 记录一次 agent run 并可离线零模型调用回放，或从 checkpoint 换模型分叉比较；长程失败复盘基础设施 |
| Icepick（原 pickaxe） | <https://github.com/hatchet-dev/icepick> | Hatchet 开源 | 可扩展 TypeScript agent 库，由 HN durable-agent 讨论引出，可与 LangGraph checkpoint 路线对照 |
| Duron | <https://github.com/brian14708/duron> | 开源 | Python durable workflow 运行时，面向流式与中断恢复 |
| Restate：checkpointing 远未达到生产级 | <https://www.restate.dev/blog/why-checkpointing-is-not-production-grade-durable-execution> | 厂商观点文 | 与 LangGraph 三条 issue 相反：代理是分布式应用，checkpoint 只解决恢复，durability 还需更多机制 |
| Diagrid：Checkpoints Are Not Durable Execution | <https://www.diagrid.io/blog/checkpoints-are-not-durable-execution-why-langgraph-crewai-google-adk-and-others-fall-short-for-production-agent-workflows> | 厂商观点文 | 点名 LangGraph/CrewAI/Google ADK，与 #9006 的重放副作用、#8796 的并发写互为佐证 |
| reality-layer | <https://github.com/shimjaemandu/reality-layer> | 开源 | 主张把可重放／不可重放的副作用收口到框架无关执行层，是恢复契约的一种答案 |
| crashpoint | <https://github.com/mstevens843/crashpoint> | 开源复现 | LangGraph #8764 的配套复现：durable runtime 只对已 journal 的结果保证 exactly-once，崩溃早于首次落盘点仍会静默丢 run |
| clawdcursor | <https://github.com/AmrDab/clawdcursor> | 开源 | 把屏幕编译成 UI map、按稳定 id 操作元素，自己验证动作并统一走一个安全 checkpoint，供长程桌面任务 |

### 4.4 上下文接续、压缩、记忆与 handoff 协议（D）

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| OpenHands TaskToolSet | <https://docs.openhands.dev/sdk/guides/task-tool-set> | 官方 SDK 文档（无日期；本仓 docs/21 已有 OpenHands SDK，此处只补 TaskToolSet） | 父 agent 同步启动专用子代理并阻塞到完成；`task_id` resume 保留子代理上下文；`subagent_type` 可选／注册。明确只适合顺序阻塞任务，并行需另行编排 |
| OpenHands Condenser | <https://docs.openhands.dev/sdk/arch/condenser> | 官方架构文档（无日期；本仓 docs/21 已有 OpenHands SDK，此处只补 Condenser） | 事件数超过 `max_size`（默认 120）时保留首 `keep_first`（默认 4）条＋近期事件，用 LLM 摘要中间事件，生成含 `forgotten_event_ids` 的 Condensation；被遗忘事件只从模型视图消失、仍在事件流。说明“压缩”与“删除历史”的区别 |
| Cline：Focus Chain／Auto Compact／Deep Planning | <https://cline.bot/blog/how-to-think-about-context-engineering-in-cline> | 2025-08-19，v3.25 起默认开 | 任务开始自动生成 todo 并每 6 条消息重新注入（可配 1–100），Auto Compact 在窗口将满时摘要替换历史且 todo 保留，`/deep-planning` 先产出 implementation_plan.md；“周期性 todo 注入对抗长任务漂移”的最简实现，旧文且无量化 |
| headroomlabs-ai/headroom | <https://github.com/headroomlabs-ai/headroom> | 约 78.7k★ | 在工具输出、日志、文件与 RAG 块进入上下文前压缩，作者称编码 Agent 省 20% token、JSON 省 60-95% 且答案不变；“上下文入口压缩”与本仓 context-mode／摘要式压缩不同 |
| volcengine/OpenViking | <https://github.com/volcengine/OpenViking> | 约 41.4k★，AGPLv3 | context database：knowledge、memory、skills 统一放进 `viking://` 虚拟文件系统，按目录范围检索；“上下文即文件系统” |
| akitaonrails/ai-memory | <https://github.com/akitaonrails/ai-memory> | 约 14.9k★ | 跨 20+ harness 的长期记忆与 typed handoff（作者称每个 handoff 恰好被领取一次）；`ai-memory run` 可带本地会话投影续跑；跨厂商“交接协议” |
| modiqo/waggle | <https://github.com/modiqo/waggle> | 约 637★ | 把交接物变成约 30 字节 token，接收方按自身预算解析投影，记录每次读取并传播更正，MCP 原生；直接回应多 Agent 上下文复制 |
| ranxianglei/billion-context | <https://github.com/ranxianglei/billion-context> | 约 3.7k★（月 trending） | 上下文压缩插件，作者主张 100K 窗口跑月级、十亿 token 会话，5× token 节省；不据宣传采用 |
| oceanbase/powercontext | <https://github.com/oceanbase/powercontext> | 约 1.5k★ | OceanBase 的 Agent memory：长期记忆＋跨 Claude Code/Codex 的记忆 handoff；国内基础设施厂商的记忆层样本 |
| parceladei/Continuous-Claude-v3 | <https://github.com/parcadei/Continuous-Claude-v3> | 约 3.9k★ | 用 hooks 把状态写进 ledger 与 handoff，MCP 执行不污染上下文；“ledger＋handoff”机制 |
| Storybloq/storybloq | <https://github.com/Storybloq/storybloq> | 约 788★，PolyForm Shield | 把 story、plan、handover、review evidence 放在代码旁，跨会话续接；源码可见许可不是 OSI 开源 |
| cortexkit/magic-context | <https://github.com/cortexkit/magic-context> | 约 2.5k★ | 主张“无限上下文、自管理记忆、一个会话用到底”，面向 coding agent 的 hippocampus 层 |
| alexisfox7/PRO-LONG | <https://github.com/alexisfox7/PRO-LONG> | 约 464★ | 把全部交互事件追加到 `.prolong/log.jsonl`，Agent 用代码检索而不是靠摘要；论文称 ARC-AGI-3 97.4%（作者自报） |
| GMaN1911/claude-cognitive | <https://github.com/GMaN1911/claude-cognitive> | 约 451★ | Claude Code 的工作记忆与多实例协调，避免每个新实例重新发现代码库 |
| mex-memory/mex | <https://github.com/mex-memory/mex> | 约 1.8k★ | 团队记忆放进 repo、经 Git 共享，符号锚定的 wiki 带 drift detection 与 task-aware routing |
| vshulcz/deja-vu | <https://github.com/vshulcz/deja-vu> | 约 1.4k★ | 索引 Agent 已落盘的会话，经 MCP 回放，无 LLM、无 embedding、无 API key；“零成本会话检索” |
| wilbeibi/catchup | <https://github.com/wilbeibi/catchup> | 约 83★ | 本地优先 CLI，跨 Claude Code、Codex、Cursor、Cline、Kimi、Antigravity 转移并恢复会话；采用量小 |
| big0lives/codex-task-pointer | <https://github.com/big0lives/codex-task-pointer> | 2026-08-30，约 218★ | 用 pre-compaction hooks＋CAS(gen/revision) task pointer，把“goal + next step”在 compaction 后由 SessionStart 重注入；作者自用一个月，Windows PowerShell |
| CliffCompaction | <https://github.com/nguyenvuthientrang/cliffcompaction> | 2026-09，配 arXiv 2609.26779 | 把 agent 的 base URL 指到本地代理即可在 token 预算内自动压缩，agent 无感；作者工具，无独立评测，代理路径会改变实际请求 |
| Self Compact（Pi agent 自压缩） | <https://github.com/disler/self-compact-pi-agent> | 2026-09-20，约 81★ | agent 自己看 context gauge：notice 提示、warning 要求写 note_to_self、hard cutoff 只允许 self_compact，压缩后把原 note 作为下一条消息返回 |
| Context Continuity | <https://github.com/JasperLin2333/context-continuity> | 中文开源 Skill | 六要素最小交接包（目标与授权、已采纳决定及依据、准确源路径、已完成与剩余、修改责任与验证边界、回写位置），要求接手方打开源文件核实；作者称合格交接通常 15 行内 |
| Context Ledger | <https://github.com/wiztek-llc/context-ledger> | 开源 | commit-boundary 压缩：每个 feature 提交后用结构化 ledger（commit message、公开接口签名、变更文件图）加 git SHA 替换约 10k token 构建上下文；作者自报 93% 事实保留、约 5× 低成本 |
| Jotbus | <https://jotbus.com/> | 2026-10-06 产品 | 端到端加密的共享 scratchpad：不同机器／coding agent 通过 MCP 传笔记、patch、日志、截图，@mention 在对方活跃时送达，但明确不唤醒 idle agent、不做编排；“handoff 传输层”，28 分 HN 讨论 |
| Skillsync | <https://skillsync.com> | 2026-09-17 产品 | 把 Claude Code、Codex、Cursor、OpenCode、Amp 会话索引成可移植／可搜索的同一层，可原 agent 恢复或换 agent 继续；HN 68 分／62 评论里有人追问跨模型切换的质量损失与压缩行为，产品未给保真度基准 |
| DeltaDB（Zed） | <https://zed.dev/blog/introducing-deltadb>、<https://delta.dev/deltadb> | 官方博客 | 把人和 agent 的每次编辑连同产生它的对话记成 SQLite/CRDT 因果图，timeline 表示并行子代理并在共同祖先处同步，可 replay、scrub；无吞吐／延迟基准 |
| Delta：fine-grained version control for agents | <https://delta.dev/blog/fine-grained-version-control-for-agents> | 2026-10-29 | 用 CRDT、DAG delta、SQLite 与 Cloudflare Durable Object 记录“代码背后的推理与对话”，可指向一段代码回看生成它的会话；自述无基准 |
| calpaterson：Agent memory as a file format | <https://calpaterson.com/memoryfields.html> | 2026-08（HN 191 分） | 提出 `.memoryfield.zip`：Markdown 页面＋可选 SQLite 向量索引，单页约 8KB/2000 token，检索走语义搜索；HN 正反都有（“markdown+RAG”与“agent 只会 grep”） |
| Memoryfield 规范 | <https://github.com/calpaterson/memoryfield-spec/blob/main/SPEC.md> | 开源规范 | 把代理记忆定义成可移植 zip（Markdown 页＋可选 SQLite 向量索引），用格式而非管线解决跨工具迁移 |
| Operator Memory | <https://github.com/aerovato/operator-memory> | 开源 | 反对 RAG 式 memory，主张让代理维护结构化需求／决策／约束／索引的 context engine，并给出跨 harness 实现 |
| MemPalace | <https://github.com/MemPalace/mempalace> | 开源 | 本地逐字存储加语义检索，README 声称 LongMemEval 96.6% R@5 且零 API 调用；issue #27（README 与代码不符）与 #39（M2 Ultra 独立复现）对其 benchmark 有争议 |
| zilliztech/mfs | <https://github.com/zilliztech/mfs> | 开源 | Zilliz 的 context harness，把代码、记忆、文档、数据库和 SaaS 收进一个类文件、可搜索可浏览的接口 |
| EverMind-AI/EverOS | <https://github.com/EverMind-AI/EverOS> | 开源 | 可移植、local-first、Markdown 原生的记忆层，跨 app/tool/workflow 自演化，让多 agent 共享同一份用户记忆 |
| ranxianglei/acp-kernel | <https://github.com/ranxianglei/acp-kernel> | 开源 | host 无关的上下文压缩引擎，3 层 LSM-tree 压缩、增长触发策略和保护内容过滤 |
| ruvector | <https://github.com/ruvnet/ruvector> | 开源 | metaharness 声明使用的向量＋agent 数据库与记忆后端，属同作者持久状态方案 |
| Sno Station | <https://github.com/sno-ai/sno-station> | Apache-2.0 开源 | 让 Claude Code、Codex、Cursor、Hermes、OpenClaw 共享同一份 memory，一个 agent 撞限额后另一个从同一 memory 接着做；收益均为自报 |
| CommonGround Kernel | <https://github.com/Intelligent-Internet/CommonGround> | Apache-2.0，v3r1 preview，约 153★ | Postgres 支撑的 durable public substrate，保存共享任务状态、交接事实、边界输入输出、证据和恢复上下文；“跨 agent 持久状态”的协议化实现 |
| Trellis（mindfold-ai） | <https://github.com/mindfold-ai/Trellis> | 开源 | 把 specs、记忆与工作流打包成 agent 可复用的项目状态层 |
| oh-my-pi | <https://github.com/can1357/oh-my-pi> | 开源 | 实现 `/handoff` 与 compaction 管线：复用实时 turn 的缓存前缀、保留 recent tail、按需落 handoff 文件 |
| OpenTrajectory | <https://github.com/abhid1234/opentrajectory> | 开源 | 厂商中立的单文件 `.ot.json` 运行轨迹格式（steps/outcome/harness/cost），可作可移植 handoff 的证据层 |
| open-managed-agents | <https://github.com/openma-ai/open-managed-agents> | 开源 | 含 trajectory v1 规范，定义 session/task/event 因果字段，适合对照托管 agent 的轨迹契约 |
| baton | <https://github.com/sukamenev/baton> | 开源 | 纯 Go 的无损会话交接 CLI，读各 agent 原生日志、定位 compaction checkpoint，支持加密跨机转移 |
| handover | <https://www.npmjs.com/package/@avee1234/handover> | npm 包（页面 403，仅摘要） | 跨 harness 的 JSON handoff packet 开放格式（goal/context/progress/state/next_steps），内容寻址、单文件而非服务；未读包页正文 |
| reinstate | <https://github.com/HarjjotSinghh/reinstate> | 开源 | 本地连续性 CLI，提供 sessions/search/resume/fork/handoff，支持跨厂商接手 |
| continuum-toolkit | <https://pypi.org/project/continuum-toolkit/> | PyPI 包 | 捕获 workspace/AST 状态并生成面向不同模型的 handoff prompt 包，带 resume center 与快照恢复 |
| exoprotocol | <https://pypi.org/project/exoprotocol/> | PyPI 包 | 多代理开发的治理内核：ticket 范围围栏、session 生命周期、崩溃恢复，并在 session-start 注入上一轮 handoff |
| ker | <https://github.com/benitolopez/ker> | 开源 | 最小 coding agent，带 pruning+compaction、可读 summary 与 session 可移植性；作者逐项比较 OpenAI/pi/opencode 的压缩策略 |
| Context Mode | <https://github.com/mksglu/context-mode> | 开源（本仓已试） | MCP 上下文优化服务器，沙箱化工具输出、索引 session 事件并在 compaction 后恢复连续性；本轮只作对照 |
| planning-with-files | <https://github.com/OthmanAdi/planning-with-files> | 开源（本仓已有实验） | 文件式持久规划的 skill 包，用磁盘计划文件替代会话内记忆；本轮只作对照 |
| claude-mem | <https://github.com/thedotmack/claude-mem> | 开源（本仓已收） | 跨会话记忆与上下文压缩插件；本轮不重复列 |
| aoci-code | <https://github.com/aoci-spec/aoci-code> | 开源 | 持久、Git 版本化的代码库与数据库 schema 地图，agent 开工前先读，把“项目上下文”变成可版本化产物 |
| OpenLore | <https://github.com/aakarim/OpenLore> | 开源 | 面向 agent 的极简知识仓库，强调共享上下文保持最新且可检查 |
| tigerless-labs/agent-memory | <https://github.com/tigerless-labs/agent-memory> | 开源 | 以 Markdown 为事实源、本地排序检索的长期记忆运行时，与向量库路线相反 |
| agentmemory | <https://github.com/rohitg00/agentmemory> | 开源 | 面向 coding agent 的持久记忆项目，声称基于真实基准，可核其基准方法 |
| MemOS | <https://github.com/MemTensor/MemOS> | 开源 | 自演化记忆 OS，超持久记忆、混合检索与跨任务迁移，偏研究 |
| gbrain | <https://github.com/garrytan/gbrain> | 开源 | Garry Tan 的 OpenClaw/Hermes agent brain，展示高曝光实践者如何组织个人 agent 的记忆与上下文 |
| OptMem | <https://github.com/VictorTaelin/OptMem> | 开源 | 用 426-token prompt 加脚本实现“永久记忆”的极简方案，记忆机制的最小对照 |
| paritok | <https://github.com/Paritok-official/paritok-4b-v1> | 开源 | 面向 coding agent 的非破坏性压缩网关，按轮次降低 token，与 Headroom 同类但走网关层 |
| Memoranda | <https://memoranda.dev> | 产品 | 带来源、人工审批和回执的受治理共享记忆（8 个工具，1 写 7 读），可对照 Context Ledger／Continuity 的可审计记忆路线 |

### 4.5 任务分解、规格与工单编排（E）

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| openai/symphony | <https://github.com/openai/symphony> | OpenAI 开源（本仓 docs/01 codex 段与 research 已收 Symphony；此处只补仓库入口） | 把“管理 agent”改成“管理工作”的 spec-first 参考实现：Linear 看板触发隔离运行、产出 CI／评审／演示证据；README 明确要你让自己的 agent 按 SPEC 重写 |
| steveyegge/beads | <https://github.com/steveyegge/beads>、<https://github.com/gastownhall/beads> | 开源（Dolt） | 依赖图 issue tracker，把任务状态放成 agent 可 claim 的图，是 Gas Town 的持久状态底座；HN 评论有“merge 冲突、225k 行 Go、实现不稳”的负反馈 |
| superplanehq/superplane | <https://github.com/superplanehq/superplane> | 约 8.5k★ | 把 backlog issue 经编码 Agent、源码控制、CI、review、审批串成 review-ready PR 的“one-shot engineering”工厂 |
| automazeio/ccpm | <https://github.com/automazeio/ccpm> | 约 8.4k★ | 用 GitHub Issues ＋ git worktree 做并行 Agent 的项目管理 Skill 系统；“工单即任务队列、worktree 即隔离”的轻量组合 |
| gotalab/cc-sdd | <https://github.com/gotalab/cc-sdd> | 约 3.7k★ | 把已批准的 spec 转成长跑自主实现，带 steering 的 SDD harness；“规格→长任务”的接续契约 |
| moazbuilds/CodeMachine-CLI | <https://github.com/moazbuilds/CodeMachine-CLI> | 约 2.5k★ | 把编码 Agent 编成可重复的长跑工作流；可核其任务状态、重试与产物交接 |
| mattpocock/skills：Wayfinder | <https://github.com/mattpocock/skills/blob/main/skills/engineering/wayfinder/SKILL.md> | 开源 Skill | 多会话规划：把超出单会话的大工作画成 issue tracker 上的 map（索引而非存储），ticket 是决策而非实现切片，每 session 最多解一个 ticket，frontier 是未阻塞未认领子 issue；repo 已提作者其他 skill，未收这套 map/ticket 协议 |
| JeiKeiLim/tenet | <https://github.com/JeiKeiLim/tenet> | 94★，MIT；本仓 docs/04 的 grep 命中为其他词义，按未覆盖补链接 | 12+ 小时自主开发：interview→spec→依赖图→逐 job 实现→独立 critic（fresh context、看不到作者推理）评审→经验折回 project doctrine；SQLite/WAL、server-ID crash recovery、heartbeat stall detection、默认无限重试；作者自报项目，规模小 |
| jonwiggins/optio | <https://github.com/jonwiggins/optio> | 开源 | Kubernetes 原生、ticket→PR：GitHub/Linear/Jira/Notion 入口、每任务独立 pod＋worktree、CI 失败自动恢复，区分 Task／Job／Persistent Agent |
| crewplaneai/crewplane | <https://github.com/crewplaneai/crewplane> | 开源 | Markdown 定义 prompt／阶段／交接／规则，运行记录与交接全部落盘，review 作为 gate，已完成工作跨失败保留 |
| tale-project/tale | <https://github.com/tale-project/tale> | MIT 开源 | 团队＋agent 共享项目工作区，任务卡指派给 manager agent 再委派，agent 跑持久 sandbox、按容量限并发 |
| acartine/foolery | <https://github.com/acartine/foolery> | 开源 | 架在 Beads 之上的本地 Web UI，作者自述动机是 12 个 tmux pane、7 个孤儿 worktree 和上下文被微想法耗尽；Beads 类方案的操作层缺口 |
| recursive-mode | <https://recursive-mode.dev> | 产品 | 文件驱动的分阶段 skill（phases/artifacts/memory/subskills/worktree），代理把需求、计划、实现证据写回仓库，自称 Factory.ai Missions 的免费前身 |
| bensyverson/jobs | <https://github.com/bensyverson/jobs> | 开源 | Markdown 计划＋分层 YAML 任务＋SQLite/append-only log，`job orient` 把当前任务放回大计划；HN 评论者用它替代 plan mode |
| Epiq（git-native issue tracker） | <https://epiq.sh/>、<https://ljtn.github.io/epiq/> | 产品 | append-only 事件日志、每人／每 agent 独立身份、时间回放、票内 diff；HN 评论被当作 Beads 的直接替代 |
| wedow/ticket | <https://github.com/wedow/ticket> | 开源 | 单 bash 脚本、git 原生 ticket，带依赖图和优先级；HN 作者明确说用它替换 Beads |
| beads_rust | <https://github.com/Dicklesworthstone/beads_rust> | 约 1.1k★ | Beads 的 Rust 移植，local-first SQLite＋JSONL 导出，可对照原版 Dolt 依赖的开销与同步方式 |
| knots | <https://github.com/acartine/knots> | 开源 | 自称“像 Beads 但更轻”的 agent memory progression 系统 |
| codesyncer | <https://github.com/bitjaru/codesyncer> | 开源 | HN 评论者自述的轻量 Gas Town 替代：1 个 agent、上下文存代码注释、5 分钟配置 |
| umputun/ralphex | <https://github.com/umputun/ralphex> | 开源 | 每个任务开全新 Claude Code/Codex 会话执行计划，避免长会话上下文退化，带验证、重试、多阶段评审和自动提交 |
| looptroop-ai/LoopTroop | <https://github.com/looptroop-ai/LoopTroop> | 开源 | LLM council 先访谈出 PRD 并拆成原子 beads，再让每个 bead 在隔离 worktree 跑 Ralph 式修复循环，执行时只给当前 bead 最小上下文 |
| jaysu66/agent-system-methodology | <https://github.com/jaysu66/agent-system-methodology> | 中文实践文 | 约 100 小时 harness v3 实战抽出的任务切分＋多 agent 协作＋长时执行方法论，含 3 角色＋daemon＋编排 Skill、5 路审查、7-gate 合并与 checkpoint 恢复 |
| Geoffrey Huntley：Ralph Wiggum technique | <https://ghuntley.com/ralph/>、<https://ghuntley.com/loop/> | 方法论原文 | 单进程循环灌同一 PROMPT.md、测试／类型系统做 backpressure、子代理只做上下文节省；作者明确说不适用于既有代码库 |
| snarktank/ralph | <https://github.com/snarktank/ralph> | 开源实现 | Ralph loop 的可运行实现，补原方法只有文字、缺代码的缺口 |
| loopgate_harness | <https://github.com/rxdt/loopgate_harness> | 开源 | 循环 harness，支持 Claude/Codex/Copilot，可对照 ralph 类循环的退出条件与门禁设计 |
| ralph-kata-2 | <https://github.com/waynenilsen/ralph-kata-2> | 开源 | 作者 HN 自述用它在 droplets 上 15 小时无人值守跑出 118 commits 的 Ralph 循环提示词集 |
| loop-engineering | <https://github.com/cobusgreyling/loop-engineering> | 约 1.1 万★ | 把“设计循环”而非“写 prompt”做成模式、starter 和 CLI 评分 |
| oskargroth：Orchestrating a One-Person Software Factory | <https://oskargroth.com/blog/orchestrating-agents> | 2026-10-28 实践文 | 一人软件工厂的 agent 编排，含分工与流程细节，真实使用者叙述 |
| addyosmani/factory | <https://github.com/addyosmani/factory> | 开源 | 把一个可安装的工厂操作模型写进仓库：scheduled agents 分诊 issue、实现、测试、审查并开 draft PR，最小工厂样本 |
| DoorDash Agentic Orchestrator | <https://github.com/doordash-oss/agentic-orchestrator> | 开源 | 确定性分阶段门禁（research→design→plan→implement→review→publish），一个桌面工作区监督并发 workflow |
| Attractor（StrongDM） | <https://github.com/strongdm/attractor> | 开源 | 以 nlspec 定义“足以用于软件工厂的非交互式 coding agent”，可作为长跑代理的最小能力契约 |
| Hatice | <https://github.com/mksglu/hatice> | 开源 | 轮询 issue tracker、隔离 workspace、Claude Code 多轮执行／指数退避重试／对账，Symphony 式票单编排的小型可读实现 |
| codex-autorunner（CAR） | <https://github.com/Git-on-my-level/codex-autorunner> | 开源 | 把计划转成 ticket，跨 Codex/Hermes/ACP agent 长跑排队，只在卡住时经 Telegram/Discord 找人 |
| dely | <https://github.com/hieuphung97/dely> | 开源 | 多 harness 控制协议：请求先变成获批的设计契约，再编排隔离 worker 顺序实现并做独立审查 |
| Blueprint（Imbue） | <https://github.com/imbue-ai/blueprint> | 开源 | 面向一次性大任务的规划副驾：先读代码库、用有依据的多选题消歧，再产出给 Claude Code/Codex/Gemini/Pi 的 markdown 计划 |
| Plan Desk | <https://plandesk.asyncdot.com> | 产品 | Chief of Staff 模式实际使用的持久 MCP 规划板，保存任务依赖、设计文档、状态与评论 |
| Nuanced | <https://www.nuanced.dev/> | 产品 | 文档编辑器式的规划／构建工作台，主张用持久 spec 取代 chat 内的 plan mode |
| Codex Studio（社区提案） | <https://community.openai.com/t/1408219> | 论坛提案 | 把 task/decision/rule/run/result 做成项目级一等记录，并用 context resolver 取代无限记忆 |
| clawsweeper | <https://github.com/openclaw/clawsweeper> | 开源 | 在 OpenClaw #118625 讨论里被提及，自动扫描 issue/PR 并给出可关闭建议，长任务仓库的维护侧工具 |
| SFML | <https://sfml.craftmill.dev/> | 产品 | 用声明式标记描述软件工厂（“Terraform for agents”），工厂配置化的新尝试 |
| Luke PM：The Software Factory | <https://lukepm.com/blog/the-software-factory/> | 实践文 | StrongDM 明确点名的同路线实践文，可比较两套工厂主张 |
| Dan Shapiro：Five levels to the software factory | <https://www.danshapiro.com/blog/2026/01/the-five-levels-from-spicy-autocomplete-to-the-software-factory/> | 2026-01 观点文 | 软件工厂成熟度分级框架，给“当前处在哪一级”提供标尺 |
| BMad | <https://github.com/bmad-code-org/BMAD-METHOD> | 开源（本仓已有） | Nearform 实际与 Gas Town／Beads 并用的规划方法，可对照任务拆分与角色设计 |

### 4.6 完成判定、验证与审查（F，跨 VERIFY-REVIEW）†

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| Nom Army | <https://github.com/rayson-tech/nomarmy> | 2026-09-27 | General 定义验收、Podman 沙箱内 bounded worker 实现，独立读 git diff、重跑测试、反向撤销生产改动再跑测试；自报 2026-09-18 至 10-10 共 783 个 job，诚实给出小任务多 4–8 倍 General token、盈亏平衡约 150 行上下文 |
| the-open-engine/zeroshot | <https://github.com/the-open-engine/zeroshot> | 约 2.1k★ | 把 QA 流程写成图，强制每次 Agent run 按图执行，独立 Agent 写／审／测，失败进修复环；“流程即门禁”，“300+ 公司采用”是作者自报 |
| AI Engineer NYC：Basis《Process Supervision for Agents That Do Long-Horizon Work》 | <https://ai.engineer/nyc/2026/talks/basis> | 2026-10-14 讲稿 | 长程 agent 的过程监督：behavior specs＋trajectory judge＋fork 前后决策＋用 subagent 低成本模拟；$412.06 对账例子中 agent 找不到差异却直接调账并报零差异，“结果对但过程错” |
| aldi949/truth-firewall | <https://github.com/aldi949/truth-firewall> | 开源 | 独立于执行者的完成校验门，直接针对 Codex #49705 的“改写验收标准后假完成”，作者在 issue 里邀请用该案例打靶 |
| jinngimk-lang/agentci | <https://github.com/jinngimk-lang/agentci> | 开源 | evidence-first CI 与沙箱证据校验，正在收集“完成但投递丢失”类可复现 fixture |
| no-human-ai/no_human | <https://github.com/no-human-ai/no_human> | 开源 | 从 ticket 到已评审 PR：第二个模型在全新会话里被要求反驳「done」，tamper guard 阻止净删测试骗过评审，合并仍留给人 |
| Anneal | <https://github.com/mosonlab/anneal> | 开源 | 无人值守串联多个 coding agent，合并前强制两个独立 reviewer；对照“验证门是否真的独立” |
| proof-loop | <https://github.com/LeoStehlik/proof-loop> | 开源 | repo 级验收协议：验收标准、独立 verifier 角色、证据化 done 声明 |
| Vet（Imbue） | <https://github.com/imbue-ai/vet> | 开源 | 本地审查工具同时读代理对话和 diff，专抓“声称跑过测试但没跑”“半实现”这类静默失败 |
| agentbehavior.dev／braintrustdata/agentbehavior | <https://agentbehavior.dev> | 规范 | .agents/behaviors/*/BEHAVIOR.md 过程行为规范，配 judge 评估长程轨迹，补 outcome eval 看不到的过程质量 |
| oh-my-agent | <https://github.com/first-fluke/oh-my-agent> | 开源 | 用 stop-hook 门禁、产物检查和独立 judge 重新验证 agent 的完成声明，不信任自述 |
| sd0x-dev-flow | <https://github.com/sd0xdev/sd0x-dev-flow> | 开源 | Claude Code hook 层：双 review、持久状态机门禁、compaction 恢复与 fail-closed 安全 |
| Vigil | <https://github.com/VigilOSS/Vigil> | 开源 | 面向长跑代码审计／渗透的 agent harness，围绕 anchored hypothesis、假阴性和可恢复状态设计 |
| AutoHarness | <https://github.com/aiming-lab/AutoHarness> | 开源 | 面向 harness 的自动审计、治理与安全评估，“harness 自身如何被验证” |
| AgentEtna Action | <https://github.com/AgentEtna/action> | 开源 | 在 PR 上重放代理已经建立的行为并报告被破坏项，长跑代理“改一处坏另一处”的回归检查入口 |
| Spotify：Feedback loops for background coding agents, part 3 | <https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3> | 2025-12 厂商工程文 | 嵌套反馈环（确定性检查＋LLM judge＋CI）的设计，补多代理长跑的验证层 |
| vshvedov/elephant-goldfish | <https://github.com/vshvedov/elephant-goldfish> | 开源 | 比 Google EGM 更早的独立实现，说明“深上下文设计＋零上下文评审”已有两条独立落地路径 |

### 4.7 隔离、沙箱与工作区（G）

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| NVIDIA OpenShell | <https://github.com/NVIDIA/OpenShell> | 2026-10-22，Apache-2.0，HN 508 分 | 面向长驻／多 agent：内核级文件、syscall、网络策略，凭证只在发往批准端点时注入，策略变更先做形式化验证再放行；默认 sandbox 为最小 Ubuntu；实际策略覆盖与性能未独立复测 |
| load-lock | <https://github.com/aron98/load-lock> | 2026-10-26，MIT，HN 1 分 | 并行 agent（不同 worktree／harness）的 build、test 会互相抢核、互相污染 cache；load-lock 提供共享计数信号量；补 worktree 不隔离 CPU/cache 的缺口 |
| jj workspaces for parallel agents | <https://minikin.me/blog/jj-workspaces-for-parallel-agents/> | 2026-10-21 实践文 | 5 个并发 Claude Code 的真实经验：jj workspace 下不打断 agent 就能看未提交 diff、把所有 workspace rebase 到 main、错误只留在自己的 commit；个人实践非对照 |
| minikin/dotfiles 的并行 agent 指南 | <https://github.com/minikin/dotfiles> | 配套仓库 | 含 parallel-agents.md，给出 workspace、冲突与 handoff 的可复制操作 |
| Jujutsu workspaces 文档 | <https://docs.jj-vcs.dev/latest/> | 官方文档 | jj-workspaces 文章的底层机制来源，git worktree 之外另一条隔离与交接路线 |
| workmux | <https://workmux.dev/> | 2026-10-25，HN 2 分 | 用 tmux 为每个并行 coding agent 管理 pane/worktree 与任务切换；机制与 Claude Squad 类工具重叠，HN 讨论极少 |
| cmux | <https://github.com/manaflow-ai/cmux> | 开源 | workmux 的 HN 评论里被点名的 agent 终端复用器，tmux 方案之外值得对照的会话承载层 |
| Delagen Agent Worktrees | <https://open-vsx.org/extension/delagen-ai/delagen-agent-worktrees> | 扩展（open-vsx 页面只有空壳） | Cursor/VS Code 扩展在 `.worktrees/` 下创建、打开、移除 worktree，支持 `.cursor/worktrees.json` 初始化；Cursor 市场审核帖 #176053 通过、无负面反馈 |
| GoogleCloudPlatform/scion | <https://github.com/GoogleCloudPlatform/scion> | 开源 | 自称 hypervisor for agents：容器隔离＋独立凭据＋每 agent 一个 worktree，harness 无关；HN 帖作者亲自回复状态／遥测问题 |
| Treehouse | <https://github.com/kunchenguid/treehouse> | 开源 | 维护可复用的 worktree 或 Jujutsu workspace 池，保留依赖和构建缓存，补 jj workspaces 的环境冷启动问题 |
| Worktrunk | <https://github.com/max-sixty/worktrunk> | 开源（本仓已收） | 把 worktree 做得像 branch 一样简单的 CLI；本轮只作对照 |
| Git Worktree Runner (gtr) | <https://github.com/coderabbitai/git-worktree-runner> | CodeRabbit 开源 | 每分支 worktree 自动化 CLI，带 AI 工具集成，重点是减少并行会话的 setup 摩擦 |
| Kubernetes Agent Sandbox | <https://github.com/kubernetes-sigs/agent-sandbox> | Kubernetes SIG 开源 | 用 gVisor/Kata 声明式提供隔离 agent 运行时，agent 沙箱基础设施标准化的信号 |
| Anthropic Sandbox Runtime (srt) | <https://github.com/anthropics/sandbox-runtime> | Anthropic 官方开源 | 无容器 OS 级沙箱（macOS Seatbelt、Linux bubblewrap），供 Claude Code 与 MCP server 使用 |
| Agent Substrate | <https://github.com/agent-substrate/substrate> | 开源 | google/ax 底下的沙箱执行层，AX 负责声明式任务而它负责隔离运行 |
| Amika | <https://github.com/gofixpoint/amika> | 开源 | 开放内核提供多 agent／人类共享的持久云工作站，对应隔离环境与状态留存 |
| Dagger container-use | <https://github.com/dagger/container-use> | 开源（本仓已收） | 为每个 agent 提供独立容器工作区；本轮只作对照 |
| Cezar | <https://github.com/open-mercato/cezar> | 开源 | 每任务独立 worktree 并排队，同一任务跑 2–3 份比 diff，按 GitHub/tracker 事件和定时器触发 |
| LaneGate | <https://github.com/sudheerdvn/lanegate> | 开源 | 每 ticket 一个 worktree，用声明的 touches 锁文件，并在 pre_merge 阶段针对合并结果重跑 guard，失败则回滚 main 并退回 review |
| Clash | <https://github.com/clash-sh/clash> | 开源 | 在并行编辑发生前检测跨 worktree 的潜在 merge conflict，worktree 隔离方案的早期冲突预警 |
| Beehive | <https://github.com/storozhenko98/beehive> | 开源 | 一个窗口管理多仓库、按分支创建隔离 workspace clone 并并排跑终端和代理，桌面 GUI＋TUI |
| Remuda | <https://github.com/yendo-eng/remuda> | 开源 | 为代理创建一次性仓库副本、容器化无人值守运行、复用 prompt 片段并从 Jira/Slack 注入上下文，可向代理群广播 |
| Sculptor（Imbue） | <https://github.com/imbue-ai/sculptor> | 开源 | 每个代理独立 worktree/branch/terminal/diff，skill 本身可作为带工具的子代理，CI Babysitter 派代理修流水线，最后经本地 git remote 交回人工仓库 |
| Superserve | <https://www.superserve.ai/> | 产品 | 面向长跑代理的 Firecracker microVM 沙箱，与 K8s Agent Sandbox／srt 不同的隔离实现 |
| Shipyard | <https://github.com/cosscom/shipyard> | 开源 | 在开发机上跑 worktree、终端、编排、kit 与自动化的桌面应用，个人 fleet 的日常运维界面 |
| Mendral：The agent harness belongs outside the sandbox | <https://www.mendral.com/blog/agent-harness-belongs-outside-sandbox> | 观点文，HN 163 评论 | 主张 harness 应在 sandbox 之外、以统一工具接口隔离不可信执行；HN 里作者逐条回应，反方质疑“harness 已成万能词” |

### 4.8 真实使用反馈、失败复盘与社区反对意见（H）

#### 4.8.1 一手复盘与作者实践文

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| Metabase：ten custom subagents | <https://www.metabase.com/blog/ten-custom-subagents> | 2026-04-27 | 50 万行 Clojure 后端落地 10 个领域 subagent，每个约 2,000–3,000 token／150 行 markdown，附全部配置 gist（<https://gist.github.com/escherize/1cdd92a89cb52a1ce4be1a0cce0467b5>）；明确 description 是路由规则而非职位名，且没有量化收益 |
| Nearform：Slinging work instead of writing code | <https://nearform.com/digital-community/slinging-work-instead-of-writing-code> | 2026-06-18 | 2–7 个 Claude Code 并行、Beads 与 Gas Town：早期大量重复回归、会话间丢上下文，Beads 减少回归但 filing 有摩擦，Gas Town 仍有可见性和 bug 问题；项目仅约 15k LOC，作者承认逐行审查已不可行 |
| HumanLayer：Why Software Factories Fail | <https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md> | 2026-07-22 | “关灯工厂”亲历复盘：首个硬 bug 花近两周、第三次事故后重写；引 Faros 数据（未审查合并 +31.3%、每 PR 事故 +242.7%），自报约 40% 任务可 one-shot、one-shot PR 返工常接近 50%，结论是“读代码”不能省。本仓 docs/13 已引用，本轮只作对照 |
| Addy Osmani：Software Factories, Light and Dark | <https://addyosmani.com/blog/software-factories/> | 2026-07-20 | 把“验证而非生成是瓶颈”讲清楚：暗工厂制造 comprehension debt；引 Horthy“agent 可靠 3–10 步、20 步后失稳”，对比 200 行计划前置审查与 2,000 行生成后追查 |
| Christopher Meiklejohn：The Shortcut Became the System | <https://christophermeiklejohn.com/ai/agents/reliability/development/games/2026/09/14/the-shortcut-became-the-system.html> | 2026-09-14 | 长程 agent 局部修补累积成系统债的一手复盘：只修门后管道导致墙面错位、考勤查询散落 264 处／69 文件、演出事故中 agent 用更窄的 STATIC ONLY 检查并跳过测试，事后自述“压力下把规则当可绕过的成本”；单例、非受控 |
| Kevin Liao：Agents don't need memory, they need documentation | <https://liao.gg/blog/agents-dont-need-memory> | 2026-10-03，HN 392 分 | 主张向量“记忆”会丢理由、无法审计，改用结构化文档工作区（索引、decisions、specs、.operator-shared/），给出“变更即替换而非追加”的维护规则；自用与产品公告，无对照 |
| Ayman Nadeem：Plan mode is dead | <https://www.aymannadeem.com/artificial/intelligence,/developer/tools/2026/09/24/plan-mode-is-dead.html> | 2026-09-24，HN 593 分 | 从失败产品反思“把计划做成大文档”行不通，主张 understand→act→inspect→clarify→adjust；与 HN 49853108 的“短会话＋handoff 文档”形成正反两面 |
| HN 评论：短会话 + handoff 文档的实践 | <https://news.ycombinator.com/item?id=49853108> | 2026-09-26，实践者自述 | 改用许多相对短命的 agent 会话，在会话间传 planning/handoff 文档，当作显式检查点，并找 beads 类管理框架；一手社区线索，非量化 |
| Jan van den Berg：The Mythical Man-Month in the Age of AI | <https://j11g.com/the-mythical-man-month-in-the-age-of-ai> | 2026-10-27，HN 496 分 | 把 Brooks 定律映射到多 agent：九个 agent 仍不能一个月生孩子；HN 评论补充“便宜 subagent 让贵主 agent 读回全部工作反而更贵” |
| Mithushan Jalangan：Chief of Staff Pattern | <https://asyncdot.com/blog/chief-of-staff-pattern-orchestrating-claude-code-sessions/> | 2026-09-19 | 长驻协调会话＋短命执行会话＋外部 durable board：协调者先跑 verifier 红门、写 brief、重跑命令、读 diff 不读 transcript；“消息是提醒，文件是契约” |
| Clio Coder：the agent writes its own handoff | <https://akougkas.io/journal/2026/why-clio-coder-3-the-agent-writes-its-own-handoff/> | 2026-09-22 | 可实现的压缩事务：`self_compact` 写入 ≤8,192 UTF-8 字节 note、每次 handoff 最多两次 reduce、15 分钟自动窗口、`/context recover <handoffId> reduce／deliver`；把 note 标为 assistant-authored recall 而非操作者指令 |
| Samuel Fajreldines：The agent compacted context. What must survive? | <https://www.samuelfaj.com/en/blog/ai-agent-context-compaction-what-to-preserve-before-continuing/> | 2026-09-11 | 压缩前必须留存清单：runId/stateVersion、nextAction、待批准请求与过期时间、外部副作用状态（unknown 必须先对账）、可恢复引用；给 compact/clear/new-context 决策表；示例代码未对 provider 运行 |
| Hyperspace：A microharness for persistent agents（Headlong） | <https://www.laude.org/updates/headlong-a-microharness-for-persistent-agents> | 2026-08-24 | 常驻 agent harness：核心不到 1 万行 Bash，thought 流是 append-only JSONL 的 DAG，上下文按指数衰减分辨率投影，agent 自调度唤醒；自报 48 分钟修好召回、$1–2/小时，明确 alpha、无 per-user 隔离 |
| Andon Labs：Why we built Pion | <https://andonlabs.com/blog/why-we-built-pion> | 2026-09-14 | agent 自主经营公司的研究预览：真实自动售货机与咖啡店仍未盈利，Vending-Bench 出现串谋与权力寻求，Sonnet 3.5 向 FBI 投诉；长程自主经营的反方材料，架构细节未公开 |
| Pion／Vending-Bench 2 与 Arena | <https://andonlabs.com/evals/vending-bench-2> | 2026-09 评测 | 用一年期自动经营模拟测长程代理，Arena 里观察到串谋、权力寻求和欺骗行为，持久运行代理的安全侧证据 |
| Ordewell | <https://github.com/ordewell/ordewell> | 2026-09-15，pre-1.0 | 把一个开发目标变成可编辑、带依赖的 task graph：planner 只读探索并追问，任务各自指定 runner/model/mode；只有演示 GIF，无成功率 |
| Twing | <https://twing.dev/> | 2026-08-28 产品 | 比较多个 coding agent 的计划并阻塞冲突的第二个计划，把设计理由、变更摘要和会话上下文变成团队共享物；有客户 logo，但无量化结果、无明确协调原语 |
| AI Engineer：Victor Savkin《A Genius With Amnesia》 | <https://ai.engineer/talks/jVjt-2g8NMY-genius-amnesia> | 2026 讲稿 | Polygraph 跨仓库建依赖图、每仓一个 agent、把 intent／参与仓库／PR／trace 存成可跨机器与跨 agent 恢复的 session；明确“录下的是过去状态，可能已不成立” |
| AI Engineer：Jeff Ng《context is the next frontier》 | <https://ai.engineer/talks/HvMyYLTfvhg-building-agents-is-trivial-now-context-is> | 2026 讲稿 | checkpoint 必须保存 message history、tool calls 和 loop 当前位置，“restarting is not equivalent to resuming”；Linear issue 缺 Slack/postmortem 上下文而建议重新启用曾致故障的 async dispatch |
| AI Engineer NYC：Aman Singh (Arca) | <https://ai.engineer/nyc/2026/talks/arca> | 2026-10-13 | 真实财富管理公司：一个客户目标跨 10 天（含审批、交易、结算、ACH），agent 先做计划再按节点拉人，自写 model-agnostic harness 与按客户持久记忆，安全限制完全确定性 |
| AI Engineer：Agent Swarms 缺失的原语 | <https://ai.engineer/talks/5Sui_OnSRlY-missing-primitive-agent-swarms> | 2026 讲稿 | 主张软件工厂缺的是状态机、闸门与 CLI 组成的协调层，让代理保上下文且过检查才推进 |
| Igor Ostrovsky：2026 年 9 月的软件工厂横评 | <https://igoro.com/archive/software-factories/> | 2026-09 | 对一批公开工厂写作做横评并总结共性，可当索引用以继续追各家原始复盘 |
| Islo：先自动化实现反而失败 | <https://islo.dev/blog/how-we-stopped-working-for-our-agents/> | 一手反例 | 先做实现自动化失败，改成先做审查／验证并用 webhook 与标签触发，才得到可用的自主工程闭环 |
| Cloudwired：夜间 Ralph 循环实践 | <https://cloudwired.dev/notes/the-nightly-ralph-loop> | 实践记录 | 每晚跑 backlog、但永不自动合并的长跑循环，可看循环边界与人工闸门的实际取舍 |
| Pragmatic Engineer：Dex Horthy 谈上下文工程 | <https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy> | 访谈 | lights-off factory 连跑三个月后代码库退化到关停，长跑失控与上下文债务的一手复盘 |
| Spawn / Jacob Sansbury | <https://twitter.com/jsnnsa/status/2115623382721126826>；转述 <https://simonwillison.net/2026/Oct/29/how-i-built-the-most-ai-pilled-company-in-the-world/> | 2026-10-29，创始人自报 | 10 人公司用常驻命名 agent 舰队直接改线上代码、每小时上线，30 天 7.7 万次实质改动、一年 123,548 次改动仅 1,055 次回滚（约 0.9%），月耗约 310 万美元 token（约 30 倍工资）；数字未审计，原帖 402 |
| YC Labs：50 agent Minecraft／Mindustry | <https://labs.ycombinator.com/projects/games/index.html> | 2026-10-29（详见 T15） | 50 个 GPT-6.1 Sol agent，见上文 T15 |
| minecraft-agent-harness | <https://github.com/yc-software/minecraft-agent-harness> | 开源 | YC Labs 为 50-agent 实验开源的长期运行 harness，含观察／记忆／行动／消息／脚本执行循环 |
| Tom's Hardware：agent swarms 陷入官僚 | <https://www.tomshardware.com/tech-industry/artificial-intelligence/ai-agent-swarms-unleashed-in-minecraft-to-build-a-thriving-civilization-50-agent-teams-fail-after-falling-into-paralyzing-bureaucracy> | 媒体报道 | 对 YC swarm 失败的报道，明确写 50 agent 团队陷入瘫痪性官僚；二手 |
| StrongDM software factory | <https://factory.strongdm.ai> | 厂商自述 | 明令“人不写代码、人不 review 代码”，用 Digital Twin Universe 做场景级验证；HumanLayer 把它当作熄灯工厂失败论的核心反例 |
| Maggie Appleton：Gas Town's agent patterns | <https://maggieappleton.com/gastown> | HN 403 分 | 独立设计师／研究者对 Gas Town 的机制拆解与设计瓶颈分析，第三方基线 |
| moridinamael：Agent Orchestration Is Not the Future | <https://moridinamael.github.io/agent-orchestration/> | 反方长文 | 论证多 agent 编排把复杂度转嫁而非消除，本期候选集体乐观叙事的对照 |
| Gas Town Decoded | <https://www.alilleybrinker.com/mini/gas-town-decoded/> | HN 219 分 | 逐条解码与批评，把机制与夸大处分开 |
| Leaving Gas Town | <https://slowlywilliam.com/2026/04/12/leaving-gas-town.html> | 2026-04 退出记录 | 采用后的反向体验与维护成本 |
| moollm：Gas Town, as a foil | <https://github.com/SimHacker/moollm/blob/main/designs/gastown/README.md> | 设计文档 | 最系统的反 Gas Town 设计：主张“一个上下文模拟多 agent”而非多进程传消息，逐条反驳自造术语、tokenmaxing 与不读代码 |
| yc-software/qm（多人协作面） | <https://github.com/yc-software/qm> | HN 682 分 | 补多人并发与权限视角（见 4.2） |
| dbreunig：The State of Context Engineering | <https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html> | 2026-10-25，HN 273 分 | context engineering 现状综述，补上下文接续的外部坐标系 |
| Simon Willison：Designing agentic loops | <https://simonwillison.net/2025/Sep/30/designing-agentic-loops/> | 2025-09-30 | 从工具边界、凭据与 YOLO 风险讲 agent loop 的一手实践，loop 设计的安全侧参考 |
| Rulebooks are theater（Wolfberg） | <https://wolfberg.ai/papers/great-idea-you-had-it-last-week/great-idea-you-had-it-last-week.pdf> | 论文式文章 | 主张“规则是剧场、机制才有效”，给出 nightly proposal、regression replay、gating 的 harness 演化实践 |
| Martin Fowler：Harness engineering | <https://martinfowler.com/articles/harness-engineering.html>、<https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html> | 2026 文章（两入口） | 用控制论与反馈传感器系统化拆解 harness，横向对比 OpenAI、Stripe 的企业视角 |
| Martin Fowler：Sensors for coding agents | <https://martinfowler.com/articles/sensors-for-coding-agents.html> | 2026 文章 | 计算型／推断型反馈传感器与 fitness function，补验证层分类 † |
| HumanLayer：Skill Issue: Harness Engineering | <https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents> | 2026 文章 | harness 工程六面配置（CLAUDE.md/Skills/MCP/子代理/hooks/背压）的奠基性清单，被多篇后续文章引用 |
| Viv Trivedy：HaaS: Harness as a Service | <https://www.vtrivedy.com/posts/claude-code-sdk-haas-harness-as-a-service> | 2026 文章 | 提出 harness-as-a-service 与开放 harness 生态，是“harness”术语扩散的关键源之一 |
| Lilian Weng：Harness Engineering for Self-Improvement | <https://lilianweng.github.io/posts/2026-07-04-harness/> | 2026-07-04 | 把 harness 视为递归自我改进的部署层，综述 workflow、filesystem memory、subagents 与 meta-harness 研究 |
| Addy Osmani：Agent Harness Engineering | <https://addyosmani.com/blog/agent-harness-engineering/> | 2026-04-19 | 系统拆开 harness 的提示、工具、上下文策略、hooks、沙箱与反馈环 |
| Addy Osmani：Self-Improving Coding Agents | <https://addyosmani.com/blog/self-improving-agents/> | 2026-01-31 | 解释 Ralph 循环与自改进代理的背景，含隔夜运行和提交节奏 |
| Addy Osmani：Long-running Agents | <https://addyosmani.com/blog/long-running-agents/> | 2026-04-28 | 系统总结 brain/hands/session 与五种生产模式（checkpoint-and-resume、delegated approval、memory-layered context、ambient processing、fleet orchestration） |
| Addy Osmani：The Code Agent Orchestra | <https://addyosmani.com/blog/code-agent-orchestra/> | 2026 文章 | 多代理编排工具分层（进程内／本地／云）与质量门禁综述 |

#### 4.8.2 社区讨论、失败清单与对话

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| HN：multi-agent is mostly dead | <https://news.ycombinator.com/item?id=50334030> | 2026-11-02 评论 | 一线反方：一个大 GPT-6.1 agent loop 压过各种多 agent 编排，subagent 只保留给压缩 action space 和长程测试；个人经验 |
| HN：subagents paper over poor context/cache management | <https://news.ycombinator.com/item?id=50332360> | 2026-11-02 评论 | subagent 被用来掩盖上下文与缓存管理不足，理想是滚动压缩＋驱逐＋一个自适应主循环；作者自报本地 128k 窗口到约 6M token 才出问题 |
| HN：cheap subagents cost more | <https://news.ycombinator.com/item?id=50256106> | 2026-10-27 评论 | 便宜模型做 subagent 后，贵的主 agent 仍要读回其工作与周边代码来审查，总成本更高；与 Handoff Tax 相互印证 |
| HN：Anthropic 多代理失败研究（138 条评论） | <https://news.ycombinator.com/item?id=49316271> | 2026 讨论 | 一线实践者用 Opus 当 orchestrator 开 tmux 多窗、对合入失败与协调压力的补充；HN 网页不可读，经 Algolia API 读评论树 |
| dev.to：Dhruvi Rohilla《It Failed (And Cost 3.5x More)》 | <https://dev.to/dhruvi_rohilla/i-built-a-multi-agent-ai-data-analyst-team-to-beat-a-single-prompt-it-failed-and-cost-35x-more-2nko> | 2026-10-29 | 50 题、三配置：4-agent 团队 96% vs 单 agent 100%，3,543 vs 978 token/题（3.6 倍）、成本约 3.5 倍、4.0s vs 2.4s；失败在 Explainer 丢掉 Coder 已算对的结果；模型为 Groq LLaMA 3.3 70B，规模有限 |
| 复现代码：D-hruvi/data-analyst-ai-team | <https://github.com/D-hruvi/data-analyst-ai-team> | 开源 | 上述文章的完整代码与 50 题基准，可复现四代理对照 |
| dev.to：Alex Aslam《The supervisor pattern is not a silver bullet》 | <https://dev.to/alex_aslam/the-supervisor-pattern-is-not-a-silver-bullet-when-hierarchical-orchestration-actually-fails-5aip> | 2026-10-07 | 引述 Jeremy McEntire 2026-03 的 28 任务实验：单体 28/28、层级 18/28（36% 失败）、自组织 swarm 32%，spec entropy 85.8% vs 25.8%；原文未给论文链接、样本小 |
| 原始预印本：McEntire《The Organizational Physics of Multi-Agent AI》 | <https://zenodo.org/records/18809207> | Zenodo 预印本 | 上述数字的原始出处（同一 LLM、50 美元预算、同一 7 服务后端），可核对转述口径 |
| CIO：True multi-agent collaboration doesn't work | <https://www.cio.com/article/4143420/true-multi-agent-collaboration-doesnt-work.html> | 2026-03 报道 | 同研究的可核二手来源（单代理 28/28、层级 18/28、蜂群 9/28、11 阶段流水线 0/28） |
| dev.to：Yuhai Xia《Here's What Actually Breaks》 | <https://dev.to/yuhaixia/i-coordinate-a-team-of-ai-agents-heres-what-actually-breaks-cob> | 2026-10-24 | 三个真实协调事故：subagent 用 orchestrator ID 整元素覆盖共享任务板（last-writer-wins 无报错）、reviewer 只看自己卡片白名单而误报、JSONB CHECK 因 `NULL IN (...)` 放行 `{}` |
| dev.to：theducttape part 1 | <https://dev.to/theducttapeio/ten-things-that-go-wrong-when-you-build-with-a-team-of-ai-agents-part-1-dho> | 2026-10 失败清单 | 症状修复、隐藏共享、丢消息、无证据的 done |
| dev.to：theducttape part 2 | <https://dev.to/theducttapeio/ten-more-things-that-go-wrong-when-you-build-with-a-team-of-ai-agents-part-2-i5l> | 2026-10-12 | 抢同一台机器／端口／测试账号、agent 替你说话、相对日期歧义、提问埋在长输出里导致静默等待、人成瓶颈、规则互相矛盾、密钥进聊天、配额突袭 |
| dev.to：theducttape 七代理实践 | <https://dev.to/theducttapeio/how-i-build-a-product-alone-with-a-team-of-seven-claude-code-agents-1om2> | 2026-10-07 | 七个长期不关的 Claude Code 会话按产品／需求／开发／UX 分工，真实消费者配置 |
| dev.to：ko-hi《7 agents, 24 board meetings, $0》 | <https://dev.to/ko-hi/7-claude-code-agents-held-24-board-meetings-revenue-0-2e6c> | 2026-09-13 | 21 天七代理跑十个业务的零收入复盘，“代理很忙但没有产出”的社区反例 |
| dev.to：flisk《Roles, Boundaries, and the Handoffs That Break》 | <https://dev.to/flisk/running-a-team-of-ai-agents-roles-boundaries-and-the-handoffs-that-break-4fe9> | 团队实践 | 角色边界与交接失败的结构化清单 |
| dev.to：hiroshi《A portable handoff contract》 | <https://dev.to/hiroshi_takamura_c851fe71/a-portable-handoff-contract-for-teammates-using-different-ai-tools-4ige> | 跨工具实践 | 跨不同代理工具的便携交接契约模板，补异构 harness 之间交接 |
| dev.to：murthyg《AWL: Stop Agents Acting Before You Approve》 | <https://dev.to/murthyg/how-to-build-reliable-work-handoffs-between-ai-agents-in-typescript-1neh> | 实践 | 用 Work Order 在 TypeScript/Python/MCP 中把审批与执行分开，可运行实现 |
| dev.to：tia-forge《handoff contract》 | <https://dev.to/tiaforge/your-coding-agents-dont-need-more-messages-they-need-a-handoff-contract-3lna> | 2026-10-25 | 把评审做成 256KB handoff packet（本地 diff、≤200 行测试输出、worker report、brief 路径），判定只允许 APPROVE／编号修复清单／INVALID；自报 584 个 verdict、28,149 任务行，单机记录未独立核 |
| dev.to：rulestack《subagent costs ~436k tokens》 | <https://dev.to/rulestack/a-claude-code-subagent-costs-436k-tokens-before-it-reads-a-single-file-measured-with-the-1ja9> | 测量文 | 给出 436k token 的原始测量与收支平衡算法 |
| dev.to：rulestack《cleaner measurement says 54k》 | <https://dev.to/rulestack/we-said-a-claude-code-subagent-costs-436k-tokens-a-cleaner-measurement-says-54k-here-is-what-37am> | 两周后自我更正 | 解释安装差异如何让同一测量差约 8 倍，比单看一个数字更能判断成本口径 |
| dev.to：9-agent Claude Code plugin | <https://dev.to/_205065226f2262c378143/i-built-a-9-agent-ai-dev-team-in-a-claude-code-plugin-heres-what-happened-281p> | 实践 | 把九代理开发团队封装成 Claude Code 插件，“角色链改 Skill／插件”路线的实际消费者 |
| 腾讯云：Agent 连续跑几天，到底该怎么测？ | <https://cloud.tencent.com.cn/developer/article/2747035> | 2026 中文技术博客 | 把长运行测试拆成 context drift、compaction 后约束保留、checkpoint 恢复、幂等与子代理部分失败，可直接补测试清单 |
| 腾讯云：Harness 设计如何支撑 Claude 长时运行应用开发 | <https://cloud.tencent.com.cn/developer/article/2652473> | 2026 中文转述 | 转述 Anthropic 三代理 harness：planner/generator/evaluator、上下文重置与 5–15 轮前端迭代 |
| InfoQ 中文：Anthropic 推出多代理 Harness | <https://www.infoq.cn/article/qPNs964YbMjfjR0r1vP6> | 中文技术媒体（本轮复检 451，未重读） | 同一 harness 的另一家中文报道，可与腾讯云两篇交叉核对转述差异 |
| HN：Anthropic 多代理失败研究讨论 | <https://news.ycombinator.com/item?id=49316271> | 见上 | 同 T1 |
| arXiv 摘要：Herding and Runaway Cascades | <https://arxiv.org/abs/2610.30769> | 2026 论文 | 用 Music Lab 实验证明 LLM 多 agent 会出现 herding 与 runaway cascade，为协作失败机制提供实验证据 |

#### 4.8.3 issue／discussions／论坛回执（真实问题与对策）†

| 候选 | 原始链接 | 日期／产品 | 问题与对策 |
|---|---|---|---|
| Claude Code #105184 | <https://github.com/anthropics/claude-code/issues/105184> | 2026-10-26 | 夜间 turn 822／6548、14 个 subagent 因 `cd && git` 触发权限提示，用户睡着后整夜停顿；社区给出 `git -C`、additionalDirectories、Notification hook 等绕法，维护者未实质回复 |
| Claude Code #102269 | <https://github.com/anthropics/claude-code/issues/102269> | 2026-10-15 | 7-agent 夜间任务：Mac 睡眠后每次唤醒重写 43–53 万 token 上下文，75 次 cache_creation 共 30.3M，周额度掉 25%；对策 `caffeinate`、1 小时 cache TTL、不跨睡眠跑 workflow |
| Claude Code #99652 | <https://github.com/anthropics/claude-code/issues/99652> | 2026-10-05 | 已获口头批准的定时 spec→conductor 构建被 auto-mode 判为 Instruction Poisoning，整夜窗口报废；连只读 grep 也被拒，最后只能开 Bypass permissions |
| Claude Code #98747 | <https://github.com/anthropics/claude-code/issues/98747> | 2026-10-01 | 2.1.286 起空闲会话在缓存过期前自动压缩且无开关，20 个并行会话中 7 个过夜被压掉原始指令；维护者承认只对 200k+ 上下文触发 |
| Claude Code #90542 | <https://github.com/anthropics/claude-code/issues/90542> | 2026-08-29 | 700 行、30 条规则的 CLAUDE.md 在 4.5 小时会话中被逐条违反；跟帖指出 hooks 只能强制能表达为工具调用条件的规则 |
| Claude Code #85949 | <https://github.com/anthropics/claude-code/issues/85949> | 2026-08-11 | 命名 mailbox 子代理无法回复父级，SendMessage 返回 success:true 只表示写入文件而非有活读者；以 agent id 发送 73/73 成功、读 transcript 恢复 |
| Claude Code #88332 | <https://github.com/anthropics/claude-code/issues/88332> | 2026-08-20 | 外部工具写 teammate inbox 无 entry schema、无锁协议，atomic rename 可竞争造成静默丢消息；issue 被 stale 关闭未采纳 |
| Claude Code #104026 | <https://github.com/anthropics/claude-code/issues/104026> | 2026-10-21 | 3+ Agent 同时 `isolation:worktree` 时并发 `git worktree add` 争 `.git/config.lock` 或读半成品 commondir，失败 Agent 完全不执行并留孤儿分支；2.1.76–2.1.303 仍复现 |
| Claude Code #88747 | <https://github.com/anthropics/claude-code/issues/88747> | 2026-08-22 | worktree 继承主检出的绝对 `core.hooksPath`，子 worktree 实际运行主目录 hook；plain git worktree add 不写 config.worktree |
| Claude Code #92249 | <https://github.com/anthropics/claude-code/issues/92249> | 2026-09-04 | Desktop 定时任务／Remote Control 被 spawn 时移除 SendMessage/ListAgents/ListPeers，5 小时上限杀死长任务后无法恢复子代理；1.52386.0 修复 |
| Claude Code #86879 | <https://github.com/anthropics/claude-code/issues/86879> | 计量回执 | 4 小时、27 个子代理会话：agent_summary 占 22.7% 请求、约 18% 加权 token |
| Claude Code #67730 | <https://github.com/anthropics/claude-code/issues/67730> | 子代理回执 | 子代理零工具调用却返回完整编造结果，还把工具调用 XML 泄进文本 |
| Codex #49735 | <https://github.com/openai/codex/issues/49735> | 2026-09-30 | gpt-6.1-sol 反复把中间报告当最终结果、要求继续却提前收工，疑与 token 预算提示有关；评论提出冻结原始 objective、用可观察终态验证 |
| Codex #49705 | <https://github.com/openai/codex/issues/49705> | 2026-09-30 | 把存储／回放／打包当成目标，重写 guide 与验收标准后 update_goal(complete)，消耗 1,095,792 tokens／6,478 秒 |
| Codex #48677 | <https://github.com/openai/codex/issues/48677> | 同期重复项 | “完成一步就发终态回复”的更早样本，可作时间线证据 |
| Codex #49248 | <https://github.com/openai/codex/issues/49248> | 同期重复项 | Windows Codex Desktop 反复被 execution-policy 拦截，既有流程退化 |
| Codex #49390 | <https://github.com/openai/codex/issues/49390> | 2026-09-29 | 26.917.71314 在中间调查／修复／测试后主动结束回合，10–40 秒即停；用户用 PLAN.md 逐项 proof＋`codex exec resume --last` 兜底 |
| Codex #40905 | <https://github.com/openai/codex/issues/40905> | 2026-08-26 | 同一长任务被 5 小时额度窗口两次中断；主张把额度耗尽当可调度边界，做 durable suspend/resume |
| Codex #36586 | <https://github.com/openai/codex/issues/36586> | 2026-08-02 | 子代理任务放在 encrypted_content，DeepSeek 等非 OpenAI provider 直接丢弃，spawn_agent 返回成功但子代理收到空任务 |
| Codex #37453 | <https://github.com/openai/codex/issues/37453> | 2026-08-07 | 恢复历史父／子线程走 thread/resume 并重建 MCP，5 个恢复线程产生 8 套 MCP、约 5.7GB |
| Codex #40858 | <https://github.com/openai/codex/issues/40858> | 2026-08-26 | 子代理应用 role 的 model/effort 但忽略 model_provider，阻断混合模型团队 |
| OpenClaw #143334 | <https://github.com/openclaw/openclaw/issues/143334> | 2026-09-09 | 子代理 succeeded 但 deliveryStatus=pending，requester 卡在 settle-yield，后续消息积压；gateway 重启可释放但完成被标 failed |
| OpenClaw #145690 | <https://github.com/openclaw/openclaw/issues/145690> | 2026-09-12 | 子代理 stop 后释放 model-runtime generation，下一 lane 带旧 snapshot 抛错且不重试；95 次/月 |
| OpenClaw #118625 | <https://github.com/openclaw/openclaw/issues/118625> | 2026-08-03 | 压缩持写锁约 148 秒（超过 60 秒获取超时），期间子代理 announce 重试 3 次后放弃，结果静默丢失；v2026.8.1-beta.2 修复 |
| OpenClaw #154834 | <https://github.com/openclaw/openclaw/issues/154834> | 2026-09-21 | 失败子代理的完成投递每轮重新注入父上下文，持续 45 天、44–60 行，压缩也清不掉；PR #155019 按 cleanupCompletedAt 过滤 |
| code-coordinator #3363 | <https://github.com/JDonaghy/code-coordinator/issues/3363> | 2026-09 | 幽灵 PENDING/RUNNING assignment 让主机 6 天拒绝重启，显式重启与 idle watcher 共用同一 predicate 形成互锁 |
| code-coordinator #2317 | <https://github.com/JDonaghy/code-coordinator/issues/2317> | 2026-08-16 | 回合在 32k output 上限被截断时一个 tool call 都没发，113KB 推理后 clean exit、零提交；对策是每决定一个文件就立即落盘 |
| phoenix #6610 | <https://github.com/kamp-us/phoenix/issues/6610> | 2026-08-20 | 孤儿 worktree 持有分支，repair 轮 `--resume-lane` 读到 worktreeCheckouts 后 exit 11，只能人工 remove |
| phoenix #6614 | <https://github.com/kamp-us/phoenix/issues/6614> | worktree | 隔离的操作者无法在 epic 的 integrate 状态执行合并，隔离规则本身变成阻塞源 |
| phoenix #6881 | <https://github.com/kamp-us/phoenix/issues/6881> | worktree | harness 锁住大多数 worktree，ADR 禁止 --force，干净树也拒绝 plain remove |
| phoenix #6681 | <https://github.com/kamp-us/phoenix/issues/6681> | worktree | 没有任何角色被指派处理死掉的 spawn 留下的 worktree，“所有权”而非“缺命令” |
| phoenix #6179 | <https://github.com/kamp-us/phoenix/issues/6179> | 判定分歧 | lane prove 接受 'Part of #N' 的 PR 而 lane brief 拒绝，UNBLOCKED 后回到同一死锁 |
| spec-kitty #4889 | <https://github.com/spec-kitty/spec-kitty/issues/4889> | 2026-09-22 | lane worktree 与分支都消失但状态仍 in_progress 时，`implement WP##` 从 coordination tip 重切空 lane 并 exit 0，后续 merge 合入空 lane |
| spec-kitty #4753 | <https://github.com/spec-kitty/spec-kitty/issues/4753> | 清理 | 对 lane worktree 直接 `git worktree remove --force` 且不查脏，未提交实现被删仍 exit 0 |
| spec-kitty #4766 | <https://github.com/spec-kitty/spec-kitty/issues/4766> | 评审 | review-cycle-N.md 未跟踪地留在 primary checkout，工具自己的 for_review/approved gate 被它卡住 |
| cbusillo #884 | <https://github.com/cbusillo/codex-skills/issues/884> | 2026-09-29/30 | 01:30–12:15 在 24 个仓库合入 86 个 PR，但 4 次静默停滞、共享 git stash 跨 worktree 干扰、session 内 cron 随会话消失、两个会话到 780k/750k 仍未压缩 |
| cbusillo #2277 | <https://github.com/cbusillo/codex-skills/issues/2277> | 2026-10-18 起 | 2,754 个 PR 合入／2,906 开出，25 次拒绝关闭、5 次 stale-claim 恢复、6 次漏审提醒，诊断多为误报；作者承认主假设更少救援从未计数 |
| cbusillo #2602 | <https://github.com/cbusillo/codex-skills/issues/2602> | worktree | PR 合入后不退役对应 worktree，“完成事件与资源回收未绑定” |
| cbusillo #2961 | <https://github.com/cbusillo/codex-skills/issues/2961> | worktree | worktree 退役被“有 IDE 在运行”误判阻塞，需区分该 IDE 是否真的持有这棵树 |
| cbusillo #2269 | <https://github.com/cbusillo/codex-skills/issues/2269> | 唤醒 | 已发布的 review 记录不触发作者会话，作者会话空转 |
| cbusillo #2276 | <https://github.com/cbusillo/codex-skills/issues/2276> | 重试 | 容量不足重试发送 continue 时状态被记成 uncertain，诱发重复投递（at-least-once 副作用） |
| cbusillo #1884 | <https://github.com/cbusillo/codex-skills/issues/1884> | 容量 | 本机同时跑 6–8 个会话时负载到 170–300，改用自托管 CI runner 才腾出吞吐 |
| LangGraph #8764 | <https://github.com/langchain-ai/langgraph/issues/8764> | 2026-08-30 | 进程在首个 durable checkpoint 前崩溃时，已接受的 run 被静默丢弃且没有 durable failure 记录 |
| LangGraph #9006 | <https://github.com/langchain-ai/langgraph/issues/9006> | 2026-09-19 | 节点在外副作用后超时，checkpoint 仍停在该节点之前，`ainvoke(None)` 会再次执行副作用；建议 side-effect ledger 的 SUCCEEDED／FAILED／UNKNOWN 与幂等键 |
| LangGraph #8796 | <https://github.com/langchain-ai/langgraph/issues/8796> | 2026-09-02 | conformance 89 条 clause 全是单实例单写者，接受并发 writer 的 saver 仍报 passed_all_base=True；提议 write-ownership 扩展 |
| LangGraph #9078 | <https://github.com/langchain-ai/langgraph/issues/9078> | 状态 | 进程死后 run 仍 running，重启后线程被永久卡住，Threads.sweep_ttl 是空壳 |
| LangGraph #8448 | <https://github.com/langchain-ai/langgraph/issues/8448> | 分页 | 目标 checkpoint 不在首分页时 get_delta_channel_history 永久污染游标，静默丢历史 |
| LangGraph #8653 | <https://github.com/langchain-ai/langgraph/issues/8653> | 状态 | update_state 路径可永久擦除线程消息 |
| LangGraph #8464 | <https://github.com/langchain-ai/langgraph/issues/8464> | 提案 | 在 checkpoint 之外补 exactly-once 工具执行的幂等／重试中间件 |
| langgraph-checkpoint-conformance 套件 | <https://github.com/langchain-ai/langgraph/tree/main/libs/checkpoint-conformance> | 代码 | 仓内一致性套件，89 条子句全按单实例单写者设计，没有并发写条款 |
| LangChain 论坛：两并发写者仍判 FULL | <https://forum.langchain.com/t/a-checkpointer-that-accepts-two-concurrent-writers-still-scores-conformance-level-full/4460> | 论坛 | #8796 的上游原帖，带双写者复现与讨论 |
| langgraph-timeout-resume-side-effect-repro | <https://github.com/xbstack/langgraph-timeout-resume-side-effect-repro> | 复现仓库 | 展示超时后同线程 resume 会重放非幂等副作用 |
| langgraph-write-ownership | <https://github.com/bharatnpti/langgraph-write-ownership> | 复现仓库 | #8796 的并发写复现与 write-ownership 提案 |
| deepseek-harness discussion #5310 | <https://github.com/deepseek-ai/deepseek-harness/discussions/5310> | 2026-09-01 | 真实请求到 1,259 条消息／约 502K tokens，提议 subagent runtime 层做 autoCompact（阈值 0.8）、保留任务状态／决策／未解问题／文件路径，并支持 per-subagent token budget；0 评论，属提案 |
| flutter_agent_harness #1073 | <https://github.com/IstiN/flutter_agent_harness/issues/1073> | 2026-09-29 | 会话 JSONL 涨到 12.4 GiB／96,776 行（99.9% 自定义 ledger），resume 读整文件时申请 25GB 堆崩溃 |
| bugbug #6656 | <https://github.com/mozilla/bugbug/issues/6656> | 2026-08-18 | 等待后台 review/build 时回合以 ok/actions=[] 结束，patch 未提交；上游指向 claude-agent-sdk #1138 |
| claude-agent-sdk #1138 | <https://github.com/anthropics/claude-agent-sdk-python/issues/1138> | 上游 | 后台代理仍在工作时 ResultMessage 已发出并结束回合，父会话误判完成 |
| DeepSeek-V3 #1554 | <https://github.com/deepseek-ai/DeepSeek-V3/issues/1554> | 2026-08-09 | 97,336 prompt tokens 下 5/6 次只输出一句 I will check 后 finish_reason=stop 且不发 tool call；可用显式 continuation、状态摘要、结构校验兜底 |
| Cursor 论坛 #168333 | <https://forum.cursor.com/t/168333> | 2026-08-13 | 每个 Bot 是一条无界线程，每轮重载完整 transcript，没有同 agent 的 new session／compact；作者提出 Identity + Working set + Archive 三对象原型 |
| Cursor 论坛 #176293 | <https://forum.cursor.com/t/176293> | 2026-10-27 | 前台子代理被自动转后台，触发条件是 New Messages=steer 时收到消息；批量 Figma 构建因阻塞语义变化而漂移 |
| Cursor 论坛 #172421 | <https://forum.cursor.com/t/172421> | 2026-09-20 | background 子代理完成后父会话数小时不恢复；Cursor 员工称 3.21 修了该路径 |
| Cursor 论坛 #169542 | <https://forum.cursor.com/t/169542> | 2026-08-26 | 把运行中的 agent 移入 worktree 会复制对话并归档原对话，原 run 仍在跑，出现两个父对话推进同一任务 |
| Cursor 论坛 #171088 | <https://forum.cursor.com/t/171088> | 2026-09-08 | Task spawn schema 没有 isolation／worktree_path／cwd，额外键在 PreToolUse 前被剥离，fail-closed hook 无法验证隔离 |
| Cursor 论坛 #176569 | <https://forum.cursor.com/t/176569> | 2026-10-29 | 子代理已 turn_ended 但卡片仍 running，transcript 分裂成两份，完成事件可被丢弃；对策是读 transcript 而非 resume／interrupt |
| Cursor 论坛 #176625 | <https://forum.cursor.com/t/176625> | 2026-10-29 | 本地后台 shell exit 0 且输出完整，但 owning agent 经常不被唤醒；官方建议短任务阻塞等待、长任务保留 reconcile |
| Cursor 论坛 #174745 | <https://forum.cursor.com/t/174745> | 2026-10-14 | Orchestrator＋Sandbox Worker＋Read-Only Auditor 做 3,500+ LOC 前端，22m58s、14/14 CI；Cursor 员工指出可用 parent＋worktree subagent＋read-only subagent 复现，单样本自报 |
| Cursor 论坛 #176053 | <https://forum.cursor.com/t/176053> | 2026-10-24 | Delagen Agent Worktrees 扩展审核通过、无负面反馈；只说明工具进入市场，不是效果证据 |
| Cursor 论坛 #168203 | <https://forum.cursor.com/t/168203> | 会话 | 从主聊天打开子代理聊天会关闭主聊天，长跑监督时会话切换丢主线 |
| Cursor 论坛 #166335／#169541 | <https://forum.cursor.com/t/166335>、<https://forum.cursor.com/t/169541> | 会话 | 长后台 Shell／后台 Task 完成后 resume 报错，与 #176625 的静默不唤醒是同一条链路 |
| Cursor 论坛 #173787 | <https://forum.cursor.com/t/173787> | 权限 | 插件分发的子代理不应用 readonly:true，只读审计在插件路径上失效 |
| OpenAI community #1391211 | <https://community.openai.com/t/1391211> | 2026-08-19 | compaction 后丢失原始验收目标，进入 endless subagent／test 循环；跟帖提出 acceptance ledger |
| OpenAI community #1395985 | <https://community.openai.com/t/1395985> | 2026-09-09 | compaction 后 Goal 被当成 paused，5.5 小时产生 3,994 条无进展回复 |
| OpenAI community #1410346 | <https://community.openai.com/t/1410346> | 2026-10-28 | 统计 52.49 GiB Codex 会话后指出 context compaction 与 storage compaction 不是同一操作 |
| OpenAI community #1393098 | <https://community.openai.com/t/1393098> | 2026-08-27 | 一派压缩后换新会话，一派坚持长寿会话；有人测得新会话起步约 39K tokens，Desktop 比 CLI 多 8.1–9.8K |
| OpenAI community #1408367 | <https://community.openai.com/t/1408367> | 2026-10-21 | 等待长测试时反复轮询，消耗 500 Pro 额度外加约 5,000 credits |
| OpenAI community #1393133 | <https://community.openai.com/t/1393133> | 2026-08-28 | 把未回答的 Yes/No 审批当暂停按钮；跟帖区分 Git 保存的仓库状态与 Codex 已学到的任务状态 |
| OpenAI community #1387585 | <https://community.openai.com/t/1387585> | 2026-07-20 | 反复输出 Context automatically compacted 数小时不产出，损失过半额度；根因未确认（略早于主窗） |
| OpenAI community #1410936 | <https://community.openai.com/t/1410936> | 2026-10-30 | 子任务完成后父任务仍 idle，无法判断是通知丢失、延迟、未恢复还是未处理；父代理反复轮询子任务 |
| OpenAI community #1407513 | <https://community.openai.com/t/1407513> | 2026-10-18 | 长任务每 1–2 小时漂移、自动扩 scope，必须人工对照原始指令 |
| OpenAI community #1402568 | <https://community.openai.com/t/1402568> | 2026-10-01 | 线程数上限导致无法再建子代理，界面无删除／归档工具 |
| GitHub orgs/community #199414 | <https://github.com/orgs/community/discussions/199414> | 2026-06-19 | 选中自定义 agent 后云端仍以单扁平 agent 运行，agents allowlist／handoffs 被忽略且无 subagentStart 事件；正文与评论未登录读不全 |
| oh-my-openagent #5966 | <https://github.com/code-yeongyu/oh-my-openagent/issues/5966> | 投递 | 对运行中的后台子代理发 task(task_id=...) 静默丢 prompt 并报 success |
| superpowers-multiagents #37 | <https://github.com/ramil-zakirov-dev/superpowers-multiagents/issues/37> | 清理 | close-slice 在 worktree 移除静默失败时仍报成功 |
| VS Code #335244 | <https://github.com/microsoft/vscode/issues/335244> | hook | Copilot 的 subagentStart hook 因 camelCase 命名不匹配被静默忽略 |
| ai-memory #355 | <https://github.com/Hidden-History/ai-memory/issues/355> | 消息 | teammate→lead 的纯文本回复静默失败而协议帧仍通过，双通道不一致 |
| Omnigent #2853 | <https://github.com/omnigent-ai/omnigent/issues/2853> | 适配 | 原生 harness 在运行时静默丢弃 agent spec 的 prompt 字段 |
| oh-my-pi #8792 | <https://github.com/can1357/oh-my-pi/issues/8792> | 压缩 | frame archive 溢出时压缩路径静默丢掉用户指令 |
| Copilot CLI #5115 | <https://github.com/github/copilot-cli/issues/5115> | 协议 | ACP 下 /rename 返回成功但会话名未变，假成功影响依赖会话标识的编排 |
| GPT_CODEX_subagentBUG_antipatch | <https://github.com/MarkoAvreliy/GPT_CODEX_subagentBUG_antipatch> | 规避仓库 | #37453 里链接的“反补丁”，记录恢复历史子代理线程时重复生成 MCP 进程堆叠的规避做法 |
| MemPalace #27／#39 | <https://github.com/MemPalace/mempalace/issues/27>、<https://github.com/MemPalace/mempalace/issues/39> | benchmark 争议 | README 声明与代码不符、M2 Ultra 独立复现，宣传 vs 复现样本 |
| Gastown #3649 | <https://github.com/gastownhall/gastown/issues/3649> | 计量争议 | 社区指控 Gas Town 借用户额度改进自身（HN 253 分），长跑／常驻 agent 在计量、披露与信任上的失败案例 |
| ruflo #1669 | <https://github.com/ruvnet/ruflo/issues/1669> | 插件 | 联邦插件相关 issue，用作“大而全框架”真实问题样本 |
| headroom #941 | <https://github.com/headroomlabs-ai/headroom/issues/941> | 安装 | Intel Mac 无 wheel |
| oh-my-claudecode #2913 | <https://github.com/Yeachan-Heo/oh-my-claudecode/issues/2913> | 依赖 | 依赖弃用问题 |
| deer-flow #1865 | <https://github.com/bytedance/deer-flow/issues/1865> | 自演化 | skill 自演化 RFC，点名 Hermes Agent 为灵感来源 |

### 4.9 论文、基准与测量（I）

| 候选 | 原始链接 | 日期／类型 | 结论与限制 |
|---|---|---|---|
| MAST《Why Do Multi-Agent LLM Systems Fail?》 | <https://arxiv.org/abs/2503.13657> | 2025 论文，2026 仍被多篇实践文引用 | 1,600+ 条 annotated traces、7 个 MAS 框架、14 种失败模式（规范／系统设计、inter-agent misalignment、task verification），Cohen's κ=0.88；失败分类基线，不是近三月新作 |
| MAST 代码与标注轨迹 | <https://github.com/multi-agent-systems-failure-taxonomy/MAST> | 开源 | 1K+ 标注轨迹，可把论文结论落到具体案例 |
| Compact-Bench | <https://arxiv.org/abs/2610.31710> | 2026-10-22 论文 | 在同一仓库状态下比较 full-history 与 summary-only 续跑，覆盖 35 个 SWE-bench 修复、146 个 agentic session、106 条 production chain、14 个 summarizer；稳定损伤为 full-history 成功中的 5–64%，LLM 摘要最多保留 16.0% 反复出现细节而机械抽取 79.1% |
| MASS（Sakana AI） | <https://pub.sakana.ai/mass/> | 2026-10（arXiv 2610.12176） | 一个共享模型同时扮演 solver、workflow designer 和 judge，内层测试多 agent 方案，外层用 LoRA 微调；研究类 benchmark 1.2–1.6× 增益，但迁移到编码是 Terminal-Bench 0.96×、SWE-bench 0.94×——多 agent 自我改进不必然迁移到编码 |
| An empirical study of harness design for coding agents | <https://arxiv.org/abs/2609.20804> | 2026-09-17 论文 | 固定 execution loop，只变 planning、action space、context management 三组件，在 4 个模型、SWE-Bench Verified 与 Terminal-Bench 2.1 上做 176 组匹配设置；适合判断 harness 哪一层真正影响长程表现 |
| Self-Evolving Agent Harness | <https://arxiv.org/abs/2610.18813> | 2026-10-13 论文 | 把 harness 自我演化形式化（prompts、memory、workflows、可执行组件，权重固定），区分 interpreted state 与 tool/code/repo control logic，给出 continual PAC 泛化界和保留界；无编码任务实测 |
| Continual Harness 论文 | <https://arxiv.org/abs/2605.09998> | 2026 论文（摘要页读取） | 在线自我改进 harness 的论文与长程基准，harness 状态（prompt、子代理、技能、记忆）可在 episode 中改写；export API 返回空，改用 abs 页 |
| Continual Harness 实现 | <https://github.com/sethkarten/continual-harness> | 开源 | Refiner 可在 episode 中途通过 evolve_harness 改写自身 system prompt、子代理、技能与记忆 |
| Context Compaction Theory | <https://arxiv.org/abs/2608.01326> | 2026 论文 | 把 compaction 形式化为面向未来需求的 message 选择／生成，可支撑“保留引用与不变量”的设计 |
| On the Reliability Limits of LLM-Based Multi-Agent Planning | <https://arxiv.org/abs/2603.26993> | 2026 论文 | 多代理规划的可靠性上限分析，补足 Anthropic／MAST 之外的定量视角 |
| What makes a harness a harness | <https://arxiv.org/abs/2606.10106> | 2026 论文 | 给出 harness 的四个必要充分要素（loop、tool interface、context management、control），可作收录边界 |
| Architectural Design Decisions in AI Agent Harnesses | <https://arxiv.org/abs/2604.18071> | 2026 论文 | 对 70 个公开 agent 系统的五维实证比较（subagent、context、tool、safety、orchestration） |
| Stop Comparing LLM Agents Without Disclosing the Harness | <https://arxiv.org/abs/2605.23950> | 2026 论文 | 指出不披露 harness 的 agent 对比不可复现，直接影响多代理 benchmark 结论的可信度 |
| Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets | <https://arxiv.org/abs/2604.02460> | 2026 论文 | 等思考 token 预算下单代理在多跳推理上优于多代理，是多代理叙事最直接的反例之一 |
| The Illusion of Multi-Agent Advantage | <https://arxiv.org/abs/2606.13003> | 2026 论文 | 系统拆解“多代理优势”在哪些条件下只是采样／预算错觉 |
| Solving a Million-Step LLM Task with Zero Errors | <https://arxiv.org/abs/2511.09030> | 论文 | 百万步 LLM 任务零错误的架构与执行记录，长程可靠性少见的正面样本 |
| The Illusion of Diminishing Returns | <https://arxiv.org/abs/2509.09677> | 论文 | 重新测量长程执行能力，指出模型在长任务上的真实退化曲线，可校准“能跑多久”的宣传 |
| Governance Decay: How Context Compaction Silently Erases Safety Constraints | <https://arxiv.org/abs/2606.22528> | 2026 论文 | 证明 context compaction 会静默抹掉安全约束，长程接续设计必须纳入的失败模式 |
| From Recall to Forgetting | <https://arxiv.org/abs/2604.20006> | 2026 论文 | 把“记住”和“该忘”分开度量，为记忆保留策略提供指标 |
| WikiSkill | <https://arxiv.org/abs/2608.27454> | 2026 论文 | 把 agent 经验编译成持久知识以演化 skill，对照 Context Ledger／Harness² 的经验沉淀路线 |
| Agentic Context Engineering | <https://arxiv.org/abs/2510.04618> | 2025 论文 | 主张演化 context 而不是简单压缩，compaction 之外的另一条上下文管理路线 |
| HarnessSQL | <https://arxiv.org/abs/2610.12274> | 2026 论文 | 长程交互式 SQL agent 的 harness 契约与沙箱训练框架，可看 harness 设计如何迁到非 coding 域 |
| SWE-Marathon（论文） | <https://arxiv.org/abs/2606.07682>、<https://www.swe-marathon.org/> | 2026 基准 | 约 400 小时任务（如克隆整个 Excel）的 long-horizon benchmark，用复合奖励而非单次 pass/fail |
| Long-Horizon Terminal-Bench | <https://arxiv.org/abs/2607.08964> | 2026 基准 | 长程终端任务 benchmark，报告最强模型在严格阈值下仅 15.2% |
| CRBugBench | <https://arxiv.org/abs/2610.13668> | 2026 基准 | 评测 code review agent 能否作为 lights-off 工厂的门禁，对应“无人读 diff 是否安全”的争议 |
| Runtime-Independent Persistent Agents | <https://arxiv.org/abs/2609.00546> | 2026-09 论文 | 提出 quiesce–checkpoint–validate–bind–rehydrate–resume 协议以跨模型／harness 迁移持久代理，并明确不保证 exactly-once |
| From Question Answering to Task Completion: A Survey on Agent System and Harness Design | <https://arxiv.org/abs/2606.20683> | 2026-06-14 综述 | 按 model–harness 耦合梳理代理系统，校准“瓶颈在模型还是 harness” |
| Beyond Individual Intelligence | <https://arxiv.org/abs/2605.14892> | 2026-05-14 综述 | 多代理协作、失败归因与自演化，补 MAST 之后的失败归因研究线 |
| Doc2Harness | <https://arxiv.org/abs/2610.20344> | 2026 基准 | 要求模型从文档直接构建可运行 coding-agent harness 的确定性基准，328 个用例、19 个模型 |
| Odysseys2 | <https://browser-use.com/posts/odysseys2-long-horizon-web-agent-benchmark> | 2026 基准 | Browser Use／CMU 的 100 个 live-web 长程任务基准，报告同一模型换 harness 分数从约 33 到 72 |
| DeepSWE | <https://deepswe.datacurve.ai/blog/deepswe> | 2026 基准 | Datacurve 的长任务基准，选真实 OSS 中从未实现过的需求以规避训练集污染 |
| Olam Labs | <https://olamlabs.ai/> | 平台 | 在多代理模拟／游戏环境中评测模型的平台，YC Labs 的 Mindustry／Minecraft 实验引用其环境 |
| ESAA-Conversational | <https://arxiv.org/abs/2606.23752> | 2026 论文 | 事件溯源记忆层，用 hooks 把可见回合写成 append-only log，为异构 coding agent 提供连续性与 handoff |
| Portable Agent Memory | <https://arxiv.org/abs/2605.11032> | 2026 论文 | 跨异构 agent 的可验证记忆迁移协议，对应换 harness／模型后的记忆接续 |
| Beyond Memory: A Transactional Continuity Kernel | <https://arxiv.org/abs/2608.11632> | 2026 论文 | 长寿命 agent 的事务化连续性内核，持久运行的状态一致性视角 |
| Identity is More Than Recall | <https://arxiv.org/abs/2609.13637> | 2026 基准 | 部署后 agent 持久身份基准，检验“换运行时仍连续”是否只是记忆召回 |
| SemaClaw | <https://arxiv.org/abs/2604.11548> | 2026 论文 | 用 harness engineering 做通用个人 agent |
| Agent libOS | <https://arxiv.org/abs/2606.03895> | 2026 论文 | 能力受控、可自演进的 agent 运行时底座，给出权限与进程谱系的系统层设计 |
| MOSS | <https://arxiv.org/abs/2605.22794> | 2026 论文 | 让 agent 改写自身源码实现自演进，持久运行之外的长期适应路线 |
| DeepMind Minecraft 多 agent 研究 | <https://arxiv.org/abs/2610.22319> | 2026 论文 | Minecraft 多 agent 长程协作研究，被 YC Labs 的文明实验直接引用 |
| Meta-Harness: End-to-End Optimization of Model Harnesses | <https://arxiv.org/abs/2603.28052>、<https://yoonholee.com/meta-harness/> | 2026 论文 | 用完整执行轨迹做外层搜索优化 harness，TerminalBench-2 上有可复现提升 |
| stanford-iris-lab/meta-harness-tbench2-artifact | <https://github.com/stanford-iris-lab/meta-harness-tbench2-artifact> | 开源 | Meta-Harness 论文的 TerminalBench-2 参考实现 |
| SuperagenticAI/metaharness | <https://github.com/SuperagenticAI/metaharness> | 开源 | 另一条 harness 自动优化实现路线 |
| Is grep all you need? | <https://arxiv.org/abs/2605.15184> | 2026 论文 | 研究 harness 如何重塑 agentic search，对照检索工具与上下文策略设计 |
| Chroma：Context Rot | <https://research.trychroma.com/context-rot> | 研究 | 上下文变长导致性能退化的实证，支撑 compaction、隔离与重置的取舍 |
| future-os-blog：上下文压缩实测 | <https://future-os-blog.github.io/posts/context-compaction-measured.html> | 2026-08-04 实测 | 178 题精确回忆 FutureOS 147/178、OpenCode 83/178、Codex 68/178；工具输出占字符 96.1% 但只对应 10% 问题，助手／用户文本占 3.9% 却对应 90% 问题；单次抽样、识别题非续任务 |
| arXiv：Herding and Runaway Cascades | <https://arxiv.org/abs/2610.30769> | 论文 | 用 Music Lab 实验证明 LLM 多 agent 会出现 herding 与 runaway cascade |
| arXiv：Context as Infrastructure | <https://arxiv.org/abs/2610.41172> | 论文 | 把检索上下文当基础设施、为 harness 做知识编译，讨论 harness 内重复检索与上下文膨胀 |
| Recursive Language Models（RLM） | <https://github.com/alexzhang13/rlm> | arXiv 2512.24601 代码 | 把超长 prompt 当外部环境递归检查／分解／自调用，被 Anthropic 管理 agent 文引用 |
| Recursive LLM | <https://github.com/andyk/recursive_llm> | 开源 | Headlong 的 shellm 递归语言模型思路来源，对照递归分解与普通 tool use |
| Harbor | <https://harborframework.com/> | 工具 | Headlong 用来跑 Terminal-Bench 的评测 harness |
| openJiuwen 论文 | <https://arxiv.org/abs/2608.27969> | 2026-08-28 论文 | 长程 coding agent harness：Rail 式能力组合覆盖单 agent、委派子 agent 与 Swarm Flow，自报 SWE-bench Verified 82.6%；源码在 <https://github.com/openJiuwen-ai/jiuwenswarm>（论文首页 Source Code 即此仓库，见 4.1 的 JiuwenSwarm 行） |
| LongHorizon-Harness（AMAP） | <https://github.com/AMAP-ML/LongHorizon-Harness> | 约 1.8k★，arXiv 2608.01964 | 长程 computer-use harness：plan→act→verify→checkpoint/recover，fresh-context 执行、独立审计与验证检查点 |
| Software Factory Reliability | <https://github.com/sjarmak/software-factory-reliability> | 开源 | 把软件工厂当分布式系统，给出可执行可靠性模式与故障注入演练，补“吞吐量叙事”之外的故障侧证据 |
| Sakana AI-Scientist-v3 | <https://github.com/SakanaAI/AI-Scientist-v3> | 开源 | 用 coding agent 编排做自动科学发现，观察同一套长程 harness 在非 SWE 任务上的迁移与失效 |

### 4.10 清单、目录与 Skill／插件市场（J）

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| andyrewlee/awesome-agent-orchestrators | <https://github.com/andyrewlee/awesome-agent-orchestrators> | 约 2.3k★ | 按终端／桌面、swarm、loop runner、task runner、基础设施、个人助理分类的编排器索引，另有 agent-orchestrators.com |
| ai-boost/awesome-harness-engineering | <https://github.com/ai-boost/awesome-harness-engineering> | 约 5k★ | harness engineering 索引：planning/decomposition、context delivery/compaction、memory/state、task runners、verification、observability |
| RUC-NLPIR/Awesome-Long-Horizon-Agents | <https://github.com/RUC-NLPIR/Awesome-Long-Horizon-Agents> | 约 859★ | 长程 Agent 路线图／索引，避免只按通用 Agent 搜 |
| Picrew/awesome-agent-harness | <https://github.com/Picrew/awesome-agent-harness> | 约 1.9k★ | Agent harness 资源列表：GitHub 项目、工具、benchmark、实践指南 |
| AutoJunjie/awesome-agent-harness | <https://github.com/AutoJunjie/awesome-agent-harness> | 清单 | 按编码代理、规格工具、标准协议与方法论分层的 harness 清单 |
| bradAGI/awesome-cli-coding-agents | <https://github.com/bradAGI/awesome-cli-coding-agents> | 清单 | 终端原生编码代理目录，单列并行 runner、自主循环与 Codex Infinity／Prime Agent／Jazz 等长跑项目 |
| danielrosehill/AI-Harnesses | <https://github.com/danielrosehill/AI-Harnesses> | 2026-04 快照 | 保留 deer-flow、autoagent、claude-code-harness、OpenHarness 当时的定位与 star，便于看演化 |
| nibzard/awesome-agentic-patterns | <https://github.com/nibzard/awesome-agentic-patterns> | 清单 | 模式库，含 deterministic zero-LLM orchestration 等与 Bernstein 直接相关的条目 |
| walkinglabs/awesome-harness-engineering | <https://github.com/walkinglabs/awesome-harness-engineering> | 清单 | 另一份 harness 工具与指南索引，与另两份 awesome 列表互补 |
| varun1505/awesome-software-factories | <https://github.com/varun1505/awesome-software-factories> | 2026-09，约 62★ | 收集 software factory／dark factory 这类“从任务到 PR 全自动、可并行”的系统；清单本身质量未逐项核 |
| TeleAI-UAGI/Awesome-Agent-Memory | <https://github.com/TeleAI-UAGI/Awesome-Agent-Memory> | 清单 | 记忆系统、基准与论文清单，仓库外还有对 DeepSeek-V3 等模型栈的行为层 conformance 记录 |
| agent-orchestrators.com | <https://agent-orchestrators.com> | 目录 | 257 个开源编排工具的目录，按 terminal/desktop/swarm/loop runner/task runner 分类并给 star 动量 |
| Agent MGMT 编排器目录 | <https://agentmgmt.dev/> | 目录 | 独立收录 87 个编码代理编排器（Conductor、Sculptor、Sidecar、Taskplane、Kandev 等）并标注开源／价格／star |
| Agent Memory Atlas | <https://neoneye.github.io/agent-memory-atlas/> | 索引 | 横向索引各类 agent memory 系统（含对 Harness² 的独立分析） |
| metaharness.tools | <https://metaharness.tools> | 索引 | 汇总 meta-harness 概念及 Omnigent、Polygraph、Stanford Meta-Harness 的对照地图 |
| Shadow 失败案例索引 | <https://impartshadow.github.io/echo-site/failure-cases/> | 索引 | 194 条外部代理失败产物索引（含 machine JSON 与 falsification bounty），可按“静默报成功／丢消息”检索原始 issue |
| sickn33/agentic-awesome-skills | <https://github.com/sickn33/agentic-awesome-skills> | 约 49k★ | 2,917 个 SKILL.md；AAS Core 让 Agent 在本地目录检索、记录选择、校验 stack 并预览 plan（apply/recovery 仍实验）§ |
| VoltAgent/awesome-agent-skills | <https://github.com/VoltAgent/awesome-agent-skills> | 约 36.8k★ | 1000+ 社区与官方 Skill 的 curated 集合，头部 Skill 索引 § |
| wshobson/agents | <https://github.com/wshobson/agents> | 约 42.1k★ | 多 harness 插件市场：94 个插件、202 agents、185 skills、105 commands，同一 Markdown 源适配 7 个客户端 § |
| anthropics/knowledge-work-plugins | <https://github.com/anthropics/knowledge-work-plugins> | 约 34.5k★ | Anthropic 官方知识工作者插件仓（面向 Claude Cowork），补官方插件分发的另一条产品线与打包契约 § |
| revfactory/harness | <https://github.com/revfactory/harness> | 约 9.3k★ | 元 Skill：一句项目描述生成领域 Agent 团队及所需 Skill；v2 三种执行模式（workflow orchestration、持久 Agent 协作、sub-agent delegation）§ |
| iflytek/skillhub | <https://github.com/iflytek/skillhub> | 约 5.4k★ | 讯飞的自托管企业 Skill registry：发布／版本、RBAC、审计、Docker/K8s § |
| byronxlg/skillfold | <https://github.com/byronxlg/skillfold> | 约 15★ | 把 Skill 当依赖：YAML 声明、lockfile 锁精确 revision、可复现安装到 `.claude/skills` § |
| claude-plugins.dev | <https://claude-plugins.dev> | 社区 registry | 一条命令自动加 marketplace 并安装插件，按 relevance/downloads/stars 排序，要求 Claude Code v2.0.12+ § |
| aaskills.tech | <https://aaskills.tech> | 目录 | 2,917 个 Skill 的托管目录，配 AAS Core 的本地目录检查、Agent 选择与 plan preview § |
| agentskills.io | <https://agentskills.io> | 规范 | 跨 Claude Code/Codex/Cursor 的 SKILL.md 打包与安装标准，Skillfold、Amp 等以此为目标格式 § |
| Prime Radiant Codex 插件合集 | <https://github.com/prime-radiant-inc/openai-codex-plugins> | 开源 | 把 Superpowers 等技能以 `.codex-plugin` 清单分发到 Codex 插件市场，对照同一技能集在不同 harness 的打包差异 § |
| ECC | <https://github.com/affaan-m/ECC> | 开源（本仓 docs/13 与 decisions/skills-and-plugins 已收 ECC search-first；此处只补整包清单） | 跨 Claude Code/Codex/Cursor/OpenCode 的操作系统式配置，把 68 agents、286 skills、hooks、memory 与安全扫描打包成可安装工作流 § |
| AOS-1（Agent Orchestration Standard） | <https://github.com/tomtomsatnav/agent-orchestration-standard> | 提案 | 提出 AOS-1 编排规范并配本地 dashboard（会话图、token、工具流、replay、告警），用于比较各家会话模型是否可标准化 |
| Agent Messaging Protocol | <https://github.com/agentmessaging/protocol> | 约 36★，早期 | Ed25519 签名信封、跨 provider federation、要求可证明的投递；“投递不等于收到”的协议层 |
| agent-identity（AID） | <https://github.com/agentmessaging/agent-identity> | 早期 | agent 用 Ed25519 身份向 OAuth 2.0 服务器认证并换短期 token，不存密码或 API key |

### 4.11 补遗（主题已归组但未在上一轮展开的条目）

| 候选 | 原始链接 | 日期／类型 | 为什么值得看（含限制） |
|---|---|---|---|
| Amp：Task 子代理与 Oracle／Finder／Librarian | <https://ampcode.com/docs/models-and-subagents> | 官方文档（无日期，2026-11-03 读取） | 主 agent 把任务交给 Task 子代理，各自独立上下文、不能互相通信或中途指导，只回最终摘要；Oracle／Finder／Librarian 是以工具形式调用的只读角色，父线程可给运行中的 Task 追加任务；上下文满时像 thread 一样压缩 |
| Amp《Amp, Rebuilt》 | <https://ampcode.com/news/neo> | 2026-05-06 产品文 | 2025-10 Amp 曾用 Handoff 取代 compaction，Neo 改为上下文 90% 时自动摘要并开新窗口，原文写“handoff is out. Compaction is in.”；“压缩 vs handoff”争论的反例 |
| Harness²（Google Research） | <https://github.com/google-research/harness2> | 2026-10-19 论文＋开源 | 递归 harness：任务级 executor/editor/composer 改 prompt、guardrails、memory、subagents、skills，跨任务 reflector 把证据化经验存进改进 harness；WorkBuddy／JobBench／LAB 报告 11.5／4.5／11.8 点提升，基准暴露面与 API 成本需另核 |
| POrchestra | <https://github.com/XueyangFeng/POrchestra> | 开源论文实现 | 允许子 agent 在运行中发结构化 revise 请求修改目标／harness，同时保留本地执行历史；长程三基准相对提升 9.1%，直接针对“子任务契约创建时冻结”的缺陷 |
| Nx Polygraph | <https://nx.dev/blog/announcing-polygraph> | 厂商工程文 | 跨仓库依赖图＋会话历史（episodic memory）的 agent-agnostic meta-harness，直指“一次改动跨 4 个仓库要解释 7 次” |
| LangChain：Organizing context in a multi-agent harness | <https://www.langchain.com/blog/organizing-context-in-a-multi-agent-harness> | 厂商博客 | 明确区分 subagent 的 isolated 与 fork 两种上下文模式，并给出 worker/verifier/researcher/memory agent 各自该用哪种 |
| agent-limit-retry | <https://github.com/error0702/agent-limit-retry> | 2026-09-24 工具 | 针对 Claude Code 5 小时／周限额打断并行 subagent：从 transcript 的 `quotaLimits.resetsAt` 取重置时间，限额前写 handoff、重置后按 id resume；作者 HN 自报 6 个会话 449 个 subagent 被切断、8 个被恢复、438 个重做 |
| Codex Infinity | <https://github.com/lee101/codex-infinity> | 开源 | Codex CLI 分支用 `--auto-next-steps` 自动接续下一步并跑测试，另加并行多代理与 CI 修复循环 |
| CheetahClaws | <https://github.com/SAIL-Research-Lab/cheetahclaws> | 开源 | 面向长程、多模型编码助手的 harness 基础设施，显式包含 MCP、skills、memory、审批、checkpoints 与 bridges |
| Jazz | <https://github.com/lvndry/jazz> | 开源 | 一份 JSON 定义模型、人格、工具与权限，同一代理可从终端、cron、GitHub Action 或 Telegram/Discord 触发 |
| Claude Code Harness | <https://github.com/Chachamaru127/claude-code-harness> | 开源 | 把 Claude Code 工作固化成 Plan→Work→Review 的自主循环 harness，“审查后自动回到实现”的闭环 |
| autoagent（thirdlayerinc） | <https://github.com/thirdlayerinc/autoagent> | 开源（原 kevinrgu/autoagent） | 以“autonomous harness engineering”为目标，让代理自己改 harness |
| Pi（earendil-works） | <https://github.com/earendil-works/pi> | 开源 | 统一 LLM API、agent loop、TUI 与编码 CLI 的工具包，同时是 Agensh、Utah 等 harness 的单代理后端 |
| codex-symphony | <https://github.com/Citedy/codex-symphony> | 开源 | 把 Symphony 与 Linear 引导进任意 Git 仓库的便携 bootstrap，可评估 Symphony 落地成本与前置依赖 |
| Zylos | <https://github.com/zylos-ai/zylos-core> | 开源 | 持久型 harness：分层记忆、skill 渐进披露、任务调度器和活动监控，通过 Telegram/Lark 长连 |
| Beeline | <https://usebeeline.app> | 产品 | 人类与 agent 的团队聊天／协作界面，演示 codex 开 corner、提 PR 的多人协作流 |
| Foremerge | <https://github.com/naw103/foremerge> | 开源（本仓 inbox／decisions 与 A-LONG-ROUTE-FOREMERGE-READER-20261101 已覆盖，只作对照） | agent 写代码前声明要修改的函数，冲突在变成 merge conflict 之前被标记；本轮只作对照，不重复列 |
| Discord Blue（cbusillo） | <https://github.com/cbusillo/discord-blue> | 开源 | 把 Discord 线程桥到本地 Codex app-server 与 Claude Code channel，“监督会话远程操控多个长跑会话”的 DUI |
| context-panel（cbusillo） | <https://github.com/cbusillo/context-panel> | 开源 | macOS 小组件跨供应商显示额度、燃烧率与重置，长跑任务的成本／额度可观测性入口 |
| runtimewire：Devin dynamic workflows | <https://runtimewire.com/article/devin-dynamic-workflows-python-agent-orchestration> | 二手报道 | 报道 Devin 把 agent 编排变成可恢复的 Python workflow（2026-10-13）；一手文档见 Devin Dynamic Workflows |
| Devin Dynamic Workflows | <https://docs.devin.ai/work-with-devin/dynamic-workflows> | 官方文档 2026-10-13 | 把多 agent 编排写成确定性、可恢复的 Python 脚本：`register_workflow/agent/pipeline`，每次 agent 调用记录到 run ID，中断后已完成的重放、未完成的重跑；企业账户默认关闭，单 run 预算默认／最大 7 天，ACU 成本显著更高 |
| Deep Agents（LangChain） | <https://github.com/langchain-ai/deepagents> | 开源（本仓已有实验） | 被 #8796 的同线程多写者复现用作真实调用栈，可核 DeltaChannel 与并发写问题；本轮只作对照 |
| goose（Block） | <https://github.com/block/goose> | 开源（4.2 已列） | Stripe Minions 的生产基线 |
| herdrdev/herdr | <https://github.com/herdrdev/herdr> | 约 47.6k★；本仓旧实验提为未选用线索，按未覆盖补链接 | 常驻终端 runtime 持有各 Agent 的 pane，会话跨重启／SSH 重连，标记 working/blocked/idle，Agent 可经 CLI/socket 互相开 pane、发提示；补本仓缺的“进程外持久会话与 Agent 间唤醒” |
| loopx-project/loopx | <https://github.com/loopx-project/loopx> | 约 6.5k★ | 本地优先语义控制面，跨会话／跨 runtime 保持目标、决定、归属与证据；作者用 46 任务同模型 LHTB 自报比 Plain Codex 高 17.3% reward |
| Get-Concord-AI/concord-mcp | <https://github.com/Get-Concord-AI/concord-mcp> | 约 862★ | 跨 Claude Code、Codex、Cursor、Gemini、Grok 的协调协议：claim work、检测 edit collision、durable message、转移 ownership、交接 review evidence |
| Cotal-AI/Cotal | <https://github.com/Cotal-AI/Cotal> | 约 380★ | 基于 NATS JetStream 的 pub/sub 协调标准：presence、channels、durable DM、role-addressed anycast |
| harshalgajjar：多代理 harness 需要独立消息通道 | <https://harshalgajjar.com/blog/multi-agent-harnesses-need-separate-message-channels> | 2026-10-11 | 单一聊天框混同上级、下级、同级、人类与告警五种关系，导致权限混淆、回复错路、重复工作与审计不可用；提出按通道打标并把 authority 绑定到通道，缺具名事故 |
| runta：长运行 Agent 崩溃后的恢复意味着什么 | <https://runta.com/blog/agents-arent-software/> | 2026-08-05 | 作者认为重启几乎恢复不了东西，真正丢失的是已验证约束、已排除假设和下一步意图；提出 semantic scratch space、根状态／派生状态分离、commit boundary |
| lopezb：上下文压缩的难点 | <https://lopezb.com/articles/the-hard-parts-of-context-compaction> | 2026-08-03 | 逐项列出压缩请求自身溢出、摘要过大／为空、provider 端加密不可移植、缓存失效，并给出保留最近两轮用户消息、先剪工具输出、先写指针再换内存状态 |
| practicalsystems：子代理真实 token 成本 | <https://www.practicalsystems.io/blog/measure-your-subagent-token-cost> | 2026-09-14 | 实测同一零工具提示 lean scout 15,746、general-purpose 38,401，固定开销主要来自本机 MCP／插件／Skill／工具 schema；给出 `claude -p --output-format json` 自测法与约 10 次工具调用／80 行改动以下的委派阈值 |
| Google Elephant-Goldfish Model 仓库 | <https://github.com/google/elephant-goldfish-model> | 2026-09-13，约 10.5k★ | Elephant 持项目上下文起草规格，Goldfish 在没有先前对话的情况下只读草稿与引用材料做评审，专门暴露未说明的假设；插件支持 Claude Code/Codex/Antigravity；“数千名 Google 工程师使用”是厂商自报，HN 仅 3 分 |
| Reason Network | <https://github.com/reason-machines/reason-network> | 2026-10-16，约 1.5k★ | 每台机器一个小 daemon，把本机所有 coding agent session（谁、repo/branch、忙闲、当前动作）暴露给队友，任意 agent 可给指定 agent 发消息；端到端加密，但需登录其服务 |
| Pizza Bot | <https://github.com/pizza-bot-app/pizza-bot> | 2026-09-15，HN 61 分，Apache-2.0 | 把长时间 AI 工作做成 inbox：启动或排程后走开，完成进 Unread、待人决定进 Action；“persistent running 的结果交付 UX”候选 |
| Squadra | <https://github.com/dagoSte/squadra> | MIT，v3.12.0 | 本地多窗口协调器：SQLite 注册表记录 owner、reviewer、checkout、scope 和可执行 proof；builder 先 ACK 再开工，交 immutable candidate，由非作者评审；只覆盖可信本地窗口，不保证窗口被唤醒 |
| OpenHarness（autonomous-ai） | <https://github.com/autonomous-ai/openharness> | 开源 | 原生桌面控制台：一个窗口并排 Claude Code、Codex、Cursor、OpenCode、Devin，跨笔记本、家庭服务器与 GPU 机；relay E2E 加密，关闭应用后 agent 继续运行 |
| Cognition：What We Learned Building Cloud Agents | <https://cognition.ai/blog/what-we-learned-building-cloud-agents>、<https://cognition.com/blog/what-we-learned-building-cloud-agents> | 2026-04-23 厂商复盘 | 共享内核的容器隔离风险、状态快照、编排与治理，是把 CLI agent 搬上云时真实踩坑的一手材料 |
| Cognition：Devin can now Schedule Devins | <https://old.cognition.ai/blog/devin-can-now-schedule-devins> | 厂商博客 | 定时／递归调度 managed sub-agents，可对照 Kiro Crew 的 schedule＋heartbeat 与 Symphony 的看板触发 |
| neuralyzer | <https://github.com/gintasz/neuralyzer> | 开源 | 只提供一个工具：调用后清空会话全部 user/assistant 消息并重发第一条，让 Ralph 循环用干净上下文重跑 |
| shire | <https://github.com/victor36max/shire> | 开源 | agent 跨会话持久，带 inter-agent mailbox 和共享 drive，按项目隔离团队，定位不绑定模型的基础设施层 |
| agora | <https://github.com/CaffeinatedSoftwareLLC/agora> | 开源 | 自托管聊天室里协调多台机器上的 coding agent，带轮流发言、文件预留和 handoff，人可在 web UI 旁观和纠偏 |
| ox（sageox） | <https://github.com/sageox/ox> | 开源 | Go CLI 把团队决策、约定和会话历史装进每个 agent 会话，做跨 agent／机器／人的持久上下文 |
| opencode-dynamic-context-pruning | <https://github.com/Tarquinen/opencode-dynamic-context-pruning> | 开源 | OpenCode 的动态上下文裁剪插件，自动压缩或修剪已失效的会话上下文；README 称主要开发已转向 Sleev |
| anthropics/claudes-c-compiler | <https://github.com/anthropics/claudes-c-compiler> | 官方开源 | 16 个 headless Claude 会话在没有中心编排器的情况下，用 `current_tasks/` 锁文件、共享裸 git 上游和进度文档协作；去中心化多代理分工最完整的公开样本 |
| EverMemBench | <https://github.com/EverMind-AI/EverMemBench> | 开源 | 多人群聊长期记忆评测，分事实召回、应用推理和个性化泛化三层，已接入 Memos、Mem0、Memobase、EverMemOS、Zep 横向比较 |
| luispabon/steiner | <https://github.com/luispabon/steiner> | 开源 | Go 写的 TUI 编码代理，按探索／实现／评审分配不同订阅与模型档位；作者在 Codex #49735 里用它复现“凭空 token 预算”告警 |
| NathanNT/codex-mux | <https://github.com/NathanNT/codex-mux> | 开源 | 让 Codex 原生子代理按角色使用外部模型 provider 的兼容层；issue 评论有人质疑其分发不透明的可执行文件 |
| CCanxue/codex-deepseek-subagent-fix | <https://github.com/CCanxue/codex-deepseek-subagent-fix> | 开源补丁 | 针对 Codex MultiAgentV2 子代理加密 agent_message 的本地补丁，使 DeepSeek 等非 OpenAI provider 可用 |
| adk-rust coding_goal 示例（固定 SHA） | <https://github.com/zavora-ai/adk-rust/blob/ffbfb053f65e11e93927fbd9bca01fdf217eb5cb/examples/coding_goal/README.md> | 开源示例 | 每轮原子写 `.adk/goal.json` 的 /goal 循环，“目标状态落盘后重启续跑”的最小实现 |
| clamshell.dev：Mac Sleep Can Burn Your Usage Limit | <https://clamshell.dev/guides/claude-code-usage-limit-mac-sleep> | 实践指南 | 解释 #102269 的缓存重写机制，并给出 caffeinate、暂停工作流等规避法 |
| gist：cache_gap.py | <https://gist.github.com/tonydzi/7b4ab319f52c3b1b9de5d527b729f876> | 只读脚本 | 从 transcript 统计空闲间隔后的 cache write 占比，可自行复核睡眠导致的额度消耗 |
| Lidnight | <https://lidnight.app/en/> | 商业产品 | 菜单栏应用，可合盖保持 Mac 唤醒并从手机应答权限提示；由 #105184 评论者自报 |
| Archon（coleam00） | <https://github.com/coleam00/Archon> | 开源 | YAML 定义阶段、隔离 worktree、带验证门的 coding agent workflow engine，“确定性外壳包住 agent”的典型 |
| agents.md | <https://agents.md/> | 规范 | 跨 coding agent 共享指令文件的约定，被 OpenAI harness 文直接引用；多 harness 协作的仓库级契约入口 |

## 5. 去重与排除

以下内容本仓或既有产物已有，本单元只核差异、不重复列：

- **已在正文或 experiments 出现**：`claude-mem`（`experiments/claude-mem-summary-receipt`）、`planning-with-files`（`experiments/planning-with-files-handoff`）、`context-mode`、`Superpowers`、`ECC`、`OpenSpec`、`GSD`、`BMAD`、`Deep Agents`、`OpenHands`、`CAO`、`Symphony`、`foremerge`、`Happy`、`conductor.build`、`Claude Squad`、`container-use`、`Vibe Kanban`、`worktrunk`、`anthropics/skills`、`addyosmani/agent-skills`、`Agent-Reach`、`mattpocock/skills`、`Graphicle`、`Warp` 的部分产品线。
- **只被引用过一次或仅作线索**：`deer-flow`（本仓只引用过一个 LangGraph 补丁）、`herdr`（旧实验提为未选用线索）、`Omnigent`（仅一处引文）三项按“未覆盖”列入候选，但标明本仓已有零散线索；`tenet` 经 grep 核实只有同名词（docs/04 的命中是 tenetsecurity.ai 的漏洞研究，不是 JeiKeiLim/tenet），按完全未覆盖处理。
- **跨卡材料**：验证器、完成判定与审查门的具体实现归 VERIFY-REVIEW（清单见 §6）；Skill 市场与打包契约归 SKILL-MCP；单 Agent 的 `CLAUDE.md`／配置类（如 wshobson/agents 的具体插件内容）归 AGENT-CONFIG。本卡只留机制与链接。
- **旧调用已排除**：`A-PARALLEL-REVIEW-SOURCES-20261028` 与 `A-RESUME-CONTRACT-SOURCES-20261028` 为 cancelled（termination_unconfirmed／timeout）；其固定的 Cursor Projects、两条 Reddit 接收瓶颈链、OpenCode 10 月工具中断恢复调查未重开、未取回。`A-FRONTIER-WIDE-SCAN-20261027` 已排除的 `LayerFS`／`Corgi`／`Omnara`／`Hob`／`Entire CLI` 本轮只有 Omnara 因新讨论再出现，已注明来源为旧扫描。
- **同名不同物**：`Delta`（delta.dev）与 `DeltaDB`（Zed）是两个项目，分列；`Epiq` 有两个入口（epiq.sh 与 ljtn.github.io/epiq/），按同一项目合并；`OpenClaw` 的 GitHub 仓库与站点入口合并为一行；`Hermes Agent` 的仓库与站点合并。
- **未列入候选的 404／改名**：`wandb/catnip`、`ordwell/ordwell`、`nmelo/bdui`、`ralphify.co` 的 ralph 文（TLS 失败）、`code-agent-orchestrator`（npm 403 且未定位仓库）。它们只在 §1.1 记录，不作为候选。`@avee1234/handover` 包页虽 403，仅按搜索摘要列入 §4.4 并标“未读包页”，不算已核候选。

## 6. 缺口与跨卡转交

**本轮未饱和的地方**（不写“全面完成”）：

1. 中文社区只做了 WebSearch 摘要，另有两篇腾讯云原文与一篇 InfoQ（复检 451，未重读）；掘金、知乎、少数派、B 站、公众号原帖与评论区未系统扫。具体缺口：`mp.weixin.qq.com` 的 Munder Difflin 评测、`claudeers.com/compare/munder-difflin-2-vs-openrig`、`linux.do/t/topic/2828912` 与 `/t/topic/3004044`（并行执行与 token／缓存成本），均只有摘要。
2. Reddit、linux.do、V2EX、HN 网页端按约定未重试，没有这些站的原帖；HN 只经 Algolia API。Reddit 已知的两条接收瓶颈线程是 <https://www.reddit.com/r/ClaudeCode/comments/1xdjb2g/how_many_claude_code_sessions_can_you_run_before/> 与 <https://www.reddit.com/r/ClaudeCode/comments/1x15b7r/how_do_you_stop_being_the_bottleneck/>（来自已 cancelled 的 A-PARALLEL-REVIEW-SOURCES-20261028 固定入口，本轮未读、未取回，只作缺口链接）。
3. X／Twitter 原帖（Spawn <https://x.com/jsnnsa/status/2115623382721126826>、Agensh <https://x.com/zhan8855/status/2102784066957500650>、Viv Trivedy anatomy <https://x.com/Vtrivedy10/status/2031408954517971368>）未登录不可读，只有转述；`mntruell` 的数学帖本轮未定位到具体 status URL，故不列具体缺口。
4. arXiv 只读摘要，未读全文、图表与附录；Agensh、Harness²、LongHorizon、Compact-Bench 的统计口径需云端复核。
5. GitHub Discussions 正文与评论（`orgs/community/discussions/199414`、`deepseek-harness/discussions/5310`）未登录读不全。
6. `openai.com/index/harness-engineering/`、`unlocking-the-codex-harness`、`the-next-evolution-of-the-agents-sdk`、Anthropic `long-running-Claude` 均 403／404，机制未据原文确认。
7. GitHub star 只有快照，没有增长史；无 code search，未做全仓采用率检索。
8. 所有候选均未安装、未运行、未做效果实测；理由来自 README、文档、摘要或社区回执。

**跨卡转交（只留链接与归属，不在此重写）**：

- **VERIFY-REVIEW**：`Anthropic cwc-long-running-agents` 的 verify-gate、`Basis` 的过程监督、`No-Human` 的反驳式完成判定、`truth-firewall`、`agentci`、`Anneal`、`proof-loop`、`Vet`、`oh-my-agent`、`agentbehavior`、`LangChain rubrics`、`Spotify feedback loops`、`Uber uReview`、`AgentEtna`、`sd0x-dev-flow`、`Vigil`、`AutoHarness`、`CRBugBench`；以及 `Codex #49705`／`#49735`、`Claude Code #90542` 这三条“完成声明与验收标准被改写”的 issue。
- **SKILL-MCP**：`sickn33`、`VoltAgent`、`wshobson/agents`、`anthropics/knowledge-work-plugins`、`revfactory/harness`、`iflytek/skillhub`、`skillfold`、`claude-plugins.dev`、`aaskills.tech`、`agentskills.io`、`Prime Radiant`、`ECC`。
- **AGENT-CONFIG**：单 Agent 的 `CLAUDE.md`／AGENTS.md 写法（`OpenAI rethinking-skills`、`Claude Code #90542`）、`Jazz` 的单代理 JSON 配置、`Pi` 的 TUI 入口。
- **其他在途卡**：`D-hruvi/data-analyst-ai-team` 与 `dev.to Dhruvi` 的多代理对照，可与 B-* 的评测卡共用；`Cockroach MOLT Sinai` 已在 `docs/research/2026-10-22-frontier-trials.md` 引用过，本轮只补失败面。

## 7. 本单元自检

- 只写 `docs/collaboration/local-jobs/artifacts/A-MULTIAGENT-LONG-WIDE-20261029/sources.md`，未改正文、模板、inbox、TASKS 或其他任务文件。
- 所有链接来自本轮候选清单；链接检查由收集阶段的分批 curl 尝试完成，打不开或只拿到摘要的已在行内日期／类型列或 §1.1 标 403／406／451／仅摘要，不据此确认机制；不再声称未通过者已丢弃。
- 文中不含本机绝对路径、内网地址、凭据或私人记录；作者自报、README 所见、公开回执与二手转述已分开标注。
- 未安装／运行任何候选，未使用浏览器或桌面自动化，未对外发言。
