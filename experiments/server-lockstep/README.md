# 两个真实 MOBA 模拟进程消费同一输入帧

这个入口给已有确定性玩法补上最小联机接缝：一个裁决／排序进程，通过真实 loopback TCP 给两个独立 Node 进程发有序输入帧；三者使用未修改的正式 MOBA 模拟、实际 Detour 导航数据与相同依赖。不是在一个进程里调用两次玩具加法，也不是 MOBA 浏览器已经联网。

## 取固定源并运行

已实用 Node 24.22.1；源工程要求 Node ≥22.12。需要 Git、npm。先安装公开固定源自己的锁定依赖，不安装浏览器：

```sh
cd experiments/server-lockstep

git init generated-moba
git -C generated-moba remote add origin https://github.com/dbvv1/MOBA-Like.git
git -C generated-moba fetch --depth 1 origin 3bcda00fb35361cc5a25ee74e3768a2f3678c563
git -C generated-moba checkout --detach FETCH_HEAD
npm --prefix generated-moba ci

(cd generated-moba && node --import tsx ../run.mjs . 300 normal)
(cd generated-moba && node --import tsx ../run.mjs . 300 jitter)
MOBA_SOURCE="$PWD/generated-moba" node --test test.mjs
```

如果已经取过，复用同一干净源，不重复 `git init`／`remote add`。只为 npm 缓存不可写时，可用自己的可写缓存目录；不要改系统目录权限。`generated*` 不跟踪，脚本拒绝错误 SHA、模拟／内容／锁文件的本地修改或缺失导航数据，不退回假模拟。

`run.mjs` 输出三进程 PID、每端确认到的 tick 与最终哈希。300 帧按 30 Hz 释放，约 10 秒；不是完整一局或吞吐基准。`jitter` 在发送端交错延迟并重复相同输入，仍应得到相同结果。`disconnect` 和 `desync` 是直接失败用例，预期非零退出；前者中途断连接，后者注入错误哈希，均不输出成功回执。

## 从命令到共同状态

1. **共同起点。** `source.mjs` 从固定源导入 `createDetourNavigation`／`Simulation`，seed 901、contentVersion 8、一队一英雄。握手比较源码 SHA、Node 版本、依赖锁／navmesh 哈希与初始状态哈希，齐了才开始。
2. **一帧一个输入包，包括空包。** 连接绑定一个玩家席位及英雄；本例只接 `move`／`stop`，服务端检查字段、有限坐标与英雄所有权。实际游戏把本地设备命令换入 `plannedInput`，不要让各端各自运行英雄 bot 来“生成相同输入”。
3. **服务端排帧。** 两席输入齐全后，按席位排序、各席内部保留操作顺序，再广播共同 `{tick, commands}`。不能按到包顺序排列，也不能把缺输入当作“玩家没有操作”。同帧同内容重试去重，冲突重试或错误帧号终止。
4. **模拟推进一次。** 两端只对服务端提交的下一帧 `step(commands)`，返回完整模拟状态哈希；服务端也跑同一规则并核对。上一帧两端确认后才提交下一帧。服务器有裁决职责，但这个样例不提供账号认证或反作弊安全证明。
5. **确定出口。** 本例到帧预算且两端哈希一致才结束，关闭连接并释放 Detour；断开／不一致／超过 5 秒没有进展则结束本局，不暗中填输入或继续显示成功。

这里故意采用容易看清责任的等待齐帧，不做输入预测。服务端每次释放的模拟步长固定；等待网络时墙钟变慢，不补几次巨大 `deltaTime`。TCP 提供传输内有序可靠字节，应用仍要处理消息分帧、重试身份和共同 tick。浏览器接入需把这一层换成现成 WebSocket／引擎传输适配，不能直接用 Node TCP API。

## 修改与采用边界

先改玩家命令或同帧排序测试，不改模拟算法来迎合网络。新增技能命令时，扩展允许的输入 schema、连接所有权校验与真实模拟消费；给每帧/操作保稳定身份，规则合法性继续交模拟。需要加入中途恢复、预测或回滚时，先增加版本化状态保存／恢复和确认事件政策，再选择成熟栈；这个样例断线即结束，没有伪装重连。

当前结果与网络模型选择见[服务端模块](../../domains/game-dev/07-networking-and-server.md)。同机同 Node 的多进程哈希一致只支持这个运行条件；不证明浏览器间浮点一致、互联网延迟体验、设备性能或已接进 MOBA 可玩客户端。`jitter` 是真实连接上的发送延迟，不是完整公网丢包模拟。

代码沿仓库 MIT；未复制 MOBA 源码，使用 [固定正式源](https://github.com/dbvv1/MOBA-Like/tree/3bcda00fb35361cc5a25ee74e3768a2f3678c563/src/sim)及其锁定依赖，源仓库和依赖许可分别保留。
