主线：二，兼三／四
改变的建议：按事实、反馈、访问或决策缺口补最小条件；续改分验有意改变与必须保留的行为，迁移核持久状态、消费者和真实运行入口。依赖解析先限定包来源；工具采用按任务、输入与失败边界收窄；测试先定保护或查错目标，再核实际观测与断言。数据库默认值另分写列保护与值来源，不凭新进程通过推定旧缓存安全。[研究／经验]
新证据：2026-10-20 P25部分资料移入反馈册，原完整验收保留；本页P26两轮设计与P27提议均不计真实应用验证；2026-10-18（UTC+8）补核重复 Hook 分阶段撤回与替代激活链及 GitLab 默认值保护实现与预热旧缓存的固定测试定义，未执行上游。既有案例、核实日期、证据类型及各自运行／未验证范围见下列索引与对应小节；源码、历史回执和本仓局部运行分别计证据，不证明当前模型或 Skill 净收益。[一手／社区／研究／经验]

**项目入口**：[P25代填到并行审批](#p25代填角色到并行审批组)、[P26个人标注到共同维护](#p26单人标注扩成多人协作)、[P27发送中改稿与恢复](#p27发送中改稿与在途恢复)；P25部分资料与P26两轮设计已交，P27保提议，完整验收见各节。

**按问题阅读**：本页保留运行环境、权限与长程执行；[反馈与验证](2026-10-12-development-feedback.md)集中浏览器、测试和观测；[维护与迁移](2026-10-12-development-maintenance.md)集中第二次修改、兼容与退出条件。原章节标题保留为深链入口，事实核实日期与证据等级不因拆分更新。

- **本仓局部运行**：[Hook 五类合成输入](#hook-跨宿主迁移匹配成功不等于协议适配)（未执行补丁）、[标准库公式](#本轮零成本公式对照)、[路径逻辑模型](#外部生产者校准错误预期)、[32 场景固定 SQL](#写入路径扩展与序列化判等sqlite-chronicle)。各自只验证所列机制
- **现场观察与操作记录**：[公开网页不同读取路径](#dot-实际能力诊断公开网页读取的路径差异)分别记录抓取 403、Chrome 原帖读取／刷新、GET 200／已知 ID；[发布路径](#发布一般建议与本仓观察分开)另记本仓已完成操作。现场观察不当作独立复测或效率收益
- **历史运行、维护与反例**：[React 定向日志](#react生产构建故障中的定向日志)、[Pydantic AI 连续演化](#pydantic-ai取消契约改变不代表正常完成也应改变)等案例分别标明作者自报、历史 CI、固定补丁及尚未闭环的恢复／交付；合入代码不补作用户成功回执
- **只读契约、源码与论文**：[bare](#交互试点转脚本bare-不是等价加速)、[sandbox](#claude-code-沙箱开启不等于所有边界已闭合)、[拒绝／fallback](#拒绝诊断先区分权限模型与服务故障)、[截图稳定化](#截图稳定化结束动画不是保留当前状态)、[SWE-Game](#swe-game游戏移植的-visual-分不等于体验质量)等按版本与测量定义解释；[冲刺案例](#四游戏开发用来检验这个方向而不是扩张引擎百科)仍是未运行引擎的分析设计

关键边界：普通 headless、bare、trust 与 sandbox 不等价；strict 不排除已配置的沙箱外命令，socket 过滤和可选 mask 的目标／失败默认值须单独核对；原生能力已够就不叠加。历史 CI、作者自报、源码与局部探测分别计证据，游戏例子仍是设计。[一手／研究]

# 方向研究：改善 AI Coding，要研究模型之外的哪些条件

> 核实：2026-10-12；2026-10-13（UTC+8）补核 §五 Discourse 后续演化案例、§二 React 定向日志及属性测试案例，2026-10-14 UTC 补核 §五 Pydantic AI 演化链，2026-10-15（UTC+8）补核 §二 Service Worker 响应来源，同日补末节重复代码迁移的三项目维护链与固定源码，2026-10-16（UTC+8）补核 §二截图稳定化与动画状态，其他外部事实未重核。评级：🧪 按实际瓶颈试用最小改进，不默认改造整个项目。范围：已有仓库材料、官方 Skills 的指定段落、官方 Codex 迁移教程与本仓库审计。属于有依据的方向判断，不是新模型效果实验。

## 核心判断

**研究人使用 Agent 完成和演化软件的全过程**：按真实障碍选择领域知识、环境、反馈、接口或试用，不因工程实践一般有用就扩成百科。**[经验：研究取舍]**

优先调查业务事实与运行反馈缺口；信息、工具已足够仍选错步骤时，比较模型、effort 或流程约束。模型也影响提问与取证，须沿具体失败判断。**[经验：研究假设，非失败频率统计]**

更强模型可能补足残缺信息，部分任务也无需启动系统；未记录的生产调度或用户偏好则须外部取证，没有统一最优配置。

## 一、为什么这条方向比继续加工作流更值得优先投入

已有调查给出了三个不同层面的证据：

1. Catalog Compare 的公开验收与独立 Decimal 检查能区分数字正确性，但历史浏览器回执的 HTML hash 不同，不能证明当前界面可用。这里缺的是对应版本的运行反馈，不是更多审阅角色。[本仓库复核](2026-10-10-catalog-compare.md)。**[经验：实际检查]**
2. 本仓库固定 grader 接受“实现正确但候选自身测试失败”的合成例子；记录校验器接受不存在的 evidence ref。都符合其有限契约，却不能证明工作流整体成功。[验收链审计](../collaboration/reviews/2026-10-11-000d14c.md)。**[经验：实际探测]**
3. 官方 Codex 迁移教程明确需要工程师确认哪些作业实际在生产运行、SLA 和业务上下文；这些不一定能从代码得到。它把同输入下旧系统与新系统的行为比较作为迁移验证，而非只看新代码的测试数。**[一手：S2，教程设计，非独立效果实测]**

三类证据不合并为成功率；案例须记录 Agent 当时可得的事实、访问和反馈，才能判断新增能力的作用。

## 二、运行环境是开发能力的一部分，不只是安装步骤

沿实际场景核对运行构建、请求数据、错误与代码的关联、重启／缓存归属和初始状态恢复。服务启动只是前提。**[经验：采用判断]**

假设“保存后刷新丢数据”：截图见症状，网络区分未发送／被拒绝，重启读取才涉及持久化。优先补测试账号、隔离数据、日志和启动命令，避免只凭组件源码反复改 CSS／状态管理。此为分析设计，未运行。

需要比较的替代方案：

| 观察到的阻碍 | 优先调查/尝试 | 不应直接跳到 |
|---|---|---|
| 看不到错误发生在哪层 | 当前版本的一次请求、相关日志和状态变化 | 换模型后再重复相同盲猜 |
| 每次都花很久恢复登录和数据 | 复用已有测试夹具、可复位数据和明确会话模式 | 一套新的多 Agent 调度框架 |
| 改了代码但结果没变 | 构建、进程、热加载/重启与缓存归属 | 增加推理强度或连续改其他文件 |
| 错误只在用户路径出现 | 通过真实输入走关键路径，内部接口用于定位 | 直接改内部状态后截图作为完成证据 |
| 系统已经可运行、信息充分仍反复做错 | 检查推理、任务分解、工具描述与流程干预 | 继续无目的扩充环境和日志 |

这些是可重叠的诊断优先级；新增接口仍有维护、权限与失真成本。

### 交互试点转脚本：bare 不是等价加速

**核实：2026-10-14 UTC；改变 15 §5 与 Claude 专题的 `--bare` 建议。** ✅ 已审查的可信项目中，批量迁移若依赖项目知识，保留普通模式，或为 bare 显式补充必要信息、约束与工具；只对给定材料做机械处理时可用 bare，无须复制全部常驻指令。**[经验：采用判断]**

[当前官方 headless 文档](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode)区分普通 `claude -p` 与 `--bare`：前者加载交互会话同类上下文，后者跳过 `CLAUDE.md`、自动发现的 Skill、Hook 和插件等；必要输入可用 `--append-system-prompt-file` 提供。`--add-dir` 内的 `.claude/skills/` 是部分例外，但 bare 不发送可用 Skill 列表提醒，文件存在不代表已发现或使用。**[一手：官方契约]**

[2.1.286 固定发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.286)确认 bare 只连接命令行指定的 MCP，不发送系统提醒、不启动后台任务，shell 超时后停止；当前文档还明确不提醒已读文件的磁盘变化。这只证明该版本的行为，未确定 bare 或跳过指令的首次版本。**[一手：发布说明与当前文档]**

**外来仓库须另查启动边界。** 2026-10-14 补核[权限矩阵](https://code.claude.com/docs/en/permissions#what-runs-before-you-trust-a-folder)：普通 `-p` 不显示工作区信任或逐服务器批准提示，未信任目录的 settings Hook 与 `.mcp.json` 仍会运行或连接；暂缓项目 `permissions.allow` 并发警告，不会阻止这些启动动作。[Hooks 文档](https://code.claude.com/docs/en/hooks#security-considerations)说明命令 Hook 使用用户完整权限：交互会话等待信任，`-p` 则把 settings Hook 所在目录视为已信任。因此须先限制配置来源，不能只声明“只读”或等待提示。**[一手：官方契约；经验：采用判断]**

**bare 仍应用部分项目设置。** 官方权限矩阵列出项目 `env`、`awsAuthRefresh` 等仍会生效，`apiKeyHelper` 只读显式 `--settings`。`--setting-sources user` 排除项目 settings 与 `.mcp.json`，不保证关闭全部 Skill 或指令发现；不需要这些能力时才用 bare，并仅提供审过的配置、插件与工具。只禁 Hook 可显式传 `--settings '{"disableAllHooks": true}'`，仅写用户 settings 会被项目优先级覆盖。这些配置不能替代操作系统沙箱或保证外来代码隔离。**[一手：机制；经验：边界，未运行客户端]**

[How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude)记载 2025 年中至 2026-01 收到三类信任提示前执行漏洞，修复是接受提示后才解析或执行项目配置；10 的 2026-05 是披露月份，非发生或修复月份。原文未给精确修复版本，交互信任闸门也不能外推到当前 `-p`。2.1.286 仅证明上述 bare 行为，不能确定普通 `-p` 从哪个版本开始跳过信任提示。**[一手：厂商历史自述与当前文档；检查边界]**

同一文档说明 bare 不读取订阅 OAuth 或系统钥匙串；Anthropic API 使用已有 API key／`apiKeyHelper`，外部提供商保留各自认证。切换前须核实执行与计费方式已获准且可用；这不授权新凭据或付费，也不要求外部提供商更换认证。**[一手：官方文档；经验：采用前提]**

依赖后台长构建时，bare 不等价。普通 `-p` 不代表 bare，“未来可能成为默认”也不是当前默认已变。本轮仅核文档与版本，未安装或执行客户端、未测开销和正确率；[历史实验](2026-10-12-experiment-records.md)中的 bare 认证失败，不能作为成功运行证据。**[经验：采用边界；一手：检查范围]**

### Claude Code 沙箱：开启不等于所有边界已闭合

核实：2026-10-15（UTC+8，读取于 10-14 UTC）。改变 [10 §3.2](../10-security.md#32-claude-code-沙箱操作手册)：保留最小隔离配置，撤回“strict + failIfUnavailable 足以证明封闭运行”和“mask 总能透明认证”的简写；不建议为跑通依赖开放解释器、全部 socket 或真实凭证。**[经验：采用判断]**

[官方 strict 说明](https://code.claude.com/docs/en/sandboxing#turn-off-the-retry-with-strict-sandbox-mode)指出 `allowUnsandboxedCommands: false` 只关闭逃生重试，`excludedCommands` 仍可在沙箱外运行。v2.1.285 前用户级 false 可能被项目 true 覆盖；当前不会，但也不自动触发 admin-required。托管或显式 `--settings` 中的 false 才强制忽略项目放宽项。[固定 v2.1.285 发布说明](https://github.com/anthropics/claude-code/releases/tag/v2.1.285)另确认项目不得放宽 admin-required、扩 strict allowlist 或重开托管 read-deny；这些修正不保证此后客户端没有逃逸漏洞。**[一手：官方契约与版本记录]**

只读的 `anthropics/sandbox-runtime` [9a277e5e04af1ab1b04feea4400a6ed8a5b72039](https://github.com/anthropics/sandbox-runtime/tree/9a277e5e04af1ab1b04feea4400a6ed8a5b72039)是当时 main 快照，不能代表 Claude Code 发布包的捆绑版本。GitHub API 返回 403、`x-ratelimit-remaining: 0`，公开配额耗尽；公开 git 下载成功。未安装依赖或执行上游测试、沙箱命令。**[一手：源码与取得范围]**

| 会误导选择的简写 | 固定证据与边界 | 采用／撤回 |
|---|---|---|
| 必需依赖已齐全，所以 Linux／WSL2 socket 已隔离 | [依赖检查 L1280–1301](https://github.com/anthropics/sandbox-runtime/blob/9a277e5e04af1ab1b04feea4400a6ed8a5b72039/src/sandbox/linux-sandbox-utils.ts#L1280-L1301)把 bwrap／socat 缺失记为 error，缺 seccomp 仅 warning；[执行分支 L3548–3578](https://github.com/anthropics/sandbox-runtime/blob/9a277e5e04af1ab1b04feea4400a6ed8a5b72039/src/sandbox/linux-sandbox-utils.ts#L3548-L3578)在 helper 缺失或 `allowAllUnixSockets` 为 true 时不装该过滤 | `failIfUnavailable` 不能替代可选依赖检查；不是断言每台 WSL2 都缺过滤。官方 [WSL2 说明](https://code.claude.com/docs/en/sandboxing#wsl2-notes)明确 Windows interop 走 Unix socket；阻断前提要单独核对 **[一手]** |
| mask 没写目标也只给原服务 | [env L97–103](https://github.com/anthropics/sandbox-runtime/blob/9a277e5e04af1ab1b04feea4400a6ed8a5b72039/src/sandbox/credential-mask-env.ts#L97-L103)和 [file L228–234](https://github.com/anthropics/sandbox-runtime/blob/9a277e5e04af1ab1b04feea4400a6ed8a5b72039/src/sandbox/credential-mask-files.ts#L228-L234)默认把 `injectHosts` 取为 `allowedDomains`；[测试定义 L766–842](https://github.com/anthropics/sandbox-runtime/blob/9a277e5e04af1ab1b04feea4400a6ed8a5b72039/test/sandbox/credential-mask.test.ts#L766-L842)明确覆盖省略该字段时的跨允许域替换 | 仅在启用 mask 时成立；不是默认自动发送所有凭证，也不是主动广播。代理在请求包含对应占位值时替换；确需认证才审目标范围 **[一手：实现、未运行测试定义]** |
| 提取失败一定拒绝 | [env L189–224](https://github.com/anthropics/sandbox-runtime/blob/9a277e5e04af1ab1b04feea4400a6ed8a5b72039/src/sandbox/credential-mask-env.ts#L189-L224)、[file L315–347](https://github.com/anthropics/sandbox-runtime/blob/9a277e5e04af1ab1b04feea4400a6ed8a5b72039/src/sandbox/credential-mask-files.ts#L315-L347)：仅在可选 mask 的提取未匹配时，省略 `onExtractNoMatch` 得到 warn，跳过该条保护并保留原文；deny 分支移除变量／拒读，error 分支抛错 | 不把这条可选配置失败写成 `mode: deny` 的默认漏洞；不需要认证时保持 deny，有提取规则才须决定不匹配行为 **[一手]** |

[官方文件 mask 契约](https://code.claude.com/docs/en/sandboxing#mask-credential-files)要求 v2.1.221+：macOS 按拒读处理，Linux／WSL2 可给占位副本。macOS 开启文件隔离时先按 deny，不能套用 Linux 的 no-match 原文保留路径。[代理认证前提](https://code.claude.com/docs/en/sandboxing#mask-credentials)另需 TLS termination；缺此前提导致认证失败，不证明秘密已明文发出。本轮未上传或配置真实凭据，也未在用户电脑试读。**[一手：官方契约；研究：平台边界]**

**正文其他纠偏。** `filesystem.disabled` 会关闭受保护路径的文件隔离；`strictAllowlist` 管有效域列表，而列表会合并适用的 `WebFetch` 规则。CLI 沙箱和工具审批、Hook／MCP 进程的区别沿用 [05](../05-skills-and-plugins.md) 与本记录前节，不重复建立防护框架。CI 段同时删去“固定 formatter 命令即可安全”的暗示：[Action 官方安全说明](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md)建议 PR 文件放子目录以避免默认配置加载，却不能证明之后执行 PR 构建代码已隔离；子目录和 `--add-dir` 不是安全容器。[GitHub 的事件说明](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run)指出 workflow_run 即使前序任务不具特权，后续也可访问秘密／写 token；pull_request_target 在基础仓库上下文运行。是否实际注入秘密仍取决于 workflow，不写成每次运行都自动获得全部凭据。Action 的 allowed-tools 建议另按[CLI 字段契约](https://code.claude.com/docs/en/cli-reference)限定为免询问规则：`--tools` 才限制内置工具集合，MCP 不受该字段影响，二者均不能替代 token 权限。Nx 案例中恶意脚本明确传 bypass 参数，因此删掉 shell 别名不是断链；外层安装进程也不受 Agent 内层凭证规则保护。**[一手：机制与文档；经验：采用边界]**

**历史反证补核。** [Embrace The Red 原帖](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/#reliability-and-attack-success-rate-asr)是三个迭代变体各 5 次，3/5、3/5、4/5，不能当通用 ASR；[Anthropic SDLC 原文](https://claude.com/resources/articles/how-anthropic-secures-its-ai-native-software-development-lifecycle)分别报告约 80% 合并代码由 Claude 编写、全部代码超半数由内部 Claude Tag 合并，不能改成同一个子集分母。正文保留反例但收窄统计解释。另把多厂商事故合并叙述缩为 [OpenAI 一手复盘](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)可确认的内部研究模型、弱化防护与共享基础设施突破；不把训练／评估条件外推到发布客户端。RubyGems、Medicare 与其他厂商的合并归属未逐项确证，本轮不保留作核心页证据；ZCode／Cursor 两条仅有二手或 HN 标题，撤出事件表，不能据它们作选型。**[社区：作者实验；一手：厂商自述]**

#### 凭证代理：减少直接持有不等于永远不可读取

核实2026-10-20（UTC+8）。收窄10防护原则中“凭证网关让Agent永远看不到密钥”的保证，并同步18准入入口。不需认证时优先无秘密环境；已有宿主拒读／凭证移除覆盖实际入口就不另加网关，需认证且能维护注入目标与信任边界时才评估代理。既有沙箱的工具／子进程、Hook／MCP限制仍适用。**[经验：采用判断]**

Authsome固定`0d756011`的[威胁模型](https://github.com/agentrhq/authsome/blob/0d756011a6fecebd28b8a7e0d91d9a3d711f1991/docs/site/security/threat-model.mdx)把本机用户账户及该账户进程列为可信，并明确不是沙箱。[代理启动实现](https://github.com/agentrhq/authsome/blob/0d756011a6fecebd28b8a7e0d91d9a3d711f1991/src/authsome/cli/proxy_runner.py)复制父环境，再设置代理与提供方占位变量；这支持减少所管凭证直接进入子进程环境，不支持自动清除所有原有秘密或隔离整个Agent。**[一手：固定文档／实现]**

产品还保留[凭证导出路由](https://github.com/agentrhq/authsome/blob/0d756011a6fecebd28b8a7e0d91d9a3d711f1991/src/authsome/server/routes/connections.py#L244-L259)，由[认证依赖](https://github.com/agentrhq/authsome/blob/0d756011a6fecebd28b8a7e0d91d9a3d711f1991/src/authsome/server/routes/_deps.py#L121-L179)校验PoP身份与归属；[导出实现](https://github.com/agentrhq/authsome/blob/0d756011a6fecebd28b8a7e0d91d9a3d711f1991/src/authsome/server/credential_service.py#L1009-L1082)可返回真实凭证的env／shell／JSON表示。这是获认证能力的静态机制，不是无认证泄露漏洞或本轮导出结果；也不据旧文档推当前CLI子命令可用。选择代理时须核调用方实际拥有的能力，不能只凭README口号判永不接触。**[一手：固定源码；研究：范围限定]**

[Claude Code当前权限文档](https://code.claude.com/docs/en/permissions#read-and-edit)说明Read／Edit规则覆盖内置文件工具、可识别的shell文件命令及重定向，但不覆盖任意Python／Node等子进程间接读写；OS级约束需沙箱，工具和进程入口仍分别核对。因此18不再把单个Read deny模式写成秘密永不进上下文的充分条件，现成控制范围见本节上文。只读公开文档与源码，未运行候选、访问凭据接口、导出真实秘密或验证安全效果。**[一手：官方契约；经验：替代与边界]**


**验证口径。** 只读契约、固定源码与未运行测试定义，不构成模型／OS 实测或安全认证。历史独立评审覆盖 10 全页与 03／05／08 一致性，处理上述问题后判 L3；14/14 离线与 `git diff --check` 通过，仅验证仓库文档／配置和确定性测试。

### 陌生依赖：安装后仍须隔离测试

此前页头的历史核实范围保留如下：核实时间：2026-10-08；2026-10-14 补核外来仓库的脚本启动与配置来源边界；2026-10-15（UTC+8）补核 Codex 文件排除的生效条件及 Claude Code 沙箱的版本、socket 与凭证默认边界。

核实：2026-10-17（UTC+8）。收窄 [10 案例二及个人清单](../10-security.md)的“跳过安装脚本，或者在容器里装”：陌生 PR／Agent 新引入的未审依赖，其安装、测试与构建都留在无秘密、受限挂载及网络的独立环境。容器限定与前节既有结论一致；新增证据是安装选项不能阻止后续显式运行脚本。不要求已可信项目另建平台。**[研究：采用判断与查重范围]**

**安装成功不是执行授权。** [npm v11 `ignore-scripts`](https://docs.npmjs.com/cli/v11/commands/npm-ci/#ignore-scripts)页面标为 11.21.0（Legacy）；[v12 同段](https://docs.npmjs.com/cli/v12/commands/npm-ci/#ignore-scripts)标为 12.2.0（Latest）。两者都明确：该选项生效时，显式 `npm test`／`npm run` 仍执行目标脚本，只跳过其 pre／post 脚本。一次 `npm ci --ignore-scripts` 也不会替后续独立命令持久设置此选项。[`npm run`](https://docs.npmjs.com/cli/v11/commands/npm-run/#description)会将 `node_modules/.bin` 加入 PATH；测试／构建仍可执行依赖代码。v12 的安装脚本准入默认与 v11 有别，但都不能把安装期准入当作后续执行隔离。**[一手：版本化官方契约；研究：执行边界]**

**锁定内容仍要判断来源。** `npm ci` 按已有锁文件安装，manifest 与锁文件不符时失败，不替你更新二者；[锁文件](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/)记录依赖树、来源与完整性值。这支持重现和内容一致性，不能证明锁定代码可信，陌生变更须连同锁文件一起审。[Node.js 官方安全指南](https://nodejs.org/learn/getting-started/security-best-practices#malicious-third-party-modules-cwe-1357)说明运行期恶意依赖仍是风险；[Docker 官方边界](https://docs.docker.com/engine/security/#docker-daemon-attack-surface)说明宿主挂载与 daemon 控制权限可暴露宿主，故“用了容器”不足以确认隔离。若功能确需被跳过的安装脚本，先审所需脚本，再在原隔离环境中允许；不为跑通撤掉边界。**[一手：机制；经验：采用／撤回]**

**必要构建的窄恢复入口（2026-10-19 UTC）。** 全禁用已能满足任务时继续使用，不新增工具。npm 12.2.0 的依赖安装脚本默认按 `allowScripts` 准入；未覆盖项被跳过并汇报，默认不因此失败。`install-scripts ls` 只列未审项；`approve <pkg>` 默认把匹配的已安装版本写成版本固定项，裸包名可匹配多个已安装版本，不能当成仅批准其中一个。只批准所需版本可传明确包版本。名称级永久允许会覆盖后续版本，因此不作为审过一次的同义写法。批准实现仅加载已安装树并保存策略，没有调用构建。需要恢复已跳过产物时，在原受限环境对目标包重建并验证使用路径；`npm rebuild` 支持按名称／版本限定。若已有 false 拒绝项，approve 不会覆盖；复核后须先调整相冲突的拒绝策略，再批准所需版本并核对有效策略，不能因显示了批准结果就认定运行已放行。只审过某个版本也不证明其代码安全。**[一手：固定实现；经验：选择]**

`strict-allow-scripts` 在 12.2.0 默认 false；开启后未审依赖使安装失败，显式 false 仍跳过，`ignore-scripts` 或 `dangerously-allow-all-scripts` 会覆盖这一设置。严格模式证明不了已拒绝包不影响产品，也不是安全审查。`ci.js` 中根项目生命周期脚本仍在未设 ignoreScripts 时执行；因此 dependency allowlist 不能替代隔离。有效策略来源也要审：根 package.json 的 allowScripts 整层覆盖低优先级 .npmrc，不是合并，不能相信陌生仓库自己带来的允许表。**[一手：固定配置与源码；经验：边界]**

已有 pnpm 项目则保留包管理器：当前官方 `allowBuilds` 用 true／false 记录决定，未审项在 strictDepBuilds=true 时失败；pnpm 11 移除了旧 onlyBuiltDependencies 等字段。当前文档另规定 pnpm 12.11+ 的 `permissions.<包>.build` 优先于 allowBuilds，因此须核实际版本与有效策略，不能只看到 false 就认定禁止。npm 与 pnpm 的全开开关语义不同，不相互照搬。n8n 固定仓库 packageManager 为 pnpm@12.4.2，strictDepBuilds=true；allowBuilds 允许 sqlite3、isolated-vm、@vscode/ripgrep、@confluentinc/kafka-javascript，同时拒绝 esbuild、puppeteer 等。这是成熟公开项目选择性采用的配置证据，不能复制它的包名单到别的项目，也不证明这些被拒绝包普遍无须构建。n8n 为公开源码项目，此处不作 OSI 开源许可断言；未核此次构建结果、性能或安全收益。**[一手：公开配置；研究：适用限定]**

**固定来源。**

- npm v12.2.0 tag 指向 c276cadf785c1018d82dd287fe7742567055efb9
- https://github.com/npm/cli/blob/c276cadf785c1018d82dd287fe7742567055efb9/docs/lib/content/commands/npm-install-scripts.md
- https://github.com/npm/cli/blob/c276cadf785c1018d82dd287fe7742567055efb9/lib/utils/allow-scripts-cmd.js （runMode、findNodesForArgs、writePolicyChanges）
- https://github.com/npm/cli/blob/c276cadf785c1018d82dd287fe7742567055efb9/workspaces/config/lib/definitions/definitions.js （strict-allow-scripts）
- https://github.com/npm/cli/blob/c276cadf785c1018d82dd287fe7742567055efb9/lib/commands/ci.js （根生命周期脚本）
- https://github.com/npm/cli/blob/c276cadf785c1018d82dd287fe7742567055efb9/docs/lib/content/commands/npm-rebuild.md
- https://github.com/pnpm/pnpm.io/blob/e5b39ba571ca59b6e7b492082e8d5b81a05217c0/docs/settings/build.md
- https://github.com/n8n-io/n8n/blob/791c7bc418bf789a9686859f10592b3980571b50/pnpm-workspace.yaml
- https://github.com/n8n-io/n8n/blob/791c7bc418bf789a9686859f10592b3980571b50/package.json
- [定向重建实现](https://github.com/npm/cli/blob/c276cadf785c1018d82dd287fe7742567055efb9/lib/commands/rebuild.js)
- [有效策略整层选择](https://github.com/npm/cli/blob/c276cadf785c1018d82dd287fe7742567055efb9/lib/utils/resolve-allow-scripts.js)

仅阅读公开文档，未安装依赖、运行 npm／容器／测试或攻击载荷，未检查私人配置；不构成运行时安全认证。**[研究：验证范围]**

### Python 多索引：先固定包来源再解析

核实：2026-10-19（UTC+8）；补充 10 §3 在 Agent 新增索引或放宽解析策略时的选择。既有 npm 段管安装后执行，本节管解析时选中哪个来源；两者都须保留。**[研究：范围]**

**pip 不按索引位置设优先级。** [26.2.1 固定文档](https://github.com/pypa/pip/blob/634a6ec1a5d9dcc2433571cdb2f4c58a4bb29caf/docs/html/cli/pip_install.rst#finding-packages)说明，主索引、`extra-index-url`、`find-links` 等位置的候选共同参与选择；同名同版本也不认证来源。已有受控单索引或已审离线 wheel 集合够用时保留 pip；文档支持 `no-index` 配合 `find-links`，但代理自身如何处理同名包仍要核，不能把“只有一个 URL”当安全证明。**[一手；经验：采用边界]**

**uv 的先后顺序不是“第一个兼容版本”。** 固定 [`063712bc` 索引契约](https://github.com/astral-sh/uv/blob/063712bc3a1390ddec8079bf3b0add6978d792d6/docs/concepts/indexes.md#searching-across-multiple-indexes)与[兼容性说明](https://github.com/astral-sh/uv/blob/063712bc3a1390ddec8079bf3b0add6978d792d6/docs/pip/compatibility.md#packages-that-exist-on-multiple-indexes)：默认 `first-index` 把候选限制在首个含该包的索引；该处缺兼容版本也不跨源找，前索引根本无包则仍可继续，因此内部包名不能只靠排序防回落。`unsafe-first-match` 改为找首个兼容版本，`unsafe-best-match` 合并候选；不为消除解析报错就改用它们。**[一手；经验：撤回边界]**

**包绑定与索引准入方向不同。** 已有 uv 项目工作流可用 [`tool.uv.sources`](https://github.com/astral-sh/uv/blob/063712bc3a1390ddec8079bf3b0add6978d792d6/docs/concepts/indexes.md#pinning-a-package-to-an-index)将特定包绑定具名索引；该名字须在项目 `pyproject.toml` 定义。`explicit = true` 另限制其他未绑定包不能从该索引取得，不会自行把内部包绑定过去。来源绑定的命令入口须保持一致，不能把这份项目配置外推到任意 pip 兼容调用；切换命令或忽略 sources 的选项须重新核对。**[一手；经验：采用范围]**

**可信哈希仍有用，首次选择另审。** pip 的[固定哈希契约](https://github.com/pypa/pip/blob/634a6ec1a5d9dcc2433571cdb2f4c58a4bb29caf/docs/html/topics/secure-installs.md#hash-checking-mode)用本地可信哈希保护选定工件，要求依赖完整覆盖；索引随下载给出的摘要不能替代这份可信值。锁入错误来源后，内容一致也不使其可信。历史 [PyTorch 公告](https://pytorch.org/blog/compromised-nightly-dependency/)限定 2022-12-25 至 30 的 Linux／pip nightly 同名 `torchtriton`，stable 不受影响；恶意程序在导入 triton 时执行。公告“PyPI 优先”的历史简写不覆盖上述当前 pip 契约，也不是当前 Agent 事故。**[一手；研究：历史范围与采用判断]**

✅ 先明确包的获准来源；指定来源缺兼容版本时修发布或约束，确认后再更新锁与可信哈希。该机制不替代执行隔离，也不要求迁移现有包管理器。本轮只读官方文档和历史公告，未访问私有索引或凭据，未安装、运行包、解析器、攻击测试或模型；没有安全效果或维护成本测量。**[经验；研究：验证边界]**

### Codex 脚本入口：信任状态不等于有效权限

**核实：2026-10-14 UTC；改变 10 §3 与 Codex 的脚本入口建议。** ✅ 只读自动化须核有效权限：旧配置可显式用 `--sandbox read-only`，已有文件排除 profile 时不叠加旧开关（2026-10-15 UTC+8 补核，见[10 的唯一采用建议](../10-security.md#codex-文件排除的采用条件)）。另审配置、指令、技能和 Hook 脚本；trust／Git 检查不能隔离执行。固定[openai/codex `7a08c5f`](https://github.com/openai/codex/commit/7a08c5f6271e818d832eb9061dac935936e2b539)仅为当日 main，非发行客户端验证。**[一手：源码；经验：采用判断]**

[当前配置文档](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence)规定项目配置只对 trusted 项目加载，用户与系统配置仍可生效。[loader](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/config/src/loader/mod.rs#L1056-L1132)禁用未设 trust 和显式 untrusted 的项目配置；[AGENTS 加载](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/core/src/agents_md.rs#L56-L87)却只在显式 untrusted 时提前返回，并保留传入的用户指令。[exec 的 Git 检查](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/exec/src/lib.rs#L1012-L1019)只检查仓库根，通过不代表 trusted。**[一手：官方契约与固定实现]**

**默认说明不替代有效权限。** [官方 non-interactive 文档](https://learn.chatgpt.com/docs/non-interactive-mode#permissions-and-safety)说明 exec 默认 read-only；固定 [exec 配置](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/exec/src/lib.rs#L584-L615)则默认给 headless 设置 `Never` 审批，Auto-review 另有重建分支。传统 sandbox 配置路径在没有显式 sandbox、项目已有 trusted 或 untrusted 决定时会产生 workspace-write 候选，[同一函数](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/config/src/config_toml.rs#L841-L906)仍有平台与 requirement fallback。named profiles、持久权限恢复及[最终约束解析](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/core/src/config/mod.rs#L3721-L3838)另参与计算，最后使用[受约束的 effective profile](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/core/src/config/mod.rs#L4253-L4312)；不能由这个候选宣称所有 untrusted 运行都可写，也不能据 main 说发布版默认已经改变。**[一手：文档与源码；研究：分层限定]**

[skills 根目录实现](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/ext/skills/src/host_roots.rs#L73-L196)遍历含禁用层的配置目录，并查项目 `.agents/skills`；[测试定义](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/ext/skills/src/host_roots_tests.rs#L244-L289)保留 disabled project 的 `.codex/skills` 根。[会话调用路径](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/core/src/session/turn_context.rs#L1300-L1323)另有跳过 host discovery 的功能或会话分支。这些只证明发现机制，不证明自动调用、执行或提权。**[一手：固定实现与未运行测试定义]**

[当前官方契约](https://learn.chatgpt.com/docs/hooks#review-and-trust-hooks)要求非托管 Hook 先信任当前定义，新增或修改的定义会被跳过；`/hooks` 可查来源和待审项，启用插件不自动信任它的 Hook。[hook_hash](https://github.com/openai/codex/blob/7a08c5f6271e818d832eb9061dac935936e2b539/codex-rs/hooks/src/engine/discovery.rs#L768-L794)只哈希规范化事件与 handler 配置，不读脚本内容。因此定义未变仍须审脚本来源，不能对外来仓库绕过信任。**[一手：契约与固定实现；经验：采用判断]**

仅只读，未运行 Codex、模型、上游测试或检查私人配置。未审完整 MCP、shell 和插件启动路径，命令沙箱不保证宿主零启动执行。`--ignore-user-config` 与 `--ignore-rules` 各按声明范围理解，不作为关闭全部项目能力的开关；不增加信任修改、凭据迁移或放宽安全的步骤。**[研究：验证范围与撤回边界]**

### Hook 跨宿主迁移：匹配成功不等于协议适配

**核实：2026-10-15（UTC+8）；主线二；改变 06 的迁移选择。** ⛔ 不把本仓 Claude 路径脚本原样作为 Codex 路径策略。模板本限 `.claude/`、须按宿主验证；本项明确不可直接迁移的条件，未改脚本／适配器／权限。**[经验：采用判断]**

**来源与版本。** 查询 [官方 latest release](https://api.github.com/repos/openai/codex/releases/latest) 得到 [`rust-v0.162.1`](https://github.com/openai/codex/releases/tag/rust-v0.162.1)（2026-10-09 发布）；[annotated tag 对象](https://api.github.com/repos/openai/codex/git/tags/7a078f6bb4ce0dc2a81408b334ce52979d92c603)指向 commit `092d3acd6bec3e3a14bdc7e7a2810ab628ab759d`。下表均为该发布提交；[当前 Codex Hooks 文档](https://learn.chatgpt.com/docs/hooks#pretooluse)与 [Claude Hooks 文档](https://code.claude.com/docs/en/hooks)仅为访问时契约，不证明旧版／桌面均支持。**[一手：版本元数据、官方契约与源码]**

| 核查点 | 新证据 | 选择与边界 |
|---|---|---|
| matcher 与实际输入 | [`hook_names.rs` L28–38](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/core/src/tools/hook_names.rs#L28-L38)把 Edit/Write 作为别名；[`apply_patch.rs` L395–400](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/core/src/tools/handlers/apply_patch.rs#L395-L400)提供 command 形态的补丁；[`pre_tool_use.rs` L169–189](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/hooks/src/events/pre_tool_use.rs#L169-L189)序列化实际工具名 | matcher 命中不证明 file_path 解析器适用；需按补丁协议处理多文件等情况，不能仅替换字段名 |
| 决定与失败 | [`output_parser.rs` L441–470](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/hooks/src/engine/output_parser.rs#L441-L470)判 ask 不支持；[`pre_tool_use.rs` L200–309](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/hooks/src/events/pre_tool_use.rs#L200-L309)将错误记 Failed、保留 should_block=false；[同文件测试定义 L555–585](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/hooks/src/events/pre_tool_use.rs#L555-L585)断言此分支 | 不能把 Claude ask 规则直接作为 Codex 人工确认策略；测试定义已读但未执行 |
| 异步不是准入检查 | [Codex 当前后台契约](https://learn.chatgpt.com/docs/hooks#run-hooks-in-the-background)；固定 [`command_runner.rs` L116–166](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/hooks/src/engine/command_runner.rs#L116-L166)后台调用同一 runner、过滤控制输出，[L276–318](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/hooks/src/engine/command_runner.rs#L276-L318)执行 timeout；[Claude 当前异步契约](https://code.claude.com/docs/en/hooks#run-hooks-in-the-background)明确普通 async 后台不执行 timeout（asyncRewake 另论） | 两者都不能后台阻断原动作；超时、会话结束取消与结果交付不能当通用协议。Claude 本项未核最低版本或闭源实现 |

**现有脚本合成对照（本轮实际运行）。** 静读 [`protect-paths.sh`](../../templates/generic/.claude/hooks/protect-paths.sh)确认它只解析输入与规则，不执行 tool_input；用临时目录、临时规则 `deny generated/** generated file` / `ask review/** needs review`，显式设置 `CLAUDE_PROJECT_DIR` 与 `PROTECTED_PATHS_FILE`，通过 `bash` 调用原脚本。jq 分支结果如下；双解析器既有覆盖见 E6。

| 合成 stdin 变化（均无秘密） | 实际退出码／stdout |
|---|---|
| `tool_name=Edit; tool_input.file_path=generated/a.txt` | 0；PreToolUse permissionDecision=deny |
| `tool_name=Write; tool_input.file_path=review/a.txt` | 0；PreToolUse permissionDecision=ask |
| `tool_name=apply_patch; tool_input.command` 含新增 generated/a.txt 的标准补丁文本 | 0；空 stdout，无决定 |
| `tool_name=Edit; tool_input={}` | 0；空 stdout，无决定 |
| 无效 JSON `{` | 1；空 stdout，stderr 含解析错误与“无效 Hook 输入” |

临时目录无补丁目标，夹具已删除；只验证脚本输入处理，未改脚本、执行补丁或信任／权限操作，未运行真实客户端及 Rust 测试。宿主契约变化须重核输入和控制返回；06 仍为 L2，本项未核全页权限与事件。**[经验：离线合成检查；研究：限定]**

### 质量检查：先验替代入口，再撤重复 Hook

核实：2026-10-18（UTC+8）。主线二／三；收窄 06“机械检查放 Hook”：先复用项目检查，确需即时反馈再加事件层，撤除须核替代已生效。[研究]

**删与留来自同一维护决定。** rjmurillo/ai-agents [#3193](https://github.com/rjmurillo/ai-agents/issues/3193)报告逐写检查重复已有提交检查，但工作副本的 `core.hooksPath` 未设置。[#3240](https://github.com/rjmurillo/ai-agents/pull/3240)实际删除三个逐编辑 ADR／计划 Hook，保留 commit-time ADR guard；明确暂留 markdown 自动检查，等 Git hooks 激活前置完成。不能由已有 `.githooks` 目录就撤掉现有覆盖，也不能把该项目删减推广为及时反馈无用。[一手／社区：维护报告与合入修订]

**替代接上后仍核失败。** [#3244](https://github.com/rjmurillo/ai-agents/pull/3244)在 SessionStart 复用已有幂等安装器；[固定实现](https://github.com/rjmurillo/ai-agents/blob/b59098fc15edf5cb12320323faf803a2d9cb9ebd/.claude/hooks/SessionStart/invoke_git_hooks_activation.py)仅在运行脚本位于目标仓库内且存在 `.githooks` 时继续，缺安装器、超时或非零结果只告警，最终仍退出 0。[测试定义](https://github.com/rjmurillo/ai-agents/blob/b59098fc15edf5cb12320323faf803a2d9cb9ebd/tests/hooks/test_git_hooks_activation.py)覆盖临时 Git 仓库配置写入、第二次静默、外部仓库不执行安装器及失败告警；[维护者回执](https://github.com/rjmurillo/ai-agents/issues/3182#issuecomment-5016306125)称 17 测通过。正向测试检查配置，并未实际提交坏文件来验拦截；启动成功也不能证明每次检查生效。[一手：补丁／测试；社区：回执]

**采用与边界。** 格式化、提交检查及 CI 已满足反馈时点和覆盖就复用；需要提前纠错仍可保留窄 Hook。替换前验实际入口、所选文件和失败去向，失败未闭合就暂留原覆盖；不把安全拦截延后到提交。此处只读历史链，未运行上游测试／客户端，无同任务净收益或后续 markdown 退役验收；不推荐安装该框架或自动执行其他仓库的安装器。[研究／经验]

### 官方交互浏览器 Skill：值得借什么，不能照搬什么

[阅读本节](2026-10-12-development-feedback.md#s197)

### 交互界面：按缺失观察选择反馈

[阅读本节](2026-10-12-development-feedback.md#s205)

### 截图稳定化：结束动画不是保留当前状态

[阅读本节](2026-10-12-development-feedback.md#s221)

### Service Worker：响应来源决定保存与故障验收入口

[阅读本节](2026-10-12-development-feedback.md#s237)

### React：生产构建故障中的定向日志

[阅读本节](2026-10-12-development-feedback.md#s253)

### 属性测试：搜索反例不等于确认或修好缺陷

[阅读本节](2026-10-12-development-feedback.md#s265)

#### 成本与限制

[阅读本节](2026-10-12-development-feedback.md#s275)

#### 本轮零成本公式对照

[阅读本节](2026-10-12-development-feedback.md#s281)

### 外部生产者校准错误预期

[阅读本节](2026-10-12-development-feedback.md#s353)

## 三、领域知识比通用规划更可能是持久资产

[阅读本节](2026-10-12-development-maintenance.md#s387)

### 迁移后的事实归属与旧调用方式

[阅读本节](2026-10-12-development-maintenance.md#s398)

## 四、游戏开发用来检验这个方向，而不是扩张引擎百科

[阅读本节](2026-10-12-development-maintenance.md#s408)

## 五、我们应怎样安排研究，而不是怎样继续加任务

[阅读本节](2026-10-12-development-maintenance.md#s418)

### Discourse：共享组件承接后续需求

[阅读本节](2026-10-12-development-maintenance.md#s422)

### Pydantic AI：取消契约改变，不代表正常完成也应改变

[阅读本节](2026-10-12-development-maintenance.md#s436)

#### 累计到下一次需求：保存、重放、整轮取消不是同一个契约

[阅读本节](2026-10-12-development-maintenance.md#s459)

#### 接收者接下来做了什么：删除补偿层，而非恢复旧测试期待

[阅读本节](2026-10-12-development-maintenance.md#s475)

#### 后续依赖升级：旧观察点过时，不等于消费者结果可以丢

[阅读本节](2026-10-12-development-maintenance.md#s494)

#### 累计采用判断：下一需求改变了谁必须知道什么

[阅读本节](2026-10-12-development-maintenance.md#s506)

### 上游接管后的退出条件：aiohttp 误判修复版本

[阅读本节](2026-10-12-development-maintenance.md#s518)

### CodeThread：下一次修改失败，先查继承了什么行为

[阅读本节](2026-10-12-development-maintenance.md#s541)

### 生成回归测试：先保留预期，再决定是否新增

[阅读本节](2026-10-12-development-feedback.md#s557)

### 生成测试：先选保护未来还是查当前差异

[阅读本节](2026-10-12-development-feedback.md#s569)

### n8n：配置回退与独立导出入口

[阅读本节](2026-10-12-development-maintenance.md#s579)

### Grafana：回退的恢复时间点与保护性拒绝

[阅读本节](2026-10-12-development-maintenance.md#s595)

### 能推翻或改变这个优先级的证据

[阅读本节](2026-10-12-development-maintenance.md#s609)

## 来源与阅读范围

- **S1 [一手]**：OpenAI Skills 固定 `49f948faa9258a0c61caceaf225e179651397431`，[interactive](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/playwright-interactive/SKILL.md) 的前提、会话、功能/视觉 QA、viewport 与重启段落；[CLI](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/playwright/SKILL.md) 的前提、核心流程与快照更新段落。只读研究，未采用为本会话指令。
- **S2 [一手]**：[Code modernization](https://github.com/openai/openai-cookbook/blob/5bd6cb40b6b84b69b2032d810610aa85064102df/examples/codex/code_modernization.md)，读引言至第 4.2 阶段。没有运行教程、验证其业务系统或据此确认当前采用率。
- **[经验/研究]**：本仓库 Catalog Compare 与验收链检查见正文链接；游戏、地址保存示例是本文分析设计，不是性能实测。当前来源仍偏官方与公开 GitHub，社区原始运行轨迹是下一步证据缺口。

## 写入路径扩展与序列化判等：sqlite-chronicle

[阅读本节](2026-10-12-development-feedback.md#s621)

### 一手修订链与归属

[阅读本节](2026-10-12-development-feedback.md#s625)

### 零依赖复核与反例

[阅读本节](2026-10-12-development-feedback.md#s634)

### SWE-Game：游戏移植的 Visual 分不等于体验质量

[阅读本节](2026-10-12-development-feedback.md#s654)

## 重复代码迁移：语法规则、类型分析与第二次执行

[阅读本节](2026-10-12-development-maintenance.md#s678)

### 语法匹配能省重复劳动，但不等于完成迁移

[阅读本节](2026-10-12-development-maintenance.md#s682)

### 类型与框架分析值得增加的具体条件

[阅读本节](2026-10-12-development-maintenance.md#s690)

### 批量入口：先选改法，再选执行方式

[阅读本节](2026-10-12-development-maintenance.md#s698)

### 重复执行与第二次需求不是同一项保证

[阅读本节](2026-10-12-development-maintenance.md#s704)

## 权限模式与第三方 Hook：按实际审批方向选择

主线二／三；核实 2026-10-15（UTC+8）。改变 06 第 2–4 节的选择：dontAsk 与 bypass 分开，plan 不充当只读隔离，自动批准工具不冒充单向拦截。
新证据是当前官方权限／模式契约与第三方项目自述的交叉比较；删除不帮助选择的事件名单，不重做跨宿主输入或 Stop 回归。
结论：✅ 原生规则与执行隔离优先；🧪 减少审批和增加拦截分别评估；👀 未验证的第三方扫描器不承担安全承诺。

### 来源与决策差异

- **S1 [一手]**：[Configure permissions](https://code.claude.com/docs/en/permissions#permission-modes)，核对模式表、规则优先级、参数规则。acceptEdits 包含常见文件操作；dontAsk 拒绝须询问的动作；参数匹配不能泛用于 allow。它们决定无人值守任务是否继续，以及读者实际放开了什么。
- **S2 [一手]**：[Choose a permission mode](https://code.claude.com/docs/en/permission-modes)，核对 Available modes、plan、默认入口、How auto mode evaluates actions 与回退。auto 可用与 useAutoModeDuringPlan 会改变 plan 的命令处理；bypass 可用时另有例外。默认 auto 的版本说法须限定交互终端／VS Code。当前分类器输入包含 CLAUDE.md 与可选 classifierContext；常规编辑、规则命中和特殊人工审批路径不能统称“所有动作交分类器”。这些是产品描述，不改变本任务授权。
- **S3 [一手]**：[auto mode 工程文](https://www.anthropic.com/engineering/claude-code-auto-mode)，核对 Results 与 Why the prompt-injection probe matters。保留历史三个样本集与误差，不外推到当前构建；原文明确主 Agent 被注入后仍可能绕过分类器。删除“不会被注入影响”的绝对保证。
- **S4 [一手]**：[Hooks reference](https://code.claude.com/docs/en/hooks#permissionrequest) 的 PermissionRequest 与 FileChanged：前者依赖进入审批流程，后者发生在变化之后；事件存在不等于提供完整拦截。事件名单不再作为成熟度的补全目标。
- **S5 [一手：作者自述，非安全认证]**：[CC Safety Net README](https://github.com/kenryu42/cc-safety-net)明示不包含进程／文件系统／出网隔离，且损坏配置不会阻止操作；[Dippy README](https://github.com/ldayton/Dippy)明确自动批准安全命令。两者角色不能混为增加一道拒绝门。Dippy 的效率宣传未采纳，原生本已免审批的读取也不足以证明需要安装它。
- **S6 [一手：作者自述]**：[parry-guard README](https://github.com/vaporif/parry-guard)仍警告早期开发／误报，并依赖扫描模型；不将其示例配置视为已经通过宿主契约验收。[TDD Guard README](https://github.com/nizos/tdd-guard)明确新项目应从后继 Probity 开始。本轮撤下无条件推荐，而不是未经比较直接推荐后继工具。

- **S7 [一手]**：[Shell 沙箱官方范围](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)与 Get started 明示 Hook／MCP／内建文件工具不在 shell 边界内，必需依赖缺失可默认降级。独立评审指出这会改变第三方 Hook 的部署选择；06 补最小范围说明，具体有效配置继续统一在 10 §3.2 维护，不复制一套配置。[How we contain Claude](https://www.anthropic.com/engineering/how-we-contain-claude) 的信任对话前 Hook 执行案例明确已修复，06 补历史状态并回链 10 的现行脚本入口；[Copilot 官方公告](https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/)支持现有三系统／MXC／企业强制策略概述，补直接来源。

### 反证、收敛与验证范围

原生能力不足时可试第三方解析器；少批准不等于更安全。动态 README 仅支持角色判断，部署仍需固定版本、核失败策略；本轮未安装。

06 原先把三个攻击变体写为 60–80% 并与不同条件的零成功测评并列，现按 10 安全既有原文核查收敛为 3/5、3/5、4/5，只说明攻击链可行；未新增攻击实验。历史数字的详细解释继续由 10 维护。已有跨宿主、Stop 和路径脚本结论未借本轮放大。

仅阅读文档／README，未运行客户端、审批服务、模型、第三方工具或引擎；局部修正不证明整页 L3，真实客户端实验也非 L3 必要条件。


## 拒绝诊断：先区分权限、模型与服务故障

> 主线三／四；改变 17 §2.12 的首步：先辨拒绝层，再选择授权、合法澄清或故障恢复；不把所有拒绝归为误报。新证据为以下当前官方协议的交叉核对，核实于 2026-10-15（UTC+8）。**[一手；经验：诊断选择]**

### 来源与会改变选择的差异

- [Claude Code 权限机制](https://code.claude.com/docs/en/permissions#manage-permissions)明确权限由客户端执行，提示／CLAUDE.md 不改变授权；`dontAsk` 可直接拒绝本该询问的动作。其模型拒答分类器与 auto mode 的动作审批不是同一个层面。正文只指向检查与合法授权，不提供改写命令、换工具或去掉保护来绕过拒绝的建议。**[一手；经验]**
- [Messages API stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons#refusal)将 `refusal` 作为正常响应的停止原因；[API errors](https://platform.claude.com/docs/en/api/errors#http-errors)则区分 401 鉴权、403 资源权限、429 限流／花费上限和 5xx。流式响应开始为 200 后仍可产生 error，故不能仅由 HTTP 状态判断拒答或成功。官方 SDK 已有默认重试，应用再套重试前应核实际设置；花费上限需要恢复访问条件，不能靠盲目等待。**[一手]**
- [Refusals and fallback](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback)补足原建议的两类反例：`reasoning_extraction` 应把索取完整内部推理改为结果依据／简短解释，没有推荐回退；服务端 `fallbacks` 仅处理分类器拒答，不处理限流、过载或服务器错误。相反，[CLI reference](https://code.claude.com/docs/en/cli-reference#cli-flags)的 `--fallback-model` 用于主模型过载／不可用。相同“fallback”名字不能当成相同恢复配置。**[一手]**

### 平台与失效条件

服务端拒答回退是 Claude API beta；当前不支持 Message Batches、Bedrock、Google Cloud 或 Microsoft Foundry，Haiku 5.5 亦无服务端回退。显式候选还需兼容请求特性；默认路由无推荐对象、候选过载／限流时仍可保留拒答。因此正文保留“先核平台／模型／特性，再检查最终状态与返回模型”，不把设置了参数写成已恢复。以上事实来自同一厂商不同接口契约的交叉核对，不算多作者效果证据。**[一手；研究：边界]**

撤回旧正文的无条件换问法／删 base64 工具建议：某个模型迁移指南中的针对性办法不能替代原始错误分类；不推断这些办法在其原测试范围无效。公开排障只保留脱敏故障信息，不要求上传完整会话、凭据或私人数据。正常任务的澄清与服务商允许的回退，不构成绕过内容安全或授权要求的许可。**[经验：采用与收敛判断]**

### 验证范围

只读上述契约并核 17、01 Claude、10 一致性，未运行模型／客户端／SDK 或绕过测试。离线检查不证明误报率、回退收益或整页 L3。


## dot 实际能力诊断：公开网页读取的路径差异

17 的核查沿革：基础核实为 2026-10-08，成本／缓存于 10-13 补核；上下文恢复、停止、拒绝及全文核心建议／模板入口于 10-15（UTC+8）审阅，并修正模型提示范围。这些仅为文档核查，未运行当前模型或客户端；下列读取观察单独计证。**[经验：维护范围]**

> 主线二，兼三／四；改变 17：单条读取路径失败不代表整体不可用。以下汇入协作执行中 2026-10-15 02:42–02:44 UTC 的现场观察及同日 03:02 UTC 的公开 GET 测量，本次编辑未独立复测。**[经验：实际观察与诊断建议]**

### 观察与复现范围

| 对象与条件 | 实际结果 | 能支持什么 |
|---|---|---|
| [X 原帖一](https://x.com/thsottiaux/status/2106845241357824205)、[原帖二](https://x.com/thsottiaux/status/2109892247580000595)及[作者公开主页](https://x.com/thsottiaux)的网页抓取 | 返回 403 | 这些 URL 在该次抓取路径失败，不能直接判定所有访问路径失败 |
| 同一组公开 URL，dot 云端 Chrome 正常打开 | 可读；原帖刷新复测成功；没有登录、验证码或绕过限制 | 当时已有浏览器路径足以读取原始来源，无须据此申请更大权限或安装新工具 |
| 同期 OpenAI 公开文档与公共 GitHub 的抓取 | 正常 | 不支持“本次环境完全不能联网”；也不能解释 X 的差异根因 |

**公开 GET（2026-10-15T03:02:42.528671Z）**：协作执行端在 shell 用 Python `urllib.request.urlopen('https://x.com/thsottiaux', timeout=15)`，未附 cookies 或特殊 headers，最多读 1,000,000 字节；得到 HTTP 200、141,804 字节，含已知 ID `2110151780478927344` 和 `2109892247580000595`。这只证传输成功及 ID 存在，未验完整正文或实时 timeline；内容仍据 Chrome 原帖。无需登录、验证码或绕过限制，GET、抓取与浏览器的底层网络是否同源未知。**[经验：实际测量]**

上述为 **[经验：本次环境观察]**，非稳定成功率或产品契约；第三方转录仅发现线索，内容已回原帖核对，不据此背书产品能力。

### 采用与停止边界

- **先分类**：入口未暴露、执行失败和目标页报错是不同问题。公开内容可读时，用受支持的原路径核原文；路径结果不同就分别记录，不外推全平台。**[经验：采用判断]**
- **根因未知**：缺响应头或网络追踪，不能归因 X 反爬、代理或其他原因。观察时间非发布时间；DOM 无可核实 datetime／时区，不猜成 UTC+8。**[经验：证据限制]**
- **遵守访问边界**：遇禁令、登录、验证码或授权拒绝，须停止或完成获准步骤。本例无需这些步骤，不支持改身份、代理或权限。**[经验：适用边界]**
- **副作用与续接另有规则**：[20 §4／§5／§9](../20-codex-long-horizon.md)已维护状态恢复、子任务结果收集与未知外部操作对账。本例只读，不证明重新发起写入安全。**[经验：范围]**

### 下一问题与验证状态

首轮已足以撤回“抓取失败就整体不可读”的判断；尚未检验 dot 的云端执行与 Git 发布、调度执行与送达、并行结果回收与续接。这些只作为 [BACKLOG](BACKLOG.md#二强-agent-还缺什么额外能力怎样才值得r15r01r05r08r02) 中的待验证能力类别，后续按单一失败场景追踪可观察结果，不收集或公开私人排程、认证日志、授权对话、账号用量或凭据。当前没有运行 Git 认证／发布测试、创建调度、安装软件或启动模型／引擎实验。**[研究：后续范围；经验：验证状态]**


## dot 长任务续接：接受、处理与停止范围

主线：二，兼三／四；沿用 dot 能力诊断与 20 的长任务建议，不新增模块。
改变的建议：20 §5 不以重复催促确认进展，恢复时先核最新要求；§7 分别核对主任务、委派任务与排程。
新证据：dot 官方契约、公开故障原帖及 Codex 固定源码／测试定义，2026-10-15 UTC 核实；未运行客户端或调度实验。**[一手／社区／研究]**

### 官方契约与实际报告分别证明什么

[Tasks and memory](https://learn.chatgpt.com/docs/dots/tasks-and-memory#assigned-work)允许 dot 在对话间工作、自行暂停与唤醒；固定重复工作须另存排程。新任务上下文独立，完成后仍须查输出和错误，不等于目标完成或送达。本地任务需原电脑在线，已配置 Codex 云环境可在用户电脑离线时工作；切电脑不迁移旧任务。该页未给最大阻塞时间、恰好一次投递或崩溃恢复 SLA。**[一手：当前产品文档]**

[Control your dot](https://learn.chatgpt.com/docs/dots/controls#stop-work)分别控制 Pause、Activity 委派停止和 Scheduled 禁用排程；一处成功不代表所有层已停，副作用仍按 20 §9 对账。**[一手；研究：采用范围]**

- [dot #51610](https://github.com/openai/codex/issues/51610)：10 月 7 日 macOS 本地 browser bundle 阻塞约 52 分钟，dot 多次 follow-up 返回 `steered`，恢复后集中收到。是 dot 反复发送，非系统复制；未证丢失、重复投递或旧指令执行，版本与根因未知。最终恢复反驳永久失败判断，却不给固定等待时长。**[社区：观察摘要，无确定性复现]**
- [dot #52374](https://github.com/openai/codex/issues/52374)：云任务可读，续接却报 UNKNOWN／NOT_FOUND；不同作者另报定时、手动均未创建，或可读但 send 失败。**10 月 12 日 11:50 UTC 的补充案例已恢复**：原任务未重建，send 开新轮，完成后回读精确无害标记，未编辑、构建或部署项目。客户端与独立 CLI 此前均更新，未隔离同期后端变化，不能统一归因。不同 ID／API 的 CLI 报 Invalid task ID，也不证明原任务不存在；读取、续接、产出须分别核实。**[社区：故障与恢复报告]**
- [Nigel999 的社区原帖及支持回复](https://community.openai.com/t/dot-repeatedly-reports-progress-but-fails-to-complete-tasks-or-clearly-disclose-that-work-has-stopped/1402528)：用户收到进度但未完成，后确认无活动任务；支持要求核 app／系统版本、Activity、审批和阻塞，未确认根因或修复。这是另一作者的状态问题，非 #51610 独立复现或失败率样本。**[社区]**

来源限定 ChatGPT dot／Codex 委派，不混入同名产品或通用 Agent。20 §5 已区分结果完成／送达／收集／验证；本节补输入接受与实际处理的区别。**[研究]**

### 固定源码旁证与不能外推的边界

公开 GitHub API 本轮返回 main SHA `160b2b1ef62114eeb41e41e5e3be0000d944b713`；按该提交文件树核对以下内容，未由旧路径或搜索摘要推断。

- [turn_input.rs L1–13](https://github.com/openai/codex/blob/160b2b1ef62114eeb41e41e5e3be0000d944b713/codex-rs/core/src/session/turn_input.rs#L1-L13)说明 reply 只等 start／steer／reject 决策，不等 hooks、模型上下文、rollout 持久化或 sampling；[L799–890](https://github.com/openai/codex/blob/160b2b1ef62114eeb41e41e5e3be0000d944b713/codex-rs/core/src/session/turn_input.rs#L799-L890)检查活动轮次及 expected ID，输入入 pending queue 后返回活动／根轮次 ID。未核全部持久化路径，不能据此断言输入必丢或队列纯内存。**[一手：固定源码]**
- [协议 turn.rs L317–352](https://github.com/openai/codex/blob/160b2b1ef62114eeb41e41e5e3be0000d944b713/codex-rs/app-server-protocol/src/protocol/v2/turn.rs#L317-L352)仅返回 turn ID；[测试 L294–358](https://github.com/openai/codex/blob/160b2b1ef62114eeb41e41e5e3be0000d944b713/codex-rs/app-server/tests/suite/v2/turn_steer.rs#L294-L358)先验回执，再等对应 client ID 的 UserMessage，最后等 turn/completed，与[公开 App Server 契约](https://learn.chatgpt.com/docs/app-server#steer-an-active-turn)一致。接受回执和后续事件分开，但这不是 dot 云协调器的实现或版本绑定证据。**[一手：测试定义，未运行]**

[#40805](https://github.com/openai/codex/issues/40805)记录旧版 sampling 持续时 steer 接受与消息生命周期延迟，另一作者用 OpenClaw 复现并贴个人 fork 修补、测试结果。仅为 Codex 历史机制旁证；未核 fork 与当前产品的合入关系，不能当官方发布修复、dot 恢复验证或推荐“升级即修复”。**[社区]**

### 采用、反证与后续验证

✅ 先查原任务执行记录；工具未返回时不重复催促。恢复后核最新目标和取消要求；输入已处理则查理解、阻塞或验收。原生消费状态／替换入口够用就不另建回执文档。**[经验：采用与撤回]**

待另行授权：让只读工具有界延迟，发一次 steer，记录接受、可见、首结果、验收及取消／恢复后的重复。未创建排程、访问私人日志／电脑或运行上游／模型；仍缺云协调源码、线上版本绑定及端到端成功率。**[研究：预注册与范围]**


## dot 效率选择：少一层包装，不等于少一项验收

主线：二，兼四；按实际能力选择查询、接续与发布路线。
改变的建议：Codex 页增加 dot 长时使用入口，20 增补差异发布与断点恢复；不加模板或新模块。
新证据：2026-10-15 核对 dot 官方能力更新、公开接续恢复链、GitHub tree／ref 契约；本仓发布路径观察与效率推断分开。**[一手／社区／经验]**

### 查询与接续：保留有作用的中间层

[电脑与应用](https://learn.chatgpt.com/docs/dots/computers-and-apps)将插件访问限定于账号、权限和环境；[10 月 9 日更新](https://learn.chatgpt.com/docs/whats-new/dots-october-9-2026)包含已有 Codex thread 的使用、续接改进；[任务说明](https://learn.chatgpt.com/docs/dots/tasks-and-memory#assigned-work)规定新任务上下文与原环境边界。因此能力足够时不重复包装，但仍保留必要委派、遵守宿主路线，也不保证插件更快。**[一手；经验：采用判断]**

[#51797](https://github.com/openai/codex/issues/51797)称插件足够仍创建包装任务，核实时 open，无修复或效率对照。反例[#49729](https://github.com/openai/codex/issues/49729)已读正文和全部 56 条评论，须合看失败与恢复：**[社区]**

- [10 月 9 日修复说法](https://github.com/openai/codex/issues/49729#issuecomment-6080124963)与[Ubuntu 版本补充](https://github.com/openai/codex/issues/49729#issuecomment-6081558731)只覆盖作者报告，不能外推跨平台恢复
- [10 月 12 日 macOS](https://github.com/openai/codex/issues/49729#issuecomment-6127397704)与[Windows](https://github.com/openai/codex/issues/49729#issuecomment-6130573116)报告父路线失败而 helper 提供了读取／续接能力；后者包含目标回应与回读，说明中间任务有时确有必要
- [10 月 13 日 Windows 恢复](https://github.com/openai/codex/issues/49729#issuecomment-6148306271)在原始直读失败后，用已有执行器读取同一目标成功，无需替代任务或改权限；它不证明父路线修复或发送成功
- [另一 Windows 报告](https://github.com/openai/codex/issues/49729#issuecomment-6153744906)只有发送接受、未见所需回应，不能记为成功接续

✅ 先核原任务和已有授权执行器能否续接，不由读取失败推断任务丢失；需要独立判断时保留新上下文评审。插件漏字段、分页不全、版本不明或不能续接，就撤回“入口足够”的判断。未测耗时、token、费用或正确率，也未访问私人任务，不能承诺效率提升。**[经验：采用与撤回条件]**

### 发布：一般建议与本仓观察分开

[GitHub tree 契约](https://docs.github.com/en/rest/git/trees#create-a-tree)允许基于 `base_tree` 写多项变更；未传基树会让未列文件从新提交消失。随后仍需 commit 与 ref，[非强制 ref 更新](https://docs.github.com/en/rest/git/refs#update-a-reference)检查 fast-forward。读树递归限制不是写树文件上限，不能据此规定每批 20 文件。**[一手：2026-10-15 核对]**

本仓当时连接器可用，shell Git dry-run 却缺用户名认证，不能把连接器授权当 shell 凭据。[276babc](https://github.com/dbvv1/a1dbv/commit/276babc)复用 64 个最终 blob，经过四次建树、四个 commit 和最终非强制 ref 更新；逐文件核最终树、14 阶段离线通过。仅证明路径可行，不证明次数最优或模型效率。**[经验：操作记录]**

✅ 优先 commit 后 push；连接器 fallback 只传相对最新 main 的差异，允许时一批，遇上限或失败再拆。结果未知先对账远端与回执，再续未完成步骤；基线变化则重算冲突。不为省调用跳过验收、授权、分支保护或发布后核对。本轮仅文档及既有操作，未新增发布、认证、模型或客户端实验。**[经验：工程建议与范围]**


## 增量验证：已有回归测试是否真的被选中

[阅读本节](2026-10-12-development-feedback.md#s854)

### 原生能力与反证

[阅读本节](2026-10-12-development-feedback.md#s860)

### 采用范围与退回条件

[阅读本节](2026-10-12-development-feedback.md#s868)

### 原生失效判断：撤掉在选择器之前重放旧结果的缓存

[阅读本节](2026-10-12-development-feedback.md#s877)

### 新增选测能力：先比较改动类型与完整运行成本

[阅读本节](2026-10-12-development-feedback.md#s890)

## dot 持续责任起步：先校准产物再扩大范围

主线：二，兼四；选择什么时候把单次工作扩大为持续责任。
改变的建议：Codex 的 Dots 段新增首轮实际产物校准；目的端验收与送达状态沿用既有专题，不包装成 dot 特有机制。
新证据：官方使用指南、两个不同作者的业务工作原文；2026-10-15 UTC 核验，未复现实验。**[一手／社区／研究]**

### 官方推荐与实际工作分开看

[官方使用指南](https://learn.chatgpt.com/docs/dots#work-with-your-dot)建议从常查或更新的责任开始，给材料、审首轮、纠正细节后再扩大；软件反馈、发布材料和研究只是示例，非成功率。[任务说明](https://learn.chatgpt.com/docs/dots/tasks-and-memory#recurring-tasks)另要求排程明确时区、适用结束日期、通知条件与目的地，并确认保存；连接来源不建立监听。**[一手：当前文档]**

- **产物与目的端仍有差异。** [Diana 的网页任务](https://www.aiagentslibrary.com/blog/openai-dots-review/#test-4-heading)给移动适配、网格、演示标识、发布链接及禁止覆写／付费／编造的边界；自报获得 Sites 私有页并附截图，品牌仍需校准，未发到其 WordPress。[同次表格任务](https://www.aiagentslibrary.com/blog/openai-dots-review/#test-9-heading)自报 27 项公式通过，导入 Sheets 仍不兼容。两者支持先验实际产物，不能只凭聊天确认或生成侧检查。**[社区：自报及公开截图、过程，未独立运行]**
- **站点工作完成，持续报告尚未完成。** [Mark Nguyen 的代理公司记录](https://www.theslidefactory.com/post/openai-dots-review)称接浏览器数据与托管 MCP 后爬完两站 44 页、111 页；日更只配置、未运行或送达，Google API 导入未通，也未声称 SEO 改善。**[社区：自报，无客户数据或独立复测]**
- **一次送达不保证持续可靠。** [Diana 的排程记录](https://www.aiagentslibrary.com/blog/openai-dots-review/#test-10-heading)称官方更新监控按时送到手机，但测试仅两天、只观察一次。它比“已保存”多结果证据，仍非多周可靠性。**[社区：单次自报]**

只读作者原文，网页任务经云浏览器回读，未访问私有产物／数据。Diana 有培训／Skills 商业背景且披露无 OpenAI 赞助；Mark 也非受控评测。不同任务不合并成成功率或排名。**[研究]**

### 增量与撤回条件

✅ 扩大持续责任前，先验一轮产物内容、位置和可用性；已有同任务合格样本可复用，无需增加审批层。**[经验]**

目标环境中的验收已由既有导出／消费者检查覆盖；完成、送达、收集、验证沿用 [20 §5](../20-codex-long-horizon.md#5-子任务应缩短关键路径不应制造评审树)，不另写 dot 通用检查表。当前材料没有多周持续运行、净节省主动工时或费用的可比记录；若首轮已匹配而扩大仍反复失败，应缩回具体来源／操作诊断，不能仅继续校准措辞。**[研究：不重复与反证范围]**


## OCRmyPDF：兼容修复按输入机制分流

[阅读本节](2026-10-12-development-maintenance.md#s930)

## 退役实现选择器：保留独立禁用能力

[阅读本节](2026-10-12-development-maintenance.md#s947)

## 配置迁移：保留作用阶段与设备边界

[阅读本节](2026-10-12-development-maintenance.md#s959)

### Ruff：个人覆盖可合并，但文件替代仍可能失去同步

[阅读本节](2026-10-12-development-maintenance.md#s963)

### Firefox：依赖本机OS的偏好，收窄到单项停止同步

[阅读本节](2026-10-12-development-maintenance.md#s971)

### 反向约束：共同产物仍须一致

[阅读本节](2026-10-12-development-maintenance.md#s979)

## 原生下拉菜单的截图与语义验收

[阅读本节](2026-10-12-development-feedback.md#s986)

## rclone：预演不能替下一轮提交控制状态

[阅读本节](2026-10-12-development-maintenance.md#s996)

## 清 lint：保留异步调用契约，还是删除 async

[阅读本节](2026-10-12-development-maintenance.md#s1017)

## 委派失败被转换为空成功：父任务已经收集也可能误判

主线：二，兼三／四；沿用 20 §5 的子任务完成责任，不新增流程。
改变的建议：空成功结果出现时，先查宿主是否丢失错误与结束原因；确认缺陷后修交接层、保留原来的子任务身份，不靠换 worker、重复派发或放宽消费者验收掩盖它。
新证据：OpenCode 公开故障、已发行的窄修复、下游控制复核及 V2 未合入补丁。核实：2026-10-16 UTC；只读源码与公开报告，未运行模型、客户端或上游测试。**[一手／社区；经验：采用判断]**

1. **成功状态可能失真。** [OpenCode #42725](https://github.com/anomalyco/opencode/issues/42725)报告 1.18.18 的 assistant 子消息已有 `info.error`，`TaskTool.runTask` 却只取末尾 text、缺失返空串，父任务收到 `completed` 空结果。应查转换层，不能归因所有空结果或评价 worker 模型能力。**[社区：原报告；研究：范围]**

2. **V1 已发行窄修复。** [#43657](https://github.com/anomalyco/opencode/pull/43657)于 2026-08-21 合入 `c313504c824cf2103a4e703d994d1914d84fc8b7`；[固定实现](https://github.com/anomalyco/opencode/blob/c313504c824cf2103a4e703d994d1914d84fc8b7/packages/opencode/src/tool/task.ts#L200-L224)先查 assistant error，返回含原错误及可续接 `task_id` 的失败；[固定回归](https://github.com/anomalyco/opencode/blob/c313504c824cf2103a4e703d994d1914d84fc8b7/packages/opencode/test/tool/task.test.ts#L266-L307)用空文本与模拟 APIError 断言失败及 child ID。[v1.18.20](https://github.com/anomalyco/opencode/releases/tag/v1.18.20)列修复，已核 tag 的 `task.ts` 分支。正常路径仍可无文本，不能一律判为 provider 错误；这里只核源码、测试定义与发行，未独立运行。**[一手]**

3. **下游拦截无法找回丢失错误。** [Gentle AI #3318 的控制复核](https://github.com/Gentleman-Programming/gentle-ai/issues/3318#issuecomment-5647411885)以 OpenCode 1.18.18、真实 host 和临时 localhost provider 复核：有效文本通过、格式错误被识别，合法无文本与 HTTP 400 在插件边界却同为 empty。SDD 消费者拒绝空结果合理，放宽验收修不好宿主。后因[SDD 被移除](https://github.com/Gentleman-Programming/gentle-ai/issues/3318#issuecomment-5836427200)关闭 issue，不是修复回执或现行 SDD 推荐；也非原用户 v1.18.20 真实模型复测，不能统一全部原始故障根因。**[社区：消费者报告与状态；研究：边界]**

4. **旧修复不覆盖全部结束形态或新架构。** [V2 #52378](https://github.com/anomalyco/opencode/issues/52378)报告 `finish: error`／`MALFORMED_FUNCTION_CALL` 缺 error 对象时仍成为 completed；[固定旧 runner](https://github.com/anomalyco/opencode/blob/f46fa72a9285a0e8479e25d400f7026bfd8fe5c8/packages/core/src/session/runner/step.ts#L161-L177)只为 unknown 合成失败。[#54713](https://github.com/anomalyco/opencode/pull/54713)核实时 open、未合入，head `4b1fedc63011a3ce58b33f1036e19e99c16bf56a` 将 explicit error 转为失败并保留 rawFinish，[当前测试](https://github.com/anomalyco/opencode/blob/4b1fedc63011a3ce58b33f1036e19e99c16bf56a/packages/core/test/tool-subagent.test.ts#L298-L354)检查前台工具失败与后台父通知 error。empty-stop control 已被后续修订删除，length 截断明确排除。缺原用户最终复测，候选补丁或自动评审运行说法不能当作已发行、线上全面恢复。**[一手：源码与修订状态；社区：报告]**

只对缺产物却成功的委派，先核错误是否完整跨界再选续接、换实现或重派；错误已传递就查实际原因。原生传播够用则不加包装，材料不证明弱模型替代或长程可靠性收益。**[经验]**

## 云端协调与本地执行：同机不等于同一Hook契约

核实：2026-10-16（UTC+8）。M4；改变Codex页长时运行入口：先核协调与执行，再决定能否沿用本地Hook；不以Cloud标签直接推断工具在云容器。[研究]

[一手] [dot电脑与应用](https://learn.chatgpt.com/docs/dots/computers-and-apps#connect-your-computer)允许云端管理任务并使用已连接电脑的文件、工具，仍需连接且电脑在线。[任务说明](https://learn.chatgpt.com/docs/dots/tasks-and-memory)区分新建本地 Work／Codex、续接本地 Codex 和使用已配置云环境；切电脑不迁移旧任务。契约不保证任意入口读取具体会话，一次未找到目标不证明电脑无权访问或任务不存在。

[一手] [Work Cloud与dots本地访问说明](https://learn.chatgpt.com/docs/enterprise/cloud-local-access#check-hooks-and-network-compatibility)区分云协调／本地执行与 local-only：前者不支持 command／shell、prompt、agent 处理器及本地配置、插件、目录 Hook，后者保留既有支持。企业远程 MCP Hook 需托管设置，个人账户不可用。同机不代表配置等价，Work 切换规则也不外推全部 Codex 任务；完整支持范围见源页。

[研究] 核实环境、任务类型和所需 Hook 的支持范围，再用最小允许动作验证；够用的本地流程先复用，不依赖这些 Hook 就不必全部切 Local。只读官方文档，无私人会话、设备日志或个案路径；未复现客户端、Hook、网络故障，不证明所有账户和版本的路由、续接或运行效果。


## Claude 转云输入：创建成功不等于输入齐全或成果可取回

主线：三／四，M3；核实：2026-10-16（UTC+8）。
改变的建议：CLI 转云先核实际输入来源、允许上传范围与成果取回路径，不凭任务链接判定交接完成。
新证据：当前官方传输契约与 2.1.228、2.1.282–284 等历史公开反例；没有当前客户端实测或固定客户端实现证明。**[一手／社区；研究]**

**当前契约。** [云任务说明](https://code.claude.com/docs/en/claude-code-on-the-web#move-tasks-between-terminal-and-cloud)区分新建与续接：`--cloud` 任务描述不迁移终端对话。[本地仓库打包说明](https://code.claude.com/docs/en/claude-code-on-the-web#send-local-repositories-without-github)说明无 remote 或相应 GitHub App 未安装时上传本地 bundle，`/web-setup` 不排除此路径。完整克隆可带所有分支历史和已跟踪脏修改，不含未跟踪文件；过大时可退为当前分支或压平快照。macOS／Linux／WSL 仅排除部分敏感文件名与 Git filter 文件的未提交修改，原生 Windows 无同样排除，已提交历史不因此脱敏。先审上传范围，不默认暂存全部文件补输入。**[一手；研究：操作边界]**

**历史反例。** [#86268](https://github.com/anthropics/claude-code/issues/86268)的 2.1.228/macOS 报告本地领先提交、已跟踪脏修改进入云端，未跟踪文件缺失；因无活动关闭，非修复回执。[#81776](https://github.com/anthropics/claude-code/issues/81776)后续含 2.1.282–284 网页 GitHub 入口可用而 CLI 打包、云端无 remote／推送失败、teleport 未取回提交，以及不同预检和绕行结果。连接正常不证明远端克隆；历史报告不代表全部当前版本，评论开关也非受支持方案。**[社区：原帖与评论；研究：范围]**

**采用与撤回。** 转云前核所需文件、版本和允许上传范围，启动后即在目标核提交、输入、remote 及授权取回路径。可能打包内容未全获准时，先停下查清路径。只需跨设备继续本地工作可用[Remote Control](https://code.claude.com/docs/en/remote-control#remote-control-vs-cloud-sessions)，但原机器和进程仍须在线；它不替代离线云执行，也不代表零对话数据传输。原生交接够用时不另造同步器。**[一手；经验：选择]**

只读文档及原帖，未上传仓库、运行客户端／模型或检查私人数据；未验当前账号分流、过滤与恢复，历史反例不作当前失败率或整页 L3 依据。**[研究]**


## 依赖解析修复：排除坏组合，同时保留支持面

[阅读本节](2026-10-12-development-maintenance.md#s1078)

## 原生替换：请求取消之后消费者能否继续

[阅读本节](2026-10-12-development-maintenance.md#s1092)

## 数据库默认值：写出字段不等于写对值

[阅读本节](2026-10-12-development-feedback.md#s1104)

### API修改：声明差异、消费者契约与真实集成

[阅读本节](2026-10-12-development-feedback.md#s1114)

### 无障碍反馈：扫描当前状态与保留必要检查

[阅读本节](2026-10-12-development-feedback.md#s1128)

## 连续业务功能：项目提议（2026-10-20）

以下保留完整验收；P25已交部分资料，P26已交两轮改动设计，P27仍为提议。目标是让Agent接续真实应用的已存在状态，交逐文件改动设计与消费者判据；不是复述“后端校验”。不得用资料验收冒称数据库、邮件、签署、移动端或模型通过。[研究：资料状态]

两固定应用均为AGPLv3，见[Documenso许可](https://github.com/documenso/documenso/blob/573c928a0e647efc8c41e3e12909c918c2104430/LICENSE)与[Immich许可](https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/LICENSE)。本项目分析机制与变更设计、不复制分发应用代码；复用实现另遵许可，不据公开仓库推定任意商用方式。[一手／研究]

### P25：代填角色到并行审批组

为控制分册体积，具体采用／撤回、同一旧状态及跨入口判据移至[反馈与验证](2026-10-12-development-feedback.md#p25代填角色到并行审批组)。当前为部分资料阶段，未证明真实优化效果；P26／P27原记录保留。 完整验收仍按[固定原提议](https://github.com/dbvv1/a1dbv/blob/55c910a144530fb9df1efaf9296c74d7659d8bc3/docs/research/2026-10-12-development-conditions.md#p25代填角色到并行审批组)：两维护节点相关完整差异、真实旧流程跨入口及连续状态／完成／通知产物均须交付，部分稿不替代原要求。

### P26：单人标注扩成多人协作

**✅ Agent先保旧标注与原图权限，再分别设计聚类、定向编辑和双端读取；不默认reset，也不把Only me当永久私人覆盖。** 少量照片用相册；以下仅改动设计，未运行。[研究；核实2026-10-20]

[Partner sharing](https://docs.immich.app/features/partner-sharing/)涉及整库与照片元数据，不含人物识别数据；不为人物页扩原图权限。聚类／共享增加映射、传播与双端维护；永久覆盖需新状态／写优先级。无净省时实测。[一手／研究]

**固定最终实现。** S为Immich v3.3.0 `e3b165609135365302e40a43d94967fdbb2e6888`。[PR30739](https://github.com/immich-app/immich/pull/30739)引入聚类组；[PR31620](https://github.com/immich-app/immich/pull/31620)引入人物分享，早期PR非S的跨组拒绝／Only me契约。另核[v3.3.3](https://github.com/immich-app/immich/releases/tag/v3.3.3)update、mergePeople、updateForWritableOwners、reassignCluster方法体相同，非整树证明。[一手：源码核对]

[v3.2讨论](https://github.com/immich-app/immich/discussions/31408)解释完整重聚类可能损失命名／生日，有因此拒用反馈，非入组必重置。[v3.3讨论](https://github.com/immich-app/immich/discussions/32193)仅在Web提供管理入口；[32196](https://github.com/immich-app/immich/discussions/32196)中用户报告保留3.2.4的人工合并，升级3.3双向分享后Web与Android数量一致，维护者也明确不必reset。单人自述非无损保证。[一手／社区]

#### R1：继承旧人工劳动，加入已有组

**沿用虚构夹具，不重seed。** 初态G={A}、H={B,C}。A的pA、B独占pB各已命名并人工合并两张脸；B/C共用pBC但各有不同姓名。五资产：A私有a0／相册分享B的a1，B私有b0／相册分享A的b1，C私有c0；五资产均未删且可入timeline，所列faces可见。a0/a1各有pA脸，b0/b1各有pB脸；b0另有pBC脸，c0有pBC脸。照片可见集合固定为A={a0,a1,b1}、B={b0,b1,a1}、C={c0}，不设partner整库授权。[研究：预注册夹具]

**不可只改user.clusterGroupId。** [组服务][p26-cluster]→[person仓储][p26-person]：

| 操作与层 | 源码推导的应有结果／改动约束 |
|---|---|
| A邀请B | 待邀请B可读成员但未入组；重复创建保同请求，不代表后续幂等 |
| B接受 | G={A,B}、H={C}；独占pB移到G且ID保留；共享pBC为B分出新pBnew，只迁B的person行与B自有资产faces，C仍用pBC |
| 旧劳动 | 姓名／生日与人工face关联保留；pA/pB不自动合并或复制给A；照片集合不扩大 |
| Web | 刷新用户／组／邀请；people仍要求自己的person行及可见照片 |
| mobile | PersonV1同步自己的person；AssetFaceV3组内face≠照片授权；DAO连接可见remoteAsset后进入timeline |

消费者见[Web设置][p26-webgroup]、[同步][p26-sync]、[mobile DAO][p26-dao]与[timeline][p26-timeline]。只改成员不迁person/face，可使设置页成功、人物页失联；删可见性连接则误授原图，均退回。[一手：源码；研究：坏候选]

**接受不是外层原子事务。** reassignCluster有事务，服务层重分组→更新user→删邀请却无总事务；成功后重放因请求已删而失败。每步中断须读回person/face/组/邀请，不盲重试。cluster-group medium覆盖移动／拆分与权限，未运行、不证明动态同步。[一手／研究]

#### R2：在R1结果上加定向共享与第二次修改

**先加A→B Write(pA)，不合并旧pB／pBnew。** [person-user表／复合外键][p26-share]以(group,sharedBy,sharedWith)分方向；[插入触发器][p26-functions]为接收者建copy，只填空姓名／生日，保已有非空值。person按(owner,group)存属性，无永久覆盖标志。pA对应a0/a1：B只见a1、统计1，A统计2；b0/b1仍属pB。[一手；研究：继承夹具预期]

**传播给授权调用者写的人。** [PersonService.update][p26-service]未传userId才向“授权调用者Write/Admin的分享者”传播。[Web Only me][p26-only]显式发送自己的userId，只控制本次范围。下表“默认”仅指API省略userId；UI未选Everyone偏好时默认Only me，不能混称。[一手]

| 连续操作 | 应改变的行／保留状态 |
|---|---|
| B默认改名N | A/pA与B/pA；A默认改名M则只改A/pA，单向边不自动变双向 |
| A Only me改P，之后B默认改Q | P先只写A，随后A/B均为Q；不能承诺P永久受保护 |
| 再建B→A Write | A默认更新才也传播至B；favorite、hidden、color、feature face仍为各人私有，跨人写这些字段拒绝 |
| A→B降为Read | B只可改自己的copy，不能显式改A |
| A撤A→B | B copy保留；B→A若在，A仍可改B；原图授权不变 |
| 重复share／给仍在H的C分享 | 重复边更新role，不抹旧copy；跨组整次拒绝，不偷偷入组 |

**合并success不代表所有owner完成。** mergePeople以首个有权限ID为target；非调用者两边姓名或生日均非空就跳过，值相同也跳过。接受时只补空值、按owner迁face／删source。继续同一夹具，先由B将pB、pBnew分别分享给A，生成A的两行具名copy，再让A按[pA,pB]、[pA,pBnew]两次合并，始终以pA为target；没有这两步时A缺源person行，不能验成成功。逐人保账本：A成功而B保多个具名group是合法分歧。旧source重放不保证成功，未知先读回。[一手：服务源码；研究]

**撤分享和离组不是同一动作。** 沿同一夹具重新建立双向Write、共同p后，B离组将自己的person/自有faces UPDATE到q；分享者外键使B→A移q，A→B留p。person_delete_shares只挂AfterDelete，不清此UPDATE。普通getPerson因缺自己的旧行拒绝，默认传播因p/q分开改变；[PersonAccess][p26-access]及显式userId写却仍按残边判断。非UI正常或漏洞复现证据。要求离组即撤编辑权，须明确撤分享／补清理并验接口与缓存，页消失不是撤权证明。[一手／研究，未运行]

**双端验收必须比同一资产ID集合。** mobile `_personAssetFilter`将可见face与“自己／timeline partner或本地相册”的未删可见资产相交，bucket/list同条件；无可见照片可不列人物。坏候选是服务端全绿、mobile仍只筛owner==自己：旧去重／排序测试可绿，B却缺合法a1；修消费者，不开整库补洞。[一手：timeline、person仓储；研究]

#### 可交给Agent的改动与退出门

**Agent做跨层盘点、映射、断言和窄补丁，人定共享语义。** AI完成比例未知；瓶颈是部分成功、重映射后的授权／同步和冲突取舍。[研究]

已读[服务medium][p26-tests]传播／目标／私有字段／跨组／删指定pair，以及[仓储medium][p26-repotests]保非空copy／删除person清入边；不是离组UPDATE回归。mobile只验去重／排序，缺分享、撤回与动态同步。均未运行。[一手]

下一授权实验不重seed：按两表核连续写／撤／合并／重放；离组后读回p/q边、普通读／显式写、Web已开modal、mobile同步前后ID／bucket／统计，原图ACL不变。关键语义未知就保个人整理／有限相册，不承诺永久覆盖或离组即撤权。本轮无SQL、应用、模型、移动同步或hosted CI；运行结论未知，不以资料验收冒充通过。[研究]

[p26-cluster]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/src/services/cluster-group.service.ts
[p26-person]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/src/repositories/person.repository.ts
[p26-webgroup]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/web/src/routes/(user)/user-settings/SharingSettings.svelte
[p26-sync]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/src/repositories/sync.repository.ts
[p26-dao]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/mobile/lib/data/db/main/dao/person.dart
[p26-timeline]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/mobile/lib/infrastructure/repositories/timeline.repository.dart
[p26-share]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/src/schema/tables/person-user.table.ts
[p26-functions]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/src/schema/functions.ts
[p26-service]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/src/services/person.service.ts
[p26-only]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/web/src/lib/modals/PersonEditModal.svelte
[p26-access]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/src/repositories/access.repository.ts
[p26-tests]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/test/medium/specs/services/person.service.spec.ts
[p26-repotests]: https://github.com/immich-app/immich/blob/e3b165609135365302e40a43d94967fdbb2e6888/server/test/medium/specs/repositories/person-user.repository.spec.ts

### P27：发送中改稿与在途恢复

**拟改15§3／18：Agent先继承原活动、内容版本和收件人集合，不克隆整场重发；未知结果先对账。** 人决定已收旧稿者是否补发、失败／重复代价；只改未开始活动就用原生编辑，不引入在途系统。[研究：提议dot-A，1–3天范围，未执行]

listmonk [#2014真实需求](https://github.com/knadh/listmonk/issues/2014)→[#2264暂停后可编辑](https://github.com/knadh/listmonk/pull/2264)，后有[#3022重启漏发／疑似重复回执](https://github.com/knadh/listmonk/issues/3022)及[10月16日检查点修复](https://github.com/knadh/listmonk/commit/a729a4a6d635dabb75fa0ec53df25eec2e6f2285)。[PR2974](https://github.com/knadh/listmonk/pull/2974)作者自报生产成功却被维护者因破坏性问题拒绝，不能据吞吐报告采用。稳定v6.2.0早于该修复；固定开发树不是生产推荐或已发行保证。源码为AGPL-3，仅分析不复制应用。[一手／社区；10-20核]

**R1产物**：固定历史与开发树，交UI/API→状态→预渲染→队列→发送的逐文件变更图和同一活动C1、V1→V2账本；逐人分未开始、在途、供应商确认、失败、unknown。暂停不是撤回已发，改稿不能把unknown偷偷归未发；至少八条具名断言保身份、pending、非法状态、停止边界、内容／附件和撤排期。当前UI已迁SSR，不能套历史Vue路径。[研究：验收要求]

**R2继承R1账本**，交低ID慢／高ID快、Push成功未落盘、回执丢失、DB结果未知、限速中取消及编辑后重启的差异账本／判定器。核manager／pipe／store与campaigns SQL，逐人比内容哈希、attempt和结果，不以sent=N验收。修复里的processed可包括发送／渲染失败；周期落盘与外部Push非原子，不称“只推进成功发送”或exactly-once。现有生命周期E2E只验status，新增集合断言必须实际设计。[一手／研究]

比较原生继续、[Resend有24小时窗口的幂等](https://resend.com/docs/dashboard/emails/idempotency-keys)和自建durable ledger：后两者增加身份／窗口、迁移／保留与对账责任，均不自动决定旧稿该不该补发。另核原生header接入，不能凭供应商功能说已集成。[官方权限](https://listmonk.app/docs/roles-and-permissions/)将send与manage分开，保仅编辑者不能发信的断言。[一手／研究]

两轮文件／账本／坏候选和同场景取舍实际交出才算资料验收；只剩通用重试卡则撤项。没有DB／邮件／模型运行，不承诺无漏发；若必须实测才能决定，保未完成。隔离运行与真实外发均不在本项目现行授权内，不取真实名单或邮箱。[研究：范围与撤回]
