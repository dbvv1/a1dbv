# B-OPENWEIGHT-AUDIO-001 · 公路海岸弯环境声

id: B-OPENWEIGHT-AUDIO-001
owner: dot-B
kind: build
status: accepted
target_repo: dbvv1/Star-Rush-Reborn
base_ref: ecbb4843923b2fe12f994dd9862042c60d40fe5c
result_branch: relay/dot-b-openweight-audio-001

## 做成什么

让汐见海岸公路弯道的玩家听到与海景一致、低调而不掩蔽驾驶反馈的海风和远海浪。
用本机 RTX 5070 12GB 实际运行开放权重生成，保留原始声音、可复现二改和一个可玩的候选接入。
同路段对比关闭／开启环境层，听辨循环接缝、场景一致性及发动机／轮胎／护栏声是否仍清楚；生成文件或解码成功不等于采用。

## 模型与执行

- 首选作者公开的 `OpenMOSS-Team/MOSS-SoundEffect-v2.0`：模型卡标 Apache-2.0，当前无 gated 同意页；用作者 `MOSS-TTS/moss_soundeffect_v2` 推理入口，不用 HF 自动生成的图像示例。固定实际源码／权重 revision，核各组件许可后保存来源；不把生成结果自行标成 CC0。
- v2 是 1.3B DiT 加文本编码器／VAE，不是旧 8B v1。官方仓全量约 11.2GB 是磁盘大小，不代表显存峰值；隔离环境按官方 bf16、单 batch、10 秒起步，记录实际峰值显存、加载与生成耗时及 CUDA/PyTorch 版本。只装推理依赖、不训练，不与其他本机 GPU 任务抢资源；遵守原接收端两小时单元上限。
- 轻量备选 `stabilityai/stable-audio-open-small`（短音上限 11 秒）：仅在接收端已有合法访问／缓存且许可适用时使用；代码 MIT、权重为 Stability 社区许可，商用有注册／收入条件，不能只凭代码许可放行。不得代点新同意协议、创建凭据或付费；401/403 即停对应下载。AudioGen、TangoFlux、MMAudio、Woosh 的非商用权重不作为本作品生产备选。
- 先核官方 CUDA 12.8 / PyTorch 入口与5070兼容；首次编译耗时和后续推理分开记录。若命中官方说明的 TorchDynamo/Triton 编译错误，可用其 `TORCHDYNAMO_DISABLE=1` 普通推理配置，不改系统安全设置。
- 主模型若 OOM，先核官方支持的内存方案；仍不适合就保存实际失败和恢复条件，不声称 12GB 已可用，不换不可信镜像。没有合规可运行模型时原任务 `blocked`，不伪造“AI 生成”程序音。

## 声音规格与制作

- 起始提示词：`A quiet coastal road on a clear morning. Soft steady sea breeze and distant gentle surf below the seawall. Natural restrained ambience, consistent distance, no people, no voices, no birds, no vehicles, no music, no dramatic gusts or impacts.`
- 先生成少量不同种子选一个可用源；按同一风格修改一次提示词或源处理，针对真实接缝／突响／空间过近问题再评。不是刷数量，也不模仿特定商业游戏的录音。
- 保留模型原采样率／声道的原始 WAV、提示词、种子、revision 和参数；归档原始浮点输出，任何归一化都另存处理件。运行资源目标为 6–10 秒、48kHz 或44.1kHz、立体声 PCM16，无语音／旋律／明显突响；裁切、交叉淡化、EQ／电平处理用可复跑脚本，记录实际大小与处理差异。
- 原护栏 Kenney、已有 engine/tire 候选和程序音不替换。本任务补海岸环境缺口，不重跑已 accepted 的 B-SR-AUDIO-001，也不把刹车按键音称为物理轮滑观测。

## 写入与接入

