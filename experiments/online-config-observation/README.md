# 在线配置 → 原 MOBA 新局 → 真实指标 → 回滚

适合已有服务器玩法、需要不发客户端包调规则的开发者。这里不另写示意游戏：复用[输入帧样例的固定源加载器](../server-lockstep/source.mjs)，真实导入正式 MOBA `3bcda00f` 的 `Simulation`、内容 v8 与 Detour；只补现成配置服务和观测的适配。产品仓库不改动，MOBA 可玩客户端尚未接这个服务。

正常链是：**发布配置→服务端评估整份规则→校验→创建一局并固定→推进原模拟→按实际采用版本观测→下一局回滚。** 一个 object flag 包含共同规则，避免多次独立读 key 得到混合版本。合成 canary 分组由此测试服务端指定，不从玩家上传值授权人数／奖励。

## 准备与运行

实跑 Node 24.22.1、Linux x64；需要 Git、npm、curl、tar。锁定 GO Feature Flag relay **1.57.2**、OpenFeature server SDK **1.23.0**／provider **2.0.0**、Prometheus **3.15.1**／官方 JS client **0.16.1**。依赖许可分别为 MIT（GO Feature Flag）、Apache-2.0（OpenFeature／Prometheus）；采用时继续保留各依赖许可。

1. 按[原样例](../server-lockstep/README.md#取固定源并运行)取正式固定 MOBA 源，安装它的锁定依赖；已有干净源可直接复用。它自己的源码／导航／依赖校验仍生效。
2. 在本目录运行；用实际固定源的绝对路径替换下面路径：

```sh
npm ci --ignore-scripts
npm run prepare:linux
export MOBA_SOURCE=/absolute/path/to/fixed-moba-checkout
npm run demo
npm test
```

`prepare:linux` 仅下载两份固定官方发布包、核 SHA256 后解包到本目录 `.local/`；不安装系统服务。其他平台先从官方取对应发行版，当前准备脚本与实测只支持 Linux x64。缓存目录不可写时使用自己的可写 npm cache，不改系统权限。`run.mjs` 复用 MOBA 锁定的 `tsx`；缺源、错 SHA、源被修改、缺导航／依赖／二进制会失败，不退到假模拟或 skip。

demo 会依次看到：

| 实际消费 | 配置与真实结果 |
|---|---|
| 已创建的第一局 | r1，1v1，2 个英雄；随后发布 r2 也不重写它 |
| r2 新 canary 局 | 2v2，真实 4 个英雄；同版本稳定组仍 1v1 |
| r3 回滚后的新局 | 回到 1v1；r3 是新的发布标识，不冒用旧发布时间 |
| Prometheus 查询 | 真 HTTP scrape 后，按实际 revision／mode／source 分开看到采用与模拟片段计数 |
| 配置服务停止 | 下一局明确用内置 r1，来源为 `default`，不伪称已取得远端配置 |

每个模拟实例推进 **60 tick**，不是完整对局／平衡测试；固定条件下 1v1 hash `1131636eda1a1a34`、2v2 `50211eb8bd38bb6f`。只消费人数这个原生构造参数，原 seed、v8 规则、导航和命令合同不变。

## 放进已有模块时接哪里

- `flags.mjs`：作者拥有 schema、发布 revision、允许的人数与内容版本；运营改变 canary／回滚时改这里的配置来源。远程配置是数据，不是新代码或任意版本加载器。
- `consumer.mjs`：`candidate()` 读取但不计“采用”；`begin()` 校验后创建原 `Simulation` 并记采用，选定快照不可变。实际联机由服务器把这一份配置交全局，不让每客户端自行定向后各用一套规则。下一需求增加字段时，先补项目 schema、消费接缝与默认，再发布兼容配置。
- `source.mjs`：沿原固定源合同，只加可选 `heroesPerTeam`（1／2），不另造共享游戏框架；旧输入帧例仍默认 1v1。
- `observation()`：用官方 Prometheus client 暴露两类计数，原 `Simulation` 确实创建／推进后才记录；`service.mjs` 启真 Prometheus 拉取，再用 `/api/v1/query` 查询。配置评估次数不等于采用人数，60 tick 片段完成也不等于玩家打完一局。
- `close()`：释放 Detour、自己的 provider、HTTP 服务及两个子进程；demo/test 的 `finally` 和信号处理执行清理。`.local/runs/` 中 DB／运行文件不提交，进程关闭后可自行删除。

这里选择**失败时下一局用内置默认**，不宣称自动持久化 last-known-good。已有局继续原快照；若项目要“保最近一次通过的配置”，需要记录可兼容版本、时效与恢复政策。紧急停止进行中的局要另走明确业务政策；配置回滚不撤销已发奖励或存档。

## 观测范围与成本

本例只有服务端低基数计数，不收玩家账号、聊天、坐标或设备信息。标签为发布 revision、1v1／2v2 和 remote／default；不要把玩家 ID、每局 UUID 或逐请求字符串加成 Prometheus 标签。生产按保留期控制版本数量与序列基数，计数器重启归零，跨时段分析应用 `rate`／`increase` 而不是把瞬时绝对值当累计玩家数。

两服务均仅绑定 `127.0.0.1`，配置来源为本地文件；GO Feature Flag `otel.sdk.disabled: true`、无 exporters／notifiers，provider `disableDataCollection: true`，Prometheus 无 remote_write。测试运行不发送外部 telemetry、不创建账号／凭据。实际联网运营还需配置发布权限、TLS、可用性、预算与数据政策。本例不提供玩家留存／漏斗、实验显著性、反作弊或生产告警证明。

测试覆盖真实正常链、热改冻结、分组、回滚、配置 schema 错误／缺 key／服务不可用、缺安装输入和真实子进程清理；不得用修改源模拟／降低校验来跑绿。选择与 Unity／PlayFab 接入见[服务端模块](../../domains/game-dev/07-networking-and-server.md#online-config-observation)。

依据（2026-10-26）：[GO Feature Flag v1.57.2](https://github.com/thomaspoignant/go-feature-flag/releases/tag/v1.57.2)、[官方 Node provider](https://gofeatureflag.org/docs/sdk/server_providers/openfeature_javascript)、[配置](https://gofeatureflag.org/docs/relay-proxy/configure-relay-proxy)、[固定 OTel 禁用实现](https://github.com/thomaspoignant/go-feature-flag/blob/v1.57.2/cmd/relayproxy/api/opentelemetry/otel.go)、[Prometheus v3.15.1](https://github.com/prometheus/prometheus/releases/tag/v3.15.1)、[官方 JS client](https://github.com/prometheus/client_js/tree/v0.16.1)、[标签基数](https://prometheus.io/docs/practices/naming/)、[查询 API](https://prometheus.io/docs/prometheus/latest/querying/api/)。
