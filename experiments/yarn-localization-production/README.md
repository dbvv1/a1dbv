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

## 实际检查与范围

2026-10-26 在 .NET SDK 8.0.427／runtime 8.0.33 运行：六组检查通过，无 skip，包括真实双语派发、二改拒旧／接新、缺译／漏占位符、未知说话人、重复／隐式 ID、缺作者文件。错误退出非零；成功输出包含 `We need 2 fuses to open the hatch.`，040 的实际消费者显示 `Navigator: Too late.`。

官方编译表**保留** `Navigator:` 前缀，`LineParser` 能读出 `character`；是本例正文式导出主动把它分到 sidecar，不是 Yarn 自动丢人物。默认 Yarn `OptionsHandler` 即便无线性分支也必须配置，示例对意外选项／玩法命令明确报错，不悄悄跳过。

未运行 Unity 的 String Table 导入、DialogueRunner、字幕布局、头像、语音、输入推进，也未评估译文风格／阅读时长。没有新建翻译平台或 TMS。本例有意只覆盖线性、显式行 ID、普通插值与两个人物；shadow lines、分支选项、复杂复数／富文本与更多语言须沿官方实现扩对应输入与验收，不据此宣称全语言支持。

依据：[官方本地化和 CSV](https://docs.yarnspinner.dev/yarn-spinner-for-unity/assets-and-localization/inbuilt-localisation)、[NuGet 3.2.2](https://www.nuget.org/packages/YarnSpinner.Compiler/3.2.2)、[固定核心源码 `5b3a4ff`](https://github.com/YarnSpinnerTool/YarnSpinner/tree/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305)与 MIT 许可；编译器／核心版本与正文沿用的 Unity 插件 3.2.8 不是一个版本号，不把本次核心运行当 Unity 插件已验。
