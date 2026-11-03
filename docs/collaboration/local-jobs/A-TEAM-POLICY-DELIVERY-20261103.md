# A-TEAM-POLICY-DELIVERY-20261103 · 判断团队策略是否实际到达
id: A-TEAM-POLICY-DELIVERY-20261103
owner: dot-A
status: ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 17c984ae31ac532fe69bce0f89e72572f6651545
result_branch: relay/a-team-policy-delivery-20261103

## 目标
补读者地图“团队怎么推广”的一个实际操作缺口：管理员已配置 Claude Code 托管策略，但新机器、CI 或已有会话没有出现预期限制时，读者怎样判断策略未送达、已送达但未加载、当前生效源不同，还是 Hook 本身失败。
交供 18 团队页 §4 采用的有界操作稿和逐项来源，不改页面或真实配置。现页只有组织归属与安全边界原则，没有可照做的交付状态分流；不以增加治理台账为目标。

## 按哪个 Skill 与规格做
先读 AGENTS、CLAUDE、TASKS、手册 §7、operations §2.2 与 local-jobs README，fetch main 和负责人分支核去重／写域。按 write-task-guide 的真实问题、步骤与失败分流组织稿件；不运行模板、客户端或配置示例。
固定仓内输入为 base_ref 的 README 读者地图、docs/18-team-adoption.md §4、docs/research/2026-10-13-cloud-spend-boundaries.md 的策略交付段、docs/decisions/permissions-and-hooks.md。
复用 A-PERMISSION-BOUNDARY-FACTS-20261102 的已接收批准／沙箱事实，不重做配置键清单。已取消 TEAM-AI-CONTRIBUTION 是贡献准入，四张旧广扫不恢复；本题只核下列既定问题，不扩生态采集。
官方起点： https://code.claude.com/docs/en/server-managed-settings ，读 Verify settings delivery、Settings precedence、Fetch and caching behavior、Invalid entries、Enforce fail-closed startup、Platform availability 及必要直接引用；以 https://code.claude.com/docs/en/managed-settings 和 https://code.claude.com/docs/en/hooks 的相关契约交叉核对，记录实际读取日期／版本。不可读保留具体缺口，不换身份或绕过限制。
真实反例： https://github.com/anthropics/claude-code/issues/88896#issuecomment-5559553796 ，作者 hnoerenberg 于 2026-09-06 撤回 Windows PreToolUse 缺陷判断及两项测量；核完整纠正及后续，不复述早期已撤回的回归窗口。
该作者发现 allowManagedHooksOnly 与只定义 PostToolUse 的组织策略，但新一轮 debug 反证未做；策略定义、Hook 注册与实际执行分开，不写成本仓复现或已完成受控因果证明。不运行其删分支探针或复制私人路径／原始日志。
按读者操作组织四步：先确认版本、入口和凭据所属组织；用官方已有诊断查看当前交付／加载状态；按状态与设置源定位；由有权限的管理员决定修正后，再在获准测试环境验证目标行为。普通成员不靠改个人配置绕过托管策略。
只回答六个会改变动作的问题：①如何区分 loaded／未配置／fetch failed／fetch skipped，以及缓存仍适用的情况；②默认首次启动、已有缓存和会话中刷新各保证什么；③强制刷新键在哪些入口起作用、首次送达前提和认证子命令例外；④Console key、Team/Enterprise 登录及第三方／自定义入口为何可能收到不同策略或跳过；⑤远端与端点来源如何选择，何时不能把文件存在当成生效；⑥Hook 脚本自测通过为什么仍需检查注册和真实调用。
稿中只保留与上述判断直接有关的命令／键和来源，不编配置部署脚本，不生成通用企业政策。诊断原始输出可能含组织、路径或命令信息，只建议本地核看和最小脱敏分享，不索要或收集真实环境输出。
只读公开资料与固定仓内文件；不检查本机权限文件、凭据、私人会话或日志，不登录／切组织、安装／启动客户端、调用模型、执行 Hook、调整网络／权限／组织设置或联系第三方。

## 写入范围
只写 docs/collaboration/local-jobs/artifacts/A-TEAM-POLICY-DELIVERY-20261103/operation.md；接收端只另更新本卡状态和当前结果。
产物先给可供 §4 采用的短操作稿，再列原页缺口、关键主张对应来源与日期、真实反例的撤回／未知，以及未部署范围。不要复制整页文档或原 issue 日志。
不改 18 页面、其他正文、13、README 地图、模板、TASKS、旧卡、接收器或任何配置。旧页／模板写者状态未知不会授予本卡写权；后续采用由负责人核具体归属。

## 怎样算做成
非作者逐源核六问、当前文档与历史反例的区别；仅看操作稿应能回答“CI 没收到组织策略先查什么”“首次离线与缓存启动能证明什么”“脚本自测通过但 Hook 不触发先查哪层”，再回来源查其答案，不预设所有故障都归策略。
每条动作要有可观察结果和下一分支，明确需要管理员的变化；没有证据支持的分支保持未知。来源不可读的缺项不能补成结论，不把只读核查、文稿审查或作者自报当成真实部署／客户端实测。
保原页面评级、历史核实日期与已接收权限结论。本稿通过仅表示有界来源与操作说明可接收，不表示团队推广通过或 README 的 🟡 可以升级。
一个 60–90 分钟单元，最多两小时，共享最多 4 并行仅由原接收端调度，不另开调用抢槽；按既有 Workflow 非作者审查、check_repo、check_public、git diff --check 和提交身份检查，仅推 result_branch 后回 review_ready；不用 accept:auto，不合 main。
