# 21 · 从成熟开源 Agent 借什么，不借什么

> 核实时间：2026-10-11（UTC+8；原有条目检索截至 2026-10-10 UTC；验证回执小节于 2026-10-11 UTC 补核，Windows 维护链于 2026-10-16 UTC+8 复核）。
> 评级针对机制的采用范围，不是项目排名。本轮没有安装这些框架，没有跑生产力对照；星数、市场收录和厂商效果宣称都不等于已证明适合本仓库。

## 1. 选择依据

本轮优先读维护中的源文件、近期提交、可描述清楚的实际用户问题和对应测试，而不是只看 README 的承诺。下面是有代表性的候选，并非整个生态的完整榜单。a1dbv 已有计划、TDD、独立评审、交接和成本讨论；增量在于让这些规则可核查。

| 项目 / 观察版本 | 值得借鉴 | 不应直接照搬 | 评级 |
|---|---|---|---|
| [Superpowers](https://github.com/obra/superpowers/tree/bb92a77741419a4ab5f06e711a283343f1ada0c3)，2026-10-10 commit | 有范围的实现/评审交接、RED/GREEN 证据、批处理同形改动、修复轮次收敛 | 每个小改都冷启动多个 reviewer；上游 Skill 里的授权假设；把规定轮数当普遍最优 | 🧪 机制级试用 |
| [Spec Kit](https://github.com/github/spec-kit/tree/0443760542e7e5269724744a2ac55c4bd386d095)，2026-10-10 commit | 稳定需求/场景 ID、实现后 converge、不改需求来适配结果；当前已有独立 bug 流程 | 让自然语言总结自己决定验收分母；对机械任务套全部 SDD | 🧪 中大型需求 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec/tree/9111a7654d7800391459431fff4eaf66e33a3d2e)，2026-10-06 commit | 增量 change 包、按实际 artifact 身份核对、区分 not-applicable / not-verified / passed | 文本模板测试通过就宣称真实模型遵循；为小改新增多份重复真相源 | 🧪 存量系统变更 |
| [GSD Core](https://github.com/open-gsd/gsd-core/tree/651bd2f5ee100bb32118ab7e429bdfb1649b0f41)，2026-10-10 commit | 机器可读 handoff 与简短人工摘要、pending job、未提交改动、只读诊断再恢复 | 全套状态机直接移植、写死窗口/压缩阈值、无条件权限放宽 | 🧪 长程恢复思想 |
| [OpenHands SDK](https://github.com/OpenHands/software-agent-sdk/tree/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9) | 把动作提议、授权、执行、观察结果分开；事件与会话身份 | 风险分类器等于已开启审批；事件回放等于外部动作 exactly-once | 👀 自建执行器时 |
| [Aider](https://github.com/Aider-AI/aider/commit/5dc9490bb35f9729ef2c95d00a19ccd30c26339c)，本轮返回最近提交为 2026-05-22 | 小而可审阅的 Git 变更、检查点、区分既有脏文件 | 自动提交用户原有改动；把 Git undo 当作数据库/API 副作用回滚 | ✅ Git 操作思想；不声称 10 月活跃度 |

上述机制来自已读取的源码/文档 **[一手]**；评级是本仓库的 **[经验：设计判断]**。关注度只用于选题，本文不声称任何项目的活跃用户数或收益排名。

## 2. 有用的机制与反例

### 评审越多不一定越好

[Superpowers #1120](https://github.com/obra/superpowers/issues/1120) 是用户对小任务调用开销的估计，不是统一的 10–15 倍成本定律。当前版本已经有批处理、限定评审范围等改进，不能只引用旧抱怨描述新实现。**[社区：单例；一手：当前 Skill]**

借鉴：机械修改直接执行和测试；普通功能按风险加独立评审；安全、数据和并发风险再加专门审查。成本比较必须包含主任务整合、重试、误报和人的时间。

### 改名不能让验证器悄悄漏项

[OpenSpec #2027](https://github.com/Fission-AI/OpenSpec/issues/2027) 的用户报告涉及自定义 artifact 名称与硬编码验证假设冲突；对应 [测试](https://github.com/Fission-AI/OpenSpec/blob/9111a7654d7800391459431fff4eaf66e33a3d2e/test/core/templates/verify-change.test.ts) 已区分未验证状态。**[社区：单例；一手：修复测试]**

借鉴：从 spec 取 ID 和输出路径，而不是猜文件名；模板测试只证明生成的指令含要求，不证明模型一定执行。

### 恢复机制也可能成为复杂度来源

原 [gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) 已归档并指向 GSD Core，旧收藏链接不能作为当前维护状态。[GSD #5291](https://github.com/open-gsd/gsd-core/issues/5291) 报告旧验证状态阻塞无关阶段；[#4909](https://github.com/open-gsd/gsd-core/issues/4909) 讨论提示、CLI、安装路径与产物漂移。**[一手：仓库状态；社区：待独立复测]**

借鉴：恢复记录要版本化、任务隔离，坏记录只阻止依赖它的动作；保持一个权威状态入口，别同时维护五份不一致的“当前状态”。

### 有安全组件不等于默认安全

[OpenHands 当前 state.py](https://github.com/OpenHands/software-agent-sdk/blob/c4b93299cf2b31c8b5d0b2c5a89965ccc5ff24f9/openhands-sdk/openhands/sdk/conversation/state.py#L123) 的默认策略包含 `NeverConfirm`；[安全指南](https://docs.openhands.dev/sdk/guides/security) 区分风险分析、确认行为和绕开会话循环的直接工具执行。**[一手]**

借鉴：分别检查配置意图、实际生效权限、工具边界和运行结果。仅安装 analyzer 不能承诺每个动作已审查；恢复时也不能把旧日志当新授权。

### 验证回执能复用什么

**🧪 收窄采用：借内容绑定与失效检查，不直接引入整套回执系统。** 适合同一环境中成本较高、输入可界定的重复验证；短检查直接重跑更简单，依赖外部服务、时间或可变数据的检查不能只凭本地源码未变复用。潜在收益是避免内容不变的 commit / rebase 后重复跑长测试，同时拒绝沿用编辑前的绿灯；本轮未测节省的时间、费用或真实 Agent 成功率。**[经验：设计判断]**

观察版本为 [gstack v1.91.83.0，提交 `5cb5e1c`](https://github.com/garrytan/gstack/tree/5cb5e1cfc115e82388df07896664640a1224fe5d)。[指纹脚本](https://github.com/garrytan/gstack/blob/5cb5e1cfc115e82388df07896664640a1224fe5d/bin/gstack-wtree) 用临时 Git index 收入已跟踪与未忽略的新文件；[回执脚本](https://github.com/garrytan/gstack/blob/5cb5e1cfc115e82388df07896664640a1224fe5d/bin/gstack-evidence) 比较运行前后指纹，保存命令摘要、退出码和日志位置，复用时须显式指定必需 lane，并用 `--expect-cmd` 检查预期命令。[对应测试](https://github.com/garrytan/gstack/blob/5cb5e1cfc115e82388df07896664640a1224fe5d/test/evidence.test.ts#L148-L235) 覆盖 dirty → commit 的相同内容复用、源码或新文件变化、运行前后内容不同、命令变化。这是源码/测试阅读，未执行 gstack；首尾指纹相同也不能证明运行中没有临时改动后还原。**[一手：实现与测试；经验：外推边界]**

反例是 [#2624](https://github.com/garrytan/gstack/issues/2624)：用户报告 Bun 包装器自动加载 dotenv，导致同一测试通过包装器失败、直接执行通过。该 issue 已关闭，当前脚本已有 `childEnv` 清理及回归；不能继续描述成“当前完全没修”。但源码仍说明多行与变量展开的解析限制，内容指纹也不覆盖进程环境、依赖实际安装状态或外部服务。更值得借鉴的是[修复测试的正向对照](https://github.com/garrytan/gstack/blob/5cb5e1cfc115e82388df07896664640a1224fe5d/test/evidence.test.ts#L316-L375)：必须清除 `NODE_ENV=test` 并确认清理诊断实际出现，否则 `.env.local` 根本没被加载，测试也会假绿。**[社区：单例报告；一手：当前修复及局限]**

本仓库采用的最小复用条件 **[经验：设计建议]**：

- 核对实际消耗的源码、测试、配置和新文件，以及精确命令/参数、工作目录、工具链与依赖版本；Git 忽略不等于测试不读取，不能整份豁免含依赖配置的文件
- 同时核对影响结果的非秘密环境配置和外部输入；缺少这些身份、日志不可核实、运行中存在并发修改或环境已变，就重跑或标未验证。不要为做指纹导出密钥或整个进程环境
- 必需检查清单独立于“已有回执”：没有记录不等于不用跑；退出 0 还要核实实际测试执行。上游允许无法识别的测试计数为 `unknown` 且不阻塞，不能借此放宽本仓库已有的零测试/skip 检查

本轮另用 Python 标准库临时夹具演示：同一源码字节、同一 argv、同一工作目录，仅把合成非秘密变量 `REUSE_PROBE_MODE` 从 `expected` 改成 `changed`，实际退出码由 0 变 1；两次运行前后源码均未变。这只说明内容与命令相同不足以证明结果可复用，不是上游漏洞复现、客户端测试或收益实验。无需为该反例新增永久实验框架。**[经验：2026-10-11 离线示例]**

**Windows 上先验实际调用入口。** [#3101](https://github.com/garrytan/gstack/issues/3101) 的 linked worktree 盘符路径重复拼接已由 [1.91.89.0 标号提交](https://github.com/garrytan/gstack/commit/e6edff026519da3e06dce1e91d83932c43527a8d)修复，不再作为未修缺陷；但 [#3197](https://github.com/garrytan/gstack/issues/3197) 又报告 Windows 11／Bun 1.4.2 下同一脚本从 Git Bash 手动运行成功、由 Bun 直接启动失败。因此采用回执前，应从实际消费者入口确认指纹产生与后续检查，不能用手动成功替代。原报告者的本地补丁成功不是标号版本的复测，本轮也未运行 Windows；[维护链与测试范围](research/2026-10-12-community-source-records.md#gstackwindows指纹修复与实际调用入口)另记。**[一手：固定补丁；社区：不同入口的单例报告；研究：采用边界]**

## 3. 转化为本仓库的最小改动

- [长任务记录](../templates/long-task/README.md)：分离验收 spec 和执行 report；ID 完整性、版本、未完成 worker 可机械检查
- [Codex 模板](../templates/codex/README.md)：窄触发 checkpoint/resume、验收证据 Skill，配置示例不自动安装
- [交接 Skill](../templates/generic/.claude/skills/handoff/SKILL.md)：任务独立路径、分支和脏工作区身份、待收集结果、外部动作不确定性
- [Spec Skill](../templates/generic/.claude/skills/spec-interview/SKILL.md)：稳定验收 ID 和失败路径，保留需求变更理由
- 引擎验证脚本：损坏/空/未完成报告不算绿；用模拟引擎证明回归测试能抓到旧缺陷

它们是局部机制，不要求安装任何完整第三方 agent 框架。运行时执行和真实模型表现仍需另测。

## 4. 哪些新实验最值得花额度

先跑无模型的确定性用例，再考虑收费的真实 agent 对照；不为了“前沿”无边界消耗额度。

1. 同任务不中断、压缩后继续、冷交接三组：验收通过率、重复工作、丢约束、总成本
2. 普通功能直接做、单 reviewer、多 reviewer：植入缺陷检出率、误报、返工轮数
3. 注入旧绿日志、零测试、漏验收项、未返回子任务：假完成比例
4. 写入前变更分支、研究返回旧 checkout 路径、符号链接越界：是否准确停下
5. 外部动作已发生但回执丢失：是否核对结果而非重复发布；已补充[原创离线恢复探针](../experiments/recovery-outcome/README.md)，14 个合成测试覆盖丢回执、未知结果、撤销授权和查询后重试竞态，仅验证确定性故障模型 **[经验：本仓库实测]**

固定任务与版本、随机运行顺序、保留每次结果和失败案例。先独立测每个干预，再测组合；不能同时换模型、技能和工具后把改善全归给某一项。上述真实 agent 对照尚未运行；第 5 项的离线探针不运行模型，也不构成生产 exactly-once 证明。**[经验：待验证方案与实验边界]**

## 5. 来源与复制边界

本文提炼思想、编写本仓库示例，不整段复制第三方 prompts 或代码。本轮读取的 Superpowers、Spec Kit、OpenSpec、GSD Core、OpenHands SDK 仓库为 MIT，Aider 为 Apache-2.0；这不代表其全部插件、数据、资产和链接内容同许可。若以后复制实质代码，保留对应版本的许可与声明，记录源路径、commit 和本地改动；不要自动从 main/latest 更新权限逻辑。

进一步看：[Codex 长程执行闭环](20-codex-long-horizon.md)、[Skills](05-skills-and-plugins.md)、[工作流](07-workflows.md)、[多 Agent](08-multi-agent.md)、[实测与局限](19-experiments.md)。
