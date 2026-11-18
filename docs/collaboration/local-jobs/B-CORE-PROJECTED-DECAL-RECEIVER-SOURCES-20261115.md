# B-CORE-PROJECTED-DECAL-RECEIVER-SOURCES-20261115 · 环境弹痕只落到选中的表面
id: B-CORE-PROJECTED-DECAL-RECEIVER-SOURCES-20261115
owner: dot-B
kind: explore
status: accepted
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

- 只接收来源研究，不把长报告并入正文。[a582fde](https://github.com/dbvv1/a1dbv/commit/a582fdef1857ac676626a09584c6e1055ea0eb29)说明选择接收网格和投影裁剪是两道不同边界。用案例安装的 Three 0.186.1 独立 CPU 复核：分网格选择排除第二面；同网格、总深 0.20 包进反向平面，缩到本夹具的 0.05 才排除。已回写[反馈模块](../../../domains/game-dev/04-client-modules.md#打击感与反馈先让命中有含义再让重击有分量)。没有证实当前 FPS 需要墙面弹痕，不改玩法、资源、渲染或池。
