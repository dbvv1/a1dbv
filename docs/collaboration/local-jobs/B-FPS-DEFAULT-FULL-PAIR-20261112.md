# B-FPS-DEFAULT-FULL-PAIR-20261112 · 当前默认与全场材质成对验收
id: B-FPS-DEFAULT-FULL-PAIR-20261112
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 658b2e592c612fa0801e2cc7fecdce32bb57eadb
result_branch: relay/b-fps-default-full-pair-20261112

## 目标、顺序与环境
当前默认与 ai-courtyard-full-v1 同机位成对图，以及六自然回合完整smoke和连续帧耗。沿原id/result分支返工，不新建重复卡。
MOBA原卡收集退出已核；Star原卡0cf62c6两入口整局于2026-11-12T19:50:53Z交回，真实exit0、cleanupErrors为空且16件产物哈希复核通过。2026-11-12T21:10:03Z负责人释放独占拍摄槽并沿本卡revision_requested派发；本卡交回并核清资源前，不激活MOBA。派发不等于本机已启动。
读固定源 AGENTS.md、docs/quality/current-capture.md、src/capture/cameras.ts，以及 a1dbv 游戏细则§6第3条／§7。
本机用 **Node22.23.2**，不硬需24；仅现成匹配锁文件依赖和指定Chromium，不安装／升级软件，不改锁文件、持久环境或系统安全设置。
只headless、不显示窗口、不模拟桌面键鼠、不操作桌面；页面自动化沿现成smoke。两路同浏览器与SwiftShader，不切GPU或换工具绕失败。

## 一次脚本修复权限
- 首次失败保首错、产物、真实退出，先核原调用与本次browser/preview已清理。确属测试脚本路径、参数、Node22兼容或观察逻辑小问题，可只改 `tools/smoke.mjs`、`tools/smoke-backlog.mjs`、`tools/capture-quality-pair.mjs`、`tools/quality-pair-support.ts`、`tools/capture-support.ts` 及其直接测试，当场修复并跑回归，**重跑失败命令一次**，不一失败即blocked。
- 不准修改 `src/` 游戏代码、资产、默认参数、依赖或锁文件；不能删除断言、伪造状态、直接赋武器、加无限重试或降低六回合／成对图／帧耗门槛。游戏缺陷、第二次失败、未知退出、安全拒绝或缺依赖交回blocked。
- 已通过独立步骤不盲重跑；smoke-backlog是两入口聚合命令，失败后获准复跑会重测默认，须保留整次独立证据。补丁改变公共测量语义时，两路须同补丁完整证据。保留首次失败与修复尝试独立目录、patch/hash、相关测试、实际脚本提交／源base，不能覆盖旧结果。

## 当前main与按2切手枪的定位
旧402dd68回执仅能证明按2后30秒未观察到pistol；它本身不能区分游戏/脚本原因。当前main已有慢帧一次性输入被discardBefore丢弃的产品修复与CPU回归，**本轮不再修改游戏代码**。
复验先记录真实按键/消费时序和武器状态；若仍失败，读原始时序判断是脚本事件/等待不正确还是游戏未处理，不能默认加等待。CPU复现不等于本机浏览器原因已闭环。

## 完整smoke
固定base_ref独立干净worktree，记录源SHA/tree、Node/npm/Chromium版本；过程只设置本进程环境：
```powershell
$env:DEBUG='pw:browser'
$env:FPS_SMOKE_RENDERER='software'
Remove-Item Env:FPS_CLOUD_NO_SANDBOX -ErrorAction SilentlyContinue
node tools/smoke-backlog.mjs --full-materials
```
`FPS_SMOKE_CHROMIUM`指定现成浏览器；拍摄时 `FPS_CAPTURE_CHROMIUM`用同一文件。保持sandbox及原参数。
脚本自行build并顺序测当前默认空query和全场材质入口。六自然回合、第三回合换边、终局与再打一场后推进，固定1365×900/DPR1；不把smoke写成1280×720、不注入状态或跳tick。
保留每次脚本mkdtemp生成的唯一输出根、manifest/reports/raw frameTiming与逐回合统计，核active mean/p95与两路比值。rAF间隔不是GPU时间或输入延迟。

## 成对拍摄
只用当前仓库 `tools/capture-quality-pair.mjs`，不得调用旧本机硬编码SHA/query的harness。
Q=`?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1&lighting=courtyard-light-v1`，后图Q追加`&materials=ai-courtyard-full-v1`。
在同PowerShell设置完整参数，输出父目录须存在、最终目录必须未存在：
```powershell
$sha=(git rev-parse HEAD).Trim()
$q='?gameplay=offline-training-v1&match=complete-v1&squads=offline-v1&environment=courtyard-v1&art=standards-v1&lighting=courtyard-light-v1'
node --import tsx tools/capture-quality-pair.mjs --commit $sha --query $q --candidate-query ($q+'&materials=ai-courtyard-full-v1') --out ('outputs/B-FPS-DEFAULT-FULL-PAIR-20261112-'+$sha.Substring(0,12)+'-r2-attempt-1')
```
调用前必须核 `$sha` 等于本卡base_ref（有获准测试补丁则另记干净补丁提交，游戏源码不变），不能用HEAD掩盖错误版本。现场脚本修复后attempt-2另目录，最多一次。
三个命名机位依次gameplay/courtyard-gap/cross-lane，前后各两次独立加载共12图；1280×720/DPR1/FOV80，seed1、easy、9Bot、idle-zero-move、60Hz、tick120/t2/frame0，12次dt0预热。不调用__shotNext、不加feel/smoke/seed/t/input/frames。
核__shot.ready、error为空、boot隐藏、WebGL2/art active、lighting正确，后图materials正确且非fallback。保留去pngDataUrl的metadata与实际PNG；双拍RGBA/state/commands/camera/replay/renderer一致，前后模拟/相机一致（像素无需前后相同）。

## 退出、交回与默认决定
逐命令保exit/signal、UTC、browserDisconnected、previewPortClosed和实际浏览器退出日志；只关闭本次可归属资源。原DEBUG日志留本机，公开副本脱敏。
总交付根 `docs/quality/capture/B-FPS-DEFAULT-FULL-PAIR-20261112/<base短SHA>-r2/` 不得覆盖旧目录；含12PNG/metadata、smoke manifest/reports/raw frames、bundle hash、原renderer/vendor/version、完整Chromium/argv、所有尝试退出与修补证据。
公开扫描、独审后只推result_branch，成功review_ready；一次修复后仍不完整则blocked，列准确缺项。接收端不合main、不部署。
两名非作者同机位匿名盲选均不判更差且至少一位偏好新版，完整smoke与帧耗无明显劣化，负责人方可换默认。声音、硬件GPU、升档不前置；无完整证据不计覆盖。

## 当前结果
旧402dd68首跑按2切pistol超时，materials/六回合未完成；旧harness硬编码导致0图。原产物[1336856](https://github.com/dbvv1/FPS-Like/commit/1336856aca907a4f840f94fdfee42c500a6c09f7)保留，browserDisconnected/previewPortClosed=true、浏览器exit0。
2026-11-12T21:10:03Z已派发本次复验，固定base_ref与上列权限不变；待接收端记录实际启动、完成和清理时刻。未交回，不将派发或CPU测试算出图／浏览器通过。
