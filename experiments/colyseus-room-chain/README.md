# 用现成 Colyseus 接完一局房间

已有 Node 玩法、缺建房与会话生命周期时，从官方 Room／SDK 接起，不自建 WebSocket 匹配器。这个例子使用真实 Colyseus 服务进程和两个独立客户端进程：创建／加入→所有人准备→服务器开局→共同完成三次激活→退出并销毁房间。激活只是会话接缝，不是另一套游戏模拟；没有改 MOBA 或把它变成联网版本。下方[房间到可信结果](#房间到可信结果)把同一房间职责接到已有 CPU 模拟与 Nakama 确认链。

## 第一次运行

需要 Node ≥22（本次使用 24.22.1）。只安装公开 npm 依赖，不需要服务账号、数据库、浏览器或云部署。

```sh
cd experiments/colyseus-room-chain
npm ci
npm run demo -- normal
npm run demo -- reconnect
npm run demo -- restart
npm run demo -- timeout
npm run demo -- trio
npm test
```

每次启动一个仅监听 `127.0.0.1` 的临时服务；输出真实进程 PID、阶段与房间销毁数量，不打印重连 token。结束会关闭服务和全部子进程。`restart`／`timeout` 会故意结束本例自己的一个客户端进程，不影响其他程序。

| 模式 | 读者应看到什么 |
|---|---|
| `normal` | 少一人 ready 时留大厅；齐备才开局；两端看到 `completed` 和 3/3，最后 listed rooms 为 0 |
| `reconnect` | 真实连接断开，服务端暂停并保座；同一个 SDK Room 恢复，收到新状态后继续，已完成激活不丢失 |
| `restart` | 一个客户端进程退出，新进程凭内存里转交的 token 回原席位；重新绑定监听，等全量状态再继续 |
| `timeout` | 超过本例 2 秒保座期，旧局以 `peer-left` 结束；旧 token 失败，不能偷偷创建新房冒充恢复 |
| `trio` | 二改仅把服务器房型改成三人；两人 ready 仍留大厅，第三人 ready 后才开始，原双人房不变 |

`timeout` 模式预期的业务结果是“旧局结束且重连被拒”，因此完成这些断言后进程退出 0；它不是把重连失败报告成成功恢复。其他意外错误非零退出。自动重试延迟缩短只为这组小实验，2 秒窗口也不是线上推荐值。

## 接进现有项目时改哪里

- `room.mjs` 是应用规则：服务端确定房型人数、ready、开始、暂停与结束；`Room`／`MapSchema` 状态同步、座位、连接和回收都由官方库完成。会话身份取 `client.sessionId`，不让消息指定要操作的其他玩家。
- `server.mjs` 定义 `duo`／`trio` 两种服务器房型；好友房用 `create→joinById`。原生 `joinOrCreate` 在测试中演示按房型匹配；以后按地图或规则版本找房时，显式配置服务端 `filterBy` 并验证输入，不能假设任意参数会自动参与匹配。
- `client.mjs` 展示 SDK 接线，`session-owner.mjs` 拥有当前玩法会话、快照与输入序号；`harness.mjs` 只负责独立进程测试，不是产品服务框架。真实游戏用其现有输入与 UI 代替 IPC，把权威规则接到收到的命令，把同步状态交表现层。
- 本例的匿名名字只是合成标签，`onAuth` 仅校验协议和格式。公开服务需接已认证用户、TLS、频率限制及持久数据；这里没有创建真实账号，也没有证明反作弊或公网承载。

**传输恢复不等于可以继续操作。** `onDrop` 保留玩家，`allowReconnection` 保座；`onLeave` 才删除最终离开的玩家。恢复后，每个客户端分别等自己的最新 state，再启用输入。固定 SDK 0.18.6 的 `onReconnect` 回调早于新 token 写入和后续全量 state；不要在这个回调同步保存旧 token 或把旧画面当新状态。刷新／进程重启得到新 Room，监听也要重建。

**准备按钮同样等当前状态，不能借离线队列代替玩家恢复后的确认。** `SessionOwner.ready()` 要求当前 state 已初始化、本席 connected、连接实际打开；否则同步抛错，UI 保持等待，不自动重试旧 ready／取消 ready。服务器仍决定合法阶段。2026-10-28 真实 loopback 复现旧实现把断线期间的 ready 排队，重连后自动开局；修复后 socket 刚关闭、onDrop 后及 onReconnect 中都拒发，收到新 state 后仍留大厅，显式准备才开局并能继续激活。SDK 队列未改，原切房与恢复所有权继续沿下面的规则。

离线发送队列不是可靠业务日志。本例每次暂停递增输入 epoch，服务器拒绝恢复后积压的旧操作；当前 epoch 内客户端为每次新操作分配本地递增 seq，服务器去重，重复不加分；不能每次从尚未回来的 state 取 `lastSeq+1`，否则快速两次新操作会撞号。新 epoch／重连全量 state 后再从已确认序号续起。换成真实玩法时，保留会话与规则的责任划分，再为需要续传的事务设计确认／持久化，不把所有技能点击无条件补发。

**锁房、准备和持久化是不同事。** 满员自动锁不代表已开局；三次激活房型开始时显式锁房，直到结束不接新人。短线重连只恢复仍活着的服务进程内状态；这条重连链不含进程崩溃、跨机迁移或数据库恢复，不能把它称为容灾。

## 切房与取消恢复

**单一玩法会话由 `SessionOwner` 拥有，网络连接继续由 Colyseus 管。** 这个薄层已经接入上面的全部客户端入口；它解决同一应用回菜单、换房和取消恢复的归属，不替代 SDK、认证或服务器输入 epoch。已有流程所有者时，把相同判断接进去即可。

```js
import { Client } from '@colyseus/sdk';
import { SessionOwner } from './session-owner.mjs';

const sdk = new Client(endpoint);
const owner = new SessionOwner();
await owner.connect(() => sdk.joinById(roomId, {name:'Guest',protocol:1}));
// JOIN 完成后仍等 owner.inspect().initialized；playing 后才可 activate()。
owner.ready();
// 用户取消恢复／回菜单；立刻撤销输入和快照归属，再等待旧连接清理。
await owner.leave();
```

切换时先递增本地代次并离开旧 Room，再发起新加入；失败留在失败态，而不是回到旧局。每个监听捕获自己的 Room 与代次，迟到成功主动释放拿到的 Room，迟到失败不改当前 UI。`inspect()` 返回当前 `roomId`／`sessionId`、值快照和已发序号，`token()` 仅在收到当前 state 后可读；用这份快照驱动现有呈现，别绕过所有者继续保存全局 Room。异步加载场景或角色时，最终应用结果仍要核归属，本例只同步消费状态。

三个身份各有职责：SDK 的 `roomId/sessionId` 定位房间与席位；本地 `generation` 淘汰旧请求／回调；服务器 `epoch + seq` 淘汰同局旧操作并去重。本地代次不是授权凭据，`sessionId` 也不是永久账号。

**释放旧 Room 不是清空所有监听就结束。** 固定 SDK 的内部 `onLeave` 负责自身清理，所有者只移除自己注册的处理器。0.18.6 已排队的 retry timer 不会被 `enabled=false` 撤销：所有者关闭“断开事件再启动重连”的开关、丢弃旧瞬时操作队列，并保留释放监听；已经进入的 SDK retry 链仍可能继续至成功或达到 SDK 上限，成功后只离开那个旧 Room。调用方取消的只是采用资格，SDK 的 HTTP／WebSocket 请求仍可能完成；`leave()` 不承诺离线时服务器已经即时释放席位，服务器保座超时仍是最终出口。用户继续当前会话时，自动重连、全量 state 门槛和原输入序号逻辑保持不变。

```sh
node --test ownership.test.mjs
npm test
```

2026-10-27 的实际消费者是原固定服务／SDK 与真实 WebSocket，不调用伪造的 state 回调：

| 情境 | 观察到的结果 |
|---|---|
| 同一客户端从已得 1 分的 duo 切到 trio | 旧席位移除、旧局以 `peer-left` 结束；新局两次快速操作得到 `lastSeq=2`、分数 2，不继承旧局身份 |
| 自动重试中退出，再创建新房 | 新房已收到 state 时，旧清理仍在等待；500 ms 重试成功后释放旧 Room，2500 ms 重试过保座期被拒，两者均不改变新房，首个操作为 seq 1 |
| 手动重连成功，但结果晚于新房返回 | 确实恢复原席位的旧 Room 被释放，新局仍能推进；旧局保留原 1 分后结束 |
| 加入尚未返回时取消 | 无当前快照、输入或可读 token；迟到 Room 被释放，空房回收 |
| 旧请求失败晚到／当前缺失房间 | 前者不覆盖新局；后者明确失败并保空状态，不回退旧局 |

迟到成功／失败用可控 Promise 暂缓**应用接收**，服务、SDK 握手与恢复状态照常真实运行，不是人为制造公网延迟。原 8 项加这 6 项，共 14 项通过，无 skip；未做跨设备、代理丢包、Unity／UE 或生产认证测试。基线旧全局 Room 写法曾让新房 ID 配上旧房玩家／分数；本次增量修复该应用竞态，不宣称网络库有此缺陷。

依据：官方[连接生命周期](https://docs.colyseus.io/sdk/connection)与 npm 固定 SDK 0.18.6 的 `Room.mjs`／`signal.mjs`，2026-10-27。上游 [#950](https://github.com/colyseus/colyseus/issues/950)是服务器旧退出误关新连接的另一处问题，维护者与报告者已确认修复，当前 core 已含；中文 [Cocos 切后台讨论](https://forum.cocos.org/t/topic/169358)提示真实设备可能不立即送达断开回调，因此这里不把 loopback 清理视为移动端保证。

## 房间到可信结果

**🧪 已有房间、原模拟和进度后端，就让房间调起原权威作业，再把持久确认回给同一会话。** `bot_job` 是新增房型，复用上面的 `SessionOwner` 与[已有终局消费者](../nakama-player-progress/README.md#原模拟终局到确认进度)，不改变 `duo/trio` 的重连／输入规则。两个账号是经过真实 Nakama 登录的**合成观战／试验坐席**，只负责准备和观察；实际战斗由原 bot 完成。这里对合成账号写进度是测试，**入房或观战不构成真实参赛／奖励资格**。

### 运行与接线

先按[原 Nakama 入口](../nakama-player-progress/README.md#运行)准备固定官方二进制，按[原模拟入口](../server-lockstep/README.md)准备干净固定源码和依赖。版本不变：Nakama 3.41.0、PostgreSQL 17.11、JS SDK 2.8.0；MOBA 源仍为 `3bcda00fb35361cc5a25ee74e3768a2f3678c563`，只读取、不复制原源码，许可边界沿原实验。以下从仓库根运行：

```sh
npm --prefix experiments/colyseus-room-chain ci --ignore-scripts
npm --prefix experiments/nakama-player-progress ci --ignore-scripts
# 首次准备二进制；已有同版本可沿原入口设置 NAKAMA_BIN／PG_*。
npm --prefix experiments/nakama-player-progress run prepare:linux
export MOBA_SOURCE=/path/to/fixed-moba-source
npm --prefix experiments/colyseus-room-chain run demo:match -- normal
npm --prefix experiments/colyseus-room-chain run demo:match -- retry
npm --prefix experiments/colyseus-room-chain run test:match
```

运行器创建本次独有的 loopback 数据库、Nakama、Colyseus 服务与两个独立 SDK 客户端；模拟和结算发送者另起进程。`normal` 打印同一 match ID／终局、两份确认进度和补榜值，最后空房销毁；`retry` 让真实发送者在第一笔数据库提交后退出，重启 Nakama，再补投**原文件**。正常结束或捕获到运行错误后都会收尾本次进程，合成数据库与结果保留在原 `.local/runs/`，不会打印 session token 或服务 key。

```text
Nakama session → static onAuth → 固定试验坐席
       ↓ 两席都 ready，房间只启动一次
原 runBotMatch → 原 replayMatch → 完整终局文件
       ↓ 原可信发送者（key 不进客户端）
每席 receipt + progress → 房间 completed → 客户端补榜
       ↑ 部分确认失败只重送同一文件，不重开模拟
```

| 接口／所有者 | 需要保住的合同 |
|---|---|
| `match-room.mjs:static onAuth` | SDK 通过 `auth.token` 发送登录态；匹配前调用 Nakama `/v2/account` 验证，再对照**服务端配置**的两个账号／队伍。消息只含 `protocol`，客户端不能指定用户、队伍、分数或文件路径；`onJoin` 再拒绝同账号占两席 |
| `ready {ready:boolean}` | 少一席／少一次 ready 留大厅；齐备后同步切 `running` 并锁房，再启动原作业。重复 ready 不生成第二局，任意额外字段被拒 |
| `match-source`／`match-delivery` | 直接复用原模块。仅原胜负终局且完整回放相符才保存；服务器决定 match ID 和试验映射。key 只留可信服务／发送进程，不接受客户端结果上传 |
| `settlement-pending` → `retry-settlement {}` | 任何已入场试验席可请求补投，但不能改内容；同步切 `settling` 避免双发送者。双方均获真实回执才 `completed`；此前 `confirmed=0` 表示房间未获完整确认，不表示数据库没有部分提交 |
| `match-client.mjs`／`SessionOwner` | 只消费当前房间状态的阶段、match ID、winner、tick、hash 和确认数；这里没有玩家技能／移动输入，也没有把 hash 当签名或反作弊证明 |

### 离开、失败与不适用范围

大厅离开会撤掉该席并清除剩余 ready。运行中离开／掉线会中止**采用资格**：有限 CPU 作业仍排空，最后一次异步读取后再核阶段，丢弃未采用结果、不送结算；不是立即杀进程。终局已经采用并开始结算后，离开不会撤销数据库提交。房间 `onDispose` 等自有作业结束；运行器的正常／错误收尾会等本次子进程退出。

这个作业房型明确**不保座、不重连**；原 `duo/trio` 的自动恢复仍在原入口。原模拟 timeout 是失败，不发胜利进度。发送中断则保原结果，活房间可请求重投；最后一个观察者离开后房间回收，文件仍在，但本例不自动恢复房间或扫描补投。需要无人值守可靠交付时，接项目已有持久任务／结果存储，不把房间内 Promise 当队列。

2026-10-27 的 5 项真实服务测试通过：认证与准备屏障／一次正常终局；首提交后退出＋后端重启＋双客户端同时补投；不齐备离开；原模拟 timeout；运行中离开。正常终局为红方胜、tick **26794**、原完整回放哈希 **`e92fbbda809dc635`**；重送得到一重复、一首次，两席 `runs` 都为 1，榜单 0／100，作业未重开。缺登录态、错误 token、非配置账号、冒充字段与重复 ready 均走真实接口；没有用伪造回调代替服务。

这条链适合读懂“房间→原规则→确认结果”的接缝，**不是当前 MOBA 可玩站点联网完成**。尚未接真人输入、画面、Unity／UE、公网和生产权限；真实参赛资格、并发局约束与奖励审批须由可信业务单独决定，不能复制本例试验席映射给所有旁观者发奖。双方仍是逐玩家事务，完整结果保存前的崩溃、磁盘／主机丢失保障沿原实验未实现。

依据：官方 [Colyseus 房间认证](https://docs.colyseus.io/auth/room)与固定 core `MatchMaker`／`Room` 的 static auth→seat→onJoin 路径；[Nakama 外部权威服务](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)，原固定模拟／确认实现与本次真实服务消费者，2026-10-27。复用此前官方、开源、开发者原文和中文社区对房间职责的比较，本次只补消费接缝，不声称这套组合是通用部署最优。

## 固定依赖与来源

`@colyseus/core 0.18.23`、`@colyseus/ws-transport 0.18.4`、`@colyseus/schema 5.0.42`、`@colyseus/sdk 0.18.6` 来自官方 npm，锁文件固定传递依赖。Colyseus 代码 MIT，依赖各保其许可；本例代码沿仓库 MIT。使用原生 `schema()`／`t.*`，不要求旧 decorator 编译配置。

官方 [房间](https://docs.colyseus.io/room)、[匹配](https://docs.colyseus.io/matchmaker)、[重连](https://docs.colyseus.io/room/reconnection)和[固定 SDK 包](https://registry.npmjs.org/@colyseus%2fsdk/0.18.6)；其他方案与完整模块见 [07 联网与服务端](../../domains/game-dev/07-networking-and-server.md#managed-room-chain)。
