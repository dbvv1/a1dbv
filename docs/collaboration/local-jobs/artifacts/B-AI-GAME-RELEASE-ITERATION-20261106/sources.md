# B-AI-GAME-RELEASE-ITERATION-20261106 · 发布后返工实游戏候选来源

> 原始采集与静态核实日期：2026-11-06 UTC。本页整理三个工作单元的已核实候选：§1–§7 为第 1 单元在册的 89 项，§8 为第 2 单元（u2-a0）2026-11-06 追加核实的 220 条清单链接（其中 18 条为上下文/方法/工具/索引，不计作品；2 项本轮通过），§9 为第 3 单元（u3-a0）2026-11-06 追加核实的 196 条链接（其中 10 条与 §1–§8 在册条目重复，排重后 186 条新链接、182 个新对象；3 项本轮通过：Brickbrag、哈耶克的文明：市场经济、Permit Pending）。三节都只整理已核实并交回的候选清单，不新增清单外作品链接。本机只读公开网页、API 与源码；未启动任何游戏、未播放视频或音频、未登录、未发帖、未打开浏览器。链接返回 200 只代表页面可响应，不等于已实玩、已看完整实机或品质通过。商店页的 Recent Reviews 与 All Reviews 分开记，本页默认写 All Reviews，必要时注明 Recent。

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

**第 2 单元追加（2026-11-06，详见 §8）。** §8 另核实 220 条清单链接（其中 18 条为上下文/方法/工具/索引，不计作品；按唯一链接计，含同作品多入口，如 Panache 的仓库与站点、Emberworks 的 `.games` 与 `.dev`），其中 2 项本轮通过：**Enarian: Orbital Command**（Steam，商店 AI 披露明写 AI 参与 coding，v1.4 补丁开头写 “following amazing feedback from players”，把维修命令改成两船相向靠拢并跟到修完）、**Realm of Eldermyr**（免费浏览器，release notes 到 v3.518.0，修玩家报告的屏幕抖动与技能点每次登录重置）。**翡翠经营模拟器**有 9.0 分/2,011 条评价，v0.1.36 按“相当一部分玩家觉得过于无聊”把原石期望收益从约 4 倍降到约 1.8 倍，但 app 页只有“TapTap 制造创作者”平台标签，没有作者制作过程原文与逐项 AI/人分工，降为 §8.4 第一备选，不计通过。本轮最强新候选为 Enarian；卡级首推仍为 Fire Field，因为 AI 开发规模与补丁可复测条件更完整。需要“近两周内刚发生玩家反馈→补丁”的新鲜样本时优先看 Enarian；需要大样本时看翡翠（但缺制作过程原文）；需要免费浏览器时看 Eldermyr。其余 18 项列本轮第一备选，见 §8.4。

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
- **一次具体二改**：v1.9.1 补丁原文（<https://store.steampowered.com/news/app/4527100/view/1842212951302391>）写“A player reported that poison felt far too strong.” 毒原本每次中毒叠一层（毒源含蚁狮 antlions、蜘蛛、毒气陷阱与斩击流血），最多 3 层叠到 9 伤害/秒，且无视护甲与 Mana Shield；三只蜘蛛围住时约 1.5 秒叠满，药水跟不上。改为不再叠层、只刷新持续时间，四类毒源同规则；蜘蛛位于第 3 层（补丁原文），复测从该层开始。旧存档若在中毒状态保存，读档后降为单层。同版还重做了地图显示（墙/门/楼梯按真实颜色）。
- **第三方复核（仅首发周）**：RPG Jeuxvidéo 的 L'archiviste 2026-05-27 英文版文章 <https://www.rpgjeuxvideo.com/divers/fire-field-an-early-access-first-look-english-version/>（原链本次直连 200；正文经 translate.goog 读取）按日记录 2026-05-13–17 首发周问题：首批问题作者 12 小时内修完，四天内补齐 AZERTY、滤镜、亮度与自动拾币等；文末写“It has earned my respect.”。作者 2026-10-07 的 Steam 帖转述了站内评论“Do not buy this”，并说双方后来成为朋友/导师关系。该文不覆盖 8-28 的 v1.9.1；v1.9.1 的证据只有补丁原文 + 玩家报告。
- **为什么最值得先挖**：三项少见的证据同时成立——(1) 零编程作者 + AI 写约 18 万行，AI 开发规模可核；(2) 补丁原文直接点名玩家报告并给出可复测条件（毒不叠层、旧存档降级），不是“修了很多”；(3) 第三方 L'archiviste 只对 5-13–17 首发周做了逐日复核，能外部验证首发周修复，但不能外推到 v1.9.1；v1.9.1 依靠补丁原文给出的可复测条件。11-04 仍在更新，能看当前版本。它最适合回答“发布后第一周怎样把玩家报告变成可复测补丁”。
- **缺口**：作者静态截图已补一张 <https://clan.akamai.steamstatic.com/images/46077957/5ffa1327ca739cdca2f3afd009d585024bb8e019.png>（2026-09-27 v2.0 Mega Update 3/5 新闻 <https://store.steampowered.com/news/app/4527100/view/1844751498229088> 内图，本次打开确认为游戏内选职业界面；其余商店图未逐张核）；代码/资产许可未声明；成本只有“每月 20 美元套餐足够”的作者口径，不是总成本；24 条评价样本小；本机未启动游戏，玩法、帧率、听感未验。

### 3.2 Inselnova（浏览器持久世界，反馈闭环机制最完整）

- **可玩入口**：<https://inselnova.com/play/>（免费浏览器；本次打开返回 200，未启动游戏）。**作者原文**：<https://inselnova.com/chronicle/2026-09-24-player-feedback-loop/>（作者 Darren，单人、兼职开发；作者站首页本次也返回 200）。
- **反馈闭环**：玩家加入约 1 小时后收到作者在游戏内聊天的欢迎消息；世界 5 有 1,142 名玩家收到过某个版本的欢迎消息，17.5% 回复，长期玩家回复率 43%，作者回了 200 条回复中的 195 条；1,538 张已完成任务卡中 121 张来自玩家（7.9%），32 名玩家被标为报告者，其中 28 人先回过欢迎消息。作者把其中一部分回复变成带玩家署名的任务卡，其余多数只进入下一步计划、不成卡；上线后告诉玩家。
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

1. **Tropic Tumble** — <https://juliapottinger.com/done-is-the-whole-chain/>。Android/iOS 三消，作者称大部分由 AI coding agents 建成。玩家在活动仍进行时看到“Event Ended”；根因是云恢复 + 存档合并把旧的终态带回来，作者修了 save merge 与 repair 路径并加恢复回归测试；同批还修了“Claim All”假红点、双击重复发奖、排行榜只读本地。缺口：作者长文链到官方站（<https://www.tropictumblegame.com/>，本次打开 200），官方站再链 App Store/Google Play；不是“入口不可核”；无版本号；许可与成本未知。不列前三是因为无版本号、部分改动偏工程/UI、玩家样本与来源未量化。
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
2. **Traffic Architect** — <https://store.steampowered.com/app/5028050/Traffic_Architect/>，网页版 <https://www.crazygames.com/game/traffic-architect-tic>。Claude Code 负责 Three.js 场景/相机、A* 寻路、路口吸附、交通模拟、UI 与低模，人负责设计、难度经济、架构、审查与调试方向；CrazyGames 2026-04 上线、作者称 15 万次游玩/9.2 分；Steam demo 1.0.1–1.0.3 写“You asked for the paint to be obeyed…”，1.0.6–1.0.8 反复写“Most of it came from your reports here in the discussions and on Discord”（该措辞只出现在 1.0.6–1.0.8，1.1.0 不属此列），正式版 2026-11-03、All Reviews 81 条/81%。缺口：正式版上线仅 3 天，只有发布前 demo 修订；Steam 无 AI 披露，AI 分工只有作者 Reddit/Devlog 口径。
3. **Huebound** — <https://store.steampowered.com/app/4459040/Huebound/>。Steam AI 披露只写“AI coding assistants were used during development to help write and debug game code”，其余视觉、音频、调色板、配方与玩法由游戏自身程序生成。2026-05-16 上线；本次复核商店页 All Reviews 显示“Need more user reviews to generate a score”，页面标 5 条评价（样本少）。上轮提到的“玩家抱怨嗡嗡声后推出命名更新、修嗡嗡声/重做教程/加速度滑杆”在 2026-11-06 复核的 ISteamNews（9 条，均早于上线）与商店页均无对应标题或原文，本轮删去该说法，只保留可核的 AI 披露、上线日期与 5 条评价。缺口：AI 占比不足以称大规模；5 条评价样本少；更新细节未核。
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
| Future? No Thanks! | <https://www.molleindustria.org/blog/future-no-thanks-update-now-with-no-ai-generated-voices/> | 2026-09-04（Steam）发售、10-23 作者原文宣布删掉厕所与美发店两处 AI TTS 配音改真人、给觉得被背叛的买家退款，并提高零工报酬防卡关；起因是 Bluesky 上对其 AI 披露的批评。AI 仅用于配音与少量编码，不是 AI 大规模开发。 |
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

## 8. 第 2 单元（u2-a0）2026-11-06 追加核实：220 条清单链接

> 本节是同一任务第 2 个工作单元（u2-a0）的增量报告。按任务 §2 的来源范围（itch devlog＋补丁、Show HN 作者回复＋可玩站、Steam 更新＋作者长文、一个中文作者原帖）与 §6 门槛，本轮从 GitHub、Hacker News、Reddit/Arctic Shift、Steam、TapTap、Bilibili、linux.do 镜像、Zenn、作者站与目录/榜单等 18 个收集角度重扫，经链接核对（curl 并行，逐条按状态码与页面标题判断）保留 **220 条清单链接**（其中 18 条为上下文/方法/工具/索引，不计作品；作品相关 202 条，含同作品多入口）。§3–§6 的上轮 89 项仍在册且未被推翻；本节只写本轮新增与补强，已在上轮列出的作品（归墟、一针一线等）只标“补强”，不重复建条；§8.5 表按 220 条清单原序保留，其中 3 行上轮条目已逐行标“补强”，不占新候选。所有候选只读公开页与 API，未启动游戏、未播放视频/音频、未登录、未打开浏览器；“可玩”只到页面 200 与公开入口存在，不等于已实玩。

### 8.1 本轮渠道覆盖表

| 渠道 / 收集角度 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| GitHub（REST search / repos / contents / releases / commits / raw / Atom） | 未装 gh CLI，用 curl 调 api.github.com；search/repositories 跑 `game claude code in:description`、`game "vibe coded" in:description`、`browser game claude in:description`、`AGENTS.md game in:readme`、`CLAUDE.md game in:readme`、`topic:vibe-coding`、`topic:ai-game`、`topic:claude-code game` 等，按名检索 quasar-saz/bashfighter/shrinebreaker/traffic-architect；正文用 raw.githubusercontent.com，限流后改 commits atom | 仓库线约 15 项（Kart Royale、Quasar Saz、OpenSoccer、Mall Bats、1D-Pong、react-xiuxian-game 等） | 代码搜索 `github.com/search?type=code` 需登录、grep.app API 被挡，无法按文件内容检索“含 AGENTS.md/CLAUDE.md 的游戏仓库”；未认证 REST 403 rate limit，issue/PR 与部分仓库清单未取全；floktoid、pumpkin-farmer 仓库 404 |
| Hacker News（Algolia `/search`、`/search_by_date`、`/items`） | search 与 search_by_date，tags=show_hn，2024-11-06 起约 50 组查询；show_hn game 语料 6,767 条，AI+game 过滤 506 条；另用 tags=comment 搜 19 个修复/反馈短语（thanks for the feedback、should be fixed、just pushed、now fixed 等），命中 14,763 条后按 story_title 反查；items 读约 70 个线程正文、作者回复与含 fix/bug/feedback 的评论 | 约 60 项（Kart Royale、SweatyPanzer、Eldermyr、Aim and Shoot、Refinery Run、Beakdown、Sagorax、Fly By、Kindlefall 等） | 只读到作者回复与含修复/反馈词的评论，未逐层读完完整评论树；Kart Royale、LAST CROWN、Bash Fighter、Quasar Saz 在 HN 无对应讨论帖；直连 news.ycombinator.com 000，仅 API 可读 |
| Reddit（直连 + Arctic Shift 归档 API） | 直连 403/TLS，改用 `/api/posts/search`、`/api/posts/ids`、`/api/comments/search`；r/aigamedev 2026-10-30～11-06 翻 1,400 条近期帖，按 update/patch/fixed/feedback/listened/v1.x 过滤；按作者名追帖 | 约 10 项（Diablo 2 Survivors、Grim Reach Idle、HALFTIME、DeltaV、Kapi Online、Shrinebreaker 等） | `reddit.com`/`old.reddit.com` 直连 403/TLS；redlib/eddrit/safereddit 被 bot 墙或 TLS 失败；深层评论树未逐条读；本轮末尾 Arctic Shift 502，个别作者/评论未读成 |
| Steam（store HTML、appdetails、ISteamNews、news hub、策展、/developer/、morelike） | search/results infinite=1 跑 25 个关键词得 1,206 个唯一 appid，按 2025–2026 且非 Coming soon 筛出 146 个精确池；全部调 ISteamNews GetNewsForApp v2（count=40、maxlength=0）读公告全文；appdetails 核发售/价格/开发者；73 个有公告的抓商店页 AI Generated Content Disclosure（45 个有披露）；再按 code/program/script/Claude/Cursor/Copilot/Unity/Godot/refactor/debug 过滤 | 约 50 项（Enarian、Ultimate Blacksmith Tycoon、Zero To Hero Idle、FlashBoss、Track Star、Gargadusa、Agents! Please?、Infinite Night、Morhval、HALFTIME、OUTWORKS、ALGO ARMS、FLOWWORKS 等） | `steamcommunity.com` 000/TLS/Socket closed，评测正文与讨论区未读；appreviews 302 空；SteamDB 403；news hub 是前端壳（正文改由 API 取）；开发者搜索页被 JS 挡；morelike 只回通用同品类邻居 |
| TapTap（app 页、moment、developer 页、webapiv2、`__NUXT_DATA__`） | curl/WebFetch 直读应用页、moment、开发者页、评论页；解 Nuxt `__NUXT_DATA__`（devalue 索引表）取 title/developers/tags/stat/whats_news/update_time；追 developer/270778、405060、460317、438722、402163、428865 等同厂作品；抓 /tag/TapTap制造 列表 | 约 70 项（翡翠经营模拟器、全村最好的剑、AI战役、宿命旅途、猫猫翡翠、钓海暗涌、多米诺的子弹工厂、越跳越有钱、积案拂尘之外的 TapTap 同厂作等） | webapiv2 报 INVALID_XUA；搜索 API 404；评论原文与完整版本历史未取；部分页面只显示“昨天/前天”，绝对日期未核；静态页不展示逐条更新日志 |
| Bilibili（toy 页、视频 view API、搜索 API、space） | toy 页直接打开；view API 读视频标题/UP 主/日期；搜索与 space 列表尝试 | 4 项（万梗捏、3D 元气骑士、旅行奶蛙、梗力全开）＋方寸喵居、明末的 B 站交叉 | opus/视频详情返回“验证码_哔哩哔哩”；搜索 API 先 -799 后返回 HTML；space 412/-352/-799；评论端点 404；toy 页返回“登录提示” |
| linux.do（直连 + locdd.com 镜像） | 直连 curl schannel TLS exit 35、WebFetch Socket closed、translate.goog 403；改用 locdd.com 镜像读 SOULFORGE、Achroma 帖正文与前 20 楼 | 2 项（灵魂锻炉 SOULFORGE、Achroma）＋妖潮渡劫摘要 | topic/2981705、3053077、1327338、2986886 等原帖与楼中楼未直读；Achroma 镜像只有第 3 页与旧标题，1.6.0“炉温”更新只有搜索摘要 |
| itch.io（主域、`*.itch.io`、devlog、jam `/rate`） | 直连 TLS 被拦；改走 `<author>-itch-io.translate.goog` 间歇读取；itch-io.translate.goog/games/ai-assisted 列表页取 72 个 AI Assisted 条目 | 约 6 项（Ketchup and Doll、Serenitrove、PBA、ZEROVEXIS/Fortigon/Wasteland Renegades 入口只作线索） | 直连 curl 000/exit 35、WebFetch Socket is closed、translate.goog 400/429；Bingo Patch、ZEROVEXIS、Starstruck、Fortigon、Wasteland Renegades、Tales of Eternity、Broadside、Technically Fishing、Shuriken Slam Jam 的 itch 页/devlog/评论/版本记录未直读；Newgrounds 403 |
| Zenn（articles API） | `/api/articles?username=siam_works&order=latest` 与 `/api/articles/<slug>` 读 LAST CROWN、いきなりラスボスRPG、鉱石採掘 全文 | 3 项（LAST CROWN、いきなりラスボスRPG、鉱石採掘インクリメンタル） | Zenn 站内 search API 返回 400，无法系统检索“公开后按玩家反馈修”的日文案例；Destroy Go 后续两篇为会员/付费内容不可读 |
| 作者站 / 博客 / 技术社区 | curl/WebFetch 抽正文与出链：ryancampbell.com、homie.rocks、siam-works.com、typeonce.dev、vaigames.com、simonwillison.net、kylekukshtel.com、popcar.bearblog.dev、eldermyr.com、fuelingcuriosity.com、kindlefall.com、kikkupico.com 等 | 约 12 项＋方法文 3 篇 | simonwillison.net WebFetch 被域名校验拦（curl 可读）；dator.dev/sitemap 403；typeonce 子域 sitemap 404、首页 JS 渲染；parttimeindie.com 正文仅 540 字符 |
| 中文媒体与平台（知乎、头条、掘金、腾讯新闻、界面、澎湃、机核、nmbxd1、NGA、少数派） | 只用于定位作品名与二手摘要；头条、搜狐、掘金、界面、澎湃、机核读到部分正文 | 约 10 项（明末、猫咪守卫队、一针一线、TapTap 制造摩擦、阿珠开蚌、清明上河图、小喵钓鱼、积案拂尘、寻呼1996 等） | 知乎 403/650B 反爬页；微信公众号验证墙；小红书需 App 内进入；头条正文空/JS；B站 opus 验证码；nmbxd1 只读到首楼 |
| 目录 / 榜单 / 平台（awesome-ai-built-games、Vibe Jam 2026、OpenAI Showcase、Playgama AI Game Index、AI Transparency Index、GamesByAI、Astrocade、Tesana、Homie、Gauntlet Loop、aibuiltgames） | 读 README、Vibe Jam 页面内缓存数据集（945 条含 final_rank/made_with/award）、showcase/llms.txt、Playgama data.json、AI Transparency Index initialProducts（50 条）、Tesana 25 个游戏页、Homie 官方四款、Gauntlet Loop 目录 | 交叉线索约 30 项（WenWare、Null Range、Field of Command、Sunset City、BUNGR、Emberworks、Halocline、VybeCiv、Tesana 系列等） | Playgama data.json 只有聚合指标、无单款游戏名；AI Transparency Index 的 ?tag=Programming 返回“编程题材游戏”而非“AI 写代码”，不作候选来源；Astrocade/Homie/SimCFB/Hoardborn 是 JS 壳；playgroundarcade Cloudflare 403；TinyRTS 停放、0.space/WorkBuddy/Astrocade 详情不可读 |
| X/Twitter、Discord、YouTube、Bluesky、Newgrounds | 尝试读作者时间线/单条长帖、Discord 邀请、实机/预告片、Bluesky 原帖 | 0 项直接候选 | X 登录墙或 402；Discord 未登录；YouTube 未播放；bsky.app 000、attie.bsky.app 无部署；Newgrounds 403“NG Guard”；全程未播放视频/音频 |
| WebSearch 与通用搜索引擎 | 多个子批次共用 200/200 配额；前半程关键词找作者/作品，后半程改站点 API、HN/GitHub API 与直接抓页 | 0 项直接计数（只作索引入口） | WebSearch 200/200 用尽；Bing 中国版对英文/`site:` 返回无关结果；Google、DuckDuckGo、Mojeek、Startpage、Brave、SearX 被阻断或验证码 |
| 游戏运行 / 视频 / 音频 | 未启动任何游戏、未播放视频/音频、未打开浏览器；可玩性只到 HTTP 200 与页面文案 | 0 项实玩 | 所有候选均缺本端实玩或完整连续实机；帧率、手感、听感、完整游玩回路未验 |

**本轮读不到（原始记录 134 条，按渠道归并；只保留会改变判断的项）。**

- **GitHub**：代码搜索需登录、grep.app 被挡；REST 403 rate limit；`franzenzenhofer/floktoid`、`simonw/pumpkin-farmer` 仓库 404；awesome 列表的 issues 与提交区、cleak 的完整仓库清单未取全。
- **X/Twitter、Discord、YouTube、Bluesky**：登录墙/402/未部署；Pieter Levels 的一手更新串、Ryan Campbell/Siam Works/Typeonce 的发布后更新帖与玩家回复、视频与音频均未读；因此“实机手感/音效”类反馈只能停在文字层。
- **itch.io 及 `*.itch.io`**：本机 DNS/TLS 拦截（curl 000/exit 35、WebFetch Socket closed），translate.goog 间歇 400/429；Bash Fighter、Rogue Memory、Rose & Blade、Afterimage、Bingo Patch、ZEROVEXIS、Starstruck、Fortigon、Wasteland Renegades、Tales of Eternity、Broadside、Technically Fishing、Shuriken Slam Jam 的 itch 页/devlog/评论/版本记录未直读。
- **linux.do**：直连 curl schannel TLS exit 35、WebFetch Socket closed、translate.goog 403；topic 2981705（Achroma）、3053077（妖潮渡劫）、2813244、1327338、2986886 的原帖与楼中楼未直读，只能经 locdd.com 镜像与 WebSearch 摘要。
- **知乎、微信公众号、小红书、B站 opus/搜索/space、TapTap 动态/评论页**：403/验证码/登录墙/404；《无为修仙传》知乎原文、方寸喵居 V1.9 视频页、阿珠开蚌/小喵钓鱼/清明上河图的小红书原帖、TapTap 完整评论串与版本历史未读。
- **Steam 社区侧**：`steamcommunity.com` 000/TLS/Socket closed，`appreviews` 302 空；School of Magic 讨论原帖、Enarian/OBSESSED 的逐条评测、Rogue Genesia 的 AI 争议帖原文未读，只能读商店 AI 披露、All Reviews 汇总与 ISteamNews。
- **Reddit**：直连 403/TLS，Arctic Shift 可读正文与部分评论；r/aigamedev 之外的子版与深层评论树未逐条读，末尾 502 致个别作者/评论未读。
- **站点/平台**：`0.space`、`the-golf-is-golfing.com`、`mall-bats.vercel.app`、`jarls-production.up.railway.app`、`pawnpush.com`、`20-0.com`、`fantos-megamart.vercel.app`、`delmar.dev` 根域等 TLS/000/404/403；Bash Fighter 站点仅 396 字节前端壳、无仓库入口；`autoyeyu.top/xiantu/` 是 Angular 壳只有“加载中…”；`simfba.com` feedback 帖 403；`dator.dev/sitemap.xml` 403。
- **目录/榜单**：Playgama 只有聚合 data.json；AI Transparency Index 只确认真实存在、未逐页抓取 2.7 万条；aibuiltgames 的 238 款卡片由前端脚本渲染；Astrocade sitemap 只有 URL 与 lastmod；`threecade.games/games/rocketball` 404、`tinyskies.vercel.app` 000，均已剔除。
- **工具类无游戏产出**：SFXMint（CC0 音效库）、GodmodeAI（Spine 动画）、Spielerando（面向 coding agent 的 MCP 参考）、WorkBuddy/CodeBuddy（腾讯 AI 工作台）可读但未列任何已发布游戏或使用案例，没有可追的作品候选。

### 8.2 本轮结论与排序

**先给结论。** 本轮 220 条清单链接（其中 18 条为上下文/方法/工具/索引，不计作品；作品相关 202 条，含同作品多入口）里，按任务 §1/§3 硬条件（AI 大规模开发、已过首次可玩、真实玩家反馈→具体返工、作者/入口/版本可核、一次可复述的二改、许可与成本能分开）挑出 **2 项通过**：**Enarian: Orbital Command**、**Realm of Eldermyr**。两项都不是“只有首日演示”：各自有发布后玩家反馈被写进可玩版本的证据，其中 Enarian 的补丁原文直接写“following amazing feedback from players”，Eldermyr 的 release notes 连续到 2026-11-05 且修了玩家报告的屏幕抖动与存档重置。**翡翠经营模拟器**有 2,011 条评价与 v0.1.36 的数值返工，但 app 页只有“TapTap 制造创作者”平台标签，没有作者制作过程原文，AI/人分工也只到平台口径；任务 §3 的“原作者制作过程”与“AI 与人工各做什么”两项未闭，降为 §8.4 第一备选，不计通过。

**本轮最强新候选是 Enarian: Orbital Command。** 它是本轮唯一同时具备“商店 AI 披露明写 AI 参与 coding”“发布后补丁原文点名玩家反馈”“二改可复述到具体命令行为”的 Steam 作品；demo 期还有 10-16 认错→v1.2、10-18 说“听了反馈后愿望单上涨”的连续链。缺口是 AI 占代码比例未量化、23 条评价样本小、无第三方制作长文。

**与上轮首推的关系。** 卡级首推仍是上轮 §3.1 的 **Fire Field**（零编程作者＋约 18 万行＋v1.9.1 毒叠层补丁点名玩家报告＋第三方首发周复核），因为它的 AI 开发规模与补丁可复测条件最完整。本轮 2 项通过是“新增可深挖池”，不替换 Fire Field；若负责人要求“近两周内刚发生玩家反馈→补丁”的新鲜样本，优先看 Enarian。**什么情况下不选 Enarian**：需要大样本评价时转翡翠（2,011 条，但缺作者制作过程原文）；需要免费浏览器直接试玩时转 Eldermyr（免费）；需要中文作者一手过程原文时转上轮群侠传（翡翠只有更新帖，无制作过程长文）。

**并列时的优先序**：补丁原文点名玩家报告 > 有版本号/连续更新 > 玩家样本量大 > 有作者过程长文。排除：任务 §4 名单、pxl 等工具、纯 UI 改动（转 UI 卡）、纯场景局部（转场景光照卡）、AI 只做运行时内容。

### 8.3 本轮通过门槛的 2 项

#### 8.3.1 Enarian: Orbital Command（Steam，2026-10-30 上线，本轮最强新候选）

- **可玩入口**：<https://store.steampowered.com/app/5112040/>（Steam，商店页本次显示 15% 折扣；本次打开 200）。
- **AI / 人分工**：商店 AI Generated Content Disclosure 原文写 “AI was used in the coding and content creation for this game.” 作者在 2026-09-23 的 r/aigamedev 发布帖（<https://www.reddit.com/r/aigamedev/comments/1wohatq/>）写明 “a combination of Vibe Coding in Cursor and human built resources, all the ship models and stations were built by a person”；2026-10-16 的 v1.2 demo 帖（<https://www.reddit.com/r/aigamedev/comments/1x7o9gi/>）又写 “many of the negative responses had valid points”“Cursor has once again shone through, debugging, optimising and improving existing systems”，并说仍“require a lot of hand holding and guidance”。即人负责设计、试玩、反馈整理、发版与船/站模型，AI 负责其余代码与内容；具体 AI 代码占比未量化。
- **版本与日期**：2026-10-30 上线；2026-11-04 发 v1.4。demo 期链路：2026-10-16 作者说 “many of the negative responses had valid points”，随后发 v1.2（补丁原文 <https://store.steampowered.com/news/app/5112040/view/1846651706682816>）；10-18 在 r/IndieGameWishlist 写 “Wishlists climbing since I listened to player feedback”（<https://www.reddit.com/r/IndieGameWishlist/comments/1x9baog/>）；10-05 还因反 AI 商店素材批评改用游戏内模型重做素材（<https://www.reddit.com/r/aigamedev/comments/1wy6skt/>）。（上述四条 Reddit 本机直连 403/TLS，正文经 Arctic Shift 归档 API 读到；以上为原帖地址，依次为 2026-09-23 发布帖、2026-10-16 v1.2 demo 帖、2026-10-18 愿望单帖、2026-10-05 素材帖。）
- **一次具体二改（v1.4，原文 <https://store.steampowered.com/news/app/5112040/view/1848557880479216>）**：补丁开头写 “following amazing feedback from players”。手动维修命令改为两船相向靠拢、维修船跟到修完或目标被毁为止并取消双方原命令；另加武器/维修射程显示、窗口化修复、设置内 Quit to Main Menu、突击合同敌舰预生成与合同惩罚 -6→-4。问题（维修船不跟、命令不取消）、改动（相向靠拢＋跟到修完＋取消原命令）、结果（可复述到可玩行为）三段齐全。
- **为什么最值得挖**：它是本轮唯一能把“玩家反馈”追溯到补丁原文措辞、再把措辞落到一条可复述命令行为的样本；同一作者在 demo 期已两次公开认错并按反馈改，说明反馈闭环不是发布后临时补的。适合回答“英文独游作者怎样把玩家反馈变成版本说明与行为改动”。
- **作者静态截图**：<https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5112040/271b928b073bd64aa9112dcc812105749dcaa97e/ss_271b928b073bd64aa9112dcc812105749dcaa97e.1920x1080.jpg?t=1793384075>（Steam 商店页 1920×1080 截图，发行方上传，非 capsule；本次打开确认为游戏内舰队/指令界面）。
- **缺口**：AI 写码占比未量化；All Reviews 23 条/73%，样本小；Steam 评测正文与讨论区读不到；无第三方制作过程长文；代码/资产许可与总成本未知；本机未启动游戏，玩法/帧率/手感未验。

