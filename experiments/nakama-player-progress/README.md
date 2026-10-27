# 同一玩家的云档、确认进度与排行榜

**先恢复同一账号，再解决存档版本；可信奖励与玩家可写的单机云档分开。** 这个入口直接运行 Nakama 与 PostgreSQL，用官方 JS SDK 的两个客户端实例演示完整链，不自建账号数据库，也不把一次 RPC 当防作弊。

## 运行

已实跑：Linux x64／Debian 13、Node 24.22.1、Nakama **3.41.0**、PostgreSQL **17.11**、`@heroiclabs/nakama-js` **2.8.0**。代码使用 Node 22+ API；其他平台／版本需另验。运行器通过官方 `NAKAMA_TELEMETRY=0` 关闭服务遥测，安装禁用依赖脚本；全部服务仅绑定 `127.0.0.1`，数据库新建在本目录 `.local/runs/`，不接真实玩家或已有数据库。

```sh
cd experiments/nakama-player-progress
npm ci --ignore-scripts
npm run prepare:linux
npm run demo
npm test
```

`prepare:linux` 只在 Debian 13 x64 下载官方 Nakama 发布包和 Debian PostgreSQL 包，核固定 SHA-256 后解包到 `.local/`；不运行包的安装脚本、不改系统、无需 root。需要 `curl`、`tar`、`dpkg-deb` 及发行版已有共享库。缺库／校验失败即停，勿为继续试验替换系统库。已有同版本工具可用 `NAKAMA_BIN`、`PG_BIN`、`PG_SHARE`、`PG_LIB` 指向对应可执行文件／目录；这些是本机路径，不填线上服务地址。

demo 会打印：
1. 原设备创建合成游客，绑定临时 `example.invalid` 邮箱，第二客户端登录同一 ID、读取章节 1；
2. 一端先存章节 2，另一端用旧版本存章节 3 被拒，最新值仍为 2；
3. 可信**测试调用方**提交分数 120，得到 XP 12／最高分 120；同一结果重送不再加 XP；
4. 真正重启 Nakama 进程，保留数据库，重新登录仍有确认进度；
5. 第二需求增加“累计 XP≥20 解锁冲刺”，保原 XP／最高分，最终 XP 22／最佳 120，补齐排行榜；
6. 正常／异常退出都关闭本次启动的服务与数据库进程。

合成密码、会话与服务调用 key 不打印、不提交；运行目录保留合成数据库及排错日志并被 Git 忽略，可在服务关闭后清理该次目录。不要把演示的 loopback／trust 数据库配置搬到生产。这里不是实际跨物理设备／第三方身份提供方／邮件找回验证，也不是备份恢复测试。

## 接自己的玩法时改哪里

| 职责 | 入口 | 接入决定 |
|---|---|---|
| 身份与客户端保存 | `client.mjs` 的 SDK 调用 | 原账号登录态下 `linkEmail`，另一端 `authenticateEmail(..., false)`；真实产品通常接已有平台身份，密钥不能随客户端交付 |
| 普通单机云档 | `save/slot_*`＋原生版本写入 | 仅 owner 读写；创建用 `*`，更新用上次读取版本，冲突后重新读取、由玩法／用户选择，不按设备时间静默覆盖 |
| 可信结算 | `runtime.js` 的 `settle_demo_result`；原夹具在 `trusted-backend.mjs`，真实来源在 `match-source.mjs` | 消费原权威模拟的胜负；只接受服务端调用 key，无玩家会话。客户端上传分数后原样转发不满足这一前提 |
| 确认与去重 | 同一次 `nk.storageWrite` 的 receipt＋progress | 稳定结果 ID 仅提交一次；同 ID 不同内容拒绝。并发条件写失败可用同 ID 重试，不能生成新 ID 把重送变成新奖励 |
| 排行榜 | `repair_my_rank`＋authoritative `best_run_v1` | 只从已确认 progress 投影最高分；可在确认后／登录后调用。没投影时进度已保存但榜单会暂时落后，两者不是一个事务 |
| 二改 | 结果 `rule:2`→profile schema 2 | 在服务端派生解锁，保持老累计值；已有 rule 1 调用仍兼容。此例不是任意旧档自动迁移器 |

