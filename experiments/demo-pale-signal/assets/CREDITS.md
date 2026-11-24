# 素材署名

## 地形与卫星影像

| 本地文件 | 来源与署名 | 加工 |
| --- | --- | --- |
| `alpine.r16` | Geographx 和 Toitū Te Whenua Land Information New Zealand，New Zealand Contour-Interpolated 8m DEM，BX15、BX16、BY15、BY16。[来源与许可元数据](https://nz-elevation.s3-ap-southeast-2.amazonaws.com/new-zealand/new-zealand-contour/dem_8m/2193/collection.json) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 裁切、旋转、缩放、重采样和量化。岸架、桥台和近处峡谷为游戏中的人工地形。 |
| `alpine-ortho.jpg` | Contains modified Copernicus Sentinel data 2024–2025, produced by the European Space Agency and processed by Toitū Te Whenua Land Information New Zealand. Planet 为数据集元数据列示的许可方。[来源与许可元数据](https://nz-imagery.s3-ap-southeast-2.amazonaws.com/new-zealand/new-zealand_2024-2025_10m/rgb/2193/collection.json) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | 裁切、旋转、重新投影、缩放和压缩。游戏中与岩面纹理和积雪材质混合。 |

## 扫描材质、岩石和环境光

下列 Poly Haven 资源采用 [CC0 1.0](https://polyhaven.com/license)。HDRI 用于环境照明、反射和部分天空云层。天空还叠加实时生成的云、光和天气变化。

| 资源 | 作者 |
| --- | --- |
| [Asphalt Snow](https://polyhaven.com/a/asphalt_snow) | eye-candy.xyz |
| [Metal Plate](https://polyhaven.com/a/metal_plate) | Rob Tuytel |
| [Rusty Painted Metal](https://polyhaven.com/a/rusty_painted_metal) | Amal Kumar |
| [Concrete Wall 006](https://polyhaven.com/a/concrete_wall_006) | Dario Barresi、Charlotte Baglioni |
| [Snow 04](https://polyhaven.com/a/snow_04) | Rob Tuytel |
| [Denim Fabric 04](https://polyhaven.com/a/denim_fabric_04) | colormass、Rico Cilliers |
| [Winter Lake 01](https://polyhaven.com/a/winter_lake_01) | Sergej Majboroda |
| [The Sky Is On Fire](https://polyhaven.com/a/the_sky_is_on_fire) | Greg Zaal。使用云层部分，调整色温和地平线。 |
| [Wasteland Clouds (Pure Sky)](https://polyhaven.com/a/wasteland_clouds_puresky) | Jarod Guest（纯天空加工）、Sergej Majboroda（原始摄影）。定向重制版的天空穹顶。 |
| [Kloppenheim 06 (Pure Sky)](https://polyhaven.com/a/kloppenheim_06_puresky) | Greg Zaal（原始摄影）、Jarod Guest（纯天空加工）。`kloppenheim_06_puresky.hdr` 用于本轮天空，重新配准太阳方向、色温和云层。 |
| [Workshop](https://polyhaven.com/a/workshop) | Dimitrios Savva、Jarod Guest。用于机房材质的环境反射。 |
| [Boulder 01](https://polyhaven.com/a/boulder_01) | Rico Cilliers。按空间与贴图坐标简化为两级岩石网格，沿用扫描材质。 |
| [Portable Generator](https://polyhaven.com/a/portable_generator) | James Ray Cock |
| [Metal Office Desk](https://polyhaven.com/a/metal_office_desk) | Ulan Cabanilla |
| [Tool Cart](https://polyhaven.com/a/tool_cart) | Savva Zakharov |
| [Old Military Crate](https://polyhaven.com/a/old_military_crate) | Jack Mava |
| [Utility Box 02](https://polyhaven.com/a/utility_box_02) | James Ray Cock |
| [Concrete Road Barrier 02](https://polyhaven.com/a/concrete_road_barrier_02) | Amal Kumar |

远近岩面还采样 ambientCG 的 [Rock 010](https://ambientcg.com/view?id=Rock010) 色彩和位移图，使用 [CC0 1.0](https://docs.ambientcg.com/license/)。

## 角色网格

`gloves.json` 使用 [MakeHuman Community 基础人体网格](https://github.com/makehumancommunity/makehuman/blob/v1.3.0/makehuman/data/3dobjs/base.obj)以及同版本 `default.mhskel` 和 `default_weights.mhw` 的手部关节与蒙皮权重。根据项目的[美术资产许可](https://www.makehumancommunity.org/about/license.html)，这些核心资源采用 CC0。手部经过裁切、细分、手套增厚、重新铺设材质与接触动作绑定。

## 脚步录音

| 本地文件 | 来源与署名 | 加工 |
| --- | --- | --- |
| `audio/snow-dry.wav` | [Footsteps snow crunchy close.wav](https://freesound.org/people/lwdickens/sounds/261222/) · lwdickens · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 从公开预览提取、裁切为十种落步，转为单声道并统一峰值。 |
| `audio/metal-floor.wav` | [Footsteps on Metal](https://freesound.org/people/IENBA/sounds/698697/) · IENBA · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 从公开预览提取、裁切为七种金属踏步，转为单声道并统一峰值。 |
| `audio/solid-floor.wav` | [Footsteps On Tile](https://freesound.org/people/IENBA/sounds/834027/) · IENBA · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | 以公开预览加工七种硬地踏步，用于混凝土地面。 |

其余站房、天线、设备、缆车、武器、巡检机、标识、其余音效和音乐由游戏代码生成。可选电台语音在玩家设备上使用浏览器提供的本地语音。