#### 8.3.2 Realm of Eldermyr（免费浏览器 MMO，作者 HN 连续周记）

- **可玩入口**：<https://eldermyr.com/>（免费浏览器可玩，本次 200；release notes <https://eldermyr.com/release>）。
- **作者原文与 AI 证据**：HN「Wk. 6 of Vibecoding an MMO」（<https://news.ycombinator.com/item?id=49545547>，2026-09-03，14 分/47 评）作者 josiahturnq 自述 6 周 vibecode；1.3B tokens 在同作者「Wk. 4 of Vibecoding an MMO」链接帖（<https://news.ycombinator.com/item?id=49316748>，2026-08-16；该帖 story 正文为空）下作者本人的首条评论（<https://news.ycombinator.com/item?id=49316749>）：“I've spend 1.3 billion tokens on this in just a few weeks”。作者负责方向、试玩、回复玩家与发版，Claude 承担实现（Wk.4 帖内作者评论称“my hardworking Claude”；Wk.6 评论可见作者逐条回复玩家并上线修复），具体代码占比未量化；站点自身无 AI 披露，AI 证据只在 HN。
- **版本与一次具体二改**：release notes 连续到 **v3.518.0（2026-11-05）**；v3.513.0（11-03）专修存档：技能点每次登录被重置、存仓库/熔炉时物品消失。更早玩家 tab_jockey 报“屏幕一直抖、眼睛疼”、goykasi 报“关掉 screen shake 也不生效”，作者回“the world shaking all the time has been fixed now!”“fixed!”，并按反馈加聊天 tab 与头顶聊天气泡。
- **作者静态截图**：<https://eldermyr.com/landing-poster.jpg?v=5>（作者站首页的 1920×1080 游戏内城镇截图，本次打开确认，非 capsule）。
- **为什么最值得挖**：它是本轮唯一把“玩家反馈→作者承认→修复上线”落在 HN 公开回复与站点 release notes 双证据上的免费浏览器作品；release notes 连续到 11-05，能看当前版本。适合回答“持续运营的 AI 浏览器 MMO 如何把零散玩家报告变成存档与可用性修复”。
- **缺口**：站点无 AI 披露，AI 规模只有 HN 自述（Wk.4 帖内评论的 1.3B tokens 与 Wk.6 的 6 周周期，两者不是同一时点）；许可与总成本未知；47 条评论未逐层读完；本机未玩。

### 8.4 本轮第一备选（乙级，18 项）

这些条目已接近门槛，但按硬条件或并列优先序仍差一步。下面逐项写出它比 §8.3 通过项少什么；不再把“许可与成本未披露”或“玩家样本小”单独当降级硬条件（§2 已允许未知写未知，样本量只是并列优先）。

> **上轮在册、本轮只补强、不重复建条**：**归墟：吞丹修仙** <https://www.taptap.cn/app/960466>（上轮 §4.8，本轮补到 72 小时内 1.0.4→1.2.8 共 12 版、1.23.2 修开始页卡住与手机内存，更新帖 <https://www.taptap.cn/moment/867395840900071950>）与 **一针一线绣江南** <https://www.taptap.cn/app/953017>（上轮 §4.9，本轮补到 2026-10-06 今日头条作者访谈《玩家说哪儿不好，我们第二天就改：一款 AI 做的刺绣游戏，上了 TapTap 热门榜》<https://m.toutiao.com/article/7693561744978969088/>：15 条评价逐条落到 1.0.16→1.0.22、商店点击率 9.5%→12%、次日留存 8%→14.4%）。这两项只占编号，不在下表重复。

- **翡翠经营模拟器（TapTap 制造，异度奇纪工作室）** — <https://www.taptap.cn/app/860950>。2026-05-23 上线（页面 datePublished 2026-05-22T17:45Z），9.0 分/2,011 条评价，热度 1,035,249（约 103.5 万）、关注 932,124（约 93 万）；2026-11-06 复核。v0.1.36 更新帖（<https://www.taptap.cn/moment/812452438341584532>，2026-06-06）原文写上一版把色带加宽后单块原石期望收益约 4 倍、“相当一部分玩家觉得过于无聊”，于是把期望收益降到约 1.8 倍，并新增 3 条支线、扩充原石形状、优化刮石掉帧与发热。作者静态截图 <https://img-tc.tapimg.com/market/images/60a3b32d75d9e239b8ac59314766a3ac.png/_tap_screenshot.jpg>（TapTap app 页开发者上传，上轮已打开确认为游戏内刮石/加工界面，非 capsule）。**比通过项少**：任务 §3 要的“原作者制作过程”没有原文——app 页只标“TapTap 制造创作者”与开发者名，本次查开发者页 392318、app 页 NUXT 数据与 v0.1.36 更新帖，均未见作者访谈、制作长文或制作帖；AI/人分工只到 TapTap 制造平台标签；作者侧能看到的只有 v0.1.36 更新帖里的产品与数值决策，未见逐项 AI 披露（硬条件 4/5）。2,011 条评价是本轮中文线最大样本，但不能替代缺少的制作过程与分工原文；版本号只到更新帖，完整历史未逐条核；许可与成本未知；本机未玩。
- **Ultimate Blacksmith Tycoon** — <https://store.steampowered.com/app/4687330/>。AI 写码规模最明确：商店 AI 披露写 C++ 源码、数据结构、系统架构、玩法规格与游戏内文本均由 Claude＋Gemini 协作生成，开发者只做概念/PM/最终规格/试玩/报错/发版；EA 2026-06-13 上线（$14.99，All Reviews 19 条 78%），补丁从 r62 走到 r174，8-04 Lightweight Foundation 改存档处理后，8-13 r170 针对 r169 清理旧存档历史造成“旧档从读取列表消失、长局无法保存”，给出根因、自动重注册旧档、写后删除、存档瘦身四段修复（补丁原文 https://store.steampowered.com/news/app/4687330/view/1840944183775792），是完整的玩家可见返工。 **比通过项少**：r170 补丁只写“We're sorry for two disruptions”，未点名玩家报告；按硬条件 3 只算玩家可见返工，不能证明反馈触发（许可与总成本仍未披露，但按 §2 只写未知，不作降级理由）。
- **Zero To Hero Idle** — <https://store.steampowered.com/app/4414900/>。作者自述是非程序员的单人开发者，AI 直接写源码、调试、重构与数值曲线；2026-07-15 上线（$4.99，All Reviews 16 条 Mixed）后 8 天内连发 11 条补丁，其中 1.0.4（https://store.steampowered.com/news/app/4414900/view/1838407329259415）、1.0.6、7-23 三条都写“感谢报告”：修威望重置把游戏时长计时清零、离线符文收益未入账、旧/已删成就卡住 100% 并自动清理旧统计恢复进度，反馈→版本对应最直接；但只有首周窗口，缺作者长文与长期更新。 **比通过项少**：只有首周 11 条补丁窗口、无作者制作长文，硬条件 4/5 的证据厚度低于 Enarian；AI 写码比例只有作者自述。
- **明末：欲火重生** — <https://store.steampowered.com/app/3948550/>。B站 UP 阿拉丁巴图零程序背景、约 8 个月靠 AI 做出并上架 Steam（2025-11-14，¥15，All Reviews 574 条/55%（Mixed；2026-11-06 复核，30 天 32 条/37%）），首月约 6 万元；发售后 v1.1.3（2025-11-30）修“先杀张英”卡死、种田卡关、无限对话循环、存档槽 5/6 不可用等玩家报告，后续加战争迷雾/云存档；第二章 2025-12-14 上线，最新 v1.3.17（2026-11-01）。B站有连续开发/更新日志（如 BV1JtSdBLEBi），发布后返工链清楚。**比通过项少**：AI 写码规模只有作者视频自述，无平台披露或占比；硬条件 1 的量化弱于 Enarian 的商店 AI 披露。
- **Grim Reach Idle** — <https://store.steampowered.com/app/4915450/>。2026-08-22 抢先体验、六周补丁后到 1.0，11-01 仍发 1.4.2；作者 Reddit（r/aigamedev/comments/1vznx7h）写明 Claude 当“CEO/主程”派生 content/engine/UI/balance/QA 子代理、Codex 出美术，并称“Steam 评论与 Discord 报告几天内变成补丁、部分补丁直接带评论号”；1.4.1 写“built around your feedback”并把 Slayer’s Book 从 15,150 点降到 7,575 点、自动退还差额，1.3.1 因玩家偏好旧界面而加 Classic/Reforged 切换；49 条评价，商店无 AI 披露（缺口）。 **比通过项少**：AI 分工只在作者 Reddit，Steam 商店无 AI 披露（硬条件 4）；补丁带评论号但未逐条给玩家复测结果。
- **Morhval: Ravenglaire** — <https://store.steampowered.com/app/4861230/>。EA 2026-08-05，0.2.1→0.7.5 连续 15 条更新；商店 AI 披露写明生成式 AI 协助代码/3D/贴图；0.7.1 点名玩家 Dethdagon66、QuadGod4444 报告的 4 个 bug，并给出“NPC 等地形加载后再放置、坠落者重定位”的修法，0.2.9 也按同一玩家手柄反馈改；6 条评价，样本小。 **比通过项少**：AI 披露只说生成式 AI 协助代码/3D/贴图，未量化 AI 写码占比（硬条件 1）；6 条评价也低于并列优先线。
- **HALFTIME Manager** — <https://store.steampowered.com/app/5005920/>。2026-08-14 EA、11-01 转 2.0 正式版、11-04 仍发 2.0.4；作者 Reddit（r/aigamedev/comments/1x1iun9）写 Claude Code 写大部分代码、Codex 跑 feature 分支；1.9.19 把 3,064 队大存档保存 15.9s→1.7s、首载 57s→3.2s，1.9.21 修 2560x1600/150% 缩放下战术板塌成 30px；仅 9 条评价、商店无 AI 披露。 **比通过项少**：补丁未点名玩家报告（硬条件 3），AI 分工只在作者 Reddit、商店无披露（硬条件 4）。
- **灵魂锻炉 SOULFORGE** — <https://soulforge.glasden.top/>。linux.do 作者用 Opus 5.5 做的免费网页肉鸽割草，可直接玩；发布帖记录 1.0.5 按反馈加“反馈复活”、强化初始角色与新手引导，玩家反映难度偏高、没发现第二角色后作者补困难/无尽模式；搜索摘要称已到 1.6.0“炉温”（9 条试炼+2 契约、按炉温分档）。缺口：linux.do 原帖 TLS 不可达，1.6.0 只有搜索摘要，未读原文。 **比通过项少**：linux.do 原帖不可达、1.6.0 只有搜索摘要，版本与二改原文的可核性（硬条件 4/5）不足。
- **无为修仙传** — <https://store.steampowered.com/app/5070160/>。本线 Steam 中文样本：个人开发者第三款 AI 游戏，2026-09-01 上线、¥9.90，All Reviews 178 条/76%（2026-11-06 复核；Recent 36 条/75%）；ISteamNews 取到 56 条更新（1.0.6→1.7.2），作者称按 QQ 群反馈日均迭代 2–3 版，1.0.9/1.1.0/1.1.1 日志给出宗门任务、杂学显示、无尽海渊与旧存档兼容等具体修复。缺口：Steam 页无 AI 披露、作者未点名 AI 工具，知乎原文本机 403，只读到搜狐转载。 **比通过项少**：商店无 AI 披露、作者未点名 AI 工具，AI 写码只有转载口径（硬条件 1/4）；其余更新与存档修复链可核。
- **多米诺的子弹工厂** — <https://www.taptap.cn/app/956393>。由《全村最好的剑》开发者页追到：同厂出头喵的 TapTap 制造 AI 游戏，2026-10-09 上线、9.3 分/824 条评价，V0.8.2→V0.9.8 日志含难度重做、设施缓存绘制、误判与崩溃修复，是本批样本最大、版本链最密的新候选。 **比通过项少**：AI 分工只有 TapTap 制造平台标签，作者过程与逐条反馈未披露（硬条件 4）。
- **越跳越有钱** — <https://www.taptap.cn/app/876002>。同厂 TapTap 制造：2026-07-06 上线、7.8 分/549 条评价，V1.0.04→V1.0.09 连修存档丢失/异常、收集者罚站、卡顿发热并新增帧率选项，直接对应旧存档与性能两类返工。 **比通过项少**：同多米诺，AI 分工只有平台标签，且更新日志未逐条对应玩家报告（硬条件 3/4）。
- **云灵修仙 / react-xiuxian-game** — <https://github.com/JeasonLoop/react-xiuxian-game>。公开 changelog 覆盖 0.1.0→0.3.8（0.3.8 为 2026-09-17）；其中 2025-12-05 至 12-21 的 0.1.0→0.2.7 一段连续修复战斗卡死、AI 返回畸形 JSON 导致的 NaN、配方识别与存档清空等问题，仓库另有 3 个 issue，是“首次可玩→按真实问题返工”证据最完整的一项。 **比通过项少**：公开 changelog 只证明按问题返工，AI 参与开发的证据未在仓库或页面披露（硬条件 1）。
- **积案拂尘** — <https://www.gcores.com/games/179823>。单人开发者简律纯据清单口径用 DeepSeek 约 5 天、十余元做出的 AI 盘问游戏；gcores 游戏页本次只读到创建 2026-05-15、更新 2026-06-07、开发状态“持续更新”，未在该页读到评分、逐次更新记录或 DeepSeek 说明，故不写这些细节。**比通过项少**：差评驱动与具体二改未核，硬条件 3/5 缺原文，只保留“2026-06-07 仍在更新”。
- **放置地下城：无尽远征** — <https://store.steampowered.com/app/5242520/>。由《无为修仙传》作者线追到：同作者（程序员小灰）第四款 AI 游戏，作者原文称 Codex+GPT-6 Astra 七天做出 Demo、再一周打磨后 2026-10-14/15 上线；自 2026-10-15 的 1.0.9 到 10-31 的 1.3.4 共 28 条更新公告（其中 1.3.x 6 条；含技能排序、批量天赋升级、1,000 层竞技场、标准装备等级规则统一），当前 52 条评价 75%；注意 Steam AI 披露只写美术/文本/翻译，AI 写码仅有作者原文。 **比通过项少**：商店 AI 披露只写美术/文本/翻译，AI 写码仅有作者原文（硬条件 1/4）；28 条补丁未逐条点名玩家报告。
- **AI战役** — <https://www.taptap.cn/app/960813>。TapTap 制造策略经营，2026-10-06 上线、7.8 分/16 条评价（2026-11-06 复核；app 页无公告区，NUXT `whats_news` 为空）。清单称 10-19 版本公告针对后期十几年没东西可研究加“前沿迭代”、修部分机型教学合同标题不显示、释放插画降内存、存档体积缩约 1/3 并做老存档兼容；本轮未取到该公告的 moment 原文，以上只作未核线索。**比通过项少**：二改原文与旧存档兼容未核，硬条件 3/5 不足。
- **钓海暗涌** — <https://www.taptap.cn/app/850567>。TapTap 制造 AI 制作，9.0 分/105 条评价。9-18 更新帖（<https://www.taptap.cn/moment/849971383155822473>，2026-09-18）加古卷容量、陈旧坊市限购次数与仓库容量、免广告券概率等；2026-07-07 官方“已优化内容”帖（<https://www.taptap.cn/moment/823544410019989161>）写“旧存档中已经重复持有的唯一真遗物会自动规范为 1 个”，是本批少见的中文 AI 游戏旧档去重迁移证据。另有非官方账号的攻略帖（<https://www.taptap.cn/moment/804988808788446363>，作者雪中看你）写 AI 会“自己偷偷添东西和改名称”、导致“很多东西货不对版”，但不是官方公告，也没有直接说重复遗物由 AI 生成。 **比通过项少**：AI 分工只有 TapTap 制造平台标签，未见作者逐项分工说明；更新帖已核到 9-18 更新（849971383155822473）与 7-07 旧档去重（823544410019989161）两条，其余未逐条核（硬条件 4/5）。
- **Agents! Please?** — <https://store.steampowered.com/app/5166150/>。披露写代码由 AI agents 写、最后由人审（游戏内 AI 同事的 TTS/对白也是刻意的 diegetic 内容）；2026-09-10 上线（All Reviews 11 条 Positive）后一个月 11 条更新，1.3.1 让“旧存档里的表彰在载入时补发已应得的”（https://store.steampowered.com/news/app/5166150/view/1843481262703623），1.3.2 修 Linux 音频/启动，1.3.3 修语言切换重置当前票据；补丁未点名玩家报告，demo 期主要按外部审计缺陷表修，AI 占比与成本未知。 **比通过项少**：补丁未点名玩家报告（硬条件 3），AI agents 写码后的二改主要由外部审计缺陷表驱动。
- **FlashBoss** — <https://store.steampowered.com/app/4134440/>。商店披露写 AI 用于编码、资产生成与方案讨论；2026-02-17 上线（$4.99，All Reviews 13 条 Positive）后持续更新到 10-27 共 24 条公告，9-30 的补丁把日文/中文 Windows 乱码与从 Windows Terminal 启动即退出定位到启动器用 Shift-JIS/GBK 读终端配置，改为自带终端配置与 CJK 字体（https://store.steampowered.com/news/app/4134440/view/1845383656377392），5-06 还修 Steam Cloud 存档与档案切换、提示老玩家新建档，属具体平台/存档返工；AI 写码占比未量化。 **比通过项少**：AI 写码占比未量化（硬条件 1），9-30 补丁虽具体但未点名玩家报告（硬条件 3）。

### 8.5 本轮其余候选（按清单原序，逐项保留原始链接与完整理由）

下表是 8.3/8.4 未逐条展开的其余条目（含 18 条上下文/方法/工具/索引，已逐条标注），编号对应本轮 220 条清单顺序（不是优先级）。每项保留原始链接与清单理由全文，不再以“完整理由见对应正文”作指针；读者可按行内链接复核。

**对账。** 220 条清单链接 = §8.3 通过 2 项 + §8.4 第一备选 18 项 + 引文中只补强的 2 项（归墟、一针一线）+ 本表 198 条。表内 18 条为上下文/方法/工具/索引（已标“非作品，不计入候选”），其余 180 条为作品链接；加上 2+18+2，作品相关共 202 条（含同作品多入口，未去重）。表中缺号 22 个逐号对应：#11 Realm of Eldermyr（§8.3）、#37 Ultimate Blacksmith Tycoon、#38 Zero To Hero Idle、#39 FlashBoss、#42 Agents! Please?、#44 翡翠经营模拟器、#46 无为修仙传、#47 明末：欲火重生、#49 灵魂锻炉 SOULFORGE、#50 AI战役、#58 Enarian: Orbital Command（§8.3）、#65 一针一线绣江南（引文补强）、#68 Grim Reach Idle、#69 Morhval: Ravenglaire、#70 钓海暗涌、#71 HALFTIME Manager、#106 放置地下城：无尽远征、#109 多米诺的子弹工厂、#110 越跳越有钱、#127 云灵修仙、#133 归墟：吞丹修仙（引文补强）、#191 积案拂尘，合计 2+18+2=22，不是漏项。本表按 220 条清单原序保留，含上轮已列条目 3 行（#132 小衣铺开张啦、#135 孟德尔万族模拟器、#188 Super Mario Galaxy Movie Game），三行都在表内并已标“补强”，只作补强、不占新候选；#51 宿命旅途也已补入本表，不在缺号内。

Rogue: Genesia、School of Magic、Future? No Thanks! 等在本轮清单里只作“AI 代码进入已发售作品后玩家信任/反弹”的反向对照；AI 只做美术/运行时的不作品牌候选。

