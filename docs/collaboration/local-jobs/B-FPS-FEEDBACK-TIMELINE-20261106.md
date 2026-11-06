# B-FPS-FEEDBACK-TIMELINE-20261106 · 核交火反馈跨回合连续性
id: B-FPS-FEEDBACK-TIMELINE-20261106
owner: dot-B
kind: build
status: ready
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8
result_branch: relay/b-fps-feedback-timeline-20261106

工作线：FPS。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
将真实交火的落点、命中、死亡尾段和回合总结放进同一时间线，给下一次真人枪感验收一段可解释的材料，不再单独统计测试通过数。

## 按哪个 Skill／规格
按 game-module-from-case 与当前 docs/shot-cycle.md。固定 offline-training-v1 的 render/{feedback,weapon}.ts、session/match.ts 和原 feedback/match 测试；不消费尚未接收的 weapon-generation 分支。
1. 从真实 Game 生成一段移动→停止→步枪/手枪射击→真实墙命中/角色命中→换弹打断→终局→下一回合的命令带。只走正式命令；不得直接写 Actor、Shot、result 或伪造命中。
2. 每个节点列接受命令 tick/at、权威 ShotImpact、Feedback 年龄、weaponPose/localShotResult 和 TrainingMatch 统计；从射击落点辨命中，不从晚到 HP 或 HUD 文案推导。
3. 同带按30/60/120Hz显示取样，固定 tick 的玩法/反馈事实一致；尾段仅在结算后沿现有700ms策略，暂停不虚增年龄，reset后旧事件不再出现。
4. 包含未射中、友军命中、同一Shot重复观察、零射击回合，明确 summary.hits 的统计口径；若当前源无某类命令，报告缺口而非造假动作。
5. 复用现有测试覆盖，只新增跨模块断言；反例只交失败测试和定位，不改反馈配方、声音或枪械动作。

## 写入范围
新增 tests/offline-training-v1/feedback-timeline.test.ts 与 docs/verification/feedback-timeline.md；src、旧golden、现有结果卡与声音源只读。

## 怎样算做成
一条可执行的真实交火命令带及跨层时间线，原测试与新断言结果清楚；明确 CPU 只证明语义，枪感/听感/画面仍需同段实玩。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果
- 规格已定，待接收端在确认同单元无活跃调用且有空槽后认领；本次未发起模型、桌面或产品运行。
