主线：二／三；G1 2D 资产选型与第二次修改
改变的建议：[研究] 原生可修改对象与匹配成套资产优先；生成区分静态、逐帧和骨骼，PixelLab／Retro 仅作条件首试
新证据：[一手] 2026-10-14 模型／服务契约、固定瓦片／精灵源码、包许可及开发者返工；未运行模型／引擎，原生编辑能力不证明零手修成套生产

# WP2：2D资产的前沿方法与零手修边界

核实时间：2026-10-14（UTC+8）。本轮只有来源调查与比较，成本为官方标价或作者报告，未测生成通过率、主动工时或目标设备。完整商用门槛随新增方案回填[WP1](2026-10-14-game-wp1-licensing.md)。

## 1. 第二次修改为什么优先改结构

**[一手／研究]** Unity UI Toolkit把文本、样式、尺寸和背景切片保留为字段；[文字](https://docs.unity3d.com/6000.0/Documentation/Manual/UIE-work-with-text.html)和[USS属性](https://docs.unity3d.com/6000.0/Documentation/Manual/UIE-USS-SupportedProperties.html)可分别变更。因此“换语言、价格变长、按钮变宽”优先改原生控件，不把文字烘焙进生成图片。仍须验字体许可、字形覆盖和目标尺寸，不承诺自动排好全部语言。

**[一手：固定源码]** [RuleOverrideTile](https://github.com/Unity-Technologies/2d-extras/blob/8de698ac55b7ed01ec95a43e714c6358505b8110/Runtime/Tiles/RuleOverrideTile/RuleOverrideTile.cs)用原Sprite到替代Sprite映射复用规则；[官方Missing Original Sprites说明](https://docs.unity3d.com/Packages/com.unity.2d.tilemap.extras@4.0/manual/RuleOverrideTile.html)明确原Sprite被换掉仍可能留下缺失映射。换雪地外观可复用邻接规则，增加分叉道路必须改连接规则和对应图。不是“替换PNG就完成二次修改”。[AnimatedTile源码](https://github.com/Unity-Technologies/2d-extras/blob/8de698ac55b7ed01ec95a43e714c6358505b8110/Runtime/Tiles/AnimatedTile/AnimatedTile.cs)只播放已有帧、设速度/起点，没有补动作机制。

旧GitHub仓库已停止开发；上面固定代码用于解释机制，生产路线选[匹配Unity的官方包](https://docs.unity3d.com/6000.0/Documentation/Manual/com.unity.2d.tilemap.extras.html)。本轮只读[官方registry](https://packages.unity.com/com.unity.2d.tilemap.extras)及[4.1.2包](https://download.packages.unity.com/com.unity.2d.tilemap.extras/-/com.unity.2d.tilemap.extras-4.1.2.tgz)，没有安装执行。包为2,129,707字节，SHA-256 `b9a9d2c431d22af101ef60ee3cfa7b0721532f55dd849b0ad3bf2b100d42ace2`；包内LICENSE外链UCL而未固定版本，当前[官网UCL](https://unity.com/legal/licenses/unity-companion-license)为1.4。实际第三方通知含Animation/Rule/RuleOverride等MIT历史贡献，不能以旧仓库仅Line Brush的通知替代，也不能把整包当MIT或跨引擎代码。**[一手：官方包；研究：版本/许可边界]**

现成资源沿用前轮资料核查：Game-icons所查三张SVG是单前景路径，不是瓶盖/液体等语义部件；Kenney Generic Items彩/白图集不能共用切片坐标，独立PNG更易保留身份。前者[固定作者许可](https://github.com/game-icons/icons/blob/82d948812bfe3f269ef8f731dcdb07b08160edc4/license.txt)按作者区分，后者[官方包](https://kenney.nl/assets/generic-items)CC0。这里继承来源，不把旧清点重算成新实验。**[研究：既有检查；经验：先选匹配源而非硬改成任何风格]**

## 2. 精灵动画：控制身份不等于控制动作

[153次生成开发复盘](https://sbsgames.dev/blog/ai-sprite-animation)（2026-09-23）报告角色身份仍在、局部比例却漂；脚底/嘴部对齐不能消除每帧重画，复用分层又出现关节僵硬与接缝。是作者小样本自评，非本仓复测，也不能推成所有模型做不到。**[一手：开发者报告]**

[Unity官方精灵生成说明](https://unity.com/blog/unity-ai-sprite-generator)（2026-04-28）实际将五秒视频等距采样为16帧，定位原型占位；“animation-ready”说明接入便利，并非零手修发行质量背书，更不是禁止发行的许可条款。**[一手]** 对攻击命中、取消窗口、循环首尾，均匀抽帧不保证保住关键姿势；重定时能重排好帧，不能创造缺帧。**[经验：机制推断]**

[JatCool/AI-Sprite-Animation@3818664](https://github.com/JatCool/AI-Sprite-Animation/tree/3818664861613905a377eca26c4ea940c06a646d)（2026-10-05）把源图、rig、姿态分离：[处理代码](https://github.com/JatCool/AI-Sprite-Animation/blob/3818664861613905a377eca26c4ea940c06a646d/package/Editor/SpriteFrameProcessor.cs#L272-L310)用全帧union裁切并重算同一源pivot，[保存姿态](https://github.com/JatCool/AI-Sprite-Animation/blob/3818664861613905a377eca26c4ea940c06a646d/package/Documentation~/ai-pose-rig.md)后可不重跑模型改帧。但[自动rig](https://github.com/JatCool/AI-Sprite-Animation/blob/3818664861613905a377eca26c4ea940c06a646d/package/Editor/RigAutoBuilder.cs)仍按身体比例/关节距离启发式划部位，推荐流程含paint parts；作者只测48像素侧面人形，仍有攻击未回idle、1像素离地。**[一手：源码／作者测量，未独立图像验收]**

**[经验]** 采用“源像素—rig—姿态分离”和共同坐标机制，暂不采用整包的任意输入零手修承诺。其[代码许可说明](https://github.com/JatCool/AI-Sprite-Animation/blob/3818664861613905a377eca26c4ea940c06a646d/docs/licenses.md)为MIT，不覆盖输入美术/可选模型，本轮只借机制、不作为已清权整包推荐。程序改参数属于本场景，人工描部位不属于；有正确现成分层时可改动作参数，没有时先缩小动作/方向或换资产。

[SpriteToMesh v1](https://arxiv.org/html/2602.21153v1)（2026-02-24）只解决分割/布网，骨骼仍列未来工作，域来自赌场Spine资产；[Sprite Sheet Diffusion](https://arxiv.org/html/2412.03685v1)联合外观、姿态和时序，但夸张人体检测失败仍用人工标注；[2025 CVMP短文](https://marcovolino.github.io/docs/papers/2025-wong-cvmp.pdf)的末端像素化更优报告来自845帧/人工关键帧选择。它们支持约束组合或末端降采样的研究路线，不足以推荐默认训练，也不证明小像素动画全链完成。**[一手：论文，未复测]**

## 3. 瓦片和自动QA：先确定它究竟验证什么

[Tiled Terrain原文](https://docs.mapeditor.org/en/stable/manual/terrain/)分corner、edge、mixed与简化blob，所需图块不同。须分开：单图自身周期性、允许的异种邻接/角、引擎采样/图集露缝。规则、内容和采样分别修，不能把一张可重复纹理叫完整地形组。**[一手／经验]**

固定[ai-pixel-art-image-generation@19dbb4d](https://github.com/ianlintner/ai-pixel-art-image-generation/tree/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a)：[QA代码](https://github.com/ianlintner/ai-pixel-art-image-generation/blob/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a/scripts/lib/qa_metrics.py)只测每块对应边像素的RGB欧氏距离均值，再对整套取均值，不测A接B、角和alpha；动画门槛原注释针对walk接触帧，却在通用动画入口按f0/f2剪影IoU及bbox漂移判定；不足三帧则比较首尾。复制静止帧也可能通过，正确大幅攻击反而可能失败，不能将步行假设泛化为所有动作；[通用生成入口](https://github.com/ianlintner/ai-pixel-art-image-generation/blob/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a/scripts/generate_animation.py)虽接收attack仍使用同组验证。[无缝处理](https://github.com/ianlintner/ai-pixel-art-image-generation/blob/19dbb4d5b655f8c4c0c8f979dd89baeb10237b0a/scripts/lib/seamless.py)强制RGB边缘平均，不能生成连接语义。**[一手：源码；研究：反例推导，没有执行上游验证器]**

**[经验]** 借局部palette/导出处理，拒绝把整包自动QA当发布门槛。帧验收应分别覆盖有运动、运动正确、首尾和状态衔接；瓦片按真实允许邻接关系验。纯数值相似度可能奖励静止，须回到玩法判据。

## 4. 程序可修与应收窄的边界

- 透明边：硬alpha并不证明抠对；[Unity RGB dilation](https://docs.unity3d.com/Manual/texture-type-sprite.html)可缓解透明边滤波伪影，不能补回被删的手指。像素与柔边绘制/VFX采用不同alpha约定。**[一手／经验]**
- 对齐：共同画布、union bounds和源pivot可保持坐标；逐帧按bbox居中/等大可能抹掉正确跳跃/武器伸出，脚底锁仅对支撑相适用。**[经验：源码机制推导]**
- 第二次需求：改价格/语言用原生文本，换主题用映射，改命中时刻用已有动作参数；新增方向、遮挡或轮廓是内容变化，不由文件格式工具自动补齐。**[经验]**
- 若必要缺陷只能人工画mask、补肢体、刷权重解决，则该路线对该玩法不满足零手修，改动作范围、风格或资源来源；未知通过率不应填假数字。**[经验]**

## 5. 当前前沿：原生参考编辑与透明输出，附商用约束

**[一手]** 2026-09-08 [GPT Image 2.5发布](https://openai.com/index/introducing-chatgpt-images-2-5/)与[当前接口](https://developers.openai.com/api/docs/guides/image-generation)提供Flare/Sunburst固定snapshot、透明PNG/WebP与多档质量。Sunburst偏编辑精度，Flare偏速度；接口仍说明mask不是严格像素锁定、角色和布局可能失误。最小总像素655,360，不原生输出32/64像素游戏格；大图缩小后必须重新判断辨识度。**[经验]** 透明静态资产优先评估Sunburst，若Flare同规格通过率相当则换低等待路线；绝不从官方定位推出全行业冠军。

**[一手]** Google [Nano Banana2.1模型页](https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1)（页脚2026-10-06）列stable、最多14参考、1K/2K/4K；输入数量不保证所有主体正确。[图像指南](https://ai.google.dev/gemini-api/docs/image-generation)的Lite并非多轮/多参考默认，本轮未找到原生alpha契约。**[经验]** 对无需alpha的概念、背景、插图，把付费2.1列性价比首试；不能把PNG容器推成原生透明，抠图/淘汰成本可能逆转价格优势。

**[一手]** [FLUX3 Image](https://docs.bfl.ai/flux_3/flux3_image_overview)提供多参考、[边界框](https://docs.bfl.ai/flux_3/flux3_image_bounding_boxes)与不同输出档；默认grounding开启，商业权重仍是洽谈入口。**[经验]** 布局敏感静态图可作补充对照；原创资产没有搜索需求时关grounding，框仍是模型条件而非引擎布局保证。本轮无原生alpha契约及同题游戏效果证据，不夺走透明资产首试位置。

**[一手]** Qwen-Image-2.1 [固定模型卡](https://huggingface.co/Qwen/Qwen-Image-2.1/blob/d26bb61231c349cf6b7896fa83353113880e1ba3/README.md)（2026-09-20）统一生成/编辑、原生RGBA、十参考；7B指视觉生成组件，不能当全管线显存。但[代码许可](https://github.com/QwenLM/Qwen-Image-2.1/blob/bb8e2172e08c6720652a4a23ad1c406e5b6ed1ee/LICENSE)与[权重许可](https://huggingface.co/Qwen/Qwen-Image-2.1/raw/d26bb61231c349cf6b7896fa83353113880e1ba3/LICENSE)同为Qwen Research，§2商业生产需另许，无小团队自动豁免。本轮两许可文本7831字节一致，SHA-256 `8dc973f024ff95966bea25866efa443fd16776dcb1001e681e3d467ea572b28d`。**[经验]** 不把免费本地商用从Apache旧版升到2.1；技术更合适仍须先补商业授权。

**[经验：三档取舍]** 本地优先小批静态用[FLUX.2-klein-4B](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/README.md)，精细改稿对照[Edit-2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511/blob/6f3ccc0b56e431dc6a0c2b2039706d7d26f22cb9/README.md)，初图保留2512。此为许可/控制性/部署条件的建议，不是独立质量排名；4B不足不能免费升级9B/dev商用。没有适合硬件时，现成资源或商业API可能更便宜。

已另查[Seed官方目录](https://seed.bytedance.com/en/models)、[Microsoft新模型入口](https://microsoft.ai/?post_type=new)、[xAI Image2发布](https://x.ai/news/grok-imagine-image-2)。它们作为尚待具体许可和同任务证据的补充对照，不因未列首选而认定更差，也不以品牌数量充作覆盖质量。**[研究：选型边界]**

## 6. 风格控制：先最少原生参考，再考虑训练

**[经验]** 从玩法规格确定视角、占屏尺寸、线宽、光向、色阶与锚点；批准少量母版，分清身份/风格/布局参考的职责。新资产从母版分叉，保留版本与来源；不要连续把失败修改当新真值。只有形体/内容确需变化才生成，染色、状态角标、文字和布局优先确定性处理。

**[一手／经验]** [BFL LoRA文档](https://docs.bfl.ai/flux_2/flux2_klein_training)仍支持风格/角色训练，但[官方示例](https://docs.bfl.ai/flux_2/flux2_klein_training_example)用base-9B，不能直接套免费商业生产；base-4B许可另核且参数效果重验。只有跨多类资产反复漂移、训练源权利与质量足够、能摊销维护成本时再评LoRA；作者示例也有多训后过写实反例。不能让小批道具先支付训练和维护成本。

[Diffusers IP-Adapter原文](https://huggingface.co/docs/diffusers/using-diffusers/ip_adapter)针对受支持模型族，非任意新模型通用插头；旧SDXL已验证管线可保留，原生多参考已满足时不再叠adapter/编码器许可链。FaceID不是装备/背面/动作一致性的完整解答。**[一手／经验]**

[Layered固定说明](https://github.com/QwenLM/Qwen-Image-Layered/blob/54c4fe47e76d745775e03fc66ee38457280ed9ea/README.md)重点是图像分解成多RGBA，不能假定自由语义层控制或隐藏结构恢复。**[经验]** 必须不变的像素留在已批准图层，模型只生成变动部件，再合成；确定性合成只保证保留部分没改，不保证最初分层正确。调色板能规范色数，不能修透视、身份或姿态。

## 7. 成本与真实产物：不从标价推可用资产价

核价2026-10-14（UTC+8），美元、未含税；以下是调用价格而非ChatGPT/Gemini订阅配额。**[一手：官方计价；研究：口径]**

| 方案 | 可核口径 | 不能推导的结论 |
|---|---|---|
| [Image2.5 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) / [Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) | Standard图像输出$30/M tokens，Batch $15/M；图像输入$8/M、缓存$2/M，文本输入$5/M | 同token单价不等于同单张成本；旧Image2计算器不估2.5消耗，须实际usage，不能抄旧单图表 |
| [Nano Banana2.1](https://ai.google.dev/gemini-api/docs/pricing#gemini-nano-banana-2.1) | Standard 1024平方输出$0.0336、2048平方$0.0504；输入与思考另计 | 同尺寸不是同质量，抠图/参考输入/淘汰可能使最终成本更高 |
| [FLUX3](https://docs.bfl.ai/quick_start/pricing) | 当前1K $0.048、2K $0.10，按所选档收费 | 10月8日结束的五折活动价不能继续作为预算；模型未通过目标尺寸不计成功资产 |
| 本地klein4B/Qwen指定旧版 | 没有许可证按张收费 | GPU、电费、装配、等待、维护及主动筛选成本均非零 |

**[经验]** 总生成/编辑、算力/后处理及主动工时费用，除以实际通过尺寸、成套一致性及修改验收的资产数；拒绝样本必须计入。接受率未知就不填“每角色成本”，也不声称更便宜API必省钱。

[To the Abyss, We Dive!作者复盘](https://itch.io/devlog/1623777/72-hours-to-the-abyss-the-full-timeline.amp)（2026-08-10）明确色键/裁边/降采样/调色后，除Volt外精灵仍逐像素修补。**[一手：作者自述，未运行游戏或核原图]** 它是AI辅助真实作品，不是本基准零手修成功；未锁model ID，不能归到10月Nano2.1。玩法必须精确多向小像素动作时，改用匹配成套素材或缩小动作范围，不用后处理数量掩盖人工美术。

[ai-assets固定README](https://github.com/tzachshabtay/ai-assets/blob/c54df5190ab04374e061b0078b4dbbfb32d6d013/README.md)已将Sunburst列默认，但其[hero manifest](https://github.com/tzachshabtay/ai-assets/blob/c54df5190ab04374e061b0078b4dbbfb32d6d013/demos/space-invaders/src/ai-assets/Graphics/hero.ship.json)和[hunter manifest](https://github.com/tzachshabtay/ai-assets/blob/c54df5190ab04374e061b0078b4dbbfb32d6d013/demos/space-invaders/src/ai-assets/Graphics/Invaders/invader.hunter.json)仍指向2026-06的Image2产物及更早1.5版本。**[一手：固定产物记录]** 可以借稳定ID、保留版本、promote/revert与生产静态文件的机制，不能把工具模型升级当新模型游戏实战已验证。本轮未独立验PNG视觉或全部淘汰图。

[RISEBench++ v1](https://arxiv.org/abs/2610.12343v1)作者于2026-10-08报告多轮推理编辑仍非无误；其任务准确率不得拿来充本游戏资产接受率。论文、厂商展示、开发者采用与本仓运行分别记录。**[一手：预印本；研究：不可跨任务外推]**

## 8. 下一次验证与当前结论范围

资料已足以支持：原生可修改表示优先；多参考/透明编辑替代纯文生抽卡起点；静态、动画、瓦片分开；授权先于最新型号；只在原生路径反复失败且训练源充足时评LoRA。仍未证明任一最新模型的几百件成套资产、第二次换装、实际计费、目标设备和打包后的零手修闭环。**[研究]**

后续经允许才做小切片：同一母版/目标尺寸下新增外观相似但功能不同道具，或改变攻击时序/地形连接；保留全部拒绝图、usage、主动工时与修改前后资产。当前不执行该试验。**[经验：后续区分方案的最小任务]**

[研究] 初稿独立复核已修正 RGB 距离、全网证据措辞，并核价格／快照、Qwen 许可、QA 步行假设、JatCool 手工 paint 与 UCL；完整离线检查结果见阶段 F 末尾。

## 9. 阶段 F-b：图像动态事实表

2026-10-14 重新读取下列官方原文。`2026-11-14／选型前`表示建议最迟复核日；换型号、套餐、地区、输入用途或合同版本时提前复核，不表示已有定时监控。价格为美元 API 标价，不能代替账户实际账单或订阅权益。[一手／研究]

**审计两个疑点均已消除。** 官方图像指南在同一小节点名 Sunburst 和 Flare，随后明确两者的透明背景都使用 `background: "transparent"`，输出格式为 PNG 或 WebP；Flare 另有独立型号页和日期快照。单一型号页没有重复透明说明，不构成“不支持”的证据；这次确认的是接口契约，没有调用模型验证边缘质量。[一手／研究]

| 事实 | 来源 | 核实日 | 复核日或触发 | 对推荐的影响 |
|---|---|---|---|---|
| Sunburst 存在；固定 `gpt-image-2.5-sunburst-2026-09-08`；官方定位重编辑精度，可用于 Image API 或 Responses 图像工具 | [Sunburst 型号页](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst) | 2026-10-14 | 2026-11-14／选型前 | 保留透明静态精改首试；定位不等于游戏实测冠军 |
| Flare 存在；固定 `gpt-image-2.5-flare-2026-09-08`；官方定位快速日常高质量生成，支持文本／图像输入和上述两 API 入口 | [Flare 型号页](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) | 2026-10-14 | 2026-11-14／选型前 | 保留速度对照，不把它当不存在或仅消费端功能 |
| 两者均支持透明 PNG/WebP；质量档包括 low/medium/high/xhigh/max/auto；总像素至少 655,360，边长倍数为 16 | [图像指南：Size and quality options](https://developers.openai.com/api/docs/guides/image-generation#size-and-quality-options) | 2026-10-14 | 2026-11-14／接口变化时 | 保留透明推荐；32/64 像素格须缩小后验收 |
| 两者 Standard 每百万 token：文本输入 $5、缓存 $1.25，图像输入 $8、缓存 $2、图像输出 $30；Batch 图像输出 $15；旧 Image 2 计算器不能估 2.5 消耗 | [Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst)、[Flare](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) | 2026-10-14 | 2026-11-14／预算前 | 同费率不证明同单张成本；用实际 usage、接受率与等待成本决定 |
| OpenAI API 输出在双方之间、法律允许范围归客户；输入清权、输出审查由客户负责；默认不以内容改进服务，除非明确同意 | [Services Agreement §4](https://openai.com/policies/services-agreement/) | 2026-10-14 | 2026-11-14／签约或地区变化 | API 路线有条件保留；不以 ChatGPT 订阅替代 API 合同 |
| API 服务访问／提供受支持地区清单限制，不能从 API 访问规则推导离线游戏的全球销售禁区 | [官方 API 地区清单](https://help.openai.com/en/articles/5347006-openai-api-supported-countries-and-territories) | 2026-10-14 | 2026-11-14／实际访问前 | 使用者按真实所在地核查，不绕过地区限制 |
| 旧 `gpt-image-2-2026-04-21` 仍列型号快照；ChatGPT 图像功能另受居住地消费条款管辖，不能当固定 API 快照 | [旧型号页](https://developers.openai.com/api/docs/models/gpt-image-2)、[非欧洲条款](https://openai.com/policies/row-terms-of-use/)、[条款入口](https://openai.com/policies/terms-of-use/) | 2026-10-14 | 2026-11-14／换入口时 | 保留历史产物标识，不将旧演示归为 2.5 实证 |
| `gemini-nano-banana-2.1` 存在；支持 1K/2K/4K、最多 14 张参考；这些是能力上限，不是主体一致性保证 | [Google 型号页](https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1) | 2026-10-14 | 2026-11-14／选型前 | 保留无 alpha 要求插图的性价比首试 |
| Nano Banana 2.1 Standard：输入 $1.50/M，文本及思考输出 $7.50/M，图像输出 $30/M；1K $0.0336、2K $0.0504、4K 约 $0.113；Batch 分别 $0.0168/$0.0252/$0.0567 | [Google 定价相应型号段](https://ai.google.dev/gemini-api/docs/pricing#gemini-nano-banana-2.1) | 2026-10-14 | 2026-11-14／预算前 | 原价格确认；计入输入、思考、搜索、拒绝样本，不能当全调用总价 |
| Google 不主张生成内容所有权且输出可能重复；Paid 不用于改进产品但有有限安全日志；Unpaid 通常允许改进及人工审阅，EEA/瑞士/英国与 active billing 条件另见正文 | [Gemini API 条款](https://ai.google.dev/gemini-api/terms) | 2026-10-14 | 2026-11-14／账户或合同变化 | 商用及保密路线仍须区分 API、AI Studio 和消费者订阅 |
| Gemini API 访问须在可用地区；面向 EEA/瑞士/英国用户的 API Client 只能用 Paid Services | [条款](https://ai.google.dev/gemini-api/terms)、[地区](https://ai.google.dev/gemini-api/docs/available-regions) | 2026-10-14 | 2026-11-14／实际访问前 | 离线生成与向玩家开放 API 分开评估 |
| FLUX 3 Image 当前 768sq/1K/2K/4K 每张 $0.041/$0.048/$0.100/$0.607，响应含 cost；计价按 resolution 档 | [BFL 定价](https://docs.bfl.ai/quick_start/pricing) | 2026-10-14 | 2026-11-14／预算前 | 确认原 1K/2K 预算，不套过期促销 |
| FLUX 3 Image 有多参考及 bounding-box 布局入口；grounding 默认开启，可设 false | [官方功能页](https://docs.bfl.ai/flux_3/flux3_image_overview) | 2026-10-14 | 2026-11-14／选型前 | 保留布局专项对照；原创素材不需搜索时关闭 grounding |
| FLUX API 非 EU 合同允许合规商业输出，保留来源凭证；默认授予服务商改进／训练用输入输出的许可；自托管不是 API 合同所授权 | [Developer Terms §3–6](https://bfl.ai/legal/developer-terms-of-service)、[API Terms §2](https://bfl.ai/legal/flux-api-service-terms) | 2026-10-14 | 2026-11-14／地区或合同变化 | 保密项目先核合同；EU 版不能由本次非 EU 阅读放行 |
| klein-4B 及 base-4B 各自权重 LICENSE 为 Apache-2.0；独立 flux2 推理代码亦为 Apache-2.0 | [4B 权重](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/main/LICENSE.md)、[base-4B 权重](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-4B/blob/a3b4f4849157f664bdbc776fd7453c2783562f4d/LICENSE.md)、[固定代码](https://github.com/black-forest-labs/flux2/blob/50fe5162777813d869182b139e83b10743caef15/LICENSE.md) | 2026-10-14 | 2026-11-14／换 checkpoint 时 | 保留本地免模型许可费首试；软件通知、依赖和输入另核 |
| klein-9B 与 FLUX.2-dev 权重为 Non-Commercial v2.1：模型限非商业／非生产；输出商用条款不反授商业运行 | [9B 许可](https://huggingface.co/black-forest-labs/FLUX.2-klein-9B/blob/main/LICENSE.md)、[dev 许可](https://huggingface.co/black-forest-labs/FLUX.2-dev/blob/main/LICENSE.md) | 2026-10-14 | 2026-11-14／换许可时 | 不免费升级商用；无小团队自动豁免 |
| BFL 商业自托管按选定模型和付费计划授权，须报告用量；许可到期／终止后停用并删除模型，API 接入另约 | [Self-Hosted Terms §1–8](https://bfl.ai/legal/self-hosted-commercial-license-terms) | 2026-10-14 | 2026-11-14／购买或终止前 | 不把一次下载当永久商用权，也不自行推断旧输出权利 |
| Qwen-Image-2512、Edit-2511 官方卡为 Apache-2.0；对应 Qwen-Image 代码 Apache-2.0 | [2512](https://huggingface.co/Qwen/Qwen-Image-2512)、[2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)、[固定代码](https://github.com/QwenLM/Qwen-Image/blob/6b5e1f5cec987d404be5ac6657db3b9aacb56a89/LICENSE) | 2026-10-14 | 2026-11-14／换 checkpoint 时 | 保留初图与编辑本地对照；模型许可不保证输出独占或清权 |
| Qwen-Image-Layered 官方卡与独立代码 Apache-2.0，可分多 RGBA 层 | [模型卡](https://huggingface.co/Qwen/Qwen-Image-Layered)、[固定代码许可](https://github.com/QwenLM/Qwen-Image-Layered/blob/54c4fe47e76d745775e03fc66ee38457280ed9ea/LICENSE) | 2026-10-14 | 2026-11-14／换版本时 | 保留分层专项候选；不等于恢复被遮挡内容或可绑定源稿 |
| Qwen-Image-2.1 代码 Research License §2 仅非商业研究／评估；当前官方模型卡也标 Research License。HF 固定 LICENSE 的 raw/blob/resolve 本次提取失败，不能声称此次重算了旧哈希 | [固定代码许可](https://github.com/QwenLM/Qwen-Image-2.1/blob/bb8e2172e08c6720652a4a23ad1c406e5b6ed1ee/LICENSE)、[当前模型卡](https://huggingface.co/Qwen/Qwen-Image-2.1) | 2026-10-14（代码与卡已核；权重原文复取未成） | 2026-11-14／任何商业采用前 | 保留暂缓默认商业；不能以旧 Apache 版本或 RGBA 功能清权 |
| Adobe 自有 Firefly Image Model 5 在官方当前列表；非 beta 输出可商用，beta 除产品明禁；FAQ 列中国、俄罗斯、白俄罗斯等不可用 | [型号列表](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/current-firefly-promotions.html)、[FAQ](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/adobe-firefly-faq.html) | 2026-10-14 | 2026-11-14／实际生成前 | WP1 条件候选保留；未取得同题接受率，不替换本页三档 |
| Adobe 输出仍须输入清权、保留水印／来源元数据，禁止用生成输出训练或改进 AI；第三方模型和指定计划赔偿另约 | [2026-04-23 特别条款 §1–3、7–8](https://www.adobe.com/cc-shared/assets/pdf/legal/servicetou/adobe-generative-ai-product-specific-terms-en-us-20260423.pdf) | 2026-10-14 | 2026-11-14／合同或计划变化 | 普通商用不等于成品游戏 IP 赔偿；不能拿 Firefly 输出训练风格 LoRA |
| Kenney Generic Items 官方页仍为 CC0，提供免费获取；该包许可不替商标／肖像或其他包清权 | [指定资产包](https://kenney.nl/assets/generic-items) | 2026-10-14 | 2026-11-14／换包时 | 保留现成图标优先 |
| Game-icons 固定版按作者为 CC BY 3.0 或明确标出的 CC0；Lorc/Delapouite 仍需署名，不能整库当 CC0 | [固定许可](https://github.com/game-icons/icons/blob/82d948812bfe3f269ef8f731dcdb07b08160edc4/license.txt) | 2026-10-14 | 2026-11-14／新增作者资产时 | 保留匹配图标，但按作者留许可和改动说明 |
| ComfyUI 固定编排代码为 GPL-3.0；商用不被禁止，分发须履行 GPL；节点／checkpoint 不由此清权 | [固定 LICENSE 原文](https://raw.githubusercontent.com/Comfy-Org/ComfyUI/8010b48d2c1be986613f8e8c761527d205bd756f/LICENSE) | 2026-10-14 | 2026-11-14／换节点或部署方式 | 保留已有本地工作流，不拿编排器许可包办全链 |
| Tilemap Extras 4.1.2 官方包 LICENSE 外链 UCL；本次重读 2,129,707 字节包并核得上文同一 SHA-256；第三方通知含 Rule/Rule Override 等 MIT 贡献，整包不是 MIT。UCL 当前 v1.4，需有效 Engine License | [官方包](https://download.packages.unity.com/com.unity.2d.tilemap.extras/-/com.unity.2d.tilemap.extras-4.1.2.tgz)、[当前 UCL](https://unity.com/legal/licenses/unity-companion-license) | 2026-10-14 | 2026-11-14／换 Unity 或包版本 | 保留匹配版本包；未安装执行，不扩大到跨引擎代码许可 |

本表没有把未读取的账号权益、原生 alpha 的缺省值、免费商用追溯、未公开许可或模型成功率写成确定事实。固定版本源码／许可继续以正文 SHA 为复现锚点；动态入口用于检查是否出现影响后续选型的新合同。[研究]

## 10. 阶段 F-c：像素专用服务补缺

**结论：🧪 PixelLab 进入“像素小资产、同一动作批量换装”的质量／控制性专项首试；🧪 Retro Diffusion RD Fast/Plus 进入低成本静态像素对照，RD Pro 作为多参考升级。两者均为云服务，不占本地免费档；完整成套现成资产仍优先。** 这是按许可、低分辨率接口和第二次修改控制选择的试验顺序，未生成、导入或测量成套一致性。[研究]

### 先核许可和数据，再谈动画

- **PixelLab：** [2025-11-23 条款 §1–4](https://www.pixellab.ai/termsofservice)允许合规商业使用／修改／分发输出，不授服务软件或模型权重；禁止未经许可拿输出训练模型，并引用 [Open RAIL-M](https://github.com/CompVis/stable-diffusion/blob/main/LICENSE)的用途条件。程序化使用走官方 API；转售／另建服务应先联系。输入和第三方权利仍由用户负责，合同“own copyrights”不能保证所在法域实际承认 AI 输出版权。[一手／研究]
- **PixelLab 保密：** FAQ 的“不训练”不能覆盖条款 §3.4 的通知例外；生成前检查 UI／工具说明是否通知训练或保存。套餐页面另列俄罗斯、白俄罗斯、伊朗、委内瑞拉不支持，不能从可读文档推定当地可购买／可使用。[一手]
- **Retro Diffusion：** 云端浏览器读取 [2026-09-28 新条款 §4–7、11](https://retrodiffusion.ai/terms)。输出在双方之间归生成者，涵盖免费、余额、套餐、API/MCP；不保证独占或版权。用户不可将输出用于 AI 训练、微调、蒸馏或评估，服务商可用输出改进／训练自身模型；免费输出和自愿公开内容可能连同提示、设置公开。自动化须官方 API/MCP/官方应用／扩展，不以网页脚本代 API。MCP 仓库 MIT 不授服务权重。[一手／研究]
- **Retro 的适用日期：** 新账号从 9 月 28 日起适用新版；此前账号延后 30 天，即 10 月 28 日前仍适用 [2025-08-19 旧版 PDF](https://retrodiffusion.ai/assets/terms-8312c717.pdf)。旧版 §7 保留用户 Designs/Materials 权利，§3/6 的自动化禁令没有新版的明确 API 例外；不能替现有账号提前套新版。PDF 本轮从官方链接读取正文，未登录或接受新协议。[一手／研究]

### 控制性：改同一组帧，而不是重新抽一组

PixelLab [当前 API 目录](https://www.pixellab.ai/pixellab-api)有 Pixflux/Bitforge 的低分辨率、参考、强制调色板和透明输出路径；`animate-with-text-v3` 接受起帧及可选末帧，最高 256×256、最多 16 帧。`edit-animation-v2` 和 `transfer-outfit-v2` 分别用于跨帧指令修改、参考换装，适合验证“第二次修改保动作、换装备”。**教程的接口范围已滞后：** [Edit animation](https://www.pixellab.ai/docs/tools/edit-animation-pro)和[Transfer outfit](https://www.pixellab.ai/docs/tools/transfer-outfit-pro)仍写仅 Aseprite/Pixelorama 扩展，但当前 API 目录已明确列出对应端点；保留 API 候选，实际调用前复核 schema，不能因教程措辞就认定 API 不存在。[一手／研究]

按教程尺寸约束，32–64px 的批改最多 16 帧，换装最多 15 帧；81–128px 分别降到 4/3 帧。长动作分组后会新增组间漂移风险。姿态或骨骼输入是生成条件，不证明输出保持同一拓扑或可直接导出可编辑骨架；返回一组可继续编辑的位图，与导出语义图层／rig 是不同交付。[一手／研究]

Retro 的[官方 API 示例](https://github.com/Retro-Diffusion/api-examples/blob/main/README.md)和[MCP 文档](https://github.com/Retro-Diffusion/retro-diffusion-mcp/blob/master/README.md)列参考图、透明背景、调色板、图生图、Wang/blob tileset、GIF/sprite-sheet，以及基于起帧的动作生成；RD Pro 最多 9 张参考。采用其低分辨率和结构化导出作为对照，不把“game-ready”或“保持角色”宣传当逐帧验收通过。[一手／研究]

**共同撤回条件：** 同规格换装后脚底、武器接触、事件帧或方向身份漂移且只能手画修复；新瓦片不能接旧地形；第二次修改必须反复整组重抽。此时改用现成动画／已有正确分层／更少动作方向。脚本可重排、裁切、统一 palette 和检查坐标，不能修缺肢体或缺遮挡面。[经验]

### 像素专项的动态事实增量

| 事实 | 来源 | 核实日 | 复核日或触发 | 对推荐的影响 |
|---|---|---|---|---|
| PixelLab 为专有云服务；条款允许合规商业输出，禁未经许可用输出训练；结合 Open RAIL-M 用途条件 | [条款 §1–4](https://www.pixellab.ai/termsofservice)、[所链 RAIL-M](https://github.com/CompVis/stable-diffusion/blob/main/LICENSE) | 2026-10-14 | 2026-11-14／选型前 | 纳入专项试用；不能拿这些图再训练自有风格模型 |
| PixelLab 月付公开初始价 $12/$24/$50，分别 2000/5000/10000 generations/月；某些工具一次消耗多个 generations，非逐张成品价 | [套餐](https://www.pixellab.ai/#checkout)，云端浏览器选中月付查看 | 2026-10-14 | 2026-11-14／预算前 | 不混用套餐额度和 API 估价；未购买，税／实际账户另核 |
| PixelLab 免费试用显示 40 次快速、之后每天 5 次慢速最多积累 20；商用输出说明覆盖试用；地区排除 Russia/Belarus/Iran/Venezuela | [套餐及脚注](https://www.pixellab.ai/#checkout) | 2026-10-14 | 2026-11-14／使用前 | 可提出零购买对照，但免费云额度不等于本地免费或全部工具可用 |
| Pixflux 64×64 非透明 API 估价 $0.00793、透明 $0.0084；Edit animation/Transfer outfit Pro ≤128px 每调用估价 $0.08，≤170px $0.115，≤256px $0.15 | [官方 API 目录对应端点](https://www.pixellab.ai/pixellab-api) | 2026-10-14 | 2026-11-14／预算前 | 静态与跨帧编辑分开计费，估价不当账单或接受成本 |
| PixelLab 当前 API 已列批量编辑和换装端点，与功能教程“仅扩展”范围不一致；文本动画 v3 支持起／末帧与最多 16 帧 | [API 目录](https://www.pixellab.ai/pixellab-api)、[编辑教程](https://www.pixellab.ai/docs/tools/edit-animation-pro)、[换装教程](https://www.pixellab.ai/docs/tools/transfer-outfit-pro) | 2026-10-14 | 实际调用前核 schema；最迟 2026-11-14 | 保留自动化候选，文档矛盾不是实测失败 |
| Retro 2026-09-28 新条款只立即覆盖新账号，旧账号于 2026-10-28 起适用；旧版 PDF 仍提供 | [新条款](https://retrodiffusion.ai/terms)、[旧版 PDF](https://retrodiffusion.ai/assets/terms-8312c717.pdf) | 2026-10-14 | 2026-10-28／账号选型前 | 旧账号自动化先核适用合同，不能统一按新条款放行 |
| Retro 新版输出归生成者且含免费；免费／公开输出可公开展示，平台可用输出训练；用户不能自行用于 AI 训练／评估；服务代码／权重未开放 | [新条款 §4–7、11](https://retrodiffusion.ai/terms) | 2026-10-14 | 2026-10-28／保密素材使用前 | 适合可公开专项样本；保密资产或 LoRA 数据用途不默认 |
| Retro 公开首页 RD Fast $0.03、Plus $0.06、Pro $0.18/图，动画 $0.07/段起；官方 MCP README 仍写 Fast 约 $0.015 起 | [首页](https://retrodiffusion.ai/)、[MCP 文档](https://github.com/Retro-Diffusion/retro-diffusion-mcp/blob/master/README.md) | 2026-10-14 | 每次预算先估价；最迟 2026-11-14 | 口径有差异，不选最低宣传价预算；采用官方免费 cost estimate 与真实账单 |
| Retro API/MCP 提供低分辨率、参考、调色板、GIF/sprite-sheet、瓦片和起帧动画；具体尺寸依 style，Pro 最多 9 参考 | [官方 MCP 文档](https://github.com/Retro-Diffusion/retro-diffusion-mcp/blob/master/README.md) | 2026-10-14 | 2026-11-14／style 或接口变化 | 纳入静态性价比／多参考对照；未独立证明动画连续性或零手修 |

[研究] Retro 新条款、PixelLab 月付显示和 Retro 价格由公开浏览器正文核得，HTTP 提取空白不等于没有条款；未登录、上传或生成。

[研究] 历史阶段 F 检查：完整离线 14/14、非空无 skip，`git diff --check` 通过；末次许可表补行另跑局部文档检查，不扩为模型、引擎或 hosted CI。
