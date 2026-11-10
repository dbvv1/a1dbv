# FPS 完整动作供给：KayKit / Quaternius 两组候选与缺口决定

> 任务：B-FPS-COMPLETE-ACTION-SOURCE-20261110。固定输入：FPS-Like `78a892c6cf057ddb63b4fc21daafdd7e4313453a` 的 `asset-pipeline/character-action-sources` 与 `2e770621a6764bae43d68c1e4f33d28105dd0cf0` 的 `docs/skinned-character-consumer.md`。整理日期：2026-11-10。
>
> 本文只整理本任务已核候选与收集记录，不新增未核实链接。证据级：**A**＝作者原页/官方仓库/包内许可原文已读；**B**＝官方包字节解析/固定文件身份/逐 clip 清单实测；**C**＝社区、独立评测、issue/PR 原文，作交叉证据；**D**＝仅搜索摘要、镜像清单或未读页面，只作线索，不作许可或动作事实。
>
> 本单元只读固定本地包、作者原页与官方示例；本次修订重算了 Knight、Med_CombatRanged、Med_MovementAdvanced、UAL1 免费 Standard、sketchpunk 8 包、tps-demo、查看器 `index.pck`、Animated Guns zip/FBX 与 BAMEN 字节；未播放预览，未开浏览器/GPU。未逐项复算的 B 级数值在 §7 标明；A 级页面事实在 2026-11-10 复核（curl 官方页与 Defold 官方示例，HTTP 200）。

## 0. 决定

**本卡没有可采用的完整免费供给；保留 FPS 原角色，不换供给，不新建 IK 控制器。**

两组正式候选都只到“部分动作 + 无枪/弹匣独立节点与接触”：

| 候选 | 持枪 idle | 持枪移动 | 开火 | 完整 reload | 枪/弹匣独立节点 | 手—枪/手—弹匣接触 | 判定 |
|---|---|---|---|---|---|---|---|
| KayKit Character Animations 1.1 / Adventurers / Skeletons | 部分/待验：无放松持枪 idle（Skeletons 全清单与 Adventurers 76 clip 都没有 `Idle_HoldingRifle`）；`2H_Ranged_Aiming`（Knight）1.600 s / `Ranged_2H_Aiming`（Med）1.633 s（49 帧）可作 ADS/站立持枪候选，未播放验证 | 部分：`Running_HoldingRifle` 仅在 Character Animations 的 `Med_MovementAdvanced.glb`（sketchpunk/GeorgeQLe 再导出），Adventurers/Skeletons 未核到；`Walking_HoldingRifle` 与持枪 strafe 缺 | 部分/待核：镜像与再导出清单有 `Ranged_2H_Shoot` / `Ranged_2H_Shooting`；官方免费档是否含 CombatRanged 未验证 | 部分/待核：镜像与再导出清单有 `Ranged_2H_Reload` 1.6333 s；官方免费档是否含 CombatRanged 未验证 | 无：只有 `handslot.l/r`，无枪、弹匣、手指骨 | 无：没有枪/弹匣网格，无法验证 | 第一候选，身体层最近；持枪跑仅在 Character Animations 再导出且当前消费者未映射，不是完整供给 |
| Quaternius UAL1 免费 Standard | 缺：只有 `Pistol_Idle_Loop`，无 rifle idle | 缺：只有手枪 `Pistol_*`；无 rifle 持枪移动 | 部分：`Pistol_Shoot`，无 rifle shoot | 部分：`Pistol_Reload`，无 rifle reload | 角色无；`Animated Guns` 武器侧有 `Magazine/Magazine_end`（P90/Pistol/Rifle/SniperRifle）、`Slide`（仅 Pistol）、`Trigger`（各枪） | 角色无；武器侧只有枪件自身运动 | 第二候选，免费层无步枪 |
| Quaternius UAL2 / Toon Shooter / Ultimate Modular Men | 部分/未核：Toon Shooter 有 `Idle`/`Idle_Shoot`，Modular Men 有 `Idle_Gun`；未逐帧确认是否为持枪 idle | 部分：`Walk_Shoot`/`Run_Shoot` 等 | 有枪械开火变体，但无完整枪套 | 缺：均无 reload | 无；Toon Shooter 的枪是单 mesh 节点 | 无 | 同风格 fallback，不满足四动作 |

**为什么不是“再补一组”**：任务限定候选最多 2 组。既有锁定包里确实有更接近的身体层（Mesh2Motion 有四动作但无枪/弹匣；Red Eclipse 有真实 rifle reload 但 CC BY-SA/IQM；FPS-Arms-3D 有第一人称枪手/弹匣但无全身），它们都不满足“完整供给”的硬门槛，故只作 §3.3 证据，不升级为第三组。

## 1. 筛选口径

| 维度 | 入候选条件 | 本次怎么核 |
|---|---|---|
| 许可 | 免费、可商用、允许把派生资源随公开游戏提交；能读到作者原页或包内许可原文 | 作者页/仓库 LICENSE/包内 License.txt；区分 CC0、CC-BY、CC-BY-SA、NC/ND、EULA、自定义禁止再分发 |
| 动作 | 同一骨架具备持枪 idle、持枪移动、开火、至少一种完整 reload；reload 必须是真实 clip，不是整枪位移或视频 | 官方页清单 + GLB/GLTF/FBX/ZIP 字节解析；搜索摘要不算 |
| 结构 | 全身骨架 + 手臂蒙皮 + 独立枪节点 + 独立弹匣节点 + 稳定握点/接触相位 | 节点名、skin、mesh、clip 通道；没有独立弹匣骨就记为缺 |
| 接入 | 同 rig 或同名骨，不重刷权重、不手补动画，能接当前 Three 0.186.1 与固定步长 | 对照 FPS-Like `docs/skinned-character-consumer.md` 的现有动作映射与父节点合同 |
| 预算 | 三角面、材质、贴图、关节数可核 | GLB JSON chunk / 官方页；无实测的写“未核” |
| 证据 | A/B 级才能进入“确有”判定；C 级只作交叉；D 级只作线索 | 逐项标证据级 |

排序权重：**许可可随公开游戏提交（硬门槛） > 四动作覆盖 > 枪/弹匣独立节点与接触 > 不重刷权重/不手补动画的接入成本**。付费、需登录、许可禁止再分发或文件当前不可取的条目只作对照，不参与“可入候选”排序。

## 2. 渠道覆盖表

本清单保留**约 274 条候选条目**（来自任务给定的已核候选清单，含同族/重复页面；按 URL/模型 UID 合并后少于此数）。渠道行之间有重叠，下表不是严格分区计数；“得到”只表示该渠道实际读过并仍保留的条目数，失败项不计入。逐条读不到记录见任务收集记录，本表按族汇总。

| # | 渠道/来源族 | 实际看了什么、怎么取 | 得到（约） | 读不到/限制 | 对本卡的结论 |
|---:|---|---|---:|---|---|
| 1 | 目标仓与固定本地包 | FPS-Like `78a892c` 的 `sources.md`、`LICENSES.md`、`CPU-PARSE.md`、`sample/kaykit/PROVENANCE.md` 与 4 个 GLB；`2e77062` 的 `skinned-character-consumer.md`；只读 | 2 份固定包 + 4 个 GLB | 旧 `sources.md` 的 432 条链接未逐条复验；a1dbv 正文本地 grep 只覆盖工作树文档 | 确认现有消费者只映射两类 reload，未接枪/弹匣；这是缺口基线，不是新资产 |
| 2 | KayKit 作者官方/同系列 | `kaylousberg.com` 的 Character Animations、Adventurers、Skeletons、Complete Collection、Patreon 页；官方 GitHub org、Adventurers/Skeletons repo、LICENSE.txt；OGA 1.2 上传；官方预览图 | 14 | `kaylousberg.itch.io` 全部页面 TLS exit 35/000，WebFetch Socket closed；YouTube 预览 000；161/133/131/139 口径各异：161（itch）与 133（官网）是作者页宣传总数，不保证含/不含 T-Pose；131 是 BINX 在 Free 1.1 GLB 中数出的 Rig_Medium 去 T-Pose 唯一名；139 是 sketchpunk 8 个 `Med_*.glb` 的条目数（每包含 T-Pose，去重 132 名）；GeorgeQLe 的 Rig_Medium/Large 文件合计 111 条 | 第一候选；CC0 已核，身体层最近；官方 1.1 免费档逐 clip 与版本仍未直读 |
| 3 | Quaternius 作者官方 | `quaternius.com` 的 UAL、UAL2、Animated Guns、Toon Shooter、Ultimate Modular Men、Universal Base Characters、Ultimate Guns、Zombie、Ultimate Animated Character、license、animviewer、tutorials 页；官方 GitHub 站点源码；OGA 作者上传；Godot Asset Store | 20 | 官方 itch TLS/000；Google Drive 文件夹可读但每文件 2,040 B “Quota exceeded”；查看器 pck 实际在站点根 `index.pck`，本次已复算 126/134 个唯一 clip 名 | 第二候选；免费 UAL1 只有手枪，Animated Guns 仅武器侧；QAL v1.0 再分发冲突 |
| 4 | OpenGameArt（非 KayKit/Quaternius） | 高级搜索 keys=reload/rifle/fps/weapon/arms；作者页：MilitaryG、CoinCoin、zisongbr、taradavies、CuIGames P50/A5/R90、fps-arms-rigged-only 等 | 12 | WebFetch 对部分页 403，改 curl + 桌面 UA；R90/A5/P50 文件区标 “currently unavailable due to potential licensing issues” | 武器侧与第一人称手臂的主要免费来源；没有完整全身步枪动作 |
| 5 | GitHub 源码/README/API | Operation Steel Tide、Red Eclipse、ZenXChaos、BigAndCrispy、FPS-Arms-3D、Mesh2Motion、Godot tps-demo、Unity FPSSample、cktang88/3d-fps、shardline、KayKit org、Quaternius site 等 90+ 仓库；raw/HTML/clone | 60 | 未认证 REST API 403 rate limit；issues/PR 评论部分未读完；代码搜索未做全 GitHub | 核许可、核 clip 名、找可再分发结构的主渠道；二次组装不等于作者原页 |
| 6 | Sketchfab / Poly Pizza / 3DAssets.dev | Sketchfab `/v3/search`、`/v3/models`、作者目录；Poly Pizza 模型页与 J-Toastie AKM/Glock；3DAssets.dev 武器包 | 35 | Sketchfab 下载端点匿名 401（需登录）；HTML 页后段 202/0 字节；评论 API 404；Poly Pizza 模型页 JS 渲染 | 大量 CC BY 第一人称枪手/弹匣参照；本卡不登录，故只作接触证据 |
| 7 | Unity Asset Store / Fab / Epic | KINEMATION、Kubold、Infima、CombatGirls、RIB、MoCap Online、Epic samples、Paragon 等商品页与站内搜索；Fab JSON-LD/搜索 API | 50 | 多数需 Epic/Unity 登录；页面为 JS 壳；License terms 字段常为空；未购买、未下载 | 付费/EULA 对照，不能随公开仓库提交；是“完整度标尺”，不是来源 |
| 8 | Kubold / Kevin Iglesias / MoCap Online / ActorCore / Rokoko / mocapdata / Truebones | Kubold downloads 与动作清单 PDF；Kevin Iglesias 清单 PDF；MoCap Online Rifle/free/UE4 demo；ActorCore free；Rokoko；mocapdata；Truebones | 20 | MoCap Online 429；ActorCore/mocapdata/Truebones SPA 或 Socket closed；Rokoko 需表单；价格/许可未逐项核 | Kubold/Kevin 是完整步枪动作的付费基准；MoCap Online Rifle 390 clip 是完整度上限；均不可再分发 |
| 9 | Godot / Defold / 论坛 / issue | Godot 论坛 130611/128792/133195/134824/132458/133301；Defold 官方 3d_animations 示例；Godot issue #53544；Unity Discussions CC0 帖；GitHub issue/PR 12 个 | 25 | 部分论坛页 429/需登录；GitHub API 限流；Discord 未进 | 导入/重定向/着地/手挂点的真实坑；Defold 官方 45 条清单独立证明 UAL1 免费层只有手枪 |
| 10 | 中文社区 | B 站课程、知乎、掘金、CSDN、博客园、indienova、腾讯云、vfxcg、什么值得买、今日头条、小红书相关帖 | 30 | 知乎/微信/B 站多处 403、412、验证码、页面不存在；多数只有搜索摘要 | 方法/教程/踩坑可参考；没有新的可引用原始素材页；CombatGirls 转载许可不明 |
| 11 | 英文社区/媒体/评测 | Reddit、HN、YouTube、80.lv、DigitalProduction、Cinevva、BINX Forge、Game World Observer | 15 | Reddit TLS/bot 校验；YouTube 000；HN 无相关讨论；80.lv 一次 404 | 独立评测确认 UAL2 是 placeholder 与成品之间；YouTube 预览未看 |
| 12 | 搜索引擎 | WebSearch 中英文约 200 组；DuckDuckGo/Bing/Marginalia/Google 兜底 | 0（只提供线索） | 本会话 WebSearch 200/200 用尽；DDG/Bing/Marginalia TLS/无关结果；Google 000 | 搜索预算耗尽后改用作者页、OGA、GitHub、商店 API；未再扩新关键词 |
| 13 | AI/生成研究 | SCAIL-1/2、Wan-Animate-2、Wan2.2、mixamo-llm-mocap、PAMI、Kimodo、ARDY、Uthana、GVHMR、WHAM、SOMA-X、MoCha、InterAct、FrankenMotion、BONES-SEED | 15 | HuggingFace 000；Tripo/Meshy TLS/socket；PAMI 代码/权重未发布；输出多为视频/NPZ，不是可编辑骨骼 clip | 只能补缺口或预演，不是现成 FPS 动作供给 |
| 14 | 动捕数据 | 100STYLE、CMU、LAFAN1、Rocketbox、Ready Player Me、ACCAD、Xsens | 8 | Zenodo 403；CMU 云环境不可达，改用镜像；LAFAN1 CC BY-NC-ND | 只能补 locomotion/蹲/转身，全部无枪/换弹 |
| 15 | 聚合索引/awesome/GitHub topic | Calinou/awesome-gamedev、killop/anything_about_game、devanshutak25/3d-resources、topic game-assets/character-animation、Drawcall Market 索引 | 6 | 头部 topic 多为 AI 工具/引擎样例；3d-resources 只是索引 | 对本卡几乎零产出；没有可用的完整 FPS 动作包 |

