# B-AI-GAME-SCENE-LIGHTING-20261104 · 成套场景光照二改实例的候选来源

> 原始采集与静态核实日期：2026-11-04。本机只读公开网页、API、源码与作者静态图；未启动任何游戏、未打开浏览器、未看实机录像。负责人同日补核作者原文和固定源码，并尝试两处视频原页，但均未播放成功（见末尾接收范围）。链接可达只代表网页响应；实际玩法、帧率、听感与完整游玩回路均未验，不作品质结论。

**先给结论。** 本轮建议 dot 先完整试玩三款：**Capybara 城市配送**（编辑器先行＋程序道路＋手工摆城，覆盖地形/道路/植被/光照全套）、**backroad rally**（六条赛道×五种时段与雨雪，公开了 UE5→three.js 移植时保留/重做的完整清单）、**长风 Long Wind**（三章各是一套独立的草原/竹林/江南街场景组合，28 小时时间线与 AI/人分工可读）。三款均有公开试玩入口与作者过程，运行可用性待验，覆盖“改路线或主题要重做哪些源”这一核心问题；备选按缺口排在第 4 节。

## 怎么用这份清单

1. **先定要回答的问题**：不是选“最好玩的 AI 游戏”，而是选一个能拆出“建筑/道路/植被/光照怎样成套、换主题时哪些是源、生成/现成/程序/人工各占什么”的样本。
2. **按甲级顺序试玩**：每项先打开可玩页走一段连续区域，再读作者过程，最后用第 9 节的问题清单记录“替换一层要改哪些源”。未验的许可、成本与作者身份不要当成已知。
3. **什么时候不该用甲级**：需要商业可复用资产时先看 Nekomancer／No Man's Mines 的商店披露；需要完整游戏循环而非场景样本时先看 Field of Command／台北狂飙；需要纯程序化管线时看 KAIJU DOKAN／Felt World／Unmask the City。

## 1. 渠道覆盖表

按首次发现渠道归类，跨渠道重复不重复计；收录主链接经本次批量 `curl` 状态码核对（未逐页核内容）。共 **收录 84 项资料**：本卡交接的待试玩首选 3 项；乙 34／丙 33 共 67 项仅作待核线索，缺作者过程、截图或运行证据的不算通过候选门槛；另 14 项丁级按任务排除规则列出。另有 **9 条真实使用问题证据**。数量表示搜索覆盖，不表示完成实例研究。旧 supply 已收录的 City 2026 作为反例只留链接、不计入（见 §10）。

| 渠道 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| Vibe Jam 官方与获奖名单 | `vibejam.com/api`（2025＋2026 共 2,028 条，2026 年 945 条）、`/2026/cache/games-*.js`、`vibej.am/2026`、`/llms.txt`；levels.io 获奖帖、GamesByAI 榜单、中文技术地图、ithome/163 转述 | 9 项（甲 1／乙 2／丙 6） | `/api` 无 winners/final_rank 字段；`/2026/cache/games-*.js` 有 `final_rank` 与 `award`，本清单名次均取自该文件，GamesByAI 与中文地图若冲突以官方缓存为准。Drive 截图全部 000。 |
| GitHub 与 awesome 列表 | REST search（vibejam、topic:threejs-game、topic:vibe-coding、topic:ai-game 等）、trending、lappemic／VibeFin／0xmariowu 等 awesome 表；逐仓读 README、LICENSE、commits.atom、raw 源码 | 24 项（甲 2／乙 17／丙 4／丁 1） | REST 未认证 60 次/小时限流，后半程改 raw 与网页 HTML；`/trending/gamedev` 不是有效分类；部分仓库只看到第一页，精确创建时间/star 未取。 |
| 英文作者博客、HN、Steam 与官方论坛 | HN Algolia search/items 多组查询并读评论树；Simon Willison 多篇原文；richardfu、intelligenttools、gtmascode、usize-tech、habr、dev.to、TabNews；Steam appdetails/ISteamNews；three.js 与 Unity Discourse 的 `.json` | 35 项（乙 9／丙 16／丁 10） | YouTube 000；Reddit 直连 403；X 登录墙/402；部分 Steam 页只取到标题/标签/发售日；Unity 用户资料 403。 |
| 中文社区与媒体 | 掘金、知乎、少数派、B 站标题/简介、公众号（多为转载）、36kr、搜狐、网易、东方财富、jxxy、indienova、TapTap、机核、Steam 中文页 | 11 项（乙 6／丙 2／丁 3） | 公众号多篇“环境异常”验证页；小红书登录墙；indienova 部分 403；B 站未加载播放器与画面；即刻仅摘要。 |
| 收录/聚合索引 | BuzzRadr、vibeheatmap、Stackness、GamesByAI、wccftech、solgames.buzz 等只作索引，尽量回作者页/仓库/原帖 | 5 项（全部丙级） | wccftech、ithome 等 403；部分索引只给摘要，未作为机制证据。 |
| 真实使用问题与证据 | three.js issue #30065 与论坛 131 灯帖、Godot issue #115599、Unity Discussions 程序化光照帖、Unity Asset Store 评价、Lindenwood 论文摘要、Meshy 建筑转 3D 实测 | 9 条证据（不计候选） | GitHub issue API 403 限流；Lindenwood PDF 有人机验证；Asset Store 只读到前 10 条评价。 |

## 2. 资料筛选口径

排序按任务给的筛选门槛，不按热度或 star：

- **门槛 1**：有可玩链接或完整连续实机；仅宣传页、只有单张图或 shader 展示的不进甲/乙。
- **门槛 2**：有作者原始制作过程（README／devlog／长帖／复盘），转述只作线索。
- **门槛 3**：有作者公开静态截图，能定位到原链接；只有相对路径或缺链的明确标注。
- **门槛 4**：版本与发布日期可查；未知就写未知。
- **门槛 5**：AI／人工分工可读；只写“AI 做的”而没有人与模型边界的降级。
- **门槛 6**：成本与许可（代码、资产、模型、音乐）能分开；未知不推算。
- **内容门槛**：一段真实可玩区域里建筑、道路、植被、光照至少覆盖三层；能回答“换路线/主题要重做哪些源”和“生成/现成/程序/人工各做什么”。

**等级只表示资料优先级，不是品质排名或完成验收。** 甲级是本卡交接的三项待试玩首选；乙、丙级均为待核线索，补齐逐项缺口后才能考虑替换首选；丁级按任务排除规则不计入候选。实际实例研究仍须负责人试玩或观看完整无剪辑实机，并读作者原文。

## 3. 甲级：建议先交 dot 完整试玩的 3 项

### 3.1 A Game About Capybaras Delivering Food（Capybara 城市配送）

- 可玩：<https://capybara-vibejam26.leocoout.dev/>
- 作者过程：Reddit 长帖正文经 Arctic Shift 归档 API 读取（本机可读）：<https://arctic-shift.photon-reddit.com/api/posts/ids?ids=1urz4mc>；原帖 <https://www.reddit.com/r/vibecoding/comments/1urz4mc/i_won_25k_with_a_capybara_game_entirely_made_with/>（直连 403）。Medium <https://leocoout.medium.com/how-i-made-25k-in-15-days-with-a-game-built-entirely-by-claude-code-94b3b817f0ce>（连接被拦，未读全文）。
- 作者静态图：城市/农田/海滩 <https://preview.redd.it/10vcpefat8ch1.png?width=2028&format=png&auto=webp&s=c11d95bafe43fe82f1ade8b885a8d143f2ce828c>；编辑器 <https://preview.redd.it/9ls7vi7tq8ch1.png?width=2000&format=png&auto=webp&s=3511660718b9bd7e7a6c1dbf1ec9ab0f5e77bd40>。
- 版本与日期：Vibe Jam 2026 总第 1（945 件），Jam 提交 2026-04-29，当前页面 build v1.7.1。
- AI／人分工：Claude Code 写 100% 代码（188 commits、约 27k 行）；GPT Images 2／Tripo3D 出贴图与模型；人做工具方向与手工摆城。
- 成本与许可：作者列出的工具增量支出 <$150（Claude 从已有套餐升级差额 $100、Tripo3D $19.9、Grok $8，图像试用与音频免费档）；这不是完整订阅账单或项目总成本。代码/素材许可未知。
- 为什么最值得挖：它是本批里把“先做编辑器、再做内容”写得最完整的样本。地形刷、材质绘制、自动道路（人行道/路灯/护栏）是作者自建工具，城市位置仍手工摆；PS1 材质、雾与天空噪点是第二周叠上去的层，昼夜与雨在第一周已作为附加项加入（第一周末清单第 5 项即 weather and day/night cycle）。原文以“End of first week results”和“# Second week of development”分段，这正好对应案例“材质族、道路、建筑位置、光照氛围”四层，能直接回答换主题时哪些是生成源、哪些是手工内容。
- 缺口：作者身份只到 handle；Medium 未读；许可未知；静态图是 Reddit 原图，未核游戏当前画面是否与之一致。

