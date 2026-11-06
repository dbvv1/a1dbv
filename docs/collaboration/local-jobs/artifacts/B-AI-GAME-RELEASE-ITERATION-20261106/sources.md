# B-AI-GAME-RELEASE-ITERATION-20261106 · 发布后返工实游戏候选来源

> 原始采集与静态核实日期：2026-11-06 UTC。本页只整理本单元已核实并交回的候选清单，不新增清单外作品链接。本机只读公开网页、API 与源码；未启动任何游戏、未播放视频或音频、未登录、未发帖、未打开浏览器。链接返回 200 只代表页面可响应，不等于已实玩、已看完整实机或品质通过。商店页的 Recent Reviews 与 All Reviews 分开记，本页默认写 All Reviews，必要时注明 Recent。

## 1. 渠道覆盖表

| 渠道 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| itch.io（主域、`*.itch.io`、`img.itch.zone`、devlog、jam `/rate` 页） | 主域间歇可通时读 jam 页、entries 与 `/rate` 页（AI Tools Used、评分、完整评论串），按 `data-game_id` 映射作品；部分子域经 `translate.goog` 或 Host 头窗口读到 Xansion、Mask of Six Moons、Pebble Pit 的作者页/评论页 | 0 项直接进甲/乙；Monkyupe 经 Zenn 作者原文间接进乙（1 项）；jam `/rate` 页交叉核对 12 件，仅作线索 | `*.itch.io` 被本机 DNS 解析到内网拦截域，TLS handshake/UNEXPECTED_EOF、curl 000/exit 35、WebFetch 返回 Socket is closed；游戏页、devlog、页内评论、作者截图原图均无法直读；Tower of Time、Crown of the Grave、PointlessQuest、Marzanna 的 itch 页/devlog 未读到；`/submissions` 与部分 `/rate` 页 429/403；web.archive.org、r.jina.ai 也不可达 |
| Hacker News（Algolia `/search`、`/items`） | items API 读约 40 个线程的正文、作者回复与部分评论树；search 用 Show HN、game、Claude、AI coded、vibe coded、update 等词；按作者名与评论短语（just fixed、thanks for the feedback、new version）追作者回复与时间戳 | 15 条：8 项进乙/丙（Missile Command、Reel Rogue、GunGuesser、Squishy and Friends、Spaceword、Picks and Shovels、Uncracked City、NavalStrike），2 项转出 UI 卡（Wonderhop、Jigsaw Haiku），5 条按门槛排除（Tiberava、Tower of Time、Epic Survivors、Feudle、The Brave Knight） | API 可达；部分帖子只读正文/首层，未逐层读完；作者身份常只到 handle |
| Reddit（直连 + Arctic Shift 归档 API） | 直连 403/000 后改用 `/api/posts/ids`、`/api/posts/search`、`/api/comments/search`；读 El Draft、录屏工作流帖、Traffic Architect、Shrinebreaker、O'BLOCK、KAYFABE、Zombies Per Minute 的正文与少量评论 | 7 条线索：Shrinebreaker、El Draft、Traffic Architect、O'BLOCK、KAYFABE、Zombies Per Minute、录屏工作流帖 | `www.reddit.com`/`old.reddit.com` 直连 403/TLS；pullpush 526；redlib/eddrit/safereddit 被 bot 墙或 TLS 失败；r/aigamedev 多数评论树 Timeout，未读；X/Twitter 登录墙或 402，只到搜索摘要 |
| Steam（store 页 HTML、appdetails、ISteamNews、news hub、策展/相似） | appdetails 核发售日/价格/开发者/类型；store 页 HTML 核 AI Generated Content Disclosure 与 Recent/All Reviews；ISteamNews `maxlength=0` 取公告全文；批量抓 143 个 store 页按 AI 披露过滤；morelike/策展做邻居 | 18 项进清单（Fire Field、群侠传、Rakugaki Beast、O'BLOCK、S.O.L、Three Kingdoms、Huebound、Traffic Architect、HEXSTORM、Tasty Chef、NavalStrike、Sponge Bridges、KAYFABE、Vapor World、Bald Ball、Tower of Time、Epic Survivors、Idle 三作） | `steamcommunity.com` 000/TLS/Socket closed；appreviews 302 空；curator 页空壳；SteamDB 403；news hub 是前端壳（改用 API）；开发者搜索页被 JS 挡住；morelike 只回通用同品类；部分页面 Recent 与 All 两行需分开读 |
| TapTap（app 页、moment 更新帖、developer 页、webapiv2、评论页） | curl/WebFetch 读应用页、moment、开发者页、评论页；webapiv2 detail-by-id/feed；部分经 `translate.goog` | 26 项进清单（§4 的捡完就撤、吃谁变谁、归墟、一针一线 4 项 + §5.1 的不烧心等 22 项 TapTap 制造/同厂） | webapiv2 返回 INVALID_XUA；搜索客户端渲染；用户页/动态页反爬；部分页面只显示“昨天/前天”，绝对日期未核；评论原文与完整版本历史读不到；厂商“小黑喵”与回复者“江望北咕咕咕”账号关系未核 |
| Bilibili（toy 页、视频 view API、搜索 API、空间） | toy 页直接打开；view API 读到 Sponge Bridges 视频标题、UP 主与日期；搜索 API 与空间列表尝试 | 4 项（万梗捏、3D 元气骑士、旅行奶蛙、梗力全开）+ Sponge Bridges 视频交叉 | opus/视频详情返回“验证码_哔哩哔哩”；搜索 API 先 -799 后返回 HTML；space 412/-352/-799；评论端点 404；未拿到《游戏玩家人格测试》的原玩具链接 |
| Google Play（`play.google.com`） | 尝试直接抓 Pack And Run、StarForge、Fish Kingdom 的商店页/评测/版本历史；Pack And Run 经 `play-google-com.translate.goog` 读到部分 | 0 项进候选（这些作品在清单里只作通道测试，未列候选） | 直连 Socket closed/连接超时；StarForge 未核；Pack And Run 的 AI 披露无法独立核；Fish Kingdom 的性能问题是否来自玩家报告未核 |
| 社交与视频（X/Twitter、Discord、YouTube、Bluesky 原帖、Medium） | 尝试读作者时间线/单条长帖、Discord 邀请、实机/预告片、Bluesky 原帖 | 0 项；只从报道转述读到 Attie 等二手信息 | X 登录墙或 402；Discord 未登录；YouTube 000/未看；bsky.app 000、attie.bsky.app 无部署；Medium 连接被重置；全程未播放视频/音频 |
| V2EX、linux.do | V2EX 直连证书不匹配，经 `global.v2ex.co` 与 `translate.goog` 读 t/1250279；linux.do 多帖尝试 | V2EX 1 项（开局避难所）；linux.do 0 项 | V2EX 长帖分页/楼中楼可能不全；linux.do curl schannel TLS exit 35、WebFetch Socket closed，topic 3085507/2939052/1537744/2999197 只有搜索摘要，不能当作该渠道无内容 |
| 微信公众号、知乎、今日头条、搜狐、网易、17173、什么值得买、微博 | 只用于定位作品名与二手摘要；头条、搜狐、ai.xianjianwendao 知识库读到部分摘要 | 0 项直接进候选；关键事实回 TapTap/Steam 原页 | mp.weixin.qq.com 验证墙“当前环境异常”；知乎 403；头条正文空/JS；微博访客授权；B站 opus 验证码 |
| 作者站/博客/技术社区（inselnova、juliapottinger、x00f、zenn、penguinboisoftware、sabih.dev、krillion、vector-tango、dailybaffle、robit 等） | curl 抽正文/出链；Zenn 用 `/api/articles/<slug>`；读 devlog、release notes、FAQ、作者长文 | 12 项（Inselnova、Tropic Tumble、Monkyupe、x00F 三作按 3 项计、Axiom、Vector Tango、Krillion、Destroy Go、Dungeotto、Daily Baffle） | Zenn 两篇 Destroy Go 后续文章“この操作は許可されていません”（会员/付费）；tearevo.com 000；0.space TLS；MAGI workers.dev 000（translate.goog 读到部分）；Axiom 只有本地可玩说明，无公开 build |
| GitHub（网页、raw、REST、浅克隆） | 读 maciej-trebacz/tower-of-time-game、centminmod/atari-missile-command、obra/picksandshovels、willc/skyline-coop 的 README/commits/releases/LICENSE | 2 项（Tower of Time、Picks and Shovels）+ 源码/许可交叉 | REST 403 rate limit；部分仓库只读第一页；Tower of Time 的 itch 页/devlog 读不到 |
| 聚合/索引/榜单（Vibe Jam、aigamedex、GamesByAI、jams.team、Agentel、AI Transparency Index、Playgama、GameDB、VibeTopList） | 读 jam 规则/获奖、aigamedex 517 款 Claude 游戏库、GamesByAI 目录、AI Transparency Index 27,030 条披露、Playgama data.json | 交叉线索 5 项（Vector Tango、Krillion、Idle Crown、S.O.L、Sorting Go），已归入对应渠道 | Playgama 只暴露聚合 data.json，无逐游戏清单；playgroundarcade Cloudflare 403；TinyRTS 停放页；SoonPlay SPA/API 403；GamePartner.AI API 404；attie.bsky.app 无部署 |
| 行业媒体与平台政策（Engadget、IGN、TechPowerUp、Tom's Hardware、GamesIndustry、MobileGamer、The Verge、TechCrunch、Spawnpoint、GameFromScratch） | 读报道/转述；厂商原页多处 000 | 14 项上下文（Steam 新规、itch 清理、Claude Code 禁令/放宽、Google Playground、Meta Horizon、Bluesky Attie、Valve Indie Connect 等） | developers.meta.com 000；Steamworks 帖需登录；Engadget WebFetch 被拦（curl 200）；techpowerup 403；in.ign/IGN 拒绝抓取；RockPaperShotgun WebFetch 失败 |
| WebSearch 与通用搜索引擎 | 多个子批次共用 200/200 配额；前半程用关键词找作者/作品，后半程改站点 API、HN/GitHub API 与直接抓页 | 0 项直接计数（只作索引入口） | WebSearch 200/200 用尽；Bing 中国版对英文/`site:` 查询返回无关或中文垃圾；Google、DuckDuckGo、Mojeek、Startpage、Brave、SearX 被阻断或验证码 |
| 游戏运行/视频/音频 | 未启动任何游戏、未播放视频/音频、未打开浏览器；可玩性只到 HTTP 200 与页面文案 | 0 项实玩 | 所有候选均缺本端实玩或完整连续实机；帧率、手感、听感、完整游玩回路未验 |

