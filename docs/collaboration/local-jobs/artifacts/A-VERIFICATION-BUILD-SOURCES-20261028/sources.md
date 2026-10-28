# 测的是哪个构建：构建身份校验与一次性/持续回归来源

> 整理与核读：2026-10-29 UTC。候选清单 41 条由上游采集单元提供（其标注的核实日多为 2026-10-27～10-28）；本单元完成按决定排序、逐条重读原始页面，并保留每条原始链接与理由。未安装或运行产品、浏览器、测试、部署或模型，未新增清单外链接。

## 决定与筛选标准

**决定：在“怎样让 Agent 自己验证”页增加“先确认被测对象”这一层，并讲清一次性场景验收与持续回归各证明什么。** 读者读完后应能判断：这次绿灯证明的是哪份源码／产物、测试进程实际连向哪里；临时验证留下的断言是否接回了持续执行；哪些结论只是作者自报，不能当成本次复现。

排序按“能否改变读者做法”，不按来源数量：

1. 能把“测试跑在哪份构建上”变成可失败检查、或给出完整“发现→修正→复现”链的材料优先。
2. 能解释模式、开关与产物选择的机制证据其次，用来判断第一条的适用边界。
3. 持续回归的实现细节再次，用来回答“一次性验收之后怎样继续执行”。

筛选沿用任务给定的五问：开发任务、宿主、版本或固定提交、实际测试命令与预期被测对象；哪份源码生成哪份产物，测试进程／浏览器连向哪里，哪些证据是核过的、哪些仍是前提假设；一次性操作、已保存测试、CI 实际执行三层分别列出；原问题怎样被发现，修正是否保留能检出原失败的回归；对本仓验证页新增哪条实际选择或反例。近 3–6 个月的真实改动优先；作者自报与本次实跑分开，未执行就写未知。

**与已有材料的关系：** 同题产物 `A-VERIFICATION-MAP-SOURCES-20261028` 处理“功能验收地图按变更维护”，与本清单的构建身份／回归接线无同源重叠，本次不重复其材料。`docs/decisions/verification.md` 已有“复用现有检查、保留回归、skip／fixme 单列、按承诺取证、报告写清命令与结果”，其失败处理表已有“核进程属于当前检出及浏览器实际可达性”；`docs/23-browser-verification.md` 已有截图前等状态、trace 与自修复边界，并要求“遇到差异先核执行位置与服务入口”。本清单不声称新增服务身份层，只补这些原则下可执行的具体机制与可复现反例：构建／产物身份（本地包、已发布版本、预览 tarball、已有部署），以及服务身份（专用端口、`--strictPort`、禁用 `reuseExistingServer`、worktree 共用与占端口复现）的固定方法。`docs/collaboration/inbox.md` 2026-10-27 的 Next.js 条目已收“按改动分级构建命令”，本清单只补“产物须最新”的前提与 deploy 缺口，不重复命令分级。

## 最值得深挖的八项

**1. playwright-python 的 `build_driver.py` + `lint.sh` + `roll.yml`（第 1 组，P0）。** 这是清单里唯一同时做到“产物名带源提交”“构建前拒绝脏检出”“检查阶段（roll 最后一步）重跑生成器并比对差异”“CI 断言 `DRIVER_VERSION == NEW_COMMIT`”的链路。它把“构建／生成物与本次源码一致”从“假设本地构建是最新的”改成会失败的检查，最容易迁移成一个项目的检查阶段门禁。限制也清楚：它依赖 `.upstream` 独立检出与已构建的驱动包，不是通用 CI 配方；`lint.sh` 还跑 pre-commit（格式化、flake8、mypy、pyright）与测试注册表检查，但不证明运行时行为正确。

**2. Next.js `create-next-install.js` 的模块来源断言 + `turbo.json` 的打包任务（第 2 组，P0）。** 前者在隔离安装后检查 `@next/env` 是否从 npm registry 解析，若是则直接抛错“resolved from the npm registry instead of the local tarball”；后者显示 `pack-for-isolated-tests` 声明 `inputs: ["$TURBO_DEFAULT$", "dist/**"]`、`outputs: packed.tgz`，没有 `dependsOn: build`；`$TURBO_DEFAULT$` 只影响缓存失效，不会在 pack 前触发 build，所以“隔离安装装的是上一次构建的 dist”仍是真实前提。两条合起来回答了“测试加载了哪份包”以及“还剩下什么没被保证”。这是把“绿了但对象错”缩小到可断言范围的最短路径。

**3. google-meet-clone 的 `1f92348` 修正提交（第 3 组，P0）。** 这是清单里最完整的一条“测试绿了却测错 worktree”案例：多个 `.claude/worktrees` 共用 5173，`reuseExistingServer` 复用了没有目标面板的 phase-2 服务；修正为专用 5273（`E2E_PORT`）、`--strictPort`、禁用复用，并用“用一个外来 vite 占住端口”复现验证。它不是只改端口，而是把“服务身份”变成失败条件。可借的是这套组合与复现方法，不是某个端口号。

**4. entur/hathor #122 的 live 全绿与 CI 缺口（第 4 组，P0）。** 作者审计写明：当天 live 全绿（68 pass／54 skip）只因 `npm run local` 已在 :5000 上运行，`reuseExistingServer: !CI` 信任任何占着该端口的服务；提议加 setup project 断言端口服务的是本检出。随后合并的 #126 没有把这项改进带进 `playwright.config.ts`，当前 main（`3d09b66`）仍是同一配置；CI 只跑 `E2E_BACKEND=false` 的 mock 套件。它同时给出“一次性人工验收”和“持续回归只覆盖 mock 层”的边界，是“绿”不能外推的强反例。

