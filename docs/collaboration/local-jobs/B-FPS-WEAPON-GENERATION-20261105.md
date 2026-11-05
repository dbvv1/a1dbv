# B-FPS-WEAPON-GENERATION-20261105 · 补可选切枪呈现代际
id: B-FPS-WEAPON-GENERATION-20261105
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8
result_branch: relay/b-fps-weapon-generation-20261105

类别：游戏细则 §7 的模块编码单元，接口与检查已定；沿既有本机接收器排队。

## 目标
已接受训练角色 adapter 的真实反例：射击后切枪再切回，最终快照可与未切枪完全相同，旧 fire 尾段会再被选中。补可选只读代际事实，让消费者能分辨这两段历史；不是制作 reload/switch 动画或接入角色渲染。
沿 [原 adapter 卡](B-FPS-TRAINING-CHARACTER-ADAPTER-20261104.md) 的明确后续缺口做新单元；原源包和正在审的 reload-source 不重做。

## 按哪个 Skill／规格
按 a1dbv domains/game-dev/templates/.claude/skills/game-module-from-case/SKILL.md 的已定接口单元、固定源 AGENTS 与 asset-pipeline/training-character-adapter/README.md 的 Switch history 节；实现前先读 sim/game.ts、sim/types.ts 和 adapter 的真实 Game 测试。
1. 在 GameOptions 加唯一可选值 weaponPresentation: 'generation-v1'。缺省完全保留旧行为及序列化字段，其他值拒收；不新增 URL 或运行入口。
2. 启用时 Actor 增加可选非负整数 weaponGeneration，出生及新回合从 0 开始。仅已存活 actor 的实际成功切到另一把枪时加 1；同枪请求、死亡 actor、终局后命令不增加。同一 tick 按现有 at/输入顺序逐次计数，不新增时钟或随机数。
3. 启用时成功 Shot 记录同名可选 weaponGeneration，取射击真正提交时的值；被拒射击不生成。代际不能改变弹药、冷却、装弹取消、伤害、移动、声音或命令顺序。
4. 现有 stateHash 已排除 impact 呈现事实；同样排除新增 actor/shot 字段与该呈现选项，仅保留原 formation/movement 选项语义。不可清空或更换旧 golden 值凑通过。默认与启用的同输入逐 tick 玩法 hash 和移除这两个字段后的状态必须一致。
5. adapter 仅在双方代际存在且相等时允许 fire；双方都缺失沿用旧快照行为，只有一方存在时不猜测、不选该 fire。death/hit/walk/idle 优先级和原年龄、700ms 尾段合同不变，不加逐帧记忆、等待时间或 nextShot 推断。
6. 保留原 21 项；新增真实 Game/Feedback 的步枪与手枪切走切回、同 tick shoot/switch/switch、同枪无效请求、死亡/终局忽略、下一回合重置、拒绝射击、legacy 混合字段与暂停重复取姿测试。不同呈现频率同状态/年龄结果相同；新枪真实射击仍能 fire。
7. 仅 CPU 与文件处理。开工核同题原调用、结果分支与实际写者；若同题已有执行/产物则核原调用，不重复派发。未知只隔离该调用。复用现有依赖，缺项交回，不安装本机软件，不开浏览器/GUI、音频或 GPU。

## 写入范围
仅 src/candidates/offline-training-v1/sim/{game,types}.ts、asset-pipeline/training-character-adapter/{adapter.ts,adapter.test.ts,README.md} 和新建 tests/training-weapon-generation.test.ts。不改 source GLB、clip、旧 guard、reload-source、scene.ts、路由、锁文件、拍摄和生产资源。

## 怎样算做成
先用原版证明切走切回反例，再证明启用代际后 fire 不误选。根 npm test、类型/构建、adapter 原入口及新增测试全部通过；至少三个固定 seed 的相同脚本对照默认/启用逐 tick hash、完整玩法状态，保持零差量。记录新字段确有区别而不是仅最终 hash 相等。
只交 CPU 合同与可选实现；不宣称训练赛采用、动画完整、画面或手感改善。按既有 Workflow 独立审查、公开文件/提交身份扫描与 diff 检查后只推结果分支，回 review_ready；不合 main、不部署。

## 当前结果

- 实现可选 GameOptions.weaponPresentation:'generation-v1'：仅启用时 Actor/Shot 记录切枪代际，stateHash 剥离新字段与选项、默认/启用逐 tick 零差量；adapter 仅双方代际都存在且相等时选 fire，单边不猜测，原年龄/700ms/优先级合同不变。npm test 439/439、typecheck、build、adapter 29/29（保留原 21 项、新增 8 项）、新测试 9/9 通过；三 seed 1/7/923 逐 tick hash 与去字段完整状态一致且断言字段确有差异。openIssues 为空；按范围仅 CPU 与文件处理，未运行浏览器/GPU/音频，未提交/推送/切分支。
- 产物：[79281f8](https://github.com/dbvv1/FPS-Like/commit/79281f8d5c3d2859b3f051e8bc36f4466f4286f8)，分支 `relay/b-fps-weapon-generation-20261105`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：无待补实现缺口；待负责人接收并按 relay/b-fps-weapon-generation-20261105 提交。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