**合计。** 合并同作品/同厂重复后 **91 个曾收集唯一条目**：其中在册 89 项（通过 3、第一备选 13、条件性/局部证据 53、排除/上下文 20），另有 2 项按任务转出 UI 卡（Wonderhop、Jigsaw Haiku，不计入 89）。渠道列按各渠道实际得到计，跨渠道交叉会重复（NavalStrike 同时进 HN 与 Steam；Traffic Architect、O'BLOCK、KAYFABE 同时进 Reddit 与 Steam；Tower of Time 同时进 Steam 与 GitHub），故分项相加高于 91；正文按去重后的在册 89 项 + 2 项转出 = 91 计。

## 2. 结论、门槛与排序

**先给结论。** 通过本卡门槛的 3 项是 **Fire Field**、**Inselnova**、**群侠传：幸存者**。首推 Fire Field：作者零编程基础、Claude Code 写出约 18 万行，Steam 抢先体验后 27 条新闻/更新（EA 后 24 条，含媒体提及与开发说明），其中 v1.9.1 补丁原文点名“有玩家报告毒太强”。第三方 L'archiviste 2026-05-27 的文章只逐日复核 2026-05-13–17 首发周，不覆盖 v1.9.1；v1.9.1 的证据是补丁原文 + 玩家报告。Inselnova 提供最完整的“玩家反馈 → 任务卡 → 版本”机制；群侠传是中文线里样本最大、AI 披露最明确的免费 EA 案例，但 AI 代码占比只写“parts”，属边界通过。第一备选共 13 项（见 §4），其中优先 Tropic Tumble、Monkyupe、Shrinebreaker；若要求全代码 AI，用 Monkyupe 替换群侠传。

**什么情况下不选 Fire Field。** 需要免费、浏览器或无 Steam 账号：转 **Inselnova**（免费浏览器）或 **Monkyupe**（itch 浏览器）；需要大样本（千条以上评价）：转 **群侠传**（2,347 条，免费 EA）；按“AI 写全部或绝大部分代码”的严格口径：群侠传降为乙，用 Monkyupe 替补；首推本身不是免费试玩：Fire Field 当前 US$9.99 / HK$61.00，需 Steam 账号与购买。

**口径说明。** 91 个曾收集条目、89 个在册候选不是 89 个推荐；只有 3 个通过，其余按缺口留作线索。若按最严格的“AI 写全部或绝大部分代码”口径，通过项只有 Fire Field、Inselnova 两项，群侠传降为乙；若按“AI 广泛参与代码/美术/音频且人做设计与验收”口径，3 项通过。两种口径都不把“AI 只做美术/配音/局部重构”算作大规模开发。

**等级。** 甲＝通过门槛，建议优先试玩；乙＝证据接近但缺一项硬条件；丙＝有 AI 开发或发布后修订的局部证据，闭环、入口或规模不足；丁＝按门槛排除、旧对照或平台政策，不作品牌候选。等级只表示资料优先级，不是品质排名，也不是本端实玩验收。

按 job §1/§3 的硬条件排序：

1. **AI 大规模开发**：不是只做美术、配音或局部重构；AI 代码占比或人机分工可读。
2. **已过首次可玩**：有发布后版本或补丁，不收只有首日演示的作品。
3. **真实玩家反馈 → 具体返工**：至少一项改动实际进入可玩版本；作者自述“修了很多”不算。
4. **作者身份、作品入口、作者原文、版本/日期可核**。
5. **一次可复述的二改**：问题、根因、改动、结果四段齐全。
6. **许可与成本能分开**：未知写未知，不推算。

并列时优先：有第三方首发周复核（不覆盖后续补丁） > 补丁原文点名玩家报告 > 有版本号/连续更新 > 玩家样本量大。排除：任务 §4 名单（Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R'lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso、Capybara、backroad rally、Long Wind、World of ClaudeCraft）、pxl 等工具、纯 UI 改动（转 UI 卡）、纯场景局部（转场景光照卡）、AI 只做运行时内容而不是开发。

## 3. 通过门槛的 3 项

### 3.1 Fire Field（Steam 抢先体验，首推）

- **可玩入口**：<https://store.steampowered.com/app/4527100/Firefield/>（同名入口 <https://store.steampowered.com/app/4527100/>）。Steam 抢先体验，2026-05-08 上线；本次商店页复核 All Reviews 24 条、70% 好评（样本小）。
- **作者原文**：<https://store.steampowered.com/news/app/4527100/view/1844751498217707>（2026-09-23《How I Started a Game With AI in One Night》）。作者 Robe of Fire 自述不会编程：2026-02-07 22:44 用两句话让 Claude Code 做“像暗黑破坏神 1 的游戏”，23:40 已有 31 个文件、3,834 行 TypeScript，自己一行没写；现在约 18 万行、95 种字幕、70 种配音；文中说每月 20 美元的 Claude 套餐是唯一真实成本。
- **AI/人分工**：商店 AI 披露原文：“Most of this game's content was created with the assistance of AI generation tools, except for a small portion of hand-crafted assets. All AI-generated content was reviewed and edited by the developer. No AI is used during gameplay.” 人负责审改、试玩与方向，AI 写代码与内容。
- **版本与日期**：2026-05-08 EA；本次 ISteamNews 取到 27 条新闻/更新（EA 后 24 条，含媒体提及与开发说明），最近 v2.1.7 为 2026-11-04。关键节点：v1.6.0（2026-05-11，教程/地牢重生）、v1.6.1（05-12）、v1.9.1（08-28 毒叠层热修）、v2.1.0（10-01）、v2.1.7（11-04）。
- **一次具体二改**：v1.9.1 补丁原文（<https://store.steampowered.com/news/app/4527100/view/1842212951302391>）写“A player reported that poison felt far too strong.” 毒原本每次被咬叠一层，最多 3 层到 9 伤害/秒，且无视护甲与 Mana Shield；蜘蛛 1.5 秒叠满，药水跟不上。改为不再叠层、只刷新持续时间，适用蚁狮（antlions）、蜘蛛、毒气陷阱、斩击流血；蜘蛛位于第 3 层（补丁原文），复测从该层开始。旧存档若在中毒状态保存，读档后降为单层。同版还重做了地图显示（墙/门/楼梯按真实颜色）。
- **第三方复核（仅首发周）**：RPG Jeuxvidéo 的 L'archiviste 2026-05-27 英文版文章 <https://www.rpgjeuxvideo.com/divers/fire-field-an-early-access-first-look-english-version/>（原链本次直连 200；正文经 translate.goog 读取）按日记录 2026-05-13–17 首发周问题：首批问题作者 12 小时内修完，四天内补齐 AZERTY、滤镜、亮度与自动拾币等；文末写“It has earned my respect.”。作者 2026-10-07 的 Steam 帖转述了站内评论“Do not buy this”，并说双方后来成为朋友/导师关系。该文不覆盖 8-28 的 v1.9.1；v1.9.1 的证据只有补丁原文 + 玩家报告。
- **为什么最值得先挖**：三项少见的证据同时成立——(1) 零编程作者 + AI 写约 18 万行，AI 开发规模可核；(2) 补丁原文直接点名玩家报告并给出可复测条件（毒不叠层、旧存档降级），不是“修了很多”；(3) 第三方 L'archiviste 只对 5-13–17 首发周做了逐日复核，能外部验证首发周修复，但不能外推到 v1.9.1；v1.9.1 依靠补丁原文给出的可复测条件。11-04 仍在更新，能看当前版本。它最适合回答“发布后第一周怎样把玩家报告变成可复测补丁”。
- **缺口**：作者静态截图已补一张 <https://clan.akamai.steamstatic.com/images/46077957/5ffa1327ca739cdca2f3afd009d585024bb8e019.png>（2026-09-27 v2.0 Mega Update 3/5 新闻 <https://store.steampowered.com/news/app/4527100/view/1844751498229088> 内图，本次打开确认为游戏内选职业界面；其余商店图未逐张核）；代码/资产许可未声明；成本只有“每月 20 美元套餐足够”的作者口径，不是总成本；24 条评价样本小；本机未启动游戏，玩法、帧率、听感未验。

