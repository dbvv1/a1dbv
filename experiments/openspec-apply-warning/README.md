# OpenSpec 的 ready、warnings 与 validate 并不等价

本页先保留 10 月 31 日的 apply 试验；11 月 2 日的[自定义 artifact 归档对照](#自定义-artifact归档先区分生成-skill-和原生-cli)给出一个无需等待未合修复的窄入口。

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

上述 10 月 31 日试验只接收云端 CLI 与生成文本证据：未验模型行为、归档／同步、应用实现、原报告的 macOS 环境或第二名本机读者。它不新增默认配置、操作指南或答案页验收，也不推翻[已有两轮规格接续试验](../../docs/research/2026-10-22-frontier-trials.md#openspec规格接力与协作落点)的不同范围。

**依据与核实**：[使用者原报告](https://github.com/Fission-AI/OpenSpec/issues/2166)、[1.14.3 发布](https://github.com/Fission-AI/OpenSpec/releases/tag/v1.14.3)、[1.16.0 发布](https://github.com/Fission-AI/OpenSpec/releases/tag/v1.16.0)、固定模板与上述修复 PR，以及本仓两版 CLI／生成 Skill 实跑；核实 **2026-10-31 UTC**。独立只读审查核对数据投影与边界，未独立重跑产品。

## 自定义 artifact：归档先区分生成 Skill 和原生 CLI

**🧪 对本次标准 `specs/<capability>/spec.md`、单个 `ADDED` requirement 的夹具，现有原生 CLI 已能完成同步归档，不必先换成未合入的 Skill 修复。** 问题发生在生成工作流把 artifact ID 写死为 `specs`：合法 schema 可以把它命名为 `delta-specs`，输出仍在 `specs/` 下。不要把“Skill 找不到”理解成“没有 delta”，也不要用 `--skip-specs` 绕过本应同步的行为变化。

接收输入是使用者 [#2163](https://github.com/Fission-AI/OpenSpec/issues/2163) 与已有 [#2168](https://github.com/Fission-AI/OpenSpec/pull/2168)，没有另写同题修复。本轮固定主干 `27c05157…`（源码版本 1.16.0），把该 PR 的固定 head `8b9bb130…` 原始 8 文件差量接到主干；候选 tree 为 `703a892e…`，**它是本地树，不是上游已发布提交**。两边分别构建并生成项目内 Skill。

### 同一任务的三条实际路径

公开最小输入有一个合法的 `delta-specs` artifact、已有 `user-auth` 主规格和待加的 Logout；配置规则要求保留原场景并使用 `SHALL`。任务勾选仅表示夹具准备完成，不表示登录程序已实现。两名独立云端 Agent 各只读自己项目的完整生成工作流，得到相同的同步授权；第三份副本直接调用主干 CLI。

| 路径 | 实际结果 | 文件验收 |
|---|---|---|
| 主干生成 archive／sync Skill → 独立 Agent | 发现 ID 与指南冲突，安全停止；4 次 CLI 都 exit 0 | 26 个输入文件 hash 全部不变，change 仍 active；**没有观察到数据丢失** |
| 主干接入 #2168 → 另一名独立 Agent | 读取 `instructions delta-specs` 的 rules，完成同步与归档 | Logout 已加入，原标题、Purpose、要求和场景保留；5 个归档文件与原件 hash 相同；validate 1/1，active 空 |
| 未改主干 → 原生 `archive add-logout --yes` | exit 0，报告 `+ 1 added`；随后 validate 1/1、active 空 | 与第一行完全相同的 26 文件输入；同步与上述保存不变量都通过 |

候选与主干的输入只差 4 份生成的 archive／sync Skill 和命令文件，schema、规划正文、原规格完全一致。候选 Agent 实际做了文件编辑和移动，不只是返回建议；负责人另外逐文件读回。它使用的归档日期为 `2026-11-02`，原生 CLI 按宿主本地日生成 `2026-11-01`：**验收实际返回的路径，不由 UTC 日志时间猜目录**。

### 可复用的窄接收步骤

先在隔离副本核本项目的真实变更，再决定走哪条入口。本例的可重复检查顺序是：

```sh
openspec status --change add-logout --json
openspec validate add-logout
# 读实际 artifact ID、existingOutputPaths、delta 和对应主规格；确认任务确实完成。
openspec archive add-logout
# 保留交互确认；本次一次性夹具实跑用了 --yes，不据此推广无人值守跳过确认。
openspec validate --specs
openspec list --json
```

归档前留存主规格和 change 文件；归档后检查新要求真正进入主规格、原内容保留、change 原件完整进入实际 archive 路径、active 中不再有它。`exit 0` 和 validate 通过不能替代这些文件检查。若生成 Skill 的 artifact 查找与 status 冲突，先保留现场；本例可独立验证原生 CLI，不要求改 schema ID 迎合旧提示。若要接收 #2168，另核实际 ID 的 rules 是否被读取，并复验同样的不变量。

**该步骤只复用了本轮的简单 ADDED delta 路径。** 本轮是固定源码构建，不是再测 npm 安装包；复杂 `MODIFIED`／重命名、`notes.md`、混合 schema 或保留 ID 未验，不能把这次成功泛化为所有 Agent 同步或 CLI 合并都可靠。没有安装到真实用户的 Skill 目录，也未验证 Claude Code／OpenCode 宿主发现、macOS／Windows 或真实业务交付；长程答案页的读者状态不变。

### 候选测试并非全绿

候选 build、TypeScript、`eslint src/` 和模板 parity **38/38** 通过；完整 Vitest 为 **6790 passed / 19 failed**。未修改的主干另跑同样受影响的 5 文件，分两次为 **55/9、15/10**，19 个失败名称完全相同；这只是受影响文件对照，**不是主干全套通过，也不把候选的 19 失败扣除后称全绿**。第一次命令有两条误列的测试路径，只实际匹配 3 文件，随后补跑正确的另 2 文件。

日志与源码指向本环境临时目录祖先的 `.git` 目录检测：Git 本身不认它是仓库，fallback 却按目录存在判定，store setup 及后续检查受阻。本轮没有改动该只读宿主目录。要完成全套门禁，需有合适临时目录条件再验；hosted CI 未验证，PR 仍 open／未合入。此候选也不包含另一条 `notes.md` 修复 #2174。

[archive-results.json](archive-results.json) 保留三组实际 CLI 参数、UTC 起点、退出码与 stdout／stderr、夹具正文、生成文件和前后文件 hash、固定源码身份与 19 个失败名称。公开投影仅归一绝对目录；安装／构建／全套日志与完整生成文件另在本轮证据包保全，不把 JSON 称为全部执行日志。非作者核对了原 PR 差量与本轮证据；两个 Agent 消费者各一次，仅是这份公共问题夹具的实际任务，不是通用效果指标或答案页新读者验收。

**依据与核实**：上述使用者 issue／作者 PR、[固定 archive 模板](https://github.com/Fission-AI/OpenSpec/blob/27c0515724decc633818c735ee596481eec78a8b/src/core/templates/workflows/archive-change.ts)、[原生 archive 实现](https://github.com/Fission-AI/OpenSpec/blob/27c0515724decc633818c735ee596481eec78a8b/src/core/archive.ts)、[投稿政策](https://github.com/Fission-AI/OpenSpec/blob/27c0515724decc633818c735ee596481eec78a8b/CONTRIBUTING.md)与本轮云端实跑；核实 **2026-11-02 UTC**。本次只接收已有候选与验证既有入口，不向上游提交源码、评论或 PR，不改变本仓默认做法。