### 2.1 读不到渠道汇总

“读不到”保留原因，不当作“没有”。以下按族汇总，逐项记录见任务收集记录。

| 渠道/入口 | 原因 | 影响的判断 |
|---|---|---|
| itch.io 全域（`kaylousberg.itch.io`、`quaternius.itch.io`、`tomazod.itch.io`、`cuigames.itch.io`、`kevdev.itch.io`） | 本机 schannel/TLS 握手失败（exit 35/000）、WebFetch Socket closed、429；translate.goog 仅部分读到 KayKit/UAL 主页与 devlog | KayKit 1.1 的 161/逐 clip/免费与 Source 分档、UAL 的 Standard/Pro/Source 价格、Tomazod 102 条全量、CuiGames 原包均未直读；不能用 itch 事实作“确有” |
| YouTube 预览（KayKit `zSzzEmdIiXI`、Quaternius `-VXFlXhvD6A`） | curl 000/exit 35；只取到 oEmbed 标题 | 所有姿势、握枪、弹匣接触观感均未验；预览只登记，不作质量证据 |
| Reddit / old.reddit / eddrit | TLS handshake 失败；eddrit 返回 bot 校验页；search.json 非 JSON | 未读任何原帖；社区对 KayKit “basic”、UAL strafe 的讨论未当实测 |
| 知乎 | `zhuanlan.zhihu.com`、`www.zhihu.com` 直连 403 | Mixamo 入门、Bevy 第三人称、多人射击/TPS 动画、独立游戏美术等只有摘要 |
| 微信公众号 | `mp.weixin.qq.com` 触发“环境异常/完成验证后继续访问” | Universal Animation Library 与 KayKit 两篇原文未读 |
| B 站 | 视频页 412/反爬 HTML/“视频不见了”/验证码 | 课程目录可从标题与页面元数据看，但简介、置顶资源链接、视频内容未核 |
| 小红书 | 两篇素材推荐笔记“页面不见了” | 未读正文 |
| Google Drive | 文件夹列表可读，每个文件返回 2,040 B HTML “Quota exceeded” | Toon Shooter、Animated Guns、Ultimate Modular Men、Universal Base Characters 官方 zip 未取得；改用 OGA 作者上传与 Godot 商店 |
| Sketchfab 下载/评论 | `/v3/models/{uid}/download` 401（需登录）；HTML 202/0；comments 404 | 逐模型 clip 名、骨架、弹匣节点多数未实测；只取元数据与描述 |
| GitHub REST API / code search | 未认证 403 rate limit（60/60）；WebFetch 域名安全校验失败 | 改用 raw.githubusercontent、HTML 树页、blobless clone；未做全 GitHub 代码搜索 |
| WebSearch / DuckDuckGo / Bing / Google / Marginalia | WebSearch 200/200 用尽；DDG TLS 失败；Bing 返回无关中文站/备案页；Google 000；Marginalia bot check | 搜索只提供线索，未再扩新关键词 |
| Zenodo | `/records/8127870` 403 unusual traffic；API 403 | 100STYLE 的 CC BY 4.0 依据作者项目页；数据集许可未直读 |
| Tripo / Meshy / HuggingFace | Tripo schannel TLS 35；Meshy 证书被劫持为无关域名；HF 000 | 2026-09 更新、changelog、SCAIL-2/Wan-Animate-2 权重卡未直读 |
| Fab / Unity Asset Store | 多数 listing 需 Epic/Unity 登录；JS 外壳；License terms 常为空；未购买 | 价格、最终 EULA、逐 clip 清单未逐项核；只能作完整度对照 |
| ActorCore / mocapdata / Rokoko / Truebones | SPA 外壳、表单、429、Socket closed | 免费 motion 包清单、Rifle/Shooter 包、许可未核 |
| mocaponline.com | `/collections/all`、`/products/rifle`、`/products.json` 均 429，Retry-After 60 | 只核到 Unity 商品页（Rifle Hipfire 308748、RIFLE Basic 26676）；逐包清单未读 |
| poly.pizza | 模型/合集页 JS 渲染 | 逐模型动画名与许可未展开；只用于确认 Toon Shooter 模型清单与 CC0 标称 |
| 80.lv / Unreal Marketplace / gamedev.ubersnip.com / kinemation.com / polycount | 80.lv 404；Unreal 403；ubersnip 403；kinemation 占位页/ECONNRESET；polycount 403 | Standard 45 vs Pro 120+ 原文、Fighter 2、ZenXChaos 后续、KINEMATION 官方免费/付费、社区反对意见未读 |
| OpenGameArt 文件区 | CuiGames P50/A5/R90 标 “File(s) currently unavailable due to potential licensing issues”；WebFetch 部分 403 | 页面 clip 清单可读，但当前不能实际下载；原 itch 镜像又不可达 |
| Discord / Adobe Community / Mixamo | Discord 邀请/登录门槛；Adobe Community Socket closed/000；Mixamo 需登录 | KayKit/Quaternius Discord 的 #suggestions/bug、Mixamo 2026 讨论、Mixamo 官方再分发条款未读 |
| 第三方重包/镜像（3DCGHUB、GameAssetsFree、ueassetsfree、getasset.net、91vfx、OpenGameAsset.net、B 站 CombatGirls 分享） | 按任务禁止绕 403/二手重包；许可是二手或不明 | 未采用；CombatGirls 的 B 站“免费分享”实为 BIPER 付费 Unity 资源 |
| CMU / 100STYLE / LAFAN1 | CMU 云环境不可达，改镜像；100STYLE 域名停放；LAFAN1 CC BY-NC-ND | 只能补无武器移动；LAFAN1 明确非商用/禁派生，列负例 |

## 3. 排序总览

排序按“许可硬门槛 > 四动作覆盖 > 枪/弹匣结构 > 接入成本”。**T0 是两组正式候选；T1 是缺口/接触证据，不参与候选排序；T2 是排除项；T3 是方法与社区参考。** 本卡不新增泛工具榜。

### 3.1 T0 · 第一候选：KayKit 官方同系列

