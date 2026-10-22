主线：二／三／四；G1 3D 选型、第二次修改与交付
改变的建议：[经验] 保合格资源族与可编辑源默认；缺结构时比较PVE源端恢复，角色按联合生成／骨骼对应refit／无共享rig拟合分流，GPU凸分解仅限已有设备且吞吐成为瓶颈。建筑保布局／门窗，刚体分预算简化／面组织重拓扑／缺件生成，外观与几何分别接收；所有路线保身份、许可和目标消费者门槛。
新证据：[一手／研究] 2026-10-22补PVE／独立GPU树生成、Rigel3D／LoBoFit／LUIVITON、CuACD／独立VisACD的输入、发布与采用边界；复用已核ProxyBuild／ShellMaker、SUPRA-Tex／Meshy、T2／TaoFlowForge及固定处理源码、局部二改证据。未运行新模型／引擎；旧局部验证与动态版本各在原节维护。

# WP3：3D资产路线、原生低模与第二次修改

核实时间：2026-10-14（UTC+8）；2026-10-16（UTC+8）补核凸分解接口／预算（§5）、TaoFlowForge 许可与装载链（§10.2）、程序化形状／风格范围（§13）。2026-10-20（UTC+8）补核T2.5、Tripo入口及窗口扫描（§2.1、§10）。正文见[3D资产专题](../../domains/game-dev/assets/3d.md)。以下“首试”是理论选型优先级，不是已测质量冠军。来源标签：[一手]官方文本/源码；[研究]论文或作者测量（须再分）；[经验]本报告决策。

