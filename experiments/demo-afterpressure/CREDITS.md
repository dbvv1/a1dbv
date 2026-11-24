# 素材来源 / Asset credits

运行时从本项目的 `assets/` 读取以下素材。站房、闸门、关卡配置、角色与武器的几何、动画、特效逻辑和音频均为本项目创作。

| 素材与作者 | 许可 | 本地文件及用途 |
| --- | --- | --- |
| [Rusty Metal 02](https://polyhaven.com/a/rusty_metal_02) · Rob Tuytel | [CC0 1.0 · Poly Haven](https://polyhaven.com/license) | `assets/polyhaven/rusty_metal_02-*.webp`。色彩、OpenGL 法线与 ARM 贴图压缩到 1536 px。用构件局部遮罩表现卷闸、主闸、仪表外壳、涡轮法兰和配电柜的剥落。 |
| [Concrete Wall 009](https://polyhaven.com/a/concrete_wall_009) · Charlotte Baglioni | [CC0 1.0 · Poly Haven](https://polyhaven.com/license) | `assets/polyhaven/concrete_wall_009-*.webp`。1536 px 的浇筑混凝土色彩、法线和 ARM。与程序潮痕、旧化和近景法线混合。r8 大厅墙面和地坪也复用这组贴图。 |
| [Rock Face 04](https://polyhaven.com/a/rock_face_04) · Dimitrios Savva | [CC0 1.0 · Poly Haven](https://polyhaven.com/license) | `assets/polyhaven/rock_face_04-*.webp`。配套 PBR 贴图压缩到 1536 px，按三轴投影用于峡谷基底。 |
| [Namaqualand Cliff 02](https://polyhaven.com/a/namaqualand_cliff_02) · Dario Barresi、Rico Cilliers | [CC0 1.0 · Poly Haven](https://polyhaven.com/license) | `assets/polyhaven/namaqualand_cliff_02.glb` 及同名三张 WebP。保留扫描 UV，简化至约 22,500 三角形，贴图 1024 px。 |
| [Rock 09](https://polyhaven.com/a/rock_09) · Jenelle van Heerden | [CC0 1.0 · Poly Haven](https://polyhaven.com/license) | `assets/polyhaven/rock_09.glb` 及同名三张 WebP。保留扫描 UV，简化至 3,900 三角形，用作岸坡碎石。 |
| [Fir Sapling Medium](https://polyhaven.com/a/fir_sapling_medium) · Rico Cilliers、Rob Tuytel | [CC0 1.0 · Poly Haven](https://polyhaven.com/license) | `assets/polyhaven/fir-sapling-atlas.webp`。从三种原模型和针叶透明纹理各烘焙两个角度，运行时用于峡谷林线。 |
| [Kloppenheim 01 (Pure Sky)](https://polyhaven.com/a/kloppenheim_01_puresky) · Greg Zaal、Jarod Guest | [CC0 1.0 · Poly Haven](https://polyhaven.com/license) | `assets/polyhaven/kloppenheim_01_puresky_2k.hdr`。参与云层明暗、环境光和水面高光。 |
| [Foam 003](https://ambientcg.com/view?id=Foam003) · ambientCG | [CC0 1.0 · ambientCG](https://docs.ambientcg.com/license/) | `assets/ambientcg/foam003-detail.webp`。缩至 512 px 后把泡沫亮度与 OpenGL 法线 XY 打包，作为非均匀水流的微尺度细节。 |

ARM 通道依次为环境遮蔽、粗糙度和金属度。

r9 的排风检修架、吊车、压力仪表、测流桥、巡检机护板、枪托组件与放流效果由本项目的代码生成。继续使用表中的本地授权素材。

r10 的通行证、闸把、流量显示、袖口与织带、近景枝干与针叶、地表草叶、浪形与水滴和战斗反馈由本项目的代码生成。泡沫微纹理继续复用表中 Foam 003，远处林线继续复用 Fir Sapling Medium 图集。