`beforeWrite` 不只保护已经存在的进度：它也禁止客户端抢先创建 `progress`／`settlement`，否则仅给后续对象设 `permissionWrite:0` 还不够。普通存档与竞技奖励分权后，玩家自己改章节不会变成可信分数。

排行榜使用 `best`，不是重试会再次累加的 `incr`。它适合这里的非递减最高分；赛季切换、撤销作弊分、扣减累计值需另定版本／重建政策，不能照搬此投影。榜单记录不是可变玩家档案。

### 固定版本的 RPC 接缝

SDK 2.8.0 的 `rpcHttpKey` 把 payload 放进 GET query，而 Nakama 3.41.0 的 HTTP RPC 实现只从 POST body 取 payload。`trusted-backend.mjs` 的可信调用用官方 POST 入口并按协议把 JSON 字符串再编码一层；不改 SDK、不把空 payload 当成功；该模块及 runtime HTTP key 只属于隔离测试后端，不复制进玩家客户端。玩家侧 `client.rpc` 本来就是 POST。升级后先沿测试验证，不把这个固定组合的问题推广成所有版本不兼容。

## 原模拟终局到确认进度

**用现有权威模拟产结果，把失败重投接到原 receipt，而不是另写一个打分玩具。** 这个入口只读取上文 [07 输入帧实验](../server-lockstep/README.md)已采用的 MOBA 固定 `3bcda00fb35361cc5a25ee74e3768a2f3678c563`，运行原 `runBotMatch` 和 `replayMatch`。它是旧源码的独立 CPU 消费者，不是当前 MOBA 产品接入；该固定树未单列 LICENSE，本例不复制／分发原模拟，第三方采用另核源码与资产许可。

先按原[输入帧入口](../server-lockstep/README.md)准备干净固定源码与其 `npm ci`。沿本页已有 Nakama／PostgreSQL 准备步骤，然后运行：

```sh
# 换为已有、干净的固定 MOBA 源码目录；子进程从该目录解析原 tsx 依赖。
export MOBA_SOURCE=/path/to/fixed-moba-source
npm run demo:match
npm run test:match
npm test
```

`demo:match` 由可信本地调用方创建两个合成账号，经 `getAccount` 取得真实账号 ID 后分配队伍；未实现公网入场协议。运行和交付结果的进程分开，HTTP key 只经本地 IPC 交给发送者，不进结果文件或玩家构建。全部网络仍为本页临时 loopback 服务。

```text
原 Simulation + 原 Bot → 真实终局 + 原完整回放
          ↓ 完整写入一次，已有文件不覆盖
     同一 match ID / 参与者 / 终局文件
          ↓ 可重启发送者，重复仍用同一文件
每位玩家的 receipt + progress（同一原生存储批次）
          ↓ 玩家登录后也可补
       authoritative best 排行榜
```

| 入口 | 项目要保住什么 |
|---|---|
| `match-source.mjs` | 固定源校验后才加载；只接受实际 `blueWin/redWin` 与对应 winner。`isComplete()` 也会对 timeout 返回 true，因此不能直接把它当胜利。全量回放一致后才写终局文件，来源／规则身份随记录保存 |
| `match-result.mjs` | 读取已经保存的服务端结果；本例按实际胜方给 score 100、负方 0，再沿原 XP 公式。文件的 SHA-256 是稳定内容身份，不是防伪签名；不接玩家上传的结果／回放 |
| `match-delivery.mjs` | 逐玩家调用原可信 POST；部分玩家已确认时可重送整个文件。重送不换 match ID、不重新生成文件；修改文件字节会改变指纹，同 ID 再送会冲突 |
| `runtime.js` | receipt 同时比较 score、rule、可选 `resultFingerprint`；原无指纹演示仍兼容，带指纹的新结果不能当成无指纹旧请求重送。每位玩家的 receipt＋progress 原子提交，双方不是一个整体事务 |
| `match-process.mjs` | 只是 demo／测试子进程启动器；进程退出与 IPC 失败必须显式失败，不能改成补一份合成分数。实际项目沿自己的专服与任务运行器 |

本地文件只覆盖“完整写入后，发送进程退出”的恢复。未实现文件写入中崩溃／磁盘或主机丢失保护，也没有后台队列扫描器；恢复调用方明确重送已保存文件。生产项目已有数据库／可靠队列时，直接接那里，不为本示例换成文件队列。奖励规则、参与者和结果来源必须由可信服务器决定；文件 schema 和哈希本身不证明一局真实。

