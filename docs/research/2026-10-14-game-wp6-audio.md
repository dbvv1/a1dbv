主线：二／三／四；音频选型、可修改性与交付
改变的建议：[研究] 现成／参数化优先，按事件、音乐结构和台词 ID 离线生产；运行时复用混音／调度，先保可读反馈与声音供应连续性；风格化状态先比较固定声源变体，随机变化不代替状态含义；定位核心与环境宽度分开选源；新增音乐状态先核配套版本供给；长时间驻留先选音乐出场密度，不默认更多循环层
新证据：[一手／研究] C418原始访谈说明低频音乐／留白的采用理由，Minecraft 1.21.6频率选项及1.21.11按处境配置给出后续边界；SuperTuxKart同曲普通／快版许可、循环点修订及变调回退撤除，创作动因与工时仍缺；空间音频契约、下混反例与RoboRaid作者分层；Pixel Wheels 许可轮胎循环、冰面固定变调提交及发行祖先链补状态变体选择；近期型号／许可、固定音频编辑路径及上下文契约；Factorio 改速设计、2.0.36 配置与 GUI 误播修复补事件调度边界，制作工时未知；未试听或运行模型／引擎
P9 补核（2026-10-20 UTC+8）：保持三档型号，新增干声母版／固定视频接入边界，见 §2.7；仅公开资料，未试听或运行。
成套供给补核（2026-10-20）：保留已过权利与玩法验收的子集，再换缺口；OpenSFX发布修订与独立作者/生成研究的边界见末节。
本轮补充（2026-10-20，UTC+8）：声音组织模拟事件时，比较单向跟随与共同调度；Mini Metro 的实际改造和公开参数支持选择，Mini Motorways 作者反例限制推广。

# WP6：音频资源路线、可修改性与授权边界

初核：2026-10-13 UTC（2026-10-14 UTC+8）；2026-10-21补P37作者试听报告与公开文件响度读取；2026-10-22补参考短音独立比较。本仓没有模型／引擎运行、试听、付费或权重下载；文件测量不代表听感比较。所有“最佳”均是针对单人程序员、无人工音频修补的条件推荐，不是盲测冠军。

## P37最高水平卡：视频Foley与游戏短音

