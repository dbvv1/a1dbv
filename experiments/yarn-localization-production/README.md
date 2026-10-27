# Yarn 本地化：作者源到真实 Compiler／VM，再改一版

**先用 Yarn 原生编译与执行，云端只补作者数据和译文接缝。** 本例沿[客户端本地化](../../domains/game-dev/04-client-modules.md#增加语言与推进对白)的舱门六句对白，加入一个数值插值，实际编译中文源、导出完整 lineID／说话人／语境、接英文译文，并由官方 `Dialogue` VM 派发行与替换值。不是遍历表冒充播放，也没有自造 VM／假 Unity Provider。

## 运行与输入

需要 .NET SDK 8；依赖固定 NuGet `YarnSpinner`／`YarnSpinner.Compiler` 3.2.2，首次 restore 从官方 NuGet 获取，之后可离线运行。包和传递依赖锁在 `packages.lock.json`，不下载引擎或创建服务。

```bash
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export DOTNET_GENERATE_ASPNET_CERTIFICATE=false
cd experiments/yarn-localization-production
dotnet restore --locked-mode
dotnet run --no-restore
```

容器的主目录不可写时，把 `DOTNET_CLI_HOME`、`NUGET_PACKAGES`、`XDG_DATA_HOME` 与 `XDG_RUNTIME_DIR` 指到自有可写目录；后者权限 0700。临时目录也放自有磁盘目录。不要伪造 restore 成功标记或忽略编译错误；这些环境修正不需改系统账户／权限。

- `content/base.yarn`：唯一基线对白源，显式 `#line:`、作者前缀、`#context:` 与 `$need`；`speakers.json` 将作者代号映射为稳定角色 ID 和两语言显示名。
- `base.en.json`：正文式译文（不带说话人前缀）＋对应作者快照签名。`revised.yarn` 和 `revised.en.json` 是同内容第二版的固定测试材料，不是需要维护的两份正式作者源。
- `Program.cs`：`Compiler.Compile` 取得真正 StringTable／Program；原生 `LineParser` 识别角色前缀；运行 `Dialogue.SetProgram/SetNode/Continue`，`LineHandler` 按实际 `line.ID` 查表，`ExpandSubstitutions` 用 VM 的 `line.Substitutions`。文字与说话人最后在同一输出行汇合。
- `choices.yarn`／`choices.en.json`：同一导出与本地化消费者的选项材料；条件控制舱门／楼梯资格，VM 分支写入 `$route`。译表签名仍只是合成测试约定。

本例的 JSON／`reviewedSource` 是项目级预检格式，**不是 Yarn 官方 CSV／Unity String Table 文件，不能直接拖入 Unity**。已有 Unity 工程继续用 Yarn Project 的 Export Strings and Metadata／Update Existing Strings Files，或既有 Unity Localization 导入器；不为采用本实验换掉它们。正文式译文＋sidecar 只用于需要独立人物 UI 的路线，保留原生译文里的角色标记也可以。

## 输出与第二次修改

命令成功后输出真实 VM 的七行英文，并在 ignored `.work/` 留 `author-export.json`、`review-queue.json`、`zh-Hans.json`、`en.json`。第一版六句中英文使用同一组完整 `line:hangar_02_...` ID；第二句的 `{0}` 来自编译器，实际替换值 `2` 来自 VM。

| 第二版改动 | 必须重新审什么 | 未变内容 |
|---|---|---|
| 020 零件改保险丝 | 文本含义与对应英文 | ID 与数值来源仍保留 |
| 040 句子相同、Mechanic 改 Navigator | 说话人／口吻与人物 UI | 不能因句子没变就当旧审核有效 |
| 050 句子相同、紧急变冷静指令 | 语境／语气 | 不必把其他所有句子重译 |
| 新增 070 | 新译文和人物引用 | 010／030／060 的旧译文继续有效 |

旧英文表送入第二版会先被拒绝，更新的固定英文表才进入 VM。`reviewedSource` 是“译文针对哪一作者版本”的快照，不是翻译质量分数；测试材料中的快照是演示约定，不是声称真人已审过。不能让 AI 修改一句后自动重算签名就宣称审校完成。当前签名覆盖该行作者表达、角色、语境及所属节点；行外剧情／变量语义变化仍需项目的人为影响判断。

<a id="choice-identity"></a>
## 选项：翻译和排序改展示，提交保原身份

**Unity 项目先沿官方 OptionsPresenter／OptionItem；自定义核心消费者才借本例 `SelectAvailable`。** `Option.Line.ID` 用来找译文，`Option.ID` 用来选择当前选项组中的分支，两者不能互换；后者也不是可跨组、跨会话保存的剧情 ID。`Localize` 对普通行和选项使用同一真实 VM 的行 ID／替换值，`ShownOption` 只保原 ID、资格和本地化显示，不解释剧情。

`PlayChoices` 取得当前 `OptionSet` 后隐藏不可选项或重排展示；选择时把所选行保留的原 ID 交给 `SelectAvailable`，后者在**本组选项**里查 ID 并检查 `IsAvailable`，再调用 `SetSelectedOption`。不要将按钮序号、译文或数组重排后的下标直接提交。固定核心会派发不可用项；它的 `SetSelectedOption` 检查等待状态和 ID 范围，但不替自定义 UI 拦下不可用项，这是调用契约，不是新发现的框架漏洞。

| 真实 Compiler／VM 路径 | 观察到的分支 |
|---|---|
| 舱门 ID 0 不可用，楼梯 ID 1 可用；隐藏舱门后误送首按钮下标 0 | 显示的是 `line:route_stairs`，实际进入舱门分支，`$route=hatch` |
| 同一材料，提交显示行保留的 ID 1 | 实际进入楼梯分支，`$route=stairs` |
| 中文／英文、隐藏／保留禁用项、两项都可用时倒序显示 | 选原 ID 后均进入对应分支；舱门选项的数字 `2` 来自 VM，人物显示名仍来自 sidecar |
| 选择未知 ID 或不可用的 ID 0 | 项目消费者拒绝，原 VM 仍等待；随后合法 ID 1 可正常完成，不执行舱门分支 |
| 两项都不可用 | 本例显式提交 `Dialogue.NoOptionSelected`，不选择默认第 0 项；执行选项组后续行，`$route` 保持 `none` |

没有可用选项时采用“跳过本组继续”是本例政策，对应 Unity Runner 的 `allowOptionFallthrough` 路线；需要玩家补条件再回来时另定剧情，不用静默选中锁定路线。资格是本组选项派发时的值，不代表后来变化的库存或联网权限；玩法命令仍由原规则执行器复核。

依据：[核心 Option／ID／资格定义](https://github.com/YarnSpinnerTool/YarnSpinner/blob/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305/YarnSpinner/Dialogue.cs)、[原 VM 的派发与选择](https://github.com/YarnSpinnerTool/YarnSpinner/blob/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305/YarnSpinner/VirtualMachine.cs)；Unity v3.2.8 的 [OptionsPresenter](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/OptionsPresenter.cs)保留原选项，[OptionItem](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/OptionItem.cs)控制可交互并在提交时检查，[DialogueRunner](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/DialogueRunner/DialogueRunner.cs)最终提交 `DialogueOptionID`。核心与 Unity 插件均为 MIT；此处只借其职责，不复制一套 Presenter。

## 实际检查与范围

2026-10-26 在 .NET SDK 8.0.427／runtime 8.0.33 运行：六组检查通过，无 skip，包括真实双语派发、二改拒旧／接新、缺译／漏占位符、未知说话人、重复／隐式 ID、缺作者文件。错误退出非零；成功输出包含 `We need 2 fuses to open the hatch.`，040 的实际消费者显示 `Navigator: Too late.`。

2026-10-27 沿同一锁文件与 .NET 环境运行 **11 组检查通过，无 skip**：原六组加选项错 ID 反例／正确选择、双语过滤与重排、未知／不可用选择、无可用项继续、缺选项译文／占位符。结果同时核原生 VM 写入的 `$route` 与派发的分支结果行，不只看 UI 标志。选择由同步测试回调提供，没有实际按钮操作；异步 UI 的取消、迟到点击与新一组选项交接未验证。

官方编译表**保留** `Navigator:` 前缀，`LineParser` 能读出 `character`；是本例正文式导出主动把它分到 sidecar，不是 Yarn 自动丢人物。默认 Yarn `OptionsHandler` 即便无线性分支也必须配置；原线性材料遇意外选项仍报错，新增材料只处理约定的一组选项，玩法命令仍明确报错。

未运行 Unity 的 String Table 导入、DialogueRunner、字幕布局、头像、语音、输入推进，也未评估译文风格／阅读时长。没有新建翻译平台或 TMS。本例只覆盖线性行、一组条件选项、显式行 ID、普通插值与两个人物；shadow lines、复杂复数／富文本与更多语言须沿官方实现扩对应输入与验收，不据此宣称全语言支持。

依据：[官方本地化和 CSV](https://docs.yarnspinner.dev/yarn-spinner-for-unity/assets-and-localization/inbuilt-localisation)、[NuGet 3.2.2](https://www.nuget.org/packages/YarnSpinner.Compiler/3.2.2)、[固定核心源码 `5b3a4ff`](https://github.com/YarnSpinnerTool/YarnSpinner/tree/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305)与 MIT 许可；编译器／核心版本与正文沿用的 Unity 插件 3.2.8 不是一个版本号，不把本次核心运行当 Unity 插件已验。
