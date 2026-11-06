# MOBA 键位：配置真正进入原动作链

**给已有网页游戏加改键，复用一份动作绑定，把设置页、真实输入、HUD 和帮助一起接上。** MOBA-Like 已将 Q/W/E/R 技能、攻击移动、停止和镜头键接入原客户端；玩家选键、明确交换冲突、保存后返回原动作链，刷新后仍保留选择。适合单玩家键盘设置；手柄／多人沿 [04 原生输入路线](../../domains/game-dev/04-client-modules.md#input-production)。

## 实现与复验

**从已发布 main 的固定版本 [`a829005`](https://github.com/dbvv1/MOBA-Like/tree/a8290054f7e1828ff8909a7633ccc3443a282e58)取实现，不再从只有 CPU 接口的旧候选开始。** 需要 Node ≥22.12 和 npm；已有 MOBA checkout 可用独立 worktree 保留原改动。下列路径均相对该 worktree。

| 文件 | 接入职责 |
|---|---|
| `src/input/bindings.ts` | 唯一键位设置所有者：有效值／草稿、捕获、冲突、取消、默认与保存；导出 `KeyboardBindings`、`BINDING_ACTIONS`、`bindingLabel` |
| `src/input/controls.ts` | 既有输入消费者；第七参数接收该所有者，原 `skill`／`commandForCast`／`SimCommand` 不变；增加 `setEnabled` 供菜单交接 |
| `src/ui/keyboard-settings.ts` | `createKeyboardSettings` 生成操作行、冲突交换及保存／取消／默认；`controlsHelp` 生成实际键位帮助 |
| `src/client.ts`、`src/ui/{hud,hero-selection}.ts` | 一个 bindings 对象接设置、controls、技能按钮、英雄提示和帮助；保存成功后刷新消费者 |
| `tests/client/{bindings,bindings-consumer}.test.ts` | 8＋8 项绑定、持久化与 controls → 原命令 → Simulation 测试 |
| `tests/client/{keyboard-settings,keyboard-client}.test.ts` | 13＋16 项 CPU DOM 与真实客户端接线回归，含提示、新键施法及设置／重开；渲染、音频和平台 I/O 受控 |

在现有 MOBA checkout 执行；若目标目录已存在，使用另一个空目录名：

```sh
git fetch origin main
git worktree add --detach ../moba-keybindings-check a8290054f7e1828ff8909a7633ccc3443a282e58
cd ../moba-keybindings-check
npm ci
npx vitest run tests/client/bindings.test.ts tests/client/bindings-consumer.test.ts tests/client/keyboard-settings.test.ts tests/client/keyboard-client.test.ts
npm run typecheck:web
```

**预期是 4 个文件、45 项通过，网页类型检查退出 0。** 2026-11-03 在上述固定源上复跑通过，复用同锁文件的既有依赖、Node 24.22.1；没有重装依赖或重跑浏览器。真实 client 测试已走通 Q→F 后旧键不扣蓝、新键实际施法，HUD／帮助／英雄提示同步；交换、取消、保存失败、恢复默认和重开保留有各自断言。完整套件、构建与设备体验不由这组聚焦检查代替。

## 从第二组改键核完整消费者

要操作界面，运行 `npm run dev:web -- --host 127.0.0.1`，打开终端给出的地址，展开页脚 **Controls & help → Keyboard settings**。设置入口是 `#keyboard-settings`，对话框是 `#keyboard-dialog`。从默认 QWER/A/S/Space 开始，先取消一次，再一次保存两项变化：

| 操作 | 对应控件／预期 |
|---|---|
| 点 Skill 1 当前键，按 F，再点 Cancel | `[data-binding-action="Q"]` → `[data-binding-cancel]`；仍为 Q，F 不产生施法命令 |
| 重新打开，点 Skill 2 当前键，按 R | `[data-binding-action="W"]`；`[data-binding-status]` 指出 Ultimate 已占用 R，草稿尚未交换 |
| 点明确的 Swap 按钮，再点 Stop 当前键按 G | `[data-binding-swap]`、`[data-binding-action="stop"]`；W/R 行变成 R/W，Stop 显示 G |
| 点一次 Save & apply，移回画布 | `[data-binding-save]`；W 瞄准原 R 技能、R 瞄准原 W 技能，左键施放；G 停止，S 无停止命令 |
| 核提示，再开一局／刷新 | `[data-skills] button` 的显示键、页脚 `#controls-help` 和 `#hero-select` 的技能提示均读 Q/R/E/W，帮助显示 G: stop；绑定保留 |
| Restore defaults → Save & apply | `[data-binding-defaults]` 后再保存，才恢复默认并删除存储覆盖 |

**CPU 复验从相同存储的新 owner 和新 Simulation 开始，不把它称为真实刷新。** [已回交的第二组用例](../../docs/collaboration/local-jobs/artifacts/B-CORE-BINDINGS-ADOPTION-20261106/bindings-adoption-u1.test.ts)放到上述 MOBA 副本的 `tests/client/` 后，运行 `npx vitest run tests/client/bindings-adoption-u1.test.ts`；2 项通过，加原 45 项共 47。它走真实 Controls／Simulation 和设置 DOM；设置禁用输入／清队列仍由 `keyboard-client.test.ts` 的真实 client 用例证明，新增组合没有覆盖该回调，也没有直接断言交换后按钮的 title。连续施放先等上一条 `castSlot` 清空，否则 `alreadyCasting` 是正常玩法拒绝。

保存失败的入口见 `tests/client/keyboard-client.test.ts`：临时 `vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); })`，在设置页改键并保存，核对话框仍开、有效值及 HUD/help 保持旧值，随后取消并还原 spy。新组合用例用同一 `StoragePort` 合同的内存替身；这不是实际 localStorage 配额测试。

## 移植接线：一份对象串起操作与提示

1. **在浏览器客户端创建一次** `const bindings = new KeyboardBindings(() => window.localStorage)`，作为既有 `createControls` 的第七参数。对象不放入模拟、快照或回放；重开对局沿用它或从同一存储新建，不再次迁移旧命令。输入默认仍为 QWER/A/S/Space。
2. **进入设置先撤操作权限**：`controls.setEnabled(false)` 立即清掉旧瞄准与未消费的指针观察；清客户端尚未送进模拟的命令队列，已被规则接受的动作不回滚。菜单阻挡背景 HUD／商店与场景点击，保自身焦点和关闭入口；不能只把一个面板画在战场上。
3. **一行对应稳定 action ID**：Q/W/E/R 是技能槽身份，不是当前显示键。行显示 `bindingLabel(bindings.draft[action])`；选“更改”调用 `beginCapture(action)`，之后把该行的键盘事件交 `capture(event)`。捕获时消费被处理的事件，防止 Space 同时激活按钮；Tab 先 `cancelCapture()` 再正常导航，切行／失去该行焦点也结束捕获。浏览器失焦会由 controls 清瞄准并取消捕获，保留已编辑草稿。
4. **冲突不静默抢键**：`capture`／`edit` 返回 `{ok:false,reason:'conflict',action}`，显示占用动作并让玩家重选。明确选“交换”后才调用 `edit(target,key,'swap')` 并 `cancelCapture()`；交换把原键交给另一动作，不留下无键动作。Esc 在捕获中只结束捕获；设置层 Esc 走取消／关闭，不偷偷应用。
5. **应用、取消、默认分开**：`apply()` 成功才更新有效键位；失败保留草稿和原键位并显示 `notice`，留在设置。`cancel()` 回到当前有效值；`defaults()` 只把默认填入草稿，之后应用才删除存储覆盖；不要仅因 `dirty=false` 禁用应用，显式恢复默认仍可能需要清掉不可用的旧覆盖。关闭／返回前取消捕获，只在当前对局仍有操作资格时 `setEnabled(true)`，不要靠关闭旧面板复活已销毁 controls。
6. **提示和操作同时改**：现有 HUD 的 `model.slot` 仍用于查技能，在标签位置改读 `bindings.label(model.slot)`；能力名称／图标与槽位不变。页脚 `#controls-help` 的 A/S/Space 提示也从同一对象取值。controls 的瞄准提示已读有效键位，不要另维护一张提示映射表。

真实导出签名与参数位置如下；DOM 节点、catalog 和当前 match 的 owner 由客户端持有，不另造平行输入系统：

```ts
createControls(world, catalog, player, enqueue, say, focusCamera, bindings);
createHud(root, catalog, onSkill, onBuy, onLock, bindings);
createHeroSelection(select, details, catalog, slot => bindings.label(slot));
createKeyboardSettings(dialog, trigger, bindings, names, onOpenChange, onApplied);
controlsHelp(bindings, temporaryFollow);
```

controls 的第六参数 `focusCamera: () => void` 与 HUD 的 `onLock(locked: boolean)` 不同；第八参数可选 `focusHold(held: boolean)`，仅临时跟随模式使用。

`names` 是 Q/W/E/R/attackMove/stop/focusCamera 七个 action 的显示名称；`onOpenChange(open: boolean)` 与 `onApplied(): void` 是调用者提供的回调。按现有 `src/client.ts` 接线：

- 开／关设置先更新 `settingsOpen`，清 `commands`；`controls.setEnabled(!open && !document.hidden && !stopped && snapshot.status === 'running')`。随后 `world.leavePointer()`、`clock.reset()`、重置帧时间；`critical-v1` 音频还接 `sound.setPaused(open || document.hidden)`。
- 设置组件自己调用 `bindings.apply()`。成功后先 `onApplied`：`help.textContent = controlsHelp(bindings, temporaryFollow)`、`heroSelection.refresh()`、`hud.update(snapshot, playerId)`；然后关闭对话框、调用 `onOpenChange(false)` 并还焦点。失败只显示 `bindings.notice`，不刷新消费者、不关闭，不用宿主再 apply 一次。
- 销毁时原 lifetime 负责 `settings.dispose()` 与 `controls.dispose()`。关闭回调不能只写 `setEnabled(true)`，否则隐藏、终局或已停止的对局会被错误重新启用。

## 保留的契约与边界

- **不改变键盘布局语义**：沿原 `KeyboardEvent.key` 的逻辑字母，忽略字母大小写；不会把 AZERTY 的 Q 偷换成物理 `KeyQ`。首版允许 A–Z、0–9、方向键与 Space，保留 Esc／Tab／Enter 导航；不支持组合键、IME／死键、非拉丁键、游戏手柄或本地多人。需要那些能力时扩明确绑定模型，不把 `code` 当成所有设备的身份。
- 存储键为 `moba-like.keyboard.v1`，完整 `version:1 + bindings`；缺失用默认，旧版本、坏 JSON、重复键或缺项提示后暂用默认，读取不覆盖原字节。只有明确应用／恢复默认写该键，音量和其他设置不动；一次 Storage 调用成功不是跨标签锁或断电耐久保证。
- `setEnabled(false)` 同时阻断键盘、画布指针命令和 HUD 的 `controls.skill`，但不能代替 UI 自己管理商店按钮、焦点或队列。销毁后不能重新启用；原右键点敌 `Attack`、地面 `Move`、资格检查、模拟时钟与回放都不重写。

## 哪些行为已经证实

| 证据 | 能采用什么 | 还要验什么 |
|---|---|---|
| 固定源 45 项 CPU／DOM 测试＋网页类型检查，2026-11-03 | 草稿／有效值分离、明确交换、同步提示、真实命令消费与持久化可作接入起点 | 原生 dialog 焦点／背景 inertness、实际设备与手感 |
| 第二组读者交回与接收复跑：5 文件 47 项、网页类型检查，2026-11-06 | W↔R＋S→G、取消／一次保存、真实技能消费、同存储新 owner、失败保旧值；原始交回与勘误见[记录](../../docs/collaboration/local-jobs/artifacts/B-CORE-BINDINGS-ADOPTION-20261106/result.md) | 新版指引尚未再经首次独立照做；交换后 title、真实刷新／焦点与设备仍未验 |
| [2026-10-28 浏览器报告](https://github.com/dbvv1/MOBA-Like/blob/261034a790c7eec9e493db9745dfcb0dbd66e2c7/docs/quality/smoke/B-MOBA-BACKLOG-SMOKE-20261028/2026-10-28T16-59-50-659Z-192910/report.json)，固定源 `935bf8e` | 实际 Q→F、F 开启瞄准、保存对局后刷新续玩仍显示 F；保存／恢复 tick 77→100 | 该次未浏览器实测旧键拒绝、冲突交换与全部取消分支；不算当前版本复跑 |

历史浏览器使用 software／SwiftShader；它验证界面和输入接线，不给硬件画面、手感或原生引擎评级。移植后用自己的当前交付树走完上面的正常流程，再核旧键无效、保存失败与焦点返回。

**实现依据（2026-11-03）**：[唯一绑定对象](https://github.com/dbvv1/MOBA-Like/blob/a8290054f7e1828ff8909a7633ccc3443a282e58/src/input/bindings.ts)、[完整设置页](https://github.com/dbvv1/MOBA-Like/blob/a8290054f7e1828ff8909a7633ccc3443a282e58/src/ui/keyboard-settings.ts)、[真实客户端与提示断言](https://github.com/dbvv1/MOBA-Like/blob/a8290054f7e1828ff8909a7633ccc3443a282e58/tests/client/keyboard-client.test.ts)。

**语义来源（原核实 2026-10-27）**：键盘语义核 [W3C UI Events](https://www.w3.org/TR/2026/WD-uievents-20260221/#keys-codevalues) 与 [code Recommendation](https://www.w3.org/TR/2025/REC-uievents-code-20250422/)；原消费者读 MOBA `9311f43`，设置模式沿 [FPS 已发布 sensitivity.ts](https://github.com/dbvv1/FPS-Like/blob/12ac5264b186498716f849aec3325ab41d29f4aa/src/input/sensitivity.ts)。Unity／UE 原生改键仍沿 [04 输入与设置](../../domains/game-dev/04-client-modules.md#二改改交互键再加入第二位玩家)，网页案例不外推为原生引擎或真实设备验证。
