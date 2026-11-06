# B-CORE-BINDINGS-ADOPTION-20261106 · 第二次真实改键的结果

**状态：taskDone（仅 CPU DOM + 真实 Controls/Simulation）。** 页面把“一个绑定对象串起设置、输入、HUD、帮助和英雄提示”的契约写对了；第二组改键按页面可完成，未发现契约错误。页面卡点集中在“第二次改键的可照做入口与完整参数”没有写出；另有本机依赖与浏览器边界缺项。CPU DOM 不是浏览器实操，本结果不外推为真人操作通过。

## 结论

- 在独立临时副本里照页面完成第二组改键：先做一次草稿再取消；W 与 R 经冲突提示后点交换；Stop 由 S 改 G；只点一次保存。
- 保存后 `controls` 实际产出 `{type:'cast',slot:'R'}`、`{type:'cast',slot:'W'}` 和 `{type:'stop'}`；两个技能都被同一 Simulation 接受，蓝量下降、对应槽位进入冷却。
- HUD 技能按钮、`controlsHelp`、英雄选择提示同时读有效键位（`Q/R/E/W`、`G: stop`）；技能槽身份仍是 Q/W/E/R，能力名称与图标不变。
- `new KeyboardBindings(() => 同一存储)` 加新 `Simulation` 保留该组绑定。`setItem` 抛错时 `apply()` 失败，有效键位、HUD/帮助/英雄提示保持旧值，草稿保留；取消后草稿回到有效值；经设置页 **Restore defaults → Save & apply** 恢复默认并删除存储键。
- 现有 4 文件 45 项全过；新增 2 项最小用例后合计 47 项全过；`tsc -p tsconfig.web.json` 退出 0。
- **明确未做：** 浏览器、dev server、socket、真实 `localStorage`/刷新、渲染、音频、设备手感、原生 dialog 焦点/背景 inertness。未改 MOBA 产品、未提交。

## 版本与依赖

- 消费者：MOBA-Like `7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64`。
- 页面固定源：`a8290054f7e1828ff8909a7633ccc3443a282e58`。
- 两版本在本卡相关的 6 个源文件（`src/input/bindings.ts`、`src/input/controls.ts`、`src/ui/keyboard-settings.ts`、`src/client.ts`、`src/ui/hud.ts`、`src/ui/hero-selection.ts`）和 4 个测试文件上 `git diff` 为空；`package-lock.json` 的 sha256 相同。页面的固定源对当前消费者仍适用。
- 本机 Node v22.23.2 / npm 10.9.8（页面记录的是 Node 24.22.1；`engines` 要求 ≥22.12，不构成失败）。
- 消费者 checkout 没有 `node_modules`。按任务边界不执行 `npm ci`、不重装依赖；改用本机另一 MOBA worktree 中与上述锁文件匹配的已有依赖树，复制到临时副本。这是能力/依赖缺项，不是页面问题。

## 可照做命令

`$WORK` 是读者自备的空临时目录，`$MOBA` 是 MOBA-Like checkout，`$DEPS` 是与 `package-lock.json` 匹配的已有依赖树（直接使用，不安装）。

```sh
git -C "$MOBA" archive 7e1986f1ca2f05f07124d34fa9fdcbd3f33bfe64 | tar -x -C "$WORK/moba-bindings-check"
cp -r "$DEPS/node_modules" "$WORK/moba-bindings-check/node_modules"

cd "$WORK/moba-bindings-check"
./node_modules/.bin/vitest run tests/client/bindings.test.ts tests/client/bindings-consumer.test.ts tests/client/keyboard-settings.test.ts tests/client/keyboard-client.test.ts
# 最小新用例：把本目录的 bindings-adoption-u1.test.ts 放到 tests/client/ 后运行
./node_modules/.bin/vitest run tests/client/bindings-adoption-u1.test.ts
./node_modules/.bin/tsc -p tsconfig.web.json
```

预期：第一条 4 文件 45 项通过；新用例 2 项通过；`tsc` 退出 0。

## 第二次改键的实际证据

操作路径（全部走设置页 DOM，不写 JSON、不插内部字段）：

1. 打开设置，选 Q 行按 `F` 形成草稿，点 **Cancel**：`bindings.value` 仍为默认，存储键不存在，按 `F` 加左键不产生命令、蓝量不下降。
2. 选 W 行按 `R`：状态显示 `R is already used by Ultimate`，草稿未变。
3. 点 **Swap Skill 2 and Ultimate**：草稿变为 `{W:'R', R:'W'}`。
4. 选 Stop 行按 `G`：草稿 `stop:'G'`，行文本分别显示 `R`/`W`/`G`。
5. 点一次 **Save & apply**：写入的完整字节为 `{"version":1,"bindings":{"Q":"Q","W":"R","E":"E","R":"W","attackMove":"A","stop":"G","focusCamera":"Space"}}`。

