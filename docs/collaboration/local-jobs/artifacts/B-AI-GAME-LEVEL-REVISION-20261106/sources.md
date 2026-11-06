# B-AI-GAME-LEVEL-REVISION-20261106 · AI 参与关卡二改的候选来源

> 采集与静态核实日期：2026-11-06。只读公开网页、API、源码和作者静态图；未启动游戏、浏览器、播放器或音频，未登录、未发帖、未联系作者。链接可达只代表网页响应；未试玩、未看完整连续实机，不作品质结论。

**先给结论。** 本轮只把 **3 项**作为过门槛的新候选交回，按优先试玩排序：

1. **Voltane**（3D 遥控车竞速）——路线与碰撞/隐形墙的二改有日期、有前后变化，开放 beta 可直接玩；最贴近 Star 的公路弯道问题。
2. **Solhex**（3D 太空工厂探索）——唯一用可重复 test player 量出每章实际时长与空转、再改路线/成本的样本；给的是节奏验收环，不只是“改过布局”。
3. **时囚 BetweenTicks**（3D 平台跳跃/解谜）——换灰墙灰地为房屋车辆时，用同机位灰模/美术对比和线框叠加保住原跳跃路线；给的是“换美术不改空间语义”的检查法。

三款都有当前可玩入口、作者过程、作者公开静态截图原链、版本/日期、AI/人工分工和一次具体二改；许可与成本均未披露，作者身份只到个人站/工作室页，本端均未试玩。**本卡只做已定候选收集，不替代实际运行、试玩或完整实机观看；恢复实机后按 ai-made-games-scout §2 补 10–15 分钟实玩与同视角截图。**

其余按缺口分列：**乙级 29 项**（二改证据强，但缺截图原链、版本、许可、作者身份或“节奏仍可玩”中的至少一项）、**丙级 50 项**（只有过程或只有入口，不能进甲）、**排除/转交 9 组**。任务点名排除的 19 项旧候选只在 §6 列名，不重复计数。**最强一项先试 Voltane**；在 Star 现案例可验证的机制是“可见阻挡清单＋固定跑圈基线”，见 §9。

## 1. 渠道覆盖表

按首次发现渠道归类，跨渠道重复不重复计；个别条目按主入口归并。各行“得到”是覆盖量，不是品质排名。共记录约 **91 个具名作品/项目条目**、**13 组工具/方法线索**；另 19 项任务既有旧候选只列名。实际逐页读的是作者原文、devlog、仓库、商店/详情页和静态图；摘要只作线索。

