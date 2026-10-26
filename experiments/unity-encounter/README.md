# 已有作者源 → Unity 原生遭遇房

**这批固定角色默认从 `.blend` 导出 FBX，以 Unity ModelImporter／Animator／Lit 接入；不因为已有 Web GLB，就把 glTF importer 设为必需依赖。** 本目录是可接手的源准备与原生消费者骨架，尚未经过 Unity 编译、运行或构建。既有本机任务已报告安装的 2022.3 编辑器许可不可用，真实验收暂停；用户恢复许可后沿同一任务继续，不重试许可失败或使用不干净的旧版。

目标是同一遭遇房串起角色、动作、PBR、物理、序列化二改与 Player 构建，不迁移整款网页游戏，也不把环境用的收集开门当全链成品。

| 既有输入 | 可复用的制作成果 | Unity 必须新验 |
|---|---|---|
| Beacon Guard 蓝／橙 `.blend`，原创 CC0 | 15 骨骼、可改刀长、同源 bind/rest；蓝五动作 | ModelImporter 单位／朝向／骨路径／蒙皮范围、双色各自 Animator、实际接触 |
| 原 `author_reactions.py` | 保 idle／walk／attack，作者源补 hurt／death；不是通用重定向 | 单次动作、受击打断、Root 倒地姿态、重开清姿态、重导后新时长 |
| [砖墙作者源](../material-authoring/README.md) | 同一结构图→三张 PNG→Blender 重载；右墙二改、左墙保持 | Lit 槽、sRGB／线性、normal、mip、真实重打光与 Player 材质 |

Three 的 `AnimationMixer`／`SkeletonUtils.clone`／`dispose` 不搬进 Unity。复用源、配方与行为要求；Unity 的 Animator、Prefab、资源所有权和物理原生接线。

## 第一轮：固定源、显式导出，再进引擎

### 1. 取已有公开源，不重新生成一套角色

从本目录运行；先读 [sources.json](sources.json) 的固定提交、路径、SHA-256 和许可。MOBA-Like 固定 `912c04c` 同时提供 Blend、GLB、反应作者脚本与 CC0 声明。

```sh
python3 prepare_sources.py --checkout /path/to/public-MOBA-Like --output staged
python3 test_prepare_sources.py
```

`staged` 必须不存在。脚本从指定 Git blob 取源、全部验 hash 后才写，不联网、不覆盖工程。10 项真实 Git 夹具回归覆盖正常、第二文件失败零输出、重复目标、缺输入、缺提交、非 Git checkout 和已有输出；固定公开源也已实际取出。这是源交接验证，不是 Unity 验证。

### 2. 用已有 Blender 导出 FBX 和材质常量

已实际运行 Blender **4.3.2**。每个输出目录须是新的；在各自目录中导出 blue-reactions、amber，以及需要长刃对照时的 blue-long：

```sh
blender -b --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
  --python export_fbx.py -- --input staged/blue-reactions.blend --output exported-blue
blender -b --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
  --python export_fbx.py -- --input staged/amber.blend --output exported-amber
ENCOUNTER_SOURCE="$PWD/staged" BLENDER=blender python3 test_fbx_export.py
```

导出配方固定为 ARMATURE＋MESH、无 leaf bones、All Actions、关闭 NLA strips、逐帧采样／不简化、`-Z Forward / Y Up`、应用单位。每件输出 `.fbx` 和 `.source.json`：后者明确记录每个 mesh 的材质槽、六种常量 Principled 材质和动作范围。角色没有图片纹理；不依赖 FBX 猜还原任意 Blender 节点图，遇到纹理／连接输入则拒绝该窄导出器。角色颜色元数据明确 `scene-linear`；绑定 Unity Color 属性前用 `Color.gamma` 转成 sRGB、保 alpha（例如线性 0.5 应写约 0.735357，而非 0.5），metallic／roughness 不做颜色转换。目标 Linear／Gamma 工程仍须用同一色块实际对照，避免双重转换；不能把未看图的常量搬运称颜色保真。

