主线：二，兼三
改变的建议：23 §6：修复通过与缺陷隔离分开；改断言要回原业务契约，不能由退出0推完成
新证据：官方 healer定义、fixture调试修复链、相反社区产物、已有runner 1.57的failed→fixme/skipped实测；非模型自修复效果

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
