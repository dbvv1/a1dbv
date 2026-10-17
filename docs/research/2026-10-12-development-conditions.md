主线：二，兼三／四
改变的建议：先区分缺事实、运行反馈、访问能力还是决策，再补最小条件；续改成对验“有意改变／仍须保留”的行为，迁移另验持久状态、旧读取者与真实维护入口；浏览器保存与故障注入按响应来源选验收入口，稳定截图不介入待验动画状态；游戏移植分数按证据条件解读；重复迁移按语法／类型覆盖与重跑边界选择工具；增量验证先核已有消费者测试是否被选中；兼容修复按输入机制收窄，不默认升级或全局关闭；配置迁移保留编辑／交付阶段及设备边界；清 lint 先核异步调用契约，允许有依据的窄范围豁免。[经验／研究]
新证据：原研究证据汇总（日期见各节，非本次编辑新增）；按下列入口区分证据，具体来源、核实日期、固定版本与验证范围留在各节；这些材料支持条件选择，未证明模型或 Skill 净收益。[一手／社区／研究／经验]

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

**验证口径。** 只读契约、固定源码与未运行测试定义，不构成模型／OS 实测或安全认证。历史独立评审覆盖 10 全页与 03／05／08 一致性，处理上述问题后判 L3；14/14 离线与 `git diff --check` 通过，仅验证仓库文档／配置和确定性测试。

### 陌生依赖：安装后仍须隔离测试

此前页头的历史核实范围保留如下：核实时间：2026-10-08；2026-10-14 补核外来仓库的脚本启动与配置来源边界；2026-10-15（UTC+8）补核 Codex 文件排除的生效条件及 Claude Code 沙箱的版本、socket 与凭证默认边界。

核实：2026-10-17（UTC+8）。收窄 [10 案例二及个人清单](../10-security.md)的“跳过安装脚本，或者在容器里装”：陌生 PR／Agent 新引入的未审依赖，其安装、测试与构建都留在无秘密、受限挂载及网络的独立环境。容器限定与前节既有结论一致；新增证据是安装选项不能阻止后续显式运行脚本。不要求已可信项目另建平台。**[研究：采用判断与查重范围]**

