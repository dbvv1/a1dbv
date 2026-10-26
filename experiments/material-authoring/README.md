# 可编辑砖墙源 → PBR 烘焙 → 只改目标墙

用 Blender 原生 Brick 节点生成原创规则砖墙，保留 `.blend` 作者图和小型参数配方。颜色、凹凸与粗糙度共用同一个砖缝结构；导出后重新加载三张 PNG，组成两面墙的消费者材质。第二版只把右墙砖缝从 `0.018` 加宽到 `0.045`、砖面 roughness 从 `0.65` 降到 `0.35`，左墙保留原源和绑定。参数是本图的坐标单位，不直接当成米。

这是已有 PBR 制作链的可运行起点，不是自动材质框架、写实品质排名或游戏接入。脚本和配方原创，沿用仓库根 MIT 许可；不下载第三方纹理、模型或权重。

## 运行

已实际运行：Blender **4.3.2**、Cycles **CPU**、Python 3.11+；不是对 Blender 最新版的断言。依赖现有 `blender` 命令，不自动安装。从仓库根执行：

```sh
XDG_CONFIG_HOME="$PWD/experiments/material-authoring/.blender-user" \
blender --background --factory-startup --threads 2 --python-exit-code 1 \
  --python experiments/material-authoring/build.py -- \
  --recipe experiments/material-authoring/recipe.json \
  --output experiments/material-authoring/generated

blender --background --factory-startup --threads 2 --python-exit-code 1 \
  --python experiments/material-authoring/verify.py -- \
  --output experiments/material-authoring/generated

python3 experiments/material-authoring/test.py
```

输出目录必须不存在，重跑换新目录；不覆盖旧成果。`generated*`、工具配置和检查过程均不跟踪。

- `author.blend`：两份独立原生材质图；`Shared brick structure` 的同一 Fac 同时驱动反向高度和 `Region roughness`。要改结构，改 `recipe.json` 后重建，或打开作者图继续编辑；脚本不会把手工编辑的 `.blend` 反向合并进 JSON。仅改 roughness 时复用未受影响的颜色／normal 图，避免无意义重烘导致微小采样变化。
- `base_*.png`、`changed_*.png`：默认每组 512² RGB PNG；颜色用 sRGB，roughness 与 OpenGL 方向的切线 normal 用 Non-Color。非金属表面 metallic 固定 0，不额外猜一张金属图。这里只导出未压缩基线，没有 mip／引擎通道打包。
- `consumer.blend`：只从上述文件重新接 Principled BSDF，normal 经 Normal Map 节点；纹理路径相对本目录。移动或交付时整个目录一起带走。
- `before.png`／`after.png`：PNG 消费者的首版／二版；`source.png`：同一镜头、灯光和对象直接使用二版作者图，先与 `after.png` 比较砖边高光，再判断烘焙是否可用。相同材质在不同受光位置也可能看起来不同；“左墙保持”指作者参数、纹理与绑定不变，不承诺全局照明下逐像素不变。

## 采用与验收

需要重复改规则砖缝、条带等结构且项目已有 Blender 时，可直接借这个“同一节点结构→通道→目标对象”的做法；已有合格扫描材质就沿用，不为示例重建。对复杂磨损、木纹或涂层，先选有相应语义的成熟源，不把 Brick 节点当通用材质生成器。导入 Unity／UE 前仍按目标 shader 转槽、法线方向、mip 与采样规则，再在目标灯光和设备下验。

**先让结构细节适合输出分辨率，不靠加大 Normal Map Strength 补回丢失的坡面。** 本例把 Mortar Smooth 固定为 `1`、Bump Distance 收浅到 `0.005`，默认 512²；这是改成较圆缓的源设计，不是无损保留原尖锐边。预检用 `mortar × smooth ÷ Brick Scale × resolution` 算坡面覆盖，低于 2 texel 就在创建输出前失败；可加宽砖缝或提高分辨率。2 texel 是本例的起步约束，不是通用画质保证。允许 128／256／512，具体组合仍须通过预检和源／消费者看图；从 256² 升至 512² 是四倍 texel，预算不允许时应简化源细节，而不是静默降采样。

旧源的 Smooth `0.01` 在 256² 只有约 `0.012／0.029` texel 的坡面，真实 normal 曾丢掉整侧 X 方向；图尺寸、单位长度和“有变化”检查仍会通过。固定相机的通道替换对照把主要差异定位到 normal，单改过滤或分辨率不能视为修复。现在同时核 X／Y 的正负坡向，并输出源对照；这两项也不能代替目标引擎画面验收。

2026-10-26 UTC，Blender 4.3.2／Cycles CPU 实际重烘、重载、保存重开并看源／消费者预览。8 项回归真实启动 Blender：正常链；仅 roughness 二改保颜色与 normal（512²及128²宽缝）；欠采样配方拒绝；单侧但仍近单位长度的 normal 拒绝；缺输入；非法参数（含 NaN）；已有输出保护；缺纹理失败。修后同镜头更接近，未证明逐像素等价、无缝平铺、Unity／UE、GPU、最低设备或玩家审美。

制作选择与其他参数源比较见 [PBR 模块](../../domains/game-dev/assets/materials.md#pbr-production)，Material Maker 版本与实际运行范围见 [WP5](../../docs/research/2026-10-14-game-wp5-material-effects.md#二pbr一致性失败判别与程序能补多少)。

坡面宽度与凹凸采样依据：Blender 4.3.2 固定 [Brick 实现](https://github.com/blender/blender/blob/v4.3.2/intern/cycles/kernel/svm/brick.h)与 [Bump 实现](https://github.com/blender/blender/blob/v4.3.2/intern/cycles/kernel/svm/displace.h)，2026-10-26 核读；本例结果不外推其他渲染器。
