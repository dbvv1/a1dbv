# A-MODEL-EFFORT-PRACTICE-20261027 · 真实编码任务中的模型与推理投入取舍
id: A-MODEL-EFFORT-PRACTICE-20261027
owner: dot-A
status: revision_requested
kind: explore
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 6e1f49b9001b9daa72446646128fa38cd8f15c77
result_branch: relay/a-model-effort-practice-20261027

## 目标
让读者能为实现、调试或审查选模型与 effort：找真实使用者做过的采用、比较或撤回，交可回源材料给 dot-A，补当前模型分工页的实践证据；不另跑正式 benchmark，不重做价格汇总。

## 按什么做
按 `templates/generic/.claude/skills/explore-frontier/SKILL.md` 与 `kind: explore` 原生 Workflow，三路采集、逐链接核实后整理、再审查。
先读 `docs/decisions/model-roles.md`、`docs/02-models-and-cost.md`、inbox 与本日已接收 sources 去重；已有 Cloudflare、Cursor、OpenAI Core Experimentation 及 Terra 基准表不按新日期重写。
优先近三个月、当前模型代际；去原作者工程博客、技术社区讨论与评论、GitHub 实际 PR／配置／issue、演讲材料找，不限固定站点。知乎、小黑盒等也能作线索，但不得用标题摘要补写未读正文，不以站点名气代替内容证据。
围绕真实决定：何时从低投入升档、何时强模型审查而较便宜模型实现、何时升档仍失败或被撤回。不要把来源相异的排行榜拼成同题比较。
逐项保留模型／版本／effort、日期、宿主、任务与验收、原配置和改变、人工修补／等待／总调用成本中公开可见的部分；缺失就写未知。作者自报、公开产物和第三方复现分开。
读正反回复及后续纠正，沿最强线索找代码或具体结果；广告、转载、无任务的胜负印象直接淘汰。同源跨站转载合并，无固定条数，零增量可交明确负结果。
不读取账号用量或私人会话，不登录、不注册、不调用新模型、不安装工具。公开文章自报的费用可引用，但不能当本仓账单或调用效果。明确拒绝停对应入口，不换身份或路径绕过。
遇已知 TLS 技术失败的 LINUX DO／V2EX 路径不重复探测；继续其他可读公开来源，说明覆盖缺口。可由 dot-A 后续补原文，不能把未读写成没有反馈。

## 写入范围
唯一成果：`docs/collaboration/local-jobs/artifacts/A-MODEL-EFFORT-PRACTICE-20261027/sources.md`。
先写有决策价值的材料，再附原链接与必要缺口；不列网站巡检清单，不改决策页、13、inbox、TASKS、默认或接收端。
接收端只另更新本任务状态／当前结果，推指定 relay、回 `review_ready`；不用 `accept: auto`。推荐与发布由 dot-A 接收后做。

## 验收
原链接逐项支持主张；比较条件、相反反馈、实际使用者与宣传区分清楚；本仓已收内容不重复。按原生 Workflow 审查与修正，过 `check_repo`、`check_public`、空白检查。
一个单元最多两小时，共享四并行由接收端调度；不用任务数量或采集条数证明产出，不为找到工具另造采用任务。

## 修改要求：先交本轮现有结果
本轮先收口已核材料，明确未覆盖和未完成项；没有合格增量就交具体负结果，不再扩采集或重开整轮。
若仍有在途调用，在安全边界保留其现有产物后回传本单元；沿原任务和分支接续，不丢弃已有工作、不重复初次调查。
