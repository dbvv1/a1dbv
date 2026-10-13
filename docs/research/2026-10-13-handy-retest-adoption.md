主线：一，兼四
改变的建议：18：实际局部受益与主线采用分开；限定暂停/直播等场景再决定支持责任
新证据：两位非作者运行PR版，其中一位固定SHA/设备/播放器/repeated cycles，后续Windows多源失败及未完补丁；无标准计时/跨平台可靠性或合并决定

# Handy：用户已经用起来，产品选择仍未定

> 核实时间：2026-10-13；历史日期按 GitHub 原帖记录。
> 读取范围：公开 issue、PR 元数据与讨论、固定提交及源码。未安装、构建或运行 Handy；下述运行结果均为参与者报告，不能称为本仓库独立复现。**[研究：本仓库来源核查]**

## 采用判断

🧪 **适用于已有用户收益但交互方案仍有分歧的功能：限定试用场景，再决定主线行为与支持责任。** 这个案例补上“非作者实际使用修改版”的证据，支持保留暂停媒体方案的试用价值；它不支持直接合并或跨平台默认开启。暂停适合可续播的歌曲/播客，直播/通话则需考虑衰减等替代路径。后者来自参与者提出的场景区分，本次未审计 ducking 方案 [#1503](https://github.com/cjpais/Handy/pull/1503) 的实现。**[社区：使用者反馈；经验：采用判断]**

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
