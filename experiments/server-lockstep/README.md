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
(cd generated-moba && node --import tsx ../run.mjs . 270 cast)
(cd generated-moba && node --import tsx ../run.mjs . 270 cast-jitter)
MOBA_SOURCE="$PWD/generated-moba" node --test test.mjs
```

如果已经取过，复用同一干净源，不重复 `git init`／`remote add`。只为 npm 缓存不可写时，可用自己的可写缓存目录；不要改系统目录权限。`generated*` 不跟踪，脚本拒绝错误 SHA、模拟／内容／锁文件的本地修改或缺失导航数据，不退回假模拟。

`run.mjs` 输出三进程 PID、每端确认到的 tick 与最终哈希。300 帧按 30 Hz 释放，约 10 秒；不是完整一局或吞吐基准。`jitter` 在发送端交错延迟并重复相同输入，仍应得到相同结果。`disconnect` 和 `desync` 是直接失败用例，预期非零退出；前者中途断连接，后者注入错误哈希，均不输出成功回执。

## 从命令到共同状态

1. **共同起点。** `source.mjs` 从固定源导入 `createDetourNavigation`／`Simulation`，seed 901、contentVersion 8、一队一英雄。握手比较源码 SHA、Node 版本、依赖锁／navmesh 哈希与初始状态哈希，齐了才开始。
2. **一帧一个输入包，包括空包。** 连接绑定一个玩家席位及英雄；本例接 `move`／`stop`／`cast`，服务端检查字段、有限坐标与英雄所有权。实际游戏把本地设备命令换入 `plannedInput`，不要让各端各自运行英雄 bot 来“生成相同输入”。
3. **服务端排帧。** 两席输入齐全后，按席位排序、各席内部保留操作顺序，再广播共同 `{tick, commands}`。不能按到包顺序排列，也不能把缺输入当作“玩家没有操作”。同帧同内容重试去重，冲突重试或错误帧号终止。
4. **模拟推进一次。** 两端只对服务端提交的下一帧 `step(commands)`，返回完整模拟状态哈希；服务端也跑同一规则并核对。上一帧两端确认后才提交下一帧。服务器有裁决职责，但这个样例不提供账号认证或反作弊安全证明。
5. **确定出口。** 本例到帧预算且两端哈希一致才结束，关闭连接并释放 Detour；断开／不一致／超过 5 秒没有进展则结束本局，不暗中填输入或继续显示成功。

这里故意采用容易看清责任的等待齐帧，不做输入预测。服务端每次释放的模拟步长固定；等待网络时墙钟变慢，不补几次巨大 `deltaTime`。TCP 提供传输内有序可靠字节，应用仍要处理消息分帧、重试身份和共同 tick。浏览器接入需把这一层换成现成 WebSocket／引擎传输适配，不能直接用 Node TCP API。

## 第二次接入：让原技能真的消耗法力与冷却

**网络层接收施法意图，原玩法决定能否施放。** `cast` 沿固定源的字段：`heroId`、`slot`、`targetId`、`direction`、`point`；没有目标的字段明确传 `null`。不让客户端传入法力、冷却、伤害或最终坐标来覆盖权威状态，也不在网络适配里复制一套技能数值。

| 接缝 | 本例实现与失败政策 |
|---|---|
| `protocol.mjs:validateInput` | 用当前连接已绑定的英雄校验 `heroId`，检查槽位、有限向量／目标 ID 及精确字段。零方向属于合法线协议数据，其玩法含义由原模拟决定；伪造 `mana` 等额外字段不进入模拟 |
| `canonicalInput`＋原 `(tick, seat)` ledger | 保全部施法字段和命令顺序，只规范 JSON 键顺序。待提交和已提交帧的相同重送均不再次 `step`；同身份改方向／目标／技能冲突。真正的新按键使用新 tick，不为网络重试换身份 |
| 原 `Simulation.step` | 身份／协议合法后，按原规则拒绝 `directionRequired`、`cooldown` 等玩法请求；该帧仍推进、仍提交给两端消费。不得只过滤拒绝命令后让两端跑另一份输入，原诊断状态也是完整哈希的一部分 |
| `run.mjs` 的观察与前缀重演 | 记录施法前后位置、法力、冷却及原 `CommandResult`，两端逐帧确认。完成后用同一原 `Simulation` 从初态消费实际提交的帧前缀；不是调用会跑至终局的 `replayMatch`，也不是新造技能模拟 |

`cast`／`cast-jitter` 用原默认 Veyra 的 W 位移技能；两队在出生点按相反方向施放，不改源状态或技能规则。2026-10-27，固定 Node 24.22.1／contentVersion 8／seed 901 的真实三进程结果：

| 实际输入 | 原规则观察 |
|---|---|
| tick 1，零方向 | 两人均 `directionRequired`，无位移／法力消耗，会话继续 |
| tick 11，合法 W | 两人各移动 7 单位；法力 330→300.2667（扣 30，再计当 tick 回蓝），剩余冷却 239 tick |
| tick 12，再按 W | 两人均 `cooldown`，位置不变，只正常回蓝，剩余冷却 238 tick |
| tick 253，冷却结束后新按键 | 再各移动 7 单位、消耗一次法力，不把“曾用过 W”误当永久去重 |
| 交错到达、当帧重送及 tick 20 重送旧 tick 11 | 共 49 次重复输入未再次施放；270 帧时双方各成功两次，法力约 304.8／冷却 222。普通流、重送流、两客户端及提交前缀重演均为 `dd223ecb507fe0a1` |

`cast-forged`、`cast-malformed`、`cast-future`、`cast-conflict` 分别通过真实 TCP 发送他人的英雄、额外 `mana` 字段、未开放帧、改写旧施法，均非零结束且不输出成功回执。前三者在第一项合法 W 提交前停止；最后一项保留此前真实施放，不重新应用旧帧。本例遇协议违规结束整局以便显露错误，不是推荐公网惩罚策略。

原七项移动／排序／断开等测试与新增六项技能／协议测试全部通过（13/13，无 skip）。这是旧固定源码的独立 CPU 接缝，未接当前产品输入、浏览器表现或 Unity。席位在本地握手中自行声明，**绑定后的控制权校验不等于账号认证**；公网采用前先接既有认证与入场审批。ledger 与帧记录只保本例最多 900 帧，不是长期开服的历史存储。

依据：[固定原施法规则](https://github.com/dbvv1/MOBA-Like/blob/3bcda00fb35361cc5a25ee74e3768a2f3678c563/src/sim/simulation.ts)与[技能数据](https://github.com/dbvv1/MOBA-Like/blob/3bcda00fb35361cc5a25ee74e3768a2f3678c563/src/content/catalog.ts)，以及上述真实消费者，2026-10-27。沿用已有规则是本例接入选择，不宣称网络栈或性能通用最优。

## 修改与采用边界

先改玩家命令或同帧排序测试，不改模拟算法来迎合网络。施法已沿上节接通，增加其他操作时同样扩展输入 schema、完整重试身份与真实模拟消费；规则合法性继续交模拟。需要加入中途恢复、预测或回滚时，先增加版本化状态保存／恢复和确认事件政策，再选择成熟栈；这个样例断线即结束，没有伪装重连。

当前结果与网络模型选择见[服务端模块](../../domains/game-dev/07-networking-and-server.md)。同机同 Node 的多进程哈希一致只支持这个运行条件；不证明浏览器间浮点一致、互联网延迟体验、设备性能或已接进 MOBA 可玩客户端。`jitter` 是真实连接上的发送延迟，不是完整公网丢包模拟。

代码沿仓库 MIT；未复制 MOBA 源码，使用 [固定正式源](https://github.com/dbvv1/MOBA-Like/tree/3bcda00fb35361cc5a25ee74e3768a2f3678c563/src/sim)及其锁定依赖，源仓库和依赖许可分别保留。