| 渠道 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| Vibe Jam 官方与 2026 数据集 | `vibejam.com/api`（2,028 条，2026 年 945 条）、`/2026/cache/games-5288ad4b37b007e7f970f150f68f2d1d.js`（945 条，与 2026 年一致，含 `final_rank`/`award`；文件名里的 5288… 只是哈希前缀，不是条数）；筛 pitch 含 level/map/encounter/layout 的 39 条（2026）/78 条（2025–2026 全量），放宽到 2026 缓存全字段共 94 条，再回作者页 | 2 项（Geobeat；Duality 仅元数据） | `vibejam.com/2026` 显示 0 games；`/results` `/winners` 404；Duality 的 vercel 页 TLS 000；完整参赛/获奖名单未取得 |
| GitHub（REST、raw、HTML、`commits.atom`、Pages） | Ennui92/pull-the-plug-play、aieo-product/fableDemoGame、nansu0425/nan2026-game-src、Dimava/gensokyo-survivors、3D-Stories/skate-game-opus-5-5、web3dev1337/epic-survivors-architecture、alltomstales-dotcom/oh-shit-zombies、acatovic/gothicvania-codex-demo；另读工具仓库与 `awesome-opus-5.5-games` 的 4,128 条 `games.json` | 8 项（B1 3、B3 4、C 1）＋8 组工具/索引 | 未认证 REST 60 次/时限流（403）；code search 需登录；部分仓库 500/404；commit 历史未逐条读 |
| 英文作者站、个人博客、devlog | kraigadams.com（Solhex 165 条 devlog、Jumpgate）、x00f.com（Wages/Wreckhold/Graveshift/CAGE/Voidrunner/Polybreak）、dmnshd.gg（Shed Racer、Geobeat）、tinybitadventures.com（Fang/Wheek/Not Pro Skater/Star Circuit）、vibegamesstudio.com（12 款＋2026 夜报）、evolutionaryarcade.com（6 款＋API modelCard）、supertommy.com、slipfacegame.com、fable-katamari.pages.dev＋Zenn、blog.slashie.net、rustyrobozlabs.com、jobyang.cn | 约 46 项（A 1、B 9、C 32、D 4） | slashie.net 根与 `/keep` 被 Mod_Security 406/500；fable-katamari 除地图版权外无作者/社交外链；tinyskies 停放页；hollowlands 只有标题/菜单图 |
| Reddit（Arctic Shift 归档 API） | r/aigamedev、r/ClaudeAI、r/vibecoding 的 `posts/search`、`posts/ids`、`comments/search`；Voltane 1xgcszc/1xgsgmi、Iron Curtain 1xj88ci/1xk8dp8、Liftbound 1xou4m9、Maskfall 1xmrr9d、OVERSTEER、Schnell、Silent Entry | 2 项（A 1、B3 1） | `www/old/api.reddit.com`、redlib、r.jina.ai 均 403/429/TLS 失败；Arctic Shift 部分查询 Timeout；1xnx3w5 已 `[removed]`；OVERSTEER 被网络策略 block；评论只读到 1xj88ci 约 100 条与 1xgcszc 约 50 条 |
| Steam / SteamDB / App Store | Iron Curtain Call 商店页与 appdetails、ISteamNews；Epic Survivors app 3553800；Liftbound 的 iTunes lookup | 2 项（B1 1、D 1） | SteamDB 403/Cloudflare；社区公告/讨论页 000；评测 JSON 为空；Stay Dead、亡犬、SweatyPanzer 的试玩与 AI 分工未核；App Store 页重定向到中国区 Today |
| TapTap 聚光灯 2026 / TapTap 制造（网页 SSR、tag 页、moment 页） | app/984399、982445、974354、960864、964250、963039、965247、960144、975005、954910、954051、957599、957390、976181、986579、955070、976321；moment Day14/15/17/20、开发日志 01–07、评价页；`/tag/聚光灯GameJam` 18 个 app；开发者页 468045/479179/450056/292906 | 25 项（A 1、B 10、C 12、D 2） | “打开 APP 试玩”需客户端/登录，未启动；作者主页返回混淆反爬负载；`webapiv2` 搜索 400 `csrf_token_expired`/需 `X-UA`；聚光灯活动页显示“全部作品 0 款”；用户页 JS 空；清漪/考了又考/界门无公开网页试玩 |
| 中文技术社区与作者页 | agentcaseshare（多米诺人生系列与 15 个案例总表）、juejin（猫咪守卫队、颜色排序）、cnblogs（考了又考）、jobyang.cn（界门）、机核/少数派/知乎/公众号/小红书 | 5 项（B1 1、C 4） | 公众号多篇“环境异常”验证页；小红书 item 页“访问的页面不见了”；知乎 403；少数派/即刻只有摘要；掘金作者文章列表 JS 空页；评论区未展开 |
| itch.io / AI Jam 4 | AI Jam 4 entries 75 项、results 21 名；A Rock and a Hard Place、Wicklight、DEEP、cwwkeeler/RUINS、r3dm00n/Red Moon、deaddreamer99/Schnell、dystostorm/Silent Entry、echoplayroom/Yanghwa、martinopiaggi/Dungeotto、stuartking84/Wasteland Renegades | 1 组 3 个链接仅搜索摘要线索（D），0 项可核 | 本机 DNS 把 itch.io 解析到内网拦截地址，TLS handshake 失败（curl exit 35、000），WebFetch 报 Socket is closed；站内 devlog 搜索返回 0 字节 |
| 索引与榜单 | `awesome-opus-5.5-games` 的 4,128 条 games.json 按独立游戏/quality≥8.4/Three.js/Godot/Unity/Unreal/WebGL/有 live_demo 过滤出 71 项；`aibuiltgames.com/api/games` 238 条；Playgama AI Game Index；claudeslop；GamesByAI | 0 项新（Fallen Citadel、Pro Skater 已按 GitHub 计）＋5 组工具/索引 | aibuiltgames 主页只渲染 1 条 featured；claudeslop 一直 Loading；Playgama 只有聚合统计；vibey.dev 是域名出售页 |
| Hacker News Algolia | 多组 query；读 item 50072120（177 分）整棵评论树、48509243、48865303 | 0 项作品；3 条边界线索 | HN 未出现具体的“AI 游戏第二次改关卡”案例；只留下 harness 的反对意见（“LLM 已解决编码”被多位从业者反驳）、Simon Willison 的 Safari/Chrome 回放不同步、mypalmike 的 playtest 输入录像/精确复现线索 |
| B 站 / YouTube | 只读标题、简介、作者、日期、时长等元数据；按任务未加载播放器、未播放音频/视频 | 0 项 | 播放器未加载；《星光小队》《翻面》《破境》《夜神 1 人 100 小时》《明末：欲火重生》的连续实机与具体关卡二改无法核 |
| WebSearch / 通用搜索引擎 | 本会话 200/200 用尽；中英文换词覆盖 level redesign/second pass/playtest、关卡重做/路线/波次/遭遇、site:itch.io、site:taptap.cn 等 | 0 项可直接核（只作发现入口） | Bing 中国站返回无关词典/驱动结果；DuckDuckGo HTML/lite 证书被劫持到 `*.facebook.com`；Mojeek 403；Google/archive.org/r.jina.ai 000；额度耗尽后无法补 site: 查询 |
| Epic AI MegaJam / 官方 jam 页 | `unrealengine.com/news/2026-epic-ai-megajam`、`itch.io/jam/epic-ai-megajam-2026`、`web.archive.org` 快照 | 0 项 | Unreal 页 403 Cloudflare；itch jam TLS 失败；archive 拒绝抓取/000；规则、提交与获奖名单未读 |

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

