# A-SKILL-MCP-WIDE-20261029 · Skill、MCP 与插件广扫（单元 1）

> 读取截止 2026-11-03（UTC+8），主窗 2026-08-01～11-03，优先 8 月后；少量更早建仓、近期升温的项目在理由里标注“建仓早／近期升温”。本文只保存候选与证据，不含采用结论、默认化建议或地图升级。下列 528 项是本轮 702 条原始条目去重后的候选：P1–P5 共 514 项完成链接可达性核对；2026-11-03 复核时 6 项入口不可达，508 项链接可达、507 项内容已核（“Figma 远程 MCP 白名单排除 Pi”只有搜索摘要；“SkillTrustBench”“SkillsMP（目录概览）”同时在不可达清单内且只有摘要）；P6 的 14 项只有摘要或待核。对可达项，核对只证明“链接能打开、页面与理由对应”，不等于安装、运行、安全或效果验证。作者声称、源码所见、公开运行回执按原收集措辞保留，未统一升级为已验证事实；理由里写“摘要／未核／未读”的按摘要处理。

**先给结论。** 本轮最值得负责人先看的不是又一个 Skill 集合，而是四件会改变现有判断的事：① **Skill 正在变成有锁文件、审批和权限声明的依赖**（pnpm、microsoft/apm、qvr、Tank、spm、packslip）；② **“装了 Skill 有没有用”开始有可复算的评测方法**（Caliper、skill-issue、OpenAI/Microsoft 的插件评测、Vercel 的负面结果）；③ **插件市场签名正确不等于分发安全**（Cursor 扩展后门、Zenity 的 skills.sh 活动、Plugin4Shell、TrustFall、SkillJacking）；④ **单一扫描器不能当安装门禁**（Adversa 八款全绕过、Trail of Bits 四个 PoC、ClawHub 三家全报警仅 0.69%）。若只选三项做真实试用，按下面三行起步；证据与正反在 §2，下一步清单在 §5，此处不另立口径。

