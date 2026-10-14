主线：二／三／四；G1 3D资产选型、第二次修改与交付
改变的建议：先用许可清晰的同风格资产／参数化组件；自定义道具分原生低模与高密度源资产，场景与变形角色不共享成功标准
新证据：2026-10-13读取2026年7–10月原生网格论文、当前商业API、固定源码及作者产物记录；没有运行模型、引擎或安装软件

# WP3：3D资产路线、原生低模与第二次修改

核实时间：2026-10-14（UTC+8）。正文见[3D资产专题](../../domains/game-dev/assets/3d.md)。以下“首试”是理论选型优先级，不是已测质量冠军。来源标签：[一手]官方文本/源码；[研究]论文或作者测量（须再分）；[经验]本报告决策。

## 1. 采用判断与分档依据

**✅ 采用：先按玩法把对象拆成静态刚体、模块场景、变形角色，再选资源来源。** 同风格授权现成包可满足时不重新生成；重复尺寸、模块接缝、门窗和可动零件优先参数化，新增外观才用生成。静态道具把原生低模生成列为首试，而非默认百万面生成后强减面；高细节源资产保留在确实需要近景轮廓/烘焙细节的分支。变形角色优先现成骨架/拓扑与服装体系；自动绑定成功和quad输出都不是关节变形通过。场景优先模块拼装，生成世界仅作受限背景候选。**局限：本轮未建立零手修、第二次修改后的真实引擎通过率，不能承诺完整无人美术发售管线。** [经验；依据见下]

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
- **TaoFlowForge（2026-09-29论文，9月30代码发布）**：原生顶点+连通性三阶段；公开推理CLI、阶段恢复、raw与补洞后网格都有，读源码可区分生成错误与后处理错误；不是只有官网旋转视频。[一手：[固定README](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/README.md)、[pipeline](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/taoflowforge/pipeline.py)] 但权重许可未核清，不列商用本地推荐。[研究]

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

[既有资产编辑边界研究](2026-10-13-game-asset-editing-boundary.md)已核corosolto/client：生成碎片、UV脚本、运行时锁骨映射错误分层；有运行时引用，且作者冻结22/63缺陷债务。沿用其精确SHA与直接来源，不把它重新包装成WP3零手修通过案例。它反驳“所有问题继续重生成即可”，也反驳“自动rig后就能发售”。[研究：既有证据复用]

### 3.3 成熟基线也须限定

