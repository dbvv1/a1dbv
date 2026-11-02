# A-GENERIC-MOBA-FIT-20261102 · 通用模板到 MOBA 帧同步／存档的最小映射

## 结论

**下一次 MOBA 帧同步／存档自然任务不需要引入 `templates/generic/` 正文。** 目标仓现有 `AGENTS.md` 已覆盖项目、真实命令、结构、确定性和验收；`CLAUDE.md` 只有 `@AGENTS.md`，再复制导入不算增量。真正值得考虑的只有三处小补充：单个测试入口、按任务指向 `docs/local-save.md`／`docs/brief.md` 的导航、以及仅在引入 AI 评审时才需要的极简 `REVIEW.md` 片段。其余模板内容与目标项目不适配或已有规则覆盖。

本文件是只读适配映射，**没有**修改 MOBA-Like，**没有**运行 `npm ci`、测试、模拟、构建、smoke 或游戏，也**不表示**任何模板已被采用。

目标仓**已有**存档与本机帧同步接入，所以下面给的是现有接入的入口和边界，不是待实现需求。

**现有范围**：存档只在本浏览器同源 Web Storage，单页持有保存权，面向 1v1 单机、最长 20 分钟、最多 24,000 条玩家命令；帧同步部分是本地稳定席位信封与 CLI／capture 回放，不是联网同步。当前主页 `index.html` 已加载 `/src/client.ts`（v11），含本机 Continue 与稳定席位 next-tick 输入（README L3、`tests/client/default-entry.test.ts`）；`/legacy-v10.html` 才走冻结的 `default-src/client.ts`（contentVersion=10）。采用入口覆盖主页（`src` 客户端及其续玩）、CLI 与 capture 会话；`legacy-v10.html` 的 `default-src` 冻结入口不在采用范围。`docs/brief.md` L167 的“默认玩法入口不切换”是 `9777b840` 时点的表述，`0a1d60b` 已把 v11 提为主页，引用时需注明这一差异。
**明确缺口（不要借模板扩需求）**：没有房间、匹配、账号、云同步、网络等待队列、预测回滚或反作弊；同版本本地重放一致不等于跨浏览器确定性。模板不提供这些能力，本映射也不据此新造框架。

## 一、最小映射：任务 → 实现／测试入口 → 必要检查 → 不能覆盖的规则

目标仓没有 `.github/`，即**没有托管 CI**；现有门禁就是 `AGENTS.md` 的命令与验收、`package.json` 脚本和 `vitest.config.ts`。下表中的命令均来自这些文件，只有标注“派生、未运行”的细粒度测试命令是按 npm／vitest 透传推导的。

