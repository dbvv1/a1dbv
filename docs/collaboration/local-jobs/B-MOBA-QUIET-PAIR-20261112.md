# B-MOBA-QUIET-PAIR-20261112 · 当前默认与 quiet 成对验收
id: B-MOBA-QUIET-PAIR-20261112
owner: dot-B
kind: build
status: revision_requested
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: b8a377078e15c0dd2fb7c367b0bf24adbee09468
result_branch: relay/b-moba-quiet-pair-20261112

## 已接收与未完成

原卡11-12 06:30派发、06:35:10领取、19:05收集交回；原结果aabc47be6c806d66d2278dc808f6750ee2bee5c0。16张1280×720成对图、清理及两位非作者4/4偏好quiet已接收，见[原盲选](../moba-quiet-blind-20261112.md)，不重复拍摄。default旧整局tick9010到终局，因同帧rAF误报失败，quiet整局未跑；观察器已在b8a3770修复，9/9回归。全套614/615唯一cast.ogg旧缺项在未改版本复现，不能称全套全过。旧命令及过程保留Git历史，本轮以下文为准。

## 11-13 仅补双路完整 smoke（本轮权威执行范围）

按用户11-13换默认纠偏，取代上文旧命令和“等FPS所有历史清理”门槛。Star已上线v11；FPS旧全场材质性能取舍已决定接受，原卡证据接收并释放槽。原FPS三个unit注册3522身份已核无存活，unit-3 exit0／子树settled；缺失历史probe等回执记欠项，不要求恢复后才开始。本卡沿原id/result_branch续接，不新建重复卡；先核本卡原调用已结束及当时实际资源，不结束其他工作；若发现新活跃同单元只读进展不重复启动。

读 game-quality-pass 的 capture.md、目标仓AGENTS.md及 tests/client/browser-smoke/README.md。固定新base_ref b8a377078e15c0dd2fb7c367b0bf24adbee09468，干净独立worktree；Node22.23.2及原已装Chromium，禁止安装／升级、改锁文件或安全设置。只headless、不显示窗口、不操作桌面、不模拟桌面键鼠；页面自动化沿原完整smoke，不换renderer或浏览器绕过安全拒绝。

不重拍原16张图、不重做静态盲选、不运行探针。仅构建web后依次default完整smoke、quiet完整smoke。固定两路同一Chromium（记录版本、二进制SHA256及真实renderer），SwiftShader，同原脚本1280×900／DPR1，HUD遍历保持原规格，不称1280×720帧耗。输出根 outputs/B-MOBA-QUIET-PAIR-20261112/b8a3770-full-r2，新建且不覆盖原结果；构建前后记录HEAD/tree/tracked状态。

```powershell
npm run build:web
$env:MOBA_SMOKE_SOURCE_SHA='b8a377078e15c0dd2fb7c367b0bf24adbee09468'
$env:MOBA_SMOKE_RENDERER='software'
$env:MOBA_SMOKE_VARIANT='default'
$env:MOBA_SMOKE_OUTPUT='outputs/B-MOBA-QUIET-PAIR-20261112/b8a3770-full-r2/default-smoke'
Remove-Item Env:MOBA_SMOKE_CLOUD_NO_SANDBOX -ErrorAction SilentlyContinue
node tests/client/browser-smoke/run.mjs --full-match
# 核原命令、浏览器退出与preview关闭后再执行quiet：
$env:MOBA_SMOKE_VARIANT='quiet'
$env:MOBA_SMOKE_OUTPUT='outputs/B-MOBA-QUIET-PAIR-20261112/b8a3770-full-r2/quiet-smoke'
node tests/client/browser-smoke/run.mjs --full-match
```

MOBA_SMOKE_CHROMIUM只设当前子进程并指向原已装二进制，不能换二进制重试失败。两入口分别为 `/` 与 `/candidate.html?materials=quiet-family-v1&lighting=forest-light-v1`；不加入其他候选，不跳过完整restart／输入／存档恢复及HUD断言；自然tick0至终局，不手工推进或伪造状态。

首次失败保首错、报告及真实退出；确为测试脚本路径／参数／Node22兼容／选择器或观察逻辑的小问题，允许只修 tests/client/browser-smoke/ 及其直接测试，回归后重跑失败命令一次，不能一失败就blocked。禁止改游戏src、资产、默认、依赖、删除断言、放宽终局或无限重试。若公共测量语义改变，两路需同补丁，保首次及重试独立目录；第二次失败或游戏缺陷原样交回，另一独立入口能安全执行则照常收证。安全拒绝不绕路。

交回原report.json、manifest.json、full-match-frames.json、终局及操作图、构建/脚本patch哈希、Node/Chromium/renderer、真实开始/交回UTC、exit/signal及浏览器/preview退出证据；脱敏私人绝对路径，不伪造缺项。按原已修收集方式收进 docs/quality/capture/B-MOBA-QUIET-PAIR-20261112/ 的短目录，保原始字节SHA映射，避免被忽略outputs或Windows长路径导致收集失败；不改接收端。交回review_ready，执行者不合main、不换默认、不部署。负责人两路完整smoke通过且帧耗无明显劣化后，沿已过双非作者静态盲选当轮换默认。
