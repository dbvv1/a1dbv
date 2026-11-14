# cattrs BSON 依赖候选的真实消费者接收

🧪 **BSON 使用 TypedDict、Counter 或 defaultdict 的消费者，可用现有上游 PR #837 作为待接收候选；仅通过序列化而不核输出类型，会漏掉数据没有恢复的故障。** 本次没有更改应用依赖默认，也没有向上游投稿。

## 真实需求与固定版本

[用户报告 #836](https://github.com/python-attrs/cattrs/issues/836) 给出 BSON converter 把 TypedDict 字段、Counter 留成原始字典的实际故障。已有 [修复 PR #837](https://github.com/python-attrs/cattrs/pull/837)，因此复用候选，不重复开发。

- 基线：`e9239b7082206f18e3cec873b11451aff35beb9c`
- 候选：`95b0f8ec116570237187e59ddf70d609ccab7e34`
- 本次环境：Linux、Python 3.12；不是原报告的 Python 3.13，也未验 Windows。

## 消费者契约与结果

`consumer.py` 从原报告的 Event/User/日期还原与错误输入起步，并加容器默认值及既有 bytes-key 行为。两版本运行同一份脚本：

| 契约 | 基线 | 候选 |
|---|---|---|
| Event 的 date、嵌套 attrs 类型还原 | 失败 | 通过 |
| 缺少必需字段拒绝 | 失败 | 通过 |
| 无效字段值拒绝 | 失败 | 通过 |
| Counter 类型和值转换 | 失败 | 通过 |
| defaultdict 类型及缺键默认值 | 失败 | 通过 |
| 既有 bytes-key 编解码 | 通过 | 通过 |

脚本总体退出码：基线 1，候选 0；完整逐项结果见 `baseline.json` 与 `candidate.json`。这是六个有限消费者断言，不是全库或生产采用证明。

## 复跑

将 a1dbv 与 cattrs 两个工作副本放在同级目录，在 cattrs 的隔离可信工作副本，按其 `pyproject.toml` 准备依赖；脚本至少需要 attrs、typing_extensions、pymongo。

```sh
git switch --detach e9239b7082206f18e3cec873b11451aff35beb9c
PYTHONPATH=src python ../a1dbv/experiments/cattrs-bson-consumer/consumer.py
git switch --detach 95b0f8ec116570237187e59ddf70d609ccab7e34
PYTHONPATH=src python ../a1dbv/experiments/cattrs-bson-consumer/consumer.py
```

## 原生检查与非作者复核

候选原生 BSON 测试 10 passed、2 skipped、74 deselected；跳过项为 Python 3.15+ sentinel，本环境为 Python 3.12。pytest 另报两个 typing 配置项警告；未运行完整测试集。首轮因未安装 msgpack 导致收集失败，补齐相关公开可选依赖后复跑上述范围。

独立审查者从 Git 对象另解包基线、分别重跑同一消费者，确认 baseline 1/6、candidate 6/6 与原报告对应，候选工作树干净。消费者主依赖 attrs 26.1.0、pymongo 4.20.0。

## 接收范围

使用迁移页的“保留行为 + 实际消费者”路线检查替换；不因候选原生测试通过便外推消费者正确。本项还缺另一项同类真实任务的本机新读者接收，不修改地图评级。cattrs 明确不接受无人监督自动投稿与 LLM 评审评论，本次仅在本仓保留试用，不向上游发送。

核实：2026-11-14，源码、用户报告、现有候选及本次实际消费者运行。
