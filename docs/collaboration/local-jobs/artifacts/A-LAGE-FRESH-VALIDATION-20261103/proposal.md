# 缓存命中不等于本轮新执行：中断后的恢复选择

> 候选稿，2026-11-03 核实。只读公开材料；未运行 FURN、Lage 或模型，未清任何缓存，未改 15／verification／研究页／模板／13／TASKS，未推送。实现结论只绑定 Lage 2.14.19（任务给定对应 `microsoft/lage@dbbbe63`，该提交 `packages/lage/package.json` 的 `version` 为 `2.14.19`）与 FURN 的公开记录。

## 1. 给 15 §6 的最小补充稿

**落点**：`docs/15-task-playbooks.md` §6，接在“先核本次选中了相关消费者测试，再考虑新增选测”段（base_ref `f2617375` 的第 375–377 行）之后、`<a id="vitest-reused-worker-env">` 段之前。这是补充段，现有两句保留、不替换；块内不新增本仓相对链接，外部来源用固定提交的绝对链接，可直接粘入。

```markdown
**要求“最终目标图须新执行”时，先核缓存来源，再选整轮无缓存重跑或独占缓存清理；普通重跑绿灯不代表上次未执行的任务已经执行。**

- `--no-cache` 只停本轮缓存读写，不删历史条目；`--reset-cache` 只跳过本轮读取，跑完后仍会写回条目，未覆盖的旧条目也仍在。一次无缓存运行中断后直接普通重跑，仍可能用旧条目跳过中断时未执行的任务。
- 默认再跑一次完整 `--no-cache` 到结束，不碰任何缓存，按运行摘要核 success（执行通过）与 skipped（worker 缓存命中，或 runner 判定任务不适用，如包内无该脚本／`shouldRun=false`）；failed／pending（未运行）／aborted（中断未完成）都表示没有通过。只有本地缓存可丢弃、独占且确认没有远端回填时，才先 `lage cache --clear`（项目可能封装为 `yarn clean-lage-cache`）再普通重跑；这次若又失败，修复后重跑同一普通命令，清理后已通过的任务复用新结果，未执行的任务没有条目会真正执行。
- `cacheStorageConfig`、`BACKFILL_CACHE_PROVIDER` 或 `BACKFILL_CACHE_PROVIDER_OPTIONS` 可让本地 miss 后继续查远端并回填本地。`--skip-local-cache` 的 CLI 帮助称 CI 默认开启，但固定版本里 `.default(isCI)` 把环境变量字符串当默认值，使用处又做 `=== true` 严格比较，不能依赖该自动跳过；显式传 `--skip-local-cache` 或设 `LAGE_RUN_SKIP_LOCAL_CACHE` 才会生效，CI 里本地缓存仍可能参与。存在这些配置或无法确认时，清本地不能保证没有远端命中；不要删共享缓存或替他人关远端，改用完整无缓存重跑，或换成确认不带远端缓存配置／凭据的隔离环境。
- 用运行摘要判断“跑没跑”，不用 `Cache Cleared` 的成功输出代替；默认摘要不区分本地／远端命中，要分项时看 `--log-level silly` 的 `local cache fetch`／`remote fallback fetch`，工具没给出的分项不补。这是任务调度层的执行：`cache:false` 或自带增量的任务（如 `tsc -b`）即使被调用也可能跳过内部重算；清缓存只删工作区 `node_modules/.cache/lage` 下 `cache`／`logs` 的条目，不清 TypeScript 增量状态和其他构建产物。

**何时不适用**：没有“新执行”要求时保留增量缓存；旧缓存未被证明错误、只是不能满足这次口径时，不写成缓存失效 bug 或产品缺陷；只读评审／计划不需要构建。

**依据**：[一手：固定源码与 E2E 定义] [Lage 2.14.19 的 worker 缓存读写实现](https://github.com/microsoft/lage/blob/dbbbe63b20790302c1c7022de3011fae7eb4257e/packages/scheduler/src/workers/targetWorker.ts#L61-L112)、[`SimpleScheduler.ts` L283–296](https://github.com/microsoft/lage/blob/dbbbe63b20790302c1c7022de3011fae7eb4257e/packages/scheduler/src/SimpleScheduler.ts#L283-L296)与[`NpmScriptRunner.ts` L48–55](https://github.com/microsoft/lage/blob/dbbbe63b20790302c1c7022de3011fae7eb4257e/packages/runners/src/NpmScriptRunner.ts#L48-L55)（`shouldRun=false` 走 `onSkipped`，同样计入 skipped）；[一手：作者记录] [FURN R07](https://github.com/microsoft/fluentui-react-native/blob/41768dacc889222444c538ce6031fe668f06043f/agent-improvements-plan.md#L111-L125)与[修订后的 R-VALID-003](https://github.com/microsoft/fluentui-react-native/blob/4f45ad9bfdc3abf6a3428d92073353551bfeec12/references/agents/repository/development.md#L24-L28)；[一手：作者自报] [PR #4371](https://github.com/microsoft/fluentui-react-native/pull/4371)（171／0 跳过／0 失败无原始日志）；核实 2026-11-03。
```

