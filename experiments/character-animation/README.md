# 同一角色源 → 补动作与导出 → 分层／全身消费

复用 Beacon Guard 原创 CC0 的 15 骨骼、idle／walk／attack 与长刃 GLB，不重做角色。本例补的是已有源的**真实动画消费者**：Three 加载与采样 → 下身移动／上身覆盖 → 分段改时 → 取消回移动 → 独立实例与释放。它不推进角色位置、不决定攻击合法性、不发命中事件，也不改 MOBA-Like 生产代码。

现有 MOBA 表现模块只有 idle／walk；这里的挥击层是 a1 独立可运行起点，不表示已进入那个游戏。固定骨架和机械占位动作不是通用重定向／换弹系统；换成全身重心参与的攻击，先换兼容动作或改为站定全身播放，不能盲切同一上身掩码。

## 实际运行

已用 Node **24.22.1**、Three **0.186.1**；CPU 姿态图另用 Blender **4.3.2**。从本目录运行，固定依赖无安装脚本：

```sh
npm ci --ignore-scripts --no-audit --no-fund --cache /tmp/character-animation-npm
mkdir -p inputs
curl --fail --location -o inputs/blue.glb \
  https://raw.githubusercontent.com/dbvv1/MOBA-Like/c66f250f817b1ad7357088cba12f6ad30c83b8c8/asset-pipeline/placeholder/assets/blue.glb
curl --fail --location -o inputs/blue-long.glb \
  https://raw.githubusercontent.com/dbvv1/MOBA-Like/c66f250f817b1ad7357088cba12f6ad30c83b8c8/asset-pipeline/placeholder/assets/blue-long.glb
npm test
node sample.mjs generated-poses
XDG_CONFIG_HOME="$PWD/.blender-user" \
blender --background --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
  --python preview.py -- --input generated-poses/poses.json --output generated-poses/poses.png
python3 test_preview.py
```

`source.mjs` 在解析前核两件固定 SHA-256；输入、采样数据与图不进 Git。输出目录／图片必须不存在，不覆盖旧交付。`CHARACTER_SOURCE_DIR` 可指向已下载的同 hash 目录。不要用第三方取回失败的角色替代此夹具。

## 消费端接线

```js
import {loadSource, disposeSource} from './source.mjs'; // 本例 Node 文件加载器
import {createConsumer, profiles} from './consumer.mjs';
const source = await loadSource('blue');
const view = createConsumer(source);
scene.add(view.root);                    // scene / renderer 由宿主持有
view.root.position.set(x, 0, z);        // motor / 模拟是位移权威
view.sample({time: visualSeconds, walk: walkBlend, attack: {
  startedAt: attackStartSeconds,
  profile: profiles.faster,
  // cancelledAt: authoritativeCancelSeconds,
}});
// 无动作时传 attack:null；换局先重置外部时钟/动作再view.reset()。
// 离开场景移除root再view.dispose()。
// 所有实例释放后，源持有者才 disposeSource(source)。
```

`consumer.mjs` 无 Node I/O；浏览器宿主可将自己 GLTFLoader 得到的结果交 `prepareSource(gltf)`，随后复用相同接口。浏览器获取／渲染尚未在本例验证；不要直接把 Node 的 `source.mjs` 打进浏览器。

1. **先对齐作者时钟。** 固定 GLB 首键在 `1/30s`，原始 `clip.duration` 包含这段前导时间。`prepareSource` 在派生 track 中减去首键，得到 idle `1s`、walk `32/30s`、attack `35/30s`；原 clip 不变。直接按原始 duration 循环，会多出一帧前导姿态。
2. **按骨骼分责任，不把两个全身 clip 等权叠起来。** Root 与双腿只读 idle／walk；Torso、头、双臂和手是上身集合。下身权重之和为 1，上身的移动与 attack 权重之和也为 1，形成 override 而非两份姿态平均。每实例骨架／mixer／材质独立，几何和只读源 clip 共享；武器仍沿原 Hand_R 蒙皮。
3. **改阶段，不全局加速。** 本例明确选作者 frame14 为蓄势终点、frame19 为视觉接触姿态；这是示例约定，不是从动画推断真实命中。原接触时刻 `.6s`，新配置改为 `.35s`，恢复仍为 `17/30s`；各段映回同一作者区间，不改源文件。玩法若要改变命中时点，须另在自己的权威时间线改，不能依赖本消费者回调。
4. **取消后回到当下移动。** 取消时冻结出层动作的采样位置，再按短 fade 降权；下身移动继续，上身回到当前移动相位。调用方每次给完整当前动作，不维护迟到命中回调；换动作／换局不继承旧权重。`sample` 用绝对视觉时钟；time／startedAt／cancelledAt 必须处于同一秒制时间线，暂停重复同值即可，合法取消规则仍由玩法决定。

**换姿态也更新可见范围。** Three 会缓存蒙皮包围；只在 idle 算一次，伸出的刀刃可能在视锥边缘被误裁。本例每次采样后重算各 SkinnedMesh 的 box／sphere，并用旧球装不下新挥击的真实负例验证。代价是每次遍历蒙皮顶点，随实例数与采样频率增长；规模化时另测保守包围策略，不把本例当零成本优化。

二改保留旧 profile 与短刃；新 profile 只改蓄势／挥击时长，再换长刃源。比较同一时间的旧／新姿态，以及两种武器在同源阶段的握点；不拿“数值有限”替代看图。

## 原源缺受击／死亡时：补作者动作，再交消费者

