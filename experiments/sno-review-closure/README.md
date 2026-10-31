# 已合并的修补，为什么仍没关闭评审发现

**Sno Station 的两条并发日志发现仍能在固定当前源码的组件中复现。** 独立进程已成功追加的记录，在最终文件大小检查之后、截断或替换之前到达，随后消失；更早或更晚追加的对照均保留。
**给评审接收者的做法：按原触发条件核补丁，不拿“已回复／已合并”替代问题关闭。** 这是公开真实消费者的未闭环发现，不是另造模型评测，也不推荐安装 Sno。

## 从真实反馈追到当前代码

作者在[原帖](https://www.reddit.com/r/codex/comments/1xcku1r/codex_reviewed_claude_codes_pull_requests_for_3/)报告：评审找到了日志丢失，但合并后的补丁仍未补齐窗口。本轮读取 [PR #92](https://github.com/sno-ai/sno-station/pull/92)及两条后续意见：

- [ledger：最终检查到 truncate 之间仍可追加](https://github.com/sno-ai/sno-station/pull/92#discussion_r4256314853)；
- [audit：最终快照到 rename 之间仍可追加](https://github.com/sno-ai/sno-station/pull/92#discussion_r4256314847)。

核查的主干为 [`d80696a`](https://github.com/sno-ai/sno-station/tree/d80696aa854803f6224f2da7cf6eebb6de8f09ad)。两个文件最后一次相关修改均为 10-13，仍保留上述顺序。评审文字只是待验证假设；下列实跑才是本仓增加的证据。

## 结果：保留性失败，不是产品通过

| 另进程追加的时刻 | ledger 下一次可读到该行 | audit 文件保留该行 |
|---|---|---|
| 不追加（控制） | 无新行 | 无新行 |
| 最终大小检查之前 | 是 | 是 |
| 最终检查之后、截断／替换之前 | **否，已成功追加的行丢失** | **否，已成功追加的行丢失** |
| 操作完成后重新按路径追加 | 是 | 是 |

保留性探针共执行 8 个时序，**2 个保留性断言失败，退出码 1**。另有脚本门禁 3 项通过：确认真实失败被报告、缺输入不空跑、源文件变动即停止；这 3 项通过不表示 Sno 通过。机器结果见 [`result.json`](result.json)。

- ledger 达到原代码的 1 MiB 已消费阈值；audit 超过原 16 MiB 阈值。追加行位于应保留尾部，不是正常淘汰的旧记录。
- 最终检查先执行真实 `stat` 并保存返回值，再等待子进程完成真实文件追加，最后把原返回值交回原函数；未伪造 size。子进程 exit 0、追加字节数、追加完成后立即可见尾行均有断言。
- ledger 同时检查函数返回的 rows 与剩余文件，避免把“已经取走”误称丢失。操作后对照重新打开当前路径，不沿用 rename 前的旧句柄。

## 复跑

需要 Node.js 24（本轮为 24.22.1）和 Git，不安装 Sno 或 npm 依赖。先在自己的临时目录检出固定公开源码：

```bash
git clone --depth 1 https://github.com/sno-ai/sno-station.git sno-source
git -C sno-source fetch --depth 1 origin d80696aa854803f6224f2da7cf6eebb6de8f09ad
git -C sno-source checkout --detach d80696aa854803f6224f2da7cf6eebb6de8f09ad
```

从本仓根目录运行，替换源码检出路径：

```bash
node experiments/sno-review-closure/run.mjs /path/to/sno-source
# 固定源码预期 exit 1：两个窗口仍丢行；JSON 中 acceptance.passed=false。
node experiments/sno-review-closure/test.mjs /path/to/sno-source
# 脚本自身 3 项通过；包含确认上述 exit 1 不是启动失败。
```

`run.mjs` 只读取两个源文件；先核完整文件 SHA-256，再按固定行范围提取原函数与必要路径／类型判断辅助函数，记录片段 hash，仅去掉 `export` 与 TypeScript 类型。用真实文件系统执行；测试接缝控制追加时序，未使用内存文件系统。ledger 的未配置 logger 被失败即停的接缝替代，正常路径不得调用它。源码漂移会拒绝运行，不能把旧行范围套进新版本。临时合成树由脚本自己创建并清理，不读取真实日志或会话。

## 接收范围与下一步

**已证：** 固定原函数在可达的受控进程交错下丢失已完成追加的记录；再查一次大小不足以提供进程间互斥。

**未证：** 真实用户事故发生频率、整插件／导出包装层、schema 校验、emit／队列、模型或网络行为；没有完整包构建、集成测试或修复版。没有改 Sno、安装 Hook、签署 DCO 或投稿。

需要接收后续修复时，要求写入者与压缩者共享有效的互斥／保留协议，并在修复版本重验原交错和正常控制；不能只在压缩函数里多查一次大小，也不能用本探针的“诊断成功”关闭原发现。

依据：[公开源码 ledger](https://github.com/sno-ai/sno-station/blob/d80696aa854803f6224f2da7cf6eebb6de8f09ad/packages/memory/src/engine/telemetry/observe-ledger.ts#L84-L140)、[audit](https://github.com/sno-ai/sno-station/blob/d80696aa854803f6224f2da7cf6eebb6de8f09ad/packages/memory/src/engine/operations/runtime-audit-log.ts#L341-L404)；[社区：作者原报] 与 [一手：PR 评审] 如上；[本仓组件实跑] 2026-10-31（UTC），不是完整客户端试用。