## 2. 四个问题的逐源回答

**① 无缓存运行失败后，普通重跑绿灯为什么不证明全图已新执行？**

`--no-cache` 在 v2.14.19 里把 `options.cache` 置 false，调度器以 `shouldCache: false` 传给 worker。worker 的 `getCache()` 在 `!shouldCache` 时直接返回 `hash: undefined`，既不向主线程取哈希、也不 `fetch`；`saveCache()` 因 hash 为空直接返回，所以本轮既不读也不写。历史条目完全没被删除，后续普通运行对同一任务与输入算出同一哈希，仍会命中。作者记录正对应这条路径：首次 `--no-cache` 因格式失败，81 个任务未执行；修复后普通运行显示 164 个缓存命中，其中就包括这 81 个从未在无缓存轮执行过的任务；再跑一次完整 `--no-cache` 才执行并通过全部 171 个任务。旧 R-VALID-003 原文正是 `It bypasses and resets the Lage cache`，这是 Agent 把旁路当清理的直接来源；修订提交已改为只描述 bypass，并另设 `clean-lage-cache`。

`--reset-cache` 也不是删除：`getCache()` 仅在 `!shouldResetCache` 时 `fetch`，跳过读取后照样执行并 `put`，覆盖不到的条目仍在。文档把它写成“recreate the cache from scratch”，不能按这句推断它清了全部条目。

**② 清本地缓存后，能否保证没有远端命中？**

不能。`lage cache --clear` 只遍历工作区 `node_modules/.cache/lage` 下的 `cache` 和 `logs` 两个目录并删条目；它不调用远端存储的 clear。若 `cacheStorageConfig` 或 `BACKFILL_CACHE_PROVIDER`／`BACKFILL_CACHE_PROVIDER_OPTIONS` 存在，后续普通运行在本地 miss 后仍会查远端，命中后把结果回填本地，任务照旧标记为跳过：`RemoteFallbackCacheProvider.ts` L35–45 在远端命中后调用 `localCacheProvider.put`，`remote-cache.md` L11 也明确写命中后填本地。官方 E2E（`packages/e2e-tests/src/remoteFallback.test.ts` L97–142，断言在 L133–139）在只读模式冷启动下只断言 `local cache fetch`、`remote fallback fetch`、`local cache put` 出现且 `remote fallback put` 不出现（用 `.find`，不校验顺序），未 seed 远端、未断言远端命中／回填／顺序；`local cache put` 也可来自执行后的普通写入（`RemoteFallbackCacheProvider.ts` L51–61），所以该用例不能证明回填。回填分支由单元测试 `packages/cache/src/__tests__/RemoteFallbackCacheProvider.test.ts` L132–176 用 mock 覆盖（local fetch=false、remote fetch=true → `localCacheProvider.put` 被调用），但仍不是真实远端或清缓存后的端到端验证。另需注意 `--skip-local-cache`：帮助文本称 CI 默认开启，但 2.14.19 的默认值是 `process.env.CI || process.env.TF_BUILD` 字符串，`createCacheProvider` 用 `skipLocalCache === true` 判断，字符串默认值不会生效；显式传 `--skip-local-cache` 或设 `LAGE_RUN_SKIP_LOCAL_CACHE` 才会变成 true（`options.ts` L93–103 给每个选项绑定 `LAGE_*`；Commander 9.5.0 对布尔 env 只看是否定义，`false` 也按 true），不要把 CI 当作本地缓存不参与。

