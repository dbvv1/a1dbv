主线：2 额外能力何时值得加；3 第二次修改仍可靠；4 音频资产长期交付
改变的建议：将音频从品牌候选改为“现成/参数化优先、按事件离线生成、运行时调度”；补近月具体型号与声音供应连续性门槛
新证据：2026-09-28 Eleven v4、当前 Music v2.5/Suno v6、Stable Audio 3 与 ACE XL；固定 jsfxr 随机噪声源码和 ACE repaint API；Fortnite 实际采用及独立声音权利反证

# WP6：音频资源路线、可修改性与授权边界

核实：2026-10-13 UTC（2026-10-14 UTC+8）。范围仅理论、一手网页与固定源码阅读。没有安装、模型/引擎运行、试听实测、付费、权重下载或操作用户电脑。来源页面虽提供音频试听，本轮仅核产品/接口与可见样例存在，不冒称听感比较。所有“最佳”均是针对单人程序员、无人工音频修补的条件推荐，不是盲测冠军。

## 一、采用判断与适用条件

**✅ 采用：音效按事件生产、音乐按可切换结构生产、配音按角色和台词 ID 生产，默认离线生成后交付固定音频。** 短电子反馈先用 jsfxr；通用 UI/撞击/胜负提示先选许可清晰的成套资源。仅在这些资源表达不了的材质、环境或角色上增加生成模型。运行时首先解决触发、变体选择、混音和节拍切换，不能用“实时生成音乐”代替这些结构。[研究]

| 任务 | 最佳质量条件档 | 最佳性价比条件档 | 本地/免费条件档 |
|---|---|---|---|
| SFX | 👀 采用 `eleven_text_to_sound_v2` 作为独特 Foley/环境音候选，逐事件导出；不是把整段“脚步+开门+战斗”当一个资产 | ✅ 采用 Kenney Interface Sounds 等合适成套包；🧪 改造 jsfxr 做反馈音，缺口才购买生成次数 | ✅ jsfxr 短电子音；👀 Stable Audio 3 Small-SFX 仅在商业注册、Community/T5Gemma 条款与硬件满足后评估，不能保证真实 Foley 质量 |
| 音乐 | 👀 采用 `music_v2_5` 的分段生成/修补供非节奏核心的器乐 BGM；需要演唱成曲可对照 Suno `v6`，先过 WP1 下载和 Remix 门槛 | ✅ 少量授权循环+胜负 jingle+程序状态机；有独特主题需求才比较生成服务的可用分钟成本 | 👀 ACE-Step1.5 官方 turbo；有≥12GB 显存且接受量化/offload 成本时再评估 `acestep-v15-xl-turbo`；无机器预算就用合法现成循环，不能把模型免费写成生产免费 |
| 配音 | 👀 `eleven_v4` 离线角色台词，固定授权音色、上下文和发音表；强戏剧整场演出仍须逐句判断 | 🧪 `eleven_v4_turbo` 或已验收的 `eleven_flash_v2_5` 做大量低戏剧短句；完整旁白保留 Multilingual v2 对照 | 👀 已清权组合 Qwen3-TTS-12Hz-1.7B-CustomVoice + Tokenizer-12Hz；从预设音色起步，不默认克隆真人；文本+短语音反馈也是可发布方案 |

最关键的局限：**参数和后处理能修规格、调度与部分接缝，修不了错误的声源语义、戏剧表演、旋律发展或未经授权的声音。** [研究]

上表“采用”表示采用该决策路线；模型均未通过本项目的零手修游戏验收。质量档不意味现成素材天然低质量；对脚步、UI 等明确任务，合适现成素材可能比最新模型更好。这里取代的是“一切重新生成、最新模型包办全音频”的默认，不要求替换已通过验收的旧资产。[研究]

## 二、近期版本为什么改变选型

### 2.1 Eleven：不能继续只写v3、Music v1或笼统品牌名

