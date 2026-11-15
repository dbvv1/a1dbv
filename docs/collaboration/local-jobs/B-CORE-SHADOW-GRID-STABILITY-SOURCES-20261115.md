# B-CORE-SHADOW-GRID-STABILITY-SOURCES-20261115 · 相机平移时阴影格不随亚像素漂
id: B-CORE-SHADOW-GRID-STABILITY-SOURCES-20261115
owner: dot-B
kind: explore
status: ready
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
