# B-STAR-AUTO-PACING-20261120 · 慢机器的公路自动画质

id: B-STAR-AUTO-PACING-20261120
owner: dot-B
kind: build
executor: strong
status: blocked
target_repo: dbvv1/Star-Rush-Reborn
base_ref: 1bfd8fd803de232ca66043b8009d8bef7ee34fec
result_branch: relay/b-star-auto-pacing-20261120

## 要什么

玩家选「自动」时，持续卡顿要能降档，不能降档后画更多像素；前台恢复后也不能来回跳档。只验公路的自动画质，不改相机、物理、碰撞、手动画质、固定拍摄、默认入口或部署。

## 几点事实

- 用[固定候选](https://github.com/dbvv1/Star-Rush-Reborn/commit/1bfd8fd803de232ca66043b8009d8bef7ee34fec)从源码重建。普通 `/road/` 和 `/road/?autoQuality=visible-slow-v1` 在同一构建对照；用 `scene=baseline` 成对复核另一渲染路径。先选同赛道、同一段状态，建议汐见海岸；视口 1280×720、DPR 1，组内同一实际 renderer 与 Chromium。离线回归 240/240；受控长短帧交替能降档，持续同负载的失败升档从 6 次减为 1 次。相同尺寸与 60 Hz 反馈可能保守留低档，不能由此推断更高档余量。
- 不用 F2 的 FPS／p95 判定：它丢弃 1 s 及以上的间隔。保留每段前台原始正 rAF 间隔，真实隐藏／恢复另记；原固定 High 整局 smoke 不改，也不能代验普通 Auto。没有自然慢样本就写缺样本，不跳时、不改游戏状态。
- 本卡不进入 ready，不预占槽。方向会话核[原槽退出与恢复条件](B-STAR-DNF-BROWSER-20261119.md#当前结果)及当前顺序后，才可另行接续。仅获准的本机 headless，不开可见窗口、不碰桌面、不模拟键鼠；未经相应许可，不代开赛。不要为本卡终止、清理或重启其他任务。普通接收端不执行。

## 交付

记录固定源码和实际服务的 bundle 摘要、入口、赛道／种子、实测 renderer 与 Chromium、状态和 tick、页面错误与真实退出。对照报告各档墙钟时间、实际缓冲尺寸、阴影状态、原始帧间隔 p95、最大间隔和不少于 1 s 的次数；计升降档延迟用墙钟；对比帧间隔用相同赛道段／位置和连续 running tick 窗，附 `ΔstarSideStatus.ticks / 120` 与墙钟秒数。倒计时、暂停／恢复、隐藏和结算分开。DPR 1 的高、中档尺寸与阴影相同，不能用画布反推实际档位；取不到的值留未测。只打开首页的结果记为加载预检，不算整局或换默认证据。若后续评估换默认，另需拟发布入口真 GPU 完整整局与非作者同机位前后图；网站仍须用户批准。