只读 `lage.config.mjs` 不能证明作者进程没有远端配置：环境变量可直接提供 provider（`createCacheProvider.ts` L19–20）。`remote-cache.md` 让用户把 `BACKFILL_*` 写进 `.env`（L25–62），L102 又称 lage 会用 dotenv 读取，但 2.14.19 的依赖树没有 dotenv／backfill-utils-dotenv（Lage 仓库 `yarn.lock` 无该条目；`backfill-config` 6.7.1 只依赖 `backfill-logger`、`find-up`、`pkg-dir`），其 `getEnvConfig` 只读 `process.env`；`.env` 需由 shell／CI 显式导出。可确认的是环境变量能直接提供 provider，不能据此推断作者进程已读取 `.env`。本次没有、也不应读取作者或当前用户的环境。

**③ 171／0 与“旧缓存失效”各由什么证据支持？**

171 个任务、0 跳过、0 失败只有作者自报：PR #4371 的验证表与计划末段两处一致（修订提交说明只描述做法，没给计数），但没有原始运行日志或可独立读取的 CI 工件，不能称本仓复算、已复现或工具提效。旧缓存是否“失效”没有被任何来源证明：条目按当时的哈希命中，属于缓存的设计行为；作者记录只证明这些命中不能替代本轮“每个任务都实际执行”的验收口径，不证明缓存内容错误或产品有 bug。记录中的 164／81 也只有作者叙述，没有逐任务清单。

**④ 没有“新执行”要求时，是否该清缓存？**

不该。普通迭代应保留增量缓存；清理会破坏共享的暖缓存，让其他人的运行变慢，还会掩盖真正的缓存失效问题。只有验收明确要求最终目标图新执行，且缓存由本次运行独占、可丢弃时，清理才是有条件的选择；证据已足够时也不额外加这道门禁。

## 3. 固定源码与作者回执

