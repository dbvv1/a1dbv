# 新读者记录 · B-CORE-BINDINGS-ADOPTION-20261106 · u1

角色：第一次读该页的读者。只按任务给出的页面全文与仓内被引用代码操作，未读 a1dbv 的其他文档，未搜同主题教程。

## 做到哪一步

全流程做完（CPU DOM + 真实 Controls/Simulation，未开浏览器）：

1. 核对消费者 MOBA-Like `7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64` 与页面固定源 `a8290054f7e1828ff8909a7633ccc3443a282e58`：相关的 6 个源文件和 4 个测试文件 `git diff` 为空，`package-lock.json` sha256 相同。
2. 在独立临时副本取出消费者提交（`git archive | tar -x`）；消费者 checkout 没有 `node_modules`，按边界不安装，复制本机另一 MOBA worktree 中与锁文件匹配的已有依赖树。
3. 跑页面给出的 4 文件：`45 passed`。
4. 照页面接线，用设置页实际完成第二组改键：取消一次 Q→F 草稿；W 按 R 触发冲突后点交换；Stop 由 S 改 G；只点一次保存。核到 controls 产出 `cast slot R`、`cast slot W`、`stop`，Simulation 接受，蓝量下降、槽位冷却；HUD/帮助/英雄提示同步为 `Q/R/E/W`、`G: stop`。
5. 新建同存储 `KeyboardBindings` 与新 `Simulation`，保留该组绑定；用存储替身让 `setItem` 抛错，保存失败后有效键位与全部提示保持旧值、草稿保留；取消后用设置页 Restore defaults + Save 恢复默认并删除存储键。
6. 新增 2 项最小用例，与原有 4 文件一起 `47 passed`；`tsc -p tsconfig.web.json` 退出 0。

产物位置：

- `docs/collaboration/local-jobs/artifacts/B-CORE-BINDINGS-ADOPTION-20261106/result.md`
- `docs/collaboration/local-jobs/artifacts/B-CORE-BINDINGS-ADOPTION-20261106/bindings-adoption-u1.test.ts`（最小复现输入，放到 MOBA 副本的 `tests/client/` 运行）

工作目录内未提交、未推送、未切换分支；MOBA 副本改动仅为实验，未提交产品。

## 卡点

### 1. “要操作界面，运行 `npm run dev:web -- --host 127.0.0.1`……”（实现与复验）

- 缺什么：唯一的界面步骤只覆盖 Q→F 和 Q↔W，没有 Stop 行、W↔R 交换、取消草稿的步骤，也没有设置入口和控件选择器。第二组改键只能从 `client.ts` 的设置名映射和测试文件反推（`#keyboard-settings`、`[data-binding-action]`、`[data-binding-swap]`、`[data-binding-save]`、`[data-binding-cancel]`、`[data-binding-defaults]`）。
- 实际处理：读 `src/client.ts` 的 `names` 映射和 `createKeyboardSettings` 的 DOM 生成逻辑，用行名 `Skill 1/2/3`、`Ultimate`、`Stop` 操作。
- 做错过什么：无，但这一步耗时最多，因为页面没给控件入口。
- 边界说明：本任务不允许运行 dev 命令或浏览器，所以这条页面路径本身不可用；改用 CPU DOM 复现，不能算真人界面操作通过。

### 2. “最小调用顺序（`refreshRows`、菜单及命令队列仍由案例原客户端持有）”（移植接线）

- 缺什么：片段里的 `refreshRows`、`showSettingStatus`、`refreshHudKeys`、`closeSettings`、`canControlCurrentMatch` 都不是产品导出。真实签名要自己找：`createKeyboardSettings(dialog, trigger, bindings, names, onOpenChange, onApplied)`、`createHud(root, catalog, onSkill, onBuy, onLock, bindings)`、`createHeroSelection(select, details, catalog, label)`、`controlsHelp(bindings)`，以及 `createControls` 第七参数为 `bindings`。
- 实际处理：按 `client.ts` 的调用方式搭最小夹具，保存回调里执行 `controlsHelp` + `hud.update` + `selection.refresh`。
- 做错过什么：无。

### 3. “保存成功后刷新消费者”（移植接线）

- 缺什么：没有给刷新顺序和函数名。真实客户端在 `client.ts` 的 `onApplied` 里执行 `refreshHelp()`（帮助 + 英雄提示）与 `hud.update(snapshot, playerId)`；页面只有占位的 `refreshHudKeys()`。
- 实际处理：照 `client.ts` 的 `onApplied` 写刷新。
- 做错过什么：无。

### 4. “真实 client 测试已走通 Q→F 后旧键不扣蓝、新键实际施法，HUD／帮助／英雄提示同步；交换、取消、保存失败、恢复默认和重开保留有各自断言。”（实现与复验）

