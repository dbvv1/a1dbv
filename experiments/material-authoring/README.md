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
- `base_*.png`、`changed_*.png`：每组 256² RGB PNG；颜色用 sRGB，roughness 与 OpenGL 方向的切线 normal 用 Non-Color。非金属表面 metallic 固定 0，不额外猜一张金属图。这里只导出未压缩基线，没有 mip／引擎通道打包。
- `consumer.blend`：只从上述文件重新接 Principled BSDF，normal 经 Normal Map 节点；纹理路径相对本目录。移动或交付时整个目录一起带走。
- `before.png`／`after.png`：同镜头、同灯光的 CPU 预览。相同材质在不同受光位置也可能看起来不同；“左墙保持”指作者参数、纹理与绑定不变，不承诺全局照明下逐像素不变。

## 采用与验收

需要重复改规则砖缝、条带等结构且项目已有 Blender 时，可直接借这个“同一节点结构→通道→目标对象”的做法；已有合格扫描材质就沿用，不为示例重建。对复杂磨损、木纹或涂层，先选有相应语义的成熟源，不把 Brick 节点当通用材质生成器。导入 Unity／UE 前仍按目标 shader 转槽、法线方向、mip 与采样规则，再在目标灯光和设备下验。

2026-10-25 UTC，实际烘焙、重载 PNG、两幅 CPU 渲染与保存重开完成，作者已看预览。6 项回归真实启动 Blender：正常源／图像／消费者；仅 roughness 二改保颜色与 normal（256²及64²窄缝）；缺输入；非法参数（含 NaN）；已有输出不得覆盖；缺纹理必须失败。正常检查核六张图尺寸、roughness 数据值、normal 的方向变化／近单位长度、共同结构引用，以及右墙独立绑定和可移动相对路径。尚未验证无缝平铺、重新打光／多视角、Unity／UE、GPU、最低设备预算或玩家审美。

制作选择与其他参数源比较见 [PBR 模块](../../domains/game-dev/assets/materials.md#pbr-production)，Material Maker 版本与实际运行范围见 [WP5](../../docs/research/2026-10-14-game-wp5-material-effects.md#二pbr一致性失败判别与程序能补多少)。
