# 09 Web 渲染方案与资产解耦

> 更新：2026-11-26  
> 回答两个核心问题：**① 为什么网页 3D 游戏反复“越改越灰或沦为缝合怪”？② 3D 美术／动作如何与 Web 运行时解耦，并按画质目标选对 2026 Web 渲染管线？**

## 1. 30 秒结论：网页画质弱，先查资产断代、光照标定与评估门禁

**桌面 Web 运行时早已不是不能跑高面数的瓶底；画质长期原地打转甚至负优化，多数出在“2005 旧资产硬拼代码方块＋色调映射失调＋拿 FPS 当画质”。** 第 9 批《雪线回波》在桌面 RTX 5070 上用 WebGL2 跑出 `5,783,263` 三角面、`1,881` calls 与 `100.2 FPS`（[第 9 批负优化复盘](../../docs/collaboration/demo-trial-20261117.md#ninth-batch-snowline-aaa)），帧耗裕度充足，但同机位画面仍被真人判定显著劣于旧基线——根源是把高面数与开启 `N8AO`/`CSM`/`AgX` 等名词误当成画面提升，未阻断 **P5 暗部抬灰（`18.31 → 49.92`）、2005 低模与旧方块混排“缝合怪”、空手动捕硬套 IK** 等直观视觉退步。[本端实测]

---

## 2. 2026 主流高画质 Web 3D 渲染方案横评

**按原生照明／抗锯齿能力、3D 资产适配与生态成熟度选型，不为某个热门模型或单一示例换整栈。** 下表外部框架特性核自 2026 年一手官方文档与源码，**尚未在本仓同一可玩关卡下作同场景性能与画质基准对比**，采用前须先跑同机位 1–2 镜 A/B 验证。[一手文档／源码研究]

| 渲染方案 | 评级 | 关键渲染与画质能力 | 适合的 3D 游戏形态 | 采用条件与硬边界 |
|---|---|---|---|---|
| **Three.js `r187+` `WebGPURenderer` + TSL** | 🧪 试用 | 原生 MRT 多目标、节点式 `SSGINode`（屏幕空间 GI）、`GTAONode`（带时域滤波）、`TRAANode`（速度缓冲时域抗锯齿）、Bloom/SSR/SSS，自动输出 WGSL 并在不支持设备回退 WebGL2（[WebGPURenderer 手册](https://threejs.org/manual/pages/webgpurenderer)、[后处理文档](https://threejs.org/manual/pages/webgpu-postprocessing.html)、[r187 SSGI 示例](https://raw.githubusercontent.com/mrdoob/three.js/r187/examples/webgpu_postprocessing_ssgi.html)、[GTAO+TRAA 示例](https://github.com/mrdoob/three.js/blob/9813ee76/examples/webgpu_postprocessing_ao.html)） | 现有 Three.js 写实或高质感 PBR 游戏平滑升级，需保留自定义材质/角色管线与可控包体 | 需重构旧 `EffectComposer` 为 TSL `RenderPipeline` 节点链；物理/UI/音频仍需自接；`WebGPU` 需桌面现代浏览器 |
| **Babylon.js `9.0`（2026-03）** | 🧪 试用 | 8.0 起核心着色器原生双写 GLSL+WGSL（免去 >3 MB GLSL→WGSL 转译库）；9.0 **Frame Graph v1.0**（DAG 显存复用）、**Clustered Lighting**、带纹理发射的 **Area Lights**、WebGPU 计算着色器 **Volumetric Lighting**、Adobe 贡献 **Dynamic IBL Shadows** 及内置 Havok 物理与 Inspector（[9.0 官宣](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0)、[9.0 特性全览](https://babylonjs.medium.com/welcome-to-babylon-js-9-0-c3edc9ee6428)、[8.0 WGSL 说明](https://blogs.windows.com/windowsdeveloper/2025/03/27/announcing-babylon-js-8-0)） | 需要成套开箱即用引擎能力（体光、区域光、多盏动态灯光、Havok 物理、在线检查器）的中大型 3D 网页作品 | `IBL Shadows` 体素追踪目前**主要适用于静态投射体**，高频变形蒙皮角色实时重体素化开销高（[IBL Shadows 文档](https://aka.ms/babylon9IBLSDoc)） |
| **PlayCanvas `v2.19+`（MIT）** | 🧪 试用 | WebGL2 + WebGPU 双后端、簇状照明，WebGPU 计算着色器 GPU 基数排序的 **3D Gaussian Splatting（3DGS）** 与分段流式加载 **Streamed SOG** LOD 管线（[PlayCanvas Engine](https://github.com/playcanvas/engine)、[v2.19 WebGPU+SOG 博文](https://github.com/playcanvas/blog/blob/main/blog/2026-06-03-new-in-supersplat-webgpu-and-streaming-bring-huge-performance-wins.md)、[GSplat 渲染器文档](https://developer.playcanvas.com/user-manual/gaussian-splatting/rendering-architecture/renderers)） | 实景扫描/重建背景＋低多边形碰撞代理网格＋前场少数高精度可动角色/载具的混合路线 | 3DGS 背景难做任意破坏或动态全局打光；云端编辑器强耦合其工作流，纯本地代码可控度弱于 Three/Babylon |
| **裸 WebGPU + WGSL（无引擎）** | 👀 评估 | 零外部框架包体、直接用 Compute Shader 在 GPU 现成生成海量实例植被/粒子与体积雾散射（如 [Abyssal Garden](https://github.com/Noniv/abyssal-garden) 97 KB 单 HTML 生成水下体积光与约两百万摇曳海藻）[一手／研究] | **纯程序地貌、体积光雾、水下/流体物理等氛围展示与单主题原型** | 缺原生 glTF 蒙皮骨骼混合、物理碰撞与资产热替换；**不适合多角色持枪、UI 重度交互的写实战术游戏** |
| **WebGL2 定制 MRT 风格化／标定 PBR** | ✅ 采用 | 广兼容回退底座。风格化可走 MRT（Color + Depth + ObjectID + Normal）+ 仅背景 Kuwahara 笔触 + 选择性描边（如 [Blackout](https://github.com/anstapnever/blackout)）；写实 PBR 则配 2K HDRI、分级 CSM、半分辨率 AO 与**经校准的色调映射**（[世界光照与玩法提示](04-client-modules.md#世界光照与玩法提示后处理只改世界不把提示一起压暗)、[HDR＋N8AO＋CSM＋AgX 后处理栈](assets/materials.md#n8ao-csm-agx-stack)） | 全浏览器兼容发布、固定美术语法的风格化作品、或作为 WebGPU 不可用时的保底管线 | 原生缺乏动态漫反射 GI 与真体积散射；**不能盲目开启多层后处理**，每换一项色调映射或 AO 必须过同机位黑电平与对比度门禁 |

> 注：**Google Filament（WASM）** 适合将既有 C++ 高严密 PBR 管线移植到 Web，但其自身只是纯渲染器而非游戏引擎，且工具链贴近 C++/CMake，单人 Web 原型通常优先选前三者。

---

## 3. 拆解“Fable 5.2 类网页 3D 作品质感好”的真实机制与天花板

社区常见基于 `Claude Fable 5.2` 的高口碑网页 3D 作品，质感优势**不是模型靠单一提示词“自动变 3A”**，而是踩中了三条可复用结构条件（[03 节 2026 公开实战参照](03-generative-ai-in-games.md) 已收多例源码）：

1. **视觉语法与技术载体匹配（不硬套写实人枪短板）**：例如 *Abyssal Garden* 专攻水下体积吸收与 GPU 实例海藻（[GitHub](https://github.com/Noniv/abyssal-garden)），*Blackout* 用 WebGL2 MRT 管线把 3D 网格专职转为动画赛璐珞＋背景油画笔触（[GitHub](https://github.com/anstapnever/blackout)），避开了“代码造写实人形与枪手”的纯程序软肋。
2. **整场风格零拼凑**：要么全程序化视觉语言一致，要么全套模块化资产＋统一材质族，**绝不出现“2005 低模人＋摄影测量岩石＋代码灰盒建筑”三代混排的缝合怪**。
3. **强制“上下文隔离＋多机位图”视觉批评闭环**：例如社区用 Fable 5.2 复刻 *Abyssal Garden* 提示词结构制作可驾驶车辆与赛道（[Reddit 原帖实录](https://reddit.com/r/ClaudeAI/s/fHqt8s59wU)）时，每轮交付 **6 个固定机位截图＋8 帧连续动态采样＋参考实拍图** 给完全不看源码与推导的 Critic 代理分级挑错（Major/Medium/Minor），仅当无 Major 缺陷才允许停。

**硬边界反例同样清晰**：同一条 Fable 5.2 ＋ 裸 WebGPU ＋ 8 轮严厉 Critic 闭环（历时 `7 小时 12 分钟`、约 `$348` API 成本）做一辆大众熟知的真实车辆，到第 8 轮仍剩 **4 项 Major 形体缺陷**（[同帖复盘](https://reddit.com/r/ClaudeAI/s/fHqt8s59wU)）。证明当题材落到**真实人形、武器与载具近景写实**时，光靠代码与渲染管线无法绕过专业 3D 资产与专用动作供给。[一手文档／源码研究]

---

## 4. 架构原则：3D 美术／动作资产与 Web 运行时彻底解耦

**角色脸面与装备精不精细、枪械好不好看、持枪动画协调不协调，100% 属于资产与动画生产层问题，与 WebGL2/WebGPU 运行时无关。** 一旦建立跨引擎 `glTF 2.0` 资产合同，同一套高精角色、武器、1P 手臂、持枪动捕与模块建筑可在 Three.js、Babylon.js 或 PlayCanvas 间无缝复用：

```mermaid
flowchart LR
  A["1. 上游现代资产与动作生产<br/>现代 PBR 角色/枪械/模块建筑<br/>(生成式 3D+Blender 重拓 / 合规扫描库)<br/>＋ 专用持枪战术动捕"] --> B["2. 引擎无关交付合同<br/>glTF 2.0 GLB（米制 Y-up）<br/>EXT_meshopt_compression + 量化<br/>KTX2 (BasisU) 纹理＋材质复用"]
  B --> C["3. 可替换 Web 渲染底座<br/>Three WebGPU/TSL<br/>或 Babylon 9 / PlayCanvas"]
  C --> D["4. 四道视觉反负优化门禁<br/>锁同机位 → 像素预筛 →<br/>双序盲评 → 非补偿否决"]
```

- **传输与显存规范**：面向 Web 传输和真机帧稳态，静态与骨骼动画网格优先 **`EXT_meshopt_compression` ＋ `KHR_mesh_quantization`**（解码器仅 ~32 KB，WASM SIMD 约 `1 GB/s` 级解码且同时压缩骨骼动画/变形目标；`Draco` 解码显著偏慢，仅保留给纯静态扫描件），贴图压成 **`KTX2`** 减显存（[glTF 资产规范](assets/3d.md#engine-agnostic-glb-contract)）。
- **禁止“半吊子换件”**：当主场景 80% 仍为程序方块壳时，切忌只塞入少量写实岩石和老旧人形；要么成组替换同风格现代套件（主角＋枪＋1P 手臂＋持枪动捕＋站房立面＋地形一次到位），要么先用同风格中景重塑打底。

---

<a id="tone-mapping-calibration"></a>

## 5. 色调映射与后处理防发灰校准红线

**色调映射只决定高光滚落与色域映射规则，绝不能“直接换上 `AgX` 就以为更电影感”。**[一手文档／本端实测]

| 色调映射路线 | 适用场景 | 典型误用与防发灰校准规则 |
|---|---|---|
| **`Khronos PBR Neutral`** | 需要精确还原贴图固有色、避免色相漂移与过饱和发灰的写实 PBR 资产展示（[Khronos 官方说明](https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products)） | 动态范围极宽的强逆光/霓虹爆炸场景高光过渡较陡，需配柔和光源衰减 |
| **`ACESFilmic`** | 强明暗反差、冷暖对撞强烈的硬朗战术／工业夜景与雪地日光场景 | 低饱和暗景易轻微压暗吃细节，禁止为此把环境底光硬抬到 `>0.4` |
| **`AgXToneMapping`** | 高亮度色彩保持自然不偏色的宽动态 HDR 管线 | **严禁配合高强度 `HemisphereLight`＋高 `envIntensity`＋大半径屏幕 AO 直接套用**，否则会把暗部阴影黑电平抬灰（如第 9 批实测 `P5: 18.31 → 49.92`、`RMS: 50.7 → 34.31`） |

**强制硬约束**：任何渲染后端、HDRI、AO 或 Tone Mapping 改动后，必须先运行 [`visual_pregate.py`](templates/.claude/skills/game-quality-pass/scripts/visual_pregate.py) 对照旧基线同机位核对暗部底线、对比度与饱和度，未通过前不进入下一步优化（完整门禁流程见 [02 视觉反负优化四道门](02-verification-and-playtesting.md#visual-anti-regression-gates)）。
