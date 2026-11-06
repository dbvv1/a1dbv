# B-AI-GAME-INPUT-UI-20261106 · 操作体验二改实例的候选来源

> 整理日期：2026-11-06（同日修订）。修订中补齐了 Exelio／Overlock／群侠传／WELL／ASHFALL 的作者截图直链与 Bichitos 的版本号，并用 Steam `appdetails`、ISteamNews、`raw.githubusercontent.com` 和作者页复核。同日复核：Westbridge 的 Vercel 入口本机 TLS 握手失败（000），按门槛 1 移入 §5.2；Bichitos 的 itch 页截图按 BUILD_LOG 2026-08-18 记为 cover 630×500＋4 screenshots，直链未取到；元素突围、梦境绮想按 7 项各只差许可／成本，列入 §3.4；Claude of Duty 与 mshumer 的同名作已按仓库、提示词和文件树分开。下列“可玩”均指页面或仓库入口可达，不代表本端已启动、试玩或看完整实机。未登录、未发帖、未启动游戏、未播放视频或音频、未开浏览器。个别来源只给相对路径（如 Vibegames 的 `/aifighter/`），本文按同页域名补全为可点链接，未另搜。

## 1. 渠道覆盖表

原清单共 **161 条**原始条目，按作品／工具去重并合并同作多帖后约 **148 项**：作品约 123 项、工具／做法／平台约 25 项。数量表示覆盖，不表示通过门槛或品质；同一作品可能跨渠道重复出现，各渠道数相加大于去重总数。下表的“得到”只计进入本清单的条目，含工具与做法。

| 渠道 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| Vibe Jam 官方与缓存 | `vibejam.com/api`、`/2026`、`/2026/games.json`、`/2026/cache/games-*.js`、`/press`、`vibej.am/2026`；按 `final_rank`／`award`／`genre`／`mobile_ready` 过滤，再找作者页与仓库 | 5 项：Astropilot、Bichitos Rumble、Undead Siege 3D、Claude of Duty、Claude of Duty: VibeZone | `/2026` 显示 0 games submitted、winners TBA；`/2026/api` 404；条目无 devlog 链接；JamVault 只有 `/lander` 单页；`levels.io` 结果页 403；Drive 截图未打开 |
| GitHub 与源码 | `raw.githubusercontent.com`、`git clone --depth 1`、网页 issue／PR；读 README／BUILD_LOG／HANDOFF／AGENTS.md／LICENSE／FIXES.md | 17 项（含工具／做法）：Bichitos、Undead Siege、Claude of Duty、ECHO、GameFactory ×4、odiff、paprika3d ×5、Summer ×3 | REST API 未认证限流；部分 issue／commit 页 0 结果或无提交历史；Claude of Duty 仓库没有 `shots/`（raw 404、clone 无目录） |
| Steam | `ISteamNews/GetNewsForApp`、`appdetails`、`storesearch`；读 Exelio／Scarred Steel 全部 DevLog、群侠传商店页与 V0.2.0 news（API 正文）、DeltaV／Shelf-Made Tycoon | 5 项 | `steamcommunity.com/games/...` 403／无输出／socket closed；store news 页 HTML 只返回 JS 导航壳；群侠传 V0.2.0 eventcomments 未读 |
| Reddit 与 Arctic Shift | www／old／api 直连全部失败后，用 Arctic Shift `/api/posts/ids`、`/api/posts/search`、`/api/comments/search` 读正文、评论与作者时间线；扫 r/aigamedev、r/ClaudeGameDev 近期 100＋100 帖 | 20 项 | www／old／api 403／000；`.json`／`.rss` 空；redlib／safereddit／r.jina.ai 失败；pullpush 526；arctic-shift 间歇 Timeout／Too many requests；OneMoreRun 等帖正文 removed |
| itch.io 与 Slapjam | 直连 jam entries／results 索引；试 `juslangit.itch.io`、`headoverheels.itch.io` 等 | 2 项：Keep It Crispy、Slapjam AI 2026（作品池） | TLS 握手失败／000；WebFetch 返回 Socket is closed；jam 页 404；curl／Python／Node 均 SSL EOF；Wayback 返回无关内容 |
| TapTap | curl moment／app 页与 JSON-LD；翻 `/app/710826/topic` 第 1–80 页、AI 创作 `group_label` 第 1–8 页共 377 条；读 WELL／灯烬／梦境绮想／我记得／粘液浪潮等 | 20 项 | 搜索页／作者主页／评论区客户端渲染；moment 页 SSR 不含评论；聚光灯 poster 显示「全部作品：0 款」，只能取标签页前 18；部分开发者页只列同一款游戏 |
| Bilibili | `m.bilibili.com` 读视频页 meta／简介／相关视频；桌面站与 `api.bilibili.com` 412 | 3 项：tefyt FPS、炼金术魔女、最后的前线1917 | 412 反爬；空间页只返回标题、视频列表脚本渲染；评论区不 SSR；按约束未播放视频／音频 |
| 微信公众号／知乎／机核／少数派／掘金 | Sogou 微信搜索、WebFetch／curl 原文 | 0 项直接候选（仅线索：符文射手、群侠传万字复盘、hooooook、茫室） | 微信返回「当前环境异常，完成验证后即可继续访问」；知乎 403 反爬壳；机核正文可读但内嵌 itch 试玩页打不开；少数派茫室只有 UI 资产导入、无二改；掘金只有案例盘点与教程 |
| gamesvibe（VibeHub） | 首页 264 件、作品页／作者页／版本记录／指南、内嵌可玩发布包；按版本号读 FIXES／changelog | 19 项 | 部分作品页／更新分页 404（黑潮行动作品页、`/works/<id>/updates`）；评论游客态不渲染；`/works` 只有首屏 |
| Spawn | 游戏页、@izkimar 主页、`/api/feed?sort=hot`、35 次更新／58 条评论 | 7 项 | 部分页面无 devlog；评论只有 LoL／Dota 2 等商业对照 |
| aigameshare | 游戏页与索引；读 4 个 FPS／动作页 | 4 项 | 多数只有操作说明，无 devlog／版本记录 |
| AI Browser Games | `how-we-made-it` 与 play 页 | 4 项 | 部分页明确「未完整试玩调」；无独立作者页 |
| GoodAIGuide | `/possible`、`artillery-four-ways`、`same-brief-different-models`、`splash-olympics` 与各版本页 | 7 项 | 部分版本页只有标题和返回链接；作者／迭代细节需回汇总页 |
| buildwithstar／ziva／nodetool／Summer／paprika3d／Convika | changelog、游戏页、play 列表、docs、GitHub 指南 | 2 项作品＋12 项工具／做法 | `/explore`、`/benchmark` JS 渲染只得到空列表；`nodetool.ai/gamedev` 404；Star 评论区只显示计数；Summer 技能标 Preview、未在引擎内实跑 |
| 作者博客与独立站 | mikekasberg、bnbong、zhikunqingtao、beatdjam、mathieuacher、m-finder、vibegamesstudio、calebleak、playcanvas、kylekukshtel、simonwillison、ermis、ruliweb | 约 30 项 | mikekasberg 被域安全校验拦后改用 curl 成功；ruliweb 评论区未取到；beatdjam `updates` 分页 404；部分站点 Cloudflare 403 |
| HN Algolia | search／search_by_date／items 多组查询；读 item 50273753 的 51 条评论、item 49554185、49991823 | 0 项作品（只作讨论与反对意见） | 无 |
| YouTube／X／小红书 | noembed 取标题／频道／缩略图；不播放 | 1 条线索：The Librarian 2；其余 0 | YouTube watch 页连接关闭／空；X 登录墙；小红书登录墙；按约束不播放视频／音频 |
| Google Play／App Store | curl 状态码、iTunes `lookup` | 1 条线索：Last Lighthouse；RoyalCraft 元数据 | play.google.com 000；APKPure／APKCombo 000；App Store 只返回通用壳 |
| 平台官方与媒体 | blog.google、unity.com/spark、gamesindustry.biz、openai.com、developers.meta.com、playground.google、playgroundarcade、Flockbay | 2 项平台（Google Playground、Meta Horizon），0 项作品 | openai.com／Playco Cloudflare 403；Meta 官方 TLS 失败；gamesindustry.biz 首拦后 curl；playground.google 登录；playgroundarcade Cloudflare blocked；Flockbay 410（本次 404） |
| WebSearch | 本会话 200 次预算；约 30–40 组中英日查询（Vibe Jam 2026 winners／postmortem、vibe coding 游戏 开发日志 手感 HUD、TapTap 开发日志 AI 摇杆 按键 遮挡、Steam AI disclosed FPS community aim HUD 等） | 0 项直接候选（只用于定位入口，不计入 161 条） | 200／200 耗尽；Bing 中国区返回词典／问卷结果、`site:` 与引号限定未生效；DuckDuckGo／Brave 连接失败；Mojeek 需验证码 |
| 索引站 | GamesByAI、Colyseus 参赛列表、VibeHub、aigameshare、gamesareeatingtheworld、aibuiltgames、3jsbench、JamVault | 0 项直接候选 | GamesByAI 仅索引；JamVault 只有 lander；vibejam 0 games；aibuiltgames／3jsbench 只有标题或空条目；部分索引无外链或只有摘要 |

### 1.1 读不到渠道的共同原因

- **Reddit**：`www.reddit.com`、`old.reddit.com`、`api.reddit.com` 连接 000／403，WebFetch 直接拒绝；`.json`／`.rss` 与 redlib、safereddit、r.jina.ai 镜像均失败；Arctic Shift 可用但常 Timeout／Too many requests，且部分原帖正文已删（OneMoreRun 全部 removed、Frost Rider 的 r/IndieDev 版、Ashen Wild）。r/vibecoding 的 Vibe Jam 2026 30 天 .io 开发复盘原帖读不到，只有 sorceress.games 的二手摘要，故未列为候选。
- **itch.io**：本机到 itch.io 及全部子域 TLS 握手失败（curl exit 35／000），WebFetch 返回 Socket is closed；Vibe Jam 2026 jam 页 404，Slapjam 条目列表抓取为空。Keep It Crispy 等只能从 jam 索引与作者原文交叉核，**未读原页**。
- **X／Twitter**：需登录，作者推文与实机视频无法读取；Astropilot 的实机视频只看到博客中的嵌入链接。
- **YouTube**：watch 页 HTML／元数据请求为空或连接关闭；按任务约束不播放视频，无法判定是否连续实机。
- **微信公众号**：多篇返回「当前环境异常，完成验证后即可继续访问」，正文与文内试玩卡片不可见。
- **知乎**：`zhuanlan.zhihu.com` 403，curl 只得反爬壳；群侠传万字复盘正文未读到，改用官方 Steam news 与商店页核对。
- **Bilibili**：桌面站与 `api.bilibili.com` 412；`m.bilibili.com` 只能拿到标题、作者、相关视频，简介与评论不 SSR；UP 主空间与合集页只返回标题。
- **Steam 社区**：`steamcommunity.com/games/...` 多次无输出／403／socket closed；改走 `store.steampowered.com/news/app/<id>/view/<gid>` 与 ISteamNews API 取正文。
- **WebSearch**：本会话 200／200 配额耗尽；后半程无法再用搜索引擎补 `site:reddit`、itch.io、B 站或微信查询。Bing 按中国区返回词典／问卷结果，DuckDuckGo／Brave 连接失败，Mojeek 需验证码。
- **GitHub REST API**：未认证速率限制用尽；改用 `raw.githubusercontent.com` 与网页读取，部分 issue／commit 页显示 0 结果或无提交历史。
- **Google Play／App Store**：`play.google.com` 及 APKPure／APKCombo 000；App Store 只返回通用壳。Last Lighthouse 商店页、版本号、截图原链与更新日期未核。
- **Cloudflare／TLS 拦截**：openai.com／Playco 403；playgroundarcade blocked；blockrift.io 403；brewedapps.com 403；nodetool.ai/gamedev 404；Flockbay 410／404；developers.meta.com TLS 失败；playground.google 跳登录。
- **其他站点**：Medium、V2EX、linux.do、Bluesky、Google 直连 TLS 握手失败或 000；即刻无公开站内搜索入口；小红书登录墙；Google Drive 截图未打开。

## 2. 筛选口径与等级

排序按任务门槛，不按热度、star、播放量或收录数：

