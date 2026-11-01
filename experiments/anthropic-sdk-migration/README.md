# Anthropic SDK 从 0.x 升到 2.x：别只删采样参数

**🧪 先让 Agent 跑项目真实客户端构造与请求边界，再接收依赖升级。** 固定试用的 Hermes 源码使用 SDK 0.125.0；只换成 2.3.0，构造器先失败，单独查后续请求还会发现采样参数错误和认证头丢失。应把跨过的 **v1 HTTP 层迁移**与 **v2 API 契约迁移**一起处理，暂缓“只改版本号”的补丁。

## 实际发现了什么

| 相同真实 adapter／输入 | 原依赖 0.125.0 | 仅换 SDK 2.3.0 |
|---|---|---|
| `build_anthropic_client` | 构造成功 | `httpx.Timeout` 与新 SDK 的 `httpx2` 类型不兼容，构造失败 |
| 手动 thinking 分支原参数 → `create_anthropic_message` | 进入内存 transport，body 含 `temperature` | `TypeError`，transport 调用 **0 次** |
| 只移除采样参数，再经 `_new_sdk_client` | 发出 `X-Api-Key` | **`X-Api-Key` 与 `Authorization` 都没有** |
| `with_options()` 后再调用 | 保留 API-key 头 | 两种头仍都没有 |

后面三行通过原内部构造函数注入相应 SDK 的内存 transport，隔离检查后续失效；完整构造在新版仍失败。旧 adapter 在 API-key 路径加入 `Authorization: Omit()`，原本用来避免双认证；新版把 API key 改放 Bearer，这个旧处理就删掉了唯一认证头。**Mock 返回了 200 也不能接收：必须断言当次真正交给 transport 的请求。**

对照组确认了原因：直接用新版 SDK 会发 Bearer；按官方迁移指南在原生 HTTP client 的 `auth` 函数中转成 `X-Api-Key`，请求只有目标头。原 adapter 的 token-style 内部构造对照仍保留 Bearer。这些是局部契约对照，Hermes 源码与依赖 pin 均未修改。

非作者另用**原本就不生成采样参数的现代模型分支**复测，原／复制客户端仍丢认证头；换模型分支不能替代认证迁移。

## 让 Agent 怎样完成自己的迁移

1. **先读跨过的每份迁移指南。** 从 0.x 起步要同时核 v1 与 v2，不能只查最新 API 日期。传给 SDK 的 timeout／client／transport 使用对应库类型；`anthropic.Timeout` 等 SDK 导出可避免手工选错 HTTP 类型。
2. **保留真实调用链，按路由核请求。** 验构造、body、认证头，以及客户端复制后再次请求。原参数不兼容要从实际生成点修；API-key／token／第三方网关各有契约，别全局删认证处理，也别靠放宽 mock 接收所有参数。
3. **将实际请求作为接收依据。** 断言每次是否到达 transport、使用的 API 版本、移除的字段，以及恰好一个符合该路由要求的认证头；只记头名／布尔状态，不记录真实值。

完成本地契约检查后，还需按应用原门禁验其他消费者，再在获准环境验目标服务。原 2.x 探针没有运行模型、网关或 Hermes 完整应用；stream、async、辅助调用、OAuth 刷新、Bedrock／Foundry 和真实日志链仍需各自验证。无需为这次检查新接迁移平台或模型服务。

## Hermes v1 在途迁移：接收旧 PR 时保住新主干

**🧪 需要 SDK 1.x 时，先接已有实现的必要差量，不整份覆盖新主干；只升 1.x 不能解决上面的 2.x 契约问题。** #118652 仍开放、未合并，head `40f03bd6` 已将 Anthropic 升到 `1.7.0`，改用 SDK 所需的 `httpx2.Timeout` 和 bearer-hook client。本轮先在它自己的源码／锁文件上验收，再移植到仍 pin `0.125.0` 的 main `c7da41dd`；没有另开重复 PR。