| 任务 | 实现入口 | 现有测试入口 | 必要检查 | 不能覆盖的规则 |
|---|---|---|---|---|
| 改存档格式、解码、恢复或检查点 | `src/save/match.ts` 的 `decodeMatchSave`、`LocalMatch`、`restoreMatch`；`src/save/storage.ts` 的 `createSaveSlot` | `tests/save/match.test.ts`、`tests/save/storage.test.ts` | `npm test`；涉及页面续玩时再跑 `npm run smoke`（已含 `build:web`） | 只接受 formatVersion 1／2 且 `compatibilityId` 精确匹配；未知格式、坏数据、复演哈希不符都保留旧字节，不修复、不改规则迎合旧档；检查点只含已消费的玩家命令；存档上限 `MAX_SAVE_CHARS`／36,000 tick／24,000 命令；DOM、音频、设置、身份和凭据不进入存档 |
| 改稳定席位输入信封 | `src/sim/simulation.ts` 的 `inputSeats`、`commandFrame`、`frameCommands`、`step`；`src/sim/command-frame.ts` 的 `validFrameCommand` | `tests/command-frame.test.ts`、`tests/replay.test.ts` | `npm test`；改动触及模拟规则／数值／AI 时按 `AGENTS.md` 跑 `npm run sim -- --games 200 --seed 1`；构建用 `npm run build` | 信封 tick 必须是当前 tick + 1；所有席位都要出现，无操作显式空数组；席位按 team-major／roster-slot 固定，不按到达顺序；同席位内 move→stop 次序保留；同内容重试只执行一次，冲突、缺席、错归属、多字段、过期／未来 tick 整批拒绝且不改状态、事件或随机源；历史回放仍可读裸命令流 |
| 改回放或 CLI 对局 | `src/sim/runner.ts` 的 `runBotMatch`、`replayMatch`；`tools/sim.ts` | `tests/replay.test.ts`、`tests/command-frame.test.ts` | `npm test`；`npm run sim -- --games 200 --seed 1`；`npm run build` | 回放 formatVersion 1／2 与 `inputProtocol: stable-seats-v1` 的兼容不能无故抬版；同种子加同命令序列必须同终局哈希；旧内容版本和旧回放按记录解释，不重排历史输入 |
| 改存档兼容 ID 或构建指纹 | `tools/save-compatibility.ts` 的 `saveSourceFingerprint`、`saveCompatibility`；`vite.config.ts` 的 `__MOBA_SAVE_COMPATIBILITY__` | `tests/save/compatibility.test.ts`、`tests/save/envelope-legacy-compatibility.test.ts` | `npm test`；`npm run build:web`（构建期计算 ID） | 指纹只覆盖 `src/sim`、`src/content` 和 `package-lock.json`，UI 变化不应使旧档失效；只有经过固定旧档验证的精确源码版本可保留旧 ID，绝不自动更新兼容表；缺 `package-lock.json` 直接失败 |
| 改客户端续玩、保存面板或锁 | `src/save/browser.ts`、`src/save/ownership.ts`、`src/client.ts` | `tests/client/save-lifecycle.test.ts`、`tests/client/save-ownership.test.ts` | `npm test`；`npm run smoke`（含 `build:web`） | 同一时刻只允许一个页面持有保存权；第二页仍可游玩但不写存档、不抢占保存权；完整恢复成功后才创建表现／输入层，不能让两处各推进一次 `Simulation.step`；重开销毁旧编辑器、监听和输入所有者；DOM 测试不等于真实浏览器、焦点、布局或手感通过 |

**细粒度测试入口缺口**：`AGENTS.md` 只给全量 `npm test`，没有单个测试命令。按现有脚本可推导 `npm test -- tests/save/match.test.ts`（npm 把参数透传给 `vitest run`，`vitest.config.ts` 的 include 为 `tests/**/*.test.ts`），但目标仓没有把它写成命名脚本，本次也未运行；采用前需 B 实际试跑。

## 二、不适用项：不要整份或逐段照搬

| 模板内容 | 判断 | 理由 |
|---|---|---|
| `AGENTS.md` 的项目、命令、架构、约定、Git/PR 占位骨架 | 不合并 | MOBA 已有真实项目说明、命令表、结构、验收和发布规则；模板里是 TODO 和通用示例，会与 `package.json`／`AGENTS.md` 现有入口重复或冲突 |
| `AGENTS.md` 的“先按项目指令查已有 Skill／MCP” | 不合并 | 目标仓树内没有 `.claude/skills`，也没有 MCP 配置；照抄会指向不存在的入口 |
| `AGENTS.md` 的通用“新增依赖前说明理由”“批量转换用脚本” | 暂不合并 | 与本次帧同步／存档任务无直接关系，现有代码和提交约定已能覆盖；没有失败场景证明需要写进根指令 |
| `AGENTS.md` 的“验证”节（先确认相关检查、行为改动先跑最小相关基线、修 bug 保留失败用例、不为通过删断言） | 部分承接／暂不合并 | “先确认相关检查入口、行为改动先跑最小相关基线”由片段 1 的单个测试入口承接；“保留失败用例、不删断言”是通用测试纪律，目标仓验收未明确写出，标为暂不合并、另行评估；其余不整节照搬 |
| `CLAUDE.md` 的 Claude 专属流程（Plan、`/spec-interview`、`/handoff`、`task-decisions`） | 不合并 | 目标仓的 `CLAUDE.md` 只有 `@AGENTS.md`；引用目标仓不存在的 Skill 会形成悬空入口。Claude 的通用行为也不应替代 `AGENTS.md` 的领域契约 |
| `REVIEW.md` 的 TODO 占位、“Always check”里的 `TODO: repo-specific invariants` | 不合并 | 目标仓没有 `REVIEW.md`，也没有 AI 评审入口；未填的 TODO 不能当规则。若将来引入 AI 评审，只借证据栏和下方最小片段 |
| 模板的 `@AGENTS.md` 导入 | 不合并 | 目标仓 `CLAUDE.md` 第 1 行已经是 `@AGENTS.md`。再次复制导入不是增量，也不能算本轮采用 |
| 通用 CI、lint、格式化和“全部测试”示例 | 不合并 | 目标仓没有 `.github/`、lint 或 formatter 脚本；不要为凑栏目新增假门禁。现有 `npm test`／`build`／`smoke`／`sim` 才是真实入口 |

