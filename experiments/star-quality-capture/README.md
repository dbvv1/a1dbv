# Star 两版同机位捕获

本包只服务 [Star 品质闭环卡](../../docs/collaboration/local-jobs/B-STAR-QUALITY-CAPTURE-20261106.md)。它补足原 `tests/capture.mjs` 不记录 `starSideStatus` 的缺口；不修改冻结的游戏源码、相机、时间或候选。CPU 检查与构建摘要不是出图或品质进展。

## 冻结输入

| 档 | commit / tree | road bundle SHA-256 | Worker SHA-256 |
|---|---|---|---|
| 前版 | `811646e8a69bf9803a1de2218b882ab28b4b1f42` / `f11e318d3fc19785db094fd18b4e3160f22c6827` | `25b2ce33b6867bd75d098d84a9abc9f9655c52543dfc466e0021e62de2f72a94` | `132dd430016081c3bfd176ffee4af082fa024d1b9aba38fbc8954f61b000e86f` |
| 整层地形 | `7e87d4c32d5014612fcb7a8af8bc49d266d7238c` / `66fe4f58e9c69e8a7a511ec888e4243e197d9681` | `9768d3fd6dd9bc529c45c5c53d7ccca68b0204e9ad136ca8137d21a6e0125259` | `6be5af90f6c97b34c44f804e5e94ba3c4d53c335bf2398001d02842bac389132` |

2026-11-06 从两个 Git 提交原始 LF 导出并用既有 Node 24.22.1 / 锁定依赖分别运行 `node build.mjs` 得到上表；仅 CPU 构建，不启浏览器。两版 root package-lock SHA-256 均为 `4bfa549f6b3b5b17f4dce128a9b087660bd04210de9cfe9b9cc87c44dc06c83d`，Rapier 子工程锁为 `d7ea6f76c6a71a38b03e75e89e7b7183928f28d496c733858af81b851e1cded4`。仅复用与两锁匹配的已装依赖，不安装/升级本机软件。预检缺项或摘要不同即 blocked，不改预期值让它通过。

## 准备和运行

只用接收端原生进程监督器启动、等待，并以实际句柄写退出回执。本包没有调度器，不证明全机空闲。先按任务卡核单卡与未知调用边界；已有本卡调用/输出只收取原结果，不覆盖、换根或重跑。

