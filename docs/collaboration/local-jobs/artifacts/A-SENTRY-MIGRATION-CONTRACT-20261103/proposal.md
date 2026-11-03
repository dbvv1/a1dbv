# A-SENTRY-MIGRATION-CONTRACT-20261103 · 15 §5 候选稿

## 一、可直接合入 15 §5 的正文候选

**建议位置**：`docs/15-task-playbooks.md` §5 第 350 行「退役实现」之后、「配置回退」之前。现有「退役实现」只讲删除时机、选择器与窄适配，不讲并行期的 import／runtime／adapter 解析，二者不重复。

```markdown
**✅ 同一依赖并行两个主版本时，新 API 是否可用看实际解析到的 runtime 与配套 adapter，不看 import 路径或 package.json 的版本号。** 先逐环境写清开发／生产／preview／CI／test 各解析到哪个 major、adapter 配哪一档，再给两版各自的检查；import 已换到新包但 runtime 仍是旧版时，把允许的导入和实际 runtime 分开写，不能据此说升级完成。验证看实际解析：构建产物断言只含一个 major、adapter 同档、共享 router context（同一 runtime 下 `react-router` 与 `react-router-dom` 导出的 `useLocation` 等是同一函数／同一实例，断言两者恒等；`react-router/dom` 只用于 `RouterProvider` 等 DOM 组件；非 router 依赖则断言同一库的多个入口解析到同一实例），并跑一次真实导航。全部环境切到新版、且没有受支持消费者依赖旧版后（最后的切换与删除可在同一变更内完成），再删双版本矩阵、别名包、兼容模块与一次性 runner／typecheck，把指令里的旧版说明改成单版本，保留常设的分片门禁和禁止旧导入的规则；只升一个版本、没有并行期时不加双矩阵。

**依据**：[一手：固定源码／PR 自述] Sentry React Router V6→V8 三阶段：[PR #126570](https://github.com/getsentry/sentry/pull/126570)只把首方导入与测试 mock 换到 V8 路径（配套兼容模块与 lint 规则），仍运行并类型检查 6.30.6；[阶段二 9d75e92](https://github.com/getsentry/sentry/commit/9d75e921c32de2d4c122fbc5e4cff39d16175172)的[`build-utils/react-router.ts`](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.ts#L9-L24)按环境选 runtime，并与 Nuqs adapter 同档切换；[`react-router.test.ts`](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.test.ts#L99-L145)断言 bundle 单版本、共享 context 与真实导航；[PR #128415／de3060f](https://github.com/getsentry/sentry/commit/de3060f736c6dd55836bfae104336a967ec41d8d)删除 V6、双版本 CI／runner 与迁移专用检查，剩余 test 环境改由原生 V8 依赖解析，并把 [`static/AGENTS.md` L32-40](https://github.com/getsentry/sentry/blob/de3060f736c6dd55836bfae104336a967ec41d8d/static/AGENTS.md#L32-L40) 的指令改为 V8-only。PR #127030 作者自报六个文件 85 项应用测试在两版各通过、PR #128415 作者自报 121 项 focused 测试通过，本轮未复跑；核实 2026-11-03。
```

**合入时的依据行**：把上段末句并入 §5 现有「依据」行，避免新增第二段依据；正文内链接都是公开绝对 URL，复制时无需改路径；若合入时再加仓内链接，按 `docs/15-task-playbooks.md` 的落点写。

**共享指令页同步（可选，一处一行，不改正文结构）**：在 `docs/decisions/instruction-files.md` 第一步「命令从当前项目复制并试跑；版本值指向配置，少维护一份会过期的副本」之后补一句：**依赖主版本若由别名或 adapter 决定，还要写清每个环境实际解析到的 major 和对应检查，不以 `package.json` 的单一版本号代替。** 理由见下节；不另写长指南。

## 二、原句缺口