| # | 候选 | 原始链接 | 理由（清单全文） |
|---|---|---|---|
| 1 | Kart Royale（浏览器卡丁车，AI 多代理 9 轮建成） | <https://racing.ryancampbell.com/> | 已上线可玩的 Three.js 卡丁车，作者自述零美术资产、约 60,500 行/49 文件全部由 Claude 代理生成；公开仓库 https://github.com/ryancampbell/kart-royale 带 CLAUDE.md、ART_DIRECTION.md、13 个无头测试 harness 和 FEEDBACK.md（逐条抄录 7/27–29 公测玩家在 X 的反馈与判断），是“高质量项目怎么把玩家反馈写进工程产物”的少见样本；缺口是作者长文 https://www.ryancampbell.com/kart-royale 只写开发迭代，未给出发布后补丁记录，FEEDBACK.md 中“漂移手感优先”的结论只落到计划层，移动端纹理内存 217.7MB→34.1MB 等修复发生在反馈之前。 |
| 2 | LAST CROWN（ラストクラウン，Claude Code 23 小时做出的浏览器 TCG） | <https://siam-works.com/works/last-crown/> | 免费可玩，作者原文 https://zenn.dev/siam_works/articles/last-crown-claude-code-roguelite-tcg 给出完整发布后链路：企划书约 23.5 小时上线，随后 3.5 天 14 次更新到 v0.8.5，修的是 PWA 更新不送达、换图标导致存档丢失（改为导出/导入迁移）、iOS Safari 模态框被裁切；同文给出 CLAUDE.md、315 个测试、10 个平衡模拟脚本、86 次提交与 109 次人工指令的量化分工。注意：这些修复由作者自己在真机试玩触发，原文明确写“人が遊んだ数字はまだありません”，严格按“真实玩家反馈”门槛只能算有条件项。 |
| 3 | SweatyPanzer（WebGPU 多人坦克，Claude Code 全程开发） | <https://sweatypanzer.com/> | 作者 Huggos 在 HN 原帖 https://news.ycombinator.com/item?id=49088907 自述只有 HTML/CSS/少量 PHP 经验、用 Claude Code 做成实时多人坦克游戏；帖内玩家 tantalor 报告“进战即死”，作者回复“你加入的是进行中的局，应该是观战状态，我会把它做得更明显——谢谢报告”，站点现已把 SPECTATE 列为即将上线，并有实时“PATCH DROPPING”热更与进度保存提示。缺口：帖子仅 2 分，作者承诺的观战提示是否已进线上未核，站点是 SPA 无公开 changelog。 |
| 4 | Quasar Saz（Claude Code 独立完成的 Godot 动作游戏，含人类修复版） | <https://github.com/cleak/quasar-saz> | 仓库同时发布 v1.0“Momo 未经人类编辑的原版”和 v1.1“人类修 bug、开画质、提分辨率、玩法不动”的可玩版（https://github.com/cleak/quasar-saz/releases/tag/v1.1），并公开 .claude/、CLAUDE.md、测试与 tools、LICENSE，是研究“AI 交付后人类接管修哪些东西”的干净对照。缺口：修复来自人工复核而非玩家反馈，不满足本卡“玩家闭环”，只能作方法与对照。 |
| 5 | Flight Simulator 2025 / fly.pieter.com | <https://fly.pieter.com/> | 最早的规模化 vibe-coded 多人游戏之一（Cursor 开发，2025-02），上线后确实按社区报告修：多人模式加入后子弹打不中、被注入广告色情链接后连续数日修补；报道称累计 32 万玩家。缺口：作者一手陈述在 X（登录墙），现有中文/英文报道在构建时长、首发日、并发峰值上互相矛盾，只能标二手；AI 具体写码比例无作者量化。 |
| 6 | Claude Code Game Studios（高质量项目自己的 agent/skill/hook 配置，非游戏）（非作品，不计入候选） | <https://github.com/Donchitos/Claude-Code-Game-Studios> | 约 3.5 万 star 的公开“AI 游戏工作室”配置：49 个代理、72 个 workflow skill、协调系统与 CHANGELOG，并带 patch-notes skill（从 git log 与 sprint 数据生成玩家可读补丁说明）。与本卡“发布后返工流程”直接相关，可借其变更说明生成与角色分工；它是配置不是作品，不能当候选。 |
| 7 | awesome-ai-built-games（AI 造游戏索引）（非作品，不计入候选） | <https://github.com/lappemic/awesome-ai-built-games> | 按品类收录“AI 写了大部分代码且现在可玩”的浏览器游戏，逐条标工具与引擎（Claude Code/Codex/Cursor、Three.js/Godot），并收录 Vibe Jam、AI Browser Game Jam、Zadely、Player1AI 等目录入口；是本卡后续补核可玩入口与作者归属的高效索引，本身不是游戏。 |
| 8 | OpenAI Developers Showcase: Games（官方 Codex/GPT 游戏展示）（非作品，不计入候选） | <https://developers.openai.com/showcase/games> | OpenAI 官方游戏 showcase，列 25 个 Codex/GPT 生成的可玩作品并给出 Void Explorer 等构建说明；官方口径的一手供给面，但页面未标逐个作者，也没有任何发布后补丁/玩家反馈记录，只能作渠道与上下文。 |
| 9 | Bash Fighter（AI agent 端到端开发并运营的浏览器格斗） | <https://bashfighter.com/> | awesome-ai-built-games 记其为“built and run end to end by an AI agent”的 20 人平台格斗（PixiJS，手机/桌面可玩），属于少见的“AI 不只写代码还运营”样本。缺口：站点是纯 JS bundle，未见源码或补丁记录入口，作者与 AI 分工未在页面展开，需后续补核仓库与版本。 |
| 10 | 鉱石採掘インクリメンタル（Claude Code 单文件游戏，发布到 itch.io） | <https://zenn.dev/minagi_llm/articles/19394900d5dafb> | 作者无游戏开发经验，用自然语言让 Claude Code 写出 2400+ 行单文件游戏并发布 itch.io；文中逐个给出真实 bug 的根因与修法（wasFound 先用后声明、reset 丢 prestige 字段导致 NaN 连锁、深度公式失衡），并总结“保存数据兼容/迁移必须写进提示词”。缺口：这些修复发生在开发期，未见发布后玩家报告，不符合本卡闭环门槛。 |
| 12 | Aim and Shoot（2019 原版 + 2026 Claude Code 修订） | <https://victorribeiro.com/aimAndShoot/> | 2019 HN 原帖（21353123，118 分）玩家提「每轮回满血」「要记分」「枪声刺耳」「敌人刷在脚下拖人」；2026-10-08 作者 atum47 把该帖和仓库交给 Claude Code 逐条实现（HN 50008086；commit「Apply suggestions from the 2019 HN thread」），10-10 又按「两名不同玩家报告同一个大脑才排名」修（commit 可见）。MIT、GitHub 公开、网页可玩。缺口：AI 角色是重构与按反馈实现，不是从零大规模开发，按 §1 只能作条件性证据；静态图 https://victorribeiro.com/aimAndShoot/artwork.png。 |
| 13 | The Great Refinery Run（Fueling Curiosity） | <https://fuelingcuriosity.com/game.html> | 化学工程师作者在 HN 47338091（127 分/55 评）自述「relied heavily on LLMs (Claude, Copilot, Gemini) to help write the code」，做出 9,000 行 vanilla JS 单页炼油模拟；玩家报 Firefox 里 Desalter 不显示导致必输，作者回「This should be fixed, I just removed the animation stop for this game」，并承认自己加无障碍功能时改坏再修；可玩、免费。缺口：无版本号、许可/成本未知；静态图 https://www.fuelingcuriosity.com/social-preview.jpg。 |
| 14 | Beakdown | <https://beakdown.fun/> | 作者 novlrdotcom 在 HN 49088969 说用 Claude Opus 5 做 Joust 式浏览器游戏；玩家反馈需要音乐/音效，作者随后回「I've added sound effects and music」并把音效/音乐开关加到页面底部（「I ended up adding controls for the sound effects and music at the bottom of the screen」）。可玩、免费。缺口：无版本号、许可/成本未知；静态图 https://beakdown.fun/og.png。 |
| 15 | Sagorax | <https://sagorax.com/> | 作者 AntonioEritas 称 Opus 5 + GPT-5.6-Sol 做出 Three.js/WebGPU 竞技场射击（HN 49174059）；玩家要求更快进入对战，作者回「Just added an 'Instant Deathmatch' button to the homepage」，属于反馈→可玩页改动。可玩、免费。缺口：无版本号、许可/成本未知；静态图 https://sagorax.com/art/deathmatch-1.webp。 |
| 16 | Floktoid | <https://floktoid.franzai.com/> | HN 标题即「100% Claude Coded Game」，作者 franze 补充「Its all claude code. Directions were given on the functional but not on the code level」；玩家两次报看不到鼠标，作者两次回「fixed」。可玩。缺口：作者在帖内称 GitHub MIT，但 franzenzenhofer/floktoid 仓库现已 404，许可无法复核；无版本/成本；静态图 https://floktoid.franzai.com/og-image.png。 |
| 17 | Catcopter | <https://catcopter.com/> | 作者 pawelwentpawel 在 HN 50305320（85 分/43 评）说用 Opus 5.5 做物体/绑定/动作、Tripo3d 补资产、Fable 做 CPU/网络优化，素材全 AI 生成；玩家报 Firefox 卡在 72%，作者回「Firefox is my nemesis, will test thanks for letting me know!」但未确认修复。可玩、免费。缺口：无版本号、许可/成本未知；静态图 https://catcopter.com/opengraph-image.png。 |
| 18 | Skyline Co-op | <https://intergalacticrobots.app/skyline-coop/> | 作者 geekamongus 在 HN 49195297（41 分/41 评）说「I've been rebuilding old games with Claude」，开源 willc/skyline-coop（无 LICENSE，7 star）；玩家报 Firefox CPU 占用高、音量开关难找，作者回「I will work on optimizing that」「I should make this more obvious」，并已有 Mac 版。可玩、免费。缺口：未见具体修复落地；无版本号/许可；静态图 https://intergalacticrobots.app/skyline-coop/assets/og-image.png。 |
| 19 | City 2026（SimCity 2000 clone） | <https://dator.dev/city2026/> | 作者 drdator 用 Opus 5.5、27 个子代理、Ghidra 反编译原版并逐函数翻译，2 小时出可玩版，再用 PowerPC 模拟器跑 10,000 游戏日比对状态（HN 49977886，37 分/37 评）；作者只回复了景深导致卡顿可在 Options 关闭。可玩。缺口：只有性能提示、无玩家反馈→补丁；反编译原版有 IP/逆向合规争议（qarl 评论）；无许可/版本；静态图暂缺。 |
| 20 | Cooked | <https://cooked.house> | 作者 davitb 在 HN 48795930（23 分）说孩子当 PM、Claude 当工程师，3 小时出可玩 FPS，30 分钟加手机支持，孩子提的火箭筒/小刀加速等特性当天实现。可玩、免费。缺口：无外部玩家反馈、无补丁记录、作者未回评，属 AI 大比例开发但闭环未证；静态图暂缺。 |
| 21 | Hyperbubble | <https://playhyperbubble.com/> | ASU 教授让 Fable 5/Claude Code 读他 20 年研究并设计一键浏览器游戏，90+ 轮迭代（HN 49305115，1 分、无评论）；可玩。缺口：未见发布后玩家反馈，无版本/许可/成本；属 AI 开发但无真实玩家闭环。 |
| 22 | Downtime（playdowntime.com） | <https://playdowntime.com/> | 作者 gennadiygryva 在 HN 49168567 记录用 Claude Code CLI 建 agent 团队（核心框架/游戏/QA/tech lead）做 5 款离线 Android 拼图；可玩（Android）。缺口：无玩家反馈、无版本记录、无许可；属 AI 开发流程样本而非发布后返工样本。 |
| 23 | GameVibe（每日 AI 游戏站） | <https://gamevibe.us/> | 作者 pzxc 用 Cursor+Claude 每天做一个浏览器游戏，HN 连续发 Day 14/33/87（47923359、48162431、48848995），第 87 天仍在更新，作者在帖内回答技术问题并公开单 prompt。缺口：单款游戏无独立的玩家反馈→补丁链，属连续 AI 开发样本；无版本/许可。 |
| 24 | DailyMetro（地铁站 Wordle） | <https://dailymetro.live/paris> | 作者在 HN 49319392 自述「Made with Claude code but still took at least 50-100h of dev/design/taking user feedbacks」，多城市/多模式可玩。缺口：无具体玩家反馈→版本改动、无版本号/许可；只能作 AI 开发 + 声称吸收反馈的线索。 |
| 25 | Skub | <https://skub.app> | 作者 kasperstorgaard 在 HN 47506958 说 Claude Code 主要帮他写 BFS 解算器和 CI，UI/逻辑仍自己写；玩家报 undo/redo、自动提交、每次要输用户名等问题，作者逐条回应并说会改。可玩、每日谜题。缺口：AI 占比局部、无版本/许可。 |
| 26 | LMAO（Temu League of Legends） | <https://lmaomoba.com> | 作者 jonnyasmar 用 Opus 4.8 一句提示做出 MOBA，随后用子代理做角色/技能/特效并多轮优化（HN 48376337，4 分）；作者回「4-6 小时上手键盘、之后还有若干小修」。站点有 Patch Notes（Patch 7.13），但偏戏仿/自动生成，无真实玩家反馈证据；可玩，无版本/许可。 |
| 27 | Loft Day | <https://marketa.behdad.org/loft-day> | 作者 behdad 用 Claude + Codex 约一个月、5,700 commits 做成 138,000 行单 HTML 婚礼点击游戏（HN 49343029，9 分）；作者只回了一条「这不是主邀请函」。缺口：无发布后玩家反馈/补丁、无版本/许可；属 AI 大规模开发强证据但闭环不足。 |
| 28 | Discontinuum | <https://discontinuum.delmar.dev/> | 作者 jgautsch 给 Claude Code 一个仓库当「20% time」，它自主写了 8,000k+ 词论文并做成交互小说；HN 46492306（5 分）作者说仓库里只有 CLAUDE.md 是人写的。缺口：无玩家反馈、无版本/许可；属 AI 自主开发极端样本。 |
| 29 | OpenSoccer | <https://github.com/modelence/open-soccer> | 作者 artahian 用 128 个 prompt 做出浏览器 11v11 足球并开源（HN 48647133，3 分、0 评论）；可玩/仓库公开。缺口：无发布后反馈、许可需核、无版本；属 AI 开发规模线索。 |
| 30 | Chaos Chess | <https://chaoschess.bigbrainbusiness.de/> | 作者 luniprise 用 Google Antigravity 6 周/37 天、约 61k 行 Dart（AI-assisted）做 Chess960 快棋（HN 46449588，3 分、0 评论）。缺口：无玩家反馈/版本/许可；属 AI 辅助大规模代码线索。 |
| 31 | Mall Bats | <https://github.com/jacobgoldfarb/mall-bat> | 作者 jacobjr23 在 HN 50389331（2026-11-06）说第一次尝试发现 AI 还不够、最近重做成功，开源 GPL-3.0；可玩站 mall-bats.vercel.app 本机 TLS 拦截。缺口：当天刚发布，尚无玩家反馈/版本；属刚发布的 AI 开发样本。 |
| 32 | Pawnrush | <https://pawnrush.xiaohan.dev/> | 作者 hanstyle 用 Claude Code 两天做实时卡牌对战（HN 50176936，3 分、0 评论）；可玩。缺口：无版本/反馈/许可；属小样本 AI 开发线索。 |
| 33 | Blueline | <https://playblueline.pages.dev/> | 作者 astlouis44 用 Opus 5.5 做冰球网页游戏、Gemini Argon 优化（HN 50077567，5 分、0 评论）；可玩。缺口：无版本/反馈/许可；属小样本 AI 开发线索。 |
| 34 | Fly By | <https://michaelteter.com/flyby.html> | 作者 michaelteter 用 Gemini Flash 4 小时/50+ 轮对话做 biplane 游戏（HN 49519101，85 分/67 评）；玩家普遍批地面操控/物理，作者承认「control behavior on the ground sucks」但未见补丁。缺口：属首日演示，不能作发布后返工证据；无版本/许可。 |
| 35 | 1D-Pong | <https://github.com/ogermer/1d-pong> | 作者 oger 用 Claude Code 在既有 ESP32 代码库上整理并发布（HN 46579612，69 分）；AI 只是辅助既有代码，无玩家反馈/版本，规模小。缺口：不满足 AI 大规模开发，仅作 Claude Code 在既有代码上的样本。 |
| 36 | Kikkupico Vibe Discovery | <https://www.kikkupico.com/posts/vibe-discovery/> | 作者在 Redmi Note 9/Termux 里跑 Claude Code，经 6 次迭代做出 WebGL 弹珠游戏（HN 46630869，11 分/22 评）；作者主要回 AI 写博客的争议，无发布后玩家反馈。缺口：无版本/许可；属 AI 开发 + 移动端工作流线索。 |
| 40 | Track Star | <https://store.steampowered.com/app/4538830/> | 作者在商店页自述用 Claude Code 辅助开发、但内容/叙事/公式由人写；2026-07-15 上线（$9.99，All Reviews 40 条 Positive）后有 34 条更新与多条 devlog，9-03 明确因“多名大屏玩家反馈画面显示不佳”改全界面缩放与字体（https://store.steampowered.com/news/app/4538830/view/1842846814441835），8-22 修长跑成绩换算、8-23 改接力邀请按单项获得、10-17 修预赛受伤/排名/heat 成绩，属持续玩家反馈修订；AI 代码占比未量化，且部分改动偏 UI/显示。 |
| 41 | Gargadusa's Tower | <https://store.steampowered.com/app/4377370/> | 披露称 Claude 只用于 bug 修复、代码模块化与本地化，设计/剧情/世界观看由作者本人；2026-02-18 上线（$8.99，All Reviews 338 条 Very Positive，是本轮样本最大的一项），2.0 beta 从 9 月更到 11-03，10-21/10-31 两条补丁写明“mostly fixes from your reports”，如 Surface Breach 增加提前 5–8 周预警、World Boss 掉落补上结果卡（https://store.steampowered.com/news/app/4377370/view/1847920302241636）；AI 属维护型，不能算 AI 大规模开发。 |
| 43 | Infinite Night | <https://store.steampowered.com/app/4545400/> | 披露明写“100% 由 Claude Code 开发，含游戏设计、编程、平衡与本地化”；2026-04-09 上线（$3.99，商店页无 All Reviews 行）后 3 天内 5 条补丁，4-12 把时间推进整体换成 Seal Stone 系统并把 22 个 Boss 全部改成弹幕三阶段（https://store.steampowered.com/news/app/4545400/view/1829528821313262）；但没有任何一条点名玩家反馈，只能算“AI 大规模＋发布后自述返工”的线索，不能算玩家闭环。 |
| 45 | 全村最好的剑（出头喵） | <https://www.taptap.cn/app/838615> | 本线第二：TapTap 制造塔防，7.8 分/203 条评价，V1.1.40→V1.1.45 连续加章节/天赋/宝石槽；媒体访谈记录团队存了 37 个文档的玩家原话并标注频次/机型，23 人说“进村第一眼没认出这是村子”后重做主界面引导动效并加入鸡叫/溪流声，上线第 3 天加打铁铺好感度系统。访谈是二手报道（https://www.360kuai.com/99050f264e8c52abd），需回作者/TapTap 原帖核。 |
| 48 | 方寸喵居（无糖白馒头OvO） | <https://www.bilibili.com/toy/TinyMeowAbode/index.html> | B站 Toy 可直接玩，UP 无糖白馒头OvO 用 Gemini 3 制作；2026-08-24 首发介绍、10-07 加猫开冰箱/动态家具/房间扩建，V1.9 新增 26 件家具与 45° 旋转，家具含“网友点名的卡座/镜子/复古老电视”，并公开 AI 开发防呆规则（未经允许不得提交代码）。版本与更新视频可核，但 V1.9 的具体日期及“玩家反馈→改动”的直接原文未定位。 |
| 51 | 宿命旅途（出头喵） | <https://www.taptap.cn/app/856061> | 不会写代码的双胞胎用 TapTap 制造做的二次元放置卡牌，8.7 分/214 条评价；游戏页列 V1.0.11→V1.0.40，持续开新服、加系统、修低帧丢伤害/遗物属性不生效/挂机收益异常等。玩家吐槽集中在钻石少与广告；更新帖未逐条标注反馈来源，需补作者原帖。 |
| 52 | 猫猫翡翠经营模拟器（权哥工作室/权猫） | <https://www.taptap.cn/app/889215> | 另一款 TapTap 制造翡翠经营，8.8 分/36 条评价，最新构建 v1117；玩家反馈无字体、退出丢存档/云存档传不上、加工与换页卡顿、数值被遮挡，开发者在 1093/1106/1111 等构建持续修存档与性能，v1.0.20 重置画风并强化猫咪差异。构建号非正式版本号，需核更新帖原文。 |
| 53 | 不问凡尘（朝夕光年江南工作室/Nuverse） | <https://store.steampowered.com/app/4209920/> | 字节 <20 人团队的 AI 修仙 RPG，Steam EA 2025-09、¥19.9 首发，报道称 26 万份/约 88% 好评；场景/角色/过场大量用 Seedance 生成、NPC 由 AI Agent 驱动。EA 首日 Q&A 称逐条看 QQ 群与 Steam 评论，修存档读取/显卡兼容/视频加载，后续每周迭代并加沈彤彤支线。公司作品、代码 AI 占比未披露，玩家闭环主要来自官方与媒体，应按“公司公告不当闭环”降级。 |
| 54 | 土豆加工厂（Fisher juck） | <https://www.taptap.cn/app/976442> | TapTap 单人开发者经营游戏，v1.53.7→v1.56.0 连续加厂与成就；玩家报“更新后存档丢失/进不去/收入变个位数”，作者道歉并按存档损坏、卡死优先修，上线云存档、离线收益失败自动重试、商店按钮显示修复（动态 https://www.taptap.cn/moment/860621983845452743）。反馈→修复链很强，但页面未标 TapTap 制造/AI，AI 归属未证，且 app 页状态与已发版本矛盾。 |
| 55 | 猫咪守卫队（从前慢丶） | <https://juejin.cn/post/7699528799919472681> | 掘金作者用 AI 做的微信小游戏（合成+守城塔防）；上线后玩家说“一局 18 波太长”，作者把波次按难度分 12/14/16/18/20，AI 首版统一密度补偿导致教学关第 1 波团灭，改为渐进补偿并修路线触发/HUD 硬编码。无公开可玩链接（只能微信搜）、版本号缺失，作为“玩家反馈→数值改动”的流程样本。 |
| 56 | 妖潮渡劫（HappyCoderKid） | <https://autoyeyu.top/xiantu/> | linux.do 作者用 AI+Cocos 做的修仙幸存者，已上微信小游戏并有网页版，开发流程为“需求→AI 实现→试玩→提问题→AI 改”，美术用 GPT 批量生成；作者另提醒微信小游戏备案约 1 个月。帖子只有开发过程，没有上线后版本/补丁或玩家反馈记录（原帖镜像 https://locdd.com/t/topic/102408），只能作弱线索。 |
| 57 | 靠卖token成为世界首富（宇宙无敌五小琛） | <https://www.taptap.cn/app/950594> | TapTap 制造 AI 题材增量游戏，9.4 分/32 条评价；作者在评价区逐条回复玩家“后期转世无用/炼丹房与主线弱/练级慢”，已按反馈加 28 篇“攻略手册”入口并称节后大更新。尚无版本号或已发布补丁记录，属“作者承诺更新”而非已落地二改。 |
| 59 | Diablo 2 Survivors | <https://d2survivors.lol/> | 浏览器版 Diablo II survivors-like，需自备 D2/D2R 本体读取美术与音效；HN 2026-10-19 帖（38 分/20 评）里多名玩家称已玩数小时并打到 Hell，评论者 Liuser 说作者在 Discord “openly admitted they're vibing with Claude”，且 “the amount of changes in the changelog each day” 包含功能、bug 修复与平衡；同一线程有玩家报 “Clicked Hosted files but can't leave the rogue encampment”。作为“AI 大规模写码 + 发布后每日补丁”线索强，但 AI 占比只有社区说法、无作者原文与版本号，且依赖暴雪 IP/资产，适合先核 changelog 再定级。HN 原帖：https://news.ycombinator.com/item?id=50158131 |
| 60 | Rogue: Genesia（AI 代码返工与玩家反弹的对照） | <https://store.steampowered.com/app/2067920/> | 已发售游戏的反向样本：作者 2026-10 在 Steam 公告（https://store.steampowered.com/news/app/2067920/view/1846018067931748）说明用 LLM 重构 ECS/渲染/多线程后单机最差场景帧率约 10 倍、做出联机与 Mod 工具，并让玩家二选一；2026-10-15 公告（https://store.steampowered.com/news/app/2067920/view/1846651706676006）统计 16,298 浏览、1,026 赞/68 踩（93.4%）、589 条评论中约 69.4% 正面，随后仍遭差评轰炸，作者承诺保留无 AI 版本分支并推进 2.0。它不是 AI 开发的作品，仅作“AI 代码进入已发售游戏后玩家信任如何反噬”的对照；不计本卡候选。 |
| 61 | School of Magic: Deck & Slash（AI 辅助代码与玩家质疑） | <https://store.steampowered.com/app/1106680/> | Steam 讨论帖 “*update* Vibe coded game, despite having a lot of experience with C++” 中玩家质疑 beta 与正式分支被 AI 改坏，作者回复 “I did use some AI to code later parts of the game… But yes I did break the code”，另一帖 “Everything AI generated?” 继续争论；AI Transparency Index 把 Coding 列为 AI 披露项。发布后确有按玩家报告修的性能/字体补丁（“Update on Performance Issues” https://store.steampowered.com/news/app/1106680/view/1811772772454345、“Performance Fix” 致谢报告者 https://store.steampowered.com/news/app/1106680/view/1811772772482213），但 AI 只用于后期部分代码，非大规模开发，作“玩家对 AI 代码的信任崩塌”上下文。讨论原帖：https://steamcommunity.com/app/1106680/discussions/0/664970625904076518/ |
| 62 | 执念刑警之消失的证人（OBSESSED，反馈→版本闭环最强但 AI 只做资产） | <https://store.steampowered.com/app/4573080/> | 2026-05-22 上线、All Reviews 231 条/87% Very Positive；Steam AI 披露原文明确只有叙事视频与角色立绘/场景背景用 Seedance/Jimeng/banana2 等生成，剧本、对话、关卡、推理逻辑、代码与 UI 均由人做。发布后补丁逐条对应玩家报告：v10 “Fixes from player feedback” 修行车记录仪视频日期/驾驶位、赵凯失踪时间线、英文与繁中存档槽漏中文、语言切换循环（https://store.steampowered.com/news/app/4573080/view/1833968530887322）；v15 开头 “goes straight at the two most-reported problems”，修无自动存档导致玩家关窗丢失一小时进度、跳剧情冻结，并点名感谢一位完整实况并逐条写报告的玩家（https://store.steampowered.com/news/app/4573080/view/1834602721200525）；后续还有 v16/v17 与证据板改版。按 §1 的 AI 大规模开发门槛应排除，但它是本轮找到的最干净“玩家报告→具体版本”机制样本，值得作对照。 |
| 63 | DeltaV Orbital Strategy | <https://store.steampowered.com/app/5070120/> | 2026-11-05 刚进 EA（作者 Vazkor），商店简介自述 “built with AI-generated code and original visual assets, directed by one creator”；Reddit 作者帖（https://www.reddit.com/r/aigamedev/comments/1xoxxxr/）说用 Codex 生成原始代码与视觉资产、自己定规则/指挥迭代/测试，并强调 simulation headless、renderer 不拥有玩法规则。AI 开发证据直接，但上线仅 1 天、无发布后补丁与玩家反馈闭环，只能作观察项。 |
| 64 | Kapi Online / CRU | <https://mmorpg.kich.dev.br/> | 学生单人做了一年的 2D 浏览器 MMORPG（HTML5 Canvas + Node.js WebSocket + MongoDB，两个 Oracle 免费实例），页面显示 Ver. 1.8.410，作者长帖按任务分层列 Claude Sonnet/Opus、Google flash、Sol 等实际用途，并公开自动化单测防回归（https://www.reddit.com/r/aigamedev/comments/1xp6oik/）。有长期版本号与 AI 分工自述，但本轮没找到“玩家报告→具体修复”的公开记录，作条件性线索。 |
| 66 | TapTap 制造（AI 游戏平台的真实使用抱怨，上下文）（非作品，不计入候选） | <https://view.inews.qq.com/k/20260919A09I4O00> | 腾讯新闻测评记录：一句话需求让 AI 做 3 小时后免费 1,000 积分被扣到 -571、成品约 12 个 Bug 且会黑屏，想修却已无法继续对话；项目为 Lua、不提供完整工程，难迁出平台。配合 NGA 玩家批评首页被 AI 小游戏刷屏（https://ngabbs.com/read.php?tid=47685189），说明“AI 游戏发布后返工”在平台侧的真实摩擦，但不是单个作品候选。 |
| 67 | 执念刑警玩家的 AI 文案/刷好评爆料（上下文）（非作品，不计入候选） | <https://www.nmbxd1.com/Mobile/po/id/68715093/page/> | 2026-05-26 X 岛串：玩家称 Steam 商店简介、更新公告、官方网站文本全是 AI 生成，UI 与文本前后矛盾，并怀疑好评被刷、自己的差评被举报消失；串内给出官网 https://healthverse.top/fogriver/，对应 Steam app 4573080。与上面 OBSESSED 条目互为印证：同一作品一边有玩家指控 AI 文案，一边在 v10/v15 按玩家报告修实际体验，适合作为“AI 披露之外玩家如何判断 AI 参与”的社区证据，但属匿名爆料、不能单独作事实。 |
| 72 | Kindlefall | <https://kindlefall.com/play/> | 作者称一周内与 agents 做出 7 层、5 英雄、250 boons 的浏览器 3D ARPG，页面已含 Boss Rush、NG+、Dev Vault；HN 两帖（50046369、50072113）有作者回复，但目前只到“可玩 + 继续加内容”，未见玩家反馈驱动的版本记录，作为新候选/上限样本。 |
| 73 | Get Outta My Gut | <https://store.steampowered.com/app/5096200/> | 2026-08-26 的 Claude 制作肉鸽塔防 demo，09-09 大更按反馈加性能档、按键重映射、空格暂停、手柄/Steam Deck 支持、战斗文字开关与退出按钮；商店 AI 披露只写视觉资产与宣传物料用生成式 AI，11 条好评，代码 AI 占比未披露。 |
| 74 | Beast Tide: Slay to Ascend（妖潮：以杀证道） | <https://store.steampowered.com/app/4800340/> | 2026-09-27 免费 demo，0.1.1→0.1.9 八次更新（无尽模式、手柄、云存档、晚波性能、图鉴/存档）；商店 AI 披露只写部分视觉/宣传图/本地化文本用生成式 AI，未提代码；尚无评价、仍是 coming soon，属 demo 阶段迭代样本。 |
| 75 | 不问凡尘 | <https://www.taptap.cn/app/884566> | 字节朝夕光年江南工作室不到 20 人、约一年开发，EA 2026-09-24，Seedance 生成大量场景/角色/过场 + AI NPC 对话，260k 份/88% 好评、峰值 7,200；10-21 更新加切磋、体魄经验、炼器提示等。AI 是资产与运行时内容而非代码，按本卡“AI 只做美术/运行时不算大规模开发”应作上下文/排除，不宜当通过项。 |
| 76 | Simon Willison: The October inflection point for vibe game development（非作品，不计入候选） | <https://simonwillison.net/2026/Oct/28/vibe-game-development/> | 2026-10-28 作者称 Opus 5.5 在 3D、音乐与“游戏设计/好玩”上跨过拐点，列出近几周四个自己真正玩得下去的浏览器游戏（Tree Appreciator、Emberwick、Pumpkin Farmer、Sun Cove）和 Scrimshaw Jukebox；a1dbv 目前只引到他 10-20 的 Battle Drones，这篇是理解“当前一句话做游戏上限”的新基线。 |
| 77 | Emberwick | <https://simonw.github.io/emberwick/v11/emberwick.html> | Simon 用 Claude 聊天（非 Claude Code）从 RPG 引擎原型迭代到约 15 分钟完整剧情，过程中修“NPC 被剧情挪走导致任务无法完成”等玩法 bug，并带实验性关卡编辑器；有完整对话记录，可作“无代码者用聊天模型做 3D RPG + 人工试玩修玩法”的新样本（无发布后玩家闭环）。 |
| 78 | Vibe Games Arcade | <https://icebear0828.github.io/vibe-games/> | 4 个 Opus 5.5 单句 prompt 直出的前端完整作品（LoL 峡谷、Minecraft 3D、植物大战僵尸、杀戮尖塔），零后端即开即玩；可作“一句话直出可玩度”的当前上限对照，也暴露复刻现成游戏的 IP 风险，均无发布后修订。 |
| 79 | Scrimshaw Jukebox（非作品，不计入候选） | <https://simonwillison.net/2026/Oct/6/scrimshaw-jukebox/> | Simon 让 Opus 5.5 设计“纯文本乐谱格式 + 实时合成器”并写出六首游戏配乐（calypso 港口、酒馆 jig 等），可实时改谱；是“AI 生成游戏音乐不落音频文件”的新做法，适合接现有音频/版权讨论。 |
| 80 | Kyle Kukshtel: Your Game Is A Harness（非作品，不计入候选） | <https://kylekukshtel.com/ai-harness-engineering-game-development-claude-code> | 15 年游戏程序员 2026-10-10 的演讲稿，讲怎么让游戏对 agent “可读”：可复现状态/固定随机种子、截图与 UI 分层、独立模拟/黑盒、让 agent 用团队自己的数据工具、把循环做短；HN 177 分/90 评，是本批最系统的“AI 游戏开发 harness”实践文，a1dbv 现有文档未收。 |
| 81 | Popcar: AI is mass decompiling games（非作品，不计入候选） | <https://popcar.bearblog.dev/ai-is-mass-decompiling-games-thats-both-awesome-and-scary/> | 2026-10-14，HN 109 分/170 评：AI 几天内把 Flash Isaac、Colin McRae Rally 2.0、FFTA、Metroid Prime 等反编译成现代移植（IsaacRecomp 1440p/165fps），同时指出“任何软件可被 1:1 复制、许可难以执行”的风险；是 AI 游戏生态近三个月最大的新变量之一。 |
| 82 | Decomp.dev Is Shutting Down（非作品，不计入候选） | <https://decomp.dev/> | 2026-10-15 HN 帖，老牌反编译进度站关停，与上一条 AI 批量反编译直接相关；可作“AI 让手工反编译社区失去意义”的实证，a1dbv 未收。 |
| 83 | Playgama AI Game Index（2026-11-06 版）（非作品，不计入候选） | <https://playgama.com/ai-game-index/> | 页面已从 a1dbv 10-21 引用的 4,000+ 游戏/110 万启动更新到 7,300+ 游戏/180 万启动；Claude Code 占 50%、Codex 18%，Codex 游戏每千次游玩 60 likes vs Claude Code 42，OpenCode 中位时长 4:26 最长；是本卡“AI 工具份额/游玩表现”的最新公开数据（自报标签，非质量排名）。 |
| 84 | NTGame: Steam 新品节 8,202 款 demo 创纪录背后（非作品，不计入候选） | <https://ntgame.com/hardware/steam-nextfest-ai-backlash/> | 2026-10 新品节 8,202 款 demo（去年同期两倍以上），玩家请愿“无 AI”过滤器，Moonlighter 开发商因怕被 AI 克隆推迟 ReVamp 公开测试、Alliance Arts 取消 demo；把“AI 供给过剩→玩家反弹→开发者自保”三条线放在一起，是本卡发布环境的近期背景。 |
| 85 | WorkBuddy（腾讯）（非作品，不计入候选） | <https://workbuddy.tencent.com/> | 腾讯“全场景 AI 工作台”，2026-11-04 接入混元 Hy4 并限时免费，官方与媒体报道其用于游戏策划、原型、美术批量生产（腾讯云黑客松多支 1–3 人队用它做出可玩 demo/1000 张美术）；a1dbv 只收过 Tencent Game-Creation-Agents，未收这个更偏“策划+美术+原型”的入口。 |
| 86 | Astrocade（非作品，不计入候选） | <https://www.astrocade.com/> | AI 游戏创作/游玩平台，HN 讨论里被列为与 Rosebud 并列的“Lovable for games”；可作平台候选，但本轮未见其作品的发布后返工证据，质量/留存未知。 |
| 87 | Tesana（非作品，不计入候选） | <https://tesana.ai/en> | “描述一句话→AI 建游戏并一键分享”的端到端平台，HN 2026-08-17 16 分/12 评；评论现场指出 demo 要登录/付费、iOS 报错，以及产出明显像 Cuphead 的伦理问题，适合作为“平台能力 vs 可玩/版权”的评估样本。 |
| 88 | Spielerando（非作品，不计入候选） | <https://spielerando.com/en> | 2026-11-02 Show HN 的“vibe coding 游戏工作台”：给 Claude Code/Cursor 等提供 blueprint、已测代码、故事/规则检查与分版本工程文件；是“给 coding agent 加游戏领域约束”的新工具，尚无采用效果证据。 |
| 89 | SFXMint（非作品，不计入候选） | <https://sfxmint.com/> | CC0 游戏音效库，提供 keyless API 与 MCP，coding agent 可直接取音效；对“AI 做游戏时音频供给/许可”是一个低成本新入口，质量与曲库规模未核。 |
| 90 | GodmodeAI AI Spine Animation（非作品，不计入候选） | <https://www.godmodeai.co/ai-spine-animation> | 一张 2D 角色图→自动分层/绑骨→导出 Spine 3.5–4.2、透明 WebM/GIF（Unity/Godot 可用）；HN 2026-10-01 29 分/12 评，是 2D 骨骼动画供给的新候选，绑定质量与实际游戏接收未验。 |
| 91 | いきなりラスボスRPG（突然最终 Boss RPG） | <https://siam-works.com/works/ikinari-lastboss-rpg/> | LAST CROWN 同作者 Siam Works：Claude Code+PixelLab 按 457 行人类企划写出约 7,700 行 TypeScript 全代码，2026-09 发布，作者实机报 7 个 bug 后逐项修复，Zenn 原文列出四类输入 bug 与整屏品质改修，是“AI 全实现+人类验收”样本。 |
| 92 | Halocline | <https://official.homie.rocks/halocline/> | Kart Royale 作者 Ryan Campbell 另一款已上线免费浏览器 6 人 co-op FPS，贴图/网格/音效全由代码生成；作者公开用 11 轮评分与“五处崩坏”复盘（渲染器静默失效四轮、六名评审漏掉反向转向）做验收，可追其发布后修订。 |
| 93 | SimCFB | <https://simcfb.com/> | awesome 索引标注 Claude Code+Codex 的大学橄榄球教练游戏；simfba.com 有公开 SimCFB Feedback Thread（搜索摘要可见招募排序、奖学金/走读生规则与阻挡弃踢 bug 反馈），是可直接对照的玩家反馈入口。 |
| 94 | Hoardborn | <https://hoardborn.com/> | BuiltByVibe 记录作者 MrBee（Gritapat）用 Claude、Maker 自估 AI 贡献 100%、耗时数周；放置 ARPG 带玩家市场与离线挂机，适合作为发布后长期运营和经济修订候选，但未找到公开补丁记录。 |
| 95 | Spirit Call | <https://spirit-call.typeonce.games/> | awesome 索引标注 Claude Code+Codex 的 Typeonce 手机端元素精灵动作游戏；作者 Sandro Maglione 以 agent-first 工具链（Ritmo/Effect Machine）和每周工程文章记录决策，便于追版本与修复。 |
| 96 | Inkline Town | <https://inkline.typeonce.games/> | 同作者同索引的 Claude Code+Codex 城市建造，与 Spirit Call 共用 Typeonce 工具链；先核其发布后更新与玩家反馈。 |
| 97 | VybeCiv | <https://vaigames.com/vybeciv/> | awesome 标注 Claude Code 的浏览器 4X，日更同一世界并提供存档下载/导入，适合验证旧存档迁移与版本回归。 |
| 98 | VybeNomad | <https://vaigames.com/vybenomad/> | 同作者 @AlbertSimondev 的远程生活模拟，属 vAIgames 的 AI 游戏集合，与 VybeCiv 共用发布/存档体系。 |
| 99 | AIRIS | <https://vaigames.com/airis/> | 同作者每日 5 分钟同一场景的 AI 策略游戏，daily 场景是天然的版本与反馈观察面；AI 参与度仅按站点“made with AI”口径，需再核。 |
| 100 | NINE FALL | <https://siam-works.com/works/ninefall/> | LAST CROWN 同作者 2026-10 新作，产品页明确“公开后仍在开发、内容随更新”，有发布后持续更新线索；AI 参与未标注，先核再定级。 |
| 101 | CHAOS WORLD | <https://siam-works.com/works/chaos-world/> | LAST CROWN 同作者 3D 无双浏览器游戏，带本地存档与多关卡；AI 参与未标注，作为作者线候选。 |
| 102 | Emberworks | <https://emberworks.typeonce.games/> | typeonce.games 三作之一的无字推理谜题；同作者但 AI 参与未标注，作为作者线候选先核。 |
| 103 | Papaya Drive | <https://dator.dev/papaya/> | City 2026 作者 Einar Andersson 个人站上的另一款浏览器游戏（三张地图、本地排行榜、分赛道存档），可用来核同一作者的 AI 工作流是否延续到第二个作品及其发布后修订。 |
| 104 | A Dark Cave | <https://a-dark-cave.com/> | Steam app 4882240 于 2026-10-27 发售，发售后已有 Cruel Mode and Pacts、Turkish Localization and Insight Delay 两次更新，HN 帖 48158305（12 分/10 评）里作者 julez_ 逐条回应玩家并遭“A Dark Room 加 AI 滤镜”指控；AI 披露在 Steam 页未检出，只能作发布后迭代样本、不能当 AI 大规模开发候选。 |
| 105 | Chaos Chess: Definitive Edition | <https://store.steampowered.com/app/5352000/> | 与 Chaos Chess（本组）同名的商业版，2026-10-22 上 Steam，发售后有 Zombie Mode 更新，可用来核对 HN 上 37 天 Antigravity 做的 Chaos Chess 是否就是它的前身；开发商标注 Camis Publishers/Camis LLC，AI 披露未检出，关系与 AI 占比都待核。 |
| 107 | 仙门守护者 / Immortal Sect Guardian | <https://store.steampowered.com/app/4868150/> | 同作者第一款 AI 游戏：作者自述没写一行代码、连 AI 生成的代码都没 review，Codex+GPT-image-2+天工 Music 完成，2026-07-17 上线后到 08-19 连发 1.0.1–1.0.6（云存档、伤害排名、4 倍速、自动开波），但 Steam 仅 4 条评价。 |
| 108 | 细菌克星 / Bacteria Buster | <https://store.steampowered.com/app/5013860/> | 同作者第二款：Codex+GPT-5.6 Sol 约 10 天，2026-08-25 上线后三天内从 1.0.6 连发到 1.1.1（污染速率、无尽模式继承、重启保留升级），AI 披露含 programming auxiliary content，但仅 2 条评价、峰值 3 人。 |
| 111 | 肉鸽2048 | <https://www.taptap.cn/app/831123> | 同厂 TapTap 制造：2026-03-20 上线、9.2 分/123 条评价，V1.1.30→V1.1.36 修数值超上限、宝物不生效、云存档与切后台卡顿，更新跨度约半年。 |
| 112 | 吗喽摸鱼王 | <https://www.taptap.cn/app/932478> | 由《AI战役》开发者页追到：同厂荷鲁斯之屋的 TapTap 制造，2026-09-11 上线、69 条最新评价，首版开发者话公开请玩家在评论区提数值/事件意见，但目前只读到首版、发布后版本链未证。 |
| 113 | OUTWORKS | <https://store.steampowered.com/app/4859790/OUTWORKS/> | 由《Ultimate Blacksmith Tycoon》同厂追到：Quench Forge 已发售作，商店 AI 披露明写用 AI 编码助手写部分源码，2026-07-07 发售后 07-29 出后期性能补丁（炮塔/子弹/音频/GC）并声明旧存档兼容，同厂还有 FLOWORKS/ALGO ARMS。 |
| 114 | ALGO ARMS | <https://store.steampowered.com/app/5167200/ALGO_ARMS/> | 同厂 EA 作：AI 披露写 AI 参与编程、设计迭代与翻译，2026-09-22 EA 公告承诺按玩家反馈调平衡/可用性/内容，但截稿时只有 1 条评价且无发布后补丁，作条件候选。 |
| 115 | Inertia | <https://kikkupico.github.io/inertia/> | 由 Kikkupico 帖追到：Claude Code 在旧安卓手机上三小时做出、六轮原型迭代才定玩法，有公开可玩页与仓库；但仓库最后提交 2026-01-15、无发布后玩家修订，只作 AI 工作流线索。 |
| 116 | 包鱼塘模拟器：尼斯湖巨物 | <https://www.taptap.cn/app/988242> | TapTap制造（平台AI生成）标签，345条评价/23.5万浏览，2026-11-05更新公告新增“包塘大赛”玩法并调整幸运值机制，是这轮追到的更新证据最具体的新作。 |
| 117 | 猫咖模拟器（权哥的工作室） | <https://www.taptap.cn/app/857638> | 猫猫翡翠经营模拟器同厂（developer/405060，官方账号权猫的认证理由即“《猫咖模拟器》制作人”）的旗舰作，189条评价/9.1分，2026-10-20仍在更新，可作同厂作品的返工对照。 |
| 118 | 这条鱼值钱（出头喵游戏） | <https://www.taptap.cn/app/898592> | 同作者出头喵的增量捕鱼作，90条评价，2026-09-24更新，页面评价数足以支撑“发布后真实玩家反馈”线索。 |
| 119 | 余潮（飞雷神123工作室） | <https://www.taptap.cn/app/935976> | 土豆加工厂同厂（developer/460317）新作，页面带“余潮v0.1.73版本更新”公告（2026-11-05），58条评价，说明上线三天内已有版本修订。 |
| 120 | 拼豆手作屋（奶思K驴的工作室） | <https://www.taptap.cn/app/963250> | 靠卖token成为世界首富同厂（developer/438722），9.4分/30条评价，2026-10-31更新，简介直接谈“玩家觉得大图越拼越累”的产品取舍。 |
| 121 | 再烧一窑（奶思K驴的工作室） | <https://www.taptap.cn/app/972736> | 同厂奶思K驴的建盏烧制模拟，2.68万浏览/22条评价，2026-10-31更新，属于同厂里题材与玩法差异最大的一款。 |
| 122 | 橘子工坊：增量（飞雷神123工作室） | <https://www.taptap.cn/app/942657> | 飞雷神123作品，页面标注“全新版本0.5”，14条评价，可直接核到已进入可玩版本的版本号。 |
| 123 | 末世战线-rts（飞雷神123工作室） | <https://www.taptap.cn/app/958696> | 飞雷神123作品，页面标注“新版本0.4”，25条评价/7.2分，是同厂里唯一RTS，适合看发布后系统级返工。 |
| 124 | 骑砍：从流民到拥军百万 | <https://www.taptap.cn/app/988887> | TapTap制造标签，62条评价/8.3分；页面显示 Android 正式上线日期 2026-10-31、更新时间 2026-10-20（JSON-LD datePublished 2026-10-30T16:01Z、bytedance:updated_time 2026-10-19T16:00Z，均为 UTC；更新时间早于上线日，时序需复核），可作“上线前后补丁”线索。 |
| 125 | 猫咪放置军团（权哥的工作室） | <https://www.taptap.cn/app/987538> | 权哥工作室新作，8条评价，2026-10-31更新，与猫咖、猫猫翡翠同厂，可补该厂放置品类的版本样本。 |
| 126 | Enarian Online | <https://store.steampowered.com/app/4218510/> | Enarian: Orbital Command 同一工作室 Enarian Studios 的前作；Steam AI披露写明AI参与coding、客户端/网站图形、音乐与音效，2026-07-13《State of the Game》称上线后已实现“数百条玩家功能请求”，9-25发布资料片 The Depths Below。 |
| 128 | 回响计划 | <https://www.taptap.cn/app/707782> | TapTap 制造同供应链（供应商上海创巴科技）作品，页面直接给出“版本 18，更新于 2026/9/9，更新 UI 和一些系统优化”与 46 条评价 7.3，可核多版本迭代与玩家反馈的对应关系。 |
| 129 | 泊隐酒店 | <https://www.taptap.cn/app/907315> | 6 条评价仅 4.7，玩家集中报教学被截断、找不到前台/停车员工、45 间房营收不显示，开发者逐条回复“已经在紧急修复了”，是最贴近“差评驱动修复”的一条小体量样本。 |
| 130 | 三牲之跃 | <https://www.taptap.cn/app/875068> | 与钓海暗涌同属 wish的工作室（51 天 jam 产出），30 条评价 9.6，是同作者跨作品的直接对照，能看同一制作流程在第二、三款上的复用与改动。 |
| 131 | 流浪鼠 | <https://www.taptap.cn/app/858521> | 同一 wish的工作室出品，41 条评价 8.5，是该工作室评价量最大的作品，适合当“同作者多作”里反馈最厚的一项。 |
| 132 | 小衣铺开张啦（上轮 §5.1 第 6 项已列，补强） | <https://www.taptap.cn/app/980353> | 与一针一线绣江南同属小黑喵／fangzecan 出品，21 条评价 8.8，可对照同一套生成模板在后续作品里改了哪些玩法与衣橱类系统。 |
| 134 | 涌现：山海 | <https://www.taptap.cn/app/962643> | 同工作室最新作，仅 1 条评价、无评分，可观察首发早期状态，用于判断该团队是否每作都走“先测试再补”的节奏。 |
| 135 | 孟德尔万族模拟器（上轮 §5.1 第 16 项已列，补强） | <https://www.taptap.cn/app/984413> | TapTap 制造新品，7 天前首发已积累 39 条评价 8.5，反馈密度高，但目前没有后续版本，只适合当“待观察是否返工”的前置样本。 |
| 136 | Everdeep Idle | <https://store.steampowered.com/app/4980350/> | 与 Grim Reach Idle 同捆（Dark Fantasy Idle RPG）同发行，2026-10-30 发售、10 条评价 50% 褒贬不一，另有官网 developer notes 与 itch 浏览器版，可查差评后的调整记录。 |
| 137 | Panache | <https://github.com/menufactory43/panache> | 另一作者 Gabriel Turpin 在 Battle Drones（Apache-2.0）上做的完整法语改编，443 次提交、带自己的发行说明与 12 关战役，是“外部作者接手后继续返工”的少见公开样本。 |
| 138 | Pumpkin Farmer / Quarter Sun Cove | <https://simonw.github.io/pumpkin-farmer/> | Simon Willison 自述仍在改机制，SPEC 与头脑风暴记录都公开，可当“已可玩但仍在改”的在制品，与 Emberwick 的完成态形成对照。 |
| 139 | FRETWORK: Guitar Shop Simulator | <https://store.steampowered.com/app/5149060/> | Morhval: Ravenglaire 同工作室 Seven Weeks Studios 新作，商店页明确披露生成式 AI 参与视觉与 3D 资产、音乐为真人，未发售且零评价，只能作同作者制作管线线索。 |
| 140 | Panache | <https://menufactory43.github.io/panache/> | Battle Drones 的 Apache-2.0 分支，公开 443 次提交显示 10 月 28 日 App Store 4.3 拒审后重命名 battledrones.* 存储键、裁掉内嵌演示页并发布 1.1 界面改版，是现成的平台发布返工样本。 |
| 141 | CLOSE QUARTERS: Battle Maps FPS | <https://tesana.com/game/close-quarters> | 8 月 25 日上线后针对玩家评论连续发五次更新（9/15 触控注册与命中方向、9/19 iPad 键盘与多人同步、9/24 武器与跳跃平衡、10/13 叉车命中判定），作者在 8 条评论里逐条回复，累计 2,182 名玩家。 |
| 142 | BODY-CAM | <https://tesana.com/game/body-cam> | 10 月 11 日发布后两天内从 v3 修汽车旅馆门洞导航到 v4 加 5v5 多人，正好对应 15 条评论里的黑屏、鼠标捕获和“只有一个关卡/想要多人”反馈。 |
| 143 | Escaping Production Hell | <https://tesana.com/game/escaping-production-hell> | 9 月 30 日上线，10 月 9 日 v2 修掉标题画面后崩溃并恢复风格计分，10 月 10 日 v3 再加连招，属于有明确补丁的平台可用性返工。 |
| 144 | HOGGO MISSION | <https://tesana.com/game/hoggo-mission> | 10 月 24 日发布次日 v3 加入自动存档并修复灯塔透镜安装与第三世界解锁，是保存/加载可用性维度的直接改动，但只有 19 名玩家、无评论。 |
| 145 | WenWare | <https://wen-ware.com> | Vibe Jam 2026 第三名，赛后站点已到 v1.21 并扩出每日 5 轮、排位 1v1 和最多 6 人派对，是少数有赛后功能迭代的 jam 作品。 |
| 146 | Null Range | <https://nullrange.com> | Cursor 构建、Vibe Jam 2026 第 4 名兼最佳美术，游戏内显示 INITIALIZATION SEQUENCE // V.1.04 并征集更新与 playtest，可追版本记录。 |
| 147 | Claude of Duty | <https://github.com/mshumer/Claude-of-Duty> | Claude Opus 5 单提示多代理产出约 5.5 万行、全程序化资产的浏览器 FPS，代码开源且 README 导向更新订阅，适合核发布后 issue/commit 修复。 |
| 148 | Workmelt | <https://workmelt.com/> | Gauntlet Loop 游戏目录收录的多人 FPS（Erik Nomitch），在线对战与战术匹配让它比单机 demo 更依赖发布后修补。 |
| 149 | Der Koloss | <https://www.derkoloss.com/> | Gauntlet Loop 目录的四玩家合作僵尸生存（Vesper）且带语音，多人协作问题是现成的真实返工来源。 |
| 150 | Phantasy Claude Online | <https://phantasy-claude-online.fly.dev/> | Gauntlet Loop 目录收录的致敬型 ARPG（fauxdufafa_），持久在线角色与进度便于核后续内容/修复更新。 |
| 151 | Starfall | <https://e01.ai/starfall/> | Gauntlet Loop 目录的 Homeworld 风格太空 RTS（Mike Luan），十三方势力的大规模系统本身就需要多轮发布后调整。 |
| 152 | Dust Corridor | <https://claude-of-duty-six.vercel.app/> | Gauntlet Loop 目录的战术 FPS（Leon Lin），与 Claude of Duty 同法衍生，可用于对照同一方法不同落地后的修订。 |
| 153 | Halocline | <https://official.homie.rocks/halocline/play> | Kart Royale 作者 Ryan Campbell 的 Homie 官方六人合作 FPS，同一 AI 多代理管线产出，平台有 What's new 可追更新。 |
| 154 | Moonbase One | <https://official.homie.rocks/moonbase-one/play> | Homie 官方 1–12 人游戏，和 Kart Royale 同平台同作者团队，适合作同管线第二批发布后样本。 |
| 155 | Span Nine | <https://official.homie.rocks/span-nine/play> | Homie 官方 1–8 人游戏，独立成品页与平台更新流可见，可核多人平衡与入口可用性修订。 |
| 156 | NIGHTWIRE | <https://nightwirestudio.com/nightwire/play> | Homie 上的 1–32 人游戏（Nightwire Studio），大规模联机比单人作品更可能暴露发布后网络与匹配问题。 |
| 157 | Emberworks | <https://emberworks.typeonce.dev> | Spirit Call/Inkline Town 同工作室 typeonce 的第三款作品，作者以 agent-first 工具链开发并有 newsletter/archive，制作过程可追。 |
| 158 | Spirit Call | <https://spirit-call.typeonce.dev> | Claude Code/Codex 构建的手机端元素战斗游戏，同工作室公开 Ritmo 工具链与文章，便于核 AI 分工与迭代做法。 |
| 159 | Inkline Town | <https://inkline.typeonce.dev> | 同工作室的薄线框城市建造游戏，与 Spirit Call 共用发布管线，可对照同团队两次落地的修订差异。 |
| 160 | Halcyon | <https://halcyon.billpwchan.art> | Claude Code 构建的环礁昼夜探索，作者另有 Neon Zenith，GitHub 有 halcyon 仓库与架构文档可核。 |
| 161 | Neon Zenith | <https://zenith.billpwchan.art> | 同作者 billpwchan 的 WebGPU 霓虹香港赛车，双作品作者便于核跨项目迭代习惯与资产/代码许可。 |
| 162 | Concordia 2045 | <https://concordia.davidveksler.com/explore/> | Claude Code 构建的全尺寸旋转太空城探索，作者 David Veksler 有公开项目页，适合核大型 3D 世界的发布后可用性修复。 |
| 163 | Hormuz Crisis | <https://vaigames.com/hormuzcrisis/> | vAIgames 新作、同作者 @AlbertSimondev 的海峡海战策略，1–10 回合且标 New，可作为近期发布样本。 |
| 164 | Eyrie | <https://playeyrie.com/> | Claude Code 构建、Vibe Jam 2026 Most Atmospheric 的合作社波 Roguelike，合作平衡与波次节奏是典型发布后返工点。 |
| 165 | FULL SEND | <https://fullsend.game/> | Cursor/Claude 构建、Vibe Jam Most Portal Transfers 的在线多人赛车，带圈速榜，适合查排行榜与多人同步修复。 |
| 166 | Field of Command | <https://play.fieldofcommand.com/> | Cursor 构建、Vibe Jam 2026 第 10 的多人战术游戏，靠前名次通常伴随 jam 后继续打磨，便于找作者更新记录。 |
| 167 | Sunset City - The Dark Tower | <https://sunset-city.didof.dev/> | Claude Code 构建、Vibe Jam 2026 第 8 的作品，作者 did0f，名次靠前可追 jam 后修订与入口稳定性。 |
| 168 | BUNGR INC. | <https://bungr.net/> | Opencode 构建、Vibe Jam 2026 第 11，是少见的非 Claude/Cursor 工具样本，便于跨工具对照发布后维护。 |
| 169 | Velocity Loop | <https://developers.openai.com/showcase/velocity-loop> | OpenAI 官方 Codex 游戏展示中的 3D 玩具车计时赛，链到独立可玩站点，适合核官方提示与产出的对应关系。 |
| 170 | Hollowflux | <https://developers.openai.com/showcase/hollowflux> | 官方 Codex 展示的程序化地牢爬行，战斗受反应性水体影响，页面链到独立站点，可作为官方管线样本。 |
| 171 | Phantasy Codex Adventure | <https://developers.openai.com/showcase/phantasy-codex-adventure> | 官方 Codex 展示的持久化复古 ARPG（作者 Dimillian），带共享排名与程序化世界，比一次性 demo 更可能有后续维护。 |
| 172 | OUTWORKS | <https://store.steampowered.com/app/4859790/> | Ultimate Blacksmith Tycoon 同厂 Quench Forge 的 2026-07-07 发售作，披露 AI 编程助手参与写源码、美术音频全由代码程序生成，且 07-29 发布了后期性能补丁，具备“发布后返工”证据。 |
| 173 | Egg Hunt | <https://marketa.behdad.org/egg-hunt> | Loft Day 同作者 behdad 的前作（2026-07），作者自述概念/设计/美术由人做、Claude 与 Codex 写并维护代码，公开仓库在发布后仍有 07-13 至 09-01 的提交（改名、社交卡、无障碍元数据、字标），可核发布后修订。 |
| 174 | ALGO ARMS | <https://store.steampowered.com/app/5167200/> | Quench Forge 的 2026-09-22 EA 新作，披露生成式 AI 参与编程、设计迭代和翻译、部分机甲 3D 资产由 AI 生成后人工调整，商店页与上线公告可核；目前只有上线公告，尚无发布后补丁。 |
| 175 | FLOWORKS | <https://store.steampowered.com/app/4858700/> | Quench Forge 的 2026-07-10 EA 新作，披露 AI 编程助手写部分源码、所有画面与声音由代码程序生成，商店页可核；截稿前未见发布后补丁。 |
| 176 | 网吧老板，启动！ | <https://www.taptap.cn/app/934314> | 荷鲁斯之屋（与种子《AI战役》同厂）2026-09-29 上线的 TapTap制造模拟作，8.9 分/6 条评价、热度 1536，版本与反馈记录尚薄。 |
| 177 | 仓鼠抓抓抓 | <https://www.taptap.cn/app/834667> | 异度奇纪工作室（与种子《翡翠经营模拟器》同厂）的 TapTap制造知识问答作，仅 2 条评价，作为同厂弱候选。 |
| 178 | By My Side | <https://store.steampowered.com/app/4859700/> | Afterimage 作者 yoopla 的 OverLKD 工作室 Steam 作（2026-07-17），27 条更新含“Thanks to everyone who reported something”与联机热修，玩家反馈闭环清楚，但 AI 只用于 3D 模型/音乐/本地化、代码未披露。 |
| 179 | Tidewrack | <https://store.steampowered.com/app/5035340/> | 同 OverLKD 工作室 2026-08-31 发售，33 条更新公告（库存/联机），但 AI 披露仅 3D 模型，代码未披露。 |
| 180 | 雁城动物园（Bobby） | <https://yczoo.pages.dev/> | 同作者《寻呼1996》被界面新闻称为 AI 小游戏；玩家 2026-10-30 指出首幕重点不清、档案馆来回跳转麻烦，作者回复已加前情提要、独立游玩说明页、跨站资料新标签页打开并同步进度，是可直接核对的反馈→版本闭环（本作 AI 参与仍待作者原文确认）。 |
| 181 | 寻呼1996（Bobby／落文信） | <https://echo-puzzle.pages.dev/> | 界面新闻明确称其为 AI 小游戏；谜页集玩家 2026-08-21 反馈“按一次就闪+晃”致晕，作者回复已在右下角新增 ⚡ 特效开关（也可按 F 键）关闭抖动闪烁，改动已进入可玩版本。 |
| 182 | 网约车：乘客落下一个亿 | <https://www.taptap.cn/app/1005165> | TapTap制造作品，开发者原话称翻了几百条同类游戏评价后，把“后期没东西玩、想自己开车”两个高频意见直接重做进这一版（前期亲自跑单、后期车队/平台/上市）。 |
| 183 | 打工修仙记（狗头放置工作室） | <https://www.taptap.cn/app/828616> | 带 TapTap制造标签，8.8 分/717 条评价，最新版本 9.0 有 498 条评价（说明有版本分化），官方材料把它列为“推荐点击率 7.83%、进入长线运营”的案例；但公开页未逐条列返工内容。 |
| 184 | 阿珠开蚌直播间（莲子_沉淀中／李心蕾） | <https://www.jiemian.com/article/15093614.html> | 小红书 AI 小游戏，总玩家约 220 万；玩家管理员提出“奸商贿赂看守”玩法后被做进版本，作者称部分改动 3 小时即可上线，15 个粉丝群由玩家管理并持续收集反馈（公开入口仅小红书笔记内，无独立游戏链接）。 |
| 185 | 清明上河图：我在汴京摆地摊（赛博曲奇） | <https://www.thepaper.cn/newsDetail_forward_34199244> | 用 ChatGPT/Codex 生成界面与代码、作者手绘示意图纠正 AI 对“立体”的误解；上线 10 天 17.2 万玩家，中秋限定版本在 9 月 24 日零点自动更新、节后自动下架，是可核的发布后版本循环。 |
| 186 | 小喵钓鱼（咖啡布丁pudding） | <https://indiefront.cn/articles/cmuwhonxl000e9zqc118wc8n3/> | AI 两天做出的 30KB MVP，上线时带画面 bug、不到半天 400 多名玩家，作者按玩家丢档与钓不上鱼等反馈加“存档保险箱”并持续修 bug，一个月约 25 万玩家（原文仅经搜索摘要读到，站点直连 TLS 失败）。 |
| 187 | 打工幸存者（拉了摆） | <https://www.taptap.cn/app/959967> | TapTap制造 Game Jam 作品，公开开发者日志 3–5 连续记录移动端适配、数值曲线、美术与技能返工，作者自述只有 6 名玩家时仍按留言迭代，是“AI 工具+日志驱动”的小样本过程证据。 |
| 188 | Super Mario Galaxy movie game（supertommy；上轮 §5.3 第 24 项已列，补强） | <https://supertommy.com/games/super-mario-galaxy-movie-game/> | 作者称 Claude Code 写约 95% 代码、76k 行、53 天；HN 评论指出跳跃高度被写成固定值，作者承认准备改，但未见补丁或版本记录（仅线索，未达发布后返工门槛）。 |
| 189 | 历史模拟器：崇祯 | <https://store.steampowered.com/app/4304230/> | 青干工作室的 AI 原生历史模拟，2026-05-07 发售后持续更新（世界地图、官制改革、官方 MOD、创意工坊、回合上限 500），并因“买断+词元收费”争议于 6-25 转免费、开放自定义 API/工坊，是发布后按玩家反馈改商业与系统的完整样本。 |
| 190 | 崇祯模拟器 Demo | <https://store.steampowered.com/app/5121940/> | AI 大臣驱动的明末模拟 Demo（2026-10-19 上架，报道称用 DeepSeek、个人开发），同名 Playtest 的 0.4.5V2 公告称测试以来近 40 版并修旧存档迁移和 AI 编造人物；Steam 页署名回响互动/玄帧科技与报道不一致，作者需先核。 |
| 192 | Aestra: The Last Wish | <https://tesana.com/game/aestra-the-last-wish> | @houser 的 AI 像素 ARPG，玩家报告关浏览器丢档后 v22 把英雄存档迁到 Tesana 账号并自动迁移、v23 降低上传请求，属真实的存档/平台可用性返工。 |
| 193 | Emberwild | <https://tesana.com/game/emberwild-80972c59> | @thewizard27 的 AI RPG，11-04 的 v33 加进度排行榜、v34 加各区域危险提示，版本日志与玩家数同页可核，适合看发布后小步更新。 |
| 194 | Ultima 2D | <https://tesana.com/game/ultima2d> | @nicojonez 的 AI RPG，10-25 的 v20 加多层住宅与下注 PvP、v21 修玩家自建房进入并把竞技场移出城门，两版连续补功能与入口。 |
| 195 | Future? No Thanks! | <https://store.steampowered.com/app/3861870/Future_No_Thanks/> | Molleindustria 2026-09-04（Steam）发售后因 AI 配音反弹，10-23 补丁移除两处 TTS 改人声、修软锁并开放退款，是“玩家否决 AI 内容后返工”的反向样本（AI 仅用于部分代码与配音）。 |
| 196 | Lantern Hollow | <https://lantern-hollow-rpg.simonw.chatgpt.site> | Simon Willison 用 GPT-6 Pro 按与 Emberwick 相同提示做出的完整 RPG，作者在长文里把它与 Claude 版并列比较成品与可玩性，可补“不同模型同一需求”的对照。 |
| 197 | Kart Royale | <https://official.homie.rocks/kart-royale/> | Homie 官方工作室由 Claude Code/Codex 插件生成的四款多人游戏之一，模型/贴图/音频全由代码生成，可作为 AI agent 工作室从生成到上线的入口（该页为 JS 壳，更新记录需另核）。 |
| 198 | Gridiron Crush | <https://grok.homie.rocks/gridiron-crush/play?via=homie.rocks> | 同一 Homie 平台上由 Grok 生成的多人橄榄球游戏，与 Claude/Codex 作品并列展示，便于比较不同 agent 的成品完成度与房间状态。 |
| 199 | VybeRace | <https://vaigames.com/vyberace/> | VybeCiv/VybeNomad/AIRIS 同作者 vAIgames；页面明写 "Built with AI by vAIgames"，浏览器 3D 赛车，站点 sitemap 显示 2026-11-03 仍在改。 |
| 200 | 元素与构筑 | <https://www.taptap.cn/app/719925> | 同厂出头喵、2P Games 发行；TapTap 页写明 Steam 已正式发售，可核同团队从 TapTap 制造到商业发行的跨平台路径。 |
| 201 | WILD RUSH ∞ | <https://siam-works.com/works/wild-rush-infinity/> | 同作者 siam-works；LAST CROWN 复盘把它列为“AI 能稳定做完”的单屏游戏范例（动物跑酷、无速度上限），可与 LAST CROWN 对照同一作者对不同品类的适配判断。 |
| 202 | BANDMAN LIFE | <https://siam-works.com/works/bandman-life/> | 同作者 siam-works；浏览器乐队经营+音游、带自动存档与中英日界面，属同站未纳入本组的产品。 |
| 203 | City 2026 | <https://city2026.app/> | Papaya Drive 同作者 Einar Andersson；浏览器版 SimCity 2000 重制（含 .SC2 旧存档导入），可与 Papaya 对照其发布后维护与兼容性做法。 |
| 204 | 炒股入门：从散户到一线游资 | <https://www.taptap.cn/app/906716> | 包鱼塘模拟器同厂天愚工作室；8.4 分，开发者的话逐条给出卡顿/性能处理方案（轻量模式、删股票、关资金异动播报），是“玩家反馈写进使用说明”的样本。 |
| 205 | 拼手气抢红包！从高中到顶富圈子的群聊模拟 | <https://www.taptap.cn/app/948067> | 同厂天愚工作室；8.1 分群聊模拟，同厂另一条可跟的发布后更新线。 |
| 206 | 星痕共振 | <https://www.taptap.cn/app/854874> | 权哥的工作室；6.5 分，开发者公开说会逐条阅读反馈并继续开发，适合核对同厂“反馈→版本”的实际落地。 |
| 207 | 余烬边境：割草搜打撤 | <https://www.taptap.cn/app/930386> | 余潮/橘子工坊/末世战线同厂飞雷神123；开发者的话点名操作手感、设备适配、性能和成长节奏仍待打磨，并要求反馈附机型与场景。 |
| 208 | 弹珠机乐园 | <https://www.taptap.cn/app/904574> | 奶思K驴的工作室；9.1 分，同厂里评分最高的一款，可与拼豆手作屋/再烧一窑对照同厂不同品类的更新节奏。 |
| 209 | Rocky Idle | <https://store.steampowered.com/app/3852250/> | Steam 商店 AI 披露为真、2026-03-26 上线，1.0.6→1.3.0 连续补丁，v1.3.0 公告写明部分改动来自社区反馈（从 Everdeep Idle 的 more-like-this 邻居追到）。 |
| 210 | Path of Idle: Old Gods Rising | <https://store.steampowered.com/app/4243990/> | AI 披露为真、2026-08-12 上线，1.1.2–1.1.6 连续版本更新，含难度、关卡与数值调整，是同一邻居列表里版本记录最完整的 AI 放置作。 |
| 211 | Stellar Odyssey | <https://store.steampowered.com/app/4629900/> | AI 披露为真、2026-08-07 上线，v1.3.3→v2.0.1a 持续补丁并在 2.0 重做探索/副本系统。 |
| 212 | Journeybound Idle | <https://store.steampowered.com/app/4946460/> | AI 披露为真、2026-08-07 上线，8 月起连续 hotfix/patch notes，且有社区成员点名请求后推出的 DLC。 |
| 213 | Tactical Cowboy | <https://tesana.com/game/tacticalcowboy> | Tesana 平台标注 AI 写代码、2026-10-17 上线，版本历史到 v147（11-05），更新注记含回合性能与机器人难度调整，是 BODY-CAM/CLOSE QUARTERS 同站目录里版本最多的新作。 |
| 214 | Playground City Racer | <https://tesana.com/game/playground-city-racerr> | Tesana AI 生成、2026-09-30 上线，版本历史到 v65，更新注记持续加载具、爆炸物与战术道具。 |
| 215 | Zero Summit | <https://tesana.com/game/zero-summit> | Tesana 页面明写“made with AI”、2026-10-27 上线，v27 版本历史且有可见玩家评论与作者逐条回复。 |
| 216 | Sunset Block | <https://tesana.com/game/sunset-block> | Tesana AI 生成、2026-10-24 上线，v16 更新含稳定性改进与全屋可进入。 |
| 217 | Whispering Wilds | <https://tesana.com/game/whispering-wilds> | Tesana AI 生成、2026-10-21 上线，版本历史到 v25，可作同平台长版本串的对照样本。 |
| 218 | Ketchup and Doll \| Sandbox Violence Sim | <https://17han5.itch.io/ketchup-and-doll-sim> | itch 同时打 AI Assisted/AI Code 标签，0.1.5 版 2 天前更新，说明写明首版用 GPT-4o、后用更强模型补解剖物理，评论区在持续提需求。 |
| 219 | 凡骨 | <https://www.taptap.cn/app/969582> | 简单极限（骑砍同厂）2026-10-12 上线，1.1.1 更新日志直接写“谢谢大家在评价区说操作的问题，这一版专门改手感”，新增按键布局与摇杆设置，11-01 仍在更新。 |
| 220 | 封神：陈塘断电夜 | <https://www.taptap.cn/app/929463> | 小黑喵（归墟/小衣铺同厂）2026-09-30 上线，页面更新说明列出开场引导、受击/破势反馈、窄屏贴图加载等具体改动。 |

