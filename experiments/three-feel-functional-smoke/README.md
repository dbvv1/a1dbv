# 三作手感候选：功能 smoke 未放行工具包（未发布、禁止执行）
kind: build
status: blocked

## 目标
三作通过单元/CPU独审后的候选，验证真实headless WebGL2加载和生产推进，默认/旁置隔离；不是10机位品质拍摄，不评手感优劣、GPU材质或屏幕延迟。
固定FPS新远端41b696743f021efa8ddcbc1efd2c9cdf7153ed28/tree df48c2174d4040c417d075743234fabd531e1a7f，独审本地3d63同树，343CPU/build及独审11项通过；旧b9c UI结果不算新41 smoke。
MOBA 8fcab371108f23b8be659eef1db0466561e3b597/treee72877d4db44e49eea3f177d3a4977055022234d；Star远端ac2461ac736d3bbb69a31d973efdf0cf9176adec/tree fa721aaff7577705d689fc6392e1b79398e87b7f已读回，与独审本地a656同树。

## 按哪个Skill
最新a1dbv 5561e38e47b1a60166192660b15440a58c24e5ed细则§7与各仓AGENTS。虽§7允许页面smoke输入，本卡按父任务更窄边界：不模拟键鼠，不DOM点击、不dispatchEvent、不改sim或存档状态。只导航、读诊断和调用现有游戏内部固定回放推进。
启动硬前置：核原Star42调用及10机位批次真实结束/自有浏览器、预览服务、父链和残留真实退出；任何未知仍blocked。不能凭Git/status/锁/排队判断槽空闲，不重试或打断旧任务，不删除锁、不杀未知进程。该硬前置需接收端人工/原进程回执核实，JSON approved不是替代证据。
云端已知标准headless sandbox保持时socket EPERM(exit -6)，不再次尝试，不使用no-sandbox或unsafe开关。复用接收端已装浏览器/Node/依赖，不下载/安装。固定一次Chromium，不因失败/软件renderer换配置重跑。

## 写入范围
源码/资产/依赖锁只读。按冻结候选正常构建，完整列dist文件SHA256和source/tree；必要已跟踪构建须与独审树逐字相同。runner读取独占输出目录和既有依赖，不发布代码、不部署。每次先核source/tree/clean，保存版本和build manifest。
三个项目串行、每路新context，每作独立browser进程和本机loopback静态服务。headless=true、chromiumSandbox=true、args只有use-angle=swiftshader，移除Playwright默认unsafe；CDP读实际argv硬断言，DEBUG原日志留本地，不将私人路径/ws地址公开。每作关闭自己browser/context/service并核browser exit后才下一作；外层监管须记录自身/子链PID归属、结束时间/退出码、服务端口拒绝连接，清理未知停后续。runner现直接复用冻结MOBA tools/capture-output.ts：观察真实ChildProcess退出、并行关闭browser连接与BrowserServer、10秒超时、preview关闭并要求同端口ECONNREFUSED。supervise.py用Popen保存wrapper→Node身份；Node记录自己父PID及browser子PID、预览为自身进程内HTTP服务。外层600秒超时仅向本轮runner stdin发cancel，关闭它持有的handles；30秒仍不退出则exit-unknown，保留阻塞不杀未知进程、不续后作。接收端仍须记录supervise.py本身的真实退出（进程不能自证已退出），既有串行槽必须由接收端原队列持有，不以新增锁代替。

## 怎样算做成
- FPS：显式smoke=ground-v1，含feel=ground-v1与去掉feel两路，内部144tick输入、原restart再144tick；检查pass=1/steps=144/complete、两runs各144且hash相同、locked=false/running=false。
- MOBA：正常`/candidate.html?commands=buffer-v1`和`/candidate.html`，只读mobaClient.snapshot/state；分别要求contentVersion12/11，另验`/`的default-src为10；均要求ready、tick增长、实际WebGL2。旧capture恒content11，不用于候选验收。Q/W缓冲行为由同树CPU测试支持，本smoke不宣称浏览器发过Q/W。
- Star：`/road/?handling=power-tires-v1&shot=academy-depth&input=accelerate-brake&t=4&frames=2`与去掉handling的默认对照；该旧accelerate-brake已存在于a656（3.05–7秒油门，7–9秒制动），不是另一取证分支的新feel接口。这里取4秒2帧，仅验证油门真实推进/road-v3与road-v2选择，不宣称覆盖制动全段；轮胎曲线/制动由同树CPU测试支持。只调用现有__shotNext，不写物理状态。
- 全作保原始renderer/vendor/version，真实WebGL2且Canvas截图非背景，无游戏console/pageerror；软件可过功能但不是GPU品质。保存每路独立截图、原观测、构建hash、完整退出回执。首失败或清理不明立即停后续，保失败不覆盖。
- 尚未执行任何浏览器、服务、构建或安装；仅runner/checks/cleanup CPU单测与outer fake-Popen测试。未放行工具包待父端批准且补齐上述硬前置后才可定稿下发。

FPS已独审冻结合同（全卡串行阻塞未解除）：smoke.version=ground-v1，pass=0/1零基轮次；完整第二遍才complete=true；runs=[{ticks:144,hash},{ticks:144,hash}]且hash一致，locked=false/running=false。固定z=-1×60、0×30、+1×24、0×30。checks已更新精确合同；没有执行headless，原Star42/旧批次退出与外层清理证据仍是启动硬前置。

验证：9项游戏/启动合同+7项清理Node CPU测试（包含真实复用关闭器timeout和ChildProcess exit事件）+7项Python外层failure/timeout模拟均通过；未监听实际端口、未生成浏览器进程。当前阻止同轮旁置发布的是headless功能/WebGL2门槛，不是等待10机位品质图。

每路独立保存完整观测、raw renderer、截图SHA与错误，不让默认路覆盖候选证据。FPS两路均带environment=courtyard-v1&art=standards-v1，并要求各自两次hash相同、候选与旧模型的固定tape终态hash不同，以防两路误选同一模型。

静态服务Star实际入口为dist/client/road/index.html，URL用/road/而不是不存在的dist/client/index.html；query不影响目录index解析。

## CPU复核
仅使用现有Node24/Python3；环境变量MOBA_SMOKE_SOURCE、STAR_SMOKE_SOURCE分别指固定MOBA/Star检出目录。运行`node --test checks.test.mjs cleanup.test.mjs`和`python test-supervise.py`，不启动浏览器/服务。接收端私有配置不入仓；source/build/browser/串行门槛未齐时禁止把approved改true。此工具保全不代表执行许可。
