主线：二，兼三／四
改变的建议：先区分缺事实、运行反馈、访问能力还是决策，再补最小条件；续改成对验“有意改变／仍须保留”的行为，迁移另验持久状态、旧读取者与真实维护入口；浏览器保存与故障注入按响应来源选验收入口；游戏移植分数按证据条件解读；重复迁移按语法／类型覆盖与重跑边界选择工具。[经验／研究]
证据摘要：官方权限／运行契约、固定历史补丁、社区使用与接管报告、论文；SWE-Game 固定源码拆分实现对应关系与体验质量；另有 TanStack／Angular／Renovate 迁移维护链与固定夹具，以及标准库公式、路径与 32 场景 SQL 局部复核。它们支持条件选择，未证明模型或 Skill 净收益。[一手／社区／研究]
关键边界：普通 headless、bare、trust 与 sandbox 不等价；原生能力已够就不叠加。历史 CI、作者自报、源码与局部探测分别计证据，游戏例子仍是设计。[一手／研究]

# 方向研究：改善 AI Coding，要研究模型之外的哪些条件

> 核实：2026-10-12；2026-10-13（UTC+8）补核 §五 Discourse 后续演化案例、§二 React 定向日志及属性测试案例，2026-10-14 UTC 补核 §五 Pydantic AI 演化链，2026-10-15（UTC+8）补核 §二 Service Worker 响应来源，同日补末节重复代码迁移的三项目维护链与固定源码，其他外部事实未重核。评级：🧪 按实际瓶颈试用最小改进，不默认改造整个项目。范围：已有仓库材料、官方 Skills 的指定段落、官方 Codex 迁移教程与本仓库审计。属于有依据的方向判断，不是新模型效果实验。

## 核心判断

**仓库的研究对象应是人使用 Agent 完成和演化软件的全过程。** Codex/Claude Code 是主线工具，但领域知识、运行环境、可观测性、测试数据、接口、架构和产品试用，都可能比再加一个提示更直接地改变结果。选择它们的依据应是任务中真实存在的障碍，不能因为“工程实践总是有用”就把仓库扩成软件工程百科。**[经验：研究取舍]**

现阶段优先研究两个容易被归入“模型不行”的问题：Agent 不知道当前业务事实；Agent 得不到实际运行反馈。先补哪一个，取决于任务卡在哪里。若知识、工具与反馈基本足够，仍持续选择错误步骤，就应优先比较推理能力、effort 或工作流约束；这不是要求先把环境补完才能比较模型。信息获取本身也依赖模型能否提出正确问题，两者需要沿具体失败一起判断。**[经验：研究假设，非失败频率统计]**

这不是“环境永远比模型重要”。更强模型可能从残缺信息中推断出答案，某些任务本来就不需要启动系统；反过来，再强的模型也不能凭源码知道未记录的生产任务调度或用户偏好。我们的建议必须区分这些情况，不能给统一的最优配置。

## 一、为什么这条方向比继续加工作流更值得优先投入

已有调查给出了三个不同层面的证据：

1. Catalog Compare 的公开验收与独立 Decimal 检查能区分数字正确性，但历史浏览器回执的 HTML hash 不同，不能证明当前界面可用。这里缺的是对应版本的运行反馈，不是更多审阅角色。[本仓库复核](2026-10-10-catalog-compare.md)。**[经验：实际检查]**
2. 本仓库固定 grader 接受“实现正确但候选自身测试失败”的合成例子；记录校验器接受不存在的 evidence ref。都符合其有限契约，却不能证明工作流整体成功。[验收链审计](../collaboration/reviews/2026-10-11-000d14c.md)。**[经验：实际探测]**
3. 官方 Codex 迁移教程明确需要工程师确认哪些作业实际在生产运行、SLA 和业务上下文；这些不一定能从代码得到。它把同输入下旧系统与新系统的行为比较作为迁移验证，而非只看新代码的测试数。**[一手：S2，教程设计，非独立效果实测]**

三者不能合并成一个成功率结论，但共同提示了研究方法：**先查缺的是事实、访问能力、反馈，还是决策；不要先把所有失败归因于模型或提示。** 下一批案例应把“Agent 当时能得到什么”记录清楚，才能判断新增 Skill 或工具是否真有作用。

## 二、运行环境是开发能力的一部分，不只是安装步骤

一个服务能启动，不代表 Agent 能完成开发任务。应沿一条实际场景追到：哪个构建在运行、请求使用哪份数据、错误怎样关联到代码、修改后怎样确认运行的是新版本、怎样回到可比较的初始状态。**[经验：采用判断]**

以“保存后刷新丢数据”为假设案例：截图可以发现丢失，网络响应能区分前端未发送与服务端拒绝，重启后的读取才涉及持久化。若 Agent 只拿到组件源码和截图，反复调 CSS 或重写状态管理不一定解决问题。最小增量可能只是测试账号、可隔离的数据、请求日志及准确启动命令，不是安装完整平台。此案例是分析设计，不是本轮运行结果。

需要比较的替代方案：

| 观察到的阻碍 | 优先调查/尝试 | 不应直接跳到 |
|---|---|---|
| 看不到错误发生在哪层 | 当前版本的一次请求、相关日志和状态变化 | 换模型后再重复相同盲猜 |
| 每次都花很久恢复登录和数据 | 复用已有测试夹具、可复位数据和明确会话模式 | 一套新的多 Agent 调度框架 |
| 改了代码但结果没变 | 构建、进程、热加载/重启与缓存归属 | 增加推理强度或连续改其他文件 |
| 错误只在用户路径出现 | 通过真实输入走关键路径，内部接口用于定位 | 直接改内部状态后截图作为完成证据 |
| 系统已经可运行、信息充分仍反复做错 | 检查推理、任务分解、工具描述与流程干预 | 继续无目的扩充环境和日志 |

表格是诊断优先级，不是根因已确定的分类器。同一问题可能跨多行；新增接口本身也有维护、权限和失真成本。

### 交互试点转脚本：bare 不是等价加速

**核实：2026-10-14 UTC；改变 15 §5 与 Claude 专题的 `--bare` 简写。** ✅ 已审查的可信项目中，批量迁移依赖项目知识时，保留普通模式，或在 bare 模式中显式提供必要的约束与工具；仅做已给定材料的机械处理时可采用 bare，不把全部常驻指令复制进去。这是按执行上下文选择的建议，不是新增迁移流程。**[经验：采用判断]**

[当前官方 headless 文档](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode)区分了普通 `claude -p` 和可选 `--bare`：前者加载交互会话同类上下文，后者跳过 `CLAUDE.md`、自动发现的 Skill、Hook、插件等。可用 `--append-system-prompt-file` 等显式提供必要输入。`--add-dir` 中的 `.claude/skills/` 是部分例外，但 bare 不向模型发送可用 Skill 列表提醒，不能仅凭文件存在认定它被发现和使用。**[一手：官方契约]**

[2.1.286 固定发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.286)确认 bare 改为只连接命令行指定的 MCP、不发送系统提醒、不启动后台任务，shell 超时后停止而非转后台；当前文档具体说明也不会提醒已读文件发生磁盘变化。这里的版本下限针对这组运行行为，不能误写成 `--bare` 或跳过 `CLAUDE.md` 首次出现的版本。**[一手：发布说明与当前文档]**

