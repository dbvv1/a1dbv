# B-MOBA-QUIET-PAIR-20261112 · 仅补 default 完整 smoke
id: B-MOBA-QUIET-PAIR-20261112
owner: dot-B
kind: build
status: revision_requested
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: cb025e897b9d92f9db470d0a057098adb0404f87
result_branch: relay/b-moba-quiet-pair-20261112

## 已接收范围

11-13 05:19交回的332fa5f证据及两处测试脚本修复已接收进main cb025e89。quiet retry完整流程通过；default首轮自然整局tick9010终局，但后续存档弹层阻断初始化，retry初始ready超时，仍缺完整流程。四份报告均有Chromium exit0／previewClosed，未以此冒充外层退出回执。详见目标仓 docs/quality/capture/B-MOBA-QUIET-PAIR-20261112/b8a3770-full-r2/acceptance.md。

保留quiet通过证据和原16张图、两位非作者4/4偏好quiet结论，不重跑quiet、不重拍、不重盲选。default均帧489.49ms／p95 550，quiet502.14／570.1；软件共享机数据，不称硬件GPU结果。paths清单59项中47项未入Git是收集欠项，不否决已有证据、不冻结其他案例。当前未换默认、未更新网站。

## 修改要求（取代旧双路命令）

读 game-quality-pass 的 capture.md、目标仓AGENTS及 tests/client/browser-smoke/README.md。本卡唯一需要新执行的内容是 **default 完整流程 smoke**。固定base_ref独立干净worktree；该版本仅测试脚本和证据变化，游戏、quiet材质和帧耗测量语义未变。

开始先核原调用和当前实际资源：同单元若仍活跃只读进度，不重复启动、不杀其他任务。旧浏览器／preview已退出；外层缺收集单记债务，接收端核当前资源可用后执行。独占拍摄槽，交回后才轮到Star卡；状态标签不证明运行。

只用Node22.23.2及原已装Chromium；记录版本、二进制SHA、真实renderer。SwiftShader／1280×900／DPR1沿原规格，不称1280×720。仅headless、隐藏子进程窗口、不操作桌面、不模拟桌面键鼠。禁止安装升级、驱动探针、改安全设置或换浏览器绕过拒绝。MOBA_SMOKE_CHROMIUM只设本子进程原二进制。

```powershell
npm run build:web
$env:MOBA_SMOKE_SOURCE_SHA='cb025e897b9d92f9db470d0a057098adb0404f87'
$env:MOBA_SMOKE_RENDERER='software'
$env:MOBA_SMOKE_VARIANT='default'
$env:MOBA_SMOKE_OUTPUT='outputs/B-MOBA-QUIET-PAIR-20261112/cb025e89-default-r3/default-smoke'
Remove-Item Env:MOBA_SMOKE_CLOUD_NO_SANDBOX -ErrorAction SilentlyContinue
node tests/client/browser-smoke/run.mjs --full-match
```

新输出目录不得覆盖旧证据；记录构建前后HEAD/tree/tracked状态，入口 `/`，自然tick0到终局及完整restart／输入／存档恢复／HUD断言，不手工推进、不伪造状态。

首次失败保原报告和退出。确属测试脚本路径、选择器、参数、Node22兼容小问题，允许只改 tests/client/browser-smoke/ 及直接测试，回归后独立目录重跑失败命令一次；不改游戏、资产、默认、依赖、测量语义，不删除断言、不放宽终局。第二次失败或真实游戏缺陷原样交回，勿无限重试。安全拒绝不得绕路。

独立收集欠项：只从原已有磁盘产物补47项，不重执行旧命令、不再造回执；缺文件如实列出。保原字节哈希映射并脱敏私人绝对路径，不改接收端。

交回新report、manifest、帧数组、关键图、测试patch与回归、构建来源、Node／Chromium／renderer、真实开始结束UTC、外层exit/signal、浏览器／preview关闭及当前资源证据。产物收进目标仓 docs/quality/capture/ 本卡短目录，公开扫描后沿原result_branch交回review_ready；不自行合main、换默认或部署。负责人结合已有quiet／盲选及本次default决定换默认；收集欠项单列。
