主线：二／三／四；G1 材质、特效的额外能力、第二次修改和发行门槛
改变的建议：03 材质特效行从“比较工具”收敛为“共同参数源材质＋可控运行时优先；生成贴图／视频只填明确缺口”
新证据：复核 Material Maker 1.7 固定源码与导出故障、Effekseer 1.80.7／XR、MatLat 非商用权重；新增 Adobe 地区价格快照、Scenario 免费商用限制与数据使用条款冲突；补 TUNIC／Crashlands 2 作者对风格与生产成本的说明、URP 遮挡提示／全屏效果及 on-tile 组合边界

# WP5 材质与特效：共同参数源、运行时与生成边界

核实时间：2026-10-14（UTC+8）；动态事实复核于同日完成。本轮仅阅读公开文档／源码／论文／开发者记录；没有安装软件、下载权重、运行模型或游戏引擎、购买服务、访问用户电脑。证据中的运行数字均标明来源，不是本轮实测。正文见[材质与特效](../../domains/game-dev/assets/materials.md)，授权汇总见[WP1](2026-10-14-game-wp1-licensing.md)。

## 动态事实表：采用前再核，最迟 2026-11-14

[一手／研究] 以下只记录本次可读的一手页面与固定版本，不表示实际安装版本或已通过资产生产验收。复核日期是维护期限，不是许可有效期；采用、上传、购买或升级早于期限时，先做相应复核。引擎合同仍回到 WP1，不在本 WP 重复裁定。

