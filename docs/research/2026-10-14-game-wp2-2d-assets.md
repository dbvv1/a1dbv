<a id="wp22d资产的前沿方法与零手修边界"></a>

# WP2：2D资产研究记录——生产模块的固定来源、版本与反证

> 研究层，不是第二份决策页。生产默认、第一套流程与第二次修改见 [2D 生产模块](../../domains/game-dev/assets/2d.md)。本文保存固定来源、模型／工具版本、许可、反证与验证范围；动态价格／许可只在 §9／§10 维护，正文只同步会改变选择的结论。原核实时间：2026-10-14（UTC+8）；后续补核见各节；生产模块整合：2026-10-25。未运行引擎或生成模型。

**历史增量（保留原记录）：** 主线二／三，G1 2D 资产的供给、修改与交付。2026-10-22 整页十组选择先比较再保留默认；补 i2L／SafeStyle／DyRef、DeepInterframes、Never’s End、共享外边界瓦片及独立失败记录、Light the Sprite／PIXLRelight；公开 schema 补 PixelLab 帧数／地形参考边界。P37 已结项，不追加单资产实验。

## 生产模块对应与证据入口

| 生产环节 | 正文默认 | 本文证据 |
|---|---|---|
| 玩法到规格、风格母版 | 玩法定尺寸／轮廓／节奏；先母版与分工参考 | §6；P80 卡「整族风格」 |
| 角色动作与换装 | 完整动作或分层源优先；同骨架换部件 | §2；P80 卡「动作」；分件 rig 节 |
| 地形／装饰 | 完整 47-blob terrain set（8 邻域 256→47）；保旧连接只补过渡 | §3、§13；P80 卡「瓦片」 |
| 图标／UI | 原生 UI；匹配图标；平面稿才结构重建 | §1；平面 UI 卡；图标二改 |
| 透明动画／软透明 | 有源先用；缺源再比 RGB＋抠像与原生 RGBA | 透明动画卡；§14 |
| 像素专项 | 完整动作源优先；帧编辑／补帧／静态服务分工 | §10；P80 卡「动作」 |
| 换光向 | 平面够用就保留；体积找配套源 | 换光向补研；P80 卡「换光向」 |
| 导入／二改 | 保画布／pivot／ID／事件；查最终编码与混合 | §11–14；P36 |
| 验收 | 逐件规格＋人审；不整套均值放行 | P36 卡；P36 合成契约 |
| 规则／组合资产 | 规则可表达才派生；否则换源 | §15；P33 |

正文负责选择与步骤；本文负责证据、版本、反证和未覆盖范围。两页都改时，先改正文默认，再回填本文的固定来源与验证范围；不把同一价格／许可复制成两份真相。

## 当前最高水平卡：整页生产选择（P80，2026-10-22）

编号说明：本节P80为原B-P80的2D整页交付，不是主干C3／M6的P80；保留原锚点，接收固定41a47fa。

**问题：** 从初图到整族、动作、地形和引擎交付，哪些缺口值得生成，哪些应回到源结构？正文首表覆盖十组选择；本节补此前缺少的四组比较，不把单题分数合成为整页冠军。[研究]

| 层级 | 判断与依据 |
|---|---|
| 当前最高水平 | 完整零手修供给最优未知。2026年的i2L／SafeStyle／DyRef比较风格控制，DeepInterframes比较像素补帧，GameAlpha／Wan-Alpha++比较透明动画，PIXLRelight比较分层重打光；Never’s End的2026演讲提供源层动作与装备控制的生产参照。它们解决不同子问题，不构成同预算全管线排名。 |
| 主流／可行 | 采用率未知。匹配的合法成套源、原生功能UI、可编辑结构和确定性派生继续作为可行默认；近期替代没有取消其输入完整性与消费身份优势。 |
| 本仓推荐层 | 保源默认＋有针对性的研究／服务候选。整族按参考分工与适配成本选择，动作按所缺信息分流，瓦片按缺失过渡与共享旧地形选择，照明按是否需要体积分流。源不合风格或缺隐藏内容时换源／缩需求，不以人工绘补兜底。 |
| 仍未覆盖 | 同一完整游戏资产族、多方向／邻接及连续二改的接受率、主动工时与全成本；研究数据和团队规模不能推出单人零美术生产收益。这些约束效果声称，不单独以缺实验决定比较差距。 |

**证据复用。** UI沿下方SPRITE卡，初图／改稿沿茶壶与Raj／VeriEdit卡；透明动画沿GameAlpha／Wan-Alpha++卡；规则物料沿§15的shapez／有限图组反分支；QA沿P36卡，交付沿§11–14的两引擎消费契约。它们各自提供选择或反例，不重复计作新独立来源。P37的局部结论保留，项目已结项；本次评价单位改为整页。[研究]

### 整族风格：先分参考职责，再比较适配成本

