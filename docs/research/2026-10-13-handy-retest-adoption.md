主线：一，兼四
改变的建议：18：局部受益不等于可替换旧功能；保旧平台／设置并核新增权限，接收重建覆盖下游包装
新证据：暂停媒体独立使用、Nix/Darwin修订回执；10-16补两份降音量固定实现的旧平台／设置差异与权限回退；无主动工时

# Handy：用户已经用起来，产品选择仍未定

> 核实时间：2026-10-13；历史日期按 GitHub 原帖记录。
> 读取范围：公开 issue、PR 元数据与讨论、固定提交及源码。未安装、构建或运行 Handy；下述运行结果均为参与者报告，不能称为本仓库独立复现。**[研究：本仓库来源核查]**

## 采用判断

🧪 **适用于已有用户收益但交互方案仍有分歧的功能：限定试用场景，再决定主线行为与支持责任。** 这个案例补上“非作者实际使用修改版”的证据，支持保留暂停媒体方案的试用价值；它不支持直接合并或跨平台默认开启。暂停适合可续播的歌曲/播客，直播/通话则需考虑衰减等替代路径。后者来自参与者提出的场景区分；10-16的[固定实现补核](#体验升级局部补充还是替换旧功能)只确认替换范围与准入成本，不证明 ducking 更可靠。**[社区：使用者反馈；经验：采用判断]**

原用户 apotenza92 在 macOS 26.3、M1 Pro、Handy 0.7.10 上报告 USB 音频接口继续出声，日志却记作已静音，于是把需求改成录音时暂停媒体、结束后恢复，并提交实现。这属于成熟产品的实际使用暴露限制后演化交互方案，不是从零产品验证。[原需求 #998](https://github.com/cjpais/Handy/issues/998) · [PR #1028](https://github.com/cjpais/Handy/pull/1028)。**[社区：原用户／作者自述]**

## 证据与版本边界

1. **需求来源，已确认**：#998 创建于 2026-03-11，提交 PR 的人与提出原问题的人是同一账号 apotenza92。USB 音量/静音能力的解释属于其观察与推测；不要推广成所有 USB 接口均无软件静音。 **[社区：公开原帖，运行结果自报]**
2. **作者修订，不能计作独立测试**：[3 月 19 日](https://github.com/cjpais/Handy/pull/1028#issuecomment-4087870263) 报告修复 macOS 恢复失败、无播放时意外启动、x86 构建问题；[5 月 30 日、5 月 31 日编辑](https://github.com/cjpais/Handy/pull/1028#issuecomment-4582189230) 报告迁至 0.8.3/stable 基础、缩短暂停延迟并改用实际播放速率。Linux 20/20 等数字是作者当时的特定环境结果，不是总体成功率。 **[社区：公开原帖，运行结果自报]**
3. **第一位独立使用者**：[woerndl 的 5 月 29 日评论](https://github.com/cjpais/Handy/pull/1028#issuecomment-4571682483)从初始构建阻塞转为已运行 PR 版，明确 M1 和 USB 扬声器，报告约 500ms 暂停延迟但解决了使用问题，长转录后歌曲/播客从原位置继续；未给 SHA、精确周期数或长期留存数据。不要把他约 500ms 和另一人 0.6s 当成同机前后性能比较。 **[社区：公开原帖，运行结果自报]**
4. **第二位独立使用者**：[newideas99 的 6 月 12 日评论](https://github.com/cjpais/Handy/pull/1028#issuecomment-4686795024)给出 c9c5a7a、macOS 27.0（M 系）、Traktor Kontrol S4 MK2 默认输出、本地 Spotify 及 repeated cycles，报告约 0.6s 暂停、0.3s 恢复；没有周期总数和测量方法。其本人也提交 ducking 方案 #1503，因此“独立”只表示非 #1028 作者，不表示盲测或无利益相关。 **[社区：公开原帖，运行结果自报]**
5. **已核实固定快照**：[c9c5a7a82df0a9bde20e4770e50d9f85c40e77d1](https://github.com/cjpais/Handy/commit/c9c5a7a82df0a9bde20e4770e50d9f85c40e77d1)，提交标题为避免启动已停止的 macOS 媒体；[package.json](https://github.com/cjpais/Handy/blob/c9c5a7a82df0a9bde20e4770e50d9f85c40e77d1/package.json) 版本为 0.8.3。这是 PR 构建快照，不能称为官方 0.8.3 已发布该功能。 **[一手：固定源码；社区：测试者原帖]**
6. **产品取舍与合并技术状态分开**：[维护者 7 月 29 日评论](https://github.com/cjpais/Handy/pull/1028#issuecomment-5112327254)说明十多个相近方案需要作 UX 取舍并权衡新增问题与后续支持，还称自己有约 100 PR 待审、bug 优先，这是当时自述，不是审计或当前数量。本次 #1028 元数据为 open / merged=false / mergeable=false / draft=false，head 为 2fa2a0d5c3ca406b7a2bea8d1394db8ac14b5c5b；技术不可合并状态不能充当产品拒绝的证据。未找到已作出永久拒绝决定的证据。 **[一手：PR 元数据；社区：维护者原帖]**

## 固定快照的真实契约（代码阅读，不是运行结论）

- macOS 先读取 MediaRemote now-playing 的 playback rate（大于 0.01），再发全局 HID play/pause；没有确认正在播放就不发按键。c9c5a7a 的补丁把旧的 is-playing 查询换成播放速率，并增加默认 ignored 的 Music 实机回归测试，防止无播放时反而启动媒体。[固定补丁](https://github.com/cjpais/Handy/commit/c9c5a7a82df0a9bde20e4770e50d9f85c40e77d1) **[一手：固定源码，未运行]**
- 管理层只在记录到自己暂停过且用户开启恢复时恢复，并处理停止早于暂停结果返回的竞态。但 macOS 保存的是 Global 状态，再发全局媒体键；不能据此承诺“精确恢复同一个 app”。Windows 保存一个源 app ID，Linux 保存一个 MPRIS 服务名；这不是暂停所有音源。[状态管理](https://github.com/cjpais/Handy/blob/c9c5a7a82df0a9bde20e4770e50d9f85c40e77d1/src-tauri/src/media_control.rs) · [Windows](https://github.com/cjpais/Handy/blob/c9c5a7a82df0a9bde20e4770e50d9f85c40e77d1/src-tauri/src/media_control_windows.rs) · [Linux](https://github.com/cjpais/Handy/blob/c9c5a7a82df0a9bde20e4770e50d9f85c40e77d1/src-tauri/src/media_control_linux.rs) **[一手：固定源码，未运行]**
- 录音先开始，再异步暂停媒体、播放 Handy 开始提示音；停止时先解除静音，播放停止提示音后恢复。因此不要把“先于开始提示音暂停”写成“确保麦克风开始前已暂停”，或暗示开头绝无漏音。[生命周期接线](https://github.com/cjpais/Handy/blob/c9c5a7a82df0a9bde20e4770e50d9f85c40e77d1/src-tauri/src/actions.rs#L419-L460) **[一手：固定源码，未运行]**
- newideas99 的权限提醒是代码审阅意见：未授予 Accessibility 时，按键可能无效而日志仍记作已暂停；不是该用户已经复现的权限故障。现有成功日志不足以证明播放器确实暂停。[评论原文](https://github.com/cjpais/Handy/pull/1028#issuecomment-4686795024) **[社区：使用者代码审阅意见]**
- 后续 Windows PR [apotenza92/Handy#1](https://github.com/apotenza92/Handy/pull/1) 当前 open、未合并、无后续评论，head 279278d5b914261b7ccc6c4c96c5309ec83b4dc1。目标是暂停全部可暂停会话并按已记录 ID 恢复；作者仅报告 runner 编译与 format 通过、实机测试进行中。#1028 [当前 head 的 Windows 文件](https://github.com/cjpais/Handy/blob/2fa2a0d5c3ca406b7a2bea8d1394db8ac14b5c5b/src-tauri/src/media_control_windows.rs)仍与 c9c5a7a 对应同一 blob 839ad1edc55bfb11dcce9e1c9c08a8a8630540a1，单会话边界仍在。不能把这个后续补丁记成已被独立用户验证解决。 **[一手：固定源码与 PR 元数据；社区：补丁作者自报]**

## 反证、后续与 AI 归因

- [9 月 16 日 M4 Pro 试用](https://github.com/cjpais/Handy/pull/1028#issuecomment-5696370061)仍报告正面效果，但使用者先更新代码、修过冲突，未给出确切 SHA，不能与 c9c5a7a 合并成同一固定版本的测试。**[社区：第三位非作者自报]**
- [10 月 3 日 Windows 反馈](https://github.com/cjpais/Handy/pull/1028#issuecomment-5965508862)指出同时播放 YouTube 与 Spotify 会留下一个来源继续出声；后续补丁的运行测试尚无完成报告。已有单源复测成立，不等于全部媒体场景完成验收。**[社区：Windows 使用者报告；研究：本仓库范围判断]**
- [PR AI 声明](https://github.com/cjpais/Handy/pull/1028)写明 pi coding agent 参与仓库探索、实现辅助、构建调试、跨平台 VM 测试设置和 PR 草拟；[2868f08a9ea58a393d55f0a624fe0c56ef022759](https://github.com/cjpais/Handy/commit/2868f08a9ea58a393d55f0a624fe0c56ef022759)带 Claude Sonnet 4.6 共同署名，修改 macOS 恢复判断与 in-flight 暂停的恢复竞态。工具与模型应分开归因：局部模型署名不能证明使用了 Claude Code，也不能代表全部实现；没有 Codex 参与或模型对照证据。**[社区：作者披露；一手：固定提交]**
- 可迁移的是把实际受益与产品采用分开判断，而不是某模型的效能结论。没有测试总次数、统一计时方法、长期留存或支持工时；两位非作者的报告也不是盲测。**[研究：本仓库分析，基于上述来源]**

## 什么证据会改变判断

若维护者明确选定交互并给出已合并结果，应更新“采用未定”；若固定新版本有多音源、权限缺失或媒体目标切换的实际复测，可缩小当前可靠性缺口；若用户持续使用反馈表明暂停破坏主要场景，应撤回该场景的试用建议。现有证据足以记录局部用户价值，不足以宣称普遍可靠或量化收益。**[经验：复核条件]**


## 体验升级：局部补充还是替换旧功能

核实：2026-10-16（UTC+8）。**采用判断：体验升级要分别回答新场景有没有价值、旧能力有没有保住；未覆盖旧平台和设置迁移时，先保留旧路径、限制新增功能范围。** 以下与暂停 PR 是同一需求族的不同实现，不是同条件效果比较。**[研究：采用判断]**

**完整替换的反例。** [#1414](https://github.com/cjpais/Handy/pull/1414)固定 `d520b1d47417178ee50a5ae4edf0b2fe2883d81f` 的 [audio.rs](https://github.com/cjpais/Handy/blob/d520b1d47417178ee50a5ae4edf0b2fe2883d81f/src-tauri/src/managers/audio.rs)把原静音改成音量比例／渐变；`get_output_volume` 在非 Windows 返回 `None`，`set_output_volume` 不执行，原 macOS／Linux 静音路径已删除。其 [settings.rs](https://github.com/cjpais/Handy/blob/d520b1d47417178ee50a5ae4edf0b2fe2883d81f/src-tauri/src/settings.rs#L402-L409)把 `mute_while_recording` 换成默认 false 的 `reduce_volume_while_recording`；同文件初始化与读取直接反序列化，未见旧键别名或迁移。因此只带旧键的设置不能沿此路径继承开启状态，即使在 Windows 也不能把 UI 重命名当兼容迁移。这是固定源码判断，未运行旧配置导入；PR 的 build／cargo check 测试计划不提供旧平台功能验收。当前 closed、未合并，未取得关闭原因，不推断维护者因上述问题关闭。**[一手：固定源码与元数据；研究：读取推论]**

**局部补充保住的范围与新成本。** [#1503](https://github.com/cjpais/Handy/pull/1503)固定 `ec74527afb01f75eb4bdb7fc4c2f68b884ccbd38` 的 [settings.rs](https://github.com/newideas99/Handy/blob/ec74527afb01f75eb4bdb7fc4c2f68b884ccbd38/src-tauri/src/settings.rs#L402-L411)保留旧开关键，新增 `recording_duck_volume` 缺省为0；[audio.rs](https://github.com/newideas99/Handy/blob/ec74527afb01f75eb4bdb7fc4c2f68b884ccbd38/src-tauri/src/managers/audio.rs#L324-L409)仍保留 Windows／Linux 硬静音路径。不能因此称 macOS 默认行为完全未变：即使音量为0，也先尝试 Core Audio process tap；[启动接线](https://github.com/newideas99/Handy/blob/ec74527afb01f75eb4bdb7fc4c2f68b884ccbd38/src-tauri/src/commands/mod.rs)在旧静音开关开启时请求系统音频录制权限，并新增 [Swift 构建桥接](https://github.com/newideas99/Handy/blob/ec74527afb01f75eb4bdb7fc4c2f68b884ccbd38/src-tauri/build.rs)。保住旧设置不等于保住旧权限前提。**[一手：固定源码；研究：范围判断]**

**回退存在，不代表拒绝权限后效果相同。** [tap 检查与回退](https://github.com/newideas99/Handy/blob/ec74527afb01f75eb4bdb7fc4c2f68b884ccbd38/src-tauri/src/managers/audio.rs#L107-L285)在不支持、启动失败或300ms未观察到信号时转 AppleScript；无信号也可能是没有播放，不能等同识别了权限拒绝。逐应用分支只在无法解析系统输出音量时进入，系统设置命令失败并非总会继续该分支；浏览器脚本缺对应权限时可静默跳过。恢复会尝试还原保存的值，但调用结果未逐一确认。读者需把新增权限、原生构建与目标设备回退作为选择条件，不因“有 fallback”就承诺可用；本记录不建议开启音频捕获或浏览器脚本权限。作者报告 macOS 26／Apple Silicon、Traktor USB接口及常规输出试用，Intel仅编译设计；未获得该方案的独立使用回执，目前 open、未合并。**[一手：固定源码；社区：作者测试自报]**

**接收方的反证。** 较早的 [#547](https://github.com/cjpais/Handy/pull/547#issuecomment-3908954452)因维护者不愿承担静音退化风险而关闭，要求三平台验证后再考虑合并；这不能嫁接为 #1414 的关闭原因。[#1503维护者](https://github.com/cjpais/Handy/pull/1503#issuecomment-4687579676)另指出重复方案占用审查时间，需清楚说明差异；[作者补查后](https://github.com/cjpais/Handy/pull/1503#issuecomment-4686791007)提供竞品PR比较、暂停版真机自报，并表示可缩为仅补USB接口的tap层。这支持先证明新增职责、再决定完整替换，不证明缩小后已被接收。**[社区：维护者与作者原帖]**

**归因与停止条件。** #1503明确披露 Claude Code参与大部分代码，作者定义行为、真机测试和审阅；#547作者承认AI辅助，#1414所读描述未交代AI身份。不得把平台缺口统一算作AI产出或比较模型能力。暂停对可续播媒体仍有前文非作者证据；没有同条件回退、目标切换和旧设置复测，不给暂停／ducking可靠性排名。当前到固定实现范围即止；只有修订版补回旧路径／迁移或出现独立接收回执才重开，未安装、构建或运行应用，不计算支持工时。**[社区：作者披露；研究：范围与复核条件]**

## 接收方重建：上游修复还要穿过下游包装

核实：2026-10-16（UTC+8）。**采用判断：接收方从源码重建时，交付物是源码、包装配置和仍需保留的下游补丁的组合。** 先复用接收方现有构建／验收入口，修复后重建这组实际输入；不要只交上游补丁，也不要把一次构建的概述改写成另一验收工具已运行。以下与上文暂停媒体功能是不同维护链，不补足其 Windows 多源复测。只读公开原帖与固定源码，未安装、构建或运行 Handy／Nix。**[研究：采用建议与范围]**

**原接收者遇到的不是单纯缺包。** Nix 打包维护者 philocalyst [报告 Darwin 产物没有正常 Rust 入口、启动无行为](https://github.com/NixOS/nixpkgs/pull/507754#issuecomment-4207777444)。xilec 的 [Handy #1316](https://github.com/cjpais/Handy/pull/1316)将问题定位到 Swift 单文件脚本模式生成 `_main`，在其 Nix 链接环境中盖过 Rust 入口；[固定初始修复 1a683fb](https://github.com/cjpais/Handy/commit/1a683fb4fe59b9e4192c2f330e023dce5a43b699)添加 `-parse-as-library`。PR 的四变体诊断和启动观察是贡献者报告：修订后进入 GUI 事件循环直至测试超时，不是完整语音转录验收；Xcode 路径不能代替 Nix 路径。AI 使用只按该 PR 披露归于调查、注释及 CI 分析，不推断整个打包过程由同一模型完成。**[一手：固定补丁；社区：参与者诊断与运行报告]**

**同一接收者在拿到修复后仍不能重建。** [包装提交 d4eecf0](https://github.com/philocalyst/nixpkgs/commit/d4eecf0c6eecbea221b23f08ca9820ef7d553bfe)明确把源码固定到上述 `1a683fb`；philocalyst 随即[报告旧 `use-nix-swift.patch` 的第三个 hunk 失败](https://github.com/philocalyst/nixpkgs/pull/1#issuecomment-4285794228)。[7da3037 固定 diff](https://github.com/philocalyst/nixpkgs/commit/7da3037ec9751a7903b8ad12e61566dac4d7f2ec)仅刷新补丁头与匹配上下文，保留 `SDKROOT`／`SWIFTC` 及直接调用编译器的适配；不是撤回 `-parse-as-library`。贡献者[要求重试](https://github.com/philocalyst/nixpkgs/pull/1#issuecomment-4285830300)后，原接收者[确认可用](https://github.com/philocalyst/nixpkgs/pull/1#issuecomment-4289836726)，并在[上游再次确认解决 Nix/Darwin 打包问题](https://github.com/cjpais/Handy/pull/1316#issuecomment-4289834836)。回执没有独立贴出受测 SHA，因此绑定来自同线程修订／重试顺序，不能冒充完整可重放日志。**[一手：源码固定关系与补丁；社区：原接收者失败／成功回执]**

**接管投入是具体动作，仍不是工时。** 另一接收者 totoroot 在 `aarch64-darwin` [说明自己除一行修复外，还补了工具链变量与绕过 `xcrun` 的调用](https://github.com/NixOS/nixpkgs/pull/507754#issuecomment-4318585450)，并披露 LLM 辅助；其[后续回执](https://github.com/cjpais/Handy/pull/1316#issuecomment-4321666513)确认产出 app／命令行入口、检查 `onnxruntime` rpath 且在使用，但未测普通 Xcode/Bun 或 Intel Mac。后来他[改用 PR 包装而非自己的临时包](https://github.com/NixOS/nixpkgs/pull/507754#issuecomment-4366576030)。这些是适配、重建与切换到共享包装的主动投入，不含计时，不能据评论间隔计算支持成本，也不能从“可用”补写语音质量或快捷键全覆盖。**[社区：非上游补丁作者的实际操作自报]**

**反证与后续：先前成功不覆盖最新组合。** 同一 totoroot 后来用 `nix build .#handy -L --no-link` [重建失败](https://github.com/NixOS/nixpkgs/pull/507754#issuecomment-4545405929)，缺的是可调用的 `swiftc`；维护者[承认最终建议尚未推送](https://github.com/NixOS/nixpkgs/pull/507754#issuecomment-4545763685)。最终[固定包装 10d9c53](https://github.com/philocalyst/nixpkgs/blob/10d9c5372a0a29b50ff19d9776af4ee93795c6ec/pkgs/by-name/ha/handy/package.nix)显式设置 `SWIFTC`，保留 Darwin 的运行库 rpath，并把 `x86_64-darwin` 列入 `badPlatforms`。这不证明未测试平台也可用。**[社区：后续失败；一手：固定源码]**

接收方要求 `nixpkgs-review` 后，totoroot 的首份概述遭维护者质疑；其[澄清先前只是直接构建，现已手工运行指定工具](https://github.com/NixOS/nixpkgs/pull/507754#issuecomment-4586931332)，[更正报告](https://github.com/NixOS/nixpkgs/pull/507754#issuecomment-4586916819)给出命令 `nixpkgs-review pr 507754`、提交 `10d9c5372a0a29b50ff19d9776af4ee93795c6ec` 和 `aarch64-darwin` 构建成功。它支持该版构建回执，不补作该版完整业务测试。xilec 对[同一 SHA 的 NixOS x86_64-linux](https://github.com/NixOS/nixpkgs/pull/507754#issuecomment-4580338557)另有具体构建命令、GPU 枚举与端到端转录自报，但贡献者自报不能嫁接为 Darwin 结果。这里的修正是运行身份，不宜据此断言早先实际构建从未发生。**[社区：报告纠正与分平台运行自报；研究：证据边界]**

**最小交付与停止条件。** 在已有 PR／包装说明中固定源码版本、下游适配和接收入口，交代哪些补丁仍承担独立职责；上游修复改变上下文时重验补丁应用、构建和必要任务，能沿用接收方自动化就不另造报告流程。若接收方只需要官方二进制，不要求其承担源码包装；已有必要路径验收充分时不增加全平台矩阵。本链没有精确主动工时、Darwin 最终版本的转录细项或长期维护收益，也不证明 AI 提效。**[研究：条件建议]**