**核对结论：现有 15 §5 未覆盖并行主版本的环境矩阵与退场分层（同一源逐环境解析到不同 major／adapter、导入不等于 runtime、退场清理时机），需要补一条；不返回“已覆盖”的负结果。** 本卡只补一条，不改 15 与共享指令页正文。

- **`docs/15-task-playbooks.md` §5「退役实现」（第 350 行）**：“分开实现选择器与入口禁用，保留必要禁用开关／窄适配；受支持扩展仍依赖旧行为或前置修订未到就延后删除。弃用通知／保留符号不保证兼容。”——它回答“何时删”，不回答“并行期同一源里的 import、实际 runtime、adapter 可能不同，按哪个写规则、跑哪套验证、删哪些临时检查”。
- **同页「混版本／降级」（第 348 行）**：讲的是数据写入与旧版本读取新状态，不覆盖包主版本并行时的模块解析。
- **同页「先选改法」（第 317 行）**：讲语法工具、类型／框架迁移器与例外补丁，未提双 runtime 阶段的环境选择。
- **同页「试点与整合」（第 341 行）**：“依赖升级核实际解析组合及业务入口”——已要求核实际解析组合，但未说明同一源在不同环境解析到不同 major、adapter 要与 runtime 同档、导入路径不能当 runtime，也没有退场清理时机，因此仍需补。
- **`docs/decisions/instruction-files.md` 第 23 行**：“版本值指向配置，少维护一份会过期的副本。”——这句话覆盖运行时与包管理器版本，但回答不了“依赖主版本由别名／adapter 决定时，每个环境实际解析到哪一版”；在 Sentry 阶段二，只看 `static/app/package.json` 会读到 6.30.6，而本机开发实际解析到 8.4.0（见 §四反例二）。

- **去重核对**：`docs/collaboration/inbox.md` 2026-10-27「SDK 迁移与按改动构建」记的是 Anthropic SDK 0.x→2.x 的 HTTP 类型与实际请求契约，不是同一依赖并行两个主版本；不重复也不改写该条。

**补充判断**：若接收者认为「退役实现」已足够，只合入候选首句会缺环境矩阵与验证，不建议。

## 三、阶段 → 固定来源