1. **可玩入口**：当前可玩链接，或完整连续实机原页；只有宣传页、单张图或引擎 demo 不收。链接以本端实际可达为准：作者帖给出但本机 TLS 握手失败／000 的入口按未核处理（见 §5.2 Westbridge、Last Lighthouse）。
2. **作者过程**：作者原文／devlog／构建日志／长帖；平台转载与搜索摘要只作线索。
3. **作者静态截图**：能定位到作者公开原图 URL；只有相对路径或缺链的明确标注。
4. **版本与日期**：版本号与发布日期可查；未知就写未知。
5. **AI／人分工**：作者明确写 AI 做了什么、人做了什么；只写“AI 做的”降级。
6. **一次具体二改**：移动／瞄准／技能与菜单交接、触控／键鼠适配、HUD 遮挡／提示层级中的一次真实修改，且修改后有可玩版本或连续实机。
7. **许可与成本**：代码、资产、生成结果许可分开；成本未知不推算。

**等级只表示资料优先级，不是品质排名或完成验收。**

- **甲级**：7 项中只差 1 项且缺口可标注（截图直链、版本号或许可／成本未公开），且一次二改可核。
- **乙级**：有可玩入口、AI 参与已确认、作者过程与二改，但仍缺 2–3 项硬证据（分工、版本、许可、截图直链）。
- **丙级**：缺 4 项以上，或踩硬门槛（原作者身份、可玩入口不成立、AI 参与未确认、反馈只来自 AI agent 自评）；只有入口、问题侧、计划或二手摘要的也归此级。
- **丁级**：工具、做法、平台与索引，不是作品候选。

## 3. 结论：建议先深挖的 3 项，另有 2 项并列甲级

**先给结论。** 按任务门槛（可玩入口或完整连续实机、作者过程、作者静态截图、版本／日期、AI／人分工、一次具体二改、许可／成本未知项），本轮最值得先深挖三项：**Bichitos Rumble**（Vibe Jam 2026，移动端 HUD／输入判定与回归测试证据最完整，版本与资产许可分项最细；缺游戏画面截图直链）、**Exelio**（Steam 抢先体验，外部真人反馈→多次输入／UI 二改→可玩 demo 的链条最完整）、**Overlock**（触控／键鼠／菜单交接写得最细，版本与数值可复现）。若只试一款，先试 Bichitos Rumble；若要看“真人反馈怎样变成补丁”，先读 Exelio 的 DevLog #1／#2 与 Update 4／5。另有**元素突围**与**《梦境绮想》**按同样 7 项各只差许可／成本，列在 §3.4，按需选读。

**最强 1 项与可验证机制。** 优先试玩 **Bichitos Rumble**（<https://www.bichitosrumble.com>）。它记录的不是“再画一版 HUD”，而是把移动判定从只认 `innerWidth < 900` 改成 `hasTouchSupport() && (pointer:coarse || innerWidth < 900)`：宽度兜底保留，新增能力检测，并补 915×412 触控 smoke（只断言 `touch-mode`、摇杆与动作键可见）。这个机制可直接在现有 FPS／MOBA 的移动端入口验证：本轮建议在作者 smoke 之外再加 `visualViewport`、技能键不与摇杆重叠、暂停／背包关闭后不接受战斗输入三条断言；这三条只是建议，**本轮未执行**。

**严格按 7 项核，本轮没有一项全过；首选三项各差 1 项，§3.4 两项也各差 1 项。** Bichitos 缺作者游戏画面截图直链：`HUD_mejorado.png` 是 1024×1536 的 HUD 图标表（心、角色头像、钟、奖杯、音量等），BUILD_LOG 说明它由 `rebuild-hud-sheet.mjs` 生成，不是游戏内截图；仓库与官网也没有其他可引用的游戏内画面直链，`og-image.jpg` 是宣传图；作者在 itch 页 `napsoul.itch.io/bichitos-rumble`（id 4908248）上传过 cover 630×500 和 4 screenshots（BUILD_LOG 2026-08-18；2026-08-19 发布），本机 itch TLS 握手失败，未取到直链。Exelio、Overlock 则缺许可／成本：截图直链已补齐（Exelio 8 张、Overlock 博客 2 张），其余 6 项成立。群侠传的补丁原文与 11 张截图直链也已可读（见 §4 第 3 项），但仍留乙级：Steam 功能栏未列手柄支持，公告与商店字段不一致，需实机确认；许可／成本未写。

| 项 | 可玩入口 | 作者过程 | 截图 | 版本／日期 | AI／人分工 | 一次二改 | 许可／成本 |
|---|---|---|---|---|---|---|---|
| Bichitos Rumble | ✅ | ✅ BUILD_LOG | △ 截图直链未取到（仓库图为图标／纹理／角色渲染与宣传图；itch 有 cover＋4 screenshots） | ✅ v1.0（2026-05-01）→v1.11（2026-09-26） | ✅ 90%＋ | ✅ 触控判定＋HUD | ✅ 代码专有／9 个 GLB 已核／图标待核／成本未记 |
| Exelio | ✅ EA＋免费 demo | ✅ DevLog／Update | ✅ Steam 8 张直链 | ✅ EA 2026-03-04 | ✅ | ✅ 多轮 | △ 许可／成本未公开 |
| Overlock | ✅ | ✅ 作者博客 | ✅ 博客触控布局图直链 | ✅ v2.3.1（2026-09-29–10-04；博客 10-06） | ✅ | ✅ 数值级 | △ 许可／成本未写 |
| 元素突围 | ✅ gamesvibe 在线游玩 | ✅ B站简介＋v1–v15 记录 | ✅ 封面直链（游戏画面） | ✅ v1–v15（2026-08-01–08-07） | ✅ AI 生成基础版；人做数值／模式／地图与建模优化 | ✅ 键位／粘键／输入缓冲／手柄／横屏触控 | △ 代码 MIT／资产与生成结果许可、成本未标 |
| 梦境绮想 | ✅ TapTap 试玩 | ✅ 开发日志①–⑩ | ✅ 日志图＋TapTap 3 张截图 | ✅ v1.0.2（2026-10-18） | ✅ AI 生成／加内容，人试玩取舍与整合 | ✅ 战斗开场倒计时遮挡 | △ 许可未写 |

（表中的 ✅／△ 只表示本清单的门槛满足度，不是仓库的 ✅／🧪／👀／⛔ 工具评级。前三行是首选三项；后两行见 §3.4。）

### 3.1 Bichitos Rumble（Vibe Jam 2026，竞技场格斗）

- 可玩：<https://www.bichitosrumble.com>
- 作者过程：<https://github.com/RuFFuS4/bichitos-rumble/blob/main/BUILD_LOG.md>
- 作者截图：**仓库／官网无可引用游戏画面直链**。仓库有 84 张图，但都是 HUD／技能图标、腰带、天空盒、地面纹理和 Blender 角色渲染：<https://raw.githubusercontent.com/RuFFuS4/bichitos-rumble/main/HUD_mejorado.png>（1024×1536 HUD 图标表，由 `scripts/rebuild-hud-sheet.mjs` 生成）、`public/images/belts/*.webp`、`public/images/skyboxes/*.webp`、`tools/blender-mcp/*.png` 等；`public/og-image.jpg` 是宣传图。作者在 itch 页 `napsoul.itch.io/bichitos-rumble`（id 4908248）上传过 cover 630×500 和 4 screenshots（BUILD_LOG 2026-08-18；2026-08-19 发布）；本机 itch TLS 握手失败，未取到直链。按门槛 3 记 △。
- 版本／日期：`v1.0-vibejam-submit`（2026-05-01，Vibe Jam 提交版）→ `v1.11-caida-sierra`（2026-09-26）；含该 HUD／触控修复的是 `v1.8-terreno-v2`（tag 2026-09-24，`src/input.ts` 已有 `pointer: coarse`，`tests/smoke.spec.ts` 已有 915×412 用例；BUILD_LOG 的 v1.8 发布记录列有 “HUD en móvil”；`v1.7-h4-social` 两者都没有），`v1.10-paso-fijo`（2026-09-25）也包含这段代码。标签页 <https://github.com/RuFFuS4/bichitos-rumble/tags>；BUILD_LOG 有 v1.7–v1.10 的发布记录，v1.11 见标签与提交说明。
- AI／人分工：90%＋ 代码由 AI 写；人类负责人 Rafa 选方案。
- 许可／成本：代码专有、全保留（LICENSE）；9 个 critter GLB 在 Tripo／Meshy 付费计划下生成，商用权已核、无需署名（仍需归档付费凭证）；腰带／badge／HUD 图标等仍标 ⚠️ 待核；成本金额未记。见 <https://github.com/RuFFuS4/bichitos-rumble/blob/main/ASSET_LICENSES.md>。

**一次具体二改。** 大屏手机因只按 `innerWidth<900` 被判成桌面 HUD，触控玩家没有摇杆；作者把 `hasTouchSupport() && innerWidth<900` 改成 `hasTouchSupport() && (pointer:coarse || innerWidth<900)`，宽度兜底保留，不是替换；并补 915×412 触控 smoke（`touch-mode`、摇杆与动作键可见）。触控技能键补冷却徽章、四角生命、受阻态变灰。

**为什么最值得挖。** 这是本轮移动端 HUD／输入闭环证据最完整的样本：可玩站＋构建日志＋版本标签＋资产许可分项，加上一个移动端 HUD／输入 bug 与回归测试。它把问题落在**输入能力判定**而不是再画一版界面：设备宽度不能单独代表有没有摇杆，`pointer:coarse` 要作为补充条件；并且把目标视口写进 smoke，避免“只在作者手机上好看”。对 MOBA／FPS 的移动端 HUD，虚拟摇杆、技能键冷却／受阻态、生命值锚点都能直接照这个检查顺序做。

**适用边界。** 这是浏览器端 DOM／CSS／Playwright 判定；Unity／Unreal 需换成各自 Input System 的触摸／指针能力检测与安全区／分辨率 smoke，不能照抄代码。若你的问题是按键布局、遮挡或提示层级而不是设备宽度误判，先看 Exelio 的误触判定或 Overlock 的触控布局。

**缺口。** 缺作者游戏画面截图直链，需从 itch 页补（4 张已上传，本机 TLS 失败）；BUILD_LOG 是否覆盖全部改动未核；腰带／badge／HUD 图标等资产许可待核（9 个 critter GLB 已核）；本端未启动游戏，实际手感、帧率、触控延迟未验。

### 3.2 Exelio（AI Frog Interactive，Steam 抢先体验）

- 可玩：Steam 抢先体验 2026-03-04 上线，有免费 demo（商店 app 2465510）。
- 作者过程：DevLog #1 <https://store.steampowered.com/news/app/2465510/view/1824644522837630>、DevLog #2 <https://store.steampowered.com/news/app/2465510/view/1825093633186904>、Update 4 <https://store.steampowered.com/news/app/2465510/view/1830797770230482>、Update 5 <https://store.steampowered.com/news/app/2465510/view/1833968530890117>；新闻索引 <https://store.steampowered.com/news/app/2465510>。
- 作者截图：Steam `appdetails` 返回 8 张作者截图直链，如 <https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2465510/abcefe69b777deb7700081260510d65f3bdb84cd/ss_abcefe69b777deb7700081260510d65f3bdb84cd.1920x1080.jpg>。
- 版本／日期：EA 2026-03-04；Update 4 为 2026-04-22；Update 5 为 2026-05-29。
- AI／人分工：AI 造星球、写底层代码；人保留跑跳手感、负责设计与验收。
- 许可／成本：未公开。

**一次具体二改（多轮）。** DevLog #1 明说“AI 造星球、写底层代码，人保留跑跳手感”；DevLog #2 记录 TGS 2025 demo 玩家反复说“画面漂亮但不懂操作”、QA 指出“慌乱时这个按键布局会按错”“每次打开背包都回到顶部”，随后缩短拾取动画、加采集引导、记住已做配方。Update 4 按 Early Access 评价里的最高频问题重建跑酷误触判定：只有矮墙才触发跨栏，Side Wall Run 先做 forward Trace。Update 5 按“不知道要多少材料／暗场景看不清”在 8 个制作界面加所需材料清单并改显示。

**为什么最值得挖。** 它同时有**外部真人反馈**（展会玩家、QA、EA 评价）、**多次输入／UI 改动**和**可玩商业版本**，是本轮最完整的“反馈→补丁→可玩”链。可迁移的不是具体键位，而是两条判断：把高频误触改成有前置条件的判定（矮墙才跨栏、先做 forward Trace），以及把资源需求前置到操作发生前的界面（材料清单）。这两条都能在现有 FPS／MOBA 的训练关或制作／商店界面做窄验证。

**缺口。** 许可与成本未公开（列一项）；本端未启动 demo，实际按键布局、跑酷判定与材料界面未验。

### 3.3 Overlock（이준혁／bnbong，Godot 网页赛车）