保存后的消费者证据：

| 检查 | 结果 |
|---|---|
| 物理 `W` | `setTargeting('R')`，提示以 `W Skyfall Seal` 开头；左键产出 `{type:'cast',slot:'R'}`，Simulation `accepted:true`，蓝量下降，`cooldown.R > 0` |
| 物理 `R` | `setTargeting('W')`，提示以 `R Slipstream` 开头；左键产出 `{type:'cast',slot:'W'}`，Simulation `accepted:true`，`cooldown.W > 0` |
| 物理 `S` | 不再产生任何命令（旧停止键失效） |
| 物理 `G` | 产出 `{type:'stop'}`，Simulation `accepted:true` |
| HUD | 四个技能按钮文本依次以 `Q`、`R`、`E`、`W` 开头；`title` 同样用有效键位 |
| 帮助 | `controlsHelp` 含 `Q/R/E/W then left-click` 与 `G: stop` |
| 英雄提示 | 选择框 `title` 含 `R: Slipstream` 与 `W: Skyfall Seal` |

新存储实例 + 新对局：`new KeyboardBindings(() => 同一存储)` 的 `value` 等于保存值；新 `Simulation` 起始 `tick === 0`，按 `G` 仍是 `{type:'stop'}`，HUD/帮助仍显示交换后的键位。

存储失败：让现成存储替身的 `setItem` 抛错后，在设置里把 Q 改成 F 并点保存——对话框保持打开，状态含 `Could not save keyboard settings`；`value.Q` 仍为 `Q`、`draft.Q` 为 `F`，其余有效键位不变。重新 `hud.update`/刷新帮助/英雄提示后仍显示 `Q/R/E/W`、`G: stop`（没有被草稿部分切换）。取消后草稿回到有效值；按 `F` 不产生命令、蓝量不降，按 `Q` 仍施放 Q。

恢复默认：重新打开设置点 **Restore defaults**（此时有效值仍是第二组），再点 **Save & apply**：`value` 回到默认，存储键被删除，帮助变回 `Q/W/E/R`，按 `S` 产出原来的 `{type:'stop'}`。全程没有直接改存储 JSON 或插入内部字段。

## 首次卡点

### 页面卡点（pageStuck，缺完整参数/入口）

1. **“要操作界面，运行 `npm run dev:web -- --host 127.0.0.1`……”（页面“实现与复验”段）**
   缺什么：唯一的界面操作步骤只教 Q→F 和 Q↔W，没给 Stop 行、W↔R 交换、取消一次草稿的步骤；也没有设置入口和控件的 DOM 标识（`#keyboard-settings`、`[data-binding-action]`、`[data-binding-swap]`、`[data-binding-save]`、`[data-binding-cancel]`、`[data-binding-defaults]`、`[data-binding-status]`）。第二组改键要自己从 `client.ts` 的设置名映射（`Stop`/`Attack-move`/`Lock camera`）和测试选择器反推。
2. **“最小调用顺序（`refreshRows`、菜单及命令队列仍由案例原客户端持有）”**
   缺什么：片段里的 `refreshRows`、`showSettingStatus`、`refreshHudKeys`、`closeSettings`、`canControlCurrentMatch` 都不是产品导出；页面没给真实签名。实际要自己找到 `createKeyboardSettings(dialog, trigger, bindings, names, onOpenChange, onApplied)`、`createHud(root, catalog, onSkill, onBuy, onLock, bindings)`、`createHeroSelection(select, details, catalog, label)`、`controlsHelp(bindings)`，以及 `createControls` 第七参数就是 `bindings`。
3. **“一个 bindings 对象接设置、controls、技能按钮、英雄提示和帮助；保存成功后刷新消费者”**
   缺什么：没有给“刷新消费者”的具体顺序。真实客户端是在 `onApplied` 里执行 `refreshHelp()`（帮助 + 英雄提示）和 `hud.update(snapshot, playerId)`；页面只给了占位名 `refreshHudKeys()`。
