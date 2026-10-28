# 功能验收地图的持续维护：真实消费者、失效点与投入（采集单元 1）

> 整理与核实：2026-10-28。本单元只读公开原文与源码，未安装、未运行这两份 Skill 或任何候选仓库的脚本与维护流程，未执行产品验收；文中"运行"均指被引用的上游记录，不是本次复现。候选全部来自已核实清单，未新增搜索或链接。2026-10-28 重新打开并抽核了约 25 个 PR／issue 页面；完整读过正文的文件是 OpenHands `references/daily.md`、`references/adaptation.md`、Omnigent 的 `tests/dev/test_verify_omnigent_feature_map.py` 与 pstack `docs/guide/06-verify-and-ship.md`（固定 commit `c742dd61`），另核了 1 个 commit patch。其余条目的读取深度逐条在各条目内标明（"读取正文"、"核状态／日期"或"清单记录"）。

## 先给结论

1. **有真实产品在持续维护，但证据只集中在少数团队，而且维护产出会丢。** OpenHands 的 #18971 是 enyst 设置的每日自动维护在 `main@ec0f70f` 上的一次运行（前一次 map pass 为 #18929，2026-10-25，正文同样说明是每日自动运行并提到更早的 #18918／#18904）；verdict 为 delta pass，只驱动 `map affected` 列出的族，不是 28 族全量。该次给出 28 个 map 文件／799 个 ID、`map check` 0 problems、修掉 3 处过期说明、记录 1 个新 known failure、blocked 与 not-run 分开、baseline 推进到 `main@ec0f70fe31b6`；但 PR 自留两处未核数（F18 line 69 期望 Recommended 12、reviewer 实测 13，line 60 的 Enabled 计数可能差一），且 `map check` 0 problems 只证明索引与引用一致，不证明地图里的数值正确。紧随其后的 #18295 则显示：#18213 的 10-09 sweep 在 #18237／#18264 等较新地图更新合并后被关闭，修正滞留未合入；维护者人工请求 AI agent（Claude Code）把 `main` 仍缺的修正挑回，且 reviewer 明确"证据来自上次运行、未在新的 head 重跑"。
2. **上游自己没有维护实跑。** pstack #150 的测试计划把 "Human pass on the maintain skill" 留成未勾选项，原文写 "drafted from the same eval's structure but not itself exercised — flagging honestly"；#151 的四条修订来自合并前 39 秒的 bugbot 静态评论，PR 自述是 "literal-reading interactions"，不是维护运行发现。判断"有没有人真正维护"必须看下游。
3. **#334 是唯一给出 6 天 4 次＋一次全 9 功能 live pass 的自述样本；公开的连续维护序列见 OpenHands 每日自动化（#18929、#18971），但每日只跑 delta；周更／静态检查的产出另见 #1914、#10839，但都不是完整 live pass。** 私有 9 功能地图、6 天维护 4 次；一次 pass 用 9 个并行 reader、9 个功能全部实跑、修 7 个地图文件、修 1 个 harness 缺陷并重驱动。但地图私有、无公开 PR，只能算提交者自述。
4. **已经出现明确的"缩小／按变更维护"。** Hypertask #1914 由产品负责人同意，把每周 37 页 live drive 改成只重读代码变动的页、每次最多 8 页、2 个只读 helper、每周最多 1 张 ticket；旧 map-upkeep 因"只写没人看的本地报告"退役。OpenHands `daily.md` 把维护拆成静态（map check／coverage／testids）→变更（map affected --target）→smoke（每个未驱动族的第一入口 + errors sweep）→按日期轮转四层，只有 tier 2 全部跑完才 map baseline --set。afk-loop #38 决定不设定时维护，只在 PR 报告 feature file 缺失／过期时手动跑。
5. **维护会发现真问题；生成侧已出现错误前提（#573），维护侧尚无同题公开回执。** #18971 修的是三处说明漂移；#6616 补了 3 个漏掉的入口（Contacts、Social Scheduling、Soko Bots）并纠正 social-beta／vault 登录前提；#148 因 RSS 旧文案误报、login items 说明过期；#311 发现归档功能不可达。生成侧 #501 实测：false ready 使首次驱动提前并在缺失 role 上失败（数据库 socket 3 秒已应答、init 到 19 秒才完成），不是跑绿，也不是维护运行；#573 还规定种子数据不足时不许削弱 journey、stand-in 跑过的步骤在真机上仍算未验证。
6. **成本数据仍然缺。** 有页数与 ticket 上限（#1914）、维护次数与文件数（#334）、修正数与契约检查数（#10839：11 处修正、460 项检查）、usage counts（OpenHands 博客：170 次隔离启动、261 张截图），但没有 wall-clock／token／人工小时；Loam 的每日包装明说没跑过一次完整付费维护。
7. **适用范围有硬边界。** #457 报告者按客户端类重清点同一产品，surface 从 72 涨到 171、未覆盖从 56 涨到 154；create 第 1 步按"人实际接触什么"枚举，API、MCP、hook、设备代理会系统性漏掉。#716 是 formal 姊妹 Skill 的 54 次封存运行，结论 "Correctness: no real gain"，不能外推到功能地图。
8. **若 dot-A 要在已有产品窄试，最小可借的不是"每日全量维护"，而是一组分层机制**：逐功能覆盖表（#334）、静态 map 契约检查（Omnigent 测试、#1914 的 checker）、按 BASE..TARGET 的变更 delta（`daily.md`、#1914）、以及 readiness／seed／stand-in／empty-output 四条防假绿规则（#573、#383）。成立前提与欠证据见末节。

**若窄试，按这个顺序。** 核证据的第一步是回答"地图是否抓到现有 CI 抓不到的问题"（下面五项中的第 1 项）——若普通 review／测试也能抓到同样的 F18／F22／F08 漂移，地图就是重复劳动。决定窄试后，落地第一步是静态 map 契约测试（末节机制 1），再上覆盖表（机制 2），不要先跑每日全量 live pass。出现下列任一情况先停：没有可脚本化的 drive／evidence 入口；没有接收 map PR／ticket／baseline 的人；API／MCP／hook／设备代理多且没有客户端清单；无法证明地图能抓到现有 CI 抓不到的问题。

