# 三案例固定基线拍摄

🧪 **只用于本轮已冻结的十个机位，取得真实图，不作画面品质结论。** 接收端按[任务卡](../../docs/collaboration/local-jobs/B-THREE-CASE-QUALITY-CAPTURE-20261029.md)核串行条件，复制本目录到私有执行目录后，填写本地配置并执行一次。配置、启动日志、原始进程路径不提交 Git。

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

脚本提前登记每个子进程，真实wait后写exit/signal；中断记unknown并停批。FPS/Star复用MOBA BrowserServer/preview收尾helper；信号同步设非零退出，不会因最终写文件窗口放行。所有自有退出证据齐全后才释放精确匹配owner；缺证保锁，无强杀、按名称清理或自动回收。生成的消费者仅加独立路径接线、首帧GPU断言和收尾，不改runtime、模拟或安全flags。

每轮独占目录保留源码/构建清单、请求、原始renderer/vendor/version/class、相机/时钟/状态、PNG与RGBA摘要、重复比较和自有进程退出。MOBA/FPS核服务字节；Star原消费者核road bundle，另留完整本地构建前后摘要。Star的observableStateProjectionSha256仅为公开state/player/camera/tick投影，inputRequestSha256仅请求摘要；不是完整模拟或控制器输出流。FPS另有实际commands摘要。

只接受原始GPU分类与两拍一致。Star原分类还要求实际独立GPU诊断的精确renderer匹配，不能凭“非软件”改成gpu。配置和原始日志留私有目录；公开导出按任务卡保留可核对事实并移除私有路径、nonce、WebSocket地址，不能改写renderer或失败状态。

## 验证范围与未覆盖

本工具已过独审、Python普通及-O各4项故障测试、Node/生成消费者语法检查；尚未做此批真实GPU运行。FPS游戏内capture源码另通过339项CPU测试及build/typecheck。接收端只跑本包的受影响检查和固定构建，不跑无关完整CPU套件。

手感仅现有回放可导出：MOBA idle/march；FPS本轮idle+真实bots；Star road-tour/idle/accelerate-brake。三例均不录声音，不能证明输入到画面／音频同帧；CPU隔离曲线不能替代十人局录像。当前任务不补回放框架或音频管线。

依据：a1dbv `f4b4e801` game-quality-pass与game-taskbook§7；三个固定提交的capture规范及代码；2026-10-29只读核查和CPU故障测试。目标图、双盲与品质判定由dot接到有效实图后另做。
