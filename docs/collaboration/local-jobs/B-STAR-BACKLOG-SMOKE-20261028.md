# B-STAR-BACKLOG-SMOKE-20261028 · 指定积压整合版本的串行无头验收
id: B-STAR-BACKLOG-SMOKE-20261028
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: 8dddac2ce5cd7941a2eb64cceeeb04ef1e17831a
result_branch: relay/b-star-backlog-smoke-20261028

## 目标
验收用户 2026-10-28 指定的 Star-Rush 积压整合版本：b37046e 捕获、0817aa0 Rapier 旁置、音频链至 2bc688a 默认关闭。通过后供 dot-B 当轮合默认分支并更新旁置试玩；本任务只回真实 smoke，不合 master、不部署。
固定源码 SHA 如上，tree 必须 ef27a5020b2249899c6b1f7a40003e737eb166ae；不使用移动分支头、不接额外比赛复盘/标准件。
本卡是当前批次第三张，仅在前序 B-FPS-BACKLOG-SMOKE-20261028 与 B-MOBA-BACKLOG-SMOKE-20261028 的自有浏览器/预览进程链实际退出有回执，且接收端再次 preflight 确认无冲突 GPU 工作后执行。不得假设存在共用 GPU 锁或槽；Git 状态不是进程退出证据。旧取消的操作观察、驾驶对照、dca3409 上传与基线任务仍取消，不恢复。
前序退出依据：FPS 05e39b6 的原实际退出已核；MOBA [02e1aa2](https://github.com/dbvv1/MOBA-Like/commit/02e1aa2) 该轮 ChildProcess 85436 真实 exitCode=0／exited=true，finally 对实际 origin fetch 不可达，外层 exit 1 正常返回，12:13:21Z 无 headless。该 PID 后被 conhost 复用，不得按旧 PID 终止；OS 父链未知、端口未独立探测、无共用锁均保留。不等待 MOBA 修复成功；只据该轮自有退出接续，仍须启动前实际 preflight，不据此宣称整机 GPU 空闲。

## 按哪个 Skill／规格
按 game-quality-pass、游戏细则 §6 第3条／§7 和固定源 tests/backlog-smoke.mjs。完整 smoke 允许 Playwright 在 headless 页面内输入；不打开可见窗口、不控制系统键鼠、不操作桌面。最后 capture 子段只使用游戏内部固定状态，不注入输入。
开始前核实际 GPU 单元、前任务自有进程链退出回执及已知相关浏览器/预览链，并重新执行接收端 preflight。若确有既有共用锁或槽，才核其真实状态；没有就如实记录，不新建、不换锁、不越过占用、不清未知锁、不终止未知进程、不操作未知 Edge。不能证实安全串行则 blocked 回缺口。一次只运行本任务一个 GPU 工作单元，五入口顺序执行，主执行者/审查员均不得并发或额外补跑。
使用 Node.js 24。精确 checkout 固定 SHA，保持 Git 原始文件字节（不让换行转换改写构建身份），核 HEAD/tree/clean；依次 `npm ci`、`npm ci --prefix experiments/rapier-road-comparison`、`npm run build`，再核 tracked 文件 clean。前两命令依各自锁文件，禁止更新依赖版本。
复用已安装且可定位的 Chromium；必要时设置 STAR_RUSH_SMOKE_CHROMIUM 为本机绝对路径，只本地保留。运行 `npm run smoke:backlog -- outputs/backlog-smoke-<本轮唯一ID>`；父目录可创建，最终目录必须此前不存在。脚本启动单个 headless、sandbox Chromium，不强制软件渲染；禁止追加 no-sandbox/unsafe-swiftshader，失败后不切换 renderer/浏览器规避。
由接收端施加外部进程超时：依赖准备合计10分钟，构建5分钟，整个smoke20分钟（页面默认45秒、浏览器启动30秒）；严格串行，构建测试不要同时写 dist。失败/超时先核原调用、进程与产物，关闭本次确知归属资源后交回，不重复启动、不自行改源码。

## 写入范围
源码、锁文件、脚本只读；允许依赖缓存、上述确定性 dist/worker 生成产物（必须与固定提交一致）及本轮独占 outputs 目录。
仅在 result_branch 新增 docs/quality/smoke/B-STAR-BACKLOG-SMOKE-20261028/<run-id>/ 的报告、manifest、游戏页图片和脱敏过程证据；任务卡只回写当前结果。
本地保留原始 report/DEBUG browser 日志，不覆写旧轮。公开副本不含完整 argv、私有路径、nonce、wsEndpoint、凭据、机器用户名或内部对话；保留原始 renderer 字符串，其他必要脱敏注明，不上传桌面截图。
不改案例源码、master、网站、仓库权限、接收端配置或其他任务；仅正常关闭本次确知归属的浏览器和预览服务。

## 怎样算做成
交固定 commit/tree、开始和结束 clean、实际 Worker/四客户端/脚本 SHA256，五入口原 report 与退出码；不能只验默认。
`/`、`/road/`、`/legacy/` 都须真实初始化/加速、暂停后时间稳定、恢复时间推进、重开倒计时/再加速、退出大厅/重新开始。`/rapier/` 须真实 ticks/驾驶、暂停 ticks 稳定、恢复推进、复位 s≈170/低速度/继续推进、退出 closed 和回正式游戏。`/?shot=coast-chase&t=0` 须真实 ready。每个入口须有效 WebGL2、非背景画面且无页面/console/请求错误。
海岸环境音默认 off，不为本卡启用或听辨；本卡不能证明其完整混音更好。保留原 renderer 信息并分 gpu/software/unknown，不把 native 请求当 GPU 证据；smoke通过也不代表 Rapier 手感更好，不换默认。
除脚本 browserDisconnected/isConnected、serverListening/address 和 cleanupErrors 外，交实际开始/结束 UTC、独占 run-id、所属浏览器/预览 PID 父链与实际退出事件、端口关闭及接收端再次 preflight 事实；共用锁/槽仅在实际存在时记录释放回执，不存在如实写无，未知写未知。passed 或正常 close 返回不替代底层进程实际退出。
smoke 实际结束且本次自有进程退出核验完成后，立即先回实际结束 UTC、退出码及已核清理事实，不等完整报告整理；此阶段通知只证明上述事实，不冒充完整验收或源码交付。完整报告、公扫与提交整理随后在原任务继续，不因整理中标签掩盖已经结束的 GPU 阶段；后续任务仍须自行再次 preflight。
公扫产物和 noreply 提交后回 review_ready。失败亦保留原报告并写精确断点，不伪造通过、不额外重拍。由 dot-B 接收、合入、部署并分别核实。

## 当前结果

- 固定 8dddac2/tree ef27a50 的串行无头验收完成：两处 npm ci 与构建均退出 0，npm run smoke:backlog（run-id 20261028T1322Z-8dddac2）五入口全部 passed、errors=[]，浏览器 PID 49572 退出码 0、相关进程已退出、端口 4009 关闭，公开报告/manifest/截图已脱敏产出；renderer 为 SwiftShader 归 software，不构成 GPU 证据，海岸环境音默认 off 未听辨。审查通过，openIssues 为空。
- 产物：[2b3e2a4](https://github.com/dbvv1/Star-Rush-Reborn/commit/2b3e2a4a842ab1333b1fc393792e0574547818ea)，分支 `relay/b-star-backlog-smoke-20261028`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：由接收端以 noreply 身份提交这 10 个公开产物并进入 review_ready；本卡不含 GPU 结论与手感/听感判断。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