### 8.6 本轮最强 1 项优先试玩建议与可验证机制

**本轮新增范围内优先试玩 Enarian: Orbital Command**；若按卡级跨轮排序，仍先按上轮 §7 试 Fire Field，两者可并行——Fire Field 验“零编程作者＋AI 写约 18 万行＋毒叠层补丁”，Enarian 验“上线一周内刚发生的玩家反馈→v1.4 补丁”。Enarian 按可执行清单走：在 Steam 进入一局后，手动给维修船下维修命令，观察是否出现“两船相向靠拢、维修船跟到修完或目标被毁为止、双方原命令被取消”；再核武器/维修射程显示、窗口化、设置内 Quit to Main Menu 与突击合同敌舰是否预生成。验收只记“v1.4 补丁声称的行为在可玩版本里是否成立”，不把商店页文案当已验。若当前版本已改过维修逻辑，记录实际失败点与版本差异，不跳过后称通过。

**一个可在现案例验证的具体机制：修复必须覆盖旧存档/旧状态的迁移与回归（本轮三条已核独立证据）。** 上轮 §7 已用 Fire Field、Tropic Tumble、群侠传立起四段规格；本轮把它补强到三个不同作品、同一机制：

1. **Ultimate Blacksmith Tycoon r170**（<https://store.steampowered.com/news/app/4687330/view/1840944183775792>）：r169 清理旧存档历史导致“旧档从读取列表消失、长局无法保存”，r170 给出根因、自动重注册旧档、写后删除、存档瘦身四段修复。
2. **钓海暗涌**（2026-07-07 更新帖 <https://www.taptap.cn/moment/823544410019989161>）：官方“已优化内容”写“旧存档中已经重复持有的唯一真遗物会自动规范为 1 个”，属“旧状态去重迁移”；app 页 <https://www.taptap.cn/app/850567> 只作入口，公告原文在 moment。
3. **Realm of Eldermyr v3.513.0**（<https://eldermyr.com/release>）：修“技能点每次登录被重置、存仓库/熔炉时物品消失”，属登录态与容器状态的持久化回归。

