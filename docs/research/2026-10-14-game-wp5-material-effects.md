主线：二／三／四；G1 材质、特效的额外能力、第二次修改和发行门槛
改变的建议：03 材质特效行从“比较工具”收敛为“共同参数源材质＋可控运行时优先；生成贴图／视频只填明确缺口”
新证据：核读2026-07 Material Maker 1.7固定源码、2026-10导出故障原帖、2026-08 Effekseer变更及10月XR补丁、MatLat 10月论文与非商用权重、Adobe当前资产许可和真实采用反证

# WP5 材质与特效：共同参数源、运行时与生成边界

核实时间：2026-10-13 UTC（2026-10-14 UTC+8）。本轮仅阅读公开文档／源码／论文／开发者记录；没有安装软件、下载权重、运行模型或游戏引擎、购买服务、访问用户电脑。证据中的运行数字均标明来源，不是本轮实测。正文见[材质与特效](../../domains/game-dev/assets/materials.md)，授权汇总见[WP1](2026-10-14-game-wp1-licensing.md)。

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
| 多通道接缝/尺度不一致 | 所有通道相同UV、物理尺寸、tile次数、边界wrap；统一平铺处理及mip padding | 每通道独立无缝化可改变边界关系；补一张不代表整套一致 |
| 导入后反光不对 | 固定导出预设、线性/颜色空间、通道pack；检查光照、曝光和色调映射 | OpenPBR标识不保证不同引擎同像素；降到目标Lit模型时高级层可能丢失 |

[一手／经验] 规范依据为P1/P2，单图歧义与生成边界见A2/A3/G1–G3。以上是验收方法，不是已测自动修复率。

[经验] 非写实/固定灯光不是“不必一致”：可以明确选择unlit/手绘烘焙外观，此时固定阴影是风格的一部分，但必须承认动态日夜、可移动灯或近景写实反射的玩法限制，不应再宣传它是可重新打光PBR。

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

