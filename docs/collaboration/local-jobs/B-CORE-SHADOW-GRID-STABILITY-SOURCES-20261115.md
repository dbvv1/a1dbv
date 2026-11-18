# B-CORE-SHADOW-GRID-STABILITY-SOURCES-20261115 · 相机平移时阴影格不随亚像素漂
id: B-CORE-SHADOW-GRID-STABILITY-SOURCES-20261115
owner: dot-B
kind: explore
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 82e13fe6a5895b48baa0ff659bfd23019e4e3f07
result_branch: relay/b-core-shadow-grid-stability-sources-20261115
page: domains/game-dev/04-client-modules.md@82e13fe6a5895b48baa0ff659bfd23019e4e3f07

## 目标与规格
按 game-module-from-case §2。MOBA 看地图时，验证固定分辨率灯光阴影在亚 texel 相机移动时是否应锁住光源空间投影；本卡只查源，不预设当前确实发生阴影抖动，也不建议直接上多级阴影。
- [Three.js CSM：分级包围、光空间 texel 吸附](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/examples/jsm/csm/CSM.js#L360-L412)。
- [Babylon.js CSM：投影偏移取整](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Lights/Shadows/cascadedShadowGenerator.ts#L527-L639)；[级联体稳定分支](https://github.com/BabylonJS/Babylon.js/blob/048566f71dfce0f62d993fd3a7bcadc844407315/packages/dev/core/src/Lights/Shadows/cascadedShadowGenerator.ts#L687-L721)。
- 指定消费者：[MOBA-Like quiet 当前世界、灯盒、跟随光源位置](https://github.com/dbvv1/MOBA-Like/blob/79bdb57439d2ca3e49c6560271d4a598999f5ac5/src/render/world.ts)；只核单灯可抄的一步，不接森林分支或首次编译。

## 范围与完成
只写 `docs/collaboration/local-jobs/artifacts/B-CORE-SHADOW-GRID-STABILITY-SOURCES-20261115/result.md`。每个源给锁原点或投影偏移、单位、旋转／缩放条件及失效边界的行链接；分清栅格取整与级联包围盒稳定。提出同尺寸阴影盒常向量平移的小测试（亚格内相位稳定、跨格仅一次移动），以及跟随灯光旋转／缩放盒子时的反例；标偏差、近裁白边及输入／规则不得随呈现改。无浏览器/GPU、性能结论或画质声称；dot 后续若在真实机位证实问题再决定小修，拟落 04-client-modules「世界光照与玩法提示」。

## 当前结果

- 完成探索并写出 result.md：175 条核实来源（渠道覆盖 9 类）按 S/A/B/C/D 分级，给出 floor/round 中心、rounding matrix、floor min/max、snap min/max、near-plane 取整等实现对照与单位/失效边界；结论是 MOBA 单灯固定 44 世界单位 1024 图时，最小一步为保盒尺寸/方向/near-far/bias 只锁光空间平移，不引级联，是否需做须 dot 在真实机位先证实；含 44/1024=0.04296875 世界单位/texel 的小测试（亚格内矩阵不变、跨格恰一步，floor/round/Godot 2-texel 分开采样）及只转灯、缩放/紧贴拟合、远原点、晚一帧等反例。审查 pass（7 项问题两轮修复关闭，关键源码行号复跑核对）。openIssues：Unreal 官方 CSM 文档正文为 JS 空壳、r.Shadow.StabilizeCascades 源码私有未核；Valient ShaderX6 原文未读到；Godot 论坛 137013/104449 仅楼主帖；牛客与 Unity 中国社区仅标题壳；23 条 StackExchange/Unity Discussions 403、3 条 CSDN 521 已经 API/移动 UA 读到正文。未运行：浏览器/GPU、Unity/three.js 渲染对比、MOBA 实机机位、性能/画质测量；不声称抖动已修复。
- 产物：[aef2cce](https://github.com/dbvv1/a1dbv/commit/aef2cceebe15b790493d54abd7a1b8cd3bc95cec)，分支 `relay/b-core-shadow-grid-stability-sources-20261115`。
- 检查：check_public（文件与新提交身份）、check_repo 本单元无新增错误；基线 82e13fe6 已有问题：docs\collaboration\nonstar-return-intake-20261106.md:24: missing link target: local-jobs/artifacts/B-PIPE-MATERIAL-REUSE-READER-20261104/quiet-reader-production-proof.test.ts（保留告警，交负责人接收）；独立审查通过。
- 下一步：负责人判断是否让 dot 在真实机位复现阴影抖动，证实后再按 result.md 的单灯最小步骤落 04-client-modules「世界光照与玩法提示」；未关闭的 Unreal/ShaderX6 等来源缺口保留为已知边界，不阻塞本卡。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
