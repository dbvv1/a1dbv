# B-MUSIC-LAYER-PRODUCTION-001 · 保留探索录音，制作可继续修改的战斗声部

id: B-MUSIC-LAYER-PRODUCTION-001
owner: dot-B
status: review_ready
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

## 交接（本地协作会话 → dot-B）

- **状态：** `review_ready`；待宿主取得一次独立只读复核。本会话未 commit／push、未合入 `main`，不声明独立审查或发布。
- **实际通道：** Claude Code＋DeepSeek 原生 Workflow 实施；父调用原始 assistant `message.model` 为 `deepseek-flash`，请求别名另记 `deepseek-v4.1-flash[1m]`，不据别名推断后端；独立只读复核由宿主另行取得。
- **开工基线与归属：** 开工时 `origin/main` 为 `6f2d8cb`；交付前复核发现远端 `main` 已前进到 `215f054`，该提交只改 `AGENTS.md`、运行手册／operations、dot-A／dot-B 提示词，不触及本任务三个文件。本工作树仍基于 `6f2d8cb`，未自行 merge／commit；宿主发布前按手册§7整合最新 `main` 并重验受影响路径（本任务文件无重叠）。未合入来源分支 `d805f086...` 的内容，只按本任务读取。结果提交 SHA 尚未生成（由宿主提交）。
- **固定受检版本：** Remiqora v0.3.0 `0d38d6daa605f9303794b901e1a1dae2ad8b84df`；后续 README `d3bb4da53eb05cb50133d4ea5365de653c5eed39` 仅作 0.4.2 说明；ACE-Step-1.5 `ca1e85fe9430179831e6bc6be790c332190a3866`；上游 issue #1088。
- **改动文件：** `domains/game-dev/assets/audio.md` 的音乐制作段、`docs/research/2026-10-14-game-wp6-audio.md` 对应证据、本任务；未改短音／配音／许可总入口、出场密度／切换默认、代码、03／04／05、其他资产页或共享 TASKS。
- **改变的选择：** 默认仍是许可成套曲／分轨；只有原探索录音必须保留且无兼容战斗版时，才条件首试“以旧轨为上下文生成独立声部”（Remiqora lego＋ACE-Step base）。正文把 lego、时间段替换（inpainting／repaint）、拆 stem、独立生成部件和保源改谱分开；给出输入、起点、候选生产、同旧轨听选、峰值／混音、作者工程与同长导出、状态接入和二改路线。明确 lego 旧轨不自动静音、候选可能复制上下文、相关性只是启发式、导出会烘入 gain／pan／effects 且不是完整作者工程；预发布、无自动保存、补丁与硬件成本写入采用条件。二改区分可参数化项与必须重新候选／试听项；未把音频重演绎、拆 stem、区间替换和新增独立声部混为一谈。
- **已核范围：** 已读 `AGENTS.md`、`CLAUDE.md`、dot-B 长期提示词、`TASKS.md`、手册§7、`operations.md` §2.2、现有 audio 音乐段与 WP6。静读 Remiqora v0.3.0 的 `AiPartPanel.vue`、`stores/aiParts.ts`、`utils/aiParts.ts`、`utils/dawExport.ts`、`external/patches/README.md`、README、LICENSE；静读 ACE-Step-1.5 固定源码的 LICENSE、`constants.py`、README 硬件表、API.md 与模型任务过滤，并读上游 issue #1088。读取 Eleven inpainting／separate-stems 官方页与 Stable Audio 3 分部件说明；复用既有 FTL／SuperTuxKart／yovoice／Star-Rush 证据，未重做旧调查。未读私有音频／凭据／公司材料，未安装、未下载权重、未运行生成／引擎／GUI。
- **未验项：** 未试听；音乐相容、零串音、候选接受率、主动工时、最终混音和真实游戏状态切换均未知，不能记品质通过。lego 默认的 `acestep-v15-base`（及可选 XL base）权重卡本轮因 Hugging Face TLS 拒绝未直读，发布前须按实际 checkpoint 再核；Eleven 拆 stem 官方页已核两档枚举及默认值；0.4.2 README 的新增引擎与 0.3.0 不是同一受检版本。Star-Rush 短音链最终混音未听的状态保持不变。
- **检查：** `python3 scripts/check_repo.py`（381 文件，0 错误）、`python3 scripts/check_public.py`（642 文件，0 命中）、`git diff --check` 通过；纯文档，未跑无关 Hook／实验。`python3 scripts/check_public.py --commits origin/main..HEAD` 因本次工作树改动尚未提交、HEAD 无领先提交，不能替代对本次产物的提交身份检查；由宿主提交后核暂存差异与身份。
- **接收：** dot-B 接收；本会话不自行合入 `main`。

## 宿主独立复核与修正

与实施上下文分离的只读 reviewer 已核完整需求、三文件差量、固定 Remiqora／ACE 源码及新增官方资料。制作链、上下文与导出边界、保留原录音及二改路线未发现必须修复问题；唯一事实发现为 Eleven 官方页已列两档 stem_variation_id，现已据官方原文修正 WP6 及本任务，不再误报成控制台缺口。宿主另亲读官方页请求参数与 ZIP 响应。机械阶段关于“16GB 仅警告”和“18GB 组成”的两项疑点经固定 README 完整上下文核查撤销：README 分别明确至少16GB及安装组成，因此原稿保留，不按局部摘录误改。

父调用原始 message.model 为 deepseek-flash；原生 Workflow 13:35:05–13:55:07 UTC，实施与机械自检结束后才进行本宿主独立审查。未安装、下载权重、生成、试听、运行 DAW 或引擎；目标 lego checkpoint 权重卡与真实素材权利须在实际采用前核定，音乐相容、串音、混音品质、接受率、工时与真实状态切换仍未验证。原始读取失败与审查结果保留本机，公开任务仅回传结论。
