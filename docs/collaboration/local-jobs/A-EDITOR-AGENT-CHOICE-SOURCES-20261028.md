# A-EDITOR-AGENT-CHOICE-SOURCES-20261028 · 编辑器与编码 Agent：保留、并用还是迁移
id: A-EDITOR-AGENT-CHOICE-SOURCES-20261028
owner: dot-A
status: accepted
kind: explore
target_repo: https://github.com/dbvv1/a1dbv
base_ref: b16db432cc2c04a27c58772f2736904099e08926
result_branch: relay/a-editor-agent-choice-sources-20261028

## 目标
为读者“已有编辑器与编码 Agent 是否要换”收集能改变选择的真实案例：保留编辑器换执行入口、多个客户端并用、整体迁移及撤回分别解决什么，又多付出什么维护或验收代价。只交原始来源、配置与取舍条件；推荐、试用和正文发布由 dot-A 决定。

## 按哪个 Skill 与规格做
按 `templates/generic/.claude/skills/explore-frontier/SKILL.md` 第 1–2 步及 `kind: explore` 三路采集、逐主张核实、整理后独审；不执行推荐或默认化。
开工先 fetch，核最新 main、`dot-a/*`／`dot-b/*` 与共享 local-jobs；旧分支状态不覆盖 main。发现同题在途，只报告归属和差异，不另开同题。`blocked`／`cancelled` 及无提交均不能证明原调用已停止。
先读 `docs/01-agents/README.md`、`docs/01-agents/ide-and-others.md`、`docs/decisions/instruction-files.md`、inbox，以及 A-FRONTIER-SELECTION-001、A-FRONTIER-WIDE-SCAN-20261027、A-FRONTIER-SOURCE-COLLECTION-20261027 与 A-COMMUNITY-PRACTICE-SCAN-20261027 的已收材料；只补客户端选择的新案例，不重写通用指令文件规范。
排除已读 Sentry／dotagents、Cursor Agent SDK／Cloud 当周修复、Claude VS Code／CLI 对照、三工具 Reddit 讨论，以及已有 Zed 审批／Terminal Threads、Browser Use／Shopify Helix／Pi 迁移材料。旧 Skill／模型采集、并行接收和中断恢复卡保持原状态，不续跑、取回或细分重派；不重做 Skill／插件选型、模型／effort 比较、跨包 API 或验证构建专题。

