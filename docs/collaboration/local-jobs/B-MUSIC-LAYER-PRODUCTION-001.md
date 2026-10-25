# B-MUSIC-LAYER-PRODUCTION-001 · 保留探索录音，制作可继续修改的战斗声部

id: B-MUSIC-LAYER-PRODUCTION-001
owner: dot-B
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: d4acb3ec25fb6800518d1309b6dc11b5487cfdc8
result_branch: relay/b-music-layer-production-001

## 完整制作问题

已有合格探索曲录音，希望新增兼容战斗声部，仍保留原录音，并能继续编辑、混音、导出和接入游戏。把源件选择、拍点／乐句／循环、候选生产、听选与混音、作者工程与打包、状态接入和第二次修改串成一条可实施路线，不再只说“缺配套就撤回”，也不另开模型排行榜或小研究文档。

现有成套许可曲／分轨能满足需求仍是默认；只有确实缺兼容配套、又必须保旧录音时，才条件首试上下文增轨候选。已有 MIDI／谱源时保源编辑是另一条路，不把音频重演绎、从成曲拆 stem、时间段替换和新增独立声部混为一谈。第一版探索曲加战斗层，二改调整战斗进入和收尾的编配而不改探索录音；说明哪些能参数化、哪些必须重新选候选及重新试听。

## 已核来源与应改变的选择

先读 AGENTS、CLAUDE、dot-B 提示词、TASKS、手册§7／operations§2.2，以及现有 audio 正文与 WP6。复用 FTL／SuperTuxKart 配套与切换、yovoice 源谱、音效混合及许可证据，不重做旧调查。

新增材料从 [Remiqora v0.3.0](https://github.com/inikolax/remiqora/releases/tag/v0.3.0) 固定 `0d38d6daa605f9303794b901e1a1dae2ad8b84df` 接续，README 后续固定 `d3bb4da53eb05cb50133d4ea5365de653c5eed39` 只作相应说明，不混成同一受检版本。父席已静读以下路径，接收端针对引用和关键推导复核即可：`frontend/src/components/editor/AiPartPanel.vue` 327–350、`frontend/src/stores/aiParts.ts` 73–103、`frontend/src/utils/aiParts.ts` 39–133、`frontend/src/utils/dawExport.ts` 73–110，以及 `external/patches/README.md`。

可借的是 ACE base 的 lego 路径以旧轨为上下文产出独立候选 WAV，旧轨不自动静音；同长同起点 stems 和 Reaper／DAWproject 导出提供交接入口。不能据此说音乐相容、零串音或拥有完整作者工程：gain／pan／effects 已烘入 WAV、master 默认；预发布、无自动保存、维护上游补丁等成本须写进采用条件。新轨可能复制上下文，相关性检测只是启发式；[ACE 上游 #1088](https://github.com/ace-step/ACE-Step-1.5/issues/1088) 的闲置关闭不是修复回执。

同题替代引用 [Eleven 时间段编辑](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/inpainting)、[既有音乐拆 stem](https://elevenlabs.io/docs/api-reference/music/separate-stems) 和 [Stable Audio 分部件说明](https://stability.ai/explainers/ai-music-stems-and-audio-inpainting-generating-parts-instead-of-finished-songs)。分别核其实际输入输出与版本：inpainting 不自动供应兼容新声部；拆 stem 不会凭空新增乐器；独立生成部件仍要对齐编配。若新事实改变边界则修正，不能因为父席转交结论就跳过关键引用核查。

## 正文与交付

仅改 `domains/game-dev/assets/audio.md` 音乐制作对应段、`docs/research/2026-10-14-game-wp6-audio.md` 对应证据和本任务。保短音、配音、许可总入口、出场密度／切换的仍适用默认及 Star-Rush 未试听事实，不改代码、03、04／05、其他资产页或共享 TASKS，不新建小研究文档。正文给无音频专职程序员明确输入、起点和取舍：保留原录音与可回改源，定义节拍／调性／乐句和循环区域，限定新增层职责，选候选并同旧轨试听，控制峰值与混音层级，保存工程与派生文件，按已有音乐状态接入，再完成二改。源码支持的工程能力与听感、接受率、工时未知分开；未听不能记品质通过。

核指定代码／模型／输入音频／输出的许可链，以及所需权重、安装、硬件和补丁维护成本；只调查，不安装或下载权重、不运行生成或引擎实验。不得把研究候选宣称音乐品质领先，也不能因缺最终听验停止可独立完成的制作说明和接入设计。

仅由既有本地协作会话使用已配置模型执行普通原生 Workflow（实施＋一次独立验证）。本任务不授权 dot 直接操作用户电脑，不新建凭据、增加收费／权限或部署，不读私有音频／文件／凭据；特定拒绝独立保留，当前通道被明确拒绝则保产物、停该动作，不换路绕过。按手册§7复用未变证据，做关键来源、正文、公开文件／新增提交身份和暂存差异检查。开工核最新 main 和同文件归属，只推结果分支，回写 `review_ready`、实际通道、固定 SHA、改变的选择与未验项，由 dot-B 接收，不自行合入 main。

认领：dot 本地协作；2026-10-25T13:38Z。固定来源 `d805f0866ba4963fb423f687b8c955bf740ba2ad`，只汇入此任务。现有在制 2D／UI／VFX 与本项音乐段无重叠；独占 audio 音乐生产段、WP6 对应证据及原任务，未合入负责人内容分支。只调查公开资料，不安装／下载权重、不运行生成或引擎实验；普通原生 Workflow，由宿主取得一次独立只读复核并发布指定结果分支，dot-B 接收。
