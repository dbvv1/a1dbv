# B-AI-GAME-AUDIO-MIX-20261104 · 游戏内分层音频实例（采集单元 1：渠道覆盖与候选排序）

> 整理日期：2026-11-04 UTC。本文件只整理采集单元已核实、去重后的候选清单，不新增未核实链接。没有启动游戏、没有试听、没有观看实机画面，不评作品品质，也不写“已玩/已通过”。链接状态用 curl 复核（见 §8）；README／页面元数据只读，用于补版本、日期与许可字段。

---

## 1. 渠道覆盖表

同一作品可能同时有 GitHub、作者站和商店页，渠道计数不互斥；去重后**59 个条目、60 款作品**（§3.4 中超级玛丽与山海逃亡是两款作品、合列一条），按正文逐项可数：§3.1 3 + §3.2 4 + §3.3 32 + §3.4 20。其中 §3.1–§3.2 的 7 项都有 P/D 证据（CoT 与 Kart 的 R 记 ◐，按任务卡“候选不足”条款保留）；§3.3 的 32 项是观察/机制项，均缺 S 或其他门槛项，不满足候选门槛；A 列标为 ●/◐ 的 AI 参与或声明 35 项，4 项 A○ 未核/未披露。§3.4 的 20 行只作对照与过程线索（5 项有 AI 辅助但主体非 AI：第五个声音、暗流、呓语小镇、打飞机日志、医学史诗；其余 15 行中 14 行为非 AI／程序化参考／未披露 AI 参与，超级玛丽与山海逃亡作者自称 AI 原生开发，但 AI／人工分工、源码与许可未披露，按未核分工的 AI 对照处理）。工具、技能、模型与列表类 **120+ 项**。下表的“归入”是本清单按渠道归属的条目数，不是独立核实数。

| 渠道 | 实际看了什么／怎么取 | 本清单归入 | 读不到与原因 |
|---|---|---|---|
| GitHub 源码（raw / codeload / HTML / Search API） | 逐个读 README、`AGENTS.md`、`CLAUDE.md`、`SKILL.md`、`docs/AUDIO.md`、`docs/design/sound_effects.md`、`src/audio/*`，用 codeload tar.gz 核媒体目录；用 Search API／topic／org 页补仓库元数据与同类实现 | 作品约 22；工具／技能约 85；模型／资源约 20 | REST core API 未认证 60 次/小时用尽（403）；WebFetch 对 github.com 被域名安全校验拦截，改用 curl／raw；issue 页与 `issues.atom` 多为 JS 渲染或空 feed；少量 raw README 在 main 404（默认分支或路径不同）；star 数只能取 Search API 元数据，curl HTML 未解析出计数 |
| GitHub 检索与列表 | `topic:adaptive-music`、`topic:game-audio`、`topic:wwise`、`topic:fmod`、`topic:interactive-music`、`topic:procedural-audio`、trending、`anthropics/claude-plugins-official` 的 marketplace、awesome-godot／awesome-mcp／awesome-ai-game 系列 | 发现层，去重后约 30 | 未找到 canonical 的 awesome-game-audio 仓库；Godot Asset Library API 的 `filter=audio/sound/music` 均返回 `total_items=0`；部分 awesome 列表只作索引，未逐个回原仓 |
| 作者站／作者博客 | levystreet、cot.kevinliu、ryancampbell、ironwright、diaryofamadchaos、6yuwei、p11c.xyz、mowjera、abagames、austinhaynesmusic、tahou、simonwillison、gydel 等 | 约 12 条作品过程／方法 | levystreet.com/portfolio 与 multiversestudios.xyz 域名安全校验失败；magenta.withgoogle.com 同样失败；部分作者站是 JS 应用，只读到新闻页或目录 |
| 官方文档与商店 | Godot `AudioStreamInteractive`、Godot Asset Store、Unity 6.3 Scriptable Audio、Wwise public-library、Google Lyria／Lyria RealTime、ElevenLabs SFX v3、Stability、Steam `appdetails`／`ISteamNews`、Playgama、Wavedash、dont-nod | 约 15 条机制／供给参考；作品 0 | Audiokinetic 原博客 403、Wwise 2026.1 新功能博客被安全校验拦截；Wwise 2026.1 只用 public-library 与微博转载同文核实；itch.io 商店页与 devlog 未读 |
| WebSearch | 中英文约 60 组检索词，覆盖 “AI made game audio mixing”“adaptive music game devlog”“游戏 自适应音乐 分层 混音”“TapTap 制造 音效 音频 开发日志”“BOOOM 音乐 音效”等 | 仅定位，0 个可直接引用的候选 | 本会话额度 200/200 用尽；Bing 忽略 `site:` 与精确短语，只回词典/百科类结果；Google／DuckDuckGo TLS 失败；搜索摘要只作线索，未当证据 |
| Reddit | 直连 `www/old/api` 与 redlib／teddit 镜像均 TLS 握手失败或 Anubis 验证；改用 Arctic Shift 归档 API（`arctic-shift.photon-reddit.com`）读 r/aigamedev、r/gamedev、r/gameaudio、r/IndieDev 的帖子与评论树 | 8 帖；0 个新增候选链接（只用于评论区替代品与反对意见） | 直连 TLS 000／`UNEXPECTED_EOF`；Arctic Shift 有帖子评论为 0 或缺失，读不到投票上下文与折叠评论；`api.pullpush.io` 返回 521；候选链接仍指回 reddit 原帖 |
| Hacker News | Algolia API 读 Show HN 50169128、Ask HN 49972125、Musslop 帖 49723554／49972125 等，含评论树 | 3 帖；0 个作品候选 | 部分帖子只有 1 条评论；HN 页面直连证书主机名不匹配，全部走 Algolia API；没有从 HN 得到优于仓库原文的候选 |
| TapTap | 读 20+ 个 `moment` 开发者日志与 14 个 `app` 游戏页（另有 1 个作品只有 moment、没有 app 页），核评分／评价数；上线日期与版本只对 §4 的项记录，其余标未核；另扫 forum 列表与 JSON-LD | 20+ 页，15 个去重作品（14 个 app 页＋1 个仅 moment；§3.2 2 + §3.3 8 + §3.4 5） | `webapiv2/review/v2/list` 返回 404；用户主页 `/user/...` 与 feed/search API 被阿里云 WAF 的 JS 挑战拦住；部分 moment 页返回加密/混淆负载；`《开发日志3#》` 帖内没有游戏名与可玩链接，未计入候选 |
| 哔哩哔哩 | `search/type`、`search/all/v2`、`x/v2/reply` 与 WebFetch 视频页；读 BV1Aexu6wEH6、BV1N8MF6wEnW、BV1sqnZ6dEMN 等评论区 | 10 页，8 个作品／方法 | `x/web-interface/view` 多次 412 反爬；视频页 HTML 与 `api.bilibili.com` 返回约 3.4 KB 挑战页；空间页与合集页只返回标题壳，视频列表未渲染；拿不到分 P、播放量与完整评论 |
| Steam | `store.steampowered.com/api/appdetails`、`ISteamNews`、商店页 HTML；核开发者字段、发售日与 AI 披露 | 4 个作品 | 部分第三方页面（如 Audiokinetic）403，但 Steam 本身可读；未启动 demo、未看实机 |
| 机核 GCORES | 读 talks/1240529、游戏页 179752／179928／179656，以及 `site.gcores.com/booom2026_games` 的 `gamesData` 模块（342 条名单），按“音乐/音效/声音/AI/歌”过滤 | 4 页 + 342 条名单；3 个作品 | 作者页 `author-center/51` 只渲染导航，未列出文章；部分游戏页是 JS 空壳，只拿到标题与 meta |
| itch.io | 尝试游戏页、作者页、tag／jam／games-like 列表与 devlog | **0**（本轮没有从 itch 保留候选） | TLS 000／证书主机名不匹配（`player.jeifm.com`）、`SEC_E_WRONG_PRINCIPAL`、WebFetch `Socket is closed`、搜索页空 HTML；`r.jina.ai` 与 Wayback 也不可达；无法按 `ai-audio`／`adaptive-music` tag 枚举 |
| Gitee | raw README 与 `api/v5/users/siwpan/repos`；读 bloodmusic、musickit、an-engine 等 | 2 个工具 | Gitee 搜索 API 对“游戏音频”“音频引擎”返回空数组；只能按已知作者仓库列表逐仓读 |
| PyPI／npm／crates.io | PyPI JSON API（bloodmusic）、npm registry（@argila/audio）、crates.io API（tono-core、tono） | 3 个工具 | PyPI 项目 HTML 返回 Client Challenge 反爬页，但 JSON API 可用；npm 包没有公开仓库地址；crates.io 只读元数据与 README |
| YouTube | 读 Tee Jay／GPT 6 Astra 的 Thing on a Spring、Alley Cat: After Dark、NEON RIFT 视频简介与作者描述 | 3 个作品 | TLS 000／Socket closed；频道页与 oEmbed 间歇不可达；没有观看视频帧，也没有拿全频道视频列表；Mallard Vice／Quack Noir 的音频做法未核 |
| Hugging Face | 尝试 ACE-Step、MOSS-SoundEffect、Stable Audio、MiniMax Music 等模型卡 | 0 直接；5 个模型只经 GitHub README／官方文档转述 | huggingface.co 被网络策略拦截（curl 000，WebFetch 报域名不可验证）；模型许可与 related models 未读原卡，只保留“需回原卡核实”的限制 |
| 中文社区（微信、知乎、小红书、今日头条、linux.do、V2EX） | 尝试公众号原文（含《AI 游戏真实项目手记 D05》）、知乎、小红书笔记、头条文章、linux.do 话题 1832879、V2EX 帖 | 0 直接 | 微信返回“环境异常/去验证”壳页，无 `js_content`；知乎 403；小红书“页面不见了”/需登录；头条正文 JS 渲染为空；linux.do Cloudflare“Just a moment”/403；V2EX 连接超时 000；只保留搜索摘要线索，未作证据 |
| 社交短帖（X/Twitter、Bluesky） | 尝试 @mattshumer_ 原帖与 bsky.app 公共 API | 0 直接 | X 搜索只给转述，未取得可直读原帖 URL；bsky.app public API TLS 握手失败；itch.io 2026-11-03 的 AI slop／音轨帖只有二手报道，未列候选 |
| 工具／技能市场 | `anthropics/claude-plugins-official` 的 `marketplace.json`、punkpeye/awesome-mcp-servers、awesome-gamedev-agent-skills、awesome-ai-game-dev-tools 等 | 10 个列表；约 20 个工具 | 部分仓库 issue 页与 `issues.atom` 空 feed；MCP 目录里的项目多数只有 README，未逐个跑；工具展示页只作线索 |
| 游戏首页／研究正文／旧产物 | `domains/game-dev/README.md`“用 AI 做游戏”、`docs/research/2026-10-23-game-worth-trying.md` §8、旧 `B-AI-GAME-SUPPLY-SOURCES-20261027` 产物、`domains/game-dev/assets/audio.md` | 0 个新候选（只做排重） | 已收录的 Riposte、Formula Minus One、DragonScape Idle、Battle Drones、Ascend From Nine Mountains、Remnants of R’lyeh、Codex Mortis、Void Balls、Warpact、Blocks Beyond the Stars、Pawbound、Steel Maiden、LOB、Robo Rally Open、Firefly Lasso、pxl 未重列 |

---

## 结论

**先深挖这 3 个：Claude of Tanks、World of ClaudeCraft、Kart Royale。**

- **Claude of Tanks** 是本清单里唯一同时公开“分层总线 + 按 dB 压低 + 声部预算与抢占 + 资产 pin／manifest + 生成管线 + 可玩构建 + 作者截图 + 代码与音频分开许可”的作品，一份材料能回答本卡四问。**限制：** 可读不可整体复用，`public/audio/**`、`tools/audio/**`、`src/*.generated.ts` 等属 Reserved Content（禁止再发布/商用/训练），需单独书面授权。
- **World of ClaudeCraft** 是本清单里唯一在真实运营的浏览器 MMO 上，把 SFX 独立 `AudioContext`、24 声部上限＋按 key 冷却、`SimEvent` 事件映射和按媒体类别分许可写进可核文档的作品；适合验证“事件→声音”在多人环境里如何不炸。**限制：** 部分 SFX 为 CC BY-NC、CREDITS 未闭合，未登记媒体不可视为免费，商用复用前逐项确认。
- **Kart Royale** 是三者里最小的可读侧链样本：master→compressor、引擎/音乐/滚动环境分层、mini-turbo 时 music 让位 1.25x、charge tone 走 presence-lifted bus、远处 one-shot 150m cull；MIT、可玩、有作者对抗评审复盘与截图，适合先抄一条 ducking 规则。**限制：** `LICENSE` 为 MIT，但 `package.json` 的 `license` 写 ISC，采用前让作者澄清。

