# 预注册：Claude Code 先导运行（2026-10-12）

> 按 [PROTOCOL.md](../../PROTOCOL.md) 填写，在运行任何一轮之前提交。之后的修改另记修订，不改动本节。
> 用户已授权本次付费调用（2026-10-12 会话内授权，总额上限见下）。
>
> **修订 1（2026-10-12，运行前）**：因 Claude 侧额度不足，**本先导取消，0 轮运行，没有任何结果**。排程、隔离规则和指标保留，供 Codex（dot 端）改用 `codex exec` 执行时参考；`runner.py` 中的客户端命令和用量字段需按 Codex 改写，见 [Claude 指导记录](../../../../docs/collaboration/reviews/2026-10-12-362491e-claude.md#p2-用-codex-自己跑-workflow-ablation)。

## 目的与边界

- **目的**：先导（pilot）。检查这套夹具能否接入一个真实客户端，并取得第一批真实模型记录；**不做效益或显著性结论**；
- **任务**：只有 `compact-ranges-01` 一个任务，结论不能推广到其他任务。

## 固定项

| 字段 | 值 |
|---|---|
| 实验 ID | `wfa-claude-pilot-2026-10-12` |
| 负责人 | Claude Code 云端会话（本仓库 `claude/happy-bohr-hy3m4b` 分支） |
| Git 基线 | `362491e`（运行时工作树的 dirty diff SHA-256 逐条写入记录） |
| 夹具 | `manifest.json` 的 SHA-256 逐条写入记录；运行前已确认 10 个固定文件与 manifest 一致，`selftest.py` 通过 |
| 客户端 | Claude Code CLI，非交互 `claude -p --output-format stream-json`；版本写入每条记录 |
| 模型 | `claude-haiku-5-5`、`claude-sonnet-5-5`（别名可能漂移，实际 ID 取自结果事件） |
| effort / 采样 | 客户端默认，未设 seed（CLI 不支持） |
| 工具 | `Read,Edit,Write,Bash,Glob,Grep`，全部预先放行；无子 Agent、无 MCP、无 Skill |
| 权限隔离 | 文件类工具禁止访问 `/home/user/**`、`/tmp/claude-0/**`、`/root/**`；**Bash 没有沙箱**（环境缺 bubblewrap），只能事后审计 |
| 工作目录 | 每轮在 `/tmp/wfa/<随机 12 位>` 新复制 `agent-input/baseline/` 的内容；路径不含仓库名，避免模型从目录名推断出仓库位置 |
| 提示 | `task.md` 加当轮条件文件，作为唯一的用户提示；不创建 AGENTS.md / CLAUDE.md |
| 预算 | 每轮 `--max-budget-usd 1.00`，墙钟超时 900 秒；全部 18 轮总授权约 5 美元 |
| 重试 | 不重试；基础设施故障保留原记录并另起 attempt |
| 人工提示 | 无 |
| 缓存 | 不可控；记录 cache read / write / uncached 三项，不声称冷启动 |

## 排程

- 种子 `20261012`，打乱后的基础顺序为 `(C, A, B)`；
- 每个模型的第 1、2、3 次重复依次使用 `(C,A,B)`、`(A,B,C)`、`(B,C,A)`；
- 两个模型交错执行，顺序执行、无并发。

完整排程见 [schedule.json](schedule.json)，共 18 轮（2 个模型 × 3 种条件 × 3 次）。

## 指标

- **主要指标**：所有计划轮次中固定验收通过的比例（`grade.py` 的 `accepted`），分母包含 timeout、failed 和 budget_exhausted；
- **次要指标**：
  - false-green：public 通过但 held-out 不通过；
  - 新回归测试是否在原始缺陷上**因断言**失败、在候选版本上通过；
  - 已有断言是否保留；改动是否只限于 `intervals.py` 和 `tests/`；
  - 墙钟时间、三类输入 token、输出 token、工具调用数、客户端报告的 API 等价费用。

**成功定义**：行为通过（`accepted`）与流程合规（回归测试有效、范围合规、未削弱测试）**分开报告**，不合成一个指标。

## 污染审计

每轮在评分前冻结候选文件的哈希，然后扫描工具调用输入，标记出现 `/home/user`、`a1dbv`、`workflow-ablation`、`evaluator`、`reference.patch`、`held_out`、`/tmp/claude-0` 的轮次。被标记的轮次单独列出，不静默剔除。

## 分析

- 只报告每轮原始值，以及按条件、模型的计数和中位数；
- n=3、单任务，不给显著性、因果或倍数结论；
- 条件 A→B 同时改变了内容和长度；B→C 只增加无关填充，比较的是“这份填充”的影响，而不是“所有长指令”的影响。
