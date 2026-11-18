# B-STAR-DEMO-INPUT-CONTRACT-20261118 · Star 采用输入反例验收
id: B-STAR-DEMO-INPUT-CONTRACT-20261118
owner: dot-B
kind: build
executor: strong
status: blocked
target_repo: dbvv1/Star-Rush-Reborn
base_ref: e25ea50e851cf1a7d2c12008c1f5d17f6949f337
result_branch: relay/b-star-demo-input-contract-20261118

## 要什么

把 11-18 赛车 demo 的一条方法真正接入 Star：方向与短拨响应不能只靠自动驾驶完赛或直接给物理模型 steer 参数验收。只补一个公路驾驶的应用输入验收单元，让当前版、左右映射反转夹具、短拨响应过强夹具有可区分的实测证据。先覆盖现有默认的方向、短拨和松开回正，不做三圈类人玩家框架，不改车的手感、AI、碰撞、相机、场景或默认值。坏夹具只用于证明新测试有判别力，不是旧构建，也不能因当前版胜过夹具就称手感优秀。

## 几点事实

基线为上述精确 master；它相对 1796e9f 只改 docs/brief.md。正常入口 /road/，默认 road-v2；关闭 demoDriving、assistedSteer 和自动油门，设置与种子明确记录。复用现有组装客户端和测试设施：race.js 的 keydown/keyup → heldCodes/refreshControls → handling.js → VehicleModel.step 是实际应用路径。tests/road-vehicle.test.mjs 直接传 steer；tests/road-client.mjs 直接写 input/开 demo；tests/smoke.mjs 只有 W 加速验收；tests/smoke-full-race.mjs 的整局由 demoBtn 自动驾驶；capture-client.js 的 road-tour 禁止玩家输入。这些不能代替本单元。

只交方向会话，普通接收端不得认领。方向会话确认可用的强执行者后，只启动本卡的独立 CPU 单元。原 Star 拍摄继续独立隔离；不重启、不清锁、不占拍摄槽。本单元只做独立副本中的无画面 CPU 应用层验证：通过实际注册的应用 handler 调用路径消费输入记录，不复制 keyMap/控制逻辑，不在推进中直接写 input、steer、yaw、位置或完成状态；测试初始状态可作为显式夹具固定。不得生成 OS/浏览器键鼠事件、使用桌面或可见窗口。此层明确标为“应用 handler 集成”，不称真实按键、可信事件或 UI E2E。若无法在这些界限内接到原 handler，保留已有结果并报告缺口，不换成直接模型输入冒充。完整浏览器玩家入口和真 GPU 画面另欠，待原槽结清且获准后再说，本卡不启动它们。

参考 a1dbv 4c6c7b8 的 demo 第三/四批与 game-taskbook §7。独立决定最小实现，保留真实失败，阈值说明采用的 Star 参数或基线依据，不能把 demo 的 13.65°/28.45°/s 当成 Star 标准；冻结判据再看坏夹具结果。所有反例修改仅在测试副本生效，不进入正常构建。

## 交付

交一份最小测试改动及原 /road/ 可玩入口不变的说明；列采用的技法与准确代码位置。固定输入记录、初始状态、种子、120 Hz tick 和清楚的正负方向约定，给出按下/持有/松开期间的方向、横摆峰值与出现 tick、松开后残留、侧滑曲线。前后采用证据应包含：旧测试为何漏过输入映射问题的实跑对照；新测试拒绝反向/过强夹具，并对未改默认给出真实判定。若未改默认不达判据，不调车、不放宽判据，报告发现。

记录每个按键窗口实际被转向采样消费的 tick 数。反向／过强判别使用已确认有非零消费的短拨；按下与松开都在两次采样之间而没有消费的情况只作诊断，不计为幅度过低。详见[短拨验证](../../../domains/game-dev/02-verification-and-playtesting.md#handling-regression)。

保留精确基线/结果 commit 与 tree、源码差异、命令及实际 exit、原始逐 tick 数据与摘要、适用测试及 build 结果、公开扫描。CPU 重复运行可证明相同输入的确定性，不证明 GPU 帧耗、视觉、听感或真人满意。没有拍摄就交数据与覆盖差异，不伪造终图或重用 demo 图当 Star 前后图。采用完成只记已落入 Star 的测试方法及这份可复核前后证据；浏览器真实入口另列未验证。本卡不授权合入默认或部署。

## 当前结果

- 待方向会话启动独立 CPU 单元。已用隔离源码片段核对采样边界，未跑应用整条路径或夹具，不算采用。普通接收端不自动认领。本卡不依赖原拍摄结果，也不替代原拍摄。
