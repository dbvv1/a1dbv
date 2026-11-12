# B-STAR-DEFAULT-SMOKE-20261112 · 两入口完整整局与连续帧耗
id: B-STAR-DEFAULT-SMOKE-20261112
owner: dot-B
kind: build
status: ready
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 2cad4837e6a759183f24c662b39ea1653b0e6bfe
result_branch: relay/b-star-default-smoke-20261112

## 目标与边界
- 三案串行第一张；本卡独占拍摄槽，交回并确认本轮资源关闭后才派 FPS，随后 MOBA。不要求桌面连接。
- 本机接收端已核原品质卡 accepted、旧进程结束、槽可用，不沿用设备离线／槽 unknown 旧阻塞。
- 保留当前已过静态盲选，不重拍机位图、不重做盲选；硬件 GPU、目标图、升档、人工试听不是前置。
- 只用固定 SHA 现成源码、构建与 smoke；不改工具、AI、源码、默认值、锁文件，不换浏览器/渲染档绕失败。
- 独立 worktree，只提交本卡证据；依赖/构建留本地。接收端仅交回，不切默认、不部署。

## 执行规格与现成命令
1. 读 AGENTS.md、docs/browser-smoke.md，核 HEAD=base_ref、工作树干净、Node.js 24。输出根为 `docs/quality/smoke/B-STAR-DEFAULT-SMOKE-20261112/2cad4837`；已存在产物先核原调用后续接，不能覆盖或盲重跑。
2. 复用本机已装且与锁文件匹配的依赖和既有Chromium，不安装/升级本机软件；缺项明确交回。接收端沿既有隐藏窗口启动方式运行。独立 worktree 的 PowerShell 依次执行准备；每条非零即停止保错。记录源码 SHA、Node/npm/Chromium 版本与开始 UTC。环境设置只限本进程，不改持久配置。
```powershell
node --version
$env:STAR_RUSH_DRIVING_MODEL='road'
Get-ChildItem Env:STAR_RUSH_* | Where-Object Name -ne 'STAR_RUSH_DRIVING_MODEL' | ForEach-Object { Remove-Item ('Env:'+$_.Name) }
$out='docs/quality/smoke/B-STAR-DEFAULT-SMOKE-20261112/2cad4837'
New-Item -ItemType Directory -Path "$out/default","$out/coast-space-v1" -ErrorAction Stop
[DateTime]::UtcNow.ToString('o') | Set-Content "$out/started-utc.txt"
```
3. 先跑当前默认 `/road`。工具固定输出 `outputs/smoke/`，必须立即复制，再跑下一档；以下在同一 PowerShell 执行，不创建新工具。
```powershell
npm run smoke -- --full-race --path /road --timeout-ms 900000
$code=$LASTEXITCODE
Copy-Item 'outputs/smoke/*' "$out/default/" -ErrorAction Stop
$code | Set-Content "$out/default/node-exit.txt"
[DateTime]::UtcNow.ToString('o') | Set-Content "$out/default/returned-utc.txt"
if ($code -ne 0) { throw 'Default smoke failed: retain report and return this card' }
```
4. 确认上一调用退出且 cleanupErrors=[] 后跑拟发布入口；仅增加现成 environment 开关。
```powershell
npm run smoke -- --full-race --path '/road?environment=coast-space-v1' --timeout-ms 900000
$code=$LASTEXITCODE
Copy-Item 'outputs/smoke/*' "$out/coast-space-v1/" -ErrorAction Stop
$code | Set-Content "$out/coast-space-v1/node-exit.txt"
[DateTime]::UtcNow.ToString('o') | Set-Content "$out/coast-space-v1/returned-utc.txt"
if ($code -ne 0) { throw 'Candidate smoke failed: retain report and return this card' }
```
5. 工具自带 headless Chromium、SwiftShader、1280×720／DPR 1，保留 Playwright 默认参数及 `--no-sandbox --enable-unsafe-swiftshader --use-angle=swiftshader --enable-automation`。仅隔离 loopback Worker／内存 SQLite，不用生产、用户浏览器或外部账户，不播放音频。
6. 两档均由工具选汐见海岸 coast-reborn、竞速、high、固定种子73121，自动试驾按真实时间到结果；不注入终点、跳tick、虚拟时钟或Canvas回退。默认实际space=false、候选space=true；均power=false、backend=webgl2、warnings=[]，起止有tick推进。

## 验收与交回
- 每档保留 report.json、现成 race.png/canvas.png（只作smoke附件，不重做静态盲选）、真实Node exit与UTC。保留 servedBundleSha256、renderer/rawRenderer、Chromium版本、actualArgvVerified。
- 完整通过须scope=full-race、passed=true、exit=0、cleanupErrors=[]；WebGL2有效、页面/控制台/请求错误为空；四名排名与HUD、玩家时间和本地新纪录一致；重开→运行→暂停→回菜单通过。
- fullRace保留倒计时至结果的连续frames（fromMs/toMs/phase）、首尾边界、initialLap、result/存档、restartAndReturn；frameCadence保留samples/durationMs/meanMs/p50Ms/p95Ms/p99Ms/maxMs/over50Ms。
- 当前工具对玩家或对手DNF缺自然截止收尾证据，会明确失败；DNF合法，不据此断言AI品质失败。保存failure和部分fullRace，写明缺证据后交回，不改工具或补造frameCadence。
- 帧耗指真实浏览器rAF间隔，不是GPU或纯渲染耗时。同renderer/viewport/赛道/画质/起止区间比较两档p95/p99/max及>50ms数量；summary.md列原值及变化，不用平均FPS代替尾延迟，由dot-B判有无明显劣化。
- 首次失败、超时、中断或退出未知即停后续浏览器；保留阶段/error/退出事实和已有产物，安全关闭本轮确知资源，未确认关闭不释放槽。不用PID消失代替浏览器/preview清理回执。
- 原始调试日志仅留本地；公开产物去掉本机路径、调试地址、身份与凭据，保留错误类型/阶段。附summary.md、SHA256清单和交回UTC，公开扫描后推result_branch，卡改review_ready；失败则blocked并写恢复条件。
- 两入口真实通过且无明显帧耗劣化后，dot-B沿已过静态盲选当轮换默认并更新网站；本卡不自动宣称采用或覆盖率提升。

## 当前结果
未执行，待本机领取；完整整局与帧耗未验，不以CPU回归代替。