1. 在两独立 worktree 用仅本次 Git 命令的 `-c core.autocrlf=false` 精确检出对应 SHA，并核源文件为 Git 原始 LF 字节，不改全局配置；初始 tracked clean 且没有未跟踪源码。拍摄包和输出放源 worktree 外。保存本包所有文件 SHA-256。复用既有 Node 24、Python 3、Chrome for Testing 156.0.8078.4、playwright 1.64.1、pngjs 7.0.0、锁定 esbuild/Three/Rapier。浏览器预检只读 VersionInfo 和文件哈希，不能运行 `chrome --version` 或打开探测浏览器。实际启动后核 `browser.version()`。
2. 先跑 `node --test TOOL/contract.test.mjs`、`node --check TOOL/capture.mjs`、`node --check TOOL/compare.mjs`；`TOOL` 是本包的实际路径，不能把示例变量当真实路径。可用已安装源依赖运行 `STAR_CAPTURE_SOURCE=SOURCE node --test TOOL/compare.test.mjs`（Windows 用进程环境传入）。这些仅 CPU 检查。
3. 两档均清除进程中其他 `STAR_RUSH_` 候选配置，再显式设：DRIVING_MODEL=road、COAST_FLOW=baseline、SIGNBOARD_VARIANT=baseline、SKY=kenney、COAST_AMBIENCE=off、RAIL_SOURCE=kenney、DRIVING_AUDIO=procedural、CANVAS_HOUSE_ANCHORS=off，键都加 `STAR_RUSH_` 前缀。`STAR_RUSH_CAPTURE_CHROMIUM` 仅指向已核二进制，Node 24 路径也仅进入本进程，不改系统环境。
4. 在每个 worktree，监督器以 `windowsHide=true` 启动 `node --import TOOL/windows-hide.mjs build.mjs`，实际 wait exit 0 后才继续。这就是 `assemble.py` 的 Node 构建步骤，绕开 Python 子命令潜在闪窗；preload 覆盖 Node 子进程 API 并通过本进程 NODE_OPTIONS 传给嵌套 Node，不改源和全局设置。已有 NODE_OPTIONS 若有未核 hook，先停，不叠加未知入口。
5. 记录构建真实命令/退出、环境、HEAD/tree、前后文件清单与 SHA-256。允许生成目录 `dist/`、`worker/index.js`、`experiments/rapier-road-comparison/dist/` 的预期差异，源码必须保持固定字节。前版与整层版源码仅四文件差异；整层版重建会改已跟踪生成物，必须记 wholeTreeDirty，不能写成全树 clean。本包在启动预览前强制核上表两个构建摘要，旧 dist 不能代拍候选。
6. 每条运行 `node --import TOOL/windows-hide.mjs TOOL/capture.mjs SOURCE OUTPUT SHOT COMMIT`；四个位置参数都是卡片固定值的实际路径/名字，不增加其他参数。独立 output 须此前不存在，父目录先创建。脚本仅开自己的内存 SQLite Worker loopback 预览，读取实际 origin；无生产访问、桌面操作、系统/页面键鼠、声音、实时 smoke 或 Canvas fallback。
7. 每条运行前监督器注册本轮 Node 身份/创建时间/父链、实际 argv/开始 UTC，安装退出观察后再启动。实际 wait 后只写该 output 下 `receiver-exit.json`，至少 `{waited:true,exitCode:0,signal:null,startedAt:"实际 UTC",endedAt:"实际 UTC"}`；值只能来自此次真实 wait。非零/缺失保留事实，停止剩余命令，不从 Workflow completed/报告/文件存在补造 exit。完整 PID/路径/argv/调试端点只留本地。只对已知本轮资源安全收尾。
8. 每拍等待 `__shot.ready || error` 最多 120 秒；先记录原始 sideStatus，再断言 space=true、power=false、warnings=[]、WebGL2、软件 renderer、固定画面/时钟。150ms 静置期间状态与 PNG 不动；每机位两次独立 context 的状态和 PNG 一致。任何首次失败保存已有文件并停止，不补拍、不另启诊断实例。每条结束，harness 的 BrowserServer 真实 exit、preview close 与 Node wait 全通过才开始下一条；unknown 只阻断相关浏览器步骤。
9. 六条全部通过后 `node TOOL/compare.mjs SOURCE ROOT ROOT/comparison.json`：核12张 PNG 文件及 RGBA 哈希、每档双拍、跨档同机位车/相机/种子/时钟/renderer一致；academy 必须逐像素不变。两 coast 允许图不同，不因“有差异”判好。compare 输出必须为新文件。眼睛实际看过每张非空/错误页后交图，盲评与记分由非作者进行。

## 报告与限制

report 分列 capturePassed、cleanExitBaseline；它只能自证 BrowserServer 和同进程预览的收尾。harness 自身是否退出由 receiver-exit 证明，比较器强制核它。实际 browser close 事件不替代 process exit。若关闭调用自身挂起，报告不会完成，接收端保留 unknown，不启动下条。收到中断后不再开始下拍，保留已知进程的安全收尾；不得把超时或进程消失补写为 exit 0。

公开副本将 URL origin 换 BASE，保留路径、全部查询、原始 renderer/vendor/version、规定参数、状态、尺寸、文件哈希和真实退出事实。去用户名、本机路径、完整 argv、wsEndpoint、凭据和私人日志，并注明脱敏。不上传桌面截图，也不把脱敏副本说成原始日志。本包不授权默认分支合入、部署、硬件 GPU 或新任务。