- 可玩：<https://overlock.bnbong.com>
- 作者过程：<https://bnbong.com/blog/20261006-overlock-v2/>
- 作者截图：同页触控布局实机图 <https://bnbong.com/blog/20261006-overlock-v2/overlock_touch_layout.png>、改前／改后手部图 <https://bnbong.com/blog/20261006-overlock-v2/overlock_before_after_hands.jpg>。
- 版本／日期：v2.3.1（2026-09-29–10-04 间发布；博客发文 2026-10-06）。
- AI／人分工：Codex 出计划、概念与资产；Claude Fable 在隔离 worktree 分给两个 Opus worker；317 项回归后作者本人试玩再调手部比例。
- 许可／成本：未写。

**一次具体二改（数值级）。** v1.2.0 才补触屏：触控复用同一 `InputEventAction` 路径，多点触控直接跟踪 touch index，按钮判定比视觉大 8px，并修了场景重载后按键卡住。v2.2.1 把菜单／结果／设置／排行榜改成触屏布局，转向键从 112→128→144px。v2.3.1 修移动端昵称框不弹虚拟键盘，并加“推荐名字”按钮。

**为什么最值得挖。** 它把触控、键鼠与菜单三条输入路径的交接写得最细，而且给了可复现的数值与版本。对 MOBA／FPS 的直接对照是：统一动作映射而非复制两套输入、按 touch index 跟踪多点触控、命中区大于视觉、场景重载／失焦后的按键清理、菜单与战斗的焦点交接、移动端软键盘。这些都不是画面问题，而是“输入循环是否闭合”的问题。

**缺口。** 许可与成本未写（列一项）；本端未启动游戏，触控手感与手部比例未验。

**为什么是这三项。** Bichitos 给出最干净的“输入能力判定＋回归测试”样本；Exelio 给出最完整的外部真人反馈到商业可玩版本的链条；Overlock 给出最细的触控／键鼠／菜单交接与数值。三者分别覆盖移动端 HUD、动作游戏的误触与引导、桌面／移动输入统一，互补且都不依赖同一引擎。次选替换见 §4：Scarred Steel（HUD／信息层级）、Splash Olympics（全 AI 代码＋逐版真人试玩）、星尘战线（49 版多输入适配）、PolyForge Arena（FPS 触控 56px 压键与浮动摇杆）。

### 3.4 另两项按 7 项门槛各只差许可／成本（甲级，不列首选）

这两项与上面三项同属甲级：7 项里只差许可／成本，且都有可玩版本和一次具体 UI／输入修改。不列首选是因为二改证据更薄：元素突围只有版本记录和封面，梦境绮想只有单张静态图、缺二改前后对比；按 §2 仍是甲级，但不如前三项适合先深挖。

- **元素突围** — <https://gamesvibe.app/works/wfwcO0CiuvSpfhYKkcx_E>，B 站 <https://www.bilibili.com/video/BV1h23Z6jEKj>（页面“在 B站观看”指向该视频）。VibeHub 肉鸽 FPS，作者叁七；页面记录 2026-08-01 首发、08-07 更新到 v15，v10–v15 连续修自定义键位、粘键／输入中断、输入缓冲、手柄、横屏虚拟按键和触屏灵敏度基准。B 站简介写明基础版本由 dsv4 生成、作者再做数值／模式／地图与 Gemini 3.1 Pro 建模优化；这就是 AI／人分工，不再算缺口。封面是游戏内画面直链：<https://assets.gamesvibe.app/media/covers/wfwcO0CiuvSpfhYKkcx_E/zCKmn3QD9y598L2fTqycZ.webp>。代码 MIT（<https://github.com/Sanqi-normal/yuansuzhanzheng/blob/master/LICENSE>）；资产、生成结果许可与成本未标，是唯一缺口。本端未实机。
- **《梦境绮想》** — <https://www.taptap.cn/moment/860615056319055488>，可玩 <https://www.taptap.cn/app/972084>（v1.0.2，2026-10-18；TapTap 页显示玩家评分 9.4）。AI 参与：日志⑧记录与 AI 协同调战斗开场倒计时——AI 加内容，作者试玩后判断“挡住战场”并删掉底板／阴影／长提示；日志④用 GPT 准备角色参考与动作要求、Seedance 生成纸片动画、作者挑选片段；商店页称“AI 帮我们尝试了很多可能，但把它们变成游戏，还是需要慢慢做、慢慢调”。这写明了 AI 生成／加内容、人试玩取舍与整合，分工不再算缺口。日志图直链（游戏画面，“准备战斗 3”倒计时）：<https://img2-tc.tapimg.com/moment/etag/FmTTjkh2txEaiPb7zjjwc6_kWzv3_20261017201553.png>。许可未写，是唯一缺口。本端未实机。

**中文侧除梦境绮想外为什么没有进甲级。** 梦境绮想只差许可，已列 §3.4；群侠传的 V0.2.0 官方补丁原文可用 ISteamNews 读取（不是此前误记的验证码拦截），Steam `appdetails` 也有 11 张截图直链；但它仍留乙级，理由是两个真实缺口：Steam 功能栏未列 Full controller support（categories 只有单人／成就／云存档／家庭共享），公告“全手柄”与商店字段不一致，需实机确认；许可／成本未写（列一项）。WELL 的 HUD 遮挡与长按拆分有一手日志和试玩 demo，但没有版本号、AI／人分工只有一句、许可未写；灯烬有版本与试玩，但 TapTap 页与 B 站简介都没写 AI 与人工分工，因此列在 §5.2 丙级。群侠传、WELL 保留在乙级。

## 4. 乙级：接近门槛，仍缺 2–3 项（12 项）

本节按“离门槛还差几项”排序；每项末标缺口数与具体项。只差 1 项的在 §3（含 §3.4）；缺 4 项以上或踩硬门槛（原作者身份、可玩入口不成立、AI 参与未确认、反馈只来自 AI agent 自评）的已移到 §5.2。

1. **Astropilot VR** — <https://www.mikekasberg.com/blog/2026/06/04/vibe-jam-2026-astropilot.html>。手机姿态控制飞行；作者自述“完全没有用速度控制”（`I wasn't using the speed control at all`），于是删掉速度控制、改为恒定速度的 Flappy Bird 式回路；首版由一段提示生成可玩原型，改成恒定速度是其后一次重构（约十分钟写提示、基本一次成功）；可玩 <https://astropilot.mikekasberg.com>，MIT，约 20 美元 OpenCode 额度，仓库含 AGENTS.md 四元数约束；头图 <https://www.mikekasberg.com/images/posts/vibe-jam-2026-astropilot-full.jpg>。缺口（2 项）：博文未明写 AI／人各做什么；无版本号。
2. **Scarred Steel** — <https://store.steampowered.com/news/app/3952140/view/1811772772339803>。零编程经验单人用 AI／Cursor 做的战术 RPG，2026-03-15 已在 Steam 发售并有 demo；DevLog #8／#11／#12 连续记录“战斗场景难看到尴尬”，整块重建角色详情面板并把 HUD 换成接近 Darkest Dungeon 的布局；#31 用纸笔做激进试玩，发现新玩家不知道如何追踪议会进度；#33 加破甲／反击 UI 弹窗并逐个测试剑斧动作。缺口（2 项）：截图未逐张提取直链（Steam `appdetails` 有 10 张可达）；模型／资产许可、成本未公开。
3. **群侠传：幸存者** — <https://store.steampowered.com/app/4957110/>。Nenly Studio 单人开发，2026-08-11 Steam 免费抢先体验，当前 V0.2.3（2026-10-26）。官方 V0.2.0 补丁 <https://store.steampowered.com/news/app/4957110/view/1845383656379625>（2026-10-01）可由 ISteamNews `GetNewsForApp`（`appid=4957110`）读取全文；Steam `appdetails` 返回 11 张作者截图直链，如 <https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4957110/5f5dcc5771ac288ef76cd3c6c8e09084aa9b0efa/ss_5f5dcc5771ac288ef76cd3c6c8e09084aa9b0efa.1920x1080.jpg>。商店页作者自述团队只有一人：代码用 Codex／Claude Code，角色／场景／UI 用 GPT-IMAGE-2／Nano Banana，动画 Seedance，音乐 Suno，音效用 ElevenLabs；本人负责设计、平衡、手感与数百次试玩。V0.2.0 按玩家“想要手柄”的反馈补全战斗、整备、选人、主菜单、图鉴、江湖录、设置、武学页拖拽排序、对白快进的全手柄操作；按键图标随当前设备切换，底部加操作提示条，设置加“键位一览”，最后一只手柄断开时战斗自动暂停；同时加 UI 标准／大／特大三档、提高低分辨率最小字号、闪身冷却再按红闪。缺口（2 项）：Steam 功能栏未列 Full controller support（categories 只有单人／成就／云存档／家庭共享），公告与商店字段不一致，需实机确认；许可／成本未写。
4. **Splash Olympics** — <https://goodaiguide.com/possible/splash-olympics/>。2026-10 案例：作者 Fabian Mösli（GoodAIGuide）以第一人称记录，AI（Grok Bot）写全部代码、图形和声音，他逐版试玩并按“哪里不好玩／不好操作”反馈；五个版本分别修核心回路、300km 以上镜头脱靶、池底致命判定与计分、下坠加速与速度拉远镜头、记录提示和音效；AI 另用无头浏览器自动试玩、截图、查错和 60fps 目标。日志图直链 <https://goodaiguide.com/images/possible/splash-olympics.webp>（游戏画面）。缺口（2 项）：无版本号；许可／成本未写。
5. **星尘战线 Stardust Frontline V2.3** — <https://gamesvibe.app/works/1k38GPaU_eUdD6bp2ZQ1h>。49 条版本记录把全流程手柄、按键提示随键鼠／手柄／触控切换、双浮动摇杆、12 控件移动 HUD 编辑器、Boss 血条不挡暂停键逐项修到真机；工作页披露 AI 代码／配乐／配音／生图，并有在线试玩与截图。缺口（3 项）：人工分工与许可未细分；截图已见但未提取直链；在线试玩未实机。
6. **PolyForge Arena** — <https://gamesvibe.app/works/PXOW23WPsKBPjtH_GELTF>。AI 共创的浏览器 P2P FPS（作者 h0to9，页面标 Codex／Claude Code／DeepSeek 与 token 消耗）；作者在 FIXES.md 逐条记录实机反馈后的输入／UI 修复：竖屏摇杆压住切枪键 56px、固定摇杆改浮动、触控灵敏度与 ADS、按钮层 12→7、滑动手指跟踪 28px，版本 v3→v27 有日期；FIXES.md <https://github.com/Hotsteel2901/PolyForge-Arena/blob/main/FIXES.md>，代码 AGPL-3.0（<https://github.com/Hotsteel2901/PolyForge-Arena/blob/main/LICENSE>）。封面与截图直链（游戏画面）：<https://assets.gamesvibe.app/media/covers/projects/Xx-j0smb2G8I6Qrj62IJ8/231dea02adab85ff243e2595ab14a9942826cc35818673590d9d6300a0a69b19.webp>、<https://assets.gamesvibe.app/media/screenshots/projects/Xx-j0smb2G8I6Qrj62IJ8/2c0fa7e8fce8ae73e423591846a879878596d51a4b0fb21074df2f62f057332a.webp>。缺口（2 项）：AI／人分工未细分；资产、生成结果许可与成本未写。另本端未实机。
7. **WELL** — <https://www.taptap.cn/app/957589>，日志 <https://www.taptap.cn/moment/861030586653871633>、<https://www.taptap.cn/moment/861417581058199325>。TapTap 制造创作者 Lilll_1，游戏页声明“含使用 AI 生成的游戏资产”，有试玩 DEMO。日志 4 记录“UI 按键在手机端过大，会严重遮挡视线”后重做整个界面骨架：技能键紧贴摇杆和跳跃键、右上五个功能键排成三行网格、所有弹窗删掉“关闭／取消”改为点弹窗外草地淡出；日志 5 把长按拆成 0.5 秒拖动＝拎起、2 秒不动＝挤奶／薅毛，并处理手机右上收纳菜单不挡视野、iOS 图标恢复、弹窗盖过雨滴特效。日志内图直链（TapTap CDN，游戏画面，可见左下摇杆与右侧卡牌图鉴遮挡）：<https://img2-tc.tapimg.com/moment/etag/FoQppjew95OyGf8EH4AoGm5NoyBt_20261018234808.jpg>。缺口（3 项）：无版本号；AI／人分工只有一句；许可未写。
8. **Sector Dive／Sector Dive EX** — <https://blog.beatdjam.com/entry/2026/10/03/113000>，可玩 <https://beatdjam.github.io/mini-games/games/sector-dive/>，EX 更新页 <https://beatdjam.github.io/mini-games/games/sector-dive-ex/updates.html>。浏览器 3D 肉鸽 FPS，实现由 Claude Code 完成、作者出概念和试玩反馈；按试玩加入手机触控、全屏和按钮位置编辑，发售后按玩家报告的 Boss／升级 bug 回修；EX 按日记录手机端按住冲刺后松手仍奔跑、3D 地图双指缩放／拖拽与 M 键开图、文字按钮改图标、Boss 血条移位、选芯片时枪口／视角错位。缺口（3 项）：无版本号与仓库级许可；截图未给；EX 页未重复署名。
9. **战争雷霆网页版 war-thunder-web** — <https://gamesvibe.app/works/UXwjmtqc1TfxMdfzSfbEf>。评论里玩家要求手机适配后，v4 加开始界面与手机端、v5 加自定义手机键位、v8 修开镜弹种面板挡移动摇杆、v9 加飞机 HUD；作者自述用 GLM 手写轻量 Web 渲染引擎。封面与游戏画面直链：<https://assets.gamesvibe.app/media/covers/UXwjmtqc1TfxMdfzSfbEf/1790326832551_9OOa4rOcaGD-jUdyUxfa3.webp>（标题画面）、<https://assets.gamesvibe.app/media/screenshots/UXwjmtqc1TfxMdfzSfbEf/1790078587879_qAEnbSVfHnLjSTAAtR7zM.webp>（游戏画面）。缺口（2 项）：模型版本与资产许可未披露；AI／人分工不细。截图有静态直链但缺二改前后对比。
10. **《涌现之野》** — <https://www.taptap.cn/moment/864537750370519967>。单人用 TapTap 制造做，日志⑤把 UI/UX 分工写得很具体：作者用参考图定调性、写规格文档防跑偏，先让 AI 用灰盒图标把地图缩放、平移、虚线指引、背包、快捷栏的路由和布局跑通 23/23，再换正式美术；另做字号三档、色弱双通道、左手镜像、安全区四项无障碍和命中顿帧／屏震；版本 1.0.94→1.0.185，有可试玩页 <https://www.taptap.cn/app/953696>。日志内图直链 <https://img2-tc.tapimg.com/moment/etag/FnRr4p0nbdWab8N5KqZesP871kcS_20261028155247.png>（岛屿地图界面；有静态图，缺二改前后对比）。缺口（2 项）：分工只写到 UI/UX，玩法／战斗代码由谁写未写；许可未写。
11. **Claude of Duty／Dust Corridor** — <https://github.com/Leonxlnx/claude-of-duty/blob/main/HANDOFF.md>。Leonxlnx 仓库的浏览器战术 FPS：README 标题为 Dust Corridor、package 名 `dust-corridor`，Three.js r180，MIT（`LICENSE`，Copyright 2026 Leonxlnx）；HANDOFF 无单独署名，随 Leonxlnx 仓库提交（HEAD 作者 Leonxlnx），是该仓库的维护交接文档，记录 Esc 结束 pointer lock 后游戏仍停在 playing、没有暂停菜单，下一次点击又把鼠标锁回去；修复为监听 pointerlockchange／error、删掉隐式重锁、暂停菜单支持 Enter 恢复／Q 放弃，并让所有按键可在 Settings 重映射。与 mshumer 的 Claude of Duty 是两件同名作品：两者提示词、文件树与 package 名不同，核对后无共享源码；mshumer 版 README 自称约 55k 行、11 个子系统，本项引的是 Leonxlnx 的 Dust Corridor。可玩镜像 <https://claude-of-duty.skillsafe.ai>（页面标题 DUST CORRIDOR）。缺口（2 项）：仓库没有作者公开截图；版本号未给（HANDOFF 记 2026-08-08 测试全绿，HEAD 提交 2026-08-09）。
12. **ASHFALL／CallOfAcher** — <https://blog.mathieuacher.com/CallOfAcherFIFAcherJeuxIAEN/>。Claude Code 多智能体一周做出的浏览器 FPS（教授带 10 岁侄子，60 条人类请求、92 个子代理）；手柄与手机触控摇杆是后加输入路径，作者明确说灵敏度／手感调了数十轮且这是 Agent 最不擅长的部分，评审 Agent 只截屏不试玩所以真人一眼能看出的问题仍漏；可玩 <https://blog.mathieuacher.com/ashfall/>、源码 <https://github.com/acherm/ashfall>，仓库截图如 <https://raw.githubusercontent.com/acherm/ashfall/main/shots-city/combat.png>（游戏画面，带罗盘与弹药 HUD）。缺口（2 项）：版本号／许可未写。另本端未实机。

