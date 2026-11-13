# B-AI-GAME-BROWSER-SECOND-PASS-EVIDENCE-20261113 · Fable 5.2 成品二改证据候选来源

> 核实：2026-11-13（UTC+8）。本页只整理本轮已核实并交回的候选与反馈原帖，不新增清单外作品链接。全部为只读公开资料：未启动游戏、视频、音频或浏览器，未登录、未联系作者、未取商业资产。链接可响应只代表页面可读，不等于已实玩或品质通过；“未验”字段不当作事实。

## 1. 决定

**正式纳入 2 项：Agent of Somebody、Aiden's Revenge。** 两项同时满足：2026-11-09 以后、作者明确归因 Fable 5.2、有可玩页、有作者原文、有作者发布的静态图、有可引用的玩家反馈原话，以及“反馈后改了什么”的可核描述。

**乙级 6 项：COLD BOOT、Hanford Reach、雾锁山门、MOTHLIGHT // Vesper-9、Golden Hour Ride、Turbo Tails。** 它们的二改过程比多数成品具体，但各差至少一项硬条件，逐项缺口见各 §5.x 的“缺口与降级理由”：COLD BOOT 缺可引用的截图直链，且未点名反馈者与原话；Hanford Reach 有固定部署 URL 但本机未验证可玩，作者对 Fable 5.2 的明确归因也待补；雾锁山门缺逐轮 changelog，反馈来自作者自玩；MOTHLIGHT 的改前归档未公开，归因需补作者原文；Golden Hour Ride 无静态截图、无公开版本记录；Turbo Tails 原帖只经 oEmbed 读到正文、构建站本机 000、无版本记录。补齐前不按“已证二改”使用，只作下一轮补证对象。

**排序结论：首选深挖 Agent of Somebody；只补一项工程样本就补 COLD BOOT；只补一项玩家闭环就补 Hanford Reach。** 其余成品保留链接与理由，不因“可玩”升级为二改候选。

## 2. 渠道覆盖表

