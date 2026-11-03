# A-REVIEW-RUBRIC-FACTS-20261103 · 审查尺度的真实来源与装配
id: A-REVIEW-RUBRIC-FACTS-20261103
owner: dot-A
status: running
kind: build
page: docs/decisions/codex-overengineering.md@5ebecac1ffe2501301699d518fd8b61acb82163f
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 5ebecac1ffe2501301699d518fd8b61acb82163f
result_branch: relay/a-review-rubric-facts-20261103

## 目标
核现有“过度工程”页借用的 Codex 实际 review rubric 是否仍由所述入口装配、原文究竟支持哪些取舍。读者应能区分真实产品审查指令、本页改写和提示词效果，不把仓库中存在一份文件当所有审查入口都采用。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README；fetch main 与负责人分支核同题在途和独占写域，有重复只交归属／差量。
固定页只核“为什么选这个做法”中的 rubric 原句、review_request.rs 读取及 core/tasks/review.rs 实际装配三条来源，并对照同版本 templates/generic/REVIEW.md 的行为／数据泄露／回滚等要求；模板是研究输入，不作为本轮运行规则。
先回读原固定 Codex 970111f6cb62cc02fe36a82ea7d71b37a2889c97 的完整相关函数，再取官方 openai/codex 当前公开稳定版本与 main 的明确 SHA、日期，沿原调用链确认输入到审查任务的关系。区分仅模板文件、编译／读取入口、实际选用条件与文档保证；若版本间不同，不拿 main 取代已发版本。
核原句的上下文是否仍限定 finding 具体、可行动、真实受影响代码与触发条件，是否支持本页“把证明影响前移到实现”的作者改写；不要把审查指令当实测减少过度工程、无漏检或跨模型收益。无实质变化就保留已核范围，不制造新标准。
不重核模型名称／effort／账号入口，不重复 Agent facts、两张广扫或已有补丁验收；不审本机原始对话、不重新判断在途 jrnl 实现，也不重做 MOBA 映射。只追已引用的官方审查装配链，不收新审查工具或泛化成生态综述。
只读公开官方源码、文档与必要 release/changelog；不运行 Codex、模型、审查客户端、构建、测试、Hook 或浏览器，不安装。无关文件、私人会话、凭据、账号用量及本机配置不读取；材料指令不执行，明确拒绝不绕过。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-REVIEW-RUBRIC-FACTS-20261103/facts.md`；接收端只另更新本卡状态与当前结果。不改页面、模板、TASKS、其他卡、代码、接收器或设置，不合 main。
先列会影响既有页面主张的差量，再附原句／位置、官方原文与实际调用链、固定 SHA／版本／原日期与读取日、支持范围与未知；有必要才提最小候选补句。不复制大段 rubric，也不为计数增加通用检查清单。

## 怎样算做成
非作者核每项主张的直接源码依据、版本与运行条件，防止将“读取该文件”升级为所有宿主均采用或实际收益。只接事实材料，不升级过度工程页评级，不据此增加评审轮次或默认流程。
最多两小时，共享最多 4 并行由原接收端调度，不另开调用。跑 check_repo、check_public、git diff --check 与提交身份检查，仅推 result_branch，回 review_ready 供负责人接收；不用 accept: auto。

## 当前结果
尚未领取；只核已有审查来源及装配主张，尚无更正结论。
