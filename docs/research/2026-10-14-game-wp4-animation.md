主线：二／三／四；G1 动画、绑定、面部供给、第二次修改与授权
改变的建议：[经验] 固定骨架、完整动作组和位移／接触契约，同骨架先直接复用，所需功能或结构差异再引入转换；现成动作＋有限 IK／程序动画优先；生成补缺，体型／装备不适配时允许分动作或收窄玩法；程序步态分基础姿态与身体规则，新运动结构另计实现；二改后的消失／突跳先分范围与屏外求值；对白先有嘴形／面部绑定，再选求解器，改句按音频与口型配对接收
新证据：[一手／研究] VRoid／VRM现成来源与Unity消费替代；Rhubarb 固定源码与成品采用、MetaHuman 口部掩码、Audio2Face 既有 rig／GPU 与分组件许可补对白二改边界；2026-10-15 Kimodo v1.2 修正测试泄漏，补本地可控短动作候选而非质量冠军； Unity 6.3 导入／IK／根运动合同与历史 UUM-27271、UE5.8 兼容骨架条件补同骨架复用选择；Overgrowth 演讲、生产修订与固定源码，Rain World 开发者访谈补程序步态内容／维护边界；Unity 6.3 范围／Animator 合同与固定参考源码、UUM-35020 复现及 UE5.8 tick／bounds 合同补屏外诊断；近期工作流、固定重定向／IK 源码及交互对位修订；Unity／UE 窗口合同、UpRoom 开发复盘、ALS 固定源码补动作进度同步；未证实接触质量、零手修通过率或二改成本

# WP4：动画、绑定与第二次修改

核实时间：2026-10-14（UTC+8）。正文见[动画专题](../../domains/game-dev/assets/animation.md)。本轮只读官方资料、论文、GitHub 源码与开发者记录；未安装、下载权重、运行模型或引擎。来源标记：[一手]官方文本／源码／作者报告；[研究]论文或机制推导，具体段落区分；[经验]条件化采用建议。分档为首试顺序，不是同题实测冠军。

## 1. 采用判断与分档依据

**✅ 采用：固定角色骨架与完整玩法动作组，再决定是否生成。** 已正确绑定的角色与许可动作组先同骨架复用；确需跨骨架或所需功能时再加重定向与有限 IK。机械、悬浮、铰链及规则分节角色先用明确曲线／步态；有机生物可探索专用身体／支撑规则，依赖基础姿态的路线仍须先取得许可资产。缺少自然表演时再比较视频或文本。**🧪 改造：** SkinTokens 保骨架补蒙皮、数值控制的 Locomotion、明确输入限制下的单人动捕。**⛔ 不用作默认：** 任意生成角色自动绑定后直接发售、文本要求精确接触、清零 root 即循环、用非商业依赖免费生产商业游戏。[经验]

|任务|质量优先|性价比优先|本地／免费|
|---|---|---|---|
|人形角色与动作|✅ 已验收骨架＋完整现成动作组；缺短表演才🧪Uthana Text3.0／Video2.1 等商业候选|✅ 地区可用时 Mixamo；需要数值移动控制再🧪Uthana Locomotion；较多自录视频对照 Rokoko Vision3.0|✅ 已有许可动作＋引擎 IK；🧪SkinTokens 补绑定；缺可控短人形动作时👀Kimodo-SOMA-RP-v1.2|
|2D 骨骼与逐帧|✅ 完整现成角色包；Spine 按资产、编辑器、runtime 分别清权|✅ 已有分层／骨架＋Unity 2D Animation 的换装及参数复用|✅ 自有或许可逐帧包、刚体部件曲线；生成图不自动具备可绑定层|
|非人形／接触密集|✅ 专用完整资产组；覆盖不到则修改角色或玩法|🧪 明确身体／支撑规则；基础姿态与新运动代码分别计入成本|👀 SkinTokens／MoCapAnything 研究路径，先闭合依赖和特定目标骨架|

质量优先是提高零手修交付可靠性的选择，不表示现成资源总比生成更美。Uthana 有当前版本、显式控制和输出示例，故可入专项首试；没有独立同题盲测证明它胜过其他服务。Move One 仅作未闭合完整输出许可的对照；Cascadeur 仍可能需要人工摆姿，非本基准必需工具。[研究／经验]

替代关系：这套建议取代“有 FBX／动作好看就可用于玩法”的默认假设。若后续同一角色、相同接触／循环任务和第二次修改的公开对照能证明无需手修且成本更低，再提升生成路线；不能只因新型号或论文分数升级推荐。[经验]

## 2. 主要一手证据与反证

### A. 近期变化：必须撤回旧攻略的部分