**5. Next.js #98330 + #98353（第 5 组，P0）。** 官方团队自己报告：fixtures 把 `@next/third-parties` 等声明为 canary，安装的是已发布 npm canary 而非本次 checkout，deploy 下还因 peer 范围直接 ERESOLVE；修法是 `workspace:*` 解析到当前检出。紧接着 #98353 又把 deploy 测试默认改为使用本检出打包的 tarball。两条都是作者自报、未独立复现，但这是维护者对自己测试对象的直接描述，价值高于外部推测。引用时要保留“作者自报、未复现”的强度。

**6. google-meet-clone 的 `668b3f8`：守卫测试本身是恒真的（第 6 组，P0）。** `--use-fake-device-for-media-capture` 不是 Chrome 开关，会被静默忽略，项目从 Phase 1 起每次 e2e／figma:diff 都在驱动真摄像头和麦克风；专门守护它的 smoke test 只断言“存在某个 videoinput”，在任何有摄像头的机器上恒真。修正后断言设备 label 含 fake，并用“把拼写改回去”验证能失败。它直接说明：一条断言如果不能区分真假，跑得再久也不构成证据。局限是仓库无 `.github` 工作流，套件未在 CI 连续跑，作者“只会在 CI 失败”是反事实假设。

**7. Next.js 的新测试持续执行链（第 7 组，P0）。** `build_and_test.yml` 对新／改测试跑 3 次 dev、3 次 start、1 次 deploy；`test-new-tests.mjs` 只在 deploy 模式把 `NEXT_TEST_VERSION` 设为该 commit 的 preview tarball，其他模式跑本地版本；`deploy-tests-manifest.json` 的 v2 规则让匹配 include 的新 e2e 自动进入 deploy 子集；release 工作流则把 `NEXT_TEST_VERSION` 设为 `packages/next/package.json` 的版本，测的是已发布包。四段合起来给出“一次性验收如何变成持续回归”的完整官方路径，也划清了“本地源码”“CI 产物”“已发布版本”三种对象。

**8. google-meet-clone 的 `check-dist.ts`：门禁要自证还能失败（第 8 组，P0）。** 脚本在比对 `dist/` 前先重读每个 needle 的来源文件；字面量已从源码消失就非零退出并提示“THIS GATE CURRENTLY PROVES NOTHING”。这是“对已删除字符串的 grep 永远通过”的自我防护。可借的规则是让验证器自证还能失败，而不是继续增加检查项。

另外同样值得读：第 8 组的 9d76537（对错误的一半做门禁＝假 all-clear）、第 9 组（截图前等 `ready`）、第 10 组（Next.js 的 dev/start/deploy 模式与 `NEXT_SKIP_ISOLATE` 回退）。它们决定“怎样解释一次绿灯”，但单独不足以构成一套可执行校验。

## 完整候选清单（按优先级）

### 第 1 组：playwright-python 的构建身份硬校验（P0，5 条）

固定基线：`5306360397109b09704cf87ea611f3b74f79a368`。以下页面均在 2026-10-29 重新读取。

- **`scripts/build_driver.py`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/scripts/build_driver.py)。原理由：驱动包命名为 `playwright-<DRIVER_VERSION 提交>-<平台>.zip`，只允许从 `.upstream` 干净检出构建，提交不符或包缺失就重建；测试消费的是哪份构建由产物名直接可查，不靠 Agent 自述。本次核读：文件头说明构建对象是 `.upstream` 在 `DRIVER_VERSION` 的 `playwright-core`；L31–36 要求干净检出；L245 以 `<commit>` 命名产物；L251–260 已存在的包不重建。
- **`scripts/lint.sh`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/scripts/lint.sh)。原理由：先比对 `.upstream` HEAD 与 `DRIVER_VERSION`、拒绝本地改动、重跑生成器并比对差异，再跑测试注册表检查，任一不符即失败——把“构建／生成物与本次源码一致”从前提变成可执行检查。本次核读：L12–20 的 pin 与脏检出检查、L22–30 的“重跑生成器后 diff 必须不变”、L32–33 的 pre-commit 与注册表检查依次执行，`set -e` 遇错即停。
- **`.claude/skills/playwright-roll/SKILL.md`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/.claude/skills/playwright-roll/SKILL.md)。原理由：五步流程之外给出可核的失败信号（`playwright/driver/` 比 pin 旧时报 `timeout: expected float, got undefined`），并说明 server／injected 改动随新驱动生效、不用移植，界定了哪些临时验证只需重跑、哪些必须补测试。本次核读：L58–59 与 L81–87 确认该报错签名和“driver 旧了要重建”；L64–69 把 `lint.sh` 放在最后一步。
- **`.github/workflows/roll.yml`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/.github/workflows/roll.yml)。原理由：check 步骤先断言 `DRIVER_VERSION == NEW_COMMIT` 再跑 `lint.sh`；发布步骤拒绝修改 YAML、AGENTS／CLAUDE.md 与白名单外文件，不完整就开 draft PR，避免 Agent 把 CI 或指令改绿。本次核读：L141–142 确认断言与 lint；L201–214 确认拒绝 YAML、`AGENTS|CLAUDE.md`、白名单外文件与符号链接；L267 确认不完整时 draft。
- **PR #3292（2026-10-24 开，10-26 合入）**：[原始链接](https://github.com/microsoft/playwright-python/pull/3292)。原理由：只改 `DRIVER_VERSION` 与 README 两个文件，正文报告 Chromium 套件 3,831 个 sync、3,933 个 async 通过，并单列 async headful Chromium 测试 HE-003 一次浏览器崩溃后重试通过、另开重试关闭再跑也通过——展示“绿”要带版本、命令、数量与不稳定项。本次核读：文件页确认只改 `DRIVER_VERSION` 与 `README.md`；正文把数字限定为 Chromium 套件，与 HE-003 描述一致。页面同时显示 `21 of 29 checks passed`，其余 8 项状态本次未展开，不能写成“全部检查通过”。

### 第 2 组：Next.js 的本地包断言与新鲜度前提（P0，3 条）

固定基线：`f922205f9e860de24673269f81dea51e9e33b0cb`。

