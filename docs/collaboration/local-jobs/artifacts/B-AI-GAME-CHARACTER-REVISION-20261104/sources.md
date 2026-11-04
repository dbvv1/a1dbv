# B-AI-GAME-CHARACTER-REVISION-20261104 · 成套角色动作二改候选与渠道覆盖

整理与核实截止：2026-11-04。材料只来自本卡已核实的候选清单与各路收集回执；本单元只补同一来源的直达／镜像链接与元数据，不新增候选、不重新抓取其他材料、不试玩、不看完整实机、不评品质。表中“可玩”“有 demo”均为清单所述，未在本机验证；“未试玩”适用于全部条目。

排队依据：`domains/game-dev/templates/.claude/skills/ai-made-games-scout/SKILL.md` §1，并已对照 `domains/game-dev/README.md`“用 AI 做游戏”、`docs/research/2026-10-23-game-worth-trying.md` 第 8 节与 `B-AI-GAME-SUPPLY-SOURCES-20261027` 的固定产物排重。Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R’lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso、pxl 只作对照，不计新候选。

## 先给结论：最值得 dot 深挖的 5 项

筛选按三道门：①有可玩版本或完整连续实机；②有作者本人写的制作过程；③能落到本题“同角色 idle／移动／攻击三类动作＋换装或接触时刻保骨架与旧动作＋人工刷权重／逐帧修补”。三项之外再看版本与日期、公开静态截图、成本与许可是否已知。

1. **World of ClaudeCraft**（A1）——唯一同时给出“双体型各 23 段手 K 动作、攻击接触时刻文件、每个体型一套 bind rig、各体型 clip 只 key 在自己 bind rig 上、武器皮肤让位、CLAUDE/skill 写明评审项”的可玩开源 MMO，题面覆盖最全，证据在代码里可逐条复核。
2. **Grandma GTA**（A2）——可玩 3D 开放世界，作者自述“一套骨骼所有角色通用”；`actor.js` 实际是两套骨架：阿嬤 65 骨 Mixamo（17 段 clip），Combos NPC 41 骨 Tripo（idle／walk／run／slash），动画层按语义骨名映射；22–25 段预设动作属 Tripo／Mixamo 资产管线，不是 41 骨 NPC 骨架的 clip。换装只换服装；`actor.js` 自动找命中帧并用两骨 IK＋gripHand 让短臂角色握上龙头车把，是“换装不动旧动作、接触时刻程序化校准”的最直接实游戏。
3. **刀光剑影**（A3）——可玩动作肉鸽 demo，两篇日志分别记录 Tripo/Mixamo 命名与 Bip001 双字段修正、两骨 IK 修直腿，以及“只换 41 骨矩阵编码、骨架／权重／HeroAnim 动作／HeroSword 挂点逐字节未动”的蒙皮重构，正好回答二改如何不碰旧动作和装备挂点。
4. **Zhaoye 照夜**（A4）——可玩武侠 Boss 战网页 demo，制作记录给到 71 骨源骨架→75 骨战斗骨架、刀与刀鞘独立道具轨、手部接触检查；一次自动权重尝试没有产出任何带权重顶点，后续局部修复手指与领口权重，肩部与宽松衣物仍会折叠，属于少见的成套角色二改细节。
5. **Graveyard Waves**（A5）——可玩单波 diorama，四类僵尸各约 24 骨、38 段动作覆盖 walk/run/attack/hit/death/rise；making-of 复盘了刚体拆分失败、重绑后骨长差至 4%、帧差约 20°、武器握把轴与挥击起始跳变逐项修正，最适合核“换武器与接触帧保骨架”。

次选（同样可玩且过程可读，但各缺一块）：Korovany（换武器只挂 handslot、不动 clip）、《长风》（Tripo＋Mixamo 重定向＋IK 修正、MIT）、LANTERN ALLEY（6 个已绑定角色、动作时序重排）、Hibana（119 段动作／52 骨、逐项手工修复）、Crowned in Steel（270 个动作、换武器与 demo 更新）。若只带 2–3 个进完整试玩，建议 A1／A2／A3，A4 作机制补充。

**dot 从这里开始。** 先开 A1 玩 10–15 分钟，按下面验证问题 1 换武器／皮肤，对比 autoattack 接触帧 0.408/0.458 与伤害数字、音效是否对齐；A1 通过后再看 A2／A3。若第一轮就要可复用资产，先核 A1 的 CREDITS 媒体许可再决定是否深入。排除条件：需要独立作者、不接受厂商展示，去掉 A4／A5／A8／A9（Hibana 即 A9；A4 是 OpenGame 团队官方展示，A5／A9 属 Scenario，A8 属 Tripo 官方 playbook）；需要 3D 骨架，跳过 B1 的 2D 条目；不能接受人工刷权重／逐帧修补，先排除把这类修补当主路径的候选。

## 渠道覆盖表

| 渠道 | 实际看了什么 | 得到几项 | 读不到及原因 |
|---|---|---|---|
| GitHub（未登录 REST search、raw、网页 HTML、`git clone --depth 1`） | 搜过 `vibe coded game character animation`、topic:vibejam／ai-game、Mixamo／KayKit／Quaternius in:readme 等；读 World of ClaudeCraft 的 CLAUDE.md、skills、PR #4460、issue #2889、release v0.45.0、`woc_keyed_anims` 与 `build_bow_anims.mjs`；读 Hollow Crown、Korovany、Bash Fighter、Mouse Quest、长风、Depthbound、Coronach、Cloudgarden、Embervale、Grimhollow、Huanchao、animated-asset-skill、Charakuru 等仓库与 issue。 | 约 30 项候选，另有 10 余项机制源 | REST 核心 API 60 次/小时在收尾阶段用尽（共享出口 IP 403），改用 raw 与网页；GitHub code search 需登录，未能按代码内容检索动画实现；`gh` 未安装；部分仓库元数据 403，tree/PR/issue 时间线未完整枚举。 |
| Vibe Jam 官方 API（`vibejam.com/api`） | 2026 届 945 款、2025 届 1,083 款；按 Action／Fighting／Platformer 与 animation／character／rig／skeleton／monster／combat 过滤。 | 入口与排名数据，未单独产出候选 | 只作入口；未逐款回作者原帖，不能把 jam 排名当过程证据。 |
| GamesByAI 目录、awesome 列表与 games.json | `gamesbyai/catalog` 596 个 YAML，grep animat／rig／skelet／spine 并读 made.notes；`gamingnews5/awesome-opus-5.5-games` 的 games.json 4,128 条／3,581 个源仓库；GamesByAI `/data/games.json` 588 款（动作类 227）。 | 索引与若干候选线索 | 目录条目多为二手摘要，未逐条回作者原文；部分 repo 已 404（如 `bigbadbillion/game`）。 |
| Bilibili（站内搜索、`x/web-interface/view`、`x/v2/reply`、`related`、空间页、Toy 页） | 搜“AI 独立游戏 开发日志 角色动画”“AI 做游戏 动作 实机”“AI 格斗游戏 开发”“AI 游戏 角色 换装 骨骼”等，并按作者／游戏名复搜；读 BV12LJC6SEKj、BV1XxHw6UE9w、BV1aaez6WED9、BV1dbxc6aEyU、BV1Mzn86DEWR、BV1Vrnm6VEJq、BV1L5xm6bErg、BV1mBpJ6tESy、BV1kpWw6BE8a、BV1fVx46BETY 等页面及简介。 | 约 20 项 | 视频页／搜索 API 多次 412 风控与验证码；`space.bilibili.com` 投稿与合集页只渲染标题，无法枚举作者全部作品；B 站 opus 页返回验证码；弹幕与画面实际内容未看；部分搜索结果指向镜像站，未计来源。 |
| TapTap（app 页 JSON-LD、开发者页、moment、聚光灯 GameJam 标签页） | 逐个读 app 956231、961070、967563、955461、967121、953944、970900、781760、954438、977867、966587、725698、904794、980297 等；读 moment 860289331934269293、859214192178103840、859904656350905753、860951779351725385、860679786505178819、861019895964368901、728643876306290986、858508351015750223、860375735766879585、860671092597984588、857691713039240472、858816523685332190 等；取开发者页 473644／344236／340804／275303／463667／474865 的 app 列表与聚光灯标签页 18 个 app。 | 约 25 项 | 部分 app 的 meta description 截断；截图位多为占位图，未能逐张核作者公开静态截图；moment 评论区只显示浏览量／点赞；作者页 `user/63502669` 返回人机验证，无法列出《生以此道》全系列，只确认第 3 期单篇；搜索页多为 JS 渲染。 |
| Steam（商店页、`appdetails`、`ISteamNews`、`appreviews`） | 读 Dynasthir（2145210／4002260）、Bring It（正式 4146080，Coming soon；Demo 4654970）、Crowned in Steel（2679830）、Navy Island Confidential（4153730）、群侠传：幸存者（4957110）、波兰球：黑色启示录（4093260）、岛风渔歌（4962830）、山河营造（4942590）、Travelling Home（4838820）等；核 AI 披露原文。 | 约 10 项 | appreviews 返回非 JSON／空，未能读群侠传玩家对 AI 美术与动画的评论；搜索“旅行家：后日时光”无精确匹配，无法把 Travelling Home 当作 B 站作者作品；部分页面无版本号。 |
| X／Twitter（`api.fxtwitter.com`、`publish.twitter.com/oembed`、`cdn.syndication.twimg.com`、status ID snowflake 解码） | 读 sorenxet 2114126731711750156／2113999879122850159、chongdashu 2109278486015914364、cnyzgkc 2108159853533466672、Stefan_3D_AI 2112130671015874614；t.co 解析 tidebreaker。 | 4 项 | x.com 首页只返回未登录壳；直连 402；nitter 不可用；作者时间线与长帖串、视频内容、木马人帖的 102 条回复与早前项目未枚举；After the Wind 的两条二手帖日期由 fxtwitter 元数据取得（sorenxet 2026-10-24、Stefan 2026-10-19）。 |
| Reddit（Arctic Shift／BuzzRadr 等镜像与搜索摘要） | r/aigamedev、r/ClaudeAI 的 After the Wind、KAYFABE、Monet 等帖；用 Arctic Shift comments/tree 取过 1xn7jti 评论树。 | 少数二手线索，未产出独立新候选 | `search.json` 403 Blocked；www／old／api／eddrit／redlib 均被拒或 TLS 失败；pullpush 521；只能读镜像与摘要，拿不到票数、被删评论与完整媒体说明；未把摘要当作者原文。 |
| itch.io | 尝试 All Tools Allowed #2 的 jam 主页、entries、results、rate 页与 KAYFABE／forty-slop 作者页；部分经 `itch-io.translate.goog` 代理。 | Bring Them Home 等少数条目，未新增本卡候选 | 直连 TLS reset／000，WebFetch Socket closed；证书主机不匹配（player.jeifm.com）；只取到 results 第 1 页，21–23 名缺失；未发现 Bring Them Home 之外另一款 3D 角色动作作品。 |
| Hacker News（Algolia API） | 搜 world of claudecraft、hollow crown、bash fighter、vibe coded game、AI generated game、Godot game AI、character animation AI 等；读 48509143 评论树（指出 ClaudeCraft 角色资产主要是免费下载素材，不是 AI 生成）与 Show HN 50305320（Catcopter）。 | 3 项 | 部分条目页面不可达；评论只作反证，不能替代作者原文。 |
| Cascadeur 官方博客／文档 | 读 ALATURKA、Bring It、Dynasthir、OG Realistic Combat System、Her Majesty、Crowned in Steel 等 indie spotlight；读 Retargeting、Copy Tools、Import Animation from UE、Using Mixamo Rig、AI Inbetweening 发布说明。 | 5 项游戏＋机制 | 官方 spotlight 是厂商案例，需回 Steam／作者页；OG Realistic Combat System 是 Fab 上的战斗系统资产，不是游戏；Her Majesty、Usman 是动画短片。 |
| Scenario explorations（86 项索引＋making-of PDF） | 逐篇读 graveyard-waves、scroll-courier、theme-swap、iso-cycles、pit-tactics、blender-2d-animation、fully-rigged、same-moves-new-actor、lamplighter、little-lights、babel-tavern、hibana、crimson-tower；用 pypdf 抽 graveyard-waves 与 scroll-courier 正文核对时间线与参数。 | 约 10 项 | 属 Scenario 自家 agent 展示，不是独立作者；Crimson Tower／Lamplighter 等作者署名与团队未明。 |
| Tripo 官方（GrowthLab playbook、developers 文档、tripo.page） | 读 `TripoGrowthLab/vibe-gaming-interactive-playbook` 的 README 与 examples/pit-nine、examples/ski、examples/lantern-alley；读 developers.tripo3d.com 的 Rig／Animation Retarget 文档。 | 3 项可玩示例＋机制 | `tripo3d.ai`、`developers.tripo3d.ai`、`tripo.page` 多次 TLS exit 35／Socket closed，Lantern Alley 页面正文与 19MB 构建地址未直接取得；web.archive 被拦；改从 GitHub 源码取证。 |
| Meshy 官方（`meshy.cn` 替代直连、3D Games、Animation Library、Auto-Rigging、blog、game-asset-pipeline） | 读 `/3d-games` 索引 49 个游戏与 sushi-chop、gnome-garden、gulliver、rescue-raid、bouncy-castle-dash 等详情；读 animation-library（631 段）、auto-rigging、game-asset-pipeline；MeshyRig 博客仅摘要。 | 6 项可玩展示＋机制 | `www.meshy.ai` 直连 000（解析异常），改用同内容中文站；部分子页证书不匹配或 Socket closed；单页多无发布日期／版本，作者过程只有页面 how-it-was-made，未找到独立 devlog；属厂商展示作品。 |
| OpenGame、Goblin Games、日本 AI 游戏开发研究室、掘金、CGJOY | OpenGame 游戏库 37 款与博客索引（Zhaoye／Control Resonant／Huss Valley／Ball vs Ball）；Goblin Games devlog week10；日本日记 250016、251275、251029、254506、252964、247637、247475、247080；掘金《武来》正文与作者列表；CGJOY 284303／272089 按 GBK 解码。 | 约 8 项 | 日本站首页 socket hang up，只能读单篇与截断索引；CGJOY 284262／284254／284275／284349 乱码或无关；284303 外链不在正文，靠 B 站站内搜索定位；腾讯文档标注“只能查看”，只读到页头。 |
| 技术论坛与 issue（Blender Artists、Epic、Unity Discussions、DAZ、Godot、Rokoko、Charakuru、ComfyUI-WanVideoWrapper） | 读 Meshy 胖角色重定向变形、ARP 手指扭曲与 Mixamo 手臂拉伸、Cascadeur→Unity 滑步穿地、Cascadeur→UE 动画损坏、DAZ 重定向黑箱、Rokoko #98／#54、Godot #89244／#96153／#65656／PR #88824／#76499、Charakuru #20／#23、Wan wrapper #1251。 | 约 15 项机制／反例 | GitHub API 限流，issue 时间线与折叠评论（如 #1251 的 72 条）未完整展开；community.adobe.com 与 renrendaima.com 被安全校验拦截；CGJOY 部分帖乱码。 |
| 中文社区（知乎、微信公众号、小红书、linux.do、即刻、V2EX） | 检索“AI 做游戏 角色 动作 骨骼动画 独立开发 实战”“AI 生成 角色 骨骼动画 独立游戏 开发日志”“TapTap 聚光灯 开发日志”等。 | 少量摘要线索，未产出可核候选 | 知乎专栏 403；公众号返回“访问验证”；小红书登录壳／未登录；linux.do 403 或 TLS 失败；即刻 site: 无返回；V2EX 无可读响应。 |
| YouTube、Medium、web.archive、通用搜索引擎 | 尝试作者完整开发录像、Medium 复盘、缓存页与 site: 查询。 | 0 | YouTube／Medium curl 000、WebFetch Socket closed、oembed 空；archive.ph／web.archive 被拒；Google／DDG／Bing／Mojeek／Startpage 分别证书错误、403、区域重定向或机器人验证；WebSearch 会话预算 200/200 用尽。 |
| Steam 评论、Product Hunt、Trustpilot、arXiv | 读 Meshy Trustpilot 4/5 评价、Product Hunt Meshy 聚合评价；arXiv 2509.14055 元数据（Wan Animate）。 | 3 项机制／市场侧 | Product Hunt 评价时间跨度大，只能作弱证据；Epic 论坛 Meshy 帖具体 A/T-pose 内容来自搜索摘要，未读全帖；Steam appreviews 非 JSON。 |

