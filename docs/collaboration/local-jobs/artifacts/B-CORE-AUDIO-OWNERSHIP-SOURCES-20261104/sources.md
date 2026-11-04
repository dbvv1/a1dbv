# 声音实例的停止与回调所有权：来源清单（采集单元 1）

> 读取与核实截止：2026-11-04（UTC）。本单元只整理已收集并核过链接的候选，不新增未核实的链接；未运行音频设备、未试听、未改音频源或默认混音。

## 决定与筛选

**要回答的决定：** 关键事件在暂停、替换和退出时，怎样既不重播旧事件，也不让旧的结束回调停掉或释放新声音。只对照六类边界：同渲染帧多 tick、同源不同实例、pause／stop／loop-end／fade-cancel、替换后旧回调、退出再进入。

**筛选标准，按优先级：**

1. 能落到 MOBA 责任链的一层：事件（事件键／去重／幂等）→ 调度（排程／取消／暂停／退出）→ 实例（句柄／ID／generation／session）→ 清理（释放／回池／销毁）。
2. 给出可核原文：规范、引擎或中间件契约、固定源码、issue／PR、作者复盘。搜索摘要只降级保留并标注，不当作机制证据。
3. 至少覆盖一类边界，并能改写成可执行断言。
4. 只收运行时播放生命周期；素材、DAW、混音教程和纯行业动态不进主表。

**证据面。** 本清单引用 493 个唯一链接（495 条带链接条目），按主语义归类、跨渠道只计一次。规范、固定源码和能打开的 issue 默认读到正文；官方文档里 fmod.com/docs、audiokinetic、dev.epicgames.com 多为 SPA 或 403，相关结论改由 Q&A、论坛或摘要支撑，逐条标了“摘要”。英文来源覆盖 2014–2026，条目按原文日期，不把旧讨论写成近期结论。

## 先读这八项

