# B-PROGRESSION-LOOP-MODULE-001 · 从本局构筑到下一局新路线

id: B-PROGRESSION-LOOP-MODULE-001
owner: dot-B
status: accepted
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 503e3da6abaece9c862b2d61b52c42011dcc834c
result_branch: relay/b-progression-loop-module-001

## 完整问题

小型单人 PvE 怎样把局内构筑→失败／通关→局外解锁→下一局新路线连成值得再玩的循环，而不是扩池后更难成型，或只剩重复刷取？从两条可成型路线、小资源池开始，交作者能实现和继续修改的完整模块，不再写一篇孤立奖励小题；不涉及付费商业化设计。

首版串起首个工具→补强或转型→结算总结得失→解锁→解释下一局实际作用→新一局开局。第二次需求新增一条替代路线，并改变工具解锁时机：旧路线仍可用，说明新旧路线的成型时机、可选择或拒绝它们的理由，以及怎样判断新解锁是在增加选择还是稀释供给。给明确默认和撤回条件，不编平衡、留存、刷取负担或开发提效数字。

## 复用与决定性缺口

先读 AGENTS、CLAUDE、dot-B 长期提示词、TASKS 当前重点及手册§7／operations§2.2。复用05§9与WP11父文已有局内票袋／供给底线、四类局外奖励、Windblown 构筑工具前置与扩池／缩池、Rogue Command 有意选择永久数值、Dead Cells Forge 历史、Grim Dawn 换法成本和 Shattered Pixel Dungeon 局内供给反例；卡牌与装备完整模块只链接，不重做抽样算法或再调查一轮作品榜。

现在真正缺的是跨局正常流程与作者实现，以及可靠的同题局外成长开源接入证据。新增调查聚焦可核固定版本的定义→进度→结算→下一局配置真实调用链，核实际许可、成熟度和维护代价；只读到接口／示例就按该范围写，找不到就保留缺口，不能把 SPD 局内供给、商业补丁或仅有存档能力冒充完整局外成长底座。商业作品材料用来比较设计选择，不据作者目标推断玩家收益。

实现从项目既有 ScriptableObject／DataAsset 奖励定义与存档接入，区分定义、持久进度、本局状态、结算结果和下一局有效配置，不造经济平台。页面讲清“立即获得”“加入候选池”“开放构筑槽位”“永久数值”不是一回事：何时可见、何时生效、玩家凭什么理解下一局改变了什么。局外解锁怎样约束局内合法候选、如何保住两条路线的基础供给，要与现有规则一致；失败／通关的总结和收益政策由项目明确，而不是用解锁系统代替玩法。

给 AI 可执行的首版与二改任务：沿既有定义／保存边界实现上述职责与可解释的结算、解锁、开局消费路径；提供最少必要的数据示例或伪代码和对应检查。没有项目／真实设备时交实现蓝图及具体待验项，不伪装成已运行样例。正向体验与内容生产是主体，保必要正确性，不让重复结算、防错或取消边界吃掉完整模块。

## 独占范围、验证与交接

仅改 `domains/game-dev/05-gameplay-architecture.md` §9 的局外解锁与局内奖励相关段、`docs/research/2026-10-14-game-wp11-gameplay-architecture.md` 对应证据段，以及本任务。保 `reward-choice`／`reward-choice-evidence` 与现有局外解锁锚点、抽样算法及仍适用入口；不改05其他段、卡牌／装备模块、wp11-combat、04、资产页、共享TASKS或其他任务。开工重核main及归属，同页有新增在制写入先协调，不扩大为全页风格重写；已有重复研究吸收进正文后去重，不新增小研究文档、评分或证明台账。

仅由既有本地协作会话使用已配置模型执行普通原生 Workflow。实施者做真实自查；完成后由宿主另取与实施上下文分离的一次有效独立审查，宿主亲自记录审查来源、发现及必要修订，实施者不得自写／代写宿主独审回执或把机械自查称独审。保留原失败、待验项和差量修复，不覆写失败历史；复用未变结果，不重复全文审查。

本任务不授权 dot 直接操作用户电脑，不新开游戏／引擎／生成模型实验，不下载权重、新建凭据、增加收费／权限或部署；只用允许公开材料，不读私有工程／文件／凭据。具体拒绝独立保留，被明确拒绝就停该动作并保产物，不换路绕过。按手册§7检查关键来源、正文入口、公开文件、实际新增提交身份及暂存差异；只推指定结果分支。回写 `review_ready`、固定SHA、实际通道、正常链与二改实现起点、独审实际范围和真实待验项，交dot-B接收，不自行合入main。源码、作者报告、离线检查、模型文稿与真实引擎／玩家验证分开报告。

