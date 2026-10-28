# B-FPS-ART-STANDARDS-SMOKE-20261029 · 三件环境标准件旁置接入验收
id: B-FPS-ART-STANDARDS-SMOKE-20261029
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 9a5c02fc6b51c852d567cc0d4d28bf388fc41f4b
result_branch: relay/b-fps-art-standards-smoke-20261029

## 目标
只验固定源码 9a5c02fc6b51c852d567cc0d4d28bf388fc41f4b、tree 7cb322681201244e6e9f252ecf21bf63a037ac78 的既有 v14 离线训练赛与三件标准件旁置入口，不制作新内容、不合 main、不部署。候选仅替换 center-dogleg、site-cover 与 (-11.5,0,-13) 一盏既有灯；before 为原 offline query，after 追加 &art=standards-v1，runner 已写死两路。

## 按哪个 Skill／规格
按 game-content-production、game-quality-pass/references/capture.md 与细则§7、固定源 tools/smoke-backlog.mjs / tools/smoke.mjs。先只读核现有 GPU 任务、原调用、浏览器/预览父链与既有串行条件；活跃则不打断、不重复启动，回实际阶段。Git accepted/cancelled/ready 不证明此刻空闲；不明则 blocked 写缺什么，不创建/清锁、不动未知进程。仅现有接收端串行运行一个 GPU 任务。
独立工作树固定 HEAD/tree/clean，复用332项CPU、构建和独审，不重复CPU占本轮；命令内仍构建并记产物hash。复用现有依赖与Chromium，缺依赖仅 npm ci --offline；不可满足则 blocked，不联网安装/下载浏览器。依赖准备外部超时10分钟。
设 FPS_SMOKE_RENDERER=native；需要时 FPS_SMOKE_CHROMIUM 指向现有可执行文件（私有路径只本地）。执行 node tools/smoke-backlog.mjs --art-standards，整条命令外部超时600秒。只 headless；保 sandbox、现有移除默认unsafe参数实现，不用no-sandbox/unsafe标志、不换renderer规避失败、不打开窗口/操作桌面或系统键鼠。
两路在任何页面输入前各取两张初始部署canvas帧：1365×900、垂直FOV80、seed1、tick0，正常玩家出生眼位与yaw/pitch；raw pose、完整state与stateSHA由runner记录。要求重复像素一致、前后stateSHA/机位/raw WebGL一致。这是静止初始视角，未用输入注入，不包含墙角/低掩体/敌我战斗机位。之后只按现有smoke用Playwright页面输入完成自然首回合→next→全场reset及暂停/恢复；不改模拟/时钟/断言，不把页面smoke当质量回放。
保renderer/vendor/version原始公开字符串并分gpu/software/unknown；非gpu不能作为画面定稿，保结果不切换重试。超时先核自有进程和产物，不盲重试，只关闭确定本轮归属的浏览器/预览；审查者不另起浏览器。

## 写入范围
源码、素材、锁文件和脚本只读。允许本地缓存与被忽略dist/web-dist、runner创建的outputs/art-standards-smoke/<sha>-<unique>/；每轮全新独占目录，不覆盖历史。
只在result_branch新增docs/quality/smoke/B-FPS-ART-STANDARDS-SMOKE-20261029/<run-id>/的manifest、两路report、真实截图、hash及脱敏退出回执；任务卡仅回当前结果。原始日志/argv/进程父链本地留存；公开副本移除私有路径、用户名、完整argv、wsEndpoint、nonce、凭据、内部对话，标注脱敏，保raw WebGL身份。没有桌面截图。

## 怎样算做成
两路功能smoke通过；after的art.state=ready、active=true、3件、2396tris/4mesh draws/123604bytes；重复初始帧像素相同、两路同state/camera/renderer，manifest固定HEAD/tree/clean与全构建hash。每条原调用写实际起止、退出码、所属浏览器PID真实退出、预览停止/端口关闭及自有链消失，未测写未知，不能用Git状态替代。
六回合整场、半场/终局、完整战斗画面、贴墙/掩体视线、GPU性能、人看听玩、非作者视觉优劣和有意义二改仍待验；初始视角截图不能替代这些。结果回收后由dot判断旁置合入与网站发布。

## 当前结果

- 固定源 9a5c02f 上两路真实 WebGL2 GPU 功能 smoke 均通过，after 的 art.state=ready/active/3 件/2396 tris/4 calls/123604 bytes，重复初始帧像素一致、两路 stateSHA 与渲染器一致，证据包 12 个文件 hash 已独立复核，openIssues 为空；仅剩六回合整场与人工画面/手感待验（首次用默认 chrome-headless-shell 出现软件 WebGL 且 after 路等待 phase=over 超时，改用既有完整 Chromium 后 GPU 通过）。
- 产物：[18d9a1b](https://github.com/dbvv1/FPS-Like/commit/18d9a1bfaaff1c1594e473ac2e98afd06449f9cc)，分支 `relay/b-fps-art-standards-smoke-20261029`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：本任务范围已无剩余，交 dot-B 判断旁置合入与网站发布；六回合整场、墙角/掩体视线、人看听玩与非作者视觉判断仍待验。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
