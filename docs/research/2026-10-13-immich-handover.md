主线：三、四
改变的建议：18/24：接收意见、补丁与最终说明对齐；18补接管投入、学习、原条件及实际宿主验收、新旧库交付、原生产物兼容、身份与逻辑数据集核对；导出器修复与重做受影响旧产物、接管发行与源码维护分开；持久化绕过前核原故障阶段与实际参数
新证据：Immich审查/恢复、接管/学习实验、CBM宿主/原条件回执、PocketBase迁移、Rollup加载、Syncthing/Tailscale接替；10-16补Paperless导出串档修复、MinIO发行接管；Anaconda解释与补丁对齐且smoke成功，仍因原故障证据不支持而撤回，AI归属仅为怀疑；10-17（UTC+8）补PSScriptAnalyzer的独立接收者复测与两项续改合入fork

# AI 辅助代码的接收与后续修改：Immich 与接管实验

调查：2026-10-13（UTC+8）；历史事件日期按原帖记录。历史案例发生于 2026-02 至 2026-04；不作为当前模型能力或生产力排名。只读 GitHub 原帖、审查、提交 diff、固定源码与 CI 元数据，未运行 Flutter、未接触真实照片或设备。

## 可以改变的建议

交接不仅要解释“改了什么”，还要把接收方的意见、实际采用的补丁和最终行为对齐。优先更新已有 PR 的最终说明，而非增加一套长模板。尤其是审查回复后来被代码推翻时，应写清最后采用的接口和支持边界。

## 证据链

