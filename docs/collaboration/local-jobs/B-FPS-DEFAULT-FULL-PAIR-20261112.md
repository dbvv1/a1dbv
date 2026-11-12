# B-FPS-DEFAULT-FULL-PAIR-20261112 · 当前默认与全场材质成对验收
id: B-FPS-DEFAULT-FULL-PAIR-20261112
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 402dd688f6da351477036ab884614f9f38e4c46d
result_branch: relay/b-fps-default-full-pair-20261112

## 目标与派发顺序
当前默认与 ai-courtyard-full-v1 同机位成对图，加拟发布入口六回合完整 smoke、连续帧间隔。Star 已交回失败证据且 cleanupErrors=[]／Node exit=1，本卡接续独占槽；本卡交回前不派 MOBA。不是用户画面判优，不换默认、不部署。
拍摄1280×720；完整smoke采用既有脚本1365×900，两组尺寸一致并分别如实记录，不改工具凑同尺寸。固定源为上述SHA；本机只读定位现成采集入口，不要求桌面连接。

## 按哪个规格
读取固定源 AGENTS.md、docs/brief.md、docs/quality/current-capture.md、src/default-route.ts、src/capture/cameras.ts、tools/smoke.mjs、tools/smoke-backlog.mjs。
只用现成工具和已装依赖，不新增/修改 smoke、拍摄或验收工具，不改源、配置、锁文件、资产，不恢复旧取消卡。旧本机设备可见性不再作为阻塞。

## 固定入口与三机位
BASE 仅为本次构建的本机 preview 实际监听地址，不用线上或旧服务。Q 为 `?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1&lighting=courtyard-light-v1`。
前图：BASE + Q + `&qualityCapture=<机位>`；后图：BASE + Q + `&materials=ai-courtyard-full-v1&qualityCapture=<机位>`。
顺序 gameplay → courtyard-gap → cross-lane；每机位前、后各两次独立加载，共12张。1280×720、DPR1、FOV80，软件SwiftShader、headless，同一浏览器二进制/renderer。
- gameplay：固定回放后实际玩家 eye/yaw/pitch，保留枪体；不能以旧1v1机位代替。
- courtyard-gap：position=(2.6,1.62,6.4)，yaw=-0.28，pitch=-0.04，不显示枪体。
- cross-lane：position=(-7.5,1.62,-9.5)，yaw=0.32，pitch=-0.03，不显示枪体。
冻结 replay：seed1、easy、9 Bot、idle-zero-move、60Hz、tick120、t2、frame0、12次dt0预热；不调用__shotNext，不加feel/smoke/seed/t/input/frames，不注入状态或改相机。
核__shot.ready、无error、#boot隐藏、WebGL2、art ready/active、lighting courtyard-light-v1；后图materials为ai-courtyard-full-v1且非fallback。保存去pngDataUrl元数据及实际PNG。
同机位双拍RGBA/state/commands/camera/replay/renderer相同；前后模拟状态与相机相同，不要求前后像素相同。
本机先只读找到原B-FPS-FIXED-CAPTURE-20261104已运行harness及后继修正版，记录现成路径、SHA256、实际命令；沿原qualityCapture接口采集，不调用只支持旧1v1的tools/capture.mjs。
原d75b12e产物的harness曾browser.close失败、exit1，未被接收；不能原样当合格工具。现成入口须支持本卡固定SHA、两组query、唯一输出、正常关闭；仅通过其已有参数配置，不改脚本、不新建CLI/验收工具、不修改或忽略硬编码旧SHA。若未找到可用入口，回具体文件/调用/不支持项及工具失败，不自行实现补丁。

## 现成完整smoke命令
独立干净worktree固定上述SHA；构建前后核HEAD、tree与tracked clean。下列为PowerShell语法，仅设置本进程环境：
```powershell
$env:DEBUG='pw:browser'
$env:FPS_SMOKE_RENDERER='software'
Remove-Item Env:FPS_CLOUD_NO_SANDBOX -ErrorAction SilentlyContinue
node tools/smoke-backlog.mjs --full-materials
```
该现成命令自行npm run build，再串行当前默认空query和Q+materials；无smoke固定短带参数，保sandbox，移除Playwright默认unsafe标志，显式--use-angle=swiftshader、headless。
实际固定1365×900/DPR1，不接受viewport环境覆盖，不能标作1280×720。现成输出为outputs/offline-training-smoke/402dd688f6da-<mkdtemp唯一后缀>，manifest给精确根；只调用一次，不换根补跑。
六自然回合、第三回合换边、终局与再打一场后可推进；frameTiming原始连续样本、逐回合统计、active mean/p95及两路比值必须随报告保留。它测rAF帧间隔，不是GPU时间/输入延迟，非相同输入回放。

## 输出、退出与交回
拍摄唯一原始根 `outputs/B-FPS-DEFAULT-FULL-PAIR-20261112/402dd688f6da-swiftshader/` 必须此前不存在，逐图排他写入；smoke保留其脚本生成的唯一根，不覆盖或重命名原始记录。
本卡总交付唯一目录 `docs/quality/capture/B-FPS-DEFAULT-FULL-PAIR-20261112/402dd688f6da-swiftshader/`，不得覆盖已有目录。只复制本次原始产物的公开脱敏副本，不改历史产物。
记录开始UTC/回传UTC、完整源SHA/tree、构建文件hash、实际入口、浏览器完整版本、原始renderer/vendor/version、尺寸、启动参数与headless事实；DEBUG原日志只本机保存，公开副本脱敏。
逐命令真实exit/signal；browserDisconnected、previewPortClosed及浏览器实际退出日志。安全关闭本次可归属资源，不碰他人进程。失败保完整产物和首错，停止后续浏览器步骤，不切GPU/工具/浏览器重试。
仅推result_branch并回review_ready；包含12PNG、逐拍元数据、smoke manifest/reports/raw frame samples、构建hash、退出证据、简短README。公开扫描与diff检查后提交，身份noreply；不合main。
两位非作者只读同机位匿名图，均不判更差且至少一位偏好后图，再结合完整smoke与帧耗由dot决定默认；不足不计覆盖。声音和硬件画面不在本卡验收。

## 当前结果

- 本单元完成公开脱敏证据落盘但任务范围受阻：402dd68 默认档完整 smoke 首跑 exit 1，tools/smoke.mjs:125 按键 2 后等待 weapon==='pistol' 30s 超时，materials 子运行未开始，六回合未完成（round1 active=114，round2-6=0）；拍摄未执行，因现成三份 harness 均硬编码旧 fa8740d/tree 417652e6 且仅有固定 query、无 commit/query 参数，按卡片未改脚本、未忽略旧 SHA。已交付 README、environment、capture-tool-gap、smoke 报告与 SHA256SUMS（8/8 校验一致，脱敏扫描无命中）。未运行验收：npm test 未跑（未改源码/配置/锁文件），12 张 1280x720 图、画面与帧耗对比、默认切换与部署均未做。openIssues：拍摄入口缺 commit/query 参数；默认档冒烟在武器切换处超时待定位。
- 产物：[1336856](https://github.com/dbvv1/FPS-Like/commit/1336856aca907a4f840f94fdfee42c500a6c09f7)，分支 `relay/b-fps-default-full-pair-20261112`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：负责人决定：(1) 提供支持 402dd68 与两组 query 的现成拍摄入口，或明确授权修正旧 harness；(2) 定位 tools/smoke.mjs:125 按键 2 后 weapon 未变 pistol 的原因（产品缺陷或环境/脚本问题）后再定是否重跑完整 smoke 与六回合/帧耗对比。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