- **`test/lib/create-next-install.js` L515–543**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/test/lib/create-next-install.js#L515-L543)。原理由：代码把 `turbo pack-for-isolated-tests` 产出的 tarball 装进每个测试的临时目录，并在 `@next/env` 解析到 npm registry 时抛错“resolved from the npm registry instead of the local tarball”；这是把“测试加载了哪份包”变成可失败断言的具体机制，本次只读源码未运行。本次核读：L515–543 与该错误文本逐字一致；它还允许通过 lockfile 解析到本地 tarball 的分支，不是只认一种安装器。
- **`turbo.json` L22–25**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/turbo.json#L22-L25)。原理由：`pack-for-isolated-tests` 在 turbo.json 声明 `inputs: ["$TURBO_DEFAULT$", "dist/**"]`、`outputs: packed.tgz`，没有 `dependsOn: build`；`packages/next` 的实现是 `pnpm pack --out ./packed.tgz`。`$TURBO_DEFAULT$` 只参与缓存键，默认输入变化会让 pack 重跑，但不会在 pack 前触发 build，也不是 src→dist 的一致性校验。隔离安装装的是上一次构建留下的 dist，src 与产物无哈希校验，AGENTS.md 的“产物须最新”是真实前提而不是形式声明。本次核读：L22–25 确认 `inputs`、`outputs` 与无 `dependsOn`；这条只证明任务图不强制构建，具体 `packages/next` 命令沿用候选说明，未另开文件核。
- **`AGENTS.md` L73–75、L287**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/AGENTS.md#L73-L75)。原理由：官方 Agent 指引要求改源码先开 watch build，仅改 test 可直接跑模式测试，但明确写“assumes the workspace is already bootstrapped and framework build outputs are current”，stale 产物仍须构建；同文 L287 写 fork PR 无 secrets、deploy 测试不会跑。构建命令分级已在 inbox 2026-10-27 条目收录，此条只补新鲜度假设与 deploy 缺口。本次核读：L73–75 与 L287 逐字确认；L287 的原文是“Fork PRs run without repository secrets, so deploy tests never run on them”。

### 第 3 组：google-meet-clone 的 worktree 复用修正（P0，1 条）