1. **Rokoko 于 2026-07-16 合并到 Create，2026-08-16 结束旧双机位与在线 webcam**：[官方迁移公告](https://support.rokoko.com/hc/en-us/articles/48823033216017-Rokoko-Vision-and-Rokoko-Create-What-you-need-to-know)。应采用离线录制后上传的当前流程，不能再以“双摄增强”给当前 Vision 选型。[一手]
2. **Vision 3.0 当前套餐与能力**：[官方产品页](https://www.rokoko.com/products/vision)。免费 30 秒/月；Basic 月付 US$12、年付折合 US$10/月，含 600 秒处理、100 个文本 clip 导入；没有手指追踪，遮挡/复杂运动仍有局限。其 10 倍速度/价值是厂商对比，未当成本轮对照实测。[一手／研究]
3. **Uthana 于 2026-08 停止新订阅，按量共用 API/web 余额**：[官方价格](https://uthana.com/pricing)、[FAQ](https://uthana.com/faq)。Text V3 US$0.10/秒、Video V2/V2.1 US$0.05/秒、Locomotion US$0.02/秒、拼接/循环 US$0.01/秒、auto-rig US$0.15/次。不是旧“无限订阅”。购买积分不过期，自动充值为可选，不能默认打开。[一手]
4. **Cascadeur 2026.2**：[官方发布说明](https://cascadeur.com/blog/view/cascadeur-2026-2-animation-layers-easing-new-languages)。增加 Alpha 加法动画层、easing 与 Python 工作流；新版工具有助局部修改，但定位仍是辅助创作/编辑，不能把需要摆姿与修关键帧的过程计为零人工美术。免费只能`.casc`且非商用；Indie 的年营收或融资须低于 US$100k，Pro 才有该页所列无限商业使用及重定向。上一轮页面返回 PLN；本次美元 FAQ 已核 Indie US$19／月或 US$96／年，Pro US$49／月或 US$396／年，实际税与结账仍另核。[官方价格](https://cascadeur.com/plans)。[一手／研究]
5. **2026-09-19 MixiMotion**：[论文](https://arxiv.org/abs/2609.23010)。作者给出单步蒸馏速度与语义指标，教师为 HY-Motion Lite；本轮未找到可闭合的作者代码/权重及发行许可。加速不证明 loop、接触或商业授权问题已解，列前沿观察，不替代推荐。[研究]

### B. 商业动作：哪种控制对应哪种修改

**Uthana Locomotion**：[官方说明](https://uthana.com/models/locomotion)给方向、0.25—8m/s、1—5 步对、风格枚举；导出 FBX/GLB/BVH 与 24/30/60fps，区分 root motion/in-place。它生成 clip，不提供寻路、碰撞或动态平衡控制器。结论：移动需求优先显式控制，胜过每次提示词“快一点/向左一点”的不可测改变；未证明生成片在所有骨架无脚滑。[一手／研究]

**Uthana Text-to-Motion 3.0**：[官方示例/限制](https://uthana.com/models/text-to-motion)展示标注“原样生成”的动作，支持短行为序列和 API；仍不保证接触场景或精确末姿，不生成道具/第二个人。适合表演方向，不能作为精确游戏事件执行器；质量优先是此场景的候选顺序，不是胜过所有服务的结论。[一手／研究]

**Uthana Video-to-Motion 2.1**：[官方动捕页](https://uthana.com/models/video-to-motion)有源视频与交互结果链接；V2.0 是当前 API 默认，2.1 有模型原生后处理，必须显式保存版本。要求单人、2—60 秒、全身可见、稳定摄像机，优选无遮挡、无运动模糊。其结果是估计，不是测量真值；页内演示不是已发售游戏零修证据。[一手／研究]

**Rokoko 文本**：[当前 Create 页](https://www.rokoko.com/products/studio/rokoko-create)允许商用，建议简单 idle/locomotion；[旧 Preview 帮助](https://support.rokoko.com/hc/en-us/articles/40245637949329-Text-to-Motion-in-Rokoko-Studio-Preview)保留“smoothing 在 loop 文本 clip 可能产生伪影”的警告。但旧文 Plus/Pro 前提与当前 Create 免费 5 次导入不同，不能拿旧文套餐覆盖新页；它仅是“平滑可能损伤动作”的官方反例。[一手／研究]

**DeepMotion**：[服务条款](https://www.deepmotion.com/terms-of-use)免费非商用、付费时生成的输出获永久全球商业使用许可，但输出知识产权归平台，禁止独立/类素材库再分发，游戏按二进制嵌入。[定价页](https://www.deepmotion.com/pricing-animate3d)的 Rotoscope 纠错返积分需要逐帧修关节，不应计为本基准免费成本。SayMotion 价格正文未完整返回，未引用不可靠单价；服务可作另一商业对照，未选为已证最佳。[一手／研究]

**Move One**：[官方价格帮助](https://docs.move.ai/knowledge/move-one-pricing)Starter US$18/月+VAT，60credits，Gen1 每人每秒 1credit，Gen2 为 2credits，超额会计费。故 Starter 的“60”不是 Gen2 的 60 秒；免费 30credits 是一次性而非月赠。该轮未完整审定 EULA 输出权利，因此仅留比较候选，不把试用可导出等同商用放行。[一手／研究]

### C. 自动绑定：保骨架比每次重新猜更利于第二改

**Mixamo**：[Adobe 官方 FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)明确免费商业游戏可用，仅二足人形，严重异形、大附肢/道具、非中性姿势、游离部件与脏网格可失败；中国国家码账户与 Enterprise/Federated ID 不可用。采用对象必须先过这些条件。[一手]

**AccuRIG**：[官方功能比较](https://www.reallusion.com/auto-rig/accurig/)支持人形和一些夸张比例/手指设置，但是 guided rigging；免费与 CC 高级版不同，免费不含编辑蒙皮/减骨等全部功能。[2026 问题库](https://kb.reallusion.com/ExportPDF53079.aspx)说明关节放到网格外可导致计算问题/崩溃。因此“免费工具”≠零判断或必定成功，若需逐点修关节或刷权重才能过关，不满足此项目基准。可保留按参数/自动模式一次通过的路线。[一手／研究]

**SkinTokens/TokenRig**：[固定 README](https://github.com/VAST-AI-Research/SkinTokens/blob/273b691d35989d71cd17ff2895fdc735097b92d1/README.md)、[固定 demo](https://github.com/VAST-AI-Research/SkinTokens/blob/273b691d35989d71cd17ff2895fdc735097b92d1/demo.py)；模型给骨架和蒙皮，demo 有保骨架仅生成 skin 与批处理入口。相比 UniRig 分离预测，论文推进联合表示，但作者 skinning/bone 指标不等于 Unity 角色发售成功率。[论文](https://arxiv.org/abs/2602.04805)。推荐只补模型缺失的绑定能力，保留骨架身份与动作回归；没找到零手修商业游戏量产采用证明。[一手／研究]

### D. 开源动作：可运行、论文效果、商用路径三件事

- **HY-Motion-1.0/Lite**：[固定 README](https://github.com/Tencent-Hunyuan/HY-Motion-1.0/blob/4e426f5a1021cbcf7f375458c37b840ee7225229/README.md)明确不支持非人形、多人、环境/对象、seamless loop 或 in-place。标准/Lite 列最低 26/24GB，另有缩短时长等建议，不能当普适峰值显存。WP1 已核 EU/UK/韩国输出地域排除及 MAU 条件。因此不默认全球商用，更不以文本“loop”承诺补齐缺项。[一手／研究]
- **GVHMR**：沿用 WP1 固定`ee960bb6e2ea2d381aa97f08e9b71ef320b624b1`[许可证](https://github.com/zju3dv/GVHMR/blob/ee960bb6e2ea2d381aa97f08e9b71ef320b624b1/LICENSE)商业使用受限；“仅导出动作、不发代码”不解决商业运行限制。没有把论文观感纳入商用免费档。[一手／研究]
- **MoCapAnything V2（重要新增）**：2026-07 发权重，2026-09-04 补训练分割/复现资料。固定[README](https://github.com/phongdaot/MocapAnything/blob/c99fb22c2f6001958c73c197065322b98ca0b93b/README.md)明确为重实现，非论文实验原代码；[RUN.md](https://github.com/phongdaot/MocapAnything/blob/c99fb22c2f6001958c73c197065322b98ca0b93b/RUN.md)说明公开 Setting A 与论文分割/指标不一致。能以视频＋参考骨架输出旋转/BVH，值得非人形专项评估，但不能照搬论文分数。[一手]
- MoCapAnything 主代码[MIT＋第三方 NOTICE](https://github.com/phongdaot/MocapAnything/blob/c99fb22c2f6001958c73c197065322b98ca0b93b/LICENSE)、[固定权重卡](https://huggingface.co/kehong/MoCapAnythingV2-weights/blob/4b8c28e69aea9e39610264818d83153d59219bd6/README.md)也标 MIT；卡明确 RMBG-1.4/DINOv2 会运行时拉取。RMBG-1.4[官方卡](https://huggingface.co/briaai/RMBG-1.4)免费仅非商业，训练示例的 Truebones 素材另许。结论：主模型可评估，默认组合不可直接写免费商用；先获依赖授权或验证替代路径，不能仅删除下载语句就算清权。输出也不自动继承第三方视频/角色/动作数据权利。[一手／研究]
- **ReMoMask ECCV2026**：[作者仓库](https://github.com/AIGeeksGroup/ReMoMask)明示 CC BY-NC-SA 4.0 及多项身体模型/数据依赖；只作为近期对照，不作商用候选。本轮未取得固定 SHA，故不以其源码支撑正文机制或默认推荐。[一手网页／研究]
- **SAM 3D Body**：[Meta 作者仓库](https://github.com/facebookresearch/sam-3d-body)是单图人体重建，不是现成时序游戏动作交付；第三方 BVH 封装不能凭名称保证世界 root、脚接触和连续性，也不能替上游许可清权。本轮未扩大到该链，列观察即可。[一手／研究]

### E. 真实游戏反证：Shards工具可以借鉴，不能按README全信

[2026-09-26 开发者原文](https://www.shardsofstone.com/blog/generating-and-rigging-game-ready-3d-units)展示实际游戏内单位及前后资产入口：Mixamo 人形重定向、非人形程序步态；同时承认握剑 rest 差异导致约 90°滚转仍待修，Seedance 回取动作是实验路线，VAT 不是游戏当前运行路径，尚无可靠单位总成本。它支持“已做出可见游戏产物”，不支持全套一键、全部动作无缺陷或 Unity/Unreal 发售结论。[一手：作者报告]

本轮进一步只读 GitHub API 和源码，固定到**94bd478782d9629586d5d1138d2172f0337a7745（2026-09-28）**：

1. [retarget_mixamo.py](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/scripts/blender/retarget_mixamo.py#L90-L120)读取`src_bone.rotation_quaternion`直接赋给目标（腿部再向单位四元数插值），未实现博文所示世界 rest delta 与目标 rest 基底转换；虽然局部姿态本就相对 rest，但这不等同于任意骨轴/基姿间的正确转换。脚本注释声称按身高缩放 hips，实际只复制`src_hips.location`，未读双方身高计算比例。[一手：固定源码；研究：条件化反证]
2. 同处`--loop`只把 hips local x/y 设 0，没有首尾姿态差、导数/速度、脚接触或跨 clip 拼接处理。可用于已兼容骨架、已闭合的源循环的某些 in-place 场景，不能接受任意生成 clip 并保证 loop。[一手／研究]
3. [固定 README](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/README.md)报每单位 US$0.66—1.06 估算，而作者现行博客明确总成本尚不可靠。不要摘估算作为测量，也不要把视频 60fps 称目标设备达标。[一手／研究]
4. [代码 MIT](https://github.com/AdamJSturrock/shards-asset-toolkit/blob/94bd478782d9629586d5d1138d2172f0337a7745/LICENSE)不证明内含 Meshy/Mixamo 或其他示例动作原始文件可再分发；可借鉴代码机制，原始示例资产许可另查。未下载/执行示例或渲染视频，本轮证据是作者展示入口与固定源码差异。[一手／研究]

**采用/改造/不用判断：🧪 借鉴“刚体部件隔离、程序步态、分离动作与移动控制”的结构；改造并测试骨轴/rest、root 和 loop 契约；⛔ 不原样采用为通用零手修动画流水线。** 同一个“全部权重和为 1”断言可能在剑被错误分给手臂时仍通过，数值合法不等于变形正确。[研究]

## 3. 引擎接入的机制依据（Unity优先）

- [Unity 6 Retarget Humanoid](https://docs.unity3d.com/6000.0/Documentation/Manual/Retargeting.html)：配置 Avatar 的人形可复用动作；引擎建议模型作为控制器父对象下的子对象，换模型仍要调整控制器/Transform。Generic 或多足不自动获得 Humanoid 映射能力。[一手]
- [Unity 6 Root Motion](https://docs.unity3d.com/6000.0/Documentation/Manual/RootMotion.html)：Body/Root 区分、Y/XZ bake、Feet 基准与 Loop Pose 解释；循环修正作用在 root 参照坐标。由此导出前文位移权威/按 clip 分类建议，不设“一律勾选”模板。[一手／研究]
- [Unity Two Bone IK](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.2/manual/constraints/TwoBoneIKConstraint.html)：Target 与 Hint 控制末端及弯曲方向，权重可混合；不是运动/语义生成器。实际采用需匹配当前项目引擎的包版本，不照抄旧文 1.2 为安装建议。[一手／研究]
- [Unreal 5.8 IK Retargeter](https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-animation-retargeting-in-unreal-engine)：链映射、Retarget Pose、Auto Align、root 与地面相关设置表明“同为人形”也需姿态配置；自动对齐是候选起点，不保证手握道具或武器轨迹。其结果可导出供动画系统使用，不自动补缺失动作。[一手／研究]
- [Epic Game Animation Sample](https://www.unrealengine.com/blog/game-animation-sample?lang=en-au)：官方成套 locomotion 与 Blueprint 是比单片动作更完整的基线；[UE5.7 更新](https://www.unrealengine.com/tech-blog/explore-the-updates-to-the-game-animation-sample-project-in-ue-5-7?lang=zh-CN)提醒固定 sample/引擎版本。这里没有逐项核 Fab 取得时许可，不将它当已放行 Unity 通用动作包。[一手／研究]
- [Unity 2D Animation 10.2.4 流程](https://docs.unity3d.com/Packages/com.unity.2d.animation@10.2/manual/CharacterRig.html)：自动几何和 Auto Weights 仍配合编辑、权重调整与 Preview Pose；前文零手修边界由此得到，而非认定这些功能无用。[一手／研究]
- [Spine 资产包](https://en.esotericsoftware.com/spine-asset-packs)：Hitman/Gunman 各 US$10，带 rig/动作和 Unity 工程。旧 Unity5 工程不能冒称直接适配当前 Unity；可评估资产，工程需迁移。[Spine 署名案例](https://us.esotericsoftware.com/spine-showcase-all)有 Return to Monkey Island 与 Cult of the Lamb 美术负责人，证明专业团队真实采用，不证明 AI 零手修。[一手／研究]

## 4. 授权边界与WP1对应项

| 精确方案 | 代码/服务 | 权重 | 输出/商用与限制 | 建议 |
|---|---|---|---|---|
| Mixamo auto-rig 和动作库 | 专有在线服务，Adobe ID；FAQ 列中国国家码及企业/联合 ID 不可用 | 不开放 | FAQ 允许商用游戏，原始素材不可当素材包再分发；[2021 附加条款](https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/Mixamo-Addl-Terms-en_US-20210623.pdf)禁止以内容/输出直接间接创建、训练、测试或改进 AI/ML | 👀地区可用、有权输入时候选；不要把它拿去训动作模型，也不把普通引擎重定向误说成训练 |
| Uthana paid Text3.0/Video2.1/Locomotion/rig | 专有服务，GraphQL 可用 | 不授权底层模型 | [Terms v1.1.0](https://uthana.com/terms)§8 付费输出在双方间归用户，必要嵌入 IP 全球永久许可；免费输出 CC BY4.0 需署名；默认可用于模型改进，no-training 须明示；未见特别营收/地域阈值，仍受法律/账户要求 | 👀按量付费可评估；不是所有免费旧资产升级即无署名 |
| Rokoko Create/Vision3.0/Studio | 专有，按账户计划 | 不开放 | [2026-07-16 v2.0.1 条款](https://www.rokoko.com/terms-of-use)覆盖 Studio/Preview/Create；用户保有 User Content，另有平台改进许可；Rokoko Assets 素材库与自己生成内容区分；§4.4 禁止未特许脚本/自动化访问 | 👀普通生成/导出候选；不得擅建抓取/批处理机器人，素材库与输出混用另查 |
| DeepMotion Animate3D/SayMotion | 专有服务 | 不开放 | 平台拥有 Products；免费非商用，付费期间生成获永久全球商用；二进制作品嵌入，禁止独立素材分发/高度近似衍生资产销售 | 👀付费合规用途候选；不可直接把动作 FBX 公开到开源游戏仓库；条款禁止未授权机器人/脚本，批量接入另核官方 API |
| Spine 编辑器＋Runtimes＋资产包 | 编辑器专有；runtime 源码可读但专用协议，不是 MIT | 无生成权重 | [编辑器协议](https://us.esotericsoftware.com/spine-editor-license)Essential/Pro 过去 12 月收入＋投资/融资合计<$500k；超限 Enterprise。Trial 无 runtime 权；Education 非商用。[资产包协议](https://en.esotericsoftware.com/spine-asset-pack-license)只作为软件嵌入，禁源码形式分发包内源代码；各组件许可仍独立 | 👀完整许可路径候选；买骨骼数据不自动免 runtime 许可；不要求玩家各买许可证，应按编辑器协议§2 正确许可集成 |
| Cascadeur 2026.2 | 专有编辑/辅助动画 | 不授自托管权重 | Free 非商用且无 FBX/DAE 导出；Indie 年营收或融资 <US$100k，Pro 商业门槛不同。完整 EULA 输出/旧免费历史未在本轮闭合 | 👀付费比较，不能作免费发布管线默认；不是本基准必需工具 |
| AccuRIG / ActorCore 动作 | 专有软件，AccuRIG 免费不代表商店动作免费 | 不开放 | [2026-05-25 软件 EULA](https://www.reallusion.com/Content/EULA/AP/EULA_AP.htm)与[内容 EULA](https://www.reallusion.com/Content/EULA/EULA.htm)分开；自有网格、ActorCore 或 CC Base 有不同边界，Editorial/Trial 不能混同 | 👀软件候选；发行前按实际角色/动作 SKU 与来源清权，不以免费按钮全盘放行 |
| MoCapAnything V2 指定 code/checkpoint | 固定代码 MIT，BRIA 文件例外 | 固定 epoch60.pt 卡 MIT；RMBG 另许 | 未见主权重独立输出 NC 限制，但默认 BRIA 依赖非商业，Truebones 数据另许；本轮没验证去依赖路径 | 👀主模型、⛔默认免费商业整套；不存在“小团队自然豁免” |
| Shards Asset Toolkit 94bd4787 | MIT 代码 | 调外部服务，无自有模型许可替代 | 示例 Meshy/Mixamo 资产的再分发不由 MIT 自动覆盖 | 🧪借鉴代码，不默认复制示例资产 |

注：Rokoko 已从 Vision 产品页直接点条款复核：`/terms-of-use-update`重定向至`https://www.rokoko.com/terms-of-use`，生效 2026-07-16，版本 2.0.1；不是把一般网站条款当软件输出许可。

## 5. 只靠程序能补与不能承诺补的分界

| 缺陷/修改 | 可程序化操作 | 前提/不能保证 |
|---|---|---|
| 单位、朝向、时间基准 | 坐标换算、重采样、统一 fps、四元数规范化/连续化 | 先知道源坐标与绑定关系；无穷/NaN 及错误骨名应拒绝，不能默默跳过 |
| 别的骨架动作扭转 | 明确源/目标 rest 基底转换、链映射、root 比例 | 修正机制错误；不等于补出原本没有的自然握持 |
| 小幅脚滑/末端偏差 | 接触标签＋IK、有限 root/stride warp | 目标可达、支撑脚身份正确；腾空/跨步不能全程锁脚 |
| 高频抖动 | 低通/曲线减噪，保留事件附近关键帧 | 错误姿态不能滤成正确，可能削弱击打瞬时速度 |
| 循环接缝 | 选周期、时间/姿态对齐、限定窗口混合 | 动作本身有对应周期；单次落地/死亡不应该强制 loop |
| 武器/壳被软化 | 已正确标识的刚性部件分配到指定骨/独立 socket | 粘连且无法可靠分割会误选；缺面/缺关节须重新生成或换模型 |
| 2D 换衣色、同规格装备 | 换 palette/slot/sprite，保骨架和事件 | 新装备轮廓/遮挡/肢体拓扑改变可能要新图/新动作 |
| 攻击提前或加重 | 局部 retime、层权重、IK 目标、声音/命中事件重定位 | 物理和视觉合理性需看真实玩法；程序可改时序不能保证动作意图正确 |

这些是机制推导/采用条件，不是本轮实测成功率。必须把“程序能实现操作”与“程序能确定正确视觉答案”区分开。[研究]

## 6. 第二次修改的最小后续验收（本轮不执行）

1. 保存同一 rig/模型 hash、clip 命名与单位/fps、模型/服务版本、source 运动/seed、root 策略、Avatar/retarget pose、事件/contacts，以及原始与处理后文件；不依赖服务历史保存。[经验]
2. 第一版用最小完整玩法动作组进入引擎，先通过目标设备占屏尺寸下的实际剪影、接触、地面与动作事件要求，别只看 DCC 正面。[经验]
3. 第二版做两类改动：保持骨架换同规格外观/装备；将攻击命中提前且恢复不变，或提高移动速度并保持脚落点。再加一个确实需要新语义的动作，区分参数可复用与内容缺口。[研究]
4. 自动核骨架映射、clip 非空/时长、有限数值/四元数、根轨迹、事件顺序/范围、末端接触漂移、首尾姿态与速度、旧引用。阈值按相机、角色尺寸、速度和玩法定，不伪造通用合格毫米线。[研究]
5. 再看实际角色/道具与状态转换；“握得对、动作能读、打击有力、风格一致”不以单一数值代替。有限重生/重录后仍需刷权重、手画帧或逐点摆姿才能通过，就回退到现成组或缩小动作需求。[经验]
6. 总成本按全部服务费＋本地算力＋挑选/重录/代码修复/回归主动时间，除以合格动作秒数或合格动作数；保存第二改增量，不能只报每生成秒价。[研究]

### 成本例（只算术，不是实测）

Uthana 8 秒 Text V3 一次 US$0.80，十次候选 US$8；Video 2.1 十条各 8 秒按价格页输出口径为 US$4；循环另计。Rokoko Basic 月付 US$12 含 600 秒，但只用 80 秒时不能报“每分钟 US$1”，年付折算也不等于月付账单；双方淘汰率、录制时间与质量未知。Move Gen2 按 2credit/人秒，Starter60credit 对应 30 秒，不与其他服务 600 秒额度直接当效果性价比。[一手价格／研究算术]

## 7. 本轮实际验证与剩余问题

[研究] 历史交付：完整离线 14 阶段，测试 97／26／10／13／14 项、非空无 skip；`git diff --check`、新增文件空白／UTF-8／LF 及公开仓库安全检查通过。整合核 74 处标题引用，独立复核补 DeepMotion 自动访问限制；只证仓库交付，非外链事实、引擎或 hosted CI。

仍待后续授权试验：同一角色的 loop／contact 与第二次修改对照；MoCapAnything 默认受限依赖的合法替代是否可运行；Shards 的 rest 基底、轴、root 与循环修正。Move One 完整输出权利、特定 ActorCore SKU 和 Epic sample 跨引擎许可未闭合，不作已放行默认。未安装软件、下载权重、调用付费生成、运行模型或引擎。[研究]

## 评审后修订：授权表格呈现（2026-10-14 11:15 UTC+8）

[研究：实际离线复现] 对云端评审 F2 独立核验：Rodin 后空行切断 GFM 表格，随后七条动作授权只呈现为段落。使用环境已有 pandoc 的 `--from=gfm --to=html` 分别转换修订前后正文，以标准库 HTMLParser 检查生成 HTML：修订前七项均不在表格行；删除该空行后七项全部为表格行且各五列。仅修呈现，不改变许可判断；这是本地 GFM 转换结果，非 GitHub 页面视觉/真实引擎/模型效果验证。完整离线和差异检查随本结果提交执行。

## 8. 动态事实表（2026-10-14 补核）

[研究：范围] 覆盖动画正文及本记录的动态型号、价格、许可和服务条件；日期是本次读取，不是不可变网页快照。每行在“实际采用前”与 2026-11-14 中较早者复核；未登录账户或购买，不用公开价页替账户 SKU、实际输出或发行许可。代码、权重、训练来源、第三方依赖及输出分别判断，许可可读不等于版权安全全过。

| 事实／精确范围 | 官方来源与本次状态 | 核实日期 | 下次复核 | 对采用的影响 |
|---|---|---|---|---|
| Uthana Text 3.0／Video 2.0、2.1／Locomotion 1.0 分开计价：US$0.10／0.05／0.02 每输出秒；循环 US$0.01／秒、绑定 US$0.15／次 | [官方价格](https://uthana.com/pricing)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 不是旧无限订阅；循环、淘汰和录制时间另算 |
| Text 3.0 是生成式表演；Video API 默认 2.0，2.1 才带模型后处理 | [Text](https://uthana.com/models/text-to-motion)、[Video](https://uthana.com/models/video-to-motion)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 显式保存版本；提示词与指部输出都不保证精确接触 |
| Locomotion 有方向、速度 0.25–8 m/s、1–5 步对和 root／in-place 导出 | [官方说明](https://uthana.com/models/locomotion)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 参数可修改不等于寻路／碰撞控制器 |
| Uthana 付费输出归属、免费 CC BY 4.0、默认模型改进、专门 no-training 例外 | [Terms v1.1.0 §8](https://uthana.com/terms)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 付费不自动禁止训练；上传前核输入授权及保密要求 |
| Rokoko 2026-07-16 并入 Create，8 月 16 日结束旧双机位／webcam | [迁移公告](https://support.rokoko.com/hc/en-us/articles/48823033216017-Rokoko-Vision-and-Rokoko-Create-What-you-need-to-know)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 不按旧双摄工作流选型 |
| Vision 3.0 免费 30 秒／月；Basic US$12 月付或年付折合 US$10／月，600 秒；无手指追踪 | [Vision 页](https://www.rokoko.com/products/vision)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 额度与最终通过动作秒数不同，不默认解决手部接触 |
| Rokoko 用户内容／平台素材分开；§4.4 未特许不得脚本／自动访问 | [2026-07-16 v2.0.1 条款](https://www.rokoko.com/terms-of-use)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 不搭无人值守网页批处理；自录输出与 Motion Library 另核 |
| DeepMotion 免费非商用；付费期间生成有永久非独占商用许可；原始动作不得独立再分发 | [Terms：Products、Commercial License、Prohibited Activities](https://www.deepmotion.com/terms-of-use)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 游戏二进制嵌入与公开 FBX 不同；自动化另核官方 API 授权 |
| DeepMotion Rotoscope 返积分需人工纠错；SayMotion 单价仍未取得可靠正文 | [Animate3D 定价](https://www.deepmotion.com/pricing-animate3d)、[SayMotion 定价](https://www.deepmotion.com/pricing-saymotion)，本次重读，后者仅返回页面框架 [一手／研究] | 2026-10-14（单价未闭合） | 采用前或 2026-11-14 | 不把手工纠错计作零手修免费生产；不补猜单价 |
| Move One Starter US$18／月＋VAT，60 credits；Gen1／Gen2 每人秒 1／2 credits，免费 30 一次性 | [官方价格帮助](https://docs.move.ai/knowledge/move-one-pricing)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | Gen2 仅对应 30 秒；完整输出 EULA 仍未闭合，保持条件候选 |
| Mixamo 免费商业游戏、人形输入；中国国家码及企业／联合 ID 不可用 | [Adobe FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 先核账户／输入，再比较；不能把 FAQ 更新日期当今天才发布 |
| Mixamo 内容／输出不得用于 AI 创建、训练、测试、改进；源素材分发另受限制 | [2021 附加条款](https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/Mixamo-Addl-Terms-en_US-20210623.pdf)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 普通引擎重定向不据此解释为模型训练 |
| AccuRIG 免费是 guided rigging，功能有高级版边界；软件／ActorCore 内容许可分开 | [功能页](https://www.reallusion.com/auto-rig/accurig/)、[软件 EULA](https://www.reallusion.com/Content/EULA/AP/EULA_AP.htm)、[内容 EULA](https://www.reallusion.com/Content/EULA/EULA.htm)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 未核实际动作 SKU；免费工具不为购买／Editorial 资产清权 |
| SkinTokens／TokenRig 代码和指定 `grpo_1400.ckpt`＋`last.ckpt` 卡 MIT；最低 14 GB NVIDIA 显存是作者要求 | [代码](https://github.com/VAST-AI-Research/SkinTokens)、[官方双 checkpoint 卡](https://huggingface.co/VAST-AI/SkinTokens)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 保骨架补 skin 可评估；训练源不因模型 MIT 全变 MIT，依赖／输入仍核 |
| HY-Motion-1.0／Lite 无 seamless loop、in-place、多人与非人形；社区许可限制输出地域及百万 MAU 条件 | [仓库](https://github.com/Tencent-Hunyuan/HY-Motion-1.0)、[代码 License.txt](https://github.com/Tencent-Hunyuan/HY-Motion-1.0/blob/master/License.txt)、[权重许可](https://huggingface.co/tencent/HY-Motion-1.0/blob/main/LICENSE.txt)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 保留 WP1 全球商用暂缓；境内生成不绕过输出地域限制 |
| GVHMR 仅教育／研究／非营利用途，商用须另许 | [官方 LICENSE](https://github.com/zju3dv/GVHMR/blob/main/LICENSE)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 不用“仅导出动作”规避商业运行限制；checkpoint／人体模型另核 |
| MoCapAnything V2 主 checkpoint 卡 MIT，运行时自动取 RMBG-1.4／DINOv2；RMBG 免费非商业 | [权重卡](https://huggingface.co/kehong/MoCapAnythingV2-weights)、[BRIA 卡](https://huggingface.co/briaai/RMBG-1.4)，本次重读；固定主代码／NOTICE 沿用 §2.D [一手／研究] | 2026-10-14 | 采用前或 2026-11-14 | 保留默认组合不可免费商用；替换路径尚未运行验证 |
| Cascadeur 2026.2 动画层 Alpha；Free 非商用且仅 CASC，Indie 门槛含营收或融资 | [发布说明](https://cascadeur.com/blog/view/cascadeur-2026-2-animation-layers-easing-new-languages)、[计划 FAQ](https://cascadeur.com/plans)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | **修正只写年收入的漏项**；页面不代替完整 EULA ／历史免费权益审定 |
| Cascadeur 当前美元公开价：Indie US$19 月付／US$96 年付，Pro US$49 月付／US$396 年付 | [计划 FAQ](https://cascadeur.com/plans)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 替换上一轮 PLN 返回说明；实际税、地域／结账另核，不用年付折算冒充月账单 |
| Spine 编辑器 Essential／Pro：过去 12 月营收、投资与融资合计 <US$500k；runtime 另有集成许可 | [编辑器协议 §1–2](https://us.esotericsoftware.com/spine-editor-license)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 不是只按游戏收入；源码可读不等于 MIT，不要求玩家各买编辑器 |
| Spine Hitman／Gunman 各 US$10；资产包仅嵌入软件、源文件再分发受限 | [包页](https://en.esotericsoftware.com/spine-asset-packs)、[包协议](https://en.esotericsoftware.com/spine-asset-pack-license)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 购买包不免 runtime 许可，旧 Unity 示例不保证直接可用 |
| ReMoMask CC BY-NC-SA 4.0；MixiMotion／SAM 3D Body 不提升到已清权时序动作默认 | [ReMoMask](https://github.com/AIGeeksGroup/ReMoMask)、[MixiMotion 论文](https://arxiv.org/abs/2609.23010)、[SAM 仓库](https://github.com/facebookresearch/sam-3d-body)，本次重读，后两条的完整交付／许可链未闭合 [一手／研究] | 2026-10-14（部分未闭合） | 采用前或 2026-11-14 | 只留观察；不以论文速度、单图重建或封装名字代替游戏动作资格 |

[研究：保留的反证] Shards 固定 SHA 的 rest 基底／身高缩放／`--loop` 反证未撤销，历史开发者展示与估算不改称当前实测。固定版本 Unity／Unreal／2D Animation 机制保持原范围，不声称已经逐版本验证；Epic sample 跨引擎许可、Move One 完整输出合同、ActorCore 实际 SKU、MoCapAnything 合法替代路径仍未闭合。

[研究] 历史阶段 F 局部检查：`check_repo.py` 177 文件无错误，四文件 `git diff --check` 和本地锚点通过；已有 pandoc 的 GFM 渲染确认两张决策表、20 条音频／22 条动画动态事实均为五列表格。该轮未重跑完整离线入口。

## 连续性补研与升级边界

核实：2026-10-14 UTC。主线二／三；本节回答「完整动作组已有之后，怎样提高连续性而不让第二次修改失控」。不重复 [WP10](2026-10-14-game-wp10-client-modules.md) 的 motor、碰撞和 root 位移所有权；只比较视觉动作选择、过渡、接触与内容修改。以下为官方正文、作者源码的静态核查及条件推导；未导入插件、运行演示／引擎、训练或测量体验。[研究]

### A. 不把四种不同问题都交给更长 blend

| 看到的缺口 | 最小有效改变与资源要求 | 何时应换动作，而非继续修参数 |
|---|---|---|
| 走跑之间双脚交叉、身体忽高忽低 | 同骨架、风格兼容的循环；左右脚接触在归一化时间对齐，再做速度／方向混合 | 源动作步态或身体姿势不兼容，长混合只会平均成含糊动作 |
| 急停像滑行，转身像原地旋转模型 | 补真实启停／转向动作；有合法根轨迹时派生距离曲线，以剩余距离选采样点；只在小范围修步幅／朝向 | 没有承重、换脚、髋肩转动等内容，IK 或更快循环不会创造它 |
| 选到了合适动作，切换仍弹跳 | 先查可打断规则与相位；再对合适转换用惯性化延续姿态变化，最后做 IK | 目标姿态相差过大、混合冲淡打击关键帧，需专门过渡或更好的入场姿态 |
| 支撑脚滑，但手感轨迹已对 | 以动作接触标签控制锁定／释放，有限修正腿链，必要时离线清理 | 持续超出腿长、髋明显下蹲或脚被拖住，说明轨迹／动作不匹配，不无限提高约束 |

表中是本任务的采用判断 [研究]。机制依据：[Unity 6.3 Blend Trees](https://docs.unity3d.com/6000.3/Documentation/Manual/class-BlendTree.html)要求相似动作、相位对齐；[Epic Distance Matching](https://dev.epicgames.com/documentation/en-us/unreal-engine/distance-matching-in-unreal-engine)通过距离曲线驱动采样，曲线可从 root-motion clip 生成；[Pose Warping](https://dev.epicgames.com/documentation/en-us/unreal-engine/pose-warping-in-unreal-engine)区分朝向、步幅和坡度修正，并公开腿伸展／髋位移限幅。其 Slope Warping 节仍警告开发中，不能由页面存在推断整组功能可依赖发行。[一手]

[Unity Animation Rigging 1.4 Two Bone IK](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.4/manual/constraints/TwoBoneIKConstraint.html)只提供 Root／Mid／Tip、Target／Hint 与权重控制，不提供自动接触识别。[Epic Blend Nodes](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-blend-nodes-in-unreal-engine)说明惯性化开始后源动画不再求值，其后续 Notifies 不再触发；Dead Blending 仍列为 Experimental。[研究] 因此把伤害、恢复或脚步的唯一真值藏在即将停止求值的 clip 中，会让换混合方法顺手改变玩法；应核对事件与取消政策，而非把惯性化当无副作用开关。

### B. 近期作者实现：足锁不能只追求零位移

Daniel Holden 的 [2026-07-30 原文](https://theorangeduck.com/page/inverse-kinematics-foot-locking)把现有姿态的小修正、接触期间锁定／退出和离线处理分开；接触判断使用运动信息，锁定超距会释放，避免无限拖住脚。作者强调这是有用配方而非已证明最佳方案。[一手]

固定仓库 `orangeduck/GenoView-InverseKinematics@3b9920c7dd5436c5bc05f045002a64f085c69a9d`，提交 2026-07-30；[LICENSE](https://github.com/orangeduck/GenoView-InverseKinematics/blob/3b9920c7dd5436c5bc05f045002a64f085c69a9d/LICENSE)为 MIT，[README](https://github.com/orangeduck/GenoView-InverseKinematics/blob/3b9920c7dd5436c5bc05f045002a64f085c69a9d/README.md)另指向多个动作数据集。代码许可不替这些数据清权。[研究] 借锁脚机制，不搬示例数据作为商业训练库；把脚漂移与髋膝轮廓一起看，不能优化单个误差到姿态失真。原文示例平面高度夹取也不是任意地形／移动平台的完整接触系统。

### C. Unity：可借作者包，但其数据工作与接触边界要算入成本

固定 `JLPM22/MotionMatching@35fc8ee9a0fd97f12de458ea81eaef7c8219d87a`，提交 2026-04-24；[MIT](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/LICENSE)。[README](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/README.md)写 Unity 6+、其他版本未测试，定位仍为 work-in-progress，展示的应用以研究项目为主；不把它写成商业游戏实证。[package.json](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/package.json)是 0.3.2，仍声明 Unity 2020.1 最低字段，依赖 Burst／Input System／Splines。README 与元数据不能合成「Unity 2020—6.3 全验证」。[一手／研究]

[作者数据库文档](https://joseluisponton.com/motionmatching-docs/basics/animation_database/)要求相同骨架的 BVH、T-pose、髋轴、骨骼映射、轨迹／姿态特征和预处理数据库；不是任意 FBX 混在一起。[Animator 集成](https://joseluisponton.com/motionmatching-docs/advanced/unity_animator/)通过独立姿态处理、mask 和惯性混合桥接 Animator，可保留上身动作而仅检索下身。[研究] 零手修基准下，程序员可做导入、映射、特征配置与标签脚本，但不能把缺失的双手持物步态交给转换格式解决。

静态源码证据：[MotionMatchingController.cs](https://github.com/JLPM22/MotionMatching/blob/35fc8ee9a0fd97f12de458ea81eaef7c8219d87a/com.jlpm.motionmatching/Runtime/Core/MotionMatchingController.cs)分开暴露搜索间隔、惯性化、足锁、超距释放和轨迹／姿态权重；输入突变会强制搜索，标签改变限定候选集合。`UpdateFootLock` 以接触信息锁定并做双关节 IK，但落脚高度赋值处仍有 TODO／注释，不能把内置 FootLock 称为完整地形落脚。此为固定代码路径观察，非引擎失败复现。[一手／研究]

**🧪 条件采用：** 已有同风格的起停／转向／侧移动作，近景角色经常改变方向，逐条转场维护成为真实负担时，比较此类检索包；只有少数动作时保留原生路线。评估成本包含特征、标签、事件、姿态同步及目标设备 CPU／内存，不能只比较状态机图节点数。[研究]

### D. Unreal 最新官方路线本身就是混合，而非全面替换状态机

[Epic 2026-08-12 GASP 5.8 更新](https://www.unrealengine.com/tech-blog/download-the-latest-game-animation-sample-project-now-updated-for-ue-5-8)说明 Mover Pawn 使用状态机驱动 blendstack，Chooser 的 Pose Match Column 搜索有效动画，且允许 Blend Spaces 加入选择／混合；这是按局部职责组合的官方例子，不是证明任何引擎迁移都更便宜。[一手／研究]

[Pose Search 当前文档](https://dev.epicgames.com/documentation/unreal-engine/motion-matching-in-unreal-engine)公开骨骼／轨迹特征、权重、数据库和重复 Notify 过滤等设置。[研究] Motion Matching 把「手写每对过渡」转成「供给合适数据并定义搜索」，不会让错误步态变正确；查询权重过度偏向即时轨迹或姿态连贯会产生不同取舍。自由移动可用检索，精确攻击／受击继续显式选段和管取消；相同方法也可仅用于复杂动作的入场选姿。

[Fab GASP 条目](https://www.fab.com/listings/880e319a-a59e-4ed2-b268-b32dac7fa016)可确认官方样例入口，但本次公开抓取的 License terms 字段未返回具体条款。[研究] 延续本记录既有跨引擎许可未闭合判断：可以借公开机制，不据「能 Export」放行 Unity 使用，更不自动授予训练权。实际采用须核账户取得的具体资产许可与引擎条款。

### E. Learned motion：有新工具，但可修改性仍是门槛

1. **传统 Learned Motion Matching 的明确收益是压缩／扩展，而非免费补内容。** [Holden 论文页](https://www.theorangeduck.com/page/learned-motion-matching)用网络替换匹配系统组件，减少保存完整动作库的需要。[作者实现](https://github.com/orangeduck/Motion-Matching/blob/57b7250e0d34a4e456a34d47e24c2f05fdcc711e/README.md)固定提交 2025-02-06，注明改特征／匹配权重需重建与重训；代码 MIT，所指 Ubisoft 数据为 CC BY-NC-ND 4.0。[研究] 不能把教程的代码、数据和训练网络当成同一商业授权；更不能从一次训练效果推断第二改只改参数。
2. **2026-08 的 AnimGen 已是另一条前沿路线。** [UE 5.8 官方 API](https://dev.epicgames.com/documentation/unreal-engine/API/Plugins/AnimGen)把它列在 Experimental，控制器以 flow-matching 网络逐帧自回归生成姿态；不能将其直接等同于上述三网络 LMM。[官方示例](https://www.fab.com/listings/df37eb46-09bf-4604-9307-cdc39c769790)包含能重训的持手枪玩家控制器，以及不提供训练数据、不能在编辑器重训的多风格 NPC 控制器。[研究] 后者可显示风格扩展能力，却无法证明新道具／新动作的生产闭环。
3. **许可与输入另核。** AnimGen 示例公开条款字段未给出可审定的完整许可，同时显示 `Allows usage with AI: No`；该字段与示例明确支持的重训范围如何对应，仍需核具体条款，本轮不把展示／免费获取认定为任意训练授权。教程页抓取未取得正文，不凭搜索摘要补训练配置或耗时。沿用 WP4 已核 Mixamo 训练限制：普通商业游戏可用的 clip，仍可能不能用来训练模型。[研究]

**👀 保持研究候选：** 只有已有路线出现实际数据规模／内存或多风格控制需求，预期收益值得承担训练维护，且拥有可训练数据与可重建工程、目标设备推理预算和回退路线时才比较；若新需求需要作者未提供的数据，而又不允许手工动画制作，应换可覆盖的资产／路线，不能以神经网络名称承诺补齐。[研究]

### F. 第二次修改怎样区分「参数问题」与「新内容问题」

[研究] 对同一角色、同一目标相机，先稳定一次走跑、急转和停止；第二版先改变移动速度／刹停距离，再加双手持物侧移。对照顺序是：

- 原生路线先改采样速度、距离曲线和有限步幅；增加必要持物／侧移动作及 mask，不为凑全覆盖把走路扭成其他步态。
- 检索路线更新轨迹政策、标签／数据库，并回归旧动作；新内容若不在候选库，先取得来源，不盲调搜索权重。记录重复或遗漏的脚步／攻击事件。
- 学习路线确认数据可取得且有训练许可，重建必要模型并比较旧动作；没有数据的预训练示例只算可播放，不算可维护。

人的判断：急转时承重是否可信、脚与地面／手与道具是否稳定、重心与轮廓是否保留、输入回应是否被过渡拖慢。程序可记录接触期脚速／漂移、输入至可见动作时间、搜索／动画耗时与峰值内存；这些指标帮助定位，不能替人判美感，也不设跨游戏通用阈值。最终记新增／淘汰动作数、重建或训练等待、主动调试工时和旧动作退化；只要原路线质量满足且修改局部，就没有为「先进」而迁移的理由。[研究]

本补研完成直接来源、提交／许可与关键代码路径核查；没有运行真实引擎、测量零手修通过率、训练开销或质量提升。静态源码反例仅约束可承诺范围，后续实测仍需另获授权。[研究]

[研究] 历史连续性补研：完整离线 14 阶段（非空无 skip）及两文件 `git diff --check` 通过，仅仓库检查。

## 比例与装备补研：接触参照、可达性与体积

核实：2026-10-14 UTC。主线二／三；改变「第二版保持骨架换装备即可复用」过于宽泛的理解。新证据为 UE5.8 相对接触机制、固定版本 IK 源码的可达性契约，以及历史生产中的形态分支／攻击覆盖反例。不重复前节 MM、足锁、接触相位或 AnimGen；以下仅资料与源码静态核查，没有模型／引擎运行。[研究]

### A. 先分接触参照，再诊断求解器

[Epic Animation Retargeting](https://dev.epicgames.com/documentation/unreal-engine/animation-retargeting-in-unreal-engine?lang=en-US)用步枪换弹说明：Hand IK Bones 可保道具关系，但伸手到口袋取弹匣时应切换策略；普通跑动始终保源脚位置还可能扭曲腿形。[一手]

[研究] 因此第二改先把动作分成「参照世界／道具／目标角色身体」的接触段。握枪、取弹匣、插回弹匣不共用一个永久偏移。参照系错误可以程序修；新胸甲挡住原来的手臂路径，则即使终点接触正确也未解决问题。先比较合法目标／肩躯干的小范围调整，再选不同进出路径的现成动作或改变装备；不要直接提高 IK 权重。

[Unity Animation Rigging 1.4.1 工作流](https://docs.unity3d.com/Packages/com.unity.animation.rigging@1.4/manual/RiggingWorkflow.html)明确约束按层级深度优先顺序收集执行。[研究] 整理对象层级也可能改变求解结果，顺序应随角色配置保存和回归；后加躯干／瞄准修正可能破坏前面已经成立的手部关系。这是机制推导，非本轮引擎复现。

### B. 固定源码：过近、奇异与软化，不是同一种失败

采用可复核版本标签 `guillaumeblanc/ozz-animation@0.16.0`；[实现 L100–164、L306–345](https://github.com/guillaumeblanc/ozz-animation/blob/0.16.0/src/animation/runtime/ik_two_bone_job.cc#L100-L164)、[接口 L63–110](https://github.com/guillaumeblanc/ozz-animation/blob/0.16.0/include/ozz/animation/runtime/ik_two_bone_job.h#L63-L110)文件头为 MIT。[一手：版本源码]

- `Run()` 的有效执行与 `reached` 分开；前者成功不能证明已接触目标。
- 两节链除最大伸展距离外，还存在两节长度差绝对值对应的不可达近区。
- `soften` 主动允许末端落后以避免伸直突跳；因此未精确到达可以是设计取舍，不是执行失败。
- 接口警告目标方向与 pole 共线／穿越时会翻转，调用者需避免。[一手]

[研究] 新比例即使总臂长相同，也可能因上下臂比例变化让贴身握持落入新的近区。验收应区分数值有效、几何可达、弯曲连续与最终姿态可用；可达只是必要条件，关节限制、装备体积、轮廓仍可能不合格。不要把每个接触残差当 solver 精度问题，也不要用更高迭代数修无解目标。

[Unity 6.3 armStretch](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/HumanDescription-armStretch.html)说明增加伸长可改善平滑，却牺牲真实臂长。[研究] 有限伸缩可按风格接受，但持续明显拉长来满足双手 grip，应撤回该动作／装备组合；不设跨游戏通用比例阈值。

仅借 ozz 的诊断契约，⛔ 不把它推荐为完整引擎重定向替代品：[官方功能表](https://guillaumeblanc.github.io/ozz-animation/documentation/features/)仍将 animation retargeting 列为待规划。其 IK 能力不等于整套接触迁移能力。[一手／研究]

### C. 当前原生反证：体型接触并非一律必须重做

[UE5.8 Retargeting Operation Stack](https://dev.epicgames.com/documentation/unreal-engine/retargeting-operation-stack-in-unreal-engine-5-8)的 Relative IK Retarget 属 Experimental，使用 physics asset 与烘焙 notify 保身体间相对接触；缺该数据不工作。修改用于烘焙的 physics asset 后须重新生成数据；不是任意目标外观修改都无条件要求重烘。Body Intersect Goals 须在 Relative IK 后，否则修正被覆盖。[一手]

[当前设置 API](https://dev.epicgames.com/documentation/en-us/unreal-engine/BlueprintAPI/Utilities/Struct/MakeRelativeIKSettings)公开骨映射、目标物理代理、可达性权重、道具缩放求解与碰撞推出，所列碰撞体支持 sphere、capsule、box。[一手]

[研究] 🧪 同语义动作只因比例改变而错失身体接触时，可先比较这条路线，修正「接触错只能换动作」的过强结论。接入成本包括源接触烘焙、目标代理与映射、操作顺序和第二改回归；换厚装备须审查代理是否仍代表接触表面。IK goal 避碰不等于沿途肢体、衣摆或刀刃网格无穿插。保持已验收动作路线为默认，不因实验功能存在而承诺零手修发行。

### D. 历史生产反例：主动分动作是合理撤回，不是技术落后

- **Spore，SIGGRAPH 2008 作者论文**：[§4.1.1、§5](https://www.chrishecker.com/images/c/cb/Sporeanim-siggraph08.pdf)按直立、有手／脚等形态条件分动作；作者说明系统不理解体积边界，不能有效表达摸下巴／拥抱，且忽略角色内部碰撞。[一手：历史生产系统] [研究] 强泛化依然需要适用类和内容分支；这不证明今天没有更强技术，也不证明其动画师投入可由单程序员省略。
- **Warframe，GDC 2016 开发者复盘**：[页24、30](https://media.gdcvault.com/gdc2016/Presentations/Brewer_Daniel_CraftingAIForBosses.pdf)为 Lephantis 五关节腿使用 particle IK 落脚；头部无法攻击身下区域时增加专门攻击。[一手：历史已发布游戏] [研究] 玩法覆盖变化应补动作／能力，不把瞄准目标可到达当作攻击覆盖充分；这不是当前 Unity／Unreal 的性能或可用性证据。

[研究：采用顺序] 修参照和顺序 → 在合法目标、体积代理与有限身体调整内复用 → 按体型／装备选择动作分支 → 仍不满足则换模型／装备或收窄玩法。新增验收关注过近／过远、弯曲翻转、路径穿插及关键姿态，不再扩写通用检查表。记录新增动作、代理／烘焙改动及主动调试时间；本轮没有零手修通过率或第二改工时实测。

[研究] 历史比例／装备补研：完整离线 14 阶段（非空无 skip）、两文件 `git diff --check` 与正文锚点通过，仅仓库检查。


### Uthana 模型与返回契约补核（2026-10-15 UTC+8）

[一手：当前公开文档，非调用实测] [Video 产品页](https://uthana.com/models/video-to-motion)、[能力文档](https://uthana.com/docs/api/capabilities/video-to-motion)与[GraphQL reference](https://uthana.com/docs/api/graphql#create_video_to_motion)一致：`create_video_to_motion` 的可选 `model` 默认是 `video-to-motion-2.0`，兼容别名 `video-to-motion-v2` 也指向 2.0；选 2.1 必须显式传 `video-to-motion-2.1`。2.0 返回基础 motion，2.1 返回 refined motion IDs。保留原动态表日期，本补核在采用前或 2026-11-15 复核。

- [研究] 接入时保存所请求的完整模型值、视频内容身份、目标 character ID、创建返回的 job ID、终态 `status`／完整 `result` 与最终下载的 motion ID。官方通用教程默认调用和 `result.result.id` 示例不能独立证明 2.1 的精确返回结构；本轮没有取得真实 2.1 返回，不编造字段路径或保证 SDK 已兼容。
- [一手／研究] 官方说明相同视频正在处理、成功后 24 小时内或失败后 1 小时内重传会返回既有 job。文档未明确跨模型是否共享去重键，因此换 `model` 后也要核 job 身份，不能把同一旧 job 当第二个候选；不为绕过去重主动修改源视频。
- [一手／研究] 顺查 Text3.0 发现官方页内口径差异：[能力页](https://uthana.com/docs/api/capabilities/text-to-motion#text-to-motion-30)已写 PAYG 账户普遍可用，但 GraphQL reference 的 `create_text_to_motion_job` 仍标 limited release。不能把后一段当当前统一准入结论；实际采用先核账户资格。两者一致要求异步 `create_text_to_motion_job`＋`model="text-to-motion-3.0"`，不是旧同步 `create_text_to_motion` 的默认示例。

[研究：变化与范围] 正文现在把 2.1 的显式选择和结果身份置于推荐旁，避免只记商品名却取到默认 2.0；原有接触、循环和零手修撤回标准不变。本次未登录账户、调用模型或执行引擎验收，不把后处理存在写成质量通过。

## 交互与时长补研：分段对位和动作进度

核实：2026-10-15（UTC+8）。主线二／三。改变的选择：已有动作的交互目标改变，不应一律增 IK 或换生成器；先判断是整体对位、局部末端偏差，还是支撑路径／动作种类已经变化。此前比例章节覆盖参照、可达与体积，本节新增时间窗口与姿态／位移双时间线，沿用原生混合路线，不增加 Motion Matching 推荐。[研究]

### A. 原生能力分别承诺什么

- **Unity 6.3 `Animator.MatchTarget`**：[API](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Animator.MatchTarget.html)调整 GameObject 位姿，使 AvatarTarget 在指定状态进度到位；只支持 base layer，需 `applyRootMotion`，同时只能有一个匹配，否则新匹配被丢弃。循环 clip 错过 startNormalizedTime 会移至下一圈。`completeMatch` 的中断选项还影响是否立即到目标。[一手：官方合同] [研究] 因此手／脚分段应顺序调度，不能把两个同时提交的匹配当双手 IK；缩短动画或更换转场后应核起始窗口是否仍会执行。接入仍需遵守既有位移权威，不能顺手让 Animator 与 motor 同时写位置。
- **UE 5.8 Motion Warping**：[官方文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-warping-in-unreal-engine)以 Montage Notify State 或蓝图配置窗口与命名目标；Skew Warp 对齐窗口末的 root motion，攀上示例要求窗口覆盖手放上障碍的阶段，并可分别选择平移／旋转等修正。[一手] [研究] 不与 Unity 的 base-layer／单匹配约束混同；终点对齐不证明沿途支撑、肢体路径或碰撞安全。本文没有读取受限 UE 引擎源码，原生部分只按公开合同判断。

### B. Unity 独立开发者：缩短对位范围有收益，扩成交互系统仍有内容代价

[UpRoom Games，Brian 的 Procedural Climbing](https://www.uproomgames.com/dev-log/procedural-climbing)（页面更新 2021-11-15）记录迭代：全程手部 target match 让预备阶段沿墙滑动；只在离地到抓边之间修正有改善，但源 root 后退仍使角色掉落。随后拆成手到边、脚上台的两个短匹配，作者报告有限高度方块翻越已可用；约二十段动作＋状态机仍未覆盖他期望的自由攀爬。[一手：开发者自述，非本仓复测]

反证也保留：作者后来使用 FinalIK、两个基础姿态、效应器时序、弹簧／摆动和抓点系统做出更动态的路线；上台等仍用传统动画。它证明程序运动是一条可行探索，不证明只加 IK 即可，更不证明全程没有美术劳动。本文不复制其示例代码，也不以该文章替付费依赖与素材清权。[一手／研究] 采用建议是：有限翻越优先兼容片段与分段对位；自由攀爬确为核心玩法时才比较专用程序方案，并把接触调度、重心响应和进入／退出动作一起算入维护成本。

### C. Unreal 修订链：变速不能只改可见 Montage

[ALS-Refactored 4.13 发布记录](https://github.com/Sixze/ALS-Refactored/releases/tag/4.13)明确修复 mantling Montage 与 root motion source（RMS）失步，以及忽略 Montage play rate；也修过穿顶并增加目标销毁处理。[一手：作者发行说明] 本轮 `git ls-remote` 固定标签为 `4c4b7390f401eaf6bdbf7d205668e5e0a61da86b`；[README](https://github.com/Sixze/ALS-Refactored/blob/4c4b7390f401eaf6bdbf7d205668e5e0a61da86b/README.md)对应 UE 5.3，属于历史修订而非当前 UE 5.8 插件采用推荐；[LICENSE.md](https://github.com/Sixze/ALS-Refactored/blob/4c4b7390f401eaf6bdbf7d205668e5e0a61da86b/LICENSE.md)为 MIT，不据此推定其他来源动画许可。静态读以下路径，不运行项目：

- [AlsCharacter_Actions.cpp](https://github.com/Sixze/ALS-Refactored/blob/4c4b7390f401eaf6bdbf7d205668e5e0a61da86b/Source/ALS/Private/AlsCharacter_Actions.cpp#L463-L529)：取 `StartTime`、剩余片段时长与 `Montage->RateScale`；RMS 的 Duration 为剩余时长除以倍率。末 root Z 近零则拒绝启动。L223–229 还按目标速度上限过滤，L394–400 按在地／空中和高度分 mantling type。[一手：固定实现] 这些是该实现的适用域，不是推荐其他游戏照抄它的阈值。
- [AlsRootMotionSource_Mantling.cpp](https://github.com/Sixze/ALS-Refactored/blob/4c4b7390f401eaf6bdbf7d205668e5e0a61da86b/Source/ALS/Private/RootMotionSources/AlsRootMotionSource_Mantling.cpp#L37-L62)：由 `MontageStartTime` 加上 RMS elapsed time 乘 `RateScale` 得 MontageTime，再同步 Montage 位置；代码注释注明扣除 DeltaTime 用于避免一帧滞后。目标位置由保存的相对变换重建以跟随移动对象，失效目标则清 RootMotionParams。[一手：固定实现] 借的是两条进度同步和目标寿命的检查点，不将这段项目专用时序公式推广成 UE 通用做法或性能收益。

其自动选起点在 [同文件 L542–599](https://github.com/Sixze/ALS-Refactored/blob/4c4b7390f401eaf6bdbf7d205668e5e0a61da86b/Source/ALS/Private/AlsCharacter_Actions.cpp#L542-L599)直接引用 Laura 的 [2022-05-15 原文](https://landelare.github.io/2022/05/15/climbing-with-root-motion.html)：从源 root Z 找剩余高度，可免手维护一套高度曲线；作者同时说明可能从半段攀爬开始，蓄力另需处理，反弹等多解轨迹需要额外选点规则。示例未覆盖 XY、IK、预备混合，且假设事先预测碰撞后关闭胶囊碰撞，不能作为任意障碍通用模板。[一手／研究] Laura 与 ALS 为明确沿用关系，不计成两个独立成功案例；新根轨迹应保留可选起点的相位语义，不能仅因高度相同就接受。

### D. 采用／撤回与实际验证范围

[研究] **✅ 保留原生路线：** 同类循环相位兼容则混合；同一动作的局部接触偏移则有限 IK／重定向；姿态与支撑顺序正确、整体位置改变则分段对位。**🧪 改造：** 统一动作进度，给交互目标定义可支持的高度／朝向／净空／运动范围。**⛔ 撤回这一动作组合：** 对位只能靠提前离地、删掉必要蓄力、持续悬浮或穿过障碍时，换兼容片段；没有许可片段且不能程序重建可信运动时，收窄可交互范围。缩范围的代价是自由度降低，分动作的代价是内容分支增加，程序方案的代价是主动设计运动与调参；都比把几何误差为零直接算作质量合格诚实。

本轮只读公开官方合同、开发者文章、发行记录和固定源码；没有下载动画包、复制上游实现、运行引擎／模型或测通过率。后续获准实测时，用同一动作改变身材比例、局部／全局时长和目标位置，观察预备承重、抓握后漂移、退出姿态及限制范围外的拒绝行为；与已有比例章节合并验收，不新设实验模块。[研究]

## 剔除补研：范围、更新与动作内容分开

核实：2026-10-16（UTC+8）。主线二／三；改变的选择是：新动作或装备造成边缘消失／离屏后突跳时，先查运行时交接，不能直接归咎生成／重定向，更不把全关剔除当最终方案。既有接触、进度、位移权威建议不变。[研究]

### A. Unity：范围和 Animator 是两份合同

- [Unity 6.3 可见性排查](https://docs.unity3d.com/6000.3/Documentation/Manual/troubleshooting-skinned-mesh-renderer-visibility.html)明确：导入时按当时动画估计范围；后来 additive、脚本骨骼位移、顶点 shader 与 ragdoll 可能超出。能预估时修改最大覆盖范围，不能预估时可逐帧重算。[一手] [研究] 这支持先修覆盖范围；不支持一个任意放大的全项目数值，也不证明 CPU 重算能自动理解任意 shader 位移。
- [组件参考](https://docs.unity3d.com/6000.3/Documentation/Manual/class-SkinnedMeshRenderer.html)区分 renderer 停止 skinning 和恢复，以及 `Update When Offscreen` 逐帧覆盖 bounds；root bone 决定其跟随变换。[Renderer.localBounds](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/Renderer-localBounds.html)同时说明自定义运行时覆盖不会保存进 scene／prefab，要由脚本设置。[一手] [研究] 换装、重建或池复用须重新核正确覆盖是否存在；不能把调试时曾设置过当作发布构建已持久化。这里说的是运行时 API 覆盖，不笼统否定 Inspector 序列化配置。
- [AnimatorCullingMode 6.3](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AnimatorCullingMode.html)中，`CullUpdateTransforms` 停 retarget／IK／Transform 写入，`CullCompletely` 停动画，`AlwaysAnimate` 保留屏外动画。[一手] 这不是 renderer 的同名性能开关；范围正确也不能自动补回被政策停掉的骨骼结果。[研究]

**固定参考源码交叉核对。** `UnityCsReference` 标签 `6000.3.0f1` 经 `git ls-remote` 固定到 `cfcd94f14a5cd69f9a5d2b148d4fe626e7fc46ae`。[SkinnedMeshRendererEditor.cs L180–216](https://github.com/Unity-Technologies/UnityCsReference/blob/cfcd94f14a5cd69f9a5d2b148d4fe626e7fc46ae/Editor/Mono/Inspector/SkinnedMeshRendererEditor.cs#L180-L216)在动态更新分支画 world bounds，另一分支用 actual root bone 矩阵编辑 localBounds；[Animator.bindings.cs](https://github.com/Unity-Technologies/UnityCsReference/blob/cfcd94f14a5cd69f9a5d2b148d4fe626e7fc46ae/Modules/Animation/ScriptBindings/Animator.bindings.cs)的枚举注释与 API 合同一致。[一手：固定源码] 这只是托管绑定与 Inspector 佐证，不是读取原生剔除实现或完成运行验证。文件头为 Unity Reference Only License；本轮仅阅读、链接，不复制实现或把它当可移植 MIT 代码。

**真实历史复现与处理。** [UUM-35020](https://issuetracker.unity.com/issues/11868/skinned-mesh-renderer-bounds-are-not-updated-when-moving-bones)列出 2020.3.47f1 至 2023.2.0a14 多版本复现：旋转腿骨后 bounds 未动，只看见腿而看不见 bounds 的相机角度会让腿消失。Unity 标记 **As Designed**，给出开启屏外更新以按姿态重算的处理，不是发布了一个修复版本。[一手：官方复现／处理记录] 它与 6.3 合同共同支持机制诊断；不证明所有消失都是同一原因，也没有本仓复测或性能测量。[研究]

### B. Unreal：tick、骨骼刷新和 bounds 来源分别核

[UE5.8 EVisibilityBasedAnimTickOption](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/EVisibilityBasedAnimTickOption?lang=en-US)明确 `AlwaysTickPose` 未渲染时不刷新 BoneTransforms；`AlwaysTickPoseAndRefreshBones` 保留两者；`OnlyTickPoseWhenRendered` 只在渲染时执行。另有仅保留 Montage 的不同选项，不能当全部 AnimGraph／骨骼求值。[一手] [研究] 因此先找具体消费者需要动作推进、root motion 还是当前骨骼结果，不能仅根据“角色不可见”或枚举里的 Always 决定。

[UE5.8 USkinnedMeshComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/USkinnedMeshComponent)公开：PhysicsAsset 范围更新可只包含标记的 BodySetups，或通过 `bConsiderAllBodiesForBounds` 纳入全部；`bUseBoundsFromLeaderPoseComponent` 直接沿用 leader 的 bounds。`bIncludeComponentLocationIntoBounds` 的说明专门提到角色离开根部、配合仅渲染时 tick 的情况。[一手] [研究] 换大装备须核范围提供者和参与体，不把身体的旧范围视作所有 follower 的正确范围；包含原点也不等于覆盖所有姿态。

[UE4.27 Out of Bounds Pixels](https://dev.epicgames.com/documentation/unreal-engine/out-of-bounds-pixels?application_version=4.27)是历史机制说明：越出 bounds 的几何可能在转相机时消失，父级范围过小、Physics Asset 与 shader 位移是不同原因；扩大投影物范围有代价。[UE5.8 视口显示选项](https://dev.epicgames.com/documentation/en-us/unreal-engine/viewport-show-flags-in-unreal-engine)仍提供 Bounds／Out of Bounds Pixels 诊断。[一手] [研究] 不用旧页“创建默认 physics asset 即可”的措辞保证新装备必定正确，也不把碰撞 capsule 当 renderer 的范围。本文未读取受限 UE 引擎源码，当前语义来自公开 API。

**架构反例，不伪装成成功修复。** [ALS-Community #106](https://github.com/PanicPetal/ALS-Community/issues/106)（2021-01—02）报告 dedicated server 下改成 `AlwaysTickPose` 后原地转身同步出错，原因分析涉及动画后求值曲线与旋转逻辑耦合；维护者确认需要较大结构修改并以 wontfix 关闭。[一手：项目维护者回应；复现细节为报告者记录] 发帖人提出的 Notify 重构没有在该串获得落地验证，关闭也不等于已修好。只借这个历史反例说明“省掉骨骼刷新”可能同时改玩法消费者，不能推广为 UE5.8 全部角色都要全量更新或量化服务器成本。[研究]

### C. 采用与撤回边界

[研究] ✅ 对动作／装备支持范围可界定的角色，先修正确且有限的范围；范围难以预估再比较动态更新。屏外仍运行的玩法保留其必要数据生产者，纯装饰对象可按需求停止或降频。任何方案若只靠巨大 bounds 或全量更新掩盖错误来源，就先回查 root、继承关系、更新模式与真实变形；这些开关既不修权重也不补动作内容。

未来获准实测时，在同一角色上新增大幅动作和长装备，比较持续可见、掠过边缘、完全离屏期间触发动作、返回首帧，以及池复用／换装后的范围。分别记录 bounds、状态进度、所需骨骼／挂点与玩法结果，再按目标设备测动画／skinning／剔除成本；不以仅在编辑器看起来正常或某个开关治好一次现象结束验收。本轮仅公开合同、历史报告与参考源码静态核查，无引擎／模型／设备运行，无资产下载或收益实测。[研究]


## 程序步态补研：姿态来源与运动结构

核实：2026-10-16（UTC+8）。主线二／三。改变的选择：不按机械／有机外形排除程序路线，而按「基础姿态＋程序层」或「身体规则生成运动」决定输入和维护成本；同结构调参与新运动结构分开。以下是不同时间的设计、生产修订和静态源码，不拼成一次运行结果。[研究]

**许可先过门。** 官方 `WolfireGames/overgrowth` 本次以 `git ls-remote` 固定 HEAD 为 `245fe4828631c84c0023d29d1525f5716ccb6106`，提交日期 2025-03-20。[固定 README](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/README.md)与[LICENSE](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/LICENSE)说明默认代码 Apache-2.0，例外另核；游戏数据与商业资产不随代码开放，分发原资产需书面许可。所读 `aschar.as` 文件头同为 Apache-2.0。本轮仅借机制，不复制实现或游戏资产；Rain World 未取得可复用代码／资产许可，不读反编译镜像，也不将商业素材列为可采用资源。[一手／研究]

**Overgrowth：少量姿态可以扩大覆盖，但不等于没有内容工作。** David Rosen 的 [GDC 2014 原始幻灯片](https://media.gdcvault.com/GDC2014/Presentations/Rosen_David_Animation_Bootcamp_An.pdf)第11／13页讲 Pass/Reach、stride wheel 与同步混合；第25页写移动系统13个关键帧，图示包括 idle、moving、roll、jump、flip；第49页强调动画与代码协作、关键帧负责表演。本次抽取全文并渲染核第25页，不凭视频猜实现。[一手：历史作者设计] 这个数字只对应演讲中的移动系统，不是正式版全游戏动作总量，更不证明免人工摆姿。[研究]

后续 [2017-06 开发记录](https://www.wolfire.com/blog/2017/06/Overgrowth-Progress-Late-June-2017/)明确改进持剑／刀的走跑、添加聆听／园艺／擦剑等动作，并因实现耗时撤回 flying leg choke 的脚本实验；[2017-08 记录](https://www.wolfire.com/blog/2017/08/Previous-Week-in-Overgrowth---Mid-August/)新增鼠专用绞杀动画。[2017-10-16 正式发行公告](https://www.wolfire.com/blog/2017/10/Overgrowth-1-0/)仍调整狼掌击时机、将自动 ragdoll 恢复限制在地面。[一手：开发者修订／发行记录] 这些是持续内容与控制维护的真实反例；没有细分工时或失败根因，不能据此量化程序路线比成套动作更贵，也不把撤回新招式解释为整个系统不可用。[研究]

固定源码交叉核对（只读）：

- [`aschar.as` L11726–11830](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L11726-L11830)的站姿迈步维护落点、交替释放、进度、抬脚高度和脚步事件；方向仍取原动画左右腿 IK 位置。[L11978–12012](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L11978-L12012)普通移动播放 `movement`，混合量用速度除角色尺度；站姿移动另调上述函数并保留 pose／idle。不是一个程序步态代替全部动作。[一手／研究]
- [L12021–12045](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L12021-L12045)按鼠／兔等组合选择专用绞杀片段；[L15439–15447](https://github.com/WolfireGames/overgrowth/blob/245fe4828631c84c0023d29d1525f5716ccb6106/Data/Scripts/aschar.as#L15439-L15447)改尺度时重建 rigged object、重置次级动画与层并刷新骨架缓存。可借派生状态的重建边界，不推广其常数或二足数组为通用多足实现。[一手／研究]

该脚本在此固定版本的[公开提交历史](https://api.github.com/repos/WolfireGames/overgrowth/commits?sha=245fe4828631c84c0023d29d1525f5716ccb6106&path=Data%2FScripts%2Faschar.as&per_page=100)仅见2022初始导入；没有把2017修订定位到对应 commit，也未运行当前代码确认旧版视觉效果。代码属于自研引擎项目，只取可移植的职责分工，不建议迁移引擎。[研究]

**Rain World：有机运动可由程序构造，新物种仍需独有实现。** [2025-09-25 Unity 对 Videocult／Akupara 开发者的采访](https://unity.com/blog/exploring-procedural-design-rain-world)中，Joar 说明早期混合传统与程序动画，后来更偏程序；文中描述 slugcat 为固定距离连接的两个球形身体块，肢体和尾巴是响应输入的视觉层。Benjamin 明确短腿、长蜘蛛腿、鳍、喷射、触手和翼各需独有身体／运动代码；共享基础脚本不改变多数生物按新项目实现的工作量。sprites 仍由图形脚本定位／着色，不是全游戏美术自动生成。[一手：采访中的开发者陈述；身体结构描述为采访说明，未复测] 它是不同作者的商业生产参照，不证明每种生物都由同一个通用求解器生成，也不证明单程序员不需美术工作。[研究]

**采用／撤回。** 🧪 基础姿态已有许可且覆盖动作意图时，比较稀疏姿态加程序层；风格允许、身体和支撑规则可明确设计时，比较直接程序运动。相同结构的速度／尺度调整先看参数及缓存重建；新增肢体、支撑方式或玩法能力，应另计运动代码／专用动作及旧行为回归，不能只报少了多少 clip。仍需手工摆姿或补画才能合格且不符合本基准时，换许可资源、保留局部程序层或收窄能力。本轮无零手修通过率、主动工时、性能或 Unity／UE 运行结果，不提高到 L4，不重复接触求解检查清单。[研究]


## 同骨架复用补研：先保原动作，再决定转换

核实：2026-10-17（UTC+8）。GB／GA，主线二／三；改变动画页人形首试建议：已有同骨架、同体型的完整许可动作时，先保留直接复用，不默认统一转 Humanoid／IK Retargeter。跨骨架、比例变化或所需功能确实需要时才转换；生成补的是内容缺口，不能直接修正引擎表示转换造成的损失。[研究]

### Unity：少一次转换与保留 Humanoid 功能的取舍

- [Unity 6.3 Animation tab／Import Messages](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AnimationClip.html#ImportMessages)列出可能丢弃的位移动画、中间骨骼变换／旋转及缩放动画，并提供 Retargeting Quality Report。相同文档也说明 Generic／Humanoid 都受导入压缩设置影响；因此 Generic 不是整个导入链无损的保证。[一手]
- [UUM-27271 官方结论](https://issuetracker.unity.com/issues/18047/wrong-rotations-are-set-when-using-setlocalrotation-in-animation)将 Humanoid 动作播放、改骨骼旋转与足部求解组合中的数值差异判为 As Designed：Muscle 空间转换和最后求解不是无损；该场景无需重定向时建议 Generic，需要 Humanoid 时改 Muscle 值可减少额外转换，但仍不保证原数值。复现版本是 2020.3.45f1、2021.3.19f1、2022.2.7f1、2023.1.0b5、2023.2.0a3，**不是本仓库对 6.3 的复测**；不同旋转数值也不直接证明最终视觉姿态一定不同。它支持区分表示转换与源内容，不支持宣称全部 Humanoid 动作肉眼变差。[一手／研究]
- [Unity 6.3 Mecanim IK](https://docs.unity3d.com/6000.3/Documentation/Manual/InverseKinematics.html)要求正确配置的人形 Avatar。已有 Animator IK／LookAt 等依赖时，切 Generic 会改变可用能力；不能以“同骨架”跳过消费者核查。这里限定内置 Mecanim IK，不说 Generic 无法采用其他求解器。[一手／研究]
- [Unity 6.3 Root Motion](https://docs.unity3d.com/6000.3/Documentation/Manual/RootMotion.html)说明 Generic 也能使用 root motion／loop pose，但以选定 Root Node 代替 Humanoid 的 Body Transform。换 Rig 路线后重新核根节点、根轨迹和位移权威；不能原样复制设置便算兼容。[一手／研究]

**条件选择：** 同骨架动作本已覆盖玩法、无上述功能依赖时，比较 Generic 保留原骨骼动画与 Humanoid 转换；需要跨角色动作库或既有 Humanoid 能力时保留后者，先检查导入报告、姿态和消费者。当前没有两条路线的目标设备性能、画面保真、零手修通过率或迁移工时；不为潜在性能收益要求迁移已达标项目。[研究]

### Unreal：先共享兼容资产，不照搬 Generic／Muscle 解释

[UE5.8 IK Rig 双足指南](https://dev.epicgames.com/documentation/en-us/unreal-engine/retargeting-bipeds-with-ik-rig-in-unreal-engine)以不同骨架和层级为使用 IK Retargeter 的理由；比例和层级相近时建议考虑 Compatible Skeletons。[Skeletons 合同](https://dev.epicgames.com/documentation/en-us/unreal-engine/skeletons-in-unreal-engine#compatibleskeletons)要求近乎相同的层级结构与命名，比例相近才能取得理想结果；相同结构而比例不同另看 animation retargeting，结构差异很大再看 IK Rig retargeting。[一手]

**采用／撤回：** 已共享 Skeleton 时直接复用已验收动画；多个合适 Skeleton 可比较兼容共享，减少额外转换产物。兼容标记不是姿态修正器，换体型后接触或根运动失真时不能只强设兼容；按实际差异选重定向，仍不满足则换兼容动作／模型或缩小动作范围。Unity 的 Muscle 损失机制不是这项 UE 判断的证据，两者只共享“先问是否需要转换”的选择原则。[研究]

### 第二次修改与本次验证边界

保留原始许可动作、导入结果和转换后结果的对应关系。第二版只换外观时核骨架身份、层级、比例和功能消费者；比较原动作与目标角色的接触、挂点、根轨迹、事件以及旧片段。只改导入／转换即可恢复的差异，不计为生成服务的内容失败；原片段本来缺动作或接触阶段时，保留现有补许可片段／专项生成／收窄玩法的路线。[研究]

本次仅核公开合同与历史问题记录；上述验收是后续引擎检查目标，未运行 Unity／Unreal、模型或真实角色对照，也未证明换路线能省时间或提高质量。无需新增模型、插件或通用重定向框架。[研究]


## P9补核：本地可控短动作

2026-10-20（UTC+8）。**确认质量／性价比档的完整许可动作默认；本地档新增👀Kimodo-SOMA-RP-v1.2，仅补短人形动作缺口。** 不替代绑定工具，也不把公开模型升级成零手修冠军。[研究]

[10月15日变更][p9-k-change]修正 v1.1 混入 BONES-SEED 测试序列及 TF32 评测口径；撤回旧分数直接横比的依据，不把数值变化全算质量提升。[一手] [限制页][p9-k-limit]仍承认脚滑、约束不精确；后处理可帮助但 G1 表现不好，冲突约束可能被忽略，单提示最多10秒。有限程序修正仍不能通过就换许可动作，不无限追加约束。[一手／研究]

[固定README][p9-k-readme]报告全GPU约17GB显存，文本编码移CPU可降至<3GB；不是总RAM、速度或目标机保证，本轮未测这些成本。[安装说明][p9-k-install]要求 gated Llama 3 8B访问资格。另计骨架转换／重定向与回归；[骨架合同][p9-k-skel]明确30关节为模型／核心约束内部，77关节用于可视化与导出，不能据卡中30关节假设导出形状，或把扩展当手指生成。[一手／研究]

HF仓库修订`0e3c89024d896064b6851201373f7834784a386b`的[LICENSE][p9-k-license]为2025-10-24 NVIDIA Open Model License：许商用、不主张输出所有权，但有合规与再分发条件；代码Apache不覆盖权重、Llama、人体资产、输入与依赖，SMPLX分支不随SOMA放行。[一手／研究] 代码固定`e1c219c99b4b94ba48be1fb6a1cbc64ecee4c954`，仅读文档／配置／许可，没有下载权重、安装或运行；未证明零手修通过率、二改工时或GPU／RAM实耗。[研究]

[p9-k-change]: https://github.com/nv-tlabs/kimodo/blob/e1c219c99b4b94ba48be1fb6a1cbc64ecee4c954/CHANGELOG.md
[p9-k-readme]: https://github.com/nv-tlabs/kimodo/blob/e1c219c99b4b94ba48be1fb6a1cbc64ecee4c954/README.md
[p9-k-skel]: https://github.com/nv-tlabs/kimodo/blob/e1c219c99b4b94ba48be1fb6a1cbc64ecee4c954/docs/source/key_concepts/skeleton.md
[p9-k-license]: https://huggingface.co/nvidia/Kimodo-SOMA-RP-v1.2/blob/0e3c89024d896064b6851201373f7834784a386b/LICENSE
[p9-k-limit]: https://research.nvidia.com/labs/sil/projects/kimodo/docs/key_concepts/limitations.html
[p9-k-install]: https://research.nvidia.com/labs/sil/projects/kimodo/docs/getting_started/installation.html

## P28补核：先解决面部供给，再做对白二改

**结论：默认从许可清晰、嘴形／面部绑定完整的角色出发，求解器只补动作。** 2026-10-20（UTC+8）补核；缺合格脸部资源就换完整来源。[研究]

### 1. 来源与求解路线的能力边界

**已有六嘴形 2D 角色时，先试 Rhubarb 的离线时序输出。** [v1.14.0 发布页][p28-r-release]与固定 [README][p28-r-readme]列出必需 A–F、可选 G/H/X；C/E 也承担过渡。程序员可配置嘴形映射，但把同一图片复制成六个 ID 不满足资源条件。它输出嘴形选择和时间，不提供脸部绘制或眼神／头部表演。[一手／研究]

**第二语言需要新录音和新时序。** 默认 PocketSphinx 面向英语，非英语走 phonetic；作者说明后者一般精度更低。dialogFile 是识别提示，不是把不匹配的文本强制对齐声音的保证。实际语言、角色风格与无手修可接受率仍未知。[一手／研究]

**Rhubarb 是本地低接入成本候选，不是整套素材授权。** [MIT 许可][p28-r-license]与作者对生成数据的说明覆盖工具／口型数据；角色图、录音和声音权利仍单独确认。只交付离线结果与随游戏分发工具、依赖是两种成本。[一手／研究]

**缺面部源但接受动漫人形风格，先评估VRoid预设→VRM1.0。** [官方导出](https://vroid.pixiv.help/hc/en-us/articles/15760756822297-I-want-to-learn-more-about-the-VRM-export-feature)保留已配置表情，须留.vroid源。[许可](https://vroid.com/en/studio/guidelines)允许无特别条款预设商用，非CC0；特殊／第三方素材与角色创建应用另核条件。预设不算AI生成。[一手／研究]

**Unity先比现成消费组件，不从零造映射。** [uLipSync固定VRM1适配](https://github.com/hecomi/uLipSync/blob/060587907655235dba86dc7052d0b395c8ecd840/Assets/uLipSync/Samples/04.%20VRM/Runtime/uLipSyncExpressionVRM.cs)需启用USE_VRM10，以UniVRM写表达式权重；[作者说明](https://github.com/hecomi/uLipSync/tree/060587907655235dba86dc7052d0b395c8ecd840)有校准／预烘焙，代码MIT不清角色权利。换音色或语言仍验校准与新音轨配对，未运行验证。[一手／研究]

**VRM扩展名不保证嘴形完整。** [固定规范](https://github.com/vrm-c/vrm-specification/blob/94e82dd346fa6cf0337c4421728640e5252dd38e/specification/VRMC_vrm-1.0/expressions.md)的aa/ih/ou/ee/oh均可选，与Rhubarb A–F非一一对应；须验真实morph、闭口／辅音及overrideMouth与情绪叠加。指定风格或表演超出预设就撤回，不强迫改风格。[一手／研究]

**已有兼容 MetaHuman 时，mouth-region 是改句而不重做全脸的候选入口。** [官方音频驱动文档][p28-m-audio]要求 UE 5.6 起的相应插件、SoundWave 与面部目标；离线可生成全脸、头动和眨眼，Process Mask 可限定口部。该能力尚未在本仓角色上验证。[一手]

**保留眼神与头部层是有条件的合成选择。** 新句的情绪、停顿或长度改变时，旧反应可能已不合适；程序员可调层与时间，掩码不补缺失表演。Performance 里的 Realtime Audio Solver 选项仍是离线生成，不能等同于实时客户端管线。[一手／研究]

**跨引擎可用的许可，不等于跨引擎交付已经就绪。** [MetaHuman 许可页][p28-m-license]允许其他引擎；Unity 路线仍要确认曲线／骨骼映射、材质毛发、LOD 与烘焙后的二改入口。Creator 的联网自动绑定／纹理组装见 [AI 信息页][p28-m-ai]，不能把它当任意离线脸部生成器。[一手／研究]

**Audio2Face 优先留给已有可驱动 rig 的项目。** 固定 [SDK 文档][p28-a-doc]和 [blendshape 接口][p28-a-header]要求 neutralPose、deltaPoses、poseNames 等既有目标；模型几何输出再拟合到这些形变，不能直接补不存在的角色美术。[一手／研究]

**本地 CPU 不应据此成为默认推荐。** [SDK README][p28-a-readme]仍要求 NVIDIA GPU、CUDA 与 TensorRT；CPU 选项属于后段 blendshape 求解。已有头／眼层时，还须明确哪些输出通道可写，不能把强度旋钮当作保持原层的保证。[一手／研究]

**NVIDIA 组件须分别过授权门。** 固定 [总仓说明][p28-a-hub]区分 SDK 的 MIT、模型的 NVIDIA Open Model License、限定用于 Audio2Face 的 Audio2Emotion、仅供评估的 Claire 数据，以及另有协议的 NIM。整套链不能统称 MIT；分发前按实际选中组件逐项检查。[一手／研究]

### 2. 成品采用说明了什么

**Thimbleweed Park 证明的是一条已用过的制作链。** [官方 credits][p28-t-credit]列出 Rhubarb；Ron Gilbert 的 [2017-03-11 制作记录][p28-t-blog]说明角色与台词 ID 一起定位录音，高质量源 WAV 继续派生发布音频与口型。同一文本由不同角色说出，也不能只按文本 ID 覆盖资源。[一手]

**分析录音与玩家听到的音频有时不是同一文件。** 该游戏 Ransome 的消音版本保留对应原始台词供口型分析，改句要同时维护两者的时间关系；不能拿消音段当正常语音重新识别。这是具体生产反例，不是所有对白都要双份音轨的规则。[一手／研究]

### 3. 第二次修改：候选配对，而非覆盖一个文件

**预注册用同一角色的三句对白暴露局部改动成本。** R1 保存角色、台词、语言、嘴形映射版本、源录音与发布音频的对应关系，以及嘴部／眼神／头部层和字幕、剧情事件位置。仅有工具版本不足以恢复对白。[研究]

**R2a 只替换中间句，先检查局部能否成立。** 重做该句音频与口型，连前后句验收；第一、三句的资源保持原版，但第二句变长会移动后续场景时间。眼神和头动仅在语义、时间仍成立时保留，否则明确调整或换可用来源。[研究]

**R2b 用第二语言复验。** 保留角色／台词身份，重做该语言音频、字幕与口型，记录返工与观感。[研究]

**Rhubarb 的输出文件存在不等于本次成功。** 固定 [main.cpp][p28-r-main]先做动画计算，再打开输出写入；没有候选文件的原子替换。识别失败可能留下旧文件，写出失败可能留下不完整文件；必须把成功退出与新候选内容检查一起作为接收条件。[一手／研究]

**格式检查也要区分时间点与区间。** [TSV exporter][p28-r-tsv]末尾收口项是结束标记；[JSON exporter][p28-r-json]用 start/end 区间，元数据含音源路径和时长，却不提供完整角色／语言／剧情层身份。接入方需自持这些关联；公开日志不复制本机音源路径。[一手／研究]

**接收时一起切换已核对的音频与口型，失败则保留原完整配对。** 先验证候选格式、嘴形全部可映射、时间落在新音频内、语言与源录音对应，再替换；静音、跳句、切语言和失败重试还要确认无残留状态。这里是接入设计，不是已执行的回归测试。[研究]

### 4. AI承担范围与撤回条件

**AI 可给候选曲线，Agent 可批量映射和筛错误，程序员负责最终选择与合成验收。** 本轮确认了接口能力与部分实际采用；“无需手修能承担多少”和净节省工时仍未知。验收须分别记录缺素材、错口型、层间表演不合、二改牵连四类失败，避免把美术瓶颈记成模型推理失败。[研究]

**撤回时说明功能代价。** 文本、有限嘴形或远景会改变风格与表演；近景对白不可据此默认删需求。本轮只核资料／源码／作者报告，未运行工具、模型、引擎或客户端。[研究]

[p28-r-release]: https://github.com/DanielSWolf/rhubarb-lip-sync/releases/tag/v1.14.0
[p28-r-readme]: https://github.com/DanielSWolf/rhubarb-lip-sync/blob/9b9573cd21b253c9ba58739bbd1aa0b50b991bff/README.adoc
[p28-r-license]: https://github.com/DanielSWolf/rhubarb-lip-sync/blob/9b9573cd21b253c9ba58739bbd1aa0b50b991bff/LICENSE.md
[p28-r-main]: https://github.com/DanielSWolf/rhubarb-lip-sync/blob/9b9573cd21b253c9ba58739bbd1aa0b50b991bff/rhubarb/src/rhubarb/main.cpp
[p28-r-tsv]: https://github.com/DanielSWolf/rhubarb-lip-sync/blob/9b9573cd21b253c9ba58739bbd1aa0b50b991bff/rhubarb/src/exporters/TsvExporter.cpp
[p28-r-json]: https://github.com/DanielSWolf/rhubarb-lip-sync/blob/9b9573cd21b253c9ba58739bbd1aa0b50b991bff/rhubarb/src/exporters/JsonExporter.cpp
[p28-m-audio]: https://dev.epicgames.com/documentation/en-us/metahuman/audio-driven-animation
[p28-m-license]: https://www.metahuman.com/license
[p28-m-ai]: https://www.metahuman.com/ai-info
[p28-a-doc]: https://github.com/NVIDIA/Audio2Face-3D-SDK/blob/1ca0f02535ed774f5dbcd724a31cd486368dc783/docs/README.md
[p28-a-header]: https://github.com/NVIDIA/Audio2Face-3D-SDK/blob/1ca0f02535ed774f5dbcd724a31cd486368dc783/audio2face-sdk/include/audio2face/blendshape_solver.h
[p28-a-readme]: https://github.com/NVIDIA/Audio2Face-3D-SDK/blob/1ca0f02535ed774f5dbcd724a31cd486368dc783/README.md
[p28-a-hub]: https://github.com/NVIDIA/Audio2Face-3D/blob/4d61b6b81ad7b5108512ea0eab10d8712ea4a236/README.md
[p28-t-credit]: https://thimbleweedpark.com/credits/
[p28-t-blog]: https://blog.thimbleweedpark.com/tracking_talkies.html
