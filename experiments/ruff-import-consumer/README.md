# Ruff F401 清理：退出 0 后仍要验消费者

**Ruff 0.17.3 的 F401 自动修复会在一个已修改的 SDK 模块副本中删错绑定，修复命令退出 0，实际导入却失败。** 未修改的 OpenAI SDK 3.46.0 对照通过，这不是原版 SDK 故障。仅从 `__all__` 移除兼容别名后，原同名导入仍合法；清理误删了仍被类型联合使用的名字。

让 Agent 清理生成代码时，先核导出契约，再检查修复 diff、实际导入与相关行为；仅重跑 F401 不能接收这个改动。已有项目检查能发现就沿用，不新增统一门禁。

## 复跑

在独立 Python 3.12 环境安装同目录 `requirements.txt`，再运行：

```bash
python -m pip install -r experiments/ruff-import-consumer/requirements.txt
python experiments/ruff-import-consumer/replay.py > replay-results.json
```

需要联网的只是依赖准备。脚本只在临时目录修改模块副本，核包版本与原源码 SHA，不改安装目录；导入真实 SDK 依赖，构造并序列化 `DecisionItemCreateEvent`，不创建客户端、不发 API 请求。退出 0 表示三组预期行为都被复现，**不是三个消费者都成功**；对照结果见 [results.json](results.json)。

## 三组实际结果

| 输入副本 | 修复前消费者 | F401 `--fix` | 修复后消费者 | 另跑 F821 |
|---|---|---|---|---|
| 原发布文件不改 | 成功 | 0，无问题 | 成功，输出不变 | 0 |
| 仅从 `__all__` 删除 `Item` | 成功 | 0，称两项已修 | `DecisionUserMessage` 未定义，导入失败 | 1，发现未定义名字 |
| 同上，并把同名别名移成独立 import | 成功 | 0，修一项 | 成功，输出不变 | 0 |

第二组的导出删除是本轮受控修改，模拟原用户报告的前置清理；它本身改变了公开导出，不把第三组当成恢复全部公共 API 的通用补丁。第三组仅证明在这份输入上保留使用中的绑定可以通过消费者验收。F821 可抓住本例，也不替代运行测试或证明其他自动修复安全。

2026-11-05 在 Linux、Python 3.12.14 实跑。未运行 Ruff 源码测试、PR 补丁、完整 SDK 测试、其他平台或真实服务；上游已有同题 PR，不重复投稿。

## 来源

- [Ruff #29992](https://github.com/astral-sh/ruff/issues/29992)：用户报告 0.17.3 在同条导入包含原名与别名时删错绑定，并说明来自生成 SDK 的清理链。
- [现有修复 PR #30014](https://github.com/astral-sh/ruff/pull/30014)：核实时 open、未合并，head `9447d1ee066d2290aef0f4aaee96e27c0805f311`；本轮未构建该补丁。
- [OpenAI SDK 固定模块](https://github.com/openai/openai-python/blob/ea5d1606f441d80dca1e9e7f99b74581f41408f8/src/openai/types/live/decision_item_create_event.py)：v3.46.0 对应源码；脚本核官方发布包内文件 SHA256 `12d31779732644e4cea1c2b50e268d4efca2f0c17020455c7428d3926af57d03`，运行时读取，不在此复制 SDK 源码。
- [Ruff 0.17.3 发布](https://github.com/astral-sh/ruff/releases/tag/0.17.3)。来源与发布状态核实：2026-11-05。