- 官方 9 月 28 日发布、10 月 12 日更新的 [Eleven v4 公告](https://elevenlabs.io/blog/eleven-v4)列音频标签、IPA 发音、说话人保持、多说话人上下文和请求拼接改进；有公开样例。其偏好测试与低延迟数值是厂商测试，不是本轮独立比较。[一手]
- [现行模型表](https://elevenlabs.io/docs/overview/models)列 `eleven_v4`、`eleven_v4_turbo`（90+语言）、`eleven_text_to_sound_v2`、`music_v2_5`；Flash v2.5 仍在，旧 Turbo v2/v2.5 被 Flash 替代。不能把 v4 Turbo 和旧 Turbo v2.5 混为一谈。当前 v4 通过 Text to Dialogue API，v4 Turbo 通过 Text to Dialogue WebSocket；迁移不是仅替换旧 TTS 请求的 model_id。[一手]
- [Music 能力页](https://elevenlabs.io/docs/overview/capabilities/music)确认 v2.5 可用 composition plans、音频参考和 inpainting，3 秒到 5 分钟；音频参考约 30 秒且为风格引导，不保证跨风格改编。结论是优先保留段落与参考，而不是每次从提示词重做整曲；官方“只改所选段落”承诺仍须以导出波形和听感验收。[一手/研究]
- [stem separation API](https://elevenlabs.io/docs/api-reference/music/separate-stems)提供 two_stems_v1/six_stems_v1，返回分轨 ZIP 且提示可能高延迟。**分离得到的 stem 不是原生独立录制分轨**；需要检查串音、残响尾音和相位，不能因有六轨接口就保证任意状态组合干净。[一手/研究]

### 2.2 SFX实际接口与宣传有边界差异

[创建 SFX 接口](https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert)只列 `eleven_text_to_sound_v2`，`loop`默认 false，时长 0.5–30 秒，prompt_influence 默认 0.3。[能力页](https://elevenlabs.io/docs/overview/capabilities/sound-effects)则写 0.1–30 秒，并称 MP3 适用于全部效果、48kHz WAV 用于非循环效果。接入时按 API 字段至少 0.5 秒规划，并保存真实返回格式；不把 loop 选项推成“所有编码格式均采样无缝”。[一手/研究]

推荐单独生成“开门”“金属撞击”“脚步单击”等短事件，再由引擎决定顺序；整段复合音会把交互时间锁死。可程序补：去静音、短淡入淡出、有限 EQ/增益、裁切、轻度 pitch/volume 变体与去重复随机选择。不能补：脚步材质错误、音色里混入背景音乐、应为一次撞击却有两次主瞬态。[研究]

### 2.3 Suno v6：近期成曲对照，但不默认游戏循环主线

9 月 9 日的[官方 v6 说明](https://help.suno.com/en/articles/13924801)区分 v6、v6-wild、v6-mini；三者最长 8 分钟，前两者 Pro/Premier、mini 全部计划；Extend/Cover/Replace Section 及 Custom Models 已围绕 v6。对固定风格资产，wild 的探索性不构成默认优势；成曲长度也不证明循环或多状态同主题一致。[一手/研究]

[当前公开价格页](https://suno.com/pricing)年付折合 Pro $8/月、Premier $24/月，分别 2500/10000 credits 和每月 20/60 首下载，税结账计算。该页是年付显示，不能当可随时退的同价月付；下载次数与生成额度两本账。[WP1 已核的平台 Remix 限制](2026-10-14-game-wp1-licensing.md#音频具体产品下载与生成时间决定授权)仍适用，界面将工具列入“Remix & Edit”不自动证明每项编辑法律上都等于 Remix，需按实际功能、输入权利与当期合同核定。[一手/研究]

### 2.4 本地音乐：ACE 1.5不再只有旧turbo

固定[README SHA ca1e85fe9430179831e6bc6be790c332190a3866](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/README.md)中，turbo 及 XL-turbo 为 8 步，有 repaint/cover，但 extract/lego/complete 只在 base 分支列支持。不能给 turbo 写“全功能多轨生成”。[一手]

[XL-turbo 官方权重卡](https://huggingface.co/ACE-Step/acestep-v15-xl-turbo)标 MIT、4B DiT、8 步；≥12GB 需 CPU offload+INT8，≥20GB 无需 offload，≥24GB 标完整 XL+4B LM。卡内权重体积约 18.8GB 与 README 的 decoder 约 9GB 不是同一口径，不能用其中一个推出整管线下载/内存。官方声明数据来源合规、输出可商用，不等于本轮数据审计或侵权保险。[一手/研究]

采用：已有机器预算时比较旧 turbo 与 XL；只有其降低本项目淘汰率或修改回归成本才替换。撤回：显存/时延不合、固定主题重现差、需要 turbo 没有的分轨任务。没有已核的同一游戏新旧版盲听/成本对照，不能称 XL 已证明性价比最高。[研究]

### 2.5 Stable Audio 3：补上本地SFX，但必须补WP1

5 月 20 日[官方发布](https://stability.ai/news-updates/meet-stable-audio-3-the-model-family-built-for-artistic-experimentation-with-open-weight-models)和[维护中的官方仓库](https://github.com/Stability-AI/stable-audio-3)明确 Small-SFX/Small-Music 为本地小模型、最长 120 秒，Medium380 秒需 GPU，Large 为 API/企业路线。支持 inpainting 和 continuation。8 月[提示指南](https://stability.ai/guides/stable-audio-3-prompt-guide)定位主要器乐，不应以它代替 TTS 或演唱首选。[一手]

[Small-SFX 卡](https://huggingface.co/stabilityai/stable-audio-3-small-sfx)说明 T5Gemma 文本条件、英语、音频训练集来自 AudioSparx 和 Freesound 多种许可；卡上 0.6B 与仓库 433M 不宜混写成同一统计口径。其“消费硬件/CPU 可运行”是作者兼容声明，不是本轮验证的帧预算或生成速度。[一手/研究]

代码[LICENSE](https://github.com/Stability-AI/stable-audio-3/blob/77e0398c26f7d22d801ec1bb036307e8b231f741/LICENSE) MIT；权重为 Stability Community 并额外包含 T5Gemma 条件，**不是 MIT 模型全栈**。见文末许可补表。在先满足授权时，它取代把 TangoFlux 当作免费商用 SFX 默认的路线；未满足时用现成 SFX/jsfxr，不换个下载镜像绕过许可。[一手/研究]

### 2.6 本地配音的精确能力与新模型观察

固定[Qwen3-TTS README 022e286b98fbec7e1e916cb940cdf532cd9f488e](https://github.com/QwenLM/Qwen3-TTS/blob/022e286b98fbec7e1e916cb940cdf532cd9f488e/README.md)：1.7B CustomVoice 有 9 预设音色、10 语言和指令控制；0.6B CustomVoice 没有同等 instruction-control 标记；Base 用于短音频克隆，VoiceDesign 按描述设计声音。不要为了“本地省钱”静默换 0.6B，却保留 1.7B 情绪控制承诺。[一手]

9 月[StepAudio 3 Gen 项目](https://stepaudiollm.github.io/step-audio-3-gen/)与[技术报告](https://arxiv.org/abs/2609.12945)展示语音、环境、SFX、音乐合成场景；本轮未核到对应可商用下载权重/明确服务合同，不把它当作免费本地 Qwen 替代。完整场景声音并不天然适合可交互事件拆分。继续观察明确交付和许可，不用论文样例替代生产能力。[一手/研究]

## 三、第二次修改：本轮有代码/接口证据，没有假装已实测

### 3.1 jsfxr：参数化可局部修改，但“存参数=位级复现”是错的

[固定 sfxr.js b7b6aa27d62f8f356db267276bf54b451555c49d](https://github.com/chr15m/jsfxr/blob/b7b6aa27d62f8f356db267276bf54b451555c49d/sfxr.js)的 `Params.prototype.mutate`随机改多项参数；`getRawBuffer`生成噪声时调用 Math.random；包络 attack/sustain/decay 以参数平方映射样本长度。[一手：源码阅读]

因此第二次要求“保持识别感，仅尾音缩短”时，直接改 decay 而非点 mutate 或重抽预设；缩放参数不等于同比缩放毫秒。冻结既有 WAV 及参数，噪声分支若要求位级复现还需受控 PRNG 和同版本渲染路径。无测试前不承诺修改前缀样本完全不变。这个反证使程序化方案更可维护，但不神化它。[研究]

### 3.2 音乐：改一段与拥有可任意重配的stem是两件事

固定[ACE REST API](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/docs/en/API.md)有 repainting_start/end、chunk_mask_mode=explicit，并返回 seed、DiT/LM、元数据。它证明可编码的局部修改入口，不证明区间外波形位级不变或前后和声相容。[一手/研究]

第二次要求“探索音乐不换主题，进入战斗时更密；从 16 小节改为 8 小节”时：
1. 优先在同一组已对齐 stem 上开关/混合打击乐层；无可靠 stem 时用已验收低/高强度片段加转场，不强行分离
2. 修改长度采用乐句边界裁切或局部 repaint，保留原文件作为回退
3. 校验采样数、拍号、BPM、调性、过渡点、循环尾音；这些字段只是约束目标，生成文本标 120BPM 不能替代测量
4. 重播探索→战斗→菜单→恢复并快速反复切换，检查重复触发、旧音乐未停、重叠峰值、节拍相位与包体

这是一项后续验收设计，未运行；真正证据目前只支持“能局部指定修改”，不支持“零手工听感修复已成功”。[研究]

### 3.3 配音：内容改10%，不能默认全角色重生

台词键保持稳定，保存文本 hash、角色 voice_id、模型 ID、语言、上下文、发音表、生成参数及最终音频 hash。只重生改动句及确有上下文受影响的邻句，旧音频保留；ASR 回读可查漏字/错字，不能判定讽刺、恐惧、角色关系和情感弧线是否到位。[研究]

更重要的新反证是[Voice Library 官方说明](https://elevenlabs.io/docs/eleven-creative/voices/voice-library)：无 notice period 音色可立即下架；有 notice 最长两年；某些音色 live moderation 还引入额外延迟。**已导出音频可以继续使用**和**未来补一句还能调用同音色**不是一个承诺。角色选音应优先明确通知期和连续性安排；下架风险不可由缓存解决全部未来 DLC。进一步核 [Voice Library Addendum §8](https://elevenlabs.io/vla)，平台仍保留随时移除音色、可不通知的权利。通知期针对声音所有者停止分享，不是平台持续供应 SLA；产品页“用过即可保存通知期”与附加条款“撤下前加入账户”的措辞也不完全一致，长期角色应保存账户资格和实际通知期证据，必要时取得书面连续性约定。[一手／研究][一手/研究]

## 四、循环、状态与离线/运行时的分界

- **循环是资产+解码+调度联合性质。** 首尾数值接近只能排查 click，不能排查短语未完成、持续混响被切断或节奏重复感。离线解码到工程母版后保存精确 loopStart/loopEnd 采样点，必要时短 crossfade；crossfade 可能抹掉瞬态，不能自动解决节拍/和声。[研究]
- Unity 官方 [AudioSource.PlayScheduled](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AudioSource.PlayScheduled.html)基于 dspTime、独立于帧率并允许预缓冲；[AudioMixer.TransitionToSnapshots](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Audio.AudioMixer.TransitionToSnapshots.html)提供带权混音过渡。前者安排开播、后者调混音，不会识别一首生成曲的正确乐句边界。[一手/研究]
- 状态机至少区分事件 one-shot、持续 loop、音乐状态与对话 ducking；玩法事件引用逻辑 ID 而非文件名或远程模型。新生成文件替换映射，不重写散落脚本。音量、动态范围和同时发声上限按目标设备/玩法验收，不套用单一平台响度数字到所有游戏。[研究]
- **默认离线预生成**：固定内容可回归、无玩家网络依赖、无每玩家推理账单；引擎只播放缓存文件。可运行时合成的是简单参数化声音和状态混音，不必引入神经网络。[研究]
- **运行时 TTS 例外**：玩家自由输入、无穷命名或开放对话确实构成核心玩法，且愿意承担联网、队列、审核、隐私、服务下架及兜底成本。API 密钥留服务器，缓存命中率/超时字幕回退/最大字数/每日费用先设计；不要把厂商~100ms inference latency 当端到端响应保证。[研究]
- 节奏核心玩法、精确动作命中提示、叙事关键一句都不应依赖现场生成按时完成。运行时音乐若不是游戏核心创新，撤回到预生成层即可。[研究]

## 五、真实作品证据与它没有证明的事

1. [Epic 官方 Fortnite Darth Vader 上线说明](https://www.fortnite.com/news/this-will-be-a-day-long-remembered-speak-with-darth-vader-in-fortnite)（2025-05-16）明确实验功能使用 Gemini2.0 Flash+ElevenLabs Flash v2.5，并致谢 James Earl Jones 遗产管理方。它是实际游戏运行时语音实例；不是 v4 听感测试，不是独立程序员成本证明，也不是开放克隆明星声音许可。[一手/研究]
2. [SAG-AFTRA 2025-05-19 原始声明](https://www.sagaftra.org/sag-aftra-statement-fortnites-use-ai-darth-vader-voice-and-ulp-filing)同时尊重本人/遗产对数字复制品控制，并就未协商替代劳动提出 ULP。此处只记录提出争议，不断言违法或最终裁决；它说明“演员/遗产同意”与集体协议义务可能并存。[一手/研究]
3. [Super_Bash_Folds 作者音频清单](https://github.com/blancmathis/Super_Bash_Folds/blob/1028a3b739ef54efdcbe5a2ef0ad1714fe569c47/public/assets/audio/LICENSES.md)实际列 Kenney UI/impact/jingle、qubodup 菜单/战斗循环，保留许可和 SHA256，仅重命名、不重压缩。可作“现成音频按用途整合”的源码案例；没有独立发售质量/用户规模证明，不能写成功商业游戏。[一手]
4. Eleven/ACE/Stable 的官方可见 demo 说明可生成具体片段，尚无本轮核实到的、绑定最新型号且公开全部淘汰样本/第二次修改成本的零音频人员发行复盘。这个证据缺口不会阻止条件采用，却禁止“AI 已经完整替代游戏音频生产”的结论。[研究]

## 六、成本：计算可用资产，不计算首次出声

[当前 ElevenAPI 价页](https://elevenlabs.io/pricing/api)显示 v4 $0.08/千字符、v4 Turbo 与 Flash $0.04/千字符、Music $0.15/分钟、SFX $0.12/分钟，未含税。不要沿用已过 10 月 12 日的 v4 发布折扣；API 美元计费与 Creative credits 不可混算。该页 FAQ 又称音乐/SFX 按 generation 计量，能力页仍写 40 credits/秒，故以下只是按挂牌音频量作预算，不保证最小计费/进位/套餐实际账单。[一手/研究]

以上商业生产须满足付费方案与对应声音/音乐条款；免费试听额度不是免费商用许可。例：最终 1 万字符配音、每句平均 3 次候选，v4 挂牌变量费约$2.40、Turbo 约$1.20；最终 20 分钟音乐、生成量 3 倍，按$0.15 为$9。这不是整个制作报价：另有套餐门槛、分轨/编辑、废弃、下载配额、试听工时、税和后续修改。SFX 若最小计费未确认，不用“1 秒仅$0.002”作购买承诺。[研究：算术预算]

免费本地的总成本包括硬件/内存、依赖维护、生成时长、挑选和返工；已拥有合适设备且需要大量反复离线修改，ACE/Qwen 才更有优势。只有几十个 UI 音时，jsfxr/CC0 成套资源一般能减少依赖与清权步骤；该“性价比”是结构判断而非本轮工时测量。[研究]

## 七、授权总表的增量依据

| 对象 | 代码/权重/输出分层 | 建议补入 WP1 的准确门槛 |
|---|---|---|
| Kenney Interface Sounds、Music Jingles 指定包 | 无运行模型；作者包页分别 100/85 件，CC0 资产许可 | [Interface](https://kenney.nl/assets/interface-sounds)、[Jingles](https://kenney.nl/assets/music-jingles)可作免费商用现成基线；保留下载时包内许可，不能推所有站外转载同许可 |
| `eleven_v4`、`eleven_v4_turbo`、`eleven_text_to_sound_v2`、`music_v2_5` | 专有服务/无基础权重授权；现有 TTS/SFX 与 Music 合同分别适用 | 在已有行补具体型号和官方模型页；音色授权、notice period、原输出持续权与未来补录可用性分开。v4 发布并不自动豁免 Beta 规则，生产时核具体入口状态 |
| Suno v6/v6-wild/v6-mini | 专有服务；已有商用/Download/Remix 规则不变 | 公开年付计划当前 20/60 下载/月已核；“之前未登录故未核额度”的缺口可限定更新为公开计划数，实际账户余额仍未核 |
| ACE-Step/acestep-v15-xl-turbo | 代码仍固定 MIT；[该官方卡](https://huggingface.co/ACE-Step/acestep-v15-xl-turbo)MIT 并明确商用输出 | 增列指定 XL checkpoint，不靠旧 turbo 卡外推；同样核共享组件与实际依赖，硬件门槛不沿用旧版 |
| Stable Audio 3 Small-SFX | [代码 MIT](https://github.com/Stability-AI/stable-audio-3/blob/77e0398c26f7d22d801ec1bb036307e8b231f741/LICENSE)；[权重卡](https://huggingface.co/stabilityai/stable-audio-3-small-sfx)Community，T5Gemma 另条款；无全栈 MIT | Community 商业须注册；本人/关联方合计任何来源年收入>$1M 需另许，非单游戏净收入。输出在法律允许范围归用户，非模型衍生物；材料/模型分发与仅交付 WAV 不能混同 |

Stable 补充依据：[2024-07-05 Community 正文](https://stability.ai/community-license-agreement)明确注册、>$1M 时终止原许可、输出归属、AUP 和禁用输出改进其他基础生成模型；不是自动获得企业授权，也不是超门槛可继续用旧免费推理。2026-10-14 再核 Small-SFX 卡，商业／许可入口已直接指向 [Stability 许可页](https://stability.ai/license)，后者明确列 Stable Audio 3.0，并链接 Community 正文；卡另明示 T5Gemma。替换上一轮“指向 Stable Audio Open 1.0 仓库”的链路描述，不改变注册、收入和 T5Gemma 三重条件；采用时保存实际包许可证。[一手/研究]

[T5Gemma 所适用 Gemma 条款](https://ai.google.dev/gemma/terms)（2026-04-01）附录含 T5Gemma，允许按条款使用/分发，含用途限制、分发通知；Google 不主张输出权利，输出不是 Model Derivatives。仅生成 WAV 与向玩家分发/托管模型义务不同。未见一般营收或地区名单额外门槛，不等于免除贸易管制和 AUP。此轮没提交注册/同意门槛，没下载模型。[一手/研究]

**声音权利必须独立核查**：基础模型/服务商用许可；剧本及音乐输入权利；本人声音/表演者/数字复制品授权（媒体、语言、角色、商业范围、补录期限、运行时生成边界）；具体音色平台条件；输出是否具有可执行版权/是否涉及第三方。合同写输出归用户是合同双方之间的配置，不保证司法管辖区承认纯 AI 音频版权，也不保证独占、无近似或可注册 Content ID。WP1 已有商用门槛不能简写成“付费即拥有所有声音”。[研究]

## 八、撤回条件与下一步证据

- 同一模型/音色升级后，新旧台词无法拼接：保留旧版已生成资产，比较整角色迁移代价，不强制换新
- 两轮局部 repaint 仍破坏未改段落或循环：撤回现成可循环资产/状态简化，不无限全曲重抽
- 素材通过自动响度/首尾检测但事件辨识、情绪或多状态试听失败：拒收，不把通过脚本写成音频质量通过
- 许可/正式下载消失：停止新增生产；历史合法资产权利依生成时合同判断，不直接宣布全部撤回
- 本地模型需超出已授权安装/权重/实测范围：本轮到证据建议为止；后续小实验须先确认

建议 BACKLOG 只保留有判别力的一项：在同一微型游戏音频需求上，比“Kenney+jsfxr”“Eleven 离线”“ACE/Qwen 本地”第二次修改的可用率、费用和主动工时；先做 10 个 SFX、2 组音乐状态、1 角色 20 句台词，改一次材质/节拍/台词。没有批准前不执行。这里的规模是后续实验建议，不是本轮完成的数据。[研究]


## 验证记录

本轮仅调查、文档写入与仓库离线检查。固定源码阅读不等于运行证明；没有试听评测、模型生成、引擎导入、商业购买、协议接受或真人声音上传。本轮 `python3 scripts/check_offline.py` 14 阶段全部通过，套件非空且无 skip；两份文档 UTF-8/LF 与尾随空白检查通过。遵守不操作 Git 的分工，本轮未执行 Git 命令或提交；补丁级检查由集成端另做。以上只验证文档/config 和已有确定性测试，不证明推荐音频的游戏质量。

整合交付：完整离线 14 阶段、受影响页 74 处标题引用和 `git diff --check` 通过；内部独立复核后补固定 SHA 及 v4/ Turbo 接入区别。未试听或运行模型/引擎，hosted CI 按精确发布提交另核。

## 九、动态事实表（2026-10-14 补核）

[研究：范围] 本表覆盖本页与音频正文的动态选型事实，区分本次重读、继承限定补核和仍未闭合。核实日期是读取日期，不是网页永久快照；复核列均取“实际采用前”与 2026-11-14 中较早者。价格只记公开显示，未登录账户、结账或验证区域 SKU。版权安全、可执行版权、独占性、全依赖清权均不因本表存在而宣告通过。

| 事实／精确范围 | 官方来源与本次状态 | 核实日期 | 下次复核 | 对采用的影响 |
|---|---|---|---|---|
| Eleven `eleven_v4`／`eleven_v4_turbo`，90+ 语言；API／WebSocket 入口不同 | [模型表](https://elevenlabs.io/docs/overview/models)、[9 月 28 日发布，10 月 12 日更新](https://elevenlabs.io/blog/eleven-v4)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 保存型号与接口，不把厂商延迟／偏好测试当游戏实测 |
| v4 US$0.08／千字符，Turbo／Flash US$0.04；音乐 US$0.15／分钟，SFX US$0.12／分钟 | [API 价页](https://elevenlabs.io/pricing/api)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | API 美元与 Creative credits 分账；最低计费、税与废弃率另核 |
| 非 Beta TTS／SFX：免费非商业，付费有条件；一般帮助保留付费期生成内容商用权 | [non-EEA 条款 §1(c)、§4](https://elevenlabs.io/terms-of-use)、[发布帮助](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 地区合同及具体入口状态另核；不套到 Music 特别条款 |
| SFX v2：接口 0.5–30 秒，能力页 0.1–30 秒；循环／WAV 口径须分开 | [接口](https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert)、[能力页](https://elevenlabs.io/docs/overview/capabilities/sound-effects)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 按接口接入，实际格式／采样接缝仍需验收 |
| `music_v2_5`：分段、参考与 inpainting；3 秒至 5 分钟 | [Music 能力页](https://elevenlabs.io/docs/overview/capabilities/music)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 支持局部修改入口，不证明听感或区间外波形不变 |
| Music 分轨：`two_stems_v1`／`six_stems_v1` | [分轨接口](https://elevenlabs.io/docs/api-reference/music/separate-stems)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 分离轨不是原生独立轨，保留串音反证 |
| Eleven Music 游戏范围、主体／收入、下载格式、升级／存量条件 | [Music Terms](https://elevenlabs.io/music-terms)；仅继承 [WP1 当日限定补核](2026-10-14-game-wp1-licensing.md#2026-10-14-补核游戏音乐与meshy输出权利)，本轮不重复审定 [研究] | 2026-10-14（继承） | 采用前或 2026-11-14 | 仅适用 Music；具体主体、账户和合同例外仍需确认 |
| Suno v6／v6-wild／v6-mini，最长 8 分钟及计划差异 | [v6 官方帮助](https://help.suno.com/en/articles/13924801)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 成曲能力不等于循环／主题层一致 |
| Suno 年付折合 Pro US$8／月、Premier US$24／月；2500／10000 credits 与 20／60 下载每月分开 | [公开价格](https://suno.com/pricing)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 不是同价月付或账户余额；不得按生成次数推下载额度 |
| Suno 官方 Download、平台 Remix、免费旧歌追溯边界 | [Terms](https://suno.com/terms)、[追溯帮助](https://help.suno.com/en/articles/2425729)；仅继承上述 WP1 限定补核，不重复核心结论 [研究] | 2026-10-14（继承） | 采用前或 2026-11-14 | 实际编辑功能是否属于合同定义／另行方案，仍须逐资产核查 |
| Voice Library 所有者撤下：无通知期可即时失去调用；最长通知期 2 年 | [产品文档](https://elevenlabs.io/docs/eleven-creative/voices/voice-library)、[附加条款 §4、§8](https://elevenlabs.io/vla)，本次交叉重读 [一手] | 2026-10-14 | 选音／补录前或 2026-11-14 | **新增反证：平台可随时移除、可不通知；通知期不是 SLA**。旧导出使用与未来补录分开 |
| ACE-Step 1.5 官方 turbo 包 MIT；turbo 不含 base 的 extract／lego／complete | [官方包卡](https://huggingface.co/ACE-Step/Ace-Step1.5)，本次重读；固定代码许可沿用 §2.4 [一手／研究] | 2026-10-14 | 采用前或 2026-11-14 | 不外推第三方微调／输入音乐权利；训练合规只是作者声明 |
| ACE `acestep-v15-xl-turbo` 卡 MIT，4B DiT、8 步；≥12 GB 需 offload＋INT8 | [XL 卡](https://huggingface.co/ACE-Step/acestep-v15-xl-turbo)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 不复用旧低显存预算；模型总量、权重体积、运行显存不同 |
| Stable Audio 3 Small-SFX／Small-Music 120 秒、Medium 380 秒；Large API／企业 | [官方仓库](https://github.com/Stability-AI/stable-audio-3)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | CPU／速度是作者兼容与性能声明，非本机或游戏帧预算 |
| Small-SFX：代码 MIT，权重 Community，T5Gemma 另许；商业注册及关联方收入条件 | [模型卡](https://huggingface.co/stabilityai/stable-audio-3-small-sfx)、[许可入口](https://stability.ai/license)、[Community](https://stability.ai/community-license-agreement)、[Gemma](https://ai.google.dev/gemma/terms)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 修正旧跳转描述；仍不宣称全栈 MIT 或输出绝无侵权风险 |
| Qwen3-TTS-12Hz-1.7B-CustomVoice＋Tokenizer-12Hz 均 Apache-2.0；9 音色、10 语言，0.6B 不继承全部控制 | [CustomVoice](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice)、[Tokenizer](https://huggingface.co/Qwen/Qwen3-TTS-Tokenizer-12Hz)，本次重读；固定代码沿用 §2.6 [一手／研究] | 2026-10-14 | 采用前或 2026-11-14 | 指定组合可评估；不授真人声音、剧本或其他 checkpoint 权利 |
| Kenney Interface Sounds 100 件／Music Jingles 85 件，指定包 CC0 | [Interface](https://kenney.nl/assets/interface-sounds)、[Jingles](https://kenney.nl/assets/music-jingles)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 保存实际包内许可，不外推站外转载 |
| jsfxr Unlicense；Free 可导出 WAV、Free／Pro 均可商用 | [仓库许可](https://github.com/chr15m/jsfxr/blob/master/UNLICENSE)、[官方对照](https://sfxr.me/)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 保留固定源码的随机噪声／参数非线性反证，不承诺位级复现 |
| StepAudio 3 Gen 仍仅列观察 | [项目页](https://stepaudiollm.github.io/step-audio-3-gen/)，本次可读，但未取得对应商用权重／服务合同 [一手／研究] | 2026-10-14（未闭合） | 采用前或 2026-11-14 | 不作为 Qwen 免费商业替代，不把论文样例等同生产授权 |
| Unity Assistant 2.3.0-pre.2 Text to Sound：少量 SFX 原型；Loop 仅重复播放 | [声音生成](https://docs.unity.cn/Packages/com.unity.ai.assistant@2.3/manual/Sound/sound-generate-prompt.html)、[编辑](https://docs.unity.cn/Packages/com.unity.ai.assistant@2.3/manual/Sound/sound-edit.html)；继承 [WP9 §8](2026-10-14-game-wp9-engine-handoff.md#8-unity-原生生成器补核原型集成不等于发行管线)，本次独立取文报错，非重新核实 [研究] | 2026-10-14（继承） | 采用前或 2026-11-14 | 维持现成／jsfxr 优先；不把计费品类推成该包已具备音乐／TTS，发行资格按 WP9 条款分层 |

[研究：覆盖边界] 固定 SHA 的 jsfxr／ACE 源码反证、Unity 6 固定版本机制及 Fortnite 历史案例保留原核实范围，未在本次重跑或转换成“当前部署仍在线”声明。Meshy 不属于本表；WP1 的三项核心结论只继承其中音频相关范围。本轮没有试听、模型／引擎运行或新增商业清权结论。

[研究：阶段 F 本次验证] `python3 scripts/check_repo.py` 检查 177 个文档／config，无错误；四个负责文件的 `git diff --check` 通过。用环境已有 pandoc 按 GFM 转为 HTML，核对两张开头决策表及 20 条音频／22 条动画动态事实均在表格中，事实表各行五列；四文件本地锚点逐一比对，无缺失。仅文档与呈现检查，本次未重跑完整离线 14 阶段，也未验证 hosted CI、试听、模型／引擎或版权安全。没有安装、付费、下载权重或 Git 写入。


## 十、从可播放到可读、耐听的游戏反馈

核实：2026-10-14 UTC。主线 2／3／4；本节改变“资产合格和播放安全即足够”的隐含建议，增加声音身份、动作时序、混音焦点和可持续制作成本。仅公开文档、开发者讲稿及项目说明阅读；没有试听、下载示例、运行引擎／模型，也没有测得反应速度或疲劳改善。[研究]

### 10.1 先保护可学习的声音身份

[Overwatch 团队 GDC 2016 原始讲稿](https://media.gdcvault.com/gdc2016/Presentations/Lawlor_Neumann_Overwatch_Play_by_Sound.pdf)第 13–21 页按威胁线索分层，第 49 页连接角色身份、上下文与游戏状态，第 71 页反而强调关键声音／语音保持较少变化。作者将这些设计与快速反应、情绪响应联系起来；这是已制作游戏的专家实践，讲稿没有给出可移植的对照实验效应量。[一手]

**采用机制，不复制规模：** 小型动作游戏先区分落空／命中／格挡、危险／奖励，保留各自起音和节奏；在普通脚步、材质撞击内做去重复变体。重量感可以来自瞬态与尾音的关系、动作同步和周围留白，不必把每次命中做得更响、更长。关键提示如果越来越难认，就缩小随机范围或恢复固定音；没有资料支持通用“至少 N 个变体”或任意 pitch 范围。[研究]

动作时序分成输入响应、动作接触、结果确认和背景情绪：起手可即时反馈，真实命中／格挡才播放对应结果；音乐的拍点等待不能套到关键命中。Unity 6.3 [AudioClip 导入说明](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioClip.html)给出预加载、后台加载与解压／压缩／流式取舍；建议将关键短音的就绪检查与首用加载独立处理，不能仅删除文件头静音就宣称端到端低延迟。具体声卡、缓冲与设备体验仍待验证。[一手／研究]

### 10.2 原生基线能解决什么，不能解决什么

| 路线 | 采用判断及真实收益目标 | 代价与撤回条件 |
|---|---|---|
| Unity 6.3 LTS AudioSource＋AudioMixer＋Audio Random Container | ✅ 默认。少量事件、普通随机变体、分组混音、简单音乐状态优先原生；不用为基础去重复再建框架 | 仍须设计触发、音色与音乐段落。变体降低辨识就减少；压低效果导致抽吸／情绪断裂就减弱或移除 |
| 小型自有音频事件配置 | 🧪 只补逻辑 ID、语义类别、触发位置、并发／重触发策略和素材映射；业务代码不掌握文件细节 | 不复制整套音频编辑器；字段和跨模块事件只增加确有用的部分。场景改动无需复用时可保持直接组件 |
| FMOD 制作工作流 | 🧪 频繁编辑参数化分层、节拍转场、混音并需要边玩边调时再比较；价值在作者迭代，不在品牌自带好音质 | Studio／集成版本、bank 构建／加载、平台输出与许可增加维护。若只播放少数循环而节省不了编辑时间，留在原生 |

[Unity 6.3 Audio Random Container](https://docs.unity3d.com/6000.3/Documentation/Manual/AudioRandomContainer-UI.html)有 Shuffle、Avoid Repeating Last、音高／音量范围，Manual 可随实际事件触发；Automatic 的时间播放不替代脚底接触或命中判定。[一手／研究] 本节仅确认 6000.3 文档能力，不外推旧版本或所有平台已验证。

[AudioMixer Inspector](https://docs.unity3d.com/6000.3/Documentation/Manual/AudioMixerInspectors.html)确认 Send 驱动 Duck Volume，同时说明脚本设置 exposed 参数后，该参数不再随 snapshot 改变。[一手] 因此玩家偏好音量与情境衰减应有独立控制层；这是为了让玩家设置和情绪混音共存，不要求建立复杂总线树。[研究]

[AudioSource.priority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html)用于超过 real voices 上限后的虚拟化，同优先级再比较音量；WebGL 不受该设置控制。[一手] 这与“已播放的声音互相掩蔽”不同：优先级不能代替清晰混音，项目还需针对高频事件限制重触发／叠加。关键警告、对话、环境谁让位由玩法决定，不能仅按距离或统一优先级数字推断。[研究]

音乐转场的升级目标应具体到编辑任务。[FMOD 2.03 事件制作说明](https://www.fmod.com/docs/2.03/studio/authoring-events.html)已有按拍／小节量化的 transition region 和独立 transition timeline，可编排桥段与交叉淡化；原生 DSP 调度也能实现已设计的简单切换，区别在反复修改时谁更省制作工作，而不是前者才会准时播放。状态频繁来回时先平滑进入／退出条件；节拍等待期间仍保留即时玩法提示。[一手／研究]

### 10.3 现成实现与专业案例的边界

- **Chop Chop：改造思路，不整包采用旧系统。** Unity 官方 [Audio system 说明](https://github.com/UnityTechnologies/open-project-1/wiki/Audio-system)展示原生 AudioSource／AudioListener、cue／配置／空间位置分离和 emitter 池；同页明确当时音乐没有 cross-fade 支持。仓库 [README](https://github.com/UnityTechnologies/open-project-1)声明 2021 年 12 月停止开发、基于 Unity 2020.3；[根许可 Apache-2.0](https://github.com/UnityTechnologies/open-project-1/blob/main/LICENSE)。它证明有公开可读实现，不证明可直接升级到 6.3，也不外推每件附属素材许可。本轮未固定源码复测，正文不推荐照搬其选择器。[一手／研究]
- **Celeste：学习作者如何组织成品，不作为素材包。** [FMOD 官方项目指南](https://www.fmod.com/docs/2.03/studio/appendix-a-celeste.html)列 Power Up Audio／Lena Raine 的完整项目和事件解释，支持对成品 Live Update；该历史项目要求 FMOD Studio 1.10.xx，不能因指南位于 2.03 就当成当前集成示例。其 EULA 限个人／教育用途，源音频不得另用于新项目；有专业音频人员的成功不能证明单人零手修能复现同样质量。[一手／研究]
- **FMOD 当前能力与维护：** 本次 [Unity Integration 2.04 指南](https://www.fmod.com/docs/2.04/unity/user-guide.html)说明 bank 加载、平台构建和升级步骤；[Studio 迁移说明](https://www.fmod.com/docs/2.04/studio/advanced-topics.html)要求关注版本兼容，迁移保存后旧版不能再打开。原生不能有效承载频繁的音乐编排修改时才评估中间件，而不是因原生没有某个专业面板就迁移。[一手／研究]

### 10.4 包容性也影响反馈质量

[XAG 103](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103)要求重要视觉／音频信息有其他感官表达；[XAG 105](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/105)建议独立音量、单声道和可暂停音频（原指南另列短于三秒事件及实时多人会话等例外）；[XAG 104](https://learn.microsoft.com/gaming/accessibility/xbox-accessibility-guidelines/104)展示声音字幕附方向提示。[一手] 采用：从同一玩法事件驱动音效与相应视觉提示，先覆盖失败会影响操作的警告；关音乐不能连带关提示，单声道不能吞掉只在一侧的事件。并非给全部环境声堆满字幕，也不是有几个选项就通过无障碍认证。[研究]

后续获准试玩时，应同时检查：新玩家能否区分结果；密集操作中是否仍听见危险；重复操作是否疲劳；音乐是否自然承接而非频繁重启；扬声器／低音量／单声道／无声能否保持关键信息。把“好听、爽快、可读”和“无 click、无缺引用”分别记录；前者必须有人在玩法中判断，自动峰值／长度检查不能替代。[研究]


[研究：本节验证] 两个负责文档的 `git diff --check` 与 `scripts/check_repo.py`（177 文件）通过；GFM 渲染核对新章节锚点及三行比较表。未重跑完整离线入口，未试听、运行模型／引擎或进行玩家研究；不将文档检查当成听感、低延迟或无障碍验收。

### 10.5 Unity／Unreal：同一质量目标，不同原生职责

**版本与证据范围（2026-10-14 UTC）：** Unity 使用本文既有的 6000.3 LTS 基线，[支持页](https://unity.com/releases/unity-6/support)列支持至 2027-12；不是宣称 LTS 永远优于 Update。UE 按 [5.8 正式发布公告](https://www.unrealengine.com/news/unreal-engine-5-8-is-now-available)（2026-06-23）与下列当前标注 5.8 的文档核对，不声称测过最新 hotfix。[UE 5.4 发布说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5.4-release-notes?application_version=5.4)已明确 MetaSounds 转为 Production Ready／退出 Beta；当前 [MetaSounds Quick Start](https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-quick-start)却仍显示 Beta 警示，两份官方文档存在不一致。成熟度采用明确发布里程碑，不用教程遗留横幅将整个系统降回 Beta；表中🧪针对项目是否需要新增图制作复杂度，具体 SeekRestart 的实验状态另外核查。生产就绪不证明本项目设备表现或所有版本兼容。[一手／研究]

| 玩家质量目标 | Unity 6000.3 原生路径 | UE 5.8 原生路径与采用判断 |
|---|---|---|
| 命中、格挡、脚步清楚且不机械重复 | 实际玩法事件触发 AudioSource／Random Container；保留关键起音，限制变体 | ✅ 普通 Sound Wave／Sound Cue 已满足就沿用；🧪需要随速度、材质或强度改变声源时再用 MetaSound。避免为了换系统重写已合格反馈 |
| 密集战斗仍能听见危险 | AudioMixer 分类、Send／Duck Volume 留位置；priority／real voices 处理资源竞争，事件层限制重触发 | Sound Class／Sound Mix 处理分组状态，Submix 汇总处理，Sound Concurrency 处理最大并发、重触发与淘汰；三者不能互相替代 |
| 音乐连续、分层同步、转场不抖动 | 以 dspTime 提前 PlayScheduled；快照只负责混音变化 | Quartz Clock／Play Quantized 提前安排边界；MetaSound 可组织声源图。先有合法可循环素材与正确乐句，再设计转场；即时命中不等音乐边界 |

表中采用顺序是任务推导，不是跨引擎音质／性能排名。[研究] UE [Sound Classes](https://dev.epicgames.com/documentation/unreal-engine/sound-classes-in-unreal-engine?lang=en-US)确认分组参数、Sound Class Mixes 和路由；[Audio Mixer Overview](https://dev.epicgames.com/documentation/unreal-engine/audio-mixer-overview-in-unreal-engine)区分音频逻辑线程与做 DSP／混音的 audio render thread，并说明 Submix 汇总效果。**不要把 Unity 的 AudioMixer 资产与 UE 同名底层 renderer 当成一一对应产品，也不要把 MetaSound 当总线混音器或游戏状态机。** 玩家偏好音量与临时情境衰减分别控制、检验两者叠加，是两条路线共同的设计要求。[一手／研究]

**动作和节奏：精确渲染靠提前安排，不靠游戏线程准点回调。** [Unity PlayScheduled 6000.3](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource.PlayScheduled.html)公开代码用两个 AudioSource 交替拼段、在 Update 中提前排未来 dspTime，给加载／缓冲留准备时间；它不是“禁止 Update”，也不是每帧减倒计时后普通 Play。[Quartz Overview](https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-quartz-in-unreal-engine)说明游戏线程通过 Clock Handle 提交未来请求，Clock／Metronome 在 audio render thread 按拍或时间定位，甚至可在 buffer 中间开始。采用：可预知的音乐和周期声音提前安排，未知命中结果就绪即触发；节奏玩法的输入时间戳／判定窗口另以选定时基校准，不以 Blueprint 拍点通知到达时间冒充音频实际开播。调度无法追回迟交请求，也不消除声卡／蓝牙延迟、素材首用加载或游戏逻辑卡顿；缓冲和准备提前量需在目标设备测，本文不给通用毫秒数。[一手／研究]

**过载先查生命周期，再提高 voice 上限。** [MetaSounds Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-reference-guide-in-unreal-engine)确认 Source 可独立出声、Patch 用于复用；Preset 继承只读父图并覆盖输入，父图修改会传至子 Preset。适合“同一脚步结构换材质／参数”，不适合假设每个变体图已独立冻结。带 UE.Source.OneShot 的短音若未触发 On Finished，会持续播放；尾音结束后必须完成，而循环环境音应明确其停止／销毁归属。[一手／研究]

[Sound Concurrency Reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-concurrency-reference-guide)确认 Max Count 统计所有 active components，不只听得见的声音；同一共享资产统一状态，多条规则须全部满足，Retrigger Time 拒绝的声音忽略虚拟化设置，Voice Steal Release Time 可给淘汰声淡出。采用：普通撞击、环境与关键提示不要挤在一个未区分用途的全局限额里；选 Prevent New／Stop Oldest／优先级策略时明确保护的是新警告还是旧尾音。把所有优先级抬高、只调距离或只压音量不能解决掩蔽。[一手／研究]

[EVirtualizationMode](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/EVirtualizationMode)的反例尤其重要：PlayWhenSilent 继续占 voice；Restart 的循环在恢复时从头开始；SeekRestart 在该页仍标 EXPERIMENTAL，只承诺尝试定位。需要保持音乐相位时，不能随意套用远处环境音的 Restart，也不能把 PlayWhenSilent 写成免费虚拟化。先限制持续声源数量并验证返回可听范围／资源竞争后的恢复，再决定保留播放的 CPU、解码和内存成本是否值得；虚拟化不等于免加载、免 DSP 或清晰混音。[一手／研究]

**先借现成的小例子，不移植完整框架。** Unity 的 PlayScheduled 页有可读调度示例；UE Quick Start 有炸弹从持续火花到爆炸、以及速度驱动风声的具体图和生命周期连接，可先按自己的合法音频重建最小声源。[Lyra 官方样例说明](https://dev.epicgames.com/documentation/en-us/unreal-engine/lyra-sample-game-in-unreal-engine)提供随引擎更新的模块化项目，Quick Start 指向它的更复杂环境响应；适合后续获准时只检查所需音频部分，不因它完整就引入多人框架。公开教程可读不等于素材可任意再分发；本轮未下载 Lyra、未阅读其实际包内许可／源码，不称其为开放许可音频素材库，也不声称完成 5.8 移植验证。[一手／研究]

**中间件的门槛仍是制作瓶颈。** 现有原生能表达少量状态、混音和调度时，✅留在原生；当第二次修改反复卡在大量音乐过渡、参数曲线或跨角色事件制作，再🧪比较 FMOD／Wwise 的实际编辑工作量与集成／bank／许可维护成本。本节不新增 Wwise 版本、价格或性能结论，不因为出现 Quartz／MetaSounds 就认为中间件失去价值，也不为专业音质强行增加一套系统。[研究]

后续验证只需围绕这三个质量目标增加压力情境：连续命中时警告不丢；短音停止后 active／voice 数回落；游戏帧抖动时已提前排好的音乐边界保持连续；离开再返回、暂停恢复及 16→8 小节修改后不重启错位。具体改善仍要实际听、测目标设备；本节是公开 API／示例阅读，未运行引擎、试听或做延迟／性能实验。[研究]

[研究：10.5 验证] 2026-10-14 完整 `python3 scripts/check_offline.py` 14 阶段通过，套件非空且无 skip；`git diff --check` 通过。只证明仓库文档／配置与既有确定性检查通过，不证明上述音频实现、目标设备表现或许可清权完成。