**A 级 3 项**全部满足上述硬门槛，仅许可/成本/实玩三项留未知。**B 级 29 项**至少缺一项：截图原链、版本号、许可、作者身份，或“二改后仍保持可玩节奏”尚未验证。**C 级 50 项**只有过程、只有入口或二改未落到路线/遭遇层。**D 级 9 组**按任务规则排除或转交。**工具/方法 13 组**不是作品，只补验证链。

## 3. 甲级：3 项过门槛候选

### 3.1 Voltane（3D 遥控车竞速）

- **可玩**：<https://playvoltane.com/play/>（开放 beta，当前 build 0.1.1；本端未启动）。
- **作者过程**：作者原帖 <https://www.reddit.com/r/aigamedev/comments/1xgcszc/>、分工帖 <https://www.reddit.com/r/aigamedev/comments/1xgsgmi/>、开工时间帖 <https://www.reddit.com/r/aigamedev/comments/1x863xe/>（Reddit 直连 403，经 Arctic Shift 归档读正文）；英文更新日志 <https://playvoltane.com/en/updates>（本次实读，261 条更新，按日期分组）。
- **作者静态图**：关卡截图 <https://playvoltane.com/media/game/site/level-maison-960.webp>（客厅/房屋）与 <https://playvoltane.com/media/game/site/level-jardin-960.webp>（后院）（本次均 200）；另有宣传 key art <https://playvoltane.com/media/hero/maplewood-patrol-1920.webp>（本次 200，不是关卡截图）。
- **版本与日期**：2026-09-20 左右开工（作者 2026-10-17 帖 1x863xe 原文 “Started working on Voltane … around the 20 September”）；beta 于 2026-10 初上线（2026-10-06 帖已称 early beta，2026-10-17 帖称约十天前上线，2026-10-27 帖称已在 open beta）；更新日志自 2026-10-04 起记录（2026-11-06 页首：261 条、34 天），有 2026-10-21、10-23、10-28、11-03、11-06 等条目；2026-10-28 关卡扩为 47 条赛道变体。
- **AI/人工分工**：Claude Code/Opus 5.5 写代码、物理、网络与工具；人做设计、手感与试玩。作者分工帖原文称 game feel、level pacing、砍功能都来自数百次试玩和玩家反馈。
- **一次具体二改**：2026-10-21 的 “The Backyard, a second finishing pass” 是后院第二次收尾，以干砌石墙、约三十件道具的材质和割草机/棚屋/野餐桌为主，可驶入几何只加鸭板/滑梯等小改动；同日另一条 “Maplewood: the big corner walled off” 才是路线级改动：弯道起点用锥桶墙封住、整弯围栅栏，客厅捷径成为替代路线。路线与碰撞二改的主证是 2026-10-23 的客厅捷径穿草坪不再算数、Maplewood 房屋碰撞对齐可见墙面并取消门廊前隐形墙，以及 2026-11-03 的 Moonlight Mart 卸货台隐形墙、14 Oak Street 浴缸跳跃判定与床下切口封堵。作者原帖下有玩家直说 “level design in particular is heavily lacking”，可作为二改后的真实反馈对照。
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
- **一次具体二改**：Day15 把灰墙灰地换成房屋车辆时，用同机位灰模/美术对比与线框叠加保住原跳跃路线；合并门窗小起伏碰撞、放缓红时坡顶过渡、移开被房屋挤压的压力板。Day17 泳池从平面改为挖池，跳板 2.5→4 m。Day20 把散关连成一段旅程并改加载节奏。
- **许可与成本**：未披露。两项未知。
- **缺口**：作者只做局部走动/单点测试，完整路线与手机性能未验；本端未启动；许可/成本未知。

**为什么是这三项。** Voltane 回答“路线怎么改、用什么挡住捷径、碰撞是否跟着可见几何走”，且改动有日期和玩家负评；Solhex 回答“先定每段目标窗口，用可重复 test player 量实际时长与空转，再改路线/成本”，是本批唯一把节奏验收写成数字的样本；时囚回答“换美术/几何时怎样不破坏原跳跃路线”，并给出同机位灰模＋线框的检查法。三者分别覆盖路线规则、节奏测量、空间语义保留，不重复同一角度；也都没有把“AI 生成”当作品质证明。

