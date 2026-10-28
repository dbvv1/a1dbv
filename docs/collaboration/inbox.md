# 前沿收件箱

> 用户在 X、linux.do、技术群等处看到的 AI coding 项目、帖子、做法，直接把链接贴在下面（一行一条，可附一句话说明为什么觉得有意思）；dot-A 每周扫描发现的候选也记在这里，标明来源。只贴公开链接，不贴私聊截图或账号信息。dot-A 在 24 小时内处理：写明它对应本仓哪个任务或使用中的问题，能转化的进试用，只是值得一试的新工具进 [13 前沿雷达](../13-frontier-radar.md)“值得一试”表，一行两句以内；处理后在行尾标 ✅ 和去向，本仓此前已收录的标“已有”。规则见[运行手册 §3](LONG-TERM-PLAN.md#3-怎么探索)。

## 待处理

- 👀 **Node `pg` 连接池或约束迁移先查原生文档，Supabase Postgres Skill 按条核对后再试**：固定 `c9be0e93` 的[连接池配方](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md#L42)仍建议不存在的 `{ prepare: false }`，而 [pg 源码](https://github.com/brianc/node-postgres/blob/2a5850fb0db18f5e40a642bbb4a4743de412ab54/packages/pg/lib/query.js#L8-L55)／[官方用法](https://node-postgres.com/features/queries#prepared-statements)以 query `name` 启用命名缓存；[约束配方](https://github.com/supabase/agent-skills/blob/c9be0e931b7930f7d02126d04774d904c381e7d7/skills/supabase-postgres-best-practices/references/schema-constraints.md#L38-L63)后两个存在性检查未限定表，可能因别表同名约束而漏建（[Postgres 目录说明](https://www.postgresql.org/docs/current/catalog-pg-constraint.html)）。[实际采用者 #83](https://github.com/supabase/agent-skills/issues/83)亦报这两项，本仓已核当前源码、未安装 Skill 或运行数据库，其余规则未作全面评价（核实 2026-10-28）。

- 👀 **Ruff：让实际命令体现环境前提**——[维护者反馈](https://github.com/astral-sh/ruff/pull/29190)旁注未阻止 Codex 先跑不适用的监听测试，遂[把过滤写进命令](https://github.com/astral-sh/ruff/commit/7c6f8fc8fc5655dfa47e125b05453007b9e7a6c7)；仅不提供所需 OS 事件的环境适用，涉及监听行为的改动须在支持环境另验。本仓只在独立真实发布中预选既有授权的连接器入口以避开已知 CLI 缺写认证（不适用于权限拒绝）；路径依据执行回执而非 Git 提交，Ruff 命令未试用，未作同题对照，作为[共享指令](../decisions/instruction-files.md)候选（核实 2026-10-28）。

- 👀 2026-10-28 核读：[Max Nardit 的 AGENTS 提示实验](https://max.nardit.com/articles/agents-md-viral-lines-tested)（10-25，Claude Code 2.1.310／Opus 5.5、Sonnet 5.5；两个小任务、90 次运行，每个条件单元 5 次），作者观察到删辅助文案连带删掉输入检查。race／security 防护“先解释再等批准”的提示未被有效检验：任务本已注明单线程、各组很少加锁，且 print 模式无人回应审批；本仓未试用，仅作 Codex 过度工程的来源候选，不新增默认。

<a id="cline-image-token-estimate"></a>
### 2026-10-28：Cline 读图后过早压缩，先分清内部估算与服务端用量

🧪 **Cline 读过截图或 PDF 页面图后提前压缩，先核客户端版本，再按同一次请求对照内部估算与服务端 usage。** 旧版把图片 base64 按文本的 3 字符／token 计入估算；#14520 已修复，并进入 **4.1.24 发布源码**。遇相符症状，优先使用含修复的版本，不凭压缩提示认定窗口耗尽，也不先关闭自动压缩。

修复在正常序列化路径让请求与消息两处估算排除图片 payload，另加 **1600 token／图的内部定额**；这不是服务端计费上限或所有视觉模型的真实成本。#14512 使用者在 4.1.20 报告的 `288.3k` 压缩前估算，与当时在途请求的 `12,397` 服务端计数没有同请求配对证据，不能直接相除当作实测误差倍数。

**离线试验已验证这处估算修复。** 本仓直接导入 v4.1.20／v4.1.24 未改动的固定源码，给两版相同文本与合成 PNG：192×128、73,944 bytes 的单图请求估算为 **32,926 → 1,662**；纯文本 **45 → 45**；九张同图 **295,974 → 14,598**。三种图片大小、两种图片字段形状的对照支持正常路径不再随 base64 长度增长；定额也会让 16×16 小图的请求估算由 440 升至 1,662。人为加入 BigInt 触发请求序列化 fallback 时，单张中图仍为 **32,931 → 32,931**，该分支继续计入 base64；这不说明它在真实会话中的发生频率。

**图片修复不等于文本估算已校准。** 仍开放的 #14979 报告来自带图片补丁的自编译 4.1.21；维护者确认字符估算与只向上修正的机制仍会提前触发。自然复现时核同请求、同口径与缓存字段，不能将该报告写成 stock 4.1.24 复测，也不照搬下调预算公式。本条仍为[上下文管理](../decisions/context-management.md)候选，不新增默认做法。

**依据与范围**：[使用者原始报告 #14512](https://github.com/cline/cline/issues/14512)、[已合入 #14520](https://github.com/cline/cline/pull/14520)、[4.1.24 官方发布说明](https://github.com/cline/cline/releases/tag/v4.1.24)、[4.1.20 基线请求估算](https://github.com/cline/cline/blob/254f40c4b592d1e662b84f2ba06fe45dca77cab3/sdk/packages/shared/src/llms/tokens.ts)、4.1.24 的[请求估算](https://github.com/cline/cline/blob/ed469c753a0d7a0d41f906cf3fc75a983cd766ac/sdk/packages/shared/src/llms/tokens.ts)与[消息估算](https://github.com/cline/cline/blob/ed469c753a0d7a0d41f906cf3fc75a983cd766ac/sdk/packages/core/src/extensions/context/compaction-shared.ts#L198-L231)、[后续 #14979](https://github.com/cline/cline/issues/14979)及[维护者说明](https://github.com/cline/cline/issues/14979#issuecomment-6124810061)。4.1.24 原版 `tokens.test.ts` 离线 6／6 通过；逐字提取的 `createTokenEstimator` 测试块，基线 2／2、修复版 4／4 通过；非作者独立复跑并核对上游源码一致。未运行完整套件、客户端或端到端压缩，未调用模型，结果仅为内部估算而非计费、性能或真实用量。核实与离线试验：2026-10-28 UTC。

<a id="vscode-terminal-main-memory"></a>
### 2026-10-28：VS Code 多 Agent 终端越跑越占内存，先查主进程与修复版本

👀 **多个编码 Agent 的 TUI 长时间刷新、VS Code 整体崩溃时，先核增长的是主进程（main／browser）还是 Agent 进程，再查实际版本。** 终端输出被主进程缓存的已知泄漏由 #323980 修复，已进入 **1.138.0 稳定版（2026-09-16）**；旧版遇相符症状，优先升级到含修复的版本。衍生编辑器另核是否纳入补丁，不能套用 VS Code 的版本结论。

使用者在 macOS arm64、1.136.1 的多个 tmux／Claude Code 终端中报告：`terminal.integrated.scrollback: 1`、关闭 shell integration 后仍持续增长。其堆快照把终端输出追到 `LocalPty` 中无人消费的 `Event.buffer`；**缩小滚动缓冲不等于限制这层内存**。作者随后撤回了增大 `--max-old-space-size` 的缓解建议；最终合入补丁只取消未消费的进程事件缓冲，保留宿主生命周期事件缓冲。

这是[17 排障](../17-troubleshooting.md#28-在同一个错误上打转)的候选案例：按进程和版本定位，不把编辑器 OOM 当成模型上下文问题。仅凭内存上涨或全部窗口退出仍不能确诊；自然复现时保留相同输出负载，对照主进程增长与堆中保留链。本仓未运行 VS Code、未试用，当前客户端是否受影响未知。

**依据与范围**：[使用者原始报告 #334837](https://github.com/microsoft/vscode/issues/334837)、[作者撤回堆参数建议](https://github.com/microsoft/vscode/issues/334837#issuecomment-5620838511)、[已合入 #323980 的最终改法](https://github.com/microsoft/vscode/pull/323980#issuecomment-5668798568)、[官方 1.138 发布说明](https://code.visualstudio.com/updates/v1_138)。仅核公开讨论、最终补丁与官方发布记录；核实：2026-10-28 UTC。

<a id="goose-litellm-vision-payload"></a>
### 2026-10-28：LiteLLM 别名丢图，先验实际请求与配置优先级

🧪 **Goose 经 LiteLLM 代理别名看不到图片时，先让 Agent 核实际 completion HTTP payload，再查 vision 配置如何进入 formatter。** `/model/info` 返回 `supports_vision: true` 不代表图片已经发出：同时检查直接附图和工具返回图片、首次与缓存后的请求。修补应保留传入配置的 `true`／`false`（包括 canonical 已填入的值），只在未定时按精确别名读取布尔元数据，并在格式化前补入；不能只补字段解析。

本仓在 Goose 1.57.0 固定源码上用真实回环 HTTP／Wiremock 调用原 provider：**基线 9 项中，JSON／SSE 别名两项失败、7 项对照通过**，这两项的首次和缓存后请求均丢了直接图和工具图。本地候选扩展到 **18 项全部通过**（含串行复跑），覆盖显式优先级、关闭 prompt cache、错误元数据与无关别名；非作者源码审查未发现必改项。这是本地排障试验，尚未接真实 LiteLLM 代理／模型，不作为性能比较、工具推荐或读者照做通过记录。

**判断 payload 证据，先核断言读的是当次请求还是录制旧值。** 本次 Wiremock 的 `received_requests()` 读取本轮实际 HTTP body。Pydantic AI #8023 的作者变异检查报告：只断言 cassette 请求、又不匹配 body 时，payload 改坏仍可绿；其 #7653 用 `request_capture` 断言当前 body，录制响应另核历史 HTTP 200。

**候选的取舍**：未定 vision 且关闭 prompt cache 的纯文本请求也会新增首轮发现等待；沿用源码的 5 秒发现超时、60 秒失败缓存，真实超时／并发未另测。候选仍在本地、未提 PR；上游要求贡献对应 Ready issue，当前 Ready 状态未知。

**依据与范围**：[使用者原始问题 #13158](https://github.com/aaif-goose/goose/issues/13158)、固定基线的[元数据解析](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/crates/goose/src/providers/litellm.rs#L164-L179)、[先格式化后查缓存能力](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/crates/goose/src/providers/litellm.rs#L300-L321)、[formatter 缺省行为](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/crates/goose-provider-types/src/formats/openai.rs#L1714)、[发现缓存与超时](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/crates/goose/src/providers/litellm.rs#L32-L33)及[贡献门槛](https://github.com/aaif-goose/goose/blob/8a16788137c8af25f9d6d17ee87bbedb53ea9325/AGENTS.md#L5-L17)。对照：[Pydantic AI 固定测试指引](https://github.com/pydantic/pydantic-ai/blob/9019ebd7971452630f0b4dd882ab006a32d18b67/tests/AGENTS.md)、[#8023 作者报告](https://github.com/pydantic/pydantic-ai/issues/8023)、[#7653 修正说明与补丁](https://github.com/pydantic/pydantic-ai/pull/7653#discussion_r3836929679)；Pydantic 部分仅核资料，未运行该 fixture。核实原 issue、固定源码、本地 HTTP 记录与非作者审查：2026-10-28 UTC。✅ 已入 [13 候选表](../13-frontier-radar.md#值得一试近4周的新项目与做法)。

<a id="flutter-native-rule-loading"></a>
### 2026-10-27：Flutter 热重载没触发，先核指令有没有加载

👀 **Flutter 改完代码、运行中的应用却没更新时，先核当前客户端实际加载的项目规则与 Dart MCP instructions，再考虑增加长 Skill。** 沿客户端支持的原生指令入口确认加载，在下一次真实 `lib/**/*.dart` 修改中观察 DTD 发现、MCP 调用与应用更新；已有入口能完成就沿用，不凭规则文件存在判定已生效。

维护者 8-3 报告在 Antigravity 尝试 Skill、server description／instructions 与 `GEMINI.md`，只有后者自动起效；明确要求读取 server instructions 后也成功。8-19 使用者复测 Antigravity／Cursor，报告已恢复正常；8-21 维护者认为可能来自更新的工具名称／描述，也可能来自已有插件规则，未隔离原因。issue 于 10-8 关闭；9-2 才合入的 #228 不能作为 8-19 改善的因果证据。

**只在适用的 Flutter 项目参考热重载规则。** 固定版本限定 `lib/` 下 Dart 改动，跳过测试目录及纯注释／空白变化；UI／`build` 方法等走 reload，涉及 `initState`、全局／静态状态、`main()` 等需重新初始化时再选 restart，不因改了 stateful widget 就一律重启。实际调用读当前 MCP schema，不照搬旧帖参数。本仓未安装、未试用；这是[已有加载排障](../03-context-engineering.md#21-各工具的加载规则一手)的真实案例补充，不新增通用默认或 Skill。

**依据与范围**：[维护者尝试](https://github.com/dart-lang/ai/issues/498#issuecomment-5168550633)、[显式加载后的结果](https://github.com/dart-lang/ai/issues/498#issuecomment-5168595577)、[使用者 8-19 复测](https://github.com/dart-lang/ai/issues/498#issuecomment-5347423544)、[维护者 8-21 归因保留](https://github.com/dart-lang/ai/issues/498#issuecomment-5374304451)、[issue 关闭状态](https://github.com/dart-lang/ai/issues/498)；[已合入 #228](https://github.com/flutter/agent-plugins/pull/228)与[固定规则](https://github.com/flutter/agent-plugins/blob/90fa51dc9d1bd6694cee226397e08ec8193e9e69/rules/flutter-hot-reload.md)。仅核公开讨论、PR 与源码，未验证当前客户端行为；核实：2026-10-27 UTC。✅ 已入 [13 候选表](../13-frontier-radar.md#值得一试近4周的新项目与做法)。

<a id="stryker-vitest5-test-selection"></a>
### 2026-10-27：mutation 分数骤降，先核 runner 是否真的执行测试

👀 **已有 Stryker、升级到 Vitest 5 后分数骤降时，先让 Agent 查报告里的 `coveredBy`、`testsCompleted` 和状态，再决定补断言。** 若旧 runner 10.0.0 把有覆盖的变异报为 `Survived`，却完成零测试，优先核测试名过滤：旧版用空格连接名称，Vitest 5 用 ` > `。保留原覆盖率与 mutation 阈值，将已用的 Stryker core／Vitest runner／TypeScript checker 一起升级到含修复的 10.1.1，Vitest 与覆盖率包保持配套，再跑同范围验证。

真实采用者 openclaw-atif 的 #35 于 10-24 合入。**作者报告**早先 Vitest 5.0.5＋Stryker 10.0.0 的 354 项普通测试通过，但十个 survivor 执行零测试；升级后的 CI 报告为 **11 killed＋17 errors**，不是 28 killed。接收时须另查 errors，100 分不证明所有变异均被断言检出。#6210 还含静态变异误归类和 DEBUG 配置序列化故障的反馈，不能把所有异常都归因于名称分隔符。

**依据与范围**：[真实采用 PR #35](https://github.com/openclaw/openclaw-atif/pull/35)；[上游 #6214](https://github.com/stryker-mutator/stryker-js/pull/6214)于 10-23 合入，补丁让覆盖键与测试 ID 共用分隔符；[10.1.0 发布说明](https://github.com/stryker-mutator/stryker-js/releases/tag/v10.1.0)列出该修复，[10.1.1](https://github.com/stryker-mutator/stryker-js/releases/tag/v10.1.1)因发布 provenance 问题重发；[其他使用者反馈 #6210](https://github.com/stryker-mutator/stryker-js/issues/6210)。本仓仅核原文、补丁与发布记录，未安装、未试用，也未独立复跑采用者 CI。核实：2026-10-27 UTC。✅ 已入 [13 候选表](../13-frontier-radar.md#值得一试近4周的新项目与做法)。

### 2026-10-28：Vitest 先选原生 reporter，不叠两份终端输出

👀 **已有 Vitest、测试输出太吵时，先核原生 `minimal`（别名 `agent`），不要在 `default` 旁再叠一个。** 在已安装 5.0.5 的项目可单次试 `pnpm exec vitest run <原测试路径> --reporter=minimal`；保留原 config／project 参数和验证范围。未自定义 reporters 时已有 Agent 自动选择；显式列表会替换默认列表，项目需要的 CI／JUnit 等消费者继续保留。

本仓合成命令探针中，minimal 保留失败断言、退出码和最终 passed／failed／skipped 计数；default＋agent 则重复统计与错误报告。负责人复跑失败输入也观察到一份变两份。尚未在真实编码任务采用；社区有人报告安静输出反而触发 verbose 重跑，下一次自然 Vitest 改动看整个任务的回读与重跑，而非只比一次输出长短。

**依据**：[官方默认选择](https://vitest.dev/guide/reporters#default-configuration)、[5.0.5 固定实现](https://github.com/vitest-dev/vitest/blob/7a825db43e2beca0b219d2eadaec334cb81af0c7/packages/vitest/src/node/reporters/minimal.ts)；[GenomeSpy 实际 Agent 指令](https://github.com/genome-spy/genome-spy/blob/91ce56e30eeb08f30e63fca518935d386e7f00f1/AGENTS.md#L79-L88)；[Cloudflare vinext 的组合配置](https://github.com/cloudflare/vinext/blob/a3b6b4df4f53a66d574ee86f42150e85d250196c/vite.config.ts#L146-L149)是借鉴前须实跑的反例，未运行其业务测试；[Reddit 原帖与正反评论](https://www.reddit.com/r/node/comments/1vrwxw5/should_node_test_runners_have_a_silentonsuccess/)。核实与合成探针：2026-10-27 UTC。

### 2026-10-27：灯光 Skill 先核材质受光路径

✅ [game-quality-pass §3.1](../../domains/game-dev/templates/.claude/skills/game-quality-pass/SKILL.md#3-改一整层让整个场景同时变)已补材质边界，不以 HDRI＋AO 为通用起点。Three 0.186.1 原生 MeshToon 不接 scene.environment；方向光阴影先衰减 direct，Ambient／Hemisphere 独立进入 indirect，Toon ramp 保不住全遮挡的直接光。先核 shader 直接／间接受光，再按缺口选环境源与 AO；Toon 不强接 PMREM。此为源码核实，不证明新 MOBA 候选更好，GPU 同机位盲判待完成。

**依据**：Three 官方固定源码 [环境接入](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/webgl/WebGLPrograms.js#L56-L64)、[阴影与间接光](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/lights_fragment_begin.glsl.js#L181-L244)、[Toon 合光](https://github.com/mrdoob/three.js/blob/9b4a2ac29c63ccb43fd51c5661f2f873ac2c39b8/src/renderers/shaders/ShaderChunk/lights_toon_pars_fragment.glsl.js#L10-L25)；与已安装 0.186.1 对应文件逐字节一致，核实 2026-10-27。

### 2026-10-27：游戏拍摄边界已按新决定对齐

✅ **本条原“游戏画面验证不再派回本机”已被用户新决定替换**：云端能做的留在云端，需要真 GPU 的画面拍摄按[细则§7](game-taskbook.md#7-下发本机模型的游戏任务)写 `kind: build` 交本机，只用 headless 浏览器（无窗口、不模拟键鼠、不操作桌面），一次一个 GPU 任务；本机后台模型与文件制作照常。[capture.md](../../domains/game-dev/templates/.claude/skills/game-quality-pass/references/capture.md)已采用 gpu／software／unknown 分类、每轮独占目录与 manifest，原两项反馈已解决。TASKS 已对齐；既有 cancelled 卡不恢复，预览清理沿原卡单独验收。

### 2026-10-28：MCP 迁移，先固定消费者再读接口差异

👀 **升级 MCP SDK／协议时，先比两版服务实际暴露的工具、schema、能力与资源，再用固定旧／新协议客户端验真实调用；本仓未试用。** 官方 servers 的 [interface-diff 脚本](https://github.com/modelcontextprotocol/servers/blob/1a9554d1ad252bc834f1fce9a7048ccc321ec980/scripts/interface-diff.mjs)已在 [#4975](https://github.com/modelcontextprotocol/servers/pull/4975)合入，入口为 `npm run interface-diff -- --base <ref> --report-dir <dir>`，需在该项目构建并启动两版服务。差异留给审阅，构建或探测失败报错；普通重命名继续项目原生测试。

**先读差异报告采用的协议与能力。** 真实迁移 [#5131](https://github.com/modelcontextprotocol/servers/pull/5131)的客户端自动协商最新协议，实际比较旧版 `initialize` 与新版 `server/discover`；旧消费者兼容另由 Inspector 的 `--protocol-era legacy`／`modern` 和 SDK 客户端验证。其 Claude Code 实测只覆盖协商后的现代协议。维护者和工具作者的[原始采用讨论](https://github.com/modelcontextprotocol/servers/issues/4860)指向该交付；这是一份运行时协议迁移的接收做法，当前本仓没有匹配的自然迁移任务。核实：2026-10-27 UTC。

**客户端所见声明也要单独核。** Codex 用户 [#42283](https://github.com/openai/codex/issues/42283)复现了根 `oneOf` 旁的字段在客户端转换后丢失；[0.162.0 固定源码](https://github.com/openai/codex/blob/c1382380de69521303b416720a52f42d51af6248/codex-rs/code-mode-protocol/src/json_schema_types.rs#L111-L165)支持这个具体机制，[社区使用者](https://www.reddit.com/r/mcp/comments/1x2bnc5/claude_code_and_codex_break_on_different_mcp/)自报已增加逐客户端清单核对。自然接入或 schema 变更时，分开验服务暴露清单、客户端所见名称／参数、实际调用。当前 [Serena 实跑](../../experiments/serena-vue-implementation/README.md#真实-mcp-stdio-入口)覆盖 SDK／服务路径，Claude／Codex 的声明转换与模型调用待验；上述用户复现与固定源码也不泛指最新版。核实：2026-10-27 UTC。

### 2026-10-27：OSS Verify，把已有 fuzz 性质交给独立证明检查器

👀 **维护有明确性质的 C/C++ 库时，可从一份公开证明起步，再决定是否让 Agent 准备自己的 fuzz target；本仓未试用。** 在固定源码中选 `coturn/FuzzStunClient`，按 [checking](https://github.com/theorem-labs/oss-verify-proofs/blob/1045cd75d83eacd942040cb611c98305f33dea59/docs/checking.md)／[proving](https://github.com/theorem-labs/oss-verify-proofs/blob/1045cd75d83eacd942040cb611c98305f33dea59/docs/proving.md) 准备 Docker／Rocq checker，`./oft fetch coturn` 取项目产物，再在固定镜像、断网容器内运行 `./oft check coturn/FuzzStunClient --parts statements,proofs`。10-27 文档已补至少 1 GiB 硬栈上限；该固定版本 README 尚未同步，官方称后续 release 补齐。外部用户两核运行 34 分钟后主动停止，尚无该用户复验通过的回执。

**入项目 Skill 可借的是把“正确”写成真正会失败的性质。** 它要求 seed 覆盖见证和可触发失败的修改；C/C++ 的 `assert` 可能被 `NDEBUG` 删除，性质失败应触发 `abort()`，而非普通 `return -1`。接收时核实际 harness：公开 LZO 示例只比较成功码与长度，内容相等须另有检查，该条目仍是待证明 statement。已发布证明的范围以对应 theorem 和编译产物为准；普通应用测试继续沿用原生回归与差分测试。

**依据**：[官方研究](https://www.anthropic.com/research/formal-verification)、[固定公开证明](https://github.com/theorem-labs/oss-verify-proofs/tree/1045cd75d83eacd942040cb611c98305f33dea59)、[固定入项目 Skill](https://github.com/theorem-labs/oss-verify/blob/1bfa50204b14e6bdddde765e851afdb954314ba8/.claude/skills/add-project/SKILL.md)、[LZO harness 与状态](https://github.com/theorem-labs/oss-verify-proofs/blob/1045cd75d83eacd942040cb611c98305f33dea59/projects/lzo/lzo_compress_target/harness.yaml)、[真实复验反馈](https://github.com/theorem-labs/oss-verify-proofs/issues/2)。10-27 核实；公开快照 61 入口／26 库是已发布子集，研究样本为 239 入口／123 库，不混计。

### 2026-10-27：摘要树与按需回读，先保留原生压缩

👀 **已经使用 Pi、且长任务反复丢失必要旧细节时，可评估 pi-optchat 的摘要树＋`zoom`；普通 Claude Code／Codex 使用者继续原生压缩。** [0.10.0 固定实现](https://github.com/jonaslsaa/pi-optchat/tree/2714a3f4167ba41ea1868b51d715e680ac5f095d)用额外模型构建摘要视图，保留原文供回读，是替换主代理压缩而非“不压缩”。已有[非作者集成反馈](https://github.com/jonaslsaa/pi-optchat/issues/165)，[作者的 40 对摘要评估](https://github.com/jonaslsaa/pi-optchat/issues/153)未公开完整数据，也不是与原生压缩对照；选择时要计摘要调用、回读、质量和总成本。本仓未安装、未试用；[原帖反馈与源码核对](local-jobs/artifacts/A-CONTEXT-COMMUNITY-FOLLOWTHROUGH-20261027/sources.md)未支持固定 token 数重开或只给目标。核实：2026-10-27。

### 2026-10-27：沿真实启动链补测试，而非叠加审查轮次

👀 **接入外部程序时，先跑真实宿主的最短路径，再让回归覆盖宿主的启动包装和环境差异。** Calyx 作者在 [DEV 复盘](https://dev.to/yuu1ch13/seven-rounds-of-ai-code-review-in-one-day-2048-tests-green-and-the-feature-had-never-started-once-1lb8)中自报多轮 AI 审查与大量绿测仍漏掉无法启动的窗格；[公开修复](https://github.com/yuuichieguchi/Calyx/commit/cd89aab20be8ac34d342e852d646d6fd88a7f267)可核：真实 Ghostty 会再包一层 `exec`，原测试只执行裸命令，修复去掉自身多余的 `exec`，测试改为经过宿主包装，并用不同的环境 HOME 检查显式配置确实生效。本仓只读核实、未在 macOS 运行；保留这个实际失效机制，不据作者轮次或测试数量推荐更多审查。核实：2026-10-27。

### 2026-10-27：先检查判官，再改生成提示

👀 **评测突然判出大量错误时，先人工读失败样本，再决定改提示词还是改判据。** 中文实践者在 [ai-study-helper-v2 切片 030](https://github.com/lipeidonggz/ai-study-helper-v2/blob/325956ced3eaece484eb91a7a0c576e45794100e/docs/development/slices/030-agent-claim-strength-fidelity.md)记录：50 次尝试后发现原判据误伤保留转折的近义转述，否决原归因并撤回一次提示修改。它是作者的真实项目复盘，逐次 trace 未公开；本仓未试用，也不引入其审批或提交门禁。[原始材料与公开提交核对](local-jobs/artifacts/A-COMMUNITY-PRACTICE-SCAN-20261027/sources.md#dot-a-接收后的关键核对)。核实：2026-10-27。

### 2026-10-27：本机广扫接收后的选择

👀 **公共 API 改动先找项目自己的生成与兼容检查，不另搭通用审查框架。** Effect 已用 [`api-diff` 与迁移注解](https://github.com/Effect-TS/effect/pull/9971)持续刷新消费端迁移指导；Biome 把“变更类型→codegen 命令”写进 [AGENTS](https://github.com/biomejs/biome/blob/e2e5a36e1be8581419742a85268ad82f020da62e/AGENTS.md)，[真实规则 PR](https://github.com/biomejs/biome/pull/12580)由 CI 补齐遗漏的生成内容。适合已有多包或生成链的项目，本仓当前没有匹配的自然改动，未试用；不为试工具新造迁移。[四组原始材料与消费者](local-jobs/artifacts/A-FRONTIER-SOURCE-COLLECTION-20261027/sources.md)保留 Nx、Rust 兼容检查的取舍入口。

⛔ **Entire：本仓保留 Git 交接与决策记录，不导入真实会话。** 它将提示与 transcript 放进旁路 Git refs，默认随 push 同步；公开仓采用前必须先决定这些会话是否可以公开，默认脱敏会跳过路径字段和图片/base64 对象。只有确需回看会话且材料允许保存、分享时再评估，当前未安装、未试用。依据：[存储与同步](https://docs.entire.com/guides/checkpoints/checkpoint-storage)、[0.12.2 脱敏实现](https://github.com/entireio/cli/blob/b6900cf9f71bfbebc68b88860892e8ae5bad30b8/redact/redact.go#L2522-L2535)、[HN 使用者采用](https://news.ycombinator.com/item?id=50251718)与[已有规格足够的反馈](https://news.ycombinator.com/item?id=50255682)。

**Cursor Agent SDK 先按当前文档核包名。** [官方 quickstart](https://cursor.com/docs/agent-sdk/quickstart.md)使用 `@grok/agent-sdk`（原 `@cursor/bdk`），[发布博客](https://cursor.com/blog/agent-sdk)的 `@cursor/agent-sdk` 在核实日 registry 返回 404；当前包为 0.3.0。本仓未安装或运行，不新增默认。[广扫来源、正反反馈与未覆盖范围](local-jobs/artifacts/A-FRONTIER-WIDE-SCAN-20261027/sources.md)。本节核实：2026-10-27。


### 2026-10-27：只补测试契约审查，不装整套评审循环

👀 **下一次真实脚本改动担心失败路径没测到时，可单独试官方 pr-review-toolkit 的 `pr-test-analyzer`；原生审查已能接住就沿用。** 这是插件子代理，提示它审“哪些具体契约违约仍能让测试变绿”，并明确 PR 或已确认的 base/head、源码和测试清单。即使测试文件没改也按行为判断是否需要它，不默认启动六角色。

官方包装仍以裸 `git diff --name-only` 起步；本仓干净工作树读到 0 文件，而两份真实已提交差量分别有 2／1 文件。实际用户日志也显示 Agent 可能自行补查 PR diff，因此这里要求显式范围，未把提示缺口写成必然漏审。OME 已在 reconciliation 重试评审中接入；CPace 组合评审后补了错误透传与分类测试，效果不能单归此角色。**本仓未安装、未运行该插件，当前没有未结的匹配脚本任务**，不重开已接收改动制造试用。

**依据**：[固定角色](https://github.com/anthropics/claude-plugins-official/blob/41f619d61b999adec1a1c8deb97d1a5b6ac35bb6/plugins/pr-review-toolkit/agents/pr-test-analyzer.md)、[命令范围与角色选择](https://github.com/anthropics/claude-plugins-official/blob/41f619d61b999adec1a1c8deb97d1a5b6ac35bb6/plugins/pr-review-toolkit/commands/review-pr.md#L29-L43)、[真实调用日志 #319](https://github.com/anthropics/claude-plugins-official/issues/319)、[OME 接入](https://github.com/ome-projects/ome/commit/5e2466e331be8a28a0ca7ce6828b67fc842e1fb6)、[CPace 已合入评审与补测](https://github.com/the-sarge/cpace/pull/78)；[同类范围修订 #459](https://github.com/anthropics/claude-plugins-official/pull/459)因外部贡献范围关闭、未合入，当前不另投同类 PR；核实 2026-10-27。

### 2026-10-27：dotagents 的项目级 Skill 分发

👀 **多个客户端确实要共享同一组 Skill 时，可评估 dotagents；少量本地 Skill 继续直接维护。** 已有 `agents.toml`，且来源、MCP／Hook 声明与目标客户端均已审过时，在项目内刷新：

```bash
npx @sentry/dotagents@3.4.0 --project install
```

Git 来源的 `ref` 填已审完整 commit SHA，每条项目命令都保留 `--project`：3.4.0 的 `agents.lock` 记录来源但不冻结安装，`--frozen` 已被忽略，无作用域参数则操作全局配置。Sentry JavaScript 已把共享 Skill 与声明入 Git；其提交的 dotagents Skill 较旧。**本仓未安装、未试用**，当前模板没有待解决的跨客户端分发任务，先不增加管理层。

**依据**：[3.4.0 发布](https://github.com/getsentry/dotagents/releases/tag/3.4.0)、[固定 Skill 的作用域](https://github.com/getsentry/dotagents/blob/46558ca1670e823aa3f92d811309c81720babb53/plugins/dotagents/skills/dotagents/SKILL.md#L9-L17)、[忽略 `--frozen` 的实现](https://github.com/getsentry/dotagents/blob/46558ca1670e823aa3f92d811309c81720babb53/packages/dotagents/src/cli/commands/install.ts#L98-L115)、[锁文件契约](https://github.com/getsentry/dotagents/blob/46558ca1670e823aa3f92d811309c81720babb53/docs/src/content/docs/security.mdx#L72-L126)；[实际消费者配置](https://github.com/getsentry/sentry-javascript/blob/c125a5da2e6b7d916a5880f65876cddfee96c56d/agents.toml)、[其旧版锁定](https://github.com/getsentry/sentry-javascript/blob/c125a5da2e6b7d916a5880f65876cddfee96c56d/agents.lock#L12-L17)；[HN 使用者自报](https://news.ycombinator.com/item?id=47544018#47545728)，没有收益对照；核实 2026-10-27。

### 2026-10-27：SDK 迁移与按改动构建

- 👀 **升级 Anthropic SDK 主版本时，把依赖升级和 API 契约修正一起交付。** 10-21 发布的 Python SDK 2.0／TypeScript SDK 1.0 默认使用 API 版本 `2026-10-21`，迁移时从 Messages 请求移除 `temperature/top_p/top_k`，并按实际客户端核认证头变化及既有网关、日志脱敏的兼容性（`AnthropicFoundry` 仍用 `x-api-key`）；Bedrock 用户已报告旧模型版本拒绝，Hermes 的开放 issue 仅列出待迁移路径，需要旧采样行为时暂保相应旧调用链，本仓未试用，待真实 SDK 升级任务采用。

  **依据**：[官方迁移指南](https://platform.claude.com/docs/en/api/migration-2026-10-21)、[Python 2.0 发布](https://github.com/anthropics/anthropic-sdk-python/releases/tag/v2.0.0)、[Bedrock 用户对照](https://github.com/anthropics/anthropic-sdk-python/issues/2031)、[Hermes 迁移待办](https://github.com/NousResearch/hermes-agent/issues/142796)；核实 2026-10-27。

- 👀 **维护 Next.js 框架源码时，按源码变化和现有产物决定构建，不因新 worktree 就跑 `build-all`。** Next.js 于 10-22 将 AGENTS 与 backport Skill 改为：仅核心 JS 用 `pnpm --filter=next build`，跨 JS 包用 `pnpm build`，Rust／Turbopack 用 `pnpm build-all`，仅改测试且框架产物有效则直接跑测试；切分支、pull 后产物过期仍须补构建，已发布原生绑定落后于源码且启动失败时再完整构建，本仓未试用，待真实 Next.js 框架维护任务采用，不改变本仓门禁。

  **依据**：[已合入的 AGENTS／Skill 修改](https://github.com/vercel/next.js/commit/9ff761f2ceb2f38751578ba17bd2b3b9077c35f1)、[10-26 固定 AGENTS](https://github.com/vercel/next.js/blob/6f98e9fcedf6420658f0039376ef15d358e4cf1a/AGENTS.md#L105-L107)；核实 2026-10-27。

### 2026-10-27：用户带入 GPT-6.1 Terra

- 👀 **官方模型资料与 Artificial Analysis 六档 effort 评测已核，已收录进 [02 模型与成本](../02-models-and-cost.md#terra-effort-evidence)**，用于区分能力分数、单价与每题成本；本仓未调用模型实测。带入渠道为本 ChatGPT 对话，本次记 1 项漏检；公开来源、首次核实日期与发现时差边界见[校准记录](../research/2026-10-15-exploration-evidence.md#2026-10-27用户带入-gpt-61-terra-漏检)。

<a id="portless-worktree-urls"></a>
### 2026-10-27：Portless 命名开发入口

👀 **多个 worktree 频繁切换时，可试 Portless，让 Agent 和浏览器引用稳定 URL；现有端口安排已清楚就沿用。** 运行现有开发命令时用 `portless run --name myapp <原开发命令>`，再在同一 worktree 用 `portless get myapp` 取得入口，交给已有测试配置；`get` 只构造 URL，就绪仍须请求应用的真实路由。试用选择高端口 HTTP：代理与应用统一设置 `PORTLESS_PORT=1355`、`PORTLESS_HTTPS=0`、`PORTLESS_SYNC_HOSTS=0`、`PORTLESS_LAN=0`、`PORTLESS_TLD=localhost`，先确认既有代理配置一致；默认 HTTPS／443 与 hosts 路径涉及系统配置，先不选。**本仓未安装、未试用**，等真实 UI 任务需要这类入口时再选；已核源码 0.15.12，Apache-2.0、Node.js 24+。

**实际采用提醒：稳定 URL 也要接进测试。** state-in-url 已用 0.15.5 承载八个示例应用与 CI，但 E2E 仍写死主检出的 URL，工作树前缀会令测试找错入口；不复制其 `--force`，该选项会终止同名路由的现有进程。其脚本采用高端口 HTTP，却没有关闭 hosts 同步，不能据说明认定不改系统文件。浏览器会话仍按 Cookie 与存储作用域分别验收。

**依据**：[一手：固定源码] [官方 Skill／配置](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/skills/portless/SKILL.md)、[`get` 实现](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/cli.ts#L2463-L2471)、[hosts 开关](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/hosts.ts#L64-L70)、[`--force` 实现](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/routes.ts#L223-L255)；[一手：实际消费者] [启动脚本](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/scripts/portless.sh)、[锁定 0.15.5](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/pnpm-lock.yaml#L188-L190)、[E2E 入口与使用限制](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/AGENTS.md#demo-app-urls)；[社区] [OpenCode 使用者自报](https://www.reddit.com/r/opencodeCLI/comments/1rqtxn3/portless_cli_for_consistent_dev_urls_makes/)、[V2EX 多 Agent 工作台仍需配端口](https://www.v2ex.com/t/1250974)（后者未采用 Portless）；核实 2026-10-27。

### 2026-10-26 广扫补入：三个实际任务候选

- 👀 **Sentry：复用 CI 实际选中的测试。** 下一次真实 CI 失败，交给 Agent：`读取失败 job 的原命令、配置和选中 nodeid，在同一代码版本重放；修后先验原失败，再跑项目要求的检查。` [实际 AGENTS](https://github.com/getsentry/sentry/blob/eb0125b95bc8569b340b5025a9aaade909e4a52f/AGENTS.md#L53-L59)与[workflow](https://github.com/getsentry/sentry/blob/eb0125b95bc8569b340b5025a9aaade909e4a52f/.github/workflows/backend.yml#L144-L162)已有消费者；artifact 只留一天，过期重建，已有明确失败用例时直接跑它。本仓未试用。

- 👀 **agent-browser 0.39.4：按版本读 Skill，增量看网页。** 真实 UI 任务需反复观察时，可比较已装 CLI 的 `skills get core` → `snapshot -i --delta`（丢失上下文用 `--full`），核关键状态与返回文本量；[官方配方](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/skill-data/core/SKILL.md)的 WebMCP 调用不能替代 UI 输入路径。[当前启动实现](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/cli/src/native/cdp/chrome.rs#L1597-L1637)在 root／CI／容器自动关闭 Chrome 沙箱，[多 worktree 用户](https://github.com/vercel-labs/agent-browser/issues/2214)还报告本地安装覆盖全局命令，因此本轮只收录，浏览器对照待保留沙箱的获准环境；未安装或试用。

- 🧪 **opensrc：已做本地 Git／CLI 试用，精确版本仍优先原生 Git。** [agent-browser 的真实配置](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/AGENTS.md#L146-L168)已采用；多依赖反复读实现可试[官方 Skill](https://github.com/vercel-labs/opensrc/blob/b51de60867e806da1839b33dd29c29424f12521b/skills/opensrc/SKILL.md)。固定基线遇到不存在的仓库 ref 会回退默认分支；[已审补丁](../../experiments/opensrc-ref-integrity/source-ref-integrity.patch)改为失败并支持完整 commit SHA，[本地实测与复用](../../experiments/opensrc-ref-integrity/README.md)使用合成已解析元数据、真实 Git 和真实 CLI 缓存读取，未覆盖冷启动 registry HTTP。包版本缺 tag 的回退仍属上游 [PR #57](https://github.com/vercel-labs/opensrc/pull/57)，本补丁不改；旧缓存不重验、不迁移，试用使用独立 `OPENSRC_HOME`。[用户另报 monorepo 元数据差异](https://github.com/vercel-labs/opensrc/issues/61)；版本敏感判断默认用原生 Git 固定完整 SHA 并核 `git rev-parse HEAD`，单次 API 查询不装。

### 2026-10-26 固定来源扫描

读者是用 Agent 维护脚本、知识库和多 Agent 长任务的开发者。本轮增量是把“少送输出”“保留原始证据”“自动记忆”分开选，不按 star 或节省百分比全装插件。试用线能据下列入口在本仓选一个真实读改任务，取得原段、保住决定性限制并交成修改，才算用上；下表均未试用；show-me 写法、context-mode 与 Hippo 组件的已接收结果在本页“已处理”。

| 候选／来源 | 当前选择、试用状态与下一步 | 解决什么、谁在用与社区评价 |
|---|---|---|
| 👀 [Archify 3.2](https://github.com/tt-a1i/archify/releases/tag/v3.2.0)，awesome-claude-code 线索；[SpecDev 作者采用](https://github.com/tt-a1i/archify/discussions/952)、[导出缺说明卡反馈](https://github.com/tt-a1i/archify/discussions/721)；固定 `81c6be8d`，Apache-2.0 | **只在本仓读者需要点击固定源码／连续更图时才选它**，与 show-me／Mermaid 比较，当前未运行浏览器／插件。出现这类真实解释需求才试，两者不用为凑数都装。root 下 browser-check 会请求 `--no-sandbox`，不得照跑或为此改安全设置。 | 从真实源码形成带位置的可交互解释；SpecDev 作者自报 Windows 集成使用，导出用户提醒 PNG/PDF 不一定带上 HTML 说明。源码位置校验不等于解释语义正确。 |
| 👀 [anymd](https://github.com/SylphxAI/anymd)，[AgentIndex 10-07 清单](https://agentindex.app/zh/guides/new-tools-2026-10/)补入；[真实 OpenCode 用户 #881](https://github.com/SylphxAI/anymd/issues/881)；固定 `71fb95b5`，MIT 本地核心 | **下一次本仓论文／文档研究需要本地 PDF 时选**：`read`→`search`→按页核原文，基线是原生 PDF 抽取＋页图；当前未试用。若只是偶尔读一页，继续用原生抽取，不拿作者速度榜作结论。实际选用须含 8.5.5 后续修复并核有效目录配置；CLI 默认不限预算，须显式给 `--max-tokens`，不运行改所有客户端的 `setup`；付费 cite-check 不在本次选择内，不称已运行或完整安全认证。 | 文档转 Markdown，带页码、预算与续读 cursor；用户报告原始 stdio 可读，但严格客户端因 nullable 字段错误列为 required 而拒绝，说明“服务能跑”不等于 Agent 能用。该 schema 历史修复见固定源码与 8.5.3 changelog（见 [04 接入](../04-mcp.md#裸-stdio-可用客户端却拒绝参数)与 [10 安全](../10-security.md#本地只读-mcp目录验收覆盖可调用的兼容入口)）。 |
| ⛔ [AOCI-CODE](https://github.com/aoci-spec/aoci-code)，同一清单补入；[用户 #114 与维护者回应](https://github.com/aoci-spec/aoci-code/issues/114)、[性能反馈 #127](https://github.com/aoci-spec/aoci-code/issues/127)；固定 `7351c9de`，FSL-1.1-MIT 源码可用许可 | **本仓先不加全量索引**，按任务读源码，当前未试用。出现跨文件、全仓索引的真实需求再比较，否则继续 `rg` 按段读取；索引放不下时不能以调小 chunk 当修好。该索引压缩后仍要求完整 Overview，早期清单“未识别许可证”已过时，也不当 MIT 当前版。 | Git 版本化的仓库认知索引；有用户认可用途却报告慢，另有完整索引未读完即压缩、恢复又全量读的循环。维护者确认分块只降单次输出，不降累计上下文。 |
| ⛔ [Jevmem](https://github.com/Avinash-jetwani/jevmem)，[O’Reilly 10-06 雷达](https://www.oreilly.com/radar/radar-trends-to-watch-october-2026/)补入；MIT 代码 | **本仓不接账号、付费或导入会话**，当前未试用。只保留“新规则取代旧规则但留历史”的机制参照；已有 Git 交接足够时不增加服务，出现真实跨会话决策记忆需求再核数据路径。 | 保存决策与失败路径并退役旧事实；作者自测手写 `CLAUDE.md` 做得相近，尚无独立采用效果。MIT 代码不等于纯离线产品：当前接入需 TypeSafe API，消息、相邻轮次和记忆会送出。 |
| ⛔ [Google AX](https://github.com/google/ax)，同一 O’Reilly 雷达补入 | **暂不另建 Kubernetes＋Agent Substrate 集群**，已有宿主与 worktree 能接住本仓任务，当前未部署。需要自管大规模执行面时再核恢复和隔离契约。 | 声明式编排 Task／Workspace／Model，分离任务、工作区与模型配置。官方明确仍重度开发、稳定版前可能破坏性变更，独立生产使用成效未知。 |
| 👀 [lights-on-software-factory](https://github.com/gojko/lights-on-software-factory)，[上周 HN 原帖](https://news.ycombinator.com/item?id=50160198)补入；固定 `7e8ee8b4`，MIT | **本仓不选，保已有完成卡／版本门禁**：没有它的 progress 协议产物，当前未试用。不手工翻译现有日志制造采用，也不装整套权限、hooks 或读取真实会话。同 step 编号改了需求不能沿用 done：完成判定沿用原 run／group 记录、不比对新规格，须按新规格重新验收；[生成器](https://github.com/gojko/lights-on-software-factory/blob/7e8ee8b4dcd9857da48845b187540e3e1891c70f/workspace/.claude/workflow/src/generator/build-run-shape.js#L27-L34)仍按编号跳过已完成步骤，这是源码契约核对，未运行复现。 | 把计划依赖、同阶段写入冲突、分组门禁与恢复判定交给确定性程序；Votito 作者自用抽出，省费约 80% 仅作者口径，评论问隔离和凭据，并无独立收益验证。源码的完成判定要求末次 worker 完成、所属运行组 gate 绿且后续无反驳。 |
| ⛔ [agent-usage-guard](https://github.com/rbartoli/agent-usage-guard)，[上周 HN 原帖与讨论](https://news.ycombinator.com/item?id=50198936)补入；固定 `8e9f9131`，MIT | **当前宿主不接该 mod，先用原生额度／并发控制**；当前未试用。出现真实失控消费再评估宿主适配。core 判定与宿主适配分开；跨机器、独立终端队友及无前置事件的 fork 有覆盖边界，失败通常放行，不是硬预算安全边界。 | Claude Code mod 在代理启动、重上下文和重复失败前询问／拦截，合并本机多会话计数。作者报告旧 hooks 降 burst 但 lockout 仍增加，默认绝对阈值按自己的 Max 5x 调，不能推广。 |

收件箱只记待选与判断，不把本轮补录当成已试用；上周固定 10 条参照见 [25 周校准](../25-ai-exploration.md#2026-10-26上周-hn-样本校准)，另有 [13 项冷启动历史补充](../25-ai-exploration.md#2026-10-26冷启动历史补充)。

### 2026-10-26 历史目录三项补核

这三项解决的是首次目录对照留下的“待核”，不是再跑一次周扫描。读者先分清本地 adapter、远端检索与自托管数据平台；能说出实际数据路径、原生替代和不装条件才算补全判断，以下均未试用。

| 候选／来源 | 当前选择、试用状态与重开条件 | 解决什么、谁在用与社区评价 |
|---|---|---|
| ⛔ [Ref Tools MCP](https://github.com/ref-tools/ref-tools-mcp)，[官方安装](https://docs.ref.tools/context/install/index)；[自托管疑问 #10](https://github.com/ref-tools/ref-tools-mcp/issues/10)、[项目文档用户 #32](https://github.com/ref-tools/ref-tools-mcp/issues/32)；固定 `f5feb829`，MIT | **保官方原文／已有 Context7，不因 adapter 开源就称无需账号、离线或可自托管**；当前未试用。只有现有入口确实漏必要文档且服务接入已获相应授权，才比较完整检索任务。当前官方接入需 API key 或 OAuth；未核当前价格，不引用历史免费额度，不开户或导入文档。 | 按检索历史筛文档，减少重复结果；真实用户用它查手册、希望保存项目材料，后者不能当自动笔记已发布。MIT 仓是 legacy stdio adapter，固定源码的搜索／读取仍请求 Ref 服务；历史维护者也明确索引不在本地。 |
| ⛔ [PipesHub](https://github.com/pipeshub-ai/pipeshub-ai)，[作者帖与资源／模型问答](https://www.reddit.com/r/LocalLLaMA/comments/1waobyi/an_opensource_context_layer_for_building_ai_on/) | **本仓公共文件没有跨组织撤权／连接器需求，保 `rg` 或显式索引**；当前未试用。出现真实多权限消费者后，再核撤权与引用版本；此前不部署多服务、不创建 PAT、不接公司资料。只读官方部署与可见问答，未核完整实现／权限传播；不把“自托管”写成离线或数据不外发。 | 把企业多源资料变成保源权限、带引用的 Agent 上下文；作者称测试过本地模型，评论追问小模型关系抽取与 slim 部署成本，不是独立采用证明。slim 不等于零模型／embedding 成本；按阶段选模型在该问答里仍是计划。 |
| 👀 [crw／fastcrw](https://github.com/fastcrw/crw)，[MCP 模式文档](https://docs.fastcrw.com/mcp/)；[真实 SDK 字段遗漏 #557](https://github.com/fastcrw/crw/issues/557)；固定 `dc1a5968`／0.39.0，AGPL-3.0 | **只在真实、已获准的网页格式转换需求下选它，先保原生网页读取**；当前未运行。MCP 的 `CRW_LOCAL` 分支强制本地引擎，不代表其他子命令也忽略远端配置；搜索还需 backend，本地模式会尝试发现／启动浏览器，Auto 按已配置后端回退，代理需另配。Chrome 启动代码含 `--no-sandbox`，本轮不走该入口；未核纯 HTTP／离线入口前不运行，既有 403 更不能拿来试抓取。 | 抓取／转换、站点映射与搜索接口。用户的 sitemap 不是“包没更新”，而是服务字段被 SDK 丢掉；维护者报告 0.36.0 发布后核过，两者不等于本仓复测。 |

### 2026-10-26 按生产问题补入

- 👀 [Humanizer 3.1.0](https://github.com/blader/humanizer/blob/8c307f367c91bd974002f10f2be2965d642c13df/SKILL.md)（MIT，固定 `8c307f367c91bd974002f10f2be2965d642c13df`）：**可辅助精简新稿，保留事实复核。** 10-27 手工按 Skill 编辑新增 mutmut 候选时，首稿缩短却弱化了“零执行不能当通过”，经非作者读者核对后恢复；未安装插件，不做批量改写，净收益仍待观察。[Akita 自用](https://akitaonrails.github.io/en/2026/09/17/talking-about-my-ai-skills/)的是定制 3.0；历史[添事实 #187](https://github.com/blader/humanizer/issues/187)与[删排名／同时性 #212](https://github.com/blader/humanizer/issues/212)已有修订，仍须逐稿核语义。

## 已处理

| 候选／来源 | 实际结果与去向 | 解决什么、谁在用与社区评价 |
|---|---|---|
| ✅ [HumanLayer show-me](https://github.com/humanlayer/skills/tree/653b6411c1f70c275a18e37673b042ff99f67ceb/plugins/show-me)，GitHub 清单线索；[真实组合需求 #12](https://github.com/humanlayer/skills/issues/12)；固定 `653b6411`，MIT | **[最小结构 diff 已用于真实补丁交接](../../experiments/show-me-symlink-handoff.md)**：显式读 Skill 后应用表达形状，熟悉补丁的接收者据 26 行交接正确定位四类分支与测试，原 diff 为 212 行；这只是材料量和定位结果，未测提速。复杂分支交接可借用，简单 diff 直接审；插件未安装／调用，不装整套 HumanLayer 循环。 | 给代码交接选最小表达：调用树、结构 diff、Mermaid，复杂时才用 HTML；发帖者称 Matt Pocock 的 PR Skill 已复制其形式，也准备借给 PR review Skill。禁止隐式调用仍是组合限制，不是发帖者已完成采用或自动触发已解决。 |
| ✅ [Hippo](https://github.com/kitfunso/hippo-memory)，[AgentIndex 10-07 清单](https://agentindex.app/zh/guides/new-tools-2026-10/)补入；[外部测试提议 #346](https://github.com/kitfunso/hippo-memory/issues/346)；固定 `4d078af8` | **[组件试用已独审](../../experiments/hippo-public-guidance-retrieval.md)**：组件已试，不是整插件采用；手动退役保留旧行并过滤当前召回，但四个中文问题丢失词项后返回同样前五条，新的主引擎／发布段未取出，替代行来源元数据仍指旧段。本仓指导继续用 Git 原文＋`rg` 并引用回源；只有出现跨客户端记忆且新段可被召回的真实需求才重开，未接全局记忆或私人会话。 | 跨编码客户端的本地记忆，区分 pinned、superseded 与 outcome。外部关注的是旧事实退役后是否仍被召回；该 issue 是测试提议，不是完成的独立效果证明。 |
| ✅ [context-mode](https://github.com/mksglu/context-mode)，GitHub 清单线索；[Pi 使用者讨论](https://www.reddit.com/r/PiCodingAgent/comments/1ugk8hi/contextmode_is_adding_15k_tokens_to_every_request/)、[中文原帖](https://linux.do/t/topic/2305228?tl=en)；固定 `8b74cbba`，Elastic-2.0 | **[组件试用记录](../../experiments/context-mode-retrieval.md)已获非作者接收**：组件已试，不是整插件采用，去向 [13 值得一试](../13-frontier-radar.md#值得一试近4周的新项目与做法)。已有路径仍用 `rg`＋按段读取；反复多源查阅才试显式索引，不声称提效。全插件启动会修用户 hooks/settings，独立 server 也有旧库清理／会话索引，先不启两者；不要把同名托管 gateway 当成本地项目，完整原段取不回就保原法。 | 把大输出存入索引，需要时取回原块，而非只留模型摘要。8 份公开本仓文件／344 块，18 个返回块逐字存在；两个完整中文问题无结果，改关键词／限定来源才补齐，入库时间不能当核实日。Pi 用户有保留长任务用法，也有报告额外提示、重复加载工具和临时交接丢失；版本未明确，不能直接套成当前故障率。 |