## 5. 丙级：只作线索（按缺口分组）

### 5.1 有可玩入口，但缺一次具体的输入／UI 二改

- **Undead Siege 3D** — <https://github.com/Torantulino/undead-siege-3d>。Vibe Jam 2026 僵尸 FPS，README 列出完整触控方案（虚拟摇杆移动、拖拽转视角、开火／换弹／交互／近战／换枪按钮），称 100% AI 代码（AutoPilot／AutoGPT）；可玩 <https://itsababseh.github.io/undead-siege-3d/>，图 <https://raw.githubusercontent.com/Torantulino/undead-siege-3d/main/og-image.png>。缺口：未见修改前后版本，也没有许可文件，只能当 FPS 触控线索。
- **Robot Shooter** — <https://www.reddit.com/r/aigamedev/comments/1x6o99v/update_the_godot_fps_i_built_with_opus_55_is_out/>。几乎全由 Claude 写成的 Godot 4.7 FPS roguelite，三区 11 房 3 Boss，免费 Windows 版 <https://kodblue.itch.io/robot-shooter>；作者只笼统说“改进了很多”，没有一次具体的操作／HUD 二改。
- **SPC World** — <https://www.reddit.com/r/aigamedev/comments/1xi9vea/spc_world_the_hard_part_of_my_aiassisted_browser/>。测试者反馈“选中与旋转行为不对”后改为复现真实输入序列（含触控布局与半填棋盘），保留 normal-input 浏览器测试；可玩 <https://spcworld.world/play?size=quick>。缺口：拼图非动作游戏，AI 只称“参与开发”未给分工。
- **BLOCKRIFT** — <https://www.reddit.com/r/aigamedev/comments/1x5ozc7/went_quiet_for_a_week_to_fix_how_my_guns_sit_on/>。浏览器竞技 FPS；20 把枪过半悬浮／穿插／尺寸错误，作者做了游戏内 live weapon tuner（髋部 x/y/z＋pitch/yaw/roll、ADS 距离／偏移／缩放、准星与枪口打点、冻结 bot、同类复制）；当前免费 <https://blockrift.io>。缺口：作者只明确 AI 用于 Meshy／Tripo 资产，代码是否 AI 写未写明；站点本机 Cloudflare 403。
- **Night Reclaim** — <https://www.reddit.com/r/aigamedev/comments/1wgy51r/building_night_reclaim_with_codex_the_save_and/>。首层可玩的浏览器射击，Codex 承担大部分实现、图像工具出角色／敌人／房间美术；作者记录按 Esc 关背包会在遮罩后继续战斗，属于输入与状态交接缺陷，已改并复测；移动与射击使用分离的触控指针，但只在浏览器模拟多点测试、未上真机。缺口：发帖账号同日为 ArcadePick 三款游戏发同一格式帖，原作者身份待核；arcadepick.xyz 本机 000。
- **Zephyria** — <https://www.reddit.com/r/aigamedev/comments/1xlx5ot/before_vs_now_my_railshooter_game_after_several/>。Claude Opus 5.5 写码、Blender 做模型的轨道射击；11-02 的 before/now devlog 列了 UI 重做与新增教学关，7 月另有 game feel 专集 <https://www.reddit.com/r/vibecoding/comments/1v8ypli/>。缺口：只有 YouTube 开发日志 <https://www.youtube.com/watch?v=SDzv0qFUP2U>，无可玩链接或完整连续实机原页。
- **Falltasy** — <https://www.reddit.com/r/aigamedev/comments/1xlhv95/im_losing_every_new_player_in_my_mobile_strategy/>。作者自述 Claude Code 写游戏、Midjourney 出精灵与背景，新玩家几乎全流失，正在“短规则屏／脚本首关／情境提示”三种教学方案间选择；itch 有可玩首关 <https://madmanu77.itch.io/falltasy>。缺口：二改尚未发生；itch 本机 000。
- **Sonic Adventures** — <https://www.reddit.com/r/aigamedev/comments/1x53icv/building_a_russianlanguage_educational_platformer/>。ChatGPT／Codex 实现代码、浏览器版与 Android 打包，作者定方向并在 Android 真机测试；从早期版本重做成 2D 平台冒险，含五世界 15 个活动与触控操作，浏览器入口 <https://elkin-oskol.github.io/-_-/>。缺口：二改是整体重做而非一次具体输入／UI 修复；该地址本机 404。
- **Poached** — <https://www.reddit.com/r/aigamedev/comments/1xefux2/ran_my_first_playtest_here_is_what_i_learned/>。12v12 MOBA×CTF，20 人首测后按反馈改信息层级：公告从满屏砍到只留“first crack／omelette”等大事件、可破坏树石加描边、被瞄准时红描边、简化地图布局并统一 HUD。缺口：demo 只在评论／私信发链接，<https://eggverse.co> 公开页未见 Poached；AI 只明确用于汇总反馈。
- **Frost Rider** — <https://www.reddit.com/r/aigamedev/comments/1x9434i/devlog_1_of_a_mobile_kart_racer_im_building_with/>。最具体的触控二改记录：真机上拇指滑出左右小键、道具键在漂移键上方够不到，改为左下整块转向板（位置即转向量）、道具紧贴漂移、仅触控的转向辅助；AI 写 PlayMode 测试量“松手后几秒离路”，村庄 6.0→22.0 秒、松林 8.2→17.5 秒。缺口：尚无公开可玩版（2027-03 上线），只有 before/after 图集 <https://www.reddit.com/gallery/1x943h7>，按门槛只能作强线索。
- **Limina** — <https://www.reddit.com/r/aigamedev/comments/1xnopb2/the_hardest_part_of_my_game_was_actually_refining/>。家人看不懂说明后，把说明书换成“先猜两次、边玩边解释线索”的 starter puzzle；免费浏览器可玩 <https://liminawordgame.com/>。缺口：AI 只写“能快速重做很多版本”，人机分工不清，且非动作游戏。
- **RoyalCraft** — <https://www.reddit.com/r/aigamedev/comments/1xftofz/i_shipped_a_realtime_1v1_mobile_strategy_game/>。已上线的移动 1v1 策略，Claude Code 写大部分客户端／服务端；做了逐屏、逐语言、逐分辨率的编辑器工具检查文字裁切与重叠，并记录 iOS 字体引擎吃 2GB 的仅真机问题。缺口：发布复盘，没有一次针对操作或 HUD 的修改前后。
- **Superpower Sandbox** — <https://www.reddit.com/r/aigamedev/comments/1x9d7fb/solo_dev_openworld_superpower_sandbox_in_unreal/>。6 周、830 commits 中约 490 条 Claude 共同署名，作者设计、审 PR、试玩；有免费 Steam playtest 与自动化 soak／崩溃收集。缺口：没有输入／UI 修改记录，只作分工与验收参考。
- **HUD moments** — <https://www.reddit.com/r/aigamedev/comments/1xnqhs6/claude_placed_my_hud_fine_it_never_decided_when/>。首版三件 HUD 放角落没问题，但没定义显示时机；第二版明确血条／弹药 3 秒无变化淡出、变化或低血立即回来、5% 安全边距，并写“任何元素进入屏幕中央即失败”的测试。缺口：单提示组件测试，不是完整游戏。
- **翻面 FLIPSIDE** — <https://www.taptap.cn/app/1000462>。AI 制作的黑白手绘 FPS，TapTap 测试 8.2 分 60 条评价；评论集中报真实输入问题：PC 右键与手机 ADS 按钮都无法开镜、只有狙击能开镜、投掷物后自动把枪换掉、小地图信息不清、手机／PC 都卡顿；开发者只公开回应了存档问题。缺口：只有问题侧，尚未见开镜修复记录。
- **苍穹浩瀚** — <https://www.taptap.cn/review/49003797>。玩家对一款 AI 制作的 3D 科幻飞行射击的长评：认可 AI 画面但指出第三人称飞到一定程度会挡视线、没有击中音效只有画面、弹道固定且不能升级、能量耗尽不能开火，并建议加第一／第三人称切换；游戏页 <https://www.taptap.cn/app/866592>。缺口：作者是否据此改过未核到。
- **小药瓶** — <https://www.taptap.cn/app/962141>。美术与代码均 100% 由 AI 生成、关卡 99% 由人制作，Web Canvas＋Tauri 打包 Windows／Android 并有试玩 demo；核心机制是把血条从 HUD 上拔下来当木板、灯和台阶。缺口：这是 HUD 与玩法结合的设计，不是一次输入／UI 二改。
- **少女大战猫猫** — <https://www.taptap.cn/app/963609>。聚光灯 GameJam 可玩 demo，页面声明含 AI 生成资产；玩法要求部署少女、在 Boss 战踩拍格挡，覆盖节奏输入与攻击提示层级。缺口：无作者制作过程与具体二改。
- **探访神明** — <https://www.taptap.cn/app/887321>。与《炼金术魔女》同作者，TapTap 页明确“部分美术音乐初始素材由 AI 生成”，PC demo 可玩 40–60 分钟；B 站实机演示说明教学战专门讲轻重攻击、远近武器切换、走位、倒地追击与招架破防。缺口：只有教学覆盖，没有一次具体修改记录。
- **火力不足恐惧症** — <https://www.taptap.cn/app/972285>。聚光灯 jam 的 PC demo，v0.1.2 新增“智能火控”自动选目标并齐射、明确“无需手动瞄准”。缺口：页面未写 AI 披露，需先核是否属 AI 制作。
- **粘液浪潮** — <https://www.taptap.cn/moment/855767650691712383>。2026-10-05 日志说首次加左下虚拟摇杆＋右下药剂／法术／冲刺／攻击四键后，真机试玩发现“按钮太小、不好按”，手指容易按偏或误触，计划下期调尺寸和间距。缺口：只到计划，没有改后可玩版本；AI 参与未说明。
- **霓虹幸存者** — <https://www.taptap.cn/moment/808066772291813872>。TapTap 制造＋作者自述用 DeepSeek v4 flash 重构的街机射击；5/25 更新加入“自动瞄准”开关和手机虚拟摇杆，后续修手机切歌键无法点击、设置后未立即暂停、受伤时飞船顶部短暂血条，8/04 加图形质量档位；可玩 <https://www.taptap.cn/app/860949>。缺口：AI 分工只有一句重构说明，且不是 FPS。
- **Pull the Plug** — <https://ennui92.github.io/ermis-dev/posts/pull-the-plug-day-9.html>。AI 辅助横版动作平台：Day 9 从 Prelude 玩到 Mission 3 后列了约十几个问题、46 个 commit 修复，包括弹跳板不发射、电梯门条纹方向错、Mission 2 水像整块上移、Mission 3 陷阱待机不可见、目标塔只在最后区域可见、绿底平台对比太低；还立了“视觉验证必须截图”的长期规则。缺口：目前只有 waitlist，没有公开可玩版本。
- **BANG BANG** — <https://qiita.com/JUN-ai/items/ad05897ba1fd2709e6af>。Claude Code 写大部分代码的浏览器 FPS，作者按自测给手机加左虚拟摇杆、右半屏拖视角、独立动作键和情境攀爬键，并因移动端低于 20fps 把瞄准辅助射线降到每 4 帧一次、砍点光源。缺口：文中 play 链接 <https://code-worldweb-production.up.railway.app/world> 现返回 404。
- **Arena Zero** — <https://aibrowsergames.app/play/arena-zero>。ABG 用 Claude Code 做的浏览器 3D 竞技射击，鼠标原始瞄准与手机双摇杆＋轻辅助瞄准分开设计，页面自承设备兼容仍待测。缺口：未给试玩修订记录。
- **Getaway Grid** — <https://aibrowsergames.app/play/getaway-grid/how-we-made-it>。同站原创；制作说明按序列出城市生成→车辆物理→警察→拾取→触控→每日种子，并说明 HUD 的离屏拾取指示、计时与热度条。缺口：未写触控改前问题与迭代次数。
- **Kickflip Rush** — <https://aibrowsergames.app/play/kickflip-rush/how-we-made-it>。同站原创滑板游戏；制作顺序含触屏滑动出招，画面用 Phaser FIT 从手机到宽屏做 letterbox 适配。缺口：同样缺少前后对比。
- **Street Kings: Last Stand** — <https://buildwithstar.com/games/89536485-704c-4d94-a64f-34c6e4681949>。Star Fight Week 2026 第一名（2026-06 更新），评审词称其连招／抓取经过打磨且是唯一支持手柄的参赛作品。缺口：游戏页未写控制方案，手柄声明需实机复核。
- **Emberwick** — <https://simonw.github.io/emberwick/v11/emberwick.html>。Simon Willison 用 Claude 全生成的 top-down RPG，v01→v11 有版本链接与试玩修 bug，最终版含 Journal／Map／Build 多层 UI 和相机遮挡透明。缺口：操作以键鼠为主，不是触控／动作输入案例。
- **成龙历险记** — <https://gamesvibe.app/works/K65I6PfoNijyO9aeXb23a>。v2 增补操作说明与 credits 入口、v4 补基础操作说明，并把 HUD 图标拆分按需加载。缺口：针对上手信息做过 UI 二改，但未说明 AI 分工。
- **CS Football** — <https://gamesvibe.app/works/2uaaxo4yN-O7iRnmJ3JWT>。Marco Taylor 用 Claude Code 做的 2v2–5v5 在线 FPS，含雷达、购买菜单、记分板和回合伤害反馈。缺口：v1–v3 只有部署改动，未见输入二改。
- **Gaussian Splatting FPS** — <https://blog.playcanvas.com/turning-a-gaussian-splat-into-a-videogame/>。作者完整复盘在 Gaussian Splat 真实扫描场景里补碰撞体、流式 LOD、光照探针和导航网格并给出可玩 demo <https://playcanv.as/p/qxGSuzYq/>。缺口：未记录输入或 UI 迭代。
- **Quasar Saz** — <https://www.calebleak.com/posts/dog-game/>。作者长文记录早期 AI 生成游戏控制不可用、UI 错乱，随后加脚本化输入回放、截图、场景／着色器 lint，并同时发布狗狗原始 v1.0 与人修 v1.1。缺口：不是 FPS／MOBA，人修只动 bug／视觉不动玩法。
- **Zero Operation** — <https://gamesvibe.app/works/sld7kN2DtWdaY5mfNduzB>。VibeHub 上 34 个版本的现代军事 FPS，更新记录含 v31 高倍镜 PIP 与“狙击灵敏度按镜内 FOV 比例缩放”、v1.4 换弹／第一人称运动晃动、v30 移除移动端触控与 Android 导出、v34 蹲／趴姿态与瞄准链修复，输入／相机改动写得最细。缺口：页面没有说明 AI 与人工分工（平台为 AI 共创），需先核作者来源。
- **Project Strike — Launch Button Top Placement** — <https://play.ziva.sh/predicted-honesty/>。作者 Taha 在 2026-10-20 把“大厅 Launch Match 按钮移到屏幕顶部以便看见”直接写进版本说明并发布可玩 Godot 浏览器对战版本。缺口：只有单条 UI 修改可核；AI 参与程度未说明。
- **DoorKicker3 2D** — <https://gamesvibe.app/works/sIKo-Q1rUYQqPFgNWc_0c>。纯前端俯视角战术游戏（Claude／Codex 标签）；页面用整节记录触屏方案——检测触屏自动切布局、点选／拖路径、tap-hold-drag 转朝向、双指平移缩放、桌面与触屏共用判定，v5 修 HUD 逮捕计数虚高。缺口：无作者过程与真人反馈链。
- **钢铁前线** — <https://gamesvibe.app/works/px_wkO61fST4OHX1ZJOG3>。62 条更新、2.5 万次游玩的浏览器二战 FPS：v62 把教程 HUD 从罗盘上移开并加可见教官、v61 加 3D 目标信标与屏外方向／距离、v1 修触控锁定并让 31 把枪的准星对齐屏幕中心；评论区仍留有移动端无法取消瞄准、部署界面重叠和卡顿的真人反馈。缺口：作者只明确说 95 条阵营人声由本地 AI 生成，代码的 AI 分工未交代。
- **撤离瓦尔登** — <https://gamesvibe.app/works/OV7HCwbazBp6HqrNiyljS>。79 版更新的浏览器撤离射击：手机端把任务追踪和拾取／撤离距离条隐藏以让出战斗按钮、交互键上移避开蹲／雷键、触屏层不再吞菜单点击、按钮布局可拖拽并按屏占比保存，另有 34 个可重绑定动作与 v77 移除准星。缺口：AI 工具只以 DeepSeek／Kimi／GLM／Minimax 标签出现且同时带“古法编程”标签，代码是否由 AI 写必须回作者核。
- **灰区行动** — <https://gamesvibe.app/works/8vOec3pTrF2zWGfqUiqTK>。v1.1 一次修了开镜枪口特效错位、开镜距离过远、瞄具过小、手枪模型过大，并把 TAB 背包从分页改为单页显示全部容器。缺口：只有 2 版、32 次游玩，AI 仅有 DeepSeek 标签，弱证据。
- **全面战线** — <https://gamesvibe.app/works/yP3KMVLEkebNo72r1ez_l>。v11 的更新标题是 `fix(input): unify crouch on C toggle across modes`，把多模式蹲伏统一为 C 切换，公开源码 <https://github.com/ACCSCI/total-frontline>。缺口：页面只把 Codex／Claude Code／Cursor 列为可选共创 Agent，未说明本作代码由 AI 写，且明确不支持手机触控。
- **SCP：RXSEND** — <https://gamesvibe.app/works/qXkeJ39MN-Q8YUDcwGHm0>。Three.js 第一人称收容作战；v19 修“射线只遍历收容物／入侵势力／设施人员／队友，被感染者永远选不中”的瞄准命中缺陷，并调亮夜间市区。缺口：页面标 Claude／Codex，但无版本／作者分工细节。
- **CS2：Global Offensive** — <https://gamesvibe.app/works/BtjisITA669dzoNuyhRIm>。类 CS 的 FPS，页面标 Claude／DeepSeek／其他 AI 模型／古法编程；v6 修“加载遮罩不消失导致画面和 HUD 全被盖住、点击也被它吃掉”的输入阻断，并增加 low 画质档与着色器缓存。缺口：与撤离瓦尔登同样的 AI 归属疑问。
- **三角洲** — <https://gamesvibe.app/works/tj3NPZbdu3ZZ700j1jeML>。DeepSeek 生成的 2D 搜打撤；v5 加入药品转盘、战术大地图、单页背包并修开局整屏染色、干员互伤、拾取错物品。缺口：俯视角，不是 FPS；无真人反馈链。
- **黑潮行动 Operation Black Tide** — <https://gamesvibe.app/works/FPxqMnrDw1NYhv6CfjUSG>。网页可玩的 PvPvE 撤离 FPS，含 HUD／背包／装备重量与 v0.1.1 植被档位，公开 GitHub 与版本记录。缺口：页面宣传 Codex／Claude Code／Cursor 协作但未明确游戏本身由 AI 制作；作品页本机 404。
- **ECHO // 断线之城** — <https://github.com/azg06/Final-division>。Zero Operation 作者的浏览器 FPS 技术 demo；README 记录多智能体分工与 41 项自动视觉评审，实际抓到小地图朝向、DOM 更新过多等 UI 问题，并做 A/B 视觉盲测。缺口：是 demo，不是完整发行。
- **Blackline: Strike** — <https://aigameshare.com/games/blackline-strike>。BREAKWATER 同作者 nilni 的浏览器战术 FPS；页面完整列出桌面与手机两套输入（左摇杆移动、右半屏拖动瞄准、开火／瞄准／跳跃／换弹／蹲／冲刺按钮），11-03 仍在更新。缺口：无 devlog 说明改动过程。
- **Porcelain Rain** — <https://aigameshare.com/games/porcelain-rain>。同作者 nilni 的 FPS 计分跑；手机端把移动区与视角区分开、开火键可按住拖动追踪、空弹自动换弹。缺口：无改动过程。
- **ARC WARDEN** — <https://aigameshare.com/games/arc-warden>。iMninja 的 Boss-rush 动作 roguelite；触屏为左半屏拖动移动、右半屏拖动瞄准、松手自动瞄准，另有 Dash／Ultimate／换槽按钮。缺口：无作者过程与二改记录。
- **Neon Recoil** — <https://aigameshare.com/games/neon-recoil>。Zero 的横版 run-and-gun；明确记录手机虚拟摇杆下压蹲／举盾、JUMP／FIRE 双按钮和键鼠映射，11-02 更新。缺口：无改动前后。
- **Flickshot** — <https://www.spawn.co/@yuidev/flickshot>。Spawn 热榜的瞄准训练式竞技 FPS；补丁与截图标注「HUD Is Back」「Cleaner Phone HUD」并修设置／locker 布局。缺口：无作者过程与版本记录。
- **Dust 2 DM** — <https://www.spawn.co/@tiger/dust-2-dm>。Spawn 热榜的浏览器 FPS；更新加入完整手柄映射（A 跳／B 蹲／L3 走／RB·LB 换枪等）、手机端狙击／开火／购买修复和受击方向弧 HUD。缺口：AI／人分工未说明。
- **Diablo Survivors** — <https://www.spawn.co/@izkimar/diablo-survivors>。更新记录明确写了「HUD adjusted for short/wide screens」。缺口：只有一条 HUD 适配，无前后过程。
- **The Crownless** — <https://www.spawn.co/@izkimar/the-crownless>。更新说明含「abandon-run warning scrolls into view」等 UI 修复，作者还同意加改键与升级确认（更新记录未确认上线）。缺口：改键未确认落地。
- **Escape from Stranglethorn** — <https://www.spawn.co/@izkimar/escape-from-stranglethorn>。同作者第三人称撤离射击，81 次更新、68 条玩家回复中有 lag 与 proximity chat 诉求。缺口：页面未记录输入／UI 改动。
- **League of Spawn** — <https://www.spawn.co/@izkimar/league-of-spawn>。与 Savi（Spawn，Claude Opus 5.5）共创的 3D 5v5 MOBA，1.4 万 plays、35 次更新、95% 好评、58 条评论；最近更新只到 Dragonscrest 的可重绑定 Use 键、小地图野怪倒计时、Stats／Talents 分页。缺口：没有任何瞄准／相机／移动端输入修复记录。
- **BREAKWATER** — <https://gamesareeatingtheworld.com/db/breakwater>。Nil Ni 用 8 个 agent（含 UI agent）做的手机竖屏 3v3 ARAM MOBA，触控摇杆＋点按／拖动施法，400 场模拟调 bot、15 轮截图对比王者／Wild Rift。缺口：人类只提出“lane feels boring”“bots too dumb”，没有真人试玩或输入／UI 修复记录。
- **DeltaV Orbital Strategy** — <https://store.steampowered.com/app/5070120/>。2026-11-05 抢先体验（€3.59），作者公开 11 分钟整局 walkthrough 并免费教程 demo，直接问“界面能否讲清断燃料为什么奏效”。缺口：未见具体二改记录。
- **Aurora: Salvage** — <https://www.reddit.com/r/ClaudeGameDev/comments/1xlz5x0/i_built_a_free_survivorslike_extraction_shooter/>。10 天 535 commits（513 条 co-authored by Claude）、约 6.1 万行 GDScript 的 FPS 搜刮撤离，带截图／录像 capture harness。缺口：作者只写流程与工具链，未记录一次具体操作／UI 二改。
- **Purrfect Dominion** — <https://www.reddit.com/r/playmygame/comments/1wm8jtj/im_a_solo_dev_and_i_fear_my_web_strategy_game_is/>。与 Superpower Sandbox 同一作者 PHABDEV，自述用 AI 辅助编码／逻辑，公开征集“onboarding 是否过载、UI 是否杂乱、教程是否烦人”的批评。缺口：尚无二改回执。
- **Mach-X: Roguelite Air Shooter** — <https://www.reddit.com/r/aigamedev/comments/1xoueix/live_on_play_store_an_android_roguelite_almost/>。4 周 24 个版本、约 1,130 commits，代码几乎全由 Claude Code agents 写；每次构建用第二道检查把 7 种语言的每个菜单在手机尺寸下截图，标出重叠或被裁切的 UI。缺口：这是验证做法，不是一次具体修复；Play 商店 000。
- **Turbo Groove** — <https://www.reddit.com/r/ClaudeGameDev/comments/1xnnjsz/built_a_musicdriven_drift_racer_with_claude_code/>。作者记录 note 与漂移操控一天内迭代十次、“纸上对、开起来不对”，并用离线 harness 以弯道半径、侧向载荷对轮胎抓地的 before/after 表调手感；Steam 页 app 5536080（2026-11-04）。缺口：未见可玩 demo 或完整实机。
- **Schnell** — <https://www.reddit.com/r/ClaudeGameDev/comments/1xn4bzl/schnell_an_antigravity_racer_i_directed_and/>。Claude Code 在 12 天／约 31 小时内做出 7 条赛道的浏览器反重力竞速，明确写“Play-test early”并用“太慢”“要多转向”这类短反馈推动操控调整（漂移＋两段涡轮）。缺口：未给可玩链接与版本号。
- **过拟合猎手（Ring Survivor）** — <https://gamesvibe.app/works/pOR2uTPPIoW0rDnKC7PRZ>。v11 明说更新“全部来自一轮试玩反馈”，随后 v15 修 HUD／横幅挡子弹、v22 修手机职阶选择与开始按钮压卡、v27 改通透 HUD、v34 加触屏暂停／继续。缺口：页面未标 AI 工具，AI 参与待核。

