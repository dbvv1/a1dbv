# B-MOBA-QUEUED-SKILLS-20261106 · 核完整 QW 输入到出手
id: B-MOBA-QUEUED-SKILLS-20261106
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/MOBA-Like
base_ref: 7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64
result_branch: relay/b-moba-queued-skills-20261106

工作线：MOBA。本卡是静态 ready，尚无领取或执行证明；优先 Star 品质闭环，其他线独立继续。

## 目标
把 v12 前摇排队从单项测试推进到玩家一段真实输入的连续证据，找出按键已接受却未出手、重复释放或失去控制的实际缺口。

## 按哪个 Skill／规格
按 game-module-from-case；固定 src/input/{controls,commands}.ts、src/sim/{simulation,types}.ts、tests/{command-buffer,basic-attack-cycle,abilities}.test.ts 与现行 catalog 的 contentVersion 12。
1. 新增一个真实 controls→SimCommand→Simulation 的测试文件；复用现有 controls DOM 替身与真实 Detour，不假造技能成功事件，不改生产代码。
2. 先列原用例覆盖，补未覆盖的连续段：Veyra 普攻前摇中 Q→W→Stop；W 方向瞄准取消后新 Q；前摇中两次同槽与不同槽；前摇完成前死亡/复活后的新输入。每段写清现行规则期望，不能自行发明“最后输入优先”；现行合同冲突先交报告。
3. 每 tick 记录玩家命令、CommandResult、castStarted/castResolved/castCancelled、法力/冷却、位置/目标。保存最短可复现命令带与完整 SHA-256；禁止直接改 sim 私有状态造成功。
4. 同 seed/命令由第二个全新 Simulation 重放，对每 tick 完整玩法 hash；按 1/2/5 tick 一次取显示快照，玩法结果须不变。输出不能把按钮点击、受理和正式释放混为一件事。
5. 发现缺陷只交失败用例、精确首次分歧与修复建议，保留失败，不盲调技能规则或降低断言。若全部已有完整覆盖，复用原用例并说明无新增缺口，不复制测试。

## 写入范围
仅新增 tests/client/queued-skills-sequence.test.ts 及 docs/verification/queued-skills-sequence.md。生产 src、旧测试与存档夹具只读，不新增出图。

## 怎样算做成
至少一条从真实输入到规则释放的可重放证据，覆盖的原用例与新增差量可核；报告每项通过/失败/未运行及首错，不以 CPU 结果宣称操作手感通过。

## 执行与交回
- 开工先读最新 a1 main、§7、TASKS 与本卡，核相同 id/同目标已有卡、结果分支及本机实际写者。已有成果先接差量；未知仅隔离原调用，不以 ready/回交/分支静止推断退出，不重派、不清锁。
- 仅用本机已装 Node/Python 及与固定源锁文件匹配的已有依赖；缺项只报具体缺项。不安装、不付费、不建凭据，不开 GUI/浏览器（含 headless）、GPU、音频设备或桌面/键鼠；不另排出图，不改接收器。
- 本卡没有获准重试曾被拒的 full-branch fetch、本机重复核查、FPS .blend 上传或MOBA quiet原发布；不换路径/拆包绕过。按同一原生Workflow和三类非作者审查，复用已有证据，不替代实际运行。
- 只交本 result_branch 与本卡当前结果，先跑适用检查、公开文件/提交身份扫描和diff；不合产品默认分支、不部署、不改其他任务。反馈只含成果、欠项和下一步，普通单元/探索时限沿原合同。
- 区分通过、失败、未运行与待人工判断；测试、源包和排队数不当品质进展。发现真实首错保全最小证据，不改断言掩盖，不重复无新信息运行。

## 当前结果

- 新增 tests/client/queued-skills-sequence.test.ts 与 docs/verification/queued-skills-sequence.md：用生产 createControls 经真实 SimCommand 送入 contentVersion 12 Simulation 与真实 Detour，覆盖普攻前摇中 Q→W→Stop、W 瞄准取消后新 Q、同槽/不同槽重复输入、Stop 后恢复连续带、前摇完成前死亡清队与复活新输入共 6 段；逐 tick 记录命令/CommandResult/castStarted/castResolved/castCancelled/法力/冷却/位置/目标，保存 commandBandSha256 与 fullTraceSha256；全新 Simulation 重放逐 tick 完整玩法 hash 一致，1/2/5 tick 采样不改结果。6 个用例全部通过；未发现按键已受理却漏释放或重复释放的新缺陷，Stop 与死亡属现行 v12 合同明确的“受理但不出手”。npm test 88 文件 574 项：573 通过、1 失败（tests/client/audio-skill.test.ts 既有失败，移除新增文件后仍复现，未改断言）。未修改生产 src、旧测试或夹具。taskDone: 本单元范围完成。pageStuck: 不适用（非 reader-test）。未运行验收：浏览器 smoke、截图、Canvas/WebGL/GPU/音频、真人手感，均未验证，不能以 CPU/DOM 结果替代。
- 产物：[50fda56](https://github.com/dbvv1/MOBA-Like/commit/50fda5627dd113fe2b4019d766d71309d5c26701)，分支 `relay/b-moba-queued-skills-20261106`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：负责人接收并提交本次两文件；tests/client/audio-skill.test.ts 的既有失败与本单元无关，需另单处理；操作手感与画面/音频验收仍待人工判断。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 负责人接收 · 2026-11-09

- 测试与精简说明已接产品 main [fc1657a](https://github.com/dbvv1/MOBA-Like/commit/fc1657af6d8f2c86588fdd4e2854e3e68e59c23b)，未改运行源码、默认、资源或网站。独审发现 Esc 后直接 Q 会遮住取消失败，且旧重放未比较表现事件；现先点有效地面确认不发命令，再按 Q，并在采样时直接比较事件，cadence 1 覆盖每 tick。
- 独立源码／最终说明审查、574项、两构建及470文件公开扫描通过；历史 audio-skill 失败本轮未复现，不解释成所有平台已修。v12显式旁置、合成输入与legacy命令边界保留，浏览器／视听／手感未验，不计品质提升。采用回写[输入回归](../../../domains/game-dev/04-client-modules.md#接入手柄暂停与多人菜单)。
- 原外层调用终态仍未核清，保留 review_ready；本次接收不据分支／测试完成释放槽位、重派或解除隔离。
