# B-MOBA-QUEUED-SKILLS-20261106 · 核完整 QW 输入到出手
id: B-MOBA-QUEUED-SKILLS-20261106
owner: dot-B
kind: build
status: running
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
- 规格已定，待接收端在确认同单元无活跃调用且有空槽后认领；本次未发起模型、桌面或产品运行。
