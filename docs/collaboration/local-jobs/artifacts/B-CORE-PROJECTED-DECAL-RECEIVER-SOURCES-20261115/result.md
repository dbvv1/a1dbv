# 环境弹痕只落到选中的表面：接收者、深度边界与有界呈现池

> 核实与采集：2026-11-18（UTC）。本单元只读公开源码、官方文档、issue／PR、论坛原帖、作者文章与问答 API；未运行 Unity、Unreal、Godot、Babylon、three.js 或任何渲染器，未生成、未比较画面截图。下文把“另一面会不会出现贴花”写成源码与官方契约可推出的行为，不写成实测画面结论；实施前须在目标版本复现。两个点名实现的行链接都带 commit，不随 master 漂移。

**先给结论。** 三个控制点按优先级是：**接收者身份 > 投影深度边界 > 有界呈现池**。任务点名的两个实现都只接受一个接收网格，并在投影器局部空间做六面裁剪：three.js `DecalGeometry` 只遍历传入 `mesh.geometry` 的顶点，先乘 `mesh.matrixWorld`、再乘投影器逆矩阵，六面半空间裁剪后乘回投影器矩阵写回世界坐标（[DecalGeometry.js L82-L207](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L82-L207)）；Babylon `CreateDecal` 只读一个 `sourceMesh` 的索引与顶点，用 `thinInstanceMatrix × meshWorld × inverseDecalWorld` 进入贴花局部空间，按 `±size/2` 六轴裁剪，背面剔除是可选项（[decalBuilder.ts L365-L440](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L365-L440)）。因此：**另一面墙若是独立 mesh，根本不会进入输出；真正会穿透的是同一薄网格的背面／双面，以及被合并成一个 mesh 的相邻墙。** 一块墙只让该墙入池的正例成立前提是“命中结果带接收 mesh 身份，且该 mesh 只含这面墙”；反例是两墙共享合并 mesh，或投影盒深度覆盖薄墙两面。

