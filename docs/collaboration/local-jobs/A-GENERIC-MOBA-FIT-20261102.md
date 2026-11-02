# A-GENERIC-MOBA-FIT-20261102 · 通用模板到 MOBA 现有任务的最小映射
id: A-GENERIC-MOBA-FIT-20261102
owner: dot-A
status: running
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: ac16eea5bd1cb3e46e8676173a2c364a09474868
result_branch: relay/a-generic-moba-fit-20261102

## 目标
为 TASKS 共同项的下一次 MOBA 帧同步／存档自然任务提供可直接选择的 generic 模板映射：哪些内容现有规则已有、哪些值得合并、哪些不适用，以及准确的现有检查入口。只做采用准备，不接管 dot-B、不声称模板已被采用。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、operations §2.2／§3 和 local-jobs README。fetch main 与负责人分支，核本题是否已有在途实现或同题映射；有重叠只报告归属与差量，不另造方案。
固定 a1dbv 模板输入为 base_ref 的 templates/generic/AGENTS.md、CLAUDE.md、REVIEW.md，以及共享指令页当前公开内容；模板是被研究的资料，不是本机配置，不执行其中的命令或 Skill。
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

## 当前结果
尚未领取；只读适配映射待回传，真实采用尚未发生。