## 排序标准

按"是否改变试用决定"从高到低；同级按证据强度排序：

1. 真实产品在后续改动后实际跑过维护，并留下可核差量；**运行回执 > 源码／diff > 作者自述 > 规范文字 > 示例**。
2. 能回答维护是否发现新入口、过期前提、不可达功能、harness 失效，或是否错误改说明、削弱验收、误报 clean。
3. 有成本、缩小、撤回或改按变更选择的记录。
4. 能补本仓"复用项目检查、走真实路径、下一次自然修改继续维护"之外的机制。

只有规范文字、示例或作者整体宣传的条目排在后段，且不作为采用证据。

## 最值得先深挖的前五项

以下五项是核证据步骤，不是落地顺序；落地顺序见结论 8 后的"若窄试"。

### 1. OpenHands #18971 与 #18295：同一产品的维护成功与维护失效

**为什么最值。** 这不是"用了这个 Skill"的声明，而是两次带具体差量的维护 PR：一次修掉 F18 pill／Facet、F22 docked composer、F08 尾换行三处过期说明，并把 0 problems 的 map check、blocked／not-run 分布、baseline 推进都写出来；另一次证明维护 PR 被关闭后修正会 stranded，恢复只是把旧观察搬回，reviewer 明说没在新 head 重跑。要判断"值不值得在已有产品试用"，最直接的问题是：这三处漂移会不会被仓库现有测试／CI 抓到？如果只有地图抓到，地图有独立价值；如果普通 review 也能抓到，地图就是重复劳动。

**下一步可核输入。** 用公开的 F18／F22／F08 三处描述在 `main` 的当前状态，对照 OpenHands 的 E2E 与 UI 测试是否覆盖同类断言；不需要新实验，也不需要执行 Skill。

### 2. Hypertask #1914：产品负责人批准的按变更维护，带明确上限

**为什么最值。** 37 页 → 每周最多 8 页、2 个只读 helper、1 张 ticket；旧的全量 live drive 因"没人看报告"退役；产品负责人 2026-10-23 书面同意跳过无人值守的 37 页浏览器运行。这是公开材料里唯一同时有"缩小决定""上限数字""第一次静态检查抓到 2 个真漂移"的案例。它把维护负担从"agent 每天跑不完"变成"静态检查＋ticket 队列"，最接近可复制的落地形态。

**下一步可核输入。** ticket 交回人工后，谁保证重新验证？#1914 只证明 checker 能发现引用失效（`search.md` 未进索引、`login.md` 仍引用旧路径 `src/middleware.ts`（现名 `src/proxy.ts`）），不证明 live 验收被补上。可对照该仓库后续 ticket 与 feature-map 提交，看 8 页／周的上限是否真的被执行。

### 3. pstack #150 与 #151：上游证据的边界，决定"不能引用什么"

**为什么最值。** #150 自己承认 maintain skill 没被 exercised；#151 的四条修订是合并前 39 秒的 bugbot 静态评论。pstack 仓库本身因此不能作为"维护流程有效"的证据，只能作为"生成流程在 4 个真实仓库跑过"的证据。深挖价值在于把这条边界写进试用前提：如果 dot-A 要用，必须自己产出第一份维护回执。

**下一步可核输入。** 用 #151 的三条不变量对照 OpenHands #18317 补回的 reconcile／live-pass 规则，检查"精简文本"到底丢了哪些验收语义；这是一次跨来源的机制核对，不需要跑 Skill。

### 4. OpenHands `daily.md` 与 #18317：维护负担的分层与压缩损失

**为什么最值。** `daily.md` 直接给出"28 族／700 多子功能一个 agent 一天跑不完"的量化理由，并规定只有第二层（变更族全部驱动、`BASE..TARGET` 每个 commit 解析到 PR、已关闭 issue 重驱动）跑完才推进 baseline；#18317 又记录了把 pstack 维护步骤压缩后丢失 reconcile 与 live-pass 不变量的具体缺口。两者合起来回答"怎样在有限预算下不误报 clean"：先静态查引用，再只跑变更族，时间不够就保留 baseline，而不是把全量 pass 写成通过。

**下一步可核输入。** tier 2 的"每个 commit 解析到 PR"是否能迁到非 GitHub 仓库；`map affected` 的变更检测是否只依赖 git diff（若是，可移植性高）。

### 5. pstack #573：把生成侧的 false ready 变成一个可检查点

**为什么最值。** 生成侧 #501 在空 VM 上运行 create-verification-skill 生成的 skill 时实测：3 秒端口应答、19 秒 init 完成，首次驱动提前并在缺失 role 上失败，不是跑绿；这是公开材料里唯一带秒数的错误前提。同一修正（#573）还规定 seed 不足不许削弱 journey、stand-in 跑过不算真机验证。它比任何"验收很重要"的论述都更能改变做法：readiness 必须定义为可用状态，而不是端口通。

**下一步可核输入。** 把这三条写成可自动检查的断言（init 完成标记、seed 前置、stand-in 标记），并看 #383 的"空输出＝失败"能否一起并入；在已有产品的 control CLI 上验证断言是否可观测。

**备选。** 如果 dot-A 需要先估维护工作量，#334 是唯一给出 6 天 4 次＋一次全 9 功能 live pass 的自述样本（9 reader、7 文件、1 harness 缺陷）；公开的连续维护序列见 OpenHands 每日自动化（#18929、#18971），但每日只跑 delta；周更／静态检查的产出另见 #1914（周更上限、首跑 2 个漂移）与 #10839（周更 11 处修正／460 项检查），但都不是完整 live pass。必须先接受"私有地图、无法独立复核"这一限制。

## 候选排序

