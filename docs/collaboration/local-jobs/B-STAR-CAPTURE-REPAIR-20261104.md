# B-STAR-CAPTURE-REPAIR-20261104 · 修复后先单机位验图再补全
id: B-STAR-CAPTURE-REPAIR-20261104
owner: dot-B
kind: build
status: cancelled
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 5962a43d851575220a0a67c6a17b5e7b218a4e9c
result_branch: relay/b-star-capture-repair-20261104

## 目标
11-04 用户要求另排修复卡：显式加 `--enable-automation`，渲染档不变，先单跑 coast-chase，确认 PNG 落盘后才跑余机位。
源码修复已在固定 SHA：共享 `tests/smoke-launch.mjs` 已加该参数，capture 重建 args 也继承；本卡直接验证该修复，不重复实现。tree 固定 `2892cc0b4ea668da902740845718781954cf74de`。旧卡失败证据 [48d0c34](https://github.com/dbvv1/Star-Rush-Reborn/commit/48d0c34b5ed8da0f30a323fa9048bcc04866cdb4)保留，不能当基线。

## 按哪个 Skill／规格
按 a1dbv `f2771632e` 的游戏细则 §7、game-quality-pass/references/capture.md，以及固定源 docs/capture.md、capture-presets.mjs、tests/capture.mjs、tests/smoke-launch.mjs。
1. 开工先核原卡 Workflow/CLI 已返回、登记工具结清；检查本卡原调用、同题活跃任务及输出目录。已存在本卡调用/输出则只核原调用，不重复派发或重拍。按原登记身份/创建时间/父链 fresh 核自有 Node、Chromium、第三诊断和旧预览监听的当前状态；若相关调用是否仍活跃或资源归属无法核清，或存在未结工具、同题运行、输出冲突，只将本卡浏览器步骤 blocked。
   旧卡个体 Chromium、第三诊断及预览退出事件有历史缺口，保留 unknown 与旧目录隔离，不从 close 或 PID 消失补推。原调用已结、按上一步核清当前无相关未结调用或冲突资源且本卡输出独立时，可按本新卡执行；不重启旧调用、不清未知锁、不终止其他进程。整轮只运行这一张出图卡。
2. 仅用既有 Node 24、Python 3、同一 Chrome for Testing 156.0.8078.4 二进制和两份锁文件匹配的已装依赖；开工记录版本与依赖匹配。已只读确认 Node 24.22.1 可启动，准确本机路径仅留本地。只在本进程环境将 Node 24 入口用于全部 node/npm 子命令，不改全局 PATH；缺项就交回，不安装/升级本机软件、浏览器、依赖或锁文件。
3. 在新的独立 worktree 精确 checkout 固定 SHA，保留 Git 原始 LF，核 HEAD/tree 与 tracked clean。默认 `npm run build`，前后 tracked clean，记录 Worker/road bundle SHA-256；不得改文件使其假装一致。
   默认构建值固定（均加 STAR_RUSH_ 前缀）：DRIVING_MODEL=road、COAST_FLOW=baseline、SIGNBOARD_VARIANT=baseline、SKY=kenney、COAST_AMBIENCE=off、RAIL_SOURCE=kenney、DRIVING_AUDIO=procedural、CANVAS_HOUSE_ANCHORS=off。清除本进程其他候选值，不改系统环境。
4. 只开一个 `node tests/smoke-server.mjs`，取它实际打印的 STAR_SMOKE_LOOPBACK 为 BASE，不猜端口、不访问生产。只开独立 headless Chromium，不开可见窗口、不接用户浏览器、不用桌面或页面键鼠、不播放音频。输入只由游戏内部 road-tour 驱动，不运行 smoke/smoke:backlog。
   保留 Playwright 默认参数，实际 argv 必须含 headless、`--no-sandbox`、`--enable-unsafe-swiftshader`、`--use-angle=swiftshader`、`--enable-automation`；不改外层沙箱，不换 GPU/D3D11 或浏览器重试。仅本进程用 STAR_RUSH_CAPTURE_CHROMIUM 指向上述已装二进制。
5. 输出根仅为 `outputs/B-STAR-CAPTURE-REPAIR-20261104/5962a43-swiftshader`，此前必须不存在；三个子目录同样不得存在。确认 ROOT 此前不存在后，允许新建父目录及 ROOT 一次；三个机位子目录仅由各自 capture 命令创建。不覆盖旧产物或换根再跑。三机位保持 1280×720/DPR 1、高画质、Mint Comet、练习、无幽灵、静音、60 Hz 虚拟时钟、12 帧静态预热。

| 顺序 | 机位与完整 URL 参数（接 BASE） | 固定相机 | 输出子目录 |
|---|---|---|---|
| 1 | `/road?shot=coast-chase&seed=73121&t=28&frames=1&input=road-tour` | 原追尾 camMode=0，后距8.5m/高4.5m，FOV62° | coast-chase |
| 2 | `/road?shot=coast-full-bend&seed=73121&t=28&frames=1&input=road-tour` | 样条 eye=(480,130,100)、target=(460,-55,0)，FOV58° | coast-full-bend |
| 3 | `/road?shot=academy-depth&seed=95276&t=14&frames=1&input=road-tour` | 原追尾 camMode=0，后距8.5m/高4.5m，FOV62° | academy-depth |

不出现 environment/handling 参数。两追尾机位沿固定源 race.js 的速度/方向前馈及阻尼，不另设相机；样条三元组为沿路/横向/道路上方米数。
6. **先只执行第1机位**：`npm run capture -- "BASE/road" "ROOT/coast-chase" coast-chase --seed 73121 --t 28 --frames 1 --input road-tour --repeat --software`，BASE/ROOT 只替换上述实际预览和固定根。
   必须实际命令 exit 0、report.passed=true、两轮 runs 各有1帧、真实 PNG 文件可解码且非空/非背景、1280×720、像素哈希一致、相机与车辆状态逐项一致，才允许第2机位。先落盘并核验，不凭日志“成功”、CPU测试或CDP通过放行。
7. 第1机位通过后，按表串行用同一 capture 命令跑第2、3机位（替换对应子目录、机位、seed/t）；每条命令及本轮可确定归属浏览器实际结束后才开始下一条。任何首次失败/退出未明即保存证据并停止剩余机位，不加诊断浏览器、不换参/机位补拍、不另起第二轮。
8. 本次每条命令启前保留进程身份/开始时间，wait 后记 exit/signal；仅在本进程加 DEBUG=pw:browser，保存原始启动 PID 和实际退出事件以补足 Chromium 归属链。原始绝对路径/完整 argv/调试端点仅留本地。日志或回执缺项保留 unknown，不把 close 返回、单一 PID 消失或报告代替退出。
   结束时只关闭本轮确知归属的预览，记录其 Node 退出与端口关闭；先回拍摄结束/失败和清理事实，再整理交付。独立审查只读既有 PNG/JSON，不启浏览器复拍。

## 写入范围
游戏源码、配置、锁文件、正式素材只读；仅允许本轮构建和独占 outputs 的图、JSON、命令日志/退出记录。只在 result_branch 新增 `docs/quality/capture/B-STAR-CAPTURE-REPAIR-20261104/` 的场景原图、逐帧 JSON、report、manifest、简短结果；不改 master、不部署、不改旧失败目录或旧卡事实。
公开副本保留 renderer/vendor 原字符串、Chromium 版本、规定参数、相对文件名和哈希，去机器用户名、本机路径、完整 argv、wsEndpoint、凭据及私人日志，并注明脱敏；不上传桌面截图，不声称公开副本为未改原日志。

## 怎样算做成
三个机位各双拍 `__shot.ready`、backend=webgl2、PNG场景画布1280×720/DPR1且非背景，像素与相机/车辆状态重复一致，report.passed=true、错误空、命令exit0；coast-chase 必须先单独达到该门槛。无 renderer/version 或退出证据则明确缺项，不宣称完整基线。
manifest 逐机位记完整实际URL、commit/tree、构建hash及servedBundleSha256、seed/t/tick/input、渲染档、renderer/vendor、software分类、Chromium版本、PNG尺寸/像素/文件SHA256、运行起止UTC和退出/清理证据。保留所有失败，不把本卡当整局、硬件GPU、驾驶手感或画面判优。
公开扫描、diff空白与noreply提交身份检查后，只推结果分支并回 review_ready；dot 按真实图接收。

## 当前结果

- 三机位软件 WebGL2 实拍完成：先单独跑 coast-chase 并以 exit 0、report.passed=true、双轮各 1 帧、PNG 可解码 1280×720 非背景、像素哈希与相机/车辆状态逐项一致通过后，再串行拍 coast-full-bend 与 academy-depth，均达到同一门槛；构建前后 tracked clean，Worker/road bundle SHA-256 与 served bundle 一致，预览仅一个 smoke-server（127.0.0.1:4141，内存 SQLite），结束后预览退出且端口无监听、三台浏览器退出 0；交付 24 个脱敏公开文件（场景原图、逐帧 JSON、report、manifest、README、artifact-hashes），artifact-hashes 23 条哈希逐项匹配。openIssues：1) 仅 SwiftShader 软件渲染，不是硬件 GPU 基线；每机位 1 帧×2 次，不代表整局、手感、声音或画面判优；2) 按任务只补跑 capture/smoke-launch 相关 15 项单测，未重跑 npm test；3) 核对浏览器版本时曾误用 chrome.exe --version 触发默认 profile 的短时可见窗口，已立即终止该 PID 及子进程，未参与拍摄也未产生交付物，属对“不开可见窗口”边界的偏离，如实记录；4) 旧卡 48d0c34 的 0 PNG 与旧目录保留未动，未作为本卡基线。taskDone=true，pageStuck=false。
- 产物：[2b7f948](https://github.com/dbvv1/Star-Rush-Reborn/commit/2b7f948d7c9a8253e5aeb5159821cee736337318)，分支 `relay/b-star-capture-repair-20261104`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 当前决定：固定产物已在`2b7f948`，不重复提交或拍摄。旧`5962a43`固定基线目标由11-11当前默认成对验收替代，本卡结束，保留所有历史图和原退出缺口；硬件GPU、正式评分和试听不是换默认前置。

## 11-11 固定产物去向

已独立解码三机位的双拍及scene副本，共12个1280×720 PNG文件，各机位RGBA相同，并实看全弯图。相机／种子／时钟／renderer与`7e87d4c`图相同，但`5962a43`到当前默认存在构建与场景代码变化，尚未证明默认执行路径完全等同，不能直接升级为本轮前图。历史图保留供等同性核验，不取消其证据价值，也不续旧拍摄期限；dot-B负责当前默认与整层版的成对验收，唯一拍摄执行先合法核清原外层与槽。原预览独立退出码缺项、曾打开可见窗口的偏离及未知隔离均保留；cancelled不证明原调用退出，不清锁、释放未知槽或重试受拒入口。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
