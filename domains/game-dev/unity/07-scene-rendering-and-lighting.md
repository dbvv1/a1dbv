# 场景渲染与光照：让角色、环境和两档设备说同一种画面语言

**✅ 保现有渲染管线，先做好一个可玩的室外—室内场景：主光与阴影定形，间接光连接静态环境和移动角色，反射交代材质，最后才用后处理统一气氛。** 已有 lightmap／Light Probe Groups 能满足就保留；Unity 6 URP 中，探针布置与动态对象光照一致性成为问题时再🧪比较 APV。不要为学习样例升级引擎或迁移管线。

本页解决已经有模型、材质和玩法之后的场景呈现，不重做[材质／VFX 作者链](../assets/materials.md)，也不替代[性能归因](../04-client-modules.md#压低卡顿与设备耗用)。以下操作与源码以 Unity 6.3／URP 17.3 为研究基线，UE 只作方案对照；未运行原生样例，画面、设备性能与烘焙耗时仍待实际工程验证。

## 1. 先选够用的照明路线，不把“全实时”当质量目标

| 场景与制作需求 | 默认；何时升级 | 保留的成本与限制 |
|---|---|---|
| 固定布局、少量移动角色，已有可用烘焙 | ✅ 静态环境沿 lightmap，移动物体沿项目探针；关键直接灯／阴影按玩法实时 | 检查角色进入明暗区域时是否像在同一空间；改布局／灯光要更新对应烘焙 |
| Unity 6 URP，探针手放负担大、长物体或相邻模型明暗不连续 | 🧪 APV 自动布探针，比较间接光一致性与制作周转 | 它仍是烘焙间接光，不能任意手挪单颗探针；密度、漏光、内存与数据加载要验 |
| 布局／灯光持续大幅变化，静态烘焙无法表达 | 先收窄需要真实变化的区域、用已有实时直接光；确需动态 GI 才评估项目已支持的方案 | 关闭灯、拆墙不会自动改写旧烘焙；不能用更多 Bloom 冒充间接光变化 |
| 已有 HDRP／UE 高端项目 | 保已有管线，核动态 GI、反射和设备降档；UE 可比较已有 Lumen 路线 | Lumen GI 与 APV 不是等价 API；启用 Lumen GI 时预计算静态光照贡献被禁用，不能假定旧 lightmap 原样叠加 |

**第一版的质量目标是“看懂并相信这个空间”。** 角色走进门洞后受光与墙面协调，脚能看出落地位置；敌人、出口与危险范围不会被逆光、暗角、发光雾或自动变化的曝光吞没。平静观景和战斗混乱各留一个镜头，别只交最漂亮的静态角度。低档允许阴影更粗、反射更简单，但不允许关键敌人消失。

**独立作品参照：Bleak Sword DX 保住复古画面性格，再利用 PC／Switch 的余量增加润色。** 作者在官方案例中介绍 Bloom、屏幕形变、VHS 与景深等效果，重点是保原风格而非把效果开齐；这里借“按目标平台增强、保可辨识的原画面”这一取舍，不把其迁移耗时当其他项目承诺。

**现成参照先看配置，不整包搬资产。** 官方 URP 3D Sample 的室内／室外场景可用于理解光照组合；Package Samples 的 Reflection Probes、BlobShadow、SSAO 分别适合学一个明确接缝。Fantasy Kingdom 展示较高风格化画面与移动端取舍，但其官方 demo／资产为教育与非商业许可，商用素材须另取相应商业许可；它不是免费商用资源库，也不是任意手机都能承受的预算。

依据与核实（2026-10-26）：[Bleak Sword DX 作者案例](https://unity.com/resources/more8bit)（2025-07-17）、[官方 Unity 6 图形资源](https://unity.com/blog/unity-6-graphics-learning-resources)、[Fantasy Kingdom 条款与设备定位](https://unity.com/demos/fantasy-kingdom)、[APV 特性](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/probevolumes/concept)、[Epic Lumen 官方说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine)。路线推荐为研究判断，不是同场景实测排名。

## 2. 调整顺序：先空间，再装饰

```mermaid
flowchart LR
  A[锁实际相机与两档目标设备] --> B[主光和直接阴影]
  B --> C[静态环境与角色的间接光]
  C --> D[局部反射和材质响应]
  D --> E[后处理统一画面]
  E --> F[移动战斗与独立构建验收]
  F --> G[一次只改一个主要差距]
  G --> B
```

先保一份现有场景基线，使用实际游戏相机、角色高度、可走路线和 UI；不要靠 Scene View 自由镜头决定灯光质量。关闭非必要装饰效果以看清问题，但保留项目已有的基础色彩输出约定。以下每一步先改一类职责，再与基线比较。

### 主光与阴影：把预算给玩家行动的区域

1. **确定主方向和视觉层次。** 室外先用主方向光与环境照明，室内再加真正需要的局部灯。让出口、角色轮廓与可走地面可辨；靠灯光层次引导，不给每个物件都加轮廓灯。
2. **先调阴影覆盖，再抬分辨率。** 在实际相机距离下检查脚边、台阶与掩体阴影。URP 主光 Shadow Max Distance 越大，同一 shadow map 的像素密度越低；先覆盖玩家需要判断的区域，再调级联和分辨率。远景装饰不必拥有与近战区相同精度。
3. **偏移与漏光先查原因。** 阴影痤疮、悬浮、薄墙漏光分别看模型尺度／厚度、法线、bias 与覆盖；不要用一个极大 bias 同时“修”所有问题。局部点光／聚光阴影共享图集，新增带阴影灯不是零成本，先保有玩法价值的灯。
4. **降档仍保落地信息。** 如风格允许，可比较官方 BlobShadow 的简化投影辅助角色定位；它不是完整真实阴影，不能承担墙后遮蔽或玩法可见性判定。

依据与核实（2026-10-26）：[URP 阴影分辨率与距离](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/shadow-resolution-urp.html)、[官方 Package Samples](https://docs.unity.com/en-us/engine/6000.3/manual/render-pipelines/universal-render-pipeline/introduction/installing-and-configuring-urp/creating-a-urp-project/package-sample-urp-package-samples)。调节顺序为研究建议；未给通用毫秒或分辨率预算。

### HDRI 与主光：先分清哪些光应被遮挡

**🧪 环境填光使投影变淡时，先查日盘是否同时贡献无阴影填光和直接日照，再试天空／太阳分离。** 先回读材质是否真的接收环境光、阴影覆盖／bias／地面接收和雾的相机深度；若 HDRI 日盘经环境采样成为无对应遮挡的填光，同时又有实时方向光，继续抬曝光会拉平接地。此时保原 HDR 与许可，用可复现的处理生成天空填光，让直接太阳由能投影的主光承担。不是所有 HDRI 都应删太阳；已有正确遮挡或不同反射需求时，要按实际消费者另核。

**Three 网页候选说明了技术职责，也暴露了品质失败。** MOBA 保原 CC0 HDR，按[固定配方](https://github.com/dbvv1/MOBA-Like/blob/069b74bc410eec318a1effb0a05a7acc619b5bcc/assets/lighting/README.md)在加载后、PMREM 前识别上半球日盘，用邻域天空替换并羽化；太阳改由单一方向光负责，接触 AO 不加重，近战区不进远雾。软件实帧曾获接地／体积的小幅改善判断，但同批 GPU 非作者盲评选了改前候选：改后塔身更暗、黑硬投影损害可读性，因此不采用 `069b74b`，下一轮换手段，不在这套灯光上继续调参。这个接入经验不等于 Unity APV／URP 实测。

[当前 GPU 对照与差距](https://github.com/dbvv1/MOBA-Like/blob/38f36d149a409bb7be0d7ff4323326e34759851c/docs/quality.md)采用同相机、同状态的 `baecaf5`／`069b74b` 原始帧；两版均未进入 MOBA 的 `main`／Site，改前只是上一候选链。旧软件帧状态不同，跨环境差异原因未明；原拍摄重复性仍失败。整层接入相对改前的 draw calls 为 296→455、提交三角形为 90,968→155,269，主要增加 AO 法线／深度 pass；不是帧时间或 GPU 性能结论。CPU 辐射积分只用来定位填光来源，不能代替真实画面对照。

依据与核实（2026-10-27）：[HDRI 工作流作者的太阳分离方案](https://seblagarde.wordpress.com/2016/08/28/siggraph-2016-an-artist-friendly-workflow-for-panoramic-hdri/)（2016，机制参考）、[Poly Haven 作者的 HDRI 制作说明与实时日盘讨论](https://blog.polyhaven.com/how-to-create-high-quality-hdri/)、[Three PMREM](https://threejs.org/docs/pages/PMREMGenerator.html)、[GTAOPass](https://threejs.org/docs/pages/GTAOPass.html)。MOBA 已有云端软件 WebGL 观察与 NVIDIA RTX 5070 同批静态盲评；本次结论只取 GPU 内部对照。

### 间接光：移动角色不能成为环境里的另一张贴图

**先决定谁贡献烘焙、谁接收什么，再按问题增加精度。** 固定墙地可贡献 GI；移动角色从探针获得间接光，关键直接光和动态阴影另由实时路径提供。不要把所有对象一键设为静态来获得“更亮”的画面，也不要混淆材质发光、屏幕 Bloom 与实际照亮旁边物体。

若沿已有 lightmap／Light Probe Groups，先走一遍室外、门洞、房间深处，检查动态角色的亮度／色调、墙地接缝和反射。选择 APV 时，在现有兼容工程按官方工作流接一小间房：

1. 在当前 Quality 档实际引用的 URP Asset 中选择 APV；核 Graphics 默认资产和质量覆盖，不改一个未使用的资产。
2. 添加覆盖测试空间的 Adaptive Probe Volume；固定环境按需要启用 Contribute Global Illumination，选择哪些 Renderer 接收 Light Probes、哪些继续用 lightmap。APV 不要求无差别把全场都换成探针。
3. 需要贡献烘焙的灯设为 Mixed／Baked，开启 Baked GI，在 Lighting 窗口烘焙探针；多场景一起使用时按实际加载组合组织 Baking Set。
4. 用 Rendering Debugger 看探针覆盖与采样，再让真实角色移动。漏光／暗斑先查几何与接收路径、覆盖与有效探针，再局部调整密度／Adjustment Volume；不先把全场密度拉满。

APV 自动布点和每像素采样能减少手工布点及相邻对象的不一致，但不保证门洞两侧天然分离。社区一次 URP 6.2 样例问题由作者逐项检查后归因于部分 Renderer 仍用 lightmap、部分用 probes；这是设置检查的有效线索，不说明混用本身必错，更不能把多选 Inspector 显示当全部对象已改成功。AI 应逐对象回读关键字段。

依据与核实（2026-10-26）：[APV 配置与烘焙](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/probevolumes/use)、[特性／Baking Set／限制](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/probevolumes/concept)、[实际用户原帖](https://discussions.unity.com/t/adaptive-probe-volumes-broken-with-urp-sample/1682709)。用户自述未在本仓复现。

### 反射：让金属相信它在室内，而不是加更多灯

**间接漫反射与反射探针分开接。** APV 不替代金属／光滑表面的环境反射。用官方 `URP Package Samples/Lighting/Reflection Probes` 理解探针范围、混合和 Box Projection；在自己的房间把探针覆盖与空间边界对齐，检查角色／物体过门时是否突然变成室外天空倒影。Box Projection 是局部近似，不把 cubemap 变成精确镜面。

静态房间先用烘焙反射，只有玩法变化确实需要才比较按事件更新的实时反射；不默认所有探针每帧重绘。关灯后若仍像开灯，分别查直接灯、发光材质、间接光数据与反射内容，不能只补一层黑色后处理。

依据与核实（2026-10-26）：[URP 反射探针](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/reflection-probes/introduction)、[Package Samples](https://docs.unity.com/en-us/engine/6000.3/manual/render-pipelines/universal-render-pipeline/introduction/installing-and-configuring-urp/creating-a-urp-project/package-sample-urp-package-samples)。固定源码与样例设置见[研究](../../../docs/research/2026-10-26-scene-rendering-and-lighting.md)。

### 后处理：统一气氛，不掩盖没接好的光

**先保持角色、地面和 UI 可辨，再调 tonemapping／颜色、少量 Bloom，最后决定是否需要景深、运动模糊和暗角。** 战斗信息在转身、冲刺或亮暗交界变糊，就降低或移除相应效果，而不是只截静止画面。保玩家已选的效果设置；不是每种风格都需要全套“电影感”。

URP 用自带 Volume 路线：相机开启 Post Processing，Volume 绑定 Profile，加入效果并启用要控制的参数 override；相机 Volume Mask 必须包含 Volume 所在层。先用 Global Volume 建一致底色，再用确有需求的 Local Volume 做区域过渡，检查进入／离开速度与混合，而非为每个房间另复制一套相机。

程序运行时调本次 Volume 的 `profile`，不要误改供多个场景共享的 `sharedProfile` 资产；固定 Core 源码中 `profile` 首次访问会克隆 Profile 及组件。编辑器作者修改与运行时临时变化要分清；给了自己创建的 Profile，就负责其生命周期。参数值写入还要核 override 状态，别因“值已改变”便断言画面已采用。

依据与核实（2026-10-26）：[URP 后处理接入](https://docs.unity.com/en-us/engine/6000.3/manual/post-processing-and-full-screen-effects/urp/add-post-processing)、固定 [Volume.cs](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.core/Runtime/Volume/Volume.cs)。画面取舍为研究建议。

## 3. 二改：关闭房间灯，再增加低配档

**关灯是一个场景状态，不是单个 API 调用。** 沿原交互事件统一更新这一组直接灯、发光外观和必要的间接光／反射表示；门、敌人和 HUD 仍沿原玩法逻辑。先确定产品允许哪种近似：很小的装饰灯可接受间接光不变；大面积灯灭会改变读图时，才投入第二套烘焙或项目已有动态 GI。

已有 APV 的场景可比较两个 Lighting Scenario。开灯、关灯分别烘焙；启用相应 Scenarios／Blending 支持，用 `ProbeReferenceVolume.lightingScenario` 或 `BlendLightingScenario` 接原事件。**它只切换探针间接光，不会自动开关直接灯、改发光材质或更新反射探针。**受影响的墙地若仍接收 lightmap，会继续使用原 lightmap 的亮度：需要同步变化就沿项目已有方案准备／切换对应 lightmap 数据，或仅把这个需要变化区域的接收者改为 APV 并重新烘焙；不能把 Scenario 称为全场烘焙切换，也不要求全场改用 APV。 混合还要求两套数据的探针数量与位置一致；改静态布局后要按官方固定探针位置流程重烘焙，不把“能传混合系数”当整套场景已兼容。

**两档保玩法可读性，装饰逐项退。** 先保同一主光方向、目标／危险对比和基础色调，再按测得热点降低：远处阴影距离或装饰灯阴影、反射更新频率与规格、SSAO／Bloom 等额外效果、渲染比例。APV 数据／采样设置及实际内存也要计入；不能低档突然改到没有所需烘焙数据的照明路径。每次只降一类，跑同一移动路线，观察代价与收益。

配置应回到既有 Quality、URP Asset、Renderer、Volume Profile 和场景资产；AI 不新建通用画质框架。切换前先核哪个档实际生效，独立构建检查 shader／render pass 和烘焙数据是否包含。官方 Package Samples 自己也要求把对应 URP Asset 纳入构建设置，不能凭 Editor 正常推断 Player 一致。

依据与核实（2026-10-26）：[Lighting Scenarios 正常接入与探针位置](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/probevolumes/probe-volumes-change-lighting-at-runtime/bakedifferentlightingsetups)、[官方样例构建要求](https://docs.unity.com/en-us/engine/6000.3/manual/render-pipelines/universal-render-pipeline/introduction/installing-and-configuring-urp/creating-a-urp-project/package-sample-urp-package-samples)。

## 4. 给 AI 的实施起点与验收

交给 AI：固定 Editor／包版本、当前 Graphics 与 Quality 实际引用、游戏相机、测试场景、角色和两档目标设备；附明亮室外／门洞／室内战斗的质量参照与一个主要差距。**让它先回读实际设置，按上面的顺序只改有关资产，经项目已有 Editor 接口保存并回读；不要手工猜 YAML／GUID，也不要为这个任务安装一套新渲染框架。** 工具入口沿 [01](01-toolchain.md)，不会操作编辑器时仍可给实施补丁和待运行步骤，但不能报告画面通过。

| 要证明什么 | 实际检查；典型 AI 错误 |
|---|---|
| 第一版空间成立 | 同相机走室外→门洞→室内，角色、墙地、金属一起看；只抬曝光掩盖错探针／反射 |
| 移动中读得懂 | 转身、攻击、亮暗交界与远近目标；用静态 screenshot 掩盖模糊／高光淹没 |
| 二改确实关灯 | 直接光、发光外观、间接光、反射分别检查；只调 Scenario 或只关 Light |
| 作者改动进入实际画面 | 改一个灯／Renderer 接收设置，重烘焙后回读，并在 Player 复核；改错 Quality 资产、漏 override／层掩码 |
| 低档不改玩法 | 两档同路线、同敌人状态与镜头比较；低档省掉的阴影／提示使目标不可判读 |
| 成本可接受 | 用目标设备 Profiler、Frame Debugger／Rendering Debugger 分层定位，记首次／持续运行、内存与烘焙周转；套用他人的演示帧率或通用毫秒数 |

AI 可以承担批量配置、引用检查、烘焙任务接线、开关灯状态和对照捕获；人判断空间层次、舒适度和战斗读图。最终接收以实际工程的画面与目标设备观测为准。