### 第一档：直接决定"是否有人真正维护、维护能否持续"（1–10）

**1. OpenHands #18971 · 一次日常 delta 维护回执（实际运行回执）**
<https://github.com/OpenHands/OpenHands/pull/18971> · 2026-10-26 合并（本次复核 `merged 2026-10-26T10:05Z`，19 checks passed）
事实：HUMAN 段写明这是 enyst 设置的每日自动维护在 `main@ec0f70f` 上的运行，前一次 map pass 为 #18929（2026-10-25，正文同样说明是每日自动运行，并提到更早的 #18918／#18904）；verdict 为 "delta pass, changed"，只驱动 `map affected` 列出的族，不是 28 族全量。`control-openhands map check` 输出 28 个 map 文件／799 个 ID／0 problems，`map coverage` 输出 0 unmapped routes or feature directories；修 F18 Auto-discovery pill／Type facet、F22 docked composer、F08 文件尾换行三处说明；F28.event-trigger 记为新 known failure #18969（另开 #18970 修）；per-run 表区分 pass／fail／blocked／not-run／xfail／xpass，并分 run 列出（F21/F22/F23/F28 的 TARGET run 共 31 行：28 pass、1 fail、0 blocked、1 not-run、0 xfail、1 xpass；not-run 是 F28.repository-providers，需已连接的 Git provider）；reviewer 重跑了每个被修改的 row（6 行，5 pass／1 fail），all-hands-bot 批准，新缺陷由两个独立 agent 复现 6/6 TARGET、3/3 BASE。
位置：目前最强的正向维护回执，同时给出地图差量、证据分类与 baseline 推进；但它是一次 delta 覆盖，不是 28 族全量。
缺口：docs-only 维护 PR；没有记录跑完这些功能花了多少 agent 时间或调用；没有证据表明 reviewer 重跑了全部 28 个族。PR 自留两处未核数：F18 line 69 期望 Recommended 12、reviewer 实测 13，line 60 的 Enabled 计数可能差一；两处都不在本次 delta，值未经确认，待下一次全量 pass 重驱动。

**2. OpenHands #18295 · 维护失败与人工恢复（实际运行回执＋review 回执）**
<https://github.com/OpenHands/OpenHands/pull/18295> · 2026-10-11 合并（本次复核 `merged 2026-10-11T22:53Z`）
事实：从被关闭的 2026-10-09 sweep #18213 恢复修正到 9 个 feature-map 文件；reviewer 原文写 "the observations come from the prior run and were not re-driven on this head"；docs-only。
位置：与 #18971 成对。说明维护产物会因 PR 生命周期丢失，且"恢复"不等于"重新验证"。
缺口：恢复没有在新 head 重跑，仍是旧观察；清单的"8 个功能族"是采集者计数，reviewer 计 9 个文件。

**3. pstack #150 · 生成侧 4 个真实仓库 eval，维护侧未跑（作者自述：上游 eval）**
<https://github.com/cursor/plugins/pull/150> · 2026-07-12 合并（本次复核 `merged 2026-07-12T00:17Z`）
事实：4 个云 agent 在 gum（Go TUI）、np（交互式 Node CLI）、fastify-example-twitter（HTTP＋mongo/redis）、Reactive-Resume（react/hono/postgres）上各生成并跑通一次；fastify 驱动 9 个真实 HTTP 动作并在两个存储中验证证据，resume 拉起隔离 postgres＋chromium 完成 autosave round-trip；两个 agent 抓到上游文档漂移（gum README 提交键、np dry-run 输出）；6 条摩擦报告改进 Skill。测试计划勾了 "4/4 generated skills executed successfully" 与 "Leak check clean"，未勾 "Human pass on the maintain skill (drafted from the same eval's structure but not itself exercised — flagging honestly)"。
位置：上游只证生成侧，是判断"是否有人真正维护"最关键的一手负结果。
缺口：4 个 eval 仓库是作者选定的练习目标，不是独立团队采用；maintain 侧零实跑。

**4. pstack #151 · 维护 live pass 的四条静态修订与三条不变量（作者自述：静态审查）**
<https://github.com/cursor/plugins/pull/151> · 2026-07-12 合并（本次复核 `merged 2026-07-12T01:10Z`）
事实：PR 自述 "four bugbot comments posted 39s before the merge, all valid literal-reading interactions in the live-pass paragraph"；把 live pass 重写成三条不变量（health／evidence 等），清理按失败粒度、共享长驻实例不拆、失败后重跑 doctor、cleanup 后核证据仍存在。
位置：机制演化的重要一环，但不是运行证据。
缺口：四条来自合并前的静态审阅；没有一次维护运行证明这些不变量足够。不要写成"维护实跑发现"。

**5. Hypertask #1914 · 产品负责人批准的按变更维护（实际运行回执＋决定记录）**
<https://github.com/hypertask-ai/hypertask/pull/1914> · 2026-10-23 合并（本次复核 `merged 2026-10-23T03:55Z`）
事实：37 个 area pages；weekly VPS job 只挑引用路径自上次运行后变动的页面，每次最多 8 页，最多 2 个只读 Codex helper，每个 ISO 周最多 1 张 YPER4 ticket，clean 时不建单；GitHub workflow 无 AI、非必需检查；旧的 `verify-map-upkeep` 退役，理由是它每周驱动 live app 但"only wrote local reports nobody read"；第一次 checker run 抓到两个真问题：`search.md` 未进 feature-map 索引、`login.md` 引用 `src/middleware.ts`（已改为 `src/proxy.ts`）。产品负责人 2026-10-23 同意跳过无人值守的 37 页 live drive。
位置：目前最好的"按变更维护"落地样板，有 owner 同意、上限数字和首跑结果。
缺口：首跑抓到的是静态引用漂移，不是 live 验收覆盖；改后是否覆盖同样风险没有对照。