`author_reactions.py` 打开同一固定 **CC0 blue.blend**，只新增 `hurt`／`death` 两个 Action，保存可再编辑的 Blend，再导出五动作 GLB。新增程序动作及派生资产同样按 CC0 1.0 提供；脚本沿根 MIT。默认是机械占位：受击躯干后仰后恢复，死亡整身向后倒并停住，不是自然动捕或完整战斗动作组。

```sh
curl --fail --location -o inputs/blue.blend \
  https://raw.githubusercontent.com/dbvv1/MOBA-Like/c66f250f817b1ad7357088cba12f6ad30c83b8c8/asset-pipeline/placeholder/assets/blue.blend
# 先生产旧版，再做“倒下放慢、停住时长与其他动作不变”的二改。
for spec in "generated-reactions 24" "generated-reactions-slow 36"; do
  set -- $spec
  XDG_CONFIG_HOME="$PWD/.blender-user" \
  blender -b --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
    --python author_reactions.py -- --input inputs/blue.blend --output "$1" --fall-frames "$2"
done
npm run test:reactions
python3 test_author_reactions.py
node sample-reactions.mjs generated-reactions/blue-reactions.glb \
  generated-reactions-slow/blue-reactions.glb generated-reactions-poses
XDG_CONFIG_HOME="$PWD/.blender-user" \
blender -b --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
  --python preview.py -- --input generated-reactions-poses/poses.json --output generated-reactions-poses/poses.png
```

生成器先核固定 Blend 的 hash，拒绝旧输出目录；生成前后及保存重开后比较原三段曲线、网格／蒙皮、骨架静止矩阵与材质。Root 校正用**所有实际变形点**贴地，不能沿站立动作只查鞋底：倒下时接地部位已换成躯干／手臂。新增动作逐帧写键。作者侧贴地仍不足以保住任意移动相位的混合：独审在非零起点发现约 9.8 mm 穿地。最终在全身层混合后扫描实际顶点，对内部 Root 作角色局部平面 `y=0` 的竖直补偿，再刷新骨架与包围；外层 motor 根不动，下一次采样先撤上次补偿，暂停不累加。两版本、四个起点的 60 Hz 采样（含淡入／淡出）按 1 mm 容差检查。这额外花一次蒙皮顶点扫描，只是固定平地占位方案，不是坡地足 IK 或物理碰撞。

```js
import {loadReactionSource} from './source.mjs';
const source = await loadReactionSource('generated-reactions/blue-reactions.glb');
const view = createConsumer(source);
view.sample({time: visualSeconds, walk: walkBlend, attack: currentAttack,
  reaction: {name: 'hurt', startedAt: hitVisualSeconds}});
// 权威状态已死亡时改传 {name:'death', startedAt:deathVisualSeconds}。
// 复活由调用方清掉 reaction/attack、重置外部时钟与位移，再 view.reset()。
```

玩法先决定当前全身状态（死亡优先于受击），消费者再让全身动作覆盖上／下身；不从生命值或冷却推测事件。受击 `0.6s` 后淡回调用方当前底层状态；若要打断原攻击，玩法须清掉 `attack`，否则仍有效的挥击会恢复。死亡播放一次并保持末帧，直到调用方清掉死亡状态。它仍不接管外层位置，死亡时停止移动也由玩法负责。不要只降低上身攻击权重而让双腿继续走。

二改把倒下阶段 `24/30s → 36/30s`，结尾保持仍为 `6/30s`，总长 `1 → 1.4s`；原三动作与 hurt 全部导出键值不变。消费端读取新 clip 的实际时长，无需另改计时常量；旧／新同一倒下比例及最终卧倒姿态一致。浏览器接入用 `prepareSource(gltf, {reactions:true})`，Node 文件加载器只负责本例读取。导出与全身消费已跑通，真实游戏的死亡判定、重生接线和连续观感另验。

## 验到哪里

2026-10-26 UTC：10 项真实 GLB／Three 测试覆盖时钟、正常动作、分层、保恢复改时、取消重入、暂停／重置、双版本／独立实例与释放、姿态变化后的蒙皮包围、非法输入、坏／缺源。4 项真实 Blender 子进程测试覆盖正常 CPU 图、坏网格、缺输入和旧输出保护。`sample.mjs` 输出的是 Three 实际蒙皮后的顶点，`preview.py` 只把这些顶点重建为网格渲染，**不在 Blender 重播原 clip 冒充消费结果**；只复建基础色、roughness、metalness，不能据此宣称跨渲染器材质等价。另有 6 项真实扩展 GLB／Three 检查及 5 项 Blender 源生成子进程检查，覆盖原动作保留、全身优先级、死亡保持／重置、倒下放慢二改、握点／地面与坏／缺源／旧输出。已看分层与受击／死亡两组各 16 个同条件姿态，未验连续运动的审美、足底滑步、真实游戏／GPU 或战斗手感。

来源：固定 [CC0 作者源与配方](https://github.com/dbvv1/MOBA-Like/tree/c66f250f817b1ad7357088cba12f6ad30c83b8c8/asset-pipeline/placeholder)；Three [AnimationAction](https://github.com/mrdoob/three.js/blob/r186/src/animation/AnimationAction.js)、[AnimationMixer](https://github.com/mrdoob/three.js/blob/r186/src/animation/AnimationMixer.js)、[SkeletonUtils](https://github.com/mrdoob/three.js/blob/r186/examples/jsm/utils/SkeletonUtils.js)与[SkinnedMesh 包围计算](https://github.com/mrdoob/three.js/blob/r186/src/objects/SkinnedMesh.js)，本轮按安装的 0.186.1 行为实测。新增代码沿 a1dbv 根 MIT，源角色许可独立保留；完整动作供给选择见[动画模块](../../domains/game-dev/assets/animation.md#第二次修改决定是否留下)。
