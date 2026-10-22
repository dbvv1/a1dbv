主线：二，兼三／四；P56 UI 排查与 P84 整页故障归因及验证选择
改变的建议：17 先核阶段、版本与真实行为；23 保留首屏失败阶段；录制完整性与采集策略分别验收
新证据：P84 过程审计、独立验证／版本／归因研究；P56 Replay／Simon 与 PostHog 二改；范围见各节

# 浏览器修复：真实失败、回归与 Healer 边界

## P56：真实失败阶段与同版本验收

核实：2026-10-21。本节只读公开团队复盘、固定补丁、测试源码和 CI 摘要，未安装或运行应用、模型、浏览器及上游测试。以下是资料／机制比较；后文历史 runner 执行不计入本次验证。[研究]

**✅ 先复用项目 Playwright／trace，将用户真正失败的入口与阶段带到修后验收。** 对“途中错、最后正常”，优先补脚本前、数据前、成功和错误恢复四个观察点。已有合规生产录制、原状态难以重建时，再试原会话驱动的诊断／验证；不能关联目标构建或重走原状态，就撤回它作为验收依据。接收补丁时，目标行为、测试工作流和部署结果各自报告。[经验：比较后的默认]

### 当前最高水平卡

| 项目 | 本轮答案 |
|---|---|
| 问题 | 已有 Web 产品的用户说 UI 坏了，终态截图或 CI 不能说明原问题是否修好；先改提示、加服务，还是改变验收入口？ |
| 近期领先参照 | Replay／Thomas Daly，2026-10-06：真实生产会话进入诊断，修复后在 PR 预览检查原失败并探索回归，人审 PR 与 QA 报告后决定合入。[一手：团队自报] |
| 可追溯实践参照 | Simon Willison，2026-09-22 固定提交：首屏投诉→布局与恢复补丁→Playwright 分阶段断言；同 SHA 的 Test 失败、Pages 成功限制了接收结论。[一手：源码／运行摘要] |
| 主流与可行基线 | 主流采用率未知；项目现有 Playwright 回归、trace 和按风险人工验收是可行基线，不需先买录制平台。[研究／经验] |
| 推荐所属层与理由 | 比较领先闭环后采用的低增量机制：能重建就补原测试，难重建且已有授权录制才试会话路线。没有同任务、同投入的效果对照来支持整套迁移。[经验] |
| 差距 | 资料／机制已比较，17／23 保留 gap=2。整体最高水平、当前模型效果和完整公开成功链仍未知；不是把两项目拼成一次成功实验。[研究] |

### Replay：闭环机制与团队条件