**6. OpenHands `daily.md` · 把维护拆成分层 delta（规范文字：读取于 2026-10-28）**
<https://github.com/OpenHands/OpenHands/blob/main/.agents/skills/verify-openhands/references/daily.md>
事实：开头写 "28 families and 700-odd sub-features take longer than one agent's day"；四层按成本排序：静态（分钟级，`map check`／`map coverage`／`map testids`）→变更（`map affected --target $TARGET`）→smoke（每个未在 tier 2 驱动的族：打开第一入口、跑 `errors --app-only` sweep、驱动一条证明主状态的 bullet）→按日期轮转（每天约七分之一族，即 28 族中 4 族，约一周轮完一遍）；只有 tier 2 全部完成（每个 affected family 都驱动、`BASE..TARGET` 每个 commit 解析到 PR、关闭 issue 重驱动）才用 `map baseline --set` 推进；超时或 blocked 保留旧 baseline；上一次 PR 仍 open 时下一次在其分支继续。
位置：对维护负担最直接的设计回应，可整段借用。
缺口：是流程文档，不是运行记录；链接为 `main` 当前内容，未固定 SHA；tier 2 的 commit→PR 解析依赖 GitHub 工作流。

**7. pstack #573 · 生成侧 readiness 实测失败与三条修复（源码／diff：规范修正，含实测来源）**
<https://github.com/cursor/plugins/pull/573> · 2026-10-12 合并（本次复核 `merged 2026-10-12T07:24Z`）
事实：生成侧 #501 在空 VM 上运行 create-verification-skill 生成的 skill 时实测：数据库 socket 3 秒已应答、init 19 秒才完成，首次驱动提前并在缺失 role 上失败，不是跑绿。本 PR 只改 `create-verification-skill/SKILL.md`：ready 必须是可用状态而非 "a port answering"；seed 数据不足时 journey 报失败，不许削弱；stand-in 做过的步骤在真机覆盖前仍算未验证。
位置：最具体的生成侧错误前提证据，三条规则都可转成检查；不是维护运行，也不是跑绿。
缺口：本 PR 是规范修正，不是产品修复；没有修改后的回归运行或误报率。

**8. pstack #334 · 9 功能私有地图 6 天维护 4 次的作者自述（作者自述）**
<https://github.com/cursor/plugins/pull/334> · 2026-09-08 提交，至今 OPEN
事实：作者自述一份私有 9 功能地图 "maintained with this skill four times in six days"；一次完整 pass：9 个并行 reader、9 个功能全部 live、修 7 个地图文件、修 1 个 harness 缺陷并重驱动、outcome `changed`；批评旧流程可以 "all features exercised" 收尾却没有逐功能证据、把 harness 假阴性当脚注；改为 coverage table（feature／source／live／evidence／disposition，封闭词表）并让 open harness gap 阻断 pass。
位置：#334 是唯一给出 6 天 4 次＋一次全 9 功能 live pass 的自述样本；公开的连续维护序列见 OpenHands 每日自动化（#18929、#18971），但每日只跑 delta；不可独立复核。
缺口：地图私有、无公开 PR；附带 `lint-skills.py` 的 self-test（6 个植入缺陷、47 skills clean）是工具自测，不是维护效果。

**9. Omnigent map 契约测试 · 把过期／漏验变成 CI 失败（源码所见：读取于 2026-10-28）**
<https://github.com/omnigent-ai/omnigent/blob/main/tests/dev/test_verify_omnigent_feature_map.py>
事实：测试要求索引恰好链到全部 feature 文件；每个 feature 文件必须按固定顺序含四段 H2（Sub-features、How to get to it (user POV)、Driving it with the repro environment、Gotchas）并有 Preconditions；引用的测试必须存在；native harness 必须有 matrix row；新 UI 测试区或 CLI 命令必须映射或进 "Not yet mapped"，且清单不能列已不存在项。
位置：成本最低的防漂移机制，可直接搬到有稳定测试路径的产品。
缺口：只防"地图与代码／测试脱节"，不证明功能可用；前提是地图引用测试而不是复制 selector；链接为 `main`，未固定 SHA。

**10. OpenHands PR #17961 · verify-openhands 的采用提交（源码／diff：采用记录）**
<https://github.com/OpenHands/OpenHands/pull/17961> · 2026-10-06 合并（本次复核 `merged 2026-10-06T20:43Z`）
事实（2026-10-28 读取正文；commit 与文件数另经 GitHub API 复核，其余数字未逐项复核）：27 族约 715 个稳定 ID、64 commit／45 文件；按 create-verification-skill 的顺序"先建 control CLI、再映射、再逐条实跑"；冷启动复跑得到 F14 11/11、F16 19/24；定义 weekly 维护与 map check／coverage 校验。
位置：真实产品的采用提交本身，说明生成物会被接进仓库结构与 CI。
缺口：PR 内数字为作者自报，本次未逐项复核。

### 第二档：具体失效模式与适用边界（11–22）

**11. enyst 博客《Give agents a way to prove it》 · 消费者第一人称复盘（作者自述＋公开数据：2026-10-28 读取）**
<https://enyst.github.io/arch/verify-openhands.html> · 2026-10-28 读取
事实：27 families／743 behaviors、30 条 inventory route；初始验证与 10-06 刷新共记录 68 个 issue，地图更新历史点名 32 个 bug-fix PR 被并入；对更早 736-behavior 版本的一次全量运行是 534 pass／40 fail／162 blocked；明确写 "Mapped does not mean passed"、"partial and blocked passes do not advance the baseline"；使用量只给 170 次隔离启动、261 张截图，并注明 "usage counts, not a measured speedup or a correctness guarantee"。
位置：解释为什么地图不是测试替代，并给出"部分通过不推进 baseline"的公开表述。
缺口：作者是 OpenHands 维护者（enyst），不是独立第三方；无 wall-clock／token 成本。