## 三、可选最小合并片段（供 B 审选，未落地）

### 片段 1：在 `AGENTS.md` 命令表补一行单个测试

```markdown
| `npm test -- tests/save/match.test.ts` | **单个测试（优先用这个）**；例：存档回归 |
```

理由：按目标 `AGENTS.md` 现有 `| 命令 | 作用 |` 表的列序追加一行。现有表只有全量 `npm test`，而存档／帧同步任务的回归集中在少数文件，先跑最小集能缩短反馈。命令是派生入口，需 B 先试跑并确认 `vitest run` 接受该文件过滤；不覆盖 `npm test` 的合入门槛。

### 片段 2：在 `AGENTS.md` 结构或开头补一行任务导航

```markdown
- 改存档／续玩：先读 `docs/local-save.md`；改输入信封或回放：先读 `docs/brief.md` 的“输入信封：稳定席位与下一逻辑帧”（回放入口见 `src/sim/runner.ts`）。
```

理由：`AGENTS.md` 的结构节已有 `src/sim/` 等，但没有列 `src/save/`，也没有把做这类改动先读哪份契约文档写成入口。该片段只加导航，不复制 `docs/local-save.md` 的兼容规则，也不改变现有验收。

### 片段 3：可选 `REVIEW.md` 的最小评审规则（仅在 MOBA 开始用 AI 评审时）

```markdown
## What Important means here

Reserve Important for findings that break saved-match compatibility, replay
determinism, input-seat ordering, or a rollback path. Style and naming are Nit.

## Evidence bar

- Every behavior claim cites `file:line` in the source.
- Save, replay, or command-envelope changes must name the failing test or
  fixture and state whether historical bytes and hashes stay unchanged.
```

理由：借 `REVIEW.md` 的证据栏和 Important 定义，补上目标仓没有的评审入口；不照搬其中的 TODO、“最多五条 Nit”、生成文件排除等与当前单维护者流程无关的模板段落。没有 AI 评审需求时不要新建此文件。

### 不建议的合并

- 上述片段只改指令或评审入口，不改变 `src/save`、`src/sim`、测试或兼容 ID 的行为、范围和验收契约；不能拿它们替代存档、帧同步和回放的既有规则。
- 不新增 `AGENTS.md` 的完整“推进与撤回”“禁区”“坑”章节；现有 `AGENTS.md` 的“负责与发布”“验收”“写作”已经足够，扩写会稀释确定性和兼容契约。
- 不把模板的“全部测试”“类型检查／Lint”照抄成目标仓命令；目标仓有 `npm test` 与 `npm run typecheck:web`（`npm run build:web` 已包含后者），没有 lint／formatter 脚本；不要照抄模板的 TODO 行或新增假门禁。
- 不把 `templates/generic/CLAUDE.md` 整份复制到 MOBA；当前 `@AGENTS.md` 是正确形态，Claude 专属内容若需要，应按真实任务另加，不引入悬空 Skill 路径。

## 四、已有规则覆盖、无需改动

