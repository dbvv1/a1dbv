# B-FPS-FIXED-CAPTURE-20261104 · 当前训练赛三机位软件基线
id: B-FPS-FIXED-CAPTURE-20261104
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8
result_branch: relay/b-fps-fixed-capture-20261104

## 目标
取得当前默认训练赛的 gameplay、courtyard-gap、cross-lane 三机位原图，各双拍，用于后续目标图与材质对照。固定 tree 为 `417652e69e45b06bb982cd5a0ca11265677f2fcd`；不改源码、不启用 ground 或全场材质旁置、不部署。
按游戏细则 §7 串行：Star [修复卡](B-STAR-CAPTURE-REPAIR-20261104.md)已交回，本轮只排本卡，FPS 交回后 dot 才另排 MOBA。本卡 ready 仅为排队，不代表已运行或出图。

## 按哪个 Skill／规格
按 a1dbv `5b88532e8ef61abaa4a46bc7b04e477a4fa9d7ac` 的游戏细则 §7、game-quality-pass/references/capture.md，以及固定 FPS 源的 AGENTS.md、docs/quality/current-capture.md、docs/capture.md、src/default-route.ts、src/capture/cameras.ts、src/candidates/offline-training-v1/capture/quality-client.ts 与 replay.ts。当前 qualityCapture 接口优先于旧 shot 示例；不要调用只支持旧 1v1 的 tools/capture.mjs 充当当前训练赛拍摄。
1. 开工先 fetch 最新任务卡，核本卡原调用、输出及全部出图/smoke 实际占用。已有同卡调用/输出只核原调用，不重派；存在未结工具、活跃出图、输出冲突或无法辨认资源归属时，只将本卡浏览器步骤 blocked，不动未知进程/锁。三名审查者只读已有产物，不能各自启浏览器。
   Star 19:29:54–19:30:30 UTC 已核 Workflow completed、CLI exit 0、工具 settled/pending=[]，1174 登记身份当前存活匹配 0，预览进程当前不存在且端口关闭。其预览和外层 worker 的独立退出事件/码仍 unknown，不能补推为 exit 0；历史缺口原样保留。开工仍须 fresh 核当前无相关未结调用或冲突资源，不重启旧卡、不清理旧工作树。
2. 只复用已装 Node 24、Python 3、Chrome for Testing 156.0.8078.4 和与本源 package-lock.json 匹配的依赖；缺项交回，不安装/升级本机软件、浏览器或依赖。Node 24 入口只用于本进程及子命令，不改全局环境。浏览器版本预检只读二进制 VersionInfo 和文件 SHA-256；严禁运行 chrome.exe --version 或打开任何浏览器来查版本。实际版本在本轮唯一 headless 浏览器启动后读 browser.version()，不另开探测浏览器。
3. 新独立 worktree 精确 checkout 固定 SHA，保留 Git 原始 LF；核 HEAD/tree、构建前后 tracked clean。执行一次 `npm run build`，保存真实退出码和 web-dist 完整文件 SHA-256 清单。沿 tools/capture-support.ts 的 Windows 构建分派使用 windowsHide，不能打开终端窗口；不继承候选配置，不改文件凑版本。
4. 允许在独占输出根写一个一次性 Node/Playwright 拍摄 harness，复用现有 vite、playwright、pngjs，不写游戏源码。仅启动一个 Vite preview，指向本轮 web-dist，host=127.0.0.1、port=0、open=false，BASE 取实际监听地址，不猜端口或复用旧服务；只访问此 origin，不访问线上。核 HTTP 实际返回的入口及所有加载 bundle 与本轮文件哈希一致。
5. 依 11-04 最新游戏细则 §7 的本机 SwiftShader 档，唯一 Chromium 显式 headless=true、chromiumSandbox=false；完整保留 Playwright 默认参数，不过滤 unsafe，args 固定 ['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--enable-automation','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']。本卡采用最新三参数要求，优先于 FPS 较早 AGENTS 中强制 sandbox/过滤 unsafe 的旧约束；只关闭本轮浏览器自身 sandbox，平台外层沙箱不动。不换 GPU/D3D11/浏览器重试，不绕过明确访问拒绝；只用已核二进制，实际 argv 必须核到三参数、headless 与 automation。
   不开可见窗口、不接用户浏览器、不操作桌面或系统/页面键鼠、不运行 smoke/smoke:backlog 或其它实时游玩、不播放音频。任一可见窗口或版本偏差立即停止本卡，仅安全关闭已知归属资源并如实记录，不能继续拍摄掩盖。
6. 输出根固定 `outputs/B-FPS-FIXED-CAPTURE-20261104/fa8740d-swiftshader`，此前必须不存在；允许创建父目录及根一次，所有产物排他写入，不覆盖、不换根再跑。viewport 与内部 PNG 均 1280×720、DPR 1；locale=en-US、timezoneId=UTC，固定现行画质。下列完整路径接实际 BASE，每机位两次分别创建全新 context/page、加载完整 URL、独立完成 120 tick 和 12 次预热；第一张检查通过并关闭该 context 后，才新建第二次。不得在同一加载实例重复读取缓存 PNG 充当第二拍。逐张串行，首次失败停止剩余图。

