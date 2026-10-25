# A-MEMOS-CONTINUATION-001 · 接手既有功能并处理真实键盘反馈

id: A-MEMOS-CONTINUATION-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 08672c65540ce65fc45edec51ccb856e67d78a28
result_branch: relay/a-memos-continuation-001

## 目标与实际消费者

继续已交付 Memos 阅读模式，不换仓库延长通用修复系列。现有报告记录：键盘勾选仍然可见的已完成父项后，block 视图重绘丢失复选框焦点。目标是让实际编码 Agent 接手固定产物、读取需要的编辑器窄知识、据真实组件反馈选择实现并完成二改；读者获得已有项目连续修改的可复制起点。

输入为固定上游 usememos/memos `0bfa31e89ec550c7cc6a1dea3888af2d0de107c2`、现有 `experiments/memos-reading-adoption.patch`／`.md`、A-MEMOS-READING-001 的公开回执与有效审查。先核最新 main 和其他在制，复用既有 Node24、锁文件、真实编辑器组件及测试，不从私人日志取证。

## 实施与取舍

先用同一真实组件和键盘输入核对固定上游与已交补丁，判断焦点问题是既有行为还是新增刷新退化。这是普通回归定位，不是正式方法对照。新增 handleTaskToggle 后的 refreshViews 是待核线索，不预设根因。

实际目标：切换后仍存在且可见的任务保持合理焦点；不改变原 Markdown、勾选权限、父子过滤、分享图片或编辑模式。按需要读取编辑器 API／状态生命周期源码，比较最小刷新与可靠身份定位等实现，说明哪条证据改变选择，不先建通用焦点框架。只有本补丁新增或加重问题才修；若上游已存在且未加重，记录具体归因，不擅自扩成编辑器修复。任务消失后的焦点规则只在本次真实需求必须时处理，不扩边界矩阵。

可写范围：现有 `experiments/memos-reading-adoption.patch`、`experiments/memos-reading-adoption.md`、`docs/07-workflows.md` 与本任务。补丁仍须完整可应用于同一固定上游。07 在现有功能路线处补一个短小的“接手固定产物→定位新反馈→加载窄知识→二改→接收”起点；结果不足则保留明确未完成，不包装为成功。详细调试留实验记录，不重复长篇限制，不新建专题、目录、台账或流程。

## 验证、权限与交回

正常已配置 Claude Code＋DeepSeek／DSH／ZCode 原生 Workflow；可以把独立源码调查与回归定位并行，实施单一写者，随后一次全新上下文有效独审。记录实际客户端／响应型号、关键人工选择、实际起止和真实产物。

在允许的 Node24／Vitest／Testing Library 真实组件入口取得失败→通过证据；按手册§7重验受影响组件、类型／构建与补丁应用，复用未受影响结果。不为纯正文重跑实验。若无法复现，保存具体输入、结果与自然恢复条件，不制造故障。公开文件、提交身份和空白检查必做。

真实浏览器、视觉、Tab 顺序及跨页刷新依然未验；不启动浏览器、服务、demo、账户或数据库，不重试已拒动作，不把 jsdom 叫浏览器通过。不外发 PR／issue、不部署、不新建会话或调度。只推指定结果分支，回写本任务 review_ready，由 dot-A 接收。发布前 fetch；07 或补丁有并发变化先协调，不覆盖。

认领：dot 本地协作；2026-10-25T01:34:18.215737+00:00。来源 main 固定 `d93709a`；两个任务无文件重叠，先发布认领后沿既有正常原生 Workflow 执行，复用原产物与有效结果。仅推各自指定结果分支。

## 执行与结果

执行时间：2026-10-25 09:34–09:52 +08:00（Asia/Shanghai）；父级独立复审与文本修正至 10:12 +08:00。`review_ready`；本执行席未提交或推送，结果分支与 main 由父级发布。

输入与复用：固定上游 `usememos/memos@0bfa31e89ec550c7cc6a1dea3888af2d0de107c2`；在本任务私有目录从既有本地源建干净 worktree，任务内 junction 复用既有 `web/node_modules`，未改 `package.json`／`pnpm-lock.yaml` 或全局配置。先在新检出的同一固定上游应用当前已交补丁（60 文件）。

定位与取舍：

- 用同一真实 `MemoContentView`／`@usememos/editor` 组件和键盘勾选输入（`click` 且 `detail === 0`）对照固定上游与已交补丁。字面“勾选已经完成的父项（取消完成）”没有复现焦点丢失；固定上游留有汇总级通过日志，已交补丁未为该字面输入保留独立原始日志。把输入限定为 `- [ ] Parent\n  - [ ] Child`、开启隐藏完成项、勾选后父项成为已完成且仍因未完成子项显示，固定上游保持焦点，已交补丁丢失同一 block 的新复选框焦点。
- 源码归因：编辑器 `toggleTaskAt` 在应用与重绘后只恢复一次焦点；`MemoContentView.handleTaskToggle` 在 `onChange` 中追加 `refreshViews(MEMO_TASK_VISIBILITY_EXTENSION)`，经 `dropViews → invalidate → paint` 再建该 block 元素，不再恢复焦点。属本补丁新增退化，不是上游既有行为。
- 选择保留刷新（否则勾选最后一个未完成子项后，上方已完成父项不会隐藏；最小刷新也排除不了刚勾选的 block），在刷新后按稳定 `data-block-id` 聚焦同一 block 的新复选框；任务被隐藏时不强设相邻焦点，不建焦点框架。

