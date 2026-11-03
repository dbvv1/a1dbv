# A-VERIFICATION-FACTS-20261102 事实核查：Playwright 用户断言、trace 与失败分析

- 页面：`docs/decisions/verification.md@74be0d09b201cc0aacf925625899cf2d9bd03d3d`；与接收时 main `21b5f4ab` 及本工作树 HEAD 同文。
- 核到版本：`@playwright/test` 1.64.1（npm `latest`，2026-11-03；GitHub tag `v1.64.1` 提交 `cfe490d941f992655948eee8fd4fd94e1c4234bf`，2026-10-14 发布）。
- 核实日期：2026-11-03。
- 方法：只读官方文档与固定 tag 源码；未运行浏览器、Playwright、healer 或本仓测试，未安装包，未改页面。
- 结论边界：以下只证明官方文档、API 和源码定义的机制，不证明本仓浏览器路径、具体回归或真实用户任务通过。

## 影响实际操作的差量

1. **先确认 trace 已开；默认没有。** `testOptions.trace` 默认 `'off'`，官方 recording options 也写明 screenshot、video、trace 默认关闭。页面 L63、L75 的“查 trace”只有在项目配置了 trace 时才成立；失败后找不到 trace，先查 `playwright.config.*` 的 `use.trace`，不要把“没录”当成“没有证据”。

2. **要保留“首次失败”，不能用 `on-first-retry` 代替。** `on-first-retry` 只录第一次重试，首跑失败不录，而且前提是 `retries > 0`。无重试时官方建议 `retain-on-failure`；它每次运行都录，只保留失败运行，后续重试通过时仍保留失败那份。`retain-on-first-failure` 只录首跑且失败才保留。报告里要写清用了哪种模式，才能说明证据来自首跑还是重试。

3. **`context.tracing` 与测试框架 trace 不是同一范围。** 官方 API 明确：`context.tracing` 记录浏览器操作和网络活动，但不记录 `expect` 断言；Playwright Test 配置的 trace 包含这些断言，更完整。只调 `context.tracing.start()` 的库脚本或自定义 harness，trace 里没有业务断言结果，不能拿它单独证明“结果正确”；要断言与 trace 同卷，用 test runner 的 `use.trace`。

4. **重试通过默认仍算绿，必须单列或显式开启失败。** 官方重试文档默认不重试，并把结果分为 passed、flaky、failed；flaky 指首跑失败、重试通过。固定源码里 `TestRun.result()` 只在存在失败测试、worker／reporter 错误、达到最大失败数，或开启 `failOnFlakyTests` 且存在 flaky 时返回 failed；CLI 把 passed 映射为退出码 0。也就是说，默认配置下 flaky 仍以 0 退出。页面“跳过及重试才过单列”是必要动作；若 CI 要因 flaky 失败，配 `failOnFlakyTests: true`（v1.52；命令行 `--fail-on-flaky-tests`）。v1.62 另有 `retryStrategy`：默认 `'immediate'`，可设 `'isolated'` 把重试放到全部测试后逐个跑，减少与主套件的干扰，但不改变 flaky 判定。

5. **“等待业务状态”要落成 web-first assertion。** 官方最佳实践与断言文档说：web-first assertions 会等到期望条件满足或超时；手动 `isVisible()` 不等待；自动重试断言默认 5 秒；更复杂的条件用 `expect.poll` 或 `expect.toPass`。页面这句话应理解为“把业务状态写成可重试断言”，不能理解为 Playwright 有通用的业务状态等待。

6. **定位优先级要写清楚：role＋可访问名称优先，test ID 是显式契约／兜底。** 最佳实践推荐优先 user-facing attributes 和 explicit contracts；locators 文档明确推荐 role locator，因为它最接近用户和辅助技术的感知；`getByTestId` 是基于 `data-testid` 的内置定位器。页面把“角色、可访问名称或稳定 test ID”并列，读者可能等权使用，建议改成“优先 role＋可访问名称，无法稳定表达时用项目约定的 test ID”。

7. **healer 的引用范围只到“修复／跳过”总述，断言与 fixme 细节在生成定义里。** `docs/test-agents#-healer` 写的是 healer 的修复流程与输出（passing test，或在认为功能坏了时 skipped test），没有写断言编辑与 `test.fixme()` 的细节。具体“修正断言和预期值”“`test.fixme()` 加注释”在 v1.64.1 的 `playwright-test-healer.agent.md`。要支撑“断言变更需需求依据、skip／fixme 单列”，应引固定源码；同时该定义要求“不要问用户，做最合理的事让测试通过”，人工仍须核验收语义。