1. **GF Framework（Godot）的“句柄＋playback session”契约与源码。** [句柄文档](https://gf-framework.readthedocs.io/zh-cn/latest/standard/utilities/runtime/audio/mounting-spatial-handles/)、[BGM 控制](https://gf-framework.readthedocs.io/zh-cn/latest/standard/utilities/runtime/audio/playback/bgm-control/)、[SFX 与片段](https://gf-framework.readthedocs.io/zh-cn/latest/standard/utilities/runtime/audio/playback/sfx-clips/)、[`_on_sfx_finished` 源码](https://github.com/C76GN/gf-framework/blob/main/addons/gf/standard/utilities/audio/gf_audio_utility.gd#L13706-L13718)。这是本清单里把四层写得最完整的实现：句柄同时绑定 channel generation 与 playback session；通道被替换后旧句柄的 stop／fade 一律 no-op；池化播放器进入终态时显式断开 finished；`_on_sfx_finished` 先比对捕获的 `playback_session_id`，源码注释写明“避免旧完成信号回收已复用实例”。Apache-2.0、2026-10 仍活跃，可直接照着写测试。
2. **CNA／SDL3 的 generation＋deferred free＋callback barrier 手册与销毁夹具。** [shutdown 手册](https://libcna.com/development/handbook/debug-shutdown-and-lifetime.html)、[音频引擎内部](https://libcna.com/development/internals/audio/engine.html)、[动态 voice 销毁夹具](https://github.com/libcna/cna/blob/3b43bd8687ed46523d873f9bec4b32bd8481dcb5/tools/audio/mixer_destroy_active_dynamic_voice_harness.cpp)、[静态 voice 销毁夹具](https://github.com/libcna/cna/blob/3b43bd8687ed46523d873f9bec4b32bd8481dcb5/tools/audio/mixer_destroy_active_static_voice_harness.cpp)。它给出退出路径的三条硬规则：停止／销毁前 bump generation 让旧指针“已消失”；在自身 stopped 回调里销毁的对象进 deferred free；Stop 必须等 in-flight 回调结束。两个夹具是现成的“退出时旧回调不得触碰已释放 voice”断言样本。
3. **Phaser 的旧 `onended` 杀死新播放：源码、issue、修复 commit 齐全。** [WebAudioSound v3.80.1](https://github.com/phaserjs/phaser/blob/v3.80.1/src/sound/webaudio/WebAudioSound.js)、[issue #6657](https://github.com/phaserjs/phaser/issues/6657)、[commit 2dfd421](https://github.com/phaserjs/phaser/commit/2dfd421495c4fafdf385ddc7fd9a001ccafdbfc0)、[v3.80 changelog](https://github.com/phaserjs/phaser/blob/v3.80.1/changelog/3.80/CHANGELOG-v3.80.md)。`onended` 用 `ev.target === _this.source` 判断回调是否属于当前节点，`stopAndRemoveBufferSource` 先置空 source 再 stop，迟到的旧节点 ended 不会命中新播放；#6657 记录的“结束后立刻重播，下一 update 仍看到 hasEnded 又把新播放停掉”与 commit 里的 `hasEnded` 重置，正好是本卡要防的两面。
4. **W3C Web Audio 规范与规范 issue：`ended` 的语义边界。** [规范 AudioScheduledSourceNode](https://www.w3.org/TR/webaudio/#AudioScheduledSourceNode)、[Dynamic Lifetime](https://webaudio.github.io/web-audio-api/#lifetime-1)、[#2451](https://github.com/WebAudio/web-audio-api/issues/2451)、[#2406](https://github.com/WebAudio/web-audio-api/issues/2406)、[#1828](https://github.com/WebAudio/web-audio-api/issues/1828)、[#414](https://github.com/WebAudio/web-audio-api/issues/414)、[#513](https://github.com/WebAudio/web-audio-api/issues/513)。规范写明 `stop()` 也派发 `ended`（包括 stop 早于 start、从未发声），事件不带结束原因；已排定的 stop 不能取消，只能 stop(1e300) 覆盖；想在未来采样级关闭 loop 也做不到。它决定了测试能断言什么、不能断言什么：不能把 `onended` 当“自然播完”，也不能把“取消排程”写成精确到采样。
5. **Godot 的相反官方取舍：`finished` 只在无中断播完时发出。** [类文档](https://docs.godotengine.org/en/4.5/classes/class_audiostreamplayer.html)、[PR #33602](https://github.com/godotengine/godot/pull/33602)、[internal.cpp @4.5-stable](https://github.com/godotengine/godot/blob/4.5-stable/scene/audio/audio_stream_player_internal.cpp)、[AudioStreamPlaybackPolyphonic](https://docs.godotengine.org/en/stable/classes/class_audiostreamplaybackpolyphonic.html)。官方明确 stop() 或退出场景树不发 `finished`，并拒绝新增 `stopped` 信号，理由是“调用 stop 的直接结果不需要事件”；`stop_basic()` 直接清空 playbacks，polyphony 强停也不发。多流播放另有 `int` ID 与 `INVALID_ID=-1`。这条分支适合与 Web Audio 对照：一个把停止当结束，一个不当。
6. **Unreal 的引擎级反例：`OnAudioFinished` 在 Stop 时也调用。** [FOnAudioFinished 5.0](https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/OnAudioFinished?application_version=5.0)、[5.5](https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/OnAudioFinished?application_version=5.5)、[MetaSound 池化竞态](https://forums.unrealengine.com/t/meta-sounds-not-receiving-parameters-updates-with-pooling-system-enabled/2733791)、[UE-363230](https://issues.unrealengine.com/issue/UE-363230)。官方契约把“完成”和“被停止”合并到同一委托，绑定完成逻辑的项目无法区分；池化复用后 `AudioComponentID` 自增、旧 generator 的 DataChannel 断开；回收的 audio component 也不会转发 `SetOnAudioFinished`（UE-363230，Target Fix 5.8）。它说明引擎层同样存在“旧组件身份＋完成委托”错位。
7. **FMOD Q&A 的实例身份与回调时序簇。** [13531](https://qa.fmod.com/t/distinguishing-fmod-studio-event-callback-stopped-callbacks/13531)、[11223](https://qa.fmod.com/t/callback-problem-stopping-stopped-event/11223)、[19760](https://qa.fmod.com/t/know-when-an-eventinstance-has-been-released/19760)、[17852](https://qa.fmod.com/t/instances-not-releasing-properly-when-using-allowfadeout/17852)、[23277](https://qa.fmod.com/t/do-unreal-fmod-components-release-themselves-when-finished-playing/23277)、[21863](https://qa.fmod.com/t/err-invalid-handle-at-eventinstance-stop/21863)、[10765](https://qa.fmod.com/t/eventinstance-stop-crashes-with-callback/10765)、[23471](https://qa.fmod.com/t/studioeventemitter-play-stop-issue-when-repeatedly-called-during-the-same-frame/23471)。官方承认 STOPPED 不携带原因；对已停实例再 stop 仍触发 STOPPED，且可能先于 STARTED 到达；实例只有完全停止后才能 release，暂停会阻塞释放；同帧 Play→Stop→Play 会让第二次 Play 落到已失效实例。这组直接对应“替换后旧回调”和“同帧多动作”。
8. **howler.js 的组级回调与结束计时器缺口。** [core @003b917](https://github.com/goldfire/howler.js/blob/003b917c40cb41cf382ba47ae0ed7a35ca2abe76/src/howler.core.js)、[#1695](https://github.com/goldfire/howler.js/issues/1695)、[#580](https://github.com/goldfire/howler.js/issues/580)、[#509](https://github.com/goldfire/howler.js/issues/509)、[#504](https://github.com/goldfire/howler.js/issues/504)、[#1470](https://github.com/goldfire/howler.js/issues/1470)、[#1746](https://github.com/goldfire/howler.js/issues/1746)。`_endTimers` 以 sound id 为键，stop／pause 调 `_clearTimer`，`_cleanBuffer`（`_scratchBuffer` 存在时）会清 `bufferSource.onended`；但 `once('end')` 的用户回调挂在 Howl 组上，不随 stop 清空——所以 stop 5 次后再自然播完，5 个回调一起触发（#1695）。这是“旧结束回调累积”的最小现场。

## 责任层 × 各实现

| 责任层 | 本卡要防的失败 | 其他实现怎么解决 | 未解决或代价 |
|---|---|---|---|
| 事件 | 同渲染帧多 tick／回滚重放同一事件多次触发 | moyuta 用“实例＋循环＋帧＋类型”幂等键；INVERSUS 用 128 条 sound event＋frame 环形历史去重；Cargo Space 把声音做成 rollback 实体，撤销预测时 fade stop | INVERSUS 作者明确“被回滚否定但已播的声音不会停止”；幂等键只保证不重复交付，不撤销已发声 |
| 调度 | 暂停／退出后旧排程仍起播，恢复时补播旧事件 | Web Audio 规范说明已排 stop 不可取消；Chrome 建议每次新建 source；Escoria／pursuedpybear 在场景切换前清空事件队列；MOBA 固定源暂停时停当前与未来声源并清计划 | 浏览器没有“取消已排 stop”的 API；定时器与音频时钟分离，清 timer 不等于取消音频 |
| 实例 | 同源多实例共用一个 ID／句柄，旧回调命中新实例 | GF 用 channel generation＋playback session；CNA 用 mixer generation；estella 用 current source 校验；lite-audio／EZ 用 index+generation 的 stale handle；FMOD 用 userData／playingID；Godot polyphonic 用 int ID | generation 会环绕（lite-audio ADR 0002 专门处理 ABA）；0 也是有效句柄（Cocos #67104）；组级回调（howler、Tone Player）仍无法区分是哪一次 start |
| 结束回调 | 自然结束、stop、抢占、fade、loop-end 被同一个回调混在一起 | GameMaker 用 `was_stopped` 区分自然／手动／voice stealing；Phaser 拆 COMPLETE 与 STOP；Pixi 拆 end 与 stop；Godot 选择 stop 不发；Unreal 选择 Stop 也发 | SDL_mixer、pygame、HTMLMediaElement、FMOD STOPPED 都不给原因；停止与销毁顺序错会崩溃或静默丢回调 |
| 清理 | 退出／切场景／回池时旧回调释放新实例或访问已释放内存 | CNA 延迟释放＋Stop 等回调屏障；Oboe／Positech 用 shared_ptr／引用计数＋主线程帧末清扫；QFramework 在 Recycle2Cache 入口加 `IsRecycled` 守卫；Cocos 修复 stop 路径未销毁 `_innerAudioContext` | 幂等守卫能挡住重复回收，但不能识别“槽位已被新实例复用”；停止是异步的，销毁不能紧跟 stop() 之后 |

## MOBA 责任链：事件→调度→实例→清理

| 环节 | MOBA 固定源的做法 | 其他实现对照 | 仍未解决 |
|---|---|---|---|
| 事件 | 玩法确认的事实进入声音事件；本次事件键去重，多段／多目标按反馈政策合并；循环只更新同一实例参数，不每帧 Play | moyuta 用实例＋循环＋帧＋类型幂等；INVERSUS 用 sound event＋frame 环形历史；Cargo Space 把声音做成 rollback 实体 | 同渲染帧多 tick 与回滚重放只靠事件键不够，需上层提供帧号／循环号；已播但被回滚否定的声音不会自动停止 |
| 调度 | 同一批按权重稳定排序，25 ms 起播间隔，活动／已排最多 8，未来计划最多 4、距当前 AudioContext 最多 100 ms；超限丢新事件、不抢旧计划 | Web Audio 规范：已排 stop 不可取消；Chrome：每次新建 source；Escoria／pursuedpybear：切场景前清队列 | 浏览器没有取消已排 stop 的 API；清 JS timer 不等于取消音频；暂停／退出必须显式停已排节点 |
| 实例 | 每次获准请求保存实例；声部由 onended 释放；池化复用前按本次配置复位位置、loop、pitch、增益、空间化、总线与暂停策略，旧回调按代次丢弃 | GF：channel generation＋playback session；CNA：mixer generation；estella：current source 校验；FMOD：userData／playingID；Godot：int ID | Web Audio 没有内建实例 ID，必须自建 generation／session；generation 会环绕，0 也是有效句柄 |
| 清理 | 自然结束、抢占、打断、失败、销毁和切场都接清理；只撤销这次实例的让位；循环一轮不算整次播放结束，暂停不直接当退场；旧实例回调不能停掉重生后的新循环 | CNA：deferred free＋Stop 等回调屏障；QFramework：Recycle2Cache 幂等守卫；Oboe／Positech：shared_ptr／引用计数＋主线程清扫 | onended／STOPPED 不带结束原因；停止是异步的，销毁不能紧跟 stop() 之后；幂等守卫不能识别“槽位已复用” |

## 推荐路径（按引擎分支）

| 场景 | 推荐做法 | 不要做 |
|---|---|---|
| Web Audio／MOBA | 事件键去重＋每次播放新建 source＋实例句柄（generation／session）＋stop 前记录意图；暂停／退出显式停已排节点并清计划；`onended` 只当“该实例的播放结束” | 不复用 source；不把 `onended` 当自然播完；不用 setTimeout 代替音频时钟；不只禁止下一次 play |
| Godot | 停止方自己收尾；播放器／会话 ID 绑定回调；池化按 session 校验 | 不把 `finished` 接到 `play()`；不用 `finished` 回收被 stop 的实例；不依赖 polyphonic 的 finished |
| Unity | 需要独立停止／跟随的播放各占一个 AudioSource；池化 AudioSource 按 generation 校验；自然结束用轮询或自建事件；PlayOneShot 只用于不可撤销短音 | 不用 PlayOneShot 播放需要停止的关键事件；不用 `isPlaying` 判断“这一次”结束；不在 Stop 后立即销毁 |
| Unreal | 绑定实际返回的 AudioComponent；Stop 与自然结束分开记账；池化组件重绑 generator／AudioComponentId | 不把 `OnAudioFinished` 当自然结束；不复用未重绑的池化组件 |
| FMOD／Wwise | 每次播放一个 playingID／实例身份；stop 前记原因；STOPPED 里再 release；不在回调里释放正在回调的实例 | 不把 STOPPED 当播完；不对已停实例再 stop；不要同帧 Play→Stop→Play 而不复位 |
| 通用 | index＋generation／session 的句柄；旧句柄与旧回调 no-op；幂等回收入口；退出前先失效回调再释放 | 不用槽位号或资源 ID 当实例身份；不用 0／真假值判断句柄；不靠幂等守卫识别“新实例” |

## 渠道覆盖表

| 渠道类 | 实际看了什么 | 得到 | 读不到及原因 |
|---|---|---|---|
| 规范与 Web 平台 | W3C TR／编辑草案／public-audio 存档、MDN、web.dev、Chrome for Developers、WebKit 源码与提交、Chromium Blink 源码、WPT、WebAudio issue／PR、Chromium code review | 38 | Chromium CL 23596014 连接被关闭；WebKit bug #320884／#70061 被域名安全校验拦截；HTML5 Rocks FAQ 证书过期 |
| 引擎官方文档与 wiki | Unity 6.3 ScriptReference／Manual、Unreal 5.x Python／C++ API、Godot 4.5／stable 类文档、GameMaker、Defold、Cocos 3.8、PlayCanvas API、Phaser API、SDL2／SDL3_mixer wiki、pygame、Roblox、SFML 文档、docs.rs | 75 | dev.epicgames.com 只返回目录壳；Unity 部分页 302 到索引；Apple／Android 文档 JS 壳；SDL3 wiki 部分页 404；docs.rs rodio Sink 404 |
| 中间件 | FMOD 官方文档／白皮书／Q&A（Discourse JSON）、fmod-for-unity／unreal／GDExtension／Godot 集成；Wwise SDK／QA／Unity 文档／Godot 集成／Gyms／MCP | 47 | fmod.com/docs 是 453 字节 SPA 壳；audiokinetic 多次 403／WAF（浏览器 UA 偶可过，正文仍依赖 JS）；forums.fmod.com 被域名策略拦截 |
| GitHub（issue／PR／commit＋源码与 README） | howler、Tone、Phaser、three、PlayCanvas、Pixi、Babylon、Godot、Cocos、bevy_kira、Kira、rodio、MonoGame、libGDX、SDL_mixer、flutter_soloud、miniaudio、OpenAL、SFML、Oboe、Bevy、FMOD／Wwise 集成、Unity／Godot 管理器 | 244 | REST API 匿名限额 403（改用 raw／HTML）；部分 issue 元数据未取 |
| 中文社区 | 掘金、CSDN、Cocos 中文论坛、SegmentFault、抖音开发者论坛、LayaAir、WXOPEN、B站、少数派、GitCode（OpenHarmony） | 43 | 知乎 403；微信验证墙；掘金评论接口不存在；抖音评论未渲染；B站评论接口拦截；SegmentFault 468；LayaAir 正文加载失败 |
| 个人与团队博客 | Positech、Cargo Space、INVERSUS、floooh、TinyGiants、moyuta、dev.to、Howler 作者发布文、Game Programming Patterns | 11 | Skullgirls 博文 TLS EOF；archive.org 不可达 |
| Skill 与清单 | GodotPrompter、Game-Dev-Agentic-Skills、awesome-gamedev、magictools、OpenAudio、Donchitos、playcanvas AGENTS.md | 8 | 无 |
| 问答社区与插件商店 | Unity Discussions、Stack Overflow、Roblox DevForum、Unity Asset Store | 7 | Stack Overflow 直连 403（改用 API）；Asset Store 只读到元数据 |
| 演讲与书籍 | GDC Vault、Playdead PDF、Taylor & Francis | 6 | Playdead PDF 抓到二进制流未提取 |
| 行业动态 | Bose 收购 Firelight（FMOD） | 1 | Wwise 2026.1 blog 与 Wwise MCP 文档 403 |
| 其他文档站 | GF Framework readthedocs、BroAudio GitBook、EZ Web Audio、SoLoud 文档站、pub.dev、compuphase | 13 | soloud-audio.com TLS 握手失败；改读 solhsa.com 与 GitHub 头文件 |
| 社交聚合与 newsletter | HN Algolia 多组检索与评论树；Lobsters /t/audio、/t/games、/t/programming；Reddit site:；A Sound Effect、Game Audio Digest | 0 | HN 直连 curl 000，用 Algolia；Lobsters search.json 400；Reddit 两组 site: 无结果；newsletter 无同题命中 |

合计 493 个唯一链接（495 条带链接条目；跨渠道条目按主语义只计一次）。表内计数只覆盖进入本清单的引用，收集轮读过的列表页、被排除项与摘要不计；HN／Lobsters／Reddit 与 newsletter 本轮零命中，单列一行以免把“无命中”写成“未尝试”。

## 排序候选清单

排序即优先级：A 完整机制，B 权威契约，C 库实现，D 真实故障，E 中文现场，F 退出／重放／池化与背景。

### A. 完整机制：generation／session／句柄（最高优先）

这一档主要在**实例层＋清理层**解决：给每次播放一个可校验的身份，让旧句柄和旧回调失效。它们回答“谁拥有这次播放”，但都不负责素材加载、混音或玩法事件去重；其中 lite-audio、soundhub 是单人新项目，不能当作已验证实现。

- **GF Framework《Bank 挂载、空间音效与句柄》** — https://gf-framework.readthedocs.io/zh-cn/latest/standard/utilities/runtime/audio/mounting-spatial-handles/ — 句柄绑 channel generation 与 playback session ID；通道 replacement 后旧 stop／fade 一律 no-op；池播放器终态显式断开 finished。
- **GF Framework《BGM 控制》** — https://gf-framework.readthedocs.io/zh-cn/latest/standard/utilities/runtime/audio/playback/bgm-control/ — generation＋逻辑 session 双校验；旧 resume／stop／finished 不能覆盖或复活新会话；退役声部不重复发 finished。
- **GF Framework《SFX 与片段》** — https://gf-framework.readthedocs.io/zh-cn/latest/standard/utilities/runtime/audio/playback/sfx-clips/ — 句柄只属一次播放 session、不拥有可复用 player；旧 handle／完成回调／tween 不能命中已复用 node；异步加载返回前 stop 也能终结会话。
- **GF Framework `gf_audio_utility.gd`** — https://github.com/C76GN/gf-framework/blob/main/addons/gf/standard/utilities/audio/gf_audio_utility.gd#L13706-L13718 — `_on_sfx_finished`／`_on_spatial_sfx_finished` 先比对 `playback_session_id`；注释写明“避免旧完成信号回收已复用实例”。
- **CNA《Debug Shutdown and Lifetime》** — https://libcna.com/development/handbook/debug-shutdown-and-lifetime.html — 三层做法：bump generation 令 stale pointer 消失；stopped 回调里销毁的 track 进 deferred free；Stop 等 in-flight callback 结束。
- **CNA《Audio Engine》内部文档** — https://libcna.com/development/internals/audio/engine.html — 实例记录 mixer generation；stop／destroy 前比对；Stop 作回调屏障后才可释放内存。
- **CNA 动态 voice 销毁夹具** — https://github.com/libcna/cna/blob/3b43bd8687ed46523d873f9bec4b32bd8481dcb5/tools/audio/mixer_destroy_active_dynamic_voice_harness.cpp — 可直接借为“销毁仍在播放的 dynamic voice，旧回调不得触碰已释放 voice”的断言。
- **CNA 静态 voice 销毁夹具** — https://github.com/libcna/cna/blob/3b43bd8687ed46523d873f9bec4b32bd8481dcb5/tools/audio/mixer_destroy_active_static_voice_harness.cpp — 覆盖另一条停止路径，与动态夹具成对。
- **CNA-BUG-142** — https://libcna.com/known-issues/bugs/cna-bug-142.html — 无混音器时歌曲永不结束、MediaPlayer 永远 Playing，是“结束检测缺失导致状态不复位”的失败样本。
- **CNA-BUG-140** — https://libcna.com/known-issues/bugs/cna-bug-140.html — Play 失败仍报告 Playing 且丢掉当前 track；失败路径未走同一收尾。
- **CNA-VGAP-034** — https://libcna.com/known-issues/verification-gaps/cna-vgap-034.html — 停止／销毁顺序本身可造成堆损坏，提示测试顺序设计。
- **estella v0.79.0** — https://github.com/esengine/estella/releases/tag/v0.79.0 — 发布说明写明 completion callback 会校验当前 source，旧 source 不能释放 resumed voice 的 pool slot；区分 interrupted 与 natural completion。
- **estella v0.87.0** — https://github.com/esengine/estella/releases/tag/v0.87.0 — finished handle 释放 buffer／source／pool 引用但保留 ID 与 duration；异步 decode 捕获 context generation，拒绝跨 disposed／replaced context 的晚到结果。
- **lite-audio-pool** — https://github.com/PeshoVurtoleta/lite-audio-pool — `play()` 返回 `(generation<<8)|channel`；通道被偷后旧 handle 的 stop 为静默 no-op；`stopAll()` 使此前所有 handle 失效。
- **lite-audio** — https://github.com/PeshoVurtoleta/lite-audio — 把 busIndex 也编进 handle，解决每个 bus 的 pool 都从 channel 0／gen 0 开始导致的跨 bus 误杀；作者称 `Howl.stop(id)` 在 id 复用后误停是其重写动机（0★、单人自述，只作机制参考）。
- **lite-audio ADR 0001** — https://github.com/PeshoVurtoleta/lite-audio/blob/main/decisions/0001-handle-namespace.md — bus 索引与 pool 句柄编码进单个整数的具体方案。
- **lite-audio ADR 0002** — https://github.com/PeshoVurtoleta/lite-audio/blob/main/decisions/0002-generation-wrap.md — 24 位 generation 环绕后陈旧句柄可能命中新 voice；规定陈旧 stop 必须是安全 no-op。
- **lite-audio ADR 0010** — https://github.com/PeshoVurtoleta/lite-audio/blob/main/decisions/0010-bus-tombstone.md — bus tombstone，保留空壳记录且不复用索引，避免旧 bus 句柄命中新 bus。
- **EZ Web Audio `VoiceHandle`** — https://sethbrasile.github.io/ez-web-audio/api/classes/VoiceHandle.html — 停止／被偷后变 stale，所有方法静默 no-op，`active` 可查询。
- **EZ Web Audio `VoiceStolenEventDetail`** — https://sethbrasile.github.io/ez-web-audio/api/interfaces/VoiceStolenEventDetail.html — voice-stolen 与 ended 分成不同事件，避免旧句柄误操作复用后的声部。
- **floooh《Handles are the better pointers》** — https://floooh.github.io/2018/06/17/handles-vs-pointers.html — index＋generation 的 handle 在槽位复用时拒绝旧引用，是通用解法。
- **QFramework `fix-audio-player-double-recycle` 设计文档** — https://github.com/liangxiegame/qframework/blob/976d43b73fe2e3b8facad78c023e98d4c7193549/QFramework.Unity2018%2B/openspec/changes/archive/2026-07-02-fix-audio-player-double-recycle/design.md — Stop 让 ActionKit 的“!isPlaying”下一帧成立，触发 OnPlayFinished→Stop→Recycle2Cache 二次回收；修复是在入口加 `IsRecycled` 守卫。
- **QFramework 同题 proposal** — https://github.com/liangxiegame/qframework/blob/976d43b73fe2e3b8facad78c023e98d4c7193549/QFramework.Unity2018%2B/openspec/changes/archive/2026-07-02-fix-audio-player-double-recycle/proposal.md — StopAllSound 入池后下一帧旧完成回调再次 Stop→Recycle2Cache；幂等守卫能挡重复回收，但不能识别“新实例”。
- **QFramework Issue #156** — https://github.com/liangxiegame/QFramework/issues/156 — “拒绝播放”这条非正常路径没有 stop 与回池，同步终止还可能把已回收实例返回给调用方。
- **TinyGiants《Cross-Scene Persistence》** — https://tinygiants.tech/blog/cross-scene-persistence — 场景卸载时 OnDisable／OnDestroy 与持久 AudioManager 的订阅窗口会丢事件或留下指向已销毁对象的 delegate；建议让延迟工作认识“自己属于哪个 session”。
- **moyuta《异步音频块用 StreamId／Revision 拒绝旧解码》** — https://blog.moyuta.com/posts/async-audio-stream-generation-complete-block-commit — 旧环境音的迟到解码被 StaleRequest 拒绝、不覆盖新语音缓冲；可直接映射“旧结束回调不得释放新实例”。
- **moyuta《动画事件幂等键必须包含实例、循环与帧》** — https://blog.moyuta.com/posts/animation-event-idempotent-loop-commit — 同一动画帧会因混合树求值、回滚重放或状态重入多次触发；用实例＋循环＋帧＋类型保证只交付一次。
- **moyuta《音频 Voice 预算的确定性抢占》** — https://blog.moyuta.com/posts/audio-voice-budget-deterministic-stealing — 按优先级／距离／序号给全序选牺牲者，并要求“逻辑槽释放与物理停止分离”。
- **CSDN《解决音频混播问题》** — https://blog.csdn.net/qq_41049913/article/details/126522708 — 每次 initAudio 都给 audioDom 绑新的 oncanplay，旧实例回调未取消导致多段混播；作者用 startTimestamp 代际比较丢弃旧实例。
- **CSDN《HarmonyOS 空间音频导览的章节切换与音频资源回收》** — https://harmonyosdev.csdn.net/6ae94ca4e5f4ca4eff8e0d9c.html — 快速切章用 revision 递增＋lease 身份门控丢弃旧请求与旧 timeUpdate；释放顺序是先清 lease、再释放 player、最后关 fd。
- **OpenHarmony PR #16496** — https://gitcode.com/openharmony/multimedia_audio_framework/pull/16496/discuss — 会话音效关闭改 BeginClose／FinalizeClose 两阶段，STOPPING 守卫取消 pending create，用单调 generation＋instance 指针拒绝被新 Create 取代的延迟回调。
- **Prime Audio System（Unity）** — https://github.com/AndriiSviatenko/Prime-Audio-System — 每次 Play 返回 AudioHandle，实体销毁自动清理，提供 Stop／Pause／Resume／SetVolume 的句柄式所有权。
- **BitemDev Audio Engine（Unity）** — https://github.com/bitemdev/com.bitemdev.audio-engine — 池化 AudioSource＋AudioPlaybackHandle，跟随目标销毁即停，音乐替换淡出与 Max Voice Limits。
- **Audipool（Unity）** — https://github.com/BluePixelDev/audipool — 专门复用 AudioSource 池播放短命空间音效，可对照复用前如何清理旧实例状态。
- **Orpheus** — https://github.com/superirale/Orpheus — MIT、C++17；命名事件、RTPC、snapshot、voice pooling／stealing、markers／cues、3D／occlusion，适合看轻量中间件如何封装实例生命周期。
- **AmplitudeAudioSDK** — https://github.com/SparkyStudios/AmplitudeAudioSDK — 开源游戏音频引擎，事件、总线、通道优先级、衰减，miniaudio 后端，是 FMOD／Wwise 的开源对照。
- **barelymusician** — https://github.com/anokta/barelymusician — 任务回调以 kBegin／kEnd 成对触发并配 lookahead，把结束事件调度到确定时间点而非依赖引擎回调。
- **soundhub.js** — https://github.com/chriscreativecode/soundhub — 用 `soundhub/howler` 入口让现有 Howler 代码改一个 import 即迁移，原生带 groups、3D／HRTF、ducking、variations（迁移路径观察）。
- **standardized-audio-context** — https://github.com/chrisguttandin/standardized-audio-context — 跨浏览器 WebAudio 调度 polyfill，可作为验证 stop／onended 行为一致性的实现参照。
- **LabSound** — https://github.com/LabSound/LabSound — WebKit WebAudio 的 C++ fork，复用同一套 source／stop／onended 生命周期，可在原生层验证规范行为。
- **melonJS PR #1736** — https://github.com/melonjs/melonJS/pull/1736 — howler 派生后端在一次播放结束时执行 stop(id)＋off("end", undefined, id)，修成按播放 ID 清空全部 end 监听，避免旧回调在下一次复用同 ID 时误触发。
- **melonJS PR #1617** — https://github.com/melonjs/melonJS/pull/1617 — 把 howler 派生后端移入引擎，并带入 8 个上游未合并修复（#1648 排队 stop 丢 internal 标志、循环位置、iOS 暂停后播放竞态），可作集中修复清单。

### B. 权威契约与相反取舍

这一档在**契约层**解决：规定“结束”到底指什么、stop 是否发通知、句柄何时失效。它给测试提供预期，但不提供跨引擎统一答案；Web Audio 与 Godot／Unreal 在 stop 是否回调上相反，必须按引擎分支。

- **W3C Web Audio `AudioScheduledSourceNode`** — https://www.w3.org/TR/webaudio/#AudioScheduledSourceNode — `ended` 在 stop() 设定的停止时刻派发，即使停止时间早于 start、声音从未播放；同一 source 二次 start() 抛 InvalidStateError；suspend／close 冻结 currentTime。
- **Web Audio 规范 Dynamic Lifetime** — https://webaudio.github.io/web-audio-api/#lifetime-1 — 连接引用、tail-time 与动态生命周期，决定 ended 能否被观察到。
- **W3C public-audio 2015-01 #0040** — https://lists.w3.org/Archives/Public/public-audio/2015JanMar/0040.html — 规范曾对自然播完、循环与显式 stop 何时触发 ended 表述不清；讨论提出“非循环播完或显式 stop 时触发”。
- **W3C public-audio 2015-01 #0042** — https://lists.w3.org/Archives/Public/public-audio/2015JanMar/0042.html — ended 在自然读完或显式 stop() 时都会触发，事件本身不带原因。
- **MDN `AudioScheduledSourceNode.onended`** — https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode/onended — “节点停止播放时触发”；直接赋 onended 会覆盖已有监听。
- **MDN `AudioScheduledSourceNode` ended 事件** — https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode/ended_event — stop、自然播完、buffer 播完都触发同一个通用 ended，不携带结束原因。
- **MDN `AudioBufferSourceNode`** — https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode — 只能播放一次，重播必须新建节点，可 fire-and-forget。
- **MDN `HTMLMediaElement` ended 事件** — https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event — 只在自然播完或没有更多数据时触发，pause／stop 不触发，与 Web Audio 的 ended 相反。
- **MDN `AudioScheduledSourceNode.stop()`** — https://developer.mozilla.org/en-US/docs/Web/API/AudioScheduledSourceNode/stop — 同一节点再次 stop 会替换尚未发生的旧 stop 时间；stop 早于 start 则节点永不发声。
- **MDN `AudioContext.close()`** — https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/close — 释放系统音频资源并拒绝后续调度，是页面或场景退出时收掉旧声部的入口。
- **Chrome Web Audio FAQ** — https://developer.chrome.com/blog/web-audio-faq — 每次播放新建 source node、复用 buffer；fire-and-forget 后不要持有节点。
- **Chrome《The play() request was interrupted》** — https://developer.chrome.com/blog/play-request-was-interrupted — pause() 会让未决 play promise 以 AbortError 拒绝，旧异步回调可能在新状态后才到。
- **Chrome Autoplay policy** — https://developer.chrome.com/blog/autoplay — 无手势时 AudioContext 处于 suspended，resume 后旧计划可能补播。
- **Chrome Page Lifecycle API** — https://developer.chrome.com/blog/page-lifecycle-api — freeze／resume／terminated 阶段与后台标签挂起语义；恢复时不得把旧事件当新事件补播。
- **web.dev《A tale of two clocks》** — https://web.dev/articles/audio-scheduling — JS 定时器与音频时钟分离，清 timer 不等于取消已排音频。
- **WebAudio issue #2451** — https://github.com/WebAudio/web-audio-api/issues/2451 — 规范层承认已排定的 stop() 无法取消，只能用 stop(1e300) 覆盖；这是暂停／重触发／替换时旧 stop 回调仍会落下的根因。
- **WebAudio issue #2406** — https://github.com/WebAudio/web-audio-api/issues/2406 — loop 只在 JS 执行时生效，无法在采样级关闭，loop-end 只能靠定时器近似。
- **WebAudio issue #1828** — https://github.com/WebAudio/web-audio-api/issues/1828 — OfflineAudioContext 中 scheduled source 的 onended 是否触发；规范没写就不触发。
- **WebAudio issue #277** — https://github.com/WebAudio/web-audio-api/issues/277 — OscillatorNode.onended 的描述曾从 AudioBufferSourceNode 复制而来，后补明事件名与 stop 前提。
- **WebAudio issue #414** — https://github.com/WebAudio/web-audio-api/issues/414 — onended 只表示播放结束，不代表节点释放；tail-time 与连接引用决定回调还能不能被观察到。
- **WebAudio issue #513** — https://github.com/WebAudio/web-audio-api/issues/513 — 规范只给 ended、没有 start 事件或 isPlaying，“这一声还在不在播”只能由调用方自建状态。
- **WebAudio issue #904** — https://github.com/WebAudio/web-audio-api/issues/904 — stop／disconnect 不释放内存，把“结束回调”和“资源回收”拆成两件事。
- **WebAudio issue #818** — https://github.com/WebAudio/web-audio-api/issues/818 — 讨论由谁在什么时点释放已停止的音频节点。
- **WebAudio issue #1471** — https://github.com/WebAudio/web-audio-api/issues/1471 — 节点何时可回收含糊，回调可能持有本不该存活的节点。
- **WebAudio issue #9** — https://github.com/WebAudio/web-audio-api/issues/9 — 给原生节点增加 reset／清空输入能力的早期讨论，涉及已调度状态如何作废。
- **WebAudio PR #1017** — https://github.com/WebAudio/web-audio-api/pull/1017 — 新增 AudioScheduledSourceNode 基类，统一 start／stop／ended 语义。
- **WebKit commit d0c18b9** — https://github.com/WebKit/WebKit/commit/d0c18b999649f850d457a6e1d3f4f80dd5134f00 — 修“未连接 destination 的 scheduled source 不派发 ended”，并补 WPT 回归；说明靠 ended 释放声部在 Safari 依赖连接／保活假设。
- **WebKit `BaseAudioContext.cpp` @d0c18b9** — https://github.com/WebKit/WebKit/blob/d0c18b999649f850d457a6e1d3f4f80dd5134f00/Source/WebCore/Modules/webaudio/BaseAudioContext.cpp — 把正在播放的 scheduled source 注册为 automatic pull node，结束或上下文销毁时注销。
- **WebKit 回归期望** — https://github.com/WebKit/WebKit/blob/d0c18b999649f850d457a6e1d3f4f80dd5134f00/LayoutTests/imported/w3c/web-platform-tests/webaudio/the-audio-api/the-constantsourcenode-interface/constant-source-onended-not-connected-expected.txt — “未连接也应触发 ended”的逐项期望，可作断言基线。
- **WebKit bug 112521** — https://bugs.webkit.org/show_bug.cgi?id=112521 — 节点被 GC 后 onended 处理器一起消失；连接中的节点必须保活到事件派发。
- **Chromium CL 23596014** — https://codereview.chromium.org/23596014/ — 在 finish 与 notifyEnded 之间用 RefPtr 保住节点，避免回调前被回收（正文连接被关闭，实现改读 Blink 源码）。
- **Chromium Blink `audio_scheduled_source_node.cc`（GitHub 镜像）** — https://github.com/chromium/chromium/blob/main/third_party/blink/renderer/modules/webaudio/audio_scheduled_source_node.cc — `HasPendingActivity` 把“ended 尚未派发”计入节点存活条件。
- **Chromium `audio_scheduled_source_node.cc`（官方源）** — https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/renderer/modules/webaudio/audio_scheduled_source_node.cc — 同上，便于按官方仓库核对。
- **WebKit `AudioScheduledSourceNode.cpp`** — https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/webaudio/AudioScheduledSourceNode.cpp — `finish()` 派发 ended 且要求存在监听器。
- **WPT `audiosource-onended.html`** — https://github.com/web-platform-tests/wpt/blob/master/webaudio/the-audio-api/the-audiobuffersourcenode-interface/audiosource-onended.html — OfflineAudioContext 验证 onended（直接赋值与 addEventListener 两种设置）。
- **WPT `constant-source-onended-not-connected.html`** — https://github.com/web-platform-tests/wpt/blob/master/webaudio/the-audio-api/the-constantsourcenode-interface/constant-source-onended-not-connected.html — 未连接节点也必须触发 ended 的回归用例。
- **WPT `audiobuffersource-ended.html`** — https://github.com/web-platform-tests/wpt/blob/master/webaudio/the-audio-api/the-audiobuffersourcenode-interface/audiobuffersource-ended.html — 直接断言 ended 触发时序，可作测试模板。
- **WPT webaudio 目录** — https://github.com/web-platform-tests/wpt/tree/master/webaudio — 收录 audiosource-onended、constant-source 等生命周期用例的总索引。
- **Godot `AudioStreamPlayer` 4.5 类文档** — https://docs.godotengine.org/en/4.5/classes/class_audiostreamplayer.html — `finished` 只在无中断播完时发出；stop() 或退出场景树不发。
- **Godot `AudioStreamPlayer` stable 类文档** — https://docs.godotengine.org/en/stable/classes/class_audiostreamplayer.html — 同契约，作为长期入口。
- **Godot PR #33602** — https://github.com/godotengine/godot/pull/33602 — 维护者讨论后拒绝新增 `stopped` 信号，理由是“调用 stop 的直接结果不需要事件”，调用方自己处理；PR 关闭未合并。
- **Godot `audio_stream_player_internal.cpp` @4.5-stable** — https://github.com/godotengine/godot/blob/4.5-stable/scene/audio/audio_stream_player_internal.cpp — `stop_basic()` 直接清空 stream_playbacks 不发 finished；process() 只为自然失效的 playback 发 finished；polyphony 超限强停也不发。
- **Godot `audio_stream_player_internal.h` @4.5-stable** — https://github.com/godotengine/godot/blob/4.5-stable/scene/audio/audio_stream_player_internal.h — `stream_playbacks` 是 `Vector<Ref<AudioStreamPlayback>>`，stop 清列表即释放所有权。
- **Godot `AudioStreamPlaybackPolyphonic`** — https://docs.godotengine.org/en/stable/classes/class_audiostreamplaybackpolyphonic.html — `play_stream` 返回 int ID，`stop_stream`／`is_stream_playing` 按 ID 操作，失败返回 `INVALID_ID=-1`；ID 何时失效与能否复用是引擎侧契约。
- **Godot `AudioStreamPolyphonic`** — https://docs.godotengine.org/en/stable/classes/class_audiostreampolyphonic.html — polyphony 上限决定 play_stream 何时返回 INVALID_ID，可作容量耗尽与抢占测试的上限输入。
- **Godot `AudioStreamPlayback`** — https://docs.godotengine.org/en/stable/classes/class_audiostreamplayback.html — `_start`／`_stop`／`_mix` 虚方法契约，界定播放实例由谁负责开始、停止与结束。
- **Godot `audio_stream_player.cpp`** — https://github.com/godotengine/godot/blob/master/scene/audio/audio_stream_player.cpp — 节点层 stop 与 finished 发射位置，可与 internal.cpp 对照责任分层。
- **Godot proposal #12739** — https://github.com/godotengine/godot-proposals/issues/12739 — 官方对“所有者释放即停”的明确取舍（not planned），直接对应退出／替换时的实例所有权。
- **Godot proposal #4569** — https://github.com/godotengine/godot-proposals/issues/4569 — 用自动清理的一次性播放器替代手动管实例，是退出／短音效场景的替代架构。
- **Godot《Autoloads versus regular nodes》** — https://docs.godotengine.org/en/stable/tutorials/best_practices/autoloads_versus_regular_nodes.html — 官方不建议全局 autoload 声音池；AudioStreamPlayer 再次 play 会打断前一个。
- **Unity `AudioSource.PlayOneShot`（6.3）** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosource/playoneshot — 返回 void，不提供逐次句柄／回调，且不取消已播放的 one-shot；逐实例结束只能自建 AudioSource 或自行记账。
- **Unity `AudioSource.isPlaying`** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosource/isplaying — 声源级、包含 PlayOneShot；多个 one-shot 重叠时无法区分哪一个结束。
- **Unity `AudioSource` 总览** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosource — 同上，作为接口总入口。
- **Unity `AudioSource.Stop`** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosource/stop — 只写“停 clip”，不提 PlayOneShot，也不提 isPlaying，停止范围与状态归属在文档层就不明。
- **Unity `AudioSource.Pause`** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosource/pause — Pause 保留播放位置，Stop 结束该 clip，用于区分单源暂停与全局暂停。
- **Unity `AudioSettings.dspTime`** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosettings/dsptime — 绝对音频时钟，暂停／挂起时停走，是判断停止截止时间与回调应基于哪个时间源的依据。
- **Unity `AudioSource.PlayScheduled`** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosource/playscheduled — 按 dspTime 的绝对时间线预排播放；替换场景或实例前必须撤销已排计划。
- **Unity `AudioSource.SetScheduledEndTime`** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosource/setscheduledendtime — 已排结束时间可被改写，但文档明说并非所有重排请求都能兑现——结束回调的时间点不是可靠的所有权边界。
- **Unity `AudioSource.ignoreListenerPause`** — https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-ignoreListenerPause.html — AudioListener.pause 只暂停未标记的源，暂停菜单／背景音乐因此不随全局暂停静音。
- **Unity `AudioListener.pause`** — https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioListener-pause.html — 暂停时 dspTime 冻结，已排程的 Play 在恢复后按剩余延迟播放；排程队列不会因暂停自动作废。
- **Unity `AudioSettings.OnAudioConfigurationChanged`** — https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSettings.OnAudioConfigurationChanged.html — 设备／采样率变化回调；重配后旧声部与去重状态需自行重建。
- **Unity `AudioSettings.Reset`** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/audiosettings/reset — 设备变化或 Reset 会重建音频配置，播放中的实例不保证保留，需要重绑回调。
- **Unity `MonoBehaviour.OnApplicationPause`** — https://docs.unity3d.com/6000.3/Documentation/ScriptReference/MonoBehaviour.OnApplicationPause.html — 应用失焦／恢复时发给所有 GameObject 的暂停通知，与 AudioListener.pause 搭配处理退出再进入。
- **Unity `MonoBehaviour.OnApplicationFocus`** — https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/monobehaviour/onapplicationfocus — 失焦／获焦与 OnApplicationPause 的触发条件不同，暂停策略要覆盖两者。
- **Unity 6.3 Scriptable Audio generators** — https://docs.unity.com/en-us/engine/6000.3/manual/audio/scriptable-processors/generators — `IAudioGenerator`／`CreateInstance` 与 GeneratorInstance 的 Update／Process／Destroy 生命周期、`AudioSource.generatorHandle`；Web 平台不支持。
- **Unity 6.3 Scriptable Audio 概念** — https://docs.unity.com/en-us/engine/6000.3/manual/audio/scriptable-processors/concepts — 生成器实例的创建、格式协商与完成信号，是引擎原生“实例何时算结束”的契约。
- **Unity UUM-404** — https://unityreleases.com/issues/UUM-404 — 6000.6.0a5 修复：停止或禁用播放 unique／streaming clip 的 AudioSource 时，SoundHandle.Instance.Destructor 在主线程造成大幅停顿；清理所有权放错线程／时机代价可见。
- **Unreal `FOnAudioFinished`（5.0）** — https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/OnAudioFinished?application_version=5.0 — 官方说它在播完或 Stop() 提前关闭时都会调用，因此不能把 OnAudioFinished 当自然结束。
- **Unreal `FOnAudioFinished`（5.5）** — https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/OnAudioFinished?application_version=5.5 — 同契约的后续版本文档。
- **Unreal API `FOnAudioFinished`** — https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/Components/FOnAudioFinished — C++ 侧的官方定义，和 Python 页互为对照。
- **Unreal `OnAudioFadeChangeSignature`** — https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/OnAudioFadeChangeSignature?application_version=5.0 — 淡入淡出变化回调；文档只给签名，不给与结束回调的顺序，属未覆盖的时序边界。
- **Unreal Forum：OnAudioFinished 不触发** — https://forums.unrealengine.com/t/on-audio-finished-does-not-trigger-on-audio-components-sound-completion/145124 — 回调可能绑在 PlaySound 新建的另一个 AudioComponent 上，而不是 actor 上那个，导致不触发或触发错实例。
- **Unreal Forum：MetaSound pooling 参数与完成委托竞态** — https://forums.unrealengine.com/t/meta-sounds-not-receiving-parameters-updates-with-pooling-system-enabled/2733791 — 2026-06 报告、2026-09 Epic／社区回复：池化 UAudioComponent 复用后参数不再更新，Epic 怀疑 reset 使 AudioComponentID 自增、断开与 FMetaSoundGenerator 的 DataChannel 链接。
- **UE-363230** — https://issues.unrealengine.com/issue/UE-363230 — 官方 2026-02 登记：UMovieSceneAudioSection 在回收的 audio component 上不会转发 SetOnAudioFinished；Target Fix 5.8／commit 51358810（公开页，登录后的原单未读）。
- **FMOD Q&A 13531** — https://qa.fmod.com/t/distinguishing-fmod-studio-event-callback-stopped-callbacks/13531 — 官方回答无法区分 STOPPED 是手动停止还是播完，只能用末尾 marker 或自己的 stop 包装记录意图。
- **FMOD Q&A 11223** — https://qa.fmod.com/t/callback-problem-stopping-stopped-event/11223 — 官方复现“对已停止实例再 stop 仍触发 STOPPED，之后 play 时 STOPPED 先于 STARTED 到达”并称为 bug，是旧停止回调干扰新播放的中间件实例。
- **FMOD Q&A 19760** — https://qa.fmod.com/t/know-when-an-eventinstance-has-been-released/19760 — 官方建议用 setUserData 存字典键、在 DESTROYED 回调里移除实例，是“回调携带实例身份”的中间件做法。
- **FMOD Q&A 17852** — https://qa.fmod.com/t/instances-not-releasing-properly-when-using-allowfadeout/17852 — 维护者确认“事件只有完全停止后才能 release”，暂停实例会拒绝释放，暂停／淡出状态与句柄所有权绑成一条必须显式解除的链。
- **FMOD Q&A 23277** — https://qa.fmod.com/t/do-unreal-fmod-components-release-themselves-when-finished-playing/23277 — Stop() 不等于 Release()，Unreal 只对 one-shot 自动释放；持久 EventInstance 必须在 STOPPED 回调里再 Release。
- **FMOD Q&A 21863** — https://qa.fmod.com/t/err-invalid-handle-at-eventinstance-stop/21863 — stop 返回 ERR_INVALID_HANDLE 源于句柄所有权丢失而非播放状态；官方建议先 isValid 再 stop。
- **FMOD Q&A 20021** — https://qa.fmod.com/t/reuse-programmer-sound-dont-reset-when-event-instance-stops/20021 — 池化实例在 STOPPED 后即被复用，而 CREATE／DESTROY programmer sound 回调与实例生命周期不同步，复用方必须自己保存并恢复绑定。
- **FMOD Q&A 10765** — https://qa.fmod.com/t/eventinstance-stop-crashes-with-callback/10765 — 回调内释放实例与同步 stop 互相踩踏导致崩溃；官方复现修复，可靠做法是 stop 前把 callback 置空。
- **FMOD Q&A 22994** — https://qa.fmod.com/t/bug-if-stop-is-called-twice-unity-shuts-down-without-any-error-logs/22994 — 用户在 SOUND_PLAYED 回调里再次 stop 卡住的循环声，句柄状态与声音实际不符，第二次 stop 直接崩 Unity。
- **FMOD Q&A 23471** — https://qa.fmod.com/t/studioeventemitter-play-stop-issue-when-repeatedly-called-during-the-same-frame/23471 — 同一帧内 Play→Stop→Play 时 Stop 会先释放 EventInstance，排队中的第二次 Play 落到已失效实例上。
- **FMOD Q&A 14710** — https://qa.fmod.com/t/about-callback-and-upgrade/14710 — 回调与 `RuntimeManager::update` 同线程、无竞态，建议直接在 sound stopped 回调里执行动作而不是只置 bool。
- **FMOD Q&A 14569** — https://qa.fmod.com/t/dont-continue-until-sound-has-stopped/14569 — 官方建议用 stopped callback 而非轮询；事件永不 STOPPED 时要查 profiler 和实例累积。
- **FMOD Q&A 11037** — https://qa.fmod.com/t/resolved-when-do-i-release-event-instances/11037 — 一次性事件可 play 后立即 release；循环／不自行结束的事件必须 stop 后再 release，否则 release 会失败。
- **FMOD Q&A 17102** — https://qa.fmod.com/t/detecting-when-a-localised-audio-tables-programmer-sound-ends/17102 — 提前 release 会让实例由异步 update 在 stopped 时销毁，导致状态长期 PLAYING、回调行为异常。
- **FMOD Q&A 14648** — https://qa.fmod.com/t/stopping-u3d-in-the-callback-will-get-stuck/14648 — 在 DESTROYED 回调里 stop 旧实例并创建下一个会卡死 Unity，回调内重入与 AOT 约束必须由接入层隔离。
- **FMOD Q&A 14757** — https://qa.fmod.com/t/destroy-programmer-sound-callback-not-called-after-calling-eventinstance-stop-with-fmod-studio-stop-immediate-on-1-10-11/14757 — STOP_IMMEDIATE 不触发 DESTROY_PROGRAMMER_SOUND，ALLOWFADEOUT 触发，不同停止模式对清理回调的保证并不一致。
- **FMOD Q&A 18677** — https://qa.fmod.com/t/stopped-vs-stopping-when-using-studio-event-emitter/18677 — 停止带淡出时 IsPlaying() 立即为 false，必须用 getPlaybackState() 等到 STOPPED 才能切场景。
- **FMOD Q&A 21774** — https://qa.fmod.com/t/eventemitter-isplaying-returning-true-after-calling-stop/21774 — Stop() 受 Allow Fadeout 影响，同一帧 IsPlaying() 仍可能为 true，重播前必须完全重置事件实例状态。
- **FMOD Q&A 23188** — https://qa.fmod.com/t/fmod-stopping-music-after-background-foreground-ios-application/23188 — mixerSuspend()／mixerResume() 后收到通道 stop 回调，系统重配 AudioSession 会回收旧通道。
- **FMOD Q&A 18088** — https://qa.fmod.com/t/short-sounds-not-released-after-they-finish-playing/18088 — 短音效结束后实例仍占用，池化复用前必须显式 release。
- **FMOD Q&A 23057** — https://qa.fmod.com/t/playoneshot-not-releasing-instances/23057 — Unity 封装的一次性播放会持续积累实例，需要按实例而非按事件回收。
- **FMOD Q&A 22414** — https://qa.fmod.com/t/fmod-event-callbacks-not-firing-when-bus-has-0-volume/22414 — Bus 音量为 0 时事件回调不派发，结束回调并非总会到达。
- **FMOD Q&A 19467** — https://qa.fmod.com/t/eventinstance-getplaybackstate-doesnt-retrieve-playback-state-stopping/19467 — getPlaybackState 读不到 STOPPING，业务无法可靠判断“正在停止”。
- **FMOD Q&A 16738** — https://qa.fmod.com/t/stop-immediate-throws-warnings-on-programmer-sounds-unity/16738 — immediate stop 与句柄清理耦合时的平台侧告警表现。
- **FMOD Q&A 17921** — https://qa.fmod.com/t/playing-and-event-that-is-already-started-will-not-replay-the-event/17921 — 对已启动事件再次 Play 不会重播，是判断旧实例能否复用的反例。
- **FMOD Q&A 22136** — https://qa.fmod.com/t/fmod-event-instances-accumulating-over-time-despite-clean-code-to-release-events/22136 — 代码已 release 但实例仍持续累积，“释放所有权”不等于实例真正销毁。
- **FMOD Q&A 22879** — https://qa.fmod.com/t/looping-event-wont-stop/22879 — 循环事件 stop／release 后仍继续发声的现场报告。
- **FMOD Q&A 21585** — https://qa.fmod.com/t/stop-fmod-studio-stop-mode-immediate-doesnt-work-in-unity/21585 — Unity 中 STOP_MODE.IMMEDIATE 不生效的多例复现，不能以调用返回成功当作已停。
- **FMOD Q&A 18889** — https://qa.fmod.com/t/fmod-event-instance-does-not-stop-playing/18889 — 被多个停止问题帖反复引用的“实例不停止”样本。
- **FMOD Q&A 17721** — https://qa.fmod.com/t/ue4-programmer-sound-on-stopped-callbacks-getting-called-twice/17721 — UE4 programmer sound 的 STOPPED 回调可能被调两次，接收方必须按实例／代次去重。
- **FMOD 白皮书 Handle System** — https://www.fmod.com/docs/2.01/api/white-papers-handle-system.html — channel handle 是 32 位打包值，stop／被抢占后失效并返回 ERR_CHANNEL_STOLEN；引用计数使旧 handle 不会影响复用同一通道的新声音。
- **FMOD `EventInstance::release`** — https://www.fmod.com/docs/2.02/api/studio-api-eventinstance.html#studio_eventinstance_release — 一般应在 start 后立即 release（需复用或显式 stop／restart 的除外）；播放结束后句柄返回 ERR_INVALID_HANDLE。
- **FMOD for Unity `StudioEventEmitter`** — https://www.fmod.com/docs/2.03/unity/api-studioeventemitter.html — 组件管理单个 EventInstance 的 stop／release 与 AllowFadeout／OnDestroy 生命周期，停止与释放是两个动作。
- **FMOD Q&A 22850** — https://qa.fmod.com/t/trigger-code-after-studioeventemitter-has-finished-playing-event-instance/22850 — STOPPED 回调要在实例开始后才可设置（未 play 前实例无效），且回调线程与 RuntimeManager.update 同线程。
- **FMOD Q&A 12135** — https://qa.fmod.com/t/how-can-i-know-when-sound-playing-finish/12135 — 可用 getPlaybackState 在主线程轮询代替 STOPPED 回调，避开跨线程回调的所有权问题。
- **FMOD Q&A 11669** — https://qa.fmod.com/t/will-end-of-the-sound-cause-channel-to-be-reused-by-priority-system/11669 — 通道被优先级系统抢占后旧 handle 无效；应在 END 回调里处理结束，而不是继续操作旧通道。
- **FMOD Q&A 21197** — https://qa.fmod.com/t/do-i-need-to-release-an-instance-after-it-plays-to-its-end/21197 — 一般 one-shot 在 start 后立即 release；release 后仍可交互，但声音停止后再调用返回 ERR_INVALID_HANDLE。
- **FMOD Q&A 22678** — https://qa.fmod.com/t/what-is-a-one-shot-sound/22678 — one-shot 是保证有界时间内自行终止的事件，start＋release 即把生命周期交给引擎。
- **Wwise `AkEventCallbackInfo`** — https://www.audiokinetic.com/en/public-library/2026.1.2_9249/?source=SDK&id=struct_ak_event_callback_info.html — AK_EndOfEvent 回调携带 PostEvent() 返回的 playingID，集成层按 playingID 匹配／移除回调包（仅一次浏览器 UA 读到，核查时可能仍不可达）。
- **Wwise Q&A 4547** — https://www.audiokinetic.com/qa/4547/endofevent-stops-working-unity-c — 结束回调间歇失效并打印 EventCallbackPackage not found；依赖 EndOfEvent 回收实例的逻辑会漏执行（CloudFront 403，仅摘要，需复核）。
- **Wwise Q&A 7612** — https://www.audiokinetic.com/qa/7612/crash-fakcomponentcallbackmanager-akcomponentcallback — UnregisterGameObject 已删除 callback package，in-flight 回调仍对已释放对象调用 HandleAction；修复是调用前校验 package 仍在集合内（仅摘要）。
- **Wwise Q&A 5683** — https://www.audiokinetic.com/qa/5683/deadlock-in-ue4-cancelling-callbacks-during-gc — UE4 GC 期间注销回调与事件线程派发互相死锁；退出／切场景时“取消回调”本身会阻塞（仅摘要）。
- **Wwise Q&A 947** — https://www.audiokinetic.com/qa/947/best-way-to-handle-many-short-3d-one-shot-events — 短 3D one-shot 可 PostEvent 后立即 UnregisterGameObj，无需等 EndOfEvent；同一 game object 只有一个位置（仅摘要）。
- **Wwise Unity 文档：AkCallbackType／回调包用法的第二个示例** — https://www.audiokinetic.com/library/edge/?source=Unity&id=unity__wwise__types.html — Wwise Q&A 4547 的最佳答案称改用该页第二个示例后回调恢复，是“复用 cookie 导致回调丢失”之外的官方写法；该域对抓取返回 WAF 挑战，正文未读（摘要）。
- **Wwise Godot integration Nodes wiki** — https://github.com/alessandrofama/wwise-godot-integration/wiki/Nodes — Use Callback＋`_on_end_of_event` 按事件节点接收 EndOfEvent，可看回调落在哪个对象上。
- **SDL_mixer 头文件** — https://github.com/libsdl-org/SDL_mixer/blob/SDL2/include/SDL_mixer.h — `Mix_ChannelFinished` 回调只给 int channel，注释说明 Mix_HaltChannel／Mix_FreeChunk 等也会触发；通道是固定池槽位号、会被后续播放复用。
- **SDL_mixer wiki `Mix_ChannelFinished`** — https://wiki.libsdl.org/SDL2_mixer/Mix_ChannelFinished — 回调在自然结束和 Mix_HaltChannel 停止时都会调用，且只给 channel 序号。
- **SDL_mixer `Mix_HaltChannel`** — https://wiki.libsdl.org/SDL2_mixer/Mix_HaltChannel — 停止通道会在函数返回前同步调用 Mix_ChannelFinished，stop 路径本身就会触发结束回调。
- **SDL_mixer Issue #39** — https://github.com/libsdl-org/SDL_mixer/issues/39 — 原先只有自然结束才回调，2024 年改为任何停止都调用 music finished hook，是相反取舍的公开决策。
- **SDL_mixer PR #495** — https://github.com/libsdl-org/SDL_mixer/pull/495 — 在 channel finish 回调里 Mix_FreeChunk 导致无限递归／栈溢出，展示结束回调与资源释放的权重入陷阱。
- **SDL_mixer Issue #662** — https://github.com/libsdl-org/SDL_mixer/issues/662 — 提案用动态 Mix_Source 对象取代固定 channel，针对“回调只给通道号、无法标识实例”的结构性修法。
- **SDL3_mixer 头文件** — https://github.com/libsdl-org/SDL_mixer/blob/main/include/SDL3_mixer/SDL_mixer.h — 注释明确“暂停的 track 不算 stopped”，停止回调不会在暂停时误发。
- **SDL wiki `MIX_TrackStoppedCallback`** — https://wiki.libsdl.org/SDL3_mixer/MIX_TrackStoppedCallback — 停止回调的触发条件与签名。
- **Defold Sound API** — https://defold.com/ref/sound/ — play 完成回调携带 play_id、message_id 区分自然结束与手动停止；每个 sound 组件 32 个 voice，宿主对象删除后声音仍继续。
- **Defold PR #8544** — https://github.com/defold/defold/pull/8544 — sound_done／sound_stopped 只在带 play_id 播放时发送，是“回调必须绑定实例”的引擎侧实现。
- **GameMaker Audio Playback Ended** — https://manual.gamemaker.io/lts/en/The_Asset_Editors/Object_Properties/Async_Events/Audio_Playback_Ended.htm — async map 用 `was_stopped` 区分自然结束、手动 stop 和 voice stealing，并明确暂停不算结束。
- **GameMaker `audio_stop_sound`** — https://manual.gamemaker.io/lts/en/GameMaker_Language/GML_Reference/Asset_Management/Audio/audio_stop_sound.htm — 明确 audio_stop_sound 会为每个受影响实例触发 Audio Playback Ended（队列还会带 queue_shutdown）。
- **pygame mixer** — https://www.pygame.org/docs/ref/mixer.html — `Channel.set_endevent` 在 stop()／play() 打断时也会立刻投递结束事件，Channel 对象还会被后续 play 复用。
- **pygame Issue #2413** — https://github.com/pygame/pygame/issues/2413 — music.stop() 触发 endevent 但未写进文档，停止被上层当成自然结束。
- **Roblox DevForum：Sound.Ended is broken** — https://devforum.roblox.com/t/soundended-is-broken/66714 — 官方文档称 Sound.Ended 在 :Stop() 时也触发，实测只在自然播完时触发，社区改用 Stopped 事件。
- **Phaser Sound.Events** — https://docs.phaser.io/api-documentation/3.88.2/event/sound-events — 把 COMPLETE（自然播完）与 STOP（显式 stop）拆成两个事件，避免一个回调承担两种语义。

### C. 库与引擎实现：实例身份、旧回调与状态机

这一档在**实现层**解决：用 source 身份、槽位令牌、状态机或显式解绑阻止旧回调命中新播放。它展示每种库的取舍与代价，但多数只覆盖自身 API；跨库移植时要重写身份与清理规则。

**howler.js**

- **core 源码 @003b917** — https://github.com/goldfire/howler.js/blob/003b917c40cb41cf382ba47ae0ed7a35ca2abe76/src/howler.core.js — `_endTimers` 以 sound id 为键、stop／pause 调 `_clearTimer`，`_cleanBuffer`（`_scratchBuffer` 存在时）清 `bufferSource.onended`；`once('end')` 用户回调挂在 Howl 组上且不随 stop 清空。
- **issue #1695** — https://github.com/goldfire/howler.js/issues/1695 — stop 5 次后再让最后一次自然播完，5 个 `once('end')` 同时触发；官方仍标 bug/open。
- **issue #580** — https://github.com/goldfire/howler.js/issues/580 — 第二次播放一开始就触发 end 回调，是“旧结束回调误认新声音已结束”的最小复现。
- **issue #509** — https://github.com/goldfire/howler.js/issues/509 — 暂停后的歌曲仍会在原时长后触发 onend 并自动播下一首，暂停不等于取消结束计时。
- **issue #504** — https://github.com/goldfire/howler.js/issues/504 — pause 不传 id 时 `_clearEndTimer` 收到 undefined，暂停后仍会在原时长触发 onend。
- **issue #1470** — https://github.com/goldfire/howler.js/issues/1470 — 对未加载的 HTML5 音源调用 stop 会把停止动作留在队列里，之后 play 时旧 stop 回调立刻执行。
- **issue #641** — https://github.com/goldfire/howler.js/issues/641 — stop() 不取消加载中的音频，旧曲加载完仍会开播并与新曲重叠；维护者建议 unload，代价是清缓存。
- **issue #1402** — https://github.com/goldfire/howler.js/issues/1402 — 连续 play() 可能复用尚未起播的暂停实例，两个逻辑声音共用一个 ID。
- **issue #1746** — https://github.com/goldfire/howler.js/issues/1746 — `off(event, undefined, id)` 只移除第一个监听器，其余旧 end 回调仍留在实例上。
- **issue #1780** — https://github.com/goldfire/howler.js/issues/1780 — 按 sound ID 移除全部 listener 的修复条目，与 #1746 成对。
- **PR #1648** — https://github.com/goldfire/howler.js/pull/1648 — 入队的内部 stop 丢失 internal 标志，循环重启时误报用户可听的 onstop。
- **issue #245** — https://github.com/goldfire/howler.js/issues/245 — 后台标签 setTimeout 失效导致 end 不推进；维护者明确页面可见性应由应用层处理。
- **issue #974** — https://github.com/goldfire/howler.js/issues/974 — HTML5 模式结束同时触发 stop 与 end，同一自然结束在两种后端发出不同事件组合。
- **PR #675** — https://github.com/goldfire/howler.js/pull/675 — unload 不再触发 end，修复卸载／替换 Howl 时旧 `_onend` 监听被反复触发。
- **issue #963** — https://github.com/goldfire/howler.js/issues/963 — seek 超过 duration 时 end 不触发或提前触发，结束回调依赖位置边界。
- **issue #595** — https://github.com/goldfire/howler.js/issues/595 — pause 后再 stop 不重置播放位置，暂停与停止状态没有单一所有者。
- **issue #1757** — https://github.com/goldfire/howler.js/issues/1757 — 多轨长时间播放时 end 事件延迟或丢失，作者定位到后台标签页定时器节流。
- **issue #128** — https://github.com/goldfire/howler.js/issues/128 — `_nodeById` 找不到 id 时回退到 `_audioNode[0]`，stop／回调可作用到随机声音；固定提交 003b917 的 2.2.4 已改用 `_soundById`，引用前须按该提交复核。
- **issue #138** — https://github.com/goldfire/howler.js/issues/138 — 第二个 sprite 播放后 `stop(instanceID)` 停不掉它，2.0 才修。
- **issue #77** — https://github.com/goldfire/howler.js/issues/77 — sprite 暂停后 resume／stop 位置错乱，位置与停止状态分离。
- **issue #152** — https://github.com/goldfire/howler.js/issues/152 — sprite 持续问题，引用 #77／#193，构成精灵实例生命周期问题链。
- **issue #193** — https://github.com/goldfire/howler.js/issues/193 — 作者对 2.0 重写的说明，解释旧回调参数为何被移除。
- **2.0 CHANGELOG／迁移指南** — https://github.com/goldfire/howler.js/blob/2.0/CHANGELOG.md — 回调参数与播放 API 的破坏性变化，是旧结束回调语义消失的原始依据。
- **discussion #1610** — https://github.com/goldfire/howler.js/discussions/1610 — React cleanup 里 pause 停不住旧实例、unload 才行；旧闭包拿错实例就停错声音。
- **issue #1437** — https://github.com/goldfire/howler.js/issues/1437 — Chrome 下 duration 为 Infinity 时 onEnd 不触发，解码／时长未知时结束回调直接缺失。
- **issue #1505** — https://github.com/goldfire/howler.js/issues/1505 — Howler 缓存事件处理函数，替换监听器后旧处理仍可能被调用。
- **issue #1753** — https://github.com/goldfire/howler.js/issues/1753 — iOS 从后台返回后音频不恢复，不能复用旧节点与旧播放会话。
- **howler.js 官方入口** — https://github.com/goldfire/howler.js — 官方把 onend（播完或每轮循环）与 onstop（被停止）拆成两个事件，stop() 重置 seek、unload() 立即停全部声音。
- **作者发布文 Howler v2.0** — https://goldfirestudios.com/howler-js-v2-0-released — 作者自述 1.x 的多声音／精灵混乱促成 Howler／Howl／Sound 三层与逐次播放实例。
- **saga-playground 提交 c178346** — https://github.com/saga-playground/howler.js/commit/c178346b0f8eb11d21760bff244c934fc84b9762 — 明确选择“HTML5 模式结束时不发 stop”，是与 #974 方向相反的实现取舍。
- **react-howler** — https://github.com/thangngoc89/react-howler — Howler 的 React 封装，可查组件卸载时 stop／unload 的实际做法。

**Tone.js**

- **`Player.ts`** — https://github.com/Tonejs/Tone.js/blob/dev/Tone/source/buffer/Player.ts — 每次 start 新建 ToneBufferSource 放入 `_activeSources`；`_onSourceEnd(source)` 按 source 身份移除后触发 `onstop(this)`，但 onstop 是 Player 级、不告诉是哪一次 start 结束。
- **issue #958** — https://github.com/Tonejs/Tone.js/issues/958 — 维护者复现 Player.stop() 不触发 onstop，原因是 dispose() 立即清空 onstop 回调；销毁会静默撤销回调。
- **`OneShotSource.ts`** — https://github.com/Tonejs/Tone.js/blob/dev/Tone/source/OneShotSource.ts — `_onended()` 触发后把 `onended` 覆盖为 noOp，保证结束回调只执行一次，可直接借为防重入实现。
- **`Source.ts`** — https://github.com/Tonejs/Tone.js/blob/dev/Tone/source/Source.ts — StateTimeline 加 `cancel(computedTime)` 的调度式所有权，不靠布尔标志判断“当前这一声”。
- **issue #519** — https://github.com/Tonejs/Tone.js/issues/519 — 作者明确命名 onstop，因为同一个 Player 可多次 start／stop，事件语义按实例生命周期而非底层 buffer 结束定义。
- **commit d507188** — https://github.com/Tonejs/Tone.js/commit/d5071881495e34c7323a27c2c6e2bab7fc38b6f3 — 把底层 BufferedSource 的结束事件代理到 Player 层，是“播放完成”从源节点上移到可控实例的一手实现。
- **issue #1501** — https://github.com/Tonejs/Tone.js/issues/1501 — 状态机先置 stopped 导致 `_stopSource` 早退，原生 ConstantSourceNode 持续累积；逻辑停止与原生停止脱节。
- **PR #1522** — https://github.com/Tonejs/Tone.js/pull/1522 — 用 started 标志确保 stop 生效后停止原生节点，修复“原生是否已启动”与“Tone 状态是否 stopped”混为一谈。
- **PR #1393** — https://github.com/Tonejs/Tone.js/pull/1393 — onended 时清理 oscillator 连接；高频触发后结束回调未释放音频图连接导致内存泄漏。
- **issue #1379** — https://github.com/Tonejs/Tone.js/issues/1379 — 高频 triggerAttackRelease 造成振荡器泄漏。
- **PR #1340** — https://github.com/Tonejs/Tone.js/pull/1340 — `_stopSource` 守卫的回归来源，使停止路径提前返回。
- **PR #1458** — https://github.com/Tonejs/Tone.js/pull/1458 — 延迟启动时保留原生节点启动时刻，与 #1501 的停止守卫相互影响。
- **issue #1502** — https://github.com/Tonejs/Tone.js/issues/1502 — transport.stop 后残留 pending tick 会在下次 start 重放，停止没有清空旧调度队列。

**Phaser**

- **`WebAudioSound.js` v3.80.1** — https://github.com/phaserjs/phaser/blob/v3.80.1/src/sound/webaudio/WebAudioSound.js — onended 里用 `ev.target === _this.source` 判断回调是否属于当前节点；`stopAndRemoveBufferSource` 先置空 source 再 stop。
- **issue #6657** — https://github.com/phaserjs/phaser/issues/6657 — 真实复现“end 后立刻 play，下一次 update 仍看到 hasEnded=true 又把新播放停掉”。
- **commit 2dfd421** — https://github.com/phaserjs/phaser/commit/2dfd421495c4fafdf385ddc7fd9a001ccafdbfc0 — 在 `stopAndRemoveBufferSource` 末尾重置 hasEnded，专门修“旧结束回调杀死新声音”的竞态。
- **v3.80 官方 changelog** — https://github.com/phaserjs/phaser/blob/v3.80.1/changelog/3.80/CHANGELOG-v3.80.md — 写明 onended 可能在声音重播后才迟到触发及对应修复（Fix #6657）。
- **`WebAudioSound.js` v3.88.2** — https://github.com/phaserjs/phaser/blob/v3.88.2/src/sound/webaudio/WebAudioSound.js — 后续版本仍保留 source 身份判定，可核对修复是否延续。
- **`DESTROY_EVENT.js`** — https://github.com/phaserjs/phaser/blob/v3.88.2/src/sound/events/DESTROY_EVENT.js — destroy 与 complete／stop 分开派发，销毁不会被伪装成播放完成。
- **`BaseSoundManager.js`** — https://github.com/phaserjs/phaser/blob/v3.80.1/src/sound/BaseSoundManager.js — 声音实例的集合、查找与移除路径，用来核对谁负责释放已结束或被替换的实例。
- **`WebAudioSoundManager.js`** — https://github.com/phaserjs/phaser/blob/v3.80.1/src/sound/webaudio/WebAudioSoundManager.js — AudioContext 挂起／恢复与实例生命周期，覆盖暂停、失焦和退出再进入。
- **issue #2548** — https://github.com/phaserjs/phaser/issues/2548 — 音频循环后 stop()／destroy() 失效，补足 loop-end 后的所有权回收反例。
- **issue #2834** — https://github.com/phaserjs/phaser/issues/2834 — 请求 SoundManager.destroyAll()，说明库长期缺少统一销毁全部实例的入口。
- **issue #6645** — https://github.com/phaserjs/phaser/issues/6645 — destroy 后 isPlaying 仍为 true，状态所有权留在已销毁对象上。
- **issue #6702** — https://github.com/phaserjs/phaser/issues/6702 — 后台标签触发下一轮 loop 会让循环音频停止，循环实例的续播所有权会丢失。
- **Phaser Discourse 8228** — https://phaser.discourse.group/t/fade-out-sound-outside-of-its-duration/8228/1 — 淡出过程中声音被 stop 销毁，外部补间仍持有旧对象并报 TypeError；改用 complete 事件而非 stop 终止补间。
- **HTML5Gamedevs 5290** — https://www.html5gamedevs.com/topic/5290-removing-old-sound-references-after-stop/ — 用户发现 stop 后 `Game.sound._sounds` 仍保留旧声音引用；维护者确认 stop 不等于移除，后补 destroy／remove API。

**three.js**

- **`Audio.js`** — https://github.com/mrdoob/three.js/blob/dev/src/audio/Audio.js — stop()／pause() 在 `source.stop()` 后立即 `source.onended = null`，用解绑而不是代次判断阻止旧回调；stop(delay) 也立即解绑，代价是延迟停止不再触发 onEnded。
- **PR #29376** — https://github.com/mrdoob/three.js/pull/29376 — 给 Audio.stop 增加 delay，对齐 Web Audio 的 stop(when) 语义并合并进 r169，展示“延迟停止”与结束回调／进度状态的取舍。
- **PR #29930** — https://github.com/mrdoob/three.js/pull/29930 — onEnded 重置 progress，修复结束回调未重置导致下次播放从旧位置开始。
- **PR #14591** — https://github.com/mrdoob/three.js/pull/14591 — 修复为 stop()／pause() 只置 isPlaying=false、不执行 onended，给出“停止不重放结束事件”的显式实现。
- **issue #14587** — https://github.com/mrdoob/three.js/issues/14587 — isPlaying 不正确导致声音重复播放的原始报告。
- **issue #8176** — https://github.com/mrdoob/three.js/issues/8176 — Audio 未暴露 Web Audio 事件，解释为何只能在库内做 onEnded 兜底。
- **issue #29375** — https://github.com/mrdoob/three.js/issues/29375 — Audio.stop() 缺少 delay 参数，无法做淡出或与 Web Audio 定时 stop 对齐。
- **three.js Discourse 42247** — https://discourse.threejs.org/t/how-to-determine-the-end-of-audio-playback/42247 — 用户实测 onEnded 只在显式 stop 后触发，并给出直接挂 source.onended 的替代做法。

**PlayCanvas**

- **`SoundInstance` @9edc208** — https://github.com/playcanvas/engine/blob/9edc208f23b99f0fb71d40e9d216821fe2a5788a/src/platform/sound/instance.js — stop() 前 `_suspendEndEvent++`，让紧随 source.stop() 触发的 ended 在 `_onEnded` 里被计数吞掉，是“停止时显式抑制自己的结束回调”的令牌式做法。
- **API `SoundInstance`** — https://api.playcanvas.com/engine/classes/SoundInstance.html — 官方 state／end／stop 契约，可核对 instance.js 的行为。
- **PR #9231** — https://github.com/playcanvas/engine/pull/9231 — looping 实例把 duration 传给 start() 导致只播一轮就 fire 'end'；关闭 loop 时安排的绝对 stop 截止时间在重开 loop 后仍生效，必须重排而非取消。
- **PR #9432** — https://github.com/playcanvas/engine/pull/9432 — 官方文档化所有权：slot 持有声音设置，每次播放创建 instance，manager 拥有共享 AudioContext。
- **`SoundManager` @9edc208** — https://github.com/playcanvas/engine/blob/9edc208f23b99f0fb71d40e9d216821fe2a5788a/src/platform/sound/manager.js — SoundManager 独占 AudioContext 和 Listener，并通过 suspend／resume／destroy 事件统一管理所有实例。
- **`sound.js`（main）** — https://github.com/playcanvas/engine/blob/main/src/platform/sound/sound.js — Slot 如何持有并复用 instances，决定替换播放时旧实例是否被正确停掉。
- **`manager.js`（main）** — https://github.com/playcanvas/engine/blob/main/src/platform/sound/manager.js — 全局 suspend／resume 与实例集合管理，覆盖暂停、失焦与退出场景。
- **issue #4712** — https://github.com/playcanvas/engine/issues/4712 — 循环音频同时设置 start time 与 duration 在 Firefox／Chromium 只播一次，循环与停止截止时间在参数层互相污染。
- **issue #4407** — https://github.com/playcanvas/engine/issues/4407 — Sound Slot duration 超过素材时长时只播一小段，属于实例参数所有权的边界案例。
- **issue #2850** — https://github.com/playcanvas/engine/issues/2850 — 同帧 play 后 stop 停不掉，暴露停止请求与实例创建之间的帧内顺序竞争。
- **issue #3082** — https://github.com/playcanvas/engine/issues/3082 — 改 currentTime 时停止回调未被正确挂起，实例时间被外部改写后 stop 回调仍会触发。
- **PlayCanvas Forum 27825** — https://forum.playcanvas.com/t/looped-audio-stops-in-mozilla/27825 — 用户实测的绕法（去掉 start time／duration、补静音、gapless MP3）说明浏览器差异下循环与停止只能靠参数回避。
- **PlayCanvas Forum 10185** — https://forum.playcanvas.com/t/sound-equivalent-function-of-texture-destroy/10185 — 社区追问声音实例的 destroy 语义，暴露释放接口缺口与所有权归属不清。
- **PlayCanvas Forum 29127** — https://forum.playcanvas.com/t/avoid-multiple-sound-instances/29127 — 讨论重叠播放时如何只保留一个实例，是“替换后旧实例”问题的实践版本。

**PixiJS Sound**

- **issue #258** — https://github.com/pixijs/sound/issues/258 — 窗口失焦或已暂停时 stop() 不触发 'stop'，实例留在 `_instances`、完成回调不执行；官方修复让暂停实例 stop 后彻底销毁。
- **v5.2.4 release** — https://github.com/pixijs/sound/releases/tag/v5.2.4 — 修复后对暂停实例 stop 会永久停止并销毁，随后把 paused 设回 false 会抛错，说明“停止即销毁”与“暂停可复用”必须二选一并明确所有权。
- **issue #211** — https://github.com/pixijs/sound/issues/211 — pause 后 stop 再 play 报错，暂停再停止的序列未清状态。
- **PR #270** — https://github.com/pixijs/sound/pull/270 — 只重置 `_pausedReal`，仍未发 stop，展示不完整修法。
- **PR #294** — https://github.com/pixijs/sound/pull/294 — 正确修法让 stop 在真正 paused 状态也生效并发出 stop，使 Sound 能移除并池化实例。
- **PR #307** — https://github.com/pixijs/sound/pull/307 — 把 #294 回移到 5.2.4，给出受影响版本边界。
- **PR #295** — https://github.com/pixijs/sound/pull/295 — resume 不应重启未暂停实例，修复恢复动作误伤未暂停实例。
- **`WebAudioInstance.ts` @a84c214 L111-L115** — https://github.com/pixijs/sound/blob/a84c2149e3c61fde7bec9284fdc2879a49d5230f/src/webaudio/WebAudioInstance.ts#L111-L115 — stop() 以 `_source` 存在为前置，pause 清空 `_source` 后 stop 直接不处理，是暂停／停止所有权断裂的精确代码位置。
- **`Sound.ts` @a84c214 L766-L776** — https://github.com/pixijs/sound/blob/a84c2149e3c61fde7bec9284fdc2879a49d5230f/src/Sound.ts#L766-L776 — `_onComplete` 负责把实例从 `_instances` 移除；stop 不触发完成路径时实例表和音频图都会残留。
- **`Sound.ts`（main）** — https://github.com/pixijs/sound/blob/main/src/Sound.ts — stop() 遍历 `_instances` 与 complete 回调的注册位置，便于核对旧回调清理。
- **issue #297** — https://github.com/pixijs/sound/issues/297 — play 同一 tick 调 stop，HTMLAudio 元素继续播放且实例已脱离 instances，之后没有任何句柄能停它。
- **issue #287** — https://github.com/pixijs/sound/issues/287 — 窗口失焦时在 context 仍渲染时执行 source.stop(0) 造成爆音；停止时机与淡出取消需要分开处理。
- **issue #311** — https://github.com/pixijs/sound/issues/311 — play 后立刻 stop，HTMLAudio 仍在播，停止所有权在实例与元素之间分裂。

**Babylon.js**

- **`sound.pure.ts`** — https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/Audio/sound.pure.ts — onended／onEndedObservable 与 stop(time) 的实现，核对回调究竟由哪一层发出。
- **PR #13472** — https://github.com/BabylonJS/Babylon.js/pull/13472 — 修正 sound source 的 onended 处理：pause 时 onEndedObservable 误触发、应只在 stop 时触发。
- **PR #14047** — https://github.com/BabylonJS/Babylon.js/pull/14047 — 解锁前的 stop 丢失导致 isPlaying 仍为 true，属性状态与真实播放脱节。
- **Babylon Forum 42266** — https://forum.babylonjs.com/t/sound-pileup-in-chrome/42266 — 社区复现解锁前 stop 丢失、所有排队声音一起响。
- **Babylon Forum 36668** — https://forum.babylonjs.com/t/pausing-and-playing-an-audio-with-offset-restarts-it-from-the-beginning-instead-of-the-current-position/36668 — 带 offset 暂停再播从开头重来，#13472 的来源报告，展示暂停／恢复错误地走结束路径。

**Kira／rodio／bevy／bevy_kira**

- **Kira `StaticSoundHandle` 0.6** — https://docs.rs/kira/0.6.0/kira/sound/static_sound/struct.StaticSoundHandle.html — 文档明确 stop 后不能重启，必须新建播放，把“停止即终结”写进类型契约。
- **Kira `StaticSoundHandle` latest** — https://docs.rs/kira/latest/kira/sound/static_sound/struct.StaticSoundHandle.html — stop() 是带淡出的终态，播放状态只能靠 state() 轮询，没有单声完成回调。
- **Kira `PlaybackState`** — https://docs.rs/kira/latest/kira/sound/enum.PlaybackState.html — playing／paused／stopped 状态枚举，可直接映射暂停／停止判定。
- **Kira issue #79** — https://github.com/tesselode/kira/issues/79 — 流式声音的停止路径与普通声音不同，涉及句柄失效和资源释放。
- **Kira issue #57** — https://github.com/tesselode/kira/issues/57 — 讨论按轨批量停止时如何避免误停后来启动的实例。
- **Kira issue #150** — https://github.com/tesselode/kira/issues/150 — 请求 stop_at 定时停止；停止需要可调度且可取消，否则替换声音后旧 stop 仍会落地。
- **rodio commit 44b92d4** — https://github.com/RustAudio/rodio/commit/44b92d43e92d657f46d58c3c64664b4512e20b09 — Sink::stop 通过清空队列停止，append 在 stop 后需要显式重启（#464 修复）；队列式所有者的 stop 语义并不即时。
- **rodio `Sink` 0.21.1** — https://docs.rs/rodio/0.21.1/rodio/struct.Sink.html — drop Sink 停全部声音、detach 才让声音继续、stop() 清空队列、pause() 保留位置，可直接映射“句柄即所有权”。
- **rodio issue #278** — https://github.com/RustAudio/rodio/issues/278 — 缺少单曲结束回调／信号，只能整 sink 处理或轮询。
- **rodio issue #619** — https://github.com/RustAudio/rodio/issues/619 — 讨论把控制粒度从 Sink 下放到单个 source，是对“实例级句柄”缺失的正面修法。
- **rodio issue #315** — https://github.com/RustAudio/rodio/issues/315 — 停止后的 Sink 不能再 append，复用旧句柄会对新播放产生副作用。
- **rodio issue #496** — https://github.com/RustAudio/rodio/issues/496 — Sink 播放结束时 panic，收尾阶段的析构／线程结束会崩。
- **rodio issue #462** — https://github.com/RustAudio/rodio/issues/462 — Sink::stop 后无法重启或复用，停止把整个 sink 永久置于 stopped。
- **rodio issue #472** — https://github.com/RustAudio/rodio/issues/472 — stop 后 Sink 永久不播放的历史 bug，“停”必须与“重建”分离。
- **rodio issue #868** — https://github.com/RustAudio/rodio/issues/868 — 以 Stoppable／Skippable 的 exhaustion 上报结束，是 ended 回调之外的结束语义。
- **Bevy issue #9324** — https://github.com/bevyengine/bevy/issues/9324 — 0.11 despawn 音频实体不会停声，需先 sink.stop()；移除 sink 而保留 source 反而会重新播放。
- **Bevy PR #9336** — https://github.com/bevyengine/bevy/pull/9336 — #9324 的修复，讨论 AudioSink 的 drop、后端 detach 与实体销毁时声音停止归谁负责。
- **Bevy `AudioSink`** — https://docs.rs/bevy/latest/bevy/audio/struct.AudioSink.html — 以 ECS 组件持有播放控制，实体销毁即停，是“所有权随实体”的现代实现。
- **Bevy `PlaybackSettings`** — https://docs.rs/bevy/latest/bevy/audio/struct.PlaybackSettings.html — Despawn／Remove 等结束策略明确规定结束动作由谁执行。
- **bevy_kira_audio 仓库** — https://github.com/NiklasEi/bevy_kira_audio — Bevy 集成层同时提供单实例控制与整通道控制，区分自然结束后效果尾音延续与主动 stop 时效果一起淡出。
- **bevy_kira_audio 文档** — https://docs.rs/bevy_kira_audio/latest/bevy_kira_audio/ — kira 集成层的停止／完成控制接口，可对照 Bevy 原生 sink 的所有权差异。
- **bevy_kira_audio 0.27.0** — https://github.com/niklasei/bevy_kira_audio/releases/tag/v0.27.0 — 每个 sound／channel 可挂 effect，自然结束时 EffectTail 继续响完、被 stop 时随声音淡出；是“结束原因决定资源释放路径”的现成语义。
- **bevy_kira #54** — https://github.com/NiklasEi/bevy_kira_audio/issues/54 — stop 后 PlaybackState 仍停在 Playing／Stopping，实例状态机不随 stop 收敛。
- **bevy_kira #112** — https://github.com/NiklasEi/bevy_kira_audio/issues/112 — stop 约 50ms 才生效，新 play 与旧声音在同通道重叠，停止是命令队列里的延迟动作。
- **bevy_kira #39** — https://github.com/NiklasEi/bevy_kira_audio/issues/39 — 同一 source 播在两个 channel，stop 一个 channel 却停掉全部声音，暴露同源多实例的句柄粒度问题。
- **bevy_kira #46** — https://github.com/NiklasEi/bevy_kira_audio/issues/46 — 播放结束后 `audio_output.instances` 不清理，状态更新持续跑，句柄表未随实例结束收缩。
- **bevy_kira #137** — https://github.com/NiklasEi/bevy_kira_audio/issues/137 — DynamicChannel 不保存状态，is_playing 恒 false，停止判定失真。
- **bevy_kira #118** — https://github.com/NiklasEi/bevy_kira_audio/issues/118 — iOS 上停止操作会停掉全部音频，通道级所有权未隔离。
- **bevy_kira #98** — https://github.com/NiklasEi/bevy_kira_audio/issues/98 — 允许在 pausing／stopping 过程中 resume，需要定义“停止中”的反向状态转换。
- **Firewheel** — https://github.com/BillyDM/Firewheel — 0.14.0（2026-09-05）Rust 音频图引擎，MIT／Apache-2.0，无锁实时设计、silence optimization，计划 upstream 为 Bevy 默认音频引擎。
- **Firewheel DESIGN_DOC** — https://github.com/BillyDM/Firewheel/blob/main/DESIGN_DOC.md — 图引擎节点／流生命周期，是 Rust 侧所有权模型的原始依据。
- **bevy_seedling** — https://github.com/CorvusPrudens/bevy_seedling — Firewheel 的 Bevy 集成并明确取代内置 bevy_audio，可对照 SamplePlayer 的停止／完成处理。
- **Symphonium** — https://codeberg.org/Meadowlark/symphonium — Firewheel README 推荐的解码库，属同一 Bevy 音频栈的配套实现。

**miniaudio／SoLoud／flutter_soloud**

- **miniaudio** — https://github.com/mackron/miniaudio — C 单头文件音频库，用 ma_sound 句柄 + `ma_sound_set_end_callback` 管完成；源码刻意把结束回调推迟到下一处理步，使回调内 `ma_sound_is_playing()` 已为 false。
- **miniaudio 手册** — https://miniaud.io/docs/manual/index.html — 结束回调从音频线程触发、只在到达结尾时发生，且回调内不能反初始化声音。
- **miniaudio issue #719** — https://github.com/mackron/miniaudio/issues/719 — fade stop 不触发 end 回调；维护者认为调用者自己知道 stop，不需要单独 stop 回调。
- **miniaudio issue #897** — https://github.com/mackron/miniaudio/issues/897 — `ma_sound_stop` 后回调只在文件自然读完时触发，调用方无法知道音频线程何时不再使用该 sound，存在释放竞态。
- **SoLoud 仓库** — https://github.com/jarikomppa/soloud — handle + voice group + max active voice 的游戏音频引擎；a1dbv 只分析了 Mindustry 锁定的 Anuken fork，未对上游 API 的 stop、voice group 与 voice 失效规则做对照。
- **SoLoud `soloud.h`** — https://github.com/jarikomppa/soloud/blob/master/include/soloud.h — 把“声音是否还活着”收敛为 `isValidVoiceHandle()` 检查。
- **SoLoud coremisc** — https://sol.gfxile.net/soloud/coremisc.html — 官方给出手柄失效后仍可安全校验的接口，是“回调里先验句柄再操作”的现成做法。
- **SoLoud 文档：句柄安全** — https://solhsa.com/soloud/index.html — 与“旧句柄必须失效”相反的所有权策略：句柄只变空操作，不会误控复用后的新声音。
- **SoLoud 文档：虚拟声部与按音量抢占** — https://solhsa.com/soloud/voicemanagement.html — 超过可听声部时的暂停／恢复与 must-tick 规则，对应“实例被抢占停止后回调归谁”。
- **SoLoud PR #402** — https://github.com/jarikomppa/soloud/pull/402 — SDL3 后端上游 PR，gecko0307 fork 的来源，涉及 voice 停止与设备生命周期。
- **gecko0307/soloud fork** — https://github.com/gecko0307/soloud — 原 SoLoud 自 2024-08 基本停更，这个 2026-08-17 新建的 fork 补 SDL3／DirectSound 后端和 CMake 3、9 月底仍在推送（1★，采用前需自核）。
- **flutter_soloud issue #83** — https://github.com/alnitak/flutter_soloud/issues/83 — handle 在 stop 或自然结束后立即失效，引擎没有保活机制；只能在用前查 isValid 或订阅失效事件。
- **flutter_soloud issue #312** — https://github.com/alnitak/flutter_soloud/issues/312 — 连续 stop 与尚未派发的 voice-ended 回调竞争，回调可能永远不来，句柄记账失配。
- **flutter_soloud PR #316** — https://github.com/alnitak/flutter_soloud/pull/316 — #312 的复现测试，可直接借作“stop 早于结束回调”的测试输入与断言蓝本。
- **flutter_soloud `SoundEventType`** — https://pub.dev/documentation/flutter_soloud/latest/flutter_soloud/SoundEventType.html — 提供 handleIsNoMoreValid 事件，让上层在句柄失效时收到通知。

**libGDX／MonoGame／SFML／raylib／OpenAL／Oboe**

- **libGDX 仓库** — https://github.com/libgdx/libgdx — Sound.play() 返回 long 实例 id、stop(id)，而 Music 只有一个 setOnCompletionListener；同一 Music 多次播放共用回调，正好暴露“旧回调释放新实例”。
- **libGDX `Music.java`** — https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/audio/Music.java — javadoc 只说“播放中到达结尾”时回调，并未承诺 stop 时触发。
- **libGDX issue #2268** — https://github.com/libgdx/libgdx/issues/2268 — 从 onCompletion 里重播被随后的 stop 取消，回调先于 stop 执行。
- **libGDX commit 0dabd0c** — https://github.com/libgdx/libgdx/commit/0dabd0c — 最小修复就是交换顺序（先 stop 再通知完成），给出“清理先于回调”的实现原则。
- **libGDX issue #2098** — https://github.com/libgdx/libgdx/issues/2098 — 音效播完自动 dispose 的提案，涉及谁有权销毁实例。
- **libGDX issue #4101** — https://github.com/libgdx/libgdx/issues/4101 — 循环音乐不触发 completion listener，结束回调只覆盖非循环路径。
- **MonoGame 仓库** — https://github.com/MonoGame/MonoGame — SoundEffectInstance 只有 State 与 Play／Stop、没有完成事件，必须轮询。
- **MonoGame `SoundEffectInstance` 文档** — https://docs.monogame.net/api/Microsoft.Xna.Framework.Audio.SoundEffectInstance.html — Stop(bool immediate) 允许先走 release／fade 再停，停止不是瞬时状态。
- **MonoGame issue #7648** — https://github.com/MonoGame/MonoGame/issues/7648 — stop 后立刻重播导致旧 voice 未回收，最终耗尽 256 个实例。
- **MonoGame PR #7776** — https://github.com/MonoGame/MonoGame/pull/7776 — 官方池化修复，说明实例池必须按播放代次回收而不是只改状态位。
- **MonoGame issue #6814** — https://github.com/MonoGame/MonoGame/issues/6814 — 暂停过的 source 未归还，暂停路径造成 OpenAL source 泄漏。
- **MonoGame issue #6121** — https://github.com/MonoGame/MonoGame/issues/6121 — Stop() 的循环音行为在 Windows 与 DesktopGL 不同，跨平台不能假设停止后回调／状态一致。
- **SFML 仓库** — https://github.com/SFML/SFML — sf::Sound 提供 stop／getStatus，但没有结束事件。
- **SFML `SoundSource` 文档** — https://www.sfml-dev.org/documentation/3.0.0/classsf_1_1SoundSource.html — 只提供 Stopped／Paused／Playing 状态轮询而没有结束回调。
- **SFML `sf::Sound` 文档** — https://www.sfml-dev.org/documentation/3.0.0/classsf_1_1Sound.html — stop 只改 Status、没有结束回调，作为“无回调”反例界定需求边界。
- **SFML PR #3522** — https://github.com/SFML/SFML/pull/3522 — 修复音频引擎读取已销毁对象；停止／销毁后音频线程仍可能读到已释放节点。
- **raylib 仓库** — https://github.com/raysan5/raylib — IsSoundPlaying／StopSound 轮询式 API，没有完成回调，是头部框架里最简的所有权模型。
- **OpenAL Soft 仓库** — https://github.com/kcat/openal-soft — 只暴露 source 状态查询、没有播放结束回调，实例回收必须轮询 AL_SOURCE_STATE。
- **OpenAL Soft issue #1003** — https://github.com/kcat/openal-soft/issues/1003 — SOFT_events 队列溢出会丢事件，即使提供事件回调也不能当作可靠所有权信号。
- **Oboe wiki《How to avoid crashes》** — https://github.com/google/oboe/wiki/TechNote_HowToAvoidCrashes — 音频回调可能在 close 之后才到；用 shared_ptr／静态生命周期，不要在回调里 delete 或 reset 关闭中的对象。
- **Oboe issue #820** — https://github.com/google/oboe/issues/820 — 用 shared_ptr 保活流与回调对象，避免 close 后回调访问已释放内存。
- **Oboe wiki《TechNote_ReleaseBuffer》** — https://github.com/google/oboe/wiki/TechNote_ReleaseBuffer — 断连时 releaseBuffer 断言／崩溃，说明关闭后回调仍可能运行。
- **Oboe wiki《CrashUAF_ObtainReleaseBuffer》** — https://github.com/google/oboe/wiki/CrashUAF_ObtainReleaseBuffer — 关闭／停止音频流后回调仍可能运行并访问已释放缓冲。

**引擎周边管理器**

- **godot_sound_manager `Sounds.md`** — https://github.com/nathanhoad/godot_sound_manager/blob/main/docs/Sounds.md — play_sound 返回 AudioStreamPlayer，但 stop_sound 只接收 AudioStream，无法按返回的实例停止同源多发声。
- **godot_sound_manager 仓库** — https://github.com/nathanhoad/godot_sound_manager — 831★ 的 Godot 声音管理器，池化播放器 + 音乐 crossfade；封装层只到播放／停止／总线，未提供逐实例结束回调的所有权规则。
- **Simple-Unity-Audio-Manager** — https://github.com/jackyyang09/Simple-Unity-Audio-Manager — Unity 社区头部 AudioSource 管理器（762★，Asset Store 在售），集中处理播放／停止／淡入淡出与 3D 声源。
- **Unity-Audio-Pooling（adammyhre）** — https://github.com/adammyhre/Unity-Audio-Pooling — 把 AudioSource 做成 SoundEmitter 池、用 SoundBuilder 管生命周期与真实 voice 数；Unity 缺逐实例回调时最常见的手写方案。
- **AudioConductor（CyberAgent）** — https://github.com/CyberAgentGameEntertainment/AudioConductor — 实例化 Conductor，cue／track 模型提供 Play／PlayOneShot／Stop／Pause／Resume／Fade／Query／Dispose，最接近“实例 owner”的 Unity 开源实现。
- **BroAudio** — https://github.com/man572142/BroAudio — Unity 音频中间件（131★，2026-10 仍在提交），用 clip／track／group／bus 组织播放与停止。
- **BroAudio `IAudioPlayer`** — https://man572142s-organization.gitbook.io/broaudio/reference/api-documentation/interface/iaudioplayer — 池化回收后 cached IAudioPlayer 不再有效，访问会被拒绝并记 warning。
- **BroAudio AudioPlayer 页** — https://man572142s-organization.gitbook.io/broaudio/core-features/audio-player — 播放结束后 player 回池、可能被其他声音复用，缓存引用再访问会被取消并打 warning（1.04 起）。
- **BroAudio Duplicate SoundID** — https://man572142s-organization.gitbook.io/broaudio/others/known-issues/duplicate-soundid-issue.md — SoundID 重复会让句柄指向错误实体，作者给出自动修复策略。
- **Audio-Manager-for-Unity（Microsoft）** — https://github.com/microsoft/Audio-Manager-for-Unity — 节点式 Unity 音频行为工具（193★），2023-08 后停更，只作历史样本。
- **Moolt/UnityAudioSourceEvents** — https://github.com/Moolt/UnityAudioSourceEvents — 把 isPlaying 轮询包装成 Start／Pause／Resume／Stopped 事件，说明 Unity 原生没有结束回调，社区靠轮询补。
- **Unity ObjectPool 手册** — https://docs.unity3d.com/6000.0/Documentation/Manual/performance-reusable-code.html — Release 时重置状态／回调，开启 collectionCheck 抓 double release——池化实例复用前必须清旧回调。
- **Unity `Pool.ObjectPool<T>` API** — https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Pool.ObjectPool_1.html — 通用对象池 API 自身不重置对象状态，复用 AudioSource 时旧播放状态与回调需要调用方显式清理。
- **Game Programming Patterns: Object Pool** — https://gameprogrammingpatterns.com/object-pool.html — 池对象归还后不得继续持有引用；回调里存池对象会读到被复用的新状态。

### D. 真实故障、修复与复现记录

这一档在**故障层**补齐现场：结束信号缺失、stop 误触发、退出后仍播、回池后旧回调。它证明问题真实存在并给出修复位置，但修复多针对单库单版本，不能直接当作通用方案。

**任务固定来源（job.md 给定 SHA，收集轮已读）**

- **MOBA-Like `docs/audio-critical.md`** — https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/docs/audio-critical.md — pause／dispose 停当前与未来声源、声部由 onended 释放；restart 换 owner 与去重游标；25 ms 起播间隔、活动／已排最多 8、未来计划最多 4、距当前 AudioContext 最多 100 ms；超限丢新事件、不抢占旧计划。这是本卡责任链的基准实现。
- **howler.js `src/howler.core.js` @003b917** — https://github.com/goldfire/howler.js/blob/003b917c40cb41cf382ba47ae0ed7a35ca2abe76/src/howler.core.js — 任务固定源；组级 `once('end')` 与 per-sound `_endTimers` 的所有权差异见 C 段拆解。
- **Mindustry `SoundPriority.java` @d1e0307** — https://github.com/Anuken/Mindustry/blob/d1e0307d3906bb350e80d8969a2464ed0b771ffb/core/src/mindustry/audio/SoundPriority.java — 任务固定源；按类别与优先级决定谁获准发声，是“并发预算在原生提交时确定”的现场。
- **Arc `Sound.java` @46c0956** — https://github.com/Anuken/Arc/blob/46c0956944af81db1145625e07108c196d94e260/arc-core/src/arc/audio/Sound.java — 任务固定源；`play()` 返回 long 实例 id，停止按 id；与 libGDX 的 long id、Godot 的 int ID 同型。

**Godot 结束信号的缺失与误用**

- **issue #33579** — https://github.com/godotengine/godot/issues/33579 — 用户把 finished 接到 play()，按停止键反而重新播放，直接复现“停止触发结束回调导致退出后又进入／重播”。
- **issue #56156** — https://github.com/godotengine/godot/issues/56156 — 4.0-dev 中部分 mp3／ogg 不触发 finished，依赖结束信号回收或续播的实例会永久占用。
- **issue #43378** — https://github.com/godotengine/godot/issues/43378 — AudioStreamGenerator 播完不发 finished，只能轮询可用帧数。
- **issue #30737** — https://github.com/godotengine/godot/issues/30737 — 循环音频永不发 finished，用户只能关闭 loop 再手动重播。
- **proposal #1641** — https://github.com/godotengine/godot-proposals/issues/1641 — 社区提出的替代设计是新增 looped 信号而不改 finished，并已链接开放实现 PR。
- **issue #88941** — https://github.com/godotengine/godot/issues/88941 — AudioStreamPlaybackPolyphonic 不逐流发 finished，也不能从返回 ID 取回流引用。
- **issue #107644** — https://github.com/godotengine/godot/issues/107644 — AudioStreamPlayer3D 提前发 finished，清理逻辑会在声音仍在播时就释放槽位。
- **issue #71640** — https://github.com/godotengine/godot/issues/71640 — 无音频输出设备时 finished 永不发出，靠回调回收实例的逻辑会悬挂。
- **issue #75089** — https://github.com/godotengine/godot/issues/75089 — AudioStreamPolyphonic 下不发出 finished，按 finished 释放短命播放器会完全不触发、泄漏实例。
- **issue #87802** — https://github.com/godotengine/godot/issues/87802 — finished 信号不发，根因是 process 未启用，防止把“没回调”一律归为所有权问题。
- **PR #87830** — https://github.com/godotengine/godot/pull/87830 — 修复 AudioStreamPlayer 不触发 finished 的 process 错误，说明自然结束信号依赖帧循环，不能当唯一清理时机。
- **PR #87061** — https://github.com/godotengine/godot/pull/87061 — 以 `_set_process` 引入 finished 回归的来源，便于在源码里核对通知类型与处理分支。
- **issue #89723** — https://github.com/godotengine/godot/issues/89723 — AudioStreamSynchronized 播完不把 playing 置 false、也不发 finished。
- **issue #93904** — https://github.com/godotengine/godot/issues/93904 — Web 导出时 finished 不触发，平台层结束检测差异。
- **issue #43040** — https://github.com/godotengine/godot/issues/43040 — HTML 导出下 await finished 不返回，退出／导出路径需单独验证回调是否仍会到达。
- **issue #101653** — https://github.com/godotengine/godot/issues/101653 — Web 导出下经 AnimationPlayer 触发的音频跨场景继续播放，退出再进入后旧实例仍存活。
- **issue #124217** — https://github.com/godotengine/godot/issues/124217 — 混音线程读取已释放的 playback 详情，停止／销毁与混音线程并发时的 use-after-free。
- **Godot Forum 97248** — https://forum.godotengine.org/t/how-to-check-if-audio-stopped-playing/97248 — 社区用 finished 判断“是否停止”，但官方文档说 stop() 不发该信号，常见误用。
- **Godot Forum 24073** — https://forum.godotengine.org/t/how-to-play-multiple-instances-of-a-sound/24073 — 发声节点是被销毁对象的子节点时声音不播，实例所有权跟随宿主生命周期。
- **Godot Forum 39510** — https://forum.godotengine.org/t/advanced-good-2d-audio-architecture/39510 — 池化 AudioStreamPlayer 加 2D 定位的社区架构，讨论并发上限、跟随对象与复用策略。
- **Godot Forum 48365** — https://forum.godotengine.org/t/audiostreamplayer-not-emitting-finished/48365 — 结束信号缺失的常见场景，池回收不能只依赖 finished。
- **Godot Forum 118790** — https://forum.godotengine.org/t/how-do-i-tell-when-an-audiostreaminteractive-is-finished/118790 — 交互式音频流没有统一结束信号，需要另建会话级完成事件。
- **Godot Forum 45830** — https://forum.godotengine.org/t/introducing-resonate-an-all-in-one-audio-manager-sound-music/45830 — Resonate 把 music／SFX 的播放、停止与信号集中管理，可对照其会话归属做法。
- **Godot Forum 140320** — https://forum.godotengine.org/t/need-advice-on-designing-an-audio-playing-system-for-a-bullet-hell-game/140320 — 同帧大量重叠音效的池化与抢占问题，直接对应停止旧实例和回调归属。

**Cocos：stop 回调、切场景与内存泄漏**

- **issue #17590** — https://github.com/cocos/cocos-engine/issues/17590 — 同一 AudioSource 反复 play() 会持续注册一次性事件，结束后只把事件置空、数组不删，回调数组一直增长。
- **issue #7701** — https://github.com/cocos/cocos-engine/issues/7701 — 2.4.3 同一帧 pause 后 resume 会让结束回调提前执行且状态值像已结束，音频却还在播。
- **issue #12455** — https://github.com/cocos/cocos-engine/issues/12455 — 多个相同音频时 one-shot 播放失败，回调在 audio source 销毁后才执行、相关属性全为 null。
- **issue #14017** — https://github.com/cocos/cocos-engine/issues/14017 — 微信小游戏音频内存增长；stop() 路径没有销毁 `_innerAudioContext`，汇总到修复 PR #15541。
- **PR #15541** — https://github.com/cocos/cocos-engine/pull/15541 — 修复小游戏平台并发音效导致的泄漏，改动 pal／audio／minigame／player-minigame.ts 的 destroy 路径。
- **issue #15540** — https://github.com/cocos/cocos-engine/issues/15540 — PR #15541 的原始 issue，给出问题场景与验收对象。
- **issue #19176** — https://github.com/cocos/cocos-engine/issues/19176 — iOS 引擎销毁时音频线程仍在触发加载回调，`AudioCache::invokingLoadCallbacks` 在 Engine::destroy 期间崩溃。
- **PR #1852** — https://github.com/cocos/cocos-engine/pull/1852 — 把 setFinishCallback 改成只在自然播放结束时触发、手动 stop 不触发。
- **issue #10064** — https://github.com/cocos/cocos-engine/issues/10064 — 循环 BGM 被循环音效播放后停止，音效实例与 BGM 共享通道／上限。
- **issue #17454** — https://github.com/cocos/cocos-engine/issues/17454 — ByteDance web audio 的 bufferSource 泄漏，平台后端差异导致 stop 后 buffer 仍被持有。
- **issue #13280** — https://github.com/cocos/cocos-engine/issues/13280 — 引擎音频重构提案，可对照其 stop／回调／实例管理的目标模型。
- **`audio-source.ts` v3.8.6** — https://github.com/cocos/cocos-engine/blob/v3.8.6/cocos/audio/audio-source.ts — playOneShot 创建独立 OneShotAudio、不进入组件 `_player`；onDisable 只 pause、onDestroy 才 stop、onEnded 才 removePlaying。
- **`audio-source.ts` develop** — https://github.com/cocos/cocos-engine/blob/develop/cocos/audio/audio-source.ts — 组件层 stop 与结束回调的实现，可对照论坛“stop 后仍回调”的现象。

**Unity 社区现场**

- **Unity Discussions 938625** — https://discussions.unity.com/t/calling-source-stop-is-stopping-my-playoneshot-clip/938625 — PlayOneShot 虽无句柄，但仍绑定在 AudioSource 上；Stop 会停掉该源启动的全部声音。
- **Unity Discussions 909411** — https://discussions.unity.com/t/callback-when-audiosource-ends-loops/909411 — 官方无完成事件，社区只能轮询 isPlaying／timeSamples；用户暂停／停止时无法区分自然结束与被停。
- **Unity Discussions 942838** — https://discussions.unity.com/t/playoneshot-cuts-off-the-sound-being-played-if-same-audioclip-is-used-multiple-times/942838 — 同素材约 0.5 秒内重复触发时上一实例被截断；定位到 AudioClip 流式加载，改 streamAudio=false 才恢复叠放。
- **Stack Overflow 62616008** — https://stackoverflow.com/questions/62616008/audio-file-duplicating-when-changing-scenes-in-unity — DontDestroyOnLoad 的 AudioManager 与场景内新实例并存，切场景后同一声音播两遍。
- **Stack Overflow 45218413** — https://stackoverflow.com/questions/45218413/how-to-stop-an-audio-when-playoneshot-is-used — 社区确认 PlayOneShot 无法单独停止，要可控就换 Play() 或独立 AudioSource。
- **Stack Overflow 29086039** — https://stackoverflow.com/questions/29086039/does-calling-stop-on-a-source-node-trigger-an-ended-event — 调用 stop() 会触发 ended；没有内建原因字段，只能自己设标志或先摘掉 handler（仅搜索结果摘要，正文未读）。
- **Unity Asset Store：Smart Audio Manager** — https://assetstore.unity.com/packages/tools/audio/smart-audio-manager-410846 — 商业插件把“旧句柄在 AudioSource 回收时自动失效”作为卖点，并提供并发上限与抢占策略；商品页直取只剩元数据，细节来自搜索索引（摘要，需复核）。

### E. 中文现场与本地化实践

这一档在**现场层**补中文生态的复现与规避：Cocos、微信小游戏、H5 音频的停止失败、重复播放与内存泄漏。文章与论坛帖多为个案，缺少跨版本验证，适合当失败输入而不是结论。

- **掘金《基于 Howler.js 解决音频音效连续播放失声问题》** — https://juejin.cn/post/7270831230077681722 — 作者定位到 howler 循环时会先 pause 再 play 同一个 id，最终改为监听 end 后 unload 旧实例并重建、再用两个同源 Howl 实例交替播放。
- **掘金《基于 vue 关于使用 howler.js 开发 h5 水果机游戏遇到音频各种问题》** — https://juejin.cn/post/7205131944761884732 — 同实例不同源必须等上一段播完、快速点击跟不上手速、Safari 四段转场偶尔漏播，最后只能人工按段 stop／start。
- **掘金《Cocos Creator 音频播放管理器》** — https://juejin.cn/post/7397616334653112358 — 用 Map 按音效 key 缓存 AudioSource 并 playOneShot；stopEffect 遇到仍在异步 load 会直接 return，而加载完成后仍会创建节点并播放。
- **掘金《Cocos Creator 框架封装之音频管理器教程》** — https://juejin.cn/post/7473827289853362186 — playOneShot 不保留句柄，异步加载也没有请求令牌，晚到的 load 可在 pause／stop／替换 BGM 之后继续播放。
- **掘金《Web Audio API 第2章 完美的播放时机控制》** — https://juejin.cn/post/7349382887571079168 — 明确 AudioBufferSourceNode 播完不能重播、暂停恢复要新建 source 并从 startOffset 继续。
- **掘金《一文教你 Cocos Creator 如何实现音频池工具的封装》** — https://juejin.cn/post/6864836036720558087 — 每个 clip 缓存一个 AudioSource 直接 play／stop，没有并发实例、播放 id 或结束回调，是池化最小实现。
- **掘金《前端音频兼容解决：howler.js 从基础到进阶》** — https://juejin.cn/post/7560542615484137491 — 系统说明 play() 返回播放 ID、可按 ID pause／stop、pool 限制同一 Howl 并发、unload 才释放资源。
- **CSDN《Unity3d AudioSource 如何监听播放完成并处理逻辑》** — https://blog.csdn.net/egostudio/article/details/46532453 — Unity 没有播放完成事件，只能 Update 轮询 isPlaying、Invoke(clip.length) 或协程；作者提醒暂停后必须更新协程。
- **Cocos 论坛《播放音效后，停止失败》** — https://forum.cocos.org/t/topic/111136 — playEffect 返回的 id 在 ended 时被引擎从 `_id2audio` 删除，之后 stopEffect(id) 找不到对象而失败。
- **Cocos 论坛《同一音效播放次数多后没声音》** — https://forum.cocos.org/t/topic/147067/3 — Android 微信小游戏同一音效播十几次后全部无声、BGM 的 stop／play 变 null；尝试 stop 里 destroy、WebAudio 实现、WAV 换 MP3 均无定论。
- **Cocos 论坛《小白也能写框架之音频管理器》** — https://forum.cocos.org/t/topic/161094/8 — 从业者反对无上限音频池：捕鱼游戏短音效爆发时池化反而卡顿，固定 5 个更顺；5 个循环 clip 走 playOneShot 只出一个声。
- **Cocos 论坛《setFinishCallback 总是执行最后注册的回调，且 stop 也会触发》** — https://forum.cocos.org/t/rc2-cocos-creator-v2-0-1/64731/249 — 2.0.1 RC2 中结束回调与 AudioID 脱钩、stop 直接触发结束回调；临时办法是停止或完成后 `setFinishCallback(id, null)`。
- **Cocos 论坛《playOneShot 超并发被停只走 stop 不走 end》** — https://forum.cocos.org/t/topic/142032/6 — 引擎为限制 10 个并发音效会强制停止旧 one-shot，只触发 stop 回调；把销毁写在 end 回调里的项目因此泄漏。
- **Cocos 论坛《音频 ID 为 0 被 if 判假，stop 未执行导致两首 BGM 同放》** — https://forum.cocos.org/t/cocos-creator-1-9-3-cc-audioengine-stop-play/67104/4 — 第一个播放 ID 是 0，用真值判断跳过 stop；实例句柄不能用真假值判断。
- **Cocos 论坛《cocos2d-x 3.12 AudioEngine::stop 会重播音效开头一小段》** — https://forum.cocos.org/t/cocos2d-x-3-12-audioengine-stop/39233 — 停止动作本身导致旧音效开头重新发声。
- **Cocos 论坛《Android 切后台 stopAll 后回前台 play，同一 BGM 叠两遍》** — https://forum.cocos.org/t/android/88493/3 — 2.1.2–2.2.2 上 hide 时 stopAll、show 时再播放仍听到两首 BGM。
- **Cocos 论坛《stopAllEffects 后同帧 playEffect，新音效第一次不响》** — https://forum.cocos.org/t/topic/38722/8 — 停止尚未即时生效时紧接着播放，新声音会被旧停止动作吞掉，只能用延迟一帧规避。
- **Cocos 论坛《cc.audioEngine.stop() 会触发 setFinishCallback 回调》** — https://forum.cocos.org/t/46899 — stop() 在浏览器必现、原生偶发地立刻触发 setFinishCallback，暴露回调错绑到 stop 而非自然结束。
- **Cocos 论坛《自动释放资源场景切换后仍触发已释放场景的 setFinishCallback》** — https://forum.cocos.org/t/65370 — 场景切换后上个场景的全部结束回调被触发，官方回复“应该在音频 ended 时触发，而不是 stop”。
- **Cocos 论坛《v2.0 调用 stop 之后所有 setFinishCallback 都无法触发》** — https://forum.cocos.org/t/64720 — 同一 stop 行为在另一版本走向反面，评论区争论“自己 stop 算不算 finish”。
- **Cocos 论坛《2.2.0 在 setFinishCallback 中执行 stop 会导致 bug》** — https://forum.cocos.org/t/86113 — 在结束回调里再对同一 id 调 stop 会报错，回调重入时实例所有权未隔离。
- **Cocos 论坛《3.6.2 微信小游戏音效内存 bug》** — https://forum.cocos.org/t/144533 — 反复播放同一音效内存必涨，定位到 innerAudioContext.destroy 从不触发，提供复现工程与修复 PR 链接。
- **Cocos 论坛《3.6.1 playOneShot 非自然停止导致音效内存泄露》** — https://forum.cocos.org/t/topic/142032 — 实测 playOneShot 并发到内部上限（小游戏 10）时被非自然停止，走 stop 回调而非 end 回调；销毁逻辑挂在 end 上导致内存增长。
- **Cocos 论坛《Creator 3.7.1 音效终止呢？》** — https://forum.cocos.org/t/topic/146950 — 帖中直接指出 playOneShot 播放后无法暂停／停止、也无法监听结束回调，回答改为独立 AudioSource 加 play()。
- **Cocos 论坛《[BUG] 又轮到 AudioSource 出事了》** — https://forum.cocos.org/t/topic/126432 — stop() 后立刻把 clip 置空再 play() 只响第一次，异步换源与停止／重播之间没有按实例划分所有权。
- **Cocos 论坛《cocos2dx 3.15 Android 快速播放停止多个音效崩溃》** — https://forum.cocos.org/t/cocos2dx-3-15-android/48490 — Android 上快速连续 play／stop 多个音效可崩溃，原生句柄释放与完成回调并发需要单独覆盖。
- **Cocos 论坛《iOS 循环长音效频繁切后台后停止播放》** — https://forum.cocos.org/t/ios-audioengine/82721 — 长循环音效多次进出后台后不再播放，是退出再进入时引擎级状态未恢复的实例。
- **Cocos 论坛《1.5.2 native stop 不触发完成回调，Web 正常》** — https://forum.cocos.org/t/1-5-2-native-stop-web/49001 — 同一 stop 在 native 与 Web 的回调语义不同，跨端池化不能统一依赖回调。
- **Cocos 论坛《实例超上限会中断前面正在播的音效》** — https://forum.cocos.org/t/topic/102058 — 实例上限触发抢占，旧实例被停但结束回调归属未定义。
- **Cocos 论坛《微信小游戏回前台音效重复播放》** — https://forum.cocos.org/t/cocos2-0-7/72076 — 暂停／恢复时重放旧请求，需要区分恢复会话与重新播放。
- **Cocos 论坛《game.restart 后 setFinishCallback 报错或实例上限》** — https://forum.cocos.org/t/topic/100879 — 重启后旧回调仍存活并绑定到已销毁对象。
- **Cocos 论坛《2.4.x 音频内存泄漏》** — https://forum.cocos.org/t/topic/176547 — 停止后实例／缓冲未释放导致的长期泄漏。
- **Cocos 论坛《2.2.2 音频内存泄漏》** — https://forum.cocos.org/t/creator-2-2-2/93026 — 另一版本的同类泄漏，回收责任在引擎层未闭合。
- **Cocos 论坛《pause/resume 同帧触发 setFinishCallback 但音频仍在播》** — https://forum.cocos.org/t/bug-setfinishcallback/93135 — 同帧 pause→resume 解绑／重绑 end 事件导致旧回调提前触发。
- **Cocos 论坛《Creator 3.8 AudioSource 组件文档》** — https://docs.cocos.com/creator/3.8/manual/en/audio-system/audiosource.html — 3.x 移除 audioEngine；短音用 playOneShot（返回 void，无逐次句柄）、长音由 AudioSource 的 play／stop 控制。
- **WXOPEN Club《InnerAudioContext 更换 src 播放 stop 问题》** — https://wxopen.club/topic/5e29070d0a3592468d4ee80b — Android 小米 6 改 src 后 play 会自动触发异步 onStop，onStop 可能晚于新音频的 onWaiting／onCanplay 才到；iOS 不复现。
- **SegmentFault《小程序 createInnerAudioContext 退出后仍然播放》** — https://segmentfault.com/a/1190000044502184 — 小程序离开页面后音频仍播；作者在 onStop 回调里 destroy、下次重建，退出时 pause＋stop＋置空引用。
- **抖音开发者论坛《Unity Wasm 方案下 StarkAudioManager 的问题》** — https://developer.open-douyin.com/forum/question/post/63f723d2f65783f604303317 — 短音效入池复用时 onPlay／onEnded 不按播放结束回调、Update 轮询播放时间也不准；无有效回复。
- **LayaAir 社区《Laya3.3.12 切换音效时，原生 APK 报错》** — https://ask.layaair.com/d/55709-laya3312-qie-huan-yin-xiao-shi-yuan-sheng-apkhui-you-bao-cuo — 循环音效 stop 后旧结束回调仍触发，声道已释放却设置 currentTime 报空；帖中的守卫与 pause／resume 规避来自 AI 自动回复，未经人工或真机确认。
- **B站《优化游戏声音：Unity 中的音频源对象池》** — https://www.bilibili.com/video/BV1WEkwYoEiq/ — 搬运 git-amend 的音频源对象池教程，章节覆盖音频汇集、Sound Manager、Emitter／Generator 与优化；未明确讲 stop 语义。
- **少数派《AI 工作流实践：100% Vibe Coding 完成 Game Jam》** — https://sspai.com/post/110972 — 用 Agent 做出 intro／loop／outro 三段式 BGM、双声道脚步与响度归一化，能证明 loop 边界和分段播放是真实需求，未涉及停止／回调所有权。
- **GF Framework BGM／SFX 文档** — 见 A 段，中文语境下把 generation＋session 写到接口级。
- **QFramework 设计文档与 issue** — 见 A 段，Stop 被误当自然结束的完整中文案例。

### F. 退出、重放、暂停恢复与池化背景

这一档在**事件层与调度层**补背景：回滚去重、场景切换清队列、暂停恢复、池化复用与 voice 预算。它们解释“为什么不能重播旧事件”，但多数不直接给句柄失效实现。

- **INVERSUS《Rollback Networking》** — https://www.gamedeveloper.com/design/rollback-networking-in-inversus — 回滚重放时用最近 128 条 sound event＋frame 的环形历史去重，同一帧同名事件只播一次；作者明确遗留问题：被回滚否定但已播的声音不会停止。
- **Cargo Space devlog #4** — https://johanhelsing.studio/posts/cargo-space-devlog-4/ — 把声音作为 rollback 实体（clip＋start_frame＋sub_key），回滚后对比 desired／actual，撤销预测时 fade stop，太晚的事件直接忽略。
- **GDevelop Forum 58067** — https://forum.gdevelop.io/t/finished-sounds-replay-when-scene-resumes/58067 — 现场报告：返回暂停场景后已结束的音效再次播放；resume 行为等同 play，通道状态被保留。
- **Escoria 提交 acfb3d9** — https://github.com/godot-escoria/escoria-demo-game/commit/acfb3d9ddd8cb47c13d2d221dfb5bc3689583215 — 场景切换置 changing_scene 阻止入队，并 interrupt＋clear 各通道队列，避免旧房间事件在新房间执行。
- **pursuedpybear 提交 7390e7d** — https://github.com/ppb/pursuedpybear/commit/7390e7db18d85f28c41de57d12ee9073d6b52231 — 场景切换前 `flush_events` 清空 deque，注释明确“在会把信号投递到错误场景之前调用”，并有测试。
- **dev.to《浏览器节拍器：清 timer 不会取消已排节点》** — https://dev.to/ptrgiang/building-a-browser-metronome-schedule-audio-ahead-of-the-ui-clock-283g — 清 interval 只阻止新排程，已提交的 oscillator 仍会响；Stop 必须显式 stop 已排程节点并清计时器／计数器。
- **dev.to《钢琴页变安静：暂停时停掉已排音符》** — https://dev.to/ptrgiang/when-a-piano-tab-goes-quiet-keep-the-score-position-3kde — 页面隐藏时 suspend context 还不够，必须停掉已排程音符并停止继续入队。
- **Positech《Multithreading sound engine bug》** — https://www.positech.co.uk/cliffsblog/2015/02/28/multithreading-sound-engine-bug/ — 音频线程回调在“检查仍在播放”与“拿指针去 stop”之间把声音自然结束，指针失效导致崩溃；作者用引用计数＋主线程帧末清扫，而不是在回调里释放。
- **Game Programming Patterns: Object Pool** — https://gameprogrammingpatterns.com/object-pool.html — 见 C 段，池对象归还后不得继续持有引用。
- **Mindustry v154 发布说明** — https://github.com/Anuken/Mindustry/releases/tag/v154 — 同时发声上限 32→100，并限制每类约 6 个；官方承认高密度战斗会因并发上限截断声音，SoundPriority 抢占本身制造“旧声被停、新声被吞”的取舍。
- **GDC《Lessons Learned from a Decade of Audio Programming》（Guy Somberg）** — https://gdcvault.com/play/1020452/contactUs — 从零搭音频引擎并附源码的 GDC 演讲，覆盖事件／voice 架构，可作实例所有权放哪层的工程背景。
- **GDC《Diablo IV Audio Systems Deep Dive》** — https://gdcvault.com/play/1034343/-Diablo-IV-Audio-Systems — 语音限制／重要性系统与 ducking 的实战拆解，说明 voice stealing 需要优先级与预算。
- **Playdead Wwise 演讲（INSIDE）** — https://schmid.dk/talks/2016-06-16-wwise/schmid-Wwise_2016-INSIDE_Audio.pdf — INSIDE 的 Wwise 集成讲稿，涉及回调与 Unity 侧分配约束；本轮抓到二进制流未提取正文。
- **GDC《The Audio Callback for Audio Synchronization》** — https://www.gdcvault.com/play/1018194/The-Audio-Callback-for-Audio — 把音频回调当作同步机制而非生命周期通知，帮助区分音频线程回调与实例结束回调。
- **Taylor & Francis《Multithreading for Game Audio》章节** — https://www.taylorfrancis.com/chapters/edit/10.1201/b22247-3/multithreading-game-audio-dan-murray — 讲音频设备回调的线程／时限礼仪，回调里不能做释放或重活。
- **GodotPrompter** — https://github.com/jame581/GodotPrompter — 926★、2026-11-01 仍在更新，给 Claude Code 等 agent 提供 Godot 领域 Skill，audio-system 覆盖 bus、AudioStreamPlayer、music manager 与 SFX 池，并标注 Godot 4.7 的 area_mask 破坏性变更。
- **GodotPrompter SFX pool 参考** — https://github.com/jame581/GodotPrompter/blob/master/skills/audio-system/references/sfx-pooling.md — 池化范例只用轮转，不跟踪 finished 或播放会话；池满时直接打断最旧播放器，可作“缺所有权”的对照基线。
- **Game-Dev-Agentic-Skills Godot voice pool** — https://github.com/thedivergentai/Game-Dev-Agentic-Skills/blob/main/skills/godot-audio-systems/scripts/audio_voice_pool_manager.gd — voice pool 用 `finished.connect(_on_voice_finished.bind(i))` 只按槽位号清理、没有 generation／身份校验，是 AI 生成音频池的反面样例。
- **GodotPrompter / gamedev-skills 音频 Skill** — https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/main/skills/godot/godot-audio/SKILL.md — 建议“生成短命播放器并在 finished 时释放”，与 Godot 的 finished 不触发场景结合会直接泄漏实例。
- **Game-Dev-Agentic-Skills 总表** — https://github.com/gamedev-skills/awesome-gamedev-agent-skills — 6759★、77 个游戏开发 agent skill，audio-design 与 godot-audio 只讲总线／混音／自适应音乐／ducking，不涉及 stop／callback 所有权。
- **Donchitos/Claude-Code-Game-Studios** — https://github.com/Donchitos/Claude-Code-Game-Studios — 35155★ 的游戏开发 agent／技能集合，有 audio-director、sound-designer 与 /team-audio，但技能清单没有音频生命周期 skill。
- **playcanvas/engine `AGENTS.md`** — https://github.com/playcanvas/engine/blob/main/AGENTS.md — 高质量引擎仓库公开的 Agent 规则（core→platform→scene→framework 分层、JSDoc、测试与 lint），可作 a1dbv 模板对照，也解释音频实例代码所在层级。
- **webprofusion/OpenAudio** — https://github.com/webprofusion/OpenAudio — 2806★ 的开源音频软件／插件／库总表，是找替代实现的头部索引，a1dbv 未收录。
- **Calinou/awesome-gamedev** — https://github.com/Calinou/awesome-gamedev — 3211★ 游戏开发 awesome 列表；Audio 节几乎全是 DAW／音效素材，不含运行时实例所有权。
- **ellisonleao/magictools** — https://github.com/ellisonleao/magictools — 17680★ 游戏开发工具总表，Audio 节同样偏素材／编辑器，没有 sound instance 生命周期条目。
- **GitHub topic: game-audio** — https://github.com/topics/game-audio — 集中列出 Wwise／FMOD 的 Godot／Unity 集成与独立音频引擎，是扩展候选的收录列表。
- **GitHub topic: web-audio** — https://github.com/topics/web-audio — 列出 howler／Tone／standardized-audio-context／waud 等，可作 Web 侧替代品索引。
- **Wwise 2026.1 Beta What's New** — https://www.audiokinetic.com/en/community/blog/wwise-2026.1-whats-new/ — 2026 秋 Beta：Music Segment 改为通用 Segment 时间线、profiler 会话可 Replay、Wwise MCP 改善 AI agent 支持；Unreal 集成把 95% 自动运行时流程与 75% 动态环境更新迁到 worker 线程（博客 403，仅摘要）。
- **Wwise MCP 官方文档** — https://www.audiokinetic.com/en/public-library/2026.1.3_9276/?source=Help&id=wwise_mcp — 官方 validated Codex CLI、Cline、Claude Code，通过本地 WAAPI 做批量重命名／整理（403，仅摘要）。
- **Bose 收购 Firelight Technologies（FMOD）** — https://www.bose.co.uk/pressroom/bose-acquires-firelight-technologies-announcement — 2026-10-01 宣布收购，称平台保持开放并继续投入；这是近期最可能影响中间件选型／许可预期的行业变化。
- **FMOD Q&A 24557** — https://qa.fmod.com/t/firelight-bose-acquisition-questions-and-answers/24557 — 2026-10-08 官方帖明确“No planned changes to our licensing structure, support or roadmap”，Unity／Unreal 支持不受影响。
- **Wwise-MCP（BilkentAudio，社区版）** — https://github.com/BilkentAudio/Wwise-MCP — 官方 Wwise MCP 文档被 WAF 挡住时的可用替代入口，明确标注实验性、非官方。
- **bevy_fmod** — https://github.com/Salzian/bevy_fmod — Bevy 的 FMOD 集成插件，用 ECS 组件承载事件实例，可对照实体 despawn 与 FMOD instance release 的时机（README 未展开生命周期细节）。
- **godot-fmod-integration** — https://github.com/heraldofgargos/godot-fmod-integration — Godot 的 FMOD 绑定，涉及 EventInstance 在节点销毁时的释放责任。
- **FMOD-Unity-Tools** — https://github.com/VilleOjala/FMOD-Unity-Tools — Unity／FMOD 播放与触发封装集合，可作实例管理实践样本。
- **fmod/fmod-for-unity** — https://github.com/fmod/fmod-for-unity — FMOD 官方 Unity 集成源码（207★，活跃），可核事件实例在 Unity 层的 stop／release 与回调接线。
- **fmod/fmod-for-unreal** — https://github.com/fmod/fmod-for-unreal — FMOD 官方 Unreal 集成源码（243★，活跃），补 FMOD 引擎集成层对照。
- **utopia-rise/fmod-gdextension** — https://github.com/utopia-rise/fmod-gdextension — Godot 的 FMOD Studio GDExtension（950★，活跃），把 Studio API 与事件实例暴露成节点。
- **fmod_gd4** — https://github.com/jordigulley/fmod_gd4 — 模块级 Godot 4 FMOD 集成，在引擎层持有 event instance，可对照所有权放在模块还是 GDExtension。
- **alessandrofama/wwise-godot-integration** — https://github.com/alessandrofama/wwise-godot-integration — Wwise 的 Godot 集成（452★，活跃），把 Event Callbacks 暴露为 AkEvent 节点信号。
- **Wwise Godot Integration issue #59** — https://github.com/alessandrofama/wwise-godot-integration/issues/59 — 启用回调并设置 stop_on=Tree Exit、stop_fade_time 后退出场景树即崩溃，淡出停止期间回调仍会访问已离开的节点。
- **audiokinetic/Gyms** — https://github.com/audiokinetic/Gyms — Audiokinetic 官方 Unity／Unreal 集成样例与测试工程，可核 PostEvent 后的停止／回调行为。
- **FMOD for Unreal issue #73** — https://github.com/fmod/fmod-for-unreal/issues/73 — 程序员音效自然结束但 FMOD event 未停时缺少通知，补丁新增 OnSoundStopped 才能安全释放。
- **FMOD for Unity issue #42** — https://github.com/fmod/fmod-for-unity/issues/42 — AttachInstanceToGameObject 自动移除已停止实例，调用方持有的引用会失效。

## 可直接落成测试的五个现场

以下五项都能用清单里的固定源码或原帖复现，不需要音频设备；断言写在括号内。

1. **stop 后旧结束回调不得停止／释放新实例。** 输入：stop 同一 sound 5 次，再起一次并让它自然结束；或 end 后同帧再 play。看旧回调是否命中新播放。依据 [howler #1695](https://github.com/goldfire/howler.js/issues/1695)、[#580](https://github.com/goldfire/howler.js/issues/580)、[Phaser #6657](https://github.com/phaserjs/phaser/issues/6657)、[commit 2dfd421](https://github.com/phaserjs/phaser/commit/2dfd421495c4fafdf385ddc7fd9a001ccafdbfc0)、[QFramework 设计文档](https://github.com/liangxiegame/qframework/blob/976d43b73fe2e3b8facad78c023e98d4c7193549/QFramework.Unity2018%2B/openspec/changes/archive/2026-07-02-fix-audio-player-double-recycle/design.md)。断言：旧回调触发时新实例仍在播；新实例的 ID／session 未被旧回调释放；回收入口最多执行一次。
2. **同源多实例按实例身份结束，而不是按资源或槽位。** 输入：同一 clip 连开两个 voice，先停 A 再让 B 自然结束；再让 A 的迟到 ended 到达。依据 [PlayCanvas `_suspendEndEvent`](https://github.com/playcanvas/engine/blob/9edc208f23b99f0fb71d40e9d216821fe2a5788a/src/platform/sound/instance.js)、[three `Audio.js`](https://github.com/mrdoob/three.js/blob/dev/src/audio/Audio.js)、[libGDX `Music.java`](https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/audio/Music.java)、[Godot AudioStreamPlaybackPolyphonic](https://docs.godotengine.org/en/stable/classes/class_audiostreamplaybackpolyphonic.html)。断言：A 的停止不改变 B 的状态；B 结束后只有 B 的槽位被释放；A 的迟到回调是 no-op。
3. **pause／resume／loop-end／fade-cancel 不重播旧事件。** 输入：暂停后等过原时长再恢复；循环音效 stop 后同帧换曲；淡出取消后再次 play。依据 [howler #509](https://github.com/goldfire/howler.js/issues/509)、[#504](https://github.com/goldfire/howler.js/issues/504)、[GDevelop 58067](https://forum.gdevelop.io/t/finished-sounds-replay-when-scene-resumes/58067)、[PlayCanvas PR #9231](https://github.com/playcanvas/engine/pull/9231)、[Unity `AudioListener.pause`](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioListener-pause.html)。断言：恢复后不补播已消费事件；循环边界不产生整次播放的结束回调；取消淡出不会留下旧 stop 计划。
4. **退出／切场景／销毁时旧回调不得触碰已释放实例。** 输入：场景切换或对象销毁时仍有 voice 在播，销毁后让旧 ended／stopped 回调到达。依据 [CNA shutdown 手册](https://libcna.com/development/handbook/debug-shutdown-and-lifetime.html)、[动态 voice 夹具](https://github.com/libcna/cna/blob/3b43bd8687ed46523d873f9bec4b32bd8481dcb5/tools/audio/mixer_destroy_active_dynamic_voice_harness.cpp)、[Cocos #14017](https://github.com/cocos/cocos-engine/issues/14017)、[Wwise 7612](https://www.audiokinetic.com/qa/7612/crash-fakcomponentcallbackmanager-akcomponentcallback)、[FMOD 10765](https://qa.fmod.com/t/eventinstance-stop-crashes-with-callback/10765)。断言：销毁后回调 no-op 或不派发；没有 use-after-free；资源释放只发生一次。
5. **同渲染帧多 tick／多动作顺序。** 输入：同一帧 Play→Stop→Play；或 stopAllEffects 后同帧 playEffect；或同帧 pause→resume。依据 [FMOD 23471](https://qa.fmod.com/t/studioeventemitter-play-stop-issue-when-repeatedly-called-during-the-same-frame/23471)、[Cocos 38722](https://forum.cocos.org/t/topic/38722/8)、[Cocos 7701](https://github.com/cocos/cocos-engine/issues/7701)、[Pixi #297](https://github.com/pixijs/sound/issues/297)、[moyuta 幂等键](https://blog.moyuta.com/posts/animation-event-idempotent-loop-commit)。断言：第二次 Play 落到有效实例；旧 Stop 不吞掉新 Play；同帧 pause/resume 不产生提前结束；同一逻辑事件只交付一次。

## 低优先与排除

**放在最低优先背景、不再补细节**（能证明生态或架构，但不直接回答 stop／回调所有权）：GDC Vault 的 Somberg／Diablo IV／Audio Callback 三讲、Taylor & Francis 的线程章节、Playdead 的 Wwise PDF、Firewheel／bevy_seedling／Symphonium／AudioConductor／Orpheus／Amplitude 等架构条目、Godot 的 Autoloads 最佳实践、Unity 的 ObjectPool 手册、GitHub topic 列表、awesome-gamedev／magictools／OpenAudio 三个清单、GodotPrompter／Game-Dev-Agentic-Skills／Donchitos 的 Skill 集合、Wwise 2026.1 与 Wwise MCP、Bose 收购 FMOD、FMOD 集成仓库与 Godot／Unreal／Unity 集成 issue、各引擎仓库根条目（three、Phaser、Pixi、Babylon、libGDX、MonoGame、SFML、raylib、OpenAL、Godot、FMOD 官方集成）。它们已按条目列入上表或 F 段，需要时按名称回查，不额外扩写。

**明确不采用：**

- **纯素材／DAW／混音教程与插件市场条目**：不回答运行时实例生命周期。Asset Store 分类页、Fab、Godot Asset Library 的音频分类也没有可筛的运行时库。
- **社交平台评论与摘要**：知乎、微信公众号、掘金评论、抖音回复、B站评论均因反爬或未渲染读不到正文；只保留能读正文的文章，摘要不作为机制证据。
- **单一自述且无源码的新项目**：lite-audio（0★）、gecko0307/soloud fork（1★）、soundhub（4★）已标注，只作机制参考，不当作已验证实现。
- **重复 URL 与同义条目**：同一 issue 的镜像页、同一规范的不同锚点合并；保留最能定位的一版。
- **读不到正文且摘要不足以判断的条目**：Wwise 4547／7612／5683／947、UE-363230、Smart Audio Manager、LayaAir 帖只保留在正文并标“摘要”，不作为测试依据；其中 LayaAir 的规避建议来自 AI 自动回复，未采信。

## 读不到的渠道

按渠道合并同类失败，不逐条重复：

| 渠道 | 尝试与结果 |
|---|---|
| fmod.com 官方文档 | `/docs/` 是 JavaScript 单页应用，curl／WebFetch 只得到约 453 字节空壳；`EventInstance::stop`／`release`、`StudioEventEmitter` 正文取不到。改用 qa.fmod.com 的 Discourse JSON 与搜索摘要。 |
| audiokinetic.com（Wwise） | SDK library、Q&A、2026.1 blog、Wwise MCP 文档多次返回 403／CloudFront／AWS WAF 挑战；仅一次用浏览器 UA 读到 AkEventCallbackInfo。Wwise 结论主要来自 Q&A 摘要与第三方集成页。 |
| dev.epicgames.com | Unreal API 页只返回 “Table of Contents”，正文客户端渲染；UAudioComponent／OnAudioFinished 的时序细节没读到，改用 Epic 论坛帖。 |
| Unity 文档 | 部分 Manual 页 302 到索引或只返 JS 壳；ScriptReference 多数可读。旧 Issue Tracker slug 迁移后 404，UUM-404 改用 unityreleases.com 镜像。 |
| Apple／Android 官方文档 | AVAudioPlayerDelegate、SoundPool 参考页是 JS 壳，读不到“stop 时是否回调”的原文；因此未列候选。 |
| Chromium code review | `chromiumcodereview.appspot.com/23596014` 连接被关闭，CL 正文未读；改读 Blink 的 `audio_scheduled_source_node.cc`。 |
| WebKit bugzilla | #320884／#70061 被 WebFetch 域名安全校验拦截，curl、jina、Wayback 均失败；改用 WebKit 提交与 WPT。 |
| HTML5 Rocks FAQ | TLS 证书过期，代理不可达；其内容只由 howler #245 转述。 |
| Stack Overflow 直连 | curl／WebFetch 一律 403；改用 api.stackexchange.com 读问题与答案正文。两问（PlayOneShot 停止）只拿到标题，未列为候选。 |
| SegmentFault | 原帖返回 HTTP 468 反爬页，正文与回答未读；仅按搜索摘要保留一条，已标注。 |
| 知乎 | 专栏 WebFetch 403、`api/v4/articles` 需签名；只能看标题和搜索摘要，未进主表。 |
| 微信公众号 | 正文显示“当前环境异常，完成验证后即可继续访问”；只按摘要判断，未进主表。 |
| 掘金评论区 | `interact_api` 返回“请求路由不存在”，SSR 页面也不内嵌评论；只读文章正文。 |
| 抖音开发者论坛 | 页面显示“共 2 条评论”但正文未加载，回复未读。 |
| B站 | 视频页可读，`api.bilibili.com` 元数据／评论接口返回 HTML 拦截页；只读视频页信息。 |
| Unity Asset Store／Fab | 分类页商品卡由 JS 渲染，只能读到计数；Fab 返回 403。个别已知商品页只读到价格／版本元数据。 |
| Godot Asset Library | 旧站音频分类返回 0 items；新 Asset Store 的 `/api/v1/assets` 与 `/search` 只回固定精选列表，无法按音频管理插件筛选。 |
| GitHub REST API | 未认证 60 次／小时，共享出口 IP 多次 403；改用 raw.githubusercontent.com、HTML 页面与 `commits.atom`。`gh` CLI 不存在。 |
| WebSearch | 本会话 200/200 预算耗尽，后半段无法再用搜索引擎扩展；改用 GitHub Search API、Discourse JSON、StackExchange API、HN Algolia 与直链抓取。 |
| news.ycombinator.com | 直连 curl 000，只能用 hn.algolia.com API；未找到直接讨论 stop／回调所有权的 HN 帖（INVERSUS 那条 0 评论）。 |
| lobste.rs | `/search.json` 对 q／what／order 返回 400；改用 `/t/audio.json`、`/t/games.json`、`/t/programming.json`，未见相关帖。 |
| Reddit | 两组 `site:reddit.com` 查询无结果，未定位到普通玩家／开发者原帖，不代表该社区没有讨论。 |
| gamedev.net／adventurecreator | XAudio2 回调／轮询帖 403，仅见摘要；AdventureCreator 暂停队列帖连接失败（000），均未使用。 |
| soloud-audio.com／solhsa.com | soloud-audio.com TLS 握手失败；改用 `sol.gfxile.net`、`solhsa.com` 与 GitHub 头文件。 |
| docs.rs／rodio | Sink 页两个候选路径 404；改用 rodio issue tracker 与 0.21.1 文档。 |
| OpenAL 规范／SDL3 wiki | openal-soft 1.1 规范 404；SDL3_mixer 的 Mix_Track 页 404，后改读头文件与 wiki。 |
| web.archive.org | 证书主机名不匹配或连接 EOF，Skullgirls 博文存档取不到。 |
| 华为开发者 FAQ／微信官方文档 | 华为 FAQ 重定向到文档中心索引；微信 InnerAudioContext 页只返导航壳，短链重定向到需登录页。 |
| 少数派／即刻／newsletter | 均可访问，但本轮没有检出播放生命周期或回调所有权内容；不当作“没有内容”，只是无命中。 |

- **seslen** — https://github.com/productdevbook/seslen — 较新的 TypeScript WebAudio 库，带 bus、ducking 与实例控制，可对照其结束处理。
- **compuphase《无缝 MP3 循环制作指南》** — https://www.compuphase.com/mp3/mp3loops.htm — PlayCanvas 论坛给出的文件级替代，用于绕开 start time／duration 触发的循环停止缺陷。

## 与 a1dbv 已覆盖的差异

- **howler**：04／WP10 已有 25.4k★ 的项目定位与 onend／onstop 简介；本清单补的是固定提交 003b917 的 `_endTimers`／`_soundById`／组级 `once('end')` 细节和 20 余条旧回调 issue 与 PR，可直接改写成测试输入。
- **FMOD／Wwise**：04 已有“事件与混音”选择建议；本清单补的是 STOPPED 不携原因、release 前必须完全停止、同帧 Play／Stop／Play、playingID 与回调包失效等实例所有权细节。
- **SoLoud／Arc**：a1dbv 只覆盖 Mindustry 锁定的 Anuken fork（4b4266f）；本清单补上游 `isValidVoiceHandle`、voice group、虚拟声部与 gecko0307 fork 的维护风险。
- **Unity AudioSource／WP10**：04 已有 AudioSource／Mixer 接线与 MOBA 有界调度；本清单补 PlayOneShot 无句柄、isPlaying 源级、PlayScheduled／AudioListener.pause、6.3 Scriptable Audio 生命周期与 UUM-404。
- **Phaser／three／Pixi／Godot／Cocos**：a1dbv 只在引擎选择里提过名字，未写音频生命周期；本清单补的是源码级旧回调防护与官方相反取舍，可作为 04 音频页的引擎对照素材。
- **未重复**：MOBA 的 25 ms 限流、去重游标与 8 声部预算已由 04 与 WP10 写清，本清单只把它作为责任链基准，不复述实现。

## 交给下一单元的未决问题

1. **先做哪条分支要由负责人定。** Web Audio 与 Godot／Unreal 对“stop 是否发结束回调”给出相反契约；MOBA 依赖 onended 释放声部，Godot 则要求停止方自己收尾。04 页若同时写两种，必须明确按引擎分支，不能给一条通用规则。
2. **五个测试现场需要落到具体实现。** 本清单只给输入与断言来源，未运行；下一单元要选一个固定源（GF、CNA、Phaser 或 MOBA）写出可跑的最小用例，并记录实际输出。
3. **generation 的 ABA 与句柄 0。** lite-audio ADR 0002 与 Cocos #67104 分别指出 generation 环绕和 0 句柄；若 04 采用“句柄失效”方案，需要写清位宽、环绕与有效值判断。
4. **回调线程边界。** FMOD 说回调与 RuntimeManager.update 同线程，Wwise 的 UAF／死锁案例说明注销与派发并发；MOBA 是 Web 单线程。跨引擎写“回调里可以安全释放”会误导，需按引擎注明。
5. **未验项。** 未运行任何音频设备、未试听、未在引擎里加载项目；Phaser／Godot／Unity 的行为均来自源码与文档，不是实机观察。

## 探索回执

- **产物**：本文件。仅整理收集轮已核链接的候选，未新增未核链接；固定来源四份按 job.md 给定 SHA 列入 D 段。
- **读取范围**：规范全文与相关 issue；引擎／中间件官方文档与 Q&A；固定源码与 issue／PR／commit；中文文章与论坛帖正文。读不到正文的条目已在上表列明并降级。
- **链接核对**：收集轮按批用 curl 并发检查状态码与标题，未通过者未进入本清单；本轮未重新逐条请求，避免把“链接能开”写成“机制已验”。
- **未做**：未运行音频设备、未安装软件、未打开 GUI／浏览器、未使用凭据；未改任何模块页、案例代码或其他任务文件。

