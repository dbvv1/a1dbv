# P24：同一 Users 界面的两轮继承包

**默认局部改语义token和密度，再复用现有Dialog／Form；不为换主题迁primitive。** 以下先保留两轮文件／接口与判据，再记录固定公开UI demo的实际补丁及验证。明确本地演示写回，不扩称生产业务或视觉效果通过。核实日期2026-10-21（UTC+8）；实际范围见文末。

本包的[最高水平卡](../../research/2026-10-13-domain-skill-contract.md#当前最高水平卡已有设计系统的两轮修改)先比较近期多轮UI与交互验证研究，再选本题可行路线；不把固定源码、作者测试或CLI契约当当前最好。

## 固定输入与原行为

基线为satnaing/shadcn-admin固定[e16c87f213a5ba5e45964e9b67c792105ec74d26][base]的Users页，MIT源码；不推及品牌／字体。`components.json`为new-york、slate、CSS变量、非RSC，实际Dialog／Form依赖Radix。它是演示界面，README也不把它定位为starter；既有批量操作只有sleep＋toast，单编辑显示提交数据，均未写回服务器。

必须继承：light/dark/system模式、URL筛选／分页、选择与排序、表单验证和取消、RTL逻辑边距、移动端16px输入字号、scroll-lock下sticky header修复。`theme.css`存语义变量，`index.css`导入它并保本地规则；`components.json`指向后者，不能整文件覆盖。ConfigDrawer的Compact只折叠sidebar，不是表格／表单密度。[固定源码目录][src]

两轮沿同一份工作树进行，B2必须继承B1全部文件和断言。下列B1/B2是需求与验收层次；文末另列实际本地提交、可应用补丁和验证记录，不把需求表当成测试结果。现有faker数据不充固定夹具：检查时用合成U1（inactive/cashier）、U2（inactive/manager）、U3（active/admin），其余必填字段给固定示例值，不接真实账号。

## B1：蓝色主题与两种密度

目标：只改Users列表、单编辑表单及其弹层；保模式API、字体、路由、数据模型和primitive。颜色配对与下述尺寸是待人审的设计输入，不是已证审美／可访问性结论。

| 文件／接口 | 拟议差异与必须保留 |
|---|---|
| `src/styles/theme.css` | 保`:root/.dark`原全局色值，用`.users-theme`及`.dark .users-theme`覆盖primary/foreground/ring和必要accent；destructive不刷蓝。加Users专用控件高、cell纵padding、form gap、dialog padding变量，舒适36/8/16/24px，紧凑32/4/12/16px；保旧token名和Tailwind映射 |
| `src/features/users/index.tsx` | 新增`density: comfortable \| compact`偏好和显式开关，独立于theme和sidebar；挂`html[data-users-density]`并在离开页面时恢复原值。只让Users的opt-in类消费，避免改其他页面 |
| `users-table.tsx`及专用toolbar | 消费控件高和cell纵padding；不改选择列横宽，因此保`users-columns.tsx`的`inset-s-0`／`inset-s-6`关系。以后改横宽须一起改偏移 |
| `users-action-dialog.tsx` | 单编辑通过可选样式参数消费form gap与dialog padding，新增用户实例不传；保`open/onOpenChange`、关闭reset、`user-form`与外置footer submit、Zod校验和FormControl ARIA链 |
| `src/components/ui/dialog.tsx`、`form.tsx` | 默认不替换；保Radix Portal、Slot/asChild、`showCloseButton`、`inset-e-4`和`text-start`，不重新下载一份上游覆盖 |

**颜色与密度以Users列表、单编辑和B2批量编辑为显式opt-in边界。** 不挂整个Main、全局Header或所有Portal；列表根和范围内各浮层Content根携带`users-theme`及密度消费标记。`html[data-users-density]`只提供变量，不直接改全局控件。共享参数均可选，省略时保原行为；禁止共享组件按路由隐式识别Users，合并样式时保原定位、尺寸和状态类。[研究：拟方案]

| 浮层入口／拟改文件 | 显式传递路径；共享调用默认不变 |
|---|---|
| `UsersTable → data-table/toolbar.tsx → faceted-filter.tsx / view-options.tsx` | 新增可选`overlayClassName`逐层传到筛选`PopoverContent`及列显隐`DropdownMenuContent`；保原筛选／显隐和modal参数 |
| `UsersTable → data-table/pagination.tsx` | 新增可选`overlayClassName`合并到直接使用的`SelectContent`，不是经SelectDropdown |
| `users-columns.tsx → data-table/column-header.tsx` | Users列工厂接收可选`overlayClassName`到排序／隐藏菜单Content；现有标题`className`不覆盖Portal |
| `users-columns.tsx → long-text.tsx` | 新增可选`overlayClassName`给桌面Tooltip与移动Popover的Content根；保旧`contentClassName`语义：桌面只给内层p、移动给PopoverContent，不能偷偷改成共同浮层根参数 |
| Users专用`data-table-row-actions.tsx` | 其菜单Content接收调用方标记；保Edit／Delete行为与destructive样式，不自动改Delete Dialog |
| Users专用`data-table-bulk-actions.tsx → data-table/bulk-actions.tsx` | 四个Tooltip接收调用方标记；共享工具条新增可选`tooltipContentClassName`仅给清选择Tooltip。工具条为普通fixed DOM，继承列表根；不编造不存在的批量DropdownMenu |
| `users-dialogs.tsx → users-action-dialog.tsx → select-dropdown.tsx` | ActionDialog新增默认空`overlayClassName`，只由目标Users页的UsersDialogs传入edit实例并合并到DialogContent；再经SelectDropdown可选`contentClassName`到SelectContent。add实例不传；B2新Dialog／Select同样opt-in |

以上由固定[toolbar][toolbar]、[筛选][faceted]、[分页][pagination]、[列头][column-header]、[长文本][long-text]、[共享批量条][shared-bulk]与[Users调用者][users-dialogs]核对。Tooltip箭头也消费primary，标记必须落到浮层根而非只标Trigger；原样式合并不等于视觉已经通过。[一手：固定源码；研究：拟接口]

**密度须作用到实际控件。** 除TableCell，表内搜索／筛选、列菜单触发器、分页、行操作与批量按钮也须在Users子树按具体控件或data-slot消费高度变量，核旧`h-8/size-*`是否覆盖新值；浮层选择项用局部规则。Tooltip不是可点击控件，不统一强设控件高。[研究]

**本轮不改Add／Invite／单删／批删Dialog内部业务或视觉。** 这些入口仍存在，其菜单／提示属于列表时按上表覆盖；进入被排除Dialog后保旧行为。Add与Edit共用ActionDialog，必须由调用方显式区分。全局Search、ThemeSwitch、ConfigDrawer、ProfileDropdown也不改；不得把它们计为统一主题验收。邀请／批删内部本次未重新核全源码，不声称完整覆盖。[一手：调用关系；研究：范围]

B1待运行矩阵为明暗×两密度、LTR/RTL、320px与桌面宽度，以下均为拟判据：
- primitive imports、锁文件及FormControl链不变；切密度或开关浮层不改变筛选／排序／列显隐／分页／selection。
- 逐个打开筛选、列显隐、可排序列、每页条数、行菜单、长文本桌面Tooltip／移动Popover、批量按钮／清选择Tooltip、单编辑及角色Select；B2继续覆盖新Dialog／Select。检查Content根、箭头／选中态与实际密度消费者，不只看Trigger。
- 未传新参数的其他表格／LongText、Users全局Header与被排除Dialog保原样；离页恢复html属性原值。Escape／Close不提交，键盘与焦点返回正常。
- 人审信息层级、触控、暗色辨认、按钮遮挡与错误可读性；静态表格和typecheck都不算这组视觉矩阵通过。

## B2：在B1上新增批量编辑Dialog

目标仅本地演示：选择当前筛选下的用户，改role或status，可取消；刷新恢复初始数据。保B1主题／密度、旧单编辑和未改操作的原演示性质，不声称新增服务端事务、权限或持久化。

| 文件／接口 | 相对B1的拟议差异 |
|---|---|
| `src/features/users/index.tsx` | 用`useState<User[]>(users)`持有演示数据，提供`applyBulkEdit(ids, patch)`；只更新匹配ID的role/status，其余字段保持，明确刷新重置 |
| `users-table.tsx` | 新增可选`onBulkEdit(ids, patch)`；仅启用批量修改时使用`getRowId: user => user.id`和焦点fallback，Clerk等未传callback的调用者保原索引身份／入口。保data/search/navigate、URL状态和现有越界页修正；业务ID是新行为，须另验 |
| `data-table-bulk-actions.tsx` | 新增“编辑所选”；打开时快照`getFilteredSelectedRowModel().rows`的原始ID，显示同一计数。标题说明“当前筛选下的已选用户”，不暗示所有隐藏选择都提交；旧即时操作不悄悄换语义 |
| 拟新增`users-bulk-edit-dialog.tsx` | `open/onOpenChange/selectedIds/onConfirm`，复用现有Dialog、Form、SelectDropdown；字段默认“不修改”，至少一项有效才确认，enum来自既有schema。使用受控Select及显式reset，不用首行值覆盖混合值 |
| `src/features/users/data/schema.ts` | 导出原有role/status schema而不改枚举；UI“不修改”先转为省略字段，再校验非空patch，不能写回占位值 |
| 关闭与确认 | 取消／X／Escape只丢草稿，不改数据、不清selection；确认校验后同步改快照IDs的指定字段，成功后关闭并清selection。status变化使行离开筛选时保筛选并走页码修正；禁用重复确认直到这次本地提交完成 |

**原生组合仍需真实挂载的判定器。** 基线[删除测试][delete-test]的关闭重开Harness会卸载组件；真实[bulk-actions][bulk]始终挂载[对话框][delete]，其输入只在成功时清空，取消没有同样reset。该测试不证明真实集成重开清空；本包继承单编辑的显式reset，再按持续挂载结构测试。这里只核源码，不称已运行复现。

B2固定判据：
- 选U1/U3后筛inactive，打开Dialog目标只有U1；预览、标题与提交IDs一致。取消后全部数据和两项selection精确不变。
- 重新打开时两字段均“不修改”；空patch不可确认。改U1为active后只U1的status变化，role与U2/U3不变；U1离开inactive列表不等于丢数据。
- 多页选择与再筛选重复上述检查；不能拿当前页全选当所有页全选。成功后清selection是明确设计，失败路径不能照搬基线立即清空。
- 同实例关闭重开、键盘焦点返回、错误关联、Portal及B1完整视觉矩阵继续验。未来接服务端时须新增失败／重试／冲突／权限契约，本包不以同步callback覆盖它们。

## 现成方案、AI边界与撤回

**本任务默认让Agent做窄差异，不整包换设计系统。** [shadcn真实失败9914][failure]中用户只要preset／密度，Claude却换Base UI到Radix，typecheck照样通过。首轮“已修”后仍有同人失败；[9923][fix]仅修Skill／CLI文档，末条“thank you”不足以证明新版组件全路径通过。它改变的是任务约束与证据出口，不证明所有Skill无效。

本轮固定CLI[4.22.1／daaf156e][cli]的`apply.ts`从既有style保base，`--only theme,font`不重装组件，完整apply会覆盖检测到的组件；[get-config.ts][base-parser]把new-york等已定义旧style认作radix。**这是可复用机制，不是本基线运行成功。** theme/font局部应用不包含密度；还须核分离CSS的实际结果和本地修复，所以本包仍选局部token／样式差异，CLI部分应用只作可比较候选，不运行latest或安装Skill。

方案对比：局部改动保接口、需维护少量密度消费者；CLI部分主题应用可复用解析，却仍需检查结果与密度差异；全量preset／换primitive会扩大到Portal、控制props、Slot、焦点和ARIA调用者，无新能力缺口时不采用。视觉反馈是三条路线共同的验收层，不与Skill互斥。

AI可核文件来源、token作用域、拟接口差异和回归；瓶颈是局部定制遗漏、测试结构假阳性和视觉／交互判断。人决定设计输入、筛选后的批量目标语义及实际可用性。上下文整理、人审、返工、运行等待、后续维护分别计投入；本轮均无净工时、完成比例或收益量化。若局部差异不能覆盖所需状态，先缩需求／定向补组件；只有新能力确需迁primitive才另开完整迁移，不让typecheck替它放行。

## 实施与实际验证（2026-10-21，UTC+8）

**窄改路线已能编译，不代表界面可用性已验收。** 本轮在上述固定公开应用上安装锁定依赖并实施两轮；不另做模型对照实验、不接真实用户、不运行引擎、不部署。原浏览器测试未能启动，执行数为0；不能将新增纯状态检查替代它们。最终文件、补丁与结果见下表。[本仓运行]

基线实际通过 `pnpm exec tsc -b`、`pnpm lint`、`pnpm build`。依赖安装采用 `--frozen-lockfile --ignore-scripts`，未启用生命周期脚本；安装462包，未改package／lock。Node24.19.0、pnpm11.25.0、TypeScript6.0.3、ESLint10.2.1、Vite8.0.8；锁文件SHA256为`a405acc028d65821776410585c52eb0e2c4b378915114bafb48adc8b01fd9d87`。这是该固定依赖组合的结果，不保证其他Node版本或更新依赖等效。[本仓运行]

**浏览器缺口只阻塞渲染与集成交互验收，不阻止已授权源码修改。** 原Vitest4.1.4／Playwright1.59.1浏览器入口发现21个测试文件但零测试执行：先缺固定浏览器，官方安装返回损坏／截断归档；临时配置指向已有Chromium154后，进程因socket权限在导航前退出。相同最小启动的一次正式执行路径也因只读挂载失败。没有调整安全参数或继续换路；预览虽打印URL，HTTP连接未成功，不算已访问界面。128个原test声明只是静态计数，不是通过数。[本仓运行]

**返工不是“多跑几次就通过”。** 首版密度规则只匹配普通Input的data-slot，漏掉原始密码input及Command内层input；独审后补实际消费者。随后发现Clerk复用Users表格／Dialog，要求把opt-in沿调用链传入，只在目标Users页启用，而不是让共享组件暗中按路由改色。两处均说明typecheck不能发现视觉作用域遗漏；修正后的实际视觉仍未知。[本仓源码审查]

本地提交标识用于说明两轮父链，并非上游已发布提交；可复现依据是固定上游SHA及本仓补丁。应用补丁前先验证来源和干净工作树，按B1再B2顺序 `git apply --check` 后应用；不能把两份补丁都当相对原基线。未包含上游依赖、生成构建产物或环境日志。[研究：接手方式]

| 冻结层 | 补丁／实际检查 | 本地源码树 |
|---|---|---|
| B1最终 `f1cf8ef25302faea0485b33da40376b97d4d1bfe` | [相对基线补丁](2026-10-21-p24-b1.patch)；独立B1工作树type／lint／build均exit0 | `5739e200b231c86d20ce3f62a6506bf56aba1466` |
| B2 `bd651b222eb3bd0f00ece5a81be2075edd5e32c0`，父为B1最终 | [相对B1补丁](2026-10-21-p24-b2.patch)；type／lint／build均exit0；`node --test tests/p24-bulk-edit.node-check.mjs`六项通过、零skip | `a3d942ba1ef88ca6da2c2a8e9c724387c51f2fe2` |

B1补丁SHA256：`9e7c624869e87d4678c3a67311c9d2ad614646f2b50986a966e22f70447f6f7f`；B2：`0aa48f9d60b694174384f1ef6fcb24a527563ddbf74ac24b2abd1f5d98aed407`。补丁空白context行用Git接受的空行形式，避免作为仓库文本产生行尾空白；未放宽检查。本端用独立Git索引从固定基线顺序应用两份最终补丁，分别重建上述两树；不是只检查补丁存在。B1的初稿`b160b15`与输入修正`13f9be4`保留在本地父链，最终B1同时含Clerk隔离修正，交付补丁不要求读者再应用旧错误稿。[本仓运行]

**六项检查实际调用UI所用helper及TanStack行模型，不另写一个假实现。** 覆盖U1/U3选择后筛inactive只快照U1、多页选择与后续筛选不改变已捕获IDs、只改指定字段且保原对象其他字段、重复／缺失ID、空／坏／未知字段patch拒绝，以及纯取消／重置不动输入数据与selection。本端与独审均独立复跑六项；没有把这六项称为原应用测试通过。[本仓运行]

**新增三个浏览器回归源码仍待执行。** 它们让Dialog保持挂载，覆盖取消／重开、单字段提交、Escape／X；只做源码与类型检查。即使将来这三个组件用例通过，仍须补整表成功后的selection清理、筛选导致的页码修正、工具条消失后的焦点返回、重复提交、全部Portal及明暗／密度／RTL／移动端矩阵；当前均不计验收。纯helper取消测试尤其不能证明React事件真正连对。[本仓审查]

B2首轮类型检查发现Clerk复用表格而新callback必填，改为可选且不显示新操作；稳定业务ID和焦点fallback也仅随批量修改启用。lint另发现`form.watch`与React Compiler及ref回调规则不符，改`useWatch`与事件时调用`handleSubmit`，未禁用规则。最终结果来自这些修正后的同一树，失败尝试未被算作通过。[本仓运行]

**本轮确认的是实施可行性及定向状态契约，尚不确认最好看或最好用。** Agent完成两轮源码与回归候选；独审／本端发现并修正实际消费者和旧调用者遗漏。人仍要决定主题配对、触控密度、信息层级及视觉结果；没有净工时、工具对照或可泛化成功率。默认继续窄改，但采用前必须完成上述界面验收；若条件不具备，保留原界面，不以构建成功放行。[研究：采用判断]

## 10-24 真实浏览器：筛选后只改目标，取消保留选择

**两轮改稿已补一条真实交互接收，不再只依赖纯状态检查。** 固定B2树 `a3d942ba1ef88ca6da2c2a8e9c724387c51f2fe2` 与上表锁文件不变，在dot云端受管Chrome中，从实际生成的演示行选择不同状态的两人，再筛Inactive。未使用文档中假定的U1/U2/U3替换应用数据。[本仓浏览器实测：2026-10-24 UTC+8]

- **筛选决定目标，不抹掉隐藏选择。** 未筛选时2项已选，筛Inactive后批量Dialog为1项。
- **取消不提交，重新打开不继承草稿。** 将目标的角色拟改Manager、状态拟改active后取消，目标仍Inactive/Admin，另一行仍Active/Cashier；清筛选后两项选择都保留。再次打开，两字段均“Do not change”，空Apply不可用。
- **只提交选定字段与当前筛选目标。** 只改status为active，目标离开Inactive列表；清筛选并搜索后，目标为Active/Admin，原Active/Cashier行未变，二者均未选中。批量条消失，焦点回到Users list；取消时焦点回批量编辑按钮。
- **B1状态在B2操作后保留。** Dark与Compact一直保持，状态Select的Portal实际打开并观察；不外推所有浮层、明暗／RTL／移动端矩阵已验。[本仓浏览器实测：上述限定操作]

这组接收验证了Agent二改不仅“能编译”，还保住取消、筛选后的实际目标、单字段修改与操作后的返回路径。没有发现需修复的实质问题，因此没有制造批注，也不称完成了Agentation批注改稿链；500行全量字段、末页修正、重复提交、持久化及自动化浏览器套件仍未验。[研究：可借机制与范围]

执行记录：恢复原基线与B1/B2补丁后，两树及锁哈希均匹配，固定依赖重装成功。首次普通Vite启动后Chrome目标崩溃；保留并迁出已完成编译缓存、临时分区可用空间增大后，同一普通入口的一次重试呈现页面并完成上述操作，崩溃原因仍未知。没有重试旧headless socket路径或改安全设置。结束时仅关闭本次页面、停止本次Vite；源码未改，原类型／lint／构建结果按同树范围复用。[本仓运行]

## 补丁许可

两份补丁基于上述公开MIT项目，保留以下原许可；仅交差异，不包含依赖或构建产物。新增修改按同一MIT许可提供。

```text
MIT License

Copyright (c) 2024 Sat Naing

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

[base]: https://github.com/satnaing/shadcn-admin/tree/e16c87f213a5ba5e45964e9b67c792105ec74d26
[src]: https://github.com/satnaing/shadcn-admin/tree/e16c87f213a5ba5e45964e9b67c792105ec74d26/src
[bulk]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/users/components/data-table-bulk-actions.tsx
[delete]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/users/components/users-multi-delete-dialog.tsx
[delete-test]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/users/components/users-multi-delete-dialog.test.tsx
[failure]: https://github.com/shadcn-ui/ui/issues/9914
[fix]: https://github.com/shadcn-ui/ui/pull/9923
[cli]: https://github.com/shadcn-ui/ui/tree/daaf156ee00ed91cc7e6bdd937c1b4973152d141/packages/shadcn/src/commands

[base-parser]: https://github.com/shadcn-ui/ui/blob/daaf156ee00ed91cc7e6bdd937c1b4973152d141/packages/registry/src/get-config.ts

[toolbar]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/data-table/toolbar.tsx
[faceted]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/data-table/faceted-filter.tsx
[pagination]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/data-table/pagination.tsx
[column-header]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/data-table/column-header.tsx
[long-text]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/long-text.tsx
[shared-bulk]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/data-table/bulk-actions.tsx
[users-dialogs]: https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/users/components/users-dialogs.tsx
