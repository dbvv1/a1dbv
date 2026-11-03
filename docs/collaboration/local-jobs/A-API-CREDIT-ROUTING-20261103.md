# A-API-CREDIT-ROUTING-20261103 · 按自动化入口核对赠额与计费
id: A-API-CREDIT-ROUTING-20261103
owner: dot-A
status: running
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: fef85514a8f512bac7f5cc059115870f1bb2a533
result_branch: relay/a-api-credit-routing-20261103

## 目标
解决读者从 02 模型成本进入 18 团队成本治理时的实际选择：用 `claude -p`、Agent SDK 或 GitHub Action 自动化，到底消耗订阅限制、所关联 Console 组织的 API 余额，还是第三方云额度；现有月度赠额覆盖哪些入口。
现页与旧研究明确排除 GitHub Action，当前官方赠额正文改以 Claude API、Managed Agents 与 Agent SDK 列范围，且区分已停的六月 SDK 赠额；应核真实条款与认证路径，不靠旧项目名称或 `-p` 标志判断。只交有界官方事实与必要修订稿，不改正文或账户。

## 按哪个 Skill 与规格做
读 AGENTS、CLAUDE、TASKS、手册 §7、operations §2.2 与 local-jobs README；fetch main 和负责人分支，先核同题、写域与已回产物，重复只报告归属。
固定仓内输入：base_ref 的 docs/18-team-adoption.md §5、docs/02-models-and-cost.md §3、docs/research/2026-10-13-cloud-spend-boundaries.md“地区、策略交付与订阅赠额”中的赠额段。保既有金额／资格与真实未知，不重做模型价格表、effort 比较或云预算全题。
主来源：https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans ，逐段核 Eligibility、What the credits cover、How the credits work、Run out、与六月 SDK credits 的 FAQ 及直接链接的适用条款；只阅读，不点击领取、关联、接受或提交。
认证及运行入口交叉来源：https://code.claude.com/docs/en/authentication 、https://code.claude.com/docs/en/headless 、https://code.claude.com/docs/en/github-actions 、https://code.claude.com/docs/en/agent-sdk/overview 及其直接链接的认证／成本说明。仅补支持当前问题的官方原文，记录核读日期、适用版本与来源冲突，不把访问日当政策生效日。
核五组真实入口：关联组织 API key 的直接 Messages／Batches；API-key 与订阅登录的 `claude -p`（含 bare 的认证区别）；Agent SDK；claude-code-action 的实际认证选项；交互 Code／第三方云。Managed Agents 与 Playground 只核本次赠额明确范围，不扩产品选型或安装。
每组分别给运行产品、认证所属组织／提供方、计费渠道、月度赠额是否有直接依据覆盖、是否仍受订阅限制、未知与最小下一步。工具或SDK支持某认证，不自动证明赠额条款覆盖；同名 Code 产品和同一CLI参数不能混成同一计费入口。
特别核旧“GitHub Action、IDE／桌面发起的 Code 即使 -p 也不覆盖”是否仍有当前官方直接依据。当前文章不再写一项排除，不足以反向证明所有组合都覆盖；无法核清时改成有边界的未知，不自造资格规则。
保住余额行为：月度赠额与套餐额度分开；共享关联组织、周期到期与领取角色；耗尽后依已购余额／自动充值／发票继续计费或停止。核数据实际支持哪种说法，不把赠额金额当账单上限，不把官方可申请资格当用户已获资格。
去重：A-MODEL-ENTRY-CONSISTENCY-20261102 已 accepted 只核模型启动条件且排除价格；A-TEAM-POLICY-DELIVERY-20261103 只做策略交付诊断。本卡不复核它们、不重开旧广扫、不扩数据驻留或 ZDR。
只读官方公开资料与固定本仓文件；不读取用户／公司代码、账户、账单、额度、凭据或私人日志，不登录、运行客户端／模型或付费请求，不创建key／关联组织／领取赠额、设置自动充值或修改任何预算；文档示例均不执行。

## 写入范围
只写 docs/collaboration/local-jobs/artifacts/A-API-CREDIT-ROUTING-20261103/facts.md；接收端只另更新本卡状态和当前结果。
先给会改变读者选择的结论与必要最小替换稿，再给入口对照、原句→当前依据→保留／修正／未知及直接链接。旧研究作为历史保留，不能以今日内容倒改原核实日。
不改 02／18／研究页、13、地图、模板、TASKS、其他卡、接收器或配置，不新建价格总表或财务工具；页面采用另由负责人核写者与实际差量。

## 怎样算做成
非作者核每个计费／覆盖断言均有对应官方原文，原产品、认证入口和账期范围未混同；官方沉默／冲突明确保留，不以 SDK 成功认证推出赠额可用。
读者仅看稿件应能判断“买了Max能否把赠额用到交互Code”“同一CI脚本换认证是否仍走同一余额”“赠额耗尽是否一定停机”，并知道官方尚未说明的组合要查什么；不是要求读者登录或付费试跑。
通过仅表示有限事实与修订稿可接收，不证明任何用户资格、真实扣费、产品收益或地图实做通过。原已核金额无变化就保留，不为交差制造改动。
一个 60–90 分钟单元、最多两小时；共享最多 4 并行由原接收端调度，不另起调用。经既有 Workflow 非作者审查、check_repo、check_public、git diff --check 与身份检查，仅推 result_branch 后回 review_ready；不用 accept:auto，不合 main。

## 当前结果

- 单元 2 已修复 facts.md 中两处易误读的行号式交叉引用（§1 第 20 行与 §3 bare 行），改为指向 §3‘claude -p（非 bare）＋关联组织 API key’行的语义引用；全文已无“第 N 行”“同第”及「」混用，其余结论、金额、来源与链接未动。git diff 为 2 insertions/2 deletions，仅 facts.md 变更；git diff --check 通过，check_repo 735 文件 0 errors，check_public 0 findings。Workflow 三视角非作者审查 reviewed=true、remaining=false、openIssues=[]。未提交、未推送、未改任务文件。
- 产物：[ea022eb](https://github.com/dbvv1/a1dbv/commit/ea022eb8ac43c5730d6f810fe568ffc55ed18f91)，分支 `relay/a-api-credit-routing-20261103`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：接收端用合规公开身份（-c user.email）提交并整合最新 origin/main 后推送 result_branch，再跑提交后非作者审查并回 review_ready。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