### 3.2 backroad rally

- 可玩：<https://jason-c-dev.github.io/backroad-rally/>
- 作者过程：仓库 <https://github.com/jason-c-dev/backroad-rally>；制作记录 <https://github.com/jason-c-dev/backroad-rally/blob/main/docs/making-of/README.md>（9 章目录：11 个纵向切片、UE5 四天＋three.js 三天、221 项操控检查、UE5→Web 移植时保留/重做的数据；成本见第 9 章）。
- 作者截图：<https://raw.githubusercontent.com/jason-c-dev/backroad-rally/main/docs/images/slide-sunset.jpg>、<https://raw.githubusercontent.com/jason-c-dev/backroad-rally/main/docs/images/crowd-afternoon.jpg>、<https://raw.githubusercontent.com/jason-c-dev/backroad-rally/main/docs/images/lake-sunset.jpg>、<https://raw.githubusercontent.com/jason-c-dev/backroad-rally/main/docs/images/night.jpg>（raw 链接本次均 200）。
- 版本与日期：2026-10-15 至 2026-10-18；无版本号。
- AI／人分工：README 原文“Claude Code wrote almost all of this game... One developer gave the ideas, made the decisions and played every build”；过程记录按切片与检查项展开。
- 成本与许可：作者统计约 2.13B tokens；Claude Max 20x 月费 $200（含当月其他工作），按作者所用 API 价格折算约 $769.35。作者另列 ElevenLabs 120 次调用，但只记了部分音效 credits，未给音乐费用和美元成本，因此音频支出及完整项目成本未知。代码 MIT；作者说明非商业 demo 才可带署名发布其 ElevenLabs 音频，不能据代码许可推定资产可商用。
- 为什么最值得挖：六条点对点赛道（芬兰、日本、阿尔卑斯、威尔士、亚利桑那、佛蒙特）配五种时段与雨雪，是本批唯一公开“从 UE5 迁到 Web 时哪些源保留、哪些重做”的样本。它把“换引擎”和“换主题”两种重做放在同一份记录里，适合给案例定“哪些是源、哪些是导出物”的判断线。
- 缺口：AI 分工只到切片级；音频美元支出未记录，订阅含其他工作；资产逐件复用许可未核。

### 3.3 长风 Long Wind

- 可玩：<https://jbang2004.github.io/long-wind/>
- 作者过程：仓库 <https://github.com/jbang2004/long-wind>；README 给出 2026-09-24 首条中文提示到三章完成的时间线与 AI/人分工。
- 作者截图：<https://raw.githubusercontent.com/jbang2004/long-wind/main/docs/media/steppe.jpg>、<https://raw.githubusercontent.com/jbang2004/long-wind/main/docs/media/bamboo.jpg>、<https://raw.githubusercontent.com/jbang2004/long-wind/main/docs/media/town.jpg>（raw 链接本次均 200）。
- 版本与日期：三章可玩；仓库 2026-11-02 仍在更新；无版本号。
- AI／人分工：README 原文“我没有写代码……设计、编码、调试、测试、性能优化都由 AI 完成”；人提出方向与审美要求、试玩并指出不自然处、录参考视频、登录 Tripo/Mixamo 账号授权 AI 使用。
- 资产来源：地形、草、竹林、城镇、天气、市民均程序化；角色模型 Tripo 生成，动作以 Mixamo 动捕为主、AI 重定向并做 IK 修正，部分招式是程序化关键帧。
- 成本与许可：成本未披露；代码 MIT，Poly Haven 贴图/模型 CC0，Tripo 角色模型与 Mixamo 动捕不在 MIT 内、不可单独提取或再分发。
- 为什么最值得挖：三章正好是三套完整的场景组合——黄昏逆光草原的草浪与孤树石碑、雨夜竹林的闪电/积水倒影/石灯笼、五百盏灯笼的江南长街与河道石桥。它不是“一个场景换颜色”，而是同一作者在三章里换了地形、植被、建筑与光照，能直接对照“哪些生成源共用、哪些按章重做”。
- 缺口：无版本号；成本未知；角色与动捕许可是代码 MIT 的例外。

**为什么是这三项。** Capybara 回答“工具与编辑器怎样决定内容边界”，backroad rally 回答“换引擎/换主题时源清单长什么样”，Long Wind 回答“一章一套场景组合时哪些源共用”。三者均给出了试玩入口、作者过程、日期及许可/成本的已知项与缺口；场景覆盖互补，且不依赖同一引擎或同一美术风格。Neon Zenith、Sunset City、Spring Rider 放在 4.1 作首选替换：前两者光照机制更细但制作长文/版本缺口更大，后者已在本仓音频研究里出现，不是完全新作品。

## 4. 乙级待核线索：补齐证据后再考虑替换（34 项）

### 4.1 制作链路较完整的线索（13 项）