### 3.2 Inselnova（浏览器持久世界，反馈闭环机制最完整）

- **可玩入口**：<https://inselnova.com/play/>（免费浏览器；本次打开返回 200，未启动游戏）。**作者原文**：<https://inselnova.com/chronicle/2026-09-24-player-feedback-loop/>（作者 Darren，单人、兼职开发；作者站首页本次也返回 200）。
- **反馈闭环**：玩家加入约 1 小时后收到作者在游戏内聊天的欢迎消息；世界 5 有 1,142 名玩家收到过某个版本，17.5% 回复，长期玩家回复率 43%，作者回了 200 条回复中的 195 条；1,538 张已完成任务卡中 121 张来自玩家（7.9%），32 名玩家被标为报告者，其中 28 人先回过欢迎消息。作者把每条回复变成带玩家署名的任务卡，上线后告诉玩家。
- **版本与二改**：同站 release notes（<https://inselnova.com/chronicle/releases/>）可核 v0.112.2（2026-10-19，iPhone 底部按钮不再被 Safari 工具栏遮住）、v0.113.1（10-22，每小时掉线半分钟修复）、v0.113.2（10-23，空岛 raid 不再算败仗）、v0.113.3（10-23，空岛进攻不再损失海上船只）、v0.113.6（10-27，打赢野岛 raid 回程不再丢船）、v0.114.0（11-01，Renown/Defense 页/可回复聊天）。**一次具体二改**（同篇 2026-09-24 chronicle）：Miko Misan 打到第 30 天没有目标、想要“需要保护的特殊目标”，Flowkap 此前则反对 steward 设想“太像城建游戏”；作者判定两人说的是同一件事——每座岛都是同一串建筑、同一条成长曲线，随后在 0.107.0 上线 island stewards（岛达到 Dominion 可终身任命一名带名字、面孔与 doctrine 的官员，越过 20 级并改变该岛能力），并注明这不是 Miko 原本要的岛屿围攻。另据作者 2026-10-21 周记 <https://inselnova.com/chronicle/2026-10-21-typical-week/>：9 月 24–30 日一周 66 个 AI coding session、154 张新票、159 张票随两次发版上线，同周 18 张票直接来自玩家；作者自述“我不写代码，但做了 30 年开发者，会像开发者一样读计划”。
- **为什么最值得先挖**：它把“玩家反馈”做成了可数的生产流程，而不是口号：欢迎消息 → 回复 → 带署名的卡 → 进入当前版本 → 发版告知。版本条目又是玩家能感知的可用性/规则问题（iPhone 按钮、掉线、空岛 raid 误判），适合直接借到发布后修复流程。
- **缺口**：作者只署名 Darren，无法人/公司；作者静态截图已补一张 <https://inselnova.com/images/devlog/009-chat-in-game-report-bug.jpeg>（2026-09-24 chronicle 内图，游戏内聊天/报 bug 界面，本次打开核过）；代码/资产许可与成本未知；“AI 写多少代码”只有 session 数与“我不写代码”的自述，未量化到行；release notes 未逐条标注来源玩家，但 0.107.0 有明确的“两名玩家反馈 → island stewards 上线”记录，“18 张玩家票”与其余版本条目的对应仍是流程级而非逐条映射；本机未玩。

### 3.3 群侠传：幸存者（Steam 免费 EA，中文线首推）

- **可玩入口**：<https://store.steampowered.com/app/4957110/>（免费 EA，2026-08-11，Nenly Studio；本次商店页复核 All Reviews 2,347 条、97% 好评，Recent 742 条、98%）。
- **AI 披露原文**：代码部分用 AI coding tools；部分角色、环境、UI 美术用图像模型后由作者挑选调整；部分动画、音乐、音效也用 AI；设计、平衡、手感与“好不好玩”的判断由作者在数百次试玩中完成；游戏运行时无 live-generated AI。
- **版本与二改**：V0.1.1 首日更新（2026-08-12，<https://store.steampowered.com/news/app/4957110/view/1840944183774632>）开头写“Thanks to your playtesting, reports and conversations”，加入 Endless Mode、教程、bug/平衡修复与低端机优化；补丁正文还写“那件在终章前拿到的橙色武学/功法（orange-tier art）终于有机会出场”。2026-08-13 专文《On the Endless Mode Performance Issues》（<https://store.steampowered.com/news/app/4957110/view/1840944183777541>）回应无尽模式性能，并给出玩家反馈到上线的一手因果：“yesterday so many of you told me there was nowhere to actually use the high-tier martial arts and items you'd earned by the end of a run, so I decided to add it to the day-one update on short notice”；V0.1.2（08-23）性能大修/冲刺重做/无尽再平衡，补丁原文写“late stages of Endless Mode 的掉帧和卡顿一直困扰部分玩家”，并给出 GPU/CPU 两侧改动（渲染分辨率、帧率上限、VRAM 精简、敌人寻路/推挤逻辑）；后续 V0.2.0（10-01 终章/刀法/无尽遭遇/手柄）、V0.2.2（10-10）、V0.2.3（10-26）、Steam Cloud（11-01）。V0.1.2 补丁原文：<https://store.steampowered.com/news/app/4957110/view/1841579228672838>。
- **为什么最值得先挖**：中文作者、免费 EA、2,347 条评价的样本量，加上商店页明确 AI 披露，能同时回答“AI 参与度”和“发布后大规模玩家反馈”两件事；首日补丁 → 无尽模式 → 性能大修是一条连续的、有版本号的返工链。
- **缺口**：AI 只写“parts of the code”，不是全代码 AI；按“AI 大规模”它是边界通过项，若负责人要求全代码 AI，应由 Monkyupe 替补；作者静态截图已补一张 <https://clan.akamai.steamstatic.com/images/46218163/a5637d91b4c3361269b97ca1882133bb6115b75d.jpg>（V0.2.0 新闻 <https://store.steampowered.com/news/app/4957110/view/1845383656379625> 内图，游戏内江湖录/战斗评定界面：近期评定 981/1000“大侠”、个人最佳 981/1000“宗师”、战斗通关率 70%（7/10 击破终章），本次打开核过，不是战斗画面）；代码/资产许可与成本未知；本机未玩；V0.1.1 补丁正文只写“Endless Mode added”，但作者 8-13 专文给出“高层武学/道具没处用 → 当天加进首日更新”的因果，非仅清单转述。

## 4. 第一备选（乙级，13 项）

这些条目已接近门槛，但因可玩入口未在清单内、玩家样本小、AI 占比降级或版本落地未证，暂不列为通过项。补齐缺口后可替换前三。