**指定消费者在任务固定 commit 中没有贴花。** FPS-Like 的 `ShotImpact` 只有 `origin／end／kind／killed`，只读反馈按 `impact` 是否存在生成短命事件（[feedback.ts](https://github.com/dbvv1/FPS-Like/blob/79bcf1d1e245c49077dc4ee6235ad8b408289441/src/candidates/offline-training-v1/render/feedback.ts)）；渲染端只对 `age<180` 且非 `range` 的命中，在 `impact.end` 朝 `origin`（射线反方向）偏移 0.018 后画一个球（同仓 `src/candidates/offline-training-v1/render/scene.ts` L184-L193）。所以接口第一步不是选贴花算法，而是把**命中面身份、法线与三角／子网格**带进只读事件；页面现有原则也要求“把已有射线的结果带出来，而不是在特效层再射一次”。

## 怎么用这份清单

1. **先做正例再谈反例。** 用第 6 节的一墙一发断言确认“接收者身份”真的生效；正例不成立时，先查命中 pick 是否返回了父级或合并后的整个场景 mesh，而不是继续调投影参数。
2. **按缺口读甲级。** 要实现 three.js 路线读 3.1；要实现 Babylon 或需要骨骼／thin instance 读 3.2；要 Unity 落地读 3.4；要判断“另一面墙会不会被印上”读 3.3 与第 7 节；要定容量与释放读 3.7、3.8。
3. **什么时候不该用几何裁剪。** 接收者会蒙皮变形、需要贴合曲面且贴花要跟随动画时，几何裁剪只能取创建当刻的姿态（three.js 在 #7926 中明确不支持动画网格；Babylon 支持骨骼，但论坛报告骨骼形变可能把贴花压到网格下方），应改纹理空间／蒙皮贴花路线（5.1）。要“只影响地面某层”时，先确认渲染管线是否提供逐对象接收掩码，没有再考虑投影深度与模板。

## 1. 渠道覆盖表

本表按首次发现渠道归类，跨渠道重复不重复计。数量表示通过链接检查且与“投影贴花接收者／深度边界／呈现预算”相关的候选覆盖，不等于逐条都写进正文；正文与附录只展开能改变决定的条目。大量与贴花无关的同批编码代理、Skills 与沙箱候选已按任务范围排除，不在此计数。

| 渠道 | 实际看了什么、取法 | 得到 | 读不到及原因 |
|---|---|---|---|
| 固定源码与官方仓库 | 用 raw.githubusercontent 读固定 commit 的 three.js `DecalGeometry.js`、Babylon `decalBuilder.ts`、Unity URP `DecalEntityManager`／`DecalUpdateCulledSystem`／`DecalScreenSpaceRenderPass`／`DBufferRenderPass`／`DecalCreateDrawCallSystem`、Godot `renderer_scene_cull.cpp`、O3DE `DecalTextureArrayFeatureProcessor.cpp`、Doom 3 `ModelDecal`／`ModelOverlay`、Quake 3 `tr_marks`／`cg_marks`、Bevy `examples/3d/decal.rs` | 16 项 | GitHub REST core API 共享出口 60 次/小时耗尽，改读网页 HTML 与 raw；个别仓库 README 在 main／master 均 404（Klian326）；Unity Issue Tracker 正文由客户端脚本加载，`/api/bff/issues` 返回 401，无法顺 issue 关联追 |
| 官方文档 | three.js Raycaster 与 decals 示例、Babylon decals 与 picking、Unity 6.7 URP／HDRP／Built-in Projector、Unreal Decal Actors／Materials／Mesh Decals、Godot Decal 类与 using decals、Bevy 0.16 release notes、O3DE Decal 组件、Flax decals | 24 项 | Valve Developer wiki「Decals」被 Anubis 机器人验证拦（页面、`action=raw`、`api.php` 都只返回挑战页）；CryEngine 两个旧地址 302 到 docs 首页；Epic 的 `en-us` 路径首次 403，去掉后才读到；部分 UE 页面正文由 JS 渲染 |
| 官方 issue／PR 与维护者答复 | three.js #21187、#7926、#29859、#34405、PR #29476／#29536／#16930／#29868／#26593；Babylon PR #13111／#13857／#16683、issue #13084；Godot issue #73706／#108248／#57284／#81889／#66027／#89467／#81143／#98259 与 PR #102399／#80911／#118070／#115653／#89235；Unity Graphics PR #6303 | 26 项 | GitHub API 限流；Unity Issue Tracker 的 UUM 页面只有导航壳；Unreal issues（UE-48717、UE-398225）403，只能由论坛转述 |
| 引擎论坛原帖（Discourse 与官方论坛） | three.js discourse #18442／#22156／#39205／#40910／#42740／#44803／#45464／#48934／#57166／#57819／#66455／#66462／#66615／#6812／#72467／#74691／#83397／#90549／#92284／#93546；Babylon forum #1804／#4822／#21007／#23141／#23357／#34571／#34589／#34867／#35332／#39579／#40759／#41665／#42062／#42096／#42114／#42399／#42914／#46972／#46995／#48631／#49902／#50502／#52349／#53250／#54362／#58682；Unity Discussions 与 Unreal 论坛的贴花串；Godot 论坛；Cocos 论坛；Real Time VFX | 约 120 项 | Reddit（含 old.reddit 与 PullPush）TLS 失败或被限流；Unity Discussions 的 `/search.json` 返回「Crawler is not allowed」，只能逐帖 WebFetch；部分 Discourse 只返回首帖、评论区未加载；部分论坛域名首次被安全校验拦，重试后才读到；Polycount 与 gamedeveloper.com 403；Lobsters 搜索反爬 |
| 英文作者、演讲与论文 | Wolfire 投影贴花三篇、Bart Wronski 屏幕空间修正、Martin Evans 与 Myre、Sam Driver 交互文章、Daniel Ilett URP 教程、Wicked Engine Forward+、Humus volume decals、MJP bindless、Aras 屏幕空间 mip、Simon Coenen DOOM Eternal、Adrian Courrèges DOOM 2016、Sledge 面裁剪、ezEngine mesh decal、SIGGRAPH 2012／2016／2018 PDF、Path of Exile 2 演讲、INSIDE 演讲 | 28 项 | Drew Cassidy 域名被劫持到无关垃圾页；Shader Bits 是 SPA 只加载标题；SlideShare TLS 证书失败；broniac.blogspot、petersikachev.blogspot、Patreon 连接被重置（000）；ExpMap PDF 传输约 2.9 MB 后超时；GDC Vault 站内搜索未找到 Space Marine 条目；YouTube 与 oEmbed 多数 SSL／000 |
| 中文社区 | CSDN 五方案对比与 `DecalGeometry` 源码拆解、掘金 Projector 原理与 Cocos 网格／屏幕空间、博客园 Lain_vv 的 Mesh Decal 全流程、知乎「游戏中的 Decal」（经 CSDN 转载核对）、B 站三支原理／实战视频及评论、Cocos 中文论坛 | 26 项 | 知乎正文与 `search_v3` 未登录 403（只能读标题／摘要与 Bing 片段）；微信公众号 Sogou 能列标题但跳转空、无法解析原文；少数派与即刻无相关结果；B 站 curl 直连 412，评论只取第一页；CSDN 部分页面 521；掘金部分正文只返回「Please wait...」 |
| 问答（StackExchange API） | gamedev.SE 210227／204719／205398／32095／15717／49878／24653；StackOverflow 54986584／72798925／60151128／70435／78450464／71902391／11237326／70888168／54308852／37912553 | 18 项 | 网页直连被 Cloudflare 拦，改用 api.stackexchange.com 2.3；SO 70435 的 API items 为空、疑已删除 |
| 市场、包与收录 | Unity Asset Store（Easy Decal、Dynamic Bullet Decals、Decalery、Skinned Decals、DECAL COLLIDER、Mesh Decal Painter PRO、Decalicious、Paint in 3D、First Person View 3、Piercable）、Fab（Persistent Decals、Easy Blood）、OpenUPM、npm、awesome 列表、skills 目录 | 15 项 | Asset Store 多个 listing 的 Description／Technical details 为空或 JS 渲染；评价页 301 到登录应用；Fab 动态加载；OpenUPM 搜索客户端渲染；Godot Asset Library 的 filter 返回 0，无法区分「无资产」与过滤失效 |
| 近三个月新东西 | Godot 4.8 beta 1（贴花动画与 Compatibility）、spite 的 2026 `THREE.DecalGeometry` 重写、`decal-projection-clipper`、AirSticker、KSP-BurnMarks、Juicee 等 | 12 项 | 部分新仓库零 star、无许可，只能标「待核」；GitHub trending 主题页超时或解析为空 |

**读不到的渠道合并说明。** 搜索入口方面，Google、Bing、DuckDuckGo（html／lite）、Startpage、Brave、Qwant、Mojeek 在本机分别遇到 TLS handshake、403 反爬、验证码或中文站群错配；WebSearch 工具多次只回显查询串或空结果，未产生可引用结果，因此发现主要靠候选互链、站点 API、Discourse JSON、GitHub 网页搜索与已知文档路径。存档回退方面，Wayback Machine、archive.org availability API 与 r.jina.ai 代理均不可达或为空，被 403／下线的原页无法用快照恢复。视频方面，YouTube 网页、oEmbed、Piped／Invidious 前端多为 SSL 或 socket 失败，只有 noembed 确认了 SimonDev 视频标题，SIGGRAPH 与 Path of Exile 2 的演讲内容未看。Valve wiki、SlideShare、broniac、Petersikachev、Patreon、Polycount、CryEngine 旧文档、Drew Cassidy、Shader Bits 的具体原因见上表；这些渠道未读到的内容没有据搜索摘要补写，也没有列为候选正文。

## 2. 筛选与排序口径

排序按任务的决定，不按 star 或热度。**甲级**是任务点名、且能直接回答“接收对象／空间变换／裁剪范围／不保证事项”的来源；**乙级**是支撑接收者选择、深度边界、释放与占用其中一项的官方契约或可复现证据；**丙级**是替代路线、中文实战、市场成品与待核新东西。等级只表示先读顺序，不是品质排名或完成验收。

- **门槛 A（点名实现）**：必须能定位到固定 commit 的行级源码，且能给出单接收网格、空间变换、六面裁剪与至少一条明确不保证。
- **门槛 B（接收者选择）**：官方文档或源码存在逐 mesh／逐层／逐材质的接收开关，能排除角色、HUD 或相邻物件；只有“投影体积”而没有接收者粒度的方案降级。
- **门槛 C（深度边界）**：有 `size.z`／projection depth／backface cull／normal fade 等可操作参数，且能说明它只影响深度方向，不替代接收者选择。
- **门槛 D（证据质量）**：优先维护者答复、可复现 fiddle／工程、多个独立用户复现；单条搜索摘要或市场文案只作线索。
- **门槛 E（释放与占用）**：源码或文档能看到容量上限、淘汰策略、dispose／Release 入口或占用检查；只说“用对象池”而没有接口的不进甲级。
- **排除**：与贴花无关的编码代理、Skills、沙箱、MCP、数据库等条目虽通过了链接检查，但不服务本任务决定，未列入正文；市场页缺技术描述时只标“待核”，不据标题推断实现方式；任何“画面会怎样”的结论都必须由实机复现，不能从裁剪代码直接写成通过。

## 3. 甲级：先深挖的八项

### 3.1 three.js `DecalGeometry`：单 mesh、六面裁剪、没有背面剔除

固定源码：[DecalGeometry.js L82-L207](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L82-L207)（构造函数在 L40，JSDoc 失真提示在 L15，裁剪在 L151-L156，UV 与写回在 L167-L173，顶点变换在 L189-L198，裁剪半宽在 L213）。以下逐项是本单元从该文件读出的契约，不是渲染结果。

| 维度 | 源码结论 | 依据 |
|---|---|---|
| 接收对象 | 构造函数只收一个 `mesh`；`generate()` 只读 `mesh.geometry` 的 index／position，索引与非索引各走一支。没有子节点遍历、没有多 mesh 参数、没有 `InstancedMesh` 分支、没有骨骼权重读取。接收者身份就是这一个几何。 | L40、L91、L101-L146 |
| 空间变换 | 投影器矩阵只由 Euler 旋转与 position 组成，没有 scale；顶点先 `applyMatrix4(mesh.matrixWorld)`，再 `applyMatrix4(projectorMatrixInverse)` 进入投影器空间；法线用 `normalMatrix`（`mesh.matrixWorld` 的法线矩阵）变换；裁剪与 UV 都在投影器空间完成，最后用 `projectorMatrix` 把位置写回世界坐标。 | L54、L58-L63、L167-L173、L193-L198 |
| 裁剪范围 | 六个轴向半空间依次裁剪，每轴半宽 `s = 0.5 * abs(size.dot(plane))`，即盒体范围为 `±size/2`。UV 按 `0.5 + x/size.x`、`0.5 + y/size.y` 生成，所以 `size.z` 是深度方向总长（盒体半宽为 `size.z/2`），`size.x／y` 同时决定投影面尺寸。 | L151-L156、L167-L168、L213 |
| 背面与法线 | 没有 `cullBackFaces` 参数，也没有“法线与投影方向点积”过滤；只要三角形落在盒内就进入输出。无 normal 输入由 PR #29536（2024-09-30 合并）支持，固定 commit 已包含该处理；输出可以没有 normal，因此不能假定每个接收者都有可判朝向的法线。 | generate 全段；[#29536](https://github.com/mrdoob/three.js/pull/29536) |
| 不保证事项 | JSDoc 自认“转角处投影会失真”，并直接链接 #21187；动画网格不支持（#7926 维护者建议复制／插值 skin indices 与 weights，未实现）；薄网格正反两面都可能出现（#22156、#40910）；直角边缘会拉伸或复制（#44803）；`InstancedMesh` 直接建贴花不显示（#66455）；`clone()` 曾有损坏（#29859，已由 PR #29868 修复并进入固定 commit）。这些是源码与 issue 共同确认的边界，不是单次调参问题。 | L15；[#21187](https://github.com/mrdoob/three.js/issues/21187)、[#7926](https://github.com/mrdoob/three.js/issues/7926)、[#22156](https://discourse.threejs.org/t/how-to-prevent-decalgeometry-from-going-through-mesh/22156)、[#40910](https://discourse.threejs.org/t/why-decal-is-visible-on-double-side/40910)、[#44803](https://discourse.threejs.org/t/decalgeometry-stretching-over-right-angle-edge/44803)、[#66455](https://discourse.threejs.org/t/decal-geometry-on-instanced-mesh-not-showing-up-even-if-renderorder-and-depthtest-are-set/66455)、[#29859](https://github.com/mrdoob/three.js/issues/29859) |
| 变换与附着修正 | PR #29476 把法线变换改为 normal matrix，并确认 `mesh.attach(decal)` 只适用于均匀缩放的父网格；PR #16930 修正法线未乘接收网格矩阵；PR #29486 演示把 decal 挂成接收 mesh 子节点。接收者一旦有非均匀缩放或父级动画，世界矩阵与法线都要重算，不能沿用建贴花时的矩阵。 | [PR #29476](https://github.com/mrdoob/three.js/pull/29476)、[PR #16930](https://github.com/mrdoob/three.js/pull/16930)、[PR #29486](https://github.com/mrdoob/three.js/pull/29486) |

**行链接：** [构造函数 L40](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L40)、[几何读取 L91-L146](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L91-L146)、[投影器矩阵 L54-L63](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L54-L63)、[六面裁剪 L151-L156](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L151-L156)、[UV 与写回 L167-L173](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L167-L173)、[顶点变换 L189-L198](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L189-L198)、[裁剪半宽 L213](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L213)、[JSDoc 失真提示 L9-L17](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L9-L17)。

**为什么最值得深挖：** 它是任务点名的实现，也是“单接收网格 + 盒体裁剪”最小可读样本。它把问题边界暴露得最干净：接收者由调用方选定，裁剪只保证“不出盒”，不保证“只印选中面”；背面、相邻面和薄墙都由接收者几何与盒深共同决定。官方 `webgl_decals` 示例还展示了完整消费方式：只对 `raycast.intersectObject(mesh)` 命中的单一 mesh 建 `DecalGeometry`，材质用 `transparent`／`depthWrite:false`／`polygonOffset:-4`，清理只从父级移除并清数组，没有容量上限，也没有 `geometry/material.dispose()`（[示例](https://threejs.org/examples/webgl_decals.html)）。这正好说明“裁剪正确”与“呈现池正确”是两件事。

### 3.2 Babylon `CreateDecal`：单 sourceMesh、可选背面剔除、骨骼与 thin instance

固定源码：[decalBuilder.ts L365-L440](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L365-L440)（签名 L64-L70，JSDoc L46-L62，轴向常量 L11-L16，逐实例矩阵 L355-L377，裁剪 L396-L407，UV L480-L481）。以下同样为源码阅读结论。

| 维度 | 源码结论 | 依据 |
|---|---|---|
| 接收对象 | `CreateDecal(name, sourceMesh, options)` 只收一个 `sourceMesh`；索引与 position／normal 全部来自它。`hasSkeleton` 为真时走 `getPositionData(true,true)`／`getNormalsData(true,true)` 取变形后的数据；`localMode` 或骨骼时输出局部坐标。JSDoc 明写 morph targets 不支持。 | L57、L64-L81 |
| 空间变换 | 由传入 `normal` 算 yaw／pitch，再由 `angle` 补滚转；`decalWorldMatrix = RotationYawPitchRoll(yaw,pitch,angle) × Translation(position)`；`transformMatrix = thinInstanceMatrix × meshWorldMatrix × inverseDecalWorldMatrix`。所有顶点与法线乘同一矩阵进入贴花空间；`localMode` 时额外保留局部位置／法线，供输出顶点写回局部坐标。 | L83-L99、L113-L130、L373-L377、L415-L445 |
| 裁剪范围 | 六个轴向半空间裁剪，半宽 `clipSize = 0.5 * abs(size.dot(axis))`；UV 同样是 `0.5 + x/size.x`、`0.5 + y/size.y`。因此 `size.z` 决定深度边界，`size.x／y` 决定投影面。 | L148、L396-L407、L480-L481 |
| 背面剔除 | `options.cullBackFaces` 默认关闭；开启后只在一个三角形的三个顶点法线全部背向观察方向（`-normal.z <= 0`）时丢弃该面。混合朝向的三角形仍会保留；法线缺失时默认 `normal.z=0` 会让三个顶点全判为背向而丢弃整面，故缺法线不要开 `cullBackFaces`（或先补法线）。 | L387-L393、L113-L117、L22 |
| 骨骼与实例 | 骨骼路径把裁剪产生的新顶点限制为 4 个骨骼权重并重新归一化（PR #13111）；thin instance 路径对每个实例矩阵单独生成（PR #13857）；morph target 仍不支持，创建后的贴花是静态 dump mesh，不随变形更新。 | L69-L81、L165-L202、L355-L377；[PR #13111](https://github.com/BabylonJS/Babylon.js/pull/13111)、[PR #13857](https://github.com/BabylonJS/Babylon.js/pull/13857) |
| 不保证事项 | 多 mesh 不支持，维护者明确“只能传一个 mesh，想覆盖多个物体就分别调用”（[#23357](https://forum.babylonjs.com/t/how-to-decal-multiple-meshes/23357)）；薄 mesh 正反两面都出现且会绕过边缘（[#23141](https://forum.babylonjs.com/t/how-to-position-and-size-a-decal-to-1-side-of-a-mesh/23141)）；靠边缘点击会溢到另一面并拉伸（[#53250](https://forum.babylonjs.com/t/the-following-situation-occurs-with-meshbuilder-createdecal-what-do-i-need-to-do/53250)）；骨骼形变可能把贴花压到网格下方（[#34571](https://forum.babylonjs.com/t/decals-are-not-supported-for-glb-files/34571)）；morph 只按初始形态生成（[#58682](https://forum.babylonjs.com/t/mesh-decals-with-morph-targets/58682)）；`localMode` 要求调用方先按网格变换预变换 position／normal（[#54362](https://forum.babylonjs.com/t/local-mesh-decal-positioning/54362)）；每个贴花是额外 mesh／draw call，释放与合并要项目自己做（[#34867](https://forum.babylonjs.com/t/decal-draw-calls/34867)）。 | L46-L62、L387-L393 与上述论坛帖 |

**行链接：** [签名与接收对象 L64-L81](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L64-L81)、[JSDoc 与 morph 限制 L46-L62](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L46-L62)、[朝向与矩阵 L83-L99](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L83-L99)、[逐实例变换 L355-L377](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L355-L377)、[背面剔除 L387-L393](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L387-L393)、[六轴裁剪 L396-L407](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L396-L407)、[裁剪半宽 L148](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L148)、[UV L480-L481](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L480-L481)。

**为什么最值得深挖：** 它提供了 three.js 没有的两个直接开关：`cullBackFaces` 与 `localMode`，也是唯一在官方源码里把骨骼权重、thin instance 和“单 mesh”限制同时写清的实现。它同时证明：**可选背面剔除只解决“法线全都背向”的三角形，解决不了合并 mesh、混合朝向和薄墙两面同时落在盒内。** 官方文档也明确：`size.z` 过大且未开 `cullBackFaces` 会从物体背面透出，morph targets 不支持，每个贴花是额外 mesh、比贴图 decal map 慢（[decals 文档](https://doc.babylonjs.com/features/featuresDeepDive/mesh/decals)）。

### 3.3 薄墙、相邻面与“内部面”的直接证据

这一组是第 6、7 节正反例的主要依据，全部为维护者答复或可复现帖，不是搜索摘要。

| 来源 | 结论与可操作信息 | 为什么排在这里 |
|---|---|---|
| [three.js #21187](https://github.com/mrdoob/three.js/issues/21187) | 角色肩部转角附近喷贴花会在相邻面复制同一张图；Mugen87 明确这是所用平面投影方案的限制并链接解释，issue 自 2021 保持 open。评论区有按视角方向丢弃背面顶点的 fiddle。 | 任务“相邻面复制”的直接证据；说明提高分辨率或换贴图不解决投影模型问题。 |
| [three.js discourse #22156](https://discourse.threejs.org/t/how-to-prevent-decalgeometry-from-going-through-mesh/22156) | 投影盒深度大于薄网格厚度时，贴花在正反两面都出现；Mugen87 建议缩小 projector size，或在 `pushDecalVertex` 按世界法线剔除，并说明复杂／曲面模型上仍可能失败。 | 给出“深度边界”与“自定义法线过滤”两条实际缓解，且承认不是通用解。 |
| [three.js discourse #40910](https://discourse.threejs.org/t/why-decal-is-visible-on-double-side/40910) | 模型足够厚时只出现正面，变薄后两面都出现；Mugen87 归因于投影器穿过网格、把前后两面都当成贴花几何；用户把 `size.z` 设为 0.1 后消除。 | 最干净的“薄墙两面”复现，直接支撑 `size.z` 是第二控制点。 |
| [three.js discourse #44803](https://discourse.threejs.org/t/decalgeometry-stretching-over-right-angle-edge/44803) | 单次 raycast 在直角边缘会把贴花拉伸或部分复制到相邻面；讨论认为单条射线没有简单的通用修法，只能改朝向（约 45 度）或用 three-mesh-bvh 近似球投射。 | 说明“命中点 + 单法线”在拐角处信息不足，接口需要三角／面信息或额外采样。 |
| [Babylon forum #23141](https://forum.babylonjs.com/t/how-to-position-and-size-a-decal-to-1-side-of-a-mesh/23141) | 用户只要贴底面，实际正反两面都出现且绕过边缘；没有直接单面开关，回复建议改 UV 展开，或拆 mesh／分材质。 | 与 #40910 跨引擎互证：这是投影体积的共性，不是 three.js 独有。 |
| [Babylon forum #42114](https://forum.babylonjs.com/t/decals-not-rendering-properly/42114) | 贴花出现在内部面通常是因为 pick 命中了里侧；维护者建议不要用 `fastCheck`，确保返回最靠近相机的交点。 | 接收者选择的第一步是“选对命中面”，不是调贴花参数。 |
| [Babylon forum #34589](https://forum.babylonjs.com/t/warning-logged-when-disposing-a-decal/34589) | 旧贴花 mesh 会被 pick 命中，进而对已 dispose 的网格再次 `CreateDecal`；接收者射线必须排除贴花自身。 | 呈现池的占用检查必须区分“场景物件”和“贴花产物”，否则第二枪会打在旧贴花上。 |
| [Godot issue #73706](https://github.com/godotengine/godot/issues/73706)、[论坛帖 61430](https://forum.godotengine.org/t/decal-bugged-in-the-border-of-a-wall/61430) | 改 mesh 的 visual layers 后 decal 的 cull layers 不更新，接收者掩码失效；另有墙边缘处用一侧法线污染另一面的帖子。 | 说明逐层接收掩码也会因引擎状态同步而失效，不能只信配置。 |

**为什么这三类先读：** 任务要的是“一块墙的正例 + 一对相邻薄墙的反例”，而这三类正好覆盖正例的接收者身份（#42114、#34589）、反例的背面（#22156、#40910、#23141）与相邻面（#21187、#44803、Godot 墙边缘）。它们还给出可操作的边界参数与失败条件，后续实现不必从零猜。

### 3.4 Unity：接收者靠 Rendering Layers／Receive Decals，深度靠 Projection Depth

a1dbv 主线是 Unity，这一组是把“另一面墙／角色／HUD”映射到 Unity 官方契约的关键。以下均为官方文档或 URP 源码可核对的说法。

| 来源 | 能回答什么 | 限制与坑 |
|---|---|---|
| [URP Decal Projector 参考](https://docs.unity.com/en-us/engine/6000.7/manual/visual-effects/decals/renderer-feature-decal/projector-reference) | 投影盒 Width／Height／Projection Depth 内的每个 Mesh 都会收到 decal；Angle Fade 按接收面顶点法线衰减；Draw Distance 控制远处停止；根节点被斜切时投影比例会错。 | 它描述的是“盒内所有 Mesh”，没有逐对象勾选；排除角色／HUD 必须另用 Rendering Layers 或材质开关。 |
| [URP Rendering Layers for decals](https://docs.unity.com/en-us/engine/6000.7/manual/lighting-overview/lighting/rendering-layers/decals) | projector 的 Rendering Layers 与接收对象的 Rendering Layer Mask 按位匹配；清除该层即可让角色或 HUD 不接收。 | 逐层过滤不是逐贴花过滤；同一层里的墙和角色无法只排除角色。 |
| [URP Decal Renderer Feature 参考](https://docs.unity.com/en-us/engine/6000.7/manual/visual-effects/decals/renderer-feature-decal/reference) | DBuffer 与 Screen Space 两种技术及限制：DBuffer 不支持 OpenGL／ES、粒子和地形细节；Use Rendering Layers 会引入 DepthNormal prepass；Normal Blend 质量影响采样成本。 | “接收者选择”会改变渲染路径和成本，不能只看功能开关。 |
| [URP decals 介绍](https://docs.unity.com/en-us/engine/6000.7/manual/visual-effects/decals/renderer-feature-decal/decal) | Decal Projector 必须用 Decal Shader Graph；透明表面不接收投影；不支持 SRP Batcher，可用同一材质 GPU instancing 与纹理 atlas 降 draw call。 | 透明／半透明接收面是明确不保证项；材质类型也限制可用的混合。 |
| [HDRP Decals 使用](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.0/manual/use-decals.html) | Rendering Layer Mask 选接收层；材质上的 Receive Decals 关闭比改 renderer mask 更能省成本；Decal Layers 会增加构建时间／内存／GPU 成本。 | 整网格级开关，不能只关角色身上的一张贴花。 |
| [HDRP Decals 概念](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.0/manual/understand-decals.html) | 区分 Decal Projector 与 Decal Mesh；Decal Layers 按材质／渲染层控制接收；mesh decal 只影响 opaque 且不能用 Decal Layers。 | 旧工程迁移时默认可能不接收；mesh decal 与 projector 的接收语义不同。 |
| [HDRP runtime decals](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.0/manual/create-decals-at-runtime.html) | 运行时实例化 DecalProjector prefab 会共享同一材质，改一个会影响全部，需要逐实例复制材质。 | 文档没有池化／释放方案，正好说明这部分要项目自管。 |
| [Unity Built-in Projector 参考](https://docs.unity.com/en-us/engine/6000.7/manual/visual-effects/decals/decals-birp/class-projector) | Near／Far Clip Plane 直接限定投影深度；Ignore Layers 可以按层排除接收者；正交模式用于贴花。 | Built-in 管线已弃用但仍随 6.7 LTS 维护；逐层排除同样不是逐对象。 |
| [URP `DecalProjector.cs`](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/Runtime/Decal/DecalProjector.cs#L283-L285) | 内部 `decalSize` 把 `(x,y,z)` 换成 `(x,z,y)`、`decalOffset` 换成 `(x,-z,y)`，并持有 size／drawDistance／fade／renderingLayerMask。 | 运行时改尺寸要按这个轴映射，不能直接把 Inspector 的 Width／Height／Depth 当世界轴。 |

**现场证据。** 投影器会印到墙背面和地板（[Unity 1538199](https://discussions.unity.com/t/how-to-prevent-decal-projector-from-rendering-through-objects/1538199)）；用户想要“被中间非平面物体遮挡”，官方没有内置方案，回复只能给拆层、spherecast 或模板（[Unity 908427](https://discussions.unity.com/t/is-there-an-easy-way-to-prevent-the-decal-projector-from-projecting-through-objects/908427)）；FPS 前景手臂／武器即使给前景相机禁用 decals 仍会被所有 projector 覆盖（[Unity 939694](https://discussions.unity.com/t/fps-foreground-cpass-decal-projector-and-clipping-problem/939694)）。Decal Layers 并非所有 shader 都遵守（[Unity 1712377](https://discussions.unity.com/t/urp-projector-decal-layers-dont-work-with-all-shaders/1712377)），WebGL 构建会忽略 Rendering Layers（[Unity 931215](https://discussions.unity.com/t/i-cant-get-light-layers-to-work-with-decals-for-webgl/931215)），Unity 6 新建 projector 默认指向 Default 而不是 Decal Layer（[Unity 1684414](https://discussions.unity.com/t/hdrp-decal-projectors-default-to-default-rendering-layer-mask-instead-of-default-decal-layer/1684414)）。数量侧：2000 个 projector 相机在 1000 米外且背对时仍把 CPU 渲染从 2.5 ms 拉到 18 ms（[Unity 1628747](https://discussions.unity.com/t/high-decal-count-kills-performance-regardless-of-their-distance-and-relative-direction-to-the-camera/1628747)）；同时禁用 5000 个约 1 秒并分配 300 MB（[Unity 939664](https://discussions.unity.com/t/deactivating-decal-projectors-causes-big-cpu-spikes/939664)）；逐发 `new Material` 会让 10–20 个贴花把 1080 Ti 从 130 降到 80 FPS（[Unity 807749](https://discussions.unity.com/t/decal-projector-performance/807749)）；100 个 projector 让 RTX 4080 从 112 降到 59 FPS（[Unity 917807](https://discussions.unity.com/t/decal-performance-barriers/917807)）。这些数字来自用户自述，未统一硬件与统计方法，只作量级参考。

### 3.5 Unreal 与 Godot：整网格开关 vs 逐层掩码

| 来源 | 能回答什么 | 限制与坑 |
|---|---|---|
| [Unreal Decal Actors](https://dev.epicgames.com/documentation/unreal-engine/decal-actors-in-unreal-engine) | decal 由非均匀缩放的盒体定义；当前页面仍写只支持 deferred、只对 static objects、normal blending 不包裹、masking decals（不影响其他物体）尚未完全实现；sort order 值过多会伤状态排序。 | “只对静态物体”是官方当前限制；角色／骨骼接收者需要另走 mesh decal 或材质方案。 |
| [Unreal Decal Materials](https://dev.epicgames.com/documentation/unreal-engine/decal-materials-in-unreal-engine) | DBuffer 是默认路径；同一表面同时只显示一个 DBuffer decal，重叠靠 Sort Order；static／skeletal mesh 暴露 Receives Decals；Decal Response 决定接收哪些通道。 | `Receive Decals` 是整网格开关，不能只让角色忽略部分贴花。 |
| [Unreal Mesh Decals](https://dev.epicgames.com/documentation/unreal-engine/using-mesh-decals-in-unreal-engine) | mesh decal 用贴合接收面的独立几何更新 GBuffer／DBuffer、不写深度，避免大投影盒的背面绘制。 | 没有美术可控 sort order、无 tangent space、LOD／深度精度会出问题。 |
| [Unreal 306088](https://forums.unrealengine.com/t/decals-overlapping-player-character/306088)、[762317](https://forums.unrealengine.com/t/ue5-how-to-player-mesh-ignore-some-decals-but-not-others/762317) | 角色靠近地面血迹会被贴花覆盖，官方回复是在角色网格上关 Receive Decals；一关就关掉全部。 | 世界空间贴花在骨骼动画上会随蒙皮滑动／泄漏；需要 stencil 或 static mesh decal 绕。 |
| [Unreal 574279](https://forums.unrealengine.com/t/ue4-27-how-make-certain-decals-ignore-player-mesh/574279)、[496469](https://forums.unrealengine.com/t/are-not-there-decal-blend-modes-on-ue-5-anymore/496469) | 墙／地形接受 DBuffer 通道，玩家材质 Decal Response 设为 None，同时保留可投角色的 Translucent 贴花。 | 需要改材质与 DBuffer 通道，不是单个 projector 参数。 |
| [Godot `Decal` 类](https://docs.godotengine.org/en/stable/classes/class_decal.html) | `cull_mask` 默认所有层，按 `VisualInstance3D.layers` 选接收者；有 distance／normal／vertical fade；只支持 Forward+／Mobile，Mobile 每个 mesh 最多 8 个 decal。 | Compatibility 渲染器不支持 3D decal（4.8 beta 才补）；透明材质不接收。 |
| [Godot using decals](https://docs.godotengine.org/en/stable/tutorials/3d/using_decals.html) | Extents 的 Y 轴决定投影长度，越短越利于裁剪；Normal Fade 阻止非正面接收；Sorting Offset 只作建议而非严格优先级。 | Forward+ 默认 512 个 clustered elements，与灯光／反射探针共享预算。 |
| [Godot `renderer_scene_cull.cpp`](https://github.com/godotengine/godot/blob/master/servers/rendering/renderer_scene_cull.cpp#L274-L283) | Decal 的 AABB 由 size 以原点为中心生成；接收配对按 decal 的 `cull_mask` 与 geometry 的 `layer_mask` 按位与判断，pair／unpair 双向更新。 | 这是“占用检查”的明确实现：层变化会触发重新配对。 |
| [Godot PR #102399](https://github.com/godotengine/godot/pull/102399)、[issue #73706](https://github.com/godotengine/godot/issues/73706) | PR 重做 cull mask 配对，层变化双向解除配对，避免每帧重复检查；issue 记录改 visual layers 后 cull layers 不更新。 | 掩码失效是真实 bug，不能只靠配置验收。 |

### 3.6 指定消费者：FPS-Like 的命中记录与短命反馈

固定源码：[feedback.ts](https://github.com/dbvv1/FPS-Like/blob/79bcf1d1e245c49077dc4ee6235ad8b408289441/src/candidates/offline-training-v1/render/feedback.ts)、同仓 `src/candidates/offline-training-v1/sim/types.ts` 与 `src/candidates/offline-training-v1/render/scene.ts`（本单元读取；后两个未在候选清单里另列链接，路径仅用于核对）。页面旧稿引用的 `2e318db` 在公开仓库已不可达（commit／tree／blob 均 404），无法核对；页面正文列出的 `ShotImpact` 字段与 `79bcf1d` 一致，结论以 `79bcf1d` 为准。

**入口链。** `src/default-route.ts` 把空首页解析为带 `gameplay=offline-training-v1` 的 `reviewedTrainingSearch`；`src/boot.ts` 用 `offlineTrainingCandidateEnabled(location.search)` 选择动态导入 `src/candidates/offline-training-v1/entry.js`；`src/candidate-route.ts` 只接受唯一的 `offline-training-v1` 值；候选 `client.ts` 引用 `./render/feedback.js` 的 `RESULT_HOLD_MS`，`scene.ts` 消费 `Feedback` 并按 `impact` 画短命球。该链路中没有 decal 创建调用，也没有接收者身份字段。

| 观察点 | 现状 | 对接口的含义 |
|---|---|---|
| 命中记录 | `ShotImpact = { origin; end; kind: 'actor'／'world'／'range'; killed }`；`Shot.impact` 可选，旧快照没有就跳过，不发明射线端点。 | 没有接收 mesh 身份、法线、三角／子网格。要落“只印选中墙”，必须在权威命中处补这些只读字段，或在同一事件里带一个 surface 引用；不能在特效层重射。 |
| 反馈消费 | `update()` 只把有 `impact` 的 shot 推入 `events`，按模拟时间计龄，超过 `RESULT_HOLD_MS` 过滤；`actor()` 只按 `shot.hit` 找角色做闪动／倒下。 | 贴花应是另一个消费通道，按事件键去重，不能寄生在 180 ms 的角色反馈里。 |
| 渲染端 | `visibleImpacts = effects.filter(e => e.age<180 && e.shot.impact!.kind!=='range')`；在 `impact.end` 朝 `origin`（射线反方向）偏移 0.018 画半径 0.035 的球，按年龄缩放；`reset()` 只隐藏，`dispose()` 统一释放 geometry／material。 | 现有实现已经有“短命、复用 mesh、集中释放”的雏形，但容量由并发命中数隐式决定，没有固定上限，也没有接收者键。贴花池可以沿用“View 持有 geometry／material、reset 隐藏、dispose 统一释放”的所有权，但必须补容量与接收者占用。 |
| 页面原则 | 本页「打击感与反馈」写明“实现起点是把已有射线的结果带出来，而不是在特效层再射一次”，并列出 `ShotImpact` 的只读字段。 | 接口扩展应保持“权威射线一次、表现层只消费”；贴花失败时丢弃或降级为短命冲击，不要回退到特效层重新 raycast。 |

**为什么值得深挖：** 它把“接口缺口”具体化到字段级：没有 `receiverId`，就无法做逐墙入池；没有 `normal`，就无法定投影朝向与 `cullBackFaces`；没有 `triangle`，合并 mesh 上就无法区分相邻墙。它也说明现有代码已经接受“旧快照缺字段就不补猜”的兼容原则，新增字段应保持可选、旧命令回放不报错。该消费者在 `79bcf1d` 中没有 decal，本清单不假设它已采用新机制。

### 3.7 Quake 3 与 Doom 3：有界池与接收面标记的完整样例

| 来源 | 能回答什么 | 可借的具体参数 |
|---|---|---|
| [Quake 3 `tr_marks.c`](https://github.com/id-Software/Quake-III-Arena/blob/master/code/renderer/tr_marks.c#L134-L300) | `R_MarkFragments`（L253 起）收集投影盒内的世界 BSP 面并逐面裁剪；`SURF_NOMARKS`／`SURF_NOIMPACT` 排除接收面；锐角面（法线与投影方向点积 > -0.5）直接跳过；点数／片段上限由调用方传入（见 cg_marks 行）。 | 接收面标记在引擎侧；不是所有面都该收贴花。 |
| [Quake 3 `cg_marks.c`](https://github.com/id-Software/Quake-III-Arena/blob/master/code/cgame/cg_marks.c#L88-L175) | 用固定大小的 `cg_markPolys` 空闲链表池管理 mark；`CG_AllocMark` 池满时回收最旧的活动 mark；临时 mark 不入池；mark 约 10 秒生命周期、1 秒淡出；`MAX_MARK_FRAGMENTS=128`／`MAX_MARK_POINTS=384`（[L127-L128](https://github.com/id-Software/Quake-III-Arena/blob/master/code/cgame/cg_marks.c#L127-L128)）由调用方传给 `R_MarkFragments`。 | 容量固定、按龄淘汰、淡出与回收是完整的一套。 |
| [Doom 3 `ModelDecal.cpp`](https://github.com/id-Software/DOOM-3-BFG/blob/master/neo/renderer/ModelDecal.cpp#L418-L540) | 由六个边界平面和纹理轴定义投影体，`GlobalProjectionParmsToLocal` 把平面／原点转到模型局部；逐个 model surface 做 bounds、`AllowOverlays`、背面三角形过滤后裁剪，另有深度 fade；L450-L451 注释与断言明确 decals 不支持动画模型。 | “接收面允许标记 + 背面过滤 + 局部空间裁剪”三件套。 |
| [Doom 3 `ModelDecal.h`](https://github.com/id-Software/DOOM-3-BFG/blob/master/neo/renderer/ModelDecal.h#L47-L58) | 固定容量 `MAX_DECALS=32/64`、`MAX_DEFERRED_DECALS=4/8`、`MAX_DECAL_VERTS`，decal 以 ring buffer 方式覆盖最旧。 | 直接给出池容量与替换策略的参考值。 |
| [Doom 3 `ModelOverlay.cpp`](https://github.com/id-Software/DOOM-3-BFG/blob/master/neo/renderer/ModelOverlay.cpp#L338-L420) | ModelOverlay 单独用 skinned joints，注释写明前后两面都投影以避免接缝（L340）。 | 按接收者类型分路径：静态用 decal，蒙皮用 overlay。 |

**为什么值得深挖：** 它把任务建议的“有界呈现池”落到可抄的常量与淘汰策略：固定容量、ring buffer、池满回收最旧、淡出、接收面标记、背面过滤。它同时证明“每发都新建 mesh”不是唯一做法，id 系在很早以前就把容量和接收面资格做进引擎数据结构。

### 3.8 AirSticker：最接近“命中面 → 接收网格 → 可移除”的现成接口

[AirSticker（CyberAgent）](https://github.com/CyberAgentGameEntertainment/AirSticker) 是 Unity 6、MIT、2026-10 仍活跃的运行时网格贴花。`AirStickerProjector` 直接指定 Receiver Objects（含其子 Renderer），按渲染器／材质生成贴合网格；`RemoveDecalMeshes` 可按组、接收者和材质释放；另有 Projection Backside 开关决定是否投到背面。README 要求接收模型开启 Read／Write，并给出 URP Decal 与网格法混用的性能数据；[README_DEVELOPERS](https://github.com/CyberAgentGameEntertainment/AirSticker/blob/main/README_DEVELOPERS.md) 进一步写了 mesh pool、接收者三角形池、球体 broad phase 与 projectionBackside 的实现。

**为什么值得深挖：** 它是本批里最接近目标接口的成品：接收者是一个显式对象列表，不是“盒内所有东西”；释放有按接收者／材质的 API；背面是一个明确开关。它也有清楚的代价：网格生成慢、要求可读 mesh、生成后不跟随形变，不能直接当动态弹痕的万能解。本单元未运行 Unity，未验证其实际画面与性能。

## 4. 乙级：按缺口读的契约、实现与现场证据

### 4.1 呈现池、释放责任与占用检查

| 来源 | 可借做法 | 边界 |
|---|---|---|
| [URP `DecalEntityManager.cs`](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/Runtime/Decal/Entities/DecalEntityManager.cs) | `DecalEntity` 池：free 索引复用、version 校验和 chunk 分块；新增／销毁走统一入口。 | 引擎内部池只服务 URP projector，不覆盖网格贴花；版本校验防止旧句柄误用。 |
| [URP `DecalUpdateCulledSystem.cs`](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/Runtime/Decal/Entities/DecalUpdateCulledSystem.cs) | 每 chunk 用 `CullingGroup` 查询可见 decal 并写 visible 索引。 | 可见性剔除不等于释放；离屏但仍注册的 projector 仍有 CPU 成本（见 3.4）。 |
| [URP `DecalCreateDrawCallSystem.cs`](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/Runtime/Decal/Entities/DecalCreateDrawCallSystem.cs) | 按场景剔除掩码、layer mask 与最大绘制距离过滤可见贴花并打包 draw call。 | 这是绘制前最后一层；容量与接收者占用仍要项目定义。 |
| [URP `DecalScreenSpaceRenderPass.cs`](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/Runtime/Decal/ScreenSpace/DecalScreenSpaceRenderPass.cs) | 屏幕空间路径在 Skybox 后执行且显式要求 depth；Decal Layers 参与过滤。 | 与几何裁剪是两条实现路径，深度与法线来源不同。 |
| [URP `DBufferRenderPass.cs`](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/Runtime/Decal/DBuffer/DBufferRenderPass.cs) | DBuffer 路径在 PrePass 后写入并依赖 depth＋normal。 | 平台／设置不同会切换路径，接收行为与成本随之变化。 |
| [URP `DecalUpdateCullingGroupSystem.cs`](https://github.com/Unity-Technologies/Graphics/blob/master/Packages/com.unity.render-pipelines.universal/Runtime/Decal/Entities/DecalUpdateCullingGroupSystem.cs) | 把每张贴花的包围球写入 `CullingGroup` 并查询可见索引。 | 只做可见性，不做容量淘汰。 |
| [kDecals](https://github.com/Kink3d/kDecals)＋[kPooling](https://github.com/Kink3d/kPooling) | URP 投影贴花，运行时创建并默认通过 kPooling 池化；有明确的借出／归还路径。 | 最后推送 2024-02；池容量与淘汰策略要按项目改。 |
| [Dynamic Decals](https://github.com/EricFreeman/DynamicDecals) | Built-in RP 动态贴花，文档含 masking（按 Unity layer）、pooling、printers、positioners 与自定义类型。 | SRP 不再支持；仓库无 SPDX 许可文件，商用前须核。 |
| [SkinnedMeshDecals](https://github.com/naelstrof/SkinnedMeshDecals)＋[OpenUPM](https://openupm.com/packages/com.naelstrof.skinnedmeshdecals/) | Collider→Renderer 绑定决定接收者；把贴花 blit 到目标 Renderer 的贴图而非裁剪网格；`QueueDecal`／`DecalProjection`／`DecalSettings`。 | 纹理空间路线，不能单独移除某一贴花；每目标多一张纹理。 |
| [MeshDecal（Fewes）](https://github.com/Fewes/MeshDecal) | 最小网格贴花组件：单 Mesh，支持 `SkinnedMeshRenderer` 但结果不跟随蒙皮。 | README 自述限制；适合核接收网格边界与序列化成本。 |
| [Persistent Decals（Fab）](https://www.fab.com/listings/52152ac3-7eb4-4857-b110-f2d743e16a4e) | UE 对象局部网格贴花：贴在命中的那个物体上，不像体积投影印到后面所有东西；支持静态／骨骼／ISM；上限 4096 对象×每对象 128 decal、约 44 MB VRAM、默认 5 秒清理间隔。 | 市场页自述，未试用；“对象局部”正是任务要的接收者粒度，但清理间隔与上限是产品参数。 |
| [O3DE `DecalTextureArrayFeatureProcessor.cpp`](https://github.com/o3de/o3de/blob/development/Gems/Atom/Feature/Common/Code/Source/Decals/DecalTextureArrayFeatureProcessor.cpp) | 按精确纹理布局把 decal 归入 texture array 复用；全部 array 占用且无匹配布局时拒绝新增并告警。 | 资源池占用／释放的具体实现；拒绝新增是明确降级策略。 |
| [PoolKit 演示](https://forums.unrealengine.com/t/poolkit-demo-video-pooling-actors-widgets-decals-and-meshes-with-a-live-debugger-ue-5-4-5-8/2843366) | Acquire／Release 比 Spawn／Destroy 快约 7 倍（104.7 ms→14.4 ms），并给池大小自动调优。 | 演示数据，未独立复测；可作“池化收益”的量级参考。 |

### 4.2 失败模式与现场证据

**薄墙、背面与相邻面。** 除 3.3 外，还可对照：three.js 曲面衣袖同一贴花镜像出现两次（[#66615](https://discourse.threejs.org/t/double-mirror-image-decal-geometry-on-curve-meshes/66615)）；合并贴花几何与源网格共面导致 z-fighting（[#6812](https://discourse.threejs.org/t/decalgeometry-clipping/6812)）；小尺度模型上 polygonOffset／renderOrder 都失效，最后沿法线抬 0.001（[#74691](https://discourse.threejs.org/t/fighting-with-decal-z-fighting-i-have-found-a-solution-but-i-cannot-understand-how-to-implement-it/74691)）；同位置叠第二张不显示（[#57166](https://discourse.threejs.org/t/multiple-decalgeometry-to-same-position-not-displaying-second-decal/57166)）。Babylon 侧还有右手坐标系下 glb 的贴花落到网格内侧（[#49902](https://forum.babylonjs.com/t/decal-creation-righthandedcoordinatesystem/49902)）、投影点在表面后方只显示一部分（[#46995](https://forum.babylonjs.com/t/only-part-of-decal-appears/46995)）、`zOffset` 必须按底层网格硬编码（[#42062](https://forum.babylonjs.com/t/decals-on-a-non-uniform-surface/42062)）。Unity 侧投影器会画到墙背面和地板（[1538199](https://discussions.unity.com/t/how-to-prevent-decal-projector-from-rendering-through-objects/1538199)）、不会像射线一样被第一个面挡住（[908427](https://discussions.unity.com/t/is-there-an-easy-way-to-prevent-the-decal-projector-from-projecting-through-objects/908427)）；UE 侧垂直墙残影（[73313](https://forums.unrealengine.com/t/how-to-limit-decals-bleeding-on-perpendicular-surfaces/73313)）、整墙穿透 ghosting（[1896497](https://forums.unrealengine.com/t/decals-ghosting-through-walls/1896497)）；Godot 侧墙边缘用一侧法线污染另一面（[61430](https://forum.godotengine.org/t/decal-bugged-in-the-border-of-a-wall/61430)）。

**角色、骨骼与变形接收者。** three.js 明说不支持动画网格（[#7926](https://github.com/mrdoob/three.js/issues/7926)）；Babylon 骨骼形变可能把贴花压到网格下方（[#34571](https://forum.babylonjs.com/t/decals-are-not-supported-for-glb-files/34571)），morph 只按初始形态生成（[#58682](https://forum.babylonjs.com/t/mesh-decals-with-morph-targets/58682)）；Unity 的 VFX Graph 贴花开启 Skinned Mesh 后大部分消失（[1541744](https://discussions.unity.com/t/spawned-decal-to-stick-to-a-skinned-mesh/1541744)），官方需要采样蒙皮网格／碰撞近似；UE 世界空间贴花在骨骼动画上会随蒙皮滑动／泄漏（[762317](https://forums.unrealengine.com/t/ue5-how-to-player-mesh-ignore-some-decals-but-not-others/762317)），Tom Looman 比较了 render target 伤口方案与每角色两张 RT 的成本（[文章](https://tomlooman.com/unreal-engine-render-character-wounds/)）；Godot 社区直接回答贴花是投影、没法按 UV 固定在复杂角色上（[106479](https://forum.godotengine.org/t/how-to-put-blood-decals-onto-a-mesh/106479)）。这些证据共同说明：角色不该作为环境弹痕的接收者；若必须做角色伤口，应走纹理空间／蒙皮贴花，而不是世界空间投影。

**HUD、视图模型与透明接收面。** Unity FPS 前景手臂／武器被所有 projector 覆盖（[939694](https://discussions.unity.com/t/fps-foreground-cpass-decal-projector-and-clipping-problem/939694)）；URP 贴花无法投到透明 GameObject（[gamedev.SE 205398](https://gamedev.stackexchange.com/questions/205398/how-to-make-a-decal-project-on-a-transparent-gameobjects-in-unity)）；URP 投影器随视角整块消失（[gamedev.SE 204719](https://gamedev.stackexchange.com/questions/204719/urp-decal-projector-decal-disappears-depending-on-viewing-angle)）；Unity 按 decal render layer 排除玩家仍会反射到角色（[gamedev.SE 210227](https://gamedev.stackexchange.com/questions/210227/decal-render-layer-not-working)）；UE `Receive Decals` 在动态网格、Vulkan 预览、Forward+MSAA 等配置下可能被忽略或仍留伪影（[1665195](https://forums.unrealengine.com/t/set-receive-decal-not-working-on-dynamic-mesh-component/1665195)、[2419016](https://forums.unrealengine.com/t/why-receive-decals-are-being-ignored-without-the-mobile-hdr-on-the-vulkan-preview-render/2419016)、[402449](https://forums.unrealengine.com/t/decals-cause-artifacts-on-objects-set-to-not-receive-them-under-forward-rendering-with-msaa/402449)）。所以“排除角色／HUD”要同时验配置、shader 与平台，不能只勾一个开关。

**重叠、排序与深度偏移。** three.js 官方示例曾修复相机移动时重叠贴花闪烁（[PR #26593](https://github.com/mrdoob/three.js/pull/26593)）；Babylon 自定义 `scene.setRenderingOrder` 的比较器无效（总返回 0）时，新旧贴花顺序会反转；#50502 的修法是实现真正的比较器（[#50502](https://forum.babylonjs.com/t/mesh-alphaindex-not-working-anymore-when-using-scene-setrenderingorder/50502)）；UE Sort Order 过多会破坏按状态排序（[1184429](https://forums.unrealengine.com/t/decal-sort-order-performance-implications/1184429)），mesh decal 与 projector 排序冲突可用 `r.DecalDepthBias`（默认 0.005）缓解（[252182](https://forums.unrealengine.com/t/sorting-bug-with-mesh-decals-decal-proj/252182)）；Unity Mesh Bias 只对直接挂 Decal Material 的 GameObject 生效、Projector 忽略（[URP Decal Shader Graph 文档](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@14.0/manual/decal-shader.html)）。深度偏移是第三层，不是接收者选择的替代。

**容量、剔除与释放。** UE 网格贴花即使屏幕占比极小仍完整处理，删掉全部节省约 30 ms（[1170670](https://forums.unrealengine.com/t/mesh-decals-never-culling/1170670)）；贴花按屏幕尺寸剔除、`Fade Screen Size` 设 0 才始终渲染（[753921](https://forums.unrealengine.com/t/how-can-i-fix-the-decal-draw-distance/753921)）；`Decal Lifetime Opacity` 必须配合 `SetFadeOut`，否则到期直接消失（[479974](https://forums.unrealengine.com/t/decal-lifetime-opacity-not-working/479974)）；Unity 2000 个弹孔 quad 已让 tris／verts 暴涨，回复建议到量后烘到共用贴图（[836333](https://discussions.unity.com/t/how-to-render-thousands-of-bullet-holes-with-good-performance/836333)）；Godot 运行时创建贴花会卡顿，开启 Distance fade 反而更贵，回复建议脚本按距离删除（[87257](https://forum.godotengine.org/t/creating-decals-on-runtime-freezes-the-game-for-a-few-seconds/87257)）；Godot 贴花纹理显存约翻倍（[144446](https://forum.godotengine.org/t/vram-usage-problem-with-decals-textures/144446)），且贴花纹理不进入 texture streaming 统计（[issue #124229](https://github.com/godotengine/godot/issues/124229)、[PR #113429](https://github.com/godotengine/godot/pull/113429)）。这些是“池要按显存与 CPU 两侧记账”的依据，不只是 draw call。

### 4.3 其他引擎的官方接收与深度模型

| 来源 | 能回答什么 | 限制 |
|---|---|---|
| [Bevy 0.16 release notes](https://bevy.org/news/bevy-0-16/) | 同时提供 forward（contact projective）与 clustered decal 两条路线；弹孔是最典型用途；陡角会拉伸；clustered 只对投影盒内物体求值。 | 平台支持不同；WasM 要 WebGPU。 |
| [Bevy decal 示例](https://bevy.org/examples/3d-rendering/decal/) | `ForwardDecal` 用 1×1 quad／材质投影，相机必须启用 DepthPrepass；地板＋随机旋转立方体验证非平面接收。 | 文档未提供接收者掩码。 |
| [Bevy 示例源码](https://github.com/bevyengine/bevy/blob/latest/examples/3d/decal.rs) | opaque／blend／add 三种 alpha 与不同 `depth_bias`，接收面为地板和 100 个随机旋转 cuboid。 | 只是示例，不是池化实现。 |
| [Bevy issue #19607](https://github.com/bevyengine/bevy/issues/19607) | 开放 issue 要求贴花只作用于同一 render layer 的网格，正是逐层接收过滤需求。 | 尚未实现。 |
| [Bevy PR #16600](https://github.com/bevyengine/bevy/pull/16600)、[#17315](https://github.com/bevyengine/bevy/pull/17315)、[#23036](https://github.com/bevyengine/bevy/pull/23036) | forward contact projective、clustered projector、GPU clustering 三条实现的上游记录。 | 版本与后端差异大，引用须带 commit。 |
| [bevy_contact_projective_decals](https://github.com/naasblod/bevy_contact_projective_decals)＋[issue #6](https://github.com/naasblod/bevy_contact_projective_decals/issues/6) | 基于 Path of Exile 2 分享的接触投影贴花；开放 issue 要求实体完全忽略贴花。 | WIP，不能当稳定依赖。 |
| [O3DE Decal 组件](https://docs.o3de.org/docs/user-guide/components/reference/atom/decal/) | 同一 mesh 可叠多个 decal；Attenuation Angle 让斜角处更透明以减少包裹；Sort Key 决定叠放；5 种纹理分辨率、base color 与 normal 必须同尺寸。 | 接收者粒度与参数耦合，未文档化逐对象排除。 |
| [Flax decals](https://docs.flaxengine.com/manual/graphics/decals/index.html) | decal 在 GBuffer Pass 后按屏幕空间绘制，成本随覆盖面积／着色器复杂度增长；sort order 默认值通常性能最好。 | 未文档化接收者掩码。 |
| [Godot 4.8 beta 1](https://godotengine.org/article/dev-snapshot-godot-4-8-beta-1/) | GH-115653 让 decal 可完整动画，GH-118070 把 decal 支持带进 Compatibility renderer。 | beta，不能按旧版推断低端后端与动画支持。 |
| [Godot PR #118070](https://github.com/godotengine/godot/pull/118070)、[PR #115653](https://github.com/godotengine/godot/pull/115653) | Compatibility decal 支持与 decal 全动画的上游改动。 | 需按目标版本核实际可用性。 |
| [ezEngine mesh decal](https://ezengine.net/pages/docs/effects/decals/mesh-decals.html) | 与投影贴花相对：贴图跟随网格拓扑、无投影畸变、用 atlas 槽位。 | 不适合“投到场景任意表面”。 |
| [Sledge decal clipping](https://logic-and-trick.com/page/decal-rendering-in-sledge.html) | 贴花被裁到面内不溢出，但多面行为不可预测、面属性变化后贴花不更新。 | 编辑器实现，不是运行时池。 |

## 5. 丙级：替代路线、中文实战、市场成品与待核新东西

### 5.1 替代路线：先判断该不该走几何裁剪

| 路线 | 代表来源 | 取舍 |
|---|---|---|
| 屏幕空间／延迟贴花 | [Bart Wronski 修正文](https://bartwronski.com/2015/03/12/fixing-screen-space-deferred-decals/)、[Martin Evans](https://martindevans.me/game-development/2015/02/27/Drawing-Stuff-On-Other-Stuff-With-Deferred-Screenspace-Decals/)＋[Myre 实现](https://github.com/martindevans/Myre)、[SIGGRAPH 2012 Space Marine](https://www.gamedevs.org/uploads/screenspace-decals-space-marine.pdf)、[SIGGRAPH 2016 id Tech 6](https://advances.realtimerendering.com/s2016/Siggraph2016_idTech6.pdf)、SIGGRAPH 2018 HDRP 讲稿（原页 404／406，本单元未读正文，不作依据）、[Wicked Engine Forward+](https://turanszkij.wordpress.com/2017/10/12/forward-decal-rendering/)、[MJP bindless](https://mynameismjp.wordpress.com/2016/03/25/bindless-texturing-for-deferred-rendering-and-decals/)、[Aras 屏幕空间 mip](https://aras-p.info/blog/2010/01/07/screenspace-vs-mip-mapping/)、[Humus volume decals](https://www.humus.name/index.php?page=3D&ID=83) | 不生成接收网格，能投到任意表面；但在轮廓／深度不连续处会出现晕圈、背景漏出与错误 mip，透明面与相机进入投影体时另需处理。Bart 文里的“clamp、SampleLevel、mesh decal、Forward+”对比是选型入口。 |
| 屏幕空间工程实现（Unity/URP） | [ColinLeung 屏幕空间 shader](https://github.com/ColinLeung-NiloCat/UnityURPUnlitScreenSpaceDecalShader)、[Daniel Ilett 教程](https://danielilett.com/2021-11-06-tut5-20-decals/)、[ProjectorForLWRP](https://github.com/nyahoon-games/ProjectorForLWRP)、[DMDecalBuffer](https://github.com/DMeville/DMDecalBuffer)、[Decalicious](https://assetstore.unity.com/packages/tools/particles-effects/decalicious-deferred-decal-system-74175)、[Aras 内置 Projector shader gist](https://gist.github.com/aras-p/8848786) | 能绕开 URP 自带 Decal 只有正交投影、不能透视的限制；仍受透明面、深度纹理与渲染顺序约束。 |
| 纹理空间／蒙皮贴花 | [SkinnedMeshDecals](https://github.com/naelstrof/SkinnedMeshDecals)、[Texture Space Decals](https://github.com/diharaw/texture-space-decals)、[MonkeyPaint](https://github.com/manthrax/monkeypaint)、[tichise ink-decal](https://github.com/tichise/ink-decal)、[Paint in 3D](https://assetstore.unity.com/packages/tools/painting/paint-in-3d-26286)、[Unity VFX Graph 粒子绘制](https://discussions.unity.com/t/vfx-graph-painting-with-particles/1549857)、[Babylon `meshUVSpaceRenderer`](https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/Meshes/meshUVSpaceRenderer.pure.ts) | 贴花写进接收者纹理，能跟随蒙皮与 UV；代价是不能单独移除某一贴花、每目标多一张（或多张）纹理、需要 UV 不重叠／不跨岛。 |
| 网格贴合／预生成网格 | [Driven Decals](https://github.com/Anatta336/driven-decals)、[Sam Driver 交互文章](https://samdriver.xyz/articles/decalsIntro.htm)、[Decalery](https://assetstore.unity.com/packages/package/293468)、[DecalCo](https://github.com/Master-J/DecalCo)、[GodotProjectedDecals](https://github.com/Miziziziz/GodotProjectedDecals)、[Screen-Space-Decals（Godot 3）](https://github.com/leopoldek/Screen-Space-Decals)、[antzGames Compatibility Decal Node](https://github.com/antzGames/Godot-Compatibility-Decal-Node)、[SanielX DeferredDecals](https://github.com/SanielX/DeferredDecals)、[bmjoy MeshDecals](https://github.com/bmjoy/MeshDecals)、[Gossiper TangentDecalUnity](https://github.com/GossiperLoturot/TangentDecalUnity) | 贴合精确、不依赖 GBuffer；但生成慢、接收网格变形后要重建，静态裂缝／涂鸦适合，动态弹痕不一定适合。Driven Decals 作者自己写明“生成后不跟随形变，不适合运行时弹孔”。 |
| UV／测地线参数化 | [ExpMap 论文](https://web.engr.oregonstate.edu/~grimmc/content/papers/sig2006tm/sig2006tm.pdf)、[matlabmesh](https://www.dgp.toronto.edu/~rms/software/matlabmesh/)、[heat method](https://www.cs.cmu.edu/~kmcrane/Projects/HeatMethod/)、[geodesic-heat-method](https://github.com/dipeshdulal/geodesic-heat-method)、[expmap.ts gist](https://gist.github.com/dipeshdulal/a7b4104f65f70d0df1c248360a04a9dd)、[three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) | 适合跨接缝、曲面无拉伸的 UV 生成；实现成本高，不是单发弹痕的第一选择。three-mesh-bvh 还能补单条 raycast 在棱角处定不出朝向的问题。 |
| 体素／体积贴花 | [Humus Volume decals](https://www.humus.name/index.php?page=3D&ID=83)、[续篇 Volume roads](https://www.humus.name/index.php?page=3D&ID=84)、[RTVFX 带深度裂缝 POM](https://realtimevfx.com/t/making-decals-with-depth/5963) | 在盒体／凸包内按深度重建局部坐标采样 3D 纹理，能避免接缝；需要额外体积纹理与采样，移动端成本高。 |

**选择线。** 环境弹痕是“短寿命、数量多、只需要落在可见表面”的效果，几何裁剪或屏幕空间都可；角色伤口是“长寿命、跟随蒙皮、需要逐部位”的效果，应走纹理空间／蒙皮贴花；静态裂缝、涂鸦、道路标线是“贴合精确、可预生成”的效果，走网格贴合或烘焙。不要把三条路线的接口混成一个。

### 5.2 中文实战与拆解

| 来源 | 可借结论 | 注意 |
|---|---|---|
| [博客园 Lain_vv：Shader 学习笔记 06 - 贴花](https://www.cnblogs.com/lain-vv/p/13749626.html) | Mesh Decal 完整拆解：获取投影框相交 mesh 的几种办法（手动指定／遍历静态物体／碰撞检测），逐三角形六面裁剪；背面剔除是可选项；相邻墙只靠投影盒截断；把所有点合并三角剖分会把中空处补上。 | 与 three.js／Babylon 的六面裁剪骨架一致，适合作为中文入口。 |
| [知乎：游戏中的 Decal（贴花）](https://zhuanlan.zhihu.com/p/100748588) | 把 decal 分成面片、改贴图、SubMesh、Multi-Pass、改 shader、后处理、Deferred、DBuffer 八类，逐类说明接收对象（静态／动态）、投影盒裁剪与性能边界；明确指出 decal 通常不支持骨骼动画，SubMesh 需用 Octree／BVH 找 AABB 相交 mesh。 | 正文 403，本清单依据 CSDN 同名转载与摘要核对，未读原帖评论区。 |
| [CSDN：Unity Shader-Decal 贴花五种实现](https://blog.csdn.net/puppet_master/article/details/84310361) | Mesh Decal 用代理立方体 AABB 选接收网格并逐三角形裁剪、沿法线外扩约 0.001 防 z-fighting；Projector 覆盖多个不规则表面但每个相交物体加 Pass；Deferred 用深度＋法线阈值剔除，并附 CPU／GC 与深度精度限制。 | 五方案横向比较，适合给“几何 vs 投影 vs 延迟”定边界。 |
| [CSDN：游戏中的 Decal 实现方式与缺点](https://blog.csdn.net/woliuqiangdong/article/details/120264941) | 逐项比较面片、改贴图、SubMesh 裁剪、Multi-Pass、改 shader、后处理和 DBuffer；指出面片只能贴平面、SubMesh 求交会漏三角形且静态耗时、Multi-Pass 在多网格／大网格上开销大。 | 综述，具体引擎行为仍要回源码。 |
| [CSDN：ThreeJS 实现 WEBGL Decal](https://blog.csdn.net/yaoyutian/article/details/124159940) | 把 `DecalGeometry` 源码摊开讲：顶点先 world space 再进投影器局部空间，六个轴向平面逐三角形裁剪，投影空间生成 UV 后写回世界空间；引用 Wolfire 的投影贴花文章。 | 与 3.1 的源码阅读一致，可作中文对照。 |
| [CSDN：three.js DecalGeometry 详解](https://blog.csdn.net/gitblog_00473/article/details/156595879) | 明确 DecalGeometry 是体裁切而非逐像素投射，跨拐角会失真、目标网格变形后要重建、空几何会被静默跳过、几何／材质释放未处理。 | 页尾标注 AI 辅助生成，需按源码复核。 |
| [CSDN：URP Decal Projector 组件介绍](https://blog.csdn.net/qq_36303853/article/details/149373071) | URP 贴花默认投射到前方所有物体，要靠 Rendering Layers／Rendering Layer Mask 限定接收层，深度“一般尽可能大”；透明表面不适用、直接挂 decal 材质的对象不接收。 | 与 Unity 官方文档互证。 |
| [CSDN：Unity URP 弹孔系统实战](https://blog.csdn.net/weixin_31306591/article/details/161406267) | 弹孔场景：Culling Mask 只留 Environment／Prop、排除 Player；建议正交投影、`DecalSize.Z` 取 0.05–0.12 防斜坡闪烁。 | 性能对比（30 billboard 42 FPS vs 120 decal 89 FPS）缺硬件与统计方法，不能直接采信。 |
| [CSDN：UE 角色取消被 Decal 影响](https://blog.csdn.net/qq_23091255/article/details/151083734) | UE 里正常贴花会影响角色，选中人物取消“接收贴花”即可让角色不被印上。 | 正文需关注博主才可读，只保留这一结论。 |
| [掘金：Unity 内置管线 Projector 原理分析](https://juejin.cn/post/7085912746360832007) | 视锥相交的 MeshRenderer 都参与投影，Ignore Layers 可按层排除；Unity 不做逐片元裁剪，相邻物体未被层排除就会承接贴花，每个相交物体增加一个 draw call、且 ZWrite Off。 | 解释“投影器为何会顺手印到别的物体”。 |
| [掘金：Cocos Decal 贴花效果](https://juejin.cn/post/7035826162777456648) | 以点击点为中心用立方体六面裁剪原 mesh，投影到平面算 UV 后新建 MeshRenderer 叠加。 | 未处理深度、背面、相邻墙或性能释放。 |
| [掘金：Cocos 类似 CS 的贴花](https://juejin.cn/post/7362789570218999871) | 子相机渲深度图，片元反算世界／模型坐标，用 VIEWBOX 长方体裁剪并采样贴花。 | 接收对象是场景模型，未讨论法线背面判断；额外子相机＋RenderTexture＋逐像素深度采样是成本。 |
| [掘金：ThreeJS webgl_decals](https://juejin.cn/post/6982695130322960420) | Raycaster 取交点和法线，`DecalGeometry(mesh, position, orientation, size)` 建贴花，材质用 depthTest／depthWrite／polygonOffset。 | 没有说明裁剪范围、背面穿透，也留下 depthWrite=false 的疑问。 |
| [掘金：地形、植被、道路、贴花 Decorator](https://juejin.cn/post/7218926523251261499) | 把弹孔贴花当作可烘焙内容：道路贴图和贴花最终烘焙进虚拟纹理分块，运行时成本很低、分块存续期间通常不需更新。 | 与“每次命中动态生成”是另一条工程取舍。 |
| [Cocos 论坛：贴花效果（20 回复）](https://forum.cocos.org/t/topic/125585) | 楼主用点击点立方体裁剪＋平面投影＋新 MeshRenderer；评论给出两个反例：封闭模型会在正面和背面各贴一张、第二次点击位置不正确，还有人指出点击 UV 识别精度低。 | 与 three.js／Babylon 的薄网格两面问题一致。 |
| [Cocos 论坛：深度图屏幕空间贴花](https://forum.cocos.org/t/topic/157671) | 同一屏幕空间方案的论坛讨论；评论追问旋转相机时贴花是否固定、深度相机该不该一起转。 | 暴露屏幕空间方案与相机／深度图绑定问题。 |
| [Cocos 论坛：模型上涂抹](https://forum.cocos.org/t/topic/147081) | 评论把几何贴花与延迟贴花分开，给出 three.js `webgl_decals`、Unity `DeferredDecals` 两个参考；另一条方案用 RT／UV 刷子修改贴图。 | 说明“每次命中生成 mesh”并非唯一选择。 |
| [Cocos 论坛：hitNormal 让弹孔面朝角色](https://forum.cocos.org/t/topic/161371) | 单面 plane 弹孔只有一面可见，提问者想用法线让弹孔朝向角色；帖无解答。 | 面片／单面 decal 在背面和侧向失效的一手问题样本。 |
| [B 站：URP Decal 系统原理分析](https://www.bilibili.com/video/BV1784y1x7Y7/) | 6 万播放的原理视频；评论区有人问“URP 自带 Decal 怎么忽略某些层级”，回复指向 render layer／渲染层级。 | 未看视频正文，只读标题与评论第一页。 |
| [B 站：Shader 里的贴花实现](https://www.bilibili.com/video/BV1a24y1379F/) | 评论区指出用深度图重建 localPos 可解决“相机进入 cube 看不到贴花”，并追问不同角度表面的拉伸，回复建议三平面／三向映射。 | 评论样本有限。 |
| [B 站：【UE5】如何创建射击弹孔](https://www.bilibili.com/video/BV1t8411N7zF/) | 评论区有人问“子弹穿过时一半在墙上一半不在墙上会怎么样”，正是深度边界和半穿透情形的用户侧疑问。 | 未看视频正文／字幕。 |

### 5.3 市场成品：只能作待核，不能据商店页推断实现

| 成品 | 页面信息 | 未核事项 |
|---|---|---|
| [Easy Decal](https://assetstore.unity.com/packages/package/22867) | $29.99，Sycoforge，Built-in／URP／HDRP 兼容；关键词有 Deferred／Screen Space／Projection。 | 商店页没有技术描述，接收者限制需试用或查文档。 |
| [Dynamic Bullet Decals System](https://assetstore.unity.com/packages/package/308881) | $16，Aligned Games，标题直指动态弹孔，Built-in／URP／HDRP、Unity 6000.0.33f1 兼容。 | 页面无描述与技术细节，不能判断是网格裁剪还是投影。 |
| [Decalery](https://assetstore.unity.com/packages/package/293468) | $28，Mr F 的网格贴花插件。 | 商店页未给投影方式、管线与限制；论坛帖称按贴花形状裁网格、保留 UV0／顶点色并从表面取 UV1／法线切线（[Unity 902953](https://discussions.unity.com/t/decalery-aka-bakery-decals-v1-2/902953)）。 |
| [Skinned Decals](https://assetstore.unity.com/packages/package/133483) | $29.99，Iron Sight，2019 年发布，标题即角色蒙皮贴花。 | 未核实现方式与性能；角色贴花是反向用例（环境弹痕不应印到角色）。 |
| [DECAL COLLIDER](https://assetstore.unity.com/packages/package/320572) | $7.50，Occlusionn，标题强调 Runtime Mesh & Collision Decals，关键词含 mesh generation／surface projection。 | 页面缺详情；若确为运行时网格＋碰撞，才可服务“命中面 → 接收网格”。 |
| [Persistent Decals（Fab/UE）](https://www.fab.com/listings/52152ac3-7eb4-4857-b110-f2d743e16a4e) | 明确“贴在命中的那个物体上，不像体积投影印到后面所有东西”，支持静态／骨骼／ISM；上限 4096 对象×每对象 128 decal、约 44 MB VRAM、默认 5 秒清理间隔。 | 自述参数，未试用；这是本批市场品里接收者语义最接近的一个。 |
| [Easy Blood - Skinned Decal System（Fab/UE）](https://www.fab.com/listings/c58f7f22-20f1-4095-b4c8-252231d1e8f3) | UE 骨骼网格贴花，可从命中逻辑调用 Paint，跟随骨骼／morph／布娃娃。 | 角色贴花而非环境弹痕；接收者白名单需另核。 |
| [Mesh Decal Painter PRO](https://assetstore.unity.com/packages/vfx/shaders/mesh-decal-painter-pro-312820) | 运行时绘制，宣称支持蒙皮网格与障碍物判定。 | 论坛帖作者自述，页面与实测未核。 |
| [Piercable Object System](https://assetstore.unity.com/packages/package/357950) | $9.99，Semih Durmus，主打“墙上真实洞”而非贴花。 | 另一路线（几何开洞）；Built-in 不兼容，页面缺技术细节。 |
| [Paint in 3D](https://assetstore.unity.com/packages/tools/painting/paint-in-3d-26286)、[First Person View 3](https://assetstore.unity.com/packages/tools/camera/first-person-view-3-167950) | 前者把贴花画进 RenderTexture；后者提供 FPS 手臂／武器单独 FOV 且不穿墙的相机与 shader 设置。 | 二手推荐，未购买或试用；只作替代路线与 HUD 排除的入口。 |

### 5.4 近三个月的新东西

| 来源 | 是什么 | 状态 |
|---|---|---|
| [spite `THREE.DecalGeometry` 2026 重写](https://github.com/spite/THREE.DecalGeometry) | 任务点名实现的 2026 重写：新增 `maxAngle` 过滤背向／掠射三角（作者明确说用于阻止贴花出现在另一侧）、`check` 选盒面、`local` 让贴花跟随接收网格，并给出 160k 三角 10 ms vs 官方 83 ms 的作者实测。 | MIT，2026-10 仍有提交；性能数字为作者自述，未复测。npm 包 [three-decal-geometry](https://www.npmjs.com/package/three-decal-geometry) 只有 1.0.0（2015-11-17 发布；registry 元数据 2022-06-27 更新），与仓库 2026 重写有版本差，不能直接当同一实现。 |
| [decal-projection-clipper](https://github.com/3172401233-hash/decal-projection-clipper) | 2026-11 新建的 JS 网格贴花投影库，README 列三角形裁剪、UV 重建、角度过滤和重叠排序。 | 零 star、无许可、只有 README／`.gitignore`，无源码与 `package.json`，只能作待核前沿。 |
| [Godot 4.8 beta 1](https://godotengine.org/article/dev-snapshot-godot-4-8-beta-1/) | 贴花可完整动画，并进入 Compatibility renderer。 | beta；升级前按目标版本核。 |
| [KSP-BurnMarks](https://github.com/CritZitGaming/KSP-BurnMarks) | 2026-08 新 mod：程序化尾焰／再入烧蚀痕迹跟随表面、跨零件接缝不断缝且随飞船移动。 | 体量很小，只作“相邻薄墙／接缝”的机制样本。 |
| [Juicee](https://github.com/Kelpekk/Juicee) | Godot 4 的 game-feel 效果图编辑器，2026-11-13 仍在更新。 | 补“打击感与反馈”的运行时工具箱，不是贴花本身。 |
| [awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills)、[Threejs-Awesome-Graphics-Agent-Skills](https://github.com/scottstts/Threejs-Awesome-Graphics-Agent-Skills) | 9.4k★ 与 1k★ 的游戏／three.js 技能目录，覆盖 Unity／Unreal／Godot／three.js 与 game-feel。 | 技能树里没有 decal 条目；说明该市场目前不能直接给出接收者裁剪做法。 |
| [SkinnedMeshDecals](https://github.com/naelstrof/SkinnedMeshDecals) | 201★、2026-09 活跃的 Unity 蒙皮网格贴花示例。 | 纹理空间路线；适合核“角色不该被误印”的反向需求。 |

## 6. 可证伪正例：一发只让这面墙入池

**前提：一面墙是一个独立接收 mesh。** 如果两面墙被合并成一个 mesh，或命中 pick 返回的是父级场景节点，这个正例不成立，应先拆 mesh 或补三角／子网格标识；不能把“池里只有 1 个”当作接收者身份已经生效。

**固定输入。** 场景放两面互不相连的墙 `wallA`（前）与 `wallB`（后），各自独立 mesh；权威射线从玩家眼位出发，命中 `wallA` 的正面，返回 `{ receiverId: wallA, point, normal, triangle }`。只对 `wallA` 调用一次 `DecalGeometry(wallA, point, orientation, size)`（three.js）或 `CreateDecal(name, wallA, options)`（Babylon）。

**几何级断言（无需渲染）。**

1. 输出顶点数大于 0，且所有输出顶点都在 `wallA` 的投影盒内；这是“命中点确实落在接收面上”的检查。
2. `wallB` 没有收到任何生成调用，池占用为 0；如果 `wallB` 的顶点出现在输出里，说明接收者身份没有生效（pick 返回了合并 mesh／父节点，或调用方传错了 mesh）。
3. 池的逐接收者计数为 `wallA=1、wallB=0`，全局计数为 1；这是“一发一墙一贴花”的直接证据。
4. 容量设为 1 时，第二发仍打 `wallA`：要么替换旧贴花、计数保持 1，要么拒绝新增并记录原因；不允许变成 2。容量设为 1 时打 `wallB`：`wallA` 的旧贴花被替换或拒绝，`wallB` 计数不超过 1。
5. 重复同一发事件键（回放或重复消费）不增加计数；这是去重检查。

**证伪条件。** 出现以下任一情况，正例失败：`wallB` 计数大于 0；输出顶点包含 `wallB` 的局部坐标；容量 1 下计数变成 2；同一事件键重复消费后计数增加；`receiverId` 为空但仍生成贴花。正例失败时先修命中事件与接收者选择，不要先调 `size.z` 或材质偏移。

**运行方式与边界。** three.js 可在 Node 里只建 `BufferGeometry` 与矩阵、不建 WebGLRenderer，直接检查顶点；Babylon 可用 `NullEngine`。本单元没有运行这两条断言，也没有在 Unity／UE 复现；以上是可执行测试设计，不是已通过结果。

## 7. 相邻薄墙反例：另一墙与背面分别由谁决定

| 情形 | 接收者选择的结果 | 深度边界的结果 | 需要做什么 |
|---|---|---|---|
| 两面独立薄墙前后贴放，打前墙 | `wallB` 不是接收者，根本不会进入输出；这是接收者身份直接解决的。 | 前墙自身的背面三角形仍可能落在投影盒内；`size.z` 覆盖墙厚时，前墙背面也会出贴花。 | 先确认 `wallB` 是独立 mesh；再把 `size.z` 压到墙厚以内，或对前墙启用背面剔除（Babylon `cullBackFaces`）／自定义法线过滤（three.js）。 |
| 两面墙被合并成一个 mesh | 接收者是整块合并 mesh，另一面墙也在同一接收者内，无法靠“换 mesh”排除。 | 投影盒只排除盒外部分；盒内的另一面墙照收。 | 必须补三角／子网格标识、按三角法线或空间区域过滤，或在资产侧拆回独立 mesh；这是最容易被“接收者选择”掩盖的失败。 |
| 一面薄 box 墙，前后两面 | 接收者正确，但仍是一面墙的两面。 | 前后面都在盒内时都生成贴花；three.js 无背面剔除，Babylon 默认也不剔除。 | `size.z` 小于墙厚，或 Babylon `cullBackFaces=true`；注意后者只剔除三个法线全背向的三角形。 |
| 一面零厚度平面 | 接收者正确，且几何上只有一组三角形。 | 不会凭空多出一组“背面三角形”；但双面材质会让同一贴花从背后可见。 | 不要把“从背后看见”误判为“背面也生成了贴花”；用单面材质或按视角裁掉。 |
| Unity／UE／Godot 的体积投影 | 逐层／逐网格开关能排除角色、HUD 和指定层，但不能排除同一层里的“后面那面墙”。 | Projection Depth／Size.z 只限制深度范围；投影不会像射线一样被第一个面挡住。 | 需要遮挡时，渲染投影器上方深度并 clip（[Unity 1633780](https://discussions.unity.com/t/hdrp-decals-occlusion-based-alpha-clipping-for-decal-projector-depth-shader-issues/1633780)），或改网格贴花／纹理空间路线。 |
| 角色、HUD、视图模型 | 引擎的 `Receive Decals`／Rendering Layers 是整网格或整层开关，不能只关某一发。 | 深度边界不区分对象类别，角色进入盒内就会收到。 | 环境弹痕的接收者白名单只放世界静态／可破坏物件；角色伤口另走蒙皮贴花；HUD／视图模型走独立 pass 或层，并验平台／shader。 |

**反例的可证伪断言。** 对“两面独立薄墙”：打前墙后 `wallB` 计数必须为 0；若前墙背面也出现贴花，则把 `size.z` 减半或开启背面剔除后，前墙背面顶点数应降为 0，而正面不变。对“合并 mesh”：同一发在合并 mesh 上生成后，按三角法线分组统计，背面／另一墙的三角形组若也非空，说明只靠接收者身份不够。对“体积投影”：把 `wallB` 放到同一 layer 后仍收到贴花，说明层掩码不能替代空间／深度过滤。

## 8. 建议接口：`hit surface → 接收网格 → 有界呈现池`

**先把命中事实带出来，再让表现层消费。** 页面现有 `ShotImpact` 只有 `origin／end／kind／killed`，缺接收者身份、法线与三角信息；补字段时保持可选，旧快照缺字段就不生成贴花，不回退到特效层重射。

```ts
type HitSurface = {
  receiverId: string;        // 稳定 mesh / renderer id
  receiverGeneration: number;// 重开、换关卡、对象池复用时递增
  point: Vec3;
  normal: Vec3;
  triangle?: number;         // 合并 mesh / 子网格时必须
  kind: 'actor' | 'world' | 'range'; // range 不生成贴花
};

type DecalRequest = {
  textureId: string;
  size: { x: number; y: number; z: number }; // z 是深度边界，不是厚度装饰
  angle?: number;
  ttlMs: number;
  maxPerReceiver?: number;
};

type DecalHandle = {
  id: number;
  receiverId: string;
  receiverGeneration: number;
  geometry: BufferGeometry;  // 由池持有
  material: Material;        // 共享或逐实例，按项目定
  bornAt: number;
};

interface DecalPool {
  spawn(hit: HitSurface, req: DecalRequest): DecalHandle | null;
  release(handle: DecalHandle): void;
  releaseByReceiver(receiverId: string, generation: number): void;
  occupancy(receiverId: string): number;
  capacity: number;
}
```

**接收者闸门。** `kind !== 'world'` 直接拒绝；`receiverId` 属于角色、HUD、视图模型或贴花产物本身时直接拒绝；`receiverId + receiverGeneration` 防止对象池复用后旧贴花挂到新物件；合并 mesh 必须带 `triangle`，并用三角法线／空间区域再验一次，否则“另一面墙”无法排除。

**深度边界。** `size.z` 由墙厚推导，不用固定大值；`size.z` 只保证不出盒，不保证只印选中面。Babylon 可在法线可信时开 `cullBackFaces`；three.js 需要自定义 `pushDecalVertex` 法线过滤或改用 spite 的 `maxAngle` 重写。法线缺失的接收者不生成贴花（three.js 可无 normal 输出，不能假定有法线）。

**有界呈现池。** 容量分三层：全局、每接收者、每 chunk／区域。满了就拒绝新增或按龄替换最旧，不能无界增长；重叠贴花用显式排序或深度偏移，不靠“后创建的盖住先创建的”。可参考 Quake 3 的固定 `cg_markPolys` ring buffer 与池满回收最旧、Doom 3 的 `MAX_DECALS` ring buffer、URP `DecalEntityManager` 的 free 索引＋version＋chunk、O3DE texture array 满时拒绝新增。容量数值要按目标设备实测，不照抄。

**占用检查。** 键至少是 `receiverId + receiverGeneration`，合并 mesh 再加 `triangle` 或量化位置；同一事件键去重；同一点附近重复命中做 epsilon 合并或拒绝；逐接收者计数与全局计数都要有上限。旧贴花本身要不可被命中（Babylon #34589），否则第二枪会打在贴花上。

**释放责任。** 池拥有生成的 geometry／mesh／material：从场景移除后 `dispose()` geometry；材质若共享则减引用，不逐发新建（Unity 807749 的教训）；纹理按项目资源生命周期释放。接收者销毁、换关卡、重开、对象池代次变化时 `releaseByReceiver`；不要依赖 `clone()` 复制贴花几何：`clone()` 在 #29859 前不可用，PR #29868 已修复并进入固定 commit；若要避免 clone，理由是贴花几何唯一、跨接收者复用无意义，或先核目标版本是否含该 PR。如果走纹理空间路线，释放意味着清掉目标贴花纹理或恢复原纹理，而不是移除 mesh。

## 9. 不保证事项与未验证

- **没有实机。** 本单元未运行任何引擎或渲染器，未生成截图、未录屏、未比较画面。“另一面会不会出现”是从源码与官方契约推出的行为；最终以目标版本实机复现为准。
- **版本固定但行为可能变。** three.js 与 Babylon 的行链接都带 commit；Unity Graphics 的 `master` 源码链接与 Unity、Unreal、Godot 文档指向当前分支／稳定页，升级后要重核。Godot 4.8 beta 已把 decal 带进 Compatibility，不能按 4.7 及更早的“不支持”推断新版本。
- **平台与 shader 差异。** Unity 的 DBuffer／Screen Space 对粒子与地形细节有限制，Rendering Layers 在 WebGL 与部分商店 shader 上不生效；Unreal `Receive Decals` 在 Dynamic Mesh、Vulkan 预览、Forward+MSAA 下可能被忽略；Godot Mobile 每 mesh 8 个、Compatibility 旧版不支持。任何“排除角色／HUD”的结论都要带平台与渲染路径。
- **市场成品未试用。** Asset Store／Fab 的页面缺技术描述，价格与兼容性只是页面信息；“能解决”没有被本单元验证。
- **消费者未改。** FPS-Like 在任务固定 commit `79bcf1d` 中没有 decal；第 8 节是接口建议，不是已实现代码。改消费者属于后续实现单元，需补浏览器与规则回放验证。
- **计数口径。** 渠道覆盖表的数量是“通过链接检查且与贴花相关”的采集覆盖，不等于逐条精读；正文与附录只展开影响决定的条目。个别 star／日期是采集时快照，不是最终值。
- **读不到的渠道没有补写。** Valve wiki 的 Source 引擎原文、CryEngine 旧文档、Drew Cassidy、Shader Bits、GDC Vault 部分演讲、SlideShare、Polycount、Reddit、知乎正文、公众号原文等未读到；相关结论只保留能从可读来源核对的部分，未用搜索摘要替代原文。
- **链接状态口径。** 本清单的候选在采集阶段都经过链接检查；修正版复跑时，339 个唯一链接里 304 个直接返回 200，其余为 StackExchange／知乎／npm／bartwronski 的 403、Bilibili 的 412、CSDN 的 521 与 GitHub 的限流 429，采集时改用 WebFetch／API 读过正文。SIGGRAPH 2018 HDRP 讲稿原页返回 404／406，已在 5.1 标为未读、不作为依据。链接能打开不等于内容已验证，画面与性能结论仍须实机复现。

## 10. 附录：未在正文展开的候选（同一筛选口径）

以下条目同样通过链接检查，按“它能补哪个缺口”一句话列在对应分组；没有写进正文只因为不改变本任务的结论。市场页缺技术描述的仍标待核。

### 10.1 源码、官方文档与池化补充

- [three.js Raycaster 文档](https://threejs.org/docs/#api/en/core/Raycaster)：`raycaster.layers`、`intersectObjects` 的 `recursive` 与按距离排序的 hits 决定“命中哪个接收者”；官方 decals 示例靠只对一个 mesh 投射来避免命中角色或 HUD。
- [three.js PR #34405](https://github.com/mrdoob/three.js/issues/34405)：WebGPU 后端把 `polygonOffset` 映射为 depthBias 却没纳入 pipeline cache key，只差深度偏移的贴花材质会共用管线；跨后端时深度边界不一致。
- [three.js discourse #18442](https://discourse.threejs.org/t/distorted-decal-texture/18442)：平面投影在深度突变处拉伸，算法至今未更新；回复给出换正交投影方向与预烘焙两张绕法。
- [three.js discourse #39205](https://discourse.threejs.org/t/threejs-decalgeometry-alternative/39205)：专门比较 `DecalGeometry` 替代方案，给出 ExpMap、测地距离和切平面展开路线及“不是通用解”的限制。
- [three.js discourse #42740](https://discourse.threejs.org/t/decal-geometry-on-child-meshes/42740)：把贴花挂到子网格需 `worldToLocal` 与逆四元数；帖中明确 `size.z=0.1` 可阻止穿到物体另一面。
- [three.js discourse #45464](https://discourse.threejs.org/t/decal-moves-attached-to-the-surface/45464)：移动贴花要每次重新投影并 dispose 旧 geometry；drei 封装会在计算前把父矩阵临时置单位阵，否则包围盒判断错误。
- [three.js discourse #48934](https://discourse.threejs.org/t/how-to-draw-stuff-on-stuff/48934)：列出几何贴花的硬限制（几何一变就重建、大网格慢、不支持多几何相交、每贴花一次 draw call），并用 Forward+ 跑到 10 万张作对照。
- [three.js discourse #57819](https://discourse.threejs.org/t/issue-with-applying-decals-to-multiple-children-meshes-in-three-js/57819)：多子网格模型主 mesh 没有 geometry，必须遍历每个 mesh 分别建；接收者是单个几何而非整组。
- [three.js discourse #66462](https://discourse.threejs.org/t/decals-not-working-with-instanced-mesh/66462)：`InstancedMesh` 做接收者时 `DecalGeometry` 失效，需单独验证实例路径。
- [three.js discourse #72467](https://discourse.threejs.org/t/moving-decal-performance-issue/72467)：每帧 dispose＋重建会卡，成本随接收网格三角形数增长，指向有界池与预生成。
- [three.js discourse #83397](https://discourse.threejs.org/t/decal-misaligned-after-moving-model-decalgeometry-issue/83397)：移动父组后贴花上下偏移，回复要求先 `updateMatrixWorld` 并用 `setFromObject(mesh,true)` 重算世界包围盒。
- [three.js discourse #90549](https://discourse.threejs.org/t/about-decal-why-does-this-code-need/90549)：drei 内部用世界空间投影点；只旋转贴花节点只会原地转贴图，不会把投影点绕模型移动。
- [three.js discourse #92284](https://discourse.threejs.org/t/help-needed-uv-decal-across-seams-approach/92284)：完全不走 `DecalGeometry`、在 UV 画布合成贴花，以及跨 UV 岛渗色极难；第三条路线的代价。
- [three.js discourse #93546](https://discourse.threejs.org/t/real-time-graffiti-painting-on-3d-surfaces-with-three-js/93546)：喷漆直接画进网格表面而非生成 decal 几何，回复给出 MonkeyPaint 等参考。
- [Babylon picking 文档](https://doc.babylonjs.com/features/featuresDeepDive/mesh/interactions/picking_collisions)：`fastCheck` 返回数组顺序的首个交点而非最近交点；`predicate`／`isPickable`／`multiPickWithRay` 用于筛选接收者。
- [Babylon PR #16683](https://github.com/BabylonJS/Babylon.js/pull/16683)：2025-05 合并，说明 decalBuilder 创建网格贴花时要考虑 morph target 影响；页面只写“see Forum post”，具体行为需再核。
- [Babylon Decals demo](https://www.babylonjs.com/Demos/Decals/)：官方 Decals 演示（点猫身溅黑墨），是 `CreateDecal` 的交互正例入口；页面只加载 JS，源码在 BabylonJS/Website。
- [Babylon #40759](https://forum.babylonjs.com/t/thin-instance-decals/40759)：thin instance 起初不参与贴花计算，后续 PR 才支持；空贴花还会触发 position 空数组警告。
- [Babylon #48631](https://forum.babylonjs.com/t/decalmap-on-instance-not-working/48631)：`decalMap` 贴在材质上而实例共享源材质，实例无法各自显示贴图；实例化接收者与贴图路径互斥。
- [Babylon #1804](https://forum.babylonjs.com/t/decals-on-animated-mesh/1804)：逐条否定父子挂接和挂骨，只剩第二 UV 通道＋动态纹理或离线烘焙；角色接收者的方案对比。
- [Babylon #42096](https://forum.babylonjs.com/t/how-can-i-use-dynamic-texture-with-decals/42096)：动态纹理要求 UV 不重叠、不跨岛，否则应改 mesh decal；`decalMap` 路线的现实门槛。
- [Babylon #42399](https://forum.babylonjs.com/t/stretched-decals/42399)：曲面／位置相关的拉伸没有完整修复，只能缩贴花、加透明边距或改屏幕空间。
- [Babylon #21007](https://forum.babylonjs.com/t/how-to-put-text-on-one-side-of-cube-only/21007)：用 UV 岛或 NodeMaterial U 区间遮罩替代投影，实现“只贴一面”。
- [Babylon #52349](https://forum.babylonjs.com/t/decals-and-angle/52349)：`CreateDecal` 用世界坐标和 angle，局部／世界轴与左右手系混用会让贴花旋转反向。
- [Babylon #39579](https://forum.babylonjs.com/t/how-to-retreive-the-properties-of-the-decal-mesh-sourcemesh-position-normal-size-and-angle-in-babylonjs/39579)：贴花创建后就是普通 mesh，sourceMesh／位置／法线／尺寸都不保留，释放与重建不能指望引擎回查来源。
- [Babylon #46972](https://forum.babylonjs.com/t/minimum-distance-for-decal-placement/46972)：投影位置不做 z 裁剪、可以任意远，但 size 盒必须与目标表面相交并向前伸出。
- [Unity URP 17.3 介绍](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@17.3/manual/renderer-feature-decal.html)：官方列明投影限制（透明表面不生效等）与 SRP Batcher 成本。
- [Unity Built-in Projector 6000.3](https://docs.unity3d.com/6000.3/Documentation/Manual/class-Projector.html)：投影矩阵／裁剪空间入口，旧 Projector 的变换基线。
- [Unity HDRP Decal Projector 参考](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.0/manual/decal-projector-reference.html)：Decal Layers 按接收者 mask 匹配、Angle Fade 仅在开启 Decal Layers 时可用。
- [Unity HDRP Decal Shader](https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@14.0/manual/Decal-Shader.html)：逐通道控制贴花影响接收材质的 base color／normal／MAOS／emission，并说明 mesh bias、透明接收与自发光限制。
- [Unity URP Decal Shader Graph](https://docs.unity3d.com/Packages/com.unity.render-pipelines.universal@14.0/manual/decal-shader.html)：Mesh Bias 只对直接指定 Decal Material 的 GameObject 生效，Projector 忽略；z-fighting 与接收面偏移的官方说明。
- [Unreal Decals 入口](https://dev.epicgames.com/documentation/en-us/unreal-engine/decals-in-unreal-engine)：把 Deferred Decal 体积与 Mesh Decals 分成两条路线。
- [Unreal Pre-skinned Local Position 节点](https://dev.epicgames.com/documentation/en-us/unreal-engine/pre-skinned-local-position-material-node-in-unreal-engine)：把受击点稳定到参考姿态，替代每帧第二张渲染目标的伤口方案。
- [Unreal 骨骼网格血贴花 custom stencil 教程](https://dev.epicgames.com/community/learning/tutorials/VX35/unreal-engine-wound-blood-decals-on-skeletal-mesh-with-custom-stencil)：骨骼网格贴花帖里被楼主称为“改善附着”的做法。
- [Godot 官方 decals demo](https://github.com/godotengine/godot-demo-projects/tree/master/3d/decals)：官方 3d/decals demo 用多个 Decal 节点演示过滤／投影模式。
- [Godot issue #108248](https://github.com/godotengine/godot/issues/108248)：4.0–4.5 可复现，场景超过 32 个 Decal 时排序偏移被忽略；同帖确认 Mobile 每网格最多 8 个、Compatibility 不支持。
- [Godot issue #57284](https://github.com/godotengine/godot/issues/57284)：官方 tracker 汇总排序随相机旋转、缩放网格法线淡出错误、大量灯光／贴花崩溃等未决问题。
- [Godot issue #81889](https://github.com/godotengine/godot/issues/81889)：复杂网格斜角投射时底层材质透出；Forward+ Vulkan 可复现、Mobile 不能。
- [Godot issue #66027](https://github.com/godotengine/godot/issues/66027)：特定 albedo 纹理出现黑矩形，旋转 90 度仍存在。
- [Godot issue #89467](https://github.com/godotengine/godot/issues/89467)：单个贴花缺纹理会让其他贴花出现 clustering artifacts；池化时单个坏资源会污染其他贴花。
- [Godot issue #81143](https://github.com/godotengine/godot/issues/81143)：Vulkan Mobile 每表面接近 8 个 decal 时出现重复绘制、随相机移动。
- [Godot issue #98259](https://github.com/godotengine/godot/issues/98259)：官方确认 Compatibility 没有 3D Decal，建议自定义 shader 或投影的 MeshInstance3D＋QuadMesh。
- [Godot PR #89235](https://github.com/godotengine/godot/pull/89235)：材质级 `decals_disabled` 开关，是引擎层“某表面不接收贴花”的材料级开关。
- [Bevy issue #2401](https://github.com/bevyengine/bevy/issues/2401)：Bevy 官方贴花／投影支持追踪 issue，汇总 forward 与 clustered 两条路线及未满足需求。
- [naasblod/bevy_decal_lab](https://github.com/naasblod/bevy_decal_lab)：比较一步视差近似与 POM，记录四边形高于表面时的 windowing、转动相机时的偏移。
- [wtfdemon/bevy_mesh_decal](https://github.com/wtfdemon/bevy_mesh_decal)：Bevy 网格空间贴花喷涂，自述基于 Unity MeshDecal，不依赖深度缓冲视差。
- [Flax：Create a decal](https://docs.flaxengine.com/manual/graphics/decals/create-decal.html)：贴花是屏幕空间 Decal actor＋Decal 域材质，可在运行时用动态材质实例淡出。
- [ioquake3 issue #119](https://github.com/ioquake/ioq3/issues/119)：真实项目里弹痕在墙面比地面更容易闪烁，讨论指向默认 16-bit 深度缓冲精度。
- [Wolfire：Decals editor part one](https://wolfire.com/blog/2009/05/decals-editor-part-one/)：早期贴花编辑器记录，明确当时 decal lightmap 尚未实现、阴影与 AO 不完整。
- [Wolfire：part two](https://www.wolfire.com/blog/2009/05/decals-editor-part-two/)：用 maximum projection distance 防止投影命中远处物体（黏液霉误印到村庄）。
- [Wolfire：part three](https://wolfire.com/blog/2009/06/decals-editor-part-three/)：裁剪之后怎么着色：模糊法线、alpha 透明、法线混合和世界空间漫反射。
- [Wicked Engine Forward+](https://wickedengine.net/category/devblog/2017/10/12/forward-decal-rendering/)：把贴花并入光源列表做 OBB 剔除与 LDS 排序，不生成贴花网格。
- [Humus Volume roads](https://www.humus.name/index.php?page=3D&ID=84)：Volume decals 续篇，用相邻深度求梯度并以 `SampleGrad` 修复带 mipmap 的贴花边缘。
- [OGRE 2019 progress](https://www.ogre3d.org/2019/08/04/progress-report-july-2019)：OGRE 用 Clustered Forward 实现 screen-space decals，报告称避免 deferred 边缘伪影，并链接回 Bart 的修正文。
- [Sledge 的 decal clipping 提交](https://github.com/LogicAndTrick/sledge/commit/1041ba5c192fbcaf04e51c3f20f43b232b2dc31f)：实际把贴花裁到 brush face 的提交，展示面内裁边、UV 重建与重叠重算。

### 10.2 失败模式与性能补充

**Unity。** 投影到 viewmodel 的求助（[864905](https://discussions.unity.com/t/what-is-the-best-option-for-decals-in-the-universal-render-pipeline/864905)）；LTS 默认不能只影响指定物体，URP 14／2022.2 起才有 Decal Layers（[902300](https://discussions.unity.com/t/possibility-for-urp-decal-projector-to-only-affect-certain-objects/902300)）；100 个共享材质贴花仍各占一个 draw call（[918005](https://discussions.unity.com/t/decal-gpu-instancing-does-not-work/918005)）；运行时 new Material 不渲染，需设置／校验 shader keywords（[932706](https://discussions.unity.com/t/instantiated-decal-does-not-render/932706)）；Android 构建不显示（[1666966](https://discussions.unity.com/t/decal-not-render-on-android-build/1666966)）；贴花替代阴影会穿墙（[1624225](https://discussions.unity.com/t/decal-projector-alternatives-that-supports-shadows/1624225)）；旧 Projector 每受一次投影就把整个网格再画一遍（[889447](https://discussions.unity.com/t/a-better-way-to-handle-projectors-or-an-alternative-to-them/889447)）；decal shader 拿不到接收表面法线（[901920](https://discussions.unity.com/t/culling-decals-by-surface-normal/901920)）；接收网格 layer 不能筛贴花（[938677](https://discussions.unity.com/t/problem-with-decals-culling-in-urp/938677)）；Angle Fade 可阻止贴花落到墙上（[1603696](https://discussions.unity.com/t/custom-shader-graph-decal-to-project-circle-on-the-ground/1603696)）；实例化弹孔与命中点有缝隙是预制体枢轴不在中心（[839508](https://discussions.unity.com/t/bullet-hole-instaniated-on-wall-have-gaps-between-the-hole-and-wall/839508)）；自定义 decal shader 在粒子立方体上只在异常位置显示（[1669972](https://discussions.unity.com/t/custom-decal-shader-not-working-properly-with-particle-system/1669972)）；投影立方体侧面盖住投影内容（[1697820](https://discussions.unity.com/t/custom-shader-graph-decal-cube-sides-interfering-with-projection/1697820)）；自建 AABB 树＋Morton 码选面、自写 clipper 的实践（[651258](https://discussions.unity.com/t/wip-guardian-game-ludum-dary-37-entry/651258)）；VFX Graph 粒子画进 RenderTarget 代替贴花（[1549857](https://discussions.unity.com/t/vfx-graph-painting-with-particles/1549857)）；Mesh Decal Painter PRO（[1623943](https://discussions.unity.com/t/released-v1-0-mesh-decal-painter-pro-performance-run-time-decals-drawer/1623943)）；大量 VFX decal 的图集与合批（[1732906](https://discussions.unity.com/t/lots-of-decal-projectors-performance-implications/1732906)）；CPU 顶点投影的 TMPMeshDecal（[1730058](https://discussions.unity.com/t/open-source-cpu-side-vertex-decal-projector-for-textmeshpro/1730058)）。

**Unreal。** depth fade 让贴花在相机贴近时消失（[355236](https://forums.unrealengine.com/t/deferred-decals-disappear-when-player-is-near/355236)）；官方 FAQ 称正在研究弃用 deferred decals（[592015](https://forums.unrealengine.com/t/epic-should-empower-deferred-decals-they-are-the-future-they-just-need-some-more-data/592015)）；贴花附到骨骼网格的问题（[2684625](https://forums.unrealengine.com/t/problems-with-attaching-decals-to-a-skeletal-mesh/2684625)）；相机移动时 pop in／out（[2727450](https://forums.unrealengine.com/t/decals-pop-in-out-during-camera-movement/2727450)）；贴花成本主要来自材质复杂度（[1653384](https://forums.unrealengine.com/t/are-decals-expensive-for-performance/1653384)）；敌人身后墙面贴花位置不准（[1811182](https://forums.unrealengine.com/t/decals-spawn-not-exactly-behind-shot-enemies/1811182)）；把会移动的物体 `Receive Decals` 设为 false（[732664](https://forums.unrealengine.com/t/how-to-bake-a-decal-onto-the-surfaces/732664)）；mesh decal 不像 decal actor 那样向下投影（[2583388](https://forums.unrealengine.com/t/should-mesh-based-decals-do-this/2583388)）；HISM 上 mesh decal 只渲染一次（[1216021](https://forums.unrealengine.com/t/mesh-decal-only-render-once-on-hism/1216021)）；同表面多个贴花合并批次（[664493](https://forums.unrealengine.com/t/tutorial-combining-decals-efficiently/664493)）；mesh decal 重叠没有 sort order（[464854](https://forums.unrealengine.com/t/mesh-decal-sorting/464854)）；同材质 ISM 与 SM 同帧导致闪烁（[2843731](https://forums.unrealengine.com/t/static-mesh-decals-flicker-when-ism-components-with-same-material-are-in-frame/2843731)）；RECEIVE_DECAL stencil 不尊重 masked material（[2711768](https://forums.unrealengine.com/t/receive-decal-stencil-and-masked-materials/2711768)）；移动端 DBuffer／mesh decal 的 shader 复杂度（[567772](https://forums.unrealengine.com/t/dbuffer-and-mesh-decals-on-mobile-not-a-good-choice-high-shader-complexity-and-other-issues/567772)）；GeometryCollection 不接收贴花（[633574](https://forums.unrealengine.com/t/any-way-to-put-decals-on-a-geometrycollectioncomponent-or-fake-similar-behaviour/633574)）；无法按单张贴花选择材质（[1180903](https://forums.unrealengine.com/t/how-to-make-decals-project-only-to-a-certain-material/1180903)）；UE-398225 把闪烁归因于 cached mesh draw command 的 indirect／direct 切换（[追踪单](https://issues.unrealengine.com/issue/UE-398225)）。

**Godot。** 多表面血贴花的 z-fight、边缘切断与叠层成本（[84882](https://forum.godotengine.org/t/solutions-for-projecting-a-blood-texture-on-many-surfaces/84882)）；相机移动时贴花边缘闪烁、Compatibility 不可用（[138868](https://forum.godotengine.org/t/decal-edges-distort-flicker-when-moving-camera-in-godot-4-3/138868)）；自定义网格上贴花不渲染（[90883](https://forum.godotengine.org/t/decals-not-rendering-on-custom-mesh-in-godot-4/90883)）；门等移动网格的厚度／跟随问题（[142946](https://forum.godotengine.org/t/decals-thickness-and-following-mesh/142946)）；贴花不支持 subviewport 输入、只能靠 visual layer 选接收者（[128992](https://forum.godotengine.org/t/having-trouble-with-decals-subviewports-visual-layers-and-their-compatibility/128992)）；实时改贴花纹理会触发全局 atlas 重打包（[131693](https://forum.godotengine.org/t/how-to-make-a-decal-notice-that-its-texture-changed/131693)）。

**问答。** gamedev.SE 的盒子求交→裁剪→逆矩阵算 UV 经典步骤（[32095](https://gamedev.stackexchange.com/questions/32095/decal-implementation)）；复杂物体弹孔的非贴花替代（[15717](https://gamedev.stackexchange.com/questions/15717/is-there-an-alternative-to-decals-that-will-let-me-put-bullet-holes-on-a-complicated-object)）；deferred decal 法线读写的未定义行为（[49878](https://gamedev.stackexchange.com/questions/49878/deferred-decals-normal-problem)）；贴花系统入门资料（[24653](https://gamedev.stackexchange.com/questions/24653/how-do-i-create-a-decal-system)）；内置管线没有 HDRP 式 projector（[SO 60151128](https://stackoverflow.com/questions/60151128/is-there-any-way-in-unity-to-make-something-like-decal-projector-from-hdrp-in-bu)）；纹身要绕过腿部／背面（[SO 54986584](https://stackoverflow.com/questions/54986584/decal-wrap-around-mesh)）；透明区域仍压暗底图（[SO 72798925](https://stackoverflow.com/questions/72798925/the-alpha-of-decals-is-not-completely-transparent-in-unity)）；屏幕空间 world→decal 变换错误（[SO 70435](https://stackoverflow.com/questions/70435/screen-space-decals-converting-world-to-decal-space)）；子弹孔用三角形还是方片（[SO 78450464](https://stackoverflow.com/questions/78450464/in-rendering-what-shape-should-be-used-for-decals-like-bullet-holes-to-maximize)）；改 FOV 后贴花异常（[SO 71902391](https://stackoverflow.com/questions/71902391/something-goes-weird-with-my-decals-when-i-change-fov)）；Ogre 投影器穿到物体后面（[SO 11237326](https://stackoverflow.com/questions/11237326/ogre-projector-shines-through-objects)）；URP projector alternative（[SO 70888168](https://stackoverflow.com/questions/70888168/is-there-a-projector-alternative-for-unity-that-supports-urp)）；墙地交界处姿态错误（[SO 54308852](https://stackoverflow.com/questions/54308852/why-is-my-decal-projector-spawned-incorrectly-when-it-hits-the-wall-and-floor-at)）；Unity 贴花实例化旋转错误（[SO 37912553](https://stackoverflow.com/questions/37912553/unity3d-5-3-5-decals-instantiate-with-wrong-rotation)）。

### 10.3 替代实现与生产成品补充

- [DecalCo](https://github.com/Master-J/DecalCo)：Godot 3.2 着色器贴花，README 直接以弹孔／血迹为用例；仅 Godot 3，未迁 Godot 4。
- [GodotProjectedDecals](https://github.com/Miziziziz/GodotProjectedDecals)：Godot 4 网格投影贴花实验；README 404，完成度未核。
- [Screen-Space-Decals（Godot 3）](https://github.com/leopoldek/Screen-Space-Decals)：README 自述“从背面也会渲染”，正是背面穿透反例；不真正参与光照。
- [antzGames Compatibility Decal Node](https://github.com/antzGames/Godot-Compatibility-Decal-Node)：宣称一次 draw call 画数千贴花，绕开兼容／移动渲染器每 mesh 8 个、每帧 64 个的上限。
- [SanielX DeferredDecals](https://github.com/SanielX/DeferredDecals)：README 明说 culling 只做 AABB、不考虑墙体，是薄墙背面被印上的现成反例。
- [bmjoy MeshDecals](https://github.com/bmjoy/MeshDecals)：网格贴花成本随接收网格顶点数增长；README 点明静态部分来自 Deni35 的免费贴花系统。
- [Gossiper TangentDecalUnity](https://github.com/GossiperLoturot/TangentDecalUnity)：切线空间（UV）贴花，专为 `SkinnedMeshRenderer`／`ClothRenderer` 变形接收者，并列出逐 renderer 注册与 RenderTexture 的代价。
- [diharaw Deferred Decals](https://github.com/diharaw/deferred-decals)：OpenGL 屏幕空间延迟贴花最小实现，适合核深度边界与渲染顺序。
- [LKempton ProjectorBasedDecalSystemInUnity](https://github.com/LKempton/ProjectorBasedDecalSystemInUnity)：49★、2019 的 FPS 专用投影贴花系统，可看旧式 Projector 路线怎样组织命中贴花；长期未维护。
- [URP-Decal-Node](https://github.com/Harry-Heath/URP-Decal-Node)：72★ 的 Shader Graph 自定义贴花节点；仓库未标许可。
- [Warwlock TMPMeshDecal](https://github.com/Warwlock/TMPMeshDecal)：约 100 行的 CPU 顶点投影贴花，按射线把顶点贴到碰撞体上，是最小可读的接收网格变形实现。
- [bmjoy SkinnedDecals](https://github.com/bmjoy/SkinnedDecals)：每三角形对正交视锥六面测试的 Unity 蒙皮贴花实现，作者给出约 30 ms 创建开销与 drawcall 未合批的真实代价。
- [tcmug projected_decal](https://github.com/tcmug/projected_decal)：让投影贴花适配 GridMap 与普通网格的 Godot 节点，指出内置 Decal 在 GridMap 接收者上的限制。
- [romgerman Splasher](https://github.com/romgerman/Splasher)：Godot 4 贴花放置插件，自动探测碰撞体厚度，直接处理薄表面／薄墙的接收者选择。
- [Calinou godotcon-2021-decals](https://github.com/Calinou/godotcon-2021-decals)：Godot 贡献者的“Godot 4 Decal Node Explained”演示工程，可作官方用法与投影边界的对照。
- [ExpiredPopsicle KiriSplat](https://github.com/ExpiredPopsicle/KiriSplat)：Godot 的 mesh-based decal 实现，可与 DecalCo 的 shader 路线对照。
- [Unity Demo Team mesh-to-sdf](https://github.com/Unity-Technologies/com.unity.demoteam.mesh-to-sdf)：实时 SDF 生成包，用于复杂／动态表面的碰撞与贴花定位，可替代逐三角形裁剪。
- [ProjectorForLWRP](https://github.com/nyahoon-games/ProjectorForLWRP)：在 URP 恢复内置 Projector 的透视投影，并按 layer、render queue、LightMode 过滤接收者。
- [DMDecalBuffer](https://github.com/DMeville/DMDecalBuffer)：URP 在 BeforeOpaques 把投影体渲染到全局 decal buffer，接收面 shader 自行采样。
- [ColinLeung 屏幕空间 shader](https://github.com/ColinLeung-NiloCat/UnityURPUnlitScreenSpaceDecalShader)：GitHub 星标最高的 URP 屏幕空间贴花着色器之一，用一个立方体加深度纹理投影、无需生成接收网格。
- [Decalicious](https://assetstore.unity.com/packages/tools/particles-effects/decalicious-deferred-decal-system-74175)：Unity 论坛反复推荐的 deferred 屏幕空间贴花资产，支持角度淡出但不投透明表面。
- [SkinnedMeshDecals](https://github.com/naelstrof/SkinnedMeshDecals)：201★、2026-09 活跃的 Unity 蒙皮网格贴花示例；Collider→Renderer 绑定决定接收者，把贴花 blit 到目标 Renderer 的贴图。
- [OpenUPM skinnedmeshdecals](https://openupm.com/packages/com.naelstrof.skinnedmeshdecals/)：该实现的包管理器发布页，可版本锁定安装。
- [npm three-decal-geometry](https://www.npmjs.com/package/three-decal-geometry)：spite 重写的 npm 包（1.0.0，2015-11-17 发布；registry 元数据 2022-06-27 更新），需核它与仓库 2026 重写的版本差异。

### 10.4 明确排除

同批候选里还有编码代理评测、Agent Skills 市场、MCP、沙箱、数据库与团队协作条目（例如 Harness²、tstack、Genex、Docker Sandboxes、Postgres 19 延期等）。它们通过了链接检查，但与“环境弹痕只落到选中的表面”这一决定无关，按任务范围不列入本清单，也不据此给贴花选型增加依据。若后续要做“AI 生成贴花资产”或“Agent 操作引擎”，应另开单元，不要把两套判断混在一起。

---

**本轮建议。** 先把第 6 节的一墙一发正例做成可执行断言，再接第 7 节的独立薄墙反例；实现顺序按“命中事件补 `receiverId`／`normal`／`triangle` → 接收者白名单 → `size.z` 与可选背面剔除 → 固定容量池与释放”推进。three.js 路线优先读 3.1 与 3.3，Babylon 路线优先读 3.2；Unity 落地以 3.4 的 Rendering Layers／Receive Decals 为准，但不要承诺“层掩码能挡住后面那面墙”。所有画面结论留到实机复现后再写。