- **M1 [一手，固定源码]** [Material Maker 1.7](https://github.com/RodZill4/material-maker/releases/tag/1.7)，2026-07-14，SHA `4c6cea67b659e1eb472f91590e06b2b1c5245916`。该版更新包括PBR metallic默认值、subgraph导出及修复；[固定README](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/README.md)说明默认MIT。不是沿用搜索摘要的1.4RC。
- **M2 [一手]** [材质节点/导出说明](https://rodzill4.github.io/material-maker/doc/material_nodes.html)：导出可以是PNG/EXR纹理、模板及buffer。由此采用“保图源＋按引擎烘焙”，不推断所有动态节点或材质模型在每个管线都有等价效果。
- **M3 [一手：源码；社区：故障复现]** [#1506](https://github.com/RodZill4/material-maker/issues/1506)始于2026-07-16 Linux 1.7批导出崩溃、GUI可导；2026-10-10另有Windows两GPU复现和临时规避自述。核读[固定parse_args.gd](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/parse_args.gd#L98-L168)，`--size`写入`texture_size`，实际传入导出的仍是初始化2048的`image_size`；这是源码可确认的参数接线问题，不需运行才发现。[固定multi_renderer.gd](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/addons/material_maker/engine/multi_renderer.gd#L172-L196)亦有异步初始化路径；崩溃时序及补丁收益本轮未实测，不将评论中的12/12作为自己验证。**改建议：GUI参数图可采用，1.7无人值守CLI先验证修复、输出尺寸、失败退出和缺目录超时；不直接把CLI/MCP封装宣传为稳定资产工厂。**
- **M4 [一手]** [Poly Haven纹理标准](https://docs.polyhaven.com/technical-standards/textures)2026-05-28，要求成套地图、真实尺寸和photo-based制作；这是零手修现成基线的可检查规格，不是保证任一8K贴图适合目标设备。下载后应按占屏和预算降规格。
- **M5 [一手]** [Material Maker官网素材库](https://www.materialmaker.org/materials)许可筛选分CC0/CC-BY/CC-BY-SA，不能用编辑器MIT替整库放行。本轮没有核实已发行游戏从Material Maker到发行的全程零手修案例，因此不把star数、作者展示或导出支持当生产验证。

### A：商业材质路线不是只列服务名

- **A1 [一手]** [Adobe 2026-07-21更新](https://blog.adobe.com/en/publish/2026/07/21/adobe-substance-3d-unveils-new-innovations-deliver-faster-workflows-openpbr-everywhere-digital-twins-scale)：Designer 16、Sampler及Painter 12.1推进OpenPBR，材料库转换也在进行。采用参数化和明确定义的材质语义；Painter新Skew Map Painting仍是人工绘修功能，不能计为本基准自动过关。公告不是Unity/Unreal一致性测试。
- **A2 [一手]** [Sampler Image to Material](https://experienceleague.adobe.com/en/docs/substance-3d-sampler/using/filters/tools/image-to-material)与[Delight](https://experienceleague.adobe.com/en/docs/substance-3d-sampler/using/filters/tools/delight-ai-powered)，2026-04-07文档：AI路径推断normal/height/roughness并去阴影高光；B2M为程序化估计。保留可试候选，不承诺被遮挡细节可被正确还原。
- **A3 [一手：产品经理答复]** [UV输入失败案例](https://community.adobe.com/questions-69/material-settings-not-ticked-630115)，2024-01-10：产品方明确I2M不是为UV set贴图而设计。该证据旧于Sampler 6，作为输入风险，不宣称新版本所有UV输入必败；后续若有专门UV保真路径应重审。
- **A4 [一手，成本]** [价格调整FAQ](https://helpx.adobe.com/substance-3d/pricing-change.html)给出个人Texturing月付US$24.99、年预付US$249.88，Collection月付US$59.99、年预付US$599.88，自2025-03-25起；[当前计划页](https://www.adobe.com/products/substance3d/plans.html)动态金额未稳定抽取。本轮只把FAQ作预算参考，不称2026-10最终报价；地区、税及各应用包含范围在购买时核。按整套材料库和修改工时算成本，不把单张生成价当资产价。

### G：前沿联合PBR研究为什么暂不替代默认

- **G1 [研究：作者论文]** [MatLat v2](https://arxiv.org/html/2512.17302v2)，2026-10-08。在材质潜空间联合学习RGB、roughness、metallic，并用局部性约束改善跨视图投影一致性。它支持“专门联合模型优于任意RGB模型分别猜通道”的研究方向，不能据此称包含完整height/normal或具有商用交付证明。
- **G2 [一手：许可与源码]** MatLat固定SHA `a0ce5d359bb58cad503099d109955b1c88dbab05`（2026-07-16）。[README](https://github.com/KAIST-Visual-AI-Group/MatLat/blob/a0ce5d359bb58cad503099d109955b1c88dbab05/README.md)与[官方权重卡](https://huggingface.co/32V/MatLat)明确checkpoint v1.0.0为CC BY-NC 4.0。**⛔商用生产不用这些免费权重**；论文的CC BY 4.0不是权重许可。代码根`LICENSE`读取404，不能宣称代码MIT；依赖还包括SD3.5、LPIPS、nvdiffrast、Real-ESRGAN和LaMa，未做完整依赖商用审计。
- **G3 [研究：作者明确局限]** [VideoMatGen](https://arxiv.org/html/2603.16566v1)，2026-03-17，联合base color/height/roughness/metallicity，论文§5自述8×A100单资产2–3分钟、视角不连贯会鬼影/模糊、烘焙仍是简单投影。**👀研究观察，不作本地省钱默认**；没有核得完整可商用部署包，本轮不推荐安装。
- **G4 [一手：供应商能力，不是成品证明]** [Scenario VFX Hits模型说明](https://help.scenario.com/articles/5002595381-scenario-models-custom-trained)描述的是爆炸/能量爆发等外观；[视频分层](https://help.scenario.com/articles/8235214611-image-to-layers-and-video-to-layers-the-essentials)可导alpha视频层。单帧效果与去背景能力不证明循环、击中帧、逐帧边缘或six-way材质；因此商业生成服务仅作探索对照。本轮未审特定Scenario底模/LoRA完整授权，不能放入商用推荐默认。

### V：运行时、模拟烘焙、生成flipbook三分

- **V1 [一手]** [Unity 6.0粒子选型](https://docs.unity.com/en-us/engine/6000.0/manual/visual-effects/particle-systems/choosing-your-particle-system)：Built-in Particle System提供完整C#粒子读写与物理交互；VFX Graph用GPU并暴露属性/事件。选已有项目的实现，避免只因“百万粒子”换图系统；平台/compute支持与管线按具体版本核。
- **V2 [一手]** [Effekseer 1.80.7变更](https://effekseer.github.io/Helps/18x/Tool/en/ReleaseNotes/18x.html)（2026-08-22）含Unity6.5/URP RenderGraph相关工作及数据加载加强；此前1.80.5修过vertex-buffer增长/内存泄漏。最新Unity插件[2026-10-06固定提交](https://github.com/effekseer/EffekseerForUnity/commit/ae9bd12596edb12013c98cafc06c71ccf195cc49)只允许Unity renderer在符合条件时走XR raster pass，源码明确native renderer未测XR。**不能从“支持Unity”泛化到全部渲染后端、XR或目标平台；编辑器、插件、效果格式分别锁版本。**
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

| 精确范围 | 代码/工具与权重层 | 输出/资产使用及发行边界 | 地域/营收/成本与建议 |
|---|---|---|---|
| Material Maker 1.7 `4c6cea6…` | [固定MIT](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/LICENSE.md)，默认文件许可见README；无生成权重层 | 图的输入贴图、外部节点和社区材料另核；库有CC0/BY/BY-SA，不能整库套MIT | 已读MIT无专门营收/地域门槛；本地免费路线，官网/Steam发行入口不改变具体输入素材许可 |
| Poly Haven指定纹理 | 非模型软件，无权重层 | [官方资产许可CC0](https://polyhaven.com/license)允许商用、修改/分发；logo/网站文字/预览渲染不自动CC0 | 没有资产营收门槛；[API页](https://polyhaven.com/our-api)2026-07-18明确含商用免费，live API产品需向用户标示来源、请求使用独有User-Agent等；这是服务条件，不改变资产CC0，也不授权任意抓站 |
| Adobe Substance Designer/Sampler商业席位＋Substance 3D Assets | 封闭软件订阅，无开放模型自托管权；库资产按专属许可而非软件输出归属 | [当前2025-04-22专属条款](https://www.adobe.com/go/substance3dassets)§2、§3只允许作为Modified/Larger Work发行，禁独立提取；§4已付费下载资产可在退订后继续合规使用；§3.3禁用资产/衍生输出创建、训练、测试、改进AI/ML；EDU例外不能外推 | 条款资产授权worldwide不等于服务每地可买；按Adobe账户/地区规则。商业库存材料可作游戏候选，不作LoRA训练默认；非Adobe生成模型另核 |
| Effekseer运行时与工具、指定新CC0样例 | [固定主MIT](https://github.com/effekseer/Effekseer/blob/82b37081a302b9f9eff0bf14dc6c845fca8c3c54/LICENSE)，分发runtime保留通知；无权重 | [样例页](https://effekseer.github.io/en/contribute.html)新样例区CC0；旧区project弾幕GIrls／NITORI BOX／LotusCraft使用旧许可，页面只确认随Effekseer播放免费，不能默认烘焙后换runtime或独立售包 | MIT无所见营收/地域门槛；逐包留许可/来源。选择新CC0包可同时比较原运行时与flipbook |
| EmberGen商业许可（本轮文档接口，非安装版本验收） | 封闭软件，不开放权重；[EULA](https://jangafx.com/legal/end-user-license-agreement)2025-07-19 §2、§3、§5 | 商业License允许商业制作；trial导出只有买许可后才能商用，教育版不得商业产出；导入内容权利自负，不声称工具转让额外独占版权 | [当前Indie永久价](https://jangafx.com/software/pricing?license=nodelocked&rebill=permanent&type=indie)US$300首年、可选维护US$180/年，未税且维护默认续订可退出。EULA Indie需核当年/前一年合并收入或项目预算<US$1M及商业委托客户门槛；营销FAQ的母公司简化说法不可覆盖EULA |
| MatLat checkpoint v1.0.0 | 固定代码README与权重卡明确CC BY-NC 4.0；根LICENSE未核得通用代码授权，依赖另核 | 未见可覆盖商业生产的单独输出授权，不能用论文CC BY或开放下载代替 | ⛔非商用研究观察，不放本地免费商用默认；须另取得商业许可才重审 |
| 原生Unity/Unreal材质与粒子 | 属已选引擎使用范围，无额外生成权重 | 引擎模板/商店包/第三方flipbook仍逐个核，不声称原生功能赋予全部样例商用权 | 沿用项目适用引擎订阅/royalty与平台条款；本WP没有重审引擎全套合同 |

[一手／研究] 需特别保留的冲突：EmberGen当前价格FAQ称Indie月租18个月得永久，所读EULA §2.5/2.7仍写12个月；本建议只列直接永久购买价格，不替读者裁决冲突、不承诺月租转永久时间。服务地区和出口限制未做完整国家列表，不写“全球无条件”。

## 七、收口、撤回条件与未完成项

- [研究] 本轮改变：参数化/现成默认、联合通道而非各自生成、运行时与flipbook组合、CLI导出与许可新边界。无需等运行实验才停止错误推荐。
- [经验] 稳定可商用生成器若能在相同预算下通过共同PBR结构和二改测试，替代生成暂缓；否则保留参数图和现成库。
- [经验] 项目只需固定视点装饰、完全不需重打光和取消，允许生成flipbook候选；需要逐帧抠图、补烟边、画遮罩时按基准失败。
- [研究] MatLat、VideoMatGen没有实际游戏零手修采用证据；Effekseer/EmberGen有采用但非该基准证明；Material Maker生产批处理存在当前故障信号。未以宣传数量填补证据缺口。
- [研究] 尚未做：视觉像素/资产包实物核查、引擎性能、批导出修复运行、真实两次修改、最终商店发行审查；不应写“范围内实测通过”。文档离线检查不替代以上资产和引擎验证。

## 八、集成复核与离线验收

2026-10-14 UTC+8：内部独立复核固定Material Maker参数接线、Effekseer XR提交、新旧样例许可、Adobe输入/资产条款和MatLat权重卡；补URP同图同时赋Metallic/Occlusion槽，以及Poly Haven live API含商用免费但另履行来源标示/User-Agent条件。WP1、03与既有入口同步更新；正式云端评审仍待完成。

实际运行`python3 scripts/check_offline.py`完整14阶段：97/26/10/13/14项测试均通过，无skip，8项shell语法通过；`git diff --check`通过。检查的是本仓文档/config与确定性/模拟夹具，不是Material Maker修复、模型效果、原生引擎、hosted CI或零手修资产发售验证。**[研究：验证范围]**