1. **Tropic Tumble** — <https://juliapottinger.com/done-is-the-whole-chain/>。Android/iOS 三消，作者称大部分由 AI coding agents 建成。玩家在活动仍进行时看到“Event Ended”；根因是云恢复 + 存档合并把旧的终态带回来，作者修了 save merge 与 repair 路径并加恢复回归测试；同批还修了“Claim All”假红点、双击重复发奖、排行榜只读本地。缺口：清单未给商店/可玩链接，只有作者长文；无版本号；许可与成本未知。不列前三是因为入口不可核，且部分改动偏工程/UI。
2. **Monkyupe（モンキュペ）** — <https://zenn.dev/itamoko/articles/55ccb137aa922e>。itch.io 浏览器怪物养成 RPG；作者是大学三年级、几乎不会编程，用 Claude Code 约一周，代码全部由 Claude 写，人做企划、数字规格、试玩、指出违和与发布。上线后朋友报告全屏被强制解除、出现 iframe 域名警告、手机端进度重置；根因是 `alert()`/`confirm()`，作者让 Claude 把全部 35 处换成游戏内自制对话框。缺口：itch 游戏页/devlog/评论 TLS 拦截，可玩入口只在文章里；版本、许可、成本未知；反馈来自朋友而非规模玩家。它是 itch 线最强线索，补核 itch 页后可进前三。
3. **Shrinebreaker** — <https://shrinebreaker.com/>（站内更新页 <https://game.shrinebreaker.com/whats-new>）。作者 zrikz 2026-11-04 在 r/aigamedev 原帖（<https://www.reddit.com/r/aigamedev/comments/1xnpzz2/shrinebreaker_an_online_browser_based_3team_retro/>；本机经归档 API 读到正文 <https://arctic-shift.photon-reddit.com/api/posts/ids?ids=1xnpzz2>）写“I direct it, and Claude Code writes almost all of the code”，全部用 Claude Code（Opus 5.5）；主会话做 producer，分 agents 在独立 git worktree 写测试/截图，主会话审阅、合并、部署；帖内称“over 50 folks login... concurrent user count has only been about 10 at the max”。站点更新记录从 2026-10-05 起，免费浏览器可玩；游戏内 feedback ticket 进 Claude 的 triage 流程，修复上线后 Claude 写游戏内回复给报告者。11-03 的 Druid 平衡第二轮写“From your feedback”，11-04/11-05 继续按反馈改治疗回复、Druid 朝向、音效与 Stampede 提示。缺口：AI 分工只有作者 Reddit 原帖，站内无 AI 披露；版本号、许可、成本未知；50+ 登录/峰值约 10 的样本小。
4. **Rakugaki Beast（ラクガキビースト）** — <https://store.steampowered.com/app/5036050/>。日文作者 Maveroni 用 Claude Code + Codex 约 3 个月，AI 生成部分背景图/BGM/音效，运行时用 DeepSeek 生成兽的属性/技能/设定；Steam 2026-09-24，US$6.99。上线后 9/27–10/26 连发补丁：10-16 写“If additional move generation previously failed… thank you for reporting it”并做服务端修复；10-03 修生成中关游戏的绘图恢复/保存与好友对战重连；10-26 改好友对战与 Instant 流程；10-02 加公开在线对战与主播模式。AI 资产有商用许可台账。缺口：All Reviews 仅 3 条；AI 写代码比例未量化；成本未披露。
5. **O'BLOCK** — <https://store.steampowered.com/app/5357680/>。2026-10-20 免费上线的 Rust 游戏，Claude Code 写约 4 万行/54 文件（26 轮），人负责设计、试玩和否决；上线前用 37,800 局无头机器人找漏洞。10-21《Update: your feedback, fixed》写上线不足一天、本次更新“almost entirely built from those reports”，逐项修控制、长菜单点击错行、价格显示“You don't have $95. You have $95.”、公平性与 15 种语言文案；Build 19（10-24）由重度玩家 Eli 的两条记录起头，随后 Build 20 加速度通与周排位。商店披露代码、游戏内文案与商店文案由 AI 助手写、开发者审改。缺口：All Reviews 5 条；发布后仅一天就有大补丁，长期闭环未证；成本未知。
6. **捡完就撤** — <https://www.taptap.cn/app/894258>。2026-07-28 上线，8.5 分/28 条评价；作者让 GPT-5.6 Sol 做策划、Claude Opus 5 做主程、GPT-5.6 Terra 做美术、Gemini 做声音，两天做出。上线后 8-04 针对玩家“局内太卡”做专项优化，称同场景绘制耗时约减半（更新帖 <https://www.taptap.cn/moment/833741690589155025>）。缺口：版本号、许可、成本未知；AI 分工来自作者帖，样本小。
7. **吃谁变谁：从小蚂蚁吃成森林霸主** — <https://www.taptap.cn/app/972008>。9.1 分/314 条评价；上线不到一周 v1.0→v1.3.6，v1.3.6 公告原话“这次全是照着大家的评价和帖子改的”，具体修试炼巢被推出圈、判定范围对齐、横竖屏切换（更新帖 <https://www.taptap.cn/moment/861306964309705553>），10-25 已到 v1.8.0。缺口：单条清单未写 AI 分工，AI 身份由同厂“小黑喵/高玩看世界”其他作品推断；完整版本历史未核。
8. **归墟：吞丹修仙** — <https://www.taptap.cn/app/960466>。5 天做出 1.0、2026-10-21 上线；72 小时内 1.0.4→1.2.8 共 12 版并把玩家评价当需求单；1.23.2 专修开始页长时间卡住与手机内存（更新帖 <https://www.taptap.cn/moment/867395840900071950>），另有 1.1/1.1.4/1.3.5 多条带版本号公告；8.7 分/37 条评价。缺口：AI 分工由同厂推断；样本小；许可/成本未知。
9. **一针一线绣江南** — <https://www.taptap.cn/app/953017>。9.3 分/213 条评价，2026-11-04 仍在更新；作者把 15 条玩家评价逐条落到版本（针路常驻与齐整率、剪刀定位环、缝线速度带、“为自己做”页签），玩家指出 AI 生图断腕、缺笔后作者承认并重画；作者自述两个 AI 用 7 小时 44 分做出（媒体采访 <https://www.toutiao.com/article/7692590006711468584/>），更新帖 <https://www.taptap.cn/moment/854634300581088279>。缺口：AI 分工来自媒体转述；版本号/许可/成本未知。
10. **Missile Command（George Liu）** — <https://missile-command-game.centminmod.com/>。作者用 Gemini 2.5 Pro 起步、Claude 3.7 等辅助，页面 Credits 公开 AI 分工。HN 发布当天（2025-04-07）玩家 eesmith 批评商店经济让策略塌缩，作者 20:39 回复已改玩法逻辑并加入连锁爆炸（<https://news.ycombinator.com/item?id=43615713>），玩家 04-09 确认“连锁反应让游戏更有趣”（<https://news.ycombinator.com/item?id=43629503>）。当前页有存档、排行榜、PWA 与公开源码 <https://github.com/centminmod/atari-missile-command>，静态图 <https://missile-command-game.centminmod.com/images/social-preview.jpg>。缺口：AI 是辅助而非大规模开发；仓库无 LICENSE，Atari 名称/玩法权利未授权，代码和资产不可直接复用；成本未知。
11. **开局避难所：生存100天** — <https://www.taptap.cn/app/982855>（V2EX 原帖经镜像 <https://global.v2ex.co/t/1250279>）。中文作者“游戏小付”记录用 Codex 写代码、GPT 生成图像与音乐、TapTap CLI 发布；2026-10-19/20 上线后到 11-04 连发十余个版本（存档报错弹窗加原因与重试、探索模块整体换成“搜打撤”、新增尸潮竞速），并按回帖玩家要求补了网页版。缺口：TapTap 页本身未标 AI，AI 使用以作者 V2EX 自述为准；网页版入口未在清单内；版本号只到叙述级。
12. **Three Kingdoms: Alias（三国志·别名）** — <https://store.steampowered.com/app/4549610/Three_Kingdoms_Alias/>。2026-07-13 EA，All Reviews 379 条/80%；Steam AI 披露称生成式 AI 参与代码、美术、音乐。作者在 Developer Note #1/#2 明确按 demo 与 EA 前两周玩家反馈修，已发 v0.5.8（2026-08-01，开局/继位/治安与中后期性能）、v0.5.9（08-02，回合推进/守城窗口热修）、v0.5.10（08-12，Windows 点击输入、编队操作、战后返回与 AI 势力流程），v0.6.0 的同时回合战斗与 UI 大改在开发中。缺口：v0.6.0 是否落地未证；AI/人工具体分界粗；无作者长文。
13. **S.O.L School Of Labyrinth** — <https://store.steampowered.com/app/4736830/>。2026-08-12，All Reviews 133 条/69% Mixed，Recent 10 条/70% Mostly Positive；Steam 披露 AI 用于代码生成/调试、部分图像、BGM/SFX 素材与翻译且由团队逐项审改。v1.1.0 在首发 5 天内按玩家报告做 17 项操作/UI 修订，v1.4 按评测/论坛修复，v1.4.21 又按一条存储误用报告重写仓库交互。缺口：过程主要是补丁说明而非完整制作复盘；整体评价仍 Mixed；成本/许可未知。

## 5. 条件性证据与局部机制（丙级，53 项）

这些条目能证明“AI 参与开发”或“发布后按反馈改过”，但缺一项硬条件：可玩入口、作者身份、版本落地、AI 分工或玩家闭环。按主题分组，便于后续补核；不建议直接当本卡通过项。

### 5.1 中文 TapTap / 同厂牌：评价→补丁最直接，但 AI 分工或版本证据待补（22 项）

