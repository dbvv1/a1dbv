# Memos 未完成任务阅读模式（A-MEMOS-READING-001）

核实时间：2026-10-25
上游：usememos/memos，固定提交 `0bfa31e89ec550c7cc6a1dea3888af2d0de107c2`（tree `080b9458635ec846b156fbdb079c9a33badf50aa`），许可证 MIT。
证据等级：实测命令、退出状态与测试计数为 [一手]；产品取舍、残余风险与审查判断为 [经验]。

## 上游交付（2026-10-26）

已提交 [Draft PR #6502](https://github.com/usememos/memos/pull/6502)，head `00d217067504e2b912bfd418199eef69d23a3c6a`；补丁与下文最终导出逐字一致，60文件 +768/-17。PR区分旧全量191/1602与最终定向7/72，披露AI实施／AI独审、built-app smoke与用户文档欠项、译文占位和DOM设计待确认。当前只跟进此PR评审，不另开同项目PR；02:21 UTC+8核为开放草稿、可合并，Frontend Tests为`action_required`，不是CI通过。

## 结论

给 Memos 的清单阅读增加默认关闭的“隐藏已完成任务”开关：偏好只保存在当前浏览器，未完成子项仍保留父项上下文，编辑和分享图片继续显示完整原文。适合清单较长、读者只想聚焦剩余工作的场景；不用于删除完成记录或改变分享接收者的偏好。原生编码 Agent 沿现有偏好与编辑器扩展实现，未引入新的规格框架或解析器。

工程补丁与检查已完成，浏览器交互与刷新仍待真实接收。下文修正记录用于解释实际反馈怎样改变实现，不是功能入口或方法收益证明。续作按既有报告记录的焦点问题定位并修复了一处新增焦点退化：把带未完成子项的父项勾成已完成后，父项仍作为上下文显示，但勾选触发的视图刷新会替换编辑器刚恢复焦点的复选框；现按稳定 block id 只把焦点还给仍显示的任务，未新增焦点框架。

独立审查提出的两项修正已完成并有回归覆盖：

1. 列表只要有一项含第二段或代码块，`@usememos/editor 26.10.26` 的 `fitsModel` 会把整个列表降为 raw Markdown 块，旧实现只处理 block 模型里的 `listItem`，因此普通完成项不隐藏。现改为在编辑器真实绘制的 raw 列表 DOM 上标记完成项，保留嵌套上下文、原文与勾选权限，整表完成可恢复。
2. 原报告把 `pnpm test -- --maxWorkers=4` 当作受控 4 worker 全量运行，实际 Vitest 把 `--maxWorkers=4` 放进了 `options['--']`，并未限制 worker。已保留原日志，改用 `pnpm exec vitest run --maxWorkers=4` 重跑全量：191 files / 1602 tests passed，退出 0；另将 bundled Node24 置于 PATH 复核同一入口，结果相同。

工程结果可接收；真实浏览器、Memos 服务、demo、账户与数据库仍未运行，真实界面验收待负责人提供获准入口。本轮没有再声称方法收益或 accepted。

## 产品决定

- 采用**当前浏览器全局阅读偏好** `hideCompletedTasks`，默认 `false`（显示全部任务）。它沿用 `useDevicePreferences` 的 `localStorage` 键 `memos-device-preferences`，不新增服务端字段，也不依赖只在 Timeline 生效的 `ViewContext`。
- 阅读开关放在 memo 详情页（含匿名 share 路由）的正文上方，是带可见文字的 Base UI `Switch`，有 `aria-labelledby`，可键盘聚焦；不把唯一入口放进登录后的设置页。开关不改变 URL、分享权限、接收者偏好或账户设置。
- 实际渲染器已核：`MemoContentView → MemoMarkdown → @usememos/editor 26.10.26`。过滤分两层，都只作用于只读展示：
  - **block 模型内的列表**：用编辑器公开的 `blockView` 给“可隐藏的已完成任务”渲染一个空元素，由作用域 CSS 连包装块一起隐藏。规则见 `hiddenCompletedTaskIds`：已完成父项下仍有未完成子项或其他嵌套列表项时保留为上下文。
  - **raw Markdown 列表**：列表项含第二段、代码块等结构时不进 block 模型，整段由一个 raw 块承载，`blockView` 看不到其中条目。`applyCompletedTaskVisibility` 直接在该 raw 块的真实渲染 DOM（`.mbe-view-markdown`）上标记完成项：逻辑嵌套同时来自 DOM 后代与编辑器在流内降级后的 `data-indent` 兄弟关系，与 block 规则一致；标记为 `data-memos-hidden-completed-task` 并设 `hidden`，CSS `display: none` 覆盖编辑器对 `.mbe-list-item` 的 `display: flex`。编辑器的重绘由 `MutationObserver` 重新应用；偏好切换同步应用。没有自写 Markdown 解析器，也没有字符串替换源 Markdown。
- 只改变展示：文档、block id 和 Markdown 不变；勾选仍走编辑器现有 block id，只改被勾选项的 `[ ]`/`[x]`，不发送 memo 更新请求。编辑模式不接过滤，始终显示全部任务；已勾选状态、代码块、普通列表、链接、附件保持原行为。
- 勾选后的焦点按**块身份**保持：键盘激活复选框时，编辑器自己会在应用本次勾选、重绘该 block 后把焦点还给同一 `[data-block-id]` 的新复选框；本补丁为更新父级上下文而追加的 `refreshViews` 在那之后再次重绘该 block。修复只记住激活复选框所属的 block id，刷新并重做 raw 隐藏后，若该任务仍可见则聚焦同一 block 的新复选框；任务被隐藏时没有可聚焦目标，不扩成“跳到相邻项”的规则，也不引入通用焦点管理或 DOM 观察框架。
- 分享图片导出显式传 `filterCompletedTasks={false}`，导出物代表 memo 原文，不因读者本机偏好丢任务。
- 所有 46 个语言目录补齐 `memo.hide-completed-tasks` 以通过仓库的键对齐测试；简体/繁体中文为实际译文，其余目录暂用英文占位，待项目翻译流程处理。

改动面：前端组件、偏好 hook、必要 CSS、翻译与测试；无后端、身份、数据库、部署、CI 或无关功能改动。

## 应用与运行

补丁位于本仓 `experiments/`，不在上游 Memos 仓库内；下面的 `<a1dbv-checkout>` 指本仓检出根目录。

```bash
git clone https://github.com/usememos/memos.git
cd memos
git checkout 0bfa31e89ec550c7cc6a1dea3888af2d0de107c2
git apply --check <a1dbv-checkout>/experiments/memos-reading-adoption.patch
git apply <a1dbv-checkout>/experiments/memos-reading-adoption.patch
cd web
corepack pnpm install --frozen-lockfile   # 需要 Node >= 24、pnpm 11.0.1
pnpm exec vitest run --maxWorkers=4       # 受控 4 worker 全量；也可用 pnpm test --maxWorkers=4
pnpm lint
pnpm build
```

不要在 `pnpm test` 后写 `--`：`pnpm test -- --maxWorkers=4` 会把参数作为位置参数放进 Vitest 的 `options['--']`，worker 数不会生效。按上述外部路径在固定提交的新干净检出上复核：`git apply --check` 与 `git apply` 均退出 0，落地 60 个文件。

实际工具：`@usememos/editor 26.10.26`；未换锁、未升级依赖、未重装。修复首轮日志只把 pnpm 启动器指向 bundled Node `v24.19.0`，`pnpm exec` 的 vitest/tsc/biome/vite 子进程仍经 PATH 解析为系统 Node `v22.23.2`（pnpm 会打印 `Unsupported engine` 警告）；随后把 bundled Node24 的 bin 置于 PATH，确认 `node -v` 与 `pnpm exec node -v` 均为 `v24.19.0`，重跑受影响 7 files / 71 tests、lint、build 与完整 4-worker 全量，结果见下表，两套日志都保留。本轮 pnpm 命令均以绝对 `--dir` 指向任务上游的 `web/`，执行前用 `pnpm --dir <abs> root` 核对了包根为该目录的 `node_modules`。

续作复用同一 bundled Node24（`v24.19.0`）与既有 `web/node_modules`（任务内 junction，未改清单或锁文件）。本机 pnpm 包装在执行前会触发依赖状态检查，并以 `minimumReleaseAge` 策略拒绝既有 `@usememos/editor 26.10.26`；未改任何用户级配置、锁文件或依赖，改为用 Node24 直接运行已安装的 `vitest`、`tsc`、`biome` 与 `vite` 入口。以下续作命令均在 `web/` 目录执行。

## 续作：键盘焦点反馈（A-MEMOS-CONTINUATION-001）

既有组件反馈：模拟键盘激活路径勾选一个仍显示的任务后，复选框焦点丢失（鼠标不受影响）。用同一真实 `MemoContentView`／`@usememos/editor` 组件与同一键盘激活路径组件模拟核对：

- 第一次按字面取“已经完成的父项 + 未完成子项”，聚焦父项并模拟该激活路径（取消完成）：没有复现焦点丢失。固定上游该次运行留有汇总级通过日志；修复前的已交补丁没有为这个字面输入保留独立原始日志。源码上取消完成会让该 block 在 `onChange` 前离开 block 视图的托管集合，追加刷新没有可重绘的块，因此不能据此制造故障。
- 把输入限定为“勾选后成为已完成、但因未完成子项仍显示”的父项：`- [ ] Parent\n  - [ ] Child`，开启隐藏完成项，聚焦 Parent 复选框后，测试显式触发 `fireEvent.click(..., {detail:0})`，模拟编辑器处理键盘激活的路径；未发送实际按键事件。固定上游未打补丁时焦点留在 Parent 的新复选框；已交补丁修复前，`onTaskToggle` 收到 `- [x] Parent\n  - [ ] Child` 后焦点离开该复选框，同一 block 的新复选框不再持有焦点。修复后同一输入通过。

归因来自实际源码：编辑器 `toggleTaskAt` 应用勾选并重绘该 block 后，只在“激活元素原本是复选框”时把焦点还给同一 `[data-block-id]` 的新复选框；`MemoContentView` 的 `handleTaskToggle` 在 `onChange` 中为更新父级上下文又调用 `refreshViews(MEMO_TASK_VISIBILITY_EXTENSION)`，该调用经 `dropViews → invalidate → paint` 再建一次 block 元素，而编辑器不会重复焦点恢复。勾选后仍可见的任务因此丢失键盘位置；这是本补丁新增的退化，不是固定上游既有行为。

取舍：直接去掉刷新会漏掉“勾选最后一个未完成子项后，上方已完成父项应隐藏”的更新；只做“最小刷新”也排除不了刚勾选的 block——它此次新进入 block 视图托管集合，重绘它和更新其他父项是同一次 `refreshViews` 调用。改变选择的是这条同组件证据，而不是预设 `refreshViews` 是根因：保留刷新，在刷新后按稳定 block id 重新定位。任务仍可见才聚焦；任务被隐藏时没有目标，不扩成相邻项焦点规则，也不建通用焦点框架。修复只改 `MemoContentView` 的勾选回调和一条同组件回归，未动编辑器包、原文、勾选权限、父子过滤、分享图片或编辑模式。

边界：这是 jsdom 中的真实组件回归，不是真实浏览器验收；真实 Tab 顺序、跨页刷新，以及“任务被隐藏后焦点去哪”仍未验。全量测试未重跑，沿用上一轮未受影响的 191 files / 1602 tests 通过结果；本轮复验了受影响的 7 个测试文件、类型／lint、构建与补丁应用。

## 实际执行与检查

本轮修复的原始命令、输出与退出状态保存在任务私有目录 `repair-1/logs/`（`memo-content-view-repair.log`、`affected-tests-final-repair.log`、`lint-repair.log`、`build-repair.log`、`full-suite-maxworkers4-repair.log`、`full-suite-maxworkers4-final-repair.log`、`node24-runtime-check.log`、`affected-tests-node24-files.log`、`lint-node24.log`、`build-node24.log`、`full-suite-node24-maxworkers4.log`）；两段原始输出与运行元数据在 `repair-1/raw/`；上一阶段日志保留未覆盖。两个定向日志的命令行仍使用 `<7 files>`／`<7 explicit files>` 占位；完整七文件清单由本机保留的2026-10-24 23:02:38 UTC原始Bash调用绑定，下文列名与该实际调用一致，日志占位不当作完整命令。续作的固定上游／已交补丁／修复后对照失败与通过输出、直接入口日志保存在本任务私有 evidence 目录；公开文不列本机路径或会话标识。

| 步骤 | 结果 |
| --- | --- |
| `pnpm --dir <abs web> root` | 输出 `<abs upstream>/web/node_modules`，包根已核对 |
| 首轮日志（vitest 子进程为 Node22）：`pnpm --dir <abs web> exec vitest run tests/memo-content-view.test.tsx` | 修复前 7 failed / 36 passed，确认 raw 列表用例真实失败；修复后 44 passed |
| 首轮日志（vitest 子进程经 PATH 为 Node22）：`pnpm --dir <abs web> exec vitest run tests/memo-content-view.test.tsx tests/memo-task-visibility.test.ts tests/memo-editor-view.test.tsx tests/memo-detail-access.test.tsx tests/memo-reading-options.test.tsx tests/device-preferences.test.tsx tests/preferences-media-metadata.test.tsx` | 退出 0，7 files / 71 tests passed |
| 首轮日志（tsc/biome 子进程为 Node22）：`pnpm lint`（`tsc --noEmit --skipLibCheck` + Biome） | 退出 0，663 files；首次格式化失败已修正后复跑通过 |
| 首轮日志（vite 子进程为 Node22）：`pnpm build` | 退出 0，约 17–19s；仅有既有 chunk 体积与插件耗时警告 |
| 首轮日志（vitest 子进程为 Node22）：`pnpm exec vitest run --maxWorkers=4` | 退出 0，191 files / 1602 tests passed，约 394s；已用 `vitest run --help` 确认 `--maxWorkers` 是顶层选项 |
| Node24 PATH：`pnpm exec vitest run <显式 7 files> --maxWorkers=4` | 退出 0，7 files / 71 tests passed，约 15s（`affected-tests-node24-files.log`） |
| Node24 PATH：`pnpm lint` | 退出 0，663 files（`lint-node24.log`） |
| Node24 PATH：`pnpm build` | 退出 0，约 16s（`build-node24.log`） |
| Node24 PATH：`pnpm exec vitest run --maxWorkers=4` | 退出 0，191 files / 1602 tests passed，约 221s（`full-suite-node24-maxworkers4.log`） |
| `git apply --check` / `git apply`（干净固定基线） | 均退出 0，落地 60 个文件 |
| 续作（Node24 直接入口）：同组件临时对照测试 `--maxWorkers=1`，固定上游未打补丁 | 1 passed；键盘勾选后焦点保持（临时对照测试不入交回补丁） |
| 续作：同一输入，已交补丁修复前 | 1 failed；焦点离开同一 block 的新复选框（原始失败输出保留） |
| 续作：同一输入，修复后 | 1 passed |
| 续作：`node node_modules/vitest/vitest.mjs run tests/memo-content-view.test.tsx --maxWorkers=1`，修复前 | 1 failed / 44 passed（新增回归真实失败） |
| 续作：同一入口，修复后 | 45 passed |
| 续作：`node node_modules/vitest/vitest.mjs run <显式 7 files> --maxWorkers=4` | 退出 0，7 files / 72 tests passed |
| 续作：`node node_modules/typescript/bin/tsc --noEmit --skipLibCheck` | 退出 0 |
| 续作：`node node_modules/@biomejs/biome/bin/biome check src tests` | 退出 0，663 files，无修复 |
| 续作：`node node_modules/vite/bin/vite.js build` | 退出 0，约 16s；仅既有 chunk 体积与插件耗时警告 |
| 续作：更新补丁在干净固定基线 `git apply --check` / `git apply` | 均退出 0，60 个文件（56 modified + 4 new） |
| 续作：导出的更新补丁在另一干净固定检出上重跑 `tests/memo-content-view.test.tsx` | 45 passed |

旧日志的准确解读：

- 原 `full-test-workers4.log` 的命令行是 `vitest run "--" "--maxWorkers=4"`，其 191 files / 1593 tests passed 是真实的全量通过，但**不是受控 4 worker**运行；该日志保留，不再作为 worker 限制证据。
- 更早的默认并行全量出现过 1–2 个动态导入型用例超时；当时没有固定干净基线对照，**失败原因未确立**，不能断言是既有缺陷。本轮受控全量在 Node22 子进程与 Node24 PATH 下均全部通过（191 files / 1602 tests），但没有重跑默认并行，也不据此推断旧失败原因。

新增回归覆盖（全部使用项目 Vitest + Testing Library 与真实 `@usememos/editor` 渲染）：审查给出的“代码块使整表 raw”用例、多段列表、raw 内未完成子项保留父项上下文、`data-indent` 缩进子项、全完成 raw 列表隐藏与恢复、原文/勾选权限/代码/普通列表/链接保持、挂载后由 `useEffect`/`MutationObserver` 隐藏（jsdom 不能证明首帧无闪烁）、编辑模式保留全部任务、调用方关闭过滤时 raw 任务全显示。续作新增一条键盘焦点回归：把带未完成子项的父项勾成已完成后，父项仍显示，刷新后同一 block 的新复选框保持焦点。受影响的 7 个测试文件为 `memo-content-view`、`memo-task-visibility`、`memo-editor-view`、`memo-detail-access`、`memo-reading-options`、`device-preferences`、`preferences-media-metadata`，合计 72 passed（上一轮 71）。匿名 share 路由测试只验证开关在路由上可达，它 mock 了 `MemoView`；真实内容渲染由 `memo-content-view.test.tsx` 单独覆盖。

## 独立审查

- 父级独立工程审查（新上下文，只读）在上一版补丁上提出两项必须修正：R1 raw Markdown 列表未过滤；R2 全量测试参数未生效、失败因果说明过度。两项均按上文修复，并保留原通过/失败日志。
- 上一阶段的独立审查另提出并已修复两个 should-fix（勾选后父项残留、分享图片丢任务），复审为 `CONFIRMED`。本轮修正由 native Workflow 第二阶段独立只读验证：未发现 R1/R2 代码阻断；指出 3 处报告准确性问题（Node 运行时归因、用户级路径表述、日志与首帧措辞），本轮已按实际日志修正。父执行端原独立审查者随后仅复核R1/R2受影响delta，确认两项均解决，未发现新的实质代码缺陷；一处日志索引占位说明已据原始调用更正，未重跑或改写原日志。
- 明确边界：真实浏览器仍未运行且被禁止；匿名路由测试用 mock `MemoView`，只证明开关可达，不证明内容过滤；上一阶段执行席自述曾误触工作目录外的 pnpm 依赖检查并已恢复，独立审查未验证全局状态；本轮为定位既有 pnpm 做过只读查看（`ls`/`pnpm -v`），未修改任何用户级路径或配置；模型响应里的 `canonicalModel` 别名不是独立 API 模型证明。
- 续作二改的定位、修复与回归由实施席自检；Workflow 完成后，原调用收口时以新上下文执行了一次只读独立实质复审。复审确认根因归因、编辑器调用/刷新顺序、修复路径与补丁完整性成立，未发现新增代码缺陷；提出并已修正两处公开文本/证据表述：字面负结果的已交补丁原始日志缺失（改为按实际证据陈述）与 07 把“只在已交补丁复现”写成“两版复现”。另记录一项测试覆盖边界（回归直接渲染 `MemoContentView`，未覆盖 react-query 回写路径）与任务被隐藏后的焦点既有边界，均未扩修。续作未改公共流程、台账或目录。

## 模型与执行元数据

| 角色 | 实际客户端/模型（取自响应元数据） | 时间 |
| --- | --- | --- |
| 原实施 | Claude Code native Workflow 子代理；assistant 响应元数据 `model=deepseek-flash` | 2026-10-25 05:02–05:51 +08:00 |
| 原实施内复核 | Claude Code CLI；客户端日志报告 `canonicalModel=deepseek-v4.1-flash[1m]`（别名，非独立 API 证明） | 2026-10-25 05:21–05:48 +08:00 |
| 原独立验证（Workflow 第二阶段） | Claude Code native Workflow 子代理；assistant 响应元数据 `model=deepseek-flash` | 2026-10-25 05:51–06:09 +08:00 |
| 本轮修正实施与自检 | Claude Code native Workflow 子代理；assistant 响应元数据 `model=deepseek-flash` | 2026-10-25 06:24–07:00 +08:00 |
| 独立复审（本轮修正） | Claude Code native Workflow 第二阶段子代理；assistant 响应元数据 `model=deepseek-flash`；结论：R1/R2 无代码阻断，报告准确性问题已列并修正 | 2026-10-25 06:52–07:01 +08:00 |
| 续作实施与自检（A-MEMOS-CONTINUATION-001） | Claude Code native Workflow 子代理；原始响应 `message.model=deepseek-flash`，请求别名另记 | 原调用 2026-10-25 09:35:29–10:13:37 +08:00（含收口与独审） |
| 人工介入 | 无任务内人工介入；本轮未做全局或用户级安装改动 | — |

Workflow 子代理的 assistant 响应元数据为 `model=deepseek-flash`；部分 CLI 日志另报 `canonicalModel=deepseek-v4.1-flash[1m]`，该别名未通过独立 API 校验，不能据此断言实际服务型号。型号以客户端响应记录为准，未知处不补写。续作父调用、两个 Workflow 阶段与新上下文独立复审原始响应均记录 `message.model=deepseek-flash`；请求别名 `deepseek-v4.1-flash[1m]` 不作为后端具体型号证明。

## 残余风险与未验项

- 真实浏览器、Playwright、Memos 服务、demo、示例账户/数据库、桌面操作均未运行；不能用 jsdom、终端 DOM 或截图称为真实浏览器验收。
- 负责人需在获准且可用的浏览器入口中匿名打开上游公开示例 `samramen000001`（完成食材 + 未完成 scallions）与 `rendertest0001`，经真实列表/详情切换、刷新及恢复核对可见内容与无写请求；当前缺少该入口，接收端不负责解决权限问题，也不承诺负责人会自动完成。
- 键盘勾选的焦点退化已按稳定 block id 修复，并覆盖“勾选后成为已完成、仍因未完成子项显示”的任务；真实浏览器 Tab 顺序、跨页刷新，以及任务被隐藏后焦点去向仍未验。字面意义上“勾选已经完成的父项（取消完成）”在 jsdom 未复现焦点丢失，但仅有固定上游的汇总级通过日志；若真实浏览器另有表现，需要新的真实入口证据。
- raw 块内被隐藏的完成项仍保留在 DOM 中（只隐藏不改写），搜索若只命中其文字不会产生可见高亮；block 视图隐藏的条目不保留文字。
- 编辑器在 raw 块内绘制的任务复选框在固定上游版本中本来就不能勾选（嵌套元素没有 `data-block-id`，点击不会走到对应任务），本功能未改这一既有行为，也没有让它更差。
- block 视图包装块的隐藏依赖 `:has()` 选择器；raw 列表条目的隐藏不依赖它。目标浏览器的实际显示仍在待验范围。
- 本次不证明“消费者目标驱动浏览器闭环”的方法收益，只证明已配置编码 Agent 的工程实施与检查；只有负责人确认后才 accepted。

## 许可与待接收

- 固定提交的 `LICENSE` 为 MIT。补丁只含 memo 前端相关改动，保留上游必要版权与许可归属；未复制完整仓库进知识库。
- 工程结果可接收；真实界面/浏览器验收待负责人。

**依据**：[一手] 固定上游 [usememos/memos提交](https://github.com/usememos/memos/commit/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2)、[MIT LICENSE](https://github.com/usememos/memos/blob/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2/LICENSE)，本次原始补丁应用、Node24定向测试、lint与build结果，以及同组件键盘激活路径模拟回归的固定上游／补丁前／修复后对照；[经验] 仅针对当前补丁的产品取舍及两轮独立工程审查。原始记录留本机；核实2026-10-25。

发布空白检查说明：补丁保留unified diff上下文空行必需的单空格前缀，外层仓库的 `git diff --check` 会将这些上下文行报告为行尾空白，不能直接删去。实际上游源码的空白检查及补丁应用检查已通过；本仓非patch文本的空白检查通过。