| 阶段 | 固定来源 | 可核事实 | 不能据此说 |
|---|---|---|---|
| 一、只换导入（PR #126570，2026-10-06 反馈） | [PR #126570](https://github.com/getsentry/sentry/pull/126570)、[讨论 r4198722076](https://github.com/getsentry/sentry/pull/126570#discussion_r4198722076)、[修订 8891ab8](https://github.com/getsentry/sentry/commit/8891ab865ca741f83cbcd20349bd21c03ad92ffc)、[AGENTS@8891 L33-39](https://github.com/getsentry/sentry/blob/8891ab865ca741f83cbcd20349bd21c03ad92ffc/static/AGENTS.md#L33-L39) | PR 自述只把首方导入与测试 mock 换到 V8 路径（配套兼容模块与 lint 规则），仍运行／类型检查 6.30.6；评论指出两条规则并读时不知道用 V6 还是 V8；修订拆成“应用仍跑 V6”“V8 导入路径经 `static/app/utils/reactRouterV6` 解析到 V6”“Nuqs 与 Sentry tracing 仍 V6” | 不能说明 V8 行为已启用；import 路径不等于 runtime |
| 二、阶段二（#127030，9d75e92，2026-10-16） | [commit](https://github.com/getsentry/sentry/commit/9d75e921c32de2d4c122fbc5e4cff39d16175172)、[`build-utils/react-router.ts` L9-24](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.ts#L9-L24)、[`react-router.test.ts` L28-45](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.test.ts#L28-L45)、[同测试 L99-145](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/build-utils/react-router.test.ts#L99-L145)、[`static/AGENTS.md` L32-42](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/static/AGENTS.md#L32-L42)、[`scripts/testCi.js` L18-65](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/scripts/testCi.js#L18-L65)、[`scripts/typecheck.ts` L10-61](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/scripts/typecheck.ts#L10-L61)、[`frontend.yml` typescript 矩阵 L52-58](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/.github/workflows/frontend.yml#L52-L58)、[Jest 矩阵 L211-225](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/.github/workflows/frontend.yml#L211-L225) | 环境选择见 §四表；router 与 Nuqs adapter 同档切换；测试断言 bundle 内单版本、共享 context、参数／查询／返回导航；本地 test-ci 与 typecheck 默认双跑，CI 对两版用同一 shard 选择并分开缓存；CI 中 package tests 与 router build 检查只在 V6 shard 0 跑，本地非 CI 的 test-ci 总会跑（各一次） | 不能说明生产／preview 已用 V8；作者未说明双 typecheck 额外检出过什么 |
| 三、退场（PR #128415，de3060f，2026-10-22） | [commit](https://github.com/getsentry/sentry/commit/de3060f736c6dd55836bfae104336a967ec41d8d)、[PR #128415](https://github.com/getsentry/sentry/pull/128415)、[`static/AGENTS.md` L32-40](https://github.com/getsentry/sentry/blob/de3060f736c6dd55836bfae104336a967ec41d8d/static/AGENTS.md#L32-L40) | 删除 V6 依赖、`react-router-v8` 别名、compat 模块、Jest router resolver、双版本 typecheck／testCi／CI matrix、`build-utils/react-router` 检查；同时改 `static/AGENTS.md` L32-40：builds、tests、typechecks 都用 V8，并删掉 V6 runtime 与兼容模块说明；保留 shard 0、workspace resolver、package tests；`no-legacy-router-imports` 规则保留并改为 V8-only；legacy helper 改名迁入 `static/app/router/legacy` | 不能说明删除后所有行为自动等价；作者自报 121 项 focused、427 项 package、20 个 Chromium snapshot 场景通过，本轮未复跑 |
| 四、当前（638617e，2026-11-03） | [static/AGENTS.md L32-40](https://github.com/getsentry/sentry/blob/638617e31ccc9d303c6fd113d2e2fcd633257a60/static/AGENTS.md#L32-L40)、[static/app/package.json L119](https://github.com/getsentry/sentry/blob/638617e31ccc9d303c6fd113d2e2fcd633257a60/static/app/package.json#L119)、[noLegacyRouterImports.ts](https://github.com/getsentry/sentry/blob/638617e31ccc9d303c6fd113d2e2fcd633257a60/static/oxlint/eslintPluginSentry/noLegacyRouterImports.ts) | AGENTS：builds、tests、typechecks 都用 V8；从 `react-router` 导入 router API 与类型、从 `react-router/dom` 导入 `RouterProvider`，Nuqs 用 v8 adapter；`static/app/package.json` 的 router 依赖只剩 `react-router: 8.4.0`；禁止旧导入的规则仍在 | 不能把阶段二的 V6 当现状；当前固定点之后的变动未核 |

**历史状态分界**：阶段二（9d75e92）是本机开发 V8、生产与 preview V6；退场前一个提交 `c934528e` 的 [`build-utils/react-router.ts` L9-14](https://github.com/getsentry/sentry/blob/c934528e78dc9da1dcc4f70e07a6788708cfc507/build-utils/react-router.ts#L9-L14) 已把生产构建、生产 CI 与 acceptance（含 preview acceptance）切到 V8，但 production test suite（L33）、开发态 CI、test 模式、test suite 与 deploy preview test mode／suite 仍 V6；退场提交 de3060f 才删除全部切换。当前 638617e 是 V8，不表示应继续 V6。

## 四、三个必答问题

**候选位置统一为 §一 的补充条（15 §5「退役实现」之后）；下面逐问给证据、反例与判断。**

### 1. V8 导入是否足以允许 V8 行为

**不足够。导入路径只决定名字解析；实际行为由构建别名／兼容层与 adapter 决定。**

- PR #126570 自述“Move first-party React Router imports and test mocks to V8 package paths while continuing to run and typecheck React Router 6.30.6”，并称这是 later migration 的 preparatory slice。
- 修订后的 `static/AGENTS.md` 明确写“The app still runs React Router V6; follow V6 routing patterns and behavior”“Use V8 import paths … aliased to the V6 runtime through `static/app/utils/reactRouterV6`”。
- 兼容模块源码直接 `export * from 'react-router-dom'` 并转出 `@remix-run/router`，文件首行注释是“Resolve V8 package paths to the existing V6 runtime until the runtime upgrade”（[`reactRouterV6/index.ts` L1-3](https://github.com/getsentry/sentry/blob/8891ab865ca741f83cbcd20349bd21c03ad92ffc/static/app/utils/reactRouterV6/index.ts#L1-L3)）。所以 V8 导入路径的符号实际来自 V6 兼容层。
- 阶段二的 `build-utils/react-router.ts` 在非 V8 环境把首方 `react-router` 与 `react-router/dom` 映射到兼容模块（L27-39），只有 V8 环境才把 `react-router`、`react-router/dom`、`react-router-dom` 和 Nuqs v6 adapter 一起别名到 8.4.0／v8 adapter（L17-24）。同一份导入在不同环境得到不同 runtime。

**反例一（导入不等于升级）**：PR #126570 已把首方导入改成 V8 路径，但应用仍跑 6.30.6；只看 import 会误以为 V8 行为已可用。

### 2. 阶段二哪些环境运行哪个 major／adapter

按 `getReactRouterConfig` 的谓词（不是只看 AGENTS 的概述）：

| 环境／条件 | 解析到的 major | Nuqs adapter | 证据 |
|---|---|---|---|
| 本机开发：`NODE_ENV=development` 且无 `CI`／`NOW_GITHUB_DEPLOYMENT`／`TEST_SUITE`／`IS_ACCEPTANCE_TEST` | 8.4.0 | v8（源码保留 v6 import，构建别名到 v8） | `react-router.ts` L9-24；测试 L30 |
| 生产：`NODE_ENV=production` | 6.30.6 | v6 | 测试 L31 |
| 开发态 deploy preview：`NODE_ENV=development`＋`NOW_GITHUB_DEPLOYMENT=1` | 6.30.6 | v6 | 测试 L33-37 |
| 生产态 deploy preview：`NODE_ENV=production`＋`NOW_GITHUB_DEPLOYMENT=1` | 6.30.6 | v6 | 测试 L38-41 |
| CI：`NODE_ENV=development`＋`CI=1` | 6.30.6 | v6 | 测试 L42 |
| test 模式：`NODE_ENV=test` | 6.30.6 | v6 | 测试 L43 |
| test suite：`NODE_ENV=development`＋`TEST_SUITE=1` | 6.30.6 | v6 | 测试 L44 |
| acceptance tests：`NODE_ENV=development`＋`IS_ACCEPTANCE_TEST=1` | 6.30.6 | v6 | 测试 L45 |
| 应用测试（`test-ci` 未指定版本） | 6 与 8 各跑一遍 | 各自同档 | `testCi.js` L18-31 |
| 类型检查（`typecheck` 未指定版本） | 6 与 8 各跑一遍；V8 用生成的 tsconfig 指到 `react-router-v8` 与 v8 adapter | 各自同档 | [`typecheck.ts` L35-51](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/scripts/typecheck.ts#L35-L51)（生成 paths）、[L67](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/scripts/typecheck.ts#L67)（按版本选用） |
| package tests | CI 中只在 V6 shard 0 跑一次（以 V6 环境）；本地非 CI 的 `test-ci` 总会跑 | v6 | `testCi.js` L36-44、L49-65 |
| router build 检查 | 两版 bundle 用例都跑；CI 中只在 V6 shard 0 跑一次，本地非 CI 的 `test-ci` 总会跑 | v6／v8 用例各自同档 | `testCi.js` L36-48 |

**反例二（同包版本号不等于实际解析）**：阶段二的 [`static/app/package.json` L125-126](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/static/app/package.json#L125-L126) 仍声明 `react-router: 6.30.6`、`react-router-dom: 6.30.6`，根 [`package.json` L124](https://github.com/getsentry/sentry/blob/9d75e921c32de2d4c122fbc5e4cff39d16175172/package.json#L124) 另有 `react-router-v8: npm:react-router@8.4.0`；本机开发实际解析到 8.4.0。只读 app 的 `package.json` 会答错。

**反例三（改一个环境不等于全环境）**：退场前 `c934528e` 的测试仍把 `production test suite` 和 `deploy preview test mode` 列为 6.30.6（[L33、L59](https://github.com/getsentry/sentry/blob/c934528e78dc9da1dcc4f70e07a6788708cfc507/build-utils/react-router.test.ts#L30-L73)），说明生产切 V8 后 test 相关环境仍可能留在 V6，必须逐环境核。

### 3. 切完后哪些临时验证和规则应撤、哪些行为仍保留

**应撤（迁移期专用）**：

| 撤掉项 | 退场提交中的动作 |
|---|---|
| CI 的 router 6／8 矩阵、`SENTRY_REACT_ROUTER_VERSION` env、Jest 缓存键 router 段、balancer 的 V6 覆盖 | `frontend.yml` 去掉 typescript／Jest 的 router matrix，名称与缓存键恢复单版本；`jest-balance.yml` 去掉 `SENTRY_REACT_ROUTER_VERSION: '6'` |
| `build-utils/react-router.ts` 与 `react-router.test.ts` | 整文件删除；`rsbuild.config.ts` 删除 `getReactRouterConfig` 的 import、`const reactRouterConfig = getReactRouterConfig(env);`、`...reactRouterConfig.rules` 与 `...reactRouterConfig.alias` 接入（该文件共删 4 行）；`file-filters.yml` 去掉对应触发项 |
| `scripts/typecheck.ts`、生成的 `tsconfig.router-v8.generated.json`、`.gitignore` 项 | 删除；`package.json` 的 `typecheck` 恢复 `tsc --build tsconfig.json …` |
| `scripts/testCi.js` 的双版本循环、router build 调用、package tests 的 V6 覆盖 | 恢复单次 app 测试，保留 shard 0 门禁；package tests 不再带版本覆盖 |
| `react-router-v8` 别名依赖、Knip 忽略与兼容入口 | 根 `package.json`、`pnpm-lock.yaml`、`knip.config.ts` 删除；`knip.config.ts` 同时删除 `productionEntryPoints` 中的 `utils/reactRouterV6/index.ts`（删掉兼容目录后必须一并删，否则 Knip 入口指向不存在的文件） |
| V6 包与兼容层 | `static/app/package.json` 删除 `@remix-run/router`、`react-router-dom`，`react-router` 升 8.4.0；`static/gsAdmin/package.json`、`static/gsApp/package.json`、`tests/js/package.json` 的 `react-router` 同升 8.4.0，并删 `tests/js/package.json` 的 `./reactRouter` 导出；`static/app/utils/reactRouterV6/` 与 tsconfig paths 删除 |
| Jest 的 router resolver | 删除 `tests/js/jestReactRouterResolver.cjs` 与其测试；新建 `tests/js/jestWorkspaceResolver.cjs`/`.spec.ts`（从旧 resolver 拆出的 workspace 解析）；`createJestConfig` 与 `tests/js/jest.config.snapshots.ts` 的 `resolver` 都改用 `jestWorkspaceResolver.cjs`，缓存目录去掉 router 段；`oxlint.config.ts` 的 node 环境豁免（`import/no-nodejs-modules: off`）从旧文件名改到这两个新文件名 |
| 双版本测试 helper 与 Nuqs setup | 整文件删除 `tests/js/sentry-test/reactRouter.tsx`（0 增、32 删）；其 `createTestRouter`／`TestRouterProvider` 的消费方都改用 `RouterProvider`（必要时配 `UNSAFE_createRouter(...).initialize()`）：`tests/js/sentry-test/reactTestingLibrary.tsx`、`tests/js/sentry-test/reactRouter.spec.tsx`、`static/app/utils/useRoutes.spec.tsx`、`static/gsApp/overrides/useButtonTracking.spec.tsx`（其中 `reactRouter.spec.tsx`、`useRoutes.spec.tsx`、`useButtonTracking.spec.tsx` 三处 spec 均保留／加上 `useTransitions={false}`）；`setupNuqs.ts`、`reactRouter.spec.tsx` 的 adapter import 改为 v8 |
| 兼容模块的 lint 豁免 | `oxlint.config.ts` 删除 `reactRouterV6` 的 `@sentry/no-legacy-router-imports: off` |
| 指令里的旧版说明（`static/AGENTS.md`） | 改为 V8-only：builds、tests、typechecks 都用 V8，删掉 V6 runtime 与兼容模块说明（[de3060f L32-40](https://github.com/getsentry/sentry/blob/de3060f736c6dd55836bfae104336a967ec41d8d/static/AGENTS.md#L32-L40)） |

**保留（切完后仍应存在的行为／规则）**：

- `no-legacy-router-imports` 规则本身保留；退场提交只把描述从“V8 paths while using V6 runtime”改为“V8 paths”，并删掉兼容模块豁免。当前源码仍禁 `react-router-dom`、`@remix-run/router`、`react-router/dist` 及 Jest 模块引用。
- Jest 分片、shard 0 跑 package tests、workspace resolver 保留。
- `static/app/router/legacy/` 下的旧路由兼容 helper 保留（从 `reactRouter6Compat` 改名），PR 自述“URL adapter outputs match the pre-rename baseline”。
- Sentry 的路由 helper、URL／query 导航、域名路由、breadcrumbs、preloading、未保存修改提示仍支持（PR #128415 自述，未复跑）。
- 版本中立的 Sentry tracing API（`reactRouterBrowserTracingIntegration`、`wrapCreateBrowserRouter`）保留。

## 五、反馈与取舍

- **反馈一（r4198722076，2026-10-06）**：评论者指出两条 AGENTS 规则并读时“Should we use v6 or v8?”。这是真实读者歧义，不是措辞洁癖；修订把“应用仍跑 V6”和“导入用 V8 路径”拆成两条，并把 Nuqs／tracing 的 V6 状态写在同一条。可借的是：**允许的导入、实际 runtime、配套 adapter 三件事分开写，每件都给出适用环境。** 不能把这当成“V8 已启用”的证据。
- **反馈二之一（r4232760642，2026-10-09）**：评论者质疑双 typecheck 是否值得，问两版之间是否有类型错误、能否在完全切换时再修。这是成本取舍，不是已证错误；PR 没有给出双 typecheck 额外检出的记录，作者自报两项完整 typecheck 通过。**结论：只在“同一源同时支持两个 runtime”的阶段付这份成本，退场即删；不能把双跑写成收益，也不能因成本在条件未满足时提前删旧支持。**
- **反馈二之二（r4232753329，2026-10-09）**：评论者要求在这个文件里注明迁移后可以清理什么。阶段二源码随后加入明确注释：`testCi.js` L18“Once production and previews use V8, remove the version selection…”、L37“After removing the router matrix, drop the V6 condition but keep the shard-0 guard”、L64“Once V6 support is removed, drop this package-test router override”；`typecheck.ts` L10-11 也写“use V8 types in tsconfig.json and delete this generator”。**可借的是：把撤除条件写在临时代码旁边，让清理项跟代码一起被看到。** 退场提交逐项兑现了这些注释；未逐行核对的清理不做推断。

## 六、代表性指令示例

以下按 Sentry 固定源码的结构写成通用示例，**是据源码归纳的示例，不是 Sentry 逐字原文，也不表示 Sentry 当前仍应继续 V6**；路径、变量名和命令需换成你的项目。

```markdown
### 路由（并行主版本迁移期）

- 实际 runtime：本机开发解析到 React Router 8；生产、deploy preview、CI、
  test 模式与 acceptance 构建解析到 6.x。`build-utils/router.ts` 同时选择
  router runtime 与 Nuqs adapter，二者必须同档。
- 允许的导入／API：从 `react-router` 导入 router API 与类型，从
  `react-router/dom` 导入 `RouterProvider`；只有兼容模块可以直接导入
  `react-router-dom` 或 `@remix-run/router`。Nuqs 保留 v6 adapter 的
  import，V8 构建与测试把它别名到 v8 adapter；Sentry tracing 用版本中立的
  `reactRouterBrowserTracingIntegration` 和 `wrapCreateBrowserRouter`。
- 检查：`pnpm test-ci` 与 `pnpm typecheck` 默认跑 6 和 8 两版；
  `ROUTER_VERSION=6|8` 只跑一版。路由构建检查必须断言产物内只有一个
  major、Nuqs adapter 与 runtime 同档、共享 router context（同一 runtime
  下 `react-router` 与 `react-router-dom` 导出的 `useLocation` 等是同一
  函数／同一实例，断言两者恒等；`react-router/dom` 只用于
  `RouterProvider`，不要用它断言 hook；非 router 依赖写成同一库的多个入口
  解析到同一实例），并跑一次带路径参数和查询串的前进／返回导航。
- 撤除条件：生产、preview、CI 与 test 都跑 V8，且没有受支持的消费者仍
  依赖 V6 后，删除版本开关、别名包、兼容模块、双跑 test／typecheck 与
  CI 矩阵；保留 shard 0 门禁和禁止旧导入的 lint 规则（把说明改成 V8-only）。
```

这个示例同时回答了五个问题：允许哪些导入／API、实际跑哪个 runtime、哪些环境适用、跑哪套检查、何时撤除。

## 七、不适用与限制

- **单版本、没有分阶段迁移时不加双矩阵。** 直接升级并跑现有检查；双 runtime、双 typecheck、双 CI 都是并行期的临时成本。
- **只改导入不能称升级完成。** 阶段二的 V8 导入在生产、preview、CI、test 仍解析到 V6；必须以实际 runtime 与行为验收判断。
- **同包版本号不能替代别名／adapter 解析。** 阶段二 `static/app/package.json` 写 6.30.6，本机开发却经别名跑 8.4.0；要核 bundle／Jest／TypeScript 的实际解析结果，尤其 adapter 是否与 router 同档。
- **退出条件未满足时，不能仅因测试成本删旧支持。** 双 typecheck 的成本是真的，但必须先确认生产、preview 与受支持消费者都不再依赖旧版。Sentry 的退场提交同时完成“剩余 test 环境切 V8”和“删除旧支持”，没有一个“全环境 V8 但保留双跑”的独立稳定期；这不等于可以跳过退出条件，而是要在同一变更里把最后的切换与删除一起核过。
- **本卡是静态审稿，不是迁移实测。** 未安装、构建、运行 Sentry，未复跑 85／121 项、427 项 package tests、20 个 Chromium snapshot 或任何 CI；PR 自报的检查不能当本仓运行结果，也不能当模型收益。
- **不承诺普适收益。** 本卡没有证明双 typecheck 抓到过额外类型错误，也没有证明构建产物断言抓到过真实故障；它只是把可核的迁移契约写成可执行的检查。普通单版本项目照搬会白付成本。
- **AI review 未裁定。** PR #127030 另有 Cursor Bugbot 关于 Jest 缓存键和 balancer matrix 的评论；本卡未以它们为事实依据，也未判定真伪。
- **历史与现状分开。** 阶段二的 V6 是 2026-10-16 的历史状态；2026-10-22 退场后全环境 V8；2026-11-03 固定点 638617e 的 AGENTS 与 app package 已是 V8。不要把历史 V6 写成当前建议。

## 八、核查范围与来源

**读法**：用 `raw.githubusercontent.com` 读取固定 SHA 的文件原文；用 GitHub PR 页的 review thread 片段读取人工评论原文；未使用账户、凭据或内部地址。未安装、构建、运行 Sentry，未执行其建议命令。

**同题与写域核对**：`docs/` 全树检索 `126570`、`127030`、`128415`、`reactRouterV6`，除本文件外无命中；`TASKS.md` 没有同名卡；`inbox.md` 的旧 SDK 条目是 Anthropic／Hermes，不是本题。本轮只写本文档，不改 15、共享指令页、研究页、模板、13、TASKS 或其他卡。

| 来源 | 固定点 | 读到的内容 | 日期 |
|---|---|---|---|
| [PR #126570](https://github.com/getsentry/sentry/pull/126570) | PR 页与描述 | 只迁移导入／测试 mock，仍运行 6.30.6；PR 描述列三项逻辑提交：兼容模块／运行时类型解析／resolver 覆盖；应用、admin、GetSentry 与测试导入／mock 迁移；禁止旧路径的 Oxlint 规则（分支实际含后续 fixup／merge，共 9 个提交） | 2026-10-06 |
| [讨论 r4198722076](https://github.com/getsentry/sentry/pull/126570#discussion_r4198722076) | `static/AGENTS.md` | 两条规则并读歧义：“Should we use v6 or v8?” | 2026-10-06 17:55Z |
| [修订 8891ab8](https://github.com/getsentry/sentry/commit/8891ab865ca741f83cbcd20349bd21c03ad92ffc) | `8891ab865ca741f83cbcd20349bd21c03ad92ffc` | 把 runtime V6 与 import V8 拆开；Nuqs／tracing 仍 V6 | 2026-10-06 |
| [阶段二 9d75e92](https://github.com/getsentry/sentry/commit/9d75e921c32de2d4c122fbc5e4cff39d16175172) | `9d75e921c32de2d4c122fbc5e4cff39d16175172` | 环境选择、router＋Nuqs 同档别名、bundle 单版本／共享 context／导航断言、双跑脚本、CI 矩阵 | 2026-10-16 |
| [反馈 r4232760642](https://github.com/getsentry/sentry/pull/127030#discussion_r4232760642) | `scripts/typecheck.ts` | 质疑双 typecheck 成本，问两版类型错误能否在全切时修 | 2026-10-09 17:24Z |
| [反馈 r4232753329](https://github.com/getsentry/sentry/pull/127030#discussion_r4232753329) | `scripts/testCi.js` | 要求注明迁移后可清理什么 | 2026-10-09 17:23Z |
| [退场 de3060f](https://github.com/getsentry/sentry/commit/de3060f736c6dd55836bfae104336a967ec41d8d)／[PR #128415](https://github.com/getsentry/sentry/pull/128415) | `de3060f736c6dd55836bfae104336a967ec41d8d` | 删除 V6、双版本 CI／runner 与迁移专用检查；`static/AGENTS.md` 改为 V8-only；保留 lint 规则、shard 0、legacy helper；作者自报 121 项 focused 等 | 2026-10-22 |
| [当前 638617e](https://github.com/getsentry/sentry/commit/638617e31ccc9d303c6fd113d2e2fcd633257a60) | `638617e31ccc9d303c6fd113d2e2fcd633257a60` | `static/AGENTS.md` 与 `static/app/package.json` 已是 V8；lint 规则仍注册 | 2026-11-03 |

**作者自报与未核**：PR #127030 描述“all 85 selected application tests across six files passed under each router version”；PR #128415 描述“121 focused tests, 427 package tests, and 20 Chromium snapshot scenarios passed”。这些是作者自述，本轮没有运行 Sentry、没有复跑测试或 CI，也没有新读者照页面实测，因此不构成“迁移已通过”或“读者照做成功”的证据。

**未覆盖**：当前固定点之后的上游变化、Sentry 之外的项目、真实模型收益、双 typecheck 的额外检出、bundle 检查的实际故障捕获率均未验证。
