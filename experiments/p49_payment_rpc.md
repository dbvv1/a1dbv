# Agent诊断：Invalid token先找来源，不先换凭据

核实：2026-10-24 UTC。OpenTelemetry Astronomy Shop 固定源码的 Payment 服务＋真实 flagd 已原生运行；没有支付供应商、账户或真实资金操作。[本仓实试]

**把同一请求的实际开关评估、源头异常与客户端结果交给Agent，才能区分错误文案与原因。** 本次正常与100%故障注入使用同一个合成请求，仅切换既有 paymentFailure 开关。两路都携带 synthetic_request=true，emitRawPii 实际评估为 false。

| 可观察信号 | 正常 | 注入 |
|---|---|---|
| Payment请求内实际评估 | paymentFailure=0，STATIC/off | paymentFailure=1，STATIC/100% |
| flagd服务端真实评估span | 同trace，paymentFailure/off | 同trace，paymentFailure/100% |
| charge span | synthetic=test；charged=false | synthetic=test；Error异常；charge.js:48:15 |
| 客户端Payment RPC | 成功，返回transactionId | gRPC 2 UNKNOWN，含Invalid token |
| 同请求应用日志 | Transaction complete | handler warn指向同一异常 |

这份“Invalid token”由固定 charge.js 的故障注入分支主动抛出，发生在卡信息验证之前，不是外部认证系统报告。Agent可以据同trace的实际评估与源头位置排除“先改凭据”的猜测；仍不能从这个样例推断任意生产环境的同名错误。

**两个数字2不是同一个错误码。** 注入路径的客户端收到gRPC code=2 UNKNOWN；服务端RPC span只有OTel status.code=2 ERROR和grpc.error_message，没有rpc.grpc.status_code字段。正常RPC span则有该字段且为0。故实际wire结果要看客户端回执，不把span状态值翻译成gRPC枚举。[本仓实试]

## 给接手Agent的任务

给定两次请求的客户端回执、同trace的flag评估、charge异常及handler日志，让Agent回答：“最早哪个实际信号能区分原因？异常从哪一行产生？哪些判断仍缺证据？”要求列trace_id及源码位置，而不是只复述顶层错误文字。

当前只验Payment→flagd的真实链，不含Checkout、Kafka、frontend/API、错误目标分支或Collector/Jaeger查询。原研究中的422与三路整链仍是静态证据；没有模型质量对照，也未声称诊断率提升。

## 复现

准备固定公开源码 ba1757b3f197916640fff4f7c549b99e54835ab8、Python3/POSIX、Node（本次24.19.0）及官方flagd v0.16.0 Linux x86_64二进制。按Payment官方README，在固定源码执行：

```sh
cp pb/demo.proto src/payment/demo.proto
(cd src/payment && npm ci --no-audit --no-fund)
```

本次固定package-lock安装220包；使用npm入口自带auto-instrumentations-node 0.81.2，不声称等同Dockerfile注入的0.78.0镜像。grpc-js为1.14.6，flagd-provider为0.17.0，OpenFeature server-sdk为1.23.0。

本仓已将[运行入口](p49_payment_rpc.py)、[RPC客户端](p49_payment_request.cjs)、[flag观察器](p49_observe_flags.cjs)和[核验器](p49_verify_payment.py)放在同一目录。将DEMO_SOURCE设为上述固定检出路径、FLAGD_BINARY设为已核验的可执行文件、NEW_OUTPUT设为尚不存在的输出路径；从本仓根目录运行：

```sh
python3 experiments/p49_payment_rpc.py "$DEMO_SOURCE" "$FLAGD_BINARY" "$NEW_OUTPUT"
```

输入源码和binary先校验；输出目录必须不存在且在源码外。脚本不安装依赖、不修改应用源码、不开浏览器、不调用模型。两次Payment RPC和实际flagd评估使用本机连接；原应用监听0.0.0.0，不宣称仅loopback绑定。Node只启用grpc/pino自动插桩，trace用原生console exporter；flagd也输出真实span。无Collector或持久遥测平台。

外置 p49_observe_flags.cjs 是按OpenFeature官方after hook接口增加的观察器，仅记录paymentFailure/emitRawPii的成功评估值、原因、variant与当前RPC span ID，不替换结果。它不是原应用已有字段，也不能把新增观察成本藏起来。

每次客户端回执、服务日志、flag文件与cleanup结果留在输出目录；verified-sanitized.json只提取需判断的事实。原始日志含进程/主机/本机路径、合成卡末四位等，仅在本机保存，不发布。验证器对固定console格式做定向解析，不是通用遥测解析器。

脚本只清理自己创建的进程组。两路请求及span均完成，但Payment进程收到SIGTERM后8秒仍未退出，由harness对其进程组SIGKILL；flagd正常退出，全部所创建进程组已消失。此清理结果不是应用优雅关闭通过；宿主SIGKILL或崩溃无法由finally保证。

## 来源与完整性

- [固定应用源码](https://github.com/open-telemetry/opentelemetry-demo/tree/ba1757b3f197916640fff4f7c549b99e54835ab8)：源文件头/根许可证Apache-2.0；Payment package.json另标ISC，不把该元数据替代源文件许可。
- [Payment本地构建](https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/payment/README.md)与[故障源头](https://github.com/open-telemetry/opentelemetry-demo/blob/ba1757b3f197916640fff4f7c549b99e54835ab8/src/payment/charge.js#L38-L49)。本次charge/index/logger及锁文件与固定提交逐字一致；仅按官方步骤复制proto并安装依赖。
- [flagd v0.16.0发行](https://github.com/open-feature/flagd/releases/tag/flagd/v0.16.0)：Apache-2.0，binary自报80b9e9548163c1adbd28d45ca52364956e7fa08f。Linux x86_64 tar.gz SHA256 57f3ee9ae8ef50989f99f90ea0909a602c84055775173fd0376aed491dfaaae1，与GitHub asset digest一致；解包binary SHA256 5595a65ee997d59ab4a5aeffb6401584754069f16408e235423ef1f00c7d0f1f。未做独立签名或源码可复现构建验证。

范围：现有研究的定向实试，不是新一轮全渠道前沿排名。正常、注入和新版可复制入口均实际运行；缺参数、已有输出目录、错误binary拒绝路径已检查。不做真实支付、凭据变更、服务重启建议或自动恢复动作。
