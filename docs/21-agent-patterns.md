# 21 · 从成熟开源 Agent 借什么，不借什么

> 核实 2026-10-21。依据[同题比较](research/2026-10-12-long-task-evidence.md#p57复用循环与跨次控制的同题比较)、[既有核查范围](research/2026-10-12-community-source-records.md#21-页历史页头)；未安装框架或验证生产力收益。

## 30 秒结论

**✅ 先借跨次接收机制，不先搬整套框架。** 对重复代码／CI／依赖维护，让 Agent 核当前状态、改代码和收集检查；已有系统或薄代码守目标完整性、版本与接管边界；人决定业务取舍和风险。

**第一步：用同一个维护请求核对现成 SDK 与原生委派能否覆盖，只为覆盖不了的跨次责任补自有控制层。** 核对三项：现成 SDK 能否完整交付；原生委派能否覆盖批量目标；哪些跨次责任才需要自有控制层。详见 [16](16-building-agents.md#同一个维护请求三种实现怎么接收)；候选与评级见第 1 节表格。

**⛔ 不靠提示词承诺“全检查了”，也不让旧绿灯跟着新提交走。** 原生能力已覆盖就删重复层；新增层若漏项、阻塞无关任务或把维护负担转回人，停对应自动动作并收窄覆盖。

## 当前最高水平

<!-- frontier: status=已比较 gap=2 gen=2026-10 checked=2026-10-21 -->

**近期可借的是跨次接收与持久执行两种机制，不是整套框架；同题整体最优未知。** 近期领先参照是 Shopify Erin Son、Kaiyi Li 的 River 维护复盘（2026-09-02）：比较的是仓库继续变化后的修复与接收，不只生成补丁。Cursor Josh Ma 的云端 Agent 复盘（2026-06-02）则撤去任务步骤硬编码，保留持久执行与环境。两者并不矛盾：让 Agent 决定怎么做，系统守对哪个目标、哪个版本以及何时完成。

**可行基线是现成 Agent＋仓库 CI；主流采用率未知。** 本仓建议属于有生产参照的条件默认。以下开源实现用于选择缺失机制，不把某套框架认作上限；完整公开初改／二改产物和同预算总投入比较仍缺，保留差距 2。

**依据**：[一手：团队自报；研究：机制比较] [River 维护复盘](https://shopify.engineering/river-vulnerability-remediation)、[云端 Agent 复盘](https://cursor.com/blog/cloud-agent-lessons)；[研究] 采用率缺口与下文比较；核实 2026-10-21。

## 1. 选择依据

**按缺口借机制，不按功能多少选整包。** 上节三个核对项覆盖不了的部分，才从下表选择对应机制；下表是源码候选，不是安装清单。

| 项目 / 观察版本 | 值得借鉴 | 不应直接照搬 | 评级 |
|---|---|---|---|
| Superpowers，2026-10-10 commit | 有范围的实现/评审交接、RED/GREEN 证据、批处理同形改动、修复轮次收敛 | 每个小改都冷启动多个 reviewer；上游 Skill 里的授权假设；把规定轮数当普遍最优 | 🧪 机制级试用 |
| Spec Kit，2026-10-10 commit | 稳定需求/场景 ID、实现后 converge、不改需求来适配结果；当前已有独立 bug 流程 | 让自然语言总结自己决定验收分母；对机械任务套全部 SDD | 🧪 中大型需求 |
| OpenSpec，2026-10-06 commit | 增量 change 包、按实际 artifact 身份核对、区分 not-applicable / not-verified / passed | 文本模板测试通过就宣称真实模型遵循；为小改新增多份重复真相源 | 🧪 存量系统变更 |
| GSD Core，2026-10-10 commit | 机器可读 handoff 与简短人工摘要、pending job、未提交改动、只读诊断再恢复 | 全套状态机直接移植、写死窗口/压缩阈值、无条件权限放宽 | 🧪 长程恢复思想 |
| OpenHands SDK | 把动作提议、授权、执行、观察结果分开；事件与会话身份 | 风险分类器等于已开启审批；事件回放等于外部动作 exactly-once | 👀 自建执行器时 |
| Aider，最近提交为 2026-05-22 | 小而可审阅的 Git 变更、检查点、区分既有脏文件 | 自动提交用户原有改动；把 Git undo 当作数据库/API 副作用回滚 | ✅ Git 操作思想；不声称 10 月活跃度 |

**评级是本仓库的设计判断，不按关注度或收益排名选型。**

**依据**：[一手] 已读取的源码／文档（[Superpowers](https://github.com/obra/superpowers/tree/bb92a77741419a4ab5f06e711a283343f1ada0c3)、[Spec Kit](https://github.com/github/spec-kit/tree/0443760542e7e5269724744a2ac55c4bd386d095)、[OpenSpec](https://github.com/Fission-AI/OpenSpec/tree/9111a7654d7800391459431fff4eaf66e33a3d2e)、[GSD Core](https://github.com/open-gsd/gsd-core/tree/651bd2f5ee100bb32118ab7e429bdfb1649b0f41)、[OpenHands SDK](https://github.com/OpenHands/software-agent-sdk/tree/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9)、[Aider](https://github.com/Aider-AI/aider/commit/5dc9490bb35f9729ef2c95d00a19ccd30c26339c)）；[经验：设计判断] 评级；核实 2026-10-21。

## 2. 有用的机制与反例

### 下一次提交：先核目标，再接收结果

**接收结果前先核三件事：需求仍有效、谁在接管、检查绑定当前 SHA；合并后再核默认分支与权威任务源。** 借鉴的是接收责任，不是它的提交方式。

Shopify 的 River 报告在过期依赖 PR 上保住相邻 lockfile 升级、丢弃旧 SHA 的 CI 绿灯；有人接管的分支不动，新业务证据也曾使它撤回自己的补丁。但一次提示要求遍历全部任务，实际只复查最老一项。Agent 整理证据与最小待决问题，人决定业务语义和风险。漏项时由已有系统或薄代码补枚举、去重与版本保证；原文说这些“should become deterministic”，不是全部已实现。

**怎么验证这条：** 让同一 CI／依赖请求在下一次主干变化后继续，三条路线都须保住无关新改动、处置全部目标并说明真正关闭了什么。把提示／映射、环境、等待／费用、复核和再次修改的投入一起比较；缺失结果就留未完成，不能靠降低接收标准维持自动化。

**依据**：[一手：原文] [River 维护复盘](https://shopify.engineering/river-vulnerability-remediation)；[研究：采用边界] 接收职责；[研究：拟验收，未运行] 同题验收设计；核实 2026-10-21。

### 接收外部回执：保留未运行项

**把必需检查逐项对上，未运行项保留给人接收。** Anthropic 安全参考实现的结果类型允许无测试命令或未再攻击时总 passed 仍为真；Agent 应保留这些未运行项，人按本项目要求接收，不把参考实现的可选项默认算完整通过。何时只补领域验收、何时沿用专用入口，详见 [16](16-building-agents.md#专用维护先现成入口再补领域证明链)。

**依据**：[一手：固定源码；研究] [Anthropic 安全参考实现的结果类型](https://github.com/anthropics/defending-code-reference-harness/blob/d3bea6b5793b5f3d59a75ebe69a58efa88383145/harness/artifacts.py)；核实 2026-10-21。

### 评审越多不一定越好

**机械修改直接执行和测试；普通功能按风险加独立评审；安全、数据和并发风险再加专门审查。** 成本比较必须包含主任务整合、重试、误报和人的时间。

Superpowers #1120 只是用户对小任务调用开销的估计，不是统一的 10–15 倍成本定律；当前版本已有批处理、限定评审范围等改进，不能只引用旧抱怨描述新实现。

**依据**：[社区：单例；一手：当前 Skill] [Superpowers #1120](https://github.com/obra/superpowers/issues/1120)、当前 Superpowers Skill；[经验：设计判断] 评审分层与成本口径；核实 2026-10-21。

### 改名不能让验证器悄悄漏项

**从 spec 取 ID 和输出路径，而不是猜文件名。** OpenSpec #2027 的用户报告涉及自定义 artifact 名称与硬编码验证假设冲突；对应测试已区分未验证状态。模板测试只证明生成的指令含要求，不证明模型一定执行。

**依据**：[社区：单例；一手：修复测试] [OpenSpec #2027](https://github.com/Fission-AI/OpenSpec/issues/2027)、[OpenSpec 修复测试](https://github.com/Fission-AI/OpenSpec/blob/9111a7654d7800391459431fff4eaf66e33a3d2e/test/core/templates/verify-change.test.ts)；核实 2026-10-21。

### 恢复机制也可能成为复杂度来源

**恢复记录要版本化、任务隔离，坏记录只阻止依赖它的动作；保持一个权威状态入口，别同时维护五份不一致的“当前状态”。** 原 gsd-build/get-shit-done 已归档并指向 GSD Core，旧收藏链接不能作为当前维护状态。GSD #5291 报告旧验证状态阻塞无关阶段；#4909 讨论提示、CLI、安装路径与产物漂移。

**依据**：[一手：仓库状态；社区：待独立复测] [GSD 仓库状态](https://github.com/gsd-build/get-shit-done)、[GSD #5291](https://github.com/open-gsd/gsd-core/issues/5291)、[GSD #4909](https://github.com/open-gsd/gsd-core/issues/4909)；核实 2026-10-21。

### 有安全组件不等于默认安全

**分别检查配置意图、实际生效权限、工具边界和运行结果。** OpenHands 当前 state.py 的默认策略包含 `NeverConfirm`；OpenHands 安全指南区分风险分析、确认行为和绕开会话循环的直接工具执行。仅安装 analyzer 不能承诺每个动作已审查；恢复时也不能把旧日志当新授权。

**依据**：[一手] [OpenHands 当前 state.py](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/openhands-sdk/openhands/sdk/conversation/state.py#L123)、[OpenHands 安全指南](https://docs.openhands.dev/sdk/guides/security)；核实 2026-10-21。

### 验证回执能复用什么

**🧪 收窄采用：借内容绑定与失效检查，不直接引入整套回执系统。** 适合同一环境中成本较高、输入可界定的重复验证；短检查直接重跑更简单，依赖外部服务、时间或可变数据的检查不能只凭本地源码未变复用。潜在收益是避免内容不变的 commit / rebase 后重复跑长测试，同时拒绝沿用编辑前的绿灯；现有核查未测节省的时间、费用或真实 Agent 成功率。

**采用前先满足这三条最小复用条件：**

- 核对实际消耗的源码、测试、配置和新文件，以及精确命令／参数、工作目录、工具链与依赖版本；Git 忽略不等于测试不读取，不能整份豁免含依赖配置的文件
- 同时核对影响结果的非秘密环境配置和外部输入；缺少这些身份、日志不可核实、运行中存在并发修改或环境已变，就重跑或标未验证。不要为做指纹导出密钥或整个进程环境
- 必需检查清单独立于“已有回执”：没有记录不等于不用跑；退出 0 还要核实实际测试执行。上游允许无法识别的测试计数为 `unknown` 且不阻塞，不能借此放宽本仓库已有的零测试/skip 检查

**Windows 上从真实消费者入口验证指纹产生与后续检查，不能用手动成功替代。** 采用回执前按实际调用链跑一遍：确认指纹在消费者真正启动的环境里产生，后续检查也走同一入口，而不是只在 Git Bash 里手动执行脚本。

**具体未验边界：** 上游内容来自源码／测试阅读，未执行 gstack；首尾指纹相同不能证明运行中没有临时改动后还原；内容指纹不覆盖进程环境、依赖实际安装状态或外部服务，源码仍说明多行与变量展开的解析限制；现有核查未运行 Windows，原报告者的本地补丁成功也不是标号版本的复测。

**依据（条件与边界）：** [研究：采用边界] 复用边界；[经验：设计判断] 收窄采用；[经验：设计建议] 最小复用条件；核实 2026-10-21。

**机制与观察版本：** gstack v1.91.83.0，提交 `5cb5e1c`。gstack 指纹脚本用临时 Git index 收入已跟踪与未忽略的新文件；gstack 回执脚本比较运行前后指纹，保存命令摘要、退出码和日志位置，复用时须显式指定必需 lane，并用 `--expect-cmd` 检查预期命令。gstack 的对应测试覆盖 dirty → commit 的相同内容复用、源码或新文件变化、运行前后内容不同、命令变化。

**依据（机制）：** [一手：实现与测试；经验：外推边界] [gstack v1.91.83.0](https://github.com/garrytan/gstack/tree/5cb5e1cfc115e82388df07896664640a1224fe5d)、[指纹脚本](https://github.com/garrytan/gstack/blob/5cb5e1cfc115e82388df07896664640a1224fe5d/bin/gstack-wtree)、[回执脚本](https://github.com/garrytan/gstack/blob/5cb5e1cfc115e82388df07896664640a1224fe5d/bin/gstack-evidence)、[对应测试](https://github.com/garrytan/gstack/blob/5cb5e1cfc115e82388df07896664640a1224fe5d/test/evidence.test.ts#L148-L235)；核实 2026-10-21。

**反例与修复测试：** gstack #2624 的用户报告指出，Bun 包装器自动加载 dotenv，导致同一测试通过包装器失败、直接执行通过。该 issue 已关闭，当前脚本已有 `childEnv` 清理及回归；不能继续描述成“当前完全没修”。更值得借鉴的是 gstack 修复测试的正向对照：必须清除 `NODE_ENV=test` 并确认清理诊断实际出现，否则 `.env.local` 根本没被加载，测试也会假绿。

**依据（#2624）：** [社区：单例报告；一手：当前修复及局限] [gstack #2624](https://github.com/garrytan/gstack/issues/2624)、gstack #2624 的当前脚本与源码、[修复测试的正向对照](https://github.com/garrytan/gstack/blob/5cb5e1cfc115e82388df07896664640a1224fe5d/test/evidence.test.ts#L316-L375)；核实 2026-10-21。

**离线夹具：** 本仓库另用 Python 标准库临时夹具演示：同一源码字节、同一 argv、同一工作目录，仅把合成非秘密变量 `REUSE_PROBE_MODE` 从 `expected` 改成 `changed`，实际退出码由 0 变 1；两次运行前后源码均未变。这只说明内容与命令相同不足以证明结果可复用，不是上游漏洞复现、客户端测试或收益实验。无需为该反例新增永久实验框架。

**依据（离线夹具）：** [经验：2026-10-11 离线示例] 临时夹具演示；核实 2026-10-21。

**Windows 修复历史：** gstack #3101 的 linked worktree 盘符路径重复拼接已由 1.91.89.0 标号提交修复，不再作为未修缺陷；但 gstack #3197 又报告 Windows 11／Bun 1.4.2 下同一脚本从 Git Bash 手动运行成功、由 Bun 直接启动失败。维护链与测试范围的明细详见[维护链与测试范围](research/2026-10-12-community-source-records.md#gstackwindows指纹修复与实际调用入口)。

**依据（Windows 入口）：** [一手：固定补丁；社区：不同入口的单例报告；研究：采用边界] [gstack #3101](https://github.com/garrytan/gstack/issues/3101)、[1.91.89.0 标号提交](https://github.com/garrytan/gstack/commit/e6edff026519da3e06dce1e91d83932c43527a8d)、[gstack #3197](https://github.com/garrytan/gstack/issues/3197)；核实 2026-10-21。

## 3. 转化为本仓库的最小改动

**先采用这些与本仓库直接相关的局部机制，不要求安装任何完整第三方 agent 框架。** 这些改动停留在局部，运行时执行和真实模型表现仍需另测。

- [长任务记录](../templates/long-task/README.md)：分离验收 spec 和执行 report；ID 完整性、版本、未完成 worker 可机械检查
- [Codex 模板](../templates/codex/README.md)：窄触发 checkpoint/resume、验收证据 Skill，配置示例不自动安装
- [交接 Skill](../templates/generic/.claude/skills/handoff/SKILL.md)：任务独立路径、分支和脏工作区身份、待收集结果、外部动作不确定性
- [Spec Skill](../templates/generic/.claude/skills/spec-interview/SKILL.md)：稳定验收 ID 和失败路径，保留需求变更理由
- 引擎验证脚本：损坏/空/未完成报告不算绿；用模拟引擎证明回归测试能抓到旧缺陷

## 4. 哪些新实验最值得花额度

先跑无模型的确定性用例，再考虑收费的真实 agent 对照；不为了“前沿”无边界消耗额度。

1. 同任务不中断、压缩后继续、冷交接三组：验收通过率、重复工作、丢约束、总成本
2. 普通功能直接做、单 reviewer、多 reviewer：植入缺陷检出率、误报、返工轮数
3. 注入旧绿日志、零测试、漏验收项、未返回子任务：假完成比例
4. 写入前变更分支、研究返回旧 checkout 路径、符号链接越界：是否准确停下
5. 外部动作已发生但回执丢失：是否核对结果而非重复发布；已补充[原创离线恢复探针](../experiments/recovery-outcome/README.md)，14 个合成测试覆盖丢回执、未知结果、撤销授权和查询后重试竞态，仅验证确定性故障模型

固定任务与版本、随机运行顺序、保留每次结果和失败案例。先独立测每个干预，再测组合；不能同时换模型、技能和工具后把改善全归给某一项。上述真实 agent 对照尚未运行；第 5 项的离线探针不运行模型，也不构成生产 exactly-once 证明。

**依据**：[经验：本仓库实测] 原创离线恢复探针；[经验：待验证方案与实验边界] 实验顺序与边界；核实 2026-10-21。

## 5. 来源与复制边界

**按此边界使用：只提炼思想、另写本仓库示例，不整段复制第三方 prompts 或代码。** 已读取的 Superpowers、Spec Kit、OpenSpec、GSD Core、OpenHands SDK 仓库为 MIT，Aider 为 Apache-2.0；这不代表其全部插件、数据、资产和链接内容同许可。若以后复制实质代码，保留对应版本的许可与声明，记录源路径、commit 和本地改动；不要自动从 main/latest 更新权限逻辑。

进一步看：[Codex 长程执行闭环](20-codex-long-horizon.md)、[Skills](05-skills-and-plugins.md)、[工作流](07-workflows.md)、[多 Agent](08-multi-agent.md)、[实测与局限](19-experiments.md)。

**依据**：[一手] 各仓库固定版本的许可声明；核实 2026-10-21。
