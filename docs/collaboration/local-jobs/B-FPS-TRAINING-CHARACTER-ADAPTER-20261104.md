# B-FPS-TRAINING-CHARACTER-ADAPTER-20261104 · 接通训练赛角色源的 CPU 合同
id: B-FPS-TRAINING-CHARACTER-ADAPTER-20261104
owner: dot-B
kind: build
status: revision_requested
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 36fde4bb6a2e8f9652528fdea648d0a90190db79
result_branch: relay/b-fps-training-character-adapter-20261104

工作线：FPS-Like。原 CPU 产物已复核，按修改要求沿原结果分支小修。

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

- 产物保全：[f5eacd9](https://github.com/dbvv1/FPS-Like/commit/f5eacd9d9cc251e20c28529be430ae29db1a20ec)，分支 `relay/b-fps-training-character-adapter-20261104`，仅 adapter 目录 4 文件；未接训练赛 `src`、未合 FPS main。
- 负责人独立复核：真实 GLB 原字节与五段 clip、17/17 CPU、adapter tsc、根类型检查、430/430 与构建通过；另验 30/60/144Hz 同 Feedback 年龄姿势一致。公开文件／提交扫描通过。原 CLI 退出 0、Workflow completed、工具 settled、登记进程无存活匹配；外层 worker 独立退出回执未知。
- 决定：返工文档和真实命令测试。快速回切会重新选中旧 fire；手枪回切与未切枪的最终快照甚至完全相同，当前只读快照不能保证清除所有切枪前事件。见[独立评审与复现](../reviews/2026-11-04-fps-training-character-adapter.md)。
- 欠项：源 reload/switch 动作和训练赛接线未实现；浏览器及同机位／脚接触／死亡轮廓未验，不声称画面改善。沿原卡小修后再交 review_ready，不新增同题卡，不占 GUI/GPU。

## 修改要求

1. 沿 `f5eacd9` 修正 README 的切枪强保证：`shot.weapon === actor.weapon` 只过滤当前另一把枪，回切时仍可能选中旧 fire 尾段。写明事件年龄不会归零，但这不等于切枪后旧开火表现不会重现；不要把缺少 reload/switch 源片段与缺少切枪历史事实混为一项。
2. 用真实 `Game` 补步枪、手枪开火后「切走→切回」、同 tick 多次切枪及切枪取消换弹的覆盖，不只修改假 Actor。保留无切枪对照，明确每个断言证实什么；手枪反例须保留最终快照相等的证据，不能将支持不了的保证写成通过。
3. 不在本卡新增模拟状态、墙钟、任意等待或靠看过中间呈现帧记忆切枪。准确清除所有旧 fire 需要后续接线范围提供只读切枪事件／代际事实；当前保持此项未解决，不用单一 nextShot 判断冒称普遍修复，也不改 `src` 或补造源动作。
4. 保留已验证的 17 项、原 GLB／几何哈希、rest TRS、Feedback 尾段、资源归属与第一人称合同；重跑新增 CPU 测试、adapter tsc、受影响检查、公开文件／提交扫描和差异检查。只推原结果分支，交实际差量与剩余缺项；不合 FPS main、不部署、不启动浏览器。