8. **trace 的 DOM 快照按 action 记录，别把它当完整 DOM 状态录像。** Trace Viewer 的 snapshots 是每个 action 的 Before／Action／After DOM 快照；screenshots 是 screencast 胶片，可能提供 action 之间的画面，但官方没有承诺 DOM 快照覆盖两次 action 之间由定时器、WebSocket 或后台更新造成的状态；`context.tracing` 只记录浏览器操作与网络、不含 `expect` 断言；Playwright Test 配置的 trace 另含测试步骤和断言。两者都不包含后端内部状态。`tracing.start` 要求开始记录后再执行动作。页面用 trace 查“时序竞争／数据串用”时，主要拿 action 边界证据；需要更细顺序就补定向事件日志或后端读回。

## 证据分层

- **官方建议（改变做法，不是强制保证）**：best practices 的“只测用户可见行为”、role／可访问名称优先、web-first assertions；trace 文档对 CI 用 `on-first-retry`、无重试用 `retain-on-failure` 的建议。
- **API／源码硬约束（默认值、范围、退出码）**：`trace` 默认 `'off'`；`context.tracing` 不含 `expect` 断言；`tracing.start` 需在动作前；`retries` 默认 0；flaky 默认以 0 退出，除非 `failOnFlakyTests`；DOM snapshots 按 action 记录。
- **页面作者判断（本页选择，非官方规定）**：把 console／请求失败列为“要核”的项；“skip／fixme、降低断言、不断加重试不算修好”；“跳过及重试才过单列”；“等待业务状态”这一表述本身。

## 核实表