### 读不到的渠道（汇总）

- **Reddit 全线**：`reddit.com`／`old.reddit.com`／`api.reddit.com`／`search.json` 返回 403、000 或 WebFetch 硬拦截；eddrit／redlib／libreddit 返回 Anubis 检查页或 Socket closed；pullpush 521。r/aigamedev、r/gamedev 的作者流程帖与评论树没有取到，不能据此判断那里没有内容。
- **itch.io 全线**：直连 TLS handshake 失败（exit 35）或 curl 000；WebFetch 报 Socket is closed；证书主机不匹配。KAYFABE demo、forty-slop 作者页、All Tools Allowed 2 的条目页与 rate 页均未直接读到。
- **搜索引擎**：WebSearch 200/200 用尽；Google／DDG／Bing／Marginalia／Startpage 被证书错误、403、cn.bing 区域重定向或机器人验证挡住，`site:` 查询无法完成。
- **X／Twitter**：直连 402 或未登录壳；nitter 不可用；fxtwitter 只返回指定帖与 profile 元数据，作者时间线、长帖串、视频内容与回复未枚举。
- **Tripo／Meshy／HuggingFace 官方页**：`tripo3d.ai`、`developers.tripo3d.ai`、`tripo.page`、`tripo3ds.com` 多次 TLS exit 35／Socket closed／cgi-sys 挂起；`www.meshy.ai` 直连 000（解析异常），部分子页证书不匹配；`huggingface.co` 的 HY-Motion／MeshyRig 页 TLS／非 JSON；`web.archive.org`／`archive.ph` 被拒。
- **YouTube／Medium／B 站 opus**：curl 000、WebFetch Socket closed、oembed 空；B 站 opus 与视频页多次验证码或 412。
- **中文社区**：知乎专栏 403；微信公众号“访问验证”；小红书登录壳；linux.do 403／TLS；即刻无返回；V2EX 无响应。
- **部分游戏页**：`tidebreaker.vercel.app`、`afterthewind.game`／`afterthewind.itch.io`、`callofnaija.vercel.app`、`worldofclaudecraft.com` 主站、`brawlbox.gg`／`martini.film` 等若干页，连接失败、域名安全策略拦截或只返回 JS 外壳。

“读不到”是渠道或页面层结果，不等于该渠道没有相关作品；本轮不把搜索摘要当作者原文，也不对未覆盖渠道下“没有内容”的结论。

## 排序清单

排序规则：先按必要条件（可玩／完整实机、作者过程、AI／人工分工）分组，再在同组内按题面覆盖（idle／移动／攻击、换装或接触保骨架、人工修补证据）与元数据完整度排。A 档可优先交给 dot 完整试玩；B 档留作补充或待核；C 档只作机制与对照，不是新游戏候选；D 档为不满足条件的排除项。

### A 档：首试与次选

#### A1. World of ClaudeCraft