| 事实／精确范围 | 一手来源 | 核实日期 | 下次复核 | 对建议的影响 |
|---|---|---|---|---|
| Material Maker releases 仍标 1.7 为 Latest；固定 SHA `4c6cea6…` | [发布页](https://github.com/RodZill4/material-maker/releases/tag/1.7) | 2026-10-14 | 采用前或 2026-11-14 | 图编辑可采用；不把主分支变化当已发布修复 |
| 1.7 的 `--size` 解析未传给导出；#1506 有跨平台故障自述 | [固定源码](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/parse_args.gd#L98-L165)、[原帖](https://github.com/RodZill4/material-maker/issues/1506) | 2026-10-14 | 批处理采用前或 2026-11-14 | CLI 仍试用；参数接线已核，崩溃／补丁收益未复现 |
| 编辑器 MIT；社区库有 CC0、BY、BY-SA 分区 | [固定许可](https://github.com/RodZill4/material-maker/blob/4c6cea67b659e1eb472f91590e06b2b1c5245916/LICENSE.md)、[素材库](https://www.materialmaker.org/materials) | 2026-10-14 | 选入每件素材前或 2026-11-14 | 免费工具不覆盖输入素材；保留逐件许可 |
| Poly Haven 资产 CC0，网页预览／文字等除外；API 另有条件 | [许可](https://polyhaven.com/license)、[API](https://polyhaven.com/our-api) | 2026-10-14 | 采用／API 接入前或 2026-11-14 | 指定纹理仍是免费基线；不扩大为任意抓站许可 |
| Designer 16、Sampler 6 是 2026 公告所述代际；7 月公告含 Painter 12.1/OpenPBR | [官方公告](https://blog.adobe.com/en/publish/2026/07/21/adobe-substance-3d-unveils-new-innovations-deliver-faster-workflows-openpbr-everywhere-digital-twins-scale) | 2026-10-14 | 锁定实际补丁版前或 2026-11-14 | 保留参数图路线；公告版本不称安装版或最新补丁 |
| Adobe 当前页面返回日本 Collection 个人 ¥8,180/月、团队 ¥16,280/月/席，含税 | [当前计划](https://www.adobe.com/products/substance3d/plans.html) | 2026-10-14 | 购买前或 2026-11-14 | 旧美元 FAQ 撤出实时预算；必须按账户地区报价 |
| Substance Assets 当前指向 2025-04-22 条款；限制独立分发及资产／衍生输出用于 AI | [资产专属条款](https://www.adobe.com/go/substance3dassets) | 2026-10-14 | 采用／训练用途改变前或 2026-11-14 | 游戏内合规使用可选；不作训练库默认 |
| Effekseer 1.80.7（2026-08-22）；Unity 6.5／UE 5.8 支持为变更声明 | [变更记录](https://effekseer.github.io/Helps/18x/Tool/en/ReleaseNotes/18x.html)、[XR 固定提交](https://github.com/effekseer/EffekseerForUnity/commit/ae9bd12596edb12013c98cafc06c71ccf195cc49) | 2026-10-14 | 锁版本／目标后端前或 2026-11-14 | 工具／插件／格式分锁；native renderer 的 XR 不写已验证 |
| Effekseer 新样例区 CC0，旧样例区仅明确随 Effekseer 播放免费 | [官方样例页](https://effekseer.github.io/en/contribute.html) | 2026-10-14 | 选包／烘焙换 runtime 前或 2026-11-14 | 仅指定新 CC0 包作运行时与烘焙对照 |
| EmberGen Indie node-locked 永久：首年 US$300，可选维护 US$180/年；未税、默认续维护 | [精确方案页](https://jangafx.com/software/pricing?license=nodelocked&rebill=permanent&type=indie) | 2026-10-14 | 购买前或 2026-11-14 | 纳入维护与税；不将永久理解成终身免费升级 |
| JangaFX EULA 为 2025-07-19；trial 商用须购许可，Indie 有收入／预算条件；月租永久期与 FAQ 冲突 | [EULA](https://jangafx.com/legal/end-user-license-agreement)、[价格 FAQ](https://jangafx.com/software/pricing?license=nodelocked&rebill=permanent&type=indie) | 2026-10-14 | 采用／购买前或 2026-11-14 | 保留商业模拟候选；不承诺月租 12 或 18 个月自动转永久 |
| MatLat 权重卡仍是 v1.0.0、CC BY-NC 4.0；论文 v2 不覆盖权重许可 | [权重卡](https://huggingface.co/32V/MatLat)、[论文 v2](https://arxiv.org/html/2512.17302v2) | 2026-10-14 | 商用准入前或 2026-11-14 | 非商用研究观察，不进本地免费发行默认 |
| VideoMatGen v1 是研究论文；本轮仍未核得完整商用部署包 | [论文及作者项目链接](https://arxiv.org/html/2603.16566v1) | 2026-10-14 | 发现新发布／采用前或 2026-11-14 | 不把论文吞吐量换成本地成本或交付证明 |
| Scenario VFX Hits 与 alpha 分层是供应商能力声明，无固定底模版本或通过率 | [模型页](https://help.scenario.com/articles/5002595381-scenario-models-custom-trained)、[分层页](https://help.scenario.com/articles/8235214611-image-to-layers-and-video-to-layers-the-essentials) | 2026-10-14 | 试用／锁模型前或 2026-11-14 | 仅隔离对照，不替代可取消的玩法特效 |
| Scenario 价格页显示 US$15/45/75 月额；免费输出仅个人／评估；自助数据使用以条款核 | [价格](https://www.scenario.com/pricing)、[2026-07-16 条款 §3/4/9](https://www.scenario.com/terms-and-conditions) | 2026-10-14 | 上传／购买／发行前或 2026-11-14 | 不承诺免费商用或不训练；计费切换、具体模型权利需补核 |

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
- **A4 [一手，成本]** [当前计划页](https://www.adobe.com/products/substance3d/plans.html)本次返回日本地区 Collection：个人 ¥8,180/月、团队 ¥16,280/月/席，含税。这是地区页面快照，不是读者所在地报价。[2025 调价 FAQ](https://helpx.adobe.com/substance-3d/pricing-change.html)的美元金额仅是历史参考，不再作当前预算默认。购买前核地区、税、承诺期及应用包含范围。成本按整套材料库和修改工时算，不按单张生成价算。

### G：前沿联合PBR研究为什么暂不替代默认

- **G1 [研究：作者论文]** [MatLat v2](https://arxiv.org/html/2512.17302v2)，2026-10-08。在材质潜空间联合学习RGB、roughness、metallic，并用局部性约束改善跨视图投影一致性。它支持“专门联合模型优于任意RGB模型分别猜通道”的研究方向，不能据此称包含完整height/normal或具有商用交付证明。
- **G2 [一手：许可与源码]** MatLat固定SHA `a0ce5d359bb58cad503099d109955b1c88dbab05`（2026-07-16）。[README](https://github.com/KAIST-Visual-AI-Group/MatLat/blob/a0ce5d359bb58cad503099d109955b1c88dbab05/README.md)与[官方权重卡](https://huggingface.co/32V/MatLat)明确checkpoint v1.0.0为CC BY-NC 4.0。**⛔商用生产不用这些免费权重**；论文的CC BY 4.0不是权重许可。代码根`LICENSE`读取404，不能宣称代码MIT；依赖还包括SD3.5、LPIPS、nvdiffrast、Real-ESRGAN和LaMa，未做完整依赖商用审计。
- **G3 [研究：作者明确局限]** [VideoMatGen](https://arxiv.org/html/2603.16566v1)，2026-03-17，联合base color/height/roughness/metallicity，论文§5自述8×A100单资产2–3分钟、视角不连贯会鬼影/模糊、烘焙仍是简单投影。**👀研究观察，不作本地省钱默认**；没有核得完整可商用部署包，本轮不推荐安装。
- **G4 [一手：供应商能力，不是成品证明]** [Scenario VFX Hits 模型说明](https://help.scenario.com/articles/5002595381-scenario-models-custom-trained)介绍的是捕捉爆炸／能量爆发外观的 LoRA；[Video to Layers](https://help.scenario.com/articles/8235214611-image-to-layers-and-video-to-layers-the-essentials)输出带 alpha 的视频层，按时长和分辨率计成本。它们不证明循环、击中帧、烟边或 six-way 材质合格，仍只作探索对照。
- **G5 [一手：现行价格与条款]** [价格页](https://www.scenario.com/pricing)显示 Starter/Pro/Max 为 US$15/45/75 每月、1,500/5,000/10,000 月额度；文本抽取没有锁定月付／年付切换状态，不当作可结账报价。该页明确付费方案含商用许可、免费输出仅个人／评估；[2026-07-16 v2.1.1 条款](https://www.scenario.com/terms-and-conditions) §3.1 将免费限制指向价格页，§4.3 的输出归属不应覆盖方案限制。免费额度不作为发行资产来源。
- **G6 [一手／研究：保留反证]** 同一价格页声称不将数据用于训练，但现行条款 §4.6 允许自助账户内容用于改进服务／AI；签署企业 MSA/DPA 才有更强承诺。§9 的第三方模型政策和输入处理还须逐模型核对。**不把“输出归用户／付费可商用”写成“不训练／可自托管／权利无风险”。** 本轮没有获得 VFX Hits 精确底模／LoRA 全链授权，也没有账户内治理页证据；保持隔离候选，上传未公开项目资产前先解决数据使用边界。

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

### 2026-10-14 动态事实补核

[一手／研究] 本次重读上述版本、价格、许可和 Scenario 页面，新增免费输出限制与数据使用条款反证，修正 Adobe 地区价格口径。只做公开资料审读与两份文档编辑；本次 `python3 scripts/check_repo.py` 检查 177 文件、零错误，两个文件的 `git diff --check` 通过；未重跑整套离线测试。链接检查不验证片段锚点、外部网页或事实，也不改变引擎／模型未实测边界。

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

[研究] 成功不是“特效少”或“对比最大”，而是这类玩法最需要的信息可靠，同时保住目标气氛。探索谜题允许刻意隐藏线索，潜行可见性本身可能是规则，不能全局透视／高亮抹掉挑战。本轮未进行这些试玩；无识别率、净工时或性能增益数据。

### 本次来源边界

- 官方旧 TUNIC 博客 URL 本次返回 404，Riot 2017 风格指南及 PDF URL 重定向首页；未用搜索摘要冒充已读正文。采用可读的作者访谈及 Riot 2021 一手开发文章替代。
- Unity 6.7 Beta 页作为发现线索，最终 on-tile 判断核到 6.5 版本页；不把 Beta 当发行默认，也不声称 6.3 是绝对最新版。
- 仅采用公开机制和原创综合判断；没有取得或重用商业游戏资产、安装插件、运行源码、访问用户电脑或建立云任务。