| 核对项 | 固定来源 | 实际结论 |
|---|---|---|
| 版本 | FURN `e769e6d` 的 `yarn.lock` 第 18584–18586 行；`microsoft/lage@dbbbe63` 的 `packages/lage/package.json` | `lage@npm:^2.14.19` 解析为 `2.14.19`；该提交自身版本号亦为 `2.14.19` |
| 选项映射 | `packages/cli/src/commands/options.ts` L43–50；`packages/cli/src/commands/run/runAction.ts` L78–105 | `--no-cache` → `cache=false`；`--reset-cache` → `resetCache=true`；显式传 `--skip-local-cache` 或设 `LAGE_RUN_SKIP_LOCAL_CACHE` 时为 true（`addEnvOptions` L93–103；Commander 9.5.0 的 `_parseOptionsEnv` 对布尔 env 只看是否定义），CI 自动默认在固定源码中不生效（`.default(isCI)` 存环境变量字符串，`skipLocalCache === true` 严格比较失败）；三者分别作为 `shouldCache`／`shouldResetCache`／`skipLocalCache` 传入调度器 |
| 本轮读写 | `packages/scheduler/src/workers/targetWorker.ts` L61–112 | `!shouldCache`：不取哈希、不 `fetch`、不 `put`；`shouldResetCache`：跳过 `fetch`，执行后仍 `put` |
| 摘要状态 | `packages/scheduler/src/categorizeTargetRuns.ts` L3–22；`packages/scheduler-types/src/types/SchedulerRunSummary.ts`；`packages/scheduler/src/SimpleScheduler.ts` L283–296；`packages/runners/src/NpmScriptRunner.ts` L48–55；`packages/scheduler/src/WrappedTarget.ts` L121–133 | 运行按 `success`／`skipped`／`failed`／`pending`／`aborted` 等状态分列；`skipped` 大多来自 worker 的缓存命中，也可能来自 `runner.shouldRun()` 返回 false 的不适用任务（包内无该任务脚本或 `target.shouldRun=false`），两者都进入同一 `skipped` 计数；`skipped` 因此不能单独当作缓存命中数，`pending`／`queued`／`aborted` 都表示未运行或未完成；`aborted` 非空时 `results` 已为 `failed` |
| 清理范围 | `packages/cli/src/commands/cache/clearCache.ts` L13–38；`packages/cache/src/providers/BackfillCacheProvider.ts` L94–128；`packages/cache/src/getCacheDirectory.ts` L3–13 | `--clear` 调 `clear()`→`purge(0)`，只删 `<workspace>/node_modules/.cache/lage/{cache,logs}` 下的条目 |
| 远端回填 | `packages/scheduler/src/cache/createCacheProvider.ts` L19–42；`packages/cache/src/providers/RemoteFallbackCacheProvider.ts` L27–48；`packages/e2e-tests/src/remoteFallback.test.ts` L97–142；`packages/cache/src/__tests__/RemoteFallbackCacheProvider.test.ts` L132–176 | 配置或 `BACKFILL_CACHE_PROVIDER[_OPTIONS]` 启用远端；本地 miss → 远端 fetch → 命中则回填本地（`RemoteFallbackCacheProvider.ts` L35–45）；E2E（L97–142）在只读模式冷启动下只断言 `local cache fetch`／`remote fallback fetch`／`local cache put` 出现且 `remote fallback put` 不出现（`.find`，不校验顺序），未 seed 远端、未断言命中／回填／顺序，不能证明回填；回填分支由 `RemoteFallbackCacheProvider.test.ts` L132–176 用 mock 覆盖（remote fetch=true → `localCacheProvider.put`），但不是真实远端或端到端验证 |
| 文档与源码差异 | `docs/docs/guides/cache.md`；`docs/docs/reference/cli.md` L137/L151；`docs/docs/guides/remote-cache.md` L11 | 指南把 `--reset-cache` 说成“from scratch”；CLI 参考说 `--clear` “Clears the cache locally”；远端指南用 `LAGE_WRITE_REMOTE_CACHE`，源码判断的是 `LAGE_WRITE_CACHE`。参数名和文档措辞都不能单独当语义证据 |
| 作者记录 | `agent-improvements-plan.md` L111–125（`41768dac`） | 首次无缓存失败 81 个未执行；普通重跑 164 命中含这 81 个；再次完整无缓存执行 171 个并通过 |
| 修订 | 提交 `e769e6d`（2026-10-15T06:28:29Z） | 新增 `clean-lage-cache: lage cache --clear`；R-VALID-003 由“`--no-cache` bypasses and resets the Lage cache”改为“先清缓存再普通 `buildci`”；同步 AGENTS.md、`references/agents/repository/development.md` 和 5 个 Skill 文件 |
| 回执 | PR #4371，2026-10-15T15:08:41Z 合入 `4f45ad9` | 验证表：`yarn clean-lage-cache` 后 `yarn lage buildci --grouped` 为 171 tasks／0 skipped／0 failed；作者自报，无原始日志 |

FURN 的 `lage.config.mjs` 还把 `root-build` 等任务设为 `cache: false`，并注明“tsc project level build has its own caching”。所以即使任务计数是 171／0／0，也只覆盖 Lage 任务层，不等于 TypeScript 每个 project 都重新编译。

## 4. 选择分支

