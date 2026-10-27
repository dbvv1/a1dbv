# A-FRONTIER-SOURCE-COLLECTION-20261027 · 跨包 API 变更的前沿原始来源

id: A-FRONTIER-SOURCE-COLLECTION-20261027
owner: dot-A
status: running
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 8d68023b94af008d489565d22810beda7657ede0
result_branch: relay/a-frontier-source-collection-20261027

## 目标

给 dot-A 一份可回源的候选材料：当 Agent 修改多包项目的公共 API／共享契约时，哪些近期实践能帮助它找全真实下游消费者、识别必须同步的生成产物并验证兼容行为？只收与这个问题直接相关、相对本仓已有内容有增量的原始证据；dot-A 再挑最强的深挖试用、形成推荐并发布。

## 按哪个 Skill 与规格做

1. 先读最新 `AGENTS.md`、`CLAUDE.md`、`docs/collaboration/prompts/dot-a.md`、`TASKS.md`、`operations.md` §2.2 和本目录 `README.md`；本段后三个文件均在 `docs/collaboration/`。按 `templates/generic/.claude/skills/explore-frontier/SKILL.md` 第 1–2 步做来源发现，本任务不执行第 3 步的推荐、试用或默认化。
2. 开工 fetch 后核 main 与 `dot-a/*`、`dot-b/*` 的同题 `ready`／`running`／`review_ready`，以最新任务内容去重；已结束任务在旧分支留下的状态不算新任务。遇当前同题在途，只交不重叠材料并说明归属，不重复实施。
3. 先检索 `docs/collaboration/inbox.md`、`docs/13-frontier-radar.md`、`docs/03-context-engineering.md`、`docs/09-review-and-quality.md`、`docs/15-task-playbooks.md` 与相关 research／local-jobs。已有原生搜索／LSP、Serena／Graphicle、ast-grep／codemod、oasdiff／Pact、diff-cover／testmon、Actual 类型迁移只作去重基线，不重新写其介绍或重跑旧实验。
4. 不重新收集已处理的 dotagents、pr-test-analyzer、Claude Code 2.1.311 修复、pnpm 发布冷却和 GPT-6.1 Terra；SDK 迁移、Next.js 按改动构建、Sentry 重放 CI 选测及其他 inbox 已有条目，也只核差异，不以新日期包装旧结论。
5. 优先近 30 天新增采用或修订，必要时回看近 3–6 个月及更早的决定性原文；来源发布日期、提交日期、实际核实日期分别记录。来源不显示日期就写未知，不用抓取日补成发布日期。
6. 从高质量项目自身的 AGENTS／CLAUDE、Skill、生成脚本、测试和实际 PR 找可借用机制；可从 [Biome](https://github.com/biomejs/biome)、[tRPC](https://github.com/trpc/trpc)、[Effect](https://github.com/Effect-TS/effect) 起步。这些只是检索入口，未预定它们有合格候选；沿证据转向更相关项目，不逐仓凑条目。
7. 同时查相关工具作者／官方实现、真实使用者原帖与评审反对意见，至少查看一个中文渠道（linux.do 或 V2EX）。GitHub 周榜／topic、Skill 目录和社区榜单只作线索，最终回到原始代码、PR、issue、作者文章或原帖正文。按证据价值取舍，不要求每种渠道交固定数量。
8. 可用已有 `gh api`／正常 HTTPS 读取公开 GitHub 文件、PR 和评论；HN 评论可取 `https://hn.algolia.com/api/v1/items/<id>`。记录实际读到的正文范围；只有搜索摘要的标摘要，不能用于确认机制或采用。遇明确拒绝停止该入口，不换身份、不绕过 TLS／访问控制；继续独立可读来源。

每项保留候选用紧凑段落写清以下事实，缺项就注明缺口，不补造信息：

- **解决的具体问题与机制**：Agent 在哪种真实跨文件／跨包修改会漏什么；配置、命令或工作顺序具体怎样接住它，区别于普通全文搜索／类型检查／已有测试的地方是什么。
- **原始链接与日期**：实现／配置用固定完整 SHA 的文件链接及相关段；采用用实际 PR／提交／讨论链接；反馈用原帖／评论链接。写发布或修改日期、核实日期及版本，区分作者声称、源码已核与第三方使用自报。
- **真实消费者**：指出实际项目、修改任务、被同步的调用方或产物和可见结果，附直接证据；只有 README 教程／作者演示时明确没有独立消费者，不把 star、下载量或项目大小算采用。
- **反对反馈与限制**：记录漏改、误报、维护成本、动态引用／生成代码边界或不用它的真实理由；找不到同题反对原文就写搜索范围与未找到，不把自己的猜测冒充社区反馈。
- **与已收录的差异**：链接本仓最相关段落或任务，说明新增的是机制、真实采用还是决定性反例；只是重复或日期更新的移到简短排除说明。
- **交给 dot-A 的未决问题**：若后续试用，能利用哪个公开真实任务／既有测试入口验证哪一个关键未知；只列可验证输入，不排推荐名次、不宣布采用，也不新造消费者或执行试验。

不设候选数量指标；证据够用才保留。零项也可交付：写清没有找到什么、已查范围和最相关排除原因，避免把无来源的工具名凑成清单。通用工程技巧必须有与编码 Agent 工作方式的直接关联，不能把普通 API 工程新闻当成 AI coding 前沿。

## 写入范围

- 模型唯一成果文件：`docs/collaboration/local-jobs/artifacts/A-FRONTIER-SOURCE-COLLECTION-20261027/sources.md`，按问题自然组织，开头写发现与证据缺口，不规定固定栏目数量。
- 接收端只另回写本任务的状态和“当前结果”；过程、检查与提交信息写提交说明。保持任务文件不超过 80 行。
- 不改 inbox、13、其他正文、TASKS、默认做法、模板或代码；不安装／试用候选，不运行外来仓库配置，不读私人会话／凭据，不发表上游评论或 PR，不新增账号、付费服务或后台任务。
- 仅将产物推指定 `result_branch`，回 `review_ready` 等 dot-A 审阅；不设 `accept: auto`，不把成果合入 main 或部署。

## 怎样算做成

按原生 Workflow 完成实施、未参与实施者独立审查、必要修正与复审；单次最多 2 小时。审查逐项检查原始链接支持事实、真实消费者与宣传分开、日期与版本准确、正反证据及仓内差异有据可查；不得把本次来源采集写成实测通过。

结果末尾一行探索回执：实际渠道、读取截止日期、读不到的入口和原因。运行适用 `check_repo`、`check_public` 与空白检查，提交／公开扫描／结果分支推送由接收端执行；回固定提交、产物链接及需 dot-A 决定的事项。

## 当前结果

- 已产出 sources.md（89 行）：Effect 跨版本消费端声明快照与生成物闸门、Biome 仓库级 codegen 触发表加 CI autofix、Nx 项目图下游反查、cargo-semver-checks 多 crate 兼容闸门，均附原始链接与真实消费者证据；check_repo 与 check_public 均通过。独立复审未通过，遗留一处仓内 Hook 归因错误。
- 产物：[6523b9d](https://github.com/dbvv1/a1dbv/commit/6523b9d55d6afb48249dc46eef8d1fa6ccd73f3c)，分支 `relay/a-frontier-source-collection-20261027`。
- 检查：check_public（文件与新提交身份）、check_repo 通过；独立审查未通过或未完成。
- 下一步：修正 sources.md 第 48 行：docs/06 只是 PostToolUse additionalContext 的示例，本仓模板实际是 PreToolUse 路径保护 Hook（settings.json 编辑类 matcher + protected-paths.txt），澄清后重做独立复审。
- 执行：本机接收端，Claude Code＋DeepSeek 原生 Workflow。
