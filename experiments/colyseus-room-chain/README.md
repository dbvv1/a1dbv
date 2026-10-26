# 用现成 Colyseus 接完一局房间

已有 Node 玩法、缺建房与会话生命周期时，从官方 Room／SDK 接起，不自建 WebSocket 匹配器。这个例子使用真实 Colyseus 服务进程和两个独立客户端进程：创建／加入→所有人准备→服务器开局→共同完成三次激活→退出并销毁房间。激活只是会话接缝，不是另一套游戏模拟；没有改 MOBA 或把它变成联网版本。

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
- `client.mjs` 展示可移植的 SDK 接线；`harness.mjs` 只负责独立进程测试，不是产品服务框架。真实游戏用其现有输入与 UI 代替 IPC，把权威规则接到收到的命令，把同步状态交表现层。
- 本例的匿名名字只是合成标签，`onAuth` 仅校验协议和格式。公开服务需接已认证用户、TLS、频率限制及持久数据；这里没有创建真实账号，也没有证明反作弊或公网承载。

**传输恢复不等于可以继续操作。** `onDrop` 保留玩家，`allowReconnection` 保座；`onLeave` 才删除最终离开的玩家。恢复后，每个客户端分别等自己的最新 state，再启用输入。固定 SDK 0.18.6 的 `onReconnect` 回调早于新 token 写入和后续全量 state；不要在这个回调同步保存旧 token 或把旧画面当新状态。刷新／进程重启得到新 Room，监听也要重建。

离线发送队列不是可靠业务日志。本例每次暂停递增输入 epoch，服务器拒绝恢复后积压的旧操作；当前 epoch 内客户端为每次新操作分配本地递增 seq，服务器去重，重复不加分；不能每次从尚未回来的 state 取 `lastSeq+1`，否则快速两次新操作会撞号。新 epoch／重连全量 state 后再从已确认序号续起。换成真实玩法时，保留会话与规则的责任划分，再为需要续传的事务设计确认／持久化，不把所有技能点击无条件补发。

**锁房、准备和持久化是不同事。** 满员自动锁不代表已开局；本例开始时显式锁房，直到结束不接新人。短线重连只恢复仍活着的服务进程内状态；进程崩溃、跨机迁移、存档和结算数据库未实现，不能把它称为容灾。

## 固定依赖与来源

`@colyseus/core 0.18.23`、`@colyseus/ws-transport 0.18.4`、`@colyseus/schema 5.0.42`、`@colyseus/sdk 0.18.6` 来自官方 npm，锁文件固定传递依赖。Colyseus 代码 MIT，依赖各保其许可；本例代码沿仓库 MIT。使用原生 `schema()`／`t.*`，不要求旧 decorator 编译配置。

官方 [房间](https://docs.colyseus.io/room)、[匹配](https://docs.colyseus.io/matchmaker)、[重连](https://docs.colyseus.io/room/reconnection)和[固定 SDK 包](https://registry.npmjs.org/@colyseus%2fsdk/0.18.6)；其他方案与完整模块见 [07 联网与服务端](../../domains/game-dev/07-networking-and-server.md#managed-room-chain)。