**12. pstack issue #457 · 按人类入口枚举，系统性漏掉程序客户端（作者自述：消费者报告）**
<https://github.com/cursor/plugins/issues/457> · 2026-09-29，closed as not planned（本次复核）
事实：报告者说自己用两个 Skill 生成并维护过该产品；按客户端类重清点后，surface 从 72 涨到 171、未覆盖从 56 涨到 154；原因是 create 第 1 步 "what does a user actually touch" 与 "note the rest" 不会变成 feature file。漏掉的具体客户端包括 MCP proxy、agent-account token、REST API key、两个 Hooks SDK、13 个 coding-agent harness hook、MDM 部署的设备代理、inbound webhook sender。
位置：适用范围的硬限制，属设计盲点而不是个别 bug。
缺口：产品与地图未公开，数字为报告者自述；上游以 not planned 关闭，说明不打算修这一类。

**13. OpenHands `references/adaptation.md` · 明确标注改自 pstack 的消费者（作者自述：2026-10-28 读取）**
<https://github.com/OpenHands/OpenHands/blob/main/.agents/skills/verify-openhands/references/adaptation.md>
事实（2026-10-28 读取正文）：维护者自述这是对 pstack create-verification-skill、feature-map-example、maintain-verification-skill 的"独立重写适配"，逐条写明采纳什么、为何不采纳（Cursor 插件配置、模型路由、disable-model-invocation、自主合入／合并权、零像素差异规则）；并说明 `daily.md` 在 pstack 的每日维护之上补了静态检查、变更族、每族 smoke 行与每周轮转。
位置：目前唯一明确承认谱系并给出取舍清单的真实消费者。
缺口：是否持续维护要看 #18971 等后续 PR，不能只看这份说明。

**14. pstack #716 · formal 姊妹 Skill 的 54 次封存 eval（实际运行回执：封存 eval＋反证）**
<https://github.com/cursor/plugins/pull/716> · 2026-10-19 合并（本次复核 `merged 2026-10-19T05:06Z`；清单写 10-18，按 UTC 应为 10-19）
事实：54 次封存离线运行＝3 case×3 arm×3 model（Claude Opus 5.5、GPT-5.6 Sol、Grok 4.7，均 xhigh）×2 replicate，由盲评 judge 打分；54 次运行按 3 个 arm 各 18 次，修正前正确数 B0 16／B1 14／M 16（M 比 B1 高 2），达到预注册 ship 规则，但作者写 "Correctness: no real gain"；修正两处误判（真实旧 bug、`.gitignore` 改动）后各 arm 均 18/18，并写 "the models already keep the verification in sync without the skill"；第二个预注册测试（18 次封存运行）新文本 9/9 保留 blocked check 的 sync commit、旧文本 0/9。
位置：可借"按变更＋上次同步点"的最小机制；同时是对"必须定期全量维护"的实测反证。
缺口：对象是 formal 验证那一对 Skill，不是功能地图，不能直接外推。两处 18/18 都存在：修正两处误判后三个 arm 各 18/18 正确；M 报告在 18/18 次运行中区分漂移与缺陷（B0／B1 无此数）。

**15. OpenHands #18317 · 逐条对照 pstack 维护步骤（源码／diff：文档对照）**
<https://github.com/OpenHands/OpenHands/pull/18317> · 2026-10-12 合并（本次复核 `merged 2026-10-12T21:22Z`）
事实（清单记录，本次核状态／日期）：维护者把自家 `maintenance.md` 与 pstack maintain-verification-skill 对照，指出压缩后丢了 reconcile（每个 feature 的 reader 都返回、合并 recipe、抽查漂移）和 live-pass 三条不变量，并按原意补回。
位置：直接证明"直接照抄精简文本会留下验收漏洞"。
缺口：docs-only；未给"丢失后实际漏验"的案例。

**16. Sokosumi #6616 · 一次真实产品的日常维护（实际运行回执）**
<https://github.com/masumi-network/sokosumi/pull/6616> · 2026-10-27 合并（08:34 ready，09:53 merge）
事实：旧地图漏掉 Contacts、Social Scheduling、Soko Bots 三个入口；social-beta 与 vault 登录前提过期；新增 3 个 feature 文件并改 nav、calendar、studio、vault 描述；live pass 在 portless stack 上跑（doctor ok、fixture Alice、method=ui）；环境缺口如实留作 gap（如 `SOKO_BOT_ENABLED` 为 false、`/soko-bots` 显示 team overview 不可用）；只改 `.cursor/skills/verify-sokosumi`。
位置：真实产品维护确实找到新入口＋过期前提，且有 live pass 记录。
缺口：页面未见 review 记录，作者自合；没有逐功能全量重跑的证据（环境缺口被保留）；维护成本未记。

**17. XR-Collector #148 · 全量维护运行，最终 passed:false（实际运行回执）**
<https://github.com/derektu/xr-collector/pull/148> · 2026-10-25 合并（本次复核 `merged 2026-10-25T06:54Z`）
事实（2026-10-28 读取正文）：9 个 feature 地图逐项重跑；RSS 旧文案导致误报、login items 说明过期、两条新断言先写错后修正、清理失败未定位；产品缺陷另开 #149；最终 `passed:false`，没有误报 clean。
位置："维护会失败但不说 clean"的正面样本。
缺口：成本未记；清理失败原因仍未确定（正文未宣称已修复）。

**18. Omnigent #10839 · 周更 upkeep 的实际产出（实际运行回执）**
<https://github.com/omnigent-ai/omnigent/pull/10839> · 2026-10-27 合并（created 2026-10-19，`merged 2026-10-27T15:14Z`）
事实：由 `omni-resolve-agent[bot]` 提交；11 处文档修正、4 个受影响 map、460 项 map contract checks 通过，引用 `2ffedd8fc270` 作为 source；0 failed checks／0 failed cases。
位置："周更＋机器校验"的可核样本，给出单次工作量下限。
缺口：正文明确称这是 weekly run 的延续（"The reviewed-source checkpoint and source citations retain the original weekly run's revision"；"The weekly run validates documentation and source citations."），但缺调度配置和往期 weekly run 的链接／记录，周更连续性无法只靠这一个 PR 独立证实；11 处修正花了多少时间未知。

