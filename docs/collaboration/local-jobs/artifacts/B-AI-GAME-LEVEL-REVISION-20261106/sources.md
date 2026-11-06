# B-AI-GAME-LEVEL-REVISION-20261106 · AI 参与关卡二改的候选来源

> 采集与静态核实日期：2026-11-06。只读公开网页、API、源码和作者静态图；未启动游戏、浏览器、播放器或音频，未登录、未发帖、未联系作者。链接可达只代表网页响应；未试玩、未看完整连续实机，不作品质结论。

**先给结论（三轮合并）。** 第一轮 3 项甲级保留；第二轮新增 2 项优先、4 项近门槛、14 项有二改但证据薄、14 项过程线索和 23 组工具/方法；第三轮新增 3 项甲级、3 项 A-（含在乙级 23 项内）、23 项乙级与 38 项丙级，另有 Among Gas 排除。三轮合计 **A 7、A- 4（其中 3 项含在 B 70 内，Bash Fighter 单列）、B 70、C 102、D 9 组＋3 项、工具 36＋68 组**。按默认深挖顺序（按目标选哪个先试，见下文“当前先做什么”）：

1. **HollowARK**（第二轮新增，浏览器可玩的挖掘/物流基地游戏）——本轮最完整的同时具备当前可玩 v71、逐版 devlog（128 条、带时间戳）、作者静态截图原链、v48/v59/v91 三次空间/物流二改（v71 是美术/第一章观感 pass）、AI 写全部代码而人设计与试玩的样本；最值得先深挖“每版一页记录＋同机位截图＋脚本玩家复跑”的制作过程。
2. **Bash Fighter**（第二轮新增，2D 联机平台格斗）——二改证据最硬：The Atoll 出生间距 40→28 单位、生产 match 里两 bot 3.3 秒被 KO（4%/11%）后加永久 spawn-clearance 审计，另有 blast-zone 8%、arena-shrink 三版、平台填充对比度 1.19:1；缺版本 tag（package 0.0.1），且是 2D 不是 3D。
3. **Voltane**（第一轮甲级，3D 遥控车竞速）——仍是最贴近 Star 公路弯道/捷径/隐形墙问题的一项，开放 beta 可玩，更新日志按日期记录路线与碰撞二改；本端未试玩。

另：**Overserved**（塔防，可玩，140 关 bot 调参后人工二改 4 关、Boss 护盾重做）缺作者静态截图原链与版本号（许可/成本另未披露），**CORO SOLTO**（3D FPS，AGPL-3.0，v2.1.0-alpha.137，13 张地图主体为 `public/js/map_*.js` 手写几何、另有可选 JSON 地图加载，Codex 提交的塔楼/通道/碰撞二改）还缺截图原链与 AI/人工分工说明（目前只有提交尾注；版本可查：v2.1.0-alpha.137 已于 2026-11-03 发布 GitHub release，仓库也有对应 tag，缺的是稳定版/正式版），二者列为甲级候选替补、暂不计入现有替补数——补齐截图、版本（Overserved）与 AI/人工分工，并通过人工试玩后再计；**Fang the Fox**（softlock 修复＋地图检查器）是第二梯队；**Peas of Resistance**（整关重建＋测试迁移）只有过程与 Steam 愿望单、无公开可玩 build，移到 §5.6 作过程线索。

三轮合计：**A 级 7 项**（HollowARK、Voltane、Solhex、时囚 BetweenTicks、群侠传：幸存者、Fire Field、We're Gonna Need More Fireballs）＋**A- 4 项**（Bash Fighter、Hora Cero、Pawnshire、Sector Dive Extended；Bash Fighter 缺版本 tag，package 0.0.1 已知）；**乙级 70 项**（含 §4.6 的 3 项 A-：Hora Cero、Pawnshire、Sector Dive Extended；Bash Fighter 单列于 §3.5，不在乙级 70 内；§4.4 近门槛 4 项中 Overserved、CORO SOLTO 只算乙级，不占甲级替补名额）、**丙级 102 项**、**排除/转交 9 组＋3 项**、**工具/方法 36＋68 组**。上述 **A 级 7 项**都有当前可玩入口、作者过程、作者公开静态截图原链、版本或日期、AI/人工分工和一次具体二改；**A- 4 项**另计：Bash Fighter 有仓库实机图但缺版本 tag，Hora Cero、Pawnshire、Sector Dive Extended 缺作者静态截图原链与版本号（见 §4.6），按门槛 4 从严只能算近门槛替补，补齐后再列 A-。许可与成本除个别注明外均未披露，作者身份只到个人站/工作室页，本端均未试玩。**本卡只做已定候选收集，不替代实际运行、试玩或完整实机观看；恢复实机后按 ai-made-games-scout §2 补 10–15 分钟实玩与同视角截图。**

任务点名排除的 19 项旧候选只在 §6 列名，不重复计数。**当前先做什么（按目标选，不按总排名）：**

| 目标 | 先试 | 第一步 | 何时不适用 |
|---|---|---|---|
| 解决 Star 的公路弯道/捷径/隐形墙 | Voltane（§3.1） | 按 §9 的“可见阻挡清单＋固定跑圈基线”，同车同输入同机位跑 3 圈 | 问题只是单段时长/节奏时，改用 Solhex 的目标窗口＋可重复 test player |
| 要第三轮新增中平衡改动数值写得最完整的版本化样本 | 群侠传：幸存者（§3.6） | 读 V0.1.2 公告，按 §9.1 自建“固定场景＋固定敌人数＋10 轮”基线；作者只做了性能压测，未公布平衡改动的同基线复跑 | 需要 3D 动作/竞速或逐版空间几何时，改看 Voltane / HollowARK |
| 要看逐版记录的制作过程 | HollowARK（§3.4） | 读 devlog 的 v48/v59/v91，按“每版一页记录＋同机位截图＋脚本玩家复跑”照做 | 挖掘/物流玩法，不能替代赛车弯道试玩 |

在 Star 现案例可验证的机制仍是“可见阻挡清单＋固定跑圈基线”，另加 HollowARK 的“先量开局/单局时长，再改路线”，见 §9。

**第三轮（u3）新增结论。** 本轮按“官方团队/高质量项目自述、GitHub 头部覆盖、英文从业者社区、中文社区、真实使用问题与反馈、近三个月新工具/做法”六个角度并行扫，再沿引用、被引、评论与作者其他作品追到饱和，链接核对后保留约 140 项。**新增 3 项优先深挖（A 级）**：**群侠传：幸存者**（Steam 抢先体验、免费可玩，V0.1.2 对无尽遭遇做了可核的第二次重排；公告里的“固定场景＋固定敌人数的 10 轮压测”位于 optimization 小节，是性能优化压测，不是平衡改动的同基线复跑）、**Fire Field / Firefield**（约 18 万行由 Claude Code 写；关卡为程序生成、人做玩法/数值/试玩判断；v1.8.0 整层 B1–B5 重建并加中 Boss，v2.0 重建为 8 层并修“石棺/柱子挡路无法推进”与敌人刷在物件/楼梯旁）、**We're Gonna Need More Fireballs**（2026-10-07 公告把 8 月 demo 的 3 图/5 塔自我否定后重建为 7 图/11 塔，首图改完整教学）。**新增 3 项 A-（近门槛替补）**：Hora Cero、Pawnshire、Sector Dive Extended；**Journey to the West 因入口仅 874 字节 SPA 壳、可玩性未确认，按门槛 2 从严暂列丙级（§5.7）**。**最强新样本与 Star 的关系**：群侠传证明“固定场景＋固定敌人数的重复测量”可以在 2D 幸存者里落地（但作者未用它复跑平衡），Fire Field 证明“整层重建”也能写成逐版可核记录；但两者都不是 3D 动作/竞速/射击，**Star 的公路弯道/捷径仍先试 Voltane，不因本轮新样本换主线**。第三轮与前两轮重复的 Voltane、CORO SOLTO、Familiar、Emberwick 只在原条目补证，不重复计数；其中 CORO SOLTO 在本轮补到 #1115 的“Lajes 迷宫/支路过多，需减少总长度与支路数并给复杂度设上限”反馈→二改链。原文未支持“3 个水下不可达站点”“按身体半径重排掩体路线”两项，已删去。

## 1. 渠道覆盖表

### 1.1 第一轮（u1）

按首次发现渠道归类，跨渠道重复不重复计；个别条目按主入口归并。各行“得到”是覆盖量，不是品质排名。共记录约 **91 个具名作品/项目条目**、**13 组工具/方法线索**；另 19 项任务既有旧候选只列名。实际逐页读的是作者原文、devlog、仓库、商店/详情页和静态图；摘要只作线索。

| 渠道 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| Vibe Jam 官方与 2026 数据集 | `vibejam.com/api`（2,028 条，2026 年 945 条）、`/2026/cache/games-5288ad4b37b007e7f970f150f68f2d1d.js`（945 条，与 2026 年一致，含 `final_rank`/`award`；文件名里的 5288… 只是哈希前缀，不是条数）；筛 pitch 含 level/map/encounter/layout 的 39 条（2026）/78 条（2025–2026 全量），放宽到 2026 缓存全字段共 94 条，再回作者页 | 2 项（Geobeat；Duality 仅元数据） | `vibejam.com/2026` 显示 0 games；`/results` `/winners` 404；Duality 的 vercel 页 TLS 000；完整参赛/获奖名单未取得 |
| GitHub（REST、raw、HTML、`commits.atom`、Pages） | Ennui92/pull-the-plug-play、aieo-product/fableDemoGame、nansu0425/nan2026-game-src、Dimava/gensokyo-survivors、3D-Stories/skate-game-opus-5-5、web3dev1337/epic-survivors-architecture、alltomstales-dotcom/oh-shit-zombies、acatovic/gothicvania-codex-demo；另读工具仓库与 `awesome-opus-5.5-games` 的 4,128 条 `games.json` | 8 项（B1 3、B3 4、C 1）＋8 组工具/索引 | 未认证 REST 60 次/时限流（403）；code search 需登录；部分仓库 500/404；commit 历史未逐条读 |
| 英文作者站、个人博客、devlog | kraigadams.com（Solhex 165 条 devlog、Jumpgate）、x00f.com（Wages/Wreckhold/Graveshift/CAGE/Voidrunner/Polybreak）、dmnshd.gg（Shed Racer、Geobeat）、tinybitadventures.com（Fang/Wheek/Not Pro Skater/Star Circuit）、vibegamesstudio.com（12 款＋2026 夜报）、evolutionaryarcade.com（6 款＋API modelCard）、supertommy.com、slipfacegame.com、fable-katamari.pages.dev＋Zenn、blog.slashie.net、rustyrobozlabs.com、jobyang.cn | 约 46 项（A 1、B 9、C 32、D 4） | slashie.net 根与 `/keep` 被 Mod_Security 406/500；fable-katamari 除地图版权外无作者/社交外链；tinyskies 停放页；hollowlands 只有标题/菜单图 |
| Reddit（Arctic Shift 归档 API） | r/aigamedev、r/ClaudeAI、r/vibecoding 的 `posts/search`、`posts/ids`、`comments/search`；Voltane 1xgcszc/1xgsgmi、Iron Curtain 1xj88ci/1xk8dp8、Liftbound 1xou4m9、Maskfall 1xmrr9d、OVERSTEER、Schnell、Silent Entry | 2 项（A 1、B3 1） | `www/old/api.reddit.com`、redlib、r.jina.ai 均 403/429/TLS 失败；Arctic Shift 部分查询 Timeout；1xnx3w5 已 `[removed]`；OVERSTEER 被网络策略 block；评论只读到 1xj88ci 约 100 条与 1xgcszc 约 50 条 |
| Steam / SteamDB / App Store | Iron Curtain Call 商店页与 appdetails、ISteamNews；Epic Survivors 正式版 app 3553800 与 demo app 4090630；Liftbound 的 iTunes lookup | 2 项（B1 1、D 1） | SteamDB 403/Cloudflare；社区公告/讨论页 000；评测 JSON 为空；Stay Dead、亡犬、SweatyPanzer 的试玩与 AI 分工未核；App Store 页重定向到中国区 Today |
| TapTap 聚光灯 2026 / TapTap 制造（网页 SSR、tag 页、moment 页） | app/984399、982445、974354、960864、964250、963039、965247、960144、975005、954910、954051、957599、957390、976181、986579、955070、976321；moment Day14/15/17/20、开发日志 01–07、评价页；`/tag/聚光灯GameJam` 18 个 app；开发者页 468045/479179/450056/292906 | 25 项（A 1、B 10、C 12、D 2） | “打开 APP 试玩”需客户端/登录，未启动；作者主页返回混淆反爬负载；`webapiv2` 搜索 400 `csrf_token_expired`/需 `X-UA`；聚光灯活动页显示“全部作品 0 款”；用户页 JS 空；清漪/考了又考/界门无公开网页试玩 |
| 中文技术社区与作者页 | agentcaseshare（多米诺人生系列与 15 个案例总表）、juejin（猫咪守卫队、颜色排序）、cnblogs（考了又考）、jobyang.cn（界门）、机核/少数派/知乎/公众号/小红书 | 5 项（B1 1、C 4） | 公众号多篇“环境异常”验证页；小红书 item 页“访问的页面不见了”；知乎 403；少数派/即刻只有摘要；掘金作者文章列表 JS 空页；评论区未展开 |
| itch.io / AI Jam 4 | AI Jam 4 entries 75 项、results 21 名；A Rock and a Hard Place、Wicklight、DEEP、cwwkeeler/RUINS、r3dm00n/Red Moon、deaddreamer99/Schnell、dystostorm/Silent Entry、echoplayroom/Yanghwa、martinopiaggi/Dungeotto、stuartking84/Wasteland Renegades | 1 组 3 个链接仅搜索摘要线索（D），0 项可核 | 本机 DNS 把 itch.io 解析到内网拦截地址，TLS handshake 失败（curl exit 35、000），WebFetch 报 Socket is closed；站内 devlog 搜索返回 0 字节 |
| 索引与榜单 | `awesome-opus-5.5-games` 的 4,128 条 games.json 按独立游戏/quality≥8.4/Three.js/Godot/Unity/Unreal/WebGL/有 live_demo 过滤出 71 项；`aibuiltgames.com/api/games` 238 条；Playgama AI Game Index；claudeslop；GamesByAI | 0 项新（Fallen Citadel、Pro Skater 已按 GitHub 计）＋5 组工具/索引 | aibuiltgames 主页只渲染 1 条 featured；claudeslop 一直 Loading；Playgama 只有聚合统计；vibey.dev 是域名出售页 |
| Hacker News Algolia | 多组 query；读 item 50072120（177 分）整棵评论树、48509243、48865303 | 0 项作品；3 条边界线索 | HN 未出现具体的“AI 游戏第二次改关卡”案例；只留下 harness 的反对意见（“LLM 已解决编码”被多位从业者反驳）、Simon Willison 的 Safari/Chrome 回放不同步、mypalmike 的 playtest 输入录像/精确复现线索 |
| B 站 / YouTube | 只读标题、简介、作者、日期、时长等元数据；按任务未加载播放器、未播放音频/视频 | 0 项 | 播放器未加载；《星光小队》《翻面》《破境》《夜神 1 人 100 小时》《明末：欲火重生》的连续实机与具体关卡二改无法核 |
| WebSearch / 通用搜索引擎 | 本会话 200/200 用尽；中英文换词覆盖 level redesign/second pass/playtest、关卡重做/路线/波次/遭遇、site:itch.io、site:taptap.cn 等 | 0 项可直接核（只作发现入口） | Bing 中国站返回无关词典/驱动结果；DuckDuckGo HTML/lite 证书被劫持到 `*.facebook.com`；Mojeek 403；Google/archive.org/r.jina.ai 000；额度耗尽后无法补 site: 查询 |
| Epic AI MegaJam / 官方 jam 页 | `unrealengine.com/news/2026-epic-ai-megajam`、`itch.io/jam/epic-ai-megajam-2026`、`web.archive.org` 快照 | 0 项 | Unreal 页 403 Cloudflare；itch jam TLS 失败；archive 拒绝抓取/000；规则、提交与获奖名单未读 |

### 1.2 第二轮（u2）

第二轮按 6 个来源角度并行扫，再沿候选引用/被引/评论追 3 轮；链接核对通过的候选池约 200 余项。各行“得到”是本行覆盖量（跨渠道重复计，含非候选索引/工具），不是候选池总量；跨行同一作品只算一次，去重后按本卡门槛收录 57 项（2 项优先、4 项近门槛、14 项二改但证据薄、14 项过程线索、23 组工具/方法，其中 3 组只作方法/管线证据、不计作品候选），另 2 项按规则排除/转交；其余是无二改记录的可玩作品、平台/工具或已在本卡/旧卡的条目。

| 渠道 | 实际看了什么、取法 | 得到（本行覆盖量） | 读不到及原因 |
|---|---|---|---|
| 官方团队与高质量项目自述 | GitHub raw/HTML/commits.atom/codeload tar.gz/`git clone --depth`；读 Bash Fighter 的 README、AGENTS.md、docs/ADDING_A_STAGE.md、docs/MEASUREMENT.md 与 340 条提交，GamesByAI 的 catalog 596 个 YAML、Dustlight 的 NOTES.md，OpenAI/skills，Unity agent plugin 的 skills 目录，Dora SSR 的 game-iteration-playbook，eremes81 书稿 Part 7，以及 Donchitos、threejs-game-skills、level-lab-skill、worldbuild-bench、vibejam-starter-pack、ohmygame、godogen、genex 的 README | 15 项＋8 组工具/索引 | OpenAI Codex app 403（Cloudflare，en/hy-AM 均 403；r.jina.ai TLS exit 35；publicnow 转载也 403），只有搜索摘要；unity.com 的 /features/ai、/products/unity-ai 只回通用产品页，没有官方 graybox/level playtest 一手说明；claude.com/code-with-claude 的 Era Online 正文由 JS 渲染，未解析；GitHub API 60 次/时 403，code search 需登录；grep.app 被 Vercel Security Checkpoint 拦截，无法按 AGENTS.md/CLAUDE.md 全站检索 |
| GitHub 头部覆盖 | `github.com/search` 的 react-app.embeddedData，按 stars 排序；20+ topic 查询（ai-game、ai-generated-games、claude-skills game、vibejam、text-to-game、threejs-game、ai-game jam 等）与 README 短语查询（level redesign、second pass、playtest、devlog）；`github.com/trending?since=weekly`；逐个对照 a1dbv 是否已覆盖 | 12 项（Bash Fighter、Donchitos、threejs-game-skills、level-lab-skill、worldbuild-bench、vibejam-starter-pack、ohmygame、godogen、genex、awesome 列表等）＋8 组索引 | trending 本周 16 条全是 Claude skills/工具，无游戏仓库；API 403；code search 需登录；仓库搜索不支持复杂布尔；部分仓库 404/私有（ts-kyle-on-duty、Covenant of Embers 的 main 分支 README/CLAUDE.md） |
| GamesByAI / 索引榜 | catalog 的 596 个 YAML 与 games/ 目录 100 个 YAML，过滤出 30 个带 repo 的条目；逐个核 gamesbyai.win 的 play 页、仓库、截图与博客；另读 `awesome-opus-5.5-games` 的 4,128 条 games.json、aibuiltgames 238 条 API、Playgama AI Game Index、claudeslop | 6 项（Dustlight、Bash Fighter、Eyrie、Sunset City、Neon Ridge Drift 等）＋5 组索引 | gamesbyai 目录/部分元数据 API 403；单条 YAML 只记模型/工具/入口，不含关卡二改字段；catalog 100 个 YAML 未逐个打开；aibuiltgames 主页只渲染 1 条；claudeslop 一直 Loading；Playgama 只有聚合统计 |
| 英文作者站、个人博客、devlog | kraigadams.com（HollowARK 的 128 条逐版日志、已到 v91；Jumpgate）、gamesbyai.win/blog、lewismoten.com 与 GameMaker-SandboxEdition、richardfu.net、kylekukshtel.com、calebleak.com、jeffschomay 博客、blog.sayori.org、butterstack.com、vibearcade.com、stormplay、app.deadsimple.games、furic.github.io、tricks.de、diaryofamadchaos、jams.team | 25 项 | gamesalchemy.substack.com TLS handshake/000；hybridlabs.games TLS 35；benwheatley.github.io 被域名安全策略拦截；indienova 39132/39397 正文在动态组件里；部分 itch 页 000 |
| Hacker News（Algolia API） | search/search_by_date 多组 query（worldbuild bench、volt nomad、AI browser game jam、AI game level design、Claude Code game dev）；读 item 48865303、44463967、47600002 的评论树 | 0 项作品；3 条边界线索 | news.ycombinator.com 直连 WebFetch Socket closed，改用 Algolia；HN 未出现具体的“AI 游戏第二次改关卡”案例；只留下 ben_w“awful-bordering-useless at level design”、Simon Willison 的 Safari/Chrome 回放不同步、mypalmike 的输入录像/精确复现 |
| Reddit（Arctic Shift） | r/aigamedev 的 posts/ids 与 comments/tree：1xgtqex、1xmtwht、1xowe1p、1xl9qr5、1xi6kxm、1xnopb2、1xmtel6、1xinzoz、1xn64gt、1xnd1t5、1xhbj22、1xoi8dp | 8 项（Wasteland Renegades、Freight Fright、Daily Dose、Limina、Silent Entry、One More Broadside、Still Hour、Gopher It） | www/old/api.reddit.com 403/429/TLS 失败；eddrit、downdoot、reddit.fsky.io 均被人机挑战/301；Arctic Shift 分页到约 200 帖后 422，部分评论树为空，部分查询 Timeout；1xnx3w5 已 [removed] |
| TapTap（网页 SSR） | app/moment/tag/developer 页逐个取正文与配图原链：moment 857791875526952608、860623916882724394、858250506848440289、860184092862318690、860634192520678606、861778491811564616、855967114937238417、857701579598334467、859821701528027390、860294180608411729、861023722948003179、861593675556196304、861037896361050801 等；app 954910、960864、963039、964250、972651、978037、957599、982445；tag 聚光灯与开发者日志/全民试玩 hashtag | 25 项 | “打开 APP 试玩”需客户端/登录，未启动；作者主页返回混淆反爬负载；`webapiv2` 搜索 400 `csrf_token_expired`，by-tag/feed 404；评论区与回复未完整渲染；用户页 JS 空；聚光灯活动页只是预约页 |
| 中文技术社区与作者页 | 掘金（猫咪守卫队、颜色排序）、cnblogs（考了又考）、知乎、少数派（茫室）、机核、微信公众号、小红书、NGA、indienova、kongchang.com | 8 项 | 知乎专栏 403；公众号多篇“当前环境异常”验证页；小红书 item 页空/访问不到；NGA 403；V2EX、linux.do TLS 证书/握手失败；kongchang 429；indienova 部分正文在动态组件 |
| Steam / SteamDB / App Store | store appdetails、ISteamNews、iTunes lookup：Iron Curtain Call、灵山未至 4944390、无限循环：后室 3690690、Liftbound | 3 项 | Steam 评测 JSON 302/空；steamcommunity 讨论 TLS 握手失败；SteamDB 403；ISteamNews 对灵山未至/翻面返回 newsitems=[]；App Store 重定向中国区 Today |
| itch.io / game jam | AI Jam 4 的 entries/results、Jamference 提交页、GamesByAI 收录页；VOLT NOMAD、A Rock and a Hard Place、Wicklight、DEEP、Catbot、Silent Entry、Wasteland Renegades 等入口 | 0 项可核（仅 2 组搜索/收录摘要线索） | 本机 DNS 把 itch.io 解析到内网拦截地址，TLS handshake 失败（curl exit 35、HTTP 000），WebFetch Socket closed；itch 游戏子域与 jam submissions/results 均 000；只有 itch.io/jam/jamference-ai-game-jam-hack-1/rate/5119422 一次 200；未启动播放器 |
| B 站 / YouTube | 只读标题、UP 主、发布日期、简介与关联系列元数据：BV1AimaYxEjh、BV1aN411S7ya、BV1qA3r6rELg、BV1vCxj6MEYC、BV1Go4y1M7Ae、BV1Dm1gBFEk9、BV1nKsX6jE7r、BV1RYxv6oEtw、BV14wga6tEck；YouTube 用 noembed 取标题/作者 | 3 条线索（星光小队、翻面、时囚） | B 站视频页 412，view API 返回验证码/错误页；YouTube 直连 000，Invidious/Piped 全 000；按任务不加载播放器、不播放音频/视频，评论区未读 |
| 学术与基准 | arXiv export/HTML（2605.07342、2610.05033、2604.07752、2603.07106、2609.39045、2610.02331、2610.08621、2410.01791 等）、J-STAGE 论文 PDF、Zenodo PDF、SSRN、Semantic Scholar references/citations、HuggingFace | 10 组方法/基准 | Semantic Scholar 部分 429；FREYR references 空；GameCode4D 数据集页 000；SSRN 7502203 只有 OpenAlex 元数据；部分论文正文未逐页读 |
| 新工具/平台（近 3 个月） | Google Playground、Unity Spark、Meta Horizon Create/Studio、Playgama MCP/Sandbox/Bridge 2.2、SoonPlay、GameFactory-3A、game-builder-mcp、Godot Editor/Loop MCP、Ludus、NodeTool、Noobi.ai、game-exa、Game Dev Agentic Skills、Roblox Planning Mode/Playtesting Agent、Razer QA、UE5.8 MCP、GameMaker GM-CLI | 20 组工具/平台 | Playground 302 到 accounts.google.com 登录；Unity Spark waitlist，只有 Space Corridor 一个可玩 demo；Horizon waitlist；SoonPlay 正文由 JS 渲染、公开 API 只有 3 条展示数据；Playgama 博文没有 sandbox 独立原始链接；Epic/Unreal 官方页 403 Cloudflare；Unity Discussions 后续查询非 JSON；Fab 搜索页未提取到评测正文 |
| WebSearch / 通用搜索引擎 | 本会话 200/200 用尽；中英文换词覆盖 level redesign/second pass/playtest、关卡重做/路线/波次/遭遇、site:itch.io、site:taptap.cn、AI ゲームジャム レベルデザイン 等约 25 组 | 0 项可直接核（只作发现入口） | 额度耗尽后无法补 site: 查询；Bing 中国站返回无关结果；DuckDuckGo 证书被劫持到 `*.facebook.com`；Mojeek 403；Google/archive.org/r.jina.ai 000；WebSearch 对“关卡二改”类短语召回差，多返回教程/工具页 |

**第二轮取法**：先按 6 个来源角度并行扫，再对已收候选做 3 轮“顺着引用/被引/评论区/作者其他作品/收录列表”追踪，直到新增大多已见过；链接核对用脚本并行 curl，按状态码与标题判断，标题看不出时再打开正文。未登录、未发帖、未联系作者、未启动游戏/浏览器/播放器/音频。

### 1.3 第三轮（u3）

第三轮按 6 个来源角度并行扫，再沿候选引用/被引/评论/作者其他作品追到饱和；链接核对通过的候选池约 140 项。各行“得到”是本行覆盖量（跨渠道重复计，含非候选索引/工具），不是候选池总量；去重后本轮新增具名作品/项目约 70 项、工具/方法约 68 组，另 1 项按规则排除（Among Gas，§6.1）；Emberwick 转交不计。与前两轮重复的 Voltane、CORO SOLTO、Familiar、Emberwick 只在对应条目补证，不重复计数。

