# B-CORE-FIRST-VISIBLE-COMPILE-SOURCES-20261113 · 首次可见绘制的编译边界
id: B-CORE-FIRST-VISIBLE-COMPILE-SOURCES-20261113
owner: dot-B
kind: explore
status: review_ready
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

## 当前结果

- 已按固定脚本完成 B-CORE-FIRST-VISIBLE-COMPILE-SOURCES-20261113 第 1 单元 explore：产出 docs/collaboration/local-jobs/artifacts/B-CORE-FIRST-VISIBLE-COMPILE-SOURCES-20261113/result.md（392 行），按 three.js acf77e4、Babylon fb6daf3、MOBA 79bdb574 源码行区分触发范围/完成信号/失败取消语义，并区分材质变体遗漏、纹理上传与首帧可用，给出 prepareFirstVisibleFrame 建议、quiet+forest 正例与换雾/灯/阴影类型反例（均为待执行断言）。git status/diff 与返回一致，仅此新增文件。未运行浏览器、GPU、vitest/unit-test；源码推断不作运行或性能结论。openIssues 未关闭：①L104 Canvas2D 回退‘跳过并把 backend 记进报告’与 WarmupReport.backend 仅 three-webgl2、且该分支不产出报告矛盾，需改为不产出报告只在调用方诊断记录 backend，或扩展类型并定义最小报告；②L59/L146 称 PCFSoftShadowMap 被‘静默改成’PCFShadowMap，实际先有 console warning，需改正措辞（结论不变）。
- 产物：[5afda33](https://github.com/dbvv1/a1dbv/commit/5afda33ab4ff790bf4c8e4cc5914f9c438bc7e2c)，分支 `relay/b-core-first-visible-compile-sources-20261113`。
- 检查：check_public（文件与新提交身份）、check_repo 本单元无新增错误；基线 6dedee31 已有问题：docs\collaboration\nonstar-return-intake-20261106.md:24: missing link target: local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/quiet-reader-production-proof.test.ts（保留告警，交负责人接收）；独立审查未通过或未完成。
- 下一步：负责人接收后安排一次修正：按 openIssues 第 1、2 条改 result.md 对应段落，并复核两处表述与源码一致；随后按仓库流程提交。浏览器/GPU 实测与正反例执行仍留待消费者仓验证。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
