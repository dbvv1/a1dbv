---
name: game-quality-pass
description: 把一个可玩游戏片段的画面、声音、手感与界面按整场景推向品类标杆的质量单元做法。用于作品“离标杆远”、要定近期目标、要决定下一轮改什么、要判断一次改动是否真的更好时。网页 Three.js 写了具体手段，Unity／Unreal／Godot 给出对应物。
argument-hint: "[作品名] [近期目标，如：出生地到首塔的连续战场]"
---

# 画面与手感的质量单元

目标：$ARGUMENTS

什么算达标见 [references/quality-bar.md](references/quality-bar.md)（画面、手感、内容三条达标线与记分卡），手感的管线、运动模型与标杆数值见 [references/feel.md](references/feel.md)。

一个质量单元＝固定机位看清现状 → 查同品类与专业流程怎么解决 → 做目标效果图 → 改一整层 → 同机位对比 → 非作者判定确实更好 → 发布并更新网站。**每个单元只改一层（见第 3 步），控制在 2 小时内**；层的顺序按差距大小排，画面上没有环境光照和后处理的作品先做灯光层，它成本最低、整屏变化最大。

## 1. 先有可靠的看图手段

**截图和录像必须是同机位、同状态、可重复的；做不到就先修看图手段，不改画面。**

- 拍摄模式：注入虚拟时钟，按种子开局，用固定 dt 反复调用主循环推进到指定时刻，摆到命名机位，渲染几帧预热（让 TAA、自适应曝光、阴影收敛）后截一帧。拍摄不依赖帧率和真实时间，软件渲染慢也能出图。主循环直接吃真实 dt 的作品同样适用，只要 dt 从虚拟时钟取。网页契约和脚本见 [references/capture.md](references/capture.md)；Unity 用 `Time.captureFramerate` 固定每帧时间，Unreal 用固定帧率启动参数（`-benchmark -fps=60`）或 Movie Render Queue，Godot 用 `--fixed-fps` 配合 `--write-movie`。
- 每个作品固定 3–4 个命名机位，对应参照里最有代表性的画面：正常游玩视角至少一个，另加一个“最大差距”视角。机位从参照图量出来（主角占屏高、地平线位置、视场角），不凭感觉摆。
- 手感看录像（即“操控证据”，测法见 [references/feel.md](references/feel.md) §5）：游戏内回放同一段输入脚本，按固定 dt 逐帧渲染成序列，ffmpeg 合成 60 fps。数“输入到第一处可见反馈”的帧数、反馈幅度和持续时间，与参照录像的同一动作逐帧对照。声音同段录下，听反馈是否和画面同帧到达。
- 每轮拍摄写进新建的独占目录，同时记下源码版本、机位、输入和渲染器原始字符串；渲染器分为 gpu／software／unknown，只有认得出硬件厂商的才算 gpu。软件渲染能出图，适合查构图和回归；定光照和材质以 gpu 结果为准。云端没有真 GPU 时，交有 GPU 的机器用 headless 浏览器拍：无可见窗口、不模拟键鼠、不操作桌面，同一时间只跑一个 GPU 任务（a1dbv 里见游戏方向细则§7）。

## 2. 改之前先查别人怎么解决

**每个差距先回答“同品类的强作品和专业美术流程怎么解决它”，读到具体手段再动手。**

- 先读品类要点：[references/genre-targets.md](references/genre-targets.md)（MOBA／公路竞速／战术 FPS 的画面语法、机位量法）。其他品类照同样结构先写一节。
- 再按差距查：开发者原文（GDC、官方开发博客、美术师的作品拆解）、同品类开源或网页高质量作品、引擎官方示例场景。专业环境美术的顺序是：美术方向（一页风格说明）→ 体块与比例 → **先打光** → 模块化套件与材质族 → 布景密度 → 后处理与调色 → 优化。画面差距多出在前三步，细节和后处理补不上。
- 目标效果图（paint-over）：把当前机位截图交给能保持构图的图像编辑模型，要求“保持构图、地形和玩法布局不变，按 <品类> 的美术方向重绘”，出 2–3 张，选一张做目标。从目标图提炼一页“目标说明”：5–7 个主色及明度、明暗结构（眯眼看能分几块）、材质族、光的方向和冷暖、各区域道具密度、角色轮廓规则。目标图只当方向，不进游戏。

## 3. 改一整层，让整个场景同时变

**一次改一整层；不做单件道具或单个参数的像素级微调。**