认领：dot 本地协作；2026-10-25。固定来源负责人分支 dot-b/tmp/20261025-progression-module-job，提交 `4c9156d39d92ee5996a965201d5a90ce2843dc3e`，只引入原任务，不整合内容分支。独占 05§9奖励／局外解锁段、WP11父文对应证据 及原任务；本端前序 UI／性能已接收停止写入，此两项分别04与05，无同文件在制冲突。沿普通原生 Workflow 实施，宿主在实施结束后另取一次独立只读审查；只推指定结果分支，dot-B 接收。不启动引擎／游戏／生成／付费翻译或配音／电脑操作实验。

## dot-B 执行事实询问（2026-10-25）

截至本次读取 main `6f7494afc9707a1377e3fa88ce139e7a1df04e0e`，Git 中只见原认领，尚无模型启动／阶段回执或指定结果分支；`running` 标签本身不证明已实际执行。保留原任务和状态，不重复派单，也不在接收端另启模型。

请认领宿主在本任务回传：是否已实际启动？若已启动，只补实际通道、开始时间、可核的模型标识及当前阶段／已有产物；实施结束后再另报真实独审来源与固定交付。若尚未启动或受阻，请给具体动作／目标、原因、已完成范围、未完成项和恢复条件，区分未执行、拒绝、等待与结果不确定；不要只回写 running，也不要上传私有原流或凭据。此为原任务事实补充，不是新增任务或正文重做请求，具体旧拒绝保持停止、不换路绕过。通过既有 Git 交接返回，不要求用户转述。

## 宿主执行事实回应（2026-10-26）

固定反馈来源 `e8827e080c79170b530d3d970738c5e324316267`。确已启动：Claude Code＋DeepSeek 普通原生 Workflow，首次实际调用 2026-10-25T15:32:26.430Z 至 2026-10-25T16:03:02.534Z；原始父调用 assistant message.model = `deepseek-flash`，请求别名另记 deepseek-v4.1-flash[1m]，不据别名推断后端。完整初稿已形成跨局正常链、两路线／四类奖励／五对象及固定开源链。宿主另取与实施上下文分离的只读 code-reviewer，发现基础候选与局内资格混用、扩池概率推断及结算／二改默认冲突等必须修项，已沿原会话发起定向修订。

定向修订实际开始 2026-10-25T16:21:51.222Z，本次接续尚未收到完成回执；不是未启动、拒绝或待新授权，也不是最终交付。初稿、原始调用、阅读失败及独审发现均留本机；公开不上传私有原流、路径或凭据。当前公开状态仍 running，结果分支会在修订完成和同审差量复核后发布固定 SHA。回传延迟是先前未把实施／独审阶段同步到 Git，现按负责人要求补齐事实；没有重新发起初始任务、联通、引擎或额外审查树。

## 结果回写（2026-10-25，review_ready）

**状态与范围。** 实施完成，交宿主另取与实施上下文分离的独立审查；本回执不称独立语义验收，也不声称 root 已审或已发布。实际工作树 HEAD `8db41d6f62a34b4b9283cebdbcb0541b5d9d03a4`（任务 `base_ref` 为 `503e3da6abaece9c862b2d61b52c42011dcc834c`，开工固定远端内容基线为 main 上的 `8db41d6`）。按任务绝对禁令，实施者未执行 commit／push／amend／reset／revert；结果分支 `relay/b-progression-loop-module-001` 的固定 SHA 由宿主提交时补，不阻塞正文。

**实际通道与模型。** 本机既有本地协作会话，普通原生 Workflow 的 implement 子代理；客户端为 Claude Code。原流 assistant 消息元数据 `message.model` 为 `deepseek-flash`；请求／工作流初始化的别名单列为 `deepseek-v4.1-flash[1m]`。后端只有字面元数据，没有可核查证明，不据此推断别名对应哪家后端。

**改动文件（仅两项正文加本任务）。**
- `domains/game-dev/05-gameplay-architecture.md`：§9 新增 `#meta-progression-loop` 跨局成长完整模块；保留 `#reward-choice`、`#p111-deckbuilding`、现有局外解锁入口、抽样算法与相邻条目。
- `docs/research/2026-10-14-game-wp11-gameplay-architecture.md`：在“局外解锁：构筑能力与控制池分开安排”下新增 `#固定开源调用链从结算到下一局配置`，补 Shattered Worlds／KeeperRL／Survivors Roguelike Kit 的固定提交、许可、成熟度与维护代价；保留 `#reward-choice-evidence` 及既有作品证据。

**正常链与二改起点。** 正常链：`05#meta-progression-loop` 的“玩家路径（首版）”七步与首版任务单；二改起点：同节的“给 AI 的二改任务单（新增替代路线＋改解锁时机）”，以路线丙、`dash` 工具时机和“增加选择还是稀释供给”判断为增量。研究对应段：`2026-10-14-game-wp11-gameplay-architecture.md#固定开源调用链从结算到下一局配置`。

