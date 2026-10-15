主线：二／三／四；G1 3D 选型、第二次修改与交付
改变的建议：[经验] 同风格现成资产／已有配方覆盖的参数化资产优先；自定义刚体首试原生低模，场景和变形角色另判；复用 bpy／gltfpack 前核目标导入器扩展支持，之后仍验最终预算、身份与元数据
新证据：[一手／研究] 2026 年论文、商业 API、固定处理源码与作者产物；追加 CC0 门 GLB 轨道复算、关节导出反例、重贴图调用链及程序化风格扩展／模块供给边界，未运行模型／引擎

# WP3：3D资产路线、原生低模与第二次修改

核实时间：2026-10-14（UTC+8）；TaoFlowForge 许可与装载链补核：2026-10-16（UTC+8，§10.2）；程序化形状／风格范围补核：2026-10-16（UTC+8，§13）。正文见[3D资产专题](../../domains/game-dev/assets/3d.md)。以下“首试”是理论选型优先级，不是已测质量冠军。来源标签：[一手]官方文本/源码；[研究]论文或作者测量（须再分）；[经验]本报告决策。

## 1. 采用判断与分档依据

**✅ 采用：先按玩法把对象拆成静态刚体、模块场景、变形角色，再选资源来源。** 同风格授权现成包可满足时不重新生成；重复尺寸、模块接缝、门窗和可动零件优先复用已有配方；新增形状／风格先核源模块与规则是否覆盖（§13），不能把补配方算成调参数。静态道具把原生低模生成列为首试，而非默认百万面生成后强减面；高细节源资产保留在确实需要近景轮廓/烘焙细节的分支。变形角色优先现成骨架/拓扑与服装体系；自动绑定成功和quad输出都不是关节变形通过。场景优先模块拼装，生成世界仅作受限背景候选。**局限：本轮未建立零手修、第二次修改后的真实引擎通过率，不能承诺完整无人美术发售管线。** [经验；依据见下]

### 三类资源、三档首试

|用途|质量优先|性价比优先|本地/免费|
|---|---|---|---|
|静态刚体道具|✅ 采用与画风一致的成熟完整资产；缺少独特近景物件时🧪先试Meshy 7.1，Rodin Gen-2.5作为高细节/多图对照。二者无独立同题盲测，不排序为绝对最佳|✅ 同包复用；确需新形状时🧪Meshy T2原生低模，先灰模验轮廓再贴图；Tripo P1是替代候选，P2 Preview仅对照|✅ Kenney Nature Kit/简单参数化几何。写实可👀Poly Haven单资产，仍核预算；不强凑“免费本地生成冠军”|
|场景|✅ 同套模块/材质拼装，近景标志物单独补生成；👀Marble Pro只用于交互弱、可接受烘焙观感的环境候选|✅ Kenney/Quaternius同包模块+脚本布局，不把整个关卡作为一个mesh重生|✅ 同包现成模块/引擎基本体；👀Infinigen只借资产/程序配方，不默认整套世界生成输出直接进游戏|
|变形角色|✅ 同一现成角色生态、已知拓扑/骨架的完整资产；👀自定义生成仅当玩法允许退回刚体分件或替换角色|✅ Quaternius Universal Base Characters+同体系服装/动作；复用比重生后反复绑定更可控|✅ 指定CC0角色包的免费可下载部分；⛔不把TRELLIS/LATO.2默认安装或Hunyuan作为全球商用无条件路径|

这里的质量优先指“在零人工修拓扑、UV和权重前提下优先提高可交付性”，不等于所有现成资产的审美胜过生成。[经验] 当前服务费不能跨品牌直接比较credit；尚无保留所有淘汰样本与主动工时的可比成本。[研究]

## 2. 最近几个月发生了什么，改变了哪个旧方案

### 2.1 原生低模已经是可调用路线，不只是“减面新包装”

