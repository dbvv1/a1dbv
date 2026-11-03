# A-PRODUCT-AUTH-BOUNDARY-20261103 · 核对自建产品的认证复用边界
id: A-PRODUCT-AUTH-BOUNDARY-20261103
owner: dot-A
status: accepted
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 08068d7808ca9b57fd899c3acd224882b3ef86d1
result_branch: relay/a-product-auth-boundary-20261103

## 目标
解决 16 页读者把现成 Codex harness 嵌入产品时的实际选择：技术上能调用 app-server 的认证接口，是否等于可以把同一认证入口用于本地开源工具、个人自托管程序或商业托管服务；何时核 Sign in with ChatGPT，哪些运行契约不能沿用普通 API 假设。
固定原句：docs/16-building-agents.md L9“产品化也可以复用”，L95 将 app-server 列作含认证的富客户端接口，L113“需要自定义客户端的认证、审批和事件交互时选 app-server”；L117 已保留远程部署与认证须另核的提醒，但尚未给当前官方认证使用范围。这不是推翻复用 harness，也不是判定所有商用 Codex 实现违规。

## 按哪个 Skill 与规格做
读 AGENTS、CLAUDE、TASKS、手册 §7、operations §2.2 与 local-jobs README；fetch main 和负责人分支，先核同题、写域及已回结果。重复只报告归属，不另做已完成的接口或广扫。
固定输入：base_ref 的 docs/16-building-agents.md §1–3、docs/research/2026-10-10-audit.md 的 S6a、docs/research/2026-10-12-long-task-evidence.md 的“凭证与远程入口”行；只核认证复用、部署类别与必要请求契约，不扩整页自建选型。
官方起点：https://learn.chatgpt.com/docs/app-server#auth-endpoints ，逐字区分 app-server authentication 与 app-server harness。当前文档允许原有 local／open-source 应用继续使用并建议迁移，另明确 commercial／hosted services 不属于该认证使用范围；准确归属官方文档，不能扩大成法律判决、全部 SDK 禁商用或已知项目违规。
交叉来源：https://developers.openai.com/siwc/quickstart 、https://developers.openai.com/siwc/token-sharing-open-source 、https://developers.openai.com/siwc/token-sharing-open-source/codex-app-server 、https://developers.openai.com/siwc/token-sharing-open-source/self-hosted-vms 、https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations 。只读相关段落及确有必要的直接链接，不点击申请／注册／授权。
历史与当前范围对照：https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt （页面发布日期 2026-09-28）。区分教程的本地／收费或托管限制、当前 selected private clients／商业 limited trial 与 self-hosted VM 指南；不能仅凭“远程”判所有自托管 VM 禁用，也不能凭 VM 指南推为面向公众托管服务普遍开放。官方未澄清组合明确保留未知，不自己发明资格规则。
先给选择表：①现有本地／开源 app-server 认证；②Sign in with ChatGPT 身份登录；③明确获准的 plan usage；④个人自托管 VM；⑤付费或面向他人的托管服务。各行写对象、官方支持范围、仍需核的资格、允许保留的 harness 与未知；不以产品标签替代实际运行与服务对象。
只补会改变选择的接口限制：身份登录不等于 plan usage 授权；普通 API 支持不等于该 OAuth 路由支持；原生本地 shell／MCP／子代理与 hosted Responses 工具分开；model/list 可能只是内置目录，不证明模型可用。引用当前 preview 限制，必要时给最小非执行示意，不搭认证实现或完整教程。
核文档日期、适用客户端版本与事实层级；文档未给引入版本就写未标明，不猜最低 CLI 版本，不把今日读取日当生效日。保 S6a 的历史日期，提供最小必要增补或替换稿，不追改旧事实。
去重：全 138 份 local-jobs Markdown 输入核查未见此原子题；A-REVIEW-RUBRIC-FACTS-20261103 仅同名 app-server 的评审路由；A-API-CREDIT-ROUTING-20261103 是 Claude 赠额／计费，A-TEAM-POLICY-DELIVERY-20261103 是策略送达，均不重做。不重启旧 SDK／长程广扫，不占 16 页或未知旧模板写者。
只读公开文档及固定仓库；不安装／执行 Codex、SDK、DevKit 或示例，不生成或读取 host ID、账户、token、cookie、凭据、私人日志，不登录、注册client、申请资格、转移或保存凭据、访问账单、发模型／付费请求、开放监听或修改权限。文档示例均非本卡执行授权。

## 写入范围
只写 docs/collaboration/local-jobs/artifacts/A-PRODUCT-AUTH-BOUNDARY-20261103/facts.md；接收端只另更新本卡状态和当前结果。
先给读者结论和最小修订稿，再给固定原句→官方原文位置→保留／补条件／未知，以及五类入口的可核依据。限量短引文加概述，完整来源保直接链接。
不改 16／研究正文、13、地图、模板、TASKS、其他卡、接收器或配置；后续正文采用另由负责人核具体写者和差量。

