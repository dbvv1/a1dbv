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

完成本地契约检查后，还需按应用原门禁验其他消费者，再在获准环境验目标服务。本例没有运行模型、网关或 Hermes 完整应用；stream、async、辅助调用、OAuth 刷新、Bedrock／Foundry 和真实日志链仍需各自验证。无需为这次检查新接迁移平台或模型服务。

## Hermes 当前升级路线：先核在途修复

**先对照已有 v1 迁移，不重复实现，也不把它当作 v2 已兼容。** 本轮 main `f30105a0` 仍 pin `0.125.0`；开放、未合并的 #118652（head `40f03bd6`）提出升到 `1.7.0`，并将 SDK-bound timeout 与 bearer HTTP client 改用 `httpx2`。它覆盖本例涉及的 HTTP 类型迁移部分，不代表 2.x 的采样参数、认证及其他消费者契约已完成。

真正需要升到 2.x 时，先协调／对照这项在途实现，再验未覆盖路径。#142796 是升级准备清单，升级时机的表述来自报告者，本轮未见维护者已决定启动 2.x 迁移的证据；本例换新版本时测出的失效，不等于验证了当前 pin 下的故障，也不是立即改 pin 的理由。本轮只读核源，未运行该 PR、改变依赖或新增迁移实验。

**依据**：[固定 main 依赖](https://github.com/NousResearch/hermes-agent/blob/f30105a0b4b3d0c1baa6c464189755ccdbc1ac7f/pyproject.toml#L236)、[开放 PR #118652](https://github.com/NousResearch/hermes-agent/pull/118652)及其 [固定 head](https://github.com/KoNit-K/hermes-agent/commit/40f03bd6e086ab7573ba216c1d6c802882cf5293)、[升级准备 #142796](https://github.com/NousResearch/hermes-agent/issues/142796)；源码与状态核实 2026-10-31，不刷新下面原实验的验证范围。

## 重放

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

本轮把既有收件箱的迁移提示补成真实消费者结果，未判断整体 SDK／模型优劣，也没有提交 Hermes 升级补丁。

| 覆盖（2026-10-30） | 有效增量／取舍 |
|---|---|
| 官方：[v1 迁移](https://github.com/anthropics/anthropic-sdk-python/blob/v2.3.0/MIGRATION.md)、[v2 迁移](https://platform.claude.com/docs/en/api/migration-2026-10-21) | 两份分别解释 HTTP 类型变化与参数／认证变化；原生 HTTP client `auth` 转头已作局部正对照 |
| 真实项目：[Hermes 固定 adapter](https://github.com/NousResearch/hermes-agent/blob/fe53d0152d1c37f36d44970b094cfb0e7305c2e5/agent/anthropic_adapter.py)、[实际迁移待办 #142796](https://github.com/NousResearch/hermes-agent/issues/142796) | 三个运行失效层；超出原“会变成 Bearer”的提示，实际旧 Omit 会删光认证头 |
| 用户反例：[Bedrock #2031](https://github.com/anthropics/anthropic-sdk-python/issues/2031)与[开放补丁 #2032](https://github.com/anthropics/anthropic-sdk-python/pull/2032) | 平台／模型兼容性须另验；本例没有重做已有补丁，也没有跑 Bedrock |
| 英文／中文社区：[HN API 迁移工具作者帖](https://news.ycombinator.com/item?id=50273438)、[LINUX DO 代码评审复盘](https://linux.do/t/topic/3004044) | 云端 curl 已读正文／回复；前者为商业工具自报、后者未提供本题 SDK 证据，新增兼容性证据 0 项，不据此装工具或下效果结论 |

原实验核实与实测：2026-10-30，Linux、Python 3.12.14；原依赖路径可用，新版纯替换路径不通过。当前已部署 Hermes 是否遇到问题不在本次结论内。