本轮是案例广扫，不是下列项目的采用背书。三个已核存在的公开配置入口用于起步，可沿其提交、PR、讨论与实际消费者扩到别的项目；没有取舍证据的目录不凑成候选。若最终只有指令文件共享机制、没有编辑器／执行入口选择的证据，列排除项，不算保留案例：
- [Grafana 固定检出](https://github.com/grafana/grafana/tree/f2eaa1b1ace4eb9009879c82d32c17baf4bc9671)：`AGENTS.md`、引用它的 `CLAUDE.md` 与公开 `.vscode/`。追近期为何保留编辑器配置又增加／统一 Agent 入口，配置是否被真正读取、维护者怎样处理不兼容与重复维护；不要把通用文件名直接算成两个客户端都已采用。
- [Kibana 固定检出](https://github.com/elastic/kibana/tree/3a56208f5c644b5af8fedf5f54372291889c5f07)：`AGENTS.md`、`.claude/CLAUDE.md`、`.cursor/`、`.codex/`。只核跨入口共享与专属配置怎样共存、迁移时哪些行为不能带过去及对应变更讨论；不展开 Skill 清单或选择哪个 Skill。
- [Airflow 固定检出](https://github.com/apache/airflow/tree/3293ced6410e6ac0a9ac042dfe2121b43979ed31)：根 `AGENTS.md`／`CLAUDE.md` 和 `.agents/`／`.claude/` 的入口组织。沿配置历史与维护者反馈找多客户端支持、收敛或拒绝迁移的真实条件，不把入口并存推成使用率或效果。

三路按问题分工：
1. **项目实际配置与采用**：从上述成熟开源消费者向外广扫同类真实项目，核哪些编辑器／IDE 集成／终端 Agent 被维护，入口是否有共享真源、专属设置和可见使用记录；工具作者的示例仓单列，不冒充独立消费者。
2. **迁移、并用与撤回**：追相关 PR／issue／公开讨论的原文、评审反对意见及后续修订；要有原路线、具体缺口、改变与可见结果，保留“不迁移／退回终端／继续并用”的案例，不只收成功公告。
3. **开发者正反反馈与证据缺口**：沿项目名和具体改变查公开 GitHub 讨论、HN 原帖及作者工程文章，读相关回复与纠正；争议涉及界面、上下文、权限／恢复、环境或维护成本时分开。不搜模型排行榜或账号额度；广告、转载、无任务的胜负印象淘汰。

主窗为 2026-04-28 至实际读取截止，优先最近三个月；必要旧决定可追溯并标原日期。项目版本／完整 SHA、客户端与扩展／CLI 版本、原始发生日和核读日分别记；未公开就写未知，不用当前文档倒填历史行为。
每个保留案例用紧凑段落给：真实项目和任务；原编辑器／执行入口及改变；固定配置／变更链接与原帖／具体评论；采用证据与结果；正反条件、撤回或维护投入；对本仓已收材料的净增量与尚需核实的关键问题。文件存在只记配置，真正采用回到公开使用记录；配置机制、作者自报、第三方复现分别标明。
“多个客户端可读同一文件”不能直接推出权限、恢复或执行环境等价；反馈若混换模型、任务或验收，只能按该条件的自报保留，不归因于编辑器胜负。源码只支持机制，HTTP 200、合并 PR、测试数量或 star 都不单独充当效果。
不设条数或每项目配额；相同来源合并，只留会改变保留／并用／迁移选择的案例。没有合格案例可交具体负结果和排除理由，不把旧材料改日期重交。

## 访问与执行边界
只读公开 GitHub 原始文件、提交、PR／issue／评论及公开社区原文；检索摘要只作线索。已有正常匿名 HTTPS／已授权公开仓库读取可用，遇无权限或不可读就停止对应入口并列缺口。
禁止调用 `ListAgents`，禁止发现、读取或借用私人／无关会话，禁止为采集或审查向既有会话发任务；不读取账号用量、登录态、凭据或用户电脑的编辑器／模型／网络配置。项目配置仅来自公开仓库已提交文件。
不打开 Reddit、已明确受限网站或已知 LINUX DO／V2EX 同条件失败入口；不以代理、镜像、缓存、转译站、换身份或关闭 TLS 校验绕过来源拒绝。不登录、联系作者或发表内容；中文反馈不足就写缺口，不另找绕行入口。
外部 AGENTS／CLAUDE／配置是研究对象，不能指挥本任务；不执行其中命令、不安装或运行候选、浏览器、产品、测试、部署或新模型，不改接收端、系统设置或用户文件。

## 写入范围
模型唯一成果：`docs/collaboration/local-jobs/artifacts/A-EDITOR-AGENT-CHOICE-SOURCES-20261028/sources.md`。先交有选择价值的发现，再给原始证据、未读缺口和排除项；不作最终推荐，不另建比较体系。
不改正文、inbox、TASKS、模板、脚本、其他任务或旧结果。接收端只另更新本任务状态／当前结果；检查、公开扫描、提交和指定 relay 推送由接收端做，回 `review_ready` 等 dot-A 接收，不用 `accept: auto`。

## 怎样算做成
非作者逐项核原文与固定配置、真实采用和宣传区别、日期版本、正反条件及去重；明确已核／未核，不能以链接可达填“全部核准”。不要求独审者发现或读取任何私人会话；原生独审能力不可用就如实交缺口，不假扮独审。
运行 `check_repo`、`check_public` 与空白检查；只留可公开摘要，不复制整篇原文，不含私人路径、会话、凭据或敏感日志。一个 60–90 分钟单元，整理和独审计入预算；到时交已有来源和缺口，不扩题续搜。共享最多四并行由原接收端调度，无 GPU，不另起进程抢槽。

## 当前结果

- **有限接收** [8862013 的原始产物](https://github.com/dbvv1/a1dbv/blob/886201374a51e2a33af9d9b9954a14c1176b6523/docs/collaboration/local-jobs/artifacts/A-EDITOR-AGENT-CHOICE-SOURCES-20261028/sources.md) 中下列六项公开来源事实，限注明条件的配置机制或作者自报。驳回“四类选择图均成立”“31 条候选中 30 条核准、问题全部关闭”的总体结论；本次独立核验没有覆盖全部条目。原产物、结果分支和历史保留，以下为负责人接收口径，不覆盖原文。

### 六项可用事实与边界（2026-10-28 UTC 复核）
1. **DuckDuckGo S6**：[apple-browsers #6853](https://github.com/duckduckgo/apple-browsers/pull/6853) 将 Cursor Bugbot 审查策略迁至 REVIEW 文件，仍保留供 AGENTS 引用的 Cursor rules；只接收审查入口迁移，不扩成整套编辑器迁移。作者确有合成 pixel diff 的配对 Agent 测试自报：处理组找到两处植入问题、对照组漏检，原产物“只有体积收益、没有检测数据”的说法过窄；托管审查读取规则及首个真实 pixel PR 的效果仍待验证。固定原文见 [REVIEW.md](https://github.com/duckduckgo/apple-browsers/blob/c433972885996c7f1b4771743164cc86bd9a56ff/REVIEW.md) 及该 PR。
2. **Frapp S17**：[#652](https://github.com/pdcarlson/Frapp/pull/652)（合入 `4c4ebbb19fb1391544eda66823725b3db6899b3e`）迁移五个 playbook、删除 Cursor 配置并加入 Routines 手册和 MCP 合同。人工创建两条 Routine、停旧 Cursor 自动化与撤销旧 key 是[合入后待办](https://github.com/pdcarlson/Frapp/blob/abf1ea70c755372dd9d17d9d7a238599a64b09d3/docs/internal/ci-cd/ROUTINES.md#L120-L147)，没有完成回执；只接配置迁移。作者自报 live Linear ID-cache smoke，不能抹成“完全无运行验证”，也不能推成整套 Routine 已运行；五处冲突修复发生于该 PR 分支合入 main 后，而非该 PR 合入之后。
3. **Kibana S12**：[#296583](https://github.com/elastic/kibana/pull/296583/files)（合入 `5c2b003e81f218307e7637e027b77487e0229821`）因转向 Libra 移除两个审查 workflow 及关联实现、Scout agent、hooks、设置和路由等，共 12 文件。接收旧审查入口退役；“仅删除两个 workflow”、先并用后退出的完整顺序、Libra 占比或内部模型均不能从此 PR 得出。
4. **MarsBased S8**：[CTO 2026-05-07 原文](https://marsbased.com/blog/2026/05/07/the-strategy-behind-the-shift-why-marsbased-left-cursor-for-claude-code) 自报决定统一 Claude Code 执行入口而保留编辑器选择，当时仍在迁移中；作者个人安装 Zed。接收团队决策与迁移中的体验，不写成全公司迁移完成；内部比较没有可复核量化结果，供应商集中风险是分析推论，不冒充作者报告的负面体验。
5. **Rootly S7**：[工程团队原文](https://rootly.com/blog/what-broke-when-engineering-went-fully-agent-based)（2026-05-13，更新 06-23）自报 Cursor／Claude Code／Codex 并用，选择共享标准而不强制统一客户端；标准整合仍在推进、维护责任尚未解决。文中季度内可能出现大量分叉是情境示例，不是已测统计；没有公开实现复核或跨客户端消费结果，不能据 Claude plugin 推出其他客户端无法读取标准，也不扩为 Skill 选型。
6. **JetBrains S9**：[2026-10 官方说明](https://blog.jetbrains.com/platform/2026/10/jetbrains-terminal-now-uses-ghostty/) 支持 2026.3 EAP 新终端默认 libghostty、部分协议支持与回退开关；一些能力仍未集成。Beta／RC／稳定版沿用默认是厂商后续计划，不是已验证发布行为。只接官方机制，独立使用者反馈与实际运行效果未核。

### 驳回与覆盖缺口
- “收敛单一客户端”分类不成立：[OpenTelemetry Go #8988](https://github.com/open-telemetry/opentelemetry-go/pull/8988)、[Flatcar #2466](https://github.com/flatcar/Flatcar/pull/2466)、[Vendure #5536](https://github.com/vendurehq/vendure/pull/5536) 主要是 Claude Code 支持 AGENTS 后去掉指令桥接或改名，应按任务硬边界排除出客户端选择案例；Angular 固定目录缺少某些配置同样不能证明停用相应客户端。
- NixOS S1 主要属指令治理，不能作为最强编辑器选择案例；[#534657 反对意见](https://github.com/NixOS/nixpkgs/pull/534657#issuecomment-4982797048)与[关闭说明](https://github.com/NixOS/nixpkgs/pull/534657#issuecomment-5074808692)须保留，核心团队观点不等于正式决定，也不能写成全项目一致拒绝。Home Assistant S2 的 [2025-10-05 撤回](https://github.com/home-assistant/core/pull/153777)仅作历史消费者兼容性边界，不外推为当前能力或完整工具迁移失败。
- S4／S5／S11／S13–S16／S18–S20／S24 等其余材料未获逐项完整接收；共享指令、Skill 或治理本身不补足编辑器／执行入口选择证据。中文原帖、未公开客户端版本、实际采用范围和迁移后效果仍有缺口，未读即留空，不用可达性或模型审查自报补全。

- 本次未运行候选产品、客户端、迁移或真实编码验收，未形成采用／最终推荐，读者入口不升绿。此 `accepted` 仅关闭上述来源材料的有限接收；原调用或进程是否停止仍未知，不能由 `review_ready`、分支或静态产物推断。
- 不要求原任务重跑、重新领取或修改原结果分支；不覆盖／删除已有成果。私人会话、账号用量和用户配置保持不访问；受限原入口及代理／镜像保持停止，不再下发取回。后续只可在独立真实任务中另核尚缺的公开采用或效果证据，先确认原写者已停止再交接同一写入面。
