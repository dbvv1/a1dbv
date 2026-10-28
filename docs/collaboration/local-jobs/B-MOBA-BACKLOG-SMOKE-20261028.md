# B-MOBA-BACKLOG-SMOKE-20261028 · 积压整合候选的串行无头验收
id: B-MOBA-BACKLOG-SMOKE-20261028
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 9df6192f44f91482c3c05ab8014c86d406c48e18
result_branch: relay/b-moba-backlog-smoke-20261028

## 目标
验收用户指定积压整合版本的默认与旁置试玩入口，使通过的普攻、攻城兵、地形、改键和续玩可进入网站；只交真实 smoke，不合 main、不部署。
固定源码 SHA 如上，tree 必须 9872ffe993207effcacb4143044e00622b0bc62d，不使用移动分支头。38f36d1 否决项未包含；d0db3d7 完整逐帧输入时延包未恢复，本次功能 smoke 不冒充它。
前序 FPS 原始退出证据见 [05e39b6](https://github.com/dbvv1/FPS-Like/commit/05e39b6)：本任务五个浏览器严格串行，2026-10-28 11:02:03Z 命令 exit 0，11:02:20Z 复查自有脚本／Chromium 无残留、7702／8757 无监听；只证明前序自有链退出，不证明整机 GPU 空闲。启动前仍须再次核实际任务与既有接收端串行条件，不等 FPS 仅修文的 running 标签，也不重跑 FPS 或触碰归属未知 Edge。不恢复旧 B-MOBA-DIFFUSE-GPU-001 或其额外拍摄。

## 按哪个 Skill／规格
按 game-quality-pass、游戏细则 §6 第3条／§7 和固定源 tests/client/browser-smoke/run.mjs。仅 headless 浏览器；完整 smoke 允许 Playwright 页面内输入，不打开可见窗口、不控制系统键鼠、不操作桌面。
启动前再次核实际 GPU 任务无冲突、既有接收端串行条件及相关浏览器／预览父链；若不存在共用锁如实记录，不创建新锁、不换锁根、不清锁。无法确认安全串行或存在未知阻塞则 blocked 并报告具体缺口，不终止未知进程。主执行者与审查员均不得并行或额外补跑，审查只核本轮原始结果。
精确 checkout 后核 HEAD/tree 和工作树 clean，依次 npm ci、npm test、npm run build、npm run build:web；随后设置 MOBA_SMOKE_SOURCE_SHA=9df6192f44f91482c3c05ab8014c86d406c48e18 与 MOBA_SMOKE_RENDERER=gpu，执行 node tests/client/browser-smoke/run.mjs。复用已安装可定位的 Chromium，必要时仅设置 MOBA_SMOKE_CHROMIUM 绝对路径，路径只本地保留。
该 runner 依次验 / 默认 v10、/candidate.html 完整 v11、/candidate.html?lighting=stylized-diffuse；不另跑 capture。保持 sandbox，禁止 no-sandbox、disable-setuid-sandbox、unsafe-swiftshader；失败后不换浏览器或 renderer 规避，不自行修改源代码。
依赖／测试／构建准备总超时10分钟；smoke 外层总超时180秒，启动限30秒、页面默认动作限15秒。超时先核原进程和产物，仅关闭本任务确知归属的资源并交真实回执，不盲重试。

## 写入范围
源码、锁文件和脚本只读；允许安装缓存、被忽略的 dist/、web-dist/ 和独占 smoke-artifacts/<本轮UTC时间>-<pid>/。不要复用旧目录；脚本目录已存在即失败，不覆写证据。
向原 result_branch 仅新增 docs/quality/smoke/B-MOBA-BACKLOG-SMOKE-20261028/<run-id>/ 的本轮 report.json、manifest.json、页面／画布 PNG 和脱敏退出证据；任务卡仅回写当前结果。
本地保留原始输出与浏览器 argv；公开副本不得含完整 argv、私有路径、用户名、wsEndpoint、nonce、凭据或内部对话。renderer 原始字符串保留，其他不安全字段脱敏并注明。禁止上传桌面截图。
不改案例源码／main／网站、仓库权限、接收端配置或其他任务；只正常关闭本轮确知归属的浏览器与预览服务。

## 怎样算做成
交源码 commit/tree/clean 和 web-dist/build-identity.json；报告 identity 必须匹配固定 commit/tree 且 dirty:false。默认 v10 与候选 v11 均实际推进且有非背景像素；候选真实资产、HUD布局、移动／停止／镜头／技能、两次重开、改键和保存刷新续玩断言通过；显式 diffuse 入口须实际激活并有像素。只测默认不能算候选通过。
交本轮独占目录的 report.json、manifest.json、实际生成的 default-canvas.png、page.png、canvas.png、diffuse-canvas.png（失败时 failure.png 按实际有无）；manifest 中截图大小／SHA256 必须与本轮文件相符。保留实际原始 WebGL renderer/vendor/version 与 gpu/software/unknown 分类，请求 gpu 不等于实际 GPU。
交实际开始／结束UTC、runner退出码、自有浏览器 PID/父链及 exitCode/signalCode 退出事件、同进程预览 listener 关闭与端口不可达、既有串行条件的实际退出回执；若不存在共用 GPU 锁，明确记无此锁，不虚构槽归还证据。脚本 report.processExit.exited、previewClosed 与 cleanupErrors 均要核实；未知写未知，passed 不能替代退出回执。
公开扫描产物与提交身份后回 review_ready；失败也保留真实输出和精确阻塞，不伪造通过、不额外重拍。smoke 仅是功能合入门槛，不证明画面／手感更好，不据此换默认；由 dot-B 接收后合入旁置入口并另核网站版本。

smoke 命令结束且自有资源退出核完后，先回实际起止 UTC、退出码和清理结果；完整报告整理／独审随后在原任务继续，不用 running 标签掩盖已结束的 GPU 阶段。