1. **Felt World** — <https://az9713.github.io/opus-5.5-open-world-game/feltworld/>。单文件开放世界：带车流的道路、针织小镇街道、房屋/树木/路灯、海面与水下；纹理全用 canvas、声音 WebAudio 程序生成，无图片/音频文件；README 加 `tech-stack.html`／`felt-effects.html` 解释七层毡化外观、物理测试与制作方式；MIT；2026-09-28 更新。缺口：模型/成本未披露，截图在 `screenshots/` 相对路径。
2. **怪獣ドカン！ KAIJU DOKAN!** — <https://tanuu5.github.io/kaiju-dokan/>。4 分钟破坏 40% 的黄昏湾岸城市；建筑、道路、街树、天空与海面全部 shader 程序化，夕照叠加 bloom，怪獣被楼遮挡时用 stencil 透视剪影；README 明说 Claude Code＋Opus 5.5、无外部图像/音频、MIT，附标题/吐息/玩法三张作者截图；2026-09-26 起更新。缺口：成本与版本未披露。
3. **Civitas** — <https://civitas.reneo.app>。浏览器 three.js/TS 多人城市建造：地形是 `(seed,x,y)` 纯函数，道路按 N/E/S/W 邻接选块，建筑按 hash 选型，太阳随游戏时钟移动、有程序阴影和逐窗灯光；London demo 用真实坐标铺主路、泰晤士河/桥与约 30 个地标。源码 AGPL-3.0、551 commits <https://github.com/reneodlt/civitas>；作者原帖 <https://www.reddit.com/r/ClaudeAI/comments/1x9d2ek/i_built_a_browser_city_builder_with_claude_code/>（直连 403；正文经 <https://arctic-shift.photon-reddit.com/api/posts/ids?ids=1x9d2ek> 读取）。缺口：无正式 release；评论未读。
4. **Unmask the City** — <https://furic.github.io/unmask-the-city/>。Global Game Jam 2026 的 Three.js 程序城市：300+ 建筑用 InstancedMesh 与逐实例颜色，树干/树冠分件，Day/Dusk/Night/Neon 四主题自动切换，2048 阴影图，512×512 fog DataTexture 注入 shader，无外部模型/音频。作者 devlog <https://www.richardfu.net/building-unmask-the-city-a-solo-game-jam-journey-with-ai-pair-programming/>、源码 <https://github.com/furic/unmask-the-city>，1.5 天完成。缺口：仓库无 LICENSE；道路未实现。
5. **Halcyon** — <https://halcyon.billpwchan.art/>。3.6 km 环礁：USGS lidar 山峰、按植被图分层的地表、43,000 株扫描植物与 370,000 珊瑚、三层级 FFT 海面、36 分钟昼夜与天气；README 给出 Claude Opus 5.5 分工、MIT 代码与 CC BY/CC0 资产、v1.0.0 资产包及 `docs/media` 截图。缺口：它是可走/游/帆/飞的交互场景、没有胜负目标，是否符合“实际游戏”待负责人判定；成本未披露。
6. **Emberwick** — <https://simonw.github.io/emberwick/v11/emberwick.html>。约 15 分钟完整低模奇幻 RPG：村庄、墙体透明剖切、地下室与隧道、山洞营火/发光蘑菇/蓝水晶、黄昏酒馆烛光；图形、剧情、音乐、对话全部模型生成，作者给“奇幻村庄＋洞里睡着的巨魔”设定，并做了多轮提示、试玩与玩法修正。v01、v02、v05–v11 可玩（v03/v04 本次 404），构建对话全文公开 <https://claude.ai/share/840e0bc0-a68e-4894-8eec-8f83bd6ade26>，过程与截图 <https://simonwillison.net/2026/Oct/28/vibe-game-development/#emberwick>（原文：“This took quite a bit of additional playtesting and prompting.”）。缺口：许可未声明；成本未披露。
7. **Pumpkin Farmer / Quarter Sun Cove** — <https://simonw.github.io/pumpkin-farmer/>。等距低模农场：巨型南瓜、串灯、雾、码头、谷仓、动物顾客；Opus 5.5 Ultracode 近两天建成，初始 brainstorm 与 SPEC.md 链接 <https://github.com/simonw/pumpkin-farmer/blob/cdcf12083f403946b5c2a9e04312bbb42359bf58/SPEC.md>（仓库未公开，本机 404，只作线索），过程与截图 <https://simonwillison.net/2026/Oct/28/vibe-game-development/#pumpkin-farmer-aka-quarter-sun-cove>。缺口：许可未声明；作者自评机制不如 Battle Drones。
8. **Nekomancer** — <https://store.steampowered.com/app/5066530/Nekomancer/>。已发售的 Three.js→Shade 弹幕肉鸽；作者在 <https://discourse.threejs.org/t/nekomancer-game/93115> 自述约 9k 美元 token、504 次提交、FLUX.1 LoRA 生成美术，并记录迁到 Shade 后用体积光替换手调雾、取消阴影投射体上限。缺口：开发构建 401；成本只是 token/订阅口径；资产许可需按商店页另核。
9. **Old Circle** — <https://github.com/Usnul/old-circle>。同作者的开源可跑 WebGPU 动作 RPG；<https://discourse.threejs.org/t/come-piggies-i-got-slop/94232> 记录 GPT-6 Astra 经 Blender MCP 生成场景与建筑，贴出地形穿插、绕序、UV 断裂及 clustered lights/shadows/TAA/GTAO 光照层的修正过程。缺口：仓库未见 LICENSE。
10. **OpenMMO** — <https://openmmo.to.nexus>。可玩 MMORPG，README 明说 solo/vibe-coded、资产混合 AI/程序/网络来源；<https://github.com/Julian-adv/OpenMMO/blob/master/doc/devlog/2026-06-23.md> 记录火把点光池化避免 shader 重编译、shadow backface/peter-panning 修正。缺口：资产逐项许可未核；成本未披露。
11. **霓虹天頂 Neon Zenith** — <https://zenith.billpwchan.art/>。9,373 栋建筑的连续可飞城市：起点 Temple Street 在 Blender 逐栋搭建并用 Cycles 从自身霓虹与路灯烘焙 lightmap，立面用捕捉贴图加视差房间 shader，雨夜路面反射与 168 m 峡谷航道可直接对照建筑/道路/光照如何成套；README 记录 Claude Opus 5.5 一个周末制作、TSL 单一着色源、MIT 代码与 CC BY 模型，时间赛道/碎片/奖牌构成完整玩法，2026-10-06 提交。缺口：成本未披露；静态截图原链未随清单提供；植被覆盖弱。
12. **Sunset City - The Dark Tower** — <https://sunset-city.didof.dev/>。Vibe Jam 2026 第 8；程序化暖色港口城市，攀爬屋顶/潜行到黑塔，建筑体量＋街道＋日落光照正是本卡要的成套场景。作者 @did0f 用 Claude Code＋Three.js；X 原帖给出关键做法：室内不是几何，而是 4 个同步 shader 伪造，并公开 Interior Shader Generator（<https://x.com/did0f/status/2067178623002362063>、<https://x.com/did0f/status/2067223371788513369>、<https://sunset-city.didof.dev/interior-shader-generator/>）。当前公开 bundle 可见 skybox＋FogExp2＋半球光/主光/补光、1024 阴影、曝光与雾/太阳颜色随暖度插值，以及程序化草/沙/水 shader；作者静态图 <https://sunset-city.didof.dev/og.jpg>。Jam 提交 2026-04-28，无版本号；成本/资产许可未知。
13. **Spring Rider** — <https://intelligenttools.co/play/spring-rider>。俯视下坡山地车 3D 游戏（Godot 4.5，13 天）：Multica 多 agent 全部跑 Opus 5.5，作者自述几乎不写代码。环境用 Kenney Nature Kit（CC0）的树/岩石/悬崖/树桩/蕨类，运行时按材质名重着色到同一 palette，赛道与植被由代码程序放置，单一低角度暖阳＋平面着色；作者原文 <https://intelligenttools.co/blog/multica-agents-godot-game> 给出 art bible、palette 文件、按 API 标价估算约 $222（非实际订阅支出）、静态截图和明确的人/AI 分工。可玩页 HTTP 200；游戏自身许可未声明，素材 CC0 已注明。缺口：已在本仓音频研究里作为音效案例出现，不是完全新作品；静态截图原链未随清单提供。

### 4.2 有试玩入口但存在关键缺口（12 项）

