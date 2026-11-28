# 商业 3A FPS 与前沿 Web 3D 架构拆解、资产供给与防自欺双裁判规范

> 创建：2026-11-27（UTC+8）。本文结合本端重构实玩翻车实证、真实商业 3A FPS 公开架构（Infinity Ward / EA DICE / UE5 Lyra & Game Animation Sample）、2026 前沿高口碑浏览器 FPS 一手源码（`Operation Blackout`、`Dust Corridor`、`DeadFace`、`cktang88/3d-fps`），以及 2026 VLM 视觉裁判失效研究论文，建立可直接验收的工程与品质标尺。[一手源码／文档＋一手论文＋本端失败实证]

---

## 1. 研究背景与本端退步实证

在《雪线回波》[第十四批清零重构记录](../collaboration/demo-trial-20261117.md#fourteenth-batch-plan-a-rebuild)中，程序化测试与隔离代码静态盲评曾给出全维度 `7–8/10`、`0 / 8` 严重缺陷的通过结论，但真人键鼠试玩立即暴露该版本实质仍停留在“损坏的劣质玩具 Demo”水平，且相较旧基线全面退步：[本端失败实证，2026-11-27]

1. **基础 3C 逻辑断裂**：第三人称模型绕 Y 轴旋转 `Math.PI` 后，垂直俯仰角直接对脊柱与头部骨骼调用 `rotateX(+clampedPitch)`，导致玩家鼠标抬头看天时角色向地面低头弯腰、鼠标低头时反而将枪口抬向天空；同时第一人称开火剪辑与基础站立/行走剪辑同权抢骨，后坐力位移直接沿 Z 轴把枪托推向近裁面。
2. **第一人称资产与绑定崩坏**：强行裁切全身旧模型的网格作 1P 手臂，导致风衣胸腔网格在换弹与大视角动作中浮入镜头下方；主手枪械退化为在 Python 中用几十个基础立方体硬拼的单网格物体，弹匣无法分离、手指虚抓空气。
3. **清零重构误丢既有成熟资产，却未补齐核心渲染链**：重做时丢掉了旧版已成形的武器模型、越肩防穿墙切肩相机、`DeadBlend`＋`ik_hand_gun` 双手锁定与卫星高程地形，换成平直方盒建筑、光滑正弦波山体、纯色渐变天空，且渲染后处理缺失 `GTAO`、环境烘焙 GI 与第一人称视模自身投影，导致画面被高环境填光（`HemisphereLight`＋方向补光＋强环境贴图）直接洗成“无暗部对比的哑光灰塑”。
4. **裁判标尺自欺**：测试脚本在 1P 只截 `Idle`/`ADS`、在 3P 只截 `pitch = 0` 平视，盲评清单只问“无破洞/无错贴花/瞄具是否为圆/有无投影”等低级排错项，未把“基础 3C 有符号交互”与“真实商业 3A 画面密度对比”设为否决门槛。

---

## 2. 商业 3A 与 2026 顶尖浏览器 FPS 渲染及材质底层对比

对比 EA DICE（Frostbite HDR 调色与预计算 GI GDC 演讲）、Infinity Ward 以及 2026 年社区 4 个最具代表性的高精度 Three.js 开源 FPS（[`Operation Blackout`](https://github.com/taozhuo/operation-blackout)、[`Dust Corridor`](https://github.com/Leonxlnx/claude-of-duty)、[`DeadFace`](https://github.com/penguin-grenade/DeadFace)、[`cktang88/3d-fps`](https://github.com/cktang88/3d-fps)），顶尖画面并非靠提高几个参数实现，而是依赖完整协同的**光影层次＋表面微观法线＋高密度资产构图**：[一手源码／文档]

| 维度 | 本端当前退步切片 | 2026 前沿开源标杆实作（一手源码） | 商业 3A（MW / Frostbite / UE5） |
|---|---|---|---|
| **阴影与视模自阴影** | 单级 `DirectionalLight` 阴影，1P 视模完全关闭投影（`castShadow=false`），枪身无机械压痕阴影 | `Dust Corridor` 用 **4 级视锥贴合 CSM＋专门为 1P 视模单独开 1 级紧致阴影级联**让枪身结构互相投影；`Operation Blackout` 用 CSM＋接触硬化半影（PCSS） | 多级 CSM / Virtual Shadow Maps ＋ 独立 Viewmodel 紧致阴影通道＋微阴影 |
| **AO 与全局光照 / 反射** | 缺失 `GTAO`/`SSGI`，仅 6 步接触阴影＋叠加面片光柱；高强度环境光洗平机库暗角 | `DeadFace` 直接在 Blender Cycles 烘焙**全关卡 GI 光照贴图＋湿污镜面遮蔽图＋盒投影 HDR 反射探针（按光照图压暗暗角）**，灯具走混合直光＋烘焙反弹；`Operation Blackout` 走 **G-buffer → GTAO → Hi-Z 锥追 SSR → 体积雾** | Lumen 硬件/软件实时 GI ＋ RTAO/GTAO ＋ 多探针局部反射 |
| **天空与远景大气** | 无云纯色渐变球＋正弦光滑雪包 | `Dust Corridor` **半分辨率光线步进体积云＋投影为 SH9 环境探针＋云影掠过地面**；`Operation Blackout` 瑞利/米氏散射 LUT 转 PMREM IBL | 物理体积云＋天空大气散射LUT＋高精度扫描地形 |
| **色调与后处理定型** | 未配 LUT、无 TAA 时域稳定与微锐化，近景硬边多 | `Operation Blackout` 走 **Halton(2,3) TAA（YCoCg 方差裁切）→ Karis 双重降采 Bloom → AgX＋ASC-CDL＋32³ LUT → 边缘色散/CAS 锐化** | TAAU/TSR ＋ 物理曝光自动测光 ＋ Filmic LUT ＋ 胶片颗粒与暗角 |
| **材质细节与表面层** | 低频三角波调色，缺高密度法线起伏与表面旧化层次 | `Operation Blackout` 启动时在 GPU 光栅化 **29 种材质打包进 3 张图（albedo+height / roughness+metalness / normal+AO+curvature）**，着色器叠加 **三平面＋POM 视差遮蔽＋随机平铺＋12m 宏观变化＋双层细节法线＋曲率边缘磨损＋重力水渍流痕＋避雨干燥区**；`Dust Corridor` 明确指出**墙面法线做到砂砾级颗粒，否则阳光斜射一秒变成刷漆纸盒** | 多层扫描材质（Base＋Detail Normal＋Vertex Paint 磨损/水渍＋Decal 贴花系统） |
| **1P 武器专用补光契约** | `vmScene` 与主场景光照割裂但未建背影防死黑补偿，材质仍发灰 | `Dust Corridor` **特意为 1P 枪械配置“太阳保底＋肩后软补光（随天空Probe动态缩放）”**，防止进暗室时深色机匣物理上彻底全黑看不清结构（真实人眼有局部自适应）[一手源码] | 独立 Viewmodel Light Rig / Eye Adaptation 局部曝光保护 |

---

## 3. 1P 武器、手臂绑定、视口构图与动画管线

拆解 Infinity Ward（*Modern Warfare* Mark Grigsby 武器动画体系）、Bungie（*Destiny* GDC 1P 动画体系）、`DeadFace` 及 [`cktang88/3d-fps`](https://github.com/cktang88/3d-fps) 实操规范 [`FP_FRAMING.md`](https://github.com/cktang88/3d-fps/blob/130ac2a5c856401ec36e7d35afcfefe40c5801f4/docs/FP_FRAMING.md)，整理成近景制作和验收的五个检查点：[一手源码／文档]

1. **禁止“基础几何体拼主角武器”，禁止“裁切全身低模充 1P 手臂”**：
   - 必须使用专为近景制作的高精分件武器（机匣/枪机/拉机柄/弹匣/瞄具独立子骨骼或节点，具倒角、高模烘焙法线/AO/曲率边缘磨损贴图，贴图密度 10–20 px/cm）配专用手套袖口 FPS 手臂网格（例如通过 Blender 无头管线装配的合规 CC-BY 4.0 专用手套手臂与高精枪械）。
2. **先定同机位构图与 FOV，再判断操作可读性**：
   - 固定世界相机与视模相机的 FOV（注明水平或垂直）、宽高比和实际渲染尺寸。`3d-fps` 的独立视模相机默认垂直 FOV 52°，开镜单独缩窄；这些是该项目的观察条件，不是本作规格。
   - 腰射时保住准星与目标的可见范围。换弹另看手和弹匣是否清楚：[`3d-fps` 的手枪换弹](https://github.com/cktang88/3d-fps/blob/130ac2a5c856401ec36e7d35afcfefe40c5801f4/docs/FP_FRAMING.md#L103-L113)允许枪和持枪手短暂进入中央区，让玩家看清换弹，仍不许支撑前臂和袖口挡中心。不能把这种有意构图与《雪线回波》胸腔误入镜头混为一谈。
3. **DCC 精雕主动作 ＋ 运行期二阶弹簧阻尼层（绝不混播冲突剪辑）**：
   - **主手刚性随枪＋副手效应器级重定向**：如 *MW* 与 `3d-fps` 所示，换弹、战术装填（区分剩弹战术换弹与空仓重拉栓）、拉机柄动作在 DCC/模板内按关键帧刻画节奏与重量顿挫，弹匣骨骼跟随副手与枪械弹匣井轨道切换；跑/走中右手随枪，左手通过**解析两骨 IK＋3 根前臂扭转骨（`BoneTwist_01..03`）**锁住护木或按编排退回腰间弹匣袋。
   - **运行期二阶动力学层**：鼠标甩动滞后（Sway/Lag）、开火机匣后坐踢动（位置＋旋转双弹簧阻尼 `F = -kx - cv`）与 Active Idle 呼吸通过叠加骨骼或 `pivot` 弹簧驱动；播放 `Fire` 时**不得让同权重 `Idle`/`Walk` 在同一组武器骨骼上互斥打架**，而应分清“枪机/击锤局部剪辑”与“整枪弹簧位移＋视角微震”。
4. **真准直光学视差红点着色器（Parallax-Corrected Collimated Sight）**：
   - 严禁在镜片中间摆一个静态 3D 红球充当红点。真实红点着色器（如 `Dust Corridor` 与商业 HLSL 实现）必须在片元着色器中用**视线向量与瞄具光轴夹角偏移采样 reticle UV**，使眼睛偏转时红点始终锁在无穷远准直方向并在超出镜圈边框时被边缘裁切，同时叠加镜片镀膜 Fresnel 反射。
5. **离线 BVH 穿模数学体检（`< 2 mm` 硬门禁）**：
   - 借鉴 `cktang88/3d-fps` `build_rig.py` 自动化校验：离线在 Blender 用 BVH 最近面法线＋8 射线退出投票检测手部/手指/前臂顶点侵入枪体与附件的最大深度，经 6-DOF 掌心拟合、逐指退让与余弦衰减修正通道后，强制压在 **`< 2 mm`**（否则直接阻断导出）。

---

## 4. 3P 3C 与全身动作架构（UE5 Lyra 与 Game Animation Sample）

现代商业第三人称射击游戏（参考 Epic Games [**Lyra Starter Game**](https://dev.epicgames.com/documentation/en-us/unreal-engine/lyra-sample-game-in-unreal-engine) 与 **Game Animation Sample Project** 官方文档）彻底淘汰了“直接拿 4 条互不衔接的循环剪辑硬混＋骨骼硬写 `rotateX`”的做法：[一手文档]

1. **模块化层与连续运动解算**：
   - 通过 **Animation Layers** 解耦基础移动层、上半身持枪层、Aiming 瞄准层与 Left-Hand IK 覆盖层。
   - 启停与急转靠 **Distance Matching＋Stride Warping＋Orientation Warping＋Root Yaw Offset**（或在 UE5.4+ 直接使用 **Pose Search Motion Matching** 结合未来轨迹预测），消除裸播放行/跑循环带来的滑步与“腿动躯体僵硬平推”。
2. **有符号 AimOffset 与后置 `ik_hand_gun` 锁枪契约**：
   - AimOffset（2D Yaw×Pitch 混合空间）**必须在角色/世界坐标系下显式校验符号**：玩家向上抬头瞄准（`+pitch`）时脊柱与头部必须同步仰起、枪口随准星抬高；绝不能因模型导入时绕 Y 旋转了 `180°` 而在骨骼局部轴沿用相反符号。
   - 在 AimOffset 驱动完脊柱与主手后，**紧随其后执行 `ik_hand_gun` 与支撑手 Two-Bone IK**，把左手锁死到武器前护木精确握点，彻底消灭左手虚浮或持枪错位。
3. **越肩相机（3C）基本契约**：
   - 必须具备基于碰撞体的防穿墙推拉臂、狭小空间左右切肩滞回、高角度俯视防入地钳位、以及从玩家摄像机中心命中点向枪口方向收敛的弹道校准。

---

## 5. 合规高精现代 FPS 资产来源与引擎上限对比

| 资产/架构类别 | 已核实公开合规源（使用前仍须按单项目核对最终授权/署名） | 适用与注意边界 |
|---|---|---|
| **1P 高精手臂与握持动画模板** | [`FP_FRAMING.md`](https://raw.githubusercontent.com/cktang88/3d-fps/main/docs/FP_FRAMING.md) 登记清单：Sketchfab `bumstrum (DJMaesen)` 手套手臂（[模型页](https://sketchfab.com/3d-models/fps-arms-9452ce4cddde4110a4fd73e555a8e412)，CC-BY 4.0）；`ccransh` AK-74m/手枪/狙击手动画模板（[AK 模板](https://sketchfab.com/3d-models/fps-ak-74m-animations-94be8385c402474cacd39bc096c6ca14)、[狙击模板](https://sketchfab.com/3d-models/fps-animations-sniper-rifle-c15ae8393d824f5b929e3f69691cdd31)，CC-BY 4.0）；Fab `Free FPS Template`（依 Fab 许可使用效应器轨迹） | **绝不混用全身裁切手臂**；下载原件后统一在 Blender 按实尺 (`0.18 m` 掌长) 过 BVH `<2 mm` 穿模门禁并重导出 GLB |
| **高精现代枪械与光学瞄具** | 同上 [`cktang88/3d-fps`](https://github.com/cktang88/3d-fps) 清单：M4A1 (`Firewarden`, CC-BY 4.0)、SCAR-L (`Hitansh_3DArtist`, CC-BY 4.0)、MP5 (`Rotuma`, CC-BY 4.0)、VSS (`ArmsMuseum`, CC0)、EOTech / Red Dot (`valterjherson1`, CC-BY 4.0)、ACOG (`Argentavisss`, CC-BY 4.0) | 必须含独立弹匣/枪机/拉机柄子部件，禁止再用立方体拼接武器 |
| **3P 动作库与环境扫描 PBR** | Quaternius `Universal Animation Library 1 & 2` (CC0)；[Poly Haven](https://polyhaven.com/) CC0 扫描 PBR/HDRI/环境道具（石块、油桶、灯具、墙体贴图）；[Kenney](https://kenney.nl/assets) CC0 | 对不同来源混合前须在 Blender 统一单位、朝向与光照烘焙 |
| **商业完整 3A 工程框架对照** | Unreal Engine 5 **Lyra Starter Game** & **Game Animation Sample**；Unity HDRP + **Animation Rigging** | 需严格遵守各自引擎/Fab 演示资产的平台发行条款 |

**WebGPU（Three.js / Babylon 9）与 UE5 / Unity 的能力边界判断**：
- **WebGPU 擅长且足以验证通用方法论的部分**：只要配合外部高精写实资产（替代低模拼块）＋ **Cycles 烘焙光照图/反射探针（`DeadFace` 路线）**或 **GTAO＋1P 视模独立紧致阴影＋多细节法线/磨损 TSL Shader（`Operation Blackout` / `Dust Corridor` 路线）**，桌面 WebGPU 在光影质感、1P 枪械金属度、视差红点与 3C 操控响应上可以做出极具说服力的现代写实切片，而且完全沉淀**资产解耦、动画契约、着色器层次与双裁判验法**。
- **WebGPU 的真实工程短板（转向 UE5/Unity 的节点）**：浏览器缺乏开箱即用的 500+ 剪辑 Motion Matching 数据库检索与 Distance/Orientation Warping 节点图、Nanite 虚拟微多边形与 Lumen 硬件漫反射 GI；当上述方法论在独立高精切片上彻底跑通后，转入 UE5（Lyra / GASP）或 Unity 才能直接吃满商用 3A 全量生产力。

---

## 6. 防自欺双裁判验证体系（基于 2026 VLM 裁判一手研究）

为什么自己写的 10 轴评分也会严重虚高、把玩具 Demo 判成 `PASS`？2026 年四篇前沿 VLM-Judge 一手研究直接解释了全部失效根因：[一手论文]

1. **只靠静态图与低级检查必然放行“干净但假”的结果**：[`BlenderWorld` (arXiv:2610.23986)](https://arxiv.org/html/2610.23986) 证实即使前沿多模态模型单独充当裁判也常错过 3D 结构错乱，必须将验证拆成 **Agent-as-Judge（直接用代码审计内部数据结构、骨骼、几何、状态）** 与 **VLM-as-Judge（审视完整序列与原分辨率渲染）** 的双轨体系。
2. **多图过载与无参考打分会导致严重幻觉**：[`Judging to Improve` (arXiv:2606.20364)](https://arxiv.org/pdf/2606.20364) 实测证明：一次喂入 7 张图会让 VLM 裁判退化成 **100% 位置偏置翻转**（必须严格限制为双图对照）；同时“无参考打分”天然奖励“表面干净无报错但实质简陋/错误的模型（clean-but-wrong）”，且同族模型自评会形成循环盲区。
3. **材质与纹理细粒度评估必须双序互换＋正反校准**：[`Cross-Model VLM-Judge` (arXiv:2606.18451)](https://arxiv.org/html/2606.18451) 验证了双序互换且仅采纳一致胜出的必要性；[`3D-DefectBench` (arXiv:2607.10826)](https://arxiv.org/abs/2607.10826) 则发现即使顶尖 VLM 在纹理材质精细度上仍明显落后人类专家，因此必须用已知劣质反例与真实商业参考图共同校准标尺。

基于上述发现，任何 3A 品质交付门禁升级为不可绕过的三段式：
- **Stage A（程序化 3C 与结构检查）**：自动扫查第三人称上抬、平视、下压的世界朝向变化，以及第一人称站立、移动、开镜、开火和换弹。检查骨骼混播、意外网格、弹匣交接和近景穿模；不得以脚本摆拍代替[真实玩家操作](../../domains/game-dev/02-verification-and-playtesting.md#commercial-ref-10axis-blind-gate)。对实际选用的渲染路径检查是否生效，不把某种阴影或间接光算法本身当成通关条件。
- **Stage B（连续动作与目标画质）**：保留真实的第三人称俯仰、横移和冲刺，以及第一人称走动开火与换弹。复用从室外进大厅的路线，同一实际渲染尺寸、两套 FOV 和曝光策略，比武器立体感、手和弹匣的可读性、准星是否被遮挡；单独记帧耗。若现有方案未达标，只切换一项（如视模独立阴影），不要同时换资产或曝光。
  - **反例与取舍：** [`3d-fps` 固定版](https://github.com/cktang88/3d-fps/commit/130ac2a5c856401ec36e7d35afcfefe40c5801f4)在 Apple GPU 自动档停用视模探针和独立阴影，改用半球光、轮廓光和局部灯；[作者性能记录](https://github.com/cktang88/3d-fps/blob/130ac2a5c856401ec36e7d35afcfefe40c5801f4/docs/PERF.md#L53-L84)中，原 32 像素探针仍重绘整关，限制绘制范围并降低更新频率才减轻开销。保留《雪线回波》的桌面画质目标；仅对实际支持的设备档比较替代路线，不能从参考推定哪种在本作更快或更好看。[一手源码与作者测量；本作未试]
- **Stage C（正反双锚点校准 ＋ 双序两图盲选 PK）**：盲评每次只看一组**双序排列（`[参考A | 候选B]` 与 `[候选B | 参考A]`）**的两张原分辨率图，同时参考明确的反例灰盒底线图；裁判问题改为直接二选一与致命缺陷裁决——**“在光影明暗切割、表面微材质与边缘磨损、武器精度、动作自然度与场景建筑密度上，候选是否明显优于劣质灰盒且直逼/不明显落后商业参考图？”** 任何一处仍呈“程序方块/哑光塑料/僵硬木偶感”一律一票否决。