- 在结果分支独占 `assets/coast-ambience/`（源、运行件、处理脚本、README/CREDITS）；可改 `audio.js` 和必要的窄加载／构建／Worker资源表、相关测试。先读产品 AGENTS／brief；保固定基线的 road-v2 物理与已验光照，不能整合旧分支覆盖它们。
- 候选仅 `/road` 的汐见海岸主弯约380–660m及两端平滑过渡可听；复用已有赛道位置与音效总线，不造通用环境系统。明确构建开关，默认关闭，`/`及其他赛道不变，不比赛中换模型。
- 资源缺失或解码失败即无该环境层，不阻塞驾驶；暂停／退出／静音／音量恢复和重开必须正确，无重复声源累积。原发动机／轮胎／碰撞／音乐混音参数不改；用当前混音实际比较，不靠增大全局响度取胜。
- 不写生产默认分支、不部署；不提交模型权重、缓存、运行数据库、凭据或本机绝对路径。模型环境留本机，资源与制作源进入产品分支，任务状态只回写本文件。

## 接收与当前结果

接收端按既有原生 Workflow 实施、非作者独审、修正复审。跑受影响音频／打包／Worker检查与产品规定构建测试，真实浏览器正常跑过目标路段；回传单独资源试听和实际游戏混合录音（取不到则明确缺项，不能用离线重放冒充）。非作者对照原关闭状态及 Forza 公路片段的环境层级目标，判断是否更有海岸感、循环自然且不抢驾驶声；不复制参照声音。结果分支、实际生成成本、接入范围和品质差距回写 `review_ready`；dot-B 决定采用或撤回，未听验保持候选。

来源（2026-10-26核）：[MOSS v2模型卡与权重许可](https://huggingface.co/OpenMOSS-Team/MOSS-SoundEffect-v2.0)、[作者推理入口](https://github.com/OpenMOSS/MOSS-TTS/tree/main/moss_soundeffect_v2)、[Small模型卡与访问门](https://huggingface.co/stabilityai/stable-audio-open-small)、[Small完整许可](https://huggingface.co/stabilityai/stable-audio-open-small/blob/main/LICENSE)。

## 当前结果

接收 [2bc688a](https://github.com/dbvv1/Star-Rush-Reborn/commit/2bc688a2043b42cd68bd05524861c20a193ccb3b) 的开放权重海岸音源、可复跑处理与默认关闭工程候选：本次七文件修正已补 GiB／进程累计峰值、含传输写盘计时与 SFX 总线录音范围，原 WAV 和运行接入未变；人工听辨、循环接缝及完整混音优劣仍待验，未作声音品质采用，案例线按固定候选测试／smoke 门槛接续合入与网站旁置入口。

## dot-B 接收反馈／修改要求

- 核定 `8e563d6645bdb85e0981808bbbbd3391694eb967`：两份 raw 与 runtime WAV 均与 `fa5664f` 字节相同，保留原资源及当前结果；复用原 6 项测试、频带复算与二改字节验证，不重跑 GPU 或浏览器、不重传附件。
- 仅修生成记录：显存除以 `2**30`，单位改 GiB；未重置的峰值为进程累计值，不称独立每种子峰值；生成计时包含 CPU 传输与 WAV 写盘。删除没有对应遥测支持的共享显存超额／争用因果断言，保实际耗时，首轮较慢的原因未知。
- 修录音范围说明：新脚本从正常菜单自动试驾，不是玩家键盘驾驶或事件回放；只截取首个接到 destination 的音效压缩器，后续音乐输出未接入，因此现有录音是压缩后音效（含环境层），不能称完整音效＋音乐最终混音。本次不扩写脚本或重录。
- 复用 dot-B 已在固定 `9fce32` 本地候选加 `fa5664f` 音频差量录得的完整双路混音：两次正常键盘驾驶不同，Canvas，原始录音与无增益裁件已备；人工听辨挂起，默认关闭、未采用。修 README 换行为 LF，并核最终提交差量空白；完成后原任务回 `review_ready`。
- 本轮只做上述原结果的记录修正，不合旧 relay 整树、不触产品默认分支或部署，不代办暂停中的产品发布。