1. **Field of Command** — <https://play.fieldofcommand.com/>。Vibe Jam 2026 第 10，俯视 1940 肯特战场 RTS；公开截图把地形、道路、房屋、树/树篱、河流和光照分层组合 <https://www.fieldofcommand.com/media/v1/gameplay/escaut-orders-mode-poster-v1.webp>（v0.3.13）；作者 X <https://x.com/Southers15> 持续发地形破坏/河流/建筑截图，官网 <https://fieldofcommand.com/> 写免费 Steam demo 即将推出；Jam 提交 2026-04-10。缺口：只知 Cursor 写大部分代码，图形/音乐来源、成本、许可未知，未找到完整制作复盘。
2. **Mecha Royale** — <https://www.mecharoyale.com>。2026-09-13 Show HN 与 r/ClaudeAI 作者 m0dE 称约 99% 代码与内容由 Claude Opus 生成：15 km 半径地图用规则/种子在运行时生成数百万个对象（树、道具、掩体、洞穴）与道路、水，整包约 20 MB。原帖 <https://news.ycombinator.com/item?id=49686666>，Reddit <https://www.reddit.com/r/ClaudeAI/comments/1x8602z/procedural_generation_with_opus_is_insane_this/>（直连 403；正文经 <https://arctic-shift.photon-reddit.com/api/posts/ids?ids=1x8602z> 读取）。缺口：评论未读；成本/许可未知。
3. **《小王子：星辰之旅》** — <https://littleprince.dev/>。16 天做出的 Unity 6 WebGPU 可玩 3D 游戏（8 章、2.01GB）；中文拆解 <https://lijianfei.com/post/ai-3d-game-pipeline-opus-tripo-blender-unity-little-prince/> 记录参考图定空间/材质/光比，Tripo 生成有机件并去烘焙光，Blender/Opus 脚本建星球/路径/棚屋，Opus 经 Unity MCP 做地形雕刻、道具摆放、植被散布、材质与光照烘焙，独立盲审 Agent 用多视角截图查比例/接地/穿插/法线/光色；作者原帖 <https://x.com/Saccc_c/status/2109962425512734739>。缺口：成本/许可未披露，源码承诺开源但未见。
4. **《云海神殿》** — <https://skytemple.cclliang.com/>。共 33 个代理分批并行（八个系统阶段最高 8 个同时，因 5 小时额度上限后期降到 3 个）、约 1,180 万 token 做出的完整可玩 3D 动作游戏（5 章＋Boss，首通 18–25 分钟）；全部模型为代码几何体、贴图程序生成、音效 WebAudio 合成；场景明确做黄昏逆光、软阴影、体积雾、光柱、发光符文与浮尘，互动物青绿光、敌人攻击橙红预警，并把阳光反射做成解谜机制；文章 <https://www.cclliang.com/2026/10/05/vibe-coding/e4/> 有 20+ 张实机静帧/GIF（如 <https://cclliang.com/images/ai/sky-temple/s1-title.jpg>）。缺口：无版本号；游戏许可与成本未披露。
5. **XLands 小世界** — <https://frankfanyiming.github.io/frank_worlds/>。三个可探索 3D 世界（哆啦A梦小镇/旅行蛙/柯南小镇）；制作手记 <https://frankfanyiming.github.io/frank_worlds/resources/making-of.html> 记录 Blender 保留可编辑源、Tripo MCP 图生 3D、Codex/Blender Python/Godot 协作；道路因三角形朝下丢太阳阴影，修缠绕顺序/法线/薄路自阴影，约 4cm 倒角缝仍会挡角色；光照区分主光/环境光/窗边补光/烘焙光，Blender 程序材质转可导出贴图再在引擎 Compatibility 模式核色；手机端独立生成模型/贴图并保留 PC 源，给出下载体积/三角面/draw call 前后数字。缺口：作者声明 IP 未授权、完整原始模型 pending-publication、成本未披露。
6. **《台北狂飙》/ Taipei Rush** — <https://www.taipei-rush.app/>。台湾开发者用下班 5–6 小时/天、约 1 个月做出浏览器 3D 开放世界，low-poly 卡通渲染还原西门町/台北 101/总统府/龙山寺，含骑楼、密集招牌、路边机车、红绿灯、昼夜天气；作者自述投入 >1 万美元 token、最多约 200 个 AI 并行、30 多种模型，人工负责协调 AI 冲突与整合；后续新增香港/东京/高雄等城市。缺口：作者 Threads 原帖读不到，过程来自访谈/新闻（维基 <https://zh.wikipedia.org/wiki/臺北狂飆>）；街道过方、桥底过矮挡路、AI 角色肢体扭曲为已知问题。
7. **No Man's Mines** — <https://store.steampowered.com/app/4926180/No_Mans_Mines/>。Fork Dev 的 3D 生存建造，2026-07-14 Demo 可玩；2026-07-09 至 10-27 的五篇更新明确记录 toon 光照、程序化天空/太阳、体积感云、地下照明和夜间底光修复，商店页披露 AI 仅辅助视觉资产与编码。缺口：过程是补丁说明而非完整制作复盘；成本未披露。
8. **I Just Wanted to Fish（devlog 内称 Nightshoal）** — <https://store.steampowered.com/app/5351000/I_Just_Wanted_to_Fish_Demo/>。Steam Demo 2026-11-01 已上架，可下载（appdetails：release_date 2026-11-01、coming_soon=false、is_free=true、type=demo，页面有 Free Demo）；作者另给 itch.io demo <https://profactor.itch.io/nightshoal>；本机未启动游戏，可玩性按页面与链接判断。第 10 周 devlog <https://arctic-shift.photon-reddit.com/api/posts/ids?ids=1wy28wy>（原帖 <https://www.reddit.com/r/ClaudeAI/comments/1wy28wy/week_10_of_making_my_fishing_game_with_the_help/>）具体写港口换树模、移动太阳位置改善阴影、修阴影 bug、把贴图泡沫改成真实波浪；用 `decisions.md` 给每条决定标 `[USER]/[AI]`。开发约 3 个月、作者自报总成本约 $900–950（Claude Max 200×3=$600、Astra $100、ElevenLabs $11、TripoAI $40、OpenAI $80、杂项约 $100）来自 <https://www.reddit.com/r/ClaudeAI/comments/1xlr3u8/been_making_this_game_for_3_months_using_only_ai/>（正文经 <https://arctic-shift.photon-reddit.com/api/posts/ids?ids=1xlr3u8> 读取，评论未读）。Steam AI 披露原文：“I designed the game and its levels myself. I used AI tools to help make 3D models, animations, text, translations, visuals and store page material. No AI is used while you play.”（未给 95–100%、Blender 或“全部动画”的量化；第 10 周 devlog 另写 3D 模型由 Blender MCP/Claude 或 TripoAI 完成。）缺口：完整版 App 5350560 为 Q1 2027；资产/代码许可未核；评论未读；实机未看。
9. **《西出阳关》楼兰章** — 作者原帖 <https://x.com/thinkszyg/status/2113840455524012292>，中文拆解 <https://www.jxxy.net/ai/articles/thinkszyg-2113840455524012292/>。一人＋AI 10 天在 Unity 6 做出可从头走到尾的 3D 楼兰章，约 8 分钟、5 区（枯胡杨林→古河道→城门→街巷→佛塔）、5 交互、7 镜头节拍；Claude Code 规划/审计并在 Unity 内调光影，Codex 写代码与出参考图，Tripo 生成胡杨/夯土/佛塔等有机件，Blender 代码生成墙体木构。明确记录平光对比不足、材质细节弱、静帧对但播放发灰、改成“只看录屏不看静帧”、4K 渲染缩 1080p 去锯齿，并按 12 维打分从 6.8 到 7.2、录了 30 多版整章。缺口：仅公开录屏/静帧，未见公开试玩 build；成本与许可未披露；作者身份只到 handle，中文页是知识库转述。
10. **深城纪 GTA_SZ** — <https://github.com/linranff/GTA_SZ>。OSM 道路、Blender 地标、45,626 棵树三档 LOD、日/日落/夜三套光照、512×512 平面反射、随视距调整的阴影与 SSAO；README 明列 GPT-6 Astra（城市/玩法规划、Blender 建模、材质与光照、浏览器验收）与 Fable 5.1（代码、性能诊断、shader 重编译修复）及作者本人分工，并给出 80ms 以上帧 31→3、shader 编译 650→198 的前后记录。缺口：演示 <https://shenchengji.gtasz.workers.dev/> 本机 `curl` 返回 000（域名不可达），可玩性未验。
11. **Papaya Drive** — <https://dator.dev/papaya/>。City 2026 作者 Einar Andersson（dator.dev，HN 自述用 Opus 5.5 在几天内复刻 SimCity 2000）的另一款浏览器低模驾驶游戏，含 Ridge trail／Palm cove／Papaya city 三张地图和可切换的烘焙光照。缺口：AI 分工、成本、许可未在该页披露。
12. **SweatyPanzer** — <https://sweatypanzer.com/>。可玩的 WebGPU 3D 多人坦克游戏；作者在 <https://news.ycombinator.com/item?id=49088907> 自述此前只会 HTML/CSS/PHP，用 Fable/Opus 5 从原型迭代到三张可破坏地形地图、匹配与延迟补偿系统。缺口：场景以战场地形为主，建筑/道路覆盖弱；成本/许可未知。

### 4.3 单场景与同作者系列（9 项）

以下 9 项均为可玩页＋README；除逐项注明外，成本均未披露、许可未逐件声明，版本/日期以各仓库 README 为准。

1. **Sundown City** — <https://jason-c-dev.github.io/sundown-city/>。backroad rally 同一作者的开放世界驾驶：README 列三座程序化岛屿、建筑/道路/水面与昼夜夕照，仓库以 GOAL.md、specs 与逐里程碑截图记录 Claude Code 的施工和验收。缺口：过程记录比 backroad 略；成本未披露。
2. **わすれもの駅 Wasuremono Station** — <https://tanuu5.github.io/wasuremono-station/>。单座废弃车站：屋顶破洞光柱、积水倒影、藤蔓与草木都由 shader/代码生成；README 说明仅 3 张 ChatGPT 图片是外部素材、剩余全程序化。缺口：小区域样本，建筑/道路覆盖有限；许可未声明。
3. **ぽんぽこカート Ponpoko Kart** — <https://tanuu5.github.io/ponpoko-kart/>。三条和风赛道（夕照稻田、千本鸟居、夏祭夜景）含水面平面反射、草丛/稻子实例与远景分层；README 公开一次请求 1 小时 55 分、841 次调用、291 万输出 token 与 6 个子代理分工。缺口：赛道而非开放区域；许可未声明。
4. **しっぽ急便 TAIL EXPRESS** — <https://tanuu5.github.io/shippo-express/>。3D 城市配送：道路、建筑、招牌、小物按固定种子生成且游戏内不使用任何图片/模型/音频文件，README 附街区全景截图与无头 Chrome 逐帧验收。缺口：无版本/许可；制作过程以 README 为主。
5. **AQUA BLUE 〜失われた海の記憶〜** — <https://tanuu5.github.io/aqua-blue/>。水下探索把光照写成明确管线：分通道光吸收、god rays、由水面折射计算的 caustics、bloom，并在启动时把光/影烘进深度图，全资产代码生成。缺口：水下单一环境；许可未声明。
6. **Little Rain Cloud《小雨云》** — <https://dososo.github.io/little-rain-cloud/>。《西出阳关》作者 dososo 的另一款 three.js 可玩场景：噪声沙丘、512² 湿度图驱动最多 18 万株实例化草花、昼夜与萤火虫，README 给完整做法。缺口：AI 参与程度未披露；成本/许可未知。
7. **Last Courier（ラスト・クーリエ）** — <https://tanuu5.github.io/last-courier/>。3D 配送游戏：河谷/峡谷/腐雨与 7 个据点，地形、天气和模型全程序化，README 有 6 张静态截图并写明 Claude Code 全量生成。缺口：许可/成本未声明。
8. **Nova Lancer（ノヴァ・ランサー）** — <https://tanuu5.github.io/nova-lancer/>。Star Fox 式 3D 轨道射击，含夕阳海面、红色峡谷与霓虹夜要塞三套场景光照，1 次请求约 1 小时 40 分完成。缺口：轨道射击场景窄；许可未声明。
9. **Tanuki Rush** — <https://tanuu5.github.io/tanuki-rush/>。5.7 km 坡道街区高速动作，全程程序化街景、建筑贴面和电线滑轨，可与 Shippo Express 对照同一作者换主题时哪些街区源要重做。缺口：许可/成本未声明。

