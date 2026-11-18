# B-STAR-COAST-READ-TURN-20261117 · 过弯前读得出方向
id: B-STAR-COAST-READ-TURN-20261117
owner: dot-B
status: review_ready
kind: build
executor: strong
target_repo: dbvv1/Star-Rush-Reborn
base_ref: 1796e9fc65c1af64415ecbf151432f0e273c1c3c
result_branch: relay/b-star-coast-read-turn-20261117

## 要什么
正常追尾跑海岸公路时，让玩家在入弯前就能读出第一处街区弯的方向。只验这一个弯。先对照已有标牌配色；若没有让读向更早、更清楚，保留现状，不扩到全赛道或顺手改驾驶。

## 几点事实
- 固定游戏源码为已部署 v12 的 `1796e9f`，两份独立构建。现有 `STAR_RUSH_SIGNBOARD_VARIANT=navy-v1` 是构建开关，不是网址参数；默认粉色与深蓝候选只差旧三连箭头的配色，单箭头不变。入口均为 `/road/`，不加 `scene=baseline`；那是海岛场景回退，不是标牌对照。现有入口见[拍摄说明](https://github.com/dbvv1/Star-Rush-Reborn/blob/1796e9fc65c1af64415ecbf151432f0e273c1c3c/docs/capture.md)。
- **先验正在服务的构建**：分别组装两份产物后，用 `node tests/smoke-server.mjs` 服务各自的已构建目录；`npm run smoke:serve` 会先重构建，普通 shell 会把 navy 覆盖回默认，标牌构建验收 `node tests/signboard-source-choice.mjs` 也会在清理时重建默认。两份截图回执要记从 `/road/game.js` 实际取回的 SHA-256，并确认各自匹配其构建、两份不同；不匹配就不出 A/B 结论。
- `coast-chase` 用 `seed=73121&input=road-tour`。固定 v12 的生产道路逻辑无画面复跑，在 `t=22` 到达 381.76 m，`t=22.3` 到达 387.22 m，`t≈23.28` 越过 405 m。实机先从 `t=22` 查 `__shot.player.s` 并看目标牌，必要时往前取帧。旧 [`t=28` 回执](https://github.com/dbvv1/Star-Rush-Reborn/blob/1796e9f/docs/quality/capture/B-STAR-QUALITY-CAPTURE-20261106/811646e8/coast-chase/coast-chase-run1.json#L24-L44) 在 478.72 m，已过目标牌，不能用于验证入弯预告。两组按同一 tick 对照；若要说新版「更早」可辨，用 `frames`／`__shotNext()` 取少量连续配对帧，记录首次判对方向的时刻。若原机位入弯前未出现目标牌，写明，不改相机。无画面车位只缩小找帧范围，不证明可见。
- 方向会话核原拍摄槽空闲后，交本机强执行者一次连续真 GPU 回合，自己看图。仅 headless，禁止可见窗口、模拟键鼠、操作桌面；使用现有输入录制或游戏入口，不改相机、碰撞、道路、操控或新增资产。原会话状态未知不另起。普通接收端不执行本卡。
- **真 GPU 入口**：保留同一个 `?shot=` 页面，用方向会话已有的本机 headless RTX 拍摄方式读取该页导出的 PNG、相机／时刻／车况和 renderer。固定源码自带的 `npm run capture` 会强制并校验 SwiftShader；`--hardware-evidence` 仅引用已有回执，不会切换 GPU。若未确认真实硬件 renderer，不把截图归入真 GPU 对照。

## 交付
交本机默认 build 和 navy build 的同机位原始前后图（1280×720、DPR 1、同一画质）；记录入口、时刻、实际 renderer、Chromium、构建 bundle SHA、实际退出，附 320 像素宽对照。交一句判断：第一眼何时能读出方向，是否被其他标志抢读。值得采用才补拟发布入口的真 GPU 整局和帧耗，交一位非作者看图；实现若无新技法，写清为何现成配色有效或无效。结果交方向会话，不换默认、不部署。

## 当前结果

- Built default and navy-v1 variants independently at 1796e9f; served each via startSmokeServer and confirmed /road/game.js SHA matches its own build and differs between builds. Captured same-position headless true-GPU pairs (1280x720, DPR 1) at t=20.8/21.5/22.0/23.0 plus three continuous sequences; ticks and player.s identical across variants; t=22 re-shots byte-identical. Author's 1x read: navy-v1 readable at about t=21.0 vs default t=22.0, sign contrast 6.64:1 vs 2.38:1; harbor gate draws first attention but does not encode direction and does not occlude the sign. npm test exit 0. No default change, no deploy, no source/camera changes. Open: full-game true-GPU run, frame cost, and non-author blind read not run (conditional on direction session adopting navy-v1); readability is author-only, one corner only.
- 产物：[66b5abb](https://github.com/dbvv1/Star-Rush-Reborn/commit/66b5abbf6f193561cca408c86c8a91511afb2c5d)，分支 `relay/b-star-coast-read-turn-20261117`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：Direction session decides whether to adopt navy-v1; if adopting, run a full true-GPU race plus frame-cost capture and have a non-author blind-read the 320px comparisons.
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
