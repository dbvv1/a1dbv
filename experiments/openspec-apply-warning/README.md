# OpenSpec 的 ready、warnings 与 validate 并不等价

**🧪 OpenSpec 1.14.3 和 1.16.0 都复现：缺少 delta spec 时，apply instructions 成功返回 `state: ready` 和一条 warning，`validate` 却失败。** 实际生成的 apply Skill 没有显式处理 `warnings` 字段；这证明 CLI 与提示文本的衔接缺口，不证明 Claude 已忽略警告或实现出错。

问题来自 [#2166](https://github.com/Fission-AI/OpenSpec/issues/2166)。**原帖只给命令与三份规划文档的形状，没有给正文；本轮短文档是据此编写的公开最小夹具，不是报告者原文件或完整项目。** 没有调用模型，也没有实现登录应用。

## 六个隔离项目的实际结果

两版官方 npm 包各运行三个独立项目；proposal、design、tasks 均齐备，tasks 有一项未勾任务。通过正式 CLI 初始化并生成 Skill 后，查询 status、apply instructions 与 validate。

| 条件 | 1.14.3 与 1.16.0 的 apply | 两版 validate | 本次能说明什么 |
|---|---|---|---|
| 三份规划文档，无 delta | exit 0；ready；1 条 warning | exit 1 | ready 并未保证变更通过验证 |
| 同内容加一份含要求与场景的 delta | exit 0；ready；没有 warnings 字段 | exit 0 | 该 delta 闭合了此夹具的验证缺口 |
| 无 delta，显式 `skip_specs: true` | exit 0；ready；没有 warnings 字段 | exit 0 | 仅验证显式跳过标记的机制 |

**第三行不是登录行为变更的修法。** 本轮把同一登录夹具用于机制对照；原 warning 将此标记限定在确实没有指定行为变化的变更，验证通过不能证明跳过具有业务依据。

成功对照的原始 JSON **省略** `warnings`，不是返回空数组。汇总将缺省值归一为 `[]`，同时保留 `warnings_field_present`；[完整查询记录](results.json)保留了原 JSON 的区别。六组的任务进度都仍为 0/1，没有勾选任务或声称实现完成。

## 生成 Skill 的实际文本

六份生成的 `openspec-apply-change/SKILL.md` 都没有 `warnings` 字段处理，并保留 `Otherwise: proceed to implementation` 分支；**同时仍有遇错误、阻塞或不清楚需求时暂停的一般指令**。前者是文本缺口，不能用来推断某个模型一定继续执行、未向用户告警或造成数据损失。原报告也明确来自文本与 CLI 对照，没有模型会话 trace。

固定主干的 [apply 模板](https://github.com/Fission-AI/OpenSpec/blob/27c0515724decc633818c735ee596481eec78a8b/src/core/templates/workflows/apply-change.ts)可核同一分支；实际生成文件的 hash 和文本检查保存在结果中。本轮运行的是正式 npm 包，不是主干构建或修复 PR。

## 证据与范围

[results.json](results.json) 包含六条件完整汇总、18 次 status／apply／validate 的原始参数、目录、UTC 时间、退出码及 stdout／stderr，还保留本轮夹具正文、生成 Skill hash 和查询前后项目文件 hash。公开投影只替换执行目录与 Node 路径；初始化和安装日志不在这份投影中，不把它称为全部准备过程。

所有查询前后项目文件 hash 相同（枚举不含 `.git` 元数据）。实际环境为 Linux、Node **24.22.1**、Python **3.12.14**，工具仅安装于隔离工作区；npm 版本与 integrity 对上包锁。执行前设置 `OPENSPEC_TELEMETRY=0`、`DO_NOT_TRACK=1`、`CI=1`，没有向模型提交夹具。

截至核实日，最新正式发布仍为 **1.16.0**；[#2170](https://github.com/Fission-AI/OpenSpec/pull/2170) 仍 open、未合入，head `ae501b27c5595ad7b9b63eef4117adcfcb07118a`。本轮不重复开发或执行该候选，也不把上游自报测试作为自己的结果。

这里只接收云端 CLI 与生成文本证据：未验模型行为、归档／同步、应用实现、原报告的 macOS 环境或第二名本机读者。它不新增默认配置、操作指南或答案页验收，也不推翻[已有两轮规格接续试验](../../docs/research/2026-10-22-frontier-trials.md#openspec规格接力与协作落点)的不同范围。

**依据与核实**：[使用者原报告](https://github.com/Fission-AI/OpenSpec/issues/2166)、[1.14.3 发布](https://github.com/Fission-AI/OpenSpec/releases/tag/v1.14.3)、[1.16.0 发布](https://github.com/Fission-AI/OpenSpec/releases/tag/v1.16.0)、固定模板与上述修复 PR，以及本仓两版 CLI／生成 Skill 实跑；核实 **2026-10-31 UTC**。独立只读审查核对数据投影与边界，未独立重跑产品。
