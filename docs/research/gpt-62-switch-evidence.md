# GPT-6.2 切换决策的证据

从[模型选路答案页](../decisions/model-roles.md#换模型先用自己的任务比)进入操作。这里保留外部对照的版本、计时口径、反例和原核实日期；这些不是本仓的 GPT-6.2 模型运行。

### 任务分项与通过率

[Artificial Analysis 的原始分项](https://artificialanalysis.ai/agents/coding-agents/comparisons/codex-vs-deepseek-harness#models)里，两版 Sol 都在 Codex 的 `max` 档：6.1→6.2 的代码改动 42→42、终端任务 54→58、仓库问答 60→46。不能拿其中一个分项替另一个。按[评测方法](https://artificialanalysis.ai/methodology/coding-agents-benchmarking)每题各跑三次；未核到两版的同一客户端构建或实际速度档，结果不外推到其他档位。2026-11-21 核读，未复跑模型。

外部结果说明为什么要分开看：Corti 两轮用 OpenCode `max` 跑相同六个公开 bug，6.1 Sol 约 19 分钟、6/6，6.2 Sol 14 分钟、5/6（含失败）；这是竞品团队分日各跑一次的自报。VulcanBench 的 23 项旧程序重建中，6.2 Sol 的 `low` 和 `xhigh` 都是 23/23，但分别为 2.8 和 8.2 分钟／题，约 $0.23 和 $0.46／题；同任务的 6.1 历史组用 CLI 0.159.0，6.2 用 0.166.0，不能把耗时差全归给模型。同一评测的 6.1 组里，`medium` 过 22/23、约 $0.40／题，`high` 反而过 23/23、约 $0.33／题：升档也可能减少整项投入，仍须看本轮结果。VulcanBench 美元数不含裁判费用，是按 token 回算的 API 等价费用，不是 Codex 订阅实扣。

**依据**：[Corti 6.1 一轮](https://corti.ai/blog/corti-s1-model-race)、[6.2 一轮](https://corti.ai/blog/corti-s1-gpt-6-2-model-race)；[VulcanBench 6.2 五档及 6.1 历史组](https://vulcanbench.com/benchmarks/swe-v4-gpt62-sol-v331.html)、[6.1 原结果](https://vulcanbench.com/benchmarks/swe-v4-gpt61-sol-v318.html)及[6.1 固定复现范围](https://github.com/morganlinton/VulcanBenchCOM/blob/e4c7e6f6d345d72d8299db37cff1165f8d33007a/assets/data/swe-v4-gpt61-sol-v318/REPRODUCING.md)。2026-11-20 核读，未复跑模型；VulcanBench 可重算公开指标，补丁和隐藏答案未公开。

### 排名与实际交付

**看真实使用排行时，先找与你要改善的结果同义的分项。** [Arena Coding Index](https://arena.ai/leaderboard/agent/code) 的 11-18 快照中，Max 档的 6.2 Astra 综合第 3、旧 Astra 第 8；切到用户确认完成分项，两者却分别第 7、第 4（1286、1312）。[指标定义](https://arena.ai/resources/agent-arena-signals#capability-signals)只计主动点「是／否」的任务，未反馈不进分母；用户说完成也不是独立的行为验收。若要改善实际交付，回放本项目同类任务，分别记原检查是否通过、用户纠正了几次和是否交齐，再决定换版，不拿综合排名抵掉漏交付。2026-11-22 核公开快照与[随机分配、加权方法](https://arena.ai/blog/introducing-the-agent-arena-index#methodological-updates)；未获两版同题原始记录，排名不证明差异显著。

### 整单重试

**换版对比先分开记模型工作、测试耗时和整单重试。** Zhuojun Li 用同一 Codex CLI 0.169.0-alpha.11.1、两版从 `medium` 起步，重放同一 Python 仓库的五个真实工单。6.2／6.1 首次都过 3/5、最终都过 5/5，平均每单 28.8／28.1 分钟；按 token 回算 $5.44／$4.35。去掉一单重复跑全套测试的工单，费用方向反转（$3.44／$3.97）。这轮四个任务共用同一台 Mac，有受负载影响的定时测试失败，6.1 也有一次重试升到 `xhigh`。基线和候选用相同的并发条件，遇到共享资源互相干扰就改成交错运行；一处重试改变结论，就保留该单并单列原因，不把总差额全算给模型。依据：[作者的工单实测与逐单金额](https://dev.to/lizhuojunx86/gpt-62-sol-beat-gpt-61-sol-on-the-leaderboard-on-5-of-my-real-work-orders-it-tied-and-cost-25-52bp)，2026-11-22 核读；代码和原执行日志未随文公开。

### 工具区间复算

**升档后变慢，先把工具计时的重叠区间合并，别把整段差额算给测试。** 复算 VulcanBench 同一道 qlite 题的公开轨迹：GPT‑6.2 Sol 在同版 Codex CLI 0.166.0 从 `low` 到 `max`，总耗时 136.9→1082.4 秒；将工具调用起止区间取并集，只有 1.30→11.11 秒。换档时分别保留这两列；这条轨迹不足以归因给慢测试，也不能把未覆盖时段全算成模型推理。[低档轨迹](https://github.com/morganlinton/vulcanbench-gpt62-sol-traces/blob/bf835f0bc3a744f4994c9ac8a7943402a54bdf60/traces/low/legacy-qlite-store-parity.jsonl) · [最高档轨迹](https://github.com/morganlinton/vulcanbench-gpt62-sol-traces/blob/bf835f0bc3a744f4994c9ac8a7943402a54bdf60/traces/max/legacy-qlite-store-parity.jsonl) · [计时实现](https://github.com/morganlinton/VulcanBench/blob/0e9b30fb4961de85438669b83d789941035d1fae/harness/agent/cli_agents.py#L2641-L2673)。2026-11-22 复算，一题各一次；时间来自收到 CLI 事件的时点，轨迹隐藏命令与输出，未复跑模型。

### 代码审查回放

CodeRabbit 的 Sol 6.1 → 6.2 高推理配置在 42 个 PR 上，已知问题命中 58→60／81，常规可执行评论 187→290，匹配已知问题的比例 35.3%→25.9%，回放记录成本 $0.772→$1.146／PR。两版仅各跑一轮，整条管线不只换一个模型，且部分上游调用用零成本录制响应；这不是独立模型效果、真实生产账单或人工核查用时。早先的 Sonnet 5.5 同组回放还发现：总体多抓一项，同时有一项从差异内降为差异外。接受前分别看新增与丢失，不只看净数量。

**依据**：[评审工具团队：Sol 管线回放](https://www.coderabbit.ai/blog/gpt-6-2-sol-and-astra-review)，2026-11-19 发布、11-23 核读；[同团队：Sonnet thinking 回放](https://www.coderabbit.ai/blog/sonnet-5-5-model-review)，2026-09-28 发布、10-28 核读；本仓未运行模型。

### 社区中的分工反例

真实使用反馈也有分歧：V2EX 的 ezioswj 自述用 Sol 开荒、将路径明确的工作交给 Luna；另一位用户报告 Sol 6.1 `low` 仍慢、额度消耗高。它们适合提醒你检查自己的任务形状，不能据此估算能用几天或承诺某档更省。

**便宜实现＋强审查也可能不省。** Reddit 用户 msw3age 自报两项任务均由 Opus 5.5 规划、两模型用 `high`；Sonnet 实现后交 Opus 审查并退修或代修，都比 Opus 单独完成更慢、更贵，但代修组合额外抓到一个 bug。具体费用与代码未公开，适合提醒比较返工和新增发现，不据此改为全员强模型。

**依据**：[社区原帖] [V2EX：模型分工（#2）](https://www.v2ex.com/t/1247018)、[V2EX：低档仍慢的反馈](https://www.v2ex.com/t/1248411)（2026-10-26 核读、2026-10-28 重核）；[Reddit：混合模型返工反例与作者补充](https://www.reddit.com/r/ClaudeCode/comments/1wsqfzk/comment/pcnxwy4/)（2026-10-28 核读，用户自报，未复跑）。
