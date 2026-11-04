# B-FPS-TRAINING-CHARACTER-ADAPTER-20261104 · 接通训练赛角色源的 CPU 合同
id: B-FPS-TRAINING-CHARACTER-ADAPTER-20261104
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 36fde4bb6a2e8f9652528fdea648d0a90190db79
result_branch: relay/b-fps-training-character-adapter-20261104

工作线：FPS-Like。本卡为独立排队单元，尚未认领。

## 目标
把已接受且在旧1v1采用的角色 GLB 接到当前训练赛的只读状态合同，准备解决跑动无步态的内容缺口，不再造角色或改腰腿材质。

## 按哪个 Skill／规格
先读目标仓 AGENTS／brief（如有）、本卡所引页面与最新 a1dbv 规则，核 main、负责人分支、同题产物和实际写者。已有成果只接差量，不重做；同题原调用结果不明只隔离该动作。A 的三条缺回执调用不构成本卡的排队门槛，不清锁或处置它们；执行由接收端按已确认可用容量调度。

按 a1dbv `domains/game-dev/templates/.claude/skills/game-content-production/SKILL.md` §4 与 `assets/animation.md`。输入是 main 中原字节 `assets/content-set/{fp-arms-rx24,enemy-relay-guard}.glb`、`src/render/content-set-assets.ts` 既有绝对采样与资源所有权，以及当前 offline-training-v1 的 Actor／Feedback 合同。原源与动作合同另核固定 b198df62a56f4c520716fbc9cb4afac47dd62213 的 asset-pipeline/content-set，不重建旧源包。
写可复用离线 adapter：从真实 Actor 只读提取 position/yaw、hp>0、input.crouch、移动量和既有 Feedback 返回的事件年龄；重置 rest TRS 后采样已有 idle/walk/fire/hit/death：live/paused沿原模拟年龄，结算后的death/hit复用既有 Feedback 的 settled-tail 呈现年龄（最多700ms），不新造计时器，优先级 death>hit>fire>walk>idle，动画 duration 读原 clip。不得新增墙钟或模拟状态。队友保持原队色；世界Z映射只做一次；缺clip/坏hash拒绝并保持原表示。第一人称已有程序动作与袖子保持原消费者合同。

仅本机后台命令行、CPU 与文件处理；不操作桌面／键鼠，不开 GUI 或浏览器（含 headless 浏览器），不使用 GPU，不安装软件／模型、不付费或新建凭据。现成依赖缺失时只报对应缺项；不阻止其他独立卡。

## 写入范围
只写 `asset-pipeline/training-character-adapter/` 的 adapter、真实 GLB／Actor CPU 测试与接线 README；main 的 src、tests、资产与旧 guard 分支只读，不改 target.ts／scene.ts／拍摄代码，不新增入口。

## 怎样算做成
用 Three 实际加载原 GLB 验站立／移动／蹲／射击／受击／死亡／重置，事件过期不重复、相同模拟时间与同一既有呈现年龄在不同呈现频率下姿势一致，终局停tick后的原死亡尾段仍推进、默认与几何哈希不变、加载失败／迟到／销毁各自只释放自有资源。交可导入 adapter、接线位置与缺少的 reload/switch 动作说明；不是新角色制作或训练赛已上线。

按现行原生 Workflow 非作者核查、适用测试与公开文件／提交扫描、差异检查后，只推本卡 result_branch 并回 review_ready；不用 accept:auto，不合产品默认分支、不部署。报告实际产物、检查、未验项与下一步；排队、running 标签和模型自报不算执行证据。

## 当前结果

- 已完成训练赛角色源 CPU 合同：新增可导入离线 adapter，用真实 enemy-relay-guard.glb 与 offline-training-v1 真实 Game/Feedback 实现 read-only 状态采样（position/yaw/hp/crouch/移动量与 Feedback 事件年龄，rest TRS 重置，death>hit>fire>walk>idle，settled-tail ≤700ms，无新增墙钟/计时器/模拟写入），含资源所有权与迟到/失败/销毁处理、17 个真实 CPU 测试、接线与缺失 reload/switch 动作 README。taskDone：单元范围完成（remaining=false）。pageStuck：不适用（build 类型，无页面）。已运行：adapter 测试 17/17、adapter tsc、npm run typecheck、npm test 430/430、npm run build 均通过。未运行验收：按卡约束未跑浏览器/headless、GPU、截图及人工观感；未接入 src（写入范围禁改）。openIssues：无；Node v22 低于 engines >=24 仅警告。
- 产物：[f5eacd9](https://github.com/dbvv1/FPS-Like/commit/f5eacd9d9cc251e20c28529be430ae29db1a20ec)，分支 `relay/b-fps-training-character-adapter-20261104`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：由负责人接收本单元并在后续卡把 TrainingCharacterSet 接到 src/candidates/offline-training-v1/render/scene.ts 的 actor 循环（保留 procedural fallback），再按仓库规则跑 headless 浏览器 smoke 与人工机位评审；源 GLB 本身无 reload/switch 动作。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
