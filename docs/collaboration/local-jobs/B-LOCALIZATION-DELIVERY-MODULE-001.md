# B-LOCALIZATION-DELIVERY-MODULE-001 · 两语言文本与对白的制作接入链

id: B-LOCALIZATION-DELIVERY-MODULE-001
owner: dot-B
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 503e3da6abaece9c862b2d61b52c42011dcc834c
result_branch: relay/b-localization-delivery-module-001

## 完整问题

短叙事／动作游戏的菜单、带数量变量的提示和短对白，怎样从原文交成两语言可接入、可继续修改的内容？部分句子有配音，部分只有字幕。串起作者源→翻译输入→运行文本表与对白 lineID／可选语音绑定→正常显示、推进与切语言→第二次修改的精确回审，不把模块缩成占位符检查或退出对白边界。

第一版以少量菜单、数量提示、两位说话人的短对白完成整条链，说明玩家怎样读懂变量、听／读完一句、继续或查看另一语言。第二次需求改变数量条件、对白说话人语境，并新增未配音句：哪些译文／语音／字库／布局须回审，哪些人工译文应保留，缺语音怎样回退字幕并让玩家来得及阅读。给可执行默认，不宣称语言审校、配音或真实显示已通过。

## 复用与实施起点

先读 AGENTS、CLAUDE、dot-B 长期提示词、TASKS 当前重点及手册§7／operations§2.2。复用04与wp10-content已有稳定key、参数与复数、字体塑形／RTL、AI译文候选、语境回审、Yarn推进、可选语音来源；音频制作与许可引用 assets/audio／WP6，玩法事实与命令引用05，不改这些模块或重做模型工具榜。

用一个小的作者数据例子串完整生产链，字段至少有稳定key或lineID、原文、类型化参数schema、语境／说话人和可选配音引用；不强制菜单与对白使用同一ID机制。保留版本化、可差量审查的原生文本表与现有叙事源，不把导出的运行表冒充唯一作者源。小项目先沿现有工具；只有反复多人多语言增量协作的收益足够时才比较TMS，不新建翻译平台。

沿项目锁定版本说明 Unity Localization／Smart Strings、UE FText／String Tables 的原生导入与绑定；项目已用 ink／Yarn 就保留栈，核文本表、lineID和可选语音怎样被真实消费者找到，不为统一示例换叙事后端。只补这一接入决定性的官方实现／文档证据，明确对应版本与局限；源字段、导出结果、运行绑定和保存的消息参数各有主人，参数不靠译文反推，历史事实与当前语言显示分开。

AI负责整理语境、候选译文、参数一致性、变更影响与最小接入实现；人验意思、口吻、文化语境、阅读与听感。正常切语言需覆盖菜单、动态数量提示与对白当前句的产品策略，不把丢掉用户进度当自动重译。新增未配音句沿字幕阅读回退，不继承旧音频的时长或已验结论；二改只回审受影响内容，避免覆盖已确认人工译文。

## 独占范围、验证与交接

仅改 `domains/game-dev/04-client-modules.md` 的“增加语言与推进对白”段、`docs/research/wp10-content.md` 对应本地化／译文供给／对白证据段，以及本任务。保现有锚点与仍适用的字库、塑形、RTL、图片文字、输入编辑、长文、对白推进入口；不碰04菜单设置／UI、性能、角色、资源等其他段，不改05、资产／WP6、共享TASKS或其他任务。新开工重核main和归属，同页若有在制写入先协调；不扩大为全页风格改写，不新增小研究文档或证明台账。

仅由既有本地协作会话使用已配置模型执行普通原生 Workflow。实施者做真实自查；完成后由宿主另取与实施上下文分离的一次有效独立审查，宿主亲自记录来源、发现和修订，实施者不得自写／代写宿主独审回执或用机械自查代替独审。保留原失败与真实待验，复用未变证据，修复只差量核验，不重复全文审查。

本任务不授权 dot 直接操作用户电脑，不新开游戏／引擎／生成模型实验，不下载权重、新建凭据、增加收费／权限或部署；不使用收费翻译／配音生成，只用允许公开材料，不读私有工程／文件／凭据。具体拒绝独立保留，被明确拒绝就停该动作并保产物，不换路绕过。按手册§7检查关键来源、正文入口、公开文件、实际新增提交身份及暂存差异；只推指定结果分支。回写 `review_ready`、固定SHA、实际通道、首版及二改实现起点、真实宿主独审和待验项，交dot-B接收，不自行合入main。源码／官方说明、离线检查、模型文稿、语言审校、真实引擎／字幕／配音效果分别报告。

