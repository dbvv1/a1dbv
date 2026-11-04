# B-STAR-FIXED-CAPTURE-20261104 · 本机三机位软件 WebGL2 基线
id: B-STAR-FIXED-CAPTURE-20261104
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 0bd62df9be7528cc9da643ebde089063d6166da8
result_branch: relay/b-star-fixed-capture-20261104

## 目标
取得 Star 当前正式公路的三张可复拍场景基线，供风格化目标图与材质整层对照。每机位独立双拍，运行现有 capture 内置的 WebGL2／非背景像素／浏览器错误 smoke；本轮只排本卡，交回后 dot 再排 FPS、MOBA。
固定源码 SHA 如上，tree 为 `f1dd5ca84c725b78bd9b8d5163368708eaae8e95`。本轮不改源码或玩法，不启用旁置，不恢复旧拍摄／材质卡；目标输出与历史任务完全分离。

## 按哪个 Skill／规格
按 a1dbv `463b4b9a95a8e6eadb98b730d8aa373a05dcbec0` 的游戏细则 §7、game-quality-pass/references/capture.md，以及固定 Star 源的 docs/capture.md、capture-presets.mjs、tests/capture.mjs、tests/smoke-launch.mjs。
接收器开工先核本卡原调用、同题活跃写者及本轮目录；同卡／同目录已有实际调用就续核原调用，不重复启动。共享 A 的缺回执只隔离对应调用，不挡本卡排队；未合产物不设数量上限。旧调用、未知进程与保留工作树不动；只在实际同题占用／输出冲突时暂停对应执行。
只允许独立 headless Chromium：无可见窗口、不接用户浏览器、不操作桌面或系统／页面键鼠。输入由游戏内部 `road-tour` 驱动，不调用需要键鼠的 smoke 或 smoke:backlog，不播放音频。
复用已安装的 Node.js 24、Python 3、Chromium 及与两份 package-lock.json 匹配的依赖；不安装或升级本机软件／浏览器，缺项回报精确入口。允许复用已安装依赖，不改锁文件。
在新独立 worktree 精确 checkout 固定 SHA，保留 Git 原始 LF 字节；核 HEAD/tree 与 tracked clean。用默认构建配置运行 `npm run build`，构建后再次核 tracked clean，记录 Worker 与 road bundle SHA-256；有差异先回事实，不改文件使其假装一致。
默认构建值固定：DRIVING_MODEL=road、COAST_FLOW=baseline、SIGNBOARD_VARIANT=baseline、SKY=kenney、COAST_AMBIENCE=off、RAIL_SOURCE=kenney、DRIVING_AUDIO=procedural、CANVAS_HOUSE_ANCHORS=off（变量均带 STAR_RUSH_ 前缀）；不继承其他候选值。
启动且仅启动一个 `node tests/smoke-server.mjs`，取它实际打印的 `STAR_SMOKE_LOOPBACK` 为 BASE（127.0.0.1 随机端口），不猜固定端口、不访问生产站。每张图的实际完整 URL 写入 manifest。
渲染档固定 SwiftShader：实际 Chromium argv 必须同时包含 `--no-sandbox`、`--enable-unsafe-swiftshader`、`--use-angle=swiftshader` 与 headless；保留 Playwright 默认参数、外层沙箱不动。不加 GPU/D3D11 档，不换 renderer 重试。
只在本进程环境用 STAR_RUSH_CAPTURE_CHROMIUM 指向已安装 Chromium，绝对路径只留本地；三机位使用同一个二进制与版本。viewport 和内部 PNG 均为 1280×720，DPR 1，高画质、Mint Comet、练习、无幽灵、静音，60 Hz 虚拟时钟、12 帧静态预热。