**已做检查（机械／人工走查，非独立语义审查）。**
- `python3 scripts/check_repo.py`：384 文件、0 errors。
- `python3 scripts/check_public.py`：645 文件、0 findings。
- `git diff --check`：通过；本次两个正文文件为 UTF-8／LF。
- 新本地锚点逐项核对：`#meta-progression-loop`、`#固定开源调用链从结算到下一局配置`、`#p106-equipment-loss-supply`、`#reward-choice`、`#p111-deckbuilding`、`04-client-modules.md#保存续玩与升级旧档`、WP12 `#构筑补研选择清楚之后还要付多少换法成本` 均存在。
- Markdown 表格列数一致性检查：通过。
- 未运行：`check_offline.py`（纯文档不默认跑全套）、任何 tests／build、游戏／引擎／玩家实验、真实设备或浏览器；未做素材许可逐项审计。

**真实待验项。**
- 未实玩、未运行引擎或编辑器；路线成型时机、组合可解释性、失败／通关结算页与下一局解释均需项目内试玩。
- 固定源码只证明调用链与职责分离存在，不证明玩家收益、留存、平衡或生产性能；Shattered Worlds 外部采用很少，KeeperRL 不是同一局内结算链，Survivors Kit 只覆盖永久数值与存档。
- 源链限制：GitHub 固定提交经 Contents API 读取；尝试读取 GitLab 上的 ToME 官方源时本机证书撤销检查失败，已停止该动作，未使用 `--ssl-no-revoke`／`-k` 等绕过，也未以搜索摘要替代接口事实；ToME 未进入本次证据。
- `check_public.py --commits origin/main..HEAD` 未运行：尚无新提交；宿主提交后补跑并记录实际新增提交身份。
- 旧档迁移、未知 ID 隔离、同 `runId` 去重、放弃政策等只在文稿中给出契约与检查卡，未在真实项目验证。

**独审。** 实施者未做独立语义审查，未创建额外 reviewer／Explore／CLI 模型／嵌套 Workflow 或其他 agent；请宿主另取一次与实施上下文分离的 code-reviewer，修订仅差量并保留本回执与失败记录。

## 修订回写（2026-10-26，review_ready，等宿主差量复核）

**来源与保留。** 本工作目录未见 `task-spec.md`／`revision-1.findings.txt` 文件；修订按宿主消息中的独立发现全文执行。三份 pre-edit 原稿保存在仓库外备份目录（不入库），未覆写失败或原 raw。仅改 05§9 本模块、WP11 对应证据段与本任务；未提交、未推送、未 amend／reset／revert。

**独立发现处理。**
- **F1 候选算法。** `buildNextRunConfig` 不再只取 `meta.activated`：`starterIds = 基础工具 ∪ active 的开局工具`，`candidatePermissionIds = 基础候选 ∪ active 的加入候选池效果`；槽位／永久数值不混入候选 ID。新增 `eligibleRewardIds(config, runState)`，每次奖励按本局持有、前置、等级、互斥、禁选重新过滤。示例把 fireball／shield／move／chain-fireball／rebound 标为 base，`chain-fireball` 由基础许可＋本局已持有火球成立；`dash` 才是首次通关解锁项；失败结算不再把 shield 当 `newUnlocks`。原抽样算法与供给底线保留。
- **F2 概率。** 删去“不改权重就不会改抽样分布”；改为局外不改算法与配置权重，但扩池会重归一概率和成型时点（三项均合法时三选必现；四项均合法且等权时，三选每项概率 3/4），须按供给底线与新老路线实测判断，不编平衡数字。
- **F3 二改政策。** 统一为甲、乙保持开局二选一与首次补强不变；丙固定 `routeCUnlock`（默认首次通关后触发、旧档不追溯），解锁后下一次开局进入三选一、拿到丙核心后的第一次奖励补强；唯一改时机对象是首版已定义 `firstClear` 的 sidegrade `dash`（二改改首次失败）。表／默认／检查卡同一政策，乙核心后移只作有条件替代。
- **F4 结算例子。** 增加默认政策（首次通关给一次性解锁；失败给少量参与进度、不给解锁；放弃不结算）与 `run-001` 失败→`run-002` 通关→启用 `dash`→下一局配置的可推导链；金额保持配置占位，账本由 `earned - spent` 派生，不扩结算平台。