| 方向 | 首选入口 | 第一步（命令或动作） | 何时不该做 |
|---|---|---|---|
| 包管理器锁文件路线 | pnpm Agent Skills（§2.1） | 在测试仓库声明一个含 `skills/` 的依赖，执行 `pnpm approve`，记录锁文件与各客户端投影目录 | 仓库不用 pnpm／只需一个手工 Skill 时不必引入审批链；未确认宿主加载路径前不要当默认 |
| 同题对照评测 | Caliper `--ablate` 或 skill-issue（§2.2） | 选一个已装 Skill，同一真实任务跑有／无两版、重复 5 次，分别记“是否激活”与“是否成功” | Skill 在该 harness 未被加载时先修触发与描述，不要先做消融；单次对比不下结论 |
| 扫描器＋公开恶意语料复核 | [Aguara](https://github.com/garagon/aguara)／[PlugVet](https://plugvet.com/) 加 Trail of Bits `overtly-malicious-skills`（§2.4） | Aguara：`curl -fsSL https://raw.githubusercontent.com/garagon/aguara/v0.28.0/install.sh \| VERSION=v0.28.0 sh` 后 `aguara audit .`；PlugVet：查目标仓库的单条卫生等级；再用公开恶意语料和自己仓库各跑一遍，记录漏报、误报与版本 | 不要把单一扫描器当安装门禁；事故材料（§2.3）只读，不装不跑 |

## 1. 渠道覆盖表

**五类来源都有取材（④只读到搜索摘要，③部分原帖未读），另有第六类“没人点名的新东西”作补充；数量是收集时的原始条目，含跨批重复，最终去重为 528 项候选，其中 P6 的 14 项只有摘要或待核。** 各收集者的读取截止在 2026-11-03 04:16–05:27（UTC+8），首轮链接核对在 05:27–06:00 完成，P1–P5 共 514 项完成链接可达性核对；2026-11-03 复核发现其中 6 项入口已不可达（skillsmp 首页 403、3 个 HN item 000、Hugging Face SkillTrustBench 000、milvus.io 403／302 循环），实际可核 508 项、其中 507 项内容已核（“Figma 远程 MCP 白名单排除 Pi”仅读到搜索摘要）；“SkillTrustBench”“SkillsMP（目录概览）”两项同时在不可达清单内且只有摘要。6 项单列在“读不到或未读完的渠道”，不计入已核。

| 来源类别 | 实际读取的站点／项目与取法 | 轮次与原始条目 | 去重后 |
|---|---|---|---|
| ① 官方团队与高质量项目 | GitHub 原始文件／页面：raw.githubusercontent.com 读 README、CI yml、SKILL.md，github.com HTML 列目录；逐项核过 openai/skills、openai/plugins、anthropics/claude-code/tree/main/mods、anthropics/knowledge-work-plugins、microsoft/skills（含 test-harness.yml、skill-evaluation.yml）、nvidia/skills、trailofbits/{claude-code-config,codex-config,agentcov,calcifier,skills}、cloudflare/security-audit-skill、google-gemini/gemini-skills、google/skills、aws/agent-toolkit-for-aws、supabase/agent-skills、vercel-labs/agent-skills、browserbase/skills、Tencent/teamai-cli、ArcBlock/agent-skills、dart-lang/ai、flutter/agent-plugins、QianWen-AI/qianwen-ai、elementalsouls/Claude-BugHunter、github/awesome-copilot、bytedance/agentkit-samples；读 anthropics/claude-code CHANGELOG 定位 Mods 版本；官方文档 agent-plugins.org、developers.openai.com/codex/plugins/build、pnpm.io/agent-skills、dart.dev/tools/pub/package-skills、learn.microsoft.com/en-us/agent-framework/agents/skills、antigravity.google/docs/skills；官方博客 NVIDIA、Google Developers、Microsoft devblogs、Cloudflare、Prisma 两篇、Proton、OffSec、ArcBlock，skillmap.top 周报只作发现索引 | 1 轮广扫（collect-1，35 条）+ 12 个跟链批中的官方补核 | 计入 528 |
| ② 头部覆盖 | GitHub Search API（未认证）按 star 排序：topic:claude-code（108,350 仓）、agent-skills（40,431）、claude-plugins（328）、mcp（111,751）、mcp-server（42,316）、coding-agent（7,915）、ai-coding（8,459）、claude-skills（13,999），每类取前 30–40；另跑 created:>2026-08-01 stars:>700（1,104 条）按 star 取前 50。GitHub Trending 网页 weekly 16 项、monthly 18 项。awesome 列表：hesreallyhim/awesome-claude-code、ComposioHQ/awesome-claude-skills（默认分支 master）、VoltAgent/awesome-agent-skills、VoltAgent/awesome-openclaw-skills、sickn33/agentic-awesome-skills、wshobson/agents。市场：skills.sh 首页按安装量取前 20（页面共 184 条 Skill 链接）、anthropics/claude-plugins-official 的 marketplace.json（315 个插件）与 README、officialskills.sh（56 家厂商、660 个官方 Skill，页面标注 2026-11-02 更新）、ClawHub（首页 30 skills／12 plugins；VoltAgent awesome 目录另称 5,300+）、Smithery 首页、Glama 注册表首页（114,545 个 server，11-02 19:53 更新） | 1 轮广扫（collect-2，55 条）+ 跟链批补核；GitHub topic 只取 star 前 30–40，未翻完所有页 | 计入 528 |
| ③ 英文从业者与技术社区 | HN Algolia API（/search 与 /search_by_date，tags=story，created_at_i>2026-05-01，points>2/3，部分限定 title），4 轮 60+ 检索词：MCP、MCP server、MCP gateway、MCP security、model context protocol、skills、SKILL.md、agent skills、skills marketplace、skill manager、plugin、plugin marketplace、Agent Plugins、AAIF、skills.sh、codemode、mcpgrade、tool schema、progressive disclosure、malicious skills 等；再用 /api/v1/items/<id> 读约 30 个原帖及顶层评论。Lobsters newest/hottest/t/ai feeds 可读，站内 search 被 Anubis 拦截，改 site: 定位并以 /s/<id>.json 读评论。dev.to /api/articles 扫 mcp、claude、ai、agents、cursor、llm、programming、opensource 八个 tag，读约 12 篇原文。个人博客／通讯：Quandri、Maharshi Patel、Armin Ronacher、Teng Li、Agent Swarm、Waldek Mastykarz、Every、Pragmatic Engineer、Vercel、The Register、CSO Online、Zenity Labs。演讲：AI Engineer World's Fair 2026「Skills are the New SDKs」官方 talk 页；Harvard 2026-07-31 PDF 只核可打开。WebSearch 用于补规范线索与二源核对 | 1 轮广扫（collect-3，39 条）+ 跟链批；未做到饱和 | 计入 528 |
| ④ 中文社区 | WebSearch 中文词：MCP 2.0 新特性、掘金 Agent Skills 新插件、少数派／知乎 AI Agent Skills 新工具、AI Agent Skills 淘汰赛、2026年10月 新出的 Agent Skills 技能 MCP 工具 开源项目、腾讯 TeamAI-cli 评价、EGM 中文、Claude Code Skills 推荐 2026 年 11 月 新插件 MCP 等；只读到 36kr、CSDN、掘金、知乎、少数派的搜索摘要，未逐篇打开全文。中文本地材料从 GitHub 原始仓库补：QianWen-AI/qianwen-ai、iflytek/skillhub、kanyun-inc/reskill、AgentScope Java 技能市场、阿里云 MSE AI Registry 等 | 1 轮广扫（collect-5，29 条，含基线去重与 HN／GitHub／WebSearch 组合） | 计入 528 |
| ⑤ 真实问题与反馈 | GitHub issue 搜索 API（无 token，10 次/分）约 8 轮：repo:anthropics/claude-code 的 skills/plugin/mcp/marketplace，repo:anthropics/skills、claude-plugins-official、openai/skills、vercel-labs/skills、davila7/claude-code-templates、upstash/context7、oraios/serena、obra/superpowers、modelcontextprotocol/{servers,inspector,registry}；跨仓 in:title 筛真实使用者帖；对关键 issue 用搜索 API 的 body 字段读正文并核 state/created_at/comments。GitHub HTML 读 repo 元数据、README、release。Cursor 官方论坛 Discourse search.json + topic JSON（t/162287、149693、166056、160188、175393、176790、176977）；OpenAI 官方社区 Discourse search.json + topic JSON（t/1383626、1378543、1391582、1406914、1408796、1403146）；HN Algolia 读条目 49906637、49199296、50208666、48709606 及评论。市场／目录：PlugVet 站点与 2026-10 数据文（13,739 条 10-16～25 快照）、agent-plugins.org 与 spec README、npm/PyPI 核版本（ecc-agentshield 1.6.0、caliper-eval 0.21.0、claude-plugins 0.2.0） | 1 轮广扫（collect-4，26 条）+ 跟链批；GitHub Discussions 评论正文与部分市场评价未读完 | 计入 528 |
| ⑥ 没人点名的新东西（补充） | 官方／项目材料：GitHub raw README、releases 与页面（agentplugins/agent-plugins-spec、google/elephant-goldfish-model、microsoft/skill-recorder、cloudflare/security-audit-skill、vercel-labs/skills、redhat-et/ripwire、DeusData/codebase-memory-mcp、reason-machines/reason-network、DietrichGebert/ponytail、JuliusBrussee/caveman、agent-labs-dev/fastbrowse、openqodex/openqodex、miqdadbadjuber/anti-slop、rehan-remade/universal-modder、activeing123/mcptoon）；官方文档／公告 agent-plugins.org、skills.sh、modelcontextprotocol.io/extensions/apps/overview、owasp.org/projects/agentic-skills-top-10、arxiv.org/abs/2610.33489、anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation、cursor.com/blog/claude-code-extension-security-notice、blog.cloudflare.com/build-your-own-vulnerability-harness。GitHub Search API 用 topic:agent-skills、mcp-server、claude-code-plugin、claude-code、mcp，加 created:>2026-07-01／>2026-09-15／>2026-10-01 过滤并按 stars 排序。HN Algolia 查 agent skills 与 MCP（created_at_i>2026-08-01，按 points 排序）并读选中 item 评论。中英文 WebSearch 共 8 组 | 1 轮广扫（collect-6，21 条）+ 跟链批；最后一轮 created:>2026-10-01 仍出现 Fastbrowse、OpenQodex、Reason Network 等新条目，未饱和 | 计入 528 |
| 跟链补全 | 对首轮候选逐个顺藤：它引用和被引用的链接、评论区提到的替代品与反对意见、作者或团队的其他相关做法、收录它的列表。分 12 批并行，每批只列该组以外的新候选 | 第 2 轮 6 批 226 条；第 3 轮 6 批 271 条；合计原始 702 条 | 去重后 528 |

**口径说明。** “原始条目”含同一 URL 被多个收集者重复列出的情况；“去重后”按条目计：同一项目的站点／规范仓库／官方文档合并为一条，不按链接重复计数（Agent Plugins、ClawHub 已这样合并）。表中的“计入 528”只表示该渠道的条目进入了总池，不表示每一条都来自该渠道单独核实；同一项目常由多路交叉命中。`collect-4` 的 26 条与 `collect-5` 的 29 条分别对应“真实问题”和“中文社区”，与任务里的五类编号不同，这里按实际取法归类。

**数量对账。** 各批原始条目相加为 702 条（35＋55＋39＋26＋29＋21＋226＋271）。702 − 528 条去重候选 − 130 条未读缺口 = 44 条；这 44 条是同一 URL 在去重时并入其他条目、或未进入候选池的差额。130 条缺口按“先计入原始条目、再单列为未读”处理，即含在 702 内；它与 P6 的 14 条摘要候选不是同一类——后者有链接、只是正文未读，仍计入 528。原始逐条明细未保留，44 条无法逐项复核。除这 44 条差额与 130 条未读外，没有其他未计数的已收录条目。

### 读不到或未读完的渠道

**下列是 130 条缺口记录合并后的结果；同一站点多次失败只留原因，不当作“那里没有内容”。** 社区原帖与平台内文缺口保留给能读的环境，未用搜索摘要冒充机制确认。

| 渠道／入口 | 未读到什么、原因 |
|---|---|
| Reddit、linux.do、V2EX | 本机不可读（TLS／访问限制），正文与评论均缺（不是只有评论未读）。原收集记录未保留具体帖子 URL：**URL 未保留，无法补读**；可确认的只有主题——Figma 远程 MCP 白名单争议（同题见 HN 49922729）、Skill 管理与长期维护（同题见 HN 49589914）、中文 Skill 实践。需由能读的环境按主题重检或由用户贴链接，本文不代填。 |
| Hacker News 网页版 | 网页版不可读；改用 Algolia API 读过条目 49906637、49199296、50208666、48709606、49589914、49139845、49922729 与顶层评论。缺的是长帖全部回复（如 49589914 的 299 条评论只读顶层）；其中 49589914、49139845、49922729 三个 item 直链当前 curl 000，只能经 API 读。 |
| X／Twitter、即刻、微信公众号、Discord | 无公开可取接口或未登录不可读；Figma 人员原帖、Dylan Field 回复、eferro 原帖、各项目公告线程均未取正文，只保留博客／HN／搜索摘要转述。 |
| YouTube 演讲、播客音轨 | 未取字幕／转写；AI Engineer talk 只读官方摘要页，Pragmatic Engineer Uber 集只读摘要与时间戳，30k Skill executions/day 等数字未回原音轨核实。 |
| OpenAI harness-engineering 文章 | `openai.com/index/harness-engineering/` WebFetch 403（Cloudflare 质询），curl 只拿到拦截页；仅从 Trail of Bits README 和二手摘要看到标题／作者，未读原文。 |
| agent-plugins.org 兼容客户端页 | 正文只有 `<CompatibleClients />` 组件占位，客户端支持清单未渲染；哪些宿主已支持 1.0 未核。 |
| agentskills.io 的 clients／specification | WebFetch 因域名策略拒绝或客户端渲染为空；规范内容改由 agentskills/agentskills 仓库、HN 讨论和本仓既有文档核对。 |
| GitHub REST API（core／search／code search） | 未认证限额 60 次/小时，多次耗尽（部分批次 04:00–04:56 重置前后均失败）；code search 需认证；本机无 gh CLI。无法批量取 stars、updated_at、issue/discussions 列表；改用 raw.githubusercontent.com、GitHub HTML、301 跟随与搜索快照。GitHub Discussions 为 React 渲染，只取到标题（如 #83／#84／#86 的评论正文未读）。 |
| GitHub 具体仓库／release | agentplugins/agent-plugins-spec、cloudflare/security-audit-skill、tw93/Waza 的 repos/releases API 返回空或错误（v1.0.0 具体发布日期未取）；trailofbits/nono-config、trailofbits/galvanize-test-suite、prove-ai/Nikhail、rohitg00/aegntmemory、softcane/contextgc、Andrej1707/skill-orchestrator、jackwener/wx-cli（451）、BernhardJackiewicz/CodeAtlasWeb、agentapi/agentapi、codebase-memory-mcp 按名称猜的路径均 404／不可读。 |
| skills.sh | 只读到首页按安装量列出的 184 条链接及前 20 的名称／安装数，未逐项打开 Skill 正文；其 Packs 文档另读。 |
| officialskills.sh | 页面在 #536 处截断，660 个 Skill 与部分 publisher 未展开，未逐项读取完整目录。 |
| Smithery、Glama、skillsmp、skillregistry.io、agentskill.sh、claudemarketplaces、skillcatalog.dev、randomlabs.ai、skillbay.sh | Smithery／Glama 排行榜由前端动态加载或需登录，只读到首页 featured 与注册表计数；skillsmp 首页／目录页多次 403（Cloudflare），只读到 llms.txt 概览、API 与 MCP 入口；skillregistry.io TLS handshake 失败／Socket closed；agentskill.sh 首轮 200、复审 000；claudemarketplaces WebFetch socket hang up；skillcatalog.dev 只返回一句标语，目录需 JS；randomlabs.ai 只返回标题；skillbay.sh 可读分类但最新列表均为免费，定价与合作方细节未核。 |
| ClawHub／OpenClaw | 站内 Skill Defender／Skill Guard 详情页只读到搜索摘要与转载；ClawHub 页面显示 30 skills/12 plugins，与 arXiv 所称 66,157 个 Skill 的统计口径差异待核；huggingface.co/datasets/OpenClaw/clawhub-security-signals 返回 000／超时，数据集卡未读。 |
| 安全厂商原文 | Koi Security 的 ClawHavoc 原帖 301 跳转到 Palo Alto Cortex 营销页，原文未取；labs.snyk.io/experiments/skill-scan 与 resources 连接被关闭；koi.ai 的 ClawHavoc 原文现返回 Palo Alto 内容；huggingface.co/blog/zhongshsh/agent-skills-analysis TLS handshake 失败；proton.me/blog/ai-manifesto curl 000、WebFetch Socket closed；trymastro.com/study 与 gendigital.com/skill-scanner 404；theregister.com/2026/08/07/202614 实际是 2019 年英国移动网络满意度调查，与 Agent Plugins 1.0 报道不符。 |
| 官方规范／注册表全量 | 官方 MCP Registry 全量 API 与 GitHub MCP Registry 完整条目未拉取，只读 registry issue、ProtocolProbe 汇总和仓库首页示例；posthog.com/mcp/leaderboard 只返回导航；PyPI mcpwatchman 与 agent-audit-kit 返回 Client Challenge／loading error。 |
| Cursor／OpenAI 市场审核细则 | ChatGPT／Claude／Cursor 市场内部审核细则无公开完整文档，只能读提交者复盘与官方公告；Cursor 市场提交 502 与插件审核延迟只有用户自述与员工“发邮件”回复，未取得官方根因或状态页。 |
| 中文平台全文 | 36kr、CSDN、掘金、知乎、少数派只读到搜索摘要，未逐篇打开全文；微信、即刻未尝试。中文 Skill 项目据此只作线索，未作为已核实机制。 |
| Lobsters 搜索 | 站内 search.json 返回 Anubis「not a bot」校验页；只读到 newest/hottest/tag feeds 与 site: 摘要，未系统覆盖 2026 年近期讨论。 |
| WebFetch 域名策略 | 对 arxiv.org、owasp.org、www.air.security、blog.polyswarm.io、adversa.ai、modelcontextprotocol.io、vercel.com 等报安全校验失败；已改用 curl、arXiv export API 或原文页读取，属工具限制而非内容缺失。 |
| 定向链接复核（2026-11-03） | 首轮核对的 514 项中，6 项当前不可达：skillsmp.com 首页 403（该条标摘要，不引为已核）、3 个 HN item 000（49589914、49139845、49922729）、huggingface.co/datasets/cuhk-zhuque/SkillTrustBench 000、milvus.io 博客 403／302 循环。均不计为链接已核：skillsmp 与 SkillTrustBench 标摘要，3 个 HN item 的内容经 Algolia API 读条目与顶层评论，milvus 保留收集时读数；agentskill.sh 本轮 200、首轮复审曾 000，按 P6 摘要处理。 |
| 采集深度 | GitHub topic 只取 star 前 30–40，未翻完所有页；市场只读首页／快照；528 项均未安装、未运行、未调用；star 增长没有历史数据，未编造。 |

## 2. 最值得深挖的八个方向（含可试入口）

**排序只看三条：能否改变 a1dbv 现有判断（分发、授权、评测、成本）、是否有可实际试用入口、是否有真实消费者或公开回执而非只有作者宣传；三项越齐越靠前。** 这是“值得先核实”的顺序，不是效果或质量排名，也不代表已采用。§2 按主题合并同类候选（一个方向可含多个入口），§3 的 P1 表按单个条目列出，两者不是一一对应。

### 2.1 Skill 的分发正在从“复制文件”变成“锁版本＋审批＋权限”

**这一组最可能直接改写本仓对 Skill 分发的建议。** 已有做法是读作者窄 Skill、随依赖读取（TanStack Intent）或 dotfiles 复制；本轮出现的是把 Skill 当 npm 依赖管理的完整机制：默认不链接、安装要审批、锁文件固定 commit／子树哈希、安装时强制权限预算、随二进制版本分发。

- [pnpm Agent Skills](https://pnpm.io/agent-skills)（官方文档，pnpm v12.11.0）：包内 `skills/<name>/SKILL.md`，默认不链接，需 `pnpm approve`；`--prod` 跳过 devDependencies 技能；多版本时最高版本决定链接；自动链到 `.claude/.cursor/.agents/.github skills` 并写 `.gitignore`。
- [microsoft/apm](https://github.com/microsoft/apm)（微软官方，最新 v0.35.0／2026-10-22）：`apm.yml`＋锁文件＋`apm-policy.yml` 统一管理 skills／prompts／instructions／plugins／MCP，覆盖 9 类客户端（GitHub Copilot、Claude Code、Grok Build、Cursor、OpenCode、Codex、Gemini、Windsurf、Kiro），默认扫描隐藏 Unicode。
- [Quiver／qvr](https://github.com/try-agora/qvr)：`qvr.toml` 记意图，`qvr.lock` 固定 commit＋子树哈希并带扫描结果，支持约 60 个 agent 目标；与 [Camunda spm 0.11.0](https://github.com/camunda/spm-cli) 的 `ai.json/ai.lock` 是两种锁文件设计。
- [Tank](https://github.com/tankpkg/tank)：`skills.json` 声明网络／文件／子进程权限，`skills.lock` 带 SHA-512 与 0–10 审计分，安装时强制权限预算；补 spm 只做内容扫描的缺口。
- [packslip](https://packslip.dev)（v1 稳定）：Sigstore 签名发布清单，把与二进制版本匹配的 agent skills 一并分发；已被 mise 2026.10.9、Helmfile 1.8.1 采用。[mise 的消费端文档](https://mise.jdx.dev/dev-tools/packslip-resources.html) 按工具版本安装并支持 auto_sync/prune。
- [Grimoire](https://github.com/grimoire-rs/grimoire) 把 skill／rule／agent／MCP server／bundle／hook 打包成 OCI 制品并用 digest 锁版本，复用 GHCR／Docker Hub，与 Git 依赖模型形成两条路线。
- [capshelf](https://github.com/genged/capshelf)、[skulto](https://github.com/asteroid-belt/skulto)、[aix](https://github.com/a1st-dev/aix)、[rosie](https://github.com/rosieskills/rosie)、[crew](https://github.com/with-logic/crew) 是同一问题的其他实现：内容哈希／离线搜索＋安装前扫描／单 `ai.json`＋SHA-512／npm 式 lock／git-taps registry。

**实际消费者与回执。** packslip 有 mise 与 Helmfile 的采用记录；其余多为项目自述或小范围使用。没有取得“同一 Skill 经锁文件安装后行为与手工复制一致”的独立复跑，也没有跨 60 个 agent 的加载路径验证；理由中的“支持 N 个客户端”是作者声明，不是实测。

**正反反馈（摘要）。** 本轮未取到这批工具的 HN 原帖或 issue 讨论，社区正反为未知；[reptile.haus 的“Skill 是无锁依赖”](https://reptile.haus/journal/skills-files-dependencies-nobody-pinned-2026/) 从反面论证了锁文件与项目级隔离的必要性，[Vercel State of agent skills](https://vercel.com/blog/state-of-agent-skills) 则给出 registry 侧的规模与集中度（自报）。

**本仓差异。** `docs/05` 有“随依赖读取窄 Skill”（TanStack Intent）与安装前审查原则；`docs/10` 有 npm `install-scripts` 的按包审批。缺少的是“Skill 自身的锁文件、审批记录、权限声明和跨客户端投影”这一层，也缺少对 pnpm／apm／qvr／Tank 的横向比较。

**待核问题。** 各客户端真实加载路径是否与投影一致；默认不链接与 `approve` 的持久化语义；锁文件在分支／子目录／monorepo 下的粒度；权限预算是提示还是执行边界；`--prod` 与 devDependencies 技能的选择是否符合团队预期；60 个 agent 目标的维护成本。

### 2.2 “装了 Skill 有没有用”开始有可复算的评测方法

**这一组回答的是本仓目前只能用单次任务和小样本判断的问题。** 已有 `docs/22` 的评测原则与 SkillsBench 的公开任务，但缺少“技能是否被激活、去掉技能是否变差、竞争技能谁该生效”的工具化记录。

- [Caliper](https://github.com/edonadei/caliper)（PyPI `caliper-eval` 0.21.0，2026-11-02 仍更新，229★）：按技能真实安装位置跑同一任务，分开记录“是否被激活”与“是否成功”；`--ablate` 去掉技能做同题对照；可声明竞争技能并断言谁该生效；支持 Claude Code／Codex／Pi／Hermes。
- [skill-issue](https://github.com/Gjusev/skill-issue)：同一任务跑无 Skill 与有 Skill 两版，保留 verifier、trace、文件改动和 token／时间，并明确警告单次对比不足以宣称优势。
- [OpenAI harness-aware 插件评测法](https://developers.openai.com/cookbook/examples/partners/harness_aware_plugin_evals/harness_aware_plugin_evals)（2026-10-27）：同一语料分别跑纯工具、独立 function-call 循环、真实 Codex；示例从 5/5 降到 3/5、补 MCP server instructions 后回 5/5；重复运行 21% 单题翻转，说明只看单次通过率会误判。
- [Microsoft: Is your agent extension actually working?](https://developer.microsoft.com/blog/is-your-agent-extension-actually-working/)：baseline vs extension、5–10 次重复、discovery／selection／quality／composition 四阶段与成本对照。
- [OpenAI eval-skills](https://developers.openai.com/blog/eval-skills)：触发／不触发用例、JSONL trace、确定性检查与 rubric 评分的完整循环。
- [Vercel 的负面评测](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)：56% 的 eval 里 skill 从未被调用，AGENTS.md 索引 100% vs 默认 skill 53%——这是任何 Skill 方案都要面对的对照。
- [SkillsBench](https://github.com/benchflow-ai/skillsbench)（Apache-2.0，87 任务／8 领域，v1.1，约 1.9k★）：24 组模型／框架配对的技能前后成功率，是现成底座；本仓研究页已引用其任务，但未把它接成回归。

**实际消费者与回执。** Caliper 有 PyPI 发布与持续更新；skill-issue 是本地 harness；OpenAI／Microsoft／Vercel 是厂商自报的评测方法；SkillsBench 是公开基准。没有取得“Caliper 在真实仓库上复现出某个 Skill 的净增益”的独立记录。

**正反反馈（摘要）。** [SkillOpt](https://microsoft.github.io/SkillOpt/) 的 HN 讨论摘要指出结果图缺单位与基线，难以判断 9 点提升的含义；[codecut 的小实验](https://codecut.ai/agent-skills-bad-session-history/) 显示坏会话示例会压过 SKILL.md 规则。两者都说明“单次评测通过”不足以证明技能有效。

**本仓差异。** `docs/22` 有评测原则、`docs/13` 有单任务试用记录；缺少技能激活率、消融对照、竞争技能断言和 harness-aware 的重复运行。若只补一个工具，Caliper 的 `--ablate` 与“激活／成功”分开记录最贴近本仓现有做法。

**待核问题。** Caliper 的安装与运行成本；消融是否能控制模型非确定性；judge 评分与人工判断的一致性；SkillsBench 的任务是否可迁移到本仓真实仓库；21% 单题翻转在更多重复下是否收敛。

### 2.3 插件市场的签名正确，不等于分发安全

**这一组是“安装前审查”从原则变成具体攻击链的证据。** 本仓 `docs/10` 已有供应链事件与 lethal trifecta，但没有本轮这几起与 Skill／插件市场直接相关的案例。

- [Phorion 的 Cursor 扩展后门报告](https://phorion.io/blog/offical-claude-code-vsx-compromise/)（2026-10-30 发布、10-31 更新）与 [Cursor 官方公告](https://cursor.com/blog/claude-code-extension-security-notice)（2026-10-29）：`anthropic.claude-code` 2.1.312／2.1.313 在 Cursor Marketplace 被篡改，`extension.js` 前置恶意 IIFE，写入 Ed25519 公钥、建反向 SSH 隧道并做 LaunchAgent／cron／计划任务持久化；Phorion 未给安装量，Cursor 公告页也未列受影响用户数，“最多约 5,000 用户受影响”来自媒体转述，引用时须注明来源等级。卸载扩展不足以清除。
- [Zenity Labs 的 skills.sh 供应链活动](https://labs.zenity.io/post/attackers-target-agents-via-the-skill-supply-chain)（2026-08-06）：typosquat Paperclip／Browser Use，先上传干净副本过审，7-11 再改 setup 文档让 Agent 下载凭证窃取器；8-2 累计 170 万次安装（明确非独立用户），窃取 SSH、云、Git／包管理器、K8s／Docker、IaC 凭证。
- [Plugin4Shell](https://www.air.security/blog-posts/plugin4shell)（Air Security，2026-09-17）：插件 pin 的 40 位 SHA 可被同名分支覆盖，零点击 RCE，影响 Claude Code、Codex、GitHub Copilot、Gemini CLI；Claude Code 2.1.179 与 Codex 0.146.0 已修，Copilot 发布时未修。
- [TrustFall](https://adversa.ai/blog/trustfall-coding-agent-security-flaw-rce-claude-cursor-gemini-cli-copilot/)：提交 `.mcp.json` 加 `enableAllProjectMcpServers`，开发者接受文件夹信任时只需按一次 Enter（一键）即执行命令；CI headless 默认跳过信任对话，才是零交互执行。影响 Claude Code／Cursor／Gemini CLI／Copilot CLI。
- [AIR SkillJacking](https://www.air.security/blog-posts/skilljacking)：925 个依赖可被劫持的 skill、影响约 134K agent，并实际接管最热门的视频生成 skill，公开扫描器未检出。

**实际消费者与回执。** 这些条目都有厂商公告或独立安全厂商原文；Phorion 未给安装量，Cursor 公告页未列受影响用户数，媒体转述的“最多约 5,000 用户”未见一手确认，Zenity 的“170 万安装”明确不是独立用户。没有独立复现载荷或统计受影响用户。

**正反反馈（摘要）。** 正面证据是 Cursor 同日公告与 CSO Online 的独立报道；反面／限制是受影响用户数只有媒体转述（一手页面未列）、卸载不清理、部分扫描器未检出。对“官方签名是否足够”的结论是：签名只证明发布者身份，不证明分发链路未被篡改。

**本仓差异。** `docs/10` 的事件表未收 Cursor 扩展后门、Zenity skills.sh、Plugin4Shell、TrustFall、SkillJacking；`docs/13` 的供应链接口也没有这些条目。采用含义应写进“插件／Skill 安装前审查”：核发布者、核实际版本、核安装后持久化项、把宿主与凭据隔离，而不是只看市场页的 verified 标记。

**待核问题。** 实际受影响用户数与卸载后的残留；“最多约 5,000 用户”这一转述的原始出处；恶意版本的哈希与时间窗；哪些扫描器能检出；企业环境如何集中撤销。

### 2.4 单一扫描器不能当安装门禁

**这一组把“装前扫描”从勾选项降级为多层检查的一部分。** 本仓 `docs/10` 推荐 SkillSpector；本轮证据显示单款扫描器的漏报与误报都足以改变结论。

- [Adversa：8 个技能扫描器绕过实测](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/)（2026-07-30）：恶意技能绕过全部 8 个开源扫描器；在 4,000 个良性技能上没有扫描器优于“全部标红”。
- [Trail of Bits《The Sorry State of Skill Distribution》](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/)：四个 PoC 绕过 ClawHub、skills.sh（Gen／Socket／Snyk）和 Cisco skill-scanner，结论是不要把信任外包给扫描器；附可复现的 [overtly-malicious-skills](https://github.com/trailofbits/overtly-malicious-skills) 语料。
- [OWASP Agentic Skills Top 10](https://owasp.org/projects/agentic-skills-top-10)（v1.0-2026）：AST01–AST10 覆盖恶意 Skill、供应链妥协、过度权限、不安全元数据、不可信外部指令、弱隔离等，并提出 Universal Skill Format；[仓库版](https://github.com/OWASP/www-project-agentic-skills-top-10) 的 AST08 专门记录扫描器漏掉外部内容载荷的案例。
- [Snyk ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)：扫描 ClawHub 与 skills.sh 共 3,984 个 Skill（2026-02-05 快照），36.8% 至少一个问题、13.4% 严重——是多家扫描器共同引用的量化依据，但仍是单家扫描口径，且样本不限于单一市场。
- [ClawHub Security Signals（arXiv 2606.01494）](https://arxiv.org/abs/2606.01494)：67,453 个技能版本的扫描器一致性研究，三家全报警仅 0.69%，说明单扫描器门禁不可靠。
- [Faberlens](https://faberlens.ai/blog/skill-safety-problem)：200 个最流行技能全部通过静态扫描，但 87% 会悄然降低 agent 安全性，主张用行为测试而非只看静态扫描。
- [Gecko Security](https://www.gecko.security/blog/rce-in-your-test-suite-ai-agent-skills-bypass-skill-scanners)：把恶意代码藏进 `.agents/` 下会被测试运行器发现的测试文件，绕过只读 SKILL.md 与显式脚本的扫描器。
- [OASB](https://github.com/opena2a-org/oasb) 于 2026-08-09 撤回 F1／精确率等对比指标，因 3,704/3,881 良性样本是用 HackMyAgent 自己的输出标注的——这是基准自身的污染反例。
- [Aguara](https://github.com/garagon/aguara)（v0.28.0，Go 开源）：静态检查 skill、MCP 配置、Claude settings 与依赖锁文件，v0.28.0 目录含 258 条检测（192 条 YAML 规则＋66 条分析器检出）；README 明确分析在本地运行，不执行包、不上传内容、不调用 LLM。安装：`curl -fsSL https://raw.githubusercontent.com/garagon/aguara/v0.28.0/install.sh | VERSION=v0.28.0 sh`，然后 `aguara audit .`。
- [PlugVet](https://plugvet.com/)（独立目录，最新一批 2026-10-27）：对 15,739 个 Skill／插件／MCP 做 8 项自动卫生检查并公开等级与检查日，当前 A 2,713、B 8,463、C 3,335、D 1,228、无已发布 F，约 83% 至少一项发现。站点明示等级只是卫生检查、不是安全保证，免费目录等级自动生成且未人工复核。

**实际消费者与回执。** Adversa 与 Trail of Bits 是独立安全厂商／研究团队的实测；Snyk、Faberlens 是厂商自报，ClawHub Security Signals 是学术论文；Aguara 是开源工具的自述目录，PlugVet 是独立目录的自动分级数据（站点自报口径）；OASB 是公开基准但已自我撤回部分指标。没有一项被本仓复跑。

**正反反馈（摘要）。** 反方证据集中在“扫描器全绕过”“三家全报警 0.69%”“良性样本被标红”；正方是扫描器仍能提高下限，且 ClawHub 已上多路扫描（SkillSpector、腾讯朱雀 A.I.G、ClawScan）。结论应是“多扫描器＋行为测试＋来源与版本核对”，不是“扫描无用”。

**本仓差异。** `docs/10` 已收 SkillSpector 与 lethal trifecta，但没有 Adversa 八款实测、ToB 四个 PoC、ClawHub 一致性 0.69%、Faberlens 行为测试、Gecko 的测试文件绕过，也没有 Aguara／PlugVet 这两条可先跑起来的入口。采用含义：安装门禁要写明扫描器版本、语料、误报与人工复核路径。

**待核问题。** Adversa 的测试方法能否复现；各扫描器版本与规则更新；行为测试的最小可行集；误报对开发流的影响；OASB 撤回后还有哪些可用的公开基准。

### 2.5 Token 与上下文成本：数字比“MCP 税”的口号更有用

**这一组给“MCP vs Skill vs CLI”提供可复算的量级，但仍需按自己的配置重测。** 本仓 `docs/02/03/04` 有成本与上下文原则，缺本轮这些具体账单。

- [Quandri《MCP is dead?》](https://www.quandri.io/engineering-blog/mcp-is-dead)：4 个 MCP 共 77 工具、84,308 字符≈21,077 token，占 Claude 200K 上下文 10.5%；Linear 单 server 42 个工具里最长的 `save_issue` 约 619 token；文末更新称 Claude Code 延迟加载已削减 85%+ 上下文开销。
- [Two Token Bills](https://dev.to/mcptokensaver/two-token-bills-before-your-agent-answers-71929-for-mcp-tools-1109242-for-skills-53l2)（2026-10-01）：418 个 SKILL.md 合计 1,109,242 token，朴素加载 Skill 目录比 MCP 更贵；names-only 索引把 255 个工具从 71,929 降到 581 token。作者在推 mcptoon，数字用 tiktoken、样本来自单机，需自测。
- [MCP Token Cost：15 个工具砍到 4 个](https://dev.to/aws-builders/mcp-token-cost-i-cut-my-mcp-server-from-15-tools-to-4-cek)（2026-10-26，82 赞／96 评）：GitHub 官方 MCP 约 55,000 token、93 个工具定义；AWS server 从 15 工具降到 4、描述字符减 88%、测试问题调用 7→2、Kiro 工具预算 1.1%→0.8%；评论补充 provenance、分页截断、prompt caching 只降费用不降上下文等反例。
- [mcpgrade](https://tengli.dev/posts/mcp-servers-failing-agents.html)（2026-07-21）：24 条规则扫 36 个流行 MCP，11 个 D/F；未写参数说明是主要错误源（firecrawl 134 个错误中 132 个）；实时评测工具选择 100% vs 84%、越界拒绝 100% vs 50%。
- [Agent Extension Conflicts](https://agentpatterns.ai/patterns/anti-patterns/agent-extension-conflicts/)（2026-06-23）：每个 MCP 工具 550–1,400 token、多个 server 可超 30K；举例 turn 0 已占 143K/200K、只剩 57K；建议默认不装、按项目装、按组合成对评测。
- [mcp-compressor](https://github.com/atlassian-labs/mcp-compressor) 把任意 MCP server 包成只暴露 `get_tool_schema/invoke_tool` 的代理，支持压缩级别、TOON 输出与响应截断；[FastMCP Code Mode](https://gofastmcp.com/servers/transforms/code-mode)、[Cloudflare Code Mode](https://developers.cloudflare.com/agents/model-context-protocol/codemode/) 与 [Anthropic 的代码执行方案](https://www.anthropic.com/engineering/code-execution-with-mcp) 是同一问题的另三条路线。

**实际消费者与回执。** Quandri、aws-lean-mcp、mcpgrade 是作者实测／复盘；Two Token Bills 是单机样本；FastMCP／Cloudflare／Anthropic 是厂商文档与工程文。没有一项由本仓复跑，也没有统一的 tokenizer 口径。

**正反反馈（摘要）。** 正方可直接量出“多装几个 MCP 就吃掉一成上下文”；反方是 prompt caching 只降费用不降上下文、按字符计费不等于按 token 省、延迟加载可能已改变结论。数字应该用于设计自己的测量，而不是当跨工具排名。

**本仓差异。** `docs/04` 有 onlycodes 的历史对照与“先缩小原生查询”；`docs/03` 有 RTK／context-mode 的压缩位置；缺少 Skill 目录本身可能比 MCP 更贵的反例，也缺少 mcpgrade 这种“工具描述质量”检查表。

**待核问题。** 同一服务在不同客户端的 token 计数差异；延迟加载／按需发现的真实节省；TOON 等编码在中文与代码上的效果；压缩是否丢掉关键行；作者样本的代表性。

### 2.6 成熟团队把 Skill／MCP 当组织资产，而不是个人收藏

**这一组回答“真正落地的团队长什么样”，比单个 Skill 的质量更能校准本仓的团队采用建议。** 共同点是：统一入口、版本化、评审、扫描、按客户端投影，且都把“技能”与“连接／权限”分开。

- [microsoft/skills](https://github.com/microsoft/skills)：175 个 skills，另含 agents、AGENTS.md 模板与 MCP 配置；CI 两层——PR 上 mock 冒烟（skill 链接同步检查、typecheck、单测），夜间用 Copilot SDK 真跑并按 60 分阈值做 Ralph Loop 迭代。
- [NVIDIA Verified Agent Skills 治理流水线](https://developer.nvidia.com/blog/nvidia-verified-agent-skills-provide-capability-governance-for-ai-agents/)（2026-05-19）：source repo→review→scan→evaluate→skill card→sign→catalog→sync 八段；SkillSpector 扫隐藏指令／工具投毒，`skill.oms.sig` 覆盖全部文件，用户用 OpenSSF model_signing 验签；质量指标仍写作未来工作。[nvidia/skills](https://github.com/nvidia/skills) 是每日同步的“已验证”目录。
- [Trail of Bits claude-code-config](https://github.com/trailofbits/claude-code-config) 与 [codex-config](https://github.com/trailofbits/codex-config)：sandbox、权限、hooks、skills、MCP 全量公开；hooks 明确“不是安全边界，是结构化提示注入”，给出 PreToolUse 拦截、Stop 续跑、审计日志与 exit code 语义；codex-config 的 `/goal` 工作单契约把 Objective／Scope／Constraints／Validation／Stop／Checkpoints／Evidence 写死。
- [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) 与 [Cloudflare 的漏洞猎取 harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness)：六阶段审计＋`coverage-ledger.json`／`findings.json`＋零依赖 validator；公开数据为 128 仓、20,799 候选→7,245 actionable，验证拒绝率 40%→11%，高完整度发现 35%→58%（厂商单系统自报）。
- [Tencent/teamai-cli](https://github.com/Tencent/teamai-cli)：skills／rules／agents／learnings／models／MCP 统一版本化，push 走分支＋MR 评审，成员 pull 后由 session-start hook 自动同步；README 兼容表列 21 个 agent，可集中管控模型服务。
- [Uber 的内部 MCP gateway](https://newsletter.pragmaticengineer.com/p/ubers-ai-infra-from-the-inside)：从 Thrift／protobuf registry 自动生成 server、重写工具描述、把每个 MCP endpoint 投影成 CLI，并单列 Agent Skills repo（29:27/34:37）。
- [Every 的全公司共享 Agent](https://every.to/context-window/one-agent-for-the-whole-company)：Slack Agent 的成功工作流可保存为任何人可运行的 Skill；作者自报模型升级加代码修复后 11 个常见任务 token 成本降 80%+。
- [LiteLLM Skills Gateway](https://docs.litellm.ai/docs/skills_gateway.md)（2026-10-31，v1.107.0）与 [阿里云 MSE AI Registry](https://www.alibabacloud.com/help/en/mse/user-guide/ai-registry-skill-quick-start-guide)：企业内 Registry，前者用 `marketplace.json` ＋ `/plugin marketplace add`／`install` 分发并按 key／team 授权，后者有 Draft→Pending→Released、提交时注入／合规扫描、版本与标签、workspace 隔离、RAM 权限、单版本下线与回滚。

**实际消费者与回执。** Microsoft／NVIDIA／Trail of Bits／Cloudflare／Tencent／Uber／Every／LiteLLM／阿里云都是团队或厂商自述；Microsoft 的 CI 与 NVIDIA 的签名链有公开配置；Cloudflare 有量化数据但属单系统自报；没有独立审计或跨团队复跑。

**正反反馈（摘要）。** 正面是入口统一、可审计、可回滚；反面是维护成本、审核延迟与“官方目录不等于质量”——[reviewtimes.fyi](https://reviewtimes.fyi/claude-plugins) 记录 Claude 插件目录的决定中位 36 天（通常 14–53 天）、已批准样本的中位审批 14 天（Approved 11），[Gaia Skill Tree 的安装量审计](https://gaiaskilltree.com/meta/reports/2026-08-10-98-out-of-100-arent-good-enough.html) 发现 skills.sh 前 100 名里 73 个来自两个厂商捆绑。

**本仓差异。** `docs/18` 讲团队采用与 PR 准入，`docs/05` 讲插件打包，但没有 Microsoft 的双层 CI、NVIDIA 的签名治理、Cloudflare 的审计技能、Tencent 的 Git 资产仓库、Uber 的 MCP gateway 这些具体形态。采用时应把它们当“可借的组件”，不是整套照搬。

**待核问题。** 审核时长与维护人力；签名与目录同步的实际覆盖；session-start hook 的权限与失败恢复；企业 Registry 的离线／跨网能力；厂商自报数字的独立复现。

### 2.7 协议层的变化：Skill 可以作为 MCP 资源分发，交互式 UI 进入 MCP

**这一组决定“Skill 只能在本地目录”这个假设是否还成立。** 本仓 `docs/04` 已写 2026-07-28 无状态规范，但没有 MCP Apps 与 SEP-2640 这两条扩展。

- [MCP Apps 官方扩展（SEP-1865）](https://modelcontextprotocol.io/extensions/apps/overview) 与 [官方 ext-apps 仓库](https://github.com/modelcontextprotocol/ext-apps)：server 用 `ui://` 资源在宿主 sandbox iframe 中渲染表单、图表、播放器，工具结果分 `content` 与 `structuredContent`，不支持的宿主回退文本；官方客户端矩阵列 Claude、Claude Desktop、VS Code 的 GitHub Copilot、Microsoft 365 Copilot、Goose、Postman、MCPJam、Archestra，未列 ChatGPT，权限／CSP 由宿主决定。
- [SEP-2640 Skills Extension](https://modelcontextprotocol.io/seps/2640-skills-extension) 与 [参考实现 ext-skills](https://github.com/modelcontextprotocol/ext-skills)：已 Final，把技能作为 `skill://` 资源，定义 `skills/list`、`skills/get` 和文件摘要，已有 Python／C#／Go SDK 实现与宿主原型；[FastMCP 4.2 的 SkillCatalogProvider](https://gofastmcp.com/servers/skills) 是已可运行的实现，但其 URI 与发现方式仍与最终 SEP 不一致。
- [MCP 2026-07-28 稳定版规范](https://github.com/modelcontextprotocol/specification/releases/tag/2026-07-28)：移除 session、把 Tasks 改为可选扩展并增加网关友好的 `Mcp-Method`／`Mcp-Name` 头；直接影响现有 MCP 网关与 Skill 组合方式。
- [Agent Client Protocol（ACP）](https://agentclientprotocol.com) 与 [acpx](https://github.com/openclaw/acpx)：JSON-RPC over stdio 标准化编辑器／IDE 与编码 agent 的通信，acpx 为 30 个 ACP agent 提供统一会话、权限与机器可读输出。
- 注册表的现实分布：[ProtocolProbe: Registry vs Reality](https://protocolprobe.com/mcp/reports/registry-vs-reality) 核 2026-10-04 快照的 38,977 条，13.9% 至少一个问题（4,298 个仓库 404、663 个版本已弃用或 yank）；[mcpcost](https://github.com/ondraulehla/mcpcost) 2026-11-02 快照 53,396 个 server、58% alive；[ProtocolProbe 目录](https://protocolprobe.com) 对 54,988 条记录逐条只读探测。

**实际消费者与回执。** MCP Apps 与 SEP-2640 有官方规范与 SDK 实现；ACP 有 acpx 的 30 个 agent 适配；注册表数据来自独立探测项目。宿主实际支持矩阵未完整核实（agentskills.io/clients 与 agent-plugins.org 兼容页均未渲染）。

**正反反馈（摘要）。** 正方面是服务端分发与交互式 UI 让 MCP 不再只是“工具列表”；反方面是宿主支持不一致、SEP 与已运行实现的 URI 不一致、注册表条目大量失效。采用时应先核宿主支持，不把规范存在当能力可用。

**本仓差异。** `docs/04` 已有无状态规范与 Tasks 边界，但没有 MCP Apps、SEP-2640、ACP 与 registry 失效数据；`docs/13` 有 MCPorter 与 DSH，但不涉及服务端 Skill 分发。

**待核问题。** 哪些宿主真正支持 Apps 与 SEP-2640；FastMCP 实现与最终 SEP 的差异；`skill://` 的权限与版本语义；注册表失效对安装脚本的影响；ACP 与 MCP 的职责边界。

### 2.8 一个可带走的判断：先量“有没有被调用”，再谈“有没有变好”

**如果只带走一句话：Skill 的收益要分两层验——先确认它真的被加载／调用，再确认调用后结果更好。** 本轮多条证据都指向这一点：Vercel 的 56% 未调用、Caliper 把激活与成功分开、OpenAI 的 21% 单题翻转、codecut 的坏示例压过规则、Faberlens 的静态扫描通过但行为变差。它们不是同一实验，不能合成一个倍率，但共同说明“装了”与“有用”之间还有很长的链路。

**可执行的最小做法。** 同一真实任务跑两版（有／无该 Skill），保留 trace、文件改动、测试结果、token 与时间；重复 5–10 次；同时记录“技能是否被激活”和“原有关键约束是否保留”；不要只看单次通过率或代码行数。工具可选 Caliper 或 skill-issue，也可以先用现有测试和手工记录，不必先装一整套平台。

## 3. 完整候选（按优先级分层）

**分层规则。** P1 是本轮最值得先深挖的条目（判据见 §2，不是效果排名）；P2 是可装／可运行／可读的工具与做法；P3 是官方团队、厂商与真实消费者做法；P4 是安全与可靠性方面的真实问题、事故、反例与防护工具；P5 是目录、市场与索引；P6 是摘要、待核或低信号。同层按收集顺序排列，不代表名次。每条只保留原始链接与收集时的理由；理由里的日期／版本是收集者读到的，未写即未取得，未补猜。来源类型可由链接域名区分：`github.com` 为仓库或 issue，`arxiv.org` 为论文，`news.ycombinator.com` 为 HN，`forum.`／`community.` 为官方论坛，`docs.`／`developers.`／`learn.`／`modelcontextprotocol.io` 为官方文档，其余为作者博客、市场或项目站点。

**条目状态标记。** 每项末尾的〔〕是本轮能确认的状态：`〔新〕` 为本仓未见的新候选；`〔本仓已有：docs/xx〕` 表示 §4 已列为基线，本卡只核差异、不重复深挖；`〔摘要/待核〕` 表示只读到搜索摘要或入口待核，不能当机制或采用依据；`〔转 XX 卡〕` 表示归属其他卡的同一簇，本卡不深挖；`〔跨卡：…已覆盖基线〕` 表示另有产物已覆盖，本卡只留链接。除理由里已写明消费者／采用记录／正反反馈者外，每项的“实际消费者”“正反反馈”“本仓差异”本轮均未取得（按未知处理，不逐条补猜）；作者自报数字按原文保留，不等同实测。

**P1 · 最值得先深挖（47 项）**


- **[Agent Plugins 1.0（跨厂商插件打包标准）](https://agent-plugins.org/)**（[规范仓库](https://github.com/agentplugins/agent-plugins-spec)） — 1.0.0 跨宿主插件标准：根 plugin.json + skills/ + mcp.json + 反向域名扩展命名空间，初始 TSC 含 Amazon、Cursor、Microsoft、OpenAI、Vercel。把插件从单宿主约定提升为可移植格式，是理解 Claude/Codex/Cursor 清单趋同的基准；同一标准的规范仓库已发布 1.0.0、1.1.0 为草案，讨论区在议 portable subagents、签名 provenance 与免 git 的 HTTP marketplace。兼容客户端页未读到具体清单，采用情况待核。 〔新〕
- **[pnpm Agent Skills（依赖包随包交付技能）](https://pnpm.io/agent-skills)**（v12.11.0） — pnpm v12.11.0 原生支持包内 skills/<name>/SKILL.md：默认不链接，需 pnpm approve；--prod 跳过 devDependencies 技能；多版本时最高版本决定链接；自动链到 .claude/.cursor/.agents/.github skills 并写 .gitignore。把 Skill 变成有供应链、审批与版本选择的依赖，是本轮最可落地的分发机制。 〔新〕
- **[microsoft/skills](https://github.com/microsoft/skills)** — 微软官方 Azure/Foundry 技能库，README 现为 175 个 skills，另含 agents、AGENTS.md 模板与 MCP 配置；CI 分两层：PR 上 mock 冒烟（skill 链接同步检查、typecheck、单测），夜间用 Copilot SDK 真跑并按 60 分阈值做 Ralph Loop 迭代。技能质量门禁的可抄样本。 〔新〕
- **[NVIDIA Verified Agent Skills 治理流水线（作者文）](https://developer.nvidia.com/blog/nvidia-verified-agent-skills-provide-capability-governance-for-ai-agents/)**（2026-05-19） — 2026-05-19 作者文给出 8 段验证链：source repo→review→scan→evaluate→skill card→sign→catalog→sync；SkillSpector 扫隐藏指令/工具投毒，skill.oms.sig 覆盖全部文件，用户用 OpenSSF model_signing 验签。质量指标仍写作未来工作，未给评估数字。 〔新〕
- **[Trail of Bits claude-code-config](https://github.com/trailofbits/claude-code-config)** — Trail of Bits 的 Claude Code 团队默认配置：sandbox、权限、hooks、skills、MCP 全量公开；hooks 部分明确“不是安全边界，是结构化提示注入”，给了 PreToolUse 拦截、Stop 续跑、审计日志与 exit code 语义。安全团队真实在用的配置，比单篇最佳实践完整。 〔新〕
- **[cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)** — Cloudflare 官方安全审计 Skill：六阶段（侦察→覆盖台账→候选验证→结构化输出→独立复核→报告），产出 coverage-ledger.json 与 findings.json，并用零依赖 validator 校验；强调 fresh verifier 与 additive runs。是“技能编排多 agent + 可机读验收”的完整公开实现。 〔新〕
- **[Cloudflare 漏洞猎取 harness（作者文）](https://blog.cloudflare.com/build-your-own-vulnerability-harness)**（2026-06-18） — 2026-06-18（7-15 修订）给出该体系规模化数据：128 仓、20,799 候选→7,245 actionable，验证拒绝率 40%→11%，高完整度发现 35%→58%，并记录 Semgrep 一个月零调用。少见的“技能+验证器”公开量化，但属厂商单系统自报。 〔新〕
- **[Tencent/teamai-cli](https://github.com/Tencent/teamai-cli)** — 腾讯官方开源的团队 AI 资产 Git 仓库：skills/rules/agents/learnings/models/MCP 统一版本化，push 走分支+MR 评审，成员 pull 后由 session-start hook 自动同步；README 兼容表列 21 个 agent，可集中管控模型服务。团队分发层的新样本，实际同步与权限行为需核。 〔新〕
- **[google/elephant-goldfish-model（Elephant/Goldfish 规格插件）](https://github.com/google/elephant-goldfish-model)** — Google 内部数千工程师使用的开源插件：Elephant 带完整项目上下文起草规格，Goldfish 零上下文子 Agent 专门反证未写明的前提。本仓 05/07 讲 spec 与评审分离，但没有这种“双上下文角色”的可安装实现；官方来源，适合需要设计决策的功能，小 bug 不必用。 〔新〕
- **[morluto/rea（REA 逆向工程 MCP）](https://github.com/morluto/rea)** — 把二进制、应用行为和运行时逆向做成一个 MCP（npm rea-agents），让 Agent 从“看到功能”追到二进制层。本仓只有 DebugMCP 与 native-symbol-triage 的符号排障，没有逆向工程入口；42.2万★、2026-04 建、11-02 仍活跃，是当前该 topic 第一。 〔新〕
- **[Cursor Marketplace 上的 Claude Code VS Code 扩展被植入 SSH 后门（Phorion 事件报告）](https://phorion.io/blog/offical-claude-code-vsx-compromise/)**（2026-10-30） — 2026-10-30 发布、10-31 更新的一线事件报告：扩展 2.1.312/2.1.313 在 Cursor Marketplace 被篡改，extension.js 前置恶意 IIFE，写入 Ed25519 公钥、建反向 SSH 隧道并做 LaunchAgent/cron/计划任务持久化；Phorion 未给安装量，卸载不足以清除。Cursor 同日公告见 cursor.com/blog/claude-code-extension-security-notice；这是插件市场信任模型最具体的反例。 〔新〕
- **[Zenity Labs：skills.sh 上 170 万安装的恶意 Skill 供应链活动](https://labs.zenity.io/post/attackers-target-agents-via-the-skill-supply-chain)**（2026-08-06） — 2026-08-06 厂商一手研究：typosquat Paperclip/Browser Use，先上传干净副本过审，7-11 再改 setup 文档让 Agent 下载凭证窃取器；8-2 累计 170 万次安装（明确非独立用户），窃取 SSH、云、Git/包管理器、K8s/Docker、IaC 凭证。CSO Online 2026-08-07 有独立报道；可作 Skill 安装前审查的最强动机。 〔新〕
- **[MCP Token Cost：把 MCP Server 从 15 个工具砍到 4 个](https://dev.to/aws-builders/mcp-token-cost-i-cut-my-mcp-server-from-15-tools-to-4-cek)**（2026-10-26） — 2026-10-26，82 赞/96 评的实测复盘：GitHub 官方 MCP 约 55,000 token、93 个工具定义；作者把 AWS server 从 15 工具降到 4、描述字符减 88%、测试问题调用 7→2、Kiro 工具预算 1.1%→0.8%。评论补充 provenance、分页截断、prompt caching 只降费用不降上下文等反例，正反都值得读。 〔新〕
- **[Two Token Bills：MCP 工具 71,929 token vs 418 个 SKILL.md 1,109,242 token](https://dev.to/mcptokensaver/two-token-bills-before-your-agent-answers-71929-for-mcp-tools-1109242-for-skills-53l2)**（2026-10-01） — 2026-10-01 的量化反例：朴素加载 Skill 目录比 MCP 更贵（418 个 SKILL.md 合计 1,109,242 token）；names-only 索引把 255 个工具从 71,929 降到 581 token。作者在推 mcptoon，数字用 tiktoken、样本来自单机，需自测；但它纠正了「Skill 一定比 MCP 省」的直觉。 〔新〕
- **[MCP is dead?（Quandri 工程博客）](https://www.quandri.io/engineering-blog/mcp-is-dead)** — 2026-05 原文（HN 05-29，400 分/410 评）实测 4 个 MCP 共 77 工具、84,308 字符≈21,077 token，占 Claude 200K 上下文 10.5%，Linear 单 server 42 个工具里最长的 save_issue 约 619 token；主张 CLI + 按需 Skill，文末更新称 Claude Code 延迟加载已削减 85%+ 上下文开销，正反同页。 〔新〕
- **[I graded 36 popular MCP servers on agent usability（mcpgrade）](https://tengli.dev/posts/mcp-servers-failing-agents.html)**（2026-07-21） — 2026-07-21 非作者实测（HN 32 分）：用 24 条规则的 Lighthouse 式评分卡扫 36 个流行 MCP，11 个 D/F；未写参数说明是主要错误源（firecrawl 134 个错误中 132 个），实时评测工具选择 100% vs 84%、越界拒绝 100% vs 50%。属时点快照与作者自定规则，不是协议合规检查，但可直接当选 MCP 的检查表。 〔新〕
- **[Agent Extension Conflicts：安装的 Skill 与 MCP 互相打架](https://agentpatterns.ai/patterns/anti-patterns/agent-extension-conflicts/)**（2026-06-23） — 2026-06-23 复核的反模式页：把 context-budget contention（每个 MCP 工具 550–1,400 token、多个 server 可超 30K）、词汇碰撞、静默指令冲突拆开，举例 turn 0 已占 143K/200K、只剩 57K；建议默认不装、按项目装、按组合成对评测。补仓内缺少的「扩展冲突」诊断视角。 〔新〕
- **[Uber's AI infra, from the inside（Pragmatic Engineer）](https://newsletter.pragmaticengineer.com/p/ubers-ai-infra-from-the-inside)**（2026-10-14） — 2026-10-14 播客/文字页，Uber 杰出工程师 Uday Kiran Medisetty：内部 MCP gateway 从 Thrift/protobuf registry 自动生成 server、重写工具描述、把每个 MCP endpoint 投影成 CLI，并单列 Agent Skills repo（29:27/34:37）。是企业内 MCP 网关 + Skill 市场形态的真实消费者；页面只给摘要与时间戳，具体数字需回原音轨核实。 〔新〕
- **[One Agent for the Whole Company（Every 通讯）](https://every.to/context-window/one-agent-for-the-whole-company)**（2026-10-11） — 2026-10-11 通讯：全公司共享的 Slack Agent，成功工作流可保存为任何人可运行的 Skill；作者自报模型升级加代码修复后，11 个常见任务的 token 成本降 80%+。是「Skill 作为组织记忆与分发单元」的消费者样本，成本为自报。 〔新〕
- **[SkillOpt：Agent Skills 的训练/优化循环（Microsoft）](https://microsoft.github.io/SkillOpt/)**（2026-09-24） — 2026-09-24 HN 11 分；微软把 Skill 当可训练对象做迭代优化。HN 评论指出结果图缺单位与基线、难以判断 9 点提升的含义；说明「自动优化 Skill」仍缺可复算证据（本次仅读 HN 页与评论）。 〔新〕
- **[Caliper（Skill/MCP/规则的 pass@k 与消融评测）](https://github.com/edonadei/caliper)**（2026-11-02） — 按技能真实安装位置跑同一任务，分开记录“是否被激活”与“是否成功”，支持 --ablate 去掉技能做同题对照、声明竞争技能并断言谁该生效；PyPI caliper-eval 0.21.0，支持 Claude Code/Codex/Pi/Hermes，2026-11-02 仍在更新（229★），补本仓“装了 Skill 是否有用”的评测缺口。 〔新〕
- **[PlugVet（插件/Skill/MCP 卫生评级目录）](https://plugvet.com/)**（2026-10-25） — 独立目录对 15,739 个 Skill/插件/MCP 做 8 项自动检查并公开等级与检查日；2026-10-25 快照中 13,739 个有 83.0% 至少一项发现，MCP server 无发现率 12.6%、Skill 21.8%，适合装前快速筛查；作者明确等级只是卫生检查，不是安全保证，F 级不下架只人工复核。 〔新〕
- **[Plugin4Shell（插件 SHA pin 绕过）](https://www.air.security/blog-posts/plugin4shell)**（2026-09-17） — Air Security 2026-09-17 披露的零点击 RCE：插件 pin 的 40 位 SHA 可被同名分支覆盖，影响 Claude Code、Codex、GitHub Copilot、Gemini CLI；Claude Code 2.1.179 与 Codex 0.146.0 已修，Copilot 发布时未修，Gemini CLI 已弃用。 〔新〕
- **[Camunda spm 技能包管理器](https://github.com/camunda/spm-cli)** — 0.11.0 用 ai.json/ai.lock 把 Skill 固定到 commit，按 Claude/Codex/Copilot/Cursor 等客户端投影且产物 gitignore，形成“node_modules 式”可复现安装；目前小范围使用，各客户端加载路径假设仍需逐个核。 〔新〕
- **[OpenAI harness-aware 插件评测法](https://developers.openai.com/cookbook/examples/partners/harness_aware_plugin_evals/harness_aware_plugin_evals)**（2026-10-27） — 2026-10-27 的三层评测：同一语料分别跑纯工具、独立 function-call 循环、真实 Codex，示例从 5/5 降到 3/5、补 MCP server instructions 后回 5/5；重复运行 21% 单题翻转，说明只看单次通过率会误判。 〔新〕
- **[Cursor 市场 Trojanized Claude Code 扩展事件](https://cursor.com/blog/claude-code-extension-security-notice)**（2026-10-29） — 2026-10-29 Cursor 扩展市场约 11 小时内分发被篡改的 anthropic.claude-code 2.1.312/2.1.313；媒体转述称最多约 5,000 用户受影响（Cursor 公告页未列该数字），载荷写入 svc-telemetry SSH key、反向隧道与多平台持久化；说明“发布者签名正确”仍不等于供应链安全，且卸载扩展不足以清除，插件/Skill 市场应把宿主与凭据隔离纳入采用条件。 〔新〕
- **[OWASP Agentic Skills Top 10（AST10）](https://owasp.org/projects/agentic-skills-top-10)** — OWASP Incubator 的 1.0-2026 文档把恶意 Skill、供应链妥协、过度权限、不安全元数据、不可信外部指令、弱隔离等列为十类风险，并提出 Universal Skill Format；适合给现有的 Skill 安装、审查与权限流程补一套威胁模型，而不是只依赖 README 自述。 〔新〕
- **[Microsoft Skill Recorder](https://github.com/microsoft/skill-recorder)** — 桌面应用录下屏幕操作、应用切换、终端输出与可选语音，再用 GitHub Copilot CLI 还原成 intent + 有序步骤，一键生成 SKILL.md 或定时 Automation，并优先使用 Agent 原生工具而非回放点击；把“写 Skill”变成“演示一次”，但本地采集范围与 Copilot 依赖需要单独核。 〔新〕
- **[Fastbrowse（浏览器 Agent 的 CLI/MCP/Skill）](https://github.com/agent-labs-dev/fastbrowse)**（2026-10-30） — 2026-10-30 Show HN 的 beta 浏览器 Agent：把页面索引成实际存在的控件让 choice model 选择而非生成选择器，每条结论引用页面原文，提交/支付/删除等动作由代码拦截；同时提供 CLI、Python/Node/Go SDK、MCP server 与 coding-agent skill，作者自报 46 任务 99.2% vs 96.3%、每次 $0.0296，适合补网页验收入口。 〔新〕
- **[Reason Network（团队 Agent 间通信）](https://github.com/reason-machines/reason-network)**（2026-10-16） — 每台机器一个小 daemon，把团队所有 Claude Code、Codex、Cursor、Gemini CLI 等会话登记进 E2E 加密的 P2P 网络，Agent 通过 MCP 的 list_team/send_message/ask_user/check_inbox 直接找队友的 Agent；2026-10-16 建库，展示“Agent 间协作”超出本机多 Agent 的形态，但账号、信任与数据边界需先核。 〔新〕
- **[MCP Apps 官方扩展](https://modelcontextprotocol.io/extensions/apps/overview)** — 官方 MCP 扩展（SEP-1865）让 server 用 `ui://` 资源在宿主 sandbox iframe 中渲染表单、图表、播放器，工具结果分 content 与 structuredContent，不支持的宿主仍回退文本；官方客户端矩阵为 Claude、Claude Desktop、VS Code 的 GitHub Copilot、Microsoft 365 Copilot、Goose、Postman、MCPJam、Archestra，未列 ChatGPT，适合需要交互确认或可视化的 MCP server，但权限/CSP 由宿主决定。 〔新〕
- **[SEP-2640 Skills Extension（MCP）](https://modelcontextprotocol.io/seps/2640-skills-extension)** — 已 Final 的 MCP 技能扩展：把技能作为 `skill://` 资源提供，定义 `skills/list`、`skills/get` 和文件摘要，已有 Python/C#/Go SDK 实现与宿主原型，是本地技能目录之外的服务器分发方案。 〔新〕
- **[Adversa：8 个技能扫描器绕过实测](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/)**（2026-07-30） — 2026-07-30 的独立实测让恶意技能绕过全部 8 个开源扫描器，并在 4,000 个良性技能上发现没有扫描器优于“全部标红”，是评估扫描器时的关键反例。 〔新〕
- **[Microsoft APM（Agent Package Manager）](https://github.com/microsoft/apm)** — 微软官方的 agent 依赖管理器，用 apm.yml + 锁文件 + apm-policy.yml 统一管理 skills/prompts/instructions/plugins/MCP，覆盖 9 类客户端并默认扫描隐藏 Unicode，是本组之外最像“企业级 npm for agents”的可试用入口（已有 v0.35.0 正式 release，2026-10-22）。 〔新〕
- **[packslip](https://packslip.dev)** — Jeff Dickey 与 aqua 作者做的 Sigstore 签名发布清单 v1，把与二进制版本匹配的 agent skills 一并分发，已被 mise 2026.10.9、Helmfile 1.8.1 等采用，是“Skill 随工具发行”的另一种分发路径。 〔新〕
- **[capshelf](https://github.com/genged/capshelf)** — 把 skills、subagents、settings、MCP、插件放在独立 Git 仓库并让每个项目按内容哈希钉版本，支持漂移 diff、promote 和 CI 检查，直接补上 Skill 无锁文件、静默漂移的缺口。 〔新〕
- **[Microsoft: Is your agent extension actually working?](https://developer.microsoft.com/blog/is-your-agent-extension-actually-working/)** — 给出 baseline vs extension、5–10 次重复、discovery/selection/quality/composition 四阶段与成本对照的评测方法，是 mastykarz“工具应随模型变小”文章的实证姊妹篇。 〔新〕
- **[grith](https://github.com/grith-ai/grith)** — 在 OS syscall 层拦 Claude Code/Codex/Aider/Cursor 等，按评分执行 allow/queue/deny 并提供 11 个 agent profile，是 Skill 权限清单之外真正执行边界的一层（当前 Linux x86_64/aarch64 可用）。 〔新〕
- **[Trail of Bits《The Sorry State of Skill Distribution》](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/)** — 用四个 PoC 绕过 ClawHub、skills.sh（Gen/Socket/Snyk）和 Cisco skill-scanner，结论是不要把信任外包给扫描器；附可复现的 overtly-malicious-skills 测试仓库。 〔新〕
- **[Quiver / qvr（锁文件优先的 Skill 包管理器）](https://github.com/try-agora/qvr)** — 由 Camunda spm 的“技能包管理器”线索顺藤找到的直接替代品：qvr.toml 记意图、qvr.lock 固定 commit+子树哈希并带扫描结果，支持约 60 个 agent 目标，可对照 spm 的 ai.json/ai.lock 设计。 〔新〕
- **[Tank（安全优先的 Skill 注册表与包管理器）](https://github.com/tankpkg/tank)** — 同为 spm 生态竞品，skills.json 声明网络/文件/子进程权限、skills.lock 带 SHA-512 与 0–10 审计分，安装时强制权限预算，正好补 spm 只做内容扫描的缺口。 〔新〕
- **[skill-issue（成对 A/B 评 Skill 的本地 harness）](https://github.com/Gjusev/skill-issue)** — 直接回应“Skill 到底有没有用”：同一任务跑无 Skill 与有 Skill 两版，保留 verifier、trace、文件改动和 token/时间，明确警告单次对比不足以宣称优势，适合作为本仓 Skill 试用方法。 〔新〕
- **[OpenAI：eval-skills（skill 评估方法）](https://developers.openai.com/blog/eval-skills)** — 官方给出触发/不触发用例、JSONL trace、确定性检查与 rubric 评分的完整循环，补“怎么证明 skill 有用”的测量方法。 〔新〕
- **[NVIDIA OpenShell（agent 运行时沙箱）](https://github.com/NVIDIA/OpenShell)** — 内核级策略执行加策略变更形式化验证，凭据只注入到批准端点，补 skill 执行层的隔离与权限控制。 〔新〕
- **[TrustFall（项目级 MCP 一键 RCE）](https://adversa.ai/blog/trustfall-coding-agent-security-flaw-rce-claude-cursor-gemini-cli-copilot/)** — Adversa 披露提交 .mcp.json 加 enableAllProjectMcpServers 后，开发者接受文件夹信任时按一次 Enter（一键）即执行命令；CI headless 默认跳过信任对话，才可零交互。影响 Claude Code/Cursor/Gemini CLI/Copilot CLI。 〔新〕
- **[AIR SkillJacking](https://www.air.security/blog-posts/skilljacking)** — 发现 925 个依赖可被劫持的 skill、影响约 134K agent，并实际接管最热门的视频生成 skill，公开扫描器未检出。 〔新〕
- **[Vercel：AGENTS.md 与 skills 的对照评测](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)** — HN 高赞讨论反复引用的反例：56% 的 eval 里 skill 从未被调用，AGENTS.md 索引 100% vs 默认 skill 53%，是评估任何 skill 方案必须面对的负面证据。 〔新〕


**P2 · 可装／可运行／可读的工具与做法（268 项）**

- **[Claude Code Mods（TypeScript 插件行为）](https://github.com/anthropics/claude-code/tree/main/mods)** — 2.1.287 起 Mods 让插件行为写在 TypeScript hooks 模块（register(on, options)），内置 diff、telemetry、agents-md、sec-default 四个完整插件，并带 claude plugin test 测试框架与类型声明。比纯 markdown Skill 深一层，可打包组织策略与可执行行为；需同时核版本、权限与管理设置边界。 〔新〕
- **[Trail of Bits calcifier](https://github.com/trailofbits/calcifier)** — 把 SKILL.md 转成可读可跑的 Python 工作流：文件选择、调用 agent 判断、校验结果、写报告都变成显式控制流。适合反复运行的评审/分诊/报告类技能，减少每次让模型重编排步骤的成本；探索型任务仍用原 Skill。 〔新〕
- **[trailofbits/skills](https://github.com/trailofbits/skills)** — Trail of Bits 安全技能/插件市场（40+ 插件，CC BY-SA 4.0），README 明确 Codex 可直接安装 Claude 插件市场，是两类宿主清单趋同的一手证据；同组织另有 skills-curated 做社区审核。 〔新〕
- **[Claude-BugHunter（OffSec 博客介绍）](https://github.com/elementalsouls/Claude-BugHunter)**（2026-10-09） — 83 技能/15 命令的安全测试包，OffSec 博客 2026-10-09 专文介绍；四层方法论+确定性 engine 按攻击面路由，除 slash/engine 外可移植。适合看大规模领域技能如何分层与路由，但其范围明确排除内网 AD、C2、后渗透等。 〔新〕
- **[DietrichGebert/ponytail（“最懒资深工程师”Skill）](https://github.com/DietrichGebert/ponytail)** — 用一条行为约束让 Agent 少写、先删后加（“He says nothing. He writes one line.”）。本仓 13/decisions/codex-overengineering 记录的是过度工程问题，但缺一个可直接装的对照 Skill；适合拿同一个需求比较“少写”是否减少返工，而非只看代码行数。 〔转 AGENT-CONFIG，本卡不深挖〕
- **[JuliusBrussee/caveman（少读少说的 Token Skill/代理）](https://github.com/JuliusBrussee/caveman)** — 通过 Skill+代理让 Agent 输出与读取都更短、代码保持精确；作者自报 33.2% 输入 token 下降、54% 成本下降（单方数据）。本仓已试 RTK、context-mode、headroom 同题，缺“输出侧压缩”这一路线，可用同一批命令对照是否丢失诊断。 〔新〕
- **[headroomlabs-ai/headroom（上下文压缩层）](https://github.com/headroomlabs-ai/headroom)** — 在请求送模型前压缩工具输出、日志、文件和 RAG 块，作者给出 55,957→24,340 token 的示例并称 coding agent 少 20% token。本仓 03/13 的 RTK 与 context-mode 处理终端/检索侧，headroom 处理上下文层，适合比较压缩位置不同是否影响关键行保留。 〔新〕
- **[mvanhorn/last30days-skill（近 30 天跨平台调研 Skill）](https://github.com/mvanhorn/last30days-skill)** — 让 Agent 跨 Reddit、X、YouTube、HN、Polymarket 和网页做近 30 天主题调研并综合，直接补本仓 M6 的社区检索入口（当前靠手工/API）。注意它依赖外部平台可达性与检索质量，作者称其为“搜人不搜编辑”的 agent 搜索引擎。 〔新〕
- **[multica-ai/andrej-karpathy-skills（Karpathy 四条编码约束）](https://github.com/multica-ai/andrej-karpathy-skills)** — 把 Karpathy 对 LLM 编码陷阱的公开观察压成一份 CLAUDE.md 的四条行为约束，周趋势且被 awesome-claude-code 放进 Start Here。本仓 03/05 讲指令写法与过度指导，未收这份具体短契约；适合作为“短指令是否改变行为”的低成本对照。 〔转 AGENT-CONFIG，本卡不深挖〕
- **[nextlevelbuilder/ui-ux-pro-max-skill（UI/UX 规则库 Skill）](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)** — 14.4万★ 的 UI/UX Skill：192 条推理规则、79 种可检索 UI 风格，带 Python 检索脚本。本仓设计类条目多为单篇提示或整页生成，缺“风格库+规则检索”的形态；可与 Hallmark/Impeccable 比较规则检索是否真的改善产物。 〔新〕
- **[Nutlope/hallmark（反 AI 味设计 Skill）](https://github.com/Nutlope/hallmark)** — Together AI 出品的周趋势第一设计 Skill：50 套主题材质、按访问者任务搭页、在真实浏览器里按门禁 lint（对比度、焦点、减少动效、手机布局）。本仓设计条目未收“主题库+浏览器门禁”的组合；作者宣称能避免 AI slop，需用真实页面复核。 〔新〕
- **[pbakaus/impeccable（设计词汇 Skill）](https://github.com/pbakaus/impeccable)** — 给编码 Agent 一套设计操作词（polish、bolder、critique、audit），先拦截 AI slop 再改页面，10万★、周趋势。与本仓 GPT with Taste 的“文字偏好”不同，它把设计审查拆成可调用动作；适合对照“词汇控制”与 Hallmark 的“主题目录”哪条更可复现。 〔新〕
- **[Leonxlnx/taste-skill（视觉品味 Skill）](https://github.com/Leonxlnx/taste-skill)** — 给编码 Agent 注入艺术指导、参考图和浏览器检查的“品味”Skill，10.8万★，skills.sh 单 Skill 安装约 72 万。本仓 GPT with Taste 只管文字风格，未收视觉方向；它可作为“设计输入”与“设计审查”之间的样本。 〔新〕
- **[jakubkrehel/skills（界面细节 Skill 组）](https://github.com/jakubkrehel/skills)** — interfaces.dev 作者的一组可分别调用的 UI/排版/颜色/无障碍/布局/文案 Skill，周趋势。本仓设计 Skill 多为整页生成，缺可按“只查无障碍”或“只查排版”调用的细粒度层；适合与单一大 Skill 对比误触发与上下文成本。 〔新〕
- **[cathrynlavery/diagram-design（编辑级图表 Skill）](https://github.com/cathrynlavery/diagram-design)** — 45 种图表，输出单文件 HTML+SVG，强调品牌化与无阴影/无 Mermaid 味，6.4万★。本仓已有 Archify 的交互解释，这条是“可交付静态图”的另一端；可比较两者在真实架构图上的可读性与修改成本。 〔新〕
- **[heygen-com/hyperframes（HTML 写视频的 Agent 框架）](https://github.com/heygen-com/hyperframes)** — 用 HTML/CSS 写视频、为 Agent 提供渲染与动画管线的框架，7.8万★，在 skills.sh 安装量前 10 中占 5 席。本仓媒体生成只到图片/游戏资产，未收视频合成 Skill；适合评估“代码生成视频”对演示/素材管线的价值，注意渲染依赖与商用条款。 〔新〕
- **[Egonex-AI/Understand-Anything（交互式代码知识图谱）](https://github.com/Egonex-AI/Understand-Anything)** — 把代码库、文档、知识库变成可探索、可提问的交互式知识图谱，9万★。与本仓已试 Graphify 同类，但它强调“图能教学”和问答，不只导航；可对照两者在陌生仓库定位与错误边上的差异。 〔新〕
- **[MemPalace/mempalace（本地逐字记忆系统）](https://github.com/MemPalace/mempalace)** — 本地优先、逐字存储、可插拔后端的 AI 记忆系统，作者自报 LongMemEval 96.6% R@5 且零 API 调用，6万★。本仓 03/04 只评估过 Graphiti/Hippo 的时态与退役问题，缺这一实现；需核“逐字存储”与检索命中是否真的对应当前事实。 〔新〕
- **[OthmanAdi/planning-with-files（崩溃可恢复的文件计划）](https://github.com/OthmanAdi/planning-with-files)** — 把长任务计划落成崩溃可恢复的 Markdown 文件、会话中断后可续，2.8万★。本仓 20 讲恢复包与版本化记录，且 10-21 审计曾把它列为待读；这条正好补“计划即文件”的具体 Skill 形态。 〔新〕
- **[HarnessRouter/harnessrouter（harness 作为后端的统一接口）](https://github.com/HarnessRouter/harnessrouter)** — 把 Codex、Claude Code 等 harness 变成可插拔 agent 后端的统一接口，2026-08 新建、3.9k★。本仓 16/21 讲自建 agent 与 harness engineering，但没有“harness 是后端、产品只调接口”的抽象层；适合评估自建 agent 产品的复用边界。 〔新〕
- **[microsoft/TokenEconomizer（黑盒成本控制研究实现）](https://github.com/microsoft/TokenEconomizer)** — 微软研究院的“经验驱动黑盒成本控制”，在不改 Agent 的情况下按历史选择模型/预算，2026-10 新建、4.4k★。本仓 02 讲成本与分档，但缺这个研究级实现；需核其收益是否来自任务降级与失败重试的转移。 〔新〕
- **[google-research/harness2（递归 harness 研究框架）](https://github.com/google-research/harness2)** — Google Research 的 Harness²：面向开放世界的递归 agent harnessing 框架，2.2万★、2026-10 新建。本仓 16/21 与 13 都在讨论 harness 是否会内化，这条提供可运行的研究实现，适合作为“harness 自优化”的观察入口而非生产默认。 〔新〕
- **[code-yeongyu/oh-my-openagent（OmO 多模型编排）](https://github.com/code-yeongyu/oh-my-openagent)** — OmO 5.0：一句 “mass ulw” 触发多模型 ultracode、记忆与 CodeMode，7万★。本仓 08 讲多 agent/worktree，但缺这种“单入口编排多模型”的现成实现；需核其“图工程”是否只是提示词封装。 〔新〕
- **[ayghri/i-have-adhd（ADHD 友好输出 Skill）](https://github.com/ayghri/i-have-adhd)** — 把“先给答案、别把结论埋在后面”的输出偏好做成窄 Skill，6万★。本仓只有 GPT with Taste 这类偏好样例，缺这种针对输出结构的单一约束；适合验证一条短 Skill 是否真能改变长答复的可读性。 〔转 AGENT-CONFIG，本卡不深挖〕
- **[JimLiu/baoyu-skills（宝玉的 20+ 中文 Skill 集）](https://github.com/JimLiu/baoyu-skills)** — 宝玉分享的 20+ 个中文实用 Skill（Claude Code、Codex 等），2.7万★，README 明确提醒只装需要的以免上下文开销。本仓中文实践来源偏少且引用过宝玉文章，但未收他维护的 Skill 集；可作中文 Skill 写法与触发描述的样本。 〔新〕
- **[titanwings/distilly（把同事的思路蒸馏成 Skill）](https://github.com/titanwings/distilly)** — 从离职同事的文档/资料中提炼决策规则、反模式和章节，生成可复用 colleague.skill，2.6万★。本仓 05 讨论“从历史运行提炼 Skill”，这条把来源换成文档与人，适合评估提炼结果的证据保留。 〔新〕
- **[virgiliojr94/book-to-skill（技术书转按章 Skill）](https://github.com/virgiliojr94/book-to-skill)** — 把技术书/文档目录蒸馏成按章加载的 Skill，作者自报回答单问题时比整本灌入少 24–51× token，3.7万★。本仓 03/05 讲“按需读取参考资料”，这条提供把书结构化的具体管线；需核章节切分与来源标注是否可靠。 〔新〕
- **[tester-army/e2e（自然语言 E2E 测试框架）](https://github.com/tester-army/e2e)** — 用自然语言描述目标，让 agent 驱动 Web/移动应用完成 E2E 测试，月趋势在榜。本仓 23 讲浏览器验收与 Playwright CLI，但缺“测试代码由 agent 生成并维护”的框架形态；适合评估断言稳定性与失败诊断。 〔新〕
- **[DeusData/codebase-memory-mcp（本地代码智能 MCP）](https://github.com/DeusData/codebase-memory-mcp)** — 本地代码智能 MCP：162 种语言、17 个工具、混合 LSP 类型解析，把代码/文档/基础设施连成持久图，4.8万★。本仓 Serena 做符号编辑、Graphify 做导航，这条补“持久代码记忆 + LSP”的组合；需核大仓库索引成本与过期策略。 〔本仓已有：research/2026-10-13-immich-handover〕
- **[xerj-org/xerj（单二进制本地搜索/MCP）](https://github.com/xerj-org/xerj)** — 一个 Rust 二进制索引代码、文档、日志、JSONL/CSV/PDF，提供 BM25、向量、混合检索和 Elasticsearch 兼容 API，1.9万★。本仓 QMD/context-mode 是同类问题的另一种实现；可对照“单二进制 + ES API”是否更适合常驻本地。 〔新〕
- **[stablyai/orca（桌面 Agent 舰队管理器）](https://github.com/stablyai/orca)** — 桌面端管理一队编码 Agent（多会话、worktree、预览），11.3万★、11-02 活跃。本仓 08 只比较 CLI/worktree 隔离，Coucou 只做通知；缺“桌面编排全部 agent”的入口，可核其分支/评审闭环是否真的减少人工切换。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[NanmiCoder/cc-haha（中文本地 Agent 工作台）](https://github.com/NanmiCoder/cc-haha)** — 本地优先的跨平台 Claude Code/多 Agent 桌面工作台：多 agent 协作、Git worktree、diff、技能市场、多模型、远程访问，1.5万★。本仓中文读者入口偏少，这条补“桌面工作台 + 技能市场”的中文实现；需核其远程访问的鉴权。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[ParadevAI/Paradev（每任务独立 worktree 的并行 IDE）](https://github.com/ParadevAI/Paradev)** — 原 Superset，桌面应用为每个任务开独立 Git worktree、分支和终端，内置评审与浏览器预览，1.6万★。本仓 08 的 worktree 是手工命令，这条把隔离做成产品；可对照其清理/冲突处理是否比脚本更可靠。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[1jehuang/jcode（低内存并行编码 Agent）](https://github.com/1jehuang/jcode)** — Rust 编码 Agent harness，主打几十个 Agent 并行而不吃内存/不卡，2.1万★、YC S26。本仓 08 并行只到进程/worktree 层，缺资源效率路线；适合评估多 agent 的边际成本。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[codewhale-hq/Codewhale（带 receipts 的 Rust 终端 Agent）](https://github.com/codewhale-hq/Codewhale)** — 开源终端编码 Agent，40+ provider、默认 DeepSeek V4.1 Flash，`/receipts` 列出改过的文件、跑过的命令和 web/MCP 调用，4.1万★。本仓客户端比较未收这条；receipts 正好补“完成声明要有可核证据”的机制。 〔新〕
- **[cheaper-inference/OmniRoute（免费额度聚合网关）](https://github.com/cheaper-inference/OmniRoute)** — MIT 网关，一个端点聚合 375 家 provider（150+ 免费）、1,400+ 模型，8.4万★。本仓 02 讲模型路由与成本，但未收“免费 tier 聚合”这一类入口；需核各 provider 条款、限流与稳定性，不能把聚合额度当无限供应。 〔新〕
- **[tashfeenahmed/freellmapi（免费 LLM API 聚合）](https://github.com/tashfeenahmed/freellmapi)** — 聚合 34 家免费 provider、635 个模型端点到单个 OpenAI 兼容 `/v1`，月趋势在榜。与 OmniRoute 同题不同实现，可比较密钥管理、路由与失败回退；同样需核条款与额度真实性。 〔新〕
- **[getagentseal/codeburn（跨工具 token/成本计量）](https://github.com/getagentseal/codeburn)** — 本地统计 37 种编码工具的 token 与成本（Claude Code、Cursor、Codex、Gemini 等），1.2万★。本仓 02 的成本页缺“跨工具实际计量”入口；适合在换模型/换客户端前建立真实基线，注意本地解析日志的隐私范围。 〔新〕
- **[ranxianglei/billion-context（前缀缓存健康 CLI）](https://github.com/ranxianglei/billion-context)** — 面向长会话的上下文/前缀缓存工具，README 以 95–97% 缓存命中率为健康线、压缩成本 ≤2%，月趋势在榜。本仓 03 讲缓存与压缩，但缺这个具体 CLI；机制与效果需回源码核，不能只按 README 数字判断。 〔新〕
- **[automazeio/ccpm（GitHub Issues+worktree 的项目管理 Skill）](https://github.com/automazeio/ccpm)** — 把项目拆成 GitHub Issues，用 worktree 并行执行 agent 的项目管理 Skill，8.4k★。本仓 07/08 有类似工作流但没有这个 Skill 形态；适合评估“Issue 作为任务真源”与本地 TASKS 的冲突。 〔新〕
- **[nanocoai/nanoclaw（容器化 OpenClaw 替代）](https://github.com/nanocoai/nanoclaw)** — 在独立容器里跑 agent 的轻量 OpenClaw 替代，强调可读、可定制，每个 agent 独立容器与记忆，3.1万★。本仓 10 讲隔离与权限但未收这个具体实现；适合评估“每 agent 一容器”对权限与运维的实际成本。 〔新〕
- **[Skills are the New SDKs（AI Engineer World's Fair 2026 演讲）](https://ai.engineer/talks/LC3-P7v3yoI)**（2026-06-29） — 2026-06-29～07-02，Elvin Aghammadzada：Skill 三级加载（元数据 <100 token、指令 <5,000、执行时再读资源）、15 个 MCP server 可超 100K token 工具定义、Skill 可打包工具代码甚至启动 MCP server；给出 26+ 平台与约 10 万 Skill 的生态量级。演讲类一手材料，数字为作者估算。 〔新〕
- **[As models get better, your agent tools should get smaller](https://blog.mastykarz.nl/models-better-agent-tools-smaller/)**（2026-10-17） — 2026-10-17 实践者博文：模型变强后旧 Skill/MCP 会变成竞争性指令、额外 token 和过时指导，主张先测无工具基线，再逐项加入并比较结果、成本与轨迹，最后删冗余。补的是 Skill 退役/剪枝视角，与「多装工具」的主流叙事相反。 〔新〕
- **[Ask HN：How do you manage skills files?（320 分/299 评）](https://news.ycombinator.com/item?id=49589914)**（2026-09-06） — 2026-09-06 的实践者长帖：直接问怎么发现、组织、验证 Skill 并长期维护；回复把 docs/ 当 ADR、讨论 Skill 会不会被模型能力吞掉、以及如何避免「装了就忘」。是 Skill 管理工具需求与真实痛点的集中样本。 〔新〕
- **[MCP was always a bad idea?（Maharshi Patel）](https://maharship.com/blog/why-mcp-was-always-a-bad-idea/)**（2026-09-14） — 2026-09-14 反方长文（HN 335 分/330 评）：认为强模型可直接写脚本、读 --help、走 API 与 content negotiation，MCP 只是弱模型时代的包装；HN 评论反驳它没回答凭证隐藏、无 shell Agent 和权限审计问题。适合作为 MCP 反例基线，与 Quandri 实测对读。 〔新〕
- **[What is Codemode（Armin Ronacher）](https://lucumr.pocoo.org/2026/10/6/codemode/)**（2026-10-06） — 2026-10-06，Pi 1.0 作者解释在 QuickJS/WASM 里写 JS 编排 MCP 工具、按需发现而非全量塞 schema。仓内已覆盖 Pi codemode 机制，此文新增的差异是 MCP server 常缺 outputSchema、批量结果形状随数量变化、大二进制支持差、跨 server 工具搜索无强机制等失败模式。 〔新〕
- **[SimpleEnglish：ASD-STE100 简化技术英语 Skill](https://github.com/AminBlg/SimpleEnglish)**（2026-07-30） — 2026-07-30 HN 363 分/121 评，把受控自然语言标准做成文档写作 Skill；属于少见的非编码领域窄 Skill，评论给了改写样例，也质疑过度简化会丢信息。适合看「标准 + Skill」的组合边界。 〔新〕
- **[My Agent Skill for Test-Driven Development](https://www.saturnci.com/my-agent-skill-for-test-driven-development.html)**（2026-06-04） — 2026-06-04 HN 251 分/109 评：作者把 TDD 流程写成 Skill；评论里 Simon Willison 说直接说 「red/green TDD」 已够用，也有人称其为 snake oil、认为 TDD 该放 AGENTS.md 而非 Skill。正反适合校准「何时该写 Skill」。 〔新〕
- **[Sx：AI skills/MCP/commands 的包管理器](https://github.com/sleuth-io/sx)**（2026-05-15） — 2026-05-15 HN 50 分；把 Skill、MCP 配置、slash command、Agent、Hook、规则做成带 lockfile 和 org/team/repo/个人作用域的版本化包，可推到本地目录、git 或托管后端。评论追问为何不跟 git/release SHA 绑定、如何追责，是 Skill 分发与可复现性的一条独立路线。 〔新〕
- **[Skillscript：声明式沙箱工具编排语言](https://github.com/sshwarts/skillscript)**（2026-07-12） — 2026-07-12 HN 18 分/32 评；用可读、可版本化的 DSL 固定本地 Agent 的工具编排，替代每次让模型自由发挥。评论质疑新语言增加模型生成难度、与普通脚本相比优势不明；适合作为 code mode 之外的另一条控制路径。 〔新〕
- **[MCP Is the WSDL Moment for Agents（Mark Fussell）](https://dev.to/mfussell/mcp-is-the-wsdl-moment-for-agents-157d)**（2026-10-27） — 2026-10-27，Dapr 共同作者：MCP 像 WSDL 一样统一发现/调用但故意保持薄，2026-07-28 版去掉 session、把状态交给应用、Tasks 变可选扩展；同时提醒身份、授权、重试、幂等仍在运行时，registry 只是命名空间、工具描述可在审核后投毒。 〔新〕
- **[Ask HN：I still don't understand why AI agents need skills](https://news.ycombinator.com/item?id=49139845)**（2026-08-02） — 2026-08-02 的怀疑帖（17 分/18 评）：问 Skill 与一组组织良好的 Markdown 有何本质区别。回复指出 Skill 是「标题+描述索引+按需加载」，省掉模型自己多次读文件的发现成本；是 Skill 概念的最小反例，适合给新读者解释为什么不是普通文档。 〔新〕
- **[skills.sh Review (2026): Free Agent Skills, Real Risks](https://aiagents.org.uk/skills-sh-review/)** — 第三方评测给 3.5/5：最大免费目录、约 75 个 Agent 应用、每页显示 Gen/Socket/Snyk 三扫描器；但无人工审核、安装即自动上架、假 Skill 曾进入 trending、扫描器可被绕过、排名公式不公开。作者声明未实际安装测试，只能当风险清单。 〔新〕
- **[AgentShield（Claude 配置与 MCP 安全审计）](https://github.com/affaan-m/agentshield)** — 扫描 .claude/ 的硬编码密钥、权限误配、Hook 注入、MCP 风险与 Agent 提示注入向量，提供 CLI、GitHub Action 与 GitHub App；npm ecc-agentshield 1.6.0（2026-09 更新，1,357★）。README 引用的“12% 市场 Skill 恶意”等统计是作者自述，需回原始来源核实。 〔新〕
- **[Repo Forensics（本地 AI 插件/Skill/MCP 审计）](https://github.com/alexgreensh/repo-forensics)**（2026-11-01；v2.14.19） — 定位为“npm audit for AI-agent plugins/skills/MCP”，完全本地、零遥测、450+ 条签名检测规则并跟踪 2,400+ 恶意包，最新 v2.14.19（2026-11-01 更新，203★）；适合装陌生仓库前做离线首轮筛查，检测覆盖与误报率未独立核。 〔新〕
- **[Microsoft SkillOpt](https://github.com/microsoft/SkillOpt)**（v0.2.0） — 把 Skill 文档当可训练参数，用 rollout→反思→留出验证门控的增删改产出 300–2000 token 的 best_skill.md，部署时零额外模型调用；v0.2.0 带 Claude Code/Codex/Copilot 集成壳，作者自报 52 个 cell 最优，建仓在 5 月、9 月才升温。 〔新〕
- **[grith 的 Skill 权限清单提案](https://grith.ai/blog/skill-md-permissions-manifest)**（2026-09-07） — 2026-09-07 提出 requested-permissions（文件/进程/网络/密钥，未声明即 fail-closed），论证 Skill 是“延迟触发的执行面”而非纯 Markdown；清单仍是示例草案，提案方自承不解析 SKILL.md、也不按 Skill 归因。 〔新〕
- **[Red Hat ripwire](https://github.com/redhat-et/ripwire)**（2026-07-29） — C++23 零依赖 CLI + MCP，先给调用图、影响面与该跑的测试，编辑后再报质量退化和漏改，补的是“读仓库前先有地图”；2026-07-29 建仓已 2.5K★，随附现场报告是模型自述、未独立复现。 〔新〕
- **[MCPJam](https://www.mcpjam.com)** — 面向 MCP server、ChatGPT apps 的预发布测试与 eval 平台，开源 Inspector/CLI，按真实客户端矩阵做协议、选工具、参数和回归检查；站点自报 Asana、Bright Data、IBM 等客户与 5 万开发者，未独立核。 〔新〕
- **[codecut：坏示例会压过 Skill 规则](https://codecut.ai/agent-skills-bad-session-history/)**（2026-09-24） — 2026-09-24 的小实验显示 qwen3:8b 下冲突会话示例从第 2 轮起就压过明确的 SKILL.md 规则，事后纠正只把问题推迟到 15–20 轮；单一小模型，不能外推到所有宿主，但说明应在干净会话验 Skill。 〔新〕
- **[universal-modder（游戏 Mod Skill 包）](https://github.com/rehan-remade/universal-modder)**（2026-09-30） — 2026-09-30 建仓已 9.3K★，把引擎识别、逆向、fal 生成美术/3D/音频、实机测试和视频串成 Skills+工具+MCP，直接对游戏域；面向“几乎任何 PC 游戏”，产出质量与合法性未独立验收。 〔新〕
- **[tigerless agent-memory](https://github.com/tigerless-labs/agent-memory)**（2026-09-01） — 2026-09-01 的 4.3K★ 记忆运行时：Markdown 为真源、本地排序检索、独立“睡眠”整理层，Claude Code 与 Codex 共用一个库；记忆正确性、过期处理和跨宿主行为未验。 〔新〕
- **[jevgrep](https://github.com/dzhng/jevgrep)**（2026-09-26） — 2026-09-26 的 3.1K★ CLI，用 Jev 按“这段代码做什么”找相关文件与上下文，补关键词搜索找不到的语义入口；依赖 Jev 服务，召回质量未与现有 grep/Serena 独立比较。 〔新〕
- **[“AI Skills are worthless in 2026”反例](https://fishbowl.pastiche.org/2026/10/26/ai-skills)**（2026-10-26） — 2026-10-26 的反例文章，认为多数“AI 技能”几周可学、几月即过时，价值在临场而非长期资产；无论证数据，用于校准“Skill 越多越好”的判断，不代表已证结论。 〔新〕
- **[skills.sh 与 vercel-labs/skills（npx skills / find-skills）](https://github.com/vercel-labs/skills)** — Vercel 运营的跨 Agent 技能注册表与 `npx skills` CLI，公开仓库可被自动索引，按全时/24h trending/hot 与安装量排行，find-skills 还教 Agent 先查榜再安装；它已成为公共分发层，但自动收录不等于审核，第三方审计提示恶意 Skill 可进榜，需配合扫描与版本固定。 〔本仓已有：docs/decisions/skills-and-plugins.md#skills-linked-parent（仅断链问题）〕
- **[arXiv 2610.33489 恶意 Agent Skill 静态分析](https://arxiv.org/abs/2610.33489)**（2026-10-24） — 2026-10-24 的 SCS 框架把自然语言指令编译成约束 IR，再与随包代码构建跨域依赖图，在 117 恶意/117 良性样本上报告 85.6% 准确率、95.2% 召回，扫 66,157 个 ClawHub Skill 后确认 627 个恶意；为“装前扫描”提供可复核方法，但样本、动态验证与跨平台泛化仍有限。 〔新〕
- **[OpenQodex（独立代码评审 Skill/CLI）](https://github.com/openqodex/openqodex)** — 2026-10 更新的开源评审工具：确定性扫描器（SAST、secrets、依赖、lint、IaC、SQL）+ 独立 reviewer 子 Agent 在 push 前查改动，输出 report.md/json/sarif，可直接用现有 Claude Code/Codex 登录；它明确要求写代码的 Agent 不自审，适合对照本仓的评审层与门禁，当前不支持 Windows 原生。 〔转 VERIFY-REVIEW，本卡不深挖〕
- **[anti-slop](https://github.com/miqdadbadjuber/anti-slop)**（2026-11-03） — 2026-08 起的规则包/npm CLI，用可执行规则过滤通用 AI 生成的 UI、文案和代码，2026-11-03 GitHub API 约 8,010 stars；本仓已有“列出要避开的具体样式”的提示建议，这项提供可复用规则集，但规则能否真正降低 slop 仍需同任务对照。 〔新〕
- **[GitHub CLI gh skill](https://cli.github.com/manual/gh_skill)** — GitHub 官方 CLI 的技能子命令（public preview），提供 search/preview/install/update/publish，可把技能安装纳入现有 GitHub 工作流并先预览 SKILL.md 再装。 〔新〕
- **[OWASP Agentic Skills Top 10](https://github.com/OWASP/www-project-agentic-skills-top-10)** — OWASP 的 AST01–AST10 风险框架，把技能行为层单列，AST08 专门记录扫描器漏掉外部内容载荷的案例，适合作为安装审查清单。 〔新〕
- **[Cisco AI Defense skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)** — Cisco 开源的技能扫描器，组合 YARA-X、AST/数据流与可选 LLM judge，README 明确声明是 best-effort，适合与其它扫描器交叉验证而非当唯一门禁。 〔新〕
- **[SkillFortify 与 SkillFortifyBench](https://github.com/varun369/skillfortify)** — 覆盖 22 个框架的技能/MCP 供应链扫描器，并发布 540 条样本的 SkillFortifyBench（270 恶意/270 良性）；语料为合成数据，适合比较检测器而不是证明线上安全。 〔新〕
- **[OWASP MCP Top 10](https://github.com/OWASP/www-project-mcp-top-10)** — OWASP 的 MCP01–MCP10 覆盖令牌、工具投毒、供应链、影子 MCP 等风险，补上技能安全之外 MCP 服务侧的检查表。 〔新〕
- **[agent-plugins-conformance-kit](https://github.com/Booyaka101/agent-plugins-conformance-kit)** — Agent Plugins 1.0.0 客户端 loader 的一致性测试套件，带 133 个真实插件目录和期望加载报告，并直接引用规范 issue #77 的 schema 与规范冲突，可用于验收宿主实现。 〔新〕
- **[tech-leads-club/agent-skills](https://github.com/tech-leads-club/agent-skills)** — 自称经过安全验证的技能注册表，提供 CLI、多助手适配和一个按渐进披露暴露目录的 MCP server（list/search/read/fetch），可对照 skills.sh 看“策展+服务端读取”的做法。 〔新〕
- **[package:skills（pub.dev）](https://pub.dev/packages/skills)** — Dart 的 `package:skills` 让技能随 pub 包发布并用 `dart run skills@ get` 安装，配套 `skills_lint` 做 frontmatter/结构校验，是 pnpm 之外另一种包管理器分发技能的实现。 〔新〕
- **[Hugging Face UPskill](https://github.com/huggingface/upskill)** — UPskill 从 agent trace 生成技能，并用教师/学生模型和 HF Jobs 做评测，直接回答“这个技能是否让更便宜的模型也能完成任务”。 〔新〕
- **[FastMCP 4.2 Skills provider](https://gofastmcp.com/servers/skills)** — FastMCP 4.2 的 SkillCatalogProvider 把技能目录作为 MCP resources（skill://）提供并支持从目录/包加载，是 SEP-2640 之外已可运行的实现，但 URI 与发现方式仍与最终 SEP 不一致。 〔新〕
- **[Hindsight（Vectorize）](https://github.com/vectorize-io/hindsight)** — 从 MemPalace README 明确列为不作横评的记忆系统追到；retain/recall/reflect 三操作、Postgres+pgvector、带 coding-agent 安装入口，适合与 MemPalace 的逐字记忆路线做机制对照。 〔新〕
- **[Pensyve](https://github.com/major7apps/pensyve)** — wshobson/agents 目录里唯一被单列的外部插件；universal memory runtime 同时提供 Claude Code/Codex/Antigravity 插件、4 个 skill、6 个 hooks 和 MCP server，可看多 harness 记忆插件如何打包。 〔新〕
- **[memento-memory](https://github.com/shane-farkas/memento-memory)** — MemPalace HN 评论区读者自建的同类记忆项目，属于评论里冒出的替代品，适合看小项目在“存全文还是合成”轴上的不同取舍。 〔新〕
- **[Lodestar（kylex.io）](https://kylex.io)** — MemPalace HN 评论提出的反向设计：不存逐字记录，只在会话结束合成“决定了什么、为什么、否决了什么”的决策层，值得作为记忆路线的反例。 〔新〕
- **[Unified Harness Protocol（UHP）](https://unifiedharnessprotocol.org)** — HarnessRouter 真正独立出来的标准资产：Apache-2.0 规范、OpenAPI schema 和 95 项一致性测试，定义会话/流式/文件/取消/错误的统一契约，不只是又一个 router。 〔新〕
- **[caveman-ai/blocks](https://github.com/caveman-ai/blocks)** — caveman 作者另立的 code-mode 脚本仓库，把重复工具调用固化成可复用脚本，和 caveman 的少读少说形成“输入/动作”两侧的 token 方案。 〔新〕
- **[Compresr](https://compresr.ai)** — headroom README 点名的托管文本压缩 API，可与本地 headroom、开源压缩层做托管/自建对照。 〔新〕
- **[Token Co.](https://thetokencompany.com/)** — headroom README 点名的另一家托管文本压缩 API，与 Compresr 同属“把压缩做成服务”的路线，便于补足 headroom 自述之外的商业方案。 〔新〕
- **[Claude-OSINT](https://github.com/elementalsouls/Claude-OSINT)** — Claude-BugHunter 的姊妹 OSINT 包，README 称两个 skill 字节级共享且安装器刻意共存，适合看同一作者如何拆“侦察/漏洞”两层。 〔新〕
- **[Agentic Bug Hunter](https://github.com/awarexone/Agentic-Bug-Hunter)** — Claude-BugHunter 的 vendored 上游（原 shuvonsec/claude-bug-bounty 已改名重定向到这里），MIT、带 bughunter CLI、7-Question Gate 和 MCP 文档，可核被二次分发的原始实现。 〔新〕
- **[SecSkills](https://github.com/trilwu/secskills)** — Claude-BugHunter 引用的安全 skill 集，特别被引的是 subagent 模式，适合对照安全类 skill 如何组织审查角色。 〔新〕
- **[Emil Kowalski skills](https://github.com/emilkowalski/skills)** — Hallmark 的 Inspired by 名单点名；16 个动效/设计 skill（animate、review-animations、apple-design 等）来自 Vercel/Linear 背景作者，补设计 skill 里“动效判断”这一空档。 〔新〕
- **[Huashu Design](https://github.com/alchaincyf/huashu-design)** — Hallmark 与 OpenDesign 都引用的中文 HTML-native 设计 skill，含六候选/三方向顾问、样式库、本地品味记忆与设计 lint，是中文设计 skill 的代表实现。 〔新〕
- **[Kami](https://github.com/tw93/kami)** — OpenDesign/Hallmark 生态里的文档产出 skill：8 套模板输出 PDF/PNG/可编辑 PPT，并带结构、内容覆盖和视觉质量检查，补“设计 skill 只管网页”的缺口。 〔新〕
- **[Open Design](https://github.com/nexu-io/open-design)** — Hallmark 与 OpenDesign 互引的本地优先设计工作台，10.5 万星，内置 agent skills、模板、品牌系统和 MCP/CLI，代表“设计 skill 的平台化”路线。 〔新〕
- **[OpenCodesign](https://github.com/OpenCoworkAI/open-codesign)** — OpenDesign README 点名的相似产品：流式产物 + 沙箱预览的工作台，可用来比较设计类 agent 产品的两种打包方式。 〔新〕
- **[unlazy](https://github.com/Leonxlnx/unlazy)** — taste-skill 删除 full-output-enforcement 后明确指定的继任者，适合核“强制完整输出”是否真能被窄 skill 替代。 〔新〕
- **[taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics)** — taste-skill 迁出的旧版/实验设计 skill（high-end-visual-design、minimalist-ui、gpt-taste 等），保留安装名，适合做设计 skill 的代际对照。 〔新〕
- **[imagegen-skills](https://github.com/Leonxlnx/imagegen-skills)** — taste-skill 迁出的图像生成、brandkit、image-to-code skill 组，补设计 skill 与图像模型之间的接口层。 〔新〕
- **[Guizang PPT Skill](https://github.com/op7418/guizang-ppt-skill)** — OpenDesign README 引用的杂志风 deck 模板 skill，是中文演示文稿方向的具体实现，可与 Kami 的 PPT 产出对照。 〔新〕
- **[Beautiful Mermaid](https://github.com/lukilabs/beautiful-mermaid)** — Kami README 引用的 Mermaid→SVG 渲染器，补图表类 skill 的“生成后质量”环节，而不只是让模型写 Mermaid 源码。 〔新〕
- **[OldHand](https://github.com/berwinsingh/oldhand)** — 从 HN 的 ponytail 相关搜索追到的 11-skill 全流程包：证据落在 .oldhand/，用 ledger.py 按当前代码算出 INCOMPLETE/NOT YET/BLOCKED/VERIFIED，正面回应“agent 宣称完成”。 〔新〕
- **[dsh-egm](https://github.com/dryw/dsh-egm)** — EGM 的 DeepSeek Harness 移植（npm dsh-egm，已上 DSH 插件目录），可看同一“大象起草/金鱼评审”模式如何跨 harness 落地。 〔新〕
- **[vshvedov/elephant-goldfish](https://github.com/vshvedov/elephant-goldfish)** — Google EGM 之外的独立五阶段实现（brainstorm/PRD/fix bug/new feature/precommit review），支持 Claude Code、Codex、Gemini CLI，可做同模式不同实现对照。 〔新〕
- **[Multica](https://github.com/multica-ai/multica)** — andrej-karpathy-skills 所在组织的 agent 平台仓库，README 将其描述为运营 coding agent 与复用 skill 的基础设施，可看 skill 的宿主层。 〔新〕
- **[Kuna](https://github.com/Noelo-Lab/kuna)** — REA 的 Kuna provider 背后的 Apache-2.0 单文件反编译器，静态读取不执行，是 Ghidra/IDA 之外可被 MCP 包装的原生分析入口。 〔新〕
- **[TweetClaw](https://github.com/Xquik-dev/tweetclaw)** — last30days 点名的 X/Twitter 动作 companion：last30days 负责跨平台调研，TweetClaw 补调研之后的发帖/互动执行，形成“读→写”组合。 〔新〕
- **[3Dviz Pro Max](https://github.com/viettranx/3dviz-pro-max)** — UI UX Pro Max 作者在 README 顶部新推的 3D 场景 skill，代表设计 skill 从网页/PPT 向 3D 资产生成扩展。 〔新〕
- **[addyosmani/agent-skills（生产级工程 Skill）](https://github.com/addyosmani/agent-skills)** — Addy Osmani 把资深工程师各开发阶段的工作流与质量门固化成可安装 Skill，适合对照“工程纪律如何进入 Agent”。 〔本仓已有：docs/09〕
- **[yusufkaraaslan/Skill_Seekers（文档转 Skill 工具）](https://github.com/yusufkaraaslan/Skill_Seekers)**（v3.9.0） — 把文档站、GitHub、PDF、视频等 18 类来源转成 Skill/RAG 资产（v3.9.0），补上“Skill 内容从哪来”的一环。 〔新〕
- **[lennney/stop-that-shit（任务边界 Guard）](https://github.com/lennney/stop-that-shit)** — 中文任务边界 Guard，专门针对范围膨胀、无用防御、意图越界、任务打转四类行为，正好补本仓缺的“反过度执行”规则。 〔转 AGENT-CONFIG，本卡不深挖〕
- **[BagelHole/DevOps-Security-Agent-Skills（160+ DevOps/安全 Skill）](https://github.com/BagelHole/DevOps-Security-Agent-Skills)** — 160+ 生产向 DevOps/安全 Skill，覆盖基础设施与安全场景，可补通用编码之外的领域包。 〔新〕
- **[JimLiu/baoyu-design（本地 Claude Design Artifact）](https://github.com/JimLiu/baoyu-design)** — 宝玉把 claude.ai 的 Artifact 类型（幻灯片、设计画布、设计系统、数据看板）搬到本地 agent，是 baoyu-skills 作者的另一条设计向产品线。 〔新〕
- **[agentskills/agentskills（Agent Skills 开放格式规范）](https://github.com/agentskills/agentskills)** — Agent Skills 开放格式的规范本体（SKILL.md 目录结构、元数据约定），是上面多数 Skill 仓库和客户端的格式依据。 〔本仓已有：docs/05〕
- **[badlogic/pi-mono（Pi 极简 agent harness）](https://github.com/badlogic/pi-mono)** — Pi 是强调最小内核与可扩展性的 agent harness，也是 OmO 的 senpi fork 上游，适合看“极简 harness + 扩展/技能包”路线。 〔新〕
- **[jc01rho/omo-herdr-dag（OmO 工作流 DAG 侧栏）](https://github.com/jc01rho/omo-herdr-dag)** — OmO 的 Herdr 侧栏扩展，实时显示工作流 DAG 的依赖与节点状态，补多 agent 编排的可观测面。 〔新〕
- **[Yeachan-Heo/oh-my-codex（Codex 侧元框架）](https://github.com/Yeachan-Heo/oh-my-codex)** — Codex 侧的 prompt/workflow 元框架，OmO README 明确称其 Ultragoal/UltraQA 思路来自这里，可与 OmO 对照两种 harness 的同一套方法。 〔新〕
- **[farion1231/cc-switch（多 Agent 配置/供应商管理器）](https://github.com/farion1231/cc-switch)** — 一键切换 Claude Code/Codex/Gemini 等 provider，并集中管理 MCP、Skills、Prompts，被 cc-haha 列为组成组件。 〔新〕
- **[ranxianglei/acp-kernel（上下文压缩引擎）](https://github.com/ranxianglei/acp-kernel)** — billion-context 背后的 host-agnostic 上下文压缩引擎，含三层 LSM-tree 压缩、增长式 nudge 与受保护内容过滤，可单独评估。 〔新〕
- **[automazeio/proof（测试证据录制）](https://github.com/automazeio/proof)** — ccpm 同作者的测试证据工具，把终端、浏览器、iOS/Android 模拟器测试录成可附 PR 的 HTML 回放、视频和结构化报告。 〔新〕
- **[openclaw/openclaw（自托管个人 assistant）](https://github.com/openclaw/openclaw)** — NanoClaw 的上游项目，跨聊天与设备运行自托管 assistant，是理解 NanoClaw 容器化取舍和 ClawHub 生态的基线。 〔本仓已有：docs/13〕
- **[nanocoai/nanoclaw-templates（NanoClaw 预构建模板）](https://github.com/nanocoai/nanoclaw-templates)** — NanoClaw 的预构建容器化 agent 模板，可作为 Agent Plugins 目录直接 stamp 成完整 agent，降低从零配置成本。 〔新〕
- **[generalaction/emdash（worktree 并行 Agent 桌面编排器）](https://github.com/generalaction/emdash)** — 每个任务独立 git worktree、可并行跑多个 coding agent 并支持 SSH 远程，Orca README 把它列为同类对照。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[steipete/CodexBar（AI 编码额度菜单栏）](https://github.com/steipete/CodexBar)** — 菜单栏集中显示各 AI coding 工具的限额与用量，CodeBurn README 明确说其 provider-usage 面板参考了 CodexBar。 〔新〕
- **[simplynadaf/aws-lean-mcp（15→4 工具的 MCP 对照仓库）](https://github.com/simplynadaf/aws-lean-mcp)** — 同一 AWS MCP 的 15 工具臃肿版与 4 工具精简版并列，可直接复现“少而面向结果”的 token/调用次数差异。 〔新〕
- **[day50-dev/mcp-search-and-run（InfiniteMCP 元网关）](https://github.com/day50-dev/mcp-search-and-run)** — 用语义搜索动态发现并调用其他 MCP server 的元 MCP 网关，是 HN 评论区提出的“RAG for MCP”具体实现。 〔新〕
- **[stevesolun/ctx（找最便宜可跑配置）](https://github.com/stevesolun/ctx)** — 分析仓库并实测多种 AI 编码配置，找“最便宜且能跑通”的组合，定位比单纯统计 schema token 更靠结果。 〔新〕
- **[kelos-dev/kelos（Kubernetes 上的 coding agent）](https://github.com/kelos-dev/kelos)** — 把 coding agent 变成 Kubernetes workload，支持 Claude Code/Codex/Gemini/OpenCode/Cursor，从 HN 的 axon 链接追到其改名后的仓库。 〔新〕
- **[savvasioakeim/OctoShell（Rust/Tauri worktree 编排器）](https://github.com/savvasioakeim/OctoShell)** — 桌面编排器为每个任务建独立 git worktree 并同时跑多仓库 agent，用 Tauri v2 + Rust 实现，可与 Orca/Paradev 对照。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[sudheerdvn/lanegate（轻量 git-native worktree 编排）](https://github.com/sudheerdvn/lanegate)** — Python 实现的 git-native worktree 编排器，定位比 Orca/Paradev 更轻，适合看“只做隔离与调度”的最小方案。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[ejholmes《MCP is dead. Long live the CLI》](https://ejholmes.github.io/2026/02/28/mcp-is-dead-long-live-the-cli.html)** — Quandri 实测直接引用的 CLI 派原始论述，是整场 MCP/CLI 争论的起点，适合与 Quandri 的测量一起读。 〔新〕
- **[Arize：MCP vs CLI Skills 实测](https://arize.com/blog/mcp-vs-cli-skills-for-agents-what-our-eval-found-and-which-you-should-use/)** — 25 个 GitHub 任务、500 次试验比较 MCP 与两种 CLI/Skill 方案，给出正确率、成本与延迟数据，比纯观点文更适合做取舍依据。 〔新〕
- **[GetUnblocked：MCP token-budget autopsy](https://getunblocked.com/blog/mcp-token-budget-autopsy/)** — 被 aws-lean-mcp 作者引用的 MCP token 预算解剖，提供“5–10 个 MCP server 首轮前就占 50k–67k token”一类的量化口径。 〔新〕
- **[obielin/skillshield（OWASP Agentic Skills 规则扫描）](https://github.com/obielin/skillshield)** — 按 OWASP Agentic Skills Top 10 映射规则做安装前扫描，并强调“提示注入 + 网络 + 文件系统”的 Lethal Trifecta，仓库 README 自称 SkillShield。 〔新〕
- **[agentverus/agentverus-scanner（Skill 包级信任分析）](https://github.com/agentverus/agentverus-scanner)**（v0.8.0） — v0.8.0 起把 SKILL.md 与同目录 JS/TS/Python/shell 关联，检测描述与代码不一致、秘密记录、外传和 AGENTS.md/CLAUDE.md 篡改，补只看 Markdown 的盲区。 〔新〕
- **[browser-use/browser-use（浏览器操作 agent 库）](https://github.com/browser-use/browser-use)** — 浏览器操作 agent 库；Zenity 报告里它正是被仿冒的合法包，可作为“同名包/仿冒包如何分辨”的供应链对照。 〔新〕
- **[SkillsBench](https://github.com/benchflow-ai/skillsbench)**（v1.1） — Apache-2.0 的 87 任务、8 领域技能基准（v1.1，约 1.9k stars），对 24 组模型/框架配对给出技能前后成功率，是回答“Skill 到底有没有用”的现成评测底座。 〔本仓已有：docs/research 两篇〕
- **[skulto](https://github.com/asteroid-belt/skulto)** — 离线优先的 Skill 管理器，支持 33 种工具、SQLite FTS5 搜索、manifest 与安装前 prompt-injection 扫描，并自带 skulto-mcp，适合对比安全与可检索性。 〔新〕
- **[aix](https://github.com/a1st-dev/aix)** — 用单个 ai.json 统一 skills/agents/prompts/rules/hooks/plugins/MCP 并分发到 Claude Code、Cursor、Codex 等 9 个编辑器，ai.lock.json 用 SHA-512/256 做漂移检测。 〔新〕
- **[nori-skillsets](https://github.com/tilework-tech/nori-skillsets)** — 以“Skillset”整包安装 skills、AGENTS.md/CLAUDE.md、subagents、slash commands 和 MCP，并提供按 agent 条件渲染的内联语法，适合多 agent 同一套上下文的场景。 〔新〕
- **[rosie](https://github.com/rosieskills/rosie)** — 原 withastro/rosie 的 npm 式 Skill 包管理器（rosie install anthropics/skills），提供 `.agents/rosie.lock`、跨平台二进制和 JS API，代表“仅做分发原语”的轻量路线。 〔新〕
- **[orthogonalhq/apm](https://github.com/orthogonalhq/apm)** — 另一个同名 APM：自带 apm.orthg.nl 公共注册表，支持 34+ agent、apm-lock.json 与 search/install/info/validate；与 microsoft/apm 的命名冲突本身值得负责人定夺。 〔新〕
- **[MCP 2026-07-28 稳定版规范](https://github.com/modelcontextprotocol/specification/releases/tag/2026-07-28)**（2026-07-28） — MCP 最新稳定修订（2026-07-28，commit 5f5440b），移除 session、把 Tasks 改为可选扩展并增加网关友好的 Mcp-Method/Mcp-Name 头，直接影响现有 MCP 网关与 Skill 组合方式。 〔新〕
- **[FastMCP Code Mode](https://gofastmcp.com/servers/transforms/code-mode)**（v3.1.0） — FastMCP v3.1.0 的实验特性，用 search→get_schema→execute 三步让模型写 Python 编排工具，只回传最终结果；比 Cloudflare 方案更容易在本地 Python 服务上试。 〔新〕
- **[Cloudflare Code Mode 文档](https://developers.cloudflare.com/agents/model-context-protocol/codemode/)** — Cloudflare 的 Code Mode 实现文档（2,500+ API 从 1.17M token 降到约 1,000），提供可直接照做的 sandbox + 类型化 API 结构。 〔新〕
- **[TOON（Token-Oriented Object Notation）](https://github.com/toon-format/toon)** — 面向 LLM 的紧凑无损编码，244 题四模型测试中准确率 72.2% 对 JSON 71.4%、token 2,474 对 4,308；mcptoon 的 `--toon` 就基于它，可独立验证。 〔新〕
- **[Microsoft SkillLens](https://microsoft.github.io/SkillLens/)** — SkillOpt 的伴生研究项目，专门分析模型自生成 Skill 的质量与失效模式，补上 SkillOpt 只讲优化循环、不讲产物诊断的一半。 〔新〕
- **[reptile.haus: Your Skills Files Are Dependencies Nobody Pinned](https://reptile.haus/journal/skills-files-dependencies-nobody-pinned-2026/)** — 把 HN 那条约 60 回复的讨论整理成“Skill 是无锁依赖”论证，补上保密性（无零数据保留）、全局目录跨客户污染和项目级隔离三条本组未展开的风险。 〔新〕
- **[Chroma Context Rot 研究](https://www.trychroma.com/research/context-rot)** — AI Engineer 演讲用来支撑“上下文越长性能越差”的实验来源，可作为 Skill/MCP 数量膨胀与裁剪决策的证据基础。 〔新〕
- **[OpenClaw Skills 文档](https://docs.openclaw.ai/tools/skills)** — ClawHub 生态的 Skill 加载/安全说明，可与 agentskills.io 的渐进披露模型逐条对照，检验第三方实现是否一致。 〔新〕
- **[agent-swarm 仓库](https://github.com/desplega-ai/agent-swarm)** — 99.2% code mode 成本削减文章的源码与可部署系统，含脚本工作流、沙箱与约 150 个复用脚本，是核验该宣称与 HN 批评的第一手材料。 〔新〕
- **[packslip](https://jdx.dev/posts/2026-09-05-introducing-packslip/)** — v1 已稳定的签名 release manifest，把 Skill 作为 release 资源绑定到精确 commit，mise 可按工具版本下载并同步到 .agents/skills，还支持 release age 与独立审批 stamper。 〔新〕
- **[mcpcost](https://github.com/ondraulehla/mcpcost)**（2026-11-02） — 每天探测 MCP Registry 全部 server，报告可达性、认证/付费状态和工具定义 token 成本（2026-11-02 快照 53,396 个 server，58% alive），补上 registry 只在发布时校验的缺口。 〔新〕
- **[Skilled](https://github.com/av/skilled)** — 从 Claude Code/Codex/OpenCode/Grok/Droid 的本地会话记录统计 Skill 实际调用、趋势、stale 和跨项目使用，把“装了但没被调用”变成可审计数据。 〔新〕
- **[Quorum / superpowers-evals](https://github.com/prime-radiant-inc/superpowers-evals)** — 在 9 个真实 coding-agent CLI 上评 Superpowers 的行为合规（触发、worktree、子 agent、验证反射），用会话式任务、私有判据和确定性后检，比单次体验更接近可复现评测。 〔新〕
- **[Skills Gateway](https://github.com/onurkanbakirci/skills-gateway)** — 用 API 先按任务匹配再返回单个 Skill 全文，作者称把 100+ Skill 的约 125k token 降到约 1.45k；思路值得试，但 95–99% 节省是作者自报，需独立复测。 〔新〕
- **[Superpowers Remix](https://github.com/fcavalieri/superpowers-remix)** — 基于 7.0.0 拆成 brainstorming（恢复 6.4.2 先读代码再问）与 discovering-intent（仅显式触发），是对 v7 追问过量 issue 的直接可用替代。 〔新〕
- **[plugin-rollcall（cc-foundry）](https://github.com/xobotyi/cc-foundry/tree/master/plugins/plugin-rollcall)** — 在 SessionStart 自动 /reload-plugins 并延后首个 prompt，专治仓库启用插件在新 clone/worktree 里静默不加载，对应 Claude Code #83422 的剩余缺口。 〔新〕
- **[claude-nix](https://github.com/arianvp/claude-nix)** — 用 Nix 固定插件、Skill、MCP、LSP、hook 及其依赖二进制，避开 npx/uvx 未固定版本，为“可复现的 agent 环境”提供声明式入口。 〔新〕
- **[Pitlane](https://github.com/Mir-Zairan/pitlane)** — 为每个 git worktree 准备依赖、.env、独立数据库和端口，并可用 /pitlane-serve 启动，是多会话并行时的环境隔离插件（跨 MULTIAGENT-LONG）。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[Agent Client Protocol（ACP）](https://agentclientprotocol.com)** — 来自 acpx 的底层协议：用 JSON-RPC over stdio 标准化编辑器/IDE 与编码 agent 的通信，复用 MCP 的 JSON 表示并补 diff 等编码 UX，是 MCP 之外的客户端-代理接口层。 〔新〕
- **[acpx（ACP 的无头 CLI 客户端）](https://github.com/openclaw/acpx)** — 为 30 个 ACP agent（Pi、OpenClaw、Codex、Claude Code、Gemini CLI、Cursor 等）提供统一的会话、权限和机器可读输出接口，可作为跨 agent 脚本化调用的入口。 〔新〕
- **[MCPorter](https://github.com/openclaw/mcporter)** — OpenClaw 生态里的 TypeScript MCP 运行时/CLI：列服务器与工具、从终端或脚本调用、生成聚焦 CLI 和类型、录制回放会话，并导入 Cursor/Claude/Codex 等配置，适合作为 MCP 统一调用层。 〔本仓已有：docs/04、docs/13〕
- **[Hermes Agent](https://github.com/NousResearch/hermes-agent)** — codecut 的“Agent 自己写 Skill”实测、agent-memory 的宿主列表和 ACP/CLI-Anything 都提到它；其卖点是任务后自动生成并迭代 Skill、带 Skills Hub 和跨会话记忆，是本轮少见的“自产 Skill”宿主。 〔新〕
- **[CLI-Anything](https://github.com/HKUDS/CLI-Anything)** — declick README 的对照与可包装对象：用七阶段流水线为 GIMP、Blender、LibreOffice 等真实软件生成带状态/撤销/JSON 输出的 CLI，让 agent 不靠 GUI 自动化；与 declick 的“十引擎一契约”路线可直接对比。 〔新〕
- **[repowise](https://github.com/repowise-dev/repowise)** — ripwire README 对比表里的直接竞品：本地索引代码、git 历史、测试与架构决策，通过 10 个 MCP 工具提供 overview/context/risk/why 等答案，并公布 token、找文件与调用图精度基准。 〔新〕
- **[AACR-Bench](https://github.com/alibaba/aacr-bench)** — OpenQodex 基准所引的仓库级自动代码评审数据集：200 个 PR、1,505 条细粒度评论、10 种语言，并按 diff/整文件/全仓上下文分层，可用来核 OpenQodex 等评审工具的“仓库级上下文”主张。 〔新〕
- **[vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)** — skills.sh 排名第 5 的浏览器自动化 Skill 源，和 Fastbrowse/Jev 属同一能力面；用它的安装量可判断“浏览器 Skill”是否已被头部目录验证。 〔新〕
- **[flowkit-labs/skills](https://github.com/flowkit-labs/skills)** — skills.sh 第 8 名 reddit-automation 的来源仓库，代表“平台操作型 Skill 包”这一被高量安装但少被技术讨论覆盖的类别。 〔新〕
- **[101-skills/superpowers](https://github.com/101-skills/superpowers)** — skills.sh 上以 3.7M 总量出现的一组 AI 视频/图片 Skill，与 heygen HyperFrames 构成同赛道对照，可核“打包成套分发”与单 Skill 分发的差别。 〔新〕
- **[browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast)** — Fastbrowse README 的主要对比对象：同样用 Jev 选择页面操作，Fastbrowse 给出 46 任务三次运行的完成率/成本/耗时对照，适合核双方口径。 〔新〕
- **[Browser Harness](https://github.com/browser-use/browser-harness)** — Fastbrowse 说明 Ultrafast 对比所用的 Chrome 层就是 Browser Harness，是把浏览器控制与规划解耦的底层实现，可作为浏览器 agent 的组件级参考。 〔新〕
- **[Nebula](https://www.nebula.gg)** — Fastbrowse README 称其为运行 fastbrowse 的 agent harness，可看作“把浏览器 agent 作为能力挂进通用 harness”的实例。 〔新〕
- **[Sigil（把 SKILL.md 编译成可执行 harness）](https://github.com/sigilagent/sigil)** — 将 SKILL.md 编译成带类型和强制节点的 Jac 程序，作者报告规定步骤执行率 86% 对 56%、token 0.58 倍；针对 skill 不被执行的问题给出编译路线（arXiv:2607.27309）。 〔新〕
- **[SkillFortify（skill 供应链形式化验证）](https://github.com/qualixar/skillfortify)** — 用 DY-Skill 能力模型、skill-lock.json 与 CycloneDX ASBOM 做 skill 供应链验证；作者同时标注了合成语料基准、依赖混淆未检出等限制，适合评估形式化扫描的真实边界。 〔新〕
- **[Trail of Bits Trailmark（代码结构图）](https://github.com/trailofbits/trailmark)** — 把源码转成函数/调用/继承/包含关系图并做可达性查询，已作为 ToB 安全 skill 的插件，补“结构化代码图交给 agent”的能力。 〔新〕
- **[arXiv 2601.10338：Agent Skills in the Wild](https://arxiv.org/abs/2601.10338)** — 分析 31,132 个 skill，报告 26.1% 至少一个漏洞、5.2% 疑似恶意，并给出 14 类漏洞分类；首个大规模 skill 安全实证。 〔新〕
- **[arXiv 2602.06547：Malicious Agent Skills in the Wild](https://arxiv.org/abs/2602.06547)** — 行为验证 98,380 个 skill、确认 157 个恶意样本，归纳 Data Thieves/Agent Hijackers 与 kill-chain；USENIX Security 2026，补恶意样本层面的证据。 〔新〕
- **[Does Skill.md Linter Matter?（路由实证）](https://do-skills-md-linter-matter.onrender.com/report.html)** — 只改 skill description 的 linter 修复让 18 次全量路由基准运行全部提升 1.3–7.6 个百分点；其中 12 次 Arm C／Arm B 对照提升 1.3–4.9，说明描述质量会实际影响触发（论文 arXiv:2607.01456）。 〔新〕
- **[4,784 个 skill 的跨 registry 分析](https://pradeep.md/2026/02/03/ai-agent-skills-database.html)** — 跨 5 个 registry 统计 28% 重复、59% 带可执行脚本、缺少签名与稳定身份，并附可复算的评分方法，可作为 registry 质量基线。 〔新〕
- **[safe-skill-search（按质量分过滤）](https://github.com/jo-inc/safe-skill-search)** — 按质量分过滤 skill 的 CLI（默认 ≥80）并附 SQLite 数据库，把“先筛再装”做成可执行入口。 〔新〕
- **[GitHub CLI gh skill（原生安装/发布）](https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/)**（v2.90） — gh v2.90+ 原生 search/install/preview/update/publish，带 tree-SHA、provenance 元数据与版本 pin，把 skill 变成可追踪的 GitHub 工件。 〔新〕
- **[GSD Core（Get Shit Done 主线）](https://github.com/open-gsd/gsd-core)** — Discuss→Plan→Execute→Verify→Ship 的 spec-driven 框架，把重活放 fresh-context subagent 以抗 context rot，并支持多 harness；原 gsd-build 仓库已迁到这里。 〔本仓已有：docs/21〕
- **[FredAntB/Spec-Driven-Development](https://github.com/FredAntB/Spec-Driven-Development)** — 用 skill 生成 requirements/design/tasks，并给 Claude、Cursor、Copilot、Aider 写同一套指令块；跨工具规格同步的具体实现（public beta）。 〔新〕
- **[flurdy/agent-skills](https://github.com/flurdy/agent-skills)** — 一份 skill/agent/prompt 源通过托管 symlink 装到 Pi、Claude、Codex，并带 model-tier/effort 路由字段，是多客户端共存的最小实现。 〔新〕
- **[Prisma Drive and the Maker（process-as-code）](https://www.prisma.io/blog/drive-and-the-maker)** — 用 lane/initiative/project/milestone 组织工作，并用 skill 编码模板、决策与验收标准；可对照本仓“流程轻量化”的取舍。 〔新〕
- **[Ghostsecurity skills（确定性扫描器 + AI 判断）](https://github.com/ghostsecurity/skills)** — 把 Poltergeist/Wraith/Reaper/Exorcist 四个确定性扫描器与 AI 解释、实时代理验证组合，体现“真实工具产数据、AI 加判断”的安全 skill 设计。 〔新〕
- **[K-Dense scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)** — 177 个科研 skill、100+ 数据库，作者附 K-Bench 等基准与安全报告；是垂直领域大规模 skill 库的运营与打包样本。 〔新〕
- **[Agent Plugins Inspector](https://github.com/HadjievK/agent-plugins-inspector)** — 静态校验插件 manifest/skills/MCP 声明并映射组件面，类比“MCP Inspector 之于 MCP”；来自 spec discussion #78。 〔新〕
- **[with-logic/crew](https://github.com/with-logic/crew)** — 以 git 仓库为 registry（taps），支持技能依赖、命名空间、定时更新与 SHA 固定，并在 README 里明确对比 skills.sh 与 gh skill 的分工。 〔新〕
- **[luongnv89/asm（agent-skill-manager）](https://github.com/luongnv89/asm)** — 面向 Agent 自动化的脚本化 Skill 管理器，含 6,962 条目录、去重/安全/token 成本审计，以及不落盘试用单个 Skill 的 get 命令。 〔新〕
- **[antfu/skills-npm](https://github.com/antfu/skills-npm)** — 让 skills 随 npm 依赖一起安装并由 symlink 同步，代表“库/框架自带 Skill”路线，且正在并入 vercel-labs/skills。 〔新〕
- **[can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)** — Pi 的分支，把 LSP、DAP 调试、AST 编辑、子 Agent 与 ACP 接进终端 Agent，展示 harness 侧能力扩展的另一条路线。 〔新〕
- **[gregwebs/skills-sdlc](https://github.com/gregwebs/skills-sdlc)** — 以 mattpocock skills 为上游，补上 spec→tickets→逐步 review→verify 的 SDLC 技能集，是可对照的“流程型 Skill”样本。 〔新〕
- **[TengByte/mcpgrade](https://github.com/TengByte/mcpgrade)** — 按描述质量、schema、命名、token 成本给 MCP server 打 A–F 的 linter，带 GitHub Action、36 个 server 榜单和 --eval 实测模式。 〔新〕
- **[iOfficeAI/AionUi](https://github.com/iOfficeAI/AionUi)** — 24/7 多 CLI Agent 工作台，用 ACP 把外部 Agent 编进 Team Mode，可作为 agent-fleet GUI 与 ACP 消费端的对照。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[BlockRunAI/ClawRouter](https://github.com/BlockRunAI/ClawRouter)** — 本地 LLM 路由，15 维请求打分在 1ms 内选最便宜可用模型并带回退链，已接 Claude Code、Hermes、OpenClaw，可与免费额度聚合网关对照。 〔新〕
- **[microsoft/agentrc](https://github.com/microsoft/agentrc)** — 扫描仓库生成 copilot-instructions、MCP 配置、AGENTS.md，并产出 eval 用例检验指令是否仍有效，补上“配置生成后如何验证”的一环。 〔新〕
- **[Caterpillar（安装前 Skill 扫描器）](https://github.com/alice-dot-io/caterpillar)** — 在安装前扫 SKILL.md，提供 Alice 云端、自带 OpenAI key、纯离线三种模式，便于比较托管扫描与本地规则的实际差异。 〔新〕
- **[ClawSec（SentinelOne 安全 Skill 套件）](https://github.com/prompt-security/clawsec)** — Prompt Security（SentinelOne）为 OpenClaw/Hermes/PicoClaw/NanoClaw 做的 AGPL 安全 skill 套件，带签名情报、漂移检测和 skill 完整性校验。 〔新〕
- **[promptinject-agent-skills（投毒 Skill 研究样本）](https://github.com/aisa-group/promptinject-agent-skills)** — 基于 Anthropic 默认 skill 构造的投毒 skill 复现仓库，包含 full_upload 与 url_injected 两种载荷，可用于检验扫描器的召回。 〔新〕
- **[OWASP AST10 Universal Skill Format v1.0](https://github.com/OWASP/www-project-agentic-skills-top-10/blob/main/universal-skill-format.md)** — AST10 页面链出的跨平台签名 manifest 规范，声明文件/网络/命令权限、来源签名和 scan_status，可直接与 grith 的权限清单提案对照。 〔新〕
- **[CSA MAESTRO（Agentic AI 威胁模型）](https://cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro)** — Cloud Security Alliance 的 7 层 agentic AI 威胁建模框架，OWASP AST10 把 10 类风险逐条映射到它，是安全分层的上游参照。 〔新〕
- **[mise skills sync（packslip 资源消费端）](https://mise.jdx.dev/dev-tools/packslip-resources.html)** — 按声明的资源把 skill 安装到对应工具版本目录，并支持 auto_sync/prune，解决 skill 与工具版本漂移。 〔新〕
- **[AI Threat Atlas](https://threatatlas.ai/technique/trustfall-mcp-project-config-rce)** — 把 TrustFall、MCP 投毒等 agent 攻击整理成带复现步骤和缓解措施的 technique 库，适合作为安全用例索引。 〔新〕
- **[OpenSourceMalware.com](https://opensourcemalware.com)** — Snyk 报告中引用的开源恶意软件研究索引，可作为 skill/包供应链 IOC 的补充来源。 〔新〕
- **[Everything Claude Code（ECC）](https://github.com/affaan-m/everything-claude-code)** — 约 29.6 万★（2026-11-03；原 everything-claude-code 已改名 affaan-m/ECC，URL 会重定向）的 Claude Code harness/配置/Skill 生态，AgentShield 即出自该体系，代表“整套配置层”而非单点工具。 〔本仓已有：docs/decisions/skills-and-plugins.md〕
- **[cc-foundry](https://github.com/xobotyi/cc-foundry)** — 把作者的日常 coding 纪律（如何写、提交、规划）做成插件市场，规则附理由，并参与 XERJ Corpus Hub。 〔新〕
- **[Penpot MCP Server](https://penpot.app/penpot-mcp-server)** — 开源设计工具的 MCP server，支持设计与代码双向工作流，是 Figma MCP 白名单争议下最直接的开源替代入口。 〔新〕
- **[openai/codex symlinked skills issue #8369](https://github.com/openai/codex/issues/8369)** — Codex 不跟随符号链接目录发现 skill 的已知问题，Cursor 论坛同题缺陷直接引用它，说明多 harness 的 skill 发现语义仍不统一。 〔新〕
- **[NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector)** — NVIDIA Verified Skills 管线的开源技能扫描器，71 条规则/17 类、静态+可选 LLM、输出 SARIF，被 OWASP AST10 推荐且 Adversa 实测八款之一。 〔本仓已有：docs/10〕
- **[OASB（Open Agent Security Benchmark）](https://github.com/opena2a-org/oasb)**（2026-08-09） — OpenA2A 的技能安全基准（4,245 样本、9 类攻击、适配器接口），但 2026-08-09 撤回了 F1/精确率等对比指标，因 3,704/3,881 良性样本是用 HackMyAgent 自己的输出标注的。 〔新〕
- **[MalSkillBench](https://github.com/lxyeternal/MalSkillBench)** — 运行时验证的恶意技能基准（3,944 恶意＋4,000 良性，共 7,944 样本；arXiv 2606.07131），被 Adversa 用作七款扫描器 bake-off 的统一语料，可复现横向比较。 〔新〕
- **[SkillTrustBench](https://huggingface.co/datasets/cuhk-zhuque/SkillTrustBench)** — 腾讯朱雀实验室与港中大（深圳）发布的 5,520 用例/9 类风险技能安全基准，公开榜单同时评扫描工具与被测模型。 〔摘要/待核〕
- **[SkillLite](https://arxiv.org/abs/2609.36879)** — 用本地小模型做证据引导的恶意技能审计，MalSkillBench F1 0.905、SkillTrustBench 0.966，且比最强基线快 3.5–4.9 倍。 〔新〕
- **[Faberlens 技能行为安全研究](https://faberlens.ai/blog/skill-safety-problem)** — 200 个最流行技能全部通过静态扫描，但 87% 会悄然降低 agent 安全性，主张用行为测试而非只看静态扫描。 〔新〕
- **[mondoohq/skillcheck](https://github.com/mondoohq/skillcheck)** — npx 即扫 25 个 agent 已安装的技能/插件/MCP，对照 1,200+ 已分析技能库；Adversa 实测其离线规则基本不检测、未收录技能一律 clean。 〔新〕
- **[skillcop](https://github.com/cfitzgerald-pd/skillcop)** — 以 Claude Code hooks 在加载前做纯 LLM 判定；Adversa 证明把指令写进技能即可让默认模型把 CRITICAL 翻成 clean。 〔新〕
- **[Claude Skill Antivirus](https://github.com/claude-world/claude-skill-antivirus)** — 扫整个技能目录而非只看 SKILL.md，内置 10 个引擎；作者用它全量扫了 SkillsMP 的 71,577 个技能并公布 0.13% critical。 〔新〕
- **[huifer/skill-security-scan](https://github.com/huifer/skill-security-scan)** — 中文 CLI 扫描器，输出 HTML/JSON 报告；Adversa 指出其 allowlist 信任 github.com.attacker.com 且漏多种编码。 〔新〕
- **[OpenA2A HackMyAgent](https://github.com/opena2a-org/hackmyagent)** — 一条 npx 命令扫项目/包凭据、MCP 配置、提示注入并跑攻击载荷；OASB 榜首，但在 4,000 个真实良性技能上误报 1,753 个。 〔新〕
- **[Fangcun-AI/SkillWard](https://github.com/Fangcun-AI/SkillWard)** — Python 技能扫描器，Show HN 发布，SkillLite 将其列为对比基线之一。 〔新〕
- **[AcidTest](https://github.com/chuckyatsuk/acidtest)** — npm 包，在 agent 执行前扫描第三方 MCP server 与技能。 〔新〕
- **[openclaw/clawscan](https://github.com/openclaw/clawscan)** — OpenClaw 的可组合扫描 harness，把多款扫描器结果交给 judge 并与多个技能安全基准对比，补 ClawHub 单点扫描的缺口。 〔新〕
- **[skillscan-security（已退役）](https://github.com/kurtpayne/skillscan-security)**（2026-07-03） — 2026-07-03 主动退役，作者结论是静态扫描技能不能当安全边界；这条负面结果比再列一个扫描器更有决策价值。 〔新〕
- **[Pipelock](https://github.com/pipelab-org/pipelock)** — 面向 agent 的可验证出口控制防火墙，管 egress 而非只扫静态文件，正对技能外发数据的主路径。 〔新〕
- **[HOL Guard](https://github.com/hashgraph-online/hol-guard)** — 自称 agent 杀毒软件并附带 plugin-scanner，覆盖插件/技能运行前扫描。 〔新〕
- **[AgentSecrets](https://github.com/The-17/agentsecrets)** — 零知识凭据代理，agent 只引用 key 名、凭据不进入上下文，直接针对技能窃取凭据的主路径。 〔新〕
- **[RankClaw](https://rankclaw.com)** — AI 审计了 14,706 个 OpenClaw 技能并报告 1,103 个恶意，是 ClawHub 生态规模最大的第三方审计之一。 〔新〕
- **[Clawned](https://clawned.io)** — 众包的 OpenClaw 技能公开扫描器，补商业扫描器之外的社区信号。 〔新〕
- **[modelcontextprotocol/ext-skills](https://github.com/modelcontextprotocol/ext-skills)** — SEP-2640 的参考实现与工作组文档（problem statement、related work、experimental findings），比 SEP 正文更适合追设计取舍。 〔新〕
- **[Gaia Skill Tree](https://github.com/gaia-research/gaia-skill-tree)** — 验证式技能树（机械去重+人工 L4 复核+作者奖励），也是“98/100 技能不够好”审计的执行方。 〔新〕
- **[OpenSkills](https://github.com/numman-ali/openskills)** — 一个 CLI 把 Claude Code 格式技能加载到所有 agent，解决跨客户端格式/目录差异。 〔新〕
- **[HarnessKit](https://github.com/RealZST/HarnessKit)** — 跨 agent 统一管理 skills/MCP/hooks/plugins/memory 的套件，正好覆盖本卡关注的五类入口。 〔新〕
- **[dart-lang/ai（pub skills 源码）](https://github.com/dart-lang/ai)** — pub.dev skills 包的源码仓库（pkgs/skills），把技能从 Dart/Flutter 依赖装进 IDE。 〔新〕
- **[Tessl CLI](https://github.com/tesslio/cli)** — Tessl 的 Agent Enablement 平台/CLI，用 Spec Registry 给库文档做版本化上下文，和技能市场是竞争路线。 〔新〕
- **[Agent Skills Manager](https://github.com/umutbozdag/agent-skills-manager)** — 单面板管理 8+ agent 的技能，解决技能散落各客户端目录的问题。 〔新〕
- **[SkillNav](https://github.com/skillnav-dev/skillnav-skill)** — 在 Claude Code 里搜 3,900+ MCP server 与每日 AI 日报的技能，是 MCP 发现层的一个入口。 〔新〕
- **[Stacklok ToolHive](https://github.com/stacklok/toolhive)** — 把每个 MCP server 跑在隔离容器并做逐请求身份/策略与可观测性，补 MCP 运行时安全。 〔新〕
- **[OpenZiti MCP Gateway](https://github.com/openziti/mcp-gateway)** — 基于 OpenZiti 的零信任 MCP 网关，不暴露公网端点即可访问内网工具。 〔新〕
- **[MCP Transparency Log](https://github.com/yassinht/mcp-transparency-log)** — 连续 37 天夜间测量 MCP registry 的透明日志项目，可用于观察 registry 生态变化。 〔新〕
- **[Stacklok Brood Box](https://github.com/stacklok/brood-box)** — 实验性硬件隔离 microVM，让 coding agent 在隔离环境运行并逐变更审查。 〔新〕
- **[Anthropic Sandbox Runtime](https://github.com/anthropics/sandbox-runtime)** — Anthropic 的 agent 沙箱运行时（原 anthropic-experimental/sandbox-runtime），是技能执行的隔离底座。 〔新〕
- **[Google Labs DESIGN.md](https://github.com/google-labs-code/design.md)** — 把设计 token 与设计理由写给 coding agent 的格式规范，补设计类技能的上下文标准。 〔新〕
- **[HTML PPT Skill](https://github.com/lewislulu/html-ppt-skill)** — 生成专业 HTML 演示的技能（36 主题/15 模板/47 动画），展示类技能的成熟样本。 〔新〕
- **[Memoir](https://github.com/zhangfengcdt/memoir)** — “Git for AI agent memory”的 Claude Code 插件，把记忆做成可版本化、可回滚的仓库。 〔新〕
- **[DeepMem Claude Plugin](https://github.com/deepmemteam/deepmem-claude-plugin)** — 跨会话持久语义记忆插件，同时提供 Open Plugins 清单，可对照不同记忆实现。 〔新〕
- **[Claude Supermemory](https://github.com/supermemoryai/claude-supermemory)** — Supermemory 的 Claude Code 持久记忆插件，补商业记忆服务的插件化入口。 〔新〕
- **[Formative Memory](https://github.com/jarimustonen/formative-memory)** — OpenClaw 的记忆插件，模拟生物记忆的关联、遗忘与综合，和给定记忆候选形成不同机制对照。 〔新〕
- **[CSA《AI Agent Skill Scanners: Bypassed Across the Board》](https://labs.cloudsecurityalliance.org/wp-content/uploads/2026/06/CSA_research_note_AI_agent_skill_scanner_bypass_20260610-csa-styled.pdf)** — 汇总对 ClawHub/Cisco/skills.sh 扫描器的绕过手法，适合作为安全结论的独立旁证。 〔新〕
- **[jdx/mise（skills 子命令）](https://github.com/jdx/mise)** — mise 已内置 skills 安装/同步，按工具版本交付对应技能，把技能版本绑定到已校验的发行版本。 〔新〕
- **[dynobox](https://dynobox.xyz/)** — 给技能做确定性行为测试的层，补足“安装后是否真的按预期生效”这一环。 〔新〕
- **[OnlyCLI MCP token 基准](https://onlycli.github.io/OnlyCLI/blog/mcp-token-cost-benchmark/)** — 对比 MCP 与等价 CLI 的 token 成本，自称 4–32×，可作为 MCP 取舍的量化反例（作者数据）。 〔新〕
- **[Context Mode](https://mksg.lu/blog/context-mode)** — 把工具返回压缩后再进上下文的实现，文章称 315KB→5.4KB，是 MCP 上下文税的另一解法。 〔本仓已有：docs/03、docs/13〕
- **[xingkongliang/skills-manager](https://github.com/xingkongliang/skills-manager)** — Tauri/Rust 的技能库与市场，支持预设、全局/项目工作区、多工具同步与 Git 备份。 〔新〕
- **[georgekhananaev/claude-skills-vault](https://github.com/georgekhananaev/claude-skills-vault)** — Arize 评测里的 Vault 技能集，npx 安装，是“短小处方型技能优于长篇百科”的实证样本。 〔新〕
- **[doobidoo/mcp-memory-service](https://github.com/doobidoo/mcp-memory-service)** — 被 GetUnblocked 点名的记忆 MCP，单 server 约加 2–5K 预载 token，适合量化记忆类 MCP 的固定开销。 〔新〕
- **[BenchFlow](https://github.com/benchflow-ai/benchflow)** — SkillsBench 的跑分执行框架，可自建技能评测任务，补 SkillsBench 只有结果没有跑法的问题。 〔新〕
- **[royalpinto007/Skill-audit](https://github.com/royalpinto007/Skill-audit)** — 31 条规则 + SARIF 输出的 npx 技能扫描器，适合做轻量本地门禁。 〔新〕
- **[borghei/Claude-Skills](https://github.com/borghei/Claude-Skills)** — 含 skill-security-auditor 的工程向技能集，代表社区自查而非专用扫描器的一路。 〔新〕
- **[Skillshare](https://skillshare.runkids.cc/)** — 跨 agent 同步技能库（符号链接或复制），HN 用户在用，属轻量自建方案。 〔新〕
- **[osrim/ski](https://github.com/osrim/ski)** — reptile.haus 文章点名的“skill 包管理器”，作者称其在相关讨论出现前一天发布，可作为“缺原语”需求真实性的时间戳证据。 〔新〕
- **[puniserv/skillcask](https://github.com/puniserv/skillcask)** — 综述称其为 lockfile-first、以 Composer 仓库为后端的 skill 包管理器，补上 Quiver 之外的第二份锁文件实现。 〔新〕
- **[luml-ai/AGENTS.lock](https://github.com/luml-ai/AGENTS.lock)** — HN 上的 AGENTS.lock，把 agents/skills/MCP 一起锁进一个 lockfile，可直接对照 microsoft/apm 的 apm.lock 设计取舍。 〔新〕
- **[linny006/agent-skill-registry](https://github.com/linny006/agent-skill-registry)** — 中文检索命中的 skill 包注册中心，强调发现、版本与跨 agent 安装，并讨论 SPDX、CycloneDX、package.json 等元数据标准。 〔新〕
- **[Embrace the Red：Scary Agent Skills](https://embracethered.com/blog/posts/2026/scary-agent-skills/)** — CSA 简报引用的隐藏 Unicode 指令研究，说明 SKILL.md 的不可见载荷为何静态扫描难以覆盖。 〔新〕
- **[OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)** — AST10 页面引出的 companion 框架，补 agentic 应用层风险分类，便于把 skill 风险放回整体威胁模型。 〔新〕
- **[xmcp](https://github.com/basementstudio/xmcp)** — MCP-UI 示例生态里的 MCP server 框架，代表“框架内置 UI 支持”的路线。 〔新〕
- **[Arcade](https://www.arcade.dev/)** — Smithery 页面公告其 MCP Proxy/managed identity 于 10-31 关停并导向 Arcade，是 MCP 托管层一次真实的产品整合与迁移样本。 〔新〕
- **[Skrun](https://github.com/skrun-dev/skrun)** — HN 62 分的 Skrun：把任意 agent skill 部署成 API，代表 skill 从指令包走向可服务化产物的方向。 〔新〕


**P3 · 官方团队、厂商与真实消费者做法（112 项）**

- **[nvidia/skills](https://github.com/nvidia/skills)** — NVIDIA 官方“已验证”技能目录：技能由各产品仓库维护、每日自动同步镜像，安装走 npx skills；覆盖 cuOpt、Jetson 等产品域。适合看多产品线如何集中编目而不复制维护，以及签名/卡片如何随技能分发。 〔新〕
- **[Trail of Bits codex-config（/goal 工作单）](https://github.com/trailofbits/codex-config)** — 安全团队的 Codex 公开默认配置，核心新意是 /goal 工作单契约（Objective/Scope/Constraints/Validation/Stop/Checkpoints/Evidence）与 goals vs skills 的职责区分；还给出安全研究目标的防奖励黑客清单（先查 issue/PR、二次验证、用 agentcov 量覆盖率）。 〔新〕
- **[Trail of Bits agentcov（aicov）](https://github.com/trailofbits/agentcov)** — 把 agent 实际读过的文件和行映射到 LCOV/.gcov 与专用 JSON（按行读次数、搜索命中、命令、任务元数据），用来量“审计到底覆盖了什么”。适合已有覆盖率管线、想验证 agent 是否真的读了关键代码的团队；不是测试覆盖率的替代品。 〔新〕
- **[google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills)** — Google 官方 Gemini API 技能库，附少见的一方评测：117 个生成 Python/TS 的 prompt，无技能基线 6.8%（3.0）/28%（3.1 Pro），加技能后 README 自报 87%/96%，失败定义为使用旧 SDK。作者同时承认技能更新机制仍不好、AGENTS.md 有时更有效。 〔新〕
- **[ArcBlock/agent-skills](https://github.com/ArcBlock/agent-skills)** — ArcBlock 团队插件集，agentloop 把 issue/PR 巡检做成定时 sweep：fresh review agent、独立 worktree、--merge 仅合并低风险通过项，人工用 GitHub 评论介入；另有 ALP 按话题按需加载公司知识。适合看无人值守循环的职责切分。 〔新〕
- **[Dart package skills（官方文档）](https://dart.dev/tools/pub/package-skills)**（2026-10-27） — Dart 3.13.3 文档（2026-10-27 更新）规定包内 skills/ 交付技能：目录名必须以包名前缀、dart run skills@ get 安装、skills_lint 校验、publish 自动打包、SKILL.md 建议 <500 行。与 pnpm 互补，展示语言生态如何解决技能命名冲突与版本随包。 〔新〕
- **[dart-lang/ai manual_evals](https://github.com/dart-lang/ai/tree/main/pkgs/manual_evals)** — Dart 官方实验包：一套给 agent 用的技能评测工具，支持 benchmark 技能、检查环境、分析工具调用、自动 A/B；技能脚本自带 pubspec，可独立解析依赖。适合想给技能做同题对照但不想自建框架的团队；标注实验性，API 可能变。 〔新〕
- **[Microsoft Agent Framework Skills（官方文档）](https://learn.microsoft.com/en-us/agent-framework/agents/skills)**（2026-10-23） — 2026-10-23 文档：支持文件型 SKILL.md、类定义技能与内联技能；C# 类技能可打包成 NuGet，用 dotnet add package + .UseSkill() 分发，Go 走 agent/skills 包。把技能当 SDK 组件分发的一种实现，可与包管理器路线对照。 〔新〕
- **[openai/plugins](https://github.com/openai/plugins)** — OpenAI 官方 Codex 插件示例库，每插件 .codex-plugin/plugin.json + 可选 skills/mcp.json/hooks.json/agents。含 figma/notion/expo/netlify 等合作插件，可对照 Claude 插件结构看清单与 hooks 信任差异；弃用声明在 [openai/skills 的 README 顶部](https://github.com/openai/skills)（该仓已标弃用并指向本库），openai/plugins 自身 README 未写弃用。 〔本仓已有：docs/05 §3.5〕
- **[anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)** — Anthropic 官方 11 个岗位插件（销售、法务、财务等），每包 skills+connectors+slash commands+subagents，社区统计仓库内 181 个一方 SKILL.md；文件型无构建。适合看“技能为主、命令为辅”的官方组织方式与 MCP 连接器绑定。 〔新〕
- **[aws/agent-toolkit-for-aws](https://github.com/aws/agent-toolkit-for-aws)** — AWS 官方 Agent Toolkit（GA）：MCP servers+skills+plugins 同仓，一套内容分发到 Claude Code、Codex、Cursor、Devin、Kiro；含 rules/ 与 setup-instructions/，Claude 侧插件已进 claude-plugins-official。多宿主打包与安装路径的官方样本。 〔新〕
- **[supabase/agent-skills](https://github.com/supabase/agent-skills)** — Supabase 官方技能仓：supabase 与 supabase-postgres-best-practices 两个宽技能，附 .mcp.json、release-please、vitest 测试，兼容 18+ agent 并同时提供 Claude 插件市场。适合看厂商把自家最佳实践写成技能的最小完整工程。 〔本仓已有：inbox〕
- **[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)** — Vercel Labs 官方技能集：react-best-practices（40+ 规则、按影响排序）、web-design-guidelines（100+ 规则）、writing-guidelines（80+ 规则）、vercel-optimize（先取指标再定位路由）。是“规则清单型技能”的代表，可与 Vercel 1 月 AGENTS.md 评测对照看触发问题。 〔新〕
- **[google/skills](https://github.com/google/skills)** — Google 官方 Google Cloud 产品技能库（含 index.json、plugins、.claude-plugin），用 npx skills add google/skills 安装；技能覆盖 GKE、BigQuery、Cloud Storage、Agent Platform 等。适合看大厂如何把云产品操作拆成大量窄技能并集中索引。 〔新〕
- **[browserbase/skills](https://github.com/browserbase/skills)** — Browserbase 官方 18 个浏览器技能，机制较新：browser-trace 抓 CDP 全量轨迹并按页切桶、autobrowse 读轨迹自我改进、safe-browser 用 CDP 门控+域名白名单、agent-experience 用子 agent 审产品对 agent 的友好度。适合评估浏览器自动化类技能的上限与安全边界。 〔新〕
- **[flutter/agent-plugins](https://github.com/flutter/agent-plugins)** — Flutter 官方团队插件仓：skills+rules+MCP 配置打包，10 个技能覆盖集成测试、widget preview/test、布局修复、路由、本地化等；明确“MCP 给工具，Skill 教怎么用”。适合移动端项目直接取用。 〔本仓已有：inbox、docs/13〕
- **[Google Antigravity Agent Skills（官方文档）](https://antigravity.google/docs/skills)** — Antigravity 2026-05 起采用 Agent Skills，工作区 .agents/skills、全局 ~/.gemini/...，并提供 /migrate-workflows 把旧的单文件 workflow 迁成技能目录；Gemini API managed agents 也自动发现 .agents/skills。是官方宿主侧迁移与目录约定的样本。 〔新〕
- **[QianWen-AI/qianwen-ai](https://github.com/QianWen-AI/qianwen-ai)** — 阿里千问云官方开源：把模型调用、选型、认证、用量、部署等封装成 9-10 个技能，并提供 qianwen skills search/install --dir CLI（installed/updated/noop 三态，要求先搜后装）。中国厂商把云 API“技能化+CLI 化”的一手样本。 〔新〕
- **[Prisma：Agentic Engineering at Prisma](https://www.prisma.io/blog/agentic-engineering-at-prisma)**（2026-05-20） — Prisma 官方工程文（2026-05-20）：Drive 流程（Plan/Execute/Review/Ship/Delivery Review）落成技能，Ignite 文档仓做跨仓单一事实源；提出“一工程师多 agent”。适合看技能如何承载团队流程而非单点配方。 〔新〕
- **[Prisma：Evolving Agentic Engineering（技能当接口）](https://www.prisma.io/blog/evolving-agentic-engineering-at-prisma)**（2026-06-22） — 同系列复盘（2026-06-22）：把技能从“叙述流程”改成“接口”（输入/输出/范围/质量标准），核心缩到 spec/plan/execute；承认多 agent 单任务可花数百美元、重流程主要在一个仓验证。是官方团队自我撤回过度流程的少见记录。 〔新〕
- **[bytedance/agentkit-samples](https://github.com/bytedance/agentkit-samples)** — 字节火山引擎 AgentKit 官方示例仓，含“运行 skills 的智能体”沙箱样例与多框架迁移示例；技能在这里是 agent 运行时能力而非编码助手配方。中文厂商官方仓库中可核的一手材料，但与编码 Agent 技能关系较弱。 〔新〕
- **[coderabbitai/skills（CodeRabbit 官方评审 Skill）](https://github.com/coderabbitai/skills)** — CodeRabbit 官方把 AI 代码评审做成可装入 35+ agent 的 Skill/插件，含从 GitHub PR 拉未解决评论并自动修复的 autofix。本仓 09 讨论评审层与工具输出，但未收商用评审器的 agent 原生入口；可核其“评论→修复”是否绕过人工判断。 〔本仓已有：research/2026-10-12-baml-and-review〕
- **[google/agents-cli（Google Cloud Agent CLI+Skills）](https://github.com/google/agents-cli)** — Google 官方 CLI 与 Skills，把编码助手变成构建、评测、部署 Google Cloud agent 的专家，支持 Claude Code/Codex/Antigravity，6.3k★。本仓官方团队入口缺 Google 这条；只对 GCP 用户有直接价值。 〔新〕
- **[paperclipai/paperclip（工作场景 Agent 管理应用）](https://github.com/paperclipai/paperclip)** — 面向工作场景的开源 Agent 管理应用（任务、审批、预算与运行记录），11万★。本仓 08/18 讲多 agent 与团队治理，但入口是 CLI/配置；这条补“把 agent 当员工管理”的产品形态，需核其权限模型是否只是 UI 包装。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[OrchestratorInc/agent-orchestrator（监督 Agent 直到合并 PR）](https://github.com/OrchestratorInc/agent-orchestrator)** — 从任务计划到合并 PR 监督一队编码 Agent，桌面 + iPhone/Android，1.4万★。与 Orca/Paperclip 同题但强调分支、评审、CI 失败闭环；本仓 08 未收这种“合并前全链路”的入口。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[mvschwarz/openrig（YAML 定义 Agent 团队）](https://github.com/mvschwarz/openrig)** — 用 YAML 定义持久 agent 团队，把 Claude Code、Codex、Pi 编成一个系统，由 lead agent 分派，8.6k★。本仓 08 讲子 agent/worktree，缺“团队即配置、跨 harness 常驻”的抽象；适合评估配置化团队的恢复与权限边界。 〔转 MULTIAGENT-LONG，本卡不深挖〕
- **[Agent Plugins Package Capabilities. IRC-A Asks: Who Authorizes Them at Runtime?](https://dev.to/sandrog/agent-plugins-package-capabilities-irc-a-asks-who-authorizes-them-at-runtime-33gg)**（2026-08-12） — 2026-08-12 的架构批评：Agent Plugins 1.0 统一了「行李箱」，但 manifest 只说明能力可用，不说明谁能在什么参数、时长和审计下执行；提出 keypair 注册、通道遮蔽、签名短时 DET、离线校验与撤销。适合补插件生态最缺的运行时授权层，不是重复官方规格。 〔新〕
- **[Agent Skills Drift：让 Skill 跟得上现实的反馈环](https://dev.to/gde/agent-skills-drift-a-feedback-loop-for-keeping-one-true-2il7)**（2026-10-31） — 2026-10-31 真实维护复盘：publishing-kit Skill 的预检通过仍有 22 个缺陷、安装版落后仓库 89 个提交、29 个行为改动未升版本；随后补 44 个回归测试、把警告改成脚本 guard。给出 observe→measure→encode→verify→release 的循环，适合 Skill 长期维护。 〔新〕
- **[My MCP integration got rejected. Almost nothing in the server had to change.](https://dev.to/eugeniya_ivanova_4a58eadc/my-mcp-integration-got-rejected-almost-nothing-in-the-server-had-to-change-npb)**（2026-09-07） — 2026-09-07 的上架复盘：ChatGPT 审核要求未认证 tools/list 返回 200、每个工具显式 readOnlyHint/openWorldHint/destructiveHint 及理由、裸字符串域名校验端点、审核员可登录的账号；作者改完 8-24 重提、9-4 通过。是 MCP marketplace 接收契约的一手样本。 〔新〕
- **[Code mode yields a 99.2% cost reduction in our systems](https://www.agent-swarm.dev/blog/code-mode-token-savings)**（2026-07-08） — 2026-07-08（10-10 更新）真实 workflow 记录：26 次底层调用合成 1 个脚本，只把 25,811 字符摘要送回模型，内部仍执行 26 次；99.2% 是上下文字符降幅，基线为建模值（3.26M 字符）且只抽样三分之一运行，属于成本机制证据而非账单承诺。 〔新〕
- **[Sx 2.0：把 Dropbox 文件夹当 Skill server](https://sleuth-io.github.io/sx/2026/07/10/your-dropbox-is-now-a-skill-server.html)**（2026-07-13） — 2026-07-13 HN 44 分；用共享 Dropbox 目录做团队 Skill 源，展示无服务端、低运维的分发组合。适合小团队，但缺少签名、权限和审计模型，需与 Sx 的 lockfile/scope 一起看。 〔新〕
- **[Mcptoon：token 高效的 MCP CLI 客户端](https://github.com/activeing123/mcptoon)**（2026-08-11） — 2026-08-11 HN 73 分/49 评；用 names-first 索引和按需取 schema 降 MCP 工具定义开销。评论质疑其展示按字符而非 token 计费、把 null/换行替换成非 ASCII 未必省 token；适合与 Two Token Bills 对读，验证「名字索引」是否真省。 〔新〕
- **[LiteLLM Skills Gateway：企业内 Skill Registry](https://docs.litellm.ai/docs/skills_gateway.md)**（2026-10-31；v1.107.0） — 2026-10-31 更新（v1.107.0）：把 Skill 做成企业内 Registry，从 git/子目录/zip 注册，经 marketplace.json 用 `/plugin marketplace add` + `/plugin install` 分发，支持 public/private 与按 key/team 授权。是企业 Skill 分发与治理的一种新组合。 〔新〕
- **[State of agent skills（Vercel 报告）](https://vercel.com/blog/state-of-agent-skills)**（2026-09-25） — 2026-09-25 厂商数据报告：skills.sh 7 个月到 100 万 Skill、近 2.8 亿累计安装，375 个 Skill（0.04%）占 62% 安装、前 1.2% 占 94%，近一半 Skill 只被装过一次。是规模与集中度的少见量化，但为 registry 运营方自报，需与独立评测交叉。 〔新〕
- **[my-claude-code-mods（Claude Code Mods 实例集）](https://github.com/YeonwooSung/my-claude-code-mods)** — 用官方 Mods/function hooks 做的 agent-profiler（会话耗时与 OTLP 导出）、context-inspector（上下文浪费分析）、time-machine（shadow-git 分支时间线）和 loop-detective（重复失败检测），展示 Mods 不止能改 UI；1,106★，本仓只提到 Mods 功能，未收生态实例。 〔新〕
- **[mcp-use v2](https://manufact.com/blog/mcp-use-v2)**（2026-07-29） — 2026-07-29 按无状态 2026-07-28 规范重写的 TS 框架，去掉 initialize/会话并拆出 server/client/agent/inspector 包；基准 10,982 vs 8,615 ops/s、冷启动 68 vs 152ms 均为 localhost 厂商自测。 〔新〕
- **[Pi Codex Connectors](https://github.com/wileai/pi-codex-connectors)**（2026-09-29） — 2026-09-29 的 Pi 扩展，借 codex app-server 的无模型线程把 ChatGPT/Codex 已连接器暴露给任意 Pi 模型，只用 3 个工具而非数百个 schema；依赖内部 alpha 搜索端点，可用性和 schema 可能变。 〔新〕
- **[Figma 远程 MCP 白名单排除 Pi](https://techcrunch.com/2026/10/20/figma-co-founder-dylan-field-thinks-mcp-is-not-a-perfect-protocol/)**（2026-09-30） — 2026-09-30 起 Figma 远程 MCP 只接受白名单客户端，Pi 被排除（本地只读 MCP 仍开放），是宿主厂商按 OAuth 客户端名控制第三方 Agent 接入的实例；TechCrunch 为搜索摘要，改名绕过与后续支持 Pi 的说法未独立核。 〔摘要/待核〕
- **[Anthropic 将 Agent Skills 捐给 AAIF](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation)**（2026-10-22） — 2026-10-22 把 Agent Skills 的名称、logo、GitHub 组织与 agentskills.io 域名转给 Linux Foundation 下的 Agentic AI Foundation，官方自报 70+ 平台集成、100 万 Skill、2.8 亿次安装，路线图含版本化发布、正式提案流程与安全指引；治理刚起步，厂商数字不能当独立采用率。 〔转 A-FRONTIER-WIDE-SCAN-20261027〕
- **[Figma 远程 MCP 客户端白名单争议](https://news.ycombinator.com/item?id=49922729)**（2026-10-01） — 2026-10-01 HN 189 分/35 评论：Figma 远程 MCP 只允许白名单客户端、Pi 被排除，评论中有用户用改 client name 绕过、也有人报告桌面 MCP 只读与配额/收费；提醒不要把关键设计或数据流程绑在单一厂商 MCP 上，原帖为 Figma 人员 X 帖，HN 讨论可读而 X 未取正文。 〔新〕
- **[Snyk Agent Scan](https://github.com/snyk/agent-scan)** — Snyk 的 Agent Scan 同时扫描 agents、MCP servers 与 skills，覆盖提示注入、恶意代码和凭证处理，并附技能生态安全报告，可作为企业侧扫描基线。 〔新〕
- **[Agent Threat Rules（ATR）](https://github.com/Agent-Threat-Rule/agent-threat-rules)** — ATR 提供开放的 YAML 检测规则格式、844 条规则和 `atr scan` GitHub Action，可把技能/MCP 威胁检测接进 CI，而不是绑定某一家扫描器。 〔新〕
- **[AIAgentConform](https://github.com/rao-anant/aiagentconform)**（v0.3.0） — 针对 Agent Plugins 1.0.0 的开源一致性检查 CLI（v0.3.0），用 20 条规则检查 manifest、skills、MCP 配置和路径，并把失败链接回规范条款，适合放进插件发布 CI。 〔新〕
- **[Gaia Skill Tree 安装量审计](https://gaiaskilltree.com/meta/reports/2026-08-10-98-out-of-100-arent-good-enough.html)**（2026-08-10） — 2026-08-10 对 skills.sh 前 100 名的审计发现 73 个来自两个厂商捆绑（Lark/Feishu 50、Microsoft/Azure 23），结论是榜单衡量分发而非质量，直接反驳用安装量选技能。 〔新〕
- **[CodeAlive Remote Skill Assessment](https://github.com/CodeAlive-AI/ai-driven-development/blob/main/skills/skills-management/references/remote-skill-assessment.md)** — 给出可执行的 skills.sh 安装前检查表（安装量、agent 分布、年龄、来源、fork、依赖），适合做团队审查流程的起点。 〔新〕
- **[microsoft/azure-skills](https://github.com/microsoft/azure-skills)** — Microsoft 官方的 Azure 插件，把 Azure 技能与 Azure MCP（200+ 工具）和 Foundry MCP 打包，是“技能+执行层”组合的真实样本；注意 skills.sh 上 8.6M 安装被 Gaia 指为产品捆绑。 〔新〕
- **[larksuite/cli](https://github.com/larksuite/cli)** — Lark/Feishu 官方 CLI，内置 26 个 Agent Skills 和 200+ 命令并支持多种 Agent，是企业 SaaS 把自身能力做成技能分发的案例；其榜单安装量同样受捆绑影响。 〔新〕
- **[googlemaps/agent-skills](https://github.com/googlemaps/agent-skills)** — Google Maps Platform 官方技能，运行时通过 Code Assist 取最新文档并提供 demo key，展示“技能不靠训练记忆、每次取权威文档”的写法，也支持 Gemini CLI 扩展安装。 〔新〕
- **[dart-lang/skills](https://github.com/dart-lang/skills)** — Dart 官方团队的技能库（测试、CLI、FFI、运行时错误等），用 `npx skills add` 安装，可与给定的 package skills 文档对照看官方如何组织领域技能。 〔新〕
- **[SystemOneHarness（SOH）](https://github.com/HarnessRouter/SystemOneHarness)** — 从 HarnessRouter 的 Show HN 评论追到同团队的另一个 harness 实现，可看“harness 与特定模型配套”这条与统一路由相反的路线。 〔新〕
- **[VoltAgent/official-mcp-servers](https://github.com/VoltAgent/official-mcp-servers)** — awesome-openclaw-skills 头部的官方 MCP 索引，和该 skill 目录同一维护方，可补“官方 MCP 服务从哪找”的入口。 〔新〕
- **[xAI plugin marketplace](https://github.com/xai-org/plugin-marketplace)** — last30days 的 Grok 发行路径指向 xAI 官方插件市场，是 Claude/Codex 之外新增的 skill/plugin 分发渠道。 〔新〕
- **[sanjay3290/ai-skills（跨客户端可移植 Skill）](https://github.com/sanjay3290/ai-skills)** — 明确按 Agent Skills 标准组织的可移植 Skill 集，支持 Claude Code 等多家客户端，适合比较“标准格式 vs 厂商私有格式”。 〔新〕
- **[vercel-labs/agent-desktop（桌面 accessibility-tree computer use）](https://github.com/vercel-labs/agent-desktop)** — 通过 OS accessibility tree 读写桌面应用的 computer-use 库，被 cc-haha 采用，可替代纯截图式桌面自动化。 〔新〕
- **[onecli/onecli（Agent Vault / 企业沙箱 agent）](https://github.com/onecli/onecli)** — 给企业员工每人一个沙箱化个人 agent，含凭据网关 Agent Vault，被 NanoClaw 选作默认 gateway，可看 Agent 的凭据隔离做法。 〔新〕
- **[chrlschn《MCP is Dead; Long Live MCP!》](https://chrlschn.dev/blog/2026/03/mcp-is-dead-long-live-mcp/)** — HN 评论里的主要反驳：区分本地 stdio MCP 与远程 HTTP MCP，强调后者在企业集中鉴权、遥测、治理和临时运行环境中的价值。 〔新〕
- **[Milvus：MCP/CLI/Skills 实践比较](https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md)** — 从 Zilliz 自身工具链出发比较三者，给出启动即占约 72% context、三个 server 约 143K token 等数据，并主张 MCP over HTTP 保留企业场景。 〔新〕
- **[syedabbast/skill-scanner（静态 Skill 扫描器）](https://github.com/syedabbast/skill-scanner)** — 零依赖静态扫描 SKILL.md 与随附脚本，25+ 规则覆盖提示注入、凭据泄露、外传、恶意执行和供应链，支持 --fail-on high 进 CI。 〔新〕
- **[hetchy](https://github.com/sleuth-io/hetchy)** — sx 团队的伴生项目，用 Go 库嵌入 sx 来无人值守运行 coding agent，补上“Skill 分发之后如何自动执行”的一段。 〔新〕
- **[Agent Skills 官方规范站](https://agentskills.io)** — Anthropic 发起并开放的 Agent Skills 规范与 client showcase，明确 SKILL.md 目录结构、渐进披露三阶段和跨产品支持清单，是校验各市场/管理器兼容性的基准。 〔本仓已有：docs/05〕
- **[Anthropic: Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)** — Code Mode 的原始工程文章与 98.7% token 削减数据来源，是评估 agent-swarm 与 mcptoon 类方案时的对照基线。 〔新〕
- **[jasonswett/llm-skills](https://github.com/jasonswett/llm-skills)** — SaturnCI TDD Skill 的源码仓库，另含独立的 Test Design Review 与 Software Design Review Skill，展示“用另一个 agent 审测试设计”的组合用法。 〔新〕
- **[DataRobot Agent Skills](https://github.com/datarobot-oss/datarobot-agent-skills)** — 厂商官方把平台能力封装成 coding agent Skill 的实例（32 stars，2026-10 仍活跃），适合观察“产品文档 → Skill”的转换质量。 〔新〕
- **[Every Agent](https://agent.every.to)** — Every 用 Slack 共享 agent + 可保存复用 Skill 替换个人 agent 的真实生产案例，配套文章给出改用 Claude Managed Agents 后的成本与厂商锁定取舍。 〔新〕
- **[阿里云 MSE AI Registry（Nacos AI Registry）](https://www.alibabacloud.com/help/en/mse/user-guide/ai-registry-skill-quick-start-guide)** — 企业私有 Skill 注册中心：Draft→Pending→Released、提交时提示注入/合规扫描、版本与标签、workspace 隔离、RAM 权限、单版本下线与回滚，可作为团队内部分发 Skill 的参照。 〔新〕
- **[OWASP Agentic Skills Top 10（AST10）](https://owasp.org/www-project-agentic-skills-top-10/)**（v1.0） — OWASP Incubator 项目 v1.0-2026，把 Agent Skill 的风险做成 AST01–AST10 并映射 CSA MAESTRO，为团队审查清单和术语提供共同框架。 〔新〕
- **[SkillGuard](https://arxiv.org/abs/2606.03024)** — 把 Skill 当带权限的可执行制品，双平面治理上下文影响与运行时动作；在 1,260 个真实 Skill 上覆盖 99.93% 受保护对象，SkillInject 上下文注入成功率从 35.3% 降到 20.7%。 〔新〕
- **[CSA：SKILL.md 与 Agent Context Poisoning 简报](https://labs.cloudsecurityalliance.org/research/csa-research-note-skill-md-agent-context-poisoning-20260506/)** — 把 ToxicSkills、CVE-2025-59536、Unicode Tag 注入和 clawdhub 活动串成企业威胁模型，并给出 0–90 天的 registry/签名/监控处置清单。 〔新〕
- **[reviewtimes.fyi](https://reviewtimes.fyi/claude-plugins)** — 用开发者提交的报告统计 Claude 插件目录审核时长：决定中位 36 天（通常 14–53 天），已批准样本的中位审批 14 天（当前 Approved 11、Rejected 1、Waiting 1），并提供 JSON，补上官方不公开的队列可见性。 〔新〕
- **[Grimoire / grim（基于 OCI registry 的 Agent 制品管理器）](https://github.com/grimoire-rs/grimoire)** — 把 skill、rule、agent、MCP server、bundle、hook 都打包成 OCI 制品并用 digest 锁版本，复用 GHCR/Docker Hub，无需自建注册服务；与 spm/qvr 的 Git 依赖模型形成另一种分发路线。 〔新〕
- **[ClawSweeper](https://github.com/openclaw/clawsweeper)** — 面向 OpenClaw 仓库的保守型审查机器人，按计划/事件扫描 issue 与 PR、只在高置信度且通过确定性安全门时提出关闭，可作为 Skill/插件仓库自动治理的参考实现。 〔新〕
- **[figma-console-mcp](https://github.com/southleft/figma-console-mcp)** — Figma 白名单争议的 HN 评论区多次点名它：通过桌面插件桥接实现 LLM 驱动的设计、导出等写操作，被评价为“这一类的标准做法”，是绕过官方远程 MCP 限制的第三方路线。 〔新〕
- **[MCP-UI（@mcp-ui/client）](https://github.com/MCP-UI-Org/mcp-ui)** — MCP Apps 官方文档指定的客户端渲染方案之一，提供 React 组件来渲染和交互 MCP App 视图，适合需要在自己宿主里支持交互式 MCP UI 的场景。 〔新〕
- **[Archestra](https://github.com/Archestra-AI/archestra)** — MCP Apps 官方客户端支持矩阵中列出的开源 MCP 宿主/平台，与 MCPJam、Goose、Postman 并列；可作支持 Apps 扩展的客户端实现对照。 〔本仓已有：research/2026-10-15-exploration-evidence〕
- **[OpenAI Codex 插件规范与市场](https://developers.openai.com/plugins/concepts/plugins)** — OpenAI harness-aware 评测文里实际安装和评测的对象就是 Codex plugin（.mcp.json、plugin marketplace、权限配置）；这页是插件形态的官方定义，可对照 Claude plugin/SKILL.md 与 MCP 打包方式。 〔新〕
- **[txcript（“AI 对话的 Pandoc”）](https://github.com/skillsynchq/txcript)** — Skillsync 团队的另一项目，在 Claude Code、Codex、OpenCode、Cursor、Pi、Cowork、Hermes、Amp 等会话格式间迁移消息/推理/工具调用，并提供只读 MCP server，可用于跨 agent 会话复用与取证。 〔新〕
- **[mattpocock/skills](https://github.com/mattpocock/skills)** — skills.sh 榜单前 15 里占 6 席（grill-me、grill-with-docs、tdd、handoff 等），是当前安装量最高的个人 Skill 发布者，可作为“高采用 Skill 实际写了什么”的样本。 〔本仓已有：docs/13〕
- **[DashClaw](https://github.com/ucsandman/DashClaw)** — declick README 里可选的治理/审批守卫（dashclaw.io）：为生成的 CLI 命令加审批与策略层，适合与 declick 的本地策略、审计日志一起看 agent 执行安全。 〔新〕
- **[Aguara（本地 skill/MCP/设置扫描器）](https://github.com/garagon/aguara)** — 不执行、不上传、不调用 LLM，静态检查 skill、MCP 配置、Claude settings 与依赖锁文件，含 258 条检测；适合安装前取证与 CI 门禁。 〔新〕
- **[Mintlify skill.md（文档站发布 skill）](https://www.mintlify.com/blog/skill-md)** — 文档站自动在 /.well-known/skills/default/skill.md 发布面向 agent 的精简 skill，是“文档即 skill”的分发方式，并明确替代了此前采用率低的 install.md。 〔新〕
- **[Prisma Gremlin（任务到 PR 的 agent）](https://www.prisma.io/blog/gremlin-turning-open-tasks-into-pull-requests)** — Mastra 编排 + OpenCode 沙箱，把 Sentry/Linear/Slack 的小任务变成可评审 PR；给“PR 作为 agent 产品接口”一个真实团队实现。 〔新〕
- **[Cloudflare skills（官方 skill 包 + MCP）](https://github.com/cloudflare/skills)** — 19 个 Cloudflare 官方 skill 加主 MCP server 的打包示例，覆盖 Workers、Agents SDK、Durable Objects、sandbox；厂商 skill 与 MCP 同包分发的样板。 〔新〕
- **[NVIDIA Trustworthy-AI skill card generator](https://github.com/NVIDIA/Trustworthy-AI/tree/main/skills/skill-card-generator)** — 生成含 ownership/license/dependencies/risks 的 skill card，配合 OMS 签名形成可审计治理记录，是 skill 发布前的轻量治理模板。 〔新〕
- **[atlassian-labs/mcp-compressor](https://github.com/atlassian-labs/mcp-compressor)** — 把任意 MCP server 包成只暴露 get_tool_schema/invoke_tool 的代理，支持压缩级别、TOON 输出与响应截断，是 MCP token 治理的可落地实现。 〔新〕
- **[Tencent AI-Infra-Guard](https://github.com/Tencent/AI-Infra-Guard)** — 腾讯的 AI 基础设施安全/红队套件，已包含 ClawHub skill 扫描（edgeone-clawscan），可作中文厂商方案对照。 〔新〕
- **[AIR Agent Supply Chain Framework](https://www.air.security/blog-posts/agent-supply-chain-framework)** — AIR 提出的四步 add-on 治理框架（盘点、管控安装更新、持续审查、快速移除），并附面向 2027 的记分卡，覆盖 plugin/MCP/skill。 〔新〕
- **[AIR MCPJacking](https://www.air.security/blog-posts/mcpjacking)** — 实测官方 MCP Registry 中 155 个后端域名已过期的条目可被重新注册接管，直接说明静态目录的信任缺口。 〔新〕
- **[MCP ext-apps（官方 Apps SDK）](https://github.com/modelcontextprotocol/ext-apps)** — MCP Apps 的官方规范、AppBridge 与多框架示例，含 sandbox iframe 与 postMessage 的完整实现。 〔新〕
- **[MCPJam Inspector](https://github.com/MCPJam/inspector)** — MCPJam 开源的核心 inspector/CLI，可在本地和 CI 对 MCP server 做一致性测试与客户端矩阵回放。 〔新〕
- **[Claude Code Mods（官方 UI 扩展）](https://code.claude.com/docs/en/plugins/mods/overview)** — 官方新增的 Mods 机制，用 hooks/calls 改界面且默认开启，但不被沙箱隔离、也改不了权限提示，是新的插件攻击面。 〔新〕
- **[claude-code-playground Mods 示例](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods)** — 官方示例 mods：token-weather、blast-radius、replay-theater，可用来判断 Mods 的实际能力边界。 〔新〕
- **[Cisco AI Defense mcp-scanner](https://github.com/cisco-ai-defense/mcp-scanner)** — 与已收 skill-scanner 同团队但覆盖 MCP server 面，补 MCP 与技能两条扫描线的对照。 〔新〕
- **[OWASP Agent Security Regression Harness](https://github.com/OWASP/agent-security-regression-harness)** — 厂商中立的可执行安全回归场景集，用于验证改 prompt/模型/工具/MCP 后不重新引入已知失败。 〔新〕
- **[Microsoft Agent Governance Toolkit](https://github.com/microsoft/agent-governance-toolkit)** — 微软的 agent 治理工具包，覆盖策略、审批与运行时治理，补技能扫描之外的部署治理层。 〔新〕
- **[nono](https://github.com/nolabs-ai/nono)** — Sigstore 团队做的 agent 沙箱/签名方向工具，值得看运行时隔离与来源验证。 〔新〕
- **[DeepSeek Harness（dsh）](https://github.com/deepseek-ai/deepseek-harness)** — DeepSeek 官方开源 agent harness，everything-is-a-plugin + Cordis，是本机 DSH 生态的上游。 〔本仓已有：docs/13、docs/01〕
- **[Anthropic Claude Plugins Official](https://github.com/anthropics/claude-plugins-official)** — Anthropic 官方 curated Claude Code 插件目录（内置+合作方），是插件分发的第一方基线。 〔本仓已有：docs/05 §3〕
- **[Hugging Face Skills](https://github.com/huggingface/skills)** — Hugging Face 官方技能集，hf-cli 为引导技能，覆盖数据集/训练/评估工作流。 〔新〕
- **[Sentry Skills](https://github.com/getsentry/skills)** — Sentry 官方技能集，走 claude plugin marketplace 安装，展示企业内技能分发。 〔新〕
- **[Remotion Skills](https://github.com/remotion-dev/skills)** — Remotion 官方技能集，可用 npx skills add 或 gh skill install，显示 GitHub CLI 也接入技能安装。 〔新〕
- **[IBM ContextForge](https://github.com/IBM/mcp-context-forge)** — MCP/A2A/REST 联邦 registry+proxy，集中治理、发现与可观测性。 〔新〕
- **[computerlovetech/agr](https://github.com/computerlovetech/agr)** — 带 agr.lock 的技能包管理器，把技能当 npm 依赖锁版本并可团队共享。 〔新〕
- **[Continuum-AI-Corp/OrcaReplay](https://github.com/Continuum-AI-Corp/OrcaReplay)** — 录制并离线逐字节重放 agent 运行、可从任意步换模型分叉，用于复盘与对比。 〔新〕
- **[GitHub CLI gh skill](https://cli.github.com/manual/gh_skill_install)**（v2.90） — Trail of Bits 与 reptile.haus 都在讨论 pinning，而 GitHub 官方在 2026-04 的 gh v2.90 提供 install/search/update/publish，并在 frontmatter 记录 git tree SHA，可直接与 Quiver 的锁文件路线对照。 〔新〕
- **[iflytek/skillhub](https://github.com/iflytek/skillhub)** — 中文检索（Skill 市场/注册中心）追到的科大讯飞开源自托管 Skill 注册中心（约 5.3k star），带发布、版本、审核，代表国内企业内部 registry 路线。 〔新〕
- **[withastro/rosie](https://github.com/withastro/rosie)** — 同文点名的 Astro 团队 Agent package manager，框架团队亲自下场做技能分发，和 TanStack Intent 同类但不同技术栈。 〔新〕
- **[kanyun-inc/reskill](https://github.com/kanyun-inc/reskill)** — 中文综述与 2026 生态盘点都提到的 npm 式 skill 管理器，支持私有 registry、semver/branch/commit 和 monorepo 子目录，是国内团队自建 registry 的实例。 〔新〕
- **[Camunda spm（per-repository skill package manager）](https://camunda.github.io/spm-cli/)** — Camunda 工程团队自研的按仓库 skill 包管理器，代表企业多仓、逐仓隔离的落地方式，而非全局个人库。 〔新〕
- **[rolecraft](https://github.com/rolecraft-sh/rolecraft)** — GitHub 搜索到的 security-first skill manager，每次 install 都跑安全扫描，把扫描从 CI 前移到安装器。 〔新〕
- **[SkillsBench](https://arxiv.org/abs/2602.12670)** — HN 364 分的 skill 效果基准，是少见的跨任务量化 skill 增益的公开 benchmark，可校验厂商宣称。 〔新〕
- **[Addy Osmani：Agent Skills 实践指南](https://addyosmani.com/blog/agent-skills/)** — HN 376 分的高信号实践长文，可作为社区侧“怎么用、何时不用”的基线，与官方文档交叉验证。 〔新〕
- **[UI Inspector](https://github.com/idosal/ui-inspector)** — MCP-UI 作者自己的 MCP-UI 应用检查器，是调试内嵌 UI 的实际工具，可与官方 ext-apps 工具链对比。 〔新〕


**P4 · 安全与可靠性：真实问题、事故、反例与防护工具（35 项）**

- **[We attacked our own MCP firewall：14/17 攻击穿透，硬化后仍有 2/23](https://dev.to/alexar76/we-attacked-our-own-mcp-firewall-with-its-source-code-open-14-of-17-attacks-got-through-now-2-of-2m7l)**（2026-10-23；v0.18） — 2026-10-23 对开源 MCP 防火墙 WARDEN 的白盒测试：v0.18 漏 14/17，0.19 剩 3 个，0.20 扩到 23 个攻击仍过 2 个；明确未跑真实模型、只测 hook 规则，且有误报（README 里的 DKIM 公钥被拒）。是 MCP 防火墙能力边界的少见公开回执。 〔新〕
- **[I Connected 3 MCP Servers to One Agent. It Got Scary Fast.](https://pragmatic-engineer.hashnode.dev/mcp-solved-the-interface-mcp-fabric-solves-the-chaos)**（2026-07-25） — 2026-07-25 的真实事故复盘：三个 MCP 同权后，读 README 与 promote 生产之间没有策略、审批和审计；暴露 verb-only 授权、名称碰撞、confused deputy、schema 漂移和审批疲劳。作者用 OPA + SHA-256 schema digest 做 MCP Fabric，评论给出 5/5 仅改目标环境/租户即可绕过的构造案例。 〔新〕
- **[【问题/对策】MCP outputSchema draft-07 被客户端拒绝](https://github.com/anthropics/claude-code/issues/94351)** — Claude Desktop/Cowork 的校验器只支持 JSON Schema 2020-12，而 MCP TypeScript SDK 默认发 draft-07：tools/list 正常、真正调用才报 unsupported dialect，连官方 Filesystem 扩展也全工具不可用；#86142 曾以 CLI 不复现被关闭，#88882 与 #94351 继续开放，选 MCP server 时要核 outputSchema 方言。 〔新〕
- **[【问题/对策】项目 settings 里启用插件不等于已安装](https://github.com/anthropics/claude-code/issues/83422)** — 把 enabledPlugins + extraKnownMarketplaces 提交到 .claude/settings.json 后，若 installed_plugins.json 没有该项目路径的安装记录，Skill/Hook 会静默缺失、无警告也不自动安装；marketplace autoUpdate 只刷新市场克隆、不更新已装版本，团队共享需逐项目 /plugin install 并另管版本。 〔新〕
- **[【问题/对策】Claude 插件市场“已过审”却长期不上架](https://github.com/anthropics/claude-plugins-official/issues/6272)** — 多个作者报告提交页显示 Passed review/Published，但数天到两个月仍未出现在 marketplace.json、也收不到邮件，官方无回复；同类 #6264、#3679，说明市场审核与目录同步之间有未公开断点，不能按“已过审”排定采用时间。 〔新〕
- **[【问题/对策】Claude Desktop 刷新市场后插件报 conflicting manifests](https://github.com/anthropics/skills/issues/1943)** — Desktop 每次刷新会给 strict:false 的市场条目合成 .claude-plugin/plugin.json 并复制 skills 数组，Claude Code 因两份清单冲突拒绝加载；这是 Desktop/CLI 共存的自动刷新副作用，不是插件本身写错。 〔新〕
- **[【问题/对策】官方 MCP Registry 大量条目已失效](https://github.com/modelcontextprotocol/registry/issues/1715)**（2026-10-04） — 作者对 2026-10-04 快照的 38,977 条最新条目核对 npm/PyPI/GitHub，13.9% 至少一项注册表未发现的问题（仓库不可达、版本已撤回或装不上）；另有 #1579 报 387 个 active server 既不声明 remote 也无 package，选 server 不能只看“在册”。 〔新〕
- **[【问题/对策】MCP 参考服务器的 destructiveHint 不可信](https://github.com/modelcontextprotocol/servers/issues/5059)** — git_create_branch 标 destructiveHint:false 却会把已存在的 packed ref 静默移到新 base、旧 tip 无 reflog；#5058 的 memory 工具也标非破坏性但每次重写整份 JSONL、丢掉未建模字段，接入时须按实际行为而非注释设权限。 〔新〕
- **[【问题/对策】hookify 在 Windows 用 ANSI 码页读 stdin](https://github.com/anthropics/claude-plugins-official/issues/6306)** — Claude Code 以 UTF-8 写 Hook stdin，但 hookify 四个 Hook 直接 json.load(sys.stdin)，Windows 按 cp936/cp1252 解码：非 ASCII 规则静默变乱码、永不触发，或抛 JSONDecodeError 后被 except 吞掉仍 exit 0；修法是显式 UTF-8 读 stdin，不能只看 Hook 返回成功。 〔新〕
- **[【问题/对策】Cursor 同名 Skill / 插件前缀冲突](https://forum.cursor.com/t/162287)** — 多仓库或多插件出现同名 Skill 时 Cursor 只显示裸名并把插件前缀剥掉，两个 /review 无法区分甚至不出现；官方员工给的临时办法是让各仓库 Skill 目录名唯一，长期需命名空间显示（Claude Code/Codex 已用 /plugin:skill）。 〔新〕
- **[【问题/对策】Cursor 不跟随 ~/.cursor/skills 的符号链接](https://forum.cursor.com/t/149693)** — 把 Skill 目录软链到 ~/.cursor/skills 后 SKILL.md 不被发现，官方确认是已知问题且同样影响 Rules；项目内 .cursor/skills 链接在 2.4.21 有人复测可用，dotfiles 共享需按位置区分。 〔新〕
- **[【问题/对策】Cursor 内置 Skill 无法关闭且随更新重建](https://forum.cursor.com/t/166056)** — ~/.cursor/skills-cursor/ 的 create-skill、review、autopilot 等内置 Skill 会自动重建并被 Agent 选用，官方没有关闭入口；用户只能写启动 Hook 改文件，属于跨更新易碎的 workaround（2026-07 报告）。 〔新〕
- **[【问题/对策】skills.sh 的 Socket 审计把测试夹具判为 HIGH 恶意](https://github.com/vercel-labs/skills/issues/2378)**（2026-09-29） — Archify 的故意失败测试夹具被 2026-09-29 审计标为 HIGH Malware、公开页显示 Fail，维护者请求按测试上下文复核却找不到复核通道；说明市场安全分不能直接当采用结论，也要保留申诉/刷新路径。 〔新〕
- **[【问题/对策】skills.sh 索引长期不刷新](https://github.com/vercel-labs/skills/issues/2192)** — 仓库 main 已更新，skills.sh 下载 API 返回的仍是旧文件（agent-creator 还是旧字段契约、Windsurf 包仍旧版），作者只能逐包提 re-index；用市场页判断版本会读到过期内容。 〔新〕
- **[【问题/对策】大 Skill 目录的语义重叠与路由](https://community.openai.com/t/1383626)** — Codex 用户在实践中遇到 app polish/frontend design、webapp testing/Playwright、game playtest/实现类 Skill 语义重叠，导致重复加载、归属不清和上下文浪费；帖中比较“合并成一份静态文档”与“加一层运行前路由”，尚无定论。 〔新〕
- **[【问题/对策】本地 Codex Skill 在 ChatGPT 会话不可见](https://community.openai.com/t/1408796)**（2026-10-22） — 用户在 Windows ChatGPT/Codex 应用里创建的本地 Skill 只能回到 Codex 用，Chat 说 not accessible、Work 报权限/网络错误；社区建议转成 MCP 加隧道，说明 Skill 仍不是跨 surface 可移植资产（2026-10-22 帖）。 〔新〕
- **[【问题/对策】2026-08-20 后自定义 Skill 突然不执行](https://community.openai.com/t/1391582)** — ChatGPT Web 与 Codex 上同一 Skill 包在 8-20 前后从正常变为只复述指令/报错，用户未改文件、跨环境复现，回帖有人把同类现象指向工具清单传播/会话初始化；没有官方根因，提醒升级后要重跑真实 Skill 任务。 〔新〕
- **[【问题/对策】MCP 认证成功但工具不暴露](https://community.openai.com/t/1403146)** — TikTok 官方 MCP 在 ChatGPT 成功添加并完成 OAuth，但会话里看不到任何工具；这类“连接成功≠能力可用”的缺口需按 surface 单独验收，不能以 /mcp 已连接作为接入完成。 〔新〕
- **[【问题/对策】Context7 Claude Code 插件未设 key 时 401](https://github.com/upstash/context7/issues/3167)** — Context7 的 Claude Code 插件在未设 CONTEXT7_API_KEY 时每次 401，Cursor Marketplace 插件则匿名连接且配额错误不提示要 key（#3406）；本仓推荐 Context7 前应把这条安装前提写清，不能假设插件自动带 key。 〔新〕
- **[【反例】Superpowers v7 brainstorming 追问过量](https://github.com/obra/superpowers/issues/2530)** — 27 条评论集中抱怨 v7 的 brainstorm 问题太啰嗦、打断明确任务；与本仓“按任务分流、清楚小改不启整套”一致，说明入口规则仍需按任务跳过，而非全流程默认。 〔新〕
- **[【反例】Serena 每查询文件系统轮询开销大](https://github.com/oraios/serena/issues/2153)** — 用户报告 Serena 资源占用高，维护者另开 #2145 讨论限流/关闭每查询 LSP 文件系统轮询、#2077 量化每符号调用一次 os.stat；本仓推荐 Serena 前应把大仓库开销列为退出条件。 〔新〕
- **[Clawdex（Koi 的安装前 Skill 查询）](https://clawhub.ai/wearekoi/clawdex)** — Koi 发布的安装前恶意 Skill 查询 Skill，调用 API 返回 benign/malicious/unknown，可接在 Skill 安装流程前做门禁。 〔新〕
- **[Snyk Agent Scan（原 mcp-scan）](https://github.com/invariantlabs-ai/mcp-scan)** — 发现本机 harness、MCP server 和 Skill 并扫提示注入、敏感数据与恶意载荷；注意它会启动 stdio MCP server 取工具描述，官方也要求不可信配置在沙箱里扫。 〔新〕
- **[Trail of Bits overtly-malicious-skills（恶意 skill 语料）](https://github.com/trailofbits/overtly-malicious-skills)** — 上条绕过实验的四个恶意 skill 源码公开，可用于测试自家扫描器、Hook 和安装门禁。 〔新〕
- **[1Password：skill registry 中的恶意 skill](https://1password.com/blog/from-magic-to-malware-how-openclaws-agent-skills-become-an-attack-surface)** — 独立安全厂商报告在 skill registry 中发现窃密恶意 skill，补第三方事件证据与攻击面分析。 〔新〕
- **[Beltdown / Beltdown2（Git 配置沙箱逃逸）](https://www.accomplish.ai/blog/beltdown-escaping-the-claude-code-sandbox/)** — Accomplish 利用仓库 .git/config 的 core.fsmonitor 在 harness 自身 git 调用中逃出 Claude Code macOS 沙箱，Beltdown2 对 Cursor CLI 复现同一类问题。 〔新〕
- **[PolySwarm ClawHavoc 记录](https://blog.polyswarm.io/the-clawhavoc-campaign)** — 记录 ClawHavoc 从 341 个恶意 skill 扩到 824、再到 10,700 的传播过程与 AMOS/后门载荷，补充 Koi 原帖的可读细节。 〔新〕
- **[Gecko Security：测试套件 RCE 绕过技能扫描](https://www.gecko.security/blog/rce-in-your-test-suite-ai-agent-skills-bypass-skill-scanners)** — 把恶意代码藏进 .agents/ 下会被测试运行器发现的测试文件，绕过只读 SKILL.md 与显式脚本的扫描器，补一类新攻击面。 〔新〕
- **[Check Point：Claude Code 项目文件 RCE 与 token 外泄](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files/)** — CVE-2025-59536/21852 的原始分析，是 OWASP AST10 引用的真实攻击案例。 〔新〕
- **[suchithnarayan/ai-skill-scanner](https://github.com/suchithnarayan/ai-skill-scanner)** — AI-first 扫插件/技能/hooks/MCP/LSP，可选 235 条 YAML 静态规则，并用随机 hex 分隔符包裹不可信内容防注入。 〔新〕
- **[Trail of Bits mcp-context-protector](https://github.com/trailofbits/mcp-context-protector)** — MCP server 的安全包装器，防 line jumping、配置漂移等上下文劫持。 〔新〕
- **[OpenEdison](https://github.com/Edison-Watch/open-edison)** — 确定性 agent 数据防火墙，专挡 lethal trifecta（私有数据+不可信内容+外发）。 〔新〕
- **[ClawHub Security Signals（arXiv 2606.01494）](https://arxiv.org/abs/2606.01494)** — 67,453 个技能版本的扫描器一致性研究：三家全报警仅 0.69%，说明单扫描器门禁不可靠。 〔新〕
- **[snyk-labs/toxicskills-goof](https://github.com/snyk-labs/toxicskills-goof)** — CSA 简报引用的 ToxicSkills 演示仓库，配合 36.82% 缺陷率数据可复现恶意 skill 检测。 〔新〕
- **[Check Point：CVE-2025-59536](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/)** — CSA 简报引用的 Claude Code 项目文件 RCE/API key 泄露研究，为“仓库内配置即攻击面”提供 CVE 级证据。 〔新〕


**P5 · 目录、市场与索引（52 项）**

- **[github/awesome-copilot](https://github.com/github/awesome-copilot)** — GitHub 官方组织维护的社区目录，汇总 Copilot 的 agents/instructions/skills/hooks/plugins，并提供 llms.txt 供 agent 机器读取、插件市场一键装。可作为对照 Copilot 侧能力面的索引（目录非机制）。 〔新〕
- **[officialskills.sh（厂商官方 Skill 目录）](https://officialskills.sh)**（2026-11-02） — 56 家厂商开发团队、660 个官方 Skill 的目录（2026-11-02 更新），含 Microsoft、OpenAI、Trail of Bits、Cloudflare、Google Workspace 等。本仓 12 只列了通用 awesome 列表，缺“官方厂商 Skill”这一独立市场；可作为安装前核来源的入口。 〔新〕
- **[wshobson/agents（多 harness 插件市场）](https://github.com/wshobson/agents)** — 跨 Claude Code、Codex、Cursor、OpenCode、Copilot、Antigravity 的插件市场（agents+skills+commands），4.2万★。本仓 05 只讲单客户端插件与迁移，缺多 harness 分发的实际样本；可核其“同一包多端”是否只是文本复制。 〔新〕
- **[VoltAgent/awesome-openclaw-skills（OpenClaw/ClawHub Skill 目录）](https://github.com/VoltAgent/awesome-openclaw-skills)** — 从 ClawHub（OpenClaw 公共 Skill 注册表）整理的 5,300+ Skill 分类目录，5.3万★。本仓 13 提 OpenClaw 产品，但没有其 Skill 市场与 ClawHub 入口；适合观察非 Claude 生态的 Skill 供需。 〔新〕
- **[sickn33/agentic-awesome-skills（近 3,000 Skill 可安装目录）](https://github.com/sickn33/agentic-awesome-skills)** — 2,884+ 可复用 Skill 的目录，带 AAS Core 本地目录发现与按工具安装流程，4.9万★。本仓 12 的 awesome 列表较旧，这条补“Skill 数量爆炸后如何本地发现/筛选”的问题。 〔新〕
- **[ComposioHQ/awesome-claude-skills（1,000+ Skill/插件列表）](https://github.com/ComposioHQ/awesome-claude-skills)** — 7.8万★ 的 Claude Skill/插件列表，覆盖 Claude Code、Codex、Cursor、Gemini CLI 等。注意它同时推广 Composio MCP Gateway，收录与商业内容混排；可作候选索引，不宜按 star 直接判断质量。 〔新〕
- **[awesome-dsh-plugin/awesome-dsh-plugin（DeepSeek Harness 插件目录）](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)** — DeepSeek Harness（DSH）的插件精选列表，2.2万★。本仓 13/02 已把 DSH 作为开放 harness 记录，但没有其“一切皆插件”的生态目录；可观察插件质量与遥测/权限风险，不把列表当安装推荐。 〔新〕
- **[Skillbay：人工策展的付费 Skill 市场](https://skillbay.sh/)**（2026-09-17） — 2026-09-17 HN 28 分/18 评；按 Craigslist 模式卖人工策展 Skill（合同红线、视频、网页设计等）。评论直接质疑「为什么要买一个 Markdown 文件，不让自己模型生成」，是 Skill 商业化与质量信号的反例。 〔新〕
- **[Agent-Skills.market：面向非开发者的 Skill 目录](https://agent-skills.market/)**（2026-10-19） — 2026-10-19 HN 16 分/10 评；10 类约 256 条人工改写的 Skill，明确面向非开发者，复制源链接到 AI 工具即可。未公开测试方法、审核标准或评审人资质，只能当发现入口，不能当质量背书。 〔新〕
- **[DSH Plugin Registry](https://dshplugin.app/)** — DeepSeek Harness 的社区插件目录已索引 3,450 个插件，按来源能力、安装路径、安全信号和兼容证据比较；这是 DSH“一切皆插件”之后的生态层，条目质量与安全信号口径未验。 〔新〕
- **[skills.sh（Vercel 技能注册表/安装榜）](https://skills.sh/)** — 几乎所有官方 Skill 仓库（Microsoft、Google、Supabase 等）都经它安装，页面带 Socket 扫描与安装量；但 issue #384 的静默压制争议和“前 600 条中 78 条指向已删技能”的索引问题说明它只能当分发入口，不能当质量或安全信号。 〔新〕
- **[ClawHub（OpenClaw Skill 注册表）](https://github.com/openclaw/clawhub)**（[市场站点](https://clawhub.ai)、[官方文档](https://docs.openclaw.ai/clawhub/how-it-works)） — OpenClaw 的公开技能注册表，支持版本、审核钩子、向量检索和 CLI API；市场站点是 ClawHavoc 事件发生地，适合观察市场审核、上架后改写与 TOCTOU 治理缺口；官方文档给出上传门禁、自动扫描、举报与审核状态。是 Claude/Vercel 之外的第三套分发路径，也是多份安全审计重点关注的对象。 〔跨卡：A-FRONTIER-WIDE-SCAN-20261027 已覆盖基线〕
- **[MCP Registry（官方）](https://github.com/modelcontextprotocol/registry)**（v0.1） — MCP 官方服务器注册表（预览版，API v0.1 已冻结），给 MCP 客户端提供类似应用商店的发现接口，是在接入 MCP 服务前核对来源与版本的基线。 〔新〕
- **[GitHub MCP Registry](https://github.com/mcp)** — GitHub 自家的 MCP Registry 页面，收录 773 个社区服务器并提供 Install 入口，可作为官方 registry 之外的消费端目录对照收录范围与安装体验。 〔新〕
- **[Docker MCP Registry](https://github.com/docker/mcp-registry)** — Docker 官方 MCP 目录，条目带签名镜像、SBOM 与容器隔离，适合需要供应链证明或不愿在本机直接运行 MCP 进程的场景。 〔新〕
- **[Google Antigravity Marketplace 与 agy plugin](https://antigravity.google/docs/marketplace/)** — Antigravity 的插件市场与 `agy plugin` 命令可把 skills、MCP、rules 和 subagents 打进同一插件，并提供 `validate --strict`，是非 Claude 宿主的完整插件分发样本。 〔新〕
- **[thirtysix/awesome-agent-skills](https://github.com/thirtysix/awesome-agent-skills)** — 安全优先的技能目录，除 6,343 个技能外还对比 53 个审查工具、105 篇论文并给出 20 项覆盖矩阵，适合回答“这个技能该查什么、哪个扫描器查得到”。 〔新〕
- **[Trail of Bits skills-curated](https://github.com/trailofbits/skills-curated)** — Trail of Bits 人工代码审查后发布的技能市场，明确因生态里出现后门和恶意 hook 而建立，可作为“先审后装”的组织级参考，而不是又一个技能集合。 〔新〕
- **[Agent Trust Hub](https://ai.gendigital.com/agent-trust-hub)** — 同一目录推荐的另一个信任/安全检查入口，与 Snyk agent-scan 并列，可作为 skill 安装前的第三方信誉来源候选。 〔新〕
- **[DSH Plugin Hub](https://dsh-plugin.org)** — dsh-egm 的发布目录，也是 DeepSeek Harness 的插件市场入口，补“非 Claude/Codex 的 harness 插件生态”这一路。 〔新〕
- **[NeoLabHQ/context-engineering-kit（上下文工程插件市场）](https://github.com/NeoLabHQ/context-engineering-kit)** — 面向 Claude Code/OpenCode/Cursor 的上下文工程插件市场，按插件粒度加载并刻意压低 token 占用，可对照本仓的上下文策略。 〔新〕
- **[mhattingpete/claude-skills-marketplace（Claude Code 插件市场）](https://github.com/mhattingpete/claude-skills-marketplace)** — 精选的 Claude Code 插件市场，可观察插件分类、安装入口与维护方式。 〔新〕
- **[gsxdsm/awesome-paperclip（Paperclip 生态索引）](https://github.com/gsxdsm/awesome-paperclip)** — Paperclip 官方 README 指向的插件/工具/资源列表，是顺着 Paperclip 找生态入口和替代做法的索引。 〔新〕
- **[Snyk ToxicSkills（ClawHub 与 skills.sh 扫描数据）](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)** — Snyk 对 ClawHub 与 skills.sh 共 3,984 个 Skill 的扫描（2026-02-05 快照；36.8% 至少一个问题、13.4% 严重），是多家 Skill 扫描器共同引用的量化依据，但样本跨两个市场，不能当单一 ClawHub 的统计。 〔新〕
- **[OpenClaw ClawHub 安全审计管线](https://docs.openclaw.ai/clawhub/security-audits)** — 公开了 SkillSpector、腾讯朱雀 A.I.G、ClawScan 三路扫描与 Pass/Review/Warn/Malicious 判定细节，并暴露单扫描器漏报、扫描器低重合等真实局限。 〔新〕
- **[royalpinto007/awesome-agent-skills](https://github.com/royalpinto007/awesome-agent-skills)** — 刻意做小的 46 条安全审慎清单，单列 Snyk ToxicSkills、Trail of Bits、OWASP AST10 与 skill-audit 等扫描/规范来源，适合当高信号索引。 〔新〕
- **[vivy-yi/awesome-skills](https://github.com/vivy-yi/awesome-skills)** — 声称 341 个仓库/4,500+ Skill 的目录，集中收录 Anthropic、OpenAI、Vercel、Hugging Face、Supabase、HashiCorp、Sentry 等官方 Skill 仓库，可用于补齐“官方团队自己怎么做”。 〔新〕
- **[Tessl Skills Registry](https://tessl.io/registry)** — 把 Skill 当版本化包管理（tessl install/outdated/update、tessl.json、发布版本），registry 同时展示质量、行为 uplift、Snyk 安全分和版本日期，直接补 skills.sh 只有安装量排名、缺版本与依赖治理的缺口。 〔新〕
- **[Claude Marketplaces](https://claudemarketplaces.com/)** — 独立目录，索引 23,379 个 Skill、12,742 个 MCP server、3,126 个插件市场，按真实安装量排序、每日从 GitHub 刷新并人工抽查，可作为 skills.sh 之外的覆盖对照。 〔新〕
- **[ProtocolProbe：MCP Registry vs Reality](https://protocolprobe.com/mcp/reports/registry-vs-reality)**（2026-10-04） — 用 2026-10-04 Registry 快照核 npm/PyPI/GitHub，发现 13.9% 条目至少一个问题（4,298 个仓库 404、663 个版本已弃用或 yank），并公开可复核数据集。 〔新〕
- **[skills.sh Packs](https://skills.sh/docs/packs)** — 把多个公开/私有/GitHub Skill 打成一个“未列出、凭链接安装”的包，更新只拉变化项；团队分发时比逐个 npx skills add 更接近包管理。 〔新〕
- **[Smithery](https://smithery.ai/)**（2026-10-31） — Arcade 的 MCP/toolkit 目录，托管认证、凭证和会话；需注意其 MCP proxy 与 managed identity 服务在 2026-10-31 结束，评估时要核替代路径。 〔新〕
- **[VoltAgent awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)** — 收录 1,497+ 个来自官方团队和社区、人工挑选的 Skill，并给各客户端安装路径；适合当头部覆盖清单，而不是自动抓取站。 〔新〕
- **[Awesome Skills](https://www.awesomeskills.dev)** — 搜索技能包管理器时反复出现的第三方 Skill 目录，给 qvr 等工具做单技能页，可作为 skills.sh/ClawHub 之外的收录列表对照（页面正文未逐条核）。 〔新〕
- **[Skillhound（公开 SKILL.md 索引）](https://www.skillhound.ai/)** — 索引公开 SKILL.md 的检索站，可用于发现长尾 skill、观察命名重复与生态分布。 〔新〕
- **[awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills)** — 77 个按引擎版本（Godot 4.7、Unity 6.3、Unreal 5.8 等）分组的游戏 skill 加 router，与本仓 game-dev 领域直接相关。 〔新〕
- **[localskills.sh](https://localskills.sh/)** — 团队级 Skill 分发服务，带 SAML SSO、SCIM、下载统计与审计日志，是企业内 Skill registry 的现成形态。 〔新〕
- **[ProtocolProbe（MCP 目录 + 实时探测）](https://protocolprobe.com)** — 独立 MCP 目录，对官方 registry 的 54,988 条记录逐条做只读探测，给出工具清单、可安装性和变更记录，正好补上 registry 只有发布时校验的缺口。 〔新〕
- **[XERJ Corpus Hub](https://hub.xerj.org/)** — 提供按任务下载、许可已核、可检索的固定语料库，让 agent 查证而不是凭记忆回答；cc-foundry 作者是其贡献者。 〔新〕
- **[SkillsMP（llms.txt 入口）](https://skillsmp.com/llms.txt)** — 社区 skill 市场，llms.txt 称聚合 300 万+ SKILL.md，提供 REST API 与 skillsmp.com/mcp，可作为跨仓库检索入口（首页对爬虫 403）。 〔新〕
- **[DSH Plugin Hub](https://github.com/dshplugin/dsh-plugin-hub)** — 社区维护的 DeepSeek Harness 插件市场，索引 2 万+ 插件、5 千+ 可一键安装，是 DSH everything-is-a-plugin 的实际生态。 〔新〕
- **[SkillsMP（目录概览）](https://skillsmp.com/)** — 与上条同一市场的目录概览：llms.txt 称 300 万+ SKILL.md；Claude Skill Antivirus 实际扫描了其中 71,577 个（0.13% critical），71,577 是扫描量，不是 SkillsMP 的自报收录量。首页对爬虫 403，条目量未独立核（摘要）。 〔摘要/待核〕
- **[Agensi](https://agensi.io)** — curated 技能市场（Show HN），主打人工筛选而非单纯按安装量排序。 〔新〕
- **[Claude Skills Registry](https://github.com/majiayu000/claude-skill-registry)** — 社区维护的 Claude 技能目录/JSON 索引，含独立技能数与插件统计。 〔新〕
- **[Awesome Design Skills](https://github.com/bergside/awesome-design-skills)** — 67 个设计系统技能文件的 curated registry，补设计类技能供给。 〔新〕
- **[SkillCatalog](https://skillcatalog.dev/)** — git 存储 + 桌面端/CLI 的技能目录，作者在 HN 自述，走“目录即真相源”路线。 〔新〕
- **[NAV agent 定制注册表（挪威劳工福利局）](https://ki-utvikling.nav.no/verktoy)** — 公开注册表列出 73 项 agent 定制、8 个领域并带采用统计，是少见的大型公共部门真实落地案例。 〔新〕
- **[LobeHub Skills](https://lobehub.com/skills)** — 跨 Claude/Codex/ChatGPT 的技能市场，Arize 实测中作为独立 skill 基线（正确率 0.826）。 〔新〕
- **[Skill Grill](https://skillgrill.dev/)** — 开源技能目录 + 社区信任层，作者在 HN 自述，强调 trust 而非数量。 〔新〕
- **[AgentScope Java 技能市场](https://java.agentscope.io/v2/zh/docs/harness/skill)** — 中文检索里的 AgentScope 技能市场：可从 Git/Nacos/MySQL/classpath 装载，并带“Agent 起草→审核→后台整理”的自学习闭环，与阿里云 MSE AI Registry 属同一路线。 〔新〕
- **[openskills.space](https://openskills.space)** — Skills Gateway 的后端服务（HN Show HN），提供 skill 检索/推荐 API，可看小团队做第三方 skill 索引服务的形态。 〔新〕
- **[Glama MCP Directory](https://glama.ai/mcp/servers)** — mcpcost README 引用的 MCP 目录（约 11.4 万 server，带 API/巡检），可作官方 MCP Registry 之外的第二份现实分布数据源。 〔新〕


**P6 · 摘要、待核或低信号（14 项）**

- **[agent-skills-eval：测 Skill 是否真的改善输出](https://github.com/darkrishabh/agent-skills-eval)**（2026-05-07） — 2026-05-07 HN 79 分；项目定位是对比「无 Skill/有 Skill」的评测骨架，把 Skill 从主观好评变成可失败检查。HN 评论追问是否有公开结果、示例模型是否过旧、judge prompt 如何迭代；说明这类评测工具仍缺可复算证据（本次仅读 HN 描述与评论，README 未逐页核）。 〔摘要/待核〕
- **[What languages are agent skills written in?](https://plicara.ai/research/agent-skill-languages/)**（2026-08-25） — 2026-08-25 HN 11 分的小型实证：统计公开 Skill 的语言分布。评论追问中文 Skill 是否被低估、非英语 Skill 是否改变模型推理语言和输出质量；适合补中文生态盲区（本次仅读 HN 帖与评论，原文未逐段核）。 〔摘要/待核〕
- **[SkillWire 技能目录](https://skillwire.net)**（2026-10-30） — 2026-10-30 出现的目录，按 harness、点名模型、任务结果、pinned source、warning 筛选并可社区投票，强调先看源码再选栈；页面依赖 JS，实际条目量和审核深度未核。 〔摘要/待核〕
- **[ffmpeg-skill](https://github.com/kajisho5/ffmpeg-skill)**（2026-09-03） — 2026-09-03 的 42 个 FFmpeg 工具以“机器可读契约 + MCP server”同包交付，是 Skill 与 MCP 组合成一个能力包的清晰样本；4.4K★，实际媒体处理结果未核。 〔摘要/待核〕
- **[Skillsync（YC W26）](https://skillsync.com)**（2026-09-17） — 2026-09-17 上 HN，把 Claude Code、Codex、Cursor、OpenCode、Pi 等本地会话转成可迁移格式，并在每次提示前检索旧结论，针对“换 Agent 就要从头开始”；跨格式转换完整性与隐私边界未核。 〔摘要/待核〕
- **[Declick](https://github.com/ucsandman/declick)**（2026-09-02） — 2026-09-02 的小工具，把 OpenAPI/MCP server/SQLite/网页编译成 Agent 可跑的 CLI，宣称比裸 MCP 少 4.1x 上下文；23★，属概念验证，复杂 API 的行为保真未核。 〔摘要/待核〕
- **[levnikolaevich/claude-code-skills](https://github.com/levnikolaevich/claude-code-skills)** — 中文检索摘要提到的插件套件，内置 hex-line（哈希校验编辑）、hex-graph（代码知识图谱）、hex-ssh 三个 MCP；机制尚未读原文，仅作摘要候选。 〔摘要/待核〕
- **[tons-of-skills-marketplace](https://github.com/jeremylongshore/tons-of-skills-marketplace)** — 中文检索摘要提到的 340 插件/1367 skills 大合集（原 claude-code-plugins-plus-skills 已改名），可作 skill 市场规模化样本；未读原文，标摘要。 〔摘要/待核〕
- **[some_claude_skills](https://github.com/curiositech/some_claude_skills)** — 中文检索摘要提到的 135+ 生产级 skills 包，含 prompt-learning-mcp 与 cv-creator-mcp；未读原文，仅作摘要候选。 〔摘要/待核〕
- **[awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit)** — 中文检索摘要提到的 135 agents/35 skills/150+ 插件索引，适合作为覆盖面清单；未读原文，标摘要。 〔摘要/待核〕
- **[aweskill（Agent 自己管理的 Skill 管理器）](https://github.com/Wehuman01/aweskill)** — 搜索“skill package manager”时出现的另一实现，主打 AI agent 直接操作、集中库 ~/.aweskill/skills 并投影到 40+ 工具，可作 spm 的“面向 agent 而非人”对照（仅读搜索摘要与仓库入口，正文未核）。 〔摘要/待核〕
- **[SkillLift](https://github.com/WalteR-MittY-pro/SkillLift)** — 搜索 Skill Issue/SkillsBench 时出现的学习式 Skill 进化方法：用 rubric 复现 oracle 偏好排名，把 oracle 调用从 O(L·T) 降到 O(L)，报告 40–70% token 节省（仅读搜索摘要，未核正文与实验）。 〔摘要/待核〕
- **[You don't need a skill registry（反方观点）](https://solmaz.io/skillflag)** — 主张对 CLI 工具而言独立 skill registry 是多余层；仅读标题与搜索摘要，用于校准 registry 热潮，未当作机制确认。 〔摘要/待核〕
- **[agentskill.sh](https://agentskill.sh/)** — 一条命令跨多客户端安装的技能目录；首轮可达、复审超时，正文未读，机制需再核。 〔摘要/待核〕


## 4. 去重与排除

**下列内容本仓已有，或已由其他产物覆盖，本卡只核差异、不重复深挖。** 其余候选按上表保留；标 P6 的摘要／未核项只作线索，不能作为机制或采用依据。

**本仓已有基线（不重复写结论）：**

- Agent Skills 规范、`SKILL.md` 结构、`description` 上限、渐进式披露与安装前审查：`docs/05-skills-and-plugins.md` §1–§2；`agentskills/agentskills`、`agentskills.io` 规范站。
- Claude 插件清单、OpenAI 插件打包契约、Claude 插件迁移：`docs/05` §3、§3.5；`anthropics/claude-plugins-official`。
- Superpowers、Serena、Context7、TanStack Intent、OpenSpec／Pi、ECC search-first、Cursor 同步 Skill、Skill 断链：`docs/decisions/skills-and-plugins.md`、`docs/13-frontier-radar.md`、`docs/24-community-workflows.md` 及对应 experiments。
- NVIDIA SkillSpector：`docs/10-security.md` 的扫描器表。
- SkillsBench：`docs/research/2026-10-13-domain-skill-contract.md`、`docs/research/2026-10-22-frontier-trials.md`。
- MCPorter：`docs/04`、`docs/13` 与 `experiments/mcporter-public-read.md`；DeepSeek Harness：`docs/13`、`docs/01-agents/open-source-agents.md`；OpenClaw：`docs/13` 时间线；GSD Core：`docs/21`；Flutter agent-plugins：`docs/collaboration/inbox.md`、`docs/13`；Supabase agent-skills：`docs/collaboration/inbox.md`；codebase-memory-mcp：`docs/research/2026-10-13-immich-handover.md`；Archestra：`docs/research/2026-10-15-exploration-evidence.md`；CodeRabbit skills：`docs/research/2026-10-12-baml-and-review.md`。
- `addyosmani/agent-skills`：`docs/09-review-and-quality.md` 已有引用；`mattpocock/skills`：`docs/13` 与 `docs/research/2026-10-22-frontier-trials.md` 已有试用记录。
- `vercel-labs/skills` 的安装与断链问题：`docs/decisions/skills-and-plugins.md#skills-linked-parent`；`gh skill` 的安装语义不在本仓正文；本仓只在 `docs/09`、`docs/20` 使用 GitHub CLI 做只读结果采集。
- RTK、context-mode、Hippo、Graphify、MCPorter 等已试／已评估条目：`docs/03`、`docs/13`、`experiments/`；本卡不重讲机制，只保留同题的新反例。

**跨卡／跨产物转交（只留链接与归属，不在本卡重写）：**

- [openqodex/openqodex](https://github.com/openqodex/openqodex)：独立 reviewer＋确定性扫描器的评审工具，转 VERIFY-REVIEW。
- [Mir-Zairan/pitlane](https://github.com/Mir-Zairan/pitlane)：每 worktree 的依赖／.env／数据库／端口隔离，转 MULTIAGENT-LONG。
- 多 agent 编排簇（转 MULTIAGENT-LONG，本卡只在 §3 留链接与状态标记）：[stablyai/orca](https://github.com/stablyai/orca)、[NanmiCoder/cc-haha](https://github.com/NanmiCoder/cc-haha)、[ParadevAI/Paradev](https://github.com/ParadevAI/Paradev)、[1jehuang/jcode](https://github.com/1jehuang/jcode)、[generalaction/emdash](https://github.com/generalaction/emdash)、[savvasioakeim/OctoShell](https://github.com/savvasioakeim/OctoShell)、[sudheerdvn/lanegate](https://github.com/sudheerdvn/lanegate)、[iOfficeAI/AionUi](https://github.com/iOfficeAI/AionUi)、[OrchestratorInc/agent-orchestrator](https://github.com/OrchestratorInc/agent-orchestrator)、[mvschwarz/openrig](https://github.com/mvschwarz/openrig)、[paperclipai/paperclip](https://github.com/paperclipai/paperclip)。共同点是桌面工作台／worktree 舰队／合并前闭环，归属以 MULTIAGENT-LONG 为准。
- 通用指令簇（转 AGENT-CONFIG，本卡不深挖）：[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)、[multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)、[ayghri/i-have-adhd](https://github.com/ayghri/i-have-adhd)、[lennney/stop-that-shit](https://github.com/lennney/stop-that-shit)。都是行为约束／输出偏好类窄指令，不属本卡的能力入口广扫。
- [Agent Skills 捐赠 AAIF](https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation)：已由 `A-FRONTIER-WIDE-SCAN-20261027` 的 sources 收录，本卡只作治理背景。
- [ClawHub](https://clawhub.ai) 与 ClawHavoc：`A-FRONTIER-WIDE-SCAN-20261027` 已覆盖其基线，本卡只补本轮扫描器一致性与 supply-chain 证据。
- [NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector)：已在 `docs/10-security.md`，本卡只作扫描器对照。

**明确排除／降级：**

- 同一 URL 的转载、镜像与重复提交：合并为一条，保留最早或最接近原始来源的链接。
- 只读到搜索摘要、未读正文的条目：保留在 P6，不进入 §2 的深挖，也不在覆盖表里计为“已核机制”。
- 已 404／451／TLS 失败且无替代原文的链接：不进入“已核”计数；仍保留在清单的 6 项分别标摘要或注明“收集时读数”，并在“读不到或未读完的渠道”单列，不按机制确认。
- 纯目录／awesome 列表：保留在 P5 作发现入口，不用其 star 数或收录数判断质量。
- 只有作者自报数字、无方法或样本说明的条目：保留理由原文，标“作者自报”，不写成实测。

## 5. 缺口与未饱和

**本轮未饱和，以下缺口按“未读到”而非“没有内容”处理。** 最后一轮 GitHub `created:>2026-10-01` 仍出现 Fastbrowse、OpenQodex、Reason Network 等此前未见条目；GitHub topic 只取 star 前 30–40，市场只读首页／快照，社区原帖多数未读。

- **社区原帖缺口。** Reddit、linux.do、V2EX、X／Twitter、即刻、公众号、Discord 未读，且原收集记录未保留帖子 URL（**URL 未保留，无法补读**，需按主题重检或由用户贴链接）；HN 只通过 Algolia 读了部分条目与顶层评论，未逐条读 320 分「How do you manage skills files?」（49589914）等长帖的全部回复。Figma 远程 MCP 争议、Cursor 插件审核延迟、Zenity／Koi 的 ClawHavoc 原始报告均缺原文。
- **官方原文缺口。** OpenAI harness-engineering 文章 403；agent-plugins.org 兼容客户端页未渲染；agentskills.io clients／specification 被域名策略或空渲染拦截；Cursor 安全公告只读 Cursor 页，未回 Phorion 的受影响版本细节；NVIDIA 博客只读作者文，未读 skill card 样例。
- **数据缺口。** GitHub REST API 限额耗尽，没有统一的 stars／updated_at 时间戳，也没有 star 增长历史；skills.sh 只读前 20，officialskills 截断在 #536，ClawHub／Glama／Smithery 的排行榜未全量；arXiv 论文只读摘要或仓库，未复跑实验。
- **实验缺口。** 528 项均未安装、未运行、未调用；Caliper、skill-issue、PlugVet、Aguara、pnpm approve、microsoft/apm、qvr、Tank、packslip 都只有文档与作者声明层面的证据；Adversa 的八款扫描器绕过与 Trail of Bits 的四个 PoC 未在本机复现。
- **时效缺口。** 理由中的日期／版本来自收集者读取时的页面；项目可能在 11-03 后更新。标“摘要”的条目不能当当前机制；标“作者自报”的数字不能当独立结论。
- **下一轮优先补。** 入口与停止条件见文首的三行小表，本节只写细节：① 用真实仓库试 pnpm／microsoft/apm／qvr 中的一条，记录 approve、锁文件、多客户端投影与回滚；② 用 Caliper 或 skill-issue 对一个已有 Skill 做有／无与 ablate 对照，重复 5–10 次；③ 用 [Aguara](https://github.com/garagon/aguara)／[PlugVet](https://plugvet.com/) 加 Trail of Bits 的恶意语料做漏报／误报复核（机制与限制见 §2.4）；④ 回读 Reddit／linux.do／V2EX 与 X 的原帖，补社区正反（本卡未保留 URL，需按主题重检或由用户贴链接）。

## 6. 本轮不做的事

- 不安装、不运行、不登录任何候选；不调用模型网关；不使用凭据；不启动浏览器。
- 不把作者声称、star 数、安装量或市场排名写成效果证据；不据单次页面快照判断增长。
- 不修改正文、模板、inbox、TASKS 或其他任务；不提采用决定，不升级地图。
- 不新增未在本清单中的链接；本文所有链接均来自本轮 528 项候选或“读不到”记录。