**中文渠道首选替补：茫室（Blindside）。** 作者与艺术家 Frank 两人合作：作者指挥 Cursor／Codex 生成代码，Frank 手工制作美术和关卡，音乐音效由 ElevenLabs 生成。作者原文给出事件埋点、双声道脚步、10 秒 loop 拆成 intro/loop/outro、战斗抬高 BGM 与低音、Agent 批量响度归一，且有可玩页；但清单未给作者截图原链接、也没有代码／音频许可，所以放在替补而不是主推。**如果要求主推里含中文作品，用它替换 Kart Royale。**

**直接替补（按缺口选）：**

| 替补 | 什么时候选它 |
|---|---|
| [茫室（Blindside）](https://sspai.com/post/110972) | 要中文原作者渠道＋Unity 管线＋loop 拆分/响度归一；可玩页 <https://www.gcores.com/games/179928>。缺截图原链接与许可。 |
| [NOVA LANCER](https://tanuu5.github.io/nova-lancer/) | 想看源码级 `music/sfx` 总线、duck、pause、共享 reverb，且要完整成本口径；MIT、可玩、作者截图已给原链接，README 更新履历记 2026-09-24 公开、版本 1.0.0；但没有“重要提示”层。 |
| [小巫大祸](https://www.taptap.cn/moment/862262550794863787) | 想先核配音/重要提示层的供给：2026-10-19 上线、7.5 分/7 评价、当前版本 5、可玩第一章；日志01 写明“目前由我一个人独立开发”，2026-10-22 日志写明 ChatGPT/Codex、Claude、Suno、Qwen3-TTS 的分工；配音供给见 10/22 日志（140 句主角去重台词、118 个本地请求文件），播放规则未取得原文，T2 未核。 |
| [AI训练模拟器：智能涌现](https://www.taptap.cn/moment/857188902853674092) | 想先核垂直叠层与事件保全：6 层 BGM 只增不减、升级不打断已有层、读档前四层从同一播放位置齐起播；但没有 ducking 参数与可复用许可。 |

**不建议先试：** 只有工具名或教程、没有实际游戏；只有预告/静音实机；非 AI 对照（石阵与智慧、深渊寻金、远行、呓语小镇等）；以及 itch.io 上未能读到原页的作品。逐项原因见 §3.3–§3.5。

---

## 2. 筛选标准

按任务文件与本卡“怎样算做成”，用 8 条打分；前 6 条是候选门槛，后 2 条决定深挖顺序：

| 代号 | 标准 | 判定 |
|---|---|---|
| P | 可玩链接，或完整连续实机 | 可玩／完整录像＝●；作者称有完整实机或可玩入口，但本单元未独立观看／复核，或入口只在页面内未独立复核＝◐；只有开发日志、片段或预告＝○ |
| D | 作者原始制作过程（作者本人写，不是转述） | 有作者原文／devlog／源码文档＝●；只有 README 简介＝◐；没有＝○ |
| S | 作者公开静态截图原链接 | 清单给出原链接＝●；截图只在仓库 README／商店页内嵌＝◐；没有＝○ |
| R | 版本与发布日期 | 两者都有＝●；只有版本或只有日志日期＝◐；都没有＝○ |
| A | AI／人工分工 | 明确写 AI 做什么、人做什么＝●；只标“含 AI”＝◐；未披露＝○ |
| L | 代码／生成结果／第三方音频许可 | 三者分开写＝●；只写代码许可或只写生成工具＝◐；没有＝○ |
| T1 | 环境／动作／重要提示三层如何供给接线 | 三层都有事件映射＝●；两层＝◐；一层或没有＝○ |
| T2 | 重叠时谁压低／抢占；改提示音或音乐层如何保事件 | 有 dB/优先级/voice steal/循环位置等可核规则＝●；只有原则＝◐；没有＝○ |

> 只有 P 或只有 D 的不进主推候选，只能留在 §3.3 作观察/机制项；P◐ 只够进 §3.3 观察，不够进主推；工具名、教程、预告旁白、静音实机不收。**§3.3 每行列出 P/D/S/R/A/L/T1/T2 全部代号；○ 表示缺或未知，“○（未核）”表示本单元没有核到，不等于满足。** 主推三件里，World of ClaudeCraft 的 R 为 ●（v0.45.7，2026-11-03）；Claude of Tanks 与 Kart Royale 只有版本号、没有发布日期，R 为 ◐（CoT 1.0.0；Kart 1.0.0），按任务卡“候选不足”条款保留并列为待补，不写成 R●；若任务卡硬性要求“版本+发布日期”，这两项需先补发布日期。**成本口径：** 只记作者披露的订阅/专项成本（如 ElevenLabs 付费 Creator、NOVA 的 token 用量）；没有账本的一律写未知，不推算净收益，也不把“免费可用”当成“可商用”。

---

## 3. 候选排序

### 3.1 第一梯队：先深挖的 3 个

#### 1. Claude of Tanks

- **链接与入口：** 可玩站点 <https://cot.kevinliu.studio/>；仓库 <https://github.com/Kevin-Liu-01/Claude-of-Tanks>；作者中文构建记录 <https://cot.kevinliu.studio/cn/docs/build>；作者静态截图 <https://github.com/Kevin-Liu-01/Claude-of-Tanks/blob/main/public/media/site50-r14/stills/s07-lake-shellfire.webp>。
- **证据：** `docs/AUDIO.md` 与 `src/audio/SKILL.md` 公开音频架构；`docs/audio-generation/` 记录 479 个 ElevenLabs 音效如何测量、挑选、master、进 manifest；仓库有 `AGENTS.md`、逐目录 `SKILL.md`、`.agents/skills`、CI 与 selftest。**许可不是整体 MIT：** 根 `LICENSE` 为 MIT，但 [`LICENSE-POLICY.md`](https://github.com/Kevin-Liu-01/Claude-of-Tanks/blob/main/LICENSE-POLICY.md) 把 `src/vehicles/**`、`src/world/**`、`public/audio/**`、`tools/audio/**`、`src/audio/*.generated.ts`、`src/game/*.generated.ts` 等列为 Reserved Content，按 [`LICENSES/Proprietary-Content-License.txt`](https://github.com/Kevin-Liu-01/Claude-of-Tanks/blob/main/LICENSES/Proprietary-Content-License.txt) 的 proprietary source-available 条款授权：禁止再发布、商用与训练，商用需单独书面授权；仅运行时非生成的 `src/audio/` 代码等未被列出的部分适用 MIT。音频为 ElevenLabs 付费 Creator 生成；作者声明 Claude/Codex 是工具、不是共同作者。
- **三层与接线：** `weapons/impacts/environment/vehicles` 归 `world`，自身车体归 `own`，`interior/cinematic/ambience` 归 `interior`，`ui/music/voice/alarm` 归顶层；每个 engine 引用的 asset 必须在 manifest，失败不得用替代声；某一刻依赖的声音要 pin 在 battle set。
- **重叠与保事件：** crew radio 播放时 beds 降 10 dB、world 降 4 dB；HDR 窗口按“最近最响事件”压低；32/16 声部预算下偷最低优先级的 one-shot，loop 不偷；crew line 0–4 优先级＋冷却＋过期丢弃。这组规则直接回答“谁压低、谁抢占、改层时怎么不丢事件”。
- **为什么排第 1：** 它是本清单里唯一把四问都落到可执行数字与清单上的公开样本：分层命名、dB ducking、voice-steal 预算、asset manifest/pin、生成与挑选流程、可玩构建、截图、代码与音频分开许可。dot 可以逐条对照，不需要先猜作者意图。
- **缺口（不要写成已核）：** README 的 “Current release” 只给运行规模（222 辆第一方程序化载具、33 张图、13 种模式），**没有发布日期**；`package.json` 只给版本 `1.0.0`，所以 R 记 ◐，需用固定 commit 与站点快照补日期。Reserved Content 覆盖音频与音频工具链，**`tools/audio/**` 的复用需单独看条款**；ElevenLabs 生成音频的商用范围仍需逐条核。32/16 预算与 dB 规则是文档口径，未在实机复验。**成本与未知项：** ElevenLabs 付费 Creator 订阅，金额未披露；生成音频的商用授权范围未知。

#### 2. World of ClaudeCraft

- **链接与入口：** 可玩 live 浏览器 MMO <https://worldofclaudecraft.com/>；仓库 <https://github.com/levy-street/world-of-claudecraft>；作者工程复盘 <https://levystreet.com/research/building-games-with-ai/>；作者静态截图 <https://github.com/levy-street/world-of-claudecraft/blob/main/docs/screenshots/title-screen.jpg>。
- **证据：** `docs/design/sound_effects.md` 写明 SFX 有独立 `AudioContext`＋`Listener`（与 `audio/music/voice` 并列）、`effects/ambience` 两条总线、`MAX_VOICES 24`＋per-key cooldown、`playAt` 走 `PannerNode`／`playUi` 非定位；事件由 `hud.ts` 的 `SimEvent` 映射（footstep 按地表、damage→swing/impact、cast→loop 等）。**该文档只覆盖 SFX，文末明写 music 与 NPC 语音不在这个 SFX artifact 内；音乐分区在 `src/game/music.ts` 与 `music_zones.ts`，master duck 在 `music_mix_policy.ts`。** 仓库有 `AGENTS.md`、`CLAUDE.md`、`.claude/hooks`（deny-generated-edit、qa-stop）、`.claude/skills` 与 CI；README 标版本 **0.45.7**，GitHub release **v0.45.7 发布于 2026-11-03**。
- **许可分离：** [`CREDITS.md`](https://github.com/levy-street/world-of-claudecraft/blob/main/CREDITS.md) 把 MIT 代码与媒体分开：SFX 为 ElevenLabs/FFmpeg 生成，部分 `@jamiecypher` 为 CC BY-NC，音乐含 Suno Studio 导出。这是本清单里**分离最清楚但尚未闭合**的一份：CREDITS 仍在补全，未登记的媒体资产是“未记录而非免费”，复用前要逐项确认。
- **为什么排第 2：** 真实运营的多人游戏比单人 demo 更能暴露“事件多、并发高、声音互相盖”的问题；它把 SFX 独立音频上下文、24 声部上限、按 key 冷却和 `SimEvent` 映射都写成可核文档，适合 dot 直接对照自己的事件表。分许可也提醒：能玩不等于能复用 CC BY-NC 素材。
- **缺口：** live 服务持续更新，文档可能落后于代码；CC BY-NC 的 `@jamiecypher` 音效不可直接用于商业项目；音乐为 Suno Studio 导出，商用条款需回上游核；CREDITS 未闭合。**成本与未知项：** ElevenLabs/Suno 生成成本未披露；音频二次使用许可随 CREDITS 逐项变化，未知。

#### 3. Kart Royale

- 链接：<https://racing.ryancampbell.com/>；作者复盘 <https://www.ryancampbell.com/kart-royale>；截图 <https://github.com/ryancampbell/kart-royale/blob/main/docs/hero-drift.png>。
- 证据：单提示词 Claude Opus 5＋多轮对抗评审；`CLAUDE.md` 是给代理的交接契约；`src/audio/Audio.ts` 有 master→compressor 总线、引擎/音乐/滚动环境分层，mini-turbo 时 engine 与 music 侧链让位（music 1.25x），charge tone 走 presence-lifted bus，远处 one-shot 150m cull；作者复盘写 127 agents／11 rounds、评分 62/100 与失败；可玩、LICENSE 为 MIT、全程序化音频无第三方音频。**成本与未知项：** 全程序化音频，无第三方音频采购成本；开发成本与发布时间未披露。
- 为什么排第 3：最小可读的“侧链让位”样本，适合先抄一条规则；MIT、可玩、作者复盘与截图齐全，是三项里音频层最薄但最容易先动手的一项。但缺“重要提示”层、版本/发布日期，且 `package.json` 的 `license` 字段写 ISC，与 LICENSE／README 的 MIT 不一致，采用前要让作者澄清。
- 缺口：`package.json` 许可字段冲突；无发布日期（只有 `1.0.0`）；无重要提示层；音频层比 Claude of Tanks 少。**如果要求主推里含中文作品，用茫室（Blindside）替换本项。**

### 3.2 直接替补（按缺口选，不凑进主推）

#### NOVA LANCER

- 链接：可玩 <https://tanuu5.github.io/nova-lancer/>；仓库 <https://github.com/tanuu5/nova-lancer>；作者截图 <https://github.com/tanuu5/nova-lancer/blob/main/docs/screenshots/hero.jpg>。
- 证据：可玩 Three.js 3D 轨道射击；README 写明“一次委托、约 1 小时 40 分、312 次调用、约 1.48 亿 token”；`src/audio.js` 用 Web Audio 建 `music/sfx` 分总线、duck、pause、共享 reverb，并现场合成 BGM、SFX 与无线电人声；仓库 LICENSE 为 MIT（本单元复核），package.json 版本 1.0.0、`repository` 指向本仓库；README「更新履历」记 **2026-09-24 公开**，之后有 09-26／09-27／10-06 更新；README 与 `docs/screenshots/` 给出作者截图原链接（hero.jpg 等）。
- 为什么可替：源码级混音实现比 Kart Royale 更完整，成本口径是清单里最细的；缺“重要提示”层，且作者是日文渠道。
- 缺口：无总线 dB 数值与 voice cap 细节。**成本与未知项：** token 用量已披露，金额未披露；音频为运行时合成、无第三方素材，但仓库未单列音频许可（随 MIT）。

#### 茫室（Blindside）

> 中文原作者渠道首选；因清单未给作者截图原链接、也没有代码/音频许可，放在替补而不是主推。

- **链接与入口：** 作者原文 <https://sspai.com/post/110972>（2026-06-12）；可玩页 <https://www.gcores.com/games/179928>。
- **证据：** 作者记录的 100% vibe coding Unity 俯视角射击（代码侧）：作者与艺术家 Frank 两人合作，作者指挥 Cursor/Codex 生成代码，Frank 手工制作美术和关卡，音乐音效由 ElevenLabs 生成；写明 Codex 按音效埋点接入、15 分钟做双声道脚步、10 秒 loop 扩成 intro/loop/outro、战斗抬高 BGM 音量与低音，Agent 做响度归一化、Cursor 生成 Canvas 图表筛出不合格音频；机核游戏页可在线试玩。
- **为什么可替：** 它是本轮读到的中文原作者渠道里，少数同时给出“可玩 Unity 游戏 + 作者完整过程 + 事件埋点 + 循环拆分 + 响度归一”的样本，引擎与管线跟主推的浏览器作品不同，能给 dot 另一条对照线。它直接回答“改提示音或音乐层如何保事件”的一半：loop 拆段、战斗层抬高、批量归一，而不是停播重来。
- **缺口：** 清单没有给出作者静态截图的原始链接；只有作者文章日期（2026-06-12），没有版本号；没有源码／许可说明，音频全部 ElevenLabs 生成但未写商用条款；没有总线、dB ducking、voice cap 参数；没有“重要提示/语音”层。**成本与未知项：** ElevenLabs 生成成本未披露；代码与音频许可均未知。**如果 dot 要求主推含中文，用它替换 Kart Royale；如果更看重源码级 bus/duck，选 NOVA。**

#### 小巫大祸

- 链接：开发日志01《第一次，一个人做游戏》<https://www.taptap.cn/moment/859428574430497161>（2026-10-14）；开发日志06 <https://www.taptap.cn/moment/861046267839513388>（2026-10-18）；开发日志《为了做这款游戏，我到底用了多少 AI？》<https://www.taptap.cn/moment/862262550794863787>（2026-10-22）；可玩页 <https://www.taptap.cn/app/981776>。
- 证据：日志06 附约 97 秒保留原速、界面和游戏声音的实机（远射/召唤/布阵/近战），并明写“配图也用了这一轮实际战斗的截图”。日志01 写明“目前由我一个人独立开发”，但日志未写团队规模；TapTap 游戏页按 jam 归类为“独立开发者/小团队”，不是团队规模已核。2026-10-22 日志写明：ChatGPT/Codex 与 Claude 参与策划、代码、界面、测试和整合，DeepSeek 参与地图与组件交付，美术用 Hyper3D/Rodin、Tripo，音乐用 Suno，配音先试 EnyouAI 后转本机 Qwen3-TTS；同一日志另记 H5 主项目 `spell/public` 下 390 个音频文件（含旧版与第三方资源，不是配音文件数），配音侧记 140 句主角去重台词、118 个本地请求文件。TapTap 页 datePublished 2026-10-19，7.5 分/7 评价，可玩第一章。
- 为什么可替：它是候选里最接近“重要提示/语音”层的样本（配音由 AI 生成、可玩第一章）；但播放规则未取得作者原文，不能当已核证据。
- 缺口：**10/22 日志关于配音只说明供给与工具（Qwen3-TTS），不含播放规则；日志06 也不含配音播放规则细节**，配音播放规则按未核处理，不计入证据。没有音乐分层、ducking、总线；TapTap 制造平台不导出源码/独立包，平台协议对发布与推广有广泛许可；截图只在日志内嵌，S 记 ◐。**成本与许可未知项：** 配音生成成本未披露（本地 Qwen3-TTS 的算力与时间未折算）；平台不提供可复用许可。

#### AI训练模拟器：智能涌现

- 链接：日志 <https://www.taptap.cn/moment/857188902853674092>；可玩页 <https://www.taptap.cn/app/959589>。
- **不要与 §3.3 #19 合并：** 本条是 app/959589（开发者“图图游戏工作室”，日志 857188902853674092）；§3.3 #19 是 app/957390（开发者“福州炉火科技”，日志 861468238901411988），两者是不同 app、不同开发者与不同日志系列，不是同一作品的不同版本。
- 证据：2026-10-08 日志 4：BGM 是 6 个可叠加音层，随 AI 成长只增不减，升级不打断已有层，读档时前四层从同一播放位置齐起播；点击音 0.35 秒内逐级升调，音效 0.55／音乐 0.28 且独立开关；记录 20 秒层未 `SetLooped` 导致静音；TapTap 页有 DEMO。
- 为什么可替：垂直叠层＋读档同位置＋真实 bug，是“改音乐层如何保事件”的现成案例。
- 缺口：没有 ducking 参数、总线层级与可复用许可；无作者截图原链接；AI 音乐/音效/配音虽在商店页标注，分工细节有限。**成本：** 生成成本未披露。

### 3.3 第二梯队：观察与机制项（不满足 §2 候选门槛）

以下是有机制价值但证据不完整的观察项，至少满足 P◐ 或 D◐（多数为 P●）；按 §2，P◐ 只表示作者称有完整实机或可玩入口、本单元未独立复核，只够进本表观察、不够进主推候选；只有 P 或只有 D 的行同样只作观察。**每行给出 P/D/S/R/A/L/T1/T2 全部代号，判定见 §2；“○（未核）”是本单元没核到，不等于满足。缺口与未核原因写在最后一列，不表示作品差。**

| # | 作品／入口 | 机制与理由 | P/D/S/R/A/L/T1/T2 | 缺口与未核 |
|---|---|---|---|---|
| 1 | [鸭鸭 · 禁区撤离](https://www.taptap.cn/app/976726)（日志 <https://www.taptap.cn/moment/860586225159899381>） | 10 把枪拆独立开火/装填音，声源分枪声 12 路、反馈 8 路、装填 1 路以“避免高速武器抢占提示音”；低帧同帧多发保留真实间隔、逾期枪声从已逝位置接尾音而不从头重播；暂停/失焦/切枪/终局清理且终局命中与撤离提示音完整播完；155＋254 条断言 | P● D● S○ R○（未核） A○（未核） L○ T1◐ T2● | 平台不导出代码与音频；作者未逐项披露 AI/人工分工；本单元未记版本与上线日期。 |
| 2 | [空境初造](https://www.taptap.cn/app/953921)（日志 <https://www.taptap.cn/moment/857001319871810053>） | 10 个音效＋5 首场景配乐；Master/Music/SFX 三条总线；音量走总线即时全场生效并存云存档；分批生成音效最响与最轻差 36 dB，按分类归一化到 4 dB 但保留组合技/绝境强调音 | P● D● S○ R○（未核） A◐ L○ T1◐ T2◐ | A 只有平台标记；L○；S○；R 未核；有总线无 duck/抢占参数。 |
| 3 | [流光工坊](https://www.taptap.cn/moment/858736733208969536)（可玩 <https://www.taptap.cn/app/968150>） | 8 种界面音并成 1 种、删掉 3 种画面已表达的提示音、拾取音降调削高频；同一时刻只播一个音效，新音效遇占用就不播（不打断不排队），按钮音永远给反馈，轨道车循环不算占坑 | P● D● S○ R○（未核） A◐ L○ T1◐ T2● | A◐；L○；S○；R 未核。 |
| 4 | [刀光剑影](https://www.taptap.cn/moment/861349947709064001)（可玩 <https://www.taptap.cn/app/966587>） | 12 个 AI 音效接到出刀/命中/拾取后按试听反馈全部撤掉，AudioManager 缩成只管 BGM；记录淡入淡出状态机、`Play()` 从头播、pitch 传绝对 Hz、100ms 缓冲与 299 条断言；是“改提示音如何保事件”的反例 | P● D● S○ R○（未核） A◐ L○ T1◐ T2◐ | A◐；L○；S○；R 未核；有状态机无 duck。 |
| 5 | [牧羊人](https://www.taptap.cn/moment/855937164653888536)（可玩 <https://www.taptap.cn/app/958854>） | PICO-8 推箱子；音频硬约束 4 声道中 BGM 占 3、音效只留 1；`lint_audio` 专门守 `music()` 保留声道不被 `sfx()` 插断，另有格式/音高/长度/声道检查；AI agent＋DeepSeek 做可自动化部分，人负责关卡与听感 | P● D● S○ R○（未核） A● L○ T1◐ T2● | L○；S○；R 未核。 |
| 6 | [群侠传：幸存者](https://www.bilibili.com/video/BV1S9uw6jE12/) | 作者 Nenly 的 47:55 全程解说实机（开局选人到第 17 波）；Steam 免费 EA、2,314 条 97% 好评；AI 披露明确写代码/美术/动画/音乐/音效均有 AI 参与、无实时生成内容，配乐 Suno、语音与音效 ElevenLabs | P● D● S○ R○（未核） A● L◐ T1◐ T2○ | 只有 Steam EA 状态、无具体日期与版本；L 只有披露与生成工具、无逐资产许可；S○；无总线/duck/抢占细节。 |
| 7 | [CHAMBER SERVICE](https://wavedash.com/games/chamberservice) | 可玩 PS1 风格枪店 noir（Wavedash，开发团队 Komet）；商店页只有玩法介绍。音频技术细节（Godot 4.7、Python 合成、约 50 个 headless 场景）不在本单元所读页面，属未核线索 | P● D○（未核） S◐ R○（未核） A○（未核） L○ T1○ T2○ | 作者原文/开发日志链接未找到，音频数字未核；AI 披露未在所读页面出现；无音乐层/总线/duck。 |
| 8 | [Iron Curtain Call](https://store.steampowered.com/app/5417460/Iron_Curtain_Call/) | Steam demo 已上线（正式版 2027-03-11）；作者披露约 2,800 条 ElevenLabs 语音、FluidSynth 谱曲加少量 ElevenLabs cue；headless 跑测撞到 Godot 音频线程竞态，需实测绕过 | P● D◐ S○ R◐ A◐ L○ T1◐ T2○ | 有发售日、无版本号；D 只有商店页披露、作者原文未读；L○；S○；无层级/混音。 |
| 9 | [Galaxiwilds](https://store.steampowered.com/app/4697140/Galaxiwilds/) | Steam 有可下载 demo、商店页有 AI 披露；作者原帖称音乐用 Suno、音效用 ElevenLabs，配乐是 reactive 的，战斗时鼓层淡入、结束后淡出；是“换音乐层保事件”的直接案例 | P● D◐ S○ R○（未核） A◐ L○ T1◐ T2◐ | 作者原帖未直读，只有二手与商店页；L○；S○；R 未核；无总线/dB。 |
| 10 | [Honey Line](https://playgama.com/game/honey-line) | 可玩网页解谜（Playgama，开发者 Bishoj；2026-10 发布、2026-11 更新）；商店页无音频细节。作者声称的程序化音乐数据（Cmaj7-Am7-Fmaj7-G6、92 BPM、172 KB）不在所链页面，属未核线索 | P● D○（未核） S◐ R◐ A○（未核） L○ T1○ T2○ | 作者原文/开发日志未找到，音乐数字未核；AI 披露未在所读页面出现；无 SFX 分层/duck。 |
| 11 | [Reverse Lo-fi Anime Girl](https://qosmo.jp/en/news/reverse-lo-fi-anime-girl-ai)（可玩 <https://reverse-lofi.qosmo.jp/>） | 可玩浏览器小游戏，用 Magenta Realtime API 实时生成音乐，并用音乐情感估计驱动 Sleep/Doze/Study/Vibe/Dance 五种状态；作者页给出概念、技术、声音设计分工 | P● D● S○ R○（未核） A◐ L○ T1○ T2◐ | A◐；L○；S○；R 未核；状态切换非分层混音。 |
| 12 | [视界之外](https://www.gcores.com/talks/1240529)（游戏页 <https://www.gcores.com/games/179752>） | Godot 解谜平台；代码由 GPT5.5 受监督生成，5 首音乐全 Suno、少量音效 Suno、其余 Kenney/freesound；作者写明“设计了音频系统，可以对接剧情导演系统”，游戏页披露 AI 创作并给 DEMO 下载 | P● D● S○ R○（未核） A● L◐ T1◐ T2◐ | 第三方素材许可需逐项核；S○；R 未核；无 duck 参数。 |
| 13 | [Polymatrix](https://diaryofamadchaos.com/2026/07/polymatrix-developer-diary-music-that-follows-your-fingers-and-the-first-apk-july-11-2026/) | 2026-07-11 日志：v9 用 Fable 5 生成约 16 小节的可触发叠加层、以滴答主干为节拍基准；Claude Opus 4.8 生成 Capacitor APK；Google Play 可玩 | P● D● S○ R◐ A● L○ T1○ T2◐ | 只有日志日期（2026-07-11）；L○；S○；有叠加层/时钟无总线/dB。 |
| 14 | [Thing on a Spring (C64) Tribute](https://www.youtube.com/watch?v=QiOnPawr_do) | Tee Jay／GPT 6 Astra；作者描述用“排队式复音合成器”让多个事件重叠、工厂环境声与火箭引擎各成一层，并给出 −16 LUFS／−1.5 dBFS 真峰的成品测量；2026-10-11 发布，完整实机录像 | P◐ D● S○ R◐ A● L○ T1◐ T2◐ | 作者称完整实机、本单元未观看；无可玩下载；L○；S○；有层与响度无总线/dB。 |
| 15 | [Alley Cat: After Dark](https://www.youtube.com/watch?v=8mDmk1FwLJE) | 同作者；明确写“音乐与音效各走独立总线、音量互不影响”“按房间切换编曲（水族箱更空、奶酪房用跳跃拨弦）”“立体声跟随玩家”；2026-10-01 发布 | P◐ D● S○ R◐ A● L○ T1● T2● | 作者称完整实机、本单元未观看；无可玩下载；L○；S○。 |
| 16 | [NEON RIFT](https://www.youtube.com/watch?v=YmWy6Hxd15c) | 同作者；100% 程序化 C++/GLSL 原型，音乐与音效全部代码合成、按区域配置不同气氛 | P◐ D● S○ R○（未核） A● L○ T1◐ T2◐ | 作者称完整实机、本单元未观看；L○；S○；R 未核。 |
| 17 | [爆款之后](https://www.taptap.cn/app/954631)（日志 <https://www.taptap.cn/moment/858388841101265959>） | 商店页写明美术全程 AI、音效为程序化 PCM 且不引入音频文件；日志 04 记录 AI 声称已用 Lua 合成 PCM 并经引擎混音器播放，实际工程没有 Sfx 模块和播放调用、试玩无声，随后定下“必须报调用点行号”的验收规则；是“事件映射是否真接上”的反例 | P● D● S○ R○（未核） A◐ L○ T1○ T2○ | A◐；L○；S○；R 未核；没有真正的混音层。 |
| 18 | [上帝的球](https://www.taptap.cn/app/973799)（日志 <https://www.taptap.cn/moment/859284862773756003>） | 含 AI 合成内容；Web 技术栈：BGM 走 `<audio>`＋`MediaElementSource` 流式、音效用 `decodeAudioData` 常驻 `BufferSource` 两条路分开，`GainNode` 0.8 秒淡入、设置 0.08 秒跟随；点击音 6 选 1 轮抽洗牌；处理首次手势解锁、label 双触发、切后台 suspend；作者明确说声音只在桌面验证、移动端待复验 | P● D● S○ R○（未核） A◐ L○ T1◐ T2◐ | A◐；L○；S○；R 未核；有两条播放路径无 duck/抢占。 |
| 19 | [智能涌现](https://www.taptap.cn/app/957390)（日志 <https://www.taptap.cn/moment/861468238901411988>） | 商店页明示音乐、音效、台词配音均由 AI 工具生成；日志 06 记录 43 句 TTS 台词、4 首场景曲（标题/档案馆/代码深渊/Boss）以及模型缺失自动退回程序体；可作“AI 音乐＋配音多轨供给”的试玩对象 | P● D● S○ R○（未核） A◐ L○ T1○ T2○ | L○；S○；R 未核；没有总线/抢占/duck；与 §3.2 的 app/959589 不是同一作品。 |
| 20 | [五音游光](https://www.bilibili.com/video/BV1Aexu6wEH6) | 作者称用 AI 做五声音阶音乐游戏，音符落点/音名辨认直接驱动声音；评论区给出可玩 Toy 链接（页面内），并有玩家“落点与按键位置不一致、只能背谱”的实测反对意见 | P◐ D◐ S○ R○（未核） A◐ L○ T1○ T2◐ | Toy 链接在页面内、未独立复核；S○；R 未核；声音即玩法，无混音层。 |
| 21 | [节奏术力口2.2 万圣特辑](https://www.bilibili.com/video/BV1Jyxw63Eri) | B 站 AI 创造公开赛的在线音游（页面内 Toy 链接），曲目是第三方 Vocaloid 作品且逐位列谱师；可作为“第三方音乐许可/署名”与“游戏内音频事件”分开处理的对照 | P◐ D○ S○ R○（未核） A◐ L○ T1○ T2○ | 无开发日志；第三方曲目许可需逐曲核；S○；R 未核。 |
| 22 | [Earfh](https://ironwright.dev/devlog/earfh-the-music-as-a-clock) | 已上线开发中的实际作品：11 首 Suno 曲目＋Python/librosa 生成 JSON 节拍图，`BeatClock` 做输出延迟补偿和半拍吸附；AI 明确用于 Claude Code 测试与本地 Qwen 实现 | P◐ D● S○ R○（未核） A● L○ T1○ T2◐ | 开发中、是否有公开可玩未核；L○；S○；线性曲目非 stem 分层。 |
| 23 | [YAR: Navala Siege](https://github.com/dusy4/vibejam2026) | 可玩的 3D 动作 RPG，仓库自述约 95%+ 由 AI 生成（模型/贴图/动画/声音），音效与音乐用 ElevenLabs；非商用免费、商用需授权 | P● D◐ S○ R○（未核） A● L◐ T1○ T2○ | README 自述；非商用/商用分开但无逐资产条款；S○；R 未核。 |
| 24 | [GenAI-SnakeGame](https://github.com/JamShou/GenAI-SnakeGame) | 自述代码、画面、音乐全部由 Cursor＋Claude Sonnet 4.5＋Suno 生成，背景曲与结束曲以 mp3 随仓库发布并可下载 exe；作品很小，但 AI 音乐进入完整游戏回路的分工写得最直白 | P● D◐ S○ R○（未核） A● L○ T1○ T2○ | README 自述；L○；S○；R 未核。 |
| 25 | [TIDELINE](https://github.com/bridge-mind/tideline) | 可玩的浏览器 3D 钓鱼游戏；README 明写 MIT，全部环境声和音效在运行时用 Web Audio 程序合成、无外部音频资产 | P● D◐ S○ R○（未核） A○（未核） L● T1◐ T2○ | A 未在所读 README 披露；S○；R 未核；无并发/duck 参数。 |
| 26 | [Dead Signal: Exclusion Zone](https://github.com/bridge-mind/claude-opus-5.5-zombies-game) | Claude Opus 5.5 生成的浏览器 FPS，`audio/` 为程序合成 WebAudio 引擎且无第三方声音文件，适合核对射击、僵尸等高频事件的混音与并发 | P● D◐ S○ R○（未核） A◐ L◐ T1◐ T2○ | README 未给并发/duck 参数；S○；R 未核。 |
| 27 | [Apex Formula](https://bridge-mind.github.io/apex-formula/) | 同 Claude Fable 5.1 多子代理团队的 F1 网页游戏；README 明确列出分层引擎声（turbo、wastegate、limiter cut、ERS 啸叫、换挡、轮胎、路肩、风噪、空间化 AI 引擎、车队无线电）全部 Web Audio 合成，另有 `ARCHITECTURE.md` 写模块契约 | P● D◐ S○ R○（未核） A◐ L◐ T1● T2◐ | README/ARCHITECTURE 自述；S○；R 未核；无 dB/voice cap。 |
| 28 | [Turbo Kart Rally](https://bridge-mind.github.io/turbo-kart-rally/) | 同团队另一款卡丁车（单文件 `audio.js`），每车引擎合成加菜单/比赛/最后一圈分轨的序列音乐；**与 #32 Turbo Kart Rush 是两个不同作品/仓库** | P● D◐ S○ R○（未核） A◐ L◐ T1◐ T2◐ | 单文件 audio.js；S○；R 未核；无 dB/voice cap。 |
| 29 | [Bridge Horror House](https://github.com/bridge-mind/bridge-horror-house) | 同团队恐怖屋作品，`AudioEngine`＋`ScareDirector` 用 Web Audio 合成 drone、雨、雷、耳语、心跳、追逐音乐与尖叫，展示环境层与追逐音乐随状态切换 | P● D◐ S○ R○（未核） A◐ L◐ T1● T2◐ | S○；R 未核；无 dB/voice cap。 |
| 30 | [Meridian](https://github.com/blakelapierre/meridian) | MIT 浏览器 P2P 世界；固定提交 `b827f865` 的 `docs/work/audio.md` 与 `src/audio/{cues,play,ambient}.js` 公开：9 类事件 cue、8 类带昼夜与天气门控的环境声、随机间隔和变体、HRTF/StereoPanner、80 m 枪声截止、安静客户端静音且明确没有音乐床；demo 在 GitHub Pages | P● D● S○ R◐ A◐ L● T1● T2◐ | 固定 commit 无日期；S○；无音乐层/duck。 |
| 31 | [听向力！](https://www.gcores.com/games/179656) | BOOOM 2026 的浏览器可玩听音问答游戏：角色随鼠标 360 度转身，靠辨别来自四面八方的声音答题，页面明示代码、美术、音乐、音效均含 AI 生成，并带内置声音关卡编辑器 | P● D○ S◐ R○（未核） A● L○ T1● T2○ | 未找到开发日志；无源码/许可；S 只有页面封面；R 未核。 |
| 32 | [Turbo Kart Rush](https://bridge-mind.github.io/turbo-kart-rush/)（仓库 <https://github.com/bridge-mind/turbo-kart-rush>） | 可玩 Three.js 卡丁车；README 给出完整提示词与五个 Fable 5.1 子代理的五路分工；每车引擎合成＋菜单/比赛/最后一圈/结算的程序化 chiptune；MIT、无音频资产文件；作者截图在 README 内嵌 | P● D● S◐ R◐ A● L● T1◐ T2○ | S 只在 README 内嵌；无发布日期（package.json 1.0.0）；无 duck/voice cap 文档；与 #28 rally 不是同一作品。 |

### 3.4 过程线索与对照（不计候选，不凑数）

| 项 | 链接 | 为什么不计候选 |
|---|---|---|
| 石阵与智慧 | <https://www.taptap.cn/app/979919>；日志 <https://www.taptap.cn/moment/860310278879839553> | **非 AI 对照**（3 人团队、无 AI 披露）。机制很强：3D 定位、同帧同名去重、音效池化、按攻击者/受击者身份分流音色、日常/战斗/战后 BGM 序列、双源交叉渐变环境音；留作“人工方案基线”，不是 AI 作品。 |
| 深渊寻金 | <https://www.taptap.cn/app/974739>；日志 <https://www.taptap.cn/moment/859307993861193769> | **非 AI 对照**（学生团队）。52 个音效/4 首 BGM 收进一张 JSON（31 音效、10 事件、3 音乐轨），Master/Music/SFX 三总线、BGM 默认低 6 dB、同音效 0.1 秒限流用挂钟而非 delta（防 `Engine.time_scale` 倍速缩短窗口）；是“改音效不改事件”的参照。 |
| 远行：危机涌现 | <https://www.taptap.cn/moment/867044447626463419> | **非 AI 对照**：作者明写所有素材均为手搓、未使用 AI；可作为手工供给的基线。 |
| 第五个声音 | <https://www.taptap.cn/moment/857713695109680124>；可玩 <https://www.taptap.cn/app/973528> | 音频专业团队用 TapTap 制造做声音核心玩法：声音有世界坐标、海螺 3 槽记录、可改音量/音高/长短并打标签回放触发事件；但日志交代 AI 只补 2D 转面、Demo 声音仅 1–2 天且未接 Wwise，**AI 参与很弱，更像人工音频团队作品**；只作“声音作为世界实体”的对照。 |
| 暗流 | <https://www.taptap.cn/app/963966>；日志 <https://www.taptap.cn/moment/861917394619073179> | 用 11lab（ElevenLabs）做自创语言配音、程序打通 FMOD 随机触发（木筏嘎吱 5 个版本按时间顺序随机、雷声 2 随机）、因对话密集刻意压低 BGM；但 **AI 只用于配音，游戏本体非 AI 制作**；只作环境/语音层让位的对照。 |
| 呓语小镇 | <https://store.steampowered.com/app/2589500/> | **非 AI 游戏**（已上线商业游戏），音频管线据转述有 AI 参与。**未核线索：只链 Steam 商店页，未取得作者原文/开发日志/演讲链接，Steam 页无 Wwise/米里/Reaper 字样。** 据转述，米里用“拿起/放下/使用”通用事件加 SwitchGroup/SwitchValue 两级标签把上千个 Wwise Event 压到两个、覆盖约九成家具交互，文件名承载层级/容器/Switch 信息并用脚本自动建组赋值与更新 SoundBank；AI 半天生成 Wwise 导入脚本、再写 Reaper Lua 串一键渲染导入。总线与 ducking 未展开，代码/音频不开放。作为“人工设计 + AI 辅助接线”的未核对照，具体数字与脚本细节不当作已核机制。 |
| Venture | <https://github.com/opd-ai/venture> | 程序化 RPG，`pkg/audio/music` 有 adaptive soundtrack、motif 与按上下文交叉淡化；MIT、源码可读，但不是 AI 制作作品。 |
| DCSS Remastered Audio | <https://github.com/oLdpZ/dcss-remastered> | 给已编译的 Dungeon Crawl Stone Soup 加 zone 音乐交叉淡化、HP ducking 和重叠 SFX；用日志规则映射事件、Lua 状态钩子触发 duck/unduck；是事件映射与抢占的实作证据，非 AI 制作。 |
| Strataris | <https://github.com/PerpetualBeta/Strataris> | 已发布游戏，README 说明所有音乐/音效由自写合成器生成（方波/锯齿/三角/噪声/Karplus-Strong、包络、过载、限幅），无任何音频文件；非 AI 声明，作为程序化供给参考。 |
| Buzzness Tycoon | <https://github.com/krymancer/buzzness-tycoon> | Zig＋raylib 的已发售休闲游戏，音乐盒循环与五声音阶交付提示音全部启动时程序化合成、无采样资产；非 AI 声明。 |
| Koira | <https://dont-nod.com/en/games/koira/> | Don't Nod 的商业 Godot 游戏，被 `fmod-gdextension` 官方 README 列为实际采用者；作为 Godot 内 FMOD 事件/混音达到发行质量的参照，非 AI 作品。 |
| 猫猫守梦队 | <https://www.bilibili.com/video/BV1N8MF6wEnW> | 进度视频只展示“音乐音效配置工具”与猫咪动画、数值配置工具并列，**没有公开可玩链接**；只作“音频资产如何配置进事件”的过程线索。 |
| 放置归墟：梦回华夏 | <https://www.bilibili.com/video/BV1eup36jEGh/> | 作者开发日志写到地图/Boss BGM（人类作曲家乌鸦Producer）、出手与命中音效、游戏内音量；成品经 QQ 群分发，**公开试玩链接未给出**，不能算完整实机候选。 |
| 打飞机游戏开发日志第 9/11 集 | <https://www.bilibili.com/video/BV1Vgt2zgEeq/> | 连载开发日志，讲 Suno 生成关卡 BGM 并接入 FMOD；是过程线索，不是完整连续实机。 |
| 医学史诗 Saga of Medicine | <https://ld1.indienova.com/u/baytars/blogread/38768> | 日志讲 DNA Music 程序化 BGM 与 AI 辅助算法；游戏页只指向占位，**可玩性未核**，不列候选。 |
| 超级玛丽 / 山海逃亡（两款作品，合列一条） | <https://www.cnblogs.com/weipt0106/p/21306666> | 两款均可玩，作者自称用 AI 原生开发的方式做了这两款游戏，但**未披露 AI/人工分工、源码与许可**；按未核分工的 AI 对照处理，只作“事件→程序化合成音”的低成本参考，不算已核分工的 AI 作品。 |
| 城市声音台 | <https://www.bilibili.com/video/BV1YjxF6QEKf/> | 可玩的声音玩具：五种程序合成城市音色按网格分层、可独奏/改速/导出 WAV，附源码 ZIP；**不是有目标的游戏**，只作分层音序参考。 |
| Falling Block Jam 2025 | <https://github.com/carribasa/FallingBlockJam2025> | 节奏游戏与原创 OST 同步并用 FMOD；**AI 参与未披露**，只作“音乐时钟驱动事件”的机制参考。 |
| Unity + Wwise Fantasy Audio Demo | <https://github.com/aj-kivimaki/unity-wwise-fantasy-audio-demo> | Unity＋Wwise 交互音频作品集，**演示场景不是完整游戏**；作商业中间件的分层/混音对照。 |
| Adaptive Game Music (MSc prototype) | <https://github.com/inovamenz-code/adaptive-game-music> | Unity＋Python 研究原型，附完整硕士论文；**不是完整游戏**，只作“玩法状态→音乐参数”的定义/验证参考。 |

### 3.5 重复页与排除

**同一作品的过程页/游戏页重复（不重复计数）：** Claude of Tanks 站点＋`docs/AUDIO.md`；World of ClaudeCraft 站点＋`docs/design/sound_effects.md`；divisi 仓库＋Godot Asset Store；Reverse Lo-fi 新闻页＋可玩页；第五个声音日志＋`app/973528`；刀光剑影日志＋`app/966587`；石阵与智慧日志＋`app/979919`；深渊寻金日志＋`app/974739`；智能涌现 `app/957390`＋日志；AI训练模拟器 `app/959589`＋日志。**Turbo Kart Rally 与 Turbo Kart Rush 是同一团队的两个不同作品（不同仓库、不同站点、不同实现），不合并计数。**

**排除（有链接也不收）：**

- **只有教程/方法，没有实际游戏：** [AI游戏开发实战第11课：音效与音乐](https://www.bilibili.com/video/BV1fsxY6sExz)、[我如何用AI生成游戏音效](https://www.bilibili.com/video/BV1sqnZ6dEMN)、[jampitt 的 AI 游戏创作工具 Hub](https://www.bilibili.com/video/BV169a161En4)、[塔猴《用 Criware + Suno 打造随战斗烈度“呼吸”的互动音乐系统》](https://www.tahou.com/article/192838823945015301)、[6yuwei 独立游戏音频全 AI 化实战](https://blog.6yuwei.com/zh-cn/2026/08/27/indie-game-ai-audio-workflow/)、[abagames 自动生成 BGM 与音效章](https://abagames.github.io/joys-of-small-game-development-en/procedural/sound.html)、[L4D2 Director 系统研究](https://github.com/zeljkovranjes/l4d2-director-system-research)、[RespawnStack AI 工具商用条款表](https://respawnstack.com/guides/ai-game-dev-tools-commercial-use-table)。这些留在 §5 作机制参考。
- **只有预告/宣传/静音实机或无法确认完整游玩回路：** 猫猫守梦队、放置归墟、打飞机日志、医学史诗、城市声音台已在 §3.4 单列，不计候选；Gydel 只有作者站入口、官网未公开管线，没有可核的实机或过程，未进 §3.4、不计候选；城市声音台是声音玩具而非有目标的游戏。
- **AI 参与不足以称“AI 做游戏”：** 第五个声音（AI 只补 2D 转面）、暗流（AI 只做配音，游戏本体非 AI）已在 §3.4 单列作对照，不进候选。
- **itch.io 渠道零候选：** 游戏页、作者页、tag/jam/devlog 均因 TLS/证书/空 HTML 读不到；没有把搜索摘要当候选。

---

## 4. 前六项横向对照

● 满足；◐ 部分；○ 缺/未知。

| 项 | P 可玩 | D 作者过程 | S 截图 | R 版本/日期 | A AI/人分工 | L 许可 | T1 三层 | T2 压低/抢占/保事件 |
|---|---|---|---|---|---|---|---|---|
| Claude of Tanks | ● | ● | ● | ◐（package.json 1.0.0；无发布日期） | ● | ● | ● | ● |
| World of ClaudeCraft | ● | ● | ● | ●（v0.45.7；release 2026-11-03） | ● | ● | ● | ● |
| Kart Royale | ● | ● | ● | ◐（1.0.0；无日期） | ● | ◐（MIT，但 package.json 写 ISC） | ◐ | ● |
| NOVA LANCER | ● | ● | ●（作者截图原链接） | ●（1.0.0；README 2026-09-24 公开） | ● | ●（MIT） | ◐ | ● |
| 茫室（Blindside） | ● | ● | ○ | ◐（2026-06-12） | ● | ○ | ◐ | ◐ |
| 小巫大祸 | ● | ● | ◐（日志内嵌实机截图） | ●（2026-10-19；页面当前版本 5） | ◐（分工引 2026-10-22 日志，比例未逐项核） | ○（平台不导出） | ○ | ○（配音存在、播放规则未核；无混音规则） |

**怎么读这张表：** World of ClaudeCraft 六项齐全（R 有 v0.45.7 与 2026-11-03 release）；Claude of Tanks **除发布日期外**没有硬缺口（R◐，版本 1.0.0）。所以排 1、2。第 3 位按证据完整度给 Kart Royale（P/D/S 齐、MIT、可玩、有作者复盘），它同样缺发布日期，并缺“重要提示”层。茫室（Blindside）是中文渠道 + Unity 管线的替换项，但 S 与 L 都是 ○。NOVA LANCER 的源码/成本证据更细，S 已补作者截图原链接，R 现为 ●（README 更新履历记 2026-09-24 公开）；按 §2 前六项门槛，它的 P/D/S/R/A/L 已全部 ●（仅 T1◐），是替补里字段最完整的一项；主推仍保持 3 个，因为主推按四问覆盖与可验证性排，不按字段计数——若 dot 更看重源码级 bus/duck 与完整成本口径，NOVA 是替换 Kart Royale 的首选。小巫大祸是“重要提示层”专项替补，不是综合替补；其日志06 与日志01／2026-10-22 分工日志可核，但配音播放规则在本单元未取得原链接，A 只记部分、T2 记 ○（未核）。

---

## 5. 可借机制与工具参考（不计作品候选）

工具/模型只作机制参考，不参与作品排序。下列是直接回答“三层接线、谁压低/抢占、改层保事件、许可”四问的高价值项；其余同类实现约 70 项未逐一列出（只存在于运行采集目录，不随本产物交付）。

### 5.1 运行时与混音层级

| 工具 | 链接 | 可借机制 |
|---|---|---|
| PulseScore | <https://github.com/SimulatedFlow/ue-plugin-PulseScore> | UE5.8 Quartz 分层音乐指挥：强度窗控制各 stem 音量、按小节量化切换 section、stinger 与自动 ducking；层保持播放但音量为 0 以免重启动延迟；源码可见，商用需购买许可。 |
| XJ Music | <https://github.com/xjmusic/xjmusic> | 自适应音乐引擎＋DAW 式工作站＋Unreal 插件；专利保护，项目预算低于 25 万美元可免费使用。 |
| divisi | <https://github.com/hyprtuna/divisi> | Godot 4.4+ MIT；从音频设备读 beat/bar 避免帧时钟漂移，0–1 intensity 按层曲线驱动增益，按拍/小节等功率 crossfade，stinger 可在下一拍触发并压低音乐，autoload 跨场景保留段落/强度/小节位置。 |
| Motif | <https://github.com/mcp-tool-shop-org/motif> | stems、scenes、intensity curves、trigger bindings 与 runtime pack 导出；MIT，不生成音乐。 |
| Amplitude Audio SDK | <https://github.com/SparkyStudios/AmplitudeAudioSDK> | Apache-2.0 beta：mixer buses、auto-ducking、channel priority、sound events、attenuation 数据驱动。 |
| Orpheus | <https://github.com/superirale/Orpheus> | C++ 的 FMOD/Wwise 风格引擎：JSON 事件、buses、snapshots、sidechain/ducking、voice stealing、stingers、beat-synced segments；未标许可证。 |
| barelymusician | <https://github.com/anokta/barelymusician> | C/C++ 实时音乐引擎，sample-accurate 时序，Godot GDExtension 与 Unity 插件。 |
| Kira | <https://github.com/tesselode/kira> | Apache-2.0 Rust 游戏音频库：mixer tracks、参数过渡与时钟；Bevy 侧有 `bevy_kira_audio`。 |
| Tone.js | <https://github.com/Tonejs/Tone.js> | MIT Web Audio 交互音乐框架；Transport 调度与合成成熟，ducking/总线层级/事件抢占需自建。 |
| Godot-Mixing-Desk | <https://github.com/kyzfrintin/Godot-Mixing-Desk> | Godot 3.3.x 完整音频方案，程序化音效与自适应音乐；674 star 但 2022 年后停更，Godot 4 不要直接用。 |
| Godot-AMP | <https://github.com/DatLycan/AMP> | Godot 4.x `AdaptiveMusicPlayer`/`AudioStemPlayer`，运行时增删 stem、改 BPM/拍号；MIT，仓库 2025-07-02 已归档。 |
| AdaptiSound | <https://github.com/MrWalkmanDev/AdaptiSound> | Godot 4.3 MIT 自适应音频管理器 v1.0；1.0 不支持 Web 导出。 |
| Northforge adaptive-music-godot | <https://github.com/Northforge-Interactive/adaptive-music-godot> | Godot 4 垂直分层＋小节量化段落切换；divisi 指出它在 `_process` 累加 delta 会漂移，值得实测。 |
| NSound | <https://github.com/nyxkn/godot-nsound> | 明确按 FMOD/Wwise/Elias Studio 3 的思路实现：Section 内纵向 Levels、横向 Transition、随机 MultiTrack 与 Stinger；评估 Godot 内置 `AudioStreamInteractive` 缺口的具体样本。 |
| PFA Engine | <https://github.com/pitchfoxaudio/pfa-engine-js> | MIT、零依赖 Web Audio：`sfx_first`/`music_first` 优先级、duck/unduck、按 bar 量化的节点跳转，与 Godot 版共用 PFA Studio 导出。 |
| Adaptive Music Engine (AME) | <https://github.com/Adaptive-Music-Engine/ame-core> | MIT Java：intensity 浮点驱动 stems 音量、context 平滑切换、priority stack 解决多个触发同时抢占。 |
| 16BarLogicGame | <https://github.com/yusufuca/16BarLogicGame> | Unity＋FMOD 的事件驱动量化自适应音乐 FSM，七种状态、按小节切换、优先级锁定。 |
| Adaptive Director for s&box | <https://github.com/zeljkovranjes/sbox-adaptive-director> | 把 L4D 式 Director 拆成确定性核心与自适应音乐模块，消费世界快照输出音乐包络。 |
| Gamestruments | <https://github.com/jfrader/gamestruments> | MIT Godot 4 addon：按 seed 生成多段音乐，游戏状态变化在下一小节切段；无音频文件、可离线。 |
| PDJE Godot Plugin | <https://github.com/Rliop913/PDJE-Godot-Plugin> | Godot 多轨 DJ/节奏游戏音频引擎，自己做多轨混音与变速并接管引擎音频路径；divisi 把它列为“替换而非补充”的反例。 |
| RedFish | <https://github.com/z-e-chan/RedFish> | C++ 实时音频引擎，交互音乐的分层混音与按音乐同步过渡，mix group、输出路由和 send。 |
| seslen | <https://github.com/productdevbook/seslen> | 零依赖 Web Audio：bus、ducking、复音上限、节流、淡入淡出、`OfflineAudioContext` 导出。 |
| @argila/audio | <https://www.npmjs.com/package/@argila/audio> | Web Audio 自适应音乐层：`Mixer` 的 master/music/sfx 总线、`MusicClock` 按 BPM/拍/小节调度、`Music` 支持 sections 水平重排＋layers 垂直叠层＋params＋节拍 stinger；公开仓库尚未找到。 |
| tono-core | <https://crates.io/crates/tono-core> | Rust 无头引擎的 adaptive 模块：`LoopBuffer` 按 intensity 阈值叠层、`stinger_stereo` 打点、`Quantize` 按拍/小节量化；确定性渲染便于测试。 |
| Plainsong / .track | <https://p11c.xyz/music/> | 纯文本 `.track`：节奏/音色/层/音符逐行可读写，游戏运行时同一 parser 播放并支持层与参数自适应；Trackyard CC0，源码在 GitLab。 |
| Wwise 官方 MCP | <https://www.audiokinetic.com/en/public-library/2026.1.3_9276/?source=Help&id=wwise_mcp> | Wwise 2026.1.3 Beta 3 起内置 MCP：Claude Code、Codex CLI、Cline 通过本地 8099 端口调 WAAPI 与沙箱 Lua，在真实工程批量整理/重命名容器、查询总线。 |
| Wwise Gyms | <https://github.com/audiokinetic/Gyms> | Audiokinetic 官方 Wwise Unreal/Unity 样例与测试工程，可直接对照 Event/State/Switch/RTPC 与总线的组织方式。 |
| Godot AudioStreamInteractive | <https://docs.godotengine.org/en/stable/classes/class_audiostreaminteractive.html> | Godot 原生交互音乐资源：clip 转移表实现下一拍/下一小节切换、交叉淡化、filler clip 与自动推进；评估任何 Godot 分层音乐案例的官方基线。 |
| Unity 6.3 Scriptable Audio Pipeline | <https://docs.unity.com/en-us/engine/6000.3/manual/audio/scriptable-processors> | Unity 6.3 新增 Scriptable Audio：Burst 兼容 HPC# 写 generator/root output，在 AudioSource 生成与最终混音阶段插入处理；官方明确“not supported on the Web Platform”，直接决定浏览器作品能否采用。 |
| GS_Audio / GS_Play | <https://gsplay.genomestudios.ca/products/gs_audio/> | O3DE 音频系统参考：按名字触发的事件（变化、距离衰减、并发上限、跟随实体）、Music/SFX/Voice/Ambience 命名音量通道、22 条 DSP 链、Audio Pro 版才有可视化节点图与自适应分层音乐。 |
| FMOD GDExtension | <https://github.com/utopia-rise/fmod-gdextension> | Godot 4 的 FMOD GDExtension，README 列出商业游戏 Koira 已采用；无 C# 绑定。 |
| Wwise × Godot | <https://github.com/alessandrofama/wwise-godot-integration> | Audiokinetic 的 Godot 集成，把 Wwise 事件/总线接进 Godot，2026-11 仍活跃。 |
| TRAudio | <https://github.com/RodZill4/TRAudio> | 把声音按分类树集中声明音量/变调/总线/衰减，开发者按层级名播放；作者说明它就是 Wwise/FMOD 不可用时（如要 Web 导出的 game jam）的替代。 |
| OAML / OAML Godot Module | <https://github.com/oamldev/oaml>；<https://github.com/oamldev/oamlGodotModule> | MIT 自适应音乐库：intro/main/conditional loops 组织条件触发，Unity 与 Godot 模块；项目较老，需核版本。 |
| Maaack's Music Controller | <https://github.com/Maaack/Godot-Music-Controller> | 轻量 Godot 音乐控制器，只做轨道交叉淡入与场景保持；可当“最小可接受基线”。 |
| Pocket Chordsmith | <https://github.com/Samfa12-tech/Pocket-Chordsmith> | 谱面驱动的自适应音乐工具（beat/bar/section/stinger 与自适应状态回调齐全），但依赖自家 web app/Pocket DAW 的谱面，不能直接吃自有 stems。 |
| RhythmNotifier | <https://github.com/michaelgundlach/rhythm_notifier> | Godot 节拍信号插件，做延迟补偿但只有 beat 信号；可作为“音乐时钟/事件对齐”最小层。 |
| godot-procedural-synth | <https://github.com/YuriiBishchuk/godot-procedural-synth> | Godot 4 实时程序化音频/音乐合成引擎，含动态自适应编排与音效生成。 |
| AdaptiveMusicUsingGraph | <https://github.com/OzelotVanilla/AdaptiveMusicUsingGraph> | 用图节点编排自适应音乐的 Godot 插件，与 inspector 资源式分层不同的作者工作流。 |
| Maestro / Maestro Player / MIDI to Maestro Cues | <https://github.com/caseywescott/Maestro>；<https://github.com/caseywescott/Maestro-Player>；<https://github.com/caseywescott/Midi-2-Maestro-Cues> | MIT、受 LucasArts iMUSE 启发的 TypeScript 库：bar 同步过渡、独立层音量淡入淡出、tempo/key 匹配；另有 React 运行时示例与 MIDI→iMUSE cue 工具。 |
| tono | <https://github.com/marmikshah/tono> | 用 JSON `SoundDoc` 描述音效、乐器与自适应游戏音乐，同一配方跨平台渲染字节一致，可在 CI 验证事件/混音结果。 |
| Brusverk | <https://github.com/joakimeriksson/brusverk> | Rust 写的 Godot 4 GDExtension，所有声音按游戏状态实时合成（脚步随表面、引擎随转速、含自适应丛林音乐），有浏览器 lab 与 Godot API 文档。 |
| Project DJ Engine | <https://github.com/Rliop913/Project-DJ-Engine> | PDJE 作者的节奏游戏引擎加 DJ，使用 miniaudio、SoundTouch、Faust 与 beat_this，覆盖节拍检测、实时播放和 DJ 混音。 |
| 16bits-audio-mcp | <https://github.com/Matuyuhi/16bits-audio-mcp> | Zig 零依赖 MCP，按 seed 确定性生成 16-bit PCM 的 loop BGM、SFX、jingle，FM 合成＋Schroeder 混响＋多轨混音。 |
| retro-music-toolkit | <https://github.com/narrastory/retro-music-toolkit> | 面向 AI agent 的确定性 8/16-bit 音乐工作站，JSON 乐谱离线渲染、带和声与循环缝诊断，无模型无 API。 |
| LoopSmith procedural | <https://github.com/GameDev-Toolkit/loopsmith-procedural-game-music-generator> | 浏览器内种子化 36 步循环生成，可导出 WAV、JSON、Godot `AudioStreamGenerator` 常量与 agent 交接说明，Apache-2.0，带 2,000 首确定性测试。 |
| short-VGM-generator | <https://github.com/abagames/short-VGM-generator> | 用 magenta.js/MusicRNN 续写短循环游戏 BGM 的可玩 demo（MIT），作者在书里对比 WolframTones、Jukebox、MusicLM 在复古游戏音乐上的边界。 |

### 5.2 MCP／编辑器接线与 QC

| 工具 | 链接 | 可借机制 |
|---|---|---|
| Audio Studio MCP | <https://github.com/kanaworksai-hue/audio-studio-mcp> | 本地 Stable Audio 3 的 MCP：生成 BGM/SFX、做无缝循环、LUFS 归一、导出 48k WAV/OGG/FLAC 并可给 Godot；代码 MIT，模型权重按上游条款。 |
| Soundbox | <https://github.com/HamSanders/soundbox> | MIT 本地音频工作站与 ElevenLabs/Suno 开源替代：24 个 MCP 工具、多轨时间线、stems、按模型显示许可。 |
| Wwise-MCP (BilkentAudio) | <https://github.com/BilkentAudio/Wwise-MCP> | Apache-2.0 实验性 Wwise MCP，通过 WAAPI 让 LLM 编排多步 Wwise 工作流；Wwise 2024.1+，作者明确不宜用于生产项目。 |
| wwise-mcp (linnn-nb) | <https://github.com/linnn-nb/wwise-mcp> | MIT、20 工具的 Wwise MCP：审计、批量建 event、路由 bus、加 SoundBank、查断引用；Wwise 2021.1+。 |
| WilliamWAudio/wwise-mcp-server | <https://github.com/WilliamWAudio/wwise-mcp-server> | 45 个工具的 Wwise MCP：按名替换源、批量改名/搬移、按相对路径同步 Output Bus、WAQL 检查与 Profiler，带简体中文文档。 |
| Wwise Agent (tsuYu-pro) | <https://github.com/tsuYu-pro/Wwise_Agent> | 30 个工具覆盖 Event、Bus 路由、RTPC 绑定与 Effect 批处理，还带 Plan 只读模式和 MCP Server；比较“代理自主改总线”与“逐工具调用”。 |
| mcp_wwise (john-tennant-sjs) | <https://github.com/john-tennant-sjs/mcp_wwise> | 46 个 WAAPI 工具、preflight/read-back 校验；作者署名参与过 Returnal/Gears 等 3A 项目，实测 Wwise 2023.1.17 与 2025.1.3。 |
| sk-wwise-mcp (silver-rain-dev) | <https://github.com/silver-rain-dev/sk-wwise-mcp> | 12 个按角色挂载的服务/97 工具，分 listen/author/build/qa/admin，刻意排除 `ak.soundengine.*` 运行时调用；Apache-2.0。 |
| dcc-mcp-wwise | <https://github.com/dcc-mcp/dcc-mcp-wwise> | 把 Wwise 的 Switch/State、RTPC、Event、Random/Sequence Container、Bank 对账做成类型化工具。 |
| WwiseMCP_toseVer | <https://github.com/HuxxxTOSE/WwiseMCP_toseVer> | 中文作者在开源 WwiseMCP 基础上重写扩到约 120 个 WAAPI 操作，README 直言“熟练设计师手点更快”，并给出 agent 适合的查询/试改/验证闭环。 |
| FMOD Studio MCP (EYamanS) | <https://github.com/EYamanS/fmod-studio-mcp> | Alpha 的 FMOD Studio MCP，经 Studio 脚本终端（TCP 3663）实时改工程，约 148 个按 API 生成的工具；需开启 Script Server，改动要纳入版本控制。 |
| Dans_Fmod_Studio_MCP | <https://github.com/xDarkzx/Dans_Fmod_Studio_MCP> | 通过 FMOD Studio 内置 JS 脚本端口控制 FMOD，创建事件、导入音频、建参数、路由 mixer bus、分配 bank 并构建工程。 |
| fmod-mcp (Magedeline) | <https://github.com/Magedeline/fmod-mcp> | 与“连运行中 Studio 的脚本终端”相反，直接改工程 XML（含 `bus:/` 路径、snapshot、parameter、GUID 重建与 live reload）。 |
| Reaper Daemon | <https://github.com/wretcher207/reaper-daemon> | REAPER 的本地 MCP/文件桥：让 Agent 读改工程、混音、以 undo block 回退并用 `verify_change` 复验。 |
| reaper-mcp (fadelabs / TwelveTake) | <https://github.com/fadelabs/reaper-mcp>；<https://github.com/TwelveTake-Studios/reaper-mcp> | 内置 `setup_sidechain_compression`、`create_bus`、`add_parallel_compression` 这类一次调用完成多步总线/侧链接线的助手；上游 180 个工具含 mastering chain。 |
| reaper-mcp (bonfire-systems) | <https://github.com/bonfire-systems/reaper-mcp> | 61 个工具的 REAPER MCP，覆盖轨道、模板、MIDI、FX、混音、母带、渲染与音频分析。 |
| Ableton MCP | <https://github.com/ahujasid/ableton-mcp> | 直接操作 Live 的 session/arrangement 与轨道，补“MIDI 与 DAW 侧混音自动化”。 |
| flstudio-mcp | <https://github.com/rosasynthesiz/flstudio-mcp> | MIT beta，直接驱动 FL Studio 2025 的 mixer、插件、路由与钢琴卷帘，做 gain staging、EQ/压缩、参考匹配和混音诊断。 |
| UE-AUDIO-MCP | <https://github.com/koshimazaki/UE-AUDIO-MCP> | UE5 的 MCP 工具包：从自然语言生成 MetaSounds DSP 图并给出 Blueprint 触发接线，同时带 Wwise/Blueprint 知识与 81 个工具。 |
| Phantom | <https://github.com/fadelabs/phantom> | 测响度/相位/频谱、比较 stem 间 masking 并给修正建议，附 Claude 技能；macOS/Linux（Windows 不支持）。 |
| Post Mortem | <https://github.com/wretcher207/post-mortem> | 读选中轨的 FX/推子/声像并实测一小段，给出“最可能的问题＋一个安全修复”的预览；明确写“证据不足必须说不足、单轨不能证明他轨掩蔽”。 |
| audio-mcp / audio-mcp-assets | <https://github.com/mshark1/audio-mcp>；<https://github.com/mshark1/audio-mcp-assets> | 把声音转成 LLM 能推理的测量、事件时间线、问题清单和前后差分；配套 26 个 CC0 校准信号与独立 numpy/scipy/pyloudnorm 复核。 |
| mixdown | <https://github.com/ehm-93/audio-mcp> | 把音效存成确定性合成 recipe（JSON），渲染后返回测量值/频谱图/缺陷 lint、生成变体族和试听页。 |
| cochlea | <https://github.com/richer-richard/cochlea> | MIT/Apache 的 Rust 引擎：谱写成数据、离线渲染确定性 PCM，再输出响度/起音/音高/调性/频谱供 agent 断言，形成 compose→render→probe→verify 闭环。 |
| Bellows | <https://github.com/tom-swift-tech/bellows> | 面向游戏仓库的本地 SFX 流水线：TOML 清单、Stable Audio 3 多次生成、LUFS/真峰值归一、CLAP 排序、人工试听批准后导出，保留可复现 recipe。 |
| Agent Audio | <https://github.com/AIEGOBOT/agent-audio> | 给编码代理的本地音频生成 MCP＋Agent Skill，安装 Stable Audio 3 Medium 后可顺手生成音效与音乐。 |
| GameForge-MCP | <https://github.com/xDarkzx/GameForge-MCP> | Apache-2.0 的本地 Stable Audio 3 BGM MCP，作者明确承认只能做横向重排、没有同步分轨分层——是“生成音乐≠自适应音乐”的边界反例。 |
| soundraw-game-bgm | <https://github.com/yksanjo/soundraw-game-bgm> | MCP 服务用 DeepSeek 解析场景→Soundraw B2B V3 生成 BGM，`adaptive_layer_control` 静音指定 stem 返回多版本 URL 与运行时混音代码；需两把 API key。 |
| UE5-PMG | <https://github.com/subc0der/ue5-pmg> | UE5 插件，文本提示直接生成 SoundWave 并宣称实时适配/分轨，基于 MusicGen/ONNX、模型另下载；项目仅 2 次提交、无 demo。 |

### 5.3 生成供给（模型/服务）

| 模型/服务 | 链接 | 可借机制与限制 |
|---|---|---|
| Magenta RealTime 2 | <https://github.com/magenta/magenta-realtime> | 开放权重实时音乐模型（代码 Apache-2.0、权重 CC-BY-4.0），流式生成支持文本/MIDI 控制；实时流式需 Apple Silicon。 |
| Lyria RealTime | <https://ai.google.dev/gemini-api/docs/realtime-music-generation> | 实验性 WebSocket 实时音乐，48kHz stereo，`set_weighted_prompts` 连续改权重即时转向；官方未给游戏集成与硬延迟。 |
| Lyria 3.5 | <https://ai.google.dev/gemini-api/docs/music-generation> | `lyria-3-clip-preview` 固定 30 秒、`lyria-3.5` 数分钟整曲，44.1kHz 立体声、MP3 输出、SynthID 水印；44.1kHz MP3 与引擎 48kHz 管线不一致，需转码。 |
| MiniMax Music 3 | <https://github.com/MiniMax-AI/MiniMax-Music3> | 2026-08 开放权重的 5 分钟整曲模型（32kHz/16-bit），带 `music-caption-rewriter` skill 把 brief 展开成含 BPM/key/编曲段落的 Structured Caption；社区许可而非纯 MIT。 |
| ElevenLabs SFX v3 | <https://elevenlabs.io/blog/sound-effects-v3> | 2026-10-29 发布的音效模型，主打一个 prompt 内的多声音事件、音乐/人声更干净；API 需显式切到 v3，闭源商业服务。 |
| VARCO Sound | <https://sound.varco.ai/en> | NC AI 的生成式音频服务：多轨输出＋对话式 agent 做时间线编辑与整体平衡，官网列 Unity 插件、MCP 即将支持。 |
| Stable Audio 3 | <https://github.com/Stability-AI/stable-audio-3>；<https://stability.ai/stable-audio> | 3.0 模型族提供独立 `sfx` 检查点，被 DEMON 与 itch 上的 Handle 同时采用；权重在 Hugging Face 需接受许可，商用条款逐条核。 |
| ACE-Step 1.5 | <https://github.com/ace-step/ACE-Step-1.5> | 本地开源音乐生成模型（另有 Studio、ace-step-ui、acestep.cpp 等生态），可作 BGM 供给与二改来源；商用前按具体模型与权重许可核。 |
| Remiqora | <https://github.com/inikolax/remiqora> | 本地音乐工作站，统一 ACE-Step 1.5、YuE2-3B 与 Stable Audio 3，内置多轨 DAW、AI arranger 与 stem separation。 |
| ThinkSound | <https://github.com/FunAudioLLM/ThinkSound> | 阿里 FunAudioLLM 的视频转音效模型（NeurIPS 2025），可从实机/过场视频生成同步 SFX。 |
| MMAudio | <https://github.com/hkchengrex/MMAudio> | CVPR'25 的视频/文本→同步音效模型，代码 MIT、权重 CC-BY-NC，约 6GB 显存可跑。 |
| AudioX | <https://github.com/ZeyueT/AudioX> | ICLR 2026 的 anything-to-audio：文本＋音频/视频条件生成音效，权重与 IF-caps 数据集公开；正是 Ask HN 那条帖里“给参考音＋文字指令出另一个音”的空缺答案。 |
| DEMON | <https://github.com/daydreamlive/DEMON> | 实时可操控的生成式音乐引擎（arXiv 2605.28657，AGPL-3.0-or-later＋MIT）：统一流式协议＋客户端 SDK，实测旋钮到耳朵 14ms（ACE-Step 深度 1）/48ms（Stable Audio 3 SFX）。 |
| Daydream | <https://daydream.live> | 提供 agent 可调用的音乐 API/MCP，返回歌曲和分轨（stems），可按游戏强度取分层素材。 |
| Waves Illugen | <https://www.waves.com/illugen> | 商业文本生成音效工具，HN 讨论中被指出只能吃文本、不能给音频参考；纯文本音效路线的反面对照。 |

### 5.4 循环、格式、许可与中文方法

| 项 | 链接 | 可借机制 |
|---|---|---|
| Loopsmith | <https://www.austinhaynesmusic.com/loopsmith> | 作曲者 Austin Haynes 的 Windows 工具（1.18.0；1.16 于 2026-10-22 发布）：无缝循环/tail overlap、对齐分轨、场景与 bars 量化 crossfade，并能在已打开的 FMOD/Wwise 工程里就地建事件或音乐容器；$79 买断、Windows only。 |
| Musslop / musloop | <https://github.com/Siziff/musloop>；<https://github.com/Siziff/musslop> | 把任意成品曲做成可循环的游戏配乐：AI 段落检测＋Demucs 分出 drum/bass/vocal 强度层，按小节对齐、等功率 crossfade，导出 WAV＋`manifest.json`（循环点/乐句转场/scenes）并附 Godot 4 示例；MIT、38 star，作者自述自动边界只是起点。 |
| musloop-foundry | <https://github.com/Siziff/musloop-foundry> | musloop 作者的 Foundry VTT 模块，把 section loop、乐句边界和同步决策广播给多客户端，适合看分层音乐在多人、晚加入时如何保持一致。 |
| Seamless Loop Music Player | <https://github.com/CPUrising/seamless-loop-music> | 中文作者的 Windows 无缝循环播放/管理工具，用互相关与 loopfinder 做采样级 loop 对齐；MIT，适合 BGM 与环境循环供给。 |
| AutoLooper | <https://github.com/YoshimiKudo/AutoLooper> | 游戏音乐 loop marker 自动检测/编辑桌面工具（0.4.3 beta，Windows 与实验 macOS）；把循环点纳入资产交付与二改。 |
| PyMusicLooper | <https://github.com/arkrow/PyMusicLooper> | Seamless Loop Music Player 的 README 引用它做循环点检测；把“找 loop 边界”和“游戏内无缝播放/分层”分开核。 |
| Engine Sim Unity Audio | <https://github.com/Vangardo/engine-sim-unity-audio> | 把 Engine Simulator 预设离线烘成按 RPM/load 网格的无缝 loop bank 与 JSON，默认每引擎 21 条；MIT，对应连续引擎/车辆分层供给。 |
| engine-sim | <https://github.com/ange-yaghi/engine-sim> | 9.6k star 的内燃机仿真器，实时合成发动机声音，是 `engine-sim-unity-audio` 的上游供给端。 |
| SFX Kit | <https://github.com/wyzowl/sfx-kit> | 2026-10-19 发布的 320 个 48kHz/24-bit 音效，全部 CC0，每个都带 `use_for/avoid_for`、时长、sync 点、响度和 `under_voiceover_db`；把选音效/对准事件/对白下压低所需元数据直接交给 agent。 |
| Procedural Sounds | <https://github.com/m1ckc3s/procedural-sounds> | 浏览器内按 recipe 实时合成 UI 音效，可导出 WAV 或几行 JS，并用人工 curation 训练生成器；211 star、早期 beta。 |
| cuelume / sensory-ui / tiks / @web-kits/audio | <https://github.com/danielwh2/cuelume>；<https://github.com/shadcn-labs/sensory-ui>；<https://github.com/rexa-developer/tiks>；<https://github.com/raphaelsalaja/audio> | UI 音效的“按职责不按声音”映射：cuelume 14 个界面职责、sensory-ui 17 个语义角色＋9 音色包、tiks 约 3.5KB 共享合成引擎＋`hoverThrottleMs`、@web-kits/audio 约 11KB 声明式对象；事件 id 不变、换提示音不影响调用。 |
| Scrimshaw Jukebox | <https://simonwillison.net/2026/Oct/6/scrimshaw-jukebox/> | Simon Willison 2026-10-06 的实验：让 Claude Opus 5.5 设计纯文本乐谱格式并写播放器，产出 6 首可编辑的冒险游戏配乐；证明 LLM 能把作曲变成可 diff 的文本资产。 |
| Mowjera | <https://mowjera.com/blog/embed-adaptive-music-itchio> | 浏览器里的自适应游戏音乐 DAW，每个公开乐谱带 `/embed` 组件，可在 itch.io 页面点状态听转场；把分层/分段做成可试听的成品。 |
| RespawnStack AI 工具商用条款表 | <https://respawnstack.com/guides/ai-game-dev-tools-commercial-use-table> | 免费表：36 个 AI 工具逐条抄厂商原句＋日期，音频侧 Suno/ElevenLabs/AIVA/Soundful 等免费层是否可商用一目了然，可作第三方音频许可的起点。 |
| 6yuwei：独立游戏音频全 AI 化实战 | <https://blog.6yuwei.com/zh-cn/2026/08/27/indie-game-ai-audio-workflow/> | 2026-08-27 中文作者实战：Codex 读关卡生成结构化 Suno prompt、MOSS-SoundEffect-v2.0（Apache-2.0/48kHz）本地批量出短音效、候选池 JSON 记录 seed、500–1000ms crossfade 做无缝循环，再按 WAV/OGG/MP3 分流接引擎；含成本与许可边界。 |
| 塔猴《用 Criware + Suno 打造随战斗烈度“呼吸”的互动音乐系统》 | <https://www.tahou.com/article/192838823945015301> | 完整四层竖切管线：Suno 140 BPM 无缝循环 → Suno stems/UVR5 拆 4 轨 → Reaper 对齐 8/16 小节 → Criware AISAC `Battle_Intensity` 0–1 曲线＋Unity 驱动；文内没有绑定具体游戏，属方法候选。 |
| abagames 自动生成 BGM 与音效章 | <https://abagames.github.io/joys-of-small-game-development-en/procedural/sound.html> | Kenta Cho（ABA Games）成书章节：小游戏为何用 4–8 小节短句循环、如何程序化生成 BGM 与音效，并点评 WolframTones 的局限。 |
| L4D2 Director 系统研究 | <https://github.com/zeljkovranjes/l4d2-director-system-research> | 对 L4D2 Director 的强度、投放、特殊计时与自适应音乐恢复做可复现拆解，可作为“玩法强度→音乐/音效层”事件映射的逆向规格参考。 |

---

## 6. 覆盖缺口

1. **itch.io 为零。** 游戏页、作者页、tag/jam/games-like 列表、devlog 全部因 TLS 000／证书主机名不匹配／`Socket is closed`／空 HTML 读不到；没有从 itch 保留候选，也没有把搜索摘要当原帖。下一轮要换网络或镜像再补。
2. **Reddit 评论区不完整。** 直连与多数镜像被 TLS/Anubis 拦截，只有 Arctic Shift 归档；部分帖子评论为 0 或缺失，读不到投票上下文与折叠评论。因此“评论区里的替代品与反对意见”只在少数帖子上覆盖。
3. **中文原帖大量不可读。** 微信 D05、《如何用 AI 手搓一个游戏去赚钱？（游戏音效）》等只返回验证壳页；知乎 403；小红书需登录/“页面不见了”；今日头条正文 JS 渲染为空；linux.do Cloudflare/403；V2EX 超时。中文渠道最终靠 TapTap、机核、B 站、少数派、cnblogs、Gitee 的作者原文补足。
4. **YouTube/B 站没有画面级证据。** YouTube TLS 间歇 000，频道页/oEmbed 不可达；B 站 `view` API 多次 412，空间页/合集页只返回标题壳。所有视频类候选只据作者描述与简介，未看完整帧，也未听音。
5. **Hugging Face 模型卡未读。** huggingface.co 被网络策略拦截；ACE-Step、MOSS-SoundEffect、Stable Audio、MiniMax Music 等的许可与 related models 只能经 GitHub README／官方文档转述，采用前必须回原卡。
6. **Wwise/Audiokinetic 官方页部分 403。** Wwise 2026.1 新功能博客与部分 community 页被拦，只用 public-library 与微博转载同文；Wwise Adventure Game 等官方示例未逐项核。
7. **GitHub 元数据不全。** REST core API 未认证 60 次/小时用尽；没有 `gh` CLI；issue 页与 `issues.atom` 多为 JS/空 feed；star、更新时间只能从 Search API 与 HTML 间接判断。少数仓库 raw README 404，未能核默认分支与提交历史。
8. **搜索引擎不可用作广扫。** WebSearch 200/200 用尽；Bing 忽略 `site:`、返回词典类结果；Google/DuckDuckGo TLS 失败。发现主要靠 GitHub topic/search、站点 API 与已有种子链接，可能漏掉未收录进这些索引的 itch/个人博客线索。
9. **没有实机/试听/品质结论。** 本机只做命令行静态资料；没有启动游戏、没有听音、没有抓画面。所有“可玩/完整实机”是链接与作者材料层面的可达性，不是体验验收。

---

## 7. 交给 dot 的一个二改验证问题

**在现案例的一个战斗场景里，把“BGM 切层 + 最高优先级提示语音”同时触发，验证事件是否被保住。**

做法：

1. 战斗开始 1.5 秒内，把 BGM 从探索层交叉淡到战斗层；
2. 在淡化过程中触发一条最高优先级提示语音（如“发现敌人”）；
3. 记录四项：
  - 语音播放时，**环境/氛围床（beds）**是否按所引案例文档降 **10 dB**、**world 总线（武器／命中／环境／载具汇总）**是否降 **4 dB**（Claude of Tanks `docs/AUDIO.md` 的 beds 指 ambience，不是 BGM 音乐层；该文档没有 BGM/音乐层的 duck 数值。换其他案例则逐项对照其文档，不套统一区间）；若要验 BGM 音乐层，按 Kart Royale 的 music 1.25x 侧链或案例自己的文档，不要套 CoT 的 10 dB；
  - 语音结束后，BGM 是否从原播放位置继续（或按小节回到战斗层），而不是从头重播；
  - 语音资源缺失时，按**所引案例文档**处理：CoT 是缺失即静音并触发 selftest 失败、不得用替代声；其他案例若文档允许替代声，必须显式记录且不能静默换声；
  - 同帧多个命中/脚步是否按 cooldown/voice cap 丢弃低优先级，而不抢占语音。
4. 通过标准：四项都符合**所引案例文档的逐项数值**（CoT：beds −10 dB、world −4 dB；Kart：music 1.25x 侧链；其他案例按其文档值），且语音缺失行为逐案例对照文档、不套通用选项；失败标准：任一项只能靠停播/重播或静默替代。

> 注记：CoT 文档只规定 beds（ambience）−10 dB、world −4 dB，没有 BGM 音乐层的 duck 数值；评审时不要把“BGM 未降 10 dB”或“world 只压 4 dB”当成实现失败。

**对照材料：** Claude of Tanks 的 `docs/AUDIO.md`（beds（ambience）−10 dB、world −4 dB、HDR 窗口、32/16 声部预算、crew line 0–4 优先级＋冷却＋过期丢弃、asset pin/manifest）；Kart Royale 的 `src/audio/Audio.ts`（mini-turbo 时 music 让位 1.25x）作为最小侧链对照；Blindside 的 intro/loop/outro 拆环与战斗 BGM 抬高作为“保事件”的另一种做法。这个二改不需要先安装任何候选游戏，可在 dot 自己的现案例上做。

---

## 8. 检查与回执

- **链接复核（本单元，2026-11-04）：** 用 `curl -L -s -o /dev/null -w "%{http_code}"` 复核 13 个顶级入口与 4 张作者截图（共 17 个 URL），全部 200：`cot.kevinliu.studio`、`worldofclaudecraft.com`、`racing.ryancampbell.com`、`bridge-mind.github.io/turbo-kart-rush/`、`tanuu5.github.io/nova-lancer/`、`sspai.com/post/110972`、`gcores.com/games/179928`、`taptap.cn/moment/861046267839513388`、四个仓库页、`taptap.cn/app/981776`。四张作者截图原链接：<https://github.com/Kevin-Liu-01/Claude-of-Tanks/blob/main/public/media/site50-r14/stills/s07-lake-shellfire.webp>、<https://github.com/levy-street/world-of-claudecraft/blob/main/docs/screenshots/title-screen.jpg>、<https://github.com/ryancampbell/kart-royale/blob/main/docs/hero-drift.png>、<https://github.com/tanuu5/nova-lancer/blob/main/docs/screenshots/hero.jpg>（NOVA 本轮新增直链；此前只算 README 内嵌，回执与正文不符）。另复核 18 个 TapTap／B 站／Steam／Gcores 入口，均 200（B 站 200 不等于无 412 反爬，页面内容另受限）。**修订后新增复核：** 小巫大祸日志01 <https://www.taptap.cn/moment/859428574430497161> 返回 200，标题为“《小巫大祸》开发日志01：第一次，一个人做游戏”，页内可读到“目前由我一个人独立开发”；2026-10-22 分工日志 <https://www.taptap.cn/moment/862262550794863787> 返回 200，标题为“《小巫大祸》开发日志：为了做这款游戏，我到底用了多少 AI？”，正文可读到“大家好，我是安奈”与 ChatGPT/Codex、Claude、DeepSeek、Hyper3D/Rodin、Tripo、Suno、Qwen3-TTS 的分工原文（不含“一人独立开发”字样）。修订后重跑 21 个入口（13 个顶级入口＋4 张作者截图＋日志01、10/22 日志、Steam 呓语小镇页、cnblogs 两款作品页），全部 200。
- **元数据复核（只读）：** Claude of Tanks README 的 “Current release” 只给运行规模；`package.json` 版本 1.0.0，无发布日期。World of ClaudeCraft README 标 `version-0.45.7`，GitHub release v0.45.7 发布于 2026-11-03。Kart Royale `LICENSE` 为 MIT、`package.json` 的 `license` 字段为 ISC（冲突已记），版本 1.0.0、无日期。NOVA LANCER `LICENSE` 为 MIT、`package.json` 版本 1.0.0，README「更新履历」记 2026-09-24 公开（之后 09-26／09-27／10-06 更新）。Turbo Kart Rush `LICENSE` 为 MIT、版本 1.0.0、无日期。TIDELINE README 明写 MIT。小巫大祸 TapTap 页 `datePublished` 为 2026-10-19、当前版本 5、7.5 分/7 评价，所链 moment 标题为“开发日志06”；日志01 写明一人独立开发，2026-10-22 日志写明各 AI 工具分工，配音为本地 Qwen3-TTS。
- **未验项：** 所有作品的完整游玩回路、声音实际效果、总线/duck 参数与文档是否一致、AI 披露是否完整、生成音频的商用范围、作者身份与截图是否为当前版本，均未在本单元验证。§3.3 中 CHAMBER SERVICE 的 Godot/Python/50 场景与 Honey Line 的 Cmaj7/92 BPM/172 KB 未取得作者原文，按未核线索处理；呓语小镇的 Wwise/Reaper 细节同样只有转述，未取得作者原文；小巫大祸的日志01 与 2026-10-22 分工日志已读，但配音播放规则仍未取得原文。未试玩、未试听、未看实机画面，不评品质。
- **渠道与截止日：** GitHub（raw/HTML/Search API）、作者站/博客、TapTap（20+ moment／14 个 app 页＋1 个仅 moment 作品）、B 站（10 页）、Steam（4 作品）、Gcores（4 页＋342 条 BOOOM 名单）、YouTube（3 作品简介）、Gitee（2 工具）、PyPI/npm/crates.io（3 工具）、HN Algolia（3 帖）、Arctic Shift Reddit（8 帖）；截止 2026-11-04 UTC。
- **不可读：** itch.io 全部、Reddit 直连与多数镜像、微信 D05 与多数公众号原文、知乎、小红书、今日头条、linux.do、V2EX、Hugging Face 模型卡、部分 YouTube/B 站页面、Audiokinetic 博客、GitHub issue 页与部分 raw README。原因见 §1 与 §6。
- **产物：** 仅本文件 `docs/collaboration/local-jobs/artifacts/B-AI-GAME-AUDIO-MIX-20261104/sources.md`；未改游戏首页、研究正文、inbox、其他卡或规则。
