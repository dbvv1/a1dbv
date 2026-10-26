# 从同一 3D 作者源交付四向精灵，再改长武器

已有可修改的角色与动作时，直接用成熟渲染器批渲，不逐帧重画。本例复用原创 CC0 **Beacon Guard** 占位角色：Blender 导入同一 15 骨骼 GLB，固定相机／脚底与四个真实朝向，输出 idle、walk、attack，打图集，再由一个小型 Pillow 消费者按时间与 pivot 真正取帧、合成。长刃版只交新包，旧包、帧身份、方向、时长和 pivot 保持。

这是 3D 源→2D 交付的完整可运行起点，不是完整角色动作库或最终像素美术。源没有 hurt／death，动作偏机械；若玩法需要这些动作，先回作者源补齐。此处把身体和武器烘在一起，**不是运行时自由配装／前后分层包**；方向与装备组合持续增长时，按 [2D 正文](../../domains/game-dev/assets/2d.md#2-角色必要动作源结构和事件)比较实时 3D。

## 运行

实际工具：Blender **4.3.2 / Cycles CPU**、Python **3.12.14**、Pillow **12.3.0**；固定为复跑版本，不称最新版本。无需 GPU 或模型。只下载下面两件自有 CC0 源，不涉及先前取回失败的第三方角色。

从仓库根执行；`blender` 须已在 PATH，Python 3.11+：

```sh
python3 -m venv experiments/sprite-source/.venv
experiments/sprite-source/.venv/bin/pip install -r experiments/sprite-source/requirements.txt
mkdir -p experiments/sprite-source/inputs
curl --fail --location -o experiments/sprite-source/inputs/blue.glb \
  https://raw.githubusercontent.com/dbvv1/MOBA-Like/c66f250f817b1ad7357088cba12f6ad30c83b8c8/asset-pipeline/placeholder/assets/blue.glb
curl --fail --location -o experiments/sprite-source/inputs/blue-long.glb \
  https://raw.githubusercontent.com/dbvv1/MOBA-Like/c66f250f817b1ad7357088cba12f6ad30c83b8c8/asset-pipeline/placeholder/assets/blue-long.glb

for variant in blue blue-long; do
  XDG_CONFIG_HOME="$PWD/experiments/sprite-source/.blender-user" \
  blender --background --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 \
    --python experiments/sprite-source/render.py -- \
    --source-dir experiments/sprite-source/inputs --variant "$variant" \
    --output "experiments/sprite-source/generated-$variant-frames" || exit 1
  experiments/sprite-source/.venv/bin/python experiments/sprite-source/atlas.py pack \
    "experiments/sprite-source/generated-$variant-frames" \
    "experiments/sprite-source/generated-$variant-package" || exit 1
done

experiments/sprite-source/.venv/bin/python experiments/sprite-source/atlas.py preview \
  experiments/sprite-source/generated-blue-package \
  experiments/sprite-source/generated-blue-long-package \
  experiments/sprite-source/generated-attack.webp
experiments/sprite-source/.venv/bin/python experiments/sprite-source/test.py
```

源码 SHA-256 在 `recipe.json` 中，渲染前逐件核对。输出目录必须不存在；失败可能留部分帧，但没有完整 `frames.json` 就不能打包。重跑换新目录，不覆盖旧包。输入、生成帧、预览、图集和临时工具配置均忽略，不把过程产物提交到仓库。

## 这份配方可以直接改什么

1. **先定共同画布，而不是逐帧裁边。** 本例 96² 透明画布、固定正交相机和脚底世界原点，四向真的旋转角色，不镜像有单侧武器的动作。首个站姿构图曾裁掉攻击蓄势，最终相机预算同时覆盖整段动作与 1.05 米长刃；每帧核所有变形顶点／alpha边缘，不因换方向重新居中。新源超预算时，重定整个资产族的相机规格，再明确迁移，不能偷偷只放大某一帧。
2. **保作者时间，用导出时间表采样。** 原源 30 fps，目标采样约 12 fps；为保原时长，idle 为 12 帧／1 秒，walk 为 13 帧／32÷30 秒。loop 不重复末端；attack 为 15 帧／35÷30 秒，包含末姿态，播放到期后保持它。`sample_fps` 是目标密度，不是让消费者忽略 `times` 强按 12 fps 播；此包没有命中／脚步事件，重采样后的事件仍须玩法另定。
3. **打包后消费真实产物。** 每版 160 张 RGBA 帧变为一张 1600×1000 图集，每边留两像素透明 padding（相邻帧间四像素）。`sprites.json` 保存图集 hash、裁片矩形、按动作／方向的稳定帧名、真实采样时间与顶层 `pivot_px`。`SpritePackage.sample` 处理循环／末帧；`draw` 只按给定世界屏幕锚点减 pivot，不自己推进游戏时间或猜命中。示例 WebP 用实际图集采样生成，不是另从 3D 画一张假消费者预览。
4. **只改长武器，旧包不动。** 第二版使用原作者的 `blue-long.glb`（刃长 0.75→1.05 米），共享配方和已有动作；独立导出、打包，复核逻辑帧名、时钟、矩形及 pivot 与旧包相同。源结构保持沿用原资产独审，新的阴影／遮挡像素不要求与短刃逐位相同。

pivot 以**左上原点的像素**记录，本例约 `(48, 83.107)`；映射到 Unity 归一化左下原点是 `(x/96, 1-y/96)`。图集裁片包含原共同画布，不进行 trim；换引擎还要核 alpha／过滤、图集挤边、压缩与 y 排序，不把这些 padding 当 GPU 无串色认证。

## 实际验到哪

2026-10-26 UTC：两件固定公开 GLB 重新取回并核 hash；320 帧实际 CPU 渲染、两套打包与 Pillow 取帧／合成完成。7 项真实回归覆盖完整产物、时钟／锚点、旧包和源保持、坏／缺源、裁画布、缺帧、坏图集／时钟／矩形／版本与输出保护。已亲看四向和深／浅背景下的站立、行走、蓄势、挥下，长短刃能在侧向对照中分辨。

它是低多边形占位源，未证明最终像素风质量、所有方向攻击可读性、连续接触、实际移速与滑步、GPU／Unity／UE 或游戏采用；动画渲染不替代玩法有效帧。原模型／动作的独立验证和当前生成链的验证分开，不把 320 帧计为 320 项质量验收。

来源与许可：原 [CC0 许可](https://github.com/dbvv1/MOBA-Like/blob/c66f250f817b1ad7357088cba12f6ad30c83b8c8/asset-pipeline/placeholder/LICENSE.txt)、[可编辑源及配方](https://github.com/dbvv1/MOBA-Like/tree/c66f250f817b1ad7357088cba12f6ad30c83b8c8/asset-pipeline/placeholder)；本目录新增脚本与配方沿仓库 MIT。Pillow 是固定的 [12.3.0](https://pypi.org/project/pillow/12.3.0/) 依赖，不复制其实现。3D 母版的条件比较与历史案例沿 [WP2 §2](../../docs/research/2026-10-14-game-wp2-2d-assets.md#2-精灵动画控制身份不等于控制动作)，不把历史案例的美术品质归给本例。
