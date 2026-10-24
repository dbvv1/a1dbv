# Memos 未完成任务阅读模式（A-MEMOS-READING-001）

核实时间：2026-10-25
上游：usememos/memos，固定提交 `0bfa31e89ec550c7cc6a1dea3888af2d0de107c2`（tree `080b9458635ec846b156fbdb079c9a33badf50aa`），许可证 MIT。
证据等级：实测命令、退出状态与测试计数为 [一手]；产品取舍、残余风险与审查判断为 [经验]。

## 结论

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

## 实际执行与检查

本轮修复的原始命令、输出与退出状态保存在任务私有目录 `repair-1/logs/`（`memo-content-view-repair.log`、`affected-tests-final-repair.log`、`lint-repair.log`、`build-repair.log`、`full-suite-maxworkers4-repair.log`、`full-suite-maxworkers4-final-repair.log`、`node24-runtime-check.log`、`affected-tests-node24-files.log`、`lint-node24.log`、`build-node24.log`、`full-suite-node24-maxworkers4.log`）；两段原始输出与运行元数据在 `repair-1/raw/`；上一阶段日志保留未覆盖。两个定向日志的命令行仍使用 `<7 files>`／`<7 explicit files>` 占位；完整七文件清单由本机保留的2026-10-24 23:02:38 UTC原始Bash调用绑定，下文列名与该实际调用一致，日志占位不当作完整命令。

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

旧日志的准确解读：

- 原 `full-test-workers4.log` 的命令行是 `vitest run "--" "--maxWorkers=4"`，其 191 files / 1593 tests passed 是真实的全量通过，但**不是受控 4 worker**运行；该日志保留，不再作为 worker 限制证据。
- 更早的默认并行全量出现过 1–2 个动态导入型用例超时；当时没有固定干净基线对照，**失败原因未确立**，不能断言是既有缺陷。本轮受控全量在 Node22 子进程与 Node24 PATH 下均全部通过（191 files / 1602 tests），但没有重跑默认并行，也不据此推断旧失败原因。

新增回归覆盖（全部使用项目 Vitest + Testing Library 与真实 `@usememos/editor` 渲染）：审查给出的“代码块使整表 raw”用例、多段列表、raw 内未完成子项保留父项上下文、`data-indent` 缩进子项、全完成 raw 列表隐藏与恢复、原文/勾选权限/代码/普通列表/链接保持、挂载后由 `useEffect`/`MutationObserver` 隐藏（jsdom 不能证明首帧无闪烁）、编辑模式保留全部任务、调用方关闭过滤时 raw 任务全显示。受影响的 7 个测试文件为 `memo-content-view`、`memo-task-visibility`、`memo-editor-view`、`memo-detail-access`、`memo-reading-options`、`device-preferences`、`preferences-media-metadata`。匿名 share 路由测试只验证开关在路由上可达，它 mock 了 `MemoView`；真实内容渲染由 `memo-content-view.test.tsx` 单独覆盖。

## 独立审查

- 父级独立工程审查（新上下文，只读）在上一版补丁上提出两项必须修正：R1 raw Markdown 列表未过滤；R2 全量测试参数未生效、失败因果说明过度。两项均按上文修复，并保留原通过/失败日志。
- 上一阶段的独立审查另提出并已修复两个 should-fix（勾选后父项残留、分享图片丢任务），复审为 `CONFIRMED`。本轮修正由 native Workflow 第二阶段独立只读验证：未发现 R1/R2 代码阻断；指出 3 处报告准确性问题（Node 运行时归因、用户级路径表述、日志与首帧措辞），本轮已按实际日志修正。父执行端原独立审查者随后仅复核R1/R2受影响delta，确认两项均解决，未发现新的实质代码缺陷；一处日志索引占位说明已据原始调用更正，未重跑或改写原日志。
- 明确边界：真实浏览器仍未运行且被禁止；匿名路由测试用 mock `MemoView`，只证明开关可达，不证明内容过滤；上一阶段执行席自述曾误触工作目录外的 pnpm 依赖检查并已恢复，独立审查未验证全局状态；本轮为定位既有 pnpm 做过只读查看（`ls`/`pnpm -v`），未修改任何用户级路径或配置；模型响应里的 `canonicalModel` 别名不是独立 API 模型证明。