| 渠道 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| WebSearch | 英文与中文各多组词：`"Fable 5.2" browser game`、`made this game`、`playtest feedback fixed UI`、`second version OR v2 OR patch`、`空喵星落 第二版 移动端 存档`、`网页游戏 作者 复盘 迭代` 等；另按作者名与作品名补搜 | 只作线索入口；两个种子页由任务给定；直接定位到若干作者页与中文报道，其余线索回原始页核 | 多个会话 200/200 配额耗尽；DuckDuckGo、Bing HTML 端点空页或 403；后期无法再用搜索补原帖 |
| Hacker News（Algolia API） | `/api/v1/items/50433659` 读 Aiden's Revenge 整棵评论树（451 条，实际解析约 150 条）；`/api/v1/items/50469007` 读 Fable52.games 帖（58 条）；`/api/v1/items/50434918` 等单条评论；`/api/v1/search` 按 `Fable 5.2`、`Show HN`、`Skull Jam`、`controls/tutorial/onboarding` 检索 | 5 条直接用于本页：[50434516](https://news.ycombinator.com/item?id=50434516) 暂停与 Punch 键困惑、[50434918](https://news.ycombinator.com/item?id=50434918) 作者“I'll add these fixes”、[50437329](https://news.ycombinator.com/item?id=50437329) 碰撞与 Stage 3 难度、[50470128](https://news.ycombinator.com/item?id=50470128) Saltline 手机左摇杆、[50469871](https://news.ycombinator.com/item?id=50469871) 全屏/移动端；另 2 条模型对照 [50434424](https://news.ycombinator.com/item?id=50434424)、[50434508](https://news.ycombinator.com/item?id=50434508)，只作旁证 | `news.ycombinator.com` 直连 curl 000，全部经 Algolia 读取；50434918 只有作者一句回复，没有后续逐条修复记录；部分子评论未逐层展开 |
| Reddit | 直连 `www.reddit.com`、`old.reddit.com`、`api.reddit.com` 与多个 redlib 镜像均 TLS/连接失败，改用 Arctic Shift 归档 API：`/api/posts/ids`、`/api/comments/search?link_id=`、`/api/posts/search?subreddit=` | 11 条：r/accelerate 作者帖 [1xtjrsp](https://www.reddit.com/r/accelerate/comments/1xtjrsp/fable_52_built_me_a_game_overnight_a_bit_of_back/)、玩家与作者评论 6 条、Skull Jam 帖与作者物理回复 2 条、[Towers of Aurum 发布帖](https://www.reddit.com/r/ClaudeAI/comments/1xv1dvs/i_rebuilt_the_warcraft_3_tower_defence_maps_i/) 1 条、[另一款 Saltline 的 dev update](https://www.reddit.com/r/ClaudeGameDev/comments/1xumfwr/dev_update_for_my_arcade_flight_combat_game_it/) 1 条 | `www`/`old`/`api` 直连与 `.json` 均 000；pullpush 526、redlib 实例 000、`r.jina.ai` 401、eddrit Anubis；Arctic Shift 部分全文搜索 422 Timeout，投票数、后来新增评论与被删评论可能不全 |
| X/Twitter | 直连 `x.com` 与 `twitter.com` 返回 402 或只剩 JS 壳；改用 `publish.twitter.com/oembed` 逐条读推文正文；其余靠 fable5.app、awesome 列表、vibegamer、aigamehot、varghq 等引用页转述 | 本页列出 11 条状态链接（10 个账号）：Turbo Tails 2 条、Kevin Ngo 1 条、归藏 1 条、LuminaBench 1 条、Blueline 1 条、Street Brawler II 1 条、KernelChai 1 条、Great Wave 1 条、Tensen 1 条、ericmaskfr 1 条；另有 1 条 chetaslua 属丁级排除行，不计入。11 条均经 oEmbed 读到推文正文；Starry Night Rider 本页只给站点、未给 X 状态链接，Jarrod Watts 未列入本页 | 直接访问 402/需登录；回复线程、引用媒体与被删内容未读；`publish.twitter.com` 对个别状态可能 404 |
| GitHub | 搜索 API 先 `api.github.com/search/repositories`，约十余次后对本机出口 IP 403 rate limit；改 `github.com` HTML 搜索、`raw.githubusercontent.com` 读 README/REPORT/BUILDLOG/PROMPTS/CLAUDE.md/LICENSE，并 `git clone --depth` 读 `rossinek/cold-boot`、`fablestar/bayhaven` 的提交历史 | 30 个作者仓库/日志 + 6 个索引仓；本页用到的关键文件：COLD BOOT 的 `docs/DESIGN.md` 与 rev2/rev3 提交、Hanford 的 `BUILDLOG.md`、hahaliu1029 的 `mothlight/REPORT.md` 与 `game/REPORT.md`、Ironvale 的 `PROMPTS.md`、Bayhaven 的 `plan/` 与 checks | REST API 匿名 60 次/小时后 403，部分 tree/contents 与 issue 列表未取；本机无 `gh` CLI；部分仓库创建时间、star、license 元数据改用 raw README 核 |
| 作者博客与项目站 | WebFetch/curl 读 anchorterminal 的 `.md`/`credits.txt`/`cover.webp`、notesbylex 原文与首版截图、pootlepress 骑行文、silencestar 三篇、Habr 原文、fablestar、anchor 的 `llms.txt` 与 `api/v1/index.json` | 约 15 条作者原文：Agent of Somebody 复盘与 credits、Aiden 复盘、Golden Hour Ride、Rдкс、Tilt Labyrinth、GREYPORT、灯笼街、Ethan Mollick 长文等 | higgsfield 的 Skyfire/VOWLORN 正文为客户端渲染，只读到标题与 OG 描述；claude.ai/artifact 需 JS/登录；部分作者站 curl TLS 失败 |
| 目录与聚合站 | `fable52.games` 首页 34 款与 /play 详情页、`fable5.app` works 索引（389 条声称作品/47 游戏）、`tryaigame.com/made-with/claude/`（自称 70 款）、`vibegamer.io`（75 条）、`aigameshare.com` Made with Fable（150 款只读第 1 页）、`gigabitgamelab.com/arcade`（40 条）、`spawn.co` 作者页 | 15 个目录/清单；本清单可用的成品线索约 60 款，另有索引/方法/背景约 20 条 | tryaigame 第 18 条后截断、`/page/2/` 404；fable5.app 的 `?page=2..10` 与 category 分页返回同一首屏；aigameshare 只第 1 页（150 款中约 37 款）；playgroundarcade 403；fable52.games 的源码检视/下载未逐一打开 |
| 中文媒体 | 掘金 4 篇、量子位站与公众号、80aj、游研社公众号、虎嗅转载、aigamehot 3 条、PagePop、NodeLoc、woshipm/人人都是产品经理 | 约 20 条报道/教程：掘金 7707151816107278387/7707205288390803466/7706472163180920858/7706833656825004058、量子位 508912、80aj 的 Lex 报道、游研社/虎嗅的几猫调查、aigamehot 三条、PagePop 等 | 知乎专栏与问题 403；微信公众号原文多数停在“环境异常”验证页；游研社自有站证书域名不匹配；aigamehot 两条被域名安全策略拦截，只用搜索结果摘要 |
| 中文社区与论坛 | linux.do 原帖直连被 Cloudflare 拦，改 `locdd.com` 镜像读 Skymeow 帖与 15 条回复；即刻 2 条；NodeLoc 1 条；微博 2 条 | 约 8 条：即刻莫唯书Mark 的反方长文、归藏即刻原帖、NodeLoc 索引、Skymeow 镜像与作者截图、微博“拾月”与傅盛相关帖 | linux.do 直连 403/000、WebFetch 证书主机名不匹配；知乎 403；微博登录墙/仅摘要；小红书、V2EX、TapTap、机核未检索到 Fable 5.2 相关原帖 |
| 视频平台（YouTube/B站） | 只读视频页标题、简介与索引转述，不播放；B站 4 个实测视频页 | B站 4 个 Fable 5.2 实测视频页；Turbo Tails 作者对比视频 <https://youtu.be/SsSKJA0EHD4>（未播放） | 视频内容、音轨与评论区未读；B站评论区不渲染；YouTube 未播放 |
| 平台、工具与 Skill | GitHub 插件/Skill 仓：Junhan2/oh-my-fable、fcsouza/agent-skills、kpab/claude-fable-5-skills、Xyloforge/claude-game-skills、walangstudio/gd-skills；聚合：Wanaka、Unity Spark、TOPAI | 11 条：5 个 Skill/插件、2 个平台、1 个多模型对比索引、3 条方法/背景 | 多数 Skill 仓无 demo、star 低（0–61）；Wanaka/Unity Spark 无公开可玩产物；插件市场页多为营销材料 |
| 可玩页 HTTP 探活 | `curl -L` 逐个取状态码，记录 200/000；本页候选直链约 40 条 | 200：anchorterminal 游戏页、aidens-revenge.pages.dev、rossinek.github.io/cold-boot、fablestar.games/play、op7418.github.io、fable52.games、nyc.somethingbig.ai、towersofaurum.com 等 | `turbo-tails.vercel.app`、`what-the-water-keeps.vercel.app`、`gilt-and-gutter.vercel.app`、`harvest-standoff.vercel.app`、`rivergame-kappa.vercel.app`、`maad-maxxing.vercel.app` 本机 curl 000（schannel 握手失败）；不能据此判断作品下线 |
| 明确读不到 | itch.io jam 与作品页、Steam、Lobsters、Discord/官方论坛、web.archive.org、知乎、微博正文、微信公众号原文、小红书、V2EX、TapTap、机核 | 0 项直接证据 | itch.io TLS exit 35 / Socket closed；Steam 本轮未纳入；Lobsters 被 Anubis “Access Denied”；archive 与 `r.jina.ai` 不可达；Discord 无可读公开区 |

**合计。** 本页正文逐条列出的来源条目共 116 行：正式纳入 2、乙级 6、丙级/成品线索 71（§6 表 45 行 + §6.1 的 26 条）、丁级/排除 11、索引/方法/背景 26。同作品多入口在正文已并作一条，不另计入口、也不增加条目数：Agent of Somebody 4 条入口、Aiden's Revenge 4 条、雾锁山门 4 条、MOTHLIGHT 3 条、TukTuk 2 条、Shuttle Strike 2 条、Ironvale 2 条、Boring Game 2 条、Dustfall 2 条，共 9 组 25 条入口；若按入口条数计为 116 + (25 − 9) = 132 条。§6 表有 4 行各含同组多款作品（海克斯大乱斗/BREACH、飞车 3D/鹈鹕骑单车/运输船 3D、Rifts/Memory of Teresa/Hogwarts Royale、Great Wave/Handful），§6.1 另有 Aquila/Dawnward 一条为一个仓库两款游戏；116 是行数不是严格去重后的作品数。渠道覆盖表的“得到”是各渠道命中数，含跨渠道重复与未进正文的线索，与 116 行不是同一口径，不相加。原稿“217 条”不能由本页条目复算，也不等于任一渠道行合计，已按本条替换。

## 3. 筛选标准与排重

按任务与 `ai-made-games-scout` §1–2 的硬条件排序；等级只表示资料优先级，不是品质排名，也不是本端实玩验收。

1. **时间与归因**：2026-11-09 以后发布；作者在原文明确写 Fable 5.2。只有二手转述、或作者只写“Claude/Claude Code”的，降级或排除。
2. **可见产物**：可玩页可响应，或有完整连续实机原视频。只有宣传帖、只有截图、只有索引页的不算。
3. **作者原文**：作者自己写的过程、提示、版本或提交记录。第三方评测只作旁证。
4. **二改进入可玩版本**：至少一项改动能从当前构建、提交、截图或作者逐条说明中核到；作者说“修了很多”不算。
5. **改前后可复核对象**：旧构建、归档包、固定机位截图、提交 diff、或反馈原话 + 改后文案/界面。
6. **首次识读或反馈闭环**：玩家/非作者指出具体看不懂、不会操作、不会暂停、菜单过载等问题，作者据此改；作者的自我试玩只算弱闭环。
7. **许可、成本、版本**：能写就写；未知写未知，不推算。运行与听感一律标未验。

并列时优先：有外部玩家原话 > 有作者逐条改前/改后 > 有版本/提交 > 有固定机位截图 > 有可玩入口。

**排重结论：** 实际覆盖这四个名字的现有页面只有两处：`domains/game-dev/03-generative-ai-in-games.md`（Saltline、Evensong、Redrock、FOG CITY）与 `docs/collaboration/TASKS.md`（Saltline、Evensong、FOG CITY）。`docs/research/2026-10-23-game-worth-trying.md` 与 `domains/game-dev/README.md` 对这四名为 0 次命中，旧 release-iteration 产物也未找到对应记录。本页不重复这几个作品，也不把 Saltline 的汉化/联机衍生当作新作品。Agent of Somebody、Aiden's Revenge、COLD BOOT、Hanford Reach、雾锁山门、MOTHLIGHT、Golden Hour Ride、Turbo Tails、Towers of Aurum、几猫等均未在上述页面收录。

## 4. 甲级：满足全部硬条件

### 4.1 Agent of Somebody（种子一，首推）

- **可玩**：<https://www.anchorterminal.com/games/agent-of-somebody/>。游戏页未见发布日期，本轮抓取于 2026-11-13（Last-Modified 只反映抓取当天）；键鼠与触控，三档难度；本轮未打开游戏。
- **作者原文**：<https://www.anchorterminal.com/blog/how-we-built-agent-of-somebody>。Vlad Cealicu，2026-11-11，约 1,473 词；同一页提供 `.md`、`.min.md`、`.json`。
- **作者截图**：<https://www.anchorterminal.com/games/agent-of-somebody/cover.webp>。作者随游戏页发布的公开封面；博客正文没有独立的改前/改后同机位截图，故“改前画面”只能靠 Reddit 原帖与作者文字，不能做像素级对照。
- **版本与日期**：博客 2026-11-11 发布/更新（JSON-LD 的 datePublished/dateModified 均为 2026-11-11），作者写当天完成并上线；游戏页没有可见日期，本轮抓取于 11-13，不能把 11-12 当作已核更新日。没有版本号或 changelog；作者给出 6 个 PR 号（735、747、748、749、760、761）与提交时间线，但仓库未公开，PR 不可独立验证。
- **改前/改后可复核对象**：
  - 玩家原话：r/accelerate 帖 <https://www.reddit.com/r/accelerate/comments/1xtjrsp/fable_52_built_me_a_game_overnight_a_bit_of_back/>；NovaLeganto 的评论 <https://www.reddit.com/r/accelerate/comments/1xtjrsp/comment/19shaukgpojxe/> 写 “The claudespeak might be meta, but it makes this utterly unplayable, sorry.”；threefriend 的评论 <https://www.reddit.com/r/accelerate/comments/1xtjrsp/comment/19si2yuin5dr9/> 写每个 UI 元素都有字幕、telling not showing；JustAGuyInTampa 的评论 <https://www.reddit.com/r/accelerate/comments/1xtjrsp/comment/19sig97hdlp7l/> 写主菜单 “ADHD overload”，缺视觉层级；SomeoneCrazy69 的评论 <https://www.reddit.com/r/accelerate/comments/1xtjrsp/comment/19shgrqw8twwx/> 写纽约 Boss 难度尖峰、十次都活不过 30 秒。
  - 作者回应：<https://www.reddit.com/r/accelerate/comments/1xtjrsp/comment/19shbm6e7xnfl/> “ok, i'll fix that, sorry i know some of the text is very obscure and does not make much sense”；<https://www.reddit.com/r/accelerate/comments/1xtjrsp/comment/19shky1i5b6qt/> “I have done a voice pass, is it anh better now?”。
  - 改后描述：作者博客写明约 200 行文案当天下午重写；生命条 `Context` 改 `Health`，死亡 `Context exhausted` 改 `You died`；伦敦首个提示从 “Those carry it. A key opens a tool the lab can reach: take every one.” 改为 “They're infected. When one drops a key, walk over it. Each key gives you a tool.”；三关 Boss 技能栏从 4/6/8 个砍到 2/3/4 个，作者自评“we have too many tools”；砍半后纽约变难，同小时按 bot 重平衡，躲 6/10 的 bot 对最终 Boss 胜率 39%，躲 9/10 的 81%。
- **AI/人分工**：Fable 5.2 在浏览器 Claude Code 会话中写代码；作者负责提示、试玩、改主意、决定文案与难度；约 3 小时提示加一夜无人运行。作者自述模型只在 headless 浏览器 + 软件渲染器跑过，没在真实显卡上看过、没通过扬声器听过，手机帧率未测；新文案由同一个模型写，没有未看过游戏的真人冷读。这是本项最关键的限制。
- **许可**：游戏代码没有单独许可声明；资产逐项见 <https://www.anchorterminal.com/games/agent-of-somebody/credits.txt>：Poly Haven 表面/天空/道具 CC0、MakeHuman 基础网格 CC0、CMU 动作捕捉库、Piper 语音（仅公有领域或 CC BY 的声音）；站点数据与 listing 文本为 Anchor Terminal CC BY 4.0。CMU 动捕的具体使用条款该页未展开。
- **成本**：未给美元账；作者说用完了三次用量重置，估算需要四个 Fable 5.2 账号才能做完。
- **运行未验**：本轮未启动游戏，未看完整实机，未试听；手感、帧率、移动端与难度平衡均未核。
- **窄实践（可在本仓 FPS/MOBA 首屏验证）**：把玩家原话逐条映射到具体 UI 元素，只改触发点对应的文案与技能栏数量；改后让未看过游戏的人在首屏 10 秒内复述“我现在该做什么、怎么暂停”，以复述失败项作为下一轮修复清单。验收对象是“非作者首屏复述”，不是作者自觉更清楚。

### 4.2 Aiden's Revenge（Lex Toumbourou）

- **可玩**：<https://aidens-revenge.pages.dev/>。12 关四人清版动作；本轮未打开游戏。
- **作者原文**：<https://notesbylex.com/fable-5-2-one-shotted-my-nephews-dream-game>，2026-11-10；作者写 Fable 5.2（early access，经 Claude Code）在 6 月 Opus 4.8/Fable 5 旧版上通宵重写。
- **作者截图**：<https://notesbylex.com/_media/aidens-revenge/first-version-fight.jpg>。作者发布的首版战斗截图；同页另有家庭试玩图 <https://notesbylex.com/_media/aidens-revenge/playtest-family.jpg>、四手柄图 <https://notesbylex.com/_media/aidens-revenge/four-controllers-bluetooth.png> 与 18 人角色选择图 <https://notesbylex.com/_media/aidens-revenge/character-select-18.jpg>。
- **版本与日期**：2026-11-10 发布；无版本号、无 changelog；旧构建未存档，不能做字节级前后对照。
- **改前/改后可复核对象**：
  - 玩家原话：HN <https://news.ycombinator.com/item?id=50434516>，mmahemoff 写“进游戏后找不到退出，只能狂按键盘找操作；菜单写 Punch，但看不出是哪个键，而且不是 p；Enter 暂停不符合习惯”，并建议加 ESC/P 暂停与操作页；<https://news.ycombinator.com/item?id=50437329>，p2detar 写 10 分钟试玩发现碰撞异常、可在地图边缘无限连踢刷分、Pudding 动画怪、Stage 3 很难。
  - 作者回应：<https://news.ycombinator.com/item?id=50434918>，2026-11-10T01:28Z，“Good call. I haven't really tested it much on the keyboard - we mostly used the PS4 controllers, but I'll add these fixes.”
  - 改后当前构建：本单元已抓取并检索 `assets/index-BDFYTUdJ.js`，其中含 `ESC / P = PAUSE AND CONTROLS` 常驻渐隐提示、`HOW TO PLAY` 按键页、ESC/P 暂停键处理；这可证明当前构建有这些能力，但不能证明全部来自该条 HN 回复，也不能证明旧构建没有。
  - 另一条二改线：家人四手柄试玩后，Owen 加 Hulk Smash，Aiden 的大招改为全屏闪电蓝火，可用角色从 5 个扩到 18 个（含亲戚和两只宠物龟），过场与故事随每次新增重画；作者还写明模型自己写 bot 在无头浏览器打通 12 关并看截图找问题。
- **AI/人分工**：Fable 5.2 写代码、写 bot、自检；作者给简报、组织家人试玩、按反馈选改动。作者未声明人手写代码。
- **许可**：未给源码、未声明代码/资产许可。资产数量以作者原文为准：首轮重写生成约 175 张图与 140 段音频；最终口径约 500 张图、11 首音乐、约 100 个音效与 90 条播报（<https://notesbylex.com/fable-5-2-one-shotted-my-nephews-dream-game> 的 “The final token tally”）。80aj 的中文报道 <https://www.80aj.com/2026/11/10/claude-fable-street-fighter/> 也分别给出首轮 175 图/140 音频与最终 500 图/11 首音乐/约 100 音效/90 条播报，仍按二手旁证处理，资产数量以作者原文为准。
- **成本**：作者给约 600 次请求/两天、约 340M token（320M 缓存读 + 19M 缓存写 + 1M 输出），未给美元账单；“one-shot”只指过夜那一轮，不是从零一次提示。
- **运行未验**：本轮未启动游戏，未看完整实机，未试听；手柄/键盘差异与 Stage 3 难度未复测。
- **窄实践（可在本仓 FPS 首屏验证）**：把“暂停与操作说明”列为首发验收：首屏常驻一行暂停提示，非作者在 30 秒内完成暂停并说出主攻击键；未通过就不算可玩。与 Agent of Somebody 的复述测试配对，一个测“知不知道做什么”，一个测“会不会停下来”。

## 5. 乙级：二改证据强，差至少一项硬条件

### 5.1 COLD BOOT（rossinek / Artur Rosa）

- **可玩**：<https://rossinek.github.io/cold-boot/>。
- **作者原文/仓库**：<https://github.com/rossinek/cold-boot>；`docs/DESIGN.md` 的 REVISION 2/3、`CLAUDE.md`、提交历史。
- **作者截图**：仓库与 `docs/` 没有截图文件。`CLAUDE.md` 的 `scripts/shot.mjs` 能生成 headless GPU 截图与性能数字，但截图只写到本地 `shots/`，没有随仓库公开到可引用的绝对地址；这是本项未进甲级的主因。
- **版本与日期**：2026-11-11 起 rev2 设计；2026-11-12 rev3 检查点。可直接核的提交：`2987647` Revision 2 design、`2b1d15b` enemies rev2、`589dbc3` story+ui rev2、`ad5a9a6` Revision 3 design、`52a95a5` checkpoints；早期提交带 `Co-Authored-By: Claude Fable 5.2`，11-12 之后部分提交带 `Co-Authored-By: Claude Opus 5.5`。
- **改前/改后可复核对象**：`docs/DESIGN.md` 的 REVISION 2 标题下直接写 “Goals from the player's feedback”，并列出：文字碎片必须短且推进主线；首个敌人从 skitter 改为醒来的 android；skitter 推迟且更弱；加入会动的惊吓细节；节奏放慢；首次通关目标 18–25 分钟。REVISION 3 加六处自动检查点、快速恢复与 Continue/Load。rev2 的敌人、故事/UI 提交成组可回滚；这是本页最“工程化”的改前/改后对象。
- **AI/人分工**：README 写 “created autonomously by Fable 5.2 + Opus 5.5”；`CLAUDE.md` 规定模块所有权、契约入口、headless GPU 截图与 perf 命令。人负责设计契约、验收与玩家反馈；代码主要由模型写。注意不是“纯 Fable 5.2”，后期提交有 Opus 5.5。
- **许可**：仓库无 LICENSE；资产全程序生成，但复用/再分发许可未声明。
- **成本**：未给。
- **运行未验**：本轮未启动游戏；作者称 headless GPU 截图与 perf 命令可跑，本端未复跑。
- **缺口与降级理由**：DESIGN 只写 “player's feedback”，没有点名反馈者、没有引用原话、没有截图直链；无法判断这是外部玩家还是作者自测。补齐前只作工程流程参照。
- **窄实践（可在本仓网页 FPS 验证）**：每次二改在 `DESIGN.md` 写一条 “Goals from the player's feedback”，每条目标绑定一个可回滚 commit，并用固定机位截图 + perf 命令复验；没有绑定 commit 的目标不算进入版本。

### 5.2 Hanford Reach（chzbloom123）

- **可玩**：仓库 About 的 website 字段给出固定部署 <https://settlement-bluff-fable52.vercel.app>；README 写托管在 Vercel、每次 push 自动发布、每个 PR 有 preview link。本机 curl/TLS 000，未验证可玩。
- **作者原文/仓库**：<https://github.com/chzbloom123/settlement-bluff-fable5.2>；逐会话记录 <https://github.com/chzbloom123/settlement-bluff-fable5.2/blob/main/BUILDLOG.md>；另有 `plan.md`、`CLAUDE.md`。
- **作者截图**：`plan.md` 引用 `docs/review/01-spawn.jpg` 至 `07-aerial.jpg` 等固定机位图，例如 <https://github.com/chzbloom123/settlement-bluff-fable5.2/blob/main/docs/review/01-spawn.jpg>、<https://github.com/chzbloom123/settlement-bluff-fable5.2/blob/main/docs/review/07-aerial.jpg>；Milestone 1 的前后对照在 `docs/review/m1/`，如 <https://github.com/chzbloom123/settlement-bluff-fable5.2/blob/main/docs/review/m1/00-arrival-after.jpg>、<https://github.com/chzbloom123/settlement-bluff-fable5.2/blob/main/docs/review/m1/03-main-street-east-before.jpg> 与 <https://github.com/chzbloom123/settlement-bluff-fable5.2/blob/main/docs/review/m1/03-main-street-east-after.jpg>。
- **版本与日期**：2026-11-10 前 Phase 1；2026-11-11 Milestone 0/1/2；BUILDLOG 逐条记日期与“已合并/待试玩”。
- **归因**：仓库名与中文索引标 Fable 5.2，但 README/BUILDLOG/plan 正文未见模型句；归因强度低于甲级，需补作者一句原文或提交署名。
- **改前/改后可复核对象**：BUILDLOG 原文写 Milestone 0 在 “Chaz's playtest” 后合并；Chaz 报告 A/D 已修、鼠标太灵、画面局部闪烁。固定机位与测试是 Milestone 0 建立的：`npm run shots` 渲染 12 个固定视角，`npm test`（Vitest）覆盖帧统计与移动方向。Milestone 1 据此修太阳/天空光/曝光/材质亮度/AO/道路/店面，并新增 `00-arrival` 视角，共 13 个，13 条测试通过；当前 README 写 14 个固定视角。`plan.md` 列出 13 条渲染问题（首屏面对黑墙、阴影近黑、金属全黑、橱窗被水泥封死、锯齿阴影、悬空黑路、AO 黑框、灌木半黑等），Milestone 1 后 1–8 项已修，前后图在 `docs/review/m1/`。这是本页最接近“玩家报错 → 固定机位前后对照 → 测试”的链条。
- **AI/人分工**：人是 Chaz/Brie 的试玩与合并者；模型写代码与渲染；BUILDLOG 明确 “One draft pull request per milestone; Chaz plays the preview and merges”。作者还写明云会话没有显卡、用 SwiftShader 软件渲染，帧率必须回真实硬件测。
- **许可**：仓库未声明 LICENSE；资产为代码内绘制，复用许可未核。
- **成本**：未给。
- **运行未验**：本轮未启动游戏；BUILDLOG 自述“未检查帧率和运动中的闪烁”，因为会话没有显卡。
- **缺口与降级理由**：有固定部署 URL 但本机 curl/TLS 000 未验证可玩、Fable 5.2 归因待补，故不进甲级；截图直链见上，反馈者、问题、修复、测试四段最完整，若下一轮补一项玩家闭环，优先补它。
- **窄实践（可在本仓 Star/FPS 场景验证）**：把每条玩家报的操作/画面问题写成“问题 → 固定机位前后图 → N 条测试”三件套，进入 BUILDLOG 后再关单；没有前后图的修复只算声称。

### 5.3 雾锁山门 / guizang-game-skill（歸藏）

- **可玩**：<https://op7418.github.io/guizang-game-skill/>；第三方镜像 <https://fable52.games/play/wusuo-shanmen>。
- **作者原文**：<https://github.com/op7418/guizang-game-skill>（README 与 SKILL.md）；即刻原帖 <https://m.okjike.com/originalPosts/6af51b623ce945612e972464>；中文复盘 <https://www.woshipm.com/ai/6492666.html>；作者 X <https://x.com/op7418/status/2120694045299327187>。
- **作者截图**：README 内嵌 `media/demo.gif` 实机战斗动图 <https://github.com/op7418/guizang-game-skill/blob/main/media/demo.gif>；同目录另有连招/技能/大招截图 <https://github.com/op7418/guizang-game-skill/blob/main/media/shot_combo.jpg>、<https://github.com/op7418/guizang-game-skill/blob/main/media/shot_skill.jpg>、<https://github.com/op7418/guizang-game-skill/blob/main/media/shot_ult.jpg>。
- **版本与日期**：2026-11-12 发布；TryAIGame 页面 11-13 更新，记录作者 11-12 承诺“更多关卡”。没有版本号或 changelog。
- **改前/改后可复核对象**：作者写《雾锁山门》用 Fable 5.2 约 6 小时、4.5 亿 token（其中一部分是 Opus 5.5 跑测试；作者 X 帖写“45 亿 token”，与公众号长文和 README 的“4.5 亿”相差 10 倍，本页按长文/README 取 4.5 亿）；自己试玩 7 轮，每轮提 5–10 个问题；因为不懂游戏，只会说“动作很僵硬”“打击感很差”，AI 把这些话翻译成专业做法去查、去改；一次真实返工是纯文字生成 3D 模型质量差，改为“先出设定图再图生 3D”后明显提升。Skill 文档把验证钩子、三阶段截图核对、三种打包写成可执行步骤。
- **AI/人分工**：Fable 5.2 生成与修改，Opus 5.5 参与测试；作者试玩、提问题、决定保留哪条做法。作者自述不是“一句话出成品”。
- **许可**：Skill 文档与仓库代码 AGPL-3.0；演示游戏美术、模型、配音、配乐、文案版权保留，不可转载再发布或商用。
- **成本**：6 小时与 4.5 亿 token 按公众号长文与 README；作者 X 帖写 45 亿 token，两处不一致，本页取 4.5 亿并保留差异；未给美元账单。
- **运行未验**：本轮未启动游戏，未看完整实机；7 轮试玩的逐轮清单未公开，无法核对每轮改了什么。
- **缺口与降级理由**：缺逐轮 changelog；反馈来自作者自玩，不是外部玩家。作为“把主观手感翻译成技术动作”的中文样本仍很强。
- **窄实践（可在本仓 FPS 战斗验证）**：每轮试玩记 5–10 条问题，把“动作僵硬/打击感差”翻译成可执行做法（前摇后摇、命中顿帧、分级击退、音效时序），只选一条进入下一构建，用固定机位录屏对比。

### 5.4 MOTHLIGHT // Vesper-9（hahaliu1029）

- **可玩**：<https://fable52.games/play/mothlight>。
- **作者原文/仓库**：<https://github.com/hahaliu1029/fable5.2demo/blob/main/mothlight/REPORT.md>（`mothlight/REPORT.md`）。同一仓库还有 Tidebell、青云宗、MISREMEMBER。
- **作者截图**：REPORT 列出 `screenshots/01`–`09` 最终构建截图，绝对地址如 <https://github.com/hahaliu1029/fable5.2demo/blob/main/mothlight/screenshots/01_title.jpg>、<https://github.com/hahaliu1029/fable5.2demo/blob/main/mothlight/screenshots/05_core_monorail.jpg>、<https://github.com/hahaliu1029/fable5.2demo/blob/main/mothlight/screenshots/09_finale.jpg>；全部 9 张见 <https://github.com/hahaliu1029/fable5.2demo/tree/main/mothlight/screenshots>。
- **版本与日期**：2026-11-11 的 “NIGHT RUN” 把第一人称步行探索改成赛博城市驾驶；作者在 REPORT 称旧版本地归档为 `mothlight-before-driving.tgz`，公开仓库 tree 无此文件、两个可能的 raw 路径均 404，未核到可下载链接。
- **归因**：仓库名与 README 标题为 “Fable 5.2 Demo”，REPORT 正文写 “Claude in Chrome” 但未逐句写模型版本；归因靠作者仓库命名与收录索引，需补一句原文。
- **改前/改后可复核对象**：改前步行版没有公开归档（REPORT 称 `mothlight-before-driving.tgz` 在作者本地），不能做字节级对照。REPORT 记改前步行版为 586 KiB 单文件、9 个模块约 2,100 行；当前 driving 版 `mothlight/index.html` 为 1,171,360 字节，`mothlight/src` 有 12 个 JS 模块共 2,780 行。REPORT 写清楚保留了什么（城市、立面、雨、招牌、单轨、飞蛾）、去掉了什么（步行控制器、电梯玩法、终端）、新增了什么（街机车辆物理、12 个计时门、手刹漂移、加速、交通、存档），并记 driving 版 21/21 测试通过；作者称在 Chrome 约 120 fps（M4 Max，1512×717），并列出未做/伪造项（门是放车到位而非真跑一圈、声音未听、道路不在反射里、交通穿路口、行人不可撞、建筑仍是盒子、无触控/手柄）。独立审查发现 6 个问题，修了 5 个，留下 1 个性能项。
- **AI/人分工**：作者给三次提示并验收；模型写代码、模型与测试；独立 reviewer 找问题。不是玩家反馈驱动的二改，而是作者第三次提示的方向性重做。
- **许可**：仓库 Apache-2.0（`LICENSE`）。
- **成本**：未给。
- **运行未验**：本轮未启动游戏；120 fps 与 21/21 测试是作者口径。
- **缺口与降级理由**：改动清单与当前构建数字最细，但改前归档未公开、没有字节级对照；触发是作者改方向，不是玩家首读/反馈。截图直链见上。
- **窄实践（可在本仓网页 FPS 验证）**：每次大改先把旧构建打成 `*-before-*.tgz` 并随仓库公开、与 REPORT 同提交，保证任何“改好了”都能回到字节级对照；只在本机归档、没有公开链接的改动不算可复核二改。

### 5.5 Golden Hour Ride（Pootlepress / Jamie Marsland）

- **可玩**：<https://golden-hour-ride.space.fast/>。
- **作者原文**：<https://www.pootlepress.com/2026/11/i-built-a-cycling-game-by-talking-to-claude-and-you-can-ride-it/>，2026-11-11。
- **作者截图**：作者博客没有静态截图，只有内嵌实机视频 <https://www.pootlepress.com/wp-content/uploads/2026/11/alps-ride.mp4>（本轮未播放）；可玩页可看当前画面，未提供独立截图。
- **版本与日期**：2026-11-11；无公开版本号/changelog；作者称每次改动在 Spacefast 存为新版本，但未给可访问链接。
- **改前/改后可复核对象**：作者逐项写二改：车把乱晃固定、草地“像黑地毯”重做、雨天山比天亮的错误光照修正、现代建筑换回 19 世纪；原话 “Fable did the building, but the look came from me saying no. A lot.”。这些是视觉识读层面的具体改动，但没有固定机位前后图，也没有外部玩家原话。
- **AI/人分工**：Fable 5.2 写代码；作者反复否决与提视觉要求。贴图为 Poly Haven，高程数据来自 Environment Agency。
- **许可**：未声明代码/资产许可；Poly Haven 贴图按其自身许可。
- **成本**：未给。
- **运行未验**：本轮未启动游戏，未看完整实机。
- **缺口与降级理由**：无静态截图（只有内嵌视频）与公开版本号/changelog；作者称每次改动在 Spacefast 存为新版本，但未给可访问链接；反馈来自作者自己看画面，不是外部玩家。
- **窄实践（可在本仓 Star 海岸场景验证）**：固定机位记录“草像黑地毯、天比地亮”这类可读性缺陷，改后同机位再拍；把主观抱怨转成光照/材质参数，不靠“感觉好多了”。

### 5.6 Turbo Tails（Peter Yang）

- **可玩**：<https://turbo-tails.vercel.app/>。本机 curl 000，未能验证当前可玩状态。
- **作者原文**：X <https://x.com/petergyang/status/2119983517795065921> 与 <https://x.com/petergyang/status/2119901658394358005>（oEmbed 可读推文正文，直接访问 402）；作者对比视频 <https://youtu.be/SsSKJA0EHD4>（本轮未播放）。
- **作者截图**：作者未提供可引用的静态截图；X 帖内嵌媒体与对比视频本轮未取。
- **版本与日期**：无版本号、无 changelog；视频记录 Fable 5.2 的 62 分钟构建 + 自评修订 vs Opus 5.5 的 34 分钟版本。
- **改前/改后可复核对象**：作者过程（经 AI Primer 逐条摘录，二手）：Fable 5.2 先按简报做单赛道卡丁车，随后让模型自评并再迭代，再追加三轮打磨；第一条公开反馈是 “Let's make mobile work please”，之后补触屏转向/漂移/道具，再加“最简多人”。这是“发布后按设备反馈返工”的现成样本；原帖正文经 oEmbed 可读，AI Primer 的逐条摘录仍属二手，回复线程未读，不把二手摘录升级为完整作者原文。
- **AI/人分工**：作者给简报与反馈，模型构建、自评、迭代。
- **许可**：无仓库与许可说明。
- **成本**：未给。
- **运行未验**：可玩站本机不可达，未实玩；视频未播放。
- **缺口与降级理由**：原帖只经 oEmbed 读到正文、构建站 000、无版本记录；三项硬条件缺失，只能作线索。
- **窄实践（可在本仓网页游戏验证）**：把“移动端触控转向/漂移/道具全部可用”作为独立首发门槛，桌面通过不算通过；移动端不可用就退回桌面范围，不宣称跨设备可玩。

## 6. 丙级：可玩成品或作者过程，但没有“玩家反馈 → 进入可玩版本”的闭环

以下保留原始链接与理由，供后续补证；不当作已证二改。

| 作品/来源 | 原始链接 | 已核到的理由 | 缺什么 |
|---|---|---|---|
| Peak Hour（BitsMinds 同题对比） | <https://www.bitsminds.com/news/claude-fable-5-2-vs-fable-5-1-hill-climb-2026> | 同 brief 下 Fable 5.2 版内嵌可玩，自建 11 个源文件与 20 多个测试：400 次随机踏板、7.4 小时模拟驾驶、98 次无头 Chrome 键鼠/触摸检查、30/60/144/240fps、Firefox 复跑；236 枚币全部可达，Fable 5.1 版 117 枚只有 86 枚可达 | 第三方评测不是作者原文；难度按 bot 调、没真人试玩、第一帧约 170ms 停顿；不是玩家反馈二改 |
| Skyfire（Higgsfield） | <https://higgsfield.ai/@higgsfield.studio/blogs/claude-fable-5-2-built-a-dragon-riding-game-play-it-free> | 平台文称约 50k 行/79 模块 Three.js 飞龙游戏分七轮，由 critic 和 autoplay bot 试玩后修瞄准 0.45s 反应、僵直翅膀、Titan 血量 7000→4500、第三波难度 | 正文客户端渲染只读到搜索摘要；作者身份、可玩入口、许可/成本未核；不是真人反馈 |
| Blueline（Alex St. Louis） | <https://x.com/AlexStLouis10/status/2120024471100907802> | 作者说让 Fable 5.2 对“已有的”冰球浏览器游戏做性能提升并加新功能，改用 Three.js r187/WebGPU 后发布可玩链接 | 是存量作品二改，但不是首次识读/玩家反馈；原帖经 oEmbed 读到，回复区未读 |
| Duskline（Raúl Berná） | <https://fable52.games/play/duskline-vxn7rh> | prompt 明确要求桌面/移动控制、自动降质、即时重开、本地最高分和命中抖动，是移动端首读与失败反馈写进单文件的样本 | 没有改前/改后，没有版本或玩家反馈 |
| Tensen（Gigabit） | <https://gigabitgamelab.com/arcade/play/tensen-fable/>；原版 <https://gigabitgamelab.com/arcade/play/tensen/>；Gemini 版 <https://gigabitgamelab.com/arcade/play/tensen-carbon/>；原帖 <https://x.com/BeyondTheBoxCN/status/2120476632964043098> | 同一段源视频先由 Opus 5.5 做成可玩 3D，后用 Fable 5.2 重做；文章以源视频、Opus 版、Fable 版三锚点比较场景还原、动作与手感 | “换模型重制”不是玩家反馈二改；无首读前后数据 |
| 超新星ガチャ ASTRA NOVA（Gigabit） | <https://gigabitgamelab.com/arcade/play/supernova-gacha/> | 页面明确标 Fable 5.2、2026-11-10；把同工作室 Opus 5.5 的星霊召喚扩成 38 体、90 连天井、FEVER 和抽卡偏差值/分享图，是同一玩法换更强模型后的系统扩写 | 不是玩家反馈二改；无首读前后 |
| Bayhaven / Fablestar | <https://github.com/fablestar/bayhaven>；<https://fablestar.games/play/>；<https://fablestar.games/plan/index.html> | Fable 5.2 每天一个 session、公开 plan/游戏圣经/CHANGELOG/BUGS/ROADMAP，每个 PR 在 headless Chromium 跑全部 gate，MIT；是“多轮自治开发 + 回归检查”的完整工程样本 | 没有玩家反馈驱动的识读改动；更像逐日重建，不是已发布成品的单次返工；带 $FABLESTAR 代币，合规风险需自核 |
| What the Water Keeps（Kevin Ngo） | <https://x.com/kevin_t_ngo/status/2119868968307695818>；中文页 <https://www.pagepop.cn/zh-tw/use-cases/fable52-what-the-water-keeps> | Fable 5.2 发布当天原帖：8 个梦境世界的灯笼船 3D 浏览器体验；Fable 写代码、Tripo 生成资产、Suno v6 做音乐 | 可玩站本机 000；无源码、无版本、无修改记录；原帖正文经 oEmbed 可读，回复未读 |
| CROSSTOWN（Matt Shumer） | <https://nyc.somethingbig.ai/> | GTA 式纽约开放世界浏览器预览，约 16 小时、多 agent；作者在公开构建中发 “early test version” 请关注者试玩并把反馈交给 agents | 产品页未写模型/版本；作者原帖未读；没有“反馈后具体改了哪一处” |
| Portals: Endless Worlds（Ethan Mollick） | <https://github.com/emollick/ai-portals>；<https://portals-endless-worlds.netlify.app/>；作者长文 <https://www.oneusefulthing.org/p/fable-52-and-jagged-agi> | 让 Claude 生成 471 个代码生成世界，在 328 个后要求“停止扩建、打磨已有世界”，又用 Fable 创建的顾问 agent 团队审查流程 | 作者在 Portals 段落只写 Claude/agents，未在该节明确写 Fable 5.2；归因待核 |
| Lumina Zombies | <https://luminazombies.com/>；作者升级帖 <https://x.com/LuminaBench/status/2120660076927099048> | 页面标 v4.0；作者称新地图加两张旧图大改后硬件需求与延迟减半、画质提升 | 站点无 changelog；X 帖经 oEmbed 可读，修订主张仍需实测 |
| Tennis v1.1 | <https://tennis.sixfingerpunch.com/> | 页面明确写 Version 1.1（2026-11-11），是少数带版本号的头部作品 | 没有 changelog，只能作版本标记，不能证明二改内容 |
| Street Brawler II（@BertrandDiouly） | <https://x.com/BertrandDiouly/status/2119886197648765001> | 作者称 Fable 5.2 用 34m45s one-shot 出 Street Fighter 2 克隆并标为 II；fable5 记录页标 11-09、含 0:30 视频 | “II”提示存在前作，但前作与本次改动未核；不是反馈二改 |
| Opus 5.5 vs Fable 5.2 同一 chai stall | <https://x.com/KernelChai/status/2120028680055628006> | 同一句 “build a full chai tapri game”、同 High 档、双方都称零编辑；作者评 Fable 版更深（租金压力、7 项升级、连击），Opus 版更干净易读 | 是模型对照，不是二改；正好对应“首次识读”但无改前后 |
| 青云宗 · 御剑采灵（hahaliu1029） | <https://github.com/hahaliu1029/fable5.2demo/blob/main/game/REPORT.md> | README 写第二句需求就是“把原来文件夹里的仙侠游戏也打磨一遍”；REPORT 记 Blender polish pass（14 个模型、约 50k 三角形），未改规则/布局/碰撞/自动驾驶，通关仍 56.6s/20 球；成本从 2.5ms 升到 8.3ms（high） | 是视觉/资产打磨，不是玩家反馈；无改前归档；截图/录屏为仓库相对路径；REPORT 正文未写模型版本，归因靠仓库名 |
| Tilt Labyrinth（Silent Star） | <https://blog.silencestar.com/posts/tilt-labyrinth/> | 发布页写中英切换、鼠标/方向键/触屏拖动与手机体感控制，并明确“已通过浏览器模拟检查，真实 iPhone、Android 手机的手感与延迟尚待实测”；可核“操作说明/首读” | 发布页没有帧时或性能数字；未标 Fable 5.2，模型归属只见收录列表；发布页有封面图 cover.png（含游戏画面与操作说明），但无改前/改后或固定机位对照截图 |
| GREYPORT（Silent Star） | <https://blog.silencestar.com/posts/greyport/> | 5v5 战术 FPS，发布页列 32 项规则检查、42 项端到端测试和未测平台/手感 | Fable 归属待核；不是玩家反馈二改 |
| 灯笼街保卫战（Silent Star） | <https://blog.silencestar.com/posts/lantern-street/> | 8 关、4 人本地合作的横版格斗，含未测手感声明 | 页面未写 Fable 5.2，只能作待核候选 |
| Warm Toy Room V25 | <https://fable52.games/play/warm-toy-room-v25> | 站点标注 V25、游戏从 v25 子域加载，是多轮版本迭代的直接痕迹 | 无 changelog；作者页未追 |
| Rдкс（Habr / wepushers） | <https://habr.com/ru/articles/1107202/>；可玩 <https://rdks.wepushers.com/> | 2 小时 37 分从首条消息到上线；Fable 5.2 负责概念、视觉、脚本、生图、浏览器测试与部署，两个 Opus 5.5 子代理并行写日期/星象引擎与场景引擎；约 25 分钟视觉修正、修音乐不播放、AI 配音加速升调 | 无版本级 UI/可读性前后对比；许可与成本未披露 |
| First Crush（Kieran Klaassen） | <https://frontier.every.to/experiments/first-crush> | 作者说模型先自玩到游戏内第八年才轮到人试，可看无人类反馈的自测循环 | 该页未点名模型，只能按列表归因再核 |
| Harmonies 桌游移植（eamag） | <https://harmonies.eamag.me/> | HN 评论作者称用 Fable 5.2 移植桌游 Harmonies 效果很好 | 原作属 Libellud/Johan Benvenuto，页面自标 fan-made，IP/许可需先核 |
| Chairmageddon（Fowl Labs） | <https://fowllabs.com/fable-5-2/chairmageddon/> | 页面标题即标 Fable 5.2 demo，桌键鼠限定 | 小体量一次性 demo，无二改 |
| Night Watch at Sorrow Rock（MIA 76 studies #004） | <https://miaai-lab.github.io/Claude-Fable-5.2-HTML-Files/004-lighthouse-keeper-night-watch.html> | 76 件 Fable 5.2 单文件作品之一，页面给原始 prompt，并写 reduced-motion、触屏和暂停等可访问性处理 | 单件样本，无反馈/二改 |
| Valley Ride（Prasenjit） | <https://github.com/StarKnightt/valley-ride> | 作者把 Blender 马匹奔跑逐帧对照 Muybridge 并公开仓库，可看单一动作的返工验证 | 模型标注为 Opus 5.5 与 Fable 5.2 混用；不是玩家反馈 |
| Cayley flight simulator（Lionel Mora） | <https://github.com/lauramionel/cayley-flight-simulator>；<https://lauramionel.github.io/cayley-flight-simulator/> | 九架飞机按手册做 223 项无头校验，公开 213 项通过及未过项 | 不是玩家反馈二改；无首读前后 |
| ECHO NOEIN: Residual Front | <https://noanoa.itch.io/echo-noein-battlefront> | 作者称游戏部分不到 1 小时、总计约 3 小时且未手改代码，并分帖给出模型与耗时说明 | itch 页本机不可达；只有作者自述，无二改 |
| Gearline GBC | <https://github.com/drago-suzuki58/gearline-gbc> | 作者称用 Fable 5.2 一次性生成 Game Boy Color 专用工厂建设模拟 | 一次性生成，无二改 |
| Schwarz · Rot · Gold | <https://github.com/S7arFish/Fable5.2-Suzerain> | README 明写 Built with Fable 5.2 的魏玛共和国政治剧模拟 | 无二改/反馈 |
| Vaquitas de bloque | <https://github.com/ivolivares/vaquitas-de-bloque> | 作者署名 “Just for fun Claude Fable 5.2 game” 并给 Vercel 试玩 | 小体量休闲，无二改 |
| Jelajah Antariksa | <https://github.com/RafiulM/fable-52-game-3d> | 作者描述为用 Fable 5.2 做的印尼语 3D 太空探索单文件 Three.js | 无二改/反馈 |
| Claude Tower Defence | <https://github.com/DraftRelic275/Claude-Tower-Defence-Game> | 作者描述为 Claude Fable 5.2 Max 设计与实现的塔防 | 无二改/反馈 |
| 黑神话：悟空 · 虎先锋 | <https://www.anxiangsir.com/wukong-tiger-engine/> | 单文件 Boss 战复刻，可补中文 IP 二创与战斗手感样本 | 无二改/反馈；IP 风险 |
| 海克斯大乱斗 / BREACH | <https://lol.hanyue.io/>；<https://cf.hanyue.io/> | 同作者的 ARAM 复刻与运输船联机大厅，可对照单机与联机两种做法 | 无二改/反馈 |
| 飞车 3D / 鹈鹕骑单车 / 运输船 3D | <https://lf3-static.bytednsdoc.com/obj/eden-cn/nulojnulwlo/qqfeiche3d/index.html>；<https://lf3-static.bytednsdoc.com/obj/eden-cn/nulojnulwlo/pelican-bike/index.html>；<https://lf3-static.bytednsdoc.com/obj/eden-cn/nulojnulwlo/cf-transport-ship/transport-ship.html> | 字节 CDN 单文件，可核原始托管与加载体积 | 无二改/反馈 |
| Rifts / Memory of Teresa / Hogwarts Royale | <https://www.spawn.co/@abbidabbi/rifts>；<https://www.spawn.co/@chocopuff/one-hit-kill>；<https://www.spawn.co/@mattshumer/hogwarts-royale> | Spawn 平台上的 Fable 5.2 世界，可与 Mirror Earth 对照同平台产出 | 无二改/反馈 |
| Great Wave / Handful | <https://www.aigameshare.com/games/great-wave-off-kanagawa>；<https://www.aigameshare.com/games/island-god-game>；原帖 <https://x.com/_nilni/status/2120797996610994355> | aigameshare 明确标 Claude Fable 5.2 + Claude Code；《神奈川冲浪里》改冲浪高分游戏，Handful 为 800 万体素岛屿神游戏 | 无二改/反馈；名画 IP 需核 |
| NEON RUNNER | <https://github.com/Ilias-AK/NewGameFromFable5.2> | Canvas 2D 跑酷，按与玩家相遇时间生成障碍以稳定反应窗口 | 设计可核，但无反馈二改 |
| Stranded with Claude | <https://claude-castaway.zachy.dev/> | 页面自述由 Fable 5.2 对话生成、含 17 个场景的岛屿屏保式游戏 | 只核到“单次对话”自述，无作者身份/版本 |
| Petalwake | <https://petalwake.non.io> | HN 评论作者自述为测试 Fable 5.2，用 Instagram reel 生成 Kiki's Delivery Service 风格飞行 | 无二改/反馈 |
| The Long Roll | <https://civilwarstrategy.com/> | HN 作者自述用 Fable 5.2 一天做出南北战争回合战略 | 作者自报，无二改 |
| Outpost Siege | <https://experiments.fazleyrabbi.xyz/outpost-siege/> | B 站 1656 行 FPS 视频的成品入口；视频称浏览器自查 IK 腿/后坐力/换弹并迭代 3–4 次 | 作者原帖（X @itsfazley）未取到直链；自检不是玩家反馈 |
| SUBLEVEL 07 / fable52-fps-repro（wquguru） | <https://wquguru.github.io/fable52-fps-repro/>；<https://github.com/wquguru/fable52-fps-repro> | 131KB 单文件 FPS，公开 73 轮/41 分钟/15.96 美元的 token 账本与提示；用 agent-browser 截图、看控制台、OfflineAudioContext 查削波与静音段 | 自检不是玩家反馈；MIT；它是 Saltline 之外的独立复现，不是 Saltline 本身 |
| 拾月 | <https://m.weibo.cn/status/5364862563650479> | 微博作者称一句话、不到半小时生成六章纪念碑谷式视错觉解谜 | 只有社媒原帖，需另核入口；未读正文/配图（登录墙） |
| Towers of Aurum | <https://www.reddit.com/r/ClaudeAI/comments/1xv1dvs/i_rebuilt_the_warcraft_3_tower_defence_maps_i/>；<https://towersofaurum.com/> | 作者称前作 Neon Mile 20 天 7,000 玩家、持续按玩家反馈更新；第二作把“前五分钟决定留存”做成首局即教程 | 帖中只写 Claude Code，未明确 Fable 5.2；无改前后对照 |

### 6.1 其余同批可玩成品（无二改证据，仅留入口与一句判断）

- Mirror Earth：<https://www.spawn.co/@mattshumer/earth?room=local>。可破坏地球加实时真实天气的浏览器世界，头部作者作品；无可核版本/反馈。
- Oil Paint：<https://patch.gg/blendi/oil-paint>。一小时生成、每帧约 150 万笔触且开源的头部作品；无二改记录。
- Patchwork Quilt：<https://patch.gg/blendi/patchwork-quilt>。同一作者的定格动画风切片，整张地图为代码且开源；无二改记录。
- Starry Nightrider：<https://starrynightrider.com>。梵高《星夜》骑行游戏，作者 @ebbyamir 有 X 原帖；a1dbv 未收录，可作“首次识读靠美术主题”的对照。
- I Would Have Gotten Away With It：<https://i-would-have-gotten-away-with-it.netlify.app/>。Ethan Mollick 的反向 Scooby-Doo 反派游戏，含预告、音乐与音效；无可核版本/反馈。
- Dread & District：<https://dread-and-district.netlify.app>。奇幻运输模拟，代理会讨论美术、设定与笑话；多代理内容如何影响玩家理解未核。
- LANTERNFALL：<https://loktar00.github.io/lanternfall/>。索引特别点出敌人死亡效果，模型与动画均由 Fable 生成；无二改记录。
- Worm Rider：<https://github.com/amirmushichge/worm-rider>。220 KB、3,400 行、10 次提示、模型全从零写的开源作品；成本与提示口径清楚。
- Harvest Standoff：<https://github.com/andreteow/farm-ca>。仓库含 headless 浏览器 bot 对战与 map-fairness 测试脚本（无公开胜率），并记录 Milestone 7 与未建功能；无玩家反馈二改。
- Boring Game（SF Bay transit）：<https://jakozaur.github.io/sf_bay_area_transit_fable_5_2_game/>。作者自述 15 次提示/15 小时/66,000 行/约 700 美元，并投 Show HN；头部里少见的完整成本与提示账本。
- Ironvale：<https://sharpwizard.github.io/ironvale/>。21 句自然语言提示写成、three.js r128 单 HTML 加 5.8 MB exe，PROMPTS.md 公开；二改进度未证。
- Dustfall：<https://github.com/webKing021/dustfall>。近期活跃的 three.js+Vite 西部开放世界，a1dbv 未收录；可补单 prompt 开放世界样本。
- Daedalus：<https://github.com/S77FFY/daedalus>。121 KB 单 HTML 希腊神话解谜，近期活跃；小体量便于核完整可玩与源码。
- The County（potatobench）：<https://github.com/TheMizeGuy/fable-5.2-potatobench>。以 PotatoBench 为评测框架的种土豆策略游戏；可核同题基准到作品的比较口径。
- BLAMELESS（Petyok）：<https://blameless.petruha.ge/>。程序员梗的 on-call 射击游戏，three.js+npm，带确定性模拟与 Node 测试；HN 玩家称其为该批里最好玩的一款。
- Emberdeep：<https://dndnoob.github.io/EmberDeep/>。约 100 KB 单 HTML，仓库描述为 Testing the Limits of Fable 5.2 Game Design；小体量玩法上限样本。
- Sternenjäger：<https://oldzitterhand.github.io/sternenjaeger/>。单 HTML、无构建/服务器，支持移动、键盘与手柄；输入适配完整度对照。
- Shuttle Strike：<https://fedifianto.github.io/shuttlestrike/>。单 HTML 加 CDN 手部追踪，摄像头需 HTTPS 或 localhost；摄像头输入的首次使用门槛样本。
- Educational crystallography game：<https://alum-builder.pages.dev/>。Show HN 的教育晶体学游戏，非娱乐品类；教学可读性对照。
- Dustline Outpost：<https://github.com/systemsluke/fable5.2game>。three.js r128、无构建、使用 Poly Haven CC0 资产，首屏 41 MB；加载成本与资产许可对照。
- Aquila / Dawnward：<https://github.com/GavinLOrio/Fable-5.2-random-game>。一个仓库两款 three.js+esbuild 单文件游戏，含离线自动存档与触屏支持但无在线版；可玩性下限样本。
- Pocket Soccer 3D：<https://github.com/ShaunPrice/soccer-3d>；<https://shaunprice.github.io/soccer-3d/>。单 HTML 七人足球，含越位、红黄牌、点球和战术，开源；规则正确性最容易暴露二改前后差异。
- Cloud Stunt 3D / 云上叠罗汉：<https://finderchangchang.github.io/cloud-stunt-3d/>。同作另挂 golden 优化版（同域 /golden/），是少见的同版本“普通版 vs 优化版”可直接对比的样本。
- TukTuk: وسّع يا باشا：<https://basemazab.github.io/tuktuk/>。README 写明 Claude Fable 5.2 且所有形状、材质、音效由代码生成；零外部资产的开罗街头驾驶样本。
- Becario del Universo：<https://masugus.github.io/fable5.2-5min-game/>。Fable 5.2 五分钟小游戏，单 HTML、桌面与手机同码；低成本快速验证对照。
- Rooftop Rally：<https://wavedash.com/games/rooftop-rally>。头部列表里的 UE 5.9 pickleball 预览，角色由 Tripo、其余 3D 由 Fable 生成；非纯浏览器/引擎混合对照，超出网页成品主范围。

## 7. 丁级：排除、反面样本与窗口外参照

| 对象 | 原始链接 | 为什么不计入 |
|---|---|---|
| Skull Jam（种子二） | <https://skulljam.com/>；<https://www.reddit.com/r/ClaudeAI/comments/1xuvop2/i_built_skull_jam_a_free_12_player_browser_game/>；作者物理回复 <https://www.reddit.com/r/ClaudeAI/comments/1xuvop2/comment/19sk0r1g4pz9h/> | 实际标题是 “1-2 player”（URL slug 的 12 player 易误读）；作者称不是 one-shot，而是几天多次会话细化，Claude 写全部代码、未用 MCP、全部 Fable 5.2；但站点无作者、版本、补丁或更新记录，帖中也没有“反馈 → 修改”的对照。按任务只当排除样本；唯一可核的物理实现是 `@dimforge/rapier2d-compat`（WASM）加自定义物理，不臆测引擎或 AI 分工。 |
| Saltline 原版 | <https://fable52.games/play/saltline-fable-5-2-fps> | 任务明确排重，不作本页候选；只作为几猫/盐线行动/SUBLEVEL 07 的对比基线。 |
| 盐线行动 Online | <https://github.com/wenzhengshi/fable5-2-salt-online> | 把 Saltline 改成 Node/Express/WebSocket 多人 FPS，属 Saltline 衍生，不重做 Saltline 案。 |
| 几猫 CS | <https://fable52.games/play/jimao-cs>；<https://jiage.app/play/jimao-3a>；<https://jimiao-3a-v1.pages.dev/> | 多家报道称把 Saltline 菜单/HUD/电台/标牌汉化换皮：原版约 6,200 行中仅约 100 行不同、底层引擎与混淆变量名一致、删掉 Felix Rieseberg 署名。是“二改但不改善体验、且署名/许可有问题”的反面样本，不是新作品；代码差异未由本端独立比对，仅据游研社/虎嗅/掘金报道。 |
| 几猫调查报道 | 游研社公众号 <https://mp.weixin.qq.com/s?__biz=MzIzNzM3NzE2MA==&mid=2247759483&idx=1&sn=f0a1cec073b5c9951629c6caaf50ea76&chksm=e90091ddd425b48a16b98678a9c54ccc19127ba0c9d2caf12f06ac74a7cdd13cd8598df99be3&scene=0&xtrack=1>；虎嗅 <https://www.huxiu.com/article/4905282.html>；ZAKER <http://app.myzaker.com/news/article.php?pk=6af463378e9f096b75788938> | 作为几猫事件的报道来源，只用于核“改了多少、删了什么署名”，不作作品候选。 |
| 雾港 Mist Harbor | <https://github.com/chencheng666/mist-harbor>；<https://www.daguojueqi.site/mist-harbor/> | 0.3→1.0 有升级文档、修 4,823 件几何丢失，是真实二改；但归因 GPT/Codex，不是 Fable 5.2，按模型范围排除，只作对照。 |
| 傅盛：网页版红警 2.0 | <https://peaceful-wave-530.fly.dev/>；网易 <https://www.163.com/dy/article/LBITVCTH055685JJ.html>；公众号 <https://mp.weixin.qq.com/s/4JWmHSaASbbh_ckq9e9Qyw> | 一改二样本（重做音效、动效、小兵/坦克自主决策），但为 Fable 5、2026-06，窗口外；且“一把过/测试全绿”为作者自述。 |
| 托尼不是塔克：坦克大战 3D | <https://www.jarvisuni.com/game/tanke3d.html>；<https://www.tonyisstark.com/6148.html> | 2D→Three.js 2.5D→强化 3D，40+/38/42 条断言与 24 分钟 soak；模型是 Fable 5（2026-07），窗口外。 |
| 掘金：Fable5 手搓超级玛丽 | <https://juejin.cn/post/7649661913546260526> | 跳跃卡顿→8 帧输入缓冲+7 帧 coyote time、新增 T10/T11 并重跑 9 项，是“二改改善首次手感”的具体记录；但 Fable 5、2026-06，窗口外。 |
| Ink Armada | <https://intelligenttools.co/blog/ink-armada-ballpoint-pen-canvas>；原帖 <https://x.com/chetaslua/status/2101071418507366895> | 文章逐帧核对后指出原视频写的是 Fable 5.1、2 prompts、ChatGPT Images sprites；Fable 5.2 说法无公开佐证，作归因反例。 |
| 突貫砲艦ツラヌキ改 / 天穿ノ光刃 / CARBON | <https://gigabitgamelab.com/arcade/play/tsuranuki-kai/>；<https://gigabitgamelab.com/arcade/play/tensen/>；<https://gigabitgamelab.com/arcade/play/tensen-carbon/> | 突貫页面未标模型；天穿是 Opus 5.5 原版；CARBON 是 Gemini 4 Carbon 版。只能作“同一原案多模型重制”的对照轴，不是 Fable 5.2 二改。 |

## 8. 索引、方法与背景来源

这些不是作品候选，只用于找线索或解释口径。

| 来源 | 原始链接 | 用途与边界 |
|---|---|---|
| fable52.games | <https://fable52.games/> | Show HN 的社区街机与源码查看器，首页 34 款；可玩、可看提示词、可下载 HTML；不是作品本身，部分游戏只有 HTML 没有官方提示词。 |
| fable5.app 作品索引 | <https://fable5.app/fable-5-2/works/> | 按作者帖子收录 389 个声称 Fable 5.2 的作品（47 游戏/92 3D 场景），另有 74 条作者自报成本/时间表；明确警告型号是作者声称、无法核验。 |
| TryAIGame Claude 目录 | <https://tryaigame.com/made-with/claude/> | 列 70 款 Claude 游戏/63 可浏览器玩，给发布/收录日期与版本注记（如 Tennis 1.1）。 |
| vibegamer.io | <https://vibegamer.io> | Fable 游戏投稿/展示平台，ummydev 列表的截图与 prompt 多指向其 CDN。 |
| aigameshare | <https://www.aigameshare.com/> | 另一收录渠道，收有 Thimble Knights、Great Wave、Handful 等；150 款只读第 1 页。 |
| fengyiqicoder/awesome-fable-5.2 | <https://github.com/fengyiqicoder/awesome-fable-5.2> | 当前 star 最高的索引（213 星，133 个可打开作品/107 视频，每日更新，列表 CC0）。 |
| ygx2378/awesome-fable-5-2-games | <https://github.com/ygx2378/awesome-fable-5-2-games> | 中文索引 26 款/22 仓库，附 PROMPTS、TECH_STACK 与 games.csv。 |
| ummydev/awesome-claude-fable-games | <https://github.com/ummydev/awesome-claude-fable-games> | 40 款（29 可浏览器玩）带截图、prompt 与作者 X 原帖。 |
| sandbase-lab/awesome-fable-5-2 | <https://github.com/sandbase-lab/awesome-fable-5-2> | 视频/Three.js/Canvas/提示词与模型对比的日同步集合。 |
| apimodels/claude-fable-5-2-prompts | <https://github.com/apimodels/claude-fable-5-2-prompts> | 汇总 Fable 5.2 首周 145 个创作（含游戏）及 prompt/credits。 |
| zqingdut/Awesome-Fable5.2-Game | <https://github.com/zqingdut/Awesome-Fable5.2-Game> | “点开即玩”中文索引并附提示词原文，第三份独立收录。 |
| lappemic/awesome-ai-built-games | <https://github.com/lappemic/awesome-ai-built-games> | CC0，95 款 vibe-coded 游戏按 6 类整理，可作跨工具对照池。 |
| GamesByAI jam 追踪 | <https://gamesbyai.win/jams/> | 按 jam 对比官方名次与站内玩家评分，适合找“玩家实际评分”而非作者自述。 |
| varghq game-brief | <https://github.com/varghq/skills/blob/87bae2424e1ae02153129ed3789945ee6f0d92bd/code-game-trailer/references/game-brief.md> | 把 11-09/10 的爆款按原帖链接列表，并逐字收录 ericmaskfr 的 prompt；给出三套单文件 three.js brief 模板与可读性规则。 |
| varghq code-game-trailer SKILL | <https://github.com/varghq/skills/blob/87bae2424e1ae02153129ed3789945ee6f0d92bd/code-game-trailer/SKILL.md> | 把游戏录制拆成可验证流程：暴露 `window.__game`、固定机位、自动驾驶、45/45 帧确定性检查，从 trailer 机位发现近景精灵糊成块等首读问题。 |
| @ericmaskfr 的 prompt | <https://x.com/ericmaskfr/status/2119910195325481026> | 2 小时 14 分、$200 计划；prompt 要求“每做完一个系统就自己玩、截图、修不对的地方，直到陌生人能玩 10 分钟不撞 bug”，是可复用的首次识读验收条件。 |
| Wanaka Studio | <https://wanaka.app/> | 11-04 Product Hunt 日榜第一的 AI-native 3D 游戏引擎；freemium，厂商称比“Opus 5.5+Unity”省约 80% token，未独立核验。 |
| Unity Spark | <https://unity.com/spark> | 10-07 与 Google Playground 同步公布，计划 2026 稍晚 closed beta；Unity CEO 明确说不是“一键出游戏”。 |
| Junhan2/oh-my-fable | <https://github.com/Junhan2/oh-my-fable> | fable-5-2 topic 中 star 最高的 Claude Code 插件（61 星），把官方 Fable 提示规范做成常驻规则和 `/fable` 请求卡。 |
| fcsouza/agent-skills | <https://github.com/fcsouza/agent-skills> | 游戏开发插件市场头部（game-dev：26 skills/7 commands/3 agents/5 hooks，GPL-3.0）。 |
| kpab/claude-fable-5-skills | <https://github.com/kpab/claude-fable-5-skills> | 10 个 Fable 5/5.1 工作流 Skill（防过度规划、防镀金、进度落地等）。 |
| Xyloforge/claude-game-skills | <https://github.com/Xyloforge/claude-game-skills> | MIT 的 Claude Code 游戏技能包：game-detail-bar（手感、镜头、反馈、音效、动画、平衡 bot、UI、可访问性、onboarding、改键、移动端、性能）+ asset pipeline + 8 类品类指南；仅 4 stars、无 demo。 |
| walangstudio/gd-skills | <https://github.com/walangstudio/gd-skills> | MIT 游戏开发插件：40 命令、28 skills、20 agents、11 类模板；0 stars、无 demo。 |
| Ethan Mollick《Fable 5.2 and Jagged AGI》 | <https://www.oneusefulthing.org/p/fable-52-and-jagged-agi> | Portals/Dread & District 作者对能力边界的公开判断，用来解释为什么这些作品要二改。 |
| Latent Space Engineering | <https://blog.fsck.com/2026/01/30/Latent-Space-Engineering/> | Aiden 作者明确采用其中的“gassing up”、加载范例文风和子代理竞争审查等提示法；跨模型方法。 |
| TOPAI 多模型对比站 | <https://topai.jarvisuni.com/> | 按 24 个任务并列各模型产出，含 Fable 5.2 的 Jarvis Garage/Cyberpunk Qingming；页面无排名或评分。 |

## 9. 前几项为什么最值得深挖

**1. Agent of Somebody：唯一同时有“外部玩家原话、作者当天回应、改前/改后文案、可玩页与公开许可清单”的样本。** 它不是“作者说修了很多”，而是玩家直接说 “claudespeak makes this utterly unplayable”，作者承认部分文本晦涩，当天重写约 200 行，并把 `Context`/`Context exhausted` 改成 `Health`/`You died`、把三关（伦敦/巴黎/纽约）技能栏从 4/6/8 砍到 2/3/4。可复核对象清楚：Reddit 原帖与评论、作者博客的逐条改前/改后、当前可玩页。它最适合回答“玩家第一次读不懂界面时，具体改哪几行、砍哪些元素”。限制同样清楚：作者自己说新文案仍由同一个模型写，没有未看过游戏的真人冷读；仓库私有，PR 不可独立验证；未在真实显卡/扬声器上跑过。

**2. Aiden's Revenge：唯一有“玩家在 HN 指出暂停/按键问题 → 作者公开承诺修 → 当前构建确实有 HOW TO PLAY 与 ESC/P 提示”的链。** 它补上了 Agent of Somebody 缺的“外部平台公共评论区”和“当前 bundle 可检索字符串”。它的价值不在画面，而在首发可用性：找不到退出、菜单写 Punch 但键不明、Enter 暂停不符合习惯。可复核对象是 HN 评论 50434516/50434918/50437329 加当前 `index-BDFYTUdJ.js` 的 `HOW TO PLAY` 与 `ESC / P = PAUSE AND CONTROLS`。限制：旧构建未存档，不能证明这些提示是新增而非原有；许可未知；成本为作者口径约 600 次请求/两天、约 340M token（320M 缓存读 + 19M 缓存写 + 1M 输出），未给美元账单。资产数量以作者原文为准：首轮约 175 图/140 音频，最终约 500 图、11 首音乐、约 100 音效、90 条播报；<https://www.80aj.com/2026/11/10/claude-fable-street-fighter/> 只作二手旁证。

**3. COLD BOOT：最接近“可复用的二改工程流程”，不是最接近“玩家故事”。** `docs/DESIGN.md` 的 REVISION 2 直接把 “Goals from the player's feedback” 写成六条可验收目标，rev2/rev3 的提交成组可回滚，`CLAUDE.md` 规定模块所有权与 headless GPU 截图/perf。对现案例最有用的不是它的剧情，而是“每条玩家目标绑定一个 commit，再用固定机位截图和 perf 复验”的做法。限制：没有点名反馈者与原话，没有截图直链，README 明写 Fable 5.2 + Opus 5.5，后期提交是 Opus 5.5，不能写成纯 Fable 5.2 自主开发。

**4. Hanford Reach：最完整的“玩家报操作问题 → 固定机位前后图 → 13 条测试”的记录。** Chaz 报 A/D 已修、鼠标太灵、画面闪烁；Milestone 1 修太阳/天空光/曝光/材质/AO/道路/店面，`npm run shots` 的 12 个固定机位由 Milestone 0 建立，Milestone 1 新增 `00-arrival` 共 13 个（当前 README 写 14 个），`plan.md` 列 13 条渲染问题并标出 1–8 已修，`npm test` 13 条通过。它最适合借“问题 → 前后图 → 测试”的三件套。限制：虽有固定部署 URL（仓库 About 指向 <https://settlement-bluff-fable52.vercel.app>），本机 curl/TLS 000 未验证可玩；作者自述云会话无显卡、未测帧率与运动中的闪烁；仓库未声明许可。

**5. 雾锁山门：中文样本里把“手感差”翻译成技术动作最具体的一项。** 作者试玩 7 轮、每轮 5–10 个问题，明确写自己只会说“动作很僵硬/打击感很差”，AI 把这些话翻译成前摇后摇、命中顿帧、分级击退、格挡弹反、敌人轮流进攻、闪避打断等做法；还有一次“纯文字 3D 质量差 → 先出设定图再图生 3D”的真实返工。它最适合回答“非专业作者怎样描述问题、Agent 怎样把描述变成可执行改动”。限制：反馈来自作者自玩，不是外部玩家；缺逐轮 changelog；6 小时/4.5 亿 token 按公众号长文与 README（作者 X 帖写 45 亿，差 10 倍）。

**未进前五但值得排下一轮：** Golden Hour Ride（视觉可读性二改具体，但无静态截图、无公开版本记录）、Turbo Tails（移动端反馈链清楚，但原帖只有 oEmbed、构建站不可达）、Peak Hour（bot 关卡可达性审计最完整，但不是玩家反馈）。

## 10. 未核与边界

- **实玩与观感**：所有候选均未在本端启动游戏、未看完整连续实机、未播放视频或音频、未试听。可玩性只到 HTTP 200 与页面文案；手感、帧率、画质、听感、难度平衡均未验。
- **作者身份**：多数只到 X/GitHub/Reddit handle；Agent of Somebody 作者署名 Vlad Cealicu，Aiden 作者署名 Lex Toumbourou，其余按页面署名。没有联系作者，没有取得任何非公开数据。
- **版本对照**：公开可回滚/可对照的只有 COLD BOOT（git 提交）与 Hanford Reach（BUILDLOG + 固定机位图）。MOTHLIGHT 的改前归档 `mothlight-before-driving.tgz` 只在作者本地：公开仓库 tree 无此文件、两个 raw 路径均 404，需向作者索取，不能当公开可对照对象。Agent of Somebody 与 Aiden's Revenge 的旧构建没有公开归档，只能靠反馈原话 + 作者改后描述 + 当前页面字符串。
- **许可**：Agent of Somebody 的资产逐项在 credits；雾锁山门演示美术/配音/配乐版权保留；MOTHLIGHT/青云宗/Tidebell 仓库 Apache-2.0；Bayhaven MIT；几猫与 Saltline 的署名/许可存在争议。其余多数未声明代码/资产许可，未知不推算。
- **成本**：只有作者自报的口径（Agent of Somebody 三次用量重置、Aiden's Revenge 约 600 请求/两天、约 340M token、雾锁山门 6 小时/4.5 亿 token（X 帖写 45 亿）、Turbo Tails 视频的 62 vs 34 分钟、Rдкс 2 小时 37 分、Boring Game 15 提示/15 小时/约 700 美元）；没有一份是账单级核实。
- **渠道不可达**：Reddit 直连、X 原帖直连、linux.do、知乎、微博正文、微信公众号原文、itch.io、Steam、Lobsters、web.archive.org、`r.jina.ai` 均在本机失败或需登录；因此部分“作者原话”只能引用 Arctic Shift、HN Algolia、oEmbed、locdd 镜像或二手报道，已在对应条目标注。
- **索引口径**：fable52.games 34 款、fable5.app 389 条声称作品、tryaigame 70 款、aigameshare 150 款、gigabit 40 条，各站统计口径不同，不能相加或当成同一总体；`fable52.games` 的模型/提示归属、Reddit 作者自述、HN 标题均按“作者自述”标注，未当独立验证。
- **排重**：Saltline、Evensong、Redrock、FOG CITY 不在本页候选；几猫、盐线行动只作 Saltline 衍生/反面样本；SUBLEVEL 07 是 Saltline 之外的独立复现，不并入 Saltline；傅盛、托尼、超级玛丽、Ink Armada、突貫/天穿/CARBON 只作窗口外或归因参照。

依据：本页所有作品与作者来源均来自本轮已核实并交回的候选清单；图片直链取自同一作者仓库或原文页面，未新增清单外作品来源。事实取自各链接页面正文、API 返回与仓库文件。核实 2026-11-13（UTC+8）。
