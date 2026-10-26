# 离线导航数据到群体移动

用固定的 `recast-navigation@0.43.1`（MIT）跑通原创 60×10 米平面：烘焙、导出文件、销毁烘焙对象，再独立载入、查完整通路、让 8 个单位对穿。几何二改在中央加入不可走隔离带，发布另一份数据，旧版本仍能复跑。默认输出只在本地忽略目录，不提交二进制或过程报告。

## 复跑

Node.js 24、npm；从 a1dbv 仓库根执行：

```sh
npm --prefix experiments/recast-navigation ci --ignore-scripts --no-audit --no-fund
node experiments/recast-navigation/cli.mjs bake experiments/recast-navigation/generated/v1 open
node experiments/recast-navigation/cli.mjs run experiments/recast-navigation/generated/v1
node experiments/recast-navigation/cli.mjs bake experiments/recast-navigation/generated/v2 split
npm --prefix experiments/recast-navigation test
```

版本目录必须不存在；已有目录保留，重跑换新目录。`run .../generated/v2` **预期 exit 1**：终点已被隔离，不能把局部路径当完整通路。输入是本例作者指定的可行走底面，不是从引擎碰撞世界提取的场景；`split` 是离线几何变更，不是动态门或 TileCache 实验。

## 可以借走的实现

- `navigation.mjs`：`bake` 保存 navmesh 与 manifest；`load` 核本例几何、包版本、配置、长度和 SHA-256 后导入。manifest 来自可信制作端，这不是任意恶意二进制的安全验证器。
- `route`：先在小范围投影端点，再检查路径最后一个多边形是否真到终点多边形。`computePath().success` 允许局部路径，不能代替这个判断。
- `simulate`：按固定顺序创建 Agent，每 tick 调 `crowd.update(1/30)`；消费者读取 `position()`，不再叠加一次速度。到期核到达，结束移除 Agent 并销毁 Crowd／Query／NavMesh。
- `navigation.test.mjs`：实跑正常导出／导入与同机新进程回放、几何二改与旧版本保留、缺失／损坏／版本不符输入、无效目标、容量耗尽，以及两个 Query 共用随机状态的反例。

烘焙配置的 `cs/ch` 是米，`walkableRadius/Height/Climb` 是体素数：本例 `0.2/0.2`、`2/10/2` 对应半径 0.4 米、净高 2 米、爬阶 0.4 米；Crowd 的半径／高度则直接用米。角色规格或体素尺寸改变后一起重算，别把两个接口的同名量直接复制。

## 已验到哪

2026-10-25 UTC，Node 24.22.1：初版 navmesh 6132 字节；8 单位、900 tick／30 Hz 到达，两次同进程及新 Node 进程轨迹 hash 相同。最小圆心距离约 0.799747 米，小于半径和 0.8 米，存在微小重叠；Crowd 是局部避让，不是严格碰撞求解器。固定版本的 `findRandomPointAroundCircle` 共用 WASM FastRand，交错其他 Query 会改变本局序列；可让自己的按局 PRNG 产生明确候选，再投影／核通路，本例正常路径不调用库随机选点。

这是从开局重放输入，不是恢复 Crowd 中途快照，也不是跨设备确定性、吞吐 benchmark、Unity／UE 或 MOBA 已采用的证明。正式游戏还要接生命期、停距、技能打断、碰撞政策与动画；引擎与移动职责见 [05 追击与让路](../../domains/game-dev/05-gameplay-architecture.md#追击与让路有路径不等于走得自然)。

来源：[官方固定源码](https://github.com/isaac-mason/recast-navigation-js/tree/8769e8b9995f127033af9f6e6eeac3fad7d66201)、本目录锁文件与实际安装的 API；第三方实现仅作为 npm 依赖，不复制其源码。原有引擎与游戏机制证据继续见 [WP11 导航](../../docs/research/wp11-combat.md#s19-1)。