**19. Sokosumi #5370 · 更早一次维护与连续负担（实际运行回执）**
<https://github.com/masumi-network/sokosumi/pull/5370> · 2026-09-29 合并（本次复核 `merged 2026-09-29T07:39Z`）
事实（清单记录）：新增 Schedules／Calendar／Content Studio，纠正 Files 位置与侧栏顺序；清单记录该仓库 2026-08-01 至 10-27 至少有 20 个同名维护 PR。
位置：说明这是持续负担，不是一次性演示。
缺口：20 个 PR 未逐个复核；单次成本未知。

**20. Open Session #395 · 每日自动维护触发，review 发现 P2 清理缺陷（作者自述：未合并运行）**
<https://github.com/tellahq/opensession/pull/395> · 2026-09-16 创建，OPEN（清单称 changes requested）
事实（清单记录）：由每日自动维护触发的真实产品运行；补 Issues／Databases 入口、改过期的 session／archive 配方；review 发现 P2 清理缺陷会留下目录，使下一次启动被拒，未合并。
位置：自动化维护会把环境状态搞坏的真实反例。
缺口：本次未读 review 全文；最终是否修复未知。

**21. Open Session #311 · 归档功能验收不可达（作者自述：已关闭未合并）**
<https://github.com/tellahq/opensession/pull/311> · 2026-09-04 创建，CLOSED
事实（2026-10-28 读取正文）：维护时发现 archived API 返回空（`/api/sessions?archived=only&slim=1`）、UI 归档 `bks-demo-failed` 后不生成行，导致归档打开与恢复无法验证；review 还指出 restore 顺序 P2；整单后来被 #315 取代。
位置："不可达功能＋需求前提缺失"的实例。
缺口：#315 未核。

**22. Omnigent #8350 · 引入 feature map 的动机与 5 族结构（源码／diff：patch 所见）**
<https://github.com/omnigent-ai/omnigent/commit/8b3c388d6b65f326decf905d0d1a411a55317fe6> · 2026-09-30（patch header）
事实：动机写得极具体——review 自动修复时反复遇到"改了 session composer 漏了 new-session composer、改了终端漏了 agent terminal、部分 native harness 没覆盖"；建 5 族 map（composer、terminals、native harnesses、login/host auth、sessions）、`verify-env` 隔离脚本、"Not yet mapped" 清单与 PR 触达提示；contract test 在 `ci.yml` 跳过 UI-only 时由 E2E workflow 兜底。
位置：动机最具体，说明地图补的是"同一功能多入口"的漏验。
缺口：5 族是较小范围；后续维护见 #10839。

### 第三档：采用形状与可借机制（23–32）

**23. Raytha 同日修正（重建后 5 小时）（源码／diff：提交，清单记录，2026-10-01）**
<https://github.com/RaythaHQ/raytha/commit/c938902f8839ab4831141fcf8a8720b4da0f9a2a>
事实：重建当天就补 host 额外参数（否则 webhook 被 SSRF 拦截）、补记 SPA 登录与新 webhook 签名。
位置："生成当天首次实跑就暴露缺口并回填"的小样本。
缺口：未读 commit；单产品。

**24. Raytha 重建 verify-raytha（脚本化＋功能地图）（源码／diff：提交，清单记录，2026-10-01）**
<https://github.com/RaythaHQ/raytha/commit/68a8a7d96a2a29270d602ca8a11df7d2da94a8bf>
事实：真实 CMS 产品把验证 skill 重建成 6 个脚本＋6 个 feature 文件（+962 行），隔离 15200 端口与独立数据库。
位置：生成物会在产品里被二次工程化，而不是原样保留。
缺口：未读 commit；行数为清单记录。

**25. OpenMausBot #646 · 先引入后删除 always-on 维护 Skill（实际运行回执：已合并）**
<https://github.com/milind-soni/OpenMausBot/pull/646> · 2026-08-31 合并（本次复核 `merged 2026-08-31T21:00Z`）
事实：PR 明确 "remove the always-on maintenance skill and broad trigger phrases"，是 #642／#643 的 lean replacement、已合并 #641 的 follow-up；测试记录 2,752 passed、19 skipped；清单记录起因是通用触发词 "verification skill" 按子串匹配会让普通维护请求同时挂载两个 Skill。
位置：公开可见的真实撤回／缩小案例（消费者侧）。
缺口：PR 提供的是回归测试，不是长期维护记录；可能与另一路采集重复。

**26. pstack #264 · 维护 source wave 被当 swarm 跑，触发云并发上限并丢 reader（作者自述：未合并）**
<https://github.com/cursor/plugins/pull/264> · 2026-08-25 创建，OPEN
事实（清单记录）：source 阶段没有可绑定角色名，操作者按 `/swarm` 组合执行，"That composition hits the cloud async cap and drops readers"；提案命名 maintain source readers、默认 inherit-parent、readonly，并把 verified-unreachable 纳入 clean 覆盖。
位置：逐功能并行 reader 在功能数大时有真实容量故障，维护成本不能按功能数线性估算。
缺口：作者自述，未合并；未给功能数／并发阈值。

**27. pstack #383 · 空验证输出被当成 pass（作者自述：未合并）**
<https://github.com/cursor/plugins/pull/383> · 2026-09-16 创建，OPEN
事实（清单记录）：作者自述在真实多 harness 会话中观察到空或缺失的 verification 输出被计为通过，提出 "empty output is a failed verification"；无公开产品复现。
位置：误报 clean 的已知入口。
缺口：仍 open；无产品回执。

**28. afk-loop #38 · 决定不设定时维护，改按需触发（作者自述：讨论记录，创建 2026-10-26）**
<https://github.com/knn90/afk-loop/issues/38> · CLOSED
事实（清单记录）：讨论后决定不设定时维护，只有 PR 报告 feature file 缺失或过期时由维护者手动跑 maintain-verification-skill；PR 一律不改地图；回归只跑 diff 触及的 feature。
位置："按变更／按需选择"的明确记录。
缺口：小项目，无运行量数据。

