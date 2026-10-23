# P124：按槽压缩、真实 CPU 转码与材质二改

核实：2026-10-23 UTC。基线 `3bcf5cf1b21978f334329f79f3b33e5640866031`；启动13:26 UTC。这是离线资源交付实验，不是生成模型、浏览器、GPU、Unity／Unreal或视觉验收。[本仓运行]

**最有用的发现不是“压得更小”，而是数据图的 PNG 元数据会让成功的转换悄悄改值。** 原始 ARM 图自带 gamma=0.45455；KTX 4.4.2 导入为 UNORM 时，未指定 transfer 与显式 convert-to-linear 都改变样本，assign-linear才逐字节保留。另一个取舍是：本例 UASTC 的数据误差更低，却要约7–9倍的文件体积，不能只写“采用高质量压缩”。[本仓运行]

## 来源与许可

- [Poly Haven Brick Wall 001](https://polyhaven.com/a/brick_wall_001)，摄影Dimitrios Savva、处理Rob Tuytel；资产按[CC0](https://polyhaven.com/license)。[官方文件API](https://api.polyhaven.com/files/brick_wall_001)列出Diffuse、Normal(GL)、AO/Rough/Metal。仅取三张1k PNG，约5.43MB总源，不下载整库，不在仓库分发图像。
- [KTX-Software 4.4.2 官方Linux包](https://github.com/KhronosGroup/KTX-Software/releases/download/v4.4.2/KTX-Software-4.4.2-Linux-x86_64.tar.bz2)，SHA256 `a8781bad05f9624edbf910b7f258cd0a4ba7d3e63b49ecc0a0ab440bf6a0a245`。主项目Apache-2.0，第三方组件另见[该版本许可证](https://github.com/KhronosGroup/KTX-Software/blob/v4.4.2/LICENSE.md)，不概括整个发行包同一许可。
- npm固定`three@0.186.0`、`pngjs@7.0.0`、`ktx-parse@2.0.0`，见相邻package与lock文件；实际WASM是Three包内的官方Basis transcoder。原生提取与WASM是不同执行入口，底层同属Basis实现，不称独立算法验证。
- 源文件完整SHA256、字节数、PNG gamma及512基线SHA在[回执](p124-texture-results.json)。源Diffuse和ARM的gamma均为0.45455，Normal没有gamma；脚本读取储存值，不调用`PNG.adjustGamma()`。

## 先固定输入，再比较编码

[脚本](p124-texture-consumer.mjs)核三张1024²原图的哈希，生成唯一512²基线和完整10级mip：2×2 box平均，颜色先按精确sRGB函数转线性光、平均后编码；ARM直接按线性数值平均；GL法线先转[-1,1]向量、平均并归一后重新量化。逐级重复到1²，所有mip显式交给编码器，不让不同编码路线自行生成不同mip。[本仓运行]

这是受控对照配方，**未验证降采样、法线方差／粗糙度补偿、mip接缝或远景观感达到生产质量**；不把1024→512的损失归给压缩。box分组不会跨图界采样，不声称等同生产用的wrap重采样滤波；另用工具自动生成mip时，4.4.2默认边界为clamp，平铺输入需按目标核`--mipmap-wrap wrap`。[本仓运行／一手：该版`ktx create --help`]

- ETC1S：`--encode basis-lz --qlevel 128 --threads 1`。
- UASTC：`--encode uastc --uastc-quality 2 --zstd 18 --threads 1`，不启RDO，也不启`--normal-mode`。
- 每张图显式指定`--assign-tf srgb|linear`与对应RGB格式；颜色primaries=bt709，数据=none。命令配方完整见脚本；逐调用记录仅写本地raw JSON，无隐式优化组合。[本仓运行]

## 结果：体积、数值和消费者分别说

下表文件均包含10级mip；误差相对该槽512基线，取**RGBA8 CPU转码后的level 0**。它不是BC7再次解码后的误差，更不是显示质量阈值。[本仓运行]

| 图／编码 | KTX2文件B | 诊断（低更接近输入，不代表视觉达标） |
|---|---:|---|
| Diffuse ETC1S | 55,135 | 线性光RGB RMSE 0.02086／0.01182／0.01280 |
| Normal ETC1S | 43,014 | 法线角误差mean 9.74°，p95 29.40° |
| Normal UASTC | 313,701 | mean 2.37°，p95 6.55°；文件约7.29倍 |
| ARM ETC1S | 30,985 | R/G/B RMSE 0.03571／0.02641／0.00939 |
| ARM UASTC | 278,139 | R/G/B RMSE 0.00466／0.00545／0；文件约8.98倍 |

本例三图全ETC1S合计129,134B；颜色ETC1S＋数据UASTC为646,975B。选择仍需目标画面、加载预算和设备验证；不能从这一组宣称UASTC绝对赢家，或推广成所有生成贴图的质量排序。ETC1S让本来全0的金属B通道出现误差，本例材质metalness=0维持砖墙非金属；不据此宣称任意金属材质接收合格。[本仓运行／研究]

五份KTX2均通过`ktx validate`；真实WASM逐级转RGBA8及BC7成功。原生`ktx extract --transcode rgba8`与WASM的level 0 RGBA逐字节相等。每图BC7全mip输出349,552B、RGBA8全mip1,398,100B：这是CPU输出缓冲区字节；**未创建GPU，不能当显存驻留、上传耗时或帧率实测**。没有按设备调用`detectSupport`，也没有运行浏览器`KTX2Loader`、GLTFLoader或实际PBR shader。[本仓运行]

## 两条实际工具陷阱

### 数据源有gamma，DFD为linear也不够

直接对原1024² ARM做不压缩、不缩放的`ktx create --format R8G8B8_UNORM`及原生extract：

| transfer参数 | 对原始储存值的R/G平均绝对误差（0–1） | 结果 |
|---|---:|---|
| 不指定 | 0.094321／0.095432 | 成功但数据已变；有gamma转换warning |
| `--convert-tf linear` | 0.094321／0.095432 | 同样改变数据，不是“标注线性”的替代 |
| `--assign-tf linear` | 0／0 | 本固定源逐字节保留 |

三份输出DFD都是linear。故只检查容器标签会漏掉这次变化；按已知槽语义解释源，不按扩展名或元数据猜。这个观察来自实际源／工具，不是预先植入的错误输入；只证明此源与KTX 4.4.2组合。[本仓运行]

### normal-mode改变了shader契约

4.4.2的`ktx create --help`明确说明normal-mode将XYZ输入改为X存RGB、Y存alpha，由shader重建Z。额外一次512单级UASTC编码后，按普通RGB XYZ解释的角误差mean 81.37°；X与alpha中的Y平均误差约2.92／3.00个8位值。压缩后RGB并非严格相等（最大通道差68），所以这不是无损通道复制或已经正确重建法线的证明。[一手／本仓运行]

本例继续使用默认RGB法线消费者，不加该开关、不改shader。保留此失败诊断，不声称normal-mode本身有缺陷。完整原始帮助留运行工作区；公开回执固定版本、参数和观测，官方源码可按[v4.4.2](https://github.com/KhronosGroup/KTX-Software/tree/v4.4.2)复核。

## 二改与失败输入

把真实BC7转码块装入Three `CompressedTexture`，再绑定真实`MeshStandardMaterial`CPU对象；这一步不执行渲染。两个墙面材质初始共享贴图：R1对目标按需clone纹理对象，将所有槽repeat从1改2，保AO／roughness／metalness仍共享同一ARM对象；R2保R1，只将roughness因子设为0.65。它是对贴图G通道的乘法因子，不改写图像，不声称已经跑过shader。[本仓运行；[Three r186 roughness shader契约](https://github.com/mrdoob/three.js/blob/r186/src/renderers/shaders/ShaderChunk/roughnessmap_fragment.glsl.js)]

逐项断言目标颜色空间、wrap、offset、rotation、UV channel、metalness、normalScale、normalMapType及块字节保留；对照材质全快照不变，源图哈希仍不变。未验证实屏纹样尺度、跨面接缝、UV方向、光照或brick真实尺寸。[本仓运行]

预设计负对照另列：只改颜色槽repeat、把数据图标sRGB、共享纹理原地改、截断KTX2均被对应诊断拒绝；缺源文件返回非零。它们是回归，不包装成真实用户失败。另实跑脚本缺参数入口须非零，不自动下载或猜源。[本仓运行]

## 独立复跑

在仓库外临时目录执行；只需Node 24与官方KTX CLI，不要把依赖／源图／二进制提交。下面从仓库根开始；自备`curl`、`tar`、`sha256sum`。[操作说明]

```sh
RUN="$(mktemp -d)"
cp experiments/p124-texture-consumer.mjs "$RUN/"
cp experiments/p124-package.json "$RUN/package.json"
cp experiments/p124-package-lock.json "$RUN/package-lock.json"
cd "$RUN"
npm --cache "$RUN/npm-cache" ci --ignore-scripts
curl --fail --location --output ktx.tar.bz2 \
  https://github.com/KhronosGroup/KTX-Software/releases/download/v4.4.2/KTX-Software-4.4.2-Linux-x86_64.tar.bz2
printf '%s  %s\n' a8781bad05f9624edbf910b7f258cd0a4ba7d3e63b49ecc0a0ab440bf6a0a245 ktx.tar.bz2 | sha256sum --check
tar -xjf ktx.tar.bz2
mkdir source
for slot in diffuse nor_gl arm; do
  file="brick_wall_001_${slot}_1k.png"
  curl --fail --location --output "source/$file" \
    "https://dl.polyhaven.org/file/ph-assets/Textures/png/1k/brick_wall_001/$file"
done
node p124-texture-consumer.mjs "$RUN/source" \
  "$RUN/KTX-Software-4.4.2-Linux-x86_64/bin/ktx"
```

输出公开摘要`p124-texture-results.json`与本地明细`p124-texture-raw.json`；后者含逐mip诊断、快照和命令，不提交。源哈希不符会停止，不更新哈希迁就新源。工具单调用120秒上限；本实验不需要账号、凭据、模型或引擎。跨平台编码字节不承诺完全相同；本次重复运行核同机输出哈希，跨平台先核语义与诊断再判差异。[操作说明／本仓运行]


## 验证回执

作者重复运行的五份编码产物哈希及诊断一致。新上下文独审者在另一临时目录全新`npm ci`，独核官方包与可执行文件、原图SHA及API size／MD5后重跑：主入口退出0，原始JSON逐字节一致（SHA256 `2a367cabe95de3d257906574a8464d4ba49f38be32cee9533e9b38e291c79634`）；公开摘要移除逐mip／快照／命令明细，SHA256 `ef88872cff1216e65faf4e7bfa2a3c65f4d0df2281ef358f4567896b1ab61dd3`；另核缺参数及空源目录退出1。独审通过CPU范围；原社区来源的PVRTC／mip因果措辞已按原帖末尾纠正。仓库完整17项离线入口、公开扫描和差异检查通过；这些通用检查不替代上面的外部工具实验，也不证明hosted CI、GPU或视觉。[本仓运行／独立复跑；2026-10-23 UTC]