## 5. 丙级待核线索：场景或流程参考（33 项）

丙级只作场景或流程对照，不满足“可玩＋作者过程＋场景覆盖”的完整门槛；版本、成本、许可多数未披露，逐项只写已核到的部分。

1. **Wanko Town Online** — <https://blog.usize-tech.com/claudecode-3dgame-developing/>。Godot 低模 3D 小镇：建筑、树、狗/人全部由 box/cylinder/sphere primitives 程序生成，零外部模型/贴图；阳光＋阴影＋环境光，配套程序全景天空、深度雾、辉光与 Filmic tonemapping；Claude Code 写全部 30+ GDScript 与数万行代码，人只做审阅、需求与方向，2 天约 15 小时 AI 工时；日文原文含 walkthrough 与 debug 视频及静态截图。缺口：没有 playable 链接，许可未声明。
2. **Super Mario Galaxy fan game（supertommy）** — <https://supertommy.com/games/super-mario-galaxy-movie-game/>。53 天、731 commits、约 95% 代码由 Claude Code 写（7.6 万行 TS，Three.js/Rapier3D/自定义 ECS），HN 评论 <https://news.ycombinator.com/item?id=47600002> 说明 87 份计划、36 次 AI review、11 次复盘与 $200 Max 订阅；但模型借自已归档的 Hello Mario Framework，作者明确承认 level design 失败。作为“代码规模≠场景设计能力”的边界样本。
3. **Sim-SiliconValley** — <https://simsv.gtmascode.dev>。等距 3D 创业城市模拟，vibe-coded 端到端，每日 agent 从 roadmap 选一项交付，commit log 即 devlog；作者博客 <https://www.gtmascode.dev/blog/2026-08-11-sim-siliconvalley-vibe-coding-3d-startup-sim> 给出可玩链接、截图与迭代方式。缺口：道路/植被/光照做法未披露，场景证据弱。
4. **tank-battle-3d（孙浩君）** — <https://github.com/itsunhao/tank-battle-3d>（Gitee 镜像 <https://gitee.com/itsunhao/tank-battle-3d>）。2026-10-20 的 MIT 开源 3D 坦克战（Spring Boot＋Three.js r160），作者称 0 行手写；三张地图：城区巷战（密集楼宇＋沥青网格路）、海滨战区（Gerstner 海面＋沙滩棕榈）、绿野乐园岛（草甸环岛＋三色树＋蜿蜒土路＋绿篱石板），渲染用方向光实时阴影/雾/ACES，阴影贴图 512–2048 可调，地图按 loader 模块拆分。缺口：无公开在线试玩，只能本地 `mvn/java` 启动（默认 8811 端口）；成本未披露。
5. **《此城未逝》** — <https://monkeyhub.org/projects/renou/>。5 人跨三时区、5 天做出的交互式山城场景（以重庆渝中真实地形/路网为底，融合热那亚/长崎），流程从真实地形和道路开始，沿路划分地块、按地块尺寸选建筑类型，放不下换窄型或移除，专门处理 22% 坡地入口/台地/挡土墙；模型进场景后接材质/灯光/摄影机；AI 负责建模规格、脚本、批量建模/局部修图，人负责建筑判断、方案比较、截图批注；31 个 Claude 主会话/156 子代理/804 Codex 线程/2.09 万张图。缺口：仅 6:37 影片与 1 张封面，无公开试玩；成本/许可未披露。
6. **Concordia** — <https://concordia.davidveksler.com/explore/>。21 km 旋转太空城，57,000 栋程序化建筑、420,000 棵树、80 个地铁站，按确定性规划分 cell 流送，单元/植被用 instanced 并按画质档调密度；工程规格与设计笔记约 52 万字（520,000 words）；作者负责方向、审阅与规格未覆盖的决定，AI coding agents 按规格写大部分代码，真实 GPU 截图检查不过就 fail build（过程见 <https://concordia.davidveksler.com/about/> 与 <https://discourse.threejs.org/t/concordia-a-21-km-rotating-space-city-you-can-walk-in-the-browser/95434>）。缺口：可走可看的交互场景，非任务游戏。
7. **Moonlight & Mayhem（Codex + GPT-5.6 Sol Ultra）** — <https://simonw.github.io/raccoon-heist-codex/>。同一提示交给 Codex 的第二次成品，夜间博物馆内景带摄像头、手电和警报光，作者给出 52 分钟、约 $23.28 的完整 token/成本与两张截图对照，可与 Raccoon Heist 比较模型和流程差异。缺口：单场景小游戏；许可未声明。
8. **Starfall** — <https://e01.ai/starfall/>。长风作者的太空 RTS：星舰、行星、星云全程序化，天空烘成 cubemap 供 PMREM 环境光，README 与作者推文公开首跑 $632.65 的 token 账和单提示多代理流程。缺口：不含建筑/植被场景，只作环境光管线对照。
9. **Utsuroi（移ろい）** — <https://utsuroi.billpwchan.art/>。京都宅院与庭园：离线路径追踪光照按小时混合、太阳与天空共用单次散射模型、raymarched 云按帧累积，正对连续光照氛围。缺口：滚动式互动场景，不是目标驱动的游戏。
10. **Sakura Fantasy（桜幻想）** — <https://sakura.billpwchan.art/>。四季节河流旅程：全场景共用一套 uniforms（日月、天空、雾、季节权重、湿度、最多十盏点灯）驱动树木/地表/屋顶/雾色，post 链含 bloom、太阳光束、色调映射与分级。缺口：互动场景而非游戏；README 未写 AI 归属。
11. **Null Range** — <https://nullrange.com>。Vibe Jam 2026 最佳美术方向得主，Taylor（@taylor_sntx，3D/交互设计背景）的 Three.js 太空射击。缺口：太空狗斗，无建筑/道路/植被；作者制作过程与静态图未读到。
12. **Kanso（Kansō）** — <https://www.kansogame.com>。Vibe Jam 2026 Most Zen 得主，Three.js 盆景模拟，可对照低对比、安静氛围的场景光照与材质。缺口：本机只读到标题/简介；无作者过程。
13. **Eyrie** — <https://playeyrie.com/>。Vibe Jam Most Atmospheric；第三方目录称其有程序化沙漠/山体/洞穴、昼夜与电影感 shader，可玩入口可达。缺口：作者制作过程只见 X 帖、本机不可读，未取得作者静态截图原链，只能作头部线索。
14. **Lantern Hollow — The Borrowed Tomorrow** — <https://lantern-hollow-rpg.simonw.chatgpt.site>。Simon 把 Emberwick 的同一串提示词喂给 GPT-6 得到的可玩奇幻 RPG，与 Emberwick 构成同题对照，可看不同模型在村庄/洞穴场景与可玩性上的差距；作者原文明确说画面好但玩法不如 Emberwick。缺口：单场景对照样本。
15. **Purge Protocol: Zombie Arena** — <https://supertommy.com/games/purge-protocol-zombie-arena>。Super Mario Galaxy 作者作品目录里的 3D 舰内僵尸射击（爆头/断肢、噪音触发尸群），About 页明确说全部作品由 AI agents 协作完成。缺口：场景为舰内走廊，建筑/道路/植被覆盖弱。
16. **Super Mario Movie Game** — <https://supertommy.com/games/super-mario-movie-game>。Super Mario Galaxy 的直接前作，TypeScript/Three.js/Pixi 的 3D 图形马里奥平台游戏（2D 玩法），可看 Galaxy 之前的美术与光照积累。缺口：2D 玩法、借任天堂 IP。
17. **Hong Kong Rush（香港狂飆）** — <https://www.taipei-rush.app/hong-kong/>。Taipei Rush 同站并列的独立城市版本，用 OSM 等开放数据搭叮叮电车、红的士、霓虹招牌与维港。缺口：同引擎城市变体，无独立制作过程。
18. **Tokyo Rush（東京狂飆）** — <https://www.taipei-rush.app/tokyo/>。同系列东京版，覆盖银座霓虹、秋叶原、山手线与首都高，和台北/香港共用引擎但换了建筑与招牌光源。缺口：同上。
19. **CityRider / This Is Where You Go (When You Die)** — <https://cityrider.jpsmaps.com/>。San Francisco -- The Game HN 评论区里作者 jparishy 自荐的费城 GIS 城市游戏，称已做数月并靠 LLM 降低用公开 GIS 数据建城的门槛。缺口：AI 制作程度与过程未核。
20. **FLY SF** — <https://sf.flyover.gg>。Vibe Jam 2026 的 Three.js 照片级旧金山 3D 扫描飞行/驾驶作品，作者 Show HN 记录了 Google 3D Tiles＋3D Tiles Renderer＋WebSocket 多人的实现。缺口：SF 版本当前暂停，仅经典 flyover 仍在线；不是 AI 生成场景。
21. **Inkline Town** — <https://inkline.typeonce.dev/>。Claude Code + Codex 的细线 3D 城市建造，道路、住宅、生产链与植被全部以线稿渲染。缺口：清单未给作者过程与静态截图原链，场景证据只有页面。
22. **The Great Taxi Assignment** — <https://great-taxi-assignment.netlify.app/>。Vibe Jam 2025 冠军的 GTA 式 3D 城市出租车游戏（Cursor + Claude 3.7 Sonnet + Three.js），有完整城市道路与昼夜氛围。缺口：2025 年作品，制作过程未在本轮读到。
23. **Floral Escape: Ghost Forest** — <https://www.escape.alexandre-grisey.fr/>。手电筒在黑暗森林找七朵蓝花、躲避幽灵的第一人称游戏（Cursor + Claude + Three.js），光照同时承担玩法、可读性和恐怖氛围。缺口：作者个人站只有 JS 空壳；过程证据弱。
24. **Undersphere** — <https://playundersphere.com/>。Vibe Jam 2026 Unique Concept 奖，球体内壁、重力翻转的多人 FPS（Three.js），场景朝向与光照随重力重定向。缺口：非平面世界，主动避开建筑/道路样本；无作者过程。
25. **WenWare** — <https://wen-ware.com/>。Vibe Jam 2026 第三名兼 Most Played，360° 历史全景的地点/年代竞猜（Codex + Three.js），可看真实全景素材如何按时代与地域做统一色调与氛围。缺口：360 全景不是 3D 场景。
26. **VibeSail** — <https://vibesail.com/>。多人帆船模拟（Cursor + Claude 3.7 Sonnet + Three.js），调帆、每日比赛与岛屿探索，海面反射、天气与岛屿光照是核心画面。缺口：清单未给作者过程与截图原链。
27. **Island Adventure** — <https://ja.sperdeboer.nl/island/>。飞机失事后的海岛生存：采集、建造、钓鱼、搭庇护所（Cursor + Three.js），地形、植被与昼夜循环成套出现。缺口：过程证据只有页面描述。
28. **Hoardborn** — <https://hoardborn.com/>。Claude Code + Three.js 的放置 ARPG，程序化地牢、战利品与帮手。缺口：室内关卡为主，场景证据弱。
29. **ChexQuest.js** — <https://supertommy.com/games/chex-quest-js>。同一作者的 three.js 版 Chex Quest，把原作五个关卡加隐藏关重建成浏览器 FPS，并在页面写了制作方法。缺口：复刻既有 3D 关卡几何，不是新场景生成。
30. **worker-simulation（孙浩君）** — <https://github.com/itsunhao/worker-simulation>。tank-battle-3d README 明确把它的自由模式当作城市道路、街区建筑与沥青/铺装渲染的参照；Three.js 第三人称 3D 城市含昼夜同步、街灯、AI 生成街景贴图，MIT。缺口：AI 代码参与未披露；无在线 demo。
31. **Escape from Dogov** — <https://jason-c-dev.github.io/escape-from-dogov/>。同 jason-c-dev 的俯视撤离射击：Mudflats/Scrapyard/City 三图由手工街区块加种子拼合，每图独立 time of day 与 per-map lighting，全部资产代码生成。缺口：README 未写 AI 分工，需向作者核。
32. **ARRR（arrr.fun）** — <https://play.arrr.fun>。Mecha Royale 所用 arrr-network 同作者 bboym0de/m0dE 的浏览器海盗 MMO：程序化生成多座城镇、约 5MB 纯代码无图片/模型/音频资产，社区在 Bounty Board 投票后由 Fable agents 提 PR。缺口：仓库无公开静态截图且有 $ARRR 代币，成本/合规需先核。
33. **Flyover** — <https://flyover.gg>。FLY SF 同一作者 alistairmcleay 仍在运营的主版本，浏览器里飞真实城市并空战，代码内置晴/阴/雨天气档与太阳强度、日落色、雾参数。缺口：真实城市 3D Tiles，不是 AI 生成/可改场景。