三者共同给出可照做的规格：① 玩家报告先写成“当前状态 + 期望状态”两行；② 修复分“新状态逻辑”和“旧状态读入”两段，旧状态必须定义降级/迁移/拒绝策略；③ 补一条从旧存档/旧终态出发的回归，而不是只测新开档；④ 发版说明写清旧存档会发生什么。

这个机制可以直接在现有 FPS/MOBA/Star 的存档/读档模块里验证：拿一个真实的旧档（改过数值或规则前的档），按上述四段做一次修复，观察旧档读入是否被正确降级、回归是否覆盖、发版说明是否可复述；它比“再加一个 UI 提示”更接近本卡要的发布后返工能力。

### 8.7 本轮边界与未做

- 未启动任何游戏、未播放视频/音频、未看完整连续实机、未登录任何站点、未发帖或联系作者。因此不能声称任何作品“已玩”“已看完”“手感/帧率/听感通过”，也不作品质排名；所有“可玩”只到公开入口与页面文案。
- 两项通过项已各补一张静态截图原 URL 并在 2026-11-06 打开确认：Enarian 用 Steam 商店页 1920×1080 截图（发行方上传，非 capsule）、Eldermyr 用作者站首页 1920×1080 游戏内截图；翡翠的截图保留在 §8.4 条目。截图只能证明画面存在，不等于已实玩。
- 本轮 220 条清单链接均经 curl 核对并保留原始链接；其中 18 条为上下文/方法/工具/索引，不计作品。未新增清单外链接。上轮 89 项仍在册，本节不重复展开。
- 理由中引用的补丁/原帖链接沿用清单原文；本轮另抽查了 Enarian、Ultimate Blacksmith Tycoon、Zero To Hero Idle、FlashBoss、Agents! Please? 等候选的商店页/Steam 新闻，翡翠经营模拟器/一针一线/归墟的 TapTap 更新帖与 Eldermyr release 共 20 余条，除 Reddit 外均返回 200；Reddit 原帖与部分 itch 页面本机不可直连（000/TLS），已在正文标注证据来自归档 API 或间接描述。
- 最大的来源缺口仍是 itch.io 与 linux.do 原帖：前者 TLS 全站拦截，后者只能经镜像读部分楼层；涉及 itch 的 Bash Fighter、Rogue Memory、Afterimage 与涉及 linux.do 的 Achroma/妖潮渡劫，只能给条件性证据。
- Steam 评测正文、Discord、X、YouTube 均未读，玩家原话与逐条评测缺失；“玩家反馈”本轮只到补丁/公告原文与作者公开回复层。
- 许可与成本：除少数标注 MIT/GPL 的仓库外，多数条目只写“未知”；不推算。

## 9. 第 3 单元（u3-a0）2026-11-06 追加：新一轮六角度扫描

> 本节是同一任务第 3 个工作单元（u3-a0）的增量报告。按任务 §2 的来源范围（itch devlog＋补丁、Show HN 作者回复＋可玩站、Steam 更新＋作者长文、一个中文作者原帖）与 §6 门槛，本单元用 6 个收集角度并行重扫，再做 3 轮顺链追踪，最后用 curl 并行核对链接（状态码＋页面标题/正文）。保留 **196 条**已核实候选链接；其中 10 条与 §1–§8 在册条目重复（Tiberava、Uncracked City、Quasar Saz、Panache、Emberwick、Quarter Sun Cove、Bash Fighter、Claude Code Game Studios、awesome-ai-built-games、OpenAI Developers Showcase），排重后为 **186 条新链接、182 个新对象**：**3 项本轮新通过门槛**（Brickbrag、哈耶克的文明：市场经济、Permit Pending）、**22 项第一备选**、48 项其余作品线索、14 项弱闭环作品、80 项工具/索引/方法/上下文、15 项行业背景/反向样本；另有 4 组同作品双入口（NeoMud、Snake: Gridbreaker、Rosebud 的 Wesnoth/OpenRA）合并计数。§1–§8 的在册项与结论不被本轮推翻，本节不重复展开。所有候选只读公开页面/API，未启动游戏、未播放视频/音频、未登录、未打开浏览器；“可玩”只到公开入口返回 200 与页面文案，不等于已实玩。

### 9.1 本轮渠道覆盖表

| 渠道 / 收集角度 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| Hacker News（Algolia `/search`、`/search_by_date`、`/items`） | 直连 `news.ycombinator.com` TLS 被拦，全部走 `hn.algolia.com/api/v1`。`tags=show_hn` 2025-11 起 20 组查询（game claude、ai game、browser game、vibe coded game、game update/patch/feedback/v2、multiplayer、roguelike、tycoon、simulation、webgl、three.js、claude code、cursor、codex、indie、launch、released）得 1,194 条游戏帖；另用 `tags=comment` 搜 20 组修复/反馈短语（thanks for the feedback、fixed in the latest、patch notes、v1.1、hotfix、players reported 等）按 story 反查；对约 260 条游戏帖逐条取 `/items/<id>`，抽取 submitter 回复并按 fix/update 词频与 AI 披露词排序；完整读 Brickbrag（50063042）、SimDrive（47954074）、Tiberava（50146401/50147783/50200570）、WorldStrike（50389420）、Hormuz（47729477）、0.space（43726058/43100260）、Permit Pending（50170593）、Uncracked City（50358352）、UK Farming（50287255）、SimCity with Permits 等约 15 个线程的前两层评论 | 约 26 条（Brickbrag、SimDrive、Permit Pending、Tiberava、WorldStrike、Hormuz、0.space、Uncracked City、UK Farming、Aim and Shoot、Refinery Run、Beakdown、Sagorax、Catcopter、Floktoid、Skyline Co-op、City 2026、Cooked、Hyperbubble、Downtime、GameVibe、DailyMetro、Skub、LMAO、Loft Day、Discontinuum 等） | 只读到作者回复与含修复/反馈词的评论，未逐层读完完整评论树；作者身份常只到 handle；部分 2024–2025 帖的时间与当前站点已不一致 |
| itch.io（主域、`*.itch.io`、devlog、jam `/rate`） | 直连 DNS 解析到拦截域、TLS 握手失败；改走 `<author>-itch-io.translate.goog` 与 Google 翻译代理（配额约每 30–60 秒一次，超出 429）。读到全站 `/devlogs` 最新 50 条补丁帖、`/games/new-and-popular/ai-code` 3 页去重 36 个作品、`/games/top-rated/ai-code` 36 个、Dungeons & Dynasties（页面＋v1.3.1 反馈补丁＋56 篇 devlog 列表）、CatPhish、Neo Forge、Dig Dan Dig、Wander's End、Monkyupe、Sealed Fortress、AI Browser Game Jam 的 entries 与 results | 约 5 条进清单（Azure Flame Dungeon、Rogue Memory、6-bit Vanguard、Ketchup and Doll，以及 Qiita 上的 Spell Cascade 复盘）；其余 itch 页面读到但未过链接核对 | 直连 curl 000/exit 35、WebFetch 返回 Socket is closed；translate.goog 400/429；Monkyupe 的 `/devlog` 404（该作没有 devlog 栏目，不是链接错误）、Tower of Time 的 itch 补丁记录、Wander's End devlog 1717210、Azure Flame 的评论与作者截图原图均未直读；devlog 评论区不可得 |
| Reddit（直连＋Arctic Shift 归档 API） | `www.reddit.com`/`old.reddit.com` 直连 403/TLS，改用 `arctic-shift.photon-reddit.com` 的 `/api/posts/search`、`/api/posts/ids`、`/api/comments/tree`。r/aigamedev 2026-10-28～11-06 按天翻约 2,000 帖，正文同时含 players/testers/feedback/playtest 与 fix/bug/reported/patch 的 177 帖按评论数排序；读 Hiraeth（1xn2rp5）、Max Every Skills（1xhzjkz）、Kapi Online（1xp6oik，作者长帖）等正文与部分评论；另读 r/gamedev 的 Claude Code Game Studios 帖（1ssodcu）与 AI caught up 帖（1wo5asm）、r/Games 的 PH3 长文（1xcr1au） | 约 7 条（Hiraeth、Max Every Skills、Kapi Online、Uncracked City、Tiberava、r/gamedev 工具帖、r/Games 行业帖） | 直连 403/TLS；redlib/eddrit/safereddit 被 bot 墙；部分评论树 Timeout，未逐层读完；Arctic Shift 偶发 502 |
| Steam（store HTML、appdetails、ISteamNews v2、storesearch、morelike、开发者页） | ISteamNews `GetNewsForApp/v2`（count=40、maxlength=0）读公告全文；appdetails 核发售日/价格/开发者；store HTML 核 “AI Generated Content Disclosure” 与 All/Recent Reviews；storesearch 定位 appid；`/recommended/morelike` 取 120 个 appid 后逐个抓商店页按 AI 披露过滤出 18 个候选；补读中文区作者的 56 条更新 | 约 9 条（Snake: Gridbreaker、CRETA、Scarred Steel、Primus、Overdrive Breakout、SnekromancY、Teach My Little Sister 的运行时成本公告，以及同厂/同作者的 Steam 页面） | `steamcommunity.com` curl schannel exit 35/WebFetch Socket closed；`appreviews` 302 空；SteamDB 403；news hub 是前端壳（正文改由 API 取）；评测原文与讨论区读不到，只能读商店页与公告 |
| TapTap（app 页、moment、developer 页、`__NUXT_DATA__`） | curl/WebFetch 直读应用页、moment、开发者页；解 Nuxt `__NUXT_DATA__` 取 title/developer/whats_news/update_time；追同厂开发者页（270778、405060、460317、438722、402163、428865 等）；抓 `/tag/TapTap制造` 列表 | 约 27 条（哈耶克的文明、妹居物语、江南第一主播公司、丧尸危机、翻面、今天也元气满满、王朝崛起、少女终焉契约、战术蹲坑、三国群雄志、下班后的晚餐、世界推演：反应、文明涌现、意识溢出、异星祭坛、无限弹球、江湖余生、二次元氪金模拟器、撒币之旅、恐怖直播、铁骑镇魂曲、开局一只蚁、地穴涌现、小小史莱姆、水彩魔法师等） | `webapiv2` 返回 INVALID_XUA（缺 X-UA 头）；搜索 API 404；评论原文与完整版本历史未取；部分页面只显示“昨天/前天”，绝对日期未核；app 页不展示逐条更新日志 |
| Bilibili（toy 页、视频 view API、相关推荐） | curl/WebFetch 直读 toy 页；`x/web-interface/view` 读视频标题/UP 主/日期；从「后日时光」BV1Hvu46iEVL 扩两层相关视频，读到丧尸求生 BV1aKt66BEaf、小面包、异星祭坛 BV1WLMG6FEKv | 4 条（后日时光、丧尸求生、异星祭坛、Yu-Gi-Oh! Ruins Duel） | 搜索/space 接口 412；评论详情返回验证码；音频与实机未播放；toy 页有登录提示 |
| linux.do（直连＋locdd.com 镜像） | 直连 curl schannel TLS exit 35、WebFetch Socket closed、translate.goog 403；只经 locdd 镜像读到部分楼层 | 0 条进入本轮清单（SOULFORGE、Achroma 等帖读到片段但原帖不可达，且已在 §8 记账） | topic 2648361、1537744、2210932、2939052 等原帖与楼中楼未直读；镜像只有部分页；不能据此判定该渠道无内容 |
| 作者站 / 博客 / 技术社区（Qiita、Zenn、dev.to、iceprosurface、michaelghurston、juliapottinger、simonwillison、kylekukshtel、penguinboisoftware、rosebud.ai、ihca.cn、last-beacon.pjstack.dev、velmoxia.com 等） | curl/WebFetch 抽正文与出链；dev.to 用 `/api/articles` 与 `/api/comments`；Qiita/Zenn 用文章 API；读制作记、release notes、FAQ、价格页 | 约 28 条（Spell Cascade、Void Parry、Choicer Voicer、Padlock、Ave Molech、Growing City、无限弹球复盘、Babyloniain Twins、SANDLINE、MIDWAY、Last Beacon、Velmoxia、Emberwick、Quarter Sun Cove、Rosebud 三个移植复盘等） | Zenn 会员/付费文章不可读；0.space、rastushiy-gorod.ru、avemolech.vercel.app、tetra-jet.vercel.app 等可玩站 TLS/000；部分博客只有摘要或 540 字符正文 |
| 中文媒体与转载（知乎、头条、掘金、gameres、游戏陀螺、界面、澎湃、腾讯新闻、17173、7k7k） | WebSearch 约 25 组中文查询；curl 读掘金、gameres、游戏陀螺、网易/腾讯转载、界面、澎湃正文；知乎原文多为 403 | 约 12 条线索（我的奶茶屋、一箭又一箭、根本难不倒我、箭头快跑呀、阿珠开蚌、清明上河图、小喵钓鱼、江南第一主播公司等），其中多数只有二手摘要 | 知乎 403/650B 反爬页；微信公众号“环境异常”验证墙；小红书需 App；B站 opus 验证码；TapTap 旧入口 app/800521 已 404 |
| 目录 / 榜单 / 平台（awesome-ai-built-games、awesome-gpt-6-astra、awesome-gamedev-agent-skills、Vibe Jam、Playgama、OpenAI Showcase、Tesana、Homie、Gauntlet Loop、GameDaily、Player1AI） | 读 README、Vibe Jam 页面缓存数据集（945 条含 final_rank/made_with/award）、`showcase/llms.txt`、Playgama data.json、Tesana 游戏页、Homie 官方页、Gauntlet Loop 目录 | 约 22 条交叉线索（Vibe Metaverse v2、Toon Tank Arena、MOXstrike、Rap Battle、Mana Blade、TAKEN、GRAVECRAWL、RIPCORE、Tesana 系多款、Homie 系多款等） | Playgama 只有聚合 data.json、无单游戏清单；Astrocade/Homie 部分页是 JS 壳；`threecade.games/games/rocketball` 404、`tinyskies.vercel.app` 000；目录条目多为索引声明，未见逐版本更新 |
| X/Twitter、Discord、YouTube、Bluesky、Newgrounds | 尝试读作者时间线/单条长帖、Discord 邀请、实机/预告片、Bluesky 原帖 | 0 条直接候选 | X 登录墙/402；Discord 未登录；YouTube 未播放；bsky.app 000、attie.bsky.app 无部署；Newgrounds 403；全程未播放视频/音频 |
| WebSearch 与通用搜索引擎 | 多个子批次共用 200/200 配额；前半程用关键词找作者/作品，后半程改站点 API、HN/GitHub API 与直接抓页 | 0 条直接计数（只作索引入口） | WebSearch 200/200 用尽；Bing 中国版对英文/`site:` 返回无关结果；Google、DuckDuckGo、Mojeek、Startpage、Brave、SearX 被阻断或验证码 |
| GitHub（REST、raw、HTML、commits atom） | 未认证 `api.github.com` 限流后改用 `raw.githubusercontent.com`、仓库 HTML 与 `commits/master.atom`；读 TheLongSilence、Microverse、awesome-gpt-6-astra（182 条）、awesome-gamedev-agent-skills（77 skills）、civ-game（README/AGENTS.md/CONTRIBUTING_AI.md/CHANGELOG/commits）、OpenGame、GameCraft-Bench、GameDevBench、VibeGame、Noobi.ai、Breakpoint/godot-mcp 系列等约 45 个仓库与 20 余个作者仓库列表 | 约 75 条（游戏仓库约 20 条、工具/索引/MCP 约 55 条） | 代码搜索需登录；未认证 REST 403 rate limit；部分 issue/PR 与分页仓库未取全；`aigamedevs/awesome-ai-tools-for-game-dev` README 404 |
| 游戏运行 / 视频 / 音频 | 未启动任何游戏、未播放视频/音频、未打开浏览器；可玩性只到 HTTP 200 与页面文案 | 0 项实玩 | 所有候选均缺本端实玩或完整连续实机；帧率、手感、听感、完整游玩回路未验 |

**计数口径。** 表中“得到”为去重前条目数，跨渠道会重复（同一作品可能同时出现在 HN、Steam、作者站与目录），相加高于本轮 196 条；排重后的准确数见本节开头（196 条链接、186 条新链接、182 个新对象）。

**本轮读不到（合并 6 个收集者记录，按渠道归并；与前两单元重复的只列一次）。**

- **itch.io 及 `*.itch.io`**：本机 DNS 指向拦截域，curl 000/exit 35、WebFetch Socket is closed、translate.goog 400/429；Monkyupe 的 devlog、Tower of Time、Wander's End、Azure Flame、Rogue Memory 的评论与作者截图未直读；`/submissions` 与部分 `/rate` 页 429/403。
- **linux.do**：直连 TLS 失败、translate.goog 403 challenge；topic 2648361、1537744、2210932、2939052 的原帖与楼中楼未读，只有搜索摘要与镜像片段。
- **知乎、微信公众号、小红书、B站 opus/space/评论**：知乎 403；公众号“环境异常”验证墙；小红书需 App；B站 opus/评论接口验证码、space 412；原文与配图未核。
- **Reddit 与社交**：直连 403/TLS；Arctic Shift 可读正文与部分评论，深层评论树未逐条读；X/Twitter、Discord、YouTube、Bluesky、Newgrounds 登录墙/402/000/403，作者一手更新串与实机演示未读。
- **Steam 社区侧**：`steamcommunity.com` 000/TLS、`appreviews` 302 空、SteamDB 403；评测原文、讨论区与补丁历史无法从社区侧交叉核。
- **可玩站**：`0.space`（ECONNRESET/SSL EOF）、rastushiy-gorod.ru（TLS/RemoteDisconnected）、avemolech.vercel.app（UNEXPECTED_EOF）、tetra-jet.vercel.app（000）、play.arrr.fun（需 indie.fun 登录）、spawn.co（Spawn 客户端门禁）、`www.gravecrawl.com`（约 5KB JS 壳）、`vibegame.tettet.org` 的 `#demos`（JS 动态加载，只显示 Loading）；这些入口未能验证实际可玩与版本。
- **目录/平台**：Playgama 只有聚合 data.json；AI Transparency Index 的 `?tag=Programming` 是“编程题材游戏”而非“AI 写代码”；Astrocade/Homie 部分页是 JS 壳；genex.games 单款游戏 URL 无法从 HTML 提取。
- **工具/资产市场**：Unity Asset Store、VS Code Marketplace 无对应游戏候选评价；agentskills.io 只有规范与客户端展示，没有游戏 skills 目录；npmjs.com 的 `@taptap/maker` 包页 403（bot 墙），只读到 registry JSON 与 GitHub。

### 9.2 本轮结论、排重与排序

**先给结论。** 本轮 196 条已核实链接（排重后 182 个新对象）里，按任务 §1/§3 硬条件（AI 大规模开发、已过首次可玩、真实玩家反馈→具体返工、作者/入口/版本可核、一次可复述的二改、许可与成本能分开）挑出 **3 项新通过**：**Brickbrag**（最强）、**哈耶克的文明：市场经济**、**Permit Pending**。Brickbrag、Permit Pending 能把公开帖中的玩家原话对到具体改动：Brickbrag 的 HN 玩家报告对上 10-13 changelog 条目，Permit Pending 的玩家原话在 HN 父评论 50171235/50189362、作者回复 50173404/50202272 可对；哈耶克的文明对到 changelog 致谢点名的测试玩家反馈＋v2.0.0 的 Web Worker/存档迁移改动，但玩家原话未公开，证据是作者转述。三项都不是只有首日演示；AI 参与开发均有作者自述或仓库/补丁证据，不是只做美术或运行时内容。按证据完整度排序：Brickbrag（作者自述＋HN 原话＋逐日 changelog 三方可对）＞哈耶克的文明（版本链、提交署名与 changelog 致谢可核；无公开玩家原话）＞Permit Pending（HN 玩家原话与作者回复可对，但缺版本号与作者长文）。

**与上两轮首推的关系。** 卡级首推仍是 §3.1 的 **Fire Field**（零编程作者＋约 18 万行＋v1.9.1 毒叠层补丁点名玩家报告＋第三方首发周复核）；§8.3 的 **Enarian: Orbital Command** 仍是“近两周刚发生玩家反馈→补丁”的最新 Steam 样本，**Realm of Eldermyr** 仍是免费浏览器首选。本轮 3 项是“新增可深挖池”，不替换它们。**什么情况下改选本轮项**：要免费浏览器、且想看“玩家原话→当天 changelog 条目”的最短闭环，选 **Brickbrag**；要看“AI 写几乎全部代码、人只定玩法/美术/叙事”的分工样本，选 **Permit Pending**；要中文作者、长版本链与旧存档/性能返工，选 **哈耶克的文明**。需要大样本评价时仍优先 §3.3 群侠传（2,347 条）；需要 Steam AI 披露＋补丁原文时仍优先 Fire Field / Enarian。

**排重。** 196 条清单中有 **10 条与 §1–§8 在册条目重复**，不重复建条：§5.3 的 **Uncracked City** 与 §6 的 **Tiberava**（本轮分别补强/重审），以及 §8.5 的 Quasar Saz（<https://github.com/cleak/quasar-saz/releases/tag/v1.1> 与 §8.5 第 4 项仓库同作品）、Panache、Emberwick、Quarter Sun Cove、Bash Fighter、Claude Code Game Studios、awesome-ai-built-games、OpenAI Developers Showcase。**Uncracked City** 本轮补强：作者 2026-11-03 的 Show HN（50358352，127 分）后 11-04 回复 18 条，新增“在游戏里加一句嫌疑人均由语言模型扮演的披露、修无法返回某地点并说 next version、尽快出网页版、预告片以后更仔细审”等承诺，但仍未确认已进入可玩版本，不重复建条。**Tiberava** 本轮重审：2026-10-22 的 Show HN“My vibecoded game got a glow up”（50200570）由 cayodister 发出并以“我的 vibecoded 游戏”自述改版；更早帖（50146401/50147783）玩家报平移卡顿并要 WASD，作者回“Done: 平移更顺、支持方向键/WASD”。但作者仍只到 handle、站点无 AI 披露、AI 分工只有“vibecoded”一词，按“身份已补强、证据仍薄”保留在 §6，不升甲。**其余 182 个对象均为本轮新增**；同作品多入口（NeoMud、Snake: Gridbreaker、Rosebud 的 Wesnoth/OpenRA）在表内合并并注明。

**并列时的优先序**（沿用 §2）：可复述的玩家原话→具体改动 > 有版本号/连续更新 > 玩家样本量大 > 有作者过程长文 > 有第三方复核。排除：任务 §4 名单、pxl 等工具、纯 UI 改动（转 UI 卡）、纯场景局部（转场景光照卡）、AI 只做运行时内容、只有首日演示。

### 9.3 本轮通过门槛的 3 项

#### 9.3.1 Brickbrag（免费浏览器多人积木世界，本轮最强新候选）

