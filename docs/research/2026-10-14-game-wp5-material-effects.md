主线：二／三／四；G1 材质、特效的选型、迭代与发行
改变的建议：[研究] 锁纹样二改先分“可编辑结构”和“shader 能表达”；清漆／积尘先比较原生分层，不因生成首图较好就整套重生。可取消技能优先复用／按运动重组，缺结构才评估原生粒子生成；装饰烟雾换镜头需要深度时先比较已有体积路径；保留参数复用、投影、重复采样及其他特效边界。
新证据：[一手／研究] 整页新增MaterialApprentice（2026-07）图编辑与Unity 6.3／VFX 17.3／UE 5.8烟花事件契约；P64已补 MultiMat v3、多瓣材质增强、StableMaterials v4 原文及实际发布范围，Adobe 位图包装图与 Unity 6.3 coat 成本。新增 ParticleGen（2026-08）与独立 KinemaFX（2025）原文条件比较；新增装饰烟雾改镜头比较：FieryGS、神经six-way与既有Smolder生产机制；保留固定源码和反例，未实测资产、性能或工时。
技能特效生产模块补核：2026-10-25（UTC+8）。只补参数驱动效果族与正常阶段接入会改变默认的官方契约缺口；复用 P64 三路比较、整招采用补核与可读性各节，未运行引擎或生成资产。

# WP5 材质与特效：共同参数源、运行时与生成边界

核实时间：2026-10-14（UTC+8）；参数复用补核于 10-16，三平面补核于 10-15，原动态事实表仍为 10-14。全文及各补研仅阅读公开文档／源码／论文／开发者记录；未安装软件、下载权重、模拟或生成资产、编译 shader 或运行 shader／GPU／模型／游戏引擎、购买服务、访问用户电脑或建立云任务。未做视觉／像素评审、试听或玩家实验；零手修通过率、识别率、设备性能与主动工时均未验证。来源的运行数字不属本仓库实测；离线检查不替代这些验证，hosted CI 未运行。正文见[材质与特效](../../domains/game-dev/assets/materials.md)，授权汇总见[WP1](2026-10-14-game-wp1-licensing.md)。

## P64：同表面二改的最高水平卡