### 5.2 有具体二改或接近，但缺可玩版本、作者身份、AI 分工、验证闭环或独立发行证据

- **《我记得》** — <https://www.taptap.cn/moment/859233480679097246>，可玩 <https://www.taptap.cn/app/974196>。桌面→手机输入／UI 适配写得最全：16:9 安全框避开刘海／圆角／手势条、手机 UI 整体放大一级、底栏键位提示变可点纸片、右上圆形暂停键＋安卓返回键暂停、左手落指处生成动态摇杆、右手滑动转镜头、弹弓改按住拉开／同指拖动瞄准／松手发射、瞄准改点按切换、Shift 跑改摇杆推到底、所有键名提示改成触屏说法；还用 PC 注入按下／拖动／松开模拟手指并按多种比例批量截图。日志图直链 <https://img2-tc.tapimg.com/moment/etag/Ftc82B9yeCgtBpThHvH_HqBgeXE4_20261014004452.jpg>（标题页；有静态图，缺二改前后对比）。缺口：本篇日志与商店页都没写游戏是否由 AI 制作，AI 参与未确认；许可未写；本端未实机。
- **Last Lighthouse** — <https://www.reddit.com/r/aigamedev/comments/1x9i2x7/shipped_last_lighthouse_on_android_with_codex_and/>。已上架 Android 的竖屏防守游戏，作者自述 Codex 实现代码与原生集成、生成工具出美术、本人负责设计与真机试玩；真机发现瞄准区压在灯塔上挡住战场，把瞄准条移到岛下方，并把长波次改成短编号关卡、血量改百分比；交叉帖 <https://www.reddit.com/r/Indiegamedeveloper/comments/1x9iogj/>。缺口：作者帖给出 Play 商店链接 <https://play.google.com/store/apps/details?id=com.brewedapps.lastlighthouse>，本机 000，可玩入口未核（按门槛 1 属硬门槛）；截图、版本、许可（含成本）未核；2026-10-18 发布。
- **Westbridge** — <https://www.reddit.com/r/ClaudeGameDev/comments/1xo6z0g/98_people_tried_my_text_rpg_now_183_have_signed/>。作者用 Claude 建浏览器文字 RPG，按真实玩家“拿到工资却找不到钱包／不知道下一步点哪”的卡点重做首夜：助手 Nan 明说下一步并用灯泡指按钮、可收起再点回，同时改版 business／crew／jobs 三屏并贴出前后截图；98→183 人注册。作者帖给出可玩 <https://play-westbridge.vercel.app/>，本机 TLS 握手失败（000），未核实可玩；按门槛 1 属硬门槛。缺口：可玩入口未核；AI／人分工只到“用 Claude 建”；版本；许可。**信息层级线索**：文字 RPG 而非动作游戏，只作菜单／引导层级的参照，不混进乙级门槛。
- **ZhikunCode 5v5 Web MOBA 原型** — <https://zhikunqingtao.github.io/zhikuncode/case-studies/zhikuncode%E5%BC%80%E5%8F%91%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80.html>。可玩入口 king.zhikun.xin（`?demo=1` 直接开局），HUD 含虚拟摇杆、普攻键、拖拽瞄准技能带冷却遮罩、回城／闪现／治疗，另有 WASD／QWER 键鼠回退。记录的二改是 QA 发现共享材质受击闪红污染模型、FPS 仅 6，改成独立外壳层并节流 DOM 血条后到 31.8；另有小兵寻路、水晶无敌、基地墙卡人修复。缺口：没有真人试玩反馈；版本／许可／成本未写。
- **《灯烬》** — <https://www.taptap.cn/app/963055>，日志 <https://www.taptap.cn/moment/858374335654529479>，B 站 <https://www.bilibili.com/video/BV11EnQ6CEij/>。TapTap 试玩页 v0.17.11（2026-10-21）；10/11 日志记录手机画武器时“手指容易挡住格子、画到一半不方便保存”，于是加草稿保存、画板放大和指尖放大镜，并支持调整握点、旁边实时预览持武器效果；新手引导改为先移动、再瞬移，触控端提示“拖动移动、点击右侧瞬移按钮”。缺口：TapTap 页与 B 站简介都没写 AI 与人工各做什么；商店包体仍是 v0.4.1 早期 Windows 试玩。
- **《破壁机计划》** — <https://www.taptap.cn/moment/860323750883623163>。作者从试玩反馈加商店“查看效果”、右键卡牌说明、八条得分记录、弹窗输入隔离（Esc 只关最上层）和手牌换行，10/20 又把对话教学改成必须实际放牌／启动。缺口：只标“AI 合成内容”，未写明代码是否由 AI 写，且无独立可玩页。
- **《涌·墨卷》** — <https://www.taptap.cn/moment/862092527522546262>。作者在日志 01 明说代码全交 AI、自己只想玩法挑毛病；日志 07 给出手机左半屏拖动＋右下斩／跳／闪、按住蓄力，并定位真机上 TapTap 客户端全屏调用导致卡死、改成先探测再最多试两次；H5 免下载可玩 <https://www.taptap.cn/app/986579>。缺口：无版本号与许可。
- **《史莱姆开工啦！》** — <https://www.taptap.cn/moment/861651513364188694>。Day16–18 专讲移动端建造 UI 二改：收起常规导航、工具栏贴底并留明确退出，点击／拖动加容差并修起步跳变，补撤销重做、镜头轮盘遮挡复检；可玩 <https://www.taptap.cn/app/983666>。缺口：作者带 TapTap 制造创作者徽章，但未逐项写明 AI 与人工分工。
- **《失心》** — <https://www.taptap.cn/moment/856904043035886645>。开局菜单围绕“小灵通”改了几轮：屏幕尺寸／字比／选中反色、固定鱼眼、把提示与确认收进手机屏、删底部杂项并补键鼠操作。缺口：只挂 TapTap 制造创作者徽章，文中未说明 AI 具体做了什么。
- **《暗黑罗格》** — <http://roguelike.m-finder.top/>，原文 <http://m-finder.top/2026-10-22-ai-roguelike/>。Cocos Creator 3.8.8＋TypeScript 网页肉鸽原型，作者自述 AI 搭第一版核心循环、写代码、补行为测试，人负责拆需求、定最小可玩版本、判断好玩与验收；文章列“能跑≠能玩”后暴露的问题：键盘移动和触摸移动不能互相干扰、斜向移动不能比直线快、手机竖屏和桌面超宽屏 HUD 不能被拉坏、虚拟摇杆与键盘移动、横竖屏 HUD 布局，并称有 18 组行为测试。缺口：只有问题与验收目标，未逐项写改前／改后数值；版本号未公开；可玩页 http 只得到 Cocos Creator 加载壳，游戏名／作者／版本元数据未核。
- **《炼金术魔女》** — <https://www.bilibili.com/video/BV1D2ffBwEms/>。B 站 UP“蔷薇园的猫猫猫猫猫”业余个人开发、AI 辅助的类银河战士恶魔城；本期对比上一次 Demo 1.1 明确列出“优化了炼金台操作，优化了炼金配方图片可视，大幅优化了翻滚、跳跃等动作的操作手感，适当削弱了前期游戏难度”。缺口：本期因 BUG 暂不开放试玩，未给版本号与具体参数；未找到 Demo 1.1 或后续可玩入口。
- **tefyt B 站 FPS** — <https://www.bilibili.com/video/BV1oZDHBSEYx/>。2026-04-10 发布，12 步里第 6 步专门做准星和 HUD 界面，之后才加枪口火焰、音效和打磨，游戏发布在 tefyt.itch.io，作者用 Claude Opus 4.6 做头脑风暴和计划。缺口：视频没有记录二改前后；itch 页面本机读不到。
- **Beyond the First Star** — <https://live.ruliweb.com/700315?id=9226>。韩国作者用 AI 做的飞行射击；v0.3.116 说明里记录手柄模拟／数字移动、手机触摸拖动＋双指炸弹，v0.3.87 修 Alt-Tab／指针输入后 WASD 失效与焦点恢复，v0.3.73 修关卡开始 WASD 焦点；itch 原页 <https://177513.itch.io/beyond-the-first-star> 当前不可达。缺口：只读到韩文更新说明，原页未开。
- **《最后的前线1917》** — <https://www.bilibili.com/video/BV1hRaW6vE7G/>。作者用 AI 做的浏览器战地类 FPS，Toy 页点开即玩，并按玩家反馈连续发载具／支援／地图／联机更新。缺口：更新集中在内容量，暂未见针对瞄准、移动或 HUD 的单次二改记录。
- **《热冰报告》** — <https://www.taptap.cn/moment/862302697397685856>。作者称用 TapTap 制造＋DeepSeek 驱动的 Codex 做第一人称体素射击，重做了教程与引导，PC 可试玩 <https://www.taptap.cn/app/959986>。缺口：未记录具体输入／UI 改动或玩家反馈。
- **《一二三大狗叫》** — <https://www.taptap.cn/moment/862883347402065970>。三人学生队 21 天用 TapTap 制造做第一人称战术射击，文章交代 AI／人工分工与携行具式装备组合的设计取舍。缺口：只见到（上）篇，未给操作／UI 二改与可玩版本证据。
- **《WELL／涌现之井》反馈帖** — <https://www.taptap.cn/moment/864440330617880799>。玩家集中反馈卡牌 UI 占比过大遮挡视野、移动过慢且无教程、移动端闪退，作者逐条答复却以比赛 DDL 为由把修复推到赛后。缺口：这是问题清单和反对意见，尚无可验证的二改版本。
- **Circvs Maximvs** — <https://www.vibegamesstudio.com/circus/>，日志 <https://www.vibegamesstudio.com/blog/2026-07-06-controller-day>。AI Agent 工作室对已上线 12 款游戏做手柄适配的完整记录：全菜单手柄导航、键盘焦点环、随最后使用设备切换的按键提示、拔线自动暂停，11/12 过 QA；截图 <https://www.vibegamesstudio.com/shots/circus/1.jpg>。缺口：需求来自管理层而非玩家反馈；无版本号与许可说明。
- **Vibegames 其余同社作品（共同缺口：AI agent 作者、反馈来自内部 QA 而非真人玩家、无版本／许可、截图未给）**
  - **AI Fighter／Antibody** — <https://www.vibegamesstudio.com/blog/2026-09-08-the-guard-that-had-never-fired>。AI Fighter 在触屏上 PAUSED 只是一行字、唯一出口是刷新，后来补成真正菜单；QA 因按错 Esc 漏测，正确键是 Enter，最后把映射写进三处大写文档。2026-07-26 又给 40 款游戏统一加触控套件：5 套控制方案、方向门、切设备即改屏幕提示，Antibody 用竖屏拖拽跟随、不设虚拟摇杆；可玩 <https://www.vibegamesstudio.com/aifighter/>、<https://www.vibegamesstudio.com/antibody/>。
  - **Blacklight** — <https://www.vibegamesstudio.com/blacklight/>。同社博客记录一次 FPS 输入／提示二改：QA 发现 7 次冷启动有 4 次玩家面壁、pointerlockchange 因事件不冒泡而从未生效，重建后 7/7 通过；又用“按开始后 60 秒内有一半玩家退出”的遥测重做开场逃生提示、提前目标卡和更短教学（<https://www.vibegamesstudio.com/blog/2026-09-08-the-guard-that-had-never-fired>）。
  - **Pulse Bloom** — <https://www.vibegamesstudio.com/pulsebloom/>。四条轨道映射到十字键与面键、合成手柄打 PERFECT。
  - **Shinobi Storm** — <https://www.vibegamesstudio.com/shinobi/>。此前没有暂停按钮，改造补上暂停并重做菜单。
  - **Star Putt** — <https://www.vibegamesstudio.com/starputt/>。最后四洞需把拇指拖出屏幕边缘才能一杆进洞，重摆发球点。
  - **Foxblade** — <https://www.vibegamesstudio.com/foxblade/>。上线后补手柄支持。
  - **Last Login** — <https://www.vibegamesstudio.com/changelog/lastlogin>。9/11 修手柄斜推同时触发换道＋滑铲、摇杆近阈值误换道，加 Feel & Controls 面板。
  - **Graveshift** — <https://www.vibegamesstudio.com/graveshift/>。手机触觉反馈补 Boss 阶段节拍。
  - **The Block** — <https://www.vibegamesstudio.com/theblock/>。新手引导从 4.4 秒改成八步“等动词”教学。
  - **Mafioso** — <https://www.vibegamesstudio.com/mafioso/>。被建筑遮挡的女主加半透明轮廓、无声字幕改 136 段语音。
  - **Mole Mayhem** — <https://www.vibegamesstudio.com/molemayhem/>。13 轮打磨含 HUD 重做，但只给结论。
  - **Delvers** — <https://www.vibegamesstudio.com/delvers/>。新增 Lanternbearer 按住持续光束、试玩反馈无击退。
  - **Harry Trainingspak** — <https://www.vibegamesstudio.com/harry/>。450 组 hotspot×verb 中 229 组只有五句通用回复，二改给 47 个物件写专属回应。
  - **Crazy Cab City** — <https://www.vibegamesstudio.com/crazycabcity/>。驶离路面从无提示改成 38→10 m/s 降速＋横幅＋声音，撞毁改 6 秒拖车。
