# B-MOBA-FIXED-CAPTURE-20261105 · 当前场景四机位软件基线
id: B-MOBA-FIXED-CAPTURE-20261105
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64
result_branch: relay/b-moba-fixed-capture-20261105

## 目标
取得 gameplay、spawn、first-tower、spawn-to-tower 四机位各两张原图。固定 tree 为 `316e1a3a6da5bd40e84faba90adae3ee4ac31533`；用当前默认 forest-light-v1 灯光与 baseline 材质，不启用 quiet、镜头、指令缓冲或其他旁置，不改源码、不部署。
按 Star → FPS → MOBA 串行。本轮仅排本卡；ready 不是实际运行。[FPS 上张](https://github.com/dbvv1/a1dbv/blob/48f804a445f38ccfbc931d7174a0ce899d401bad/docs/collaboration/local-jobs/B-FPS-FIXED-CAPTURE-20261104.md)已于 11-04 22:13 UTC 交回 review_ready；原 exit 1、cleanExitBaseline=false、reviewed=false 及两项审查欠项保留，本卡不修改旧任务、隔离或失败目录。11-05 10:33:59–10:35:28 UTC 只读快照：receiver/worker/归属 CLI 为 0，FPS collection live=[]，原登记身份当前存活匹配 0；此事实不补写历史退出码，也不是开工时持续空闲保证。

## 按哪个 Skill／规格
按 a1dbv `48f804a445f38ccfbc931d7174a0ce899d401bad` 的[游戏细则 §7](https://github.com/dbvv1/a1dbv/blob/48f804a445f38ccfbc931d7174a0ce899d401bad/docs/collaboration/game-taskbook.md#7-下发本机模型的游戏任务)、game-quality-pass/references/capture.md，以及固定 MOBA 源 AGENTS.md、docs/capture.md、src/capture/{cameras,config,session,client}.ts、tools/capture-output.ts、vite.capture.config.ts。本卡落实 11-04 用户的本机 SwiftShader 决定，优先于旧文的云端地点与强制 sandbox/过滤 unsafe 约束。
1. 开工先读最新本卡，核原调用、输出、全部出图/smoke 实际占用及相关工具状态。已有同卡调用或输出只核原调用，不重派；有当前活跃出图、未结工具、输出冲突或归属不明则本卡 blocked，不碰未知进程/锁。历史缺码不自动等于当前占用；仍须 fresh 核当前无相关残留。三名审查者只读产物，不各启浏览器。
2. 只复用已装 Node 24、Python 3、Chrome for Testing 156.0.8078.4 及与固定 package-lock.json 匹配的依赖；缺项交回，不安装/升级本机依赖或改全局环境。版本预检只读二进制 VersionInfo 与 SHA-256；禁止 chrome.exe --version、探测浏览器和可见窗口。唯一 headless 实例启动后再读 browser.version()，与预检核对；偏差停止本卡。
3. 新独立 worktree 精确 checkout 固定 SHA；核 HEAD/tree、原始 LF、构建前后 tracked clean。先创建本卡独占输出根，再顺序运行既有 `node node_modules/typescript/bin/tsc -p tsconfig.capture.json` 与 `node node_modules/vite/bin/vite.js build --config vite.capture.config.ts` 各一次。所有子命令 windowsHide=true，不调用会开窗口的 shell；保存各真实退出码。构建只用本 worktree 的 outputs/capture-build，保存完整文件 SHA-256 清单和 capture-bundle.json，不能用 web-dist 或旧产物代替。
   固定 Vite 配置内的 execFileSync('git',…) 未指定 windowsHide，外层隐藏 Node 不够：从本卡输出根加载一次性 preload 包装器，给本轮构建及 harness 内 child_process 的 spawn/spawnSync/execFile/execFileSync/exec/execSync/fork 调用强制 windowsHide=true，并用 syncBuiltinESMExports 同步 ESM 导出；仅注入本轮进程/子命令，不改源码或全局 NODE_OPTIONS。先以不启动进程的 stub 检查参数透传、各种重载及同步导出；覆盖不了嵌套调用或无法验证时，在构建前 blocked，不能先运行再看是否闪窗。
4. 在独占输出根写一次性 Node/Playwright harness，复用已装 vite、playwright、pngjs 及原 capture-output helper，不改游戏源码或 tools/capture.mjs。旧脚本过滤 unsafe 且断言 sandbox，不能直接运行充当本档。仅启一个 Vite preview：configFile=false、root=固定 worktree、build.outDir=outputs/capture-build、host=127.0.0.1、port=0、open=false；BASE 取实际监听 origin，只访问该 origin，不访问线上或复用旧服务。开始与结束逐文件核 HTTP 返回字节和构建哈希一致，不仅核版本标签。
5. 唯一 Chromium 使用 chromium.launchServer 后 chromium.connect；BrowserServer.process() 才是 ChildProcess，不能调用 Browser.process()。显式 headless=true、chromiumSandbox=false，不设置 ignoreDefaultArgs；args 固定为 ['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--enable-automation','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows']。实际 argv 核三参数、headless 与 automation，只关闭本次 Chromium 自身 sandbox，不动平台外层沙箱；不换 GPU/D3D11/二进制重试，不绕过明确拒绝。
   不开可见窗口、不接用户浏览器、不操作桌面或系统/页面键鼠、不运行实时游戏 smoke 或 --check-live、不播放音频。出现可见窗口即停止本卡，仅关闭已确知归属资源并记录，不继续拍图掩盖偏离。
6. 输出根固定 `outputs/B-MOBA-FIXED-CAPTURE-20261105/7e1986f-swiftshader`，须此前不存在；允许创建父目录及根一次，产物排他写入、不覆盖、不换根重跑。viewport 和内部 PNG 均 1280×720、DPR 1；locale=en-US、timezoneId=UTC。下表路径接实际 BASE；每张都新建 context/page、重新加载完整 URL，独立预推进和预热。首张验过且关闭 context 后才双拍第二张，逐机位串行；首次失败停止剩余图。

| 顺序／机位 | 完整路径与参数 | position / target；FOV |
|---|---|---|
| 1 gameplay | `/capture.html?shot=gameplay&seed=1&t=10&input=march&frames=1&lighting=forest-light-v1&materials=baseline` | 跟随 t=10 的真实玩家表现位置 (x,0,z)：(x,24,z+18) / (x,0,z)；45° |
| 2 spawn | `/capture.html?shot=spawn&seed=1&t=10&input=march&frames=1&lighting=forest-light-v1&materials=baseline` | (-94,24,19.2) / (-94,0,1.2)；45° |
| 3 first-tower | `/capture.html?shot=first-tower&seed=1&t=10&input=march&frames=1&lighting=forest-light-v1&materials=baseline` | (-28,24,18) / (-28,0,0)；45° |
| 4 spawn-to-tower | `/capture.html?shot=spawn-to-tower&seed=1&t=10&input=march&frames=1&lighting=forest-light-v1&materials=baseline` | (-65,62,46.5) / (-65,0,0)；45° |

固定现有 replay：contentVersion=11、双方 Veyra、普通对手 bot seed=1002；玩家仅首逻辑步发 move 到 (-18,1.2)，seed=1；视觉 60Hz 预推进 600 帧、模拟 30Hz 至 tick=300/t=10、12 次 renderOnly 预热。无 standards/commands/camera 参数；不注入状态、改相机或调用 __shotNext。不启用候选源包；画面含场内血条、不含 DOM 玩家 HUD，不证明实时操控或完整整局。
7. 每拍等 __shot.ready 或 error（最多 120 秒），error 即失败。核 sourceCommit 固定且 sourceDirty=false、bundleSha256、captureRole=gameplay、shot 正确、seed=1/input=march、contentVersion=11、frame=0/frames=1/complete=true、virtualFrame=600/simTick=300/t=10/warmupFrames=12、backend=webgl2、image={width:1280,height:720,dpr:1}、viewport={width:1280,height:720,pixelRatio:1,bufferWidth:1280,bufferHeight:720}、rendererClass=software。
   核 lighting.requested/configured/active 都为 forest-light-v1，materials.requested/configured 为 baseline、active=null（此版 baseline 的正常编码），standards=null；window.mobaClient 不存在。完整留 renderer/vendor/version/unmasked、camera、stateHash、render、灯光/材质与画质能力；未暴露的 MAX_SAMPLES、各向异性上限、纹理格式记 unknown，不额外建 GL context 探测。
8. 从 __shot.pngDataUrl 保存真实场景 PNG，全量元数据移除该字段后另存 JSON，不以页面/桌面截图代替。先落盘解码，确认 1280×720、原脚本每 4 像素采样的 5-bit RGB 颜色数 >32，并实际看图非空白/遮罩/错误页，再拍第二张。帧0等真实150ms，除去无关运行标识后状态/相机/PNG必须不变；双拍 RGBA SHA-256、stateHash、camera、renderer、灯光/材质、seed/t/input/virtualFrame 相同，才进入下一机位。
   捕获 pageerror、console error、requestfailed、HTTP≥400、WebGL丢失；错误为空才算本卡固定帧加载/渲染 smoke 通过。任何首错保留原始失败报告，不补拍、不再启诊断浏览器。超时仅停止等待不代表原工具或进程已退，后续按已知归属安全收尾。
9. 启动前为本轮 harness、类型检查/构建、Chromium及可归属子进程安装退出观测或持有可 wait 的真实进程句柄，登记 PID/精确创建时间/父链/开始 UTC，逐个记录实际 exitCode/signal/结束 UTC；仅本进程 DEBUG=pw:browser 留原始事件。preview 属 harness 同进程，记 server.close 回调、端口关闭和宿主 Node 实际退出，不造独立 preview PID/exit。
   先关闭自有 context 与 Browser 连接，再关闭 BrowserServer，并等待实际 ChildProcess exit；使用本版本真实 API，不把 close 请求成功当进程退出。finally 仅安全关闭本次已知资源，核 preview 端口关闭；真实进程退出须由监督父进程落盘，不依赖已退出 Node 自报。PID 消失、Workflow completed、finally 或报告写出不能替代个体退出；缺项保留 unknown，cleanExitBaseline=false，不伪造 exit 0。先回拍摄结果与清理事实，再整理交付。

## 写入范围
源、配置、锁文件、正式资产只读；允许本次独立 capture-build 与独占 outputs 的 harness、PNG、JSON、日志/退出记录。仅在 result_branch 新增 `docs/quality/capture/B-MOBA-FIXED-CAPTURE-20261105/` 的八图、逐拍 JSON、manifest、report、harness 和简短 README；不改 main、不部署、不覆盖旧任务或产物。
公开副本保留 renderer/vendor/version、Chromium 完整版本、规定参数、相对文件名、哈希及逐进程退出事实；删除用户名、绝对路径、完整 argv、调试端点、凭据及私人日志并注明脱敏。实际完整 URL 与原日志仅留本地，公开 URL 用 BASE 占位并保留完整路径/查询，不提交桌面截图。

## 怎样算做成
八张真实 PNG 可解码且每机位双拍一致；WebGL2/1280×720/DPR1、软件渲染和错误门槛通过，构建/harness/Chromium 真正 exit 0，逐进程退出缺项明确。manifest 记录固定 commit/tree、干净源、构建/served 哈希、四机位与所有参数、PNG/RGBA 哈希、renderer、Chromium、画质与起止 UTC；report 分列 capturePassed 与 cleanExitBaseline，只有全部必需证据齐全才 passed=true。
只交图和真实证据，不宣称硬件 GPU、完整整局、声音/手感、参照配准或品质判优通过。失败也先交已有结果与精确断点，不能把旧 exit 缺口补成成功。经既有 Workflow 只读审查、适用公开扫描、diff 空白及 noreply 身份检查，只推结果分支回 review_ready；dot 再看图接收。
