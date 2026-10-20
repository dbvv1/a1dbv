主线：二／三／四；G1 3D 选型、第二次修改与交付
改变的建议：[经验] 同风格现成资产／已有配方覆盖的参数化资产优先；自定义刚体新需求首试T2.5原生低模、旧合格T2配方不迁移，场景和变形角色另判；处理器先核目标导入器与实际接口，凸分解的顶点／包数参数不能直接当引擎交付保证；旧精灵母版转实时先重验源，不默认只需批转；植被先选同风格且风动源兼容的资源族，区分调风与重做枝条数据；角色扩装先选配套着装身体／头部，跨体型另验源关系
新证据：[一手／研究] 2026 年论文、商业 API、固定处理源码与作者产物；追加门 GLB、关节导出、重贴图及程序化范围证据；凸分解另核主分支／Unity 包差异、合并退出与原生引擎契约，未运行模型／引擎；2026-10-20补T2.5默认／预算与Tripo入口差异；2026-10-19补Naev旧源补做、转换脚本边界及正式发行；2026-10-20补Unity 6.3／UE 5.8风动契约、TreeIt导出限制及Firewatch／Fortnite历史制作反例

# WP3：3D资产路线、原生低模与第二次修改

核实时间：2026-10-14（UTC+8）；2026-10-16（UTC+8）补核凸分解接口／预算（§5）、TaoFlowForge 许可与装载链（§10.2）、程序化形状／风格范围（§13）。2026-10-20（UTC+8）补核T2.5、Tripo入口及窗口扫描（§2.1、§10）。正文见[3D资产专题](../../domains/game-dev/assets/3d.md)。以下“首试”是理论选型优先级，不是已测质量冠军。来源标签：[一手]官方文本/源码；[研究]论文或作者测量（须再分）；[经验]本报告决策。

## 当前最高水平卡：资源族的编辑母版与优化交付

