# Claude E1–E3 原始产物

> 2026-10-12 补交。对应 [19 实测记录](../../docs/19-experiments.md) 的 E1–E3，以及第 3.1 节的 `/context` 补测。**[经验：实测]**
> 这些数据是当时会话中留下的记录，事后做了脱敏，没有重跑。

## 内容

`logs/` 在 `3650495` 中因仓库 `.gitignore` 的 `logs/` 规则被漏提交（Codex 发现），已于 2026-10-13 用 `git add -f` 补交。

| 路径 | 内容 |
|---|---|
| `logs/e1.jsonl` | E1 每次请求一行：条件、`input_tokens` / 缓存写入 / 缓存读取、输出、`total_cost_usd`、耗时 |
| `logs/e3-haiku.jsonl`、`logs/e3-sonnet.jsonl` | E3 每轮一行：条件、测试结果、diff 统计、主流程 Bash 命令摘要（每条最多 160 字符）、工具调用计数、token、费用 |
| `logs/e2.jsonl` | E2 每轮一行（D 直接做 / S 两个子 Agent） |
| `logs/context-breakdown-2026-10-12.json`、`logs/api-2026-10-12.jsonl` | 第 3.1 节的 `/context` 分项，以及同日的 API 实际计数（Claude Code 2.1.296） |
| `transcripts/*.jsonl` | E2、E3 每轮的精简轨迹：助手文本、工具调用和输入、工具结果（每条截断到 1500 字符）、最终结果事件。`A-haiku-0` 是正式运行前的冒烟测试，不计入统计 |
| `inputs/` | E3 的提示词、B 条件和 C 条件的 CLAUDE.md、埋 bug 的补丁；E2 的两份提示词 |
| `scripts/` | 当时使用的脚本：`runc`（隔离的 `claude -p` 包装）、`run1.py`（E1）、`e3.py`（E2/E3 运行与检查）、`e3check.py`（回归测试是否有效）、`e2score.py`（E2 召回）、`ctx.py`（`/context` 分项）、`sanitize.py`（轨迹脱敏） |

## 脱敏与缺口

**脱敏处理**：
- 会话临时目录替换为 `<exp>` 或 `<tmp>`，父仓库路径替换为 `<parent-repo>`，会话 ID 替换为 `<uuid>`；
- 去掉了 stream-json 中的增量事件和 init 事件里的环境字段，只保留版本、模型和工具列表；
- 脚本里的路径常量也做了同样替换，**需要改回本地路径才能运行**。

**2026-10-13（UTC+8）核对**：主要汇总可从公开文件复算，样本有效范围、E2 的主流程 `usage` 与累计 `modelUsage` 区别见[研究记录](../../docs/research/2026-10-12-experiment-records.md#产物状态与引用口径)。`ran_full_suite` 只是摘要上的字符串启发式；本次未重跑模型或独立重现有效回归。2026-10-16（UTC+8）补核：`e3check.py` 是历史启发式检查，恢复源码后整套测试失败不能证明新增用例有效；逐轮可见的定向失败及剩余缺口见[研究记录 E3 节](../../docs/research/2026-10-12-experiment-records.md#4-e3指令文件长短)。

**缺口**：
- E1 没有保存逐次的 stream，只有汇总记录；
- E1 用的三份 CLAUDE.md 是“`# Project notes`”标题加上 Claude Code 公开 CHANGELOG 开头的若干字节，没有入库。大小和 SHA-256 前缀如下：

  | 文件 | 字节 | SHA-256 前缀 |
  |---|---|---|
  | 2KB | 2,075 | `dbc2bcea8db0d8d8` |
  | 20KB | 20,511 | `22c0eac0bb43c181` |
  | 72KB | 73,777 | `7855e910700722f2` |

- 实验仓库是 [hukkin/tomli](https://github.com/hukkin/tomli) @43a86ad（MIT），没有一起提交；
- **隔离缺陷**：E2 D 条件的 3 次运行，模型都先去 `<parent-repo>/src/tomli` 读代码，都因路径不存在而失败。路径来源未确认，最可能是从会话临时目录名推断出来的。轨迹里没有成功读取父仓库的记录。后续实验应使用不含仓库名的中性路径（见 [Claude 指导记录](../../docs/collaboration/reviews/2026-10-12-362491e-claude.md#p2-用-codex-自己跑-workflow-ablation)）。