## 怎样算做成
非作者逐源反读核心边界，核没有把 app-server 认证限制扩大为整个 harness／API 商用限制，没有把 selected partners 写成普遍开放，也没把自托管 VM 与多用户托管服务混同。
读者仅看稿件应能回答“自制收费服务能否直接照搬既有 app-server 登录”“身份登录成功是否就获模型额度权限”“model/list 有模型、或本地 MCP 可用是否证明托管工具也可用”，并知道未明确的资格该到哪个官方入口核查；不要求登录或试跑来完成文稿。
通过仅表示有限官方事实与修订稿可接收，不证明用户／第三方项目有资格、实际运行成功、法律合规或模型收益，不升级地图实做状态；无证据的变化不制造修订。
一个 60–90 分钟单元，最多两小时；共享最多 4 并行由原接收端调度，不另起调用。经既有 Workflow 非作者审查、check_repo、check_public、git diff --check 与身份检查，仅推 result_branch 后回 review_ready；不用 accept:auto，不合 main。

## 修改要求
沿原 result_branch 从 08068d7808ca9b57fd899c3acd224882b3ef86d1 仅修 facts.md 下列同类两处及必要同步，固定受检 16 页仍为 0efa86a8；原首轮产物和自报结果保留在历史。先由原接收端核调用、工具及登记进程均已结束、原产物单写；缺证保隔离，不启动续接或改旧文件。不新任务／新读者，不登录、申请、执行认证或模型，不改 16 页、配置、其他卡或正文。
1. L50 资格列“应用是否获批”改为“应用是否属于当前开放范围；selected private／商业合作路径是否获得相应资格”；未知列仍保留文档措辞差别，不给所有 OSS plan usage 增加统一事前人工审批步骤。
2. L71“应用获批”改为“身份登录不够；plan usage 要另授相应 scope，并满足应用开放范围及用户资格，不能仅凭身份登录成功判断”。保 selected private、商业 limited trial、用户 plan／workspace 和实际 scopes 的条件，不反向宣称任意应用或账号都无条件可用。
依据为官方 https://developers.openai.com/siwc/quickstart 首段及 understand-scopes、https://developers.openai.com/siwc/token-sharing-open-source#introduction 与 https://developers.openai.com/cookbook/articles/sign-in-with-chatgpt ：partner apps 的 approved 限定不能泛化，OSS 指南描述登录时动态注册。只反读已给原文，不扩查申请标准或执行流程。
其余已核核心保留：harness 复用不等于认证用途开放、个人自托管 VM 不等于多用户托管授权、model/list 目录不证明可用、hosted 工具与本地工具／HTTP／WebSocket 边界；不为这两句扩写整页。非作者定点核差量后回 review_ready，仅接有限官方事实与建议稿，不凭 Workflow pass 认定真实产品资格、法律合规或客户端运行通过。

## 当前结果

- facts.md 已按修改要求修订两处：L50 资格列改为应用是否属于当前开放范围及 selected private／商业合作路径资格；L71 改为身份登录不够、plan usage 需另授 scope 并满足应用开放范围与用户资格。未把 partner approved 限定泛化到全部 OSS plan usage，保留 selected private、商业 limited trial、用户 plan／workspace 与实际 scopes 条件。三视角审查通过，openIssues 为空；check_repo 0 errors、check_public 0 findings、git diff --check 通过。仅 facts.md 2 行变更，未提交、未推送；提交后的身份检查与页面正文是否采用修订稿仍待处理。
- 产物：[0da50b9](https://github.com/dbvv1/a1dbv/commit/0da50b9758479c0c338a83b10c17f9f6c3d69028)，分支 `relay/a-product-auth-boundary-20261103`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：接收端提交 facts.md、仅推 result_branch 后回 review_ready，并在提交后执行身份检查；16 页正文是否采用最小修订稿及具体写者与差量由负责人另定。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 负责人限定接收（2026-11-03）
0da50b97 经非作者沿 08068d78 定点复核，仅 facts.md 两句 2+/2-，已去掉把 partner approved 泛化为全部 OSS 统一事前审批的误述，改按当前应用开放范围、selected private／商业路径资格、用户 plan／workspace 与实际 scopes 判断。其余已核认证用途与 harness 分界、个人 VM／多用户托管区别、model/list 与 hosted 工具／HTTP／WebSocket 条件保留；接收为有限官方事实和最小修订稿，不证明任何具体用户／产品获资格、法律合规或实际请求可用。
原模型阶段“未提交／待身份检查”的描述保留；独审已另核产物父链、单文件范围、noreply 作者／提交者、空白，以及 07:30:51 UTC 原 relay 精确指向 0da50b97。此实际发布证据不证明本机原调用、工具或登记进程已退出；不改写旧阶段记录。无客户端、SDK、模型、认证或账号实跑，不改 16 页或评级；未知旧页写者仍隔离，后续正文采用另核具体写域。
