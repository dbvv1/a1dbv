# MOBA 键位：配置真正进入原动作链

**保原动作与命令，只替换“哪个键请求哪个动作”。** 这份源码候选让 Q/W/E/R 技能、攻击移动、停止和聚焦镜头可改键，沿已采用的 FPS 灵敏度设置方式保存后应用；不是第二套控制器、通用设置框架或已接入的设置页面。

## 实现与复验

源码已保存在 [MOBA 独立候选提交 `01e9568`](https://github.com/dbvv1/MOBA-Like/commit/01e956855779624a0bab50ddb9e116c1dccc3a11)（分支 `dot-b/keybinding-source-20261027`，基于已发布 `9311f43`）。它未合入案例 main，设置 UI 尚待接线；以下说明可用于复验与接收。

| 文件 | 接入职责 |
|---|---|
| `src/input/bindings.ts` | 唯一键位设置所有者：有效值／草稿、捕获、冲突、取消、默认与保存；导出 `KeyboardBindings`、`BINDING_ACTIONS`、`bindingLabel` |
| `src/input/controls.ts` | 既有输入消费者；第七参数接收该所有者，原 `skill`／`commandForCast`／`SimCommand` 不变；增加 `setEnabled` 供菜单交接 |
| `tests/client/bindings.test.ts` | 8 项配置与捕获契约 |
| `tests/client/bindings-consumer.test.ts` | 8 项真实 controls → 原命令 → Simulation 的 CPU 消费测试；DOM、绘制和导航查询受控 |

在 MOBA checkout 取回固定候选后执行：

```sh
git fetch origin dot-b/keybinding-source-20261027
git checkout 01e956855779624a0bab50ddb9e116c1dccc3a11
npm ci
npx vitest run tests/client/bindings.test.ts tests/client/bindings-consumer.test.ts tests/client/direct-attack.test.ts tests/client/targeting-controls.test.ts
npm run typecheck:web
```

新 16 项与原点敌／瞄准 6 项通过；全套 230 项、模拟构建与网页构建通过。消费者测试验证改键后真实施法扣蓝、攻击移动／停止被模拟接受，以及同一命令序列继续 30 步得到相同状态；不是只比较映射表。尚未运行真实浏览器改键页面，未改变案例成熟度。

## owner 接线：一份对象，沿当前 UI 串行接入

1. **在浏览器客户端创建一次** `const bindings = new KeyboardBindings(() => window.localStorage)`，作为既有 `createControls` 的第七参数。对象不放入模拟、快照或回放；重开对局沿用它或从同一存储新建，不再次迁移旧命令。输入默认仍为 QWER/A/S/Space。
2. **进入设置先撤操作权限**：`controls.setEnabled(false)` 立即清掉旧瞄准与未消费的指针观察；清客户端尚未送进模拟的命令队列，已被规则接受的动作不回滚。菜单阻挡背景 HUD／商店与场景点击，保自身焦点和关闭入口；不能只把一个面板画在战场上。
3. **一行对应稳定 action ID**：Q/W/E/R 是技能槽身份，不是当前显示键。行显示 `bindingLabel(bindings.draft[action])`；选“更改”调用 `beginCapture(action)`，之后把该行的键盘事件交 `capture(event)`。捕获时消费被处理的事件，防止 Space 同时激活按钮；Tab 先 `cancelCapture()` 再正常导航，切行／失去该行焦点也结束捕获。浏览器失焦会由 controls 清瞄准并取消捕获，保留已编辑草稿。
4. **冲突不静默抢键**：`capture`／`edit` 返回 `{ok:false,reason:'conflict',action}`，显示占用动作并让玩家重选。明确选“交换”后才调用 `edit(target,key,'swap')` 并 `cancelCapture()`；交换把原键交给另一动作，不留下无键动作。Esc 在捕获中只结束捕获；设置层 Esc 走取消／关闭，不偷偷应用。
5. **应用、取消、默认分开**：`apply()` 成功才更新有效键位；失败保留草稿和原键位并显示 `notice`，留在设置。`cancel()` 回到当前有效值；`defaults()` 只把默认填入草稿，之后应用才删除存储覆盖；不要仅因 `dirty=false` 禁用应用，显式恢复默认仍可能需要清掉不可用的旧覆盖。关闭／返回前取消捕获，只在当前对局仍有操作资格时 `setEnabled(true)`，不要靠关闭旧面板复活已销毁 controls。
6. **提示和操作同时改**：现有 HUD 的 `model.slot` 仍用于查技能，在标签位置改读 `bindings.label(model.slot)`；能力名称／图标与槽位不变。工具条 A/S/Space 提示也从同一对象取值。controls 的瞄准提示已读有效键位，不要另维护一张提示映射表。

最小调用顺序（`refreshRows`、菜单及命令队列仍由案例原客户端持有）：

```ts
controls.setEnabled(false); commands.length = 0;
bindings.beginCapture('Q');
const result = bindings.capture(keyboardEvent); // 仅改草稿；Esc 可结束捕获
refreshRows(result, bindings.draft);
// 之后由独立的“保存并应用”按钮调用，不在捕获回调里自动提交。
function onApply() {
  if (!bindings.apply()) return showSettingStatus(bindings.notice);
  refreshHudKeys();                 // 读取 bindings.label，不改模拟槽位
  closeSettings();
  controls.setEnabled(canControlCurrentMatch());
}
```

## 保留的契约与边界

- **不改变键盘布局语义**：沿原 `KeyboardEvent.key` 的逻辑字母，忽略字母大小写；不会把 AZERTY 的 Q 偷换成物理 `KeyQ`。首版允许 A–Z、0–9、方向键与 Space，保留 Esc／Tab／Enter 导航；不支持组合键、IME／死键、非拉丁键、游戏手柄或本地多人。需要那些能力时扩明确绑定模型，不把 `code` 当成所有设备的身份。
- 存储键为 `moba-like.keyboard.v1`，完整 `version:1 + bindings`；缺失用默认，旧版本、坏 JSON、重复键或缺项提示后暂用默认，读取不覆盖原字节。只有明确应用／恢复默认写该键，音量和其他设置不动；一次 Storage 调用成功不是跨标签锁或断电耐久保证。
- `setEnabled(false)` 同时阻断键盘、画布指针命令和 HUD 的 `controls.skill`，但不能代替 UI 自己管理商店按钮、焦点或队列。销毁后不能重新启用；原右键点敌 `Attack`、地面 `Move`、资格检查、模拟时钟与回放都不重写。
- 正式接线后由案例 owner 在同一交付树实测：默认玩法→改键应用→旧键不触发／新键施法→冲突／取消→失焦返回→恢复默认→重开读取；同时看 HUD、键盘焦点和背景不穿透。源码测试不替代这组验收。

**来源与核实（2026-10-27）**：键盘语义核 [W3C UI Events](https://www.w3.org/TR/2026/WD-uievents-20260221/#keys-codevalues) 与 [code Recommendation](https://www.w3.org/TR/2025/REC-uievents-code-20250422/)；原消费者读 MOBA `9311f43`，设置模式沿 [FPS 已发布 sensitivity.ts](https://github.com/dbvv1/FPS-Like/blob/12ac5264b186498716f849aec3325ab41d29f4aa/src/input/sensitivity.ts)。Unity／UE 原生改键仍沿 [04 输入与设置](../../domains/game-dev/04-client-modules.md#二改改交互键再加入第二位玩家)，本候选不宣称原生引擎或真实设备验证。
