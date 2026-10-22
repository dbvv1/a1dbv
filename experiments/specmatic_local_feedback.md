# Specmatic：结构反馈与业务期望的最小对照

这是合成 HTTP 单接口试验，不是 Jain 的模型实验复现，也不验证换模型、harness 或商业 matcher 的收益。

## 运行

需要现成的 POSIX 环境、Python 3、兼容的 Java，以及用户自行准备的官方 Specmatic 2.55.3 jar。脚本不下载、不安装、不登录、不付费。

```sh
python3 experiments/specmatic_local_feedback.py /absolute/path/to/specmatic-executable-all-2.55.3.jar
```

固定发行：[2.55.3](https://github.com/specmatic/specmatic/releases/tag/2.55.3)。脚本首先核对 SHA-256：

```text
2026a53459794d01e0f11843f24ad55588098d2dfbfd3e9a27b7705e29b5734d
```

不要把 jar、许可证或生成日志加入仓库。脚本可从任意目录运行；所有生成 spec、隔离 HOME、日志和报告保留在新建的 /tmp/specmatic-local-feedback-* 目录，启动时打印确切位置，便于复核后自行删除。此目录包含一个可单独使用的普通 business_assert.py，接收响应 URL 为参数。

合成服务和 mock 只绑定 loopback，使用动态端口；CLI 传入关闭可选遥测的环境变量与 JVM 属性，但这不是网络隔离或零外连证明。不要用敏感数据替换本合成样例。

## 验收结果

2026-10-22，以官方固定 jar、OpenJDK 21 和现成 Python 实际运行：

| 场景 | 契约 CLI 退出码 | 含义 |
| --- | ---: | --- |
| 正常 200 响应 | 0 | 结构通过 |
| id 从 integer 改成 string | 1 | 类型错误被发现 |
| id/name/status 改值，类型不变 | 0 | 未违反本 spec 的 schema |
| 正常 body，但 HTTP 500 | 1 | 状态错误被发现 |

负例不只看 exit 1：还必须命中 RESPONSE.BODY.id / R1001 或 RESPONSE.STATUS / R0002 的对应诊断，否则整个复现失败，避免将启动或许可错误当作负例通过。

独立普通 Python 业务断言：正常响应 exit 0；同类型改值响应 exit 1，脚本同时核对日志中的完整 expected/actual，防止把其他错误当作业务反例通过。业务期望是人为另设的固定值，不是 OpenAPI example 必须相等的 schema 断言。检查边界不是工具缺陷。

同一份 spec 启动 mock，GET /pets/1 返回 200 和完整示例 JSON，精确比对通过。这是 mock 示例重放，不是实现业务正确性的独立证明。

## 失败与清理

每个 Java 调用创建独立进程组，成功、CLI 非预期退出、超时、mock 校验失败及正常可捕获中断均经过 finally 终止该组并等待子进程；fixture 在 finally 关闭。不会按进程名杀 Java 或影响其他已有服务。操作系统强杀脚本（SIGKILL）或主机崩溃不在 Python 清理保证范围内。

实际故障回归：注入 fixture 500 使第一项契约不符合预期、注入 mock 示例差异使最终精确比对失败，两者均 exit 1。成功及两条失败路径结束后，记录的所有 Java PID 均不存在，其 loopback 端口均已关闭。生产脚本不包含故障开关。

[契约测试语义](https://docs.specmatic.io/spec_driven_api_development/contract_testing) · [Matchers 文档](https://docs.specmatic.io/features/matchers)
