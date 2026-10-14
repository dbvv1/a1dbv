主线：2 额外能力何时值得加；3 第二次修改仍可靠；4 音频资产长期交付
改变的建议：将音频从品牌候选改为“现成/参数化优先、按事件离线生成、运行时调度”；补近月具体型号与声音供应连续性门槛
新证据：2026-09-28 Eleven v4、当前 Music v2.5/Suno v6、Stable Audio 3 与 ACE XL；固定 jsfxr 随机噪声源码和 ACE repaint API；Fortnite 实际采用及独立声音权利反证

# WP6：音频资源路线、可修改性与授权边界

核实：2026-10-13 UTC（2026-10-14 UTC+8）。范围仅理论、一手网页与固定源码阅读。没有安装、模型/引擎运行、试听实测、付费、权重下载或操作用户电脑。来源页面虽提供音频试听，本轮仅核产品/接口与可见样例存在，不冒称听感比较。所有“最佳”均是针对单人程序员、无人工音频修补的条件推荐，不是盲测冠军。

## 一、采用判断与适用条件

**✅ 采用：音效按事件生产、音乐按可切换结构生产、配音按角色和台词 ID 生产，默认离线生成后交付固定音频。** 短电子反馈先用 jsfxr；通用 UI/撞击/胜负提示先选许可清晰的成套资源。仅在这些资源表达不了的材质、环境或角色上增加生成模型。运行时首先解决触发、变体选择、混音和节拍切换，不能用“实时生成音乐”代替这些结构。[研究]

| 任务 | 最佳质量条件档 | 最佳性价比条件档 | 本地/免费条件档 |
|---|---|---|---|
| SFX | 👀 采用 `eleven_text_to_sound_v2` 作为独特 Foley/环境音候选，逐事件导出；不是把整段“脚步+开门+战斗”当一个资产 | ✅ 采用 Kenney Interface Sounds 等合适成套包；🧪 改造 jsfxr 做反馈音，缺口才购买生成次数 | ✅ jsfxr 短电子音；👀 Stable Audio 3 Small-SFX 仅在商业注册、Community/T5Gemma条款与硬件满足后评估，不能保证真实Foley质量 |
| 音乐 | 👀 采用 `music_v2_5` 的分段生成/修补供非节奏核心的器乐BGM；需要演唱成曲可对照 Suno `v6`，先过WP1下载和Remix门槛 | ✅ 少量授权循环+胜负jingle+程序状态机；有独特主题需求才比较生成服务的可用分钟成本 | 👀 ACE-Step1.5 官方 turbo；有≥12GB显存且接受量化/offload成本时再评估 `acestep-v15-xl-turbo`；无机器预算就用合法现成循环，不能把模型免费写成生产免费 |
| 配音 | 👀 `eleven_v4` 离线角色台词，固定授权音色、上下文和发音表；强戏剧整场演出仍须逐句判断 | 🧪 `eleven_v4_turbo` 或已验收的 `eleven_flash_v2_5` 做大量低戏剧短句；完整旁白保留 Multilingual v2 对照 | 👀 已清权组合 Qwen3-TTS-12Hz-1.7B-CustomVoice + Tokenizer-12Hz；从预设音色起步，不默认克隆真人；文本+短语音反馈也是可发布方案 |

最关键的局限：**参数和后处理能修规格、调度与部分接缝，修不了错误的声源语义、戏剧表演、旋律发展或未经授权的声音。** [研究]

上表“采用”表示采用该决策路线；模型均未通过本项目的零手修游戏验收。质量档不意味现成素材天然低质量；对脚步、UI等明确任务，合适现成素材可能比最新模型更好。这里取代的是“一切重新生成、最新模型包办全音频”的默认，不要求替换已通过验收的旧资产。[研究]

## 二、近期版本为什么改变选型

### 2.1 Eleven：不能继续只写v3、Music v1或笼统品牌名