## 6. 丁级：按任务排除规则不计入候选（14 项）

1. **《旅行家：后日时光》** — <https://store.steampowered.com/app/4838820/>。Steam 免费 Demo（2026-06-12，App 4838820）是 2D 氛围挂机游戏，带日夜动态光照与天气；Steam 披露用生成式 AI 辅助美术/音乐，作者自述后期 Godot+Codex 做到 5:95，成本约 400 元工具订阅；但引擎口径冲突（部分报道称 UE5、复盘称 Godot），且是 2D 场景，三维建筑/道路/植被覆盖弱。过程报道 <https://caifuhao.eastmoney.com/news/20260914120223459221770>。
2. **《逃离永明岛》** — <https://store.steampowered.com/app/3210830/>。一人工作室的 2.5D 横轴叙事冒险（Steam 免费 Demo，App 3210830，正式版 2025-07-31）；场景美术篇 <https://game.3loumao.org/699044892> 记录单张海边步道用 Midjourney 生成约 240 张候选、Photoshop 生成式填充修图并手工拆前后景、Spine 做树枝风动、Godot ParallaxLayer 做视差、开源 God Rays 与 Cosine water 着色器由 Claude 改参数。2D 场景，三维覆盖弱，只作“分层＋光照/水面 shader 二改”机制参考。
3. **Raccoon Heist** — <https://simonw.github.io/raccoon-heist/>。夜间郊区场景完整（三栋亮窗房屋、街道、围栏、垃圾桶、树、月亮/星星/萤火虫/雾，守卫手电锥、警车灯扫、黎明渐亮），notes 记录首屏“太暗”→调亮并降低机位、黎明失败重开仍保留白天天空的状态 bug、移动端 DPR 让画面只渲染左上四分之一；作者明说单提示生成。按“工具 showcase 不收”只作反例与细节参考。
4. **Skyfall Protocol** — <https://a7ul.github.io/skyfall/>。自述 fully vibe-coded，WebGPU/Three.js，Lyon 2023 photomesh 城市＋HDR 天空、城市/光照/粒子同栈渲染；但需自行把地图 ZIP 放进 Chrome 授权目录，城市主要是背景而非可行走组合，桌面 Chrome 限定、无 WebGL 回退，低优先。
5. **godogen** — <https://github.com/htdt/godogen>。MIT 开源、约 7.3k star（2026-11-04 GitHub API 7,287）的 Claude Code/Codex 游戏生成脚手架，支持 Godot/Bevy/Babylon.js/three.js；关键做法是让 agent 跑引擎、截帧、看截图再修可见问题。是工具，不是作品候选。
6. **San Francisco -- The Game** — <https://sf.thijs.gg/>。浏览器里用 Apple Maps 3D 摄影测量数据重建整座旧金山，约 400 MB 首载、tile streaming/LOD，可步行、滑翔、开车；未核到 AI 编写证据与作者制作过程，只作“现成地图数据＋程序流送”路线参考。
7. **Ink Armada** — <https://intelligenttools.co/play/ink-armada>。Spring Rider 同作者、同站 Margin Games 的另一作：整场海战用 Canvas 2D 模拟圆珠笔线条、零图片资产，并附完整制作文；但为 2D，不是 3D 场景光照。
8. **Panache** — <https://menufactory43.github.io/panache/>。Battle Drones 的法国 Belle Époque 重制分支：单位/建筑全部换新 3D 模型，音效、音乐、片头、UI 与战役重做；Battle Drones 在本任务排除名单内，派生作不计。
9. **Tree Appreciator** — <https://tools.simonwillison.net/tree-appreciator>。Simon Willison 用 Claude 聊天一次成型的 three.js 小游戏：同一种子生成两棵树、在金色时刻光照下找差异；一次生图/极小工具，不计。
10. **meep engine** — <https://meep.company-named.com/>。Nekomancer/Old Circle 共用的 ECS/WebGPU 引擎，产品页列出 clustered lights、shadows、volumetric GI、decals、fog 与 Shade 渲染器；引擎不是作品。
11. **SupaVoxel** — <https://supavoxel.com/>。同一张建筑照片下 Meshy 7.1 编造未见过的背面并把车/树熔进单一网格，SupaVoxel 输出带干净底座的建筑，1.5M vs 6.1M 三角形、15.2MB vs 184.9MB；是工具对照，不是游戏。
12. **Tencent Hunyuan 3D** — <https://3d.hunyuan.tencent.com/>。Lindenwood 对照研究用 Meshy 6 与 Hunyuan 3D 做酒馆场景；工具页只有 JS 壳，未列为作品。
13. **Shade（Usnul）** — <https://discourse.threejs.org/t/shade-webgpu-graphics/66969>。three.js 论坛多灯阴影帖作者自研的 WebGPU 引擎，演示 130 个带阴影点光、129 光源 Bistro 场景；技术证据，不是 AI 游戏。
14. **Type PAL（仙剑奇侠传 TypeScript 重写）** — <https://pal.illegalscreed.cn/>。中文作者用 AI 编程助手从零重写的可通关《仙剑奇侠传》，README 写明 AGENTS.md 任务卡／单一编码负责人／独立验收流程，并带地图与场景可视化编辑器；2D 320×200 索引色，不属于光照场景。