| 页面原句／位置 | 来源、版本／固定 SHA、日期 | 判定与读者应改什么 | 未知与所缺证据 |
|---|---|---|---|
| L63「时序问题查 trace」 | [testOptions.trace](https://playwright.dev/docs/api/class-testoptions)（`trace` 选项 v1.10，默认 `'off'`，模式表）；[trace modes](https://playwright.dev/docs/test-use-options#trace-modes)；[Trace Viewer 录制说明](https://playwright.dev/docs/trace-viewer)；2026-11-03 核 1.64.1 | **补齐。** 默认无 trace；`on-first-retry` 只录第一次重试且需 `retries > 0`；无重试或要首跑失败现场用 `retain-on-failure`；`on` 每次录且官方标注性能重、不推荐。trace 文件落在 test output dir（通常 `test-results`）；报告写明模式。 | 未核本仓 `playwright.config.*` 是否已配置 trace；项目可能已有自己的策略。 |
| L63「核业务结果及 console／请求失败」 | [Trace Viewer features](https://playwright.dev/docs/trace-viewer)（Console、Network 标签）；[Best Practices](https://playwright.dev/docs/best-practices)（用户可见行为、web-first assertions）；2026-11-03 核 1.64.1 | **部分确认，页面判断。** 已录 trace 可在 Console／Network 标签查看浏览器日志和请求；官方文档没有说 test runner 会因 console 错误或失败请求自动判失败。若它们是验收条件，需自行断言或读 trace／report；不能只等退出码。 | 未做实验确认具体项目是否把 console／请求失败作为失败条件；官方页面未给默认策略。 |
| L67「用角色、可访问名称或稳定 test ID 定位，等待业务状态；内部函数仅辅助诊断，用户路径仍用实际输入」 | [Best Practices](https://playwright.dev/docs/best-practices)（Test user-visible behavior、Use locators、web first assertions）；[Locators](https://playwright.dev/docs/locators)（Quick Guide、优先 role locator）；[Assertions](https://playwright.dev/docs/test-assertions)（自动重试、默认 5 秒、`expect.poll`／`expect.toPass`）；2026-11-03 核 1.64.1 | **基本确认，补精度。** role＋可访问名称优先，test ID 是显式契约／兜底；“等待业务状态”落成 web-first assertion 或 poll，非通用等待。内部函数仅辅助诊断与“只测用户可见行为”一致。 | 未运行页面；“业务状态”的具体断言仍由项目定义。 |
| L75「数据串用或时序竞争用隔离夹具与原 trace 查顺序」 | [Trace Viewer snapshots](https://playwright.dev/docs/trace-viewer)（每个 action 的 Before／Action／After；screenshots 为 screencast）；[Tracing API](https://playwright.dev/docs/api/class-tracing)（开始记录后再执行动作）；2026-11-03 核 1.64.1 | **补齐。** “原 trace”前提是首跑已录；DOM 快照按 action 记录，screenshots 是 screencast，但官方未承诺 DOM 快照覆盖 action 之间的状态；`context.tracing` 只记录浏览器操作与网络；test runner trace 另含测试步骤和断言，但也不含后端内部状态。要保首跑失败 trace，用 `retain-on-failure`。 | action 之间的 screencast 帧覆盖未在官方文档量化；要判断具体项目够不够，须实测该项目的 trace。 |
| L75「新增 skip／fixme、删触发步骤、降低断言或不断加重试不能算修好；跳过及重试才过单列」 | [Test retries](https://playwright.dev/docs/test-retries)（默认不重试，passed／flaky／failed）；[`tasks.ts` L115-L119](https://github.com/microsoft/playwright/blob/v1.64.1/packages/playwright/src/runner/tasks.ts#L115-L119)；[`testActions.ts` L86-L87](https://github.com/microsoft/playwright/blob/v1.64.1/packages/playwright/src/cli/testActions.ts#L86-L87)（默认 `playwright test` 的 passed→0；UI／watch 模式同型映射在 L63-L64／L80-L81）；[`test.ts` L309-L312](https://github.com/microsoft/playwright/blob/v1.64.1/packages/playwright/src/common/test.ts#L309-L312)（`ok()` 把 `skipped` 视为 true）；[`config.ts` L90](https://github.com/microsoft/playwright/blob/v1.64.1/packages/playwright/src/common/config.ts#L90)（`failOnFlakyTests` 默认 `false`）；[testConfig.failOnFlakyTests](https://playwright.dev/docs/api/class-testconfig)（v1.52）；[testConfig.retryStrategy](https://playwright.dev/docs/api/class-testconfig)（v1.62，默认 `'immediate'`）；2026-11-03 核 1.64.1 | **确认机制，页面判断成立。** flaky 默认 exit 0；skip／fixme 也不计失败；要 CI 因 flaky 失败加 `failOnFlakyTests: true` 或 `--fail-on-flaky-tests`。“单列”是必要的报告动作，不是 Playwright 默认替你做的；`retryStrategy: 'isolated'` 只改重试时机，不改变判定。 | 未核项目 reporter 是否已单列 flaky／skipped；未运行测试确认具体配置。 |
| L88「Playwright 用户可见行为」链接 | [Best Practices](https://playwright.dev/docs/best-practices)；2026-11-03 重核，当前版本 1.64.1（2026-10-14 发布） | **确认。** 页面支持用户可见行为、优先 role／可访问名称、web-first assertions；只证明机制，不证明本仓用户任务通过。 | docs 站不带版本号；版本对齐依赖 npm 1.64.1、release notes 与固定 tag 源码。 |
| L88「healer」链接 | [Agents：Healer](https://playwright.dev/docs/test-agents#-healer)（docs 段）；[`playwright-test-healer.agent.md` L36-L55](https://github.com/microsoft/playwright/blob/v1.64.1/packages/playwright/src/agents/playwright-test-healer.agent.md#L36-L55)；[release notes v1.56](https://github.com/microsoft/playwright/blob/v1.64.1/docs/src/release-notes-js.md)（Test Agents 引入）；2026-11-03 核 1.64.1 | **引用范围需补。** docs 段落只到“修复失败测试／必要时跳过”的总述；“修正断言和预期值”与 `test.fixme()` 加注释在 agent 定义 L36-L55（“不要问用户”的句子在 L55）。要引用后者，应加固定源码链接；healer 从 v1.56 起提供。 | 未运行 healer；模型／客户端生成的定义可能随版本变化，需按版本重新生成。 |
| L88「Trace Viewer」链接 | [Trace Viewer](https://playwright.dev/docs/trace-viewer)（opening、features、`trace.playwright.dev` 本地加载说明）；2026-11-03 核 1.64.1 | **确认。** 可看 actions、screenshots、snapshots、source、call、log、errors、console、network、metadata、attachments；`trace.playwright.dev` 在浏览器本地加载，官方称不上传数据。前提是已录 trace。 | “不上传”是官方说明，未独立抓包验证；具体浏览器版本未跑。 |
| L88「核实 2026-10-26」 | [release notes v1.64](https://github.com/microsoft/playwright/blob/v1.64.1/docs/src/release-notes-js.md)（v1.64.0 于 2026-10-07 发布；1.64.1 补丁于 2026-10-14 发布）；npm `latest` 1.64.1（2026-11-03） | **未过期。** 10-26 时最新也是 1.64.1；11-03 复核未发现页面所引 docs 链接失效或语义变化。v1.63 新增的 trace snapshots `aria`／`screen` 选项（固定 tag `v1.63.0` 的 `types/test.d.ts` 已含 `snapshots?: { dom, aria, screen }`）不影响现有句子；v1.64 新增的是 `Page.getByRef`（按 `Page.ariaSnapshot` 在 `'ai'` 模式报告的 ref 定位）与 `toHaveScreenshot` 的 `type`；`screen` 设备字段转发，以及 `--update-snapshots=missing`（创建 missing 快照后测试通过）属于 v1.64 的破坏性变更，`Page.ariaSnapshot` 的 `'ai'` 模式自 v1.59 起提供，同样不影响现有句子。若页面要写细粒度 trace 选项再引。 | docs 站持续更新；10-26 当天的页面快照未留存，只能按版本日期推断。 |

## 关键原文（供非作者对照）

- `testOptions.trace`：`Defaults to 'off'.`；`'retain-on-failure'` 的说明含 `A failed run's trace is kept even when a later retry passes.`
- `Tracing` API：`The context.tracing API captures browser operations and network activity, but it doesn't record test assertions (like expect calls).`
- `Test retries`：`By default failing tests are not retried.`；结果分类为 `"passed"`、`"flaky"`、`"failed"`。
- `testConfig.failOnFlakyTests`：`Whether to exit with an error if any tests are marked as flaky.`；`Added in: v1.52`。
- Healer 生成定义：`Fixing assertions and expected values`；`mark this test as test.fixme()`。

## 未核与边界

- 未运行 Playwright、浏览器、healer 或本仓任何测试；未安装依赖；未打开项目页面。所有“可见”“退出码”结论来自官方文档、release notes 和固定 tag 源码，不是本次实跑。
- 官方 docs 站不显示版本号；版本对齐依赖 npm `@playwright/test@1.64.1`、release notes 与 `v1.64.1` 固定源码。docs 内容在 2026-11-03 之后可能变化，引用时应重新核日期。
- 未核本仓 `playwright.config.*` 是否已配置 trace、reporter 是否已单列 flaky／skipped、是否另有 console／请求断言。页面建议能否直接照做取决于这些项目配置。
- Trace Viewer 的“数据不上传”只按官方说明记录，未做网络抓包；`context.tracing` 的断言缺口来自 API 文档，未用实际 trace 文件验证。
- healer 只核到生成定义允许改断言与 `test.fixme()`；未运行 healer，不能据此判断其修复正确率或实际诊断质量。
- 本任务限定官方证据，未查社区反馈、真实项目效果或工具排名；这些不能由本产物外推。

## 与已有材料的关系

- 与 `A-VERIFICATION-MAP-SOURCES-20261028`（功能验收地图按变更维护）无同源重叠。
- 与 `A-VERIFICATION-BUILD-SOURCES-20261028`（构建／服务身份）无同源重叠；该产物只核构建／服务身份与一次性验收怎样接入持续回归，不涉及 trace、重试与失败分析范围，本产物只补这部分。
- fetch 时 main 上本卡为 `running`（接收端领取），未发现 `relay/a-verification-facts-20261102` 或同 id 的 `dot-a` 任务分支；不声明全局没有其他调用。
- 本产物只新增本文件；未改页面、TASKS、代码、模板或其他任务。

## 交付检查与提交身份

- **公开扫描覆盖本文件。** `scripts/check_public.py` 只枚举 `git ls-files`，未跟踪文件不会被扫到；因此先完整 `git add docs/collaboration/local-jobs/artifacts/A-VERIFICATION-FACTS-20261102/facts.md` 再扫描。实跑 `python3 scripts/check_public.py`：`checked_files: 1171`（含本文件）、`findings: []`，退出码 0。另把本文件单独复制到非 Git 目录用 `--root` 扫描：`checked_files: 1`、`findings: []`，不依赖索引状态。
- **空白检查不是空检查。** 用含尾随空格的临时文件验证：`git add -N` 后 `git diff --cached --check` 不报（intent-to-add 的索引内容为空），而 `git diff --check` 能报出；因此本文件在完整 `git add` 后跑 `git diff --cached --check`，无输出、退出码 0。另核本文件为 UTF-8、LF（无 CR）、无尾随空格、以换行结尾。
- **check_repo。** 研究期抓取到仓库根目录的三个未跟踪临时文件（`tc.md`、`tv.md`、`testActions.ts`，均为公开 Playwright 文档／源码副本，不属于本产物）已在交付前删除。在最终交付工作树实跑 `python3 scripts/check_repo.py`：扫描 709 个文件、0 错误，退出码 0；交付提交只含本文件。
- **提交身份。** 本单元未提交；交付提交由接收端以 `git -c user.name=… -c user.email=…@users.noreply.github.com`（或 `noreply@anthropic.com`）创建。当前工作树 `git config user.email` 不是 `check_public --commits` 接受的 GitHub noreply／`noreply@anthropic.com` 地址（具体值不记录），直接沿用会在 `python3 scripts/check_public.py --commits origin/main..HEAD` 时报 `commit-email`。本单元没有创建提交，因此该检查未对交付提交执行；提交后应运行同一命令并记录结果。
