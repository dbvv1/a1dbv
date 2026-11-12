# B-STAR-DEFAULT-SMOKE-20261112 · 两入口完整整局与连续帧耗
id: B-STAR-DEFAULT-SMOKE-20261112
owner: dot-B
kind: build
status: blocked
target_repo: https://github.com/dbvv1/Star-Rush-Reborn
base_ref: d1607a57410c9bcdf1c0a9f24ece4ad238151485
result_branch: relay/b-star-default-smoke-20261112

## 目标与派发条件
使用当前 master 的玩家完赛判定，串行测 `/road` 与 `/road?environment=coast-space-v1` 的完整整局、重开和连续帧耗。保留已过静态盲选，不重拍旧机位图。
本次是原卡返工规格，不是新任务。MOBA 原卡收集由指导层处理；其退出／清理回执未核前保持 blocked，不自动运行。负责人核清后再改 revision_requested，随后 Star → FPS 串行，不抢槽。
Skill／规格：读取固定源 AGENTS.md、docs/browser-smoke.md，以及 a1dbv 游戏细则§6第3条、§7。仅 headless，不开可见窗口、不模拟桌面键鼠、不操作桌面。

## 环境、范围与一次修复
- 使用本机 **Node 22.23.2**、匹配锁文件的现成依赖和原 Chromium；不要求 Node 24，不安装／升级软件，不改持久环境、锁文件或安全设置。
- 开跑前同时核根目录及 `experiments/rapier-road-comparison/node_modules` 与各自锁文件匹配；当前构建会使用后者。缺依赖如实交回，不擅自安装。
- 只可修 `tests/smoke-run.mjs`、`tests/smoke.mjs`、`tests/smoke-full-race.mjs` 及其直接测试中的小问题：路径／参数、Node 22兼容、已有玩家完赛判定的观察逻辑；不得改游戏源码、资产、赛制、默认值或放宽完整smoke／帧耗门槛。
- 首次失败先读真实首错和原调用，保留产物并确认本次浏览器／server／database已关闭。确为上述脚本小问题时可当场修复、跑相关回归，再**仅重跑一次失败的命令**；不因首错立即 blocked。
- 不能通过删除断言、伪造结果、改输入推进速度、切换浏览器／renderer、跳tick或注入终点来通过。涉及游戏、依赖缺失、安全拒绝、退出不明或第二次失败，停止并写明恢复条件。
- 同一次失败不重复启动；已通过的入口不重跑。修复改变两入口公共观察逻辑时，两入口必须以同一补丁分别取得完整证据；整卡每条命令最多初跑与一次修复后复跑。

## 固定执行
独立干净 worktree 固定 base_ref，核源 SHA/tree；保存 node/npm/Chromium 版本、实际 argv、开始 UTC。仅进程环境设 `STAR_RUSH_DRIVING_MODEL=road`；清理其他 STAR_RUSH 覆盖项时保留本轮选定 `STAR_RUSH_SMOKE_CHROMIUM` 路径。
两入口使用同一 Chromium/SwiftShader、1280×720、DPR1；保持现成 headless 参数、原 loopback Worker／内存 SQLite，不访问生产或播放音频。
现成命令（PowerShell，先记录 node --version）：
```powershell
node tests/smoke-run.mjs --full-race --path /road --timeout-ms 900000
node tests/smoke-run.mjs --full-race --path '/road?environment=coast-space-v1' --timeout-ms 900000
```
两命令不得粘贴连续盲跑。每条退出后立即记 `$LASTEXITCODE`、UTC、清理事实并复制 `outputs/smoke/`，按上节决定继续或一次修复。
公开证据根为 `docs/quality/smoke/B-STAR-DEFAULT-SMOKE-20261112/<base短SHA>-r2/`；入口子目录 default/coast-space-v1，每次尝试另用 attempt-1/attempt-2，排他创建，不覆盖首次失败或旧产物。
固定赛道 coast-reborn、竞速、high、seed73121，真实时间自动试驾到玩家结果页；默认 space=false、候选 space=true，power=false、backend=webgl2、warnings=[]。
玩家完赛后游戏冻结未完赛对手，这是实际语义；**不要求对手继续完赛／自然截止**。保留真实排名快照与明确未完赛状态，不能伪造对手时间或改比赛逻辑。

## 验收与交回
- 两入口 scope=full-race、passed=true、exit=0、cleanupErrors=[]；无页面／控制台／请求错误，玩家结果/HUD/本地纪录一致；重开→推进→暂停→回菜单通过。
- 保存 fullRace 连续 frames、首尾边界、initialLap、result/存档、restartAndReturn；frameCadence 包含 samples/durationMs/meanMs/p50Ms/p95Ms/p99Ms/maxMs/over50Ms。缺字段不补造。
- 比较相同renderer/viewport/赛道/画质/时间段的两档尾延迟；rAF间隔不是GPU耗时，不以平均FPS冒充。
- 保留 servedBundleSha256、rawRenderer、Chromium版本、actualArgvVerified、真实退出码与UTC、browser/server/database关闭回执；不以PID消失代替完整清理。
- 如现场修脚本，交原base SHA、补丁diff/hash、相关回归结果、实际执行补丁版本与两次独立尝试证据。源码身份与游戏构建hash分开记。
- 原调试日志留本机，公开副本去私人路径／地址／身份／凭据，保留首错类型和阶段。公开扫描、独审后沿原result_branch交回 summary、SHA256清单和真实UTC；成功review_ready，耗尽一次修复仍失败blocked。
- 接收端不切默认／部署。dot-B核完整smoke、帧耗和既有盲选后才决定换默认，未通过不记品质或覆盖增长。

## 当前结果
旧base 2cad483首跑玩家已完赛，但观察器错误要求对手收尾，exit1、cleanupErrors=[]；候选未跑。原产物 [5257d5c](https://github.com/dbvv1/Star-Rush-Reborn/commit/5257d5c089bda540aa1ad5c9ecd0a143a3991b94) 保留，不追认为通过。
本次明确接受Node22.23.2，取消旧Node24附加门槛；更新后的玩家完赛观察器仍须真实本机重跑。MOBA清理未交回，尚未激活本卡。