### 已观察到的完整一局与失败恢复

2026-10-27，在同一 Linux x64／Node 24.22.1 上：seed 901、内容版本 8、原 normal bot 对局在 **26,794 tick／893.133 逻辑秒**结束，红方获胜，原完整回放与终局哈希均为 `e92fbbda809dc635`。逻辑时长不是墙钟耗时、真人体验或吞吐指标。

| 实际操作 | 权威后端观察 |
|---|---|
| 真实发送进程在第一位提交后 `exit 17`，未向调用方回 ACK | 第一位完成次数 1；第二位尚无进度 |
| 重启 Nakama、保原数据库，再由新发送进程读原文件 | 第一位 `duplicate:true`，第二位 `duplicate:false`；双方完成次数各 1，XP 为 0／10 |
| 重送全部结果，再各补写两次排行榜 | 完成次数仍各 1；原来空榜的记录为 0／100，没有重复 XP |
| 同 ID／同分数换文件指纹 | 返回条件冲突，不覆盖原进度 |
| 原模拟设置 1 秒上限真实跑到 timeout | 拒绝产出结算文件；未把“完成”当“胜利” |
| 缺源码、缺／坏文件、玩家会话直接交真实结果 | 失败，无新奖励；缺源码不走替代模拟 |

新增四项真实消费者测试、原十一项账号／存储测试及 `demo:match` 均通过，无 skip。这里证明原模拟终局进入本地真实后端及重投语义；不证明公网抗作弊、跨设备确定性、生产恢复或 Unity／UE 专服。

来源：原 [MOBA runner](https://github.com/dbvv1/MOBA-Like/blob/3bcda00fb35361cc5a25ee74e3768a2f3678c563/src/sim/runner.ts)与[终局规则](https://github.com/dbvv1/MOBA-Like/blob/3bcda00fb35361cc5a25ee74e3768a2f3678c563/src/sim/simulation.ts)；Nakama [权威模型](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)与原存储／榜单 API；2026-10-27。开发者[对局次数放存储还是排行榜的原问答](https://forum.heroiclabs.com/t/storage-or-leaderboard-as-match-count-store/2342)（2022）提供按用途分工的旧经验，当前接口与实际行为由上面的固定运行支持，不拿它当新工具首发或性能证据。

## 检查与来源

`npm test` 使用真实 SDK／服务／数据库，不替换存储实现，覆盖身份绑定／冲突、私有云档与旧版本拒绝、批次原子性、保护集合抢写／删除、玩家伪造结算与直接写榜、重复结果、延后投影、二改、并发与 Nakama 重启恢复。缺少二进制或启动失败是失败，不是 skip。独立读者还须亲跑 demo，说明哪份数据归玩家、哪份归服务器。

- [Nakama 3.41.0 发布](https://github.com/heroiclabs/nakama/releases/tag/v3.41.0)、[固定 HTTP RPC 实现](https://github.com/heroiclabs/nakama/blob/v3.41.0/server/api_rpc.go)、[JS SDK 2.8.0](https://registry.npmjs.org/@heroiclabs%2fnakama-js/2.8.0)。Nakama／SDK 为 Apache-2.0。
- [存储条件写与批次](https://heroiclabs.com/docs/nakama/concepts/storage/collections/)、[权限](https://heroiclabs.com/docs/nakama/concepts/storage/permissions/)、[排行榜](https://heroiclabs.com/docs/nakama/concepts/leaderboards/)。3.41 的版本冲突返回 gRPC code 9；旧页面仍有 code 3 描述，以实包为准。
- [PostgreSQL 17.11 官方来源](https://www.postgresql.org/ftp/source/v17.11/)与[Debian 包来源](https://deb.debian.org/debian/pool/main/p/postgresql-17/)；PostgreSQL License。依赖许可不替产品完成隐私、账号恢复、备份与运维工作。

原账号／云档链核实于 2026-10-26；原模拟终局增量见上节 2026-10-27。原 `demo` 使用可信结果夹具，`demo:match` 才消费原模拟终局；两者均为本地合成账号，无互联网、多节点、数据库故障恢复、邮件／平台登录或生产部署实证。
