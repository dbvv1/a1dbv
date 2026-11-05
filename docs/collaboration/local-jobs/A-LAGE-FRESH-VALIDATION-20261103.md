# A-LAGE-FRESH-VALIDATION-20261103 · 核清中断后新执行与缓存命中
id: A-LAGE-FRESH-VALIDATION-20261103
owner: dot-A
status: accepted
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: f26173752175fb2ff9d2c56cc87398b7ad72fb4a
result_branch: relay/a-lage-fresh-validation-20261103

## 目标
帮助带明确“最终目标图须新执行”要求的开发者，判断一次无缓存运行中断后，普通重跑绿灯是否满足验收，以及应选再次旁路还是独占缓存重置；不要求普通迭代一律重建。
本仓15 §6已有选测/映射失效与Vitest隔离，verification已要求实际版本、任务数和受影响路径；缺口是Agent照抄“--no-cache会重置缓存”后把历史命中误认成本轮未跑任务已新执行，需解释具体恢复选择而非重复通用缓存原则。

## 按哪个 Skill 与规格做
读 AGENTS、CLAUDE、TASKS、手册§7、operations§2.2与local-jobs README；只读write-task-guide以保真实问题和未试用边界，不执行其中广扫或造新读者。
固定本仓输入：base_ref的docs/15-task-playbooks.md §6、docs/decisions/verification.md首屏/已有补丁/按产品承诺选证据、docs/research/2026-10-12-development-conditions.md“增量验证已有回归测试是否真的被选中”；先核最新同题与写域。
真实记录：https://github.com/microsoft/fluentui-react-native/blob/41768dacc889222444c538ce6031fe668f06043f/agent-improvements-plan.md#L111-L125 。作者记首次no-cache格式失败81任务未执行，普通重跑绿却164缓存命中含那81项，随后完整无缓存执行171项。
修订：https://github.com/microsoft/fluentui-react-native/commit/e769e6d5304600daa4f3cb500dfaa58c73739fa2 。核package.json、AGENTS.md、references/agents/repository/development.md和Skill同步；选择clean-lage-cache后普通buildci，失败后复用清理后成功任务结果。
采用回执：https://github.com/microsoft/fluentui-react-native/pull/4371 ，合入4f45ad9bfdc3abf6a3428d92073353551bfeec12（2026-10-15），171/0跳过/0失败仅作者自报；没有原始日志不得称独立复算、已复现或模型提效。
固定版本：FURN e769e6d的yarn.lock L18584–18586为Lage2.14.19；官方lage_v2.14.19对应microsoft/lage@dbbbe63b20790302c1c7022de3011fae7eb4257e。所有实现结论绑定该版本。
在该Lage固定树核CLI选项到shouldCache/shouldResetCache，以及packages/scheduler/src/workers/targetWorker.ts的getCache/saveCache/run：区分禁用本轮缓存读取、重算/写入与删除已有条目，不能仅凭参数名称解释。
核packages/cli/src/commands/cache/clearCache.ts、packages/cache/src/providers/BackfillCacheProvider.ts与getCacheDirectory.ts：clear走本地purge，路径范围为工作区node_modules/.cache/lage下cache/logs，不等于清全部构建状态，也不清TypeScript增量状态。
核packages/scheduler/src/cache/createCacheProvider.ts与packages/cache/src/providers/RemoteFallbackCacheProvider.ts：配置或BACKFILL_CACHE_PROVIDER相关环境可启用远端，本地miss后仍可能远端命中/回填。只读FURN lage.config.mjs不能证明作者进程没有远端配置；不读取任何当前用户环境。
先给15 §6一段最小可采用补充稿：有新执行要求时核实际选项和缓存来源，选择合适重跑策略；按命令真实输出区分执行、缓存命中、失败、未运行，不虚构工具未暴露的历史/远端分项。
“清本地后普通重跑”只作为明确无远端回填、独占可丢弃缓存的有条件选择，不默认优于再次完整旁路，不建议删共享缓存或自行关远端。清理命令成功本身不能代替实际执行计数。
不适用：只读计划不需构建；缓存可信的普通迭代保留增量；既有证据足够不加门禁；作者旧缓存未证明错误，只证明不能满足这次新执行口径，不把它写成已漏产品bug。
去重：固定树原任务卡与两广扫无FURN4371/clean-lage-cache/本恢复差异；现有Next构建身份、Biome生成物、Vitest环境和选测映射保留，不重做已完成实验或已取消扫描。未知旧15写者继续隔离。
全程只读公开来源并写候选稿；不安装、运行FURN/Lage/模型，不操作用户电脑，不清任何缓存，不改构建配置或读取账号、凭据、私人日志，不投稿或接上游PR。