| 接收步骤 | 实际结果 | 对读者的选择有什么影响 |
|---|---|---|
| 旧实现＋新 SDK，放入 PR 的两个构造回归 | 两项均因旧 `httpx` 类型失败 | 确认补丁解决真实边界，不拿安装成功代替迁移 |
| 固定 PR，按项目 runner 验认证／Azure 辅助及相关消费者 | 7 文件 160 passed，0 failed／skip | 可以接收所测 v1 工程差量，尚非全产品兼容 |
| 原 PR 整份应用到新 main | `pyproject.toml`、`uv.lock` 冲突 | 保留 main 更新后的 Bedrock timeout 参数与其他依赖，只转移必要源码／pin，再用当前 PM 生成锁文件 |
| 适配后 main，加真实 SDK 内存请求与 Bedrock 构造验收 | 9 文件 178 passed，0 failed／skip；原生静态入口 14 项通过 | 所测 API-key、bearer 刷新、copy 后认证及 Bedrock timeout 保留，候选可供项目继续验收 |

新增五例使用实际 SDK client，替换外部传输后断言请求头，而不是让 mock 接受任何调用；Bedrock 只替换凭据查询并构造实际 SDK。copy 测试核第二次请求和认证，未覆盖完整关闭生命周期。测试全用合成键；原有用例含 localhost 或 mock，未调用真实 Anthropic／Azure／AWS／网关，也未跑整个 Hermes、跨 OS／发布矩阵或 SDK 2。维护者尚未确认 #142796 的 2.x 升级时机，不据此替项目改默认。

### 固定候选怎样重放

补丁来自 #118652 的源码／测试改动，再适配上述 main，并新增五例行为测试；原项目为 MIT，许可见 [HERMES-LICENSE.txt](HERMES-LICENSE.txt)。准备 Git、能启动项目 PM 的 Python 及官方依赖网络；按 Hermes 自带指南由 PM 准备测试解释器，不用裸 pip／uv 修改 Hermes 环境。以下从 **a1dbv 根目录**开始，在新的独立 clone 操作：

```bash
(
set -e
A1DBV="$PWD"
trial_root="$(mktemp -d)"
cd "$trial_root"
git clone https://github.com/NousResearch/hermes-agent.git hermes-v1
cd hermes-v1
git checkout --detach c7da41dd522dc19cc08bbfcfa69d4b078224b45d
git apply --check "$A1DBV/experiments/anthropic-sdk-migration/hermes-v1-current-main.patch"
git apply "$A1DBV/experiments/anthropic-sdk-migration/hermes-v1-current-main.patch"
git add -N tests/agent/test_anthropic_sdk_migration_boundary.py
trial_home="$(mktemp -d)"
export HOME="$trial_home" HERMES_HOME="$trial_home/data" HERMES_RUNTIME_DIR="$trial_home/runtime"
export HERMES_DISABLE_LAZY_INSTALLS=1
python -m pm.build_env --source . --out ../hermes-v1-test-env --group dev --group test --extra bedrock
export HERMES_PYTHON="$(cd ../hermes-v1-test-env && pwd)/bin/python"
bash scripts/run_tests.sh -j 2 --file-retries 0 --file-timeout 120 \
  tests/agent/test_anthropic_client_auth.py \
  tests/agent/test_azure_identity_adapter.py \
  tests/agent/test_auxiliary_client_azure_foundry.py \
  tests/agent/test_anthropic_adapter.py \
  tests/agent/test_bedrock_guardrail_claude_route.py \
  tests/agent/test_bedrock_1m_context.py \
  tests/agent/test_nous_portal_anthropic_wire.py \
  tests/agent/test_bedrock_request_timeout.py \
  tests/agent/test_anthropic_sdk_migration_boundary.py
"$HERMES_PYTHON" scripts/check --base c7da41dd522dc19cc08bbfcfa69d4b078224b45d
)
```

预期是所列测试无失败／skip、静态检查通过；首次运行的环境和命令见[脱敏结果](hermes-v1-result.json)。PM 构建需要新输出目录；本轮首次隔离错误地丢弃了云环境已有的代理／证书设置，导致下载失败，保留已配置的传输设置后正常成功，不需要改凭据或降低 TLS。复用项目隔离 runner 清除测试凭据，不把环境准备故障当迁移红灯。

只要目标主干不是这个固定提交，就先核差量，不能机械套补丁。回退也只在独立 clone 没有后续修改时核 `git apply --check -R` 再反向应用，并由 PM 另建旧依赖环境；这不恢复任何业务数据。

