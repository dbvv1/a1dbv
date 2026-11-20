# B-STAR-DNF-BROWSER-20261119 · 公路赛自然截止提示

id: B-STAR-DNF-BROWSER-20261119
owner: dot-B
kind: build
executor: strong
status: blocked
target_repo: dbvv1/Star-Rush-Reborn
base_ref: 841a9f0662bbde2c9417e9d0ec9291bba2da4466
result_branch: relay/b-star-dnf-browser-20261119

## 要什么

核实汐见海岸公路比赛自然超时后，结算仍说明是倒计时结束前未完赛，而不只写「本次未完赛」。只验结算文字与成绩／幽灵不保存，不改游戏、浏览器验收器或默认与网站。

## 几点事实

- 固定前版为 `3373498625027c169e1efaf39853f776978afec5`；后版是[候选 841a9f0](https://github.com/dbvv1/Star-Rush-Reborn/commit/841a9f0662bbde2c9417e9d0ec9291bba2da4466)。两版都从源码重建，不复用已提交的 dist；普通 `/road` 入口，汐见海岸、竞速、普通开始，玩家不操作。组装客户端已在同条件自然复现；实际浏览器仍未检查。
- 现有 `--full-race` 点自动试驾并要求玩家正常完赛，不用于判玩家超时，不改它的门槛。观察 AI 先完赛引出的 HUD 倒计时，然后是自然截止；不得跳时、写入结果或模拟键鼠。仅方向会话在确认既有拍摄槽真实退出后使用授权的本机 headless 与既有普通开赛入口；不开窗口、不操作桌面、不调用 DOM click 或新增开局 hook。若缺符合限制的正常开赛方式，只报告入口缺口。

## 交付

两版各交 AI 先完赛、倒计时及自然截止的同一局回执，结算原图和 `#resultNote` 最终文本；后版应明确显示「本局未能在倒计时结束前完赛，可以再挑战一次。」并保留成绩及幽灵不保存提示，前版只作对照。核实没有本局成绩／幽灵写入，上传禁用且无保存重试。两次运行同为 1280×720、DPR 1，记录源码 SHA、实际 bundle 摘要、入口／种子、renderer、Chromium、页面错误和真实退出。只交复核证据，不换默认、不部署。

## 当前结果

候选已有组装客户端前后证据；专项浏览器未启动。此卡不预占拍摄槽、不让普通接收端认领，不挤掉已在途任务。原槽退出与获准的启动入口均确认后，才由方向会话处理。

- **原槽对账，不重拍**：由方向会话请原本机接收端维护者按 `B-STAR-COAST-READ-TURN-20261117` 核原外层启动器。[认领](https://github.com/dbvv1/a1dbv/commit/b4b1150ee5e07453529ab325b2008920d73c0c40)、[终态标未知](https://github.com/dbvv1/a1dbv/commit/2018a28a832b67766104a4eb2266c76c6e0e8f4a)、[交回](https://github.com/dbvv1/a1dbv/commit/21e6285c02b0759b79e91cfae3b128b999fdb078)分别在 11-18 11:30:58、12:47:33、13:14:09 UTC；这些是 Git 记录时间，不是进程启停时间。[分步退出回执](https://github.com/dbvv1/Star-Rush-Reborn/blob/66b5abbf6f193561cca408c86c8a91511afb2c5d/docs/quality/capture/B-STAR-COAST-READ-TURN-20261117/run-exit.json)没有原启动器身份或共享槽释放结果。交回原调用终态及其浏览器、预览和共享槽已清的确认即可，不再拍图；确认前仍不启本卡，不改开赛限制。