1. **满包而归：一刀一片，越砍越富** — <https://www.taptap.cn/app/967666>。TapTap 制造 AI 游戏；上线一周内从 v1.6.1“照大家的评价修了 4 处”连发到 v1.7.3–v1.7.7，v1.7.5 按玩家“发烫”反馈默认开省电模式，论坛还逐条追问广告不出的机型和屏幕表现。缺口：AI 分工未在条目写明；版本号只到公告级。
2. **收纳师：从一个乱衣柜收到一个亿** — <https://www.taptap.cn/app/1009882>。TapTap 制造；11/3 首发后连续 11/3–11/5 每天更新，按玩家“口碑涨太慢、衣服太少、地图不能选片区、行李箱转不动”加“我的家当”、加 8 种衣服并修出题 bug。缺口：测试版，许可/成本未公开。
3. **我在小区收破烂** — <https://www.taptap.cn/app/1001189>。同属高玩看世界/小黑喵，公开转述称 AI 承担大部分代码与美术；TapTap 论坛约 9 天内从 1.1 更到 1.8，按玩家报告“福利车不看广告可无限领”修 bug（1.2.2），又按“流程太短、开分店糊弄”重做分店规则（1.4）。缺口：AI 证据是二手转述。
4. **符咒道长斩邪神** — <https://www.taptap.cn/app/882078>。2026-07-14 上线、9.8 分（22 评）的 TapTap 制造竖版符咒战斗；官方帖从 07-14 连续更到 11-04，0727/0728/0809/1019 多条“根据玩家反馈”改动（仙子救援概率、催更奖励随机化、一键收取符咒），0907 还修掉 AI 把“怪物有防御”写进属性的幻觉 bug。缺口：样本小；AI 写代码、人测试修复的边界只在公告里。
5. **北冥有鱼：吃小躲大，凑齐合成化鹏** — <https://www.taptap.cn/app/1012604>。同厂牌新作，首发 5 天内两次更新直接引用玩家反馈（“玩几局就有点单调”→加每日挑战/鲲的新形态；“同类太难找、灵气白白溢出”→调刷新并加屏幕边缘指引）。缺口：发布太新，长期闭环未证。
6. **小衣铺开张啦** — <https://www.taptap.cn/app/980353>。同厂牌，10/25 起十余天连发 10 条以上更新（含 1.0.84），按玩家“定价牌没显示”和款式/颜色需求逐条调整。缺口：慢节奏经营，样本小。
7. **上门喂猫：从一单五十块喂到一万只猫** — <https://www.taptap.cn/app/1013805>。2026-11-03 上线；1.0.5 按一位玩到 1100 天玩家的长评“照着大家说的，一条一条改”，重做找猫线索和结算提示。缺口：上线仅 3 天；条目未写 AI 分工。
8. **星链计划** — <https://www.taptap.cn/app/902847>。2026-08-16 上线的 TapTap 制造火箭问答/限时游戏；0817 起连续更新，明确修“部分玩家反馈的字体加载过慢”、把“炸弹直接炸没”的差体验改成掉落消除道具；作者 2026-09-18 帖称其近 1000 玩家、后台由 AI 写坏后买 token 让 AI 修。缺口：玩家反馈到版本的对应只到公告级。
9. **文明播种者** — <https://www.taptap.cn/app/749818>，作者原帖 <https://www.taptap.cn/moment/787385005922845254>。作者无牙猫记录 2026-03-27 一次完全由 AI 智能体按评论区建议完成的版本更新，并逐条标注哪些改动超模或写出 bug；游戏 2025-05-19 上线、8.7 分/146 条评价。缺口：游戏页最近更新停在 2025-10-15，当前可玩包是否同步未核，时间较早。
10. **林海往事：赶山模拟器** — <https://www.taptap.cn/app/993034>。9.1 分/37 条评价；作者明确写美术和音乐用 AI 辅助、把同题材评论区的广告升级、存档丢失、受伤干等等痛点写进设计，并称下套子、冬捕会陆续更新。缺口：更新承诺未落地。
11. **月薪三万的住家保姆** — <https://www.taptap.cn/app/982755>。8.8 分；插图、音效、音乐、配音标注 AI 辅助，20 道机关各配自动解题测试，作者按玩家“哪道题最难”的留言决定下一步修改。缺口：AI 只覆盖内容资产，代码分工未披露。
12. **虫潮来袭** — <https://www.taptap.cn/app/902168>。同属小黑喵/高玩看世界；更新说明直接针对“一局太长、中途干等”，把关卡压到 2–3 分钟、首领更早登场并补首领战利品。缺口：玩法层返工可核，但 AI 分工未写。
13. **爪爪铺路** — <https://www.taptap.cn/app/908156>。同厂牌；更新说明写“相比过去版本，我们减少了铺路环节带来的负担”，把乐趣移回招募、合成与布阵。缺口：同上。
14. **弹珠不绕弯** — <https://www.taptap.cn/app/903497>。同厂牌；作者写“这次我们重做了主流程”，把发射、捕获、培养、出征整条链路重排。缺口：重做后的顺滑度与留存未验。
15. **喵咪争霸** — <https://www.taptap.cn/app/930968>。TapTap 制造卡牌游戏，10/22 首测后 10/23、10/26 连更；论坛已有“31 关后没内容、匹配久、第三关卡死”的具体反馈。缺口：更新是否回应匹配和关卡断档未确认。
16. **孟德尔万族模拟器** — <https://www.taptap.cn/app/984413>。TapTap 制造模拟游戏，首发一周内论坛集中出现旧档读不出、后期发热卡顿、遗传概率质疑等 bug，制作人称新版本在审核。缺口：补丁未确认上线。
17. **镇妖山门** — <https://www.taptap.cn/app/918234>。同厂牌东方志怪塔防；第三方知识库转述其上线 72 小时更新 12 个版本，TapTap 可见 v1.11.49 重做 9:16 夜巡地图并重校前五关敌潮压力。缺口：当前 0 条评价，玩家闭环未核。
18. **恒星之怒：戴森球抵抗** — <https://www.taptap.cn/app/848085>。2026-04-26 上线、9.0 分（43 评）的 TapTap 制造塔防；0702/0707/0720 有修复机型界面错乱、版本号提示和加关卡的实际更新；作者 2026-09-18 帖把它列为 AI 写后台的四款游戏之一并与文明播种者做服务器联动。缺口：逐条玩家反馈对应较弱。
19. **你最像哪个科学家** — <https://www.taptap.cn/app/866713>。2026-06-25 上线、10 分（16 评）的 TapTap 制造科普问答；0627–0804 多次小版本修 bug/调奖励（含“部分玩家会获得负数经验”），同属作者 AI 后台四游戏之一。缺口：更新多为内容与数值，反馈对应最弱。
20. **放置地牢：越来越黑暗** — <https://www.taptap.cn/app/988285>。TapTap 制造作品，v1.0 更新说明含五次转生、大秘境与两名新 UR 角色，9.2 分/113 评并有 PC 试玩 DEMO。缺口：内容增补是否对应玩家反馈未写。
21. **穿越鸿蒙界** — <https://www.taptap.cn/app/971671>。TapTap 制造；首次开放测试误传空场景致玩家进入即退，作者用大半个月补完 UI、系统、挂机逻辑，真机上传近 50 版、本地修复 300 余次，现 8.6 分并发布补偿公告（<https://www.taptap.cn/moment/861703638261696596>）。缺口：页面只带“TapTap 制造”标签，未明说 AI 分工。
22. **不烧心早餐店测试** — <https://www.taptap.cn/app/985534>。TapTap 制造早餐店经营，麻辣喵工作室，2026-10-23 上线、9.2 分/35 评，页面 2026-11-01 仍更新（标题带“测试”）。缺口：本次只读到简介、标签与时间，未读到玩家反馈→具体改动的公告；收集记录称它是玩家反馈直接改到可玩版本的最干净样本，暂作线索。

### 5.2 B 站 Toy：同作者连续改版，AI 使用证据待补（4 项）

1. **万梗捏 MemeMash** — <https://www.bilibili.com/toy/MemeMash/index.html>。B 站可直接玩的 3D 软体 Toy，从单只“猫猫捏”按 B 站评论扩展成多热梗与不同手感模式，跨设备软体失控由用户反馈后修；作者用 Codex 数小时出首版、1–2 周打磨。缺口：公开材料以媒体转述为主，缺作者原文与补丁记录。
2. **3D 元气骑士** — <https://www.bilibili.com/toy/SoulKnight3D/index.html>。同作者扎克鸡的 Unity + AI 辅助编程 3D 同人版，因《游戏玩家人格测试》反响超预期而重启更新，仍可点开玩。缺口：同人 IP 授权需另核；AI 分工未量化。
3. **旅行奶蛙** — <https://www.bilibili.com/toy/TravelMilkyFrog/index.html>。同作者，B 站 Toy v16、174 万播放，2026-09-09 首发后 10-28 仍在更新。缺口：AI 使用证据待补。
4. **梗力全开** — <https://www.bilibili.com/toy/HowToMeme/index.html>。同作者，2026-10-06 首发、10-28 升到 v14 的梗玩法 Toy。缺口：AI 使用证据待补。

### 5.3 其他平台：有一项硬证据，但闭环、入口或规模不足（27 项）