认领：dot 本地协作；2026-10-25。固定来源负责人分支 dot-b/tmp/20261025-localization-module-job，提交 `4c08cd5d8eca64a9c6b1f25e0e4ae7569cebd4e2`，只引入原任务，不整合内容分支。独占 04语言对白段、wp10-content对应证据 及原任务；本端前序 UI／性能已接收停止写入，此两项分别04与05，无同文件在制冲突。沿普通原生 Workflow 实施，宿主在实施结束后另取一次独立只读审查；只推指定结果分支，dot-B 接收。不启动引擎／游戏／生成／付费翻译或配音／电脑操作实验。

## dot-B 执行事实询问（2026-10-25）

截至本次读取 main `6f7494afc9707a1377e3fa88ce139e7a1df04e0e`，Git 中只见原认领，尚无模型启动／阶段回执或指定结果分支；`running` 标签本身不证明已实际执行。保留原任务和状态，不重复派单，也不在接收端另启模型。

请认领宿主在本任务回传：是否已实际启动？若已启动，只补实际通道、开始时间、可核的模型标识及当前阶段／已有产物；实施结束后再另报真实独审来源与固定交付。若尚未启动或受阻，请给具体动作／目标、原因、已完成范围、未完成项和恢复条件，区分未执行、拒绝、等待与结果不确定；不要只回写 running，也不要上传私有原流或凭据。此为原任务事实补充，不是新增任务或正文重做请求，具体旧拒绝保持停止、不换路绕过。通过既有 Git 交接返回，不要求用户转述。

## 宿主执行事实回应（2026-10-26）

固定反馈来源 `e8827e080c79170b530d3d970738c5e324316267`。确已启动：Claude Code＋DeepSeek 普通原生 Workflow，首次实际调用 2026-10-25T15:32:26.458Z 至 2026-10-25T16:00:19.363Z；原始父调用 assistant message.model = `deepseek-flash`，请求别名另记 deepseek-v4.1-flash[1m]，不据别名推断后端。完整初稿已形成作者源／运行表／对白语音与二改路线。宿主另取与实施上下文分离的只读 code-reviewer，发现 UE plural 语法、Yarn 运行键／人物／推进／缺语音接线及二改反例等必须修项，已沿原会话发起定向修订。

定向修订实际开始 2026-10-25T16:21:51.184Z，本次接续尚未收到完成回执；不是未启动、拒绝或待新授权，也不是最终交付。初稿、原始调用、阅读失败及独审发现均留本机；公开不上传私有原流、路径或凭据。当前公开状态仍 running，结果分支会在修订完成和同审差量复核后发布固定 SHA。回传延迟是先前未把实施／独审阶段同步到 Git，现按负责人要求补齐事实；没有重新发起初始任务、联通、引擎或额外审查树。

## 实施记录（2026-10-25）

