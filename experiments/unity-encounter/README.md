# 从已有作者源接进 Unity 原生遭遇房

**先让已有角色、动作和 PBR 进入一个可修改的 Unity 原生场景，不迁移整款网页游戏。** 此目录交接 Editor 建场景脚本、原生角色消费者和固定源清单；Unity 版本、包与 Build Profile 由真实已授权环境锁定。当前是**未经过 Unity 编译／运行的工程骨架**，不是可玩成品或全链验收。收集开门任务只验证环境入口，之后沿同一任务继续本目录。

这里复用三条已经存在的制作链，不新建生成平台：

| 输入 | 原有证据可复用 | 本消费者必须新验 |
|---|---|---|
| Beacon Guard 蓝／橙 `.blend`／GLB，原创 CC0 | 15 骨骼、米制、蒙皮、可改刀长；蓝角色已有五动作 | Unity importer 后的骨路径／朝向／蒙皮范围、双色各自 Animator、实际物理命中 |
| `author_reactions.py` 的 hurt／death | 保存重开与原 idle／walk／attack 数据保持；不是通用重定向 | Animator Controller、单次动作不循环、受击打断、死亡终态及重开清姿态 |
| [砖墙作者源](../material-authoring/README.md)的同源三张 PNG | Blender 作者图→烘焙→重新加载；右墙二改，左墙保持 | 目标 Lit shader、sRGB／线性槽、normal、mip、真实灯光、打包材质可用 |

Three 的 `AnimationMixer`、`SkeletonUtils.clone` 和 `dispose` 不搬进 Unity。复用的是源数据和行为要求，Unity 的 Animator、Prefab、材质、场景所有权与物理必须原生接线。

## 第一步：只准备公开源

先读 [sources.json](sources.json) 的固定提交、路径、SHA-256 与许可。用已经取得相应提交的 MOBA-Like 公开 checkout，在此目录运行：

```sh
python3 prepare_sources.py --checkout /path/to/public-MOBA-Like --output staged
python3 test_prepare_sources.py
```

`staged` 必须不存在；脚本用 `git show <固定提交>:<路径>` 取 blob、全部验 hash 后才写，既不联网也不覆盖工程。真实固定源已在云端取出并检查；10 项回归覆盖正常、缺输入、hash 不符、路径越界与已有输出。它们只验证交接脚本，**不验证 Unity**。

PBR 沿清单中的 a1dbv 固定提交执行原 `experiments/material-authoring/build.py` 与 `verify.py`。保其 `author.blend`、配方和前后对照，取 `base_{color,normal,roughness}.png` 与 `changed_{color,normal,roughness}.png`。当前输入是未压缩 PNG；不得拿旧数值检查代替这次 Unity 高光／凹凸检验。

## 第二步：在已安装、已许可 Unity 中接手

1. 使用新的隔离 Unity 工程，沿已有 Built-in 或 URP 模板，不改旧项目管线；登记实际 ProjectVersion、包锁和已安装构建模块。此目录没有猜填版本的 ProjectSettings 或 manifest，也不自动安装／激活／接受条款。
2. 复制本目录 `Assets/Encounter/Editor`、`Runtime` 到该工程。将 staged 的三份 GLB、许可与六张 PNG 放入 `Assets/Encounter/Inputs/`，让 Unity 生成 `.meta`。已有 glTF importer 就先核能力；缺少时先按兼容版本评估官方 glTFast，不并装两个争抢 `.glb` 的 importer。源码比较版本是 6.20.1-pre.1，**不是要求升级到此预览版本**。
3. 等真实 Unity 编译和导入完成。选择 `Encounter/Create native scene (new output only)`，生成原生 `.anim`、Animator Controller、蓝／橙 Prefab、两份墙材质和 `Generated/Encounter.unity`。输出目录已存在时拒绝重建；不要删除来规避保护。失败保留诊断，由接收端只修确实失败的阶段。
4. 在 Play 模式实际用 WASD 移动、Space 攻击；敌人会接近并攻击，接触阶段以 Unity 碰撞体 overlap 判定一次命中。蓝橙共用只读 clip／controller，但各自 Animator 独立。角色由 CharacterController 移位、`applyRootMotion=false`，动画不能再驱动第二份位置。当前站定全身攻击与简单敌人是接线起点，不是动作品质结论。
5. 验证 `Encounter/Validate native animation assets` 后，使用现有 Unity Test Framework／项目测试入口补运行测试；把 Encounter 场景加入当前 Build Profile，通过真实目标构建并启动。不要只看 Editor 截图：确认帧推进、操作、材质和 Animator 在 Player 中都有效。

