# 三作手感候选功能 smoke：未放行

id: B-THREE-FEEL-FUNCTIONAL-SMOKE-20261029
owner: dot-B
status: blocked
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 45d6c4594386a7fa9da88fd6c4032bab89bf542b
result_branch: relay/b-three-feel-functional-smoke-20261029

## 目标
验证三个已通过CPU与独审的手感候选，在真实headless软件WebGL2下能加载、推进并保持默认/旁置隔离，作为同轮旁置合入与网站更新的功能门槛；不是等待10机位品质图，不判手感优劣、声音或GPU材质。工具固定在base_ref的experiments/three-feel-functional-smoke；配置approved=false，本卡blocked，接收端不得领取执行。
固定FPS 41b696743f021efa8ddcbc1efd2c9cdf7153ed28/tree df48c2174d4040c417d075743234fabd531e1a7f；MOBA 8fcab371108f23b8be659eef1db0466561e3b597/tree e72877d4db44e49eea3f177d3a4977055022234d；Star ac2461ac736d3bbb69a31d973efdf0cf9176adec/tree fa721aaff7577705d689fc6392e1b79398e87b7f。

## 按哪个 Skill／规格
按细则§7、各固定候选AGENTS及工具README/receiver-config.example.json。只headless、不模拟键鼠、不DOM点击、不dispatchEvent、不外部改sim/存档；只读诊断和游戏内部固定回放。保sandbox、移除Playwright默认unsafe标志，实际argv及真实WebGL2硬验；不加no-sandbox、不换浏览器或renderer重试，不安装/下载。软件smoke仍占既有GPU串行槽。
恢复条件全部满足后，由dot-B复核原回执并在本卡明确放行，才可改ready与私有配置approved=true：原Star42调用及旧10机位批次确已结束；全部自有浏览器/预览/父链与已知残留真实退出；未知head.exe等归属已核；接收端原队列串行槽真实空闲且本次持有；固定检出干净、精确浏览器文件/版本/现有依赖与完整构建hash回执齐全。不能凭Git状态、排队、锁、超时或声明推断退出。本卡不取消、重派、恢复或重启Star42，不复制/重派10机位任务，不删除锁、不杀未知或他人进程、不抢占前台。
已知云端标准headless保持sandbox时socket EPERM(exit -6)，不再重试；现有云Canvas UI结果不算这批真实WebGL2 smoke。复用现有Node24/Python3/Playwright/PNGjs/tsx及已装Chromium，缺任何依赖保持blocked，不安装。
每作独立browser进程与loopback服务，三作串行；每路新context，首失败或清理未知停后续。先运行纯CPU复核，再按supervise.py启动runner，外层600秒超时发本轮stdin取消、最多30秒观察退出；未知保阻塞，不盲重跑。runner每作180秒限时、复用固定MOBA工具关闭器，独立关闭browser和预览并核真实ChildProcess exit及端口ECONNREFUSED；接收端另回supervise自身真实退出/父链回执，进程不可自证已退出。

## 写入范围
三个候选源/资产/锁文件只读；按各仓既有构建流程生成独立产物并记录每文件hash，已跟踪构建必须与独审树一致。接收端私有配置、原argv与日志仅本地；每轮新建独占输出目录，不覆盖旧失败或旧拍摄。只在result_branch新增docs/quality/functional-smoke/B-THREE-FEEL-FUNCTIONAL-SMOKE-20261029/<run-id>/的脱敏manifest、每路原观测、renderer原始信息、截图hash、退出回执；回写本卡当前结果。不得改游戏、TASKS当前重点、产品主干、网站、旧任务和拍摄版本。

## 怎样算做成
FPS两路均带environment=courtyard-v1/art=standards-v1和显式smoke=ground-v1，含/不含feel=ground-v1；真实原restart后两轮各144tick、hash一致，pass=1/steps=144/complete且locked=false/running=false；两模型终态hash不同。MOBA用/candidate.html?commands=buffer-v1验content12，/candidate.html验11，/验default-src10；真实tick自动增长，不用旧capture11冒充12。Star用/road/?handling=power-tires-v1&shot=academy-depth&input=accelerate-brake&t=4&frames=2及去handling对照，验road-v3/v2和真实两帧推进；这仅油门功能，制动/轮胎行为由同树CPU证据支持，不冒称浏览器完整制动。
每路真实WebGL2、非背景canvas、无游戏console/pageerror，完整保存独立state/快照、renderer/vendor/version/class、截图SHA与错误，不能后一路覆盖前一路。软件只过功能；没有GPU对照、音轨、屏幕输入延迟和盲判仍不算品质结项。前后固定source/tree/clean与构建hash一致；每作browser连接/BrowserServer/真实进程和preview端口退出均有证据，最终wrapper及父链退出核实，才交review_ready。失败或清理未知保原报告，不启动下一作。

## 当前结果
工具已通过双独审，16项Node与7项Python CPU检查通过；未执行headless、未安装、未合产品主干或更新网站。原任务真实退出、串行槽及接收端精确运行配置回执未齐，继续blocked；只在原卡补证后由dot-B放行，不自动启动。