[ModelScope的i2L原文](https://arxiv.org/html/2606.13809v1)（2026-06-11）§4.1／4.5从参考预测可保存、跨prompt复用的LoRA，不需每个风格再优化；这是对“漂移就另训一个LoRA”的新替代。它仍需预训练预测器，各底模分别约8张A100训练7天；用户采用已释预测器不等于承担这笔元训练，也不代表成本消失。1000道验证题各四参考，单参考基线随机取一，底模／官方配置不同；自动偏好分数不是成套游戏接受率。[一手：作者比较／研究]

[官方v2示例](https://github.com/modelscope/DiffSynth-Studio/blob/main/examples/flux2/model_inference/KleinBase4B-i2L-v2.py)已展示四参考生成JPG；[框架代码许可](https://github.com/modelscope/DiffSynth-Studio/blob/main/LICENSE)是Apache-2.0，但[预测器模型卡](https://modelscope.cn/models/DiffSynth-Studio/KleinBase4B-i2L-v2)本次未取得可读许可正文。故i2L只列研究替代，不列免费商用默认；未验证alpha、原有资产二改或整族一致。[一手／研究]

复用WP8已读[SafeStyle](https://arxiv.org/html/2609.21242v1)（2026-09）同参考／prompt／seed的九路线对照：增强风格也可能带入参考内容，纹理与几何风格的控制需求不同；其SDXL结果不冒充当前2.5表现。独立团队[DyRef](https://arxiv.org/html/2606.26947v1)（2026-06）§4、B.5、F又给出多参考漏用／过度复制与评分误导；基线是Qwen2511、klein9B、Nano Banana Pro等，不是本页最新候选全榜。[一手／研究]

**决定：** 见正文「风格母版与参考分工」；本节证据支持先分参考职责、漂移后再比适配成本，整族商业赢家未知。[研究]

### 动作：换皮、自由配装和补过渡不是同一任务

[PixelLab公开OpenAPI](https://api.pixellab.ai/v2/openapi.json)（2026-10-22读取）说明Edit Animation把帧拼成单网格：16–64px最多16帧、65–80px最多9帧、81–256px最多4帧；Transfer Outfit因参考占槽，32–64px最多15帧、65–80px最多8帧、81–256px最多3帧。Skeleton v3 beta接收18个人形关节、3–15帧、最高256px，输出与keypoints等长且不返回参考帧。这确认自动化入口，不证明接触正确或得到可编辑rig；长动作分批还要验组间连续性。商业／输入许可仍沿§10。[一手／研究]

[GILAB的DeepInterframes](https://arxiv.org/html/2610.16423v1)（2026-10-12）§III-E／IV-B–F的总数据集为280个三帧组，以其中42组测试比较RIFE、Lucas–Kanade、CyclicGen；测试不是来源隔离，基线未按该小数据集重训，也没有利用长序列时序一致性。夸张冲击／挤压拉伸会退成近线性插值并抖色；表中尺寸计数及增强描述有不一致，本文不采用成功率或冠军说法。[固定README](https://github.com/NethamGH/deepinterframes_neural_sprite_inbetweening/blob/25cf52d2ec08a593d3918103b3182e371db01451/README.md)尺寸又与论文不同；[MIT代码许可](https://github.com/NethamGH/deepinterframes_neural_sprite_inbetweening/blob/25cf52d2ec08a593d3918103b3182e371db01451/LICENSE)不替未开放训练素材清权。[一手／研究]

[Never’s End作者2026-03演讲](https://blog.hypersect.com/how-we-draw-a-3d-sprite-world-gdc2026/)的[官方PDF](https://www.hypersect.com/gdc2026/GDC_2026_NeversEnd.pdf)，p68–69控制根／关节像素锁定与脚底接触，p92–93量化方向并保手摆关键姿势。它选择实时3D以支持装备与照明，不是预烘焙；p8说明多年制作与专业团队，p78／88仍有排序和阴影妥协。只借源层控制，不建议复造渲染器。[一手／研究]

**决定：** 见正文「角色：必要动作、源结构和事件」；本节证据支持换皮／配装／补帧分流，组合扩张时比较实时 3D。[研究]

### 瓦片：保连接条件，再补缺失的像素

[Sartor／Peers的外边界生成原文](https://arxiv.org/html/2409.14184v1)（TOG／SIGGRAPH Asia 2024）§3／6以共享外边界模板约束生成、允许单块重试；§7对照graph-cut、随机自平铺与Wang／Dual Wang，并非每类纹理都胜出。§5每块多候选再筛仍会有接缝／假水印，§8的大主体、透视和亮度渐变会失败。Img2Tile不直接复制输入texels，256px纹理实验也不保证旧16／32px游戏地图兼容。它是结构化参照，不是2026最新冠军。[一手／研究]

独立实践者[Boris的2025工程记录](https://www.boristhebrave.com/2025/02/04/generating-tilesets-with-stable-diffusion/)仍见16块Marching Squares的色差、网格和砖纹错接：latent相容不等于最终RGB相容。两来源共同支持“生成时约束连接、交付时验完整图组”，不支持“共享边界已经严格锁定旧图”。[一手／研究]

[GameTileNet最新完整稿](https://arxiv.org/html/2507.02941v2)（2025-12修订；[AIIDE正式条目](https://ojs.aaai.org/index.php/AIIDE/article/view/36805)发表于2025-11）表5连接标注exact match为43%、F1为0.63；表7是放大后识别比较。场景分支用布局规则加已有资产检索，不补库中不存在的过渡。故评估它作索引／辅助标注，不作像素供给或自动放行器。[一手／研究]

当前[PixelLab schema](https://api.pixellab.ai/v2/openapi.json)的专用tileset Pro可传lower／upper reference image匹配旧共享地形，base tile ID只是元数据；标准输出16块，transition_size=1.0悬崖输出25块但只有21种角组合，墙延续须用pattern_4x4区分；按total_tiles读实际数量，connections已弃用。[另一Create tiles入口](https://www.pixellab.ai/docs/tools/create-tiles-pro#limitations)又限制connectable sets不能用style reference，不能混用承诺。[Retro官方示例](https://github.com/Retro-Diffusion/api-examples/blob/main/example-scripts/06_tileset.py)提供inside／outside双参考。以上只证明输入／输出契约；Retro条款沿§10核实，不假报本轮更新。[一手／研究]

**决定：** 见正文「地形／装饰：先定连接，再做图」；本节证据支持保旧块与 ID、只补缺失过渡，旧连接零手修仍是工程默认。[研究]

### 换光向：近期方法没有消除配套源的价值

Aalborg的[Light the Sprite作者全文](https://vbn.aau.dk/ws/portalfiles/portal/780881090/EG_Light_the_Sprite_Pixel_Art_Dynamic_Light_Map_Generation_1_.pdf)（EG2025）§2–4／表1／图6比较像素精灵灯光图预测；输入RGB与灯向，输出light map，不是normal。[运行示例](https://github.com/IvanNik17/light-sprite/blob/main/test_real_time.py)再乘原RGB，未去原有烘焙阴影；作者报告斜面、光滑面／细节和偏暗限制，灯向插值不是动作帧验证。作者存档与仓库监督来源说明有差异，出版终稿未核，不拼闭合复现。[一手／研究]

Oxford的[PIXLRelight](https://arxiv.org/html/2605.18735v1)（2026-05）§3.4／4.1–2对照近期分层重打光路线；附录D仍承认投影阴影可能进入albedo、几何错误传入结果。数据为照片而非像素动画，前向时间不含内在分量估计，不直接当完整生产成本。[一手／研究]

**决定：** 见正文「换光向：先决定是否需要表面体积」；本节证据支持平面够用就保留、体积必需先找配套源，仅 PNG 的参数化路线仍是受限候选。[研究]

本轮仅资料与源码阅读，未安装、运行模型／引擎或新增资产实验。整页主要路线均给出领先替代与保留／撤回理由；尚无上述路线在同一完整资产族上的两轮质量和成本对照。当前页面标记以整页独审后的正文为准；这些未知不改写历史试验结果，也不重新开启P37。[研究]

## 当前最高水平卡：透明参考动画化（P37，2026-10-22）

**问题／改变：** 已认可透明角色或物件如何生成可合成的整段动作？补齐“视频抽帧只是来源”之后的路线选择：先找合格动作／可修改源；缺源时按前景透明结构比较RGB生成后抠像与原生RGBA。不是新增视频制作榜单，也不重排PixelLab换装或静态图首试。[研究]

| 层级 | 比较与决定 |
|---|---|
| 当前最高水平 | **完整可交付最优未知。** 北大／ByteDance／清华GameAlpha（2026-08-10）与独立天津大学／香港理工等Wan-Alpha++（2026-10-19）提供同参考动画化对照；前者面向游戏资产，后者区分普通动画与出现／消失特效。两者无相互直接比较，不能拼成冠军。[一手／研究] |
| 主流／可行 | 采用率未知。沿本页既有完整动作、分层源或合格3D批渲；无源可用RGB视频加时序抠像。可编辑源先改源属于工程默认，论文没有与其制作质量／成本对照。[研究] |
| 本仓采用层 | **源优先的可行默认＋有依据的研究候选。** 不透明主体先验I2V动作再抠像，已有合格RGB则保动作；软透明是必要外观时，将原生RGBA纳入对照。现有发布／许可限制未消除前，不把研究实现列免费商用默认。[研究] |

### 决定性证据与反例，不拼指标总榜

[GameAlpha原文](https://arxiv.org/html/2608.09355v1)§4.3／B.3比较三生成器与四提取器，239个验证片段；这是含训练适配的全系统比较，不是只改变alpha的消融。C.8的十名评审评价20个富集案例：对齐较好，但相对Wan＋BiRefNet美感差异不显著。监督alpha由提取器选出，任意背景重合成仍待验证。[一手：作者报告]

[Wan-Alpha++原文](https://arxiv.org/html/2610.26189v1)§IV-A/C、表IV–V报告I2V评估60段与40名评审。普通动画相对Wan2.1-I2V＋MatAnyone的改进较小；出现／消失效果增益更大，不能外推普通角色动作。其中Middle基线只向后处理、丢前半段，是该实现限制，不是所有抠像不能双向传播。比较没有覆盖MatAnyone2或GameAlpha，不能称当前全部路线最优。[一手：作者报告；研究]

因此本仓改变的是**先辨输入和透明要求，再选生产路线**：背景已污染柔边颜色时，补一个mask未必恢复原前景；硬化alpha也会删除需求中的半透明。相反，已有干净不透明动作，不能只因研究的新指标就推倒重生。上述推论不等于测试过本仓资产，动作正确与合成正确仍是两个独立条件。[研究]

### 发布能力、商用门槛与成本

- GameAlpha附录F仅计划发布数据、代码与权重，许可待发布确定；本轮未找到作者已释链接。保留为研究证据，不给安装／商用承诺。[一手／研究]
- [Wan-Alpha++新仓](https://github.com/WeChatCV/Wan-Alpha_PlusPlus)已列normal I2V推理与权重，effect权重／训练仍待发布。README用Wan2.2-I2V-A14B、49帧，论文用Wan2.1、81帧，不能把表IV成绩写成已释配置实测。静读[公开入口](https://github.com/WeChatCV/Wan-Alpha_PlusPlus/blob/0b0987f7118f78ae35215917c6c4166cf91bad4a/generate_2.2_new.py)：硬编码输入，虽读取alpha却传入白底RGB／纯白条件，未确立参考alpha直接条件化；内存构造RGBA后仅写棋盘格／alpha／前景三个MP4，未见README所称PNG落盘，另有不可移植导入路径。故只是实验入口，不是已核可交付RGBA管线。新仓未见顶层代码许可，不沿用旧仓MIT。[一手／源码]
- [normal权重](https://huggingface.co/htdong/Wan-Alpha-I2V/tree/main)已列高／低噪声文件，模型卡标Apache-2.0；这不替代码、基础模型、VAE或输入内容清权。仅公开可取不等于全套商用可采用。[一手／研究]
- 对照的具体提取器也要独立清权：[MatAnyone2许可](https://github.com/pq-yang/MatAnyone2/blob/main/LICENSE.txt)限非商业、商业须联系授权；[RMBG-2.0模型卡](https://huggingface.co/briaai/RMBG-2.0)要求商用协议，不能拿BiRefNet代码MIT覆盖实际权重。[一手]

论文的生成／抠像时间不是合格动画的总成本；Wan-Alpha++的四步配置属于T2V，不用于I2V的40步预算。比较时分别记全量生成、抠像／合成、淘汰、硬件与主动检查；许可证、无合适硬件或等待超预算时，回到合法现成源，不把“免权重许可费”当免费生产。[研究]

### 同题接收与第二改动

冻结同一参考、动作时序、画布、目标尺寸与背景集合。先验输入权利和源是否已覆盖；再分别验身份／动作语义、RGB与alpha时序、跨背景色边及导出。保留整段提取结果的连续性，不能用每帧各挑一个最优mask掩盖闪动。棋盘格对齐、DINO相似或有效PNG均不是游戏验收。[研究]

二改同一衣色／装备并调整击中时刻，检查未改部件、旧接触帧及状态衔接。Agent维护参考和帧身份、做规格与引用回归；程序员审目标尺寸的动作可读性和合成质量。需手绘补肢体／mask、柔边只能硬切或动作语义反复失败时，换源／缩需求；保留下文图集、pivot、混合、压缩与引擎交接要求。[研究／经验]

本轮仅公开原文、发布页与源码阅读，未安装、下载／运行模型或引擎。没有真实两轮合格率、主动工时或完整成本数据；此缺口约束收益声称，不以“没实测”本身决定整页差距。本卡是已结项P37的局部证据；整族和瓦片的后续比较见开头整页卡，整页标记不由此单题决定。[研究]

## 当前最高水平卡：平面UI结构重建（P37，2026-10-22）

**问题与改变：** 已有权使用一张须保外观的平面UI稿、没有原始层级时，怎样获得可改的界面？把原来的“原生UI优先”补成条件选择：功能仍原生；已知结构只取装饰；未知复杂结构才评估分阶段重建。不是从他人游戏截图提取并发行资产的授权。[研究]

| 层级 | 本题比较与决定 |
|---|---|
| 当前最高水平 | **量产与连续二改的最好路线未知。** 近期领先候选是上海大学／MiAO Worlds的[SPRITE论文](https://arxiv.org/html/2604.18591)，§3将语义层级、几何提取及引擎输出分开；[项目页](https://baiyunshu.github.io/sprite.github.io/)列CHI EA 2026（4月13–17日）。HTML显示March 18, 2026，仅记页面元数据，不由arXiv编号推初版时间。[一手／研究] |
| 主流做法 | **采用率未知。** 原生控件把文本、尺寸、状态与装饰分开，已有层级时无需先反推；静态切片解决像素取样，不解决父子包含与事件。原生能力沿用下节已核Unity文档，不把文档当效果排名。[一手／研究] |
| 可行做法 | 程序员保留原生功能、人工确认层级，Agent协助生成结构草案和检查引用；复杂装饰可用合法现成源。遇到不透明边界清楚的静态装饰，直接切片更少步骤；没有本题工时对照，不能称更便宜。[研究] |
| 本仓推荐属于哪层 | **工程可行层默认＋研究候选机制。** 有源改源；无源先判是装饰提取还是层级恢复。后一种借“结构→几何→原生”的分工，不承诺SPRITE现在可安装，更不以它推翻原生UI。独特外观无法程序化修好时换源或缩需求，而不是转交人工美术补绘。[研究] |

### 原文支持到哪：结构是草案，不是截图里藏着的真实源码

§3用Qwen3-VL提出带父子关系的YAML，经GroundingDINO／SAM2分割、LaMa补遮挡，再由GPT-5／Sonnet 4.5输出Unity UXML／USS。这里推断的是可编辑表示；论文列出的模型属于当时实现，不代表2026-10当前模型的能力。输出为Unity路线，本轮不推定Unreal等价接入。[一手：作者实现；研究：可迁移范围]

§4是作者组织的三位资深UI／UX专家评估，不是独立生产部署。其重叠半透明与抽象界面失败，复杂拖放／时序逻辑未覆盖；不能由初次重建推连续二改、主动人工时或合格交付成本，这些证据本题仍缺。[一手：作者评估；研究：证据缺口]

2026-10-22复核项目页仍为“Code (coming soon)”。页脚CC BY 4.0指网页，不是代码、模型或输入UI的许可；本轮仅借机制，没有下载／运行或分发来源资产。输入须有对应使用权，未来采用实现再逐项核其实际依赖许可。[一手／研究]

### 同题验收：保持外观，也保住下一次修改

冻结同一张已授权稿、目标尺寸／宽高比、文字与状态规范，三条路线都以同一功能和保留区判定，不能让“简单按钮替掉独特绘画外观”靠降低需求获胜。[研究]

- **原生重建**：文案、尺寸、禁用／选中与事件可独立改；装饰是否达标另验。若缺绘画轮廓，补装饰来源，不重建整张位图。[研究]
- **静态切片**：已有功能布局时只验装饰边界、alpha、层序与目标尺寸；隐藏区没有源像素就不能假设裁切会补出完整层。若要恢复容器关系，转结构化重建或明确手定层级。[研究]
- **结构化重建**：先核元素身份、父子包含和层序，再核几何／alpha／遮挡补全，最后核原生布局、焦点与命中区域。保留已明确的交互契约；模型猜出的状态仅是待审建议。[研究]

第二版在同一界面换长文案、变按钮宽度并禁用／恢复，检查旧事件与引用、目标尺寸可读性、多分辨率重排和遮挡；拖放另测拖动、取消、层序与时序反馈。记录失败、重新提取／生成次数、主动工时及总调用成本，不把格式通过或初图相似算完成。这里是后续验证设计，本轮未运行模型／引擎或真实视觉验收。[研究／经验]

**当时的局部交付边界：仅此卡不足以降低整页差距。** UI三路修复了校准审计的指定缺口；整族、动作和瓦片的后续比较见开头整页卡。P36合成QA仍不计为生产证据。[研究]

## 当前最高水平卡：透明茶壶初图（P37，2026-10-21）

**结论：先判断现成符号是否满足外观需求；缺绘画外观时可从Flare medium试起，而不是直接购买最高档。** 这是降低首轮投入的条件推荐，当前最高水平未知；精细局部改稿另按下方2026-10-22卡判断。[研究]

|层次|本题证据与选择|
|---|---|
|同一问题|透明、红色陶瓷、短嘴、三分之四视角的静态茶壶初图；无人工美术修补。|
|领先候选|Sunburst官方定位偏编辑精度；Genflick于2026-09-08公开Flare／Sunburst的同题medium／high记录。它提供一次任务对照，不建立全球最佳。[一手：作者报告]|
|主流参照|许可清楚的成套现成图标；采用率未知。本次读取Lorc茶壶及CC BY 3.0署名，旧素材用于成本与形状参照，不代表近期最高水平。[一手]|
|可行方案|整色与背景可程序化改源；绘画材质、视角和轮廓变化不能靠全局换色完成。[源码／研究]|
|本仓推荐层次|符号足够时用匹配现成源；外观不可降级时试生成候选。只是首试，不是三路质量冠军；整套供应与二改未验。[研究]|

### 同题三路：不能把简化需求算胜出

**现成源**：[Lorc茶壶](https://game-icons.net/1x1/lorc/teapot.html)标CC BY 3.0；[固定SVG](https://github.com/game-icons/icons/blob/82d948812bfe3f269ef8f731dcdb07b08160edc4/lorc/teapot.svg)仅背景与单前景两个path。本轮用已有渲染器渲染并查看原件，长而上翘的壶嘴、单色装饰轮廓不满足红陶短嘴三分之四视角。若玩法只要“茶”的符号，合法复用省去生成；若外观是需求，不能把这一替代记为通过。[一手／源码／观察]

**程序化处理**：同版[改色脚本](https://github.com/game-icons/icons/blob/82d948812bfe3f269ef8f731dcdb07b08160edc4/colorize-svgs.sh)替换前景填色，并可删除背景方形。它保留轮廓，适合整色变化；单前景不是可独立编辑的壶盖、壶身或材质层。本轮只读脚本，未运行批处理或测工时。[源码／研究]

**生成对照**：[Genflick报告](https://genflick.com/blog/gpt-image-2-5-capability-benchmark)、[逐请求结果](https://genflick.com/benchmarks/gpt-image-25-direct-benchmark-2026-09-08/benchmark.json)及[参数](https://genflick.com/benchmarks/gpt-image-25-direct-benchmark-2026-09-08/methodology.json)中，茶壶四格各一次；作者以AI辅助审图报告均满足其透明／轮廓等判据。medium两模型各约0.0134美元，high各约0.0530美元，为返回usage推算；别名、单窗口、单样本，不推接受率或稳定速度优势。原PNG下载403，本仓未独立审图或解码alpha。现有证据支持先试较低档，不支持Flare质量胜出，也未检验Sunburst精改优势。[一手：作者报告／研究]

**执行取舍**：Agent可核尺寸、alpha、源结构与引用，人先定“符号即可”还是外观不可降级，并在目标占屏尺寸看轮廓与风格。生成初图持续不合格就换源或收窄需求；通过初图仍须同题改稿和旧图混排。最高质量、零手修成套率与净省工时未知。这里只链接样图，不取得其再分发权；现成源按作者许可署名，生成调用另过既有账户／输入权利门槛。[研究]

## 当前最高水平卡：静态局部改稿（P37，2026-10-22）

**结论：撤回仅由官方定位给出的Sunburst精改首试优先级；可编辑源先改源，仅栅格才做同资产生成对照。** 问题固定为“合格透明道具只改指定部件颜色，下一轮仍保留轮廓、透明边及其余部件”。现有两项近期研究缩小了可声称范围，尚未完成这道游戏题的三路实测。[研究]

| 层次 | 结论与依据 |
|---|---|
| 当前最高水平 | 未知。下列独立于OpenAI的团队提供近期局部／连续编辑比较，但不是透明游戏资产质量冠军；也没有主动人工工时对照。 |
| 近期前沿参照 | Raj等／Scam.ai，2026-09-12：当前2.5照片连续编辑；Wang等／SB Intuitions、东京大学，2026-10-03：结构化资产局部编辑，未测2.5。不能按发表月份合并代际。[研究：原文已读] |
| 主流与可行 | 许可清晰且结构适合的现成源、脚本改源、栅格生成编辑三路；本题采用率未知。可编辑不等于符合绘画外观要求。 |
| 本仓推荐层级 | 可行层工程默认，不是实测最优；P37已结项，本卡留作局部证据。真实二改未知不再列为本项目待执行任务，当前整页比较见开头卡。 |

**当前代际没有测出这里所需的优胜者。** [Raj等§4.2及附录E](https://arxiv.org/html/2609.13617v1#S4.SS2)的E2b是非人物照片逐次加物体／文字。主表为23张照片、39条链；附录GPT Image 2低档为40链，不能混作统一分母。stateless／medium下，成功加入后末轮仍在的比例，Flare为94.1%、Sunburst为95.6%；近天花板，对上一代的预设对照未检出差异，不证明两者等效或透明边通过。此处只借正常照片编辑结果，不外推其余任务。[研究：独立团队评测，非本仓运行]

**结构化图形另有任务反转。** [VeriEdit-Bench §4.3](https://arxiv.org/html/2610.04381v1#S4.SS3)从153份源生成1740题，11编辑器每题一次；455道改色子集中，FLUX.2 dev／FireRed-Edit 1.1在图表与SVG的排序反转。模型收到的是栅格图而非源代码；它不证明改源胜过生成。GPT Image 2综合分47.13不是合格率，且未测2.5，不能替当前代际排位。[研究：作者评测，非本仓复测]

**三路在同一需求下如何取舍。** 现成源满足外观且目标部件可独立修改时，先保源；程序化脚本只改对应结构，保留原消费身份。既有Lorc茶壶单前景路径只能整色，不能冒充可独立改壶盖的源，应换兼容源或收窄修改。只有栅格时，Sunburst／Flare各从相同合格母图接同一修改，不把整张重生当局部完成。新增结构、Alpha或风格不合格且只能人工绘画修补时撤回路线。[研究：工程取舍]

本次没有运行生成、改源或计时。许可、目标尺寸、透明边、风格混排和第二轮保留区仍逐项验；真实同题净工时、零手修合格率与成套一致性未知。原茶壶首试保留，但照片保持率、SVG综合分都不能代替其验收。[研究]

## 当前最高水平卡：像素资产的自动验收（P36）

问题：Agent生成／加工后，怎样区分机械规格通过、动作与连接正确、整套可发布？2026-10-21（UTC+8）补核；本项目以近期质量目标为参照，固定可行实现只用于窄反例，不作为质量上限。

| 层级 | 依据与本题差距 |
|---|---|
| 当前最高水平 | **未知：本轮未找到同时覆盖像素形体、动作／接触、瓦片邻接、风格和二改的可靠自动放行冠军。** 近期前沿参照为Leyi Wu等（HKUST／NTU／Pearl Studio等）的[AnimationBench，2026-04-16](https://arxiv.org/html/2604.15299v1)，分角色保持、动画原则、动作语义并与专业人评比较；Hang Hua等的[MMIG-Bench，NeurIPS 2025](https://papers.nips.cc/paper_files/paper/2025/hash/d3f8714b9f9727b43d64019f2f4043d2-Abstract-Datasets_and_Benchmarks_Track.html)分低层、细粒度语义和审美偏好。它们提高验收目标，不证明像素游戏资产已能自动放行。[研究：作者评估] |
| 主流做法 | **采用率未知。** Yi-Chun Chen／Arnav Jhala（Yale／NCSU）的[GameTileNet，2025-11-07](https://ojs.aaai.org/index.php/AIIDE/article/view/36805)研究低分辨率资产的语义与连接，不能把研究管线当多数团队实践，也不是生成资产零手修通过率。[研究] |
| 可行做法 | 用明确规则检查格式、身份和允许邻接，另在目标尺寸连续验动作与新旧混排。[Tiled Terrain](https://docs.mapeditor.org/en/stable/manual/terrain/)支持角／边／混合连接，但标注合法不保证视觉自然；[原生截图比较](https://dev.epicgames.com/documentation/en-us/unreal-engine/screenshot-comparison-tool-in-unreal-engine)只能相对已认可基准查退化。现成检测器先核它实际检查的谓词，不因报告名为QA就赋予放行权。[一手／研究] |
| 本仓推荐与更高目标 | 固定19dbb4d模块只作**可行层的诊断基线**。本轮测出误放／不检查的条件后，采用逐件输入与引用检查、按任务审动作／邻接；不承诺统一数值阈值。更高目标仍是检出缺肢／错形、错误接触时刻、连接断裂和风格漂移，并由独立人工标注校准误放／误拒；多模态判断须验证后再采用，不能因本轮不跑模型而降低追求。[研究／经验] |


核实时间：2026-10-14（UTC+8）；规则几何小道具于2026-10-16补核，原模型／标价日期不变。原调查的成本为官方标价或作者报告；P36另执行固定QA／导出模块的本地合成契约复核，不涉及生成通过率、真人视觉、主动工时或目标设备。完整商用门槛随新增方案回填[WP1](2026-10-14-game-wp1-licensing.md)。

## 1. 第二次修改为什么优先改结构

**[一手／研究]** Unity UI Toolkit把文本、样式、尺寸和背景切片保留为字段；[文字](https://docs.unity3d.com/6000.0/Documentation/Manual/UIE-work-with-text.html)和[USS属性](https://docs.unity3d.com/6000.0/Documentation/Manual/UIE-USS-SupportedProperties.html)可分别变更。因此“换语言、价格变长、按钮变宽”优先改原生控件，不把文字烘焙进生成图片。仍须验字体许可、字形覆盖和目标尺寸，不承诺自动排好全部语言。

**[一手：固定源码]** [RuleOverrideTile](https://github.com/Unity-Technologies/2d-extras/blob/8de698ac55b7ed01ec95a43e714c6358505b8110/Runtime/Tiles/RuleOverrideTile/RuleOverrideTile.cs)用原Sprite到替代Sprite映射复用规则；[官方Missing Original Sprites说明](https://docs.unity3d.com/Packages/com.unity.2d.tilemap.extras@4.0/manual/RuleOverrideTile.html)明确原Sprite被换掉仍可能留下缺失映射。换雪地外观可复用邻接规则，增加分叉道路必须改连接规则和对应图。不是“替换PNG就完成二次修改”。[AnimatedTile源码](https://github.com/Unity-Technologies/2d-extras/blob/8de698ac55b7ed01ec95a43e714c6358505b8110/Runtime/Tiles/AnimatedTile/AnimatedTile.cs)只播放已有帧、设速度/起点，没有补动作机制。

旧GitHub仓库已停止开发；上面固定代码用于解释机制，生产路线选[匹配Unity的官方包](https://docs.unity3d.com/6000.0/Documentation/Manual/com.unity.2d.tilemap.extras.html)。本轮只读[官方registry](https://packages.unity.com/com.unity.2d.tilemap.extras)及[4.1.2包](https://download.packages.unity.com/com.unity.2d.tilemap.extras/-/com.unity.2d.tilemap.extras-4.1.2.tgz)，没有安装执行。包为2,129,707字节，SHA-256 `b9a9d2c431d22af101ef60ee3cfa7b0721532f55dd849b0ad3bf2b100d42ace2`；包内LICENSE外链UCL而未固定版本，当前[官网UCL](https://unity.com/legal/licenses/unity-companion-license)为1.4。实际第三方通知含Animation/Rule/RuleOverride等MIT历史贡献，不能以旧仓库仅Line Brush的通知替代，也不能把整包当MIT或跨引擎代码。**[一手：官方包；研究：版本/许可边界]**

现成资源沿用前轮资料核查：Game-icons所查三张SVG是单前景路径，不是瓶盖/液体等语义部件；Kenney Generic Items彩/白图集不能共用切片坐标，独立PNG更易保留身份。前者[固定作者许可](https://github.com/game-icons/icons/blob/82d948812bfe3f269ef8f731dcdb07b08160edc4/license.txt)按作者区分，后者[官方包](https://kenney.nl/assets/generic-items)CC0。这里继承来源，不把旧清点重算成新实验。**[研究：既有检查；经验：先选匹配源而非硬改成任何风格]**

## 2. 精灵动画：控制身份不等于控制动作

[153次生成开发复盘](https://sbsgames.dev/blog/ai-sprite-animation)（2026-09-23）报告角色身份仍在、局部比例却漂；脚底/嘴部对齐不能消除每帧重画，复用分层又出现关节僵硬与接缝。是作者小样本自评，非本仓复测，也不能推成所有模型做不到。**[一手：开发者报告]**

[Unity官方精灵生成说明](https://unity.com/blog/unity-ai-sprite-generator)（2026-04-28）实际将五秒视频等距采样为16帧，定位原型占位；“animation-ready”说明接入便利，并非零手修发行质量背书，更不是禁止发行的许可条款。**[一手]** 对攻击命中、取消窗口、循环首尾，均匀抽帧不保证保住关键姿势；重定时能重排好帧，不能创造缺帧。**[经验：机制推断]**

[JatCool/AI-Sprite-Animation@3818664](https://github.com/JatCool/AI-Sprite-Animation/tree/3818664861613905a377eca26c4ea940c06a646d)（2026-10-05）把源图、rig、姿态分离：[处理代码](https://github.com/JatCool/AI-Sprite-Animation/blob/3818664861613905a377eca26c4ea940c06a646d/package/Editor/SpriteFrameProcessor.cs#L272-L310)用全帧union裁切并重算同一源pivot，[保存姿态](https://github.com/JatCool/AI-Sprite-Animation/blob/3818664861613905a377eca26c4ea940c06a646d/package/Documentation~/ai-pose-rig.md)后可不重跑模型改帧。但[自动rig](https://github.com/JatCool/AI-Sprite-Animation/blob/3818664861613905a377eca26c4ea940c06a646d/package/Editor/RigAutoBuilder.cs)仍按身体比例/关节距离启发式划部位，推荐流程含paint parts；作者只测48像素侧面人形，仍有攻击未回idle、1像素离地。**[一手：源码／作者测量，未独立图像验收]**

**[经验]** 采用“源像素—rig—姿态分离”和共同坐标机制，暂不采用整包的任意输入零手修承诺。其[代码许可说明](https://github.com/JatCool/AI-Sprite-Animation/blob/3818664861613905a377eca26c4ea940c06a646d/docs/licenses.md)为MIT，不覆盖输入美术/可选模型，本轮只借机制、不作为已清权整包推荐。程序改参数属于本场景，人工描部位不属于；有正确现成分层时可改动作参数，没有时先缩小动作/方向或换资产。 2026-10-15 补核：[Ronimo 作者复盘](https://www.gamedeveloper.com/programming/finding-a-suitable-toolchain-for-animating-blightbound-s-2d-characters)（2021-03-11）说明 Awesomenauts 的整张动画缺部件位置／遮挡信息，因此只做整套皮肤，Blightbound 才为独立装备改用部件表示。[一手] 这支持先区分整套换皮与运行时自由配装，再选现成源或生成缺口；其生产仍有人工美术和自制工具，不是零手修证明，也不能沿用文中的历史 Spine 限制。[研究]

[SpriteToMesh v1](https://arxiv.org/html/2602.21153v1)（2026-02-24）只解决分割/布网，骨骼仍列未来工作，域来自赌场Spine资产；[Sprite Sheet Diffusion](https://arxiv.org/html/2412.03685v1)联合外观、姿态和时序，但夸张人体检测失败仍用人工标注；[2025 CVMP短文](https://marcovolino.github.io/docs/papers/2025-wong-cvmp.pdf)的末端像素化更优报告来自845帧/人工关键帧选择。它们支持约束组合或末端降采样的研究路线，不足以推荐默认训练，也不证明小像素动画全链完成。**[一手：论文，未复测]**


**2026-10-15 补核：3D 源作为精灵生产母版。** [Dead Cells 美术 Thomas Vasseur 的复盘](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-)（2018-01-25）把模型、骨架、关键姿势经小尺寸渲染输出 PNG／法线，改攻击时序时调整关键帧和姿态再输出，并复用模型部件。他把反复改稿视为主要收益，却明确接受闪像素与细节不足，没有逐像素清理。[一手] 可借“回源改后重烘”，不复制自制渲染器；专业美术建模、摆姿不是程序员零手修能力，也不能把作者的改姿过程缩成只调播放速度。[研究]

**何时不再烘焙。** Project Zomboid [2012 年记录](https://projectzomboid.com/blog/news/2012/05/on-the-reanimated-dead/)说明手绘动作、衣服和方向难维护，转用 3D 预渲染；[2014 年记录](https://projectzomboid.com/blog/news/2014/01/body-movin/)又把已有模型／动作接入实时渲染，以减少新增动画带来的纹理页、改善照明。当时仍是开发中方案，有光照问题及模型／精灵切换跳变，不能当已验证性能收益。[一手] 这支持组合扩张后重新比较表示，不建议照搬其引擎迁移或混合 LOD。法线可以支持受限重打光，不能恢复任意新视点、几何遮挡与投影。[研究]

**批量自动化不等于零手修。** [Factorio FFF-194](https://www.factorio.com/blog/post/fff-194)（2017-06-09）展示多方向／图层渲染与后续合成，但 12 种 combinator 的 Photoshop 阶段仍手画亮暗 mask、处理阴影；[FFF-218](https://www.factorio.com/blog/post/fff-218)（2017-11-24）共享角色网格／材质源，仍须重渲大量精灵，高分辨率升级也不只是增加像素。[一手] 合并人工操作的次数不能算消除人工；不借最终画质承诺本场景收益，也不把历史渲染工时换算成今天的预算。[研究]

**直接复用与剩余成本。** [研究] 先沿 [3D 资产](../../domains/game-dev/assets/3d.md)与[绑定动画](../../domains/game-dev/assets/animation.md)的许可／源质量门槛选现成角色和兼容动作，再用已有 Blender 等成熟渲染器、现有图集消费者；只补固定相机、画布／脚底基准、角度表、输出命名与事件帧映射，不造渲染引擎。程序员可选动作、改时间参数，缺轮廓、坏蒙皮或必须手摆新姿势时应换源或缩需求。[Quaternius 基型页](https://quaternius.com/packs/universalbasecharacters.html)标 CC0、Humanoid 与同体系动画兼容，但免费包不等于含已绑定 `.blend`／shader 的 Source 档；实际下载内容和所需动作许可仍分开核。[一手]

[研究] 输出量随动作帧、方向、外观组合增长；可共用图层不代表任意遮挡都能后期叠加。二改预注册：给同一合格源换装备／改时序，比较重烘与保留实时 3D 的重建产物、旧引用、整段轮廓／接触及主动工时；需要手画才能通过就撤回。只读公开文章和产品页，未运行渲染、模型或引擎；Blender 当前相机／命令行文档本轮抓取未成功，具体 API／命令未核，未据此推断其价格或可用性。仅提炼机制，未取得或复制上述游戏资产，不新增代码依赖。

### 换装预览异常：先排除观察工具缺件

**核实：2026-10-17（UTC+8）。** 改变的是资产返工入口，不是生成器排名。SOLREIGN 固定快照的[8月1日排查记录](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/docs/WEARABLES-TROUBLESHOOTING-2026-08-01.md)保留了原判断及明确撤回：衣物在 Vox 上漂浮，最初被归为缺物种美术；记录随后说明合成器按人类的 `head_m/torso_m` 取图，Vox 却使用 `head/torso`，四肢仍成功绘出，因此非空图掩盖了头／躯干缺失。[Human元数据](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/Resources/Textures/Mobs/Species/Human/parts.rsi/meta.json)与[Vox元数据](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/Resources/Textures/Mobs/Species/Vox/parts.rsi/meta.json)可静态核出该命名差异；不能据此声称已运行错误控制流。**[一手：固定项目记录与元数据]**

记录报告修别名并拒绝缺关键部件后，五件衣物的肩部差异约2px，撤回物种变体预算；修复引用的外部工具 `sprite-factory 766cf7d`、前后合成图和测试未取得，2px没有独立复算，也不是通用合格阈值。原记录残留的旧“比较公平”表述不能盖过明确 correction；另指向的[预算表](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/docs/ART-COLLECTION-TABLE-2026-08-01.md)本身仍将合成标为未验证，不能顺带采纳整批生成预算或衍生比例。缺物种后缀也不自动等于缺陷，先核实际可玩对象与状态含义。**[一手：项目自述；研究：验证限制]**

独立作者的[Godot 4.0.2反馈 #75791](https://github.com/godotengine/godot/issues/75791)报告缩略预览错行而游戏／2D视图正常，支持先区分显示层；它是过滤问题，不是缺身体的第二复现。原帖指向的[#73962](https://github.com/godotengine/godot/pull/73962)未合并，实际另案[#74341](https://github.com/godotengine/godot/pull/74341)合并于[4f17a94d](https://github.com/godotengine/godot/commit/4f17a94d69373855e1c974ed03af1974c2de4049)，只改两处预览过滤，讨论还指出统一设置不能准确代表HD-2D；不建议所有项目改nearest，也不把历史修复当当前故障。**[社区：用户报告；一手：已合并补丁]**

**采用与撤回。** 自制组合预览须能辨认必要部件是否加载；缺件时先修评估器，不据图淘汰美术。身体完整只排除缺件，仍要核预览与实际消费者的坐标、层序及输入约定；异常定位到源内容后，才补相应源或换来源。不能因预览独有异常返工美术，也不能把所有错位归为工具。修别名也增加状态映射维护，错误缺件规则可能误挡刻意无头／无躯干的对象，应按实际对象定义必要集合。本轮未运行引擎、模型或复现图片，不证明节省工时；只借明确撤回记录收窄返工判断，不新增通用检查框架。**[研究：条件选择]**

### 静态图到可编辑rig：先准备分件和活动范围

**2026-10-23补核；结论：已有正确PSD／rig不重新分解，缺层的正面动漫角色才评估See-through＋rig-c，小幅idle／gesture先于激烈动作。** 增量不是“骨骼动画比逐帧好”，而是AI能把静态稿转成可继续改部件、关节与曲线的候选源；全套零手修最优未知。既有Spine／引擎动画源不迁移，自动分层也不等于可自由转身。[研究]

#### 输入决定能动多少，不以生成帧充当源

[See-through固定README](https://github.com/shitagaki-lab/see-through/blob/df019de5129d6c4b406587a14c3501669441a783/README.md)将动漫角色分解为补全的语义层及层序，输出PSD；这是专项分层，不是单纯抠背景。[rig-parts固定配置源码](https://github.com/rig-c/parts/blob/cab7610ee9ce283f3b9fac5388e7a264af47ad76/src/config.ts)分别保存assemble、bones、meshes、regions和motion，生成参数只供可选图像adapter读取；因而改动作不必重画每一帧，但该表示不会证明补全内容正确。[一手：源码／作者说明；研究]

[固定入门链](https://github.com/rig-c/getting-started/blob/093204686165630a9d6912675fc0cf9df6ada398/README.md)要求单角色正面、手臂离身、手掌分开、双腿留缝，另取全身与头部两次分层及18关节点。它仍修正踝点，招手又限制上臂幅度以免袖笼处裂开；这支持“围绕可活动范围准备图”，不支持任意概念稿自动合格。[一手：作者已记述的制作修正，非本仓复测]

[作者2026-10-23原帖](https://www.reddit.com/r/aigamedev/comments/1xdb3am/i_had_an_ai_agent_rig_and_animate_2d_characters/)明确数值检查只验结构，头摆错位置也可能通过；剧烈动作需要替换绘图。公开多角色／换装展示是作者演示，本轮未取得独立发售采用或连续换装的质量、工时对照。因此Agent可改配置，人仍看整段；不能把检查条数或编译成功升级为美术验收。[一手：作者报告；研究]

#### 与现有源、付费服务分别选

| 路线 | 值得采用的增量 | 门槛与退出 |
|---|---|---|
| 已有Spine／引擎分件与动作 | 原部件、层序、曲线继续修改，免重新猜隐藏面 | 缺新视角／动作回源补齐或换现成组，不借AI迁移已有好源 |
| See-through＋rig-c | 用语义层和关节生成可编辑规格，再编译播放；适合受限正面小幅表演候选 | 分层在包外；缺完整部件、关节位置不可信或活动后裂开，就换源／缩幅，不以手绘兜底 |
| Layer Spine agent | 官方承诺平图或PSD→分件＋rig；同会话可修pivot、节奏并保骨骼／slot／动作名 | Creative Units余额与工作区开放先确认；按交付画面决定，未试用、不承诺零手修 |

[Layer官方指南](https://help.layer.ai/articles/8437695088-rig-a-2d-character-for-spine)（2026-10-13更新，10-23核）说明输入已有角色／生物／道具图，已有正确分件PSD可直接用；平图需补被遮挡内容。交付含JSON、atlas、纹理页，idle及最多三段所请求动作，必要时附分层PSD。它支持4.1／4.2／4.3，实际版本须匹配消费者；任务前展示Creative Units成本，不据此推算统一单价。工作区未启用时须联系支持，生成结果也不包含Spine编辑器或runtime授权。[一手／研究]

#### 代码、输入、模型和消费者四道许可门

- **工具代码：** [parts固定NOTICE](https://github.com/rig-c/parts/blob/cab7610ee9ce283f3b9fac5388e7a264af47ad76/NOTICE.md)区分MIT代码与外部输入、模型。See-through的[代码许可](https://github.com/shitagaki-lab/see-through/blob/df019de5129d6c4b406587a14c3501669441a783/LICENSE)为Apache-2.0，不据此给所有底模、权重和结果统一清权。[当前LayerDiff 3D模型卡](https://huggingface.co/layerdifforg/seethroughv0.0.2_layerdiff3d)允许商业使用，但继承Open RAIL用途限制；其余深度模型、生成底模和输入权利分别核，不能只凭代码许可放行。[一手／研究]
- **现成输入与生成依赖：** 上述固定入门链的exam输入为CC BY-NC 4.0，不能作为商用游戏底座；其自制角色配方还列非商业upscaler。故“包MIT、CPU可跑”不等于整条商业制作链放行，不直接复制配方。[一手：作者许可说明；研究]
- **自有角色入口未闭合：** 入门指南GPU配方约需23GB模型；免费网页需账户与两次分层额度，作者明确该PSD路径尚未端到端跑过，且少深度信息。本仓未下载、注册、上传或运行；现成NC样本跑通也只能验后半链，不能说完成新角色制作。[一手／研究]
- **播放与编辑分开：** [固定player实现说明](https://github.com/rig-c/play/blob/a7f248f355a5483be268b53ba2de1451d921b6a7/README.md)消费自有`skeleton.model.json`并用自身posing core，不链接Spine runtime；该链的Spine出口为4.3，需匹配编辑器／runtime；官方Spine出口仍核[编辑器协议](https://esotericsoftware.com/spine-editor-license)及[runtime协议](https://esotericsoftware.com/spine-runtimes-license)。Spine JSON可导入不等于获赠编辑器，格式兼容不免运行时授权。[一手／研究]

**二改怎样接收。** 保同一分件、关节与动作源，先改局部节奏，再换同规格部件；播放旧、新动作看接缝、接触、层序和视觉身份，改一处时不重生全部帧。需要转身新绘图、持续手补遮挡面或逐点美术调整时撤回。这里只给生产选择与接收方法；未安装工具、生成模型、运行浏览器／引擎，也未证明本仓的制作质量和成本收益，不算动画实作完成。[研究]

## 3. 瓦片和自动QA：先确定它究竟验证什么

[Tiled Terrain原文](https://docs.mapeditor.org/en/stable/manual/terrain/)分corner、edge、mixed与简化blob，所需图块不同。须分开：单图自身周期性、允许的异种邻接/角、引擎采样/图集露缝。规则、内容和采样分别修，不能把一张可重复纹理叫完整地形组。**[一手／经验]**

固定[ai-pixel-art-image-generation@19dbb4d](https://github.com/ianlintner/ai-pixel-art-image-generation/tree/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a)：[QA代码](https://github.com/ianlintner/ai-pixel-art-image-generation/blob/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a/scripts/lib/qa_metrics.py)只测每块对应边像素的RGB欧氏距离均值，再对整套取均值，不测A接B、角和alpha；动画门槛原注释针对walk接触帧，却在通用动画入口按f0/f2剪影IoU及bbox漂移判定；不足三帧则比较首尾。复制静止帧也可能通过，正确大幅攻击反而可能失败，不能将步行假设泛化为所有动作；[通用生成入口](https://github.com/ianlintner/ai-pixel-art-image-generation/blob/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a/scripts/generate_animation.py)虽接收attack仍使用同组验证。[无缝处理](https://github.com/ianlintner/ai-pixel-art-image-generation/blob/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a/scripts/lib/seamless.py)强制RGB边缘平均，不能生成连接语义。**[一手：固定源码；此前为推导，P36下节另实跑模块，未运行完整生成入口]**

**[经验]** 借局部palette/导出处理，拒绝把整包自动QA当发布门槛。帧验收应分别覆盖有运动、运动正确、首尾和状态衔接；瓦片按真实允许邻接关系验。纯数值相似度可能奖励静止，须回到玩法判据。

### P36：原QA与Tiled导出的本地合成契约复核

**✅ 只借用被验证的局部谓词与序列化，不能用整套均值或导出成功自动放行。** 先拒绝空内容／尺寸不符、逐件检查异常，再按实际允许的邻接、动作意图和消费者引用验收。上面的最高水平卡保留语义、接触与人评校准目标；以下只验证固定可行实现的边界。[经验／研究]

2026-10-21（UTC+8），Python 3.12.14、Pillow 12.3.0，运行固定`19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a`的原`qa_metrics.py`与[export_tiled.py](https://github.com/ianlintner/ai-pixel-art-image-generation/blob/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a/scripts/export_tiled.py)；两文件未改，MIT（Ian Lintner，2026）。只用可再生小型合成PNG，没有模型生成、Tiled应用、引擎或用户资产；结果不代表真实素材接受率或最新上游版本。[经验：本地执行]

| 固定输入／任务判据 | 原模块输出 | Agent应怎样使用 |
|---|---|---|
| 黑色单块；左右黑白的单坏块 | 前者seam=0通过；后者约220.836硬失败 | 这是自身边缘RGB检查的正常正反对照，不是邻接语义 |
| 黑、白各一块；要求它们接壤连续 | 每块seam=0，整套通过；实际跨边RGB距离约441.673 | 模块没有邻接输入；另按允许A→B与角规则验，不能解释为它认可地形语义 |
| 同RGB、两边alpha分别0／255 | seam=0、alpha_crispness=1，通过 | 它检查alpha是否二值，却不检查alpha接缝；不要误写“没有alpha检查” |
| 1坏块＋19好块 | 单坏块约220.836仍列info；均值约11.042≤12，整套通过 | 均值会掩盖个体异常，逐件结果须进入任务验收；12不是通用美术阈值 |
| 复制四帧；刻意将f2加宽 | 前者IoU=1、漂移0通过；后者IoU=.125、x漂移7失败 | 通过不证明有动作，失败不证明动作错；本轮宽矩形不构成“正确攻击”证据。f1也参与bbox漂移，不能说完全漏检 |
| 透明瓦片／透明动画、tile_count=0或图像不足以裁出声明瓦片 | 这些直接模块输入可通过；frames=0则抛IndexError | 调用方先检查存在、非空、数量与尺寸；这不是完整生成CLI会接受坏输入的证明 |
| TSX动画frame ID=99、duration=-10；不存在的image source | 原导出器仍生成字段 | 检查动画引用、正时长、文件存在及实尺寸；XML能解析不等于消费者有效 |

原sprite最低不透明行要求至少连续3像素：2像素宽“正常”夹具实际失败，已纠正为预期失败；4像素宽sprite与1像素上下运动bob为正常对照。bbox实际y硬门槛是3而非注释2，RGB欧氏距离也不受单通道255上限约束。坏色板、半透明alpha及缺输入另外覆盖，异常不能记成检查通过。[经验：原函数结果]

**两轮修改由调用方明确继承，不是上游自动迁移。** R0为4个16×16帧、ID0–3、各100ms。R1只追加ID4，图宽64→80，旧像素与旧tile语义保持；R2只将动画中ID1的时长改175ms，其他帧仍100ms，保R1的ID4与图像引用。三轮都实际写回并重读TSX／TMJ，检查相对路径、实尺寸与元数据；只归一化指定duration后，R2的TSX应与R1一致。[经验]

`build_tmj_example`只创建全gid=1的演示地图，不读旧地图。三轮2×2示例均是`[1,1,1,1]`、firstgid=1，因此本次不证明非平凡关卡、碰撞、事件或任意旧引用自动继承。需要更新已有地图时，保原地图并做明确修改，不把示例生成入口当迁移器。XML语义比较忽略无意义缩进，不忽略属性／节点；初次逐字节比较因tail缩进失败，修复的是复核方法，未改上游或放宽字段判据。[一手：固定源码；经验]

本轮已执行包装器标准库回归11项、原模块合成任务断言60项，均无skip；这是两种不同检查范围，不相加成质量通过率。[经验]

**复跑边界。** [窄复核脚本](../../scripts/research/check-pixel-qa-contract.py)在执行前核两份原源码SHA-256，失败就退出；不联网、不自动安装或调用供应商。Python须有Pillow（本轮已存在），原文件从上述固定提交取得。仓库的标准库回归只检查输入／hash／报告等包装逻辑；图像与导出断言另由此命令实际执行，不能拿前者代替后者：

```sh
python3 scripts/research/check-pixel-qa-contract.py --qa-source qa_metrics.py --export-source export_tiled.py
```

保留输出里的版本、源码hash和逐项结果；可选产物目录用于检查PNG／TSX／TMJ。下一步质量验证仍须有真实资产、动作／连接意图、独立人工标注及目标消费者；这份诊断包不是替代生产QA框架，也未证实AI净提效。[研究]

## 4. 程序可修与应收窄的边界

- 透明边：先核导出／导入／材质输入与混合约定是否一致（§14），不能见黑边就重生或扩边；硬alpha并不证明抠对；[Unity RGB dilation](https://docs.unity3d.com/Manual/texture-type-sprite.html)可缓解透明边滤波伪影，不能补回被删的手指。像素与柔边绘制/VFX采用不同alpha约定。**[一手／经验]**
- 对齐：共同画布、union bounds和源pivot是无裁切元数据时的退路；导入器能消费原尺寸／偏移或映射后的 pivot 时可保留紧裁（§11）。逐帧按bbox居中/等大可能抹掉正确跳跃/武器伸出，脚底锁仅对支撑相适用。**[一手／经验：源码机制推导]**
- 第二次需求：改价格/语言用原生文本，换主题用映射，改命中时刻用已有动作参数；新增方向、遮挡或轮廓是内容变化，不由文件格式工具自动补齐。**[经验]**
- 若必要缺陷只能人工画mask、补肢体、刷权重解决，则该路线对该玩法不满足零手修，改动作范围、风格或资源来源；未知通过率不应填假数字。**[经验]**

## 5. 当前前沿：原生参考编辑与透明输出，附商用约束

[研究／经验] 型号、接口、价格与生产资格只在[§9 动态表](#9-阶段-f-b图像动态事实表)维护；这里按交付缺口选择，不用新型号覆盖旧产物证据。

- **透明静态精改：可编辑源先改源；仅栅格时Sunburst／Flare同资产对照。** 这是可行默认，不由官方定位认定质量优胜；同规格接受率相当才换低等待路线。Mask 不是严格像素锁定，角色／布局仍可能失误；大图缩到游戏格后重验辨识度，不从官方定位推全行业冠军。
- **无需 alpha 的概念、背景、插图：先试付费 Nano Banana 2.1。** 参考数不是主体正确率，PNG 容器不是原生透明；若抠图／淘汰抵消价格优势，撤回此首试。
- **布局敏感静态图：FLUX 3 作专项对照。** 原创素材不需搜索时关 grounding；框只是模型条件，不是引擎布局保证。未核原生 alpha 契约与同题游戏效果，不替换透明资产首试。
- **本地小批静态：klein-4B；精细改稿对照 Edit-2511，初图保留 2512。** 这是许可、控制与部署取舍，不是独立质量排名；硬件不合适时改现成资源或商业 API。4B 不足不能免费升级 9B/dev 商用，Qwen 2.1 即使技术更合适也须先补商业授权。

已另查[Seed官方目录](https://seed.bytedance.com/en/models)、[Microsoft新模型入口](https://microsoft.ai/?post_type=new)、[xAI Image2发布](https://x.ai/news/grok-imagine-image-2)。它们作为尚待具体许可和同任务证据的补充对照，不因未列首选而认定更差，也不以品牌数量充作覆盖质量。**[研究：选型边界]**

## 6. 风格控制：先最少原生参考，再考虑训练

**[经验]** 从玩法规格确定视角、占屏尺寸、线宽、光向、色阶与锚点；批准少量母版，分清身份/风格/布局参考的职责。新资产从母版分叉，保留版本与来源；不要连续把失败修改当新真值。只有形体/内容确需变化才生成，染色、状态角标、文字和布局优先确定性处理。

**[一手／经验]** [BFL LoRA文档](https://docs.bfl.ai/flux_2/flux2_klein_training)仍支持风格/角色训练，但[官方示例](https://docs.bfl.ai/flux_2/flux2_klein_training_example)用base-9B，不能直接套免费商业生产；base-4B许可另核且参数效果重验。只有跨多类资产反复漂移、训练源权利与质量足够、能摊销维护成本时再评LoRA；作者示例也有多训后过写实反例。不能让小批道具先支付训练和维护成本。

[Diffusers IP-Adapter原文](https://huggingface.co/docs/diffusers/using-diffusers/ip_adapter)针对受支持模型族，非任意新模型通用插头；旧SDXL已验证管线可保留，原生多参考已满足时不再叠adapter/编码器许可链。FaceID不是装备/背面/动作一致性的完整解答。**[一手／经验]**

[Layered固定说明](https://github.com/QwenLM/Qwen-Image-Layered/blob/54c4fe47e76d745775e03fc66ee38457280ed9ea/README.md)重点是图像分解成多RGBA，不能假定自由语义层控制或隐藏结构恢复。**[经验]** 必须不变的像素留在已批准图层，模型只生成变动部件，再合成；确定性合成只保证保留部分没改，不保证最初分层正确。调色板能规范色数，不能修透视、身份或姿态。

## 7. 成本与真实产物：不从标价推可用资产价

[研究] 调用标价与核价日期见[§9](#9-阶段-f-b图像动态事实表)，不是 ChatGPT／Gemini 订阅额度。本地免模型许可费也不免 GPU、电费、装配、等待与维护；以下只讨论接受成本和产物证据。

**[经验]** 总生成/编辑、算力/后处理及主动工时费用，除以实际通过尺寸、成套一致性及修改验收的资产数；拒绝样本必须计入。接受率未知就不填“每角色成本”，也不声称更便宜API必省钱。

[To the Abyss, We Dive!作者复盘](https://itch.io/devlog/1623777/72-hours-to-the-abyss-the-full-timeline.amp)（2026-08-10）明确色键/裁边/降采样/调色后，除Volt外精灵仍逐像素修补。**[一手：作者自述，未运行游戏或核原图]** 它是AI辅助真实作品，不是本基准零手修成功；未锁model ID，不能归到10月Nano2.1。玩法必须精确多向小像素动作时，改用匹配成套素材或缩小动作范围，不用后处理数量掩盖人工美术。

[ai-assets固定README](https://github.com/tzachshabtay/ai-assets/blob/c54df5190ab04374e061b0078b4dbbfb32d6d013/README.md)已将Sunburst列默认，但其[hero manifest](https://github.com/tzachshabtay/ai-assets/blob/c54df5190ab04374e061b0078b4dbbfb32d6d013/demos/space-invaders/src/ai-assets/Graphics/hero.ship.json)和[hunter manifest](https://github.com/tzachshabtay/ai-assets/blob/c54df5190ab04374e061b0078b4dbbfb32d6d013/demos/space-invaders/src/ai-assets/Graphics/Invaders/invader.hunter.json)仍指向2026-06的Image2产物及更早1.5版本。**[一手：固定产物记录]** 可以借稳定ID、保留版本、promote/revert与生产静态文件的机制，不能把工具模型升级当新模型游戏实战已验证。本轮未独立验PNG视觉或全部淘汰图。

[RISEBench++ v1](https://arxiv.org/abs/2610.12343v1)作者于2026-10-08报告多轮推理编辑仍非无误；其任务准确率不得拿来充本游戏资产接受率。论文、厂商展示、开发者采用与本仓运行分别记录。**[一手：预印本；研究：不可跨任务外推]**

## 8. 下一次验证与当前结论范围

资料已足以支持：原生可修改表示优先；多参考/透明编辑替代纯文生抽卡起点；静态、动画、瓦片分开；授权先于最新型号；只在原生路径反复失败且训练源充足时评LoRA。仍未证明任一最新模型的几百件成套资产、第二次换装、实际计费、目标设备和打包后的零手修闭环。**[研究]**

后续经允许才做小切片：同一母版/目标尺寸下新增外观相似但功能不同道具，或改变攻击时序/地形连接；保留全部拒绝图、usage、主动工时与修改前后资产。当前不执行该试验。**[经验：后续区分方案的最小任务]**

[研究] 初稿独立复核已修正 RGB 距离、全网证据措辞，并核价格／快照、Qwen 许可、QA 步行假设、JatCool 手工 paint 与 UCL；完整离线检查结果见阶段 F 末尾。

## 9. 阶段 F-b：图像动态事实表

2026-10-14 的原文读取与复取状态如下；本次只收敛维护位置，不刷新核实日。`2026-11-14／选型前`表示建议最迟复核日；换型号、套餐、地区、输入用途或合同版本时提前复核，不表示已有定时监控。价格为美元、未税 API 标价，不能代替账户实际账单或订阅权益。[一手／研究]

[研究] 先在本表核精确型号与生产资格，再按 §5 选能力、§7 核实际产物，最后回到相应制作／消费者段验第二次替换。接口支持不等于边缘质量或成套接受率；单一型号页未重复透明说明，也不构成“不支持”的证据。

| 事实 | 来源 | 核实日 | 复核日或触发 | 对推荐的影响 |
|---|---|---|---|---|
| Sunburst 存在；固定 `gpt-image-2.5-sunburst-2026-09-08`；官方定位重编辑精度，可用于 Image API 或 Responses 图像工具 | [Sunburst 型号页](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst)、[2.5 发布](https://openai.com/index/introducing-chatgpt-images-2-5/) | 2026-10-14 | 2026-11-14／选型前 | 保留同题候选；撤回仅由定位给出的精改首试优先级 |
| Flare 存在；固定 `gpt-image-2.5-flare-2026-09-08`；官方定位快速日常高质量生成，支持文本／图像输入和上述两 API 入口 | [Flare 型号页](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) | 2026-10-14 | 2026-11-14／选型前 | 保留局部改稿同题对照，不把速度定位当质量排名 |
| 两者均以 `background: "transparent"` 支持透明 PNG/WebP；质量档包括 low/medium/high/xhigh/max/auto；总像素至少 655,360，边长倍数为 16 | [图像指南](https://developers.openai.com/api/docs/guides/image-generation)、[Size and quality options](https://developers.openai.com/api/docs/guides/image-generation#size-and-quality-options) | 2026-10-14 | 2026-11-14／接口变化时 | 保留透明推荐；32/64 像素格须缩小后验收 |
| 两者 Standard 每百万 token：文本输入 $5、缓存 $1.25，图像输入 $8、缓存 $2、图像输出 $30；Batch 图像输出 $15；旧 Image 2 计算器不能估 2.5 消耗 | [Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst)、[Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) | 2026-10-14 | 2026-11-14／预算前 | 同费率不证明同单张成本；用实际 usage、接受率与等待成本决定 |
| OpenAI API 输出在双方之间、法律允许范围归客户；输入清权、输出审查由客户负责；默认不以内容改进服务，除非明确同意 | [Services Agreement §4](https://openai.com/policies/services-agreement/) | 2026-10-14 | 2026-11-14／签约或地区变化 | API 路线有条件保留；不以 ChatGPT 订阅替代 API 合同 |
| API 服务访问／提供受支持地区清单限制，不能从 API 访问规则推导离线游戏的全球销售禁区 | [官方 API 地区清单](https://help.openai.com/en/articles/5347006-openai-api-supported-countries-and-territories) | 2026-10-14 | 2026-11-14／实际访问前 | 使用者按真实所在地核查，不绕过地区限制 |
| 旧 `gpt-image-2-2026-04-21` 仍列型号快照；ChatGPT 图像功能另受居住地消费条款管辖，不能当固定 API 快照 | [旧型号页](https://developers.openai.com/api/docs/models/gpt-image-2)、[非欧洲条款](https://openai.com/policies/row-terms-of-use/)、[条款入口](https://openai.com/policies/terms-of-use/) | 2026-10-14 | 2026-11-14／换入口时 | 保留历史产物标识，不将旧演示归为 2.5 实证 |
| `gemini-nano-banana-2.1` 存在；页脚 2026-10-06 列 stable、1K/2K/4K、最多 14 张参考；Lite 非多轮／多参考默认，未核原生 alpha 契约 | [Google 型号页](https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1)、[图像指南](https://ai.google.dev/gemini-api/docs/image-generation) | 2026-10-14 | 2026-11-14／选型前 | 保留无 alpha 要求插图的性价比首试 |
| Nano Banana 2.1 Standard：输入 $1.50/M，文本及思考输出 $7.50/M，图像输出 $30/M；1K $0.0336、2K $0.0504、4K 约 $0.113；Batch 分别 $0.0168/$0.0252/$0.0567 | [Google 定价相应型号段](https://ai.google.dev/gemini-api/docs/pricing#gemini-nano-banana-2.1) | 2026-10-14 | 2026-11-14／预算前 | 原价格确认；计入输入、思考、搜索、拒绝样本，不能当全调用总价 |
| Google 不主张生成内容所有权且输出可能重复；Paid 不用于改进产品但有有限安全日志；Unpaid 通常允许改进及人工审阅，EEA/瑞士/英国与 active billing 条件另见正文 | [Gemini API 条款](https://ai.google.dev/gemini-api/terms) | 2026-10-14 | 2026-11-14／账户或合同变化 | 商用及保密路线仍须区分 API、AI Studio 和消费者订阅 |
| Gemini API 访问须在可用地区；面向 EEA/瑞士/英国用户的 API Client 只能用 Paid Services | [条款](https://ai.google.dev/gemini-api/terms)、[地区](https://ai.google.dev/gemini-api/docs/available-regions) | 2026-10-14 | 2026-11-14／实际访问前 | 离线生成与向玩家开放 API 分开评估 |
| FLUX 3 Image 当前 768sq/1K/2K/4K 每张 $0.041/$0.048/$0.100/$0.607，响应含 cost；计价按 resolution 档 | [BFL 定价](https://docs.bfl.ai/quick_start/pricing) | 2026-10-14 | 2026-11-14／预算前 | 确认原 1K/2K 预算，不套 10 月 8 日结束的五折促销 |
| FLUX 3 Image 有多参考及 bounding-box 布局入口；grounding 默认开启，可设 false | [官方功能页](https://docs.bfl.ai/flux_3/flux3_image_overview)、[边界框](https://docs.bfl.ai/flux_3/flux3_image_bounding_boxes) | 2026-10-14 | 2026-11-14／选型前 | 保留布局专项对照；原创素材不需搜索时关闭 grounding |
| FLUX API 非 EU 合同允许合规商业输出，保留来源凭证；默认授予服务商改进／训练用输入输出的许可；自托管不是 API 合同所授权 | [Developer Terms §3–6](https://bfl.ai/legal/developer-terms-of-service)、[API Terms §2](https://bfl.ai/legal/flux-api-service-terms) | 2026-10-14 | 2026-11-14／地区或合同变化 | 保密项目先核合同；EU 版不能由本次非 EU 阅读放行 |
| klein-4B 及 base-4B 各自权重 LICENSE 为 Apache-2.0；独立 flux2 推理代码亦为 Apache-2.0 | [4B 卡](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/README.md)、[4B 权重](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/main/LICENSE.md)、[base-4B 权重](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-4B/blob/a3b4f4849157f664bdbc776fd7453c2783562f4d/LICENSE.md)、[固定代码](https://github.com/black-forest-labs/flux2/blob/50fe5162777813d869182b139e83b10743caef15/LICENSE.md) | 2026-10-14 | 2026-11-14／换 checkpoint 时 | 保留本地免模型许可费首试；软件通知、依赖和输入另核 |
| klein-9B 与 FLUX.2-dev 权重为 Non-Commercial v2.1：模型限非商业／非生产；输出商用条款不反授商业运行 | [9B 许可](https://huggingface.co/black-forest-labs/FLUX.2-klein-9B/blob/main/LICENSE.md)、[dev 许可](https://huggingface.co/black-forest-labs/FLUX.2-dev/blob/main/LICENSE.md) | 2026-10-14 | 2026-11-14／换许可时 | 不免费升级商用；无小团队自动豁免 |
| FLUX 3 商业权重仍为洽谈入口；BFL 自托管按选定模型和付费计划授权，须报告用量；许可到期／终止后停用并删除模型，API 接入另约 | [Self-Hosted Terms §1–8](https://bfl.ai/legal/self-hosted-commercial-license-terms) | 2026-10-14 | 2026-11-14／购买或终止前 | 不把一次下载当永久商用权，也不自行推断旧输出权利 |
| Qwen-Image-2512、Edit-2511 官方卡为 Apache-2.0；对应 Qwen-Image 代码 Apache-2.0 | [2512](https://huggingface.co/Qwen/Qwen-Image-2512)、[2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)、[2511 固定卡](https://huggingface.co/Qwen/Qwen-Image-Edit-2511/blob/6f3ccc0b56e431dc6a0c2b2039706d7d26f22cb9/README.md)、[固定代码](https://github.com/QwenLM/Qwen-Image/blob/6b5e1f5cec987d404be5ac6657db3b9aacb56a89/LICENSE) | 2026-10-14 | 2026-11-14／换 checkpoint 时 | 保留初图与编辑本地对照；模型许可不保证输出独占或清权 |
| Qwen-Image-Layered 官方卡与独立代码 Apache-2.0，可分多 RGBA 层 | [模型卡](https://huggingface.co/Qwen/Qwen-Image-Layered)、[固定代码许可](https://github.com/QwenLM/Qwen-Image-Layered/blob/54c4fe47e76d745775e03fc66ee38457280ed9ea/LICENSE) | 2026-10-14 | 2026-11-14／换版本时 | 保留分层专项候选；不等于恢复被遮挡内容或可绑定源稿 |
| Qwen-Image-2.1 固定卡（2026-09-20）列生成／编辑、RGBA、十参考；7B 仅视觉组件，非全管线显存 | [固定卡](https://huggingface.co/Qwen/Qwen-Image-2.1/blob/d26bb61231c349cf6b7896fa83353113880e1ba3/README.md) | 2026-10-14 | 2026-11-14／换版本时 | 技术能力不构成商业资格；生产门槛见下一行 |
| Qwen-Image-2.1 代码／权重为 Qwen Research；§2 商业生产需另许，无小团队自动豁免。后次重读代码与当前卡仍为 Research，HF 固定 LICENSE raw/blob/resolve 复取失败；初次成功记录见表后 | [代码许可](https://github.com/QwenLM/Qwen-Image-2.1/blob/bb8e2172e08c6720652a4a23ad1c406e5b6ed1ee/LICENSE)、[权重许可](https://huggingface.co/Qwen/Qwen-Image-2.1/raw/d26bb61231c349cf6b7896fa83353113880e1ba3/LICENSE)、[当前卡](https://huggingface.co/Qwen/Qwen-Image-2.1) | 2026-10-14（权重原文后次复取未成） | 2026-11-14／任何商业采用前 | ⛔暂缓默认商业；旧 Apache 许可或 RGBA 功能均不能替新版本清权 |
| Adobe 自有 Firefly Image Model 5 在官方当前列表；非 beta 输出可商用，beta 除产品明禁；FAQ 列中国、俄罗斯、白俄罗斯等不可用 | [型号列表](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/current-firefly-promotions.html)、[FAQ](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html) | 2026-10-14 | 2026-11-14／实际生成前 | WP1 条件候选保留；未取得同题接受率，不替换本页三档 |
| Adobe 输出仍须输入清权、保留水印／来源元数据，禁止用生成输出训练或改进 AI；第三方模型和指定计划赔偿另约 | [2026-04-23 特别条款 §1–3、7–8](https://www.adobe.com/cc-shared/assets/pdf/legal/servicetou/adobe-generative-ai-product-specific-terms-en-us-20260423.pdf) | 2026-10-14 | 2026-11-14／合同或计划变化 | 普通商用不等于成品游戏 IP 赔偿；不能拿 Firefly 输出训练风格 LoRA |
| Kenney Generic Items 官方页仍为 CC0，提供免费获取；该包许可不替商标／肖像或其他包清权 | [指定资产包](https://kenney.nl/assets/generic-items) | 2026-10-14 | 2026-11-14／换包时 | 保留现成图标优先 |
| Game-icons 固定版按作者为 CC BY 3.0 或明确标出的 CC0；Lorc/Delapouite 仍需署名，不能整库当 CC0 | [固定许可](https://github.com/game-icons/icons/blob/82d948812bfe3f269ef8f731dcdb07b08160edc4/license.txt) | 2026-10-14 | 2026-11-14／新增作者资产时 | 保留匹配图标，但按作者留许可和改动说明 |
| ComfyUI 固定编排代码为 GPL-3.0；商用不被禁止，分发须履行 GPL；节点／checkpoint 不由此清权 | [固定 LICENSE 原文](https://raw.githubusercontent.com/Comfy-Org/ComfyUI/8010b48d2c1be986613f8e8c761527d205bd756f/LICENSE) | 2026-10-14 | 2026-11-14／换节点或部署方式 | 保留已有本地工作流，不拿编排器许可包办全链 |
| Tilemap Extras 4.1.2 官方包 LICENSE 外链 UCL；本次重读 2,129,707 字节包并核得上文同一 SHA-256；第三方通知含 Rule/Rule Override 等 MIT 贡献，整包不是 MIT。UCL 当前 v1.4，需有效 Engine License | [官方包](https://download.packages.unity.com/com.unity.2d.tilemap.extras/-/com.unity.2d.tilemap.extras-4.1.2.tgz)、[当前 UCL](https://unity.com/legal/licenses/unity-companion-license) | 2026-10-14 | 2026-11-14／换 Unity 或包版本 | 保留匹配版本包；未安装执行，不扩大到跨引擎代码许可 |

[一手／研究：Qwen 2.1 许可读取历史] 初次取得代码／权重两份文本，均 7,831 B，SHA-256 同为 `8dc973f024ff95966bea25866efa443fd16776dcb1001e681e3d467ea572b28d`。上表后次权重复取失败，未重算旧哈希；保留初次成功证据，不写成从未核过，也不把此次整理当复核成功。

本表没有把未读取的账号权益、原生 alpha 的缺省值、免费商用追溯、未公开许可或模型成功率写成确定事实。固定版本源码／许可继续以正文 SHA 为复现锚点；动态入口用于检查是否出现影响后续选型的新合同。[研究]

## 10. 阶段 F-c：像素专用服务补缺

**结论：🧪 PixelLab 进入“像素小资产、同一动作批量换装”的质量／控制性专项首试；🧪 Retro Diffusion RD Fast/Plus 进入低成本静态像素对照，RD Pro 作为多参考升级。两者均为云服务，不占本地免费档；完整成套现成资产仍优先。** 这是按许可、低分辨率接口和第二次修改控制选择的试验顺序，未生成、导入或测量成套一致性。[研究]

### 先核许可和数据，再谈动画

[研究] 下方[动态增量表](#像素专项的动态事实增量)集中维护服务许可、账户适用日期、数据用途与接口。先通过这些门槛，再进入动作比较；允许商用输出不授模型权重，也不保证版权独占。没有真实响应时不补造 model ID／版本或请求身份。

### 控制性：改同一组帧，而不是重新抽一组

[研究／经验] PixelLab 的跨帧编辑／换装用于比较“保留已有动作，只换装备”；Retro 的低分辨率、参考与结构化导出作静态／起帧动画对照。具体端点、尺寸和教程冲突见下表，不把“game-ready”或“保持角色”宣传当逐帧通过。

姿态／骨骼输入只是生成条件，不证明同拓扑或可编辑骨架；可继续编辑的位图不等于语义层／rig。分组编辑长动作新增组间漂移风险。已有帧换装不等于补出新动作；缺动作仍须选源或另验生成，不能从换装接口外推。

**共同撤回条件：** 同规格换装后脚底、武器接触、事件帧或方向身份漂移且只能手画修复；新瓦片不能接旧地形；第二次修改必须反复整组重抽。此时改用现成动画／已有正确分层／更少动作方向。脚本可重排、裁切、统一 palette 和检查坐标，不能修缺肢体或缺遮挡面。[经验]

### 像素专项的动态事实增量

| 事实 | 来源 | 核实日 | 复核日或触发 | 对推荐的影响 |
|---|---|---|---|---|
| PixelLab 为专有云服务；2025-11-23 条款允许合规商业使用／修改／分发输出，禁未经许可用输出训练；结合 Open RAIL-M 用途条件。程序化使用走官方 API，转售／另建服务先联系；输入／第三方权利由用户负责，合同版权表述不保证法律承认 AI 版权 | [条款 §1–4](https://www.pixellab.ai/termsofservice)、[所链 RAIL-M](https://github.com/CompVis/stable-diffusion/blob/main/LICENSE) | 2026-10-14 | 2026-11-14／选型前 | 纳入专项试用；不能拿这些图再训练自有风格模型 |
| PixelLab FAQ“不训练”不能覆盖条款 §3.4 通知例外；生成前核 UI／工具是否通知训练或保存 | [条款](https://www.pixellab.ai/termsofservice) | 2026-10-14 | 上传／生成前或 2026-11-14 | 不凭宣传上传保密素材 |
| PixelLab 月付公开初始价 $12/$24/$50，分别 2000/5000/10000 generations/月；某些工具一次消耗多个 generations，非逐张成品价 | [套餐](https://www.pixellab.ai/#checkout)，云端浏览器选中月付查看 | 2026-10-14 | 2026-11-14／预算前 | 不混用套餐额度和 API 估价；未购买，税／实际账户另核 |
| PixelLab 免费试用显示 40 次快速、之后每天 5 次慢速最多积累 20；商用输出说明覆盖试用；地区排除 Russia/Belarus/Iran/Venezuela | [套餐及脚注](https://www.pixellab.ai/#checkout) | 2026-10-14 | 2026-11-14／使用前 | 可提出零购买对照，但免费云额度不等于本地免费或全部工具可用 |
| Pixflux 64×64 非透明 API 估价 $0.00793、透明 $0.0084；Edit animation/Transfer outfit Pro ≤128px 每调用估价 $0.08，≤170px $0.115，≤256px $0.15 | [官方 API 目录对应端点](https://www.pixellab.ai/pixellab-api) | 2026-10-14 | 2026-11-14／预算前 | 静态与跨帧编辑分开计费，估价不当账单或接受成本 |
| PixelLab API保留低分辨率、参考、调色板与透明路径；`edit-animation-v2`／`transfer-outfit-v2`已由schema确认。编辑16–64px最多16帧、换装32–64px最多15帧；65–80px为9／8帧，81–256px为4／3帧；Skeleton v3为姿态条件生成，不是rig | [公开schema](https://api.pixellab.ai/v2/openapi.json)、[API目录](https://www.pixellab.ai/pixellab-api)；详见开头整页卡 | 2026-10-22 | 实际调用前核schema；最迟2026-11-22 | 教程“仅扩展”不再用于否定API可行性；未调用生成或验证接触 |
| Retro 2026-09-28 新条款只立即覆盖新账号，旧账号于 2026-10-28 起适用；旧版 2025-08-19 PDF §7 保留 Designs/Materials 权利，§3/6 自动化禁令无新版明确 API 例外；本轮读到 PDF 正文，未登录／接受协议 | [新条款](https://retrodiffusion.ai/terms)、[旧版 PDF](https://retrodiffusion.ai/assets/terms-8312c717.pdf) | 2026-10-14 | 2026-10-28／账号选型前 | 旧账号自动化先核适用合同，不能统一按新条款放行 |
| Retro 新版输出在双方间归生成者，覆盖免费／余额／套餐／API/MCP；平台可用输出训练；用户不能用于 AI 训练／微调／蒸馏／评估；免费／公开内容可能连提示和设置展示，不保证独占／版权。自动化须官方 API/MCP/应用或扩展，不以网页脚本代 API；MCP 仓库 MIT 不授服务权重 | [新条款 §4–7、11](https://retrodiffusion.ai/terms) | 2026-10-14 | 2026-10-28／保密素材使用前 | 适合可公开专项样本；保密资产或 LoRA 数据用途不默认 |
| Retro 公开首页 RD Fast $0.03、Plus $0.06、Pro $0.18/图，动画 $0.07/段起；官方 MCP README 仍写 Fast 约 $0.015 起 | [首页](https://retrodiffusion.ai/)、[MCP 文档](https://github.com/Retro-Diffusion/retro-diffusion-mcp/blob/master/README.md) | 2026-10-14 | 每次预算先估价；最迟 2026-11-14 | 口径有差异，不选最低宣传价预算；采用官方免费 cost estimate 与真实账单 |
| Retro API/MCP 提供低分辨率、参考、调色板、图生图、GIF/sprite-sheet、Wang/blob tileset 和起帧动画；具体尺寸依 style，Pro 最多 9 参考 | [官方 API 示例](https://github.com/Retro-Diffusion/api-examples/blob/main/README.md)、[官方 MCP 文档](https://github.com/Retro-Diffusion/retro-diffusion-mcp/blob/master/README.md) | 2026-10-14 | 2026-11-14／style 或接口变化 | 纳入静态性价比／多参考对照；未独立证明动画连续性或零手修 |

[研究] Retro 新条款、PixelLab 月付显示和 Retro 价格由公开浏览器正文核得，HTTP 提取空白不等于没有条款；未登录、上传或生成。

[研究] 历史阶段 F 检查：完整离线 14/14、非空无 skip，`git diff --check` 通过；末次许可表补行另跑局部文档检查，不扩为模型、引擎或 hosted CI。


## 11. 图集二改：裁切后保留的是位置还是尺寸

核实：2026-10-15（UTC+8）。改变 `assets/2d.md` 的具体选择：不再把“逐帧紧裁”本身当作错误；先看导出数据是否保存源坐标，以及既有消费者是否真正使用。只读资料、下载小型包／JSON并用标准库解析，没有安装或运行导出器、游戏、模型、Unity／Unreal。[研究]

### 同样叫裁切，承诺不同

[TexturePacker 的原生设置契约](https://www.codeandweb.com/texturepacker/documentation/texture-settings)区分：`Trim` 保使用时的原尺寸和锚点；`CropKeepPos` 保位置但使用尺寸缩小；`Crop` 将原位置归零。可用模式依目标框架而异。因此“脚底没移”不能推出 UI 的固有尺寸／布局不变；只保存 atlas `frame` 矩形也不能恢复源画布位置。优先沿用现成格式与消费者，不建议为此购买工具或自建导入框架。[一手／经验]

### 元数据确实走到了哪里

- **Unity：** [官方 Aseprite 3.0 文档](https://docs.unity3d.com/Packages/com.unity.2d.aseprite@3.0/manual/ImporterFeatures.html)当前页面标 3.0.2，动画层导入的 Canvas pivot 按源画布定位，Local 则采用局部空间。本轮从[官方原包 3.0.2](https://download.packages.unity.com/com.unity.2d.aseprite/-/com.unity.2d.aseprite-3.0.2.tgz)读取 `Editor/AsepriteImporter.cs` 的 `CreateNewSpriteMetaData`：Canvas 分支把源 position、packOffset、spriteRect 尺寸交给 `ImportUtilities.CalculateCellPivot`，结果写入 `spriteData.pivot`；`Editor/Utilities/ImportUtilities.cs` 用 canvasSize 和 alignment 换算到裁后矩形坐标。不是仅宣称文件有 pivot 字段。包 2,124,561 bytes，SHA-256 `c3834723a97eb6c1de15e4a1257d97c78fe0c0997fb97e5bee37d66560a9c44c`；package 要求 Unity 6000.3.0a2，许可 UCL。只用于核机制，已有工程选兼容包，不因本文升级；未复测重导入。[一手：官方包静态阅读]
- **不同作者消费者对照：** Phaser 3.90.0 固定提交 [`a9965625f49cf366584f454556b039e06e8adad6`](https://github.com/phaserjs/phaser/tree/a9965625f49cf366584f454556b039e06e8adad6) 的 [JSONArray](https://github.com/phaserjs/phaser/blob/a9965625f49cf366584f454556b039e06e8adad6/src/textures/parsers/JSONArray.js) 将 `sourceSize`、`spriteSourceSize` 送入 [Frame.setTrim](https://github.com/phaserjs/phaser/blob/a9965625f49cf366584f454556b039e06e8adad6/src/textures/Frame.js)；[Size.setSizeToFrame](https://github.com/phaserjs/phaser/blob/a9965625f49cf366584f454556b039e06e8adad6/src/gameobjects/components/Size.js) 从 realWidth/realHeight 取原尺寸，[Origin](https://github.com/phaserjs/phaser/blob/a9965625f49cf366584f454556b039e06e8adad6/src/gameobjects/components/Origin.js) 按尺寸算 displayOrigin；[MultiPipeline.batchSprite](https://github.com/phaserjs/phaser/blob/a9965625f49cf366584f454556b039e06e8adad6/src/renderer/webgl/pipelines/MultiPipeline.js) 以 `-displayOrigin + frame.x/y` 形成顶点位置。证明“存储裁小、显示仍用源坐标”有现成消费路径，不是迁移引擎建议，也没运行渲染。[一手：固定源码]
- **Unreal 范围：** [TexturePacker 的 Paper 2D 教程](https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-with-unreal-paper2d)明确 `.paper2dsprites` 携带坐标、尺寸、pivot，由 Paper 2D 导入；源在 Content 外时应重导入 sheet，单独 reimport texture 不够。本轮只核到供应方契约，未读受许可限制的 Epic 导入器完整源码，不能据此声称任意裁切／重排均安全；不把 Unity 的 Canvas 设置名套给 Unreal。[一手：供应方文档；研究：边界]

### 公开导出物：原尺寸与取样矩形确实不同

从 Phaser 示例仓库固定 [`775715264c0c27ef32d54dd38f5035eccfa02d08/public/assets/atlas/megaset-0.json`](https://github.com/phaserjs/examples/blob/775715264c0c27ef32d54dd38f5035eccfa02d08/public/assets/atlas/megaset-0.json) 下载并用 Python `json`／`hashlib` 解析：20,644 bytes，SHA-256 `088871c0fa0018548499bf890ba3266b89c16e696951815d3e5ea9c6a5382843`，91 条 frame，其中 10 条 `trimmed=true`。`rain` 的取样矩形为 `(272,434,14,14)`，原画布 `17×17`，裁后内容在原画布的 `(2,3)`，pivot `(0.5,0.5)`。在未翻转、原画布中心原点的条件下，对应局部左上角为 `(-6.5,-5.5)`，直接把 14×14 片段居中则为 `(-7,-7)`；两者不是同一位置。[一手：原始 JSON；研究：标准库解析／坐标算术，未验图像像素或动画质量]

复核只需读取该 JSON 的 frames、统计 trimmed，再取 filename 为 rain 的记录；本例没有调用上游代码。示例用于说明字段语义，不把仓库内不同来源美术视为已清商用授权，未复制或推荐其图片。[研究]

### 历史维护反例：同一像素不等于同一源位置

不同使用者的 [Aseprite #2600](https://github.com/aseprite/aseprite/issues/2600)（1.2.25、2020）及 [#3168](https://github.com/aseprite/aseprite/issues/3168)（2022）报告 linked cels／split layers／trim 的 JSON 坐标错误；后者原帖两帧同用 12×14 取样区域，却出现不一致的 `spriteSourceSize`。维护者确认复现，#3168 按重复问题关闭，并非那时已经修复。[一手：作者原帖与维护者回应]

最终关闭关联的 [`b70a29269d63449db3de9d0bddc4d9907c9f42c3`](https://github.com/aseprite/aseprite/commit/b70a29269d63449db3de9d0bddc4d9907c9f42c3) 修改 `doc_exporter.cpp`：linked sample 复用时同时保存 trimmed bounds，并调整布局对 linked／duplicate 的处理。这是历史修复证据，不宣称当前 Aseprite 仍有该问题，也没有重新编译复现。[一手：固定补丁]

**采用与撤回：** 第二版改变武器范围／透明边后，复用已验证的源画布与 pivot 消费路径，比较同动作的源位置；若消费者丢失偏移、尺寸语义变了或原坐标已不可恢复，撤回这次裁切配置，改用共同画布／union bounds。新姿态本身画错仍须换内容；帧身份、时序与 GUID 的另一层问题沿用 [WP9](2026-10-14-game-wp9-engine-handoff.md#12-官方技能仍不能识别这一格代表谁)，不因坐标正确就自动通过。[经验]

## 12. 压缩二改：静帧误差更小，动画仍可能更闪

核实：2026-10-15 UTC。[研究] §11解决裁切坐标，本节处理内容与坐标都正确、最终纹理编码却损伤移动画面的情况；不重讲生成质量、图集padding或帧身份。改变的是按资产类别选择编码，而非统一降分辨率、重生画作或全局关闭压缩。

### 两位开发者的实际修改与撤回

| 一手依据 | 实际选择 | 可借与不可泛化 |
|---|---|---|
| Joost van Dongen，[Texture formats for 2D games, part 3](https://joostdevblog.blogspot.com/2015/11/texture-formats-for-2d-games-part-3-dxt.html)，2015-11-21；涉及 Awesomenauts 与 Swords & Soldiers II | 作者报告自制DXT编码器稍减静态伪影，却增加动画闪烁，因此弃用；Awesomenauts另以略高源分辨率缓解细描边失真，渐变保留高保真例外 | [研究] 静态误差改善不能证明整段更好。可比较现成编码与局部例外，不复制自制编码器或照抄放大倍数；历史设备支持表不作为当前平台结论 |
| posila，[Factorio FFF-281](https://www.factorio.com/blog/post/fff-281)，2019-02-08 | BC3动画出现块噪声，早期因画质与启动成本把压缩限于混合层；作者明确说Ronimo提高源分辨率的补救不适合其画风。后来改用YCoCg-DXT＋独立alpha，GUI与影子仍分开处理 | [研究] 说明同一补救会因内容失效，支持按类别重选；不推出“2D不能压缩”。不把其自研加载／压缩链移植到商用引擎，也不把历史性能数字当本项目收益 |

[研究] 这些是不同作者、画风与玩法中的真实取舍，不是当前所有格式的排名。压缩导致的帧间噪声与源动作抖动也不能混为一谈：同样尺寸、滤波与播放条件下，无压缩对照仍抖，就先回查内容或采样，不继续调编码器。作者所称改善只属于其项目；本轮未播放嵌入视频或复现实验。

### 原生方案：验最终纹理，不只验源PNG

- **Unity 6.3。** [GPU格式说明](https://docs.unity3d.com/6000.3/Documentation/Manual/texture-compression-fundamentals.html)区分源文件与GPU格式；不支持的格式可能解压并同时占用额外副本。Crunch先在CPU解到DXT／ETC再上传，不能凭包体缩小推断GPU驻留也下降。[Sprite Atlas设置](https://docs.unity.com/en-us/engine/6000.3/manual/unity2d/sprite/atlas/sprite-atlas-reference)有自身Format、Compression与逐平台配置。[一手] [研究] 先检查最终Atlas，不能只改源Sprite导入设置就宣布修好；需要质量例外时再评估分组，不为每张图单建图集
- **UE 5.8。** [Texture Asset Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine)提供 `Editor Show Final Encode`；Fast通常用于迭代、Final可用于cook，修改已有Final纹理可能回到Fast；重新导入还会更新编码SDK版本。RDO Lambda取舍的是分发大小与画质，不是GPU内存。[一手] [研究] 二改先确认正在看哪种编码，沿原生每纹理／组设置检查发行结果；不把默认预览当最终编码，也不把调高RDO压缩量称为省显存

[研究] 少量不压缩或高保真例外是可选结果，不是默认全关。图集拆分还会改变打包、驻留与合批机会，需要结合实际共用范围判断；不能声称拆分必省内存或必增每帧draw call。提高源分辨率会增加像素量和处理成本，若需要人工重描才合格，超出无美术修补前提，应换合适素材或缩小外观目标。

### 下一次修改与停止条件

[研究] 保留批准的源图和导入设置。下一版给同一角色增加细描边附件／衣色或动作帧，重打图集后，以相同背景、目标尺寸和实际播放缩放比较旧／新动作的最终编码。分开记录发行包体、最终纹理占用、编码等待与画面质量；不要同时改变分辨率、滤波和格式后再凭一个数字归因。AI可整理实际格式、资源大小和导入差异，人判断整段噪声、轮廓辨识与风格。

[研究] 没有可辨失真且预算满足就沿用现有设置；只为受损类别试目标设备支持的另一格式、有限分辨率调整或无压缩例外，保留其余合格资源。不为理论完整改所有编码、引入新压缩库或自建框架。

**实际范围与许可：** 已读两位作者原文及两引擎官方文档，未运行游戏、引擎、编码器或生成模型，未测体验与性能。仅引用观点和接口，不复制游戏美术或编码器实现；文章公开可读不等于可再发行其资产，没有新增代码依赖。

## 13. 瓦片生产链：连接图组与中心变体分开修改

核实时间：2026-10-16（UTC+8）。[研究] 本节改变的是“新增装饰差异要不要重做整套连接图组”：连接轮廓不变时，先只补中心变体；已有符合布局的源图再评估现成组合器。它补充公开工程修改过程，不补足零手修生产率或主动工时。

**许可先行。** [一手] Mindustry 固定版本的 [LICENSE](https://github.com/Anuken/Mindustry/blob/2bdf2f39f838407be1bd237e3a7fe458b9f6c26e/LICENSE) 是 GPL-3.0；其 ImageTileGenerator 标明移植自 GglLfr/tile-gen，原工具的[固定许可](https://github.com/GglLfr/tile-gen/blob/9ea41647d2c28f6cd8b95f8a4fd12a0b38143cf1/LICENSE)为 Apache-2.0。[研究] 这里只借机制，不复制代码或图像，不把原工具许可套到游戏移植版；也未核这些游戏美术的独立宽松授权。若采用现成工具，仍核具体版本、依赖及输入素材权利。

### 从复用到后续修改的可追踪链

- **把现成组合方式接进生产。** [一手] [2025-06-10 提交 e5c745e](https://github.com/Anuken/Mindustry/commit/e5c745ee16b932a826f11be29eadb40938cd541f)新增 Java 移植及打包调用；输入须为边长可被4整除的正方形，并符合约定布局，程序组合后输出47个编号切片。[研究] 尺寸符合只是入口条件，不代表任意无缝纹理都能转成正确图组
- **需求从地板扩到墙。** [一手] [2025-07-10 提交 4790c80](https://github.com/Anuken/Mindustry/commit/4790c8013b64ea84018d0ee1adda4b459a6ea8cf)把生成范围扩到 StaticWall，运行时将8邻域的256种掩码映射为47种图块，并为预览生成代表图。此时墙的普通随机变体尚不支持；不是直接把一张漂亮地板复制成墙
- **增加内容，只扩需要的变化。** [一手] [2025-08-23 提交 42fb6b7](https://github.com/Anuken/Mindustry/commit/42fb6b7a722ccfe71301cdfcdcb41a8286042398)同时加入三种金属墙的源图、独立预览、内容定义及中心变体消费；metal-wall-2 配两个中心变体，只有八邻居全连接（掩码255映到中心索引13）才随机选择，其余继续用原边缘图组。新 metal-tiles-13 配六个中心变体。[研究] 源图增删可查，但删除文件不证明淘汰原因，也没有全部美术尝试或制作工时
- **公开采用仍有后续缺陷。** [一手] [v151 官方说明](https://github.com/Anuken/Mindustry/releases/tag/v151)列出新增三种环境金属墙与一种地板，并明确是 Beta／Pre-release。[2025-08-25 提交 2bdf2f3](https://github.com/Anuken/Mindustry/commit/2bdf2f39f838407be1bd237e3a7fe458b9f6c26e)随后修复金属墙小地图变黑：旧条件在已有独立预览图时，也跳过了把代表像素存入 `gens`；修复保留不覆盖已有预览图，但仍填充首个变体的代表像素。[研究] 公开 Beta 采用不等于稳定发行质量认证，地图中的资源与派生预览／颜色须分别检查

### 处理范围、下一次修改与停止条件

[一手] 在固定 `2bdf2f3` 树中，[ImageTileGenerator](https://github.com/Anuken/Mindustry/blob/2bdf2f39f838407be1bd237e3a7fe458b9f6c26e/tools/src/mindustry/tools/ImageTileGenerator.java#L16-L60)列出输入约束与全部47项输出；[打包脚本](https://github.com/Anuken/Mindustry/blob/2bdf2f39f838407be1bd237e3a7fe458b9f6c26e/tools/build.gradle#L123-L186)先清理工作输出、复制源图、生成，再打普通与 fallback 图集。生成器移除的是工作输出中的原始 autotile 副本，不是作者源图。[StaticWall](https://github.com/Anuken/Mindustry/blob/2bdf2f39f838407be1bd237e3a7fe458b9f6c26e/core/src/mindustry/world/blocks/environment/StaticWall.java#L40-L55)按连接结果决定是否使用中心变体；[Blocks 定义](https://github.com/Anuken/Mindustry/blob/2bdf2f39f838407be1bd237e3a7fe458b9f6c26e/core/src/mindustry/content/Blocks.java#L913-L941)落实到具体资源。

[研究] 下一次增加破损／装饰版时，若边缘不变，沿现有规则只替中心；若轮廓、转角或跨材质连接改变，补相应源块及规则，不能让中心变体代替新拓扑。保留合格源图，检查整套邻接及项目实际使用的预览、地图色等派生产物；没有这些消费面就不额外建设。所需源块不存在或只能靠手绘补齐时，换来源／缩小需求，不反复重生整套。

**验证边界：** [研究] 已读固定源码、提交差异及官方发布说明；未运行生成器、游戏或引擎，未清点实际打包产物、视觉验收47个切片或验证生成成功率。输入源图如何绘制、全部淘汰样本及主动工时仍未知。上述单项目证据只支持局部变体与派生产物的修改边界，不证明 Unity／Unreal 可直接消费该格式，也不建议移植整套游戏管线。

## 14. 透明边交接：输入纹理不等于混合输出

核实时间：2026-10-16（UTC+8）。**[研究] 改变的选择：源图合格、换导出／导入／shader后才出现边缘异常时，先修消费约定，不先淘汰素材、硬化alpha或盲目扩边。** 既有§4的mask与滤波检查仍保留；PNG带透明通道本身不能说明整条消费链采用何种约定。

### 一次有解决回执的消费者替换

[Spine官方论坛原帖](https://esotericsoftware.com/forum/d/13927-urp-2d-custom-shader-graph)中，使用者报告同一图集用Spine Skeleton Lit正常，换Unity URP自定义Shader Graph后出现黑轮廓。维护者Harald指出导出为PMA、消费者约定不匹配，给出改导出或适配shader两条路线；使用者明确回复改成straight alpha导出解决了问题。[一手：维护者诊断与使用者回执] 这是单次历史兼容案例，不证明今天所有Shader Graph都会出错，也不说明所有黑边都由PMA造成；其价值是已有合格图无需重新生成。

### 两引擎分别核对，先区分输入与输出

- **Unity 6.0。** [Blend参考](https://docs.unity3d.com/6000.0/Documentation/Manual/SL-Blend.html)说明混合消费的是fragment shader的输出；[混合类型](https://docs.unity3d.com/6000.0/Documentation/Manual/writing-shader-blending-modes.html)区分`SrcAlpha OneMinusSrcAlpha`与`One OneMinusSrcAlpha`。[一手] 因而不能只看Blend猜纹理编码：[Spine渲染文档](https://esotericsoftware.com/spine-unity-rendering)展示`Spine/Skeleton`保持PMA混合，启用`Straight Alpha Texture`时才在采样后把RGB乘alpha。[一手] 输入、shader内部转换、最终混合三处须合起来看，避免乘两次或漏乘。[研究]
- **Unity导入与颜色空间。** [6.0 Sprite导入参考](https://docs.unity3d.com/6000.0/Documentation/Manual/texture-type-sprite.html)把sRGB、Alpha Source与RGB dilation列为不同选项；[alphaIsTransparency API](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/TextureImporter-alphaIsTransparency.html)明确该选项改变全透明区域的颜色数据。[一手] [Spine导出／导入指南](https://esotericsoftware.com/spine-unity-assets)给出成套配置，且其在Gamma空间预乘的导出纹理不支持该runtime的Linear工作流，须用straight路径。[一手] 这是具体生产者／runtime限制，不可写成所有线性渲染都不能预乘；也不能为修一件素材擅自切换全项目颜色空间。优先沿现有项目选择兼容导出及材质输入配置，不把Spine专用勾选推广成所有Unity纹理默认值。[研究]
- **Unreal 5.6。** [官方Blend Modes](https://dev.epicgames.com/documentation/en-us/unreal-engine/material-blend-modes-in-unreal-engine?application_version=5.6)分别列`Translucent`为源颜色乘Opacity后叠背景，`AlphaComposite`为源颜色直接叠加背景乘一减Opacity。[一手] 对普通半透明图像，这要求核材质输出的颜色是否已按预期预乘；仅换Blend Mode、不核材质图内部转换，并不能保证正确。[研究] [同版Texture Asset Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine?application_version=5.6)另列sRGB及Source Color Settings，包含源编码与颜色空间。[一手] 因而须连同源编码核对，不把Unity／Spine的sRGB或扩边配置照搬到UE，也不把Masked的二值裁切当柔边修复。[研究]

### 缩小后变稀或串色：先选处理位置

补核：2026-10-17（UTC+8）。[研究] 近看合格、缩小才失真时，先定位实际消费方式，避免重新生成同样会被导入破坏的图。

- **二值裁切先比较原生保覆盖 mip。** [Unity 6.3 Default 纹理](https://docs.unity3d.com/6000.3/Documentation/Manual/texture-type-default.html)在 Generate Mipmap 下提供 Preserve Coverage／Alpha Cutoff；[alphaTestReferenceValue](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/TextureImporter-alphaTestReferenceValue.html)明确要求参考值与实际 alpha test 的 cutoff 匹配。[UE 5.8 Texture Asset Editor](https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine?application_version=5.8)须开启 Do Scale Mips for Alpha Coverage 才采用阈值，阈值按 RGBA 通道指定，0 禁用该通道。[一手] 由实际 mask 通道与材质裁切约定决定参数；不把文档示例范围当通用阈值，也不把其余数据通道一起缩放。[研究]
- **源纹理设置不等于图集产物。** [Unity 6.3 Sprite Atlas](https://docs.unity3d.com/6000.3/Documentation/Manual/sprite/atlas/sprite-atlas-reference.html)另有 Generate Mip Maps、Alpha Dilation、Padding 和最终平台格式。[一手] 上述 Default 导入契约不证明 Sprite Atlas 自动保留源图的 coverage 处理；走图集时核打包后的 mip 与材质，不只验源图勾选。[研究]
- **串色先查打包，再按缩放范围调整。** [Mikola Lysenko 的实现与演示](https://0fps.net/2013/07/09/texture-atlases-wrapping-and-mip-mapping/)区分整 atlas 生成 mip 的邻块污染与重复 UV 的 LOD 选择错误，并展示逐 tile 生成 mip 的处理。[一手：历史实现] 基础级间距也随 mip 缩小，固定 padding 不是任意远距保证；先比较重打包／按使用尺度分组，已有成熟逐块 mip 消费链才采用，不为此默认自建渲染器。[研究] 该文的旧平台限制不作当前设备能力依据。
- **先排工具回归。** [Unity UUM-130958](https://issuetracker.unity.com/issues/11900/artifacts-appear-on-sprites-when-generating-a-sprite-atlas-with-padding-set-to-2)记录 Padding=2 的伪影，复现于 6000.3.2f1、6000.4.0a1／b2、6000.5.0a3，未复现于 6000.0.64f1、6000.3.0a6；修复版本列 6000.3.13f1、6000.4.0f1、6000.5.0a6。回退后仍须重新生成图集才能清除该产物。[一手：缺陷记录] 仅测 macOS 26.1／M1 Pro，其他 padding 不复现；这是核版本与重打包的依据，不是统一改变 padding 的建议。[研究]

**反例：比例保住，形状仍可能不合格。** [Castaño 的保覆盖方法](https://www.ludicon.com/castano/blog/articles/computing-alpha-mipmaps/)以通过裁切的像素比例为目标；[Lisyarus 2025-01-05 开发记录](https://lisyarus.github.io/blog/posts/exploring-ways-to-mipmap-alpha-tested-textures.html)给出自有实现和三种纹理的逐 mip 对照，发现保比例会填洞却牺牲细结构，不适合其强调外轮廓的风格。[一手：作者实现／图例] 这不是 Unity／UE 原生功能的失败实测；它说明验收还要看关键轮廓。目标尺寸下仍无法识别，就比较程序化简化后的轮廓、另一来源或缩小表现需求，不无限提高 alpha。[研究]

**软透明、UI 与像素风另选。** [Unity 6.3 mipmap 说明](https://docs.unity3d.com/6000.3/Documentation/Manual/texture-mipmaps-introduction.html)指出原分辨率且不缩放的 UI 不获益，mip 增加约 33% 容量。[一手] 这类 UI 可不生成 mip；需远近缩放或斜视的世界资产不能照搬。像素风名称本身不决定开关，按最终像素尺度与相机范围选择；柔边透明仍检查混合、透明区 RGB 和过滤，不采用二值裁切的保覆盖作为通用修复。[研究]

### 采用、撤回与第二次修改

[研究] 保留合格源图及正确的导出／导入／材质组合，在相同尺寸与深浅背景定位异常。确认错配就恢复匹配组合；换装重导出、换材质或升级导入器后重验整条链。约定一致后按上述分支验最终产物，复核透明区RGB与§12压缩。源内容的缺肢、漏洞、错误轮廓仍按原条件淘汰／换源；别为保柔边改硬alpha，halo也不都来自混合。

**验证与许可边界：** [研究] 仅阅读版本化引擎文档、生产者文档、开发者原文中的实现说明／实验报告与公开问题回执，未运行shader、引擎、模型或图像处理，未证明目标设备视觉效果及工时收益。Spine仅为真实生产者／消费者案例，不要求购买、安装或接入其runtime；未复制代码或资产，不新增依赖。

## 15. 规则几何小道具：从重生成换到代码母版

核实：2026-10-16（UTC+8）。**[研究] 改变的选择：合法现成资产仍优先；固定视角、轮廓可由简单几何表达的小道具，生成反复画错结构时可比较代码绘制母版，不默认继续重抽。** 只增加这条条件选项，不给整套工具／资产商业采用评级，也不把代码绘图扩成通用美术方案。

### 一条有拒绝样本与实际消费者的制作链

本节固定 `johnmwhitman/solreign@d3628c68351a18e566b1f9f81672e35bbe112692`。[README](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/README.md)将公开内容说明为来自2026-08-15源版本的历史内容包快照，不含完整原始开发历史，也不是部署操作。[一手] 以下制作记录、源码和产物来自同一项目，不能算独立第二案例；当前线上是否仍用这些文件未核。[研究]

1. **先生成，技术通过后仍撤回。** [Wave 3a记录](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/docs/receipts/wave3a/LICENSE-REGEN-WAVE3A-2026-07-15.md)注明 MiniMax `image-01` 生成主体、代码派生持握图；后补审查撤回 powersink，理由是机柜被画成不同物体。文件规格、状态名、linter及地图加载通过不能证明物体语义正确，所述测试结果仅为作者报告。[一手／研究]
2. **更换母版来源。** [Wave 6记录](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/docs/receipts/wave6/LICENSE-REGEN-WAVE6-2026-07-16.md)与[绘图源码](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/docs/receipts/wave6/draw_powersink.py)报告跨两条工作线三次拒绝后，改用 Pillow／ImageDraw 从空画布绘制正面机柜。源码用矩形、线段、点和重复线圈形成主体，再调用既有持握排列；没有把失败生成图修成母版。这是源码静态核对，未执行绘图／派生脚本。[一手／研究]
3. **有产物进入消费者。** [PowerSink原型](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/Resources/Prototypes/Entities/Objects/Power/powersink.yml)的 Sprite 指向 `Objects/Power/powersink.rsi`、state为`powersink`；对应[sidecar](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/Resources/Textures/Objects/Power/powersink.rsi/meta.json)另声明左右手各4方向。本轮读取制作目录与实际Resources目录三对PNG的原始字节，各对的长度、尺寸与SHA-256一致；不是只根据作者“完成”字样推采用。[一手／研究]

### 独立核对到哪一步

[研究] 在同一固定树，比较 `docs/receipts/wave6/powersink-proc/` 与 `Resources/Textures/Objects/Power/powersink.rsi/` 的同名文件；Python标准库只读取PNG头、字节长度与SHA-256，没有调用上游代码：

| 文件 | 两份文件共同的尺寸／字节数 | 两份文件共同的SHA-256 |
|---|---|---|
| `powersink.png` | 32×32／569 | `d36cf55bce9329a00dd54b069d8344d53cecaa7a570af0a145ea8976ff96cc2d` |
| `inhand-left.png` | 64×64／763 | `21e765f225fc96a0374d4a75728d40658ce83dd3e71ae40b79af86ba48720acb` |
| `inhand-right.png` | 64×64／805 | `6d455b0465959818d64a578c366b6401b1a04776ce458042a298f66e325e4912` |

本轮还确认[保留候选目录](https://github.com/johnmwhitman/solreign/tree/d3628c68351a18e566b1f9f81672e35bbe112692/docs/receipts/wave3a/wave3a-gen/powersink)中三个`*_32.png`确为32×32且字节不同，并查看[前后／持握联系表](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/docs/receipts/wave6/CONTACT-powersink.png)。三张保留候选不等于所有失败尝试，也不能与作者所述跨工作线“三次拒绝”直接一一对应；联系表展示不替代游戏内实际尺寸、背景、遮挡和持握验收。[研究]

### 采用条件、处理负担与许可

**[经验] 只在已有风格容得下这种表示时试。** 正面机柜的部件、对称与重复能直接写成几何；代码仍硬编码了该物体的坐标、配色和比例，不能把这部分创作劳动记成零。第二次改线圈数、屏幕尺寸或配色时可先修改母版源，再重查主体与派生图；这是待验证用例，公开材料未给出两轮新需求对照。若变成复杂有机轮廓、新视角或需人工绘补，换资源来源／缩需求，不无限增加绘图规则。

[研究] **成本与版本不闭合。** 未取得可比主动工时、完整返工总成本或同题通过率，不能推导代码路线更便宜／更快；旧记录的`image-01`不是当前模型能力证明，实际服务修订和Pillow精确版本未核。来源切换后的样本存在，只支持有此生产选择，不证明全部工作均满足无人工美术修补或商业发行质量。

[一手／研究] **特定sidecar与整包许可分开。** 上述powersink的`meta.json`声明CC0-1.0，绘图脚本称从代码新建；这不等于本仓独立认定完整权利链。公开快照的[许可表](https://github.com/johnmwhitman/solreign/blob/d3628c68351a18e566b1f9f81672e35bbe112692/LICENSES.md)明确仍含上游NC资源，部分原创资产在没有更宽sidecar时默认CC-BY-NC-SA 4.0，不能把项目清理宣传或代码MIT当作整包可商用。本文只提炼机制及引用来源，不复制资产／代码，不新增依赖，也不推荐复用该资源包。

**实际范围：** [研究] 公开作者记录、固定源码、PNG字节与联系表阅读；没有运行模型、绘图脚本、游戏或引擎，未安装／付费，未验证当前部署、设备表现或成本收益。

### P33：组合语法本身就是物料时，先派生整族表现

**不要先给每种合法组合生成一张图，再反向补玩法语义。** 2026-10-20 补核：若形状、象限、颜色和层次就是玩家加工的对象，可先评估由同一结构派生整族表现；这与上面的“单件机柜反复生成失败后换代码母版”不同。有限现成图组已经覆盖需求时仍先复用，装饰性插画不必强行变成参数系统。[源码／研究]

**本例只覆盖 shapez 的形状物料族，不覆盖整款游戏。** 固定发行树 [1.2.0／366a2a9f](https://github.com/tobspr-games/shapez.io/tree/366a2a9f58c79a1b11a8275a6eae88f101101598) 的 `ShapeDefinition` 用四种几何原语、颜色和层次绘制，不逐件读取形状 PNG；机器、蓝图、UI 等仍使用美术资产。只提炼表示与消费者机制，不采用其自研引擎，也不把历史 GPLv3 实现当可直接复制的资产包；当前原仓 README 说明已不积极维护，生产选型不能只看源码公开。[源码：[定义与绘制](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/src/js/game/shape_definition.js)、[原仓说明](https://github.com/tobspr-games/shapez.io)]

**权威是结构短码，不是截图或文件哈希。** 源码虽命名 `getHash()`，这里得到的是表示形状／颜色／层次的短码；显示、加工与保存不能各自重新猜一个身份。下表是固定树的源码接线，不是执行后的回执。[源码]

| 消费者 | 同一表示怎样到达它；二改应保什么 |
|---|---|
| 绘制与复制 | ShapeDefinition 从短码恢复层／象限，再绘制；ShapeItem 的复制码、序列化、相等判断与绘制委托同一 definition；新图像不能替代结构身份 |
| 加工与缓存 | ShapeDefinitionManager 的 paint4 键含输入短码和四颜色，按结果身份登记；改运算必须核输出、象限映射和缓存，不只是颜色好看 |
| 交付与升级目标 | HubGoals 按短码累计 storedShapes，目标也由短码解析；升级按所需形状键扣数，不能因视觉相似就视为同物料 |
| 储存与运输 | Storage 按两个 definition 的短码相等决定能否同仓，storedItem 走 typeItemSingleton；输送带路径保存距离和同一物料序列化，恢复须仍能解析旧码 |

固定消费者：[输送带](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/src/js/game/belt_path.js)、[ShapeItem](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/src/js/game/items/shape_item.js)、[manager](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/src/js/game/shape_definition_manager.js)、[目标](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/src/js/game/hub_goals.js)、[storage](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/src/js/game/components/storage.js)、[resolver](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/src/js/game/item_resolver.js)。[源码]

**第一轮扩加工能力，复用的是形状族，不是所有制作成本。** [2020-05-16 cad6b357](https://github.com/tobspr-games/shapez.io/commit/cad6b357e3080f7fe8aca8ed45cc4037e36bbeae)增加四分切割和四象限涂色，父版本为 bce44188c816582d052590bb74ce42d5d2cb2447。改 definition 运算、manager 缓存、处理器、机器槽位和速度，仍输出 ShapeItem；未为每种结果新增形状图片。但提交同时新增四个机器／蓝图 PNG，并重建图集，不能记成整项功能零美术。[源码：差异及文件元数据，未取图像]

**第二轮改变输入约束，旧表示仍可用，但控制规则不能照旧。** [2020-08-29 PR607](https://github.com/tobspr-games/shapez.io/pull/607)／5487ec981828e143b62b0e2281cf97244009a143 让缺象限不必等涂料，并加入线控禁用／筛选；`colors[q] || item.color`让不涂的象限保原色。作者只报告检查两个基本形状并要求 alpha 广测，不是完整行为验收。[源码／作者报告]

**同轮又改过的规则，不能用祖先关系冒充发行行为。** [bb739c80](https://github.com/tobspr-games/shapez.io/commit/bb739c80fa5b6fc34a9047a50fb7322b044f62dc)将 true 从禁用反转为启用、全禁用不加工，并重做输入接收、状态提示与机器图片；[238b08d4](https://github.com/tobspr-games/shapez.io/commit/238b08d4d1ac9f1d6c759fa0c82a25cfb8be4ec7)再将非布尔物料纳入 truthy。1.2.0 的实际处理器应单独读取，不能把 PR607 原文当最终规格；这些是第二轮内修订，不另算两次独立发行。[源码]

**两轮没有改变短码文法，不能据此声称已经验证过存档迁移。** 新运算与输入规则改变了代码、机器拓扑和提示，通用形状绘制与物料身份仍复用；不是所有文件都未变。真正改原语、短码解释或层次含义时，才须另核旧目标、保存键、复制码、缓存和恢复策略，不能只更新渲染器。[源码／研究]

**“可编码的修复”也可能应撤回。** [PR352](https://github.com/tobspr-games/shapez.io/pull/352)试图保留切割后的空层；讨论者指出已有工厂可能需要调整，作者试用后不认可该行为，随后[撤回 94c59e0e](https://github.com/tobspr-games/shapez.io/commit/94c59e0e339c9b4013ef91d4820bb037c02bc51e)。这是规则取舍与兼容反例，不是本仓复现了坏档或全部工厂故障。AI 不应仅因结构更“正确”就自动改旧玩法。[作者讨论／源码／研究]

**有限符号集合已有合格图组，就不为几何外观自建生成器。** [Kenney Playing Cards Pack](https://kenney.nl/assets/playing-cards-pack)列270件、CC0；[作者发布页](https://opengameart.org/content/playing-cards-pack)提供多尺寸牌面和骰子静态图，作者对新增掷骰动画的请求回复尝试后质量未达收录标准。它不是 shapez 的替代包，而是反向条件：静态覆盖可以现成，新增运动仍可能缺源。未下载核包，不把页面宣称的矢量源视为已验证可编辑，也不据此推出代码动画更好。[一手／研究]

**把二改分三类，再决定是否换来源。** 语法内新实例先检查能否直接派生，不预设要新像素；新运算／输入规则保旧结构，核输出、消耗、暂停、信号及提示；超出原语的物种、表情、材质或动作则重新评估现成源／生成缺口，不无限扩几何规则。沿用本页尺寸、身份、动画、压缩、透明和目标设备检查，适用项不能被结构校验替代。[研究]

**源码中的校验不等于已有行为回归。** 固定树 package 没有 test 脚本，完整目录未找到 test 路径；[CI 定义](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/.github/workflows/ci.yml)运行 lint、tsc 与翻译构建。BeltPath 有开发态完整性检查，[SavegameSerializer](https://github.com/tobspr-games/shapez.io/blob/366a2a9f58c79a1b11a8275a6eae88f101101598/src/js/savegame/savegame_serializer.js)有 UID／组件校验并保存 hubGoals、entities、beltPaths；它们不能充当形状加工、短码往返或旧工厂兼容测试。后续需实际验证定义→短码→解析→物料→保存恢复，以及缺角／多层、信号门控、目标扣款、异形拒入仓和旧工厂行为；这些是待验收项，不报已通过。[源码／研究]

**AI 能核组合与消费者，不能替人决定可读性、规则和兼容承诺。** 本轮仅阅读历史源码、差异、发布与作者报告；无模型／引擎运行、图像下载或目标设备验证。未取得同条件主动工时、完整返工成本或 AI 贡献比例；本例支持先选择表示，不支持“全部成套资源已经零手修供应”。[研究]

## 换光向补研：彩色精灵要不要追补表面法线

核实：2026-10-18（UTC+8）。GA／GB，主线二／三。§2已有3D源输出PNG／normal的机制，本节不重复计案例；新增选择是已有彩色图是否值得追补法线，以及零手修条件下何时保留简化照明。[研究]

| 实际需求与输入 | 优先比较 | 代价与撤回条件 |
|---|---|---|
| 固定光向，或只需平面亮暗／颜色随灯变化 | 保已有表现或原生平面受光 | 不提供表面起伏；若体积变化本身是必要表现，再换来源 |
| 表面体积需响应光向 | 完整授权的配套颜色／法线资产；已有合格3D母版时同源成对输出 | 需额外纹理、对应关系和渲染预算；源形状／风格不合格不能靠法线补救 |
| 只有已画明暗的PNG | 限定内容上比较颜色梯度／轮廓参数化处理 | 颜色边界未必是几何；手绘输入或逐帧修补成为必要步骤就撤回本基准的零手修采用 |

以上是按输入条件作出的研究判断，不是质量或工时排名。法线记录方向，不生成隐藏几何、任意新视点或真实投影；同源3D路线沿§2已有源质量／许可与制作边界，不默认专业美术摆姿已经自动化。[研究]

### 自动生成之前，先数清仍由人提供的信息

[Moreira等2022原论文](https://arxiv.org/html/2212.09692v1)§III–V是六类方法的小规模定性比较：颜色Sobel会把已画明暗误作凹凸；DeepNormals实验实际使用手绘轮廓输入，结果仍缺清晰内部形状。作者也保留纹理型图案、符合倒角形状的自动处理适用性。它支持输入歧义与候选边界，不代表2026模型排名或所有精灵必然失败；论文固定光源图片也不替代移动光源验收。[一手／研究]

[SpriteIlluminator厂商教程](https://www.codeandweb.com/spriteilluminator/tutorials/normal-map-painting-with-spriteilluminator)的壁虎先减少原图阴影／高光，再做两次bevel，最后用结构笔刷涂背与尾部。完整流程含人工美术，不能只截“生成法线”一步证明零手修。这里以作者公开步骤作反例，不推荐购买、不复用其Shutterstock示例图，也不新增工具依赖。[一手／研究]

据此不把“亮度有差异”直接解释为高度；对圆鼓轮廓或本就容许随机细节的源，可做受限参数候选，但预先保存原表现，按目标尺寸比较。只有素材缺失时才评估生成，不能为了迁就新灯光把已合格动画整套重新抽取；如需修改源色中的固化明暗，也计入实际输入制作成本。[研究]

### 引擎消费条件分开核，不给统一安装配方

- **Unity 6.3 URP：** [Secondary Textures](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/SecondaryTextures.html)要求副纹理与颜色共享UV并对齐、材质支持对应贴图、Light 2D启用normal选项；法线为数据而非sRGB颜色。文档明确增加按layer batch的全尺寸RT深度预通道，不能只算多一张纹理。[Light 2D](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/2DLightProperties.html#normal-maps)的Normal Map Distance改变光源与受光精灵的计算距离，不移动光源或改变强度；该参数不是资产几何修复。[一手／研究]
- **UE 5.8 Paper2D：** [导入设置](https://dev.epicgames.com/documentation/en-us/unreal-engine/paper2d-import-settings-in-the-unreal-engine-project-settings)提供normal后缀关联查找；[Sprite材质](https://dev.epicgames.com/documentation/en-us/unreal-engine/paper-2d-sprite-material-in-unreal-engine)区分Lit／Unlit与遮罩／半透明；[Paper2D API](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Paper2D)说明SpriteTextureSampler可消费SourceTexture或AdditionalSourceTextures。只证明这些入口存在，仍需核实际材质如何消费法线和每帧附加纹理；没有证据支持“导入后缀找到图、选Lit即自动正确接线”。不复制Unity字段／成本结论到UE。[一手／研究]

### 二改与验证范围

换配色但不改体积时，不应由新颜色自动重定义凸凹；改姿势、装备或裁切／图集时，重新核颜色与法线的对应、帧序、透明边和左右翻转。新增移动光源后，在目标尺寸与正常动画速度下看整个动作，核旧阴影是否冲突、凹凸是否反转和关键轮廓是否仍清楚；再在获准目标设备阶段测额外渲染与纹理驻留。效果不值代价时，优先保平面照明／固定光向，而非继续增加手修步骤。[研究；验收未执行]

本轮只读论文、厂商过程和原生文档；未安装、下载模型、运行生成／渲染／Unity／UE或做视觉盲测。原论文的Godot实验属于作者历史报告；本文不把它算成本仓库实测，不声称零手修通过率、节省工时或GPU收益。[研究]

## 图标二改：绘画升级与已学标识分开决策

核实：2026-10-19（UTC+8）。**[研究] 改变的选择：图标提高绘画质量时，先判断它是否承担玩家已学会的稳定操作识别。** 保身份是有条件的建议；必要的身份改版应明确验收，新资产／占位图也不能仅凭类别免检。不改变合法现成资产优先或生成模型的条件首试排序。

**同作竞争与采用。** World of Claudecraft 的[背包改稿 #1837](https://github.com/levy-street/world-of-claudecraft/pull/1837)因程序袋子像占位，改为成套绘画；[物品改稿 #2301](https://github.com/levy-street/world-of-claudecraft/pull/2301)替换292个非武器程序图标，同时保留武器渲染缩略图。[一手] 这是按用途选择来源，不能推成生成总优于程序图，也未证明此前占位没有形成使用习惯。

**生成、拒绝与返工。** [v0.39 改稿 #3459](https://github.com/levy-street/world-of-claudecraft/pull/3459)增加宠物指令等图，并重绘58张旧技能。[“释放伙伴”记录](https://github.com/levy-street/world-of-claudecraft/blob/f48c7a3a9b432f690e03a0b5ad94fbd357fd43ad/docs/achievements/release-v039-icon-art-second-pass-2026-08-16/legacy-druid-hunter.json)称首图在128px语义正确，远处整狼与前景手掌缩至16px却失读，遂重生为近景掌、狼肩和松开的连接；失败原图未公开，此判断只属作者报告。[一手] 生成来源仅标作 OpenAI 内置图像生成，精确模型未知；[转换源码](https://github.com/levy-street/world-of-claudecraft/blob/f48c7a3a9b432f690e03a0b5ad94fbd357fd43ad/scripts/convert_skill_icons_webp.mjs)缩至128px并编码WebP，规格通过仍需实际任务验收。[研究]

**第二需求改变结果。** [#3509](https://github.com/levy-street/world-of-claudecraft/pull/3509)中维护者认为战斗余光识别依赖旧图色块／剪影，要求在生产发布前恢复58张旧技能，保留新宠物指令、光环等图。[一手：维护者判断] [release 合入 main 的树中说明](https://github.com/levy-street/world-of-claudecraft/blob/e56707a675013fc1a86bb19d31a0a8d79a02a197/docs/achievements/release-v039-icon-art-second-pass-2026-08-16/LEGACY-SKILLS-REVERTED.md)记录这一取舍；它不证明线上部署或玩家实测结果，发布PR正文仍列旧重绘也不能代表最终树。[研究] 全58张恢复是项目报告，本轮只独立核两个代表样本；不能把“保留的新图”概括为所有新图均安全。

**代表产物核对。** 本轮读取WebP原字节、计算SHA-256并查看防御姿态前后图；未运行上游脚本。[研究]
- `public/ui/skills/warrior/defensive_stance.webp`：重绘树 `f48c7a3` 为 `82d494e2eaec84d574b763fb47ba1186f016e47cd366567ca56e0d2e9c8f24a0`；恢复树 `45d4148` 与release合入树 `e56707a` 均为 `bbd61b9715851b9d392802cc4fcf153eb4d2ed97132667fbefd5a0733e5618cf`
- `public/ui/skills/pet/pet_attack.webp`：`e56707a` 为 `0c76dc1ae06ab0ce3fe4870ef57d5ae3f82f554a4aef3209e296066f0805df24`，与[首次采用记录](https://github.com/levy-street/world-of-claudecraft/blob/f48c7a3a9b432f690e03a0b5ad94fbd357fd43ad/docs/achievements/release-v039-icon-art-first-pass-2026-08-16/accepted-art.json)一致

[研究] 旧标识优先沿既有视觉身份改稿；必要的重设计仍可做，但需在目标尺寸与真实操作中判断辨识是否满足需求。色块／剪影是检查线索，不是充分兼容标准；也不照搬该项目对旧技能的全量冻结。

**权利与验证范围。** [CREDITS](https://github.com/levy-street/world-of-claudecraft/blob/45d4148c2199fb3e27f96a556acb7974f67a7e94/CREDITS.md)明确MIT只覆盖代码，CraftPix购买许可不转移，部分生成媒体仅限随项目使用或保留权利。[一手] 本节仅提炼机制，不推荐提取素材；生成来源不证明第三方IP清权。[研究] 多人项目的局部链不证明单人零手修完整发行；失败原图、精确模型、完整人工过程与主动工时未知，未运行模型／游戏／引擎或测通过率、净收益。
