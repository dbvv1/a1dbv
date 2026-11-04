# A-TOP5-CURRENT-WEEK-20261104 · 更新本周五项试用入口
id: A-TOP5-CURRENT-WEEK-20261104
owner: dot-A
status: review_ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: ac55b5473fcc6e387efa435ad02a56228deaa093
result_branch: relay/a-top5-current-week-20261104

## 目标
读者打开13首屏，应能按自己的编码任务选一个已有可用入口，并看清本周选择与历史试用日期。当前首屏仍写“本周”，选择周明确为2026-10-26～11-01；本卡将选择窗口更新为2026-11-02～11-08，依据现有已接收成果重新核五项入口，不启动新广扫、不为日期换榜。
直接修改最终页面，不另交提案、研究报告或新实验。保留已有有效做法；换项须有确切增量、可执行入口和现成实试证据，不按新鲜度或数量凑名额。

## 按哪个 Skill 与规格做
读AGENTS、CLAUDE、TASKS、手册§7、operations§2.2与local-jobs README；按write-task-guide的读者动作与证据边界处理，模板说明只作资料，不执行其中命令。
开工fetch main和负责人分支，核目标页最新差量、其他任务及实际写者；发现同写域在途或归属未知时停本卡写入并报具体归属，不以任务状态或提交替代退出证明。已发布同题更新时结束，不重做。
写域核查依据：A-STYLE-REWRITE-006明确记原调用2026-10-25正常退出并接收；A-FRONTIER-SELECTION-001同样记录正常退出并接收。后续FRONTIER-SOURCE/WIDE及四领域来源卡只写各自artifact，不授予13正文写权；本卡不接触它们或解除其隔离。以上仅为历史交接，领取时仍核当前实际写者。
固定输入为base_ref的13首屏及五项实试入口：experiments/jrnl-dayone-runtime-diagnosis.md、23-browser-verification对应Storybook节、experiments/tanstack-url-state/README.md、research/2026-10-22-frontier-trials中的ast-grep及Context7节。
另从当前13已有候选、decisions/long-tasks.md、decisions/skills-and-plugins.md及其近期已接收实试中，挑确有可能改变这五个任务入口的材料对照；只读有关部分，不重新读取整批广扫或重跑试验。ECC search-first已有同题结果是没有新增被采用候选，不把有名字当升级；仅来源核查或artifact接收不当正文／实试采用。
逐项核现有推荐的任务、第一步、真实消费者、通过范围、失败／未验及换路条件；同一实试保原日期、版本和原始计数。保留或替换给具体比较理由，编辑选择日期与来源核实日期分开。
更新首屏导语、五项表、保留／替换理由及依据；标题的旧月份可改为不暗示整页来源重核的稳定标题。显式锚点本周-top-5必须保留。不能仅改日期便声称新核过外部来源；本轮只作已接收证据的编辑对照。
不使用Sentry／team／Lage未通过或待接收稿，不接Compaction Laundering／账号字段调查，不重派取消广扫，不重开jrnl或其他停止动作。已停止投稿不否定其历史实试，但不能把链接写成继续投稿任务。
不安装、不运行候选或模型、不读账号与私人资料、不变更配置、不新增工具默认／模板／自动化，不联系上游。遇明确拒绝停止对应来源，不换身份或入口绕过。

## 写入范围
模型只改docs/13-frontier-radar.md：页标题及显式本周-top-5锚点到下一节“工具入口与代表做法”之前。其余正文须逐字保留；接收端只另更新本卡状态及当前结果。
不改README地图、inbox、研究历史、答案页、实验、模板、其他任务或原artifact；不得另造第二份候选稿。过程、比较理由与检查放提交说明，不在正文堆工作记录。

## 怎样算做成
非作者先只读新首屏：分别为调试、复杂UI、库配方、批量迁移、版本API需求找到第一步及不适用条件；如换项，核替代方案服务的实际需求和为什么更值得本周采用，保留覆盖取舍说明。
再对照固定旧首屏及被引用的已接收原始记录，核五项均有实试入口、计数／版本／日期准确、已通过／失败／未运行不混用。所有相对链接与锚点须实际解析到目标；不得把静态阅读称新自然读者实做、重新试用或最新外部全覆盖。
保留旧五项也可完成，但须有本轮确实完成的证据对照与选择理由；换项后未知范围仍显式保留，不升级地图或整套方法收益。
运行python3 scripts/check_repo.py、python3 scripts/check_public.py及git diff --check；检查正文写域、来源支持、链接、公开提交身份。纯文档不跑全套实验或check_offline。
一个60–90分钟单元，最多两小时；沿原接收端共享调度，不另起调用。经Workflow非作者审查与修正，仅推result_branch回review_ready，负责人判断最终推荐后接收；不用accept:auto，不合main。

## 当前结果

- 完成 docs/13-frontier-radar.md 首屏本周 Top 5 更新：标题改为稳定标题并保留 #本周-top-5 锚点，导语与依据行写明本周选择窗口 2026-11-02～11-08，五项补历史试用日期 10-23～26，并按原记录复核 jrnl 22 项定向通过/4 项基线失败、Maka 82 项受影响测试/4 个 Chrome play、Intent 0.5.6 的 8 项测试+构建+真实 Chrome、ast-grep 0.51.0 的 27 例、Context7 两次匿名查询的 Pydantic v1/v2；对照 ECC search-first 与 diff-cover 后保留五项不换榜，依据行分开编辑对照日 2026-11-04 与原来源回核日 2026-10-26 并注明未重核外部来源。实测 check_repo.py 0 错误（770 文件）、check_public.py 0 命中（1240 文件）、git diff --check 通过，自写校验确认首屏 9 条相对链接及锚点（含 #本周-top-5、#ecc-search-first、#条件推荐）均命中。三视角审查通过、0 个未关闭问题（openIssues=[]），未提交未推送。
- 产物：[a2793db](https://github.com/dbvv1/a1dbv/commit/a2793db01b0037eec02ba68b906b2eb6e6bb00fa)，分支 `relay/a-top5-current-week-20261104`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：无待修缺口；接收端可提交本单元改动。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