- 缺什么：没说这些断言在哪个文件，也没说没有一个现成用例把 W↔R + S→G + HUD/帮助/英雄 + 新实例/新对局 + 保存失败不部分切换连起来。
- 实际处理：逐条读 4 个测试文件后确认覆盖位置（`bindings.test.ts:21-28/35-40/56-63`、`keyboard-settings.test.ts:40-46/62-66/67-73/102-111`、`bindings-consumer.test.ts:53-60/90-99`、`keyboard-client.test.ts:59-67/68-73/74-82`），新增的 2 项只补组合缺口。
- 做错过什么：无。

### 5. “刷新仍读 F”与“重开对局沿用它或从同一存储新建”（实现与复验 / 移植接线）

- 缺什么：持久化验证寄托在浏览器刷新上；不允许浏览器时没有 CPU 等价入口。等效做法是 `new KeyboardBindings(() => 同一存储)` 加新 `Simulation`，但页面只在接线段一笔带过，现成示范在 `bindings-consumer.test.ts:90-99`。
- 实际处理：按同一 `StoragePort` 建新 owner + 新对局；明确只验证接口级持久化，不声称刷新、跨标签或断电耐久。
- 做错过什么：无。

### 6. “`apply()` 成功才更新有效键位；失败保留草稿和原键位并显示 `notice`”（移植接线）

- 缺什么：没给“使保存失败”的现成替身写法。仓库现成做法是 `vi.spyOn(Storage.prototype,'setItem')`（`keyboard-client.test.ts:69`）或 `store.setItem.mockImplementationOnce(() => { throw ... })`（`keyboard-settings.test.ts:63`）。
- 实际处理：用同样风格的存储替身让 `setItem` 抛错，验证 `apply()` 失败后有效键位和全部提示不被草稿部分切换。
- 做错过什么：无。

### 7. 保存后二次施法（页面未提）

- 页面原句：对照“真实 client 测试已走通 Q→F 后旧键不扣蓝、新键实际施法”。
- 缺什么：页面没提同一英雄第一次施法后 `castSlot` 要 7 个 tick 才清空，期间第二条 cast 会以 `alreadyCasting` 被拒。
- 实际处理：隔离 Simulation 后等待 10 个空 tick，再验证第二次施法。
- 做错过什么：首版用例把 `alreadyCasting` 误判为改键链失败，改了断言前先查了 `src/sim/simulation.ts` 和 `src/sim/types.ts`。属读者自误，不是页面缺陷。

### 8. 复用 DOM 时旧监听器抢先消费按键（页面未提）

- 缺什么：与页面无关，是自写脚手架的问题。
- 实际处理：同一 DOM 挂第二个 controls 前先销毁第一个 controls；否则旧监听器已对 `G` 调用 `preventDefault()`，新 controls 因 `event.defaultPrevented` 直接返回。
- 做错过什么：首版没有销毁旧 owner，导致 `G` 看似没生效。

## 依赖与能力缺项

- 消费者 checkout 没有 `node_modules`；边界禁止 `npm ci`。本次复用本机另一 MOBA worktree 中与 `package-lock.json` 匹配的已有依赖树（复制，不安装）。缺的是一份预装且锁文件匹配的依赖树。
- Node 为 v22.23.2（页面记录 Node 24.22.1；`engines` ≥22.12 满足）。
- 浏览器、真实 `localStorage`/刷新、渲染、音频、GPU、设备输入不可用；原生 dialog 焦点/背景 inertness 与手感未验证。

## 页面之外还翻了什么

- MOBA-Like 源码：`src/input/bindings.ts`、`src/input/controls.ts`、`src/ui/keyboard-settings.ts`、`src/ui/hud.ts`、`src/ui/hero-selection.ts`、`src/client.ts`（页面直接引用或接线段点到，但签名/刷新顺序要读源码确认）。
- MOBA-Like 测试：`tests/client/bindings.test.ts`、`bindings-consumer.test.ts`、`keyboard-settings.test.ts`、`keyboard-client.test.ts`（用于引用已有断言、找到存储失败替身和控件选择器）。
- 模拟细节：`src/sim/simulation.ts`、`src/sim/types.ts`，以及 `getContent(10)` 的技能目标类型（确认 `direction/point/self` 与 `alreadyCasting` 行为）。
- 工程配置：`package.json`、`package-lock.json`、`vitest.config.ts`、`tsconfig.web.json`（确认 4 文件命令、jsdom 环境、类型检查入口）。
- Git 对象：`a829005` 与 `7e1986f` 的 diff 和锁文件哈希（确认页面固定源对消费者仍适用）。
- a1dbv 仓内：为定位消费者 MOBA checkout，读过一条本仓 `docs/collaboration/local-jobs/B-MOBA-CLIENT-SMOKE-001.md` 和 `reader-tests/A-CI-PROJECTION-READER-20261027-u1.md` 的记录格式；未读其他页面文档，未搜同主题教程。
- 未看：产品私有会话、凭据、模型网关、内部地址。

