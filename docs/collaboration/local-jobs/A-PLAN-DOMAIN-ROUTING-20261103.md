# A-PLAN-DOMAIN-ROUTING-20261103 · 规划时保留实现领域知识
id: A-PLAN-DOMAIN-ROUTING-20261103
owner: dot-A
status: running
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: ec246c5d314e9280edb221695bd3ab71f3ad7a8f
result_branch: relay/a-plan-domain-routing-20261103

## 目标
解决已有功能的“只规划实现”被按关键词送到纯规格/可行性工作流，漏掉实现领域知识的问题；只读阶段仍需知道类型、组件/平台模式和验收，不能因不准改代码就不读这些依据。
本仓planning-and-tests已正确区分Plan/Spec/测试与直接实现，也有“只读调查/短计划”分支；缺的是选领域资料/Skill时，如何区分任务对象与当前允许动作。保留默认直接做和现有权限边界，不新增统一规划流程。

## 按哪个 Skill 与规格做
读AGENTS、CLAUDE、TASKS、手册§7、operations§2.2和local-jobs README；只读write-task-guide保真实任务与未试用边界，不执行广扫或制造reader。
本仓固定输入：base_ref的docs/decisions/planning-and-tests.md首表/“先Plan”、docs/07-workflows.md §2的计划产物与默认路线、docs/decisions/skills-and-plugins.md的按缺口选择。
一手修复：https://github.com/microsoft/fluentui-react-native/commit/5e183ce7fcea936d112543cc2799b0f8581c614d ，其父958f787a718fdbacbb873a875b869edf0e3941ee。核AGENTS路由、classification.md、authoring和contract-authoring两个Skill的前后差量。
作者明确报告GPT-6.1 Sol开发探针把agentic plan-only任务送入contract-authoring，跳过authoring流程/types-and-slots；修复把规划实现放回领域Skill，增加步骤1–4不编辑的分支，纯contract-only/contract-feasibility仍独立。
固定被试输入：https://github.com/microsoft/fluentui-react-native/blob/4f45ad9bfdc3abf6a3428d92073353551bfeec12/references/agents/evals/cases/agentic-button-appearance-plan.json 。读其真实公开prompt、5 required_reads、禁止edit-files和两条断言；不要在本卡执行prompt或实施tinted外观。
固定结果文字：41768dacc889222444c538ce6031fe668f06043f的agent-improvements-plan.md L150–159；作者称修后读齐5文件/过2断言，输入tokens比修前多22%。#4371合并4f45ad9bfdc3abf6a3428d92073353551bfeec12于2026-10-15，正文保单次探针和未重复限制。
当前旁证：06b458f484e582e9081d7ce5f074fcacda8c21da（2026-11-02）的.github/skills/agentic-component-authoring/SKILL.md仍明确plan-only步骤1–4不编辑。其资料路径已演进，不把历史fixture直接套当前树判缺文件。
只核公开资料与作者报告，不声称本轮独立重跑、成本收益或Skill整体胜出；token增加只是该次取舍，不是“多读必然更好”的依据。fixture虽来自真实团队评估，但不把模拟规划当完成组件交付。
先给planning-and-tests“先Plan”附近一段最小候选：按将改变的功能/领域选择资料与现成workflow，再限制当前只调查/计划；纯需求契约才进contract-only路线；已有直接实现任务不因此一律先Plan。
给一个可复制的短请求补充，明确任务对象、只规划不编辑、沿领域入口读所需契约/实现/测试、返回变更位置/次序/保留行为/验证。不要照抄全部FURN规则或要求所有规划读5份文件。
保留“Plan模式名不是严格只读”的现有事实，不把这次Skill路由改进当沙箱/权限保证；只读要求不授权实现、运行有副作用命令或写契约文件。
不适用：已有单一领域入口满足任务就不添路由；纯规格/可行性调查继续相应窄入口；无实现决定缺口时直接做。避免重复07“计划不复制函数体”的既有内容。
去重：固定树原卡、两广扫无本计划路由题；A-PLAN-MODE-FACTS只核Claude权限，Lage卡只核缓存恢复，均不接续或拆分本题。未知页/模板旧writer继续隔离。
不安装、运行上游/模型、读取账号或用户配置、执行fixture、投稿或外发；不上游改Skill，不扩成新评测框架或重派原广扫。

## 写入范围
只写docs/collaboration/local-jobs/artifacts/A-PLAN-DOMAIN-ROUTING-20261103/proposal.md；接收端只另更新本卡状态和当前结果。
先给可直接放入planning-and-tests的最小正文/请求补充，再附现有缺口→错误路由→修订→适用边界及固定来源。链接按未来正文落点核，不改planning/07/Skills正文、研究页、模板、13、TASKS、其他卡或接收器。

## 怎样算做成
非作者独立核旧/新路由与fixture，回答“计划改Button外观”和“只写外观需求契约”分别用什么入口、哪些资料不能省、哪些动作仍禁止；再核修后token数字只属作者单次报告。
候选应保Plan/Spec/测试原选择和权限边界，不把静态审稿称模型采用、原生加载或组件实现成功；若现有页已覆盖同一决策，回负结果不硬加段落。
一个45–75分钟单元，最多2小时；共享最多4并行由原接收端调度。按既有Workflow非作者审查、check_repo、check_public、git diff --check与身份检查，仅推result_branch回review_ready；不用accept:auto，不合main。
