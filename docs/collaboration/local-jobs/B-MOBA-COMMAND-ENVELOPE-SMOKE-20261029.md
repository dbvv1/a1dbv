# B-MOBA-COMMAND-ENVELOPE-SMOKE-20261029 · 可玩客户端命令信封功能验收
id: B-MOBA-COMMAND-ENVELOPE-SMOKE-20261029
owner: dot-B
kind: build
status: ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 9777b84044e19dd297be1675195cfe41d0152159
result_branch: relay/b-moba-command-envelope-smoke-20261029

## 目标
对固定候选 `9777b84044e19dd297be1675195cfe41d0152159`（tree `8b3a2392d121ba28adde25ccf4d9d24ce156c026`）执行一次现有完整功能 smoke。真实 `candidate.html` 玩家和机器人输入已通过 `LocalMatch.step → Simulation.commandFrame → Simulation.step` 的目标 tick／稳定席位信封；验证正常游玩、保存／续玩仍能工作，默认入口保持 v10。只验功能，不做 GPU 品质判定、不切默认、不增加功能。

## 按哪个 Skill／规格
按 `game-module-from-case`、`game-quality-pass/references/capture.md` 的 source／renderer／独占证据要求及细则 §7。只用既有接收端 headless 浏览器、现有 `tests/client/browser-smoke/run.mjs`，不使用可见窗口、OS 键鼠或桌面；脚本既有 headless 页内输入仅用于 smoke。不得改源码、脚本、lockfile、浏览器安全配置或测试门槛。

**启动前置必须实际核实**：原 `B-MOBA-TOWER-STANDARDS-SMOKE-20261029` 当前拍摄的原调用已经真实退出，其浏览器、预览服务与所属父链均已闭合；还须核既有接收端无其他活跃 GPU／浏览器任务且串行槽空闲。Git 状态、卡片标签、锁文件、排队、超时或取消标签不算进程退出证据。任一项未知即 `blocked`，不启动、不清锁、不杀既有进程、不另派重复任务、不切换接收通道。排队不计运行。

固定 SHA/tree，独立 clean checkout；不得改用 main 或混入 tower 资源候选。复用该相同 tree 的 71 个文件 / 464 项 CPU 测试、`npm run build`、最终 `npm run build:web`、非作者增量独审与公开扫描，不在本机重跑这些 CPU 套件。原参数 `npm run sim` 已完成 v11 seed1 一局，回放 hash `a1afe49381f7dfa4` 一致；seed4242 两局与未改 261034a 基线统计及 hash 相同。固定旧 formatVersion 1/2 存档／真实旧 build ID 读回与继续 hash 亦已验证。

依赖仅使用已有环境及固定 lockfile；缺依赖只允许 `npm ci --offline`，离线缺失即 blocked，不联网安装依赖或下载浏览器。沿既有已成功完整 smoke 的浏览器种类、路径与 sandbox 策略；不搜索或切换替代浏览器，不把 tower 拍摄专属的一次配置授权扩用。本轮 `MOBA_SMOKE_RENDERER=software` 使用现有 `options.mjs` 软件功能模式：实际已有参数 `--use-angle=swiftshader`，保持 `chromiumSandbox:true` 并通过 `ignoreDefaultArgs` 移除 `--enable-unsafe-swiftshader`；不是 args=[] 或仅改分类标签。保留原始 renderer 信息与真实分类；不得新增 `--no-sandbox`、`--disable-setuid-sandbox`、`--enable-unsafe-swiftshader` 或其他新启动参数。既有配置无法核实或启动失败，保留本轮失败原目录与原始错误后停止，不自动重试或换配置。

运行既有 `npm run smoke`，设置 `MOBA_SMOKE_SOURCE_SHA=9777b84044e19dd297be1675195cfe41d0152159`、`MOBA_SMOKE_RENDERER=software`，`MOBA_SMOKE_OUTPUT` 指向本轮新建独占目录。该脚本自带 web 构建是用于固定远端提交的真实 identity 校验，不复用错误 SHA 的旧包。核构建 source commit/tree/clean 与所有产物 hash；保留 build identity、实际 bundle hash，不能仅按文件名认定对应。使用原脚本的三入口：`/`、`/candidate.html`、`/candidate.html?lighting=stylized-diffuse`。不改脚本、不另造截图/输入通道、不运行 tower standards 或 GPU 拍摄。

## 写入范围
仅结果分支 `docs/quality/smoke/B-MOBA-COMMAND-ENVELOPE-SMOKE-20261029/` 下本轮独占目录及本卡结果。保留失败和成功原轮，不覆盖旧目录；发布脱敏 report／manifest、PNG、source/tree/build identity、产物 hash 与退出核验摘要。原始完整日志、argv、PID／父链、绝对路径和串行时序证据仅本地留存；公开不含私人路径、完整 argv、个人信息或原始进程日志。原始 WebGL vendor/renderer 字符串保留，rendererClass 按真实值 gpu/software/unknown 分类。不得改游戏源码、默认入口、模型、其他卡片，不合 main、不部署。

## 怎样算做成
- 原 run.mjs 全部断言通过：默认页仍 v10 且实际 tick 推进；候选 v11 的玩家移动／停止／施法与 bot 真实推进、改键、Save match → reload → Continue saved match 及状态恢复通过；diffuse 旁置入口正常加载；所有入口有非背景像素，现有 console/page/http/request 错误门槛全部通过。
- frame 采用以固定 source 的真实客户端调用路径及已验证 CPU 合同为据，不向浏览器注入模拟状态伪造采用；保存／续玩使用脚本真实 UI 路径。截图不证明联机、手感、音效或美术优于默认。
- report/manifest passed，source/tree/clean 精确匹配，独占产物清单和 hash 完整；renderer 原始信息及实际分类完整。软件渲染可通过本功能门槛，不冒称 GPU。
- Node smoke 的原始退出码、所属浏览器 exit code/signal、预览端口关闭以及自己启动的进程父链消失都有实际证据；cleanupErrors 为空。若外层 wrapper 与 Node 退出不同，分别保留确切失败命令/stderr/退出码，不用归因猜测改成通过。
- 出错即保留本次独占原目录、失败 manifest 和本地原始日志；未能确认退出则本卡 blocked/failed，不追加任务抢占串行槽。
- 完成只交回 review_ready 由 dot 接收，不自行判视觉品质通过；候选合 main、网站更新由 dot 后续核验后执行。

## 当前结果
待领取，未运行。固定候选 SHA/tree 已读回；原 tower 拍摄实际退出及上述串行条件是启动前置，未知即 blocked、不启动；本卡排队不代表放行并发或实际执行。