PBR 沿清单中的固定 a1dbv 源运行原 `material-authoring/build.py`／`verify.py`；保 `author.blend` 与配方，取 `base_{color,normal,roughness}.png` 和 `changed_{color,normal,roughness}.png`。不复制那套烘焙实现。

**源侧实跑**：蓝 FBX 重导 Blender 后保 15 骨、26 网格和五动作；150 帧逐 mesh 世界变形包围盒最大差约 **0.000001431 米**，蓝橙 rest matrices 逐元素相同。9 项真实 Blender 回归覆盖三份源导出、缺输入、已有输出、缺 rig、带前缀动作名，以及重导验证的缺失／损坏 FBX。包围盒比较既不是完整表面误差，也不是 Unity 导入／画质通过；复跑入口：

```sh
blender -b --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
  --python verify_fbx.py -- --source staged/blue-reactions.blend \
  --fbx exported-blue/blue-reactions.fbx --amber staged/amber.blend --report source-check.json
```

### 3. 在已安装、已许可的 Unity 新工程接手

1. 沿已有 Built-in 或 URP 模板建立新的隔离工程，锁定真实 ProjectVersion、包和 Build Profile。本目录不猜填工程版本、不自动安装引擎／激活／接受协议；不把 `.blend` 放进 Assets 让每台构建机都隐式依赖 Blender。
2. 复制 `Assets/Encounter/Editor` 和 `Runtime`。把蓝／橙 FBX、各自 `.source.json`、CC0 声明和六张 PNG 放入 `Assets/Encounter/Inputs/`，让 Unity 生成 meta。默认不安装 glTFast。
3. 等真实编译、原生模型导入完成。`EncounterModelImport` 只处理本例三个精确 FBX 路径：Generic、保层级、不优化骨对象；从本次 `defaultClipAnimations` 的实际 take 名建立 canonical 名，拒绝缺失／重复；idle／walk 循环，其余单次。
4. 选择 `Encounter/Create native scene (new output only)`。生成 Animator Controller、蓝／橙 Prefab、显式原生 Lit 材质和 `Generated/Encounter.unity`；controller **直接引用 FBX 导入 clip 子资产**，不再复制脱离源的 `.anim`。已有输出拒绝重建，旧场景不覆盖。
5. Play 模式 WASD 移动、Space 攻击；敌人接近攻击，Unity collider overlap 在接触阶段提交一次命中。两角色共享只读 clip／controller，各自 Animator 独立。CharacterController 是位移权威，`applyRootMotion=false`；本例根运动导入为骨姿态，必须在目标 Generic importer 检查 death 的 Root 倒地／贴地动作没有丢失，不能靠临时缩放／旋转掩盖错误。
6. `Encounter/Validate native animation assets` 后，沿既有 Test Framework 补实际行为测试，将场景加入目标 Build Profile，构建并启动 Player。必须查操作、动画、材质与帧推进，不用 Editor 截图或源侧测试代替。

**实际反例：动作名不是固定等于 `death`。** 本次 FBX→Blender 后为 `GuardRig|GuardRig|death` 等；Unity 的 take 名必须以其实际导入结果为准。脚本只认最后一个 `|` 后的五个已知名字，同时拒绝两个 take 映射同名，保存 canonical clip 名，避免盲改字符串碰巧通过。

## 第二轮：真正改作者源，再原位重导

**把 death 倒地从 24 帧改为 36 帧，复用原作者脚本；不是新写一套动作生成器。** 在第一轮工程验收后：

```sh
blender -b --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
  --python staged/author_reactions.py -- --input staged/blue.blend \
  --output revised-source --fall-frames 36
blender -b --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
  --python export_fbx.py -- --input revised-source/blue-reactions.blend --output revised-fbx
```