| 顺序／机位 | 完整路径与参数 | 相机 |
|---|---|---|
| 1 gameplay | `/?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1&lighting=courtyard-light-v1&qualityCapture=gameplay` | 原玩家在 tick 120 的实际 eye/yaw/pitch，FOV 80°，保留现有枪体 |
| 2 courtyard-gap | `/?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1&lighting=courtyard-light-v1&qualityCapture=courtyard-gap` | position=(2.6,1.62,6.4)，yaw=-0.28、pitch=-0.04，FOV 80° |
| 3 cross-lane | `/?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1&lighting=courtyard-light-v1&qualityCapture=cross-lane` | position=(-7.5,1.62,-9.5)，yaw=0.32、pitch=-0.03，FOV 80° |

无 materials/feel/shot/artCapture/smoke/seed/t/input/frames 参数。固定游戏内 replay：seed=1、easy、9 Bot、idle-zero-move、60 Hz、tick=120、t=2、frame=0、12 次 dt=0 预热；不得调用 __shotNext、注入状态或修改相机。两观察机位不证明玩家可达，无枪/HUD；内部 PNG 均不含 DOM HUD。
7. 每次等 __shot.ready 或 error，error 即失败；同时核 state.tick=120、frame=0、t=2、hz=60、replay、backend=webgl2、image={width:1280,height:720,dpr:1}、viewport={width:1280,height:720,pixelRatio:1,bufferWidth:1280,bufferHeight:720}、renderInfo.art.state=ready/active=true、renderInfo.lighting.id 与 qualityParameters.lighting.id 均为 courtyard-light-v1 及 #boot 已隐藏，rendererEvidence.rendererClass=software。保存 __shot 全部元数据但移除 pngDataUrl 后另存 PNG；不以页面/桌面截图代替场景画布。
   首图落盘并解码、1280×720，沿原脚本每 4 像素采样的 5-bit RGB 颜色数 >32，且实际看图不是遮罩/空白/错误页，才拍同机位第二次；两次 RGBA SHA-256、stateHash、完整 state/commands、camera/actualPlayerPose、replay、t/frame 与 rendererEvidence 一致才放行下一机位。帧0额外等真实150ms，确认状态/相机/PNG不变。任何首错保留原始失败报告并停止，不另启诊断或补拍。
8. 全程登记 harness、构建命令、预览、Chromium 及其可归属子进程的 PID/创建时间/父链/开始 UTC；在启动前装退出监听或用监督进程 wait，保存实际 exit/signal/结束 UTC。仅本进程 DEBUG=pw:browser 留浏览器原始启动和退出事件。preview 在 harness 内则明确同进程，记录 server.close 回调、端口关闭及宿主 Node 实际退出，不能编造独立预览 PID/exit。
   finally 仅关闭本次确知归属的 context、Chromium、preview，核端口关闭；先回拍摄结束/失败和清理事实，再整理交付。正常 close、PID 消失、Workflow 返回不能代替个体退出；每个缺失字段保留 unknown，不宣称完整退出基线。独立审查只读既有 PNG/JSON，不复拍。

## 写入范围
固定游戏源、配置、锁文件、正式资产只读；只允许本次构建和独占 outputs 的 harness、PNG、JSON、日志/退出记录。仅在 result_branch 新增 `docs/quality/capture/B-FPS-FIXED-CAPTURE-20261104/` 的六张原图、逐帧 JSON、manifest、report、harness 及简短 README；不改 main、不部署、不覆盖旧目录或任务事实。
公开副本保留原始 renderer/vendor/version、Chromium 版本、规定参数、相对文件名和哈希；去机器用户名、绝对路径、完整 argv、调试端点、凭据及私人日志，并注明脱敏。实际本机路径和原日志仅留本地，不提交桌面截图。

## 怎样算做成
六张真实 PNG 可解码且非背景，每机位双拍像素与上述状态一致；WebGL2、1280×720/DPR1、软件渲染、错误为空，report.passed=true，构建/harness 真正 exit 0。manifest 逐图记录实际完整 URL、commit/tree、源码干净状态、构建与 served bundle 哈希、seed/tick/t/input、机位、画质参数、rendererEvidence、Chromium 完整版本、PNG/RGBA 哈希、起止 UTC 和逐进程退出/清理证据。
缺 renderer、版本、真实像素或退出证据时明确缺项，不称完整基线；硬件 GPU、完整六回合、声音/手感、参照配准和画面判优仍未验收。公开扫描、diff 空白及 noreply 提交身份检查通过后，只推结果分支并回 review_ready；dot 按真实图接收。

## 当前结果

- 原调用、工具或已登记进程尚未确认结束，保留产物与原调用身份，由维护者核清并解除本地隔离后接续；不自动重派。