1. **灯光、雾与色调**：先核实际材质的直接／间接受光路径，再选光源和遮蔽；不把 HDRI＋AO 当通用起点。一盏主光（大场景用级联阴影）建立明暗结构，雾色与天空同色系做空气透视，色调映射选定后固定，再用 LUT 调色。
  - 网页 Three.js：`MeshStandardMaterial`／`MeshPhysicalMaterial` 可用 `scene.environment`＋PMREM 处理的 CC0 HDRI（如 Poly Haven）。原生 `MeshToonMaterial` 不接这条环境光路径，先用主光和 `AmbientLight`／`HemisphereLight` 调明暗；方向光阴影先衰减直接光，Toon ramp 不能提亮完全被阴影压零的直接光，暗部需从独立间接光路径处理。混合材质场景分别核对，不为让 HDRI 生效就整体换掉 Toon。
  - 接触与缝隙层次不足时再选 AO，并检查角色轮廓与地表是否被压黑。材质 `aoMap` 调制间接光，不补光；N8AO 是另一条屏幕空间后处理路径，须实际接入并验图。色调映射可选 ACES 或 AgX；用 pmndrs/postprocessing 时渲染器设 `NoToneMapping`、帧缓冲 `HalfFloatType`、`ToneMappingEffect` 放链末，用 three 自带 `EffectComposer` 时由链末 `OutputPass` 读渲染器的色调映射。
  - Unity URP／HDRP：按材质与渲染路径选 Volume（Tonemapping、Color Lookup、SSAO）、反射探针与 Light Probe；Unreal：Lumen＋Post Process Volume；Godot：WorldEnvironment（Tonemap、SSAO、SDFGI 或 VoxelGI）。

  **材质边界依据**：Three 0.186.1 固定源码的[环境接入](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/webgl/WebGLPrograms.js#L56-L64)、[直接阴影与间接光](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/lights_fragment_begin.glsl.js#L181-L244)、[Toon 合光](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/lights_toon_pars_fragment.glsl.js#L10-L25)与 [aoMap](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/aomap_fragment.glsl.js)。原核实 2026-10-27，2026-10-28 与已安装同版源码逐字节复核；这是受光路径核对，视觉收益仍按第 4 步用 gpu 同机位对比和非作者盲判验收。
2. **空间层次**：近、中、远三层各有连续剪影；视线落点放地标；围合空间的墙、崖、建筑用同一网格的模块化套件拼，交接处有收边，不出现巨型素面方块。
3. **地表与材质族**：地表混 3–4 种可平铺材质（splat 或顶点色、地形图层），加磨损贴花，打破平涂；墙面和道具用 trim 材质，同一材质族共享粗糙度与色相范围。
4. **角色与可读性**：角色比环境饱和、对比更高；轮廓靠形状区分（武器、体型、剪影），不只靠颜色；必要时用边缘光或描边。
5. **布景密度**：按目标说明撒道具和植被（网页 `InstancedMesh`，引擎用地形散布或 GPU 实例化）。
6. **反馈与声音**：每个关键动作（开始、命中、结果）都有画面、声音、镜头三路反馈且同帧到达；先补缺失的环，再调幅度。混音分层（玩家动作 > 威胁 > 环境），重要声音出现时压低环境（侧链），有方向和距离衰减。
7. **界面**：信息层级与游玩净空优先，主要数字字号和对比足够，次要信息收进次级层；不缩字挤控件。

层里缺的角色、场景件、动作和声音按 [game-content-production](../game-content-production/SKILL.md) 成套取得，不在质量单元里逐件补。

## 4. 同机位对比，非作者判定

- 同一命名机位拼三联图：改前 ｜ 改后 ｜ 参照（或目标效果图）。缩到 320 像素宽还看得出差别，才算大差距有进展。商业游戏参照图只在本地用；公开的 `docs/quality.md` 放改前、改后和自己做的目标效果图，参照只给链接。
- 交给没参与这次改动的审查者（新上下文的子代理或另一会话），只给三联图和一句品类说明，不给代码和提交说明。先问“玩家第一眼、第一分钟最大的三处差距”，再盲选改前／改后哪张更接近参照（左右顺序随机）。
- 发布分两步：功能门槛（测试、smoke）通过的候选当轮就以旁置的试玩入口合入默认分支并更新网站，默认入口不变，候选不留在分支上。换默认要有证据再经非作者盲判更好：画面类（光照、材质、特效、内容）用 gpu 拍摄的同机位对比，手感类用第 1 步的操控证据，其余只需盲判。换默认后 `docs/quality.md` 换成新图和新的三处差距；判定不更好的候选从旁置入口撤下，回到第 2 步换手段，不在同一手段上继续调参。
- 下一个单元从审查者给出的第一处差距开始；大差距没补上之前不做细节打磨。

## 5. 写回知识

被采用的手段（参数、提示词、套件来源、成本、失败与修法）在同一单元写回对应的模块页或制作链页，附提交链接；只在本作品有效、换品类不成立的，留在作品 `docs/`。

**依据**：[Riot《Updating Summoner's Rift》](https://www.surrenderat20.net/2014/06/update-to-summoners-rift-headed-to-pbe.html)（2014，视觉层级与明度控制）；[pmndrs/postprocessing README](https://github.com/pmndrs/postprocessing)（色调映射与缓冲精度）；[Radiator Blog 体块指南](https://www.blog.radiator.debacle.us/2017/09/how-to-graybox-blockout-3d-video-game.html)与 [Neil Blevins 的 greybox paint-over](http://www.neilblevins.com/art_lessons/greybox/greybox.htm)；[2026 年图像编辑模型实测](https://fuser.studio/articles/best-ai-image-editing-models)（保持构图与改风格的取舍）；本仓三个网页案例 2026-10-27 的试玩、截图与源码（都没有环境光照与后处理）。核实 2026-10-27。
