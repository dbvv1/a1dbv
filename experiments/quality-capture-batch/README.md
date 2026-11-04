# 三案例固定基线拍摄

🧪 **本目录的 `run-batch.py` 保留 2026-10-29 冻结来源和 GPU 合同，不是当前软件 WebGL2 拍摄入口。** 不把新 Star consumer 交给这里的旧 `star-adapter.mjs`，也不改旧收据解除冻结。当前 Star 使用其仓库的 `tests/capture.mjs`。

2026-11-04 增加本机 Windows D3D11 档。独立 `fps-worker.mjs` 用环境变量 `CAPTURE_RENDER_PROFILE=d3d11` 选择 `--enable-gpu --use-angle=d3d11`；未填时保留 SwiftShader 三参数，`CAPTURE_RENDER_PROFILE=swiftshader` 也可显式选择。D3D11 保留浏览器沙箱、仅排除 Playwright 默认的软件回退 opt-in，软件档保留此前配置。所有实际 argv 都要核验，未知档、混用后端或 D3D11 回退软件会失败，不自动换档重跑。

`run-batch.py` 的私有配置新增 `"renderProfile": "d3d11"`（缺省同值），统一传给 MOBA、FPS、Star，并核每份回执的档名。该历史冻结批次仍只收 GPU：MOBA／FPS 保留原 `gpu` 和 unmasked 断言，另核真实 D3D11 renderer；Star 还必须匹配原独立硬件诊断的精确 renderer。软件档可用于独立 FPS worker 和功能 smoke，但不能因此改写旧批次的 GPU 合同或过去结论。新 GPU 档只是请求，GPU 是否可用仍待本机实跑证据。

两目录共享 `../three-feel-functional-smoke/checks.mjs`，复制时保留相对布局，相关摘要已列入清单。独立 FPS 的访问仍仅限本次 loopback 预览，拒绝重定向、跨源与 WebSocket；外层执行沙箱不变。每组前后图固定同档、同浏览器与 renderer，保留版本、原始 renderer 和重复结果。

本次没有开启本机窗口或浏览器任务，也未执行 GPU 出图；CPU 测试通过不代表已经取得浏览器帧。

以下为原冻结批次说明，**不作画面品质结论。** 接收端按[任务卡](../../docs/collaboration/local-jobs/B-THREE-CASE-QUALITY-CAPTURE-20261029.md)核串行条件，复制本目录到私有执行目录后，填写本地配置并执行一次。配置、启动日志、原始进程路径不提交 Git。

```sh
python test-preparation.py
python -O test-preparation.py
python run-batch.py private-receiver-config.json
```

执行前逐项核 `SHA256SUMS.json`；只复用既有离线依赖，不安装／升级浏览器。`receiver-config.example.json` 全是占位，不能直接运行；真实原成功收据须为本地 JSON，`receiptFields` 的 JSON pointer 对应原 executable path、文件 SHA256、browser version 与 passed 字段。脚本读取原文件逐项比对、记录收据哈希，实际 browserVersion 再与冻结版本相等才接收；缺失就阻塞，不改字段造收据。

## 当前固定合同

全部1280×720、DPR1、12次不推进时间的预热、每机位两次独立拍摄、frame0。完整 source/tree/相关文件摘要在 `batch-draft.json`。

| 案例 | 命名机位 | 游戏内输入与时间 | 相机 |
|---|---|---|---|
| MOBA8ade2d1 | gameplay | seed1,march,t10；presentation600 | 英雄真实跟随，y24,z+18,FOV45 |
| 同上 | spawn | 同上 | eye(-94,24,19.2),target(-94,0,1.2),FOV45 |
| 同上 | first-tower | 同上 | eye(-28,24,18),target(-28,0,0),FOV45 |
| 同上 | spawn-to-tower | 同上 | eye(-65,62,46.5),target(-65,0,0),FOV45 |
| FPSabc139f6 | gameplay | 当前offline真实Game，seed1/easy，120ticks/t2，idle玩家+9bots，art开启 | 玩家真实眼位/瞄准，FOV80，正式HUD/枪 |
| 同上 | courtyard-gap | 同上 | 模拟坐标(2.6,1.62,6.4)，yaw-.28,pitch-.04,FOV80 |
| 同上 | cross-lane | 同上 | 模拟坐标(-7.5,1.62,-9.5)，yaw.32,pitch-.03,FOV80 |
| Starf1da86c | coast-chase | coast-reborn，seed73121，road-tour,t28/tick1680 | 正常追尾，FOV62 |
| 同上 | coast-full-bend | 同上 | 道路坐标eye(480,130,100),target(460,-55,0),FOV58 |
| 同上 | academy-depth | academy-reborn，seed95276，road-tour,t14/tick840 | 正常追尾，FOV62 |

