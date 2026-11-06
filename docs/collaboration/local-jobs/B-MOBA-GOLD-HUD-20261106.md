# B-MOBA-GOLD-HUD-20261106 · 让实际赏金进入玩家 HUD
id: B-MOBA-GOLD-HUD-20261106
owner: dot-B
kind: build
status: running
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64
result_branch: relay/b-moba-gold-hud-20261106

工作线：MOBA。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
把已采用但尚无可见消费者的 goldAwarded 变成玩家可读的金币收据；这是原接口的真实接入，不新造金币算法或音效。

## 按哪个 Skill／规格
按 game-module-from-case 与 game-quality-pass；先读 src/sim/types.ts 的 goldAwarded、tests/gold-awarded.test.ts、src/client.ts 每步事件消费及 src/ui/hud.ts。
1. 新建 src/ui/gold-receipt.ts：createGoldReceipt(playerId) 返回 consume(events,timeSeconds)、read(timeSeconds)、reset()；仅收 recipientId 等于玩家、amount>0 的 goldAwarded，身份用 tick:ordinal，金额与 reason 只读原事件，不按余额差推测。不改模拟或事件定义。
2. client 每个真实 step 后立即 consume，不能只取一渲染帧最后一批。read 只显示最近一条「+N gold · 原因」；同 tick 多条合法奖励合并金额，重复批不重复。原因标签固定 heroKill→击杀、heroTeamReward→团队击杀、minionLastHit→补刀、structureLastHit→摧毁、structureTeamReward→团队目标，混合原因显示「多项奖励」。固定模拟时间 2 秒寿命，暂停不流逝；终局最后一批至少保留至结算，新局 reset。
3. 在现有 data-gold 旁加单个独立文本行，不用现有 command rejection 的 live region，不覆盖终局/瞄准提示。无动画、音频、新图标或新候选开关，不改变默认金币数值。
4. 用真实 Simulation 产出补刀、团队奖励、无奖励/购物，验证完整消费链；覆盖一渲染帧多 tick、同 tick 多奖、重复读取、死亡玩家合法团队奖励、暂停/新局。原 hash/golden 与历史存档保持。
5. 先查当前测试及 main 是否已有同消费者；已存在就只交差量与复用证据，不造第二套。

## 写入范围
src/ui/gold-receipt.ts、src/ui/hud.ts、src/client.ts；新增 tests/client/gold-receipt.test.ts 与 gold-client.test.ts。不得改 UI 样式、资产、模拟、存档、声音或其他卡。

## 怎样算做成
新消费者与真实 client CPU/DOM 回归、全量 npm test、sim/web 类型与生产构建通过，非作者核信息来源与事件身份；交具体手动路径和待验的可读性/遮挡项。未跑浏览器，不计视觉或品质通过。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果
- 规格已定，待接收端在确认同单元无活跃调用且有空槽后认领；本次未发起模型、桌面或产品运行。