1. **用户症状与环境（2026-02-06）**：[原报告](https://github.com/immich-app/immich/pull/16732#issuecomment-3860567899)称服务器和 Android 客户端均为 2.5.3：Web 删除并清空回收站后，下次客户端同步又上传照片，即使开启 Sync remote deletions。它是报告者的环境陈述，不是我们复现。
2. **复现与 PR（2026-02-09）**：[Issue #26069](https://github.com/immich-app/immich/issues/26069)列出备份开启、相册被选入备份、远端删除同步开启等条件；该 issue 当天被机器人按 duplicate 关闭，不是合并修复的证明。[PR #26070](https://github.com/immich-app/immich/pull/26070)解释原路径依赖远端回收站状态，立即清空会错过本地入回收站，因此加入永久删除事件处理。
3. **第一轮接收意见（2026-02-12）**：接收方 shenlong-tanwen 要求移除仓库查询通用 helper、暂将循环留在具体方法内，同时对不读取结果的 join 设置 useColumns: false。[审查](https://github.com/immich-app/immich/pull/26070#discussion_r2798278350)。GitHub API 的 author_association 为 MEMBER，后来也是合并者。
4. **可对照的落实（2026-02-13）**：[c552e0fad450110306bfd3e499f1fa481a44d610](https://github.com/immich-app/immich/commit/c552e0fad450110306bfd3e499f1fa481a44d610)确实移除 _getAssetsFromBackupAlbumsByStringKeys，把分批循环放回两个查询方法，并在相应 join 上设 useColumns: false。作者随后[回复 done](https://github.com/immich-app/immich/pull/26070#discussion_r2804060117)。因此不是只有口头承诺。
5. **第二轮与旧解释过期（2026-02-15 至 02-23）**：接收方[询问](https://github.com/immich-app/immich/pull/26070#discussion_r2809697733)普通 trash 事件能否也使用 assetId 和新方法。作者 02-16 [回复](https://github.com/immich-app/immich/pull/26070#discussion_r2812046469)倾向保留两方法，理由是仍按 checksum 匹配且额外 join 更重。但 02-23 的 [ef83e58112a0361a34b5055111d433388e44215c](https://github.com/immich-app/immich/commit/ef83e58112a0361a34b5055111d433388e44215c)最终统一为 remoteIds，将双方法收敛为单一方法并删去旧处理入口，测试期望也从 checksum 改成 remote ID。公开记录没有说明为什么改变取舍；不能把 02-16 的回复当最终设计，也不能编造内部说服过程。
6. **批准、合并与最终产物**：02-27 [批准](https://github.com/immich-app/immich/pull/26070#pullrequestreview-3868344479)针对最终 head fe5c431f7e84b3faca4d8f1c77ec73fb3a74fda1。04-27 21:16:49（UTC+8） 由 shenlong-tanwen 合并为 [5a457d72c97ee25704f5af460ca9d91f90b91e0c](https://github.com/immich-app/immich/commit/5a457d72c97ee25704f5af460ca9d91f90b91e0c)。合并 diff 保留两轮实际改动。批准到合并的日历间隔不是审查工时，原因未知。

## 接管者需要知道的最终行为

[固定实现](https://github.com/immich-app/immich/blob/5a457d72c97ee25704f5af460ca9d91f90b91e0c/mobile/lib/domain/services/sync_stream.service.dart)：普通 trash 事件与永久删除事件共用 _handleRemoteDeleted，输入 remote ID；永久删除先查询并处理本地候选，再删除本地远端资产记录。操作受 Android、manageLocalMediaAndroid 开关和 MANAGE_MEDIA 权限限制，作用是将匹配的本地资产移入设备回收站，并非无条件永久删除所有本地照片。

[固定查询](https://github.com/immich-app/immich/blob/5a457d72c97ee25704f5af460ca9d91f90b91e0c/mobile/lib/infrastructure/repositories/local_asset.repository.dart)：remote ID 是查找输入，但 local/remote 关联仍经 checksum join；只取 backupSelection.selected 的相册。这两个概念不能在交接时混成“匹配方式已改为本地 remoteId 字段”。

## 验证与归因边界

- AI 使用的直接证据是 PR 作者自述：GPT-5.3 Codex 帮助核对 SQL 并辅助写测试。没有公开完整会话，不能称整份 PR 或两轮审查修订均由 Codex 独立完成。
- 最终 head 的 [Mobile unit](https://github.com/immich-app/immich/actions/runs/22313397484/job/64551443967) 和 [Dart analysis](https://github.com/immich-app/immich/actions/runs/22313397514/job/64551440195) 成功；合并 SHA 的 [Mobile unit](https://github.com/immich-app/immich/actions/runs/24997301940/job/73197580831) 和 [Dart analysis](https://github.com/immich-app/immich/actions/runs/24997301922/job/73197573200) 亦成功。这是 GitHub 检查结果，不是本次独立运行。
- 合并 SHA 共返回 55 个 check runs，其中 [Build and sign iOS](https://github.com/immich-app/immich/actions/runs/24997301890/job/73197570610) 和 [prebuild](https://github.com/immich-app/immich/actions/runs/24997306329/job/73197549741) 为 failure。未取得失败步骤，不能写“合并全绿”，也不能把它们归因为本补丁。若只需要说明接收闭环，不必进一步挖尚未确定相关性的构建日志。
- [固定测试](https://github.com/immich-app/immich/blob/5a457d72c97ee25704f5af460ca9d91f90b91e0c/mobile/test/domain/services/sync_stream_service_test.dart#L395-L502)证明接口参数和调用变化，但新增永久删除用例将仓库返回值 mock 为空，只验证 remote ID 查询发生、数据库删除继续进行、不调用设备移入回收站。它本身不证明真实 Android 上“不再重传”的完整路径，也不证明真实 SQL join 成功。
- PR 有人工复测步骤说明，但缺指定设备复测记录、真实用户修复后反馈和支持工时。已完成的是公开的 issue→人工审查→对应补丁→批准→合并/检查链，尚不能宣称长期接管成本已降低。

## 候选筛除记录

- Immich #23819：有明确 GPT-5 Codex High 辅助披露且已合并，但读取评论只有赞许/批准，未见接收方要求导致的具体修订；不满足本题主链。
- Immich #24914：有 GPT-5.2 Codex 初稿披露和维护者 let→const 建议，但过于局部，难改变交付或接管建议；不选作主例。
- Immich #27774：网页显示 Codex 使用声明，但仍等待 code owner 审查，未取得接收修订闭环；不选。
- Mermaid #7795：读取到 Claude Sonnet 4.6 co-author 和 lexer/build 修复，但这些提交本身不能证明由接收维护者意见驱动；本轮不继续作为主例。
- voidmatcha/e2e-skills：读取 README 所列上游 PR 仅作线索，未据其成功清单推断模型归属或审查成本。

下一条更有价值的证据是：不同项目中接管者完成第二次变更/恢复，或出现修复后的真实用户复测。继续挖本例同一条历史 CI 不会自动补上这项缺口。

## 补充证据：接管后实际修改的受控实验

核实：2026-10-13。[Echoes of AI（期刊全文）](https://link.springer.com/article/10.1007/s10664-026-10889-1)的第二阶段随机分配另一位作者通过验收的代码，接管者不用AI再加功能；225名获分配者中75名提交有效结果，不能把两阶段总人数151写成本阶段样本。任务是在约2千行的Java/Spring Boot菜谱应用中，沿前人完成的时间筛选再加每份成本筛选。第一阶段是否用AI按既有偏好分组，不能据此把最初提速写成随机因果结果。**[研究：原文，§3、§4、附录A]**

第二阶段AI来源代码与对照的耗时中位数为136和173分钟，差异不显著（p=.56）；针对首位作者惯常使用AI的贝叶斯估计为−12.59%，95%可信区间[−45.77%, +32.68%]且受先验影响，不等于两者等效。CodeHealth与覆盖率的总体频率学派比较也未显著，不能把这些指标当完整语义正确性。耗时起初按取得仓库至提交计算，中断者大量改用自报投入估计，并非全程客观工时。**[研究：原文，§3.2、§4.2–4.3]**

试验使用2024年底工具，主要是专业开发者，任务较小、完成者有选择性且质量目标理解不同；不代表当前自主Agent或长期生产维护。它支持直接观察下一次修改，而非凭AI来源判断接管成本；尚未证明补解释或接管试点会改善结果，也不补足上文Immich的真实复测与支持工时。**[研究：原文，§6；经验：采用边界]**

### 公开数据复算：计时分母与来源

核实：2026-10-14 UTC。[固定公开数据](https://github.com/codescene-research/echoes-of-ai-emse-2025/tree/472ebca6d20af5d6de4264897ba98220ce521fd0/data)采用 MIT 许可；[标准库脚本及最小数值 fixture](../../experiments/echoes-timing-check.py)内嵌75行，不保留ID、人口信息或自由文本，固定源提交、CSV blob及SHA256，完整许可随脚本保存。[聚合输出](../../experiments/echoes-timing-results.json)可离线复算。**[一手：公开数据与方法；经验：本轮算术复核]**

按作者规则，有估时即使用估时，否则仅保留不超过57600秒的记录计时，输出时转为分钟；原始与预处理有效记录的时间字段、重算的clean_time均一致。AI来源／对照各40／35份有效提交，计时实际纳入39／33人，中位136.067／172.633分钟；其中估时18／15人，中位195／240分钟，记录计时21／18人，中位105.450／105.125分钟。分层只是描述性敏感性，不是随机比较，不能据此改称某组更快或撤回原文未显著结论；没有重跑统计检验、贝叶斯模型或开发任务。**[经验：复算；研究：解释边界]**

原预处理CSV共1001条记录，含925条全空和1条无ID／treatment但有33秒计时的记录；作者按treatment筛选后仅75条，不能直接整列计数。另核对task1的successors／unresponsives／incompletes合计230，与论文225位分配者不一致，缺逐人分配记录，不计算分组完成率；76份前作对应75个作者ID，其中一人两份前作的4位接管者共用同一predecessor值，不能据此无歧义计算每份前作等权结果。**[一手：数据与论文；经验：对账；研究：未解决边界]**

脚本普通／`-O`模式各15项显式检查通过，覆盖缺失、畸形、非法数值及预处理不一致；不依赖可被优化跳过的assert，不新增全仓检查入口。本轮只补计时分母、来源与可复查性，不证明交接试点本身有收益。**[经验：本轮验证]**

## 补充证据：陌生模块学习与下一次修改

核实：2026-10-13。将18 §8原有的“解释后再写代码”具体化为一个相关小变更及其测试。以学习为目标时可试用，允许查文档、卡住求助，并观察正确性、提示和投入；不要求所有日常交付都练习，也不主张全面停用 AI。**[经验：试用判断]**

[How AI Impacts Skill Formation](https://arxiv.org/html/2601.20245v1)随机分配52名有Python经验、未用过Trio的开发者是否获得GPT-4o聊天帮助；两项任务后，AI组无AI测验总分较低（d=.738，p=.010），完成时间差异不显著。测验包含概念、读代码与诊断错误，明确排除代码编写，不能当成实际完成下一次修改的结果。解释相关的高分使用方式是事后小组（n=2、3、7），并未随机分配；解释阅读与提问也占用时间，因此不能据此宣称“要求解释”能因果改善学习或免费获得能力。这是短时陌生库学习，不是长期维护。**[研究：原文，§4–7]**

[CHI 2023初学者实验](https://arxiv.org/html/2302.07427v2)按配对随机分配Codex权限，90名参与者中69名完成，年龄10–17岁、无文本编程经验；45组代码编写→修改练习中，仅编写阶段可用AI，修改从已验收的可运行代码开始；跳过编写者获提供正确代码，修改时可查文档并获人工反馈。AI组与对照组的修改正确性为66.2%对58.4%（p=.202）；一周后测验同样提供起始代码，但无AI、文档或反馈；修改正确性为47.5%对34.8%（p=.092），测验耗时相近。它提供AI辅助编写未必妨碍随后手动修改的具体反例，但不显著不等于等效，两组都练习修改，不能分离练习本身的效果；儿童入门课程也不能外推为职业开发者的生产维护收益。**[研究：原文，§4–7]**

两项研究分别涉及陌生库测验与真实手动编辑，不能拼成“先问解释、再做一次修改就能长期掌握”的因果链。本次只建议用一个可运行的小变更观察当次学习是否可用；练习本身的净收益、最优频率及长期迁移仍待验证。未开展新真人实验或生产变更。**[经验：采用边界]**

## 补充证据：原用户恢复原触发条件后升级成功

核实：2026-10-14（UTC+8）。**采用判断：升级失败后，先记录临时绕过，再请原接收者在安全可控的原触发条件下重试修订版；不要将环境已改变的成功当作产品修复。** 本例为 [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp)，只采用安装恢复链，不评价其检索收益。**[经验：交接建议]**

1. **原失败与临时绕过。** [#1535](https://github.com/DeusData/codebase-memory-mcp/issues/1535) 的 shochdoerfer 报告 WSL2／Ubuntu 24.04、Linux x64，从 0.8.1 经安装脚本升级到 0.10.0 时失败；清掉缓存仍无效。另一贡献者[定位到目录权限检查](https://github.com/DeusData/codebase-memory-mcp/issues/1535#issuecomment-5250182071)后，原用户[移除安装目录祖先的组写位，安装成功](https://github.com/DeusData/codebase-memory-mcp/issues/1535#issuecomment-5250286016)。这一步只验证绕过，不是发布修复。**[社区：原用户与贡献者运行报告]**
2. **修订与同人重试。** 维护者[明确选择](https://github.com/DeusData/codebase-memory-mcp/issues/1535#issuecomment-5251984180)将组可写祖先从阻断改为警告，并保留安装叶目录限制；[补丁 8eabe191](https://github.com/DeusData/codebase-memory-mcp/commit/8eabe191d2b45d6a58738392a03235c240af6996)进入 [v0.10.2](https://github.com/DeusData/codebase-memory-mcp/releases/tag/v0.10.2)。同一用户随后[把祖先目录恢复为 0775](https://github.com/DeusData/codebase-memory-mcp/issues/1535#issuecomment-5256998408)，收到具名警告，并确认安装完成、正在运行 0.10.2。成立的是原用户恢复触发条件后的安装／版本运行结果，不是因 issue 关闭而推定修好。**[一手：固定补丁与发布；社区：原用户复测]**

**AI 归属只到相关开发过程。** 引入协调／安装事务的 [PR #1139](https://github.com/DeusData/codebase-memory-mcp/pull/1139)有维护者账号发布的 [Handoff to Claude](https://github.com/DeusData/codebase-memory-mcp/pull/1139#issuecomment-5017316366)，明确记录 Codex 环境中的开发与待接续工作；这是公开的 AI 协作过程证据，不是精确故障行或最终修复的生成归属。初始事务提交 [0e00ef57](https://github.com/DeusData/codebase-memory-mcp/commit/0e00ef5702d4a67b6fed667cf66800a5a0fc75f1)为该 PR 合并提交 dc7178c8 的祖先，也为 v0.10.0 的祖先；GitHub compare 核对两者均 behind_by=0。没有完整模型轨迹，不据此判断 AI 导致该故障或节省了多少支持工时。**[一手：公开开发记录与提交关系；研究：归属边界]**

**不能把恢复结论写成“放宽权限仍同样安全”。** [固定源码 L769–778](https://github.com/DeusData/codebase-memory-mcp/blob/8eabe191d2b45d6a58738392a03235c240af6996/src/cli/activation_transaction.c#L769-L778)要求祖先为 root／当前用户所有的目录；普通 world-write 被拒，但保留 root-owned sticky 目录例外。组可写祖先获警告并允许，是维护者改变信任条件，不是本仓库证明其等价安全。[叶目录检查 L853–889](https://github.com/DeusData/codebase-memory-mcp/blob/8eabe191d2b45d6a58738392a03235c240af6996/src/cli/activation_transaction.c#L853-L889)仍要求当前用户所有、无组／其他写位、通过额外 ACL 检查；诊断补明目录、模式和拒绝规则。采用的是可定位的错误与责任明确的修订，不建议接收者为跑通安装自行放宽权限。**[一手：固定源码；研究：安全边界，非安全审计]**

**验证与反证。** [固定测试 L615–669](https://github.com/DeusData/codebase-memory-mcp/blob/8eabe191d2b45d6a58738392a03235c240af6996/tests/test_activation_transaction.c#L615-L669)分别检查组可写叶目录拒绝时包含目录／模式／规则，以及组可写祖先下可暂存候选；只读测试，不是本次运行。GitHub compare 确认 8eabe191 为 v0.10.2 祖先（ahead_by=5、behind_by=0）。相邻 [#1526](https://github.com/DeusData/codebase-memory-mcp/discussions/1526)另有安装后客户端配置错误，后续 0.10.3 还修订守护进程的同类检查，因此不能把 #1535 的成功外推为所有集成已恢复。本轮还筛过 #472 的构建后安装报告与 #1722 的符号链接安装报告，未取得同样完整的发布后原用户重试链，不采用。全程只读公开材料，未安装或运行 CBM／模型，未核验上游全套 CI，未测长期维护投入。**[一手：源码与提交关系；社区：相邻故障；研究：验证范围]**


### 接收入口增量：同机终端成功仍未验收桌面宿主

核实：2026-10-16（UTC+8）。**改变18 §7的最小验收入口：接收者通过桌面宿主使用时，记录宿主包装与权限上下文，并从该入口重试；终端成功不能替代集成成功。** 这是同一CBM项目的另一接收链，不把原WSL2安装恢复外推到Windows。**[研究：采用判断]**

[cillvius于8月13日报告](https://github.com/DeusData/codebase-memory-mcp/issues/1582#issuecomment-5286217664)：Windows 11 26200、Claude Desktop MSIX、CBM 0.10.3、普通用户；同一exe／同一用户从终端可创建端点并响应`initialize`，宿主启动的五次记录则在创建命名管道前退出。他报告未见相关Win32 `ACCESS_DENIED`，将差异定位到应用对宿主上下文的安全检查。[同一人8月17日回执](https://github.com/DeusData/codebase-memory-mcp/issues/1582#issuecomment-5318894375)称升级0.10.6后Claude Desktop正常连接。这里采用其对照与恢复自报；没有逐字终端启动命令，评论链接的脱敏Procmon gist本轮抓取失败，不能声称独立审核原始轨迹。**[社区：同一接收者前后报告；研究：核查边界]**

相关[固定补丁9a53074c3956a05e8695159f8bdded62d3e725f3](https://github.com/DeusData/codebase-memory-mcp/commit/9a53074c3956a05e8695159f8bdded62d3e725f3)在`src/daemon/ipc.c`仅当`ancestor=true`时容忍AppContainer package／capability SID，最终runtime目录仍传`false`。这是维护者对特定祖先身份的信任调整，不是建议接收者删掉宿主ACL，也不证明调整后安全等价。同补丁的`tests/test_windows_bundle_contract.sh`检查源码中保留这两条边界；它是源码契约检查，不是Windows／MSIX运行测试，本轮亦未执行。[提交比较](https://github.com/DeusData/codebase-memory-mcp/compare/9a53074c3956a05e8695159f8bdded62d3e725f3...v0.10.6)返回`ahead_by=92`、`behind_by=0`，证明补丁在该版本祖先链中；其间多项变更，不能把接收者的恢复单独归因于此补丁。**[一手：固定源码、测试与提交关系；研究：因果和安全边界]**

上文PR #1139的公开AI交接只说明相关项目开发背景，不证明本次故障或补丁由AI生成。最小交付增量是实际宿主入口及其已验范围，不增加全平台矩阵；本轮未安装或运行CBM、Windows或模型，未测主动工时、长期可靠性或AI净收益。**[研究：归属与验证范围]**

## 补充证据：结构快照不能代替已有数据的升级交接

核实：2026-10-15（UTC+8）。**改变18 §7：压缩迁移或交接数据库项目时，分别验证空库初始化与已有库升级；交代初始化数据、实例配置和迁移执行身份，不能把结构快照及一个成功的 `down` 当作完整恢复。** 这是有持久状态项目的条件建议，不要求无数据库项目增加备份流程；与[既有 n8n／Grafana 回退研究](2026-10-12-development-conditions.md#n8n配置回退与独立导出入口)的增量是“同一交付物在新旧接收环境执行什么”。**[研究：采用判断]**

**接收者实际缺的是什么。** [PocketBase #6826](https://github.com/pocketbase/pocketbase/discussions/6826)中，kendallroth 升级到 v0.23 时已有生产数据和手写 seed 迁移；本地删除旧迁移、生成 collections snapshot 后，远端的执行历史仍指向旧文件。他担心重复创建并丢数据。维护者指出默认快照保留未列出的字段／集合，建议先在生产副本上升级；seed 另行保留，可保留原文件名并调整内容，让已有库不重复执行、空库仍能初始化。用户最终选择本地整理迁移历史，5月13日报告已顺利工作；这是原接收者的成功自报，没有完整部署日志、逐项数据核对或耗时。**[社区：原帖与最终回执]**

**固定源码说明为什么两条路径不同。** 下列均取 v0.23.0 对应 SHA [`d5dddf3eadaffadc73503c464f6ff8ac6450a874`](https://github.com/pocketbase/pocketbase/commit/d5dddf3eadaffadc73503c464f6ff8ac6450a874)，是历史迁移机制，不作现行升级命令指南。**[一手：固定发布源码]**

- [`migrateCollectionsHandler`](https://github.com/pocketbase/pocketbase/blob/d5dddf3eadaffadc73503c464f6ff8ac6450a874/plugins/migratecmd/migratecmd.go)只查询 collections 配置，再生成模板，没有导出业务记录。故已有库保有 seed 不代表新库可重建 seed；删掉手写数据迁移时须另有初始化来源。**[一手：源码；研究：交付推论]**
- [`jsSnapshotTemplate`／`goSnapshotTemplate`](https://github.com/pocketbase/pocketbase/blob/d5dddf3eadaffadc73503c464f6ff8ac6450a874/plugins/migratecmd/templates.go)主动剔除 `oauth2.providers`，向前导入使用 `false`，向后函数分别只返回 `null`／`nil`。结构能重建不保证实例登录配置齐全，回退回调存在也不保证能还原先前数据；配置应经安全渠道另行恢复，不把密钥补进公开迁移。**[一手：源码；研究：采用边界]**
- [`MigrationsRunner`](https://github.com/pocketbase/pocketbase/blob/d5dddf3eadaffadc73503c464f6ff8ac6450a874/core/migrations_runner.go)用文件名查 `_migrations`；已执行且没有 `ReapplyCondition` 时跳过。`history-sync`只删除不再加载的文件名记录；`Down`调用回退函数后删除历史记录，不检查业务状态是否恢复。因此“历史整洁”“输出 Reverted”均不足以证明数据回退；重命名 seed 则可能使已有库把它视为新迁移。**[一手：源码；研究：机制推论，未运行]**

**反证：不是每次快照导入都会删数据，也不是所有状态都承诺保留。** [`ImportCollections`](https://github.com/pocketbase/pocketbase/blob/d5dddf3eadaffadc73503c464f6ff8ac6450a874/core/collection_import.go)在 `deleteMissing=false` 时保留未列出的集合／字段，但仍会更新匹配集合的配置；不能把“extend-only”写成任意旧快照无害重放。原用户承认自己曾把该参数改掉。另一方面，[v0.23 内部迁移](https://github.com/pocketbase/pocketbase/blob/d5dddf3eadaffadc73503c464f6ff8ac6450a874/migrations/1717233556_v0.23_migrate.go)明确删除旧 `logs.db` 且无逆向回调；维护者在上述原帖确认旧日志不导入。若接收方需要保留日志，应在升级前另行保留，不能由应用的“临时数据”分类代替自己的需求。**[一手：源码；社区：解释；研究：反证]**

**如何落到最小交付。** 在已有升级说明中写清：空库从哪里得到必要初始记录与实例配置；已有库凭什么避免重复初始化；哪些数据不会迁移、失败后恢复到哪一份已确认可用的状态。验收选一条真实业务读写／登录路径，而非只看服务启动或迁移退出码。已有可靠自动化覆盖两条路径时直接复用，不再另加一套检查或手工改迁移表流程。Agent 可以从源码提取这些差异、准备待验步骤；生产数据复制、密钥交付和实际升级仍遵循项目授权。**[研究：采用建议]**

**验证范围与下一证据。** 本轮读了公开讨论、固定源码；未运行 PocketBase、数据库或模型，未复核上游 CI，未证明压缩迁移普遍危险或上述建议节省维护工时，也没有证据把此案例归因于 AI 编程。不同作者的[另一恢复报告 #6972](https://github.com/pocketbase/pocketbase/discussions/6972)称完整性检查通过仍有旧记录写入失败，后用不同构建恢复；维护者却不能复现，驱动／ICU 原因仅为用户判断，本轮不据此推荐统一换驱动。下一项有区分力的证据是接收者对空库和旧库两条路径的可复查业务验证；继续增加迁移命令清单不能补足它。**[社区／研究：证据边界]**


## 补充证据：构建成功与接收环境的原生依赖

核实：2026-10-15 UTC。主线四，兼三；改变18 §7。**含原生依赖的交付应核最终产物和接收环境的兼容，失败按实际加载原因修对应层，不默认重解依赖。** 以下为历史公开维护链，未取得AI生成初始故障的证据，不作Agent效率比较。**[经验：采用判断；研究：归属边界]**

**接收者收到的提示可能指错层。** [Rollup #6461](https://github.com/rollup/rollup/issues/6461)于2026-07-28报告 Debian Bullseye 上升级后不能构建；外层提示找不到原生模块并建议删锁文件和node_modules，嵌套`cause`却是已定位的`.node`文件要求系统没有的`GLIBC_2.32`，错误码`ERR_DLOPEN_FAILED`。标题与正文版本写法不一致，不能照抄正文的4.63.2；后续定位与维护补丁对应4.62.3。另一位[用户](https://github.com/rollup/rollup/issues/6461#issuecomment-5102475586)报告临时固定4.62.2后可继续AWS部署；这是绕过成功自报，不是最终修订版复测。**[社区：用户原始运行记录]**

**固定加载器可解释提示为何失真。** [合并快照native.js L101–128](https://github.com/rollup/rollup/blob/7beedfa94963a32c14116994d1bae48d33673245/native.js#L101-L128)在`require`失败后，仅对Windows的一类缺DLL错误另报MSVC运行库提示，其余异常均包成缺模块／npm问题，同时保留原始cause。因此不能只凭最外层文本认定锁文件损坏；Linux缺GLIBC与Windows缺DLL也不应使用同一个修法。**[一手：固定源码；研究：诊断推论]**

**生产端修的是实际工具链与产物契约。** [PR #6467](https://github.com/rollup/rollup/pull/6467)于2026-08-01合并为[7beedfa94963a32c14116994d1bae48d33673245](https://github.com/rollup/rollup/commit/7beedfa94963a32c14116994d1bae48d33673245)。作者记录：CI恢复的node_modules缺`@napi-rs/lzma-linux-x64-gnu`，交叉工具链加载失败后继续用宿主编译器，产物最高要求变为GLIBC 2.34；错误只显示2.32不能当完整最低版本。作者还报告缓存的隐藏锁文件阻止普通重装补齐，这部分是其CI诊断自述，本轮未取得原始日志独立核实。**[一手：维护者补丁；社区：作者诊断与测量]**

[固定Rollup锁文件](https://github.com/rollup/rollup/blob/7beedfa94963a32c14116994d1bae48d33673245/package-lock.json)锁定`@napi-rs/cli`3.4.1；该官方包的gitHead为a5abb99a5abeb9853e0f6188bffa748e4c91eaa0。[对应build.ts L188–287](https://github.com/napi-rs/napi-rs/blob/a5abb99a5abeb9853e0f6188bffa748e4c91eaa0/cli/src/api/build.ts#L188-L287)在try内加载交叉工具链并设置linker／sysroot，catch只记录debug警告，随后返回并继续exec；这独立支持“工具链加载失败不必然使构建失败”的机制，但不能仅凭源码证明某次CI缓存的实际内容。**[一手：固定发布包、源码；研究：机制边界]**

补丁在[依赖恢复动作](https://github.com/rollup/rollup/blob/7beedfa94963a32c14116994d1bae48d33673245/.github/actions/install-and-cache-node-deps/action.yml)中补齐缺失的平台绑定，按锁文件URL和integrity核包；同时在[构建工作流L290–326](https://github.com/rollup/rollup/blob/7beedfa94963a32c14116994d1bae48d33673245/.github/workflows/build-and-tests.yml#L290-L326)直接检查最终`.node`的GLIBC符号版本，超过2.28或没有产物时失败。门槛按其目标选择，排除了musl／WASM及使用另一工具链的riscv64、loongarch64，不能照搬成全平台保证。该检查仍是静态门槛，代码还用`|| true`吞掉提取管道错误，不能将“步骤成功”宣称为任意工具失败均被检测或最终业务已可运行。**[一手：固定补丁；研究：检查范围]**

**已有CI状态与仍缺的结果分开。** 精确head`778c0367eb517a6d1d5dc281e792dde7da604e4d`的[x64 GNU构建job](https://github.com/rollup/rollup/actions/runs/30657145583/job/91244328172)记录`Build (Classic)`和`Check glibc symbol compatibility`均success。API原始日志下载返回403，故作者声称先捕获2.34、修复后2.14的红绿数值仍按作者报告引用；没有本轮独立产物测量。发布标签[v4.62.4](https://github.com/rollup/rollup/tree/ddc4ffab628944e45dbb8d66d58aae818015440f)为修复合并提交之后两笔，GitHub compare为ahead_by=2、behind_by=0，确认进入该版；issue关闭和发布机器人通知不替代原用户升级复测。**[一手：固定CI步骤、提交关系；研究：验证边界]**

**反例：缺包也可能真是锁文件问题。** [npm #4828](https://github.com/npm/cli/issues/4828)的原报告在npm8.8.0／Node16.14.2下展示：保留node_modules而重建锁文件，只记录当前平台的SWC可选包，另一架构接收者安装后没有其平台包且无警告。清理两者后重建则列全。它说明不能反向断言“都不用修锁文件”；这是2022年的版本化报告，不据此认定当前npm普遍仍有同一缺陷，也不将删锁文件变成常规交付步骤。确认解析有误后，应受控更新并审查依赖变化，再验接收路径。**[社区：可核原始命令和输出；经验：采用边界]**

**最小采用与停止条件。** 交付含原生组件时先写清真正承诺的接收环境，复用已有发布产物检查，后续获准验证时观察实际加载和一条关键功能；若失败，保留原锁文件和完整错误cause，定位是包选择／安装还是ABI／运行库，再决定兼容产物或构建修复。纯脚本且无这项边界时不增加矩阵；已有目标环境验收充分时不另造框架。不复制上游特定tarball修补脚本，也不建议为绕过错误直接升级系统库。下一条有价值证据是原接收者在原环境使用4.62.4的成功加载和业务结果，不再增加同一补丁的检查数量。**[经验：条件建议]**


## 补充证据：接替恢复与并存试用的身份取舍

核实：2026-10-15；只读原帖、后续回复与固定源码，未运行客户端或容器，未接触真实凭据／设备。**改变18 §7的选择**：数据能恢复，不代表应该复制全部身份；先决定接替旧实例还是保留旧实例试用，再选产品已有的导入和启动机制。这补充前述空库／已有库差异，不另设恢复清单。**[研究：采用判断]**

**Syncthing Tray：保留比较空间，付出重新配对的代价。** [讨论 #390](https://github.com/Martchus/syncthingtray/discussions/390)中，Adhjie于2025-12-03已读迁移说明仍担心损失。维护者建议只导入文件夹／设备设置，避免分歧数据库宣称同一身份；维护者 Martchus 于12-04自报旧 Android 10 手机迁移可用，这是作者自测。2026-02-25原提问者仍使用该app，也反馈内存负担、必要时强退：这是继续使用，不是完整数据审计或长期稳定性证明。讨论时2.0.4导入有回归，不能据此称当前版本仍坏。**[社区：使用自报；一手：维护者解释]**

[固定迁移说明](https://github.com/Martchus/syncthingtray/blob/a67d341af2a5c83ace634644f064cc298eb2d6a4/docs/android.md#migrating-data-from-your-existing-app-setup)区分两路：选择性导入保留**目标现有device ID**，对端须接受该身份与共享；全量导入沿用原配置、数据库和ID，无须对端重配，但旧app不能自行再启动，切回须先停新实例并按说明重新导入更新状态。[固定app.cpp](https://github.com/Martchus/syncthingtray/blob/a67d341af2a5c83ace634644f064cc298eb2d6a4/syncthingwidgets/quick/app.cpp#L1644-L1840)的选择性分支只合并folders/devices，`makeObjectFromDefaults`设`paused=true`；完整分支复制Syncthing home。保留两app不等于能同时写同一目录，维护者仍建议避免同时运行。新身份不是数据隔离。**[一手：固定文档与代码]**

边界：同一固定文档也允许新前端连接原后台，但操作会影响原配置，并非只读沙箱；未找到该分支用户结果，不另作推荐。[a67d341](https://github.com/Martchus/syncthingtray/commit/a67d341af2a5c83ace634644f064cc298eb2d6a4)于2026-02-20 UTC还修复过先前28ece7e引入的参数引用清空问题，说明导入功能仍有后续维护，不能将12月自报当所有后续版本保证。2026-10-15回读[默认分支说明](https://github.com/Martchus/syncthingtray/blob/master/docs/android.md)仍保留两种迁移机制，并承认Android成熟度／资源限制；本案不是替代产品排行。**[一手；研究：证据边界]**

**异源闭环：两台设备要并用，重装不一定重建身份。** [Tailscale #10371](https://github.com/tailscale/tailscale/issues/10371)的原用户于2023-11-23从iPhone备份克隆新机，重装app、删除控制台条目仍不能并用，登录一台会断开另一台。[DentonGentry的回复](https://github.com/tailscale/tailscale/issues/10371#issuecomment-1824970509)要求在新机重置身份存储并重新登录，生成新node key；[原用户同日确认解决](https://github.com/tailscale/tailscale/issues/10371#issuecomment-1824975044)。这是已有功能的历史处理结果，没有对应新修订，不作为当前各版本菜单教程。**[社区：原用户失败与成功；一手：项目贡献者建议]**

**反例：接替服务先修运行入口，不默认清空身份。** [Tailscale #8679](https://github.com/tailscale/tailscale/issues/8679)中，2023-07-21用户报告Kubernetes1.26／Tailscale1.44的pod接替后出现重复node key。[irbekrm于7月26诊断](https://github.com/tailscale/tailscale/issues/8679#issuecomment-1651783672)怀疑新旧pod短暂同用Secret内身份；镜像已含containerboot改进，但旧run.sh覆盖了它。建议停止调用旧脚本并按支持的配置调整，[原用户同日确认解决](https://github.com/tailscale/tailscale/issues/8679#issuecomment-1652556519)。这支持采用受支持接替入口，不证明前后节点ID完全没变。**[社区：原用户回执；一手：项目贡献者诊断]**

[固定a2ca723](https://github.com/tailscale/tailscale/commit/a2ca72393352606e75ed73121551a4a8575a3303)早于该issue：镜像改以containerboot为PID1，向tailscaled转发终止信号、回收子进程，仍支持持久状态，并增加按需认证。旧run.sh也有信号trap，不能说旧版完全不处理退出。代码没有跨pod锁；维护者只说降低出现概率，不能证明强杀、分区或一般故障切换安全。该回执是改回受支持入口及配置后的结果，不能归因于单独信号处理。本次无集群运行或CI通过声明。**[一手：固定源码；研究：因果边界]**

**最小采用边界。** 凭据、实例身份、同步索引／业务进度是不同对象，即使同处一份备份，也须分别决定保留范围；接替旧服务与保留两实例有不同需求。公共讨论不构成生成／重置身份、重新认证、配对或共享授权。Agent可据公开机制提出选择，但实际变更须按授权办理。这些历史案例不证明所有软件都有唯一设备身份，也不测量AI收益或维护工时。**[研究：跨案判断；经验：实施边界]**

## 补充证据：恢复成功但应用连接了另一数据库

核实：2026-10-16（UTC+8）。**改变18 §7：恢复后的连接／登录成功不等于接收了预期数据集；再次导入或清空前先区分容器、逻辑数据库与持久目录，验一条已知旧记录及关联文件。** 这不同于前述同步设备身份取舍，也不同于空库初始化／已有库升级；这里是同一服务内应用究竟读了哪个库。**[研究：采用判断]**

**原任务与两次重试。** [Immich #19977](https://github.com/immich-app/immich/discussions/19977)的 StRinke 于2025-07-16报告升级到v1.135.3后曾可用，随后另一电脑登录失败；求助ChatGPT并修改compose、创建`.env`、重启后，自述数据库空了而照片文件仍在。协助者[先要求核旧数据库目录和前后配置](https://github.com/immich-app/immich/discussions/19977#discussioncomment-13783147)，没有把“空了”视作已证实删除。[首轮恢复](https://github.com/immich-app/immich/discussions/19977#discussioncomment-13786400)因命令尾部多出`>`出现shell语法错误；[纠正该符号](https://github.com/immich-app/immich/discussions/19977#discussioncomment-13786493)后，用户[报告导入无报错、可登录但照片不显示](https://github.com/immich-app/immich/discussions/19977#discussioncomment-13786671)。最终他将`DB_DATABASE_NAME`从`immich_postgres`改为`immich`并重启，[同日确认数据回来了](https://github.com/immich-app/immich/discussions/19977#discussioncomment-13790108)。语法纠正与应用连接目标纠正是两个不同步骤；前者成功不能替后者验收。**[社区：原用户及协助者逐次回执]**

**固定发布源码的三个对象。** v1.135.3对应[`6563fa608a5a4414f40264b847e60928916fb986`](https://github.com/immich-app/immich/commit/6563fa608a5a4414f40264b847e60928916fb986)。该版[`docker-compose.yml`](https://github.com/immich-app/immich/blob/6563fa608a5a4414f40264b847e60928916fb986/docker/docker-compose.yml)把容器命名为`immich_postgres`，数据库初始化名称另由`POSTGRES_DB: ${DB_DATABASE_NAME}`传入，磁盘来源则是`${DB_DATA_LOCATION}`挂载；[`example.env`](https://github.com/immich-app/immich/blob/6563fa608a5a4414f40264b847e60928916fb986/docker/example.env)默认逻辑库名为`immich`。服务端[`config.repository.ts`](https://github.com/immich-app/immich/blob/6563fa608a5a4414f40264b847e60928916fb986/server/src/repositories/config.repository.ts)在没有`DB_URL`覆盖时将`DB_DATABASE_NAME`用于数据库连接。源码支持这些名称不能互换；不证明用户当时所有实际环境值，尤其不能忽略URL覆盖。**[一手：固定发布源码；研究：机制边界]**

**当前恢复约束与反证。** 2026-10-16回读[官方恢复说明](https://docs.immich.app/administration/backup-and-restore/)明确：v2.5.0变更备份／恢复流程，更早备份须用版本选择器查看对应手工恢复说明；当前优先推荐Web恢复，恢复会替换现有数据库。文档亦说明数据库保存文件路径及元数据，数据库备份不含照片／视频，文件须另备。因此不把2025年帖中的命令复制成现行教程，也不将任何“文件仍在”推成数据库可省略。真正数据缺失仍可能需要恢复；核对目标是选择恢复动作之前的诊断，不是永远不恢复。**[一手：当前产品文档；经验：采用边界]**

**归因与停止边界。** 原帖没有可靠的原始`.env`、数据库清单、备份内容核对或完整操作日志；协助者关于目录已被清空的说法也是猜测。因此无法判定数据此前被删除、仍留在原卷，还是最终由备份重建；不能宣称这次恢复本来不必要，或量化避免数据损失的收益。ChatGPT参与仅由用户自报，不能将具体错误库名归因到未公开的模型输出。本轮只读公开原帖、含折叠回复的完整讨论、固定源码与当前文档，未运行Immich、数据库或模型。若接收方已有旧记录／文件校验，直接复用；无持久数据项目不增加本项。**[社区／研究：证据边界]**

## 补充证据：修复导出器不等于修复已存备份

核实：2026-10-16（UTC+8）。**改变18 §7：若已确认导出产物中的关联文件被覆盖，应保留现有备份，从完好来源生成独立新产物并核对归属；不把升级工具或重压旧目录当作旧产物已修复。** 这是基于下列源码的采用判断，区别于上一节接收端连错数据库；不要求所有备份重做，也不提供生产恢复命令。**[研究：条件建议]**

**原接收者实际导入后发现串档。** [Paperless-ngx #14428](https://github.com/paperless-ngx/paperless-ngx/issues/14428)的lausser于2026-10-12报告：官方Docker 3.2.1／OpenSUSE MicroOS中，两份日期与标题相同、原文件扩展名不同的文档，原件导出名各异，缩略图和归档PDF却共用名称。三文档最小复现含一份无关对照；用户报告导入后第一份文档的派生文件变成第二份内容，原件与对照正确。ZIP有重复entry警告，目录导出则覆盖且无同类警告。公开证据是命令、manifest摘录和校验结果自报，未提供完整导出包；不据此估计所有用户受影响比例。**[社区：原用户运行报告]**

**另一位维护者修的是产生名称的规则。** stumpylog的[PR #14429](https://github.com/paperless-ngx/paperless-ngx/pull/14429)于2026-10-12合并为[`6e717817c6cf09b4f3570db5cd4272e15ed0d7c4`](https://github.com/paperless-ngx/paperless-ngx/commit/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4)。[修前父提交](https://github.com/paperless-ngx/paperless-ngx/blob/3e0fa7377187fb987d3141d80b603526cce29dcc/src/documents/management/commands/document_exporter.py#L503-L554)按完整原文件名判唯一，却去掉扩展名生成缩略图／归档名；[原报告3.2.1固定源码](https://github.com/paperless-ngx/paperless-ngx/blob/7575d6078227ebdb4cf443f263d53ebc7575aa37/src/documents/management/commands/document_exporter.py#L500-L552)也有相同机制。[修后L503–557](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/management/commands/document_exporter.py#L503-L557)改按去扩展名的完整相对路径判重，再递增编号。[新增测试L1472–1539](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/tests/test_management_exporter.py#L1472-L1539)检查两文档的三类导出名不同、各自内容正确；它只调用目录导出，没有运行ZIP导出或导入，不能代表完整恢复验收。**[一手：固定补丁与测试定义，未运行]**

**消费端不替旧manifest消除歧义。** 修复提交只改导出器与测试，未改importer。固定消费者[先解ZIP到临时目录](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/management/commands/document_importer.py#L461-L480)，再[按每个pk的manifest路径复制文件](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/management/commands/document_importer.py#L624-L666)。两个不同文档共用`__exported_thumbnail_name__`／`__exported_archive_name__`时，不会因升级自动恢复为两个来源。识别本类受影响产物应核这些映射及内容，不能只看原文件名唯一或导出没警告；[导入前检查](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/management/commands/document_importer.py#L543-L585)主要检查原件／归档路径存在且可读，不核这种归属冲突。**[一手：固定源码；研究：机制推论]**

**维护者建议与本仓处理选择分开。** [合并后的评论](https://github.com/paperless-ngx/paperless-ngx/pull/14429#issuecomment-6133609311)建议在发布说明提醒重新打包，原话为“suggest re-zipping”，以确保有已知良好的备份；它不是完整的重新导出教程，也不是原用户已重试成功。仅重压已有目录不会补回已覆盖的字节；从完好源生成独立新产物是本仓推导的条件选择。不能无条件用“更新旧导出目录”替代：[目录输出L141–165](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/export/sinks.py#L141-L165)默认按mtime与size跳过已有文件，开启checksum比较也须调用者提供校验值，而[缩略图复制L574–585](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/management/commands/document_exporter.py#L574-L585)未传该值。本轮未复现同属性错内容的增量导出，只据实现保留边界；新产物验收前不删除现有备份。**[社区：维护者建议；一手：源码；研究：采用推论]**

**反证：原件完好且允许重建时，不必恢复每份派生文件的原字节。** [固定文档L338–351](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/docs/administration.md#L338-L351)允许省略缩略图／归档，再用已有工具重建；算法变化可能使内容和checksum改变。这是由交付要求决定的替代路线，不等于所有归档都可丢弃，也不证明仅剩坏备份时均能恢复。可复用已有sanity checker：[归档检查](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/sanity_checker.py#L240-L279)比较checksum，[缩略图检查](https://github.com/paperless-ngx/paperless-ngx/blob/6e717817c6cf09b4f3570db5cd4272e15ed0d7c4/src/documents/sanity_checker.py#L196-L212)只核存在与可读；整体检查通过不补作所有缩略图归属正确的证据。**[一手：固定文档与源码；研究：选择边界]**

**发布、复测与AI归属。** 2026-10-16查询[公开release列表](https://github.com/paperless-ngx/paperless-ngx/releases)最新为[v3.3.1](https://github.com/paperless-ngx/paperless-ngx/releases/tag/v3.3.1)，其发布时间早于修复合并；PR归入3.3.2里程碑，不能写“升级最新版已修”。截至本次读取，issue／PR没有原用户修订后重导出与恢复回执；合并、测试定义与机器人质量报告不补这个缺口。Claude仅由报告者披露用于整理观察报告，不能归因维护者补丁或推断AI提效。本轮只读公开报告与固定源码，未运行Paperless、ZIP导出／恢复、模型或上游测试，未核全套CI、主动工时及长期收益。下一条有价值证据是固定修订版的新导出与原触发条件恢复结果；只有发布通知或继续增加检查项时不扩写。**[一手：发布／PR元数据；社区：使用披露；研究：证据边界]**

## 18 专题历史核查范围

以下保留18页头原有的历史核查范围；不表示本次重新核验其中所有动态事实。

核实时间：2026-10-08；2026-10-13 修订成熟度、评审切片和固定提速目标，并补充 §6 接管实验、§7 Handy 复测和 Godot 贡献准入、§8 陌生模块学习检验，2026-10-14 补充 §3 分层许可准入和 §7 原用户升级恢复，2026-10-15 补充 §7 空库／已有库交付差异及 §3 Claude Code／API 的 ZDR 准入边界，同日另核地区控制、Claude 托管策略覆盖与订阅 API 赠额资格，并补充 §7 原生产物交付兼容；其余易变事实未重新核验。


## 补充证据：新对象通过，不等于原失败对象已恢复

核实：2026-10-16（UTC+8）。主线四／M3；改变18的恢复验收：上传／导入曾失败时，除新对象和旧数据外，要复验一个原失败对象的关联实体，不只接受同步或重复标记。[研究]

**同一操作者的后续修改。** filips123 在2025-09-29[报告](https://github.com/immich-app/immich/discussions/22062#discussioncomment-14540561)修好数据库约束后新照片正常，故障期间的旧照片仍标为已同步、服务端却缺失；随后[新建相册加入旧失败照片](https://github.com/immich-app/immich/discussions/22062#discussioncomment-14542190)，网页为空，API返回记录，但他实查原文件不存在。其回忆的起因是复制表后替换，可能丢失约束／索引，不当作有准确操作日志的确定归因。[社区：同一用户自报] 讨论主题作者是另一人，不能拼接经历。

**标记与实体分离的机制。** skatsubo 的[复现](https://github.com/immich-app/immich/discussions/22062#discussioncomment-14553614)指出上传先建资产行，后续失败只清文件；重试按checksum去重得到成功／duplicate，恢复约束仍不能补回实体，网页预检查还可能跳过上传。[社区：独立复现者自报] 在按该安装存储条件给出的[残留处理建议](https://github.com/immich-app/immich/discussions/22062#discussioncomment-14553678)之后，filips123于9月30日[确认解决](https://github.com/immich-app/immich/discussions/22062#discussioncomment-14554594)；没有逐文件复验日志。原建议含破坏性数据库操作，不复制为通用配方，保留原件／副本后走项目支持的修复路径。[研究]

**独立补丁不伪装成同一人的升级回执。** 2026-08-03合入的[PR30349](https://github.com/immich-app/immich/pull/30349)、固定[cee08a2实现](https://github.com/immich-app/immich/blob/cee08a2320dbddb563a7fa8cca7979e4c954edb0/server/src/services/asset-media.service.ts#L125-L230)记录本请求创建的资产，在异常路径补偿删除；真正重复路径提前返回，不删既有资产。它不是数据库、文件、队列的统一事务，也不扫旧版本残留。[一手：固定实现] 未证明该PR由前述讨论直接促成，也没有该用户安装该补丁的复测；不拼成连续修复链。[研究]

**描述与合并测试分开。** 作者称做过逐步故障注入、重复上传和真实数据库sidecar测试，但[审阅](https://github.com/immich-app/immich/pull/30349#discussion_r3672681118)要求撤回其他测试，最终[测试增量](https://github.com/immich-app/immich/blob/cee08a2320dbddb563a7fa8cca7979e4c954edb0/server/src/services/asset-media.service.spec.ts#L297-L336)只在建行前配额超限分支增加清理断言；不能将描述当最终树保留了建行后故障的正向回归。[一手：审阅与测试定义；社区：作者测试自述] 本轮未运行上游测试。

**采用与局限。** 恢复基础故障后，对原失败对象重试并打开／下载接收文件，确认接收副本前不凭成功标记删原件；若仍失败，保留副本、核状态与实体，再按项目支持范围修复。潜在原件损失是PR指出的风险，不是已核实的数据丢失。本例只支持同一自托管操作者恢复后继续维护的验收取舍，不证明跨人交接、AI效果或维护工时；无新模型、服务或数据库实测。[研究]

## 补充证据：接管构建不等于接管源码维护

核实：2026-10-16（UTC）；历史日期均为UTC。M3／主线三、四，改变18§7：接管发行前先核上游是否仍维护源码。只读公开声明、固定构建与接收者回执，未构建／运行镜像、服务、模型或上游测试。**[研究：范围]**

**两次责任变化不能混为一谈。** MinIO在2025-10-15的[固定提交`9e49d5e`](https://github.com/minio/minio/commit/9e49d5e7a648f00e26f2246f4dc28e6b07f8c84a)声明社区版转为source-only、旧二进制不再更新；[#21647维护者回复](https://github.com/minio/minio/issues/21647#issuecomment-3418675115)确认容器需自行构建。到2026-02-12的[固定`7aac2a2`声明](https://github.com/minio/minio/blob/7aac2a2c5b7c882e68c1ce017d8256be2feea27f/README.md)，页首已明确仓库不再维护；[该次diff](https://github.com/minio/minio/commit/7aac2a2c5b7c882e68c1ce017d8256be2feea27f)把原“maintenance／不接受新变更”说明改为“不再维护”。日期标识公开声明修订，不证明具体停止修补的最早日期；下文仍留有源码构建教程，不能据此恢复“源码会继续更新”的承诺。**[一手：固定声明与维护者回复；研究：时间边界]**

**接管产物确实存在，但职责只到所见范围。** [andrasbacsai交付说明](https://github.com/minio/minio/issues/21647#issuecomment-3429334402)提供了amd64／arm64镜像。固定`ab88ac1`的[工作流](https://github.com/coollabsio/minio/blob/ab88ac1ecdf25df56410487e562c29316f9682f8/.github/workflows/build-minio.yml)计划每日查询上游最新release，默认已有同标签GHCR镜像即跳过构建，另有强制重建入口；[Dockerfile](https://github.com/coollabsio/minio/blob/ab88ac1ecdf25df56410487e562c29316f9682f8/Dockerfile)按版本取上游源码构建服务器，并另下载和验证MinIO客户端`mc`。因此它不是全部依赖都由源码自建，计划存在也不证明定时任务实际持续运行。服务器及客户端的所见构建检查是`--version`，不能替代目标部署的业务验收；未核镜像digest、运行日志或全部供应链。**[一手：作者交付与固定实现；研究：边界]**

**接管后还要修交付身份。** 消费者在[#3](https://github.com/coollabsio/minio/issues/3)报告使用`RELEASE.2025-10-15T17-29-55Z`仍提示版本落后一年。接管者2025-10-27的[固定补丁`2cbf9e1`](https://github.com/coollabsio/minio/commit/2cbf9e158dc282541ed078ff39ee4d046fe5c85a)从只填ReleaseTag扩为Version、完整／短CommitID等构建字段，2025年10月28日[请用户复查](https://github.com/coollabsio/minio/issues/3#issuecomment-3454973892)。补丁证明元数据接管有实际二改，不证明原运行故障已恢复。**[社区：接收者报告；一手：固定补丁与作者说明]**

**同一用户的复查保留了反例。** 2025年10月28日原用户[先称警告仍在](https://github.com/coollabsio/minio/issues/3#issuecomment-3455036932)，随后[比较实际入口](https://github.com/coollabsio/minio/issues/3#issuecomment-3455243173)：同机直接Docker运行不告警，原Nomad单实例仍有问题，而相同种类机器上的Nomad集群不告警，因而怀疑自己的环境。没有固定镜像digest、原环境最终修复或排除变量的实验，不能把相同标签当相同字节，不能确定根因是时间、缓存或Nomad，更不能把他的推测写成镜像全面无问题。**[社区：同人复查；研究：因果与产物边界]**

**采用与停止。** 若仅缺构建产物且源码仍有修复来源，可评估现成构建接管，而不是立刻换掉整个依赖；若源码也停止维护，则先确认谁承担后续修复，再比较继续接管、受维护来源或缩小支持范围。新构建时间不意味着包含新修复，同版本字符串也不足以确认实际交付字节。这条历史链足以区分职责，但没有证明任何第三方镜像今天适合生产、旧数据可安全迁移、长期支持成本更低或AI有收益。若要继续推荐具体接管路线，下一证据必须绑定后续修复、实际产物和消费者升级验收；仅有新镜像日期或转载声明就停止，不扩工具名单。**[研究：条件选择与停止]**

## 补充证据：解释完整仍须核对原故障阶段

核实：2026-10-16（UTC）；历史日期均为UTC。**改变18 §7：接管会持久化临时绕过的补丁前，先核原故障阶段、实际参数与补丁作用范围，再决定是否把它作为原问题的修复；独立的参数透传需求另验。** 本例不以确定的AI生成归属为前提，也不要求所有小补丁增加完整人工测试流程。**[研究：条件建议]**

**接收者已要求解释，并落实到代码。** Anaconda [PR #7074](https://github.com/rhinstaller/anaconda/pull/7074)声称安装环境使用`split_lock_detect=off`绕过内核故障，但未传到安装后系统，因而首次启动崩溃。维护者[要求写清保留参数的理由及未来移除条件](https://github.com/rhinstaller/anaconda/pull/7074#issuecomment-4507792687)，合并者随后[认可解释并要求同步注释与描述](https://github.com/rhinstaller/anaconda/pull/7074#issuecomment-4508051150)。2026-05-21合入的固定补丁[`77e8e786`](https://github.com/rhinstaller/anaconda/commit/77e8e7869680bab4bce2c404893aeed1f76d7e65)在`data/anaconda.conf`加入该参数及三行注释，写明用于UEFI固件split lock问题、内核修复后可移除。解释与实现确实对齐，不能将后来撤回简化成“缺少文档”。**[一手：审查与固定补丁]**

**重新核原故障后，补丁的作用阶段不成立。** 05-27的[QA评论](https://github.com/rhinstaller/anaconda/pull/7074#issuecomment-4556782893)引用原报告日志指出：安装启动参数中没有`split_lock_detect`；失败发生于安装环境中的`efibootmgr`，并非安装后首次启动；失败后日志仍继续25分钟，与解释中的立即panic／重启矛盾。这是QA对公开原日志的核查，本轮只读取其评论，未独立复现机器故障或核读整份日志；不能据此确定真正的固件根因。它已足以反驳“这个参数在该次安装丢失，导致首启失败”这一采用理由。**[社区：QA核查；研究：证据适用范围]**

**同一合并者撤回参数及理由。** 05-28的[PR #7081](https://github.com/rhinstaller/anaconda/pull/7081)由原合并者提出并合入，固定[`1a27b78b`](https://github.com/rhinstaller/anaconda/commit/1a27b78b061202c250539dc79a8f1b48fbdb68be)直接引用上述QA评论，将原提交的参数和注释一并删除。QA[支持撤回](https://github.com/rhinstaller/anaconda/pull/7081#issuecomment-4561163008)，但明确不认为其危险或恶意，而是缺少理由、应尽量限制透传参数列表；不能把该链写成已证实的安全事故。**[一手：固定撤回与接收决定；社区：理由]**

**smoke成功不能证明所称故障已修。** 原PR最终head `8c34dd785a0b8803bfaf7fbaf79d76d33ac7b89d`的[公开commit status](https://api.github.com/repos/rhinstaller/anaconda/commits/8c34dd785a0b8803bfaf7fbaf79d76d33ac7b89d/status)记录`kickstart-test --testtype smoke`为success，关联[run 26225047049](https://github.com/rhinstaller/anaconda/actions/runs/26225047049)亦为success；网页只显示21/22 checks通过，不写全绿。该run由issue_comment触发，run元数据的head SHA是工作流基线`be84999a`，不能误当补丁SHA：[固定workflow](https://github.com/rhinstaller/anaconda/blob/be84999aa613b0c6cd74448092cafd582e5e6176/.github/workflows/kickstart-tests.yml)读取PR head后checkout、rebase到当时目标分支，再将结果写回PR head。未读取实际运行日志、rebase产物或逐用例结果，因此只确认该PR记录的smoke状态，不声称固定原head字节在原用户机器复现成功。撤回PR的smoke被[显式waive](https://github.com/rhinstaller/anaconda/pull/7081#issuecomment-4561037300)，不能把其检查通过数当作重新运行smoke。**[一手：状态、固定工作流与豁免记录；研究：验证边界]**

**归属与停止。** QA认为原解释是LLM幻觉，但未见作者明确披露或模型轨迹，故仅记录维护者的怀疑，不归因特定模型或认定自主Agent生成。该链证明接收后存在实质撤回，不能证明AI净收益、支持工时、长期维护成本或原用户最终恢复。本轮未运行代码、模型、安装器或上游测试。下一项有价值证据应是独立需求的真实验证或原故障的有效修复；不继续堆同类“解释不可靠”案例。**[社区：归属判断；研究：采用局限]**

## 补充证据：AI参与补丁的独立接收者继续修改

核实：2026-10-16（UTC）。**确认18/24已有接管建议。** PSScriptAnalyzer [#2205](https://github.com/PowerShell/PSScriptAnalyzer/issues/2205)记录升级后原CI分析失败；[#2206作者](https://github.com/PowerShell/PSScriptAnalyzer/pull/2206#issuecomment-5670666150)明确披露Copilot迭代并引入重试。下述接收者不同于原作者，但其自身AI参与未确认。**[一手／社区]**

**真实输入改变“已改善”的范围。** PrzemyslawKlys的[10-08回执](https://github.com/PowerShell/PSScriptAnalyzer/pull/2206#issuecomment-6058563056)将候选`3f5bf19cd024cee6a3339f3b514ebdfe7d8930f8`与上游`411c3d0b197b488285bddd2375b292ab7b8db5e8`比较：使用自己Locksmith／PSWriteHTML的合并模块与原manifest、六条格式化规则。首次格式化调用明显改善，但暖格式化如下；不能把冷、暖或不同负载混成统一收益。**[社区：接收者测量]**

| 暖格式化／CPU缓存域 | 上游→候选（ms） | 耗时增加 |
|---|---:|---:|
| Locksmith／0 | 296→520 | 75.7% |
| Locksmith／1 | 315→688 | 118.4% |
| PSWriteHTML／0 | 2495→3957 | 58.6% |
| PSWriteHTML／1 | 约2030→约2030 | 约持平 |

上表为作者均值。原测使用PowerShell 7.6.6／Ryzen 9950X3D2、固定亲和性、轮换样本，域0三次、域1两次，丢弃四轮预热；排除启动／import及模块执行。字节与完整诊断匹配。**本轮仅以`(候选/上游−1)×100`复算前三行并四舍五入，不是本仓性能测量。** **[社区；研究：算术复核]**

**接收者保留实现，提交局部续改。** [fork #15](https://github.com/jessehouwing/PSScriptAnalyzer/pull/15)从上述候选出发，固定[`317b274e`](https://github.com/jessehouwing/PSScriptAnalyzer/commit/317b274ea22b0ed3502a87ed92642f6f88c35398)合并三次AST遍历并保留函数／类／配置顺序，补交错声明抑制测试。另一个[fork #16](https://github.com/jessehouwing/PSScriptAnalyzer/pull/16)的最终head `4400463623b0d708fc41f3d0e4714a88756b65ef`复用函数名正规化并保留private/local可见性，区分直接调用块与命令参数块。两者均基于`3f5bf19`。已读固定diff；原作者10-08分别以`c24849d1`／`e9de0f94`合入fork，不能写成上游发行。**[一手：补丁与合并元数据]**

接收者的[续改回执](https://github.com/PowerShell/PSScriptAnalyzer/pull/2206#issuecomment-6060529367)报告#15组合比较改善部分暖格式化、首调用仍混合；#16的作用域缺口也见于已发行1.25，不是该候选新引入。其82测试、两项既有跳过及运行探针为作者报告，本轮未运行。独立优化[#2224关闭说明](https://github.com/PowerShell/PSScriptAnalyzer/pull/2224#issuecomment-6189217369)表示实现已并入#2206，并非被拒；连接器核#2206仍open、未合并，head为`89bc5e112aa7845f13fda2f251817fb9d95c7a9e`。**[一手／社区]**

**边界与停止。** 这条链补足“另一位实际使用者读懂并继续改”的观察证据；不证明全面采用、长期维护等价或AI净收益，未取得完整人工／模型成本。本例保留实现并补窄修改，不推广为必选方案；停止同义追查。**[研究]**
