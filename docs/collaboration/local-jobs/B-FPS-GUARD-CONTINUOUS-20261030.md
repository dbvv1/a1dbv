# B-FPS-GUARD-CONTINUOUS-20261030 · 角色腰腿材质连贯候选
id: B-FPS-GUARD-CONTINUOUS-20261030
owner: dot-B
kind: build
status: review_ready
target_repo: https://github.com/dbvv1/FPS-Like
base_ref: 2b7ac87288f9595d3b1346b521a7eb456db108c9
result_branch: relay/b-fps-guard-continuous-20261030

## 目标
针对 docs/quality.md 最终双盲指出的腰部／装备暗面黑块合并，做新的角色材质连贯候选：腰臀与腿部从碎黑块变为有语义的布料、硬甲、装备面组。只做代码与 CPU 验证，视觉是否变好待云端出图及新盲评；不是恢复旧 guard 提交，不沿用旧候选的任何验收。

## 按哪个 Skill／规格
先读目标仓 AGENTS.md、docs/brief.md、docs/quality.md；按 a1dbv `domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md` §3 角色与可读性层及 §4，同一单元保留候选、后续真实比较。a1 规则固定参考 228ab181c9c1163817b214e1aa5ee0f451a668f1，开工仍先核最新规则。

接收端先核同题实际在途调用、全局停止条件、4 槽上限和 A 旧调用终止未明的残留占用；不把 running/blocked 标签当进程证据。全局状态、同题归属或可用槽不明则 blocked，不调用模型、不抢占、不清锁、不恢复旧 A/B 卡。发现同题活跃只读进展，不重复派发。规格变化先回具体差异，不自行扩大范围。

固定 FPS 源 2b7ac87288f9595d3b1346b521a7eb456db108c9：训练赛 `src/candidates/offline-training-v1/render/target.ts` 只重着色 helmet 与平均 y>1.05 的 torso carrier，其他 detail 保近黑；body 439 面，腰 y .8–1.05 中 64 面有 36 近黑、腿 y .3–.8 中 78 面有 26 近黑（原 face 口径，实施先复核）。这些统计用于定位，不是要求全区提亮。

- 新显式开关 `guard-materials=continuous-v2`；仅出现一次且精确值匹配才开。缺省、非法值、重复键均回原版，不改变默认入口；训练赛普通入口和固定机位共用同一解析与材质实现。
- 按原模型面组／部件及局部高度明确腰臀、腿部护甲、装备与布料分区，记录边界和优先级；延用现有敌暖友冷色家族，减少无语义黑碎片，布料与硬甲保持可辨。参数可在既有色家族内选并记录，不要求复原旧候选参数，不做全局提亮、发光或额外描边。
- 枪械、蓝色面罩保原。顶点、三角形、索引、姿态、碰撞、动画、灯光、模拟、地表与原资产文件均不改。源码旧行为仍可用，默认颜色数组／几何数据逐字节一致。
- 本机仅后台代码、构建和 CPU 测试；不启动浏览器（含 headless）、截图、GPU、GUI、键鼠或新云任务，不部署／不合入游戏默认分支。

## 写入范围
仅训练赛 `src/candidates/offline-training-v1/render/target.ts`、`render/scene.ts` 与同目录新增的 `guard-materials.ts` 纯函数；`tests/offline-training-v1/target.test.ts` 与同目录新增的本候选测试；`docs/quality.md` 只补候选现状、参数、未验项，不改既有评分。普通 client 与 `src/candidates/offline-training-v1/capture/quality-client.ts` 已共用上述 View；scene 一次解析并在 info 暴露 guardMaterials 版本，quality-client 仅允许把该字段写 manifest，不改机位／推进。不改依赖、sim、原素材、网页默认入口或旧测试期望来掩盖回归。接收端另按协议回写本卡结果。

## 怎样算做成
CPU 测试覆盖：语义分区边界与重叠优先级；开关缺失／非法／重复／正常；敌友色家族；枪械／面罩不变；默认逐字节颜色与几何一致；候选几何／姿态不变；普通及固定机位共享解析，无其他候选开关泄漏。既有 target 基础回归不得删弱。

跑完整 `npm test`、`npm run typecheck`、`npm run build`、`npm run sim`、`npm run sim:offline-training`，保同输入脚本／种子与基线回放 hash 一致证据；失败或缺依赖明确记录，不伪造通过。公开扫描、diff 空白、noreply 身份检查及非作者代码审查后，只推本 result_branch 回 review_ready；报告固定源／新提交／tree、实际改动路径、测试数和未验项。不得 accept:auto，不上传未经公扫原始日志。

云端同机位图、正常生命周期 smoke、新两名非作者盲评都仍待验，只有完整发布门槛通过后由 dot 旁置发布；本机 CPU 通过不宣称可见改善、达到标杆或已发布。旧 4ff5202a 的原字节及旧附件恢复另待，不能用本新候选替代。

单次最多两小时；超时／失败／终止不明按接收端协议保存已有结果并 blocked，不盲重试、不另开同题卡。只对已确认本卡自有调用按既有停止协议收尾，不杀未知进程。结果注明实际开始／最后进展／退出回执缺口；排队、认领不是执行证据。

## 当前结果

- continuous-v2 guard-materials 候选核实为已完整交付，本单元完成 review_ready 交接核查；审查通过、无未关闭问题（openIssues 为空），工作树仅 docs/quality.md 有 13 增 1 删的入口说明修正，其余与 relay 分支 HEAD 41c0b0a 一致。
- 产物：[fc64c2b](https://github.com/dbvv1/FPS-Like/commit/fc64c2b568be4bc15250447b3959bf50957684fe)，分支 `relay/b-fps-guard-continuous-20261030`。
- 检查：check_public（文件与新提交身份） 通过；独立审查通过。
- 下一步：交回接收端走 review_ready 与 Git/任务状态流转；云端同机位前后图、正常生命周期 smoke 和两名非作者盲评属 dot 侧未验项。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## dot 接收要求（当前调用正常完成后交回）

`5c051130d27b8dfd3986cc64c046a4aad2e4974f` 的 CPU 范围已由 dot 独立验收，亦已收到第 2 单元无改动复核。请原执行端在当前调用正常完成后按原范围交 `review_ready`，附本次完成及进程退出回执；尚无证据的退出项明确写未知。不再继续无改动复跑，不启动本机浏览器；云端截图／smoke／新盲评由 dot 处理，仍未通过。本说明不重派、不强改状态、不终止进程；原卡保持 running，直到接收端实际交回。