- 官方9月28日发布、10月12日更新的 [Eleven v4公告](https://elevenlabs.io/blog/eleven-v4)列音频标签、IPA发音、说话人保持、多说话人上下文和请求拼接改进；有公开样例。其偏好测试与低延迟数值是厂商测试，不是本轮独立比较。[一手]
- [现行模型表](https://elevenlabs.io/docs/overview/models)列 `eleven_v4`、`eleven_v4_turbo`（90+语言）、`eleven_text_to_sound_v2`、`music_v2_5`；Flash v2.5仍在，旧Turbo v2/v2.5被Flash替代。不能把v4 Turbo和旧Turbo v2.5混为一谈。当前v4通过Text to Dialogue API，v4 Turbo通过Text to Dialogue WebSocket；迁移不是仅替换旧TTS请求的model_id。[一手]
- [Music能力页](https://elevenlabs.io/docs/overview/capabilities/music)确认v2.5可用composition plans、音频参考和inpainting，3秒到5分钟；音频参考约30秒且为风格引导，不保证跨风格改编。结论是优先保留段落与参考，而不是每次从提示词重做整曲；官方“只改所选段落”承诺仍须以导出波形和听感验收。[一手/研究]
- [stem separation API](https://elevenlabs.io/docs/api-reference/music/separate-stems)提供two_stems_v1/six_stems_v1，返回分轨ZIP且提示可能高延迟。**分离得到的stem不是原生独立录制分轨**；需要检查串音、残响尾音和相位，不能因有六轨接口就保证任意状态组合干净。[一手/研究]

### 2.2 SFX实际接口与宣传有边界差异

[创建SFX接口](https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert)只列 `eleven_text_to_sound_v2`，`loop`默认false，时长0.5–30秒，prompt_influence默认0.3。[能力页](https://elevenlabs.io/docs/overview/capabilities/sound-effects)则写0.1–30秒，并称MP3适用于全部效果、48kHz WAV用于非循环效果。接入时按API字段至少0.5秒规划，并保存真实返回格式；不把loop选项推成“所有编码格式均采样无缝”。[一手/研究]

推荐单独生成“开门”“金属撞击”“脚步单击”等短事件，再由引擎决定顺序；整段复合音会把交互时间锁死。可程序补：去静音、短淡入淡出、有限EQ/增益、裁切、轻度pitch/volume变体与去重复随机选择。不能补：脚步材质错误、音色里混入背景音乐、应为一次撞击却有两次主瞬态。[研究]

### 2.3 Suno v6：近期成曲对照，但不默认游戏循环主线

9月9日的[官方v6说明](https://help.suno.com/en/articles/13924801)区分v6、v6-wild、v6-mini；三者最长8分钟，前两者Pro/Premier、mini全部计划；Extend/Cover/Replace Section及Custom Models已围绕v6。对固定风格资产，wild的探索性不构成默认优势；成曲长度也不证明循环或多状态同主题一致。[一手/研究]

[当前公开价格页](https://suno.com/pricing)年付折合Pro $8/月、Premier $24/月，分别2500/10000 credits和每月20/60首下载，税结账计算。该页是年付显示，不能当可随时退的同价月付；下载次数与生成额度两本账。[WP1已核的平台Remix限制](2026-10-14-game-wp1-licensing.md#音频具体产品下载与生成时间决定授权)仍适用，界面将工具列入“Remix & Edit”不自动证明每项编辑法律上都等于Remix，需按实际功能、输入权利与当期合同核定。[一手/研究]

### 2.4 本地音乐：ACE 1.5不再只有旧turbo

固定[README SHA ca1e85fe9430179831e6bc6be790c332190a3866](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/README.md)中，turbo及XL-turbo为8步，有repaint/cover，但extract/lego/complete只在base分支列支持。不能给turbo写“全功能多轨生成”。[一手]

[XL-turbo官方权重卡](https://huggingface.co/ACE-Step/acestep-v15-xl-turbo)标MIT、4B DiT、8步；≥12GB需CPU offload+INT8，≥20GB无需offload，≥24GB标完整XL+4B LM。卡内权重体积约18.8GB与README的decoder约9GB不是同一口径，不能用其中一个推出整管线下载/内存。官方声明数据来源合规、输出可商用，不等于本轮数据审计或侵权保险。[一手/研究]

采用：已有机器预算时比较旧turbo与XL；只有其降低本项目淘汰率或修改回归成本才替换。撤回：显存/时延不合、固定主题重现差、需要turbo没有的分轨任务。没有已核的同一游戏新旧版盲听/成本对照，不能称XL已证明性价比最高。[研究]

### 2.5 Stable Audio 3：补上本地SFX，但必须补WP1

5月20日[官方发布](https://stability.ai/news-updates/meet-stable-audio-3-the-model-family-built-for-artistic-experimentation-with-open-weight-models)和[维护中的官方仓库](https://github.com/Stability-AI/stable-audio-3)明确 Small-SFX/Small-Music 为本地小模型、最长120秒，Medium380秒需GPU，Large为API/企业路线。支持inpainting和continuation。8月[提示指南](https://stability.ai/guides/stable-audio-3-prompt-guide)定位主要器乐，不应以它代替TTS或演唱首选。[一手]

[Small-SFX卡](https://huggingface.co/stabilityai/stable-audio-3-small-sfx)说明T5Gemma文本条件、英语、音频训练集来自AudioSparx和Freesound多种许可；卡上0.6B与仓库433M不宜混写成同一统计口径。其“消费硬件/CPU可运行”是作者兼容声明，不是本轮验证的帧预算或生成速度。[一手/研究]

代码[LICENSE](https://github.com/Stability-AI/stable-audio-3/blob/77e0398c26f7d22d801ec1bb036307e8b231f741/LICENSE) MIT；权重为Stability Community并额外包含T5Gemma条件，**不是MIT模型全栈**。见文末许可补表。在先满足授权时，它取代把TangoFlux当作免费商用SFX默认的路线；未满足时用现成SFX/jsfxr，不换个下载镜像绕过许可。[一手/研究]

### 2.6 本地配音的精确能力与新模型观察

固定[Qwen3-TTS README 022e286b98fbec7e1e916cb940cdf532cd9f488e](https://github.com/QwenLM/Qwen3-TTS/blob/022e286b98fbec7e1e916cb940cdf532cd9f488e/README.md)：1.7B CustomVoice有9预设音色、10语言和指令控制；0.6B CustomVoice没有同等instruction-control标记；Base用于短音频克隆，VoiceDesign按描述设计声音。不要为了“本地省钱”静默换0.6B，却保留1.7B情绪控制承诺。[一手]

9月[StepAudio 3 Gen项目](https://stepaudiollm.github.io/step-audio-3-gen/)与[技术报告](https://arxiv.org/abs/2609.12945)展示语音、环境、SFX、音乐合成场景；本轮未核到对应可商用下载权重/明确服务合同，不把它当作免费本地Qwen替代。完整场景声音并不天然适合可交互事件拆分。继续观察明确交付和许可，不用论文样例替代生产能力。[一手/研究]

## 三、第二次修改：本轮有代码/接口证据，没有假装已实测

### 3.1 jsfxr：参数化可局部修改，但“存参数=位级复现”是错的

[固定sfxr.js b7b6aa27d62f8f356db267276bf54b451555c49d](https://github.com/chr15m/jsfxr/blob/b7b6aa27d62f8f356db267276bf54b451555c49d/sfxr.js)的 `Params.prototype.mutate`随机改多项参数；`getRawBuffer`生成噪声时调用Math.random；包络attack/sustain/decay以参数平方映射样本长度。[一手：源码阅读]

因此第二次要求“保持识别感，仅尾音缩短”时，直接改decay而非点mutate或重抽预设；缩放参数不等于同比缩放毫秒。冻结既有WAV及参数，噪声分支若要求位级复现还需受控PRNG和同版本渲染路径。无测试前不承诺修改前缀样本完全不变。这个反证使程序化方案更可维护，但不神化它。[研究]

### 3.2 音乐：改一段与拥有可任意重配的stem是两件事

固定[ACE REST API](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/docs/en/API.md)有repainting_start/end、chunk_mask_mode=explicit，并返回seed、DiT/LM、元数据。它证明可编码的局部修改入口，不证明区间外波形位级不变或前后和声相容。[一手/研究]

第二次要求“探索音乐不换主题，进入战斗时更密；从16小节改为8小节”时：
1. 优先在同一组已对齐stem上开关/混合打击乐层；无可靠stem时用已验收低/高强度片段加转场，不强行分离
2. 修改长度采用乐句边界裁切或局部repaint，保留原文件作为回退
3. 校验采样数、拍号、BPM、调性、过渡点、循环尾音；这些字段只是约束目标，生成文本标120BPM不能替代测量
4. 重播探索→战斗→菜单→恢复并快速反复切换，检查重复触发、旧音乐未停、重叠峰值、节拍相位与包体

这是一项后续验收设计，未运行；真正证据目前只支持“能局部指定修改”，不支持“零手工听感修复已成功”。[研究]

### 3.3 配音：内容改10%，不能默认全角色重生

台词键保持稳定，保存文本hash、角色voice_id、模型ID、语言、上下文、发音表、生成参数及最终音频hash。只重生改动句及确有上下文受影响的邻句，旧音频保留；ASR回读可查漏字/错字，不能判定讽刺、恐惧、角色关系和情感弧线是否到位。[研究]

更重要的新反证是[Voice Library官方说明](https://elevenlabs.io/docs/eleven-creative/voices/voice-library)：无notice period音色可立即下架；有notice最长两年；某些音色live moderation还引入额外延迟。**已导出音频可以继续使用**和**未来补一句还能调用同音色**不是一个承诺。角色选音应优先明确通知期和连续性安排；下架风险不可由缓存解决全部未来DLC。[一手/研究]

## 四、循环、状态与离线/运行时的分界

- **循环是资产+解码+调度联合性质。** 首尾数值接近只能排查click，不能排查短语未完成、持续混响被切断或节奏重复感。离线解码到工程母版后保存精确loopStart/loopEnd采样点，必要时短crossfade；crossfade可能抹掉瞬态，不能自动解决节拍/和声。[研究]
- Unity官方 [AudioSource.PlayScheduled](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AudioSource.PlayScheduled.html)基于dspTime、独立于帧率并允许预缓冲；[AudioMixer.TransitionToSnapshots](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Audio.AudioMixer.TransitionToSnapshots.html)提供带权混音过渡。前者安排开播、后者调混音，不会识别一首生成曲的正确乐句边界。[一手/研究]
- 状态机至少区分事件one-shot、持续loop、音乐状态与对话ducking；玩法事件引用逻辑ID而非文件名或远程模型。新生成文件替换映射，不重写散落脚本。音量、动态范围和同时发声上限按目标设备/玩法验收，不套用单一平台响度数字到所有游戏。[研究]
- **默认离线预生成**：固定内容可回归、无玩家网络依赖、无每玩家推理账单；引擎只播放缓存文件。可运行时合成的是简单参数化声音和状态混音，不必引入神经网络。[研究]
- **运行时TTS例外**：玩家自由输入、无穷命名或开放对话确实构成核心玩法，且愿意承担联网、队列、审核、隐私、服务下架及兜底成本。API密钥留服务器，缓存命中率/超时字幕回退/最大字数/每日费用先设计；不要把厂商~100ms inference latency当端到端响应保证。[研究]
- 节奏核心玩法、精确动作命中提示、叙事关键一句都不应依赖现场生成按时完成。运行时音乐若不是游戏核心创新，撤回到预生成层即可。[研究]

## 五、真实作品证据与它没有证明的事

1. [Epic官方 Fortnite Darth Vader上线说明](https://www.fortnite.com/news/this-will-be-a-day-long-remembered-speak-with-darth-vader-in-fortnite)（2025-05-16）明确实验功能使用Gemini2.0 Flash+ElevenLabs Flash v2.5，并致谢James Earl Jones遗产管理方。它是实际游戏运行时语音实例；不是v4听感测试，不是独立程序员成本证明，也不是开放克隆明星声音许可。[一手/研究]
2. [SAG-AFTRA 2025-05-19原始声明](https://www.sagaftra.org/sag-aftra-statement-fortnites-use-ai-darth-vader-voice-and-ulp-filing)同时尊重本人/遗产对数字复制品控制，并就未协商替代劳动提出ULP。此处只记录提出争议，不断言违法或最终裁决；它说明“演员/遗产同意”与集体协议义务可能并存。[一手/研究]
3. [Super_Bash_Folds作者音频清单](https://github.com/blancmathis/Super_Bash_Folds/blob/1028a3b739ef54efdcbe5a2ef0ad1714fe569c47/public/assets/audio/LICENSES.md)实际列Kenney UI/impact/jingle、qubodup菜单/战斗循环，保留许可和SHA256，仅重命名、不重压缩。可作“现成音频按用途整合”的源码案例；没有独立发售质量/用户规模证明，不能写成功商业游戏。[一手]
4. Eleven/ACE/Stable的官方可见demo说明可生成具体片段，尚无本轮核实到的、绑定最新型号且公开全部淘汰样本/第二次修改成本的零音频人员发行复盘。这个证据缺口不会阻止条件采用，却禁止“AI已经完整替代游戏音频生产”的结论。[研究]

## 六、成本：计算可用资产，不计算首次出声

[当前ElevenAPI价页](https://elevenlabs.io/pricing/api)显示v4 $0.08/千字符、v4 Turbo与Flash $0.04/千字符、Music $0.15/分钟、SFX $0.12/分钟，未含税。不要沿用已过10月12日的v4发布折扣；API美元计费与Creative credits不可混算。该页FAQ又称音乐/SFX按generation计量，能力页仍写40 credits/秒，故以下只是按挂牌音频量作预算，不保证最小计费/进位/套餐实际账单。[一手/研究]

以上商业生产须满足付费方案与对应声音/音乐条款；免费试听额度不是免费商用许可。例：最终1万字符配音、每句平均3次候选，v4挂牌变量费约$2.40、Turbo约$1.20；最终20分钟音乐、生成量3倍，按$0.15为$9。这不是整个制作报价：另有套餐门槛、分轨/编辑、废弃、下载配额、试听工时、税和后续修改。SFX若最小计费未确认，不用“1秒仅$0.002”作购买承诺。[研究：算术预算]

免费本地的总成本包括硬件/内存、依赖维护、生成时长、挑选和返工；已拥有合适设备且需要大量反复离线修改，ACE/Qwen才更有优势。只有几十个UI音时，jsfxr/CC0成套资源一般能减少依赖与清权步骤；该“性价比”是结构判断而非本轮工时测量。[研究]

## 七、授权总表的增量依据

| 对象 | 代码/权重/输出分层 | 建议补入WP1的准确门槛 |
|---|---|---|
| Kenney Interface Sounds、Music Jingles指定包 | 无运行模型；作者包页分别100/85件，CC0资产许可 | [Interface](https://kenney.nl/assets/interface-sounds)、[Jingles](https://kenney.nl/assets/music-jingles)可作免费商用现成基线；保留下载时包内许可，不能推所有站外转载同许可 |
| `eleven_v4`、`eleven_v4_turbo`、`eleven_text_to_sound_v2`、`music_v2_5` | 专有服务/无基础权重授权；现有TTS/SFX与Music合同分别适用 | 在已有行补具体型号和官方模型页；音色授权、notice period、原输出持续权与未来补录可用性分开。v4发布并不自动豁免Beta规则，生产时核具体入口状态 |
| Suno v6/v6-wild/v6-mini | 专有服务；已有商用/Download/Remix规则不变 | 公开年付计划当前20/60下载/月已核；“之前未登录故未核额度”的缺口可限定更新为公开计划数，实际账户余额仍未核 |
| ACE-Step/acestep-v15-xl-turbo | 代码仍固定MIT；[该官方卡](https://huggingface.co/ACE-Step/acestep-v15-xl-turbo)MIT并明确商用输出 | 增列指定XL checkpoint，不靠旧turbo卡外推；同样核共享组件与实际依赖，硬件门槛不沿用旧版 |
| Stable Audio 3 Small-SFX | [代码MIT](https://github.com/Stability-AI/stable-audio-3/blob/77e0398c26f7d22d801ec1bb036307e8b231f741/LICENSE)；[权重卡](https://huggingface.co/stabilityai/stable-audio-3-small-sfx)Community，T5Gemma另条款；无全栈MIT | Community商业须注册；本人/关联方合计任何来源年收入>$1M需另许，非单游戏净收入。输出在法律允许范围归用户，非模型衍生物；材料/模型分发与仅交付WAV不能混同 |

Stable补充依据：[2024-07-05 Community正文](https://stability.ai/community-license-agreement)明确注册、>$1M时终止原许可、输出归属、AUP和禁用输出改进其他基础生成模型；不是自动获得企业授权，也不是超门槛可继续用旧免费推理。Small-SFX卡的License Agreement链接实际指向Stable Audio Open1.0仓库内同名Community文本，卡另明示T5Gemma。这是当前可见授权链，应保存实际采用包许可证再放行，不以链接旧仓库名字擅改成旧非商用许可。[一手/研究]

[T5Gemma所适用Gemma条款](https://ai.google.dev/gemma/terms)（2026-04-01）附录含T5Gemma，允许按条款使用/分发，含用途限制、分发通知；Google不主张输出权利，输出不是Model Derivatives。仅生成WAV与向玩家分发/托管模型义务不同。未见一般营收或地区名单额外门槛，不等于免除贸易管制和AUP。此轮没提交注册/同意门槛，没下载模型。[一手/研究]

**声音权利必须独立核查**：基础模型/服务商用许可；剧本及音乐输入权利；本人声音/表演者/数字复制品授权（媒体、语言、角色、商业范围、补录期限、运行时生成边界）；具体音色平台条件；输出是否具有可执行版权/是否涉及第三方。合同写输出归用户是合同双方之间的配置，不保证司法管辖区承认纯AI音频版权，也不保证独占、无近似或可注册Content ID。WP1已有商用门槛不能简写成“付费即拥有所有声音”。[研究]

## 八、撤回条件与下一步证据

- 同一模型/音色升级后，新旧台词无法拼接：保留旧版已生成资产，比较整角色迁移代价，不强制换新
- 两轮局部repaint仍破坏未改段落或循环：撤回现成可循环资产/状态简化，不无限全曲重抽
- 素材通过自动响度/首尾检测但事件辨识、情绪或多状态试听失败：拒收，不把通过脚本写成音频质量通过
- 许可/正式下载消失：停止新增生产；历史合法资产权利依生成时合同判断，不直接宣布全部撤回
- 本地模型需超出已授权安装/权重/实测范围：本轮到证据建议为止；后续小实验须先确认

建议BACKLOG只保留有判别力的一项：在同一微型游戏音频需求上，比“Kenney+jsfxr”“Eleven离线”“ACE/Qwen本地”第二次修改的可用率、费用和主动工时；先做10个SFX、2组音乐状态、1角色20句台词，改一次材质/节拍/台词。没有批准前不执行。这里的规模是后续实验建议，不是本轮完成的数据。[研究]


## 验证记录

本轮仅调查、文档写入与仓库离线检查。固定源码阅读不等于运行证明；没有试听评测、模型生成、引擎导入、商业购买、协议接受或真人声音上传。本轮 `python3 scripts/check_offline.py` 14阶段全部通过，套件非空且无skip；两份文档UTF-8/LF与尾随空白检查通过。遵守不操作Git的分工，本轮未执行Git命令或提交；补丁级检查由集成端另做。以上只验证文档/config和已有确定性测试，不证明推荐音频的游戏质量。

整合交付：完整离线14阶段、受影响页74处标题引用和 `git diff --check` 通过；内部独立复核后补固定SHA及v4/ Turbo接入区别。未试听或运行模型/引擎，hosted CI按精确发布提交另核。
