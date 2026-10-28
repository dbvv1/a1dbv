# B-FPS-BACKLOG-SMOKE-20261028 · 指定积压整合版本的串行无头验收
id: B-FPS-BACKLOG-SMOKE-20261028
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 4b99b59a6b111c61d4aebd6e659bfb851e9eb736
result_branch: relay/b-fps-backlog-smoke-20261028

## 目标
验收用户 2026-10-28 指定的 FPS 积压整合版本，使通过的角色与 movement-v2 可当轮进入网站旁置试玩；本任务只回传真实 smoke，不合 main、不部署。
固定源码 SHA 如上，tree 必须 c9a6488f3b243a3155358eec455935279777abb0；不使用移动分支头，不取旧 627f667 或恢复 B-FPS-SHOT-QUALITY-001。
旧取消任务仍取消。本任务是新固定整合源的完整 smoke，按用户当日明确要求及最新版细则执行。

## 按哪个 Skill／规格
按 game-quality-pass、游戏细则 §6 第3条／§7 和该固定源 tools/smoke-backlog.mjs。完整 smoke 允许 Playwright 在 headless 页面内驱动输入；不打开可见窗口、不控制系统键鼠、不操作桌面。capture 子段仅游戏内部只读回放，不注入输入。
开始前核接收端实际 GPU 工作单元／共用串行锁、已知相关浏览器和预览链；Git 标签不能证明空闲。沿用实际共用串行条件，不换锁根或越过占用；无法确认安全串行则 blocked 并报告缺口，不终止未知进程、不清锁、不操作未知 Edge。
全任务只占一个 GPU 槽；四可玩入口与 capture 串行，主执行者及所有审查员均不得并行／额外补跑。审查员只核本次原始结果，不以重新运行证明旧声明。
精确 checkout 后核 HEAD/tree、工作树 clean；仅 npm ci 安装固定锁依赖。复用已安装且可定位的 Chromium，必要时设置 FPS_SMOKE_CHROMIUM，路径只本地保留；设置 FPS_SMOKE_RENDERER=native 后执行 npm run smoke:backlog。
该命令自行从干净源构建并依次验默认、contentSet=characters-v1、gameplay=movement-v2、两者组合及独立 capture；禁止 capture+contentSet 组合。保持浏览器 sandbox，不追加 unsafe-swiftshader／no-sandbox，不失败后换 renderer 或浏览器规避。
接收端对依赖准备设置10分钟外部超时，对整个 smoke 命令设置20分钟外部超时（不以脚本各阶段超时代替）。失败／超时先核原调用、进程与输出，完成自有资源清理后交回，不重复启动，不自行改源修测试。

## 写入范围
源码、锁文件和构建脚本只读；允许安装缓存、生成被忽略的构建与独占 outputs/backlog-smoke/<本轮唯一目录>。
向原 result_branch 仅新增 docs/quality/smoke/B-FPS-BACKLOG-SMOKE-20261028/<run-id>/ 的本轮报告、manifest、游戏页截图和脱敏过程证据；任务卡只回写当前结果。
保留原始 report／DEBUG browser log 在本地，不覆写旧轮。公开副本不得含完整 argv、私有路径、nonce、wsEndpoint、凭据、机器用户名或内部对话；renderer 原始字符串不得改写，其他不安全字段脱敏并注明。禁止上传桌面截图。
不更改案例源码／main／网站、仓库权限、接收端配置或其他任务；仅对本次确知归属的浏览器和预览服务执行正常关闭。

## 怎样算做成
交源码 commit/tree/clean、构建 identity 及每文件 hash；四个真实可玩入口与 capture 的原 report 和退出码齐全，所有模式／资源激活断言及输入、暂停、重开检查实际通过。只测默认不能算候选通过。
保留原 renderer 信息并分类 gpu/software/unknown，不把请求 native 当实际 GPU。smoke 通过不代表画面或手感更好，不据此换默认。
提交本轮 run-id、实际开始/结束UTC、浏览器与预览的自有PID/父链及退出事件、预览端口关闭和共用GPU槽归还证据；未知写未知。passed 或 cleanupErrors=[] 不替代实际退出。
公扫产物与提交身份后回 review_ready；失败也保留真实输出并列精确阻塞，不伪造 passed、不额外重拍。由 dot-B 接收后按原门槛合入旁置入口并核网站版本。

接续回执：保留原调用、不重启，回传实际阶段、实际开始 UTC、最近输出时间、原调用是否活跃及等待原因；若已完成或失败，先交已有报告和自有资源退出证据，不能只留 running。本条不授权另开浏览器或重跑；未知项如实写未知。

## 当前结果

接收 [777e830](https://github.com/dbvv1/FPS-Like/commit/777e8306b5fe92de1fc1492d8960b6fa51125d87) 的原 smoke 与回执修订：7702／75208 归属改为 movement，characters 预览进程未采样明确保留，22 项哈希一致；只修证据、未重跑。实际运行源仍为 4b99b59，Site v13 不变；不重计新增交付，不据此认定画面／手感品质或整机 GPU 空闲。