沿用质量审计[最高水平卡A02](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#a02--3d)，以下补充已在进行的局部二改验证，不重复其生成质量调查。前沿比较状态：**仅候选，差距2**；未做领先生成与现成／程序化的同题视觉比较。

核实：2026-10-21（UTC+8）。本卡只判断同一带骨骼资源族连续改色／改动作的保留能力，不重排生成模型的美术质量榜。[研究]

| 层次 | 做法、出处与本仓判断 |
|---|---|
| 近期前沿候选 | Andrii Yaroshevych等（MacPaw，2026 ECCV OpenSUN3D）[GenRA](https://research.macpaw.com/publications/genra/GenRA__End_to_end_Framework_for_LLM_Driven_Animation_of_Rigged_3D_Models__ECCV_OpenSUN3D.pdf)在原USD资产上修改动作，保几何、蒙皮和骨架；Jakob Buhmann等（Disney Research，2026-07-16）[Generative Motion Rig](https://studios.disneyresearch.com/2026/07/16/a-generative-motion-rig-for-artist-driven-motion-authoring/)让艺术家操控姿态／时间窗口等。前者不证明glTF资源族全链，后者不是零人工美术案例；完整两改、零手修、引擎交付的最高水平未知。[作者报告／研究] |
| 工程参照与主流 | Mike Festa的[Khronos Guidelines 2.0介绍，2025-08-07](https://www.khronos.org/blog/introducing-asset-creation-guidelines-2.0-siggraph-2025)区分OpenUSD创作／交换与glTF传输；这给出职责划分，不证明所有工程必须使用USD，也没有多数采用率证据。[一手／研究] |
| 可行路线 | 已认可的源图＋成员修改配方，派生后再优化；若只有优化产物，显式复制将修改的共享数据再编辑。glTF-Transform与Validator负责读写／结构检查，不替代原DCC源或目标引擎。[研究] |
| 本仓推荐层次 | **限定样本支持的可行推荐。** 名称保留不等于可独立改；默认保源与配方，受限编辑可用完整引用路径的按需复制。下方两条正确实现均通过，未证明重建在质量、工时或成功率上普遍胜出；生成模型、视觉与玩家质量仍未知。[本仓运行／研究] |

## 1. 采用判断与分档依据

**✅ 采用：先按玩法把对象拆成静态刚体、模块场景、变形角色，再选资源来源。** 同风格授权现成包可满足时不重新生成；重复尺寸、模块接缝、门窗和可动零件优先复用已有配方；新增形状／风格先核源模块与规则是否覆盖（§13），不能把补配方算成调参数。静态道具把原生低模生成列为首试，而非默认百万面生成后强减面；高细节源资产保留在确实需要近景轮廓/烘焙细节的分支。变形角色优先现成骨架/拓扑与服装体系；自动绑定成功和quad输出都不是关节变形通过。场景优先模块拼装，生成世界仅作受限背景候选。**局限：本轮未建立零手修、第二次修改后的真实引擎通过率，不能承诺完整无人美术发售管线。** [经验；依据见下]

### 三类资源、三档首试

|用途|质量优先|性价比优先|本地/免费|
|---|---|---|---|
|静态刚体道具|✅ 采用与画风一致的成熟完整资产；缺少独特近景物件时🧪先试Meshy 7.1，Rodin Gen-2.5作为高细节/多图对照。二者无独立同题盲测，不排序为绝对最佳|✅ 同包复用；确需新形状时🧪Meshy T2.5原生低模，显式预算、先灰模；旧合格T2配方保留；Tripo P1作替代，API P2 Preview仅对照|✅ Kenney Nature Kit/简单参数化几何。写实可👀Poly Haven单资产，仍核预算；不强凑“免费本地生成冠军”|
|场景|✅ 同套模块/材质拼装，近景标志物单独补生成；👀Marble Pro只用于交互弱、可接受烘焙观感的环境候选|✅ Kenney/Quaternius同包模块+脚本布局，不把整个关卡作为一个mesh重生|✅ 同包现成模块/引擎基本体；👀Infinigen只借资产/程序配方，不默认整套世界生成输出直接进游戏|
|变形角色|✅ 同一现成角色生态、已知拓扑/骨架的完整资产；👀自定义生成仅当玩法允许退回刚体分件或替换角色|✅ Quaternius配套头部＋着装分件，固定身体覆盖／动作版本；不保证任意裸身体跨体型穿衣（§15）|✅ 指定CC0角色包的免费可下载部分；⛔不把TRELLIS/LATO.2默认安装或Hunyuan作为全球商用无条件路径|

零人工修拓扑、UV 和权重是准入条件；质量优先还要比较目标相机下的轮廓、细节与风格，以及追加处理和二改代价，不构成现成／生成的审美排名。[经验] 当前服务费不能跨品牌直接比较credit；尚无保留所有淘汰样本与主动工时的可比成本。[研究]

## 2. 最近几个月发生了什么，改变了哪个旧方案

### 2.1 原生低模已经是可调用路线，不只是“减面新包装”

**新刚体需求先试原生低模，旧合格配方不因默认版本改变而迁移。** 型号、默认值、面数范围和退役日统一查[§10动态表](#10-动态事实表限定补核)，这里保留改变选择的机制。[经验]

- **Meshy Smart Topology**：忽略remesh开关，目标不是硬上限；同预算验孔洞／挂点，不以“更锐利”宣传或追加面数算升级成功。高细节7.1的`geometry_resolution=4k`是几何采样，不是贴图4K；多图不支持该选项。同seed+latest也不是重复生成契约。[一手／经验；来源见§10 Meshy行]
- **Tripo P系列**：几何与纹理分开选，不能由Studio发布或quad输出推成API稳定性／角色变形通过。自动化保稳定P1候选；两阶段请求字段与灰模开关见[Tripo补核](#tripo-版本选择补核2026-10-15-utc8)。[一手／经验；版本与来源见§10 Tripo行]
- **LATO.2（2026-07-12论文，代码8月）**：分顶点与连通性，可调整顶点后重建拓扑；作者明确几何错不能靠连通性阶段补救，尚缺UV/纹理/材质。[研究：[论文限制](https://arxiv.org/html/2607.10623v1)] 不支持“新拓扑模型已经解决完整游戏角色”。[经验]
- **TaoFlowForge（2026-09-29论文，9月30代码发布）**：原生顶点+连通性三阶段；公开推理CLI、阶段恢复、raw与补洞后网格都有，读源码可区分生成错误与后处理错误；不是只有官网旋转视频。[一手：[固定README](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/README.md)、[pipeline](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/taoflowforge/pipeline.py)] 商用准入另查[§10.2装载与许可链](#102-taoflowforge补得权重声明仍核实际-dino-适用链)。[研究]

**替代关系**：简单刚体道具，原生低模值得替代“先密网格再不计损失地强制减到预算”；不是取消密网格，近景雕塑/复杂表面仍可生成高密度源，再用成熟LOD/烘焙。若原生低模无法保持重要孔洞、细件、接口或预算反复失守，撤回到同风格现成资产/参数化建模；不能把试验失败转嫁为程序员手工雕刻。[经验]

### 2.2 商业接口细节是实质反证

**保存实际版本、产物和检查结果，不能用API成功代替引擎资产验收。** 以下反例说明哪些参数会改变交付含义；费用与资格见[§10](#10-动态事实表限定补核)。[经验]

Rodin Gen-2.5默认`Raw+medium`目标500,000面；`Quad+medium`18,000四边面，导入前不能把两种face数直接比较。[一手；API见下]

`tier`遗漏会退回Gen-1/1.5；所谓faithful模式明确实验性、不建议生产；输入alpha保留只影响预处理，不能推成输出玻璃/镂空材质正确。[一手：[API](https://docs.hyper3d.ai/en/api-specification/rodin-gen2-5)]

Meshy7.1不输出emission，`remove_lighting`接受却忽略；T2不接受该参数。[一手；Meshy Image API见§10]

Tripo灰模须按[两阶段契约](#tripo-版本选择补核2026-10-15-utc8)同时核纹理与PBR开关。Tripo文档警告过早设`export_orientation`可使后处理结果朝向错误而任务仍success，建议最后convert。[一手：Tripo P系列API见§10]

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

**同包复用优先，资格与下载档查§10。** Kenney Nature Kit适合统一简化自然物体族，可程序改材质色／尺寸／布局；Quaternius Universal Base Characters提供6种人体基型、20头发和Humanoid rig，作者称平均13k triangles，参数／服装兼容体系更适合二改。两者都不是目标设备性能证明。[一手／经验；具体包来源见§10]

Poly Haven用于写实单资产，仍可能超游戏预算；[2026-07-18 API说明](https://polyhaven.com/our-api)已替代旧收费口径。资产CC0、API使用条件与网站内容权利分开查§7／§10。[一手／研究]

有第三方作者[采用登记](https://github.com/Seyamalam/blood-league-kickoff/blob/main/docs/ASSET_CREDITS.md)把Quaternius基型与glTF→GLB规范化用于游戏仓库；此处仅作线索，未固定该仓库SHA、运行游戏或核发售，**正文推荐不以此作已验证游戏交付证明**。[一手：作者登记；研究：证据不足]

## 4. 场景：应保留对象边界，而非只追全景漂亮

**✅ 默认同套模块资产+规则布局。** 房间、道路、墙厚、门宽、交互物件/碰撞必须由玩法规格决定。AI可生成布局数据/装配代码，程序员可用现有模块与基本体，不需重造世界生成框架。[经验]

**👀 Infinigen（a0d1a0dd，2026-10-08）**是有源码的程序化基线，适合借参数配方，不是AI生成模型；主许可BSD-3-Clause，含明确标注的CC0程序代码。[一手：[固定README](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/README.md)、[LICENSE](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/LICENSE)] 本轮不以科研合成世界demo证明实时游戏资产预算；优先复用一类已有参数化资产而非整套场景系统。[经验]

固定[导出说明](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/docs/source/ExportingToExternalFileFormats.md)给出更强反证：程序材质需烘焙且有损；文档正式支持全场景USDC；固定实现对usda/usdc均走USD分支，非USD路径才显式实体化实例并可能显著膨胀；动画导出未正式支持，透明材质可能不正确。不要将作者关于格式能力的泛化解释推广为所有格式都不支持实例，只采用该导出器的明确限制。对应[源码](https://github.com/princeton-vl/infinigen/blob/a0d1a0dd5644904d3cb921ff24260160ac06ae08/src/infinigen/tools/export.py)的`export_curr_scene`／`export_single_obj`在非USD路径调用`realizeInstances`（约1135–1189行）；不以文件内未调用的辅助函数充当实际执行路径。[一手：文档+固定源码]

**👀 Marble Pro仅作受限背景候选。** 它能生成／编辑／扩展世界，交付Gaussian splat、低精度collider或高质量mesh；具体导出档和商用口径冲突统一见[§10](#10-动态事实表限定补核)。[一手／研究]

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

碰撞代理优先box/sphere/capsule或少量compound，独立于可见网格。Unity 6.3 [MeshCollider](https://docs.unity3d.com/6000.3/Documentation/Manual/class-MeshCollider.html)文档限制convex 255 triangles，动态物体建议优先primitive；因此把生成mesh直接拿来convex并非自动适配。[一手] 确实需要凹结构时👀[CoACD@131010c4](https://github.com/SarahWeiii/CoACD/tree/131010c4f03fec375ea88c5c6263f120046cb7f1)，MIT，独立库与另版Unity接入的参数能力须分别核实；2026-04实单位误差、9月另有CuACD GPU研究。单人规模不因新算法百倍宣传就加CUDA部署。[一手；经验] 孔洞能否穿过、碰撞块数、角色/投射物所需精度由玩法决定，代理可故意不同于画面。[经验]

#### 凸分解预算：先核实际接口

核实：2026-10-16（UTC+8）。[研究] 改变的是有顶点／包数预算时选哪条调用路径，不撤回简单代理优先，也不另造处理框架。

- **主分支有参数，不等于默认启用。** [一手] 固定 `131010c4f03fec375ea88c5c6263f120046cb7f1` 的 [Python API L81–100](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/python/package/__init__.py#L81-L100)默认 `decimate=false`、`max_ch_vertex=256`、`max_convex_hull=-1`；[README 参数说明](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/README.md#L178-L186)同样要求 CLI 开 `--decimate` 后 `--max-ch-vertex` 才生效。[实际调用 L679–686](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/src/process.cpp#L679-L686)分别以 `merge`／`decimate` 控制合并／减面。只填最大顶点值不能启用约束，默认也没有最大包数限制。
- **包数与误差可能冲突，目标包数也非无条件保证。** [一手] 同版 [合并 L353–379](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/src/process.cpp#L353-L379)为压低包数可以越过凹度阈值；无可合并对时告警并退出。[#63 作者答复](https://github.com/SarahWeiii/CoACD/issues/63#issuecomment-2843600853)解释只合并相邻凸包、目标过少可能无对可合并。它是历史问题解释；当前固定代码已有退出检查，不把旧崩溃当当前回归。[研究] 需要同时保孔洞和限制块数时，不能只继续降低包数，须允许换简单代理或资产。
- **Unity 包缺少这组顶点控制。** [一手] README 所指 `unity` 分支本轮固定为 `9dd8431f3b2e7e4654e5a6284e3b8c36b4071c2f`（2024-09-10）。其 [Parameters 与原生调用签名 L47–95](https://github.com/SarahWeiii/CoACD/blob/9dd8431f3b2e7e4654e5a6284e3b8c36b4071c2f/Packages/info.flandre.coacd/Runtime/CoACD.cs#L47-L95)无 `decimate`／`max_ch_vertex`；[#69 协作者于 2025-06-17 的答复](https://github.com/SarahWeiii/CoACD/issues/69#issuecomment-2981661676)也说明稳定 Unity 发行版尚无该功能。[L341–359](https://github.com/SarahWeiii/CoACD/blob/9dd8431f3b2e7e4654e5a6284e3b8c36b4071c2f/Packages/info.flandre.coacd/Runtime/CoACD.cs#L341-L359)把返回网格赋给 convex MeshCollider，方法名 `ValidateColliders` 不代表已验证每包预算或 cooking。[研究] 确需该顶点控制时评估主分支离线处理，不向此 Unity 包照搬 Python 参数；这不证明包在所有网格上不可用。
- **引擎按各自契约消费。** [一手／研究] 上述 Unity 6.3 文档写的是 triangles，CoACD 参数写的是 vertices；本轮不推导一个顶点阈值保证 cooking 通过。UE 5.8 [原生 Auto Convex API](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/StaticMeshUtilities/SetConvexDecompositionCollisions-)另有 `Hull Count`、`Max Hull Verts`、`Hull Precision` 和成功返回值，可🧪先作原生基线，但调用会移除既有碰撞，先保留原资产／碰撞。[教程](https://dev.epicgames.com/documentation/en-us/unreal-engine/add-a-collision-hull-to-a-static-mesh-using-the-auto-convex-collision-tool-in-unreal-engine)的 32／16／50,000 是示例，不是通用配置或 Chaos 硬限，不能套 Unity 上限。

[研究／经验] 在选定接口实际导出的每个凸包上分别记录顶点、三角面与总包数，再看目标引擎生成的碰撞是否保住所需孔洞／接触轮廓；压预算破坏玩法形状时撤回该配置，不以成功日志放行。本轮只读固定源码、维护者答复和官方契约，未运行处理器／引擎或验证输出，不声称质量、性能、失败率或 cooking 通过率。

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

成本记“获得一个被采用且经历第二次修改的资产”的全部淘汰、贴图、remesh、导出与主动工时；[§10](#10-动态事实表限定补核)维护各服务价目及冲突。单次API credits不覆盖订阅、输入图片生成或失败重试，不能直接当美元或横比净成本。[研究]

## 7. 精确许可范围与采用门槛

**先按§10确认具体包／服务资格，再核装载链和输入权利。** 商业套餐、输出权利、终止与追溯条件只在[动态表](#10-动态事实表限定补核)维护；以下保留表中标签不足以表达的范围证据。[研究]

- **现成包**：Kenney Nature Kit无模型权重，不能沿用Generic Items许可；Quaternius第三方动画另核；Poly Haven的CC0不包含网站文案／商标。[一手；包来源见§3.3、§10]
- **处理器**：meshoptimizer b233043、xatlas f700c7、CoACD131010主代码MIT、无权重；输出仍受输入资产权利约束。Infinigen a0d1a0的主BSD3／标注CC0代码不包办外部包和素材。[一手／研究]
- **LATO.2固定权重证据**：主MIT；HF `0x4c48/LATO.2@a91090e8077b9318ab87ac08fd9eb905903d4515`卡MIT、七个pt。代码`fbb1f5a5755e6db8700cf6922fd506830b7cdccd`的默认安装与nvdiffrast限制见§10；模型卡不能替依赖放行。[一手／研究]
- **TaoFlowForge**：权重卡与实际DINO组件须分开；固定源码、hash、三阶段装载和独立许可完整保留在[§10.2](#102-taoflowforge补得权重声明仍核实际-dino-适用链)。[研究]
- **Tripo本地SG≠付费服务许可**：SG默认自动下载BRIA RMBG1.4未清商用，不引入为“MIT全套”。[一手：[TripoSG固定README](https://github.com/VAST-AI-Research/TripoSG/blob/fc5c40990181e2a756c4e0b1c2f4d6b5202faf8c/README.md)；研究] Meshy／Tripo／Rodin服务权利与WP1交叉核查，不用本地代码许可替代服务合同。

## 8. 新证据与停止点

[研究] 已读一手商业契约、固定源码／许可及论文方法和限制；固定提交／目录已核，未安装、下载权重、付费生成或运行引擎。

足以改变建议的新增证据：原生低模商业入口与退役旧参数；同样“成功”的朝向错误；低模作者产物与费用记录的证据限制；LATO.2依赖重现许可阻塞；TaoFlowForge 真实开源推理，权重仓许可声明已补核但 DINO 适用链仍缺；最新UV论文仍明确人工精修范围；碰撞、UV、LOD可直接借成熟库而非自建。[研究]

后续只需窄实验（待用户授权，当前不执行）：同一个带孔刚体需求，用同风格现成/参数化基线、T2.5（旧T2配方作回退）、7.1或Rodin各一条；保所有淘汰件并做一次“改尺寸且保挂点/颜色”的修改。角色实验另立样本，不能与刚体合算。授权不满足的路线先排除。停止条件是目标视距轮廓/材质/碰撞通过且第二次修改成功，或确认需手修而撤回；不扩成新的管线框架。[经验]

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

**授权反证**：§10的Meshy标识条款与gltfpack默认丢数据机制存在冲突风险。批处理前须识别实际资产携带的标识并验证保留；不清楚其存储形式时不要无条件运行会丢弃未知数据的优化。这里只能推出风险和检查要求，**没有检查实际 Meshy GLB，不能声称某次输出必定含标识或某次转换已经违约**。[一手条款＋源码／研究推导]

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

**接入前先查本表的型号、预算和资格，再按§2／§7核能力及依赖；只替换需要改变的层。** Tripo两阶段字段和TaoFlowForge许可链在本节下方展开，二改案例保留在§11以后。[研究]

未单列日期的核实日为 **2026-10-14**；常规下次复核为 **采用前或2026-11-14，以较早者为准**，提前退役节点优先。这里是复核条件，不是定时任务。[研究]

缺失字段按表内结论降级，不视为已获授权；本轮未完成全依赖树审计。[研究]

| 对象／字段 | 当前事实与来源 | 本轮状态／采用结论 | 下次复核 |
|---|---|---|---|
| Meshy 型号／参数 | [Image API](https://docs.meshy.ai/en/api/image-to-3d)、[changelog](https://docs.meshy.ai/en/api/changelog)：`meshy-7.1`于2026-09-18发布、为standard的latest；7弃用但仍工作。T2.5于2026-10-15进入API、为smart-topology默认，目标100–30,000／默认15,000；T2为100–15,000／默认4,000，均triangle-only且无多图；旧lowpoly于10-30退役 | [一手] 2026-10-20复核；新需求T2.5候选，旧合格T2锁版；均锁预算 | 采用前／2026-10-29 |
| Meshy API 费用 | [价格](https://docs.meshy.ai/en/api/pricing)：T2／T2.5 灰模 5、2K／4K 总 15、8K 总 20 credits；7.1 灰模 20、2K／4K 总 30、8K 总 35；Ultra 加 5，remesh 另 5 | [一手] 2026-10-20复核；同价非同质量，仅每次API credits | 采用前／2026-11-14 |
| Meshy 输出商用／标识 | [Terms](https://www.meshy.ai/terms-of-use)更新 2026-09-19：§3.2 免费 CC BY 4.0，付费在法律允许范围归客户；§3.3 公开 Customer Output 为 CC0，其余 Community 内容 CC BY-NC；§2.4 禁删 AI 标识 | [一手] 直接复核；输入权利、生成时套餐与元数据一起验，不能只核模型 | 采用前／2026-11-14 |
| Tripo 型号／规格 | [P 系列](https://developers.tripo3d.ai/en/docs/generation-text-to-model/p)：P1-20260311；生产域v3 API的P2-20260801仍Preview、最多50,000三角面／25,000四边面，quad仅P2；[Studio九月更新](https://www.tripo3d.ai/zh/blog/tripo-september-update)宣布P2.0 Official及局部Mesh Edit，不改变API标记；纹理版本另按下方两阶段契约选择 | [一手] 2026-10-20复核；保留P1，Studio局部编辑不证明身份无损 | 采用前／2026-11-14 |
| Tripo 价格 | [生产域 P1 页](https://developers.tripo3d.ai/en/models/p1)：文本灰模／标准／详细 30／40／50，图片或多图 40／50／60 credits；[v3 changelog](https://developers.tripo3d.ai/en/docs/changelog)：P2 灰模 100，标准／详细／极致 110／120／130；[价目](https://developers.tripo3d.ai/en/pricing) 1 credit=US$0.01 | [一手] 换正确入口后直接复核，不能用 API 示例当价格；不照旧 v2 文档的 P1 all-in 口径推算新纹理选项 | 采用前／2026-11-14 |
| Tripo 商用／终止 | [Terms §5.2、§10.4–5](https://www.tripo3d.ai/terms)：付费权利与免费不同；退订停止续费，ownership 条款按性质存续；账户输出可能删除 | [一手／研究] 有依据保留付费期间取得的所有权，先备份；未找到旧免费资产追溯变商用授权，因此该路径排除，改在明确付费条件下重新生成 | 采用前／2026-11-14 |
| Rodin 2.5 型号／价格冲突 | [端点文档](https://docs.hyper3d.ai/en/api-specification/rodin-gen2-5)基本 0.5 credits、Extreme-High tier 加 0.5、extreme-high texture 加 2.0；[API 产品页](https://hyper3d.ai/features/api)却写 Gen-2.5 从 1 credit 起；tier 必须明确 | [一手／研究] 两页均直接读取；不选择较低数字冒充当前统一报价。采用前确认实际配置报价及月付／最低订阅承诺，不据此算最低单件美元价或自动下单配置 | 采用前／2026-11-14 |
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

**2026-10-20窗口扫描（2026-08-20至10-20）**：质量优先仍保现成完整资产，场景／变形角色不换档；[Rodin九月Agentic](https://docs.hyper3d.ai/en/api-specification/rodin-agentic)明确Beta、自动选模式有不确定性，不能替代固定配置的质量／二改证据。GitHub API复核TRELLIS.2、LATO.2、Hunyuan3D-2.1与Taobao3D的HEAD均仍为表中SHA，既有许可门槛不因近期包装改变。[一手／研究]

新增本地覆盖：[Pixal3D 9月1日多视图代码](https://github.com/TencentARC/Pixal3D/blob/f7cf38429b0bd264f1995f0f8743a88b1c728b94/README.md)需相机参数与对应视图，并明确先按TRELLIS.2安装；根MIT不替受限依赖放行。本地免费默认不换；未测依赖替代、生成或引擎，许可只覆盖已读条款，不替特定项目清权。[一手／研究]

窄处理候选：[Tripo Smart UV](https://developers.tripo3d.ai/en/docs/mesh-uv)与[十月更新](https://developers.tripo3d.ai/en/docs/changelog)承诺重展后重映射现有纹理／rig／动画，[正式价目](https://developers.tripo3d.ai/en/pricing)为20 credits、上限80,000等效三角面。仅在确需重展且愿重验身份时试用；旧UV／像素mask仍要复用则不选，接口承诺不等于实测无损。Retopology v3.0可附带smart_uv，默认仍v2.0，旧版传该参数报错；不替换现有bpy／gltfpack默认。[一手／经验]

### 10.1 剩余条件的安全降级

**未知价格或权利不靠较低报价、套餐升级或根许可补齐。** 表内已给Rodin报价冲突、Marble套餐张力、Tripo旧免费输出及本地依赖的逐项降级；采用时直接查对应行，不另维护一套结论。[研究]

实际账户与运行缺口仍在：未登录核订单、地域可用性、生成记录和结算税费；未下载权重、测试替代依赖或测生产成本。结论只覆盖已列精确版本和用途，升级／第三方托管／新增依赖要重核。[研究]

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

[研究：变化与范围] 这修复正文只选 P1 而未定义纹理的采用缺口；不改 API P2 Preview 的候选地位，不将新版纹理宣传当同题质量胜出。没有调用生成／重贴图 API、下载模型或运行引擎。


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

## 14. 旧精灵母版转实时：先重验源，再谈批量复用

核实：2026-10-19（UTC+8）；主线二／三／四，GA／GB。改变3D现成源选择：旧工程能生成合格精灵，不等于它已能承担实时光照、倾斜、部件运动和多个展示窗口。这里补源资产再验收及实际发布链，不重复WP2预渲染与实时表示的一般比较。[研究]

**同作品旧供给与新要求。** Naev旧源仓[固定README](https://github.com/naev/naev-artwork/blob/07cb65e50ad0fe907f58195b0a0484b7276c6a7e/README.md)记录Blender舰船经脚本产精灵、再缩放与配置挂点。[2024-07-21作者说明](https://naev.org/blarg/2024-07-21_sporadic_naev_newsletter_vol_4/)追溯OBJ后改glTF/PBR，希望实现系统星光、转向倾斜、Zebra旋转部件，以及船厂／通讯／游戏共用模型；不是把玩法改成3D。作者同时明确旧模型补纹理、引擎光、坏几何与动画，部分近乎重做；精灵路径仍支持，闪灯等当时还未实现。改善外观是作者判断，未给同题工时或玩家对照。[一手／研究]

**程序能做什么，不能偷换什么。** 同固定旧源的[export2gltf.sh](https://github.com/naev/naev-artwork/blob/07cb65e50ad0fe907f58195b0a0484b7276c6a7e/3D/export2gltf.sh)先用Blender 2.7转材质，再调用新版导出；[export2gltf.py](https://github.com/naev/naev-artwork/blob/07cb65e50ad0fe907f58195b0a0484b7276c6a7e/3D/export2gltf.py)删除非mesh、按旧Collection约定合并body／engine，处理重复与退化／内部面、重算法线，再导出优化。它改变结构，不能当保绑定／动画的无损转换，也不能由脚本存在推出作者的修纹理、补几何都已自动化。[一手：源码阅读] 未确认具体船从此脚本到发行产物的逐步对应，不建议照抄运行；本仓已有bpy／gltfpack选型与身份保留条件继续适用。[研究]

**确已发行，但仍有跨阶段责任。** [0.12.0正式公告](https://naev.org/blarg/2024-12-23_0.12.0/)（2024-12-23）确认近乎全部舰船3D、星光、倾斜及简单动画，船厂可旋转；同版本还列低内存纹理模式、碰撞与渲染解耦、AMD/MESA黑暗或不可见舰船的绕过修复。它们说明不能只验导出文件；未证明这些工作全由迁移单因造成，也不把作者内存／加载改进宣称为本仓测量。[一手／研究]

**许可与产物不混用。** 发行源码`84cba925878c7e85ca85eabaf89bc89c21053594`固定artwork子模块`13b428da64ac27a53da3c9f5c36eaff41e88b98c`，指向production而非上述旧源。其[ARTWORK_LICENSE.yaml](https://github.com/naev/naev-artwork-production/blob/13b428da64ac27a53da3c9f5c36eaff41e88b98c/gfx/ARTWORK_LICENSE.yaml)逐来源列许可，Viktor Hahn段将ship3d/zebra列CC-by 4.0；表中小写路径与产物目录Zebra的对应、任意旧源及其他资产仍须逐件确认。这里只提炼生产选择，不给整包已清权或直接商用背书，也不把博客许可当资产许可。[一手／研究]

**采用、目标与撤回。** [研究] 固定视角／固定光照仍满足需求时，保现成合格精灵或从合格母版重烘；确需新视点、部件运动或跨窗口同源展示，才比较已合格实时源与重新补齐旧源。目标是新表现下轮廓、材质和运动一致，而非改文件格式。转换增加依赖与验证成本，多消费面减少重复产物也扩大一次修改的回归范围。先核真实新增要求下的源，不以已有.blend或自动成功日志跳过准入；必须人工美术修补时换合法合格源、缩小新表现或撤回迁移。保持既有规格、挂点、身份、许可和设备预算检查。

缺口：未取得同一船旧源→脚本输出→人工补做→发行产物的完整对应、淘汰率及主动工时；没有下载模型／贴图或运行Blender、模型、游戏与引擎。它证明作者实际采用且付出补做责任，不闭合单人零手修的完整生产链，不由两个版本说明推定AI或工具提效。[研究]

## 15. 角色衣橱二改：先选配套着装身体，再决定是否跨体型

**✅ 需要持续换装时，先选固定版本、身体覆盖和动作已配套的组合；不把“同一骨架”解释为任意衣服适配任意身体。** Quaternius适合有限风格化衣橱；需要身体参数变化时，可另比较MPFB已有衣物的源端refit。新衣形状或跨生态人体属于新生产需求，不是换个骨名就能解决。核实2026-10-20；本轮仅公开文档与作者报告，未下载资产、安装、运行模型／引擎或验成图。[研究]

### 配套包具体承诺什么

[Fantasy服装](https://quaternius.itch.io/modular-character-outfits-fantasy)明确兼容基型**头部**。v2.0（2026-01-29）补Peasant_Male手臂，使套装只需配基型头；v2.1（07-05）修Noble／Wizard的glTF夹带其他模型、合并源文件纹理路径。默认应把它当带必要身体表面的着装分件组合，而非完整裸身外任意叠衣。作者只称减少组合穿插，未保证全部混搭。[一手／研究]

**固定一组版本，不逐包追新。** [Library 1](https://quaternius.itch.io/universal-animation-library)的v2.0统一骨名、修UE双root并改导出；v2.1修24／30fps错配；v3.0（06-16）新增Root Motion选项与移动起步修正。[Library 2](https://quaternius.itch.io/universal-animation-library-2)当前v2.2（09-28）修Sword_Light终帧／恢复对应。版本变更可改变动作时基与位移归属，不能只看动画名存在；已有合格组合不因新版出现全部替换。[一手／研究]

**免费份额不是全包清单。** [基型](https://quaternius.com/packs/universalbasecharacters.html)宣传六种人体、20发型，[服装官网](https://quaternius.com/packs/modularcharacteroutfitsfantasy.html)宣传12套／62分件，但Standard仅约60–70%，Source才含完整内容、源文件及引擎集成。服装Source公开标US$20、基型US$19.99；未购买／下载，未核免费具体可用组合，不能用全包数量排零成本制作计划。[一手：产品与下载档说明；非结算报价]

**具体包许可与品牌许可页分开。** 上述指定包页仍标CC0；2026-08-28的[QAL](https://quaternius.com/license.html)仅适用于以该许可发布的资产，允许嵌入产品、限制作为独立资产／模板再分发，且声明后续版本不追溯。没有证据说所有旧CC0资产被撤销或这些指定包全部改QAL。本轮未读取包内许可证；采用时保存实际取得版本／条款，不用品牌名给新资产或公开模板打包放行。[一手／研究]

### 同骨名不能替代身体与绑定合同

[Unity 6.3 bindposes](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Mesh-bindposes.html)按同索引关联骨骼和绑定逆矩阵。名字可帮助映射，但不证明索引、参考姿态、权重、比例或衣物形状匹配。先分“装配接错”与“资产本来不合身”：retarget改动作映射，不会凭空补出衣物适配空间。[一手／研究]

[UE 5.8模块化角色](https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-modular-characters-in-unreal-engine)中，Leader Pose要求匹配层级子集；额外／跳过骨骼会落参考姿态。Copy Pose只复制匹配骨骼，另有每组件动画求值与tick代价；Mesh Merge有初始化和内容组织成本，普通morph转移受限。它们是运行时装配选择，不是衣服拟合器。已有配套且不需独立次级动画先比较Leader Pose；确有独立行为或性能证据再升级，不先造合并框架。[一手／研究；未测成本]

### 采用与第二改暴露的缺口

[Cinevva 2026-05-10原型](https://app.cinevva.com/blog/2026-05-10-open-world-browser-part-25-universal-characters)报告四包样本骨架与bind一致，分件重绑共同实例，身体槽隐藏原身体；头发也不是简单刚体附件。自定义上传衣服仍是后续问题。其源码入口本轮仅跳转builder，未核可审代码；文章早于六月／九月动画更新，“262动作免费”等说法不覆盖当前下载档。仅作配套样本装配的作者报告，不作Unity／UE发行或零手修全组合验证。[作者报告／研究]

**买到衣服也不等于省去适配。** Second Chance的[09-21记录](https://www.secondchancegame.com/devlog/2026-09-21-empty-sleeves)报告定制服装尝试未交付进UE，回到已购Fab服装＋Blender适配；Agent将空测量误作依据，渲染才暴露袖子装配问题。作者对具体工具接口的判断只限当时测试，不外推当前产品永久无能力。[作者报告]

同作品[10-01修订](https://secondchancegame.com/devlog/2026-10-01-root-lock)仍需处理不标准体型的衣物翻面、露脚与配饰，人看图后才接收；[09-19记录](https://secondchancegame.com/devlog/2026-09-19-ground-that-isnt-there)还报告衣物与身体LOD不匹配，强制LOD0只是临时退路。因此旧报告的姿态修正不能当衣橱已经闭合。未核公开生产源码、正式发行、全部修复或独立测量，不采用“几次会话”估算本场景工时。[作者报告／研究]

### 参数化替代也要有衣物源关系

**🧪 MPFB只在已有MHCLO衣物与目标身体范围覆盖时比较。** [MHCLO](https://static.makehumancommunity.org/mpfb/docs/assets/concept_clothes_hair_bodyparts.html)除mesh外还有衣物顶点与基体的对应关系，改变身体参数后需[refit](https://static.makehumancommunity.org/mpfb/faq/clothes_do_not_fit.html)，密集mesh自动refit也会增加交互成本。这比“同骨名”多了制作期拟合依据，不等于游戏运行时自动穿任意衣服。[一手／研究]

[Export Copy](https://static.makehumancommunity.org/mpfb/docs/exporting/export_copy.html)保留原角色、另造导出副本；Bake mask会真正删除被遮住的皮肤。以后换露肤服装应回未破坏母版重出匹配产物，不能从删皮肤的旧副本恢复不存在的表面。自定义新衣仍有拓扑、分组、UV／材质工作，不把制作教程当零手修生成服务。[一手／研究]

[许可](https://static.makehumancommunity.org/about/license.html)区分MPFB代码GPL与核心资产CC0，第三方衣物仍逐项核；工具免费不代表兼容衣橱、导出适配与维护免费。保存源配方、衣物版本、refit参数和导出设置，只有最终mesh不够接续二改。[一手／研究]

**三种决定。** 同体系现成款式已满足：保匹配版本并只开放已验组合；需要受限身体参数：评估已有MHCLO源与refit；跨体系体型或全新衣形：先找完整合法配套，不默认继续自动绑定。必须手工雕衣、刷权重、补面才过关，就换身体／整套着装角色、减少槽位／体型或撤回自由换装承诺。[研究]

AI可盘点实际清单／版本、做装配与导出脚本、查缺引用和回归旧组合；瓶颈是运动穿插、身体露出、轮廓／风格、接触与设备预算。后续获准后先同身体换衣，再改体型，复查旧组合恢复、重载、动作类别和LOD转换；既有WP4接触、剔除与WP9身份检查继续保留。未建立组合通过率、净工时或AI承担百分比，不把脚本成功与数值为零当美术验收。[研究]

## 15. 植被资源族：近景、风向与密度二改

核实：2026-10-20（UTC+8）；P29，主线二／三，GA／GB。**默认采用同风格且风动源匹配目标消费者的树／灌木／草资源族；不是把静态生成树统一接风力参数。** 目标是同作品从远景改近景、指定风向及增加密度时，仍能保风格与玩法，不要求程序员手工补枝条权重。[研究]

### 15.1 现成方案先比源数据，不按功能多少排序

**Unity：能调响应不代表能补结构。** Unity 6.3 的[`.st9` Wind 页](https://docs.unity.com/en-us/engine/6000.3/manual/creating-environments/script-terrain/terrain-trees/speed-tree/class-speed-tree-importer/speed-tree-importer-wind)列强度响应、方向响应及随机性，但启用以 SpeedTree Modeler 已配置风动为前提；其他格式不能直接照搬此页。[Wind Zone 页](https://docs.unity.com/en-us/engine/6000.3/manual/creating-environments/script-terrain/terrain-trees/wind-zones/class-wind-zone)明确 Terrain 草不受它控制。树、草需分别确认消费者，不能承诺一套风场自动覆盖整包。[一手]

**需要改变枝条运动时，先保可重导出的源。** [Modeler 10 Games Wind](https://docs.unity3d.com/speedtree-modeler/manual/wind-games.html)由 Fan 和各 generator 配置风动；Wind Wizard 分析已有模型结构，不是从任意静态成品恢复结构。🧪 有合格源、授权与目标导入器时再评估此路线；缺源不把导入器参数当替代。[一手／研究]

**免费替代 TreeIt 可列候选，但不是现成通用风动格式。** [官方说明](https://www.evolved-software.com/treeit/treeit)提供 LOD 与多种网格导出，风动信息用顶点色并随 DBO／FBX 导出；不能将 OBJ 等其他格式一并算作携带风动。FBX 为 ASCII，仍核消费者。作者允许出售自己的树作品，但不代替第三方纹理清权；维护不是作者主要工作，新增适配要计入成本。本轮未找到稳定官方 RGBA 语义定义，自动通道转换停在此处。[一手／研究]

**顶点色不是跨工具协议。** Crytek 作者的 [GPU Gems 3](https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-16-vegetation-procedural-animation-and-shading-crysis)中，R／G／B／A 分别用于叶缘刚度、叶片相位、整体叶片刚度与环境遮蔽；下文 Firewatch 则用于三种运动。TreeIt 引用该技术也不证明其导出通道逐项相同，不能猜映射后宣称完成兼容。[一手／研究]

**UE 先保已合格路线，不因 Nanite 名称强制迁移。** [UE 5.8 Nanite Foliage](https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-foliage)及 Dynamic Wind 标为 Experimental；其风动需 skeleton／simulation groups、JSON 导入的 Dynamic Wind Skeletal Data 和 Instanced Skinned Mesh Transform Provider。当前仅全局风向、不含玩家或物体互动，这是该风动系统的范围，不是 UE 通用碰撞失效。Voxel shading 会覆写顶点色 alpha，旧数据若使用它须重新安排，不能默认为所有 TreeIt 输出都受此影响。[一手]

**简单摆动有独立位置，但不能冒充定向风。** [SimpleGrassWind](https://dev.epicgames.com/documentation/en-us/unreal-engine/world-position-offset-material-functions-in-unreal-engine)是非定向摆动，可调权重、强度与速度。草／低关注灌木只需轻摆时可🧪作为低复杂度候选；二改要求指定风向时，须换支持该输入的消费者并验源，不是调一个不存在的方向参数。[一手／研究]

### 15.2 实际采用说明维护代价，不证明零手修

**Firewatch 支持“小资源族反复用”，不支持“AI 已能造整片森林”。** Jane Ng 的 [GDC 2016 复盘](https://media.gdcvault.com/gdc2016/Presentations/Ng_Jane_MakingTheWorld.pdf)（PDF 第41–48页）说明定制23棵树，其中14棵广泛复用、9棵局部使用；Maya 顶点色 R／G／B 分别控制竖向摇摆、枝条拍动、叶片颤动。少量精做资源降低后续 LOD／维护负担，但这是专业美术制作。项目开始于 Unity 4.5，作者明确没有评估 SpeedTree，不能写成试用后失败，也不推出 Unity 6.3 的能力结论。[一手：作者复盘／研究]

**Fortnite 的迁移是重建数据管线，不是勾选 Nanite。** Epic [2023-01-26 的 Chapter 4 复盘](https://www.unrealengine.com/tech-blog/bringing-nanite-to-fortnite-battle-royale-in-chapter-4)针对 UE 5.1：高密树上原复杂逐顶点 WPO 代价大，改用枝条枢轴、方向及父子结构，借 Houdini Vellum 将模拟烘成纹理，再用网格自定义 UV 索引运动；枝条按刚体移动，草仍走简单数学 WPO。它证明已发行项目承担过源结构／UV／动画重做，不是当前 5.8 Dynamic Wind 的说明，更不证明任意生成树可自动恢复层级。[一手：作者报告／研究]

### 15.3 同一作品第二次修改：保留什么、重建什么

**R1 先保存一套可追溯供给，不凑互不兼容的单件。** 预注册同风格树、灌木、草各一组，远景下接受后保留源工程、实际许可、导出版本、通道说明、引擎消费者及资产 ID。资源库存在不等于该家族覆盖三类需求；源缺一类时，先比较补兼容资源与缩小环境风格。[研究／经验；未实测]

| R2 同时提出的新需求 | 可以保留 | 需要重验／重建，或撤回的条件 |
|---|---|---|
| 走近观察树冠与运动 | 合格源、稳定引用与独立碰撞 | 近景轮廓／枝叶运动不够时，从可编辑源重导出；枝条改变后重核权重、分组或纹理／UV索引。只有成品且需人工补做则换源 |
| 明确风向及响应 | 已匹配消费者的风动结构 | `.st9` 已有响应可调，但不能新增缺失枝条风动；草单独核消费者，SimpleGrassWind 非定向时换路线。通道未知不自动转换 |
| 增密，同时保可读性与通行 | 只是增加摆放数量时保资产结构 | 先重验覆盖、阴影、预算与通行；若“增密”是改树冠／分枝，须重导出并重核绑定，不能当同一摆放参数 |

**重导出不覆盖已接受的整套资源。** 保原资产作对照，先核 ID／场景引用、比例、材质与透明覆盖，再核 LOD、阴影、独立碰撞和目标设备预算；风动通过不豁免这些总入口检查。迁移要计源工程维护、格式转换、shader 适配及整套回归，不拿历史 AAA 帧率作单人项目收益。[研究／经验]

**商业门槛先于质量排序。** [SpeedTree 条款](https://unity.com/legal/professional-artistry-additional-terms)（2026-09-10，§2.3–2.7）区分 Games 与 Cinema；互动游戏用 Games，另核§2.2档位资格与 Total Finances 口径；评估资产不得导出／分发。付费附加内容可能另需覆盖；终止后的新增生产发布／平台限制按 Offering Identification 例外核，不概括成所有旧资产失效或永久无限使用。第三方兼容包仍按自己的授权与是否要使用 Modeler 判断，不一律要求买 Modeler。[一手／研究]

**AI 承担已知格式的清单、映射脚本与一致性检查；瓶颈是源结构与近景表现。** 缺失枝条层级、权重或未说明通道不能由 Agent 猜出后当成已验证。人决定是否保留近景／定向风／互动要求，或接受换源、收窄风格与玩法；没有真实两轮产物，不给承担比例或效率数字。[研究／经验]

验证范围：官方文档、条款与作者历史制作报告；没有运行 TreeIt／Modeler、模型、Unity／UE，没有下载树或纹理，也无同题零手修成功率、完整资源族成本与真实场景通过证据。若候选要求人工美术补结构，本基准下撤回；不是把失败记成程序员常规调参。[研究]

## 16. P37前置二改判据：名称与共享数据

**保名不保证下一轮只改一个成员。** 本轮固定glTF-Transform 4.5.1，将公开Fox构造成Hero、Companion、Control三成员实验族；R1只改Hero材质色，R2保R1并把Hero的Run时长改为0.8倍（即1.25倍播放速度）。这不是上游提供的成套游戏资源，也不是运行生成模型所得作品。[本仓运行]

固定输入为[Khronos Fox@15cd02d3](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/15cd02d304e54cb42a4db4eefe719f76190f4b68/Models/Fox)，GLB 162,852B，SHA256 `d97044e701822bac5a62696459b27d7b375aada5de8574ed4362edbba94771f7`。源模型由PixelMannen提供，CC0；tomkranis的绑定／动画、AsoboStudio与scurest的glTF转换均为CC-BY-4.0，不能把全包写成CC0。下载和派生分发须保[原署名与逐项许可](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/15cd02d304e54cb42a4db4eefe719f76190f4b68/Models/Fox/README.md)并注明修改；本仓只交脚本与记录，不分发模型二进制。[一手／本仓运行]

### 两条正确路线与两个负对照

实验源是从Fox独立复制三份、命名与标注成员后组合的GLB图，不是原始DCC创作文件。每份有同源骨架、贴图和Survey／Walk／Run。默认dedup将三材质／三mesh／213 accessors变为一材质／一mesh／73 accessors，三成员共享Run时间数据。[本仓运行]

| 路线 | R1只改主角颜色 | R2只缩主角Run时间 | 结论 |
|---|---|---|---|
| 优化后朴素原地改 | 三成员都变色 | 三成员Run都缩短 | 故意错误的调用者负对照，不是优化器缺陷 |
| dedup保独有名称后原地改 | 本夹具隔离正确 | 仍连带改伙伴／对照Run | 保名不能充当整个可编辑引用图隔离 |
| 优化后按需复制共享数据 | 正确 | 正确且保R1 | 先复制mesh→primitive→material，另按目标Run复制时间accessor，不能只复制mesh外壳 |
| 每轮从源＋累计配方派生再优化 | 正确 | 正确且保R1 | R2所查语义与正确复制路线相同；不据此宣布源重建必然更好 |

[固定dedup源码](https://github.com/donmccurdy/glTF-Transform/blob/41156dfa2324ac6c44ddf0a40ec0da194c4731d6/packages/functions/src/dedup.ts)对accessor去重不传`keepUniqueNames`，材质／mesh才使用该选项；[clone契约](https://github.com/donmccurdy/glTF-Transform/blob/41156dfa2324ac6c44ddf0a40ec0da194c4731d6/packages/core/src/properties/property.ts)仍保子属性引用。修改者必须跟到实际会写的数据。本轮未跑gltfpack，不能把此SDK选项结论直接套给其`-kn/-km/-ke`。[一手／本仓运行]

### 运行证据与边界

13个序列化后回读的GLB均获Validator 2.0.0-dev.3.10零error／warning，包括两条故意错误路线；结构通过与修改范围正确分开判。正确复制R2为195,816B，源重建R2为195,832B；源族503,692B，默认dedup基线195,276B。这只是去重及引用复制，不是含量化／LOD／纹理压缩的性能比较。[本仓运行]

SDK检查成员颜色、几何／UV／骨骼权重数组、joint映射、inverse bind matrices、层级与动画目标；另一个仅用Node内置模块的GLB解码器核时间键与输出、局部LINEAR／四元数slerp曲线、其他clip、材质非颜色属性与内嵌贴图。本次5,040个局部向量采样最大分量误差2.31e-6，时间键最大误差2.38e-8秒；两轮都另核非目标数据。有限采样不是完整蒙皮运动或足部接触证明；Fox每成员只有一个primitive／材质、一个基础色贴图路径，不推广到任意材质扩展、sparse／压缩accessor或CUBICSPLINE。[本仓运行]

身份缺失、歧义或跨成员目标须拒绝，不猜名称；缺输入须失败。负对照必须失败预定的隔离项，正确路线和结构检查必须满足预定结果，意外结果返回非零，不能只生成JSON后把exit0当验收。最终重跑与复核记录随脚本交付；从同一锁重装、复用缓存后，13个输出文件逐字节hash一致。[研究／本仓运行]

### 接手与仍待验证

可复跑包：[probe](../../scripts/research/p37-probe.mjs)、[selectors](../../scripts/research/p37-selectors.mjs)、[acceptance](../../scripts/research/p37-acceptance.mjs)、[verify](../../scripts/research/p37-verify.mjs)、[failures](../../scripts/research/p37-failures.mjs)，以及[package](../../scripts/research/p37-package.json)／[lock](../../scripts/research/p37-package-lock.json)和[固定输入、脚本hash、结果及失败记录](../../scripts/research/p37-asset-family-result.json)。五个mjs与两个package文件复制到隔离目录后去掉`p37-`前缀，按原模块相对路径运行；[compact-results.py](../../scripts/research/p37-compact-results.py)同样去前缀，用于去掉大快照并保其规范化hash。不装入仓库默认离线入口，也不自动下载资产或运行引擎。按结果记录的固定URL取得Fox并核SHA，保存为`Fox.glb`，保署名与修改说明；安装使用`npm ci --ignore-scripts --no-audit --no-fund`，再分别运行probe、verify和failures。依赖为core/functions 4.5.1与上述Validator，Node24.19.0／npm11.9.0；从相同锁重装但复用缓存，不能称冷缓存或跨平台复现。[本仓运行]

**默认保源与累计配方；已有优化产物也不一律推倒重做。** 先解析目标与所有共享消费者，完整复制将变的数据，再对源基线与上轮结果核保留条件；路径不清或无法覆盖保留项时，退回源重新派生。Agent能推进定向修改、引用审查与数值回归，人定颜色／动作语义、目标相机辨识、节奏与是否接收；没有人工美术修补不等于视觉已合格。[研究]

本单元收口审计项目板更新前已进行的资源族二改验证，只作为P37比较所需的保留判据，不计静态图／刚体／短音三题完成，不重排首试。它只补数据／曲线继承，未独立验证Fox到实验源的转换、真实蒙皮变形、原DCC导出、引擎导入、游戏消费者或生成质量；不据此关闭资产质量首选缺同题比较的审计缺口。目标引擎的扩展、引用、LOD、碰撞、动作事件和设备检查沿用§9／WP9，不因本例只改颜色与时长而删去。主动工时、完整制作成本与收益未知。[研究]