- **项目与结构**：`AGENTS.md` 已写明本仓是 a1dbv 的作品案例、`src/sim/` 确定性模拟、`src/render/`／`src/ui/`／`src/input/` 只读模拟、`assets/` 来源与许可要求。
- **命令与验收**：`AGENTS.md` 已有 `npm ci`／`npm run dev`、`npm run build`、`npm test`、`npm run sim -- --games <N> --seed <S>`、`npm run smoke`，以及自动、浏览器、品质三层验收；`docs/brief.md` 的“合入门槛”进一步规定模拟层 200 局和回放哈希。
- **存档契约**：`docs/local-save.md` 已写开发接缝、格式 1／2、兼容 ID、旧字节保留、每 10 秒模拟时间保存和 Web Locks；`src/save/*` 与 `tests/save/*` 是实际实现和回归。
- **输入信封契约**：`docs/brief.md` 的“输入信封：稳定席位与下一逻辑帧”已写 next tick、全席位、席内次序、原子拒绝和历史回放；`src/sim/simulation.ts`、`src/sim/command-frame.ts` 和 `tests/command-frame.test.ts` 落实。
- **共享指令形态**：`CLAUDE.md` 已是 `@AGENTS.md`；a1dbv 的共享指令页也记录了 MOBA 在 `9777b840` 的真实采用链（规则 → 实际接线 → 回归与前后对照），不需要再复制导入或另建第二份正文。
- **汇报与发布**：`AGENTS.md` 已要求只写实际跑过的结果、没跑的写“未验证”，并规定 `main` 随时可玩、自测通过即合入。模板的通用汇报段落对本次任务没有必须新增的内容；固定三段式汇报可以作为可选习惯，但不能替代本仓的验证要求。

## 五、固定源码链接与核对范围

模板输入固定为 a1dbv `ac16eea5`：