| 情况 | 选择 | 判定依据 |
|---|---|---|
| 没有“最终目标图须新执行”的要求 | 保留增量缓存，不清 | 普通迭代以缓存可信为前提；清理只会伤共享暖缓存 |
| 有要求；缓存共享、远端存在或未知；CI | 再跑一次完整 `--no-cache` 到结束，或放到确认不带远端缓存配置／凭据的隔离环境 | 不碰任何缓存，也不依赖远端；按摘要核全部 success、0 个缓存命中跳过；若存在 `shouldRun=false`（或无该任务脚本）的不适用任务，先用 per-target 摘要／日志确认它们不是缓存命中，再要求 0 failed、0 pending、0 aborted（aborted 非空时 results 已为 failed） |
| 有要求；本地缓存独占、可丢弃，且确认无远端回填 | `lage cache --clear` 后普通重跑 | 清后未执行任务没有条目，会真正执行；已通过任务复用清理后的新结果 |
| 清理后普通重跑又失败 | 修复失败，再跑同一普通命令 | 清理后已通过的任务复用新结果；从未执行的任务无条目，会执行 |
| 有远端配置，仍要清本地 | 不能把清本地当新执行保证 | 远端仍可命中并回填；改用完整无缓存重跑，或确认不带远端缓存配置／凭据的隔离环境，不删共享缓存、不替他人关远端 |
| 只要读计划或评审 | 不需要构建，也不需要清缓存 | 没有执行要求 |

## 5. 现有缺口、去重与未验范围

- base_ref 的 15 §6 只覆盖选测与“代码未变跳过原生检查”的外层短路，没有任务级构建缓存的命中、清理与远端回填语义；verification 已有“按产品承诺选证据”和“摘要完整不等于测试已经执行”，但没有缓存命中与未执行任务的计数区分。本节补的是后一类，不改前两类，也不把 `skipped` 当 `failed`。
- base_ref 的 `docs/` 检索 `4371`、`clean-lage-cache`、`fluentui-react-native`、`Lage` 未发现同题正文或任务卡；本稿不重做 Next 构建身份、Biome 生成物、Vitest 环境与选测映射。
- 本稿只读固定提交的源码、单元测试与 E2E 定义及作者记录，没有运行 FURN／Lage，没有产生或清除任何缓存，也没有读取作者或当前用户的进程环境。因此不能判断 FURN 作者运行时是否配置了远端，也不能把 E2E 定义当作本机复现。
- 171／0 与 164／81 均为作者自报，无原始日志、逐任务清单或独立复算；旧缓存条目没有被证明错误。结论绑定 Lage 2.14.19，不推广到其他 runner 或后续版本。
- 没有修改 15、verification、研究页、模板、13 或 TASKS；未知的 15 旧写者仍保持隔离，等负责人接收后再落稿。

## 6. 来源

- [Lage 固定提交 `dbbbe63`](https://github.com/microsoft/lage/tree/dbbbe63b20790302c1c7022de3011fae7eb4257e)：选项、worker、清理、远端回填实现与 E2E 定义均按此提交读取；远端命中回填分支另见 `packages/cache/src/__tests__/RemoteFallbackCacheProvider.test.ts` L132–176（mock 单测）；核实 2026-11-03。
- [FURN 计划记录 `41768dac` L111–125](https://github.com/microsoft/fluentui-react-native/blob/41768dacc889222444c538ce6031fe668f06043f/agent-improvements-plan.md#L111-L125)：首次无缓存失败、普通重跑 164 命中、完整无缓存 171 执行；核实 2026-11-03。
- [FURN 修订提交 `e769e6d`](https://github.com/microsoft/fluentui-react-native/commit/e769e6d5304600daa4f3cb500dfaa58c73739fa2)：清理脚本、R-VALID-003 与 AGENTS／development／Skill 同步；提交时间 2026-10-15。
- [FURN PR #4371](https://github.com/microsoft/fluentui-react-native/pull/4371)：验证表与回执，2026-10-15 合入 `4f45ad9`；计数为作者自报。
- [FURN `development.md` @ `4f45ad9` L24–28、L58–60](https://github.com/microsoft/fluentui-react-native/blob/4f45ad9bfdc3abf6a3428d92073353551bfeec12/references/agents/repository/development.md#L24-L28)：修订后的 R-VALID-003 与 `--no-cache` 只保留旧条目的说明；核实 2026-11-03。
- [Lage 本地缓存指南](https://github.com/microsoft/lage/blob/dbbbe63b20790302c1c7022de3011fae7eb4257e/docs/docs/guides/cache.md)与[远程缓存指南](https://github.com/microsoft/lage/blob/dbbbe63b20790302c1c7022de3011fae7eb4257e/docs/docs/guides/remote-cache.md)：文档措辞与源码行为的差异按上表记录；核实 2026-11-03。