- **状态：** `review_ready`；等待宿主另取与实施上下文分离的独立只读审查。实施者未把机械自查写成宿主独审，也未写独审回执。
- **结果分支：** `relay/b-localization-delivery-module-001`。实施阶段按任务禁止 commit／push；固定提交 SHA 由宿主发布时补。
- **实际通道：** 普通原生 Workflow。原流 assistant `message.model` 为 `deepseek-flash`（可能是 alias）；system／workflow_progress 报告 `deepseek-v4.1-flash[1m]`。alias 单列，不据请求名推断后端。
- **首版实现起点：** `domains/game-dev/04-client-modules.md#增加语言与推进对白` 的“首版”和“原生表与绑定”两节。作者源示例为 `content/ui.yaml`＋`content/dialogue/*.yarn`：2 个菜单键、2 个数量提示状态、2 位说话人 6 句，其中 3 句带可选 `en` 语音引用，3 句只有字幕。对白运行 ID 用完整 `line:` 形式（`#line:hangar_02_010` → `line:hangar_02_010`）；sidecar 按完整 ID 记 speaker；Yarn 接线用 YarnProject＋`UnityLocalisedLineProvider`＋`LinePresenter`／`VoiceOverPresenter`／`LineAdvancer`，缺当前语言语音回字幕。
- **二改实现起点：** 同段“第二次修改”与“交给 AI 的首版与二改任务单”。示例把目标值 3 改 2（`have=0/1/2` → `need=2/1/0`，HUD 仍按 `need>0`／`need==0` 选键，不把“一次至少补 2 支”当 HUD 键）、把 `line:hangar_02_030` 的 sidecar speaker 从 `navigator` 改为 `mechanic`、新增 `line:hangar_02_045` 未配音句，并给出译文／语音／字库／布局的回审矩阵和最小影响伪代码；语境回审与 stale 重录分开，`line:hangar_02_030` 首版无 clip，不要求重录。
- **revision-1 修订：** 按独立审查的 7 项差量修正 F1–F7：UE `|plural(one=...,other=...)` 括号内逗号；完整 `line:` 运行 ID 与脚本标签后缀分离；sidecar speaker 交给项目 Presenter 消费；`need>0`／`need==0` 选 HUD 键与 `have=0/1/2` 两语言预期；context 回审与 stale 重录分离；YarnProject／DialogueRunner／Provider／Presenters 正常组件配置与手动推进；文本／语音 locale／fallback 与 `AudioClip`／`IAssetProvider` 两路径。原 task-spec、原失败与未变证据保留；未新增研究专题或台账。
- **证据入口：** `docs/research/wp10-content.md#text-tables` 补 Unity Localization 1.5.13 与 UE 5.8 的文本表身份、CSV 导入、运行绑定和缺失项；`#yarn-line-delivery` 补 Yarn Spinner Unity 3.2.8 的完整 `line:` ID、文本表／资产表、官方 Unity Localisation 导入、DialogueRunner／LinePresenter／VoiceOverPresenter／LineAdvancer 接线、缺语音 fallback 与说话人二改。复用既有 `#37`、`#42`、`#43`、`#44`、`#92`、`#104`、`#105` 的结论与 assets/audio 入口；未改 assets/audio、05、WP6 或这些既有段落。
- **机械检查：** `python3 scripts/check_repo.py` 通过（384 个文件，0 错误）；`python3 scripts/check_public.py` 通过（645 个文件，0 命中）；`git diff --check` 通过；revision-1 修订后复跑同结果。未运行 commit 身份扫描（实施阶段无提交），提交身份待宿主发布时按手册§7执行；未运行完整离线入口、引擎、游戏、GUI、生成模型、付费翻译或配音。
- **读取失败：** 一次 `curl` 读取固定源码因本机 TLS 证书吊销检查失败；未使用 `--ssl-no-revoke`／`-k`／关闭证书等绕过，改用 WebFetch 读取同一官方页／固定源码。revision-1 期间 GitHub contents API 返回 403、两个 Unity 文档页被网络策略拦截，未绕过；改用固定提交的临时 clone 与官方 1.5 API／手册页核对。关键事实按读取内容核对，未做全站可用性检查。
- **分别报告：** 源码／官方说明已核；离线检查如上；文稿与最小伪代码为本轮产物；语言审校、真实引擎／字幕／配音、阅读时间、字体子集、布局和 TMS 采用均未执行。
- **待验：** 中文／英文意思、口吻与文化语境；Unity Localization 1.5.13／UE 5.8 实际导入与绑定；Yarn 3.2.8 真实对话推进、完整 `line:` ID 的文本／资产表命中、缺语音 fallback 与换说话人、sidecar speaker 到本地化名／头像的绑定；移动端／WebGL 异步加载；字库子集与换行；人工译文保留与二改队列；TMS 是否值得仍未比较。外部链接按读取时的官方页和固定源码核对，未做全站可用性检查。
- **范围：** 只改 04 的“增加语言与推进对白”段、wp10-content 的本地化／译文供给／对白证据段及本任务；未改 04 其他段、05、资产／WP6、共享 TASKS、其他任务或研究文件；未新增研究专题或评分证明台账。保留原段落、锚点和未变证据，只在指定段追加。

## 宿主独立核对与交付（2026-10-26）

原实现于 2026-10-25T16:00:19.363Z 完成，实施后宿主另取与实施上下文分离的只读 code-reviewer，按原需求和固定 Yarn／Unity／UE 源码核正常接线与二改。发现 UE 复数语法、完整运行 lineID、人物消费、数量状态、语音语境回审、推进输入与 fallback 七项问题。原会话修订于 2026-10-25T16:38:27.534Z 返回；同审差量指出最后三项接线缺口，宿主补齐六行人物映射与 Presenter 生命周期、实际 Space 输入、原生 Provider＋VoiceOverPresenter 和两语言 fallback 配置，同一 reviewer 复核后三项均关闭。WP10页首无关摘要恢复原样，仅保对应证据差量。

实际通道为 Claude Code＋DeepSeek 普通原生 Workflow；原始 assistant message.model 为 `deepseek-flash`，请求别名 `deepseek-v4.1-flash[1m]` 单列，不据别名推断后端。保留初稿、原始读取失败、独审发现与修订记录；实施者没有代写本宿主独审。

交付为菜单／数量提示／六句双人物对白的实现蓝图和第二次修改路径。语言意思与口吻、人审读听、真实导入／编译、切语与缺配音的场景行为均未验；本轮没有游戏／引擎／GUI／翻译或配音实验。只推指定 relay 分支，交 dot-B 接收，不代标 accepted。

固定结果提交：[a46b0f26b71ee8b35c5f73f2701cd688c69b6c69](https://github.com/dbvv1/a1dbv/commit/a46b0f26b71ee8b35c5f73f2701cd688c69b6c69)；结果仅在指定 relay 分支。发布检查：check_repo.py、公开文件及实际提交身份扫描、暂存差异检查通过；正文与独审结论见上。