- **Shelf-Made Tycoon** — <https://store.steampowered.com/app/4325520/>。Flockbay 团队的 Godot 仓库经营游戏（Steam 页开发／发行均标 Flockbay，尚未发售、无可玩入口）。本轮只读到商店页介绍与 9 张截图；“Claude Code 写约 3.4 万行 GDScript、headless sim＋打开编辑器试玩自检”来自检索摘要，Flockbay 原文本次 404（此前记为 410），未读方法与数据，按“摘要·未核”记，不作为作者过程证据。缺口（4 项）：AI／人分工未核；无版本；无许可／成本；没有操作或 UI 二改记录。
- **《探访神明》/《火力不足恐惧症》/《小药瓶》/《少女大战猫猫》** — 见 §5.1，均有可玩页但无作者级二改记录。
- **Keep It Crispy** — <https://juslangit.itch.io/keep-it-crispy>。2026-09-30 参赛、Slapjam 139 项中第 2；手机端倾斜转向，倾斜不可用时改左侧拖动，另有左手模式、镜头样式、倾斜回中与俯冲反转；作者记录 iPhone itch 内嵌的动作权限、触控兜底、Android 传感器路径和低画质选项等设备实测修复，AI／人分工完整（Claude Opus 5.5 代码／玩法／特效／3D，Codex 概念与 UI 图，人负责设计、方向和试玩）。缺口（4 项＋硬门槛）：itch 页本机 TLS 失败，可玩入口与作者页未核，只有 jam 索引与作者原文交叉；版本、许可、截图未核。按门槛 1 不能列候选。
- **Horde Hour** — <https://aibrowsergames.app/play/horde-hour/how-we-made-it>。2026-10-14 制作说明：为单指游玩把自动瞄准和“落点处出现的浮动摇杆”结合，升级卡强制至少 44px 高；给出移动端触控 UI 的具体尺寸与布局取舍；可玩 <https://aibrowsergames.app/play/horde-hour>，游戏画面直链 <https://aibrowsergames.app/screenshots/horde-hour.jpg>（有静态图，缺二改前后对比）。缺口（3 项＋硬门槛）：作者明确说刷怪位置、波次和数量仍待完整试玩调，属设计规格而非已验证的二改闭环；版本、许可未写；本端未实机。
- **Punch Survivors** — <https://www.spawn.co/@izkimar/punch-survivors>。League of Spawn 同作者；更新日志有 2026-06-27「Control Overhaul」「Mobile Update」，明确重做手机触控响应、跳跃键可靠性、修复触屏菜单幽灵点击，并在升级界面释放鼠标指针。缺口（4 项）：无 AI／人分工细节；截图、版本、许可未给。
- **Artillery, four ways／Same brief, different models** — <https://goodaiguide.com/possible/artillery-four-ways/>、<https://goodaiguide.com/possible/same-brief-different-models/>。同一约 800 字 brief 的四个可玩炮击游戏，作者 Fabian Mösli 以第一人称记录自己给四个模型同一提示、对其余三个逐轮试玩反馈（Claude Opus 5.5 只生成一次；原文 “I gave four AI models the same prompt… kept playing and giving feedback”），不是转载评测；开局默认瞄准几乎必中后改地形遮挡、拉开城堡距离、重置首发落点与相机；同题六版对照要求 360×640 到桌面不重叠 HUD 且触控可玩，并注明真机触控未验。分版本：Ember & Iron（GPT-6.1 Sol／Codex，5 版）<https://goodaiguide.com/games/artillery/gpt-6-1-sol/>；Castle Artillery（Claude Opus 5.5，一次生成）<https://goodaiguide.com/games/artillery/opus-5-5/>；Gemini 3.8 Flash 版（一轮反馈）<https://goodaiguide.com/games/artillery/gemini-3-8-flash/>；Grok 版（多轮反馈，版本页只有标题）<https://goodaiguide.com/games/artillery/grok/>。日志图直链 <https://goodaiguide.com/images/possible/artillery-opus-5-5.webp>（游戏画面）。缺口：四人模型对照 demo，不是独立发行作品；无版本号、许可／成本未写。

