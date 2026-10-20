主线：二，兼三／四
改变的建议：先选能观察真实故障的反馈，再按保护未来或查当前差异选择测试；运行结果只覆盖实际入口。[研究／经验]
新证据：2026-10-20 补旧会话跨发布的两条维护链与稳定源码，改变 Agent 前端更新的验收输入；其他迁移章节沿用原核实日期，未新增实验。

# 开发条件：反馈与验证

✅ 从缺失的观察或断言起步；⛔ 不把测试名、截图或内部状态当成完整验收。实际入口或保护目标改变时，重选检查范围。[研究／经验]

Agent 负责生成候选改动和检查；人须确认实际用户路径、应保留行为与断言是否相符。

[总览与旧章节索引](2026-10-12-development-conditions.md)；[共同来源与阅读范围](2026-10-12-development-conditions.md#来源与阅读范围)。

## Agent更新前端：旧会话是验收输入

核实：2026-10-20。改变18／23的 **Agent 使用建议**：交付首次前端与更新已有用户应用，不能使用同一套“打开最新版”验收输入。以下是依据框架维护链推导的检查建议，不是观察到 Agent 导致这些缺陷，也未测当前模型漏验率。[研究：采用判断]

**✅ 首次交付无旧用户，沿用新用户路径；已有用户更新，把发布前开始的任务交给 Agent 验收。** 人先说清哪些状态可丢、哪些草稿或进行中写入不可丢。可丢时允许现成恢复／安全刷新胜出；不可丢时让 Agent 盘点真实请求、版本路由和恢复路径，超过保护范围就缩小承诺。**⛔ 不因一次chunk错误默认自建SW，不把开锁版开关当验收完成。**

这一建议防的是任务定义遗漏：Agent拿到的若只有新版截图、页面可打开和新请求成功，即使全部检查通过，也没有观察旧页的资源、版本身份或未提交状态。需要补验收输入，而非一律换模型、堆浏览器工具或增加随机测试次数。[研究：由下述机制推导]

### 两条机制链及后续回执

**A．部署身份的作用域：请求锁到旧部署，不等于每个标签都独立锁版。**

- [SvelteKit #11987](https://github.com/sveltejs/kit/pull/11987) 于2024-03-19合入 `af5a257b4386dceddca472885329e5c8863dfcd5`；作者自报手工测试。当天[adapter-vercel 5.2.0](https://github.com/sveltejs/kit/releases/tag/%40sveltejs%2Fadapter-vercel%405.2.0)正式发布该能力。属历史采用／自报。[一手]
- [#12592](https://github.com/sveltejs/kit/issues/12592) 的用户2024-08报告动态模块加载失败，2025-01仍报告卡住；2025-10-25维护者试过按客户端跟踪ID的SW后，指出存储、运行负担、Safari失败及既有SW共存未解决，倾向保cookie并改进错误恢复。这是探索后收窄，不是SW修复成功。[社区：使用者；一手：维护者原帖]
- [试验固定补丁](https://github.com/teemingc/vercel-skew-protection/blob/63aca3546f961db0848e8e6bc1faea2576a9da16/patches/%40sveltejs__adapter-vercel.patch)及同目录Kit补丁包含发ID、缓存客户端映射和拦截fetch；不是生产推荐。[一手：固定源码]
- 当前稳定[7.0.1发布](https://github.com/sveltejs/kit/releases/tag/%40sveltejs%2Fadapter-vercel%407.0.1)于2026-10-14；固定 `73bf98cabea2ef18e1bfef40be5229a43e79b05c` 的 [index.js L470–505](https://github.com/sveltejs/kit/blob/73bf98cabea2ef18e1bfef40be5229a43e79b05c/packages/adapter-vercel/index.js#L470-L505)仍在document请求响应中写共享 `__vdpl`，并为version.json设特定路径豁免。当前main `c7476484` 的该文件与稳定tag相同。[一手：发布／固定源码]
- [当前官方说明](https://svelte.dev/docs/kit/adapter-vercel#Skew-protection)仍区分：内置失败恢复会硬刷新并丢客户端状态；Vercel路由原部署；新标签改变cookie时旧标签可退回内置恢复。支持跨标签必验。[一手]

**B．构建身份与部署入口：有ID不等于该ID可路由。**

- [Next #88496](https://github.com/vercel/next.js/pull/88496)为自动deploymentId调整环境变量校验，2026-01-22合入 `7282ce6759ea2373b2060e0720abe8983e1a87ae`；[撤回PR #88942](https://github.com/vercel/next.js/pull/88942)于01-23合入。维护者明确先恢复部署测试再尝试重上。PR内撤回提交 `70bf83b1240035c5e4e065b248eb50905bc8a949` 与API合入SHA `b08e16b21a2d2a634134469977c58c6a628d1f53` 须区分；#88941不是撤回PR。属历史撤回，非现今prebuilt禁用依据。[一手]
- [#94734](https://github.com/vercel/next.js/issues/94734)是另一机制：2026-06-12用户以16.2.6、Vercel CLI 51.x及prebuilt报告运行时ID覆盖构建自定义ID，旧页Server Action失配，并自报显式关闭runtimeServerDeploymentId后恢复。所附复现需真实平台，未运行。issue仍open；10月评论是另一人的澄清请求，没有维护者修复／兼容性确认。不能把用户转述支持答复当维护者确认，排查历时不等于工时。[社区]
- 当前稳定[Next 16.4.2](https://github.com/vercel/next.js/releases/tag/v16.4.2)发布于2026-10-15，固定 `2864b1772c37242a9b40ab4d366eb7d368c2a070`。[config.ts L1231–1250](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/packages/next/src/server/config.ts#L1231-L1250)在生产构建、hasNextSupport、NEXT_DEPLOYMENT_ID存在、开关未显式指定，且自定义deploymentId未与环境值冲突时自动开启；若自定义result.deploymentId非空且不同，先抛错中止构建。该构建期冲突与下述运行时覆盖须分开。同目录ci-info.ts将hasNextSupport取自NOW_BUILDER。[base-server.ts L508–521](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/packages/next/src/server/base-server.ts#L508-L521)在开启时读运行环境ID。分支定义不证明平台注入值或缺陷触发。[一手：固定源码]
- 同tag的[deployment-id.ts](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/packages/next/src/shared/lib/deployment-id.ts)读取后移除HTML的data-dpl-id；client/components/router-reducer下的reducers/server-action-reducer.ts L127–130传送此ID，fetch-server-response.ts L258–265不匹配时转整页导航。因此应抓原始响应和请求。[一手：固定源码]

### 当前现成方案的范围

- [Next自托管指南](https://nextjs.org/docs/app/guides/self-hosting#version-skew)（2026-10-15更新）以deploymentId检测不匹配后硬导航，组件状态可能丢失；它不是自动路由旧后端。其不可变资产建议适合保留旧chunk，不能据此保证旧API、写入契约或共享数据库仍兼容。[一手；研究：边界]
- [Vercel当前文档](https://vercel.com/docs/skew-protection)：框架管理的请求可带ID，手写fetch需另处理；默认document导航到新版，长会话可用cookie额外固定并在结束时清除。默认保护年龄从部署创建起一天，受保留期／安全阈值限制，删除后不可达。Pro／Enterprise支持；prebuilt自定义ID要求Next大于16.2.0-canary.15、CLI大于50.3.3。跨源另核允许域。具体参数按目标项目重核。[一手]
- [Netlify Next说明](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/#skew-protection)为opt-in，手写fetch不自动带ID；[部署总览](https://docs.netlify.com/deploy/deploy-overview/#skew-protection)另限定production context、旧部署仍可用，并在硬导航时忽略锁版信号。不能将Vercel长会话cookie配方泛化到所有平台。[一手]
- [Vite preloadError](https://vite.dev/guide/build#load-error-handling)提供刷新示例并要求HTML正确再验证缓存；这是资源失败恢复入口，不替应用决定未保存工作能否丢弃。[一手；研究：采用边界]

### 跨发布回归设计（未运行）

1. **人给任务承诺，Agent列检查对象。** 指定首次交付或已有用户更新；后者给A版本旧页任务、不可丢状态、实际框架／adapter／CLI／构建入口。Agent盘点动态资源、导航／预取、Server Action、手写fetch和外部请求。
2. **保留旧输入再检查新版。** A页开始任务，再发布B；旧页继续操作、新标签打开B。分别记录原始HTML／资源身份、请求实际到达的部署（可信响应标记或内容）、草稿及业务写入结果。ID出现在请求上不证明路由生效，路由正确也不证明写入语义正确。
3. **按承诺选择恢复。** 状态可丢时验证受控刷新和失败恢复；不可丢时验证保存／恢复、任务结束后的换版及重试不重复写入。只缺旧chunk可先保不可变资源；涉及旧服务契约才核原生锁版。数据库、外服、后台任务及实时连接不因前端锁版自动固定。
4. **核退出与反例。** 覆盖软／硬导航、跨标签、实际prebuilt入口、漏锁请求、保护到期及安全撤回。网络失败不能假定刷新可修；检查刷新环与明确恢复路径。设计应在获准的隔离环境执行，不在生产制造破坏性故障。

**人把关**不可丢内容、允许中断与安全更新优先级；**Agent承担**配置／请求盘点和回归准备，报告实际执行范围。保旧资源有存储清理成本，保旧部署有安全修补和期限成本，保草稿有兼容及重试成本；净收益、工时与金额均未知。现成方案足够时不加SW；有必要的逐标签或离线缺口且能承担兼容维护时才另评估。[研究：条件选择]

本轮只读公开资料与固定源码，未部署、运行客户端／候选／模型；以上回归全部未运行。资料支撑“改变验收输入”，不证明应用无中断或 Agent 提效。

<a id="s197"></a>

## 官方交互浏览器 Skill：值得借什么，不能照搬什么

固定版本的 `playwright-interactive` 复用 REPL 与浏览器句柄；区分 renderer reload 与主进程 relaunch；功能验收要求实际用户输入，`evaluate` 可检查或准备状态，但不能充当验收输入；视觉检查与功能检查独立。普通 CLI Skill 则强调 DOM 明显变化后重新 snapshot，避免沿用失效元素引用。**[一手：S1 指定段落]**

机制针对重复启动和沿旧状态推理，未测提速；复用会话可携带缓存、登录和脏数据，首次访问仍用干净上下文。

该 interactive 快照要求关闭沙箱并给安装命令，本轮均未执行，也未验兼容性；只借观察／动作设计，优先当前受支持入口。**[一手：S1；经验：采用范围]**

<a id="s205"></a>

## 交互界面：按缺失观察选择反馈

核实：2026-10-14 UTC。改变 23 §2/§4：选择能区分当前假设的反馈；视觉要求保留截图验收，语义与时序问题先复用已有真实输入测试及状态/事件证据。证据范围见表后。**[经验：采用判断]**

| 比较及固定来源 | 实际条件与观察 | 能改变的选择；不能推出什么 |
|---|---|---|
| [Design2Code v2，§3.1、表3](https://arxiv.org/html/2403.03163v2) | HARD 为80页；self-revision 接收 text-augmented 初稿代码、初稿渲染图和目标图。GPT-4o 的 Block/Position 为67.7/77.5→72.1/81.1；Claude 3.5 Sonnet 为75.1/83.4→71.9/82.6 | 截图反馈有机会修视觉偏差，但不能假定修订必升；保留前版比较。这是静态复现、旧模型与非等成本对照，不是当前交互应用成功率 |
| [Vision-Guided Iterative Refinement v1，§4.1、表1–2](https://arxiv.org/html/2604.05839v1) | 600测试任务；Sonnet 4.5 初稿→三轮的综合 VLM 分数7.584→8.048，报告 tokens 6,446→131,550。judge 对200组非平局人类偏好69.5%一致、22%不一致、8.5%平局 | 视觉＋代码 critique 可改善评分类质量，但未隔离截图贡献或给 Sonnet 做等 token 无视觉对照；不是执行完整用户任务，也不能用模型评分替用户接受体验 |
| [InteractGUI / VF-Coder v1，§5.3](https://arxiv.org/html/2604.19750v1)与[固定入口](https://github.com/leozhilin/VF_Coder/blob/10bd5e6bebb34ba6c13ee4cf93802a575d9bb701/vf_coder_main_loop.py#L55-L74) | Gemini-3-Flash / PySide6 将 GUI Operator 与错误截图反馈分开开关；[修复者代码](https://github.com/leozhilin/VF_Coder/blob/10bd5e6bebb34ba6c13ee4cf93802a575d9bb701/vf_coder/code_agent/code_agent.py#L507)仅在 visual 模式附加错误截图，目标参考图仍可独立提供 | 发现运行状态与传达视觉错误是不同增量，不能合并成“接入浏览器收益”。论文称984任务，但缺逐例结果/种子/置信区间，表4部分百分比不能按984整数通过数还原；不据此排名或宣称显著收益 |

上表是论文／固定源码证据，未独立运行；缺同一当前强 Agent、同任务等预算的四通道对照，接入取舍为工程判断。**[一手／经验]**

**具体使用边界。** 选中或保存错误若已能由真实浏览器动作与结果断言揭示，不必新增截图循环；裁切、间距、素材与画布问题则必须补足视觉观察。结果最终正确、但早期点击丢失时，补动作时刻与事件顺序。[Playwright hydration 说明](https://playwright.dev/docs/navigations#hydration)明确指出控件启用早于监听器绑定会吞掉输入，建议应用就绪前禁用控件；不能靠延后测试输入制造通过。直接设置 DOM/组件状态不等于测试真实输入。**[一手：官方机制；经验：最小反馈建议]**

入口理解、误操作恢复与体验接受仍需用户任务试用；保留原功能和视觉要求，仅为缺失判断补通道。上表未测用户参与的净收益。**[经验：采用与停止条件]**

<a id="s221"></a>

## 截图稳定化：结束动画不是保留当前状态

核实：2026-10-16（UTC+8）。改变 23 §2：保留终态视觉基线，但不让截图准备推进待验的过渡、暂停或重开状态；局部 `allow` 只在需要保留该状态时采用。以下为官方契约、固定源码／测试定义与历史作者报告，未运行浏览器。**[经验：采用判断；研究：证据范围]**

[PageAssertions 文档](https://playwright.dev/docs/api/class-pageassertions#page-assertions-to-have-screenshot-1-option-animations)规定 `toHaveScreenshot()` 默认 `animations: disabled`，可被项目 `expect` 或单次参数覆盖；[Page 文档](https://playwright.dev/docs/api/class-page#page-screenshot-option-animations)规定 `page.screenshot()` 默认 `allow`，按调用参数生效。[v1.63.0 发行提交 `1b025d7`](https://github.com/microsoft/playwright/commit/1b025d7e20a026371cd5f98ba0cdce48892737c8)的[matcher L346–363](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright/src/matchers/toMatchSnapshot.ts#L346-L363)与[screenshotter L201–219](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/screenshotter.ts#L201-L219)印证这一差异，两个入口不只相差图片比较。**[一手：文档与固定源码]**

[固定实现 L109–155](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/screenshotter.ts#L109-L155)对有限 `endTime` 调用 `finish()`，没有复原步骤；无限动画先 `cancel()`、清理时 `play()`，不保存原位置和 `playState`。[回归 L774–835](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/tests/page/page-screenshot.spec.ts#L774-L835)要求结束过渡、触发 `transitionend`，首图已含回调新增的 `h1`；[L865–938](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/tests/page/page-screenshot.spec.ts#L865-L938)另验有限动画结束与无限动画取消事件。因此截图可能推进状态，不能独证原输入或恢复正确；局部 locator 截图也由[L224–255](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/screenshotter.ts#L224-L255)在所有 frames 准备。**[一手：源码与测试定义；研究：机制推导]**

实现跳过 `playbackRate === 0`，并非 `playState === 'paused'`；[官方回归 L838–862](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/tests/page/page-screenshot.spec.ts#L838-L862)要求速率为 0 时保持 `currentTime = 500`。仍被 `getAnimations()` 返回、速率非零的暂停动画，不能保证免于 `finish/cancel` 或恢复暂停状态。此推论不覆盖所有暂停机制，也不授权为截图改变产品暂停。**[一手：源码与测试；研究：限定推论]**

[#36899](https://github.com/microsoft/playwright/issues/36899)于 2025-08-01 报告 Playwright 1.54.2 普通截图有 Ionic sheet modal，视觉断言却没有。[原作者后续](https://github.com/microsoft/playwright/issues/36899#issuecomment-3145555849)称换序后两张都缺，改为 `toHaveScreenshot({ animations: 'allow' })` 后恢复；[维护者回复](https://github.com/microsoft/playwright/issues/36899#issuecomment-3145780160)确认默认值差异出于兼容，仍推荐自动等待的视觉断言。无限动画只是作者归因，未核 Ionic 根因或复现；它支持局部改参，不支持全局关闭或认定当前普遍缺陷。**[社区：历史回执；一手：维护者说明]**

**最小采用与撤回。** 纯终态布局继续用现有视觉基线；先完成相关真实输入、暂停后恢复或取消后重开的行为断言，再做可能推进动画的视觉比较。所需状态本已稳定却被准备动作改变时，只在该处用 `allow`。若需要观察过渡，复用动作／事件时间线，已有测试能证明命中目标阶段及其结果就不加层。`allow` 不是精确采样：普通截图仍有[字体等待 L251–264](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/screenshotter.ts#L251-L264)，视觉断言仍按[匹配／稳定化循环 L719–795](https://github.com/microsoft/playwright/blob/1b025d7e20a026371cd5f98ba0cdce48892737c8/packages/playwright-core/src/server/page.ts#L719-L795)取图，持续变化时可能超时；该版本首张直接匹配已有基线可返回，也不应概括为每次必拍两张。另据 [actionability](https://playwright.dev/docs/actionability#stable)，`locator.click()` 会等元素 bounding box 连续两帧不变，所以发起调用的时刻不等于输入发生时刻；确认真实动作命中窗口，不统一改用 `force`。**[一手：工具机制；经验：选择边界]**

验证范围：只读文档、发行源码、测试定义及原评论；未运行 Playwright、上游用例或模型，未测具体修复收益。**[研究]**

<a id="s237"></a>

## Service Worker：响应来源决定保存与故障验收入口

核实：2026-10-15（UTC+8）。改变 23 §3/§4：服务器同步的验收增加独立读取，故障注入增加实际命中确认；本地保存不强加服务端要求。复用现有 API／浏览器测试，不增加平台或框架。**[经验：采用判断]**

Playwright [固定修复提交 `ea75b9f` 的回归 L23–98](https://github.com/microsoft/playwright/blob/ea75b9f32ca4120efdfaf8f5b8cfd292f548f197/tests/library/browsercontext-service-worker-policy.spec.ts#L23-L98)覆盖 literal、Cache Storage、network fallback 和 preload fallback；L79–92 要求当前页及同 context 新页均返回 200、来自 worker、显示 offline，而服务端请求为 0，恢复在线才变为 1。这是响应机制的测试定义，非保存缺陷实测。**[一手]**

承诺服务端同步时，刷新或新标签页不够，可用 API 读取本次记录：[APIRequestContext 实现 L350–389](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/packages/playwright-core/src/server/fetch.ts#L350-L389)用 Node HTTP/HTTPS，不经页面 worker。但服务端缓存与数据库耐久性仍须另验，不能据此保证落盘。只承诺本地保存时验本地重开，联网同步单列结果。**[一手：源码；经验：验收选择]**

[Chromium 回归 L373–434](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/library/chromium/chromium.spec.ts#L373-L434)同时收集 `page.on('request')`、context 事件与 route 命中：透明 worker 的 `/data.json` 可由 context 路由，页面同名请求虽有事件却不可路由。[后续回归 L436–538](https://github.com/microsoft/playwright/blob/a3401cfe0dcf317101572d025fa46248d0779b42/tests/library/chromium/chromium.spec.ts#L436-L538)另区分缓存、`/foo` 改写为 `/bar`、合成 200 和透传。注册页面 URL 失败规则不代表注入成功，须查实际命中与响应；必要时在 Chromium 支持范围内改到 worker 持有的网络请求。**[一手：测试定义；经验：覆盖判断]**

透明 worker 也返回 `fromServiceWorker() === true`，不能等同缓存命中或要求一律为 false；HTTP cache 也不同于 Cache Storage、合成响应。[官方说明](https://playwright.dev/docs/service-workers)把这些观测和路由能力限于 Chromium，主脚本更新仍不可路由，不能补救全部 worker 请求或 Firefox／WebKit。禁用 worker 会改变产品行为：普通 API mock 可 block，离线验收不能借此绕过。**[一手；经验：采用边界]**

[真实报告 #42775](https://github.com/microsoft/playwright/issues/42775)在 1.63.0 的 WebKit 上发现：即使 worker 直接生成响应，离线模拟也拒绝导航；停止源站的对照则能返回。它不代表两种故障等价。[修复 #42894](https://github.com/microsoft/playwright/pull/42894)于 2026-10-05 合入上述 `ea75b9f`，在 page target 初始化时显式应用已配置的 offline 状态并补回归。固定测试仍跳过 Electron／旧 WebKit，并对 Firefox 的 network/preload fallback 标 fixme。离线测试失败时应先核工具版本、模拟范围和实际请求，不能直接撤掉产品要求。未核首次正式发布版本；PR 页面仍有失败检查，本轮没有复核其因果或宣称全 CI 通过。**[一手：报告、维护补丁与测试限制；经验：诊断选择]**

只读上述固定测试、API 源码和 issue／PR，未运行浏览器、上游测试或模型。**[研究：验证范围]**

<a id="s253"></a>

## React：生产构建故障中的定向日志

✅ 当状态更新依赖时序，先在实际失败的构建中复现，再记录相关状态随时间的变化；只需现有浏览器和定向日志时，不必增加调试平台。**[经验：23 §4 采用建议，2026-10-13]**

Dan Abramov 于 2026-02-18 的[#35821](https://github.com/react/react/issues/35821)含[公开复现](https://github.com/gaearon/react-udv-bug)：server action 返回 JSX 后，`useDeferredValue` 在开发版追上输入，生产版常卡旧值。[3 月 24 日原帖](https://bsky.app/profile/danabra.mov/post/3mhrdue7gds2h)称 Claude 此前未定位或写出失败测试；[紧接原帖](https://bsky.app/profile/danabra.mov/post/3mhrdwgnhkc2h)记后来依次浏览器复现、读人指定源码、给生产 bundle 加日志、修复。它支持提供实际状态变化，不排除源码可定位。**[一手：报告与作者自述，非完整模型轨迹]**

[固定合并提交 `c0d218f0f3e02ed581f74096e56baa947213135d`](https://github.com/react/react/commit/c0d218f0f3e02ed581f74096e56baa947213135d)在 `pingSuspendedRoot` 无法立即重启当前 render 时保存 pinged lanes，避免随后标为 suspended 而失去重试，未加业务轮询。新测试让兄弟组件在同一 render 内 resolve 挂起数据，最终须渲染 updated；既有测试另记新增重试行为。回归锁定 resolve/ping 时点。**[一手：补丁与测试；研究：机制归纳]**

[#36134](https://github.com/react/react/pull/36134)署名 Claude 编写／调试，获 acdlite 批准，2026-03-24 合入并关闭 issue。固定修复为上述提交，首次正式发布未核，不能当作当前缺陷。页面显示 245 checks passed；Test Plan 要求撤修复使新测失败、修复 bundle 解决 repro，但缺逐项 CI、会话、红绿或浏览器原日志，也未独立重跑。**[一手：署名、合入与聚合结果；研究：边界]**

review 指出源码已有 TODO，作者给出源码范围和日志建议；专家、复现及会话差异都可能贡献，不能独归日志。保留失败构建与输入，只观察区分假设的状态，把触发条件放入已有回归。日志可能扰动调度，须移除后复测用户路径。本例仍是专家参与的历史单例。**[一手：review 与自述；经验：接入要求]**

<a id="s265"></a>

## 属性测试：搜索反例不等于确认或修好缺陷

核实：2026-10-13。主线二；改变 15 §6：输入组合多、有明确契约且执行便宜时，试用小范围属性搜索，不默认加测试 Skill 或全仓扫描。**[经验：采用判断]**


1. [NumPy PR #29609](https://github.com/numpy/numpy/pull/29609)：Agent 提议并执行 Wald 样本非负属性；作者称自己花了数小时验证、定位并亲自编写修复。Agent 发现不等于 Agent 修好。[维护者独立复验](https://github.com/numpy/numpy/pull/29609#issuecomment-3210974565)表明初始 mean=1e8 在他的构建不失败，改1e9才得到3个负样本；作者确认同样结果。**[一手：原始PR与回复]**
2. [最终合并补丁](https://github.com/numpy/numpy/commit/0ce0ef0bae095e44770a20b64177f07f11758715)不是 PR 初稿公式；最终为 `d=1+sqrt(1+4*scale/Y)`、`X=mean*(1-2/d)`，新增固定seed、mean=1e9、scale=2.25、1000样本的回归。[2.3.4发布](https://github.com/numpy/numpy/releases/tag/v2.3.4)列入backport #29926；[2.3.4固定Generator实现](https://github.com/numpy/numpy/blob/1458b9e79d1a5755eae9adcb346758f449b6b430/numpy/random/src/distributions/distributions.c#L846-L861)已改变，[同版本legacy_wald](https://github.com/numpy/numpy/blob/1458b9e79d1a5755eae9adcb346758f449b6b430/numpy/random/src/legacy/legacy-distributions.c#L147-L163)仍是旧式。不要概括为所有numpy.random.wald入口都已修复，也不把正文早期残余失败自动归给最终版。**[一手：固定源码与发布]**
3. 属性根据：[NumPy 2.3官方API](https://numpy.org/doc/2.3/reference/random/generated/numpy.random.Generator.wald.html)规定正mean/scale，输出Wald分布；非负性得到维护者确认。它不是复制实现中间值作为预期。**[一手：API与维护者]**
4. [dateutil #1437维护者回复](https://github.com/dateutil/dateutil/issues/1437#issuecomment-3225141158)：method=1返回Julian名义年月日，但Python date按Gregorian算weekday，2015-03-30因此显示非周日；method=2才转Gregorian为2015-04-12。原报告被判预期行为。以“Easter必须周日”跨日历强加断言会制造误报。[官方方法契约](https://dateutil.readthedocs.io/en/stable/easter.html)也分三种算法。**[一手：原始判定与API]**

<a id="s275"></a>

#### 成本与限制

- 采用已有测试环境；仅当组合输入确实难枚举才加小范围属性测试。生成器需要维护有效域，过窄丢掉边界，太宽会测无效输入。语义不清、UI感受、慢且有真实外部副作用的路径不应先用大规模随机执行。**[经验：采用/撤回条件]**
- [Hypothesis官方运行次数说明](https://hypothesis.readthedocs.io/en/latest/explanation/test-case-count.html)指出过滤重试、失败收缩、解释与重放会使实际执行次数超出max_examples；因此该字段不是调用/耗时硬预算，昂贵路径要单列隔离与总时限。[重放API](https://hypothesis.readthedocs.io/en/latest/reference/api.html#hypothesis.reproduce_failure)的blob不保证跨Hypothesis版本，永久回归优先保留显式输入。**[一手：当前文档，2026-10-13]**
- [研究全文v1](https://arxiv.org/html/2510.09907v1)使用Opus4.1扫描933模块，API总成本$5474.20，不含本例人工修复工时；最初50份人工复核来自初筛分数前80%，不能把56%合法率当984份完整普查。本轮未取得当前强Agent“无PBT/有PBT”同任务净收益对照，本轮也没跑模型。**[一手：论文；研究：适用边界]**

<a id="s281"></a>

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

<a id="s353"></a>

## 外部生产者校准错误预期

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

<a id="s557"></a>

## 生成回归测试：先保留预期，再决定是否新增

**核实：2026-10-14 UTC；改变 22 §4。** 红绿结果要有独立的预期依据；测试的来源是 AI 或人工，均不能替代这一步。已有用例能区分目标缺陷时复用；新增断言失败后，先查需求与实现，不自动把预期改到当前代码能通过。**[经验：采用建议]**

**跨后续修改的新证据。** [On the Risks of using LLM-Generated Tests for Regression Testing v1](https://arxiv.org/html/2610.11835v1)（2026-10-08，§3–7）使用 Haiku 4.5，在 SciPy／Qiskit／pandas 的 50／50／45 个历史 PR 上注入人工变异。选择未完全覆盖、至多改五个代码文件的 PR，pandas 限 I/O；先去掉原生测试检出的变异，再保留模型能构造区分测试的变异。生成阶段可见 PR 前源码、变异后的源码、两者 diff 与执行上下文，不见未变异的 PR 后参考源码，至多六轮追求通过与覆盖。表 3 的分母是进入分类的变异—测试对（各 3,483／3,355／9,578），包括预算耗尽后保留的失败候选，不只是获接受的通过测试；其中 8.4%–16.9% 在错误版通过、参考版失败。表 4 再跟踪可向后传播的 587／279／1,614 对，后续重施同一变异时，82.8%–90.9% 仍维持该结果。**[研究：预印本受控变异与历史传播，非真实故障发生率]**

**原生测试足够的反例与分母。** 同文表 2 中，原生套件已检出各项目可执行变异的 58.6%／54.0%／16.0%，这部分未进入生成比较；预筛样本不证明普遍不足。传播中，后来原生测试检出故障也没有终止该断言的追踪，所以“错误断言仍存活”不等于“故障无人检出”。已可靠拦住的风险无需重复生成；论文未证额外维护收益或人工净成本。**[研究：结果及采用边界]**

**已有工业机制的对照。** Meta 的 [TestGen-LLM 原论文 §2](https://arxiv.org/html/2402.09171v1)明确丢弃首次不通过的测试，五次重复排除不稳定，再过滤不增加覆盖的候选；它保留原测试并由工程师决定接收。该设计适合补充已认可行为的覆盖，不能把“当前通过”解释成业务预期正确，也不能据新论文把 Meta 的实际部署说成已经锁入同等比例的缺陷。覆盖未增加也不必然意味着测试无价值：同一路径可以有更强断言。**[一手：工业论文；研究：机制比较]**

**读取与未证实部分。** 已读两篇固定版本正文。新研究的 [Figshare 工件地址](https://figshare.com/s/bcdd07ff46760fd254ec)本次读取返回 403，未取得原始记录，不能独立复算；不是认定工件不存在。未运行上游／模型；变异非真实 bug，也非当前 Codex／Claude 全流程对照，不支持默认隐藏源码、测试先行或加 Agent。继续采用的条件是新增测试补到明确行为缺口，若只重复已有检查则不保留。**[研究：局限与可撤回条件]**

<a id="s569"></a>

## 生成测试：先选保护未来还是查当前差异

> 核实：2026-10-17 UTC；主线二／三，改变 15 §6 及总表。🧪 当前高风险差异尚无已知失败时，可先针对改动意图生成前后对照候选；保护已认可行为则补永久回归。确认行为变化是否预期后再处理，已有检查覆盖风险时不扩生成。**[研究：采用判断，未运行]**

**两种可工作目标。** [TestGen-LLM v1 §2–3](https://arxiv.org/html/2402.09171v1)以构建、稳定通过及新增覆盖筛选永久加固测试，已有工程师接收记录。[ACH v1 §4、§6](https://arxiv.org/html/2501.12862v1)改用未被现有测试检出的故障变体驱动生成：接收者也认可零覆盖增量的棘手边界，拒绝平凡或过时 API 用例；先导反馈促使后续报告增加覆盖信息。这支持按保护价值选择测试，不是自动保留所有生成物。两篇同属 Meta 部署自述。**[一手：工业论文]**

**查当前差异会改变生成输入。** [JiTTest v1 §2–6](https://arxiv.org/html/2601.22832v1)比较加固、直接把 diff 当故障变体及先推断意图／风险三条路线。表 1 的主要比较同处 2025 年 11 月 14–24 日，但每条路线产生测试的 diff 分母不同；度量是旧版通过、新版失败的候选，不是确认 bug、同预算收益或检出率。作者部署中撤掉了从偶然失败捞候选的路线，并报告接收者确认后修复或放弃改动。其 §5.1 先问具体行为变化是否预期，再进入测试代码核查；这比直接交红测试要求修复更贴合本建议。**[一手：作者部署报告；研究：采用判断]**

**反证与范围。** 该系统筛选高风险改动、利用夜间空闲算力，仍有人审核候选；源码／原始逐项轨迹及完整费用未公开于所读材料。§5 存在确认问题数 7／8 及严重占比文字矛盾，表 1 覆盖筛选行含估算，均不用于推荐量化收益。现有业务意图、运行设施与跨版本接口也可能使前后差异合理；保留 CI／人审，仅把经需求确认且值得长期保护的用例并入套件。未核当前 Codex／Claude 同任务效果，不推荐安装内部系统、复制多裁判或普遍替换永久测试。**[研究：限制与撤回条件]**

<a id="s621"></a>

## 写入路径扩展与序列化判等：sqlite-chronicle

核实：2026-10-14 UTC。**✅ 给 Agent 扩展写入路径时，把业务行与派生版本／审计状态一起验；为支持新类型而改变判等编码，还须验证旧类型中需要区分的值。** 本节改变 15 §6 的窄建议，不新增工具或默认评审阶段。**[经验：采用判断]**

<a id="s625"></a>

### 一手修订链与归属

[Issue #20](https://github.com/simonw/sqlite-chronicle/issues/20)由维护者 Simon Willison 报告：把代码和此前讨论交给 Opus 4.6、Gemini 3 Deep Think、GPT-5.2 探索，其中前两者给出候选方案，GPT-5.2 耗尽上下文。仅作者报告，非模型排名。[PR #21](https://github.com/simonw/sqlite-chronicle/pull/21)公开了要求先确认失败、采用候选方案、做 red/green 与生成演示的任务文字、Claude Code 会话链接和 claude 提交；本轮只读公开 PR 与代码，没有读取会话全文或运行模型。人工审阅后合并、发布 0.5，仍非全输入正确保证。**[社区：作者报告；一手：公开任务与提交]**

- 原版 [25370bdd](https://github.com/simonw/sqlite-chronicle/blob/25370bdd9ce4d5c3be93d5035e86b44bd9346476/sqlite_chronicle.py)在 AFTER INSERT 中用 `INSERT OR IGNORE` 写 chronicle；外层 `INSERT OR REPLACE` 的冲突策略会传播进触发器，重建跟踪行并重置 added 时间。`recursive_triggers=ON` 还让隐式 DELETE 触发额外版本增长。SQLite [CREATE TRIGGER 官方契约](https://sqlite.org/lang_createtrigger.html)明确外层语句的冲突处理优先于触发器内部策略。**[一手]**
- [3510fd21](https://github.com/simonw/sqlite-chronicle/commit/3510fd21b57bf5a06eb16bf5830d44919fc3fe11)改为 BEFORE INSERT 保存旧值快照、INSERT 时判等并清理、用 `WHERE NOT EXISTS` 避免冲突策略传播，并为隐式 DELETE 加 guard。后续 [60f09b98](https://github.com/simonw/sqlite-chronicle/blob/60f09b9833f4bbc44ea52cd89cf9c4e5329a804e/README.md)已有对应生成 SQL，但 `json_array` 直接接收 BLOB 会失败。**[一手：固定补丁与生成 SQL]**
- [9cd5293f](https://github.com/simonw/sqlite-chronicle/commit/9cd5293f5e89825a8824c1f258231e0592d8579f)改用 `json_array(quote(...))`，新增 BLOB、NULL、混合类型回归。这个改动确实消除本轮 BLOB 失败，但 `quote(TEXT)` 在首个 NUL 截断；不同尾部因此可能得到相同快照。截断是 [SQLite 文档规定](https://sqlite.org/lang_corefunc.html#quote)，不是本仓猜测。**[一手；研究：判等推论]**
- 核查时 main 固定为 [ee8d2a1d](https://github.com/simonw/sqlite-chronicle/blob/ee8d2a1db5090d14279f0acb56b5d46a5c50e44c/sqlite_chronicle.py)。快照表已改成共享表，仍保留这条 quote 判等路径；本轮也运行了此 SHA 的 [README 生成 SQL](https://github.com/simonw/sqlite-chronicle/blob/ee8d2a1db5090d14279f0acb56b5d46a5c50e44c/README.md)，未用二月补丁代十月现状。**[一手；经验：固定 SQL 执行]**

<a id="s634"></a>

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


<a id="s654"></a>

## SWE-Game：游戏移植的 Visual 分不等于体验质量

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

<a id="s854"></a>

## 增量验证：已有回归测试是否真的被选中

主线：三；区分测试断言有效与本次验证确实执行了它。
改变的建议：15 §6 在依赖、预打包配置或非模块夹具变更后显式运行已有消费者，09 只回链；普通增量运行足够时不加评审层。
新证据：Vitest 原生执行依赖记录的发布、固定实现与测试定义，另有同周预打包漏选报告；2026-10-15 UTC 核实，验证范围见本节末尾。**[一手／社区／研究]**

<a id="s860"></a>

### 原生能力与反证

[Vitest 5.0.4](https://github.com/vitest-dev/vitest/releases/tag/v5.0.4)发布于 2026-10-12，[#11515](https://github.com/vitest-dev/vitest/pull/11515)合并于 10-08。[官方契约](https://vitest.dev/config/experimental.html#experimental-recorddependencies)规定 `experimental.recordDependencies` 默认关闭，按上次执行记录为 `--changed`／`related` 选测；动态导入须执行过，普通 `fs` 读取和 externalized 模块内部导入不记录。新增 import 若先提交未重跑，后续只改新依赖可能漏选。**[一手：发布、合并与当前契约]**

[测试定义](https://github.com/vitest-dev/vitest/blob/c06012ac8419ca4ea14a8808aedc8b0120111f81/test/e2e/test/recorded-deps.test.ts)覆盖动态导入、无记录与部分运行；[选择实现](https://github.com/vitest-dev/vitest/blob/c06012ac8419ca4ea14a8808aedc8b0120111f81/packages/vitest/src/node/recorded-modules.ts)在无记录时回退全选，有记录则匹配变化模块。**`-t`／`.only` 等部分运行只合并已有记录，不创建新记录**，刷新导入关系须完整跑相关测试文件。无记录的测试仍会运行；缓存关闭则记录功能不生效。**[一手：源码、测试与文档，未运行]**

[#11585](https://github.com/vitest-dev/vitest/issues/11585)创建于 2026-10-14，核实时 open、无评论，**未经维护者确认或本仓复测**。作者修改 linked workspace helper，保留已有失败断言：关闭 optimizer 时 `changed`／`related` 选中并失败，开启后零选中、退出 0；含 5.0.4／4.1.10 对照，称 5.0.4 记录模式仍漏选。[受影响模块实现](https://github.com/vitest-dev/vitest/blob/28dc1edfb6ba5a181fe208576989063795aeadb3/packages/vitest/src/node/affected-modules.ts#L240-L251)过滤 `node_modules`，[后续遍历](https://github.com/vitest-dev/vitest/blob/28dc1edfb6ba5a181fe208576989063795aeadb3/packages/vitest/src/node/affected-modules.ts#L345-L349)仅沿过滤后的导入遍历，支持作者机制解释，非完整复现或所有 optimizer 项目失败。**[社区：单作者报告；一手：源码；研究：边界]**

<a id="s868"></a>

### 采用范围与退回条件

- ✅ 先保留项目已有增量测试；依赖关系、optimizer 或非模块夹具改变，显式运行已知消费者，或用项目已有且适用于当前入口的映射。已知相关用例却零选中时，先直接运行该测试，再修触发配置或按风险暂用更宽套件；无需为此添 reviewer 或自建依赖图。**[经验：采用判断]**
- 🧪 只有实际动态导入是当前选择盲区、且能维护缓存与刷新记录时，试用默认关闭的 `experimental.recordDependencies`；不作为正文 ✅ 的默认开关。已有静态关系已足够时无需启用，本轮没有计时或净成本数据。**[一手：机制；经验：条件试用]**
- [普通 `related`](https://vitest.dev/guide/cli.html#vitest-related)支持静态可解析导入；非模块读取可按项目需要使用 [watchTriggerPatterns](https://vitest.dev/config/watchtriggerpatterns)，但它是 watch 契约，不能冒充所有 CLI `changed` 的映射。[forceRerunTriggers](https://vitest.dev/config/forcereruntriggers)与 `--changed` 配合时，diff 命中会触发全套；这是有执行成本的特定回退，不是每次修改的默认。**[一手：官方契约；经验：取舍]**

仅回读文档、版本、issue 与固定源码／测试，未运行 Vitest、模型或远端 CI，未测收益；作者关闭 optimizer 的对照不作普遍推荐。**[研究：范围]**


<a id="s877"></a>

### 原生失效判断：撤掉在选择器之前重放旧结果的缓存

2026-10-17（UTC+8）补核；改变 15 §6：原生选测已能判断环境变化时，先撤掉绕过它的外层短路，配置失效走已有扩大路径；07 只回链。**[研究：采用判断]**

Polylogue [#1059](https://github.com/Sinity/polylogue/issues/1059)采用 testmon 替换自制文件／导入路由。[初版 `8a2c0332`](https://github.com/Sinity/polylogue/commit/8a2c0332961228dd1135d069c7d21326f7e96575)后，[修订 `09b84c37`](https://github.com/Sinity/polylogue/commit/09b84c37e22a159d293dcb0bc6b7be95ea0d445e)删除外层结果缓存：旧指纹含 HEAD、工作区差异、未跟踪文件与 testmon 数据库，却不含当前 Python／安装包；匹配后在构造和运行检查之前直接返回旧退出码。testmon 自己的[固定环境判断](https://github.com/tarpas/pytest-testmon/blob/dccc58d2ed8edec98096ff1974acb7c07d3e3482/testmon/db.py#L647-L711)会比较 Python 与包身份，因此外层命中可使它根本没有机会判断。**[一手：固定补丁／源码；研究：机制推导，不是漏测率]**

[#1066](https://github.com/Sinity/polylogue/pull/1066)已合入 `da72933`。其[实现](https://github.com/Sinity/polylogue/blob/da72933da8fe385d400647fc064a0111cfb0b535/devtools/verify.py#L370-L403)从 seed 到 HEAD、工作区及未跟踪文件按清单检查配置、锁文件与部分共享测试设施；命中或 Git 查询失败时取消 testmon 选测，成功后刷新 seed。[命令构造](https://github.com/Sinity/polylogue/blob/da72933da8fe385d400647fc064a0111cfb0b535/devtools/verify.py#L265-L283)仍排除 integration，指定 `--skip-slow` 时仍过滤 slow；这只是该配置范围扩大，不能称整个项目全套。[测试定义](https://github.com/Sinity/polylogue/blob/da72933da8fe385d400647fc064a0111cfb0b535/tests/unit/devtools/test_verify.py#L89-L117)核命令与失效路径分类，不是所有环境变更的端到端证明。**[一手：合入实现与测试定义]**

**扩大清单本身仍有缺口。** 该版前缀匹配不命中 `tests/unit/core/conftest.py`；[原 P1 评审](https://github.com/Sinity/polylogue/pull/1066#discussion_r3250832660)指出嵌套夹具风险；清单未触发不等于原生依赖记录必然漏选。作者 [9 月跟进](https://github.com/Sinity/polylogue/pull/1066#issuecomment-5918980468)以 `5ebcfe59` 历史快照复核，仍不宣称修复：新增 autouse fixture 没有先前执行关系。应用时先确认扩大入口覆盖本次夹具，缺口未闭合就显式运行相关消费者或更宽套件；这不否定外层缓存撤除，也不把旧快照当当前 master 状态。**[一手：固定源码；社区：评审与作者历史复核；经验：采用边界]**

作者报告扩大运行 6,449 例、pytest 149.90 秒，紧接增量运行零选中、3.24 秒；它说明作者观察到回到增量，不能算长期节省或证明零选中总是正确。未取得原始运行日志，未执行上游测试、模型或 CI。采用这条修订机制仍须保留项目原有验收范围与非空要求。**[一手：作者报告；研究：验证边界]**


<a id="s890"></a>

### 新增选测能力：先比较改动类型与完整运行成本

> 2026-10-16 UTC 补核；主线三，改变 15 §6 新增选择器的采用条件，不改变本仓检查入口。沿用已有增量验证主题，不再列工具排名或重复 Vitest 边界。

remote-store [2026-10-03 研究报告](https://github.com/haalfi/remote-store/blob/45132599a2818fe1e02eb15c9e2016bada5a0103/sdd/research/research-bk-403-testmon-poc.md)在测试昂贵时仍暂缓 pytest-testmon。作者报告工作树 `12f8043`、testmon `2.2.0`；本轮读文档与 driver 快照 `45132599a2818fe1e02eb15c9e2016bada5a0103`，未证它就是原运行版本，亦缺完整 JSONL／JUnit 工件。以下数值均为使用方报告，非本仓复测。**[一手；研究：身份边界]**

- **收益取决于改动。** 串行全套墙钟 `551.3 s`，叶函数种子 `4.8 s`、核心模块 `296.3 s`；`0.9%`／`53.7%` 是时间占比，非测试比例。并行全套 `204.0 s`、建映射 `218.0 s`，不能只比最慢串行，也未计完整安装、维护和长期补跑。每项仅计时一次，13 个刻意种子不是日常改动频率样本。**[一手：使用方报告；研究：比较边界]**
- **运行其他测试仍可能漏目标。** `_azure.py` 追加类的种子跑了 825 例，却漏掉读取源码文本的检查；读取代码文本不等于执行代码。另有非 Python 夹具漏选，但不能外推全部 fixture 或模块变更。**[一手：使用方报告；研究：机制]**

[固定 driver](https://github.com/haalfi/remote-store/blob/45132599a2818fe1e02eb15c9e2016bada5a0103/sdd/research/bk-403-testmon-poc/driver.py)为各种子定义修改和目标：关闭 testmon，要求退出 1 且对应 JUnit case 失败，再复制原映射选测。它分别记录 `known_selected` 与 `known_failed_in_selected`，选中列不能替代失败列。临时 JSONL 未公开，源码只证方法可查；13 项确认失败仍是作者自述。**[一手：源码与报告；研究：边界]**

**完整检查还有更便宜的优化。** [固定成本审计 L1／L2](https://github.com/haalfi/remote-store/blob/45132599a2818fe1e02eb15c9e2016bada5a0103/sdd/audits/audit-022-gate-speed-strategies.md)报告隐私扫描正则在长 base64 上重复起匹配，占 `157 worker-seconds`；窄改起点后，478 份 cassette 和三个探针判定不变。另次覆盖率的默认 tracer／sysmon 墙钟为 `310 s`／`250 s`；前者非墙钟，异实验不可相加。样本判定不变不授权删 PII 检查或放宽规则；该 testmon 路径还不兼容 sysmon，不能直接组合。**[一手：使用方审计；研究：成本与安全边界]**

[PyPI 元数据](https://pypi.org/pypi/pytest-testmon/json)仍列 `2.2.0`（2025-12-01 上传）；[官方说明](https://www.testmon.org/)说明只跟踪已执行代码，不跟踪静态文件或外部服务。tag `dccc58d2ed8edec98096ff1974acb7c07d3e3482` 的[环境判断](https://github.com/tarpas/pytest-testmon/blob/dccc58d2ed8edec98096ff1974acb7c07d3e3482/testmon/db.py#L647)比较包与 Python 身份，支持计入映射重建条件，不证明遗漏已修或当前漏选率。未安装、运行 testmon、上游测试或模型。**[一手：元数据、契约与源码；研究：范围]**

✅ 保留可靠原生选测。新增前比较不减覆盖的热点修复与安全并行，再估映射／补跑总成本；核心常变、重建频繁或消费者超出模型时暂缓，不照搬该项目回退规则。**[经验：采用与撤回]**

<a id="s986"></a>

## 原生下拉菜单的截图与语义验收

主线二／四；核实：2026-10-15 UTC。改变23的观测选择：原生 `<select>` 选值与应用结果优先语义验收；只有展开层外观属于要求时，才补目标浏览器／系统实际屏幕，不因网页截图缺失重写控件。**[研究：采用判断]**

Playwright [#38200](https://github.com/microsoft/playwright/issues/38200)报告展开原生下拉后，macOS 截图缺菜单、Ubuntu 位置异常、Windows 挂起；[维护者](https://github.com/microsoft/playwright/issues/38200#issuecomment-3533050490)在 macOS、Ubuntu 及原始 CDP／Puppeteer 路径复现类似问题。2026-01-07 [关闭说明](https://github.com/microsoft/playwright/issues/38200#issuecomment-3718636129)说明跨平台原生实现不同、无 Playwright 行动项，后为视觉 Agent [建议整屏捕获或DOM文本补充](https://github.com/microsoft/playwright/issues/38200#issuecomment-3720341206)。closed／v1.58 标签不证明修复发布，历史限制也不代表所有当前版本或系统。**[社区：报告；一手：维护者解释]**

[固定复现库](https://github.com/kisotechnology/playwright-screenshot-issue/tree/0f1f0177f07c3ce70e49168c60d460f89cbda9ef)的 `scripts/capture-dropdown.js` 以 headed Chromium 点击 select，再取全页截图；已查看展开和缺菜单配图，但尺寸不同，不是严格同条件对照。作者报告 1.56.1，`package.json` 却为 `^1.41.2` 且无锁文件，不能固定实际安装版本。**[一手：源码与产物；社区：版本自述]**

[当前selectOption契约](https://playwright.dev/docs/api/class-locator#locator-select-option)选择选项并触发 input／change，可验应用结果，不能证明原生展开层外观。不外推全部浏览器 UI 或默认增加桌面工具；未安装、运行浏览器或复演上游。**[一手：契约；经验：边界]**

<a id="s1104"></a>

## 数据库默认值：写出字段不等于写对值

2026-10-18（UTC+8）核实；主线三／四，改变15 §5的迁移顺序与验收。**常驻进程持旧schema缓存且ORM省略默认值字段时，先保护相关写入者，再改数据库；新进程测试不足以覆盖此窗口。** [研究]

[官方步骤](https://docs.gitlab.com/development/database/avoiding_downtime_in_migrations/#changing-column-defaults)先部署显式写列与赋值，再post-deployment迁移，下次minor清理保护；两minor是GitLab发行约束，不照搬。常量可用代码默认值；依记录计算时区分未提供与显式输入，`||=`可能保留缓存旧值；显式nil不被attribute默认值覆盖，只有业务禁止nil时才另行处理。[一手：文档；研究：范围]

固定镜像`fa6a63c43dd8050dd297c4eae1bdbf9e0cfd7ff1`的[concern](https://github.com/gitlabhq/gitlabhq/blob/fa6a63c43dd8050dd297c4eae1bdbf9e0cfd7ff1/app/models/concerns/safely_change_column_default.rb#L40-L51)在before_create把声明列纳入INSERT；[测试](https://github.com/gitlabhq/gitlabhq/blob/fa6a63c43dd8050dd297c4eae1bdbf9e0cfd7ff1/spec/models/concerns/safely_change_column_default_spec.rb#L16-L132)先加载保护并预热缓存，再改DB默认值。显式写1仍落盘1；未提供值也写缓存的1，不自动采用DB新值2。故写列保护不决定业务正确值。另有代码默认值／移除DB默认值测试，未覆盖上述依记录赋值或显式nil。[一手：源码与测试定义]

采用前确认保护已覆盖相关写入者，包括绕过模型回调的路径；否则延后迁移或选获准停写窗口。复用测试保留旧缓存，按业务分验未提供、显式旧值与NULL的落盘结果，兼容窗口结束再撤临时逻辑；无该省略机制不强加流程。测试只覆盖有保护代码的旧缓存，不保证无保护旧二进制安全；只读未执行，无生产恢复、AI收益或工时结论。[研究：选择与局限]

<a id="s1114"></a>

## API修改：声明差异、消费者契约与真实集成

核实：2026-10-19 UTC。改变09“先确定性检查”的API修改分支：已有可靠且投入可接受的真实集成优先复用；只缺公开契约变更反馈时先补schema兼容检查，只有消费者/提供方独立演进且双方可维护验证时才评估Pact。不是三层全部必装，不据源码宣称提效。**[研究：采用判断]**

**声明兼容与实现符合不同。** [oasdiff固定说明](https://github.com/oasdiff/oasdiff/blob/be6ad7a7103e667bc4dbe61ffcf8af3e3f01d5c7/docs/BREAKING-CHANGES.md)按OpenAPI声明判断旧请求/响应契约，不以某台服务端恰好宽松接收为准；例如新增必填请求属性即使带default仍破坏旧契约。`breaking`用于判破坏，`diff`输出一般差异，门槛须明确`--fail-on`；生成了客户端或定义没变不能独自证明实际服务符合定义。已有自动检查若覆盖实现符合、消费者需要及目标版本组合，不必只为“契约测试”换框架。**[一手：工具/Pact官方契约；经验：选型]**

**现成采用一：InvenTree保留schema与客户端集成两条检查。** [固定workflow](https://github.com/InvenTree/InvenTree/blob/879d52041f9a2656d1e9dc3e80abe3e296c683fe/.github/workflows/qc_checks.yaml)的schema job从当前后端导出schema，下载已发布API版本定义，用oasdiff的`diff`动作生成HTML；它不是`breaking`动作。API版本文件未变时另用普通diff要求定义一致，改版本则跳过该一致检查；因此不能描述成“任何破坏都阻止合并”。同文件的python job另启动实际InvenTree服务，用inventree-python测试调用。该客户端是浅克隆当时默认分支，不是证明所有旧发布客户端兼容。源码仅证明配置采用与覆盖分工，未读取运行日志或测效果。**[一手：固定workflow]**

**现成采用二：GOV.UK One Login明确做两端，而非给mock换名。** authentication-api的[IpvUserIdentityTest](https://github.com/govuk-one-login/authentication-api/blob/71d7e101eed17a10c7cf9d353e705f1e9727421d/ipv-api/src/test/java/uk/gov/di/authentication/ipv/contract/IpvUserIdentityTest.java)通过真实IPVTokenService向Pact MockServer发请求，声明GET /user-identity及200结构／403交互，再验证解析或异常；provider名称为IpvCoreBackUserIdentityProvider。ipv-core-back[同名provider测试](https://github.com/govuk-one-login/ipv-core-back/blob/06661368619b9ffe7b6a4032b265734dfe62c74b/lambdas/build-user-identity/src/test/java/uk/gov/di/ipv/core/builduseridentity/pact/BuildUserIdentityHandlerTest.java)把真实BuildUserIdentityHandler接到本地HTTP server，以mock数据存储等依赖准备有效／无效token状态，再verifyInteraction。它的消费者选择器为mainBranch，不能据此宣称覆盖生产所有已部署版本。两个仓库另有[消费者端工作流](https://github.com/govuk-one-login/authentication-api/blob/71d7e101eed17a10c7cf9d353e705f1e9727421d/.github/workflows/contract-tests.yml)与[提供方工作流](https://github.com/govuk-one-login/ipv-core-back/blob/06661368619b9ffe7b6a4032b265734dfe62c74b/.github/workflows/contract-tests.yaml)；provider工作流为Broker接入还显式等待30秒，且Dependabot路径不执行Broker相关步骤。配置存在不证明本次执行成功，Broker与状态维护也是采用成本。其[README](https://github.com/govuk-one-login/ipv-core-back/blob/06661368619b9ffe7b6a4032b265734dfe62c74b/README.md)仍分别列API集成与E2E用户路径。**[一手：配对固定源码及配置]**

**不用Pact的条件与保留检查。** [官方适用范围](https://github.com/pact-foundation/docs.pact.io/blob/76d06a6f246693e92a417c01d0c6a511887dfc1c/website/docs/getting_started/what_is_pact_good_for.md)把消费者可识别、双方可协作、provider状态可控列为适用条件；对方不参与、未知公共消费者、状态不可控不宜强接。它验证通信契约，不覆盖provider完整功能；透传API若总回200，契约匹配不能证明下游消息或持久副作用正确。[官方比较](https://github.com/pact-foundation/docs.pact.io/blob/76d06a6f246693e92a417c01d0c6a511887dfc1c/website/docs/faq/convinceme.md)也保留已有有效集成测试，若引入Pact只重复既有覆盖、增加难维护状态或对方无法验证，就保留原检查。未取得两种方案同任务成本或AI净收益，不报速度或缺陷下降。**[一手：官方范围；经验：撤回条件]**

本轮仅公开文档与固定源码阅读，未执行候选、模型、服务或其测试；配置定义不作运行通过、实际部署兼容或AI净收益。**[研究：验证范围]**

<a id="s1128"></a>

## 无障碍反馈：扫描当前状态与保留必要检查

**改变的选择：23 §2在已有浏览器回归中按缺口补自动扫描，保留用户路径；不因组件存在已知违规而排除整个交互区域。** 核实2026-10-20（UTC+8），只读固定官方材料与成熟项目测试设计，未运行浏览器、axe或模型。原有语义、键盘及目标状态检查足够时继续复用，不另加MCP或审计框架。**[一手；经验：采用判断]**

**现成工具：定位、扫描、实际操作回答不同问题。** Playwright固定`cdcef0bc`的[locator文档](https://github.com/microsoft/playwright/blob/cdcef0bc92d35ae5a50fafd433fb5dcb633742dd/docs/src/locators.md)明确role定位只给早期ARIA反馈，不替代审计与符合性测试。[扫描指南](https://github.com/microsoft/playwright/blob/cdcef0bc92d35ae5a50fafd433fb5dcb633742dd/docs/src/accessibility-testing-js.md)允许把axe扫描并入已有测试；`analyze()`看调用时状态，菜单示例先点击、等展开内容可见，再扫描。axe-core固定`f01bf5ce`的[API说明](https://github.com/dequelabs/axe-core/blob/f01bf5ce56ffcf1411d14d14ed75d1fb86f8023c/doc/API.md)同样要求激活未渲染的菜单／模态后重扫；已渲染的visually-hidden内容仍可被检查，不能把它与未激活区域混同。完整结果还分`violations`、`passes`、`incomplete`与`inapplicable`；只断言违规为空不能把未决项目记作通过。标签或对比度是自动检查入口，焦点流、可理解性与辅助技术实际操作仍按需求验证，不由一次初态扫描推整站可用。**[一手：固定官方文档；经验：范围判断]**

**实际采用：GOV.UK组件扫描与状态回归分别保留。** govuk-frontend固定`3d28aa52`的[password-input扫描测试](https://github.com/alphagov/govuk-frontend/blob/3d28aa52ec5407e3114374297d679993c1b3b863/packages/govuk-frontend/src/govuk/components/password-input/accessibility.puppeteer.test.mjs)遍历组件examples，渲染后调用axe并断言无违规；[另一组交互测试](https://github.com/alphagov/govuk-frontend/blob/3d28aa52ec5407e3114374297d679993c1b3b863/packages/govuk-frontend/src/govuk/components/password-input/password-input.puppeteer.test.js)按点击1／2／3次检查密码显隐、状态文本、按钮名称等，提交时还检查恢复password类型。这是同项目实际采用的分工；后者主要用点击和DOM属性断言，不证明键盘路径已测或屏幕阅读器实际播报。其[贡献验收说明](https://github.com/alphagov/govuk-frontend/blob/3d28aa52ec5407e3114374297d679993c1b3b863/docs/contributing/test-components-using-accessibility-acceptance-criteria.md)另要求真实页面中的键盘、辅助技术组合和残障用户测试；文档要求也不当成该版本全部执行的回执。**[一手：固定测试设计与项目要求]**

**已有违规：先修；确需暂留，按覆盖代价选最窄例外。** Playwright扫描指南说明`exclude()`会跳过目标及全部后代的所有规则；若想继续捕捉同区域的新违规，可保存规则ID与目标元素的fingerprint，而非带整段HTML的全结果快照。代价是基线维护与一定脆弱性，变化后应核差异，不能让Agent直接接受新快照来变绿；旧违规仍是待修问题。`disableRules()`则关闭整条规则，只有其范围符合本次验收或明确接受该盲区时采用。反例是GOV.UK的[Accordion扫描配置](https://github.com/alphagov/govuk-frontend/blob/3d28aa52ec5407e3114374297d679993c1b3b863/packages/govuk-frontend/src/govuk/components/accordion/accessibility.puppeteer.test.mjs)：注释明确关闭AAA的`color-contrast-enhanced`，不是关闭AA对比检查。这支持按目标级别选规则，不支持把任何关闭都称为作弊，也不证明该组件符合全部AA要求。**[一手：官方配置范围与项目反例；经验：选择与撤回条件]**

以上支持检查的覆盖分工和范围取舍，未取得同任务的人力、缺陷或Agent效果对照，不推导自动化替代人工的比例或净收益。**[研究：证据边界]**