1. **Sponge Bridges 海绵桥** — <https://store.steampowered.com/app/5163770/>。中文作者阿伦一边兼职一边用 Claude VibeCoding 开发，Steam AI 披露写明生成式 AI 协助编程；Demo 2026-10-01 v0.1 起几乎每周更新到 v0.1.5，修大量怪物时的性能、格子移动“隐形墙”、打击反馈与制作队列（更新页 <https://store.steampowered.com/news/app/5163770>），作者 B 站发布页 <https://www.bilibili.com/video/BV1MM4T6NEMt/>。缺口：仍是 Demo，无文字玩家评测，反馈证据弱。
2. **Traffic Architect** — <https://store.steampowered.com/app/5028050/Traffic_Architect/>，网页版 <https://www.crazygames.com/game/traffic-architect-tic>。Claude Code 负责 Three.js 场景/相机、A* 寻路、路口吸附、交通模拟、UI 与低模，人负责设计、难度经济、架构、审查与调试方向；CrazyGames 2026-04 上线、作者称 15 万次游玩/9.2 分；Steam demo 1.0.1–1.0.3 写“You asked for the paint to be obeyed…”，1.0.6–1.0.8 与 1.1.0 反复写“Most of it came from your reports here in the discussions and on Discord”，正式版 2026-11-03、All Reviews 81 条/81%。缺口：正式版上线仅 3 天，只有发布前 demo 修订；Steam 无 AI 披露，AI 分工只有作者 Reddit/Devlog 口径。
3. **Huebound** — <https://store.steampowered.com/app/4459040/Huebound/>。Steam AI 披露只写“AI coding assistants were used during development to help write and debug game code”，其余视觉、音频、调色板、配方与玩法由游戏自身程序生成。玩家抱怨持续嗡嗡声后推出“The Please Stop the Humming Update”，修嗡嗡声、重做更少打扰的教程、加游戏速度滑杆并继续平衡；2026-05-16 上线。缺口：AI 占比不足以称大规模；无 All Reviews 行（样本少）。
4. **Tasty Chef** — <https://store.steampowered.com/app/5019920/Tasty_Chef/>。2026-09-23，All Reviews 522 条/92%；Steam 披露全部视觉美术与音乐由生成式 AI 制作、开发者筛选整合。发布一个月内从 1.0.5 连发到 1.1.14 共 22 个补丁，含合作模式存档/成就不同步、员工拐角卡顿、建造模式导致无法保存等具体玩家问题，以及 1.1.0 新增烘焙店与 10-09 Steam Workshop。缺口：AI 只覆盖美术/音乐，代码作者未披露；无作者个人过程长文。
5. **HEXSTORM: Tears of Arcadia** — <https://store.steampowered.com/app/4402950/HEXSTORM_Tears_of_Arcadia/>。2026-08-03，$9，All Reviews 64 条/78%；作者称约 1000 小时、约 12 万行代码由 AI 生成；上线后因难度过高和定价被差评压到 55% Mixed，8-04 的 1.01.02 重做前期任务、让第一章 Tears 更易获取、提高自动炮塔命中率，配合 $11→$9 降价逐步回到 78%。缺口：Steam 披露只写“原型、本地化和部分视觉资产”用 AI、所有玩法系统由开发者编写，与“全部代码 AI 写”的采访说法不一致，AI 占比需按披露降级。
6. **NavalStrike** — <https://store.steampowered.com/app/4714580/NavalStrike/>。作者在 HN 原帖（<https://news.ycombinator.com/item?id=48042110>）自述“90% 的代码由 AI 写、90% 的设计决定是人做的”；Steam 2026-09-08 发售后于 2026-11-03 推送新手引导更新（移动/预定移动/雷达搜索/导弹/火炮并引导完成首次击杀），时间上正对上线前 HN 玩家指出的“开局指引和雷达不清、船只难辨”。缺口：Steam 页未做 AI 披露，AI 比例仅有作者自述；无评测样本。
7. **Idle Crown / Idle Fleet / Idle Realms** — <https://store.steampowered.com/app/4768400/>、<https://store.steampowered.com/app/4939470/Idle_Fleet/>、<https://store.steampowered.com/app/4433150/>。同厂 Idleforge Games，Steam 披露 AI 参与代码、写作、美术和音效；Idle Crown 2026-06-23 上线、All Reviews 134 条/44% Mixed，持续 v1.0.12 Legacy、v1.0.13 Treasury；Idle Fleet 2026-08-26 发售后至少 8 条补丁（0.1.75→0.2.5），含搜索排序、桌面通知；Idle Realms 2026-03-13 发售后 1.1、1.2 两次内容与 QoL。缺口：补丁未逐条标注玩家反馈来源；同厂三作模式相似，需选一款核留存。
8. **POLYBREAK!（The Dark Factory / x00F）** — <https://x00f.com/games/polybreak/>，devlog <https://x00f.com/polybreak-devlog-03/>。全 AI agent 工作室“AI agents + human operator”；itch 2026-03-16 上线后 3-25 的 post-release devlog 记录 17 个 bug 修复、VSync 开关、色盲图形符号与 0.7x Work Pace 进入 1.0.0。缺口：驱动是自家 QA/测试而非外部玩家，玩家闭环弱；作者随后停手观察 PMF。
9. **Tedtrist** — <https://x00f.com/games/tedtrist/>。同厂已发布方块游戏，post-release devlog 记录为老玩家保留 DAS/ARR 设置的存档迁移和 RektTek 改名，AI 全流程证据强。缺口：没有公开的玩家反馈驱动补丁清单。
10. **Voidrunner** — <https://x00f.com/games/voidrunner/>。同厂 AI Agent 制作，2026-03-17 上线并有发布后 devlog 与 fixed 版本。缺口：作者自述仍在等真人试玩信号，尚未出现玩家反馈驱动的补丁。
11. **Axiom** — <https://penguinboisoftware.com/blog/axiom.html>。Claude 自主选题、设计、写全部代码和测试，人只做 blind playtest 并报告坏关卡（Level 2 角落必死→改环面网格，Level 7 暴力刷绿→加人口上限）。缺口：文章只覆盖发布前，未找到发版后玩家修订；作者写明仅本地 playable，无公开 build。
12. **Vector Tango** — <https://www.vector-tango.com/>。Vibe Jam 2025 铜奖（该 jam 规则要求至少 80% 代码/资产由 AI 写），Flight Log #2 逐条记录 beta 玩家署名反馈和 VT-094–099 修复，连续 10 篇更新后于 2026-11-03 上线 Meta Quest，原始网页版仍可直接玩。缺口：beta 反馈发生在发布前，不是发布后闭环；许可/成本未知。
13. **Krillion** — <https://krillion.io/>。Wonderhop 的 HN 评论把它指为同类的更早 AI 生成每日答题游戏；站点现有 Archive、Unlimited、Party、主题包、Friends 和商店，FAQ 说明单人开发与 LLM 辅助答案集，显示长期发布后迭代。缺口：AI 写码比例只有社区说法，需回作者出处核。
14. **Reel Rogue** — <https://alt-qq.com/>。2026-01-25 Show HN 首发、2026-03-12 再发“Update – The Invisible Feeling”，作者明确说按上一帖建议改 Novice 技能、给所有职业加主动技能并做多项修复/重做。缺口：AI 占比未量化；无版本号。
15. **GunGuesser** — <https://gunguesser.com/>。作者在 HN 连续五帖（2026-05）记录 4 周 AI 开发、先发布再按用户反馈迭代、数千次提交与 300 注册/3 名付费支持者，站点带每日挑战/进度/支持者体系。缺口：玩家反馈到补丁的对应未逐条列出。
16. **Picks and Shovels** — <https://picksandshovels.org/>。Jesse Vincent 让 Claude Opus 5.5 一次提示生成的完整 3D 浏览器游戏，博客公开全部提示词，游戏公开仓库 obra/picksandshovels 已有 32 次提交并自动部署。缺口：发布后玩家反馈/修订未见。
17. **Squishy and Friends** — <https://squishy.franzai.com/>。2026-06 Ask HN 自报的 Claude 5/Opus 4.8 作品，作者称把 2048 式原型改成探索式新玩法并持续迭代；现带每日关卡与关卡编辑器。缺口：没有记录玩家反馈触发的具体补丁。
18. **Spaceword** — <https://spaceword.org/>。Feudle 的 HN 评论区作者自荐的每日词谜，明确说 90% 代码由 Cursor 写；有 archive 结构。缺口：站点是 JS 应用，正文本次未读到；无发布后修复记录。
19. **Dungeotto** — <https://martino.im/Dungeotto>。作者博文完整记录约 15 小时 vibe-code 的栈、合成测试调玩法，并承认“理想情况该用真实玩家”；2026-09-19 发布。缺口：未找到真实玩家反馈触发的二改；itch 页面抓取失败。
20. **Uncracked City** — <https://uncracked.city/>。solo founder 自述用 AI 管线生成案件并让多模型试玩验证，HN 评论中玩家要求披露 LLM、指出预告文案与意大利语翻译问题，作者逐条回应并承诺修改。缺口：承诺是否进版本未确认。
21. **Destroy Go（デストロイ碁）** — <https://robit-devworks.github.io/destroy-go-play/>。Claude 从零写出的浏览器围棋对战游戏，已上线排位/好友/观战与规则设置；系列开发记写明按实际游玩增删 HP、“跡”与规则。缺口：公开证据集中在发布前后自测，外部玩家反馈尚未见到。
22. **Zombies Per Minute** — <https://www.zombiesperminute.com/>。作者称 100% AI 工程化、约一个月/150 小时，免费网页可玩，Reddit 帖 197 赞/105 评论征集反馈。缺口：未找到公开补丁记录，只作 AI 全流程产物与评论反馈线索。
23. **The Last Line: Machine War** — <https://playgama.ai/play/55p62bkfsc>。Show HN 作者自述 2–3 天用 AI 子代理（含 Blender、音乐生成器）完成 three.js X-COM 类并已发布到 Playgama。缺口：发布后修订未见。
24. **Super Mario Galaxy Movie Game** — <https://supertommy.com/games/super-mario-galaxy-movie-game/>。作者自述约 95% 由 Claude Code 完成，53 天 731 次提交、36 次 AI 代码审查、11 次复盘，是 AI 大规模开发的强证据。缺口：页面未见发布后玩家反馈修订。
25. **El Draft: Carrera** — <https://eldraftgame.com/carrera>。用 Claude Code 做的手机篮球生涯游戏：2026-10-10 作者原帖记录首发夜玩家在 Tecno Spark 30 Pro 上报角色黑色裂纹，作者按芯片找到三星 Remote Test Lab 的 Galaxy A15 复现，Claude 写四连绘逐像素检测器，定位到 shader 骨骼索引一行，当晚推送、次日玩家确认。缺口：可玩页仍标 BETA、完整生涯未上线，发布日期/版本/成本/许可未公开，只能作“首发夜玩家报障→当晚修复”的窄证据。
26. **Sorting Go: Mini Mart（出发吧！便利店）** — <https://cmge.com/en/news/20261020150429>。SOON 团队用 GamePartner.AI 生成的休闲游戏，上线后用 SoonData 按测试反馈在两个月内完成多轮迭代，官方称新版本留存与游玩时长翻倍。缺口：只有公司通稿，未找到可玩入口或公开玩家反馈，指标为自报。
27. **The Daily Baffle** — <https://dailybaffle.com/>。Jigsaw Haiku 作者的姊妹解谜站；作者在 HN 说明 Jigsaw Haiku 全程由 Claude 编写并在一天内按玩家评论连修边缘裁字、拖拽卡顿等问题。缺口：Daily Baffle 是否同一做法及有无更新记录未核。

### 5.4 已转出 UI 卡（2 项，不计入 53/89）

