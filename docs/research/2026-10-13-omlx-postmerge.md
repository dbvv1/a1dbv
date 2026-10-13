# oMLX：AI 归属的一行修复合入后，维护者补全真实输入探针；后续严格模板兼容性未闭环

## 结论及采用边界

可作为“接收者确实在合并后继续修改”的案例。这里的第二次修改有独立 commit 和维护者自己的明确说明，涉及运行逻辑、能力缓存键和回归测试，不只是审批或 CI。不能写成“合并后出了事故，维护者补救成功”：探针缺口在合并前已被贡献方明示；合并后的修改是在补全这个已知边界。后来其他模型仍出现类似症状，且另一个 issue 提供了严格模板与安全 fallback 不兼容的具体解释，但没有最终恢复确认。

核实时间：2026-10-13（UTC+8）。**[一手：公开 issue、PR、固定提交与测试源码；社区：评论中的运行报告；研究：采用判断]** 本次没有运行模型或上游测试；来源阅读不能充当独立效果复测。

## 1. 原始贡献、AI 归属与已知 caveat

2026-08-02，ivibes 在 [issue #2483](https://github.com/jundot/omlx/issues/2483) 报告：Claude Code 在工具结果之后插入 system 提醒，oMLX 把它们集中到开头，导致原本可追加的会话前缀发生变化。

[本地复测及归属声明](https://github.com/jundot/omlx/issues/2483#issuecomment-5160009467)给出一行补丁，允许 placement classifier 的 predecessor 为 user 或 tool。该 AI 署名评论报告在 KAT 模板上重启服务器后，缓存复用随会话增长，并附实时流量指标。

同一评论明确把调查、补丁和该评论归属于运行在 Claude Code 中的 Claude（Opus 5）。它也**在合并前**指出：现有能力探针只检查 system-after-user；允许 tool predecessor 后，探针并未真的验证 system-after-tool。对前驱角色敏感的模板可能因此获得错误的支持判断。故“未被测试的输入”不是维护者合并后才首次发现。

归属限度：这是作者披露，不是独立模型执行审计。可以说“AI 归属的一行修复随后被合入”；不能说 PR 的全部制作或后续维护者 commit 都由 AI 完成。无人工工时、提示轮次、总维护成本或对照生产率数据。

## 2. 合入的一行修复

- PR：[q-p 的 #2753](https://github.com/jundot/omlx/pull/2753)，jundot 于 2026-08-17 合入
- 固定 commit：[d5637c5428f7c2b3bcd0d87a3dcb42d24663c123](https://github.com/jundot/omlx/commit/d5637c5428f7c2b3bcd0d87a3dcb42d24663c123)
- 仅改 omlx/api/utils.py，一行增加、一行删除：`prev_role != "user"` 改为 `prev_role not in ("user", "tool")`
- 这与 ivibes 评论中披露的补丁相同；未找到 q-p 本人制作 PR 的模型过程，不能替其推断

## 3. 真正的 post-merge 第二次修改

[jundot 的 PR 评论](https://github.com/jundot/omlx/pull/2753#issuecomment-5317553327)明确表示，合并后在 main 补上真实 tool predecessor 的能力探针及 between/tail 回归覆盖。

独立 commit：[bddc9f883cca1065b6c887713b55fbe6f920ec17](https://github.com/jundot/omlx/commit/bddc9f883cca1065b6c887713b55fbe6f920ec17)，标题为 `fix: validate tool-adjacent mid-system templates (#2483)`，author/committer 均为 jundot，提交时间为 2026-08-18 00:13:55（UTC+8），其声明发表于 00:16:49。

### 源码核对：补的不是“再跑一遍同样测试”

该 diff 同时修改 omlx/api/utils.py 与 tests/test_api_utils.py：

1. classifier 从只返回 tail/between，改为返回 `(preceding_role, placement)`；使真实输入的前驱角色传到能力探针
2. 探针新增 `preceding_role` 参数；tool 情况构建 user → assistant(tool_calls) → tool(tool_call_id 匹配) → system，而非把原先的 user 探针结果当作通用能力
3. 检查 system 标记是否出现在相应的 predecessor 标记之后；between 还检查其后 assistant 标记
4. 将 `preceding_role` 纳入能力缓存键，避免同一模板“user 后支持”结果被用于“tool 后”
5. 新增 valid tool-history 测试替身，要求 tool 有相匹配的 assistant tool_call；新增只允许 user 后 system 的模板替身
6. 新增 between、tail、拒绝后 fallback，以及 user/tool 探针缓存隔离测试

between/tail 回归明确断言消息保持原位，缓存隔离测试区分 user/tool 的能力结果；不能把所有测试压缩为“只验证可渲染”。探针自身验证模板渲染位置，不证明模型层面的指令语义，也未测端到端缓存命中或性能。

## 4. 后来的真实输入：另一类兼容性边界

后续时间线：

- 2026-08-21，[JJOne123 报告 Ornith 上仍有相似缓存症状](https://github.com/jundot/omlx/issues/2483#issuecomment-5370629460)
- 2026-08-22，[q-p 要求查看前缀变化的真实 prompt 序列](https://github.com/jundot/omlx/issues/2483#issuecomment-5378896918)，以分辨同因或不同因
- 2026-08-29，[q-p 报告 Qwen 3.8 上再现相似症状](https://github.com/jundot/omlx/issues/2483#issuecomment-5465098630)
- 2026-08-30，q-p 新开 [#3316](https://github.com/jundot/omlx/issues/3316)，给出真实请求中的 role 序列；这里的解释比“缓存又坏了”更具体

#3316 的配置使用要求 system 位于开头的严格模板。真实序列中有 tool → system → assistant，无法把 system 提醒并到相邻的安全 user 文本。因此，即使 classifier 已接受 tool，且探针已经正确识别模板不支持，程序仍会落入前置合并 fallback，失去这一部分的前缀复用收益。

### 第二个边界与第一个漏项必须分开

- 第一项是**能力探针输入不匹配**：只测 user，却允许 tool。维护者的 post-merge commit 确实修了它
- 第二项是**模板真实不支持，且安全降级没有可用目标**：准确拒绝不代表仍能保持缓存。不能把它写成“第二次修复未生效”或“同一个 bug 回归”

[固定源码](https://github.com/jundot/omlx/blob/bddc9f883cca1065b6c887713b55fbe6f920ec17/omlx/api/utils.py)中 `_downgrade_mid_system_to_user_notes` 明确只把 unsupported system 放入相邻安全 user 文本，并刻意拒绝有风险的 tool-call 边界和多模态内容。tool → system → assistant 的两侧都不是可写入的安全 user，因此返回 None；`unsupported_fallback` 再调用 `strict_fallback`，后者执行 `_consolidate_system_messages`。

尤其值得注明：post-merge 新增的 `test_falls_back_when_template_rejects_system_after_tool` 已断言 system 被移到开头，并让严格测试模板能继续渲染。该测试检验的是拒绝后的合法 fallback，不是每种模板仍能保持前缀缓存。后来报告的性能代价可以与这个测试同时成立，不能把绿灯解释成所有输入的缓存目标都满足。

没有源码证据把 Ornith 报告也归为同一机制；仅将其保留为相似症状。#3316 的源码解释与固定版本路径相符，但没有拿到报告者当时的完整运行环境重现。

## 5. 后续用户修改与未闭环

q-p 随后在 [#3316 评论](https://github.com/jundot/omlx/issues/3316#issuecomment-5477417097)建议在 chat template 层处理，并附完整自定义模板，让非首条 system/developer 在原位渲染；其明确说明仅轻度测试。

可以记录为实际给出了后续修改方案，不能当作已验证部署、上游合入或用户确认恢复。#3316 虽为 closed/completed，但只有该一条评论，没有确认重测成功，关闭状态不足以补齐这一证据缺口。

## 6. 对采用建议的影响

修复扩大可接受输入时，同步更新能力探针、缓存键和回归覆盖，并在已有 PR 说明里写清实际模板与 fallback 的代价。对性能与兼容性修复，核对断言是否覆盖用户目标：正确拒绝并合法降级，可能仍牺牲原本追求的缓存复用。合并后相似症状先对照真实请求，不自动归为同一回归。

此案不支持增加通用交接模板，也不能证明 Claude 独立完成 PR、维护者在事故后才发现未知缺口，或所有模型已恢复。报告中的使用结果属于评论自述；没有人工工时、成本收益或完整运行环境，不从日历等待推算接管成本。