| 渠道 | 实际看了什么、取法 | 得到（本行覆盖量） | 读不到及原因 |
|---|---|---|---|
| 官方团队与高质量项目自述 | Steam Web API：`appdetails`＋`ISteamNews` 拉 Fire Field（4527100）全部 27 条公告、More Fireballs（5037670）公告全文，再用 `store.steampowered.com/news` 永久链接与 Steam CDN 图逐条核 200；GitHub 仓库 HTML/raw/`commits.atom`/PR；作者站 cclliang.com（e1–e4）、zenn.dev/abyssgate、blog.beatdjam.com、beltoforion.de；daily.dev 对 Web Dev Cody 视频的摘要；TapTap SSR；AI Transparency Index 转录的开发商 AI 披露 | 9 项（Fire Field、More Fireballs、云海神殿、涌现之野、涌现、Sector Dive、OpenCodeGameStudios、GodotMaker、Grey2Art）＋若干工具 | Steam 社区公告页（4527100/5037670）curl 000、TLS 握手失败，正文改 `ISteamNews` 取得；Steam 新闻页 JS 渲染只有导航页脚；YouTube `RNIX-Re9k4o` 按任务未播放；skillsmp 创作者页 403；涌现的 moment 页无可玩入口，同名 app/963011 归属无法确认；GDC 2026 Tencent IntelliScene 只有 PDF/二手笔记，未列候选 |
| GitHub 头部覆盖 | `github.com/search` 的 `react-app.embeddedData`（不依赖 API）查 repositories/issues/commits，按 stars、updated、committer-date 排；topic:ai-game/ai-generated-games/vibejam/text-to-game/threejs-game/claude-code-game 等 8 个 topic；短语 `level redesign`、`level layout`、`route pass`、`encounter pass`、`pacing pass`、`reworked levels`、`redesigned level`、`blockout`、`graybox`、`after playtest` 等；逐仓读 README/docs/GDD/PLAYTEST_LOG/commit/PR/release/LICENSE；WebSearch 补 `site:github.io`、`site:github.com` | 7 项（Survive the Night FPS、Skate Escape、POWER TRIP、JumpCastle、NEON TRENCH、TownStudy、GameGold）＋8 组索引/工具 | 未认证 REST 60 次/时 403，后半程改用 HTML/raw/commits.atom；code search 需登录；`ts-kyle-on-duty` 404/私有，QFSHIVE、excaliburSkate、roguelike-FPS、Project-Elitewake、Regressor-s-Echo 404 或无 README；带引号短语搜索常返回 0，只能当作该措辞检索为空，不能当作不存在；GitHub 站内另有模板化“devlog”仓库，读后为无关导流页，已排除 |
| 英文从业者与技术社区 | HN Algolia `search`/`search_by_date`（AI level design、level generation game、level redesign、encounter design AI、second playtest、rebuilt the level、redesigned the level、level design llm 等 20+ 组）；Lobsters `/t/games.json` 最新 25 条；dev.to API（gamedev 100 条、leveldesign 9 条）；Arctic Shift 的 r/aigamedev 20 个帖子正文与可读评论；作者站 beltoforion.de、gamedev.intelligentartifact.com（RSS 247 条＋production/playtesting/game-design/postmortems/level-design 标签）、mythiclemon、corginetwork、thecreatorsai、thegdex、crawfis.com、makegamewithai；gamedeveloper 2010 文 | 2 项近门槛（Fluchtpunkt 只有过程、Wasteland Renegades 只有 Reddit 正文）＋方法 6 组；0 项全过门槛 | itch.io 全站 DNS 解析到内网拦截地址、TLS 000，Wasteland Renegades/Silent Entry/Nightshoal/PCB Defense/Freight Fright/AutoFarm 的 itch 页与 devlog 未读；Reddit 直连 403/429，Arctic Shift 部分 422/429/Timeout、评论树不全；HN 评论全文检索噪声大，未定位到“AI 游戏第二次改关卡”的原帖；Lobsters `search.json` 400、tag 分页无效；Creators AI 正文在订阅墙；crawfis.com 403；GDEX 只有摘要页；Loom 分享页只返回“运行较慢”壳页 |
| 中文社区 | WebSearch 约 30 组中英文换词（AI 生成游戏关卡 第二次修改、关卡 重做/推翻/整关重做、三版/两版、TapTap 开发者日志 关卡 重新设计 路线 第二版、site:juejin/zhihu/sspai/gcores/okjike/cocos/indienova/bilibili、AI 赛车 赛道 重做、3D 动作 白模 重做、Steam 抢先体验 关卡 重做 等）；TapTap SSR 的 moment/app/review/topic/developer 页；掘金、少数派、机核、即刻、indienova、Cocos、小红书、公众号；Steam `ISteamNews` v2（4957110、4868150、4747710、2922170）；VibeHub 作品页与 changelog；B 站元数据 | 约 26 项（五行、涌现之野、涌现、过拟合猎手、织Weave、翻面、涌·墨卷、寂静园、SpectreX、仙门守护者、无限世界、齿轮塔防、Amnesia Bullet、星尘战线等 VibeHub 7 项等；其中翻面、涌·墨卷、齿轮塔防为前两轮已有条目，本轮只补证，不重复计数） | 微信公众号“当前环境异常”验证页；知乎专栏 403；小红书 item 页空/访问不到；NGA 403；V2EX/linux.do TLS 失败；CSDN 返回混淆脚本；indienova 403；B 站视频页/opus 412 或验证码；TapTap 试玩 DEMO“打开 APP 试玩”需客户端/登录，作者主页返回混淆反爬负载，评论区只 SSR 计数、回复正文未渲染；WebSearch 200/200 用尽 |
| 真实使用中的问题与反馈 | TapTap 的 app/review/topic/moment 页逐页抽正文与作者回复（18 个 app，评价数 0–60）；GitHub search/issues 加 issue/PR 网页与评论；Unity Discussions、Godot Forum JSON、Roblox DevForum（含 50 楼全帖）；Reddit Arctic Shift 的 posts/ids、comments/tree、posts/search；HN Algolia；Fab 搜索 JSON 与 listing 页；Steam `ISteamNews` v2 与 store RSS；AWS 中国博客；WebSearch 补充 | 0 项新增全过门槛作品；新增近门槛 1 项（Pawnshire）＋加强既有 3 项（CORO SOLTO、Voltane、Familiar）＋工具/陷阱 10 组 | itch.io 000；Reddit 403/Arctic Shift 空树（1xowe1p、1x9g44f、1xnd1t5、1xg17ag 等 comments/tree 返回空）；Fab Reviews 面板 SSR 为空、`/reviews` API 404；Unity Asset Store `search/results.json` 404；Steam 评测 JSON 302/空；SteamDB 403/Cloudflare；TapTap 回复正文未渲染；NGA/知乎 403；CSDN 混淆；B 站 412 |
| 兜底：近 3 个月新工具/做法 | WebSearch 约 18 组（AI game level design tool 2026、LLM automated playtesting 2026、AI 关卡设计 工具 2026、level design agent October 2026、“level as code” YAML、golden level snapshot regression、new benchmark game creation 等）；WebFetch 逐页读 README/作者文（mapedit、GRIT、Gozen、GenMap、Playbench、JevLaya、pyxel-mcp、XEngine、Ignis、DungeonFlux、Baldies、Springfield、PlayProof/AWS、Josh Hamilton、Strayspark、CrushPress、Summer Engine、MythicLemon、Ctrl+Create、arXiv 2608.21833/2610.26098/2609.25652）；GitHub REST 取 15 仓元数据；HN Algolia；danyow.cn《AI 引擎日报》10-06/10-12/10-23/11-03/11-05 五期；Playground Arcade HN 帖与聚合页 | 约 68 组工具/方法（Playbench、pyxel-mcp、Gozen、GenMap Lite、XEngine、Ignis、Apeiron、GRIT、mapedit、PlayProof、GameXpert-Bench、CEGame-Bench、GameDirector、G3D.AI 两文、Ctrl+Create、Recursive Game Creator、Summer Engine、Prowl、Ritmo 等） | ACM 全文 403（Ctrl+Create 只有 Crossref/Semantic Scholar 摘要）；g3d.ai《Automated Playtesting》被域名安全策略拦截，只有 200＋摘要；crawfis.com 403；playgroundarcade.com Cloudflare 403；Epic AI MegaJam 官方页 403；npm 403；Google Play 000；App Store 重定向中国区 Today；repartee/gtausterity Vercel 000；VibeHub `/api/works` 无逐版本发布日期；WebSearch 200/200 用尽 |
| VibeHub 作品 API | `/api/works?page=1..14&pageSize=20` 返回 262 个作品（title/description/screenshots/playUrl/currentVersion/releaseCount/latestReleaseAt/tagNames）；批量抓 261 个作品页，按“v/版本号/日期”解析 changelog，筛出有第二次关卡/遭遇修改且可在线玩的 | 7 项（星尘战线、灰区行动、SCP 收容失效、向上吧！芽芽、镜之边缘、骑马与砍杀、Arcane Realms） | 人机分工多只到平台模型标签（DeepSeek/Codex/GPT/GLM/Trae 或“AI 代码·AI 配乐·AI 配音·AI 生图”），未见作者写清人机边界；许可/成本未披露；个别作品同日多版，无法精确到小时；未登录看不到作者动态全文 |
| 链接核对与边界 | 所有候选链接用 `curl -sL`（GET）核状态码与正文，需要时再 `curl -sIL` 看头；只读公开页、API、源码与作者静态图 | 链接核对后保留约 140 项 | 详见 §8.1；**HEAD 与 GET 可能不一致**：本次 `survivethenightgame.com`（Survive the Night FPS 的部署站）的 HEAD 返回 404、GET 返回 200 且页面标题/描述正常，因此 404 必须再用 GET 复核后才能判定；未启动游戏、浏览器、播放器，未登录、未发帖、未联系作者；链接可达不等于已看完整连续实机 |

## 2. 筛选口径与等级

排序按任务给的门槛，不按热度、star 或“看起来完整”。**A 级只表示本轮建议先深挖，不是品质验收。**

- **门槛 1｜真实二改**：路线/空间布局或遭遇节奏的实际第二次修改；关卡与碰撞、导航、触发的联动；复用与重生成成本。只换光照/材质、只做静态场景展示的不收；通用发布后修复和输入/UI 改动排除。
- **门槛 2｜可玩入口**：当前可玩链接，或完整连续实机原页。只有宣传页、waitlist、下载包承诺的不进 A/B。
- **门槛 3｜作者过程**：作者原始 devlog、README、长帖或复盘；转述只作线索。
- **门槛 4｜静态证据**：作者公开静态截图原始 URL；只有仓库相对路径或缺链的降级。
- **门槛 5｜版本与日期**：可查；未知就写未知。
- **门槛 6｜AI/人工分工**：可读；只写“AI 做的”而没有人与模型边界的降级。
- **门槛 7｜许可与成本**：代码、资产、模型、音乐能分开；未知不推算。
- **作者门槛**：原作者身份、真实作品入口或二改证据不够就排除，并给具体原因。

**前两轮 A 级 4 项**（HollowARK、Voltane、Solhex、时囚 BetweenTicks）全部满足上述硬门槛，仅许可/成本/实玩三项留未知；另 **A- 1 项**（Bash Fighter，只缺版本 tag）。**前两轮 B 级 29＋18 项**至少缺一项：截图原链、版本号、许可、作者身份，或“二改后仍保持可玩节奏”尚未验证。**前两轮 C 级 50＋14 项**只有过程、只有入口或二改未落到路线/遭遇层。**前两轮 D 级 9 组＋2 项**按任务规则排除或转交。**工具/方法 13＋23 组**不是作品，只补验证链（其中 Dustlight、J-STAGE 论文与 RSD 只作管线/方法证据，不计作品候选）。第三轮与三轮总计见下。

**第三轮新增 A 级 3 项**（群侠传：幸存者、Fire Field、We're Gonna Need More Fireballs）、**A- 3 项**（Hora Cero、Pawnshire、Sector Dive Extended；Journey to the West 因入口仅 SPA 壳降丙级）、**B 级 23 项**（§4.6 3 项＋§4.7 20 项；§4.6 的 3 项同时列为 A-，不另加总数）、**C 级 38 项**（§5.7）、**排除/转交 1 项**（Among Gas，§6.1）、**工具/方法约 68 组**（§7.2）。三轮合计：A 7、A- 4（其中 3 项含在 B 70 内）、B 70、C 102、D 9 组＋3 项、工具 36＋68 组。上述计数只统计本产物已列条目，不把索引/榜单条目当候选。

## 3. 甲级：第一轮 3 项＋第二轮 1 项＋第三轮 3 项（另 A- 1＋3 项）

### 3.1 Voltane（3D 遥控车竞速）

- **可玩**：<https://playvoltane.com/play/>（开放 beta，当前 build 0.1.1；本端未启动）。
- **作者过程**：作者原帖 <https://www.reddit.com/r/aigamedev/comments/1xgcszc/>、分工帖 <https://www.reddit.com/r/aigamedev/comments/1xgsgmi/>、开工时间帖 <https://www.reddit.com/r/aigamedev/comments/1x863xe/>（Reddit 直连 403，经 Arctic Shift 归档读正文）；英文更新日志 <https://playvoltane.com/en/updates>（本次实读，261 条更新，按日期分组）。
- **作者静态图**：关卡截图 <https://playvoltane.com/media/game/site/level-maison-960.webp>（客厅/房屋）与 <https://playvoltane.com/media/game/site/level-jardin-960.webp>（后院）（本次均 200）；另有宣传 key art <https://playvoltane.com/media/hero/maplewood-patrol-1920.webp>（本次 200，不是关卡截图）。
- **版本与日期**：2026-09-20 左右开工（作者 2026-10-17 帖 1x863xe 原文 “Started working on Voltane … around the 20 September”）；beta 于 2026-10 初上线（2026-10-06 帖已称 early beta，2026-10-17 帖称约十天前上线，2026-10-27 帖称已在 open beta）；更新日志自 2026-10-04 起记录（2026-11-06 页首：261 条、34 天），有 2026-10-21、10-23、10-28、11-03、11-06 等条目；2026-10-28 关卡扩为 47 条赛道变体。
- **AI/人工分工**：Claude Code/Opus 5.5 写代码、物理、网络与工具；人做设计、手感与试玩。作者分工帖原文称 game feel、level pacing、砍功能都来自数百次试玩和玩家反馈。
- **一次具体二改**：2026-10-21 的 “The Backyard, a second finishing pass” 是后院第二次收尾，以干砌石墙、约三十件道具的材质和割草机/棚屋/野餐桌为主，可驶入几何只加鸭板/滑梯等小改动；同日另一条 “Maplewood: the big corner walled off” 才是路线级改动：弯道起点用锥桶墙封住、整弯围栅栏，客厅捷径成为替代路线；§9 的默认跑圈因此用 Maplewood，The Backyard 只作简单闭环对照。路线与碰撞二改的主证是 2026-10-23 的客厅捷径穿草坪不再算数、Maplewood 房屋碰撞对齐可见墙面并取消门廊前隐形墙，以及 2026-11-03 的 Moonlight Mart 卸货台隐形墙、14 Oak Street 浴缸跳跃判定与床下切口封堵。作者原帖下有玩家直说 “level design in particular is heavily lacking”，可作为二改后的真实反馈对照。
- **许可与成本**：更新日志与站点版权归 Borderline Games；未见开源许可，成本未披露。这两项未知。
- **缺口**：本端未启动；开放 beta 的 WebGL/桌面可运行性未验；没有完整连续实机；玩家对关卡设计的负评说明“改过”不等于“已达标”。

### 3.2 Solhex（3D 太空工厂探索）

- **可玩**：<https://kraigadams.com/solhex/play/>（v173，浏览器可玩约 4 小时；本端未启动）。
- **作者过程**：<https://kraigadams.com/solhex/devlog/>（本次实读，165 条，逐版记录 v1–v173）；作者 journal <https://kraigadams.com/journal>。
- **作者静态图**：<https://kraigadams.com/solhex/img/v103-bigmap.webp>、<https://kraigadams.com/solhex/img/v85-ping.webp>（本次均 200）。
- **版本与日期**：v173，2026-10-24（构建 10-23 23:34）；v64 起公开试玩记录；v99/v103 均在 2026-10-19。
- **AI/人工分工**：作者设计、逐版试玩并给修改意见；Claude 写全部代码。devlog 每条同时保留作者的原始指令时间和 Claude 的改动说明。
- **一次具体二改**：v99 的完整试玩（第 1–6 章，53 分钟有效游玩）发现第 4 章“解码先锋信号”实际耗时 26 分钟，超出 15 分钟目标窗口，于是把数据卡从 30 张降到 20 张，test player 约缩短 3 分钟；第 1–3 章所有目标都落在窗口内。v85 把岩石改成漂移轨道、缩短空间站/飞船视野、给传感器 ping 半径与 20 秒揭示；v103 把地图拉大（铜 2.5–3 km、硅 6.4–7.4 km）并给每章加威胁；v173 按网站录像改开场引导。
- **许可与成本**：未见代码/资产许可声明，成本未披露。两项未知。
- **缺口**：本端未启动；test player 与作者自玩不能替代真人节奏研究；“15 分钟窗口”是作者定的目标，不是行业标准。

### 3.3 时囚 BetweenTicks（3D 平台跳跃/解谜）

- **可玩**：<https://www.taptap.cn/app/984399>（TapTap 官方试玩 DEMO，v10.21.755，2026-10-21，PC 端；需 TapTap 客户端，本端未启动）。
- **作者过程**：Day15 <https://www.taptap.cn/moment/860351015726089068>、Day17 <https://www.taptap.cn/moment/860717508045308760>、Day20 <https://www.taptap.cn/moment/861869910324678050>（本次均 200，读正文）。
- **作者静态图**：同机位灰模/美术对比 <https://img2-tc.tapimg.com/moment/etag/Fk76uDYogMUNYYhFNjeYd1NTrefL_20261017024700.png/_tap_ugc.jpg>、灰模路线 <https://img2-tc.tapimg.com/moment/etag/FqasbMYDhoEivLvPpTZR140u4t30_20261017024734.png/_tap_ugc.jpg>（本次均 200）。
- **版本与日期**：2026-10-21 发布；v10.21.755；PC 端试玩。
- **AI/人工分工**：人搭关卡、定手感并验 AI 输出；Codex 实现玩法/美术并起草日志。
- **一次具体二改**：Day15 把灰墙灰地换成房屋车辆时，用同机位灰模/美术对比与线框叠加保住原跳跃路线；合并门窗小起伏碰撞、放缓红时坡顶过渡、移开被房屋挤压的压力板。Day17 泳池从平面改为挖池，跳板 2.5→4 m。Day20 把散关连成一段旅程并改加载节奏。Day19（<https://www.taptap.cn/moment/861593675556196304>）又把第三关重点从“等时间切换”挪到“自己安排切换”，自动循环和每秒报时先退场；01–08 号钟表改成可交互、表盘可拆装；压力板/检测器改为信号激活切一次、取消再切一次；绿屋朝上的碰撞面熨平。Day18（<https://www.taptap.cn/moment/861037896361050801>）减弱第一关雾感/提高远处能见度/提亮红时暗部，水面碰撞保持平整，末段复活点保留风车与破坏进度。
- **许可与成本**：未披露。两项未知。
- **缺口**：作者只做局部走动/单点测试，完整路线与手机性能未验；本端未启动；许可/成本未知。

### 3.4 HollowARK（浏览器挖掘/物流基地，v71）

- **可玩**：<https://kraigadams.com/hollowark/play/>（v71 早期构建，浏览器可玩；本端未启动）。
- **作者过程**：<https://kraigadams.com/hollowark/>（页面 2026-10-15 更新）；逐版 devlog <https://kraigadams.com/hollowark/devlog/> 共 128 条，按时间戳记录 Kraig 的原话、Claude 的改动和发布版本，最新到 v91。作者自述“a game I'm making with Claude”；同站另有 Jumpgate，但 HollowARK 是不同作品。
- **作者静态图**：v48 物流线与岩壁 <https://kraigadams.com/hollowark/img/v48-sharp-rock-line.webp>、v36 隧道线 <https://kraigadams.com/hollowark/img/v36-tunnel-line.webp>、v71 洞窟花光 <https://kraigadams.com/hollowark/img/v71-dark-cave-bloom.webp>（本次均 200）。
- **版本与日期**：可玩主 build v71（2026-10-14 20:01 构建，页面 2026-10-15 更新）；devlog 共 128 条、已到 v91（2026-10-15 08:45）；v48/v59 在 2026-10-14 同日连续发布。无公开发布 tag，版本号来自页面/devlog。
- **AI/人工分工**：Claude 写全部代码；Kraig 做设计、逐版试玩并给修改意见，devlog 同时保留原始指令时间与 Claude 的改动说明；这就是“人定目标与验收、AI 实现并记录”的分工。
- **一次具体二改**：v48 “Sharp rock, and lines that keep off it”——作者指出岩石像素化、物流线“cut through rock”，Claude 查到两个原因（岩石按 2 米/像素绘制；物流线走移动网格而手绘墙会鼓出网格），把线改走隧道中心并顺弯；v59 完整开局试玩后，把洞窟改成彼此不相连以保证“每张图第一铲都能开工”（旧版有洞窟贴到起始洞导致开局无法开始），并用脚本化完美玩家把开局从 57 分钟压到 39 分钟；v91 把第一章重做为由“矿工→传送带→熔炉→方舟”组成的单条生产链（物流线改为可放置传送带，目标按顺序教学；原型 test player 约 21 分钟）；v50–v51 让方舟先等无人机切开车道、基岩不可钻；v33 首夜袭击从“几乎团灭”改为 5 只侦察兵且方舟激光必胜。v71 是美术/第一章观感 pass（living caves、bone-and-amber 地表、标题蓝图、暗洞与可读屏幕），不算路线/空间或遭遇节奏二改。v48/v59 有作者原话与静态图；v91 有作者原话与版本号，但该条没有截图（带图的是 v48/v59/v71 等条目）。
- **许可与成本**：页面未声明代码/资产许可，成本未披露；两项未知。
- **缺口**：本端未启动；没有完整连续实机；“57→39 分钟”是 v59 主 build 的脚本化完美玩家口径，v91 的约 21 分钟是原型口径，都不是真人首次游玩时长；许可/成本未知。

### 3.5 Bash Fighter（2D 联机平台格斗，A-：只缺版本 tag）

- **可玩**：<https://bashfighter.com/>（200，JS 应用壳；本端未启动）。
- **作者过程**：<https://github.com/Bash-Entertainment/bash-fighter>（AGPL-3.0；README、AGENTS.md、CI、docs/ADDING_A_STAGE.md、docs/MEASUREMENT.md 齐全）；本次浅克隆的 340 条提交里 328 条作者为 agent-589（agents.andonlabs.com 域），日常开发与 PR 评审由 AI agent 完成。
- **作者静态图**：仓库内真实比赛截图 <https://raw.githubusercontent.com/Bash-Entertainment/bash-fighter/main/docs/images/gameplay-ffa.png>（200）。
- **版本与日期**：无版本 tag（package 0.0.1）；提交日期可查：The Atoll 2026-09-10 加入，2026-09-11 两次修复，arena-shrink 09-09/09-10 三版，09-19 平台填充对比度。这是它不进 A 的唯一硬缺口。
- **AI/人工分工**：AI agent 写代码、开 PR、跑测试；人类负责方向与合并（组织页/README 口径）。docs/MEASUREMENT.md 明确“生产日志是 ground truth，离线 harness 与之冲突就是 harness 错”，把验收锚在真实对局而不是自测。
- **一次具体二改**：The Atoll 上线后，生产环境两只 bot 在 3.3 秒被 KO（4%/11%），于是两座岛出生间距 40→28 单位，并把同类缺陷做成全舞台审计与永久测试（commit <https://github.com/Bash-Entertainment/bash-fighter/commit/99b53d8>；同批 the-spire 40→30、the-undercroft 38→32、the-foundry 40→27）；同日按生产 match m4（2026-09-11 05:49 UTC，唯一真人 22% 伤害、3.5 秒首个被 KO 于 The Foundry）把 blast-zone 边距改成按地面盒 8% 比例并重排 Foundry 左舱真人出生位（commit <https://github.com/Bash-Entertainment/bash-fighter/commit/0fc9eb7>）；arena-shrink 先阻尼淘汰反馈、终局圈 0.55→0.65（<https://github.com/Bash-Entertainment/bash-fighter/commit/5935991>），再用真实平台包围盒重写（<https://github.com/Bash-Entertainment/bash-fighter/commit/6103f99>），最后把终局圈宽夹到幸存者实际可站平台，修掉 The Undercroft 隔沟两人 36000 tick 无 KO（<https://github.com/Bash-Entertainment/bash-fighter/commit/dc997e3>）；09-19 又把平台填充对比度从 1.19:1 提高，解决“看不见脚下的地”（<https://github.com/Bash-Entertainment/bash-fighter/commit/bb046ed>）。
- **许可与成本**：代码 AGPL-3.0；素材/音效许可未单独声明，成本未披露。
- **缺口**：2D 平台格斗，不是 3D 动作/竞速/射击；无版本 tag；本端未试玩；没有完整连续实机；素材许可与成本未知。

**为什么先深挖这几项。** HollowARK 回答“AI 写全部代码、人逐版设计/试玩时，怎样把每次空间/物流改动写成一页可复核记录”，且 57→39 分钟（v59 主 build 的脚本玩家口径）可直接借到 Star 的开局时长基线；Bash Fighter 回答“用生产 match 的真实结果驱动出生间距、blast-zone 和缩圈规则，并把缺陷固化成永久审计”，是二改—验证—防回归最硬的一条链；Voltane 回答“路线怎么改、用什么挡住捷径、碰撞是否跟着可见几何走”，且最贴 Star 的公路弯道；Solhex 回答“先定每段目标窗口，用可重复 test player 量实际时长与空转，再改路线/成本”；时囚回答“换美术/几何时怎样不破坏原跳跃路线”，给出同机位灰模＋线框的检查法。五项分别覆盖逐版记录、生产数据回归、路线规则、节奏测量、空间语义保留，不重复同一角度；Bash Fighter 的品类（2D 格斗）与其余四项不同，所以只作 A- 和工作流参照，不替代 3D 样本。

**为什么不是它们。** Iron Curtain Call、Pull the Plug、Fable Katamari、多米诺人生、The Fallen Citadel 的二改证据同样强，但分别缺“逐版差异”、版本号、逐次二改的前后对照、版本号、许可。它们放在 §4.1，作为 A 级替换项；补齐缺口后可替换 A3。

### 3.6 群侠传：幸存者（Steam 抢先体验，Nenly；第三轮新增）

- **可玩**：<https://store.steampowered.com/app/4957110/>（Steam 抢先体验 2026-08-11 上线，免费可玩；本端未启动）。
- **作者过程**：AI 披露页 <https://store.steampowered.com/app/4957110/>（商店页的 “AI Generated Content Disclosure” 段）、V0.1.2 公告 <https://store.steampowered.com/news/app/4957110/view/1841579228672838>（本次均 200；公告正文经 `ISteamNews` v2 取得，steamcommunity 原页本机 000）；另有作者访谈口径称约 1300 commits、50 亿 token、总成本约 5000–6000 元，本端未取得访谈原文，按转述/待核处理。
- **作者静态图**：<https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4957110/5f5dcc5771ac288ef76cd3c6c8e09084aa9b0efa/ss_5f5dcc5771ac288ef76cd3c6c8e09084aa9b0efa.1920x1080.jpg>（本次 200）。
- **版本与日期**：样本 V0.1.2（2026-08-23；公告给出完整数值，并另有一段性能优化的压测说明，见下）；当前已到 V0.2.3（2026-10-26 公告，<https://store.steampowered.com/news/app/4957110/view/1847286114044092>，本次 200），V0.2.0 为 2026-10-01。本次“第二次重排”的证据只针对 V0.1.2。
- **AI/人工分工**：Steam AI 披露写明代码、部分角色/场景/UI 美术、动画/配乐/音效由 AI 辅助；**玩法设计、数值平衡、手感调校和每次试玩判断由人完成**。
- **一次具体二改（遭遇节奏）**：21–24 波慢启动被压缩、压力前移到 30–40 波；Boss/精英的 HP、伤害、移速改为三轴独立成长；30 波起部分近战怪在更近位置生成（比例随波次升至 60 波封顶），落点预告从 0.5 秒延长到 0.8 秒、标记更大更亮；银钱每 5 波衰减 8%（保底 40%）、财神像利息 10%→6%、脚速 100 点以上按 35% 计入、满配移速倍率约 4.66→2.93。**注意**：公告里的“固定场景＋固定敌人数的低配测试机跑 10 轮”位于 optimization 小节，原文明确是验证 GPU/CPU 优化效果（“The effects of these optimizations have been verified”），不是 21–24 波/30–40 波平衡改动的复跑；Endless 平衡段没有给出改前/改后同基线数据。作者未公布平衡改动的同基线复跑，试玩时需自建 10 轮基线。
- **许可与成本**：成本未见可核原文（作者访谈转述约 5000–6000 元，原文未取得，待核）；代码/资产许可未声明，属未知。
- **缺口**：本端未试玩；2D 幸存者不是 3D 动作/竞速；‘改后仍可玩’目前只有作者自测（且公告的 10 轮是性能压测，不是平衡复跑）与约 96% 好评，不是同基线实测；许可未知。

### 3.7 Fire Field / Firefield（Robe of Fire，Naoki Fujinaga；第三轮新增）

- **可玩**：<https://store.steampowered.com/app/4527100/>（Steam 抢先体验 2026-05-08 上线；本端未启动）。
- **作者过程**：Steam 公告正文经 `ISteamNews` 取得（steamcommunity 原页 TLS 000），v1.8.0 公告 <https://store.steampowered.com/news/app/4527100/view/1840944183776407>、v2.0 系列 <https://store.steampowered.com/news/app/4527100/view/1844751498224107>；作者另写“前期按玩家反馈逐条小修，随后做最大一次更新”，并记录被法国 RPG 站差评后逐条修复的过程。
- **作者静态图**：<https://clan.cloudflare.steamstatic.com/images//46077957/2f8f9dc1bc8b37d669087e6ed600c8df53f86124.png>（本次 200）；商店页另有截图。
- **版本与日期**：v1.8.0 于 2026-08-13；v2.0 自 2026-09-25 起共 5 篇。
- **AI/人工分工**：作者称全部约 18 万行代码由 Claude Code 写、自己不会编程；**关卡为程序生成（v2.0 公告写房间/走廊/门每次从头生成），人做玩法、数值与试玩判断**。作者自制的 Miso Editor 只把单张角色图转成 8/16/32 方向 sprite，不是地图编辑器。
- **一次具体二改（空间/遭遇整层重建）**：v1.8.0 把 B1–B5 整层重建，并加入 33 格圆形大厅的蜘蛛中 Boss（点亮三根柱子即可让落石破防，原文无顺序要求）；v2.0 把地牢重建为 8 层（房间/走廊/门每次从头生成），明确修掉“石棺/柱子挡路导致无法推进”的布局问题，并修掉敌人刷在物件上、刷在刚下来的楼梯旁；v2.1.6 另修“道具与楼梯挡门”。
- **许可与成本**：代码/素材许可未披露；成本只提 $20/月 Claude 订阅。
- **缺口**：2D 等距 ARPG，不是 3D 动作/竞速/射击；地牢是程序生成，二改是整层/整代重做而非单条手工路线；许可与逐项成本未知。

### 3.8 We're Gonna Need More Fireballs（More Fireballs；第三轮新增）

- **可玩**：<https://store.steampowered.com/app/5037670/>（Steam 2026-11-05 发售；本端未启动）。
- **作者过程**：2026-10-07 公告 “We Were Gonna Need More Fireballs. So We Rebuilt the Demo.” <https://store.steampowered.com/news/app/5037670/view/1846018067927652>（经 `ISteamNews` 取全文）；开发披露见 AI Transparency Index 转录 <https://aitransparencyindex.com/products/steam/5037670>。
- **作者静态图**：<https://clan.cloudflare.steamstatic.com/images//46236836/e20ad8a73cdb7c46fbbcceaf65a31be44842cdb7.png>（本次 200）。
- **版本与日期**：2026-11-05 发售；重建公告 2026-10-07。
- **AI/人工分工**：代码主要由 Claude/Claude Code 写；部分关卡是人在 Paint 画简单掩码后交 AI coding agent 变成可玩环境。
- **一次具体二改（同一 demo 的第二次空间/遭遇设计）**：8 月 demo 的 3 图/5 塔被作者自己重玩后否定，重建为 7 图/11 塔、首图改成完整教学，加入巨人/飞行怪/会戳塌崖壁的长枪怪、最后一波 25 万只虫。
- **许可与成本**：许可/成本未知。
- **缺口**：塔防/策略不是 3D 动作；无逐图前后对照；许可/成本未知。

**第三轮为什么先深挖这三项。** 群侠传回答“怎样把遭遇节奏改动写成可核的版本化记录”，且是三项新 A 中把平衡改动数值写得最细的一项（Fire Field 同样具备可玩入口、Steam AI 披露、版本号与截图原链，差异在公告没有逐项前后数值；More Fireballs 的 2026-10-07 公告也给出 3→7 图、5→11 塔、最后一波 25,000→250,000 只的改前/改后数量，但只到整版规模，不是按属性/波次逐项列平衡数值）；但它的 10 轮压测是性能优化，不是平衡复跑。Fire Field 回答“整层/整代重建时如何逐项修阻挡与生成点”，并给出 v1.8.0→v2.0 的连续记录；More Fireballs 回答“自己重玩后否定整版 demo，再按同一 demo 重建”的决策链。三者分别覆盖“版本化记录、整层重建、整版自我否定”，且都来自开发者自己的公告，不是转述；但它们都不是 3D 动作/竞速/射击，价值在流程与验证口径，不在品类替代。三项的许可与成本都未完整披露，试玩前不要由“可玩”推定可复用。

## 4. 乙级：二改证据强、但缺一项或多项硬门槛（29＋18＋23 项，其中 §4.6 的 3 项同时列为 A-）

### 4.1 最接近甲级的 5 项（优先补核后可替换）