| # | 候选（原始链接） | 许可/可得性 | 四动作覆盖与缺口 | 证据级 | 排序理由 |
|---:|---|---|---|---|---|
| 1 | [KayKit Character Animations 官方页](https://kaylousberg.com/game-assets/character-animations) | CC0；FBX/glTF；Rig_Medium 与 Rig_Large | 官方页写 133 Humanoid animations；类别含 General、Movement、Melee、Ranged（1H/2H 的 shooting/aiming/reloading、bow、magic）、Simulation、Special；**未列逐条 clip，未出现 rifle，也未出现 Idle_HoldingRifle/Walking_HoldingRifle** | A（2026-11-10 复核） | 第一候选的许可与类别锚点；证明“有远程 reload”，但不能证明“有持枪 idle/走路” |
| 2 | [KayKit 官方 Character Animations 预览图](https://kaylousberg.com/content/3-game-assets/4-character-animations/character_animations.png) | 官方宣传图 | 收集记录称图中是机器人风格角色，其中一人持枪；不是逐动作图，也不是同机位标准图 | A（图已看，本单元未重开） | 只作来源展示；不能当风格匹配或动作覆盖证据 |
| 3 | [KayKit Adventurers 官方 GitHub repo](https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0) | CC0；官方仓库 | README 写 75 animations；`Knight.glb` 实测 3,659,532 B、SHA-256 `60428e3…`、6,952 tris、1 material、1 张 1024 图集、41 joints、76 clips；含 `1H_Ranged_Aiming/Reload/Shoot/Shooting`、`2H_Ranged_Aiming/Reload/Shoot/Shooting`、`Idle`、`Walking_A/B/C`、`Walking_Backwards`、`Running_A/B`、`Running_Strafe_Left/Right`；**无 `Idle_HoldingRifle`/`Walking_HoldingRifle`，无 Crouching，无枪/弹匣/手指骨，只有 `handslot.l/r`** | A/B | Adventurers 是同骨架身体层最完整的官方包；四动作里 idle/走路缺“持枪”版本 |
| 4 | [KayKit Adventurers LICENSE.txt](https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/blob/main/LICENSE.txt) | CC0 1.0 | 原文允许 personal/educational/commercial 使用，无署名要求；可随公开仓库再分发 | A | 第一候选的许可原文；KayKit 的 CC0 没有 Quaternius 式的再分发冲突 |
| 5 | [KayKit Adventurers 官方角色页](https://kaylousberg.com/game-assets/characters-adventurers) | CC0；FBX/glTF | 5(+3 EXTRA) 角色、25+ 配件、1024 渐变图集；只写 “Basic movement animations included”，完整动作指向 Character Animations；**官方页不再写 75 animations**，与 repo README 的 75 口径不同 | A（2026-11-10 复核） | 说明版本/页面口径会变；采用前必须固定包版本，不能拿旧 README 当当前清单 |
| 6 | [KayKit Skeletons 官方 GitHub repo](https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Skeletons-1.0) | CC0；官方仓库 | 90+ clip 全清单含 `1H_Ranged_Aiming/Shoot/Shooting/Reload`、`2H_Ranged_Aiming/Shoot/Shooting/Reload`；**无 `Idle_HoldingRifle`/`Walking_HoldingRifle`**；同 Rig_Medium | A/B | 敌方供给可复用，但同样缺持枪 idle/走路；不能因为“有 Ranged_Reload”就算完整 |
| 7 | [KayKit Skeletons 官方角色页](https://kaylousberg.com/game-assets/characters-skeletons) | CC0；FBX/glTF | 4(+2 EXTRA) 角色、90+ animations、10+ 配件；页面列出的全清单与 repo 一致；**全清单没有 `HoldingRifle` 或 `Idle_HoldingRifle`** | A（2026-11-10 复核） | 交叉确认 KayKit 的远程动作是通用 ranged，不是步枪持握套 |
| 8 | [KayKit Character Animations 官方 OGA 上传 1.2](https://opengameart.org/content/kaykit-character-animations) | CC0；zip 可下 | 2021 年旧版 1.2：有 Shoot 1h/2h、Continuous Shooting；**无 reload、无持枪 idle**；说明旧版名单不能代表当前 1.1 | A | 旧版反而更缺；不能拿 1.2 证明当前 1.1 的 reload |
| 9 | [GeorgeQLe KayKit 1.1 镜像清单](https://github.com/GeorgeQLe/assets-kaykit-3d-characters) | 第三方 CC0 镜像 | 用其 Character Animations 1.1 的 GLB 复算：CombatRanged 20、MovementAdvanced 13、General 15、MovementBasic 11、Special 15、Tools 29；Rig_Medium 23 joints；**无武器/弹匣节点**；仅作名单交叉核对 | C | 补足官方 itch 读不到时的 clip 名单；不能当许可或原包来源 |
| 10 | [sketchpunklabs/kaykit_char](https://github.com/sketchpunklabs/kaykit_char) | 第三方 CC0 再导出 | 8 组 `Med_*.glb`，实测 139 个 clip 条目（去重后 132 个名字，含每包 T-Pose）；含 `Ranged_1H/2H_Reload`、`Running_HoldingRifle`、`Crouching`、`Ranged_Bow_*`；23 joints；无枪/弹匣 | C | 旁证当前包确有持枪跑与两类 reload；不能据此绕官方 403 |
| 11 | [KayKit-Game-Assets 官方 GitHub 账号](https://github.com/KayKit-Game-Assets?tab=repositories) | 官方账号 | 只有 Adventurers/Skeletons 等角色 repo，没有 Character Animations 源码 repo、CI 或 AGENTS；动画清单只能回 itch/官网 | A | 官方项目自身没有把 Character Animations 的逐 clip 或版本放进 Git；这是负面事实 |
| 12 | [KayKit Complete Collection（付费合集）](https://kaylousberg.com/game-assets/complete-kaykit-collection) | $150 付费 | 含 17 个包与 Mystery Monthly Series 4/5；镜像清单里出现 Space Ranger Rifle、Marksman Rifle、Toy Soldier Rifle、shotgun 等枪械道具，但属付费合集、非单独原包 | A | 按本卡“不付费”不采用；只能说明同风格确有枪械道具线 |
| 13 | [KayKit Patreon Characters（月更角色索引）](https://kaylousberg.com/patreon-characters) | Patreon 付费/早期访问 | Spy/Mummy/Goth Girl 等 Series 1–6；Mystery Monthly 含带枪角色 | A | 不采用；不能作为免费完整动作供给 |
| 14 | [KayKit Game Assets 官方 GitHub 组织](https://github.com/KayKit-Game-Assets) | 官方组织 | 托管 Adventurers、Skeletons、Dungeon 等角色包；Character Animations 仍走 itch | A | 便于按原文件核同骨架模型/版本/许可；不是动作包下载源 |

**KayKit 小结**：许可最干净、同骨架、身体层最近。**Adventurers 的 Knight** 只核到 `2H_Ranged_Aiming/Shoot/Reload` 与不持枪的 `Running_A/B`、`Running_Strafe_Left/Right`；Skeletons 全清单只核到 `1H/2H_Ranged_*`，同样无 `HoldingRifle`；**Character Animations 1.1 的 `Ranged_2H_*`、`Running_HoldingRifle` 只在镜像/再导出清单里**（`Running_HoldingRifle` 仅见 `Med_MovementAdvanced.glb`，13 clip），官方 1.1 免费档仍待核。两套都**无放松 `Idle_HoldingRifle`、`Walking_HoldingRifle`、持枪 strafe，且完全没有枪/弹匣节点与接触**；`2H_Ranged_Aiming`/`Ranged_2H_Aiming` 只能作 ADS/站立持枪候选。官方 1.1 的免费档逐 clip 仍未直读；161/133/131/139 也不是同一种口径（161 itch 与 133 官网是作者页宣传总数，不保证含 T-Pose；131 是 BINX 的 medium-rig 去 T-Pose 唯一名；139 是 sketchpunk 8 包条目数，每包含 T-Pose、去重 132 名；GeorgeQLe 合计 111 条）；`Rig_Large` 是否有 ranged/blaster 仍未直读；**更关键的是 Character Animations 免费档是否包含 CombatRanged 组本身未验证**（CPU-PARSE 明确把这条列为未验证；1.2 旧版有 Shoot 但无 reload）。如果免费档不含 CombatRanged，Character Animations 只能当移动/死亡/近战身体层，火力和换弹仍要靠 Adventurers/Skeletons 的 `2H_Ranged_*`；而后者同样没有放松 idle/walk 持枪与枪/弹匣。不能把“官方页说 133”或“sketchpunk 再导出 139 条目”当作完整免费清单。

### 3.2 T0 · 第二候选：Quaternius 官方免费

| # | 候选（原始链接） | 许可/可得性 | 四动作覆盖与缺口 | 证据级 | 排序理由 |
|---:|---|---|---|---|---|
| 1 | [Quaternius Universal Animation Library 官方页](https://quaternius.com/packs/universalanimationlibrary.html) | 页面标 CC0；FBX/glTF/Blend；Standard/Pro/Source | 官方页：120+ animations、universal humanoid rig、8 向 locomotion、combat and gun、emotes；**8 向属完整版/Source，免费 Standard 只有前向运动；只说 gun，未列 rifle，未列逐条 clip** | A（2026-11-10 复核） | 第二候选的类别锚点；不能据此认为含步枪四动作 |
| 2 | [Quaternius 官方动画查看器](https://quaternius.com/animviewer.html) | 官方工具 | `animviewer.html` 用相对路径 `index.pck`，实际位于 [quaternius.com/index.pck](https://quaternius.com/index.pck)（8,559,696 B）；本次解析可复算 UAL1_Source 126 / UAL2_Source 134 个唯一 clip 名（均不含各自 T-Pose）；UAL1 枪只有 `Pistol_Aim_Down/Neutral/Up`、`Pistol_Idle_Loop`、`Pistol_Reload`、`Pistol_Shoot`，**没有 rifle**；未逐条播放/未看姿势 | A/B | 直接证据：源查看器里的枪械动作只有手枪 |
| 3 | [Quaternius Universal Animation Library 2 官方页](https://quaternius.com/packs/universalanimationlibrary2.html) | 页面标 CC0 | 130+ animations；melee/armed combos/parkour/farming/fishing/zombie；**无枪械/换弹**；Standard 43 clip/65 骨 | A/B | 同风格但不能补 rifle；只能补移动/近战/死亡 |
| 4 | [Quaternius 官方许可 QAL v1.0](https://quaternius.com/license.html) | QAL v1.0，2026-08-28 | 原文允许 personal/educational/commercial 使用、无需署名；**禁止把素材本身（原版或修改版）作为独立 asset/asset pack/stock file/template 再分发**；§7 明确不追溯已取得版本 | A（2026-11-10 复核） | 与包页 CC0 冲突；公开仓库采用前必须由 dot 决定或向作者确认；这是第二候选的硬门槛 |
| 5 | [Quaternius 官方站点源码 repo](https://github.com/Quaternius/quaternius.github.io) | 作者控制 | 托管官网页面（含 license、packs）；站点根 `index.pck` 已核（8,559,696 B），repo 源码树是否含该二进制未核；可作官方页面历史的第二证据 | A/D | 官方页面历史的第二证据；不是第三方转载 |
| 6 | [Quaternius UAL1 官方 OGA 上传](https://opengameart.org/content/universal-animation-library) | CC0；zip 直链可下 | Standard zip 14,541,205 B；解包 GLB 得 46 clips（45 可用 + T-pose）、53 joints（含 30 手指骨）、13,744 tris、2 materials、无贴图；枪只有 `Pistol_*`，无 rifle/strafe/turn | A/B | 官方可下载入口；证明免费层是手枪集 |
| 7 | [Quaternius UAL2 官方 OGA 上传](https://opengameart.org/content/universal-animation-library-2) | CC0；zip 可下 | 10,257,419 B；43 clips/65 骨；以近战/跑酷/农活/僵尸为主，无枪械/换弹 | A/B | 不能补 rifle 四动作 |
| 8 | [Quaternius Low Poly Animated Guns 官方 OGA 上传](https://opengameart.org/content/low-poly-animated-guns) | CC0；zip 可下 | 1,098,036 B；6 枪各 Fire+Reload；P90/Pistol/Rifle/SniperRifle 有 `Magazine/Magazine_end`，`Slide` 仅 Pistol，`Trigger` 各枪；Revolver/Shotgun 无弹匣节点；约 954–2,812 tris/把 | A/B | 唯一能补“枪/弹匣独立节点 + 武器侧 Fire/Reload”的免费官方包；没有手臂/身体 |
| 9 | [Quaternius Animated Guns 官方页](https://quaternius.com/packs/animatedguns.html) | CC0；FBX/OBJ/Blend | 6 个 animated guns（P90、Revolver、Pistol、Rifle、Shotgun、SniperRifle，与 OGA 包内 6 个 FBX 名一致）；**没有角色/手臂**；逐件节点名未在页面列出 | A（2026-11-10 复核） | 武器侧供给；不能替代角色四动作 |
| 10 | [Quaternius Toon Shooter Game Kit 官方页](https://quaternius.com/packs/toonshootergamekit.html) | 页面标 CC0 | 官方页：characters with 17 animations；收集记录直接解析 Character_Soldier/Hazmat/Enemy 三个 glTF：各 17 clip（Idle、Idle_Shoot、Walk_Shoot、Run_Shoot 等），**没有 Reload**；43 joints；14 把枪各为单个 mesh 节点，**无弹匣子节点** | A/B | 同风格可玩 fallback，但缺 reload 与弹匣接触 |
| 11 | [Quaternius Ultimate Modular Men 官方页](https://quaternius.com/packs/ultimatemodularcharacters.html) | 页面标 CC0 | 官方页：11 characters、24 animations；收集记录/二手清单：`Idle_Gun`、`Gun_Shoot`、`Run_Shoot`、`Death`，**无 reload、无 crouch**；每角色固定 24 clips；UAL1 用 UE 风格骨名而 Modular 用 Neck/UpperArm.L，按骨名路径哈希会一条通道都绑不上 | A/C | 持枪移动/开火有，换弹缺；且骨架命名与 UAL1 不匹配 |
| 12 | [Quaternius Universal Base Characters 官方页](https://quaternius.com/packs/universalbasecharacters.html) | 页面标 CC0 | 6 humanoids/26 models；humanoid rig；可作 UAL 重定向底座；**无枪、无动作** | A | 不是动作供给；只作骨架/重定向基座 |
| 13 | [Godot Asset Store UAL 官方分发页](https://store.godotengine.org/asset/quaternius/universal-animation-library/) | 官方分发；CC0 | Standard 1.0、14.54 MB、12 条评价；评论提到 UpperChest 过度弯曲，跨角色重定向有观感风险 | A | 可核版本/兼容性；不是完整步枪供给 |
| 14 | [Quaternius Ultimate Guns Pack 官方页](https://quaternius.com/packs/ultimategun.html) | 页面标 CC0 | 40 个枪模、FBX/OBJ/Blend；**是否含 Animated 与逐件节点未核**；旧记录说 40 模型且标 Animated，页面可见文本未确认 | A/D | 只能补武器/弹匣几何；不能补身体动作 |
| 15 | [Quaternius Zombie Apocalypse Kit](https://quaternius.com/packs/zombieapocalypsekit.html) | 页面标 CC0 | 4 个可玩角色各 20 条动作，带 glTF；可补敌人/队友受击、死亡与近战；**不是持枪换弹组** | A | 不补 rifle 四动作 |
| 16 | [Quaternius Ultimate Animated Character Pack](https://quaternius.com/packs/ultimatedanimatedcharacter.html) | 页面标 CC0 | 52 个带动画角色（FBX/OBJ/Blend）；**动作清单未列**，枪械覆盖需开包核 | A | 同源身体/动作底座；不能作为已核完整供给 |
| 17 | [Quaternius 作者采访（Game World Observer）](https://gameworldobserver.com/2023/01/20/free-game-assets-tutorials-quaternius-indie-developers) | 媒体一手采访 | 70+ 包、近 2000 模型、CC0 与教程；作者背景/许可声明 | A | 补作者过程与许可背景；不是动作清单 |
| 18 | [Quaternius 官方教程页](https://quaternius.com/tutorials.html) | 官方教程 | walk/run animation、Character Rigging、Easy IK 等教程 | A | 如果走“作者补缺动作”路线，这是作者自己的做法入口 |
| 19 | [Quaternius UAL 官方 itch 页](https://quaternius.itch.io/universal-animation-library) | 官方商店；页面 D 级 | 搜索摘要称 4.9/5（138 评分）、Standard 15MB/Pro $9.99/Source $14.99，并注明 Unreal 用 GLB 需 UE5+；**本机 TLS/000，未直读** | D | 价格/档位/评论未直读；不能作为许可或动作事实 |
| 20 | [Quaternius 官方全动画预览视频（未观看）](https://youtu.be/-VXFlXhvD6A) | 官方预览 | 作者在 OGA 给出的全动画预览；本机 000，未观看 | D | 只登记链接；不据此判动作覆盖或质量 |

**Quaternius 小结**：免费层的枪械动作只有手枪；rifle 完全缺；`Animated Guns` 只能补武器侧 `Magazine/Magazine_end`（P90/Pistol/Rifle/SniperRifle）、`Slide`（仅 Pistol）、`Trigger`（各枪）与 Fire/Reload；`Toon Shooter`/`Ultimate Modular Men` 有持枪移动/开火变体但无 reload；QAL v1.0 与包页 CC0 冲突，公开仓库再分发需 dot 裁决。**不能拿“UAL 有 120+ 动作”或“Animated Guns 有 reload”宣称完整步枪供给。**

**逐件许可原文与可下载性**：OGA 的 UAL1（14,541,205 B）、UAL2（10,257,419 B）、Animated Guns（1,098,036 B）三个作者上传 zip 均可直链下载；UAL1/UAL2 包内含 CC0 1.0 `License.txt`；Animated Guns 的 `FPS Pack_0.zip` 成员只有 blend/FBX/OBJ/mtl，**包内无许可文件**，其 CC0 依据是 OGA 上传页的 `License(s): CC0` 字段。官网 `license.html` 为 QAL v1.0（2026-08-28），禁止把素材本身作为 asset pack/stock file 再分发；两者冲突。官网 Google Drive 下载文件夹可读但每文件 “Quota exceeded”，官方 itch 页 TLS/000；因此“官方原包”目前只能从 OGA/Godot 商店取得可核字节，itch 版本与价格未直读。

### 3.3 T1 · 缺口与接触证据（不是本卡候选，不参与排序）

这些来源用来证明缺口位置、给出接触/挂点合同，或作为“如果 dot-B 扩大范围”的备选；它们都不满足本卡“完整免费 + 四动作 + 枪/弹匣接触”的硬门槛。

| # | 来源（原始链接） | 许可/可得性 | 能补什么 / 缺什么 | 证据级 | 为什么不是本卡候选 |
|---:|---|---|---|---|---|
| 1 | [Mesh2Motion human 预导出 GLB 动作集](https://github.com/Mesh2Motion/mesh2motion-app/tree/main/static/assets/human) | CC0；仓内 GLB | 66 joints；`Rifle_Idle/Walk/Run/Fire/Reload`、`Pistol_Idle/Walk/Fire/Reload`、`Crouch_Idle/Walk`、`Death_A–D`；实测 `rifle-reload.glb` 64,572 B、`Rifle_Reload` 2.7083 s；**无 rifle aim、无枪/弹匣节点**；需 `MeshoptDecoder` | A/B | 四动作最全的身体层，但无枪/弹匣接触；且不在本卡两组上限内 |
| 2 | [Red Eclipse actors 角色数据仓库](https://github.com/redeclipse/actors) | CC BY-SA 4.0+；IQM | 78 骨；`rifle_reload` 51 帧@24fps=2.125 s；smg/shotgun/pistol reload、蹲行、死亡；**无枪/弹匣节点**；IQM 需转换，SA 有传染性 | A/B | 免费真实 rifle reload + 蹲 + 死，但许可/格式不适合直接进公开 Three 仓库；不在两组内 |
| 3 | [ZenXChaos / ThirdPersonShooter-AnimationSets](https://github.com/ZenXChaos/ThirdPersonShooter-AnimationSets) | Unlicense；FBX | 40 个 FBX；Revolver `ReloadInit/Loop/End`、蹲姿换弹、死亡；独立 `L_Weapon/R_Weapon` 骨；**无步枪、无枪模** | A/B | 只有左轮三阶段换弹；不能补步枪四动作 |
| 4 | [BigAndCrispy / Unity-First-Person-Shooter](https://github.com/BigAndCrispy/Unity-First-Person-Shooter) | CC0 | 第一人称手臂+手枪；`AssaultRifle_Idle/Reload/Shoot/ShootXd`、`Pistol_*`；`Pistol.fbx` 含 `Pistol_Body/Pistol_Magazine/Pistol_Trigger/Pistol_Slider` 与 `Magazine` 骨；**无全身/蹲/死** | A/B | 独立弹匣+接触最轻的 CC0 参照；不是完整角色 |
| 5 | [Godot 官方 Third Person Shooter Demo（player.glb）](https://github.com/godotengine/tps-demo) | 代码 MIT；资产 CC BY 3.0 | 56 clips/145 骨；AIM 5 向、`running_gun-cycle`、`walking_gun-cycle`、`Idlecombat`、4 向 strafe（`strafe_front/back/left/right-cycle`）+ 过渡/转向 clip、flinch/jump；**无 reload/crouch/death**；23.8 MB | A/B | 有持枪移动/瞄准，但没有换弹；不能当完整供给 |
| 6 | [FPS-Arms-3D](https://github.com/Ayush-Mohanty/FPS-Arms-3D) | 代码 MIT；模型/动画 CC-BY-4.0 | `scene.gltf` 8 clips（`Rig/AK_Idle`、`Draw`、`Walk`、`Run`、`Shot`、`Reload`、`Reload_var2`、`Reload_full`）；85 joints/3 mesh/2 materials/40,023 tris；含 `Pmag`/`Mag_2` 弹匣节点；**无全身** | A/B | 第一人称 AK 的 idle→走→跑→射击→三种 reload 全套，但只有手臂层 |
| 7 | [Operation Steel Tide BAMEN 动画士兵 GLB](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/bamen_military_soldier/bamen_military_soldier_animated.glb) | CC BY 4.0 网格 + UAL 动作（QAL 冲突） | 3.2 MB（3,246,780 B）；38 clips（ready_idle/walk/run/sprint、aim、shoot、reload、death）；78 joints/1 mesh/11,104 tris；带 `WeaponSocket/BackWeaponSocket`；**reload=UAL1 Pistol_Reload，无弹匣节点** | A/B | 动作层受 QAL 约束；不能算可再分发的完整供给 |
| 8 | [Operation Steel Tide Quaternius Viper GLB](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/quaternius_operators/viper.glb) | CC0 身体 + UAL 动作（QAL 冲突） | 38 clips/51 joints/4 mesh/68,732 tris；`WeaponSocket/BackWeaponSocket/HeadSocket`；reload 仍是 UAL1 `Pistol_Reload`，无弹匣节点 | A/B | 同 BAMEN；CC0 身体更轻，但动作层同样的冲突 |
| 9 | [Operation Steel Tide DJMaesen 动画换弹手臂 GLB](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/djmaesen_smg45/animated_reload_arms.glb) | CC BY 4.0 | 10.7 MB；24 个 reload clip（12 平台，tactical 1.8 s/empty 2.133 s）；49 joints/3 mesh/24,710 tris；带 `WeaponRoot`、`LeftSidearmMagazineAnchorFrame`；明写 articulated magazine grasp 与 real-prop contact following | A/B | 第一人称手臂+弹匣接触的最强参照；没有全身/枪模 |
| 10 | [Operation Steel Tide AK-47 可换弹第一人称 GLB](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/steel_tide_ak74/ak47_reloadable_fp.glb) | CC0（原 taradavies） | 0 clip；11 mesh/30 nodes；`Magazine/SpareMagazine/MagazineGrip/BoltHardwareGeometry/Stock` 独立节点 | A/B | 武器侧几何/挂点；不补身体动作 |
| 11 | [Operation Steel Tide SCAR-L 可换弹 GLB](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/steel_tide_scarl/scarl_reloadable.glb) | CC-BY 3.0（原 AdamKokrito） | 0 clip；10 mesh/21 nodes；`Magazine/SpareMagazine/MagazineGripSocket/MagazineWellSocket/PrimaryGripSocket/SupportGripSocket` | A/B | 独立弹匣/枪机最轻的公开样例；不补身体动作 |
| 12 | [Operation Steel Tide reloadable weapons README](https://github.com/AetherRadar/operation-steel-tide/blob/main/source_art/reloadable_weapons/README.md) | 项目文档 | 独立 `Magazine/SpareMagazine/ChargingHandle/Stock` 节点；确定性 build 校验三角面/材质/标记接触 | A | 补“枪/弹匣独立节点 + 接触”的工程做法；不是资产 |
| 13 | [Operation Steel Tide OPERATOR_PRESENTATION](https://github.com/AetherRadar/operation-steel-tide/blob/main/docs/OPERATOR_PRESENTATION.md) | 项目文档 | Blender 重定向 UAL、author handgun pose/socket、finger/contact、rifle stabilization；用诊断检查 grip/脚底/变形 | A | 说明缺 rifle clip 时用 DCC author，而不是运行时 IK 遮掩；方法参照 |
| 14 | [Operation Steel Tide ART_PIPELINE_TODO](https://github.com/AetherRadar/operation-steel-tide/blob/main/docs/ART_PIPELINE_TODO.md) | 项目文档 | 已 retarget idle/walk/run/crouch/aim/hit/revive/death，author prone/revive/grounding/sockets；动作覆盖与缺口写得可照做 | A | 缺口清单模板；不是可下载资产 |
| 15 | [Operation Steel Tide build_animated_bamen_operator.py](https://github.com/AetherRadar/operation-steel-tide/blob/main/scripts/blender/build_animated_bamen_operator.py) | MIT 脚本 | `ACTION_SOURCES` 明示 idle/walk/run/crouch 用 UAL1，aim_idle=`Pistol_Aim_Neutral`，shoot=`Pistol_Shoot`，reload=`Pistol_Reload`；author rifle hold/finger animation 补持枪与手指 | A | 直接展示 Quaternius 缺 rifle 时的最小 author 路径；不是资产 |
| 16 | [Operation Steel Tide CONTENT_PROVENANCE](https://github.com/AetherRadar/operation-steel-tide/blob/main/docs/CONTENT_PROVENANCE.md) | 项目文档 | 逐资产许可台账：UAL 记为 2026-08-20 从官方 itch 取得的 CC0 | A | 公开 repo 来源记录模板；不能替代 QAL 冲突判断 |
| 17 | [Operation Steel Tide AGENTS.md](https://github.com/AetherRadar/operation-steel-tide/blob/main/AGENTS.md) | 项目文档 | 强制 3D art quality gate：只允许明确可再分发许可、逐资产记录来源/许可/取得日、用 DCC 成品资产、截图验收；CI 仅 build | A | 高质量项目把来源/许可/验收写成仓库规则的最完整样本 |
| 18 | [Operation Steel Tide CI build.yml](https://github.com/AetherRadar/operation-steel-tide/blob/main/.github/workflows/build.yml) | 项目 CI | CI 只跑 `dotnet build`，不验资产/动画；资产质量靠 Blender 诊断与截图 | A | 说明 CI 不能代替动作验收；与本卡来源核验口径一致 |
| 19 | [cktang88/3d-fps ANIMATION_RESEARCH](https://github.com/cktang88/3d-fps/blob/main/docs/ANIMATION_RESEARCH.md) | 项目文档 | 一手核对：UAL Standard 只有 `Pistol_*`，无 rifle/strafe/turn；UAL1 Pro 仍无 rifle upper body；建议 author rifle 或 100STYLE/Rocketbox | A | Quaternius 不满足四动作的最强旁证 |
| 20 | [cktang88/3d-fps ASSET_SOURCES](https://github.com/cktang88/3d-fps/blob/main/docs/ASSET_SOURCES.md) | 项目文档 | 许可核验目录：UAL、100STYLE、Rocketbox、ccransh FPS arms 等，明确拒绝 Mixamo/Fab 原始资产进 public repo | A | 可复用其筛选口径 |
| 21 | [cktang88/3d-fps QUALITY_BAR](https://github.com/cktang88/3d-fps/blob/main/docs/QUALITY_BAR.md) | 项目文档 | public repo 只允许 CC0/CC-BY/CC-BY-SA 或明确可再分发，逐资产 credit | A | 与 a1dbv public 约束一致 |
| 22 | [cktang88/3d-fps fp_rifle_anims.json](https://github.com/cktang88/3d-fps/blob/main/public/assets/anims/fp_rifle_anims.json) | 项目文件 | 完整 FP rifle set：`Idle/IdleAimed/Walk/WalkAimed/Run/Fire/FireAimed/Reload/Equip/Holster`，从 Fab Free FPS Template effector-retarget；只 ship motion 不 ship mesh | A | 说明完整动作可来自 Fab，但许可不适合直接入库 |
| 23 | [cktang88/3d-fps ReloadChoreo.js](https://github.com/cktang88/3d-fps/blob/main/src/game/weapons/ReloadChoreo.js) | MIT 代码 | 手写换弹编排：support hand 持弹匣、IK、tactical/empty reload | A | 补弹匣接触的项目做法；不是可分发资产 |
| 24 | [cktang88/3d-fps FP_FRAMING](https://github.com/cktang88/3d-fps/blob/main/docs/FP_FRAMING.md) | 项目文档 | FP 手臂/枪构图、ADS、reload 视觉规范 | A | 补第一人称接触可读性 |
| 25 | [aadithva/shardline-outpost ASSETS.md](https://github.com/aadithva/shardline-outpost/blob/main/ASSETS.md) | MIT 代码 + 资产许可随包 | KayKit Adventurers/Skeletons/Character Animations + Quaternius 在 Three.js 的可玩先例；README 写 R=reload；四包资产本地存放、许可文件随包 | A | 证明 KayKit 四 set 可同骨架集成；未解决 idle/walk 持枪缺口 |
| 26 | [aadithva/shardline-outpost AssetLibrary.js](https://github.com/aadithva/shardline-outpost/blob/main/src/game/AssetLibrary.js) | MIT 代码 | 实际加载 movement-basic/advanced/general/combat-ranged 四包并按 clip 名映射 | A | 同骨架集成先例；不是动作供给 |
| 27 | [MilitaryG — Pistol, animations, sounds for GoDot (OGA)](https://opengameart.org/content/pistol-animations-sounds-for-godot) | CC0 | 8 个具名动画：Fire、Hammer Pull、Hammer Release、Mag In、Mag Out、RESET、Slide Pull、Slide Release；弹匣分 loaded/empty 两个独立节点；另有 slide/hammer/trigger 节点；**无手臂/角色** | A/B | 武器侧换弹可读性最强；不补身体 |
| 28 | [3DAssets.dev — FPS Guns and Shooting Range](https://3dassets.dev/assets/fps-weapon-set-and-firing-range-smg-e216f9a5) | CC0 | 4 个 transform clip：`stock-open/close`、`magazine-open/close`；独立 stock/magazine 节点；无骨骼/角色 | A/B | 弹匣装卸/枪托折叠的接触参照 |
| 29 | [OpenGameArt Animated Pistol（CoinCoin）](https://opengameart.org/content/animated-pistol) | CC BY 4.0 | 第一人称手臂+手枪；18 clips 含 IDLE/WALK/RUN/JUMP/FIRE/FIRE_EMPTY/RELOAD；无蹲/死 | A | 手枪侧 fallback；不是步枪 |
| 30 | [OpenGameArt Low Poly Weapons Pack with rigged arms（zisongbr）](https://opengameart.org/content/low-poly-weapons-pack-with-rigged-arms) | CC0 | 1 步枪+1 手枪，拆分 `Mag/Barrel/Sight/Handler` 并带绑定手臂；**页面未声明含动画** | A | 只补独立弹匣+手臂网格 |
| 31 | [J-Toastie Fps Rig AKM（Poly Pizza）](https://poly.pizza/m/U6l6wjxFhC) | CC BY；免登录可下 | 7,679 tris AKM+手臂；GLB 实测 Idle 2.625 s / Reload 2.583 s / Shoot 0.167 s；独立 `Magazine`、`Bolt` 节点并由 reload 驱动；**缺 walk** | A/B | 可直接核到枪手-弹匣-枪机接触的步枪候选；只有第一人称 |
| 32 | [J-Toastie Fps Rig Glock（Poly Pizza）](https://poly.pizza/m/uxko5LkGia) | CC BY；免登录可下 | 6,837 tris 手枪+手臂；Idle/Reload/Shoot/Grip 四 clip；独立 `Magazine`、`Slide` | A/B | 副武器动作与弹匣接触对照；不补步枪 |
| 33a | [DJMaesen FPS 枪手家族：smg](https://sketchfab.com/3d-models/fps-animated-smg-ea3dad7478624495a5a46f40127b0579)、[AK](https://sketchfab.com/3d-models/fps-ak-animated-b0b1bae40337449189483f6187cf7af7)、[first-person arms](https://sketchfab.com/3d-models/first-person-arms-e3c42c05b22944e5839deb8e003f0987)、[rifle](https://sketchfab.com/3d-models/rifle-animated-55e18a2851ba4a23a207015decdbe260)、[battle rifle](https://sketchfab.com/3d-models/battle-rifle-animated-83307e082fe14162960712d22d25b5e4) | 多为 CC BY 4.0；下载需登录 | smg 21,422 tris；AK 22,089 tris 单 clip；arms 7,240 tris/0 动画；rifle 14,696 tris（fire/reload/hide/ready/melee 单时间线）；battle rifle 20,776 tris（fire/reload full/reload clip/hide/ready/melee；CC BY-SA） | A（元数据） | 第一人称换弹/接触的丰富参照；本卡不登录，故不作可下载源 |
| 33b | [ccransh FPS 家族：AK-74M](https://sketchfab.com/3d-models/fps-ak-74m-animations-94be8385c402474cacd39bc096c6ca14)、[pistol](https://sketchfab.com/3d-models/fps-pistol-animations-0d7a343dcb6f401197a73c91aee93f6d)、[sniper](https://sketchfab.com/3d-models/fps-animations-sniper-rifle-c15ae8393d824f5b929e3f69691cdd31)、[Remington](https://sketchfab.com/3d-models/fps-arms-remington-shotgun-e68ef617fe8a48cca8610d016ffd5881)、[Benelli M4](https://sketchfab.com/3d-models/fps-benelli-m4-animations-225a62190f6043ca975eaa2798ab7e2c)、[SMG](https://sketchfab.com/3d-models/smg-fps-animations-ca37ea9148dc4fcc9cc632175d311b23)、[P9 Manny](https://sketchfab.com/3d-models/p9-manny-fps-animations-115d4d820b9a45d89c8d75dd0f244bbe)、[LowPoly MP5](https://sketchfab.com/3d-models/fps-animations-lowpoly-mp5-568f00dd76944baaa5eae1a1cc871423) | CC BY 4.0；下载需登录 | AK 40,024 tris/8 clip（draw/idle/fire/reload/inspect）；pistol 32,670 tris/5 动画；sniper 34,812 tris/6 动画；Remington 9,151 tris/4 动画；Benelli 45,748 tris/8 动画；SMG 29,282 tris/8 动画；P9 7 clip；MP5 9 clip/10,673 tris | A（元数据） | 同风格多武器第一人称动作；无全身 |
| 33c | [1Matzh 家族：AK-74M](https://sketchfab.com/3d-models/ak-74m-animations-blender-effd52406532433eaac9454740572c57)、[Desert Eagle](https://sketchfab.com/3d-models/desert-eagle-first-person-animations-09a213d8510a42d1b747135e85712eff)、[UZI](https://sketchfab.com/3d-models/uzi-first-person-animations-2026-remake-73266e9f1eb949b69a3ab11d8f636048)、[9mm Pistol](https://sketchfab.com/3d-models/9mm-pistol-first-person-animations-c26d7f5aa72f4b01a6da4578caa8f07f) | CC BY 4.0；下载需登录 | AK 13 clip 含 idle/walk start-stop/jump/draw/fire/reload fast-complete；DE 9 clip，作者称用两把弹匣练换弹；UZI 13 clip 含 Reload/Reload_Empty/Equip/Inspect/Aim_In-Out；9mm 10 clip 含 Reload_Empty | A（元数据） | 枪手—弹匣接触参照；只有第一人称 |
| 33d | [BarcodeGames/teenjust500/wburton/dan/Duque：M4](https://sketchfab.com/3d-models/m4-fps-weapon-animations-pack-v1-662fc74dda2646cfb48fc610705768ef)、[AKM](https://sketchfab.com/3d-models/akm-fps-weapon-animations-pack-v1-edf97e78725b42f1a4dfd9ffe7106f52)、[Kriss Vector](https://sketchfab.com/3d-models/kriss-vector-animated-free-54530c888cfd4ae7aab3c3852b229c7e)、[Shotgun](https://sketchfab.com/3d-models/animated-shotgun-e048ba220f9e49c29a3e808cddc22a0a)、[M4A4](https://sketchfab.com/3d-models/animated-fps-m4a4-a82fbbb731724390bc88d38940b8b01c)、[AR15](https://sketchfab.com/3d-models/ar15-924e1cc70ce34c8887c3031f7658889b)、[Pistol 43](https://sketchfab.com/3d-models/pistol-43-tactical-fps-animations-1a4c9d15818a4522aedbeb70919a17da)、[Duque pistol](https://sketchfab.com/3d-models/fps-character-animation-pack-pistol-e2815a5bea3a4e3895b3c29a2586e671) | CC BY 4.0；下载需登录 | M4 Draw/Fire/Reload/Reload Empty/Holster；AKM 同族；Kriss Shoot/Reload/Draw/Hide；Shotgun Take/Idle/Shoot/Reload Start-Reload-ReloadEnd/Watch/Hide；M4A4 Take/Reload/Idle/Fire/Hide；AR15 10 clip；Pistol43 6 clip；Duque 11 clip | A（元数据） | 单武器换弹参照；无全身，部分逐 clip 名未列 |
| 34 | [Godot FPS Hands（Bytez）](https://codeberg.org/Bytez/godot-fps-hands) | 资产 CC BY 4.0；代码 GPLv3 | 即插即用 FPS 手+6 把动画武器；GLB 内分 arms/mag/bolt/trigger/release 节点；clip 有 idle/fire/reload/reload_full；无移动动作 | A | 弹匣接触参照；GPLv3 代码与 NC 风险需注意 |
| 35 | [Unity Technologies FPSSample](https://github.com/Unity-Technologies/FPSSample) | Unity Companion License | 1P/3P FBX：Firstperson Idle/Shoot/Reload、Stand/Locomotion Reload/Shoot；武器 prefab 只有 Muzzle，无独立弹匣节点；18 GB LFS | A | 完整 FPS 样例，但 Unity 许可/体积/结构不适合本卡 |
| 36 | [Infima Games - Free FPS Template & Tutorial（Fab）](https://www.fab.com/listings/6a0af880-2b74-480c-a82c-8e597918dffe) | 免费；License terms 为空 | 含 idle/aim/walk/run/fire/reload/equip/holster 的整段第一人称步枪动作和 Blender 源；`fp_rifle_anims.json` 有 `Reload/Reload_reshaped` 与 mag 抓取事件；**无全身** | A | 第一人称完整步枪动作参照；Fab 许可字段为空，不能直接入库 |
| 37 | [xidePunk Studio – First Person Rifle Animation](https://www.fab.com/listings/ceee0b8a-5ed1-4bc9-999d-d9a67f4ae384) | Fab 免费；许可需选择 | 16 条 player 动作含 idle/walk/sprint/ADS/fire/reload（含 empty）；4 条 rifle 动作；弹匣/枪机/释放杆/扳机已绑定并在换弹中运动 | A | 第一人称完整步枪参照；无全身；许可未定 |
| 38 | [y0ung001 – FPS Animation Pack_AKS74U](https://www.fab.com/listings/75e66639-af8e-4c88-9dc6-d183d2553a61) | Fab 免费；许可未写明 | 18 条：idle/aim/equip/fire/aimed fire/aimed reload/empty reload/run/walk/aimed walk，带手臂；弹匣节点未写明 | A | 单武器第一人称参照；无全身 |
| 39 | [MoCap Online – Free MoCap Animation Sampler](https://mocaponline.com/products/free-mocap-animation-pack) | $0；Standard License | 含 locomotion/idle/combat 样本；可先验证重定向；**具体 clip 表未公布，是否含步枪 reload 未核** | A/D | 免费但覆盖未知；不能作“确有” |
| 40 | [MoCap Online – Free UE4 Multiplayer 3rd Person Shooter Demo](https://mocaponline.com/products/ue4-blueprints-demo) | 免费 UE4 工程 | 动画在 UE4 骨架上并附源 FBX；很可能带步枪 idle/aim/fire/reload；**页面未列 clip 明细** | A/D | 可免费取样验证；未下载，不能当已核 |
| 41 | [Uthana text-to-motion（Replicate）](https://replicate.com/uthana/text-to-motion-diffusion-v2) | 按量付费 | 文本生成 humanoid 动作并输出 FBX/GLB、可重定向；Western 花 $7.50 生成 revolver walk/run/aim/reload/stagger（aim 全为双手） | A | 可补缺项，但无现成步枪库、需逐条验证；不是本卡免费供给 |
| 42 | [NVIDIA Kimodo（项目页）](https://research.nvidia.com/labs/sil/projects/kimodo/) | 代码 Apache-2.0；权重另许可 | 文本+关键帧/末端约束生成；700 小时商业友好 mocap 训练；输出 NPZ/AMASS 需转换；**无枪械/换弹 clip** | A | 生成路线，不是现成动作 |
| 43 | [NVIDIA ARDY](https://github.com/nv-tlabs/ardy) | Apache-2.0 代码；NVIDIA Open Model 权重 | 实时动作生成，文本+路径/关键帧约束；输出 NPZ/CSV；无现成枪械 clip | A | 同 Kimodo；只作缺口生成候选 |
| 44 | [100STYLE Dataset（Zenodo）](https://zenodo.org/records/8127870) | CC BY 4.0 | 100 种 Xsens 步态 BVH；含 Neutral/Swat/Crouched 的 FW/BW/SW/SR/ID/TR；**无枪/换弹** | A/D（Zenodo 403，作者页 A） | 补真实 mocap 下半身；需裁 T-pose、切循环、重定向 |
| 45 | [CMU Graphics Lab Motion Capture Database](https://mocap.cs.cmu.edu) | 原页 “free for all uses” | 数千条 BVH 含跑/蹲/爬；旧条款/第三方核对提到可商用但不可单独转售；**无枪/换弹** | A/D（云环境不可达，改镜像） | 补步态；公开仓再分发仍是灰区 |
| 46 | [Microsoft Rocketbox](https://github.com/microsoft/Microsoft-Rocketbox) | MIT | 417 clips、walk/run start-stop/turn/crouch；**无 rifle** | A | 只能补移动/蹲；不应作为第三套全量 |
| 47 | [Ready Player Me animation-library](https://github.com/readyplayerme/animation-library) | 官方 GitHub；许可文件 | 200+ mocap 动作重定向到其骨架（locomotion/idle/dance 等）；**无武器/换弹** | A | 补基础移动层；不补枪 |
| 48 | [Kenney Animated Characters 2（Survivors）](https://kenney.nl/assets/animated-characters-2) | CC0 | 8 个带动画角色；**无枪械动作** | A | 风格化生存角色补充；不补步枪 |
| 49 | [Kenney Blaster Kit](https://kenney.nl/assets/blaster-kit) | CC0 | 科幻枪/弹匣零件；无角色/动作 | A | 武器侧对照；不补完整动作 |
| 50 | [Poly Pizza – Quaternius Ultimate Guns Pack](https://poly.pizza/bundle/Ultimate-Guns-Pack-cpgUfI4t2F) | 页面标 CC0 | 40 枪模；模型页 JS 渲染，逐件动画/许可需回作者原页核 | A/D | 武器侧索引；不补身体 |
| 51 | [Drawcall Market 动画索引](https://market.drawcall.ai/) | 第三方标准化 | 把 Quaternius 等 CC0 动作切成 normalized humanoid 单 clip GLB；单条 Pistol reload 约 150 KB | A | Three 直接试片段；不替代原包核验 |
| 52 | [Godot Mixamo Animation Retargeter](https://github.com/RaidTheory/Godot-Mixamo-Animation-Retargeter) | GPLv3 | 自动把 Mixamo 动作重定向并抽成 AnimationLibrary | A | 转换工具；不是动作源 |
| 53 | [Mixamo Converter（Blender 插件）](https://github.com/enziop/mixamo_converter) | GPL-3.0 | 批量转 Mixamo FBX/Collada、加 root motion、改 Unreal 骨骼名并修 bind pose | A | 转换工具；Mixamo 原始动作不可再分发 |
| 54 | [Maya_Animation_Batch_Fixer_Tool](https://github.com/axioxmedia/Maya_Animation_Batch_Fixer_Tool) | MIT | Maya 2024 批量动画扫描/修正/重定向，处理手部/双手交互与 SMPL-H→MetaHuman/自定义骨架 | A | 转换/质检工具；不是内容 |
| 55 | [V-Sekai FBX2glTF](https://github.com/V-Sekai/FBX2glTF/releases) | 开源工具 | 把 KayKit FBX 转 glTF，绕开 Godot 3.3+ 的 FBX 动画损坏 | A | 转换工具；不是动作源 |
| 56 | [Blender Agent Skills（EL4CTEO）](https://github.com/EL4CTEO/blender-skills) | MIT | 28 个 Blender 5.2 流程（含角色绑定、动画）打成 agent skills | A | 重定向/改动作的执行通道；不是动作源 |
| 57 | [Blender 官方 MCP Server](https://www.blender.org/lab/mcp-server/) | 官方实验 | 在打开的 Blender 里由 agent 执行 Python | A | 执行通道；不是动作源 |
| 58 | [SCAIL-2](https://github.com/zai-org/SCAIL-2) | Apache-2.0；许可标注不一致 | 驱动视频做端到端受控角色动画；产出视频而非可编辑骨骼 clip | A | 预演/参考；不是 FPS 动作供给 |
| 59 | [Wan-Animate-2](https://github.com/Wan-Video/Wan-Animate-2) | Apache-2.0 | 驱动视频替换/驱动角色；视频级结果，不产出带枪/弹匣节点的 clip | A | 同上 |
| 60 | [mixamo-llm-mocap](https://github.com/squall01337/mixamo-llm-mocap) | README 标 MIT；元数据 NOASSERTION | 锁定机位视频→SMPL-X→Mixamo 骨架 FK；含手/脚特写拟合；可把自拍换弹表演转成 Mixamo 动作；Mixamo 条款限制原始文件再分发 | A | 生成路线；派生用法需核 |
| 61 | [PAMI: Part Anchored Motion for Text to HOI](https://github.com/Coral79/PAMI-Code) | MIT；代码/权重未发布 | 文本到人-物交互生成，身体部位锚点投票 + 接触几何细化；正对弹匣交接漂移/漏接触；README 勾选全未完成 | A | 观察项；不能当现成动作 |
| 62 | [GVHMR](https://github.com/zju3dv/GVHMR)、[WHAM](https://github.com/yohanshin/WHAM)、[SOMA-X](https://github.com/NVlabs/SOMA-X)、[MoCha](https://github.com/Orange-3DV-Team/MoCha)、[InterAct](https://github.com/wzyabcas/InterAct)、[FrankenMotion](https://coral79.github.io/frankenmotion/)、[SAM3D-Body](https://github.com/facebookresearch/sam-3d-body)、[SCAIL-1](https://github.com/zai-org/SCAIL)、[Wan2.2](https://github.com/Wan-Video/Wan2.2)、[BONES-SEED](https://bones.studio/ai-datasets/) | 多为 MIT/Apache/研究许可 | 视频动捕、人体参数化、动作生成、人-物交互数据；**均不提供现成 FPS rifle clip** | A | 只作生成/重定向方法；不参与候选排序 |

### 3.4 T2 · 排除项（付费、登录、不可再分发、文件不可取）

以下不参与候选排序；列出来是为了让 dot-B 看到“完整度标尺”和拒绝条件，而不是漏找。

| 来源族 | 代表链接 | 许可/可得性 | 拒绝理由 |
|---|---|---|---|
| Kubold 付费步枪动作 | [Rifle Animset Pro](https://assetstore.unity.com/packages/3d/animations/rifle-animset-pro-15098)、[Cover Rifle Animset Pro](https://assetstore.unity.com/packages/3d/animations/cover-rifle-animset-pro-23360)、[Kubold downloads](https://www.kubold.com/downloads)、[Kubold store](https://www.kubold.com/) | 付费 Unity/UE 资产；免费 LITE 也不可再分发 | 88 个 Humanoid clip、Rifle_Idle/WalkFwdLoop/Strafe 8 向/Shoot/Reload_2/Hit/Death 是完整度基准；不允许把原始素材随公开仓库提交 |
| KINEMATION 付费 FPS 动作 | [Sci-Fi FPS](https://assetstore.unity.com/packages/3d/animations/sci-fi-fps-animation-pack-357604)、[Ultimate](https://assetstore.unity.com/packages/3d/animations/fps-animation-ultimate-240060)、[Tactical](https://assetstore.unity.com/packages/3d/animations/tactical-fps-animations-311410)、[Framework](https://assetstore.unity.com/packages/tools/animation/fps-animation-framework-238641)、[GitBook](https://kinemation.gitbook.io/fps-animation-pack-unity/)、[Fab Lite](https://www.fab.com/listings/79752ba2-c659-4375-8fa9-5e6fc8025b62)、[Fab Tactical](https://www.fab.com/listings/76c5f2b0-ea55-461c-8b3c-811a9deb3279)、[Fab Ultimate](https://www.fab.com/listings/a2d0dc02-0380-4fb8-84a9-d9e03636aec9)、[Fab Pro](https://www.fab.com/listings/37b13190-f784-4cf3-9312-922bd263d3d2) | 付费（$24.99–$99.99）；UE/Unity EULA | 20 把武器、tactical/empty/extended reload、程序化 equip 是完整度标尺；不允许再分发 |
| Infima 付费 FPS 动作 | [Tactical FPS Animation Packs 文档](https://docs.infimagames.com/product/tactical-fps-animation-packs/)、[Assault Rifle](https://www.fab.com/listings/1ae386ab-4a40-4a0f-ac17-621e2d9d1028)、[Low Poly Modern Guns](https://www.fab.com/listings/6914a185-4b14-475c-8f4f-cc0a6a3c589f)、[Free FPS Template](https://www.fab.com/listings/6a0af880-2b74-480c-a82c-8e597918dffe) | 付费；Free Template 许可字段为空 | 逐武器 reload/malfunction/inspect、第一/第三人称组织是完整度基准；UE-only/付费，不能直接进 Three |
| MoCap Online 付费 | [Rifle](https://mocaponline.com/collections/all/products/rifle)、[Rifle Shooter Pro](https://www.fab.com/listings/6cbfcfb5-e96b-4a69-b8f2-124844c17b8f)、[Pistol Starter](https://www.fab.com/listings/95dbdb60-d5df-4694-bfc6-3c22d6b79f72) | $4.99–$149.99；禁止再分发原始文件 | 390 个 rifle 动作/892 文件、48 个 aim offset 是完整度上限；付费，免费 demo 是否含 rifle reload 未核 |
| Unity Asset Store 角色/动作 | [CombatGirls RifleCharacterPack](https://assetstore.unity.com/packages/3d/characters/humanoids/humans/combatgirls-riflecharacterpack-305180)、[Starter Assets](https://assetstore.unity.com/packages/3d/characters/first-person-third-person-character-controllers-196526)、[RIB Rifle ShootReload](https://assetstore.unity.com/packages/3d/animations/rifle-shootreload-mocapanimpack-225868)、[RIB Rifle Mega](https://assetstore.unity.com/packages/3d/animations/rifle-mega-mocapanimpack-226324)、[MotionCapify](https://assetstore.unity.com/packages/3d/animations/survival-mocap-assault-rifle-313697)、[Gamma](https://assetstore.unity.com/packages/3d/animations/rifle-animation-vicon-mocap-412302) | 付费/Unity EULA；需登录 | CombatGirls 39+ 动作、RIB 步枪 mocap 是完整度标尺；不允许再分发 |
| Fab/Epic 官方样例 | [Epic Animation Starter Pack](https://www.fab.com/listings/98ff449d-79db-4f54-9303-75486c4fb9d9)、[Ultimate FPS Animations](https://www.fab.com/listings/10d385c9-7cff-41e2-9322-6f74f5ce0ec2)、[Lyra](https://www.fab.com/listings/93faede1-4434-47c0-85f1-bf27c0820ad0)、[Game Animation Sample](https://www.fab.com/listings/880e319a-a59e-4ed2-b268-b32dac7fa016)、[Paragon Retargeted](https://www.fab.com/listings/e6de87b1-b755-478d-9228-a9eb89ff4411) | Epic 免费/付费；UE 内容许可；需 Epic 账户 | 62/500+/5300 clip 是完整度对照；UE 许可限制，不能转成 Three 通用资产 |
| Mixamo | [mixamo.com](https://www.mixamo.com/) | 免费；需 Adobe 登录 | 可商用但不可把原始角色/动作当独立资产再分发；2021 附加条款禁止用内容/输出训练 AI/ML；顶部搜索常见但按本卡排除 |
| Sketchfab 需登录下载 | [M4 FPS Pack](https://sketchfab.com/3d-models/m4-fps-weapon-animations-pack-v1-662fc74dda2646cfb48fc610705768ef)、[ccransh AK-74M](https://sketchfab.com/3d-models/fps-ak-74m-animations-94be8385c402474cacd39bc096c6ca14)、[1Matzh UZI](https://sketchfab.com/3d-models/uzi-first-person-animations-2026-remake-73266e9f1eb949b69a3ab11d8f636048)、[Barcode AKM](https://sketchfab.com/3d-models/akm-fps-weapon-animations-pack-v1-edf97e78725b42f1a4dfd9ffe7106f52) | CC BY 4.0；下载 401 需登录 | 本卡不新登录；只作接触/动作结构参照，不能作为可下载源 |
| CuIGames 三包 | [R90](https://opengameart.org/content/r90-bullpup-smg-animated-reload-glb)、[P50](https://opengameart.org/content/p50-heavy-pistol-animated-glb-fbx-blender)、[A5](https://opengameart.org/content/a5-carbine-animated-tactical-carbine-glb-blender) | CC BY 4.0；文件区当前不可用 | 页面标 “File(s) currently unavailable due to potential licensing issues”；原 itch 不可达；不能当可用供给 |
| 二手重包/转载 | [CG3DA Fighter 2](https://www.cg3da.com/8603.html)、[B 站 CombatGirls](https://www.bilibili.com/video/BV1EvhK6aE7s/) | 许可不明；称“仅学习交流” | 第三方收集/重包，不是作者原页；CombatGirls 实为 BIPER 付费 Unity 资源 |
| ActorCore / mocapdata / Rokoko / Truebones | [ActorCore Free](https://actorcore.reallusion.com/free)、[mocapdata](https://mocapdata.com/)、[Rokoko Motion Library](https://www.rokoko.com/products/motion-library)；Truebones 原页不可达，未列入候选 | 免费层/付费/需注册；SPA/429/000 | 免费 motion 包清单、Rifle/Shooter 覆盖、商用再分发条款未核；不能作已核来源 |
| LAFAN1 | [Ubisoft La Forge Animation Dataset](https://github.com/ubisoft/ubisoft-laforge-animation-dataset) | CC BY-NC-ND 4.0 | 非商用、禁派生；只能作移动/受击参考，不能用于产品 |
| Unreal Marketplace Fighter 2 | [Fighter 2 (Rifle)](https://www.unrealengine.com/marketplace/zh-CN/product/fighter-2-rifle) | 付费；403 | 五套 idle/fire/aim/walk/reload 是完整度参照；官方页 403，CG3DA 转载不可作来源 |
| Fab G17 / Free FPS Template 等许可字段为空 | [G17](https://www.fab.com/listings/5b920af4-7a41-484e-afd2-323605fdaf77)、[Free FPS Template](https://www.fab.com/listings/6a0af880-2b74-480c-a82c-8e597918dffe) | 标 Free；License terms 为空 | 下载前必须在 Fab 页面确认许可原文；不能凭“免费”入库 |

### 3.5 T3 · 社区、教程与方法（不是资产候选）

| 族 | 代表链接 | 得到什么 | 限制 |
|---|---|---|---|
| GitHub issue/PR（重定向/接触反例） | [Western #539](https://github.com/Kokanee25/Western/issues/539)、[Western #529](https://github.com/Kokanee25/Western/issues/529)、[kayfabizarro #431](https://github.com/georg-doc/kayfabizarro/issues/431)、[forward-base-command #31](https://github.com/edlis99/forward-base-command/pull/31)、[corosolto/studio #7](https://github.com/corosolto/studio/pull/7)、[storystage2 #189](https://github.com/storystage/storystage2/pull/189)、[ThisForClaude #23](https://github.com/hackerisnice/ThisForClaude/pull/23)、[Suka87 #5](https://github.com/paulanthony-alt/Suka87/pull/5)、[gdstudio #838](https://github.com/Ryubara/gdstudio/pull/838)、[blacksite #81](https://github.com/Vignex-tech/blacksite/issues/81) | KayKit 免费动作被实玩判 “brutal”；Rig_Large 无 ranged/blaster；Quaternius 士兵单手垂枪、步枪悬浮；UAL 转 213 骨的 T-pose/位移比例坑；FPS 验收要 `idle_rifle/walk_rifle/run_rifle/fire/reload` | 社区/项目自述，C 级；不能替代作者原页或字节证据 |
| Godot 论坛/issue | [130611](https://forum.godotengine.org/t/bone-poses-getting-messed-up-when-going-from-one-retargeted-animation-to-another/130611)、[128792](https://forum.godotengine.org/t/animationplayer-missing-while-importing-external-3d-assets-missing/128792)、[133195](https://forum.godotengine.org/t/can-you-adjust-import-settings-with-an-import-script/133195)、[134824](https://forum.godotengine.org/t/quaternius-walking-legs-and-feet-inverse-kinematics-script/134824)、[132458](https://forum.godotengine.org/t/new-user-coming-from-unity-trouble-with-movement-and-animation-import/132458)、[133301](https://forum.godotengine.org/t/quaternius-humanoid-ragdoll-setup-walkthrough/133301)、[Godot #53544](https://github.com/godotengine/godot/issues/53544) | UAL 混库姿态污染、KayKit 动画拆文件导入、handslot/180° 朝向、Quaternius 走路脚部 IK、Quaternius 朝向相反、ragdoll 长流程、KayKit FBX 3.3+ 动画损坏 | 社区经验；版本相关，需按当前 Godot/导入器复核 |
| Unity Discussions / Asset Store 规则 | [CC0 帖](https://discussions.unity.com/t/using-cc0-animations-in-asset-store-demo-scenes/1719576)、[CC0 回复](https://discussions.unity.com/t/publisher-do-i-need-to-put-additional-cc0-license-to-a-free-asset-to-make-it-fully-free-to-use/1581606/2)、[提交规则](https://assetstore.unity.com/publishing/submission-guidelines) | Asset Store 可能拒收 CC0；规则禁止 GPL/LGPL 或需署名的 CC/Apache 依赖 | 只影响“把 KayKit 动画打进商品包”的场景；不影响本卡公开仓库 |
| 中文社区/教程 | [B 站 Blender+UE5 下](https://www.bilibili.com/video/BV1EfnE6ME8A/)、[B 站 UE5+Blender 28 课](https://www.bilibili.com/video/BV1gE421w7HN/)、[B 站 Infima](https://www.bilibili.com/video/BV1G6QxYAE9k/)、[知乎 多人射击 12](https://zhuanlan.zhihu.com/p/671344098)、[知乎 个人 TPS](https://zhuanlan.zhihu.com/p/707526995)、[掘金 UE5 AK47](https://juejin.cn/post/7339731268148969510)、[博客园 TPS 动画状态机](https://www.cnblogs.com/LemonInCup/p/16477308.html)、[CSDN CS 枪械动画](https://blog.csdn.net/weixin_52203618/article/details/155496696)、[indienova 重定向工具](https://indienova.com/u/37%E5%8F%B7%E6%9D%91%E6%B0%91/blogread/38705)、[腾讯云素材库](https://cloud.tencent.com.cn/developer/article/2690206)、[vfxcg UAL2](https://vfxcg.com/2026/1000341.html) | 换弹三拍、左手 IK、弹匣骨骼/约束、上下半身分层、重定向流程、Mixamo/Quaternius 使用边界 | 多数只有标题/摘要；知乎 403、B 站 412/验证码；不能当动作事实 |
| 英文媒体/独立评测 | [DigitalProduction UAL2](https://digitalproduction.com/2026/02/10/130-animations-one-rig-zero-drama/)、[Cinevva part 17](https://app.cinevva.com/blog/2026-05-01-open-world-browser-part-17-animations-and-search)、[BINX Forge](https://binxforge.com/guides/improve-game-animations)、[80.lv](https://www.80.lv/articles/get-your-hands-on-over-120-ready-to-use-game-animations)、[Game World Observer](https://gameworldobserver.com/2023/01/20/free-game-assets-tutorials-quaternius-indie-developers) | UAL2 是 placeholder 与成品之间；KayKit 131 / UAL 43 的独立清点；T-pose/位移/手指映射坑；免费 Standard 45 vs Pro 120+ | 二手评测，C 级；80.lv 一次 404；引用时注明摘要 |
| 聚合索引/awesome/topic | [Calinou/awesome-gamedev](https://github.com/Calinou/awesome-gamedev)、[killop/anything_about_game](https://github.com/killop/anything_about_game)、[devanshutak25/3d-resources](https://github.com/devanshutak25/3d-resources)、[topic game-assets](https://github.com/topics/game-assets)、[topic character-animation](https://github.com/topics/character-animation) | 资源索引、mocap/动画库清单、引擎样例 | 头部 topic 多为 AI 工具/引擎样例；没有可直接取用的完整 FPS 动作包 |

## 4. 四动作映射表

“确有”＝A/B 级证据能指到具体 clip；“部分”＝只有手枪/不持枪/只有跑；“缺”＝清单中不存在；“未核”＝页面不可达或未字节解析。`Ranged_2H_*` 是 KayKit 的通用双手远程 clip，不等于步枪持握套；`Pistol_*` 是 Quaternius 免费层唯一枪械集。**KayKit 两套命名要分清：Adventurers 用 `2H_Ranged_*`，Character Animations 用 `Ranged_2H_*`，指同一类动作；下表按来源包内的原名写，映射时按包内名转换。**

### 4.1 KayKit 与 Quaternius 正式候选

| 动作槽 | KayKit Character Animations 1.1 / Adventurers / Skeletons | Quaternius UAL1 免费 Standard | 判定与证据 |
|---|---|---|---|
| 持枪 idle | **部分/待核**：无放松持枪 idle——Skeletons 全清单、Character Animations 官方页、Adventurers 76 clip 都没有 `Idle_HoldingRifle`；但 Adventurers 的 `2H_Ranged_Aiming` 1.600 s / Character Animations 的 `Ranged_2H_Aiming` 1.633 s（49 帧）是双手远程瞄准循环，可作步枪 ADS/站立持枪候选，未播放，不能当放松待机 | **缺**：只有 `Pistol_Idle_Loop`；无 rifle idle | KayKit 有现成 ADS/站立持枪候选；Quaternius 不满足“持枪 idle” |
| 持枪 walk | **缺**：没有 `Walking_HoldingRifle`；通用 `Walking_A/B/C`、`Walking_Backwards` 不持枪 | **缺**：无 rifle walk；`Walk_Loop` 不持枪 | KayKit 只有 `Running_HoldingRifle`（仅 Character Animations `Med_MovementAdvanced.glb`，当前消费者未映射），走路缺 |
| 持枪 run/strafe | **部分**：`Running_HoldingRifle` 0.8333 s 仅见 Character Animations 的 `Med_MovementAdvanced.glb`（13 clip；sketchpunk/GeorgeQLe 再导出），Adventurers/Skeletons 的 76/90+ clip 未核到，当前消费者未映射；`Running_Strafe_Left/Right` 有但不持枪 | **缺**：无 rifle run/strafe；免费 Standard 只有前向 `Walk_Loop`/`Jog_Fwd_Loop`/`Sprint_Loop`/`Crouch_Fwd_Loop`，不含 strafe/turn（8 向 locomotion 在完整版/Source） | KayKit 能跑，但来源是再导出且缺走/持枪 strafe |
| 开火 | **部分/待核**：镜像与 sketchpunk 再导出有 `Ranged_2H_Shoot` 1.1 s、`Ranged_2H_Shooting` 1.1 s（sketchpunk/CPU-PARSE 口径；GeorgeQLe 1.1 GLB 为 1.0667 s）；`Ranged_1H_Shoot/Shooting` 同；官方免费档是否含 CombatRanged 未验证 | **部分**：`Pistol_Shoot`；无 rifle shoot | KayKit 有通用双手远程开火（待核免费档）；Quaternius 只有手枪 |
| 完整 reload | **部分/待核**：镜像与再导出有 `Ranged_2H_Reload` 1.6333 s、`Ranged_1H_Reload` 1.2 s；官方免费档是否含 CombatRanged 未验证 | **部分**：`Pistol_Reload`；无 rifle reload | KayKit 的 reload 是通用 ranged（待核免费档），不保证步枪弹匣接触 |
| 枪独立节点 | **无**：只有 `handslot.l/r`；无 gun 骨/网格 | 角色无；`Animated Guns` 武器侧有 6 把枪与 `Trigger`（各枪）、`Slide`（仅 Pistol） | 两组角色都没有枪节点 |
| 弹匣独立节点 | **无**：无 magazine 骨/网格；无手指骨 | 角色无；`Animated Guns` 有 `Magazine/Magazine_end`（P90/Pistol/Rifle/SniperRifle） | 只有 Quaternius 武器侧能补弹匣几何 |
| 手—枪/手—弹匣接触 | **无/未核**：没有枪/弹匣网格，无法验证 | **无**：角色无枪；`Animated Guns` 只有枪件自身 Fire/Reload，无手/手臂 | 两组都不满足“接触动作” |
| 三角面/材质预算 | Knight 6,952 tris、1 material、1 张 1024 图集、41 joints；Rig_Medium CombatRanged 6,916 tris、6 mesh、23 joints（GeorgeQLe 镜像；sketchpunk 再导出为 0 mesh、23 joints、20 clips） | UAL1 13,744 tris、2 materials、无贴图、53 joints（30 手指骨）；UAL2 65 骨；Toon Shooter 43 joints；Animated Guns 约 954–2,812 tris/把 | KayKit 更轻；Quaternius 手指骨更全但无枪 |
| 骨架/单位/朝向 | 23 核心骨同名；Knight 41 骨；`Rig_Medium` 父节点 vs Knight `Rig`；父节点约 +90° X / root -90°；Godot 需 180° 旋转/`handslot` BoneAttachment | UAL1 53 骨/UE 风格命名；Base Characters 65 骨；Godot 需 180° 旋转；UpperChest 过度弯曲；与 Modular Men 的 Neck/UpperArm.L 命名不匹配 | 两组都要重定向/父节点适配；不能同名骨直接接 |
| 必要转换 | 父节点 `Rig_Medium`→`Rig`；23→41 骨；FBX/glTF；Godot 动画库导入；`handslot.l/r` 挂点；无手指 | UE 风格骨名→项目骨架；65 骨基座；完整版/Source 的 8 向 locomotion 裁循环（免费 Standard 仅前向）；QAL 许可裁决；无枪/弹匣 | 转换成本 KayKit 较低（同作者同骨架）；Quaternius 更高 |
| 拒绝条件 | 无放松 `Idle_HoldingRifle`、无 `Walking_HoldingRifle`；无枪/弹匣/接触；官方 1.1 免费档逐 clip 未直读 | 免费层无 rifle；无枪/弹匣/接触；QAL v1.0 与 CC0 冲突未裁决 | 两组都不能作为“完整供给” |

### 4.1b Quaternius 其他官方包的逐包映射

| 包 | 持枪 idle | 持枪移动 | 开火 | 完整 reload | 枪/弹匣独立节点 | 接触 | 预算/许可 | 判定 |
|---|---|---|---|---|---|---|---|---|
| UAL1 免费 Standard | 缺（只有 `Pistol_Idle_Loop`） | 缺（只有手枪；免费 Standard 只有前向 `Walk`/`Jog`/`Sprint`/`Crouch`，strafe/turn 需完整版/Source 或另补） | 部分（`Pistol_Shoot`） | 部分（`Pistol_Reload`） | 角色无 | 无 | 46 clip/53 joints/13,744 tris/2 materials/无贴图；CC0 + QAL 冲突 | 手枪最小集；不补 rifle |
| UAL2 免费 Standard | 缺 | 缺 | 缺 | 缺 | 无 | 无 | 43 clip/65 骨；CC0 + QAL 冲突 | 近战/跑酷/农活/僵尸；不补枪 |
| Animated Guns | 无角色 | 无角色 | 有 | 有 | `Magazine/Magazine_end` 在 P90/Pistol/Rifle/SniperRifle；`Slide` 仅 Pistol；`Trigger` 各枪；Revolver/Shotgun 无弹匣节点 | 无（无手/手臂） | 6 枪/约 954–2,812 tris/把；CC0 + QAL 冲突 | 武器侧补充；不补身体 |
| Toon Shooter | 部分/未核（有 `Idle`、`Idle_Shoot`；未逐帧确认是否持枪 idle） | 部分（`Walk_Shoot`/`Run_Shoot`） | 有（射击变体） | 缺（无 Reload） | 无；14 把枪各为单个 mesh 节点 | 无 | 17 clip/43 joints；CC0 | 同风格可玩 fallback；不满足四动作 |
| Ultimate Modular Men | 部分（`Idle_Gun`） | 部分（`Run_Shoot`） | 有（`Gun_Shoot`） | 缺 | 无 | 无 | 24 clip/每角色固定；CC0 + QAL 冲突 | 持枪移动/开火有，换弹缺；骨名与 UAL1 不匹配 |
| Universal Base Characters | 无 | 无 | 无 | 无 | 无 | 无 | 6 humanoids/26 models；CC0 + QAL 冲突 | 只作 UAL 重定向基座；不是动作供给 |

### 4.2 武器侧补充（不构成身体动作供给）

| 来源 | 开火 | 换弹 | 弹匣独立节点 | 枪机/套筒 | 手接触 | 身体动作 | 预算/许可 |
|---|---|---|---|---|---|---|---|
| [Quaternius Animated Guns](https://quaternius.com/packs/animatedguns.html) / [OGA](https://opengameart.org/content/low-poly-animated-guns) | 有 | 有 | `Magazine/Magazine_end` 在 P90/Pistol/Rifle/SniperRifle；Revolver/Shotgun 无弹匣节点 | `Slide` 仅 Pistol；`Trigger` 各枪 | 无（无手/手臂） | 无 | 6 枪、约 954–2,812 tris/把；CC0 标称 + QAL 冲突 |
| [Steel Tide AK-47](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/steel_tide_ak74/ak47_reloadable_fp.glb) | 无 clip | 无 clip | 有 `Magazine/SpareMagazine/MagazineGrip` | 有 `BoltHardwareGeometry` | 无（无手） | 无 | 11 mesh/30 nodes；CC0 |
| [Steel Tide SCAR-L](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/steel_tide_scarl/scarl_reloadable.glb) | 无 clip | 无 clip | 有 `Magazine/SpareMagazine` + `MagazineWellSocket/MagazineGripSocket` | 有 `BoltGeometry/TriggerGeometry` | 无（无手） | 无 | 10 mesh/21 nodes；CC-BY 3.0 |
| [DJMaesen animated reload arms](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/djmaesen_smg45/animated_reload_arms.glb) | 未核（24 个 clip 以 reload 为主） | 有 24 个 tactical/empty | 有 `LeftSidearmMagazineAnchorFrame` | 有 | 有 articulated magazine grasp / real-prop contact following | 只有手臂 | 49 joints/3 mesh/24,710 tris；CC BY 4.0 |
| [FPS-Arms-3D](https://github.com/Ayush-Mohanty/FPS-Arms-3D) | 有 `Shot` | 有 3 种 reload | 有 `Pmag/Mag_2` | 有 | 有手臂，接触需核 | 只有手臂 | 85 joints/3 mesh/40,023 tris；代码 MIT/美术 CC-BY-4.0 |
| [BigAndCrispy](https://github.com/BigAndCrispy/Unity-First-Person-Shooter) | 有 `AssaultRifle_Shoot`/`Pistol_Shoot` | 有 `AssaultRifle_Reload`/`Pistol_Reload` | 有 `Pistol_Magazine`/`Magazine` 骨 | 有 `Pistol_Slider` | 有手臂，接触需核 | 只有手臂 | CC0；无全身 |
| [MilitaryG](https://opengameart.org/content/pistol-animations-sounds-for-godot) | 有 `Fire` | 有 `Mag Out/Mag In` | 有 loaded/empty 两个弹匣节点 | 有 `Slide Pull/Release`、`Hammer` | 无（无手） | 无 | CC0；只手枪 |
| [3DAssets.dev](https://3dassets.dev/assets/fps-weapon-set-and-firing-range-smg-e216f9a5) | 无 | 有 `magazine-open/close` | 有 | 有 `stock-open/close` | 无 | 无 | 4 transform clips；CC0 |
| [CoinCoin Animated Pistol](https://opengameart.org/content/animated-pistol) | 有 `FIRE/FIRE_EMPTY` | 有 `RELOAD` | 有（第一人称手臂内） | 有 | 有手臂 | 只有手臂 | 18 clips；CC BY 4.0 |

**结论**：武器侧并不缺“Fire/Reload + 弹匣节点”的免费件；缺的是**这些枪件与 KayKit/Quaternius 身体层的同帧接触**。`DJMaesen`/`FPS-Arms-3D`/`BigAndCrispy` 证明接触可以由第一人称手臂层承担，但都是手臂层，不是全身角色；`Steel Tide AK/SCAR` 证明独立弹匣/弹匣井锚点可以做成可再分发 GLB；`Quaternius Animated Guns` 证明 CC0 标称的 6 枪有独立弹匣/套筒/扳机。把这三类拼起来是下一张卡的最小工程产物，不是本卡能直接采用的完整供给。

## 5. 前几项为什么最值得深挖

### 5.1 KayKit Character Animations 1.1（第一候选，身体层最近）

**最值得深挖的是“官方免费档到底有没有 `Idle_HoldingRifle` / `Walking_HoldingRifle`”，而不是再找一套新角色。** 官方页写 133 Humanoid animations、类别含 1H/2H shooting/aiming/reloading、CC0；Skeletons 全清单确实有 `1H/2H_Ranged_Aiming/Shoot/Shooting/Reload`；Adventurers 的 Knight 76 clip 有 `2H_Ranged_*`（Character Animations 里叫 `Ranged_2H_*`）、`Running_A/B`、`Running_Strafe_Left/Right` 与 `handslot.l/r`，但没有 `Running_HoldingRifle`——该 clip 只在 Character Animations 的 `Med_MovementAdvanced.glb`（13 clip）里。`2H_Ranged_Aiming` 1.600 s / `Ranged_2H_Aiming` 1.633 s（49 帧）是现成的双手远程瞄准循环，可先当步枪 ADS/站立持枪候选；它不是放松待机，未播放不能判定姿势适配。官方页、Skeletons 全清单、Adventurers 76 clip 都没有 `Idle_HoldingRifle`/`Walking_HoldingRifle`。如果官方 1.1 免费档确实有这两条（目前只有作者页宣传数 161/133 与二手评测评出的 131、再导出条目数 139，互相不可直接比较，也没有一条能证明这两条 clip 存在；官方 itch 读不到），KayKit 才能从“部分”变成“身体层四动作齐全”，但仍缺枪/弹匣独立节点与接触；如果确实没有，KayKit 只能当“跑/开火/换弹”的身体层，不能宣称完整持枪移动。

**下一步核法**：固定官方 1.1 zip（换可用网络或请作者确认），逐 set 列 clip；核对 `Rig_Medium` 与 `Rig_Large` 的差异（kayfabizarro 说 `Rig_Large: no ranged or blaster clip exists`）；核对 161/133/131/139 的口径（版本、Rig 大小；161 itch 与 133 官网为宣传总数，131 为 BINX 去 T-Pose 唯一名，139 为 sketchpunk 8 包条目数、去重 132 名）；核对 `handslot.l/r` 与手指骨；在 Knight 上按父节点合同 `Rig_Medium`→`Rig` 播放 `2H_Ranged_Aiming`/`Ranged_2H_Reload`/`Shoot`，先判定 aim 候选能否承担 ADS/站立持枪，再看握持与弹匣接触是否可读。**在这些核完之前，不把 KayKit 写成“完整供给”。**

### 5.2 Quaternius Animated Guns + UAL1（第二候选，武器侧最实用）

**最值得深挖的是“Animated Guns 的弹匣/套筒节点能否与 KayKit 的 `handslot` 同帧对上”，而不是 UAL1 的身体动作。** UAL1 免费 Standard 的枪械动作只有 `Pistol_*`（Defold 官方示例 45 条清单独立确认），没有 rifle；UAL2 无枪；Toon Shooter/Ultimate Modular Men 有持枪移动/开火变体但无 reload。`Animated Guns` 是唯一免费官方包同时有 6 把枪、Fire+Reload，且 `Magazine/Magazine_end` 在 P90/Pistol/Rifle/SniperRifle、`Slide` 仅 Pistol、`Trigger` 各枪。它不能补身体 idle/walk，但可以补“枪/弹匣独立节点 + 武器侧换弹”的几何与相位。

**下一步核法**：下载 OGA 包内的 FBX/OBJ/Blend（官方包**不含 GLB**，官网页只列 FBX/OBJ/Blend），用 FBX2glTF 或 Blender 转 glTF，再列节点名、弹匣行程、`Magazine_end` 时长、枪/手相对尺度；在 KayKit `handslot.r` 上挂枪、`handslot.l` 上对支撑手，检查 `Ranged_2H_Reload` 的左手是否落在护木/弹匣上；核对 QAL v1.0 是否允许把“修改后的枪件 GLB”随公开仓库提交（§3 禁止作为 asset pack/stock file 再分发；§2 允许 completed Product 内含；边界需 dot 或作者确认）。**如果 QAL 不允许，Quaternius 路线只能作为内部验证，不能进公开仓库。**

### 5.3 Operation Steel Tide AK/SCAR + DJMaesen/FPS-Arms（接触合同参照）

**最值得深挖的是“枪手—弹匣接触”的最小结构，而不是把它当第三套候选。** Steel Tide 的 AK/SCAR GLB 有独立 `Magazine/SpareMagazine`、`MagazineWellSocket/MagazineGripSocket`、`BoltGeometry/TriggerGeometry`；DJMaesen 手臂 GLB 有 24 个 tactical/empty reload、`LeftSidearmMagazineAnchorFrame`，并明写 articulated magazine grasp 与 real-prop contact following；FPS-Arms-3D 有 8 个 AK clip、`Pmag/Mag_2` 与 85 关节。这三者合起来能给出“主手带枪、支撑手取弹匣、弹匣井对位、枪机/套筒运动”的节点名与相位，是本卡 §6 最小产物的结构模板。

**下一步核法**：在 Blender/Three 里把 `Ranged_2H_Reload` 的左手与 SCAR 的 `MagazineGripSocket` 对位，记录接触帧；把 DJMaesen 的 tactical/empty 两段时序映射到同一武器状态机；确认这些 GLB 的许可（CC0/CC BY 4.0/CC-BY 3.0）与署名要求。**这仍是“接触参照”，不解决 KayKit 缺 idle/walk 的问题；不能拿它宣称完整供给。**

### 5.4 Mesh2Motion 预导出 GLB（如果 dot-B 允许第三组，最短路径）

**最值得深挖的是“唯一一个 CC0 身体层同时有 Rifle_Idle/Walk/Run/Fire/Reload”**：66 joints、逐条 GLB、`rifle-reload.glb` 64,572 B/2.7083 s、`Rifle_Walk` 1.2917 s、`Rifle_Run` 0.7917 s、`Rifle_Fire` 1.2083 s；无枪/弹匣节点、无 rifle aim、需 `MeshoptDecoder`。它不在本卡两组候选内，但它是“如果 dot-B 愿意换供给/开第三组”的最短身体层；仍需外接武器层（Quaternius Animated Guns / Steel Tide SCAR）并补 aim。

**下一步核法**：用 Three 0.186.1 + `MeshoptDecoder` 加载 `model.glb` + `rifle-*`，在目标机位看 idle→walk→run→fire→reload 的脚底/重心/握持；核 `Rifle_Reload` 的左手是否经过弹匣井；把 `Steel Tide SCAR` 的 `MagazineGripSocket` 对到左手。**如果 dot-B 不接受第三组，就停在证据层，不写入候选。**

## 6. 完整供给选择 / 无可采用候选与最小产物

### 6.1 选择

**选择“无可采用候选，保原角色”。** 理由不是“没有动作”，而是没有一组同时满足：

1. 免费、可商用、可随公开仓库再分发；
2. 同骨架持枪 idle + 持枪走/跑 + 开火 + 至少一种完整 reload；
3. 枪/弹匣独立节点与可读的手—弹匣接触；
4. 不改骨架权重、不手补动画即可接当前 Three 0.186.1。

KayKit 满足 1，部分满足 2（无放松持枪 idle、缺走路持枪；`2H_Ranged_Aiming` 只作 ADS 候选且未验），不满足 3；Quaternius 满足 1 的标称（QAL 冲突未决），不满足 2、3；Mesh2Motion/Red Eclipse/FPS-Arms 等满足部分 2/3，但不满足 1 或 4，且不在两组上限内。

### 6.2 针对现有 FPS 接线所缺的最小产物

本卡只写到规格，不新增代码/资产。下一张卡的最小产物应是：

1. **四动作槽位表**（§4.1）：`idle-rifle`（部分：无放松 `Idle_HoldingRifle`；`2H_Ranged_Aiming` 1.600 s / `Ranged_2H_Aiming` 1.633 s（49 帧）可作 ADS/站立持枪候选，映射前需播放确认）、`walk-rifle`（缺）、`run-rifle`（`Running_HoldingRifle` 0.8333 s，仅 Character Animations `Med_MovementAdvanced.glb`，当前消费者未映射）、`fire-rifle`（`Ranged_2H_Shoot`/`Shooting`，仅镜像/再导出，官方免费档待核）、`reload-rifle`（`Ranged_2H_Reload`，同上）。现有 `KayKitSkinnedCharacter` 只映射 `reload-one-hand`/`reload-two-hand`，没有 idle/walk/fire/run 槽，也没有枪/弹匣。
2. **武器/弹匣挂点合同**：`weaponRoot`（主手/`handslot.r`）、`supportGrip`（左手/`handslot.l`）、`magazine`（独立节点）、`magWell`/`magGrip`（对位锚点）。KayKit 只有 `handslot.l/r`；Quaternius Animated Guns 有 `Magazine/Magazine_end`（P90/Pistol/Rifle/SniperRifle）、`Slide`（仅 Pistol）、`Trigger`（各枪）；Steel Tide SCAR 有 `MagazineWellSocket/MagazineGripSocket`。把三者接起来是下一张卡的最小工程产物。
3. **拒绝条件**：没有放松 `Idle_HoldingRifle`、没有 `Walking_HoldingRifle` 就不宣称“完整持枪移动”（`2H_Ranged_Aiming` 只能作 ADS 候选，除非播放确认可替代站立待机）；没有独立弹匣节点/接触相位就不宣称“换弹完成”；没有官方 1.1 包原文/QAL 裁决就不把资源提交公开仓库；没有同机位角色图就不批准风格匹配。
4. **不做的**：不新建 IK 控制器遮掩缺动作；不把两个 reload 当整套动作；不用镜像/重包绕 403；不播放/截图冒充验证。

### 6.3 需要 dot-B 决定

| 事项 | 选项 | 推荐 | 影响 |
|---|---|---|---|
| 是否接受“本卡不换供给、保原角色” | 接受 / 不接受 | 接受 | 不接受则需明确换供给目标，另开卡 |
| 若必须换，是否扩大候选范围 | 第三组（Mesh2Motion/Red Eclipse/FPS-Arms）/ 付费（Kubold/KINEMATION/Infima/MoCap Online）/ 维持两组 | 先另开卡评估第三组，不在本卡偷加 | 扩大范围会改变许可/风格/接入成本，需单独验收 |
| Quaternius 派生动作能否进公开仓库 | 允许 / 不允许 / 先问作者 | 先按 QAL v1.0 禁止再分发处理，除非作者书面确认 | 决定 Quaternius Animated Guns 只能内部验证还是可入库 |
| 是否投入“作者补 walk（+ 必要时放松 idle）+ 枪/弹匣挂点” | 是 / 否 | 若保 KayKit 角色，这是最小内容补法；`2H_Ranged_Aiming` 先验 ADS/站立持枪，不适配再补放松 idle；需 DCC 作者，不是 IK 遮掩 | 会产生新的动作资产与验收成本，需另立制作卡 |

## 7. 未核与限制

- **KayKit 1.1 官方免费档逐 clip 未直读**：itch TLS/000；161/133/131/139 的口径来自作者页、BINX、sketchpunk、GeorgeQLe，互相不可直接比较：161（itch）与 133（官网）是作者页宣传总数，不保证含/不含 T-Pose；131 是 BINX 在 Free 1.1 GLB 中数出的 medium-rig 去 T-Pose 唯一名；139 是 sketchpunk 8 个 `Med_*.glb` 的条目数（每包含 T-Pose，去重 132 名）；GeorgeQLe 的 Rig_Medium/Large 文件合计 111 条；`Rig_Large` 是否有 ranged/blaster 只在 kayfabizarro 的 issue 里读到一个否定结论。**在这些核清前，不能把 KayKit 写成“四动作齐全”。**
- **Quaternius QAL 冲突未裁决**：包页/OGA 仍标 CC0，`license.html` 是 QAL v1.0（2026-08-28），§3 禁止把素材本身作为 asset pack/stock file 再分发，§7 不追溯。公开仓库能否放“修改后的枪件 GLB”需 dot 或作者确认。**未裁决前，Quaternius 不能作为公开仓库的正式供给。**
- **所有预览未在本单元观看**：KayKit 的 Character Animations 预览图收集记录称已看（机器人风格、一人持枪），但本单元未重开；Quaternius 的 YouTube 预览未看；`Animated Guns`/`Toon Shooter`/`Ultimate Modular Men` 未逐帧看。**姿势、握枪、弹匣接触、风格匹配都未验，不能当质量证据。**
- **未做 GPU/浏览器/实玩**：所有判断是文件/页面/字节层；没有 Three 实时画面、没有同机位角色图、没有 60 Hz 手感、没有音频。**最终选择需 dot-B 在真实角色同框图后作出。**
- **本单元复核范围**：Knight 76 clip/41 joints、Med_CombatRanged 20 clip、Med_MovementAdvanced 13 clip、UAL1 免费 Standard 46 clip、sketchpunk 8 包 139 条目/132 名、tps-demo 56 clip、查看器 `index.pck`（8,559,696 B）的 126/134 名、Animated Guns zip 成员与 FBX 节点、BAMEN 3,246,780 B 均在本单元重算。Mesh2Motion/Steel Tide/FPS-Arms 的逐 clip/节点数值仍沿用收集记录，未在本单元复算。**B 级数值中未列入本段的，应视为“收集记录实测”。**
- **渠道计数有重叠**：约 274 条是候选清单条目数（含同族/重复页面），不是独立源数；渠道表的“得到”是各渠道保留条目数，不能相加当总数。
- **公开扫描**：本文件已做文件级公开扫描（密钥/token/私网地址/本机绝对路径），未命中；整仓扫描、分支推送与 review_ready 仍按任务流程由上层执行。本文只含公开来源链接，不含本机路径。

## 8. 官方预览与视觉待验

| 候选 | 官方预览/入口 | 本单元看到什么 | 视觉判定 |
|---|---|---|---|
| KayKit Character Animations | [官方页](https://kaylousberg.com/game-assets/character-animations)、[官方预览图](https://kaylousberg.com/content/3-game-assets/4-character-animations/character_animations.png) | 官方页文字：133、Rig_Medium/Large、CC0、FBX/glTF；预览图收集记录称已看（机器人风格、一人持枪） | **待验**：不是逐动作图/同机位标准图；不能批准风格匹配 |
| KayKit Adventurers | [官方角色页](https://kaylousberg.com/game-assets/characters-adventurers) | 5(+3 EXTRA)、25+ 配件、1024 渐变图集、basic movement | **待验**：没有动作截图；同机位角色图仍缺 |
| KayKit Skeletons | [官方角色页](https://kaylousberg.com/game-assets/characters-skeletons) | 4(+2 EXTRA)、90+ animations 全清单、CC0 | **待验**：全清单可读，但无逐动作预览 |
| Quaternius UAL1 | [官方页](https://quaternius.com/packs/universalanimationlibrary.html)、[动画查看器](https://quaternius.com/animviewer.html)、[itch 页](https://quaternius.itch.io/universal-animation-library) | 官方页：120+、8 向（完整版/Source；免费 Standard 仅前向）、combat and gun、CC0；itch 页 000 未读 | **待验**：没有逐 clip 预览；YouTube 预览未看 |
| Quaternius Animated Guns | [官方页](https://quaternius.com/packs/animatedguns.html)、[OGA](https://opengameart.org/content/low-poly-animated-guns) | 6 把 animated guns、CC0、FBX/OBJ/Blend；OGA zip 可下 | **待验**：没有手/角色；枪件预览不等于接触可读 |
| Quaternius Toon Shooter | [官方页](https://quaternius.com/packs/toonshootergamekit.html) | 17 animations、CC0；收集记录解析 17 clip 无 Reload | **待验**：同风格 fallback，不满足四动作 |
| Mesh2Motion | [human GLB 目录](https://github.com/Mesh2Motion/mesh2motion-app/tree/main/static/assets/human) | 66 joints、rifle/pistol/crouch/death 单 clip GLB；无预览图 | **待验**：不是本卡候选；如扩范围需目标机位看 |
| Steel Tide 接触参照 | [DJMaesen arms](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/djmaesen_smg45/animated_reload_arms.glb)、[SCAR](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/steel_tide_scarl/scarl_reloadable.glb) | 节点/三角面可核；无预览视频 | **待验**：接触相位需在 Blender/Three 看 |

**视觉结论**：以上预览只作来源展示，不是假游戏截图；没有一张“KayKit/Quaternius 角色在同一 FPS 机位持步枪 idle/walk/fire/reload”的图。任务要求的“候选官方预览 + 视觉待验”已附；最终风格匹配与产品采用由 dot-B 在真实角色同框图后决定。

---

**依据**：固定输入 [FPS-Like `78a892c` 动作源包](https://github.com/dbvv1/FPS-Like/tree/78a892c6cf057ddb63b4fc21daafdd7e4313453a/asset-pipeline/character-action-sources)、[`2e77062` 蒙皮消费者](https://github.com/dbvv1/FPS-Like/blob/2e770621a6764bae43d68c1e4f33d28105dd0cf0/docs/skinned-character-consumer.md)；KayKit [官方页](https://kaylousberg.com/game-assets/character-animations)、[Adventurers repo](https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0)、[Skeletons 官方页](https://kaylousberg.com/game-assets/characters-skeletons)、[LICENSE](https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/blob/main/LICENSE.txt)、[OGA 1.2](https://opengameart.org/content/kaykit-character-animations)；Quaternius [UAL 官方页](https://quaternius.com/packs/universalanimationlibrary.html)、[QAL v1.0](https://quaternius.com/license.html)、[UAL1 OGA](https://opengameart.org/content/universal-animation-library)、[Animated Guns](https://quaternius.com/packs/animatedguns.html)；Defold [3d_animations 示例](https://github.com/defold/defold.github.io/blob/8d5015de40be1d3bf822a5f6ae5688c479195297/llms/examples/animation/3d_animations.md)；接触参照 [Steel Tide AGENTS.md](https://github.com/AetherRadar/operation-steel-tide/blob/main/AGENTS.md)、[FPS-Arms-3D](https://github.com/Ayush-Mohanty/FPS-Arms-3D)、[DJMaesen arms](https://github.com/AetherRadar/operation-steel-tide/blob/main/assets/models/djmaesen_smg45/animated_reload_arms.glb)。本单元整理与页面复核，2026-11-10。
