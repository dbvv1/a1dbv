# B-PIPE-MATERIAL-KTX-SEMANTICS-SOURCES-20261113 · 同族材质贴图归一来源

## 结论

**主选 Poly Haven 同一站点的三件套：Stone Wall 05（wall）、Brown Mud Dry（earth/road）、Grass Ground（forest/土草过渡）。** 三者都是 CC0 原文可商用、可再分发、可随产品出售；通道齐全（Diffuse、nor_gl、nor_dx、arm、Rough、AO、Displacement，1K–8K/16K），且 Poly Haven 官方 glTF 样例显示 `nor_gl` 接 `normalTexture`、`arm` 接 `metallicRoughnessTexture`，槽位语义有第一方证据。选同一站点，是为了先满足“一套材质”的风格与通道一致性，不把两个库的三张图拼成一层。

**ambientCG Ground 037 是唯一进入对照的跨来源候选。** 它 CC0、2.10 m、Height field photogrammetry，API 列出 color/displacement/normal/roughness/ambient-occlusion 与 1K–8K JPG/PNG；但 API 只暴露一个 `normal`，页面预览是 NormalDX，下载包的 `zipContent` 为空，无法在不取文件的前提下确认是否含 NormalGL。它只能作土草过渡的第一备选，采用前必须核 ZIP 或由消费端翻绿；未做同机位比较前，不与主选三件套混用。两个点名库都核过；主选集中在 Poly Haven 是为了先满足“一套材质”的一致性，不是漏看 ambientCG；若评审要求必须跨库，用 Ground 037 替换 Grass Ground，但先解决法线约定与风格差。

**归一契约（建议，未运行）**：albedo 用 sRGB/BT709；normal、arm、Rough、AO、Displacement 用线性/UNSPECIFIED；法线取 `nor_gl`（OpenGL +Y），不取 `nor_dx`；KTX2 时颜色 ETC1S、normal/数据 UASTC。当前消费者 `dbvv1/MOBA-Like@79bdb57439d2ca3e49c6560271d4a598999f5ac5` 只加载 earth/forest/wall 三张 albedo WebP，统一设 `SRGBColorSpace`，没有 normal/roughness/ARM 槽，也没有 KTX2Loader。本轮只定义来源与接入契约，不声称已接入、已压缩或已渲染。

**淘汰原则**：许可证原文不清、需要商业授权、禁止再分发或自动下载、或风格明显不符的条目一律不进入主选，原因逐条留在下文。

## 0. 任务边界与固定消费者

- 只看和写 `docs/collaboration/local-jobs/artifacts/B-PIPE-MATERIAL-KTX-SEMANTICS-SOURCES-20261113/result.md` 这一个产物；不下载贴图/材质资产，不登录，不改产品，不跑浏览器，不做贴图渲染，不拍图。
- 固定消费者：`dbvv1/MOBA-Like@79bdb57439d2ca3e49c6560271d4a598999f5ac5` 的 `src/render/quiet-family.ts`。实际引用：
  - `loadQuietFamily` 只请求 `asset-pipeline/quiet-family/exported/earth.webp`、`forest.webp`、`wall.webp` 三张图；逐张设 `texture.colorSpace = THREE.SRGBColorSpace`、`RepeatWrapping`、`LinearMipmapLinearFilter`、`LinearFilter`、`anisotropy = 4`。
  - `bindQuietGround` 只采样 `quietRoad` 与 `quietForest`，按 10 m / 12 m 的世界 XZ 周期混合；没有 normal/roughness/ARM 采样。
  - `wall` 由 `applyQuietBuildings` 经 `bindQuietStone` 以三平面、4 m 资产空间周期贴到六座塔/兵营/基地的石构件；仍然只采样颜色。
  - `asset-pipeline/quiet-family/README.md` 明写“Only albedo, no baked lighting or generated normal-map claim”，运行时下载 428,628 bytes、RGBA8 基础 18,870,192 bytes、完整 mip 估计 25,152,216 bytes；README 还指向 `source/generation-manifest.json`，并写明“image generation itself is not deterministic”，说明当前 albedo 是生成/编辑产物，不是扫描源。本轮用 CC0 扫描源替代，不用调色二改替代来源。
- 因此当前缺口是 albedo；normal/roughness/ARM 是后续扩展，不能把建议命令写成已接入。选源时同时看通道完整度，是为了给扩展留可用母版，不是宣称已消费这些通道。
- 版本与提交：glTF 规范固定 `KhronosGroup/glTF@f93f8afd4dff9252a4191e3e0538d4efe0e181b4`；KTX-Software 固定 `KhronosGroup/KTX-Software@f024f29e83e486460f8eed82bf57458ba92c4528`（该树 RELEASE_NOTES 标 5.0.0-rc2）；核对日期 2026-11-13。

## 1. 渠道覆盖表