| 顺序／机位 | URL 路径与全部参数 | 相机与视场角 | 独占输出子目录 |
|---|---|---|---|
| 1 coast-chase | `/road?shot=coast-chase&seed=73121&t=28&frames=1&input=road-tour` | 原追尾 camMode=0，后距 8.5 m／高 4.5 m，FOV 62° | `coast-chase` |
| 2 coast-full-bend | `/road?shot=coast-full-bend&seed=73121&t=28&frames=1&input=road-tour` | 样条 eye=(480,130,100)，target=(460,-55,0)，FOV 58° | `coast-full-bend` |
| 3 academy-depth | `/road?shot=academy-depth&seed=95276&t=14&frames=1&input=road-tour` | 原追尾 camMode=0，后距 8.5 m／高 4.5 m，FOV 62° | `academy-depth` |

`environment`／`handling` 参数不出现，两项旁置关闭。样条三元组是沿路／横向／道路上方米数；两追尾机位使用固定源 race.js 的方向／速度前馈及阻尼，不能另设相机。每帧保留实际 eye、target、origin、fov 和车辆状态。
独占输出根写死为 `outputs/B-STAR-FIXED-CAPTURE-20261104/0bd62df9-swiftshader`；父目录可创建，此根目录和三子目录须此前不存在。已有目录时先核本卡原产物，不覆盖、不另起第二轮。
按表串行运行 `npm run capture -- "BASE/road" "ROOT/子目录" 机位 --seed 种子 --t 秒数 --frames 1 --input road-tour --repeat --software`，BASE/ROOT 与各字段仅替换为上面固定值；每个命令实际退出后才开始下一机位。
首次失败保存该次报告与退出情况，停止本轮剩余拍摄并交回断点；不换参数、浏览器、机位或补拍掩盖失败。正常结束后关闭本次确知归属的预览，不清未知锁、不终止其他进程。

## 写入范围
游戏源码、配置、锁文件、正式素材只读；允许本次确定性构建及独占 outputs 中的 PNG、JSON、命令日志和退出记录。接收前不改 master、不部署。
仅在 result_branch 新增 `docs/quality/capture/B-STAR-FIXED-CAPTURE-20261104/` 下的三机位原图、每机位含两轮 runs 的 report.json、逐帧元数据、manifest 与简短结果说明；任务卡只回当前结果，不上传桌面截图。
公开副本保留 renderer／vendor 原字符串、Chromium 版本、规定参数、相对文件名与哈希；删除机器用户名、绝对路径、完整 argv、wsEndpoint、nonce、凭据及私人日志。脱敏字段注明；不把公开副本说成未改动的原日志。

## 怎样算做成
三机位各两次真实 `__shot.ready`，backend=webgl2、1280×720／DPR 1；PNG 非空且非背景，双拍像素哈希与相机／车辆状态一致；每次 report.passed=true、浏览器错误为空、命令 exit 0。PNG 是场景画布，不含 DOM HUD。
manifest 逐机位列实际完整 URL、固定 commit/tree、构建 hash、seed/t/tick/input、渲染档、原始 renderer/vendor、software 分类、Chromium 完整版本、PNG 尺寸／像素与文件 SHA-256。没有 renderer 或版本就保留缺项，不能宣称完整基线。
交开始／结束 UTC、各命令实际退出码、各自有 Node／Chromium／预览进程的归属与退出事件、监听端口关闭事实，以及未知项。正常 close 返回或 PID 不存在不单独冒充完整调用结束；仅检查／关闭本轮已知归属资源。
先回实际拍摄结束时间、退出码与清理结果，再整理图和报告；清理未确认就只停本调用的后续，不另开相同任务。独立审查只读现有产物，不另启第二个浏览器重复拍摄。
发布前对实际新增文件做公开扫描、diff 空白和 noreply 身份检查；扫描通过后只推 result_branch，回 review_ready。失败保留原失败证据。dot 按图接收；本卡 smoke 不等于完整整局、硬件性能、驾驶手感或画面判优。

## 当前结果

- 原调用、工具或已登记进程尚未确认结束，保留产物与原调用身份，由维护者核清并解除本地隔离后接续；不自动重派。
