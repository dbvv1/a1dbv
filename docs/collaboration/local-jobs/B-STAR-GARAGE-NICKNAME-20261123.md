# B-STAR-GARAGE-NICKNAME-20261123 · 车库双昵称恢复

id: B-STAR-GARAGE-NICKNAME-20261123
owner: dot-B
kind: build
executor: strong
status: blocked
target_repo: dbvv1/Star-Rush-Reborn
base_ref: 9dad2bc773ea9eff079810ef86a0f337354d2860
result_branch: relay/b-star-garage-nickname-20261123

## 要什么

玩家打开车库遇到两份不同的本机昵称时，看得见两份记录，能来回选，不用记住或重输失去的名字；只有明确保存才写入。本卡只验昵称恢复，不改游戏代码、分支默认或站点。

## 几点事实

- 前版 `047b4fd9480bea0f6599bb810d7a4d92bfdbad23`，后版 `9dad2bc773ea9eff079810ef86a0f337354d2860`。都从固定源码干净构建，不复用 dist；走实际 `/road`，后版额外核 `/legacy`。两个同源存储键用独立临时配置和合成名字：`star-rush-name` 为 Old driver，`star-rush-profile` 的 name 为 New driver。可以准备测试存档，不得写游戏内部状态或替代正常入口。
- 正常打开车库，前版看不见 New driver，后版应能区分并试填两份名字。看一次涂装预览、关闭重开、试填后换回、明确保存，一个新上下文保留模拟保存数据后重新载入核验。保存当前名和车库名分开测；试填、涂装和关开不能改两键。用第二键失败场景确认不再显示已被第一键替换的旧车库名字，并能在重新打开后从实际存档恢复。
- 仅既有授权的本机 headless 和正常入口。不得打开桌面窗口、操作 OS 键鼠、使用 DOM click 或内部启动钩子代替入口。如果缺获准的车库交互路径，只回明确缺项，不自行放宽限制。方向会话在确认[原有拍摄任务](B-STAR-COAST-READ-TURN-20261117.md)实际退出并释放共享槽后决定是否运行；不从此卡状态推断槽情况。

## 交付

同环境、同入口、同合成存档的前后车库画面和保存／重开证据；记录固定 SHA、实际 bundle 摘要、入口、Chromium、renderer、分辨率、未捕获错误与真实退出。卸载临时配置之前核实两键的值；不提交真实存档或本机路径。只回验收，不换默认、不部署。

## 当前结果

组装客户端针对性测试与构建已过，真实浏览器未验。专项未启动，不占槽。