- 入口：[worldofclaudecraft.com](https://worldofclaudecraft.com/)。浏览器 MMO，可玩，版本 v0.45.7（2026-11-03）。
- 作者过程与二改机制：v0.45 的 [PR #4460](https://github.com/levy-street/world-of-claudecraft/pull/4460) 为男女两种体型各手 K 23 段动作，覆盖 idle／walk／run／backpedal／autoattack／受击／表情；攻击接触时刻写在 `woc_autoattack_contacts.json`，双持接触从 0.125s 改到 0.408/0.458s。新动作是 mesh-free GLB clip：mesh-free 只表示 clip 库不含 mesh，男女各 23 段分别 key 在各自体型的 bind rig 上（`woc_male.glb`／`woc_female.glb` 各一套），不是跨体型共用；先从已有 clip 采样姿态混合，没有供体姿态才升级到 headless Blender；武器皮肤自带 clip 时让位，不重刷权重。仓库 `CLAUDE.md`、`.claude/skills/blender-anim-pipeline/SKILL.md`（评审查脚滑／T-pose／循环点）、仓库 issue #2889（1000+ clip 计划的动因与边界）、`scripts/assets/woc_keyed_anims/README.md` 给出一手管线。
- 元数据：代码 MIT（[LICENSE](https://github.com/levy-street/world-of-claudecraft/blob/main/LICENSE)）；媒体资产逐项见 [README#license](https://github.com/levy-street/world-of-claudecraft#license) 与 [CREDITS.md](https://github.com/levy-street/world-of-claudecraft/blob/main/CREDITS.md)：多数 CC0，WOC 玩家角色（含各体型的 model 与 animation library）rights reserved／No permission，keyed 动作剪辑未列入 CREDITS，未列入的资产不随 MIT 授权；名称与品牌不授权。AI／人工分工：Claude 写代码与管线；美术为 CC0 素材＋维护者 Blender／程序资产＋Tripo 生成的部分贴图；动画关键姿态由人按规格手 K；HN 评论指出大量角色资产是免费下载素材，不是 AI 生成。开发成本未披露。[作者复盘](https://levystreet.com/portfolio/world-of-claudecraft/)。公开静态截图（换动作前后）：[before-male-swing.png](https://raw.githubusercontent.com/levy-street/world-of-claudecraft/main/docs/screenshots/woc-keyed-animations/before-male-swing.png)／[after-male-swing.png](https://raw.githubusercontent.com/levy-street/world-of-claudecraft/main/docs/screenshots/woc-keyed-animations/after-male-swing.png)。
- 为什么排第一：三道门全中，且“各体型 bind rig 与其 clip 一致＋mesh-free clip＋武器皮肤让位＋接触时刻文件”正是本题要核的机制；可逐文件复核，不依赖作者口述。缺口：完整试玩需核换装／换武器后同一 idle 与攻击的接触帧是否仍与伤害数字、音效对齐；不重刷权重能否保住旧动作。

#### A2. Grandma GTA（阿嬤俠盜：田庄大亂鬥）

- 入口：[在线可玩](https://andyhuo520.github.io/grandma-gta/)，[仓库](https://github.com/andyhuo520/grandma-gta)。3D 浏览器开放世界，13 关、换装、骑车／格斗；MIT，v1.0.0（[release v1.0.0](https://github.com/andyhuo520/grandma-gta/releases/tag/v1.0.0)，2026-10-09 发布）。
- 作者过程与二改机制：作者写明 Tripo 建模→Mixamo 自动绑骨、“一套骨骼所有角色通用”；代码实际是两套骨架：阿嬤 65 骨 Mixamo（17 段 clip），Combos NPC 41 骨 Tripo（仅 idle／walk／run／slash 四段），动画层按语义骨名映射。22–25 段 Tripo／Mixamo 预设动作（走／跑／拳／踢／挥棍／跳舞等）＋Text-to-Motion 属于资产管线，不是 41 骨 NPC 骨架的 clip；换装只换服装。`actor.js` 自动找出拳命中帧（手／脚离髋最远帧）、两骨 IK＋`gripHand` 修 0.41 m 短臂够不到龙头车把，并清理 GLB 动作名 `.001` 后缀。
- 元数据：代码 MIT，模型与动作来源见 README；AI／人工分工只从 README 与代码推断，未单列；成本未披露。公开动图（仓库只有 GIF，无静态截图）：[tech-lineup.gif](https://raw.githubusercontent.com/andyhuo520/grandma-gta/main/docs/media/tech-lineup.gif)。
- 为什么排第二：本清单里最明确的一套“作者自述一套骨骼全角色通用＋换装只换服装＋程序化找命中帧＋IK 修龙头车把”的可玩 3D 实游戏，直接回答“换装后旧动作与接触是否还成立”。缺口：未见权重手修记录；短臂 IK 是特例修正，换比例更大的角色是否仍成立待试。

#### A3. 刀光剑影

- 入口：[TapTap app 966587](https://www.taptap.cn/app/966587)，免费 demo 可玩。开发日志两篇：
  - [Tripo 模型与引擎动画](https://www.taptap.cn/moment/857691713039240472)：Tripo 骨骼为 Mixamo 命名而引擎用 Bip001，必须同时改 `name` 与 `nameHash` 才能驱动；腿几乎伸直改用两骨 IK 反解髋膝，并附刀光／攻击轨迹失败与修正。
  - [角色蒙皮重构](https://www.taptap.cn/moment/858816523685332190)：换渲染路径时保留原骨架、权重、`HeroAnim` 动作与 `HeroSword` 剑挂点逐字节未动，仅把 41 骨矩阵编码进 128x2 贴图；列出未锁定根因与性能风险。
- 元数据：作者达观的工作室；app 页标注当前版本 5、datePublished 2026-10-20；许可与成本未披露。公开静态截图：[app 截图 1](https://img-tc.tapimg.com/market/images/Fo8s1irhfNTbUOqdKFV0K95CfggT.jpg)／[2](https://img-tc.tapimg.com/market/images/FuZclekd92hzTC6kfu92SIowR2LM.jpg)／[3](https://img-tc.tapimg.com/market/images/FmqC7ZgeECHfZsy6Y1EtEPTMs4KG.jpg)；两篇日志配图：[10-09](https://img2-tc.tapimg.com/moment/etag/FvfPjVihDzWqTvVHoCG78xT5dKzo_20261009184001.png)、[10-12](https://img2-tc.tapimg.com/moment/etag/FlexI61FVKXg42nO4ipcz507vdsI_20261012210940.png)。
- 为什么排第三：两篇日志正好拼出“改名驱动→IK 修腿→蒙皮重构但不动旧动作与挂点”的完整二改链，是本题最直接的机制证据。缺口：需试玩核换渲染路径前后同一攻击的接触时刻与剑挂点是否真的一致；作者未给权重手修工时。

#### A4. Zhaoye 照夜

- 入口：[可玩武侠 Boss 战网页 demo](https://opengame.app/games/wuxia-zhaoye)，桌面键鼠，约 61 MiB 资源。[制作记录](https://opengame.app/blog/wuxia-browser-game-development-zhaoye)（2026-09-16）。
- 作者过程与二改机制：Hunyuan／Seed3D／Meshy 三份无骨架静态模型、71 骨源骨架→75 骨战斗骨架对照、60fps 动作基线、刀与刀鞘独立道具轨、拔刀与收刀接触检查；一次自动权重尝试没有产出任何带权重顶点，后续局部修复手指与领口权重，肩部与宽松衣物仍会折叠。
- 元数据：OpenGame Team 署名，2026-09-16 发布，由 OpenGame 展示；许可与成本未披露。公开静态截图：[character-reference.webp](https://opengame.app/imgs/blog/zhaoye/character-reference.webp)／[zhaoye-airborne-combo.webp](https://opengame.app/imgs/blog/zhaoye/zhaoye-airborne-combo.webp)／[tangdao-grip-detail.webp](https://opengame.app/imgs/blog/zhaoye/tangdao-grip-detail.webp)。
- 为什么排第四：少见的“源骨架到战斗骨架加骨＋道具轨＋接触检查＋局部手修权重”全链细节，且可玩。缺口：属 OpenGame 团队官方展示，不是独立作者；授权与成本未披露；完整实机未看。

#### A5. Graveyard Waves

- 入口：[Scenario 页内可玩单波 diorama](https://scenario.com/explorations/graveyard-waves/)。完整局在 Roblox Studio 打开 place 运行；上传／发布可选，无公开 place。
- 作者过程与二改机制：3D Roblox 波次生存，四类僵尸各约 2,500 三角面／24 骨，38 段动作覆盖 walk／run／attack／hit／death／rise。making-of PDF 复盘：首次把僵尸拆成 6 个刚体部件用代码摆动失败，改蒙皮；每次 Meshy 重绑骨长差至 4%、帧差约 20°，片段按世界空间搬进同一 bind，并单独修武器握把轴／挥击起始跳变／R15 比例。
- 元数据：2026-10-19 首跑，3,766 credits；属 Scenario 团队探索（Claude Code Opus 5.5 执行），不是独立作者；许可与成本口径未明。静态图：[graveyard-waves.webp](https://www.scenario.com/exploration-covers/graveyard-waves.webp)。
- 为什么排第五：最贴近“换武器与接触帧保骨架”的可玩样本，且把重绑后的骨长／帧差量化了。缺口：只有单波 diorama，完整玩法需在 Roblox Studio 打开 place；厂商展示属性，不能当独立作者作品。

#### A6–A10. 次选（同样可玩、过程可读，各缺一块）

| 序号 | 作品 | 原始链接 | 可玩／过程 | 二改机制与缺口 |
|---|---|---|---|---|
| A6 | Korovany | [游戏](https://yunit00.github.io/game-corovans/)／[仓库](https://github.com/yunit00/game-corovans)／[截图](https://github.com/yunit00/game-corovans/blob/main/docs/screenshots/01-village.jpg) | 可玩 Three.js 3D 动作游戏；MIT；HEAD 8f2ccff（2026-06-14），无 release | `AnimationController` 把 idle／walk／run／jump／三段近战／突刺／瞄准／射击／受击／死亡等 30 个逻辑状态用正则映射到 GLB clip；换武器只换 handslot.r 的 mesh，骨架与 clip 完全不动，未刷权重。缺口：护甲 mesh 未绑定；人／AI 分工、提示与成本未公开；未玩。 |
| A7 | 《长风》Long Wind | [可玩](https://jbang2004.github.io/long-wind/)／[仓库](https://github.com/jbang2004/long-wind)／[截图](https://raw.githubusercontent.com/jbang2004/long-wind/main/docs/media/steppe.jpg) | 可玩网页武侠动作游戏；MIT；2026-09-26 开源（9/27 接入 Mixamo 动作） | README 写角色由 Tripo 生成、Mixamo 动捕由 agent 重定向并做 IK 修正、部分攻击为程序化关键帧；附截图与时间线。缺口：许可只覆盖代码，模型／动作来源需逐项核；未玩。 |
| A8 | LANTERN ALLEY | [可玩](https://handbook-lantern-alley.tripo.page/)／[源码](https://github.com/TripoGrowthLab/vibe-gaming-interactive-playbook/tree/main/examples/lantern-alley)／[截图](https://raw.githubusercontent.com/TripoGrowthLab/vibe-gaming-interactive-playbook/main/assets/games/lantern-alley.webp) | 可玩 3D 清版格斗；Tripo 官方 playbook，2026-09-29 随首批示例发布，Prompt v1.1（2026-10-09），本示例用 prompt draft v2；代码／文档 MIT | 6 个已绑定角色、自述 0 人工介入；导出动作被改名且慢数倍时，Agent 逐帧测量后重排时序。缺口：官方展示，0 人工介入需实机核；模型未随仓库提供，不适用 MIT、按 Tripo 账号条款；页面正文直连失败，仅 README／源码可读。 |
| A9 | Hibana | [可玩](https://www.scenario.com/explorations/hibana/)／[封面](https://www.scenario.com/exploration-covers/hibana.webp) | 可玩浏览器 3D 格斗；5 名角色、119 段动作、52 骨骼；3 天（2026-09-30–10-02）；许可未披露 | 每条动作先拍 5 秒参考视频→Uthana Video to Motion 写到角色骨架；13 段共用动作复用到全员；按 60fps 重排 startup／active／recovery 并把 hitbox 绑到手脚骨骼。还记录 Yuki 自动绑定成功、已能动，但动作出现背带拉伸、辫子缠结、袖子穿体，随后手工修复（移除 4 条跨髋背带、辫子缩短到 60% 并重绑 6 根骨、每个姿势把肩沿相机轴推开）。缺口：Scenario 自家 agent 展示，不是独立作者；许可与成本口径未明。 |
| A10 | Crowned in Steel | [Steam demo](https://store.steampowered.com/app/3525110/)／[Cascadeur 访谈](https://cascadeur.com/blog/general/indie-spotlight-crowned-in-steel)／[截图](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2679830/d2b2e0ed956d5872b4886730be4fa878ed7eb437/ss_d2b2e0ed956d5872b4886730be4fa878ed7eb437.600x338.jpg) | 可玩 Steam 免费 demo（app 3525110，2025-03-12）；正式版 Coming soon、未发售；两人工作室 Sverun；许可未披露 | 约 270 个动作覆盖拳／单手／双手三类武器与四向攻击，demo 更新又打磨 200 多个角色动作；作者无动画背景，用 Cascadeur AutoPosing、Quick Rigging、复制帧与重定向。缺口：AI 仅是 Cascadeur 辅助，不是生成式整角色；换武器后旧动作与接触时刻需实机核；成本未披露。 |

### B 档：可玩或过程有一缺，留作补充

#### B1. 可玩或过程有缺（逐项标可玩状态）

| 作品 | 可玩状态 | 原始链接 | 过程与机制 | 缺口 |
|---|---|---|---|---|
| 涌现新世界 | 可玩（TapTap PC demo） | [TapTap 956231](https://www.taptap.cn/app/956231)／[第七期日志](https://www.taptap.cn/moment/860289331934269293) | 3D 机甲经营×战棋 Demo，需 TapTap PC 端；Mixamo 旋转轨套机甲 rest 骨架后髋位移仍是人体尺度，出现“面条腿”，修法是关位移／缩放轨、每帧把骨长钉回 rest；按身体分区收权重（髋 0.45、腿 0.58、臂 1.0；walk/run 0.28/0.38，attack oneshot 0.68），躯干按父骨骼局部空间限 10°，soft_plant 软贴地；攻击剪辑曾被走路取消，靠 oneshot 白名单与状态机切换修好。 | 无 GitHub、无许可与成本、无版本号；作者为平台匿名账号；完整战斗与手感未验。 |
| 猫猫盗墓贼 | 可玩（TapTap PC demo） | [TapTap 967563](https://www.taptap.cn/app/967563)／[过程](https://www.taptap.cn/moment/859904656350905753) | Blender＋Rigify 做 idle／走路／冲刺／挖掘四动作，切换后骨骼残留上一动作姿势；作者用 Codex 接 Blender MCP 读工程与动画数据，定位关键帧不全、动作作用域与跨动作污染。TapTap PC 试玩 demo，v1.0.2（2026-10-20）。 | 只有四类动作，无攻击；许可、成本、权重手修工时未披露。 |
| 喵潮·猫语者 | 可玩（TapTap PC demo） | [TapTap 967121](https://www.taptap.cn/app/967121)／[过程](https://www.taptap.cn/moment/860679786505178819) | AI 图／模型→Blender 清理、绑骨、调动画→Unity 接入；作者称“模型摆着和真正跑起来是两回事”，服装、UI、场景分开迭代，披露 AI 参与编程／测试脚本／图片并由人修订；v1.0.20261019，有 TapTap PC 试玩。 | 无逐动作清单与权重细节；许可与成本未披露。 |
| 生以此道 | 可玩（TapTap PC demo） | [TapTap 961070](https://www.taptap.cn/app/961070)／[美术日志第 3 期](https://www.taptap.cn/moment/859214192178103840) | 2.5D 生存策略，v0.0.1（2026-10-21），TapTap PC 试玩；只做左右两方向，idle 2 帧＋walk 4 帧，或 Spine／DragonBones 骨骼拆分；AI 批量草稿／变体／关键姿态，人修脸／衣／比例／线宽并导入 Godot 实机。 | 未写 attack；成本、许可、素材权利未披露；只有 1 张有效静态截图。 |
| Hollow Crown | 可玩 | [可玩](https://rehan-remade.github.io/hollow-crown/)／[仓库](https://github.com/rehan-remade/hollow-crown)／[截图](https://github.com/rehan-remade/hollow-crown/blob/main/media/screens.png) | Unity 6 像素 RPG，5 职业各一套图，`pipeline/rpg-class-*.js` 用 Canvas 画帧烘 sheet；同一角色要求 idle 2–4 帧、run 4 帧、attack 3–4 帧及 cast／skill 等；`rpg-class-hero.js` 的 ANIMS 只追加新帧并注明保持旧帧索引稳定（L296），提交 c961782 换招式时旧帧索引与其余动作未破；每帧输出 hand anchor 供武器挂点。MIT，v0.1 2026-09-24／v0.2 2026-09-26。 | 2D 帧动画，不是 3D 骨骼；AI 生成美术的再分发授权、人工修图量、成本未单列。 |
| Mouse Quest | 可玩 | [可玩](https://mykkro.github.io/mouse-quest/game/)／[仓库](https://github.com/mykkro/mouse-quest)／[截图](https://github.com/mykkro/mouse-quest/blob/main/docs/images/game.png) | Three.js 老鼠跑酷原型，10 条路线；`models/rat/pipeline/clips.py` 每个 clip 是纯函数 `(t, rig) -> pose`，固定骨架＋IK 腿，已定义 Idle／Sniff／Walk／Run／Jump_Start／Air／Land／Turn／Rear／Eat／Death。 | 没有攻击；明确是 prototype；mesh 来自第三方资产、权利未确认；代码 MIT；人／AI 分工与成本未写。 |
| 五行残响-2119 | 可玩（TapTap PC demo） | [TapTap 953944](https://www.taptap.cn/app/953944)／[过程](https://www.taptap.cn/moment/860287521173537482) | 不会写代码的作者与 AI 做的 Roguelike 动作游戏，日志给移动／格挡／闪避／切属性教学房、22 段剧情与 100 张卡配对；2026-10-17 有 TapTap PC 试玩。 | 未公开骨骼／逐帧修补细节；许可与成本未披露。 |
| 群侠传：幸存者 | 可玩（Steam EA） | [Steam 4957110](https://store.steampowered.com/app/4957110/)／[B 站过程](https://www.bilibili.com/video/BV1MPMd64EiD/) | 免费 EA、97% 好评（2,314 篇，2026-11-04）；作者 Nenly 自述放弃 AI 直出 sprite 表，改 Seedance 生成动作视频→AE 抠绿幕→逐帧导出→拼图集，生成常卡壳／鬼畜，需人工逐帧调节奏、删废帧；Steam 已披露 Codex／Claude Code、图像、Seedance、Suno、ElevenLabs 分工；成本约 1,000 美元。 | 2D 帧动画，无骨骼／换装证据；逐帧修补是主工作量，但未给工时。 |
| 小王子：星辰之旅 | 可玩（浏览器） | [littleprince.dev](https://littleprince.dev/) | 可玩桌面浏览器 3D 叙事游戏（需 WebGPU、8 语言）；作者 Sac 称 16 天完成，中文报道转述 T-pose 四视图→Tripo→Auto-Rig Pro 绑骨蒙皮→Mixamo 动作→Opus 5.5 在 Blender 调 IK 与接触动作，接触处仍需回 Blender 防穿模、手脱离；X @Saccc_c 2026-10-13 公布。 | 攻击动作、成本与 IP 许可未公开；作者 X 原帖未直接读到，只能经 36kr／uisdc／Tripo 博客转述。 |
| 你这手机保修吗？ | 可玩（TapTap demo） | [TapTap 970900](https://www.taptap.cn/app/970900)／[日志](https://www.taptap.cn/moment/861019895964368901) | 21 天 Jam 的 AI 客服养成 Demo（2026-10-20，9.5 分／11 条评价）；在同一个 Spine 角色里画不同皮肤，两套预设皮肤已接入并复用同一套骨骼动画跑通。 | 只有对话／换装，无攻击；Spine 源文件与许可未公开。 |
| 身法大师测试 | 可玩（TapTap demo） | [TapTap 781760](https://www.taptap.cn/app/781760)／[日志](https://www.taptap.cn/moment/728643876306290986) | 2D 平台跳跃 Demo（2025-10-28，8.7 分／3 条评价）；AI 生成人物人工修改后拆件、Spine 绑骨，状态含大小跳、受伤前／后、死亡；估两段 8 小时完成角色逻辑＋形象＋绑骨、再两段 8 小时做完全部动画。 | 无攻击／换装证据；成本只给工时估计，许可未披露。 |
| 破碎世界：远征 | 可玩（TapTap demo） | [TapTap 954438](https://www.taptap.cn/app/954438)／[日志](https://www.taptap.cn/moment/858508351015750223) | 可试玩 Demo（0 条评价）；作者原想做骨骼动画，AI 生成结果却是身体部件分离、闪烁移动；退而做序列帧时 AI 只让整张小人图来回移动，最终暂时接受。 | 负例，无可用成套动作；许可与成本未披露。 |
| 武来 | 可玩（浏览器） | [可玩](https://arxun.github.io/wulai/)／[制作文](https://juejin.cn/post/7703408069258264614) | AI＋Three.js 浏览器 3D 动作游戏，可在线试玩；制作文记录生产包循环依赖、移动端加载卡死、GLB 节点被压平等工程坑。 | 角色绑定／动画细节少，适合作可玩性对照而非动作二改主例。 |
| 关于一对情侣在古代打僵尸的这件事 | 可玩（B 站 Toy） | [B 站 Toy](https://www.bilibili.com/toy/qinghe-couple-survivors) | B 站 Toy 可点开即玩（PC／移动，1.0 测试，2026-10-12 起），14 天、1 人＋ChatGPT／Claude Opus、Godot＋Blender 做完；连续发布“第五天：战斗实机”“24 小时 500 人试玩”。 | 角色动画来源（Mixamo／手 K／程序化）与是否刷权重未公开。 |
| 旧梦机斗场 | 可玩（TapTap 试玩页） | [B 站 BV1Mzn86DEWR](https://www.bilibili.com/video/BV1Mzn86DEWR/) | 3 天用 AI 完成玩法构思、像素美术、程序、打包并上架 TapTap 的像素动作生存游戏，TapTap 有试玩页。 | 作者说后续发制作过程，当前未披露角色动画细节。 |
| 冒牌缪斯：灵感一击 | 可玩（TapTap PC demo） | [B 站 BV1Vrnm6VEJq](https://www.bilibili.com/video/BV1Vrnm6VEJq/) | 21 天 AI 参与的聚光灯 GameJam 作品，TapTap 有 PC demo。 | 视频只讲预告片剪辑，未披露角色／动画流程。 |
| 元气骑士3D版 | 可玩（B 站 Toy） | [B 站 Toy](https://www.bilibili.com/toy/SoulKnight3D/index.html)／[视频](https://www.bilibili.com/video/BV1Te3s6jETF/) | B 站 AI 创造公开赛二等奖、Toy 点击即玩的 3D 第一人称同人动作游戏，作者扎克鸡用 Codex 与 AI 生成模型／素材。 | 公开材料没有角色动作制作细节，只作可玩动作游戏对照。 |
| 波兰球：黑色启示录 | 可玩（Steam Demo） | [Steam 4093260](https://store.steampowered.com/app/4093260/)／[B 站过程](https://www.bilibili.com/video/BV1N5x56nEdF/) | 波兰球动画作者转独立游戏，明确 AI 只加速程序、美术／策划／剧情保留个人风格；Steam 有 2025-10-22 免费 Demo 与正式页 3614970。 | 角色为球体，未见成套骨骼动作细节；适合核 AI／人工分工而非动作管线。 |
| 还潮-雾镇夜行（Huanchao-Nightwalk） | 可玩（Windows 构建） | [仓库](https://github.com/sparklecatta-lang/Huanchao-Nightwalk) | 像素小宝另一款具名 Unity 三维生存动作游戏，黄猫主角有跳跃／空中下砸、三名人形首领有行走动作，Windows 构建可直接下载；作者称两天用 GPT-6 做成。 | 动画来源与权重手修未写；未玩。 |
| Catcopter | 可玩 | [游戏](https://catcopter.com)／[HN 制作说明](https://news.ycombinator.com/item?id=50305320) | 作者 pawelwentpawel 在 HN 说明物体／绑定／动作用 Opus 5.5、难点元素用 Tripo3D、Fable 优化，约一周迭代出可玩多人动作游戏。 | 骨骼数、片段清单、换装／接触细节未公开；只有 OG 静态图。 |
| BrawlBox | 可玩 | [brawlbox.gg](https://brawlbox.gg) | 单张照片→可玩 2D 格斗角色：客户端用用户自己的 OpenAI＋fal key 生成 sprite sheet 与 36 动作，绿幕缝隙检测切片、去溢色、缩放烘图集，再套 CC0 人偶模板；2026-06-10 Show HN。 | 2D 无骨架；依赖用户自带 key；成本与许可未明。 |
| Temple Fist | 可玩（浏览器） | [templefist.vamonke.com](https://templefist.vamonke.com) | 2026-09-29 收录的浏览器拳击：每帧来自 AI 生成视频而非 3D 场景；作者 Varick 用 Claude Code 写大部分代码，assets 由 Martini 逐 clip 生成、只切 visibility 不换 src；Vibe Jam 2026 排 88/945，只有 Jab／Hook／Uppercut。 | 2D 视频帧，不建骨架；不能回答骨架保持。 |
| Scenario · Crimson Tower | 可玩 | [可玩](https://scenario.com/explorations/crimson-tower/) | 可玩浏览器空中战斗 roguelite，剑连段、蹬墙、五层像素场景，页内附制作 PDF 与侧视游戏 skill。 | 作者／团队未明，过程偏薄；厂商展示。 |
| Scenario · Lamplighter | 可玩 | [可玩](https://scenario.com/explorations/lamplighter/) | 可玩 3D 浏览器游戏（提灯自动机在淹没街区收集四枚日火），附 how-it-was-made PDF 与 3D 游戏 skill。 | 角色动作细节少；厂商展示。 |
| Scenario · Iso Cycles | 可玩 | [可玩](https://scenario.com/explorations/iso-cycles/) | 5 角色×8 方向×4 动作（走／跑／待机／攻击）×8 帧，只画 5 个方向其余镜像，附 20 张 spritesheet 与 84 方向帧数据。 | 2D 固定帧，适合核对换角与改动作一致性，不覆盖 3D 骨架。 |
| Scenario · Scroll Courier | 可玩 | [可玩](https://scenario.com/explorations/scroll-courier/) | 2D 像素平台，同一角色 idle／walk／run／转向／交付／庆祝＋NPC idle／receive 共 25 次工作流；记录 24 帧每 4 帧采样导致跑步抖／转向截断，改每 2 帧取 16 帧；镜像会把卷轴换到错手，左向帧单独生成。 | 2D 无骨架；“改装备／朝向不要镜像”可迁移。 |
| Scenario · Theme Swap | 可玩 | [可玩](https://scenario.com/explorations/theme-swap/) | 2D 猫咪叠叠乐；同一批猫、位置、碰撞体与跑步循环在万圣节／圣诞只换服装与背景，靠保留原画布、部件文件名与偏移让旧动画落回；585 CU／35 次生成。 | 2D 换皮样本，不覆盖 3D 骨架与攻击接触。 |
| Scenario · Pit Tactics | 可玩 | [可玩](https://scenario.com/explorations/pit-tactics/) | 2D 等距战棋；10 单位各 idle／walk／attack／death，5 种僵尸由人类精灵编辑而来，Kling V3 出片后本地脚本找 loop、去洋红、固定调色板并镜像补方向。 | 2D 固定帧；同族角色共用动作的取舍可参考。 |
| PIT NINE | 可玩 | [可玩](https://handbook-pit-nine.tripo.page/)／[源码](https://github.com/TripoGrowthLab/vibe-gaming-interactive-playbook/tree/main/examples/pit-nine) | 3D 俯视竞技场射击；只有玩家角色走 Tripo Auto Rig 骨架，猎犬与 Boss 拆部件由代码转铰链，每打掉一个部件少一种攻击；按 L 切第二套贴图；README 写按原模型实测 `player_armfix.json` 防手臂穿体、换模型必须重测手臂。 | 模型未随仓库提供；拆部件不是换装；官方展示。 |
| Snowdrift Dash | 可玩 | [可玩](https://handbook-snowdrift-dash.tripo.page/)／[源码](https://github.com/TripoGrowthLab/vibe-gaming-interactive-playbook/tree/main/examples/ski) | 3D 滑雪小游戏；Tripo Auto Rig 后取 idle、defeat_02 与 Text-to-Motion 的 ski_glide 三段；README 记录每换一个生成模型都要重测手臂并写 `skier_arms.json` 修正穿模。 | 只有三段动作；模型未随仓库提供；官方展示。 |
| Grimhollow: Molten Depths | 未验证（play 页 000） | [仓库](https://github.com/carlomigueldy/grimhollow-molten-depths) | 可玩 Three.js ARPG：两名主角走 Meshy 文生 3D→自动绑定→动作库 idle／attack，杂兵直接复用 Boss 骨架缩放染色，README 公开 API 步骤与 122 credits；play 页在本机被 Vercel 网络拦为 000。 | 可玩页未验证；人类手修量未写；复用 Boss 骨架缩放是取巧而非换装。 |
| Cloudgarden（Tripo CLI） | 未验证（play 页 000） | [仓库](https://github.com/kendrekaran/cloudgarden-tripo-cli) | 可玩探索游戏，Tripo CLI 生成 16 个资产；仓库带 asset-ledger、400 credits 账本与 `scripts/repair-locomotion.mjs` 修循环／脚滑；play 页本机 000。 | 可玩页未验证；角色动作细节少于 A 档。 |
| Embervale | 未验证（play 页 000） | [仓库](https://github.com/carlomigueldy/embervale) | 可玩浏览器动作游戏（Grok 4.5 产出），角色／怪物用程序化骨架各带 idle／walk／sidestep／dash／attack／hit／death 全套动作；play 页本机 000。 | 程序化动作，不回答 AI 生成动作的骨架保持；可玩页未验证。 |
| Coronach（原 LATTICE） | 无构建（需 Unity 打开） | [仓库](https://github.com/Ohallik/Coronach) | Unity 动作 RPG 切片：50 个 Meshy 模型＋CC0 Quaternius 动作库剥骨架重定向，`docs/ANIMATION_DIRECTION.md` 记录逐 clip 修根朝向、拆 walk／jog／sprint 与战斗动作、修装备挂点。 | 未附构建，需按 README 在 Unity 6000.4.7f1 打开；未实机。 |
| 一壶江湖 | 无入口（暂无公开试玩） | [B 站 BV14MxW6LEXR](https://www.bilibili.com/video/BV14MxW6LEXR/) | 2026-11-01 的 3D 武侠 RPG 开发实录，展示概念图→立绘→Tripo 模型→入游戏角色管线与 Mixamo 动作，并把“角色会自己移动”列为踩坑。 | 暂无公开试玩；动作二改细节有限。 |
| LEAF | 完整实机（通关视频） | [B 站 BV1xuHb6LEiR](https://www.bilibili.com/video/BV1xuHb6LEiR/) | 2026-10-06 发布的 20 天单人作品，Godot＋Codex＋Blender＋Tripo 全流程并有完整通关实机。 | 主角是叶子，骨架与换装相关性弱。 |
| 螂娘来袭 | 可玩（TapTap PC demo） | [TapTap 955461](https://www.taptap.cn/app/955461)／[过程](https://www.taptap.cn/moment/860951779351725385) | Q 版二头身自动绑骨当天失败（触角／翅膀无独立骨、四个动作全需手调），作者改走正面参考锚定转面→绿幕视频→抽帧→脚本抠像／去溢色／循环检测／拼精灵表；TapTap PC 有试玩 DEMO。 | 是“AI 帧动画不稳、人工逐帧修补”的反例与替代管线；无骨骼成品与攻击细节。 |
| 余烬赎光 | 未验（TapTap 页） | [TapTap 725698](https://www.taptap.cn/app/725698) | 螂娘来袭同工作室（五三游戏工作室）的传统单机平台跳跃项目，主角需要成套跑跳动作，可用来核对该工作室传统项目与 TapTap 制造 AI 管线的角色动作是否同源。 | 未见 AI 角色动画制作过程；无攻击／换装证据。 |
| 卡牌风暴 | 可玩（TapTap 页） | [TapTap 904794](https://www.taptap.cn/app/904794) | 同工作室用 TapTap 制造生成的割草式自动射击 Roguelike（8.3 分），角色有持续移动、开火与受击表现，是这条作者线上最接近成套战斗动作的 AI 产物。 | 无逐动作与权重细节；许可与成本未披露。 |
| 文字乱斗 | 可玩（TapTap 页） | [TapTap 980297](https://www.taptap.cn/app/980297) | 聚光灯 GameJam 动作类 8.5 的类幸存者，角色动作与背包／法术编程绑定，可作为同 jam 里除五行残响外的第二个动作向样本。 | 无角色动画制作过程；只作可玩性补充。 |
| 零号su《一个木头人，怎么变成16个角色》 | 无入口（未放出） | [B 站 BV1dbxc6aEyU](https://www.bilibili.com/video/BV1dbxc6aEyU/) | 2026-10-29 开发日记第 1 期：同一木头人拆 17 个槽位（头／发／衣／帽／武器），换装后 8 方向的走路／攻击／挨打动作自动同步、部件可单独换色。 | 作者尚未放出游戏或试玩，只作“换装保旧动作”的机制线索。 |
| 易九夏《开发者日志02｜美术测试》 | 无入口（无游戏页） | [TapTap moment](https://www.taptap.cn/moment/860671092597984588) | 统一身体＋共用骨架的量产 NPC 方案：AI 建模出 A-Pose 素体→Blender 修整→装骨测试走／跑／抬手，再替换头发／眼／衣／鞋并由程序随机组合；明确列出身高 4.5–5.5 头身会改步幅／脚滑、换装必须不穿模两条风险。 | 尚无游戏页或试玩，属机制线索。 |
| After the Wind | 无入口（仅二手转发） | [sorenxet 二手总结](https://x.com/sorenxet/status/2114126731711750156)（2026-10-24，46.7s，文末注明 Built by afterthewinddev）／[Stefan 3D AI 二手报道](https://x.com/Stefan_3D_AI/status/2112130671015874614)（2026-10-19，24.6s，称 Ragnarok Online meets Monster Hunter、5 周 Godot） | 两条都是第三方转发／二手报道，不是作者原帖：一条转述“零编程基础 6 周用 Claude Opus 5.5＋Godot 做完”，工具分工为 Opus 5.5 写大部分代码、Codex／Astra 出参考图与资产、Tripo P2 做大 3D 模型、Godot 做工具与游戏本体、Blender 做小道具、Cascadeur 做动画；另一条给 38.5B tokens／112k tool calls。ElevenLabs 音效只出现在该帖引用的另一条 Ori 风平台跳跃帖（2113999879122850159，sorenxet 自己的项目），不属于 After the Wind。**58 骨骼、22 段动作、$400/月、企鹅 Boss 未在所引两帖正文出现，也未找到 afterthewinddev 原帖，按未核二手处理，移出作者过程。** | 未找到可玩页，只有第三方转发与二手报道；24.6s 短片不能替代完整实机；评论区与作者原文未读。 |
| Epic Boss Titan | 未验证（链接 000） | [X chongdashu 帖](https://x.com/chongdashu/status/2109278486015914364) | 2026-10-11 发布的多部件 Boss 泰坦：拳头／头／船／胸分别出参考图→Tripo 转 3D→Blender 绑骨，Claude Opus 5.5 辅助编码、ElevenLabs 音效；作者给出可玩链接 `tidebreaker.vercel.app`（本机连接失败）。 | 动画只有“Blender 绑骨”一层信息，骨骼数／片段数未公开；可玩性未验证。 |
| 木马人 3D 武侠 ARPG | 无入口（链接未解析） | [X 原帖](https://x.com/cnyzgkc/status/2108159853533466672) | 作者用 Tripo Smart Mesh P2.0 原生四边面＋自动绑骨＋预设动作＋Claude Opus 5.5／Three.js 做浏览器武侠 ARPG；自述生成模型静态好看但抬腿大腿拉成三角形、出拳手臂扭曲，换四边面拓扑后改善。 | 可玩构建链接未解析出；动作接触与换装细节未写。 |
| 像素小宝的 AI 3D 动作游戏 | 无入口（只有演示） | [B 站 BV1XxHw6UE9w](https://www.bilibili.com/video/BV1XxHw6UE9w/) | 5:15 实机演示，简介写场景由大语言模型与 3D 建模 AI 生成、动作来自 4 个动作包并与 UE GAS 场景动作混合；同作者另发 8 方向帧动画与视频生成复杂连招。 | 未公布游戏名或可玩入口；动作来源与混合机制是强线索。 |
| ZZ是画渣的 VibeCoding 滑板游戏 | 无入口（只有线索） | [B 站 BV1aaez6WED9](https://www.bilibili.com/video/BV1aaez6WED9/) | 把真实 3D 角色与整套 Mixamo 动画接进 three.js：In Place、Keyframe Reduction=None、30fps、至少一份带皮肤动画文件，并强调玩法与动画深度绑定时一开始就用真模型，否则替换会牵一发动全身。 | 可玩构建未在页面给出；只有接入约束线索。 |
| 茙凛 | 无入口（只称小样） | [B 站 BV12LJC6SEKj](https://www.bilibili.com/video/BV12LJC6SEKj/) | 作者先试 AI 生成 Spine 骨骼动画失败（走路像人形自走机甲），改为绿幕视频→Premiere 超级键→PNG 序列→AI 拼图降色阶，5 小时并手工修裤脚灰边；动作含走／跑／跳／蹲／坐／速写／看手机，站蹲坐三姿各带拿出与收回，右手握笔不能水平翻转。 | 未找到公开试玩入口（只称小样第 5 版）；逐帧修补证据细。 |
| 大兔子球《The Broken Station》 | 无入口（Demo 未公开） | [B 站 BV14CQEB4EFJ](https://www.bilibili.com/video/BV14CQEB4EFJ/) | 2026-04-15 开发前瞻：建筑师转行，用 AI 2D→3D 参考、Meshy／Tripo 生成、Blender Rigify 绑骨、Godot AnimationPlayer 接入，称一下午做出可操控角色。 | 第一关 Demo 只在作者小红书露出，未给公开试玩链接；属开发日志。 |
| Stefan 3D AI 的“梦想游戏” | 无入口（链接未给出） | [B 站 BV1fVx46BETY](https://www.bilibili.com/video/BV1fVx46BETY/) | 作者授权中文频道的 25 天完整复盘：Unity＋TripoAI P2.0 生成角色并自动做骨骼动画、多 Agent 共享 Wiki、先灰盒验证战斗再产角色，含首 Boss、38:35 实机与算力成本。 | 作者称已可玩，但公开试玩／商店链接未给出。 |
| 超级反派实验室 | 仅预约 | [TapTap 977867](https://www.taptap.cn/app/977867)／[日志](https://www.taptap.cn/moment/860375735766879585) | 仅预约、无试玩；无专职美术团队，角色立绘 AI 生成后由单张立绘直接生成帧动画，每名角色只做移动／攻击／死亡三套，难点在统一画风与动作姿势。 | 不满足可玩条件，只作“成套三角色动作”机制线索。 |
| 山灯行 | 无入口（待核） | [B 站 BV1Xpx46aEik](https://www.bilibili.com/video/BV1Xpx46aEik/) | 仙侠动作 RPG 实机展示御剑／控火两套玩法与装备、法宝养成，作者称借 AI 做出可走可试招的开发中版本、准备上 B 站 Toy；另有战斗实机 BV1n9xQ6EEH2。 | 截至 2026-11-01 未见公开试玩入口，可玩性待核。 |
| 肥特游戏 3D 武侠项目 | 无公开试玩 | [B 站 BV1L5xm6bErg](https://www.bilibili.com/video/BV1L5xm6bErg/) | 3D 武侠项目日志：ChatGPT／Claude 驱动 Blender 动作、AI 白模参考视频、按视频复刻三条路线都未产出可用战斗动画，最后回 Blender 手工 K 帧，片尾给完整打斗演示。 | 无公开试玩；是“AI 动作路线失败回退手 K”的反例。 |
| 神躁动《黑神话》大头复刻原型 | 仅演示 | [B 站 BV1mBpJ6tESy](https://www.bilibili.com/video/BV1mBpJ6tESy/) | 无编程基础作者用 Claude 写代码、Meshy 生成模型与动画、Codex 测试，在手机上复刻《黑神话》大头战的动作／场景／声音替换原型，并展示自动战斗。 | 只有演示、无公开构建。 |
| 蓝天果汁Sorajuice 无名动作游戏 | 仅演示 | [B 站 BV1kpWw6BE8a](https://www.bilibili.com/video/BV1kpWw6BE8a/) | UE 三年经验作者用 GPT-6 做动作游戏，从灰盒推进到二次元 Boss 战并计划 10 多个武器／人物，连续日志展示连招与龙切换。 | 只有演示片段、无试玩构建。 |

#### B2. 过程强但可玩／实机可达性未验

| 作品 | 原始链接 | 过程与机制 | 缺口 |
|---|---|---|---|
| Dynasthir | [Steam demo 4002260](https://store.steampowered.com/app/4002260/Dynasthir_Demo/)／[正式页 2145210](https://store.steampowered.com/app/2145210/Dynasthir/)／[Cascadeur 访谈](https://cascadeur.com/blog/view/indie-game-spotlight-dynasthir) | 两人动作 RPG，2025-11-14 已发售并有免费 demo；访谈记录 Ulfgang 的手工关键帧／AutoPosing／AI 补间分工，敌人与玩家共用 Adrenaline 招式时另做同风格变体；发售后补丁仍改格挡动作保真、收剑／装备隐藏与大剑视觉。 | AI 仅为 Cascadeur 补间／物理辅助，不是生成式整角色；访谈未给权重手修比例与成本。 |
| Bring It | [Steam demo 4654970](https://store.steampowered.com/app/4654970/)（Bring It Demo，2026-05-11）／[正式页 4146080](https://store.steampowered.com/app/4146080/Bring_It/)（Coming soon）／[Cascadeur 访谈](https://cascadeur.com/blog/view/indie-game-spotlight-bring-it) | Team Machiavelli 首个 3D 游戏：Cascadeur AutoPosing／Quick Rigging 自动识别骨架、用一次 AI 补间做过场，再经 Cascadeur→Blender→Unity 把角色、NPC 与无骨骼载具接进 Unity；Steam 有可下载 demo。 | 载具与角色动作的接法未细写；换装后旧动作是否保持未验。 |
| Navy Island Confidential | [Steam 4153730](https://store.steampowered.com/app/4153730/)／[第 10 周日志](https://goblingames.fr/devlog-eng/week10.html) | 已发售且有 Alpha Demo；主角用 Meshy 6 生成后人工重拓扑、展 UV、清贴图并烘焙，再做自动绑定与动画；第 10 周日志明确写戏服肩部开口导致顶点权重问题、动作不顺；Meshy 两代生成。 | 类型是点击冒险而非动作，无成套攻击；可作角色管线与换装权重参考。 |
| Depthbound | [仓库](https://github.com/Augustforge/Forge_Depthbound_mobile_dungeon_game) | Godot 4 手机 3D 动作 roguelike，角色模型和动画都走 Meshy；README 记录约 1,100 行俄文设计文档、单次约 1.5 小时 agent 制作、MIT 许可和 Windows／Android／macOS 可下载包。 | README 未逐项列 idle／移动／攻击，需实机核；AI 生成动作的骨架保持未写。 |
| Gulliver's Travels（Meshy 系列） | [可玩（CDN 版）](https://cdn.meshy.cn/landing-assets/3d-games/gulliver/latest/index.html?lang=en)／[官方页（本机 000）](https://www.meshy.ai/3d-games/gulliver) | 可玩冒险游戏，Gulliver 由 Meshy 自动绑定并带 25 个动作（走／跑／潜行／跳／游泳／剑斩／连击／踢／翻滚），作者 jk（Defiabell）；8 个模型共用动作库。 | 未列独立 idle；无发布日期；厂商展示。 |
| Rescue Raid | [可玩（CDN 版）](https://cdn.meshy.cn/landing-assets/3d-games/rescue-raid/latest/index.html?lang=en)／[官方页（本机 000）](https://www.meshy.ai/3d-games/rescue-raid) | 可玩 3D 像素射击，机器人有 idle／walk／run／walk-shoot／run-shoot，村民有 wave／cheer，全部套 Meshy 库动作且页面明说不逐帧，作者 Qinghe Ban。 | 厂商展示；无独立 devlog 与版本。 |
| Gnome Garden Defense | [可玩（CDN 版）](https://cdn.meshy.cn/landing-assets/3d-games/gnome-garden/latest/index.html?lang=en)／[官方页（本机 000）](https://www.meshy.ai/3d-games/gnome-garden) | 可玩守塔游戏，侏儒有 idle(4s)／walk／run／铲击／受击／倒地／胜利，自动绑定后套库动作，作者 Raybo；8 个模型逐角色自动绑骨并共用动作库。 | 厂商展示；多角色同骨架复用可核，但无人工修补记录。 |
| Bouncy Castle Dash | [可玩（CDN 版）](https://cdn.meshy.cn/landing-assets/3d-games/bouncy-castle-dash/latest/index.html?lang=en)／[官方页（本机 000）](https://www.meshy.ai/3d-games/bouncy-castle-dash) | 可玩派对游戏，6 个布偶角色有 run／跑跳／cheer／wave／腹部滑铲攻击；页面称 4 个库动作＋4 个文生动作、自动绑定。 | 文生动作是否真实可用与人工介入量未写；厂商展示。 |
| Sushi Chop | [可玩（CDN 版）](https://cdn.meshy.cn/landing-assets/3d-games/sushi-chop/latest/index.html?lang=en)／[官方页（本机 000）](https://www.meshy.ai/3d-games/sushi-chop) | 可玩切寿司游戏，猫厨师有 idle／cheer／bow／shrug 加投掷／芥末反应，库动作与文生动作混用且关键时序手工 K 帧，是这批里 AI／人工分工写得最清楚的一例。 | 厂商展示；无版本与作者独立过程。 |

### C 档：机制源与对照（不是新游戏候选）

这些条目不满足“有完整作品＋作者过程”的候选条件，只用于回答“动作从哪来、为什么坏、换装/换骨架时哪里会断”。每项保留原始链接与可借点。

| 类别 | 条目 | 原始链接 | 可借点与边界 |
|---|---|---|---|
| 动作库／自动绑定 | Meshy Animation Library | [中文站镜像（可用）](https://www.meshy.cn/animation-library)／[官方页（本机 000）](https://www.meshy.ai/animation-library) | 631 条片段（Walk&Run 150、Fighting 146、Daily Actions 155 含 Idle），绑定后直接选，骨架用 Mixamo 命名；是 idle／移动／攻击三组动作来源和“固定骨架”的直接证据。 |
| 动作库／自动绑定 | Meshy Auto-Rigging | [中文站镜像（可用）](https://www.meshy.cn/features/ai-auto-rigging)／[官方页（本机 000）](https://www.meshy.ai/features/ai-auto-rigging) | 约 30 秒自动绑定、Mixamo 命名、权重和骨骼可编辑，支持 Unity Humanoid／UE／Godot；明确 T/A 姿势、拓扑和异常比例仍需人工。 |
| 动作库／自动绑定 | meshy-dev/game-asset-pipeline | [链接](https://github.com/meshy-dev/game-asset-pipeline) | Unity 用 Humanoid Avatar 自动映射并建 Idle／Walk／Run Animator，UE 用 IK Retargeter 对 Mannequin；对应换骨架／共用旧动作。 |
| 动作库／自动绑定 | Tripo Animation Retarget API | [链接](https://developers.tripo3d.com/en/docs/animations-retarget) | 预设 idle／walk／run／slash／hurt 等，一次最多 5 条、支持 in-place 和 glb／fbx；批量给固定骨架套动作的 API 面。 |
| 动作库／自动绑定 | Tripo Rig／Animation API 文档 | [链接](https://developers.tripo3d.com/en/docs/animations-rig) | v1.0 只支持双足、v2.5 面向非人形、v3.0 才推荐人形；只有 biped 支持 tripo／mixamo／actorcore／unity／unreal／vrm 预设，需先 rig-check，输入限 GLB／FBX／OBJ／STL 且 ≤150 MB。 |
| 动作库／自动绑定 | AnimationGPT | [链接](https://github.com/fyyakaxyy/AnimationGPT) | 482 stars、MIT，文本生成游戏战斗动作，CombatMotion 数据集、SMPL／HumanML3D 流程、可导出 BVH；补“攻击动作从哪来”。 |
| 动作库／自动绑定 | AssetForge | [链接](https://github.com/HErkanuzun/AssetForge) | UE5 文本生动作（Kimodo）＋自动切循环、Blend Space、Motion Matching、UE5 Manny 重定向和脚滑 QA。 |
| 动作库／自动绑定 | HY Motion Studio | [链接](https://github.com/wa-ys/HY-Motion-Pipeline) | 把 HY-Motion 文生动作／视频动捕重定向到 Mixamo、UE4／UE5、3ds Max Biped、Unity Humanoid，可一键交给 Blender／Cascadeur／Unity。 |
| 动作库／自动绑定 | HY-Motion 1.0 | [链接](https://github.com/Tencent-Hunyuan/HY-Motion-1.0) | 2025-12-30 开放推理代码与预训练权重，十亿参数 DiT＋Flow Matching 直接生成骨架动作。 |
| 视频驱动角色 | Wan-Animate-2 | [链接](https://github.com/Wan-Video/Wan-Animate-2) | 2026-08-07 开源（Apache 2.0），直接用驱动视频喂 DiT，去掉中间骨架／姿态提取，支持卡通、机器人、动物与多角色同镜；替代“不绑骨、用视频驱动”路线。 |
| 视频驱动角色 | Wan-Animate 官方项目页 | [链接](https://humanaigc.github.io/wan-animate/) | 官方页与 arXiv 2509.14055 给出骨架控制、Relighting LoRA 和“仅限学术研究演示”限制。 |
| 视频驱动角色 | Wan2.2 Animate 官方预处理说明 | [链接](https://github.com/Wan-Video/Wan2.2/blob/main/wan/modules/animate/preprocess/UserGuider.md) | Animation Mode 强烈建议姿态重定向，但结果“不保证完美”；Replacement Mode 默认关重定向，体型差异大会出伪影／变形，并要求先用前视伸展姿势。 |
| 视频驱动角色 | ComfyUI-WanVideoWrapper #1251 | [链接](https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/1251) | 用户报告人脸被压扁、时长／帧对齐错位；维护者称预处理“held together with duct tape”，包装器用旧姿态估计且未实现官方预处理；72 条折叠评论未展开。 |
| 视频驱动角色 | VACE | [链接](https://github.com/ali-vilab/VACE) | 4k stars 的 all-in-one 视频生成／编辑，Move-Anything／Animate-Anything／Swap-Anything；issue 评论里与 Wan Animate 对比的重定向／换人替代。 |
| 视频驱动角色 | Lucy-Edit-ComfyUI | [链接](https://github.com/DecartAI/Lucy-Edit-ComfyUI) | 指令式视频编辑，保留原视频运动与构图，换装／换角色效果最强，可把旧动作迁到新装备或新角色。 |
| 视频驱动角色 | ComfyUI-WanAnimatePreprocess | [链接](https://github.com/kijai/ComfyUI-WanAnimatePreprocess) | 把 Wan Animate 的 ViTPose、人脸裁剪、SAM2 关键点预处理做成 ComfyUI 节点。 |
| 视频驱动角色 | ComfyUI-WanAnimatePlus | [链接](https://github.com/wuwukaka/ComfyUI-WanAnimatePlus) | 多参考图＋21 帧转场＋长视频／低显存，正对 issue 里长片接缝、时长错位和长视频退化。 |
| 视频驱动角色 | AI-Time2Move-Comfyui | [链接](https://github.com/rik-python/AI-Time2Move-Comfyui) | 用轨迹或 Nuke blocking 给 Wan 2.2 Animate 确定性运动控制，替代模型自由发挥，适合固定连招复现。 |
| 视频驱动角色 | BetaSwap | [链接](https://github.com/stark622/ComfyUI-WanAnimate-SAM3DBody-BetaSwap) | 用 SAM 3D Body 把驱动者体型／服装轮廓贴到参考角色并保留驱动姿态，直接对应换体型、换装备仍保旧动作。 |
| 重定向工具／流程 | Cascadeur Retargeting 文档 | [链接](https://cascadeur.com/help/category/219) | 源／目标都必须有 AutoPosing rig、必须竖直对称且非动画姿势、Point Controller 层级要一致；重定向总是作用于整个角色，Fulcrum 视为固定会抹掉刻意的脚滑。 |
| 重定向工具／流程 | Cascadeur Import Animation from UE | [链接](https://cascadeur.com/help/getting_started/import_fbxdae/import_animation_from_ue) | 明确写“即使骨架相同，把动画套到另一模型也会变形，需 Retargeting”，并给 FBX 轴与 IK 关节要求。 |
| 重定向工具／流程 | Cascadeur Using Mixamo Rig | [链接](https://cascadeur.com/help/getting_started/import_fbxdae/using_mixamo_rig_in_cascadeur) | 官方 Mixamo 标准骨架接入说明，可作“固定一套骨架、跨角色复用动作”的基线。 |
| 重定向工具／流程 | Cascadeur 2025.1 AI Inbetweening | [链接](https://cascadeur.com/blog/general/cascadeur-20251-released-faster-animation-workflows-with-ai-inbetweening) | 两姿势间自动生成过渡并改进 AutoPosing／AutoPhysics，是“在已有动作上二改”而非重建整段动作的机制来源。 |
| 重定向工具／流程 | Cascadeur Copy Tools | [链接](https://cascadeur.com/help/tools/animation_tools/copy_tools) | 只复制选中控制器的局部姿态，可跨场景、跨区间粘贴，用于改装备或接触时刻只重做上半身／局部而不动整套动作。 |
| 重定向工具／流程 | cascadeur-mcp | [链接](https://github.com/gprethesh/cascadeur-mcp) | 36 个工具覆盖骨骼／手指摆姿、关键帧、FBX 导入导出与 retargeting 动作目录；作者明确标注 retarget 质量未验证。 |
| 重定向工具／流程 | Blender Cascadeur Real-Time Live Link | [链接](https://github.com/carlosedubarreto/Blender_Cascadeur_RT) | 在 Cascadeur 与 Blender 间实时串流并烘焙关键帧，适合保持同一骨架反复调整动作、即时回看。 |
| 重定向工具／流程 | Godot Mixamo Animation Retargeter | [链接](https://github.com/RaidTheory/Godot-Mixamo-Animation-Retargeter) | 针对 Godot 4.3 的 Mixamo FBX 批量重定向插件，要求模型先做 Bone Mapping 共享骨名。 |
| 重定向工具／流程 | studioigor · 3d-animator-skill | [链接](https://github.com/studioigor/3d-animator-skill) | 端到端角色动画 skill：把角色网格套进动作库骨架获得精确重定向、按位移而非播放速率驱动步态、IK 锁脚，带 ARKit 60fps 口型与数值化 QA。 |
| 重定向工具／流程 | sparklecatta-lang · XSXB-Mocap | [链接](https://github.com/sparklecatta-lang/XSXB-Mocap) | 把已有绑定角色拟合到 AI 生成的双视角视频，骨长固定只解关节旋转，README 直言脚滑／抖动／尾巴跟踪弱并给 IK 锁脚清理法。 |
| 重定向工具／流程 | ref2game | [链接](https://github.com/studioigor/ref2game) | MIT，一张参考图生成浏览器可玩 2D 原型，角色用双骨肢体＋圆关节＋IK 的 cut-out rig，自动检查脚滑、跛行、步幅、膝盖弯曲、拉伸、手臂相位、状态跳变与“刀刃是否在命中帧打到目标”。 |
| 重定向工具／流程 | 2dimg2motion | [链接](https://github.com/WU-HAOTIAN34/2dimg2motion) | MIT agent skill，把单张 2D 角色图做成 14 帧透明序列／图集，覆盖 idle、走、攻击、格挡、受击、死亡、出生、施法；用 identity／topology／prop 锁约束；README 要求人工逐帧看片。 |
| 重定向工具／流程 | Charakuru 开源套件 | [链接](https://github.com/nanocle/Charakuru) | README 明列 5 个人工决策点、9 个 agent skill 和 Tripo／Blender 5.2／VRM 的检查点；自定义许可，商业集成需授权。 |
| 重定向工具／流程 | Charakuru #20 | [链接](https://github.com/nanocle/Charakuru/issues/20) | 发丝组 154 个部件、38,649 面在 UV 回写时因最近顶点落到相邻部件而中止，对应换装／拆件后 UV 与贴图无法回写。 |
| 重定向工具／流程 | Charakuru #23 | [链接](https://github.com/nanocle/Charakuru/issues/23) | 外套与身体共用一个 mesh，改外套权重必须分离网格且可能丢身体权重，正是换装备时保骨架、保旧权重的冲突点。 |
| 引擎／论坛反例 | Godot #89244 | [链接](https://github.com/godotengine/godot/issues/89244) | 第三方 Mocap／Synty 动作重定向后四肢扭曲、像叠在静置姿势上，Mixamo 正常；作者判断源资产不用 T/A-pose 而是首帧作静置。2024-03 由 PR #88824 关闭。 |
| 引擎／论坛反例 | Godot #96153 | [链接](https://github.com/godotengine/godot/issues/96153) | Godot 4.3 给体素角色挂 BoneMap 后旋转轨保留、除 Hips 外的位移轨消失；共用骨架不只改名。 |
| 引擎／论坛反例 | Godot #65656 | [链接](https://github.com/godotengine/godot/issues/65656) | 绑定姿势既非 A-pose 也非 T-pose 时 Fix Silhouette 修不好，SkeletonProfileHumanoid 之外的骨骼会丢数据。 |
| 引擎／论坛反例 | Godot PR #88824 | [链接](https://github.com/godotengine/godot/pull/88824) | 以外部动画库提供可信 rest pose，修复 #65656 与 #89244；是 Godot 投诉对应的具体机制。 |
| 引擎／论坛反例 | Godot PR #76499 | [链接](https://github.com/godotengine/godot/pull/76499) | 修正 Silhouette 使用了错误索引；#65656 评论称合并后 Sketchfab 模型“技术上可用”。 |
| 引擎／论坛反例 | Godot 官方：Animation Retargeting in Godot 4.0 | [链接](https://godotengine.org/article/animation-retargeting-in-godot-4-0) | BoneMap、rest fixer 与重定向设计及限制的官方说明。 |
| 引擎／论坛反例 | Godot 论坛：换模型共用骨架 | [链接](https://forum.godotengine.org/t/swapping-a-skeletons-3d-models-while-having-them-look-normal/140811/9) | 模块化角色必须共用同一骨架，动作放独立 AnimationLibrary；男女或不同比例身体除非骨长一致否则要分开场景，缩放骨架会影响 root motion。 |
| 引擎／论坛反例 | Unity Discussions：Cascadeur→Unity 6 Humanoid | [链接](https://discussions.unity.com/t/humanoid-animation-issues-after-importing-from-cascadeur-to-unity-6-foot-sliding-ground-penetration-animation-jerks/1732647) | 同角色同 Avatar，Cascadeur 里正常的保龄球动作进 Unity 后脚滑、脚穿地、抖动，Generic 比 Humanoid 顺；建议烘焙关键帧、关优化、开 Root Motion／Foot IK，帖主未确认修复。 |
| 引擎／论坛反例 | Epic 论坛：Cascadeur 导出 UE 后动画损坏 | [链接](https://unreal2.epic-prod-us2.discourse.cloud/t/how-to-fix-that-animation/2658251) | 用户报告 UE 5.6.1／5.5.4／5.4 都坏，回复判断为 Cascadeur 模型与 Manny 骨骼朝向不一致，建议先导入新骨架再重定向。 |
| 引擎／论坛反例 | Epic 论坛：Cascadeur 跳跃动画停在原点 | [链接](https://forums.unrealengine.com/t/trying-to-import-a-jump-animation-from-cascadeur-unreal-snaps-character-to-origin-during-whole-animation/604403) | 已解决案例：pelvis 重定向设为 animation scaled 才让角色离地，补出根位移／重定向缩放这一失败维度。 |
| 引擎／论坛反例 | DAZ 论坛：Cascadeur 重定向像黑箱 | [链接](https://www.daz3d.com/forums/discussion/comment/9403536/) | 自动映射比例但可调项少，Daz 骨骼比 UE 多、只能映射子集，建议先用 Blender 做桥；还讨论 Indie／Pro 导出与 A-pose 警告。 |
| 引擎／论坛反例 | Rokoko #98 | [链接](https://github.com/Rokoko/rokoko-studio-live-blender/issues/98) | 给源骨架加自定义骨条目后 Retarget 抛 `KeyError: 'Hip'`，维护者未回复，只能注释掉 `custom_schemes_manager` 或降 Blender 版本。 |
| 引擎／论坛反例 | Rokoko #54 | [链接](https://github.com/Rokoko/rokoko-studio-live-blender/issues/54) | 源／目标静置姿势不一致时重定向失败，带形态键的角色无法改静置姿势；后来靠给源骨架套目标姿势绕过，文档未写。 |
| 引擎／论坛反例 | Blender Artists：Rokoko 双臂交叉 | [链接](https://blenderartists.org/t/arms-crossing-after-rokoko-retargeting-xsens-bvh-mixamo-rig-even-though-both-source-and-target/1649196) | 源与目标都确认是 T-pose 仍出现手臂剪刀交叉，最后查出是手臂骨命名错误而非 bone roll。 |
| 引擎／论坛反例 | Blender Artists：Auto-Rig Pro 手指扭曲 | [链接](https://blenderartists.org/t/issues-with-retargeting-animations-in-auto-rig-pro/1604289/5) | 源动作静置姿势是坐姿，重定向到 ARP 骨架后角色坐不对、手指扭曲；不同来源骨架缺统一采集模板时手指问题常见。 |
| 引擎／论坛反例 | Blender Artists：Auto-Rig Pro Mixamo 手臂拉伸 | [链接](https://blenderartists.org/t/problem-with-retargeting-in-auto-rig-pro/1620640/3) | 按官方文档和视频操作，Mixamo FBX 重定向后左臂仍出现奇怪拉伸；官方流程不等于一次成功。 |
| 引擎／论坛反例 | Blender Artists：Meshy 胖角色重定向变形 | [链接](https://blenderartists.org/t/retarget-fat-game-character/1629759) | Meshy 生成、减面、套人形骨架后重定向 Mixamo 动作，身体严重变形；逐段重刷权重无效，回复指出减面后缺少适合有机变形的拓扑，帖主未再提供文件。 |
| 引擎／论坛反例 | Unity Asset Store：Retarget Pro 评价 | [链接](https://assetstore.unity.com/packages/tools/animation/retarget-pro-240061/reviews) | 文档过时、源／目标姿势要手动对齐（T-pose 对垂臂要逐骨转）、骨骼会突然不动或带动相邻骨、需重启编辑器，Humanoid 支持说明不清；28 条评价正负都有。 |
| 质量／反例 | Rigging Reality Check | [链接](https://rexmarksthespot.com/blog/posts/rigging-reality-check-feb-13.html) | 2026-02-13 一手实测：Meshy 自动绑定 T-pose 尚可，走路时头发像糖浆拉长、手臂穿腿；Rigify 410 骨像纸板，Mixamo 仍有一条腿扭转；人工刷头发／手臂／髋权重每次修好一处又坏另一处，自动检查还报“100% production-ready”。 |
| 质量／反例 | Tripo Auto Rig 再验证 | [链接](https://xn--68jtc1d819rk6e.jp/diary/250016) | 2026-09-26 日文日记：Tripo Humanoid＋Mixamo 骨架左右不对称，ForeArm／Hand 骨 roll 约 56° 对 -123°，还给没有五指的角色生成五指骨；套 Mixamo 后手腕严重扭转，Retry 改善大扭转但手指局部变形仍在。 |
| 质量／反例 | CGJOY：AI 生成角色完整制作踩坑 | [链接](https://www.cgjoy.com/forum.php?mod=viewthread&tid=284303) | 2026-11-02 一手记录：五天用 Tripo＋Charakuru＋3ds Max／Biped 做角色，外套下摆没有骨骼、肩部接缝权重夹紧、裙摆前后权重转错、拇指／食指权重串、FBX 转 Biped 后飘带骨悬空；逐项手工补骨、改权重、重定向。 |
| 质量／反例 | Tripo 多肢体绑定与换装变形投诉 | [链接](https://elsewhere.news/en/funeralai/tripo) | 2026-11-03 用户投诉：多肢体模型只绑了两手两脚、动画把身体拉变形、衣服像皮肤一样跟着变形；同时有自动续费与退款争议。属个人体验文，但有模型／动画截图。 |
| 质量／反例 | 混元 3D Studio v1.1 实测 | [链接](https://blog.csdn.net/qq1198768105/article/details/155393005) | 2026-09-18 一手实测：默认中面数重拓扑把角色手臂优化掉，改高面数后仍有怪元素；首个模型绑定错，低模重试更准，但绑得好的模型反而生成不了动作（疑骨骼连通性）。 |
| 质量／反例 | Tripo 3.0 + Blender 绑定指南 | [链接](https://www.iaifeed.com/how-to-rig-and-animate-tripo-3-0-models-in-blender) | 自动绑定只给骨架和粗权重，肘膝会因权重跨界塌陷、肩髋大旋转会撕裂、手指通常救不回来，需 20–40 分钟刷权重；套 Mixamo／Rokoko 动作会立刻暴露坏权重。 |
| 质量／反例 | 博客园：不同身高比例共用动作检查清单 | [链接](https://www.cnblogs.com/qwzp/p/23498165) | 先比身高与四肢比例，逐角色保绑定基准，再按脚掌滑动／膝变形／手部与目标物接触／肩髋变形逐项记录，最后在下游手修；站点标注可能含商业推广。 |
| 质量／反例 | 博客园：非标准人形自动绑定检查 | [链接](https://www.cnblogs.com/qwzp/p/23229863) | 保留原模与清理版、确认能摆标准 T-pose、开 Bone Display 查骨位、预览多个动作并导出下游复验；额外肢体／极端比例／抽象形体易失败。 |
| 质量／反例 | CSDN：自动绑骨后肩塌臂扭五处排查 | [链接](https://blog.csdn.net/Martina_0321/article/details/167839453) | 关节枢轴、层级／命名／轴向、蒙皮权重、绑定姿势与动画参考姿势、重定向与 root motion 五类，对症给案例；无真实项目，属方法文。 |
| 质量／反例 | B 站：3D 建模、映射、动画踩坑专栏 | [链接](https://www.bilibili.com/opus/1130510330901823488) | 列 Mixamo 绑定前必须 T-pose、骨骼轴向／Z 轴、IK 极向、肩膝权重与衣服穿插等坑，并给 Auto-Rig Pro 重定向步骤；页面返回验证码，仅搜索摘要。 |
| 质量／反例 | CGJOY：PMX 转 CS 骨骼思路 | [链接](https://www.cgjoy.com/thread-272089-1-1.html) | 含 Blender 导出轴向、Bone 列表映射、Biped 体形修正，补旧动作迁到固定骨架的手工段。 |
| 质量／反例 | Product Hunt Meshy 评价 | [链接](https://www.producthunt.com/products/meshy/reviews) | 聚合 4.9/22；可见评价中有用户明确说 T-pose／A-pose 仍难处理、影响绑定和动画，另有拓扑与模型编辑诉求；时间跨度大，属市场侧弱证据。 |
| 质量／反例 | Meshy Trustpilot 评价 | [链接](https://ie.trustpilot.com/reviews/6901c3f33959d27d48f4e113) | 2025-10-29 的 4/5 评价：图像转 3D 和贴图可用，但复杂形体出错（牛生成五条腿），头发／叶子／毛皮未优化不适合游戏，绑定动画“对四足动物很糟”。 |
| 质量／反例 | Epic 论坛：怎么给 Meshy 角色做动画 | [链接](https://forums.unrealengine.com/t/can-anyone-help-me-properly-animate-characters-from-meshy/2725344) | 2026-06 求助帖，用户要人帮把 Meshy 角色正确做成动画；具体 A/T-pose 与肢体朝向问题来自搜索摘要，未读全帖。 |
| 引擎事件 | Arma Reforger 骨架更新公告 | [链接](https://reforger.armaplatform.com/news/modding-update-october-15-2024) | 骨架从 163 根增到 220 根做面部动画，仍用旧骨设置的装备或角色将无法正确动画，部分资产要重新蒙皮；是“改骨架会打断旧装备／旧动作”的生产级实例。 |
| 厂商管线自述 | 腾讯 Motus | [链接](http://www.nadianshi.com/2026/08/419302) | 2026-08-27 科隆演讲实录（腾讯自述，非独立验证）：骨骼生成自动化 50–70%、通用蒙皮 70–85%、加后处理 >85%，复杂服装绑定蒙皮从 3–4 人日降到 1–4 人时；另有任意长度多段文生动作、Video-to-Motion V2 与约 10 亿参数 MIB。 |
| 厂商管线自述 | 3AGameFactory（GameFactory-3A） | [链接](https://github.com/OpenDCAI/GameFactory-3A) | Apache 2.0 的 agent 资产框架，覆盖 T-pose、3D 物体／场景、绑骨＋生成动作＋重定向、音频、CG、玩法与 UI；Unity 格斗 demo 用 Meshy 生成角色再走 Puppeteer＋MoMask；只有录屏 demo、没有可玩构建。 |
| 厂商管线自述 | Square Enix CEDEC 2026 | [链接](https://makegamewithai.com/news/square-enix-ai-game-prototyping) | 2026-07-24 讲者用 Midjourney 参考图→Tripo 模型→Unity 6 拼可玩动作 demo；现场展示 Meshy 角色手臂与外套粘连变形，并引 Mixamo 对居中、默认姿势、额外肢体和大衣物的限制。二手报道。 |
| 非游戏对照 | Bash Fighter | [可玩](https://bashfighter.com/)／[仓库](https://github.com/Bash-Entertainment/bash-fighter)／[截图](https://github.com/Bash-Entertainment/bash-fighter/blob/main/docs/images/gameplay-ffa.png) | 开源 20 人平台格斗，AGPL-3.0；动作不是骨骼动画，而是每个角色的 AnimationParams（idleBreathe、runCycle、windup/swing、attackTimingScale、hitstunShake）＋四招 moveset 与命中框；加角色走数据文件＋校验器，不刷权重也不 K 帧。反面对照。 |
| 非游戏对照 | CapoeiraFlow | [可玩](https://capoeiraflow.xyz/fight)／[过程](https://flowtivity.ai/blog/we-built-a-capoeira-fighting-game-in-the-browser-in-two-days/) | 作者 AJ Awan 2026-10-15 复盘：19 骨骼＋33 体点、83 招／6 架式、150 段循环约 9.4MB；第二个角色换网格后因共用同一骨架，83 招加载即全部可播、无需新动画；同时给无手指骨、倒立／地面动作捕捉失败、62% 击倒需平衡等限制。作者未称 AI 制作，只作机制对照。 |
| 非游戏对照 | Pokémon Claude Red | [claudered.dev](https://claudered.dev/) | 全部精灵、战斗特效和音乐都由代码绘制（0 个图片文件）；2D 精灵没有固定骨架或蒙皮二改环节，只能作“非骨架、全程序化角色套装”的对照。 |
| 非游戏对照 | chongdashu · Castle Clash Duel | [仓库](https://github.com/chongdashu/phaserjs-tinyswords) | 可玩浏览器回合战术原型，红蓝战士／弓手带完整 spritesheet 动作集，README 公开 TinyPRD→技术设计→assets.json→实现的 Claude Code 三 skill 流程；2D 固定帧对照。 |
| 非游戏对照 | Scenario · Same Moves, New Actor | [链接](https://scenario.com/explorations/same-moves-new-actor/) | 同一套嘻哈／剑舞动作重投到 8 个角色、按同一主时钟逐帧对齐；公开“首帧站位必须与源演员一致，否则九条重投全废（1827 CU）”的失败记录。 |
| 非游戏对照 | Scenario · Fully Rigged | [链接](https://scenario.com/explorations/fully-rigged/) | 78 骨身体（每指三节）＋52 个 ARKit 表情＋头发／衣摆次级骨，走-说话、挥手、舞蹈、说话手势由生成视频转骨架并重定向保持脚着地，另附 Blender 手指／脚部修正和 UE／Unity／Godot 截帧。 |
| 非游戏对照 | Scenario · Blender 2D Animation | [链接](https://scenario.com/explorations/blender-2d-animation/) | 同一套脚本复用出红熊猫／黑猫／雪豹三种主题，跑步循环从一条图生视频里抽 9 或 12 帧并逐帧挑最干净循环；记录换皮时动作复用和颜色漂移。 |
| 教程／入口 | 朝忆HEIXIU：AI 工具制作 3D 角色全流程 | [B 站 BV1Z8x56uE2X](https://www.bilibili.com/video/BV1Z8x56uE2X/) | CGJOY 284303 作者开篇说明照此教学实践，视频给 Tripo＋Codex＋Charakuru 的完整原始流程；纯教程，不计候选。 |
| 教程／入口 | 江烨骅：Astra+Tripo 立绘变 3D | [B 站 BV1ore46ZEfD](https://www.bilibili.com/video/BV1ore46ZEfD/) | 逐步展示 Auto Rig Pro 自动绑骨、清权重、再套走路动作重定向；纯教程。 |
| 教程／入口 | 葡萄_好吃吗：Tripo 到 UE5 | [B 站 BV1sTut6yEEa](https://www.bilibili.com/video/BV1sTut6yEEa/) | 从 Tripo 网格到 Blender 对齐、UE5 骨骼与材质实例、再把动画重定向进蓝图；作者承认比例、绑定和材质仍需手工返修。 |
| 教程／入口 | 国庆不放假_：GPT-6 Astra+Tripo | [B 站 BV1PYhk6zE3P](https://www.bilibili.com/video/BV1PYhk6zE3P/) | 一张图生成角色并在 UE 中可操控移动，Blender 辅助绑骨后做 UE 重定向；纯教程。 |
| 教程／入口 | 迟老师-Unity3D：Tripo 生成角色 | [B 站 BV1mkEgzuELm](https://www.bilibili.com/video/BV1mkEgzuELm/) | 39 集 Unity＋AI 独立游戏实战合集的一集，讲 Tripo 角色导入工程；纯教程。 |
| 教程／入口 | 虚幻茅场：全 AI 模型生成工作流 | [B 站 BV1kXnu6nEXg](https://www.bilibili.com/video/BV1kXnu6nEXg/) | 号称开源的全 AI 模型工作流、约 6.7 万播放，但页面未给仓库地址或步骤，只能作待核线索。 |
| 索引 | GamesByAI：588 款 AI 游戏与工具索引 | [链接](https://gamesbyai.win/stats/) | 索引 588 款 AI 制作游戏（动作类 227）及 23 种工具，附证据链接与 `/data/games.json`，可继续筛 Unity／Godot 动作游戏与作者过程。 |

### D 档：排除项与理由

以下条目不作为本卡新候选。已在 B／C 表出现但同样不构成候选的，只在此列结论，不重复证据。

| 条目 | 排除理由 |
|---|---|
| 超级反派实验室（TapTap 977867） | 仅预约、无试玩；已作“成套三角色动作”机制线索留在 B1，不满足可玩条件。 |
| 山灯行（B 站 BV1Xpx46aEik） | 截至 2026-11-01 未见公开试玩入口，可玩性待核。 |
| 岛风渔歌（Steam 4962830）／山河营造（4942590） | 均定 2027 年、暂无 demo 或连续实机。Steam 页仍保留可借口径：混元 3D Studio 生成基础概念／几何／贴图／部分源动画，团队手工重拓扑、绑骨、动画、修手部／材质；只能先用商店页截图核外观与动作线索。 |
| 《奶娃大乱斗》《随机乐队格斗》 | 未找到已确认的 Bilibili Toy 直达试玩链接。 |
| 《旅行家：后日时光》 | Steam 搜索无精确匹配，最接近的 Travelling Home: Ever After Demo 开发者不是 B 站作者，无法作为其作品。 |
| Call of Naija | GamesByAI 目录记录过 repo 与“17 个 Blender 脚本绑定角色”，但 `github.com/bigbadbillion/game` 404、站点 000，游戏与源码均未核。 |
| A.I.L.A. FIGHTERS | 2026-10-10 可玩、Claude Code＋Three.js、3 角色，但作者明确说制作方法不公开、只在 LINE 发 PDF，缺作者原始过程。 |
| Discretion: Operation Hummingbird | 只有 pre-production 宣传，无可玩或完整实机。 |
| DreamScapes | 学生 Unreal 项目，非 AI 制作。 |
| Smash Arena | 只有 session 日志，无公开可玩页。 |
| Metal Assault | 有公开 repo、可玩、全 sprite 由代码画，但只有 idle／run／aim 帧，无攻击动作帧，无 LICENSE、无仓库内静态截图。 |
| Quasar Saz | 图形是程序正弦摆动，无角色 idle／move／attack 帧。 |
| Midgard Arena | 35 英雄、Kling 动画只有创作者邮件自述，无公开 repo／devlog。 |
| Pixel Fighters（backagain.in）／Cinevva Spike 50 | 同骨架换装机制相近，但作者未称 AI 制作，不属本线。 |
| OG Realistic Combat System | Fab 上的战斗系统资产，不是游戏。 |
| Her Majesty／Usman | 动画短片，不是游戏。 |
| NightFang | 无角色绑定／动画流程。 |
| Dead Acre／Bartender Brawl | 可玩，但页面无作者工具／流程记录。 |
| Castle of Alchemists | 2D 像素俯视塔防，与角色成套动作不符。 |
| 《变成黑洞》 | 无角色。 |
| 《骷髅枪手》 | 虽标“纯 AI 制作”且有 demo，但只有商店页、无作者制作过程。 |
| 《記憶を交換する世界》 | 日本日记中的作品，只有行走帧，无 idle／攻击三类。 |
| CGJOY 284303 | 是角色资产练习，不是游戏；其踩坑记录已作 C 档反例。 |
| Rex Marks the Spot | 动画短片；其 rigging 实测博客已作 C 档反例。 |
| Overdrive Breakout | AI 只做代码／音效／UI，仅机甲，角色成套动作不符。 |
| Atana／天行健／造化万物 | TapTap jam 可玩，但无角色动画制作过程。 |
| 小张0610 相关视频 | 无角色动作证据。 |
| animated-asset-skill／Puppetz／open-annie／Meowa／MoFX | 绑定或动画工具，按“绑定工具不收”排除。 |
| 腾讯文档《PMX转Biped胎教级教程》 | 正文标注“只能查看”，只读到页头与修订说明，步骤未取到。 |
| CapoeiraFlow／Pokémon Claude Red／Bash Fighter／Castle Clash Duel | 机制或可玩性对照，作者未称 AI 制作或没有骨架环节，已在 C 档说明。 |

## 排重与边界

- **与已发表基线排重**：`World of ClaudeCraft` 在 `docs/research/2026-10-14-game-wp2-2d-assets.md`（图标 PR #1837／#2301）与 `domains/game-dev/assets/2d.md`（图标二改）已有记录，拼写为 World of Claudecraft，属 UI／图标语境，不是本卡角色动作候选；本清单新增的是角色动作角度。其余 19 个名称（`Bash Fighter`、`Hollow Crown`、`Korovany`、`After the Wind`、`Catcopter`、`LANTERN ALLEY`、`PIT NINE`、`Grandma GTA`、`BrawlBox`、`CapoeiraFlow`、`Hibana`、`Crowned in Steel`、`Dynasthir`、`Bring It`、`Alaturka`、`Wan-Animate`、`Snowdrift`、`Graveyard Waves`、`Scroll Courier`）在 `docs/` 与 `domains/game-dev/` 按精确名 0 命中。`domains/game-dev/README.md`“用 AI 做游戏”当前只有 Riposte、Formula Minus One、DragonScape Idle、Battle Drones 四例；本清单没有重复这些条目。
- **任务卡明列的对照**：Riposte、Formula Minus One／FM1、DragonScape Idle、Battle Drones、Ascend From Nine Mountains／AFNM、Remnants of R’lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso、pxl 均不作为新候选；本清单未再引入其链接。
- **清单内部合并的重复**：Hollow Crown（两条，游戏页与仓库页合并为 B1 一行）、Dynasthir（Demo 页与正式页合并）、Gnome Garden Defense（meshy.ai 与 cdn.meshy.cn 合并）、Gulliver's Travels（同上）、After the Wind（sorenxet 二手总结与 Stefan 二手报道合并为 B1 一行）、木马人（B1 与 B2 重复，保留 B1）、岛风渔歌（B1／B2 与 D 重复，已并入 D）。
- **只取静态公开材料**：未启动游戏、未抓游戏画面、未开 GUI／无头浏览器、未用 GPU、未调用模型或安装软件；所有“可玩”均由候选清单的渠道回执支撑，本单元没有独立验证。
- **不评水平**：本文件只做来源排序与缺口标注，不写“已玩”“品质通过”或“达到某档”。

## 交给 dot 的二改验证问题

1. **World of ClaudeCraft**：换武器／换皮肤后，同一 idle 与 autoattack 的接触帧是否仍与 `woc_autoattack_contacts.json`、伤害数字与音效对齐；不重刷权重时旧动作是否保持；新增第 24 段动作时旧 clip 的索引是否稳定；男女各 23 段是否确实分别 key 在各自体型的 bind rig 上（mesh-free 只表示 clip 库不含 mesh，不是跨体型共用），把某段动作用于另一体型需重定向或重新 key 的代价多大。
2. **Grandma GTA**：把角色换成比例差异更大的模型，65 骨／41 骨两套骨架的语义映射是否仍成立，22–25 段 Tripo 预设动作与 Text-to-Motion 在换模型后是否仍可用；短臂修正是否是单模型特例。
3. **Grandma GTA（换车型与换装）**：换车型／不同身高角色骑同一辆车时，两骨 IK＋`gripHand` 能否对上龙头车把（这套 IK 只用于握龙头与抽烟）；换武器／换服装时，`rHand` 的骨骼相对挂点是否仍保持。
4. **刀光剑影**：换渲染路径前后，41 骨矩阵编码是否保住了 `HeroAnim` 的接触时刻与 `HeroSword` 挂点；Tripo/Mixamo 的 `name`＋`nameHash` 双字段修法在换新生成模型时是否一次成立。
5. **Zhaoye 照夜**：71 骨源骨架到 75 骨战斗骨架的加骨是否改变旧动作的接触与道具轨；一次自动权重尝试没有产出权重顶点后，手指与领口的手修量能否量化，肩部与宽松衣物仍折叠到什么程度；换第二把武器时刀与刀鞘的独立道具轨是否复用。
6. **Graveyard Waves**：四类僵尸共用同一 bind 后，换武器或换部件时 38 段动作的握把轴、挥击起始帧与命中帧是否仍对齐；Meshy 重绑造成的骨长 4%／帧差 20° 是否会在换装后放大。
7. **共同问题**（任一候选）：同一角色 idle／walk／attack 三类的来源是否可分离；换装备时是改 mesh、改权重还是只换挂点；出现穿模或脚滑时，作者是回 DCC 手修还是改状态机。

## 覆盖缺口

- **可玩性未独立验证**：全部候选的“可玩”均按渠道回执记录；本机未启动任何游戏，A1–A10 也没有完整连续实机观看。
- **作者身份未逐条核**：Scenario、Tripo playbook、Meshy 3D Games 属官方或厂商展示，页内署名与团队未逐一回作者主页；TapTap PC 端试玩与 B 站 Toy 的入口有效性未核。
- **许可与成本普遍未知**：除 World of ClaudeCraft（代码 MIT；媒体资产见 CREDITS.md，多数 CC0，WOC 玩家角色 rights reserved，未列资产不随 MIT 授权；品牌不授权）、Grandma GTA（MIT）、Korovany（MIT）、长风（MIT）、Hollow Crown（MIT）、Mouse Quest（MIT）等明确代码许可外，多数 TapTap／B 站作品未披露素材权利、引擎许可与成本；Graveyard Waves、Hibana、LANTERN ALLEY 只有 credits 或 CU，无完整账本。
- **Reddit／itch.io 原始帖缺口最大**：After the Wind、KAYFABE、Monet 等只有二手摘要；不能据此判断评论区正反反馈，也不能把摘要当作者原文。
- **中文一手过程缺口**：知乎、公众号、小红书、linux.do 基本读不到正文；B 站部分视频页 412，空间投稿与合集无法枚举，可能漏掉作者同系列作品。
- **未做游戏品质判断**：本轮没有试用、对照或截图验收；水平评估需 dot 后续完整试玩。

## 探索回执

- **渠道**：GitHub（raw／HTML／clone／未登录 REST）、Vibe Jam API、GamesByAI 与 awesome 索引、Bilibili（搜索／view／reply／related）、TapTap（app／开发者页／moment／聚光灯标签）、Steam（商店页／appdetails／news／appreviews）、X（fxtwitter／oembed／syndication）、Reddit（镜像与 Arctic Shift）、itch.io（translate.goog 代理）、HN Algolia、Cascadeur 官方博客／文档、Scenario explorations、Tripo／Meshy 官方页、OpenGame、Goblin Games、日本 AI 游戏开发研究室、掘金、CGJOY、Blender Artists／Epic／Unity／DAZ／Godot／Rokoko／Charakuru／ComfyUI 论坛与 issue、Product Hunt、Trustpilot、arXiv。
- **截止**：2026-11-04。本单元只整理已核实候选清单并做必要的来源与链接核验，不新增候选抓取。
- **不可读**：Reddit、itch.io、YouTube／Medium、Google／DDG／Bing／Mojeek／Startpage、x.com 长帖与时间线、tripo3d.ai／developers.tripo3d.ai／tripo.page、www.meshy.ai 直连、huggingface.co、web.archive.org／archive.ph、知乎／公众号／小红书／linux.do／即刻／V2EX、B 站 opus 与部分视频页、TapTap 评论区与部分截图位、`tidebreaker.vercel.app`、`afterthewind.game`、`callofnaija.vercel.app`、`brawlbox.gg`、`martini.film`、`worldofclaudecraft.com` 主站。原因分网络层 TLS／000／Socket closed、站点反爬／验证码、域名安全策略、登录壳与静态渲染不足；未换身份、未绕过访问控制。
- **边界**：未启动游戏、未抓游戏画面、未开 GUI／无头浏览器、未用 GPU、未安装软件／模型、未付费、未使用凭据；只读公开静态资料。凭据与内网地址未写入本文件。


