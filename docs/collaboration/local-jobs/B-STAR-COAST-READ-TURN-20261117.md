# B-STAR-COAST-READ-TURN-20261117 · 过弯前读得出方向
id: B-STAR-COAST-READ-TURN-20261117
owner: dot-B
status: ready
kind: build
executor: strong
target_repo: dbvv1/Star-Rush-Reborn
base_ref: 1796e9fc65c1af64415ecbf151432f0e273c1c3c
result_branch: relay/b-star-coast-read-turn-20261117

## 要什么
正常追尾跑海岸公路时，让玩家在入弯前就能读出第一处街区弯的方向。只验这一个弯。先对照已有标牌配色；若没有让读向更早、更清楚，保留现状，不扩到全赛道或顺手改驾驶。

## 几点事实
- 固定游戏源码为已部署 v12 的 `1796e9f`，两份独立构建。现有 `STAR_RUSH_SIGNBOARD_VARIANT=navy-v1` 是构建开关，不是网址参数；默认粉色与深蓝候选只差旧三连箭头的配色，单箭头不变。入口均为 `/road/`，不加 `scene=baseline`；那是海岛场景回退，不是标牌对照。现有入口见[拍摄说明](https://github.com/dbvv1/Star-Rush-Reborn/blob/1796e9fc65c1af64415ecbf151432f0e273c1c3c/docs/capture.md)。
- `shot=coast-chase&seed=73121&t=28&input=road-tour` 已接近弯中，只用于确认目标牌。沿同一条输入、同一追尾机位向前取一帧，要求牌已进入视野且车还没进弯，两组固定同一时刻；先看原图再决定取哪帧。若该段实际未出现目标牌，写明，不用弯中画面宣称改善预告。旧[整景试验图](../look-guide-trial-20261114.md)是选题线索，不是此次前图。
- 方向会话核原拍摄槽空闲后，交本机强执行者一次连续真 GPU 回合，自己看图。仅 headless，禁止可见窗口、模拟键鼠、操作桌面；使用现有输入录制或游戏入口，不改相机、碰撞、道路、操控或新增资产。原会话状态未知不另起。普通接收端不执行本卡。

## 交付
交本机默认 build 和 navy build 的同机位原始前后图（1280×720、DPR 1、同一画质）；记录入口、时刻、实际 renderer、Chromium、构建 bundle SHA、实际退出，附 320 像素宽对照。交一句判断：第一眼何时能读出方向，是否被其他标志抢读。值得采用才补拟发布入口的真 GPU 整局和帧耗，交一位非作者看图；实现若无新技法，写清为何现成配色有效或无效。结果交方向会话，不换默认、不部署。