**外来仓库的启动边界是另一个决定。** 2026-10-14 补核[权限矩阵](https://code.claude.com/docs/en/permissions#what-runs-before-you-trust-a-folder)：普通 `-p` 不显示工作区信任或逐服务器批准提示，未信任目录里的 settings Hook 与 `.mcp.json` 服务器仍会运行／连接；项目 `permissions.allow` 被暂缓并发出警告，不等于这些启动动作也被阻止。[Hooks 文档](https://code.claude.com/docs/en/hooks#security-considerations)明确命令 Hook 使用用户完整权限，并按会话类型区分信任：交互会话等待信任，`-p` 对 settings Hook 视目录已信任。故 10 §3 的采用建议是先限制配置来源，不能只把任务写成“只读”或等待提示。**[一手：当前官方契约；经验：采用判断]**

**`--bare` 不是关闭所有项目设置。** 官方权限矩阵明确 bare 仍应用项目 `env` 与 `awsAuthRefresh` 等 helper，`apiKeyHelper` 则只从显式 `--settings` 读取。`--setting-sources user` 排除项目 settings 文件及 `.mcp.json`，但不应解释成关闭所有 Skill／指令自动发现；不需要这些能力时再采用 bare，并仅显式提供审过的配置、插件与工具。若只禁 Hook，可显式传 `--settings '{"disableAllHooks": true}'`；仅写用户 settings 会被项目优先级覆盖。这些是配置选择，不是操作系统沙箱，且不能为随后执行外来代码提供隔离保证。**[一手：官方机制；经验：组合边界，未运行客户端]**

**历史修复与当前契约须分开。** [How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)说明 2025 年中至 2026-01 收到三类信任提示前执行漏洞，修复方式是把项目配置解析／执行延后至接受提示；10 的 2026-05 标记为披露月份，不是发生或修复月份。原文未给这些修复的精确版本，也不能把交互信任闸门推及当前 `-p`。上面的 2.1.286 仅为那组 bare 行为的版本证据，不证明普通 `-p` 从哪个版本起跳过信任提示。**[一手：厂商历史自述与当前文档；检查边界]**

**认证与计费前提也不同。** 同一官方文档说明 bare 不读取订阅 OAuth 或系统钥匙串；Anthropic API 路径使用已提供的 API key／`apiKeyHelper`，外部提供商继续使用各自认证方式。切换前须确认该执行与计费方式已经获准且可用；这不是建议新建凭据、开通付费或把所有提供商改为 Anthropic API key。**[一手：官方文档；经验：采用前提]**

**实际选择与局限。** 交互试点已经靠项目约定完成迁移时，换成 bare 要保留同一任务所需的信息；原命令依赖转后台等待长构建时，也不能只加一个 flag 便声称等价。普通 `-p` 不意味着 bare，官方“未来可能成为默认”的说明也不是当前默认已改变。本轮只核对文档与版本说明，未安装或执行客户端、未测开销和正确率；已有[历史实验](2026-10-12-experiment-records.md)的 bare 调用认证失败，不能补作本判断的成功运行证据。**[经验：采用边界；一手：检查范围]**

### Codex 脚本入口：信任状态不等于有效权限

**核实：2026-10-14 UTC；改变 10 §3 与 Codex 专题的脚本入口建议。** ✅ 只读自动化须核对有效只读权限：旧沙箱配置可显式选择 `--sandbox read-only`；已有文件排除 profile 时不要叠加该旧开关（2026-10-15 UTC+8 补核，见 [10 的唯一采用建议](../10-security.md#codex-文件排除的采用条件)）。同时分别审查配置、指令、技能与 Hook 引用脚本；不以项目 trust 或 Git 检查代替执行边界。以下实现固定于 [openai/codex `7a08c5f`](https://github.com/openai/codex/commit/7a08c5f6271e818d832eb9061dac935936e2b539)，为当日 main 快照，不是已发行 CLI／桌面版本的行为验证。**[一手：固定源码；经验：采用判断]**

**配置和指令的闸门不同。** [当前配置文档](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence)说明项目配置只对 trusted 项目加载，用户／系统配置仍可生效。固定 [loader](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/config/src/loader/mod.rs#L1056-L1132)将未设 trust 与显式 untrusted 都作为项目配置层的禁用状态，但 [AGENTS 加载](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/core/src/agents_md.rs#L56-L87)只在显式 untrusted 时提前返回、保留传入的用户指令；未设 trust 不命中该分支。[exec 的 Git 检查](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/exec/src/lib.rs#L1012-L1019)检查是否找到仓库根，不能从其通过推断 trusted。**[一手：官方契约与固定实现]**

**默认说明不替代有效权限。** [官方 non-interactive 文档](https://learn.chatgpt.com/docs/non-interactive-mode#permissions-and-safety)说明 exec 默认 read-only；固定 [exec 配置](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/exec/src/lib.rs#L584-L615)则默认给 headless 设置 `Never` 审批，Auto-review 另有重建分支。传统 sandbox 配置路径在没有显式 sandbox、项目已有 trusted 或 untrusted 决定时会产生 workspace-write 候选，[同一函数](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/config/src/config_toml.rs#L841-L906)仍有平台与 requirement fallback。named profiles、持久权限恢复及[最终约束解析](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/core/src/config/mod.rs#L3721-L3838)另参与计算，最后使用[受约束的 effective profile](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/core/src/config/mod.rs#L4253-L4312)；不能由这个候选宣称所有 untrusted 运行都可写，也不能据 main 说发布版默认已经改变。**[一手：文档与源码；研究：分层限定]**

**Skills 发现不跟配置禁用完全重合。** 固定 [skills 根目录实现](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/ext/skills/src/host_roots.rs#L73-L196)遍历包含禁用层的配置目录，并另查项目中的 `.agents/skills`；[测试定义](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/ext/skills/src/host_roots_tests.rs#L244-L289)明确保留 disabled project 的 `.codex/skills` 根。[会话调用路径](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/core/src/session/turn_context.rs#L1300-L1323)也有跳过 host discovery 的功能／会话分支。这里只证明发现机制，不证明技能一定自动调用、脚本已执行或获得额外权限。**[一手：固定实现与未运行测试定义]**

**Hook 定义信任是另一道门。** [当前官方契约](https://learn.chatgpt.com/docs/hooks#review-and-trust-hooks)要求非托管 Hook 信任当前定义后才运行，新增／修改的定义会被跳过；`/hooks` 可检查来源与待审项，插件启用不自动信任它的 Hook。固定实现的 [hook_hash](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/hooks/src/engine/discovery.rs#L768-L794)哈希规范化事件和 handler 配置，并不读取被调用脚本内容。因此审查定义时也审查脚本及其来源，不能把定义未变当作脚本未变；不建议用 bypass 信任参数处理外来仓库。**[一手：官方契约与固定实现；经验：采用判断]**

**检查范围与不采用。** 本轮仅阅读当前官方页面、上述固定源码和测试定义，未运行 Codex、模型或上游测试，未检查私人配置。未完整审计每种 MCP／shell／插件启动路径，不给“零启动执行”保证，也不把命令沙箱说成整个宿主进程隔离。`--ignore-user-config` 与 `--ignore-rules` 只按官方声明的各自范围理解，不推荐作关闭全部项目能力的通用开关；不增加信任记录修改、凭据迁移或放宽安全的步骤。**[研究：验证范围与撤回边界]**

### 官方交互浏览器 Skill：值得借什么，不能照搬什么

固定版本的 `playwright-interactive` 复用 REPL 与浏览器句柄；区分 renderer reload 与主进程 relaunch；功能验收要求实际用户输入，`evaluate` 可检查或准备状态，但不能充当验收输入；视觉检查与功能检查独立。普通 CLI Skill 则强调 DOM 明显变化后重新 snapshot，避免沿用失效元素引用。**[一手：S1 指定段落]**

这些机制可以减少两种不同浪费：无意义地反复启动环境，以及在旧页面/旧状态上继续推理。不能据机制描述报提速数字。持久会话也会带来缓存、登录和脏数据污染，首次访问场景仍需要干净上下文；“复用”与“重置”由目标场景决定。

还必须独立判断执行前提：该快照的 interactive Skill 要求关闭沙箱，并给出安装命令。这不应成为知识库的默认环境建议；本轮没有安装、关闭沙箱或测试运行兼容性。可以借鉴观察与动作的设计，优先使用当前已支持的浏览器入口。**[一手：S1；经验：采用范围]**

### 交互界面：按缺失观察选择反馈

核实：2026-10-14 UTC。改变 23 §2/§4：选择能区分当前假设的反馈；视觉要求保留截图验收，语义与时序问题先复用已有真实输入测试及状态/事件证据。以下为外部比较与源码阅读，本轮未运行模型、浏览器或上游代码。**[经验：采用判断]**

| 比较及固定来源 | 实际条件与观察 | 能改变的选择；不能推出什么 |
|---|---|---|
| [Design2Code v2，§3.1、表3](https://arxiv.org/html/2403.03163v2) | HARD 为80页；self-revision 接收 text-augmented 初稿代码、初稿渲染图和目标图。GPT-4o 的 Block/Position 为67.7/77.5→72.1/81.1；Claude 3.5 Sonnet 为75.1/83.4→71.9/82.6 | 截图反馈有机会修视觉偏差，但不能假定修订必升；保留前版比较。这是静态复现、旧模型与非等成本对照，不是当前交互应用成功率 |
| [Vision-Guided Iterative Refinement v1，§4.1、表1–2](https://arxiv.org/html/2604.05839v1) | 600测试任务；Sonnet 4.5 初稿→三轮的综合 VLM 分数7.584→8.048，报告 tokens 6,446→131,550。judge 对200组非平局人类偏好69.5%一致、22%不一致、8.5%平局 | 视觉＋代码 critique 可改善评分类质量，但未隔离截图贡献或给 Sonnet 做等 token 无视觉对照；不是执行完整用户任务，也不能用模型评分替用户接受体验 |
| [InteractGUI / VF-Coder v1，§5.3](https://arxiv.org/html/2604.19750v1)与[固定入口](https://github.com/leozhilin/VF_Coder/blob/10bd5e6bebb34ba6c13ee4cf93802a575d9bb701/vf_coder_main_loop.py#L55-L74) | Gemini-3-Flash / PySide6 将 GUI Operator 与错误截图反馈分开开关；[修复者代码](https://github.com/leozhilin/VF_Coder/blob/10bd5e6bebb34ba6c13ee4cf93802a575d9bb701/vf_coder/code_agent/code_agent.py#L507)仅在 visual 模式附加错误截图，目标参考图仍可独立提供 | 发现运行状态与传达视觉错误是不同增量，不能合并成“接入浏览器收益”。论文称984任务，但缺逐例结果/种子/置信区间，表4部分百分比不能按984整数通过数还原；不据此排名或宣称显著收益 |

以上数字与机制为 **[一手：论文报告与固定源码]**，未独立复现。它们不构成同一当前强 Agent、同任务、等预算的 DOM/截图/时间线/真实用户四方对照；表中接入取舍为 **[经验：工程建议]**。

**具体使用边界。** 选中或保存错误若已能由真实浏览器动作与结果断言揭示，不必新增截图循环；裁切、间距、素材与画布问题则必须补足视觉观察。结果最终正确、但早期点击丢失时，补动作时刻与事件顺序。[Playwright hydration 说明](https://playwright.dev/docs/navigations#hydration)明确指出控件启用早于监听器绑定会吞掉输入，建议应用就绪前禁用控件；不能靠延后测试输入制造通过。直接设置 DOM/组件状态不等于测试真实输入。**[一手：官方机制；经验：最小反馈建议]**

用户是否理解入口、能否恢复误操作、是否接受体验仍需具体任务试用；上表的偏好一致性只提示自动 judge 有边界，未测得真实用户参与的净收益。每次修订保留原功能与视觉要求；仅在现有证据不能判断所需结论时补通道，不扩成默认多 Agent 验收框架。**[经验：采用与停止条件]**

### Service Worker：响应来源决定保存与故障验收入口

核实：2026-10-15（UTC+8）。改变 23 §3/§4：服务器同步的验收增加独立读取，故障注入增加实际命中确认；本地保存不强加服务端要求。复用现有 API／浏览器测试，不增加平台或框架。**[经验：采用判断]**

**成功页面可能完全来自本地。** Playwright [固定修复提交 `ea75b9f` 的回归 L23–98](https://github.com/microsoft/playwright/blob/ea75b9f32ca4120efdfaf8f5b8cfd292f548f197/tests/library/browsercontext-service-worker-policy.spec.ts#L23-L98)覆盖 literal、Cache Storage、network fallback 和 preload fallback；L79–92 要求当前页和同 context 的新页都返回 200、来自 worker、显示 offline，同时目标服务端请求数为 0。恢复在线后才要求请求数变成 1。它证明响应来源的机制，不是业务保存缺陷的实测。**[一手：官方测试定义]**

因此若契约是“已同步到服务端”，刷新／重新开标签页不够：可复用 API 测试读取本次记录。固定 [APIRequestContext 实现 L350–389](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/packages/playwright-core/src/server/fetch.ts#L350-L389)使用 Node 的 HTTP/HTTPS 请求，不经过页面 worker；但服务端缓存和数据库耐久性仍是另一层，不能据此宣称落盘保证。若承诺只是本地持久保存，就验证本地重新打开，联网同步另列结果。**[一手：源码；经验：由机制推导的验收选择]**

**有请求事件，不等于故障规则命中。** 固定 [Chromium 回归 L373–434](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/library/chromium/chromium.spec.ts#L373-L434)同时收集 `page.on('request')`／context 事件与 route 命中：透明 worker 的 `/data.json` 网络请求可由 context 路由处理，页面侧同名请求虽产生事件，却不可路由。[后续回归 L436–538](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/library/chromium/chromium.spec.ts#L436-L538)还区分缓存命中、`/foo` 改写为 `/bar`、合成 200 和透传。因此对页面 URL 注册失败规则，不能直接算故障已注入；检查处理器实际命中及对应响应；在 Chromium 支持范围内，必要时改到 worker 所有的网络请求。**[一手：官方测试；经验：覆盖判断]**

**反证与工具边界。** 透明 worker 也会返回 `fromServiceWorker() === true`，不能把它等同于缓存命中，或要求该字段一律为 false；HTTP cache 与 worker 的 Cache Storage／合成响应也不同。[官方说明](https://playwright.dev/docs/service-workers)把这类 worker 观测／路由能力限定于 Chromium，并明确 worker 主脚本的更新请求仍不能路由；context 路由不是 Firefox／WebKit 的通用补救，也不覆盖所有 worker 请求。同页提醒禁用 worker 会改变实际页面行为，所以普通 API mock 可选择 block，验产品离线能力则不能借此绕过。**[一手；经验：采用边界]**

[真实报告 #42775](https://github.com/microsoft/playwright/issues/42775)在 1.63.0 的 WebKit 上发现：即使 worker 直接生成响应，离线模拟也拒绝导航；停止源站的对照则能返回。它不代表两种故障等价。[修复 #42894](https://github.com/microsoft/playwright/pull/42894)于 2026-10-05 合入上述 `ea75b9f`，在 page target 初始化时显式应用已配置的 offline 状态并补回归。固定测试仍跳过 Electron／旧 WebKit，并对 Firefox 的 network/preload fallback 标 fixme。离线测试失败时应先核工具版本、模拟范围和实际请求，不能直接撤掉产品要求。未核首次正式发布版本；PR 页面仍有失败检查，本轮没有复核其因果或宣称全 CI 通过。**[一手：报告、维护补丁与测试限制；经验：诊断选择]**

本轮通过官方连接器重新读取两组固定测试和 API 请求源码，并核对 issue／PR；未运行浏览器、上游测试或模型，不把测试存在当本仓执行结果，也不证明新模型交付成功率。**[研究：验证范围]**

### React：生产构建故障中的定向日志

✅ 当状态更新依赖时序，先在实际失败的构建中复现，再记录相关状态随时间的变化；只需现有浏览器和定向日志时，不必增加调试平台。**[经验：23 §4 采用建议，2026-10-13]**

**故障与新增反馈。** Dan Abramov 于 2026-02-18 提交的 [#35821](https://github.com/react/react/issues/35821) 包含[公开复现](https://github.com/gaearon/react-udv-bug)：输入经 server action 返回 JSX，`useDeferredValue` 在开发构建追上输入，在生产构建经常卡在旧值。[3 月 24 日原帖](https://bsky.app/profile/danabra.mov/post/3mhrdue7gds2h)称此前 Claude 未能定位或写出失败测试；[紧接原帖](https://bsky.app/profile/danabra.mov/post/3mhrdwgnhkc2h)说明后来按浏览器复现、阅读人指定的相关源码、给生产 bundle 加日志、修复的顺序完成。这支持“给 Agent 实际状态变化”，不证明源码阅读本身不可能发现问题。**[一手：故障报告与作者自述，非完整模型运行记录]**

**实现决定与回归契约。** [固定合并提交 `c0d218f0f3e02ed581f74096e56baa947213135d`](https://github.com/react/react/commit/c0d218f0f3e02ed581f74096e56baa947213135d) 在 `pingSuspendedRoot` 不能立即重启当前 render 的分支保存 pinged lanes，避免随后被标记为 suspended 而失去重试；没有增加业务层轮询。新增测试让兄弟组件在同一 render 内 resolve 先前挂起的数据，最终必须渲染 updated；另一个既有测试记录新增的重试行为。运行中“何时发生 resolve/ping”由此变成确定的回归条件，而非仅检查页面存在。**[一手：补丁与回归代码；研究：机制归纳]**

**结果边界。** [#36134](https://github.com/react/react/pull/36134) 署名由 Claude 编写/调试，获 acdlite 批准，2026-03-24 合入并关闭原 issue；本例固定修复版本是上述提交，未核实首次包含它的正式发布版本，不表示当前仍有该缺陷。PR 页面显示 245 checks passed；其 Test Plan 列出撤掉源修复应令新测试失败、修复 bundle 应解决原 repro，但这不是本轮读到的原始红绿日志或浏览器复验记录。本轮未读原 CI 逐项日志、未独立重跑，也未取得原会话日志。**[一手：署名、合入与平台聚合结果；研究：验证范围]**

**替代解释与最小接入。** review 指出源码已有相关 TODO，作者也给了源码范围与日志建议；专家知识、可靠复现和会话差异都可能有贡献，不能把成功或作者所述耗时单独归因于日志。保留失败构建与输入，只观察能区分假设的状态；把确认的触发条件写入已有回归。临时日志可能改变调度，因此最终需移除诊断输出，再复测原用户路径。这是单个有专家参与的历史修复，不是工具效果对照。**[一手：review 与作者记录；经验：接入与反证要求]**

### 属性测试：搜索反例不等于确认或修好缺陷

核实：2026-10-13。主线二；改变 15 §6：输入组合多、有明确契约且执行便宜时，试用小范围属性搜索，不默认加测试 Skill 或全仓扫描。**[经验：采用判断]**


1. [NumPy PR #29609](https://github.com/numpy/numpy/pull/29609)：Agent 提议并执行 Wald 样本非负属性；作者称自己花了数小时验证、定位并亲自编写修复。Agent 发现不等于 Agent 修好。[维护者独立复验](https://github.com/numpy/numpy/pull/29609#issuecomment-3210974565)表明初始 mean=1e8 在他的构建不失败，改1e9才得到3个负样本；作者确认同样结果。**[一手：原始PR与回复]**
2. [最终合并补丁](https://github.com/numpy/numpy/commit/0ce0ef0bae095e44770a20b64177f07f11758715)不是 PR 初稿公式；最终为 `d=1+sqrt(1+4*scale/Y)`、`X=mean*(1-2/d)`，新增固定seed、mean=1e9、scale=2.25、1000样本的回归。[2.3.4发布](https://github.com/numpy/numpy/releases/tag/v2.3.4)列入backport #29926；[2.3.4固定Generator实现](https://github.com/numpy/numpy/blob/1458b9e79d1a5755eae9adcb346758f449b6b430/numpy/random/src/distributions/distributions.c#L846-L861)已改变，[同版本legacy_wald](https://github.com/numpy/numpy/blob/1458b9e79d1a5755eae9adcb346758f449b6b430/numpy/random/src/legacy/legacy-distributions.c#L147-L163)仍是旧式。不要概括为所有numpy.random.wald入口都已修复，也不把正文早期残余失败自动归给最终版。**[一手：固定源码与发布]**
3. 属性根据：[NumPy 2.3官方API](https://numpy.org/doc/2.3/reference/random/generated/numpy.random.Generator.wald.html)规定正mean/scale，输出Wald分布；非负性得到维护者确认。它不是复制实现中间值作为预期。**[一手：API与维护者]**
4. [dateutil #1437维护者回复](https://github.com/dateutil/dateutil/issues/1437#issuecomment-3225141158)：method=1返回Julian名义年月日，但Python date按Gregorian算weekday，2015-03-30因此显示非周日；method=2才转Gregorian为2015-04-12。原报告被判预期行为。以“Easter必须周日”跨日历强加断言会制造误报。[官方方法契约](https://dateutil.readthedocs.io/en/stable/easter.html)也分三种算法。**[一手：原始判定与API]**

#### 成本与限制

- 采用已有测试环境；仅当组合输入确实难枚举才加小范围属性测试。生成器需要维护有效域，过窄丢掉边界，太宽会测无效输入。语义不清、UI感受、慢且有真实外部副作用的路径不应先用大规模随机执行。**[经验：采用/撤回条件]**
- [Hypothesis官方运行次数说明](https://hypothesis.readthedocs.io/en/latest/explanation/test-case-count.html)指出过滤重试、失败收缩、解释与重放会使实际执行次数超出max_examples；因此该字段不是调用/耗时硬预算，昂贵路径要单列隔离与总时限。[重放API](https://hypothesis.readthedocs.io/en/latest/reference/api.html#hypothesis.reproduce_failure)的blob不保证跨Hypothesis版本，永久回归优先保留显式输入。**[一手：当前文档，2026-10-13]**
- [研究全文v1](https://arxiv.org/html/2510.09907v1)使用Opus4.1扫描933模块，API总成本$5474.20，不含本例人工修复工时；最初50份人工复核来自初筛分数前80%，不能把56%合法率当984份完整普查。本轮未取得当前强Agent“无PBT/有PBT”同任务净收益对照，本轮也没跑模型。**[一手：论文；研究：适用边界]**

#### 本轮零成本公式对照

以下是本轮自己编写、实际运行的 Python 标准库程序；不执行 NumPy、Hypothesis、上游仓库代码或模型。固定三组 mean、scale=2.25，枚举 n=i/1000（i=1..9999），只对照抽样公式的中间 X；80 位 Decimal 采用独立的无抵消有理化式。不是随机分布、跨平台 NumPy 或 Hypothesis 生成/收缩性能验证。**[研究：局部机制实测]**

```python
"""Own standard-library numerical probe, not a NumPy or model run.
Formula provenance: NumPy 0ce0ef0bae095e44770a20b64177f07f11758715.
Only n > 0 is covered; Python division-by-zero differs from NumPy's C path.
"""
import math
import platform
from decimal import Decimal, localcontext


def old_x(mean, scale, n):
    y = mean * n * n
    return mean + mean / (2 * scale) * (y - math.sqrt(4 * scale * y + y * y))


def merged_x(mean, scale, n):
    y = mean * n * n
    d = 1 + math.sqrt(1 + 4 * scale / y)
    return mean * (1 - 2 / d)


def reference_x(mean, scale, n):
    # Independent rationalization, with no subtraction of near-equal terms.
    with localcontext() as ctx:
        ctx.prec = 80
        mu, lam, z = map(lambda v: Decimal(str(v)), (mean, scale, n))
        y = mu * z * z
        return mu / (1 + y / (2 * lam) + (y * (4 * lam + y)).sqrt() / (2 * lam))


print('python', platform.python_version(), 'mantissa_bits', __import__('sys').float_info.mant_dig)
for mean in (1.0, 1000.0, 1e9):
    cases = [(i, i / 1000) for i in range(1, 10000)]
    failures = [(i, n, old_x(mean, 2.25, n)) for i, n in cases if old_x(mean, 2.25, n) < 0]
    after = sum(merged_x(mean, 2.25, n) < 0 for _, n in cases)
    print('grid', 'mean', mean, 'scale', 2.25, 'n=0.001..9.999', 'cases', len(cases), 'old_negative', len(failures), 'merged_negative', after)
    if failures:
        i, n, old = failures[0]
        ref = reference_x(mean, 2.25, n)
        new = merged_x(mean, 2.25, n)
        print('first_in_grid', 'i', i, 'n', n, 'old', repr(old), 'merged', repr(new), 'reference', format(ref, '.25g'))
        assert old < 0 < new and ref > 0
        assert abs(Decimal(str(new)) / ref - 1) < Decimal('1e-6')
        assert after == 0
# A counterexample to treating non-negativity alone as numerical accuracy.
mean, scale, n = 1e20, 2.25, 1.0
new, ref = merged_x(mean, scale, n), reference_x(mean, scale, n)
print('weak_oracle', 'mean', mean, 'n', n, 'merged', new, 'reference', format(ref, '.25g'), 'nonnegative_pass', new >= 0)
assert new == 0 and ref > 2
print('PASS: local mechanism checks; NOT NumPy/Hypothesis execution or model benefit')
```

原始输出：

```text
python 3.12.14 mantissa_bits 53
grid mean 1.0 scale 2.25 n=0.001..9.999 cases 9999 old_negative 0 merged_negative 0
grid mean 1000.0 scale 2.25 n=0.001..9.999 cases 9999 old_negative 0 merged_negative 0
grid mean 1000000000.0 scale 2.25 n=0.001..9.999 cases 9999 old_negative 52 merged_negative 0
first_in_grid i 1235 n 1.235 old -52.98190641403198 merged 1.4751921906253074 reference 1.475192180407241681105309
weak_oracle mean 1e+20 n 1.0 merged 0.0 reference 2.249999999999999999898750 nonnegative_pass True
PASS: local mechanism checks; NOT NumPy/Hypothesis execution or model benefit
```

同一小网格在普通参数下两式均无负值，在 mean=1e9 下旧式52次负值、最终式0次；首个反例n=1.235与独立高精度正值对照。另一个极端输入使最终式归零，非负检查仍通过，说明单一属性不能充当数值精度验收。程序只覆盖n>0，不能用Python除零行为推断C实现。**[研究：实际结果与边界]**

程序 SHA256：`7f7130436211bb82e4eb334afbc5ef56c713c4eaecd5f64168be13ab37194263`；输出 SHA256：`a2c69ab5866f715813a88228a914fafe2fa974f2dbfcfc58d537172fab7caf72`。未运行新的模型、NumPy或Hypothesis实验，也未测交付总成本；没有据此证明额外 Skill 比直接提示更有效。

### 外部生产者校准错误预期

> 核实：2026-10-13 UTC。15 §6 的窄增量：外部兼容预期应来自生产者，有证据时修正旧断言；不要求增加 reviewer 或重复用例。**[研究：采用判断]**

RTK 的[真实用户报告 #2367](https://github.com/rtk-ai/rtk/issues/2367)是 Windows 默认当前项目发现为零。[旧源码 5d32d073](https://github.com/rtk-ai/rtk/blob/5d32d0736f686b69d1e8b9dc45c007d4eb77a0a2/src/discover/provider.rs#L404-L410)已有 Windows 测试，却与实现、注释共同把合成路径 `C:\Users\foo\bar` 的预期写成 `C:-Users-foo-bar`；真实生产者目录应为双连字符。该基线 [CI](https://github.com/rtk-ai/rtk/actions/runs/29001896511) 的 Linux/macOS/Windows `cargo test --all` 步骤均成功，但原始 Windows 日志已返回 410，未逐例确认该用例的执行结果。**[社区：故障报告；一手：源码与 CI 元数据]**

[已合入 #2952](https://github.com/rtk-ai/rtk/pull/2952)（head `40fccbd8ef11d7cfda951253fa6f63944f1188e4`）同时添加冒号替换、修正文档和旧断言；贡献者报告原机默认命令 0→1，维护者[要求删除重复测试](https://github.com/rtk-ai/rtk/pull/2952#pullrequestreview-4922112994)，最终补丁只修正旧用例。另一贡献者[检查生产者目录后撤回大小写归因并报告 0→30](https://github.com/rtk-ai/rtk/issues/2919#issuecomment-5008576670)，其 #3043 未合入，不能当成 #2952 发布后的独立复测。**[一手：补丁与评审；社区：运行报告]**

反例与边界：改断言不必然是弱化验收，重复同路径测试也不必然更可靠；`--all` 找到历史仅能辅助诊断，不能替代当前项目筛选。上述实跑均属贡献者报告；[有 Claude Code 标记的 #2368](https://github.com/rtk-ai/rtk/pull/2368)是未合入的修正稿，不能据此归因 AI 写出原 bug，也未证明所有版本或大小写场景恢复。

标准库局部探测：只用合成路径与临时空文件，按已读源码写出的 **Python 逻辑模型，非 Rust/Windows/RTK 执行**；固定期望目录不调用编码函数生成。旧编码找到 0 个，新编码恰好找到 1 个，无关目录均未命中。**[研究：本轮实际运行，机制范围]**

```python
from pathlib import Path
from tempfile import TemporaryDirectory

cwd = r"C:\Users\foo\bar"
with TemporaryDirectory() as tmp:
    root = Path(tmp)
    for slug in ("C--Users-foo-bar", "C--Users-other-project"):
        (root / slug).mkdir()
        (root / slug / "session.jsonl").touch()
    for label, chars, count in (("old", "/._\\ []", 0), ("new", "/._\\ []:", 1)):
        encoded = "".join("-" if not c.isascii() or c in chars else c for c in cwd)
        hits = sorted(p.parent.name for d in root.iterdir()
                      if encoded in d.name for p in d.glob("*.jsonl"))
        assert len(hits) == count
        assert "C--Users-other-project" not in hits
        print(label, encoded, hits)
print("PASS: Python logic model only; NOT Rust, Windows or RTK execution")
```

输出：`old C:-Users-foo-bar []`；`new C--Users-foo-bar ['C--Users-foo-bar']`；`PASS: Python logic model only; NOT Rust, Windows or RTK execution`。它只验证已选映射与过滤逻辑的区别，不验证生产者完整算法或真实 CLI。

## 三、领域知识比通用规划更可能是持久资产

对存量系统，API 类型只描述部分约束。舍入、时区、历史错误码、哪个任务实际运行、哪些异常被业务接受，经常决定修改是否正确。把这些整理成可追踪的案例、数据说明和短设计理由，可能比再教强模型“先计划后执行”更有增量。**[经验：待案例检验的判断]**

S2 的迁移教程用 COBOL/JCL 数据流说明这点，但不能整套照搬：

- 它安排多份 overview/design/validation 文档，适合复杂迁移，不是每个小功能都需要四份文件。
- 第 3 阶段明确允许测试占位，之后才接入旧/新系统；因此“测试文件已生成”不是兼容性已验证。试点时应尽早确认旧系统是否真能运行，否则可能写出大量无法验证的迁移计划。
- 旧系统是行为基线，不是所有行为都正确。应分清必须兼容、明确要改变、仍有争议的行为；否则 Agent 会复制旧 bug，或擅自修正实际上必须兼容的细节。
- 教程出现 `.agent/AGENTS.md` 的规划例子。按已核对的 Codex 指令发现机制，不能由文件存在推断它在仓库根任务自动加载；要有适用目录或明确引用。这再次说明官方教程也需结合客户端机制阅读。

### 迁移后的事实归属与旧调用方式

> 核实：2026-10-14 UTC。改变 15 §5 的试点范围：职责迁移后，输出相同仍不足以证明查询走在正确系统上。**[研究：采用判断]**

[Anthropic 源码管理团队复盘](https://www.anthropic.com/engineering/redesigning-source-control)发表于 2026-10-13；“What we learned building Scion”报告，多个系统让 Agent 线性读取提交日志来推算变更何时合入 main，而工程师要求改向代码评审工具查询。这里缺的不是更多逐文件验证，而是确定谁负责提供这项事实。**[一手：工程团队自述；研究：原因与建议提炼]** 因此在跨系统迁移试点中，检查查询来源及已退役的调用方式；不能仅因新旧输出相等就接受原有扫描或状态重建路径。

**保留兼容的反例。** [Sapling 官方介绍](https://sapling-scm.com/docs/introduction/)的“Why make a new version control?”说明，其内部抽象将体验与仓库格式分离，使内部扩展方案仍能与 Git 仓库交互。**[一手：官方设计说明，非同负载对照]** 所以采用的是事实归属检查，不是默认删除兼容：外部消费者仍需要旧接口，或新接口不能覆盖语义、权限及可用性要求时，保留适配或缩小迁移范围。**[经验：采用与撤回条件]**

**来源边界。** 本轮读了上述官方原文，未取得 Scion 对应补丁、固定源码版本、原始轨迹或独立复测；日期固定的是复盘发表时间，不保证网页内容不可变。Sapling 为当前官方文档，未固定历史版本。未运行上游软件或模型，不能据此量化维护成本、比较模型能力，或证明增加工作流的净收益。

## 四、游戏开发用来检验这个方向，而不是扩张引擎百科

游戏把一般软件中的反馈问题放大了：时间推进、输入响应、随机性、资源加载、相机和画面都可能影响观察。主线可以从中学到如何设计让 Agent 理解和操作系统的接口，但不能从一个玩法或引擎外推全部游戏。

假设要修“冲刺后偶尔穿墙”：保存初始位置、速度、碰撞体、输入序列与相关种子，配合固定步推进，有助于重复调查；同时还要通过真实输入链与实际帧时序复查。直接设置最终位置或只调用移动函数会跳过输入采样、动画与物理调度，不能证明用户路径修复。固定种子也不自动消除物理引擎、并发和平台差异。**[经验：案例设计，未运行引擎]**

状态接口、截图与人工试玩各有价值：状态能定位机制，截图能发现遮挡和呈现问题，人能判断控制感和目标玩法。不要把它们排成一种永久的“性价比最高”顺序。内部状态断言通过而画面不可玩，是需要解释的分歧；玩家不喜欢一个正确实现的机制，也可能意味着需要改变设计目标，而不是继续修代码。

上述冲刺例子是分析设计，未运行引擎；Jeff Schomay 原博客在原调查中访问受限，没有把旧文转述升级为一手复核。实际选型应回到对应领域页，不用“L3 性价比最高”或“AI 做不出好玩游戏”替代具体证据。**[研究：来源与适用边界]**

## 五、我们应怎样安排研究，而不是怎样继续加任务

下列案例把项目知识、反馈与架构判断落实到真实后续修改。选择干预时须指出任务缺口、替代方案与额外成本；模型能力仍可能是瓶颈，撤回条件见本节末尾，不再沿早期 D4／D6 分工重复扩任务。**[经验：选材原则]**

### Discourse：共享组件承接后续需求

✅ 对语义相同的新视图，先复用现有组件；真实需求出现时，再检查能否只扩展共享边界，不提前建立通用框架。**[研究：采用判断，2026-10-13]**

**起点与归属。** [#38888](https://github.com/discourse/discourse/pull/38888) 由 markvanlan 提交，2026-04-16 合并；[固定提交](https://github.com/discourse/discourse/commit/8feeaa5d69cd9462cc6aa4f560cb1e953e588e0b) 列 Claude Opus 4.6 及多位人类 coauthor，记录作者声明的 AI 参与，不包含生成过程，不能归因全部代码。[初始 header](https://github.com/discourse/discourse/blob/8feeaa5d69cd9462cc6aa4f560cb1e953e588e0b/frontend/discourse/app/components/nested-view-header.gjs) 直接导入并渲染已有 TopicCategory。**[一手：署名与源码]**

**真正的下一需求。** 8 月 11 日，另一贡献者 nullchristo 的 [#42520](https://github.com/discourse/discourse/pull/42520) 为客户插件在 category/tags 旁增加信息提供扩展点。[合并补丁](https://github.com/discourse/discourse/commit/e4f8b88ea34f1fe23474a62ddb1afb01b65f7b8e) 只改共享 TopicCategory 的包装 outlet 和 docked header 的 topic 参数；同版本 [nested/header](https://github.com/discourse/discourse/blob/e4f8b88ea34f1fe23474a62ddb1afb01b65f7b8e/frontend/discourse/app/components/nested/header.gjs) 仍调用它，未另改树加载或复制 nested 专属实现。此人的登录名不同于初始作者与列出的人类 coauthor，但不能断言是首次接触项目。**[一手：需求、补丁与调用链]**

**交付边界。** 后续 PR 获批准并合并。[core frontend 原日志](https://github.com/discourse/discourse/actions/runs/31506849232/job/93830516975) 核实运行版本为 `48d4571d4d747ae4fade0c49fd9e851fb693cd78`，即 head `cd63a1cc4b647701f505131af05bd7368fdf4bc5` 与 base `3908561e29d2187ac622eadd8a59fa3ba54ebac1` 的测试合并；`qunit:test` 汇总 6473 passed、0 skipped/failed。补丁没有新增测试，日志中通用 PluginOutlet 用例不等于新客户插件验收；原需求说将支持该插件，没有客户部署、复测或人力计时。本次只读源码与日志，未复跑。**[一手：CI 原日志；研究：范围限定]**

**反例约束。** [真实管理员报告](https://meta.discourse.org/t/im-struggling-to-recover-deleted-post-how-to-fix/403161/1)显示，已删除 nested topic 的 500 阻断恢复。[#40134](https://github.com/discourse/discourse/pull/40134) 的[固定修复](https://github.com/discourse/discourse/commit/a051d96b6526c7a2ad2b7754863d7364e6401c28)给 OP 查询补接已有 visibility helper，并新增 staff show/context 返回 200 与 placeholder、non-staff 返回 404 的断言。修复作者 xfalcox 也是初始人类 coauthor，属团队维护；手工恢复未勾选，不能写用户已成功恢复。**[社区：用户原帖；一手：补丁]**

因此，UI 复用可以承接下一次扩展，却不能保证后台生命周期完整；让 Agent 同时检查必要的查看、删除、恢复路径。局部补接能满足契约时，无需升级为架构重写。**[研究：采用建议]**

### Pydantic AI：取消契约改变，不代表正常完成也应改变

> 核实：2026-10-14 UTC。主线三；改变 22 §5：把“本次要改变的行为”与“相邻仍须保留的行为”成对验收，再判断修复应落在哪层。✅ 采用；不是新的模型效果实验。**[研究：采用判断]**

**固定演化链。** 以下源码均只读，未安装或执行 Pydantic AI：

| 阶段 | 固定来源／真实需求 | 能确认什么 |
|---|---|---|
| 初始产物 | [v1.91.0 的 `_agent_graph.py`](https://github.com/pydantic/pydantic-ai/blob/b83abdf23d2cfe9940a83b51b1ce7abe0fc9b807/pydantic_ai_slim/pydantic_ai/_agent_graph.py#L668-L677) | 共享节点在消费者返回后继续排空，注释说明用于完整 usage 统计；是行为基线，不是这条路径的历史通过日志 |
| 后续真实需求 | [#5132](https://github.com/pydantic/pydantic-ai/issues/5132)；[变更 `93a6104`](https://github.com/pydantic/pydantic-ai/commit/93a61042943d3887c737ba753b908f258e8ea162) | 报告者在 1.81.0 的取消复现中记录清理未完成、仍有 4 个任务；#5313 引入托管流的确定性清理，并移除共享节点的排空循环 |
| 用户故障与修复判定 | [#5769](https://github.com/pydantic/pydantic-ai/issues/5769)、[#5771](https://github.com/pydantic/pydantic-ai/pull/5771) | 报告涉及 1.92–1.105 的空响应／零 usage；维护者将条件收窄为 handler 正常返回但未消费完流，普通无 handler 路径不受影响 |
| 窄修复产物 | [最终 `49f62a3`](https://github.com/pydantic/pydantic-ai/commit/49f62a386041abd6e0d960dd629c3b4fe28eac63) | 只改 `agent/abstract.py` 与 `tests/test_streaming.py`：在三处 driver 的 handler 正常返回后排空，异常向外传播时不进入该语句；保留共享节点与公开 API |

源码、补丁为 **[一手]**；故障输出为 **[社区：报告者实跑自述]**，并非本仓复现。#5132 明确披露由 AI coding assistant 与用户协作提出；#5313／#5771 另有 Codex、Devin 自动评审，但不能据通用 AI checklist 推断实现由哪个模型生成。

**为什么不能恢复旧循环了事。** 正常返回的 handler 可以只观察部分事件，最终响应仍须完整。共享节点的旧循环位于 `yield` 后、`try` 内，向外传播的异常本来就会跳过它；#5771 指出的另一冲突是显式 `stream.cancel()` 后仍可正常退出上下文，旧循环仍会尝试排空。最终由 driver 在 handler 正常返回后补齐流，向外传播的取消／其他异常则跳过；handler 内部只 `break` 再正常返回仍属于应排空的路径。这里分别保留显式取消与正常完成的契约，调整完成策略的职责归属，不是全局架构重写。**[一手：前后控制流、修复说明；研究：决策解释]**

这也不是“内层已有抽象就绝不动外层”。[Devin 指出](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3349919895) `CallToolsNode` 内层自排空不保证 capability wrapper 完成；[作者明确回复](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3353383025)已修正，最终三处分支一致。[Codex 则提出](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3349656443)删除公开 `AgentStream.drain()` 会破坏调用者；[最终 `result.py`](https://github.com/pydantic/pydantic-ai/blob/49f62a386041abd6e0d960dd629c3b4fe28eac63/pydantic_ai_slim/pydantic_ai/result.py#L173-L177)仍保留该方法。前者有作者确认，后者只有评审与最终产物对应，不能宣称某条反馈单独导致全部修订。**[一手：评审、回复、源码]**

**成对验收与执行边界。** 最终新增四个正常完成测试，分别覆盖 `run`／`run_stream` 的完整文本与工具调用；另一个仅覆盖 `run` 的取消测试使用无限流，handler 抛出 `CancelledError`，要求只发生一次前置 lookahead。它们把“完成结果不丢”与“取消不继续消费”同时写入契约。[先前测试提交](https://github.com/pydantic/pydantic-ai/commit/95d9ff040d327a57423438df060b23bfb3e65d50)报告 `try/finally` 排空变体会失败；[后续提交](https://github.com/pydantic/pydantic-ai/commit/230e6d10ea4ec13198bd80fffc2014b2ac23e13f)将有限 sentinel 改为无限流与计数，以消除不可达的覆盖行。这里确认的是测试定义与作者 mutation-testing 自述，没有取得其原始红绿日志。PR 页面显示 56 checks passed，也不能代替逐测试前后结果。**[一手：测试、提交说明与平台摘要]**

**最强反证。** #5771 明说用户最初贴的非流式例子并不触发该路径；#5769 当前正文已经过修改，不能把它当作原始复现成功记录。修复 PR 正文还残留“CallToolsNode 分支不动”的描述，与最终补丁不同，故以上以固定产物和作者后续回复为准。[第三方历史复演](https://www.startearly.ai/regression-case-files/pydantic-ai-release-replay/)另报告 TestModel 在 1.91 通过、1.92 失败、1.106 通过；它是预先选中已知故障版本的事后试验，本文未重跑，也不用于证明其检测产品普遍有效。**[一手：维护者解释；社区：第三方复演]**

**给使用 Agent 的开发者的具体取舍。** 接到改变生命周期的需求时，先写清触发条件、退出方式与应保留的结果，而不把整个旧测试集合统一判为兼容或过时。已有抽象仍能满足不同路径时保留；共享收尾无法区分两种合法契约时，只把策略移到拥有该区别的调用层，同时验相邻路径和公开接口。只有这一步仍无法表达要求时，再提出更大重构。**[研究：从本例提炼的采用条件，不是普遍净收益]**

#### 累计到下一次需求：保存、重放、整轮取消不是同一个契约

> 核实：2026-10-14 UTC。本节接续同一取消／历史链。三项新增要求是**保存中断产物、重新使用这些产物、从外部停止整轮并取回状态**；不把评审轮次或修 bug 数量当作需求次数。**[研究：比较范围]**

| 阶段与真实要求 | 固定产物、责任与操作变化 | 保留什么，什么有意改变 |
|---|---|---|
| 1. 取消返回前完成清理；正常返回仍交付完整结果 | 上文 `93a6104` 将事件流清理交给托管迭代器；`49f62a3` 把正常完成排空放到 handler driver，而非恢复共享节点旧循环 | 取消不继续消费与正常完成不丢结果同时成立；先分清退出策略，不统一所有路径 |
| 2. 前端已显示的中断输出也要保存 | [#3219](https://github.com/pydantic/pydantic-ai/issues/3219) → [#5364／`35fb827`](https://github.com/pydantic/pydantic-ai/commit/35fb8271688f438844e43cb0020d371a34cdc47a)。图节点在异常路径记录部分 response／tool returns，消息增加 interrupted 状态；工具返回非空才追加 request | 从“完成产物”增加到“可辨识的部分产物”；尚未承诺所有捕获历史都可再次发给模型 |
| 3. 将中断历史用于下一轮，而非仅供观察 | [#5836](https://github.com/pydantic/pydantic-ai/issues/5836) → [#6319／`8602986`](https://github.com/pydantic/pydantic-ai/commit/86029861bb86b210c29b3d3f3f3d5660fefd8c57)。共享历史清理层修复未配对工具调用、处理孤立结果，UI adapter 往返保存 outcome；测试包括不应自动修复的 deferred frontier | 尚待处理的工具与已经中断的工具必须区分；原始记录与发送给 provider 的整理分层，不把修复散到所有调用者 |
| 4. stop 按钮、线程或工具要停止整轮并拿回状态 | [#5835](https://github.com/pydantic/pydantic-ai/issues/5835) → [#6497／`a19b68a`](https://github.com/pydantic/pydantic-ai/commit/a19b68adeb2d18efd3719bb3c7f738a853d41984)。增加 run-scoped controller、token、外层取消分类与清理完成后的快照；复用 stream/tool teardown，响应级 cancel 保持原义 | 外部 `CancelledError` 继续传播以保留 timeout／TaskGroup 语义，本方取消以 `RunCancelled` 携带状态。新的控制范围要求掌握整轮状态的责任边界，不能只在流末尾补判断 |
| 5. 新契约的实际反例：首个工具尚未返回就取消 | [用户 #7977](https://github.com/pydantic/pydantic-ai/issues/7977) 在 2.37.0 给出确定性复现；[#7993／`1467456`](https://github.com/pydantic/pydantic-ai/commit/1467456556b9109b5b92eb7c7def8eabb5287775) 去掉旧 `if output_parts` 门槛，保留空 interrupted request | 阶段 2 的“空数据不保存”已不成立：消息还承担“这些工具不会再返回”的恢复信号。错误路径精确消息计数有意改变；修复沿已有 repair 边界完成，无须再次重构整轮控制 |

需求、源码和测试定义为 **[一手]**；用户复现为 **[社区：报告者运行]**。本轮读固定补丁，未运行 Pydantic AI。历史 repair 与 run controller 是不同责任，不能把作用全部归给 #6497。#7993 新增带／不带新 prompt 的恢复、错误退出恢复及多个 dangling calls 覆盖；作者称前三例旧版失败、新版通过，本轮未取得其逐例红绿原日志。

**晚期仍可窄修，而非越改越大。** run 级能力已有后，[#7743](https://github.com/pydantic/pydantic-ai/pull/7743)针对用户 #7722 的 adapter 不接收 token，把可选参数经三个入口转发到已有 run API，并补 native／编码流／dispatch 测试。它支持补接线，不支持再造 UI 专属取消控制器；这是已有承诺的接入缺口，不额外计作新需求。**[一手：补丁与需求；研究：选择解释]**

#### 接收者接下来做了什么：删除补偿层，而非恢复旧测试期待

**[一手：历史 CI；社区：接收者隔离报告]** [akgentic-llm #155](https://github.com/b12consulting/akgentic-llm/issues/155) 的 jltournay 调查了下游 healing／恢复测试失效。独立复核取得同一 `db899ae0e2ba32d9da3cdbf3465025f8dbb4afe5` 的[9 月 2 日 job](https://github.com/b12consulting/akgentic-llm/actions/runs/33616228928/job/100202578437) 885 passed，以及[9 月 3 日 job](https://github.com/b12consulting/akgentic-llm/actions/runs/33759029604/job/100660445431) 9 failed、876 passed。代码相同，环境不同：slim／graph、anyio、ast-serialize、prices、genai 等依赖均变化，不能把这组 CI 当作只改变 Pydantic AI 的对照。作者另报告隔离依赖后将八项定位到 2.37→2.38、另一项定位到 anyio；该因果定位仍归作者报告。

**[一手：最终产物]** [#156／`94779e1`](https://github.com/b12consulting/akgentic-llm/commit/94779e16adc47e964e0976c5311a276953fa6ca7)落实了接管选择：

- 原 `HealingCapability` 在错误钩子看到末尾已是空 request 后不再执行，上游下一轮会补工具返回；下游删除该能力、挂载顺序依赖、公开导出及专属常量，保留预算恢复决策 `LimitRecoveryCapability`。删的是已被承担的责任，删文件数量不是工时收益
- 最初不改依赖下限的决定被[修正](https://github.com/b12consulting/akgentic-llm/issues/155#issuecomment-5619072935)：2.38 前首个工具未返回的失败路径不会留下该恢复标记，删除会破坏原来可恢复的路径。最终要求从 `>=2.32,<3` 改为 `>=2.38,<3`，保留已有主版本上限
- 删除公开名字而不留无效 shim，外部旧导入会报 `ImportError`；同时接受模型侧失败说明由项目特定文案变成上游通用 interrupted 文案。PR 要求下一 release 说明导出变化，作者把措辞损失留给 ADR owner 记录，不能称无兼容影响或已全部交付
- 同批 anyio 修复没有使所有 workaround 都删除：下游保留清理整个 per-loop entry 的 `_evict_anyio_run_vars`，改掉“没有本地补偿就必定泄漏”的负对照。上游只修其中 root-task 缓存，是否重复要逐项比较责任，不能按依赖升级一概撤掉本地层

**后期验收比数删改文件更有意义。** [新测试](https://github.com/b12consulting/akgentic-llm/blob/94779e16adc47e964e0976c5311a276953fa6ca7/tests/test_failed_run_history_resumes.py)经真实 `ReactAgent` 图和离线 `FunctionModel`，检查工具崩溃、预算耗尽后的下一轮模型输入有对应 call ID 的 interrupted return；通用失败要求同一异常对象及 traceback。另把失败事件经 `ModelMessagesTypeAdapter` JSON 往返，在新 agent 上 `restore_context` 后继续，验证持久化状态不会丢失恢复含义。**[一手：测试定义]**

[head CI job](https://github.com/b12consulting/akgentic-llm/actions/runs/34483676695/job/102892459538)绑定 `27ba731a2b696e6f57b7b84a5f46889e0ce9e4ed`，运行使用 slim 2.42.0／anyio 4.15.1，原日志为 **866 passed、99.10%**，包括新文件四例；与作者另报的本地 865 pass／98.3% 分开记录。它是历史确定性框架集成测试，不是本仓运行、真实模型服务或 OS 进程重启：恢复例的新工具名是 `kaboom_again`，下一轮直接返回文本，未证明原工具可以重新执行。**[一手：历史 CI 原日志；研究：运行边界]**

另一维护者 gpiroux 于 9 月 21 日合并，PR 无人工 review 记录，不能据此补写其理解工时。这是上游责任被下游实际采用的证据，不是陌生人首次接手整个项目。相邻仓库 [akgentic-agent #148](https://github.com/b12consulting/akgentic-agent/issues/148) 仍 open，两处说明还声称本地先修历史，实际已改为上游下一轮修复；本轮未核实 release note、ADR-016 落地、外部旧导入迁移或真实服务恢复。**[一手：合并与未闭环事项；研究：交付边界]**

#### 累计采用判断：下一需求改变了谁必须知道什么

✅ **局部补丁**：契约与责任不变，只是入口未传参或生产者漏发既有标记，沿现有 API／repair 层补齐，并验原调用者；#7743 与 #7993 是后期仍可小修的反例。**[研究：采用判断]**

✅ **窄扩展点或责任重构**：新需求只是让外层选择已有行为，先暴露窄入口；若改变控制范围、何时算完成、谁能分类退出，则移到掌握该区别的层。#5771 的正常完成 driver 与 #6497 的整轮 controller 各有范围，共用 finally 排空或统一异常类型无法表达两者契约。**[研究：采用判断]**

✅ **删除过期扩展并交接**：上游现已满足同一用户结果时，先核对最低支持版本并验证持久化恢复路径，再删除重复补偿；交代公开导出、诊断文案、剩余预算策略及跨仓说明归属。下游红测试可能是在期待旧实现，不应为保绿把已移交的责任搬回来；仍承担不同责任的 workaround 则保留。**[研究：采用判断]**

这条链支持条件分界，尚不支持某个模型或架构普遍减少维护工时。下一证据应是下游最低支持版本的完整验收、发布后导入迁移与实际恢复；继续增加相似取消用例不能替代交付结果。

### CodeThread：下一次修改失败，先查继承了什么行为

> 核实：2026-10-14 UTC。主线三，关联四；改变 20 §4 的续改诊断：检查新功能依赖的旧函数行为，不只审最新 diff 或先降低复杂度。✅ 采用此诊断顺序；不新增指标门禁、Hook 或模型评判器。**[研究：采用判断]**

**新证据与选择条件。** [CodeThread v2](https://arxiv.org/html/2606.21804v2)发表于 2026-09-29（v1 为 6-19）。四模型在同一后续问题上继承历史人工实现或 Agent 重建实现；第一步须通过 P2P、仍失败于全部 F2P，每条件单次运行。四模型共有交集的 16 组比较中有四组持平或反向；该交集内最大下降 13.1 个百分点不是普遍损失，也不是各模型完整样本的最大值（附录 B 的 GLM／Multilingual 为下降 13.8 个百分点）。405 个结果不同且特征完整的样本中，输入／错误契约偏移的 OR 为 1.83（95% CI 1.15–2.92），本回归中圈复杂度／认知复杂度未显示显著关联。**[研究：论文 §3–5；非本仓运行]**

**反证。** v2 增加第二个 judge 与 50 例非盲人工核查，但没有“只移除偏移”的干预；262 个选定人工基线胜出的样本中，judge 仅将 54 例关联到保留的偏移。研究没有人类接管试验或第五次修改，不能证明普遍维护成本、更不能证明降低复杂度无用。**[研究：论文附录 D；解释边界]**

**构造源码限定了能说什么。** 固定仓库 [`158f6ab`](https://github.com/shaswatpatel123/CodeThread/tree/158f6abaadcf717f3175a8f402be7da4e8d48c76)的 [`data_gen_problems.py`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/dataset/scripts/data_gen_problems.py)把原函数交给模型，生成重建所需的说明，其中明确要求返回结构、异常、边界与操作步骤；人工分支保留原实现，未由人按同一说明重写。[公开数据卡](https://huggingface.co/datasets/shaswat123/CodeThread)列的是 1,377 个 stub／任务输入，不是 1,377 个成功配对运行。因此这是“重建保真度＋后续解题”的比较，P2P 通过不能证明未测输入上的行为等价；不可把全部后续差异归因于代码组织或接管难度。**[一手：固定源码、数据卡；研究：因果边界]**

本轮还只读 [`synthetic_chains.py`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/scripts/utils/synthetic_chains.py)的 P2P／F2P 分类与 [`run_swebench.sh`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/scripts/run_swebench.sh)的两阶段连接。没有运行这些脚本、安装环境或调用模型；在读取的固定仓库与数据卡中未取得论文逐例配对产物、judge 标签和原始测试日志，故没有重算效果或声称复现。源码能确认构造机制，不能补足原始运行证据。**[一手：检查范围]**

**对实际工作的改变。** 续改失败时，先沿新功能的调用链比对预期与继承实现：什么输入会被提前拒绝、缺值如何处理、错误返回还是抛出、调用者靠什么判断失败。该函数没有出现在本次 diff，也不能排除；把查明的一项行为变成最小回归，再决定修旧函数还是改新调用者。若当前需求有意改变旧行为，则更新契约与调用者，不能机械恢复历史实现。已有用例能表达时不额外写交接文档，也不为清理指标重写整片代码。**[经验：从证据提出的可撤回建议，未测净收益]**

这与前述 Pydantic 连续需求互补：那里有真实需求改变记录用途，这里提示继承产物可能早已悄悄改变行为。下一项有区分力的证据，应固定任务与预算，仅修复已识别的契约偏移后重测，或取得真实接管者的修改与投入；再加一份代码复杂度榜单不能回答该问题。

### 生成回归测试：先保留预期，再决定是否新增

**核实：2026-10-14 UTC；改变 22 §4。** 红绿结果要有独立的预期依据；测试的来源是 AI 或人工，均不能替代这一步。已有用例能区分目标缺陷时复用；新增断言失败后，先查需求与实现，不自动把预期改到当前代码能通过。**[经验：采用建议]**

**跨后续修改的新证据。** [On the Risks of using LLM-Generated Tests for Regression Testing v1](https://arxiv.org/html/2610.11835v1)（2026-10-08，§3–7）使用 Haiku 4.5，在 SciPy／Qiskit／pandas 的 50／50／45 个历史 PR 上注入人工变异。选择未完全覆盖、至多改五个代码文件的 PR，pandas 限 I/O；先去掉原生测试检出的变异，再保留模型能构造区分测试的变异。生成阶段可见 PR 前源码、变异后的源码、两者 diff 与执行上下文，不见未变异的 PR 后参考源码，至多六轮追求通过与覆盖。表 3 的分母是进入分类的变异—测试对（各 3,483／3,355／9,578），包括预算耗尽后保留的失败候选，不只是获接受的通过测试；其中 8.4%–16.9% 在错误版通过、参考版失败。表 4 再跟踪可向后传播的 587／279／1,614 对，后续重施同一变异时，82.8%–90.9% 仍维持该结果。**[研究：预印本受控变异与历史传播，非真实故障发生率]**

**原生测试足够的反例与分母。** 同文表 2 中，原生套件已检出各项目可执行变异的 58.6%／54.0%／16.0%，这部分未进入生成比较；不能用预筛后的漏检样本宣称原生测试普遍不足。传播中，后来原生测试检出故障也没有终止该断言的追踪，所以“错误断言仍存活”不等于“故障无人检出”。对已被可靠用例拦住的同一风险，不应为满足新增测试数量而再生成一份；额外生成和维护没有在这里证明增量价值，论文也未测人的净成本。**[研究：结果及采用边界]**

**已有工业机制的对照。** Meta 的 [TestGen-LLM 原论文 §2](https://arxiv.org/html/2402.09171v1)明确丢弃首次不通过的测试，五次重复排除不稳定，再过滤不增加覆盖的候选；它保留原测试并由工程师决定接收。该设计适合补充已认可行为的覆盖，不能把“当前通过”解释成业务预期正确，也不能据新论文把 Meta 的实际部署说成已经锁入同等比例的缺陷。覆盖未增加也不必然意味着测试无价值：同一路径可以有更强断言。**[一手：工业论文；研究：机制比较]**

**读取与未证实部分。** 已读两篇固定版本正文。新研究的 [Figshare 工件地址](https://figshare.com/s/bcdd07ff46760fd254ec)本次读取返回 403，未取得原始记录，不能独立复算；不是认定工件不存在。未执行上游或模型。变异不等于真实 bug，研究也未比较今天原生 Codex／Claude 的完整工作流；它足以支持核对预期来源，不能支持一律隐藏源码、强制测试先行或另加测试 Agent。继续采用的条件是新增测试补到明确行为缺口，若只重复已有检查则不保留。**[研究：局限与可撤回条件]**

### n8n：配置回退与独立导出入口

**核实：2026-10-14 UTC；主线三，兼四；改变 15 §5。** ✅ 回退设计应停止新格式写入，同时保留读取已落盘数据所需的依赖；用混合代次数据分别验服务和实际维护入口。现有 Git MIDX 案例覆盖版本降级，这里补同版本配置撤回及独立导出入口，不追加通用备份流程。**[研究：采用判断]**

**两步修订解决不同缺口。** [#37416](https://github.com/n8n-io/n8n/pull/37416)／[430bbe53](https://github.com/n8n-io/n8n/commit/430bbe53c3f784c20679c3a93b8da1feb52cab7e)先让模块和 provider 不再随轮换开关一起停用，但 cipher 自身仍检查开关。[#37603](https://github.com/n8n-io/n8n/pull/37603)／[9b10838d](https://github.com/n8n-io/n8n/commit/9b10838d9e1015d2198f3f48b9a6bc042239884a)才在 `packages/core/src/encryption/cipher.ts` 删除 `decryptV2` 的开关条件，按密文前缀查 key；`key-manager.service.ts` 的 `getActiveKey` 仍在关闭时返回旧格式 descriptor。读取已有新格式和继续写新格式因此分开。**[一手：固定补丁]**

#37603 作者报告在分支 `2f51d9d615` 经真实 REST API 与 SQLite 检查 on→off→on：开启时写入的数据在关闭后仍可读，关闭后的新写入恢复旧格式，混合数据可读且读取不改写存储值。但同一报告明确指出一次性导出命令不运行 module init，provider 未注册，仍无法读带 keyId 的数据，并误报密钥不同。原始可重跑 spec 未随报告公开，不能把服务端成功当作导出恢复成功。**[社区：作者运行与故障报告]**

随后 [#37972](https://github.com/n8n-io/n8n/pull/37972)／[93945cce](https://github.com/n8n-io/n8n/commit/93945cce5d97347d3dc3e1ac6249cd104ce5d708)在 `BaseCommand.init()` 数据库准备后调用 bootstrap，使服务、worker、webhook 和一次性命令较早获得 provider；原模块只保留管理 API 与前端设置。cipher 同时删除 provider 未注册时的隐式回退，改为明确失败。[afitzek 审批前一 PR](https://github.com/n8n-io/n8n/pull/37603#pullrequestreview-5100537985)后实际提交这次修复，再由 [sychovSaveliy 审批](https://github.com/n8n-io/n8n/pull/37972#pullrequestreview-5134188188)，是可见接管与修改，不是仅凭合并猜测。两个固定提交均有 Claude 共同署名；这只证明披露的参与，不证明具体代码归属或节省工时。**[一手：补丁、PR 元数据与审查]**

**测试实际覆盖什么。** #37603 的 core 单测覆盖两种格式、未知 key ID 和不合格旧格式 descriptor；[固定 integration 测试](https://github.com/n8n-io/n8n/blob/93945cce5d97347d3dc3e1ac6249cd104ce5d708/packages/cli/src/encryption/__tests__/encryption-bootstrap.service.integration.test.ts)分别检查开启／关闭时的真实 key store 与 cipher 往返，未在同一用例内做完整 on→off→on。后续 [bootstrap 单测](https://github.com/n8n-io/n8n/blob/93945cce5d97347d3dc3e1ac6249cd104ce5d708/packages/cli/src/encryption/__tests__/encryption-bootstrap.service.test.ts)验证禁止 seed 或非 main 时不创建部署级 key、仍注册读取 provider；`commands/__tests__/execute.test.ts` 把 bootstrap mock 为 no-op，不能算实际导出测试。**[一手：测试定义，未执行]**

**回退边界。** 轮换 active key、关闭新格式写入、降级旧程序是三件事：前者仍需保留旧 key 以读旧密文；关闭写入不批量还原已经落盘的数据；同版本回退成功也不保证旧程序兼容。[官方当前说明](https://github.com/n8n-io/n8n-docs/blob/main/docs/deploy/host-n8n/configure-n8n/security/rotate-encryption-keys.md)把安全停用发布边界列为 2.40.3，并保留降级和缺少自动逆向转换的警告。不可将该节点写成首次解除读取门控：[#38910 固定补丁](https://github.com/n8n-io/n8n/commit/a8e0e7c3844510321894bf661cc0610baeae8fc3)实际补的是第三种 legacy DEK 存储形态，而读取门控已在 #37603 解耦。**[一手；研究：边界比较]**

**验证与停止条件。** 本轮只读固定前后补丁、测试定义、作者运行报告与接管链；未运行 n8n、数据库、模型或上游测试，导出路径测试未独立运行，也没有最终 CLI 成功重试的独立用户回执或人工投入记录。建议适用于会留下新持久格式或存在独立维护入口的修改；机械迁移没有这些风险时不套用，已有可靠用例覆盖时不再扩充框架。**[研究：局限与采用范围]**

### Grafana：回退的恢复时间点与保护性拒绝

**核实：2026-10-14 UTC；主线三／四；改变 15 §5。** ✅ 对已迁移持久数据的回退，除旧程序能否读取，还要查恢复时间点和升级期间新增／修改的处理方式；在隔离数据上验证恢复方案，由负责人明确接受损失后才有条件使用强制回退。不能仅为恢复启动删保护或清表。本例补业务状态的恢复目标，不重复 MIDX 的格式兼容或 n8n 的读写开关。**[研究：采用判断]**

**原失败不等于检测到了新增数据。** [Grafana #50421](https://github.com/grafana/grafana/issues/50421)原报告者从 8.5.5 升到 9.0.0-beta3，因 polystat 面板插件不兼容降回 8.5.5，随后启动 panic；他明确说没有新建警报。[维护者说明](https://github.com/grafana/grafana/issues/50421#issuecomment-1152151626)将阻断解释为避免用户不知情地删除新警报系统数据。[PR #50470](https://github.com/grafana/grafana/pull/50470)已合并，固定修订 [30f035ca](https://github.com/grafana/grafana/commit/30f035ca347d9f6ba02bc48c0e1f183c885227c5)只澄清 panic 信息，没有实现无损反向迁移，也没有移除保护。**[社区：原报告与维护者解释；一手：固定补丁]**

**历史发布版的删除契约。** v9.0.0 对应固定 SHA [`b5c56f63`](https://github.com/grafana/grafana/commit/b5c56f63710e09f37b8557ddd8b99ae3fc583169)。其 [ualert.go L52–96](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/ualert.go#L52-L96)按迁移日志和启用状态选择回退，缺少 `ForceMigration` 时阻止；开启后安排删除迁移，并清掉原迁移标记，供将来再迁移。因此阻断不证明实际存在升级后的新增警报；新旧警报都关闭时还有直接返回的分支。[删除实现 L517–570](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/ualert.go#L517-L570)涉及新警报规则、规则版本、配置、实例及 silence 文件，不是单纯换回旧二进制。[同版回退文档](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/docs/sources/alerting/migrating-alerts/roll-back.md)明确恢复的是升级时的警报状态，新系统中新增警报及修改会被删除。**[一手：固定发布源码与文档]**

**启动恢复与业务恢复是两个结果。** [另一用户的后续报告](https://github.com/grafana/grafana/issues/50421#issuecomment-1150915431)称按讨论中的清表办法恢复启动，但已没有警报。这不是无损恢复，也不是推荐手工删表；它支持先约定损失范围，再检查业务结果，而非只用进程、健康检查或 issue 关闭验收。该回执不是原报告者的修订版复测。**[社区：用户运行报告；研究：采用边界]**

**测试名不是有效断言的证明。** [同版 migration_test.go L24–115](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/migration_test.go#L24-L115)包含名为“force migration is disabled…should panic”的表项，但未设置 `shouldPanic: true`；defer 吞掉 panic，只在该字段为真且没有 panic 时报告失败。对应表项又将删除迁移列为 expected，故不能把用例名称当作“移除拒绝也会被检出”的证据。本轮仅作静态核对，未做变异或上游执行。**[一手：测试定义；研究：断言范围]**

**反证、归属与验证范围。** 不推断所有降级都会丢数据，不将这项历史错误解释修订说成当前 Grafana 的操作指南；支持的是针对具体迁移契约选择恢复目标。GitHub compare 显示 PR merge SHA 与 v9.0.0 为 diverged（ahead_by=261、behind_by=367），不可宣称该 merge commit 为发布版祖先；发布版包含澄清信息是直接读上述固定源码确认的。未取得本例的 AI 参与证据，未安装或运行 Grafana、模型及上游测试，未核验 CI，也没有原报告者的最终无损回退回执或维护收益测量。**[一手：提交关系与源码；研究：边界]**

### 能推翻或改变这个优先级的证据

若实际任务已经有清楚知识、可用环境和及时反馈，仍主要受复杂推理限制，就应提高模型/effort 对照优先级。若环境接口维护比人工复现更贵，或只有一次性任务，就不推荐专门改造。若更强模型直接解决了旧框架试图处理的失败，应删除多余流程。若新增状态接口让测试通过却绕过真实故障，应降低它在验收中的权重。

正式案例至少要区分：新增知识、增加工具访问、改变反馈表示、改变工作顺序、换模型。多项同时变化可以作为完整方案案例，但不能把全部改善归给其中一个 Skill。没有耗时、返工与后续记录时，给机制判断，不报收益百分比。

## 来源与阅读范围

- **S1 [一手]**：OpenAI Skills 固定 `49f948faa9258a0c61caceaf225e179651397431`，[interactive](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/playwright-interactive/SKILL.md) 的前提、会话、功能/视觉 QA、viewport 与重启段落；[CLI](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/playwright/SKILL.md) 的前提、核心流程与快照更新段落。只读研究，未采用为本会话指令。
- **S2 [一手]**：[Code modernization](https://github.com/openai/openai-cookbook/blob/5bd6cb40b6b84b69b2032d810610aa85064102df/examples/codex/code_modernization.md)，读引言至第 4.2 阶段。没有运行教程、验证其业务系统或据此确认当前采用率。
- **[经验/研究]**：本仓库 Catalog Compare 与验收链检查见正文链接；游戏、地址保存示例是本文分析设计，不是性能实测。当前来源仍偏官方与公开 GitHub，社区原始运行轨迹是下一步证据缺口。

## 写入路径扩展与序列化判等：sqlite-chronicle

核实：2026-10-14 UTC。**✅ 给 Agent 扩展写入路径时，把业务行与派生版本／审计状态一起验；为支持新类型而改变判等编码，还须验证旧类型中需要区分的值。** 本节改变 15 §6 的窄建议，不新增工具或默认评审阶段。**[经验：采用判断]**

### 一手修订链与归属

[Issue #20](https://github.com/simonw/sqlite-chronicle/issues/20)由维护者 Simon Willison 报告：把代码和此前讨论交给 Opus 4.6、Gemini 3 Deep Think、GPT-5.2 探索，其中前两者给出候选方案，GPT-5.2 耗尽上下文。这是作者报告，不能比较模型总体能力。[PR #21](https://github.com/simonw/sqlite-chronicle/pull/21)公开了要求先确认失败、采用候选方案、做 red/green 与生成演示的任务文字、Claude Code 会话链接和 claude 提交；本轮只读公开 PR 与代码，没有读取会话全文或运行模型。维护者称已人工审阅，随后合并并发布 0.5；这不证明所有输入已正确。**[社区：作者报告；一手：公开任务与提交]**

- 原版 [25370bdd](https://github.com/simonw/sqlite-chronicle/blob/25370bdd9ce4d5c3be93d5035e86b44bd9346476/sqlite_chronicle.py)在 AFTER INSERT 中用 `INSERT OR IGNORE` 写 chronicle；外层 `INSERT OR REPLACE` 的冲突策略会传播进触发器，重建跟踪行并重置 added 时间。`recursive_triggers=ON` 还让隐式 DELETE 触发额外版本增长。SQLite [CREATE TRIGGER 官方契约](https://sqlite.org/lang_createtrigger.html)明确外层语句的冲突处理优先于触发器内部策略。**[一手]**
- [3510fd21](https://github.com/simonw/sqlite-chronicle/commit/3510fd21b57bf5a06eb16bf5830d44919fc3fe11)改为 BEFORE INSERT 保存旧值快照、INSERT 时判等并清理、用 `WHERE NOT EXISTS` 避免冲突策略传播，并为隐式 DELETE 加 guard。后续 [60f09b98](https://github.com/simonw/sqlite-chronicle/blob/60f09b9833f4bbc44ea52cd89cf9c4e5329a804e/README.md)已有对应生成 SQL，但 `json_array` 直接接收 BLOB 会失败。**[一手：固定补丁与生成 SQL]**
- [9cd5293f](https://github.com/simonw/sqlite-chronicle/commit/9cd5293f5e89825a8824c1f258231e0592d8579f)改用 `json_array(quote(...))`，新增 BLOB、NULL、混合类型回归。这个改动确实消除本轮 BLOB 失败，但 `quote(TEXT)` 在首个 NUL 截断；不同尾部因此可能得到相同快照。截断是 [SQLite 文档规定](https://sqlite.org/lang_corefunc.html#quote)，不是本仓猜测。**[一手；研究：判等推论]**
- 核查时 main 固定为 [ee8d2a1d](https://github.com/simonw/sqlite-chronicle/blob/ee8d2a1db5090d14279f0acb56b5d46a5c50e44c/sqlite_chronicle.py)。快照表已改成共享表，仍保留这条 quote 判等路径；本轮也运行了此 SHA 的 [README 生成 SQL](https://github.com/simonw/sqlite-chronicle/blob/ee8d2a1db5090d14279f0acb56b5d46a5c50e44c/README.md)，没有把二月补丁直接当作十月现状。**[一手；经验：固定 SQL 执行]**

### 零依赖复核与反例

运行 `python3 experiments/sqlite-chronicle-replace-check.py`。完整[离线脚本](../../experiments/sqlite-chronicle-replace-check.py)、[原始输出](../../experiments/sqlite-chronicle-replace-results.txt)与[上游许可](../../experiments/sqlite-chronicle-LICENSE.txt)随仓保存。SQL fixture 是四个固定 README 的完整 dogs schema，未替换触发器或重写算法；脚本不导入／执行上游 Python，不联网、不安装，数据库均为 `:memory:`。Python 3.12.14 / SQLite 3.53.1，四版 × 两个 recursive_triggers 设置 × 文本、BLOB、NUL 文本、NULL 四种输入，共 32 个场景。脚本退出 0 表示**复现了预期现象，包括已知失败**，不是库质量通过。**[经验：本轮实际运行]**

每场景先插入一行，再将其改为目标值、重复写目标值。观察真实业务数据、版本、删除标记、added 保留与快照清理；added 用 123 作确定性测试标记，未改原触发器。结果如下：

| 固定 SQL | 普通文本改动→重复 | BLOB 改动→重复 | NUL 文本改动→重复 | NULL→NULL |
|---|---|---|---|---|
| 原版 25370bdd | 版本 2→3（recursive=1 时 3→5） | 同左 | 同左 | 同左；错误增长 |
| 首轮方案后 60f09b98 | 2→2 | 首次 REPLACE 抛 `JSON cannot hold BLOB values`；旧行与版本仍保留 | 2→2 | 1→1 |
| BLOB 修订 9cd5293f | 2→2 | 2→2 | **1→1，漏报真实变化** | 1→1 |
| 当前固定 ee8d2a1d | 2→2 | 2→2 | **1→1，漏报真实变化** | 1→1 |

后三版上述结果在 recursive_triggers=0/1 一致；原版重置 added，其余保留。NUL 反例为参数绑定的 `a\0x`→`a\0y`：业务值确实变为后者，字节 hex 从 `610078` 变成 `610079`，但最后两版的 `__version` 仍为 1，按 `__version > 1` 查询为空。随后经普通 UPDATE 改成 `a\0z`，版本增为 2；这是同一输入域的写入路径对照。**[经验：完整固定 schema 的执行结果]**

**输入域与结论边界。** [SQLite 允许 TEXT 包含 NUL](https://sqlite.org/nulinstr.html)，但提醒部分显示和文本函数会截断。项目 README 承诺追踪行更新、相同数据不增长版本，并明示不支持主键更新；本轮未见其排除 NUL 非主键文本，所读实现也未拒绝该值。不过没有真实用户在生产中触发此问题的报告，不能把罕见输入的局部漏报外推为全部同步不可用。若业务明确禁止 NUL，应验证入口拒绝，而非默认判等编码无损；若允许，就需保住区分这些值的语义。**[一手：输入与项目契约；经验：采用边界]**

本轮未运行包 CLI、安装／升级过程、上游测试套件、并发、多表或复合键；固定生成 SQL 与所读实现路径相符，但不等于整库端到端验证。没有提交外部 issue 或补丁，也没有评价模型成功率／工时收益。新增价值是把“补类型测试”具体化为**新编码能接受值，与它能分辨业务上不同的值，是两个验收条件**。**[研究：范围与采用判断]**


### SWE-Game：游戏移植的 Visual 分不等于体验质量

**核实：2026-10-15（UTC+8）；主线二／四；改变 22 的评分使用建议。** ✅ 借鉴按证据条件拆分游戏验收；👀 整套基准先作为条件评估对象，不凭总分选游戏 Agent 或宣布移植交付。当前 game02／WP10 已区分状态、输入、连续视听与玩家体验，本轮不重复扩建接口；新增价值是识别同名评分项、版本和演示完成的具体边界。**[研究：采用判断]**

**固定来源。** 阅读 [论文 v3 正文及附录](https://arxiv.org/html/2609.33678v3)，由[作者提交的论文页](https://huggingface.co/papers/2609.33678)核到官方公开仓库；源码固定 `Charly-chan/SWE-Game@157a42b1a8a771a51da41e3df5e29045e246cc6c`。下载源码归档只读检查，未运行上游测试、模型、引擎或下载完整游戏数据。项目自有代码为 Apache-2.0，游戏／资产沿各自许可，不能以根许可证替代素材清权。[版本与数据声明](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/docs/releasing.md)。**[一手；研究：验证边界]**

**先分开论文和发行配置。** 论文 v3 为 247 任务／83 修复；公开清单为 246／82，固定数据 revision 为 `651906f7d922474b8e4754bacd6f7fba38cc0397`。发行默认关闭 Brief Design 和构建类视觉裁判；缺少必要视觉证据时完整合成分留空。README 的结果修订说明指向论文 v1，而 v3 Table 3 仍列 Design 及不同 Brief 总分。因此引用必须写清论文版本／结果集，不能任选一个总数与另一版评分公式拼接；公开记录也明确论文结果不是发行默认设置的新测量。**[一手：上述版本文件、论文 Table 3 与附录 D；研究：比较]**

**独立源码核查反证：Visual 的名字不能替代测量定义。** 当前移植 registry `2026-10.mode5-evidence-five-visual1` 不调用 VLM；[评分契约](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/docs/reference/MODE5_SCORING.md)明确为实现对应关系。运行／Editor／静态支持／文件存在的系数为 1／0.8／0.6／0.25；没有运行证据时仍可得到部分分，最终目标则只接受独立运行证据。保留部分工程成果有价值，但不是严格完成率。**[一手：实现契约；研究：解释]**

- [visual_measure.py L67–112、198–243](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/mode5/visual_measure.py#L67-L112)使用英文 OCR 与 score／points、health／hp、progress 等数值标签，核显示值与状态及无输入前后变化；不是所有文字、图标式血条或本地化 UI 的可读性度量
- [L215–221、244–269](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/mode5/visual_measure.py#L215-L269)把非静音且变化的 PCM 作为音频证据，动画按局部外观变化与原生状态佐证，布局按语义角色相对顺序；这些判据没有测警告是否听清、动画是否自然或整体风格是否一致
- [unity_visual_probe.cs L144–204](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/unity/unity_visual_probe.cs#L144-L204)在探针冻结时间时，依次移除／恢复渲染器与 UI 采图；[漂移检查 L48–64](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/mode5/visual_measure.py#L48-L64)拒绝恢复后变化过大的画面。这适合确认像素贡献，不能证明运动顺滑；未见依据可把它描述成关闭 TAA 的实现

以上是逐行只读核查与测量范围推论，不是复现误判率，也未证明论文历史成绩由当前实现产生。**[一手＋研究]**

**负对照能补什么，也会漏什么。** 移植模式重放 witness、匹配无输入和隐藏场景，见[移植运行协议](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/docs/reference/MODE5_RELEASE_PROTOCOL.md)。另一个可借鉴、但不属于移植模式的机制是 Godot 三类构建任务的分段功能演示：[任务协议](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/docs/tasks.md#feature-demonstrations)逐片段冷启动，重放输入、等时长无输入与带评测标志的输入；分段功能并集不能靠重复演示加分，严格完成单列，未要求所有功能挤进一条整局录像。针对应由动作引起的奖励／推进，这比只看胜利画面多一条可反驳证据；合法被动计时则须由任务声明 `requires_player_action: false` 与原因，不可统一判为作弊。[声明校验 L128–141](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/content/rubrics.py#L128-L141)、[负对照测试定义 L86–102](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/tests/test_feature_demonstrations.py#L86-L102)。**[一手；研究：借用条件]**

公开任务仅把 visible 材料交给 Agent，hidden 和裁判留在评估侧；这是访问隔离契约，不能证明训练污染不存在。[Godot 防绕过模块的 LIMITS](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/antigrant.py#L41-L61)直接列出计算标志名的静态扫描盲区，以及 idle／mash 动态探测的 1100 帧预算限制；不能反过来声称完整动态评估一定被这些方式攻破。固定时长无输入只反驳相同窗口内的被动成功，不足以证明所有输入都正确或没有评测特判。**[一手；研究：威胁范围]**

**论文支持到哪里。** 41 个参考游戏为 24 个 2D、17 个 3D；功能校准抽样为构建模式的 100 游戏／1200 条断言，不覆盖所有修复／移植判据；200 个片段的 VLM 视觉得分相关性，不是本发行版移植 Visual 的校准或长期乐趣验证。模型与各自框架一起评，不能单独归因模型。参考路线保留时间，适合检查注册目标，但不同运动调参下路线失败不能单凭总分区分机制缺失与时序不匹配；应回读局部状态和候选演示。本轮未找到独立运行复现，保留作者结果的证据等级。**[一手：论文 §3.4、§4.1、§4.5、Limitations；研究：推广边界]**

**采用与停止。** 比较移植方案时，同版本、同任务、同裁判与预算保存严格运行结果和组件证据；若要决定画质／手感是否达到目标，补目标设备上的连续动作和视听对照，不用换一个分数名字代替。现有验收已覆盖这些事实就不接整套 benchmark。当前只有论文与源码调查、仓库离线检查；实际收益须留到获准实验。**[研究：采用建议]**

## 重复代码迁移：语法规则、类型分析与第二次执行

**主线二／三；改变 15 §4–5。** 核实时间：2026-10-15（UTC+8）。✅ 同一规则覆盖多处、已有适用迁移器时，先复用；少量异质调用或业务语义需逐项决定时，直接让 Agent 补丁并验证。前者的收益是复用明确的匹配与变换规则，不能由此推出当前强 Agent 的净收益。以下来自三个不同项目的历史迁移、维护回复与固定源码，没有安装或运行它们。**[研究：采用判断；一手／社区：下述证据]**

### 语法匹配能省重复劳动，但不等于完成迁移

- **正面使用与遗漏同时存在。** TanStack Query [#6204](https://github.com/TanStack/query/issues/6204) 的 gillkyle 报告，v5.0.0 codemod 成功处理多处 `invalidateQueries`／`refetchQueries`，且[明确说节省了时间](https://github.com/TanStack/query/issues/6204#issuecomment-1772989068)；但其最小复现输出 `0 errors / 1 unmodified / 0 ok`，仍留下自定义 hook 的两种旧调用。约 30 分钟是作者整次升级自报，不是 codemod 对照耗时。**[社区：真实迁移单例]**
- **第二次核验没有把“已修”视为全部通过。** slax57 在 [5.13.4 复测](https://github.com/TanStack/query/issues/6204#issuecomment-1857715221)中确认 `useQuery` 已处理，指出 `useMutation` 仍遗漏；维护者要求另建 [#6548](https://github.com/TanStack/query/issues/6548)，报告版本为 5.14.0。随后该报告者提交 [#7187](https://github.com/TanStack/query/pull/7187)，维护者批准，2024-04-02 合入 [`798124d`](https://github.com/TanStack/query/commit/798124da1c3e21c8e95b037466905489e19cd029)。补丁将 `useMutation` 纳入匹配并增加带／不带 options 的输入输出夹具。这里只确认固定补丁与维护接收，不把旧版本遗漏当当前缺陷。**[社区：他人复测；一手：修订／夹具]**
- **解析 TS 语法不是建立完整类型程序。** 本轮固定 [`a8af0e2`](https://github.com/TanStack/query/tree/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads)：[utils](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/utils/index.cjs)沿 AST scope 找变量声明并看是否为数组表达式；[default-import 输出夹具](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/__testfixtures__/default-import.output.tsx)明确保留从另一模块导入的 query key 调用。[测试入口](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/__tests__/remove-overloads.test.cjs)用 `tsx` parser 比较两个输入输出 fixture，不能据此声称跨文件类型推断、全量语义或二次运行已验证。**[一手：源码／测试，只读]**

因此先看目标调用形式是否在迁移器覆盖中，并检查未修改和警告项；退出成功、能解析 `.tsx`、某个相关 issue 关闭，都不是迁移完成的充分条件。混合新旧调用时，分别验证该改、应保留和无法判定的调用。**[经验：采用建议]**

### 类型与框架分析值得增加的具体条件

Angular signal input 的迁移不只是给名字加 `()`，还会改模板、host binding 与 TS 引用。[官方说明](https://angular.dev/reference/migrations/signal-inputs)默认跳过不安全的 input；`--best-effort-mode` 可造成构建破坏，`--analysis-dir` 会静默漏过目录外引用，而 `--path` 限定修改范围不等于限定分析范围。**[一手：文档，2026-10-15 核实]**

固定 [`731ad651`](https://github.com/angular/angular/tree/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration)的 [incompatibility 枚举](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration/src/passes/problematic_patterns/incompatibility.ts)区分继承冲突、写入、accessor、模板 narrowing 等；[golden 输出](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration/test/golden.txt)既有提取局部变量后保持 narrowing 的变换，也有写入或不支持模式的跳过及原因。能在语法之外核对这些约束，是复用框架迁移器的具体理由；保守跳过也是有效结果，不应为提高改动文件数直接强制转换。**[一手：固定源码／期望夹具，未执行]**

**选择边界。** 只涉及已确认来源的统一调用形状，现成语法规则已覆盖时，不必另装完整语义平台；变换取决于导入对象、跨文件引用、继承或类型缩窄时，优先使用能解析本项目的类型／框架迁移器。剩余少量例外交 Agent 逐项读契约、改代码并测试；若大部分都需例外决策，停止扩写通用规则，改为直接补丁。没有证据支持一个通用文件数阈值，也没有本轮同任务 Agent 对照。**[研究／经验：条件判断]**

### 重复执行与第二次需求不是同一项保证

**同一次批处理也可能重复修改同一文件。** Angular 用户 Wandang 的 [#61611](https://github.com/angular/angular/issues/61611)（Angular 19.2.12）报告模板出现 `title()()` 与重复 TODO。维护者[指向已修复的 #61421](https://github.com/angular/angular/issues/61611#issuecomment-2901248608)，其根因是多个 tsconfig 的源文件重叠。固定 [run_in_devkit.ts](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/utils/tsurge/helpers/angular_devkit/run_in_devkit.ts)用文件到编译单元的归属表，避免同一源文件在不同单元重复分析／生成替换；这不是证明所有变换均幂等。维护者通过 [#61612](https://github.com/angular/angular/pull/61612)回移到 19.2.x（落地提交 [`2ae69f7`](https://github.com/angular/angular/commit/2ae69f77e7ef9a6431303cfad54cabb068435d6f)）；本轮只读核对 19.2.13 与 20.0.0 标签的同路径均已包含归属去重，未独立运行或取得该用户修复版复测。**[社区：故障报告；一手：维护回复与源码]**

**调用方的次数也需核对。** Renovate [#8220](https://github.com/renovatebot/renovate/issues/8220) 的 marcodejongh 报告：依赖升级从一次调用变为逐依赖调用后，同仓五处依赖使 codemod 执行五次，部分非幂等变换破坏代码。后续 [#8725](https://github.com/renovatebot/renovate/pull/8725)增加 `executionMode: branch`，历史固定 [`6afbcf8`](https://github.com/renovatebot/renovate/commit/6afbcf8d18afd3e63e0d4d253be64c5a21e736c5)的 [index.spec.ts](https://github.com/renovatebot/renovate/blob/6afbcf8d18afd3e63e0d4d253be64c5a21e736c5/lib/workers/branch/index.spec.ts)在两项升级配置下断言命令只调用一次；作者勾选单元测试及真实仓库验证，发布回复标为 24.109.0。该测试约束调度次数，不检验具体 codemod 输出；`branch` 也不承诺后续重新生成分支时永不再执行。**[社区：使用与作者验证报告；一手：补丁／断言，只读]**

**最小验收与停止条件。** 在已有试点里保留旧形状、已迁移形状、跨文件或业务例外；核对受影响调用和跳过原因，再运行相关类型／行为检查。准备重试或复用脚本时，用第一次产物再执行同一变换，确认预期不再变化；若工具明示一次性，则固定起点并从可恢复副本重做，不能盲重跑。并行分片不能重复拥有同一文件。重跑出现额外变换、覆盖范围不清或例外变多时暂停扩量，修正规则／调度或退回局部补丁。**[经验：建议，未运行本轮迁移实验]**

幂等只回答“相同输入状态再跑会不会继续变”；第二次需求若改变映射或接口契约，须更新规则、回归和适用版本，并从上一轮实际交付状态验证新需求及仍有效的旧行为。不能拿重跑零 diff 代替行为正确，也不能把只读夹具检查写成当前模型收益或持续维护成本下降。**[研究：结论边界]**