### 5.3 中文社区线索与不可达原页

- **微信公众号《符文射手》**（《用 AI 做小游戏，我开始为一支箭较真》；清单未给链接）— WebFetch 与 curl 均返回“当前环境异常，完成验证后即可继续访问”，正文、作者和外链都没取到；只从搜索摘要得知“拖符文、瞄准、2D”等线索，未列入候选。
- **微信公众号《当我把游戏开发外包给AI》第七／八／九篇**（清单未给链接）— 同样返回验证页；仅从摘要得知“战斗 UI 字号缩小以免挡住怪物”“精神文字改进度条”“朋友试玩 10 秒找不到开始按钮后重做主菜单”，全文与配图未核。
- **知乎群侠传万字复盘** — <https://zhuanlan.zhihu.com/p/2098838491635380842> 返回 403，curl 仅得反爬壳；群侠传候选改用官方 Steam news（ISteamNews 正文）与商店页核对，知乎复盘本身仍未读。
- **机核《关于我和codex的2026cgj》** — 正文可读，但其嵌入的 itch 试玩页打不开；hooooook 的版本号、文件许可与完整连续实机仍待核（itch 链接 <https://flyingziming.itch.io/hooooook>、<https://blasin.itch.io/blindside> 本次 socket closed／无响应）。
- **少数派茫室**（清单未给链接）— 少数派文章称 UI 资产交 Codex 半小时导入／替换／打包手机，但没有一次操作或 UI 的改前改后，未列入候选。
- **掘金** — 只有 11 个案例盘点与双摇杆教程，未给作者级操作／UI 修改，未列候选。
- **The Librarian 2（Matt Wolfe）** — <https://www.youtube.com/watch?v=qK4nV_LnXxQ>。2026-08 视频与复盘：Claude Code／Opus 生成首版后，真人试玩发现移动方向反了、元进度界面没有返回键、地图箭头不跟随朝向、书本拾取失效等输入／UI 问题，再交 Codex 微调。缺口：只确认有完整演示视频，公开可玩版未在检索中确认；watch 页只经 noembed 取得标题与频道，未看视频。
- **Playco／OpenAI 案例** — openai.com/index/playco-game-prototyping-with-astra/ 返回 403；HN item 49554185 评论称该链接短暂上线后 404（premature release），未能读到原文与案例细节。
- **Meta Horizon Create／Horizon Studio** — 官方 developers.meta.com 与 newsroom 页未检索到或 TLS 失败；只能读 gamesindustry.biz 原始报道 <https://www.gamesindustry.biz/meta-unveils-ai-powered-game-tools-for-mobile-devices-and-browsers-announces-vr-glasses-with-day-one-unity-support>，未点名任何游戏。
- **Google Playground** — <https://blog.google/innovation-and-ai/technology/ai/playground-experimental-gaming-platform/> 可读，但 playground.google 跳 Google 账号登录，且文章注明仅美国 18＋；无法查看具体作品页。
- **playgroundarcade.com** — Cloudflare “you have been blocked”（HN 2026-10-20 收录的 AI-built browser games 集合），未读其清单与各游戏原链。
- **Flockbay《State of AI game making》** — 检索称 2026-10-03，原页本次 404（此前记为 410 Gone），未读其方法与数据；与之相关的数字只按“摘要·未核”处理，未写成事实。

## 6. 丁级：工具、做法、平台与索引（不是作品候选）