- **提交 `1f92348cb5c6870250c3eeb51ae0d8e2bacb1072`（2026-07-16）**：[原始链接](https://github.com/videosdk-community/google-meet-clone/commit/1f92348cb5c6870250c3eeb51ae0d8e2bacb1072)。原理由：`.claude/worktrees` 下多个检出共用 5173，`reuseExistingServer` 复用了没有 PeoplePanel 的 phase-2-in-call 服务，只有新增的 `?fake_call=` 场景失败才暴露；修复为专用 5273（`E2E_PORT`）＋`--strictPort`＋禁用复用，并用“在端口上放一个外来 vite”复现验证——正是“测试绿了却测错对象”的完整修正链。本次核读：同一 spec 文件 `tests/e2e/collaboration.spec.ts` 新增 4 个 `?fake_call=` 测试（提交说明称 four e2e flows，正文的“Four specs”指这四条流程，不是 4 个 spec 文件）；文件顶部 `test.skip(({ isMobile }) => isMobile === true, ...)` 标注 Desktop only，而 `mobile-chromium` 用 `devices['Pixel 7']`（`isMobile` 为 true），所以这 4 个 test 只在 `desktop-chromium` 实际执行 4 次，`mobile-chromium` 的 4 个条目全部跳过；两个 project 共登记 8 个 test 条目，仍是 4 条流程，不是 8 个场景；该提交共 5 个文件：`playwright.config.ts`、`playwright.live.config.ts`、`scripts/figma-diff.ts`、`tests/e2e-live/server.ts`、`tests/e2e/collaboration.spec.ts`（含 `figma-diff.ts` 的 ready 修复）。用外来 vite 占端口的复现原文为“Verified by parking a foreign vite on the port”。提交日期为 2026-07-16（页面 authoredDate，06:38:43Z／12:08:43+0530）。

### 第 4 组：hathor 的 live 绿与 CI 覆盖缺口（P0，2 条）

- **`entur/hathor` #122 的作者评论（2026-06-09）**：[原始链接](https://github.com/entur/hathor/issues/122#issuecomment-4660000307)。原理由：作者审计写明 `reuseExistingServer: !CI` 会信任 :5000 上任何服务、当天 live 全绿（68 pass／54 skip）只因 `npm run local` 已在跑，并提议加 setup project 断言端口服务的是本检出；该提议未进合并的 #126（候选称 33 个文件不含 `playwright.config.ts`），2026-10-28 main@3d09b66 仍是同一配置，只有 `config.json` 后来改由 route 注入（缓解配置漂移，未证源码身份）。本次核读：评论原文确认 68 pass／54 skip 与“只因已在跑”；`3d09b66` 的 `playwright.config.ts` L83–86 仍是 `reuseExistingServer: !process.env.CI`、`localhost:5000`，L44–55 只有 chromium／firefox 两个浏览器 project，没有 setup project 断言端口服务来源。#126 最终为 33 个变更文件：文件页按扩展名统计 `.graphqls` 1＋`.json` 1＋`.ts` 28＋`.tsx` 3＝33，GitHub API 的 `changed_files` 也是 33；页面另显示两条 Copilot 审阅快照（25/25、31/32），那是较早版本的计数，不是最终总数。按 API 文件列表逐项核对，33 个文件为 `e2e-tests/auth/auth.spec.ts`、`e2e-tests/no-auth/autosys-helpers.ts`、`e2e-tests/no-auth/autosys-multi-import.spec.ts`、`e2e-tests/no-auth/deck-plan-name-sort.spec.ts`、`e2e-tests/no-auth/import-to-detail.spec.ts`、`e2e-tests/no-auth/live-auth-helpers.ts`、`e2e-tests/no-auth/no-auth.spec.ts`、`e2e-tests/no-auth/vehicle-create-feedback.spec.ts`、`e2e-tests/no-auth/vehicle-create-form.spec.ts`、`e2e-tests/no-auth/vehicle-loading-state.spec.ts`、`e2e-tests/no-auth/vehicle-registration-sort.spec.ts`、`e2e-tests/no-auth/vehicle-slider-form.spec.ts`、`e2e-tests/no-auth/vehicle-type-filter.spec.ts`、`e2e-tests/no-auth/vehicle-type-save-live.spec.ts`、`e2e-tests/no-auth/vehicle-type-sidebar.spec.ts`、`e2e-tests/no-auth/vehicle-type-transport-mode.spec.ts`、`e2e-tests/no-auth/vehicle.spec.ts`、`package-lock.json`、`src/App.tsx`、`src/data/netex/multilingualString.test.ts`、`src/data/netex/multilingualString.ts`、`src/data/vehicle-types/api/fetchVehicleTypes.ts`、`src/data/vehicle-types/api/serializeVehicleType.test.ts`、`src/data/vehicle-types/components/VehicleTypeForm.tsx`、`src/data/vehicle-types/hooks/useVehicleTypeSave.ts`、`src/data/vehicle-types/hooks/useVehicleTypes.ts`、`src/data/vehicles/api/fetchVehicles.ts`、`src/data/vehicles/components/VehicleEditForm.tsx`、`src/data/vehicles/hooks/useVehicle.ts`、`src/data/vehicles/hooks/useVehiclePairSave.ts`、`src/data/vehicles/utils/transportTypeRef.test.ts`、`src/graphql/sobek.schema.graphqls`、`src/hooks/useResizableSidebar.ts`。`playwright.config.ts` 不在其中，候选的 33 成立；页面 32 与最终 33 的差 1 来自较早快照，公开页面与 API 都未标明少的是哪个文件，不再以 `package-lock.json` 作猜测。`config.json` 改由 route 注入可由当前工作流注释旁证，但“未证源码身份”仍成立。
- **`.github/workflows/playwright.yml`（固定 `3d09b662ea82070b2be4a426570cacadb369dc47`）**：[原始链接](https://github.com/entur/hathor/blob/3d09b662ea82070b2be4a426570cacadb369dc47/.github/workflows/playwright.yml)。原理由：工作流只执行 `npm run e2e` 且固定 `E2E_BACKEND=false`，`e2e:local-backend` 只存在于 package.json、未接入任何 workflow，所以 live 后端 org-select 的绿是一次性人工验收、没有持续回归；可据此界定一条“绿”到底覆盖 mock 层还是真实集成。本次核读：e2e job 的 `env` 中 `E2E_BACKEND: 'false'`，命令为 `npm run e2e -- --project=...`；工作流另有 schema 与 unit job，但没有 live-backend job。

### 第 5 组：Next.js 官方自报的“绿了但对象错”与默认本地包（P0，2 条）

- **PR #98330（2026-09-08 合并，作者 eps1lon）**：[原始链接](https://github.com/vercel/next.js/pull/98330)。原理由：fixtures 把 `@next/third-parties` 等声明为 canary，安装的是已发布 npm canary 而非本次 checkout，deploy 下还因 peer 范围直接 ERESOLVE；修法改为 `workspace:*` 解析到当前检出的打包产物——这是官方自报的“测试绿了但对象错了”，效果与失败数字未独立复现。本次核读：正文逐字确认 canary 声明、ERESOLVE、`workspace:*` 在 dev／start／deploy 三种模式下的解析规则；test plan 只写“new tests deployed passes on this PR (i.e. CI green)”，没有独立复现数据。
- **PR #98353（2026-09-08 合并，作者 unstubbable）**：[原始链接](https://github.com/vercel/next.js/pull/98353)。原理由：此前 deploy 测试默认走已发布 build，现改为未设 `NEXT_TEST_VERSION` 时把本检出打包 tarball 放进部署源；CI deploy job 仍显式设 `NEXT_TEST_VERSION` 故其包选择不变，验证只作者自报跑了两个 suite。本次核读：正文确认“未设时用本检出的 JavaScript 包、通过相对 `file:` 引用安装；设了则保留已发布流程”；也确认“现有 CI deploy job 已设 `NEXT_TEST_VERSION`，包选择不变”。候选所称“只跑了两个 suite”本次未在正文中定位到确切句子，保留为作者自报的强度描述。

### 第 6 组：google-meet-clone 的恒真假摄像头守卫（P0，1 条）

- **提交 `668b3f822c2c65847e3dcd13b6ccd35b0e08a969`**：[原始链接](https://github.com/videosdk-community/google-meet-clone/commit/668b3f822c2c65847e3dcd13b6ccd35b0e08a969)。原理由：`--use-fake-device-for-media-capture` 不是 Chrome 开关、会被静默忽略，项目从 Phase 1 起每次 e2e／figma:diff 都在驱动真实摄像头和麦克风，而专门守护它的 smoke test 只断言“存在某个 videoinput”（有摄像头的机器恒真）。668b3f8 新增注释自报该守卫 passed for two months；但公开提交历史显示 Phase 1 至该修复均在 2026-07-15 当天（首个提交 2026-07-15T07:14:04Z／12:44:04+0530，668b3f8 为 12:59:15Z／18:29:15+0530），公开记录不支持两个月，时长按作者自报／未知处理。改用 `-stream` 后断言设备 label 含 fake，并靠恢复拼错验证能失败。局限：仓库无 `.github` 工作流，套件未在 CI 连续跑，作者“只会在 CI 失败”是反事实假设。本次核读：提交说明确认拼写错误、静默忽略、恒真断言、改后断言 label 含 fake、用恢复拼错验证；`.github` 与 `.github/workflows` 在该提交下均返回 404，确认无工作流。提交日期取自页面 embedded JSON authoredDate：2026-07-15T18:29:15+05:30。

### 第 7 组：Next.js 的“新测试自动进入持续执行”（P0，4 条）

- **`.github/workflows/build_and_test.yml` L803–852**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/.github/workflows/build_and_test.yml#L803-L852)。原理由：`test-new-tests-dev`／`start` 用 `scripts/test-new-tests.mjs --flake-detection`（每 suite 跑 3 次）只选本次变更测试，`test-new-tests-deploy` 用 `--mode deploy` 选 deploy 子集并等 preview tarball；这是“一次性验收写成测试后自动进入持续执行”的官方路径，deploy 构建身份靠 commit-keyed URL，只断言可取不校验内容哈希。本次核读：L802–849 确认 dev／start 两个 job 与 `--flake-detection`；L896–943 确认 deploy job 依赖 `wait-for-preview-tarball` 并使用 `--mode deploy`。候选称“3 次”来自 `--flake-detection` 的实现，本次未展开该脚本的运行次数代码。
- **`scripts/test-new-tests.mjs` L95–110**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/scripts/test-new-tests.mjs#L95-L110)。原理由：注释与实现写：仅 deploy 模式把 `NEXT_TEST_VERSION` 设为 `previewTarballUrl(commitSha)`，其他模式不设，因此 dev／start 新测试跑本地版本、deploy 新测试跑该 commit 的预览 tarball；这是区分“本地源码”与“CI 产物”的直接代码证据。本次核读：L94–115 逐字确认。
- **`test/deploy-tests-manifest.json`**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/test/deploy-tests-manifest.json)。原理由：manifest v2 的 include 规则为 `test/e2e/**/*.test.{t,j}s{,x}`、exclude 25 个文件，并按 suite 排除已知 failed／flakey 用例，get-test-filter.js 注释写明匹配 include 的新测试自动包含——deploy 覆盖是默认全量加例外，不是人工白名单。本次核读：L90–117 确认 version 2、include 模式与 25 条 exclude；同页引用的 `get-test-filter.js` 注释确认“Any new tests that are added will be automatically included if they match the include rules”。
- **`.github/workflows/test_e2e_deploy_release.yml` L202–236**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/.github/workflows/test_e2e_deploy_release.yml#L202-L236)。原理由：release 触发的 deploy 测试把 `NEXT_TEST_VERSION` 设为 `packages/next/package.json` 的版本（即 npm 上该版本），分 webpack 8 组、turbopack 12 组、adapter 12 组；所以发布回归证明的是已发包在 Vercel 的行为，不是工作树里的未发布改动。本次核读：L185、L222–236、L275–289 确认 8／12／12 分组；L195、L247、L299 确认三处均设 `NEXT_TEST_VERSION="${{ needs.setup.outputs.next-version }}"`。

### 第 8 组：check-dist 的自证失败（P0，2 条）

- **`scripts/check-dist.ts`（固定 `2b2fd4881b792405b6eaa4ccd7827db6c24f0225`）**：[原始链接](https://github.com/videosdk-community/google-meet-clone/blob/2b2fd4881b792405b6eaa4ccd7827db6c24f0225/scripts/check-dist.ts)。原理由：2026-08-17 的构建门禁在比对 `dist/` 前先重读每个 needle 的来源文件，字面量消失就非零退出并提示“这个门禁现在什么都证明不了”，因为对已删除字符串的 grep 永远通过；提交说明另称同次改动发现 20 个 fake 参与者名称随测试表混进 dist 的真实泄漏——可借的是让验证器自证还能失败，不是增加检查项。本次核读：L44–72 的 source 复读与 `THIS GATE CURRENTLY PROVES NOTHING`、L90–110 的 dist 扫描与失败文本确认；`NEEDLES` 数组为 13 条。提交说明称“all 20 fake participant names reached dist/”，20 是泄漏名称数、不是 canary 条数；本次只读提交说明原文，未复跑构建。
- **提交 `9d76537303bda52a952e50b1f196ed07881943be`**：[原始链接](https://github.com/videosdk-community/google-meet-clone/commit/9d76537303bda52a952e50b1f196ed07881943be)。原理由：原计划用 `dist/` grep 证明 `?dev_host=1` 没进生产，但角色由 `api/token.ts` 服务端决定、Vercel 函数根本不会进入 `dist/`，这条门禁无论如何都会绿；作者因此取消整个 hatch 改走 seed grant 真实代码路径，结论是“对错误的一半做门禁等于 false all-clear”。本次核读：提交说明逐字确认“角色由服务端签名 grant 决定、`import.meta.env.DEV` 与 `dist/` 都只覆盖客户端、grep 会在生产已带 hatch 时仍绿”；文件列表为 3 个文件。

### 第 9 组：截图前先等业务状态（P1，1 条）

- **`scripts/figma-diff.ts`（固定 `1f92348cb5c6870250c3eeb51ae0d8e2bacb1072`）**：[原始链接](https://github.com/videosdk-community/google-meet-clone/blob/1f92348cb5c6870250c3eeb51ae0d8e2bacb1072/scripts/figma-diff.ts)。原理由：figma:diff 的 ignore 选择器无论面板开没开都能解析，一次失效点击会把关闭的面板截图当成布局回归；加入显式 `ready` 等可见状态后才截图，代码注释写明“截错状态比没截图更糟，因为它会被读成保真度数字”。残留边界：该工具仍默认 5173、需手动传 `DIFF_BASE_URL`，自动套件有身份保证、人工视觉采集仍靠操作者。本次核读：L74–81 的注释与 L194–197 的 `waitFor({ state: 'visible' })` 确认；L157 确认默认 `localhost:5173` 与 `DIFF_BASE_URL` 覆盖。

### 第 10 组：Next.js 的 dev／start／deploy 模式与产物选择（P1，5 条）

- **`test/lib/next-modes/base.ts` L271–284、L760–788**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/test/lib/next-modes/base.ts#L271-L284)。原理由：`nextTestSetup` 为每个 suite 建 `next-test-<时间>-<随机>` 临时目录；`NEXT_SKIP_ISOLATE` 时改用仓库内 `test/tmp`、没有隔离安装并回退到工作区 next 二进制（L766–788 注释明说），next 版本取 `NEXT_TEST_VERSION` 或当前 `next/package.json`，因此该开关确实会换掉被测产物。本次核读：L271–284 与 L760–788 确认；注意 L777–788 的选择是“本地 bin 存在就优先”，不是无条件回退。
- **`test/lib/e2e-utils/index.ts` L108–130**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/test/lib/e2e-utils/index.ts#L108-L130)。原理由：`test/e2e` 下只接受 `dev|start|deploy`，未设时警告并默认 `start`；`test/development` 强制 `dev`、`test/production` 强制 `start`，随后分别实例化 `NextDev`／`NextStart`／`NextDeploy`，说明“跑的是哪种构建”由测试路径加一个环境变量共同决定。本次核读：L106–131 确认模式推导与默认 `start`；实例化部分在后续代码，未逐行展开。
- **`test/lib/next-modes/next-start.ts` L122–190**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/test/lib/next-modes/next-start.ts#L122-L190)。原理由：start 模式在隔离目录里跑 `pnpm next build` 再 `pnpm next start`，从该目录 `.next` 读 `BUILD_ID` 与 `required-server-files.json`，提供了“本次实际构建产物”的标识；源码不校验 dist 是否由当前 src 生成。本次核读：L122–190 确认 build 子进程、`BUILD_ID` 读取与 `required-server-files.json` 解析；未在源码中找到 src↔dist 哈希校验。
- **`test/lib/next-modes/next-deploy.ts` L432–447**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/test/lib/next-modes/next-deploy.ts#L432-L447)。原理由：未设 `NEXT_TEST_VERSION`／`NEXT_TEST_DEPLOY_URL`／`NEXT_TEST_DEPLOY_SCRIPT_PATH` 三者时把本地打包 tarball 复制进部署源并用相对 `file:` 引用，native SWC 用与本地 next 版本匹配的已发布二进制；设 `NEXT_TEST_DEPLOY_URL` 则跳过打包与部署、直接测已有部署，测试只从 build log 取 `BUILD_ID`／`DEPLOYMENT_ID`，不能证明该部署对应本次源码。本次核读：L438–443 确认三个变量都未设时才 `prepareLocalPackages`；L784–864 确认相对 `file:` 引用与“published SWC + 不含本地 native”提示；L306、L340 确认从 CLI 输出／日志取 `BUILD_ID`。
- **`contributing/core/testing.md` L36–40**：[原始链接](https://github.com/vercel/next.js/blob/f922205f9e860de24673269f81dea51e9e33b0cb/contributing/core/testing.md#L36-L40)。原理由：官方文档写明 e2e 在系统临时目录创建 next 安装、随机端口启动、结束删除；`NEXT_TEST_VERSION` 可换成已发布版本／dist-tag／commit preview tarball 并跳过本地打包，`NEXT_TEST_DEPLOY_URL` 直接跑已有部署并跳过打包与部署——是读者可直接照做的入口，效果仍是文档承诺。本次核读：L36–42 确认隔离目录、随机端口与清理；版本切换在同页 L97、L170–189 有明确命令，但候选给的 L36–40 锚点本身只覆盖隔离部分。

### 第 11 组：playwright-python 的移植与注册表身份（P1，5 条）

- **`tests/AGENTS.md`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/tests/AGENTS.md)。原理由：逐行零偏差移植、唯一允许的标记是 `xfail(reason="python: ...", strict=True)`、无法移植的测试必须进 `upstream_not_ported.txt` 写原因、Python 专有测试要少，并明确“不许为通过而改移植”。本次核读：L9–19 确认零偏差、禁止改到通过、唯一允许的 `strict=True` xfail；L40–45 确认 `upstream_not_ported.txt` 与注册表检查入口。
- **`scripts/check_test_registry.py`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/scripts/check_test_registry.py)。原理由：强制每个 port 函数名带 registry ID 且等于由上游标题推出的名字，重复定义、既移植又标未移植、规则为空都报错；但它只扫 `tests/{async,sync}/{page,library}`，`tests/*/python` 的 132 个 async 专有测试函数不在账上。本次核读：L49–50 的 `FLAVORS=("async","sync")`、`SUITE_DIRS=("page","library")` 与 L156–161 的扫描路径确认；`tests/async/python`、`tests/sync/python` 目录存在（均返回 200），故“python 专有测试不在注册表扫描范围”成立；“132 个”未逐函数计数，保留为候选数字。
- **上游 `tests/registry.md`（固定 `1b9b602724484df3ebc41aba77824fdfaba861f6`）**：[原始链接](https://github.com/microsoft/playwright/blob/1b9b602724484df3ebc41aba77824fdfaba861f6/tests/registry.md)。原理由：4,936 条测试各有 ID，默认跨语言共用（仅设计上某语言独有时用 `CL-PY-` 这类前缀），ID 是标题首 token、由 `npm run lint-tests` 与注册表比对——某个语言绑定缺测会以一个可见 ID 暴露，而不是“测试数差不多”。本次核读：L3–15 确认 ID 规则与“默认所有 port 共用”；按反引号 ID 表格行计得 4,944 行，与候选的 4,936 差 8 行，差异原因未核，引用具体数字时应以实际文件为准。
- **上游 `tests/config/registryReporter.ts`**：[原始链接](https://github.com/microsoft/playwright/blob/1b9b602724484df3ebc41aba77824fdfaba861f6/tests/config/registryReporter.ts)。原理由：标题不以 ID 开头即报错、同一 ID 出现在两个文件即报错，注册表用 `--list` 从测试声明重建；它证明的是“声明覆盖”，skip／fixme 的测试仍算已声明，不证明实际执行。本次核读：L23–72 确认注册表路径、`--list` 重建、Subsystems 校验与不匹配报错；未逐行定位“同一 ID 两个文件”的错误文本，保留为候选说明。
- **上游 `utils/lint_tests.js`**：[原始链接](https://github.com/microsoft/playwright/blob/1b9b602724484df3ebc41aba77824fdfaba861f6/utils/lint_tests.js)。原理由：lint 阶段以 `--list --forbid-only` 跑三类测试并挂 `registryReporter`，新增测试没配 ID 或注册表未更新就过不了 `npm run flint`，把“加场景”固化成有编号的登记动作。本次核读：L23–31 确认三个 `execSync` 都用 `--list --forbid-only`，其中只有 `npm run test` 显式挂 `registryReporter.ts`；`ttest` 与 `test-mcp` 的 npm 脚本没有该 reporter 参数，其各自配置是否内置 reporter 本次未核，不能笼统写成“三类都挂”。

### 第 12 组：安装失败与并行打包竞态（P1，2 条）

- **PR #100062（2026-10-13 合并）**：[原始链接](https://github.com/vercel/next.js/pull/100062)。原理由：release commit 上约 58 个 job 因 `@next/env`／`@next/eslint-plugin-next` 新版本尚未发布而安装失败（npm notarget 等），修法是 CNA 测试也从 `NEXT_TEST_PKG_PATHS` 的本地 tarball 装兄弟包；说明测试默认可能落到 registry，但这里表现为安装失败而非静默测错，数字为作者自报。本次核读：正文确认“约 58 个 job”、四类包管理器错误文本、`@next/eslint-plugin-next` 缺 `pack-for-isolated-tests` 的根因；合并页面显示 119 checks passed，未独立复现。
- **PR #100118（2026-10-13 合并）**：[原始链接](https://github.com/vercel/next.js/pull/100118)。原理由：作者自报经常遇到并行测试同时 pack 覆盖 `packed.tgz`，pnpm 报“incorrect header check”；修复给 pack 加仓库级文件锁。它证明本地打包产物是共享可变文件，隔离安装不自动保证打包阶段无竞态。本次核读：正文确认并行 pack 互相覆盖、`incorrect header check`、8 个包同时打包；文件锁实现未逐行展开。

### 第 13 组：playwright-python 的执行面与一次性诊断（P1，3 条）

- **`.github/workflows/ci.yml`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/.github/workflows/ci.yml)。原理由：矩阵覆盖 3 个 OS × chromium／firefox／webkit × 多 Python 版本，sync 与 async 必须分成两个 pytest 进程（同一进程混跑会假失败），并单列 wheel 安装与 common 测试步骤，说明“固定测试接回 CI”的具体成本与形态。本次核读：L124–145 确认先 `python -m build --wheel`，再分别跑 `tests/common`、`tests/test_reference_count_async.py`、`tests/test_installation.py`、`tests/sync`、`tests/async`；L142 注释确认 async 在 sync 失败后仍执行、两套各自报告。
- **`tests/test_installation.py`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/tests/test_installation.py)。原理由：把构建出的 wheel 装进全新 venv、装浏览器、跑客户端脚本并断言生成 PNG，目标是“发布的那份东西能用”；但断言只有文件存在，属浅层冒烟，不能当功能验收。本次核读：L28–58 确认 venv、wheel 安装、`playwright install`、运行 `client.py`，唯一断言是 `(tmp_path / f"{browser_name}.png").exists()`。
- **`tests/test_reference_count_async.py`**：[原始链接](https://github.com/microsoft/playwright-python/blob/5306360397109b09704cf87ea611f3b74f79a368/tests/test_reference_count_async.py)。原理由：issue #2977 的修复固化成“统计 `_Callback` 对象、增量 ≤5”的断言，属“临时诊断→固定可数断言”的直接样本；但它是 python-only 测试，注册表检查不覆盖，删除或跳过不会被发现。本次核读：L93 标注 issue #2977；L103 统计 `_Callback` 实例；L137–138 确认 `final_count - initial_count <= 5`。

### 第 14 组：roll PR 的证据形态（P1，2 条）

- **PR #3286（2026-10-22 合入）**：[原始链接](https://github.com/microsoft/playwright-python/pull/3286)。原理由：把上游新增的 DD-028、HA-113、SS-095 与若干改动移植进 async／sync 成对文件，并把 HE-015 在 headed Chromium 的失败归因为旧驱动同样失败、非本次回归（作者自报，未复现，未说明 CI 是否也失败）。本次核读：正文确认新增／更新测试编号与 HE-015 的归因原句；未核旧驱动对照是否在 CI 复现。
- **PR #3289（2026-10-22 开，10-23 合入）**：[原始链接](https://github.com/microsoft/playwright-python/pull/3289)。原理由：正文把 Chromium sync/async 套件 7,764 passed、173 skipped、12 expected failures 分开列出；能被看见，但没有机制阻止跳过项增长，说明“全绿”仍需人读跳过与 xfail 清单。本次核读：正文数字与 Chromium 限定逐字确认；`lint.sh` 的注册表检查只保证“声明覆盖”，不检查 skip／xfail 数量，候选的判断成立。

### 第 15 组：上游 Playwright 的构建前提（P2，3 条）

- **上游 `.github/actions/run-test/action.yml`**：[原始链接](https://github.com/microsoft/playwright/blob/1b9b602724484df3ebc41aba77824fdfaba861f6/.github/actions/run-test/action.yml)。原理由：composite action 在跑任何测试前依次执行 `npm ci`、`npm run build`、安装浏览器；CI 侧的“构建新鲜”是有步骤保证的，与本地依赖 watch 的约定不是一回事。本次核读：L36–48 确认 `npm ci`、`npm run build`、`npx playwright install --with-deps` 顺序执行。
- **上游 `tests/config/browserTest.ts`**：[原始链接](https://github.com/microsoft/playwright/blob/1b9b602724484df3ebc41aba77824fdfaba861f6/tests/config/browserTest.ts)。原理由：测试从 `packages/playwright-core/lib/coreBundle` 导入而非源码，所以本地不跑 build／watch 时测的是旧 `lib/`——这是 AGENTS.md“Assume watch is running”背后的可核机制，也是唯一会静默测错对象的地方。本次核读：L22 确认 `import { utils } from '../../packages/playwright-core/lib/coreBundle'`；是否“唯一”静默点未穷举，保留为候选判断。
- **上游 `AGENTS.md`**：[原始链接](https://github.com/microsoft/playwright/blob/1b9b602724484df3ebc41aba77824fdfaba861f6/AGENTS.md)。原理由：明写“Assume watch is running and code is up to date”，且 `ctest`／`test` 等脚本本身不含构建步骤；文档把新鲜度交给开发环境，没有可执行校验——需与上一条 CI 构建步骤分开引用。本次核读：L45–48 确认 watch 建议与“Assume watch is running and code is up to date”；测试脚本本身不含构建，沿用候选说明，未逐个脚本打开核对。

## 对现有验证页的增量（只列可用的选择与反例）

1. **先问“被测对象是哪份”。** 是本次检出的源码、上一次构建留下的 `dist`、已发布版本／预览 tarball，还是已有部署？Next.js 的三份入口（本地 tarball、`NEXT_TEST_VERSION`、`NEXT_TEST_DEPLOY_URL`）与 Playwright 的驱动 zip 命名，给出了可照做的区分方式。页面可在“按承诺取证”表前加一句：不能说明当前构建身份时，先补这一步，再谈断言。
2. **能断言就别只写前提。** `@next/env` 来源检查、`DRIVER_VERSION == NEW_COMMIT`、重跑生成器后 diff 必须为空，都是把“应该是最新构建”变成失败信号的具体做法。不是每个项目都值得自建同等机制；当项目已有独立构建产物、驱动或生成文件时，优先做一条。
3. **多 worktree／多 Agent 并发时，服务身份要单独固定。** 专用端口、`--strictPort`、禁用 `reuseExistingServer`，并保留一个“占住端口”的复现输入。只改端口而不禁用复用，仍可能连到别人的服务；只禁用复用而不固定端口，仍可能静默漂移。
4. **区分一次性和持续。** 一次性人工验收留下的是“当时跑过”的叙述；要变成回归，需要固定的测试文件、明确的纳入规则（如 deploy manifest 的 include）和 CI 触发。Next.js 的“新测试自动纳入 deploy 子集、PR 跑 3 次 dev／3 次 start／1 次 deploy、release 测已发布版本”是三种不同对象的边界，不能互相替代。
5. **报告与门禁的强度要写对。** PR 正文给出 Chromium 套件 3,831／3,933 与一次重试通过，是可用证据；但同一 PR 页面显示 21/29 checks passed，就不能写成“全部通过”。skip／xfail 要单列，数量没有门槛时仍要人读。
6. **反例规则：** 对错误的一半做门禁等于假 all-clear；对已删除字符串的 grep 永远通过，门禁要自证还能失败；截图前必须等业务状态，截错状态比不截更糟。

不建议从本清单直接推出的：所有项目都上 registry／roll 流程、都自建驱动包，或把 `NEXT_SKIP_ISOLATE` 一类调试开关当默认配置。它们绑定特定仓库的产物形态，本仓未试用。

## 覆盖缺口与未核项

- **中文社区反馈未检索。** 任务允许在缺少中文原帖时列缺口；本单元只读公开 GitHub 原文，未检索中文讨论，因此没有中文来源可写。
- **未运行。** 所有 Next.js、Playwright、hathor、google-meet-clone 的机制均为源码／文档／PR／提交原文，未在本机安装、构建、跑测试或部署；任何“绿了”“失败数”“耗时”都是上游自报，不是本次复现。
- **Next.js #98330／#98353**：正文与配置已核，但“修后是否在所有模式下都装本地包”“作者是否只跑了两个 suite”没有独立执行记录。
- **hathor**：#126 最终 33 个变更文件（文件页扩展名统计与 GitHub API 均为 33，完整列表见第 4 组条目），`playwright.config.ts` 确实不在其中；页面 Copilot 审阅快照的 25/25、31/32 是较早版本的计数，不是最终总数。当前 main 的配置已按 `3d09b66` 核对，但未运行该套件。
- **playwright-python**：注册表本次按行计得 4,944 条 ID，与候选的 4,936 差 8 条，差异未查；`check_test_registry.py` 的“132 个 python-only 测试函数”未逐函数计数；PR #3292 的 8 项未展开检查状态未知。
- **google-meet-clone**：`668b3f8`、`9d76537` 的提交日期已从页面 embedded JSON authoredDate 确认为 2026-07-15（分别为 18:29:15+0530、18:55:57+0530）；`check-dist.ts` 的“20 个 fake 名称泄漏”来自提交说明，本次只读说明原文、未复跑构建；仓库无 CI 工作流，所有“CI 会失败”的说法都是作者反事实假设。
- **范围限制**：按任务要求未重读 VS Code 两份 Skill、未重搜 pstack／OpenHands／Hypertask／cursor-plugins，也未续跑旧 Skill／模型采集、CI exact reader 与并行审查来源卡。本清单不覆盖这些方向。

## 探索回执

- **渠道**：GitHub 公开页面（PR、issue、commit、blob、workflow、manifest）；未使用账号、代理或搜索摘要补写。
- **读取范围**：候选清单 41 个链接逐一请求，均返回 200；另按候选指引核对了同页引用的 `get-test-filter.js` 注释与 hathor 后续 PR 页面，并用 GitHub REST API 核对提交 authoredDate、PR `changed_files` 与文件列表（未把新链接写入本清单）。关键文件按固定提交逐行核对，行号与文内一致处已在各条注明；未能逐行确认的细节标为“未核”。
- **日期**：候选清单标注的核实日多为 2026-10-27～10-28；本次整理与复核为 2026-10-29 UTC。原始发生日按 PR／issue／提交页面记录，未能取得提交日期的已注明。
- **成品边界**：共 41 个外部链接，全部来自给定清单；不含本机路径、私人会话、凭据或内部地址。结论只覆盖原文能支持的主张，未做本仓试用，不宣布采用或提效。
