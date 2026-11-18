# B-CORE-SCENERY-LOD-TRANSITION-SOURCES-20261115 · 路肩标准件跨观察距离不抖跳
id: B-CORE-SCENERY-LOD-TRANSITION-SOURCES-20261115
owner: dot-B
kind: explore
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 82e13fe6a5895b48baa0ff659bfd23019e4e3f07
result_branch: relay/b-core-scenery-lod-transition-sources-20261115
page: domains/game-dev/04-client-modules.md@82e13fe6a5895b48baa0ff659bfd23019e4e3f07

## 目标与规格
按 game-module-from-case §2。只看 Star 一簇装饰性非碰撞路肩件：远近切换保主轮廓，不需要近阈来回闪，不能读错实际道路边沿。区分硬切带滞回、淡变双绘与静态批次相容性。
- [Three.js LOD.update 的 zoom、距离阈与 visible 滞回](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/src/objects/LOD.js#L245-L292)。
- [Godot 可见距离实现、阈附近衰减／状态](https://github.com/godotengine/godot/blob/876b290332ec6f2e6d173d08162a02aa7e6ca46d/servers/rendering/renderer_scene_cull.cpp#L2759-L2827)；[不支持指定淡入淡出的渲染器提醒](https://github.com/godotengine/godot/blob/876b290332ec6f2e6d173d08162a02aa7e6ca46d/scene/3d/visual_instance_3d.cpp#L516-L536)。
- 指定消费者：[Star-Rush-Reborn scenery.js](https://github.com/dbvv1/Star-Rush-Reborn/blob/2f10cf9b0b8b5a83fcc28968113fdd4b0702af18/scenery.js) 和 [render-three.js](https://github.com/dbvv1/Star-Rush-Reborn/blob/2f10cf9b0b8b5a83fcc28968113fdd4b0702af18/render-three.js)，核真实对象所有权，不能当作已有 culling/LOD 采用。

## 范围与完成
只写 `docs/collaboration/local-jobs/artifacts/B-CORE-SCENERY-LOD-TRANSITION-SOURCES-20261115/result.md`。两个实现每个结论给行链接：距离选点、往返阈、哪种淡变有额外绘制、哪种平台不支持；至少一个 `d-ε → d+ε → d-ε` 回摆门槛示例及一个快速回看加雾遮住远层的反例。列可服从现有批次接口的最小建议和「保持无 LOD」停止条件（无可见反例、无成本证据）。不动相机、地图、关卡碰撞、绘制代码及拍摄队列；不要求拿到帧耗、截图或分数。dot 经实际采用才回写「运动中的清晰度／设备预算」。

## 当前结果

- **仅接收来源研究，不采用 LOD。** [原始返回 c3f028b](https://github.com/dbvv1/a1dbv/blob/c3f028b605e5eda09150fdba08c08c10ba428f1d/docs/collaboration/local-jobs/artifacts/B-CORE-SCENERY-LOD-TRANSITION-SOURCES-20261115/result.md#toc-conclusion)保留来源、比较和未读范围。不把清单逐条当已复核，不把 10%–15% 当通用建议。
- **核正回摆例。** Three.js r180 实际 `LOD.update`：切远阈 50 m、回差 0.1，远层活跃后小于 45 m 才切近。先从 0 m 初始化，49.9→50.1→49.9→45→44.9 m 为近、远、远、远、近；新建对象直接从 49.9 m 启动却先选远，因为远层初始可见。测正常回摆，也测重建后第一帧的层级。[r180 源码](https://github.com/mrdoob/three.js/blob/0af9729d0c143a86a1d725d6e2c3ad83301f3f34/src/objects/LOD.js#L245-L292)（本端 CPU 实测，2026-11-18）。
- **Star 保持不改。** 已部署 v12 的[赛道裁剪](https://github.com/dbvv1/Star-Rush-Reborn/blob/1796e9fc65c1af64415ecbf151432f0e273c1c3c/race.js#L170-L172)按玩家沿路线与 40 m 区块起点的环绕距离，裁的是整个区块；默认走 [island 后端](https://github.com/dbvv1/Star-Rush-Reborn/blob/1796e9fc65c1af64415ecbf151432f0e273c1c3c/render-three-island.js#L14-L18)，按相机视图深度做 150–560 m 雾，不是旧后端的 125–460 m，也不等价于沿道裁剪。摆件入实例批次前有独立节点，不必整区块换层；整区块还含道路和护栏，不能当作装饰件淡掉。若路肩跳变，先辨别整块裁剪还是同一件远近模型切换，不用雾距离推裁剪时刻；双层是否增提交要看实际批次与帧耗。尚无同路径实拍反例或性能证据，不开新拍摄、不回写采用知识。