- **可玩入口**：<https://brickbrag.com/>（本次 200；免费浏览器，无需登录即可玩）。更新记录：<https://brickbrag.com/changelog.html>（本次 200，游戏内菜单同一份列表）。
- **作者与制作过程**：Hacker News「Show HN: Brickbrag – A multiplayer brick-building world in the browser」item 50063042（2026-10-12，82 分，14 条顶层评论；作者 handle `neuling`；本机 HN 直连 TLS 不可达，正文经 <https://hn.algolia.com/api/v1/items/50063042> 读取）。作者自述（50063065）：八天前开始做一个浏览器积木建造器，后来扩成可开车/坐公交/开飞机/赛道竞速/买地协作建造的开放世界；技术栈 Claude Code（Opus 5.5）＋three.js＋Node＋SQLite；9 岁孩子是主要试玩者。作者又说（50068156）“大部分时间花在小细节：最后 20% 是 AI 仍需要大量人工引导与迭代的部分”。
- **AI / 人分工**：AI 写代码与实现（作者原话 “Built with Claude Code (Opus 5.5)”），人负责玩法方向、美术方向、手感细节、反复试玩与发布；作者在 50067116 明确把它当作“没有游戏工作室也能用 AI coding 做游戏”的样本。没有逐项代码占比。
- **版本与日期**：2026-10-12 上线；changelog 从 10-12 连续更新到 10-24（可见 10-12、10-13、10-14、10-21、10-22、10-23、10-24 的条目），无 semver 版本号，日期即版本。
- **一次具体二改（玩家原话 → 10-13 changelog 条目）**：玩家 gregsadetsky（50064516）报“教程里买了地却一直提示 no building here”、ChanderG（50066640）与 yardshop（50065486）复现；daef（50067118）报“在砖店菜单里退出又被弹回”；dalemhurley（50068830）报“手机摇杆误双击会放大整个页面且缩不回去”。作者 50067134 回“Will investigate and fix the issues”、50067138 回“会把返回点移到入口外”，并在 50069148 直接给出“Fixed: changelog.html”。changelog 10-13 条目里有对应改动句：`Leaving the Brick Store puts you on the street, a few steps from the door – no more popping straight back in.`（对 50067118 的砖店循环）、`Practice field: bricks go down everywhere – it used to say “no building here”.`、`Phones: a quick double tap on the joystick no longer zooms the whole page in.`；三条都能对上玩家报的问题，且改动就在当前可玩版本（是否彻底修好仍需按 9.7 复测）。同一 10-13 列表另有 `The Resume button at the bottom of the menu works again.`，是菜单按钮修复，不对应 50067118 的砖店循环。
- **作者静态截图**：<https://brickbrag.com/assets/build/cafe-960.jpg>（本次打开 200、image/jpeg、75,184 字节；清单称页面注明非 mock-up，本次未逐句复核）。
- **为什么最值得先挖**：它是本轮唯一“玩家在 HN 的原话 → 作者当天回复 → 同一日 changelog 条目 → 当前可玩版本”四段可直接对照的样本；反馈不是“修了很多”，而是能逐条复测的手机/菜单/建造可用性问题。适合回答“发布后第一周怎样把玩家报告变成可复测的补丁条目”，也适合借它的 changelog 写法（玩家能看懂的动作句，不写内部术语）。
- **缺口**：无版本号（只有日期）；代码/资产许可与总成本未知；本机未启动游戏，多人并发、性能与手感未验；无第三方复核；作者身份到 HN handle `neuling`，未核真实姓名/公司。

#### 9.3.2 哈耶克的文明：市场经济（中文作者，长版本链＋旧存档/性能返工）

- **可玩入口**：<https://hkingauditore.github.io/civ-game/>（本次 200，免费浏览器）。公开仓库：<https://github.com/HkingAuditore/civ-game>（README、AGENTS.md、CONTRIBUTING_AI.md、CHANGELOG_v1.50+.md、CHANGELOG_v2.0.0.md 均可读）。
- **作者与制作过程**：仓库内是作者自写的开发文档：`AGENTS.md` 是“Codex Agents Guide”，规定自动化编码代理在本仓库的工作方式；`CONTRIBUTING_AI.md` 是 `LLM Collaboration Protocol v1.0`，定义 `[ARCH]/[DEV]/[PM]/[QA]/[TEST]/[DESIGN]/[ART]` 角色、S/A 级决策必须人工确认、B/C 级 AI 自主、每次对话结束必须更新 CONTEXT/CHANGELOG 并 Git commit。提交历史可核：最近 20 条含 v2.3.60、v2.3.61、v2.3.62、v2.3.64，且有 4 条带 `Co-authored-by: Cursor` 的 agent 署名；最新提交 2026-10-22。清单记作者在知乎长文里自述“不写一行代码、Claude 主开发、Codex 审代码、Gemini 出点子”，但该文本机 403（650B 反爬页），只能作清单转述，未在本轮直读。
- **AI / 人分工**：可核的一半来自仓库：Cursor 提交署名＋Codex AGENTS.md＋CONTRIBUTING_AI 的决策分级（人保留 S/A 级确认与验收）；不可核的一半是“Claude/Codex/Gemini 各做什么”的逐项比例，只在知乎转述里。
- **版本与日期**：v1.52.11（上一版）→ v2.0.0（CHANGELOG 标注 2026-03-13）→ v2.3.60–62（2026-06-08 提交）→ v2.3.64（2026-10-22 提交）。`CHANGELOG_v2.0.0.md` 末尾写“感谢所有参与测试和反馈的玩家”，并点名“反馈后期卡顿问题的测试玩家”。
- **一次具体二改（性能＋旧存档）**：v2.0.0 的“8.1 Web Worker 重构”把手动贸易等计算密集任务移出主线程、从 `useGameLoop.js` 移除 656 行，官方文档称后期帧率提升约 40–60%；同一版“存档兼容性”写“完全向后兼容：旧存档加载时自动迁移”“旧存档默认为私产制”。致谢点名“反馈后期卡顿问题的测试玩家”，可证明作者把该版本改动归因于测试玩家反馈；但玩家原话未公开，证据是作者转述，不是可直接引用的公开帖。v2.3.60–62 又修人口冻结、大臣满员扩建、业主岗工资等具体问题。
- **作者静态截图**：<https://raw.githubusercontent.com/HkingAuditore/civ-game/master/debug_load.png>（本次打开 200、image/png、1280×720、606,824 字节；仓库内发布的游戏状态截图，不是商店 capsule，也不是营销图）。
- **为什么最值得先挖**：它是本轮中文线里版本链最长、证据最“工程化”的一项：仓库自带 AI 协作协议、决策分级、逐版本 changelog 与提交署名，能把“玩家反馈后期卡顿 → Web Worker 重构 → 旧存档自动迁移”串成一条可复述的返工链。适合回答“中文个人作者怎样用 AI 长期维护一款有真实玩家的游戏”，也适合借它的旧存档迁移与主线程拆分做法。
- **缺口**：仓库未见 LICENSE（代码/资产许可未知）；TapTap 旧入口 app/800521 已 404，清单记的“8.7 分/391 条评价、3.5 万预约”本次未能复核；作者知乎原文 403，AI 分工的逐项比例只有转述；本机未玩，帧率与存档迁移未实测；无第三方复核。

#### 9.3.3 Permit Pending（免费浏览器城建，AI 写几乎全部代码）

- **可玩入口**：<https://permit.petercai.com/>（本次 200；页面 JSON-LD 标明 free、Web browser、author Peter Cai）。Hacker News「Show HN: SimCity, but with Permits」item 50170593（2026-10-20，941 分，评论数百条，作者 `pcai`；正文经 <https://hn.algolia.com/api/v1/items/50170593> 读取）。
- **作者与制作过程**：作者 Peter Cai（页面 JSON-LD）在 HN 50202645 自述 “almost all claude, with me focused on gameplay, art direction, mechanics, and storytelling”，并说 Claude 有时让他更早发现“idea was too fuzzy”；50176060 记录他最初按“不隐藏复杂度”的最大化方向打磨细节，试玩后发现“逐步分层/揭示深度”更容易让玩家投入，于是改为渐进揭示；50173599 记录先用一批预写故事弧保证多样性、后为具体城市定制故事时把故事弧回填进引擎。没有独立作者长文与开发时长。
- **AI / 人分工**：AI 写几乎全部代码；人负责玩法方向、美术方向、机制与叙事（50202645），没有逐项代码占比。
- **版本与日期**：2026-10-20 上线（Show HN 同日）；作者在 50202272（10-22）说“fixed some of these road issues in the latest release”，但没有版本号或 release notes 页面，版本只能按 HN 回复时间定位。
- **一次具体二改（两条都可复述，玩家原话可对）**：(1) 玩家 zamadatix（50171235）报加载城市后画面变黑，贴出 WebGL 内存分配失败报错；作者 50173404（10-20）回“the game tried to allocate too much memory. I got claude to fall back to lower resolution textures when this happens, thanks for reporting”——这是“运行时资源崩溃 → 降级回退”的修复，不是只改一行报错；(2) 玩家 noduerme（50189362）列出道路/分区问题，作者 50202272（10-22）回“I fixed some of these road issues in the latest release, and added those zone overlays that were missing. Still ironing out bugs…”，改动进入当前可玩版本。
- **作者静态截图**：<https://permit.petercai.com/marketing/feature-economy.webp>（官方页面功能图：游戏内 History 窗口与城市画面；本次打开 200、image/webp、1,670,064 字节、1800×1160，目视确认为游戏内界面；不是商店 capsule）。页面 og:image 是 <https://permit.petercai.com/marketing/og.png>（1200×630、1,863,724 字节），不是 hero.webp。
- **为什么最值得先挖**：它给出“AI 写几乎全部代码后，人到底还做什么”的干净一句话分工，并且两次修复分别覆盖“运行时崩溃的降级路径”和“玩家列出的系统性缺陷”，比单纯的功能增补更接近本卡要的发布后返工能力。
- **缺口**：无版本号/release notes；代码/资产许可与总成本未知；428 条评论未逐条读；无独立作者长文/开发时长；第三方复核缺失；本机未玩，玩法/帧率/存档未验。

### 9.4 本轮第一备选（乙级，22 项）

这些条目已接近门槛，但按硬条件或并列优先序仍差一步。每项写清“比 9.3 少什么”，不把“许可与成本未披露”单独当降级理由（§2 允许未知写未知）。

1. **SimDrive** — <https://simdrive.xyz/>。手机当手柄的浏览器赛车；Show HN 2026-04-29（item 47954074，21 分，作者 1000xcat；正文经 <https://hn.algolia.com/api/v1/items/47954074> 读取）；页面带 Vibe Jam 2026 widget，vibej.am 2026 规则写明“至少 90% 代码由 AI 写”且参赛数据含 simdrive.xyz。发布后 4-29 至 5-08 作者在帖内连续回复并给出已上线修复：粉树改掉、加横屏提示、把“电脑主屏＋手机手柄”说明改清楚、修一个上线约一天才被朋友发现的回归、Safari 体感权限改为显式按钮。免费浏览器可玩，静态海报 <https://simdrive.xyz/simdrive_poster.png>（200）。**比通过项少**：AI/人分工只有 jam 资格推定、无作者量化；无版本号；样本小；本机未玩。

2. **Choicer Voicer** — <https://dev.to/cherry_yan_871261020c032a/i-got-tired-of-hunting-for-choicer-voice-packs-so-i-vibe-coded-my-own-game-200k-people-played-it-4000>。作者原文 2026-08-26 称写代码时大量用 AI，游戏已 20 万+玩家；玩家要求更多语音包、重试、分数比较与排行，作者加入导演/观众反应与按分数称号，并在评论补充每个包有 Top 100 排行；可玩 <https://choicervoicer.org/>（200）。**比通过项少**：AI 占比/工具未量化；更新是否已进当前版本需核；无版本号。

3. **Coro Solto: Treta Suprema** — <https://www.corosolto.com.br/>。巴西浏览器 FPS，README 明写由 Claude/Kimi/Codex/GLM 等 agent 生成且每个 commit 标 Agent，AGPL-3.0；v2.1.0-alpha.134→137（11-01～11-03）连续发版；issue #1171“反馈来自 Gustavo：TRETA$ 经济、背心、闪光弹”把具名玩家反馈并入改动（<https://github.com/corosolto/client/issues/1171>）。**比通过项少**：多数 issue 仍是内部自测/CI，玩家样本未量化；alpha 版本号不等同对外发布版本；本机未玩。

4. **Snake: Gridbreaker** — <https://store.steampowered.com/app/4828340/>。Steam 抢先体验 2026-11-03，商店 AI 披露写明生成式 AI 参与编程、本地化、UI、图标与美术且逐项由作者审改；11-06 首个上线后补丁 0.5.1 开头写 “several fixes based on early feedback”，含风险合约付不起仍可接受、引导/剧情可读性、秘密房与奖励边界（<https://store.steampowered.com/news/app/4828340/view/1848664643345406>）。**比通过项少**：AI 只是“开发工具之一”，未量化占比；上线时仅 1 条评测；补丁未点名具体玩家报告。

5. **Hiraeth** — <https://hiraeth.my/>。Opus 5.5＋Astra＋Tripo/Midjourney/Suno 制作的 Moebius 风浏览器动作冒险，作者公开视觉 changelog 从 0.1（10-01）到 2.45（11-03）共 242 条；11-03 的 Reddit 原帖（<https://www.reddit.com/r/aigamedev/comments/1xn2rp5/>）下玩家实报 0.5fps、首启卡顿、键鼠被浏览器截获、脚步音难听与谜题卡住。**比通过项少**：changelog 未逐条标注来自玩家；帖子之后无新版本；Reddit 正文经归档 API 读，评论未逐条。

6. **NeoMud** — <https://github.com/roomsmith-games/NeoMud>（入口 <https://neomud.app/>）。自称 100% vibe-coded 的 Kotlin/Android MUD，MIT，v1.0.0（05-14）→v1.2.0（06-12）；6–7 月一批 playtest issue（多人 HP 不同步 #485、1 级法师过弱 #468、战利品不自动拾取 #467 等）多在同日关闭，是发布后按试玩反馈修的窄样本。**比通过项少**：7-18 后停更；测试者是作者家人三人（两名侄子＋女儿）的 co-op beta，不是外部玩家；issue 标签 `playtest` 的 description 写 “Found during AI playtest session”，与 #485–496 正文的三人 co-op 是两回事，真人外部玩家闭环待补。

7. **CRETA: Taskbar Fishing** — <https://store.steampowered.com/app/5064260/CRETA_Taskbar_Fishing/>。PrensCin 自述完全不会编程、由 AI 把想法变成代码，2026-10-06 Steam 1.0；2026-09-01 公告 “Thank You to Our Beta Testers” 逐项列 beta 测试者反馈带来的修复（钓鱼动画/时序、卡牌持久化、Prestige Reset、Card Forge、存档安全、希腊语本地化等）。**比通过项少**：反馈发生在发布前 beta，不是发布后玩家闭环；无发布后补丁记录。

8. **妹居物语** — <https://store.steampowered.com/app/3963620/>。制作人彩奈程序基础几乎为零，花两天自学 AI、约两个月/七八千元用 Claude 做出首个版本；2025-12-18 开启不删档测试、2026-03-26 限量测试（40 万预约、Demo 期间 DAU 破万），B 站 `space.bilibili.com/130645569` 连载开发日志。好游快爆/下载站记录 2.0.4（2026-04-01）到 2.2.2（2026-04-29）连续修复：存档槽位上传错误、记忆丢失/写入错误存档、跨存档复制、微信小程序多篇日记、UI 与自定义人设兼容，均对应测试期玩家反馈。**比通过项少**：仍是测试/预约阶段而非正式发售；AI 同时承担运行时对话，AI 写代码只有作者访谈口径；版本表来自第三方汇总。

9. **江南第一主播公司** — <https://www.taptap.cn/app/647013>。长沙超神网络/木凳子工作室 3 人团队，2025-01-23 上线，TapTap 预约 10 万、好游快爆 9.4 分；AI 生成立绘（MidJourney）、约 70% 角色故事与弹幕文案（DeepSeek/ChatGPT）、约 80% 物品图（SD+LoRA），代码用 Copilot 辅助。上线后玩家集中批评 PK 30 秒冷却，官方已删除；随后接入基于 DeepSeek 的游戏内聊天与好感度，当前 0.5.7（2026-10-13）仍在修 wecat 聊天、加 28 个主播微信聊天。**比通过项少**：AI 写码只到 Copilot 辅助、核心代码仍人工，按严格“AI 大规模开发”口径是乙级；无逐版本更新日志。

10. **丧尸危机：最后的撤离** — <https://www.taptap.cn/app/951647>。开发者“你干嘛哎呦”（TapTap 制造创作者）2026-09-30 上线测试；玩家打 1 星、批内容太少/太卡/兵种少，作者公开道歉并称“基本一天一个大版本”：10.8 大更新加工兵/爆破/电磁/火焰 4 兵种、搜打撤、角色碎片与 4 个天赋，10.10 开发者日志给出剧情 20 关/4 章，10.12 把编队槽从 4 扩到 6，另有撤离品掉率公开。**比通过项少**：AI 分工只有“TapTap 制造创作者”平台标签，无逐项 AI/人说明；版本号缺失；评价仅 11 条/6.9 分，仍带测试标。

11. **一箭又一箭** — <http://www.youxituoluo.com/534534.html>。广州畅想互动/何毅坤，微信小游戏，从立项到首版上线约一周；AI 包办关卡评分、生成、编辑器和难度排序。玩家反馈后期“越玩越简单”→难度从 3 级扩到 5 级并提高困难关出现频率，社区要更爽→加架势条/连击与处决反馈，玩家爱分享极限过关→加动态时间限制；游戏内问卷持续收集需求，团队称 A/B 对留存和 ARPU 有提升。**比通过项少**：AI 做的是关卡内容而非代码；上线日期、版本号和可玩入口未披露。

12. **翻面：FLIPSIDE** — <https://www.taptap.cn/app/1000462>。Mark-Pan 工作室、作者 @s-1mple-_，文科生“不会写代码也不会画画”，0 代码 0 美术靠 AI 完成，2026-10-27 上线 TapTap（8.2 分/60 条评价，热度 9680），B 站制作分享视频约 30 万人围观；作者称仍在打磨地图、枪械、切刀动作并向玩家征集“哪些瞬间有趣/哪些不舒服”。**比通过项少**：尚未找到发布后补丁或更新记录，不能证明玩家反馈已进版本。

13. **后日时光** — <https://www.bilibili.com/video/BV1Hvu46iEVL/>。B 站 UP“玩游戏做游戏的老刘”，40 多岁失业后自学，改用 Codex Agent + Godot，自述人机分工约 5:95（人做创意与质量把控，AI 做约 95%）；Steam 新品节 Demo 首周近 3000 愿望单，从约 4200 款游戏中突围。**比通过项少**：目前只有 Demo，无正式上线与发布后补丁，未达“发布后返工”门槛。

14. **无限弹球（无限弹球复盘）** — <https://iceprosurface.com/thought/building-a-game-with-ai/>，游戏入口 <https://www.taptap.cn/app/879324>。2026-08-05 作者复盘：两人 3 周做出 TapTap 游戏（8.8 分/64 评，7-02 上线、7-22 最后更新），逐条写上线后五类 bug、按问题类型归档玩家反馈、修复后存压力存档、帧预算/规则预算、GDScript 纯计算比 C# 慢 270–480 倍；app 页最新 0.4。**比通过项少**：版本号只到 0.4；AI 写码比例只有博客口径；许可/成本未知。

15. **Growing City（Растущий город）** — <https://dev.to/andrew_perepechay_ee25378/i-launched-an-ai-built-board-game-heres-what-happened-next-504h>。Andrew Perepechay 自述非开发者，3 天用 AI 做浏览器经济桌游；2026-07-02 复盘写真实用户在不同屏幕/浏览器上布局错位后改自适应布局、玩家 SHAM 指出“连续买紫卡”规则缺失后修规则、机器人改为对局内事件发言。清单另记 7-04/7-05/7-18/7-21 有 i18n、按统计改平衡、单日重做移动端的更新（未直读，来源为清单；游戏站 <https://rastushiy-gorod.ru> 本机 TLS 不通，未能核到对应 changelog 页），这些日期不在 2026-07-02 复盘正文内。**比通过项少**：可玩站与上述更新记录未直读；未点名 AI 工具；无版本号。

16. **Void Parry** — <https://dev.to/nightdrivelabs/a-game-portal-told-me-ai-art-gets-rejected-so-i-redrew-15-bosses-in-canvas-code-5c2l>。Nightdrive Labs 2026-09-29 原文：代码由 AI coding assistant 写，原 boss/背景/主视觉用图像模型生成；游戏门户认证警告“AI for code/logic is welcome, but titles with raw AI graphics are rarely approved”（称这类游戏指标差 2 倍以上），作者一晚把 15 个 boss 全改成 Canvas 2D 程序化线稿并加状态反应；Playgama 可玩页 200（167 played）。**比通过项少**：属平台发布可用性驱动的返工，不是直接玩家留言；无版本号。

17. **Scarred Steel** — <https://store.steampowered.com/app/3952140/>。无编程经验的 Ethan Clarke 用 32 篇 AI Devlog 记录以 Cursor/AI 资产做完整战术 RPG，2026-03-15 发售后 3-20、3-25 两次补丁，其中 3-20 清理存档读写并修背包清空问题（原文：Cleaned up saving and loading function；Fixed various issues with inventory clearing）。**比通过项少**：补丁可核，但未找到“由玩家报告触发”的原文；AI 资产/代码占比未量化。

18. **丧尸求生（B 站 toy，小面包 Cat 大王）** — <https://www.bilibili.com/toy/zombie-survivor/index.html>。DeepSeek V4 Flash＋Claude Code＋Godot 做的搜打撤丧尸射击；第二支视频 BV1aKt66BEaf（109 亿 token）按上期观众反馈逐条列出新版本：幸存者营地、武器配件、搜打撤、三存档与手机版，线上页可直接开玩（构建号 v29920）。**比通过项少**：反馈来自视频观众而非游戏内玩家；版本号是构建号；未核评论原文。

19. **异星祭坛** — <https://www.taptap.cn/app/882398>。RobinsLu 一周内只用 AI 做出、全程序化生成视听内容的 3D 卡牌，B 站 BV1WLMG6FEKv 记录制作过程；TapTap 页 89 条评价/9.0 分、上线于 2026-07-10、页面更新于 2026-07-17（JSON-LD datePublished 2026-07-10T02:54Z、dateModified/upDate 2026-07-17T07:17Z）。**比通过项少**：发布后二改记录尚未核实；AI/人分工只有“一周内只用 AI”一句。

20. **Velmoxia** — <https://velmoxia.com/en/games/?s=dev>（本机请求 302 跳到站内英文首页，抓到的 HTML 内无 dev.to 链接）。清单称作者有 dev.to 长文记录开发者社区反馈（页面被缓存 31 天、只有全屏才计一次打开）转成线上修复：加 service worker 每次重校验、改为首次点击/按键计数并补回归用例，站内现称 97 款小游戏；本轮未找到该长文的精确 URL，上述均为清单转述、未直读，不能当作已读的作者原文。**比通过项少**：作者原文链接缺失、修复内容未核；AI 参与开发的程度未量化；修复来自开发者社区而非玩家；无版本号。

21. **Max Every Skills（Roblox）** — <https://www.roblox.com/games/97002479703204/Max-Every-Skills>。Roblox 技能 RPG，作者明说代码/美术/音频/文本都用生成式 AI，原帖征求“首几分钟与技能节奏”的玩家反馈并称会持续改进（<https://www.reddit.com/r/aigamedev/comments/1xhzjkz/>）。**比通过项少**：尚未核到具体玩家报告→修复条目，只有作者意向。

22. **Spell Cascade 的 143 次 Quality Loop** — <https://qiita.com/yurukusa/items/be7602ed68788bb0bd3f>。作者记录 itch.io 浏览器游戏从 v0.3.4 到 v0.8.3 的 143 次单点改进（ClaudeCode 标签），每条“做一个改动→量化→再测”，是发布后连续迭代的强流程样本。**比通过项少**：文章明确没有玩家反馈/报障驱动，属自测质量环，按本卡门槛只能当机制参考。

### 9.5 其余游戏作品与线索

**同作品双入口（不另计）**：Snake: Gridbreaker 的第二个 Steam 入口 <https://store.steampowered.com/app/4828340/Snake_Gridbreaker/>；NeoMud 的站点入口 <https://neomud.app/>；Battle for Wesnoth 与 OpenRA 的可玩页 <https://rosebud.ai/play/battle-for-wesnoth>、<https://rosebud.ai/play/ra-multiplayer-2>。以下分两组，组内按清单原序排列，不代表优先级；每行保留原始链接与清单理由，缺口写在理由内。

#### 9.5.1 有发布/更新/反馈线索、但未达门槛（48 项）

