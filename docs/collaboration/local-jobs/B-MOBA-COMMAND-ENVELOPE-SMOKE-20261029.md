# B-MOBA-COMMAND-ENVELOPE-SMOKE-20261029 · 可玩客户端命令信封功能验收
id: B-MOBA-COMMAND-ENVELOPE-SMOKE-20261029
owner: dot-B
kind: build
status: review_ready
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

## 修改要求（本轮唯一执行范围，替代上文初次运行步骤）
只做一次当前全量只读状态核验，不重跑CPU／smoke／GPU，不补拍，不开新浏览器或预览，不杀进程、不清锁，不重复追索不可恢复的历史退出码。核验进程所需只读命令不属于重新执行游戏任务。
以原始本地记录的精确PID＋创建时点核身份，覆盖已知父链／后代、三次额外观察脚本Node、原及额外fullsmoke、所有相关浏览器、preview服务和动态监听端口；并核原调用、子代理和后台工具实际结束／settled，当前无其他接收端浏览器／GPU任务，不能只查固定端口或进程名称。保存本轮实际时间、逐项检查与脱敏结论，原始身份／路径／日志仅本地留存。任何归属、调用状态或当前残留未知即blocked，不执行后续任务。
三观察浏览器退出码和两head历史退出码保持unknown；第三观察实际renderer为unknown，不沿用前两次software。review阶段额外fullsmoke重跑不符合原单次范围且临时产物已删除，历史事实和不合规记录永久保留。当前无残留的证据不倒推历史exitCode，不豁免历史行为，不采纳来源自拟“书面接受缺码”作为授权。
若本次实际记录证明所有相关调用已settled、自有资源不存在且串行槽空闲，可按现有授权继续已排Star原单元；Star启动前仍须fresh复核，Star实际结束／退出后才可接已排FPS，FPS启动前也须fresh复核。不得自动宣称现在已空闲。只更新本结果分支历史／当前核验说明和必要hash索引及本卡结果，不改源码、原九文件、TASKS或其他产物，不新建单元；交回review_ready。

## 当前结果

- 已完成对固定候选 9777b84 的一次性全量只读核验（2026-10-29T06:02:49Z–06:08:27Z：0 浏览器、0 smoke preview Node、0 preview 监听、无 GPU 任务；记录 PID 及父进程缺席且无创建窗复用；本卡调用与子代理均已 settled），并仅更新本卡 status.json 与 history-exit-notes.json 至 review_ready。openIssues 为空；审查含读者测试判通过、无页面卡点；三次观察及两 head 历史退出码与第三观察 renderer 仍保留 unknown，未重跑 CPU/smoke/GPU、未开浏览器、未杀进程、未清锁、未提交。
- 产物：[395687d](https://github.com/dbvv1/MOBA-Like/commit/395687dc9555b9ade03915ff693b1c3085e569bb)，分支 `relay/b-moba-command-envelope-smoke-20261029`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：交 dot 接收；Star 启动前须 fresh 复核，Star 实际结束退出后才可接 FPS（两个已排单元已由接收端并行启动，不在本卡写入范围）。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
