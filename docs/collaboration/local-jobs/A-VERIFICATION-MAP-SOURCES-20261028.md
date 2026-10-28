# A-VERIFICATION-MAP-SOURCES-20261028 · 团队怎样持续维护真实产品验收
id: A-VERIFICATION-MAP-SOURCES-20261028
owner: dot-A
status: review_ready
kind: explore
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 38c169622bbfeab60969be64607083862bbb6573
result_branch: relay/a-verification-map-sources-20261028

## 目标
给地图“团队怎么推广”补一份可判断的原始材料：产品持续修改时，pstack 的功能验收地图是否有人真正维护，怎样发现过期、漏验与维护负担？只查这对 Skill 的实际消费者和修订依据，交 dot-A 决定是否值得在已有产品试用。

## 按什么做
按 explore-frontier Skill 与 `kind: explore` 原生 Workflow 三路取材、逐链接核实、整理再审。先读 [团队接收](../../18-team-adoption.md#2-推广路线)、[现有验证做法](../../decisions/verification.md)、inbox、13 和相关 local-jobs 去重；本题不重做通用验证、Skill 选型或宽扫描。
开工核最新 main 与负责人分支的同题任务；本卡不重开 A-RESUME-CONTRACT-SOURCES-20261028 或两个 cancelled 采集，原阻塞与停止回执沿原卡处理。

固定起点均为 cursor/plugins `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`：
- [create-verification-skill](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/create-verification-skill/SKILL.md)：生成项目本地验收入口与逐功能地图，交付前实跑一个功能。
- [maintain-verification-skill](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/maintain-verification-skill/SKILL.md)：逐功能读源码、由协调者实跑所有功能，区分文档漂移、harness 缺口与产品回归。
- [作者 README](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/README.md)：整套 pstack 的日常使用自述只作线索，须另找这对 Skill 的具体运行与维护记录。

仅沿上述文件的提交／PR／issue、其引用的公开产品仓库及使用者原帖追查，优先近三个月；关键早期修订可追溯。三路分别核机制演变、真实消费者、失败与维护投入，不再搜通用插件排行榜或整套 pstack 的模型配置。
回答这些具体问题，找不到就留下有范围的负结果：
1. 哪个真实产品提交过生成的验收 Skill／功能地图？谁在后续产品改动后用过维护流程，留下了什么修正或运行证据？示例、fork 原样复制和作者整体宣传不记成独立采用。
2. 一次维护是否找到新入口遗漏、过期前提、不可达功能或 harness 失效？怎样区分说明过期与真实产品回归，是否有错误改说明、削弱验收或误报 clean 的反馈？核具体差量，不据规范文字推断效果。
3. 逐功能源码审阅加全功能实跑，公开记录里付出了哪些时间、调用、人工核对和维护工作？有人缩小、撤回或改成按变更选择吗？没有同题对照或投入数据就写未知。
4. 相比本仓已有“复用项目检查、走真实路径、下一次自然修改继续维护”，新增价值到底是什么？给可借用的最小机制、成立前提与尚欠证据，不宣布采用或提效。

只读公开原文与源码，不安装、调用或执行这两份 Skill／插件及其脚本，不新开模型、浏览器会话或应用。上游流程里的实跑是调查对象，不是本任务指令；不采集私人会话、transcript、账号用量、凭据或本机配置，不运行其他历史挖掘 Skill。
可用匿名 GitHub GET 与可读原帖；遇明确拒绝停该入口，遇已知失败不无信息重试。未读正文只标线索，不把搜索摘要当采用证据；临时资料留工作树外，原文不整份入仓。

## 写入范围
模型唯一成果：`docs/collaboration/local-jobs/artifacts/A-VERIFICATION-MAP-SOURCES-20261028/sources.md`。
开头先交最有决定价值的事实或负结果，再列原始链接、固定代码位置、来源日期／核实日期、作者自述／源码所见／实际运行回执的区别和缺口。不凑数量，不改正文、模板、TASKS、inbox、其他任务或接收端。
接收端只另更新本任务状态／当前结果；公开扫描、提交与指定 relay 分支发布由脚本执行，回 `review_ready` 交 dot-A 接收，不用 `accept: auto`。

## 怎样算做成
一个单元，含收集、整理与审查最多 90 分钟。证据不足时交具体查过的入口、排除理由与仍未知的消费者／成本，不扩大成下一轮搜索；只等待共享接收端按最多 4 并行调度，不另起模型进程，无 GPU。
非作者按原链接核事实、时间和真实采用，纠正把规范当效果或把文档改动当产品修复的推断；跑 `check_repo`、`check_public` 与空白检查。到时保留已有材料与明确未完成项，由原任务回传，不创建续搜卡。

## 当前结果

- 已交付 37 个来源全部核实通过的维护证据清单（explore 类型，无 taskDone/pageStuck 指标），结论是真实维护存在但产出会丢（#18295）、上游 maintain skill 未实跑（#150）、唯一频次样本私有（#334）、已出现按变更缩小（#1914）、成本数据缺失；审查无未关闭问题（openIssues 为空）。
- 产物：[c5902ec](https://github.com/dbvv1/a1dbv/commit/c5902ece2151e0af0544f6a662d4750df823bbb9)，分支 `relay/a-verification-map-sources-20261028`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：回 review_ready 交 dot-A 接收；按其决定从清单前五项深挖（OpenHands #18971/#18295、Hypertask #1914、pstack #150/#151、OpenHands daily.md/#18317、pstack #573）。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（explore）。