- **Star 的 Automatic playtesting** — <https://buildwithstar.com/changelog>。2026-09-19 把“检查 controls 与 gameplay 并自动修复问题”的自动试玩默认开启（可单独关闭而保留代码检查）；另有 2026-08-13 修 Firefox／Safari 手柄失效、07-20 修编辑页手柄失效。
- **Kyle Kukshtel《Your Game Is A Harness》** — <https://kylekukshtel.com/ai-harness-engineering-game-development-claude-code>。2026-10-10 文章：让 Agent 通过确定性种子、状态存读、序列化命令回放、分层截图与 odiff 图像差分、samply 文本 profiler 来改游戏；指出整图前后对比噪声大、传统图形 profiler 对模型不可读。
- **Nodetool 游戏引擎** — <https://nodetool.ai/gamedev>。开源 2D／3D 游戏引擎面向 AI Agent：`edit_native_game` 在同一批编辑里改 HUD 与输入绑定（键鼠／手柄／触控），`playtest_native_game` 用录制输入做无头断言（最多 18,000 tick）、固定步长和种子可复现，`capture_native_game_frame` 可看帧／接触表。缺口：页面本机 404，GitHub 仓库仍活跃（AGPL-3.0）。
- **Ziva Playtest Agent** — <https://ziva.sh/full-game-tester>。2026-08-28 Show HN 的 Godot 专用试玩 Agent：读项目代码学控制，真发按键、点击、拖拽和瞄准，按自然语言目标玩并给判定；Pro $50／月、Hobby 免费，其他引擎仅企业版。
- **Summer Engine 的 web-and-touch-input 技能** — <https://docs.summerengine.com/skills/web-and-touch-input>。把浏览器／移动输入规范做成 Agent 可加载的 skill：控制绑为 action 而非裸键、首击才解锁音频与指针锁、Escape 释放、触屏才加大按钮／虚拟摇杆／独立镜头拖拽索引、角落锚定；标 Preview，尚未在引擎内实跑。
- **paprika3d three.js 虚拟摇杆与触控实测指南** — <https://github.com/paprika3d/paprika3d/blob/594f0094b239f7729fa4fb536967589416ca0a4a/docs/guides/threejs-virtual-joystick-mobile-touch-controls.md>。2026-10-28 在 844×390、DPR3 手机视口实测：摇杆用 `pointer-events:none` 让触摸穿透、Jump 按钮是唯一覆盖 canvas 的 HTML 元素并给出命中区矩形、上推 60px 在第 5 帧到满偏、抬起归零、双指多点与 pointer-lock 鼠标视角的换算。
- **Convika《Fix an AI-made HTML game's mobile controls》** — <https://convika.com/guides/ai-html-game-mobile-controls/>。针对 AI 生成 HTML 游戏的移动控制修复清单：pointer capture 与 pointerup／pointercancel／lostpointercapture 的释放、键盘与指针状态分离、用 getBoundingClientRect 换算画布坐标、canvas／controls 加 `touch-action:none`。
- **Google Playground 与 Unity Spark** — <https://blog.google/innovation-and-ai/technology/ai/playground-experimental-gaming-platform/>。2026-10-07 上线（美区 18＋，按 Google AI 订阅分层），自然语言生成可玩网页游戏并可当场试玩、对话式改；Unity Spark 随后接棒 <https://unity.com/spark>。
- **Meta Horizon Create／Horizon Studio** — <https://www.gamesindustry.biz/meta-unveils-ai-powered-game-tools-for-mobile-devices-and-browsers-announces-vr-glasses-with-day-one-unity-support>。2026-09-24 Meta Connect 发布：手机 App 与浏览器 Studio 用提示生成 2D／3D 游戏（含进度、难度、美术方向、多人），项目在手机与网页间共享迭代历史，并可直发 Facebook／Instagram／Horizon。
- **Simon Willison《The October inflection point for vibe game development》** — <https://simonwillison.net/2026/oct/28/vibe-game-development/>。2026-10-28 复盘：称 10 月是 prompt-driven 游戏拐点，四款真正玩得下去的作品都是 HTML／JS，建议先在聊天里做手机友好的 three.js 原型、再转 Codex／Claude Code，并记录了 Emberwick 的任务角色错位、进度刷新丢失等试玩驱动修复。
- **GameFactory-3A PR #78** — <https://github.com/OpenDCAI/GameFactory-3A/pull/78>。2026-10-15 合并：把命中反馈／受击音与相机稳定基准位姿分离，按战斗阶段框住双方并保留垂直运动，另加 reduced-motion、反馈开关、暂停／失焦／退出清理和尽力而为的振动。
- **GameFactory-3A issue #66** — <https://github.com/OpenDCAI/GameFactory-3A/issues/66>。UE5 Windows playtest 的 tap 只发 key-up、攻击键 J 实际不触发的可复现 bug（J down/up 使对手血量 506→415，仅 key-up 不变）。
- **GameFactory-3A PR #69** — <https://github.com/OpenDCAI/GameFactory-3A/pull/69>。为上述 tap 输入 bug 增加 Windows 回归测试：完整 down-hold-up 发一次、显式 down/up 各发一次。
- **GameFactory-3A game-feel 技能** — <https://github.com/OpenDCAI/GameFactory-3A/blob/main/agent_skills/game-feel/SKILL.md>。规定 Mechanic 确认事件到表现层的触发／提示／运动／震动／重复／相机字段，并禁止把相机抖动、HUD、震动塞进规则层。
- **Summer UI Basics 技能** — <https://docs.summerengine.com/skills/ui-basics>。HUD、菜单、血条、锚点、容器与主题的 agent 生成模式。
- **Summer Character Movement 技能** — <https://docs.summerengine.com/skills/character-movement>。主张先交付最小正确控制器再调 feel，含 FPS／第三人称鼠标视角、冲刺蹲伏、coyote time／跳跃缓冲。
- **paprika3d：给游戏加手柄支持** — <https://github.com/Keeno-Corp/paprika3d/blob/main/docs/guides/add-controller-support-to-a-game.md>。Gamepad API、死区、按下／长按区分与键鼠／手柄共用输入对象。
- **paprika3d：在 three.js 里做 FPS 游戏** — <https://github.com/Keeno-Corp/paprika3d/blob/main/docs/guides/make-a-fps-game.md>。pointer lock、鼠标视角、屏幕中心射线射击与目标反馈。
- **paprika3d：相机抖动与命中反馈** — <https://github.com/Keeno-Corp/paprika3d/blob/main/docs/guides/threejs-camera-shake-hit-feedback.md>。同一帧内相机抖动、闪光、缩放、粒子、音效与 HUD 的命中反馈，以及跟随相机下抖动消失的 bug。
- **paprika3d：小地图与游戏 HUD** — <https://github.com/Keeno-Corp/paprika3d/blob/main/docs/guides/threejs-minimap-game-hud.md>。第二相机小地图、HTML 血条／分数与窄屏遮挡问题。
- **paprika3d：OrbitControls 与触摸页面滚动** — <https://github.com/Keeno-Corp/paprika3d/blob/main/docs/guides/threejs-orbitcontrols-touch-page-scroll.md>。处理 OrbitControls 与页面滚动／触摸手势冲突。
- **odiff** — <https://github.com/dmtrKovalenko/odiff>。Kyle Kukshtel 原文列出的截图差分工具，用像素差而不是原图给 Agent 量化视觉反馈。
- **按键状态“粘连”：浏览器游戏失焦重置** — <https://gamesvibe.app/guides/tip-sra3yqs7dg>。2026-08-06 的社区输入修补，针对浏览器 FPS“失焦后开火键继续生效”给出 blur／visibilitychange 全键重置实现与边界（蓄力／引导技能仍需显式取消）。
- **VibeHub（gamesvibe.app）** — <https://gamesvibe.app/>。国内 AI 游戏平台，作品页公开模型标签、逐版本更新记录、玩家反馈与作者回复，是检索“作者明确记录一次修改”案例的收录列表。
- **Slapjam AI 2026** — <https://itch.io/jam/slapjam-ai-1>。2026-09-28~30 举行、10-07 出结果，要求手机竖屏浏览器可玩并披露 AI 工具；139 项里评审反馈集中在手机操控别扭、动作可读性差、按钮／特效太暗，是继续挖“作者记录触控修复”的新样本池。
- **Simon Willison 的四款作品** — <https://simonwillison.net/2026/oct/28/vibe-game-development/> 文中四款可玩 HTML／JS 游戏只作社区判断索引；HN item 50273753 有评论称其 UI 靠 Claude Design 注入样式好看但玩起来无聊，Simon 以“给落后方翻盘和把军队拉到地图中央”作为有效改动回应。

## 7. 排除与去重

- **任务钦定只作旧对照、不计新候选**：Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R'lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso、Capybara、backroad rally、Long Wind、World of ClaudeCraft。本清单未重研、未重收；Capybara 虽为 Vibe Jam 第 1，也因在排除名单未列。
- **本仓 docs 已引用，不重复列**：Play2Code、RSIGame、Roblox Build 评价（见 WP13／game-wp11 与校准审计）；Roblox 原页只当已覆盖来源。
- **同名不同作排除**：MrQuba／SpiritOfTheForest（与目标不同作）；Claude of Duty: VibeZone、mshumer 的 Claude of Duty、Leonxlnx 的 Dust Corridor（仓库名仍为 claude-of-duty）是三件不同作品。前者只作替代／反对意见线索；后两者按提示词、文件树和 package 名核对无共享源码，分属不同作者，本清单 §4 第 11 项只引 Leonxlnx 的 Dust Corridor。
- **工具不计作品**：pxl 及其他 UI 工具、组件 demo、引擎 showcase 未列候选。
- **未取得正文或未列入的线索**：符文射手、当我把游戏开发外包给AI、hooooook、茫室、群侠传知乎、Playco、Meta 官方页、playgroundarcade、Flockbay。均因验证页、403、404／410、登录或 TLS 失败，不能当一手证据。
- **旧卡已收、本卡不重研**：本机改键／生命周期卡、角色／场景／音频卡中的旧作品；同一作品跨卡时只有能提供操作闭环的才收本卡。

## 8. 边界、欠项与下一步

**本轮没有做到的事。** 未启动任何游戏、未开浏览器、未播放视频或音频、未登录、未发帖；所有“可玩”只是页面／仓库入口可达。未核实际手感、帧率、触控延迟、听感、完整游玩回路；未核大部分作品的资产逐件许可与真实成本。因此本文不宣布任何作品达到品类标杆，也不把收录数当品质进展。

**四项首要缺口。**

1. **Bichitos Rumble**：补作者游戏画面截图直链——优先从 itch 页 `napsoul.itch.io/bichitos-rumble` 取 4 张 screenshot（BUILD_LOG 2026-08-18 记录已上传 cover 630×500 与 4 screenshots，本机 itch TLS 失败）；补 BUILD_LOG 全文覆盖范围；实机核对 `pointer:coarse || innerWidth<900` 判定、915×412 smoke 是否真的覆盖大屏手机横屏；核腰带／badge／HUD 图标等资产许可（9 个 critter GLB 已核）。
2. **Exelio**：核许可与成本；用免费 demo 走一遍 TGS 反馈对应的拾取／引导／背包回顶／跑酷误触，确认补丁在当前版本仍有效。
3. **Overlock**：核许可与成本；实机对照触控命中区、场景重载按键卡住、菜单／软键盘交接。
4. **群侠传：幸存者**：实机确认 Steam 功能栏未列 Full controller support 与公告“全手柄”是否一致；核许可与成本；对照 V0.2.0 的图标随设备切换、底部提示条、UI 三档。

**下一步（按顺序）。**

1. 先试 Bichitos Rumble，按 §3 的机制在现有 FPS／MOBA 移动端入口做一次窄验证：`pointer:coarse || innerWidth<900` 判定、作者 915×412 smoke（`touch-mode`／摇杆／动作键）与本轮建议的 `visualViewport`、按钮不重叠、暂停／背包输入隔离断言（建议项未执行）。**未执行前不写成已通过。** 这是浏览器端判定，Unity／Unreal 需换成各自 Input System 的触摸／指针能力检测与安全区／分辨率 smoke，不能照抄；若问题是按键布局或遮挡而非宽度误判，先看 Exelio 的误触判定或 Overlock 的触控布局。
2. 读 Exelio 的 DevLog #1／#2 与 Update 4／5，再用 demo 复现“误触判定前置条件”和“材料需求前置到界面”两条改动。
3. 读 Overlock 博客并实机对照触控／键鼠／菜单三条路径；截图直链已补，剩许可／成本，补齐后可作首选替换。
4. 用免费 EA 版对照群侠传 V0.2.0 的手柄／UI 三档与提示条，确认公告与商店字段不一致是否影响实机。
5. 若需要 Vibe Jam 2026 的更多样本，沿 Bichitos、Astropilot、Undead Siege 的仓库与作者页追，不重开已失败的 itch.io／Reddit 直连；itch 原页恢复后再补 Keep It Crispy 的版本、许可与评论。
6. 中文侧只补可读原页：TapTap 的 WELL／梦境绮想／我记得已有正文，B 站与微信仍只作线索；不把搜索摘要写成作者原文。