沿用[审计A05](../collaboration/reviews/2026-10-21-quality-audit-sota-cards.md#a05--音频)，补读其S18全文，不重新制作型号榜。核实于2026-10-21（UTC+8）；前沿比较状态：**仅候选／差距2**。

- **当前最高水平未知。** Jianxuan Yang等（Xiaomi／武汉大学）的[ControlFoley v3，2026-09-29](https://arxiv.org/html/2604.15086v3)是视频Foley质量及时间／音色控制的前沿候选，不是已验的可交互游戏声池。[作者报告／研究]
- **主流参照**为事件声池、分层／分轨与参数化播放；本轮没有市场采用率分母。[研究]
- **可行默认**仍是成套许可资源／jsfxr短反馈，独特声源再比较生成。ControlFoley权重非商业，暂不升商用默认；具体比较见[本页末节](#p37视频foley比较的结果与边界)。[一手／研究]

新增[参考短音最高水平卡与三路选择](#p37参考短音补变体还是改局部)：先区别补变体与改局部；仍为可行层推荐、整页差距2，不用局部横评代替成套二改验收。核实于2026-10-22（UTC+8）。[研究]

## 一、采用判断与适用条件

**✅ 采用：音效按事件生产、音乐按出场方式选曲目或可切换结构生产、配音按角色和台词 ID 生产，默认离线生成后交付固定音频。** 短电子反馈先用 jsfxr；通用 UI/撞击/胜负提示先选许可清晰的成套资源。仅在这些资源表达不了的材质、环境或角色上增加生成模型。运行时首先解决触发、变体选择、混音和节拍切换，不能用“实时生成音乐”代替这些结构。[研究]

| 任务 | 最佳质量条件档 | 最佳性价比条件档 | 本地/免费条件档 |
|---|---|---|---|
| SFX | 👀 采用 `eleven_text_to_sound_v2` 作为独特 Foley/环境音候选，逐事件导出；不是把整段“脚步+开门+战斗”当一个资产 | ✅ 采用 Kenney Interface Sounds 等合适成套包；🧪 改造 jsfxr 做反馈音，缺口才购买生成次数 | ✅ jsfxr 短电子音；👀 Stable Audio 3 Small-SFX 仅在商业注册、Community/T5Gemma 条款与硬件满足后评估，不能保证真实 Foley 质量 |
| 音乐 | 👀 采用 `music_v2_5` 的分段生成/修补供非节奏核心的器乐 BGM；需要演唱成曲可对照 Suno `v6`，先过 WP1 下载和 Remix 门槛 | ✅ 少量授权曲目（按需循环）+胜负 jingle+程序调度；有独特主题需求才比较生成服务的可用分钟成本 | 👀 ACE-Step1.5 官方 turbo；有≥12GB 显存且接受量化/offload 成本时再评估 `acestep-v15-xl-turbo`；无机器预算就用合法现成曲目，不能把模型免费写成生产免费 |
| 配音 | 👀 `eleven_v4` 离线角色台词，固定授权音色、上下文和发音表；强戏剧整场演出仍须逐句判断 | 🧪 `eleven_v4_turbo` 或已验收的 `eleven_flash_v2_5` 做大量低戏剧短句；完整旁白保留 Multilingual v2 对照 | 👀 已清权组合 Qwen3-TTS-12Hz-1.7B-CustomVoice + Tokenizer-12Hz；从预设音色起步，不默认克隆真人；文本+短语音反馈也是可发布方案 |

最关键的局限：**参数和后处理能修规格、调度与部分接缝，修不了错误的声源语义、戏剧表演、旋律发展或未经授权的声音。** [研究]

上表“采用”表示采用该决策路线；模型均未通过本项目的零手修游戏验收。质量档不意味现成素材天然低质量；对脚步、UI 等明确任务，合适现成素材可能比最新模型更好。这里取代的是“一切重新生成、最新模型包办全音频”的默认，不要求替换已通过验收的旧资产。[研究]

## 二、近期版本为什么改变选型

[研究] 接入顺序：先在[§9](#九动态事实表2026-10-14-补核)核精确型号、入口、生产资格与费用，再用本节选择请求结构；保存真实产物后按[§3](#三第二次修改本轮有代码接口证据没有假装已实测)验证替换范围。动态事实只在 §9 维护，固定机制与验收留在原节；型号升级不自动要求重生已合格资产。

### 2.1 Eleven：不能继续只写v3、Music v1或笼统品牌名

[研究] 迁移先核 §9 的 REST／WebSocket 路线，不只替换旧请求的 model_id；公开偏好／延迟测试不是游戏实测。音乐优先保存 composition plan 与参考，局部 inpainting 后仍验区间外波形和听感。分离得到的 stem 不是原生独立录制分轨：即使返回分轨 ZIP，也须验串音、残响尾音与相位，不能据轨数保证任意状态组合干净。

### 2.2 SFX实际接口与宣传有边界差异

[研究] §9 对照接口与能力页的时长／格式差异；按真实请求与返回文件接入，不把 loop 选项推成所有编码格式采样无缝。

推荐单独生成“开门”“金属撞击”“脚步单击”等短事件，再由引擎决定顺序；整段复合音会把交互时间锁死。可程序补：去静音、短淡入淡出、有限 EQ/增益、裁切、轻度 pitch/volume 变体与去重复随机选择。不能补：脚步材质错误、音色里混入背景音乐、应为一次撞击却有两次主瞬态。[研究]

### 2.3 Suno v6：近期成曲对照，但不默认游戏循环主线

[研究] 型号、计划、下载与生成额度见 §9。固定风格资产不默认选探索性 wild，成曲长度不证明循环或多状态同主题一致。[WP1 已核的平台 Remix 限制](2026-10-14-game-wp1-licensing.md#音频具体产品下载与生成时间决定授权)仍适用；“Remix & Edit”菜单不证明每项编辑都属于合同定义的 Remix，须按实际功能与输入权利核定。

### 2.4 本地音乐：ACE 1.5不再只有旧turbo

固定[README SHA ca1e85fe9430179831e6bc6be790c332190a3866](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/README.md)中，turbo 及 XL-turbo 为 8 步，有 repaint/cover，但 extract/lego/complete 只在 base 分支列支持。不能给 turbo 写“全功能多轨生成”。[一手]

[研究] XL 的硬件、许可及统计口径见 §9；作者数据合规声明不是独立审计或侵权保险。

采用：已有机器预算时比较旧 turbo 与 XL；只有其降低本项目淘汰率或修改回归成本才替换。撤回：显存/时延不合、固定主题重现差、需要 turbo 没有的分轨任务。没有已核的同一游戏新旧版盲听/成本对照，不能称 XL 已证明性价比最高。[研究]

### 2.5 Stable Audio 3：补上本地SFX，但必须补WP1

[研究] 旧标题保留引用；[WP1 现行音频准入索引](2026-10-14-game-wp1-licensing.md#wp6追加现行音频型号与声音连续性)已包含 Small-SFX，不再是待补项。§9 统一保存型号、硬件与双许可入口；这里保留选用边界：先过注册／收入／T5Gemma 条件，才比较它与现成 SFX／jsfxr，不用下载镜像绕过许可。[提示指南](https://stability.ai/guides/stable-audio-3-prompt-guide)定位主要器乐，不代替 TTS 或演唱首选；inpainting／continuation 不免除第二次修改验收。[一手／研究]

### 2.6 本地配音的精确能力与新模型观察

固定[Qwen3-TTS README 022e286b98fbec7e1e916cb940cdf532cd9f488e](https://github.com/QwenLM/Qwen3-TTS/blob/022e286b98fbec7e1e916cb940cdf532cd9f488e/README.md)：1.7B CustomVoice 有 9 预设音色、10 语言和指令控制；0.6B CustomVoice 没有同等 instruction-control 标记；Base 用于短音频克隆，VoiceDesign 按描述设计声音。不要为了“本地省钱”静默换 0.6B，却保留 1.7B 情绪控制承诺。[一手]

9 月[StepAudio 3 Gen 项目](https://stepaudiollm.github.io/step-audio-3-gen/)与[技术报告](https://arxiv.org/abs/2609.12945)展示语音、环境、SFX、音乐合成场景；本轮未核到对应可商用下载权重/明确服务合同，不把它当作免费本地 Qwen 替代。完整场景声音并不天然适合可交互事件拆分。继续观察明确交付和许可，不用论文样例替代生产能力。[一手/研究]

### 2.7 P9接入选择：效果烘入与固定视频

[研究] 需定位或跨场景复用的台词先保干声母版，固定广播才比较效果烘入；补句不合、重复混响或方向弱化则退回引擎效果。固定视频的同步配乐不替交互事件库：剪辑改动后重验时序，需要人工拆声才成立就退回许可事件资源。精确字段、默认型号、下载合同冲突与未知组合价统一见[§9 接入补核](#接入补核干声与固定视频2026-10-20)。

## 三、第二次修改：本轮有代码/接口证据，没有假装已实测

### 3.1 jsfxr：参数化可局部修改，但“存参数=位级复现”是错的

[固定 sfxr.js b7b6aa27d62f8f356db267276bf54b451555c49d](https://github.com/chr15m/jsfxr/blob/b7b6aa27d62f8f356db267276bf54b451555c49d/sfxr.js)的 `Params.prototype.mutate`随机改多项参数；`getRawBuffer`生成噪声时调用 Math.random；包络 attack/sustain/decay 以参数平方映射样本长度。[一手：源码阅读]

因此第二次要求“保持识别感，仅尾音缩短”时，直接改 decay 而非点 mutate 或重抽预设；缩放参数不等于同比缩放毫秒。冻结既有 WAV 及参数，噪声分支若要求位级复现还需受控 PRNG 和同版本渲染路径。无测试前不承诺修改前缀样本完全不变。[研究]

**生产链补核（2026-10-17 UTC+8）：离线固定产物能保留修改依据，仍有返工。** Rainboids 的[作者复盘](https://afeique.itch.io/rainboids/devlog/1514371/sound-effect-shenanigans)与固定提交记录了运行时随机声改离线 WAV、撤掉故障音效、短暂接入 Kenney 再重建参数化声库的过程。[`43d8be7`](https://github.com/afeique/rainboids/commit/43d8be7796376577ccbe760dcb634b238634da2a)恢复生成器并补全 `new Params()` 默认值；此前静音是项目传入不完整参数的集成错误，不能归咎为 jsfxr 普遍不可用。[`86a7111`](https://github.com/afeique/rainboids/commit/86a71110e07fcacaeeeb943269f0982cdaabbcf0)继续把敌人死亡声从短促近似命中改为多层设计，保留上一版 `enemyDestroy*.wav.bak` 与新 WAV。淘汰与产物路径可核，频谱比例和听感改善仍是作者报告，本仓未重测。[一手／研究]

**“每局不同”再改带来新成本。** [`644c467`](https://github.com/afeique/rainboids/commit/644c467cd70803c521a9976f3da92c9691d945a8)改为默认八变体、每局选定后复用；提交自报声库从73增至515个 WAV、约1.5增至21.7MB，不是本仓测量。[固定生成器](https://github.com/afeique/rainboids/blob/644c467cd70803c521a9976f3da92c9691d945a8/tools/scripts/generate-sfx.js)给参数扰动设种子，却仍直接调用 jsfxr 渲染，兼容用 canonical 还会单独重渲染；不能照抄其注释，把参数确定性当作全部 WAV 位级确定性。[一手：源码阅读／研究]

**缩短启动等待不能靠漏掉首次反馈。** [`a0799da`](https://github.com/afeique/rainboids/commit/a0799daae38f63e413c3a24bcf6953870637b6b2)改为预载关键音的当局版本，其余首用加载；源码在缓存未命中时只发加载请求并跳过本次播放。[`358fa24`](https://github.com/afeique/rainboids/commit/358fa248ece957535ef27e9e2c74c4edae81125f)随后把节流时间记账移到实际启动播放之后，修掉未播放也占窗口的问题，但没有补播首次漏声。此链确认既有选择：有限变体离线交付，先预算规模并保证必要声音首用就绪；它不证明固定数量、加载策略或听感已适合其他游戏。[一手：固定补丁／研究]

**只借机制，不复制该项目作商用模板。** [固定 NOTICE](https://github.com/afeique/rainboids/blob/5046fa6b675f196b1d3fb245eb19321872462220/NOTICE)将源码列为 PolyForm Noncommercial、原创音乐列为 CC BY-NC，SFX 仅说明项目原创，未明确授予通用商用复用权。作者没有公开同题生成模型对照、全部淘汰样本或主动工时；Kenney 被替换也不足以判定现成库质量较差。保持“合格许可资源／参数化优先、生成补缺”的排序；本轮只读公开文本与补丁，未下载音频、试听、运行工具或模型。[一手／研究]

### 3.2 音乐：改一段与拥有可任意重配的stem是两件事

固定[ACE REST API](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/docs/en/API.md)有 repainting_start/end、chunk_mask_mode=explicit，并返回 seed、DiT/LM、元数据。它证明可编码的局部修改入口，不证明区间外波形位级不变或前后和声相容。[一手/研究]

第二次要求“探索音乐不换主题，进入战斗时更密；从 16 小节改为 8 小节”时：
1. 优先在同一组已对齐 stem 上开关/混合打击乐层；无可靠 stem 时用已验收低/高强度片段加转场，不强行分离
2. 修改长度采用乐句边界裁切或局部 repaint，保留原文件作为回退
3. 校验采样数、拍号、BPM、调性、过渡点、循环尾音；这些字段只是约束目标，生成文本标 120BPM 不能替代测量
4. 重播探索→战斗→菜单→恢复并快速反复切换，检查重复触发、旧音乐未停、重叠峰值、节拍相位与包体

这是一项后续验收设计，未运行；真正证据目前只支持“能局部指定修改”，不支持“零手工听感修复已成功”。[研究]

### 3.3 配音：内容改10%，不能默认全角色重生

台词键保持稳定，保存文本 hash、角色 voice_id、模型 ID、语言、上下文、发音表、生成参数及最终音频 hash。修改粒度见 §3.4，旧音频保留；ASR 回读可查漏字/错字，不能判定讽刺、恐惧、角色关系和情感弧线是否到位。[研究]

更重要的新反证是[Voice Library 官方说明](https://elevenlabs.io/docs/eleven-creative/voices/voice-library)：无 notice period 音色可立即下架；有 notice 最长两年；某些音色 live moderation 还引入额外延迟。**已导出音频可以继续使用**和**未来补一句还能调用同音色**不是一个承诺。角色选音应优先明确通知期和连续性安排；下架风险不可由缓存解决全部未来 DLC。进一步核 [Voice Library Addendum §8](https://elevenlabs.io/vla)，平台仍保留随时移除音色、可不通知的权利。通知期针对声音所有者停止分享，不是平台持续供应 SLA；产品页“用过即可保存通知期”与附加条款“撤下前加入账户”的措辞也不完全一致，长期角色应保存账户资格和实际通知期证据，必要时取得书面连续性约定。[一手／研究]

### 3.4 改一句的最小单位不一定是一句

核实：2026-10-14 UTC。改变 §3.3 的默认修改粒度：台词 ID 是引用单位，未必是能够独立重生的表演单位。独立喊话优先单句替换；连续对话先验改句与邻句，失败才扩大到最短完整表演段。固定时窗的过场／动作还要另验时长，不能用音色一致代替时序一致。[研究]

**商业接口：有上下文入口，不是永久补录句柄。** [Text to Dialogue REST `POST /v1/text-to-dialogue`](https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert)列前／后各最多三个 request ID，字段明确非所有模型支持；前／后文本各限 100 字符；`enable_logging=false` 的零保留会禁用含 stitching 的历史功能，seed 仅尽力确定性。这里确认端点契约，不把字段存在推成 v4 Turbo WebSocket 或全部型号已验证支持。[一手]

[Request Stitching 指南](https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/request-stitching)另要求旧请求处理完成、ID 不超过两小时，并排除 v3；其 v4 示例仍调用 `text_to_speech.convert`，与既有型号表的 v4 Text to Dialogue 路线存在口径差异。**两小时是该 TTS 指南的限制，不是本轮已核的 Dialogue 保存期限。** 不能据此承诺把今日 ID 留到下月补一句；执行前应确认所用 endpoint／model 的支持及有效期，未明确前按不可长期复用预算。保存 ID、生成时间和邻句音频有利追踪，不延长服务端期限。[一手／研究]

**两个独立开源实现给出不同的能力边界：**

- [Qwen 固定包装器 `022e286`](https://github.com/QwenLM/Qwen3-TTS/blob/022e286b98fbec7e1e916cb940cdf532cd9f488e/qwen_tts/inference/qwen3_tts_model.py#L732-L839)的 `generate_custom_voice` 由文本、speaker、语言、instruct 和采样参数生成 codec tokens，再解码为新波形；该调用没有原 WAV／编辑区间的专用输入。`max_new_tokens` 是生成上限，不是“完整读完且准确落在指定秒数”的契约。本地可保留版本并反复生成，但不能把同 speaker 或情绪指令当作局部修补、精确时长或邻句韵律保持保证。此判断仅限所读 CustomVoice 包装器，不否认另写编辑管线的可能。[一手／研究]
- [F5-TTS `speech_edit.py` 固定 `2f86664`](https://github.com/SWivid/F5-TTS/blob/2f866649b779881af8bd644e76b9a6d95053da29/src/f5_tts/infer/speech_edit.py#L124-L236)确有区间与 `fix_duration`：先转换原音为 mel，按帧插入替换长度，最后对整个结果走 vocoder 并保存 WAV。它不是将原 PCM 未改区间直接拼回，因此“mask 外 mel 保留”也不足以证明未改 WAV 样本相同；时长以 mel 帧取整，句子自然度仍未知。同 SHA [README 许可](https://github.com/SWivid/F5-TTS/blob/2f866649b779881af8bd644e76b9a6d95053da29/README.md#license)区分代码 MIT 与预训练模型 CC-BY-NC，故这里只作编辑机制反证，⛔不作为本项目商业默认，也不拿代码许可覆盖权重。[一手／研究]

**实际改变的选择：** 允许时序伸缩的对白，优先让镜头／字幕跟随已验收音频；动作窗口不能改时，先缩写台词或改变演出，再评估能满足窗口的生成／程序变速，不能默认加速即合格。一次替换要记录真实音频长度以及字幕、口型、后续事件偏移；即使最终按 ID 拆文件，连续表演仍连听验收。ASR 可筛文字错误、样本数可筛越界，但不能判定情绪弧线或变速后的自然度。若最短表演段反复失败，收窄配音／演出而非扩大整角色重抽。[研究]

本轮仅下载约 56KB 的三份公开源码／README 静态核查，未执行上游代码、试听或下载权重；上述商业文档只读，无请求生成。尚不能证明哪种路线的实际重生工时更低，也不因此提高音频页成熟度。[研究]

[研究] §3.4 本轮检查：完整离线 14 阶段（非空无 skip）及 `git diff --check` 通过；仅文档／配置与既有夹具，不证明生成音频、时长适配或连续表演质量。

### 3.5 机器改速：改触发间隔，还是改声音本身

核实：2026-10-16 UTC。只读作者记录、固定发布配置与问题回执；未试听或运行游戏／引擎。[研究]

**许可先过门。** [Factorio EULA](https://factorio.com/terms-of-service)保留代码、音频等资产权利，商业使用须获明确许可；mod 条款不等于可移入另一商业游戏。[官方数据仓说明](https://github.com/wube/factorio-data)允许讨论时直链实体定义，但不是开放许可资产库。本节仅提炼机制、链接证据，不复制配置或分发音频；读者实现需用自己的合法资源。[一手／研究]

**需求、开发方案、发布内容分开核。** [FFF-396](https://factorio.com/blog/post/fff-396)（2024-02-02）说明机器速度会因模块、低电力等改变，单循环整体慢放效果不佳，改用动画帧触发短音；同文车辆从单条变速声改为怠速／行驶层混合，仍保留有限的速度驱动变调。这是开发期作者报告，不是独立听验。[一手] 后续官方 **2.0.36** tag 对应 `19f246f128ab10ad40eae33d373bc5573a0ca538`，[foundry 定义 L1164–1188](https://github.com/wube/factorio-data/blob/19f246f128ab10ad40eae33d373bc5573a0ca538/space-age/prototypes/entity/entities.lua#L1164-L1188)确有主声音及十二项按帧关联的 accent，部分含变体；这证明该发布配置采用了分解方案，不证明每个样本的制作方式或目标设备听感。[一手／研究]

**改变的选择。** 已有合格离散短音、需要保持撞击音色而改变周期时，先改触发间隔及与动作阶段的对应，再考虑重生成整段；持续声单独维持。连续发动机可先比较兼容的怠速／运行层混合。[研究] **不推广成“禁用变调”**：上述车辆方案本身仍用变调表达速度；固定低速且单循环已合格，或音高变化就是所需反馈时，保留简单方案。没有合格可分离短音时，不假设脚本能从复合录音无损拆出各层，应换许可资源、补缺或收窄表现。也不把 foundry 的十二项当推荐层数。[一手／研究]

**发布后的反例：重绑界面不该重演世界事件。** [2.0.21 原报告](https://forums.factorio.com/122518)（2024-11-22）给出已完成制造后停机的两台 foundry、特定配方组合与切换 GUI 的复现步骤，错误播放制造音。开发者于 2025-02-20 表示将修复于 2.0.36；[2.0.36 发布帖](https://forums.factorio.com/127145)（2025-02-26）列入 sound accents 切换机器 GUI 时误播的修复。[一手] 原报告者未在该串回复复测；未公开阅读引擎修补代码，不能推断内部根因或声称所有预览边界已解决。[研究] 据此，二改验收除慢速／高速和停止恢复，还应覆盖配方切换、对象或预览重绑；明确模拟事件与界面显示的触发归属，防止打开面板补播旧撞击。这是待实测的验收条件，不要求照搬 Factorio 实现。[研究]

**生产成本仍未知。** 作者及发布配置证明了音频设计与程序调度共同参与，未公开这组短音的原始来源、逐件人工剪辑／修音工作量、淘汰样本、重生次数、主动工时或费用。本轮没有现成包、程序合成和神经生成的同题生产对照；不能认定单程序员零手修，更不能由层数或文件数推出成本下降。不改变“先用合格许可资源，生成补缺”的排序。与本文音乐段同属 Factorio，不能算另一独立作者的交叉验证。[研究]

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

[研究] 费率与计量口径统一见[§9](#九动态事实表2026-10-14-补核)。以下按该次挂牌量作预算，不保证最小计费、进位或套餐账单，也不代表实际可用率。

以上商业生产须满足付费方案与对应声音/音乐条款；免费试听额度不是免费商用许可。例：最终 1 万字符配音、每句平均 3 次候选，v4 挂牌变量费约$2.40、Turbo 约$1.20；最终 20 分钟音乐、生成量 3 倍，按$0.15 为$9。这不是整个制作报价：另有套餐门槛、分轨/编辑、废弃、下载配额、试听工时、税和后续修改。SFX 若最小计费未确认，不用“1 秒仅$0.002”作购买承诺。[研究：算术预算]

免费本地的总成本包括硬件/内存、依赖维护、生成时长、挑选和返工；已拥有合适设备且需要大量反复离线修改，ACE/Qwen 才更有优势。少量 UI 音先选 jsfxr／CC0 成套资源；§3.1 的生产链说明变体扩张仍增加交付与加载维护，不据此宣称实测更便宜。[研究]

## 七、授权总表的增量依据

[研究] 本节仍是 WP1 的许可回链入口。具体型号／包、代码／权重／输出、注册与收入条件统一见[§9 动态事实表及 Stable 入口说明](#九动态事实表2026-10-14-补核)；WP1 保留准入索引，不再另维护一张同型号表。基础许可通过后，仍须逐资产走以下五层检查。

**声音权利必须独立核查**：基础模型/服务商用许可；剧本及音乐输入权利；本人声音/表演者/数字复制品授权（媒体、语言、角色、商业范围、补录期限、运行时生成边界）；具体音色平台条件；输出是否具有可执行版权/是否涉及第三方。合同写输出归用户是合同双方之间的配置，不保证司法管辖区承认纯 AI 音频版权，也不保证独占、无近似或可注册 Content ID。WP1 已有商用门槛不能简写成“付费即拥有所有声音”。[研究]

## 八、撤回条件与下一步证据

- 同一模型/音色升级后，新旧台词无法拼接：保留旧版已生成资产，比较整角色迁移代价，不强制换新
- 两轮局部 repaint 仍破坏未改段落或循环：撤回现成可循环资产/状态简化，不无限全曲重抽
- 素材通过自动响度/首尾检测但事件辨识、情绪或多状态试听失败：拒收，不把通过脚本写成音频质量通过
- 许可/正式下载消失：停止新增生产；历史合法资产权利依生成时合同判断，不直接宣布全部撤回
- 本地模型需超出已授权安装/权重/实测范围：本轮到证据建议为止；后续小实验须先确认

建议 BACKLOG 只保留有判别力的一项：在同一微型游戏音频需求上，比“Kenney+jsfxr”“Eleven 离线”“ACE/Qwen 本地”第二次修改的可用率、费用和主动工时；先做 10 个 SFX、2 组音乐状态、1 角色 20 句台词，改一次材质/节拍/台词。没有批准前不执行。这里的规模是后续实验建议，不是本轮完成的数据。[研究]

## 验证记录

[研究] 历史初稿：完整离线 14 阶段（非空无 skip）与两文档 UTF-8／LF／空白检查通过；该轮未执行 Git，补丁级检查由集成端处理。没有试听、生成、导入、购买或真人声音上传；仓库检查不证音频质量。

整合交付：完整离线 14 阶段、受影响页 74 处标题引用和 `git diff --check` 通过；内部独立复核后补固定 SHA 及 v4/ Turbo 接入区别。未试听或运行模型/引擎，hosted CI 按精确发布提交另核。

## 九、动态事实表（2026-10-14 补核）

[研究：范围] 本表覆盖本页与音频正文的动态选型事实，区分既有重读、继承限定补核和仍未闭合；表后接入补核另标 2026-10-20，旧标题保留锚点。核实日期是读取日期，不是网页永久快照；复核列均取“实际采用前”与 2026-11-14 中较早者。价格只记公开显示，未登录账户、结账或验证区域 SKU。版权安全、可执行版权、独占性、全依赖清权均不因本表存在而宣告通过。

| 事实／精确范围 | 官方来源与本次状态 | 核实日期 | 下次复核 | 对采用的影响 |
|---|---|---|---|---|
| Eleven `eleven_v4`／`eleven_v4_turbo`，90+ 语言；v4 用 Text to Dialogue API，v4 Turbo 用 Text to Dialogue WebSocket；Flash v2.5 替代旧 Turbo v2/v2.5，不是 v4 Turbo | [模型表](https://elevenlabs.io/docs/overview/models)、[9 月 28 日发布，10 月 12 日更新](https://elevenlabs.io/blog/eleven-v4)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 公告列音频标签、IPA、说话人保持、多说话人上下文及拼接改进；保存型号与接口，厂商延迟／偏好测试非游戏实测 |
| v4 US$0.08／千字符，Turbo／Flash US$0.04；音乐 US$0.15／分钟，SFX US$0.12／分钟 | [API 价页](https://elevenlabs.io/pricing/api)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 未含税；不沿用 10-12 已过的 v4 发布折扣。FAQ 按 generation，能力页仍写 40 credits/秒；API 美元与 Creative credits 分账，最低计费／进位另核 |
| 非 Beta TTS／SFX：免费非商业，付费有条件；一般帮助保留付费期生成内容商用权 | [non-EEA 条款 §1(c)、§4](https://elevenlabs.io/terms-of-use)、[发布帮助](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 地区合同与具体入口状态另核；v4 发布不豁免 Beta 规则；不套到 Music 特别条款 |
| SFX v2：接口 0.5–30 秒、loop 默认 false、prompt_influence 默认 0.3；能力页 0.1–30 秒，MP3 全效果／48kHz WAV 非循环效果 | [接口](https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert)、[能力页](https://elevenlabs.io/docs/overview/capabilities/sound-effects)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 按接口接入，实际格式／采样接缝仍需验收 |
| `music_v2_5`：composition plans、参考与 inpainting；3 秒至 5 分钟；参考约 30 秒作风格引导，不保证跨风格改编 | [Music 能力页](https://elevenlabs.io/docs/overview/capabilities/music)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 支持局部修改入口，不证明听感或区间外波形不变 |
| Music 分轨：`two_stems_v1`／`six_stems_v1`，返回 ZIP，可能高延迟 | [分轨接口](https://elevenlabs.io/docs/api-reference/music/separate-stems)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 分离轨不是原生独立轨，保留串音反证 |
| Eleven Music 游戏范围、主体／收入、下载格式、升级／存量条件 | [Music Terms](https://elevenlabs.io/music-terms)；仅继承 [WP1 当日限定补核](2026-10-14-game-wp1-licensing.md#2026-10-14-补核游戏音乐与meshy输出权利)，本轮不重复审定 [研究] | 2026-10-14（继承） | 采用前或 2026-11-14 | 仅适用 Music；具体主体、账户和合同例外仍需确认 |
| Suno v6／v6-wild／v6-mini 均最长 8 分钟；前两者 Pro/Premier、mini 全计划；Extend/Cover/Replace Section、Custom Models 围绕 v6 | [v6 官方帮助](https://help.suno.com/en/articles/13924801)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 成曲能力不等于循环／主题层一致 |
| Suno 年付折合 Pro US$8／月、Premier US$24／月；2500／10000 credits 与 20／60 下载每月分开 | [公开价格](https://suno.com/pricing)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 税在结账计算；不是可随时退的同价月付或账户余额，生成额度不等于下载额度 |
| Suno 官方 Download、平台 Remix、免费旧歌追溯边界 | [Terms](https://suno.com/terms)、[追溯帮助](https://help.suno.com/en/articles/2425729)；仅继承上述 WP1 限定补核，不重复核心结论 [研究] | 2026-10-14（继承） | 采用前或 2026-11-14 | 实际编辑功能是否属于合同定义／另行方案，仍须逐资产核查 |
| Voice Library 所有者撤下：无通知期可即时失去调用；最长通知期 2 年 | [产品文档](https://elevenlabs.io/docs/eleven-creative/voices/voice-library)、[附加条款 §4、§8](https://elevenlabs.io/vla)，本次交叉重读 [一手] | 2026-10-14 | 选音／补录前或 2026-11-14 | **新增反证：平台可随时移除、可不通知；通知期不是 SLA**。旧导出使用与未来补录分开 |
| ACE-Step 1.5 官方 turbo 包 MIT；turbo 不含 base 的 extract／lego／complete | [官方包卡](https://huggingface.co/ACE-Step/Ace-Step1.5)，本次重读；固定代码许可沿用 §2.4 [一手／研究] | 2026-10-14 | 采用前或 2026-11-14 | 不外推第三方微调／输入音乐权利；训练合规只是作者声明 |
| ACE `acestep-v15-xl-turbo` 卡 MIT 并明确商用输出，4B DiT、8 步；≥12 GB 需 offload＋INT8，≥20 GB 无需 offload，≥24 GB 完整 XL＋4B LM | [XL 卡](https://huggingface.co/ACE-Step/acestep-v15-xl-turbo)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 不复用旧低显存预算；卡权重约 18.8GB 与 README decoder 约 9GB 口径不同，不推整管线下载／内存 |
| Stable Audio 3 Small-SFX／Small-Music 120 秒、Medium 380 秒；Large API／企业 | [官方发布](https://stability.ai/news-updates/meet-stable-audio-3-the-model-family-built-for-artistic-experimentation-with-open-weight-models)、[官方仓库](https://github.com/Stability-AI/stable-audio-3)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | Medium 需 GPU；支持 inpainting／continuation；CPU／速度仅作者声明，非游戏帧预算 |
| Small-SFX：代码 MIT，权重 Community，T5Gemma 另许；商业注册及关联方收入条件 | [代码 MIT](https://github.com/Stability-AI/stable-audio-3/blob/77e0398c26f7d22d801ec1bb036307e8b231f741/LICENSE)、[模型卡](https://huggingface.co/stabilityai/stable-audio-3-small-sfx)、[许可入口](https://stability.ai/license)、[Community](https://stability.ai/community-license-agreement)、[Gemma](https://ai.google.dev/gemma/terms)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 商业注册；本人／关联方任何来源年收入 >US$1M 须另许；双入口见表后。英语／T5Gemma；AudioSparx、Freesound 多许可训练声明非审计；卡 0.6B 与仓库 433M 不混口径 |
| Qwen3-TTS-12Hz-1.7B-CustomVoice＋Tokenizer-12Hz 均 Apache-2.0；9 音色、10 语言，0.6B 不继承全部控制 | [CustomVoice](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice)、[Tokenizer](https://huggingface.co/Qwen/Qwen3-TTS-Tokenizer-12Hz)，本次重读；固定代码沿用 §2.6 [一手／研究] | 2026-10-14 | 采用前或 2026-11-14 | 指定组合可评估；不授真人声音、剧本或其他 checkpoint 权利 |
| Kenney Interface Sounds 100 件／Music Jingles 85 件，指定包 CC0 | [Interface](https://kenney.nl/assets/interface-sounds)、[Jingles](https://kenney.nl/assets/music-jingles)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 保存实际包内许可，不外推站外转载 |
| jsfxr Unlicense；Free 可导出 WAV、Free／Pro 均可商用 | [仓库许可](https://github.com/chr15m/jsfxr/blob/master/UNLICENSE)、[官方对照](https://sfxr.me/)，本次重读 [一手] | 2026-10-14 | 采用前或 2026-11-14 | 保留固定源码的随机噪声／参数非线性反证，不承诺位级复现 |
| StepAudio 3 Gen 仍仅列观察 | [项目页](https://stepaudiollm.github.io/step-audio-3-gen/)，本次可读，但未取得对应商用权重／服务合同 [一手／研究] | 2026-10-14（未闭合） | 采用前或 2026-11-14 | 不作为 Qwen 免费商业替代，不把论文样例等同生产授权 |
| Unity Assistant 2.20.0-pre.2 Text to Sound：少量 SFX 原型；Loop 仅重复播放 | [声音生成](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/Sound/sound-generate-prompt.html)、[编辑](https://docs.unity3d.com/Packages/com.unity.ai.assistant@2.20/manual/Sound/sound-edit.html)；继承 [WP9 §8 的 2.20 文档补核](2026-10-14-game-wp9-engine-handoff.md#8-unity-原生生成器补核原型集成不等于发行管线)，本轮未重做原生核查 [研究] | 2026-10-14 UTC（继承） | 采用前或 2026-11-14 | 版本前提与生产授权沿 WP9；维持现成／jsfxr 优先，不把计费品类推成该包已具备音乐／TTS，也不证明无缝循环 |

Stable 补充依据：[2024-07-05 Community 正文](https://stability.ai/community-license-agreement)明确注册、>$1M 时终止原许可、输出在法律允许范围归用户且非模型衍生物、AUP 和禁用输出改进其他基础生成模型；不是自动获得企业授权，也不是超门槛可继续用旧免费推理。2026-10-14 UTC 再核 Small-SFX 卡：正文的商业说明入口指向 [Stability 许可页](https://stability.ai/license)，后者明确列 Stable Audio 3.0，并链接 Community 正文；但访问门槛的 License Agreement 仍链接 [Stable Audio Open 1.0 的 LICENSE.md](https://huggingface.co/stabilityai/stable-audio-open-1.0/blob/main/LICENSE.md)，不能写成旧链接已完全消失。卡另明示 T5Gemma。两个入口的区别不改变注册、收入和 T5Gemma 三重条件；采用时核对并保存实际包许可证。[一手/研究]

[T5Gemma 所适用 Gemma 条款](https://ai.google.dev/gemma/terms)（2026-04-01）附录含 T5Gemma，允许按条款使用/分发，含用途限制、分发通知；Google 不主张输出权利，输出不是 Model Derivatives。仅生成 WAV 与向玩家分发/托管模型义务不同。未见一般营收或地区名单额外门槛，不等于免除贸易管制和 AUP。此轮没提交注册/同意门槛，没下载模型。[一手/研究]

### 接入补核：干声与固定视频（2026-10-20）

[一手／研究，2026-10-20 UTC+8] 扫描 8 月 20 日至 10 月 20 日，既有 v4／Music v2.5／Suno v6 不重复列新；以下改变接入而非质量排名，采用前复核。

- **干声优先。** [10 月 12 日更新](https://elevenlabs.io/docs/changelog/2026/10/12)给 TTS／Dialogue 增加 `audio_effects`（滤镜、距离、混响、循环底噪、pan），不加请求费。混响／非零 pan 产生立体声，对 `pcm_*`／`ulaw_*`／`alaw_*` 返回错误。需定位或跨场景台词保留干声，固定广播才比较烘入；补句不合、重复混响或方向弱化则撤回烘入、改用引擎效果，不把效果入口当长期补录保证。
- **固定视频候选，不替交互事件库。** [10 月 15 日 Instant Soundtracks](https://elevenlabs.io/blog/introducing-instant-soundtracks)按视频生成音乐与同步 SFX；[API](https://elevenlabs.io/docs/api-reference/music/video-to-music)有 `add_sfx`、`separate_tracks`、`use_audio_as_reference`，ZIP 只承诺音乐／SFX 分文件，不保证逐事件干声、循环或状态层。默认仍 `music_v1`，选 v2.5 须显式指定；剪辑改动后重验时序，需人工拆声才成立就退回许可事件资源。
- **下载与费用另过门。** 该 API 写 192kbps MP3 需 Creator，但 [Music Terms 附表](https://elevenlabs.io/music-terms)高质量下载需 Pro 起；按合同及主体资格核，不以接口覆盖许可。普通 Music 单价不能推出视频分析＋SFX 整包价，本轮组合计费未知；不推算节省工时或可用率。

[一手／研究：全文采用复核，2026-10-14 UTC] 本次重读 [Music Terms](https://elevenlabs.io/music-terms) §4.7–4.8 与附表，确认 Indie 收入、主体资格及高质量下载门槛，正文补直接选择提示；升级／存量的复杂情形仍沿 WP1 的限定范围。交叉重读 API 价页、SFX 接口／能力页、Suno 条款／价格、ACE 官方 turbo／XL 卡、Qwen 指定模型／Tokenizer 卡、Stable 商业入口与访问许可链接、Kenney／jsfxr 官方页，未发现须反转现成／参数化优先的证据。原生与配音二改沿既有范围，未试听、登录账户、接受协议或运行模型／引擎；资料就绪不等于效果实证。

[研究：覆盖边界] 固定 SHA 的 jsfxr／ACE 源码反证、Unity 6 固定版本机制及 Fortnite 历史案例保留原核实范围，未在本次重跑或转换成“当前部署仍在线”声明。Meshy 不属于本表；WP1 的三项核心结论只继承其中音频相关范围。本轮没有试听、模型／引擎运行或新增商业清权结论。

[研究] 历史阶段 F 局部检查：`check_repo.py` 177 文件、四文件 `git diff --check` 与本地锚点通过；已有 pandoc 的 GFM 渲染核两张决策表、20 条音频／22 条动画动态事实及五列结构，未重跑完整离线入口。

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

[AudioMixer Inspector](https://docs.unity3d.com/6000.3/Documentation/Manual/AudioMixerInspectors.html)说明脚本设置 exposed 参数后，该参数不再随 snapshot 改变。[一手] 因此玩家偏好音量与情境衰减应有独立控制层；这是为了让玩家设置和情绪混音共存，不要求建立复杂总线树。[研究]

[AudioSource.priority](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-priority.html)用于超过 real voices 上限后的虚拟化，同优先级再比较音量；WebGL 不受该设置控制。[一手] 这与“已播放的声音互相掩蔽”不同：优先级不能代替清晰混音，项目还需针对高频事件限制重触发／叠加。关键警告、对话、环境谁让位由玩法决定，不能仅按距离或统一优先级数字推断。[研究]

音乐转场的升级目标应具体到编辑任务。[FMOD 2.03 事件制作说明](https://www.fmod.com/docs/2.03/studio/authoring-events.html)已有按拍／小节量化的 transition region 和独立 transition timeline，可编排桥段与交叉淡化；原生 DSP 调度也能实现已设计的简单切换，区别在反复修改时谁更省制作工作，而不是前者才会准时播放。状态频繁来回时先平滑进入／退出条件；节拍等待期间仍保留即时玩法提示。[一手／研究]

#### 混音焦点补研：已播放却难辨时让谁退后

核实：2026-10-16 UTC+8。补充两组独立作者、不同玩法的一手制作经验，改变音频正文“必要时短暂让位”为按当前判断任务选择混音；不重写 [WP10 的并发入口与持续声政策](2026-10-14-game-wp10-client-modules.md#音频并发补研保住起音不等于保住每次提示)。以下没有本仓听验或玩家对照实验。[研究]

- **快速战斗兼顾叙事，自动排序不包办焦点。** [王健安的 HARDCORE MECHA 复盘](https://www.audiokinetic.com/zh/blog/sound-design-of-hardcore-mecha/)（2019-11-04；Unity 2017.4.27／Wwise 2017.2.9）区分单人叙事与多人角色／技能信息；自动侧链和 HDR 之外，首次出现的普通敌人另用 state 强调，密集 STG 段落另减部分样本音量并限发声数。制作人不接受机械降音量的效果，作者改用信号驱动补正，对白出现时按主要角色的语音频段压低 SFX。[一手] 这是具体配置和创作取舍，不是 HDR／ducking 普遍失效；英文版与中文原文同源，不计独立案例。[研究]
- **攀爬重在持续状态，最响的环境未必最重要。** [Cairn 音频总监 Martin Stig Andersen／首席声音设计师 Lukas Julian Lentz 访谈](https://www.asoundeffect.com/cairn-game-audio/)（2026-04-15）说明朝岩壁攀爬时降低环境、突出抓握与呼吸，环顾及抵达平地时重新开放环境。Lentz 回忆瀑布盖住这些声音时自己感到攀爬更难；这是作者观察，不是量化玩家实验。Andersen 同时指出背景过静会显露现实房间噪声，过响又影响抓握声的相对感受。[一手] 不推成瀑布全静音或所有游戏都按视野裁声；只借任务状态与环境分工，不复制其专业拟音、大量资产及多声道成本。[研究]

**✅ 最小采用。** 关键声没进入播放，先排查拒绝／抢占；已播放却被盖住，先减没有新信息的重复与装饰，声音身份本身难分则先换或简化素材。再用已有状态调整音乐／环境比例，保住同场另一关键提示，并在退出状态时恢复。只有局部频段冲突且简单让位损伤其他声音时，才🧪试局部处理；新增声线、武器或环境都增加复核成本，不默认建动态 EQ、威胁评分或全能音频管理器。[研究]

上述作者的术语不能变成“ducking 与 side-chain 二选一”：Unity 6.3 [AudioGroup Inspector](https://docs.unity3d.com/6000.3/Documentation/Manual/AudioMixerInspectors.html)明确 Duck Volume 本身即由 Send 驱动的侧链压缩。[一手] Unity／UE 沿用下节已有原生混音职责；不由案例推出任何引擎或中间件的听感排名。[研究]

**撤回与二改验收只预注册。** 增加第二种关键事件后，在装饰密集、环境最响和状态快速进出时，分别比较原混音、减层与局部让位；听辨两种提示的身份／方向／时效、恢复过程和连续疲劳。明显忽强忽弱、另一危险被压掉或轻重区别丢失，就减弱／撤回处理。保持原伤害与反应窗口，不为错开发声延迟即时警告；事件调用、voice 存活和总响度稳定均不能代替听验。[研究]

### 10.3 现成实现与专业案例的边界

- **Chop Chop：改造思路，不整包采用旧系统。** Unity 官方 [Audio system 说明](https://github.com/UnityTechnologies/open-project-1/wiki/Audio-system)展示原生 AudioSource／AudioListener、cue／配置／空间位置分离和 emitter 池；同页明确当时音乐没有 cross-fade 支持。仓库 [README](https://github.com/UnityTechnologies/open-project-1)声明 2021 年 12 月停止开发、基于 Unity 2020.3；[根许可 Apache-2.0](https://github.com/UnityTechnologies/open-project-1/blob/main/LICENSE)。它证明有公开可读实现，不证明可直接升级到 6.3，也不外推每件附属素材许可。本轮未固定源码复测，正文不推荐照搬其选择器。[一手／研究]
- **Celeste：学习作者如何组织成品，不作为素材包。** [FMOD 官方项目指南](https://www.fmod.com/docs/2.03/studio/appendix-a-celeste.html)列 Power Up Audio／Lena Raine 的完整项目和事件解释，支持对成品 Live Update；该历史项目要求 FMOD Studio 1.10.xx，不能因指南位于 2.03 就当成当前集成示例。其 EULA 限个人／教育用途，源音频不得另用于新项目；有专业音频人员的成功不能证明单人零手修能复现同样质量。[一手／研究]
- **FMOD 当前能力与维护：** 本次 [Unity Integration 2.04 指南](https://www.fmod.com/docs/2.04/unity/user-guide.html)说明 bank 加载、平台构建和升级步骤；[Studio 迁移说明](https://www.fmod.com/docs/2.04/studio/advanced-topics.html)要求关注版本兼容，迁移保存后旧版不能再打开。原生不能有效承载频繁的音乐编排修改时才评估中间件，而不是因原生没有某个专业面板就迁移。[一手／研究]

### 10.4 包容性也影响反馈质量

[XAG 103](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103)要求重要视觉／音频信息有其他感官表达；[XAG 105](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/105)建议独立音量、单声道和可暂停音频（原指南另列短于三秒事件及实时多人会话等例外）；[XAG 104](https://learn.microsoft.com/gaming/accessibility/xbox-accessibility-guidelines/104)展示声音字幕附方向提示。[一手] 采用：从同一玩法事件驱动音效与相应视觉提示，先覆盖失败会影响操作的警告；关音乐不能连带关提示，单声道不能吞掉只在一侧的事件。并非给全部环境声堆满字幕，也不是有几个选项就通过无障碍认证。[研究]

后续获准试玩时，应同时检查：新玩家能否区分结果；密集操作中是否仍听见危险；重复操作是否疲劳；音乐是否自然承接而非频繁重启；扬声器／低音量／单声道／无声能否保持关键信息。把“好听、爽快、可读”和“无 click、无缺引用”分别记录；前者必须有人在玩法中判断，自动峰值／长度检查不能替代。[研究]

**低音量下的动态范围选择（2026-10-15 UTC 补核）。** [Returnal 音频主管 Loic Couthier 访谈](https://www.asoundeffect.com/returnal-game-audio/)（2021-06-30）说明：为避免玩家误把最大动态范围当最佳音质，依据玩家填写的设备、播放音量和背景噪声推荐模式并解释原因；这主要是建议，不是自动测量／校准。其 Speaker Tuning 的 EQ 与 VO Focus 的对白让位另有职责。[一手] 因此强声够响而弱提示在低音量下丢失，可考虑较窄动态混音；同时发声互盖仍先减层／让位。动态范围指强弱差，不是总音量或资源编码压缩。[研究]

反例：[Alien: Isolation 的 Sam Cooper／Byron Bullock 访谈](https://www.thesoundarchitect.co.uk/alienisolation/)（文末日期 2014-06-27）明确有意采用高动态范围，用安静／沉默强化突然声音的紧张感，同时避免持续紧张造成疲劳。[一手] 这支持保留表现反差，不证明该游戏不能有较窄动态选项；两款专业团队作品仅支撑设计取舍，不保证单人无音频人员能自动复现。[研究]

复用原生混音即可先试，不建新菜单体系或 DSP 框架。[Unity 6.3 Audio Compressor](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioCompressor.html)当前文档明确实际为固定 ∞:1 的 limiter；[UE 5.8 Submix Effect Dynamics Processor](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/Utilities/Struct/MakeSubmixEffectDynamicsProcesso-?lang=en-US)则有 processor type、ratio 与输入／输出增益等设置。[一手] 不套统一参数，沿用既有玩家音量与情境混音分层。每增一种混音，新增敌人／武器／台词都需重核弱提示、轻重辨识、安静到战斗的反差与连续听感；出现过强压低或反差损失就撤回处理，默认已合格不必增模式。公开资料不证明听感改善，本轮未试听或运行引擎。[研究]

[研究] 历史反馈质量补研：两文件 `git diff --check`、`check_repo.py` 177 文件及 GFM 新锚点／三行表通过；未重跑完整离线入口。

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

[研究] 历史 10.5 检查（2026-10-14）：完整离线 14 阶段（非空无 skip）和 `git diff --check` 通过；仅文档／配置与既有夹具，不证音频、设备或许可清权。

## 音乐切换补研：精确播放之前先选状态与时机

主线：GC／主线三，第二次玩法修改后保持反馈连续。[研究]
改变的建议：从“定义状态、对齐节拍”深化到选择状态来源与切换政策；原生调度负责准确执行，不替代音乐决策。[研究]
新证据：FTL 作曲者访谈、Factorio 开发者设计及发布后选项／使用者回执；Unity 6.3 暂停契约重新核实。核实：2026-10-15 UTC。[一手]

**两种类型的作品，解决的是不同问题。**

- [FTL 作曲者 Ben Prunty 的 NPR 访谈](https://www.kgou.org/2013-10-06/composing-game-soundtracks-that-move-faster-than-light)（2013-10-06）解释探索／战斗版本同时推进，通过交叉淡化改变强度。[一手] 这是飞船战术 roguelike 的具体制作机制，适合借鉴“变强度而不重开主题”。另一篇[作曲者问答](https://cheerfulghost.com/jdodson/posts/1552/interview-with-ftl-composer-ben-prunty)明确其版本关系从加鼓到几乎不同的曲目都有，不能简化为每首都只增打击乐。[一手] [研究] 对齐版本需要预先制作和验收；采访不是任意 AI 生成片段都能无缝混合的证明。
- [Factorio FFF-407](https://factorio.com/blog/post/fff-407)（2024-04-19）把 variable tracks 定位为主曲之间的变奏插曲，组合受时间网格及层／段条件约束；主曲仍占主体。作者特别指出，要对战斗等更多状态作出反应，需要音乐从创作阶段为此设计。[一手] [研究] 长时经营的变化需求可以用少量受约束的内容满足，不因“系统能接事件”就扩大到全局自适应配乐。文章的演示明确为 WIP，不把其中示例参数当发行版或推荐值。

**反例：响应更及时，未必听起来更连贯。**

[一手] Factorio [已实现建议串](https://forums.factorio.com/119140)中，2024-11-01 有用户反映远程视图频繁切换使音乐不断改变；开发者 Donion 在 2024-11-20 说明为 2.0.21 添加 `ambient-music-based-on-physical-location`，当时默认 false。2024-12-01，另一使用者 exponential 报告该选项解决了自己的中断问题。[研究] 这是历史选项与自报体验，不是最初发帖者的复测，也没有总体偏好／留存数据。选择实际位置会牺牲当前观察区域的音乐反馈；远程经营本身是玩家主要活动时，保留视图依据、延后切换也可能更合适。默认值只按该历史版本陈述，不保证当前设置入口或默认不变。

**最小实现选择，不扩成新框架。** [研究]

1. 短促而重要的命中／警告，按玩法及时反馈；不能为了 BGM 完整性把必要提示也推迟到下一乐句。
2. 同主题的强度变化且有兼容层／版本，优先保持共同播放位置、改变混合；无兼容内容就保留完整片段和已设计转场。
3. 查看／区域状态短时反复变化时，先明确谁拥有选曲依据，再选择稳定期、最短保持或合法乐句边界；这些是可比较方案，不统一规定秒数。若退战后高强度音乐滞留过久，收窄保持条件，而非继续叠延时。
4. 在已有音乐状态配置记录当前与目标状态、切换边界、请求失效条件和暂停政策。等待期间目标改变时替换或取消旧意图；不把所有瞬时状态按 FIFO 补播。具体 API 能取消哪些已调度内容须按项目版本验证，不承诺已经提交到音频设备的数据可追回。

**原生契约只补会改变上述选择的部分。**

- [Unity 6.3 PlayScheduled](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource.PlayScheduled.html)以 DSP 绝对时间提前安排播放；文档说明过去时刻只能尽快开播，不能补回已过去的时间。[一手] [AudioListener.pause](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioListener-pause.html)会冻结 DSP 时钟和已排程请求，部分声音可设 `ignoreListenerPause`。[一手] [研究] 若采用这一暂停政策，就不应恢复时再把同样暂停时长加到排程上；菜单音乐继续播放与整套 DSP 时间冻结也不能混作一种语义。这里不规定所有游戏都暂停音乐。
- [UE Quartz 当前概述](https://dev.epicgames.com/documentation/unreal-engine/overview-of-quartz-in-unreal-engine)页面显示 5.8：Clock 在音频渲染线程调度，Play Quantized 提前排到音乐边界，game thread handle 为代理。[一手] [研究] 保留现有音频页“提前调度不等于游戏回调或设备输出零延迟”的边界；不能把 Unity Listener 的暂停行为套给 UE。本文没有核成 UE 游戏暂停会自动冻结所有 Clock／Audio Component，因此不写等价自动行为。

**后续只预注册，不运行。** [研究] 同一段已验收音乐对比即时切换与受约束切换；新增远程查看或短战斗后覆盖进入即退出、等待期间换到第三状态、暂停／恢复及卸载。分别记录目标状态、实际音乐状态、请求／生效时刻与是否重复起音；听验连续性及对当前处境的表达。必要提示另验及时性。若只是延迟了不匹配而没有减少打断，就撤回该延时方案。软件时刻不是声卡／耳机端到端延迟，不能由文档推断节省工时或玩家收益。

**证据与许可边界。** [研究] 本轮只读公开原文，未试听、运行游戏、安装中间件或执行引擎；FTL 与 Factorio 未读取完整音频实现，不对其内部淡化曲线、并发或内存作推断。只提炼机制及链接，不复制成品音乐、工程或源码；文章公开不授予资产商用权。引擎资料按所读页面版本说明，非真实构建验证。


## 拟声对白补研：声源与讲话节奏分别修改

核实：2026-10-16（UTC+8）。主线二／三，GA；改变音频页配音入口：文本承担语义时，比较合格短音／程序音色与完整配音，节奏二改不必自动重生整句。新证据是两位作者的路线撤回与制作过程，不是本仓试听或零手修生产验证。[研究]

- **Celeste。** 原音效作者的[制作说明](https://www.reddit.com/r/GameAudio/comments/iet3ud/comment/g2koh5y/)包含合成声线、MIDI表演、筛选take和按情绪整理普通／强调／结束音节；[取舍说明](https://www.reddit.com/r/GameAudio/comments/iet3ud/comment/g2kphm8/)指出最初随机playlist难控制收尾、强调顺序及停顿，静音烘进素材会增加停顿微调负担。[一手：作者历史说明] 这支持声源与节奏分离，不支持所有项目复制其hub，也不证明程序员调参即可获得专业表演。[研究]
- **Springbound。** [完整开发记录](https://brycetown.substack.com/p/springbound-devlog-4-making-critters-talk)先撤回逐句随机动物叫声，又因单周期丢失质感改较长循环；直接循环仍不随词间和嘴型变化，随后使用按词音高、元音和Mouth Open参数。好坏来自作者试听，不是本仓比较。[一手] 作者人工录音和选波形；[官方页](https://fernhead.itch.io/springbound)为约20分钟英文demo、声明未使用生成式AI，不能写成完整发行、多语言二改或AI零手修成功。[一手／研究]
- **现成能力的反例。** Celeste讨论后续指出关闭Cut可解决部分音节收尾问题；[FMOD 2.04文档](https://www.fmod.com/docs/2.04/studio/instrument-reference.html)已有异步声音关闭Cut后播至结束、Multi选择和可调Silence instrument。先核所用原生功能，不从旧复盘推出必须新造系统；现成控制也不保证自然表演。[一手／研究] Celeste项目的教育用途、源音频不得另用于新项目限制沿本记录§10.3，不下载或复制源音频。

**取舍。** 已有许可且风格合格的短音优先比较；程序化路线已有合格声源／配方时，改句长主要改触发节奏，但新增角色或情绪可能仍需制作声音。必须听懂内容或依赖具体台词表演时，沿既有离线配音／最短完整表演段生产。没有同题质量和总成本证据，不宣布其中一种普遍最好或最便宜。[研究]

**二改仅预注册。** 加长文本、改呈现速度和情绪，再快速跳过切换角色，核尾音、残留及新旧声源身份；文字承担信息的完整性另验。换语言仍可能改变时长、词界与停顿，两例不提供跨语言成功证据。合格声源缺失或噪声干扰阅读时退回纯文本／有限提示，不继续堆结构。当前只读公开原文、现行文档和仓内覆盖；未试听、复核游戏消费者源码、运行模型／引擎或估算实际成本。[研究]


## 声源密度二改：先改传播还是重做音频

2026-10-16（UTC+8）补核，GA。改变的选择：单件合格但密度／布局变化后混乱，先修改传播与实例增益；不同于既有“重要声音让位”，此处决定是否需要重做素材。**[研究：条件判断]**

Cogmind 作者[2020 制作复盘](https://www.gridsagegames.com/blog/2020/06/building-cogminds-ambient-soundscape/)记述从 17 个重要机器循环扩到百余机器：原线性衰减适合稀疏重要声源，扩展后移动时声音频繁进出；作者重新选择默认衰减，并把基础音量纳入游戏数据以避免重采样。这是覆盖密度二改，不是材质替换或动作变速；未核文件哈希，不称音频字节已验证不变。搜样及调整的数周是日历历时，不能换算主动工时。**[一手：作者过程自述]**

[2020 年度回顾](https://www.gridsagegames.com/blog/2020/12/year-7-cogmind/)确认 Beta 10 交付环境声景，补发布去向，不补独立听感测量。[2014 制作说明](https://www.gridsagegames.com/blog/2014/05/sound-design-cogmind/)称使用 royalty-free 样本并人工编辑，未提供逐文件授权合同；公开说明不授予游戏音频复用权。本仓仅提炼机制，不提取素材，也不把人工制作称为程序员零手修成功。**[一手：作者说明，非许可清权完成]**

采用／撤回：既有合法资产单独可用时，先在目标布局比较范围、衰减、增益；稀疏关键声源原参数仍合适就保留，不统一换曲线。单件语义仍错则换资源；新叠加关系仍掩盖必要信号时重新比较素材与混音。没有生成路线对照、完整淘汰样本、主动工时或采购金额，不改三档来源优先顺序。后续实验须另获授权；本轮只读公开文稿，未下载音频、试听或运行引擎。**[研究：范围与缺口]**


## 状态变体补研：固定含义与随机去重复分开

核实：2026-10-18（UTC+8）。GA，主线二／三。改变的是新增风格化材质／状态提示时的首试：已有合格声源可先比较固定状态变体与另取素材，不把每个状态都变成新一轮生成；这不是用变调修复需要真实材质身份的错误资源。[研究]

### 可核生产链：既有许可循环到冰面状态二改

- Pixel Wheels 固定 [`3da005c0` 的 credits](https://github.com/agateau/pixelwheels/blob/3da005c0ff1988b400ab51afc1e33d38119f8c59/doc/credits.md)列出 Tom Haigh 的轮胎打滑循环及来源。[原资产页](https://opengameart.org/content/car-tire-squeal-skid-loop)标明 CC-BY 3.0，并说明循环此前经过选段与重叠处理。这里采用的是已制作好的许可资源，不能说整个声源从未人工编辑，也不以仓库总许可覆盖上游署名／许可要求。[一手]
- [2019-06-04 固定提交](https://github.com/agateau/pixelwheels/commit/3da005c0ff1988b400ab51afc1e33d38119f8c59)新增冰面、速度与滑动角条件；AudioComponent 复用原 drifting 播放器，冰面时设 pitch 0.5，普通滑行设 1。[同版 Assets.java](https://github.com/agateau/pixelwheels/blob/3da005c0ff1988b400ab51afc1e33d38119f8c59/core/src/com/agateau/pixelwheels/Assets.java)仍加载 drifting.wav。该提交只有三个 Java 文件变化，没有音频资产变化。[一手：固定差异与源码阅读]
- [提交至 0.12.0 的比较](https://github.com/agateau/pixelwheels/compare/3da005c0ff1988b400ab51afc1e33d38119f8c59...0.12.0)确认它是发布标签的祖先（ahead 26、behind 0）；[作者 2019-06-20 发布说明](https://agateau.com/2019/pixelwheels-0-12-0/)说明该版本已分发。证据支持代码进入该发布版本，不等于本仓库试听了成品或验证玩家能辨识。[一手／研究]

**严格限制成本结论：** 本次二改未换音频文件，不代表零制作工时、此前素材无处理、整款游戏零手修或比生成服务总成本更低。没有试听、主动工时或同条件生成对照，不能补算优势。[研究]

### 固定状态映射不是随机丰富

同作者[较早碰撞变体提交](https://github.com/agateau/pixelwheels/commit/730671cc4e20a66a869cda3f1da9442a2d93b9eb)在碰撞声音开始时随机选择 pitch；冰面提交则按明确状态选固定值。两者改变声音的目的不同，具体范围只是该实现参数，不是通用推荐。[一手／研究]

**采用条件：** 玩法只需要一种可学习的风格化状态区分，原声源已合格时，比较固定参数／混合变体与独立新素材；先验状态触发正确，再验真实使用时能否区分。随机去重复只能留在同一含义内，不能随机抹掉危险、奖励或材质状态的区别。需要真实材质身份、变调后性格错误或提示仍难辨时，保留现有换许可源／专项生成的路线，而不是无限调 pitch。[研究]

### 反例与仍缺什么

[作者 2023 复盘](https://agateau.com/2023/opening-another-pandora-box/)报告发动机声曾花很多时间搜样、混合和调整，并另做不同速度下的试音工具；SFXR-Qt 覆盖其他效果，但不含发动机与轮胎声。它反驳“同源变体足以解决全部车辆连续声音”，未给可比较的主动工时。已有本记录第十节 Overwatch 原始讲稿又支持关键声音保持较少变化；这次不另建案例表或扩大变体数量要求。[一手／研究]

二改验收针对新增状态、普通状态保留与转换边界：核相同声源／参数对应、切换时不残留旧状态、关键提示不混淆；对不适用的真实材料保留替换方案。上述均为后续验收目标，未试听、运行游戏／模型／Unity／Unreal或测性能；通用声源与语义选择不硬写成双引擎教程。[研究]

## 声源补研：定位与宽度分开

核实：2026-10-18（UTC+8）。[研究] 定位声先比较干净单声道核心，既有stereo可下混则不必重生；环境宽度可保留或另层。下混丢信息、烘入空间感不合就换源，不能靠归一化承诺修复。

- Unity6.3 [Force To Mono](https://docs.unity3d.com/6000.3/Documentation/Manual/class-AudioClip.html)为导入下混；[spread](https://docs.unity3d.com/6000.3/Documentation/ScriptReference/AudioSource-spread.html)是3D多声道的扬声器角度，非素材转mono。[一手]
- UE5.8 [衰减契约](https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-attenuation-in-unreal-engine)的Stereo Spread是世界距离；Normalize降低6dB以防求和削波。Binaural还须核所选插件输入。[一手]
- [Resonance Audio](https://resonance-audio.github.io/resonance-audio/develop/design-tips.html)点声源要求dry mono，另有声场；仅其契约，不推荐新插件。[研究] 下混不是去混响。
- [Steam Audio](https://valvesoftware.github.io/steam-audio/doc/capi/audio-buffers.html)下混为通道求和／通道数。[研究] 因而L=-R会抵消为零，电平归一化不能复原；不是Unity公式或实际素材试听结论。
- [RoboRaid作者](https://learn.microsoft.com/en-us/windows/mixed-reality/design/case-study-using-spatial-sound-in-roboraid)以mono空间核心叠2D stereo层扩爆炸规模，后者过多削弱方向。[一手] HoloLens制作经验，非零手修证明，不强制双层。

[研究；未执行] 二改换源后核起音、转头／移动、远近、宽度与下混；必要内容变弱或方向混淆就退回。只读文档与作者报告，未试听、生成或运行音频／引擎；不证明定位、听感或工时收益。

## 成套配乐二改：普通曲不自动供应强度版本

核实：2026-10-19（UTC+8）。[研究] 新增赛末／高强度状态时，先比较保留原曲、采用已有成对版本、另补相容曲目；不把整曲变速当免费供给。以下只连 SuperTuxKart 同一作品的资源接入与维护，尚未证明明确新需求驱动的零手修二次创作。

**从单曲到实际成对采用。** 官方 SVN [r18012赛道](https://svn.code.sf.net/p/supertuxkart/code/!svn/bc/18012/stk-assets/tracks/ravenbridge_mansion/track.xml)引用的 [Demon Hill配置](https://svn.code.sf.net/p/supertuxkart/code/!svn/bc/18012/stk-assets/music/demonhill.music)只有普通曲；[r18013](https://svn.code.sf.net/p/supertuxkart/code/!svn/bc/18013/stk-assets/music/ravenbridge_mansion.music) 改供 Ravenbridge Mansion 普通／fast 两文件，[r18014赛道](https://svn.code.sf.net/p/supertuxkart/code/!svn/bc/18014/stk-assets/tracks/ravenbridge_mansion/track.xml)引用新曲。后续 [r18107](https://svn.code.sf.net/p/supertuxkart/code/!svn/bc/18107/stk-assets/music/ravenbridge_mansion.music)分别加入3.429／3.200秒循环起点；不能把普通版循环点直接套给快版。[一手：配置／修订] 旧曲被替换的制作动因、风格得失及候选淘汰未核到，不由文件更名补故事。

**现成供给的可复用边界。** 固定 r18626 [游戏许可清单](https://svn.code.sf.net/p/supertuxkart/code/!svn/bc/18626/stk-assets/music/licenses.txt)逐文件列两份 OGG 为 CC-BY-SA 3.0；[FLAC许可清单](https://svn.code.sf.net/p/supertuxkart/code/!svn/bc/18626/media/trunk/music/flacs/licenses.txt)同样列两份 FLAC，署名0zone0ne／Krobonil。[一手] 本轮只读文本与目录，未下载试听；这里只确认两份FLAC音频及许可，未找到可重编配工程／分轨，不据格式推定源工程齐全。复用仍按具体文件许可履行条件，不能把代码GPL或曲库名称当整包许可。

**程序回退不是现有供给保证。** [2008提交](https://github.com/supertuxkart/stk-code/commit/39eae930da0d3b6f03f11f14c4c87d63f2d05828)曾为缺快版提高播放pitch；[2024-12-22修订](https://github.com/supertuxkart/stk-code/commit/4a479ed6f507dd06e2a995df19f4aaf8debe5d5b)删除该路径，作者称未使用且认为会烦扰，不是已做同条件听感试验。[一手] [1.5固定源码](https://github.com/supertuxkart/stk-code/blob/1fb491f507216c5d181ccd85f29ff08eca003827/src/audio/music_information.cpp)只在有fast对象时切换；[官网指南](https://supertuxkart.net/Music_and_SFX_Guidelines)仍写自动提速，不能代替发布实现。作者[明确部分赛道没有快曲](https://github.com/supertuxkart/stk-code/issues/5204#issuecomment-2558231756)，无证据把这种保留单曲归因于预算不足。

**跨阶段代价：多一个版本也多一条运行路径。** [issue5204](https://github.com/supertuxkart/stk-code/issues/5204#issuecomment-2558228206)将单曲与双曲转场分开定位，后续[确认赛末前打开暂停菜单会触发缺陷](https://github.com/supertuxkart/stk-code/issues/5204#issuecomment-2560989307)；[1.5正式发布](https://blog.supertuxkart.net/2025/10/supertuxkart-15-release.html)确认修复末圈音乐缺失。[一手：作者／发布报告] 这支持把暂停恢复、切换音量和无快版回退纳入接入验收，不证明所有播放条件已过或制作工时下降。

**改变的选择与撤回。** [研究] 状态差异只是提示、原曲仍符合体验时，保留原曲与独立提示即可；音乐强度本身重要时，优先核已有相容普通／强度版本及各自循环点，再计额外存储、调度与二改维护。缺配套版本且必须人工重编配才能成立，就换完整许可资源或收窄音乐状态，不因接口可变速就承诺风格相容。目标是增加强度表达而保音色／乐句，不是追更多曲目。仍缺同作品创作需求、制作前后试听、淘汰及主动工时，也缺单人零手修创作实证；本轮无音频、引擎或模型运行，不把接入修订称完整生产闭环。

## 音乐出场密度补研：先改间隔还是增加曲目

核实：2026-10-19（UTC+8）。**长时间探索／建造，不把停留更久直接换算成更多循环、分轨或生成曲目。先比较音乐持续在场与曲目间留白，再决定素材需要什么结构。** 目标是减少不必要的反复陪伴、让音乐进入有意义，而非尽量少放音乐；实际疲劳和情绪收益仍须项目验证。[研究]

**同作的原方案与采用理由。** [C418在2015-08-21的原始访谈](https://daily.redbullmusicacademy.com/2015/08/c418-interview/)回顾早期Minecraft难以识别玩家具体处境、同时播放两曲会出错，因此选择不明确解释战斗或昼夜的音乐，低频出现；他担心重复令人烦扰，并认为间隔有帮助。[2021-04-14原始采访逐字稿](https://www.20k.org/episodes/minecraft)再次明确，他要求较多留白、下一首前等待随机，目的包括避免不断重播的疲劳。这些技术限制是历史作者报告，不是当前Minecraft或Unity／UE能力结论；不采用主持人关于固定时刻触发的旁白来承诺调度算法。[一手]

**不是不再改变情绪或永远不能按处境选曲。** 同一2021访谈中，C418说明最初孤独氛围在多人玩法后发生变化，后来制作较乐观、更有打击乐的Creative音乐。这是作者给出的新使用情境与内容修订，不证明所有旧曲被替换，也不说明只调间隔就能修正错误情绪。歌曲入场时令玩家动情是作者收到的故事，不是留白优于连续配乐的对照结果。[一手／研究]

**后续产品给出的反界。** [Java 1.21.6正式说明](https://www.minecraft.net/en-us/article/minecraft-java-edition-1-21-6)在2025-06-17加入玩家可调音乐频率，且暂停时继续播放；不能把低频出现定成唯一正确体验。[Java 1.21.11正式说明](https://www.minecraft.net/en-us/article/minecraft-java-edition-1-21-11)的`audio/background_music`区分默认、水下、Creative条件，提供曲目间最小／最大等待与是否替换当前音乐；明确反驳把早期处境识别限制沿用到后续版本。同版MC-301127修复constant频率下连接服务器时音乐停止重启，说明改变密度也要处理生命周期；这里引用明确版本，不称它为最新版或已验证本项目。[一手：发布契约]

| 先比较的路线 | 适用与额外工作 | 何时撤回 |
|---|---|---|
| 合格曲目之间留白 | 长驻留但不要求持续节奏／音乐提示；保存进入条件、间隔与结束/重入规则。曲目可先完整播放，不因此要求全部剪成循环或分离stem | 场面失去必要情绪或长时间空洞，缩短间隔、恢复连续；曲目本身不合题应换源，不靠少播放掩盖 |
| 少量连续循环 | 音乐需要持续支撑节奏或氛围，已能反复播放且不烦扰 | 重复已成为问题，先比较降低密度或改变编排，再决定补曲；不凭播放时长直接判需要模型 |
| 状态片段／相容分层 | 区域、强度或叙事转折需要音乐表达变化，沿既有FTL／Factorio切换条件与STK配套供给判断 | 没有相容资源、转场或维护代价不值时，回到较少状态；必要的玩法信息不能靠随机音乐出场承担 |

表中是供本项目选择的条件判断，不声称Minecraft全部曲目不可循环，或已有资产能免费变成新编配。出场密度属于调度选择，资源仍须有明确复用授权；不把Minecraft原声专辑当可用于另一游戏的素材许可。[研究]

**二改验收与剩余缺口。** 增加停留时间、切换探索／建造情境或开放频率选项后，沿用原通用音量、关键提示、暂停、取消与设备检查，另核旧曲是否被打断、进出菜单／重新进入后是否意外密集重播。按实际体验决定保留留白或连续，不增通用强制选项。未测听感、游玩、模型或引擎；没有完整制作／淘汰／工时记录，不能宣称成本下降、零手修成功或因频率更新而带来玩家收益。[研究]

## 音乐与模拟补研：共同调度不是免费音效层

核实：2026-10-20（UTC+8）；GA／GB，主线二／三。[研究] 本单元改变音乐入口：当二改要求“模拟本身听起来像音乐”，先决定能否改玩法时序，不把它当再买一套循环或加一个播放组件。不同作品只作反例，不拼成同一成功链。

**原问题与实际改造。** [Mini Metro 开发者2015-07-15原帖](https://steamcommunity.com/app/287980/discussions/0/537402115078429521/)承认低估实现：2014年底评估音频引擎、探索游戏事件如何音乐化后，发现需要更大的结构改造来排队事件，并处理会破坏声音的性能波动。此前供应合作与档期也影响延期，因此不能把全部等待归因于架构，亦无可靠纯工程工时。[一手：作者历史报告]

[作曲者2017复盘](https://disasterpeace.com/blog/mini-metro.postmortem)明确记载：原来成批出现的乘客改为按音频节律依次出现，上下车速度也受音频参数影响；它不是单纯让声音跟随已发生的事件。作者同时指出，曾做的座位／人数鼓矩阵使声音过于复杂；快进与两种暂停过渡需不同起音，Paris 较小车厢容量要求谨慎设计以免破坏平衡。[一手：标为working draft的历史复盘] [2018讲稿](https://disasterpeace.com/blog/mini-metro.serialism-talk)再次说明生成节律回写乘客生成；人工编写的音高／节奏数据与游戏数据共同工作，不能称全自动作曲或单人零音频制作。目标是系统增减能被听见且保持音乐统一，不是声音数量最多；无同条件效果量。

**可修改产物与边界。** [2020-12-23作者工作坊](https://disasterpeace.com/blog/workshop.mini-metro)将定制声景连到已发布的Workshop地图功能，不只是未完成原型。作者公开工具包固定于 [f2972874ca98fb49092c7b72314fd6d64bb950b8（2022-10-12）README](https://github.com/richvreeland/mini-metro-audio-toolkit/blob/f2972874ca98fb49092c7b72314fd6d64bb950b8/README.md)：城市通过 audioLoadoutId 选择参数文件；Peep 出现／上车时序会影响玩法，多数站点声音则立即播放、不可随意延后。改 LineLoop_Pulse 可能要同步改相关 pulse 常数；FadeIn_Times 为四速度配置。[一手：公开文档阅读] 这让“只改音频配置”实际可能改模拟、快进和旧配置意义成为可定位的二改风险；README不等于运行实现已复测。只借机制，不复制工具包／音乐资产，公开可读不自动授予商用复用权，也不推荐其历史音频引擎为当前默认方案。

**替代与撤回。** [Mini Motorways 作者复盘的 Less Responsive, More Musical 段](https://disasterpeace.com/blog/mini-motorways.postmortem.html#less-responsive-more-musical)回看 Metro 后明确收紧“游戏追随音频”，除非对手感关键；更多车辆下也不再坚持逐对象一一声化。[一手：另一作品反例，页面标working draft] 这不是 Metro 改造被撤销的证据。

| 实际需求 | 先比较的路线 | 额外代价与撤回条件 |
|---|---|---|
| 只需氛围、强度或清楚的动作提示 | 合法循环／短音，跟随玩法状态与整体密度 | 不改模拟；不是所有事件都有音乐对应，体验已足够就不增加耦合 |
| 模拟事件之间的共同节律就是目标体验 | 在允许改规则的事件中共同调度，用合法短音／程序声源及明确音乐规则 | 同时改事件队列和音频；规则／等待／吞吐或性能代价不可接受，就退回单向跟随 |
| 只有装饰声需要落拍 | 只量化该声音，不延迟必达动作或必要反馈 | 声画分离明显、响应变钝则立即播放或取消装饰；不是所有输入都可等下一拍 |

[研究] 二改先列哪些事件允许被重新排时、哪些必须即时，再改一组节律；后续获准验证时同时检查生成／上下车行为、容量压力、正常／快进／暂停恢复和听感，不能只验音频文件。已有一般入口的许可、映射、旧引用、混音、设备与连续听感检查全部保留。当前仅公开作者说明与参数文档核对，无游戏、引擎、模型或试听运行；未证明零手修质量、总成本或提效。现成合格声音和程序声源仍需音乐设计，不因能写JSON就承诺专业结果。

## 成套音效供给：保留合格子集，再替换缺口

**✅ 新增内容或清权时，先保留已过许可与玩法验收的声音，只替换缺口；整套声音语言不兼容时才换整包。** 此处把“成套资源优先”收窄为可供同一游戏持续修改的子集，不按包名、文件数量或统一音量认定成套。AI可追来源、比版本与事件映射，人仍决定声音身份、耐听与是否删减。核实2026-10-20；以下仅公开文字／源码元数据，无音频下载、试听、模型或引擎运行。[研究]

### OpenSFX：保留、重授权、换源与发行后修正

[PR8](https://github.com/OpenTTD/OpenSFX/pull/8)先替换非自由来源，保留可继续使用的子集；25从原CC0录音重新编辑，26另加喇叭。来源可用并不自动放行旧编辑成品。[3ea2863](https://github.com/OpenTTD/OpenSFX/commit/3ea2863c7504d8ee6e6c84b04ddbe1e5e594f863)取得编辑者许可后只改清单；0.2.3与1.0.0的00、11两个WAV的Git blob分别保持`af5dc3a3`、`1ce3145f`，证明确有旧成品保留。反之，[891a6d1](https://github.com/OpenTTD/OpenSFX/commit/891a6d10b337a9692632f807ee570c07f2b1c583)重编辑未获所需许可的成品，23／46／49因找不到源而完全换源。[一手：提交及tree元数据，未读取二进制]

**采用哪种许可会改变可保留范围。** 作者当时[说明](https://github.com/OpenTTD/OpenSFX/issues/2#issuecomment-768563982)，接受BY-SA可留住现有子集；不接受SA须再替换一项，不接受BY则更多。当前[固定清单](https://github.com/OpenTTD/OpenSFX/blob/d0bf8d4deda22d5a7f8d01953433cb2644663e9f/src/opensfx.psfo)中，11的原源为PD而编辑成品为BY，24为BY-SA；不能只查下载源。整包与逐件许可分别见同版本[README](https://github.com/OpenTTD/OpenSFX/blob/d0bf8d4deda22d5a7f8d01953433cb2644663e9f/README.md)。这不是所有混合素材包的法律放行结论。[一手／研究]

**重做后仍须回到真实事件验收。** [历史评审](https://github.com/OpenTTD/OpenSFX/pull/8#issuecomment-767852584)指出截断、起飞阶段不符与工厂声音风格问题；[作者回应](https://github.com/OpenTTD/OpenSFX/pull/8#issuecomment-767887788)承认42／43失败，需对动画同步并在游戏音量下验。1.0.1又以[d92b939](https://github.com/OpenTTD/OpenSFX/commit/d92b939d1c594163bf7b1981a07d4e6ff090d5c3)交换27／28两份公交声音，不只是改说明。官方[分发记录](https://bananas.openttd.org/package/base-sounds/4f534658)可核1.0.0→1.0.1→1.0.3；最后一版仍可游戏内获取，不能据此推用户数或当前听感。[一手／作者及评审报告]

清单有73槽，34／50为空声，不能当73个不同可听成品。作者明确大量录音经人工编辑才适配；本例证明已有成品可以选择性保留，不证明单人零手修能复制其制作过程。[一手／研究]

### 独立对照：换一类声音，而非坚持全保或全换

[Roguesphere制作记录](https://www.renz.is/roguesphere-devlog23/)把Kenney用于多个事件、Freesound补缺；为了与敌人／升级台碎裂一致，普通拳击及受击声改成玻璃，护盾仍用金属。它支持按声音家族修订，不证明整包自动统一。记录属于beta制作阶段，本轮未核逐文件许可或相同音频进入后续发行的父链。[一手：作者报告]

[Spring Rider复盘](https://intelligenttools.co/blog/multica-agents-godot-game)报告Agent噪声合成被人否决，Claude Code转用作者称为CC0的轮胎、制动、环境与动物录音，以脚本裁切；后续又删链条／飞轮、缩短重复水洼声、撤掉音乐。它补充“AI做检索／脚本，人拒收和删减”的路线，但未取得公开仓库／逐件许可；发布页存在不等于本轮验证。该站有推广背景，转载不是第二份独立证据，不采用全项目费用作为音效成本。[作者报告／研究]

### 生成补全仍是有条件候选

2026-09-30论文[Game Sound-Effect Completion](https://arxiv.org/html/2609.39044v1)以已有事件和已完成目标声补其余事件，值得观察。其较强结果用未知目标音计算oracle提示，布局也使用全语料时长；未验证设计者提示、跨游戏供给或制作试听。零变换提示不保证精确保留，已知目标是最后回填原音；所链代码页本轮404。故不把它列为现成商用管线，也不下载／提取论文所用游戏资产。[一手：论文自报；研究]

**本场景默认与撤回。** 先选许可清楚、已能表达主要事件的完整成品，局部缺口比较兼容成品或参数音；真实声源语义做不对就换来源，不无限微调。整体风格不合、许可条件不能接受或缺口必须人工精修时，换完整供给或收窄内容承诺。上述案例没有可比总工时、零手修通过率或AI净收益。[研究]

后续获准验证时，用同一作品“增加新事件类别，再改既有事件身份”检验保留范围、旧映射、动画时序、混音和新增维护成本。Agent可筛遗漏与错配，不能按文件名／规格宣布听感合格；人需在实际动作和连续游玩中决定保留、替换或删除。只有这些结果才能改三档首试顺序。[研究]

## P37视频Foley比较的结果与边界

**ControlFoley已不只是摘要候选，但尚不能替换商用短音路线。** v3 §4.5作者组织20名相关专业参与者，隐藏方法身份、随机顺序。TV2A为三个数据集各10片段，报告音质MOS 3.99，对照Hunyuan 3.71；这是作者组织的比较，不是本仓独立试听，也不是UI成套耐听结论。[作者报告／研究]

AC-V2A的原文同时写30片段与两个数据集各10，分母矛盾，不能自行修成20或汇总总样本。Kling只进入客观指标比较，不能套用人类偏好结论；没有披露的评分总数也不能用人数乘片段数补齐。[作者报告／研究]

**代码许可不覆盖权重生产。** [官方仓库](https://github.com/xiaomi-research/controlfoley#-license)及[模型卡](https://huggingface.co/YJX-Xiaomi/ControlFoley#-license)分别声明代码Apache-2.0、权重CC BY-NC 4.0。[官网](https://yjx-research.github.io/ControlFoley/)样例用于学术／非商业演示，不把可下载音轨当商用素材包。[一手]

**同输入样例也须先分清任务。** 官网TC-V2A样例3要求把敲击鼓／金属盘的画面配成键盘声；本仓查看输入帧，不能把它记成普通键盘录音或120毫秒UI点击二改。该项测的是文字与画面冲突时的语义选择及节奏控制。[一手／本仓图像观察]

本仓以ffmpeg ebur128读取原demo8_ours.mp4和demo8_thinksound.mp4，分别为−25.3和−11.4 LUFS，相差13.9 LU；没有试听。数值不判声音胜负，但原始轮播不能直接视作等响度听感比较。后续需保同步时间轴并另做静态增益匹配，不能通过压缩、去噪或拉伸暗中修好候选。[本仓文件测量／研究]

测量对象为官网`Videos/demo8_ours.mp4`（SHA256 `6b4c3131be4ba73ef94acf0137aa8f561ba3bd396dba4e21f8006b5978fa9a07`）与`Videos/demo8_thinksound.mp4`（`43f557e6f4282a0c28b58c0b00f0e553832c3f81e3c24a6bf20d554045813ec7`）。ffmpeg 7.1.5使用`-i 文件 -vn -af ebur128=peak=true -f null -`读取完整原音轨；时长略不同，真正同窗试听须重测，不能把这两个数直接当已制作好的等响度听评。[本仓文件测量]

**首试不重排，排除依据更具体。** ControlFoley可作非商业视频Foley研究参照，不能以此关闭P37短音比较。Agent可核许可、事件映射和技术差异；人须听语义、同步与持续游玩耐听。补到适用授权及现成／程序化／生成同事件产物后，再比较成套二改成本；没有运行模型或引擎。[研究]


## P37参考短音：补变体还是改局部

**默认保留合格母版；生成只接新的声音身份缺口。** 同一问题限定为：已有合法短事件声，第一版补少量同源变体；第二版只缩短尾音，起音和旧事件含义不变。下表是资料比较，不是三路线实测。[研究]

| 路线 | 首版／二改的选择 | 不能据此声称 |
|---|---|---|
| 许可现成声 | 先找同包变体；尾音修改用保留母版的脚本处理 | 文件可裁切不证明短版自然，也不保证同包都适配 |
| 参数化合成 | 已有合格参数母版时改包络；需真实声源身份但合成不像时换源 | 可调参数不等于能逼真模拟所有材质 |
| 参考生成／局部修补 | 新同源音色与局部重建分别评估；原波形已满足的修改不默认再生成 | 研究模型的适配结果不等于原版即用或可商用 |

### 最高水平卡与决定性比较

- **当前最高水平未知，近期参照改为任务匹配。** Mélodie Desbos等（ETS Montréal），[2026-07-10 SFX横评全文](https://arxiv.org/html/2607.09973v1#S3)来自模型原作者以外团队；对参考变体比视频Foley榜更贴题。沿用审计A05，不把一篇独立横评外推成完整游戏音频冠军。[一手／研究]
- **主流／可行层**仍为许可声池与参数母版，采用率未知。本仓推荐属于可行默认；生成仅为缺口候选，不重排音乐、配音路线。[研究]

横评先在ESC-50适配，再用400条测试参考各生成10变体；15名听者评参考身份，每方法随机100对。AudioX的S-MOS为3.37，对照AudioLDM 2.22、ThinkSound 2.57；A²SB的4.81只涉及局部修补，不可排名为整段冠军。硬件、步数和批次不同，耗时不作等预算胜负。[作者报告／研究]

这补了独立评价，却未补本题“尾音二改、起音不变”的连续链、许可现成／参数化对照及主动工时。ThinkSound局部指令分析也不是完整二改链。故**整页仅候选／差距2，P37不关闭**。[研究]

### 商用与反例不能由分数跳过

[AudioX权重LICENSE](https://huggingface.co/HKUSTAudio/AudioX/blob/main/LICENSE)明确CC BY-NC 4.0，因此不纳入商用默认；不要把论文附件或评测声库当发行素材。较新的[AudioX-Turbo论文](https://arxiv.org/html/2606.12555v1)另述少步生成，不能继承上述旧AudioX参考变体成绩。[一手／研究]

程序化也不是免验路线。[QuAP全文](https://arxiv.org/html/2606.00629v1#S4.SS2)的表3写爆炸默认56.40、最佳优化52.55，Jet排除；不能仅凭摘要“五类改善”宣称所有短音因后处理变好。该研究结合检索与程序化，但没有本题与领先生成的等任务二改胜负；暂不据此换工具。[一手／研究]

**撤回与人机分工。** 脚本能保母版、记录参数、定位被改区及检查旧映射；听者仍要判断同源身份、起音清晰、尾音自然及连续重复是否疲劳。截短破坏事件识别时恢复母版或换合格短版，不无限重抽；需要重建整个声源时重新比较三路，而非把修补指标当放行。[研究]

本轮只读论文与许可，未运行模型／引擎、未试听、未下载权重。横评演示站本次无法访问，未核其音频或代码；正文结果来自可读论文，不把演示缺失记成模型失败。合格资产率、总成本和主动工时仍未知。[研究]
