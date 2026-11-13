# B-CORE-FIRST-VISIBLE-COMPILE-SOURCES-20261113 · 首次可见绘制的编译边界
id: B-CORE-FIRST-VISIBLE-COMPILE-SOURCES-20261113
owner: dot-B
kind: explore
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6dedee31abc6bf77694dd02a23f3f9833084f2f5
result_branch: relay/b-core-first-visible-compile-sources-20261113

## 目标与规格
核心模块；按 game-module-from-case §2。把“材质加载完”和“实际可见组合编译完”分开，给 MOBA 当前 quiet 入口一个最小可证伪的首帧预热接口建议。不重新做 B-PERFORMANCE-WORKFLOW-MODULE-001 的综合归因，不重做帧耗、共享材质所有权或 Star 拍摄。
- Three.js 固定 acf77e4c7ea413a0a9638baacef3d78e254b2cac，src/renderers/WebGLRenderer.js:1505–1580。
- Babylon.js 固定 fb6daf341d1c67c548bf435e45c2efdb1dc33812，packages/dev/core/src/Materials/material.pure.ts:1863–1955。
- 消费者 dbvv1/MOBA-Like 固定 79bdb57439d2ca3e49c6560271d4a598999f5ac5，从 src/render/playable-world.ts 找 scene 初始化与回退入口，核实际调用路径，不假设已接预热。

## 范围与完成
只写 docs/collaboration/local-jobs/artifacts/B-CORE-FIRST-VISIBLE-COMPILE-SOURCES-20261113/result.md。给两种参考实现各自的触发范围、完成信号、失败或取消语义的源码行链接，区分材质变体遗漏、纹理上传和首帧可用；提出一个可在消费者未来验证的正例与一个更换雾／灯光变体仍首次编译的反例。不改源码、模块页或其他任务；只读源码，不跑浏览器、GPU、不安装软件、不联系上游。源码推断不作运行或性能结论。
