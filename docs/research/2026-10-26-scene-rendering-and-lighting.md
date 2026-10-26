# 场景渲染与光照：正常制作链的选择依据

核实：2026-10-26 UTC；对应 [Unity 07](../../domains/game-dev/unity/07-scene-rendering-and-lighting.md)。本轮补已有资产进入场景后的主光、阴影、间接光、反射、后处理与画质档，不重复 WP5 材质／VFX 生成或 WP10 性能归因。产出为完整实施研究；没有启动 Unity、烘焙、渲染截图或设备剖析。

## 默认为何不是全实时／全 APV

已有静态烘焙与探针能满足就保留；原生实时直接光负责需要即时变化的照明，是否升级间接光路径取决于实际变化与制作负担。APV 的自动布点、每像素采样、场景数据组织值得试，但它仍使用烘焙数据，无法据“自动”推导任意关灯、拆墙已正确。UE Lumen 只作已有工程对照，不据此迁移项目。

| 一手来源 | 支持的选择及边界 |
|---|---|
| [Unity 6 图形学习资源](https://unity.com/blog/unity-6-graphics-learning-resources)，2024-11-14 | 官方给出 URP 3D Sample、Fantasy Kingdom、Package／效果资源与生产案例入口；可找配置参照，不由 demo 宣传推导普通设备能达同样帧率 |
| [Bleak Sword DX 作者案例](https://unity.com/resources/more8bit)，2025-07-17 | 单人作品扩到 PC／Switch 时保复古性格、增画面润色，列出 Bloom／屏幕形变／VHS／景深等选择。为同厂案例中的作者自述，不采用其迁移速度和实验期缩短数字作本项目收益；本仓未运行作品 |
| [Fantasy Kingdom 官方项目页](https://unity.com/demos/fantasy-kingdom) | 项目／资产教育用途、Asset Store 非商业 EULA，商用素材需取得 Synty 原包相应许可；官方列推荐最低 iPhone 13／Samsung S22 同级，故不是所有低端手机的保底路线。本轮未下载受限素材 |
| Unity 6.3 [APV 概念](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/probevolumes/concept)与[配置](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/probevolumes/use) | 自动布点、每像素采样与流送支持；不能手动调整每颗探针位置。实际路径要核当前 Quality 的 URP Asset、灯光模式、贡献 GI、接收路径与 Baking Set。APV 是间接漫反射，不代替反射探针或实时直接光 |
| [Lighting Scenarios](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/probevolumes/probe-volumes-change-lighting-at-runtime/bakedifferentlightingsetups) | 运行切换只改变探针间接光，仍接收 lightmap 的静态表面不会随之换烘焙亮度；要变化须另接对应 lightmap 数据切换，或把需变化区域的接收者改为探针并重烘焙。直接灯、几何及其他视觉状态由项目处理。混合要求相同探针数／位置，可按官方 Don't Recalculate 流程固定布局；不据参数 API 的存在承诺任何两套烘焙能混合 |
| [URP 阴影分辨率](https://docs.unity3d.com/6000.3/Documentation/Manual/urp/shadow-resolution-urp.html) | Max Distance 增大摊薄同图精度，附加灯共享图集；支持先缩合理覆盖再抬规格，不支持统一阴影距离／分辨率建议 |
| [URP 反射探针](https://docs.unity.com/en-us/engine/6000.3/manual/lighting-overview/lighting/reflection-probes/introduction)、[后处理接入](https://docs.unity.com/en-us/engine/6000.3/manual/post-processing-and-full-screen-effects/urp/add-post-processing) | 反射区域／混合与间接光分工；后处理需相机开关、Volume Profile／override 和层掩码。正文按职责排查，不把统一颜色当修复底层光照 |
| [Epic Lumen GI／Reflections](https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine)，页面选择 5.8 | 动态 GI 与反射可分别配置；启用 Lumen GI 会隐藏／禁用预计算静态光照贡献。已有 UE 项目应按自己的动态需求与平台配置，不套 APV 工作流 |

## 固定公开源码：真实资产和运行入口，不是自造窗口

已取官方 Graphics `6000.3/staging` 固定 [`2d2e78cc9d6254bc6e7c9c5552cea053508e86cb`](https://github.com/Unity-Technologies/Graphics/tree/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb) 的以下文件。仅按文件取回，未克隆整个图形仓、未导入引擎。根 `LICENSE.md` 为 Unity Companion License；本轮只读，不复制代码或资产到知识库。

| 实际读过的文件 | 观察 |
|---|---|
| `Packages/com.unity.render-pipelines.universal/package.json` | URP `17.3.0`，Unity `6000.3`，Core／ShaderGraph 同 `17.3.0`；声明 `Samples~/URPPackageSamples` 与设置资产路径。这里是固定分支源码，不称当前每个发行版均同实现 |
| [ProbeReferenceVolume.cs](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.core/Runtime/Lighting/ProbeVolume/ProbeReferenceVolume.cs) | `lightingScenario` 与 `BlendLightingScenario` 将操作交给当前 Baking Set；未存在当前 Baking Set 时不会替项目创建烘焙数据。接口是探针数据通路，不负责开关场景 Light／材质 |
| [Volume.cs](https://github.com/Unity-Technologies/Graphics/blob/2d2e78cc9d6254bc6e7c9c5552cea053508e86cb/Packages/com.unity.render-pipelines.core/Runtime/Volume/Volume.cs) | `profile` 首次访问创建新 Profile，逐项克隆 sharedProfile 组件；sharedProfile 是共享资产，自己赋入的 Profile 须由使用者管理生命周期。不是每次读 profile 都克隆一次 |
| `Samples~/URPPackageSamples/SharedAssets/Settings/PackageSamplesURPAsset.asset` | 实际启用 ReflectionProbeBlending／BoxProjection，并有自身灯光、阴影配置；正文不把其具体数值复制成通用预算 |
| `Samples~/URPPackageSamples/SharedAssets/Settings/Global Volume Profile.asset` | 包含 Bloom、ColorAdjustments、Tonemapping 与 MotionBlur；参数有单独 `m_OverrideState`。说明可读现成 Profile 接线，不说明产品都应开这些效果 |
| `Samples~/URPPackageSamples/Lighting/Reflection Probes/Reflection Probes.unity` | 已取实际 LFS 内容并核对象哈希，而非只读 pointer；场景含多个不同 BlendDistance／BoxProjection 配置的探针及 Sphere。只读序列化结构，不声称看到了渲染结果 |

样例操作入口按[官方 Package Samples 文档](https://docs.unity.com/en-us/engine/6000.3/manual/render-pipelines/universal-render-pipeline/introduction/installing-and-configuring-urp/creating-a-urp-project/package-sample-urp-package-samples)：从包 Samples 导入需要的项；Reflection Probes 演示混合／Box Projection，BlobShadow 为低成本影子近似，SSAO 演示 Renderer Feature。构建时要包含对应 URP Asset，否则可能剥除需要的 shader／pass。应在隔离样例工程学习它的资产，不把样例资产直接设为用户工程全局默认。

## 社区反例怎样改变实施顺序

已读 [Unity Discussions 2025-09-09／10 原帖](https://discussions.unity.com/t/adaptive-probe-volumes-broken-with-urp-sample/1682709)：作者在 `6000.2.2f1` 用 URP 3D Sample 出现异常；回复者在 `6000.2.3f1` 未复现，另提天空盒旋转猜测；作者随后称部分 Renderer 批改未生效，逐项改接收设置后修复。**这里只采用作者最后的设置核查线索，不把先前猜测写成根因，也不声称 lightmap 与 probe 不能混用。**

正文据此要求先回读实际相机／Quality／Renderer 配置，再改亮度、探针密度和后处理。提升是否值得仍由目标场景观察决定；学习材料和社区自述不能代替本项目画面验证。

## 完整第一版与二改的实际接收问题

正常链：已有场景和角色穿过室外—门洞—室内，主光／阴影、间接光、反射和后处理按顺序调整。二改：关闭一组灯，分别处理直接光、发光外观、间接光和必要反射；再做低档，不降低玩家可判断信息。性能在真实目标设备沿既有剖析链检查，不新建只算公式的“渲染 benchmark”。

AI 负责配置、引用、烘焙调用和对照捕获，人的任务是层次／空间可信度／移动可读性判断。当前证据能支持实施起点与选型边界；同场景方案质量冠军、毫秒收益、烘焙效率与项目采用仍未知。