**安装成功不是执行授权。** [npm v11 `ignore-scripts`](https://docs.npmjs.com/cli/v11/commands/npm-ci/#ignore-scripts)页面标为 11.21.0（Legacy）；[v12 同段](https://docs.npmjs.com/cli/v12/commands/npm-ci/#ignore-scripts)标为 12.2.0（Latest）。两者都明确：该选项生效时，显式 `npm test`／`npm run` 仍执行目标脚本，只跳过其 pre／post 脚本。一次 `npm ci --ignore-scripts` 也不会替后续独立命令持久设置此选项。[`npm run`](https://docs.npmjs.com/cli/v11/commands/npm-run/#description)会将 `node_modules/.bin` 加入 PATH；测试／构建仍可执行依赖代码。v12 的安装脚本准入默认与 v11 有别，但都不能把安装期准入当作后续执行隔离。**[一手：版本化官方契约；研究：执行边界]**

**锁定内容仍要判断来源。** `npm ci` 按已有锁文件安装，manifest 与锁文件不符时失败，不替你更新二者；[锁文件](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/)记录依赖树、来源与完整性值。这支持重现和内容一致性，不能证明锁定代码可信，陌生变更须连同锁文件一起审。[Node.js 官方安全指南](https://nodejs.org/learn/getting-started/security-best-practices#malicious-third-party-modules-cwe-1357)说明运行期恶意依赖仍是风险；[Docker 官方边界](https://docs.docker.com/engine/security/#docker-daemon-attack-surface)说明宿主挂载与 daemon 控制权限可暴露宿主，故“用了容器”不足以确认隔离。若功能确需被跳过的安装脚本，先审所需脚本，再在原隔离环境中允许；不为跑通撤掉边界。**[一手：机制；经验：采用／撤回]**

仅阅读公开文档，未安装依赖、运行 npm／容器／测试或攻击载荷，未检查私人配置；不构成运行时安全认证。**[研究：验证范围]**

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

### 官方交互浏览器 Skill：值得借什么，不能照搬什么

固定版本的 `playwright-interactive` 复用 REPL 与浏览器句柄；区分 renderer reload 与主进程 relaunch；功能验收要求实际用户输入，`evaluate` 可检查或准备状态，但不能充当验收输入；视觉检查与功能检查独立。普通 CLI Skill 则强调 DOM 明显变化后重新 snapshot，避免沿用失效元素引用。**[一手：S1 指定段落]**

机制针对重复启动和沿旧状态推理，未测提速；复用会话可携带缓存、登录和脏数据，首次访问仍用干净上下文。

该 interactive 快照要求关闭沙箱并给安装命令，本轮均未执行，也未验兼容性；只借观察／动作设计，优先当前受支持入口。**[一手：S1；经验：采用范围]**

### 交互界面：按缺失观察选择反馈

核实：2026-10-14 UTC。改变 23 §2/§4：选择能区分当前假设的反馈；视觉要求保留截图验收，语义与时序问题先复用已有真实输入测试及状态/事件证据。证据范围见表后。**[经验：采用判断]**

| 比较及固定来源 | 实际条件与观察 | 能改变的选择；不能推出什么 |
|---|---|---|
| [Design2Code v2，§3.1、表3](https://arxiv.org/html/2403.03163v2) | HARD 为80页；self-revision 接收 text-augmented 初稿代码、初稿渲染图和目标图。GPT-4o 的 Block/Position 为67.7/77.5→72.1/81.1；Claude 3.5 Sonnet 为75.1/83.4→71.9/82.6 | 截图反馈有机会修视觉偏差，但不能假定修订必升；保留前版比较。这是静态复现、旧模型与非等成本对照，不是当前交互应用成功率 |
| [Vision-Guided Iterative Refinement v1，§4.1、表1–2](https://arxiv.org/html/2604.05839v1) | 600测试任务；Sonnet 4.5 初稿→三轮的综合 VLM 分数7.584→8.048，报告 tokens 6,446→131,550。judge 对200组非平局人类偏好69.5%一致、22%不一致、8.5%平局 | 视觉＋代码 critique 可改善评分类质量，但未隔离截图贡献或给 Sonnet 做等 token 无视觉对照；不是执行完整用户任务，也不能用模型评分替用户接受体验 |
| [InteractGUI / VF-Coder v1，§5.3](https://arxiv.org/html/2604.19750v1)与[固定入口](https://github.com/leozhilin/VF_Coder/blob/10bd5e6bebb34ba6c13ee4cf93802a575d9bb701/vf_coder_main_loop.py#L55-L74) | Gemini-3-Flash / PySide6 将 GUI Operator 与错误截图反馈分开开关；[修复者代码](https://github.com/leozhilin/VF_Coder/blob/10bd5e6bebb34ba6c13ee4cf93802a575d9bb701/vf_coder/code_agent/code_agent.py#L507)仅在 visual 模式附加错误截图，目标参考图仍可独立提供 | 发现运行状态与传达视觉错误是不同增量，不能合并成“接入浏览器收益”。论文称984任务，但缺逐例结果/种子/置信区间，表4部分百分比不能按984整数通过数还原；不据此排名或宣称显著收益 |

上表是论文／固定源码证据，未独立运行；缺同一当前强 Agent、同任务等预算的四通道对照，接入取舍为工程判断。**[一手／经验]**

**具体使用边界。** 选中或保存错误若已能由真实浏览器动作与结果断言揭示，不必新增截图循环；裁切、间距、素材与画布问题则必须补足视觉观察。结果最终正确、但早期点击丢失时，补动作时刻与事件顺序。[Playwright hydration 说明](https://playwright.dev/docs/navigations#hydration)明确指出控件启用早于监听器绑定会吞掉输入，建议应用就绪前禁用控件；不能靠延后测试输入制造通过。直接设置 DOM/组件状态不等于测试真实输入。**[一手：官方机制；经验：最小反馈建议]**

入口理解、误操作恢复与体验接受仍需用户任务试用；保留原功能和视觉要求，仅为缺失判断补通道。上表未测用户参与的净收益。**[经验：采用与停止条件]**

### 截图稳定化：结束动画不是保留当前状态

核实：2026-10-16（UTC+8）。改变 23 §2：保留终态视觉基线，但不让截图准备推进待验的过渡、暂停或重开状态；局部 `allow` 只在需要保留该状态时采用。以下为官方契约、固定源码／测试定义与历史作者报告，未运行浏览器。**[经验：采用判断；研究：证据范围]**

[PageAssertions 文档](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1-option-animations)规定 `toHaveScreenshot()` 默认 `animations: disabled`，可被项目 `expect` 或单次参数覆盖；[Page 文档](https://playwright.dev/docs/api/class-page#page-screenshot-option-animations)规定 `page.screenshot()` 默认 `allow`，按调用参数生效。[v1.63.0 发行提交 `1b025d7`](https://github.com/microsoft/playwright/commit/1b025d7e20a026371cd5f98ba0cdce48892737c8)的[matcher L346–363](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright/src/matchers/toMatchSnapshot.ts#L346-L363)与[screenshotter L201–219](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/screenshotter.ts#L201-L219)印证这一差异，两个入口不只相差图片比较。**[一手：文档与固定源码]**

[固定实现 L109–155](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/screenshotter.ts#L109-L155)对有限 `endTime` 调用 `finish()`，没有复原步骤；无限动画先 `cancel()`、清理时 `play()`，不保存原位置和 `playState`。[回归 L774–835](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/tests/page/page-screenshot.spec.ts#L774-L835)要求结束过渡、触发 `transitionend`，首图已含回调新增的 `h1`；[L865–938](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/tests/page/page-screenshot.spec.ts#L865-L938)另验有限动画结束与无限动画取消事件。因此截图可能推进状态，不能独证原输入或恢复正确；局部 locator 截图也由[L224–255](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/screenshotter.ts#L224-L255)在所有 frames 准备。**[一手：源码与测试定义；研究：机制推导]**

实现跳过 `playbackRate === 0`，并非 `playState === 'paused'`；[官方回归 L838–862](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/tests/page/page-screenshot.spec.ts#L838-L862)要求速率为 0 时保持 `currentTime = 500`。仍被 `getAnimations()` 返回、速率非零的暂停动画，不能保证免于 `finish/cancel` 或恢复暂停状态。此推论不覆盖所有暂停机制，也不授权为截图改变产品暂停。**[一手：源码与测试；研究：限定推论]**

[#36899](https://github.com/microsoft/playwright/issues/36899)于 2025-08-01 报告 Playwright 1.54.2 普通截图有 Ionic sheet modal，视觉断言却没有。[原作者后续](https://github.com/microsoft/playwright/issues/36899#issuecomment-3145555849)称换序后两张都缺，改为 `toHaveScreenshot({ animations: 'allow' })` 后恢复；[维护者回复](https://github.com/microsoft/playwright/issues/36899#issuecomment-3145780160)确认默认值差异出于兼容，仍推荐自动等待的视觉断言。无限动画只是作者归因，未核 Ionic 根因或复现；它支持局部改参，不支持全局关闭或认定当前普遍缺陷。**[社区：历史回执；一手：维护者说明]**

**最小采用与撤回。** 纯终态布局继续用现有视觉基线；先完成相关真实输入、暂停后恢复或取消后重开的行为断言，再做可能推进动画的视觉比较。所需状态本已稳定却被准备动作改变时，只在该处用 `allow`。若需要观察过渡，复用动作／事件时间线，已有测试能证明命中目标阶段及其结果就不加层。`allow` 不是精确采样：普通截图仍有[字体等待 L251–264](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/screenshotter.ts#L251-L264)，视觉断言仍按[匹配／稳定化循环 L719–795](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/page.ts#L719-L795)取图，持续变化时可能超时；该版本首张直接匹配已有基线可返回，也不应概括为每次必拍两张。另据 [actionability](https://playwright.dev/docs/actionability#stable)，`locator.click()` 会等元素 bounding box 连续两帧不变，所以发起调用的时刻不等于输入发生时刻；确认真实动作命中窗口，不统一改用 `force`。**[一手：工具机制；经验：选择边界]**

验证范围：只读文档、发行源码、测试定义及原评论；未运行 Playwright、上游用例或模型，未测具体修复收益。**[研究]**

### Service Worker：响应来源决定保存与故障验收入口

核实：2026-10-15（UTC+8）。改变 23 §3/§4：服务器同步的验收增加独立读取，故障注入增加实际命中确认；本地保存不强加服务端要求。复用现有 API／浏览器测试，不增加平台或框架。**[经验：采用判断]**

Playwright [固定修复提交 `ea75b9f` 的回归 L23–98](https://github.com/microsoft/playwright/blob/ea75b9f32ca4120efdfaf8f5b8cfd292f548f197/tests/library/browsercontext-service-worker-policy.spec.ts#L23-L98)覆盖 literal、Cache Storage、network fallback 和 preload fallback；L79–92 要求当前页及同 context 新页均返回 200、来自 worker、显示 offline，而服务端请求为 0，恢复在线才变为 1。这是响应机制的测试定义，非保存缺陷实测。**[一手]**

承诺服务端同步时，刷新或新标签页不够，可用 API 读取本次记录：[APIRequestContext 实现 L350–389](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/packages/playwright-core/src/server/fetch.ts#L350-L389)用 Node HTTP/HTTPS，不经页面 worker。但服务端缓存与数据库耐久性仍须另验，不能据此保证落盘。只承诺本地保存时验本地重开，联网同步单列结果。**[一手：源码；经验：验收选择]**

[Chromium 回归 L373–434](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/library/chromium/chromium.spec.ts#L373-L434)同时收集 `page.on('request')`、context 事件与 route 命中：透明 worker 的 `/data.json` 可由 context 路由，页面同名请求虽有事件却不可路由。[后续回归 L436–538](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/library/chromium/chromium.spec.ts#L436-L538)另区分缓存、`/foo` 改写为 `/bar`、合成 200 和透传。注册页面 URL 失败规则不代表注入成功，须查实际命中与响应；必要时在 Chromium 支持范围内改到 worker 持有的网络请求。**[一手：测试定义；经验：覆盖判断]**

透明 worker 也返回 `fromServiceWorker() === true`，不能等同缓存命中或要求一律为 false；HTTP cache 也不同于 Cache Storage、合成响应。[官方说明](https://playwright.dev/docs/service-workers)把这些观测和路由能力限于 Chromium，主脚本更新仍不可路由，不能补救全部 worker 请求或 Firefox／WebKit。禁用 worker 会改变产品行为：普通 API mock 可 block，离线验收不能借此绕过。**[一手；经验：采用边界]**

[真实报告 #42775](https://github.com/microsoft/playwright/issues/42775)在 1.63.0 的 WebKit 上发现：即使 worker 直接生成响应，离线模拟也拒绝导航；停止源站的对照则能返回。它不代表两种故障等价。[修复 #42894](https://github.com/microsoft/playwright/pull/42894)于 2026-10-05 合入上述 `ea75b9f`，在 page target 初始化时显式应用已配置的 offline 状态并补回归。固定测试仍跳过 Electron／旧 WebKit，并对 Firefox 的 network/preload fallback 标 fixme。离线测试失败时应先核工具版本、模拟范围和实际请求，不能直接撤掉产品要求。未核首次正式发布版本；PR 页面仍有失败检查，本轮没有复核其因果或宣称全 CI 通过。**[一手：报告、维护补丁与测试限制；经验：诊断选择]**

只读上述固定测试、API 源码和 issue／PR，未运行浏览器、上游测试或模型。**[研究：验证范围]**

### React：生产构建故障中的定向日志

✅ 当状态更新依赖时序，先在实际失败的构建中复现，再记录相关状态随时间的变化；只需现有浏览器和定向日志时，不必增加调试平台。**[经验：23 §4 采用建议，2026-10-13]**

Dan Abramov 于 2026-02-18 的[#35821](https://github.com/react/react/issues/35821)含[公开复现](https://github.com/gaearon/react-udv-bug)：server action 返回 JSX 后，`useDeferredValue` 在开发版追上输入，生产版常卡旧值。[3 月 24 日原帖](https://bsky.app/profile/danabra.mov/post/3mhrdue7gds2h)称 Claude 此前未定位或写出失败测试；[紧接原帖](https://bsky.app/profile/danabra.mov/post/3mhrdwgnhkc2h)记后来依次浏览器复现、读人指定源码、给生产 bundle 加日志、修复。它支持提供实际状态变化，不排除源码可定位。**[一手：报告与作者自述，非完整模型轨迹]**

[固定合并提交 `c0d218f0f3e02ed581f74096e56baa947213135d`](https://github.com/react/react/commit/c0d218f0f3e02ed581f74096e56baa947213135d)在 `pingSuspendedRoot` 无法立即重启当前 render 时保存 pinged lanes，避免随后标为 suspended 而失去重试，未加业务轮询。新测试让兄弟组件在同一 render 内 resolve 挂起数据，最终须渲染 updated；既有测试另记新增重试行为。回归锁定 resolve/ping 时点。**[一手：补丁与测试；研究：机制归纳]**

[#36134](https://github.com/react/react/pull/36134)署名 Claude 编写／调试，获 acdlite 批准，2026-03-24 合入并关闭 issue。固定修复为上述提交，首次正式发布未核，不能当作当前缺陷。页面显示 245 checks passed；Test Plan 要求撤修复使新测失败、修复 bundle 解决 repro，但缺逐项 CI、会话、红绿或浏览器原日志，也未独立重跑。**[一手：署名、合入与聚合结果；研究：边界]**

review 指出源码已有 TODO，作者给出源码范围和日志建议；专家、复现及会话差异都可能贡献，不能独归日志。保留失败构建与输入，只观察区分假设的状态，把触发条件放入已有回归。日志可能扰动调度，须移除后复测用户路径。本例仍是专家参与的历史单例。**[一手：review 与自述；经验：接入要求]**

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

网格结果见原始输出；mean=1e9 的首个反例与独立高精度正值对应。极端输入使最终式归零而非负检查仍过，故非负性不等于数值精度。仅覆盖 n>0，Python 除零不能代表 C。**[研究：实际结果与边界]**

程序 SHA256：`7f7130436211bb82e4eb334afbc5ef56c713c4eaecd5f64168be13ab37194263`；输出 SHA256：`a2c69ab5866f715813a88228a914fafe2fa974f2dbfcfc58d537172fab7caf72`。执行范围见本小节开头；未测交付总成本，没有据此证明额外 Skill 比直接提示更有效。

### 外部生产者校准错误预期

> 核实：2026-10-13 UTC。15 §6 的窄增量：外部兼容预期应来自生产者，有证据时修正旧断言；复用已有用例。**[研究：采用判断]**

RTK 的[真实用户报告 #2367](https://github.com/rtk-ai/rtk/issues/2367)是 Windows 默认当前项目发现为零。[旧源码 5d32d073](https://github.com/rtk-ai/rtk/blob/5d32d0736f686b69d1e8b9dc45c007d4eb77a0a2/src/discover/provider.rs#L404-L410)已有 Windows 测试，却与实现、注释共同把合成路径 `C:\Users\foo\bar` 的预期写成 `C:-Users-foo-bar`；真实生产者目录应为双连字符。该基线 [CI](https://github.com/rtk-ai/rtk/actions/runs/29001896511) 的 Linux/macOS/Windows `cargo test --all` 步骤均成功，但原始 Windows 日志已返回 410，未逐例确认该用例的执行结果。**[社区：故障报告；一手：源码与 CI 元数据]**

[已合入 #2952](https://github.com/rtk-ai/rtk/pull/2952)（head `40fccbd8ef11d7cfda951253fa6f63944f1188e4`）同时添加冒号替换、修正文档和旧断言；贡献者报告原机默认命令 0→1，维护者[要求删除重复测试](https://github.com/rtk-ai/rtk/pull/2952#pullrequestreview-4922112994)，最终补丁只修正旧用例。另一贡献者[检查生产者目录后撤回大小写归因并报告 0→30](https://github.com/rtk-ai/rtk/issues/2919#issuecomment-5008576670)，其 #3043 未合入，不能当成 #2952 发布后的独立复测。**[一手：补丁与评审；社区：运行报告]**

改错断言不等于弱化验收，重复同路径也不保证更可靠；`--all` 历史仅辅助诊断。实跑属贡献者自报；[有 Claude Code 标记的 #2368](https://github.com/rtk-ai/rtk/pull/2368)未合入，不证明 AI 写出原 bug 或所有版本／大小写已恢复。

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

类型以外的舍入、时区、错误码、生产作业与可接受异常也决定正确性；可追踪案例和理由可能比通用规划提示更有增量。**[经验：待检验判断]**

S2 的迁移教程用 COBOL/JCL 数据流说明这点，但不能整套照搬：

- 它安排多份 overview/design/validation 文档，适合复杂迁移，不是每个小功能都需要四份文件。
- 第 3 阶段明确允许测试占位，之后才接入旧/新系统；因此“测试文件已生成”不是兼容性已验证。试点时应尽早确认旧系统是否真能运行，否则可能写出大量无法验证的迁移计划。
- 旧系统是行为基线，不是所有行为都正确。应分清必须兼容、明确要改变、仍有争议的行为；否则 Agent 会复制旧 bug，或擅自修正实际上必须兼容的细节。
- 教程出现 `.agent/AGENTS.md` 的规划例子。按已核对的 Codex 指令发现机制，不能由文件存在推断它在仓库根任务自动加载；要有适用目录或明确引用。这再次说明官方教程也需结合客户端机制阅读。

### 迁移后的事实归属与旧调用方式

> 核实：2026-10-14 UTC。改变 15 §5 的试点范围：职责迁移后，输出相同仍不足以证明查询走在正确系统上。**[研究：采用判断]**

[Anthropic 源码管理团队复盘](https://www.anthropic.com/engineering/redesigning-source-control)发表于 2026-10-13；“What we learned building Scion”报告，多个系统让 Agent 线性读取提交日志来推算变更何时合入 main，而工程师要求改向代码评审工具查询。这里缺的不是更多逐文件验证，而是确定谁负责提供这项事实。**[一手：工程团队自述；研究：原因与建议提炼]** 因此在跨系统迁移试点中，检查查询来源及已退役的调用方式；不能仅因新旧输出相等就接受原有扫描或状态重建路径。

**保留兼容的反例。** [Sapling 官方介绍](https://sapling-scm.com/docs/introduction/)的“Why make a new version control?”说明，其内部抽象将体验与仓库格式分离，使内部扩展方案仍能与 Git 仓库交互。**[一手：官方设计说明，非同负载对照]** 所以采用的是事实归属检查，不是默认删除兼容：外部消费者仍需要旧接口，或新接口不能覆盖语义、权限及可用性要求时，保留适配或缩小迁移范围。**[经验：采用与撤回条件]**

**来源边界。** 只读官方原文；Scion 无对应补丁、固定源码、原始轨迹或独立复测，日期仅为发表时间。Sapling 为未固定历史版本的当前文档；未运行软件／模型、未测维护收益。

## 四、游戏开发用来检验这个方向，而不是扩张引擎百科

游戏中的时间、输入、随机性、加载和镜头会影响观察；可借其接口设计检验通用方法，不能外推全部游戏。

假设要修“冲刺后偶尔穿墙”：保存初始位置、速度、碰撞体、输入序列与相关种子，配合固定步推进，有助于重复调查；同时还要通过真实输入链与实际帧时序复查。直接设置最终位置或只调用移动函数会跳过输入采样、动画与物理调度，不能证明用户路径修复。固定种子也不自动消除物理引擎、并发和平台差异。**[经验：案例设计，未运行引擎]**

状态定位机制、截图看呈现、试玩判断控制感与设计目标；三者不作永久成本排名。状态通过而画面不可玩须解释；玩家不接受机制可能要求改设计。

Jeff Schomay 原博客在原调查中访问受限，没有把旧文转述升级为一手复核。实际选型应回到对应领域页，不用“L3 性价比最高”或“AI 做不出好玩游戏”替代具体证据。**[研究：来源与适用边界]**

## 五、我们应怎样安排研究，而不是怎样继续加任务

下列案例把项目知识、反馈与架构判断落实到真实后续修改。选择干预时须指出任务缺口、替代方案与额外成本；模型能力仍可能是瓶颈，撤回条件见本节末尾，不再沿早期 D4／D6 分工重复扩任务。**[经验：选材原则]**

### Discourse：共享组件承接后续需求

✅ 对语义相同的新视图，先复用现有组件；真实需求出现时，再检查能否只扩展共享边界，不提前建立通用框架。**[研究：采用判断，2026-10-13]**

**起点与归属。** [#38888](https://github.com/discourse/discourse/pull/38888) 由 markvanlan 提交，2026-04-16 合并；[固定提交](https://github.com/discourse/discourse/commit/8feeaa5d69cd9462cc6aa4f560cb1e953e588e0b) 列 Claude Opus 4.6 及多位人类 coauthor，记录作者声明的 AI 参与，不包含生成过程，不能归因全部代码。[初始 header](https://github.com/discourse/discourse/blob/8feeaa5d69cd9462cc6aa4f560cb1e953e588e0b/frontend/discourse/app/components/nested-view-header.gjs) 直接导入并渲染已有 TopicCategory。**[一手：署名与源码]**

**真正的下一需求。** 8 月 11 日，另一贡献者 nullchristo 的 [#42520](https://github.com/discourse/discourse/pull/42520) 为客户插件在 category/tags 旁增加信息提供扩展点。[合并补丁](https://github.com/discourse/discourse/commit/e4f8b88ea34f1fe23474a62ddb1afb01b65f7b8e) 只改共享 TopicCategory 的包装 outlet 和 docked header 的 topic 参数；同版本 [nested/header](https://github.com/discourse/discourse/blob/e4f8b88ea34f1fe23474a62ddb1afb01b65f7b8e/frontend/discourse/app/components/nested/header.gjs) 仍调用它，未另改树加载或复制 nested 专属实现。作者与初始 coauthor 不同，但未证首次接手。**[一手：需求、补丁与调用链]**

**交付边界。** 后续 PR 获批准并合并。[core frontend 原日志](https://github.com/discourse/discourse/actions/runs/31506849232/job/93830516975) 核实运行版本为 `48d4571d4d747ae4fade0c49fd9e851fb693cd78`，即 head `cd63a1cc4b647701f505131af05bd7368fdf4bc5` 与 base `3908561e29d2187ac622eadd8a59fa3ba54ebac1` 的测试合并；`qunit:test` 汇总 6473 passed、0 skipped/failed。补丁没有新增测试，日志中通用 PluginOutlet 用例不等于新客户插件验收；原需求说将支持该插件，无客户部署／复测／工时；只读未复跑。**[一手：CI 原日志；研究：范围限定]**

**反例约束。** [真实管理员报告](https://meta.discourse.org/t/im-struggling-to-recover-deleted-post-how-to-fix/403161/1)显示，已删除 nested topic 的 500 阻断恢复。[#40134](https://github.com/discourse/discourse/pull/40134) 的[固定修复](https://github.com/discourse/discourse/commit/a051d96b6526c7a2ad2b7754863d7364e6401c28)给 OP 查询补接已有 visibility helper，并新增 staff show/context 返回 200 与 placeholder、non-staff 返回 404 的断言。修复作者 xfalcox 也是初始人类 coauthor，属团队维护；手工恢复未勾选，不能写用户已成功恢复。**[社区：用户原帖；一手：补丁]**

UI 复用未覆盖后台生命周期；继续核查看、删除和恢复，局部补接够用时不重写架构。**[研究：采用建议]**

### Pydantic AI：取消契约改变，不代表正常完成也应改变

> 核实：2026-10-14 UTC。主线三；改变 22 §5：把“本次要改变的行为”与“相邻仍须保留的行为”成对验收，再判断修复应落在哪层。✅ 采用；未测模型效果。**[研究：采用判断]**

**固定演化链。** 以下源码均只读，未安装或执行 Pydantic AI：

| 阶段 | 固定来源／真实需求 | 能确认什么 |
|---|---|---|
| 初始产物 | [v1.91.0 的 `_agent_graph.py`](https://github.com/pydantic/pydantic-ai/blob/b83abdf23d2cfe9940a83b51b1ce7abe0fc9b807/pydantic_ai_slim/pydantic_ai/_agent_graph.py#L668-L677) | 共享节点在消费者返回后继续排空，注释说明用于完整 usage 统计；是行为基线，不是这条路径的历史通过日志 |
| 后续真实需求 | [#5132](https://github.com/pydantic/pydantic-ai/issues/5132)；[变更 `93a6104`](https://github.com/pydantic/pydantic-ai/commit/93a61042943d3887c737ba753b908f258e8ea162) | 报告者在 1.81.0 的取消复现中记录清理未完成、仍有 4 个任务；#5313 引入托管流的确定性清理，并移除共享节点的排空循环 |
| 用户故障与修复判定 | [#5769](https://github.com/pydantic/pydantic-ai/issues/5769)、[#5771](https://github.com/pydantic/pydantic-ai/pull/5771) | 报告涉及 1.92–1.105 的空响应／零 usage；维护者将条件收窄为 handler 正常返回但未消费完流，普通无 handler 路径不受影响 |
| 窄修复产物 | [最终 `49f62a3`](https://github.com/pydantic/pydantic-ai/commit/49f62a386041abd6e0d960dd629c3b4fe28eac63) | 只改 `agent/abstract.py` 与 `tests/test_streaming.py`：在三处 driver 的 handler 正常返回后排空，异常向外传播时不进入该语句；保留共享节点与公开 API |

源码／补丁 **[一手]**，故障为 **[社区：运行自述，非本仓复现]**。#5132 明确披露由 AI coding assistant 与用户协作提出；#5313／#5771 另有 Codex、Devin 自动评审，但不能据通用 AI checklist 推断实现由哪个模型生成。

**为什么不能恢复旧循环了事。** 正常返回的 handler 可以只观察部分事件，最终响应仍须完整。共享节点的旧循环位于 `yield` 后、`try` 内，向外传播的异常本来就会跳过它；#5771 指出的另一冲突是显式 `stream.cancel()` 后仍可正常退出上下文，旧循环仍会尝试排空。最终由 driver 在 handler 正常返回后补齐流，向外传播的取消／其他异常则跳过；handler 内部只 `break` 再正常返回仍属于应排空的路径。职责调整保留显式取消与正常完成两种契约。**[一手：前后控制流、修复说明；研究：决策解释]**

这也不是“内层已有抽象就绝不动外层”。[Devin 指出](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3349919895) `CallToolsNode` 内层自排空不保证 capability wrapper 完成；[作者明确回复](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3353383025)已修正，最终三处分支一致。[Codex 则提出](https://github.com/pydantic/pydantic-ai/pull/5771#discussion_r3349656443)删除公开 `AgentStream.drain()` 会破坏调用者；[最终 `result.py`](https://github.com/pydantic/pydantic-ai/blob/49f62a386041abd6e0d960dd629c3b4fe28eac63/pydantic_ai_slim/pydantic_ai/result.py#L173-L177)仍保留该方法。前者获作者确认，后者仅产物对应；不独归因某条反馈。**[一手：评审、回复、源码]**

**成对验收与执行边界。** 最终新增四个正常完成测试，分别覆盖 `run`／`run_stream` 的完整文本与工具调用；另一个仅覆盖 `run` 的取消测试使用无限流，handler 抛出 `CancelledError`，要求只发生一次前置 lookahead。同时验完成与取消。[先前测试提交](https://github.com/pydantic/pydantic-ai/commit/95d9ff040d327a57423438df060b23bfb3e65d50)报告 `try/finally` 排空变体会失败；[后续提交](https://github.com/pydantic/pydantic-ai/commit/230e6d10ea4ec13198bd80fffc2014b2ac23e13f)将有限 sentinel 改为无限流与计数，以消除不可达的覆盖行。仅测试定义／mutation-testing 自述，缺红绿原日志。PR 页面显示 56 checks passed，也不能代替逐测试前后结果。**[一手：测试、提交说明与平台摘要]**

**最强反证。** #5771 明说用户最初贴的非流式例子并不触发该路径；#5769 当前正文已经过修改，非原始成功复现。修复 PR 正文还残留“CallToolsNode 分支不动”的描述，与最终补丁不同，故以上以固定产物和作者后续回复为准。[第三方历史复演](https://www.startearly.ai/regression-case-files/pydantic-ai-release-replay/)另报告 TestModel 在 1.91 通过、1.92 失败、1.106 通过；这是已知故障的事后复演，未重跑，不背书检测产品。**[一手：维护者解释；社区：第三方复演]**

#### 累计到下一次需求：保存、重放、整轮取消不是同一个契约

> 核实：2026-10-14 UTC。本节接续同一取消／历史链。三项新增要求是**保存中断产物、重新使用这些产物、从外部停止整轮并取回状态**；需求次数不按评审／修 bug 计。**[研究：比较范围]**

| 阶段与真实要求 | 固定产物、责任与操作变化 | 保留什么，什么有意改变 |
|---|---|---|
| 1. 取消返回前完成清理；正常返回仍交付完整结果 | 上文 `93a6104` 将事件流清理交给托管迭代器；`49f62a3` 把正常完成排空放到 handler driver，而非恢复共享节点旧循环 | 取消不继续消费与正常完成不丢结果同时成立；先分清退出策略，不统一所有路径 |
| 2. 前端已显示的中断输出也要保存 | [#3219](https://github.com/pydantic/pydantic-ai/issues/3219) → [#5364／`35fb827`](https://github.com/pydantic/pydantic-ai/commit/35fb8271688f438844e43cb0020d371a34cdc47a)。图节点在异常路径记录部分 response／tool returns，消息增加 interrupted 状态；工具返回非空才追加 request | 从“完成产物”增加到“可辨识的部分产物”；尚未承诺所有捕获历史都可再次发给模型 |
| 3. 将中断历史用于下一轮，而非仅供观察 | [#5836](https://github.com/pydantic/pydantic-ai/issues/5836) → [#6319／`8602986`](https://github.com/pydantic/pydantic-ai/commit/86029861bb86b210c29b3d3f3f3d5660fefd8c57)。共享历史清理层修复未配对工具调用、处理孤立结果，UI adapter 往返保存 outcome；测试包括不应自动修复的 deferred frontier | 尚待处理的工具与已经中断的工具必须区分；原始记录与发送给 provider 的整理分层，不把修复散到所有调用者 |
| 4. stop 按钮、线程或工具要停止整轮并拿回状态 | [#5835](https://github.com/pydantic/pydantic-ai/issues/5835) → [#6497／`a19b68a`](https://github.com/pydantic/pydantic-ai/commit/a19b68adeb2d18efd3719bb3c7f738a853d41984)。增加 run-scoped controller、token、外层取消分类与清理完成后的快照；复用 stream/tool teardown，响应级 cancel 保持原义 | 外部 `CancelledError` 继续传播以保留 timeout／TaskGroup 语义，本方取消以 `RunCancelled` 携带状态。新的控制范围要求掌握整轮状态的责任边界，不能只在流末尾补判断 |
| 5. 新契约的实际反例：首个工具尚未返回就取消 | [用户 #7977](https://github.com/pydantic/pydantic-ai/issues/7977) 在 2.37.0 给出确定性复现；[#7993／`1467456`](https://github.com/pydantic/pydantic-ai/commit/1467456556b9109b5b92eb7c7def8eabb5287775) 去掉旧 `if output_parts` 门槛，保留空 interrupted request | 阶段 2 的“空数据不保存”已不成立：消息还承担“这些工具不会再返回”的恢复信号。错误路径精确消息计数有意改变；修复沿已有 repair 边界完成，无须再次重构整轮控制 |

固定补丁／测试 **[一手]**，复现 **[社区：用户运行]**；本轮未运行。历史 repair 与 run controller 是不同责任，不能把作用全部归给 #6497。#7993 新增带／不带新 prompt 的恢复、错误退出恢复及多个 dangling calls 覆盖；作者称前三例旧版失败、新版通过，本轮未取得其逐例红绿原日志。

**晚期仍可窄修，而非越改越大。** run 级能力已有后，[#7743](https://github.com/pydantic/pydantic-ai/pull/7743)针对用户 #7722 的 adapter 不接收 token，把可选参数经三个入口转发到已有 run API，并补 native／编码流／dispatch 测试。属于既有承诺的补接线，非新需求或 UI 专用控制器。**[一手：补丁与需求；研究：选择解释]**

#### 接收者接下来做了什么：删除补偿层，而非恢复旧测试期待

**[一手：历史 CI；社区：接收者隔离报告]** [akgentic-llm #155](https://github.com/b12consulting/akgentic-llm/issues/155) 的 jltournay 调查了下游 healing／恢复测试失效。独立复核取得同一 `db899ae0e2ba32d9da3cdbf3465025f8dbb4afe5` 的[9 月 2 日 job](https://github.com/b12consulting/akgentic-llm/actions/runs/33616228928/job/100202578437) 885 passed，以及[9 月 3 日 job](https://github.com/b12consulting/akgentic-llm/actions/runs/33759029604/job/100660445431) 9 failed、876 passed。代码相同，环境不同：slim／graph、anyio、ast-serialize、prices、genai 等依赖均变化，不能把这组 CI 当作只改变 Pydantic AI 的对照。作者另报告隔离依赖后将八项定位到 2.37→2.38、另一项定位到 anyio；该因果定位仍归作者报告。

**[一手：最终产物]** [#156／`94779e1`](https://github.com/b12consulting/akgentic-llm/commit/94779e16adc47e964e0976c5311a276953fa6ca7)落实了接管选择：

- 原 `HealingCapability` 在错误钩子看到末尾已是空 request 后不再执行，上游下一轮会补工具返回；下游删除该能力、挂载顺序依赖、公开导出及专属常量，保留预算恢复决策 `LimitRecoveryCapability`。只删重复责任，未测工时
- 最初不改依赖下限的决定被[修正](https://github.com/b12consulting/akgentic-llm/issues/155#issuecomment-5619072935)：2.38 前首个工具未返回的失败路径不会留下该恢复标记，删除会破坏原来可恢复的路径。最终要求从 `>=2.32,<3` 改为 `>=2.38,<3`，保留已有主版本上限
- 删除公开名字而不留无效 shim，外部旧导入会报 `ImportError`；同时接受模型侧失败说明由项目特定文案变成上游通用 interrupted 文案。PR 要求下一 release 说明导出变化，作者把措辞损失留给 ADR owner 记录，仍有兼容与交付缺口
- 同批 anyio 修复没有使所有 workaround 都删除：下游保留清理整个 per-loop entry 的 `_evict_anyio_run_vars`，改掉“没有本地补偿就必定泄漏”的负对照。上游只修其中 root-task 缓存，须逐项比责任，不能升级即删本地层

**后期验收比数删改文件更有意义。** [新测试](https://github.com/b12consulting/akgentic-llm/blob/94779e16adc47e964e0976c5311a276953fa6ca7/tests/test_failed_run_history_resumes.py)经真实 `ReactAgent` 图和离线 `FunctionModel`，检查工具崩溃、预算耗尽后的下一轮模型输入有对应 call ID 的 interrupted return；通用失败要求同一异常对象及 traceback。另把失败事件经 `ModelMessagesTypeAdapter` JSON 往返，在新 agent 上 `restore_context` 后继续，验证持久化状态不会丢失恢复含义。**[一手：测试定义]**

[head CI job](https://github.com/b12consulting/akgentic-llm/actions/runs/34483676695/job/102892459538)绑定 `27ba731a2b696e6f57b7b84a5f46889e0ce9e4ed`，运行使用 slim 2.42.0／anyio 4.15.1，原日志为 **866 passed、99.10%**，包括新文件四例；与作者另报的本地 865 pass／98.3% 分开记录。它仅为历史确定性框架集成测试，非本仓／真实模型／OS 重启：恢复例的新工具名是 `kaboom_again`，下一轮直接返回文本，未证明原工具可以重新执行。**[一手：历史 CI 原日志；研究：运行边界]**

另一维护者 gpiroux 于 9 月 21 日合并，PR 无人工 review 记录，不能据此补写其理解工时。仅证下游采用，非陌生人首次接管。**[一手：合并；研究：采用边界]**

**发行与恢复分开核对（2026-10-16 UTC）。** [v2.3.0](https://github.com/b12consulting/akgentic-llm/releases/tag/v2.3.0)已于9月21日发布并列出#156；[固定发行源码](https://github.com/b12consulting/akgentic-llm/blob/637cb7db9abd8b3e10f95fead05a7f0fee2bebdb/src/akgentic/llm/__init__.py)已删除上述公开导出，[依赖下限](https://github.com/b12consulting/akgentic-llm/blob/637cb7db9abd8b3e10f95fead05a7f0fee2bebdb/pyproject.toml)为`>=2.38,<3`。核实时最新llm发行[v2.4.0](https://github.com/b12consulting/akgentic-llm/releases/tag/v2.4.0)仍用[同一下限](https://github.com/b12consulting/akgentic-llm/blob/e6e3b14e65b4419eac206db3ec8b9e5af5b24ea9/pyproject.toml)。同组织的[framework v2.15.0](https://github.com/b12consulting/akgentic-framework/releases/tag/v2.15.0)和[v2.17.0](https://github.com/b12consulting/akgentic-framework/releases/tag/v2.17.0)分别纳入llm 2.3.0和2.4.0，支持已进入组合发行，不证明服务恢复。llm v2.3.0说明只列删除healing的PR，没有列出两个被删名字的旧导入迁移；[agent #148](https://github.com/b12consulting/akgentic-agent/issues/148)仍open且无评论。最低支持版本的完整验收、ADR-016落地、外部旧导入迁移与真实恢复仍未取得新回执。**[一手：发行页、固定源码与公开状态；研究：交付缺口]**

#### 后续依赖升级：旧观察点过时，不等于消费者结果可以丢

> 核实：2026-10-15 UTC；2026-10-16 UTC补核发行范围。以下#167／#172均在最新llm发行v2.4.0之后：已核[提交比较](https://github.com/b12consulting/akgentic-llm/compare/v2.4.0...45b089aba1d56a1cc9a18e2d4d05fe7ff9c79274)，不属v2.3.0／v2.4.0交付；未运行上下游或取得服务恢复回执。**[一手／研究：范围]**

**先区分观察时点与交付结果。** [#167／`5f18045`](https://github.com/b12consulting/akgentic-llm/commit/5f18045a8c9f3138d083318493bb0e896663fa93)将依赖下限从2.38提高到2.54，并把 limit-recovery 验收拆开：错误钩子看到的持久历史以 dangling response 结束；run 展开收尾后，历史仍须紧跟 interrupted marker。补丁改变钩子时点的断言，保留后续 conclusion 返回 `concluded` 的断言。作者在 [#169](https://github.com/b12consulting/akgentic-llm/issues/169)说明恢复行为未变；这不是恢复成功的新现场证据。[当前固定master](https://github.com/b12consulting/akgentic-llm/blob/28adec6d370b09af790abbd3f46ed281398183c6/pyproject.toml)要求`>=2.54,<3`，已发行的v2.3.0／v2.4.0仍声明`>=2.38,<3`；先核实际采用的版本，不把master下限套到旧发行，也不把发行声明当最低版本完整验收。**[一手：固定依赖、补丁与测试；社区：作者诊断]**

**另一次红测试则仍代表必须修的消费者结果。** 上游 [#9627／`107cac9`](https://github.com/pydantic/pydantic-ai/commit/107cac9ec0bdd05bd25085b202189c3787edb024)让动态 system prompt 重评时替换 run 内的消息副本，不再改调用者持有的历史对象；新增测试同时要求本轮得到新文本、旧历史不变，以及并发轮次互不污染。下游 [#171](https://github.com/b12consulting/akgentic-llm/issues/171)报告2.56使第二轮变更不再产生 `LlmSystemPromptEvent`：记录器仍读旧对象，算出的 hash 不变。observer 契约仍需两个事件，不能改为一个。**[一手：上游补丁与测试定义；社区：下游故障报告]**

下游 [#172／`45b089a`](https://github.com/b12consulting/akgentic-llm/commit/45b089aba1d56a1cc9a18e2d4d05fe7ff9c79274)把本轮 live history 显式传给 `record_system_prompt`，保留原有去重逻辑和[两轮事件断言](https://github.com/b12consulting/akgentic-llm/blob/45b089aba1d56a1cc9a18e2d4d05fe7ff9c79274/tests/test_capabilities.py#L363-L384)，没有恢复上游原地修改，也没有重建已删除的 healing 层。[固定 README](https://github.com/b12consulting/akgentic-llm/blob/1f5b7c7e514c853e09d5feadcad07a77000efa7a/README.md#system-prompt-rendering-events)说明该事件供 traces／frontend 显示每轮实际提示词；仅为消费者契约，未证前端恢复显示。可选 `messages` 参数保留旧调用形式，但默认读取旧 context 不能保证后续轮次内容新鲜；接入者仍要传对本轮数据。**[一手：实现、测试定义与公开契约]**

**采用边界。** 上游承担的是调用者历史不被改写，下游仍负责发布每轮有效内容；两者都应保留。依赖升级后，先追到消费者实际需要的值和时点，再决定更新内部断言还是修接线。作者称补丁兼容2.54和2.56，本轮未取得双版本完整原日志；未发行且缺旧导入迁移／服务恢复回执，不作交付闭环或工时收益。**[社区：兼容自述；研究：选择与限制]**

#### 累计采用判断：下一需求改变了谁必须知道什么

生命周期需求先定触发、退出与保留结果，再分辨旧测试应保留还是更新。**[研究：本链采用条件]**

✅ **局部补丁**：责任不变时沿既有 API／repair 层补接并验原调用者；#7743、#7993 表明后期也能小修。**[研究]**

✅ **窄扩展点或责任重构**：先保留可用抽象；策略随控制范围、完成时点或退出分类，放到掌握区别的层，并验相邻路径／公开接口。#5771 driver 与 #6497 controller 各有范围，共用 finally 排空或统一异常不能表达两者；窄改仍无法表达才扩大。**[研究]**

✅ **删除过期扩展并交接**：上游已承担同一结果时，核最低版本和持久恢复，再删补偿；交代导出、文案、预算策略和跨仓说明。别为旧内部断言恢复重复责任，仍有独立责任的 workaround 保留。**[研究]**

尚缺最低支持版本完整验收、发行后导入迁移与真实恢复，不能据本链量化模型／架构维护收益。

### CodeThread：下一次修改失败，先查继承了什么行为

> 核实：2026-10-14 UTC。主线三，关联四；改变 20 §4 的续改诊断：检查新功能依赖的旧函数行为，不只审最新 diff 或先降低复杂度。✅ 采用此诊断顺序；不新增指标门禁、Hook 或模型评判器。**[研究：采用判断]**

**新证据与选择条件。** [CodeThread v2](https://arxiv.org/html/2606.21804v2)发表于 2026-09-29（v1 为 6-19）。四模型在同一后续问题上继承历史人工实现或 Agent 重建实现；第一步须通过 P2P、仍失败于全部 F2P，每条件单次运行。四模型共有交集的 16 组比较中有四组持平或反向；该交集内最大下降 13.1 个百分点不是普遍损失，也不是各模型完整样本的最大值（附录 B 的 GLM／Multilingual 为下降 13.8 个百分点）。405 个结果不同且特征完整的样本中，输入／错误契约偏移的 OR 为 1.83（95% CI 1.15–2.92），本回归中圈复杂度／认知复杂度未显示显著关联。**[研究：论文 §3–5；非本仓运行]**

**反证。** v2 增加第二个 judge 与 50 例非盲人工核查，但没有“只移除偏移”的干预；262 个选定人工基线胜出的样本中，judge 仅将 54 例关联到保留的偏移。研究没有人类接管试验或第五次修改，不能证明普遍维护成本、更不能证明降低复杂度无用。**[研究：论文附录 D；解释边界]**

**构造源码限定了能说什么。** 固定仓库 [`158f6ab`](https://github.com/shaswatpatel123/CodeThread/tree/158f6abaadcf717f3175a8f402be7da4e8d48c76)的 [`data_gen_problems.py`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/dataset/scripts/data_gen_problems.py)把原函数交给模型，生成重建所需的说明，其中明确要求返回结构、异常、边界与操作步骤；人工分支保留原实现，未由人按同一说明重写。[公开数据卡](https://huggingface.co/datasets/shaswat123/CodeThread)列的是 1,377 个 stub／任务输入，不是 1,377 个成功配对运行。因此这是“重建保真度＋后续解题”的比较，P2P 通过不能证明未测输入上的行为等价；不可把全部后续差异归因于代码组织或接管难度。**[一手：固定源码、数据卡；研究：因果边界]**

本轮还只读 [`synthetic_chains.py`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/scripts/utils/synthetic_chains.py)的 P2P／F2P 分类与 [`run_swebench.sh`](https://github.com/shaswatpatel123/CodeThread/blob/158f6abaadcf717f3175a8f402be7da4e8d48c76/scripts/run_swebench.sh)的两阶段连接。只读未运行；固定仓库／数据卡未提供所需逐例配对产物、judge 标签及测试原日志，无法重算或复现。**[一手：检查范围]**

**采用条件。** 沿新功能调用链核继承实现的输入拒绝、缺值及错误契约，不能只看 diff。把查明的偏移写入最小回归；新需求有意改变旧行为时同步契约与调用者，不机械恢复历史代码。**[经验：未测净收益]**

与 Pydantic 的有意契约改变互补，本例提示继承行为可能已偏移。下一证据须同任务／预算仅修偏移后重测，或真实接管投入；复杂度榜单不能回答。

### 生成回归测试：先保留预期，再决定是否新增

**核实：2026-10-14 UTC；改变 22 §4。** 红绿结果要有独立的预期依据；测试的来源是 AI 或人工，均不能替代这一步。已有用例能区分目标缺陷时复用；新增断言失败后，先查需求与实现，不自动把预期改到当前代码能通过。**[经验：采用建议]**

**跨后续修改的新证据。** [On the Risks of using LLM-Generated Tests for Regression Testing v1](https://arxiv.org/html/2610.11835v1)（2026-10-08，§3–7）使用 Haiku 4.5，在 SciPy／Qiskit／pandas 的 50／50／45 个历史 PR 上注入人工变异。选择未完全覆盖、至多改五个代码文件的 PR，pandas 限 I/O；先去掉原生测试检出的变异，再保留模型能构造区分测试的变异。生成阶段可见 PR 前源码、变异后的源码、两者 diff 与执行上下文，不见未变异的 PR 后参考源码，至多六轮追求通过与覆盖。表 3 的分母是进入分类的变异—测试对（各 3,483／3,355／9,578），包括预算耗尽后保留的失败候选，不只是获接受的通过测试；其中 8.4%–16.9% 在错误版通过、参考版失败。表 4 再跟踪可向后传播的 587／279／1,614 对，后续重施同一变异时，82.8%–90.9% 仍维持该结果。**[研究：预印本受控变异与历史传播，非真实故障发生率]**

**原生测试足够的反例与分母。** 同文表 2 中，原生套件已检出各项目可执行变异的 58.6%／54.0%／16.0%，这部分未进入生成比较；预筛样本不证明普遍不足。传播中，后来原生测试检出故障也没有终止该断言的追踪，所以“错误断言仍存活”不等于“故障无人检出”。已可靠拦住的风险无需重复生成；论文未证额外维护收益或人工净成本。**[研究：结果及采用边界]**

**已有工业机制的对照。** Meta 的 [TestGen-LLM 原论文 §2](https://arxiv.org/html/2402.09171v1)明确丢弃首次不通过的测试，五次重复排除不稳定，再过滤不增加覆盖的候选；它保留原测试并由工程师决定接收。该设计适合补充已认可行为的覆盖，不能把“当前通过”解释成业务预期正确，也不能据新论文把 Meta 的实际部署说成已经锁入同等比例的缺陷。覆盖未增加也不必然意味着测试无价值：同一路径可以有更强断言。**[一手：工业论文；研究：机制比较]**

**读取与未证实部分。** 已读两篇固定版本正文。新研究的 [Figshare 工件地址](https://figshare.com/s/bcdd07ff46760fd254ec)本次读取返回 403，未取得原始记录，不能独立复算；不是认定工件不存在。未运行上游／模型；变异非真实 bug，也非当前 Codex／Claude 全流程对照，不支持默认隐藏源码、测试先行或加 Agent。继续采用的条件是新增测试补到明确行为缺口，若只重复已有检查则不保留。**[研究：局限与可撤回条件]**

### n8n：配置回退与独立导出入口

**核实：2026-10-14 UTC；主线三，兼四；改变 15 §5。** ✅ 回退设计应停止新格式写入，同时保留读取已落盘数据所需的依赖；用混合代次数据分别验服务和实际维护入口。相对 Git MIDX 的降级，本例补配置撤回及导出入口。**[研究：采用判断]**

**两步修订解决不同缺口。** [#37416](https://github.com/n8n-io/n8n/pull/37416)／[430bbe53](https://github.com/n8n-io/n8n/commit/430bbe53c3f784c20679c3a93b8da1feb52cab7e)先让模块和 provider 不再随轮换开关一起停用，但 cipher 自身仍检查开关。[#37603](https://github.com/n8n-io/n8n/pull/37603)／[9b10838d](https://github.com/n8n-io/n8n/commit/9b10838d9e1015d2198f3f48b9a6bc042239884a)才在 `packages/core/src/encryption/cipher.ts` 删除 `decryptV2` 的开关条件，按密文前缀查 key；`key-manager.service.ts` 的 `getActiveKey` 仍在关闭时返回旧格式 descriptor。读取已有新格式和继续写新格式因此分开。**[一手：固定补丁]**

#37603 作者报告在分支 `2f51d9d615` 经真实 REST API 与 SQLite 检查 on→off→on：开启时写入的数据在关闭后仍可读，关闭后的新写入恢复旧格式，混合数据可读且读取不改写存储值。但同一报告明确指出一次性导出命令不运行 module init，provider 未注册，仍无法读带 keyId 的数据，并误报密钥不同。原始可重跑 spec 未随报告公开，不能把服务端成功当作导出恢复成功。**[社区：作者运行与故障报告]**

随后 [#37972](https://github.com/n8n-io/n8n/pull/37972)／[93945cce](https://github.com/n8n-io/n8n/commit/93945cce5d97347d3dc3e1ac6249cd104ce5d708)在 `BaseCommand.init()` 数据库准备后调用 bootstrap，使服务、worker、webhook 和一次性命令较早获得 provider；原模块只保留管理 API 与前端设置。cipher 同时删除 provider 未注册时的隐式回退，改为明确失败。[afitzek 审批前一 PR](https://github.com/n8n-io/n8n/pull/37603#pullrequestreview-5100537985)后实际提交这次修复，再由 [sychovSaveliy 审批](https://github.com/n8n-io/n8n/pull/37972#pullrequestreview-5134188188)，为实际接管修改。两个固定提交均有 Claude 共同署名；只证署名参与，非代码归属／工时。**[一手：补丁、PR 元数据与审查]**

**测试实际覆盖什么。** #37603 的 core 单测覆盖两种格式、未知 key ID 和不合格旧格式 descriptor；[固定 integration 测试](https://github.com/n8n-io/n8n/blob/93945cce5d97347d3dc3e1ac6249cd104ce5d708/packages/cli/src/encryption/__tests__/encryption-bootstrap.service.integration.test.ts)分别检查开启／关闭时的真实 key store 与 cipher 往返，未在同一用例内做完整 on→off→on。后续 [bootstrap 单测](https://github.com/n8n-io/n8n/blob/93945cce5d97347d3dc3e1ac6249cd104ce5d708/packages/cli/src/encryption/__tests__/encryption-bootstrap.service.test.ts)验证禁止 seed 或非 main 时不创建部署级 key、仍注册读取 provider；`commands/__tests__/execute.test.ts` 把 bootstrap mock 为 no-op，不能算实际导出测试。**[一手：测试定义，未执行]**

**回退边界。** 轮换 active key、关闭新格式写入、降级旧程序是三件事：前者仍需保留旧 key 以读旧密文；关闭写入不批量还原已经落盘的数据；同版本回退成功也不保证旧程序兼容。[官方当前说明](https://github.com/n8n-io/n8n-docs/blob/main/docs/deploy/host-n8n/configure-n8n/security/rotate-encryption-keys.md)把安全停用发布边界列为 2.40.3，并保留降级和缺少自动逆向转换的警告。不可将该节点写成首次解除读取门控：[#38910 固定补丁](https://github.com/n8n-io/n8n/commit/a8e0e7c3844510321894bf661cc0610baeae8fc3)实际补的是第三种 legacy DEK 存储形态，而读取门控已在 #37603 解耦。**[一手；研究：边界比较]**

**验证与采用范围。** 只读补丁、测试、作者报告与接管链，未运行 n8n／数据库／上游测试；缺最终 CLI 成功重试的独立回执及人工投入。仅对新持久格式或独立维护入口采用，复用已有覆盖。**[研究]**

### Grafana：回退的恢复时间点与保护性拒绝

**核实：2026-10-14 UTC；主线三／四；改变 15 §5。** ✅ 对已迁移持久数据的回退，除旧程序能否读取，还要查恢复时间点和升级期间新增／修改的处理方式；在隔离数据上验证恢复方案，由负责人明确接受损失后才有条件使用强制回退。不能仅为恢复启动删保护或清表。本例补业务恢复目标。**[研究：采用判断]**

**原失败不等于检测到了新增数据。** [Grafana #50421](https://github.com/grafana/grafana/issues/50421)原报告者从 8.5.5 升到 9.0.0-beta3，因 polystat 面板插件不兼容降回 8.5.5，随后启动 panic；他明确说没有新建警报。[维护者说明](https://github.com/grafana/grafana/issues/50421#issuecomment-1152151626)将阻断解释为避免用户不知情地删除新警报系统数据。[PR #50470](https://github.com/grafana/grafana/pull/50470)已合并，固定修订 [30f035ca](https://github.com/grafana/grafana/commit/30f035ca347d9f6ba02bc48c0e1f183c885227c5)只澄清 panic 信息，没有实现无损反向迁移，也没有移除保护。**[社区：原报告与维护者解释；一手：固定补丁]**

**历史发布版的删除契约。** v9.0.0 对应固定 SHA [`b5c56f63`](https://github.com/grafana/grafana/commit/b5c56f63710e09f37b8557ddd8b99ae3fc583169)。其 [ualert.go L52–96](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/ualert.go#L52-L96)按迁移日志和启用状态选择回退，缺少 `ForceMigration` 时阻止；开启后安排删除迁移，并清掉原迁移标记，供将来再迁移。因此阻断不证明实际存在升级后的新增警报；新旧警报都关闭时还有直接返回的分支。[删除实现 L517–570](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/ualert.go#L517-L570)涉及新警报规则、规则版本、配置、实例及 silence 文件，不是单纯换回旧二进制。[同版回退文档](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/docs/sources/alerting/migrating-alerts/roll-back.md)明确恢复的是升级时的警报状态，新系统中新增警报及修改会被删除。**[一手：固定发布源码与文档]**

**启动恢复与业务恢复是两个结果。** [另一用户的后续报告](https://github.com/grafana/grafana/issues/50421#issuecomment-1150915431)称按讨论中的清表办法恢复启动，但已没有警报。这不是无损恢复，也不是推荐手工删表；须约定损失并验业务，不能只验启动／关闭 issue。该回执不是原报告者的修订版复测。**[社区：用户运行报告；研究：采用边界]**

**测试名不是有效断言的证明。** [同版 migration_test.go L24–115](https://github.com/grafana/grafana/blob/b5c56f63710e09f37b8557ddd8b99ae3fc583169/pkg/services/sqlstore/migrations/ualert/migration_test.go#L24-L115)包含名为“force migration is disabled…should panic”的表项，但未设置 `shouldPanic: true`；defer 吞掉 panic，只在该字段为真且没有 panic 时报告失败。对应表项又将删除迁移列为 expected，故不能把用例名称当作“移除拒绝也会被检出”的证据。本轮仅作静态核对，未做变异或上游执行。**[一手：测试定义；研究：断言范围]**

**反证、归属与验证范围。** 不推断所有降级都会丢数据，不将这项历史错误解释修订说成当前 Grafana 的操作指南；支持的是针对具体迁移契约选择恢复目标。GitHub compare 显示 PR merge SHA 与 v9.0.0 为 diverged（ahead_by=261、behind_by=367），不可宣称该 merge commit 为发布版祖先；发布版包含澄清信息是直接读上述固定源码确认的。未取得本例的 AI 参与证据，未安装或运行 Grafana、模型及上游测试，未核验 CI，也没有原报告者的最终无损回退回执或维护收益测量。**[一手：提交关系与源码；研究：边界]**

### 能推翻或改变这个优先级的证据

知识、环境和反馈充分却受复杂推理限制时，提高模型／effort 对照优先级；接口维护贵于人工复现或仅一次性使用时，撤回专门改造。更强模型已解决旧失败则删多余流程；内部状态绕过真实故障则降低其验收权重。

案例分别记录知识、访问、反馈、顺序和模型变化；多项同改只能评完整方案。缺耗时、返工与后续记录时不报收益百分比。

## 来源与阅读范围

- **S1 [一手]**：OpenAI Skills 固定 `49f948faa9258a0c61caceaf225e179651397431`，[interactive](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/playwright-interactive/SKILL.md) 的前提、会话、功能/视觉 QA、viewport 与重启段落；[CLI](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/playwright/SKILL.md) 的前提、核心流程与快照更新段落。只读研究，未采用为本会话指令。
- **S2 [一手]**：[Code modernization](https://github.com/openai/openai-cookbook/blob/5bd6cb40b6b84b69b2032d810610aa85064102df/examples/codex/code_modernization.md)，读引言至第 4.2 阶段。没有运行教程、验证其业务系统或据此确认当前采用率。
- **[经验/研究]**：本仓库 Catalog Compare 与验收链检查见正文链接；游戏、地址保存示例是本文分析设计，不是性能实测。当前来源仍偏官方与公开 GitHub，社区原始运行轨迹是下一步证据缺口。

## 写入路径扩展与序列化判等：sqlite-chronicle

核实：2026-10-14 UTC。**✅ 给 Agent 扩展写入路径时，把业务行与派生版本／审计状态一起验；为支持新类型而改变判等编码，还须验证旧类型中需要区分的值。** 本节改变 15 §6 的窄建议，不新增工具或默认评审阶段。**[经验：采用判断]**

### 一手修订链与归属

[Issue #20](https://github.com/simonw/sqlite-chronicle/issues/20)由维护者 Simon Willison 报告：把代码和此前讨论交给 Opus 4.6、Gemini 3 Deep Think、GPT-5.2 探索，其中前两者给出候选方案，GPT-5.2 耗尽上下文。仅作者报告，非模型排名。[PR #21](https://github.com/simonw/sqlite-chronicle/pull/21)公开了要求先确认失败、采用候选方案、做 red/green 与生成演示的任务文字、Claude Code 会话链接和 claude 提交；本轮只读公开 PR 与代码，没有读取会话全文或运行模型。人工审阅后合并、发布 0.5，仍非全输入正确保证。**[社区：作者报告；一手：公开任务与提交]**

- 原版 [25370bdd](https://github.com/simonw/sqlite-chronicle/blob/25370bdd9ce4d5c3be93d5035e86b44bd9346476/sqlite_chronicle.py)在 AFTER INSERT 中用 `INSERT OR IGNORE` 写 chronicle；外层 `INSERT OR REPLACE` 的冲突策略会传播进触发器，重建跟踪行并重置 added 时间。`recursive_triggers=ON` 还让隐式 DELETE 触发额外版本增长。SQLite [CREATE TRIGGER 官方契约](https://sqlite.org/lang_createtrigger.html)明确外层语句的冲突处理优先于触发器内部策略。**[一手]**
- [3510fd21](https://github.com/simonw/sqlite-chronicle/commit/3510fd21b57bf5a06eb16bf5830d44919fc3fe11)改为 BEFORE INSERT 保存旧值快照、INSERT 时判等并清理、用 `WHERE NOT EXISTS` 避免冲突策略传播，并为隐式 DELETE 加 guard。后续 [60f09b98](https://github.com/simonw/sqlite-chronicle/blob/60f09b9833f4bbc44ea52cd89cf9c4e5329a804e/README.md)已有对应生成 SQL，但 `json_array` 直接接收 BLOB 会失败。**[一手：固定补丁与生成 SQL]**
- [9cd5293f](https://github.com/simonw/sqlite-chronicle/commit/9cd5293f5e89825a8824c1f258231e0592d8579f)改用 `json_array(quote(...))`，新增 BLOB、NULL、混合类型回归。这个改动确实消除本轮 BLOB 失败，但 `quote(TEXT)` 在首个 NUL 截断；不同尾部因此可能得到相同快照。截断是 [SQLite 文档规定](https://sqlite.org/lang_corefunc.html#quote)，不是本仓猜测。**[一手；研究：判等推论]**
- 核查时 main 固定为 [ee8d2a1d](https://github.com/simonw/sqlite-chronicle/blob/ee8d2a1db5090d14279f0acb56b5d46a5c50e44c/sqlite_chronicle.py)。快照表已改成共享表，仍保留这条 quote 判等路径；本轮也运行了此 SHA 的 [README 生成 SQL](https://github.com/simonw/sqlite-chronicle/blob/ee8d2a1db5090d14279f0acb56b5d46a5c50e44c/README.md)，未用二月补丁代十月现状。**[一手；经验：固定 SQL 执行]**

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

未运行包 CLI、安装／升级、上游套件、并发、多表或复合键；没有外部 issue／补丁。固定 SQL 不是整库验证；本例区分“编码接受新值”和“仍能分辨旧值”，不量化模型收益。**[研究]**


### SWE-Game：游戏移植的 Visual 分不等于体验质量

**核实：2026-10-15（UTC+8）；主线二／四；改变 22 的评分使用建议。** ✅ 借鉴按证据条件拆分游戏验收；👀 整套基准先作为条件评估对象，不凭总分选游戏 Agent 或宣布移植交付。当前 game02／WP10 已区分状态、输入、连续视听与玩家体验，本轮不重复扩建接口；重点为评分定义、版本和演示边界。**[研究：采用判断]**

**固定来源。** 阅读 [论文 v3 正文及附录](https://arxiv.org/html/2609.33678v3)，由[作者提交的论文页](https://huggingface.co/papers/2609.33678)核到官方公开仓库；源码固定 `Charly-chan/SWE-Game@157a42b1a8a771a51da41e3df5e29045e246cc6c`。下载源码归档只读检查，未运行上游测试、模型、引擎或下载完整游戏数据。项目自有代码为 Apache-2.0，游戏／资产沿各自许可，素材另清权。[版本与数据声明](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/docs/releasing.md)。**[一手；研究：验证边界]**

**先分开论文和发行配置。** 论文 v3 为 247 任务／83 修复；公开清单为 246／82，固定数据 revision 为 `651906f7d922474b8e4754bacd6f7fba38cc0397`。发行默认关闭 Brief Design 和构建类视觉裁判；缺少必要视觉证据时完整合成分留空。README 的结果修订说明指向论文 v1，而 v3 Table 3 仍列 Design 及不同 Brief 总分。因此引用必须写清论文版本／结果集，不能任选一个总数与另一版评分公式拼接；论文结果非默认发行设置的新测量。**[一手：上述版本文件、论文 Table 3 与附录 D；研究：比较]**

**独立源码核查反证：Visual 的名字不能替代测量定义。** 当前移植 registry `2026-10.mode5-evidence-five-visual1` 不调用 VLM；[评分契约](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/docs/reference/MODE5_SCORING.md)明确为实现对应关系。运行／Editor／静态支持／文件存在的系数为 1／0.8／0.6／0.25；没有运行证据时仍可得到部分分，最终目标则只接受独立运行证据。部分分非严格完成率。**[一手：实现契约；研究：解释]**

- [visual_measure.py L67–112、198–243](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/mode5/visual_measure.py#L67-L112)使用英文 OCR 与 score／points、health／hp、progress 等数值标签，核显示值与状态及无输入前后变化；不是所有文字、图标式血条或本地化 UI 的可读性度量
- [L215–221、244–269](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/mode5/visual_measure.py#L215-L269)把非静音且变化的 PCM 作为音频证据，动画按局部外观变化与原生状态佐证，布局按语义角色相对顺序；未测警告清晰、动画自然或风格一致
- [unity_visual_probe.cs L144–204](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/unity/unity_visual_probe.cs#L144-L204)在探针冻结时间时，依次移除／恢复渲染器与 UI 采图；[漂移检查 L48–64](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/mode5/visual_measure.py#L48-L64)拒绝恢复后变化过大的画面。这适合确认像素贡献，不能证明运动顺滑；未见依据可把它描述成关闭 TAA 的实现

以上为静态核查，未复现误判率，也未确认论文历史成绩采用此实现。**[一手＋研究]**

**负对照能补什么，也会漏什么。** 移植模式重放 witness、匹配无输入和隐藏场景，见[移植运行协议](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/docs/reference/MODE5_RELEASE_PROTOCOL.md)。另一个可借鉴、但不属于移植模式的机制是 Godot 三类构建任务的分段功能演示：[任务协议](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/docs/tasks.md#feature-demonstrations)逐片段冷启动，重放输入、等时长无输入与带评测标志的输入；分段功能并集不能靠重复演示加分，严格完成单列，未要求所有功能挤进一条整局录像。针对应由动作引起的奖励／推进，这比只看胜利画面多一条可反驳证据；合法被动计时则须由任务声明 `requires_player_action: false` 与原因，不可统一判为作弊。[声明校验 L128–141](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/content/rubrics.py#L128-L141)、[负对照测试定义 L86–102](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/tests/test_feature_demonstrations.py#L86-L102)。**[一手；研究：借用条件]**

公开任务仅把 visible 材料交给 Agent，hidden 和裁判留在评估侧；这是访问隔离契约，不能证明训练污染不存在。[Godot 防绕过模块的 LIMITS](https://github.com/Charly-chan/SWE-Game/blob/157a42b1a8a771a51da41e3df5e29045e246cc6c/eval/evalsys/evalsys/taskgen/antigrant.py#L41-L61)直接列出计算标志名的静态扫描盲区，以及 idle／mash 动态探测的 1100 帧预算限制；不能反过来声称完整动态评估一定被这些方式攻破。固定时长无输入只反驳相同窗口内的被动成功，不足以证明所有输入都正确或没有评测特判。**[一手；研究：威胁范围]**

**论文支持到哪里。** 41 个参考游戏为 24 个 2D、17 个 3D；功能校准抽样为构建模式的 100 游戏／1200 条断言，不覆盖所有修复／移植判据；200 个片段的 VLM 视觉得分相关性，不是本发行版移植 Visual 的校准或长期乐趣验证。模型与各自框架一起评，不能单独归因模型。参考路线保留时间，适合检查注册目标，但不同运动调参下路线失败不能单凭总分区分机制缺失与时序不匹配；应回读局部状态和候选演示。本轮未找到独立运行复现，保留作者结果的证据等级。**[一手：论文 §3.4、§4.1、§4.5、Limitations；研究：推广边界]**

**采用条件。** 同版本／任务／裁判／预算比较严格运行结果与组件证据；画质和手感另验目标设备连续视听。已有验收覆盖则不接整套 benchmark；收益留待获准实验。**[研究]**

## 重复代码迁移：语法规则、类型分析与第二次执行

**主线二／三；改变 15 §4–5。** 核实时间：2026-10-15（UTC+8）。✅ 同一规则覆盖多处、已有适用迁移器时，先复用；少量异质调用或业务语义需逐项决定时，直接让 Agent 补丁并验证。前者的收益是复用明确的匹配与变换规则，不能由此推出当前强 Agent 的净收益。以下来自三个不同项目的历史迁移、维护回复与固定源码，没有安装或运行它们。**[研究：采用判断；一手／社区：下述证据]**

### 语法匹配能省重复劳动，但不等于完成迁移

- **正面使用与遗漏同时存在。** TanStack Query [#6204](https://github.com/TanStack/query/issues/6204) 的 gillkyle 报告，v5.0.0 codemod 成功处理多处 `invalidateQueries`／`refetchQueries`，且[明确说节省了时间](https://github.com/TanStack/query/issues/6204#issuecomment-1772989068)；但其最小复现输出 `0 errors / 1 unmodified / 0 ok`，仍留下自定义 hook 的两种旧调用。约 30 分钟是作者整次升级自报，不是 codemod 对照耗时。**[社区：真实迁移单例]**
- **第二次核验没有把“已修”视为全部通过。** slax57 在 [5.13.4 复测](https://github.com/TanStack/query/issues/6204#issuecomment-1857715221)中确认 `useQuery` 已处理，指出 `useMutation` 仍遗漏；维护者要求另建 [#6548](https://github.com/TanStack/query/issues/6548)，报告版本为 5.14.0。随后该报告者提交 [#7187](https://github.com/TanStack/query/pull/7187)，维护者批准，2024-04-02 合入 [`798124d`](https://github.com/TanStack/query/commit/798124da1c3e21c8e95b037466905489e19cd029)。补丁将 `useMutation` 纳入匹配并增加带／不带 options 的输入输出夹具。这里只确认固定补丁与维护接收，不把旧版本遗漏当当前缺陷。**[社区：他人复测；一手：修订／夹具]**
- **解析 TS 语法不是建立完整类型程序。** 本轮固定 [`a8af0e2`](https://github.com/TanStack/query/tree/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads)：[utils](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/utils/index.cjs)沿 AST scope 找变量声明并看是否为数组表达式；[default-import 输出夹具](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/__testfixtures__/default-import.output.tsx)明确保留从另一模块导入的 query key 调用。[测试入口](https://github.com/TanStack/query/blob/a8af0e243af6f09d670ea2ec9849c4e3e3bc17ed/packages/query-codemods/src/v5/remove-overloads/__tests__/remove-overloads.test.cjs)用 `tsx` parser 比较两个输入输出 fixture，不能据此声称跨文件类型推断、全量语义或二次运行已验证。**[一手：源码／测试，只读]**

先核调用覆盖、未改项和警告；成功退出、能解析 `.tsx` 或 issue 关闭均不等于完成。混合调用须分别验该改、保留及待定项。**[经验]**

### 类型与框架分析值得增加的具体条件

Angular signal input 的迁移不只是给名字加 `()`，还会改模板、host binding 与 TS 引用。[官方说明](https://angular.dev/reference/migrations/signal-inputs)默认跳过不安全的 input；`--best-effort-mode` 可造成构建破坏，`--analysis-dir` 会静默漏过目录外引用，而 `--path` 限定修改范围不等于限定分析范围。**[一手：文档，2026-10-15 核实]**

固定 [`731ad651`](https://github.com/angular/angular/tree/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration)的 [incompatibility 枚举](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration/src/passes/problematic_patterns/incompatibility.ts)区分继承冲突、写入、accessor、模板 narrowing 等；[golden 输出](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/migrations/signal-migration/test/golden.txt)既有提取局部变量后保持 narrowing 的变换，也有写入或不支持模式的跳过及原因。能在语法之外核对这些约束，是复用框架迁移器的具体理由；保守跳过也是有效结果，不应为提高改动文件数直接强制转换。**[一手：固定源码／期望夹具，未执行]**

**选择边界。** 来源／形状统一且规则覆盖时用语法迁移器；依赖跨文件、继承或 narrowing 时选能解析本项目的类型／框架工具。少量例外交 Agent；例外占多数则退回直接补丁。无通用文件数阈值或同任务 Agent 对照。**[研究／经验]**

### 批量入口：先选改法，再选执行方式

2026-10-15 UTC回读：[Claude官方fan-out配方](https://code.claude.com/docs/en/best-practices#fan-out-across-files)仍建议前2–3个文件调提示，再全量执行；[commands的/batch条目](https://code.claude.com/docs/en/commands)仍描述5–30个独立单元、计划批准后各在worktree执行。数字本身没有过时，但不是迁移覆盖或操作授权的通用门槛。[Angular当前文档](https://angular.dev/reference/migrations/signal-inputs#configuration-options)则明确：`--path`限修改范围，默认仍分析全workspace；缩小`--analysis-dir`会静默遗漏外部引用。只按文件分片可能破坏现成分析的前提。**[一手：当前官方契约，只读]**

[Anthropic迁移复盘](https://claude.com/resources/articles/ai-code-migration)（2026-07-16）的依赖图与Step 2还区分保结构移植和重设计：三文件逐行比较适用前者，后者改为设计审阅与可丢弃的端到端试跑。这是厂商经验，不证明所有迁移都需相同评审层或扔掉首产。结合本节TanStack再使用反馈及Angular固定机制，15总表／§5与Claude入口统一为“先选改法、按差异试点、再按依赖和风险扩量”，不再把少量文件通过或有测试等同于全量迁移可高自主执行。工具功能表保留真实5–30描述；没有新增模型实验或净收益测量。**[一手：作者复盘；经验：入口收敛]**

### 重复执行与第二次需求不是同一项保证

**同一次批处理也可能重复修改同一文件。** Angular 用户 Wandang 的 [#61611](https://github.com/angular/angular/issues/61611)（Angular 19.2.12）报告模板出现 `title()()` 与重复 TODO。维护者[指向已修复的 #61421](https://github.com/angular/angular/issues/61611#issuecomment-2901248608)，其根因是多个 tsconfig 的源文件重叠。固定 [run_in_devkit.ts](https://github.com/angular/angular/blob/731ad651bee44bd51af9d27d20a3c07260e17bb8/packages/core/schematics/utils/tsurge/helpers/angular_devkit/run_in_devkit.ts)用文件到编译单元的归属表，避免同一源文件在不同单元重复分析／生成替换；这不是证明所有变换均幂等。维护者通过 [#61612](https://github.com/angular/angular/pull/61612)回移到 19.2.x（落地提交 [`2ae69f7`](https://github.com/angular/angular/commit/2ae69f77e7ef9a6431303cfad54cabb068435d6f)）；本轮只读核对 19.2.13 与 20.0.0 标签的同路径均已包含归属去重，未独立运行或取得该用户修复版复测。**[社区：故障报告；一手：维护回复与源码]**

**调用方的次数也需核对。** Renovate [#8220](https://github.com/renovatebot/renovate/issues/8220) 的 marcodejongh 报告：依赖升级从一次调用变为逐依赖调用后，同仓五处依赖使 codemod 执行五次，部分非幂等变换破坏代码。后续 [#8725](https://github.com/renovatebot/renovate/pull/8725)增加 `executionMode: branch`，历史固定 [`6afbcf8`](https://github.com/renovatebot/renovate/commit/6afbcf8d18afd3e63e0d4d253be64c5a21e736c5)的 [index.spec.ts](https://github.com/renovatebot/renovate/blob/6afbcf8d18afd3e63e0d4d253be64c5a21e736c5/lib/workers/branch/index.spec.ts)在两项升级配置下断言命令只调用一次；作者勾选单元测试及真实仓库验证，发布回复标为 24.109.0。该测试约束调度次数，不检验具体 codemod 输出；`branch` 也不承诺后续重新生成分支时永不再执行。**[社区：使用与作者验证报告；一手：补丁／断言，只读]**

**验收与停止。** 试点含旧／已迁移形状、跨文件及业务例外，核跳过原因并验类型／行为。重试先在首轮产物上重跑；一次性工具则从可恢复起点重做。分片须文件归属不重叠；额外变换、覆盖不明或例外增多即暂停扩量。**[经验：未运行迁移实验]**

幂等不等于行为正确或适应新需求；映射／契约改变后，更新规则、回归与版本，从上次交付状态验新旧行为。只读夹具不证明模型或维护收益。**[研究]**


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

主线：三；区分测试断言有效与本次验证确实执行了它。
改变的建议：15 §6 在依赖、预打包配置或非模块夹具变更后显式运行已有消费者，09 只回链；普通增量运行足够时不加评审层。
新证据：Vitest 原生执行依赖记录的发布、固定实现与测试定义，另有同周预打包漏选报告；2026-10-15 UTC 核实，验证范围见本节末尾。**[一手／社区／研究]**

### 原生能力与反证

[Vitest 5.0.4](https://github.com/vitest-dev/vitest/releases/tag/v5.0.4)发布于 2026-10-12，[#11515](https://github.com/vitest-dev/vitest/pull/11515)合并于 10-08。[官方契约](https://vitest.dev/config/experimental.html#experimental-recorddependencies)规定 `experimental.recordDependencies` 默认关闭，按上次执行记录为 `--changed`／`related` 选测；动态导入须执行过，普通 `fs` 读取和 externalized 模块内部导入不记录。新增 import 若先提交未重跑，后续只改新依赖可能漏选。**[一手：发布、合并与当前契约]**

[测试定义](https://github.com/vitest-dev/vitest/blob/c06012ac8419ca4ea14a8808aedc8b0120111f81/test/e2e/test/recorded-deps.test.ts)覆盖动态导入、无记录与部分运行；[选择实现](https://github.com/vitest-dev/vitest/blob/c06012ac8419ca4ea14a8808aedc8b0120111f81/packages/vitest/src/node/recorded-modules.ts)在无记录时回退全选，有记录则匹配变化模块。**`-t`／`.only` 等部分运行只合并已有记录，不创建新记录**，刷新导入关系须完整跑相关测试文件。无记录的测试仍会运行；缓存关闭则记录功能不生效。**[一手：源码、测试与文档，未运行]**

[#11585](https://github.com/vitest-dev/vitest/issues/11585)创建于 2026-10-14，核实时 open、无评论，**未经维护者确认或本仓复测**。作者修改 linked workspace helper，保留已有失败断言：关闭 optimizer 时 `changed`／`related` 选中并失败，开启后零选中、退出 0；含 5.0.4／4.1.10 对照，称 5.0.4 记录模式仍漏选。[受影响模块实现](https://github.com/vitest-dev/vitest/blob/28dc1edfb6ba5a181fe208576989063795aeadb3/packages/vitest/src/node/affected-modules.ts#L240-L251)过滤 `node_modules`，[后续遍历](https://github.com/vitest-dev/vitest/blob/28dc1edfb6ba5a181fe208576989063795aeadb3/packages/vitest/src/node/affected-modules.ts#L345-L349)仅沿过滤后的导入遍历，支持作者机制解释，非完整复现或所有 optimizer 项目失败。**[社区：单作者报告；一手：源码；研究：边界]**

### 采用范围与退回条件

- ✅ 先保留项目已有增量测试；依赖关系、optimizer 或非模块夹具改变，显式运行已知消费者，或用项目已有且适用于当前入口的映射。已知相关用例却零选中时，先直接运行该测试，再修触发配置或按风险暂用更宽套件；无需为此添 reviewer 或自建依赖图。**[经验：采用判断]**
- 🧪 只有实际动态导入是当前选择盲区、且能维护缓存与刷新记录时，试用默认关闭的 `experimental.recordDependencies`；不作为正文 ✅ 的默认开关。已有静态关系已足够时无需启用，本轮没有计时或净成本数据。**[一手：机制；经验：条件试用]**
- [普通 `related`](https://vitest.dev/guide/cli.html#vitest-related)支持静态可解析导入；非模块读取可按项目需要使用 [watchTriggerPatterns](https://vitest.dev/config/watchtriggerpatterns)，但它是 watch 契约，不能冒充所有 CLI `changed` 的映射。[forceRerunTriggers](https://vitest.dev/config/forcereruntriggers)与 `--changed` 配合时，diff 命中会触发全套；这是有执行成本的特定回退，不是每次修改的默认。**[一手：官方契约；经验：取舍]**

仅回读文档、版本、issue 与固定源码／测试，未运行 Vitest、模型或远端 CI，未测收益；作者关闭 optimizer 的对照不作普遍推荐。**[研究：范围]**


### 原生失效判断：撤掉在选择器之前重放旧结果的缓存

2026-10-17（UTC+8）补核；改变 15 §6：原生选测已能判断环境变化时，先撤掉绕过它的外层短路，配置失效走已有扩大路径；07 只回链。**[研究：采用判断]**

Polylogue [#1059](https://github.com/Sinity/polylogue/issues/1059)采用 testmon 替换自制文件／导入路由。[初版 `8a2c0332`](https://github.com/Sinity/polylogue/commit/8a2c0332961228dd1135d069c7d21326f7e96575)后，[修订 `09b84c37`](https://github.com/Sinity/polylogue/commit/09b84c37e22a159d293dcb0bc6b7be95ea0d445e)删除外层结果缓存：旧指纹含 HEAD、工作区差异、未跟踪文件与 testmon 数据库，却不含当前 Python／安装包；匹配后在构造和运行检查之前直接返回旧退出码。testmon 自己的[固定环境判断](https://github.com/tarpas/pytest-testmon/blob/dccc58d2ed8edec98096ff1974acb7c07d3e3482/testmon/db.py#L647-L711)会比较 Python 与包身份，因此外层命中可使它根本没有机会判断。**[一手：固定补丁／源码；研究：机制推导，不是漏测率]**

[#1066](https://github.com/Sinity/polylogue/pull/1066)已合入 `da72933`。其[实现](https://github.com/Sinity/polylogue/blob/da72933da8fe385d400647fc064a0111cfb0b535/devtools/verify.py#L370-L403)从 seed 到 HEAD、工作区及未跟踪文件按清单检查配置、锁文件与部分共享测试设施；命中或 Git 查询失败时取消 testmon 选测，成功后刷新 seed。[命令构造](https://github.com/Sinity/polylogue/blob/da72933da8fe385d400647fc064a0111cfb0b535/devtools/verify.py#L265-L283)仍排除 integration，指定 `--skip-slow` 时仍过滤 slow；这只是该配置范围扩大，不能称整个项目全套。[测试定义](https://github.com/Sinity/polylogue/blob/da72933da8fe385d400647fc064a0111cfb0b535/tests/unit/devtools/test_verify.py#L89-L117)核命令与失效路径分类，不是所有环境变更的端到端证明。**[一手：合入实现与测试定义]**

**扩大清单本身仍有缺口。** 该版前缀匹配不命中 `tests/unit/core/conftest.py`；[原 P1 评审](https://github.com/Sinity/polylogue/pull/1066#discussion_r3250832660)指出嵌套夹具风险；清单未触发不等于原生依赖记录必然漏选。作者 [9 月跟进](https://github.com/Sinity/polylogue/pull/1066#issuecomment-5918980468)以 `5ebcfe59` 历史快照复核，仍不宣称修复：新增 autouse fixture 没有先前执行关系。应用时先确认扩大入口覆盖本次夹具，缺口未闭合就显式运行相关消费者或更宽套件；这不否定外层缓存撤除，也不把旧快照当当前 master 状态。**[一手：固定源码；社区：评审与作者历史复核；经验：采用边界]**

作者报告扩大运行 6,449 例、pytest 149.90 秒，紧接增量运行零选中、3.24 秒；它说明作者观察到回到增量，不能算长期节省或证明零选中总是正确。未取得原始运行日志，未执行上游测试、模型或 CI。采用这条修订机制仍须保留项目原有验收范围与非空要求。**[一手：作者报告；研究：验证边界]**


### 新增选测能力：先比较改动类型与完整运行成本

> 2026-10-16 UTC 补核；主线三，改变 15 §6 新增选择器的采用条件，不改变本仓检查入口。沿用已有增量验证主题，不再列工具排名或重复 Vitest 边界。

remote-store [2026-10-03 研究报告](https://github.com/haalfi/remote-store/blob/45132599a2818fe1e02eb15c9e2016bada5a0103/sdd/research/research-bk-403-testmon-poc.md)在测试昂贵时仍暂缓 pytest-testmon。作者报告工作树 `12f8043`、testmon `2.2.0`；本轮读文档与 driver 快照 `45132599a2818fe1e02eb15c9e2016bada5a0103`，未证它就是原运行版本，亦缺完整 JSONL／JUnit 工件。以下数值均为使用方报告，非本仓复测。**[一手；研究：身份边界]**

- **收益取决于改动。** 串行全套墙钟 `551.3 s`，叶函数种子 `4.8 s`、核心模块 `296.3 s`；`0.9%`／`53.7%` 是时间占比，非测试比例。并行全套 `204.0 s`、建映射 `218.0 s`，不能只比最慢串行，也未计完整安装、维护和长期补跑。每项仅计时一次，13 个刻意种子不是日常改动频率样本。**[一手：使用方报告；研究：比较边界]**
- **运行其他测试仍可能漏目标。** `_azure.py` 追加类的种子跑了 825 例，却漏掉读取源码文本的检查；读取代码文本不等于执行代码。另有非 Python 夹具漏选，但不能外推全部 fixture 或模块变更。**[一手：使用方报告；研究：机制]**

[固定 driver](https://github.com/haalfi/remote-store/blob/45132599a2818fe1e02eb15c9e2016bada5a0103/sdd/research/bk-403-testmon-poc/driver.py)为各种子定义修改和目标：关闭 testmon，要求退出 1 且对应 JUnit case 失败，再复制原映射选测。它分别记录 `known_selected` 与 `known_failed_in_selected`，选中列不能替代失败列。临时 JSONL 未公开，源码只证方法可查；13 项确认失败仍是作者自述。**[一手：源码与报告；研究：边界]**

**完整检查还有更便宜的优化。** [固定成本审计 L1／L2](https://github.com/haalfi/remote-store/blob/45132599a2818fe1e02eb15c9e2016bada5a0103/sdd/audits/audit-022-gate-speed-strategies.md)报告隐私扫描正则在长 base64 上重复起匹配，占 `157 worker-seconds`；窄改起点后，478 份 cassette 和三个探针判定不变。另次覆盖率的默认 tracer／sysmon 墙钟为 `310 s`／`250 s`；前者非墙钟，异实验不可相加。样本判定不变不授权删 PII 检查或放宽规则；该 testmon 路径还不兼容 sysmon，不能直接组合。**[一手：使用方审计；研究：成本与安全边界]**

[PyPI 元数据](https://pypi.org/pypi/pytest-testmon/json)仍列 `2.2.0`（2025-12-01 上传）；[官方说明](https://www.testmon.org/)说明只跟踪已执行代码，不跟踪静态文件或外部服务。tag `dccc58d2ed8edec98096ff1974acb7c07d3e3482` 的[环境判断](https://github.com/tarpas/pytest-testmon/blob/dccc58d2ed8edec98096ff1974acb7c07d3e3482/testmon/db.py#L647)比较包与 Python 身份，支持计入映射重建条件，不证明遗漏已修或当前漏选率。未安装、运行 testmon、上游测试或模型。**[一手：元数据、契约与源码；研究：范围]**

✅ 保留可靠原生选测。新增前比较不减覆盖的热点修复与安全并行，再估映射／补跑总成本；核心常变、重建频繁或消费者超出模型时暂缓，不照搬该项目回退规则。**[经验：采用与撤回]**

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

核实：2026-10-15 UTC；主线四，兼三；改变 15 §2。**兼容性未必随版本改善：修一种映射仍可能损坏另一输入。按输入机制选择修生产端、换消费者或条件绕过，保留仍有用途的能力。** 一次通过不保证全数据集；最终消费者、备份和恢复沿用既有规则。**[经验：采用判断]**

**乱码未导致整体回退渲染器。** 2026-09-15，olafure 在[OCRmyPDF #1747](https://github.com/ocrmypdf/OCRmyPDF/issues/1747)报告外观正常、复制乱码，提出回退默认 fpdf2 renderer；[fpdf2 #1952](https://github.com/py-pdf/fpdf2/issues/1952)记 fpdf2 2.8.8、Ghostscript 10.02.1、Linux/Python 3.13，个人书库 57 本书刊受影响。分析由 Claude 协助，用户只明确确认两份脚本复现，不是全部分析、影响比例或恢复判断的独立核实。150 个输入字符生成 117 条映射，101 个只有 96 条，因此触发条件是**单块映射超过 100 条**，非文档超过 100 字符。**[社区：原报告与复现确认]**

[维护者回执](https://github.com/ocrmypdf/OCRmyPDF/issues/1747#issuecomment-5691459605)以同文件比较 Ghostscript：9.55 保留映射，10.02.1 丢弃，10.05 保留但警告，10.06 保留，因此选择生产端拆块而非回退 renderer。[7e3007746fe646f561f1fe0eb3a501f6c6136747](https://github.com/ocrmypdf/OCRmyPDF/commit/7e3007746fe646f561f1fe0eb3a501f6c6136747)将 fpdf2 写出的 CMap 按最多 100 条分块，覆盖 bfchar、bfrange、cidchar、cidrange；它包装私有输出注册方法，`FPDF2_CMAP_BLOCKS_FIXED=None` 表示尚未设补偿退出版本，不能宣称维护成本已消失。**[社区：维护者运行报告；一手：固定补丁]**

随后合入[fpdf2 #1954](https://github.com/py-pdf/fpdf2/pull/1954)（`2082d9c01d17decfab10ddd741de836283eab397`），处理两条 ToUnicode 路径；[后续 #1956](https://github.com/py-pdf/fpdf2/pull/1956)（`82981ecd2769ffb3f0f57ac44dd996f2ac138da4`）扩至 Encoding 的 cidchar。仅核合入代码，未核首次正式发布或下游补偿撤除，不能泛称升级 fpdf2 已修复。**[一手：跨项目修订]**

**另一输入的反证。** kmn5 在[#1744](https://github.com/ocrmypdf/OCRmyPDF/issues/1744)报告 OCRmyPDF 17.11.0／Ghostscript 10.6.0 的 PDF/A 丢失 fi／ff 等连字文字，普通 PDF 和 sidecar 正确；PDF/A-2b 合规不保证文本可搜索。[ffee83231532f4f67b8c0e756cddec67446570c9](https://github.com/ocrmypdf/OCRmyPDF/commit/ffee83231532f4f67b8c0e756cddec67446570c9)诊断 10.05–10.06 会丢多字符 ToUnicode 映射：不可见拉丁等无需上下文整形的文字改逐字符编码、去掉可选连字；复杂文字保留必要整形并对受影响 Ghostscript 警告，可见调试文字仍整形。**超长块安全不代表连字安全，绕过须按用途收窄。** 未独立核 Ghostscript 上游完整修复链，不另推荐当前版本。**[社区：独立用户故障；一手：固定实现；研究：机制比较]**

**运行与恢复边界。** #1747 定义 Ghostscript 往返测试，缺依赖即跳过；抽取断言还需 pdftotext，仅查大写字母样例，不覆盖连字、全部文字或 57 本书库。#1744 另有逐字符映射与抽取测试，均非本轮执行或全部 CI 核验。维护者建议用修订后的 OCRmyPDF 重做原扫描件，但未见原用户全库恢复回执，关闭 issue 不能替代恢复。只读讨论、源码和测试，未安装或运行 OCR、PDF 工具、模型；Claude 协助诊断不证明故障代码由 AI 生成或有净收益。**[一手：测试范围；社区：恢复建议；研究：限制]**

**采用与撤回。** 按触发输入保留必要能力，优先窄格式修复／条件绕过；全部支持输入都无需该能力才考虑删除。复用消费者验收；分流破坏语义时撤回、缩范围或换已验证消费者，不推广到任意格式。**[经验]**


## 配置迁移：保留作用阶段与设备边界

核验：2026-10-15（UTC）。配置归属之外，还须区分生效阶段与设备。先复用分层、优先级和选择性同步；共同交付保持一致，编辑期合法差异与机器衍生值分别处理。不为统一配置另建框架，调查也不授权改变用户安全或同步设置。**[经验：采用判断]**

### Ruff：个人覆盖可合并，但文件替代仍可能失去同步

[讨论15991](https://github.com/astral-sh/ruff/discussions/15991)中，stinodego 希望个人编辑规则不强加同事；维护者建议独立配置合并项目，2025-02-25 用户初试符合需要。jtchen2k 报告外部文件生效却失去跨设备同步；ilCatania 要求团队共用但仅编辑期生效，以保留探索代码、提交时清理。三者分别支持范围、同步和阶段需求，非同一用户的无损迁移闭环。**[社区：使用与初试；一手：维护者建议]**

[PR16296](https://github.com/astral-sh/ruff/pull/16296)于 2025-02-26 合并，固定 be03cb04c13cbd74467acdb4a1501b620db16975 新增内联配置并保留路径形式；[配置合并实现与测试](https://github.com/astral-sh/ruff/blob/be03cb04c13cbd74467acdb4a1501b620db16975/crates/ruff_server/src/session/index/ruff_settings.rs)处理两种输入，测试特定编辑器设置相对内联配置的优先级。VS Code 需配套[#702](https://github.com/astral-sh/ruff-vscode/pull/702)，不保证旧客户端支持。**[一手：固定源码与测试定义，未运行]**

[当前官方设置文档](https://docs.astral.sh/ruff/editors/settings/)保留两入口，内联自 0.9.8 引入；未设编辑器配置时读项目配置，冲突可选编辑器优先、文件优先或仅编辑器。原生能力可承载个人体验，无需改变共享规则或自建同步。未获 jtchen2k 对最终内联版的跨设备回访，前一用户初试不能证明这项收益。**[一手：文档；研究：边界]**

### Firefox：依赖本机OS的偏好，收窄到单项停止同步

[Bug1851024](https://bugzilla.mozilla.org/show_bug.cgi?id=1851024)涉及`general.smoothScroll`：默认随各机器OS减少动态效果设置变化，用户报告显式关闭后仍被重新开启，涉及Mac与Windows。[维护者最终取舍](https://bugzilla.mozilla.org/show_bug.cgi?id=1851024#c31)是停止同步这一项。固定[ff976fb221cb17c7bec216b8ca2cfa3d913a19a1](https://github.com/mozilla-firefox/firefox/commit/ff976fb221cb17c7bec216b8ca2cfa3d913a19a1)于2024-08-16仅移除`services.sync.prefs.sync.general.smoothScroll=true`并留下注释，相邻其他同步项保留；记录标Firefox131修复。**[社区：使用反馈；一手：决定与固定补丁]**

原作者与 QA 曾无法复现，不启用偏好同步者也报类似症状，不能全部归因 Sync。未见原作者最终版回访，QA 白板非通过回执；补丁只改默认同步集合，不保证覆盖自定义规则，也不支持停止全部同步。**[研究：反证与结果边界]**

[Bug1928570](https://bugzilla.mozilla.org/show_bug.cgi?id=1928570#c12)报告 132 版类似症状，维护者排除 Sync，用户定位到 Resist Fingerprinting；维护者解释为预期设计并[以 INVALID 关闭该 issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1928570#c16)。它不是同步补丁复发，也说明停止同步不能解决一切滚动问题；这里只区分配置来源，不建议关闭隐私功能。**[社区：后续定位；一手：维护者解释]**

### 反向约束：共同产物仍须一致

[Prettier官方配置说明](https://prettier.io/docs/configuration)不支持全局配置，以保持换电脑后的项目格式一致；从被格式化文件位置查配置，并允许项目内限定覆盖。设计目的不是收益测量，但反对把 Ruff 个人覆盖推广为所有工具都应个人优先。**[一手：官方设计；研究：反例]**

**证据边界。** 用户初试、源码与设计分开计证；未运行客户端／同步／上游测试，未测 AI 收益。**[研究]**


## 原生下拉菜单的截图与语义验收

主线二／四；核实：2026-10-15 UTC。改变23的观测选择：原生 `<select>` 选值与应用结果优先语义验收；只有展开层外观属于要求时，才补目标浏览器／系统实际屏幕，不因网页截图缺失重写控件。**[研究：采用判断]**

Playwright [#38200](https://github.com/microsoft/playwright/issues/38200)报告展开原生下拉后，macOS 截图缺菜单、Ubuntu 位置异常、Windows 挂起；[维护者](https://github.com/microsoft/playwright/issues/38200#issuecomment-3533050490)在 macOS、Ubuntu 及原始 CDP／Puppeteer 路径复现类似问题。2026-01-07 [关闭说明](https://github.com/microsoft/playwright/issues/38200#issuecomment-3718636129)说明跨平台原生实现不同、无 Playwright 行动项，后为视觉 Agent [建议整屏捕获或DOM文本补充](https://github.com/microsoft/playwright/issues/38200#issuecomment-3720341206)。closed／v1.58 标签不证明修复发布，历史限制也不代表所有当前版本或系统。**[社区：报告；一手：维护者解释]**

[固定复现库](https://github.com/kisotechnology/playwright-screenshot-issue/tree/0f1f0177f07c3ce70e49168c60d460f89cbda9ef)的 `scripts/capture-dropdown.js` 以 headed Chromium 点击 select，再取全页截图；已查看展开和缺菜单配图，但尺寸不同，不是严格同条件对照。作者报告 1.56.1，`package.json` 却为 `^1.41.2` 且无锁文件，不能固定实际安装版本。**[一手：源码与产物；社区：版本自述]**

[当前selectOption契约](https://playwright.dev/docs/api/class-locator#locator-select-option)选择选项并触发 input／change，可验应用结果，不能证明原生展开层外观。不外推全部浏览器 UI 或默认增加桌面工具；未安装、运行浏览器或复演上游。**[一手：契约；经验：边界]**

## rclone：预演不能替下一轮提交控制状态

主线三；核实：2026-10-16（UTC+8）。
改变15 §6：预演验收除业务数据外，还须保护下一轮正式执行所依赖的接受状态；允许日志与隔离预演产物，不要求一概零写入。
新证据：rclone过滤规则hash修复、连续场景预期、贡献者后续使用，以及CLI／rc入口的分次修订。**[研究：采用判断]**

[2023-04-16原报告](https://forum.rclone.org/t/bisync-bugs-and-feature-requests/37636)中，定时 bisync 使用 `--filters-file`；改规则后先跑 `--resync --dry-run`、尚未正式采用，下一次普通运行却未拒绝新规则。预演写入 `.md5`，更新了接受基线。报告只讨论潜在损失，没有这一路径实际删除业务文件的回执。**[社区：原报告；研究：边界]**

[固定提交f4dd862](https://github.com/rclone/rclone/commit/f4dd86238d5b5993a5f104c58b2f34c2d6fdad56)在 `applyFilters` 中仅为非 DryRun 的 resync 保存 hash；普通运行仍拒绝 hash 缺失或不符。它保留独立 `-dry` 列表文件，因此要求是隔离预演产物与正式接受基线，不是一概零写入。**[一手：补丁；研究：机制]**

[固定scenario](https://github.com/rclone/rclone/blob/f4dd86238d5b5993a5f104c58b2f34c2d6fdad56/cmd/bisync/testdata/test_filtersfile_checks/scenario.txt)先 resync 建 hash、确认普通运行成功，再换过滤文件并预期拒绝；新增预演 resync 成功、下一普通运行仍拒绝两步。[golden日志](https://github.com/rclone/rclone/blob/f4dd86238d5b5993a5f104c58b2f34c2d6fdad56/cmd/bisync/testdata/test_filtersfile_checks/golden/test.log)表达相同预期。这是历史连续验收设计，未本轮执行，且 scenario 注明不测过滤的实际效果。**[一手：历史测试产物；研究：范围]**

原报告者也是修复贡献者：[补回漏交的golden日志后报告GitHub测试通过](https://github.com/rclone/rclone/pull/6971#issuecomment-1520596549)，按评审[把相关代码、文档和测试重新组织到各提交](https://github.com/rclone/rclone/pull/6971#issuecomment-1632281021)，又在[数周真实使用后再补一处问题](https://github.com/rclone/rclone/pull/6971#issuecomment-1666839385)。这支持持续使用与修改，不是独立接收者对 filter-hash 的最终复测，也不证明单项工时收益。**[社区：贡献者报告；一手：修订过程]**

**各入口分次修复。** [48ab67f](https://github.com/rclone/rclone/commit/48ab67f090fd630c3ed9cc66d6fe83eca769ce12)才把 rc 专属 `dryRun` 传入 `Options.DryRun`；[v1.64.0的cmd.go](https://github.com/rclone/rclone/blob/v1.64.0/cmd/bisync/cmd.go)与[rc.go](https://github.com/rclone/rclone/blob/v1.64.0/cmd/bisync/rc.go)分别含两项修复。2026-10-14 合入[#10015](https://github.com/rclone/rclone/pull/10015)，再补全局 `_config.DryRun`／flat `dry_run`：配置应用移到公共 `Bisync` 入口，全局预演不能被 rc 的 `dryRun:false` 取消。这是本接口取舍，不是通用优先级。**[一手：源码、标签与 PR]**

[固定rc测试](https://github.com/rclone/rclone/blob/be46eaa1f0fe8df62f522bf4fab22c30d0d92d1d/cmd/bisync/rc_test.go)经 `jobs.NewJob` 检查专属、全局及冲突参数，再观察目标新文件；仅本地路径，非云存储。[合并快照changelog](https://github.com/rclone/rclone/blob/be46eaa1f0fe8df62f522bf4fab22c30d0d92d1d/docs/content/bisync.md)列 v1.76，核实时[最新发布仍为v1.75.2](https://github.com/rclone/rclone/releases/tag/v1.75.2)，因此本次合并尚未发行给接收者。**[一手：测试、changelog 与发行；研究：边界]**

**采用范围。** 有持久基线时复用预演前后及下一正式调用的连续检查；换入口只补参数传递和效果。纯计算预览无需本项。未运行 rclone／模型或独立核 CI，缺独立逐例复测及 AI 收益证据。**[经验／研究]**


## 清 lint：保留异步调用契约，还是删除 async

主线：三，兼二；改变 15 §4 清理诊断时的选择。
改变的建议：先核执行上下文及调用者契约；有意的异步边界可窄范围豁免，不机械删除或添加无业务需要的等待；确实无异步契约时仍可重构。
新证据：Ruff 原用户报告、合入的文档修订与固定规则／运行器源码；ESLint 对 Promise 拒绝处理的独立反例。核实：2026-10-16（UTC+8）。**[一手／社区；经验：采用判断]**

[Ruff #23196](https://github.com/astral-sh/ruff/issues/23196)作者在 FastAPI 中用 pytest-asyncio 测 `ContextVar` helper：缩减复现用 `asyncio.run` 执行 coroutine 得 `1/1/1`，删 `async` 直接外层调用得 `1/2/3`。版本为 Python 3.11.11、Ruff 0.15.0，缺 pytest-asyncio 版本、配置及完整项目。维护者归因执行时机和上下文；RUF029 只报缺异步语法，无 autofix。因此不是 Ruff 自动破坏路由，也不是完整框架复测。**[社区：用户与维护者讨论]**

[#26641](https://github.com/astral-sh/ruff/pull/26641)于 2026-07-09 合入[`04d831a`](https://github.com/astral-sh/ruff/commit/04d831a7202b1274a1e1973c4d8443d754a51faa)，只补文档：无 `await` 的测试或 callback 也可依赖 async context，按需加真实 await 或局部禁规则。[同提交规则源码](https://github.com/astral-sh/ruff/blob/04d831a7202b1274a1e1973c4d8443d754a51faa/crates/ruff_linter/src/rules/ruff/rules/unused_async.rs)仅调用 `report_diagnostic`，已有 class methods、stubs、识别的 FastAPI routes、`asynccontextmanager` 豁免，[fixture](https://github.com/astral-sh/ruff/blob/04d831a7202b1274a1e1973c4d8443d754a51faa/crates/ruff_linter/resources/test/fixtures/ruff/RUF029.py)表达预期。这不是新增行为修复；Test Plan 非本轮回执，未获原用户复测。**[一手：补丁与测试定义；研究：边界]**

**隔离取决于运行方式。** pytest-asyncio [`f287e5e` 的测试入口](https://github.com/pytest-dev/pytest-asyncio/blob/f287e5e0f5425380b24c32b64037dfb2ed3cb937/pytest_asyncio/plugin.py#L561-L571)复制 async test context，经[包装器](https://github.com/pytest-dev/pytest-asyncio/blob/f287e5e0f5425380b24c32b64037dfb2ed3cb937/pytest_asyncio/plugin.py#L891-L908)传给 `runner.run`；async fixture 另有传播和恢复，不能统称状态隔离。[Python Task 契约](https://docs.python.org/3/library/asyncio-task.html#asyncio.Task)允许显式 context，默认才复制。只证当前机制，未证历史项目用了此实现；同一任务内 await 函数也不保证独立上下文。**[一手：源码与契约；研究：边界]**

[ESLint `require-await` 的 When Not To Use It](https://eslint.org/docs/latest/rules/require-await#when-not-to-use-it)给出无 await 而直接抛异常的 async 反例：调用者用 Promise 的 `.catch()`，改同步会直接抛出，须改变调用者，因此可以禁用规则。机制不同于 Python context，但都要求保住调用契约，不是保留所有无 await 函数。**[一手：官方反例；研究：比较]**

**适用性反例，不追加另一套流程。** [RUF055 #27024](https://github.com/astral-sh/ruff/issues/27024)中 bytes 正则搜索 `memoryview` 与改写后的成员判断不等价；[维护者拒绝 #27040](https://github.com/astral-sh/ruff/pull/27040#issuecomment-5050042567)也反对把所有 bytes-pattern 修复一律标不安全，因为 bytes 目标仍有有效情况，问题在目标类型与规则适用范围。核实时 #27024 仍 open，#27040／#27233／#27715 均关闭未合并；不能拿候选 PR 的测试或安全分类当已交付修复。固定 current main [`9e3ea63` 规则源码](https://github.com/astral-sh/ruff/blob/9e3ea63fb43040782a2ff00147cacf8861674615/crates/ruff_linter/src/rules/ruff/rules/unnecessary_regular_expression.rs)仍按 pattern、参数数量和真假值使用条件筛选，未核目标类型，修复的 Safe／Unsafe 分类取决于 comments。本轮另用手写 Python 3.12.14 标准库表达式核对：`memoryview(b"abcdef")` 上 `bool(re.search(b"abc", value))` 为 True、`b"abc" in value` 为 False；bytes 对照为 True／True。这只是局部语义见证，没有执行 Ruff 修复或当前发行版，也不是原用户框架复测；不推断全部修复不可信。**[一手／社区；经验：本轮标准库局部核对；研究：修订状态与采用边界]**

**采用范围。** 核真实调用者／运行器；有必要契约才窄范围豁免并验行为，否则正常重构。不能为消警告默认加 `sleep(0)`，它会改变调度。除上述标准库表达式外仅只读，未运行 Ruff／pytest／上游测试或测长期收益。**[经验／研究]**


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