1. **Wonderhop** — <https://wonderhop.io/en/>。两名蒙特利尔独立开发者约两个月做成、9 语言、无需账号的每日答题游戏；作者自述大部分代码由 AI 写，概念、美术与每项设计由人定（HN <https://news.ycombinator.com/item?id=50080246>）。发布后玩家报 iOS Safari 键盘遮住输入框、Firefox Android 题面移出屏幕，作者 10-15/10-17 连续回复已修（<https://news.ycombinator.com/item?id=50109762>、<https://news.ycombinator.com/item?id=50135759>、<https://news.ycombinator.com/item?id=50135764>）；站点自述 online since 2026-10-13，静态图 <https://wonderhop.io/og/en.png?v=2>。按任务 §4，改动主要是平台/UI 可用性，转 UI 卡，不计入本卡候选。
2. **Jigsaw Haiku** — <https://jigsawhaiku.com/>。作者明确说代码全部由 Claude 写，自己只写规格并逐步纠偏；画面由 Gemini/ChatGPT 生成，俳句手写；静态 React、无后端（HN <https://news.ycombinator.com/item?id=49568162>）。玩家 09-07 反映拼块边框遮住字母、09-08 反映文字被切，作者同日回复已让字母压过拼块边缘并修文字裁切（<https://news.ycombinator.com/item?id=49605059>、<https://news.ycombinator.com/item?id=49605083>），移动 Firefox 问题也在 09-09 回复已修（<https://news.ycombinator.com/item?id=49621645>）；静态图 <https://jigsawhaiku.com/puzzles/art/067-lakeshores.jpg>。按任务 §4，改动是 UI，转 UI 卡，不计入本卡候选。

## 6. 按门槛排除、旧对照与平台政策（丁级，20 项）

| 对象 | 链接 | 排除原因 |
|---|---|---|
| Tiberava（罗马城市建造） | <https://tiberava.online/> | 玩家 10-18 反映平移卡顿、要 WASD，发帖者 cayodister 当夜回复“今晚实现”，10-19 回复“Done: 平移更顺、支持方向键/WASD”（<https://news.ycombinator.com/item?id=50146401>、<https://news.ycombinator.com/item?id=50147783>），当前 app.js 确有 PAN_KEYS，属于反馈→实际改动的好样本；但同一作品另由 granga 在 10-14 发 Show HN（50081186），cayodister 说“Kind of know that guy”，站点无作者署名，无法确认同一作者。按“原作者身份不够就排除”不计通过候选。 |
| Tower of Time | <https://github.com/maciej-trebacz/tower-of-time-game> | 作者 M4v3R 用 Cursor/Augment Code 做塔防，README 称约 95% 代码由 AI 写，PROMPTS.md 全公开，MIT；HN 319 分/152 评，作者回复了玩家 freehorse 的教程卡死报告（作者回复 <https://news.ycombinator.com/item?id=44465219>，玩家报告 <https://news.ycombinator.com/item?id=44465179>）；主帖 <https://news.ycombinator.com/item?id=44463967> 是 319 分/152 评的来源，同日 16:06 有提交修“卖塔”并恢复波次。但该提交与 HN 报告的教程 bug 不对应，itch 可玩页与 devlog 本机 TLS 读不到，不能证明玩家反馈的修复进了可玩版本；只留 GitHub 线索。 |
| Epic Survivors | <https://store.steampowered.com/app/3553800/Epic_Survivors/> | 作者 BlueShrimpGames 的 devlog 记 104K 行 C#、5,982 commits、8 个并行 agent，HN 作者回复称 demo 首发后“fixed many things”（作者回复 <https://news.ycombinator.com/item?id=46729539>，主帖 <https://news.ycombinator.com/item?id=46729034> 是 devlog 与分数来源），但 Steam 新闻 API 为 0 条、没有具体玩家反馈→补丁对应，商店页仍 Coming soon；不能仅凭自述算玩家闭环。 |
| Feudle | <https://feudlegame.com/> | 非开发者 papaolivia92 用 ChatGPT 做 Family Feud×Wordle，HN 2025-03-25 52 分/35 评；多名玩家抱怨订阅弹窗，作者回复会把注册移到别处（作者回复 <https://news.ycombinator.com/item?id=43475055>，主帖 <https://news.ycombinator.com/item?id=43471939> 是 52 分/35 评来源），当前页面不再自动弹订阅框、改为顶栏“Sign up for daily email”入口，说明改动进了线上，但没有日期/版本，且主要是 UI；同义匹配与“meat→chicken”判定仍未证实已改。转 UI 卡。 |
| The Brave Knight | <https://www.sabih.dev/game/> | 作者 irisguy 用 Claude Code＋Opus 5.5 六小时做出，HN 2026-11-01 21 分/15 评；玩家 11-02 报告只能用鼠标点 next、洞顶不挡箭，作者 11-02 回复已改成任意键继续、洞顶现在挡箭（作者回复 <https://news.ycombinator.com/item?id=50342844>，玩家报告 <https://news.ycombinator.com/item?id=50340947>；主帖 <https://news.ycombinator.com/item?id=50326721> 是分数来源）。有反馈→玩法改动，但作品只有六小时、无版本/许可/成本，按“不收只有首日演示”作线索。 |
| Everweave | <https://everweave.ai/news/bugtober-update> | AI 担任 DM 的文字 RPG 在 Update 15“朋友与陌生人”因状态追踪、叙事断裂遭社区反弹后，官方把 Legacy 模式独立为 Creative Mode 永久分支，并在 Bugtober 停更一个月、按 5000 份玩家问卷修记忆与战斗（官方称记忆召回 +34%）。AI 是玩法核心而非开发主体，不计本卡候选。 |
| Vapor World: Over The Mind | <https://store.steampowered.com/news/app/1996090/view/1841579228662637>、<https://store.steampowered.com/news/app/1996090/view/1841579228666453>（ISteamNews 正文可读） | 2026-08-18 抢先体验上线后，8-19 的 0.5.4 热修删除全部 AI 过场并恢复手绘原版；0.5.4 已知问题写“接下来几个补丁可能重置存档”，0.5.4f10 按“移动太慢”反馈改移动/动作手感，并修复标题画面无法继续与存档重置。AI 只涉及两个过场，不是 AI 大规模开发。 |
| Bald Ball | <https://store.steampowered.com/app/3489590/Bald_Ball/> | 2025-03-14 发售、2026-10-07 推 2.0；作者明说原作是纯手写“意面代码”，发布一年半后靠 Claude Code 查出成就第三方资产的编译阻塞、一个被默认关闭的物理设置，修好本地合作与 Hardcore、重做菜单并新增联机合作。它是“AI 收拾发布后烂摊子”的反向样本，不是 AI 开发作品。 |
| Future? No Thanks! | <https://www.molleindustria.org/blog/future-no-thanks-update-now-with-no-ai-generated-voices/> | 2026-10-17 发售、10-23 作者原文宣布删掉厕所与美发店两处 AI TTS 配音改真人、给觉得被背叛的买家退款，并提高零工报酬防卡关；起因是 Bluesky 上对其 AI 披露的批评。AI 仅用于配音与少量编码，不是 AI 大规模开发。 |
| KAYFABE | <https://store.steampowered.com/app/5389060/KAYFABE/> | r/aigamedev 作者为这款摔角经营 demo 发布更新，新增双人像素动画、三秒压制与胜负播报并征求反馈；商店页 AI Generated Content Disclosure 写“AI tools were used to create artwork and assist with coding. The game's writing and planning were created by the developer. No generative AI runs during gameplay.”，但游戏仍标 Coming soon（2026-11-06 复核商店页与 appdetails：coming_soon true、date“Coming soon”）且提供 demo，未过发布后返工门槛，只作 demo 阶段迭代线索。 |
| GamePartner.AI | <https://gamepartner.ai/> | 面向全球休闲游戏的一站式 AI 智能体平台，宣称代码、美术、音乐零门槛生成并极速上架，已吸引 300+ 中小团队。平台本身不是作品。 |
| SoonPlay（极逸轻游） | <https://soonplay.jysoon.com/> | 恺英网络旗下极逸 2026-10-20 公测的“视频即游戏”平台：上传视频由 SOON AI 识别玩法生成可玩游戏，AP1–AP6 分级。新增分发入口，尚无发布后返工样本；生成质量与留存未知。 |
| Google Playground / Unity Spark | <https://unity.com/news/google-and-unity-partner-on-new-ai-gaming-platform-for-the-next-era-of-interactive-entertainment> | 2026-10-07 Google Labs 与 Unity 发布 Playground：自然语言生成/修改可玩浏览器游戏，US 18+，接 Google Play Games 档案与排行榜；后续 Unity Spark 计划年内提供 3D 与 Asset Store 资产。新增官方供给入口，无发布后返工样本。 |
| Meta Horizon Create / Horizon Studio | <https://www.gamesindustry.biz/meta-unveils-ai-powered-game-tools-for-mobile-devices-and-browsers-announces-vr-glasses-with-day-one-unity-support>，转述 <https://mobilegamer.biz/horizon-create-users-can-create-and-publish-games-on-instagram-and-facebook-says-meta/> | Meta Connect 2026（9 月下旬）发布手机端 Horizon Create 与浏览器 Horizon Studio：自然语言生成 2D/3D 可玩游戏，可分发到 Facebook/Instagram/Horizon，早期访问＋waitlist。官方 developers.meta.com 博客本机 000，链接为媒体报道；无发布后返工样本。 |
| Bluesky Attie | <https://www.theverge.com/tech/1012374/bluesky-ai-attie-small-social-games-apps>，转述 <https://techcrunch.com/2026/10/15/bluesky-expands-its-ai-powered-attie-app-to-let-anyone-build-websites-games-and-more/> | 2026-10-15 Bluesky 在 TechCrunch Disrupt 宣布 Attie 可提示词生成小游戏/网站/测验，作品绑定 ATProto 身份、发布在 attie.site，CEO 称“social vibe coding”。官方博客未定位，链接为 The Verge 报道；无返工样本。 |
| Claude Code 禁止复刻现有游戏 | <https://www.techpowerup.com/354351/anthropic-bans-ai-game-clones-and-reverse-engineering-with-claude> | 2026-10-27 起 Claude Code 服务端规则拒绝复刻具体现有游戏，10-30 Anthropic 的 Addy Osmani 确认，11-04 v2.1.317 放宽为可提游戏名描述机制；官方无 changelog 条目，链接为报道。对用 Claude Code 做游戏的人是新增硬约束。 |
| Steam 发布新规与审核积压 | <https://www.engadget.com/2306215/valve-changed-its-steam-release-rules-amid-a-flood-of-ai-games/> | 2026-11-03 Valve 改 Steam 发布规则：提交前须实跑 5 分钟、确认运行库/成就/云存档路径、截图须分类为 gameplay/menus/concept art/cinematics，预发布审核最多拖到 12 个工作日；报道引 10 月新游 49.9% 披露 AI 内容。影响 AI 游戏发布节奏。 |
| itch.io 清理 AI slop 与“No AI”筛选 | <https://in.ign.com/news/276035/indie-game-storefront-itch-deletes-a-couple-of-terabytes-of-ai-slop-adds-no-ai-filter-to-search-resu> | 2026-11-02/03 itch.io 删除“数 TB AI slop”并在搜索加生成式 AI 披露过滤；官方声明在社交平台，链接为 IGN 报道，报道未提扩展到桌游/书籍/漫画/原声，本页不写该扩展。AI 游戏分发端重大变化。 |
| Anthropic 2.1.317 游戏限制放宽 | <https://www.tomshardware.com/tech-industry/artificial-intelligence/anthropic-loosens-game-restrictions-claude-will-now-offer-to-build-original-game-in-same-genre-if-asked-to-copy> | 本批 Claude Code 禁令的后续：2.1.317 允许点名现有游戏仅用于描述想要的机制，并让 Claude 做同类型原创，影响 AI 游戏“参考/复刻”的边界；政策线索，不是作品。 |
| Valve Steam Indie Connect：发布是起点 | <https://spawnpoint.be/steam-ai-slop-valve-next-fest/> | Valve 在 2026-10-27 对独立开发者称“发布感觉像终点，其实是起点”，建议持续更新和建社区，同时承认 AI slop 但未给具体措施；可作发布后迭代的政策背景。 |

