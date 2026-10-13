# 用量与会话可见性：ccusage 补历史诊断

> 核实时间：2026-10-13。🧪 试用；未运行、未读取个人日志。
> 发布快照：**v20.0.30，2026-10-11**；本轮核对 main 固定源码 `06581604`，不把新增能力自动归于该发布版。**[一手：release/文档]**

## 原生基线与增量

Codex [官方命令文档](https://learn.chatgpt.com/docs/developer-commands?surface=cli) 已列 `/status` 的模型、权限、目录和 token 状态，以及 `/statusline` 可选额度、会话 ID、分支等。只想看当前状态，先用这些；账户实际结算与额度仍看服务商。**[一手；经验：采用判断]**

[ccusage Codex 数据源](https://github.com/ccusage/ccusage/blob/main/docs/guide/codex/index.md) 从本地 JSONL 重建日/月/会话报告，支持 JSON、多个 home 和 `--offline`；当前命令为 `ccusage codex daily`、`ccusage codex session`。适合寻找异常消耗来源，但数据源仍标实验性，无法补回缺失日志，本地总数不必等于账户全量。**[一手：文档，未运行]**

已知会话 ID 时，可用 `ccusage codex session --id <完整UUID> --json` 直接查单会话；也支持完整 sessionId、文件名和 `codex://threads/<uuid>`，短 UUID 不接受，多匹配报歧义。先用手动指定入口，不必为查看消耗先做自动窗口跟随。**[一手：[固定文档](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/docs/guide/session-reports.md)；经验：采用顺序]**

报告的 `inputTokens` 是非缓存输入；计算缓存读取占比时，分母用 `inputTokens + cacheReadTokens + cacheCreationTokens`，reasoning 已包含在 output 中，不再相加。**[一手：[分项源码](https://github.com/ccusage/ccusage/blob/06581604247a48118ba071e0dd96e7e84756652e/rust/adapters/codex/src/report.rs#L54-L132)]**

必须分清：日志 token、价格表估算、服务商实扣、订阅剩余额度。订阅或网关下尤其不能互换；合并多个目录也不自动证明账户归属正确。**[经验：采用边界]**

## 历史用量不能直接回答实时 token/s

`--speed auto|standard|flex|fast` 选择计价档，并非测量速度；当前 session JSON 有 token、估算成本和 `lastActivity`，没有生成时长或 tok/s。**[一手：[报告与计价源码核对](../research/2026-10-13-session-usage-metrics.md)]**

当前公开 Codex 实现会把可选的整轮 `duration_ms`、`time_to_first_token_ms` 和带 `turn_id` 的用量记录写入 rollout；若数据完整，可单独按轮计算“平均输出 tok/s（含思考、工具、等待）”并展示首 token 等待，但 ccusage 尚未解析这些时间字段，TTFT 的首模型响应信号也可来自推理、工具调用或压缩 item，不保证是可见正文 token。**[一手：[计时、落盘与测试](../research/2026-10-13-session-usage-metrics.md#时间字段确实可以落盘但不是解码计时)；经验：指标建议]**

关键限制是：常规 rollout 省略流式文本／推理 delta，整轮平均吞吐不能还原纯生成 tok/s；旧日志缺字段、终态 error／abort 或用量缺失时应显示不可计算，不补成零。按会话查询也不代表自动识别当前桌面窗口。**[一手；经验：计量与产品边界]**

## 社区反例与维护状态

- [#988](https://github.com/ccusage/ccusage/issues/988) 是 18.0.11 分叉会话重复计数报告，已关闭关联修复；当前文档已说明继承历史与去重，不能称 v20 必然还有同样问题。**[社区：单例；一手：当前文档]**
- [#1617](https://github.com/ccusage/ccusage/issues/1617) 报告 20.0.20 漏算 cache-write，已关闭并关联 #1663；[20.0.21 release](https://github.com/ccusage/ccusage/releases) 列出修复，20.0.29 又更新 Fast/Flex 计价。日志解析和计价都需维护，不能固定一个旧数字长期当账单。**[社区：单例；一手：changelog]**

## 许可、数据与试用

[LICENSE](https://github.com/ccusage/ccusage/blob/main/apps/ccusage/LICENSE) 为 MIT，上游模型/API/订阅费用另算。日志可能包含代码、对话与路径；本地读取不代表可以任意上传报告。虽有 offline 模式，本轮没有审核全部网络路径，不宣称工具绝对不联网。**[一手；经验：风险边界]**

待执行方案 **[经验：设计]**：
1. 仅用获准读取的脱敏日志副本，固定工具/Codex 版本、时区和价格模式。
2. 普通会话作基线，再检查 fork、resume、compaction；未知模型/价格/日志记“未知”，不能变成零费用。
3. 分开记录估算和实际账单；不要为了分析重写原日志。
4. Windows 路径发现、多 home、PowerShell 配置和退出后 Codex 正常运行都待实机确认。

保留条件是能解释真实异常；原生已够用或差异解释不清时，不用它作预算承诺。退出只移除分析工具，不应改动 Codex 凭据。

[返回模块](README.md) · 成本背景见 [02](../02-models-and-cost.md) · [固定源码、修复链与验证范围](../research/2026-10-13-session-usage-metrics.md)