产物：

- `experiments/memos-reading-adoption.patch`：更新为相对固定提交的完整补丁，60 个文件（56 modified + 4 new），含焦点修复与 1 条同组件回归。
- `experiments/memos-reading-adoption.md`：追加本轮反馈、归因、取舍、证据与未验项；更新执行与模型元数据、残余风险。
- `docs/07-workflows.md`：在既有阅读功能路线补“固定产物→同输入区分既有行为与新增退化→只读窄源码→单一最小二改→失败→通过证据交回”的接手起点。
- 本任务文件：回写 `review_ready`。

验证（Node24 `v24.19.0`，均从任务上游 `web/` 执行）：

- 固定上游未打补丁：同一输入 1 passed（焦点保持）；已交补丁修复前 1 failed（焦点离开同一 block 的新复选框）；修复后 1 passed。
- `memo-content-view.test.tsx`：修复前 1 failed / 44 passed，修复后 45 passed。
- 受影响 7 个测试文件：7 files / 72 tests passed（上一轮 71，新增焦点回归）；全量 191 files / 1602 tests 未重跑，沿用上一轮未受影响结果。
- `tsc --noEmit --skipLibCheck` 退出 0；`biome check src tests` 退出 0（663 files，无修复）；`vite build` 退出 0（约 16s，仅既有警告）。
- 更新补丁在干净固定基线 `git apply --check`／`git apply` 均退出 0，落地 60 文件；导出的补丁在另一干净固定检出重跑 `memo-content-view` 45 passed。
- 公开检查：`python3 scripts/check_repo.py` 与 `python3 scripts/check_public.py` 退出 0、无发现；非 patch 文本 `git diff --check` 通过。补丁上下文空行按 unified diff 规则保留单空格，不能按普通文本删；见实验记录说明。
- 父级复跑 `node node_modules/typescript/bin/tsc --noEmit --skipLibCheck` 退出 0，原始输出存本任务 `evidence/tsc-node24.recheck.raw.txt`；交付检查指出的原空日志保留未改。

边界：真实浏览器、视觉、真实 Tab 顺序、跨页刷新未运行且仍被禁止，jsdom 回归不等于浏览器验收；任务被隐藏后的焦点规则未扩。未提交、未推送、未外发 PR／issue、未部署、未新建会话或调度。本执行席检查了本地 git 身份：当前配置的 `user.email` 不是 GitHub noreply／白名单 Agent 身份，直接提交会违反公开仓库要求且本任务不允许改配置；因此发布提交必须由父级用合规身份完成，并在提交后运行 `python3 scripts/check_public.py --commits origin/main..HEAD` 与暂存空白检查。当前 `origin/main..HEAD` 无新提交，提交扫描在发布前不产生有效结论。

模型与审查：本执行席为 Claude Code native Workflow 子代理；请求别名 `deepseek-v4.1-flash[1m]`；父调用、两个 Workflow 阶段及已完成的独立复审原始 assistant 响应 `message.model` 均为 `deepseek-flash`，后端具体型号未另证。二改为实施席自检与失败→通过回归。Workflow 完成后，原调用收口时以新上下文执行了一次只读独立实质复审：确认根因归因、编辑器调用/刷新顺序、修复路径与补丁完整性成立，未发现新增代码缺陷；提出并已修正两处公开文本/证据表述（字面负结果的已交补丁原始日志缺失、07 把“只在已交补丁复现”写成“两版复现”），另记录测试未覆盖 react-query 回写路径与任务被隐藏后的焦点为边界，未扩修。关键人工选择：无任务内人工介入。

本地执行端已读取上述独立复审的原始结论、核对两处公开表述修订与原始回归输出，复用这次有效审查，不另叠审查树。其提出的隐藏任务焦点为既有边界，异步回写覆盖缺口与回调前取焦点建议不作为已复现缺陷扩修。

Git 回传：指定结果分支 `relay/a-memos-continuation-001`，固定提交 [`e38fb3cbfb3fc53b71053c7344ed42dd993952d0`](https://github.com/dbvv1/a1dbv/commit/e38fb3cbfb3fc53b71053c7344ed42dd993952d0)。完整补丁仍针对同一固定上游，工程回归、类型／lint／构建与干净补丁应用结果见上；独立审查的问题已按证据修正公开表述。最终文档 361 文件、公开内容 622 文件、实际新增提交身份扫描和空白检查通过。main 只回传原任务，补丁与07留结果分支由 dot-A 接收；真实浏览器、Tab 顺序、跨页刷新仍未验。
