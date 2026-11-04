# B-FPS-TRAINING-CHARACTER-ADAPTER-20261104 · 接通训练赛角色源的 CPU 合同
id: B-FPS-TRAINING-CHARACTER-ADAPTER-20261104
owner: dot-B
kind: build
status: accepted
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 36fde4bb6a2e8f9652528fdea648d0a90190db79
result_branch: relay/b-fps-training-character-adapter-20261104

工作线：FPS-Like。离线 adapter 与回切边界测试已接收；训练赛接线和感知验收仍待后续完成。

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

- 接收范围：返工源 [411f155](https://github.com/dbvv1/FPS-Like/commit/411f155cf014fa10023f870e68a1c28eab02da8e) 已整合到 FPS main [fa8740d](https://github.com/dbvv1/FPS-Like/commit/fa8740de3bf2f4ffaaabec5c8df09d9f4c9088c8)，仅新增 adapter 目录 4 文件；没有接训练赛 `src`、没有改运行资产或部署。
- 修改要求已完成：README 撤回切枪强保证、区分源片段与切枪历史缺口；保留原 17 项并补 4 项真实 Game/Feedback 场景，明确快切回原枪仍可重选旧 fire、手枪回切最终快照与未切枪对照相同。adapter 仅加注释，未偷加时钟、模拟状态或逐帧记忆。
- 独立复验：Node 24.22.1 下 21/21 adapter、adapter tsc、根类型检查、430/430 与构建通过，无失败或跳过；相较首次候选构建，34 个 web-dist 文件哈希完全相同。原 GLB／几何、源消费者不变；公开文件／提交扫描及差异检查通过。21 项不在根 `npm test` 内，须单独运行。
- 本轮退出已核：Workflow completed，CLI 于 2026-11-04 18:39:09 UTC 退出 0，工具 settled、pending 空，557 个登记身份均 exited，存活匹配 0；当前无本卡活跃写者。外层 worker 独立退出事件、退出码和时刻仍未知。
- 剩余范围：回切后的旧 fire 强清除仍缺只读切枪事件／代际事实；源 reload/switch clip、训练赛接线未实现；浏览器、同机位、脚接触和死亡轮廓未验，不计品质改善。后续从真实状态合同与原 scene.ts 入口接续，不重做角色或重派本卡。详见[复核与接收记录](../reviews/2026-11-04-fps-training-character-adapter.md)。