**依据**：[固定 main](https://github.com/NousResearch/hermes-agent/commit/c7da41dd522dc19cc08bbfcfa69d4b078224b45d)、[PR #118652](https://github.com/NousResearch/hermes-agent/pull/118652)及[固定 head](https://github.com/KoNit-K/hermes-agent/commit/40f03bd6e086ab7573ba216c1d6c802882cf5293)、[原类型不兼容报告 #118648](https://github.com/NousResearch/hermes-agent/issues/118648)、[SDK 1.7 依赖声明](https://github.com/anthropics/anthropic-sdk-python/blob/v1.7.0/pyproject.toml)、[2.x 准备 #142796](https://github.com/NousResearch/hermes-agent/issues/142796)；2026-11-01 核实与 Linux 实测，适配 main 环境为 Python 3.14.9、Anthropic 1.7.0、httpx2 2.15.1。以下 2.x 探针仍是原 10-30 的独立实验。

## 原 0.x→2.x 失效探针重放

Python 3.12、Git；两个独立 venv 分别安装本目录的锁定依赖。以下命令在本目录运行：

```bash
git clone --filter=blob:none --sparse https://github.com/NousResearch/hermes-agent.git hermes
git -C hermes sparse-checkout set agent pm hermes_cli hermes_platform
git -C hermes checkout --detach fe53d0152d1c37f36d44970b094cfb0e7305c2e5
python3 -m venv .sdk-old
python3 -m venv .sdk-new
.sdk-old/bin/python -m pip install -r requirements-old.txt
.sdk-new/bin/python -m pip install -r requirements-new.txt
.sdk-old/bin/python probe.py hermes   # 预期 exit 0：原契约通过
.sdk-new/bin/python probe.py hermes   # 预期 exit 1：NOT READY，输出三个失效层
python3 test_probe.py hermes .sdk-old/bin/python .sdk-new/bin/python
```

探针核固定 Git revision、干净 tracked 源码和两个关键文件 hash，使用真实 import，不摘录函数代替应用代码。它清空运行环境，使用临时 HOME／HERMES_HOME 和合成键；只接 `MockTransport`，另断言 connect／bind 等 socket 调用为 0。HTTP 响应是合成夹具，输出只含头是否存在、字段名和 API 版本。七项回归通过表示已复现并识别不兼容，**新版 NOT READY 仍然成立**。

## 来源与适用范围

原 10-30 实验把既有收件箱的迁移提示补成真实消费者结果，未判断整体 SDK／模型优劣；11-01 的 v1 适配仅作为上述本地候选，没有向 Hermes 提交升级补丁。

| 覆盖（2026-10-30） | 有效增量／取舍 |
|---|---|
| 官方：[v1 迁移](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/MIGRATION.md)、[v2 迁移](https://platform.claude.com/docs/en/api/migration-2026-10-21) | 两份分别解释 HTTP 类型变化与参数／认证变化；原生 HTTP client `auth` 转头已作局部正对照 |
| 真实项目：[Hermes 固定 adapter](https://github.com/NousResearch/hermes-agent/blob/fe53d0152d1c37f36d44970b094cfb0e7305c2e5/agent/anthropic_adapter.py)、[实际迁移待办 #142796](https://github.com/NousResearch/hermes-agent/issues/142796) | 三个运行失效层；超出原“会变成 Bearer”的提示，实际旧 Omit 会删光认证头 |
| 用户反例：[Bedrock #2031](https://github.com/anthropics/anthropic-sdk-python/issues/2031)与[开放补丁 #2032](https://github.com/anthropics/anthropic-sdk-python/pull/2032) | 平台／模型兼容性须另验；本例没有重做已有补丁，也没有跑 Bedrock |
| 英文／中文社区：[HN API 迁移工具作者帖](https://news.ycombinator.com/item?id=50273438)、[LINUX DO 代码评审复盘](https://linux.do/t/topic/3004044) | 云端 curl 已读正文／回复；前者为商业工具自报、后者未提供本题 SDK 证据，新增兼容性证据 0 项，不据此装工具或下效果结论 |

原实验核实与实测：2026-10-30，Linux、Python 3.12.14；原依赖路径可用，新版纯替换路径不通过。当前已部署 Hermes 是否遇到问题不在本次结论内。
