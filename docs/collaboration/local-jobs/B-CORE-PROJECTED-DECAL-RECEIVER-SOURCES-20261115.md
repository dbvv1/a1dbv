# B-CORE-PROJECTED-DECAL-RECEIVER-SOURCES-20261115 · 环境弹痕只落到选中的表面
id: B-CORE-PROJECTED-DECAL-RECEIVER-SOURCES-20261115
owner: dot-B
kind: explore
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 82e13fe6a5895b48baa0ff659bfd23019e4e3f07
result_branch: relay/b-core-projected-decal-receiver-sources-20261115
page: domains/game-dev/04-client-modules.md@82e13fe6a5895b48baa0ff659bfd23019e4e3f07

## 目标与规格
按 game-module-from-case §2。选中墙面后留下可读的撞击印记；不让投影体碰到背面隔墙、角色或 HUD 就顺手印上。核对两个面向同一来源网格的几何裁剪实现：
- [Three.js DecalGeometry，接收者变换与六面裁剪](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/geometries/DecalGeometry.js#L82-L207)。
- [Babylon.js decalBuilder，按面六次裁剪](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Meshes/Builders/decalBuilder.ts#L365-L440)。
- 指定消费者：[FPS-Like 离线训练反馈](https://github.com/dbvv1/FPS-Like/blob/79bcf1d1e245c49077dc4ee6235ad8b408289441/src/candidates/offline-training-v1/render/feedback.ts)；从 `src/default-route.ts` 核玩家入口再追命中事件，不预设消费者目前有 decal 或确实采用新机制。

## 范围与完成
只写 `docs/collaboration/local-jobs/artifacts/B-CORE-PROJECTED-DECAL-RECEIVER-SOURCES-20261115/result.md`。两种实现各给接收对象、空间变换、裁剪范围与不保证事项的行链接；给一块墙的可证伪正例（一发仅该墙入池）及一对相邻薄墙反例（另一墙／背面是否穿透由接收者选择和深度边界决定），建议 `hit surface → 接收网格 → 有界呈现池` 接口、释放责任与占用检查。不改玩法、资产、代码与拍摄卡，不跑渲染并避免将裁剪推断写成画面结论。由 dot 审查后选用，拟落入模块页「打击感与反馈」。

## 当前结果

- explore 单元完成：产出渠道覆盖表、three.js DecalGeometry 与 Babylon CreateDecal 的逐行契约核对、Unity/Unreal/Godot/Bevy/O3DE/Flax 的接收者与呈现限制、FPS-Like 入口链与 ShotImpact 现状、可证伪正反例及 hit surface→接收网格→有界呈现池接口建议，最终 result.md 475 行；Workflow 内 35 个 agent、修正 1 轮、审查通过且无剩余。openIssues：未做任何实机/渲染复现，画面与性能结论需目标版本验证；Asset Store/Fab 成品未试用；引擎文档为当前稳定页，升级后需重核；部分论坛与商店链接对 curl 为反爬 403/412/521，SIGGRAPH 2018 HDRP PDF 404 已标未读；FPS-Like 消费者未改，接口建议留给后续实现单元。
- 产物：[a582fde](https://github.com/dbvv1/a1dbv/commit/a582fdef1857ac676626a09584c6e1055ea0eb29)，分支 `relay/b-core-projected-decal-receiver-sources-20261115`。
- 检查：check_public（文件与新提交身份）、check_repo 本单元无新增错误；基线 82e13fe6 已有问题：docs\collaboration\nonstar-return-intake-20261106.md:24: missing link target: local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/quiet-reader-production-proof.test.ts（保留告警，交负责人接收）；独立审查通过。
- 下一步：后续实现单元需按接口建议接入 decal 事件、接收者 id/normal/triangle 与有界呈现池并补释放责任检查；负责人需安排目标版本实测验证画面与性能。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
