# 功能验收地图：借用按变更维护，不新增每日全量任务

**给读者的决定：已有真实验收入口时，可以借用“按变更更新地图、明确本次实跑范围”的做法，不因引入地图就增加每日全量验收。** 公开材料支持地图会漂移、维护产物可能滞留，也有团队缩小维护范围；尚不足以判断这对 Skill 比现有检查更省时或更完整。本仓未试用，不宣布采用或提效。

## 本次接收的四项原始证据

| 原始来源 | 已核正文支持什么 | 对读者决定的限制 |
|---|---|---|
| [OpenHands #18971](https://github.com/OpenHands/OpenHands/pull/18971)，2026-10-26 合并 | PR 报告对 `map affected` 列出的功能族做 delta live pass，修正 F18／F22／F08 三处说明漂移，逐项区分失败、阻塞和未运行。 | 28 files／799 IDs／0 problems 是静态地图检查，不是全量功能通过；F18 两处计数仍待核。只能据此借覆盖状态和按变更维护，不能称全量验收成功。 |
| [OpenHands #18295](https://github.com/OpenHands/OpenHands/pull/18295)，2026-10-11 合并 | 旧维护 PR 未合并后，人工要求恢复 main 缺少的地图修正；正文明确沿用 10-09 的观察，未为本 PR 在 live stack 重跑。 | 回填修正不等于当前版本重新验证。它与上一条是同一产品的证据，不是第二个独立消费者。 |
| [Hypertask #1914](https://github.com/hypertask-ai/hypertask/pull/1914)，2026-10-23 合并 | 37 页的每周 live drive 被替换为按变更重读：每次最多 8 页、2 个只读 helper、每周最多 1 张 ticket；首次 checker 发现索引漏页和旧路径引用两处问题。 | 首跑证明的是静态引用漂移；ticket 所列 live recipe 是否随后执行、缩小后是否覆盖同等风险，本次未知。不能把批准的方案当成已证实效果。 |
| [cursor/plugins #150](https://github.com/cursor/plugins/pull/150)，2026-07-12 合并 | 引入时的测试计划说明 maintain Skill 未实跑；正文的四个仓库 eval 验的是生成侧。 | 只限定这次引入时的验证范围，不代表上游此后从未运行；四个 eval 目标不计独立团队采用。 |

来源类型与核实范围：2026-10-28 独立读取上述四份公开 PR 正文及合并元数据；运行结果仍是上游报告，本次未复现、未运行产品或 Skill，也未独立核其二级引用及影像。四份 PR 涉及两个下游产品和一个上游，不是四个独立消费者。

## 接收范围

四条已核，其余未逐项核，数量未知。仅接收上表列明的主张；未核来源的效果、频次、成本与唯一性结论均为未知，不纳入采用依据。不延长原任务，不新增检索、模型任务或试验。

[原采集稿保留为未接收历史](https://github.com/dbvv1/a1dbv/blob/c5902ece2151e0af0544f6a662d4750df823bbb9/docs/collaboration/local-jobs/artifacts/A-VERIFICATION-MAP-SOURCES-20261028/sources.md)。
