# Ruler 写出了 MCP header，Codex 是否真的读到了？

**🧪 已用 Ruler 给 Codex 分发远程 MCP 配置时，用实际 `codex mcp get <name> --json` 核生成结果。** Ruler 的输入键是 `headers`，Codex 消费的是 `http_headers`；文件有值、生成命令成功，都不能证明客户端已读到。本例只使用公开的两个 `X-*` 头，不配置真实凭据、不连接服务器或调用模型。

**现有 PR #809 只修 agent adapter，真实 CLI apply 仍绕过它。** 本地组合补丁在实际 `apply-engine` 的 Codex 转换分支补齐同一映射，并去掉生成器内部 `type`。转换在 merge 前进行，因此不改未被 Ruler 接管的 native server；原 merge／overwrite 语义保留。不使用 Ruler 的项目无需安装它，也不把此补丁当所有共享配置的通用解法。

## 固定对象与差量

- 上游 main：`b905f192d84e340d6c9723ff8eadfa6dbc9be8b6`，包版本 0.3.46。
- 既有 [问题 #789](https://github.com/intellectronica/ruler/issues/789) 与 [PR #809](https://github.com/intellectronica/ruler/pull/809)，PR head `e16779e4f0dfa96351ca0f1530d5c520d58b1afb`。
- [combined.patch](combined.patch)：仅五个上游文件。接收 PR 的 adapter 与两份测试，另补实际 CLI 路径，并把既有特殊字符测试的输出字段同步为 `http_headers`（保留值断言）；不包含 PR 基线中的其他历史差量。上游 MIT 许可见 [LICENSE.upstream](LICENSE.upstream)。未向上游发布、没有新增重复 PR。

## 实跑入口

需要 Python 3.11+、Node、npm、Git 与已经可用的 Codex CLI。使用全新目录，不在真实个人配置上试。以下 Bash 入口从本仓根执行；依赖安装会访问公开 npm registry：

```sh
set -eu
ARTIFACTS="$PWD/experiments/ruler-codex-headers"
RUN="$PWD/ruler-headers-replay"
mkdir "$RUN"
git clone https://github.com/intellectronica/ruler.git "$RUN/source"
git -C "$RUN/source" checkout --detach b905f192d84e340d6c9723ff8eadfa6dbc9be8b6
git -C "$RUN/source" apply --check "$ARTIFACTS/combined.patch"
git -C "$RUN/source" apply "$ARTIFACTS/combined.patch"
cd "$RUN/source"
npm_config_cache="$RUN/npm-cache" npm ci --ignore-scripts --no-audit --no-fund
npm run build
python3 "$ARTIFACTS/consumer.py" "$RUN/source/dist/cli/index.js" "$RUN/consumer"
```

[consumer.py](consumer.py)生成一次性公开样例，隔离 HOME、XDG 与 CODEX_HOME，把生成的 `.codex/config.toml` 作为临时 CLI profile 后读取。它验证两个头、无头远程、stdio、既有 native server、重复 apply、overwrite 与顶层配置保留；每条命令最多 30 秒，已有结果目录拒绝覆盖。保留 stdout/stderr 便于检查失败，不启动 MCP server。

该入口验证**当前 Codex CLI 对生成 TOML 的实际解析**，不是仓库信任设置、客户端联网实际发送、服务鉴权或模型采用验证。不能据此推定真实 token 可公开提交；生产凭据仍走获准环境变量／凭据入口。

## 这次观察

2026-11-14，Linux／Node 24.22.1／Codex CLI 0.167.0-alpha.4：同一公共输入在 main 与仅应用原 PR 时，生成都退出 0，但 CLI 返回 `http_headers: null`；补实际分发路径后返回完整两个头。原 PR 的 adapter 单测通过而 apply 集成失败，说明应接真实入口而不是只看类测试。组合补丁通过上面的真实消费者八类检查；上游检查的完整结果写在交付提交说明，未运行部分不算通过。

本例为[团队配置治理](../../docs/18-team-adoption.md#4-配置治理)提供局部消费者证据，不证明团队采用收益或所有客户端兼容，也不升级整页评级。
