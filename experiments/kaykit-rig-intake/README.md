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