MOBA content11、Veyra1v1、普通bot seed1002、baseline灯光；march仅首逻辑tick发普通move(-18,1.2)，simTick/stateHash以实测为准。Star高画质、road-v2、Mint Comet#83cde4、练习circuit、无ghost，时间含3.05s倒计时，181m/479m不是注入坐标。FPS使用新qualityCapture入口，旧1v1 shot不得替代；两个observer不证明玩家可达性。

## 收尾与证据

MOBA→FPS→Star依次执行，一例失败停止后例。MOBA复用原capture.lock；之后FPS—Star尾段用同一个既有根和原acquireCaptureLease连续持锁，竞争失败就停。租约不证明全机无别的GPU任务，执行前仍由原接收端核真实队列与退出链。

脚本提前登记每个子进程，真实wait后写exit/signal；中断记unknown并停批。FPS/Star复用MOBA BrowserServer/preview收尾helper；信号同步设非零退出，不会因最终写文件窗口放行。所有自有退出证据齐全后才释放精确匹配owner；缺证保锁，无强杀、按名称清理或自动回收。生成的消费者仅加独立路径接线、首帧GPU断言和收尾，不改 runtime 或模拟；只按显式 D3D11 档接线启动参数，保留 GPU 证据与收尾门槛。

每轮独占目录保留源码/构建清单、请求、原始renderer/vendor/version/class、相机/时钟/状态、PNG与RGBA摘要、重复比较和自有进程退出。MOBA/FPS核服务字节；Star原消费者核road bundle，另留完整本地构建前后摘要。Star的observableStateProjectionSha256仅为公开state/player/camera/tick投影，inputRequestSha256仅请求摘要；不是完整模拟或控制器输出流。FPS另有实际commands摘要。

只接受原始GPU分类与两拍一致。Star原分类还要求实际独立GPU诊断的精确renderer匹配，不能凭“非软件”改成gpu。配置和原始日志留私有目录；公开导出按任务卡保留可核对事实并移除私有路径、nonce、WebSocket地址，不能改写renderer或失败状态。

## 验证范围与未覆盖

本次已过非作者独审、Python 普通及 `-O` 各 6 项故障／配置测试、Node 7 项真实源适配回归及生成消费者语法检查；尚未做此批真实 GPU 运行。FPS游戏内capture源码另通过339项CPU测试及build/typecheck。接收端只跑本包的受影响检查和固定构建，不跑无关完整CPU套件。

手感仅现有回放可导出：MOBA idle/march；FPS本轮idle+真实bots；Star road-tour/idle/accelerate-brake。三例均不录声音，不能证明输入到画面／音频同帧；CPU隔离曲线不能替代十人局录像。当前任务不补回放框架或音频管线。

依据：a1dbv `f4b4e801` game-quality-pass与game-taskbook§7；三个固定提交的capture规范及代码；2026-10-29只读核查和CPU故障测试。目标图、双盲与品质判定由dot接到有效实图后另做。

## 新档 CPU 回归

`MOBA_CAPTURE_SOURCE` 指向 `8ade2d1` 的冻结检出（带既有依赖），`STAR_CAPTURE_SOURCE` 指向 `f1da86c` 的冻结检出。运行 `node --test render-profile.test.mjs`：真实源消费者只生成、不导入执行；验证生成脚本语法、真实 launch 对象的参数、缺失／改动的 launch 合同和非法档名失败路径。正常与 `python -O` 各跑 `test-preparation.py`，覆盖批次只收 D3D11、三路统一传档与回执核验。共享两档参数和 renderer 检查由相邻 `browser-policy.test.mjs` 覆盖。

历史固定来源、浏览器成功收据、构建摘要、串行队列和租约条件继续生效；本次不安排新的本机出图卡。
