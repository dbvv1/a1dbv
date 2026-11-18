# B-MOBA-VEYRA-LANE-WARNING-20261118 · 命中前读懂危险区
id: B-MOBA-VEYRA-LANE-WARNING-20261118
owner: dot-B
kind: build
executor: strong
status: blocked
target_repo: dbvv1/MOBA-Like
base_ref: fa3076ffc8d1304bd64e74f8dc1a6f2a5167d939
result_branch: relay/b-moba-veyra-lane-warning-20261118

## 要什么

单线交战中，没见过 Veyra R 的玩家应在命中前看懂哪块地面危险、往哪退。先在正常交战机位看清现版；若该预警已经可读，交一段证据并保留现状。只有看到了具体漏读，才做这一招的表现候选，达标线是非作者在不看命中结果时能指出危险区及退向，而不是圈更亮。不得改技能时序、实伤范围、碰撞、相机或其它技能。

## 几点事实

- 前图来自现网站 v24 的源码。无参数玩家入口使用森林场景、森林照明和 quiet 材质；专用回放入口不会继承这三项。固定取证：`capture.html?shot=gameplay&seed=1&input=march&t=19.8&frames=49&lighting=forest-light-v1&materials=quiet-family-v1&scene=forest-lane-v1`。CPU 定位显示逻辑 tick 596–615 有预警，616 结算；30 Hz 约 0.67 秒，仅是找帧范围，不是肉眼可读或可躲的证据。保留单位、血条、地面和其它特效；回放无玩家 HUD，结论只覆盖场内预警。
- 仅由方向会话在确认现有拍摄槽清退后交本机强执行者。真 GPU、仅 headless、现有回放入口；不开窗口、不模拟键鼠、不操作桌面，不复用未经方向确认的启动参数。不重开 Star，不改取消过的卡。本卡未启动，普通接收端不认领。

## 交付

交可玩入口、前后同机位短片或逐帧原图（正常时间轴），标出预警何时出现、何时实伤；一位非作者先只看结算前，回答危险区与退向，之后再揭晓，不从爆炸倒推。若现版可读或候选不改善，说明为何并保留现版；若改善，交开关候选、技法与代码位置及正常入口所需验证。回执记确切源码／实际构建、renderer、Chromium、分辨率与退出；同场验其它提示没被压住。换默认另按 §6.3 验整局和帧耗，归方向会话；不自行部署。