## 7. 真实使用问题证据（9 条）

1. **Capybara 城市为何手工搭（作者原帖＋36kr 转述）** — 作者原帖经 Arctic Shift 读取：<https://arctic-shift.photon-reddit.com/api/posts/ids?ids=1urz4mc>（见 §3.1）；36kr 转述 <https://eu.36kr.com/en/p/3896358295029383>。AI 生成整城“难以精确控制每栋建筑位置”、近看模型掉质量、整块地图难优化；Claude 先做地形编辑/材质绘制/自动道路/物件摆放工具，作者再手动摆城；2–3 个并行会话、约两周（36kr/Reddit；Medium 标题写 15 天，全文未读），工具增量支出口径见 §3.1。
2. **Three.js 灯光坑：OpenMMO devlog 2026-06-23** — <https://github.com/Julian-adv/OpenMMO/blob/master/doc/devlog/2026-06-23.md>。切换灯的 `castShadow` 或增删灯会让 Three.js 重编译所有材质 shader，卡数秒；解法是固定数量点光灯池，每帧只改位置与强度。
3. **程序化建筑光照：Unity Discussions** — <https://discussions.unity.com/t/lighting-in-procedural-game/1700644>。2025-12-18 原求助帖：运行时生成办公室，点/聚光灯多到报警、只开局部灯长廊仍暗、全开掉帧、换单方向光阴影差；回复给出按 prefab 烘焙、spot 替代 point、URP Forward+/Deferred+、远景灯 LOD 与不接收阴影材质。
4. **Three.js 阴影性能：issue #30065** — <https://github.com/mrdoob/three.js/issues/30065>。WebGPURenderer 阴影路径每帧对每个对象做 cache-key 检查，报告约 30% 掉帧（30–40 FPS），2025-01 在 r173 修复；选 WebGPU 阴影方案前先核版本。
5. **多灯方案：three.js forum 131 灯** — <https://discourse.threejs.org/t/large-number-of-shadows-webgpu/91223>。2026-04 的 131 灯（1 方向＋130 点）实测：所有阴影共用一张 atlas，按屏幕覆盖每帧打分、固定更新预算、逐灯自适应分辨率（32–1024）；说明 three.js 无内置灯数上限，但需要自建调度。
6. **Godot GI 回归：issue #115599** — <https://github.com/godotengine/godot/issues/115599>。2026-01 报告升级 4.6 后 VoxelGI/SDFGI 质量明显下降、内置天空与环境光异常；维护者只复现天空部分，4.6.1 部分修复仍见 banding。室外大场景 GI 锁版本并保留 4.5 对照。
7. **Unity Asset Store “Dark City”评价** — <https://assetstore.unity.com/packages/3d/environments/urban/dark-city-9905/reviews>。买家原评价：URP 下“几乎每个 prefab/材质都坏”、Standard 材质全粉、demo 场景只剩外墙和灯光、prefab 损坏、脚本过时。
8. **AI 场景资产交接：Lindenwood 酒馆研究** — <https://digitalcommons.lindenwood.edu/faculty-research-papers/813/>。同一酒馆场景人工 vs Meshy 6＋Hunyuan 3D：AI 238 分钟 vs 人工 716 分钟，但 AI 32,781,505 三角面 vs 人工 293,828 三角面（人工场景 141,008 面），并出现 UV 破碎、摆放穿插、减面掉贴图；结论仍是人做拓扑/UV/材质/引擎验收。
9. **AI 建筑资产边界：Meshy 建筑照片转 3D 实测** — <https://normal-map-generator.github.io/reviews/meshy-building-photo-to-3d-back-side/>。建筑照片转 3D：相机没拍到的背面/屋顶靠编，窗排各自倾斜、噪声三角形跨窗，605 万面、184.9 MB；作者结论是 Meshy 强在拍到的立面，转过就不可用。

## 8. 读不到的渠道与原因

按渠道归并；以下均为实际尝试后失败，未换身份、未绕过访问控制，摘要只作线索。

- **Reddit 直连与 JSON**：`www.reddit.com` 返回 403 Blocked，`search.json` 403，`r.jina.ai` 代理 socket closed；Capybara、Civitas、Mecha Royale、I Just Wanted to Fish 的正文均经 Arctic Shift 归档 API 读到（评论树未读）；Take One 等原帖仍未读。
- **X/Twitter 与 Threads**：登录墙或 HTTP 402；`xcancel`、`nitter`、`threadreaderapp`、`r.jina.ai` 均 TLS 握手失败；只能读单条 status 页的 `og:description`（FxTwitter/syndication），无法枚举作者时间线。Sunset City、Eyrie、Tiny Skies、西出阳关、小王子、台北狂飙的 X 原帖只到链接级；Capybara 的过程长帖经 Reddit 归档读到，Medium 全文未读。
- **Medium**：`medium.com` 与 `leocoout.medium.com` 连接被拦（curl 000），Capybara 文章全文未读；Reddit 正文已给出完整 URL。
- **itch.io**：本机 DNS 把 itch.io 解析到内网拦截地址，TLS 握手失败；WebFetch 返回 Socket closed；XENOFARM、Bring Them Home 的正文、标签、评论、作者页与 jam 邻居均未读。
- **Vercel 托管游戏页**：`tinyskies.vercel.app`、`hexaera.vercel.app`、`fantos-megamart.vercel.app`、`take-one-bay.vercel.app`、`lift-and-coast.vercel.app` 均 000/TLS 失败或证书 altname 不匹配（`*.internet.org`），Tiny Skies、Hexaera、Fanto's Mega-Mart 未作为候选。
- **Steam 部分页面**：`store.steampowered.com/app/4271560` 与 appdetails 跳首页/`success=false`，SteamDB 403；Field of Command 的发行日期与 AI 披露未取；部分页面只读到标题/标签/发售日，截图库与完整评测未展开。
- **YouTube**：`youtube.com/@Southers15`、`@fieldcraftgames`、`@supertommy` 连接被拦（000），devlog/实机录像未看。
- **搜索引擎**：WebSearch 会话 200/200 配额用尽；Google、DuckDuckGo HTML、Brave 返回 000；Bing 对稀有词只给中文词典/地区过滤页；Lobsters 搜索 400（unpermitted query）、PullPush 521、archive.org 与 Wayback 000；无法再用关键词补作者 devlog。
- **中文渠道**：微信公众号多篇“环境异常”验证页（Kimi K3 3D、老刘 GPT6 东北老街、小王子、Musk Escape Mars），改用 36kr/搜狐/东方财富/网易转载；小红书登录墙/“页面不见了”；indienova 部分 403；uisdc 403；nextgz 证书过期；即刻仅摘要；B 站只给标题/简介/发布日期，未加载播放器与画面；B 站作者空间 API 返回 -799。
- **论坛与商店**：Unity Discussions 用户资料 `vintz_777`、`DevDunk` 403；Godot issue 评论区 REST 403、网页为 React 渲染；Unity Asset Store 只读到前 10 条评价；Lindenwood PDF 有人机验证，只读摘要页。
- **GitHub 与索引**：REST API 未认证 60 次/小时限流（共享出口 IP），topic/repo 元数据查询多次中断，改 raw、`commits.atom`、网页 HTML；部分仓库只看到第一页，精确创建时间/star 未取；`/trending/gamedev` 不是有效分类。
- **官方奖项**：`vibejam.com/2026` 是未执行 JS 的首屏，显示 0 GAMES SUBMITTED；`/api` 无 winners/final_rank 字段，`/winners`、`/leaderboard`、`/results` 均 404；官方 `/2026/cache/games-*.js` 有 `final_rank` 与 `award`，本清单名次以它为准（官方 API 为 945 件）；GamesByAI 与中文技术地图若冲突不改用。
- **其他**：Nekomancer 开发构建 401；globalgamejam.org、labs.sntx.co Cloudflare 403；`flyover.gg` 主域被 WebFetch 域名安全校验拦截；`alexandre-grisey.fr` 仅 JS 空壳；Kanso/Null Range 站点为纯 JS bundle，无服务端 credits。