## 7. 交付边界、缺口与下一步

**本轮实际核了什么。** 对约 60 个候选链接做了 `curl` 状态码抽查（Steam、TapTap、Bilibili toy、作者站多为 200；`v2ex.com` 直连 000，`global.v2ex.co` 200），并对前三项做了页面/API 复核：Fire Field 的 appdetails、商店 AI 披露、27 条新闻/更新（EA 后 24 条）与三篇公告正文；Inselnova 的反馈闭环长文、10-21 周记与 release notes 索引；群侠传的 appdetails、商店 AI 披露、8 条新闻与 V0.1.1/V0.1.2 补丁正文。另复核了 Tropic Tumble、Shrinebreaker、Monkyupe 的原文关键段，以及 Rakugaki Beast、O'BLOCK、S.O.L、Three Kingdoms、Huebound、Traffic Architect、Tasty Chef、HEXSTORM、Idle Crown 的商店披露与 Recent/All 评价数。其余条目的事实取自提交清单，本次未逐篇重读原文。

**没有做。** 未启动任何游戏，未播放视频/音频，未看完整连续实机，未登录任何站点，未发帖或联系作者。因此本页不能声称任何作品“已玩”“已看完”“手感/帧率/听感通过”，也不作品质排名。所有“可玩”只到公开入口与页面文案。

**仍然缺的硬项。**

- **作者静态截图原 URL**：前三项已各补一张并在本次逐张打开核过（Fire Field 的 v2.0 新闻图、Inselnova 的 chronicle 游戏内聊天图、群侠传的 V0.2.0 新闻江湖录/战绩图）；其余只有 Wonderhop、Missile Command、Jigsaw Haiku、Tower of Time 等少数条目给了公开静态图链接，仍未逐张核。不能用商店 capsule 图代替。
- **许可与成本**：多数条目只写“未知”。Fire Field 只有“每月 20 美元套餐足够”的作者口径；群侠传、Inselnova、Monkyupe、Tropic Tumble 的代码/资产许可与总成本均未披露。
- **作者身份**：Inselnova 只到名 Darren；Shrinebreaker 站内只署名 Twisted Up Entertainment LLC，AI 分工证据在作者 Reddit 账号 zrikz，站内无 AI/credits 披露；Monkyupe 作者是个人学生；这些在推荐前应让负责人确认可引用边界。
- **玩家闭环强度**：Fire Field 24 条评价、O'BLOCK 5 条、Rakugaki Beast 3 条、Shrinebreaker 峰值并发约 10，样本都不大；群侠传 2,347 条是最大样本，但 AI 只写部分代码。
- **itch 页**：Monkyupe 的 itch 游戏页/devlog/评论、Tower of Time 的 itch 补丁记录、Crown of the Grave/PointlessQuest 的原页均因 TLS 拦截未读；这是本轮最大的来源缺口。

**最强 1 项优先试玩建议。** 先完整试玩 **Fire Field**，按可执行清单走：走完教程后下到第 3 层，主动被蜘蛛咬（v1.9.1 点名的叠毒源），记录连续被咬后每秒伤害是否仍为 3、是否只刷新持续时间；遇到毒气陷阱或斩击流血时按同规则记录。动手前先核 v2.0 重建地牢后第 3 层是否仍有蜘蛛；若没有，改用当前版本仍存在的叠毒源复测。另单列一条：“旧存档在中毒状态保存，读档后降为单层”需要 v1.9.1 之前的旧档，新购买玩家无法创建，只能当补丁文本证据；迁移行为改用我们自己的 FPS/MOBA/Star 旧档验证。同时读 v1.6.0、v1.6.1、v1.9.1、v2.1.0、v2.1.7 五条补丁（新闻索引 <https://store.steampowered.com/news/app/4527100>，可逐条打开）和 2026-09-23 的作者长文。验收只记“补丁声称的条件在可玩版本里是否成立”，不把商店页文案当已验。

**一个可在现案例验证的具体机制：修复必须覆盖旧存档/旧状态的迁移与回归。** Fire Field 的 v1.9.1 不只改新中毒逻辑，还规定“旧存档若在中毒状态保存，读档后降为单层”；Tropic Tumble 的“Event Ended”根因是云恢复 + 存档合并把旧终态带回来，修的是 save merge 与 repair 路径并加恢复回归；群侠传 8-13《On the Endless Mode Performance Issues》与 8-15《Recent Performance Work》也修了旧存档窗口尺寸与自动存档写入/存档文件膨胀（首日 V0.1.1 只有低端机优化，不含存档改动）。三者共同给出一个可照做的规格：

1. 玩家报告的现象先写成“当前状态 + 期望状态”两行；
2. 修复分“新状态逻辑”和“旧状态读入”两段，旧状态必须定义降级/迁移/拒绝策略；
3. 补一条从旧存档/旧终态出发的回归，而不是只测新开档；
4. 发版说明写清旧存档会发生什么，玩家能自己判断是否受影响。

这个机制可以直接在现有 FPS/MOBA/Star 的存档/读档模块里验证：拿一个真实的旧档（改过数值或规则前的档），按上述四段做一次修复，观察旧档读入是否被正确降级、回归是否覆盖、发版说明是否可复述；它比“再加一个 UI 提示”更接近本卡要的发布后返工能力。

**下一步顺序。**

1. 负责人试玩 Fire Field，只复测当前版本仍可复现的叠毒源（第 3 层蜘蛛、毒气陷阱、斩击流血）与 v1.9.1 条件；若入口/运行不可用，记录实际失败点，不跳过后称通过。旧档迁移回归另做：用我们自己的 FPS/MOBA/Star 旧档按上面的四段机制验证，不去 Fire Field 找旧档。
2. 用 Inselnova 的“欢迎消息 → 回复 → 带署名任务卡 → 发版告知”流程，改写我们现有的一条玩家报告处理链；只借流程，不复制其游戏内容。
3. 中文线用群侠传核对“首日补丁 → 无尽模式 → 性能大修”的版本链；TapTap 线用吃谁变谁/捡完就撤补核 AI 分工与版本号。
4. 补核 Monkyupe 的 itch 页与 devlog；若可达且版本/许可补齐，它可替换前三中的任一项。补核 Tropic Tumble 的商店/可玩入口后同理。
5. 不新增广搜；本页已把 89 个在册条目（另 2 项转出 UI 卡）按缺口分好，后续只按缺口逐项补，不再扩大题目。