| 作品 | 一次具体二改 | 缺什么，为什么不进甲 |
|---|---|---|
| [Iron Curtain Call](https://store.steampowered.com/app/5417460/Iron_Curtain_Call/)（Steam 商店页；正式版 2027-03-11；Demo 页 <https://store.steampowered.com/app/5451220/> 显示 2026-10-23 上线，作者 2026-10-30 原帖 <https://www.reddit.com/r/aigamedev/comments/1xj88ci/> 称 10-28 上线，两处日期不一致） | 作者 2026-10-30 原帖：demo 关卡经过四版，一次真人 playtest 后加了一整段；20 个工作日 3,929 commits；Claude Code 写代码/系统/HUD/无头测试，人做故事、笑话、剪辑和关卡判断 | 四版只有作者一句概括，没有逐版前后差异；本端未启动 demo；成本只说用了 6 个 Claude 20x 套餐，资产许可未知 |
| [Pull the Plug](https://ennui92.github.io/pull-the-plug-play/)（GitHub Pages 构建，含 Prelude＋mission 1–6） | [Day9](https://ennui92.github.io/ermis-dev/posts/pull-the-plug-day-9.html) 走完 Prelude–Mission 3，按 P 留 9 张截图、约十几个问题→46 commits；Mission 1 天花板按二段跳高度重做四版，Mission 3 危险在待机态可见，Mission 2 水改成从地面向上长；[Day24](https://ennui92.github.io/ermis-dev/posts/pull-the-plug-day-24.html) 六关全通 | 无版本号；Pages 构建只用 `main-*.js` 核到 mission 1–6，未启动；许可/成本未披露；2D 一键攀爬，空间维度比 3D 弱 |
| [Fable Katamari](https://fable-katamari.pages.dev)（v5，3D 块魂式动作；制作记 <https://github.com/aieo-product/fable-katamari-zenn>、设计书 <https://fable-katamari-docs.pages.dev/design>、MIT 源码 <https://github.com/aieo-product/fableDemoGame>） | v2 撤掉屋内/地形/墙方案；v3 把无限平面改成 3.6×3.8 km 箱庭东京路线（秋叶原→中央通→上野/浅草/丸之内/涩谷→晴空塔），用 DYNAMIC RE-BANDING 修约 370 处 curated 配置（含地标/摆件）的 tier 越级；v4 换 OSM 14,563 栋建筑、0.5 m 导航烘焙（r=1 100%、r=3 96.7%），按实测把 pacing 2.2→2.8；v5 修开场被地表/高架遮挡 | 作者身份只到 Zenn handle；制作记内有截图（`live-v*.png`）但没有逐次二改的前后对照；成本未披露；本端未启动 |
| [多米诺人生](https://agentcaseshare.cn/articles/article-17jx8bzp)（可玩 <https://domino-life.parkerluxu.space/>，本次 200、标题“多米诺人生·第一块倒下”） | L11 弹簧关因“接触方向与出射方向矛盾”整关重做（小球推牌→越过平台→落缺口→从上方压弹簧→进落地区）；目标从“点蜡烛”改为可见 item-zone 并加 `requiredEvents`；AI 批量产 20 关 JSON＋物理回放，人逐关试玩并决定重做 | 无版本号；许可与金额未提；本端未启动；只有单关重做，不是整章节奏 |
| [The Fallen Citadel](https://github.com/nansu0425/nan2026-game-src)（可玩 <https://nansu0425.github.io/nan2026-game/>） | Claude Opus 5 经 Unity MCP 生成三关地形/掩体/动线坐标；人改放置后用 `battle-stage-backport` 把 82 处手改写回数据（51 替换、31 移除；清单只记汇总数，不把文档示例坐标当实际回写项）；有可玩 WebGL 与前后对照文档 | 仓库没有 LICENSE，README 明确原仓库因外部资产许可而私有，本仓只放团队代码/文档；外部资产只限该构建；本端未启动 |

### 4.2 二改具体，但缺截图/版本/许可/作者身份之一（15 项）

| 作品与入口 | 一次具体二改 | 缺口 |
|---|---|---|
| [Shed Racer](https://dmnshd.gg/games/shed-racer) | AI 生成的首轮 career 赛道“很圆、几个弯加跳台”，同质且部分不可玩；作者改为明确指定弯道序列、加速带位置并手工重做部分赛道，赛道以 JSON 保存便于直接改；8 周、v0.6.3 | 无作者静态截图原 URL；Kenney 美术 CC0、后期闭源；成本约 Cursor Pro $60/月＋Google AI Pro $20/月 |
| [Wobble Wallop](https://evolutionaryarcade.com/g/wobble-wallop) | 36 个手工关卡；level prover/noisy-hand bots/economy sim＋录屏复盘：修重开确定性 bug；星级线从“0.3° 失手”改为 bot 分布；2-8/3-5/3-11 连专家 bot 都很少过而各补一只 critter；prover 瞬间发射、真人瞄准停顿会让方块倒塌，改成两发之间世界休眠并重解 4 关；独立 QA 修 15/36 手机镜头看不到目标、23/36 提示成功率≤8% | 作者仅 handle；无截图原 URL；许可/成本未知；本端未启动 |
| [Skyscrawl](https://evolutionaryarcade.com/g/skyscrawl) | 120 座塔的可攀爬路线由 Node 可解性工具验证；工具找出三处真实问题：横移跳不过、黑洞吸力扫到保证路线、保证链里出现会消失的砖导致回落 soft-lock；修法是消失/碎裂砖只作额外路线、绝不作唯一上行路 | 作者仅 handle；无截图原 URL；无真人长玩；许可/成本未知 |
| [Keepfall](https://evolutionaryarcade.com/g/keepfall) | 单关三段式城堡；Playwright 逐帧试玩后改掉同侧墙跳可爬塔外壁、骑士巡逻伸进落地区、双链不同步使交接变成计时考试、密室从外侧可见；beam-search solver 证明跳跃与速度各削 12% 仍可无伤通关 | 作者仅 handle；无真人试玩；无截图原 URL；许可/成本未知 |
| [Sunline GP](https://evolutionaryarcade.com/g/sunline-gp) | Opus 5.5＋Claude Code 生成的卡丁车赛道；第二版写明 AI 车每圈撞墙 48 次降到 1–3 次、跳台起跳 12/32 提高到 31/32，并在桥尾新增第二座跳台 | 作者仅 handle；数据来自自动跑；无截图原 URL；许可/成本未知 |
| [Fang the Fox](https://tinybitadventures.com/fang-the-fox-rebuilt-with-opus-5-5/) | Claude Code Opus 5.5 重做的 24 区域、5 Boss 浏览器平台游戏；无头 bot 从标题打到 credits，地图检查器证明每扇门/道具/火盆可达；发现最终区“塌陷砖路未点火盆就永久封死 Boss 门”的 softlock，改为会自行拼回的砖并让检查器标出被塌陷路切断的区域；又抓到 Dreamspace 一格进得去出不来的陷阱 | 页面写明 Claude Code 运行 Opus 5.5；作者静态截图 <https://tinybitadventures.com/content/11/uploads/2026/09/fang-frozen_throne-1024x640.jpg> 与 <https://tinybitadventures.com/content/11/uploads/2026/09/fang-crystal_cave-1024x640.jpg>（本次均 200）；版本/成本未知；免费可玩、MIT |
| [Blacklight](https://www.vibegamesstudio.com/blacklight/) | 按 30 天遥测重做开局两分钟：甲板琥珀色引导带改走位、教学卡从第 5 张提前到第 2 张、开场更快进入（[2026-09-08 changelog](https://www.vibegamesstudio.com/changelog/blacklight) 原文 twelve seconds sooner，即约 12 秒；同晚夜报 <https://www.vibegamesstudio.com/blog/2026-09-08-the-guard-that-had-never-fired> 记 eleven seconds shorter，两处口径不一致，未统一）、噬人怪延后到光束讲解之后；QA 首轮 7 次冷开有 4 次生成时面壁，二次修复后 7/7 朝向正确 | 工作室自称“零人类”AI 工作室，作者身份是否符合门槛待复核；许可/成本未知 |
| [密林：危机涌现](https://www.taptap.cn/app/974354) | 开发日志 02：作者试玩后嫌夜间波次张力不足，改成感染者全天进入，并要求围栏外群体先实际攻击围栏、破栏再进；日志 04：救援天数从 10 天→7 天→6 天；页面 2026-10-19，PC 端试玩 | 无作者静态截图原 URL；许可/成本未披露；本端未启动 |
| [涌忆](https://www.taptap.cn/app/982445) | 人做故事/谜题/关卡/地图标注，AI 写代码、豆包生图并做地图物件适配；AI 先把一个物件识别成多个可触发物、首轮自动适配偏差大，作者手工圈范围与位置做第二轮返工；第二章再加“角色与三角标识重合时标识上移”规则解决遮挡 | 无版本号；许可/成本未披露；本端未启动 |
| [失控协议：群潮之下](https://www.taptap.cn/app/963039) | 出兵原“首兵与后续两套计时/低供电不拖慢组装/满员伤亡立刻补兵扣钱”，二改为按实际供电效率积累组装进度、断电缺合金时暂停、出口堵塞先等待；布防场地从 144 格扩到 459 格（约 3 倍），围墙/闸门改成三格整段，并接入“敌人接近时 AI 主动关门、敌人从某侧突破伤到核心后该侧更早收闸、敌人按受伤/同伴阵亡等实际处境撤退”的触发联动；2026-10-17–18 | 无作者静态截图原 URL；页面声明含 AI 生成资产，许可/成本未提；本端未启动 |
| [Accomplice](https://www.taptap.cn/app/965247) | 角色斜向移动卡进墙，打补丁越修越多后“推倒重来”，把碰撞箱和地图全部重画（新地图不如原画精致）；AI 写代码但常 context 爆掉，人负责测试/修复决策与美术立绘 | 无截图原 URL；token 成本未给；本端未启动 |
| [地穴涌现](https://www.taptap.cn/app/960144) | 每关 45 秒改 30 秒、同屏地鼠 3→5 只、削弱一个过强强化道具；页面标“包含 AI 合成内容”，系列日志 4 记录 AI 过度工程，但该篇未写 AI/人工分工 | 该篇 AI/人工分工不足；无截图原 URL；本端未启动 |
| [重生之我给AI当牛马](https://www.taptap.cn/app/975005) | 让 AI 模拟玩家多轮跑测：难度先高→下调→又太低→把中期考核回调，目标是乱拿资料也能玩、认真搭配有成就感；24 期×4 次训练；AI 只用于模拟测试，关卡/系统由人设计 | 无截图原 URL；许可/成本未披露；本端未启动 |
| [恶魔庄家今日营业](https://www.taptap.cn/app/954051) | 按剧情重排关卡（删 2 关无剧情、寒暑/先驱对调）；AI 编号重映射把同一数字映射两次，导致收束段错位、寒暑关混入先驱内容；靠剧情 42＋播放交互 15＋关卡可玩性 26 共 83 条验收抓出 | 无截图原 URL；许可/成本未披露；本端未启动 |
| [璇玑](https://www.taptap.cn/app/964250) | DeepSeek-Flash 设计的第 6–8 关“一眼看穿解法”；作者把这三关改为第 1–3 关、把【极致】模型的复杂关后移；记录只有强模型才会设计障碍/陷阱与路线选择，13 天完成；关卡完全由 TapTap Maker 制作，人做筛选重排与误删备份；2026-10-21 | 是关卡顺序/难度曲线二改，不是路线几何；无截图原 URL；许可未提；本端未启动 |

### 4.3 有二改线索，但入口或“节奏仍可玩”未过（9 项）

| 作品与入口 | 一次具体二改 | 缺口 |
|---|---|---|
| [清漪](https://www.taptap.cn/app/960864) | AI 先产出其中 20 关“里关”并重调此前区别不大的关，逐关改重力/力场/速度（风铃 g 4→1.6、弹珠 g 7→2.2、鼓膜冲量 2.8→5.2）；作者承认部分关“都没法完成目标”；40 关（前 20 关清、后 20 关漪），每关分表里，10/19 | 作者原话“好不好玩另谈了，我准备后面再来调整”，二改后节奏未验；许可未提 |
| [莉耶伊的魔物娘地牢](https://www.taptap.cn/app/955070) | TapTap 制造；Day8 第一版→第二版测试版才发现“通关目前几层比较无脑”和 UI 遮挡，Day11 又细化地图；2026-10-19 上线 | 作者承认重写移植、后期 Boss 强度仍待打磨；截图/AI 分工/成本未给 |
| [Epic Survivors](https://web3dev1337.github.io/epic-survivors-architecture/) | 14 个月时间线记录多次关卡/遭遇二改：2024-11-17 Haunted Forest 整关重做与再平衡、2024-12-08 地形生成重做、2024-12-21 移除敌群碰撞、2024-12-27 蛇形刷怪修正、2025-01-17 启动 Level 1 Redesign、2025-02-24 把“只生存”改成五类事件；Steam 有 demo（app 4090630；3553800 是正式版，不是 demo） | “100% AI 编码”是作者声明且被 Jonathan Blow 质疑，AI/人工分工需再核；许可/成本未知 |
| [Gensokyo Survivors](https://github.com/Dimava/gensokyo-survivors) | Claude Opus 5.5 写全部代码/美术/音乐；作者用 balance bot 与提交记录改 Boss 弹幕和升级打断节奏到 v2.0.0；浏览器可玩、README/截图完整 | 无 LICENSE；东方同人素材权利需另核 |
| [Maskfall](https://www.maskfall.games/) | 塔防关卡 blockout→Nano Banana→脚本→Godot；第一次让生成器直接改图导致道路和炮位被改，后用平色 blockout 锁尺寸，并让 bot 跑关卡做平衡；官网有前 3 关浏览器 demo | 作者仅 handle；无截图原 URL；成本/许可未知 |
| [Liftbound](https://apps.apple.com/us/app/liftbound-cozy-elevator-game/id6827381090) | 20 座手工建筑在固定种子上 bot 分数钉死，每张升级卡在每关跑 100 次回归；Tower 合作层、幼儿园、Bigger Cars 有具体二改前后影响；Claude Code 只按设计文档实现；App Store 可玩 | 商店页重定向，二改证据来自 Reddit 原帖；无截图原 URL；成本/许可未知 |
| [Oh Shit, Zombies](https://github.com/alltomstales-dotcom/oh-shit-zombies) | AI agent 写码、AI 玩家压测的浏览器僵尸生存；开发日志记录首分钟遭遇强度连续两改（19:50、20:13），围攻关在 22% 通关率后二次调参并在 60 个新种子上复验 | README 提到临时 test server 与 BSD-0 代码许可，但入口是临时地址、可能掉线；本清单没有稳定可玩入口与截图原 URL；成本未知 |
| [Jumpgate](https://kraigadams.com/jumpgate/play/) | 可玩 v8.18（2026-10-16），Claude 写全部 6,362 行代码；第一章在 v4 围绕“垂死电池”重建，v8.2 又主动放慢并加难 | 地图为程序化、敌人未实现，压力来自旅行/碎片/稀缺，不是传统路线关卡；许可/成本未声明 |
| [GothicVania Codex Demo](https://acatovic.github.io/gothicvania-codex-demo/) | Codex 按 DESIGN-DOCUMENT 与 Playwright 测试做出 2D 平台关卡；2026-02-16 的 `level cleanup` 提交在两个缺少敌人覆盖的平地补 ghoul、把单点硬编码生成改成 placements 列表并补通关流程；README 记录测试发现浮空敌人后回修重力/碰撞；MIT 代码、可玩 | 单关小样本；截图/成本未给；二改是清理级，不是整关重做 |

### 4.4 第二轮近门槛：二改强，但缺一项或多项硬门槛（4 项；另有 3 项方法/管线证据见 §7.1）

| 作品与入口 | 一次具体二改 | 缺什么，为什么不进甲 |
|---|---|---|
| [Overserved](https://overserved.lumiverse.hr/play/)（LumiVerse，可玩；devlog 22 篇） | 140 关全部由 headless bot 逐波推到“刚好能活”；USA 世界 4 关因结果双峰被人工二次改（把 spam 敌人后移到后期、加强该世界半克制塔），重跑后 20 关全过；Boss 从纯血量改为“每秒吸收上限”的护盾。原文 <https://overserved.lumiverse.hr/devlog/designing-levels-by-playing-them/>、<https://overserved.lumiverse.hr/devlog/the-wall-no-knob-could-crack/> | 缺作者静态截图原链、版本号、许可/成本；bot 只能验“可活”不能验“无聊”；本端未试玩。补齐作者静态截图原链与版本号、并通过人工试玩后可作 A- 候选，当前不计入甲级替补。 |
| [CORO SOLTO: Treta Suprema](https://www.corosolto.com.br/)（免费浏览器 FPS；AGPL-3.0；v2.1.0-alpha.137；代码/地图 <https://github.com/corosolto/client>） | 13 张地图主体由 `public/js/map_*.js` 手写几何（README 记共 25 个 `map_*.js`），另有 `map_json.js` 加载可选 JSON 地图，编辑/authoring 工具（scripts、schemas、gauntlets）在 `corosolto/studio`，可编辑源资产在私有 `studio-assets`；Cidade Invadida 由 `map_invasao_javaporcos.js` 及 `map_javaporcos_*` 组成（2026-10-29 出 blockout，10-31 由 Codex 提交“打开塔楼和更多房屋”（1c41cc0）、“修村庄重生点与边缘探针”（3a268b8）、“测量开放窗户与避难所下地形”（0552101），11-01 对齐溪流网格与高度场（f4902c9），11-04 修人行道 z-fighting（45034df）；清单另记同日把入侵收敛到 4–8 名防守者） | 本清单未给作者静态截图原 URL；AI/人工分工只到提交尾注（`Agent:` 约定，README 写明 AI generated & AI friendly），未读到作者对“人定什么、AI 改什么”的说明；a1dbv 资产编辑卡已把该 repo 当角色 GLB 证据，本卡只新增地图二改，需跨卡去重 |
| [Kindlefall](https://kindlefall.com/)（Rudy Faile；浏览器可玩） | 浏览器可玩动作 roguelite，作者自述大部分代码由 AI agents 写；[devlog Part 5](https://kindlefall.com/devlog/05-playtesting.html)（2026-11-06 复检 200）把同一间第四层熔岩房逐版列出：Build .12 平地熔岩＋发光裂缝、.13 降低并加冷却壳/热唇/玄武岩架、.15 改为下沉流道、.16 加 3D 位移/浮壳/气泡，并给四版并排对比图 [lava_grid.jpg](https://kindlefall.com/devlog/media/lava_grid.jpg)（200）；每次旧版都留在 git 里可重新签出对比。 | 本清单只摘四版要点，完整逐版记录与并排对比图见 devlog Part 5；缺公开发布版本号（只有 build 号 .12/.13/.15/.16）、许可/成本，截图原 URL 目前只单列 lava_grid.jpg；本端未试玩。复核：逐版证据已达 A- 强度，若确认发布版本号与许可，可从乙级上调。 |
| [燎原](https://www.taptap.cn/moment/860184092862318690)（TapTap 聚光灯 2026；游戏页 <https://www.taptap.cn/app/963762>） | 原先把局内关卡全交给 AI 生成，自己完整试玩后发现“太简单、地图太空旷、一瓢水就通关”，于是改机制（树连成墙、铲子只能挖树开路、集装箱可推成移动防火墙）并把难度轴从“资源够不够”改成“路通不通”，之后关卡改由人设计 | 缺作者静态截图原 URL、版本号、许可/成本；改动是机制与难度轴，不是同一路线的第二次几何修改；本端未试玩 |

Dustlight 的确定性 capture bot 与“碰撞不碰 splat”验证、J-STAGE 论文的 A/B 关卡节奏指标、RSD 的单点修复与 level checker 移入 §7.1；三项都不属于“有二改的作品候选”，不计入本节 4 项。

### 4.5 第二轮：可玩且有二改记录，但证据薄一档（14 项）

| 作品与入口 | 一次具体二改 | 缺口 |
|---|---|---|
| [Velocity Loop](https://developers.openai.com/showcase/velocity-loop)（OpenAI Showcase，VB Srivastav；可玩 <https://velocity-loop.openai.chatgpt.site/>） | Codex 演示家族里的三维玩具车计时赛，五条赛道；页面明确写到后续 pass 改过赛道布局、镜头与氮气，并做过确定性回放和多次试玩 | 本清单未给截图原 URL、版本、许可/成本；页面是 Showcase 简介，不是逐版 devlog |
| [Hollowflux](https://developers.openai.com/showcase/hollowflux)（Thomas Ricouard；可玩 <https://tideglass-drowned-vein.openai.chatgpt.site/>） | 程序化地牢动作游戏，七种主题楼层与 Boss；页面写明先打完首场遭遇再调移动/攻击，随后完整通一遍地牢来平滑难度与奖励 | 本清单未给截图原 URL、版本、许可/成本；无逐版前后对照 |
| [Neon FPS / Rift Vox](https://developers.openai.com/showcase/rift-vox)（Gabriel Chua；可玩 <https://openai-minigames-examples.vercel.app/fps/>） | 体素赛博射击，六轮迭代中包含“把建筑布局改得更可读”和“扩大可探索地图”，最后还有一个合并大关卡与战斗反馈的终轮 | 本清单未给截图原 URL、版本、许可/成本；六轮的具体前后差异未逐轮列出 |
| [Brick Platformer](https://developers.openai.com/showcase/brick-platformer)（Katia Gil Guzman；可玩 <https://openai-minigames-examples.vercel.app/brick-platformer/>） | Phaser 平台跳跃，页面写明反复调整平台间距，并用 Playwright 浏览器冒烟测试验证顶部宝藏可达 | 本清单未给截图原 URL、版本、许可/成本；单关小样本 |
| [Deadlock](https://vibearcade.com/games/deadlock)（Vibe Arcade，15 关反向塔防） | 作者 devlog（<https://vibearcade.com/blog/how-we-built-deadlock>）记录一晚连发三版、按不可妥协的“牢笼三胜负”支柱重排房间布局，并复盘 iframe 与集成测试漏掉的关卡 bug | 本清单未给截图原 URL、版本、许可/成本；作者/AI 分工未写清 |
| [Path Runner](https://vibearcade.com/games/pathrunner)（Vibe Arcade） | AI 生成的浏览器伪 3D 跑酷；devlog 记录首版消失点过高导致整条路像下坡，实际试玩后压低地平线，并重建赛道生成与障碍组合 | 本清单未给截图原 URL、版本、许可/成本；改动是参数与生成器，不是同一路线重排 |
| [Unmask the City](https://furic.github.io/unmask-the-city/)（Richard Fu / GGJ 2026） | 第一人称 3D 程序化城市收集游戏，Claude Code 写实现、作者定玩法与试玩；出生点净空连续四版从 2→12→20→30 单位，第四版同时放大收集半径。原文 <https://www.richardfu.net/building-unmask-the-city-a-solo-game-jam-journey-with-ai-pair-programming/> | 本清单未给截图原 URL、版本、许可/成本；没有手写路线或遭遇的二改 |
| [Still Hour](https://app.deadsimple.games/games/stillhour)（Braid 式时间回溯平台解谜） | 作者原帖（<https://www.reddit.com/r/aigamedev/comments/1xgtqex/>）称 20 关全由人设计、Claude 子代理分管引擎/关卡/美术，并用“最大台沿 3 格、最大缺口 5 格”硬约束和每关自动通关脚本保证改关后仍可解 | 帖中没有一次具体的第二次路线重做；本清单未给截图原 URL、版本、许可/成本 |
| [Familiar](https://github.com/Preponderous-Software/familiar/issues/13)（Preponderous Software；可玩 <https://familiar.play.danielstephenson.dev>；MIT） | 0.1.0 三个 AI agent 试玩报告第 3 条：距灯笼约 1.5 m、准星对准按 E 无效，敲门要反复挪 2–4 次；10-30 提出、10-31 在 PR #23 修复——灯笼 2.3 m、门 1.85 m 可交互，8 m 内显示“come closer”，进入范围物体闪光且准星变橙。[#31](https://github.com/Preponderous-Software/familiar/issues/31) 另记门廊台阶挡住正面走向大门（按住 W 2.5 秒不动，需先左平移），issue 仍开着；0.1.1 汇总（<https://github.com/Preponderous-Software/familiar/blob/main/docs/playtests/0.1.1/ai-playtest/summary.md>）26 条发现、2 条 major 都是路线/空间问题 | 改动集中在交互距离与门廊碰撞，不是路线/遭遇重排；#31 未修；截图未作为原链列出；本端未试玩 |
| [Kindling](https://github.com/Preponderous-Software/kindling)（Preponderous Software；可玩 <https://kindling.play.danielstephenson.dev>） | 与 Familiar 同作者、同 Playtester harness 的 3D 第一人称修复游戏；docs/playtests 留有 2026-10-22 至 10-29 的四个版本 AI 试玩汇总（0.1.0→0.1.1→0.1.2→0.2.0，major 6→3→1→2），逐版记录“屋内看不见屋顶破洞”“地板缺口无法瞄准”“手持瓦片挡住补洞目标”等空间/可达性问题及改动（<https://github.com/Preponderous-Software/kindling/blob/main/docs/playtests/0.2.0/README.md>） | 0.2.0 仍把屋顶破洞列为 major，属进行中的二改；本清单未给截图原 URL、版本号（只有构建号）、许可/成本 |
| [Atman](https://github.com/Preponderous-Software/atman)（Preponderous Software；可玩 <https://atman.play.danielstephenson.dev>） | 同一作者的 3D 村庄游戏，docs/playtests/0.2.0 有 7 条 major（含“黄昏路上撞上一整面黑色表面”“村中返程路点似乎在房屋墙后”），0.2.1 仍有 2 major（梦境无提示、睡觉时钟倒走，[summary](https://github.com/Preponderous-Software/atman/blob/main/docs/playtests/0.2.1/ai-playtest/summary.md)），0.3.0 重跑降到 0 major | 改动集中在空间提示、碰撞和可达性，不是路线重排；本清单未给截图原 URL、许可/成本 |
| [齿轮塔防](https://www.taptap.cn/moment/861866671965474597)（万里草原／方步工作室；游戏页 <https://www.taptap.cn/app/972651>） | 把敌我血量拉平，通关目标从“击败全部士兵”改为占领最右侧敌方家园；删掉全部敌方素材、敌军直接复用我方士兵立绘；每关最后一波改成占领敌方老巢的 Boss 波，并补教程；作者自述教程交给 AI 做，实机测试发现 AI 把正常波次的敌人显示替换掉，已修。另核到 2026-10-22 玩家实机反馈：教程打完第一波剩 15 金币，买 10 金币齿轮后又被要求买 6 金币齿轮导致卡死；作者在评价区承认“现在的教程是有问题但无法改的”，2026-10-24 论坛改发新手教程视频并称可更新时第一时间上传。 | 本清单未给版本、许可/成本；AI/人工分工只到“教程给 AI 做”；塔防非 3D 动作；改后节奏未写；教程卡死属未完成的二改（锁定期无法更新），本端未试玩 |
| [猪能飞 / Pig Can Fly](https://www.taptap.cn/moment/855967114937238417)（我深夜扔垃圾；游戏页 <https://www.taptap.cn/app/978037>） | 作者先让 AI 直接生成关卡，结论是“基本没什么玩头”，随即改为让 AI 做关卡编辑器、自己设计关卡并继续迭代编辑器 | 具体的第二次路线修改没有展开；本清单未给截图原 URL、版本、许可/成本 |
| [SKY SHIFT](https://playgama.com/blog/main/how-to-make-a-game-with-ai/)（Playgama 第一方 AI 造车竞速；可玩 <https://playgama.ai/play/i66ryvsxgiybqp>） | 教程案例明确记录先问“保留三圈环道还是改赛制”，随后把赛道改成海上冲刺（巨台、峡谷、管道、陡坡）并后补 Harbour Run/Skybridge/Razor Coast 三关，还用录制比赛回放证明玩法未变 | 本清单未给截图原 URL、版本、许可/成本；教程是营销案例，不是逐版 devlog；无“改前/改后”同基线数据 |

去重：失控协议：群潮之下（app 963039）与璇玑（app 964250）已在 §4.2 收录，本节不重复计数；引用时见 §4.2 对应行。

### 4.6 第三轮近门槛：二改具体、可玩，但缺一项或多项硬门槛（3 项）

| 作品与入口 | 一次具体二改 | 缺什么，为什么不进甲 |
|---|---|---|
| [Hora Cero · Invasión Buenos Aires](https://horacero.app)（Alejandro Vizio；可玩页 200） | Claude（Claude Cowork）写代码、程序化 3D、贴图、两关关卡与测试，作者定设计并逐轮试玩；2026-10-20 23:38 首次开源提交后，10-21 08:21 的提交 1a72b35 把五月广场改深：夜间六只 cascarudo 沿大道分批出现并带全广场可闻的叫声、60 路公交变成可乘载具并在 Yrigoyen 设五站、巴尔卡塞街站三名走不动的人改为公交到站才上车的可选目标、哨亭步枪与卡车旁头罩/面具成为可选装备；规则与 3D 共用 `plaza_layout.py` 生成的同一份数据。代码 MIT、自有资产 CC BY 4.0，漫画角色与 Santiago Siri 模型不在自由许可内。 | 无版本号；二次改后的真人节奏未验；成本未知；作者截图未给原链（页面内可见）；本端未试玩。 |
| [Pawnshire / chess-rpg-gauntlet](https://github.com/avoidthekitchen/chess-rpg-gauntlet/issues/34)（可玩 <https://unformedideas.com/chess-rpg/>；GPL-3） | 故事书式国际象棋战术 RPG，Codex 实现、人定关卡与验收；Region 2 的 “Two at once” 从自制战斗改成 Lichess 残局伏击（1 次可跳过示范、4 波、4 个后手位），整体扩为 12 个遭遇/10 个示范/88 道原题，并把永久锁关改成可重试＋星级，2026-10-24 合入 a3cc3ff。 | 无版本号、README 无截图原链；2D 棋类而非 3D 动作；二改是遭遇结构不是空间路线；成本未知。 |
| [Sector Dive Extended](https://beatdjam.github.io/mini-games/games/sector-dive-ex/)（beatdjam） | 《Sector Dive》的多层楼改造版：把一深度 3 个区段改成 3–5 层建筑，用楼梯/电梯串联、最下层设 Boss 房；更新日志逐条记录 Boss 房改成大厅、商场中庭下沉、最下层楼梯加长等二改，`CLAUDE.md` 要求同 commit 改 SPEC，平衡改动前后用同一 seed 跑 bot sim。 | 本清单未给作者静态截图原链、版本号、许可/成本；本端未试玩；2D/3D 混合但非 Star 的公路竞速。 |

### 4.7 第三轮：可玩且有二改记录，但证据薄一档（20 项）

| 作品与入口 | 一次具体二改 | 缺口 |
|---|---|---|
| [云海神殿](https://www.cclliang.com/2026/10/05/vibe-coding/e4/)（沧沧凉凉；可玩 <https://skytemple.cclliang.com/>） | 一条需求让 Claude Code 拆成 33 个代理并行做出 five chapters＋Boss 的 three.js 浏览器 3D 动作解谜；两轮 QA 共 49 个问题及具体修复：第一章方块会被推进栏杆与路沿缝隙、推不动也不复位；提示排队导致每条都要等满；Boss 盾改成每次破盾最多打掉 30% 血、护盾恢复会重新打乱镜子。作者公开静态截图/GIF 原链齐全：<https://www.cclliang.com/images/ai/sky-temple/s1-gap.jpg>、<https://www.cclliang.com/images/ai/sky-temple/s2-launch.jpg>、<https://www.cclliang.com/images/ai/sky-temple/s4-gate.jpg>、<https://www.cclliang.com/images/ai/sky-temple/boss-shield-break.gif>（本次均 200）。 | 文中没有明确的“关卡 v1→v2 重做”段落，属 QA 驱动的局部几何/遭遇修正；无版本号、许可/成本未披露；本端未试玩。 |
| [涌现之野](https://www.taptap.cn/moment/861892381866199311)（梭洛的工作室／叾屾；游戏页 <https://www.taptap.cn/app/953696>） | 开发者日志⑤记录把原先“七圈同心圆、半径一屏装不下、太规整”的地图重做为有机大陆（内圈四个生态区用有机斑块拼出），世界从 600×600 扩到 760×760；五天版本从 1.0.94 推到 1.0.185，有公开测试 DEMO（PC/H5）。AI 协作伙伴称“塔啦啦”，工具标 TapTap 制造；页面有多张开发/游戏截图。 | 是整张世界地图重做而非单条路线/遭遇二改；AI 与人工的具体分工只有概括；许可/成本未披露；试玩需 TapTap 客户端；本端未启动。 |
| [过拟合猎手](https://gamesvibe.app/works/pOR2uTPPIoW0rDnKC7PRZ)（VibeHub，Pluckaa） | 浏览器直接可玩的 2D 俯视角幸存者肉鸽，v34（2026-11-05；首发 2026-10-05）。v10（2026-10-09）按外部试玩“打得很憋屈、难度太高”做第二次调整：经验效率 50%→70%，怪物逐层血量与伤害增幅各降一档；同时把手机端路线图改成可缩放（窄屏默认 0.8 倍、横向滚动、当前层自动居中、记住档位）。 | 页面未写 AI 与人工分工，作者只有 handle Pluckaa；2D；‘改后仍可玩’没有同基线数据；本端未启动。 |
| [织Weave](https://www.taptap.cn/app/987106)（聚光灯 GameJam；日志 <https://www.taptap.cn/moment/861811888567091830>） | 开发日志 5 记录对 24 关主线的第二次整理：按连珠/同色/续锦/梭数/贯通/纹样六种机制重排 1–24 关，把 21–24 关连同独立牌库、+2 手牌、3 次重抽、70% 配色门槛和颜色提示一起重建；游戏页显示 PC 试玩 DEMO、2026-10-21 发布、v1.0.2、24 关，作者注明 DeepSeek 参与五行相生循环构思（帖子标“包含 AI 合成内容”）。 | 是关卡顺序/难度曲线二改，不是 3D 路线或遭遇几何；人机分工只到“D老师”讨论与 AI 合成内容标注，偏薄；本端未试玩。 |
| [星尘战线 Stardust Frontline](https://gamesvibe.app/works/1k38GPaU_eUdD6bp2ZQ1h)（VibeHub；3D 太空射击） | v40（2026-08-30）重新规划 50 个战役关卡的行星、信标、固定目标、出生点与巨构间距，并修掉部分不可玩几何；v50（2026-09-06）再加章内难度曲线和每 5 波随机修饰符；页面明写“AI 代码·AI 配乐·AI 配音·AI 生图”，可在线玩、有 6 张作者截图；版本口径两处不同：页面显示“查看 49 条历史更新”、versions 数组为 v1–v50（50 个版本），`/api/works` 的 `releaseCount` 为 57，引用时需写明用哪一口径。 | 人机分工只到平台标签；许可/成本未知；本端未启动。 |
| [灰区行动](https://gamesvibe.app/works/8vOec3pTrF2zWGfqUiqTK)（VibeHub；3D 搜打撤 FPS） | v1.2（2026-11-06，作品页内部版本 v3）把 6 张地图放大 18%、边界改为不规则多边形并让出生/撤离点随边界内收；v1.3（内部版本 v4）又把地面改成真正的非矩形极坐标网格、新增第 7 张全室内“北岸电视台”并把出生点改为沿边界均匀分布的 5 个方位；DeepSeek 标签、可在线玩、2 张作者截图。 | 改版只有 v1.2/v1.3 两条，作品共 4 个版本（v1 首发＋两次地图改版＋一次后续；作品页显示“查看 3 条历史更新”，versions 数组共 4 条 v1–v4）；人机分工、许可与成本未写；本端未启动。 |
| [SCP：收容失效](https://gamesvibe.app/works/2OiDdVMRZB4ItcVMuF5kb)（VibeHub；3D 第一人称恐怖） | v2–v4（2026-09-24）把收容室重排到死路房（约 78%）、彼此不相邻，出生点/检查点/刚进新区域第一格永远是普通通道，并把所有收容室封成单一入口，用 120 个种子校验“可被绕过的门禁房间 = 0”、地图 100% 可通关；Codex/DeepSeek 标签、可在线玩、6 张作者截图。 | 同人非商业（SCP 设定 CC BY-SA 3.0），人机分工与成本未写；本端未启动。 |
| [向上吧！芽芽](https://gamesvibe.app/works/sQohyPJ9Up0qxU6fx6ASm)（VibeHub；2D 软体物理闯关） | v29（2026-09-22）把“新征程”首关重制为千折石窟（路线延长至 14400、六处分岔），v31 又换第 6 号路线并补多岔路/捷径/死路，v13 重排 96 关分组；Codex/GPT 标签、可在线玩、6 张作者截图、33 个版本。 | 人机分工只到标签；许可/成本未知；2D；本端未启动。 |
| [镜之边缘 · WEB](https://gamesvibe.app/works/DLyQZvC63oQN8273f-opW)（VibeHub；3D 第一人称跑酷） | v4（2026-09-12）写明“地图对标原版全面重构＋全城双向连通”，v6（2026-09-12）校验 133/133 滑索锚点都落在真实屋顶，v10（2026-10-31）又补 44 根攀爬管；DeepSeek 标签、可在线玩、2 张作者截图、10 个版本。 | Mirror’s Edge 同人 IP；人机分工、许可与成本未写；本端未启动。 |
| [骑马与砍杀 V0.3.3](https://gamesvibe.app/works/M8geVWBpgyIRMDlNsP-tX)（VibeHub；3D 骑砍类） | v14（2026-08-30）“进行了超级nb的地图更新”，v15 重做攻城战地图解决城墙爬不上去，v19 再加 10 张地图；GLM/Trae 标签、可在线玩、6 张作者截图、20 个版本。 | 同人 IP；人机分工、许可与成本未写；本端未启动。 |
| [Arcane Realms · 地牢试炼](https://gamesvibe.app/works/jponJ8xaejlRNKfgktCaY)（VibeHub；2D 肉鸽爬塔） | v2（2026-10-18）按难度拆独立敌人池、前 5 层排除强怪/后 5 层排除弱怪并给每种敌人设难度门槛，v3 再加新手指导；DeepSeek 标签、可在线玩、5 张作者截图、4 个版本。 | 人机分工只到标签；许可/成本未知；本端未启动。 |
| [Haunt](https://mihirsahu14.github.io/haunt/)（Mihir Sahu） | playbench README 唯一点名的真实游戏；repo `design/iterations` 1–3 记录 AI 人格/bot 三轮试玩后的遭遇节奏二改（`night_len` 300→180 s、`scare_hold` 1.4→3 s、`hunt_warn` 80→60、`lantern_drain` 25→9），当前可玩。 | 代码是否由 AI 写、截图/许可/成本仍待核；本端未启动。 |
| [Nectar Dash](https://dit6w8tahykhu.cloudfront.net/game/g_1b5fd74c354c4bd98929f64517f9da1b)（PlayProof） | 首版第 1 关不可达（21.5 s 只到 18%），重写后 20 s 通关，屏幕外黄蜂也被修；当前 API 记 `test_fixes` 1、`polished` 8，第 5 关试玩仍 25.7 s 只到 80%。 | 是“二次改难度后仍可玩、仍有尖峰”的直接样本，但截图/许可/成本待核；本端未启动。 |
| [First Snow](https://dit6w8tahykhu.cloudfront.net/game/g_b30e16aeaacd4c91848c8c7c8d58c501)（PlayProof） | 第 3 关被 solver 判定不可解而丢弃，第 1 关 3 步太短后换成更长版本并重新证明；当前 5 关全部 verified finishable。 | 截图/许可/成本待核；本端未启动。 |
| [Floor Is Lava: Climb & Escape](https://diaryofamadchaos.com/2026/05/floor-is-lava-developer-diary-building-parachute-down-mode-may-31-2026/)（Toni Eleninovski） | Claude 首版是基础场景（原文称 “basic black-screen scene”），主要问题是“看不清什么击中玩家”（I couldn't tell what was actually hitting the player），可读性差；第二轮 Claude Design 重做并把障碍锚定在坠落线下方第 35 个平台、改八方向移动与五颗心；[2026-06-21 日记](https://diaryofamadchaos.com/2026/06/floor-is-lava-developer-diary-playtesting-feedback-and-teleport-bug-fixes-june-21-2026/) 又按 Lance 的试玩反馈/建议，作者同意把复活从死亡点改为“熔岩下降十个平台”（Lance 原话 make the lava go down by ten platforms；作者同意 let's go with the lava going down）。Google Play 可玩。 | 版本/许可未在页内给出；截图直链对非浏览器 403；Google Play 本机 000；本端未启动。 |
| [DungeonFlux](https://monstercameron.github.io/DungeonFlux/devlog.html)（ShellHacks 2026） | 2026-09-26/27 devlog 记录战斗网格原点偏半格、78 格中 26 格无地板，修正后 160 格中 109 格可走；同时改出生点到 (8,6)/(10,6)、角色尺度 1.8/1.6→2.7/2.5 m、TV 棋子不显示追到五个原因、战斗镜头定为 7 个预设，并把 p5 帧率从 12 提到 40；24 小时、852 commits、Opus 5.5 调度＋GPT-5.6 Luna 并行。可玩 <https://monstercameron.github.io/DungeonFlux/>。 | 代码无 LICENSE，规则素材 SRD 5.2.1 CC-BY 4.0；界面截图未给原链；本端未启动。 |
| [TDRadish Web／保卫萝卜浏览器重制](https://radish.cclliang.com/)（沧沧凉凉） | 《云海神殿》作者把 2018 Unity《保卫萝卜》重制成浏览器塔防；原文记录 AI 首版未 1:1 还原、擅自改布局并原创内容，作者试玩后又让 AI 重构关卡页面、重做关卡流程；当前可玩、仓库开源。 | 美术/音频取自商业原作、禁商用；版本号/成本未给；本端未启动。 |
| [The Bell of Ages / Ocarina](https://nearbycoder.github.io/Ocarina/)（Josh Hamilton） | 15 游戏清单里这款可玩的 Three.js 动作冒险在 v0.1.0（2026-10-04）后做了 12 轮改进，明确加入 “distinct sanctuary layouts with hidden alcoves” 并修掉岩石/悬崖堵死两个宝箱的关卡几何，每轮有 `IMPROVEMENTS.md` 记录。 | 作者是个人 handle；许可/成本未明；截图原链未单列；本端未启动。 |
| [Bellmourn](https://agilancer.github.io/Bellmourn/)（Agilancer） | VECTORCLAD 同作者的 three.js 第一人称 RPG，当前可玩；仓库共 382 条提交（截至 2026-11-06），作者含 Claude（34 条）与 Agilancer（提交显示名为 agilancer / Jamie Herrington），`tools/world/walkthrough.cjs` 会走完所有楼梯/洞穴并检查净高与通行，近期提交又改了 Sorrowhorn 的崖边、scree chute 和一条洞穴支路。 | 作者仅 handle；版本/许可/成本未明；本端未启动。 |
| [Survive the Night（FPS 版）](https://github.com/webdevcody/survive-the-night-fps)（webdevcody；MIT；982 commits；可玩 <https://survivethenightgame.com/>） | 仓库的 three.js 客户端按 seed 生成整张山谷，Route 9、矿道、医院、墓地、铁路各有布局/碰撞/可走性测试（`npm test` 的 test-world/test-mine/test-clinic/test-cemetery/test-rail），并定了每周完整通关的试玩记录表。作者 2026-10-23 的 YouTube《I Gave Claude a 2D Map and It Built an Entire 3D World》（<https://www.youtube.com/watch?v=RNIX-Re9k4o>，本次只读到 noembed 标题/作者与 daily.dev 摘要，未播放视频）讲第二张地图：第一版 AI 生成的是无山无林的大方盒、玩家可直线冲到目标；Discord 反馈后用 ChatGPT 出 10 个带山/林/咽喉点的布局，选一个并在 2D 图上圈掉多余通路，交 Claude Code 重建成 3D，最终只留北通道与洞穴系统两条跨图路线。 | 2026-11-06 用 GET 复检 `survivethenightgame.com`、www 与 /play 均返回 200（同一页面，标题 Survive The Night、meta 为 1–16 人联机僵尸生存；该站对 HEAD 返回 404，404 判定须以 GET 为准）；FPS 仓库 README 明写该站由本仓库部署。缺口：按任务未播放视频，只有 daily.dev 摘要、无文字原帖；每周试玩记录表仍为空；作者身份只到 GitHub handle；未读提交 diff 证明对应改动；本清单未给作者静态截图原链；版本只有 package 1.0.0，未见发布 tag；本端未启动。 |

## 5. 丙级：只有过程或只有入口（50＋14＋38 项）

丙级不满足“可玩＋作者过程＋具体二改＋截图原链”的完整门槛；列出来是为了说明覆盖面和缺口，不作为推荐。

### 5.1 中文作者日志：有二改线索，但入口/AI 分工/版本缺（14 项）

| 作品与入口 | 核到的内容 | 缺口 |
|---|---|---|
| [智能涌现](https://www.taptap.cn/app/957390) | 3D 海岛狩猎，AI 图生 3D 14 个模型（约 4.8k 面、4 级 LOD）；每片海三关、第三关 Boss；真机试玩后玩家“不知道干嘛”，加入拖动/开火/回港/倒料/买升级/出港逐步引导与字幕；下轮将按反馈调难度和台词节奏 | 具体第二次关卡修改尚未发生；仅 iPhone 16 Pro/一加 8T 验过；许可未声明 |
| [蚁SCAPE / 碳酸公司](https://www.taptap.cn/app/957599)（日志 <https://www.taptap.cn/moment/861395978580658380>） | AI 先做格子关卡编辑器（墙/玻璃/深渊/补给/蚁巢、触发器/逻辑门/计数器）和约 100 项实时调参面板，人拿工具摆关并试玩；日志记录“参数是否生效、保存后是否一致、撤销/复制是否漏属性”都要反复试修 | 没有具体某关第二版路线/遭遇重做；无截图原链、版本、许可；可玩性待验 |
| [涌·墨卷](https://www.taptap.cn/app/986579) | 代码交给 AI、自己管玩法；一局 12 层、可提前看到后续房间并自选路线；第二轮回调血液演出并重做怪物数版。评价区玩家逐条指出“每关都像打竞技场 3”“武器节点间隔太长”“跳跃滞空重”，作者回复给出第一幕 4 波 10 只、第二幕 6 波 27 只、第三幕 34 只，回血牌 3 杀回 1 点过保守，兵藏节点间隔会缩短并补中途成长曲线；但作者写明比赛截止后本版无法更新 | 房间与路线扩充仍列在下期计划，二改尚未落到路线层；上述反馈只到“已定量、待下一版”，不是已完成修复 |
| [生命涌现：深空集群](https://www.taptap.cn/moment/858099594104409533) | 日志 5 把进度改为周目制并重排遭遇（首周目只单挑、后续才围攻），逐区核对战斗时长与电力消耗来调前期节奏；星图以商栈和中心终点组织路线 | 作者标注 TapTap 制造但正文未写 AI 工具，AI 分工待核 |
| [灵涌](https://www.taptap.cn/moment/859452781243664191) | 日志 05 明确记录遭遇/地图二改：死斗从拖沓的“守槽位”改为“先到先打”，灵界从环形地图改为向右推进长卷，三十三重天开局即显示分叉云梯 | AI 只在日志 03 以“无敌的AI大人”自述出现、未点名工具；AI/人工分界与可玩入口需补核 |
| [阿方的旅程](https://www.taptap.cn/moment/821356273810277437) | Gemini 出提示词→嗒啦啦生成→人工验收；随机平台不可控后改为模板填充，并用 Trae＋豆包自建关卡编辑器；操作在试玩后从左右键改为点击换向/起跳 | 关卡内容本身没有二改记录 |
| [热冰报告](https://www.taptap.cn/moment/862302697397685856) | 大一作者用 TapTap 制造＋DeepSeek 驱动的 Codex 做出第一人称体素射击，四类材料反应会改变结果，已有教程关和肉鸽迷宫 | 没有路线/遭遇二改记录 |
| [烧心药房 1.8.5](https://www.taptap.cn/moment/861238949736089778) | 2026-10-19 日志把“接灯回廊”同一段空间做出两条通关路线（点 LED 绕后，或用 AID 惊动巡灯借伤害光供能、再走机关盖板），并按试玩反馈重排手机操作，版本/日期齐全 | 该页未证明 AI 参与；只能算关卡二改线索，需回作者主页核 AI 分工 |
| [荒原复苏指南](https://www.taptap.cn/app/976321) | 同届聚光灯 GameJam 的开发者日志④是关卡演示视频 | 日志未写 AI 分工，需先核是否由 TapTap 制造生成、演示版之后是否改过布局 |
| [天行健](https://www.taptap.cn/app/976181) | 第一人称山海经开放世界，是这批 jam 条目里空间/关卡设计含量最高的一款 | 页面未声明 AI 参与；更新日志只有修 bug 与新增修士/伙伴玩法 |
| [小小史莱姆](https://www.taptap.cn/moment/860998185634500437) | 作者总结自然语言改布局的坑：“往上移一点”AI 难把握，调美术位置有时比改代码更耗积分，传参考图让 AI 照着改更省 | 只有提示与成本实感，不是二改案例 |
| [多米诺的子弹工厂](https://www.taptap.cn/moment/859075619172910045) | TapTap 制造的轨道工厂游戏；开发日志④记录玩家把生产线搭复杂后，对子弹排队、路口让行与炮台容量做第二版规则重做 | 属路线/流量层的规则二改，非关卡几何重排；无版本/截图/许可 |
| [猫咪守卫队](https://juejin.cn/post/7699528799919472681) | 玩家反馈“一局 18 波太长”后按难度改 12/14/16/18/20 波，首版统一加密致教学关第 1 波团灭，二改为渐进补偿（12 波局末段约 1.5 倍）并清掉路线触发点等硬编码；AI 写全部业务代码与四套测试 | 微信搜“猫咪守卫队”可玩，无直链；许可与金额未披露 |
| [颜色排序](https://juejin.cn/post/7697865664233734198) | 简单模式“空车道太多、几乎不用道具”后把车道数对齐困难模式、难度改由冰冻车道承担，固定车道方案因“玩家看不懂”删除；500 关由 AI 按“每一步打乱都能被一步正向操作还原”生成并脚本回放 | 微信搜“颜色排序”可玩，无直链；许可未提 |

### 5.2 中文作者页：二改或验收方法有，但没有当前入口（2 项）

- **考了又考** — <https://www.cnblogs.com/creator-star/articles/22302149>。玩家说“核心规则太简单”后，把 8×8 关卡 JSON、规则和截图交 Codex 分析合法矩形与推理步数，重生成并做结构/完整覆盖/唯一解检查后替换；原稿“多解只是复杂”。缺口：无试玩链接与游戏截图，2026-08-07；只作“AI 重做一关＋可解性门”的方法线索。
- **界门（Job Yang）** — <https://jobyang.cn/writing/ai-game-realmgate/>。12 条百关 bot 流程首轮 4 条倒在第五章 Boss，第二轮 12 条全通；后五章普通怪出手率仅 1.2%→补生命/移速/远程跨层，第三轮第 8 章仍只有两成多出手，并把自动技能限制在当前屏；AI 做系统/关卡/批量内容，人定 DPS、通关率等验收。缺口：公开试玩入口当时写“后续补充”，无当前可玩链接，2026-10-09。

### 5.3 英文作者站：过程有，但二改未落到路线或入口不可用（18 项）

| 作品与入口 | 核到的内容 | 缺口 |
|---|---|---|
| [Axiom](https://penguinboisoftware.com/blog/axiom.html) | Claude 自主选概念、设计并写全部代码/测试，人只做 beta 试玩；第 2 关把逃跑者总被逼到角落的问题改成环面网格，100/100 次跑满 100 tick；第 7 关目标上限 200→10 使暴力解失效 | 只有本地构建、无公开试玩，未达可玩门槛 |
| [Wages and Mages](https://x00f.com/wages-mages-devlog-07/) | Boss 从脚本化改为按血量阈值触发的多阶段能力池（P1 基线/P2 解锁与改参/P3 低血终局）；随后调低 Normal 小 Boss 血量、平滑 Night 15 伤害曲线、减少 Wave 20–30 高打断精英聚集；24,643 测试通过 | Devlog 07 明确写 Launch Link Pending，无可玩 build |
| [Wreckhold](https://x00f.com/games/wreckhold/) | Devlog 04 把波次从全池均匀抽取改为按阶段加权模板（前期 probe、中期混合、后期 specialist），加入第二层灾害与 beacon 改变 sapper 寻路；Devlog 05 对上一轮 backlog 做二次核验 | 游戏页明确说没有公开 build 或 storefront |
| [Graveshift](https://x00f.com/graveshift-devlog-02/) | 原型是单一走廊式 gauntlet，二改拆成五个区域、各自敌人池/视觉/音效和关底 Boss，专用解决深层推进的单调；124 项测试 | QA Pass，未公开发售 |
| [C.A.G.E-9001](https://x00f.com/cage9001-devlog-02/) | 第三层把前两层当背景的家具 sprite 变成拟态敌人，用已有关卡资产重排遭遇与扫描资源压力；Devlog 03 把选关列表改成五层甲板剖面图，加入 Deck 4/5 的 Accountant/Manager/HR/Auditor/Lane Splitter 遭遇 | Launch Queue，无公开可玩 |
| [Voidrunner](https://x00f.com/games/voidrunner/) | 已上 itch 的 AI 弹幕游戏；十个扇区各带一种改变玩法的机制（去掩体、敌人合并、场地旋转 90°、波中换敌） | 无具体第二次路线/遭遇修改记录；itch 本机不可读；许可/成本未知 |
| [Polybreak](https://x00f.com/polybreak-devlog-01/) | 100 关打砖块把每关写成 Lua 字符网格，AI agents 按主题 brief 生成、以旧关作正负约束；第二遍一致性检查世界归属、递进与钢砖位置 | 第二遍是出厂前一致性复查，不是试玩后返工；无具名作者 |
| [Pixel Centurion](https://blog.slashie.net/2026/11/01/pixel-centurion-day-15-keeping-battles-moving/) | 第 13–17 天连续改密集森林与寻路、战争迷雾、坡地冲锋；AI 冲锋中断造成的 33% 僵局降到 0、平均战斗 354→233 秒 | alpha，未找到公开试玩入口 |
| [Bill's Forest](https://blog.slashie.net/2026/10/09/bills-forest-day-10/) | 第 10 天把无限延伸的森林改成约 30×30 屏的有限世界并保证所有屏可达 | alpha，仅 devlog |
| [Arkathul](https://blog.slashie.net/2026/11/02/arkathul-day-20-reimagining-the-boss-encounters/) | Day20 把每个 boss 遭遇重做成独立机制与攻击模式；Day21 按死亡分布调整中期难度曲线（胜率 79% 目标 70%） | 无公开可玩入口；devlog 只提自动化平衡模拟，AI 参与程度未说明 |
| [Metamorfosis](https://rustyrobozlabs.com/projects/metamorfosis) | Claude Code 分六个 PR 完成、11 关按六种变身规则分阶段；脚本化 Chromium 遍历和关卡机器人找出到不了的平台与检查点陷阱 | 作者称这不是真人试玩、金牌时间仍待定；无逐关修改前后 |
| [The Last Observation](https://rustyrobozlabs.com/projects/the-last-observation) | 64×64 双层 WFC 关卡生成，硬约束管可走性/海岸/高度/支撑，软权重调候选，玩家注视驱动局部 collapse；发布门跑 10,000 seeds 查空域、哈希分歧与调试砖 | 没有“二改后仍可玩”的修订记录 |
| [Pro Skater: The Warehouse](https://github.com/3D-Stories/skate-game-opus-5-5) | Claude Opus 5.5 用 Blender Python 生成全部 3D 资产和首个滑板场；第二个场地 Eastside Baths 由 level kit＋`docs/LEVELS.md` 复用生成并配 18 套无头测试；README 记 5.65 亿 token/$204 | Vercel 现场链接本机打不开；无 LICENSE；是关卡复用/重生成成本，不是同一路线二改 |
| [Not Pro Skater](https://tinybitadventures.com/not-pro-skater-0-2-0/) | 0.2.0 把关卡里数百个可穿模的房屋/树/杆改成实体，并修掉撞车后在物体内重生的点 | 页面未写明本作 AI 用量；无截图/许可 |
| [Star Circuit](https://tinybitadventures.com/star-circuit-0-4-0/) | 0.4.0 给每种世界配一个招牌敌人，并把 Smelter/Storm Kite/Void Stalker 从终局边缘下放到两种常见世界 | 页面未写明 AI 用量；无截图/许可 |
| [Wheek!](https://tinybitadventures.com/wheek-0-2-0/) | 0.2.0 把单一公园扩成 3×3 世界、八个新区域和与地面一一对应的地下 warren | 页面未写明 AI 用量；是扩展不是二改 |
| [Geobeat](https://dmnshd.gg/games/geobeat) | Shed Racer 作者的 Vibe Jam 2026 作品，赛制硬性要求至少 90% 代码由 AI 写；难度结构 line→square→hexagon→octagon，可在线玩 | 作者复盘只记两天完成、没有二次关卡修改 |
| [Slipface](https://slipfacegame.com/) | 可玩浏览器越野赛车；Claude 写游戏、GPU 地形模拟、车辆物理、AI 对手和关卡编辑器；作者选车、调驾驶感并试玩；关卡是 JSON、有实时地形/坑洼编辑 | 作者帖未记录具体第二版路线修改；只有工具与可玩性线索 |

### 5.4 同工作室系列：改动具体，但作者口径/是否二改待核（16 项）

以下均来自同一 AI 工作室或同一条 fork/blend 线；单看改动像二改，但作者身份或“第二次修改”的边界不够，先不升乙。

- **Evolutionary Arcade 的 fork/blend（3）**：[Night Shift](https://evolutionaryarcade.com/g/night-shift)（保留山脊防守骨架，加雷暴/发电机燃料/手电引怪）、[Ridge Runner](https://evolutionaryarcade.com/g/ridge-runner)（Starwake＋Last Signal 的 blend，六波爬升敌人）、[Hiring Loop](https://evolutionaryarcade.com/g/hiring-loop)（Haunt Loop 的 fork，改八轮面试关卡并保留地板坍塌/规格变更）。均可直接试玩，但没有作者过程与第二次修改记录。
- **Vibegames Studio 的 13 款**：工作室自称“零人类”AI 工作室（员工为 agent 人格，changelog 由 agent 生成），作者身份与人类判断边界待复核。逐项改动：<https://www.vibegamesstudio.com/crazycabcity/>（地图扩 2.5 倍、越野速度 38→约 10 m/s、栏杆/树篱从实体墙改为可撞路标）、<https://www.vibegamesstudio.com/theblock/>（最赚钱的 LOUD 抢劫路线此前 100% 失败，改为可玩；生产房 dollars-per-heat 4.3×→2.2×）、<https://www.vibegamesstudio.com/hyperdrift/>（测试脉冲地雷虽过公平性检查，却让 Core 死亡 49→202，删除并写原因）、<https://www.vibegamesstudio.com/cornerkings/>（城市整体重建为宽路和真实楼间距、逐区解锁，9/7 加限时街区工作）、<https://www.vibegamesstudio.com/deadair/>（第 4 区 8 夜后加 Hill Hospital 第 5 区和第 9–10 夜，敌人攻击改前摇可躲）、<https://www.vibegamesstudio.com/shinobi/>（新增 Moonlit Rooftops 场地，修 18 只波次里 15 只自灭）、<https://www.vibegamesstudio.com/projectember/>（首个 Boss 降血、加跳跃预警/落点标记、取消待机接触伤害）、<https://www.vibegamesstudio.com/delvers/>（五个 Boss 各加独有终盘机制，Hollow King 后加三层 Rift）、<https://www.vibegamesstudio.com/kong/>（攀爬 4→16 块，修 75 m 电梯/100 m 铆钉死亡重置）、<https://www.vibegamesstudio.com/molemayhem/>（King Mole/General Gnaw 加第二阶段）、<https://www.vibegamesstudio.com/matchpoint/>（五轮签表改六球场八轮，实测球场弹跳恢复系数 0.533–0.702）、<https://www.vibegamesstudio.com/melda/>（新增 Pale Ossuary 区域，不是二改）、<https://www.vibegamesstudio.com/blog/2026-07-30-the-islands-were-see-through>（Skull Tide 岛屿三角形绕序反了 17 天从内部可见，港口硬编码 0.3 m 被地形埋住，改用同一高度函数生成网格与摆件；当前游戏目录未列该作）。

### 5.5 第二轮：中文作者日志/作品，二改线索具体但入口或 AI 分工缺（9 项）

| 作品与入口 | 核到的内容 | 缺口 |
|---|---|---|
| [《瓦楞速运》开发者日志 2 / 4](https://www.taptap.cn/moment/860294180608411729)（可燃工作室；日志 4 <https://www.taptap.cn/moment/861023722948003179>） | 日志 2：作者自述被 AI 的十几份关卡策划案唬住；要求“再复杂一点”后，AI 在场景里堆了六七个旋转平台和对应开关，打开关卡“不知道往哪里走，也看不出一条清楚的通行路线”；随后作者自建白模搭建器，先手搭三条传送带的协作路线并自己试玩，再交给 AI 细化，组员试玩后认为比 AI 直接生成的关卡好玩。日志 4 补返工账：关卡初期白盒由 AI 搭建，导入美术场景时“没有分组，而且很多的细节和关卡引导都没有做好”，后续大量精力用于修补；又因 AI 工作流难以大改模型，改走灯光引导（第一关冷白光指主通道、暗暖光指解谜点）并加体积雾 | 只有 moment，没有可玩/商店入口；无版本、许可、成本；AI/人工分工清楚但二改后的完整可玩性未验；无截图原链 |
| [一声之间](https://www.taptap.cn/moment/857701579598334467)（澄江子） | 关卡布局二改有原文：“这轮重做了七个房间，还删掉了一些让人只能挨个试的落点”；新增“第二份工作”——只回应一次的小怪物唱过后变成通道，同一怪物可在后续段落再次回应；并把“声音折返路径、再次演唱者、让路者”一起设计；10/09 日志，两张运行截图原链本次 200；作者用 Godot，明确“制作中有 AI 辅助” | 没有独立试玩/商店链接（只有聚光灯活动页）；AI 具体做什么未写；无版本、许可、成本；改后是否完整可玩未验 |
| [牛顿的脑内回响](https://www.taptap.cn/moment/859821701528027390)（狂热信徒） | 放弃“清完怪→弹窗选房→切场景”，改成 A—走廊—B 同一坐标系的连续地图，房间 1920×1080、走廊 220×320、门宽 220，进入下一房间后门洞变成有碰撞和视觉表现的实心墙；未击杀怪物保留血量，跨房间追击列为下期；用“体验标尺”量白怪与地板对比度 1.235:1→加墨色描边后墨色占比 27%→49%，并让几个 AI 各出一版再筛；配图原链本次 200 | 无可玩链接、无版本；AI 工具与人工分工只写“几个 AI 各出一版”；跨房间追击尚未实现 |
| [AI编年史](https://www.taptap.cn/moment/857791875526952608)（Hunter & Friday） | 第五章核心互动被作者推翻两次：第一版“太无聊”、第二版“不够震撼”、第三版才找到“点一下整张网络同时亮起”，第一章点烟过场因被当成卡死补了提示与跳过；TapTap app/954910 有试玩 DEMO | 页面未披露 AI 工具与人工分工，按门槛只能算丙级线索；无截图原 URL、版本、许可 |
| [NEURONS](https://www.taptap.cn/moment/860623916882724394)（张溢泽，两人团队） | 初代 3D 原型、第二版 2D 像素原型都不满意后放弃该方案，回头调第一关布局与走近/伸手/搜寻交互并持续试玩；AI 做代码/场景/资产但未点名工具；app/710826 只是聚光灯 jam 页、无当前可玩入口 | 无当前可玩入口；AI/人工分工与工具未写；无版本、许可 |
| [Infinite Pokémon](https://github.com/Shellishack/infinite-pokemon)（Shellishack） | README 记录 layout v2：启动时升级旧布局，先备份 pre-layout-v2-*.sqlite，训练家若落在新墙里会被移到可达空格，保留进度/同伴/记忆；Codex 驱动、地图模板需通过 schema 与依赖校验；浏览器 demo <https://infinite-pokemon-blond.vercel.app/game/> | 二改更像格式升级而非试玩后重做；demo 本机 curl exit 000；无截图原 URL、许可 |
| [Song of Larithea](https://larithea.com/devdiary) | Claude 参与工程与模拟试玩，战斗从脚本演出改成漫画分镜序列、并专门做“让敌人不那么有攻击性”的一轮 | 无 demo/商店链接、无具体前后数值；版本/许可未披露；只能当作者过程线索 |
| [翻面 FLIPSIDE](https://www.taptap.cn/app/1000462)（Mark-Pan 工作室／B站 @s-1mple-） | 中文社区里少见的“AI 做的 3D 第一人称战术射击”可玩样本：作者自称文科生、不会写代码画画，一个人用 Opus 5.5 四天做出 5v5 翻面爆破 FPS；TapTap 测试页有试玩 DEMO（60 条评价），Steam 5520840 为 coming soon；B站 BV1nKsX6jE7r、BV1RYxv6oEtw。2026-10-29 有玩家吐槽“第一张地图直来直往…相当于只有一张地图”；作者 2026-11-06 预告训练场新增第一人称攀爬图 10 章 30 段约 290 米（弹床/弹射器/梯子/浮动平台/转盘），分经典无存档与休闲每章存档，并加两张计时榜。 | 没有已完成的“第二次改路线/地图/掩体”记录；攀爬图公告写“已提交审核”，本次未上线，四天工期也不支持已完成二改；按二改门槛不成立，只能作“AI+3D+可玩”的对照，不建议进甲级 |
| [灵山未至](https://store.steampowered.com/app/4944390/)（玄一智能） | 3D 西游 Roguelite 割草动作，Steam 2026-09-16 发售、移动端免费；小红书有“用 AI 开发并上架 Steam”的演示，但只讲到龙王 Boss 的 30% 血变身与水球/漩涡技能，未给关卡设计过程；手游历史日志只有 1.0.23（2026-10-08）修发烫/插屏广告/隐私 | 不属关卡二改；AI 证据只有转述；无作者原文与关卡改动记录 |

去重：蚁SCAPE（app 957599）已在 §5.1 收录，此处不重复；《瓦楞速运》日志 2 与日志 4 是同一作品，已并为一行。

### 5.6 第二轮：二改强，但只有过程/文档、无独立可玩入口（5 项）

以下 5 项的二改本身具体，但都没有独立可玩入口或需要自备商业本体/ROM，按门槛 2“只有宣传页、waitlist、下载包承诺的不进 A/B”从严降到丙级；保留是为了说明线索和缺口，不占乙级名额。

| 作品与入口 | 一次具体二改 | 为什么在丙级 / 缺口 |
|---|---|---|
| [Peas of Resistance](https://game.stresserbse.de/post/who-is-right-the-test-or-the-game/)（Marco & Claude） | Training Garden 整关重建（旧布局停在 9 月 13 日）；40 多条测试硬编码旧坐标，46 条依赖实时关卡的测试迁到 tests/fixtures 的“冻结测量关”，删掉只钉住可移动物件位置的测试；配套每关一个文本目录的关卡格式与浏览器编辑器（可达性叠加、难度曲线告警、ghost 回放、从光标处试玩，<https://game.stresserbse.de/post/the-editor-as-workshop/>） | 官网只有 Steam 愿望单，无公开可玩 build；截图只有编辑器图；本端未试玩 |
| [HCT 1.6 – Chile](https://github.com/irregbex/hct16-chile-mod)（Horizon Chase Turbo 智利 mod） | AI 写全部代码、模型、音轨和 164 条智利赛道；CHANGELOG 2.3.8 把 Los Vilos–Illapel 的三个收费站整段撤掉（文件留档待回装）、2.4.0 把 Playa Las Docas/Amarilla 海滩赛道改成可撞岩壁与暗礁、2.3.5 把 Plaza de Illapel 从 5 圈改 3 圈；赛道仍是可编辑 race.json 并带 track editor | 需自备 Horizon Chase Turbo，不是独立可玩入口；本清单未给作者静态截图原 URL；本端未试玩 |
| [Luv Sense Digital《Game 0》2-15 工厂潜入](https://luv-sense-digital.readthedocs.io/zh-cn/latest/development/game0/factory-infiltration.html) | 第二波遭遇第一版复用全场索敌，两人队伍约 17 秒被远处守卫集火；第二版加 550 单位接敌距离、受击警戒、走近后 prepare/射击，保留失败 JSON，并用 41.7 秒真实鼠标实测与 FirstPatrol 回归 | 无公开可玩入口；AI 只用于守卫图，整关未完成；本端未试玩 |
| [PrimeGame #593](https://github.com/xperiaroco2/prime-game/issues/593) / [#1035](https://github.com/xperiaroco2/prime-game/issues/1035)（Claude Code 起草 issue/文档、人决策） | #593：MVP 先保留可跑的简单 House 灰盒，第二遍改为 Blender 建模、独立可换件、房间/任务点为独立场景共用门墙尺寸，已合并 35 个灰盒房间、楼梯、出生点、第二张基础模式地图与可读性 pass；#1035：审计现状“7 个环路、12 个死胡同房间”，提出 11 处开口可做到“18 个环路、1 个死胡同”，随后从 hub-and-spoke 改为非线性 estate/dacha 网格，要求“每个房间有机制、每个机制有位置”，10-21 批准室内/附属建筑/隔墙传声规则 | 本清单未给可玩入口、截图原 URL、版本；AI 只起草 issue/文档，设计决策由人；本端未试玩 |
| [Cart Chase 2P](https://github.com/irregbex/CartChase2P)（约 1.3 万行 C/Python/JS 全由 Claude Code 写，人类只做设计与逐版试玩） | 关卡生成器第二版（2026-10-09）把“轨道高度对齐但景物跳变”改为同景物列＋同高度平轨，编辑器用橙色标剩余接缝，110 关 v2 与无头跑车 bot 都已落地；确认 visible seam 规则与 110 关版本 | 需自备 DKC ROM，非商业同人许可，不是独立可玩入口；本清单未给截图原 URL、成本；本端未试玩 |

### 5.7 第三轮：只有过程、只有入口或二改未落地（38 项）

| 作品与入口 | 核到的内容 | 缺口 |
|---|---|---|
| [五行](https://www.taptap.cn/moment/860440733646065498)（TapTap 聚光灯 2026，四二先生） | 日志 03（2026-10-14，<https://www.taptap.cn/moment/859573665711262486>）写明火跳与藤蔓两条路线只有方案、尚未逐条验证，并决定“先不扩关卡，就盯着这个房间，把两条路线各自走一遍”；日志 04（版本 2.14.1）把房间从 1 个扩到 11 个、每间试一种交互，修好重力反转后的藤蔓攀爬并调整末端衔接，Unity 运行模式通过 25 项自动检查。AI 写程序，人定规则、画地图。 | 未找到公开可玩页或商店页，只有 Windows/安卓 2.14.1 包；自动检查不等于真人可玩；不是 3D；本端未启动。 |
| [涌现](https://www.taptap.cn/moment/857859574714074444)（Esharo，TapTap 聚光灯） | 明确的“第二遍审查全部关卡”指令：作者先让 AI 生成 5+5 关，再要求“先开始重新审查所有关卡、所有参数，是否正确的完成了关卡对应的表达，和是否有独特的玩法”，同时给每关加表里关；举了火山关星星落地堆积变灰、目标需同时计分与清除灰星的机制改法。页面有四张场景/关卡截图原链。 | 该页没有可玩入口（同名 app/963011 归属未确认，未合并）；未点名模型/工具，无版本、许可、成本；二次审查的输出作者说去睡了，未展示。 |
| [Road of Borrowed Names](https://github.com/A-Birdi/Road-of-Borrowed-Names/issues/1)（A-Birdi；可玩 <https://a-birdi.github.io/Road-of-Borrowed-Names/>） | 日语学习叙事 RPG，分工写明 “Claude Cloud owns the game implementation / Claude Local owns voice production”，独立 QA Agnes 逐次实机并提交候选；反馈已导致 Daigo 补上缺失的 Cove 线索、修“点告示板图/字会被移到板后”、修正 Oto 对话与其水井位置不符。 | 缺陷集中在线索与空间提示，没有路线/遭遇的第二次重排；页面 24 MB、版本只到 commit f7f0406；本端未启动。 |
| [r/aigamedev：AI 做 PvE FPS 关卡的收敛失败实录](https://www.reddit.com/r/aigamedev/comments/1xlu68a/has_anyone_found_a_workflow_for_pve_fps_level/) | 作者在 Godot 用 GPT 6.1 做 100×100 m 办公室灰盒，两天内反复否决：首版直走廊＋超大房间、细分后又变成均匀小盒、要求少走廊后几乎失去走廊网络；给真实平面图后要么丢细节要么像描图；“agent 能很有说服力地讲视野/备选路线/房间尺寸/流线，然后产出同样的问题”。最关键的一句是“有版本通过了导航与玩法检查，但我还是不想继续玩这张图”。 | 没有可玩构建，纯过程证据；Arctic Shift 评论树只取到少量回帖；本端未启动。 |
| [collagen-collective/ts-game-template #30](https://github.com/collagen-collective/ts-game-template/issues/30) | 来自 WW2 僵尸项目 `ts-kyle-on-duty` 的关卡设计教训：测试从“知道控制点在哪的位姿”出发，玩家却找不到探照灯控制；雪堆缺失让屋顶僵尸站在窗台下 3 米；家具挡住出生点视线里的关键物；“a cabinet with no collision”；墙购提示被相邻窗户修理提示抢走。修完后两轮 agent 用假手柄走完整循环又发现 14 个问题，其中 3 个出在第一轮自己的修复里；最终测试改为从玩家位置、只用屏幕与扬声器给的信息、并走真实输入读取器。 | 仓库是模板不是游戏，无可玩入口；`ts-kyle-on-duty` 404/私有；本端未启动。 |
| [Springfield Studios](https://springfieldstudios.dev/about/) | 把“第二次修改”写成明确上线规则：Bart 试玩给分，分数弱时 Ralph 按批评出第二稿，“if the second pass is better, it ships. if not, the original does”；站点称 87 个周期产出 66 款、21 次失败。 | 无发布日期；作者是 agent 人格，作者门槛存疑；本端未启动。 |
| [Baldies Remake](https://simoneresearch.com/work/baldies/) | 2026-10-07 起三天内由 AI coding agents 重建 1995 god game：桌面版从自有拷贝载入全部 100 个原版关卡（五世界），作者记录“4 个视角全部关卡加载、0 错误、最慢 479 ms”，另有 334 项自动测试；浏览器版改成生成关卡。 | 是“关卡数据/格式逆向＋批量验证”的样本，但没有同一路线的第二次设计修改；作者身份与代码许可未披露。 |
| [Journey to the West · Three Borrowings of the Banana Fan](https://xiyouji.vibecoco.ai)（zenstory-ai/novel-to-game；MIT） | Codex 在 `codex/xiyou-world-and-skills` 分支实现；v0.6.0 的 whitebox playtest 后，v0.7.0（2026-11-05 发布）把《西游记》四张行走图从 1672×941 扩到 2400×1600（约 2.44 倍），加 8 处可选探索（4 处观察＋4 处一次性补给），路径按真实连续坐标计算、碰撞跟随可见路径、旧档封妖坐标确定性迁移，QA 从玩家真实位置走完整路线；PR #86（2026-11-01 合并）有完整前后说明。作者截图原链 <https://raw.githubusercontent.com/zenstory-ai/novel-to-game/main/examples/journey-to-the-west/screenshots/hero.jpg>、<https://raw.githubusercontent.com/zenstory-ai/novel-to-game/main/examples/journey-to-the-west/screenshots/battle.jpg>（本次均 200）。 | **入口 `xiyouji.vibecoco.ai` 虽 HTTP 200，但仅 874 字节 SPA 壳、未执行 JS，当前可玩性未确认**，按门槛 2 从严暂列丙级；作者是 ZenStory AI 组织/handle，缺个人作者身份；人机分工只有发布说明与 PR；3D 行走图扩大不等于路线重排，但碰撞/可达性改动可核；本端未试玩。 |
| [Saboteurs](https://saboteurs.app/)（Alejandro Vizio） | 《Hora Cero》同作者的前作、也是 Hora Cero 复用引擎的来源：8 个二战潜行关卡按巡逻路线、灯光与撤离点设计，0.6.0 公测。 | 官网要求留邮箱发链接，无公开直连；页面未说明 AI 参与，只能作同作者关卡结构线索。 |
| [AutoFarm](https://www.reddit.com/r/aigamedev/comments/1xi6kxm/autofarm_devlog_an_aiassisted_pathfinding_fix/) | Godot 农场管理游戏：第一次 A* 道路成本修复后村民仍斜穿草地，第二次归一化成本并补上漏改的第二个启发式设置，再用 Dijkstra 和“市场路线必须走绘制道路”复核（devlog 记 v0.74.1）。 | 作者明确说暂无公开 demo；itch devlog 本机 TLS 000；本端未启动。 |
| [Tougelike](https://njlent.de/tougelike/) | PSX 风格山道竞速：外部试玩评分指出碰撞与速度感问题后，作者称把道路收窄约 10%、重调车流、把显示速度降约 15% 并重做 boost/drift，属赛道级二改。 | 当前页面只显示加载/“THE DESCENT WILL BE READY SOON”，可玩 build 未确认；细节来自聚合页对帖内后续编辑的整理；本端未启动。 |
| [WHEELCHAIR D](https://www.reddit.com/r/aigamedev/comments/1xlp32u/i_used_a_wheelchair_for_the_first_time_in/) | Freight Fright 作者的另一款 31 赛道竞速：赛道先取自真实赛道与地形，再按轮椅操控反复调形到“和原赛道完全不像”，是同一路线的第二版。 | 缺逐赛道前后对照；移动商店页本机不可读；本端未启动。 |
| [VECTORCLAD](https://agilancer.github.io/vectorclad/) | 浏览器机甲沙盒先用 10×10 城市街区生成，后续纹理集/广告牌又驱动城市修订并用标注截图回修；当前可玩。 | 二改偏布局/视觉，尚未见遭遇节奏记录；许可/成本未明。 |
| [Chulk Runner](https://www.reddit.com/r/aigamedev/comments/1xbxk09/chulk_runner_more_polished_version_of_the/) | Nightshoal 作者把原型按反馈做成 polished 第二版，重做画线删除与第二章橡皮擦难度并调整平衡。 | 属 2D 线条益智的第二版，路线几何证据弱；试玩入口是 Claude Artifact，应用壳未登录无法确认；本端未启动。 |
| [Stefan 3D AI 的 AI 策略游戏（未命名）](https://x.com/Stefan_3D_AI/status/2116874144109482069) | ZERO-G 同作者的另一款 AI 游戏：首月回顾把第二关画成 250×250 m 平面图并标出 324/289/205/121 m 四条进攻路线，另有独立单位试验场和 Day22/Day25 关卡日志，可直接借“先量路线长度再建关”。 | 公开可玩 build 未找到；X 登录墙/402，路线图是否由 Opus 起草只是 OpenDrama 编辑的推测；本端未启动。 |
| [寂静园](https://www.taptap.cn/app/968978)（冷色调工作室） | AI 辅助物理的类银河城，40+ 房间、四篇开发日志（日志 04 标“包含 AI 合成内容”并说明 AI 实现双物理系统），2026-10-11 起有 TapTap PC 试玩 DEMO。 | 日志只记内容扩充与物理修补，未见同一条路线的第二次重排；本端未启动。 |
| [SpectreX](https://www.taptap.cn/app/987474)（日月星） | AI 辅助的 Godot 光影解谜，2026-10-20 上线试玩 DEMO；开发日志记先定章节“大动态”再排房间“小动态”、Prism 规则从 16 种减到 3 种，并复盘后期“许愿式 AI 编程”失控。 | 第二次路线修改尚未落到具体房间；仅显示 SpectreX 1.0.6“更新一些关卡细节”；本端未启动。 |
| [Bramble Keep](https://x.com/chongdashu/status/2115625800380903682)（Chong-U） | 用 GPT Images 2.5、Tripo、Blender 与 Codex 做的浏览器多人攻城游戏，作者视频拆到关卡、tuning lab、联机和 Boss 各一段。 | 关卡是否有第二版未读到（OpenDrama 的 How it was made 段为会员内容）；X 登录墙；本端未启动。 |
| [Mini 4WD racer](https://x.com/lxfater/status/2108130818447314947)（lxfater／铁锤人） | 一天内用本地约 100B 模型、Tripo3D 与 Godot 做出的四驱车赛车（选车、改装、比赛、必杀）。 | 赛道与车辆编辑的二次调整只在会员拆解里；X 登录墙；本端未启动。 |
| [ts-kyle-on-duty](https://github.com/collagen-collective/ts-game-template/issues/31)（Kyle on Duty，WW2 僵尸关卡） | issue #31 记录该游戏三关的跨关二改：海上要塞二层柜子可隔天花板交互（交互距离缺视线检查）、石屋碎家具阴影残留、雪堆缺失让可达性测试假过而敌人停在窗下；修法进共享渲染/交互代码并用同机位帧对比复验，另提到 2026-10-10 “fort post-mortem”和 2026-10-11 “High Fens”两篇设计日志。 | 仓库 <https://github.com/collagen-collective/ts-kyle-on-duty> 已 404/私有，未找到公开可玩 build；只能作高价值线索。 |
| [NeuralVisionRacer（Splat Racer 原型）](https://monstercameron.github.io/NeuralVisionRacer/web/) | 3D 扫描赛道竞速，`documents/continuation.md` 记录第二次碰撞 pass 把 `hull_friction` 0.1→0.02、新增 `wall_slide` 0.6，30°/15 m/s 擦墙保速 3.1→6.1 m/s，并有 headless agent console 与四关浏览器 demo。 | AI 参与未注明；截图/许可/成本未明；本端未启动。 |
| [Project Plateau · Proof Before Dark](https://plateau.vibecoco.ai/)（worldwonderer/vibecoco） | 与组内《西游记·三借芭蕉扇》同站的另一款第一人称 3D 摄影游戏（“四块玻璃板、一个活山谷、回营地的路”）。 | 页面只有构建和一句简介，未见 devlog、版本或关卡二改记录；本端未启动。 |
| [NEON TRENCH // RUN](https://github.com/czinabu/neon-trench)（czinabu，POWER TRIP 同作者） | 五关 Three.js 战役（含训练关、支线目标、舰队战）；提交记录有“把可行走甲板做成合作大厅”、任务收尾与目标追踪等空间改动。 | 没有逐版路线二改说明；无托管可玩链接；本端未启动。 |
| [DELVERS: Dragon's Hoard](https://delvers.pages.dev/)（ilrein91，Misty 同作者） | Misty 作者的 run-based 队伍自走棋，网页可玩。 | 帖文只有玩法简介和可玩链接，没有关卡/路线二次修改记录；本端未启动。 |
| [hyperg8_games 的浏览器潜行射击（教程关二次修改，帖中未具名）](https://www.reddit.com/r/gamedev/comments/1x063zu/i_went_through_every_playtest_recording_of_my/) | 由《AI playtest agents vs. real playtest recordings》作者主页追到：他按 Poki 真人录像把首关教程房做了第二次修改——聚光灯移到不可破玻璃后、降低掩体、把示范幽灵移到目标后方并加镜头引导、门闸改为完成教学才开。 | 帖中没给游戏名与直达入口，只能先记作者原帖，需回其 CrazyGames/Poki 页补；本端未启动。 |
| [Westward Once More / 重走西游路](https://store.steampowered.com/app/5444700/)（Neo Gor） | 《无限世界》同一开发者的节点地图 roguelite，免费 Steam Demo 于 2026-10-29 上线（正式版 app 5410650 定于 2026-11-30），核心是在节点地图上选路线、招募护法。 | 页面没有声明 AI 参与，只能作同作者线索，需回作者/演示核 AI 分工与关卡二改。 |
| [Voxel-Art Colosseum](https://voxel-art-colosseum.ok.kimi.link)（Kimi K3 案例） | Kimi 能力页引出的 K3 官方 blog 案例中可玩的体素罗马斗兽场 FPS：说明用 headless-Chrome 截图检查做了 20+ 轮环境与玩法自迭代。 | 只有厂商展示页，缺独立作者、逐轮前后差异与版本号；本端未启动。 |
| [九霄剑域·凌云诀](https://g4ho6wlhva47a.ok.kimi.link/)（Kimi K3 案例） | 同批 Kimi K3 案例里可玩的 3D 武侠 RPG：环境在 Blender 中重做并明确写 improved collisions 与 PBR 重贴图，落在碰撞/关卡几何层。 | 只有厂商展示页，缺作者、版本号与逐次改动记录；本端未启动。 |
| [涌现理论](https://www.taptap.cn/moment/861429848365600399)（TapTap 聚光灯 2026，空值工作室；游戏页 <https://www.taptap.cn/app/984342>） | 中文社区里最强的“同一关多版返工”叙述：第四关冰面滑行试玩后团队不满意，来回改五版，最终按主策划手绘的 9×9 稿重做（外环滑道、中央纵列、三排对称水阵），新增“解冻造停点”——把来时的冰化回水才能半路停下转向；复位按钮升级为整关重置；并修掉第四关未通关重进容易卡死。 | 全文未提 AI 工具或 AI/人工分工，按本卡 AI 门槛不能算候选；暂无可下载试玩包（Windows 包在走 TapTap 上架）；只作关卡五版返工过程参照，不能当 AI 样本。 |
| [Candlelight](https://dit6w8tahykhu.cloudfront.net/game/g_ghost_candles)（PlayProof） | 从 Nectar Dash/First Snow 同站 gallery API 追到的 5 关幽灵蜡烛解谜：每关有自动 critique，Level 1/5 明确要求把幽灵巡逻路线或蜡烛触发规则放进必走路径。 | 二改建议已具体到关卡段、但尚未见改动落地；无可玩版本号与截图；本端未启动。 |
| [Skate Escape](https://github.com/webgnar/skate-rogue)（webgnar） | 3D 滑板 roguelike；`docs/GDD.md` 记录 2026-10-24 第一版高空路（高架高于跑道 2 格），10-31 作者明确要求“天空层要和地面一样认真做关卡设计”后连续 route pass：#356 更长平台、高低路线、跳接与攀爬，#300 可磨 I 梁，#301 摆动磨轨，#324 云层贯穿整层；提交多为 Claude Opus 5.5 协写。 | 仓库只有 `npm run dev`，未找到公开可玩构建，按门槛只能作过程线索；本端未启动。 |
| [POWER TRIP](https://github.com/czinabu/power-trip)（Caleb Zinabu） | Three.js 第三人称动作游戏；提交/PR #353 记录 level design pass：为可读的敌人到场加 spawn director、到场标记、地图审计工具与指南，另有 `smoke:maps`/`smoke:collision` 逐图验证。 | 只有本地 `npm run dev`，无公开可玩页；代码 All rights reserved，不能作为可玩候选。 |
| [JumpCastle](https://github.com/thienphuprogrammer/JumpCastle-Raylib)（Thien Phu） | C++/raylib 纵跳平台；PR #5 把 campaign screens 00–16 按 screen-17 风格整体重做，18 屏连续路线由同一生产物理的无头 solver 逐跳验证（≤90% 蓄力、5 次扰动复跑至少 3 次落点一致）。 | 无 release、只能自行编译；缺公开可玩入口、版本号与 AI/人工分工原文；仓库含 Claude/Codex agent 配置。 |
| [Amnesia Bullet](https://store.steampowered.com/app/4747710/)（Steam Demo，eye-factory） | 零编程作者 eye-factory 用 AI 约一周做出、约 30 天在 Steam 上 Demo 的 3D 第三人称射击；0.2.0 大幅改敌人移动速度、追击、射击、跳跃和角色碰撞，1.0.5 修最终 Boss 关水面超出穹顶。 | 没有路线/地图布局的第二次修改记录；作者身份、资产许可、成本未核；本端未试玩。 |
| [无限世界](https://store.steampowered.com/app/2922170/)（Steam 页为 Coming soon，仅商店页；Neo Gor） | 开发者公开分项 AI 占比：小场景地图约 80%、人物模型约 90%、支线任务约 95%、功能开发 100% 由 AI 辅助，大场景地图仅约 10%，游戏测试 0% 仍由人工完成；v1.2.0（2026-06-26）新增灰石镇主线及旅馆/酒馆/矿场等多张地图（v1.2.0 与 AI 占比来自 TapTap/开发者发布页；本清单未取得可直接打开的原文 URL）。 | v1.2.0 是加地图，不是改旧图；没有第二次路线/遭遇修改；Steam appdetails 本次复检 `coming_soon=true`、ISteamNews 只有 2025-10-22 的 “Test v1.0.1”，v1.2.0 与 AI 占比不在该商店页上；缺原文链接；本端未试玩。 |
| [仙门守护者](https://store.steampowered.com/app/4868150/)（Steam，程序员小灰） | 可玩 Demo＋正式版，4 张地图/24 关；Steam AI 披露写明生成式 AI 辅助部分美术/音乐/音效以及玩法原型、文案和代码，所有 AI 内容经人工筛选、修改、测试；1.0.2（2026-07-21）下调中后期关卡难度、修正地图 3-4 关怪物走位 bug，1.0.5 又提高重复刷关气运 50%、1-5 关起初始灵石 +10。截图原链 <https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/4868150/c58f5edb0967cbdb959d9158409c4926dbaf73c2/ss_c58f5edb0967cbdb959d9158409c4926dbaf73c2.1920x1080.jpg>（200）。 | 是难度与 bug 修，不是同一路线/遭遇的第二次重排；AI 在关卡设计中的具体份额未写；本端未试玩。 |
| [Dead Orbit](https://store.steampowered.com/app/5380790/Dead_Orbit/)（More Fireballs） | 《We're Gonna Need More Fireballs》工作室官网列出的下一款太空打捞游戏。 | Steam 仍为 Coming soon；没有可玩 build 或关卡修改记录，按门槛 2 不计。 |
| [Grim Reach Idle 1.3](https://www.reddit.com/r/aigamedev/comments/1xbg7tv/grim_reach_idle_13_sharing_my_journey_and/) | 作者自述 99.9% 代码由 AI 写，1.0 前先加游戏内 bug 上报（附截图＋文字直发 Discord 频道），再把报告 “basically threw them at Claude” 去修；复盘首发上错未打磨构建导致 80% 差评。 | 没有路线/遭遇二改，只给“玩家反馈带截图与上下文→可版本化修复”的最低成本做法；本端未启动。 |

去重：齿轮塔防（app 972651，§4.5）、翻面（app 1000462，§5.5）、涌·墨卷（app 986579，§5.1）与 Survive the Night（FPS 版，§4.7）均已在原条目收录，本节不重复计数；前三项的第三轮玩家反馈/作者回复已并入原条目，Survive the Night 的 FPS 行已并入 §4.7。

## 6. 丁级：按任务规则排除或转交（9 组＋2 项＋第三轮 1 项＋19 项旧候选）

**任务点名只可作旧对照、不计新候选的 19 项**（不重复计数）：Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R'lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso、Capybara、backroad rally、Long Wind、World of ClaudeCraft；`pxl` 是工具，不算游戏。上述均已在游戏首页、`docs/research/2026-10-23-game-worth-trying.md` 或场景/角色/音频卡覆盖，本卡不重列。

| 排除/转交项 | 链接 | 原因 |
|---|---|---|
| Super Mario Galaxy Movie Game | <https://supertommy.com/games/super-mario-galaxy-movie-game/>（作者 <https://x.com/supertommy>） | 页面自述 Claude Code（Opus）写约 95% 代码、731 commits/53 天，并说 “if I had more time I would have made it even better”；页面没有“关卡设计完全失败”之类的作者原话，该说法未核到原文，按未核处理；没有第二次路线修改记录，不构成二改案例 |
| 颅内坍缩指南 NewtonTaker | <https://www.taptap.cn/moment/859462613711455915> | DeepSeek 地编三轮都“一言难尽”，作者放弃双层立体城市改平面地图；总结“自己搭场景→AI 读取做路线规划→接入”优于反向；未给试玩链接，作边界证据 |
| 涌现新世界 | <https://www.taptap.cn/moment/861930180011101334> | AI 能快速改系数却“很难真正调好”机甲 3D 动作，Mixamo 动作仍像缩小的人，最终转 2D 帧动画；说明 3D 动作关卡手感验收仍要人，非二改候选 |
| Emberwick | <https://simonw.github.io/emberwick/v11/emberwick.html> | v02 的“别这么平”＋地下室/隧道/山洞改动确属空间二改，但按“同一作品只归主要价值最贴合的一卡”转交 [B-AI-GAME-SCENE-LIGHTING-20261104](../B-AI-GAME-SCENE-LIGHTING-20261104/sources.md) §4.1，不重复计 |
| Claude-of-Tanks | 无本清单链接 | 33 张战场改动集中在树/天空/光照，归场景光照卡；不重复计 |
| Race Evolutions | 无本清单链接 | 2026-07-30 因新增 hazard 改动原四条赛道布局并重置最佳成绩，但站点自称零人类工作室、无作者身份，按作者门槛排除 |
| Stay Dead / 亡犬 Dead Dog / SweatyPanzer | 无本清单链接 | 试玩构建与 AI 分工未核，未计入候选 |
| Wicklight / A Rock and a Hard Place / DEEP | <https://itch.io/jam/ai-jam-4/rate/4885393>、<https://itch.io/jam/ai-jam-4/rate/4874311>、<https://itch.io/jam/ultimate-ai-powered-game-jam-2/rate/4876114> | 本机 itch 直连不可读，只有搜索摘要与 GamesByAI 列表；不当作已核原文。A Rock 的 BFS 自动 playtest 发现两关不可通、Wicklight 的 headless autoplayer 发现 burn 平方衰减与闪避 bot 撞测试上限，都是好线索，恢复 itch 后再核 |
| Duality | <https://duality-game-vibejam.vercel.app> | Vibe Jam 2026 数据集只有元数据；vercel 页 TLS 000，作者页/实机页未读 |
| 我是一把枪 | <https://www.taptap.cn/moment/858775746284355947> | 遭遇节奏从“波次无限往上加、没有通关”计划改成“9 波、3 幕、打完通关”，后续日志 04 已按 9 波做、地图改圆形并加传送；但全程未提 AI 参与，按 AI 门槛排除，只留作“波次封口”的节奏改法线索 |
| GamesByAI / OpenAI Showcase 可玩池（Eyrie、Sunset City、Neon Ridge Drift、Swifty Dungeon） | <https://playeyrie.com>、<https://sunset-city.didof.dev>、<https://ridgedrift.netlify.app>、<https://github.com/Dimillian/SwiftyDungeon> | 均可玩或代码公开，但页面只有作品简介，没有第二次路线/遭遇修改记录；只作“有可玩构建但没过程”的候选池，不计候选 |

### 6.1 第三轮新增排除/转交

| 排除/转交项 | 链接 | 原因 |
|---|---|---|
| Among Gas | <https://github.com/2f22vtd4kr-cloud/Among-Gas/issues/71> | 用户实机报告 “Collision map boundaries are irregular, too far from objects, and block intended paths”“gameplay movement is heavily obstructed and the current build is unplayable”；审计又发现 5 个与出生点不连通的玩家净空区、货车阻挡体是松垮圆角矩形而非车身轮廓。PR #74 用合并剪影边＋射线测试修卡车轮廓，但页面明确“没有可独立验证的 build”，按门槛 2/作者门槛排除，只作“AI 生成几何必须按可见轮廓测碰撞”的反面证据。 |
| Emberwick | <https://simonw.github.io/emberwick/v11/emberwick.html> | 第三轮复核仍维持原判：v02 的“别这么平”＋地下室/隧道/山洞改动属空间二改，但按“同一作品只归主要价值最贴合的一卡”转交 [B-AI-GAME-SCENE-LIGHTING-20261104](../B-AI-GAME-SCENE-LIGHTING-20261104/sources.md) §4.1，不重复计。 |

## 7. 工具与方法线索（13＋23＋68 组，不是作品）

| 线索 | 链接 | 用途与边界 |
|---|---|---|
| Kyle Kukshtel《Your Game Is A Harness》 | <https://kylekukshtel.com/ai-harness-engineering-game-development-claude-code> | 2026-10-10 的实践文（HN 177 分）：固定种子、精确存读、序列化命令回放、headless 模拟、odiff 截图对比、文本 profiling，让一次改动秒级可验；没有具体关卡案例，补的是二改验证链 |
| HN 讨论：AI harness for game development | <https://news.ycombinator.com/item?id=50072120> | 同文的正反讨论：“LLM 已解决编码”被多位从业者反驳；确定性跨平台难维护；Simon Willison 补充 Safari/Chrome 回放不同步。用于校正 harness 的适用范围 |
| Ludra | <https://github.com/ersingvn/ludra> | 2026-10-24 的 AI-native 游戏引擎（MIT，v0.96）：游戏是 JSON，`ludra solve` 证明关卡可通关并量出每跳余量，`ludra fuzz` 找软锁，`ludra review` 标未完成/不公平；把“二改后还能不能玩”做成命令 |
| Aura Autopilot 1.0 | <https://github.com/ramenvr/autopilot> | Ramen 的开源 AI 试玩系统（2026-11-03，build 31cb1e5），经 MCP 接 Unity/Unreal/Godot，agent 自建控制 harness 并输出报告；许可未核 |
| Claude Code Game Studios | <https://github.com/Donchitos/Claude-Code-Game-Studios> | 49 agents/74 skills/15 hooks 的 MIT 模板，含 level-designer agent 与 gate-check；README 自报 standard 版用 30 份文档、58 分钟做的四款游戏被两位盲评和一次人玩排最后——结构不等于质量 |
| awesome-opus-5.5-games | <https://github.com/gamingnews5/awesome-opus-5.5-games> | 3,888 个 AI 游戏单元、3,581 个源仓库的索引，带模型归属等级、可玩链接和截图评分；是继续找“有源可查二改”的检索面，本身不是作品 |
| BizStack《AI vibe-coding games in 2026》 | <https://bizstack.tech/ai-vibe-coding-games-in-2026-what-works-what-breaks-what-ships/> | 2026-11-03 汇总：Battle Drones 经 12 次大改/321 commits，itch.io 日新增从约 3k 到 6k（8/3–10/30），Roblox 50 万用户/7 万游戏；并列出长局状态、回放确定性、美术绑定、设备性能等失败面 |
| Brainy Neurals AI 3D 关卡管线案例 | <https://brainyneurals.com/case-studies/ai-3d-level-design-dev-package/> | 2026-10 的 vendor case：brief→规划 agent→专用 agent→严格 schema 检查→空间检查（重叠/悬空/封死唯一路线）→mesh；原话“合法 JSON 仍可能描述一个没人能玩的关卡”，是二改前自动门的具体做法，但无工时收益数据 |
| Butter Up! Devlog #2 | <https://www.butterstack.com/blog/butter-up-devlog-day-two/> | 2026-06-28 的多 agent 管线日志：Game Designer agent 定关卡坐标，Parker House 从 Day1 的平面测试场变成约 12 块按跳跃弧线调的平台、3 个热区、可选冷却拾取和连续接住地面；无试玩入口 |
| TapTap 聚光灯 2026 | <https://www.taptap.cn/app/710826> | 21 天 jam，官方称 2000+ 可试玩 Demo，平台提供 TapTap 制造 AI 工具；本轮多数中文候选出自这里，是持续找“作者自述＋可玩页”的源池 |
| aibuiltgames / Playgama / claudeslop | <https://aibuiltgames.com/api/games>、<https://playgama.com/ai-game-index/> | aibuiltgames 238 条全量 API；Playgama 只有聚合统计；claudeslop 一直 Loading。只作索引，不把条目数当品质 |
| Old Circle / abagames / game-forge / Godot-Director / harmonist | <https://github.com/Usnul/old-circle> | 同批 GitHub 线索；只给流程规范或引擎/模板，没有具体关卡二改记录，未计入作品 |
| Turbo Kart Rally / SUNBREAK | <https://github.com/bridge-mind/turbo-kart-rally>、<https://github.com/Imirushik/sunbreak-downhill-3D-game> | 均为单次提交、无二改；只作“有可玩构建但没过程”的对照 |

### 7.1 第二轮新增工具/方法（23 组，不是候选作品）

| 线索 | 链接 | 用途与边界 |
|---|---|---|
| 《AI Workflow for Game Designers》Part 7 关卡设计（Minsoo Lee） | <https://github.com/eremes81/game-design-ai-practice-en/blob/main/manuscript/part07-level-design/chapter-1-procedural-level-design-master.md> | 24 年游戏设计师、前《仙境传说 Online》设计组长；7.1 开篇是真实事故：47 号房出口被封，build 和 QA 都过，上线第 3 天才被玩家截图发现；修法是把“起点→Boss 可达、无死路”的图检查做成 build gate，并主张验证必须由代码而不是人的注意力保证；7.3 用 pattern library 管复用与影响面。全文 CC BY-NC-SA，可读 |
| Dora SSR《When Agents Test Other Agents》 | <https://github.com/ippclub/dora-ssr/blob/main/Docs/blog/2026-08-16-05-agent-accepts-agent/index.mdx> | 让 Codex 当用户、Dora Agent 当开发者，跑出 80+ 个游戏目录（含 v2/v3 修订，一批 24 个游戏 112 个任务 1,855 轮）；验收拆成“能构建 / 引擎能跑 / 玩家看得见能操作能通关”三层；作者明确像素检查只能抓黑屏/缺色，抓不了构图、可读性、动画和手感 |
| EVEngine 0.6→0.6.1（indienova） | <https://indienova.com/u/magicfuns/blogread/39356> | 中文工具文，主题正是“AI 写出第一版游戏后怎样继续修改”：白盒批量搭景、自动试玩、用 recipe 记录输入与断言，建议选小场景连改三轮并留证；不是作品，是二改验证方法 |
| Antti Kananen 生产报告（Games Alchemy #77 的转述） | <https://makegamewithai.com/news/ai-game-development-beyond-demo> | 路线审计跑数千采样、控制器走入口/楼梯/长路径，但结构测试通过仍会在玩家视角出现反墙、别扭转角、缺 bypass，流程是规划—生成—走查—取证—人工否决—修正；原文 Substack 本机 TLS 失败，只有转述 |
| worldbuild-bench | <https://github.com/sebnado/worldbuild-bench> | 同一 harness、三份 brief（Arena Combat、Physics Puzzle、Sunset Apex 三圈赛道）让 10 个模型产出 29 个可玩 3D build（round 页与 README 主文均记 29；README 首屏另一处写本轮 27 个），专门量空间/时间/因果一致性；作者自述自动 gate 几乎全过、人打开仍见不可解关卡/圈数不计。可用来对照“同一赛道要求下生成的关卡是否可读、可跑” |
| Playtester（pt） | <https://github.com/Preponderous-Software/playtester> | Familiar 的 0.1.x AI 试玩和 Kindling/Atman 的 playtests 都由这套开源 pt 工具产生；README 写明并行 agent 看截图按键、可选 probe 精确操控、多份报告合并成带目标用时的 summary，并自带 Beyond Nations/Kindling/Atman 三个游戏 profile |
| Strata | <https://github.com/Preponderous-Software/strata> | Familiar、Kindling、Atman 共用的开源引擎，为试玩提供 Drive channel（注入输入、共享帧钟、STRATA_DRIVE_CLOCK/STEP、headless 截图），让 AI 试玩可重复、可 stepped，是关卡二改前后可比的底层能力 |
| Kiln | <https://github.com/instruktlabs/kiln> | 《One More Broadside》作者点名的 3D 资产工具：agent 写 JS 改几何/材质，Kiln 回渲染视图和结构检查并导出 GLB、保留可编辑源；MIT、MCP/CLI/SDK，已用于 Sheepdog Sim/OBJEKT 62/ski sim——补“改场景几何后用什么验收”的工具链 |
| game-builder-mcp | <https://github.com/wuisabel-gif/game-builder> | v0.4.1，2026-11-04；提供 plan/scaffold/check/playtest/serve，`playtest_game` 用 headless Chromium 按 Agent 指定按键点击并回传截图、错误、状态变化；覆盖 21 类玩法/品类，技术栈另表列出 2D/3D web、Godot、Unity、Unreal、Bevy/raylib 等。试玩只支持网页游戏，首次运行下载约 150 MB Chromium |
| Godot Editor MCP | <https://github.com/hybridindie/godot-mcp> | stable 2026.10.20.1 / beta 2026.11.04b2；驱动实时 Godot 编辑器，能改场景/脚本、模拟输入、录回放、截图、profile；默认只开 inspection，其余 28 个工具集按需开启；适合把“改关卡→跑一遍→看状态”接进 Agent |
| Ludus | <https://registry.npmjs.org/@cosmic-pulse/ludus>（npm 包页 www.npmjs.com 403，改用 registry 元数据） | npm v0.20.0，2026-09-19 发布，MIT，pre-release；以 LUDUS.md 写清 golden path/规则/不变量，经官方 Unity CLI 读真实场景状态、在运行编辑器里执行 C#、驱动 play mode 并确定性判定，可做逐关难度与进度核对，不靠像素；接口 1.0 前可能变 |
| AgenticPCG | <https://github.com/JiangZehua/AgenticPCG> | 开源研究代码：让 LLM 通过结构化工具调用反复评估并编辑关卡，支持 Binary Maze/Zelda/Sokoban/LodeRunner/Super Mario Bros.，可从空关卡起步、按目标指标优化；适合借它的“评估-编辑”循环做二改 |
| Lucasartsifier | <https://github.com/katiahayati/lucasartsifier> | 反编译 SCI 脚本→抽象解释成带守卫的房间转移/道具/剧情旗标图，找出“还能操作但已无法通关”的 softlock，再推导、验证、编译并安装守卫；在 LSL2/KQ4/KQ6/Laura Bow 2 四款实测。它把“二改后仍可通关”变成可自动检查的图问题，MIT，HN 2026-08-19 161 分 |
| Roblox Studio Planning Mode + Playtesting Agent（beta） | <https://www.gamesindustry.biz/roblox-releases-agentic-ai-tools-for-creators-promising-ability-to-build-a-game-with-a-single-prompt> | 2026-04 上线；Planning Mode 先出可编辑多步计划，Playtesting Agent 读日志、截图、模拟键鼠输入，对照设计计划找问题并回流到计划循环。大平台内置的“计划-构建-自测”闭环，但只在 Roblox 生态 |
| Razer QA Companion-AI | <https://www.razer.com/blog/ai-that-plays-to-test-razer-qa-companion-ai-at-gdc-2026> | GDC 2026 扩展：零接入、基于画面检测渲染/物理/动画/碰撞问题，AI gameplay agent 可自主执行测试序列并比对预期、返回 pass/fail。商业闭源、价格未披露；适合与大厂 QA 流程对照 |
| Unreal Engine 5.8 实验性 MCP | <https://www.unrealengine.com/news/state-of-unreal-2026-top-news-from-the-show> | **官方页 403 Cloudflare（curl/WebFetch 均未直读），以下仅来自搜索摘要、未核原文**：2026-06-17 State of Unreal 提到 UE5.8 起带实验性 MCP server 插件，Claude/Gemini 等可访问蓝图、资产、关卡、材质、mesh；UE6 计划 2027 下半年 Early Access。只能当线索，等可访问原文再核；若本仓已覆盖 Epic 的 Unreal 插件，可只留作版本/路线确认 |
| Google Playground | <https://blog.google/innovation-and-ai/technology/ai/playground-experimental-gaming-platform/> | 2026-10-07 上线，美国 18+；用自然语言改物理/规则/角色/环境，可发布到 Explore，创建额度按 Google AI 订阅分层。它把 prompt-to-game 做成可分发产品，是判断 AI 做游戏能力边界与分发变化的现成入口；未公布价格/token 细节，本端未试用 |
| Unity Spark（闭源 AI 游戏编辑器，closed beta） | <https://unity.com/spark> | Unity 官方页称“带真实编辑器的 AI 游戏制作器”，可 prompt/refine/publish，使用 Unity 资产，示例 Space Corridor，需 waitlist。四个 demo 只有构建入口（config.json 为空对象、game.json 是 10 MB 场景数据），没有关卡二改日志、版本或前后对照 |
| Playgama MCP + Sandbox + Bridge SDK 2.2 | <https://playgama.com/blog/main/built-a-game-with-ai-get-your-first-players-and-ad-revenue-with-playgama-mcp/> | 官方博客 2026-09-11（10 月更新）：Agent 经 OAuth 把游戏发布到 Sandbox、拉取 playtime/performance/retention 与自定义事件（如第 5 关卡点）、再推新 build，形成“发布→玩家数据→改版→再发布”闭环。450M 是网络潜在覆盖，未公布留存改善证据与价格 |
| 其他新工具/平台（Noobi.ai、game-exa、NodeTool、Game Dev Agentic Skills、GameFactory-3A、SoonPlay、Meta Horizon、GameMaker GM-CLI、OpenAI Voxel Velocity 线索） | <https://github.com/Innate-Labs/Noobi.ai>、<https://github.com/Ar9av/game-exa>、<https://github.com/nodetool-ai/nodetool>、<https://github.com/thedivergentai/Game-Dev-Agentic-Skills>、<https://github.com/OpenDCAI/GameFactory-3A>、<https://soonjy.com/>、<https://www.gamesindustry.biz/meta-unveils-ai-powered-game-tools-for-mobile-devices-and-browsers-announces-vr-glasses-with-day-one-unity-support>、<https://www.gamedeveloper.com/production/gamemaker-incorporates-claude-code-to-enable-ai-assisted-workflows>、<https://openai.com/index/introducing-the-codex-app/> | Noobi 是 Planner/Implementer/Reviewer＋宿主构建自动试玩；game-exa 以 Phaser 3＋Playwright/pixelmatch/VLM＋BFS 可达性＋输入 fuzzer 做 QA；NodeTool 把 2D/3D 引擎做成 Agent 可操作节点工作区；Game Dev Agentic Skills 是 Godot/Bevy 技能库；GameFactory-3A 用 `agent_skills/setting_overview.md` 路由到 UE5/Unity/Godot/Blender/three.js；SoonPlay 是“视频→可玩内容”的中文平台；Meta Horizon 是 waitlist；GameMaker GM-CLI 内置 Claude Code 查项目/构建；OpenAI Codex app 的 Voxel Velocity 因 403 只有搜索摘要，只作线索。均未核关卡二改记录 |
| Dustlight（GamesByAI 官方团队；管线证据） | <https://gamesbyai.win/games/dustlight/> | 3D 高斯泼溅探索游戏，2026-10-03 发布；MIT 代码、美术/音频版权保留。Codex 画七件模型双视图参考，Claude Code 写 Blender Python、导出器、约 1,700 行游戏与音效；仓库有确定性 capture bot、按游戏时间精确回放、`?seed=`/`?shot=`，NOTES.md 明确“碰撞完全不碰 splat，行走/相机/摆放都对不可见 collider 网格做射线”，把“看得见”和“能站”分开验证（<https://raw.githubusercontent.com/gamesbyai/dustlight/main/NOTES.md>）；过程页 <https://gamesbyai.win/blog/gaussian-splatting-game-with-blender/>、截图 <https://media.gamesbyai.win/games/dustlight/shot-1-1280.webp>。已读页面未见第二次路线/遭遇修改记录，只作 3D 关卡验证与资产管线线索，不计作品候选 |
| AI-Assisted Methods for Evaluating and Optimizing Game Level Design（J-STAGE 论文） | <https://www.jstage.jst.go.jp/article/iar/3/0/3_49/_article/-char/en> | Fu Boning、Sato Reika，2025；同一 Souls-like 非线性关卡的 A 版（纯人工）与 B 版（按 AI 诊断改教学、卡点、时长、路径提示）由 5 名中级玩家对比：平均通关 18→13 分钟、死亡 6→3、路线偏离 8→2、满意度 6.2→8.4。没有公开可玩 build，只作“二改后节奏指标”的方法证据，不计作品候选 |
| RSD Game-Maker Sandbox Edition（Lewis Moten，MIT，可玩） | <https://lewismoten.github.io/GameMaker-SandboxEdition/>；作者原文 <https://lewismoten.com/2026/11/04/how-rsd-game-maker-grew-beyond-the-screen/> | AI agent 改关卡、人试玩报问题：书架上不去→加低木板变成两段短跳（20:06 报、20:12 提交），出口贴在普通墙纸上→加门和灯牌；随后把“出口是否在纯色背景上”做成 level checker，能指出纯色背景上的出口并建议门、灯牌或箭头，设计师仍可决定保留隐藏出口。只是单点修复，不是整关/整段二改；截图原 URL、版本、资产许可/成本未给（代码 MIT），只作方法/管线线索 |

### 7.2 第三轮新增工具/方法（约 68 组，不是候选作品）

| 线索 | 链接 | 用途与边界 |
|---|---|---|
| Roblox Studio Assistant & MCP Playtest Agent beta 官方帖 | <https://devforum.roblox.com/t/studio-beta-studio-assistant-mcp-playtest-agent/4566767> | 官方 beta 帖 50 楼里全是创作者实机反馈：AI 试玩角色“说无法导航然后传送自己”、不会低头按眼前的绿色按钮、拖拽/长按不可靠、会丢 MCP 工具权限、幻觉 Luau、手机模拟仍用键鼠；官方 2026-04-13 自己承认 “subagent can report a test as ‘Pass’ when a human playtester would spot an issue”，建议不要只靠它验收玩法。对“二改后还能不能玩”的自动验收是最直接的反证。 |
| Godot NavigationRegion3D 更新丢失 | <https://github.com/godotengine/godot/issues/124766> | v4.7.2 可复现：两次导航网格更新只隔 1 个物理帧时，第二次永远到不了导航地图（10/10 丢失），而 0/2/3 帧间隔正常；关闭 region async iterations 可绕过。改完导航没生效会被误判成关卡几何错，2026-10-22 报，仍 open，关联 PR #124925。 |
| Unity 多 Agent 同改场景被编辑器保存覆盖 | <https://discussions.unity.com/t/feature-request-native-editor-concurrency-lock-mutual-exclusion-for-multi-agent-workflows/1737300> | 2026-09-22 的 AI/ML 版块请求：Unity 只有 `Temp/UnityLockfile` 的进程级锁，agent 改磁盘上的场景/资产后，编辑器一次 Ctrl+S 会 “silently clobbers the agent’s work”；提议 CLI lock/unlock 与 “Locked by [Claude Code / External Agent]” 提示。可操作替代是每个 agent 独立 clone、headless 编辑器跑完再走 PR。 |
| Unity 运行时 NavMesh 与 ECS 的实际限制 | <https://discussions.unity.com/t/how-to-update-navmesh-at-runtime-in-ecs-dots/1591301>；<https://discussions.unity.com/t/released-runtime-navmesh-baker/1681383> | 程序化关卡开发者报告 “ECS currently doesn’t seem to support Navmesh modification at runtime”，NavMeshSurface 只作用于 GameObject；可行路线是预烘焙模块拼接或从 ECS 抽 mesh/transform 外部烘焙，帖内无人确认成功。配套 Runtime NavMesh Baker 1.2.5 帖里开发者自承 Unity 自带运行时方案“没有 UI/前端、文档也不好”。 |
| Godot 论坛：`bake_navigation_polygon()` 会改到所有 region | <https://forum.godotengine.org/t/bake-navigation-polygon-affects-polygons-on-all-navigation-regions-instead-of-just-one/85578> | 2024-10-04 的实机问题：调用某个 NavigationRegion 的 `bake_navigation_polygon()` 时，其他 region 的 polygon 也被影响，按区块改关卡时无法只重烘一块。与 #124766 一起构成“改一块关卡却动了整张导航图”的排查清单。 |
| AWS 中国博客：用 AI 玩家预测难度，避免关卡召回重做 | <https://aws.amazon.com/cn/blogs/china/reinforcement-learning-game-level-design/> | Magic Tavern（《Project Makeover》等）的正式实践：内部机测与策划交叉测试受样本量限制，新关上线后难度偏差过大时“就需要召回关卡重做，或更正难度后重新排布关卡分布”；用强化学习 Agent 反复游玩新关，收集是否通关、剩余步数等特征，拟合难度模型；文中未给每关运行次数，只写每批十几到几十关、需并行训练。厂商案例，非独立评测；补的是“二改前的成本门”。 |
| Fab 关卡生成器评分（插件市场信号） | <https://www.fab.com/listings/d1b0e838-c018-4011-ae1a-e546383d0e00>；<https://www.fab.com/listings/cbc8ab41-dd2a-4387-b8d1-b1640b98d1a3> | Easy Level Generator 仅 3.86/7（4 个五星、2 个三星、1 个一星），Layouter Blueprint Level Generator 3.91/11，明显低于 AI 助手类 Ultimate Engine CoPilot 4.4/257、NWIRO AI Pro 4.61/116；说明市场对“自动生成关卡”的评价低于“辅助写蓝图/世界构建”。Reviews 面板 SSR 为空、公开 review API 404，具体差评正文未读。 |
| Review the Player's Level, Not the Designer's Speedrun（Jameson Durall） | <https://www.gamedeveloper.com/design/level-design-reviews> | 2010 年 Game Developer 随笔：设计者熟练跑一遍会掩盖首次遭遇的不确定性，从而把难度改错；正好约束本卡“同车同输入 3 圈基线”不能拿设计者速度当玩家体验。不是 AI 案例，只作评审方法。 |
| GDEX 2026: AI-based Level Design: The Myth and the Reality（Roger Crawfis） | <https://www.thegdex.com/speakers-2026-1/roger-crawfis> | 2026 演讲摘要承诺展示“当前 prompt 实际产出什么、好坏在哪、以及用既有美术与高质量代码搭的更好关卡管线”，并提到让 AI 做杂活/给变体以提升设计能力。只有摘要页，无 slides/逐字稿/录播；crawfis.com 403。 |
| Teaching AI the Fundamentals of 3D Level Design（Corgi Network 一手实验） | <https://corginetwork.com/ai-game-development-level-design/> | 作者用 Meshy/Unity 做 3D 关卡实验，明确记录 “Iteration Two: A Smaller Controlled Environment”——第一版城市不可玩后缩成受控小环境、补资产知识库与空间关系计算，并总结 AI 能读场景但不理解场景。无项目名、可玩入口、版本与截图原链。 |
| AI-Assisted Level Design in UE5: What Actually Works in 2026（MythicLemon） | <https://mythiclemon.com/articles/ai-assisted-level-design-ue5-2026/> | 从业者文章把“AI 只适合快速 blockout/道具/光照探索、精确跳跃距离与遭遇节奏必须人改”写成明确边界，并引用社区里“生成了 50 关没一关好玩”的现象；厂商博客、无具体作品/二改案例。 |
| Game Dev（gamedev.intelligentartifact.com 案例索引） | <https://gamedev.intelligentartifact.com/tags/production/> | 按 production/game-design/playtesting/postmortems/level-design 标签逐条摘要 AI 游戏开发日志，并直接外链 Reddit/itch/作者站原文；本轮 Fluchtpunkt、Wasteland Renegades、Freight Fright、Nightshoal、Plunder、Silent Entry 都是先从这里定位再回原帖。它本身不是作品，只作持续找“作者原文＋二改”的索引面。 |
| G3D.AI《AI Level Design Workflow》 | <https://g3d.ai/research/ai-level-design-workflow> | 2026-09-03：把二改前的约束写成 level contract（能力、主/支路线、目标时长、遭遇节奏、可达性、性能、导航、流式预算），先生成图/灰盒再上美术，自动 validator 查连通、可达、坡度、净空、出生距离、视线与预算，改完记录 seed、生成器版本与编辑证据；主张“候选因证据晋级，不因是 AI 生成而晋级”。 |
| G3D.AI《Automated Playtesting: Agents That Test New Levels》 | <https://g3d.ai/research/automated-playtesting-generated-levels> | 把回归做成三层：确定性结构校验、多种 test agent、真人会话；保存 seed/生成器版本/失败现场，失败种子不删、转成可复现 fixture，并冻结 20 个未见关卡做对照。WebFetch 被域名安全策略拦，只有搜索摘要与 200 状态，未读全文。 |
| GameXpert-Bench（含 GameFix 回归修复赛道） | <https://arxiv.org/abs/2608.21833> | 2026-08-22，腾讯混元等：50 个内部可玩关卡、每关一次注入 19–27 个可逆 bug，要求 Fail-to-Pass 修好且 Pass-to-Pass 不回归才计分；最佳 Claude Opus 5 的 Strict 仅 39.0、中位数约 14。把“二改不能改坏已通过的东西”做成可复跑的关卡级基准。 |
| CEGame-Bench（长程做完整游戏） | <https://arxiv.org/abs/2610.26098> | 2026-10-19：从空项目在 Defold/Godot/Roblox/Unity/Unreal 做 50 个游戏，平均 295 步、65M token，隐藏评测按真实输入玩到结局；只有 16% 的运行能到结局。配套 Game Completion Boost 把三个模型执行分提高 14.1–24.3 点，是“能编译≠能玩完”的量化。 |
| GameDirector（把玩法规则与渲染解耦） | <https://arxiv.org/abs/2609.25652> | 腾讯、NTU、NUS、A*STAR：显式控制器管血量/冷却/胜负，视频世界模型只负责画面，报告机制一致性 99.6%（端到端基线约 21–34%）、状态对齐 100%；约 10-11 公开代码/权重/数据但当时无可见许可。对“AI 改关卡时规则由谁守住”是可引用对照。 |
| Ctrl + Create（FDG 2026） | <https://dl.acm.org/doi/full/10.1145/3815598.3815646> | 2026-08 的 20 人混合方法研究：Unity 插件内嵌 Stable Diffusion、按物件选择生成，比裸 txt2img 控制感更强，和纸绘在表达与控制上相近；但生成经常把相邻物体并成一个（6/20）、物件缺失（6/20），并缺 undo（10/20）、相机操作（9/20）。ACM 正文 403，只读 Crossref/Semantic Scholar 摘要。 |
| With the Stroke of a Brush（生成式 AI 智能笔刷） | <https://doi.org/10.1145/3815598.3815603> | Ctrl+Create 同场 FDG 2026 论文，Crossref 题名/作者可核（ACM 正文 403）：题名指向用生成式 AI 智能笔刷做即时地图编辑；机制、demo 与效果未读。 |
| Play2Code / PlaytestArena | <https://arxiv.org/abs/2605.28258> | GameXpert-Bench 引用的持续游戏生成工作：200 个浏览器游戏任务、独立 GUI judge 实际试玩，Play2Code 让游戏 agent 与 rubric-blind playtester 经 5 轮 shared memory 反复改；是“二改后仍可玩”的评测/流程线索，非单一作品。 |
| SWE-Game | <https://arxiv.org/abs/2609.33678> | 247 个 Godot 任务含 83 个注入故障修复，专门评估修复后的行为恢复与保持，和二改不破坏原可玩性最贴近。 |
| GameGen-Verifier | <https://arxiv.org/abs/2605.07442> | 把游戏规格拆成 keypoint，在运行时注入目标状态再做有限交互核验，VeriGame 覆盖 100 款游戏，可用于检查二改后的状态/阶段转换。 |
| GameCraft-Bench | <https://arxiv.org/abs/2606.17861> | 在真实引擎里按重放演示与多模态 rubric 评“可玩成品”，明确超出 compile-pass，为二改后的可玩性提供评测口径。 |
| GameASG-Bench | <https://github.com/areal-project/GameASG-Bench> | 47 个浏览器游戏任务要求实现 `window.__gameTest` 接口并用 headless Chromium 做动作/状态不变量 L2 测试，测试接口可直接复用到二改回归。 |
| GBQA | <https://arxiv.org/abs/2604.02648> | 30 款游戏、124 个人工核验 bug 的 LLM QA benchmark，含多轮 ReAct 探索，用于评估 agent 能否自己发现二改引入的运行时缺陷。 |
| Playbench | <https://github.com/MihirSahu14/playbench> | 2026-10-13 建、MIT、v0.3.3：在真实 build 上跑 bot 试玩抓崩溃/卡死/softlock/失灵控制，每个功能后跑一分钟；Haunt 案例做了 3 轮 playtest→fix，约 20 个 bug，低耐心玩家 35 秒退出→继续玩，最快通关 43 秒（利用漏洞）→71 秒（漏洞被削），自称试玩快 6 倍且回放确定。作者也写明 “bots find what's broken, can't tell you whether it's fun”。 |
| pyxel-mcp（headless 逐帧试玩 MCP） | <https://github.com/kitao/pyxel-mcp> | MIT、32 stars、2026-10-23 仍在更新：把输入按帧写成可复现 JSON，可设 `until="score >= 1"` 这类停止条件，返回截图、像素网格、游戏状态、资源、音频与帧差。把“同输入复跑”做成小引擎上的标准接口。 |
| JevLaya GameTest | <https://github.com/TinyPandaGame/JevLaya-GameTest> | MIT、v0.0.2 实验版、2026-09-22 建：流程是观察→决策→游戏内输入→独立核验→报告，缺证据保持 INCONCLUSIVE，模型概率不能决定 PASS，后续成功也保留原 FAIL；已支持 Unity Editor uGUI 和本地浏览器，UE/移动端未实现。补的是“agent 自报通过不可信”的证据链。 |
| Gozen（YAML 游戏＋check/sim） | <https://nao1215.github.io/gozen/ai-agents/> | MIT、2026-10-18 建：游戏是纯文本 YAML，agent 写完后必须 `gozen check game` 通过（引用、表达式、图片、文本布局），还能 `gozen sim battle/dive/campaign` 直接报胜率、每层等级与胜负、战役是否过易。把“改完必须过检查＋可模拟验证”写进 stop condition。 |
| GenMap Lite（Godot 本地 LLM 地牢生成插件） | <https://github.com/Jm7997/genmap-lite> | MIT、2026-10-07 建、v1.3.0：本地 Ollama qwen3:8b 只负责布局，插件负责裁掉越界房间、连通孤立房间、补外墙碰撞、支持 Ctrl+Z，生成的房间是带信号的 Area2D；上限 48×48。是“LLM 出草案、确定性代码修错”的最小可读样本。 |
| GenMap Pro | <https://jaime-7997.itch.io/genmap-pro> | Lite README 指向的扩展版，增加 Boss/宝箱房、出生点、敌人、运行时种子、地形自动拼接、JSON 导入导出与 roguelike demo，地图上限 128×128，是关卡复用与重生成成本的直接工具线索；不是作品；采集时与本轮 2026-11-06 复检本机 itch 均为 DNS 解析到内网拦截地址、TLS 000（HEAD/GET 同），正文/版本/评论区仍未读。 |
| XEngine（MIT、MCP 内置的 C# 引擎） | <https://github.com/FlameskyDexive/XEngine> | 2026-08-19 建、10-25 更新、28 stars：场景/预制体/着色器图/时间线都是文本，MCP 内置 120+ 离线工具与 20+ 编辑器内工具，带四级 RiskLevel、`dryRun` 预演、哈希前置检查和操作溯源日志；agent 改完可运行、截图、核验。单仓库仅 1 个提交，规模与测试自报未独立验证。 |
| Ignis（人与 agent 共用命令 API 的 Rust 3D 引擎） | <https://github.com/zerobytes/ignis> | 2026-11-03 建、11-05 仍在更新：MCP 与原生编辑器共用同一套命令 API、校验与状态，人改场景时 agent 可用带类型命令检查；核心可离线 headless 跑 inspect/simulation，capture 返回真实引擎 PNG 与元数据，支持 undo、replay、checkpoint。源码可见但非 OSI 开源，游戏终身收入过 100 万美元后收 1% 合格利润。 |
| Apeiron（agent 为一等用户的游戏引擎/编辑器） | <https://engine.apeironengine.com> | 2026-10-23 前后出现：Claude 作为引擎内 agent 用与人类相同的命令建场景/材质/网格/光照，动作进 undo 历史与可编辑图；引擎本身也是 MCP server，Claude Code 可驱动编辑器；早期版免费、Chrome/Edge＋WebGPU。官网目前只有下载壳，能力细节来自作者帖镜像，原始 Reddit 帖未定位。 |
| Kimi 游戏开发与创意工作解决方案 | <https://www.ithome.com/1/021/539.htm> | 2026-11-02 发布：K3.1/K3.1 Pro 负责读策划/截图/代码/3D 资产，Kimi Code 改引擎脚本/蓝图/Shader，Kimi Work 做跨文件多步任务并留操作日志；插件接 Unity、UE、Blender、Godot 等九款工具，演示称无人干预 20 小时重制一款 Unity 游戏。官方独立方案落地页未找到，本项是媒体一手报道，能力与“20 小时”均为厂商口径；`ithome.com/1/021/539.htm` WebFetch 403，改用 kimi 官方能力页与 dtinsight 摘要。 |
| Kimi AI Game Maker / Kimi Build | <https://www.kimi.com/capabilities/ai-game-maker> | Kimi 团队官方能力页明确支持用后续提示改关卡设计、难度、移动方式并保留版本历史，正对“第二次改关”的场景；但只给出 GBA 模拟器一个具名 demo，没有关卡二改实例，属工具线索。 |
| Spawn / Savi（agent 直接改线上多人游戏世界） | <https://simonwillison.net/2026/oct/29/how-i-built-the-most-ai-pilled-company-in-the-world/> | 2026-10-29 Simon Willison 记录：玩家用 prompt 让 Savi 改环境（造城堡、召龙、骑龙），Fable 5/5.1 agent 群直接改线上代码并每小时发布，约 60% 工作从生产错误/用户 bug 报告/日志异常开始，坏改动 30 秒内定点回滚，月 token 超 300 万美元（约 30 倍工资）。全部为公司自报，原始 X 长帖登录墙未读。 |
| Josh Hamilton《One thread, fifteen games》 | <https://www.nearbycoder.com/articles/orchestrating-15-games-with-t3-code> | 2026-10-07：一个 T3 Code 编排线程管 15 个游戏、12 轮改进，启动 210 个会话、推送 1,475 个已验证 commit；具体修到“两个宝箱被岩石和悬崖挡住不可达”、Purgatory 144Hz 下 58% 行走帧无移动、Lost & Found 快速连点只有 1/11 被记录。原则是 “Check the evidence, not the report”，会话不得 push，只有编排器能碰 GitHub。 |
| CrushPress《AI for Game Development: How to Choose the Right Tool》 | <https://crushpress.ai/2026/11/05/ai-for-game-development-how-to-choose-the-right-tool/> | 2026-11-05：自称 9–10 月 480 次请求/4,800 份输出/8 项等权任务的横评，Claude Opus 5.5＋Claude Code 总分 90.7、ChatGPT 89.9、Gemini 88.8；Gemini 资产只有 81.3% 免修可用，Rosebud 原型 53/60。给“按环节选工具、先写验收再跑同一真实任务”一个可核的选型参考，但等权总分被作者自己标为假设流程。 |
| Atelico AI Engine（嵌进 Unity/Unreal/Godot 进程的本地 AI 运行时） | <https://atelico.studio/blog/the-atelico-ai-engine-is-here> | 2026-10-29：定位不是新引擎，而是嵌入现有引擎进程的本地 AI 运行时，覆盖语言、图像、语音、记忆与 NPC 行为；121 FPS 是自测，SDK 尚未公开下载。代表“AI 不改工程结构、只加运行时能力”的路线。 |
| VibeGame（Apache-2.0 的自演化多 agent 2D 游戏框架） | <https://github.com/tettethu/VibeGame> | 2026-08-12 建、10-13 更新、367 stars：自然语言到可玩 2D 网页游戏并支持后续任意编辑，基于 Claude Code/Codex，路线图含 Godot/Unity/3D。热度近三个月明显上升，但本端未读其关卡二改记录。 |
| genshin-miliastra-mcp（原神千星奇域 UGC 编辑器 MCP） | <https://github.com/8itlab/genshin-miliastra-mcp> | MIT、2026-10-13 建、11-02 更新、21 stars：让 Claude/Cursor 等替用户搜索物件、摆放场景、设置关卡、写 TypeScript 节点图与客户端 Lua，并自动试玩取回日志与截图。少见的“商业 UGC 关卡编辑器＋agent 自动试玩”闭环；非官方，平台条款与封禁风险未核。 |
| MiliastraAgent（千星 2D 关卡 agent） | <https://github.com/ThRabbit-Studio/MiliastraAgent> | genshin-miliastra-mcp README 相关项目里的另一套千星关卡工具，七阶段流程含 Bug 修复与版本迭代、离线 Lua 沙箱和校验，GPL-3.0；没有公开 demo 或试玩后改关实例。 |
| Epic AI MegaJam 2026 | <https://www.invenglobal.com/articles/27578/epic-games-announces-2026-epic-ai-megajam-with-up-to-50000-in-grants> | 下一批“AI 做关卡＋公开过程”的来源窗口：11-12～11-15 四天、UE/UEFN、最多 5 人＋不限 agent，设 2,500 美元“最佳展示如何使用 AI 工具的开发日志”奖，总奖池 6.5 万美元；官方页 403 Cloudflare，本条为媒体一手报道，AI 是否强制前后说法有变。 |
| Recursive Game Creator | <https://github.com/IMBALDY/RecursiveGameCreator>；<https://imbaldy.github.io/recursive-game-creator/play.html> | MIT 的 Designer–Builder–Player–Reviewer 递归改进框架，Player 用代码化策略跑轨迹、Reviewer 凭轨迹与视觉证据出修改意见，报告 GameCraft-Bench 77.89；项目页提供 Whitebird/Racing Rocket Trials/See You Tomorrow/Bluebay Night Kitchen 四款可玩示例与 Meme Arena/KAZE/视觉小说的 V1–V3 对比，是“二次修改”循环的直接方法候选。 |
| Summer Engine | <https://github.com/SummerEngine/summer> | MIT 的 agent-first 商业引擎（MCP/CLI），自带构建、试玩、发布、玩家分析与 AI feedback 回路，可观察 agent 改关卡后的真实玩家数据。 |
| Prowl | <https://github.com/ProwlEngine/Prowl> | MIT 的 C# Unity-like 引擎，编辑器内置 Playtest，并提供 Prowl CLI/agent skills 从脚本或 AI agent 驱动运行中的编辑器，适合关卡二改的自动化回归。 |
| GameCraft Skills | <https://github.com/wusar/gamecraft-skills> | MIT 中文 agent 技能包，流程覆盖 3D 原型、角色测试场、实际试玩验收与多视角检查；作者明确尚未用它完成并发布游戏，只能作方法候选。 |
| Ritmo | <https://github.com/typeonce-dev/ritmo> | 面向 agent-first 的 TypeScript 类型安全 ECS，错误信息直接给出修法，headless 运行报告 lints/invariants 与数值变化原因，适合定位二改后的规则回归。 |
| Open Godot MCP | <https://github.com/masteryee-labs/Open-Godot-MCP> | MIT 的 Godot MCP server，主打确定性 playtesting、真实游戏操作、DAP/LSP 与联机测试，可让 agent 在改关卡后重复跑同一路径。 |
| Godot studio playtest | <https://github.com/Joelnicolass/godot-studio-playtest> | 面向 Claude Code/Cursor 的 Godot 4 试玩插件，强调抓真实游戏画面、像玩家一样点击且不污染 `src/`，适合记录二改前后同一段路线。 |
| Pravus AGS MCP | <https://github.com/pravusjif/pravus-ags-mcp> | AGS 3.6 编辑器内 MCP 插件，agent 可改 rooms/GUIs 并以真实鼠标键盘驱动运行中的游戏，是冒险游戏关卡二改的可复查入口。 |
| OpenGenie / GenieEngine | <https://github.com/legojazz/OpenGenie> | HN 的 AI 游戏引擎讨论中出现的 GRIT 类替代：内置 MCP harness 可离屏运行游戏、脚本输入、截图和查询状态，带 Survival Fortress 可玩 demo；demo 的 itch 入口本端被挡。 |
| playproof（EmirhanOzl，浏览器游戏 QA MCP） | <https://github.com/EmirhanOzl/playproof> | 与 AWS PlayProof 同名的另一项目：给 agent 逐帧画面、脚本输入、motion snapshot 回归、monkey 崩溃搜索和多尺寸手机布局检查，已测 Canvas/Phaser/Pixi/three/Godot/Unity；是验证关卡二改后回归的工具线索。 |
| mapedit（Agent-first 3D 地图编辑器） | <https://github.com/Karylcode/mapedit> | 2026-10-04 新建、10-23 仍在提交：关卡用 YAML 描述，浏览器只做精确摆放并把人工修正写回且保留注释；`check` 报重叠、缺支撑、离网格和朝向错误，有违规的地图不能导出，等于把“二改后几何仍成立”做成编译门。MIT，148 commits，但 0 star、无发布包，尚无独立使用报告。 |
| GRIT Engine（agent-first 引擎，beta） | <https://www.playgritengine.com/features> | 2026-11-03 被日报列为新发现：agent 用带类型命令操作同一套编辑系统，headless 自动试玩回报死亡、碰撞、卡点、不可达区域与瓶颈，并给热力图和轨迹回放；大改动前自动留项目快照。免费 beta、闭源、无版本号，页面上多处截图仍写 coming soon。 |
| PlayProof / AWS Builder Center「Lighthouse That Wouldn't Turn」 | <https://builder.aws.com/content/3K9SDVqPllv4HmlKgVVupkP2x8N/the-lighthouse-that-wouldnt-turn-building-an-ai-game-studio-that-plays-its-own-games> | 2026-10-02 的一手制作记录：多 agent 产出后由代码写的 test player 在浏览器里跑两遍（按键/不按键）比对，硬门包括输入是否影响进度、第一关是否可达、关卡是否一开局就赢、15 秒是否卡死、第 10 关是否崩。Nectar Dash 第一版“只到目标 18%/21.5 秒”，返工后第一关 20 秒通过，整局约 14 分钟；原则是 “agents create, code decides”。 |
| Fluchtpunkt（伪 3D 竞速） | <https://beltoforion.de/en/fluchtpunkt/>；可玩 <https://computerspielereien.de/fluchtpunkt/start-game.html> | 英语作者一手制作记＋浏览器可玩（2026-11-06 核 200）：Claude Code 多 agent 团队写全部代码、生成 sprite/音乐，人只做产品方向与验收，六条赛道来自对 Lotus Turbo Challenge 2 的反向工程；文章给出逐项成本（约 €674.40）、购买车模的边界和多张赛道/车辆截图原链。没有“第二次修改某条赛道”的记录（改的是渲染器与机制），版本号只在截图文件名 `racer_v1.2.2` 中出现，许可未声明。 |
| Sector Dive（beatdjam） | <https://beatdjam.github.io/mini-games/games/sector-dive/>；过程 <https://blog.beatdjam.com/entry/2026/10/03/113000> | 可玩的 Claude Code 3D 浏览器 roguelite FPS；作者记录原型 15 分钟出、按试玩反馈反复调敌人硬度/升级平衡，并做了 `#smoke` 自动跑完全部关卡与 Boss、固定地图/种子注入、Vitest/Prettier/CI、测试不过不发布。对“二改后仍可玩”的验证链有直接借鉴价值；没有一次具体的关卡路线/遭遇重做记录。 |
| OpenCodeGameStudios（striderZA） | <https://github.com/striderZA/OpenCodeGameStudios> | MIT，Claude Code Game Studios 的独立演进，52 个 agent 覆盖 Godot 4/Unity/UE5/SFML/Raylib/Bevy，含 `level-design`（layout、encounter design）与 `design`（playtesting）模块；只有 Pong 示例，没有关卡二改证据；skillsmp 创作者页 403。 |
| GodotMaker（RandallLiuXin） | <https://github.com/RandallLiuXin/GodotMaker> | 文本到可玩 Godot 2D 游戏的自主管线，三个示例（弹幕、幸存者、卡牌 roguelike），agent 会像玩家一样操作游戏、截图、与 GDD 比对并把问题送回修复循环；生成关卡被明说为 “draft placeholders”，需要人工调整或 follow-up repair pass。BSL 1.1（四年后转 Apache 2.0），无逐次关卡二改日志。 |
| Grey2Art（hbzheng0942） | <https://github.com/hbzheng0942/grey2art> | MIT 的 Codex/Claude Code/WorkBuddy Agent Skill：把可玩灰盒转成多种美术风格原型，输出仍在 Godot/Unity 可编辑，Blender 只做空间 blockout；示例 Hole、Train Parkour、Wander Garden 可玩，工作流含 “Revise and continue” 和“改局部后检查受影响玩法”。没有公开的第二次关卡修改前后记录；完整 Release 资源包未下载。 |
| GameGold | <https://github.com/MihirSahu14/GameGold> | playbench 同作者的另一条线：AI 生成 Unity 关卡/波次数据、无上下文 agent 从截图试玩真实 build，6 款游戏（含 Core Breach/Dockside/Ember Hop）当日上线；genre 报告给出 `levels.json`/`arena.json` 结构与跳跃距离/解谜可解性校验方案，可补“关卡数据化→agent 试玩→修复”链，但未见单关第二次修改。 |
| TownStudy（RandallLiuXin） | <https://github.com/RandallLiuXin/TownStudy> | 同作者的 Unity 模块化建造技术 demo，README 给出同机位“加一块砖 38→39、屋顶连成拱、支撑改形”的前后对照；是空间布局/连接验证样本，不是可玩游戏，也没有 AI 关卡二改说明。 |
| OCGS-Pong（striderZA） | <https://github.com/striderZA/OCGS-Pong> | OpenCodeGameStudios 的 README 点名的完整示例游戏，可证明该框架能从概念做到完整游戏；但它是 Pong 克隆、单场景，没有路线或遭遇二改。 |
| Beyond Nations（Preponderous Software） | <https://beyond-nations.play.danielstephenson.dev> | 本批外最完整的“AI 试玩→空间/导航修复→复跑”样本：playtester 让 10 个 AI session 无头试玩真实构建并公开 74 条发现（0 blocker/10 major），另有 PacingBot 在 CI 按 `docs/pacing-budget.json` 校验每段目标耗时，0.6.2 还修过 AI 建国者找不到地时卡住、改为走向最近合法空地；但世界是种子生成的，不是手工 3D 关卡（版本 0.7.0 pre-release，2026-10-31）。 |
| Sisyphus（Preponderous Software） | <https://sisyphus.play.danielstephenson.dev> | 可玩的 3D 第一人称空间游戏，0.3.1/0.4.0 公开了 run 4–6 每轮 3–4 个 AI agent 的试玩报告与逐条修改表，修过“模块在石头下方→提示 roll it”、上坡方向 HUD，以及“石头在身后”提示在石头仍可见时误报（#34）；改动集中在空间可读性/提示，尚未看到路线几何的第二次重排。 |
| CORO SOLTO Studio | <https://github.com/corosolto/studio> | CORO SOLTO 地图 issue 背后的公开制作过程：Lajes 8/9 pilot 明确“现有地图是基线、不做无限打补丁”，用 G0–G6 门、同机位 A/B、路线与玩法契约保留、negative/mutant 用例来约束每次重建，正好补“二改时怎样不破坏原路线”的方法；不是可玩游戏。 |

## 8. 读不到的渠道与原因

以下均为实际尝试后失败，未换身份、未绕过访问控制；摘要只作线索。

- **itch.io 全站**：本机 DNS 把 itch.io 解析到内网拦截地址，TLS handshake 失败（curl exit 35，HTTP 000），WebFetch 报 Socket is closed。未读：AI Jam 4 的 entries/results、A Rock and a Hard Place、Wicklight、DEEP、Schnell、Silent Entry、Wasteland Renegades、Agentic Decay、RUINS // dusk.exe、Red Moon、Yanghwa Bridge、Dungeotto、Maskfall 的 itch 页与评论区；站内 devlog 搜索返回 0 字节。
- **Reddit 直连与 JSON**：`www.reddit.com`、`old.reddit.com`、`api.reddit.com`、redlib 镜像、`r.jina.ai` 均返回 403/429/TLS 失败；Arctic Shift 部分查询 Timeout（如 1xk8dp8），1xnx3w5 已 `[removed]`。OVERSTEER 原帖及评论被网络策略 block，allorigins/pullpush（526）也不可用；评论中提到的替代品与反对意见未读到。
- **X/Twitter**：登录墙或 HTTP 402；`xcancel`、`nitter`、`threadreaderapp`、`r.jina.ai` 均 TLS 失败；只能读单条 status 的 `og:description`，无法枚举作者时间线。作者长帖与时间线未读。
- **YouTube / B 站**：按任务不启动播放器、不播放音频/视频，只读标题、简介、作者、日期等元数据；未看任何完整连续实机。《星光小队》“重做战斗关卡”具体改了什么、《翻面》《破境》《夜神 1 人 100 小时》《明末：欲火重生》的关卡二改均无法核；《明末》只读到 v1.2.22 地图数据结构重构、v1.3.4 京城/奈良地图扩展的文字更新。
- **Steam / SteamDB**：SteamDB patch notes 403/Cloudflare；Steam 社区公告/讨论页 curl 000；评测 JSON 返回空；部分商店页只取到标题/标签/发售日。Backrooms Lost Dimension、Against Wokou Frontline、Stay Dead、亡犬、SweatyPanzer 的补丁正文或试玩构建未读；Iron Curtain Call 的 Steam News Hub 只渲染出导航和页脚。
- **TapTap**：试玩 DEMO 的“打开 APP 试玩”需客户端/登录，未启动；作者主页返回混淆反爬负载；`/webapiv2` 搜索返回 400 `csrf_token_expired`、需 `X-UA`，`tag-detail`/`feed-by-tag`/`moment-list-by-tag` 全部 404；聚光灯活动页 `/app/710826` 只是预约页，`/tag/聚光灯GameJam` 只渲染 9 条预渲染日志与 18 个抽样 app id；用户页 JS 空；《涌现》独立游戏页未找到；清漪只有 app 页、考了又考只有微店购买页、界门试玩入口写“后续补充”；TapTap 站内搜索只返回导航框架。
- **tripo3d.ai / Tripo Playbook**：`tripo3d.ai`、`developers.tripo3d.ai`、`www.tripo3d.ai` 的 Red Scarf、LANTERN ALLEY、Godot MCP 文章均 WebFetch Socket closed、curl 000/0 bytes；只有搜索索引摘要与 pt/zh 镜像片段，未取得正文、截图、作者与公开 build 链接。
- **GitHub API**：未认证 60 次/小时限流（403），code search 需登录，环境无 `gh` CLI；改用网页 HTML、raw、`commits.atom` 与 Pages。部分仓库 500/404；Neural-Sight、Kart Royale、Sunbreak 等的 commit 历史未读；部分作者仓库未能全部枚举。
- **Web archive / 阅读代理 / 搜索引擎**：`web.archive.org`、`archive.org`、`r.jina.ai`、Google、DuckDuckGo HTML/lite 均 000 或证书被劫持到 `*.facebook.com`；Mojeek 403；Bing 中国站把查询改写成无关词典/驱动结果；WebSearch 本会话 200/200 用尽，后半程无法再补 `site:` 查询。
- **中文平台**：微信公众号多篇（《小白做游戏》ACT 系列、《AI 做游戏到底能省多少钱？》、《AI 美术不是终点，工程化落地才是关键》）返回“当前环境异常，完成验证”，今日头条镜像正文为空；小红书两条 item 页返回“你访问的页面不见了”，搜索摘要可见 L11 推倒重做、地图看不清/敌人太快等反馈，但原文/作者页/评论区未读；知乎 `zhuanlan.zhihu.com/p/2066813745876166484` 403；少数派《AI 工作流实践：100% Vibe Coding 完成 Game Jam》只读到检索摘要（关卡由人做），即刻未找到公开入口；掘金两篇文章可读，但作者文章列表页返回空骨架。
- **Substack gamesalchemy**：`gamesalchemy.substack.com`（含 substack.com）TLS handshake 失败、SSL error 35、RSS 失败；Antti Kananen《AI Game Development Got Real》只经 makegamewithai 转述读到，原文未直接核，文中列举的其他 AI 游戏与链接未读。
- **gamedev.net / Unreal / 官方 jam**：`gamedev.net` 的 Against The Mountain Devlog Day 73 返回 403；`unrealengine.com/news/2026-epic-ai-megajam` 403 Cloudflare，换 en-US、浏览器 UA、r.jina.ai 仍 403/000；`itch.io/jam/epic-ai-megajam-2026` 与 `itch.io/jam/ai-jam-4/results` TLS 失败；NAN 2026 站点 Socket closed。
- **其他站点**：`slashie.net` 根与 `/keep` 被 Mod_Security 406，`/keep/devlog` 与 `www.slashware.games/keep` 500，只能读 `blog.slashie.net`；`fable-katamari.pages.dev` 除 OpenStreetMap 版权外无作者/社交/其他作品外链；`tinyskies.vercel.app` 变成 Dreamhost 停放页；`hollowlands.andreelias.dev` 只有标题与菜单图；`duality-game-vibejam.vercel.app` TLS 000；`vibejam.com/2026` 显示 0 games，results/winners/entries 均 404；`aibuiltgames` 主页只渲染 1 条 featured；`Playgama` 只有聚合统计；`vibey.dev` 是域名出售页。

**第二轮新增读不到（与前节重复的渠道只在有新增事实时列出）**：

- **OpenAI Codex app / Voxel Velocity**：`openai.com/index/introducing-the-codex-app/` 的 WebFetch 与 curl（含浏览器 UA）均 403 Cloudflare，en 与 hy-AM 都 403；`r.jina.ai` 读取 TLS 握手失败（exit 35/000），`ebs.publicnow` 转载页也 403；`developers.openai.com/codex` 308 跳到 `learn.chatgpt.com/docs`，没有 demo 画廊；Showcase 只列 Velocity Loop、没有 Voxel Velocity 条目，无法确认两者是否同一演示。Voxel Velocity 的关卡迭代细节只有搜索摘要，未读到官方原文、可玩链接或 skills 的 GitHub 具体路径，只作线索。
- **GitHub API / code search / discussions**：未认证 60 次/时限流，后段 403；code search 需登录也 403；Bash Fighter 的 Discussions 41/42/45、逐条 PR diff 与 issue 讨论未逐条读，只读 README/AGENTS.md/docs/提交正文；Donchitos/Claude-Code-Game-Studios #13「Any real game output?」的回复异步加载，未显示；PrimeGame #1035 有 62 条评论，HTML 时间线只显示首屏；ts-kyle-on-duty 404/私有，Covenant of Embers 的 main 分支 README/CLAUDE.md 404，AI 参与与许可未能核实。
- **代码检索代理**：grep.app 被 Vercel Security Checkpoint 拦截（返回 HTML 检查页），无法按 AGENTS.md/CLAUDE.md 内容做全站代码检索；ungh.cc TLS handshake 失败（curl 35），改用 raw.githubusercontent 逐路径探测；skillsmp.com 的 team-level skill 页 403，只能由搜索结果确认存在。
- **Unity 官方与资产市场**：`unity.com/features/ai`、`/products/unity-ai` 返回通用产品页，未找到官方一手 graybox/level playtest 说明；相关说法只见第三方俄语/越南语报道，按“厂商案例只作线索”未计入候选。Unity Discussions 首次 `search.json` 返回 JSON，后续查询被改成 HTML/非 JSON；Asset Store 301；Fab 搜索页 200 但未提取到具体评测正文，插件市场评价渠道基本未取到。
- **GamesByAI / itch.io**：GamesByAI catalog 的 games/ 目录只列出 100 个 YAML 文件名，未逐文件打开；单款是否有二改、版本、许可未核；api.github.com 读目录与部分仓库元数据 403。itch.io 全站（游戏子域、AI Jam 4、Jamference、VOLT NOMAD、A Rock、Wicklight、DEEP、Catbot、MEOWCHA、Wasteland Renegades、Silent Entry、Knuckle Rush）本机 DNS 解析到内网拦截地址、TLS handshake 失败（000），只有 Jamference 一个提交页 200；不当作“那里没有内容”。
- **Reddit / 镜像**：www/old/api.reddit.com 403/429/TLS 失败；eddrit 返回 Anubis 人机挑战，downdoot 返回 FSKY Forcefield，reddit.fsky.io 301；Arctic Shift posts search 连续 Timeout，分页到约 200 帖后 422，1xmtel6 无评论，1xgtqex/1xmtwht 只读到少量；Voltane、Catbot、Gopher It 的 Reddit 原帖与评论未读全。
- **Steam / SteamDB**：`store.steampowered.com/appreviews` 对已知 app（413150、5417460、5451220）一律 302 回商店首页，拿不到评测 JSON；steamcommunity.com 讨论区 TLS 握手失败；SteamDB patchnotes 403/Cloudflare；ISteamNews 对灵山未至 4944390、翻面 5520840 返回 `newsitems=[]`；Iron Curtain Call 的 Steam News Hub 只渲染导航和页脚。
- **TapTap / B 站**：TapTap 试玩 DEMO 需客户端/登录；作者主页返回混淆反爬负载；`webapiv2` 搜索 400 `csrf_token_expired`，`/webapiv2/app-tag/v1/by-tag` 404，`/group/792849` 只返回空壳；moment 页只 SSR 正文与“x 回复”计数，回复正文未渲染；评论区/作者其他作品无法枚举。B 站视频页 curl 412，`api.bilibili.com/x/web-interface/view` 对 BV1AimaYxEjh、BV1aN411S7ya、BV1qA3r6rELg、BV1vCxj6MEYC、BV1Go4y1M7Ae 返回验证码/错误页；按任务不加载播放器、不播放音频，评论区未读。
- **中文平台**：知乎专栏 `zhuanlan.zhihu.com/p/2059966647797020499`、`p/2069008293343892861`、`p/2081891098419638844`、`p/2098071791726022867` 403；小红书多篇 AI 游戏/关卡日志（69cff43d…、68ebc1bb…、69a1b9c6…）item 页空/访问不到；微信公众号多篇返回“当前环境异常，完成验证后即可继续访问”；NGA `ngabbs.com/read.php?tid=45483804` 403；V2EX、linux.do TLS 证书/握手失败；kongchang.com 429；TapTap 站内搜索只回导航框架。
- **Substack / 其他作者站**：gamesalchemy.substack.com（含 substack.com）TLS handshake/000，Antti Kananen #77 原文未直读，只能读 makegamewithai 转述；hybridlabs.games TLS 35；benwheatley.github.io 被域名安全策略拦截；Tripo developers 的 Red Scarf / Godot MCP boss 教程 WebFetch Socket closed；web.archive.org / archive.org 拒绝抓取（Unable to fetch）；Lobsters search.json 400 Unpermitted query，tag JSON 非 JSON；Medium/X/Newsletter/Discord/YouTube 有登录墙、000 或需播放器。
- **新平台**：Google Playground 302 到 accounts.google.com 登录，正文抽取被 CSS 污染；Unity Spark 的 /blog、/demos、/docs、/community 都是同一个 SPA 壳，四个 demo 只有构建入口；Meta Horizon Create/Studio 只有 waitlist；SoonPlay（soonjy.com）只返回标题/JS 壳，公开 API 只有 3 条展示数据；Playgama 博文没有 sandbox 独立原始链接；Epic/Unreal 官方页 403 Cloudflare（含 state-of-unreal-2026-top-news-from-the-show，UE5.8 MCP 只读到搜索摘要）；npm 包页 403（Ludus 改用 registry.npmjs.org 元数据）。
- **学术与其他**：Semantic Scholar 的 OpenGame、ScriptDoctor、Zero-shot 3D Map citations 429；FREYR references 空（637 字节）；GameCode4D 数据集页 000；SSRN 7502203 只有 OpenAlex 元数据，摘要未读；play.google.com 的 Floor Is Lava 商店页 curl 000；Bilibili/视频页不播放。

### 8.1 第三轮新增读不到（与前两轮重复的渠道只在有新增事实时列出）

- **Steam 社区公告/新闻/评测**：`steamcommunity.com/games/4527100/announcements/...`、`/5037670/announcements/...` 等 curl 返回 000/TLS 握手失败；Steam 新闻/公告网页正文由 JS 渲染，WebFetch 只得到导航和页脚；正文改以 `api.steampowered.com/ISteamNews/GetNewsForApp/v2` 为准，并用 `store.steampowered.com/news/...` 永久链接回核 200。`appreviews?json=1` 被 302 回商店页；Steam News Hub 只渲染导航和页脚；`ISteamNews` 对 4090630、3553800、4944390、5520840 返回 0 条；SteamDB 403/Cloudflare；Steam storesearch 对 Nenly、程序员小灰、eye-factory 返回 22 字节空结果。公告下的评论与讨论区未读。
- **itch.io 全站**：本机 DNS 把 itch.io 解析到内网拦截地址，TLS handshake 失败（curl exit 35、HTTP 000），WebFetch 报 Socket is closed。未读：Wasteland Renegades（`stuartking84.itch.io/wasteland-renegades`）、Silent Entry、Nightshoal（`profactor.itch.io/nightshoal`）、PCB Defense、Freight Fright、AutoFarm devlog 1736612、AI Browser Game Jam 4 与 Epic AI MegaJam 的 itch 提交页、Storm Cell、Zesty；站内 devlog 搜索 0 字节。2026-11-06 复检 `jaime-7997.itch.io/genmap-pro` 仍是 DNS 拦截、TLS 000（HEAD/GET 同），与全站一致；本次没有可复现的 200 例外，不能据此推断域名已恢复；其余 itch 页未重试，不当作“那里没有内容”。
- **YouTube / B 站**：按任务不加载播放器、不播放视频/音频。YouTube `RNIX-Re9k4o`（Survive the Night FPS 第二张地图重建；noembed 标题《I Gave Claude a 2D Map and It Built an Entire 3D World》，作者 Web Dev Cody）只有 daily.dev 文字摘要，原片与评论未读；B 站 `BV1eung6zELL`、`BV1xWx86bE2t`、opus 1254153303986536455 等返回 412 或“验证码_哔哩哔哩”，只读标题/UP 主/日期/章节；《翻面》《星光小队》《ZERO-G》的连续实机与评论区未读。
- **X/Twitter**：登录墙或 HTTP 402；`nitter`/`xcancel` TLS 失败；只能读单条 `og:description`/oEmbed/fxtwitter 正文，作者时间线、回复与替代品讨论未读（Bramble Keep、Mini 4WD、Stefan 3D AI 均只读到推文本身）。
- **Reddit 直连与归档**：`www/old/api.reddit.com` 403/429，`r.jina.ai` TLS 失败；改用 Arctic Shift，但 `posts/search` 部分 422、一次批量 `posts/ids` 429、`comments/tree` 对 1xowe1p、1x9g44f、1xnd1t5、1xg17ag、1xhn462 等返回 0 条；1xlu68a 只取到 1 条、1xbg7tv 只取到 2 条、1xgcszc 约 42 条；不能当作评论已读全。Spawn 的原始 X 长帖登录墙，只能读 Simon Willison 转述。
- **Hacker News / Lobsters**：`news.ycombinator.com` 直连不可用，全程用 `hn.algolia.com` API；Algolia 评论全文检索噪声大，未定位任何“AI 游戏第二次改关卡”的原帖。Lobsters `search.json` 对任意 q 返回 400 Unpermitted query；tag JSON 的 page 参数不生效，只能看到 games 标签最新 25 条。
- **TapTap**：试玩 DEMO 的“打开 APP 试玩”需客户端/登录，未启动；`/user/31287918`、`/user/8783410`、`/user/435049`、`/user/655955655` 等作者页返回混淆反爬负载，无法枚举其他作品；moment 页只 SSR 正文与“x 回复”计数，回复正文未渲染；《涌现》同名 app/963011 归属无法由页面确认；《涌现之野》app 页无版本号，1.0.94→1.0.185 只在开发者日志⑤正文；《织Weave》评论区只渲染 10/28 条评价。
- **GitHub**：未认证 REST 60 次/小时用尽（remaining 0），改用网页 HTML/raw/commits.atom；code search 需登录；部分仓库无 README 或 404（xiaoli-byte/roguelike-FPS、elitegamelabs/Project-Elitewake、ThinkBuildMake/Regressor-s-Echo、collagen-collective/ts-kyle-on-duty、webgnar/QFSHIVE、webgnar/excaliburSkate、webgnar/QFS 为空）；`Grey2Art` 的完整 Release 资源包未公开、只读 README/catalog；Rebuild 的 4 个 showcase 可运行工程未下载。
- **Vercel / Vibecoco / 其他 SPA**：`repartee-umber.vercel.app`、`gtausterity.vercel.app` 均 schannel TLS 握手失败/UNEXPECTED_EOF（0 字节）；`xiyouji.vibecoco.ai` HTTP 200 但仅 874 字节 SPA 壳、未执行 JS；`plateau.vibecoco.ai` 只有构建与一句简介；`njlent.de/tougelike` 只返回 Next.js 壳与“LOADING... THE DESCENT WILL BE READY SOON”；`voltp.com` 302 到域名出售页 `atom.com/name/VoltP`。
- **学术与厂商页**：`dl.acm.org` 的 Ctrl+Create（10.1145/3815598.3815646）与智能笔刷（10.1145/3815598.3815603）均 403，只读 Crossref/Semantic Scholar 摘要；`g3d.ai`《Automated Playtesting》被域名安全策略拦截，只有 200 与搜索摘要；`semanticscholar.org` 部分 429；`crawfis.com` 与 `www.crawfis.com` 403（CloudFront 按国家拦截）；GDEX 2026 Crawfis 只有摘要页；`thecreatorsai.com` 的 Captive 3000 工具链在“3. Turn…”后进入订阅墙；Open Game Foundation《AI Doesn’t Replace Game-Design Taste》403；`Loom` 分享页只返回“Loom is running a bit slower”壳页；GDC 2026 Tencent IntelliScene 只有 Google Drive PDF 与二手笔记，未取到官方 session 原文；`gamesalchemy.substack.com` TLS/000，Antti Kananen 项目只能读 makegamewithai 转述。
- **Epic / Playground / 商店与市场**：`unrealengine.com/news/2026-epic-ai-megajam` 403 Cloudflare，`itch.io/jam/epic-ai-megajam-2026` 000，只用 Inven Global/GamesRadar 报道；`playgroundarcade.com`（含 `/sitemap.xml`、`/robots.txt`、`/api/games`）Cloudflare 403；`npmjs.com` 403（Ludus 改用 `registry.npmjs.org` 元数据）；Google Play curl 000；App Store 重定向中国区 Today；Discord 未读；Fab 的 Reviews 面板 SSR 为空、`/i/listings/<uid>/reviews` 与 `/i/reviews` 均 404；Unity Asset Store `search/results.json`/`home/start-page.json` 404。
- **中文平台**：微信公众号多篇（阿喵回家 sn=a1d9de596da18fb7e1eb7d0b43617c59、汽车华容道 sn=e20683bb8249c7cde5213b9ddb4c900d 等）返回“当前环境异常，完成验证后即可继续访问”；知乎专栏 `p/2098838491635380842`、`p/2093670490120385288` 等 403；小红书多篇 item 页空/“访问的页面不见了”；NGA `tid=47700995` 403；linux.do `t/topic/2981705` Socket is closed；CSDN 返回 2169 字节混淆脚本；indienova `blogread/36752`、`39356` 403 或动态组件；B 站 412；TapTap 上述限制。
- **Kimi / 引擎 / 其他**：`ithome.com/1/021/539.htm` WebFetch 403，Kimi 信息改用 kimi 官方能力页与 dtinsight 摘要；Kimi 游戏开发方案未找到官方独立落地页；`engine.apeironengine.com` 只有下载壳，未读到版本/许可/作者，原始 Reddit 帖未定位；Tomicz Engine、agentic-game-engine（ImL1s）按名称直查 GitHub 分别未定位/404；`dsh-plugin-beyond-simulator` 只读到搜索摘要；`webgnar/QFSHIVE` 与 `excaliburSkate` 404；`claude.ai` Artifact 页面 200 但为应用壳，未登录无法确认 Chulk Runner 实机；`PlayProof` 的 `/games/{id}/edits` 只接受 POST，GET 404，无法读取已应用的二改记录；OpenAI Codex app 与部分官方 showcase 页仍 403 Cloudflare，本轮不依赖这些入口；OpenDrama 会员段（Stefan 策略游戏、Bramble Keep、Mini 4WD 的 How it was made/Where it breaks）被截断；VibeHub/gamesvibe 作者页只暴露 1 个作品，排行榜/广场未给逐作品 changelog。

**第三轮新增读不到的渠道汇总**：以上为本轮实际尝试后失败或只取到壳/摘要的入口，未换身份、未绕过访问控制；摘要只作线索，不当作已读原文。

## 9. 交给 dot 的试玩与现案例验证

**要“逐版记录”的制作过程，先深挖 HollowARK（按目标选哪个先试见开头决策块）。** 先读 §3.4 的 devlog（<https://kraigadams.com/hollowark/devlog/>，共 128 条、最新到 v91），重点看 v48（岩石/物流线）、v59（洞窟彼此不相连＋开局 57→39 分钟，主 build 口径）、v91（第一章重做为“矿工→传送带→熔炉→方舟”单条生产链，原型 test player 约 21 分钟）三处；v71 只作美术/第一章观感对照，并对照三张作者静态图；恢复实机后在同一起始图跑 10–15 分钟，记录第一铲是否总能开工、物流线是否穿岩、开局资源瓶颈。它的可借机制不是“再改一版”，而是**每版一页记录＋同机位截图＋脚本玩家复跑**：每次只改一组空间/物流参数，立刻用同一脚本玩家跑开局并记时长，版本号与作者原话写在同一页。这个机制可移到 Star 的开局/单段计时，但 HollowARK 是挖掘/物流游戏，不能替代赛车弯道的试玩。

**针对 Star 的最强 1 项先试 Voltane。** 理由：它是本批唯一把“路线二改”写成带日期的可见/碰撞清单、又有开放 beta 和真实玩家负评的 3D 竞速；Star 当前要处理的正是公路弯道、捷径与可读性，问题结构最接近。先在同一赛道（默认 Maplewood 的客厅捷径、门廊碰撞与大弯段；The Backyard 只在需要熟悉车辆/简单闭环时作对照基线）、同一车辆、同一机位连续跑 3 圈，对照更新日志看三件事：捷径是否都有可见几何封住或明确保留；碰撞是否贴合可见墙面/路沿；分段用时、撞墙次数与完成性是否退步（无旧 build 时只比同一 build 的改前/改后同基线，不声称比旧版变差；若只是试玩现成 build、无法取改前，则记当前 3 圈供以后复跑）。不要用“改过”代替“节奏仍可玩”。

**在现案例（Star）可验证的一个机制：可见阻挡清单＋固定跑圈基线。**

1. 把当前公路弯道的每个捷径、隐形墙、可疑碰撞列成一张清单；每项标“保留（有可见开口）”或“封住（用可见几何）”，不允许用隐形墙补。
2. 用同一车辆、同一输入脚本/驾驶参数、同一机位、同一 build 跑 3 圈基线，记录每段用时、撞墙次数、触发捷径次数、是否完成；没有旧 build 时记录同一 build 的改前基线，仅用于改后对照，不声称比旧版变差。
3. 只改清单上的几何/碰撞；改完用同一基线重跑。
4. 判定：触发捷径次数下降，分段用时与完成性不退；同机位改前/改后截图各一张，确认可见几何与碰撞一致。
5. 若需要更细的节奏判据，再借 Solhex 的做法：给每段设目标窗口，用可重复 test player 量实际时长与空转，按偏差改路线/成本，而不是先加装饰。
6. 若问题不是捷径而是整段节奏，借 HollowARK 的计时口径：同一脚本玩家/同一车辆跑同一段，记录开局到第一个目标、单段用时与空转，先量再改；HollowARK 的 57→39 分钟是 v59 主 build 的脚本化完美玩家口径，约 21 分钟是 v91 原型口径，都不是真人首次游玩，引用时必须写清。

**何时不适用。** 问题若只是单段时长/节奏而不是捷径或可见碰撞，改用 Solhex 的目标窗口，不要套跑圈基线；若要换美术/几何且必须保住原跳跃路线，改用 时囚 的同机位灰模/线框；没有旧 build 时，仍可在同一 build 内先跑 3 圈作改前基线、改后同法复跑，只做改前/改后对照，不得声称比旧版变差；只有非闭环赛道、无法固定输入/回放或无法实机运行时，step 2/4 的跑圈基线不可比，才跳过跑圈、只做当前状态的可见几何核对。无法实机运行时同样只核静态几何与作者原文，不替代试玩。

这条机制只借 Voltane 的“可见阻挡＋同基线复跑”、Solhex 的“目标窗口＋可重复测量”和 HollowARK 的“先量开局/单段时长”，不在本卡对 Star 实施、出图或改默认；恢复实机后按现有串行拍摄规则另排。

### 9.1 第三轮新增试玩建议（不替代实机）

**若目标是补一个“版本化、逐项数值最完整”的样本，先看群侠传：幸存者。** 它把“改了什么”写进同一版公告：21–24 波压缩、压力前移到 30–40 波，Boss/精英三轴独立成长，近战怪 30 波起更近生成且落点预告 0.5→0.8 秒。**但公告里的“固定场景＋固定敌人数的低配测试机跑 10 轮”位于 optimization 小节，是验证 GPU/CPU 优化效果的压测，不是平衡改动的复跑；作者没有公布改前/改后的同基线数据。** 恢复实机后需自建同一低配/同一难度跑 10 轮，记录每波剩余血量、死亡波次、30–40 波压力峰值与 60 波封顶后的稳定性；不要用作者自测或 96% 好评代替复跑。它的可借点不是“再调一次数值”，而是**试玩时把改前/改后都锚在同一场景＋同一敌人数＋同一轮数**。

**Fire Field 补的是“整层重建”的可核写法。** 先读 v1.8.0（B1–B5 整层＋33 格圆形大厅蜘蛛中 Boss；点亮三根柱子即可让落石破防，无顺序要求）与 v2.0（8 层＋修石棺/柱子挡路，修敌人刷在物件上、刷在刚下来的楼梯旁；v2.1.6 另修道具/楼梯挡门）两段公告；恢复实机后在同一层记录“从入口到下一层”的完成性、被可互动物件挡住的次数、敌人生成点是否落在物件/楼梯口上。它是 2D 等距 ARPG 且地牢程序生成（房间/走廊/门每次从头生成），不能替代 Star 的公路弯道，但“整层重建后先查阻挡与生成点”的清单可直接借。

**We're Gonna Need More Fireballs 补的是“自我否定后重建 demo”的口径。** 8 月 demo 的 3 图/5 塔被作者自己重玩后否定，重建为 7 图/11 塔、首图完整教学。恢复实机后先核首图是否真的能独立教会玩家，再核 7 图的难度曲线与最后一波 25 万只虫的性能/可完成性；它是塔防，不是 3D 动作。

**3D 动作/解谜方向补看云海神殿与 Hora Cero。** 云海神殿有可玩 three.js 3D 动作解谜、33 代理、两轮 QA 49 问题和作者静态截图/GIF（原链见 §4.7），但缺版本号与明确的关卡 v1→v2 段落；Hora Cero 有 MIT 代码、CC BY 4.0 自有资产、`plaza_layout.py` 共用数据与 2026-10-21 的广场加深提交，但无版本号、截图原链与真人节奏验证。两者都只能作“3D 空间/遭遇二改”的补充，不替代 Voltane 的公路弯道主线。

**对 Star 的可验证机制不变：** 仍用 §9 的“可见阻挡清单＋固定跑圈基线”。第三轮只补两条口径：(1) 群侠传公告给出的“固定场景＋固定敌人数＋固定轮数”测量框架可作为跑圈之外的遭遇节奏对照（作者用它测性能，不是测平衡）；(2) Fire Field 的“整层重建后逐项查阻挡/生成点”可并进可见阻挡清单，改完仍用同一车辆、同一输入、同一机位跑 3 圈。没有旧 build 时只做同一 build 的改前/改后对照，不声称比旧版变差。

## 10. 排重、已核与未核

- **上轮 4 条 open issue 已修**：Fallen Citadel 删掉把文档示例坐标当成实际回写项的那句，只保留 82 处（51 替换、31 移除）汇总；Fang the Fox 改回“页面写明 Claude Code 运行 Opus 5.5”并补两张作者截图原链；Blacklight 改成“changelog 原文 twelve seconds sooner（约 12 秒），同晚夜报记 eleven seconds shorter，两处口径不一致，未统一”，并补夜报链接；Epic Survivors 改成 demo app 4090630，并注明 3553800 是正式版。
- **本轮独立复核修正**：Survive the Night 的站点与 YouTube 第二张地图证据归 `webdevcody/survive-the-night-fps`（982 commits，package 1.0.0，MIT）；原 §4.7 行改为 FPS 版并合并 §5.7 的 FPS 行，`survive-the-night-game`（729 commits、biome editor，README 只给 localhost:3000）无公开可玩入口，不再单列。§5.7 的齿轮塔防、翻面、涌·墨卷三行是前两轮同作品重复，已改为交叉引用并把新证据并入原条目；CORO SOLTO #1115 只保留“减少迷宫/支路、设复杂度上限”，另两条未核到原文已删；星尘战线版本改为页面 49 条历史更新/50 个版本与 API `releaseCount=57` 两种口径；云海神殿补 4 条截图/GIF 原链；Floor Is Lava 改为“十个平台”与 Lance 建议口径；群侠传删去“最新”，并把“唯一”限定为“平衡改动数值写得最细的一项”（More Fireballs 公告也有整版改前/改后数量）；A- 与乙级 70 的包含关系写清。
- **排重**：对照 `domains/game-dev/README.md` 的“用 AI 做游戏”表、`docs/research/2026-10-23-game-worth-trying.md`、旧场景/角色/音频卡与已交回候选；任务点名的 19 项旧候选与 `pxl` 均未重列。Emberwick、Claude-of-Tanks 按“同一作品只归主要价值最贴合的一卡”转交场景光照卡；Race Evolutions 按作者门槛排除。Vibe Jam／awesome 列表／插件与 Skill 市场与本卡“关卡二改”关联弱，未把榜单条目当候选。第二轮新增的 HollowARK、Bash Fighter、Dustlight、Peas of Resistance、Overserved、Kindlefall 等未在 a1dbv 参考副本或第一轮产物中出现；CORO SOLTO 的 repo 已在资产编辑卡作为角色 GLB 证据，本卡只新增地图二改，跨卡不重复；Fang the Fox 是第一轮乙级条目，本轮只补齐 Opus 5.5 口径、两张截图原链与缺口，不计第二轮新增；失控协议：群潮之下、璇玑、蚁SCAPE 已在前轮表中出现，本轮只做交叉引用，不重复计数；《瓦楞速运》是本轮同一作品日志 2 与日志 4 的两条记录，已合并为一行，不是前轮条目。Sky Shift、Dustlight、Pro Skater 等只有生成/演示或管线、没有逐关前后对照的，按二改门槛降级（Dustlight 移入 §7.1 只作管线线索），不当作甲级证据。
- **已核**：第一轮 A 级三项的主入口、作者过程页和静态截图原链本次重新取了 HTTP 状态（Voltane `play` 200、`/en/updates` 200、关卡图 `level-maison-960` 与 `level-jardin-960` 均 200（hero 宣传图另 200，不算关卡截图）；Solhex `play` 200、devlog 200、两张图 200；时囚 app 页 200、三篇 moment 200、两张 tapimg 图 200）；第二轮核了 HollowARK 的 `play`/devlog 与 v48/v36/v71 三张图（均 200）、Bash Fighter 仓库/commit 99b53d8/实机图（均 200）、Fang 页面与两张截图（均 200）、Blacklight changelog（200，原文 twelve seconds sooner）、CORO SOLTO 首页（200）；另核 Pull the Plug Pages 200、Pull the Plug Day9/Day24 两篇 devlog 200、Iron Curtain Steam 页与 Demo app 5451220 均 200、Fable 200 及其 Zenn/MIT 源码页 200、多米诺人生 200、Fallen Citadel 200。Fable 的 MIT LICENSE 与 Fallen Citadel 无 LICENSE、README 的资产边界本次实读；Solhex devlog 的 v99/v103/v173 原文、Voltane 更新日志的“second finishing pass/大弯封路/客厅捷径/隐形墙”原文、HollowARK 的 v48/v59/v71/v91 原文本次实读；Iron Curtain 的 appdetails 显示正式版 2027-03-11、`coming_soon=true`，Demo appdetails 显示 2026-10-23。标题与页面内容只抽查，未逐页核对。
- **未核**：作者真实身份（多为个人站/工作室页/handle）、完整游玩回路、帧率/手感/听感、手机与低端设备性能、模型/引擎版本逐项、资产逐件许可、跨平台可玩性、完整成本。第二轮 HollowARK 的完整游玩、Bash Fighter 的实际手感/联机、Overserved 的 bot 与真人差异、CORO SOLTO 的地图 authoring 工具实际操作均未运行；HollowARK 的 57→39 分钟是脚本化完美玩家口径，不是真人首次游玩。上述留给 dot 试玩或后续核读，不在本产物里写成已知；本端未启动任何游戏、未看完整连续实机、未播放视频/音频。
- **版本/许可分界**：Fable 代码 MIT、地图 ODbL；Fang the Fox 免费可玩、MIT；Gensokyo Survivors 无 LICENSE、同人素材需另核；Fallen Citadel 仓库无 LICENSE、原仓库因外部资产私有；Bash Fighter 代码 AGPL-3.0，素材/音效许可未单独声明；CORO SOLTO 代码 AGPL-3.0；Dustlight 代码 MIT、美术/音频/配音版权归 GamesByAI 不随 MIT；HCT 1.6 – Chile 的 mod 代码 MIT，但必须自备 Horizon Chase Turbo；Cart Chase 2P 是非商业同人许可且需自备 DKC ROM；Voltane、Solhex、时囚、HollowARK、Overserved、Pull the Plug、多米诺人生、Iron Curtain Call 的代码/资产许可均未在已读页面声明，不能由“可玩”推定可复用。
- **第三轮排重与新增边界**：本轮新增 Fire Field、群侠传：幸存者、We're Gonna Need More Fireballs、Journey to the West、Hora Cero、Pawnshire、Sector Dive Extended、云海神殿、涌现之野、过拟合猎手、织Weave、VibeHub 7 款、DungeonFlux、涌现理论等未在两轮产物或 a1dbv 参考副本出现的条目；Voltane、CORO SOLTO、Familiar 只在原条目补证（[CORO SOLTO #1115](https://github.com/corosolto/client/issues/1115) 补“Lajes 迷宫/支路过多，需减少总长度与支路数并给复杂度设上限”；原文未支持“3 个水下不可达站点”“按身体半径重排掩体路线”，已删去；[Voltane 更新日志](https://playvoltane.com/en/updates) 补屏内 bug 上报与 2026-11-03 隐形墙修复，[Familiar #25](https://github.com/Preponderous-Software/familiar/issues/25) 补 #25/#26/#27/#31 四条空间/寻路缺陷）；齿轮塔防、翻面、涌·墨卷的第三轮玩家反馈已并入 §4.5/§5.5/§5.1，Survive the Night FPS 行已并入 §4.7，均不重复计数；Emberwick 仍按“同一作品只归主要价值最贴合的一卡”转交场景光照卡；Wasteland Renegades 只在 Reddit 正文与 intelligentartifact 索引出现，因 itch 页 TLS 000 无法核可玩入口、版本与许可，未计入候选；《涌现》同名 app/963011 归属未确认，未与 moment 页合并；Grey2Art 只作管线线索，未计作品；任务点名的 19 项旧候选与 `pxl` 未重列。
- **第三轮已核**：Fire Field `store.steampowered.com/app/4527100/`、v1.8.0 公告永久链接（1840944183776407）与 v2.0 (1/5) 永久链接（1844751498224107）均 200，Steam CDN 图 200；More Fireballs app 5037670、2026-10-07 公告与 CDN 图（200）；群侠传 app 4957110、AI 披露页（200，含 “AI Generated Content Disclosure” 段）、V0.1.2 公告永久链接（1841579228672838，200；正文经 `ISteamNews` v2）、V0.2.3 公告（1847286114044092，200）、商店截图（200）；仙门守护者 app 4868150、1.0.2/1.0.5 公告与截图（200）；云海神殿 play `skytemple.cclliang.com`（200）、文中 4 条静态图/GIF 原链（200，见 §4.7）；涌现之野 app 953696 与 moment（200）；Hora Cero `horacero.app`（200）；Journey `xiyouji.vibecoco.ai`（200 但仅 874 字节 SPA 壳、未执行 JS，可玩性未确认），两张截图原链 hero.jpg/battle.jpg（200）；Pawnshire play `unformedideas.com/chess-rpg/`（200）；Sector Dive Extended（200）；VibeHub 7 款作品页（200；直接构建未逐一复检）；`survivethenightgame.com`（Survive the Night FPS 的部署站，README 明写由 `webdevcody/survive-the-night-fps` 部署）2026-11-06 用 GET 复检 200（www/play 同；HEAD 返回 404，页面标题 Survive The Night、meta 为 1–16 人联机僵尸生存）；TapTap 五行/织Weave/寂静园/SpectreX/翻面/涌·墨卷（200）；GitHub mapedit/Playbench/pyxel-mcp/Gozen/GenMap Lite/XEngine/Ignis/Recursive/Summer Engine/Prowl/Ritmo 等（200）；arXiv 2608.21833/2610.26098/2609.25652/2605.28258/2609.33678/2605.07442/2606.17861/2604.02648（200）。标题与页面内容只抽查，未逐页核对；链接可达不等于已看完整连续实机。
- **第三轮未核**：作者真实身份（多为个人站/工作室页/handle/平台模型标签）、完整游玩回路、帧率/手感/听感、手机与低端设备性能、模型/引擎版本逐项、资产逐件许可、跨平台可玩性、完整成本。群侠传公告里的 10 轮性能压测（非平衡复跑）、Fire Field 的整层重建、More Fireballs 的 7 图难度曲线、VibeHub 7 款的“改后仍可玩”均未实机复跑；Hora Cero 的提交 1a72b35 只读提交说明与代码结构，未逐行核；Journey 的 PR #86 只读发布说明、入口 SPA 未执行 JS；云海神殿的 49 个 QA 问题未逐条复现。上述留给负责人试玩或后续核读，不在本产物里写成已知；本端未启动任何游戏、未看完整连续实机、未播放视频/音频。
- **第三轮版本/许可分界**：群侠传成本只有作者访谈转述约 5000–6000 元（原文未取得，待核）、代码/资产许可未声明；Fire Field 只提 $20/月 Claude 订阅、许可未声明；More Fireballs 许可/成本未知；Journey 代码 MIT；Hora Cero 代码 MIT、自有资产 CC BY 4.0，漫画角色与 Santiago Siri 模型不在自由许可内；Pawnshire GPL-3；SCP 收容失效为同人非商业（SCP 设定 CC BY-SA 3.0）；镜之边缘 WEB 与骑马与砍杀为同人 IP；TDRadish 美术/音频取自商业原作、禁商用；DungeonFlux 无 LICENSE、规则素材 SRD 5.2.1 CC-BY 4.0；Fluchtpunkt 许可未声明；VibeHub 7 款与涌现之野、过拟合猎手、织Weave、寂静园、SpectreX、翻面、涌·墨卷、齿轮塔防、无限世界、仙门守护者的代码/资产许可均未在已读页面声明，不能由“可玩”推定可复用。

## 原始采集回执

实际渠道：第一轮为 Vibe Jam 官方 API/静态缓存、GitHub 网页/raw/`commits.atom`/Pages、作者站与 devlog（kraigadams、x00f、dmnshd、tinybitadventures、vibegamesstudio、evolutionaryarcade、rustyrobozlabs、blog.slashie.net、penguinboisoftware、supertommy、slipfacegame、fable-katamari＋Zenn）、Reddit Arctic Shift、Steam appdetails/ISteamNews、TapTap 网页 SSR/tag/moment/app 页、掘金/cnblogs/agentcaseshare/jobyang、Hacker News Algolia、awesome-opus-5.5-games 的 games.json、aibuiltgames/Playgama 索引、B 站与 YouTube 元数据。第二轮增加了 GitHub 的 `react-app.embeddedData` 搜索/trending/raw/`commits.atom`/浅克隆、GamesByAI catalog 与 gamesbyai.win、OpenAI Showcase、Unity agent plugin/Spark、Google Developers Blog/Antigravity/Playground、Dora SSR、eremes81 书稿、作者站（HollowARK、RSD、Unmask the City、Caleb Leak、Jeff Schomay、ButterStack、Vibe Arcade）、HN Algolia 评论树、Arctic Shift 的 r/aigamedev 帖与评论、TapTap moment/app/tag 页、Steam/App Store、arXiv/J-STAGE/Zenodo/SSRN/Semantic Scholar、Playgama/SoonPlay/Unity Spark/Meta Horizon 与 Godot/Unity MCP 工具仓库。搜索词覆盖中英文的 level redesign/second pass/playtest、关卡重做/路线/波次/遭遇、blockout/greybox、second playtest、boss encounter rework、site:itch.io、site:taptap.cn、TapTap 聚光灯 2026、AI Browser Game Jam 4、Vibe Jam 2026 等；WebSearch 200/200 用尽后改直取 URL、API、RSS 与站点内导航。链接核对用脚本并行 curl，以 GET（`-sL`）的状态码与页面标题判断，必要再补 HEAD；HEAD 返回 404 时以 GET 复核为准；本轮共抽取 250 个唯一链接，235 个返回 200/3xx，其余为已记录的 Reddit、itch.io、HN、OpenAI、Unreal、npm 网页阻断（Ludus 的 registry 元数据可用），未当作已读。读取截止 2026-11-06；未启动游戏、未看实机、未开浏览器、未登录、未发帖、未评品质。
