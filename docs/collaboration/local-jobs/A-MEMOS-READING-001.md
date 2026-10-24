# A-MEMOS-READING-001 · 未完成任务阅读模式

id: A-MEMOS-READING-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: c1faa7d346e49fcc15043ee7e096ff9ae19866d0
result_branch: relay/a-memos-reading-001
upstream_repo: usememos/memos
upstream_commit: 0bfa31e89ec550c7cc6a1dea3888af2d0de107c2

## 目标与固定来源

用已配置的 DSH＋DeepSeek、Claude Code＋DeepSeek 或 ZCode 实际完成一个真实产品功能：阅读 memo 时可以隐藏已完成事项，恢复显示时内容完整，原始 Markdown 不变。这是普通生产采用，不是 P79 实验；不重跑通道探针，不施加 P79 的隔离、轮次或 token 限制。遵守本目录 README 和 operations§2.2 的认领与结果交接规则；本文件不新增账号、环境、安装或费用授权。

- 真实需求：[Memos #6476](https://github.com/usememos/memos/issues/6476)，2026-10-15 提出，2026-10-24 核为 open、无人认领。用户希望自己及分享后的读者能看清剩余事项。精确关联 PR 搜索未命中；旧 #6028 是删除完成项、已关闭未合并，不作为隐藏实现。
- 固定源码：[0bfa31e89ec550c7cc6a1dea3888af2d0de107c2](https://github.com/usememos/memos/commit/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2)，提交时间 2026-10-24 11:48:46 UTC；对应 Git tree 为 `080b9458635ec846b156fbdb079c9a33badf50aa`。上述 upstream_commit 是 commit SHA，不是 tree SHA。
- 许可：[该提交 MIT LICENSE](https://github.com/usememos/memos/blob/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2/LICENSE)。保留必要版权和许可归属，不复制完整仓库进知识库。

## 产品决定与实现边界

1. 最小方案定为**当前浏览器全局阅读偏好**，默认显示全部任务；不是每条 memo 的服务器字段，也不是仅 Timeline 生效的视图设置。沿现有 `useDevicePreferences` 模式保存布尔偏好，切换影响列表及详情中的只读内容。访客可使用同一阅读开关，不把控件藏在登录后的设置页。
2. 给真实阅读界面提供有明确文字、键盘可操作的显示／隐藏开关；按项目现有组件与翻译惯例实现，不另造设置框架。检查实际布局后选择最小入口，使匿名详情读者也能找到。不要伪称分享链接携带设置：本功能不改变 URL、分享权限、接收者偏好或账户设置。
3. 只改变展示，不删除或重写源 Markdown，不发送 memo 更新请求，不改变权限。编辑模式始终显示全部原文；保留原有任务勾选权限及更新语义，不因过滤后位置变化而勾错原文中的任务。代码块、普通列表、链接、附件和其他内容保持原行为。
4. 检查真实渲染器再选实现，不假定旧 ReactMarkdown 架构。固定版本的 `MemoContentView` 经 `MemoMarkdown` 使用 `@usememos/editor`；`ViewContext` 的偏好只在特定时间线启用，不能仅在那里接线就声称详情支持。对嵌套任务保留未完成子项及必要上下文，不因完成父项而静默吞掉未完成内容；全完成列表能恢复显示。说明实际选择，不扩成通用 Markdown 库修复。
5. 在独立临时公开源码检出中实现，只改相关前端、必要样式／翻译和测试。保留他人修改，不改后端、身份、凭据、数据库、部署、CI 或无关功能。

## 依赖、验证与浏览器边界

- 依赖以固定提交的 [web/package.json](https://github.com/usememos/memos/blob/0bfa31e89ec550c7cc6a1dea3888af2d0de107c2/web/package.json)、`web/pnpm-lock.yaml`、`web/pnpm-workspace.yaml` 和其中引用的 protobuf patch 为准。已核声明 Node >=24、pnpm 11.0.1、`@usememos/editor` 26.10.26；先检查实际工具，不换锁、不升级依赖。已有安装权限内使用官方来源和 `pnpm install --frozen-lockfile`；缺权限或环境不符时报告具体缺口，不以本文件扩权。
- 使用项目真实 Vitest／Testing Library 入口做定向单元和组件集成，覆盖默认／切换／恢复、列表与详情接线、访客可达控件、原文不变、编辑保留、任务勾选映射、嵌套和全完成内容、无写请求。必须包含真实渲染组件的相关集成验证；不能只用自制替身渲染器或字符串测试声称消费者通过。若 jsdom 不支持所需编辑器行为，如实列未验项，不用 mock 成功冒充实现已验。
- 执行相关测试、`pnpm lint`（含类型检查）与 `pnpm build`；记录实际命令、退出状态和关键结果。完整前端测试能在当前资源内运行时复用项目入口；发现无关既有失败须与固定基线对照后说明，不偷偷削弱测试或大修其他模块。
- 由新上下文独立 Agent 审查实际补丁、原文保持与权限／消费链接线；指出问题就修受影响部分并复验。不强制制造第二轮需求或改动，后续只接负责人真实反馈。
- **本次不启动或重试任何浏览器，不安装浏览器、不进行用户桌面或浏览器操作，不启动 Memos 服务或 demo，不初始化示例账户／数据库，不登录。** 既有 Playwright socket 权限失败和已拒浏览器入口保持原状，不换路绕过。本任务只交工程结果，不能用终端 DOM、jsdom 或截图替身称为真实浏览器验收。

## 结果文件与接收

只将必要交付物平铺到本仓已有 `experiments/`，不新增目录或编号专题：

- `experiments/memos-reading-adoption.patch`：相对固定上游 commit 的完整可应用补丁，包含相关源码与测试；不含 node_modules、构建包、缓存或账号材料。
- `experiments/memos-reading-adoption.md`：简短说明产品决定、应用补丁／安装／运行相关检查的步骤、实际模型执行与独审结果、已通过／失败／未运行、许可归属及待接收项。确有必要的附属素材放同目录并用本任务前缀命名，勿为展示另做图片。
- 本任务文件：回写认领、实际进度和最终 `review_ready`，给结果分支／提交链接。模型元数据只写实际客户端、可核型号、执行时间、实施与审查职责及必要人工介入；型号不明写未知，不提交私人会话标识、机器路径、凭据或原始敏感日志。公开检查按仓库 §7 执行，不向上游开 PR、留言或部署。

负责人后续的真实消费者目标是：在获准且可用的浏览器入口中，匿名打开上游公开示例 `samramen000001`（完成食材与未完成 scallions）和 `rendertest0001`，经真实列表／详情切换、刷新及恢复，核对可见内容与无写请求。当前**缺少获准且可用的真实浏览器验收入口**；接收端不负责解决这个权限问题，也不承诺负责人会自动完成。上游 demo seed 仅作为公开输入参考，本次不执行它。

方法判断保持候选：本次可以证明已配置编码 Agent 的工程实施和检查，不证明“消费者目标驱动浏览器闭环”的质量或周转收益。工程可接收与真实界面／浏览器待验分别记录，只有负责人确认后才 accepted。

## 执行与结果

认领：dot 本地协作；2026-10-24T20:59:39.730488+00:00。任务来源 main 固定提交 `f2fed3e`。认领发布后在独立检出与原生 Workflow 中执行；仅写本任务指定文件，结果推指定分支供 dot-A 接收整合，不重跑联通或旧实验。

进度（2026-10-25）：

- 修复轮完成父级独立审查的两项修正，补丁与报告已重出；最终状态 `review_ready`。
- R1（raw 列表）：旧实现只处理 block 模型里的 `listItem`。`@usememos/editor 26.10.26` 在列表项含第二段或代码块时，用 `fitsModel` 把整个列表降为一个 raw Markdown 块，`blockView` 看不到其中条目，普通完成项因此不隐藏。现新增 `applyCompletedTaskVisibility`：在 raw 块的真实渲染 DOM（`.mbe-view-markdown`）上按“DOM 后代 + 流内 `data-indent` 兄弟”判断嵌套，给可隐藏的完成项加标记与 `hidden`，CSS `display: none` 覆盖编辑器的 `display: flex`；偏好变化同步应用，编辑器重绘由 `MutationObserver` 重放。未自写 Markdown 解析器、未字符串改写源 Markdown、未动共享编辑器包。新增 9 个真实 `MemoContentView` 回归：代码块使整表 raw、多段列表、未完成子项保留父项上下文、缩进子项、全完成隐藏/恢复、原文与勾选权限/代码/普通列表/链接保持、挂载后经 effect/MutationObserver 隐藏（jsdom 不能证明首帧无闪烁）、编辑模式保留全部任务、调用方关闭过滤时 raw 任务全显示。
- R2（测试参数）：原报告把 `pnpm test -- --maxWorkers=4` 当作受控 4 worker 全量；实际 Vitest 将 `--maxWorkers=4` 放进 `options['--']`，worker 未受限。原日志保留，不再作为限制证据。调用 `vitest run --help` 确认 `--maxWorkers` 是顶层选项后，用绝对 `--dir` 重跑 `pnpm exec vitest run --maxWorkers=4`：首轮 pnpm 启动器为 bundled Node `v24.19.0`，但 vitest 子进程经 PATH 解析为 Node `v22.23.2`，退出 0，191 files / 1602 tests passed，作为 Node22 子进程结果保留。随后把 bundled Node24 的 bin 置于 PATH，确认 `node -v` 与 `pnpm exec node -v` 均为 `v24.19.0`，同一入口复跑退出 0，191 files / 1602 tests passed（约 221s）。旧默认并行全量偶发 1–2 个动态导入超时；没有固定干净基线对照，失败原因未确立，不断言为既有缺陷。
- 定点验证：`memo-content-view` 修复前 7 failed / 36 passed，修复后 44 passed；相关 7 个测试文件合计 71 passed（首轮日志的 vitest 子进程为 Node22）；将 bundled Node24 置于 PATH 后，显式 7 files 复跑 71 passed，`pnpm lint`（tsc + Biome，663 files）与 `pnpm build` 均退出 0。命令、输出与退出状态写入任务私有 `repair-1/logs/`，旧日志未覆盖；两段原始输出与运行元数据另存 `repair-1/raw/`（`targeted-repair.raw.txt`、`repair-verification.raw.txt`、`run-metadata.json`）。
- 补丁复核：相对固定提交 `0bfa31e89ec550c7cc6a1dea3888af2d0de107c2` 重新导出 `experiments/memos-reading-adoption.patch`，含全部 60 个改动/新增文件；在干净固定基线 `git apply --check` 与 `git apply` 均退出 0。
- 产品实现不变的部分：当前浏览器 `hideCompletedTasks` 设备偏好（默认关闭）；详情页（含匿名 share 路由）提供带文字、可聚焦开关；源 Markdown、block id、写请求、权限与编辑模式全文保持不变；嵌套未完成子项保留父项上下文，全完成列表可恢复；分享图片导出不受偏好影响。
- 审查与验证历史：上一阶段独立审查提出并修复 2 个 should-fix（勾选后父项残留、分享图片丢任务），复审 `CONFIRMED`；Workflow 第二阶段只读复检为 `review_ready`。本轮修正由 native Workflow 第二阶段独立只读验证：未发现 R1/R2 代码阻断，指出 3 处报告准确性问题；本轮已按实际日志修正，父执行端原独立审查者随后仅复核R1/R2受影响delta，确认两项均解决、未发现新的实质代码缺陷；日志索引占位说明已据原始调用更正，未重跑或改写原日志。
- 明确边界：真实浏览器仍未运行且被禁止；匿名 share 路由测试 mock 了 `MemoView`，只证明开关可达，真实内容渲染由 `memo-content-view.test.tsx` 单独覆盖；上一阶段执行席自述误触工作目录外 pnpm 依赖检查并已恢复，独立审查未验证全局状态；本轮为定位既有 pnpm 做过只读查看（`ls`/`pnpm -v`），未修改任何用户级路径或配置；`canonicalModel` 别名不是独立 API 模型证明。
- 模型元数据（取自响应元数据）：原实施为 Claude Code native Workflow 子代理，`model=deepseek-flash`，2026-10-25 05:02–05:51 +08:00；实施内复核为 Claude Code CLI，客户端日志报告 `canonicalModel=deepseek-v4.1-flash[1m]`（别名，非独立 API 证明），05:21–05:48；原独立验证为 native Workflow 第二段子代理，`model=deepseek-flash`，05:51–06:09；本轮修正与自检为 native Workflow 子代理，assistant 响应元数据 `model=deepseek-flash`，06:24–07:00；本轮独立复审为 native Workflow 第二段子代理，`model=deepseek-flash`，06:52–07:01，结论 R1/R2 无代码阻断、报告准确性问题已列出并修正；无任务内人工介入，本轮无全局安装改动。
- 未运行：真实浏览器、Playwright、Memos 服务、demo、示例账户/数据库及桌面操作；等待负责人真实浏览器验收（`samramen000001`、`rendertest0001`）。工程可接收与浏览器待验分开记录，不声称方法收益或 accepted。
- 结果分支：`relay/a-memos-reading-001`（当前工作树按任务规则未提交，父级负责发布；不提供未产生的提交链接）。状态：`review_ready`。

父执行端最终工程审查发现 raw 列表遗漏与全量测试参数说明错误；本轮只做有证据的定向修正，原结果、失败和通过日志保留，未重做原实施或联通。

### 父执行端最终工程接收准备

原调用2026-10-24 21:01:42—22:11:57 UTC完成；同任务原会话的定向修复调用22:24:06—23:09:15 UTC完成，两次各一次父进程启动，原始阶段及失败均保留。原调用与修复各阶段assistant实际model为 `deepseek-flash`；内部CLI复核仅有canonical别名的部分继续按未独立获证处理。原独立工程审查者已对修复delta确认R1/R2解决；补丁仍是固定上游的60文件变更，与当前源树一致。Node24下七文件71测试、全量191文件1602测试、lint和build均通过；不把早期错误参数或未确立因果的超时改写成有效证明。

父端只修正公开回执的追溯文字并核对产物；用户级npm恢复继续明确为执行席报告、未独立验证，不扩大为全局状态通过。工程结果交 `review_ready`，真实浏览器入口、视觉／键盘／刷新表现及负责人最终接收仍待原明确条件，不启动服务或浏览器，不宣称方法收益或accepted。

此前在制记录（现已完成修订，保留历史）：

最终工程审查发现并已隔离两项需修订内容：真实编辑器把含多段／代码块的整个列表保留为raw Markdown，当前过滤会漏掉同列表的普通完成项；原全量命令中的额外 `--` 没有实际设置4-worker上限，原通过结果保留但不能据此归因并发超时。现继续原任务，仅修Memos展示层、真实组件回归与说明，保留原始失败；不改通用编辑器库，不新增浏览器、服务或用户级npm操作。

最终发布检查：文档／JSON检查355 files／0 errors，公开文件及提交扫描616 files／0 findings。实际上游源码空白、干净应用与导出一致性复用通过证据；本仓非patch文本空白检查通过。`.patch` 的unified diff上下文空行保留单空格语法前缀，外层diff检查的相应行尾提示不代表源码空白缺陷，未删改补丁上下文。

发布：指定结果分支固定提交 [62e5cee](https://github.com/dbvv1/a1dbv/commit/62e5ceeae99eb1b4b1d717ecd1af52da2c598c59)，包含完整补丁、工程报告及本任务；main仅回写任务与固定链接，未合入补丁或上游产品。已完成工程修复及受影响delta独立确认，交dot-A接收；真实浏览器验收仍受原明确边界限制，工程接收不替代该环节。
