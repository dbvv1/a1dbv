# 用量与会话可见性：ccusage 补历史诊断

> 核实时间：2026-10-12。🧪 试用；未运行、未读取个人日志。
> 发布快照：**v20.0.30，2026-10-11**；功能说明取自核实日 main 文档，不担保全部历史版本。**[一手：release/文档]**

## 原生基线与增量

Codex [官方命令文档](https://learn.chatgpt.com/docs/developer-commands?surface=cli) 已列 `/status` 的模型、权限、目录和 token 状态，以及 `/statusline` 可选额度、会话 ID、分支等。只想看当前状态，先用这些；账户实际结算与额度仍看服务商。**[一手；经验：采用判断]**

[ccusage Codex 数据源](https://github.com/ccusage/ccusage/blob/main/docs/guide/codex/index.md) 从本地 JSONL 重建日/月/会话报告，支持 JSON、多个 home 和 `--offline`；当前命令为 `ccusage codex daily`、`ccusage codex session`。适合寻找异常消耗来源，但数据源仍标实验性，无法补回缺失日志，本地总数不必等于账户全量。**[一手：文档，未运行]**

必须分清：日志 token、价格表估算、服务商实扣、订阅剩余额度。订阅或网关下尤其不能互换；合并多个目录也不自动证明账户归属正确。**[经验：采用边界]**

## 历史用量不能直接回答实时 token/s

将输出 token 除以整轮耗时，只能得到该口径的平均吞吐；整轮时间可能包含排队、思考、工具和等待。要声称实时解码速率，需要对应输出增量及可靠的生成时间边界；缺少这些字段时应明确不可计算，不能用输入或缓存 token 填充输出速率。这个判断来自计量口径，不是本仓库对 ccusage 实时能力的测试。**[经验：计量边界]**

按会话报告也不等于自动识别桌面当前选中的会话。若做浮层，还需独立验证当前窗口与会话的对应、切换延迟、重复事件和不可识别时的显示；不能因为已有会话 ID 就承诺自动随窗口切换。**[经验：待验证设计]**

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

[返回模块](README.md) · 成本背景见 [02](../02-models-and-cost.md)
