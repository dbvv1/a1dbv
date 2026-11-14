# #6007 候选补验：截断边界的 message id 与原存储

**显式传递既定 RunConfig 限额，在本次五种边界中与作者候选保持一致；不能只用工具配对通过来代替边界消息验收。** 本补验承接[原消费者实验](https://github.com/dbvv1/a1dbv/blob/1292fc8a4c4c5c4acdca2a4ffd6fc955d9dd5aa0/experiments/compaction-window-consumer/README.md)，补上独审指出的候选同时修改 assistant message id 清理条件、原存储仅核数量的缺口。

## 真实任务与固定范围

[真实报告 #6007](https://github.com/openai/openai-agents-python/issues/6007)的压缩包装器隐藏 SQLiteSession 限额。基线仍为 `64fbde5d02b42ae5f9db668eb0184cdb3fc9d775`；候选为报告作者的 [4e0047c3](https://github.com/devteamaegis/openai-agents-python/commit/4e0047c35662a2b5329433fe85a326cbd9a57240)，不是本仓原创补丁。使用真实 Runner 与内存 SQLite、官方 ScriptedModel；网络 transport 遇请求即失败，tracing 关闭，按原报告关闭实际压缩。

| 输入边界 | 基线隐藏限额 | 基线显式 RunConfig 限额 | 作者候选（两种限额） |
|---|---|---|---|
| 窗口仅剩助手 message，前面 reasoning 被截掉 | 保留 msg id | 去除 msg id | 去除 msg id |
| 全历史仅一个 assistant 且恰好等于限额，无实际截断 | 保留 msg id | 去除 msg id | 去除 msg id |
| 全部历史短于限额 | 保留 | 保留 | 保留 |
| 窗口以 user 开始 | 保留 | 保留 | 保留 |
| 窗口以 reasoning 开始 | 保留 | 保留 | 保留 |

五种边界 × 两种限额来源 × 流式/非流式，每版本 20 路，两个源码版本共 40 路。所有路线逐字段比较持久层原历史前缀，原记录未变，另新增本轮 user/assistant 两项。清理判据是读回条数等于限额，不是已经证明发生截断：全历史恰好等于限额也会移除前沿 message id。该 id 仅从发送输入移除，不把这理解为删除存储历史或恢复窗口外推理。

## 复跑与失败对照

沿用原实验固定依赖清单，在独立虚拟环境安装。`SOURCE` 指对应公开 SDK 固定源码目录：

```sh
PYTHONPATH=SOURCE/src python experiments/compaction-window-consumer/boundary_probe.py --expect hidden-id
# 作者候选改用 --expect clean。
```

脚本逐路断言 id 的精确预期、原存储前缀和新增项数量；错误预期会失败。基线误用 `--expect clean`、候选误用 `--expect hidden-id` 均实测退出 1；缺少必需参数由 argparse 拒绝。`boundary-baseline.json` 与 `boundary-candidate.json` 是本次实际模型输入观察结果，不是服务端接受结果。

本次没有真实模型/API、HTTP 错误复现、实际压缩、嵌套 wrapper、callback 或 Windows 验证。不证明语义信息完整、模型效果变好或整套候选安全。候选的内部边界函数和既有 workaround 在本组消费者中一致，答案页状态未升级。核实 2026-11-14。