| 渠道 | 实际看了什么 | 进入排序清单的产出 | 读不到或限制 |
|---|---|---|---|
| 任务与固定消费者（本地只读） | `job.md`；a1dbv 的 `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §3、`domains/game-dev/assets/materials.md`（正常制作链、通道同源、导入语义、场景贴图交付）、`experiments/p124-texture-consumer.md`；MOBA-Like 的 `quiet-family.ts`、`quiet-stone.ts`、`quiet-buildings.ts`、`world.ts` 与 `asset-pipeline/quiet-family/README.md` | 1 个固定消费者与 1 套内部归一先例；确定 3 个槽位、albedo-only、10/12/4 m 周期 | 无；这是本地只读副本，不是运行环境 |
| Khronos 规范与源码 | KHR_texture_basisu 固定 README；glTF 2.0 固定规范；KTX 2.0 规范；KTX-Software 的 `command_create.cpp`、`encode_utils_common.h`、`deflate_utils.h`、`encode_utils_basis.h`、RELEASE_NOTES、确定性 CI；Discussion #835；KTX issues #455/#600/#812/#839/#836/#1191/#1218/#1241/#383；PR #493/#1167/#1137；KTX Artist Guide、KTX Developer Guide、3DC MaterialsAndTextures、Data Format 1.3 | 约 25 项规范/源码证据；确定颜色与数据槽的 DFD 标签、法线 UASTC、v5 参数名与 8-bit PNG 默认 sRGB | `docs.khronos.org/ktx/` socket closed；`toktx.html` 404；KTX-Software 未构建、未运行 `ktx create`，版本取自源码树发布说明而非 `--version` |
| Poly Haven 官方 | 许可页、`llms.txt`、files API 15 个资产、info API 14 个资产、3 个资产页、官方 1k glTF 样例、摄影测量制作流程、Dev Log #18、仓库 issues #3/#5/#22/#46 | 3 个主选 + 12 个同风格备选/对照/淘汰条目 | `docs.polyhaven.com/en/faq` 与 `polyhaven.com/faq` 只返回标题（JS 渲染）；texture-color-calibration 页 JS-only；Blender addon 实际是资产下载器，不能作贴图槽/色彩空间证据 |
| ambientCG 官方 | 许可页、API v2 `full_json` 7 个资产、其中 5 个另取 `include=downloadData`（Ground037/Ground104/Ground111/Ground080/Rock030）、Asset page Ground037、creation-methods | 1 个跨来源备选 + 4 个替补/对照 + 2 个淘汰 | `zipContent` 为空，无法确认 ZIP 是否含 NormalGL/NormalDX 两套法线；API `maps` 只有单个 `normal`；页面预览只给 NormalDX；地面/岩壁候选中仅 Rock 051 带 metalness 图，其余无独立 metalness 文件 |
| 引擎与运行时文档 | three.js `KTX2Loader.js`、`GLTFLoader.js` 源码与 5 个 Discourse 帖；Godot `importing_images`、`StandardMaterial3D`；Filament Materials Guide；jMonkey Normal Types；PlayCanvas 法线方向帖；Babylon KTX2 法线/mip 帖；Khronos 社区转码格式帖；Unity/Cesium KTX2 帖 | 约 20 项；确定 OpenGL +Y、DFD 决定 colorSpace、normalScale.y 的消费端行为 | `discussions.unity.com` 的 `.json` 返回“Crawler is not allowed!”；Reddit search.json 与 old.reddit 均被拒；Unity 帖只读到 HTML 摘要 |
| 工具链与格式实现 | glTF-Transform CLI 与 discussions #625/#1614、issues #215/#388/#636/#1062/#1833；KTX2-Samples `encode.sh`；gltfpack；KTX-Parse；basis_universal；glTF-Compressor；glTF-Validator；kram；astc-encoder/Compressonator 等 | 约 20 项；作为语义和参数依据，不当作贴图来源 | GitHub REST API 未认证 403/rate limit；本机无 `gh`；改用 raw.githubusercontent 与 HTML；部分 release/star 查询未完成 |
| 社区与新闻 | HN Algolia 帖 40168519、21851457；Lobsters 搜索与原帖；dev.to KTX2 vs Draco；Graphics Programming Weekly #203；GameDev.net Week 45 | 6 项；用于法线方向、KTX2 收益量级、引擎默认工具链的时间锚 | HN 网页直连 curl SSL 35，改用 Algolia；Reddit 原帖不可读；Polycount 论坛 Cloudflare“Just a moment”，只读 wiki；web.archive.org 被策略拒绝 |
| 中文社区 | 掘金 2 篇（清单与 Web3D 性能）、B 站 2 个 opus（法线绿通道、贴图站清单）、cnblogs 2 篇（Poly Haven 接 three.js、WebGL KTX2）、shensunbo 的 `ktx create` 脚本、Any3D 两篇 KTX2 实战、CSDN 摘要 | 约 7 项可读；作为线索与反例，不作许可或通道的最终依据 | 知乎文章/问答 403，微信正文“环境异常”，B 站网页版验证码（仅 API 读到部分 opus），CSDN 521/400，小红书需登录；WebSearch 配额 200/200 已耗尽 |
| GitHub topic / awesome / Skill 市场 | 10 个 topic 的 stars 与 recently updated 两种排序；madjin/awesome-cc0、agmmnn/awesome-blender、magictools、Calinou/awesome-gamedev；约 15 个游戏/Blender/资产 Skill 仓库；dcc-mcp 组织页 | 约 10 个工具/技能候选（Kimbatt/cc0-textures、ambientcg-downloader、LilySurfaceScraper、pbr-doctor、TexturePipe-Toolkit、mcp-for-blender、dcc-asset-ambientcg 等）；0 个新贴图来源进入主选 | GitHub Trending 日榜/周榜无贴图、材质、资产管线仓库；Search API 403；SkillsMP、claudemarketplaces、ClaudePluginHub 只读搜索摘要，未逐页打开 |
| 商业/需登录/受限库 | Quixel Megascans/Fab、Poliigon、textures.com、Lightbeans、LotPixel、colormass、PolyScan、3DTexel、ShareTextures、EveryTexture、FreePBR、Location Textures、RawCatalog、CG Bookcase、PBRPX、LazyTextures、3DTextures.me、TextureCan | 约 18 个库；进入 C 类 8 个，进入 D 类 11 个；0 个进入主选 | Poliigon 403、textures.com 只返回标语、Lightbeans 429、TextureCan 分类页 Mod_Security 406、matlib.gpuopen.com 纯 JS 外壳、CG Bookcase 许可证据冲突、PBRPX 只有首页声明；Quixel/Fab 需账号且非 CC0 |

**渠道结论**：可核到“原始许可原文 + 官方 API + 静态预览 + 通道/尺寸”的，只有 Poly Haven、ambientCG、TextureCan、3DTextures.me、PolyScan、3DTexel、LazyTextures 等少数；其中同时满足“低反光旧石/干土/土草过渡、通道齐全、无需登录、可再分发”的，以 Poly Haven 三件套最稳，ambientCG Ground 037 是最接近的跨来源对照。

## 2. 筛选标准与排序方法

按以下顺序过门，任一门不过就降到 D 类并写原因：

1. **许可**：CC0 原文可商用、可修改、可再分发，且允许把原始文件放进游戏；不接受“免费但非商业”“需购买商业授权”“禁止再分发/自动下载/热链”“许可页读不到”。
2. **风格**：低反光旧石、干燥压实土、土与草的过渡；排除湿亮泥、脚印、橙色落叶、航拍级大尺度地面、城市碎砖等明显不符项。
3. **通道**：albedo + normal（GL 或 DX 可转）+ roughness + AO/arm + displacement/height；允许 metalness 用常量 0，但必须能确认非金属；缺 normal 或只有颜色图的不进主选。
4. **可操作性**：官方资产页 + 静态预览 + 官方 API/文件清单，不登录、不下载即可核对；优先同一 provider 的成套来源。
5. **消费者适配**：能对应 earth/forest/wall 三个槽位；PBR 通道是后续扩展，但源图必须齐全；不因源图好看而改变场景或重做 quiet 场景。
6. **证据等级**：第一方 API/官方 glTF > 官方文档 > 社区实测 > 搜索摘要；只有摘要的条目不作为许可或通道依据。

排序结果：A 类 3 项（本轮择定）、B 类 9 项（同风格备选）、C 类 12 项（合格但非首选）、D 类 17 项（淘汰/待核）。

### 2.0 许可原文（摘录，2026-11-13 核）

- **Poly Haven**：“Our assets are all licensed as CC0 ... You can use our assets for any purpose, including commercial work. You do not need to give credit or attribution ... You can redistribute them ... or even in a product you sell.”（https://polyhaven.com/license）
- **ambientCG**：“All ambientCG assets are provided under the Creative Commons CC0 1.0 Universal License. ... You can copy, modify, distribute and perform the assets, even for commercial purposes, all without asking permission. You can include the raw files in your project, for example a video game.”（https://docs.ambientcg.com/license/）
- **3DTextures.me**：站内 F.A.Q./About 标 CC0 1.0、可商用、免署名（https://3dtextures.me/about/）。
- **TextureCan**：`/terms/` 标 CC0 1.0、可商用、可再分发、免署名（https://texturecan.com/terms/）。
- **PolyScan**：站点与资产页标 CC0、免署名、最高 8K（https://polyscann.com/）。
- **ShareTextures**：自称 CC0，但 `/p/license` 附加禁止再分发、自动下载和热链（https://www.sharetextures.com/p/license），不进入主选。
- **Quixel/Fab**：Megascans 已在 Fab 免费，Quixel 新闻页并说明条款更新为允许用 Megascans/Megaplants 训练 AI 模型（https://quixel.com/news/update-megascans-are-going-free-again）；但许可仍是 Fab Standard License 而非 CC0：可商用、可修改并并入作品，“You may not: Resell or redistribute the asset for free on a standalone basis or allow others to do the same”（https://www.fab.com/eula），不进入主选。

## 3. 排序清单

### 3.1 A 类：本轮择定（3 项）

| 排名 | 资产与槽位 | 原始链接 | 静态预览 | 已核通道/尺寸 | 许可 | 入选理由 | 缺通道/不匹配 |
|---|---|---|---|---|---|---|---|
| 1 | Poly Haven · Stone Wall 05（wall） | https://polyhaven.com/a/stone_wall_05 | https://cdn.polyhaven.com/asset_img/thumbs/stone_wall_05.png?width=1024&height=1024&format=webp | Diffuse、nor_gl、nor_dx、arm、Rough、AO、Displacement，1K/2K/4K/8K；2.055 m；max 8192；官方描述 “timeworn stone blocks with rough, weathered surface, deep mortar joints and subtle moss” | CC0（Poly Haven 原文） | 与“低反光旧石”最贴近：古墙、风化、粗糙、深灰缝、少量苔；nor_gl/nor_dx 两套都在；同 provider 的官方 glTF 样例（old_stone_wall_02）把 nor_gl 接 normalTexture、arm 接 metallicRoughnessTexture，槽语义可直接照 | 无 Bump；无独立 metalness 文件（arm 的 B 通道，需确认接近 0）；roughness 数值未取样；2.055 m 源尺寸相对消费者 4 m 墙周期会放大约 1.95 倍 |
| 2 | Poly Haven · Brown Mud Dry（earth/road） | https://polyhaven.com/a/brown_mud_dry | https://cdn.polyhaven.com/asset_img/primary/brown_mud_dry.png?height=720 | Diffuse、nor_gl、nor_dx、arm、Rough、AO、Displacement、Bump、spec，1K/2K/4K/8K；1.30 m；max 8192；官方描述 “dry brown mud with coarse granules and small stones, rough, crumbly surface, dusty highlights and uneven compacted soil” | CC0（Poly Haven 原文） | 干燥、压实、粗颗粒与碎石，低反光目标；通道最全（连 Bump/spec 都有）；与 Grass Ground 同属摄影测量风格，适合 earth 槽位 | 无独立 metalness；displacement 没有 Z 方向尺度元数据（Poly Haven issue #3），高度幅度只能本地定；1.30 m 源尺寸相对 10 m 路周期会放大约 7.7 倍，纹样尺度需先比较 |
| 3 | Poly Haven · Grass Ground（forest/土草过渡） | https://polyhaven.com/a/grass_ground | https://cdn.polyhaven.com/asset_img/primary/grass_ground.png?height=720 | Diffuse、nor_gl、nor_dx、arm、Rough、AO、Displacement，1K/2K/4K/8K/16K；2.51 m；max 16384；官方描述 “worn grass on soil, matte and rough, with fine micro-bumps, subtle height, and natural brown-green variation” | CC0（Poly Haven 原文） | 直接覆盖“土与草的过渡”：稀疏磨损草、露出土壤、matte/rough、棕绿变化；16K 母版；与 1/2 同站同流程，三件套风格最一致 | 无独立 Bump；无独立 metalness；2.51 m 源尺寸相对 12 m forest 周期会放大约 4.8 倍；16K 对 MOBA 视距过剩，需要降到 2K/4K |

**主选三件套的共同点**：同一 provider、同一摄影测量/材质描述体系、同一套通道命名；全部 CC0 可再分发；全部有 nor_gl 与 nor_dx；全部有 arm（R/G/B 三通道打包的候选）；全部有独立 Rough/AO/Displacement。三件不是同一位作者（Stone Wall 05 与 Grass Ground 为 Charlotte Baglioni，Brown Mud Dry 为 Rob Tuytel），所以“同一作者成套”只做到同站同流程，仍要做同机位风格比较。

### 3.2 B 类：同风格备选（9 项）

| # | 资产与槽位 | 原始链接 | 已核通道/尺寸 | 理由 | 不匹配/待核 |
|---|---|---|---|---|---|
| 4 | ambientCG · Ground 037（forest/土草过渡，跨来源） | https://ambientcg.com/view?id=Ground037 | API maps：color、displacement、normal、roughness、ambient-occlusion；1K–8K JPG/PNG；2.10 m；Height field photogrammetry；tags damp/earth/forest/grass/green/moss/overgrown/rough/woodland；静态预览：https://acg-media.struffelproductions.com/file/ambientCG-Web/media/thumbnail/1024-PNG/Ground037.png | 唯一同时满足 CC0、官方 API、土草过渡标签、2.1 m 量级的 ambientCG 候选；作为主选的跨来源对照 | API 只给一个 `normal`；页面预览 NormalDX；`zipContent` 为空，NormalGL 是否在包内未知；无 metalness（非金属常量 0）；与 Poly Haven 三件套混用需同机位比较 |
| 5 | Poly Haven · Old Stone Wall 02（wall） | https://polyhaven.com/a/old_stone_wall_02 | Diffuse、nor_gl、nor_dx、arm、AO、Rough、Displacement，1K–16K；2.09 m | 技术证据最完整：清单里的 files API 示例（https://api.polyhaven.com/files/old_stone_wall_02）和官方 glTF 导出（https://dl.polyhaven.org/file/ph-assets/Textures/gltf/1k/old_stone_wall_02/old_stone_wall_02_1k.gltf）都指向它；16K，法线双方向；与 Stone Wall 05 同属旧石墙 | 与 Stone Wall 05 二选一，避免同一面墙混两种石砌风格；无 Bump（files API 顶层 map 只有 AO/arm/Diffuse/Displacement/nor_dx/nor_gl/Rough，另有 gltf/mtlx/blend 导出项） |
| 6 | Poly Haven · Old Stone Wall（wall） | https://polyhaven.com/a/old_stone_wall | Diffuse、nor_gl、nor_dx、arm、AO、Rough、Displacement，1K–16K；2.00 m | 古墙、粗糙、风化、砌石；中文索引译作“陈旧石材墙面”；通道齐全 | 与 1/5 构图相近，选一套即可；无 Bump |
| 7 | Poly Haven · Mossy Stone Wall（wall） | https://polyhaven.com/a/mossy_stone_wall | Diffuse、nor_gl、nor_dx、arm、AO、Rough、Displacement，1K–16K；2.00 m | 旧石 + 苔藓，16K，法线双方向；适合更潮湿的墙段 | 苔藓量比 Stone Wall 05 的“subtle moss”更重，可能偏离低饱和旧石；需同机位看 |
| 8 | Poly Haven · Rustic Stone Wall（wall） | https://polyhaven.com/a/rustic_stone_wall | Diffuse、nor_gl、nor_dx、arm、Rough、AO、Displacement，1K–8K；1.52 m；约 3.3 万下载 | 风化、old、uneven 的乡村石墙；8K 足够 MOBA | 更暖、更“村舍”，与旧石堡垒风格不完全一致；与 9 二选一 |
| 9 | Poly Haven · Rustic Stone Wall 02（wall） | https://polyhaven.com/a/rustic_stone_wall_02 | Diffuse、nor_gl、nor_dx、arm、AO、Rough、Displacement，1K–16K；1.50 m | 粗糙、缺损边缘、暖米棕，16K；适合更破败的墙段 | 比 Stone Wall 05 更暖、更碎，可能抢画面；与 8 二选一 |
| 10 | Poly Haven · Sparse Grass（forest/土草过渡） | https://polyhaven.com/a/sparse_grass | Diffuse、nor_gl、nor_dx、arm、AO、Rough、Displacement、Mask，1K–8K；2.00 m | 稀疏草簇 + 外露根 + 粗土，最贴近“土与草的过渡”；带 Mask 可做草土分区 | 没有 16K；草的形态比 Grass Ground 更“稀疏”，是否够绿需看预览；Mask 需要消费者额外接线 |
| 11 | Poly Haven · Brown Mud Rocks 01（earth） | https://polyhaven.com/a/brown_mud_rocks_01 | Diffuse、nor_gl、nor_dx、arm、AO、Rough、Displacement、Bump、spec，1K–8K；1.30 m | 泥、碎石、苔、杂草混合，通道最全；适合更杂的土面 | tags 含 wet ground；杂草和湿感可能偏离“低反光干土”；1.30 m 源尺寸放大问题同 Brown Mud Dry |
| 12 | Poly Haven · Forest Ground 04（earth/forest） | https://polyhaven.com/a/forest_ground_04 | Diffuse、nor_gl、nor_dx、arm、AO、Rough、Displacement，1K–8K；3.15 m | 干、棕、碎石/砾石，3.15 m 源尺寸比 1.3 m 的泥地更接近 10 m 路周期；适合 road/earth 的碎石段 | 偏干、偏棕，绿色少；若 forest 槽需要读成草地，不如 Grass Ground |

### 3.3 C 类：合格但非本任务首选（12 项）

| # | 来源/资产 | 原始链接 | 判定与理由 | 限制 |
|---|---|---|---|---|
| 13 | ambientCG · Ground 104（earth） | https://ambientcg.com/a/Ground104 | CC0；maps 同 Ground037；1K–8K JPG/PNG；tags beige/brown/crumbly/dirt/earth/granular/old/rough/soil/uneven，是合格的干土替补 | API 未给物理尺寸（0,0）；normal 约定同 Ground037 未知；无 metalness |
| 14 | ambientCG · Ground 111（earth） | https://ambientcg.com/a/Ground111 | CC0；1K–8K；2.80 m；砾石、泥土、建筑碎屑、rubble；若路肩需要“碎石+垃圾”质感可用 | urban/rubble 标签偏杂，和低反光旧石/干净土路不一定同风格；normal 约定待核 |
| 15 | ambientCG · Rock 030（wall） | https://ambientcg.com/a/Rock030 | CC0；1K–8K；cliff/grey/rock/stone/wall，灰色崖面且无 metalness 图（这两点与 Rock 051 的黄绿岩层+metalness 不同）；若要自然岩壁而不是人工砌石，可替代 Stone Wall 05 | API 的 `creationMethod` 标 PBRProcedural，但同一响应 `creationMethodName` 写 Height field photogrammetry，制作方式有冲突；物理尺寸 0,0（unknown）；normal 约定待核 |
| 16 | ambientCG · Ground 080（earth，技术对照） | https://ambientcg.com/a/Ground080 | CC0；1K–8K；three.js PR #31695 用它演示 BC5/EAC_RG 法线打包，便于把来源与引擎解码行为对齐 | beach/sand/yellow 标签，和目标干土/旧石不符；只作技术对照 |
| 17 | PolyScan · Old Stone Wall（wall） | https://polyscann.com/asset/old-stone-wall-c3ef67 | CC0、免署名；8K/4K/2K/1K；Albedo/Normal/Roughness/Height/AO，EXR+JPEG；无缝，有直链 .rar | 未标法线 GL/DX 约定；下载是 .rar、非官方 API；不在任务点名的两个库内 |
| 18 | TextureCan · Ground 0032（forest/土草过渡） | https://texturecan.com/details/258/ | CC0 1.0；base color、normal、roughness、displacement、AO；1K/2K/4K；池边草泥地，正对土草过渡 | 分类页被 Mod_Security 406；页面只写“通常包含”，需按具体包核；不在两个点名库内 |
| 19 | TextureCan · Ground 0042（wall） | https://texturecan.com/details/569/ | CC0 1.0；石墙资产免费给到 4K，通道齐全；可作母版 | 同上；构图是 medieval stone wall，需与 Stone Wall 05 比较 |
| 20 | TextureCan · Ground 0044（earth） | https://texturecan.com/details/621/ | CC0 1.0；泥土 + 树根，正对“土”题材；1K–4K | 同上；树根可能过强 |
| 21 | 3DTextures.me · Wall Stone 037（wall） | https://3dtextures.me/2026/05/12/wall-stone-037-free-seamless-pbr-texture/ | 站内 About 标 CC0 1.0、可商用免署名；旧石墙，含 albedo/normal/displacement/roughness/AO | 免费档只有 1K 且无 ORM；Patreon Tier 3 的 4K 档含 ORM（packed Occlusion/Roughness/Metallic）与 SBS/SBSAR；不在两个点名库内 |
| 22 | 3DTextures.me · Grass 004（forest） | https://3dtextures.me/2018/07/02/grass-004/ | 同站 CC0；含 diffuse/normal/displacement/roughness/AO，可直接下载 | 免费 1K；分辨率低，只适合远景或小样 |
| 23 | LazyTextures（库） | https://www.lazytextures.com/ | 全站 CC0，站点 sitemap 约 689 个资产，Stone/Rock/Sand/Grass/Forest 分类齐全，有 Public API 与 Blender 桥接 | “许可与下载权限分离”，部分资产走 Patreon；需逐条看资产页 |
| 24 | 3DTexel（库） | https://3dtexel.com/pbr-material/ | 1,079 个手工 CC0 PBR 材质，4K（部分 8K），含 Base Color/Normal/Roughness/Height，有 dirt/grass/brick 分类 | 下载需免费账号；AI/社区/付费资产另用 3DTexel License，不能与 CC0 部分混算 |

### 3.4 D 类：淘汰或待核（17 项）

| # | 来源/资产 | 原始链接 | 原因 |
|---|---|---|---|
| 25 | Poly Haven · Brown Mud 03 | https://polyhaven.com/a/brown_mud_03 | 通道齐全、8K，但 tags 含 wet soil、wet patches、footprints，与“低反光干土”冲突，风格淘汰 |
| 26 | Poly Haven · Brown Mud Leaves 01 | https://polyhaven.com/a/brown_mud_leaves_01 | tags 含 orange/forest，橙色落叶多，可能与本作低饱和配色冲突；同风格比较前不选 |
| 27 | Poly Haven · Aerial Grass Rock | https://polyhaven.com/a/aerial_grass_rock | 15 m 宽、8K，但 4K 也只有约 2.7 px/cm，MOBA 近景会显粗；只适合远景层，不作主选 |
| 28 | ambientCG · Ground 109 | https://ambientcg.com/a/Ground109 | 证据冲突：候选清单一处称“湿泥/湿斑、有光泽”，API tags 却是 dry/rough/mud/pebbles/soil；未复核前不采用 |
| 29 | ambientCG · Rock 051 | https://ambientcg.com/a/Rock051 | 带 metalness 图，预览为黄绿岩层的自然崖面，与“低反光旧砌石”不符；物理尺寸 0,0（unknown），wall 槽不匹配 |
| 30 | ShareTextures · Stone Wall 23 | https://www.sharetextures.com/textures/wall/stone-wall-23 | 名义 CC0，实为自定义条款：禁止再分发、自动下载、热链；不符合“可直接归一、可复跑获取”的要求 |
| 31 | FreePBR | https://freepbr.com/about/ | 免费下载仅限非商业；商业权一次性 19 美元；禁止再分发；不是 CC0 |
| 32 | Location Textures | https://locationtextures.com/ | 免费包仅样品/非商业；商业用途要 Freelance/Studio 许可；不是 CC0 |
| 33 | EveryTexture | https://everytexture.com/3d-maps/ | 自定义许可、非 CC0；缺 roughness/AO；禁转售原图、禁 re-host、禁 AI 训练；不满足完整 PBR 归一 |
| 34 | colormass | https://www.colormass.com/products/library （类别）；https://www.colormass.com/legal/colormass-3d-texture-library （EULA） | EULA 禁再分发、禁 AI 训练，并禁止让终端用户轻易提取原始贴图；公开 Library 页类别为 Fabric/Leather/Brick/Tile/Paper/Wood（均标 Scans），自述“limited number of high-quality scans”，未见旧石与土草 |
| 35 | Quixel Megascans / Fab | https://quixel.com/news/update-megascans-are-going-free-again （免费）；https://www.fab.com/eula （许可） | 资产量大、质量高，但许可是 Fab Standard License 而非 CC0；EULA 明确禁止 “Resell or redistribute the asset for free on a standalone basis”；需 Epic/Fab 账号；按本任务“合法可直接归一”与“不引入商业游戏资产”的边界淘汰 |
| 36 | RawCatalog | https://rawcatalog.com/license | 许可可撤销、年收入低于 10 万美元、需署名、禁止单独分发；不是 CC0 |
| 37 | Lightbeans | https://lightbeans.com/ | HTTP 429/安全校验，许可与目录未读到；按“许可不清即淘汰” |
| 38 | CG Bookcase | https://cgbookcase.com/textures/ | 证据冲突：一处读到 CC0 1.0 标签，另一处只读到 “100% free, no restrictions” 且 `/about`、`/pages/license` 404；许可未定前不采用 |
| 39 | PBRPX | https://pbrpx.com/ | 自称 CC0 Asset Library，但只有首页声明、无独立许可页；分辨率/通道未列；按“许可条款未读到”暂不采用 |
| 40 | Poliigon free / textures.com free / matlib.gpuopen.com / texture.ninja / freestylized / freepbr.com / texturefabrik | https://www.poliigon.com/free ；https://www.textures.com/free ；https://matlib.gpuopen.com/ ；https://texture.ninja/ ；https://freestylized.com/ ；https://freepbr.com/ ；https://texturefabrik.com/ | 分别因 403、只返回标语、纯 JS 外壳、许可正文不可读、无正式许可页、许可页 404、未给出明确 CC0/署名条款而淘汰；不把搜索摘要当许可依据 |
| 41 | Poly Haven · Forest Ground 01 | https://polyhaven.com/a/forrest_ground_01 | 8K、2 m，tags grass/twigs/leaves/dead grass/plant litter/underbrush；是林地落叶层，不是“土与草过渡”；与低反光干土/旧石目标不匹配 |

## 4. 前几项为什么最值得深挖

### 4.1 Stone Wall 05：把“旧石墙”从颜色层提升到可验证的槽位

它是三件套里风格匹配最直接的：官方描述就是“timeworn stone blocks … deep mortar joints and subtle moss”，标签含 ancient walls、worn、timeworn、weatherbeaten、rough；同时 nor_gl 与 nor_dx 都在，arm、Rough、AO、Displacement 也齐全。更关键的是槽位证据：Poly Haven 官方 glTF 样例（清单中的 `old_stone_wall_02` 1k 导出）把 `nor_gl` 接到 `normalTexture`、`arm` 接到 `metallicRoughnessTexture`、`metallicFactor` 设 0，且不接 `occlusionTexture`。这说明 provider 自己就按 glTF 的 normal + metallicRoughness 语义导出；把它接到 three.js/glTF 消费端时，不需要猜“arm 到底是哪三张图”。

深挖时要先解决两件事：一是 wall 槽当前是三平面、4 m 资产空间周期，而源图物理宽度约 2.055 m，纹样会被放大约 1.95 倍；二是关闭“只换颜色”的路径，先比对同机位下 roughness/法线加入后的高光与灰缝方向，确认低反光旧石不是靠调暗颜色装出来的。它没有独立 Bump、没有独立 metalness 文件，arm 的 B 通道是否为 0 也要在消费端核；这两点不影响作主选，但决定它能不能直接作为 PBR 母版。

### 4.2 Brown Mud Dry：土路的“干、粗、压实”基准

它把“土”的语义写得很具体：dry brown mud、coarse granules、small stones、rough、crumbly、dusty highlights、uneven compacted soil。对 quiet-family 的 earth/road 槽，这比“漂亮的泥地”更重要，因为路面需要低反光、颗粒感、没有明显水膜。通道也最全：Diffuse、nor_gl/nor_dx、arm、Rough、AO、Displacement、Bump、spec 全有，1K–8K，做 2K/4K 工作集都够。

它的主要风险是尺度：源图 1.30 m，而消费者把 earth 按 10 m 周期采样，等于把 1.3 m 的土块放大到 10 m；这会让碎石和颗粒看起来偏大。深挖时应先做同机位比较，决定是改采样周期（消费者改动，超出本任务）还是换 3.15 m 的 Forest Ground 04 作 earth 母版；不能只靠缩放贴图掩盖。roughness 数值也没有取样，官方描述只能说明“干”，不能证明目标灯光下一定低反光。

### 4.3 Grass Ground：土草过渡的同一站配套

它直接对应“土与草的过渡”：worn grass on soil、matte and rough、fine micro-bumps、subtle height、brown-green variation。和 Brown Mud Dry 放在同一套里，颜色体系、粗糙度语义、摄影测量流程都接近，比从另一个库拿一张“更绿的草”更容易形成一层材质。16K 母版对 MOBA 视距过剩，实际工作集用 2K/4K；nor_gl/nor_dx、arm、Rough、AO、Displacement 都在，后续加 normal/roughness 槽时不需要再找第二来源。

风险同样是尺度和风格：2.51 m 源图对 12 m forest 周期放大约 4.8 倍；如果同机位下草簇显得过大，优先考虑 Sparse Grass（2.0 m，带 Mask）或改采样周期，而不是把草纹理缩得很细。它没有独立 Bump，法线细节依赖 Displacement/nor_gl；如果后续要做视差或强凹凸，需要另配高度源。

### 4.4 ambientCG Ground 037：跨来源对照，但必须先解决法线约定

它是 ambientCG 侧最贴近“土草过渡”的候选：CC0、2.10 m、Height field photogrammetry，tags 含 damp/earth/forest/grass/green/moss/overgrown/rough/woodland，API 明确列出 color/displacement/normal/roughness/ambient-occlusion，1K–8K JPG/PNG，下载量 50 万级。把它纳入对照，是为了验证“同一目标是否只有 Poly Haven 能做”，以及给主选提供一个不同 provider 的备选。

但它不能直接进主选：API 的 `maps` 只有一个 `normal`，页面预览是 NormalDX，下载包的 `zipContent` 为空，无法确认 ZIP 内是否同时有 NormalGL/NormalDX；也没有 metalness 文件（非金属地表用常量 0 可以接受，但要确认）。深挖的第一步不是看颜色，而是拿到包后确认法线方向，或直接在消费端按 DirectX→OpenGL 翻绿后比较；第二步才是同机位风格比较。若这两步过不了，它只能留在 B 类，不进入“一套材质”。

## 5. 拟归一契约（建议，未运行）

### 5.1 逐槽设置

| 槽 | 源图 | 色彩空间/DFD | 通道/方向约定 | 建议格式 | 当前消费者 |
|---|---|---|---|---|---|
| baseColor / albedo | Poly Haven `Diffuse` | sRGB；KTX2 时 `KHR_DF_PRIMARIES_BT709` + `KHR_DF_TRANSFER_SRGB` | 颜色图，不含法线语义 | PNG/WebP 基线；KTX2 时 ETC1S | 已有 earth/forest/wall 三张 WebP，统一 `SRGBColorSpace`；无 KTX2Loader |
| normal | `nor_gl` | 线性；KTX2 时 `KHR_DF_PRIMARIES_UNSPECIFIED` + `KHR_DF_TRANSFER_LINEAR` | OpenGL +Y；RGB 线性映射到 XYZ，B 应大于 0.5；切线空间 | PNG 基线；KTX2 时 UASTC | 无 normal 槽；未接 `normalMap`/`normalScale` |
| metallicRoughness | `arm` 的 G/B | 线性/UNSPECIFIED | G=roughness，B=metalness；非金属石/土 metalness 应为 0 | UASTC 或未压缩 UNORM | 无 roughness/metalness 槽 |
| occlusion | `arm` 的 R 或独立 `AO` | 线性/UNSPECIFIED | R=occlusion；其余通道忽略 | UASTC 或未压缩 UNORM | 无 AO 槽 |
| displacement / height | `Displacement` 或 `Bump` | 线性/UNSPECIFIED | 灰度高度；没有 Z 方向物理尺度 | PNG16/EXR 16-bit 基线 | 无 displacement/height 槽 |

**arm 的 R 通道要实测再当 AO。** Poly Haven 自家 glTF 样例只把 `arm` 接到 `metallicRoughnessTexture`（G/B），并设 `metallicFactor = 0`，没有接 `occlusionTexture`；因此 R 是否就是 AO、B 是否严格为 0，都要在消费端逐通道读取确认，不能只凭 `arm` 命名。对于石/土这类非金属，B 应接近 0；若源图 B 有非零值，应先判断是金属性还是打包噪声。

### 5.2 规范依据

- **KHR_texture_basisu（固定提交）**：颜色数据必须 `BT709 + SRGB`；非颜色数据（normal、roughness-metallic 等）必须 `UNSPECIFIED + LINEAR`；`KTXorientation` 必须是 `rd` 或省略；`pixelWidth`/`pixelHeight` 必须是 4 的倍数；有 mipmap 采样时 SHOULD 带完整 mip 金字塔；颜色建议 ETC1S、非颜色建议 UASTC。来源：https://github.com/KhronosGroup/glTF/blob/f93f8afd4dff9252a4191e3e0538d4efe0e181b4/extensions/2.0/Khronos/KHR_texture_basisu/README.md
- **glTF 2.0（固定提交）**：`normalTexture` 必须线性，RGB 线性映射 XYZ，B 不应小于等于 0.5；`metallicRoughnessTexture` 的 G=roughness、B=metalness，必须线性；`occlusionTexture` 只用 R，必须线性。来源：https://github.com/KhronosGroup/glTF/blob/f93f8afd4dff9252a4191e3e0538d4efe0e181b4/specification/2.0/Specification.adoc
- **KTX v5 `ktx create` 源码（固定提交）**：`--assign-tf`、`--convert-tf`、`--assign-primaries`、`--assign-texcoord-origin`、`--encode basis-lz|uastc-ldr-4x4`、`--zstd` 是 v5 形式；8-bit PNG 无色彩信息时默认按 sRGB 处理，normal/ARM 必须显式 assign linear，否则会做隐式 sRGB→linear 转换。来源：https://github.com/KhronosGroup/KTX-Software/blob/f024f29e83e486460f8eed82bf57458ba92c4528/tools/ktx/command_create.cpp
- **glTF issue #993 / Godot 导入文档 / three.js 源码**：glTF 法线采用 OpenGL 约定 +X right、+Y up、+Z toward viewer；Godot 要求 X+/Y+/Z+，DirectX 图需开 `Normal Map Invert Y`；three.js `GLTFLoader` 在无顶点切线或导数切线时可能执行 `normalScale.y *= -1`，`KTX2Loader` 按 DFD 的 primaries/transfer 设 `texture.colorSpace`。来源：https://github.com/KhronosGroup/glTF/issues/993 ；https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_images.html ；https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/GLTFLoader.js ；https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/KTX2Loader.js

### 5.3 法线方向与格式的决定

- **选 `nor_gl`，不选 `nor_dx`**：当前消费者是 three.js/WebGL，glTF 与 Godot 的默认都是 OpenGL +Y；`nor_dx` 只在确认目标管线是 DirectX 时使用，或在消费端翻绿（`normalScale.y = -1` 一类）后再验证。不要同时接两套法线。
- **不要开 `--normal-mode` 作为默认**：该选项把 X 存 RGB、Y 存 alpha，shader 要用 `.ga` 重建 Z；glTF 的 `normalTexture` 只读 RGB、忽略 alpha，three.js 也不支持这种两通道布局。本仓 p124 实验里按普通 RGB 解释该布局时法线角误差均值 81.37°，属于反例。除非消费者明确支持两通道法线，否则保持 RGB XYZ。
- **KTX2 时颜色与数据分开**：albedo 用 ETC1S；normal/arm/Rough/AO/Displacement 用 UASTC 或未压缩 UNORM。UASTC 对法线的误差明显低于 ETC1S（p124 实验：512² 法线 ETC1S 均值 9.74°，UASTC 均值 2.37°，文件约 7.29 倍）；不能把“体积更小”当成唯一目标。该实验同时发现 ARM 源图带 gamma=0.45455，`--assign-tf linear` 逐字节保留，省略或改用 `--convert-tf linear` 都会改值；所以数据图必须显式 assign linear，不能依赖 PNG 元数据。
- **尺寸与 mip**：KTX2 要求宽高为 4 的倍数；有 mipmap 采样时 SHOULD 带完整 mip；8K/16K 源图在常见 GPU 上不一定可用（KTX issue #383 要求对超过 16384 的尺寸报警），不要直接把 8K/16K 当工作集。建议 wall/earth/forest 工作集先取 2K（wall 可 2K/4K），8K/16K 只作母版。
- **物理尺度**：消费者当前 earth 10 m、forest 12 m、wall 4 m 周期；三张源图的 capture extent 分别为 1.30 m、2.51 m、2.055 m。归一前必须同机位比较纹样尺度；如果特征明显过大，优先改采样周期或换更长 capture extent 的源（如 Forest Ground 04 的 3.15 m），不能只缩放贴图掩盖。

### 5.4 与当前消费者的差距

- `quiet-family.ts` 只加载 albedo；`bindQuietGround` 只采样 road/forest，`bindQuietStone` 只采样 wall 颜色。加 normal/roughness/ARM 需要改消费者材质、槽位、`colorSpace`（数据图应为 `NoColorSpace`/线性）与 shader；这是后续代码工作，不在本任务范围。
- 当前三张 WebP 都设 `SRGBColorSpace`。如果把 normal/ARM 也按 `SRGBColorSpace` 接，会二次解码；数据图必须线性。
- 当前没有 `KTX2Loader`。把源图转 KTX2 之前，先确认运行时加载器、转码器与目标设备；否则 KTX2 只是离线文件，不能算接入。
- 当前 `wall` 是三平面 4 m；`nor_gl` 在三平面下的切线基是否与资产空间一致，需要后续实测，不能只凭 nor_gl 文件名判定。

## 6. 核验记录与未决项

### 6.1 本单元实际执行的核验

| 检查 | 结果 |
|---|---|
| 固定消费者源码与 README | 已读 `quiet-family.ts`、`quiet-stone.ts`、`quiet-buildings.ts`、`world.ts`、`asset-pipeline/quiet-family/README.md`；确认 albedo-only、10/12/4 m 周期、无 normal/rough/ARM、无 KTX2Loader |
| Poly Haven 许可页 | HTTP 200；CC0 原文可读（2026-11-13） |
| ambientCG 许可页 | HTTP 200；CC0 1.0 原文可读（2026-11-13） |
| Poly Haven 资产页与预览 | Stone Wall 05（https://polyhaven.com/a/stone_wall_05）、Brown Mud Dry（https://polyhaven.com/a/brown_mud_dry）、Grass Ground（https://polyhaven.com/a/grass_ground）资产页均 200；三个静态预览 URL 均 200：Stone Wall 05 thumb 为 image/webp 约 128 KB，Brown Mud Dry 与 Grass Ground 的 primary PNG 约 2.2–2.5 MB。预览：https://cdn.polyhaven.com/asset_img/thumbs/stone_wall_05.png?width=1024&height=1024&format=webp 、https://cdn.polyhaven.com/asset_img/primary/brown_mud_dry.png?height=720 、https://cdn.polyhaven.com/asset_img/primary/grass_ground.png?height=720 |
| Poly Haven files API | 15 个资产（3 主选 + 12 备选/对照/淘汰）均 200；逐项核对 map 名称与 1K–16K 分辨率 |
| Poly Haven info API | 14 个资产均 200；核对 dimensions、max_resolution、tags、description、authors |
| Poly Haven 官方 glTF 样例 | 清单中的 `old_stone_wall_02` 1k 导出（https://dl.polyhaven.org/file/ph-assets/Textures/gltf/1k/old_stone_wall_02/old_stone_wall_02_1k.gltf）已读：nor_gl→normalTexture、arm→metallicRoughnessTexture、metallicFactor=0、无 occlusionTexture |
| ambientCG API | 7 个资产（Ground037/Ground104/Ground111/Ground080/Rock030/Ground109/Rock051）均 200；核对 maps、dimensions、creationMethod、tags；Ground037 的 1K–8K JPG/PNG 下载项与大小已核 |
| ambientCG 下载包内容 | `downloadFolders.default.downloadFiletypeCategories.zip.downloads[].zipContent` 为空；无法确认 NormalGL/NormalDX 两套法线 |
| 预览可访问性 | ambientCG Ground037 thumbnail 与 surface-preview 均 200（image/png、image/jpeg） |
| 规范/源码 | KHR_texture_basisu、glTF 2.0、KTX 2.0、KTX v5 `command_create.cpp` 与相关头文件、KTX #835、glTF-Transform #625/#1614、KTX2-Samples `encode.sh` 已读；未构建 KTX-Software，未运行 `ktx create` |
| 修正项独立复核（2026-11-13，直接抓取原文） | Poly Haven files API `old_stone_wall_02` 顶层 map 为 AO/arm/Diffuse/Displacement/nor_dx/nor_gl/Rough（另有 gltf/mtlx/blend），无 Bump；ambientCG `Rock051` 全量 API maps 含 metalness、尺寸 0,0,0、tags cliff/mountain/rock/stone/wall，颜色预览（1024² PNG 缩略图）为斜层理黄绿岩面；`Rock030` maps 不含 metalness、tags 含 grey；3DTextures Wall Stone 037 页面写免费档 1024²、Patreon Tier 3 解锁 4K+SBS/SBSAR、ORM 为 Patreon exclusive；colormass Library 页类别 Fabric/Leather/Brick/Tile/Paper/Wood（Scans），无计数；Fab EULA 原文含 “Resell or redistribute the asset for free on a standalone basis”，Quixel 新闻页只写免费与 AI 训练条款更新 |

### 6.2 未做与 unknown

- 未下载任何贴图/材质资产（含 ZIP）；为核对颜色与层理，只取过 ambientCG Rock 051、Rock 030 的 1024² PNG 缩略图并查看，未做全尺寸、像素级或同机位比较；其余静态预览只核了 HTTP 可访问性。
- 未采样 roughness 数值；低反光依据是官方描述与预览可访问性，不是实测。
- 未做同机位风格比较；三件套是否在同一灯光/相机下统一，unknown。
- 未做物理尺度比较；源图 capture extent 与 10/12/4 m 周期的关系只做了算术提示，未实际渲染。
- 未构建或运行 KTX-Software；`ktx create`、`ktx validate`、`ktx extract` 均未执行；所有命令参数只是契约，不是运行回执。
- 未运行 three.js/Godot/浏览器；未验证 KTX2Loader、normalScale、DFD colorSpace 在目标设备的实际表现。
- ambientCG Ground037 的 NormalGL 是否存在：unknown；只能确认 API 单个 `normal`、页面预览 NormalDX、ZIP 内容未暴露。
- CG Bookcase 的许可：证据冲突（CC0 1.0 标签 vs 仅 “100% free” 且许可页 404）；unknown，暂不采用。
- PBRPX 的独立许可条款：unknown，只有首页声明。
- Lightbeans、Poliigon、textures.com、matlib.gpuopen.com、texture.ninja 等：403/429/JS 外壳/许可正文不可读，未作为来源。
- 未核法务意见；“可再分发”按站点原文记录，不替代法律审查。

### 6.3 版本与日期

- 核对日期：2026-11-13。
- glTF：`f93f8afd4dff9252a4191e3e0538d4efe0e181b4`。
- KTX-Software：`f024f29e83e486460f8eed82bf57458ba92c4528`，该树 RELEASE_NOTES 标 5.0.0-rc2；没有运行 `--version`。
- 固定消费者：`dbvv1/MOBA-Like@79bdb57439d2ca3e49c6560271d4a598999f5ac5`。
- Poly Haven API：2026-11-13 返回；API 服务本身不是 CC0，若在产品/服务中调用需按其 Public API ToS 标注来源（https://github.com/Poly-Haven/Public-API/blob/master/ToS.md）；资产本身仍是 CC0。
- ambientCG API：v2 `full_json`，2026-11-13 返回；2024-12 起字段与下载链接有变更，旧脚本不能直接复用（https://docs.ambientcg.com/updates/2024/12/13/upcoming-changes-to-the-ambientcg-api/）。

## 7. 关键依据链接（仅使用本任务已核清单）

- 规范：KHR_texture_basisu（https://github.com/KhronosGroup/glTF/blob/f93f8afd4dff9252a4191e3e0538d4efe0e181b4/extensions/2.0/Khronos/KHR_texture_basisu/README.md）；glTF 2.0（https://github.com/KhronosGroup/glTF/blob/f93f8afd4dff9252a4191e3e0538d4efe0e181b4/specification/2.0/Specification.adoc）；KTX 2.0（https://registry.khronos.org/KTX/specs/2.0/ktxspec.v2.html）；glTF #993（https://github.com/KhronosGroup/glTF/issues/993）。
- KTX 实践：KTX v5 `command_create.cpp`（https://github.com/KhronosGroup/KTX-Software/blob/f024f29e83e486460f8eed82bf57458ba92c4528/tools/ktx/command_create.cpp）；Discussion #835（https://github.com/KhronosGroup/KTX-Software/discussions/835）；Artist Guide（https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/09480b6fb1e24f1f94c00cfa65cfe2f684e25b19/KTXArtistGuide.md）；Developer Guide（https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXDeveloperGuide.md）。
- 消费者行为：Godot 图像导入（https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_images.html）；three.js KTX2Loader（https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/KTX2Loader.js）；three.js GLTFLoader（https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/GLTFLoader.js）；Filament Materials Guide（https://google.github.io/filament/Materials.md.html）。
- 资产与许可：Poly Haven 许可（https://polyhaven.com/license）；Poly Haven API 说明（https://polyhaven.com/llms.txt）；Stone Wall 05（https://polyhaven.com/a/stone_wall_05）；Brown Mud Dry（https://polyhaven.com/a/brown_mud_dry）；Grass Ground（https://polyhaven.com/a/grass_ground）；Old Stone Wall 02（https://polyhaven.com/a/old_stone_wall_02）；ambientCG 许可（https://docs.ambientcg.com/license/）；ambientCG API v2（https://docs.ambientcg.com/api/v2/full_json/）；Ground 037（https://ambientcg.com/view?id=Ground037）；Fab EULA / Fab Standard License（https://www.fab.com/eula）；colormass Library（https://www.colormass.com/products/library）；colormass EULA（https://www.colormass.com/legal/colormass-3d-texture-library）。
- 交叉证据：Poly Haven 摄影测量流程（https://blog.polyhaven.com/photoscanned-texture-creation-process/）；Poly Haven Dev Log #18（https://blog.polyhaven.com/dev-log-18/）；Poly Haven issue #3（高度无 Z 尺度，https://github.com/Poly-Haven/polyhaven.com/issues/3）；glTF-Transform #625（ETC1S 不适合 normal，https://github.com/donmccurdy/glTF-Transform/discussions/625）；KTX2-Samples `encode.sh`（https://github.com/donmccurdy/KTX2-Samples/blob/main/encode.sh）；本仓 p124 纹理交付实验（`experiments/p124-texture-consumer.md`）。

## 8. 采用前的下一步（建议，不在本产物执行）

1. 在目标灯光/机位下对 Stone Wall 05、Brown Mud Dry、Grass Ground 做同一套色卡/曝光比较，确认三件套是否像一层；不同作者的两张石墙/草地要特别看色温与粗糙度。
2. 先按当前 10/12/4 m 周期接 albedo，比较纹样尺度；若明显过大，记录改周期或换 3.15 m 源的代价，不直接改场景。
3. 若扩展到 PBR：先接无压缩 PNG 基线，数据图用线性；normal 用 nor_gl，确认 three.js 的 tangential 行为后再决定是否翻绿；不要开 `--normal-mode`。
4. 若再上 KTX2：先构建 KTX-Software 并跑小样，核对 DFD 的 primaries/transfer、mip、4 的倍数尺寸与 three.js KTX2Loader；normal/ARM 用 UASTC，albedo 用 ETC1S；保留原始 PNG 与参数/hash，版本锁到具体提交。
5. 若采用 ambientCG Ground 037：先确认 ZIP 内 NormalGL/NormalDX，或按 DirectX→OpenGL 翻绿后做同机位比较；不要在不确认法线方向的情况下直接接 normal 槽。