**29. dreamDroid · 移动端真实应用引入（源码／diff：提交，清单记录，2026-09-08）**
<https://github.com/sreichholf/dreamDroid/commit/b98ac19372cd257a1bb17a6eae08a52c4cf44c2d>
事实：一次提交 904 行（95 行 SKILL＋5 个 feature 文件＋296 行 Python 驱动）；9–10 月产品改动持续同步 feature 文件；同仓另有"Cloud Agents 不得视觉驱动模拟器"的约束提交。
位置：移动端维护受环境限制，说明地图并非只适合 Web。
缺口：未读 commit；同步频率未核。

**30. Clerk · 大厂仓库把验证 Skill 接进 CI（源码／diff：提交，清单记录，2026-10-22）**
<https://github.com/clerk/javascript/commit/4210ee12facf53b06c69237557b7620c6ecdc0a8>
事实：一次提交 42 个文件：326 行 SKILL、7 个 feature 文件、两条 CI workflow（verify-e2e／verify-remote）与模拟器配置及远程会话脚本（`configure-ios-simulators.sh`、`control-clerk-expo`、`fetch-native-build.sh`）。
位置：验证 Skill 可从"agent 按需调用"接进 CI。
缺口：未标注 pstack 谱系，只能按四段 H2 与 control CLI 结构推断；未读 commit。

**31. spiceai · 随修复落地 verify-spiced 与窄验证（源码／diff：提交，清单记录，2026-10-24）**
<https://github.com/spiceai/spiceai/commit/8da9192a14b5844abc695f455cebdda2bfdb1ee5>
事实：与产品修复同一提交新增 verify-spiced＋3 个 feature 文件；`.cursor/skills` 下另有至少五个针对单次修复的 verify-*：verify-arrow-on-conflict-dedup、verify-cayenne-concurrent-update、verify-duckdb-decimal-division、verify-parquet-nan-stats、verify-pk-insert-semantics。
位置："按 bug／按变更生成窄验证"的另一种用法，维护面小但会累积多份；这五个窄验证说明"多份窄验证会累积"已经发生。
缺口：未读 commit；多份窄验证的长期维护未记。

**32. cua · 把验证证明接进 Linux CI（源码所见：提交标题＋SKILL，未读 CI 日志，2026-10-24）**
<https://github.com/trycua/cua/commit/e754cfec69c41400eb2aabde716c27d15607b2f0>
事实：verify-cua-driver（含 `features/` 与 `verify-linux.sh`）被改成 CI 作业运行。
位置：从"agent 按需调用"升级为每次提交的自动证明。
缺口：清单明确说主要依据提交标题与仓库内 SKILL.md，未读 CI 运行日志；稳定性未知。

### 第四档：负担、治理与负结果（33–37）

**33. pstack guide 06 · 作者规定"至少每天一次"维护，但仓库没有定时任务（规范文字：固定 commit `c742dd61`，2026-10-27）**
<https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/docs/guide/06-verify-and-ship.md> · 固定 commit `c742dd61`
事实：guide 写 "Run this at least once a day, ideally from a scheduled automation"；该仓库只有 `pull_request` 触发的 validate-plugins workflow，没有定时任务，也找不到公开的每日维护记录。
位置：每日全量 source＋live 是推荐负担，不是已观测实践。
缺口：读者若照做需自备调度和人力，公开材料没有这两项成本数据。

**34. pstack #781 · 维护责任交回交付方的草稿（作者自述：草稿，创建 2026-10-22）**
<https://github.com/cursor/plugins/pull/781> · 2026-10-22 创建，DRAFT
事实（清单记录）：把 Step 6 从维护方直接开 PR 改成：调用方明确保留交付权时，交回改动、命令与证据，由交付方提交；source wave、live pass、edit scope 不变；作者自述 "No end-to-end maintenance/publication trial"，仍在等维护者决定。
位置：团队接入时"谁发布、谁合并"会冲突。
缺口：草稿，无运行效果或缩减验收的证据。

**35. dhruvkelawala/skills #111 · 验证 skill 体积与维护债量化（作者自述：issue 报告，创建 2026-10-25）**
<https://github.com/dhruvkelawala/skills/issues/111> · OPEN
事实（清单记录）：报告 Lore 的验证 skill 已膨胀到 999 行／9 文件／28 个 ticket 引用，含已退役 Maestro flow 与过期版本号；提出 250 行预算、移除历史、从 check 标记复制值、退役工具。
位置：直接量化长期维护成本。
缺口：单项目报告；250 行是提议，不是验证过的阈值。

**36. Loam #246 · 每日维护包装，成本仍未证（作者自述：已合并）**
<https://github.com/SamyakJhaveri/loam/pull/246> · 2026-10-19 合并（本次复核 `merged 2026-10-19T05:35Z`）
事实（清单记录）：已合并的每日 maintain 包装：launchd 06:00、4 小时超时、每次输出 `cost_usd`；作者明说尚未跑过一次完整付费维护；headless auto-mode 曾改动 `.claude/`。
位置：维护成本与权限风险仍是空缺。
缺口：从未完整运行，`cost_usd` 字段没有真实数据。

**37. 作者自己的示例地图（示例：不构成采用，2026-07-30）**
<https://github.com/poteto/verification-skill-example> · 2026-07-30 单个 commit
事实：README 明写 "Nothing here is a real product"，却给出约 30 个功能文件的地图规模、四段 H2 契约，以及"同 PR 修 drift 或靠 maintain pass"两条维护通道；没有任何一次维护提交。
位置：只能证明作者预期的地图形状与规模。
缺口：示例、fork 原样复制和作者整体宣传不算独立采用；把它当维护证据是错误。

## 按任务四问的覆盖