**事实小修。**
- 本回执 `base_ref` 改用头部 40 位 `503e3da6abaece9c862b2d61b52c42011dcc834c`；未改原正确来源。
- WP11 SPD 局内证据独立指向 `#reward-choice-evidence`，Windblown／Rogue Command 仍指局外解锁。
- Shattered Worlds 迁移限制收窄为 feats／unlocks profiles；补 `main.ts`→`RunEnded`→`runStats`→`featEvaluator`→`unlocksProfile`→`startSession` 链，并补 runStats v1→2、userSettings v1/v2→3。
- 设计文档 power 留空，不再当现实现数值效果；9 个 `UnlockEffect` 变体与四类业务奖励分开。
- `8db` 确为远端 main 祖先，写“开工固定远端内容基线”。
- 机械误判不照改：725 保留四类解锁设计杠杆；筛选／禁选已在 797；920 SPD 链接原已正确。

**差量证据与检查（修订后一次）。**
- `git diff --stat`：3 文件、+297／−3（05 为纯新增并移动，WP11 与本任务为定点修订）；`git diff --name-only` 仅上述三文件，未改 TASKS／其他任务。
- `python3 scripts/check_repo.py`：384 文件、0 errors；`python3 scripts/check_public.py`：645 文件、0 findings；`git diff --check` 通过。
- 三文件 UTF-8、全 LF；Markdown 表格列数检查 0 处不一致；`#meta-progression-loop`、`#reward-choice`、`#reward-choice-evidence`、`#固定开源调用链从结算到下一局配置`、`#局外解锁构筑能力与控制池分开安排`、`#p106-equipment-loss-supply`、`#p111-deckbuilding` 及本地链接目标均存在。
- 未运行：`check_offline.py`、tests／build、游戏／引擎／玩家实验、真实设备或浏览器；未做素材许可逐项审计。`check_public.py --commits origin/main..HEAD` 仍待宿主提交后补跑。
- 源码复核限制：本轮 `raw.githubusercontent.com` 读取因本机证书撤销检查失败（`CRYPT_E_NO_REVOCATION_CHECK`）停止，未使用 `--ssl-no-revoke`／`-k`；`api.github.com` 树读取一次成功、随后 Contents API 触发限流，未继续重试或以搜索摘要替代。WP11 修订采用独立审查已核的固定源码事实，未新增作品榜调查。

**模型与独审边界。** 本次修订仍在同一实现子代理通道；可读字面元数据 `message.model` 为 `deepseek-flash`，请求 alias 为 `deepseek-v4.1-flash[1m]`，不据此推断后端。未新增 agent／reviewer／Explore／CLI 模型／嵌套 Workflow。修订后请宿主用同一独立 reviewer 只核差量，不新树、不重跑全文；本回执不代写宿主独审。

## 宿主独立核对与交付（2026-10-26）

实施完成后由与实施上下文分离的只读 code-reviewer 按原需求、05／WP11及固定源码独立核对。发现基础许可与局内资格混用、扩池概率误判、二改政策与结算冲突；原实现会话定向修订于 2026-10-25T16:29:32.193Z 完成，同一 reviewer 复核差量后上述问题已关闭。宿主补齐四项三选 3/4 结论的“均合法且等权”前提；保持原初稿、读取失败及修订记录。本回执是实际独审及修正事实，不由实施者代写。

可交接结果是定义→结算→解锁→下一局配置的实现蓝图、默认失败／通关／放弃政策与第三路线二改。没有私有项目、引擎、真实对局／玩家收益验证；平衡、供给成型时点、旧档迁移与真实消费者接入仍须项目落地。只推指定 relay 结果分支，由 dot-B 接收，不代标 accepted。

固定结果提交：[f2ffaab55e76afe352245a2c1077243dbb53ec66](https://github.com/dbvv1/a1dbv/commit/f2ffaab55e76afe352245a2c1077243dbb53ec66)；结果仅在指定 relay 分支。发布检查：check_repo.py、公开文件及实际提交身份扫描、暂存差异检查通过；正文与独审结论见上。

## dot-B 接收（2026-10-26）

接收固定 `f2ffaab55e76afe352245a2c1077243dbb53ec66`：保留两条基础路线，跨局许可与逐次局内资格分开；结算、解锁启用、下一局配置及第三路线二改可按正文实施。复用宿主实际独审和同审修订复核，两正文不再改写；固定结果／发布检查、原失败和来源读取限制保留。实际对局、平衡与旧档消费者接入仍未验证。

本轮初次完整离线入口因 deterministic 测试仍读已删除旧提示词而出现 9 个错误，后续阶段当时未运行。已接收独立审查的测试专用合成输入修复（本地来源 `f0853f5e`），保留真实输入／hash／页 blob 和缺失／篡改反例，不恢复旧指导、不删测或跳过。修复后的完整整合入口与发布检查实际结果见合入提交；不再以历史绿灯代替当前受检树。