4. **“真实 client 测试已走通 Q→F 后旧键不扣蓝、新键实际施法，HUD／帮助／英雄提示同步；交换、取消、保存失败、恢复默认和重开保留有各自断言。”**
   缺什么：没有指出这些断言在哪个文件、也没有说明没有一个现成用例把“W↔R + S→G + HUD/帮助/英雄 + 新实例/新对局 + 保存失败不部分切换”放在一起。读者要么自己拼测试，要么在 4 个文件里逐条找。实际覆盖位置见下节。
5. **“刷新仍读 F”与“重开对局沿用它或从同一存储新建”**
   缺什么：页面把持久化验证寄托在浏览器刷新上；在不允许浏览器的边界下没有给 CPU DOM 的等价入口。等效做法是 `new KeyboardBindings(() => 同一存储)` 加新 `Simulation`，但页面只在接线段一笔带过，现成示范在 `tests/client/bindings-consumer.test.ts:90-99`。
6. **“`apply()` 成功才更新有效键位；失败保留草稿和原键位并显示 `notice`”**
   缺什么：没给“使保存失败”的现成替身写法。仓库里现成做法是 `vi.spyOn(Storage.prototype,'setItem')`（`tests/client/keyboard-client.test.ts:69`）或 `store.setItem.mockImplementationOnce(() => { throw ... })`（`tests/client/keyboard-settings.test.ts:63`），页面未点名。
7. **保存后二次施法**
   不属于页面契约错误，但页面没提：同一英雄第一次施法后 `castSlot` 要 7 个 tick 才清空，期间第二条 cast 会以 `alreadyCasting` 被拒绝。CPU 用例若不复核这条，容易把正常的模拟节拍误判成改键没接上。

### 能力/依赖缺项（不是页面问题）

- 消费者 checkout 没有已安装依赖；任务边界禁止 `npm ci`。缺的是一份与 `package-lock.json` 匹配的已装依赖树；本次用本机另一 MOBA worktree 的现有依赖补齐。
- 浏览器、真实 `localStorage`/刷新、渲染、音频与设备输入在本任务不可用。持久化只用同一 `StoragePort` 接口的内存实现验证；“刷新后仍保留”和跨标签/断电耐用性仍未验证。
- 原生 dialog 焦点与背景 inertness、真实键盘布局与手感仍待人工判断。

## 已有断言引用（不重复覆盖）

- `tests/client/bindings.test.ts:21-28` 新 owner 重新读取已持久化绑定；`:35-40` 冲突必须显式 swap；`:56-63` 写入/重置失败保留有效值与旧存储字节。
- `tests/client/keyboard-settings.test.ts:40-46` 冲突提示 + swap 按钮；`:62-66` 保存失败保留有效值和草稿；`:67-73` 默认只在 apply 后生效并删除覆盖；`:102-111` HUD/帮助/英雄提示读实际键位。
- `tests/client/bindings-consumer.test.ts:53-60` attack-move/stop/镜头改键进入原命令并被 Simulation 接受；`:90-99` 持久化 owner 与新对局、默认恢复。
- `tests/client/keyboard-client.test.ts:59-67` 真实客户端里的移动/停止/镜头改键与默认恢复；`:68-73` 客户端内保存失败保留旧控件；`:74-82` 重开保留已保存键位。
- 缺口：以上没有一条把 W↔R、S→G、设置页取消防草稿、一次保存、HUD/帮助/英雄、全新 owner/新对局、保存失败不部分切换连成一个第二次改键场景。本次新增的 2 项只补这组组合，不替代原有断言。

## 做错过的

- 首版新用例在 R 施法后立刻施放 W，得到 `accepted:false, reason:'alreadyCasting'`，先误判为改键链失败；隔离 Simulation 后发现是原施法尚未结算，等待 10 个空 tick 后通过。绑定链本身正确。
- 首版复用同一个 DOM 挂第二个 controls 前没有销毁第一个 controls；第一个 keydown 监听器已对 `G` 调用 `preventDefault()`，第二个 controls 因 `event.defaultPrevented` 直接返回，导致 `G` 看起来没生效。改为先销毁旧 owner 再挂新 owner。两者都是读者自写脚手架的错误，不是页面缺陷。

## 未运行 / 待人工

- 浏览器与 `npm run dev:web`、socket、GPU、音频设备：未运行。
- 真实浏览器刷新后的 `localStorage` 持久化、跨标签冲突、断电耐久：未验证。
- 原生 dialog 焦点/背景 inertness、实际设备手感：未验证。
- 完整套件、构建与发布流程：未运行，本卡只覆盖 4 文件 45 项 + 2 项最小新用例 + 网页类型检查。
