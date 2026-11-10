# KayKit 动作源接收：同名骨不能证明直接兼容

**保留 FPS 原角色，不把这组重导出的动作直接接上 Knight。** FPS 待接收源包的骨名相同，但动作还驱动骨架父节点；直接复用会漏掉坐标变换。该结果用于拒绝未经验证的直接接入，不是新角色候选，也没有改变游戏默认。

## 固定输入与复验

输入来自 FPS-Like [78a892c](https://github.com/dbvv1/FPS-Like/tree/78a892c6cf057ddb63b4fc21daafdd7e4313453a/asset-pipeline/character-action-sources) 的 `sample/kaykit/Knight.glb` 与 `Med_CombatRanged.glb`。探针校验两个 SHA-256；原文件与许可保留在该分支，不重复提交素材。

用已有 Three **0.186.1** 依赖运行，两个参数分别指向该固定小样目录和依赖目录：

```sh
node experiments/kaykit-rig-intake/probe.mjs <sample/kaykit> <node_modules>
```

Node 24.22.1 实跑：GLTFLoader 加载两个原字节文件，AnimationMixer 在各片段中点采样同一个 clip，比较源骨架与目标角色。贴图加载由空 Texture 替代，未解码图片；未开启浏览器或 GPU。

| 动作 | 时长（秒） | 目标 head 世界 Y | 源 head 世界 Y |
|---|---:|---:|---:|
| `Rig_Medium\|Ranged_1H_Reload` | 1.2000 | 0.0371 | 1.2361 |
| `Rig_Medium\|Ranged_2H_Reload` | 1.6333 | -0.0790 | 1.2355 |

两例都缺 `Rig_Medium.position/quaternion/scale` 三条目标绑定。Knight 的父节点叫 `Rig`，旋转为单位四元数；动作源父节点为 `Rig_Medium`，约绕 X 轴 +90°，其 root 约 -90°。只让同名 root 接到动画而漏掉父节点，会使头部高度落到接近地面、Z 约 -1.236。这里是 CPU 世界坐标反例，不是看过画面后的姿势评分。

## 接收决定与下一步

- 接收小样的固定文件身份与“仍缺完整可直接用的枪械角色”这一窄结论。原 432 条候选清单超出 2–3 个成套源的任务范围，不搬入正文或产品 main，也不视为全部核实。
- 撤回原 CPU-PARSE 的“23 个核心骨同名即可直接落到 Knight”推论。已有两类 reload 的绑定反例足以停止直接接入；不据此否定 KayKit 自身资产质量。
- 若选此源，先统一父节点／root 坐标合同，再在角色网格上核 idle→run→reload→death、左右手与枪／弹匣接触。单纯删除缺失轨道会保留错误方向，单纯改名也不证明整体姿态正确。
- 原包没有独立枪／弹匣，游戏消费者还拒绝 SkinnedMesh；本次不改消费者、不制作假 reload。Mesh2Motion 仅保留旧候选，未在此复验，不据来源清单认定已可采用。

**检查边界**：两类 reload 的真实 Three 解析／采样及文件身份通过；零参数退出 2，缺文件与坏哈希均非零。GPU、贴图、接触、手感、完整动作组及运行时采用均未验。FPS main `6157235`、Site v24 不变。

**依据**：固定分支 [CPU-PARSE.md](https://github.com/dbvv1/FPS-Like/blob/78a892c6cf057ddb63b4fc21daafdd7e4313453a/asset-pipeline/character-action-sources/CPU-PARSE.md)、[小样来源与原许可](https://github.com/dbvv1/FPS-Like/blob/78a892c6cf057ddb63b4fc21daafdd7e4313453a/asset-pipeline/character-action-sources/sample/kaykit/PROVENANCE.md)；本目录探针实跑，2026-11-09。原样本许可材料只沿固定记录，本轮未另核作者网站。


## 父节点轨道修正：仅接收 CPU 坐标合同

`remap.mjs` 提供固定小样的窄适配：克隆动作，只把 `Rig_Medium` 三条轨道的目标改为 Knight 的 `Rig`，保留所有轨道的时间、数值与插值方式，不改原 GLB 或原 clip。适配先核唯一节点、完整 position/quaternion/scale 三通道、相同骨层级、root 直属父节点和场景单位变换；缺项、歧义或结构不匹配直接拒绝。它不是跨角色通用重定向器，也不把单纯改名当验收结果。

```sh
node experiments/kaykit-rig-intake/verify-remap.mjs <sample/kaykit> <node_modules>
```

Node 24.22.1／Three 0.186.1 对同一固定原件完成真实 GLTFLoader → AnimationMixer → SkinnedMesh CPU 消费：两类 reload 的全部源关键帧、相邻关键帧中点及 60Hz 网格（含结尾）合计 331 个采样。每帧比较 **24 个动画节点的完整世界矩阵**，包括两手插槽；矩阵最大差值为 0。另对 Knight 六片网格的全部顶点，用原角色 inverse-bind 与源骨架的世界矩阵独立计算蒙皮参考，和 Three 的 `applyBoneTransform` 世界坐标比较。两组分别 523,956／706,040 次顶点评估，最大误差为 1.80e-15／1.81e-15，门槛为 1e-6。这个参考验证坐标和蒙皮计算一致，不是造型、身体穿插或枪械接触质量评价。

12 个负例覆盖缺模型、缺父轨道、错误 root 父层级、缺骨、重名骨和非单位场景变换，均拒绝；输入 clip 的序列化内容未变，克隆轨道的时间／数值／插值保持一致。零参数退出 2；缺文件、坏哈希非零。旧 `probe.mjs` 的未适配反例继续保留，不改成成功断言。

**产品接收仍未通过。** FPS 固定 `61572353` 的真实 `ContentSetAssets`／`ContentOpponent` 对原 Knight 先因缺 `enemy-root` 拒绝；所有者进入 fallback、rifle／actor 为空，dispose 后进入 disposed，现有 `content-set` 19 项通过。这仅证明旧消费者安全拒绝该源；消费者的刚性网格合同还明确拒绝 SkinnedMesh，本轮不放宽它。该消费者复验使用 Three 0.186.1、tsx 4.23.15。复跑需固定 FPS `61572353accd159b5f8effaa3212e35d3224cc67` checkout 及对应依赖，`<tsx-loader>` 为已安装 tsx 的 `dist/loader.mjs`：

```sh
node --import <tsx-loader> experiments/kaykit-rig-intake/consumer-probe.mjs <FPS-checkout> <sample/kaykit>
```

探针校验原 Knight SHA，显式注入已解析资源，以隔离真实适配器／所有者合同；它不经过生产 fetch／哈希通路，不给 Knight 新增生产 pin。实际接入需要独立的蒙皮角色／骨架克隆与动作命名适配，不给原刚性接口改名伪装通过。

**剩余门槛**：这里只核两类 reload 的固定坐标与 CPU 蒙皮，不包含贴图解码、浏览器／GPU、完整 idle→run→reload→death 过渡、枪／弹匣接触、动作观感与手感；无新 GLB、默认角色替换、产品 main 或部署。实测：2026-11-09。

## 独立蒙皮实例消费者：已保全，未接玩法

FPS [17a7b53](https://github.com/dbvv1/FPS-Like/commit/17a7b53e197066e3a0c730db937a700a33a6067f) 在独立分支实现 `KayKitSkinnedCharacter`，以官方 `SkeletonUtils.clone` 克隆骨架，再独立复制 inverse-bind 矩阵；几何、材质与纹理仍由加载方只读共享并管理寿命。两种 reload 使用上面的父轨道合同，实例分别拥有 mixer、动作和骨架调色板；切换、停止、销毁以及异步失败不影响另一实例或原源。世界位置放在父容器上，避免 stop 恢复局部姿态时覆盖放置。旧刚性消费者与默认游戏不变。

固定原 GLB 的真实消费者通过 173 个 60Hz 采样，全部动画节点矩阵最大差为 0；六片网格首／中／末顶点共 3,114 次蒙皮比较，最大误差 1.12e-15。全部骨与 inverse-bind／调色板隔离、源对象和矩阵缓存不变、6 个实例调色板释放且共享资源未释放，均有实际断言。438 项测试、构建、公开扫描与非作者复验通过；缺参数、缺文件和坏哈希均失败，未跳过。命令与资源所有权见[产品消费者说明](https://github.com/dbvv1/FPS-Like/blob/17a7b53e197066e3a0c730db937a700a33a6067f/docs/skinned-character-consumer.md)。

这只移除了独立蒙皮实例生命周期的接入阻塞；尚未接 `View`，不提升动画模块成熟度或品质分。完整动作组、动态包围体／可见性、纹理／GPU、枪与弹匣接触、玩法事件同步和真实游玩仍待接收。产品 main `6157235` 与 Site v24 不变。实测：2026-11-10。
