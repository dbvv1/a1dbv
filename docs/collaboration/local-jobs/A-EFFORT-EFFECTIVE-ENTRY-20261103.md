# A-EFFORT-EFFECTIVE-ENTRY-20261103 · 分清所选档位与当轮生效档位
id: A-EFFORT-EFFECTIVE-ENTRY-20261103
owner: dot-A
status: ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 7be93247a8a9d5b55375c2eb87a4f62c3a7b15b9
result_branch: relay/a-effort-effective-entry-20261103

## 目标
解决模型分工页的具体操作缺口：读者已选 Claude Code 的 effort，怎样区分启动参数、当前设置与正在运行的这一轮，避免把没有实际换档误判为模型能力或成本差异。
固定入口：docs/decisions/model-roles.md L14、L17 给 --effort medium 和“记录实际模型 ID 与 effort；无法确认则未知”，L30 建议同模型试 high，但尚无所选档位的来源／生效时点诊断。原命令与未知边界不是事实错误，本卡只补能避免错误比较的必要步骤，不重新选默认档位。

## 按哪个 Skill 与规格做
读 AGENTS、CLAUDE、TASKS、手册 §7、operations §2.2 与 local-jobs README；fetch main 和负责人分支，核同题、已回结果和写域。发现同原子稿只报告归属，不重复执行或用新卡接旧 reader。
固定输入：base_ref 的 docs/decisions/model-roles.md 全页、docs/01-agents/claude-code.md §2、docs/02-models-and-cost.md“同模型换推理档保留缓存前缀”；Codex API 已有基线／configuration_update 边界只作排除，不能套到 Claude。
主要来源：https://code.claude.com/docs/en/model-config#adjust-effort-level ，连读同页 Set／Check／When a new effort level starts／Send no effort level 及相关版本说明；必要时仅追对应官方设置或 CLI 参数定义。记录观察日与文档给出的版本，没有引入版本就写未标明。
先形成“设置来源→适用模型与上限→当前轮或下一轮→可见证据”的短诊断路线；不把页面标题、保存配置、模型自述或一条启动命令当作完整运行证据。当前官方只证明设置状态的显示，必须保留不能据此确认请求已按某档执行的边界。
核最小实际分支：环境变量与会话选择／启动 flag 的优先级；模型能力与已存在的 cap；Skill／子代理的临时覆盖；换档确认后新消息的生效时点。只核会改变读者动作的条件，不复制整张设置参考表或拆成新团队策略卡。
说明单次启动、交互保存、单会话选择与 max 的持久范围，区分 API 默认与客户端默认；只给操作说明，不要求修改读者原设置。自动模型 fallback 等不是本卡主线，只有直接影响判断时引用原文并限定。
官方诊断命令只作为未执行的用户操作稿；区分 /effort status 展示的设置、auto 与当前档位、旧版显示问题。不能称它单独证明当前工具请求实际值，也不建议靠模型回答、私有轨迹采集、抓包或上传日志取证；无法由获准可见信息判断就保留未知。
真实反例：https://github.com/anthropics/claude-code/issues/35904#issuecomment-5348008599 ，维护者 2026-08-19 以 v2.1.233 复现设置 max 未持久并说明预期契约；只作历史已证场景，当前取值按现行官方文档。
历史误诊对照：https://github.com/anthropics/claude-code/issues/80940#issuecomment-5089278074 是 2026-07-27 用户在 v2.1.220 的换档无效测量；维护者 https://github.com/anthropics/claude-code/issues/80940#issuecomment-5351104376 于 08-20 明确 WebSearch 400 已在 v2.1.221 修复。保两者，不称当前仍有该故障、不重跑旧复现或照抄旧 workaround。
去重：MODEL-EFFORT-READER-20261029 是 jrnl#1908 修复及原返工，本卡不补其模型记录或接收；MODEL-EFFORT-PRACTICE-20261027 是已取消的采用／比较广采，退出未知，不取回、续跑或细分重派；MODEL-ENTRY 已接客户端最低版本与 Cloud 入口。Agent facts@6f36b1c 的参数／默认值七节已读，不重核同题；其未给本次所选／当轮的诊断路线。
只读公开官方文档、上述历史 issue 和固定仓内文件；不读取用户设置、HOME、环境变量、账号、账单、凭据、私人会话或日志，不安装／启动 CLI、SDK、模型、代理或抓包，不改个人／组织设置，不做付费请求或外部写入。

## 写入范围
只写 docs/collaboration/local-jobs/artifacts/A-EFFORT-EFFECTIVE-ENTRY-20261103/proposal.md；接收端只另更新本卡状态和当前结果。
先交 model-roles 第一步之后可直接采用的最小增补稿，或指向唯一权威位置的短入口；随后附原句、来源位置、版本／日期和诊断分支。细节可以留在候选附录，不把模型选择页变成配置大全。
不改模型页、02、Claude 深页、18、研究正文、模板、13、TASKS、其他卡、原 reader、接收器或配置；后续正文采用另由负责人核写者与差量，未知旧调用保持隔离。

## 怎样算做成
非作者逐源复核后，只读稿件回答三问：①已有环境变量时 --effort 能否保证新档？②当前轮未结束、标题已变，能否认定正在按新档执行？③保存 max、选择 max 与 API／客户端默认是否等价？给准确条件、可见证据和仍未知范围，不要求真实账户试验。
核所给查看入口没有暗含改配置或发模型请求，历史已修故障未当当前问题，旧 reader 的未知保持未知。通过只表示有限操作稿可接收，不证明客户端实跑、请求档位、模型效果、用户资格或地图实做完成。
一个 45–75 分钟单元，最多两小时；共享最多 4 并行由原接收端调度，不另起调用。经既有 Workflow 非作者审查、check_repo、check_public、git diff --check 与身份检查，仅推 result_branch 后回 review_ready；不用 accept:auto，不合 main。
