主线：二／三／四；G1动画选型、第二次修改与发行授权
改变的建议：先固定骨架、完整玩法动作集合与位移／接触契约；现成动作和程序动画为基线，生成只补确实缺少的内容
新证据：2026年7–9月商业工作流变更、固定模型能力排除、MoCapAnything发行与论文差异、Shards真实游戏展示和固定重定向源码反证

# WP4：动画、绑定与第二次修改

核实时间：2026-10-14（UTC+8）。正文见[动画专题](../../domains/game-dev/assets/animation.md)。本轮只读官方资料、论文、GitHub源码与开发者记录；未安装、下载权重、运行模型或引擎。来源标记：[一手]官方文本／源码／作者报告；[研究]论文或机制推导，具体段落区分；[经验]条件化采用建议。分档为首试顺序，不是同题实测冠军。

## 1. 采用判断与分档依据

**✅ 采用：固定角色骨架与完整玩法动作组，再决定是否生成。** 已正确绑定的角色、许可动作组、引擎重定向与有限IK，是人形动作的默认基线。机械、悬浮、铰链及规则分节角色先用曲线／程序步态；缺少自然表演时再比较视频或文本。**🧪 改造：** SkinTokens保骨架补蒙皮、数值控制的Locomotion、明确输入限制下的单人动捕。**⛔ 不用作默认：** 任意生成角色自动绑定后直接发售、文本要求精确接触、清零root即循环、用非商业依赖免费生产商业游戏。[经验]

|任务|质量优先|性价比优先|本地／免费|
|---|---|---|---|
|人形角色与动作|✅ 已验收骨架＋完整现成动作组；缺短表演才🧪Uthana Text3.0／Video2.1等商业候选|✅ 地区可用时Mixamo；需要数值移动控制再🧪Uthana Locomotion；较多自录视频对照Rokoko Vision3.0|✅ 已有许可动作＋引擎IK；🧪SkinTokens补绑定；不强凑本地生成冠军|
|2D骨骼与逐帧|✅ 完整现成角色包；Spine按资产、编辑器、runtime分别清权|✅ 已有分层／骨架＋Unity 2D Animation的换装及参数复用|✅ 自有或许可逐帧包、刚体部件曲线；生成图不自动具备可绑定层|
|非人形／接触密集|✅ 专用完整资产组；覆盖不到则修改角色或玩法|🧪 已有分节结构、程序步态与有限IK|👀 SkinTokens／MoCapAnything研究路径，先闭合依赖和特定目标骨架|

质量优先是提高零手修交付可靠性的选择，不表示现成资源总比生成更美。Uthana有当前版本、显式控制和输出示例，故可入专项首试；没有独立同题盲测证明它胜过其他服务。Move One仅作未闭合完整输出许可的对照；Cascadeur仍可能需要人工摆姿，非本基准必需工具。[研究／经验]

替代关系：这套建议取代“有FBX／动作好看就可用于玩法”的默认假设。若后续同一角色、相同接触／循环任务和第二次修改的公开对照能证明无需手修且成本更低，再提升生成路线；不能只因新型号或论文分数升级推荐。[经验]

## 2. 主要一手证据与反证

### A. 近期变化：必须撤回旧攻略的部分

