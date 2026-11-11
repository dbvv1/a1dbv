# B-FPS-SQUAD-MATCH-CENSUS-20261106 · 找整场机器人职责空转
id: B-FPS-SQUAD-MATCH-CENSUS-20261106
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8
result_branch: relay/b-fps-squad-match-census-20261106

工作线：FPS。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
沿已有五种子整场证据，补逐tick真实命令录制/重放及携弹、补位、拆弹无进展的定位，避免复制已有整场驱动器或只增加seed数量。

## 按哪个 Skill／规格
按 game-module-from-case；复用 tools/offline-training-v1/squads-sim.ts 的 runSquadMatch 与 package.json 的 sim:offline-training，先读 docs/candidate-integration.md 既有五种子结果及原 squads-replay/squad-objectives/squad-handoff 测试；只用现行默认运动和完整单点六回合。
1. 原 runSquadMatch(seed:number,ground=false) 只加可选第三参数 observe:(record:{round:number;tick:number;commands:Command[];state:GameState;stateHash:string})=>void；每次 step 后给本步实际提交命令、当前状态的深副本与hash，不暴露内部可变引用。未传时旧返回值与CLI输出不变，不复制controller/整场循环。沿原驱动玩家idle、难度normal，seed 1、7、19、31、73、127、257、509，每seed完整六回合，不改规则或参数，仍60Hz。
2. 逐回合给胜因、tick、双方剩余人数、真实携弹/安放/拆弹 owner 变更、实际目标命令与关键事件。若现有 API 无职责事实，写不可观测，不把位置猜成职责。
3. 针对每条已产生的失败/长期空转，保最短命令前缀和首次异常；“空转”只作诊断：目标任务进行中且连续 600 tick 无距离改善/任务进展，不能当自动质量失败或自动改路径。
4. 各 seed 的已提交命令在同初始化的新 Game 中禁用 controller 重放，按记录round边界调用原nextRound，逐 tick hash 相同；完整命令带只保首个真实反例，正常场保摘要与 SHA-256，避免大日志入仓。
5. 不以8个seed判断攻守平衡、难度优劣或真人体验；若原已有完全相同矩阵，复用并指出新增缺口，不重复长跑。

## 写入范围
仅原 tools/offline-training-v1/squads-sim.ts 的可选观察入口、新 tests/offline-training-v1/squad-census.test.ts 与 docs/verification/squad-census.md；不改 src、其他工具、规则、模型或默认输出，不建第二套驱动。

## 怎样算做成
命令可重跑、正常/非法seed/缺依赖入口测试、8组实际结果和首错证据；在既有限时内完成不了则保已跑的seed与未跑名单，不以结果静止推断进程已退出。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果

- 完成 observe 可选入口、8 seed×6 回合逐 tick 录制/重放与逐回合职责事实，3 份写入范围内文件均已交付；相关测试与 npm test 通过，8/8 seed 重放 hash 一致、0 条 600 tick 空转。openIssues：docs/verification/squad-census.md 第 9/14 行与第 16 行关于 CLI 输出/入口守卫修复的表述互相矛盾，评审未通过；浏览器/GPU/音频/桌面与缺依赖入口场景未运行。
- 产物：[856f707](https://github.com/dbvv1/FPS-Like/commit/856f707d1cb1385bed31c1e4e1269a4a488d6cb6)，分支 `relay/b-fps-squad-match-census-20261106`。
- 检查：check_public（文件与新提交身份） 通过；独立审查未通过或未完成。
- 下一步：负责人处理文档矛盾：把第 9/14 行限定为 observe 本身不改返回值、POSIX 下 CLI 输出不变，并明确 Windows 入口守卫修复属范围偏差；或回退守卫并调整 CLI 入口测试。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 指导层固定接收

2026-11-06，仅采用固定856f707的可选observer与深克隆合同，进入原训练候选[1b70e42](https://github.com/dbvv1/FPS-Like/commit/1b70e421d973ef03483bdd816863c9208f6153d7)；不接Windows入口守卫偏差、旧EXPECTED或整份矛盾文稿，不改原分支。原review_ready不是退出回执，原调用终态unknown，未重派／查已拒入口／清锁。

- 非作者按固定源独立复验3项与8种子48回合／17477tick，原405击杀中282队杀；实际seed1 R1 tick52瞄敌却击杀友方，已形成真实反例。指导层在原整合单元另修Bot目标前挡线，不写原执行工作区。
- 修后同矩阵48回合／25594tick，友方命中／队杀0且逐tick无controller重放hash一致；观察副本变更不污染结果。518＋29项、类型／构建及独审通过；边界详见[训练交接](../b-work-20261106.md#fps-训练场整合)。目标后误伤与不主动换位保留，不能称通用零友伤或产品验收。
- 原seed1 R4距点6.73m的53tick一直看见敌人并执行交战停车，原“最后接近／安放触发”原因未证明；全部淘汰／held interact=0不是安拆闭环通过。“首错无”只限重放无分歧。FPS main仍fa8740d／Site v24未变；未触浏览器限制，视听实玩和完整reload/switch仍缺。

## 11-11 产物去向结清

部分接收 `856f707` 已进入 `1b70e42` 的 observer／深克隆合同；Windows守卫偏差、旧EXPECTED与矛盾文稿不收。产品采用并入 `bd4e185` 单一训练候选。本卡 `accepted` 只表示上述范围的产物去向，不证明原调用退出；原终态 unknown 与相关隔离保留，不重派、清锁或重试被拒入口。
