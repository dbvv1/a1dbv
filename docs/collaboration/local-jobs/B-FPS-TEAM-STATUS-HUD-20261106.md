# B-FPS-TEAM-STATUS-HUD-20261106 · 显示训练赛双方存活人数
id: B-FPS-TEAM-STATUS-HUD-20261106
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8
result_branch: relay/b-fps-team-status-hud-20261106

工作线：FPS。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
现有完整 5v5 HUD 已把存活人数附在目标长句末尾；将其提成独立可扫读信息，减轻目标/携弹长句的混杂，不新增重复计数或泄露敌人位置。实际可读性收益仍待看图和人玩。

## 按哪个 Skill／规格
按 game-module-from-case；固定 src/candidates/offline-training-v1/{ui/hud.ts,sim/types.ts,session/match.ts} 与真实 squads 测试。旧 legacy 1v1 不改。
1. 在 ui/team-status.ts 导出 teamStatus(state,playerId)：沿原 actor.hp>0 生存定义与稳定 team 汇总己方/敌方 alive/total，找不到玩家返回 null，不新造 Actor.alive。不得显示位置、单人HP、武器、导航目标或隐藏敌人状态细节。
2. 现有训练赛 Hud.update 读该函数，仅在原十人训练赛条件下，在 topbar 单独加「己方 X/Y · 敌方 X/Y」文本，同时移除 goal 长句中的重复「存活 X:Y」，保留目标/携弹提示。按 player.team 而非 attack/defend 分组，第三回合换边不换比分归属。只使用已有 topbar 文本结构，无新CSS或资产；其他人数沿旧行为。
3. 回合开始、自然死亡/同帧互杀、安放后进攻方全灭但比赛未结算、第三回合后换边、六回合终局/重开均更新准确；不因计数为0自行终局，也不从统计直接推胜负。
4. 用真实 Game 和现有 DOM 测试夹具产生状态，给同 team/side 在换边后的反例；保留原游戏 hash、菜单及 match panel。
5. 不改 sim/types/game、weapon-generation/adapter、角色源或捕获脚本。原产品已有等价功能时仅核差量，不重复 UI。

## 写入范围
仅 src/candidates/offline-training-v1/ui/{team-status,hud}.ts 与新 tests/offline-training-v1/team-status.test.ts。不得改训练 client、样式、模拟与角色动画。

## 怎样算做成
真实 Game＋HUD DOM 测试、全量 npm test、类型与生产构建通过；非作者核没有位置/隐藏信息泄露。可读性、窄屏和实际战斗验收进入人工批次，未验前不提分。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果

- 实现 teamStatus(state,playerId)：按 actor.hp>0 与 player.team 汇总己方/敌方 alive/total，找不到玩家返回 null，不新增 Actor.alive；HUD 仅十人训练赛在现有 topbar 显示「己方 X/Y · 敌方 X/Y」，goal 移除「存活 X:Y」并保留目标/携弹提示，无新 CSS/资产；新增 6 项真实 Game+HUD DOM 测试覆盖回合开始、自然死亡、同帧互杀、安放后进攻方全灭未结算、第三回合换边含混合 side 反例、六回合终局与重开、非 5v5 及信息泄露。本人实跑 npm test 437/437 通过、npm run typecheck 退出 0、npm run build 退出 0；浏览器 smoke 与可读性/窄屏/实战人工验收未运行。openIssues：tools/smoke.mjs、tools/smoke-offline-support.mjs、tests/offline-smoke.test.ts 超出本卡声明写入范围，但新测试依赖更新后的 assertOfflineReady，只交 3 个范围内文件会使 npm test 失败，需负责人裁决。
- 产物：[7a28c03](https://github.com/dbvv1/FPS-Like/commit/7a28c032f130b226baa79cf06dce40accc84fa30)，分支 `relay/b-fps-team-status-hud-20261106`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：负责人裁决 3 个 smoke 相关文件是否纳入（不纳入需回退其改动并调整/删除依赖 assertOfflineReady 的回归用例）；随后安排浏览器 smoke 与可读性/窄屏/实战人工验收。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 指导层固定接收

2026-11-06 13:00 UTC：固定7a28c03已纳入原整合分支[9c56ad6](https://github.com/dbvv1/FPS-Like/blob/9c56ad673157525d549d2418d4b3c4d8525e3856/docs/training-integration.md)，未合产品main或部署。仅采用不可变产物，不重复派发本任务。候选仍待浏览器接收，不据本卡固定产物的接收状态认定原调用退出或释放槽位。

- **范围裁决**：接收tools/smoke.mjs、tools/smoke-offline-support.mjs、tests/offline-smoke.test.ts三项必要差量，只把旧goal计数迁至team-status取值／断言并拒绝缺失、隐藏、错误计数与重复旧文案。浏览器启动、WebGL2、自然六回合、重开／暂停与退出回执不改，不扩大捕获授权；原越界上报保留，不追认为原卡已经授权。
- **独立核验**：固定tree a2152d7复原后，437项／类型／构建串行全过；固定源码实际有7项HUD测试。整合另加真实九机器人、默认规则、HUD逐tick六回合自然淘汰与新Game首帧复位，3038ticks、1:5；整合492＋adapter29项、双类型／构建、公扫与独审通过。并行跑两套全量时各一个测试进程异常退出，后续未改断言或门槛，串行全过。
- **剩余闭环**：原调用终态无回执，保持unknown，不核被拒本机入口、不清锁。HUD与MatchPanel的CPU／DOM替身证据不等于浏览器布局；窄屏、战斗可读性和GPU仍欠。FPS main仍fa8740d、Site v24未变，socket EPERM不重试／不绕过；后续沿同一候选在获准可用环境验收，不新增旁置。

## 11-11 产物去向结清

接收 `7a28c03` 已进入 `9c56ad6` 的六文件，沿上方范围裁决。产品验收并入 `bd4e185` 训练候选，不单列第二个接收任务；不宣称 main 或窄屏已过。本卡 `accepted` 只表示上述范围的产物去向，不证明原调用退出；原终态 unknown 与相关隔离保留，不重派、清锁或重试被拒入口。
