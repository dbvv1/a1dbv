# 接回旧 PR：命令成功，不等于数据已经更新

**🧪 已有修复时，先把它接到当前主干，再让非作者从实际入口读回持久化结果。** 本次沿[长程路线](../../docs/decisions/long-tasks.md)接收 LLM 已有 PR，而不是另写同题投稿：原 CLI 每次都退出 0，但重复执行 `--store` 后，SQLite 的内容仍为空。可借用[接收任务模板](task.md)约定“什么必须改变、什么必须保持”；不能只验命令成功或测试总数。

## 真实输入与整合选择

[LLM #224](https://github.com/simonw/llm/issues/224)要求重复嵌入时更新存储内容和 metadata，不为未变的输入重新计算向量。检查时 issue 仍开放；同题已有多个 PR。本次接收 [#1513](https://github.com/simonw/llm/pull/1513) 的方案，固定 head `af54b15029c9ebf0caa596c773b68e3f46c85244`。它尚未合并、与当前 main 冲突，无维护者已接受该语义的证据。

**保留当前主干能力，比让旧补丁直接套上更重要。** 在 main [`aebaca27`](https://github.com/simonw/llm/tree/aebaca27f9acb6cc56ba4b33ab81e08d6dcb3bc3) 上，`git apply --check` 的源码和测试两文件均失败。当前实现已增加 typed `Attachment`、`_materialize()`、`content_type` 和 `key` 传递；整合只接回“相同 collection／ID／hash 时更新存储字段”的逻辑，保留这些能力。相同内容的新 ID 仍计算一次；不做跨集合／模型的向量复用。维护者曾因模型隔离问题撤回早期实现，因此跨模型负控是验收要求，不是性能优化题。

**不能直接推荐该候选替换现有版本：省略 `--store` 会清掉已存内容，省略 metadata 会清掉旧 metadata。** 这是 #1513 提议的替换语义，不是维护者确认的默认；空 metadata `{}` 也落为 SQL NULL。接收者若需要“省略即保留”，应先明确另一份契约，不能把本次绿灯套过去。

依据：[用户原问题及维护者讨论](https://github.com/simonw/llm/issues/224)、[已有 PR](https://github.com/simonw/llm/pull/1513)、[当前源码](https://github.com/simonw/llm/blob/aebaca27f9acb6cc56ba4b33ab81e08d6dcb3bc3/llm/embeddings.py)与[贡献入口](https://github.com/simonw/llm/blob/aebaca27f9acb6cc56ba4b33ab81e08d6dcb3bc3/docs/contributing.md)，核实 2026-11-02。

## 非作者实际接收了什么

主线适配源码并补回归；非作者在另一目录自写两个确定性 embedding 插件，用同一消费者脚本分别运行原版与候选。每轮 11 次真实 `llm` 子进程，每步重新打开 SQLite，记录输入、行内容、向量/hash 和模型调用。插件仅处理合成数据，每批 ID 唯一，没有真实 provider 或账号；不是模型质量比较。

| 输入／观察 | 原 main | 本地候选 |
|---|---|---|
| 两行 `embed-multi` 不存内容，再同输入加 `--store` | 内容仍空 | 两行回填；无重算，向量/hash 不变 |
| 相同 ID／内容更新 metadata | 旧 metadata 未更新 | 目标行更新，另一行不变；无重算 |
| 相同内容换新 ID；相同 ID 换内容 | 前者未插入；后者通过 | 两者都写入并计算 |
| 相同输入进入两个不同模型集合，再刷新原集合 | 模型／集合隔离通过 | 同样通过，不复用别的集合向量 |
| typed attachment 先不存 payload，再加 `--store` | blob 仍空 | blob 回填、MIME 保留；无重算 |
| 省略存储与 metadata 选项 | 保留原值 | 清除原值——符合 PR 提议，但仍需产品决定 |

两轮所有 CLI 命令都 exit 0；消费者观察是 **6 通过／5 不符候选契约 → 11 通过**。五项中包含未获认可的清除语义，不是五个独立产品缺陷。模型总计算从 6 到 7，多出的是原版漏掉的新 ID，不能称为性能收益。逐项去路径结果在 [results.json](results.json)，其中模型计算数为截至该步的累计数。CLI 没有批量 metadata 参数；该路径由源码回归覆盖，不冒充消费者已验。

## 检查与落地边界

固定环境为 Linux、Python 3.12.14、uv 0.13.4、LLM 0.36。候选仅改 `llm/embeddings.py`、新增 `tests/test_embed_refresh.py`；本地 tree `2db99cdfaa60d7affa5dbe86500480d41eaf19c3` 不是远端 commit。

| 检查 | 实际结果 |
|---|---|
| 新增回归 | 原 main 12 失败／1 通过；候选 13／13。覆盖单条／批量、文本／bytes／typed attachment、metadata、时间戳及向量/hash 保留 |
| 候选完整 `pytest` | **1320／1320 通过**；Linux 当前环境，非 CI 多 OS／Python 矩阵 |
| 原 main embedding 两文件对照 | 修复环境后 136／136；不是原 main 全套测试 |
| 全域 Black、Ruff、mypy | 通过；mypy 检查 19 个源文件 |
| `python -m build --no-isolation` | sdist 和 wheel 均构建成功 |
| Justfile 范围 Cog | `README.md docs/*.md` 通过；包含其调用的文档生成，不代替全部 CI 作业 |

候选首次定向检查为 148 通过、1 失败、1 teardown error；首次全套运行有 159 失败、1161 通过、147 teardown errors，错误链指向环境的 SOCKS 支持包缺失。保留原结果后，从 [PyPI](https://pypi.org/project/socksio/) 指向的[官方 socksio 1.0.0 源码](https://github.com/sethmlarson/socksio/tree/e69158473125060879319368e9465d7881cee0b8)安装，再跑受影响检查得到上表结果；没有撤代理或改安全设置。Cog 首次因未把 venv 的 `sphinx-build` 放入 PATH 退出 4，补齐该 PATH 后通过。这些环境修正未改候选源码，不能删掉首轮失败只留下绿灯。


本地保留原 PR 差量、完整基线／候选源码、实际日志、消费者脚本和 SQLite。公开页不附上游源码补丁，不能用此页安装“已发布修复版”；模板可用于接收自己获准使用的候选。未向上游评论或另提 PR，也没有真实 provider、并发写入、同批重复 ID 的顺序语义、其他 OS 或完整 CI 矩阵的验收。本次非作者接收不等于未读页面的新读者实测，长程页仍为 🟡。
