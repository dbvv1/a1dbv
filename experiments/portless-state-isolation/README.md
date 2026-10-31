# Portless：分开的端口仍可能共用同一份进程状态

**🧪 已经用 Portless 并行开发时，通常共用一个代理、用 worktree 子域区分应用；确需独立代理，再同时分开端口和 `PORTLESS_STATE_DIR`。** 不要让每个 Agent 在同一状态目录里各自 `proxy start -p`／`stop -p`。已有端口安排够用就沿用，不为本例安装代理。

真实使用者 [#521](https://github.com/vercel-labs/portless/issues/521) 报告：A 运行后显式启动 B，会把同目录的 `proxy.pid`／`proxy.port` 改成 B；随后 `stop -p A` 却停止 B，A 仍在服务。本次在 Linux 的正式包 **0.15.12** 和固定主干 **`96a3bbb353e5a2bcc223ed014102737160e7f983`**（包内版本 0.15.13）均复现。当前主干不是修复版；升级正式版不能据此认定问题已消失。

## 先用现有版本避开相互停止

**让一位协调者管理共享代理的启停。** 各 worktree 只注册自己的应用、使用工具提供的 worktree URL，不单独重启共享代理。需要不同代理配置时，在每个代理的专用 shell 里选不同的空闲高端口和新状态目录；后续 app、`get`、`list`、`stop` 都保留对应环境。

```sh
# 在一个新的专用 shell 中运行；另一个代理换端口，并重新创建自己的目录。
export PORTLESS_STATE_DIR="$(mktemp -d)"
export PORTLESS_PORT=13560
export PORTLESS_HTTPS=0 PORTLESS_SYNC_HOSTS=0 PORTLESS_LAN=0
export PORTLESS_TLD=localhost PORTLESS_UNPRIVILEGED=0
portless proxy start -p "$PORTLESS_PORT" --no-tls
# 在同一环境里运行项目原来的 portless 应用命令。
portless list
# 确认这是本次启动、需要停止的代理后，在同一环境里停止：
portless proxy stop -p "$PORTLESS_PORT"
```

本例关闭 TLS、hosts 同步和 LAN，避免把普通试用扩展为系统配置变更。端口已被占用就另选空闲端口，不用 `--force`；新目录的作用是隔离状态，不是接管已有服务。`get`／`list` 仍不证明应用就绪，要请求应用的实际路由。

## 真实 CLI 比较

本次用官方构建的 CLI 前台子进程，检查 HTTP 响应、PID／port 文件和实际退出；只管理试验自身创建的进程。空路由返回 404 且带 `X-Portless: 1`，这里检验的是代理生命周期，不是业务应用可用。

| 同一状态目录中的顺序 | 正式包／原主干 | 本地候选 |
|---|---|---|
| 启动 A，再启动 B | 两个代理都响应；记录被 B 覆盖 | B 非零退出；A 和原记录保留 |
| 随后 `stop -p A` | 返回成功，但 B 退出、A 仍响应 | A 正常退出 |
| 记录为 B，却显式要求停止另一活跃端口 A | B 被停止 | 拒绝；两个代理及所测记录保留 |
| 独立状态目录，各自启动和停止 | 两代理可并存，停 A 不影响 B | 保持通过 |

原主干新增 7 项回归中 **3 失败、4 通过**；候选 **7／7 通过**，独立复跑亦 7／7。范围包含 missing-PID 的错端口停止、同端口重复启动、普通停止、正常退出后换端口和仅有旧 port 文件的恢复。另有原项目 4 条普通 HTTP daemon 生命周期测试、25 条 MCP 契约测试通过，build、type-check、lint、改动文件格式与空白检查通过；完整 CLI 套件、TLS／系统服务、Windows 和 hosted CI 未运行。原问题的 Windows 结果来自报告者，不能用 Linux 结果替代。

## 可复验的窄补丁，不是已发布修复

[port-mismatch.patch](port-mismatch.patch) 只加两道串行护栏：启动前拒绝替换同目录仍监听的不同端口；停止前拒绝请求端口与记录端口不符，且不进入发信号或清理路径。README、Skill、CLI help 与 MCP 描述同步了范围。

**端口一致不等于 PID 归属已验证。** 本候选不解决同端口错误 PID、同时启动、快速重启的旧进程清理竞态或损坏状态文件。不要将它升级为“并发安全”或自动清理陌生进程的依据；此处先交付可用的状态隔离方法，不替换用户安装，也未向上游投稿。

在 a1dbv 根目录准备补丁路径，再进入全新副本复验；需要 Node.js 24+、pnpm 11：

```sh
patch_file="$PWD/experiments/portless-state-isolation/port-mismatch.patch"
work="$(mktemp -d)"
git clone https://github.com/vercel-labs/portless.git "$work/portless"
cd "$work/portless"
git checkout --detach 96a3bbb353e5a2bcc223ed014102737160e7f983
pnpm install --frozen-lockfile --ignore-scripts --filter portless... \
  --store-dir "$work/pnpm-store"
git apply --unidiff-zero "$patch_file"
pnpm --filter portless build
PORTLESS_SYNC_HOSTS=0 PORTLESS_LAN=0 \
  pnpm --filter portless test src/proxy-state.test.ts
pnpm --filter portless type-check
pnpm --filter portless lint
```

试验环境为 Linux、Node 24.22.1、pnpm 11.25.0；上游 lockfile 未变。精简观测和哈希在 [results.json](results.json)。补丁含上游 Apache-2.0 代码上下文，许可证见 [LICENSE.portless](LICENSE.portless)。

## 来源与覆盖

| 线索 | 本轮读到什么／采用什么 |
|---|---|
| 官方能力与源码 | [worktree 子域与默认监听](https://portless.sh/#git-worktrees)、[正式版](https://github.com/vercel-labs/portless/releases/tag/v0.15.12)、固定主干的 [state 目录](https://github.com/vercel-labs/portless/blob/96a3bbb353e5a2bcc223ed014102737160e7f983/packages/portless/src/cli-utils.ts#L465-L488)及 [stop 实现](https://github.com/vercel-labs/portless/blob/96a3bbb353e5a2bcc223ed014102737160e7f983/packages/portless/src/cli.ts#L1034-L1169)；形成 1 项状态隔离采用判断 |
| 真实用户与其他待修问题 | [#521](https://github.com/vercel-labs/portless/issues/521) 提供本次消费者；另核 [#525](https://github.com/vercel-labs/portless/issues/525) 上传响应问题，已有 [#477](https://github.com/vercel-labs/portless/pull/477)／[#478](https://github.com/vercel-labs/portless/pull/478) 在修，不重复实现 |
| 社区与既有采用 | [LINUX DO 原帖](https://linux.do/t/topic/1796422)指出 worktree 之外仍共享端口等资源，作为问题背景；既有 [state-in-url 采用核查](../../docs/collaboration/inbox.md#portless-worktree-urls)保留，不把它当成 #521 的复现 |
| 外部覆盖缺口 | 本轮是地图已有候选的定向实试，不是新工具广扫；HN Algolia 入口本轮不可读，搜索未取得新的 Portless 专题原帖，不据此作热度或“当前最佳”排名 |

核实与 CLI 试验：2026-10-31 UTC。#521 仍开放、无评论；没有声称维护者已接受候选，也未测模型效果或整任务节时。
