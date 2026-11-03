# A-AGENT-HOST-MODE-ROUTE-20261103 · 17 §1／§2.8 最小候选

**在 17 的 §1 加一行症状、§2.8 加一段带锚点的分支，其余正文、默认和日期不动。** 上游 gcx 的修复已经合入，本稿不把它当待修代码，也不声称本仓或读者项目当前正受此影响。效果描述来自作者报告与固定源码，本轮未运行 gcx、Go、mise、测试或生成脚本；不新做实验，不动地图和评级，也不扩采遥测或会话信息。

## 可直接落页的候选

### §1 症状表（插在 Windows 启动层一行之后）

| 症状 | 待核原因 | 第一步处理 | 详见 |
|---|---|---|---|
| 同一 clean main 在 coding agent shell 里确认提示测试失败、CI 绿 | 宿主标识在启动时把被测 CLI 切到 agent 模式，人工确认分支被换成拒绝 | 先同基线复现并看失败阶段，再核目标读取哪些宿主标识；只对照相关键的存在或受控合成值 | [2.8 Agent 宿主模式](#p28-agent-host-mode) |

### §2.8 新增块（插在 Windows 启动层段之后、本节依据行之前）

<a id="p28-agent-host-mode"></a>

**同一提交在 coding agent shell 里只有人工确认测试失败、CI 绿时，先核宿主标识是否让被测 CLI 在启动前换了模式，不要先 bisect 或改业务逻辑。** Grafana gcx 的固定实例中，`internal/agent/agent.go` 在 `init()` 读取 `CLAUDECODE`、`CLAUDE_CODE` 等宿主信号进入 agent 模式；`internal/providers/confirm.go` 的破坏性操作确认链随即改成“没有 `--force`（或 `GCX_AUTO_APPROVE`）就报错”，不再读 `y/N`。作者报告在 rebase 时为此 bisect 并浪费过时间，之后确认同一 clean main 可复现、CI 没有这些变量所以不出现，修复后原四个失败包通过。这是作者自报，不是本仓复跑。

1. **先固定同一基线、命令和失败阶段。** 确认 clean main 在 agent shell 同样失败，且失败落在“agent mode 要求 `--force`”或确认输入未被读取，而不是业务断言；两项都对上才继续。只在这一次诊断上用显式 falsy 值包住原测试命令作对照（gcx 为 `GCX_AGENT_MODE=false <原测试命令>`），不写进用户 shell；对照后通过才把差异归到模式，仍失败就退出本分支。
2. **只核目标源码实际读取的检测输入和优先级。** gcx 的环境检测输入以 `EnvironmentVariables()` 返回的清单为准，当前名单比 2026-08-05 PR 描述的五项宽；只检查相关键是否存在或用受控合成值，不导出整个环境，不读取或输出会话标记的值。
3. **在测试启动前或项目已有的重读入口内固定模式。** 给实际执行测试的叶子任务设显式 falsy 值（gcx 只认 `0`／`false`／`no`，不区分大小写，空字符串不算）；或在测试清掉检测输入后调用现有重读入口（gcx 为 `ResetForTesting()`）。模式在 `init()` 缓存，中途删一个键不会自动恢复；把 env 设在父任务上也不生效——mise 在该仓的 `depends` 不传播 env，这是该仓行为，不推广到所有 runner。
4. **双向验收。** 人工确认测试在宿主变量仍导出时通过；单独的 agent 拒绝测试自己设受控 truthy 值，仍对未带 `--force` 的破坏性操作返回错误。不用 `--force` 或 `GCX_AUTO_APPROVE` 求绿，不删安全断言、不关沙箱，也不在用户 shell 全局关闭 agent 模式。

**何时退出本分支**：同一提交在 CI 也失败；目标不读取宿主标识；测试已自行清空并重读检测输入；或失败实际是依赖／网络／资源／OS。此时按本节原有入口定位，不凭相似症状判根因。

### §2.8 依据行追加（追加到本节末尾，原核实日期保留）

[一手：作者报告，未复跑；人工审批不作独立复验] [PR #1079](https://github.com/grafana/gcx/pull/1079)（合入 [`435c1d6`](https://github.com/grafana/gcx/commit/435c1d682c8d414118d69423cb560f878543f57a)）、[APPROVED 4866849123](https://github.com/grafana/gcx/pull/1079#pullrequestreview-4866849123)；[一手：固定源码，可推行为，未运行] [`agent.go` 显式控制变量](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/internal/agent/agent.go#L14-L38)（`--agent` 优先见 L26–L27）、[`harnessEnvVars` 名单](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/internal/agent/agent.go#L42-L58)、[`EnvironmentVariables()` 清单与重读入口](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/internal/agent/agent.go#L60-L95)、[`Name()`](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/internal/agent/agent.go#L148-L174)、[`detectFromEnv` 优先级](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/internal/agent/agent.go#L117-L142)、[truthy／falsy](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/internal/agent/agent.go#L201-L219)、[`agent_test.go`](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/internal/agent/agent_test.go#L110-L139)、[`confirm.go`](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/internal/providers/confirm.go#L19-L47)、[`mise.toml`](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/mise.toml#L33-L50)、[生成参考的同一机制](https://github.com/grafana/gcx/blob/dd4856a65158a65b0be0c988b83a3f57f610f975/scripts/generate-cli-reference.sh#L23-L30)；2026-11-03 核读新增项，本节其余内容仍为 2026-10-22。

## 原句、固定来源与接法

| 17 现文 | 固定来源／作者反馈 | 本稿接法 |
|---|---|---|
| §1 表头：“先按症状定位，再到对应小节按推荐顺序处理。” | PR #1079：同一 clean main 在 agent shell 失败、CI 绿；确认提示测试是首个可见症状 | 增一行，详见指向新锚点，其他行的顺序和结论不动 |
| §2.8 首句：“先看重复的是错误思路，还是同一个运行故障。” | `agent.go`：检测在 `init()` 完成并缓存；`detectFromEnv()` 先看 `GCX_AGENT_MODE`，falsy 直接返回，否则 `Name()` 命中任一宿主信号即开启 | 把“运行故障”细分为“启动前模式被外部宿主改写”的一支；先核失败阶段和源码输入，再谈代码 |
| §2.8 第 3 条：“API／工具失败或测试不稳定：先查原错误、验证环境和已有执行结果” | `confirm.go`：`--force` 放行；`GCX_AUTO_APPROVE` 放行；agent 模式返回 `ErrAgentModeRequiresForce`；否则交互确认 | 在该条之后单列一段，给出同基线复现、输入核对、模式固定和双向验收四步 |
| §2.8 末尾依据行 | `mise.toml` L33–50：父任务用 `depends`，两个叶子任务各自 `env = { GCX_AGENT_MODE = "false" }`；`generate-cli-reference.sh` L23–30 在生成参考前导出同一变量 | 追加一条来源，原日期保留，新增项标 2026-11-03 核读 |

**失败保全。** 新的模式固定只作用于人工确认分支，agent 拒绝测试仍显式设 truthy 并断言拒绝，不因求绿删掉；§2.8 原有的 Terminal-Bench 归因、AgentDebugX、UI 观察时机、会话录制、历史完整性和 Windows 启动层都不改。修后先回原消费者：原命令在宿主变量仍导出时跑人工确认测试，再跑拒绝分支的反向控制，不以 CI 绿或文稿审过代替。

## 三问对照（供负责人核收）

1. **怎样区分模式差异与业务回归？** 候选步骤 1：同基线、同命令、同失败阶段先在 agent shell 复现，并确认错误落在 agent 拒绝或确认输入未读取，而不是业务断言；步骤 2 再核源码是否真的读取宿主标识。两项都满足才归因模式，否则按原入口查依赖／网络／资源。
2. **怎样隔离人工测试又保住拒绝契约？** 步骤 3 把模式固定放在测试启动前或已有的重读入口内；步骤 4 要求人工确认测试通过的同时，拒绝测试显式设 truthy 并对未带 `--force` 的破坏性操作仍返回错误。禁止用 `--force`／`GCX_AUTO_APPROVE` 或删断言换取绿色。
3. **哪种“删键／父任务设值”修法不可靠？** 步骤 3：模式在 `init()` 缓存，中途删一个键不会重算，必须走 `ResetForTesting()` 或新进程；`GCX_AGENT_MODE` 只认 `0`／`false`／`no`，空字符串不是 falsy；mise 在该仓不通过 `depends` 传播父任务 env，必须设在叶子任务或测试内。另一种不可靠做法是只删一个宿主键——当前检测输入是一份更宽的清单，其他信号仍可能触发。

## 来源分层与未运行范围

- **作者报告**：PR #1079 作者 wardbekker 称在 rebase #981 时遇到该失败，曾 bisect 后确认 clean main 可复现；称修复前四个包失败，`mise run tests` 在 `CLAUDECODE=1` 仍导出时通过。属自报，未复跑。
- **人工审批**：awsome-o 于 2026-08-05T17:02:02Z 给出 APPROVED（review 4866849123，正文为空），只表示合入门槛通过，不是独立复验或效果测量。
- **固定源码可推行为**：`agent.go` 的 `init()`／`ResetForTesting()`、`detectFromEnv()` 的优先级、`isTruthy`／`isFalsy` 取值、`EnvironmentVariables()` 清单、`confirm.go` 的旁路链、`mise.toml` 的叶子任务 env、生成脚本的同一导出，均按 `dd4856a6` 原文核读。它们说明机制，不是本轮运行结果。
- **本轮未运行**：未安装或执行 gcx、Go、mise、目标测试、生成脚本或示例；未读取用户环境变量、配置、凭据、会话或日志；未向任何环境写入。PR 描述只取摘要，未复制原始日志。
- **上游状态**：修复已在 `435c1d6` 合入；本稿不重开、不 cherry-pick、不把已合入补丁写成新的待修代码。

## 与 15 的 vitest 段去重

15 的 `vitest-reused-worker-env` 处理的是同一测试进程内复用 worker 造成的跨文件环境残留，修复点在每个文件的 `setupFiles` 或恢复默认隔离；本稿的注入点在程序启动前，外部宿主标识让被测 CLI `init()` 后直接换模式，修复点是叶子任务 env 或检测输入清空后的重读入口。两处的失败阶段、缓存位置和修法都不同，17 不复制 15 的案例、对照数据和命令；15 也不因本稿改动。本稿不扩展成通用环境诊断或新测试框架。

## 采用与退出

采用的前提是：目标源码确实读取非秘密的宿主行为标识，失败只在带该标识的 shell 中出现，CI 或干净 shell 不出现，且失败阶段与确认／模式分支对应。**不满足就明确不采用**：目标没有这类检测、测试已自行隔离、同一提交在 CI 也失败，或故障实际是依赖／网络／资源／OS 时，沿现有入口定位，不因“都是 agent shell 里失败”套用本分支。即使满足，也只把模式固定限定在测试或诊断命令内，不改用户全局设置和产品默认。