**为什么不是它们。** Iron Curtain Call、Pull the Plug、Fable Katamari、多米诺人生、The Fallen Citadel 的二改证据同样强，但分别缺“逐版差异”、版本号、逐次二改的前后对照、版本号、许可。它们放在 §4.1，作为 A 级替换项；补齐缺口后可替换 A3。

## 4. 乙级：二改证据强、但缺一项硬门槛（29 项）

### 4.1 最接近甲级的 5 项（优先补核后可替换）

| 作品 | 一次具体二改 | 缺什么，为什么不进甲 |
|---|---|---|
| [Iron Curtain Call](https://store.steampowered.com/app/5417460/Iron_Curtain_Call/)（Steam 商店页；正式版 2027-03-11；Demo 页 <https://store.steampowered.com/app/5451220/> 显示 2026-10-23 上线，作者 2026-10-30 原帖 <https://www.reddit.com/r/aigamedev/comments/1xj88ci/> 称 10-28 上线，两处日期不一致） | 作者 2026-10-30 原帖：demo 关卡经过四版，一次真人 playtest 后加了一整段；20 个工作日 3,929 commits；Claude Code 写代码/系统/HUD/无头测试，人做故事、笑话、剪辑和关卡判断 | 四版只有作者一句概括，没有逐版前后差异；本端未启动 demo；成本只说用了 6 个 Claude 20x 套餐，资产许可未知 |
| [Pull the Plug](https://ennui92.github.io/pull-the-plug-play/)（GitHub Pages 构建，含 Prelude＋mission 1–6） | [Day9](https://ennui92.github.io/ermis-dev/posts/pull-the-plug-day-9.html) 走完 Prelude–Mission 3，按 P 留 9 张截图、约十几个问题→46 commits；Mission 1 天花板按二段跳高度重做四版，Mission 3 危险在待机态可见，Mission 2 水改成从地面向上长；[Day24](https://ennui92.github.io/ermis-dev/posts/pull-the-plug-day-24.html) 六关全通 | 无版本号；Pages 构建只用 `main-*.js` 核到 mission 1–6，未启动；许可/成本未披露；2D 一键攀爬，空间维度比 3D 弱 |
| [Fable Katamari](https://fable-katamari.pages.dev)（v5，3D 块魂式动作；制作记 <https://github.com/aieo-product/fable-katamari-zenn>、设计书 <https://fable-katamari-docs.pages.dev/design>、MIT 源码 <https://github.com/aieo-product/fableDemoGame>） | v2 撤掉屋内/地形/墙方案；v3 把无限平面改成 3.6×3.8 km 箱庭东京路线（秋叶原→中央通→上野/浅草/丸之内/涩谷→晴空塔），用 DYNAMIC RE-BANDING 修约 370 处 curated 配置（含地标/摆件）的 tier 越级；v4 换 OSM 14,563 栋建筑、0.5 m 导航烘焙（r=1 100%、r=3 96.7%），按实测把 pacing 2.2→2.8；v5 修开场被地表/高架遮挡 | 作者身份只到 Zenn handle；制作记内有截图（`live-v*.png`）但没有逐次二改的前后对照；成本未披露；本端未启动 |
| [多米诺人生](https://agentcaseshare.cn/articles/article-17jx8bzp)（可玩 <https://domino-life.parkerluxu.space/>，本次 200、标题“多米诺人生·第一块倒下”） | L11 弹簧关因“接触方向与出射方向矛盾”整关重做（小球推牌→越过平台→落缺口→从上方压弹簧→进落地区）；目标从“点蜡烛”改为可见 item-zone 并加 `requiredEvents`；AI 批量产 20 关 JSON＋物理回放，人逐关试玩并决定重做 | 无版本号；许可与金额未提；本端未启动；只有单关重做，不是整章节奏 |
| [The Fallen Citadel](https://github.com/nansu0425/nan2026-game-src)（可玩 <https://nansu0425.github.io/nan2026-game/>） | Claude Opus 5 经 Unity MCP 生成三关地形/掩体/动线坐标；人改放置后用 `battle-stage-backport` 把 82 处手改写回数据（51 替换、31 移除，含掩体从 (-12.5,-4) 移到 (-10.2,-6.4)）；有可玩 WebGL 与前后对照文档 | 仓库没有 LICENSE，README 明确原仓库因外部资产许可而私有，本仓只放团队代码/文档；外部资产只限该构建；本端未启动 |

### 4.2 二改具体，但缺截图/版本/许可/作者身份之一（15 项）

| 作品与入口 | 一次具体二改 | 缺口 |
|---|---|---|
| [Shed Racer](https://dmnshd.gg/games/shed-racer) | AI 生成的首轮 career 赛道“很圆、几个弯加跳台”，同质且部分不可玩；作者改为明确指定弯道序列、加速带位置并手工重做部分赛道，赛道以 JSON 保存便于直接改；8 周、v0.6.3 | 无作者静态截图原 URL；Kenney 美术 CC0、后期闭源；成本约 Cursor Pro $60/月＋Google AI Pro $20/月 |
| [Wobble Wallop](https://evolutionaryarcade.com/g/wobble-wallop) | 36 个手工关卡；level prover/noisy-hand bots/economy sim＋录屏复盘：修重开确定性 bug；星级线从“0.3° 失手”改为 bot 分布；2-8/3-5/3-11 连专家 bot 都很少过而各补一只 critter；prover 瞬间发射、真人瞄准停顿会让方块倒塌，改成两发之间世界休眠并重解 4 关；独立 QA 修 15/36 手机镜头看不到目标、23/36 提示成功率≤8% | 作者仅 handle；无截图原 URL；许可/成本未知；本端未启动 |
| [Skyscrawl](https://evolutionaryarcade.com/g/skyscrawl) | 120 座塔的可攀爬路线由 Node 可解性工具验证；工具找出三处真实问题：横移跳不过、黑洞吸力扫到保证路线、保证链里出现会消失的砖导致回落 soft-lock；修法是消失/碎裂砖只作额外路线、绝不作唯一上行路 | 作者仅 handle；无截图原 URL；无真人长玩；许可/成本未知 |
| [Keepfall](https://evolutionaryarcade.com/g/keepfall) | 单关三段式城堡；Playwright 逐帧试玩后改掉同侧墙跳可爬塔外壁、骑士巡逻伸进落地区、双链不同步使交接变成计时考试、密室从外侧可见；beam-search solver 证明跳跃与速度各削 12% 仍可无伤通关 | 作者仅 handle；无真人试玩；无截图原 URL；许可/成本未知 |
| [Sunline GP](https://evolutionaryarcade.com/g/sunline-gp) | Opus 5.5＋Claude Code 生成的卡丁车赛道；第二版写明 AI 车每圈撞墙 48 次降到 1–3 次、跳台起跳 12/32 提高到 31/32，并在桥尾新增第二座跳台 | 作者仅 handle；数据来自自动跑；无截图原 URL；许可/成本未知 |
| [Fang the Fox](https://tinybitadventures.com/fang-the-fox-rebuilt-with-opus-5-5/) | Claude Code Opus 5.5 重做的 24 区域、5 Boss 浏览器平台游戏；无头 bot 从标题打到 credits，地图检查器证明每扇门/道具/火盆可达；发现最终区“塌陷砖路未点火盆就永久封死 Boss 门”的 softlock，改为会自行拼回的砖并让检查器标出被塌陷路切断的区域；又抓到 Dreamspace 一格进得去出不来的陷阱 | 该页未写明 AI 用量（站点搜索可证 Claude/Opus 参与）；无截图原 URL；版本/成本未知；免费可玩、MIT |
| [Blacklight](https://www.vibegamesstudio.com/blacklight/) | 按 30 天遥测重做开局两分钟：甲板琥珀色引导带改走位、教学卡从第 5 张提前到第 2 张、开场缩短 12 秒（[2026-09-08 changelog](https://www.vibegamesstudio.com/changelog/blacklight)）、噬人怪延后到光束讲解之后；QA 首轮 7 次冷开有 4 次生成时面壁，二次修复后 7/7 朝向正确 | 工作室自称“零人类”AI 工作室，作者身份是否符合门槛待复核；许可/成本未知 |
| [密林：危机涌现](https://www.taptap.cn/app/974354) | 开发日志 02：作者试玩后嫌夜间波次张力不足，改成感染者全天进入，并要求围栏外群体先实际攻击围栏、破栏再进；日志 04：救援天数从 10 天→7 天→6 天；页面 2026-10-19，PC 端试玩 | 无作者静态截图原 URL；许可/成本未披露；本端未启动 |
| [涌忆](https://www.taptap.cn/app/982445) | 人做故事/谜题/关卡/地图标注，AI 写代码、豆包生图并做地图物件适配；AI 先把一个物件识别成多个可触发物、首轮自动适配偏差大，作者手工圈范围与位置做第二轮返工；第二章再加“角色与三角标识重合时标识上移”规则解决遮挡 | 无版本号；许可/成本未披露；本端未启动 |
| [失控协议：群潮之下](https://www.taptap.cn/app/963039) | 出兵原“首兵与后续两套计时/低供电不拖慢组装/满员伤亡立刻补兵扣钱”，二改为按实际供电效率积累组装进度、断电缺合金时暂停、出口堵塞先等待；布防场地从 144 格扩到 459 格；2026-10-17–18 | 无作者静态截图原 URL；页面声明含 AI 生成资产，许可/成本未提；本端未启动 |
| [Accomplice](https://www.taptap.cn/app/965247) | 角色斜向移动卡进墙，打补丁越修越多后“推倒重来”，把碰撞箱和地图全部重画（新地图不如原画精致）；AI 写代码但常 context 爆掉，人负责测试/修复决策与美术立绘 | 无截图原 URL；token 成本未给；本端未启动 |
| [地穴涌现](https://www.taptap.cn/app/960144) | 每关 45 秒改 30 秒、同屏地鼠 3→5 只、削弱一个过强强化道具；页面标“包含 AI 合成内容”，系列日志 4 记录 AI 过度工程，但该篇未写 AI/人工分工 | 该篇 AI/人工分工不足；无截图原 URL；本端未启动 |
| [重生之我给AI当牛马](https://www.taptap.cn/app/975005) | 让 AI 模拟玩家多轮跑测：难度先高→下调→又太低→把中期考核回调，目标是乱拿资料也能玩、认真搭配有成就感；24 期×4 次训练；AI 只用于模拟测试，关卡/系统由人设计 | 无截图原 URL；许可/成本未披露；本端未启动 |
| [恶魔庄家今日营业](https://www.taptap.cn/app/954051) | 按剧情重排关卡（删 2 关无剧情、寒暑/先驱对调）；AI 编号重映射把同一数字映射两次，导致收束段错位、寒暑关混入先驱内容；靠剧情 42＋播放交互 15＋关卡可玩性 26 共 83 条验收抓出 | 无截图原 URL；许可/成本未披露；本端未启动 |
| [璇玑](https://www.taptap.cn/app/964250) | DeepSeek-Flash 设计的第 6–8 关“一眼看穿解法”；作者把这三关改为第 1–3 关、把【极致】模型的复杂关后移；关卡完全由 TapTap Maker 制作，人做筛选重排与误删备份；2026-10-21 | 是关卡顺序/难度曲线二改，不是路线几何；无截图原 URL；许可未提；本端未启动 |

### 4.3 有二改线索，但入口或“节奏仍可玩”未过（9 项）

| 作品与入口 | 一次具体二改 | 缺口 |
|---|---|---|
| [清漪](https://www.taptap.cn/app/960864) | AI 先产出其中 20 关“里关”并重调此前区别不大的关，逐关改重力/力场/速度（风铃 g 4→1.6、弹珠 g 7→2.2、鼓膜冲量 2.8→5.2）；作者承认部分关“都没法完成目标”；40 关（前 20 关清、后 20 关漪），每关分表里，10/19 | 作者原话“好不好玩另谈了，我准备后面再来调整”，二改后节奏未验；许可未提 |
| [莉耶伊的魔物娘地牢](https://www.taptap.cn/app/955070) | TapTap 制造；Day8 第一版→第二版测试版才发现“通关目前几层比较无脑”和 UI 遮挡，Day11 又细化地图；2026-10-19 上线 | 作者承认重写移植、后期 Boss 强度仍待打磨；截图/AI 分工/成本未给 |
| [Epic Survivors](https://web3dev1337.github.io/epic-survivors-architecture/) | 14 个月时间线记录多次关卡/遭遇二改：2024-11-17 Haunted Forest 整关重做与再平衡、2024-12-08 地形生成重做、2024-12-21 移除敌群碰撞、2024-12-27 蛇形刷怪修正、2025-01-17 启动 Level 1 Redesign、2025-02-24 把“只生存”改成五类事件；Steam 有 demo（app 3553800） | “100% AI 编码”是作者声明且被 Jonathan Blow 质疑，AI/人工分工需再核；许可/成本未知 |
| [Gensokyo Survivors](https://github.com/Dimava/gensokyo-survivors) | Claude Opus 5.5 写全部代码/美术/音乐；作者用 balance bot 与提交记录改 Boss 弹幕和升级打断节奏到 v2.0.0；浏览器可玩、README/截图完整 | 无 LICENSE；东方同人素材权利需另核 |
| [Maskfall](https://www.maskfall.games/) | 塔防关卡 blockout→Nano Banana→脚本→Godot；第一次让生成器直接改图导致道路和炮位被改，后用平色 blockout 锁尺寸，并让 bot 跑关卡做平衡；官网有前 3 关浏览器 demo | 作者仅 handle；无截图原 URL；成本/许可未知 |
| [Liftbound](https://apps.apple.com/us/app/liftbound-cozy-elevator-game/id6827381090) | 20 座手工建筑在固定种子上 bot 分数钉死，每张升级卡在每关跑 100 次回归；Tower 合作层、幼儿园、Bigger Cars 有具体二改前后影响；Claude Code 只按设计文档实现；App Store 可玩 | 商店页重定向，二改证据来自 Reddit 原帖；无截图原 URL；成本/许可未知 |
| [Oh Shit, Zombies](https://github.com/alltomstales-dotcom/oh-shit-zombies) | AI agent 写码、AI 玩家压测的浏览器僵尸生存；开发日志记录首分钟遭遇强度连续两改（19:50、20:13），围攻关在 22% 通关率后二次调参并在 60 个新种子上复验 | README 提到临时 test server 与 BSD-0 代码许可，但入口是临时地址、可能掉线；本清单没有稳定可玩入口与截图原 URL；成本未知 |
| [Jumpgate](https://kraigadams.com/jumpgate/play/) | 可玩 v8.18（2026-10-16），Claude 写全部 6,362 行代码；第一章在 v4 围绕“垂死电池”重建，v8.2 又主动放慢并加难 | 地图为程序化、敌人未实现，压力来自旅行/碎片/稀缺，不是传统路线关卡；许可/成本未声明 |
| [GothicVania Codex Demo](https://acatovic.github.io/gothicvania-codex-demo/) | Codex 按 DESIGN-DOCUMENT 与 Playwright 测试做出 2D 平台关卡；2026-02-16 的 `level cleanup` 提交在两个缺少敌人覆盖的平地补 ghoul、把单点硬编码生成改成 placements 列表并补通关流程；README 记录测试发现浮空敌人后回修重力/碰撞；MIT 代码、可玩 | 单关小样本；截图/成本未给；二改是清理级，不是整关重做 |

## 5. 丙级：只有过程或只有入口（50 项）

丙级不满足“可玩＋作者过程＋具体二改＋截图原链”的完整门槛；列出来是为了说明覆盖面和缺口，不作为推荐。

### 5.1 中文作者日志：有二改线索，但入口/AI 分工/版本缺（14 项）

| 作品与入口 | 核到的内容 | 缺口 |
|---|---|---|
| [智能涌现](https://www.taptap.cn/app/957390) | 3D 海岛狩猎，AI 图生 3D 14 个模型（约 4.8k 面、4 级 LOD）；每片海三关、第三关 Boss；真机试玩后玩家“不知道干嘛”，加入拖动/开火/回港/倒料/买升级/出港逐步引导与字幕；下轮将按反馈调难度和台词节奏 | 具体第二次关卡修改尚未发生；仅 iPhone 16 Pro/一加 8T 验过；许可未声明 |
| [蚁SCAPE / 碳酸公司](https://www.taptap.cn/app/957599) | AI 先做格子关卡编辑器（墙/玻璃/深渊/补给/蚁巢、触发器/逻辑门/计数器）和约 100 项调参面板，人拿工具摆关并试玩；日志只记工具迭代与 QA | 没有具体某关第二版路线/遭遇重做；许可/可玩性待验 |
| [涌·墨卷](https://www.taptap.cn/app/986579) | 代码交给 AI、自己管玩法；一局 12 层、可提前看到后续房间并自选路线；第二轮回调血液演出并重做怪物数版 | 房间与路线扩充仍列在下期计划，二改尚未落到路线层 |
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

## 6. 丁级：按任务规则排除或转交（9 组＋19 项旧候选）

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

## 7. 工具与方法线索（13 组，不是作品）

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

## 9. 交给 dot 的试玩与现案例验证

**最强 1 项先试 Voltane。** 理由：它是本批唯一把“路线二改”写成带日期的可见/碰撞清单、又有开放 beta 和真实玩家负评的 3D 竞速；Star 当前要处理的正是公路弯道、捷径与可读性，问题结构最接近。先在同一赛道（建议 The Backyard；要看二改主证则用 Maplewood 的客厅捷径/门廊与大弯段）、同一车辆、同一机位连续跑 3 圈，对照更新日志看三件事：捷径是否都有可见几何封住或明确保留；碰撞是否贴合可见墙面/路沿；分段用时、撞墙次数与完成性是否退步（无旧 build 时只比同一 build 的改前/改后同基线，不声称比旧版变差；若只是试玩现成 build、无法取改前，则记当前 3 圈供以后复跑）。不要用“改过”代替“节奏仍可玩”。

**在现案例（Star）可验证的一个机制：可见阻挡清单＋固定跑圈基线。**

1. 把当前公路弯道的每个捷径、隐形墙、可疑碰撞列成一张清单；每项标“保留（有可见开口）”或“封住（用可见几何）”，不允许用隐形墙补。
2. 用同一车辆、同一输入脚本/驾驶参数、同一机位、同一 build 跑 3 圈基线，记录每段用时、撞墙次数、触发捷径次数、是否完成；没有旧 build 时记录同一 build 的改前基线，仅用于改后对照，不声称比旧版变差。
3. 只改清单上的几何/碰撞；改完用同一基线重跑。
4. 判定：触发捷径次数下降，分段用时与完成性不退；同机位改前/改后截图各一张，确认可见几何与碰撞一致。
5. 若需要更细的节奏判据，再借 Solhex 的做法：给每段设目标窗口，用可重复 test player 量实际时长与空转，按偏差改路线/成本，而不是先加装饰。

**何时不适用。** 问题若只是单段时长/节奏而不是捷径或可见碰撞，改用 Solhex 的目标窗口，不要套跑圈基线；若要换美术/几何且必须保住原跳跃路线，改用 时囚 的同机位灰模/线框；没有旧 build 时，仍可在同一 build 内先跑 3 圈作改前基线、改后同法复跑，只做改前/改后对照，不得声称比旧版变差；只有非闭环赛道、无法固定输入/回放或无法实机运行时，step 2/4 的跑圈基线不可比，才跳过跑圈、只做当前状态的可见几何核对。无法实机运行时同样只核静态几何与作者原文，不替代试玩。

这条机制只借 Voltane 的“可见阻挡＋同基线复跑”和 Solhex 的“目标窗口＋可重复测量”，不在本卡对 Star 实施、出图或改默认；恢复实机后按现有串行拍摄规则另排。

## 10. 排重、已核与未核

- **排重**：对照 `domains/game-dev/README.md` 的“用 AI 做游戏”表、`docs/research/2026-10-23-game-worth-trying.md`、旧场景/角色/音频卡与已交回候选；任务点名的 19 项旧候选与 `pxl` 均未重列。Emberwick、Claude-of-Tanks 按“同一作品只归主要价值最贴合的一卡”转交场景光照卡；Race Evolutions 按作者门槛排除。Vibe Jam／awesome 列表／插件与 Skill 市场与本卡“关卡二改”关联弱，未把榜单条目当候选。
- **已核**：A 级三项的主入口、作者过程页和静态截图原链本次重新取了 HTTP 状态（Voltane `play` 200、`/en/updates` 200、关卡图 `level-maison-960` 与 `level-jardin-960` 均 200（hero 宣传图另 200，不算关卡截图）；Solhex `play` 200、devlog 200、两张图 200；时囚 app 页 200、三篇 moment 200、两张 tapimg 图 200）；另核 Pull the Plug Pages 200、Pull the Plug Day9/Day24 两篇 devlog 200、Iron Curtain Steam 页与 Demo app 5451220 均 200、Fable 200 及其 Zenn/MIT 源码页 200、多米诺人生 200、Fallen Citadel 200。Fable 的 MIT LICENSE 与 Fallen Citadel 无 LICENSE、README 的资产边界本次实读；Solhex devlog 的 v99/v103/v173 原文、Voltane 更新日志的“second finishing pass/大弯封路/客厅捷径/隐形墙”原文本次实读；Iron Curtain 的 appdetails 显示正式版 2027-03-11、`coming_soon=true`，Demo appdetails 显示 2026-10-23。标题与页面内容只抽查，未逐页核对。
- **未核**：作者真实身份（多为个人站/工作室页/handle）、完整游玩回路、帧率/手感/听感、手机与低端设备性能、模型/引擎版本逐项、资产逐件许可、跨平台可玩性、完整成本。上述留给 dot 试玩或后续核读，不在本产物里写成已知；本端未启动任何游戏、未看完整连续实机、未播放视频/音频。
- **版本/许可分界**：Fable 代码 MIT、地图 ODbL；Fang the Fox 免费可玩、MIT；Gensokyo Survivors 无 LICENSE、同人素材需另核；Fallen Citadel 仓库无 LICENSE、原仓库因外部资产私有；Voltane、Solhex、时囚、Pull the Plug、多米诺人生、Iron Curtain Call 的代码/资产许可均未在已读页面声明，不能由“可玩”推定可复用。

## 原始采集回执

实际渠道：Vibe Jam 官方 API/静态缓存、GitHub 网页/raw/`commits.atom`/Pages、作者站与 devlog（kraigadams、x00f、dmnshd、tinybitadventures、vibegamesstudio、evolutionaryarcade、rustyrobozlabs、blog.slashie.net、penguinboisoftware、supertommy、slipfacegame、fable-katamari＋Zenn）、Reddit Arctic Shift、Steam appdetails/ISteamNews、TapTap 网页 SSR/tag/moment/app 页、掘金/cnblogs/agentcaseshare/jobyang、Hacker News Algolia、awesome-opus-5.5-games 的 games.json、aibuiltgames/Playgama 索引、B 站与 YouTube 元数据。搜索词覆盖中英文的 level redesign/second pass/playtest、关卡重做/路线/波次/遭遇、blockout/greybox、second playtest、boss encounter rework、site:itch.io、site:taptap.cn、TapTap 聚光灯 2026、AI Browser Game Jam 4、Vibe Jam 2026 等；WebSearch 200/200 用尽后改直取 URL、API、RSS 与站点内导航。读取截止 2026-11-06；未启动游戏、未看实机、未开浏览器、未登录、未发帖、未评品质。
