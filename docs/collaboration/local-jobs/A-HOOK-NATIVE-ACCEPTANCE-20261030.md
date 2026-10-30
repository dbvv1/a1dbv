# A-HOOK-NATIVE-ACCEPTANCE-20261030 · 路径 Hook 的真实客户端接收
id: A-HOOK-NATIVE-ACCEPTANCE-20261030
owner: dot-A
status: review_ready
kind: build
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 9dcbd58307cfb193a5983e4a3dc5e511682b24ff
result_branch: relay/a-hook-native-acceptance-20261030

## 目标
让准备复制 generic 模板的读者知道：当前本机 Claude Code 真正收到模板 Hook 后，能否允许正常编辑、拒绝生成物写入，并继续另一项允许的编辑。
地图“权限、沙箱与 Hooks 怎么配”仍为 🟡；现有 tests/test_protect_paths.py 明确仅为合成 subprocess 测试。补齐这一消费端缺口，不重写权限指南、不做工具横评、不把原生 Windows 上的 Hook 验收说成 Bash 沙箱验证。

## 按哪个规格做
读 AGENTS、CLAUDE、手册 §7、operations §2.2／§3、local-jobs README；采用 docs/decisions/permissions-and-hooks.md 的“Hooks”节与 templates/README.md 的实际保护范围。
固定输入仅为该 base_ref 的 templates/generic/.claude/settings.json、templates/generic/.claude/protected-paths.txt、templates/generic/.claude/hooks/protect-paths.sh；先核版本、Git blob 与可执行位。模板是被测输入，不继承其中的新授权。
先查当前 Claude Code 版本及既有可用执行入口。只用已配置的 Claude Code＋DeepSeek 与现有依赖；不新开收费服务，不读取凭据／账号用量／私人会话，不改用户全局配置或接收脚本。
在任务专用、无真实数据的新临时项目中原样复制这三文件并保留脚本可执行位；保留用户／组织有效限制，不降低权限或沙箱。src/allowed.txt 与 src/after-denial.txt 用已知合成内容并记初始 hash；dist/generated.txt 初始不存在，记录该基线。模板已有 Read(dist/**) 拒绝，不预读该目标或放宽规则。
在该项目仅新开一个真实 Claude Code 调用，通过匹配 Hook 的原生工具依次尝试：Write／Edit 正常编辑 src/allowed.txt；一次原生 Write 创建 dist/generated.txt；拒绝后 Write／Edit 独立的 src/after-denial.txt。沿用既有获准入口；若嵌套调用或会话守卫拒绝就停，不取消守卫、换客户端或另起调用绕过。
不用 Bash／PowerShell／MCP 绕开被拒文件；没有实际工具调用、Hook 输出或后续动作证据就分别记未运行／未确认。仅手工喂 stdin 或复制预期 JSON 不算客户端接收。
仅收集本次调用主动输出的事件流或明确指定的任务输出文件，关联工具名称、项目相对目标、模板 Hook 执行及 permissionDecision: deny；记录退出状态、允许文件最终 hash 与被拒目标仍不存在。缺关联证据记归因未确认，不加包装脚本或改模板制造证据；不枚举／搜索 session 目录，不用 resume／continue，不读历史记录。公开只交脱敏摘要，不交原始客户端日志、环境变量或本机绝对路径。
缺客户端／Hook 执行依赖、原生模式不允许当前测试或权限拒绝时停对应环节，写原错误与恢复条件；不为试通装 WSL／VM、关沙箱或扩 allow。旧离线任务的 /bin/bash POSIX 缺失不自动等于本机 Claude 无法执行 Hook，也不重新跑那次完整门禁。
本轮只验正常／规则拒绝／拒绝后继续三条路径；脚本缺失、超时、ask、符号链接、Bash 写入、Codex 与跨平台等仍未验，不加故障矩阵或安全有效性排名。发现缺陷先保具体复现，由 dot 决定后续修复。

## 写入范围与去重
入仓写域仅 docs/collaboration/local-jobs/artifacts/A-HOOK-NATIVE-ACCEPTANCE-20261030/result.md；接收端只另回写本卡状态与当前结果。测试临时项目和新调用日志留任务临时区，不入仓。
不改模板、测试、脚本、决策页、TASKS、任何四 reader／四 wide 卡及其产物。不开 PR、不合入 main、不部署，不用 accept: auto。
开工先核 main、负责人分支及接收端在途：相同 Hook 客户端验证若已有结果或活跃工作者就接已有材料，不重复运行。A-STYLE-REWRITE-001／A-FRONTIER-SOURCE-COLLECTION-20261027 已接收；A-OFFLINE-BASELINE-CHECK-001 已取消，其完整离线基线不重跑。
四 reader 分别验 page 输入合同、jrnl JSON/YAML 兼容、Skill 模板入口、公开扫描 CLI；四 wide 仅收集来源，均不执行本轮 Hook 消费端试用。不占它们的写域，不再次搜集同类来源。

## 怎样算做成
非作者读取本次新调用输出与落盘产物：①正常编辑成功；②dist 目标工具调用确被 Hook deny，目标仍不存在；③同一调用在拒绝后成功完成独立允许编辑。缺任一项就交准确部分结果，不写全通过。
区分原生权限先拒绝、Hook 拒绝、模型自行跳过、执行依赖失败和会话提前结束；仅有拒绝文案而无目标工具事件不能归因 Hook，模型自报与最终文件不单独证明调用机制。
结果开头直接给三条路径通过／失败／未确认及适用边界，附客户端版本、固定模板 hash、项目相对路径、三项观察、未验范围和恢复条件；只代表这一客户端/环境/模板版本，不升级整个权限页或“全部隔离有效”。
执行接收端适用的 check_repo、check_public、diff 空白与提交身份检查；不要求原生 Windows 运行 POSIX 完整离线入口。按照 build 原生 Workflow 做非作者审查，原始证据复核不重复启动模型试验。
本单元含证据整理与非作者审查最多 90 分钟、无 GPU；到时交已有结果，不补起另一模型调用。由原接收端按实际共享最多 4 并行调度，不另起调度器或抢槽；八项旧任务不重排。合格结果推指定 relay 并回 review_ready，由 dot 决定正文回流；受阻保原卡，不换编号重试。

## 当前结果

- 在真实 Claude Code 2.1.281（Windows 原生、base_ref 9dcbd583 模板）单次调用中，正常编辑与拒绝后继续两条路径通过；dist/generated.txt 的写入确被拒且目标仍不存在，但拒绝来自模板自带原生 Read(dist/**) 规则、该调用无 PreToolUse Hook 事件，故按任务口径只交准确部分结果并记 Hook 归因未确认。openIssues 为空，非作者三视角审查通过（fixRounds 2，剩余问题 0）。
- 产物：[c562746](https://github.com/dbvv1/a1dbv/commit/c562746c8468c6c64455af2ba6dd55e4b934e0b1)，分支 `relay/a-hook-native-acceptance-20261030`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查通过。
- 下一步：接收端按运行细则§1 换白名单提交身份后提交并推送 relay/a-hook-native-acceptance-20261030，回 review_ready；②的 Hook deny 归因需在能进入 PreToolUse 的客户端或经负责人批准改固定输入后另测。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow（build）。