| # | 作品 | 原始链接 | 清单理由 |
|---|---|---|---|
| 1 | ARRR（Pirate MMO） | <https://play.arrr.fun/> | AI 开发规模最大的新线索。HN 2026-07-10（48865667，19 分，链 Reddit）作者 m0dE 回帖称“entire game is pretty much built using Claude Code”：程序化世界/物品/船/多人系统全由 Claude Code 写，整包仅 5MB、无图片/模型/音频资产，支持 250 人，免费浏览器。缺口：登录 indie.fun 才能进入，本机无法验证可玩；未找到发布后补丁或玩家反馈→版本的公开记录，因此只作“AI 全代码 MMO”上限样本，不计闭环。 |
| 2 | The Long Silence | <https://github.com/achimala/TheLongSilence> | GitHub 头部覆盖新发现：522 星，仓库描述“A space exploration game built by Claude Opus 5”，浏览器 WebGL2，星系/行星/星云/残骸全程序化 + 手写 GLSL，仅地面材质/石块/树叶由图像模型与 Blender 经 tools/ 生成；README 还给出 17 条交互断言、逐场景截图/帧率、review set 等验证脚本，是 AI 大规模开发的强证据。缺口：README 只给 localhost 运行方式，未找到托管可玩入口、release 或玩家 issue，无发布后闭环，只作能力上限与“AI 项目自带验证工具”线索。 |
| 3 | space zero（0.space） | <https://news.ycombinator.com/item?id=43726058> | 作者 stevekwon211 2025-02-19 首发 AI-native 3D 浏览器世界原型，评论区要求免登录与更多玩法；2025-04-18 原帖称按约 100 条 HN 反馈重写，加 guest mode、无尽地形、活系统、V 键视角切换、type-anything crafting，同帖玩家报跳跃时仍有走路音、作者回复已去掉空中走路音。站点本机 ECONNRESET/SSL EOF，当前可玩性未核。 |
| 4 | Padlock | <https://spin.atomicobject.com/ai-product-launch-shipping/> | Kyle Harris 2026-04-23 复盘：AI 作为辅助做出每日解谜游戏，上线首周约 50 DAU；玩家评论/短信/代码建议促成应用内“提交谜题代码”入口和后台审核，朋友问“我是不是今天最快”促成计时器与成绩追踪；playpadlock.com 200。缺口：AI 规模不足、玩家样本小。 |
| 5 | Ave Molech | <https://www.michaelghurston.com/2026/05/from-tabletop-rpg-to-browser-game-how-i-vibe-coded-a-dungeon-crawler-in-a-week/> | Michael G. Hurston 2026-05-16 原文：Claude 出设计与架构、Claude Code 写代码、Gemini 生成立绘/场景，约 12 小时做出可玩 Wizardry 式地牢；5-22 更新把 3 层扩到 16 区、6 职业、3 手动存档+自动存档与云存档。缺口：没有玩家反馈驱动的具体二改，属发布后扩内容；avemolech.vercel.app 本机 TLS 不通。 |
| 6 | Dinomino | <https://dev.to/yasin_emreakmak_1920928/i-built-a-3d-game-for-my-little-cousin-with-ai-its-now-on-the-app-store-pa9> | Yasin Emre Çakmak 2026-10-10 原文：非游戏开发者用 AI/vibe coding 做 3D 恐龙经营，已上 App Store/Google Play；真实测试者（小表弟）30 秒内暴露“摇杆挡住商店按钮”“恐龙浮空”等体验问题。缺口：未给出已发布修复/版本，证据停在测试观察；App Store 页 200。 |
| 7 | 江湖余生（TapTap） | <https://www.taptap.cn/app/910135> | TapTap 制造 AI 产出只到“简单点击框架”，作者不会编程、充值大几百后仍缺 NPC/宗门/论剑，账户倒欠 3 万多积分，明说不再更新修复（taptap.cn/moment/839798475485874050）；AI 游戏成本与平台积分约束反例。 |
| 8 | Azure Flame Dungeon (DUNG: Azure Flame) | <https://yurukusa.itch.io/azure-flame-dungeon> | Spell Cascade 同作者在 Qiita 关联文《非エンジニアがPython+Pygameでローグライクを作った全記録》里公开的另一款作品：非工程师用 Claude Code 写出约 1.5–2.2 万行 Python/Pygame 地牢 RPG，已在 itch/Gumroad/BOOTH 以 2 美元发售，可补同作者第二条 AI 全流程与版本记录。 |
| 9 | Rap Battle (Make a Beat) | <https://make-a-beat.com/rap-battle/> | ARRR 轮播页直链的《Vibe Loaded Games》名单成员：Claude/Codex 构建的实时人声评分说唱对战，2026-01-14 上线并获 Product Hunt 日榜第二，名单称其上线数月仍在持续更新。 |
| 10 | Tetra Troopers | <https://tetra-jet.vercel.app/> | 同名单的 Tetris×塔防混合，标注 Built with Antigravity 且被列为上线数月仍更新；本机 tetra-jet.vercel.app 直连 000，原页未读，只能先按名单描述建候选。 |
| 11 | Mana Blade | <https://manablade.com/> | ARRR 同篇《The Weekend MMO》四款 AI-native MMO 之一：作者自建 VoidCore WebGPU 渲染器、约 250 个独立动画角色全由 AI 生成，浏览器免费可玩且仍标 in development，可追上线后的引擎与性能修补。 |
| 12 | TAKEN (Voidmode Games) | <https://www.taken-game.com/> | 《Built in Public》名单中的浏览器 UFO 恐怖游戏：VOIDMODE 作者用 Claude Code＋Codex 双 agent 加自建交通管制工具并行开发、Suno 做音乐，现 pre-alpha 免费 demo＋£9.99 预购，制作过程与后续版本可追。 |
| 13 | GRAVECRAWL | <https://www.gravecrawl.com/> | 同名单的四人合作哥特生存 ARPG：四职业、波次与电影化 Boss、浏览器可玩，程序化地牢生成器用 Claude Fable 5 构建，适合追合作平衡与发布后修订。 |
| 14 | Hollow Night | <https://playgama.ai/play/qwpaherohe> | Void Parry 作者用同一代码库和构建开关发布的万圣节衍生作，标题、5 个新 Boss、商店与存档前缀均不同，正文公开构建脚本与替换校验，可作“同作者第二款已发布作品”对照；无玩家反馈记录。 |
| 15 | MIDWAY 1942: Air Strike | <https://ihca.cn/midway/> | 同作者另一款可玩 WebGL2 空战，索引条目给出 2026-09-30 的 CC BY / CC BY-NC 资产许可与迭代开发记录，补上代码/资产许可分界；同样没有发布后玩家反馈证据。 |
| 16 | Last Beacon / 最后的灯塔 | <https://last-beacon.pjstack.dev> | CREATION.md（<https://github.com/stackloomdev/last-beacon/blob/main/docs/CREATION.md>，本次 200、6,695 字节）记录三轮带日期的真实迭代（09-25 Three.js 三维重制、09-29 全屏光束与夜战、09-29 写实画面），每轮列出截图检查后修掉的具体问题并保留 2D 回退，驱动来自创作者要求而非外部玩家。 |
| 17 | Yu-Gi-Oh! Ruins Duel | <https://www.bilibili.com/toy/astral-duel-game/index.html> | B 站 Toy 已发布页加 2026-10-26 更新分支/预览，新增遗迹大厅、四章十二试炼与墓地控件并通过 200+5 项测试；但正式页仍保留旧版待审核，模型归因和第三方卡图权利也未确认。 |
| 18 | Pocket Aces | <https://github.com/achimala/pocket-aces> | The Long Silence 同作者的另一款完整浏览器卡牌 roguelike，带 DESIGN.md、151 个 Pip 内容包、测试与 ip-audit，可核其提交是否含发布后修订；README 只给本地运行/自行部署，没有公开可玩入口。 |
| 19 | Discretionary Review（housing.over.pizza） | <https://housing.over.pizza/> | 《Permit Pending》HN 评论区直接链出的同类浏览器城建游戏（HN 50036864，201 条评论），可补同一 Show HN 圈的发布后反馈样本；AI 参与度仅见评论以 Claude 口吻调侃，需核作者原话。 |
| 20 | LlamaTale | <https://github.com/neph1/LlamaTale> | 追 NeoMud 的 AI MUD 生态找到的 LLM 驱动 MUD，作者自述 vibe coded，仓库 1,675 commits 且持续发版，发布后迭代证据比 NeoMud 更连续。 |
| 21 | 二次元氪金模拟器 | <https://www.taptap.cn/app/352583> | 《江南第一主播公司》同厂（超神网络/木凳子）前作，TapTap 开发者说明写明程序/文案用 ChatGPT、美术用 MidJourney，并有续作与版本记录，适合追同一团队 AI 制作链。 |
| 22 | 箭头快跑呀 | <https://juejin.cn/post/7669058712007147539> | 单人 + AI（Cursor/Claude，AI 生成全部美术）上线的微信小游戏，作者给出三主题 30 关、运营后台和版本迭代闭环；实际发布后玩家反馈改动待核。 |
| 23 | 今天也元气满满（TapTap 制造） | <https://www.taptap.cn/app/841518> | 与《小小史莱姆》同在 TapTap 制造上的克苏鲁职场文字游戏，作者资源申请帖明确记录 v1.0→v1.2 按周更新、v1.3 核心系统已实装，页面 176 条评价 9.4，是本批同平台发布后迭代链最完整的作品。 |
| 24 | 王朝崛起（TapTap 制造） | <https://www.taptap.cn/app/844838> | TapTap 制造单人 2D 沙盒骑砍，页面 7.7 分、作者自述“很多人因为 bug 多打差评”并承诺“你报一个，他修一个”持续修 bug，是玩家差评→返工的直接线索（尚未见具体补丁条目）。 |
| 25 | 战术蹲坑（TapTap 制造） | <https://www.taptap.cn/moment/804110762665575951> | TapTap 制造上的大战场小队指挥新作，发布帖展示微操小队与呼叫轰炸玩法，可补同平台“新作发布入口”，但版本号与玩家反馈未披露。 |
| 26 | 世界推演：反应 | <https://www.taptap.cn/app/984268> | 页面明确标注“本游戏内含有使用 AI 生成的游戏资产”，2026-10-19 上线后 10-21 就发 1.1.4 修长时游玩与电场多物体卡顿，29 条评价 7.9，AI 披露与短周期返工两项齐全。 |
| 27 | Battle for Wesnoth 浏览器移植（Rosebud，amnesiac agents） | <https://rosebud.ai/engineering/porting-wesnoth-with-amnesiac-agents> | Rosebud 团队用 AI 代理把约百万行 C++ 的 Battle for Wesnoth 移植到 WebAssembly，复盘了上下文遗忘、约三分之一构建参数被重复尝试和“实验状态保存”框架；与输入 8 的 LLM 移植同题，但无发布后玩家反馈。 |
| 28 | OpenRA 浏览器移植（Rosebud） | <https://rosebud.ai/engineering/porting-openra-to-the-browser> | 同团队把 20 年历史的 C#/.NET RTS 引擎 OpenRA 编译到 WebAssembly，已有可玩页 rosebud.ai/play/ra-multiplayer-2，文中未描述 AI 用法，可作同团队移植做法对照。 |
| 29 | GZDoom 浏览器移植（Rosebud） | <https://rosebud.ai/engineering/gzdoom-in-the-browser> | OpenRA 文末引出的同系列复盘：AI agents 完成 GZDoom 的 WebGL/ZScript/音频移植，可玩入口 rosebud.ai/play/gzdoom，文中未给版本节奏与玩家反馈。 |
| 30 | The Vibe Metaverse v2 | <https://www.thevibemetaverse.com/> | vibej.am API 的 both=games 只返回这一款（2025、2026 两届均提交且 is_up 均为 true），页面自标 v2，是这批线索里最直接的“发布后跨年继续改版”证据。 |
| 31 | 泡泡坦克大作战 / Toon Tank Arena | <https://toon-tank-arena.jay6697117.deno.net/> | awesome-gpt-6-astra 索引 issue #52 记载“Astra Pro 做首版、Codex 做后续改进”，页面本机实测可打开，有首版→后续改进的两段式记录。 |
| 32 | MOXstrike | <https://www.moxride.com/home/moxstrike> | 同团队 Moxazza 另有 MoxRide，issue #131 报告作者用 Astra 迭代编码、测试与打磨这款 3D 射击，可对照同作者两款作品的做法。 |
| 33 | 准点下班，别被发现 / Clock Out Unseen | <https://www.bilibili.com/toy/clockout-unseen/index.html> | B 站 toy，索引与仓库 DEVELOPMENT.md 记录碰撞、视线、玩法设计的迭代式开发，可与现有 5 个 B 站 toy 并列核对作者与版本。 |
| 34 | collisio.club | <https://www.collisio.club/game> | SimDrive 的 HN 评论区被拿来对照的“手机当手柄 + 浏览器赛车”前作，同机制可做发布后修订对照；AI 参与未获证据。 |
| 35 | PaperRoute | <https://www.paperroute.lol/play/> | 索引称作者 devlog 记录 Blender 建模与迭代，页面本机可玩（排行榜/周赛机制），发布后修订证据仍待补。 |
| 36 | Overdrive Breakout / 超载突围 | <https://store.steampowered.com/app/3742920/Overdrive_Breakout/> | AWeekGame 单人作品，Steam 商店页 AI 披露明确写生成式 AI 参与代码、音效、音乐、美术与翻译；2026-05-29 上线后 06-08 补丁写『Thank you for your feedback』并改控制与 UI；06-01 仅补第三方许可，无玩法改动。B站 BV1vZGk62EsU 是作者自述制作过程。 |
| 37 | 无限弹球（TapTap，输入博客里的实际作品） | <https://www.taptap.cn/app/879324> | 输入博客《拿 AI 写了个游戏谈谈心得》正文链到的游戏原页：2026-07-02 上线、7 月 22 日已更到 0.4，作者在同一篇里逐类复盘玩家报告的无限连锁、对象复用串状态、销毁/奖励时点、动画影响结算与发布包丢资源，并把修复写进可玩版本，是这组里最接近“发布后返工”闭环的新候选。 |
| 38 | Primus | <https://store.steampowered.com/app/4546430/> | 从种子《Scarred Steel》的同一开发者/发行 Stone & Steel（Ethan Clarke）追到；商店 AI 披露写明视觉、音频、代码全部由 AI 辅助，2026-08-12 发售后 2026-09-13 补丁称按 feedback 增加分辨率/窗口选项并修 UI，是同一作者第二款可核的发布后返工作品。 |
| 39 | Rogue Memory | <https://quantumcodemonk.itch.io/rogue-memory> | 从《Azure Flame》参加的 AI Browser Game Jam 条目列表追到；页面写“Created entirely using Claude AI”，AI 披露含 Code/Graphics/Sounds，并列出 v1.2.4→v1.3 的移动端可玩性、代码重构与难度改动（上轮只记为 itch 不可达，未列候选）。 |
| 40 | 6-bit Vanguard (Star Overlord 4.0) | <https://battle-of-the-moon.itch.io/6-bit-vanguard> | 同一 AI Browser Game Jam 总榜并列第 1（AI Usage 第 2）；标题里的 4.0 与 jam 评分说明它是持续版本化的 AI 参赛作，值得补读其 itch 开发记确认发布后改动。 |
| 41 | Spinlings | <https://github.com/416rehman/spinlings> | Claude Code 内运行的卡牌对战游戏，CHANGELOG 连续记录 0.2.9→0.2.16 及 2026-10-22 服务端/网站更新，含市场、图鉴、对战等玩家可见改动。 |
| 42 | SnekromancY | <https://store.steampowered.com/app/4314770/> | 与 Snake: Gridbreaker 同属 Steam“Rogue Snake”捆绑包、2026-07-29 上线，作为同类蛇形 roguelite 可核其 AI 参与和补丁记录（Steam 页当前未见 AI 披露）。 |
| 43 | 撒币之旅（TapTap） | <https://www.taptap.cn/app/887975> | 批内《意识溢出》同开发者 Ray 工作室的另一款（9.1 分/41 评），页面 8/12 更新明确写优化成长曲线、加怪与爆发玩法、修黑屏 bug，并承诺论坛反馈两天内修。 |
| 44 | 恐怖直播：魔都怪谈实录（TapTap） | <https://www.taptap.cn/app/876938> | 同为 Ray 工作室（8.1 分/83 评），但页面同时显示最新评价分只有 2.0，是可直接追“发布后某版本口碑回落→返工”的候选。 |
| 45 | 铁骑镇魂曲（TapTap） | <https://www.taptap.cn/app/868246> | 批内《王朝崛起》同开发者大飞馕的另一款机甲清版（9.2 分/14 评），页面有面向先遣测试玩家的长开发说明并公开征集早期反馈。 |
| 46 | 开局一只蚁（TapTap） | <https://www.taptap.cn/app/954053> | 批内《文明涌现：主不在乎》同开发者单纯鱼工作室的另一款（8.8 分/26 评，页面更新到 2026-10-02），用于核该工作室是否每款都按评价迭代。 |
| 47 | majidmanzarpour/threejs-procedural-dungeon (Dungeon Forge) | <https://github.com/majidmanzarpour/threejs-procedural-dungeon> | 同作者的确定性种子地牢生成器可玩演示，是该技能生态里可直接打开的成品样本；只有可玩页与仓库，未见发布后补丁记录。 |
| 48 | RIPCORE — Arena Battler | <https://ripcore.netlify.app/> | 批内 threejs-game-skills README 列出的五个可玩演示之一（同组还有 Neon Ridge Drift/Snooker/Starship Dogfight/Tide Singer），是该技能的直接产出；只有可玩页，未见更新日志。 |

#### 9.5.2 AI 开发规模或入口证据较强、但发布后闭环不足（14 项）

| # | 作品 | 原始链接 | 清单理由 |
|---|---|---|---|
| 1 | UK Farming Simulator | <https://butterbean.farm/> | 10-29 Show HN 后玩家贴出 shader link 错误，作者同日回“Should be fixed now”并承诺重做加载与性能（news.ycombinator.com/item?id=50287255）。缺口：AI 使用只有评论者“又一个 Claude 游戏/用 LLM 做的”判断，作者未确认，只作低置信线索。 |
| 2 | Babylonian Twins：LLM 读 68000 汇编把 1993 Amiga 游戏移植到 Godot | <https://babyloniantwins.com/blog/porting-a-1993-amiga-game-to-godot/> | 2026-09-01（HN 09-03，381 分/133 评）：原作者用 Claude Fable 5 一个晚上得到可跑移植，再用几个周末调手感并发行；有 1993 原盘、2010 手工移植和 2026 新版可对照，是“LLM 读旧汇编→真游戏上架”的完整一手样本（未玩）。 |
| 3 | SANDLINE / 沙线行动 | <https://ihca.cn/sandline/> | 中文作者“一海千寻的 AI 实验室”的可玩 Three.js 战术 FPS，公开 DEVLOG 逐条记录移动端瞄准丢手势、Bot 对撞死锁、爆炸粒子上限等修复，索引条目称 Codex 多轮迭代开发；devlog 是工程记录而非玩家闭环。 |
| 4 | AIMUD | <https://github.com/Ghost-Programmer/aimud> | 同一 AI MUD 线索上的 Spring Boot/Angular 项目，作者长文列出 Junie/Gemini/Copilot/Anti-Gravity 多代理分工，仓库 403 commits，可核 AI 与人工边界。 |
| 5 | Moonlight & Mayhem（Raccoon Heist，Codex + GPT-5.6 Sol Ultra） | <https://github.com/simonw/raccoon-heist-codex> | 与 linux.do 种子同用 GPT-5.6 Sol 的完整生成游戏，仓库附提示词和转录，作者记录两轮追问修复浣熊眼球 bug，属可核的生成后二改。 |
| 6 | 根本难不倒我 | <https://www.7k7k.com/wxgame/14413.htm> | 《一箭又一箭》演讲明确把它的彩色箭头机制与用户视角调优作为前作来源，17173 复盘记录取消“点错 3 次失败”、微信 AB 测试调难度等改动；该作本身 AI 参与度待核。 |
| 7 | 少女终焉契约（TapTap 制造） | <https://www.taptap.cn/app/854568> | TapTap 制造放置 RPG，9.2 分；作者在上线约一周的帖子里称这一周主要在做新玩法、交流群活跃但缺曝光，可作“上线一周内加内容”的样本。 |
| 8 | 下班后的晚餐 | <https://www.taptap.cn/moment/856801821857940925> | 三人零基础小队日志明确写“生成全流程 AI 美术参考，交给美术拉磨”，并区分 AI 参考图与手绘成品；尚未发布，只能作 AI 与人工分工边界的样本。 |
| 9 | 文明涌现：主不在乎 | <https://www.taptap.cn/app/981439> | 10-18 上线当天发 0.1.3，修返回键/菜单返回、加退出前保存保护、优化后期文明运转性能，89 条评价 7.4；AI 使用未标注，需补核。 |
| 10 | 意识溢出 | <https://www.taptap.cn/app/958061> | 纽约大学 Game Center 学生团队作品，10-21 上线当天发 1.2.0，50 条评价 8.3；AI 使用未标注，仅作聚光灯试玩期的返工样本。 |
| 11 | The Crownless | <https://www.spawn.co/@izkimar/the-crownless/play> | 索引称作者在 Spawn 里边玩边迭代动作 roguelike；页面只到 Spawn 客户端门禁，实机与迭代记录均未读到。 |
| 12 | padlessbox.com | <https://padlessbox.com/> | SimDrive 评论区作者 b4rtaz__ 自荐的同类“手机当手柄”多游戏平台（含 Snake 等），可与 SimDrive 的两屏/单服取舍直接对比；AI 参与未获证据。 |
| 13 | SandPuzzle | <https://garyxuan.github.io/SandPuzzle-client-publish/index.html> | Cocos 论坛《流沙俄罗斯方块》贴内作者 garyxuan 自荐的同类落沙解谜，页面可玩，但未见 AI 制作说明，只作同类对照线索。 |
| 14 | Rosebud: Porting Unciv to the Browser | <https://rosebud.ai/engineering/porting-unciv-to-the-browser> | Rosebud 工程博客索引里与批内 Wesnoth/OpenRA/GZDoom 三篇并列的第四个移植（Unciv/Kotlin→TeaVM，核心只改 10 个文件，附可玩页 /play/unciv-base），同一 amnesiac-agent 方法的新案例。 |

### 9.6 工具、索引、方法与上下文（80 项）＋行业背景/反向样本（15 项，均不计候选）

#### 9.6.1 生产、试玩、发布与引擎工具（46 项）

| # | 工具 | 原始链接 | 清单理由 |
|---|---|---|---|
| 1 | Claude Code Game Studios issue #34（工具） | <https://github.com/Donchitos/Claude-Code-Game-Studios/issues/34> | 35k star 的 AI 游戏工作室模板下，用户追问“有人做出完成可玩的游戏吗”，跟帖有人称 62 个 sprint、188 个 gdscript 仍只是半可玩 pre-MVP——模板产出与“完成游戏”的落差，非游戏候选。 |
| 2 | Claude Code Game Studios issue #46（工具） | <https://github.com/Donchitos/Claude-Code-Game-Studios/issues/46> | 用户抱怨 Max×20 跑近三周只做出几个按钮；跟帖称工具只帮写 GDD/脚本、Unity 里仍要大量手工，另一人称 30% 周配额烧在文档与 agent 沟通——工具真实使用成本，非游戏候选。 |
| 3 | Universal Modder（Claude Code 改任意 PC 游戏） | <https://github.com/rehan-remade/universal-modder> | 2026-09-30 建库、查询时 9,458★（HN 10-01 4 分）：用 Agent Skills + fal MCP + um CLI，让 Claude Code/Codex 自己找游戏、判引擎、读真实代码、做美术/3D/音效、在运行中的游戏里测试并沉淀知识库；是“AI agent 直接改真实发行游戏”这条线近三个月热度最高的新项目，a1dbv 未收（未安装、未跑）。 |
| 4 | Co-op Anything（给任意单机游戏加联机） | <https://github.com/cranebeaker/coop-anything> | 2026-10-16 建库、1,919★：给 agent 一个仓库，让它调研、逆向引擎、做/修联机、用游戏内 bot 自测并打包成一键安装；把“AI 修改已发售游戏 + 自测”做成可复用流程，与 Universal Modder 同属新出现的 agent 改游戏集群（仅 README 核读）。 |
| 5 | OhMyGame（开源一人游戏工作室） | <https://github.com/WhiteTowerAI/ohmygame> | 2026-08-11 建库、1,709★、Apache-2.0，README 称基于 Pi、支持 40+ 模型 provider（BYOK），覆盖“做游戏→多平台发布→变现”的桌面应用；是新的端到端 AI 游戏生产入口，非单点资产生成（未下载、未跑）。 |
| 6 | Genex Desktop（Agent 装引擎、构建并自测） | <https://github.com/genex-games/genex-desktop> | 2026-10-02 建库、798★、MIT：桌面 app 让 agent 自己配置 Unreal/Unity/Godot 或浏览器环境、构建游戏并试玩；正好补 a1dbv 引擎接入页“agent 需要真实引擎验收”的缺口（未装，README 核读）。 |
| 7 | WAI Play（网页游戏 AI 试玩与质量诊断） | <https://github.com/waiterve/wai-play> | 2026-08-04 建库、255★，中文：把游戏 URL（可选 ZIP 源码）交给 agent 在真实浏览器里玩，输出五维评分、可复现问题卡（截图/≤20 秒录像）与修改建议；把“试玩→证据→改法”串成流程，适合验证发布后修复（未部署试用）。 |
| 8 | Ziva AI Game Tester（Godot 自动试玩） | <https://ziva.sh/full-game-tester> | HN 2026-08-28（作者 OsrsNeedsf2P）：AI 先读代码、启动 Godot 游戏、按测试目标逐步操作，最后给 pass/fail 并保存视频；页面标 Pro $50/月、仅 Godot。是“AI 试玩闭环”里少见的按引擎做的产品化入口（未购买、未试）。 |
| 9 | Breakpoint MCP（Godot 确定性试玩，293 工具） | <https://godotengine.org/asset-library/asset/5335> | Godot Asset Library 1.21.0、MIT、2026-11-06 更新：除编辑器/运行时控制外，提供冻结时间、精确帧步进、固定 RNG、状态快照、断言与截图 diff 等确定性试玩能力，280 个高信任工具默认关闭；是 a1dbv 引擎页“Godot 社区 MCP 质量参差”判断的最新反例（未安装）。 |
| 10 | godot-editor-mcp（194 工具/29 类） | <https://pypi.org/project/godot-editor-mcp/> | PyPI 2026.11.4，项目页 hybridindie/godot-mcp：包说明称 194 工具/29 类、默认只开检查类，支持实时编辑器、headless、输入模拟与导出，HTTP 多客户端需 bearer token；可作为 Godot MCP 选型的另一极（包元数据核读，未装未跑，工具数来自项目说明）。 |
| 11 | Godot MCP Toolkit（113 工具，可写自定义工具） | <https://godotengine.org/asset-library/asset/5375> | 1.1.2、MIT、2026-10-29：113 个内置 MCP 工具，可用 GDScript 写自定义工具并热重载、read-only 模式、会话 token、无遥测，启动工具面小再按需展开；适合对上下文预算和权限敏感的团队（未装）。 |
| 12 | VibeGame（prompt→game 多 agent 框架） | <https://github.com/tettethu/VibeGame> | 2026-08-12 建库、367★、Apache-2.0，声称支持 Claude Code/Codex、Phaser 引擎，配“自进化对抗 agent 团队”和技术报告；是研究型多 agent 做游戏的新样本，可对照 a1dbv 的多 agent 章节（未跑、未核实验效果）。 |
| 13 | Noobi.ai（Codex + Godot 生产 agent） | <https://github.com/Innate-Labs/Noobi.ai> | 2026-08-09 建库、256★：本地优先桌面 agent，用 Codex App Server + Godot 4 把一句想法做成“reviewed, playable”的 Web/Godot 游戏；目前是 macOS developer preview，适合观察“生产 agent 内建审查”这一新形态（未装）。 |
| 14 | TapTap 官方 instant-games-open-mcp（含玩家反馈工具） | <https://github.com/taptap/instant-games-open-mcp> | TapTap 官方 MCP（仓库 2025-10-11 建、2026-11-06 仍在推、56★）：文档列出的 `get_debug_feedbacks` 可拉玩家报错、真机日志、玩家截图和指定会话服务端/Lua 日志并落盘，另有构建/提交/资产生成工具；是把“玩家反馈→AI 修”接成可调用入口的渠道独有样本（未接、未跑）。 |
| 15 | Game Decompilation Skill for Claude | <https://github.com/lemiur/Game-Decompilation-Skill-For-Claude> | 2026-10-25 建库、197★：给 Claude 的 byte-matching 反编译 skill；与 artifact 已收的 Popcar 反编译讨论相补——那边是现象，这边是 agent 可执行工具（未跑）。 |
| 16 | debuff（浏览器游戏试玩/调参 MCP） | <https://github.com/debuffjp/debuff> | 游戏 MCP 目录中少见的“把 agent 接到运行中或 headless 的 2D 浏览器游戏上做试玩、状态检查与调参”的服务器，直接对应本卡的发布后返工场景。 |
| 17 | antics-mcp（HTML 游戏发布/联机） | <https://github.com/antics-gg/antics-mcp> | 同一游戏 MCP 目录；把单文件 HTML 游戏发布到带房间、同步状态与排行榜的多人 URL，补“发布上线”而不是只做本地原型。 |
| 18 | Coding-Solo/godot-mcp | <https://github.com/Coding-Solo/godot-mcp> | Godot Asset Library 的 MCP 资产列表与游戏 MCP 目录里星数最高的 Godot MCP（约 13–15 个文件级工具），是本组三个 Godot MCP 的默认对照基线。 |
| 19 | IvanMurzak/Godot-MCP | <https://github.com/IvanMurzak/Godot-MCP> | 同一 Asset Library MCP 列表（asset 5245）里的 C#/.NET 编辑器插件，与 Unity-MCP 共用 MCP/反射栈和云端或自托管后端，补 C# 项目线。 |
| 20 | Beckett（AI MCP for Godot） | <https://github.com/beckettlab/beckett-godot-mcp> | 同一 Asset Library MCP 列表（asset 5296）；反射驱动、保存前校验 GDScript/C#、可撤销/批量场景编辑、审计日志与知识包，分 Lite/Full 版，走“先校验再落盘”路线。 |
| 21 | godot-mcp-pro | <https://github.com/youichi-uda/godot-mcp-pro> | 同一 Asset Library MCP 列表（asset 4961，标 Proprietary）与游戏 MCP 目录；84 个工具覆盖动画、Tilemap、着色器、输入模拟与运行时调试，是该列表里功能面最宽的一档。 |
| 22 | godot-mcp-runtime | <https://github.com/Erodenn/godot-mcp-runtime> | 游戏 MCP 目录；用 UDP 桥接进入正在运行的 Godot 4 游戏做输入、截图、UI 检查与实时 GDScript，属“运行时试玩”型而非编辑器型。 |
| 23 | GoPeak | <https://github.com/HaD0Yun/Gopeak-godot-mcp> | 游戏 MCP 目录；110+ 工具但默认 compact 只暴露 33 个核心工具、其余按动态组加载并分页 tools/list，专门压 MCP 工具的上下文成本。 |
| 24 | IvanMurzak/Unity-MCP | <https://github.com/IvanMurzak/Unity-MCP> | 游戏 MCP 目录星数第二（约 4.6k）；把 AI 接到 Unity 编辑器及 Unity 构建的游戏，与同作者 Godot-MCP 同栈，补 Unity 侧样本。 |
| 25 | CoderGamester/mcp-unity | <https://github.com/CoderGamester/mcp-unity> | 同一游戏 MCP 目录；另一套 Unity 引擎钩子（约 2k stars），可与 Unity-MCP 对照接口范围与维护活跃度。 |
| 26 | @taptap/maker | <https://www.npmjs.com/package/@taptap/maker> | TapTap 官方 instant-games-open-mcp README 指向的 Maker CLI/本地控制台，带项目与 Git 历史、图像/视频/3D 资产画布和本地预览，是 MCP 之下的实际执行层。 |
| 27 | AVP2-Reconstructed | <https://github.com/lemiur/AVP2-Reconstructed> | Game Decompilation Skill 作者的实战目标（Aliens vs Predator 2 重建），可核该 skill 在真实项目里的用法与产出边界。 |
| 28 | Auto Game Builder（Lifecharger） | <https://github.com/Lifecharger/auto-game-builder> | CCGS issue #46 里 Lifecharger 自荐、r/gamedev 评论区也推荐的替代品：保留 CCGS 模板但加了 Claude Code/Gemini/Codex/Aider 多 agent、构建部署与手机端管理，README 说明它就是从 CCGS 裁剪而来。 |
| 29 | OpenCode Game Studios（CCGS 的 OpenCode 重写版） | <https://github.com/striderZA/OpenCodeGameStudios> | 同一 r/gamedev 帖里 Important_Tree7914 给出的 CCGS 重写版，宣称 52 agents、78 skills、78 commands、231 个测试，并支持 OpenCode、Pi、Codex 与 Claude Code，是对“工作室式 agent 配置是否过度”的另一条实现线。 |
| 30 | Couchlink | <https://github.com/cranebeaker/couchlink> | Co-op Anything 同作者的配套工具：同一台 PC 上为每名玩家各跑一份游戏并分屏或分显示器、各给各的手柄键鼠，让 agent 产出的联机 mod 也能客厅同玩。 |
| 31 | Stacklands Co-op | <https://github.com/Dudiebug/stacklands-coop> | Co-op Anything README 的社区作品列表里已可安装的 Stacklands 联机 mod（host 同步、F8 面板、joiner 存档不动），是该 agent 流程真正落成可玩发行物的样本。 |
| 32 | Godlink MCP（tomyud1/godot-mcp） | <https://github.com/tomyud1/godot-mcp> | Godot MCP Pro 对比表列为免费轻量竞品，已上 Godot Asset Store，带工程可视化与撤销，可作 Coding-Solo 之外的替代。 |
| 33 | Dokujaa/Godot-MCP | <https://github.com/Dokujaa/Godot-MCP> | 对比表列为免费 39 工具、TCP Socket 连接，并集成 Meshy API 生成 3D 模型，补“AI 资产生成”路线。 |
| 34 | ee0pdt/Godot-MCP | <https://github.com/ee0pdt/Godot-MCP> | 对比表列为免费 19 工具的插件式双向通信方案，适合只需节点/脚本/场景编辑的轻量用法。 |
| 35 | bradypp/godot-mcp | <https://github.com/bradypp/godot-mcp> | 对比表列为免费 10 工具、MIT、TypeScript，主打精简与只读模式，可作最小权限对照。 |
| 36 | GDAI MCP（3ddelano/gdai-mcp-plugin-godot） | <https://github.com/3ddelano/gdai-mcp-plugin-godot> | Godot MCP Pro 对比表中的 $19 商业竞品，支持自动截图与调试器集成，是付费路线的直接对照。 |
| 37 | Godot MCP Native（yurineko73） | <https://github.com/yurineko73/Godot-MCP-Native> | 纯 GDScript 原生实现、无需 Node，版本 1.0.8，对应 Beckett 对比表里的 embedded/Native 路线。 |
| 38 | godot-mcp-native（Cynnar） | <https://github.com/Cynnar/godot-mcp-native> | 内嵌 Godot 4.5+ 编辑器的原生 MCP server，v0.1.0、零 sidecar，适合 4.6+ 新项目试验。 |
| 39 | CoplayDev/unity-mcp | <https://github.com/CoplayDev/unity-mcp> | SubmitGame 工具清单列的 Unity MCP，可补 Godot 之外 Unity 主引擎的 AI 编辑器控制线。 |
| 40 | IvanMurzak/Unreal-MCP | <https://github.com/IvanMurzak/Unreal-MCP> | 同作者 UE 5.7 版（C++ 插件 + .NET sidecar），补 Unreal 引擎线。 |
| 41 | klyo games MCP | <https://github.com/krastranseu-lang/klyo-games-mcp> | 托管式 MCP，发布 HTML5 游戏并带排行榜与玩家录像，是 antics-mcp 的同类替代。 |
| 42 | deed.page agent skill | <https://github.com/f-o-x11/deed-page-skill> | 一条请求把 HTML5 游戏发布到独立 HTTPS 地址，补 antics/debuff 之外的静态发布链路。 |
| 43 | hi-godot/godot-ai | <https://github.com/hi-godot/godot-ai> | 由 CoplayDev/unity-mcp 作者团队新开源的 Godot MCP（README 自称 46 工具/120+ 操作、3,200+ stars、21,000+ 月活），补上批内只覆盖 Unity 的引擎缺口。 |
| 44 | IvanMurzak/GameDev-MCP-Server | <https://github.com/IvanMurzak/GameDev-MCP-Server> | Unity-MCP README 直接链到其 releases 的共享 NuGet MCP 服务器，三引擎插件都靠它，是批内工具的服务端层。 |
| 45 | IvanMurzak/ai-game-dev-plugin | <https://github.com/IvanMurzak/ai-game-dev-plugin> | 同作者的 Claude Code/Codex 插件与 Agent Skills 总包，把三引擎 MCP 与技能串成一套安装入口，是批内 Unity-MCP 的上游分发层。 |
| 46 | lemiur/alien-trilogy-decomp | <https://github.com/lemiur/alien-trilogy-decomp> | 同作者另一款 PS1 游戏匹配反编译，README 明写“obscene amount of AI assistance”并给出 byte gate，是 AVP2 之外第二个 AI 反编译样本。 |