核实：2026-10-21（UTC+8）。本单元只补材质，沿用[审计 A04](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#a04--材质与特效)的全页缺口；不把其 Smolder 特效摘要当材质冠军证据，也不重复改特效控制结论。[研究]

- **问题：** 固定同一近景木箱、UV、木纹、法线、镜头与设备预算，二改只增加清漆和边缘积尘；要求不手绘修纹样。比较的是这份需求，不是论文分数横排。[研究]
- **当前最高水平：未知。** 已读近期领先原文：Belouadi／Boubekeur／Kaiser 的 [MultiMat v3](https://arxiv.org/html/2509.22151v3)（2026-05-13）；Yu 等 NVIDIA／Cornell 的 [多瓣材质增强](https://arxiv.org/html/2606.14988v1)（2026-06-12，SIGGRAPH 2026）；Vecchio 的 [StableMaterials v4](https://arxiv.org/html/2406.09293v4)（2026-02-26）。它们分别推进图合成、反射表达与贴图生成；没有一项给出本题三路同输入、二改后设备预算内的联合排名。[一手／研究]
- **主流／可行层：** 已授权配套贴图与参数源，接引擎已有材质功能；免费路线沿用 Material Maker／指定 CC0 纹理，许可限制仍见下表。此处“主流”指制作路线，不声称市场占有率。[研究]
- **本仓推荐层：** 可落地默认，非最高质量冠军。保已验收结构，缺涂层先核消费端；独特初稿或图构建才引入生成候选。未核得 MultiMat 与多瓣增强的完整可商用交付包，不将论文可访问当部署许可。[研究]

### 哪些对照真正支持选择

**MultiMat 支持“生成可改图”的方向，不证明锁结构二改已解决。** 作者在 100 个留出材质上，与适配到同一 SBS 表示的 VLMaterial 比较；图像条件生成的 MultiMat (Graph) DreamSim 36.609 对 31.344（论文分数乘 100）。先按最高 DreamSim 从每输入每模型 40 个候选择优，再由 8 位专家评 33 个困难输入，不是一次生成的成功率。没有上述木箱二改、设备成本或主动工时对照。因此可优先研究图输出，但不能撤销现成参数源默认。[一手／研究：[§6](https://arxiv.org/html/2509.22151v3#S6)]

**多瓣增强给出单层 PBR 的反例，而非普通引擎即插即用方案。** 作者在 16 件资产、每件 16 视图上对照 TRELLIS.2；使用其 base color 的增强版本 LPIPS 为 0.0444，对照 0.0510。生成端从 5 个 seed 主观择优，参考材质本身是手工神经材质，不能当公平发行路线排名。输出需专用神经解码，不能塞进 roughness 槽；作者也报告灰尘细节变平和 UV 投影伪影。结论是先核反射模型，不是立即接入神经材质。[一手／研究：[§4–6](https://arxiv.org/html/2606.14988v1#S4)]

**StableMaterials 的首试优势不等于已发布二改工具。** 作者文本生成比较中，80 个文本条件生成样本的 CLIP 为 29.6，Sampler 为 24.9；这没有对照 Designer 参数图或保留旧纹样。2026-10-21 所读[作者模型卡](https://huggingface.co/gvecchio/StableMaterials)仍注明仅 base 512² LDM／LCM 已放出，refiner 与 inpainting 待发布。故不把论文的高分辨率／编辑结果写成现成完整供应；OpenRAIL 标签也不替代采用前逐项核许可。[一手／研究：[§4](https://arxiv.org/html/2406.09293v4#S4)]

### 同题取舍：同一结构不等于同一反射表达

[研究] 上述三个实验彼此不在同一基准，正文表是需求匹配判断，不是伪造的本仓 head-to-head。现成和参数图也不是默认胜者：缺失木纹结构可能须换源；仅有单层 BRDF 的输出无法因“图可编辑”就获得独立清漆层。这会把下一动作从“继续生成更精细贴图”改成“核原生 coat、质量收益与消费成本”。

- **现成位图与真正参数图分开。** Adobe 2026-09-21 的[从纹理建立图](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/working-with-3d-scenes/extracting-materials-values-and-textures)创建 Bitmap／Output 节点及打包通道拆分，不恢复木纹的生成参数。Agent 可包装和接线，不能声称从贴图找回原制作历史。[一手／研究]
- **现成参数源先于自造图。** Adobe 2026-09-08 的[Material Samples](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/creating-a-substance-graph/material-samples)提供可编辑示例；它是制作替代而非最高效果证明。若其结构不适合目标木纹，改用适配来源，而非为了“参数化”强行重建整个图。[一手／研究]
- **目标消费端决定保留哪些层。** Unity 6.3 [Complex Lit](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/shader-complex-lit.html)已有 coat；底层与涂层各需光照计算。本轮不沿用旧版文档“约两倍”去推算整帧成本。原生 coat 仍不等价覆盖研究的全部灰尘／绒毛反射，更不代表 Unreal 等其他引擎契约。[一手／研究]

[研究] 同一木箱的结构、涂层、积尘、零手修与设备成本仍需实测，条件默认不变；但它不是整页资料比较降差距的唯一前提。整页选择与未完成项见下节，不用缺实测替代对资料覆盖的判断。

## 整页收口：图编辑与烟花时序

核实：2026-10-22（UTC+8）。复用P64及本记录投影、参数复用、重复采样、覆盖、可读性、技能、烟雾和慢放来源；本次新增只补图编辑候选与烟花轨迹／爆点控制。正文13组选择覆盖全页，最高水平仍为分问题参照，未找到同预算全流程冠军。[研究]

### MaterialApprentice：可执行图不等于语义可改

UCSD的[MaterialApprentice v1](https://arxiv.org/html/2607.13318v1)（2026-07-14）§4.2、8.1–8.2及§15，为MultiMat之外的独立图编辑参照。它检索专家制作过程、合成步骤再编译成可执行Blender材质图，支持将缺图的需求纳入研究候选；已有成熟可调源仍先保留。[一手／研究]

- 17个材质的两项编辑各从同一初始图出发，不是连续两次需求修改。两位艺术家在六个材质、每材质四个语义编辑任务的设置下，最多三次尝试／五分钟，平均1分48秒；这不是无美术程序员的全部制作成本。[一手]
- 25个coarse与25个fine题的150名评者比较中，fine相对BlenderAlchemy获81%偏好。这不是17材质编辑题的合格率，也不是零手修发行率；同图表示消融G→G参数编辑次数8对10.7更少却偏好较低，不能声称所有指标都胜出。表2 CLIP方向标注有歧义，本页不据此排名。[一手／研究]
- 作者[固定代码6811f66](https://github.com/KunalMGupta/material-apprentice/tree/6811f6612ba6f868557a34df9b81e265439d190a)；仅将公开实现作为可核入口，未安装或执行。可执行图仍可能没有有意义的参数，不能据此保证UV、mask语义与原纹样保持；采用前另核完整代码、模型、输入与输出资格。[研究]

**本题决定：** 原有图与纹样满足时，局部改已知分支；缺少结构且愿承担候选淘汰／诊断时才评估图生成。原生coat能否表达与生成图是否好改是两道独立判断，具体涂层证据沿用上节。未有单人零手修成本／二改胜出证据。[研究]

### 烟花：独立改路径、爆裂与余烟，不能只改整片速度

**最高水平卡：** 问题是已合格烟花改路径／爆点时刻而保内部细节；近期领先候选ParticleGen（2026-08）与成熟原生事件／模拟烘焙比较。主流／可行层是固定演出保可分段编辑的模拟源重烘焙，运行时变化才由原生运动和事件承载结构、烘焙承载局部细节；本仓采用此条件默认，不称最高质量或时序保证。[研究]

- [Unity 6.3 Sub Emitters](https://docs.unity3d.com/6000.3/Documentation/Manual/PartSysSubEmitModule.html)：子发射器在父粒子位置触发；Death在父粒子死亡，Manual可由脚本触发。Collision／Death／Trigger／Manual的Bursts列表仅支持单个burst（Birth可有多项），不能据名义事件类型推成任意连续发射契约。[一手]
- [VFX Graph 17.3 Timeline](https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.3/manual/Timeline.html)：支持属性、事件与payload编排；反向运行需Simulate重模拟，有GPU峰值开销；scrub受Max Scrub Time限制。Timeline用于演出编排，不自动保证游戏命中／取消状态一致，更不代表可任意倒放缓存。[一手／研究]
- [UE5.8 Niagara Events](https://dev.epicgames.com/documentation/unreal-engine/events-and-event-handlers-in-niagara-effects-for-unreal-engine?lang=en-US)：Location／Death事件用于烟花例，需Persistent IDs；所述Event Handler事件链只在CPU模拟工作。此限定不外推为所有Niagara GPU通信都不支持；选GPU路径须核它自己的契约。[一手／研究]
- [ParticleGen §4–5](https://arxiv.org/html/2608.00629v1)：烟花中物理／空间复杂依赖仍是局限，性能优化属未来工作。75题与20位技术美术的样本边界沿用技能节，不重复计为新实验；原生结构生成不等于时点、轨迹与最坏并发合格。[一手／研究]

[研究] 固定演出不必为可控而重建；固定演出可回模拟源分别修改后重烘焙；新需求必须在运行时独立改时间／运动才迁移控制层。轨迹、爆点、余烟各自修改后仍需检查身份引用、取消、重用和设备成本。未运行轨迹实验或引擎，不承诺帧精确／确定性；全部尝试、接线、失败返工与资格计入总成本。

## P64：装饰烟雾二改风向、灯光与自由镜头

核实：2026-10-22（UTC+8）。主线二／三。**选择改变：固定视点的合格源仍保留；新镜头要求真实厚度时，不再把单卡重烘焙当默认终点，先比较目标引擎已有体积路径；预算不够收窄视点／质量。** 无引擎、模型或同资产实测；整页比较见前节。[研究]

### 最高水平卡与同题范围

- **问题：** 已验收的装饰烟柱保发射位置、目标设备和主体外观，第二次要求改风向、灯向或自由绕看；区分运动源、光照数据和空间表示。燃烧研究不证明烟花发射轨迹／爆裂时点。[研究]
- **当前最高水平未知。** 近期研究参照是北大／ByteDance Seed／智源的FieryGS（ICLR 2026，v1 2026-04-30）；专业生产参照是IO Interactive／Alexander Mueller的Smolder（SIGGRAPH 2026-07-21，讲义08-03更新）；独立且更贴近镜头问题的是LIGHTSPEED／上海交大／清华的Real-time Neural Six-way Lightmaps（v1 2026-04-04）。三者任务与预算不同，不能互排名。[一手／研究]
- **主流／可行基线：** 合格flipbook、可重烘焙模拟与目标引擎已有体积表示。推荐属于面向单人项目的条件首试顺序，不是最低工时或最佳画质实测。[研究]

### 决定性证据：保持源，不把视频精修当三维资产

**FieryGS。** [作者项目](https://pku-vcl-geometry.github.io/FieryGS/)与[论文§4、B.4、B.6](https://arxiv.org/html/2605.00177v1)：多视图场景重建后进行可控燃烧；六场景比较AutoVFX、Runway Gen-3 Alpha Turbo、Instruct-GS2GS。可选Wan2.1精修改善外观，也可能改变背景并损害时序／三维一致性。平均模拟及渲染2.37秒／帧（RTX4090D），不含离线场景重建与材质推理，不是实时游戏预算或完整制作成本。比较未覆盖本题合格flipbook、当前视频模型、alpha／循环或连续需求二改；不能宣称击败当代生成视频。[一手／研究]

[公开实现](https://github.com/PKU-VCL-Geometry/FieryGS)在2026-04发布，顶层[LICENSE](https://github.com/PKU-VCL-Geometry/FieryGS/blob/main/LICENSE)为Apache-2.0；包含CUDA rasterizer、分割权重及API推理依赖。未完成依赖／数据／权重整链商用审计，不给安装或发行推荐。制作成本还包括重建、参数判断、输出转换和淘汰；API单项价格不能代替合格游戏资产总成本。[一手／研究]

**神经six-way不是旧卡片自由绕看。** [Li等原文§4–6](https://arxiv.org/html/2604.03748v1)从三维密度按当前视点生成引导图，再推理方向光照图；展示UE移动镜头／灯光。实现依赖CUDA／TensorRT，512²光照图训练约60小时。性能节将速度求解4ms、密度平流11.5ms、引导图2ms、推理1.2ms分列，不能只引推理时间作总预算；Jet Flow另例的10ms不能混作同场结果。域外阴影仍失败，外部物体阴影为近似。它支持“需要深度时保三维输入”，不证明可直接部署插件或本题二改通过。[一手／研究]

**Smolder复用P51，不计新发现。** [官方讲义](https://advances.realtimerendering.com/s2026/content/AlexanderMueller_Smolder_Siggraph26.pdf)本次补读第28、34、52、54、62、102页讲者注释：早期粒子体积尝试成本／质量不合，转回采样式渲染；OpenVDB作源，NanoVDB在作者场景因寄存器压力不合，改专有运行时格式，增加开发成本。源端降采样提供设备分档，而非免费降低所有渲染成本。P51已核的降分辨率重影和不含异步阴影预算继续沿用，见[原记录](2026-10-15-exploration-evidence.md#p51讲义补读smolder不是通用降规格处方)。这里只读相关注释，未新增动态画质验证或全讲义审图。[一手／研究]

### 同题决定、成本与撤回

| 二改需求 | 当前默认与理由 | 维护／失败代价 |
|---|---|---|
| 只改灯向，视点近似仍成立 | 保合格源，先核six-way输出；不先重新生成RGB视频 | 光照通道、emission与alpha须对应；增加图集／采样不是增加几何 |
| 改风向，仍是固定镜头 | 改模拟源重烘焙；保稳定资产引用 | 重验循环、时序、投影与轮廓；体积缓存本身也不会实时改风 |
| 绕看厚烟，侧后方须有真实视差／穿插 | 撤回单卡默认；先比较已有体积路径，远景多片近似仍合格则可保留 | 流送、驻留、阴影、采样和合成一起计；不以磁盘压缩量代显存，不以专有演示代零手修可用 |
| 原运动合格，只缺独特外观 | 视频精修仅隔离候选；需要多视图则保三维源评估 | 背景／轮廓漂移、逐帧补边或复杂新依赖超过收益时撤回；不为风格默认自研神经渲染 |

[研究] 上表是机制推导，不是四路同预算对照。缺完整合格资产总成本、最低设备最坏并发、循环与第二次修改成功率；不报零手修通过率，也不以本局部覆盖取消整页差距。

### 引擎契约与验收边界

- **Unity：** [VFX Graph 17.3 six-way](https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.3/manual/six-way-lighting.html)支持URP／HDRP烘焙六方向光照混合。它证明2D粒子受光，不证明完整体积表示；本轮未核得与下述UE路径等价的通用原生导入契约，不写跨引擎通用安装方案。[一手／研究]
- **Unreal：** [UE5.8 Heterogeneous Volumes](https://dev.epicgames.com/documentation/unreal-engine/heterogeneous-volumes-in-unreal-engine?lang=en-US)可消费静态／动画SVT，文档仍标Experimental；[SVT](https://dev.epicgames.com/documentation/unreal-engine/sparse-volume-textures-in-unreal-engine?lang=en-US)存烘焙体积，流送不及时会降mip，阻塞等待可能伤帧率并跳帧。原生存在仅支持候选比较，不自动准许发行。[一手／研究]
- **撤回：** 新镜头的厚度／遮挡不合先换表示；表示成本不合则缩小体积、质量或视点范围。AI改参数／导出与引用，人判断风向、空间关系和可读性；不靠生成外观掩盖深度缺失。原许可、设备与二改通用检查全部保留。[研究]

## P64：可取消技能特效的三路比较

核实：2026-10-22（UTC+8）。主线二／三，补足原生模板与生成视频之间尚未展开的结构制作选择：现成效果先按运动／阶段重组，缺结构再评估可编辑粒子生成。正文保留材质二改及通用资产检查，不将这个局部比较代表整页。[研究]

### 最高水平卡与同题选择

- **问题：** 固定镜头、技能范围与设备预算，制作蓄力→释放；二改缩短蓄力并可取消，保主要运动与范围边界。本文没有执行该试验。[研究]
- **当前最高水平：未知。** 近期领先候选为 Zhuge 等／浙江大学等的 [ParticleGen v1](https://arxiv.org/html/2608.00629v1)，2026-08-01；它生成结构而非仅生成视频。独立替代为 Zhang 等／复旦与香港科技大学的 [KinemaFX v1](https://arxiv.org/html/2507.19782v1)，2025-07-26，UIST 2025；较旧来源用于验证运动检索／组合机制，不当当前最高模型。[一手／研究]
- **主流／可行层：** 已授权原生粒子模板、参数及合格烘焙细节；“主流”指已有制作路线，不是市场份额调查。[研究]
- **本仓默认：** 先复用；模板不合但组件合适时按运动／阶段重组；缺粒子逻辑而非仅缺题材标签时，才评估结构生成。该排序是对约束与维护成本的判断，不是两篇论文直接测出的路线排名。[研究]

### 原文究竟比较了什么

**ParticleGen，§3–5。** JSON 经 FxConverter 转 Niagara，依赖35种模块与21件 Fab 素材；75题限定在库内表达范围。对照为初次生成、一次修订和完整流程；20名技术美术盲评10个抽样效果，未与模板制作同预算对打。最多四轮优化原请求，不是需求二改；作者允许后续人工调整。精确控制、复杂发射器依赖及素材库仍有限，性能优化是未来方向。跨模型评价不自动无偏。[一手／研究]

**KinemaFX，§3.1、4.4–6。** 839个组件来自147个 Unity 素材组合；蓄力爆炸例按阶段分选后调变换和时间。16名非专业用户做四条件消融，基线为纯语义检索；人仍选择和组合，复杂层级／逻辑依赖支持不足。它不是与 ParticleGen 的对照，也没验证游戏取消或设备性能。借其运动检索机制，不推荐其旧代模型配置。[一手／研究]

**许可与可获得性。** 已核两篇作者 HTML 和 arXiv 版本页（[ParticleGen](https://arxiv.org/abs/2608.00629)、[KinemaFX](https://arxiv.org/abs/2507.19782)）；本轮未核得可商用的完整部署包。论文可读或开放许可不覆盖 FxConverter、素材库及模型服务；Fab／Unity 商店来源也不能代替逐件授权。只给方法候选，不建议下载研究资产或直接用于发行。[一手／研究]

### 如何转成读者选择

| 条件 | 当前选择 | 代价与撤回 |
|---|---|---|
| 已有合格模板，只改阶段时间或外观参数 | ✅ 保源与玩法接线，局部改参数 | 需重核事件与残留；模板无法分段时换模板／拆层 |
| 没有完整模板，但现成组件的形状、运动合适 | ✅ 按范围、轨迹和阶段检索重组，不仅按题材名搜 | 增加选择与对齐工时；依赖关系拼不出时收窄目标 |
| 缺发射器／模块组合逻辑，现有素材可支持外观 | 👀 结构生成是比整段视频更贴近可控运行时的候选 | 先核转换器及素材资格；承担依赖诊断、接线与返工，精准控制失败就退回受控组件 |

[研究] 这是同一读者题的条件比较，不把两篇不同实验的问卷、视觉分或创作时长横排。原生格式只保留配置入口；生成模块不自动赋予角色行为、命中判定或取消语义。AI 可检索、改参数、解释依赖并建议补丁；人检查动作阶段、预警、范围与屏幕噪声，程序负责真实状态和生命周期。二改除时长，还验中断／回池后的残留与并发；完整成本包括工具／素材、调用、失败候选、接线和主动工时，现无三路总成本数据。

[研究] 仍按正文最低设备、最坏并发及画面可读性决定去留。局部技能与装饰烟雾比较各有范围；固定烟花轨迹／爆点已在整页收口节另行比较；缺本仓实测本身不是自动扣分理由。Smolder既有讲义补读保留在M6记录，本单元不重复记新发现，也不要求移植专有渲染器。

## 整招采用补核：可编辑源不等于玩法接线

核实：2026-10-24。补的是可获得源、整招二改与接入反例；原有 P64 三路比较、预算和许可门不重做。以下为资料／固定源码，工具、模型、引擎及玩家效果均未试；没有零手修合格率或同预算冠军。[研究]

| 读者条件 | 当前默认与可借机制 | 不覆盖什么／撤回条件 |
|---|---|---|
| Unity 已有合格原生资源 | ✅ 保 Prefab／粒子及原编排；参考 Dragon Crashers 的技能局部编辑 | 不为一招增加新 runtime；若模板不能分阶段就拆层／换模板，不强用 Timeline |
| 需要独立特效源或跨引擎库 | 🧪 比较 Effekseer 的编辑源与目标插件，以官方 TriggerLaser 学阶段切换 | 插件、单位、材质及停止语义仍须核；维护成本超过复用价值就保原生 |
| 希望 Agent 制作可修改结构 | 👀 effekseer-vfx-skill 可读 recipe、分阶段评审与实帧反馈值得观察 | 尚无本仓试用／独立生产成本；不是 Unity 即插即用，也不是自动玩法实现 |

### 官方源：先控制阶段，再增加纹理

**E1 [一手]** [Effekseer TriggerLaser 教程](https://effekseer.github.io/Help_Tool/en/ToolTutorial/15.html)给出 `TriggerLaser.efkefc`：开始只生成 Charge，trigger 0 删除它并启动 Laser；删除后的平滑退出使用 `Fade out after delete`，寿命内 fade 不覆盖触发删除。[研究] 借其阶段开关，不把视觉 trigger 当伤害或取消所有者。源和纹理仍按指定资产核许可。

**E2 [一手]** [Unity Dragon Crashers 作者制作说明](https://unity.com/blog/games/get-to-know-dragon-crashers-our-latest-2d-sample-project)将技能 Timeline 嵌入 Unit Prefab，绑定动画与粒子，在 Prefab 模式局部迭代，移动 Ability Happened 信号对齐接触。[现行资源页](https://assetstore.unity.com/packages/templates/packs/dragon-crashers-2d-sample-project-190721)列 1.7.0（2026-09-11）及 Unity 6000.3 URP 兼容。前者是历史机制，未下载验证新版内部实现；免费样例不是零美术投入证明，也不保证任意取消。

### 生成候选：源码保留了什么，接入还缺什么

**E3 [一手：作者材料／源码]** [effekseer-vfx-skill 固定 f17526c](https://github.com/kanaworksai-hue/effekseer-vfx-skill/tree/f17526c6438d215e7f6e6da84caa795495f47439)保 recipe、brief、纹理及 `.efkefc`／`.efk`。[整招说明](https://github.com/kanaworksai-hue/effekseer-vfx-skill/blob/f17526c6438d215e7f6e6da84caa795495f47439/skills/effekseer-vfx/references/sequence.md)先以基本形状审时序、尺寸和摆放，再细化，优先游戏实帧；两假人的展示场景不含项目动画／镜头／光照。[研究] 可借分阶段制作，不照搬其所有审美规则或将 Agent 评分等同玩家可读性。

**E4 [源码／研究]** [VfxHandle.gd](https://github.com/kanaworksai-hue/effekseer-vfx-skill/blob/f17526c6438d215e7f6e6da84caa795495f47439/skills/effekseer-vfx/assets/godot-lab/scripts/VfxHandle.gd)中 `release()` 只关闭循环、设置 released 并调用 `stop_root()`，不清 `flight_elapsed`／`screen_at`；`_process()` 仍推进插值到达与屏幕事件。节点尚存且达到时点时仍可能发事件，若先 finished 释放则不会；`stop()` 才停止并排队释放。**这是 API 接线边界，不是已复现 bug：视觉收尾不等于游戏取消，arrived 不等于碰撞确认。** 项目应沿原状态所有者决定命中、取消与晚事件失效，不从示例另造战斗框架。

**E5 [一手：作者自述]** [README 限制](https://github.com/kanaworksai-hue/effekseer-vfx-skill/blob/f17526c6438d215e7f6e6da84caa795495f47439/README.md)：作者验证 macOS ARM64／Windows x64 构建与 Godot 窗口渲染；Linux 仅 authoring、build 未验证，headless Linux capture 不支持。初始工具链约 250 MB，另有插件；像素指标不是 GPU／overdraw，16 例仍有两例 iterate。[第三方声明](https://github.com/kanaworksai-hue/effekseer-vfx-skill/blob/f17526c6438d215e7f6e6da84caa795495f47439/THIRD_PARTY_NOTICES.md)列代码 MIT、生成后处理示例纹理但不附原图；输入／模型资格不能仅由代码许可推定。采用总成本还含候选调用、源改动、接入及实际渲染返工，本轮不估主动分钟。

**E6 [一手：作者重建案例]** [失败对照](https://github.com/kanaworksai-hue/effekseer-vfx-skill/blob/f17526c6438d215e7f6e6da84caa795495f47439/skills/effekseer-vfx/references/cases.md)把已知缺陷重新构造：接触白层停留过长遮目标；拖尾粒子活着但纹理已播空；参数回读正确却未呈现破洞。非原始历史 A/B，也非本仓观察到的画面。[研究] 二改按绝对时刻复看接触、余波与清场，不只验参数和粒子存活。

**E7 [社区：真实作者自述]** [Crystal Guardians TD 制作者原帖](https://www.reddit.com/r/Unity3D/comments/1tc6r4l/how_i_stopped_hundreds_of_vfx_graph_effects_from/)描述几百敌人各挂多个 VFX 的成本、共享位置覆盖同帧爆炸，改批量输入后又用了覆盖全地图的 bounds；讨论中承认没比较事件参数路线。[研究] 借并发／实例数与剔除粒度的取舍，不把纹理批处理当统一最优或把其收益当独立复测。搜得新 skill 的外部介绍以转述为主，未取得独立使用者整招二改成本。

**最小采用验收 [研究]：** 同一招先以预警→确认命中→余波三层完成灰盒；保范围、单位、源与稳定引用，二改仅缩短蓄力并取消一次。实际镜头下查预警仍可读、取消后不发晚命中、低档装饰不挡下一危险，再测最低设备最坏并发。三层是制作责任分开，不要求新系统或三个文件；合格现成源满足就停，不为完整流程重新生成。

## 技能特效生产模块补核：参数驱动效果族与正常阶段接入

核实：2026-10-25（UTC+8）；Unity 6000.3 文档、VFX Graph 17.3 与 UE 当前公开 API 页。主线二／三。**改变的建议：** 整招生产的默认单位从“一招一份可编辑源”推进到“一族共享语言＋每招形状配置＋每次施放运行值”；阶段、范围和命中都接玩法已确认事件。官方组件的“停发／重置”不能替代取消与命中语义。复用 [P64 三路比较](#p64可取消技能特效的三路比较)、[整招采用补核](#整招采用补核可编辑源不等于玩法接线)与可读性、预算各节，不重做工具排名或来源链。[研究]

### 官方实现缺口：参数、停发与事件

| 一手事实 | 对默认的影响 | 不能推出什么 |
|---|---|---|
| [VFX Graph 17.3 Blackboard](https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.3/manual/Blackboard.html)的属性可设 Exposed，经组件与 C# 读写；[VisualEffect](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/VFX.VisualEffect.html) 提供 [SetFloat](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/VFX.VisualEffect.SetFloat.html)／`SetVector3`／`SetGradient`／`SetTexture`，setter 会把属性标为已覆盖；[SendEvent](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/VFX.VisualEffect.SendEvent.html) 可带 `VFXEventAttribute`，事件接 Spawn Start／Stop 后替代默认 OnPlay／OnStop | 一族可共用一份图，按技能配置写暴露参数；阶段用命名事件切，减少复制资产 | 暴露参数不等于玩法状态；事件名、载荷与校验仍须项目自己定义 |
| [VisualEffect](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/VFX.VisualEffect.html) 的 `Stop` 只向所有 Spawn 系统发停止事件，页面未承诺清空已有粒子；[Reinit](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/VFX.VisualEffect.Reinit.html) 恢复初始状态、内部时间归零并重发 initial event | 取消要分“停发、自然收尾、立即清场”；不能把 Stop 当瞬间消失，也不能用 Reinit 做取消 | 未给出各层残留在目标项目的实际表现 |
| [ParticleSystem.Stop](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/ParticleSystem.Stop.html) 默认 `StopEmitting`，已有粒子继续；`StopEmittingAndClear` 立即移除；[Main 模块](https://docs.unity3d.com/6000.3/Documentation/Manual/PartSysMainModule.html)的 Stop Action 在粒子全部死亡且超过 Duration 后触发 | 同一招不同层可选不同停发策略；回池前等寿命或显式清空 | Stop Action 不是阶段计时器，不能拿它驱动命中 |
| [Sub Emitters](https://docs.unity3d.com/6000.3/Documentation/Manual/PartSysSubEmitModule.html)只有 Birth 支持多项 burst，Collision／Death／Trigger／Manual 只支持单个 burst | 命中层的多段爆裂不能默认挂 Death；多 burst 改 Birth 或手动触发 | 不说明各引擎版本的性能 |
| [Shape 模块](https://docs.unity3d.com/6000.3/Documentation/Manual/PartSysShapeModule.html)的 Cone 有 Angle，Shape 的 Arc 属性可限制角度范围 | 扇形可用原生形状发射，但范围边界仍应由玩法半径／角度生成 | 原生扇形发射不等于判定形状一致 |
| [UNiagaraComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Plugins/Niagara/UNiagaraComponent) 的 `SetVariableFloat`／`SetVariableVec3` 按名覆盖 user parameter，`ResetSystem` 回到初始模拟状态 | UE 同样按参数合同接；重置不等于保留现场取消 | API 页未统一说明 Deactivate 后已有粒子的语义，须按目标版本与 System／Emitter State 核 |

[一手／研究] 上表只补会改变默认的契约缺口；VFX Graph 事件属性、Particle System 与 Niagara 的其余模块边界沿用 P64 与整招采用补核，不重扫全部官方文档。

### 效果族的结构：共享语言，形状与运行值分级

[研究] 正文把族参数分三级：族共享（色板、材质、边缘粗细、阶段顺序、优先级、占屏预算）、每招（beam／cone、范围绑定、时序、强调色、占屏上限）、每次施放（原点、方向、progress、intensity、结果、寿命）。这是项目约定，不是引擎字段；用配置校验拒收未知阶段、越界角度和缺失绑定，运行实例只写施放级字段。它针对两个真实维护问题：改一招却复制整套材质，以及 AI 顺手改到全族。

[研究] ring／ribbon／flash／粒子／flipbook 按责任分，不按文件数分：范围边界、蓄力进度、方向／飞行、确认接触、冲击余波、内部细节各归一层。第一次只交灰盒也可验收责任是否清楚；外观源与派生纹理后补。作者源（Prefab／图／效果源与族配置）、派生纹理（flipbook、noise、SDF、六向光照）和运行实例（组件、参数值、阶段、寿命）分开保存，避免把当前目标、剩余蓄力或命中状态写进共享资产。

### 首版与二改：同一合同下换形状

[研究] 首版蓄力射击按预警→蓄力→释放→飞行→确认命中→余波六段接 05 的正常链，不把六段拆成六段视频再拼接：范围与进度读玩法参数，释放只在提交成功后，命中只在确认结果后，余波独立降档。第二改加同族扇形技能时共享色板、轮廓、节拍、材质与结果标记，只换形状绑定和范围参数；扇环由半径／角度生成，不拉伸 beam 贴图，多目标命中按确认结果合并，不按视觉射线计数；单目标强度与命中数量分开计，不把命中数累加成亮度。

[研究] 两招同屏的优先级为来袭威胁 > 我方主动攻击 > 命中确认 > 余波；重叠时降低低优先级层的亮度／频率／时长，不删高优先级边界；共享色板下用轮廓、位置和时序区分，不靠颜色。强度可同族缩放，但不能用更大闪光把低优先级攻击装成更紧急；占屏预算超限先减装饰与余波、合并重复命中 flash。该顺序是设计规则，未做玩家识别实验，不能写成已验证的可读性收益。

### 未执行的两招同屏验收设计

场景：束射与扇形朝不同方向同时出现，随后插入更紧急的敌方预警；固定目标相机、最低画质和设备预算。下表是验收设计，本轮没有对应运行或画面。

| 问题 | 机械可查 | 必须人看 |
|---|---|---|
| 事件与参数同源 | 事件轨迹、参数写入者、是否存在第二套蓄力／伤害状态 | — |
| 阶段与取消 | progress 0→1、提交失败、取消、回池后无晚事件 | 预警是否仍可读、取消是否突兀 |
| 两招同屏 | 优先级枚举、占屏预算、层降档记录 | 能否指出来源、方向、实际范围、进度、强度与主次 |
| 成本 | 系统数、发射器数、屏幕覆盖、驻留记录 | 目标相机与最低画质下的实际帧时间 |

[研究] 机械项只证明接线与状态归属，不证明打击感、节奏或两招可读；像素／截图评审也不能代替运动中的识别。

### 选源与成本

- **原生 Prefab／粒子／VFX Graph 默认：** 已有合格模板只改参数，不重做；成本是作者源、接线、版本升级与参数维护。
- **许可清楚的现成源：** Effekseer 指定 CC0 包与 TriggerLaser 可学阶段切换；Dragon Crashers 等免费样例可学 Prefab／Timeline 局部编辑；样例许可、插件版本、单位与停止语义仍逐项核，免费样例不等于零美术投入。
- **AI 补纹理或可编辑结构（有条件）：** 只在缺纹理、缺结构且输入／输出许可清楚时用；承担候选淘汰、清理、风格一致、接线和重生成。像素评审不等于 GPU 预算，也不保证范围与命中正确。
- **维护成本：** 按族共享一份材质／参数表、每招一份形状／时序、每次施放只写运行值计；不按文件数或粒子数计。

### 验证边界与重开条件

未运行 Unity／Unreal／Effekseer、未生成资产、未做同屏人看。需要实测的是：阶段事件与参数是否同一来源、取消／回池是否残留晚事件、两招同屏是否保来源方向范围进度主次、目标相机与最低画质的占屏与帧成本。若实测显示共享图无法表达某招形状，或事件合同仍逼每招复制资产，再回到条件比较，不先加框架。动态版本只在新官方契约改变选择时重核，本轮不刷新全部来源。

依据：本节复用 P64 三路比较、整招采用补核与可读性各节；新增仅上表官方 API 与正文参数分级。[一手／研究]

## 动态事实表：采用前再核，最迟 2026-11-14

[一手／研究] 以下只记录本次可读的一手页面与固定版本，不表示实际安装版本或已通过资产生产验收。复核日期是维护期限，不是许可有效期；采用、上传、购买或升级早于期限时，先做相应复核。型号、价格与生产资格在此单点维护；§四保留固定机制／反例，§六区分权利层。引擎合同仍回到 WP1，不在本 WP 重复裁定。本次仅合并旧记录，不刷新核实日。

| 事实／精确范围 | 一手来源 | 核实日期 | 下次复核 | 对建议的影响 |
|---|---|---|---|---|
| Material Maker releases 仍标 2026-07-14 的 1.7 为 Latest；固定 SHA `4c6cea67b659e1eb472f91590e06b2b1c5245916` | [发布页](https://github.com/RodZill4/material-maker/releases/tag/1.7) | 2026-10-14 | 采用前或 2026-11-14 | 图编辑可采用；不把主分支变化当已发布修复 |
| 1.7 的 `--size` 解析未传给导出；#1506 有跨平台故障自述 | [固定源码](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/parse_args.gd#L98-L165)、[原帖](https://github.com/RodZill4/material-maker/issues/1506) | 2026-10-14 | 批处理采用前或 2026-11-14 | CLI 仍试用；参数接线已核，崩溃／补丁收益未复现 |
| 编辑器默认 MIT；无生成权重层，所读许可无专门营收／地域门槛。社区库有 CC0、BY、BY-SA 分区，输入贴图／外部节点另核；官网／Steam 入口不改变输入许可 | [固定许可](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/LICENSE.md)、[素材库](https://www.materialmaker.org/materials) | 2026-10-14 | 选入每件素材前或 2026-11-14 | 免费工具不覆盖输入素材；保留逐件许可 |
| Poly Haven 指定资产 CC0，允许商用／修改／分发且无资产营收门槛；logo／网页文字／预览渲染除外。2026-07-18 API 页含商用免费；live API 产品仍须标示来源、独有 User-Agent 等，不授权任意抓站 | [许可](https://polyhaven.com/license)、[API](https://polyhaven.com/our-api) | 2026-10-14 | 采用／API 接入前或 2026-11-14 | 指定纹理仍是免费基线；不扩大为任意抓站许可 |
| Designer 16、Sampler 6 是 2026 公告所述代际；7 月公告含 Painter 12.1/OpenPBR | [官方公告](https://blog.adobe.com/en/publish/2026/07/21/adobe-substance-3d-unveils-new-innovations-deliver-faster-workflows-openpbr-everywhere-digital-twins-scale) | 2026-10-14 | 锁定实际补丁版前或 2026-11-14 | 保留参数图路线；公告版本不称安装版或最新补丁 |
| Adobe 当前页面返回日本 Collection 个人 ¥8,180/月、团队 ¥16,280/月/席，含税；地区快照非读者所在地报价，购买前另核税、承诺期和应用范围 | [当前计划](https://www.adobe.com/products/substance3d/plans.html)、[2025 调价 FAQ](https://helpx.adobe.com/substance-3d/pricing-change.html) | 2026-10-14 | 购买前或 2026-11-14 | 旧美元 FAQ 撤出实时预算；必须按账户地区报价 |
| Substance 封闭订阅不授模型自托管权；Assets 2025-04-22 条款 §2/3 只允许 Modified/Larger Work 发行，禁独立提取；§4 付费下载可退订后合规续用；§3.3 禁用资产／衍生输出创建、训练、测试、改进 AI/ML，EDU 例外不能外推。资产 worldwide 授权不等于各地可买，非 Adobe 模型另核 | [资产专属条款](https://www.adobe.com/go/substance3dassets) | 2026-10-14 | 采用／训练用途改变前或 2026-11-14 | 游戏内合规使用可选；不作训练库默认 |
| Effekseer 1.80.7（2026-08-22）；Unity 6.5／URP RenderGraph 相关工作及 UE 5.8 支持为变更声明 | [变更记录](https://effekseer.github.io/Helps/18x/Tool/en/ReleaseNotes/18x.html)、[XR 固定提交](https://github.com/effekseer/EffekseerForUnity/commit/ae9bd12596edb12013c98cafc06c71ccf195cc49) | 2026-10-14 | 锁版本／目标后端前或 2026-11-14 | 工具／插件／格式分锁；native renderer 的 XR 不写已验证 |
| Effekseer 工具／runtime 主 MIT，分发须保通知，无权重层及所见营收／地域门槛；新样例区 CC0。旧 project弾幕GIrls／NITORI BOX／LotusCraft 仅确认随 Effekseer 播放免费，不默认烘焙换 runtime／独立售包 | [固定主 MIT](https://github.com/effekseer/Effekseer/blob/82b37081a302b9f9eff0bf14dc6c845fca8c3c54/LICENSE)、[官方样例页](https://effekseer.github.io/en/contribute.html) | 2026-10-14 | 选包／烘焙换 runtime 前或 2026-11-14 | 仅指定新 CC0 包作运行时与烘焙对照 |
| EmberGen Indie node-locked 永久：首年 US$300，可选维护 US$180/年；未税、维护默认续订但可退出 | [精确方案页](https://jangafx.com/software/pricing?license=nodelocked&rebill=permanent&type=indie) | 2026-10-14 | 购买前或 2026-11-14 | 纳入维护与税；不将永久理解成终身免费升级 |
| JangaFX 封闭工具 EULA 2025-07-19 §2/3/5：商业 License 允许商业制作，trial 导出购许可后才可商用，教育版不商用，导入权利自负，工具不授额外独占版权；Indie 核当年／前一年合并收入或项目预算 <US$1M 及商业委托客户门槛，营销母公司简写不覆盖 EULA。§2.5/2.7 月租 12 个月转永久与价格 FAQ 18 个月冲突 | [EULA](https://jangafx.com/legal/end-user-license-agreement)、[价格 FAQ](https://jangafx.com/software/pricing?license=nodelocked&rebill=permanent&type=indie) | 2026-10-14 | 采用／购买前或 2026-11-14 | 保留商业模拟候选；不承诺月租 12 或 18 个月自动转永久 |
| MatLat checkpoint v1.0.0 为 CC BY-NC 4.0；2026-10-08 论文 v2 的 CC BY 4.0 不覆盖权重。固定代码根 LICENSE 读取 404，未取得通用代码授权；未见覆盖商业生产的单独输出授权，另获商业许可才重审 | [权重卡](https://huggingface.co/32V/MatLat)、[论文 v2](https://arxiv.org/html/2512.17302v2) | 2026-10-14 | 商用准入前或 2026-11-14 | 非商用研究观察，不进本地免费发行默认 |
| VideoMatGen v1 是研究论文；本轮仍未核得完整商用部署包 | [论文及作者项目链接](https://arxiv.org/html/2603.16566v1) | 2026-10-14 | 发现新发布／采用前或 2026-11-14 | 不把论文吞吐量换成本地成本或交付证明 |
| Scenario VFX Hits 与 alpha 分层是供应商能力声明，无固定底模版本或通过率 | [模型页](https://help.scenario.com/articles/5002595381-scenario-models-custom-trained)、[分层页](https://help.scenario.com/articles/8235214611-image-to-layers-and-video-to-layers-the-essentials) | 2026-10-14 | 试用／锁模型前或 2026-11-14 | 仅隔离对照，不替代可取消的玩法特效 |
| Scenario Starter/Pro/Max 页显 US$15/45/75 每月与 1,500/5,000/10,000 月额度；文本抽取未锁定月／年付切换，不作可结账报价。账户、训练、迁移及数据资格统一见 WP8 §11 | [价格](https://www.scenario.com/pricing)、[WP8 §11](2026-10-14-game-wp8-style-consistency.md#11-阶段-f-动态资格补核) | 2026-10-14 | 上传／购买／发行前或 2026-11-14 | 价格留本页供 WP8 回引；资格直读 WP8，不以价格或 alpha 能力放行 VFX 底模 |

## 一、结论先行：三档首试，不是同题实测排名

[研究／经验] 评价单位是“第二次改动后仍可交付的合格资源”，不是一张渲染图。纹理美观、PBR通道齐全和物理一致是三件事；VFX演示视频、可透明合成的flipbook和能响应玩法的运行时也是三件事。工具是否使用AI不决定是否采用。

| 资源与条件 | 最佳质量档（含商业，按交付可靠性首试） | 最佳性价比档 | 本地／免费档 |
|---|---|---|---|
| 平铺地表、砖、木、漆、规则磨损 | ✅采用同风格、通道配套的成熟材料库；缺变体时用Substance Designer 16参数图／Sampler参数层；需要独特纹样时才🧪Sampler图转材质 | ✅采用同套Poly Haven指定CC0材质＋引擎参数变化；形状、缝距、磨损必须反复改时用Material Maker图 | ✅采用Material Maker 1.7＋原生Lit／Shader Graph；🧪其无人值守CLI导出须修复/验证后再进批量生产 |
| 已有UV的道具重贴图 | ✅保留mesh／UV、按材质区域赋现成或参数化材质；独特整体外观才进入WP3已审商业重贴图候选 | ✅共用少量主材质与区域mask，颜色/roughness/污渍强度做参数 | ✅原生参数材质＋合法输入；⛔MatLat v1.0.0权重不作商用免费路线 |
| 命中、拖尾、蓄力、持续火焰等须响应玩法的特效 | ✅采用项目原生Particle System／VFX Graph／Niagara模板；近景烟火细节再加可靠烘焙flipbook | ✅能用现成参数包就不新增运行时；需要跨引擎样例库时🧪Effekseer 1.80.7＋指定CC0包 | ✅原生粒子或Effekseer；程序化noise、gradient、ring、ribbon先满足；不重新生成已有形状 |
| 固定视点烟火、魔法背景／装饰叠层 | ✅匹配风格的成熟flipbook；缺少独特流体动态时🧪EmberGen商业许可参数模拟烘焙，按需six-way lighting | ✅同一运行时/模拟源多次烘焙与复用；不要为每个颜色/时长重生视频 | ✅Effekseer指定CC0效果烘焙或原生粒子；通用视频模型只作隔离🧪候选，alpha、循环和时序不过就撤回 |

[经验] 三档允许重合：写实公共材质已经足够时，免费现成资产比付费重新生成更符合“零手修”。付费档买的是可修改源、可靠素材和控制，不保证无需审美判断。只有程序员可做的选参数、脚本处理、引擎调整、重生成；逐像素绘补、画mask、雕材质、逐帧修烟火都不计通过。

[研究] 这取代“所有资源优先生成”和“视频切格就能当游戏特效”；未来若商业许可清晰的联合PBR／alpha视频模型，在同题两次修改中稳定通过重新打光、循环、时序和设备预算，才上调生成路线。当前没有该发布通过率证据。

## 二、PBR一致性：失败判别与程序能补多少

| 问题 | 可用程序/引擎处理 | 不能靠该处理证明的事 |
|---|---|---|
| Base color残留阴影和镜面高光 | Sampler delight候选；换正交/漫射素材；平场和低频校正仅作有限预处理 | 深阴影里真实纹样不可唯一恢复；不可把所有暗色当阴影删除 |
| Normal与height不符 | 从同一height生成切线空间normal；按真实比例设高度/强度；核切线基、绿色通道方向和正常贴图导入类型 | normal不是几何；有孔洞、轮廓起伏需求不能由法线替代 |
| Roughness把花纹当粗糙变化 | 保守常量基线＋明确语义mask，参数化混合 | 单张RGB亮暗不能唯一辨认roughness，更不能分离光照/材质 |
| Metallic按灰度“自动猜” | 由材质类别/区域提供0/1端点，过渡/抗锯齿可有中值；涂层、锈蚀按实际表面模型处理 | 反光塑料不是金属；metallic=1不是“更亮”滑块 |
| 多通道接缝/尺度不一致 | 所有通道相同UV／投影坐标约定、物理尺寸、tile次数、边界wrap；统一平铺处理及mip padding | 每通道独立无缝化可改变边界关系；补一张不代表整套一致 |
| 导入后反光不对 | 固定导出预设、线性/颜色空间、通道pack；检查光照、曝光和色调映射 | OpenPBR标识不保证不同引擎同像素；降到目标Lit模型时高级层可能丢失 |

[一手／经验] 规范依据为P1/P2，单图歧义与生成边界见A2/A3/G1–G3。以上是验收方法，不是已测自动修复率。

[经验] 非写实/固定灯光不是“不必一致”：可以明确选择unlit/手绘烘焙外观，此时固定阴影是风格的一部分，但必须承认动态日夜、可移动灯或近景写实反射的玩法限制，不应再宣传它是可重新打光PBR。

### 制作链综合：同源表面与实例二改（2026-10-26 UTC+8）

[材质正文](../../domains/game-dev/assets/materials.md#pbr-production)把上述同通道约束接成表面任务→作者源→配套通道→目标导出／导入→材质与对象→同条件复核。首次用两面墙核同源配置，二改将实例采样／粗糙度与作者结构／语义 mask 分开：前者沿已有参数和持有关系，后者回图源重导出所有受影响通道。它复用本页选源／许可／涂层证据，没有更新候选排名、原核实日期或提出新材质框架。[研究]

实际消费者起点沿 [P124 固定源](../../experiments/p124-texture-consumer.md)：2026-10-23 的原图、KTX 4.4.2／Three 0.186.0 锁版本与真实 CPU 转码、共享纹理二改已独立复跑；只证明对应数值／引用保持，不是 GPU shader、Unity／UE、真实平铺尺度或新材质生成质量。正文正常六步、结构二改和两面墙目标画面仍是实施／验收建议，本次未运行新工具或重传源图。[本仓运行／研究]

## 三、第二次修改：留下什么源文件，什么情况下撤回

[经验] 每种资源保留原始图／材质图／特效源、精确版本、seed、参数、输入权利、导出预设与引擎资产身份。Seed只帮助重现同设置，不保证换模型或换提示后其他部分不变。

1. **干砖改湿砖，缝距不变**：共享结构mask；只改roughness、有限base color变化及必要水层参数。若每次文本重生把砖排列改掉，直接用原参数图而非再修。
2. **红漆变蓝漆，露出的金属划痕保持**：只改涂层颜色；metallic区域和划痕形状保持。没有可分离语义时，重新选可参数化现成材质，不要求程序员描mask。
3. **0.4秒命中改为0.2秒，主击中仍在指定帧**：前摇、闪光、火星和余烟分层时间控制；简单加速会连重力和余烟一起改变，不自动合格。
4. **蓄力延长并能取消**：运行时包含start/loop/release/cancel；flipbook只在各段内部播放。生成一个完整动画后强行循环不能替代状态边界。
5. **改变烟雾风向／镜头角度**：同模拟/特效源重烘焙；six-way只解决近似打光，不提供完整多视图几何。需要自由绕看的厚体积时，改为体积/多片或收窄视点。
6. **并发从5升到30**：保关键可读层，先降不影响判定的余烟、扭曲、动态光、层数及分辨率；不得靠关掉预警范围或击中提示来达标。

[研究] 这些是后续获准实验的变更用例；不是本轮已经通过的六项测试。

## 四、当前一手证据、实际采用和反证

### M：Material Maker与现成基线

- **M1 [一手，固定源码]** 上表固定 1.7 更新含 PBR metallic 默认值、subgraph 导出及修复；[固定 README](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/README.md)对应该快照，不沿用搜索摘要的 1.4RC。
- **M2 [一手]** [材质节点/导出说明](https://rodzill4.github.io/material-maker/doc/material_nodes.html)：导出可以是PNG/EXR纹理、模板及buffer。由此采用“保图源＋按引擎烘焙”，不推断所有动态节点或材质模型在每个管线都有等价效果。
- **M3 [一手：源码；社区：故障复现]** [#1506](https://github.com/RodZill4/material-maker/issues/1506)始于2026-07-16 Linux 1.7批导出崩溃、GUI可导；2026-10-10另有Windows两GPU复现和临时规避自述。核读[固定parse_args.gd](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/parse_args.gd#L98-L168)，`--size`写入`texture_size`，实际传入导出的仍是初始化2048的`image_size`；这是源码可确认的参数接线问题，不需运行才发现。[固定multi_renderer.gd](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/addons/material_maker/engine/multi_renderer.gd#L172-L196)亦有异步初始化路径；崩溃时序及补丁收益本轮未实测，不将评论中的12/12作为自己验证。**改建议：GUI参数图可采用，1.7无人值守CLI先验证修复、输出尺寸、失败退出和缺目录超时；不直接把CLI/MCP封装宣传为稳定资产工厂。**
- **M4 [一手]** [Poly Haven纹理标准](https://docs.polyhaven.com/technical-standards/textures)2026-05-28，要求成套地图、真实尺寸和photo-based制作；这是零手修现成基线的可检查规格，不是保证任一8K贴图适合目标设备。下载后应按占屏和预算降规格。
- **M5 [研究]** 工具与社区材料资格分层见上表；本轮未核实 Material Maker 到已发行游戏的全程零手修案例，不把 star 数、作者展示或导出支持当生产验证。

### A：商业材质路线不是只列服务名

- **A1 [一手]** 篇首 Adobe 公告支持采用参数化与明确定义的材质语义，非 Unity／Unreal 一致性测试；Painter 的 Skew Map Painting 仍是人工绘修，不能计为本基准自动过关。
- **A2 [一手]** [Sampler Image to Material](https://experienceleague.adobe.com/en/docs/substance-3d-sampler/using/filters/tools/image-to-material)与[Delight](https://experienceleague.adobe.com/en/docs/substance-3d-sampler/using/filters/tools/delight-ai-powered)，2026-04-07文档：AI路径推断normal/height/roughness并去阴影高光；B2M为程序化估计。保留可试候选，不承诺被遮挡细节可被正确还原。
- **A3 [一手：产品经理答复]** [UV输入失败案例](https://community.adobe.com/questions-69/material-settings-not-ticked-630115)，2024-01-10：产品方明确I2M不是为UV set贴图而设计。该证据旧于Sampler 6，作为输入风险，不宣称新版本所有UV输入必败；后续若有专门UV保真路径应重审。
- **A4 [研究]** 报价及其地区／承诺期边界见篇首表；成本按整套材料库和修改工时算，不按单张生成价算。

### G：前沿联合PBR研究为什么暂不替代默认

- **G1 [研究：作者论文]** [MatLat v2](https://arxiv.org/html/2512.17302v2)，2026-10-08。在材质潜空间联合学习RGB、roughness、metallic，并用局部性约束改善跨视图投影一致性。它支持“专门联合模型优于任意RGB模型分别猜通道”的研究方向，不能据此称包含完整height/normal或具有商用交付证明。
- **G2 [一手／研究]** MatLat 固定 SHA `a0ce5d359bb58cad503099d109955b1c88dbab05`（2026-07-16）的[README](https://github.com/KAIST-Visual-AI-Group/MatLat/blob/a0ce5d359bb58cad503099d109955b1c88dbab05/README.md)对应篇首 checkpoint 资格；代码／论文／权重授权不能互代。依赖仍含 SD3.5、LPIPS、nvdiffrast、Real-ESRGAN 和 LaMa，未做完整依赖商用审计。
- **G3 [研究：作者明确局限]** [VideoMatGen](https://arxiv.org/html/2603.16566v1)，2026-03-17，联合base color/height/roughness/metallicity，论文§5自述8×A100单资产2–3分钟、视角不连贯会鬼影/模糊、烘焙仍是简单投影。**👀研究观察，不作本地省钱默认**；没有核得完整可商用部署包，本轮不推荐安装。
- **G4 [一手：供应商能力，不是成品证明]** [Scenario VFX Hits 模型说明](https://help.scenario.com/articles/5002595381-scenario-models-custom-trained)介绍的是捕捉爆炸／能量爆发外观的 LoRA；[Video to Layers](https://help.scenario.com/articles/8235214611-image-to-layers-and-video-to-layers-the-essentials)输出带 alpha 的视频层，按时长和分辨率计成本。它们不证明循环、击中帧、烟边或 six-way 材质合格，仍只作探索对照。
- **G5 [研究]** Scenario 价格仅在篇首表维护；[2026-07-16 v2.1.1 合同](https://www.scenario.com/terms-and-conditions) §3.1 将免费限制指向套餐页，账户输出／训练／迁移资格及自助数据与企业承诺的区别直读[WP8 §11](2026-10-14-game-wp8-style-consistency.md#11-阶段-f-动态资格补核)，不凭付费或输出归属推断不训练、可自托管或无权利风险。
- **G6 [研究：VFX 未解决项]** 企业更强的数据承诺须以签署的 MSA/DPA 为准，不凭套餐名称放行；同一合同 §9 的第三方模型政策与输入处理仍须逐模型核对。本轮没有 VFX Hits 精确底模／LoRA 全链授权或账户内治理页证据；保持隔离候选，上传未公开资产前先解决 WP8 所列数据边界。alpha 分层不证明循环、击中帧或玩法状态合格。

### V：运行时、模拟烘焙、生成flipbook三分

- **V1 [一手]** [Unity 6.0粒子选型](https://docs.unity.com/en-us/engine/6000.0/manual/visual-effects/particle-systems/choosing-your-particle-system)：Built-in Particle System提供完整C#粒子读写与物理交互；VFX Graph用GPU并暴露属性/事件。选已有项目的实现，避免只因“百万粒子”换图系统；平台/compute支持与管线按具体版本核。
- **V2 [一手]** 篇首 Effekseer 变更记录含数据加载加强，旧 1.80.5 修过 vertex-buffer 增长／内存泄漏；2026-10-06 固定 Unity 插件提交只允许 Unity renderer 在符合条件时走 XR raster pass，源码明确 native renderer 未测 XR。**编辑器、插件、效果格式分别锁版本；“支持 Unity”不能泛化到全部后端、XR 或平台。**
- **V3 [一手]** [EmberGen导出节点](https://docs.jangafx.com/embergen/pages/references/node_list.html)说明flipbook尺寸/行列/帧数/stride；[产品页](https://jangafx.com/embergen)宣称确定性模拟与可调参数。采用其“保源重烘焙”机制，不引用营销“几秒”当独立吞吐测量。
- **V4 [一手]** [Unity six-way说明](https://docs.unity.cn/Packages/com.unity.visualeffectgraph%4017.4/manual/six-way-lighting.html)和[制作/导出说明](https://unity.com/blog/engine-platform/realistic-smoke-with-6-way-lighting-in-vfx-graph)：六方向光图在运行时按灯光混合，发光另处理。它是有源模拟/多方向渲染产生的数据，不是对任意RGB帧做一次滤镜即可正确恢复；Unity还明确其EmberGen旧流程不属官方完整支持，不能漏掉适配检查。
- **V5 [一手：开发者实验，非发售验证]** [JangaFX 2026-03-02复现Diablo 3方法](https://jangafx.com/insights/diablo-3-vfx-experiments)：少数噪声层配合粒子可形成复杂运动，作者在现代引擎迁移时也遇到混合问题。只借机制；文章包含原游戏画面和第三方教学素材，不能当免费资产包复用，不能把其65小时研究计成独立程序员制作某效果的成本。
- **V6 [一手：引擎团队经验]** [Niagara scalability](https://dev.epicgames.com/documentation/unreal-engine/scalability-and-best-practices-for-niagara?lang=en-US)：系统/发射器即使GPU粒子仍有CPU开销；更多实例与更细裁剪之间存在取舍；pooling不能自动消除重新激活开销。故预算必须统计实例、透明覆盖与CPU/GPU，而不只数粒子。
- **V7 [一手：厂商采用名单，有范围限制]** [Effekseer采用页](https://effekseer.github.io/en/adoption.html)列THE KING OF FIGHTERS XV、SAMURAI SPIRITS、RPG Maker MZ等；[样例页](https://effekseer.github.io/en/contribute.html)含MAGICAL X SPIRAL等贡献包。只证明工具有真实采用/现成起点，未取得零手修或性能数据。
- **V8 [一手：客户访谈，供应商承载]** [CCP/EVE Online访谈](https://jangafx.com/insights/ccp-case-study)：2023 Viridian导弹效果部分纹理由EmberGen制作，部分还进After Effects处理平铺/扭曲；体积云曾有300–400MB数据、需自研压缩且GPU恢复原大小。**这恰是反证：成熟工具真实发售≠零手修；磁盘压缩≠同等降低显存。**不把该流程整体作为单人默认。

### P：格式与引擎契约

- **P1 [一手]** [glTF 2.0官方规范](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)，Materials / Metallic-Roughness：base color RGB为sRGB，metallic-roughness为线性，G粗糙、B金属；导入转换器应按语义而非文件名处理。
- **P2 [一手]** [Unity 6 URP Lit](https://docs.unity3d.com/6000.0/Documentation/Manual/urp/lit-shader.html)及[通道打包](https://docs.unity3d.com/6000.0/Documentation/Manual/urp/shaders-in-universalrp-channel-packed-texture.html)：R金属/G遮蔽/A光滑，图关闭sRGB，并同时赋给Metallic和Occlusion槽；G通道有数据不代表Occlusion槽自动引用，normal单独按normal导入。Smoothness源也可选albedo alpha，必须核材质设置，不能假设所有资产统一。

## 五、性能目标从设备来：给决策口径而非伪造通用阈值

[经验] 先写最低设备、分辨率、帧率目标、渲染管线、最坏同屏对象与效果数，再分配材料/特效预算。60fps全帧为16.67ms，30fps为33.33ms；这里没有把2ms/1000粒子之类经验数字当跨项目合格线。

[研究：可复算容量示例] 一张4096×4096 RGBA8纹理未压缩64MiB，完整mip链约85.33MiB；8×8格时每帧仅512×512。两张同规格six-way图未压缩含mip约170.67MiB，再加emission/flow会增加；实际BC/ASTC、驻留mip和格式另算。这是算术示例，不是GPU测量；PNG压缩后文件小不代表GPU纹理也小。

[经验] 材质重点核实际resident纹理、材质实例/关键字、透明层数、采样数和分辨率；VFX核峰值系统数、发射器数、粒子数、屏幕覆盖、overdraw、灯/扭曲、排序、CPU/GPU时间和加载峰值。相同画面比较native运行时、Effekseer运行时和烘焙flipbook；不能拿毫无交互的烘焙卡片去宣称全面替代动态模拟。

[经验] 后续最小获准实验：一块“湿度可改的砖”＋一个“可取消蓄力/命中/余烟”特效，各三条路线，同规格首产与二改；记录淘汰数、重生成次数、主动分钟、纹理占用、峰值并发、渲染差异。视觉语义/可读性仍由人作接受判断。若现成路线已满足则停止增加生成复杂度。

## 六、许可核查明细（法律结论仅为候选准入）

[研究] 动态许可及明确禁止条件集中在[篇首事实表](#动态事实表采用前再核最迟-2026-11-14)，不在这里再维护一套型号／价格。采用时分开四层，任何一层不明都不能由另一层补齐：

| 权利层 | 本页采用时检查什么 |
|---|---|
| 工具／代码 | 编辑器或 runtime 的许可与分发通知；封闭工具席位不授自托管权。固定源码只支持所读机制，不证明已安装补丁 |
| 权重／依赖 | checkpoint 的商业生产资格和依赖链；论文许可、可下载代码、生成输出归属不能覆盖 NC 权重或未取得的代码授权 |
| 输入／资产／输出 | 逐件核输入贴图、节点、样例、库资产及输出使用范围。免费工具不使整库免费；游戏内使用、烘焙换 runtime、独立售包、AI 训练是不同用途 |
| 服务／账户 | 地区、营收／预算与客户门槛、套餐及数据使用；服务可访问不等于全球无条件。Scenario 具体资格见[WP8 §11](2026-10-14-game-wp8-style-consistency.md#11-阶段-f-动态资格补核) |

[研究] 原生 Unity／Unreal 功能沿用项目适用引擎订阅／royalty 与平台条款；模板、商店包和第三方 flipbook 逐件核，不由引擎功能赋予全部样例商用权。本 WP 未重审引擎全套合同，也未完成服务地区／出口限制的国家列表。法律资料只作候选准入，不是法律保证。

## 七、收口、撤回条件与未完成项

- [经验] 稳定可商用生成器若能在相同预算下通过共同PBR结构和二改测试，替代生成暂缓；否则保留参数图和现成库。
- [经验] 项目只需固定视点装饰、完全不需重打光和取消，允许生成flipbook候选；需要逐帧抠图、补烟边、画遮罩时按基准失败。
- [研究] MatLat、VideoMatGen仍缺实际游戏零手修采用证据；Effekseer／EmberGen的采用不证明该基准，CLI故障见M3。
- [研究] 除篇首验证边界外，尚未完成资产包实物核查、批导出修复运行、真实两次修改及最终商店发行审查。

## 八、集成复核与离线验收

2026-10-14 UTC+8：内部独立复核固定Material Maker参数接线、Effekseer XR提交、新旧样例许可、Adobe输入/资产条款和MatLat权重卡；补URP同图同时赋Metallic/Occlusion槽，以及Poly Haven live API含商用免费但另履行来源标示/User-Agent条件。WP1、03与既有入口已同步；当时未取得正式云端评审。

[研究] 历史交付检查：完整离线 14 阶段，97／26／10／13／14 项测试无 skip、8 项 shell 语法及 `git diff --check` 通过；不覆盖 Material Maker 修复、资产质量、引擎或 hosted CI。

### 2026-10-14 动态事实补核

[一手／研究] 历史动态补核新增 Scenario 免费输出／数据使用冲突，修正 Adobe 地区价格；局部 `check_repo.py` 177 文件、两文件 `git diff --check` 通过，未重跑完整离线入口。

## 体验质量深化：有限预算中的视觉层次与统一风格

核实：2026-10-14 UTC。[研究] 本轮改变的建议是：在已有“参数源＋可控运行时”上，加上每个效果必须传达的玩家信号及整体视觉层次；不是重做像素调色、网格修复或增加通用渲染框架。主线二／三：哪些渲染能力值得增加，以及第二次扩内容时还能否维护统一性。

### 新证据及其能支持的强度

| 一手来源 | 本次核得事实 | 推导与边界 |
|---|---|---|
| [TUNIC 作者 Andrew Shouldice 2022-02-21 访谈](https://www.thexboxhub.com/the-tunic-interview-an-exclusive-chat-with-polymath-designer-andrew-shouldice/) | 作者最初按自身建模能力选择平色低模、靠光照建立深度；后来细节过密会与简单世界不一致。作者也明确有音频团队及后期区域装饰／润色帮助 | [研究] 保持共同细节密度与光照语言，比逐件增加精细度更可能支持一致性。不能宣传为单人零手修复刻 TUNIC，不能由采访得出设备性能 |
| [Crashlands 2 开发者访谈，GameMaker 2025](https://gamemaker.io/en/blog/crashlands-2-game-design-interview) | 团队明确保留滑稽动画、鲜明颜色和黑轮廓，同时转用 Clip Studio、Spine 并增加第二名全职美术；从 540p 提到 1080p 改变了可呈现细节和角色比例。战斗以 telegraph 辅助瞄准 | [研究] 一致性可来自固定可识别特征，而非所有资产复杂度相同；屏幕尺寸约束细节预算。反证是画面升级需要新的制作能力，不是一个后处理按钮；540p→1080p 是该团队历史描述，不是通用目标规格 |
| [Riot：Clarity in League，2021-03-12](https://www.leagueoflegends.com/en-us/news/dev/clarity-in-league/) | 其开发者要求重要性与注意力匹配，讨论轮廓／朝向、边界一致性和视觉噪声；Jhin 例子将起手时淡出的边界改为持续可见，也说明过大的提示圆会误导可躲避性 | [研究] 借用“清楚传达规则、维持层次”的机制，不移植 MOBA 全套风格规范。案例含真实改动但不是受控玩家实验，也不代表当前所有皮肤都满足其目标 |
| [Unity 6.3 Render Objects 例子](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/renderer-features/how-to-custom-effect-render-objects.html)与[参考](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/renderer-features/renderer-feature-render-objects.html) | 可按 Layer、AfterRenderingOpaques、Depth Greater 和 Unlit 材质绘制遮挡部分；官方明确多部分模型会自遮挡误高亮，给出排除默认 opaque 层、两个 feature 与 Write Depth 调整的修正。Shader override 模式目前不兼容 SRP Batcher | [研究] 少数对象被墙挡住时，先比较有界对象 pass，别默认全屏边缘检测或复制所有材质。采用成本包括层归属、pass 顺序、角色内部重叠及透明遮挡语义；Material override 和 Shader override 不能混为一谈 |
| [Unity 6.3 Full Screen Pass](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/renderer-features/renderer-feature-full-screen-pass.html) | 注入点可在透明物前、后处理前／后；Requirements 的 Depth/Normal/Color/Motion 会请求额外数据，Everything 全开，Bind Depth-Stencil 也有成本 | [研究] 只有全屏空间确有必要才新增，按实际采样声明输入。效果看起来只有一层，不等于只增加一次廉价绘制；不能仅凭无代码配置判断维护／GPU 成本 |
| [uGUI 2.0 Canvas](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/manual/class-Canvas.html) | Overlay 不依赖场景相机，绘于其他图形之上；Camera 模式与 World Space 则具有不同遮挡关系 | [研究] 不需要世界光照／景深的常规 HUD 可先用 Overlay；世界标记另定遮挡政策。不能把 Overlay 当作“不遮挡玩法”的证明，也不一概为 HUD 新建相机栈 |
| [Unity 6.3 升级指南](https://docs.unity3d.com/6000.3/Documentation/Manual/UpgradeGuideUnity63.html#graphics) | Compatibility Mode 默认剥离，文档不支持以它发行；临时 define 用于迁移，6.4 不再有效 | [研究] 新效果优先原生 Renderer Features；必须自定义时采用目标版本 Render Graph。老教程效果仍可借设计，不直接复制旧 Execute 路径作为新项目底座 |
| [Unity 6.5 on-tile post-processing](https://docs.unity.com/en-us/engine/6000.5/manual/post-processing-and-full-screen-effects/urp/on-tile-post-processing) | 文档要求一般项目 6.5+、untethered XR 6.3+、URP 并关闭 integrated post-processing；支持 grading、vignette、tonemapping、dithering、film grain。Tile-Only 失效会回退 texture sampling，画面相同却无该带宽收益 | [研究] 已在兼容版本与 tile-based 设备上、只需这些效果时🧪原生路径，保留调色气氛而少做帧缓冲往返；它不等于 Bloom、景深、自定义 outline 全都免费。需在设备上用 Render Graph Viewer 确认输入路径，再量测，不为此单独迁移稳定项目 |

### 实现选择：改善什么，牺牲什么

1. **共用预设优于全场复杂 Shader Graph。** [研究] 先用少量环境／角色／玩法提示材质族。粗糙度、高光、受光方式与细节密度形成统一语言；生成结果按这套规格筛选。若玩法要靠灯光辨识可见性或材质，保留相应 Lit 表达，不能为省成本破坏规则。
2. **对象级遮挡提示优于默认全屏轮廓。** [研究] 前者适合“玩家被遮挡但仍需知道位置”，后者才可能服务于整幅画面的明确风格需求。对象级也有额外绘制与顺序成本；全屏基于深度／法线的边缘不一定包含透明效果，纹理内部边界也不是几何轮廓。两者都不能代替环境布局和合法可见信息设计。
3. **关键提示与装饰分开控制。** [研究] 危险边界、方向与生效阶段是玩家采取动作的依据；余烟、碎屑和漂亮拖尾承担氛围。低画质／高并发先缩减后者，但关键提示自身也须控制占屏与叠层。不能只保留全部预警而容许十个实心圆遮住玩家；可用边缘为主、分层或合并策略，但多威胁是否混淆要试玩决定。
4. **调色是统一呈现的末端校准，不是资产修复。** [研究] 同一套 tone mapping／grading 可以收敛观感；它不会修好错误轮廓、过密纹样或一件资产自身烘死的阴影。Bloom 适合让能量峰值有亮感，但不宜成为唯一危险范围；DOF 可用于非交互近景，但是否能进战斗由可玩区域清晰度决定。
5. **预算跟着信号保留。** [研究] 最低设备应优先保玩家、关键危险和接触结果；降低装饰覆盖率、时长或阴影质量后，重新确认深度关系仍成立。材质更简单不自动等于整帧更快，CPU／GPU 限制、填充率和目标分辨率仍要分别测。

### 当前实现的版本与组合边界

[一手] [6000.5.0f1 正式发行页](https://unity.com/releases/editor/whats-new/6000.5.0)标注 2026-06-15 发布，已不是仅有文档的预览能力；[6000.6.0f1 发行页](https://unity.com/releases/editor/whats-new/6000.6.0)也已存在。[Unity 支持政策](https://unity.com/releases/unity-6/support)区分 LTS 与 Update，后者支持至下一版发布。故这里的 6.5 是机制核查版本，不是建议今天新锁定的“最新版”，也不表示该特性已回移到一般 6.3 LTS 项目；采用前重新核当前支持版本、包与目标平台。

[一手] [6.5 Tile-Only 具体约束](https://docs.unity.com/en-us/engine/6000.5/manual/analysis/graphics-performance-profiling/in-urp/on-tile-rendering)：保持 tile 数据需要 tile-based GPU 与支持 native render passes 的图形 API；WebGL 不支持。文档排除 depth／opaque textures、TAA／MSAA、内置后处理、HDR、相机栈、Deferred 等，并对缩放／动态分辨率给 Android XR 例外。验证关闭可能静默离开 on-tile；应在目标设备查看实际图。[研究] 因此依赖深度纹理采样的全屏描边不能默认与它无成本叠加；若画面身份依赖这些功能，保留常规 URP 路径更可能合适。这里没有测得带宽、能耗或帧率改善，不为调色单独升级引擎，也不把“已正式发行”视为本项目稳定性通过。

### 单人无美术修补条件下的最小维护单位

[研究] 不新增框架：在现有材质、效果 Prefab 与动作配置里保存少量视觉角色（玩家／危险／交互／装饰）、主色与辅助形状、阶段时序、最大装饰并发、基础光照／调色配置和目标屏幕尺寸。共享参数可以让 AI 批改，关键轮廓与语义由人判断。没有可用轮廓或材质区域时，先换许可清楚的资产／收窄风格，不把手绘 mask、逐帧修边藏进“程序化”成本。

[研究] 第二次修改用一个真正需求验证生产路线：新增明亮雪地关卡，或让两个相近技能同时出现。好路线能通过少量共享参数、提示形状／边缘和装饰强度修改保住识别；若要逐件补灯、逐个重做 shader 或重生成所有纹理，收窄风格／效果体系。禁止用“全局调暗”掩盖雪地识别问题，也不将改动文件数单独当质量结论。

### 未来试玩应回答的问题，不是截图打分

[研究] 在实际游玩尺寸及最低画质下，按完整动作观察：亮／暗背景切换、角色转身、墙后移动、多个威胁叠加、命中后下一招、HUD 警告出现、掉帧时提示阶段。记录玩家是否认错来源／方向／边界、是否错把余烟当持续伤害、下一危险是否被反馈遮掉；配合帧时间与 GPU pass 观察。灰度／色觉模拟和截图对比可暴露候选问题，不能替代人在运动中的识别与反应。

[研究] 成功不是“特效少”或“对比最大”，而是这类玩法最需要的信息可靠，同时保住目标气氛。探索谜题允许刻意隐藏线索，潜行可见性本身可能是规则，不能全局透视／高亮抹掉挑战。上述试玩仍未执行。

### 本次来源边界

- 官方旧 TUNIC 博客 URL 本次返回 404，Riot 2017 风格指南及 PDF URL 重定向首页；未用搜索摘要冒充已读正文。采用可读的作者访谈及 Riot 2021 一手开发文章替代。
- Unity 6.7 Beta 页作为发现线索，最终 on-tile 判断核到 6.5 版本页；不把 Beta 当发行默认，也不声称 6.3 是绝对最新版。
- 仅分析公开机制，未取得或重用商业游戏资产。

## 静态重复表面的无 UV 替代

核实：2026-10-15（UTC+8）。[研究] 主线二／三；补上“缺 UV 不必直接重贴图／重生资产”的窄替代：静态、无精确语义图案的重复表面先试原生三平面投影。它改变的是坐标来源，不替代原有 PBR 一致性建议，也不放宽资产许可。

### 新证据与采用边界

| 来源 | 可核事实 | 对选择的影响与反证 |
|---|---|---|
| [Unity Shader Graph 17.4 Triplanar](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.4/manual/Triplanar-Node.html)；[固定源码](https://github.com/Unity-Technologies/Graphics/blob/a7e4c051d256a781ab362c64316b125a1e104694/Packages/com.unity.shadergraph/Editor/Data/Nodes/UV/TriplanarNode.cs) | [一手] `GenerateNodeCode` 由 Position × Tile 得投影坐标，每张输入纹理采样三个轴面；Normal 分支解包、重定向并转到指定输出空间。`Setup` 同步 Position／Normal 输入空间；默认 AbsoluteWorld，normal 默认输出 Tangent | [研究] 先用已有节点，不复制一个只混 RGB 的“通用法线 shader”。改变几何不用为该颜色层重新展开 UV；但每图三次采样，不宣称全帧三倍或性能更快。源码是固定公开开发树机制核对，不把该 SHA 当 17.4 发布 tag |
| [Unity 17.4 Position](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.4/manual/Position-Node.html)及上述固定源码的 `RequiresTangent`／`RequiresBitangent` | [一手] Object 相对对象原点；HDRP 的 World 是相机相对，Absolute World 是绝对世界位置。法线转换按所选空间请求切线／副切线 | [研究] 不手接相机相对位置来冒充稳定世界投影；缺可用切线基时，选择与目标 Fragment normal 一致的 World 输出等有效路径，不能把“颜色无需 UV”说成任何 normal 接法都不需切线。大世界原点迁移未实测，AbsoluteWorld 名称不保证项目主动重定位后保持纹样 |
| [UE 5.8 Texturing Material Functions](https://dev.epicgames.com/documentation/unreal-engine/texturing-material-functions-in-unreal-engine) | [一手] WorldAlignedTexture 与 WorldAlignedNormal 按世界单位控制尺寸；提供投影偏移／方向，官方明确动画对象会在固定纹理下移动，出现 swimming | [研究] UE 分别使用颜色与法线函数，不照搬 Unity 节点端口；静态环境可维持共同世界尺度，活动道具／蒙皮角色不沿用默认。未读取需账户的 UE 源码，UE 结论限定于官方函数契约 |
| [Arbiter：Jordan Scott，2018-09-22](https://arbitergame.ca/2018/09/22/devlog-3-environments-concept-art-and-music/) | [一手：开发者历史自述] 地形三平面避免陡坡拉伸，岩石与地形共享颜色纹理／渐变参数；同时承认偶尔手绘特定细节，环境细节还使用高模烘焙 normal | [研究] 支持可复用的统一表面与限制细节，不支持整套流程“无美术”。其普通道具并非全部使用三平面，不能外推到所有资产 |
| [VoxelWorlds：Dennis Bradley，2026-01-20](https://orange-sparrow.itch.io/voxelworlds/devlog/1328176/voxelworlds-devlog-refactor) | [一手：开发者自述] 顶投影的已烘焙网格在坡面拉伸，程序块无 UV；换三平面后作者称两者一致。球面世界还需处理变化的 up，并明确有环境美术指导 | [研究] 不同作者的真实修改支持“陡面／程序网格改坐标来源”这一机制；只是开发中案例，非发售或零手修通过率。文章视距改善属于其 LOD 重构，不能归因于三平面 |

### 二改的实际代价落在哪里

- [研究：从固定公式推导] 世界投影固定 Tile 和基准后，放大／重排静态岩壁不会把同一纹理像橡皮一样拉满整个物体，但纹理相对物体的位置会改变；它保的是表面尺度，不是某块划痕的身份。对象空间使刚体平移／旋转时纹样附着，缩放又会改变世界尺度；不能同时无条件承诺随物体与世界尺度固定。
- [研究] 三平面按几何朝向混合，不识别脸、文字、涂层边界或木纹应沿哪根梁。三向交界处方向纹样可能重影／错接，调 Blend 只是改变混合范围。素材尺寸、投影基准与法线空间可以程序化配置；需要重新画局部遮罩才能得到指定语义时，此候选不满足基准。
- [研究] 这层表面采样无需原 UV，并不生成 lightmap UV、修复碰撞／拓扑或保留旧 mesh 身份。世界原点、分块局部坐标或非均匀缩放改变时，应复核传入坐标、法线和统一偏移；公式不包含项目级自动补偿，不能由“世界空间”推断这些过程天然无缝。
- [经验：后续预注册，未执行] 对同一静态岩壁进行加高、旋转、拼接及改光照；分别看轮廓、纹样尺度、混合带、接块与 normal。把其中一块改成活动机关作为撤回用例。保留原生投影仅需共享参数修改的路线；若须逐面绘补或完整重生，则换现成 UV 资产／收窄需求。若项目使用原点迁移，另加迁移前后对照，不凭静止截图验收。

[研究] 采用评级为🧪，不新增框架或推断已发行质量；独立复核及仓库检查另按最终交付范围记录。

## 重复资产的参数复用不是免费合批

核实：2026-10-16（UTC+8）。[研究] 主线二／三；补全既有“少量主材质、只改颜色／磨损”的运行时选择：✅ 有限预设共享、独立连续状态才分对象参数；🧪 性能路径迁移须改善已定位的热点。不同项目的实现与反证支持这项有条件选择，不支持通用性能排名。

### Unity 6.3：先分材质所有权，再分绘制路径

1. **共享与独占。** [一手] [`sharedMaterial`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Renderer-sharedMaterial.html) 返回的材质被修改时，全部使用者及项目中的材质设置都会受影响；给 renderer 分配另一份已有预设，不等于修改预设。访问 [`material`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Renderer-material.html) 会按需实例化并让该 renderer 独占，此后使用该实例，不是每次 getter 都新建；使用方负责销毁。 [研究] 少量确需独占的对象可显式管理实例，不为每个摆放副本默认复制，也不为局部损伤修改共同源。
2. **制作继承与运行时数据。** [一手] [`Material.parent`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Material-parent.html) 支持变体继承及逐属性覆盖，但只在 Editor 存在，构建时层次扁平化。[研究] 有限配色预设可借它集中维护共同属性，不据此承诺运行时改父材质会广播给全部子变体，或共享一次绘制。
3. **MPB 的内存取舍。** [一手] [MaterialPropertyBlock](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MaterialPropertyBlock.html) 支持同材质的少量属性差异，传入 block 会被复制，容器可复用；不支持改变 render state。它不兼容 SRP Batcher。[研究] 省完整材质副本不等于省整帧成本，不能从 Built-in 的用法推断 URP／HDRP 一律应换 MPB。
4. **SRP Batcher 不等于一次 draw。** [一手] [原生机制](https://docs.unity3d.com/6000.3/Documentation/Manual/SRPBatcher.html) 减少同 shader variant 的准备／状态切换，允许不同材质；持久化材质常量缓冲不等于合并全部 draw calls。[研究] 有限预设且已在该路径的项目，先保留兼容基线，不为少几个材质盲目换路径；反复改材质数据也不能假定更新免费。
5. **传统 instancing 是另一项有条件选择。** [一手] [6.3 GPU instancing](https://docs.unity3d.com/6000.3/Documentation/Manual/GPUInstancing.html) 与[切换说明](https://docs.unity3d.com/6000.3/Documentation/Manual/SRPBatcher-Incompatible.html) 要求核 mesh／material、shader 支持及 renderer；该 MeshRenderer 路径不支持 SkinnedMeshRenderer，转换前后应测 Profiler。对 Built-in 自定义 shader，[逐实例属性契约](https://docs.unity3d.com/6000.3/Documentation/Manual/gpu-instancing-per-instance-properties.html) 要求属性声明为 instanced，MPB 中放 non-instanced 属性会禁用 instancing。这个 shader 配方不能当成 URP 通用实现。
6. **GPU Resident Drawer 是反泛化边界。** [一手] 6.3 [GPU Resident Drawer](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/gpu-resident-drawer.html) 使用 BatchRendererGroup 做 GPU instancing，却要求开启 SRP Batcher；另有 Forward+、compute／平台等条件。[对象兼容文档](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/make-object-compatible-gpu-rendering.html) 排除 MPB，要求支持 DOTS instancing 的 shader。[研究] 所以不能写“所有 GPU instancing 与 SRP Batcher 互斥”，也不能把启用多个名称不同的优化当作收益相加；本题不据此建议迁移整个渲染管线。

### Unreal 5.8：实例化材质与实例化绘制不同

- [一手] [Material Instances](https://dev.epicgames.com/documentation/en-us/unreal-engine/instanced-materials-in-unreal-engine) 区分固定外观的 MIC 与运行时可改的 MID；Scalar／Vector 参数不等于 Static Switch，后者的实际组合会产生编译变体。[研究] 少量配色／损伤沿用原生实例即可，不以“少编译 shader”推导“少 draw calls”。
- [一手] [Mesh Drawing Pipeline](https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-drawing-pipeline-in-unreal-engine) 的动态合并要求相同 shader bindings；相同 Material Instance 可以共享 material uniform buffer，网格、lightmap 与其它绑定仍要匹配。[研究] 多对象共用同一个 MID 的状态，与每对象新建 MID 不同；不能写“一用 MID 就不能合批”，也不能因父材质相同就假定分别创建的 MID 会合批。共享 MID 的参数同时影响它的使用者，不适合彼此独立的损伤状态。
- [一手] [CPD](https://dev.epicgames.com/documentation/unreal-engine/storing-custom-data-in-unreal-engine-materials-per-primitive?lang=en-US) 把标量／向量数据放在 primitive，通过索引与材质参数对接；vector 占连续索引，蓝图和材质要保持一致。官方示例有 draw-call 对比，是示例机制证据，不是本项目收益。[研究] 重复几何只差这些值、每对象材质分裂已是热点时才试；纹理资源、渲染状态或 shader variant 的变化不能仅靠几个浮点索引自动统一。
- [一手] [ISM 文档](https://dev.epicgames.com/documentation/unreal-engine/instanced-static-mesh-component-in-unreal-engine) 区分 Custom Primitive Data 与 Per Instance Custom Data，并说明材质等属性由组件共享。[研究] 已有 ISM／HISM 中，各副本独立变色应核每实例数据入口，不把组件参数误当成每实例参数；不为本题先建完整实例管理器。

### 真实项目：采用机制、修订与收益反证

| 来源 | 实际实现／修改 | 能支持什么；不能支持什么 |
|---|---|---|
| [Chop Chop 的 DissolveHelper，固定 `608eac98…`](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/UOP1_Project/Assets/Scripts/Effects/DissolveHelper.cs) | [一手：源码] 延迟创建并复用 MPB，在协程中更新 `_Dissolve`，再写给 MeshRenderer | [研究] 支持局部效果保留共同材质、只改参数。项目为 [2020.3.17f1](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/UOP1_Project/ProjectSettings/ProjectVersion.txt)／[URP 10.6.0](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/UOP1_Project/Packages/manifest.json)，[README](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/README.md) 声明 2021 年停止开发；这是历史 demo，不是当前 Unity 6 性能或发布质量证明 |
| [BADLADS，MarkJGx，2021-03-25](https://badlads.chemicalheads.com/blog/the-large-update-part-2) | [一手：开发者历史自述] 帽子、车灯、建造物的动态材质改为 CPD，但称测试场景改善 negligible | [研究] 参数迁移确实用于游戏，同时反证减少材质／draw calls 必然明显加速。前一段帧时间减半归因于 PLOD，不是 CPD；不把其巨大 uber shader 或“零额外 draw call”措辞推广到全部场景 |
| [Concord：Evan Liaw 的 Gradient Remap 说明](https://evanliaw.artstation.com/projects/YGBRB3) | [一手：作者实作说明] 材质实例层次便于全地图改色；为不同颜色的 draw-call 成本，从色块实例转向 ramp／LUT＋CPD | [研究] 交叉支持编辑便利与运行时数据组织的取舍。原流程仍制作颜色图、gradient mask，个别需修整，并损失部分颜色保真；不把 AAA 美术流程推荐给单人零手修项目，也不把纹理内存收益归因于 CPD |

[一手／研究] Chop Chop 根 [LICENSE](https://github.com/UnityTechnologies/open-project-1/blob/608eac98df29cd97821a6115cd52dfb9027345b1/LICENSE) 为 Apache-2.0；这里只分析公开机制，未复制代码、shader、图像或游戏资产。项目许可不替代 Unity 包及外部素材许可；BADLADS／Concord 作者文章也不授予其游戏资产复用权。UE 仅核公开文档，没有访问受限引擎源码。

### 二改与撤回：验证状态和预算，不只看材质数

[研究／经验：后续预注册，未执行] 给同一组道具新增阵营色，再让一个副本独立受损／溶解；覆盖取消、池化重用和场景切换。保留同一网格／UV／mask，观察是否串改其它对象、重用后是否残留、材质实例是否随每次使用继续增加。AI 可核参数写入者、资源所有权与实例计数，人确认外观语义和可读性。

[一手／研究] Unity [SetPropertyBlock](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Renderer.SetPropertyBlock.html) 规定 per-material block 优先于 per-renderer block，传 null 可关闭相应 overrides；[GetPropertyBlock](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Renderer.GetPropertyBlock.html) 会完整覆盖传入容器。多个效果写同一 renderer 时核合并／恢复责任，不能让溶解清理顺手删掉阵营色；此为检查点，不据此另造全局参数框架。

[研究] 对照既有路径与候选路径时，固定目标设备、画面和并发，记录实际绘制路径、draw calls／SetPass、shader variants、CPU／GPU 帧时间及驻留内存。只在对应热点和预算改善、状态正确且维护可承受时保留迁移；只有计数器下降而帧时间未改善，或出现更多恢复例外时撤回。


## 重复纹样补研：坐标失败与采样重复分开

核实：2026-10-18（UTC+8）。GA／GB，主线二／三。改变材质页的回退选择：三平面或 UV 映射已经合适、源材质本身可用而大面积周期明显时，先比较素材变体、更多非重复内容和随机分块混合，不把所有重复缺陷都归成需要重新展开 UV 或生成整套资产。[研究]

### 三条可比较路线，不是默认升级 shader

| 现有需求 | 首先比较 | 必须承担的代价／退出条件 |
|---|---|---|
| 少量变化已足够，或砖排／木纹走向需要连续 | 同源参数变体、成套许可素材及明确区域分配 | 变体与驻留管理；关键结构仍需正确源内容与映射，不交给随机拼贴猜 |
| 必须有较大连续、非重复区域 | 真正含更多独特内容的纹理／资产 | 内容生产和内存；只提高分辨率或放大同一纹样不等于增加独特内容 |
| 随机／近随机自然表面，主要缺陷是周期 | 🧪 随机偏移分块、按需旋转及混合的适配候选 | 额外采样／过滤、可能的预处理与移植；重影、色偏、方向接缝或预算不合格则退回前两路 |

这是机制与任务条件的比较，不是质量／成本实测排名。随机采样不创造正确几何或指定语义位置，正确 UV 也不会自动打破源图案的周期；两类失败分别处理。[研究]

### 原方案：减少重复，不保证保住指定结构

[Deliot／Heitz 原作者说明](https://eheitzresearch.wordpress.com/738-2/)介绍 histogram-preserving 混合的简化、mip 级色偏修复及压缩处理。[2019 Unity 作者原文](https://unity.com/blog/engine-platform/procedural-stochastic-texturing-in-unity)将更大纹理、额外遮挡物与随机材质方案并列，但适用范围是随机／近随机自然表面，且明确是非活跃维护的研究原型。[一手]

[Burley 2019，Disney 原论文](https://www.jcgt.org/published/0008/04/02/paper-lowres.pdf)§1解释生产中独特高分辨率纹理的内存／创作负担，以及简单叠加的重影和对比损失；§5与§7展示结构与色彩反例。保持颜色统计不等于保持花、砖排等语义，调整混合权重也不能作为保真承诺。论文的生产背景含手工创作，不证明本基准零手修；其图像生成计时不是当前游戏 GPU 成本。[一手／研究]

**旧 Unity 包只作源码参照。** 固定 [`a77263f`](https://github.com/UnityLabs/procedural-stochastic-texturing/tree/a77263f336611c3b7acf021d5942207ee7223602) 的 README围绕 Unity 2019.2、Shader Graph／LWRP／HDRP 6.7.1，package.json 却写 6.7.0；仓库已归档。不能把替换整套旧 Shader Graph 的说明抄成 Unity 6 安装配方。源码可读不等于当前管线已兼容；本文没有核实 Unity 6 或 Unreal 可直接采用的维护中集成。[一手／研究]

### 同一布局不等于所有通道使用同一公式

旧 Unity [采样节点 L136–208](https://github.com/UnityLabs/procedural-stochastic-texturing/blob/a77263f336611c3b7acf021d5942207ee7223602/Editor/ProceduralTexture2D/SampleProceduralTexture2DNode.cs#L136-L208)由 UV 得到格点与平移偏移，用原 UV 梯度采样并查 mip 相关 LUT，Normal 路径另解包；该实现没有随机旋转。[研究] 同一表面的 albedo、roughness、normal 应保持源点与布局对应，不能各自随机化；但类型相关的值变换和混合仍须分别验，不能因共用 UV 就宣称整套 PBR 语义已通过。[一手／研究]

[Mikkelsen 2022 原论文](https://jcgt.org/published/0011/03/05/paper-lowres.pdf)提出直接采样源纹理、免去 histogram 预处理的适配，代价包括颜色结果取舍；法线方向数据与普通颜色不同。[固定作者实现 L58–101](https://github.com/mmikk/hextile-demo/blob/43c3ed7e18e1e4539fa9323f72d5e2a65147ebb3/hextile-demo/hextiling.h#L58-L101)随分块变换采样梯度，混合前还变换恢复的导数，不能只旋转 UV。它是不同方案，不是给前述 histogram 路径随便加旋转就能等价。[一手／研究]

作者[固定 README](https://github.com/mmikk/hextile-demo/blob/43c3ed7e18e1e4539fa9323f72d5e2a65147ebb3/README.md)还指出：可平铺 normal 不一定对应可平铺 height，平均法线偏斜会被随机旋转明显暴露。该[代码许可为 MIT](https://github.com/mmikk/hextile-demo/blob/43c3ed7e18e1e4539fa9323f72d5e2a65147ebb3/LICENSE)，可以作为另核输入资产许可后的适配起点，不代表素材随代码清权或目标引擎接通。本轮不按 README 安装修图工具；不满足输入条件时先缩小到合适材质／取消旋转／换源，再验证，不能默认为程序已经修好。[一手／研究]

### 较新的混合方法仍有预算和伪影边界

[Wronski 2025 原论文](https://jcgt.org/published/0014/01/02/paper.pdf)§7–8把 Laplacian 混合用于材质层与 hex tiling：省去专门预计算，但增加低 mip 采样与算术；多通道、多层可能使纹理单元饱和。论文还列出 halo／overshoot 和动态混合 aliasing 的可能性。[研究] 它支持按实际内容选择质量／成本，不是“最新方法免费消除重复”的证据；历史桌面硬件结果不外推移动端或当前 Unity／UE。

### 第二改与本次验证边界

先保许可来源和原材质，再扩大地表、换一张颜色／粗糙度图、改变尺度或旋转政策：联合检查近远距离、斜视、运动及光照下的图案、通道对应和法线；使用预处理路线时核派生数据确由新源生成。只在获准的目标引擎／设备阶段测采样、驻留和重建成本；不能用一张近景截图或论文速度替代。需要固定布局／标识时保结构化资产；变体已够用则不增加运行时算法。[研究；验收未执行]

详细机制留本节，正文只保条件选择，不新增材质框架或实验队列。[研究]

## 特效慢放补研：普通混帧、运动图与重烘焙

核实：2026-10-18（UTC+8）；主线二／三，GA／GB。改变既有固定视点 flipbook 的二改选择：保留源并调时长还不够，放慢后内部动画可能需要不同帧间表达。这里只处理装饰内部运动；命中、取消与阶段仍由运行时控制。[研究]

### 先按缺口选择，而不是给每段特效补图

| 当前结果 | 首先比较 | 撤回／代价 |
|---|---|---|
| 短暂呈现或原动画已合格 | 保原播放；有跳变才试现有线性混帧 | 不为功能更高级增加派生纹理 |
| 慢放跳变，普通混合仍双影明显 | 匹配帧列的运动图驱动帧间扭曲，再混合 | 轮廓外溢、显隐错误或预算不合就退回 |
| 相邻帧变化太大或数据不可靠 | 已有合格源增加时间采样重烘焙；否则换源／缩短慢放 | 同尺寸图集加格数会减少单帧像素；保持像素则增加存储需求 |

以上是条件推导，不是三个方案的同题实测排名。运动图估计中间画面，不补回新视角、隐藏几何或正确命中时间；循环与消失阶段也要单独核。[研究]

[Klemen Lozar 2015 原作者教程](https://www.klemenlozar.com/frame-blending-with-motion-vectors/)认为普通动画／crossfade 足以承担多数短暂 gameplay 特效，慢镜头和长时间大效果才更需要运动插值；代价含 shader 与纹理内存。其旧流程包含合成、遮罩、模糊及调试，不能作为零手修成功案例；页面新增 TFlow 入口也不等于本轮核完其许可或生产质量。[一手／研究]

[Shadowist／cEssex 亲历讨论](https://realtimevfx.com/t/motion-vectors-for-animated-textures-how-do-you-generate-them/575?page=2)记录不同来源的尺度／边界处理问题，帧间变化大或扭曲过强仍出错。[社区／研究] 它提供失败方向，不提供通用阈值；本轮未重现，不把某套历史流程的压缩／尺度要求泛化到所有格式。

### 先有合格来源，再核图与消费者的契约

[EmberGen 节点文档](https://docs.jangafx.com/embergen/pages/references/node_list.html)列出 Motion Vector 通道及导出帧数、stride、行列和分辨率；边界覆盖与细节另有 blur 参数。已有合格模拟源可以成套导出，但导出成功不证明目标特效或慢放合格。[一手／研究]

[SideFX Labs Flipbook Textures](https://www.sidefx.com/docs/houdini/nodes/out/labs--flipbook_textures-1.0.html)区分普通8位、Labs编码和16位运动数据，解码、过滤与内存要求不同，并有边界 padding、速度尺度参数。[研究] 因此不能只按文件名接入任意消费者，也不默认最高精度最划算。本节只借契约，不新增软件采购／安装建议。[一手]

只有图像也不是绝对无路：[IlluGen 已发布记录](https://www.jangafx.com/roadmap/illugen/past-releases)含从相邻输入估计的 Optical Flow 与消费 flowmap 的混合功能。[一手] 这支持“图像估计可作候选”，不证明运动准确或零手修；未核完商业准入，不列入产品推荐，不采用厂商的相对精度宣传作横评。[研究]

### Unity 与 Unreal 分别核，不靠同名功能类推

- **Unity VFX Graph 17.3.0**：[输出设置](https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.3/manual/Context-OutputSharedSettings.html)区分 Flipbook、线性 FlipbookBlend 和另需 Motion Vector Map／Scale 的 FlipbookMotionBlend；Generate Motion Vectors 则为 TAA／motion blur 等输出渲染运动数据，不能当帧间图生成器。[一手]
- [Flipbook Player 17.3](https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.3/manual/Block-FlipbookPlayer.html)更新 texIndex；Shader Graph 输出需在 shader 内建立采样，没有同样的 UV Mode 配置。末首混合可受 Clamp Blending 控制，是否循环仍由内容决定。[一手／研究]
- **UE 5.8**：[SubUV_Function 文档](https://dev.epicgames.com/documentation/unreal-engine/texturing-material-functions-in-unreal-engine?lang=en-US)的小数 Frame 做相邻子图混合，证明普通混帧基线，不证明运动估计。历史 UE4 自定义扭曲教程不是当前 Niagara 自动接入保证；采用运动图路线仍核实际材质／外部编码配套。[一手／研究]

### 二改时保住什么

仅改变同一帧列的播放速度，不自动要求重算图；先验最慢速度、循环边界与结束／取消。改形状、采样 stride、帧序、裁切或图集布局后，重新核／导出颜色与运动数据对应及尺度；不能沿用旧图却只看引用未丢。[研究；验收设计]

目标尺寸下比较双影、轮廓外溢、新露出区域和循环跳变，再计附加采样、纹理驻留及重建成本。数据与参数调节仍不足、必须逐帧绘补时，按当前基准撤回，选择更合适的源或收窄慢放。没有此处的产品遮挡修复实测，也不声称参数调整已能解决全部显隐错误。[研究]

不新增实验队列；验证边界同篇首。[研究]

## Cards 覆盖补研：先修材质表达，再决定换源

核实：2026-10-18（UTC+8）；主线二／三，GA／GB。已合格叶片／毛发 cards 重叠出错时，先保 mesh、UV和纹理，判断alpha是覆盖轮廓还是需要渐变半透明；这补充“持续失败换源”，不取消其撤回条件。[研究]

**同一源也会因表达选择失败。** [Ben Golus 2017 原作者对照](https://bgolus.medium.com/anti-aliased-alpha-test-the-esoteric-alpha-to-coverage-8b177335ae4f)用现成bush03：硬cutout在4×MSAA下仍锯齿，改blend却出现叶片内外关系错误，相交面排序不足；只开A2C又出现噪声与密度变化。故先核材质，不将现成源判坏，也不统一开clip／A2C。作者演示不是本仓实测；未重新清权或推荐旧素材包，不复制其shader。[一手／研究]

**覆盖不等于半透明。** [glTF 2.0 alpha契约](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#alpha-coverage)的MASK丢弃像素不写深度，其余写深度；BLEND的正确结果受实现限制。[研究] 轮廓型cards先比较目标管线现成裁剪材质；烟雾、薄纱等需要背景混合时保留相应表达。不能为消除排序错误直接抹掉渐变；相交cards也不默认逐片拆分或自建排序器。[一手]

**引擎条件与反例。** Unity 6.3 [AlphaToMask](https://docs.unity3d.com/6000.3/Documentation/Manual/writing-shader-alpha-to-mask.html)面向MSAA，无MSAA时不同GPU/API结果不可预测，不照搬旧文的自动回退说法；[URP Lit](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/lit-shader.html)支持alpha裁剪。UE5.8 [Forward Renderer](https://dev.epicgames.com/documentation/en-us/unreal-engine/forward-shading-renderer-in-unreal-engine)支持Masked A2C，但换渲染路径有整体特性／预算代价；不为一件头发默认迁移管线。[一手／研究]

[Epic Paragon hair历史示例（4.27文档）](https://dev.epicgames.com/documentation/en-us/unreal-engine/photorealistic-character?application_version=4.27)采用masked＋动态dither，依赖TAA多帧收敛并承认运动伪影；边缘淡出还靠配套头皮纹理遮补。它说明质量代价，不证明任意cards零手修；缺配套源时换资产，不要求程序员补画头皮。[一手／研究]

**二改与撤回。** 现有兼容MSAA路线才按轮廓缺口比较A2C；转视角、近远距离、风动、交叠及阴影一起验。远处覆盖缩失可另比较Unity[保覆盖mip](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/TextureImporter-mipMapsPreserveCoverage.html)，它不修排序。薄丝／密度损失、时域伪影或预算不合就撤回材质迁移，换配套成熟资源或接受不透明几何的风格限制。第二次换纹理或密度后重验，不只看静帧；当前仍是公开契约／作者报告，未执行这些验收。[研究]


## 纹理交付实试：颜色标签之外还要验实际数据

核实：2026-10-23 UTC；接现有材质语义／平铺研究，不扩场景平台。[本仓运行／研究]

**改变的建议：按槽确定源值含义，再做编码；输出DFD正确也不能代替数据保留。** [P124完整复跑](../../experiments/p124-texture-consumer.md)用Poly Haven Brick Wall 001三张CC0配套图和KTX-Software 4.4.2；真实ARM源自带gamma=0.45455。不压缩、不缩放的原1k输入，UNORM隐式导入与convert-linear的R/G平均绝对误差为0.094321／0.095432，assign-linear为0，输出DFD均linear。因此这里需要的是按数据槽“赋语义”，不是把本来就代表线性数据的数值再作颜色变换。[本仓运行]

### 当前选择及真实代价

[2026 Khronos压缩实践](https://www.khronos.org/assets/uploads/developers/presentations/3D_on_the_Web_2026_-_Best_Practices_for_Compressing_glTF_Textures.pdf)把下载、GPU上传、驻留分开，单模型传输优先与多资产场景不应机械使用同一默认。[glTF Transform官方契约](https://gltf-transform.dev/modules/extensions/classes/KHRTextureBasisu)也明确注册扩展不执行压缩，且其输出没有可选PNG/JPEG回退；ETC1S对normal／ORM需特别检查。[一手]

P124固定512基线：颜色ETC1S，normal与ARM分别比较ETC1S／UASTC。三图全ETC1S为129,134B，数据槽UASTC为646,975B；normal的RGBA8解码mean角误差9.74°→2.37°，ARM的R/G/B RMSE由0.03571／0.02641／0.00939变为0.00466／0.00545／0。UASTC降低此组诊断误差但约5倍总文件；不宣布通用赢家，继续以实际相机、下载和设备约束决定。[本仓运行／研究]

所有误差相对固定512输入，不把1024→512损失归给编码；预处理按颜色线性光／数据数值／法线向量分别平均，仍未验远处mip、法线方差补偿、平铺接缝和观感。官方原生提取与Three随包Basis WASM两个真实入口的level 0 RGBA逐字节一致，底层不是独立算法。BC7转码块成功并进入Three材质CPU对象，只证明这些数据／对象操作；RGBA8诊断不冒充BC7最终误差，输出块字节不冒充GPU驻留。[本仓运行]

### 真实失败来源与后续修改

[2025-08 Three用户原帖及维护者诊断](https://discourse.threejs.org/t/unsupported-vkformat-in-three-ktx2loader/86562)显示：即便已有transcoder文件，当时仍因容器中的PVRTC格式未获加载器支持而失败；维护者随后补到r180，设备支持仍另核。同帖mip长度校验错误被维护者判为不妨碍正确加载，不能当成该次失败原因。P124没有复现该帖资产，而是依据这一瓶颈检查自己的实际输出和真实解码；[当前KTX2Loader文档](https://threejs.org/docs/pages/KTX2Loader.html)要求设备能力检测，CPU结果不能替代浏览器接收。[社区亲历／一手／研究]

另实测KTX 4.4.2 `--normal-mode`：它会换成X→RGB、Y→alpha，按普通XYZ解释出现mean 81.37°角误差。结果支持保默认RGB法线时不启此开关，不支持“压缩器损坏了法线”的结论。按配方二改则先隔离目标纹理对象、统一各槽repeat，再只改roughness乘法因子，保对照、采样属性、块字节和源哈希。[一手／本仓运行]

预设计的错误颜色空间、只改颜色槽平铺、共享纹理误改、截断和缺文件，另作为回归；不包装成真实发现。工具／源许可、固定版本、命令、完整数值及未验范围均在P124，无模型／引擎／浏览器／视觉验证，不代表AI生成资产的零手修成功率或生产成本。[本仓运行／研究]