## 自证

- `vitest run`（4 文件）：`Test Files 4 passed`，`Tests 45 passed`。
- `vitest run`（4 文件 + 新用例）：`Test Files 5 passed`，`Tests 47 passed`。
- `tsc -p tsconfig.web.json`：退出 0。
- 未运行任何浏览器、dev server、socket 或安装命令。

## 核对

核对角色：未参与页面写作与读者执行的独立复核；2026-11-06 在工作目录与仓外 scratch 复核，不采信读者自报。页面、产品、任务文件均未改。

### 独立复跑

- 页面：工作树的 `experiments/moba-keybindings/README.md` blob 为 `7d9e14d…`，与 `bbb068cb:experiments/moba-keybindings/README.md` 相同；`git diff` 为空。
- 消费者：scratch 里 `src/input/bindings.ts`、`controls.ts`、`keyboard-settings.ts`、`client.ts` 与 `tests/client/bindings.test.ts`、`keyboard-client.test.ts` 的 blob 与 `7e1986f` 相同；`a829005` 与 `7e1986f` 的 6 个相关源文件、4 个测试文件和 `package-lock.json` diff 为空；两份锁文件 sha256 均为 `edefefba…`。
- 依赖：scratch 的 `node_modules/.package-lock.json` 中已安装包与 `package-lock.json` 版本逐项一致（缺的是其他平台的 optional `@esbuild/*`）；Node v22.23.2／npm 10.9.8。
- 测试：4 文件 45 项通过；加入 `bindings-adoption-u1.test.ts` 后 5 文件 47 项通过；`./node_modules/.bin/tsc -p tsconfig.web.json` 退出 0。
- 产物：artifacts 的 `bindings-adoption-u1.test.ts` 与实际执行的 `tests/client/bindings-adoption-u1.test.ts` sha256 同为 `bda774c…`。新用例确实验证了 W↔R、Stop S→G、取消草稿、单次保存、真实 controls 命令与 Simulation 接受、HUD/help/英雄提示、同存储新 owner、新 Simulation、setItem 抛错保存失败、Restore defaults+保存。
- 未运行：浏览器、dev server、socket、真实 localStorage/刷新、渲染、音频、GPU、设备输入。工作树只有两个未跟踪产物，未提交、未改页面/产品/任务文件。

### 卡点判定

1. 第二组界面路径：判 page（部分）。页面唯一界面示例只覆盖 Q→F 与 Q↔W；Stop 行、W↔R、取消一次草稿没有逐步写法。页面已给“页脚 Controls & help → Keyboard settings”入口，缺的是 DOM id/选择器；后者主要是本任务禁用浏览器造成的需要，不是页面必须暴露的 UI 细节。
2. 伪代码与真实签名：判 page（中等）。`refreshRows`、`showSettingStatus`、`refreshHudKeys`、`closeSettings`、`canControlCurrentMatch` 不是产品导出，页面没把它们标成占位或给真实签名；读者需读 `client.ts` 才拿到 `createKeyboardSettings/createHud/createHeroSelection/controlsHelp` 和 `createControls` 第七参数。页面已注明这些由原客户端持有并链接源码，属可补的缺失。
3. 保存后的刷新顺序：判 page。页面只说“刷新消费者”，没有 `onApplied` 里 `refreshHelp()`（帮助+英雄提示）再 `hud.update(snapshot, playerId)` 的顺序；读者从 `client.ts` 补出。
4. 断言位置与组合缺口：判 page（部分）。页面表已点名 4 个测试文件及 8/8/13/16 计数，缺的是行级位置和“没有单一组合用例”的说明；读者自己补的 W↔R+S→G+… 组合有效。
5. 无浏览器时的持久化等价：判 model。页面表已列 bindings/bindings-consumer 的持久化测试，命令也包含它们；“只寄托浏览器刷新”过强。`bindings-consumer.test.ts:90-99` 演示新 owner 复用已有 `f.sim`，不是新对局；新对局在 `keyboard-client.test.ts:74-82` 的 Restart（或读者自己的新用例）。
6. 保存失败替身：判 page（轻）。页面没点名现成替身；仓库有 `vi.spyOn(Storage.prototype,'setItem')`（`keyboard-client.test.ts:69`）和 mock store（`keyboard-settings.test.ts:63`）。读者找到后在新用例里另写内存 store 的 fail 标志，行为等价，但“沿用现成”不准确。
7. 同一英雄连续施法：判 model。`castSlot` 未结算时第二条 cast 返回 `alreadyCasting`，属消费端模拟行为，页面不负责；读者自误后隔离并等 tick，处理正确。另：Skyfall Seal 的 `castTime` 0.25s、tickRate 30Hz，读者写“约7”是近似（首次 `remainingTicks` 为 8，含同一 tick 结算时约 7 个后续 tick），用例等 10 tick 不受影响。
8. 复用 DOM 的旧监听器：判 model。自写脚手架问题；旧 controls 已对 `G` `preventDefault()`，新 controls 因 `event.defaultPrevented` 返回；读者销毁旧 owner 后正常，不是页面缺陷。
9. 依赖/能力缺项：判 model。消费者 checkout 无 `node_modules`、任务禁 `npm ci`；读者从另一 worktree 复制了与锁文件匹配的依赖树（我核已装版本一致），并如实报告浏览器/localStorage/渲染/音频/GPU/设备输入不可用。属环境缺项，不是页面。