| 任务问题 | 最强证据 | 仍未知 |
|---|---|---|
| 1. 哪个真实产品提交并维护过？ | OpenHands #17961／#18971；Omnigent #8350／#10839；Sokosumi #6616／#5370；XR-Collector #148；Open Session #395／#311；Raytha、dreamDroid、Clerk、spiceai、cua 的提交 | pstack 本体没有维护运行；#334、#457 的产品私有；Clerk 的谱系是结构推断 |
| 2. 维护是否发现漏入口／过期前提／不可达／harness 失效？ | #18971（3 处说明漂移＋新 known failure）；#6616（3 个漏入口＋过期前提）；#148（旧文案误报、login items 过期、清理失败）；#311（归档不可达） | 没有"把正确说明改错"（误改说明）的公开回执；#383"空输出＝pass"仍 open；误报 clean 率未知 |
| 3. 付出了什么时间／调用／人审？有人缩小或撤回吗？ | #1914（8 页／2 helper／1 ticket）；#334（6 天 4 次、9 reader、7 文件）；OpenHands 每日自动化（#18929、#18971，每日 delta pass）；#10839（11 修正／460 检查）；#18295（维护产出丢失）；`daily.md`（分层）；#646（撤回）；afk-loop #38（按需）；#781（交回交付方） | 没有 wall-clock／token／人工小时；Loam 未跑完整付费维护；博客只给 usage counts |
| 4. 相比本仓现有做法新增什么？ | 覆盖表（#334）、静态契约测试（Omnigent 测试、#1914）、变更 delta（`daily.md`、#1914）、readiness／seed／stand-in（#573）、reconcile（#18317）、empty＝fail（#383） | 没有"地图 vs 现有测试／CI"的对照；机制在非 AI 重仓是否成立未知 |

## 可借的最小机制、成立前提与尚欠证据

**可借的最小机制（按落地成本从低到高）。**

1. **静态 map 契约测试**：索引链到全部 feature 文件；四段 H2 与 Preconditions 固定；引用的测试／路径存在；新 UI 测试区或 CLI 命令必须映射或进 "Not yet mapped"（Omnigent 测试；Hypertask checker 的 index／path／API route 三项）。这是唯一不依赖 agent 实跑、可进 CI 的防漂移层；它只证明索引／引用一致，不证明地图里的数值正确（#18971 的 F18 计数即未核）。
2. **逐功能覆盖表**：feature／source／live／evidence／disposition 五列，用封闭词表，clean／changed／blocked 由表推导；open harness gap 阻断 pass（#334）。
3. **变更 delta 与 baseline**：以 `BASE..TARGET` 为范围，只跑 `map affected` 列出的族；只有 tier 2 全部完成才推进 baseline，超时／blocked 保留旧 baseline（`daily.md`、#1914）。
4. **四条防假绿规则**：readiness＝可用状态而非端口应答；seed 不足时报失败、不削弱 journey；stand-in 做过的步骤在真机前保持未验证（#573）；空／缺失输出算失败（#383）。
5. **维护后 reconcile**：每个 feature 的 reader 都必须返回、合并 recipe、抽查漂移；不能只跑 live pass（#18317）。

**成立前提。**

- 产品有可脚本化的 launch／doctor／drive／evidence／cleanup 入口；否则地图只能写说明，无法实跑。
- feature 粒度在几十个量级可单次完成；几百以上子功能就需要分层与轮转（OpenHands 的 28 族／700 余子功能即按四层拆分；上千则必须分层）。
- 有明确的人或团队接收 map PR、ticket 与 baseline；bot 署名不能承担责任。
- CI 能跑静态检查；地图引用测试／路径而不是复制 selector。
- API、MCP、hook、设备代理多的产品，先补客户端清单，否则继承 #457 的盲点。

**尚欠证据。**

- 没有 wall-clock／token／人工小时的公开测量；只有页数、次数、文件数、usage counts。
- 没有"地图 vs 现有测试／CI"的对照，无法证明地图抓到的是普通检查抓不到的。
- 没有长期（三个月以上）同一地图的维护序列被逐次核过；Sokosumi 的 20 个 PR 只是数量。
- 非 AI 重仓（普通业务产品）的采用样本少；Raytha、dreamDroid、spiceai、Clerk 只有提交，没有维护回执。
- 假阴性／误报 clean 的比率未知；#383 仍 open。
- #334、#457 的产品与地图私有，无法独立复核。

## 未完成与读取边界

- 未安装、未运行这两份 Skill 或任何候选仓库；未执行维护流程、未跑产品验收、未开模型或浏览器会话。文中所有"跑通／实跑"都是被引用的上游记录。
- 文件类链接读取的是 `main` 当前内容，未固定 SHA：OpenHands 的 `daily.md`、`adaptation.md`，Omnigent 的契约测试；`guide 06` 使用固定 commit `c742dd61`。实际读取的文件正文就是这四份，未读的文件不列入。
- 本次核过状态／合并时间的条目（是否读正文见各条目）：pstack #150、#151、#334、#264、#573、#716、#781、#383、#457；OpenHands #17961、#18295、#18971、#18317；Omnigent #10839、#8350 commit；Sokosumi #6616、#5370；Hypertask #1914；OpenMausBot #646；XR-Collector #148；Open Session #311；afk-loop #38；Loam #246。
- 未读正文、仅按清单记录的条目：pstack #264、#383、#781；OpenHands #18317；Sokosumi #5370；afk-loop #38；Loam #246；Raytha 两个 commit、dreamDroid、Clerk、spiceai、cua、Open Session #395、dhruvkelawala/skills #111、guide 06 的仓库 workflow 计数、Sokosumi 的"20 个同名 PR"。
- GitHub API 在采集时触发匿名限额，状态与日期主要经网页读取；本次修正用 API 复核了 #17961 的 commit／文件数、#573 的改动文件与 #501 的正文；未新增清单外的链接。
- 本单元不给采用或提效结论，也没有试用数据；"是否值得在已有产品试用"由 dot-A 结合上表决定。