- [Kenney Nature Kit](https://kenney.nl/assets/nature-kit)：330 files、CC0，适合统一简化自然物体族；资产包页面不证明任何目标设备性能。[一手] 使用同包、程序改材质色/尺寸/布局，避免模型逐件抽样。[经验]
- [Quaternius Universal Base Characters](https://quaternius.com/packs/universalbasecharacters.html)：6种人体基型、20头发、Humanoid rig，作者称平均13k triangles；Standard约60–70%免费，Source/引擎整合为不同交付档，不能写免费含全部源工程。页面CC0商业可用。[一手] 参数/服装兼容体系比反复重生网格更适合第二次修改。[经验]
- [Poly Haven许可](https://polyhaven.com/license)资产CC0；高分辨率写实模型仍可能超过游戏预算。2026-07-18[API页](https://polyhaven.com/our-api)已明确含商用免费并要求面向用户标示来源，不能沿用旧收费API说明，也不能把网站文字/商标一并当CC0。[一手]
- 有第三方作者[采用登记](https://github.com/Seyamalam/blood-league-kickoff/blob/main/docs/ASSET_CREDITS.md)把Quaternius基型与glTF→GLB规范化用于游戏仓库；此处仅作线索，未固定该仓库SHA、运行游戏或核发售，**正文推荐不以此作已验证游戏交付证明**。[一手：作者登记；研究：证据不足]

## 4. 场景：应保留对象边界，而非只追全景漂亮

**✅ 默认同套模块资产+规则布局。** 房间、道路、墙厚、门宽、交互物件/碰撞必须由玩法规格决定。AI可生成布局数据/装配代码，程序员可用现有模块与基本体，不需重造世界生成框架。[经验]

**👀 Infinigen（a0d1a0dd，2026-10-08）**是有源码的程序化基线，适合借参数配方，不是AI生成模型；主许可BSD-3-Clause，含明确标注的CC0程序代码。[一手：[固定README](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/README.md)、[LICENSE](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/LICENSE)] 本轮不以科研合成世界demo证明实时游戏资产预算；优先复用一类已有参数化资产而非整套场景系统。[经验]

固定[导出说明](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/docs/source/ExportingToExternalFileFormats.md)给出更强反证：程序材质需烘焙且有损；文档正式支持全场景USDC；固定实现对usda/usdc均走USD分支，非USD路径才显式实体化实例并可能显著膨胀；动画导出未正式支持，透明材质可能不正确。不要将作者关于格式能力的泛化解释推广为所有格式都不支持实例，只采用该导出器的明确限制。对应[源码](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/src/infinigen/tools/export.py)的`export_curr_scene`／`export_single_obj`在非USD路径调用`realizeInstances`（约1135–1189行）；不以文件内未调用的辅助函数充当实际执行路径。[一手：文档+固定源码]


**👀 Marble**能生成/编辑/扩展世界，支持Gaussian splat、低精度collider与高质量mesh；当前[导出说明](https://docs.worldlabs.ai/marble/export/gaussian-splat)Standard可导splat/collider，Pro才含高质量GLB和商业权利。未核完整条款，因此只调查，不正式推荐商用。[一手；研究]

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
- 角色换衣/改变比例：优先同体系服装/骨架；重新生成后的skin、挂点、morph与动画适配需重新验收，seed不能保存这些契约。[经验]
- 重新生成失败：定位生成、后处理、导入/运行时，再决定重试；持续要人工刷权重或修面才能达标，按本基准失败，缩为静态/刚体角色或换资产。[经验；既有corosolto证据]

成本记“获得一个被采用且经历第二次修改的资产”所有淘汰、贴图、remesh、导出、主动工时，不记一次成功API费。当前[Meshy定价](https://docs.meshy.ai/en/api/pricing)：T2灰模5、2K/4K贴图总15，7.1灰模20/纹理总30，remesh另5；均是单次API credits，不是美元，也不覆盖订阅/图片输入生成/失败重试。[一手] Rodin营销页与API计费表口径不一致，首试前以实际方案报价确认，不横向编造净成本排名。[研究]

## 7. 精确许可范围与采用门槛

1. Kenney Nature Kit：资产CC0；包无生成模型权重；保具体包许可而不是沿用Generic Items结论。[一手]
2. Quaternius Universal Base Characters：资产CC0且明确商用；免费/Source的内容获取范围不同；第三方动画另核。[一手]
3. Poly Haven模型：CC0，不包含网站文案/商标；API商用免费为2026-07新政策，建在其API上的产品需标示来源。[一手]
4. meshoptimizer b233043、xatlas f700c7、CoACD131010：主代码MIT，无权重；输出依输入资产权利，不自动清除输入许可。[一手；研究]
5. Infinigen a0d1a0：主BSD3+标注CC0代码；目前只研究借鉴，不以主许可包办外部包/所有素材。[一手；研究]
6. LATO.2 fbb1f5a5755e6db8700cf6922fd506830b7cdccd：主MIT；HF `0x4c48/LATO.2@a91090e8077b9318ab87ac08fd9eb905903d4515`卡MIT，七个pt；[setup.sh](https://github.com/LoHhhha/LATO.2/blob/fbb1f5a5755e6db8700cf6922fd506830b7cdccd/setup.sh)固定nvdiffrast v0.4.0并称o_voxel导入必需，同一[nvdiffrast v0.4.0许可§3.3](https://github.com/NVlabs/nvdiffrast/blob/v0.4.0/LICENSE.txt)限制普通使用者为非商业研究／评估；**不能忽略该商业生产依赖门槛**。首轮商用默认暂缓。[一手；研究]
7. TaoFlowForge/Taobao3D f236914：根Apache2；checkpoint指ModelScope但权重页面未成功读到许可，且DINOv3可能嵌入/外载需另核。仅研究。[一手；研究]
8. Meshy 7.1/T2、Tripo P1/P2、Rodin Gen2.5沿WP1对应服务权利；**Tripo本地SG≠付费Tripo服务许可**，SG默认自动下载BRIA RMBG1.4未清商用，不引入为“MIT全套”。[一手：[TripoSG固定README](https://github.com/VAST-AI-Research/TripoSG/blob/fc5c40990181e2a756c4e0b1c2f4d6b5202faf8c/README.md)；研究]
9. Marble Pro：当前功能页说含商业权利，但完整合同本轮未查清，完整条款待核，不列正式商用首试。[研究]

## 8. 新证据与停止点

已做：读取锚点/任务书2、4、5及WP1/既有边界；多源检索当前商业版本；GitHub API解析固定提交/目录；下载小型README/源码/许可到本地研究目录；读论文全文相关方法和限制。没有下载权重、安装、调用付费生成或Unity/Unreal实测；本轮仅据调查编辑专题与研究记录。[研究]

足以改变建议的新增证据：原生低模商业入口与退役旧参数；同样“成功”的朝向错误；低模作者产物与费用记录的证据限制；LATO.2依赖重现许可阻塞；TaoFlowForge真实开源推理但权重授权不明；最新UV论文仍明确人工精修范围；碰撞、UV、LOD可直接借成熟库而非自建。[研究]

后续只需窄实验（待用户授权，当前不执行）：同一个带孔刚体需求，用同风格现成/参数化基线、T2、7.1或Rodin各一条；保所有淘汰件并做一次“改尺寸且保挂点/颜色”的修改。角色实验另立样本，不能与刚体合算。授权不满足的路线先排除。停止条件是目标视距轮廓/材质/碰撞通过且第二次修改成功，或确认需手修而撤回；不扩成新的管线框架。[经验]

本轮文档检查：`python3 scripts/check_repo.py`通过；`python3 scripts/check_offline.py`完整14阶段通过，测试套件非空且无skip；`git diff --check`通过。这些检查不验证外链内容、模型效果、Unity／Unreal或发行质量。[研究：本仓库离线运行]

交付核对：完整离线14阶段、受影响页70处标题引用与 `git diff --check` 通过；内部独立复核无阻塞，已按固定源码区分Infinigen文档支持USDC与实现的usda/usdc分支。没有模型/引擎新运行；hosted CI按发布提交另核。
