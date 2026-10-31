# B-STAR-ROAD-MATERIAL-FAMILY-20261030 · 风格化公路整层材质消费者
id: B-STAR-ROAD-MATERIAL-FAMILY-20261030
owner: dot-B
kind: build
status: cancelled
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: ab69388d8fe7e30c025e3d8ead5e1923adb1794b
result_branch: relay/b-star-road-material-family-20261030

## 目标
先推进赛车：把风格化道路、路肩挡墙、护栏、住宅/站体的统一材质族接进现有公路消费者，而不是只交素材文件。只做独立 `road-materials=coherent-v1` 候选，默认关闭；不取用、合并或重传原轮胎与海岸空间待确认上传，原任务保持原状。已有车体/轮胎作同框尺度参照，不增加车辆、赛道、角色或系统。

## 按哪个 Skill 或规格
按 a1dbv main 的 game-content-production §2–5、game-quality-pass §3–4、游戏细则§7及 operations §2.2–3；2026-10-30 用户要求赛车优先、材质素材整层制作。开工固定实际读到的 Skill SHA。
接收端先核自身真实调用、全局停止条件和槽位；同目标活跃只读进展，停止未确认、归属不明或无安全独立槽则 blocked，不清锁、不抢占、不重启旧任务。不得启动本机浏览器、GUI、键鼠、GPU或原云；Blender只无界面CPU建模/导出，不渲染游戏截图，不购买或部署模型。
从固定基线独立 worktree 开始；若目标已有他人新实现先对照，禁止覆盖。当前公路 build 使用 Lambert/半球光0.7，legacy 为 Toon；保留受光路径，不改成 Standard 或另添光照。
`road-materials` 仅一个值为 `coherent-v1` 且公路模式才启用；缺省、未知、重复和 legacy/Canvas 均保原行为。不改变镜头、道路布局、碰撞、车辆物理、随机消费、存档与赛程。
材质族固定为 asphalt、shoulder-stone、plaster、guard-metal；沿现有明确来源标记面组，不通过颜色猜材质。标线、招牌、窗、屋顶、车体和植被不套墙纹。覆盖 coast-chase/coast-full-bend/academy-depth 所有可见同族；不能只改一个墙片或拍摄专用对象。
保留 engine 的10浮点 sourceData及 sourceIndices；增加独立按顶点UV/族标签侧带并验证长度，不改原几何/变换。道路按弧长/横向距离生成连续UV（4米重复），墙/挡墙按原局部面坐标4米重复；实例不同位置保持物理纹素尺度。Three批次键包含材质族、纹理版本和透明度，禁止不同族串材质；保原实例化。
材质为 Lambert 颜色贴图，sRGB、Repeat、mipmap和线性过滤；制作目标不烘焙阴影/高光、不增发光或额外后处理，输入图尚未验证为无光照albedo或无缝，必须保留这个限制。四族可共享少量实际纹理，不能按实例复制。dot已制作原始AI材质与二改，素材发布仍待原工具允许；当前不得取不存在的远端ref、重传或经本卡转交该批文件。文件尚不可用时manifest标 missing，用原色回退，仅合成小图测试接口（明确synthetic），不能冒充真实AI图或整层交付。先完成不依赖文件的消费者、Blender源与CPU验证；dot核实原上传成功后同卡续接固定素材ref，不另派卡。
素材原本地 commit `0385bc35a08e7ce9f603e0126b68494cbe8b07d4` / tree `85c9b108944b3bac93e02f3eba3130745c797bbf`，不是已发布ref；预留 `assets/road-materials-v1/runtime/asphalt-v2.webp`（SHA256 `5dc61ae5cf0fc10240b43ef3598c1c55119370dadec85daf67b2c924008d3bad`）与 `runtime/plaster-wall-v1.webp`（同目录，SHA256 `0dd180beac5074bf2ba6097f9a49e1583b4f150cc6d295e53b989f170440c561`）；均1254平方，4米重复意图，无缝/无光照/游戏收益未验。不要覆盖待供的source/runtime/manifest；本卡自有合同另存consumer-contract.json。
沿已有 tests/scene-authoring.mjs/.py 的源几何导出/轴变换方式，新建无界面 Blender 脚本与导出合同：5标准件为路面+原标线、路肩挡墙、护栏、住宅/站体墙屋顶、既有主车轮胎参考。引用现有尺寸/坐标，不凭空换建筑或车；导出保现有几何边界，仅提供同族材质/UV编辑源。
标准件与运行消费者共享同一style/manifest；做一次整体色板或重复尺度二改并重导，验证非临时手修。Blender近似材质不冒充Lambert游戏图；有界几何归一与数组比较可CPU验，视觉同框待云端。
纹理manifest须有族、文件、尺寸、哈希、来源/许可与实际/缺失状态；资源只在候选加载，成功/失败/迟到完成/销毁/重开均有明确所有者。失败保原色，销毁所有成功加载资源，不抛未处理异步错误。

## 写入范围
仅 Star-Rush-Reborn：`engine.js`（侧带元数据）、`render-three.js`、`render-init.js`、`circuit.js`、`scenery.js`（族标记）、`build.mjs`（现有资产路由与模块接线）；新增 `road-materials.mjs`、`road-material-assets.mjs`、`assets/road-materials-v1/`、`authoring/road-materials/`、`tests/road-materials*.mjs`、`tests/road-materials*.py`；必要时只在 `package.json` 加对应CPU测试入口。
允许在现有 `docs/quality.md` 用一段验收结论写实际接入/缺项；不得另开历史记录页或更正单元。不改 `racer.js`、`road-vehicle-core.js`、`vehicle-core.js`、`handling.js`、导航/赛道点位、相机、Capture输入时序、旧资源或原待确认分支；不改接收器/调度。只推本卡结果分支，不用 accept:auto，不合默认、不部署。

## 怎样算做成
生产公路和固定机位共用消费者，三机位同族覆盖由现有场景清单/实例与材质分配CPU检查证明；缺AI文件明确返回fallback，不能凭manifest存在通过“素材完成”。记录真实覆盖族/实例数和未覆盖原因，不新建快照表。
CPU测试必须覆盖参数缺省/未知/重复/legacy关闭、开关off原顶点/索引/颜色/随机序列不变；侧带长度/有限值/跨路段UV连续/实例尺度；标线窗屋顶不染色；族批次隔离；单次纹理缓存；加载失败/部分成功/迟到销毁/重开释放；完整原有测试、构建与模拟回归。
标准件脚本可重跑，导出尺寸/轴心/三角面/材质引用有机器核对，第二次统一修改只改变声明的材质/UV，不改原游戏几何/碰撞。缺Blender时保存精确脚本与可跑CPU部分，标明未导出，不声称做成。
非作者代码审查、公开扫描、适用门禁通过后推结果分支、回 review_ready，固定提交与可复跑命令。只一份验收结论；模型自报、排队与状态不是执行证据。
真实浏览器smoke、全部三机位前后图/标准件同框和两名非作者评判由dot后续做，本机不代跑。完整门槛后旁置交付；两非作者均选新版且可读性不退才换默认、旧版旁置；本卡CPU通过不等于画面判优或品质结项。

## 当前结果
认领后已超过两小时，尚无可核产物或实际执行心跳；真实执行时长与退出状态未知。现按原取消协议请求接收端安全停止本卡自有调用，保留已有输出，并回传实际退出、残留资源清理及已有产物。cancelled 仅表示停止请求，不证明进程退出，不是品质结项；不自动恢复 ready、不重派、不触碰其他任务或待确认上传，待原回执后由负责人决定本卡如何续接。
