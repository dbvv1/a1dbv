# 灯光层：材质与渲染路径

> 改灯光层时读取；单元流程与验收见 [Skill](../SKILL.md#3-改一整层让整个场景同时变)。

- 网页 Three.js：`MeshStandardMaterial`／`MeshPhysicalMaterial` 可用 `scene.environment`＋PMREM 处理的 CC0 HDRI（如 Poly Haven）。原生 `MeshToonMaterial` 不接这条环境光路径，先用主光和 `AmbientLight`／`HemisphereLight` 调明暗；方向光阴影先衰减直接光，Toon ramp 不能提亮完全被阴影压零的直接光，暗部需从独立间接光路径处理。混合材质场景分别核对，不为让 HDRI 生效就整体换掉 Toon。
- 接触与缝隙层次不足时再选 AO，并检查角色轮廓与地表是否被压黑。材质 `aoMap` 调制间接光，不补光；N8AO 是另一条屏幕空间后处理路径，须实际接入并验图。色调映射可选 ACES 或 AgX；用 pmndrs/postprocessing 时渲染器设 `NoToneMapping`、帧缓冲 `HalfFloatType`、`ToneMappingEffect` 放链末，用 three 自带 `EffectComposer` 时由链末 `OutputPass` 读渲染器的色调映射。
- Unity URP／HDRP：按材质与渲染路径选 Volume（Tonemapping、Color Lookup、SSAO）、反射探针与 Light Probe；Unreal：Lumen＋Post Process Volume；Godot：WorldEnvironment（Tonemap、SSAO、SDFGI 或 VoxelGI）。

**材质边界依据**：Three 0.186.1 固定源码的[环境接入](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/webgl/WebGLPrograms.js#L56-L64)、[直接阴影与间接光](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/lights_fragment_begin.glsl.js#L181-L244)、[Toon 合光](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/lights_toon_pars_fragment.glsl.js#L10-L25)与 [aoMap](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/aomap_fragment.glsl.js)。原核实 2026-10-27，2026-10-28 与已安装同版源码逐字节复核；这是受光路径核对，视觉收益按 [Skill §4](../SKILL.md#4-同机位对比非作者判定)验收。