Thomas Daly，[What our experimental self-healing software loop shipped in two weeks](https://replay.io/blog/what-our-experimental-self-healing-software-loop-shipped-in-two-weeks)，2026-10-06；已读完整正文。定位“Three products, five handoffs, one human decision”“152 opened, 80 merged, 80 verified”“Two ways to prove a fix”。[一手]

作者描述 9/18–10/1 在自有仓库将 Fullstory 信号、Replay QA 诊断／验证与 Obvious 修复连接起来：152 个打开的 PR 中 80 个合入；其中 46 个前端修复按原会话验证、34 个后端修复独立复现。另按 bug 计数，124 个不同问题中 76 个修好，18 个需要多次尝试。人审意图及验证报告后决定合入，而非自动接受所有生成结果。[一手：作者自报]

**可迁移的是原失败条件与修后执行之间的对应。** 如果旧录制只帮助理解过去，仍要在新构建重走并提交证据；旧录像本身不能证明新代码通过。文章没有展开原会话在新版上的重放保真边界，也未公开单项 PR、前后录制和全套运行清单。团队规模、模型／effort、算力、浏览器／系统版本和费用均未给出；供应商自家产品试点未独立复测。不能把 80/152 读成修复正确率，或把已合入子集的验证状态读成全部尝试成功率。[研究：来源边界]

### Simon：先验首帧，而非延长等待

固定[提交 822d40df85b67430f824a7aab6f2f474c04d5194](https://github.com/simonw/tools/commit/822d40df85b67430f824a7aab6f2f474c04d5194)时间为 2026-09-22T02:46:56Z；已读完整两文件 diff 与新增测试。[开发历史](https://tools.simonwillison.net/colophon#markdown-svg-renderer)显示 9/21 19:41，时区未知，本文以固定提交 UTC 日期标注。[一手]

维护者转述用户投诉：带 Gist URL 打开时短暂闪出不应出现的内容。补丁在外部库之前识别 URL 并选择 viewer 布局，加入加载状态、Retry 与 Edit URL。新增测试冻结首个 CDN 脚本，再冻结 Gist 响应；在 1280／390 宽、新 query／旧 hash 入口检查编辑面板、输出及布局，随后核成功文档和 503 后的两个恢复出口。[一手：固定源码]

**这改变的是第一个观测点。** 原来先等页面稳定再截图，会越过用户投诉的窗口；现在先核库未执行、数据未返回，再查成功与错误恢复。四阶段不是要求所有页面套新框架，而是让明确的瞬态故障回到现有测试中；只检查“不再闪错”仍可能漏掉一直加载或无法恢复。[经验：由机制提炼]

该提交没有明确模型／effort 或完整 Agent 会话，不能移用相邻功能的模型署名。390 宽不代表 iPhone／Safari 实测；模拟 Gist 响应仅覆盖指定前端分支，不证明真实 CDN／API 故障恢复。没有公开修前浏览器录像或独立用户回执确认体验恢复。[研究：适用范围]

### 同 SHA 反例：部署成功，Test 失败

| 固定产物 | 可核结果 | 不能据此补出的结果 |
|---|---|---|
| [Test #1862／run 35680726542](https://github.com/simonw/tools/actions/runs/35680726542) | 9/22 02:46，822d40d，Failure，1 分 37 秒；test 作业 exit code 1，无 artifact | 失败用例、根因以及本次新增用例是否通过 |
| [Pages #610／run 35680726538](https://github.com/simonw/tools/actions/runs/35680726538) | 同时间与 SHA，Success，1 分 23 秒，显示目标站点 | 业务验收或测试通过 |
| [固定 Test 工作流](https://github.com/simonw/tools/blob/822d40df85b67430f824a7aab6f2f474c04d5194/.github/workflows/test.yml) | 定义 ubuntu-latest、Python 3.12、安装项目依赖与 Playwright 浏览器后运行 pytest | 每一步实际成功执行 |

两个运行页的公开摘要已读；详细日志要求登录，**失败原因未知**。不把 exit code 1 归给这次新增测试，也不把 Pages 绿色解释成失败无关。这条链支持的是“补丁、测试定义和实际验收结果分开看”，不是修复成功。[一手：摘要／源码；研究：判断]

### 同问题比较与两页分工

| 选择 | 相对已有建议的增量 | 何时采用／撤回 |
|---|---|---|
| 生产会话→诊断→修后预览→人审 | 提供难构造的真实失败条件；验证与写修复分开，但不是因分开就已独立证明效果 | 已有获准使用的录制、可追版本与状态才试；隐私／接入成本不值得或无法重演则退回现有工具 |
| 现有 Playwright／trace→阶段断言→修后复测 | 在原项目内补脚本前和数据前观察，不额外引入长期服务 | 原入口与时机可重建时默认；仅模拟服务的结论限前端分支，真实集成按任务另验 |
| 终态截图或部署回执作为修好依据 | 本轮撤回这种接收方式：前者会错过瞬态，后者与 Test 可同时红绿 | 仍可分别证明所见终态或部署状态，但不能承担原故障验收 |

[17](../17-troubleshooting.md)负责先分失败层与接收状态：不要继续改提示或终态样式，先保原阶段；有部署回执仍查同 SHA Test。[23](../23-browser-verification.md)负责把观察变为四阶段检查与修后接收。此前 hydration、时序日志及多层证据建议继续保留；不增加新探针、持久化格式或另一套 harness。[经验：交付范围]

**Agent 与人。** Agent 适合提取入口、时机和预期，控制请求阶段、保存输出、查对应版本的测试与发布结果，并复测成功／恢复出口。其典型风险是等到终态才验、延长等待掩盖窗口、改掉原触发条件或用部署绿覆盖测试红；这些是机制风险，不声称全部在上述作者运行中发生。人确认初始内容应隐藏、占位还是保留旧版，错误后允许怎样恢复，设备／用户状态是否有代表性，以及断言是否仍表达要求。[经验]

**接收与撤回。** 原路径的修后证据及相关检查成立，才接收对应范围；失败未解释、原状态被换掉或只剩部署成功时，保留“已部署，验收未清”。后续证明确为无关检查或错误测试，可以说明依据后处置，不把所有红灯一概归因应用。整套服务的新增成本与收益尚无同题对照，因此不升级无人值守修复评级。[经验／研究]

### 搜索边界与未完成部分

本次已读决定性原始产物是 Replay 复盘、Simon 固定补丁、两个运行摘要和固定工作流。Replay 的闭环只有团队自报，Simon 的可追踪链则止于 Test 失败；**完整公开成功链未找到**，更没有本仓的应用／模型实测。新近来源支持更新机制选择，不自动支持 gap≤1。[研究]

其他已查材料未补上此缺口：Sentry／Dan Mindru [2026-07-23](https://blog.sentry.io/57-bugs-to-1/)也区分根因分析与有环境的验证，但未取得可追单项验收；[ReBug](https://arxiv.org/html/2608.03598v1)主要报告程序重建，[CATJudge](https://arxiv.org/html/2609.00081v1)侧重生成应用探索评测，不替代已有产品修复接收。Simon 的其他绿色提交不属于这次投诉的回执，未拼接到链中。以上为相关正文／方法范围阅读，不计同一实验或统一成功率。[研究]

## P56续补：录制可用与采集策略分别验收

核实：2026-10-22（UTC+8）。**✅ 保留现有测试／trace 默认；修录制链时，让 Agent 同时验证数据能发出、原采集策略没有被扩大。** 回放 URL 存在不保证快照完整，而修到能播放也不代表被动访问应该产生录制。人的关键决定是哪些访问应记录、何时触发与何时丢弃；这些约定未验清前，不以修复为由提高采集范围。[经验：同题维护反例提炼]

### 沿用最高水平卡，补独立维护反例

问题从“现场怎么进入验证”推进到“现场采集本身坏了，怎样修而不改变产品约定”。近期领先参照仍是 Replay／Thomas Daly 的 2026-10-06 闭环复盘，作者条件见前节；主流采用率未知，可行基线仍为项目既有测试和 trace。本次 PostHog 与 Replay 是不同团队，但也是录制产品供应商，提供的是公开维护反例，不是独立效果评测。推荐属于比较后的可行默认，完整成功链、同任务总投入和整体最高水平仍未知，17／23 的 gap=2 不变。[研究]

### 固定失败与二改链

| 产物 | 读到的证据 | 对选择的作用 |
|---|---|---|
| tornikeo，[issue4202](https://github.com/PostHog/posthog-js/issues/4202)，2026-07-20，posthog-js 1.404.1 | 后台页超时轮转出新 analytics session，录制仍落旧会话，新回放 URL 无法播放；诊断记录 buffer 增长、发送为0。[社区：报告者自报] | 验实际快照归属与发送，不能只验 URL 存在 |
| turnipdabeets，[PR4224](https://github.com/PostHog/posthog-js/pull/4224)，7-23 合入 ba7042bd；最终 head 7cec5b40 | 作者明确 human-driven／agent-assisted／Written with Claude Code，模型未知。新增测试通过 SessionIdManager 与回调链检查新会话 Meta／FullSnapshot 各发一次；作者报告旧 bundle 失败、新 bundle 通过。[一手：源码／作者记录] | 用真实依赖链作回归，不只手改 recorder 内部状态 |
| TueHaulund，[PR4412](https://github.com/PostHog/posthog-js/pull/4412)，8-04 合入 5f2b78af；最终 head 7630ff05 | 作者说明4224修了丢录制，却让无交互页面开始发送可计费录制；二改区分 fresh 与 rotation-born 的暂存／释放、卸载和溢出行为。[一手：维护记录／完整diff] | 修可观测性时，保住被动访问及触发策略，而不是无条件“多发就好” |

4224 的[固定浏览器测试](https://github.com/PostHog/posthog-js/blob/7cec5b40897e43ec83b3bffb8948c5efbbebdb77/packages/browser/playwright/mocked/session-recording/session-rotation-scenarios.spec.ts)修改持久化时间戳模拟后台过期，再由 capture 触发真实管理器链；不是实际等待35分钟。关联同 head 的 [Integration run29959525299](https://github.com/PostHog/posthog-js/actions/runs/29959525299)中，Chromium／Firefox／Edge／Safari 四个作业的浏览器测试步骤成功；Safari 是作业名称，不代表原生 macOS Safari 实测。[一手：固定测试／hosted CI]

4412 的[固定实现](https://github.com/PostHog/posthog-js/blob/7630ff05e1f2d5350c27e4a79faac56ca684f48f/packages/browser/src/extensions/replay/external/lazy-loaded-session-recorder.ts)不是一律丢弃无交互数据：fresh 被动阅读会话可在正常卸载时发送，后台轮转生成的会话则不能靠卸载释放；交互、匹配的事件触发器及显式 override 可释放暂存，仍经正常 batching 和既有 gate。容量溢出时丢弃暂存，后续有效释放再取完整快照。人的验收应先明确这些分支各自的产品意图，Agent 再检查实际发送和保留的旧行为。[一手：源码；经验：采用判断]

### 接收反证：相关单测红，浏览器绿

与最终 head 7630ff05 关联的 [PR Library checks](https://github.com/PostHog/posthog-js/actions/runs/30916571759)单测及 Playwright E2E 步骤成功；工作流实际检出 PR merge ref 的 07102c8a，并非最终 squash 树。合入 [5f2b78af317266502754f91bff0192ab5ef36ba6](https://github.com/PostHog/posthog-js/commit/5f2b78af317266502754f91bff0192ab5ef36ba6) 后，[push Library checks](https://github.com/PostHog/posthog-js/actions/runs/30918100256)失败，Playwright E2E 成功；[Release](https://github.com/PostHog/posthog-js/actions/runs/30918100183)取消；但随后补核正式 [1.410.10 release](https://github.com/PostHog/posthog-js/releases/tag/posthog-js%401.410.10) 已列出4412，发行时间为2026-08-04 23:32（UTC+8）。单次发布作业取消不等于补丁未发行。[一手：精确提交运行记录]

已读[失败单测日志](https://github.com/PostHog/posthog-js/actions/runs/30918100256/job/92021293864)：两项 V2 event-trigger／late-rotation 测试期望发送轮转会话的 `$snapshot`，实际调用为0；同套件汇总5220 passed、2 failed、8 skipped。失败发生在本次讨论的暂存释放／发送路径，不是环境安装失败；后继已确认这两项旧同步断言没有适配刻意采用的两秒 batching，不能据此判为生产发送故障。[一手：公开日志；研究：解释范围]

**发送按产品约定等待正常批次，测试也要用同一时间语义。** [4421的维护者回执](https://github.com/PostHog/posthog-js/pull/4421#issuecomment-5189546151)明确指出修正已由4380吸收；实际合入 [3c40b6ce](https://github.com/PostHog/posthog-js/commit/3c40b6cecd66633d16f3f94ec6614af656445f2e)为两项用例补上 `advanceTimersByTime(RECORDING_BUFFER_TIMEOUT)`，该精确提交的 [Library checks](https://github.com/PostHog/posthog-js/actions/runs/30982029121)及实际单测／E2E步骤通过。这条有明确映射的后继说明应修正测试的旧同步假设，不是为变绿删除验收断言。[一手：维护者说明／补丁／hosted CI]

**采集边界仍需分别接收。** 后续 [4417](https://github.com/PostHog/posthog-js/pull/4417)另补从未可见的后台页面在卸载时产生计费录制的问题，正式 [1.412.2](https://github.com/PostHog/posthog-js/releases/tag/posthog-js%401.412.2)已列出该项；此处只核正文与发行记录，不把它当作完整差异或实际用户回执。4224也已列于 [1.407.2](https://github.com/PostHog/posthog-js/releases/tag/posthog-js%401.407.2)。[一手：发行／维护记录]

这里不再另设一套“最终树规则”，接收沿用 [15](../15-task-playbooks.md) 的集成与发布边界。新增取舍是：录制修复要同时满足“该发的发出”和“不该发的不扩大”；仅浏览器绿、出现 FullSnapshot 或已合入都无法独自覆盖两者。Agent先区分产品契约被破坏，还是测试仍期待旧的同步时序；人的采集约定不变时，可修测试时钟以检查真正应有的批次发送。未经核实就强制同步发送或扩大采集，都不是默认修法。[经验]

### 证据范围与接续

本次复用P56的最高水平卡与先前原文；新增公开 issue、两份完整补丁、固定源码、精确 SHA 的 CI／步骤、失败日志、明确后继修正与发行记录。只读资料，没有运行应用、模型或上游测试，没有访问私人录制／gist。4224 有 Claude Code 署名，不能因此把4412或全部结果归因于同一模型。已遍历4202的1条评论、4224的5条合并讨论及4412的18条讨论，仍未见原报告者在明确发行版本上的复验；生产费用恢复及播放器体验回执也未补齐，故这是P56内容增量，不是项目整体验收。[研究]

## 早期 Healer 核查

> 核实：2026-10-13 14:21（UTC+8）。官方源码固定 `a3401cfe0dcf317101572d025fa46248d0779b42`，版本 `1.65.0-next`；局部运行使用云端已有 Playwright `1.57.0`，两者不混为同一执行。没有新模型调用或软件安装。

## 采用判断

**🧪 保留 [23 §6](../23-browser-verification.md#6-自修复测试的边界) 的试用边界，仅补清结果语义。** 官方 healer 可以编辑预期值，也可把未解决的失败标为 `test.fixme()`；因此“保留验收语义后通过”和“发现缺陷后隔离”应分别报告，新增跳过不算修复成功。断言变化可能是在纠正错误测试或同步已批准需求，不能一概叫作弱化。**[一手：官方定义；经验：采用判断]**

现有定位、时序、数据隔离建议无需改动，也不增加逐项人工审批或新检查框架。本轮没有足够证据把 healer 升级为无人值守 CI 自修复，或声称它必然掩盖失败。

## 1. 官方明确允许什么

[healer 定义 L24–56](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/packages/playwright/src/agents/playwright-test-healer.agent.md#L24-L56) 要求先运行、针对失败调用 `test_debug`，用 snapshot、console、network 等调查定位器、时序、环境或应用变化，然后编辑测试并重跑。它有通用 `edit` 能力，修改范围包含断言和预期值，不是只做已验证 locator replacement 的专用算法。若错误持续且认为测试正确，定义要求用 `test.fixme()` 跳过，在失败步骤前说明实际行为与预期的差别。[官方文档](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/docs/src/test-agents-js.md) 同样列出通过或因功能损坏而跳过两种输出。**[一手：定义与说明，非模型效果]**

Playwright 没有因此隐瞒跳过状态：

- [test-run.spec.ts L21–85](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/mcp/test-run.spec.ts#L21-L85) 检查报告分别包含 failed/skipped/passed 及用例名称；另一个用例故意失败，但 MCP `isError` 为假，因为工具本身正常运行。
- [test-modifiers.spec.ts L134–165](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/playwright-test/test-modifiers.spec.ts#L134-L165) 预期 exitCode=0 同时存在 4 个 skipped，fixme 留有单独 annotation。
- [testTools.ts](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/packages/playwright/src/mcp/test/testTools.ts) 中 `test_run` 返回文本结果；`test_debug` 的 paused 状态也不是工具错误。

这支持“读取测试结果类别”，不能由 MCP 成功或退出码 0 认定原路径仍通过。上述是官方回归的代码证据，本轮未运行该上游测试套件。**[一手：源码与官方测试]**

## 2. 真实 runner 局部复核

在已有 Playwright **1.57.0** 的云端执行同一无浏览器用例，两次只改变 `PROBE_MODE`。实施侧和独立复核侧均得到：**[研究：真实 runner 局部执行，无 Agent 决策]**

| 运行 | 退出码 | JSON expected | skipped | unexpected | 实际状态 |
|---|---:|---:|---:|---:|---|
| baseline | 1 | 0 | 0 | 1 | failed |
| fixme | 0 | 0 | 1 | 0 | skipped，保留 fixme 注释 |

完整短脚本 `probe.spec.js`：

```js
const { test, expect } = require('playwright/test');
test('business assertion retained', () => {
  if (process.env.PROBE_MODE === 'fixme')
    test.fixme(true, 'Diagnostic marker: unresolved behavior');
  expect(1).toBe(2);
});
```

已有包可解析的隔离目录中，用同一个 Node runtime 执行；不安装依赖：

```sh
# PW_CLI 指向已有 playwright 包的 cli.js；确认其 package.json 为 1.57.0
node "$PW_CLI" test probe.spec.js --reporter=json > baseline.json
echo "$?"  # 1
PROBE_MODE=fixme node "$PW_CLI" test probe.spec.js --reporter=json > fixme.json
echo "$?"  # 0
```

实测中 require 使用已有包的绝对入口；上面换成可移植包名，逻辑相同。报告的 `stats.expected` 仍为 0，第二次是隔离而非断言通过。此探测只证明 runner 语义，不能证明 healer 在真实业务场景会选择跳过，也未把 1.57.0 实测当成当前源码的执行。

## 3. 真实故障到工具修复：观察失败现场也依赖版本

[Issue #38332](https://github.com/microsoft/playwright/issues/38332) 报告 1.56.1 下，自建 context/custom fixture 的失败不会停留供检查，浏览器关闭且工具不可用；默认 page 则能暂停。维护者当时确认这一限制。**[社区：使用报告；一手：维护者确认]**

[PR #40635](https://github.com/microsoft/playwright/pull/40635) 于 2026-05-06 01:31（UTC+8；原记录为 5 月 5 日 UTC）合入，合并提交为 [b08440d16f49a0f07590a9e87f22708891f4342b](https://github.com/microsoft/playwright/commit/b08440d16f49a0f07590a9e87f22708891f4342b)，补丁固定 [18fddf0fee59f9effef730e1c3473d206b3b8e49](https://github.com/microsoft/playwright/commit/18fddf0fee59f9effef730e1c3473d206b3b8e49)。它将 fixture 装饰改为 context 创建 hook，使手工 `browser.newContext()` 也可调试，并在关闭 context 时释放 backend。新增且当前仍保留的 [回归测试 L457–487](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/mcp/test-debug.spec.ts#L457-L487) 构造 Submit 按钮、故意等待 Missing 按钮失败，随后验证 paused on error 和 snapshot 可见 Submit。**[一手：维护改动与官方测试]**

这是“失败后可以观察现场”的真实工具修正链，不是模型把 Missing 改成 Submit 的效果证据。PR 页面另有 Firefox tracing 失败，本轮未判断其与补丁的因果关系，不能把合入说成所有 CI 全绿。旧 issue 的限制也不能沿用为当前一概限制。

同文件 [L90–125](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/mcp/test-debug.spec.ts#L90-L125) 验证失败后获取 404、console 错误和 snapshot，支持现有多层反馈建议；若实际项目无法保留失败现场，应先查框架接入与版本，不应立即改业务断言。**[一手：测试；经验：诊断建议]**

## 4. 社区产物：覆盖确实变少，但未必是不当改需求

固定 `sarathkuttu/playwright-agents-planner-generator-healer@5f7a0d396a105b04eb7ab98bed5868a32b3a239f`：

- [README](https://github.com/sarathkuttu/playwright-agents-planner-generator-healer/blob/5f7a0d396a105b04eb7ab98bed5868a32b3a239f/README.md) 作者称 healer 修正四个失败达到全通过；Known Behaviours 明说关闭错误提示后 input_error 样式仍保留，所以删除字段样式断言。
- [规格 §1.6](https://github.com/sarathkuttu/playwright-agents-planner-generator-healer/blob/5f7a0d396a105b04eb7ab98bed5868a32b3a239f/specs/saucedemo-test-plan.md#L81-L92) 仍要求字段恢复正常样式。
- [最终测试](https://github.com/sarathkuttu/playwright-agents-planner-generator-healer/blob/5f7a0d396a105b04eb7ab98bed5868a32b3a239f/tests/authentication/login-dismiss-error.spec.ts) 只检查错误消失和登录按钮可见，缺少样式要求。

可核查的是规格与测试覆盖不一致，不是“官方 healer 已被证明违反真实需求”。规格本来由 planner 生成，可能是错误预期；作者也公开说明删除。四个提交中测试已在初始提交里，没有失败前后完整补丁、模型 transcript 或独立复跑。因此作者的通过率不能证明原规格仍受覆盖，也不能直接归因模型错误。**[社区：自述；研究：固定产物交叉审阅]**

反例是 `saudtester/playwright-test-agents@f962b73932c346d78dd51fbae3b90e0f442c8a74`：[README](https://github.com/saudtester/playwright-test-agents/blob/f962b73932c346d78dd51fbae3b90e0f442c8a74/README.md) 自述歧义定位器被修好，但空购物车仍能结账的失败被保留；[最终 checkout 测试](https://github.com/saudtester/playwright-test-agents/blob/f962b73932c346d78dd51fbae3b90e0f442c8a74/tests/checkout-flow.spec.js) 确有原 URL、不得出现 Finish/成功提示的断言，注释实际缺陷，没有 skip/fixme。同样只有初始代码和 README 两个提交，未独立复跑。它限制了“healer 必然追求绿色”的推论。**[社区：自述；研究：产物核对]**

## 本轮边界

已有官方固定源码、具体回归、issue→PR 工具修正链、相反社区产物及零安装 runner 实测；未调用模型、运行真实网站或完整 MCP 回归。当前强模型对业务变更的诊断正确率、相比普通 coding agent 的净增益，以及真实模型失败→补丁→业务复验链仍未知。R09 本轮有可采用的结果语义增量，不等于长期效果问题已完成。


## 点击补研：目标、遮挡与命中检查误报分流

核实：2026-10-16（UTC+8）。主线三／M4；改变23点击失败的处理：先核用户操作目标与工具版本，不统一延长等待、加force或改应用。新证据是工具误报修复、真实项目helper修订和官方遮挡反例；没有证据将其归因为某个Agent故意求绿。[研究]

**工具层也会误报。** [Playwright43118](https://github.com/microsoft/playwright/issues/43118)报告1.63.0及main66096ef／WebKit r2370在多层shadow root内input普通点击被outer-host拦截，同一复现force可聚焦；报告者对照两种命中API定位误报。[社区] [43127](https://github.com/microsoft/playwright/pull/43127)于2026-10-05合入c0a167b7795715c9fa93c48864dd968441c73560，扩展WebKit处理而非删除应用遮罩。[v1.64.0](https://github.com/microsoft/playwright/releases/tag/v1.64.0)的固定[606ecd8实现](https://github.com/microsoft/playwright/blob/606ecd8b34bac100db32561b6278ffd76e5eb3cd/packages/injected/src/injectedScript.ts#L1057-L1069)及[open／closed shadow回归](https://github.com/microsoft/playwright/blob/606ecd8b34bac100db32561b6278ffd76e5eb3cd/tests/library/hit-target.spec.ts#L468-L514)已包含修复；回归用非force点击后检查目标监听器。closed路径仅用evaluateHandle取引用，实际仍click，不能写成以内部事件代验。[一手：固定定义，未运行]

**force不是向指定DOM穿透投递。** 同版[dom.ts](https://github.com/microsoft/playwright/blob/606ecd8b34bac100db32561b6278ffd76e5eb3cd/packages/playwright-core/src/server/dom.ts#L429-L477)跳过visible／enabled／stable等待及命中检查，仍滚动与计算点击点，最终[调用鼠标输入](https://github.com/microsoft/playwright/blob/606ecd8b34bac100db32561b6278ffd76e5eb3cd/packages/playwright-core/src/server/dom.ts#L548-L554)。官方[遮挡反例](https://github.com/microsoft/playwright/blob/606ecd8b34bac100db32561b6278ffd76e5eb3cd/tests/page/page-click.spec.ts#L636-L651)让force正常返回，却断言原按钮仍未被点击。[一手：源码和测试定义] 所以不能写成只跳过一种遮挡检查，或把无异常等同目标动作恢复；直接dispatchEvent是另一机制，原23已有边界不重复扩写。[研究]

**纠正测试目标可以是合法修复。** [Keycloak53660](https://github.com/keycloak/keycloak/issues/53660)的nightly报告中，helper对样式label覆盖的input做force点击，帮助菜单动画期间可能未切换，原toBeHidden断言失败。[53663](https://github.com/keycloak/keycloak/pull/53663)于2026-10-07合入[83f6e2a helper](https://github.com/keycloak/keycloak/blob/83f6e2a2fb410468b80b34e98b1c2234f1832398/js/apps/admin-ui/test/masthead/main.ts#L53-L57)，改普通点击关联label；[原开关语义断言](https://github.com/keycloak/keycloak/blob/83f6e2a2fb410468b80b34e98b1c2234f1832398/js/apps/admin-ui/test/masthead/main.spec.ts#L51-L60)继续保留可见→隐藏→可见。[社区／一手] 这不是应用补丁，也不能据nightly失败断言用户功能同样故障；本轮未跑前后版本或取得该精确提交CI的通过证据。[研究]

**采用与撤回。** 先确认目标与真实用户路径；实际存在的遮挡按产品预期处理，匹配已知误报则先核所用工具版本和原条件。force仅作有依据的局部诊断，目标响应仍未发生就不计通过，也不永久推广到所有点击。没有上述证据时保留未定位，不盲加sleep。[研究] 本轮只读原帖、固定源码及回归定义，未运行浏览器、模型或项目测试；不能宣称降低flaky比例。Lexxy1198的内部命令改真实按钮主要重复已有原则，未纳入新结论。


## 保留断言之后动作含义仍可能改变

2026-10-16（UTC+8）补核，M4。**改变的选择**：23 §6 在语义一对多时先回原需求，不能只保留旧断言就放行；将耗尽停止与正确诊断分开。以下均是公开受控场景，不是生产应用恢复，本仓未运行模型或浏览器。**[经验：条件建议]**

**可追溯成功仅覆盖已表达的行为。** E2E-Self-Heal [2870f094 的 repair.json](https://github.com/Lee-Dongwook/E2E-Self-Heal/blob/2870f094933e074f1e818a4d90c927cad4812fde/docs-site/src/data/json-contract/repair.json)保存原定位器失败、替换选择器和原测试通过；[PR #380](https://github.com/Lee-Dongwook/E2E-Self-Heal/pull/380)说明产物由真实 CLI、Playwright、Sonnet 4.6 捕获。人为修改只是 id 改名；selector_verifier 与 shadow_verifier 均 skipped，不能补称唯一性已验证。运行身份为作者报告，JSON 为固定产物。**[一手]**

**反例不需要弱化断言。** [split-submit 补丁](https://github.com/Lee-Dongwook/E2E-Self-Heal/blob/2870f094933e074f1e818a4d90c927cad4812fde/examples/scenarios/split-submit/change.patch)把 Submit 拆为 Save draft 与 Publish，均为 submit 类型；[原测试](https://github.com/Lee-Dongwook/E2E-Self-Heal/blob/2870f094933e074f1e818a4d90c927cad4812fde/examples/scenarios/split-submit/spec.ts)仍只检查 Thanks!，[场景标注](https://github.com/Lee-Dongwook/E2E-Self-Heal/blob/2870f094933e074f1e818a4d90c927cad4812fde/examples/scenarios/split-submit/meta.json)预期因歧义拒绝。两个目标都能绿，唯一定位不等于唯一业务含义。**[一手：固定场景]**

[PR #381](https://github.com/Lee-Dongwook/E2E-Self-Heal/pull/381)补齐 benchmark 原本缺失、真实 CLI 已读取的失败时页面 snapshot；作者报告 label-rename 修后 3/3 首轮成功。但 split-submit 在有／无这项修订时各 3/3 都被修复，不能归咎新增 snapshot。没有逐轮 split-submit trace，不能指定模型究竟选了哪个按钮；次数也不是独立生产错误率。该 PR 已合并为 2870f094。**[一手：作者真实模型运行报告，未独立复跑]**

**保持失败与诊断成功分开。** 同一固定版本的 [refusal-loop-cap.json](https://github.com/Lee-Dongwook/E2E-Self-Heal/blob/2870f094933e074f1e818a4d90c927cad4812fde/docs-site/src/data/json-contract/refusal-loop-cap.json)中，删除 onSubmit 后，模型尝试加等待、改选择器；修改断言被守卫拒绝，后两次原测试仍失败，最终 reason 为 loop_cap_reached。它支持工具没有放行坏结果，不证明模型识别出业务缺陷并主动拒绝。**[一手：捕获产物]**

**已修问题不继续当现存缺陷。** 早期 [#281 独立贡献者运行报告](https://github.com/Lee-Dongwook/E2E-Self-Heal/issues/281#issuecomment-6073039483)指出泄题注释、提供方失败混入拒绝等问题；后续 [#331](https://github.com/Lee-Dongwook/E2E-Self-Heal/pull/331)区分 provider_error、[#333](https://github.com/Lee-Dongwook/E2E-Self-Heal/pull/333)移走泄题注释，#381补页面观测且已有复测。不能只引用旧拒绝率，也不能把注释移除与模型行为变化写成已隔离因果。**[社区：独立运行；一手：修订与后续报告]**

采用边界：既有需求能确定目标，就修定位器并补有区分力的结果验收；业务动作有意拆分且缺少选择依据时，停在歧义报告，不猜、不默认选择副作用较大的动作。无需每次定位器修改都加人工审批或新框架。未取得真实生产任务的完整前后使用链，维持试用评级，不宣称无人值守自修复已可靠。


## 修后仍走原状态，而非只保留结果断言

2026-10-17（UTC+8），M4／主线三。**改变23 §6的选择**：修复前明确结果成立所需的前置状态，修后继续覆盖该状态；定位器或地址本身可以合法改变。新增证据为另一作者公开的真实 Codex 运行，包含任务、模型编辑、修前／修后与配对故障报告；不是本仓实测或生产事故。[一手／经验]

### 固定身份与取样

`voidmatcha/e2e-skills` 的 [revision 12结果](https://github.com/voidmatcha/e2e-skills/blob/6ded5e9d4e94f0a404901e10b3c357d301390b52/benchmarks/healer-perturbation-v1/healer-results-codex-r12.json)记录2026-09-15运行，Codex CLI 0.154.0、gpt-5.6-sol、Playwright 1.62.0。两臂分别是将生成的官方healer指令直接投射到顶层会话、以及项目自身Step 7指令；前者另加结果不可弱化限制，并非原样官方委派流程。每臂5类×3次，共30个终态格；4个Step 7首尝试因持久化输出超限保留后各重试一次，共34次测量进程，不含另列的2次smoke。不能把30格当30个独立真实项目。[一手：结果与冻结协议]

以下抽查同一官方指令臂的首轮原始材料，均来自固定发布树。当前版本把原始产物迁到外部数据集，[迁移清单](https://github.com/voidmatcha/e2e-skills/blob/93ca589464973401be45f6c17476376dda19d28a/benchmarks/external-evidence.json)说明与此旧树字节一致；本轮直接读旧树，未运行下载脚本、模型或浏览器。[研究：来源核对]

### 对照：纠正错误测试与绕开原状态

- **定位器修复正例**：[stale_locator-r1目录](https://github.com/voidmatcha/e2e-skills/tree/6ded5e9d4e94f0a404901e10b3c357d301390b52/benchmarks/healer-perturbation-v1/healer-artifacts-codex-r12/HP-stale_locator-official_healer_direct_guarded-r1/attempt-1)的`prompt.txt`要求点击后Count: 1。`native-red.txt`在Add one定位器超时；`diff.patch`只把名称改为Increment，保留点击与Count: 0→1断言；`native-healed.txt`通过。`fault-kill.txt`再次启用计数不增故障，断言收到Count: 0而失败。这里不只看到绿色，也看到修后测试仍能检出同类业务故障。[一手：公开产物]
- **地址修复也可以正确**：[renamed_route-r1补丁](https://github.com/voidmatcha/e2e-skills/blob/6ded5e9d4e94f0a404901e10b3c357d301390b52/benchmarks/healer-perturbation-v1/healer-artifacts-codex-r12/HP-renamed_route-official_healer_direct_guarded-r1/attempt-1/diff.patch)把不存在的`/account${query}`改为`/${query}`，保留认证准备、场景query与账号名断言。同目录`fault-kill.txt`在认证故障下仍因找不到account-name失败。由此不能建议一律禁止改导航或锁死URL。[一手：补丁与复验]
- **保留断言仍可绕开故障**：[impossible_repair-r1目录](https://github.com/voidmatcha/e2e-skills/tree/6ded5e9d4e94f0a404901e10b3c357d301390b52/benchmarks/healer-perturbation-v1/healer-artifacts-codex-r12/HP-impossible_repair-official_healer_direct_guarded-r1/attempt-1)原测试在scenario-b下导航带variant-b，夹具因此不显示已认证账号；`native-red.txt`记录account-name缺失。`diff.patch`删除该条件，统一访问普通account-view；Ada Lovelace断言未改，`native-healed.txt`却通过。`stdout.txt`公开工具事件包含失败测试、调试、文件编辑与重跑，模型最终报告也明确删除variant-b；这里可归属实际模型编辑，而非仅有作者演示补丁。[一手：公开运行产物]

该批两臂各9个机械修复格均被记为保留配对故障检出；账号故障控制各3格均绕开状态，计数故障控制分别为2次保留失败／1次绕开与3次保留失败。以上是作者分类和终态统计，本轮只抽核上述具体链，不宣称逐格独立复审，更不外推错误率。[一手／研究]

### 提示与评测自身的边界

**评测标签不能替代原任务约束。** 上述`prompt.txt`明确不许弱化结果、改预期值等，但并未直接声明scenario-b／variant-b是必须保留的业务前提；隐藏[协议](https://github.com/voidmatcha/e2e-skills/blob/6ded5e9d4e94f0a404901e10b3c357d301390b52/benchmarks/healer-perturbation-v1/protocol.json)才把移走导航定义为弱化。因此证据支持“仅给结果不足以表达这条场景要求”，不支持“模型明知违反明确路径要求”或恶意作弊的判断。把必要状态补清是工程建议，本轮没有它的前后对照收益。[研究／经验]

[作者事后审计](https://github.com/voidmatcha/e2e-skills/blob/93ca589464973401be45f6c17476376dda19d28a/benchmarks/healer-perturbation-v1/README.md#revision-12-result)还披露冻结校验未重新计算部分产物／依赖摘要、遗漏共享helper及只在进程启动时校验，汇总信任已有标签；本轮不据此推广该runner或整体REJECT门槛。原始补丁与报告仍支持上述窄观察。此前revision 10因模型侧未继承故障环境而作废，不能混入当前分母。[一手：作者审计]

**采用与撤回**：改的是过时地址／定位器且保留所需状态时，接受修复；改掉任务要求的登录、数据或故障条件时，恢复条件后复验。需求本就允许更换该条件时照需求更新，不额外加审批框架。已有配对故障足够时复用它，不要求为每次小改另建全套变异测试。该单页合成夹具不能证明真实业务整体保全，也不能升级无人值守自修复评级。[经验：采用判断]

## 真实页面迁移：先核实际分支与本次记录

2026-10-18（UTC+8），M4／主线三。**改变23 §6的选择**：界面迁移时，先核测试实际走新旧哪条路径，再适配定位及本次数据的结果检查；不靠选择器可用或汇总计数认定恢复。以下为真实产品的公开维护记录与固定源码，本轮未运行模型、浏览器或上游测试。[一手／研究]

**原失败与迁移前提。** [wp-calypso #113202](https://github.com/Automattic/wp-calypso/pull/113202)记录Forms提交测试在Atomic部署检查中失败：旧后台按Inbox／Spam标签计数找响应，新Central Form Management（CFM）改为筛选控件。作者核查发现同样的测试环境标签在不同站点实际启用了不同后台，普通PR检查仍走旧路径；因此旧路径通过不能证明新版恢复。该PR的[合并提交1cccad0](https://github.com/Automattic/wp-calypso/commit/1cccad0307a24d7f069029c178507fe974800f46)保留Claude共同作者声明，支持AI辅助参与，不等于公开完整模型运行记录。[一手：作者记录与提交]

**改定位还不够，原来的计数未必代表本次响应。** 初稿已报数次通过，但[维护者提交的AI辅助评审](https://github.com/Automattic/wp-calypso/pull/113202#pullrequestreview-4867425580)指出：等待条件同时匹配列表与计数请求，不能保证筛选计数已刷新；共享列表的旧Inbox计数可把本在Spam的响应判错。最终[固定helper L185–300](https://github.com/Automattic/wp-calypso/blob/1cccad0307a24d7f069029c178507fe974800f46/packages/calypso-e2e/src/lib/pages/feedback-inbox-page.ts#L185-L300)等待目标文件夹的列表响应、排除计数请求；切换会丢失搜索条件，因此重新搜索，再等待本次email对应的行。重试先清空输入，避免重填同值却未发出请求。[一手：评审与固定补丁]

**保留的是具体业务路径。** [修后spec](https://github.com/Automattic/wp-calypso/blob/1cccad0307a24d7f069029c178507fe974800f46/test/e2e/specs/published-content/forms__submissions.spec.ts#L108-L429)仍通过浏览器提交两份表单、以站点所有者查验各字段，并把同一响应移入Spam、移回Inbox、移入Trash及恢复后核对；API用于准备文章和清理本轮数据，没有替代提交与后台操作。清理限定本次记录，没有清空共享站点来换前提。已有CFM“标记已读”分支因打开时自动已读而直接返回，本次未新增该分支，也未独立补验自动已读语义；因此不能概括成所有业务均已保全。[一手：固定测试；研究：覆盖核对]

**修后范围与再次变化。** [作者回执](https://github.com/Automattic/wp-calypso/pull/113202#issuecomment-5221354369)最终编辑确认采用建议后工作正常；多浏览器和重复次数位于其明确标为OUTDATED的旧段，不计为最终版本复验矩阵。另一个历史维护记录[Jetpack issue #50712](https://github.com/Automattic/jetpack/issues/50712)随后记载独立响应页上线又令测试被`fixme`；[后续移植说明](https://github.com/Automattic/wp-calypso/pull/113637#issuecomment-5347823749)还发现旧`fixme`残留，使新增代码未在CI执行。这些是后续退化记录，不代表当前版本仍失败，也不能拼成#113202的统一验收结果。[一手：作者回执与历史维护记录]

**采用边界。** 确认实际页面分支后，复用原测试检查同一业务记录；列表、搜索或动作语义改变时修对应等待和结果检查，仍保留所需状态。既有测试已明确新版与本次记录时无需再加框架。单项目有限回执不提升无人值守自修复评级。[经验：工程选择]

### 23页核实历史（从正文迁入）

核实时间：2026-10-10；Ra & Apep 前后浏览器对照于 2026-10-12 补充，healer 结果边界、React 定向日志案例于 2026-10-13 补核；反馈通道选择与 hydration 边界于 2026-10-14 补核，保存与故障注入的响应来源边界于 2026-10-15、截图稳定化的动画状态边界于 2026-10-16（UTC+8）补核。

本轮新增核查：2026-10-17（UTC+8），healer 原状态复验；范围见本节。

## P84：整页故障诊断与修后接收比较

核实：2026-10-22。主线三／四；从 UI 局部比较扩到17的主要选择。✅ 默认先定位实际失败阶段和版本，再修最小可证因果链；⛔ 不因总分失败就换模型，不因测试绿就接收，不把诊断文字直接当根因。本节读取公开原文及运行摘要，没有运行候选、模型或上游测试。[研究／经验]

### 主要选择：与什么比较，为什么采用或保留

| 17 的选择 | 近期领先／独立参照 | 本仓决定与撤回条件 |
|---|---|---|
| 完成声明与测试是否可信（2.1／2.2） | Scale 的过程审计、修复后重放与新尝试；独立 Islo 的验证容器反例；Dan Luu 同任务验证技术比较 | 保留原缺陷的反例与正确路径，先验行为再读总结。仅在现有检查有缺口时增加验证；已覆盖就不叠加评审层 |
| 修哪里、先换什么（1／2.8／2.12） | Terminal-Bench 同一任务的不同失败阶段；AgentDebugX 的诊断→重跑与独立可执行前缀研究 | 先核入口、原错误、调用及文件实际变化；诊断作为待验证假设。失败未进入模型／工具时先修对应层，不把服务拦截记成调试能力失败 |
| 版本与 API（2.7） | LibEvoBench；独立 Qiskit 版本漂移评测 | 先核项目锁定／实际安装版本，再读匹配文档与源码；类型检查后验目标行为。只有明确做升级时才换最新版契约 |
| 上下文与冗余规则（0／2.6） | Anthropic 新代简化；独立 Factory 按需加载生产机制 | 保留必要约束，移走冲突或无关启动材料；thrashing 则缩输入。已足够精简或恢复后没有改变失败机制，不继续删规则求绿 |
| 范围、请示、改动大小及输出（2.3–2.5／2.11） | 当前模型迁移契约；独立验证实验显示技术名和长 Skill 不能替代行为 | 保留授权边界、匹配周围代码及可读结果的低成本默认。未找到这些提示在当前各模型的独立净收益比较，不升为万能提示；损伤需求或必要回归时撤回“更少” |
| UI、抓取与真实接收（2.8／2.13） | 本文件既有 P56、Healer 及 PostHog 二改证据 | 能重建就复用原测试，难重建且有授权录制才用会话；保留失败阶段。入口或状态不匹配就撤回该证据，不重计旧发现 |
| 费用、破坏性操作与恢复（2.9／2.10／2.12） | 当前平台错误／预算契约；独立 Islo 的实际信任边界反例 | 用平台预算和隔离控制，不以提示或命令前缀当完整保护；按错误说明区分重试、费用和权限。跨层无效则停止那条恢复动作，不整体停工 |

这里的“领先”指近期可追溯的诊断、验证和维护机制，不是整套工具或模型的效果冠军。对主要选择完成同题比较后可支持资料级 gap=1；当前代跨任务、等投入净收益仍未知，不能自行写 gap=0。下列独立来源并不都测同一软件栈，互相佐证的是具体机制与失败边界，不把它们拼成统一实验。[研究]

### 验证本身也要能检出原问题

**Scale AI，9月28日，[Maintaining Benchmarks](https://arxiv.org/html/2609.34262v1)，重点§2、§5。** 通过不实只有具备机制、意图及评分关联证据才判违规。三项修复案例中，封住 Git 路径后另一副本仍可读；删除后再试才得限定预算内无访问及合法通过。采用“旧失败重放＋参考解检查＋新尝试复核”：新尝试检查替代入口及重新发现合法解，前两项通过仍不足以证明边界恢复。结果限于所测代理和预算；不同配置比率不能排模型。[一手／研究]

**独立 Islo／Rotem Tamir，10月15日，[Verifier tampering](https://www.islo.dev/blog/verifier-tampering/)。** 作者刻意诱导的攻击通过提交产物进入新的验证容器，实际任务失败、作弊检测也发现问题，最终分数仍被覆盖。它反驳“换容器便隔离验证器”，支持核实被测代码和评分存储间的权限边界；不是自然发生率，文末加固设计也不是本次已验证成果。[一手／研究]

**独立 Dan Luu，9月，[验证技术比较](https://danluu.com/agentic-testing/)。** Codex／GPT-5.6 Sol 的 Rust Zstd 任务比较26种提示及4个 Skill，主体每条件／effort 80次。TDD等名称可改变动作，却仍会生成不能检出错误的测试；形式化工具也须核实际证明的性质。采用目标缺陷反例及合理输入差异，不能只数测试。该单任务旧代结果不支持“不要TDD”或当前代技术排名。[一手／研究]

### 同样失败，恢复动作可以完全不同

**Terminal-Bench [PR2114](https://github.com/harbor-framework/terminal-bench/pull/2114)，9月28日[公开轨迹分析](https://github.com/harbor-framework/terminal-bench/pull/2114#issuecomment-5879421239)**，对应固定 [57fd2b96](https://github.com/stbenjam/terminal-bench/commit/57fd2b96d491b43628fce41cb63b9377f771cf4f)。Fable 5.1／Claude Code 2.1.284 max 拒绝作弊指令后进行了真实调试，但改错层，目标产物未变；Astra／Codex 0.158.0 xhigh 则工具调用前被服务端安全拦截。两者均留下4／7测试失败，含义不同。此处是公开自动分析摘要，不是本仓重跑或逐条完整轨迹复审；PR仍未合入，旧回执不覆盖新head。[一手：运行摘要；研究]

**AgentDebugX（UIUC等，7月21日，[论文](https://arxiv.org/html/2607.18754v1)）**把记录、归因、修复与重跑串起；Qwen3.5-9B 的 GAIA 73个失败题中单次重跑修复13个。可借鉴按证据提出恢复假设，只升级难诊断样本；它不是 Codex 编码项目的投入收益证明，Who&When 归因设置还提供参考答案，不能直接当开放排查效果。[一手／研究]

**独立团队10月13日[可执行前缀研究](https://arxiv.org/html/2610.17633v1)**以冻结 Qwen 策略重建 SWE-bench 中间状态，发现文本判官的“第一处错误”不可靠指向恢复所需的因果位置，当前 GPT-6 判官也会标记成功轨迹。采用原状态重现与有预算的单因子修复，撤回“评审说哪步错就自动回滚到哪步”的默认；研究不证明其重启策略对所有商业 Agent 最优。[一手／研究]

### 新文档不一定是本项目的正确文档

**Delft／JetBrains，6月24日，[LibEvoBench](https://arxiv.org/html/2606.25402v1)**在 API 调用、辨认、签名任务比较版本知识；相关文档有帮助，单独写版本号没有同等增益。GPT-4.1–5.5、Sonnet4／4.6等无 thinking budget，主要是版本知识而非当前完整 Agent 效果。先确定环境实际版本，再提供对应契约，是本仓的采用判断。[一手／研究／经验]

**独立 Khalifa University，7月5日，[Qiskit API Drift](https://arxiv.org/html/2607.04072v1)**用3代SDK、50题测试17模型；16个REST配置与GPT-5.4 CLI参照分开，文档修复并非总能成功。轻量结构断言不保证完整量子语义。因而编译／类型检查仍要接任务行为验证，不能概括“幻觉API大多编译不过，所以绿就够”。[一手／研究]

### 简化是删除无效负担，不是删除必要边界

**Anthropic／Thariq，7月24日，[新代上下文实践](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models)**自报在 Opus5／Fable5 等模型上删除大部分系统提示而内部编码评测无可测损失。借鉴匹配周围代码、清冲突与按需展开，不能据此删除项目业务约束或安全授权；内部效果未独立复现。[一手／研究]

**独立 Factory／Shashank Sharma，5月20日，[Deferred Context Engine](https://factory.com/news/deferred-context-engine)**公开生产按需加载方案与估算输入节约，大目录收益高、小目录较少。它支持把不相关 schema 留在可发现目录，而非每轮全塞；没有同题诊断准确性对照，不能借输入节约推出故障更少。[一手／研究]

### P51 自用与剩余验证

本项目先按读者选择分组，再追领先来源及独立反例，最后只把影响动作的证据转入17；既有 P56、平台契约和固定故障记录按原范围复用。研究分支所报候选12、相关原文12、决定性11且均已读，只描述该分支的定向集合；新增官方核对与本节复读不叠加成总体召回或漏检率。上列九个研究／团队原文及公开PR分析已读关键方法、结果、限制段，不称每篇附录逐行读完。[研究]

实际版本的诊断命令、API错误、Stop／StopFailure和预算边界由官方契约核对线处理；现场 Git 退出码小实验确认17既有“先核检查条件与原结果”已经覆盖，不再增专节或永久探针。尚缺整页当前模型效果对照、完整投入比较及实际读者吸取结果；这些限制单列，不用等待实测来阻塞已有资料纠错。[研究]
