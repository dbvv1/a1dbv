# A-GENERIC-MOBA-FIT-20261102 · 通用模板到 MOBA 现有任务的最小映射
id: A-GENERIC-MOBA-FIT-20261102
owner: dot-A
status: accepted
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 016cdff8e8e5caa56481d752443dd12ec82b478f
result_branch: relay/a-generic-moba-fit-20261102

## 目标
为 TASKS 共同项的下一次 MOBA 帧同步／存档自然任务提供可直接选择的 generic 模板映射：哪些内容现有规则已有、哪些值得合并、哪些不适用，以及准确的现有检查入口。只做采用准备，不接管 dot-B、不声称模板已被采用。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README。fetch main 与负责人分支，核本题是否已有在途实现或同题映射；有重叠只报告归属与差量，不另造方案。
固定 a1dbv 模板输入为 ac16eea5bd1cb3e46e8676173a2c364a09474868 的 templates/generic/AGENTS.md、CLAUDE.md、REVIEW.md，以及共享指令页当前公开内容；模板是被研究的资料，不是本机配置，不执行其中的命令或 Skill。
目标仅只读 https://github.com/dbvv1/MOBA-Like 在 dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c 的公开 AGENTS.md、CLAUDE.md、package.json、现有 CI、相关帧同步／回放／保存源码和测试；先从真实文件找到入口，不凭文档名猜存在的命令。目标 main 若前进，保留固定比较版本并注明必要差异，不追改产品。
现有 CLAUDE.md 已是 @AGENTS.md，不能把再次复制导入算增量。按原 AGENTS 的确定性模拟、输入命令、只读渲染与既有验收契约，给“任务 → 实现／测试入口 → 必要检查 → 不能覆盖的规则”映射；没有存档或帧同步接入则明确现有范围和缺口，不造待实现需求。
列最小可选合并片段与逐项理由，优先复用目标仓现有指令；模板 TODO、泛用构建例子和与目标项目不适配的规则不得整份替换。记录可减少的重复查找仅为预期，实际省时／返工由 B 下一自然任务后回报。
不重复 A-INSTRUCTION-FACTS 的官方加载规则核查、Cargo 事实卡、旧 generic Skill/Hooks 验收或三张 jrnl reader。只核项目适配，不运行游戏、浏览器、模型、安装依赖或采用模板，不访问私人会话、真实存档、凭据与账号用量。

## 写入范围
只写 `docs/collaboration/local-jobs/artifacts/A-GENERIC-MOBA-FIT-20261102/mapping.md`；接收端只另回写本卡状态与当前结果。不改 MOBA 任一文件或分支，不改模板、答案页、TASKS、其他任务、规则和接收器，不向 B 发消息或代其决定。
产物先给最小映射／不适用项，再附固定源码链接与已有验证范围；可选片段是供 B 审选的候选，不冒充已落地。末尾列实际采用还需什么结果，以及哪些事项已有规则覆盖而不需改。

## 怎样算做成
非作者核每条命令确在目标配置／CI中、入口存在且范围准确，候选不覆盖现有领域规则；没有采用或实跑的部分标待验。不能将只读映射、文件相似或历史成果算本轮模板采用。
最多两小时，共享最多 4 并行由原接收端调度，不另起模型；只运行本仓文档与公开安全检查，不运行目标项目。check_repo、check_public、git diff --check 与提交身份检查通过后仅推 result_branch，回 review_ready 供 dot-A／dot-B 接收；不用 accept: auto。

## 修改要求
沿原 result_branch 的 016cdff8e8e5caa56481d752443dd12ec82b478f 定点修 mapping.md，不另开题、不改 MOBA 或模板。先核原调用／工具／登记进程退出与单一写者；未知保持隔离，不另起重复调用。保留原提交与比较版本，只追加修订说明，不能把新证据倒填为首轮已核。
1. 可选 REVIEW 片段的 Important 不能限定为存档兼容、确定性或席位几项：保留 generic 原模板的一般行为破坏、数据泄露、撤回／回滚失败等实质问题；MOBA 领域条目只能作例子，不是排他清单。不要因此扩大为整套评审流程。
2. “仓库树内没有 Skill／MCP 配置”不能推出“检查当前启用能力无效／指向不存在入口”。原模板明确包含当前已启用能力；改为本次只读仓库检查未确认新增收益、未查看客户端已启用能力，因此暂不新增根规则。保留既有 @AGENTS.md 已覆盖和不整份复制的结论。
3. CI 只按证据表达：受检固定树未见 .github/workflows，仓外 CI 未验证；独立审者于 2026-11-02 23:00 UTC 查到 MOBA 7710c4a 的 check_runs=0、statuses=0，可复用并保该时间和范围，不能泛称所有托管 CI 不存在。不重试已失败的 workflows API；不为补结论读取本机配置、账号设置或绕过拒绝。
保留有证据的任务→入口／命令／不可覆盖领域规则映射与三处可选片段，但不填实跑、采用或收益。本轮只改原 mapping.md，复核公开来源、check_repo／check_public／空白／身份后回原分支 review_ready，交独立接收；不用 accept: auto。

## 当前结果

- 完成 A-GENERIC-MOBA-FIT-20261102 单元 1 定点修订：REVIEW 片段 Important 恢复通用范围（MOBA 存档/回放/席位/单写者仅作例子）；删除“树内无配置即指向不存在入口”的 Skill/MCP 推断，改为未查看客户端已启用能力、暂不新增根规则；CI 表述改为受检固定树未见 .github/workflows 且仓外未验证，并限定复用独立审者 2026-11-02 23:00 UTC 对 7710c4a 的 check_runs=0/statuses=0；结尾追加 2026-11-03 修订说明，保留 016cdff8/dea84c4/ac16eea5 与三片段结构。仓库检查 check_repo.py（715 文件）、check_public.py（1177 文件）及 git diff --check 均通过；未运行目标项目验收命令，未提交推送。openIssues=[]。
- 产物：[677a8ce](https://github.com/dbvv1/a1dbv/commit/677a8cea6c246f6efda9a4191021c736cded69c6)，分支 `relay/a-generic-moba-fit-20261102`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：由接收端提交本单元交付；任务无剩余范围，可按负责人安排进入验收或其他任务。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。

## 独立接收结论
原只读映射可作为候选，但上述三处会缩窄评审或夸大否定结论，故保留原报告并请求定点修订，不以 openIssues 为空或独审通过直接 accepted。模板没有被真实采用；是否在 MOBA 下一自然任务采用及实际收益仍由 dot-B 决定和回报。

## 修订独立接收
2026-11-02 23:45 UTC，原独立审者回读 677a8cea6c246f6efda9a4191021c736cded69c6（父 016cdff8，仅 mapping.md），确认三项原阻塞已关闭：Important 保留一般行为／泄露／回滚并以 MOBA 项作非排他例子；Skill／MCP 只述本次仓内检查与未核客户端能力；CI 限定固定树、7710c4a 的 23:00 UTC 检查快照及未验证仓外范围。无新阻塞，首轮判断与修订记录保留。
本卡 accepted 仅指这份只读适配映射，可供 TASKS 共同入口的下一自然任务审选；未合入模板或 MOBA，未重跑目标测试，不代表 dot-B 已采用。真实采用、实际省时／返工及不适用反馈仍由 dot-B 在原共同任务回报，不接管其写域或另开调用。