**glTFast 的“支持动画”不等于已有 Animator 游戏。** 所读 Editor importer 默认创建 Mecanim clip，给全部 clip 设置 `loopTime=true`，并未完成控制器子资产的自动连接。本脚本把源 clip 复制成持久原生 `.anim`，只让 idle／walk 循环，attack／hurt／death 不循环，再显式建立控制器。该选择须用目标版本编译和运行确认。不要运行时再用 `AnimationClip.SetCurve` 创建非 Legacy clip：glTFast 已因其 Player 限制移除该 Playables 路线。此处选择 **Editor-time 导入→原生资产→构建**，不为固定内容增加运行时 GLB 下载。

来源：官方 glTFast [固定能力表](https://github.com/Unity-Technologies/com.unity.cloud.gltfast/blob/fdb580527a41fd7006916030768ba74d3728f987/Packages/com.unity.cloud.gltfast/Documentation~/features.md)、[Editor importer](https://github.com/Unity-Technologies/com.unity.cloud.gltfast/blob/fdb580527a41fd7006916030768ba74d3728f987/Packages/com.unity.cloud.gltfast/Editor/Scripts/GltfImporter.cs)、[材质与构建](https://github.com/Unity-Technologies/com.unity.cloud.gltfast/blob/fdb580527a41fd7006916030768ba74d3728f987/Packages/com.unity.cloud.gltfast/Documentation~/ProjectSetup.md)，2026-10-26 源码核查；未运行 Unity。

## 第二次需求：右墙变化，角色与左墙保留

在同一已保存场景运行 `Encounter/Revise right wall only`：读取原作者链的 changed PNG，只更改 `RightWall.mat` 的纹理引用，保它的 GUID 与场景绑定；左墙继续引用 base 图，敌人速度的 Prefab 实例覆盖仍为 1.2。然后保存、关闭并重开场景，复核左墙引用、右墙实际高光／凹凸和蓝橙动作。原源正常／修改版通道一起交接，不独立重画颜色图。

Unity Lit 的 metallic/smoothness 图是本消费者的窄转换：R=0（非金属），A=1−roughness，线性导入；normal 按法线图导入，base color 才用 sRGB。脚本不宣称支持任意管线或多层 PBR。第二次修改仅切换已经冻结的 changed 图；再改配方时须生成新的输入身份及对应 mask，不能用旧 mask 冒充重烘。

角色后续二改复用 `blue-long.glb`／反应作者脚本，必须明确重导 source 后更新哪些原生 clip／Prefab。当前脚本**不会自动同步复制出的 `.anim`**：这是避免重导悄悄覆盖游戏设置的取舍；改动作时要显式复制曲线到已有 clip、保其 GUID 和 loop 策略，再验 Animator 使用点。不能只替换 GLB 后宣称死亡时长已更新。

## 完整消费者的实际验收，不止编译

- **原生引用与序列化**：导入五动作、控制器和两角色；保存重开仍正确；仅 idle／walk 循环；右墙二改不改左墙和敌人速度覆盖。
- **玩法／物理**：移动不能穿墙；朝向与攻击可见接触相符；攻击一次只扣一次；受击取消旧攻击，死亡不继续命中；Restart 清旧姿态且下一局可以再攻击。碰撞体尺寸与站定攻击时间目前只是源驱动起点，必须看真实角色。
- **资源／渲染**：两角色不串姿态，材质不被一个实例改到所有对象；重复进出同一场景回到可解释的对象／材质持有量；蓝橙标记、normal 高光及远处 mip 在目标灯光下可读。场景静态资源先由场景持有，不为此先建 Addressables 框架。
- **构建／剖析**：Player 实跑上述流程，检查缺失 shader variant／动画／引用。对同一遭遇采冷启动、稳态及重开后的 Profiler／内存基线；再决定优化，不从 Web 的帧数／dispose 测试推 Unity 结果。硬件 GPU、手感和最低设备表现另列实际待验。

本骨架没有音频、技能特效、正式 UI、关卡生产与发布渠道，因此即使这些步骤通过，也只证明“角色＋PBR＋原生客户端”这一完整消费者；不能将它写成整个 AI 全链路已完成。