## 9. 交给 dot 的试玩与二改问题

**先核源，再看效果。** 观看只能检验连续区域的表现，不能证明内容由谁摆放、生成器是否复用或改动成本。下面把已有静态机制、待观察问题与现案例的验证分开；尚未接入、运行或判优。

- **Capybara**：作者原帖说明整城一次生成难以细改，改为地形/道路/物件编辑器后手工摆城。试玩时沿主街到城市边缘看材质、地标与密度是否维持统一身份；手工与程序的分工以作者过程为据，不从画面猜。可借编辑器和程序道路的边界，不能把重度手工摆城包装成无人工美术修补的自动生产路线；代码/资产许可未知，不提取资产。
- **backroad rally**：固定源码的 `resolveCondition` 按 defaults → condition → stage override → weather 组合太阳、天空、雾、后期、材质参数与车灯；UE5→Web 表另把生成源、转换器、导出物分开。先据代码列“换时段不需重做的几何”与需改配置，再在同一赛道看下午/雨夜的路沿可读性及连续场景一致性，不把引擎迁移成本当换主题成本。
- **Long Wind**：固定 `src/levels/index.js` 将每章定义为 layout、terrain、biome、env、waves 等数据，`runtime.js` 共用灯笼、闪电与章节流转；章内是否另换地形/植被模块仍要追相应源文件，不能概括成“全都只换参数”。试玩时对照三章的近中远景、植被密度与战斗可读性。Tripo 角色模型与 Mixamo 动捕不在 MIT 内，不作为可直接复用的素材。

**在现案例验证的一个问题：** 在 Star 的同一段路线和几何、碰撞、驾驶逻辑不变时，将太阳、天空/环境光、雾、后期和材质调色集中成一份成套氛围预设。仅作为后续旁置候选，按现有串行拍摄规则取得同机位图及完整连续路段，再判断整层修改是否改善空间层次且不遮路沿/制动线索。不为本来源卡立即增加出图任务，也不改现有默认。

固定来源与核实（2026-11-04）：[backroad 条件组合源码](https://github.com/jason-c-dev/backroad-rally/blob/e5542f96b9a9a2912fdaa160396054e81f022f23/src/look/conditions.ts)、[转换与源文件清单](https://github.com/jason-c-dev/backroad-rally/blob/e5542f96b9a9a2912fdaa160396054e81f022f23/docs/making-of/04-the-web-port.md)、[成本原文](https://github.com/jason-c-dev/backroad-rally/blob/e5542f96b9a9a2912fdaa160396054e81f022f23/docs/making-of/09-by-the-numbers.md)；[Long Wind 章节定义](https://github.com/jbang2004/long-wind/blob/9390889b7b293c9f983dca7e1b1ef4e629274009/src/levels/index.js)、[共用运行模块](https://github.com/jbang2004/long-wind/blob/9390889b7b293c9f983dca7e1b1ef4e629274009/src/levels/runtime.js)、[资产许可边界](https://github.com/jbang2004/long-wind/blob/9390889b7b293c9f983dca7e1b1ef4e629274009/CREDITS.md)；[Capybara 作者原帖同作者交叉发布](https://www.reddit.com/r/ClaudeAI/comments/1urzr1q/i_just_made_25k_usd_with_my_capybara_game_built/)（文本可读取，浏览器视频被拦）。

## 10. 排重、已核与未核

- **排重**：对照 `domains/game-dev/README.md` 的“用 AI 做游戏”表（Riposte、Formula Minus One、DragonScape Idle、Battle Drones、pxl）、`docs/research/2026-10-23-game-worth-trying.md` 与旧 `B-AI-GAME-SUPPLY-SOURCES-20261027` 的完整产物（git `a2f02d7c`）；本清单未重复任务排除名单的 16 项。旧 supply §4 已收录 **City 2026**（同一 `dator.dev/city2026`、HN 49977886，现入口 <https://city2026.app/play/>、根域 <https://city2026.app/>）并明确“只保留为反例，不进入候选清单”；本清单不再计入候选，只留链接，并沿用其许可结论：代码生成的 3D／矢量与 GPT Image 2 位图无独立许可，CC 授权的音乐/音效可按相应 CC 条款复用。Spring Rider 已在 `docs/research/2026-10-14-game-wp6-audio.md` 作为音效案例出现，本卡只补场景角度并明确标注，不当作完全新作品。
- **合并的重复链接**：西出阳关（X 原帖＋jxxy 中文拆解）、tank-battle-3d（GitHub＋Gitee 镜像）各并作一项，链接都保留。
- **已核**：84 个收录项逐项做了主链接状态码核对；除深城纪外，其余收录项的主链接本次均可打开。深城纪的 GitHub 仓库可打开，但可玩演示 `shenchengji.gtasz.workers.dev` 返回 000，可玩性未验。Reddit/HN/Medium 等作者过程页有 403/000，已列入 §8。标题与页面内容只抽查，未逐页核对。作者静态图原链已在 Capybara、backroad rally、Long Wind、Sunset City、云海神殿等项给出；其余标注为仓库相对路径或缺失。
- **成本口径**：backroad 的 Claude 月费、API 等价及音频支出缺口见 §3.2，Capybara 工具增量支出见 §3.1；Spring Rider 按 API 标价估算约 $222（非订阅支出）；I Just Wanted to Fish 作者自报总支出 $900–950（约 3 个月）。这些口径不同，均未计人工工时，不能横向当完整项目成本比较。
- **未核**：作者真实身份（多为 handle）、完整游玩回路、帧率与手感、模型/引擎版本逐项、资产逐件许可、跨平台可玩性。上述都留给 dot 试玩或后续核读，不在本产物里写成已知。
- **跨卡**：四项作者原 README 为 [Neon Zenith](https://github.com/billpwchan/neon-zenith/blob/main/README.md)、[Halcyon](https://github.com/billpwchan/halcyon/blob/main/README.md)、[Sakura Fantasy](https://github.com/billpwchan/sakura-fantasy/blob/main/README.md)、[Utsuroi](https://github.com/billpwchan/utsuroi/blob/main/README.md)。已核原页与相应作品入口对应；原采集所称本地副本未随本卡提交，不作为交付证据。这四项归本卡的场景光照线索，分别列于 §4.1 与 §5；其他卡若引用只留转交链接，不重复计数。

## 原始采集回执

实际渠道：Vibe Jam 官方 API/静态文件、GitHub HTML/raw/`commits.atom`、HN Algolia、three.js 与 Unity Discourse 的 `.json`、Steam appdetails/ISteamNews、作者博客与中文媒体、X 单条 status 页、Reddit Arctic Shift 归档。实际搜索词覆盖 Vibe Jam 2026 winners／best art direction／most polished、各作品名＋devlog/making-of、作者 handle、中文“AI 做游戏 场景 光照 建筑 道路 植被 程序化生成”等。读取截止 2026-11-04；未启动游戏、未看实机、未打开浏览器、未评水平。搜索配额 200/200 用尽后改用直取 URL、API 与站点 HTML。

## 接收范围（2026-11-04 窄修）

本文件接收为三项待试玩来源及其余待核线索；可核的成套氛围配置机制已并入[现有材质与特效制作链页](../../../../../domains/game-dev/assets/materials.md#scene-atmosphere-revision)，不是完成实例研究。负责人核对作者原文、许可/成本口径与上述固定源码；未试玩、未看完实机、未试听，也未对现案例实施或确认改善。

实际尝试：Capybara 作者 Reddit 视频原页被网络安全拦截；[Long Wind 作者 B 站页](https://www.bilibili.com/video/BV1FTaa66EPM/)可打开，页面显示 03:31，但播放器报“无法播放媒体”。两处均已停止，未绕过，视频是否完整无剪辑仍未知。现有云端 WebGL2 能力限制沿游戏细则 §7 处理，本卡不重复启动游戏、不抢占已有本机拍摄。恢复需可用且已授权的运行环境，或能正常播放的完整连续实机；届时按实例 Skill 补实际体验、截图与可借方法的现案例验证。
