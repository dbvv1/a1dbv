# P123：压缩文件能加载，动作时间仍可能改变

**结论：继续保合格EXT交付；确需KHR时固定加载器与decoder，并把动作时轴与解码成功分开验。** 本次真实小样中，gltfpack默认动画处理改变clip时长；只关闭重采样便恢复原时长并保住两轮局部修改。[本仓运行，2026-10-23]
**范围：官方RiggedSimple → gltfpack → Three GLTFLoader／AnimationMixer／SkinnedMesh的CPU路径。** 未运行浏览器、GPU或游戏引擎，没有视觉接收。[本仓运行]
**入口：[脚本](p123-meshopt-consumer.mjs)、[固定依赖](p123-package.json)／[锁](p123-package-lock.json)、[实际结果](p123-meshopt-results.json)。** 不接入默认离线入口，不自动下载模型。[本仓运行]

## 输入、权利与版本

[Khronos样例固定许可](https://github.com/KhronosGroup/glTF-Sample-Assets/blob/15cd02d304e54cb42a4db4eefe719f76190f4b68/Models/RiggedSimple/README.md)：©2017 Cesium，CC-BY-4.0；源署名、许可链接与修改说明随派生品保留。该GLB无贴图，含一材质、两个骨骼、一个动画；不以代码MIT替代资产许可。[一手／本仓运行]

固定输入15104B，SHA256 `3a79dabb67bb0cd598a18d08b954d9d357c27c30672f82ef5d3f4e7fe6ca3401`。编辑母版是未压缩GLB图，不是原DCC文件；本仓不分发第三方模型或依赖。[本仓运行]

Node24.19.0、npm11.9.0；gltfpack／meshoptimizer1.3.0、Three0.186.0、旧消费者0.182.0、glTF-Transform core4.5.1。旧包通过npm alias隔离，并检查其GLTFLoader实际解析自身Three模块，避免旧loader混新core。[本仓运行]

## 实际结果

| 路径 | 真实消费者结果 | 与源比较／选择 |
|---|---|---|
| EXT `-cc`、KHR `-cz`；新loader＋decoder | 均解码、建立蒙皮网格与动画；5800／5496B | 基线时长从2.083333015s变2.108333349s，增加约25ms；不能仅凭加载成功接收 |
| 只加 `-af 0` | EXT5764B、KHR5456B；时长与源相同 | 关闭重采样是本题恢复分支，不强制所有动画关闭重采样 |
| 旧loader＋decoder，EXT | 正常加载 | 保已兼容EXT，不为新扩展名称迁移 |
| 旧loader＋decoder，KHR无fallback | 先警告未知KHR扩展，再在FileLoader解析空URL时失败 | 本Node输入失败层是缺可用fallback；不是所有浏览器必报相同错误 |
| 新loader缺decoder，required EXT／KHR | 原生报`setMeshoptDecoder must be called…` | 在调用前配套decoder；不靠删required标记修复 |
| `-ce khr -cf`真实fallback，新／旧loader均不配decoder | 两者均加载；GLB5728B＋fallback5212B，共10940B | 回退有实际体积成本，且仍保留默认时长变化，不等于源动画无损 |

所有压缩命令另带`-kn -km -ke`。`-cz -cf`第一次调用被工具明确拒绝：`Option -cf can not be used together with -cc`；采用帮助文本支持的`-ce khr -cf`，没有手改压缩字节或伪造fallback。[本仓运行]

**二改：** R1把唯一材质基础色改为`[0.8,0.1,0.2,1]`；R2在同一源图上累计保R1、把共享动画时间accessor只缩一次至0.8倍，再派生。保时点EXT分支两轮均保色、金属度、骨名／三角数与采样动作；R2时长为1.666666389s。本题不额外搭三成员资源族，也不重复WP3§16的共享引用复制对照。[本仓运行]

## 怎么测，不能推出什么

- 使用真实GLTFLoader解码与建立对象；真实AnimationMixer逐时刻更新，SkinnedMesh.getVertexPosition计算蒙皮，再乘世界矩阵。没有替身glTF几何解析器。[本仓运行]
- gltfpack会重排顶点，故每帧比较两个世界空间顶点集合的**双向最近邻最大距离**，不是按数组下标、也不是平均值。三角数188、骨骼名另核；轨数3→1是常量轨省略，本身不判失败。[本仓运行]
- 两套各61个采样：①各自clip归一相位；②同一源clip的绝对时间。默认R0最大距离分别0.063998626／0.016853946；单改`-af 0`后两者均0.001854382。时长漂移独立报告，不能把归一相位差全归因量化。[本仓运行]
- 0.01世界单位距离与1e-5秒时长是此夹具的**诊断门槛**，非玩法／美术接收标准，不宣称样例单位就是米。首轮因0.063998626超门槛停止；保留该观察后才按`-af 0`做单变量恢复，未放宽阈值。后续脚本记录默认失败并检查恢复；`loaded-and-compared`只表示完成比较，须另看`diagnosticPass`。[本仓运行]
- 有限顶点集合不覆盖完整曲面、法线、骨骼权重语义、任意时刻或自然变形；未测纹理、morph、LOD、帧率、GPU或最终观感。静止／中间／末尾采样也不能替代接触与轮廓观看。[研究]
- Node适配仅补进度事件`ProgressEvent`，并把工具实际写出的fallback文件转data URI交给原生FileLoader；不伪造资源内容。缺失fallback空URI仍交给原生FileLoader失败。错误记录区分load与semantic阶段，且保留警告。[本仓运行]

## 复跑

在已有临时目录放入脚本、package与lock（后二者去`p123-`前缀）。从下列固定URL取得输入并先核上方大小／hash，保署名；不将其混入产品资源包。[研究]

```sh
curl -fL -o RiggedSimple.glb https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/15cd02d304e54cb42a4db4eefe719f76190f4b68/Models/RiggedSimple/glTF-Binary/RiggedSimple.glb
npm ci --ignore-scripts --no-audit --no-fund --cache ./npm-cache
node p123-meshopt-consumer.mjs RiggedSimple.glb
# 缺输入应非零；修改输入bytes或hash同样应拒绝。
node p123-meshopt-consumer.mjs
```

运行写派生GLB／fallback与结果JSON到当前临时目录；不改输入。脚本不联网，fallback路径只允许本次已知文件；处理器每次30秒超时。缺输入与错误输入已实际非零；首次npm查询因默认缓存目录不存在失败，改到可写临时缓存后成功，不需额外权限。[本仓运行]

探索回执：接续WP3既有资产二改与消费者研究，只补当前官方发布版／固定源码、Khronos规范及真实本地消费者；没有另做社区采用率调查，也没有质量冠军结论。[研究，截止2026-10-23]

依据：[gltfpack1.3源码](https://github.com/zeux/meshoptimizer/blob/v1.3/gltf/gltfpack.cpp)、[1.0发布说明](https://github.com/zeux/meshoptimizer/releases/tag/v1.0)（KHR选项与v1码流最低decoder0.23）、[r182源码](https://github.com/mrdoob/three.js/blob/r182/examples/jsm/loaders/GLTFLoader.js)、[r186源码](https://github.com/mrdoob/three.js/blob/r186/examples/jsm/loaders/GLTFLoader.js)。KHR规范读取时仍为Release Candidate；若目标消费者不支持，回EXT／未压缩；动作时轴不可保留就退回源并停止该配置，而非继续追求文件最小。[一手／研究]
