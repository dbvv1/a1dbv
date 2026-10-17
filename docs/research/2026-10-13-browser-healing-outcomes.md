主线：二，兼三
改变的建议：23 §6：修复与隔离分开；页面迁移先核实际分支与本次记录，改断言仍回原业务契约
新证据：官方定义、runner隔离实测与合成修复产物；新增真实Forms迁移的固定补丁、AI辅助评审及有限修后回执

# Playwright Healer：修复通过与缺陷隔离

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