## 写入范围
只写docs/collaboration/local-jobs/artifacts/A-LAGE-FRESH-VALIDATION-20261103/proposal.md；接收端只另更新本卡状态及当前结果。
先给15未来落点的最小替换/补充稿，再附现有缺口、固定源码与作者回执、选择分支及不适用；相对链接按未来15落点核。不得改15/verification正文、研究页、模板、13、指导文件、TASKS、其他卡或接收器。

## 怎样算做成
非作者逐源回答：①no-cache失败后普通绿灯为何不证明全图新执行；②clear本地后能否保证没有远端命中；③171/0与旧缓存失效各被什么证据支持；④无新执行要求时是否该清缓存。至少核一个远端回填反例，答案与候选动作一致。
仅静态接收可用稿，不称新实际运行、模型采用或全部runner通用；原始来源有缺口即标未知，不把注释或团队自述提升为独立日志证据。现有正文若已完全覆盖则回负结果。
一个45–75分钟单元、最多2小时；原接收端共享最多4并行，不另起调用。经既有Workflow非作者审查、check_repo、check_public、git diff --check与身份检查，仅推result_branch回review_ready；不用accept:auto，不合main。

## 原回传结果（历史）

- 已产出 proposal.md（87 行，唯一新增文件；check_repo 743 文件 0 错误、check_public 1208 文件 0 发现，UTF-8/LF，未提交未推送）。未关闭：review 未通过（fixRounds=3，2 条 openIssues 同根因）——正文第 13/51/66 行把一次性 lage buildci 摘要 skipped 解释为含 shouldRun=false 的不适用任务，但固定版 Lage 2.14.19 的 runAction 在调度前经 optimizeTargetGraph 删除这些目标，一次性 CLI 摘要 skipped 只应反映缓存命中；onSkipped 依据只适用于 watch/未优化图。未运行 FURN、Lage 或真实缓存实验，171/0/0 仅作者自报，未独立复算。
- 产物：[89ac591](https://github.com/dbvv1/a1dbv/commit/89ac591a224f9dc009df2d0c01368b66a9dae92f)，分支 `relay/a-lage-fresh-validation-20261103`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：安排一次修正单元：按 fix 改写 proposal.md 第 13、51、66 行，把普通 lage buildci --no-cache 恢复为 0 skipped 门槛，并把 SimpleScheduler/onSkipped 依据限定到 watch/未优化调度（第 19 行同步补 optimizeTargetGraph.ts L9–24、runAction.ts L107–112），随后重跑三视角审查至 reviewed=true。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 负责人接收（2026-11-05 UTC）

- **接收修订后静态指南**。原稿 89ac591 的 skipped 解释未通过，历史失败保留；采用负责人修订并经非作者核源的 [4e3aebff](https://github.com/dbvv1/a1dbv/commit/4e3aebff06a46eb0cd6e5e82072e53c6d3cefdfc)。本次对照 main 934f59c 的 [playbooks §6](https://github.com/dbvv1/a1dbv/blob/934f59c29057251dc7b8ec55ba19b8dfaaa9d00d/docs/15-task-playbooks.md#6-补测试)，Lage 段与该修订版逐字一致；当前整页 blob 为 `7b1f72f6d5dba67a242ca217cb6dca07e084f92e`。
- 接收一次性 CLI 的 0 skipped 门槛、watch／未优化图边界及远端缓存回填限制，不再按原失败稿重派修正。未运行 Lage／FURN 或真实缓存实验，171 项结果仍是上游作者自报；原稿本身未改写。
- 本次仅核已发布内容与接收范围，不重跑原调用、不改原产物；旧调用、工具及相关写者的退出未知仍独立保留，accepted 不解除隔离或授权重派。