## 模型与执行元数据

| 角色 | 实际客户端/模型（取自响应元数据） | 时间 |
| --- | --- | --- |
| 原实施 | Claude Code native Workflow 子代理；assistant 响应元数据 `model=deepseek-flash` | 2026-10-25 05:02–05:51 +08:00 |
| 原实施内复核 | Claude Code CLI；客户端日志报告 `canonicalModel=deepseek-v4.1-flash[1m]`（别名，非独立 API 证明） | 2026-10-25 05:21–05:48 +08:00 |
| 原独立验证（Workflow 第二阶段） | Claude Code native Workflow 子代理；assistant 响应元数据 `model=deepseek-flash` | 2026-10-25 05:51–06:09 +08:00 |
| 本轮修正实施与自检 | Claude Code native Workflow 子代理；assistant 响应元数据 `model=deepseek-flash` | 2026-10-25 06:24–07:00 +08:00 |
| 独立复审（本轮修正） | Claude Code native Workflow 第二阶段子代理；assistant 响应元数据 `model=deepseek-flash`；结论：R1/R2 无代码阻断，报告准确性问题已列并修正 | 2026-10-25 06:52–07:01 +08:00 |
| 人工介入 | 无任务内人工介入；本轮未做全局或用户级安装改动 | — |

Workflow 子代理的 assistant 响应元数据为 `model=deepseek-flash`；部分 CLI 日志另报 `canonicalModel=deepseek-v4.1-flash[1m]`，该别名未通过独立 API 校验，不能据此断言实际服务型号。型号以客户端响应记录为准，未知处不补写。

## 残余风险与未验项

- 真实浏览器、Playwright、Memos 服务、demo、示例账户/数据库、桌面操作均未运行；不能用 jsdom、终端 DOM 或截图称为真实浏览器验收。
- 负责人需在获准且可用的浏览器入口中匿名打开上游公开示例 `samramen000001`（完成食材 + 未完成 scallions）与 `rendertest0001`，经真实列表/详情切换、刷新及恢复核对可见内容与无写请求；当前缺少该入口，接收端不负责解决权限问题，也不承诺负责人会自动完成。
- 键盘勾选一个仍显示的已完成父项后，block 视图重绘会丢失该复选框焦点（鼠标不受影响）。
- raw 块内被隐藏的完成项仍保留在 DOM 中（只隐藏不改写），搜索若只命中其文字不会产生可见高亮；block 视图隐藏的条目不保留文字。
- 编辑器在 raw 块内绘制的任务复选框在固定上游版本中本来就不能勾选（嵌套元素没有 `data-block-id`，点击不会走到对应任务），本功能未改这一既有行为，也没有让它更差。
- block 视图包装块的隐藏依赖 `:has()` 选择器；raw 列表条目的隐藏不依赖它。目标浏览器的实际显示仍在待验范围。
- 本次不证明“消费者目标驱动浏览器闭环”的方法收益，只证明已配置编码 Agent 的工程实施与检查；只有负责人确认后才 accepted。

## 许可与待接收

- 固定提交的 `LICENSE` 为 MIT。补丁只含 memo 前端相关改动，保留上游必要版权与许可归属；未复制完整仓库进知识库。
- 工程结果可接收；真实界面/浏览器验收待负责人。

**依据**：[一手] 固定上游 [usememos/memos提交](https://github.com/usememos/memos/commit/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2)、[MIT LICENSE](https://github.com/usememos/memos/blob/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2/LICENSE)，本次原始补丁应用、Node24定向／全量测试、lint与build结果；[经验] 仅针对当前补丁的产品取舍及两次独立工程审查。原始记录留本机；核实2026-10-25。