整页选择矩阵见[3D当前最高水平](../../domains/game-dev/assets/3d.md#当前最高水平能定向改不等于只剩最终文件)。本次补齐植被源端恢复、角色联合生成／衣物拟合与GPU凸分解的领先替代；默认属于条件化工程选择，不是完整生产效果排名。各卡的旧局部gap2只记录当时范围，当前整页状态以正文为准。

此前模块建筑的最高水平卡与采用变化见[§4.1](#41-最高水平卡保布局扩建筑外观族)；参考外观见[§12.4](#124-参考外观同网格比较与观测约束)，沿原重贴图问题深化；以下刚体／资源族卡保留各自范围。

## 当前最高水平卡：刚体生产路线

核实：2026-10-22（UTC+8）。问题是同一刚体如何在预算内保形、可改并交付，不是给生成器排总榜。[研究]

| 层次 | 比较与采用判断 |
|---|---|
| 当前最高水平 | **完整商用、零手修、同预算且含二改总投入的最优路线未知。** Meshy团队T2（2026-08 v3）分别评估重拓扑与图片生成；Alibaba TaoFlowForge（2026-09）独立比较同单图生成；LATO.2（2026-07）补形状条件生成与连接重建机制。不能把不同输入／预算结果合并排名。[作者报告／研究] |
| 主流／可行参照 | 成熟简化工具沿§5保护误差与属性；已有合格源不必重新推断几何。这里没有多数采用率或与生成器同预算实测证据。[一手／研究] |
| 本仓推荐层次 | **条件化工程默认**：认可几何仅超预算先保源简化；面组织妨碍编辑才比较形状条件重拓扑；只有图片才试原生低模。近景高细节仍保高密度源／烘焙分支，现成模块和角色生态不受这张刚体卡替代。[研究／经验] |

### 同题证据与不能推出的结论

- [Meshy T2 v3，Xu等，2026-08-12](https://arxiv.org/html/2607.28675v3)§3以115资产区分两题：重拓扑输入含100k几何，图片生成不含；参考几何来自Meshy6，可控预算方法约4k面，非全部输出等面数。表2作者报告较强几何保真；表3两个FD指标赢家不同。success仅指20分钟内无CUDA错误且产出三角面，非发行通过；中位耗时按成功样本，非流形绝对数受面数影响。论文未评当前T2.5、全部UV／材质／二改成本，也没有与受误差约束的传统简化形成完整同题成本比较。[作者报告／研究]
- [TaoFlowForge，Fang等，2026-09-29](https://arxiv.org/html/2609.37139v1)§4.2由Alibaba团队在同单图输入下比较LATO.2、EdgeRunner，Toys4K及自建集报告几何／图像指标优势；是独立作者比较，不是独立复测。各用推荐推理配置，不能假定面预算、硬件和总投入相同；商业对手匿名且仅图示，不能给具名现售型号排序。TE-388文内又写338，不采用其精确规模推总量；连接预测未约束流形，指标不证明可绑定、UV合格或二改成功。[作者报告／研究]
- [LATO.2，Long等，2026-07-12](https://arxiv.org/html/2607.10623v1)§3.3展示改顶点后重建连接，§4以形状条件比较生成；默认分辨率输出未经统一后处理，不能理解为固定游戏预算排名。它与T2有共同作者，不重复计为独立团队；原几何错误、UV／材质缺口及§10依赖许可仍成立。[作者报告／研究]

**采用后的停止线。** 简化优先是保源工程推断，不是上述论文测得冠军；若关键孔洞、薄件、轮廓或接口超误差预算，保更高细节源／更保守设置或换源。重拓扑需重新接收形状、连接、法线、UV与引用；开放表面本来合法时不强制封闭，非流形也按实际消费者判断，不把单个指标当通用通过线。主动工时、淘汰率和含贴图／烘焙的共同成本未知；不把论文秒数替代现行API报价，T2.5首试只沿§10工程依据。未运行模型、引擎或真实二改。[研究／经验]

## 当前最高水平卡：资源族的编辑母版与优化交付

沿用质量审计[最高水平卡A02](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#a02--3d)，以下保留已运行的局部二改卡；[§17](#17-p37刚体同题头盔补质量证据不等于生产冠军)沿A02引用链补高细节刚体卡及同题作者图证。该轮前沿比较状态为局部改件已比较、整页差距2；[§18](#18-p37连续局部改件保旧内容还是整物再生成)新增连续修改比较，仍未做领先生成与现成／程序化的共同生产比较。

核实：2026-10-21（UTC+8）。本卡只判断同一带骨骼资源族连续改色／改动作的保留能力，不重排生成模型的美术质量榜。[研究]

| 层次 | 做法、出处与本仓判断 |
|---|---|
| 近期前沿候选 | Andrii Yaroshevych等（MacPaw，2026 ECCV OpenSUN3D）[GenRA](https://research.macpaw.com/publications/genra/GenRA__End_to_end_Framework_for_LLM_Driven_Animation_of_Rigged_3D_Models__ECCV_OpenSUN3D.pdf)在原USD资产上修改动作，保几何、蒙皮和骨架；Jakob Buhmann等（Disney Research，2026-07-16）[Generative Motion Rig](https://studios.disneyresearch.com/2026/07/16/a-generative-motion-rig-for-artist-driven-motion-authoring/)让艺术家操控姿态／时间窗口等。前者不证明glTF资源族全链，后者不是零人工美术案例；完整两改、零手修、引擎交付的最高水平未知。[作者报告／研究] |
| 工程参照与主流 | Mike Festa的[Khronos Guidelines 2.0介绍，2025-08-07](https://www.khronos.org/blog/introducing-asset-creation-guidelines-2.0-siggraph-2025)区分OpenUSD创作／交换与glTF传输；这给出职责划分，不证明所有工程必须使用USD，也没有多数采用率证据。[一手／研究] |
| 可行路线 | 已认可的源图＋成员修改配方，派生后再优化；若只有优化产物，显式复制将修改的共享数据再编辑。glTF-Transform与Validator负责读写／结构检查，不替代原DCC源或目标引擎。[研究] |
| 本仓推荐层次 | **限定样本支持的可行推荐。** 名称保留不等于可独立改；默认保源与配方，受限编辑可用完整引用路径的按需复制。下方两条正确实现均通过，未证明重建在质量、工时或成功率上普遍胜出；生成模型、视觉与玩家质量仍未知。[本仓运行／研究] |

## 1. 采用判断与分档依据

**✅ 采用：先按玩法把对象拆成静态刚体、模块场景、变形角色，再选资源来源。** 同风格授权现成包可满足时不重新生成；重复尺寸、模块接缝、门窗和可动零件优先复用已有配方；新增形状／风格先核源模块与规则是否覆盖（§13），不能把补配方算成调参数。仅有图片、缺可用几何的静态道具把原生低模列为首试；已有认可几何仅超预算才保源简化，面组织有问题再比较形状条件重拓扑；高细节源资产保留在确实需要近景轮廓/烘焙细节的分支。变形角色优先现成骨架/拓扑与服装体系；自动绑定成功和quad输出都不是关节变形通过。场景优先模块拼装，生成世界仅作受限背景候选。**局限：本轮未建立零手修、第二次修改后的真实引擎通过率，不能承诺完整无人美术发售管线。** [经验；依据见下]

### 三类资源、三档首试

|用途|质量优先|性价比优先|本地/免费|
|---|---|---|---|
|静态刚体道具|✅ 采用与画风一致的成熟完整资产；缺少独特近景物件时🧪先试Meshy 7.1，Rodin Gen-2.5作为高细节/多图对照。二者无独立同题盲测，不排序为绝对最佳|✅ 同包复用；确需新形状时🧪Meshy T2.5原生低模，显式预算、先灰模；旧合格T2配方保留；Tripo P1作替代，API P2 Preview仅对照|✅ Kenney Nature Kit/简单参数化几何。写实可👀Poly Haven单资产，仍核预算；不强凑“免费本地生成冠军”|
|场景|✅ 同套模块/材质；已有建筑布局只扩外观先保墙／门窗、复用组合，缺件单独补生成；👀Marble Pro只用于交互弱、可接受烘焙观感的环境候选|✅ Kenney/Quaternius同包模块+脚本布局，不把整个关卡作为一个mesh重生|✅ 同包现成模块/引擎基本体；👀Infinigen只借资产/程序配方，不默认整套世界生成输出直接进游戏|
|变形角色|✅ 同一现成角色生态、已知拓扑/骨架的完整资产；👀自定义生成仅当玩法允许退回刚体分件或替换角色|✅ Quaternius配套头部＋着装分件，固定身体覆盖／动作版本；不保证任意裸身体跨体型穿衣（§15）|✅ 指定CC0角色包的免费可下载部分；⛔不把TRELLIS/LATO.2默认安装或Hunyuan作为全球商用无条件路径|

零人工修拓扑、UV 和权重是准入条件；质量优先还要比较目标相机下的轮廓、细节与风格，以及追加处理和二改代价，不构成现成／生成的审美排名。[经验] 当前服务费不能跨品牌直接比较credit；尚无保留所有淘汰样本与主动工时的可比成本。[研究]

## 2. 最近几个月发生了什么，改变了哪个旧方案

### 2.1 原生低模已经是可调用路线，不只是“减面新包装”

**新刚体需求先试原生低模，旧合格配方不因默认版本改变而迁移。** 型号、默认值、面数范围和退役日统一查[§10动态表](#10-动态事实表限定补核)，这里保留改变选择的机制。[经验]

- **Meshy Smart Topology**：忽略remesh开关，目标不是硬上限；同预算验孔洞／挂点，不以“更锐利”宣传或追加面数算升级成功。高细节7.1的`geometry_resolution=4k`是几何采样，不是贴图4K；多图不支持该选项。同seed+latest也不是重复生成契约。[一手／经验；来源见§10 Meshy行]
- **Tripo P系列**：几何与纹理分开选，不能由Studio发布或quad输出推成API稳定性／角色变形通过。自动化保稳定P1候选；两阶段请求字段与灰模开关见[Tripo补核](#tripo-版本选择补核2026-10-15-utc8)。[一手／经验；版本与来源见§10 Tripo行]
- **LATO.2（2026-07-12论文，代码8月）**：分顶点与连通性，可调整顶点后重建拓扑；作者明确几何错不能靠连通性阶段补救，尚缺UV/纹理/材质。[研究：[论文限制](https://arxiv.org/html/2607.10623v1)] 不支持“新拓扑模型已经解决完整游戏角色”。[经验]
- **TaoFlowForge（2026-09-29论文，9月30代码发布）**：原生顶点+连通性三阶段；公开推理CLI、阶段恢复、raw与补洞后网格都有，读源码可区分生成错误与后处理错误；不是只有官网旋转视频。[一手：[固定README](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/README.md)、[pipeline](https://github.com/alibaba/Taobao3D/blob/f2369145382e07551fb633a589f69771b40adf32/TaoFlowForge/taoflowforge/pipeline.py)] 商用准入另查[§10.2装载与许可链](#102-taoflowforge补得权重声明仍核实际-dino-适用链)。[研究]

**替代关系**：只有图片且缺可用几何的简单刚体，原生低模值得替代“先密网格再不计损失地强制减到预算”；已有认可几何不因此退回图片重生，先按上方路线卡保源处理。不是取消密网格，近景雕塑/复杂表面仍可生成高密度源，再用成熟LOD/烘焙。若原生低模无法保持重要孔洞、细件、接口或预算反复失守，撤回到同风格现成资产/参数化建模；不能把试验失败转嫁为程序员手工雕刻。[经验]

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

### 4.1 最高水平卡：保布局扩建筑外观族

核实：2026-10-22（UTC+8）。问题是既有可玩建筑布局如何扩同风格成员、再局部换风格，而非从一张图生成整栋建筑。[研究]

| 层次 | 同题做法与采用变化 |
|---|---|
| 当前最高水平 | **完整商用、零手修、含二改总投入的建筑族最优仍未知。** HIT／鹏城实验室Tang等的[ProxyBuild，2026-09-20](https://arxiv.org/html/2609.23386v1)与独立Purdue Xu／Aliaga的[ShellMaker，2026-06-30，ECCV 2026](https://arxiv.org/html/2606.31680v1)提供近期受结构约束的外观补全比较；前者评后者，不是独立复测或相同协议的综合冠军。[作者报告／研究] |
| 主流／可行参照 | §13的成熟模块／规则体系保留已合格源件与连接；Tiny Glade近期木墙扩展仍有前置制作，旧WFC实现只支持已建模块。这些是工程参照，不是多数采用率或同预算审美排名。[一手／研究] |
| 本仓推荐层次 | **条件化工程默认**：仅扩外观先冻结占地／墙／门窗，复用库内件、组合及成对材质；缺件才生成可替换候选。尺寸／拓扑也改则回已有布局配方。生成只承担它实际供给的一层，不另建通用建筑框架。[经验] |

**输入与可改范围先于排名。** ProxyBuild §3.1需要已经划分潜在结构槽的多边形壳体，不是任意原始模型；§3.3从离线资产库检索／调参，约束不满足可退回默认程序件。样式／属性修改可重算目标槽及约束邻域，槽位用途／几何／拓扑变化须重跑完整预测。它没有承诺生成库中缺失的新模块。ShellMaker §3从已知墙和门窗语义补屋顶、部件及配对PBR材质；这比“参考图看起来同风格”多了结构输入，但不是任意引擎场景的无损导入。[作者报告／研究]

**比较支持分层，不支持全赢。** ProxyBuild §4的BuildingBlock-Box是同库最近邻后独立缩放的改编基线，非完整原方法；Meshy／Trellis未锁当前版本且不是同壳输入。ShellMaker在其NCR上略高，作者20人×10组评分也不证明游戏交付。ShellMaker自身§4以骨架深度／语义图经Nano Banana给生成基线构造输入；表1/2显示结构较强，Trellis-2的风格指标／裁判风格偏好仍可领先。其100对偏好由同样参与规划的GPT-4.1评判，不是独立人类盲评；CAD占地IoU仅.889，拱窗Opening IoU还须结合中心偏差理解。[作者报告／研究]

**独立反例决定撤回线。** ProxyBuild §5受粗／过密分槽和有限库覆盖限制；ShellMaker §4.7与附录Failure示出畸形部件、密集门窗交叠，当前无严格几何碰撞检查。外观一致不等于接口可接或可通行；若必须手工修网格，换合格源件／缩风格，不用无限重抽抵消结构错误。保原资产身份与碰撞封装是本仓工程建议，并非两篇论文已实现的交付保证。[研究／经验]

**发布物、许可和成本另核。** ShellMaker于2026-09-01发布，固定[README](https://github.com/ruiqixu37/ShellMaker/blob/61ff29fe24d9b744a0d052e342793b6df32342cd/README.md)只列PNG占地图和Holodeck JSON／可选GLB；源码loader仅有Holodeck，不把论文CityGML／CAD能力当现成入口。README的纹理包为298墙／73屋顶，与论文498／81不同。项目代码MIT、纹理另按来源CC0；Holodeck附带资产许可逐件不同，模型与图像服务也须另核，不由根MIT一并放行。[一手：固定README／LICENSE]

固定发布代码不满足直接覆盖原玩法壳的契约，以下是源码核对，不是运行结果：
- **输入／输出**：[main.py](https://github.com/ruiqixu37/ShellMaker/blob/61ff29fe24d9b744a0d052e342793b6df32342cd/main.py#L366-L398)分PNG与Holodeck。PNG从占地图新排开口；Holodeck[重建原墙](https://github.com/ruiqixu37/ShellMaker/blob/61ff29fe24d9b744a0d052e342793b6df32342cd/visualization_utils/assemble_scene.py#L1881-L2001)，不是保原网格。[一手]
- **坐标**：[归一函数](https://github.com/ruiqixu37/ShellMaker/blob/61ff29fe24d9b744a0d052e342793b6df32342cd/src/shellmaker/utils/scene_geometry.py#L289-L310)将有效场景居中、最大包围盒边缩至1且不返回变换；组装器[PNG调用](https://github.com/ruiqixu37/ShellMaker/blob/61ff29fe24d9b744a0d052e342793b6df32342cd/visualization_utils/assemble_scene.py#L1616-L1632)和[Holodeck调用](https://github.com/ruiqixu37/ShellMaker/blob/61ff29fe24d9b744a0d052e342793b6df32342cd/visualization_utils/assemble_scene.py#L2062-L2071)都发生在GLB导出前。JSON中保存布局不代表最终GLB保米制、枢轴和世界位置；新饰物改变外边界还可能影响整栋缩放。[一手／研究]
- **复用**：README说缓存／复用部件可确定性重用，但未承诺完整来源身份。[TRELLIS.2客户端](https://github.com/ruiqixu37/ShellMaker/blob/61ff29fe24d9b744a0d052e342793b6df32342cd/src/shellmaker/parts_generator/trellis2_client.py#L193-L221)按tag文件名和recycle开关跳过生成，不校完整prompt／模型配置；[Holodeck路径](https://github.com/ruiqixu37/ShellMaker/blob/61ff29fe24d9b744a0d052e342793b6df32342cd/src/shellmaker/holodeck_pipeline.py#L29-L201)内存键为category＋assetId，磁盘搜索只按类别／尺寸启发式，未核风格。跨风格共用目录可能复用错件，不能称已交付版本化模块库。[一手／研究]

ShellMaker附录报告500次自动运行均值约9.6分钟，非人工选库／准备、淘汰、连续二改的总成本；低于5%的畸形部件报告也不等于其余均可游戏发行。README列默认约24GB显存及低分辨率分支，图像重生不承诺seed复现。ProxyBuild离线库还含Sketchfab与程序件，准备、逐项授权和总成本未建立；本轮未找到可核的官方发布链接，保研究候选，不称确定未开源。保留全部淘汰、库准备、API／算力、导出与主动工时，不能以局部重算机制声称已经省钱。[一手／作者报告／研究]

本轮仅公开原文与固定源码核对，没有安装或运行模型／引擎，也未产生新建筑族。该轮只覆盖建筑外观族；植被与兼容变形供给由下方整页补核接续，不把本卡单独算作整页完成。[研究]

## 5. 从几何到游戏资产：借成熟处理，别重造框架

### 拓扑、UV与贴图

- **减面不是重拓扑。** 减面解决预算，原生拓扑生成/重拓扑解决面组织，但quad仍不保证肘膝面流、面部表情和蒙皮正确。变形角色不能沿用静态雕像验收。[经验；论文/角色反例支持]
- **meshoptimizer/gltfpack**：固定[b2330430776a95a1545f03fc7bf16927f8cadc59](https://github.com/zeux/meshoptimizer/tree/b2330430776a95a1545f03fc7bf16927f8cadc59)，MIT。读取README简化机制：误差限可能使结果达不到目标；sloppy能更激进但不保边界/属性；带属性简化+锁UV seam可保外观。不要为了数字达标无条件取消误差线。[一手；经验]
- **xatlas**：固定[f700c7790aaa030e794b52ba7791a05c085faf0c](https://github.com/jpcy/xatlas/tree/f700c7790aaa030e794b52ba7791a05c085faf0c)，MIT，无外部依赖的UV库；最新提交仍2022，不能包装成近期模型。它生成UV，不创造正确纹理；改UV后必须重新烘焙或重贴图，旧UV像素mask不能直接复用。[一手；经验]
- 2026-10 [MeshQuery论文](https://arxiv.org/html/2610.02507v1)将Agent用于UV seam规划，但明确人工pin/relax在其范围外；作者偏好胜出的缝线仅53%被标为可作production hot-start。只登记前沿，不把“Agent+UV”推荐成零手修替代xatlas的成熟默认。[研究]

### LOD与碰撞

LOD应由目标视距/屏幕误差决定，保轮廓、孔洞、材质接缝和挂点；50%/25%只是候选比率，不是游戏跨类型通用规格。材质/UV断开会增加实际顶点；只看faces会漏预算。骨骼LOD必须另验skin/morph，不能纯几何降采样后假设可用。[经验；meshoptimizer机制支持]

碰撞代理优先box/sphere/capsule或少量compound，独立于可见网格。Unity 6.3 [MeshCollider](https://docs.unity3d.com/6000.3/Documentation/Manual/class-MeshCollider.html)文档限制convex 255 triangles，动态物体建议优先primitive；因此把生成mesh直接拿来convex并非自动适配。[一手] 确实需要凹结构时👀[CoACD@131010c4](https://github.com/SarahWeiii/CoACD/tree/131010c4f03fec375ea88c5c6263f120046cb7f1)，MIT，独立库与另版Unity接入的参数能力须分别核实；2026-04实单位误差、9月另有CuACD GPU研究。小批不因加速宣传就新增GPU部署；近期比较见下。[一手；经验] 孔洞能否穿过、碰撞块数、角色/投射物所需精度由玩法决定，代理可故意不同于画面。[经验]

#### 凸分解预算：先核实际接口

核实：2026-10-16（UTC+8）。[研究] 改变的是有顶点／包数预算时选哪条调用路径，不撤回简单代理优先，也不另造处理框架。

- **主分支有参数，不等于默认启用。** [一手] 固定 `131010c4f03fec375ea88c5c6263f120046cb7f1` 的 [Python API L81–100](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/python/package/__init__.py#L81-L100)默认 `decimate=false`、`max_ch_vertex=256`、`max_convex_hull=-1`；[README 参数说明](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/README.md#L178-L186)同样要求 CLI 开 `--decimate` 后 `--max-ch-vertex` 才生效。[实际调用 L679–686](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/src/process.cpp#L679-L686)分别以 `merge`／`decimate` 控制合并／减面。只填最大顶点值不能启用约束，默认也没有最大包数限制。
- **包数与误差可能冲突，目标包数也非无条件保证。** [一手] 同版 [合并 L353–379](https://github.com/SarahWeiii/CoACD/blob/131010c4f03fec375ea88c5c6263f120046cb7f1/src/process.cpp#L353-L379)为压低包数可以越过凹度阈值；无可合并对时告警并退出。[#63 作者答复](https://github.com/SarahWeiii/CoACD/issues/63#issuecomment-2843600853)解释只合并相邻凸包、目标过少可能无对可合并。它是历史问题解释；当前固定代码已有退出检查，不把旧崩溃当当前回归。[研究] 需要同时保孔洞和限制块数时，不能只继续降低包数，须允许换简单代理或资产。
- **Unity 包缺少这组顶点控制。** [一手] README 所指 `unity` 分支本轮固定为 `9dd8431f3b2e7e4654e5a6284e3b8c36b4071c2f`（2024-09-10）。其 [Parameters 与原生调用签名 L47–95](https://github.com/SarahWeiii/CoACD/blob/9dd8431f3b2e7e4654e5a6284e3b8c36b4071c2f/Packages/info.flandre.coacd/Runtime/CoACD.cs#L47-L95)无 `decimate`／`max_ch_vertex`；[#69 协作者于 2025-06-17 的答复](https://github.com/SarahWeiii/CoACD/issues/69#issuecomment-2981661676)也说明稳定 Unity 发行版尚无该功能。[L341–359](https://github.com/SarahWeiii/CoACD/blob/9dd8431f3b2e7e4654e5a6284e3b8c36b4071c2f/Packages/info.flandre.coacd/Runtime/CoACD.cs#L341-L359)把返回网格赋给 convex MeshCollider，方法名 `ValidateColliders` 不代表已验证每包预算或 cooking。[研究] 确需该顶点控制时评估主分支离线处理，不向此 Unity 包照搬 Python 参数；这不证明包在所有网格上不可用。
- **引擎按各自契约消费。** [一手／研究] 上述 Unity 6.3 文档写的是 triangles，CoACD 参数写的是 vertices；本轮不推导一个顶点阈值保证 cooking 通过。UE 5.8 [原生 Auto Convex API](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/StaticMeshUtilities/SetConvexDecompositionCollisions-)另有 `Hull Count`、`Max Hull Verts`、`Hull Precision` 和成功返回值，可🧪先作原生基线，但调用会移除既有碰撞，先保留原资产／碰撞。[教程](https://dev.epicgames.com/documentation/en-us/unreal-engine/add-a-collision-hull-to-a-static-mesh-using-the-auto-convex-collision-tool-in-unreal-engine)的 32／16／50,000 是示例，不是通用配置或 Chaos 硬限，不能套 Unity 上限。

[研究／经验] 在选定接口实际导出的每个凸包上分别记录顶点、三角面与总包数，再看目标引擎生成的碰撞是否保住所需孔洞／接触轮廓；压预算破坏玩法形状时撤回该配置，不以成功日志放行。本轮只读固定源码、维护者答复和官方契约，未运行处理器／引擎或验证输出，不声称质量、性能、失败率或 cooking 通过率。

#### 近期碰撞比较：只在吞吐瓶颈时增加GPU路线

核实：2026-10-22。**保留primitive／少量compound；已有NVIDIA GPU且复杂凹网格批量吞吐确成瓶颈时，CuACD升为可比较候选，不替代消费者验收。**[研究／经验]

- [CuACD，Shi等，2026-09-23，§5.2–5.3](https://arxiv.org/html/2609.28731v1#S5.SS2)在同PaMO预处理后比较CoACD／NavACD／VisACD，4090＋i9-12900K下，V-HACD数据集上的CuACD均值0.23秒对CoACD18.03秒；预处理排除，阈值仅按V-HACD平均质量近似匹配，不是逐资产等质量。增强候选池移回CPU也有质量收益，不能全归GPU。它与CoACD共享作者，不算独立复测。[作者报告]
- 独立SFU团队的[VisACD，Fokin／Savva，2026-04-05，§4–5](https://arxiv.org/html/2604.04244v1#S4)走方向鲁棒／少碎块路线，比较先SDF重网格并关闭双方合并；仍有贪心局部最优与拓扑敏感。这支持另一种同题取舍，不是CuACD独立验证，两文不能拼成速度总榜。[作者报告／研究]
- 固定[CuACD@13a00e25](https://github.com/eliphatfs/cuacd/tree/13a00e25477f53a3533938b0325e2d575e3fd68b)（2026-09-25）。[README](https://github.com/eliphatfs/cuacd/blob/13a00e25477f53a3533938b0325e2d575e3fd68b/README.md)预编译运行不需CUDA toolkit／PyTorch，仍需NVIDIA GPU／驱动；首进程初始化约1秒，默认池占空闲显存70%，非位级可复现。[API](https://github.com/eliphatfs/cuacd/blob/13a00e25477f53a3533938b0325e2d575e3fd68b/cuacd/__init__.py#L367-L450)未暴露最终包数、每包顶点／三角上限，`max_n_cutting`不是包数预算。CLI自动规范并还原尺度，直接API需调用者规范；两入口默认不全同。源码[许可字段](https://github.com/eliphatfs/cuacd/blob/13a00e25477f53a3533938b0325e2d575e3fd68b/pyproject.toml#L5-L13)为LGPL-2.1-or-later，不是CoACD MIT；离线工具采用与随游戏分发分开清权。[一手]

决定：小批先保成熟CPU／目标引擎原生流程。比较GPU时计冷启动、预处理、显存、导出及实际cooking，逐包预算与玩法孔洞仍按上节验；算法耗时不是游戏物理帧时。未安装或运行处理器／引擎，不报本仓性能。[研究／经验]

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

核实：2026-10-15（UTC+8）；商业端点采用前或 2026-11-15 复核，固定源码升级后重核。旧节核旧 UV、材质槽及分件引用；2026-10-22追加§12.4参考外观同题比较，结构身份与视觉质量分别接收。[研究]

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

[研究：范围] 新增证据为两家服务的公开契约及另一作者四个固定源文件的调用链；未调用服务、下载权重、运行生成器／Blender／引擎，未取得成对重贴图前后产物。以上契约核查不声称任何服务实际保留通过；参考外观首试与比较范围见下节，原有许可准入仍成立。


### 12.4 参考外观：同网格比较与观测约束

核实2026-10-22（UTC+8）。**改变的选择：** 已认可形体先保持它，外观需求分成原材质参数修改与参考引导重贴图；先核图与表面的对应，再评纹样、隐藏面及重新打光。不是把研究模型加入商用工具榜。[研究／经验]

| 最高水平卡 | 当前判断 |
|---|---|
| 问题／上限 | 同一已认可资产如何换参考外观，又保住后续编辑与交付；**完整商用、零手修、保身份且含返工成本的最优未知** |
| 近期领先证据 | Huawei／上交／华科的SUPRA-Tex（2026-10-15）比较表面观测约束；独立Meshy团队（09-21）比较同网格和端到端纹理。两者均为各自作者测评，不是第三方复测，分数不跨表拼榜 |
| 主流／可行参照 | 同套可编辑材质源、参数修改及已有重贴图服务；这是工程供给参照，无多数采用率证据 |
| 本仓推荐层次 | 保参数修改默认；新参考外观🧪先沿已核Meshy 7保UV入口试同网格，独立验视觉与身份。SUPRA-Tex仅研究标尺；若要重建UV／引用，另计适配，不覆盖母版 |

**质量证据及反例。** [SUPRA-Tex原文](https://arxiv.org/html/2610.22352v1)§4.1／表1、C.1–3以100＋110件资产的相同输入网格比较TRELLIS.2、Pixal3D等贴图路线，报告参考与新视点效果改善；C.2评分在渲染空间，非原UV保留测试。§4.3／C.4的商业对照给本方法追加合成背视图，不能写等条件现售型号冠军。§3.4／A.2中只读的是观测记忆，输出仍更新全表面，非像素硬锁；§5显示错误几何、可见／隐藏纹样接续与材质歧义，未提供背图修复该反例的成对结果。§4.5阶段计时之和排除加载／文件I/O，不是连续端到端成本。[作者报告／研究]

独立团队的[Meshy原文](https://www.meshy.ai/blog/texture-alignment-benchmark)“Same Mesh”使用Meshy 7 Standard生成网格而非真值；各服务最高贴图配置，非同费用。Meshy 7总体领先但语义细节并列、Hi3D网格贴合更高；该测试对象不公开，未给误差条。其同网格与端到端差距不同，只支持隔离几何影响，不支持根据整资产排名替换当前合格贴图器。指标为颜色／特征相似等代理量，不等于每个文字正确或物理材质准确。[作者报告／研究]

**实际发布不是保原拓扑／UV的贴图器。** 固定源码`e4dfbbde6a8d76e25deef5aba5d836f03994967d`：[texturing文档](https://github.com/Supra-3D/SUPRA-Tex/blob/e4dfbbde6a8d76e25deef5aba5d836f03994967d/docs/texturing.md)要求网格、匹配相机与材质观测；“几何固定”限补全阶段。[pipeline](https://github.com/Supra-3D/SUPRA-Tex/blob/e4dfbbde6a8d76e25deef5aba5d836f03994967d/supratex/inference/pipeline.py#L301-L320)传`remesh=True`；[导出器](https://github.com/Supra-3D/SUPRA-Tex/blob/e4dfbbde6a8d76e25deef5aba5d836f03994967d/supratex/inference/mesh_export.py#L201-L250)重建／简化并展UV。因此不能覆写依赖原mask、槽位或skin的资产。代码与completion权重的MIT不覆盖全部模型：[发布权重说明](https://github.com/Supra-3D/SUPRA-Tex/blob/e4dfbbde6a8d76e25deef5aba5d836f03994967d/docs/weights.md)区分受[非商业研究许可](https://huggingface.co/supra3d/supra-tex/blob/main/material/LICENSE)约束的Qwen material adapter与仅有源码、未随包发布权重的FireRed后端；外部模型另核各自条款。[一手／源码阅读]

**采用与停止线。** 原材质能表达的修改不重贴图。新纹样先用同一源与目标相机比较，旧UV有效则显式保UV；参考结构不吻合先重选匹配源／视点，关键字样、隐藏接续或打光反复失败则换合格源／缩需求，不能无限加分辨率或转为人工美术修补。[Meshy端点](https://docs.meshy.ai/en/api/retexture)本次仍列`meshy-7`；1–4视图需显式该型号，`latest`不接受多视图。多视图是补充输入能力，不保证真实隐藏面正确。[一手／经验]

成本包括全部候选、淘汰、补参考、贴图、通道处理、重烘／引用适配与主动检查；无可比总额，不把研究采样速度当本地免费性价比。Agent负责固定输入与差异，人接收风格／文字／材质表现；§12.1–3的UV、槽位、节点、skin及整页许可、LOD、碰撞、导入检查保留。本轮仅公开原文与源码，未运行模型／引擎。该轮仅闭合参考外观局部比较，不独占整页评分；后续整页状态见开头矩阵。[研究／经验]


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

### 近期角色供给：先区分联合生成与衣物拟合

核实：2026-10-22。**最高水平不是一个通吃生成器，而是按输入保住运动与形体约束。** 同题现成衣橱仍是可行默认；以下近期论文改变候选分流，不证明商用完整赢家。[研究]

- [Rigel3D，Chatzis等，2026-05-13，§5–6](https://arxiv.org/html/2605.13129v1)：图像条件下联合生成形状／骨架／权重，对照相同训练数据下TRELLIS后接Anymate／Puppeteer，另比AniGen；AniGen按作者自设渲染协议重测，骨架／权重指标并非每项全赢，也不保证旧顶点／rig身份。它支持新增联合生成分支，但无长动作监督，仍可能缺关节、错分支或在极端姿势失真。本文未核到可采用的完整发布／权利链，仅作研究标尺。[作者报告／研究]
- [LoBoFit，Zhang等，2026-05-08，§3、5.1、6.2、7](https://arxiv.org/html/2605.07450v1)：需源着装身体、相近姿势／骨架拓扑及一致骨骼索引；与IFGR比较保形和局部对应，并非任意两个网格互穿衣。残余身体／自穿插、逐帧闪烁及LBS极端变形仍在；所报单件耗时不是整族制作成本。[作者报告／研究] 固定[README@f7383aab](https://github.com/MengZephyr/LoBoFit/blob/f7383aab310e5ac8926a4e4a896937413471a419/README.md)代码BSD-3-Clause，但明确不授专利许可且有中国待审申请；样例衣物／身体权利另核，不由代码许可放行。[一手]
- 独立团队[LUIVITON，Cao等，2026-05-15 v2，§4.3、4.8](https://arxiv.org/html/2509.05030v2)不需共享rig，改用SMPL中介拟合；输入衣物须A/T休息态，目标须足够人形。100套上衣／裤×4姿势的对照为公平省去身体注册、共用SMPL输入，不能把局部表格胜率外推全部复杂身体，且上衣穿插率不优于后处理DrapeNet。硬甲、断开纽扣／拉链可失败，长衣可能未收敛。[作者报告／研究] [项目页](https://cao-cong0.github.io/LUIVITON-Learned-Universal-Interoperable-VIrtual-Try-ON/)明确输出是初始姿势拟合，不是完整动作衣橱；固定[第三方声明@539cd9ca](https://github.com/Cao-Cong0/LUIVITON-Learned-Universal-Interoperable-VIrtual-Try-ON/blob/539cd9ca9161cbf66236754474115f9ec4ccc059/THIRD_PARTY_NOTICES.md)限定MIT为自有代码，SMPL等单独许可、RVH再分发待确认。[一手]

**决定：保配套衣橱默认，按输入选择专项候选，而非一遇跨体型就继续自动绑定。** 没有完整权利链时不升商用推荐；初始拟合后仍验动作、身体覆盖、绑定、LOD和旧组合。LoBoFit与LUIVITON是独立团队、不同输入路线的比较，不是二者同题复测；没有运行模型／引擎，不报告净工时或通过率。[研究／经验]

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

### 近期植被比较：恢复源结构还是每帧生成

核实：2026-10-22。**保合格风动资源族默认，但补源端恢复／生成分支，不把“只剩静态成品”直接判成无解。**[研究] 本节PVE经官方公开HTML正文与索引摘录交叉核对；GPU论文据作者镜像逐页索引（§3.5–4及限制），未取得整份PDF，不冒称完整验读。

- [UE5.8 PVE官方文档](https://dev.epicgames.com/documentation/unreal-engine/procedural-vegetation-editor-pve-in-unreal-engine?lang=en-US)的Extract From Mesh可提取原生骨架／生长数据；有叶时须树干／叶分材质，不能提取叶片用于重新实例。Recompute Point Scale承认提取半径会错，图像提取可能过平；Export需Mesh Builder输出才可绑定骨架／生成风数据，Grower瞬态不能直接导出。5.7资产不兼容5.8，仍Experimental。**采用源端恢复为候选；需手修才合格就撤回，不以节点存在宣称零手工可用。**[一手／研究]
- Epic／CDPR的[Witcher 4技术复盘，2025-11-26](https://www.youtube.com/watch?v=EdNkm0ezP0o)与[当前Nanite Foliage](https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-foliage)提供比旧历史案例更新的规模参照：Assemblies／Voxels与骨骼处理细节、远景覆盖及风动。技术演示不等于本作品全族采用；目标平台、草／灌木配方与增密预算须另判，实验功能不强制迁移。[一手／研究]
- 独立Coburg＋AMD的[Kuth等，HPG2025《Real-Time GPU Tree Generation》](https://doi.org/10.2312/hpg.20251168)以Weber–Penn参数／可选样条每帧生成几何；§3.5–3.6支持风向、改形／裁剪，§4展示20类树／灌木和连续LOD。它不是任意照片／mesh恢复器，也不自动消除树自交／树间穿插；51KiB只是持久树参数，测试work graph另有约1.5GiB临时backing，不能当整管线显存。公开[gptree@adf96a5b](https://github.com/Bloodwyn/gptree/blob/adf96a5b989eb01d0881e50dd2003cd2ad22276e/readme.md)为MIT代码的简化实现，依赖／素材另核；需D3D12 Work Graphs 1.1 Mesh Nodes硬件／驱动与配套Playground，不是完整论文系统即用。[作者PDF索引正文摘录／一手源码／研究]

**决定：只有目标设备、可维护源配方和近景／风动收益相符才比较迁移；否则保合格族。** 保图／网格、生成配方与版本，不只保烘焙产物；树冠增密与摆放增密分开验。引擎许可、[Fab资产许可](https://www.fab.com/eula)及具体包权利分开，未清具体资源包；本轮未跑模型／引擎，不能报告同场景两改工时、通行或跨平台赢家。[研究／经验]

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

## 17. P37刚体：同题头盔补质量证据，不等于生产冠军

**近景复杂刚体应加入TRELLIS.2质量对照，不只列商业API型号。** 直接沿[审计A02卡](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#a02--3d)的S16引用链，核同题公开图，而非重新做工具名单。本节核实于2026-10-21（UTC+8），不计P37三类资产全部完成。[研究]

### 本题最高水平卡

- **最高水平未知；前沿候选有结果依据。** Jianfeng Xiang等（Microsoft Research／清华等）的[TRELLIS.2，2025-12-16 v1](https://arxiv.org/html/2512.14692v1)提供同一输入的生成比较，而非仅展示可导出；不足以确定2026-10当前同预算、零手修生产最优。[作者报告／研究]
- **主流参照与可行默认。** 沿用A02的现成源／已有参数配方覆盖需求、生成补缺，再按相机和设备验交付；这不是本次测得的采用率或审美排名。[研究／经验]
- **本仓推荐层次。** 合格现成／参数化仍为可行默认；TRELLIS.2进入高细节质量候选，不升级商用默认。尚缺匹配现成源和参数配方的同题画面、预算后二改与返工成本，本节高细节头盔题仍只支持候选；整页当前状态见前置汇总及正文，不能以本节局部结论覆盖其他已比较选择。[研究]

### 具体看到了什么

**Fig6的同一护目镜金属头盔可比较形状，不是六张无关宣传图。** 原图把TRELLIS.2与Hunyuan3D 2.1、Step1X-3D、TRELLIS、Direct3D-S2、Hi3DGen并列。本仓实际看图：前两者保留较清楚的边框和护板；Step1X-3D局部更糊，Direct3D-S2表面更碎。此视角支持保留TRELLIS.2候选，不证明所有局部领先、背面正确或同面数胜出。[作者展示／本仓图像观察]

论文另有约40人偏好研究，但不是这个头盔的胜率；Table7总体各项计数相加203，Total却写202，不能把报告百分数当作已复算优势。作者亦承认小孔、细于体素的相邻表面混合，且未显式编码零件结构；细节清晰不等于可独立二改。[作者报告／研究]

**S16综述Fig4是另一题赛车，不补头盔的商业对照。** [Wu、Lou等，2026-05-09 v2](https://arxiv.org/html/2604.23629v2)已有同一F1照片的多模型灰模；但旧商业版本、配置与交付预算不能拿来拼成当前型号排行榜。它修正“综述只有抽象路线”的判断，不解决本题三路比较。[研究]

**质量优先也要拒绝凭空增加的细节。** Leon Zhang、Zhipeng Tan（TiMi L1／Tencent Games）的[GDC2026生产讲义](https://media.gdcvault.com/gdc2026/Slides/Zhang_Leon_Tan_Zhipeng_TheScalableGameAssetAssistedProductionPipelineOfHonorOfKings.pdf#page=89)（2026-03会议，p87–89）给出同模型网格增强及失败图：豹纹被变成皱褶、T恤印花被变成浮雕。故本题评价应检查哪些细节本来是几何、哪些只是图案；更密或更锐不自动更忠实。[作者展示／本仓图像观察]

这是优秀生产案例参照，不是头盔的追加同题赛。其SuperCarver环节报告通常20–30分钟，不能处理开放曲面／复杂拓扑；另一个PBR拟合环节的0.5–2人日／角色（p22–23）不等于机器耗时或已知手修比例。材料没有证明单人零手修，也不改变现成源默认。[作者报告／研究]

**公开展示资产不是现成商用素材库。** [代码仓](https://github.com/microsoft/TRELLIS.2)与权重声明MIT，[项目站材料](https://microsoft.github.io/TRELLIS.2/)却限定学术研究用途；默认安装的依赖许可仍沿§10逐项核。本仓只链接、不再分发展示模型。[一手／研究]

**撤回条件不变，比较目标提高。** 近景需要独特铆钉／边框等表现时先保高细节候选，不预设极低面数使其必输；最终仍由玩法与设备确定预算。减面后无增益、须人工补面或许可不适配，退回合格源。Agent能整理同题产物、固定配置和预算回归；人判断目标视角的形状、材质与风格，不能把指标通过替代美术接收。未运行模型／引擎，三路线质量冠军与完整两改成本仍未知。[研究／经验]

## 18. P37连续局部改件：保旧内容还是整物再生成

**最高水平卡（2026-10-21）：** 问题是已分件刚体连续改稿。近期前沿证据为Ruihan Yu、Yu-Ju Tsai等（Alaya Lab／东京大学／Science Tokyo／UC Merced）的[EditHero v1](https://arxiv.org/html/2610.02298v1)，2026-10-01；读§3–5、14–18。主流参照是已有部件／参数保源修改，采用率未知；可行基线含不修改。推荐层级为有条件局部改件，不是整页生产冠军。[作者报告／研究]

作者数据全集457链、2755改；六Agent与四生成编辑器的共同子集仅55链、416改。每轮接自己的上轮产物，另有指令和固定视角目标图；输入已分件。图5篷车六改可定位；代码路线更能保住未改部分，但新增复杂形状弱。故不外推普通纯文本、未知分件或商业Meshy／Rodin排序。[作者报告]

**选择：** 能定位且只改局部时先定向改件；同时验改动完成与旧内容保留，不能用高整物相似度放行“不改”。形状不合格就比较合法兼容件或生成缺口。没有本仓模型／引擎运行；预算、UV、挂点、碰撞与人工视觉接收仍须独立核。[研究]

**成本反界：** 作者每改中位约1.5–6分钟；Agent含模型／工具延迟，本地GPU时长不可直接相除。运行预算不一致，新增件只能代码构造，禁用外部件及生成模型；不是允许现成件路线的公平生产成本比较。[作者报告／研究]

[官网](https://alaya-lab.github.io/EditHero/)仅补展示；[仓库](https://github.com/AlayaLab/EditHero)已记录10-08发布，不沿旧摘要写待发布。[数据卡](https://huggingface.co/datasets/AlayaLab/EditHero)为mixed-cc，含非商业链；[组件声明](https://github.com/AlayaLab/EditHero/blob/main/THIRD_PARTY_LICENSES.md)不代替完整依赖清权。[许可正文](https://huggingface.co/datasets/AlayaLab/EditHero/raw/main/LICENSE-DATA.md)读取不可访问，未重试；不推荐下载作商用资源。[一手]

**P51前置使用回执：** 提示版本2026-10-21，基线f346814；12:04–12:07 UTC读研，精确主动工时未知。输入已知：茶壶／Fox／TRELLIS.2头盔／ControlFoley，未重跑。新文档N=7、正文F=6（含失败许可）；决定性D=1、FD=1。摘要／镜像不重复计；按研究家族另为2/2，不混口径。[Nova3D](https://arxiv.org/html/2607.22738)§4.3仅自身18项编辑，未作同题编辑对照，淘汰。无合格外部漏检分母；不计P37完整验收或P51完整项目。停止于新证据已改变窄选择，合法现成／程序／生成的游戏约束全链仍缺。