#### 9.6.2 资产、美术、音频与 UI skills（19 项）

| # | 工具 | 原始链接 | 清单理由 |
|---|---|---|---|
| 1 | h3-game-sprites（视频转 2D sprite sheet） | <https://github.com/gary149/h3-game-sprites> | 2026-08-17 建库、147★：Agent Skill 把 AI 生成视频按 1992 Mortal Kombat 的方法切成关键姿势、抠像、打包图集；README 称 8 个动作约 $5、半天完成，给“视频模型→游戏动画”一个带成本的具体入口（未试用）。 |
| 2 | Codixel（Claude Code 像素美术 skill） | <https://github.com/mankidev/codixel> | 2026-10-31 建库、126★：强调参考图、骨骼先于像素、逐帧检查和场景内对比；与 a1dbv 已收 pxl（文本 DSL 资产族）是不同路线，可作像素资产生成的新对照（未装）。 |
| 3 | Blender Game Skills（概念图→可绑定 3D 资产） | <https://github.com/majidmanzarpour/blender-game-skills> | 2026-09-24 建库、173★：Claude Code skill 把参考图/概念图做成绑好骨、可导出 GLB/FBX 的 game-ready 资产，每个阶段要求渲染与测量证据；正好对应 a1dbv 3D 资产页“生成后仍需清理/绑定”的缺口（未装）。 |
| 4 | Effekseer VFX Skill（实时游戏特效链） | <https://github.com/kanaworksai-hue/effekseer-vfx-skill> | 2026-10-10 建库、154★：agent 走 brief→贴图→Python recipe→EffekseerCore 编译→Godot filmstrip→单点修正→独立复审，补上“AI 做实时 VFX”这条少被覆盖的资产链（未装）。 |
| 5 | Game UI Design Workflow（游戏 UI Agent Skills） | <https://github.com/guiguiyan930-source/game-ui-design-workflow> | 2026-08-04 建库、399★，中文 Cursor Skills：GDD/PRD→设计令牌→页面延展→组件拆解→雪碧图切片→9-slice/Atlas/Unity/Godot/Cocos JSON，把 UI 资产交付做成有契约的流程；a1dbv 游戏 UI 更多在手工/组件层（未试用）。 |
| 6 | aigccat（自托管 3D 资产管线） | <https://github.com/RainNameless/aigccat> | 2026-09-16 建库、49★，中文：文/图→3D 模型→贴图/拓扑/UV/绑骨/动画→Unity/Godot GLB + Asset Contract，明确针对“脸型雷同、微调要全量重生成、导出变品红、清理脚本误删、API 成本无感”等真实脏问题；是可自托管的资产生产线候选（未部署）。 |
| 7 | Blender Copilot（Blender 内 agent 面板） | <https://github.com/XEonAX/blender-copilot> | HN 2026-09-26（仓库 4★）：聊天面板让模型写 Python 直接作用于当前打开的 Blender 场景，每轮包一层 Ctrl+Z，作者自述约 $7 生成；热度低但“在真实 DCC 里可撤销地跑 agent”的做法值得记录（未装）。 |
| 8 | agent-sprite-forge | <https://github.com/0x0funky/agent-sprite-forge> | VibeGame README 引用；从提示直接产出 sprite sheet、地图、透明 PNG 帧与 GIF 的 agent skill（约 5.3k stars），补 2D 资产供给这一环。 |
| 9 | pyxel-mcp | <https://github.com/kitao/pyxel-mcp> | 游戏 MCP 目录；Pyxel 作者自己做的 MCP，能启动游戏、抓帧、检查 sprite 与声音，适合小型像素项目的可玩性检查。 |
| 10 | threejs-game-skills | <https://github.com/majidmanzarpour/threejs-game-skills> | Blender Game Skills 同作者（约 2.7k stars）；面向可玩、打磨过的 Three.js 浏览器游戏，README 挂 5 个在线 demo，可核同一作者的跨资产/代码工作流。 |
| 11 | audio-studio-mcp | <https://github.com/kanaworksai-hue/audio-studio-mcp> | Effekseer VFX Skill 同作者（596 stars）；本地跑 Stable Audio 3（MLX）生成 BGM/SFX 的 MCP，补音频供给与模型许可边界。 |
| 12 | KanaWorks SAKUGA VFX | <https://github.com/kanaworksai-hue/kanaworks-sakuga-vfx> | 同作者；90 个手绘风动画 VFX flipbook、9 种元素，支持 Unity/Godot/Web 且免费，是 Effekseer 技能之外的成品资产线。 |
| 13 | 3dixel | <https://github.com/mankidev/3dixel> | Codixel 同作者；Blockbench 风格的 3D 像素模型 Claude skill（方块预算、贴图与像素尺度规则），补 3D 像素资产。 |
| 14 | game-ui-page-generator | <https://github.com/guiguiyan930-source/game-ui-page-generator> | Game UI Design Workflow 同作者；单页整屏游戏 UI 生成 skill，与主工作流的逐页延展衔接。 |
| 15 | game-ui-specification | <https://github.com/guiguiyan930-source/game-ui-specification> | 同作者；把颜色、字体、组件、响应式与切图规则沉淀成可交付设计系统的 skill。 |
| 16 | game-ui-component-breakdown | <https://github.com/guiguiyan930-source/game-ui-component-breakdown> | 同作者；把整页 UI 拆成透明背景、可合成/可切图的独立组件素材，补“设计稿→开发切图”一段。 |
| 17 | PixelLab MCP | <https://github.com/pixellab-code/pixellab-mcp> | Auto Game Builder 工具清单里列出的像素美术 MCP（角色、动画、tileset 直出），可作为 Codixel 这类本地像素 skill 的商用 API 对照。 |
| 18 | guiguiyan930-source/game-skill-vfx-production | <https://github.com/guiguiyan930-source/game-skill-vfx-production> | 同作者的技能特效生产 Skill（Brief→关键帧→Alpha 帧序列→引擎接入/QA），是批内三套 UI 仓库之外的另一条游戏资产管线。 |
| 19 | kitao/pyxel-skill | <https://github.com/kitao/pyxel-skill> | 批内 pyxel-mcp README 指定由它驱动观测工具（v1.4.3 要求 pyxel-mcp>=1.3.1），并自带 Claude Code 插件市场安装方式，是 MCP 的技能层。 |

#### 9.6.3 索引、榜单与评测基准（15 项）

| # | 索引/基准 | 原始链接 | 清单理由 |
|---|---|---|---|
| 1 | awesome-gpt-6-astra（182 款 GPT-6 Astra 游戏索引） | <https://github.com/MartinDelophy/awesome-gpt-6-astra> | 头部索引新来源：433 星，收录 182 款 GPT-6 Astra 游戏，逐条给可玩链接、模型归属证据（issue/X/开发日志）与核验备注，目录更新到 2026-10-28；比 a1dbv 已收的 lappemic/awesome-ai-built-games 更聚焦单一模型且带来源分级，适合后续按“有开发记录/有更新”继续挖。它是目录不是作品，不计候选。 |
| 2 | awesome-gamedev-agent-skills（游戏开发 Skill 市场） | <https://github.com/gamedev-skills/awesome-gamedev-agent-skills> | 插件/Skill 市场角度新条目：7,056 星，77 个面向 Godot/Unity/Unreal/Phaser/PixiJS/three.js/Bevy/pygame/LÖVE 的 game-dev skill；与本卡“制作链”相关，可看社区把哪些环节交给 agent。属工具索引不是游戏，且未核实际产出效果。 |
| 3 | awesome-ai-for-games（游戏全生命周期 AI 研究索引） | <https://github.com/Eurekaleo/awesome-ai-for-games> | 2026-09-04 建库、389★：按游戏生命周期整理 AI/基础模型研究的可搜索索引，适合作为后续找“发布后返工/试玩评估”来源的目录（仅 README 核读）。 |
| 4 | OpenGame（开源 agentic 游戏创作框架） | <https://github.com/leigest519/OpenGame> | VibeGame README 明确致谢引用；CUHK MMLab 的开源端到端网页游戏框架，含会自我积累的 Template Skill、维护已验修复的 Debug Skill、GameCoder-27B 与 OpenGame-Bench，是本组里最接近“生成→修复”闭环的新框架。 |
| 5 | GameCraft-Bench | <https://github.com/FreedomIntelligence/gamecraft-bench> | 同由 VibeGame 引用；在真实 Godot 引擎里用 140 个任务、可回放轨迹与多模态判分评“agent 能否端到端交出可玩工程”，可直接当返工质量的验收基准。 |
| 6 | GameDevBench | <https://github.com/waynchi/gamedevbench> | VibeGame README 致谢引用；CMU/Princeton 的 ICML 2026 基准，333 个 Godot 4.4.1 游戏开发任务并带公开排行榜，用于横向比较 agent 的引擎内开发能力。 |
| 7 | Code2Games | <https://github.com/AIGeeksGroup/Code2Games> | 输入 awesome-ai-for-games 索引 Build-and-Maintain 2026 段列出的官方代码库（arXiv 2610.05033），研究 coding agent 生成可玩游戏世界，可作为新一轮评测基线。 |
| 8 | Ritmo | <https://github.com/typeonce-dev/ritmo> | 面向编码 agent 的 TypeScript ECS 运行时，错误代码不能编译且提示修法，适合 agent 写 game logic。 |
| 9 | Qwen Code | <https://github.com/QwenLM/qwen-code> | OpenGame 明确基于它扩展 Game Skill、GameCoder-27B 与 OpenGame-Bench，是上游 agent runtime。 |
| 10 | Harbor | <https://github.com/harbor-framework/harbor> | GameCraft-Bench 的评测/执行 harness，用于容器化跑 agent 并回放游戏证据。 |
| 11 | awesome-ai-games（aviaryan） | <https://github.com/aviaryan/awesome-ai-games> | 按复刻/原创分类并标可能上线日期的 AI 游戏清单，可继续扩候选池。 |
| 12 | awesome-ai-game-dev-tools | <https://github.com/SubmitGame/awesome-ai-game-dev-tools> | 按反编译、MCP、生成、引擎、美术、音频等分节的 AI 游戏开发工具大全，本次 Unity/Unreal MCP 由此补入。 |
| 13 | game-ai-benchmarks-papers | <https://github.com/zsyverse/game-ai-benchmarks-papers> | 游戏 AI benchmark/论文清单，可补 GameCraft-Bench、GameDevBench 之外的评测对照。 |
| 14 | GameDaily.ai | <https://gamedaily.ai/> | 每天发布一款全 AI 生成浏览器游戏的目录，适合按日期追更新/返工记录。 |
| 15 | Player1AI | <https://player1ai.com/> | 500+ AI 浏览器游戏目录，可按手机/手柄/多人筛选，且 Play 链回作者原页。 |

#### 9.6.4 行业背景、方法与反向样本（15 项）

| # | 对象 | 原始链接 | 清单理由 |
|---|---|---|---|
| 1 | WorldStrike | <https://worldstrike.fun/> | 发布当天玩家报告→当天修复的最新鲜样本（HN 主帖 2026-11-06，50389420，62 分；标题 “Multiplayer tanks that demolish real buildings from OpenStreetMap”，不带 show_hn 标签，不是 Show HN 帖）。作者 n4ze3m 逐条回复并已改：OSM 署名从角落 ⓘ 改为游戏内与首页常显、重生 5 分钟砍到 30 秒、掉线 bug 修好并自动重连、服务器 tick 落后修掉、定位到碰撞检测扫太多建筑导致回弹；免费浏览器、真实 OSM 城市可拆。缺口：全帖与站点均未披露 AI 参与开发，按本卡硬条件不能算 AI 作品；列出供核实作者是否用了 AI，以及作为“AI 时代同日反馈闭环”的机制参照。 |
| 2 | Hormuz Havoc（AI 玩家反向改造） | <https://www.hormuz-havoc.com/> | 与任务机制高度相关的反向样本：Show HN 2026-04-11（HN 47729477，54 分）作者说朋友用 AI bot 与 Claude 浏览器扩展直接读 client-side game.js，按评分公式优化，首个 AI 得分是最强人类 2.5 倍；作者把整个游戏引擎搬到服务端、逐个补漏洞、用每局耗时日志识别 bot，并在帖内承诺修 one-time action 的结算复制 bug。游戏本身不是 AI 开发，不能作 AI 作品候选；价值在“客户端逻辑暴露给 AI 玩家后必须服务端化”的发布后返工规格。 |
| 3 | Microverse | <https://github.com/KsanaDock/Microverse> | topic:ai-game 按 star 排第一的“游戏”仓库（2,510 星，Godot 4 多智能体 AI 社交沙盒，角色有记忆/自主任务/多模型接入）。但 AI 是运行时玩法而非开发主体，仓库也未称 AI 写代码；按本卡 §1 只能作上下文，说明 GitHub 头部“AI 游戏”多为 AI-as-gameplay，不是 AI-as-developer。 |
| 4 | r/gamedev 对 Claude Code Game Studios 的吐槽帖（工具） | <https://www.reddit.com/r/gamedev/comments/1ssodcu/i_just_tried_claude_code_game_studios_for_the/> | 两小时约 50 万 token 只写完 Flappy Bird 的 GDD、没有一行代码；跟帖多人复现“文档膨胀/零产出”，也有人指出需人持续 steer——AI 游戏工具的真实失败路径，非游戏候选。 |
| 5 | 《地穴涌现》开发日志 4（AI 过度工程） | <https://www.taptap.cn/moment/859797774919536479> | 2026-10-20，10 天 GameJam 原型一次改动跑了 3 个多小时、2.2 万积分，原因是 AI 自动加了近千行测试、几千帧验收和旧存档迁移；作者总结“AI 做游戏不是免费，给的自由度越大越往正规工程跑”，是给小任务写边界的具体反例（页面已读）。 |
| 6 | 《小小史莱姆》开发日志 05（TapTap 制造人机协作） | <https://www.taptap.cn/moment/860998185634500437> | 2026-10-20：任务分级用不同引擎（积分差 10 倍以上）、美术微调最贵且最不听指令、逻辑必须自己先整理、音效底噪大而背景音乐可用、帧动画约 400–600 积分；是 TapTap 制造平台侧成本/质量的一手使用记录（页面已读）。 |
| 7 | 《水彩魔法师·水排序》上线两周复盘 | <https://www.taptap.cn/moment/853728463025082019> | 2026-09-28，一人+AI、100 关已上线：最忙一天连推 9 个版本，后来才知频繁更新不利于系统重新抓数据；作者结论“缺的是分发不是产品”，首发 3 天冷启动窗口被浪费；补的是发布后运营/更新节奏这一层（页面已读）。 |
| 8 | 《AI 让两个人完成六个人的研发工作，然后呢？》（我的奶茶屋） | <https://zhuanlan.zhihu.com/p/2097746150862353068> | 2026-10-27（原文知乎 403；清单记本次读 gameres 转载，`gameres.com/901203341.html` 本机直连 403，正文以清单转述为准）：两人用 AI 做完原需 6 人的《我的奶茶屋》并上线 TapTap，但新增与商业化不达预期，作者结论“AI 提速是全行业都能拿到的能力”；对“发布后是否继续投入”的判断有直接参考。 |
| 9 | r/gamedev：AI models have caught up with Unity dev | <https://www.reddit.com/r/gamedev/comments/1wo5asm/ai_models_have_caught_up_with_unity_dev_my/> | 2026-09-23，2,466 赞/1,255 评：30 年经验、Unity 10 年的工作室主称一个月前全员用 Unity CLI 后速度约 5x，仍人工审代码、junior 无处安放、市场变差但“回不去了”；本轮英文社区最大的一手采用讨论（直连 000/TLS，经 Arctic Shift API 读正文）。 |
| 10 | r/Games：Thoughts on AI in game development (from the trenches) | <https://www.reddit.com/r/Games/comments/1xcr1au/thoughts_on_ai_in_game_development_from_the/> | 2026-10-22，1,537 赞/540 评：移植/优化工作室 PH3 的 CTO 长文，区分实际能力、成本与行业影响，并声明非 AI 写作；适合校准“AI 能替多少”，a1dbv 未收（经 Arctic Shift API 读正文，评论未逐条）。 |
| 11 | itch.io 删除数 TB AI slop | <https://frvr.com/blog/news/indie-storefront-itch-io-deletes-a-couple-terabytes-of-ai-slop-as-the-marketplace-is-spammed-with-ai-games-and-assets/> | 2026-11-03：itch.io 清理“a couple terabytes” AI 游戏/素材，说明发布环境正在收紧；与 Steam Next Fest、Roblox 供给爆炸并列，是判断“发布后是否值得投入”的平台侧新事实（二手报道，未核 itch 官方公告）。 |
| 12 | Roblox 5 个月 7 万款 AI 游戏 | <https://www.pcgamer.com/software/ai/ai-powered-game-development-is-leading-to-an-explosion-of-content-roblox-says-as-it-brags-about-70-000-games-published-on-its-platform-in-the-last-5-months-alone/> | 2026-10-30 报道（JSON-LD datePublished 2026-10-30T20:39:57Z，正文写 Published 30 October 2026）：Roblox 自报 5 个月发布 7 万款游戏，同时 Steam 侧质量争议上升；是“供给爆炸”的最新量化，可作为发布后竞争环境的背景（二手报道，未核 Roblox 原报告）。 |
| 13 | Teach My Little Sister How to Drive：AI 运行时成本与补丁节奏 | <https://store.steampowered.com/news/app/3948460/view/1846651706694978> | Steam 公告 1.3.2（2026-10-20）写“AI improvements and gameplay fixes”并感谢玩家反馈，10-18～20 连发 1.3.0–1.3.2；团队 10-07 公开称 demo 每天 AI 成本 $1,000+、要靠贷款维持。AI 是运行时 NPC 而非开发主体，不计本卡候选，但“运行时成本 + 高频补丁”是 a1dbv 未收的新案例（公告正文已读，游戏未玩）。 |
| 14 | Rosebud Prompt Atlas（真实游戏 prompt 星系图） | <https://rosebud.ai/prompt-atlas> | 2026-08-18 Show HN：把成千上万条“让 AI 做游戏”的真实请求（脱敏、保留错别字）映射成可探索星系图；补的是需求侧数据，与 Playgama 的供给/游玩数据互补，a1dbv 未收（页面已读，数据只作样本）。 |
| 15 | 三国群雄志（TapTap 制造作者的上架复盘） | <https://www.taptap.cn/moment/847367330055848312> | 作者辰安的 TapTap 制造 1–6 期上架教程，记录打包、审核、截图驳回及“禁止 AI 自动截图”等发布可用性问题，可对照 AI 游戏从制作到上架的实际卡点。 |

### 9.7 本轮最强 1 项优先试玩建议与可验证机制

**本轮先试玩 Brickbrag**（若按卡级跨轮排序，仍先按 §7 试 Fire Field；两者可并行）。按可执行清单走：

1. 打开 <https://brickbrag.com/>，走完教程，在教程区买一块地并放砖，确认不再出现 “no building here”（50064516/50066640/50065486 报的问题；changelog 10-13 条目称已修）。
2. 进出砖店菜单，确认不会出现“退出又被弹回”的循环（50067118 报的问题）。
3. 在手机或浏览器手机模拟下快速双击摇杆，确认页面不再被放大（50068830 报的问题；changelog 10-13 条目只声称这一行为，缩放是否恢复正常不在本次验收内）。
4. 打开游戏内 “What's new” 与 <https://brickbrag.com/changelog.html>，确认两处列表同源、当前构建包含 10-13 的三条。
5. 若任一条在当前构建复现，记录“版本日期＋复现步骤＋实际表现”，不因 changelog 写了就判通过。

验收只记“changelog 声称的行为在可玩版本里是否成立”，不把页面文案或 HN 回复当已验；不评价整体品质、手感或留存。

**一个可在现案例验证的具体机制：资源/性能类反馈必须有降级路径与最低设备回归。** 本轮三条独立证据指向同一做法：

1. **Permit Pending**（HN 50173404）：玩家报内存分配崩溃，作者让 Claude 在分配失败时回退到低分辨率纹理——不是只修报错，而是给运行时资源压力准备降级路径。
2. **Brickbrag**（changelog 10-23/10-24）：手机端条目写 “Phones no longer crash while walking or zooming out”“No more freezes…”“far fewer stutters”“up to four times the frame rate in busy places”，把玩家报的卡顿/崩溃转成可复测的帧率与崩溃条件。
3. **哈耶克的文明 v2.0.0**（`CHANGELOG_v2.0.0.md`）：致谢点名“反馈后期卡顿问题的测试玩家”，对应 Web Worker 重构（手动贸易等计算密集任务移出主线程、`useGameLoop.js` 移除 656 行、后期帧率约 +40–60%），并同时做旧存档自动迁移。

四段规格：① 玩家报告先写成“设备/场景 ＋ 当前表现 ＋ 期望表现”；② 修复分“正常路径”和“降级路径”（分辨率/画质档/分线程/限帧），并写清降级触发条件；③ 补一条最低设备档的回归（内存上限、帧率下限、长时间运行），不只测开发机；④ 发版说明写清玩家在什么情况下会看到降级。它可以在现有 FPS/MOBA/Star 上直接验：选一个最低设备档，人为制造内存/着色器压力，确认降级真的触发、回归覆盖到、发版说明可复述；这比再加一个 UI 提示更接近本卡要的发布后返工能力。上一轮 §7/§8.6 的“旧存档/旧状态迁移与回归”仍有效，两者可并存：一个管状态兼容，一个管运行时资源。

### 9.8 本轮边界、未做与下一步

**本轮实际核了什么。** 196 条候选链接由收集/核对阶段用 curl 并行检查（按状态码与页面标题判断）；本次写稿又对 3 项通过逐条复核：

- **Brickbrag**：`curl -sSL` 打开 <https://brickbrag.com/>（200、text/html、23,665 字节）、<https://brickbrag.com/changelog.html>（200、14,337 字节）、<https://brickbrag.com/assets/build/cafe-960.jpg>（200、image/jpeg、75,184 字节）；HN Algolia `/items/50063042` 读到 82 分、作者 `neuling`、顶层 14 条评论，并逐条读到 50063065（八天/Claude Code Opus 5.5/9 岁主试玩）、50068156（最后 20% 需人工引导）、50064516/50066640/50065486（no building here）、50067118（砖店循环）、50068830（双击缩放）、50069148（Fixed: changelog）。
- **Permit Pending**：`curl -sSL` 打开 <https://permit.petercai.com/>（200、text/html、14,077 字节，JSON-LD 作者 Peter Cai、free、Web browser）；作者公开的游戏内截图 <https://permit.petercai.com/marketing/feature-economy.webp>（200、image/webp、1,670,064 字节、1800×1160，页面 History 窗口＋城内画面；og:image 另为 marketing/og.png，1200×630、1,863,724 字节）；HN `/items/50170593` 读到 2026-10-20、941 分、作者 `pcai`，并核到 50202645（almost all claude＋人负责 gameplay/art direction/mechanics/storytelling）、50176060（最初按“不隐藏复杂度”打磨、试玩后改为逐步分层揭示）、50173599（预写故事弧回填引擎）、50171235/50189362（玩家报告）、50173404（低分辨率纹理回退）、50202272（道路修复＋分区覆盖层）。
- **哈耶克的文明**：`curl -sSL` 打开 <https://hkingauditore.github.io/civ-game/>（200、text/html）、仓库页与 `raw.githubusercontent.com` 的 README/AGENTS.md（22,763 字节，Codex Agents Guide）/CONTRIBUTING_AI.md（20,698 字节，LLM Collaboration Protocol v1.0）/CHANGELOG_v2.0.0.md（36,060 字节）；`commits/master.atom` 读到 v2.3.60–v2.3.64、最新 2026-10-22、4 条带 `Co-authored-by: Cursor` 的 agent 署名；截图 <https://raw.githubusercontent.com/HkingAuditore/civ-game/master/debug_load.png>（200、image/png、1280×720、606,824 字节）。
- **§8 三项遗留事实**：Steam `ISteamNews/GetNewsForApp/v2?appid=5242520&count=40&maxlength=0` 返回 28 条，时间从 2026-10-15 的 1.0.9 到 10-31 的 1.3.4，其中 1.3.x 6 条；`raw.githubusercontent.com/.../react-xiuxian-game/main/public/CHANGELOG.md` 读到 0.1.0（2025-12-05）→0.2.7（2025-12-21）→0.3.8（2026-09-17），README 写当前版本 v0.3.8；TapTap app/988887 页面显示“Android 正式上线日期 2026-10-31、更新时间 2026-10-20”，JSON-LD `datePublished` 2026-10-30T16:01Z、`bytedance:updated_time` 2026-10-19T16:00Z（均为 UTC）。三项已按上述结果改到 §8.4/§8.5。

**没有做。** 未启动任何游戏、未播放视频/音频、未看完整连续实机、未登录任何站点、未发帖或联系作者。因此本页不能声称任何作品“已玩”“已看完”“手感/帧率/听感通过”，也不作品质排名。所有“可玩”只到公开入口 200 与页面文案。

**仍然缺的硬项。**

- **许可与成本**：除少数仓库标注 MIT/GPL/AGPL 外，多数条目只写“未知”；不推算。Brickbrag、Permit Pending、哈耶克的文明均未找到完整许可或总成本。
- **静态截图**：3 项通过各给一张并本次打开核过；其余条目大多没有作者公开静态图，不能用商店 capsule 或目录页截图代替。
- **作者身份**：Brickbrag 只到 HN handle `neuling`；Permit Pending 到 Peter Cai（页面 JSON-LD）；哈耶克的文明到 GitHub 账号 HkingAuditore，知乎原文 403 未能直读。
- **玩家闭环强度**：Brickbrag 的 HN 只有 82 分/14 条顶层评论，Permit Pending 的 428 条评论未逐条读（已核 50171235/50189362 两条玩家报告与作者回复），哈耶克的文明评价数未能复核（TapTap 旧入口 404）；三项都不是大样本。
- **渠道缺口**：本页的 HN 直连链接（如 item 43726058）与 Reddit 链接在本机 TLS/403 不可直连：HN 正文经 `hn.algolia.com/api/v1/items/<id>` 读取，Reddit 正文经 Arctic Shift 归档 API 读取；itch.io 与 linux.do 原帖仍 TLS 不可达；Steam 评测正文/讨论区、X/Discord/YouTube 仍未读，玩家原话只到 HN 回复、补丁/公告与页面文案层。

**下一步顺序。**

1. 负责人按 9.7 的三条复测 Brickbrag；只需回答“当前构建是否仍复现”，不评价品质。
2. 把 9.7 的“降级路径＋最低设备回归”四段规格接到现有 FPS/MOBA/Star 的一条真实卡顿/崩溃报告上；与 §7 的旧存档四段规格一起，形成“状态兼容＋资源降级”两条发布后修复回归。
3. 中文线用哈耶克的文明核对 v2.0.0→v2.3.64 的版本链与旧存档迁移；补核其 LICENSE 与 TapTap 新入口。
4. Permit Pending 补核是否有 release notes/版本号；Brickbrag 补核作者站点 About/许可。
5. 不新增广搜；本轮已把 196 条清单按缺口分好，后续只按缺口逐项补，不再扩大题目。