- [templates/generic/AGENTS.md](https://github.com/dbvv1/a1dbv/blob/ac16eea5bd1cb3e46e8676173a2c364a09474868/templates/generic/AGENTS.md)
- [templates/generic/CLAUDE.md](https://github.com/dbvv1/a1dbv/blob/ac16eea5bd1cb3e46e8676173a2c364a09474868/templates/generic/CLAUDE.md)
- [templates/generic/REVIEW.md](https://github.com/dbvv1/a1dbv/blob/ac16eea5bd1cb3e46e8676173a2c364a09474868/templates/generic/REVIEW.md)
- [共享指令页](https://github.com/dbvv1/a1dbv/blob/ac16eea5bd1cb3e46e8676173a2c364a09474868/docs/decisions/instruction-files.md)

目标固定比较版本为 MOBA-Like `dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c`：

| 用途 | 固定链接 |
|---|---|
| 项目约定、命令、结构、验收 | [AGENTS.md](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/AGENTS.md#L11-L38) |
| Claude 入口 | [CLAUDE.md](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/CLAUDE.md#L1) |
| 脚本、依赖版本、单测配置 | [package.json](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/package.json)、[vitest.config.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/vitest.config.ts) |
| 存档解码、检查点、恢复 | [src/save/match.ts L49-L118](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/src/save/match.ts#L49-L118) |
| 存档存储与单写者 | [src/save/storage.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/src/save/storage.ts#L9-L39)、[src/save/ownership.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/src/save/ownership.ts#L1-L43) |
| 稳定席位与输入信封 | [src/sim/simulation.ts L223-L278](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/src/sim/simulation.ts#L223-L278)、[src/sim/command-frame.ts L9](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/src/sim/command-frame.ts#L9) |
| 回放与 CLI | [src/sim/runner.ts L26-L120](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/src/sim/runner.ts#L26-L120)、[tools/sim.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/tools/sim.ts) |
| 兼容 ID 指纹 | [tools/save-compatibility.ts L5-L34](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/tools/save-compatibility.ts#L5-L34)、[vite.config.ts L8](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/vite.config.ts#L8) |
| 存档与输入契约文档 | [docs/local-save.md](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/docs/local-save.md)、[docs/brief.md 输入信封节](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/docs/brief.md#L159-L170) |
| 存档、帧、回放、客户端回归 | [tests/save/match.test.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/tests/save/match.test.ts)、[tests/save/envelope-legacy-compatibility.test.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/tests/save/envelope-legacy-compatibility.test.ts)、[tests/command-frame.test.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/tests/command-frame.test.ts)、[tests/replay.test.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/tests/replay.test.ts)、[tests/client/save-lifecycle.test.ts](https://github.com/dbvv1/MOBA-Like/blob/dea84c4fde58ec7ebb05dc0adae70f4ee2dce45c/tests/client/save-lifecycle.test.ts) |

**版本差异**：核对时 MOBA-Like `main` 已从固定比较版 `dea84c4` 前进到 `7710c4a`（fixed-resolution capture 与 camera／Q-W 旁置发布）。`git diff dea84c4 7710c4a` 显示 `AGENTS.md`、`CLAUDE.md`、`package.json`／`package-lock.json`、`vitest.config.ts`、`src/sim/*`、`src/save/*`、`tools/save-compatibility.ts`、`docs/local-save.md`、`docs/brief.md`、`tests/save/*`、`tests/command-frame.test.ts`、`tests/replay.test.ts`、`tests/client/save-ownership.test.ts` 未变；`src/client.ts`（+19/−12）与 `tests/client/save-lifecycle.test.ts`（+3/−2）已随 capture／camera 发布改动：后者把 `createWorld` 测试桩换成 `createPlayableWorld`，并补 `cameraFollowPolicy`／`MINIMUM_ACCEPTANCE_TICKS`，存档／续玩断言未改。因此上表命令、存档解码、输入信封与回放核心契约对当前 `main` 仍适用；第一节第 5 行的 `src/client.ts`／`save-lifecycle.test.ts` 入口需按当前 `main` 版本复核。**不能**把当前 `main` 的其他 UI／capture 变化算进本映射的验证范围。

**已有验证范围**：

- 只读源码核对：上述固定链接的文件、行号和入口均按 `dea84c4` 读取；未修改 MOBA 工作树，只 fetch 公开 `main` 用于确认版本差异。
- 默认入口核对：`dea84c4` 的 `index.html` 加载 `/src/client.ts`，`legacy-v10.html` 加载 `/default-src/client.ts`；README L3 写明主页 v11 含本机 Continue 与稳定席位 next-tick 输入，`tests/client/default-entry.test.ts` 断言同一入口与 `default-src/client.ts` 的 `contentVersion=10`。`docs/brief.md` L167 的入口表述由 `9777b840` 引入，`0a1d60b` 提主页时未同步。
- 命令核对：`package.json` 的 `scripts`、`AGENTS.md` 的命令表、`vitest.config.ts` 的 include 相互对应；目标树内没有 `.github/`，所以没有可核的 hosted CI。
- 未运行：`npm ci`、`npm test`、`npm run sim`、`npm run build`、`npm run build:web`、`npm run smoke`、任何游戏或浏览器。命令是否在真实环境通过未验证。
- 未采用：没有改 MOBA 任何文件或分支，没有向 B 发消息，没有把模板片段写入目标仓。
- 归属核对：已 fetch a1dbv `main` 与各负责人分支；除本任务的领取提交外，没有发现同题映射或在途实现。MOBA 侧只读固定版，未碰 dot-B 的其他工作。

## 六、实际采用还需要什么

1. **B 在下一项自然帧同步／存档任务中审选片段**，只合并与当次改动直接相关的部分；不要为采用模板另开任务或整份替换 `AGENTS.md`。
2. **实际试跑并记录**：若采用片段 1，先确认 `npm test -- tests/save/match.test.ts` 可用；若改存档，跑 `npm test`、相关 `tests/save/*`、`npm run build:web`，页面续玩变化再跑 `npm run smoke`；若改模拟规则，按 `docs/brief.md` 跑 `npm run sim -- --games 200 --seed 1`。
3. **非作者核对**：逐条确认候选片段没有覆盖 `docs/local-save.md`、`docs/brief.md` 和现有测试里的兼容、确定性、席位与验收规则；本映射的命令未实跑，不能算通过。
4. **回报实际省时／返工**：只有 B 在下一自然任务后回报，才能判断“减少重复查找”的预期是否成立；本文件不预填收益。
5. **采用后再改源文件**：片段只落在 MOBA 的真实任务提交里，并同步该任务的“当前结果”；不要在 a1dbv 另存一份 MOBA 指令副本，也不要把本映射当成已采用结论。

**已有规则覆盖、不需要改的项**：项目与结构、命令与验收、存档契约、输入信封契约、`CLAUDE.md` 的 `@AGENTS.md` 形态、汇报与发布，均见第四节。本次不需要修改 MOBA 的 `AGENTS.md`、`CLAUDE.md`、`docs/local-save.md` 或 `docs/brief.md`；只有 B 在真实任务中审选片段 1–3 时，才在该任务的提交里做对应的小幅更新。