源侧已实跑这次重生、FBX 导出与 162 帧 bounds 对照（同一约 0.000001431 米最大差），其余四动作曲线指纹完全相同；不是 Unity 重导结果。death 包括固定六帧保持，总长度由 1.0 秒变 1.4 秒；保其余四动作、骨架、另一角色材质、左墙及 enemy speed 实例覆盖。经审阅后只更新同路径 `blue-reactions.fbx` 及对应 `.source.json`，保 Unity `.meta`，运行 `Encounter/Reimport source models and validate references`，保存重开并再构建。每次 import 都从**当前 TakeInfo**取范围，防止旧 `lastFrame` 截短新动作；controller 继续指 canonical 导入子资产。稳定名是保持引用的策略，不是保证：validator 同时按本次 source JSON 的帧范围／fps检查实际 clip 时长，并检查 state.motion 是否仍指当前子资产，丢引用即失败，不能用非空控制器掩盖。

另一个引擎采用检查是 `Encounter/Revise right wall only`：把原作者链已经冻结的 changed PNG 切给同一 `RightWall.mat`，保其身份、左墙和速度覆盖。这只算**消费者二改**，不算又做成一轮 AI 生成。metallic/smoothness 窄转换为 R=0、A=1−roughness，线性导入；normal 按法线图，base color 才 sRGB。再改墙配方时须新烘焙与新输入身份，不能沿用缓存 mask 冒充新结果。

## 为什么改默认，何时保留 glTFast

原 GLB 默认是顺着 Web 已有产物走；复制 `.anim` 还增加了源修改后的显式同步负担。对这批可编辑 Blend、固定 Generic 骨架、六常量材质＋独立墙 PNG，原生 FBX 更直接。glTFast 本身能生成原生资产、许可为 Apache-2.0，并非收费或“非原生”的问题。

已有项目的 glTFast 链已验证、需要运行时用户 GLB，或复杂 glTF PBR 的传输收益确实时，继续保该路线，不为格式洁癖迁移。原比较仍成立：所读 glTFast Editor importer 对 Mecanim clip 默认全循环且控制器连接需补；其运行时非 Legacy Playables 路线因 `AnimationClip.SetCurve` 的 Player 限制已移除。两条路线均可 Editor-time 导入后构建，均需真实 Player 检验。

来源与范围：2026-10-26 源侧比较及当前脚本实跑，Blender 4.3.2；[Blender FBX 配方](https://docs.blender.org/manual/en/4.3/addons/import_export/scene_fbx.html)、Unity [ModelImporterClipAnimation](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityeditor/modelimporterclipanimation)、[clipAnimations](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityeditor/modelimporter/clipanimations)；官方 glTFast 固定 `fdb5805` [能力／Player限制](https://github.com/Unity-Technologies/com.unity.cloud.gltfast/blob/fdb580527a41fd7006916030768ba74d3728f987/Packages/com.unity.cloud.gltfast/Documentation~/features.md)、[Editor importer](https://github.com/Unity-Technologies/com.unity.cloud.gltfast/blob/fdb580527a41fd7006916030768ba74d3728f987/Packages/com.unity.cloud.gltfast/Editor/Scripts/GltfImporter.cs)。Unity API 来源用于设计，实际 2022.3 兼容性尚未编译确认。

## 不是编译绿了就完成

验同一遭遇：移动不穿墙、可见攻击接触与命中一致、受击取消旧攻击、死亡不继续命中、重开可再打；保存重开保位置、双方 opponent、速度、clip 与材质引用；两个角色不串姿态、材质不串改。Player 重跑，并采冷启动、稳态、重复进出后的 Profiler／内存基线再决定优化，不先造 Addressables 框架。硬件 GPU、手感和最低设备品质按实际条件另验。

本骨架没有音频、技能特效、正式 UI、关卡生产与发布渠道。即使本消费者通过，也只证明“作者源→角色＋PBR＋原生客户端”这一段，不能写整个 AI 全链已完成。
