主线：三、四
改变的建议：18/24：接收意见、落地补丁和最终说明对齐；18补测接管投入、陌生模块学习及原触发条件下的恢复
新证据：Immich审查、接管/学习实验；10-14补CBM原用户恢复触发条件后的升级复测，不补足Immich实机/支持工时

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