- **Meshy T2（论文2026-07-28；API当前`meshy-t2`）**：显式连通性、紧凑网格，控制面数；服务`model_type=smart-topology`，triangle-only，100–15,000面目标，忽略remesh开关。旧`lowpoly`将于2026-10-30退役；不要继续复制旧参数。[一手：[API](https://docs.meshy.ai/en/api/image-to-3d)、[论文](https://arxiv.org/html/2607.28675v1)]
- **Meshy 7.1（2026-09-18）**：标准高细节路线，`latest`已指它，7被弃用但仍工作。`geometry_resolution=4k`是几何采样规格，不是贴图4K；多图不支持该4k选项。[一手：[changelog](https://docs.meshy.ai/en/api/changelog)] 推荐显式锁版本，不把同seed+latest当重复生成契约。[经验]
- **Tripo P1-20260311与P2-20260801**：P1是稳定低模路径；P2在当前生产域v3文档标Preview，新增quad，最多50,000三角面或25,000四边面；纹理模型另锁`v3.5-20260815`，不是几何升级就自动启用新版纹理。[一手：[P系列](https://developers.tripo3d.ai/en/docs/generation-text-to-model/p)] 本轮先采用P1稳定性作候选，P2不凭quad宣传升为角色首选。[经验]
- **LATO.2（2026-07-12论文，代码8月）**：分顶点与连通性，可调整顶点后重建拓扑；作者明确几何错不能靠连通性阶段补救，尚缺UV/纹理/材质。[研究：[论文限制](https://arxiv.org/html/2607.10623v1)] 不支持“新拓扑模型已经解决完整游戏角色”。[经验]
- **TaoFlowForge（2026-09-29论文，9月30代码发布）**：原生顶点+连通性三阶段；公开推理CLI、阶段恢复、raw与补洞后网格都有，读源码可区分生成错误与后处理错误；不是只有官网旋转视频。[一手：[固定README](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/README.md)、[pipeline](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/taoflowforge/pipeline.py)] 权重仓现已核到 Apache-2.0 声明，但必需 DINO 的实际来源／版本及适用许可链未闭合，不列无条件商用本地推荐（见 §10.2）。[研究]

**替代关系**：简单刚体道具，原生低模值得替代“先密网格再不计损失地强制减到预算”；不是取消密网格，近景雕塑/复杂表面仍可生成高密度源，再用成熟LOD/烘焙。若原生低模无法保持重要孔洞、细件、接口或预算反复失守，撤回到同风格现成资产/参数化建模；不能把试验失败转嫁为程序员手工雕刻。[经验]

### 2.2 商业接口细节是实质反证

Rodin Gen-2.5默认`Raw+medium`目标500,000面；`Quad+medium`18,000四边面，导入前不能把两种face数直接比较。`tier`遗漏会退回Gen-1/1.5；所谓faithful模式明确实验性、不建议生产；输入alpha保留只影响预处理，不能推成输出玻璃/镂空材质正确。[一手：[API](https://docs.hyper3d.ai/en/api-specification/rodin-gen2-5)]

Meshy7.1不输出emission，`remove_lighting`接受却忽略；T2不接受该参数。Tripo P系列`pbr=true`强制texture=true；不能只设texture=false就保证灰模成本。Tripo文档警告过早设`export_orientation`可使后处理结果朝向错误而任务仍success，建议最后convert。[一手：上述Meshy image API、Tripo P系列API] 这些证明“参数齐全/API成功”不是引擎资产契约，应该保存实际版本、产物和检查结果。[经验]

## 3. 产物、采用与反例：证据强弱分开

### 3.1 Meshy官方cookbook有产物记录，但没有公开GLB

固定[meshy-dev/meshy-cookbook@73bb39e185076a7e0a696add61277221c9ff8feb](https://github.com/meshy-dev/meshy-cookbook/tree/73bb39e185076a7e0a696add61277221c9ff8feb)。本轮用GitHub API读取提交及文件树，读取sample-result与source provenance；没有运行其中安装/付费指令。[一手/本轮只读]

- [02低模结果](https://github.com/meshy-dev/meshy-cookbook/blob/73bb39e185076a7e0a696add61277221c9ff8feb/examples/02-image-to-low-poly-prop/sample-result.json)作者检查：1,000目标→1,096 triangles，556 vertices，20,520字节，无材质/贴图/skin/animation。文档记录5 credits，模型名来自历史README，**不是保留下来的API响应**。实际生成时间也未保留。[一手：作者测量，非本轮复算]
- [06改风格结果](https://github.com/meshy-dev/meshy-cookbook/blob/73bb39e185076a7e0a696add61277221c9ff8feb/examples/06-text-to-restyled-prop/sample-result.json)作者记录灰模5+重贴图10 credits；最终1,032 triangles、1,262 vertices、7,320,072字节、三个嵌入图像、2K贴图。这是另一组oak，不可以将02与06当同一模型的修改前后几何差分。[一手：作者测量；研究：比较口径]
- [来源说明](https://github.com/meshy-dev/meshy-cookbook/blob/73bb39e185076a7e0a696add61277221c9ff8feb/examples/02-image-to-low-poly-prop/assets/SOURCES.md)明确GLB不发布，仅预览、wireframe与哈希。故不能声称“独立验出1096面”，更不能以其证明闭合拓扑、背面和游戏采用。[研究]

可采用的机制：先验灰模再花贴图费，保留任务ID避免重复付费、保存本地输出；不是照抄整套Agent框架。贴图后的文件可能比小灰模大几个数量级，低面数不等于低内存。[经验]

### 3.2 既有真实角色案例只支持诊断边界

[既有资产编辑边界研究](2026-10-13-game-asset-editing-boundary.md)已核corosolto/client：生成碎片、UV脚本、运行时锁骨映射错误分层；有运行时引用，且作者冻结22/63缺陷债务。沿用其精确 SHA 与直接来源，支持先定位责任，不是零手修通过案例。[研究：既有证据复用]

2026-10-15 补核：另一作者在 [Navy Island Confidential 第10周记录](https://goblin-games-fr.itch.io/navy-island-confidential/devlog/1039309/week-10)（2025-09-23）重做角色，使用两个不同的 Meshy 生成结果后仍手雕、修纹理，并报告肩部服装切口引发权重问题、动画不够顺，身体纹理清理尚待完成。[一手：作者原帖] 这确认外观重做后仍须验变形与清理成本；没有完整拒绝样本、修复终态或精确模型版本，不据此推算失败率，也不外推当前版本或静态道具。[研究]

### 3.3 成熟基线也须限定

- [Kenney Nature Kit](https://kenney.nl/assets/nature-kit)：330 files、CC0，适合统一简化自然物体族；资产包页面不证明任何目标设备性能。[一手] 使用同包、程序改材质色/尺寸/布局，避免模型逐件抽样。[经验]
- [Quaternius Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html)：6种人体基型、20头发、Humanoid rig，作者称平均13k triangles；Standard约60–70%免费，Source/引擎整合为不同交付档，不能写免费含全部源工程。页面CC0商业可用。[一手] 参数/服装兼容体系比反复重生网格更适合第二次修改。[经验]
- [Poly Haven许可](https://polyhaven.com/license)资产CC0；高分辨率写实模型仍可能超过游戏预算。2026-07-18[API页](https://polyhaven.com/our-api)已明确含商用免费并要求面向用户标示来源，不能沿用旧收费API说明，也不能把网站文字/商标一并当CC0。[一手]
- 有第三方作者[采用登记](https://github.com/Seyamalam/blood-league-kickoff/blob/main/docs/ASSET_CREDITS.md)把Quaternius基型与glTF→GLB规范化用于游戏仓库；此处仅作线索，未固定该仓库SHA、运行游戏或核发售，**正文推荐不以此作已验证游戏交付证明**。[一手：作者登记；研究：证据不足]

## 4. 场景：应保留对象边界，而非只追全景漂亮

**✅ 默认同套模块资产+规则布局。** 房间、道路、墙厚、门宽、交互物件/碰撞必须由玩法规格决定。AI可生成布局数据/装配代码，程序员可用现有模块与基本体，不需重造世界生成框架。[经验]

**👀 Infinigen（a0d1a0dd，2026-10-08）**是有源码的程序化基线，适合借参数配方，不是AI生成模型；主许可BSD-3-Clause，含明确标注的CC0程序代码。[一手：[固定README](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/README.md)、[LICENSE](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/LICENSE)] 本轮不以科研合成世界demo证明实时游戏资产预算；优先复用一类已有参数化资产而非整套场景系统。[经验]

固定[导出说明](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/docs/source/ExportingToExternalFileFormats.md)给出更强反证：程序材质需烘焙且有损；文档正式支持全场景USDC；固定实现对usda/usdc均走USD分支，非USD路径才显式实体化实例并可能显著膨胀；动画导出未正式支持，透明材质可能不正确。不要将作者关于格式能力的泛化解释推广为所有格式都不支持实例，只采用该导出器的明确限制。对应[源码](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/src/infinigen/tools/export.py)的`export_curr_scene`／`export_single_obj`在非USD路径调用`realizeInstances`（约1135–1189行）；不以文件内未调用的辅助函数充当实际执行路径。[一手：文档+固定源码]

**👀 Marble**能生成/编辑/扩展世界，支持Gaussian splat、低精度collider与高质量mesh；当前[导出说明](https://docs.worldlabs.ai/marble/export/gaussian-splat)Standard可导splat/collider，Pro列高质量GLB与商业权利。阶段 F 已补读合同，改为 Pro 受限背景候选；Standard 的合同定义与套餐说明有张力，不默认商用，详见 §10。[一手；研究]

官方[2025发布文](https://www.worldlabs.ai/blog/marble-world-model)已承认单图/文本要补全未见部分，局部区域可能不清晰；不能把旧文当2026新模型，但其输出类型仍在当前文档确认。[一手] 2026-05 [WorldAct论文](https://arxiv.org/html/2605.15843v1)专门将整体静态场景分割、补背景、重建可交互物体；作者限制仍含不能处理动态/关节物体以及质量、摩擦。它说明“有world mesh”与“有可维护游戏场景”相差一层，不证明加个框架就解决。[研究]

何时可以用：固定背景、有限视点、步行探索且对象不需频繁交互的候选。何时撤回：门必须开、墙体要破坏、可拾取物体要替换、动态灯光必须一致或第二次改布局不能隔离影响时，退回模块mesh。[经验]

## 5. 从几何到游戏资产：借成熟处理，别重造框架

### 拓扑、UV与贴图

- **减面不是重拓扑。** 减面解决预算，原生拓扑生成/重拓扑解决面组织，但quad仍不保证肘膝面流、面部表情和蒙皮正确。变形角色不能沿用静态雕像验收。[经验；论文/角色反例支持]
- **meshoptimizer/gltfpack**：固定[b2330430776a95a1545f03fc7bf16927f8cadc59](https://github.com/zeux/meshoptimizer/tree/b2330430776a95a1545f03fc7bf16927f8cadc59)，MIT。读取README简化机制：误差限可能使结果达不到目标；sloppy能更激进但不保边界/属性；带属性简化+锁UV seam可保外观。不要为了数字达标无条件取消误差线。[一手；经验]
- **xatlas**：固定[f700c7790aaa030e794b52ba7791a05c085faf0c](https://github.com/jpcy/xatlas/tree/f700c7790aaa030e794b52ba7791a05c085faf0c)，MIT，无外部依赖的UV库；最新提交仍2022，不能包装成近期模型。它生成UV，不创造正确纹理；改UV后必须重新烘焙或重贴图，旧UV像素mask不能直接复用。[一手；经验]
- 2026-10 [MeshQuery论文](https://arxiv.org/html/2610.02507v1)将Agent用于UV seam规划，但明确人工pin/relax在其范围外；作者偏好胜出的缝线仅53%被标为可作production hot-start。只登记前沿，不把“Agent+UV”推荐成零手修替代xatlas的成熟默认。[研究]

### LOD与碰撞

LOD应由目标视距/屏幕误差决定，保轮廓、孔洞、材质接缝和挂点；50%/25%只是候选比率，不是游戏跨类型通用规格。材质/UV断开会增加实际顶点；只看faces会漏预算。骨骼LOD必须另验skin/morph，不能纯几何降采样后假设可用。[经验；meshoptimizer机制支持]

碰撞代理优先box/sphere/capsule或少量compound，独立于可见网格。Unity6.0[MeshCollider](https://docs.unity3d.com/6000.0/Documentation/Manual/class-MeshCollider.html)文档限制convex 255 triangles，动态物体建议优先primitive；因此把生成mesh直接拿来convex并非自动适配。[一手] 确实需要凹结构时👀[CoACD@131010c4](https://github.com/SarahWeiii/CoACD/tree/131010c4f03fec375ea88c5c6263f120046cb7f1)，MIT，现成凸分解/Unity接入；2026-04实单位误差、9月另有CuACD GPU研究。单人规模不因新算法百倍宣传就加CUDA部署。[一手；经验] 孔洞能否穿过、碰撞块数、角色/投射物所需精度由玩法决定，代理可故意不同于画面。[经验]

### 材质、透明、风格

PBR贴图存在不证明物理一致；需区分base color与烘焙阴影、roughness/smoothness与通道打包、法线方向/色彩空间，WP5细化。生成alpha、输入去背、玻璃传输是三件事；TRELLIS.2默认GLB OPAQUE已在BACKLOG核实，改alphaMode可修连接却不能补几何/折射。透明叶片/毛发反复失败时使用同风格现成cards或不透明几何；代价是题材/外观约束。[经验；TRELLIS既有源码支持]

统一参考图能控制可见轮廓/颜色，不能凭单图确定背面、结构或所有资产一致。文生3D适合探索，正式资产优先先锁参考图/多视图再成型；Tripo/Rodin文本路径内部也含图像阶段，输入清晰度比长prompt清单更可审查。[一手：两家API；经验]

## 6. 第二次修改：最小可用约束，而非完整新管线

保留被采用源mesh、纹理、合法来源、固定模型/参数与引擎资产身份；渲染几何、碰撞、挂点与玩法组件不要绑成一个不可替换生成物。[经验]

- 只改颜色/磨损：保网格/UV，先参数化材质或retexture；不重生整体。若服务重贴图重做UV，资产特定像素mask失效，要核实际UV/材质槽。[经验]
- 箱子变长、门需要打开：参数化/分件优先；图生整体箱子不保证盖子独立、铰链/pivot正确。Meshy Auto Split会重建切面且丢原纹理，不能称无损拆分。[一手：[9月16 changelog](https://docs.meshy.ai/en/api/changelog)；经验]
- 角色换衣/改变比例：优先同体系服装/骨架；重新生成后的skin、挂点、morph与动画适配需重新验收，seed不能保存这些契约。[经验；§3.2 作者二改记录支持重新验收，不证明各项均已失败]
- 重新生成失败：定位生成、后处理、导入/运行时，再决定重试；持续要人工刷权重或修面才能达标，按本基准失败，缩为静态/刚体角色或换资产。[经验；既有corosolto证据]

**常见组合与局部例外（核实：2026-10-15 UTC+8）。** [研究] 同包一致之后，扩充仍可能耗在重复摆放；先复用已有件的常见组合，不直接增加模型数量，也不规定大件更好。

- [一手：作者复盘] Dreamnoid 的 [Dear Clockmaker Postmortem（2025-10-03）](https://itch.io/devlog/1065157/dear-clockmaker-postmortem.amp)记录从体素转为模块后，细墙件仍增加摆放／迭代负担；改用较大的墙与门框组合，同时保留小网格作局部细节。[研究] 借组合粒度，不抄尺寸或自研编辑器；作者自己制作美术，不是零手修数百资产的证明。
- [一手：作者讲稿，2013] Joel Burgess 的 [Skyrim 模块复盘](https://www.gamedeveloper.com/design/skyrim-s-modular-approach-to-level-design)展示回环接不上时，补半长走廊会掩盖转角 footprint 错误，积累特殊用法；应修基础连接。[研究] AAA 团队可改源模型，不等于本基准具备该能力；不能参数化修正时换合格源／缩需求，不让生成器不断补接缝。

[一手：原生能力] Unity 6.3 [Nested Prefabs](https://docs.unity3d.com/6000.3/Documentation/Manual/NestedPrefabs.html)可让子件保留自身源链接并属于外层组合，支持 override；不等于自动合批。UE 当前 5.8 [Level Instancing](https://dev.epicgames.com/documentation/en-us/unreal-engine/level-instancing-in-unreal-engine)区分可重复 Actor 集合与适合静态密集外观的 Packed Level Blueprint，编辑会传播到其他实例。[研究] 用已有原生组合即可；Packed Level Blueprint 在此只承担静态外观，动态门／交互保留独立 Actor 或合适的行为容器，不为此加入 World Partition。Unity 的局部 override 不类推为 UE 的同等能力，共享修改与单个例外分别验证。

[研究] **二改只预注册**：常见组合复用后改门宽／墙材质，另留一个特殊入口，核共享修改、局部例外、连接与碰撞，比较重复摆放／修正工时。若多数实例都要拆改就缩组合，不预造所有排列。本文仅静态资料核对，未导入资产或运行引擎；作者生产成本不可外推，公开复盘不授予商业资产许可。

成本记“获得一个被采用且经历第二次修改的资产”所有淘汰、贴图、remesh、导出、主动工时，不记一次成功API费。当前[Meshy定价](https://docs.meshy.ai/en/api/pricing)：T2灰模5、2K/4K贴图总15，7.1灰模20/纹理总30，remesh另5；均是单次API credits，不是美元，也不覆盖订阅/图片输入生成/失败重试。[一手] Rodin营销页与API计费表口径不一致，首试前以实际方案报价确认，不横向编造净成本排名。[研究]

## 7. 精确许可范围与采用门槛

1. Kenney Nature Kit：资产CC0；包无生成模型权重；保具体包许可而不是沿用Generic Items结论。[一手]
2. Quaternius Universal Base Characters：资产CC0且明确商用；免费/Source的内容获取范围不同；第三方动画另核。[一手]
3. Poly Haven模型：CC0，不包含网站文案/商标；API商用免费为2026-07新政策，建在其API上的产品需标示来源。[一手]
4. meshoptimizer b233043、xatlas f700c7、CoACD131010：主代码MIT，无权重；输出依输入资产权利，不自动清除输入许可。[一手；研究]
5. Infinigen a0d1a0：主BSD3+标注CC0代码；目前只研究借鉴，不以主许可包办外部包/所有素材。[一手；研究]
6. LATO.2 fbb1f5a5755e6db8700cf6922fd506830b7cdccd：主MIT；HF `0x4c48/LATO.2@a91090e8077b9318ab87ac08fd9eb905903d4515`卡MIT，七个pt；[setup.sh](https://github.com/LoHhhha/LATO.2/blob/fbb1f5a5755e6db8700cf6922fd506830b7cdccd/setup.sh)固定nvdiffrast v0.4.0并称o_voxel导入必需，同一[nvdiffrast v0.4.0许可§3.3](https://github.com/NVlabs/nvdiffrast/blob/v0.4.0/LICENSE.txt)限制普通使用者为非商业研究／评估；**不能忽略该商业生产依赖门槛**。首轮商用默认暂缓。[一手；研究]
7. TaoFlowForge/Taobao3D f236914：根 Apache-2.0；2026-10-16 已另读 ModelScope 固定权重卡的 Apache-2.0 声明。三个阶段均需 DINOv3-L/16，内嵌／外载不消除独立许可；实际组件来源／版本仍待核，不列无条件商用默认，见 §10.2。[一手；研究]
8. Meshy 7.1/T2、Tripo P1/P2、Rodin Gen2.5沿WP1对应服务权利；**Tripo本地SG≠付费Tripo服务许可**，SG默认自动下载BRIA RMBG1.4未清商用，不引入为“MIT全套”。[一手：[TripoSG固定README](https://github.com/VAST-AI-Research/TripoSG/blob/fc5c40990181e2a756c4e0b1c2f4d6b5202faf8c/README.md)；研究]
9. Marble：阶段 F 已补读当前合同和导出页，Pro 可作受限背景候选；免费生成不追溯升级，Standard 的商用口径需实际订单澄清，见 §10。[一手／研究]

## 8. 新证据与停止点

[研究] 已读一手商业契约、固定源码／许可及论文方法和限制；固定提交／目录已核，未安装、下载权重、付费生成或运行引擎。

足以改变建议的新增证据：原生低模商业入口与退役旧参数；同样“成功”的朝向错误；低模作者产物与费用记录的证据限制；LATO.2依赖重现许可阻塞；TaoFlowForge 真实开源推理，权重仓许可声明已补核但 DINO 适用链仍缺；最新UV论文仍明确人工精修范围；碰撞、UV、LOD可直接借成熟库而非自建。[研究]

后续只需窄实验（待用户授权，当前不执行）：同一个带孔刚体需求，用同风格现成/参数化基线、T2、7.1或Rodin各一条；保所有淘汰件并做一次“改尺寸且保挂点/颜色”的修改。角色实验另立样本，不能与刚体合算。授权不满足的路线先排除。停止条件是目标视距轮廓/材质/碰撞通过且第二次修改成功，或确认需手修而撤回；不扩成新的管线框架。[经验]

[研究] 历史交付检查：`check_repo.py`、完整离线 14 阶段（非空无 skip）、70 处标题引用与 `git diff --check` 通过；独立复核据固定源码区分 Infinigen 文档 USDC 和实现 usda/usdc 分支。仅仓库检查，非外链事实、引擎或 hosted CI 验证。

## 9. 阶段 F 补缺：Blender 无头处理与最终产物验收

核实时间：2026-10-14。改变的建议：明确采用 bpy 原生处理层，但按实际导出预算、节点身份和元数据验收；不以现成 pipeline 的目标参数或成功日志代替结果。[研究] 本节只读官方资料与固定源码，没有运行 Blender、引擎、模型或付费生成。

### 9.1 原生操作先用，处理器按任务选择

Blender 无头启动可运行 Python 脚本调用内置操作；它是现成 DCC 的批处理入口，不需要以 MCP 为前置。对静态道具，已知单位／朝向时规范变换，按明确部件保留 pivot，再按需简化、展开 UV、烘焙和导出；这些操作不应一律全部执行，已有合格 UV／纹理时优先保留。[研究／经验]

本轮固定 Blender **5.2.2，d13f752e3b9c4f8c261cda552b1021f8bcc0382c**，release 分支提交日期 2026-09-14；[COPYING](https://github.com/blender/blender/blob/d13f752e3b9c4f8c261cda552b1021f8bcc0382c/COPYING)为 GNU GPL，不能把软件许可等同输入资产清权。[一手：GitHub API／源码]

- **减面口径**：[collapse 实现](https://github.com/blender/blender/blob/d13f752e3b9c4f8c261cda552b1021f8bcc0382c/source/blender/bmesh/tools/bmesh_decimate_collapse.cc#L1318-L1342)先三角化，再以 `bm->totface * factor` 算目标。按顶点比例设置 ratio 只能近似，不保证顶点上限；最终导出还需核实际顶点。[一手／研究]
- **模式边界**：[modifier 分支](https://github.com/blender/blender/blob/d13f752e3b9c4f8c261cda552b1021f8bcc0382c/source/blender/modifiers/intern/MOD_decimate.cc#L173-L193)只有 dissolve／Planar 分支传 `delimit`；Collapse 走另一个调用。不要把 Planar 保 UV／材质边界的选项写成所有减面的保证。[一手／研究]
- **UV 与重建**：Smart UV Project 按角度切分、投影，适合机械／建筑候选，不创造纹理。Remesh 重新采样形状／体积，薄片和孤立小部件有损失风险；不能从“得到流形／四边面”推成“得到解剖面流”。换 UV 后仍需重新烘焙／贴图，变形角色另验 skin／morph。[官方手册检索返回／研究；见下方阅读边界]
- **仅 glTF 优化**：已有合格几何时优先复用 gltfpack。固定 [b233043 README](https://github.com/zeux/meshoptimizer/blob/b2330430776a95a1545f03fc7bf16927f8cadc59/gltf/README.md)，MIT，提交日期 2026-10-09。默认会合并 mesh、裁剪节点、量化并处理动画；需要可操控节点／材质时核 `-kn/-km`，extras 核 `-ke`，压缩扩展需目标导入器支持。未知扩展和一般自定义顶点属性仍可能丢弃，保留选项不是万能无损转换。[一手]

**新增授权反证**：[Meshy 2026-09-19 Terms §2.4](https://www.meshy.ai/terms-of-use)禁止删改输出中的 AI 机器可读元数据、水印等标识。结合 gltfpack 默认丢数据机制，批处理前须识别实际资产携带的标识并验证保留；不清楚其存储形式时不要无条件运行会丢弃未知数据的优化。这里只能推出风险和检查要求，**没有检查实际 Meshy GLB，不能声称某次输出必定含标识或某次转换已经违约**。[一手条款＋源码／研究推导]

### 9.2 现成游戏管线只借通过核对的部分

Shards Asset Toolkit 固定 **94bd478782d9629586d5d1138d2172f0337a7745**，最新提交核到 2026-09-28，[MIT](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/LICENSE)。近期提交及作者游戏展示说明存在真实工作背景，不保证公开脚本覆盖展示产物。[一手／研究]

1. [vat_bake.py L47–64](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/scripts/blender/vat_bake.py#L47-L64)只取第一个 mesh，以 `target_verts / len(vertices)` 设置 `Decimate.ratio`，随后没有预算合格断言。与 Blender 三角面口径对照，这不是通用多对象顶点硬预算实现。[一手／研究]
2. 同文件 [L129–146](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/scripts/blender/vat_bake.py#L129-L146)生成 placeholder 图片并输出成功；完整文件未逐帧采样顶点，也未写其宣称的 UV2 lookup。不能把展示 VAT 归因于此公开脚本，或据此声称完整烘焙可复现。[一手：静态源码阅读]
3. [optimize.mjs](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/src/optimize.mjs)在 resize 失败时复制原文件，KTX2 失败时退回 meshopt；最后文件存在／打印完成不证明贴图尺寸与 GPU 格式达到要求。[一手／研究]

**采用判断**：✅ 借 Blender 原生 modifier／export 与 gltfpack；🧪 借 Shards 的[无头启动和异常退出](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/src/vat.mjs)机制；⛔ 不原样采用其完整 VAT／顶点预算承诺。不把这个小项目的缺陷推广为 Blender 或所有现成管线失效，也不为补齐它而新造框架。[经验]

### 9.3 验收边界与后续窄实验

程序可检查尺寸、有限数值、三角面／顶点、UV 存在、贴图尺寸、节点／材质名与必要元数据，生成独立碰撞代理。程序也能执行减面、投影与权重分配，但**数值合法不等于视觉语义正确**：把手是否缺失、孔洞是否保留、部件能否按玩法运动、蒙皮是否自然仍须实际观看与玩法验证；反复需要人工修面时回退到现成资产／参数化结构。[研究／经验]

建议后续实验仍只选一个带孔静态道具：原始 GLB → 原生 bpy 或 gltfpack → 导出后统计与相机检查 → 改尺寸且保挂点；多 mesh、UV 硬边与元数据保留作为对照输入。只提出计划，本次不运行。[经验]

**阅读边界**：当前官方 5.2 手册的 [Decimate](https://docs.blender.org/manual/id/5.2/modeling/modifiers/generate/decimate.html)、[Remesh](https://docs.blender.org/manual/ka/latest/modeling/modifiers/generate/remesh.html)、[UV](https://docs.blender.org/manual/pt/latest/modeling/meshes/editing/uv.html)、[glTF](https://docs.blender.org/manual/nl/5.2/addons/scene_gltf2.html)仅取得官方检索返回，直接全文获取失败，不冒称全文核读；关键减面与身份结论由成功取得的固定源码支持。未安装、下载权重或运行真实资产处理。[研究]

## 10. 动态事实表：限定补核

本表覆盖本专题已采用／候选路线的主要型号、价目、许可与维护决策；未能闭合的字段标明真实尝试和安全降级，**不把缺失条款当已获授权，也不声称全依赖树审计完成**。核实日统一为 **2026-10-14**；常规下次复核为 **采用前或 2026-11-14，以较早者为准**。表内提前退役节点优先，不是已创建定时任务。[研究]

| 对象／字段 | 当前事实与来源 | 本轮状态／采用结论 | 下次复核 |
|---|---|---|---|
| Meshy 型号／参数 | [Image API](https://docs.meshy.ai/en/api/image-to-3d)：`meshy-7.1` 为 standard 的 latest；T2 用 smart-topology，triangle-only；目标 100–15,000，实际可偏离；旧 lowpoly 2026-10-30 退役 | [一手] 直接复核；T2 静态灰模候选，锁显式型号 | 采用前／2026-10-29 |
| Meshy API 费用 | [价格](https://docs.meshy.ai/en/api/pricing)：T2 灰模 5、2K／4K 总 15、8K 总 20 credits；7.1 灰模 20、2K／4K 总 30、8K 总 35；Ultra 加 5，remesh 另 5 | [一手] 直接复核；仅每次 API credits，不是美元／合格件成本 | 采用前／2026-11-14 |
| Meshy 输出商用／标识 | [Terms](https://www.meshy.ai/terms-of-use)更新 2026-09-19：§3.2 免费 CC BY 4.0，付费在法律允许范围归客户；§3.3 公开 Customer Output 为 CC0，其余 Community 内容 CC BY-NC；§2.4 禁删 AI 标识 | [一手] 直接复核；输入权利、生成时套餐与元数据一起验，不能只核模型 | 采用前／2026-11-14 |
| Tripo 型号／规格 | [P 系列](https://developers.tripo3d.ai/en/docs/generation-text-to-model/p)：P1-20260311；P2-20260801 仍 Preview，quad 仅 P2；纹理需另锁 v3.5-20260815，P 系列默认纹理仍 v3.0-20250812 | [一手] 直接复核；P1 作对照，P2 不因 quad 升为角色默认 | 采用前／2026-11-14 |
| Tripo 价格 | [生产域 P1 页](https://developers.tripo3d.ai/en/models/p1)：文本灰模／标准／详细 30／40／50，图片或多图 40／50／60 credits；[v3 changelog](https://developers.tripo3d.ai/en/docs/changelog)：P2 灰模 100，标准／详细／极致 110／120／130；[价目](https://developers.tripo3d.ai/en/pricing) 1 credit=US$0.01 | [一手] 换正确入口后直接复核，不能用 API 示例当价格；不照旧 v2 文档的 P1 all-in 口径推算新纹理选项 | 采用前／2026-11-14 |
| Tripo 商用／终止 | [Terms §5.2、§10.4–5](https://www.tripo3d.ai/terms)：付费权利与免费不同；退订停止续费，ownership 条款按性质存续；账户输出可能删除 | [一手／研究] 有依据保留付费期间取得的所有权，先备份；未找到旧免费资产追溯变商用授权，因此该路径排除，改在明确付费条件下重新生成 | 采用前／2026-11-14 |
| Rodin 2.5 型号／价格冲突 | [端点文档](https://docs.hyper3d.ai/en/api-specification/rodin-gen2-5)基本 0.5 credits、Extreme-High tier 加 0.5、extreme-high texture 加 2.0；[API 产品页](https://hyper3d.ai/features/api)却写 Gen-2.5 从 1 credit 起；tier 必须明确 | [一手／研究] 两页均直接读取；不选择较低数字冒充当前统一报价。采用前确认实际配置报价，不据此算单件美元价 | 采用前／2026-11-14 |
| Rodin 套餐／API 门槛 | [计划](https://hyper3d.ai/pricing?lang=en)：Creator US$30 月付／US$288 年付；Business US$120 月付／US$1,152 年付，API 属 Business；直接购买 US$1.5/credit | [一手] 直接复核；网页 Creator 与 API 预算分开，不能只按端点 0.5 credit 宣称廉价自动化；不把预计模型数当合格件数 | 采用前／2026-11-14 |
| Rodin 输出／终止 | [Terms §5(b)、§12、§19](https://hyper3d.ai/legal/terms)：Rodin 输出用途不按免费／付费切分；终止可删数据，§19规定条款存续；ChatAvatar 另款 | [一手／研究] 直接复核；不再泛称未读终止条款。保存合法导出和取得时许可，不套用 ChatAvatar 账户存续条件；特定订单可另约 | 采用前／2026-11-14 |
| Kenney Nature Kit | [具体包](https://kenney.nl/assets/nature-kit)：330 files、CC0、免费，可不捐赠下载 | [一手] 直接复核；同风格静态基线，不保证目标设备预算 | 换包／采用前／2026-11-14 |
| Quaternius 基型 | [具体包](https://quaternius.com/packs/universalbasecharacters.html) CC0；[作者商店](https://quaternius.itch.io/universal-base-characters/purchase) Standard 122MB 免费，Source 600MB 标 US$19.99 | [一手] 直接复核；按具体下载档选择，Source 价格不含本轮未见的结算税费；未下载或购买 | 采用前／2026-11-14 |
| Poly Haven 资产／API | [资产许可](https://polyhaven.com/license) CC0；[API](https://polyhaven.com/our-api)商用免费，使用 live API 的产品需标来源及独特 User-Agent | [一手] 直接复核；资产署名与 API 条件分开，不视为低模预算保证 | 采用前／2026-11-14 |
| Blender／gltfpack／Shards | §9 固定 SHA、代码许可与实际机制；Blender 5.2.2、gltfpack 2026-10-09 固定提交、Shards 2026-09-28 固定提交 | [一手] 直接读代码；更新版本时重核，源码结论不等于运行通过 | 升级／采用前／2026-11-14 |
| Marble 型号／费用／导出 | [导出页](https://docs.worldlabs.ai/marble/export/gaussian-splat)：Standard 有 splat／collider，Pro 才列高质量 GLB 和商业权利；[价格页](https://marble.worldlabs.ai/pricing)检索返回 Standard US$20、Pro US$35、Max US$95/月，Marble 1.0／1.1／1.1 Plus，mesh 创建 3,500 credits | [一手正文／官方检索返回] 价格页直接正文为空，不把检索价当结算保证；Pro 仅作交互弱的背景候选，采用前核实际套餐 | 采用前／2026-11-14 |
| Marble 商用／追溯 | [2026-01-21 TOS §3.3、§3.7、§11.5、§13.23](https://www.worldlabs.ai/terms-of-service)：免费输出非商业；付费输出归属及权利按生成时账户确定，付费定义包含 Standard；知识产权条款存续，不得删嵌入标识 | [一手／研究] 合同已读。与导出页“Pro商业权利”存在口径张力，Standard 不默认发行；选 Pro 并核实际订单。免费旧输出不因升级自动取得付费权利 | 采用前／2026-11-14 |
| TRELLIS.2-4B／默认依赖 | [当前权重卡](https://huggingface.co/microsoft/TRELLIS.2-4B) MIT；代码最新仍 75fbf018（2026-06-05），[setup](https://github.com/microsoft/TRELLIS.2/blob/75fbf0183001ed9876c8dbb35de6b68552ee08bd/setup.sh)锁 nvdiffrast v0.4.0；[该依赖 §3.3](https://github.com/NVlabs/nvdiffrast/blob/v0.4.0/LICENSE.txt)限非商业研究／评估 | [一手] 卡、默认安装说明与许可重读；主模型候选，默认商业生产组合排除，替代依赖未测不放行；无订阅价不等于零算力成本 | 换权重／依赖前或2026-11-14 |
| LATO.2／默认依赖 | [当前权重卡](https://huggingface.co/0x4c48/LATO.2) MIT；最新代码仍 fbb1f5a（2026-08-15）；[setup](https://github.com/LoHhhha/LATO.2/blob/fbb1f5a5755e6db8700cf6922fd506830b7cdccd/setup.sh)仍锁同一受限 nvdiffrast，并写明 o_voxel import 必需 | [一手] 重读后未改变门槛；默认组合不作免费商业生产，不把删除下载语句当合法可运行替代 | 换权重／依赖前或2026-11-14 |
| Hunyuan3D-2.1 | 最新代码仍 82920d64（2025-10-17），[固定许可](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/82920d643c0dc2f7bfd7255f45f62d386edfe60c/LICENSE)与[当前权重许可](https://huggingface.co/tencent/Hunyuan3D-2.1/blob/main/LICENSE) §5(c)将 EU／UK／韩国排除延伸到 Output；§4为发行时前月 MAU >100万另许 | [一手] 两份重读；排除全球默认发行，不是收入低就豁免；不外推新版本／托管合同 | 采用前／2026-11-14 |
| TaoFlowForge 权重／依赖 | 2026-10-16 补核：代码固定 f2369145，根 Apache-2.0；ModelScope 权重仓 e15065c2 的模型卡独立声明 Apache-2.0；三个阶段均需 DINOv3-L/16，Meta 独立许可已读，精确来源见 §10.2 | [一手／研究] 撤回“权重许可未查得”；实际 DINO 来源／版本及适用许可链未闭合，仍不列无条件商用默认，不判定为非商用专用或已违规 | 来源／适用链补齐后采用前／2026-11-14 |
| Infinigen 维护／代码许可 | GitHub API 最新仍 a0d1a0dd，2026-10-08 的 2.0.0a3 rooms；[LICENSE](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/LICENSE) BSD-3-Clause | [一手] 重核；只借单资产配方，alpha 发布与许可不证明整场景游戏交付，导出限制沿 §4 固定实现 | 升级／采用前或2026-11-14 |
| xatlas 维护／许可 | GitHub API 最新仍 f700c779，2022-07-25；[LICENSE](https://github.com/jpcy/xatlas/blob/f700c7790aaa030e794b52ba7791a05c085faf0c/LICENSE) MIT | [一手] 重核；成熟 UV 工具候选，不标近期活跃；新 UV 不保旧贴图 | 升级／采用前或2026-11-14 |
| CoACD 维护／许可 | GitHub API 最新仍 131010c4，2026-09-23；[LICENSE](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/LICENSE) MIT | [一手] 重核；复杂凹碰撞才评估，CuACD 新闻提交不等于本轮 GPU 性能验证 | 升级／采用前或2026-11-14 |

### 10.1 剩余条件的安全降级

本次继续补核了前一轮列出的全部候选类别，并将结果写进表内；“已检查字段”与“已获商用放行”分别记录。[研究]

- **价格冲突**：Rodin 端点与产品页费用不一致，产品页和条款对月付／最低订阅承诺也需实际订单确认；保留高细节对照，不提供未经核实的最低美元成本或自动下单配置。Tripo 已找到生产域价格入口，旧 v2 all-in 文案不再作为新配置依据。[一手／研究]
- **合同口径**：Marble 合同付费定义含 Standard，导出说明却将商用列 Pro；使用 Pro 作为有条件候选，Standard 和免费旧资产不默认商业发行。Tripo 终止条款保 ownership，但旧免费生成追溯授权未查得，排除此用法；Rodin 不再误套 ChatAvatar 的条件。[一手／研究]
- **许可待核／明确限制**：TaoFlowForge 已补得权重仓 Apache-2.0 声明，剩余缺口是实际 DINO 来源／版本及适用链（§10.2），继续不列无条件商用默认；TRELLIS.2／LATO.2 默认依赖和 Hunyuan3D-2.1 全球输出已有明确排除依据，不为补齐表格而改成可用。[一手／研究]
- **实际账户与运行缺口**：未登录核实际订单、地域可用性、生成记录和结算税费；未下载权重、测试替代依赖或测生产成本。推荐只覆盖表内精确版本与限定用途，任何升级／第三方托管／新增依赖需重新核。[研究]

[研究] 历史阶段 F 增量：`check_repo.py` 177 文件无错误、两文件 `git diff --check` 通过；该轮未重跑完整离线入口。

### 10.2 TaoFlowForge：补得权重声明，仍核实际 DINO 适用链

核实：2026-10-16（UTC+8）。改变的判断：不再将“权重许可失访”列为未知；不将新发现的模型卡声明扩大为整套依赖清权。[研究]

- **权重仓声明**：[官方元数据 API](https://www.modelscope.cn/api/v1/models/Taobao3D/TaoFlowForge) 的 `License` 与[固定模型卡](https://www.modelscope.cn/models/Taobao3D/TaoFlowForge/resolve/e15065c267a8e3aecf0b922016a7970e72730396/README.md)均写 `Apache License 2.0`。[文件清单 API](https://www.modelscope.cn/api/v1/models/Taobao3D/TaoFlowForge/repo/files?Revision=master&Recursive=true)所列末提交为 `e15065c267a8e3aecf0b922016a7970e72730396`（2026-10-08 09:13:55 UTC）；README 自身修订为 `242a476675854bae148663860bd45a9d13aa5fdd`（2026-10-02）。固定版与 master 模型卡 SHA-256 均为 `4e726e23b548e1b19f089ab6ba6a15da524c02c68104b8967ed093ac87ca19f5`，与文件清单一致。清单为三个 stage 权重及配置、README、Git 属性文件，未列独立 LICENSE／NOTICE；这不证明权重内部没有通知。模型卡正文为默认介绍，没有说明内嵌 DINO 来源。[一手]
- **装载链已确定**：代码固定 `f2369145382e07551fb633a589f69771b40adf32`；[dino.py](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/taoflowforge/models/dino.py)构造 DINOv3-L/16；[stage0 L359–381](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/taoflowforge/models/stage0.py#L359-L381)、[stage1 L423–455](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/taoflowforge/models/stage1.py#L423-L455)、[stage2 L321–353](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/taoflowforge/models/stage2.py#L321-L353)均在完全缺少内嵌 DINO 时才从指定路径外载，未提供路径则报错，最终严格核键／形状。外载参数不是覆盖已有内嵌权重的开关；架构匹配也不能证明实际 checkpoint 的来源或版本。[一手／研究]
- **独立许可已读**：Meta [DINOv3 License](https://github.com/facebookresearch/dinov3/blob/ffb4bb89c6558ca3244655c25a3955d01788b732/LICENSE.md)更新于 2025-08-19，适用对象含代码、训练权重等 DINO Materials。§1(a)授予有限、全球、免许可费的使用／复制／分发／修改权，未写一般非商业限定或营收阈值；§1(b)(i)要求分发材料及衍生物时沿用协议并附副本，另有研究署名、法律／贸易控制和用途条件。权重仓的 Apache 标签不覆盖这份独立许可，也不能据此断言已违规。[一手／研究]

**采用门槛**：先补实际发布权重中的 DINO 来源、版本及适用许可链，再评估具体商业用法；当前不列无条件商用默认，不改成“只能非商业研究”。这是资料选型结论，不是法律保证。[研究]

**验证边界**：本次以普通公开 GET 成功取得 ModelScope API／固定 README，未登录、下载权重或运行模型；网页抓取失败不再作为许可不存在的依据。独立复核对保存响应的解析／哈希核对，与重新从服务取得同一响应是两种证据，不将前者称为第二次独立获取；也未审计完整依赖树或验证实际发行包内容。[研究]

### Tripo 版本选择补核（2026-10-15 UTC+8）

[一手：当前公开文档，非调用实测] 重新交叉读取 [P 系列文本生成](https://developers.tripo3d.ai/en/docs/generation-text-to-model/p)、[图片生成](https://developers.tripo3d.ai/en/docs/generation-image-to-model/p)及[独立纹理端点](https://developers.tripo3d.ai/en/docs/models-texture)。保留上表的历史核实日期；本次只更新以下契约，下次在采用前或 2026-11-15 复核：

- 生成端点的几何字段 `model=P1-20260311`／`P2-20260801` 与纹理字段 `texture_version` 独立；省略后者时 P 系列仍选 `v3.0-20250812`。这是当前文档默认，不是由旧发布日期推测的历史默认。
- 需要 `delight` 时显式设 `texture_version=v3.5-20260815`；旧纹理模型忽略该开关。`texture_quality=fast` 也要求此版本，否则报 `1004`；fast 与 standard 同价，不以名称推断省钱。灰模要同时关闭 `texture` 和 `pbr`，因为默认 `pbr=true` 会强制打开纹理。
- 独立 `POST /v3/models/texture` 的纹理版本字段改为 `model`，默认仍为 `v3.0-20250812`；不能把生成端点的 `texture_version` 原样搬来。根据既有 task ID 重贴图时，官方建议再次提供参考图。
- [研究] 留存原始请求（几何／纹理版本、seed、质量、PBR、delight）、创建返回的 `data.task_id`、终态结果与采用文件；文档示例没有返回已解析的双版本证明，不能从 `success` 或文件名补造它们。去光照能力不等于实际表面可重新打光，仍验最终材质。

[研究：变化与范围] 这修复正文只选 P1 而未定义纹理的采用缺口；不改 P2 Preview 的候选地位，不将新版纹理宣传当同题质量胜出。没有调用生成／重贴图 API、下载模型或运行引擎。


## 11. 装饰改成交互：分件不是运动结构

核实：2026-10-15（UTC+8）。问题限定为“第二次让装饰门可开合，或改变门宽／通道”，不重新排名生成器。[研究]

**改变的选择：** 不只买／生成“多个 mesh”，而是优先已有父子结构、局部连接坐标与运动轨道／关节定义的资产；碰撞独立保留。装饰网格可替换，交互结构先固定。需要自定义尺寸时，选能在几何改变后重建连接坐标的参数化配方；仅整体缩放不能保证通行宽度、门厚、动画及碰撞同时符合玩法。变形角色仍走已有骨架／skin 体系，不从门的刚体动画外推。[经验]

### 11.1 不同交付物回答不同问题

|来源与证据|实际可核的交付|采用／撤回判断|
|---|---|---|
|Kenney [Modular Dungeon Kit](https://kenney.nl/assets/modular-dungeon-kit)，下载包内标 2.1、CC0；本轮直接解析指定 GLB|`gate-door.glb` 有两个 mesh、父子节点；三条动画通道都写门扇节点 rotation，二进制数据确有变化；`gate.glb` 则是单节点、无动画|✅ 若画风／尺寸合适，可作门的结构起点；不能从同包名字或网页 Animation 标签认定每件资产都有运动结构，也未证碰撞已适配|
|不同作者 Quaternius [Medieval Village MegaKit](https://quaternius.com/packs/medievalvillagemegakit.html)，本轮读交付说明|作者承诺网格化拼接；自定义碰撞及引擎工程列在 Source 交付，免费模型不是同一范围|👀 选现成方案仍核下载档位；本轮没有取得该 Source 文件，不把商店承诺计为第二份实际运行／文件验证|
|Meshy [Auto Split API](https://docs.meshy.ai/en/api/auto-split)，商业端点文档|按可打印部件分割，切面封闭并加固薄区，移除塌陷碎片；保对象的格式可分件，但不保输入纹理|🧪 分件可供后续处理，不能据此代替准确运动轴、限位、碰撞或原拓扑；这是该打印功能边界，不是否定 Meshy 所有游戏资产路线|
|Infinigen 固定源码，见下|专门关节路径从元数据生成连接关系、轴／范围，视觉和碰撞分开（碰撞须非 `visual_only`）；整场景路径不含 articulation|👀 借已有参数化关节配方；固定 URDF 惯量实现存在静态类型问题，不原样推荐直接执行，也不默认引入整套机器人模拟栈；“同一个工具／同一个扩展名”不保证同样的结构|

表中 Kenney 为本轮产物静态复算；Infinigen 为代码／文档核查；Quaternius 与 Meshy 为作者契约，均不是引擎实测。[一手／研究]

### 11.2 Kenney：不是用节点名称猜门会开

[公开下载 ZIP](https://kenney.nl/media/pages/assets/modular-dungeon-kit/7bed87605b-1771926065/kenney_modular-dungeon-kit_1.0.zip) 的 URL 虽含 1.0，内部 `License.txt` 明写 Modular Dungeon Kit (2.1)，创建日期 2026-02-24，CC0，允许商业使用。以内容和 hash 固定本轮样本，不由 URL 猜版本。[一手]

- ZIP：6,886,434 bytes；SHA-256 `dd0aa6776db8912283cdca60161dee6a8839bbda3558eba2ea501419eb5b4623`
- `Models/GLB format/gate-door.glb`：SHA-256 `902ac6617d56143799aa2ca73d1113838cb09a9ebc7cbd7c7eeb785504099fd8`
- 根节点引用 mesh 0，子节点 1 引用 mesh 1，局部位移约 `(1.5, 0, 0)`；三条通道的 target 都是节点 1 的 rotation
- `open` 为 30 个采样点、时间 0–1 秒；`close` 同为 30 点／0–1 秒；`open-and-close` 为 60 点／0–2 秒。这里“点”是 sampler 样本数，不推断引擎帧率
- open 的首／末四元数约 `(0, 0, 0, -1)` 与 `(0, 0.76604444, 0, -0.64278764)`；close 顺序相反。读取 BIN accessor，而非仅看动画名字
- 门扇 POSITION 实值的局部 x 范围 `[-3, 0]`，支持在一侧原点附近转动的结构候选；**不单凭边界确认铰链装配正确**。文件只声明 `KHR_texture_transform` 扩展，不能凭 GLB 的这些字段认定已经交付目标引擎 collider

[一手：本轮标准库解析] 可复核代码如下；输入是上述 ZIP，不运行包内文件，不安装依赖：

```python
import hashlib, json, struct, zipfile
from pathlib import Path

raw = Path("kenney_modular-dungeon-kit_1.0.zip").read_bytes()
print("zip", len(raw), hashlib.sha256(raw).hexdigest())
with zipfile.ZipFile(Path("kenney_modular-dungeon-kit_1.0.zip")) as z:
  print(z.read("License.txt").decode())
  b = z.read("Models/GLB format/gate-door.glb")
assert struct.unpack_from("<4sII", b) == (b"glTF", 2, len(b))
size, kind = struct.unpack_from("<II", b, 12)
assert kind == 0x4E4F534A
j = json.loads(b[20:20 + size])
bin_size, bin_kind = struct.unpack_from("<II", b, 20 + size)
assert bin_kind == 0x004E4942
blob = b[28 + size:28 + size + bin_size]

def values(index):
  a = j["accessors"][index]
  assert a["componentType"] == 5126 and "sparse" not in a
  v = j["bufferViews"][a["bufferView"]]
  assert v["buffer"] == 0
  n = {"SCALAR": 1, "VEC3": 3, "VEC4": 4}[a["type"]]
  start = v.get("byteOffset", 0) + a.get("byteOffset", 0)
  stride = v.get("byteStride", n * 4)
  return [struct.unpack_from("<" + "f" * n, blob, start + k * stride)
          for k in range(a["count"])]

print("glb", hashlib.sha256(b).hexdigest(), "nodes", j["nodes"])
for anim in j["animations"]:
  for channel in anim["channels"]:
    sampler = anim["samplers"][channel["sampler"]]
    t, q = values(sampler["input"]), values(sampler["output"])
    print(anim["name"], channel["target"], len(t), t[0], t[-1], q[0], q[-1])
for p in j["meshes"][1]["primitives"]:
  xyz = values(p["attributes"]["POSITION"])
  print("door x", min(v[0] for v in xyz), max(v[0] for v in xyz))
```

局限：未做动画播放、碰撞检测、穿门测试、改宽后二次导入；数字确认的是交付文件内的数据，不是零手修游戏效果。[研究]

### 11.3 Infinigen：有明确关节的路径，也有丢关节的路径

固定已有版本 [`a0d1a0dd5644904d3cb921ff24260160ac06ae08`](https://github.com/princeton-vl/infinigen/tree/a0d1a0dd5644904d3cb921ff24260160ac06ae08)，主 BSD-3-Clause／标明部分 CC0 的范围沿 §4 与 WP1，不推完整依赖栈已清权。本轮新增阅读：[关节定义](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/docs/source/UsingJointNodes.md)、[URDF exporter](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/src/infinigen/core/sim/exporters/urdf_exporter.py)、[模拟导出说明](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/docs/source/ExportingToSimulators.md)。[一手]

- 关节节点明确 parent／child、child origin 作为连接位置、轴和范围；父端位置相对父几何 AABB 中心。因此改变形状／尺寸后要重新核连接位置，不能把旧局部坐标当不变量。作者明确关节化以后不再变形拓扑，只允许平移／旋转。[一手]
- `_populate_links` 写 `visual`，仅在 `not visual_only` 时写 `collision`；外层 `export` 的 `visual_only` 默认是 True，不能只凭选择 URDF 就假定有碰撞。它读取关节属性并生成相对 origin；`_create_joint` 写 parent／child、axis、limit，把 HINGE 映射为 revolute、SLIDING 映射为 prismatic。多关节 body 在此 URDF 路径会抛 NotImplementedError，不从 GUI 支持外推所有导出都支持。[一手：固定代码约 138–210、219–255、289–336 行]
- **固定实现并非可直接采用的完整管线。** 独立复核发现 URDF exporter 第 162 行将 `mass` 赋为 XML Element，第 170 行却计算 `mass / t.volume`。本轮只用标准库复算 `xml.etree.ElementTree.Element("mass") / 1.0`，得到 `TypeError`；未运行 Blender／trimesh 完整调用，也未验证修复。该问题不影响代码中存在关节／碰撞定义的证据，但撤回直接运行此固定导出器的建议。[一手／研究]
- 同版文档反而明确：整场景 USD exporter 不含 articulation；没有 `solve_state.json` 时，所述 IsaacSim 场景导入所有对象均为静态 collider。单资产模拟路径和整场景路径不可互换。[一手]

这给出可复用机制，而非另一套需自建的框架：先把活动件与固定件及其连接定义放在结构源中，再附外观；如果只改外观，不重生运动结构。角色蒙皮不是这些刚体关节，不能拿该机制解决衣服变形。[经验] 没有运行 Infinigen、第三方依赖或任何引擎；Unity／Unreal 的实际导入适配仍待后续获准验证。[研究]


## 12. 只换外观：重贴图不是结构无损编辑

核实：2026-10-15（UTC+8）；商业端点采用前或 2026-11-15 复核，固定源码升级后重核。本节只解决二改时旧 UV、材质槽及分件引用是否可沿用，不比较生成美观度。[研究]

**改变的选择：** 已有合格网格且只需改色／粗糙度，优先原材质参数；需要生成新纹理时才进入重贴图，并核它是否改变 UV 或对象结构。UV 像素 mask、材质替换索引和交互节点是不同契约，不能用一个“保 UV”开关全部放行。[经验]

### 12.1 三种证据不能互相替代

|来源|已核契约／机制|对第二次修改的影响|
|---|---|---|
|Meshy [Retexture API](https://docs.meshy.ai/en/api/retexture)，本次直接正文|`enable_original_uv=false` 为默认；已有有效 UV 应显式 true。该字段说明只承诺 UV 布局，不包含节点、材质槽、skin 保留承诺|🧪 可选保 UV 重贴图，仍比较实际文件与旧引用；不能省略参数后假设只改像素|
|Tripo [Texture API](https://developers.tripo3d.ai/en/docs/models-texture)，不同服务作者|支持已有 task／上传模型、按 `part_names` 选此前分割的部件；本页未列同等保原 UV 开关或节点／材质身份保留契约|👀 有按部件处理入口，但不能据此断言未选部件的 UV／材质索引不变；也不能反过来说服务必然破坏它们|
|Hunyuan3D-2.1 `82920d64`，下节固定源码|关闭 remesh 仍进入 UV 重建；几何数组进入渲染器，再经单对象／单材质 OBJ 转 GLB|⛔ 不将此原样当已有分件／换装资产的保结构重贴图器；这不否定独立静态候选的首次贴图用途|

Meshy 端点当前 `latest` 标 Meshy 7，不能借几何生成页的 7.1 推断重贴图模型也为 7.1；Tripo 纹理版本选择仍沿 §10 已核规则。[一手／研究] Meshy 既有 [cookbook 固定记录](https://github.com/meshy-dev/meshy-cookbook/blob/73bb39e185076a7e0a696add61277221c9ff8feb/examples/06-text-to-restyled-prop/sample-result.json)称无旧 UV 的灰模在开关 true／false 下得到相同统计，但不公开 GLB，不能据此验证“有效旧 UV 被保留”。本次不将旧作者记录算新样本。[一手／研究]

### 12.2 Hunyuan：追到导出消费者，不只读函数名

固定版本 `82920d643c0dc2f7bfd7255f45f62d386edfe60c`，下列文件均直接读取；没有 import 或执行上游代码。[一手]

1. [textureGenPipeline.py L93–120](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/82920d643c0dc2f7bfd7255f45f62d386edfe60c/hy3dpaint/textureGenPipeline.py#L93-L120)：`use_remesh=True` 为默认；false 只让输入路径跳过 remesh，随后仍无条件调用 `mesh_uv_wrap(mesh)`。
2. [uvwrap_utils.py L20–32](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/82920d643c0dc2f7bfd7255f45f62d386edfe60c/hy3dpaint/utils/uvwrap_utils.py#L20-L32)：Scene 输入先 `dump(concatenate=True)`，再 `xatlas.parametrize(vertices, faces)`，用返回的映射／索引／UV 覆写网格。这里是贴图前重建，不是纹理采样本身改了拓扑；也不把每次顶点数必增当保证。
3. [MeshRender.py L604–663](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/82920d643c0dc2f7bfd7255f45f62d386edfe60c/hy3dpaint/DifferentiableRenderer/MeshRender.py#L604-L663)与 [mesh_utils.py L41–58、97–131](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/82920d643c0dc2f7bfd7255f45f62d386edfe60c/hy3dpaint/DifferentiableRenderer/mesh_utils.py#L41-L131)：消费者取位置、面与 UV 数组；保存器写一个以输出文件命名的 `o` 和一个 `usemtl Material`。原节点层次／多材质分配没有沿这条接口传入保存器，不能期待原样保留。
4. [pipeline L186–189](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/82920d643c0dc2f7bfd7255f45f62d386edfe60c/hy3dpaint/textureGenPipeline.py#L186-L189)调用保存后才转 GLB；[转换器 L260–285](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/82920d643c0dc2f7bfd7255f45f62d386edfe60c/hy3dpaint/DifferentiableRenderer/mesh_utils.py#L260-L285)读取这个 OBJ 再导出，不能恢复上游未传递的原对象身份。渲染器保存时用 `get_mesh(normalize=False)`，因此不凭内部归一化另指控最终尺度必丢失。

许可与采用分别判：沿 [WP1／本记录 §7、§10](2026-10-14-game-wp1-licensing.md)已有地域及输出限制，不把公开代码改写为免费全球商用路径；商用候选准入、文件结构与视觉质量是三道独立问题。[研究]

### 12.3 保留还是接受重建成本

- 旧 UV mask 必须复用：保存源文件，显式请求保 UV；输出要核每个 primitive 的 UV 与几何对应，不能只比顶点数或整文件 hash。合法的重排也会改 hash，统计相同也可能换 UV。[经验]
- 旧材质槽／交互部件／skin 必须复用：另核材质分配、对象局部变换和所需绑定，不能以“保 UV”代替；不满足就保留原资产、改其材质参数，或改用满足结构契约的既有资源。[经验]
- 接受新 UV 的独立静态候选：把重新烘焙、旧 mask 迁移和引用适配算进成本；不把程序员手绘修补变成默认补救。[经验]

[研究：范围] 新增证据为两家服务的公开契约及另一作者四个固定源文件的调用链；未调用服务、下载权重、运行生成器／Blender／引擎，未取得成对重贴图前后产物。本节不声称任何服务实际保留通过或质量胜出，也不改变原有许可准入和模型首试排序。


### 输出兼容：先核消费者再压缩

2026-10-15（UTC+8）全文就绪审阅发现，既有 §9.1 的“压缩扩展需目标导入器支持”未进入正文。此次同步该采用门槛，不重新执行模型、优化器或引擎。

- [固定 gltfpack README](https://github.com/zeux/meshoptimizer/blob/b2330430776a95a1545f03fc7bf16927f8cadc59/gltf/README.md)说明默认量化及可选压缩／纹理／实例路径引入不同扩展。几何预算、节点名称或 extras 保留通过，不能推出目标消费者支持全部必需扩展。[一手]
- [Unity 官方 glTFast 功能页](https://github.com/Unity-Technologies/com.unity.cloud.gltfast/blob/main/Packages/com.unity.cloud.gltfast/Documentation~/features.md)把 meshopt 解压列为附加包能力。这里只说明先核已具备的解码支持，不代读者安装依赖，也不承诺任一旧版本具备支持。[一手／研究]
- [Epic glTF 支持文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/gltf-file-format-support-in-unreal-engine)说明不支持必需扩展时不能加载；其中导出扩展表不能反推导入支持。未取得具体项目导入器能力时，保持原文件并关闭未确认的优化或采用已有支持的路径，不新造未经验证的跨引擎兼容矩阵。[一手／研究]

建议只约束采用前提：这不是各引擎当前完整支持清单，也不是实际加载测试；最终文件仍须经过目标项目的导入和二改验收。


## 13. 程序化二改：复用已有配方，还是补新形状与规则

核实：2026-10-16（UTC+8）。**改变的选择：** 保留同包资产与已有程序配方优先，但把支持范围内的参数修改，与新增模块／风格／连接规则分开。后者先确认合格源件和规则的供给；只能靠人工美术补齐时，换完整资源体系或缩需求，不默认自建通用生成器。[研究／经验]

### 13.1 优秀成品的风格扩展仍有制作成本

[一手：作者发布记录] Tiny Glade 的 [Wood, Flowers, Workshop & more](https://steamcommunity.com/games/2198150/announcements/detail/692021394394841188)于 2026-09-23 发布。木墙经过多轮处理木板开窗、木／砖窗框位置、石基高度和音效组合；木墙完成后又增加木楼梯，避免旧砖楼梯与新风格不协调。另一方面，已实现的风格可由 style clone 工具在建筑、墙、楼梯、栅栏和窗之间复用。Workshop 支持新增 clutter 与资产替换，但该版明确不能新增绘制工具或金属墙。

本轮直接读取官方 HTML 内的 `data-partnereventstore`：event `692021394394841187`，announcement `692021394394841188`；`rtime32_start_time=1790162220` 对应 2026-09-23 11:17 UTC，`posttime=1790162268`。网页正文提取器只返回图片时，以这份官方完整公告数据核实，不把聚合站摘要当一手。[一手／研究]

[研究] 该例支持“已有风格内复用”和“扩展风格家族”分别估算，不证明所有生成器都难扩展，也不提供单人节省工时的数字。作者在 [2024 访谈](https://80.lv/articles/exclusive-tiny-glade-developers-discuss-bevy-proceduralism-publishers-cozy-games)说明规则由两人逐条设计，Opara 已有近十年程序美术经验；漂亮的程序输出不等于无需前置美术与规则制作。这里只借机制，不提取游戏资产，也不将购买游戏或 Workshop 支持当作资产商用许可。[一手／研究]

### 13.2 独立实现：模块由谁提供，规则改后重建什么

Marian Kleineberg 的 [2019 作者复盘](https://marian42.de/article/wfc/)说明其 WFC 城市约 100 个块由自己在 Blender 制作；连接号及方向条件用于推导邻接，另加排除规则避免几何可接但视觉不好看的组合。它证明的是用既有模块生成布局，并非自动制作新模块。[一手]

固定源码 `8750c537e6c8f95806ba709e2ae5d940fd51bff3`，本轮逐文件读取，未执行：
- [ModulePrototype.cs](https://github.com/marian42/wavefunctioncollapse/blob/8750c537e6c8f95806ba709e2ae5d940fd51bff3/Assets/Code/WaveFunctionCollapse/ModulePrototype.cs)：`GetMesh` 取既有 `MeshFilter.sharedMesh`，缺失时可返回空 mesh；六面分别保存连接、可通行与排除邻居等信息。
- [ModuleData.cs](https://github.com/marian42/wavefunctioncollapse/blob/8750c537e6c8f95806ba709e2ae5d940fd51bff3/Assets/Code/WaveFunctionCollapse/ModuleData.cs)：`CreateModules` 从原型产生旋转变体，再按 `Fits`、双向排除及可通行条件重建邻接表。
- [Module.cs](https://github.com/marian42/wavefunctioncollapse/blob/8750c537e6c8f95806ba709e2ae5d940fd51bff3/Assets/Code/WaveFunctionCollapse/Module.cs)：`Fits` 比较连接号、对称／翻转与旋转条件，不检验真实几何接缝。[一手]

[研究] 因而在这个实现中，新轮廓先要有源网格；改连接标签后还要重建规则数据。标签匹配不能代替网格接缝与通行验收。这是可借的机制，不是推荐读者直接采用整个旧 Unity 项目，也不把其行为外推到所有程序生成器。

**许可分别读实际范围。** Marian 项目的固定 [LICENSE](https://github.com/marian42/wavefunctioncollapse/blob/8750c537e6c8f95806ba709e2ae5d940fd51bff3/LICENSE)为 MIT；本节只引用机制，不作附带资产包的完整清权结论，缺少单独资产许可文件也不能反推根许可不覆盖资产。另一作者 mxgmn 的 [固定 LICENSE](https://github.com/mxgmn/WaveFunctionCollapse/blob/de7d22e705e816b62b4d613199d0463820fcaef3/LICENSE)则明确将提供的样例图与 tiles 排除在软件之外；这是不能仅凭生成器 MIT 标签放行样例资源的具体反例，不套用到 Marian 项目。[一手／研究]

**二改仅预注册：** 同一候选先改已支持的尺寸／布局，再要求一个当前未覆盖的屋顶轮廓或墙体风格；事先列出实际所需源件、许可及新增／受影响连接规则。记录哪些已有配方可完成、哪些必须补网格，之后再验新旧组合接缝与通行。缺少合格源件而必须手工建模时撤回该扩展路线；不能只改颜色或 seed 就算跨形状／风格通过。[经验]

范围：本轮核官方公告、作者复盘、固定源码与许可，没有运行生成器／引擎或取得两轮新产物，未验证零手修成功率；已有程序配方在支持范围内的复用价值保留。[研究]