1. **Rokoko于2026-07-16合并到Create，2026-08-16结束旧双机位与在线webcam**：[官方迁移公告](https://support.rokoko.com/hc/en-us/articles/48823033216017-Rokoko-Vision-and-Rokoko-Create-What-you-need-to-know)。应采用离线录制后上传的当前流程，不能再以“双摄增强”给当前Vision选型。[一手]
2. **Vision 3.0当前套餐与能力**：[官方产品页](https://www.rokoko.com/products/vision)。免费30秒/月；Basic月付US$12、年付折合US$10/月，含600秒处理、100个文本clip导入；没有手指追踪，遮挡/复杂运动仍有局限。其10倍速度/价值是厂商对比，未当成本轮对照实测。[一手／研究]
3. **Uthana于2026-08停止新订阅，按量共用API/web余额**：[官方价格](https://uthana.com/pricing)、[FAQ](https://uthana.com/faq)。Text V3 US$0.10/秒、Video V2/V2.1 US$0.05/秒、Locomotion US$0.02/秒、拼接/循环US$0.01/秒、auto-rig US$0.15/次。不是旧“无限订阅”。购买积分不过期，自动充值为可选，不能默认打开。[一手]
4. **Cascadeur 2026.2**：[官方发布说明](https://cascadeur.com/blog/view/cascadeur-2026-2-animation-layers-easing-new-languages)。增加Alpha加法动画层、easing与Python工作流；新版工具有助局部修改，但定位仍是辅助创作/编辑，不能把需要摆姿与修关键帧的过程计为零人工美术。免费只能`.casc`且非商用；Indie年收入须低于US$100k，Pro才有该页所列无限商业使用及重定向。页面当前返回PLN价格，未冒写美元单价。[官方价格](https://cascadeur.com/plans)。[一手／研究]
5. **2026-09-19 MixiMotion**：[论文](https://arxiv.org/abs/2609.23010)。作者给出单步蒸馏速度与语义指标，教师为HY-Motion Lite；本轮未找到可闭合的作者代码/权重及发行许可。加速不证明loop、接触或商业授权问题已解，列前沿观察，不替代推荐。[研究]

### B. 商业动作：哪种控制对应哪种修改

**Uthana Locomotion**：[官方说明](https://uthana.com/models/locomotion)给方向、0.25—8m/s、1—5步对、风格枚举；导出FBX/GLB/BVH与24/30/60fps，区分root motion/in-place。它生成clip，不提供寻路、碰撞或动态平衡控制器。结论：移动需求优先显式控制，胜过每次提示词“快一点/向左一点”的不可测改变；未证明生成片在所有骨架无脚滑。[一手／研究]

**Uthana Text-to-Motion 3.0**：[官方示例/限制](https://uthana.com/models/text-to-motion)展示标注“原样生成”的动作，支持短行为序列和API；仍不保证接触场景或精确末姿，不生成道具/第二个人。适合表演方向，不能作为精确游戏事件执行器；质量优先是此场景的候选顺序，不是胜过所有服务的结论。[一手／研究]

**Uthana Video-to-Motion 2.1**：[官方动捕页](https://uthana.com/models/video-to-motion)有源视频与交互结果链接；V2.0是当前API默认，2.1有模型原生后处理，必须显式保存版本。要求单人、2—60秒、全身可见、稳定摄像机，优选无遮挡、无运动模糊。其结果是估计，不是测量真值；页内演示不是已发售游戏零修证据。[一手／研究]

**Rokoko文本**：[当前Create页](https://www.rokoko.com/products/studio/rokoko-create)允许商用，建议简单idle/locomotion；[旧Preview帮助](https://support.rokoko.com/hc/en-us/articles/40245637949329-Text-to-Motion-in-Rokoko-Studio-Preview)保留“smoothing在loop文本clip可能产生伪影”的警告。但旧文Plus/Pro前提与当前Create免费5次导入不同，不能拿旧文套餐覆盖新页；它仅是“平滑可能损伤动作”的官方反例。[一手／研究]

**DeepMotion**：[服务条款](https://www.deepmotion.com/terms-of-use)免费非商用、付费时生成的输出获永久全球商业使用许可，但输出知识产权归平台，禁止独立/类素材库再分发，游戏按二进制嵌入。[定价页](https://www.deepmotion.com/pricing-animate3d)的Rotoscope纠错返积分需要逐帧修关节，不应计为本基准免费成本。SayMotion价格正文未完整返回，未引用不可靠单价；服务可作另一商业对照，未选为已证最佳。[一手／研究]

**Move One**：[官方价格帮助](https://docs.move.ai/knowledge/move-one-pricing)Starter US$18/月+VAT，60credits，Gen1每人每秒1credit，Gen2为2credits，超额会计费。故Starter的“60”不是Gen2的60秒；免费30credits是一次性而非月赠。该轮未完整审定EULA输出权利，因此仅留比较候选，不把试用可导出等同商用放行。[一手／研究]

### C. 自动绑定：保骨架比每次重新猜更利于第二改

**Mixamo**：[Adobe官方FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)明确免费商业游戏可用，仅二足人形，严重异形、大附肢/道具、非中性姿势、游离部件与脏网格可失败；中国国家码账户与Enterprise/Federated ID不可用。采用对象必须先过这些条件。[一手]

**AccuRIG**：[官方功能比较](https://www.reallusion.com/auto-rig/accurig/)支持人形和一些夸张比例/手指设置，但是guided rigging；免费与CC高级版不同，免费不含编辑蒙皮/减骨等全部功能。[2026问题库](https://kb.reallusion.com/ExportPDF53079.aspx)说明关节放到网格外可导致计算问题/崩溃。因此“免费工具”≠零判断或必定成功，若需逐点修关节或刷权重才能过关，不满足此项目基准。可保留按参数/自动模式一次通过的路线。[一手／研究]

**SkinTokens/TokenRig**：[固定README](https://github.com/VAST-AI-Research/SkinTokens/blob/273b691d35989d71cd17ff2895fdc735097b92d1/README.md)、[固定demo](https://github.com/VAST-AI-Research/SkinTokens/blob/273b691d35989d71cd17ff2895fdc735097b92d1/demo.py)；模型给骨架和蒙皮，demo有保骨架仅生成skin与批处理入口。相比UniRig分离预测，论文推进联合表示，但作者skinning/bone指标不等于Unity角色发售成功率。[论文](https://arxiv.org/abs/2602.04805)。推荐只补模型缺失的绑定能力，保留骨架身份与动作回归；没找到零手修商业游戏量产采用证明。[一手／研究]

### D. 开源动作：可运行、论文效果、商用路径三件事

- **HY-Motion-1.0/Lite**：[固定README](https://github.com/Tencent-Hunyuan/HY-Motion-1.0/blob/4e426f5a1021cbcf7f375458c37b840ee7225229/README.md)明确不支持非人形、多人、环境/对象、seamless loop或in-place。标准/Lite列最低26/24GB，另有缩短时长等建议，不能当普适峰值显存。WP1已核EU/UK/韩国输出地域排除及MAU条件。因此不默认全球商用，更不以文本“loop”承诺补齐缺项。[一手／研究]
- **GVHMR**：沿用WP1固定`ee960bb6e2ea2d381aa97f08e9b71ef320b624b1`[许可证](https://github.com/zju3dv/GVHMR/blob/ee960bb6e2ea2d381aa97f08e9b71ef320b624b1/LICENSE)商业使用受限；“仅导出动作、不发代码”不解决商业运行限制。没有把论文观感纳入商用免费档。[一手／研究]
- **MoCapAnything V2（重要新增）**：2026-07发权重，2026-09-04补训练分割/复现资料。固定[README](https://github.com/phongdaot/MocapAnything/blob/c99fb22c2f6001958c73c197065322b98ca0b93b/README.md)明确为重实现，非论文实验原代码；[RUN.md](https://github.com/phongdaot/MocapAnything/blob/c99fb22c2f6001958c73c197065322b98ca0b93b/RUN.md)说明公开Setting A与论文分割/指标不一致。能以视频＋参考骨架输出旋转/BVH，值得非人形专项评估，但不能照搬论文分数。[一手]
- MoCapAnything主代码[MIT＋第三方NOTICE](https://github.com/phongdaot/MocapAnything/blob/c99fb22c2f6001958c73c197065322b98ca0b93b/LICENSE)、[固定权重卡](https://huggingface.co/kehong/MoCapAnythingV2-weights/blob/4b8c28e69aea9e39610264818d83153d59219bd6/README.md)也标MIT；卡明确RMBG-1.4/DINOv2会运行时拉取。RMBG-1.4[官方卡](https://huggingface.co/briaai/RMBG-1.4)免费仅非商业，训练示例的Truebones素材另许。结论：主模型可评估，默认组合不可直接写免费商用；先获依赖授权或验证替代路径，不能仅删除下载语句就算清权。输出也不自动继承第三方视频/角色/动作数据权利。[一手／研究]
- **ReMoMask ECCV2026**：[作者仓库](https://github.com/AIGeeksGroup/ReMoMask)明示CC BY-NC-SA 4.0及多项身体模型/数据依赖；只作为近期对照，不作商用候选。本轮未取得固定SHA，故不以其源码支撑正文机制或默认推荐。[一手网页／研究]
- **SAM 3D Body**：[Meta作者仓库](https://github.com/facebookresearch/sam-3d-body)是单图人体重建，不是现成时序游戏动作交付；第三方BVH封装不能凭名称保证世界root、脚接触和连续性，也不能替上游许可清权。本轮未扩大到该链，列观察即可。[一手／研究]

### E. 真实游戏反证：Shards工具可以借鉴，不能按README全信

[2026-09-26开发者原文](https://www.shardsofstone.com/blog/generating-and-rigging-game-ready-3d-units)展示实际游戏内单位及前后资产入口：Mixamo人形重定向、非人形程序步态；同时承认握剑rest差异导致约90°滚转仍待修，Seedance回取动作是实验路线，VAT不是游戏当前运行路径，尚无可靠单位总成本。它支持“已做出可见游戏产物”，不支持全套一键、全部动作无缺陷或Unity/Unreal发售结论。[一手：作者报告]

本轮进一步只读GitHub API和源码，固定到**94bd478782d9629586d5d1138d2172f0337a7745（2026-09-28）**：

1. [retarget_mixamo.py](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/scripts/blender/retarget_mixamo.py#L90-L120)读取`src_bone.rotation_quaternion`直接赋给目标（腿部再向单位四元数插值），未实现博文所示世界rest delta与目标rest基底转换；虽然局部姿态本就相对rest，但这不等同于任意骨轴/基姿间的正确转换。脚本注释声称按身高缩放hips，实际只复制`src_hips.location`，未读双方身高计算比例。[一手：固定源码；研究：条件化反证]
2. 同处`--loop`只把hips local x/y设0，没有首尾姿态差、导数/速度、脚接触或跨clip拼接处理。可用于已兼容骨架、已闭合的源循环的某些in-place场景，不能接受任意生成clip并保证loop。[一手／研究]
3. [固定README](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/README.md)报每单位US$0.66—1.06估算，而作者现行博客明确总成本尚不可靠。不要摘估算作为测量，也不要把视频60fps称目标设备达标。[一手／研究]
4. [代码MIT](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/LICENSE)不证明内含Meshy/Mixamo或其他示例动作原始文件可再分发；可借鉴代码机制，原始示例资产许可另查。未下载/执行示例或渲染视频，本轮证据是作者展示入口与固定源码差异。[一手／研究]

**采用/改造/不用判断：🧪 借鉴“刚体部件隔离、程序步态、分离动作与移动控制”的结构；改造并测试骨轴/rest、root和loop契约；⛔ 不原样采用为通用零手修动画流水线。** 同一个“全部权重和为1”断言可能在剑被错误分给手臂时仍通过，数值合法不等于变形正确。[研究]

## 3. 引擎接入的机制依据（Unity优先）

- [Unity 6 Retarget Humanoid](https://docs.unity3d.com/6000.0/Documentation/Manual/Retargeting.html)：配置Avatar的人形可复用动作；引擎建议模型作为控制器父对象下的子对象，换模型仍要调整控制器/Transform。Generic或多足不自动获得Humanoid映射能力。[一手]
- [Unity 6 Root Motion](https://docs.unity3d.com/6000.0/Documentation/Manual/RootMotion.html)：Body/Root区分、Y/XZ bake、Feet基准与Loop Pose解释；循环修正作用在root参照坐标。由此导出前文位移权威/按clip分类建议，不设“一律勾选”模板。[一手／研究]
- [Unity Two Bone IK](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.2/manual/constraints/TwoBoneIKConstraint.html)：Target与Hint控制末端及弯曲方向，权重可混合；不是运动/语义生成器。实际采用需匹配当前项目引擎的包版本，不照抄旧文1.2为安装建议。[一手／研究]
- [Unreal 5.8 IK Retargeter](https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-animation-retargeting-in-unreal-engine)：链映射、Retarget Pose、Auto Align、root与地面相关设置表明“同为人形”也需姿态配置；自动对齐是候选起点，不保证手握道具或武器轨迹。其结果可导出供动画系统使用，不自动补缺失动作。[一手／研究]
- [Epic Game Animation Sample](https://www.unrealengine.com/blog/game-animation-sample?lang=en-au)：官方成套locomotion与Blueprint是比单片动作更完整的基线；[UE5.7更新](https://www.unrealengine.com/tech-blog/explore-the-updates-to-the-game-animation-sample-project-in-ue-5-7?lang=zh-CN)提醒固定sample/引擎版本。这里没有逐项核Fab取得时许可，不将它当已放行Unity通用动作包。[一手／研究]
- [Unity 2D Animation 10.2.4流程](https://docs.unity3d.com/Packages/com.unity.2d.animation@10.2/manual/CharacterRig.html)：自动几何和Auto Weights仍配合编辑、权重调整与Preview Pose；前文零手修边界由此得到，而非认定这些功能无用。[一手／研究]
- [Spine资产包](https://en.esotericsoftware.com/spine-asset-packs)：Hitman/Gunman各US$10，带rig/动作和Unity工程。旧Unity5工程不能冒称直接适配当前Unity；可评估资产，工程需迁移。[Spine署名案例](https://us.esotericsoftware.com/spine-showcase-all)有Return to Monkey Island与Cult of the Lamb美术负责人，证明专业团队真实采用，不证明AI零手修。[一手／研究]

## 4. 授权边界与WP1对应项

| 精确方案 | 代码/服务 | 权重 | 输出/商用与限制 | 建议 |
|---|---|---|---|---|
| Mixamo auto-rig和动作库 | 专有在线服务，Adobe ID；FAQ列中国国家码及企业/联合ID不可用 | 不开放 | FAQ允许商用游戏，原始素材不可当素材包再分发；[2021附加条款](https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/Mixamo-Addl-Terms-en_US-20210623.pdf)禁止以内容/输出直接间接创建、训练、测试或改进AI/ML | 👀地区可用、有权输入时候选；不要把它拿去训动作模型，也不把普通引擎重定向误说成训练 |
| Uthana paid Text3.0/Video2.1/Locomotion/rig | 专有服务，GraphQL可用 | 不授权底层模型 | [Terms v1.1.0](https://uthana.com/terms)§8付费输出在双方间归用户，必要嵌入IP全球永久许可；免费输出CC BY4.0需署名；默认可用于模型改进，no-training须明示；未见特别营收/地域阈值，仍受法律/账户要求 | 👀按量付费可评估；不是所有免费旧资产升级即无署名 |
| Rokoko Create/Vision3.0/Studio | 专有，按账户计划 | 不开放 | [2026-07-16 v2.0.1条款](https://www.rokoko.com/terms-of-use)覆盖Studio/Preview/Create；用户保有User Content，另有平台改进许可；Rokoko Assets素材库与自己生成内容区分；§4.4禁止未特许脚本/自动化访问 | 👀普通生成/导出候选；不得擅建抓取/批处理机器人，素材库与输出混用另查 |
| DeepMotion Animate3D/SayMotion | 专有服务 | 不开放 | 平台拥有Products；免费非商用，付费期间生成获永久全球商用；二进制作品嵌入，禁止独立素材分发/高度近似衍生资产销售 | 👀付费合规用途候选；不可直接把动作FBX公开到开源游戏仓库；条款禁止未授权机器人/脚本，批量接入另核官方API |
| Spine编辑器＋Runtimes＋资产包 | 编辑器专有；runtime源码可读但专用协议，不是MIT | 无生成权重 | [编辑器协议](https://us.esotericsoftware.com/spine-editor-license)Essential/Pro过去12月收入＋投资/融资合计<$500k；超限Enterprise。Trial无runtime权；Education非商用。[资产包协议](https://en.esotericsoftware.com/spine-asset-pack-license)只作为软件嵌入，禁源码形式分发包内源代码；各组件许可仍独立 | 👀完整许可路径候选；买骨骼数据不自动免runtime许可；不要求玩家各买许可证，应按编辑器协议§2正确许可集成 |
| Cascadeur 2026.2 | 专有编辑/辅助动画 | 不授自托管权重 | Free非商用且无FBX/DAE导出；Indie<$100k/year，Pro商业门槛不同。完整EULA输出/旧免费历史未在本轮闭合 | 👀付费比较，不能作免费发布管线默认；不是本基准必需工具 |
| AccuRIG / ActorCore动作 | 专有软件，AccuRIG免费不代表商店动作免费 | 不开放 | [2026-05-25软件EULA](https://www.reallusion.com/Content/EULA/AP/EULA_AP.htm)与[内容EULA](https://www.reallusion.com/Content/EULA/EULA.htm)分开；自有网格、ActorCore或CC Base有不同边界，Editorial/Trial不能混同 | 👀软件候选；发行前按实际角色/动作SKU与来源清权，不以免费按钮全盘放行 |
| MoCapAnything V2指定code/checkpoint | 固定代码MIT，BRIA文件例外 | 固定epoch60.pt卡MIT；RMBG另许 | 未见主权重独立输出NC限制，但默认BRIA依赖非商业，Truebones数据另许；本轮没验证去依赖路径 | 👀主模型、⛔默认免费商业整套；不存在“小团队自然豁免” |
| Shards Asset Toolkit 94bd4787 | MIT代码 | 调外部服务，无自有模型许可替代 | 示例Meshy/Mixamo资产的再分发不由MIT自动覆盖 | 🧪借鉴代码，不默认复制示例资产 |

注：Rokoko已从Vision产品页直接点条款复核：`/terms-of-use-update`重定向至`https://www.rokoko.com/terms-of-use`，生效2026-07-16，版本2.0.1；不是把一般网站条款当软件输出许可。

## 5. 只靠程序能补与不能承诺补的分界

| 缺陷/修改 | 可程序化操作 | 前提/不能保证 |
|---|---|---|
| 单位、朝向、时间基准 | 坐标换算、重采样、统一fps、四元数规范化/连续化 | 先知道源坐标与绑定关系；无穷/NaN及错误骨名应拒绝，不能默默跳过 |
| 别的骨架动作扭转 | 明确源/目标rest基底转换、链映射、root比例 | 修正机制错误；不等于补出原本没有的自然握持 |
| 小幅脚滑/末端偏差 | 接触标签＋IK、有限root/stride warp | 目标可达、支撑脚身份正确；腾空/跨步不能全程锁脚 |
| 高频抖动 | 低通/曲线减噪，保留事件附近关键帧 | 错误姿态不能滤成正确，可能削弱击打瞬时速度 |
| 循环接缝 | 选周期、时间/姿态对齐、限定窗口混合 | 动作本身有对应周期；单次落地/死亡不应该强制loop |
| 武器/壳被软化 | 已正确标识的刚性部件分配到指定骨/独立socket | 粘连且无法可靠分割会误选；缺面/缺关节须重新生成或换模型 |
| 2D换衣色、同规格装备 | 换palette/slot/sprite，保骨架和事件 | 新装备轮廓/遮挡/肢体拓扑改变可能要新图/新动作 |
| 攻击提前或加重 | 局部retime、层权重、IK目标、声音/命中事件重定位 | 物理和视觉合理性需看真实玩法；程序可改时序不能保证动作意图正确 |

这些是机制推导/采用条件，不是本轮实测成功率。必须把“程序能实现操作”与“程序能确定正确视觉答案”区分开。[研究]

## 6. 第二次修改的最小后续验收（本轮不执行）

1. 保存同一rig/模型hash、clip命名与单位/fps、模型/服务版本、source运动/seed、root策略、Avatar/retarget pose、事件/contacts，以及原始与处理后文件；不依赖服务历史保存。[经验]
2. 第一版用最小完整玩法动作组进入引擎，先通过目标设备占屏尺寸下的实际剪影、接触、地面与动作事件要求，别只看DCC正面。[经验]
3. 第二版做两类改动：保持骨架换同规格外观/装备；将攻击命中提前且恢复不变，或提高移动速度并保持脚落点。再加一个确实需要新语义的动作，区分参数可复用与内容缺口。[研究]
4. 自动核骨架映射、clip非空/时长、有限数值/四元数、根轨迹、事件顺序/范围、末端接触漂移、首尾姿态与速度、旧引用。阈值按相机、角色尺寸、速度和玩法定，不伪造通用合格毫米线。[研究]
5. 再看实际角色/道具与状态转换；“握得对、动作能读、打击有力、风格一致”不以单一数值代替。有限重生/重录后仍需刷权重、手画帧或逐点摆姿才能通过，就回退到现成组或缩小动作需求。[经验]
6. 总成本按全部服务费＋本地算力＋挑选/重录/代码修复/回归主动时间，除以合格动作秒数或合格动作数；保存第二改增量，不能只报每生成秒价。[研究]

### 成本例（只算术，不是实测）

Uthana 8秒Text V3一次US$0.80，十次候选US$8；Video 2.1十条各8秒按价格页输出口径为US$4；循环另计。Rokoko Basic月付US$12含600秒，但只用80秒时不能报“每分钟US$1”，年付折算也不等于月付账单；双方淘汰率、录制时间与质量未知。Move Gen2按2credit/人秒，Starter60credit对应30秒，不与其他服务600秒额度直接当效果性价比。[一手价格／研究算术]

## 7. 本轮实际验证与剩余问题

`python3 scripts/check_offline.py`完整14阶段通过：文档目标／配置、97项基础测试、26项jq Hook测试、10项评估夹具、13项结果审计、14项恢复测试与shell语法；非空套件、无skip。两个新文件分别以`git diff --no-index --check /dev/null <文件>`检查，无空白诊断（新增差异退出码1）；`git diff --check`无输出。另核UTF-8、LF、末尾单换行及无私人路径。离线检查不验证外部链接、网页事实或真实引擎效果。[研究：本轮检查]

仍待后续授权试验：同一角色的loop／contact与第二次修改对照；MoCapAnything默认受限依赖的合法替代是否可运行；Shards的rest基底、轴、root与循环修正。Move One完整输出权利、特定ActorCore SKU和Epic sample跨引擎许可未闭合，不作已放行默认。未安装软件、下载权重、调用付费生成、运行模型或引擎。[研究]

整合验证：完整离线14阶段、受影响页74处标题引用及 `git diff --check` 通过；内部独立复核补DeepMotion自动访问限制。未运行模型/引擎或测零手修成本，hosted CI按发布提交另核。

## 评审后修订：授权表格呈现（2026-10-14 11:15 UTC+8）

[研究：实际离线复现] 对云端评审 F2 独立核验：Rodin 后空行切断 GFM 表格，随后七条动作授权只呈现为段落。使用环境已有 pandoc 的 `--from=gfm --to=html` 分别转换修订前后正文，以标准库 HTMLParser 检查生成 HTML：修订前七项均不在表格行；删除该空行后七项全部为表格行且各五列。仅修呈现，不改变许可判断；这是本地 GFM 转换结果，非 GitHub 页面视觉/真实引擎/模型效果验证。完整离线和差异检查随本结果提交执行。