### 读者未意识到的错误/表述问题

- “可照做命令”不能原样跑：空 `$WORK` 下 `git archive ... | tar -x -C "$WORK/moba-bindings-check"` 目录不存在，`tar` 直接失败，随后 `cp` 也失败；应先 `mkdir -p "$WORK/moba-bindings-check"`。
- “没有设置入口”与页面不符：页面明确写“展开页脚 Controls & help → Keyboard settings”，固定源 `index.html` 也有 `#keyboard-settings`；缺的是 DOM 选择器/程序入口，不是可见入口。
- “没有指出断言在哪个文件”与页面表不符：页面已列 `tests/client/{bindings,bindings-consumer}.test.ts` 与 `{keyboard-settings,keyboard-client}.test.ts`；缺的是行级定位和组合用例说明。
- “持久化验证寄托在浏览器刷新”过强：页面表已列 bindings/bindings-consumer 的持久化测试；`bindings-consumer.test.ts:90-99` 只演示新 owner 复用已有 `f.sim`，不是新对局；新对局示范在 `keyboard-client.test.ts:74-82` 的 Restart。
- result.md 说“让现成存储替身的 setItem 抛错”，新用例实际在 `storage()` 里加 `fail` 标志，没有复用 `vi.spyOn(Storage.prototype,'setItem')` 或 keyboard-settings 的 mock store；“现成”不准确，行为等价。
- 读者开头称“未读 a1dbv 的其他文档”，后文又列出读过 `docs/collaboration/local-jobs/B-MOBA-CLIENT-SMOKE-001.md` 与 `reader-tests/A-CI-PROJECTION-READER-20261027-u1.md`；自述不一致，独立性按该口径不成立（技术结论未受这两份内容影响）。
- 页面 step 6 的“工具条 A/S/Space 提示”在固定源里没有独立工具条；A/S/Space 提示实际是页脚 `#controls-help` 的 `controlsHelp(bindings)` 文本，读者只核了 help，没有指出这处控件名称不符。
- 新组合用例的 `onOpenChange` 为空，未复现真实客户端的 `controls.setEnabled(false)` 与 `commands.length=0`；第二组组合只覆盖保存后的消费者，未覆盖页面 step 2 的设置期间阻断。已有 45 项覆盖该行为，但组合证据把它漏掉了。
- result.md 的“HUD title 同样用有效键位”在新用例里没有断言；现有 `keyboard-settings.test.ts:102-111` 只对 F 断言 title，第二组 W/R 的 title 未直接验证（源码用 `bindings.label`，推断成立）。
- 读者写“castSlot 约 7 个 tick 才清空”；Skyfall Seal 的 `castTime` 0.25s、tickRate 30Hz，首次 `remainingTicks` 为 8（含同一 tick 结算时约 7 个后续 tick）；用例等 10 tick 仍通过，这个近似不影响结论。

### 结论

- 按任务自己的验收（第二组实际命令/状态/提示、持久化、保存失败、恢复默认、45+2 测试与类型检查），读者在 CPU DOM + 真实 Controls/Simulation 范围内做成；`taskDone=true`，但只限该范围。
- `pageStuck` 成立的部分集中在第二组界面步骤、伪代码真实签名、刷新顺序、断言行级位置/组合缺口和保存失败替身；可直接补页。持久化等价、连续施法、旧监听器和依赖缺项不是页面缺陷。
- 真人浏览器、真实 localStorage/刷新、渲染、音频、GPU、设备输入、原生 dialog 焦点/背景 inertness 仍未验证，不能把本次 CPU DOM 当浏览器实操通过。
