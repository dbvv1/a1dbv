# 前沿收件箱

> 用户在 X、linux.do、技术群等处看到的 AI coding 项目、帖子、做法，直接把链接贴在下面（一行一条，可附一句话说明为什么觉得有意思）；dot-A 每周扫描发现的候选也记在这里，标明来源。只贴公开链接，不贴私聊截图或账号信息。dot-A 在 24 小时内处理：写明它对应本仓哪个任务或使用中的问题，能转化的进试用，只是值得一试的新工具进 [13 前沿雷达](../13-frontier-radar.md)“值得一试”表，一行两句以内；处理后在行尾标 ✅ 和去向，本仓此前已收录的标“已有”。规则见[运行手册 §3](LONG-TERM-PLAN.md#3-怎么探索)。

## 待处理

### 2026-10-27：SDK 迁移与按改动构建

- 👀 **升级 Anthropic SDK 主版本时，把依赖升级和 API 契约修正一起交付。** 10-21 发布的 Python SDK 2.0／TypeScript SDK 1.0 默认使用 API 版本 `2026-10-21`，迁移时从 Messages 请求移除 `temperature/top_p/top_k`，并按实际客户端核认证头变化及既有网关、日志脱敏的兼容性（`AnthropicFoundry` 仍用 `x-api-key`）；Bedrock 用户已报告旧模型版本拒绝，Hermes 的开放 issue 仅列出待迁移路径，需要旧采样行为时暂保相应旧调用链，本仓未试用，待真实 SDK 升级任务采用。

  **依据**：[官方迁移指南](https://platform.claude.com/docs/en/api/migration-2026-10-21)、[Python 2.0 发布](https://github.com/anthropics/anthropic-sdk-python/releases/tag/v2.0.0)、[Bedrock 用户对照](https://github.com/anthropics/anthropic-sdk-python/issues/2031)、[Hermes 迁移待办](https://github.com/NousResearch/hermes-agent/issues/142796)；核实 2026-10-27。

- 👀 **维护 Next.js 框架源码时，按源码变化和现有产物决定构建，不因新 worktree 就跑 `build-all`。** Next.js 于 10-22 将 AGENTS 与 backport Skill 改为：仅核心 JS 用 `pnpm --filter=next build`，跨 JS 包用 `pnpm build`，Rust／Turbopack 用 `pnpm build-all`，仅改测试且框架产物有效则直接跑测试；切分支、pull 后产物过期仍须补构建，已发布原生绑定落后于源码且启动失败时再完整构建，本仓未试用，待真实 Next.js 框架维护任务采用，不改变本仓门禁。

  **依据**：[已合入的 AGENTS／Skill 修改](https://github.com/vercel/next.js/commit/9ff761f2ceb2f38751578ba17bd2b3b9077c35f1)、[10-26 固定 AGENTS](https://github.com/vercel/next.js/blob/6f98e9fcedf6420658f0039376ef15d358e4cf1a/AGENTS.md#L105-L107)；核实 2026-10-27。

### 2026-10-27：用户带入 GPT-6.1 Terra

- 👀 **官方模型资料与 Artificial Analysis 六档 effort 评测已核，已收录进 [02 模型与成本](../02-models-and-cost.md#terra-effort-evidence)**，用于区分能力分数、单价与每题成本；本仓未调用模型实测。带入渠道为本 ChatGPT 对话，本次记 1 项漏检；公开来源、首次核实日期与发现时差边界见[校准记录](../research/2026-10-15-exploration-evidence.md#2026-10-27用户带入-gpt-61-terra-漏检)。

<a id="portless-worktree-urls"></a>
### 2026-10-27：Portless 命名开发入口

👀 **多个 worktree 频繁切换时，可试 Portless，让 Agent 和浏览器引用稳定 URL；现有端口安排已清楚就沿用。** 运行现有开发命令时用 `portless run --name myapp <原开发命令>`，再在同一 worktree 用 `portless get myapp` 取得入口，交给已有测试配置；`get` 只构造 URL，就绪仍须请求应用的真实路由。试用选择高端口 HTTP：代理与应用统一设置 `PORTLESS_PORT=1355`、`PORTLESS_HTTPS=0`、`PORTLESS_SYNC_HOSTS=0`、`PORTLESS_LAN=0`、`PORTLESS_TLD=localhost`，先确认既有代理配置一致；默认 HTTPS／443 与 hosts 路径涉及系统配置，先不选。**本仓未安装、未试用**，等真实 UI 任务需要这类入口时再选；已核源码 0.15.12，Apache-2.0、Node.js 24+。

**实际采用提醒：稳定 URL 也要接进测试。** state-in-url 已用 0.15.5 承载八个示例应用与 CI，但 E2E 仍写死主检出的 URL，工作树前缀会令测试找错入口；不复制其 `--force`，该选项会终止同名路由的现有进程。其脚本采用高端口 HTTP，却没有关闭 hosts 同步，不能据说明认定不改系统文件。浏览器会话仍按 Cookie 与存储作用域分别验收。

**依据**：[一手：固定源码] [官方 Skill／配置](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/skills/portless/SKILL.md)、[`get` 实现](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/cli.ts#L2463-L2471)、[hosts 开关](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/hosts.ts#L64-L70)、[`--force` 实现](https://github.com/vercel-labs/portless/blob/8930095a147b8ff7d109aa8be0846137e87ffef0/packages/portless/src/routes.ts#L223-L255)；[一手：实际消费者] [启动脚本](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/scripts/portless.sh)、[锁定 0.15.5](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/pnpm-lock.yaml#L188-L190)、[E2E 入口与使用限制](https://github.com/asmyshlyaev177/state-in-url/blob/cf2bc0f854ae6eda4a8234c9cd5e0a1a22a8cfaf/AGENTS.md#demo-app-urls)；[社区] [OpenCode 使用者自报](https://www.reddit.com/r/opencodeCLI/comments/1rqtxn3/portless_cli_for_consistent_dev_urls_makes/)、[V2EX 多 Agent 工作台仍需配端口](https://www.v2ex.com/t/1250974)（后者未采用 Portless）；核实 2026-10-27。

### 2026-10-26 广扫补入：三个实际任务候选

- 👀 **Sentry：复用 CI 实际选中的测试。** 下一次真实 CI 失败，交给 Agent：`读取失败 job 的原命令、配置和选中 nodeid，在同一代码版本重放；修后先验原失败，再跑项目要求的检查。` [实际 AGENTS](https://github.com/getsentry/sentry/blob/eb0125b95bc8569b340b5025a9aaade909e4a52f/AGENTS.md#L53-L59)与[workflow](https://github.com/getsentry/sentry/blob/eb0125b95bc8569b340b5025a9aaade909e4a52f/.github/workflows/backend.yml#L144-L162)已有消费者；artifact 只留一天，过期重建，已有明确失败用例时直接跑它。本仓未试用。

- 👀 **agent-browser 0.39.4：按版本读 Skill，增量看网页。** 真实 UI 任务需反复观察时，可比较已装 CLI 的 `skills get core` → `snapshot -i --delta`（丢失上下文用 `--full`），核关键状态与返回文本量；[官方配方](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/skill-data/core/SKILL.md)的 WebMCP 调用不能替代 UI 输入路径。[当前启动实现](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/cli/src/native/cdp/chrome.rs#L1597-L1637)在 root／CI／容器自动关闭 Chrome 沙箱，[多 worktree 用户](https://github.com/vercel-labs/agent-browser/issues/2214)还报告本地安装覆盖全局命令，因此本轮只收录，浏览器对照待保留沙箱的获准环境；未安装或试用。

- 🧪 **opensrc：已做本地 Git／CLI 试用，精确版本仍优先原生 Git。** [agent-browser 的真实配置](https://github.com/vercel-labs/agent-browser/blob/04ba5264dade678062c3cdcce0f4f293e748249f/AGENTS.md#L146-L168)已采用；多依赖反复读实现可试[官方 Skill](https://github.com/vercel-labs/opensrc/blob/b51de60867e806da1839b33dd29c29424f12521b/skills/opensrc/SKILL.md)。固定基线遇到不存在的仓库 ref 会回退默认分支；[已审补丁](../../experiments/opensrc-ref-integrity/source-ref-integrity.patch)改为失败并支持完整 commit SHA，[本地实测与复用](../../experiments/opensrc-ref-integrity/README.md)使用合成已解析元数据、真实 Git 和真实 CLI 缓存读取，未覆盖冷启动 registry HTTP。包版本缺 tag 的回退仍属上游 [PR #57](https://github.com/vercel-labs/opensrc/pull/57)，本补丁不改；旧缓存不重验、不迁移，试用使用独立 `OPENSRC_HOME`。[用户另报 monorepo 元数据差异](https://github.com/vercel-labs/opensrc/issues/61)；版本敏感判断默认用原生 Git 固定完整 SHA 并核 `git rev-parse HEAD`，单次 API 查询不装。

### 2026-10-26 固定来源扫描

读者是用 Agent 维护脚本、知识库和多 Agent 长任务的开发者。本轮增量是把“少送输出”“保留原始证据”“自动记忆”分开选，不按 star 或节省百分比全装插件。试用线能据下列入口在本仓选一个真实读改任务，取得原段、保住决定性限制并交成修改，才算用上；下表均未试用；show-me 写法、context-mode 与 Hippo 组件的已接收结果在本页“已处理”。

| 候选／来源 | 当前选择、试用状态与下一步 | 解决什么、谁在用与社区评价 |
|---|---|---|
| 👀 [Archify 3.2](https://github.com/tt-a1i/archify/releases/tag/v3.2.0)，awesome-claude-code 线索；[SpecDev 作者采用](https://github.com/tt-a1i/archify/discussions/952)、[导出缺说明卡反馈](https://github.com/tt-a1i/archify/discussions/721)；固定 `81c6be8d`，Apache-2.0 | **只在本仓读者需要点击固定源码／连续更图时才选它**，与 show-me／Mermaid 比较，当前未运行浏览器／插件。出现这类真实解释需求才试，两者不用为凑数都装。root 下 browser-check 会请求 `--no-sandbox`，不得照跑或为此改安全设置。 | 从真实源码形成带位置的可交互解释；SpecDev 作者自报 Windows 集成使用，导出用户提醒 PNG/PDF 不一定带上 HTML 说明。源码位置校验不等于解释语义正确。 |
| 👀 [anymd](https://github.com/SylphxAI/anymd)，[AgentIndex 10-07 清单](https://agentindex.app/zh/guides/new-tools-2026-10/)补入；[真实 OpenCode 用户 #881](https://github.com/SylphxAI/anymd/issues/881)；固定 `71fb95b5`，MIT 本地核心 | **下一次本仓论文／文档研究需要本地 PDF 时选**：`read`→`search`→按页核原文，基线是原生 PDF 抽取＋页图；当前未试用。若只是偶尔读一页，继续用原生抽取，不拿作者速度榜作结论。实际选用须含 8.5.5 后续修复并核有效目录配置；CLI 默认不限预算，须显式给 `--max-tokens`，不运行改所有客户端的 `setup`；付费 cite-check 不在本次选择内，不称已运行或完整安全认证。 | 文档转 Markdown，带页码、预算与续读 cursor；用户报告原始 stdio 可读，但严格客户端因 nullable 字段错误列为 required 而拒绝，说明“服务能跑”不等于 Agent 能用。该 schema 历史修复见固定源码与 8.5.3 changelog（见 [04 接入](../04-mcp.md#裸-stdio-可用客户端却拒绝参数)与 [10 安全](../10-security.md#本地只读-mcp目录验收覆盖可调用的兼容入口)）。 |
| ⛔ [AOCI-CODE](https://github.com/aoci-spec/aoci-code)，同一清单补入；[用户 #114 与维护者回应](https://github.com/aoci-spec/aoci-code/issues/114)、[性能反馈 #127](https://github.com/aoci-spec/aoci-code/issues/127)；固定 `7351c9de`，FSL-1.1-MIT 源码可用许可 | **本仓先不加全量索引**，按任务读源码，当前未试用。出现跨文件、全仓索引的真实需求再比较，否则继续 `rg` 按段读取；索引放不下时不能以调小 chunk 当修好。该索引压缩后仍要求完整 Overview，早期清单“未识别许可证”已过时，也不当 MIT 当前版。 | Git 版本化的仓库认知索引；有用户认可用途却报告慢，另有完整索引未读完即压缩、恢复又全量读的循环。维护者确认分块只降单次输出，不降累计上下文。 |
| ⛔ [Jevmem](https://github.com/Avinash-jetwani/jevmem)，[O’Reilly 10-06 雷达](https://www.oreilly.com/radar/radar-trends-to-watch-october-2026/)补入；MIT 代码 | **本仓不接账号、付费或导入会话**，当前未试用。只保留“新规则取代旧规则但留历史”的机制参照；已有 Git 交接足够时不增加服务，出现真实跨会话决策记忆需求再核数据路径。 | 保存决策与失败路径并退役旧事实；作者自测手写 `CLAUDE.md` 做得相近，尚无独立采用效果。MIT 代码不等于纯离线产品：当前接入需 TypeSafe API，消息、相邻轮次和记忆会送出。 |
| ⛔ [Google AX](https://github.com/google/ax)，同一 O’Reilly 雷达补入 | **暂不另建 Kubernetes＋Agent Substrate 集群**，已有宿主与 worktree 能接住本仓任务，当前未部署。需要自管大规模执行面时再核恢复和隔离契约。 | 声明式编排 Task／Workspace／Model，分离任务、工作区与模型配置。官方明确仍重度开发、稳定版前可能破坏性变更，独立生产使用成效未知。 |
| 👀 [lights-on-software-factory](https://github.com/gojko/lights-on-software-factory)，[上周 HN 原帖](https://news.ycombinator.com/item?id=50160198)补入；固定 `7e8ee8b4`，MIT | **本仓不选，保已有完成卡／版本门禁**：没有它的 progress 协议产物，当前未试用。不手工翻译现有日志制造采用，也不装整套权限、hooks 或读取真实会话。同 step 编号改了需求不能沿用 done：完成判定沿用原 run／group 记录、不比对新规格，须按新规格重新验收；[生成器](https://github.com/gojko/lights-on-software-factory/blob/7e8ee8b4dcd9857da48845b187540e3e1891c70f/workspace/.claude/workflow/src/generator/build-run-shape.js#L27-L34)仍按编号跳过已完成步骤，这是源码契约核对，未运行复现。 | 把计划依赖、同阶段写入冲突、分组门禁与恢复判定交给确定性程序；Votito 作者自用抽出，省费约 80% 仅作者口径，评论问隔离和凭据，并无独立收益验证。源码的完成判定要求末次 worker 完成、所属运行组 gate 绿且后续无反驳。 |
| ⛔ [agent-usage-guard](https://github.com/rbartoli/agent-usage-guard)，[上周 HN 原帖与讨论](https://news.ycombinator.com/item?id=50198936)补入；固定 `8e9f9131`，MIT | **当前宿主不接该 mod，先用原生额度／并发控制**；当前未试用。出现真实失控消费再评估宿主适配。core 判定与宿主适配分开；跨机器、独立终端队友及无前置事件的 fork 有覆盖边界，失败通常放行，不是硬预算安全边界。 | Claude Code mod 在代理启动、重上下文和重复失败前询问／拦截，合并本机多会话计数。作者报告旧 hooks 降 burst 但 lockout 仍增加，默认绝对阈值按自己的 Max 5x 调，不能推广。 |

收件箱只记待选与判断，不把本轮补录当成已试用；上周固定 10 条参照见 [25 周校准](../25-ai-exploration.md#2026-10-26上周-hn-样本校准)，另有 [13 项冷启动历史补充](../25-ai-exploration.md#2026-10-26冷启动历史补充)。

### 2026-10-26 历史目录三项补核

这三项解决的是首次目录对照留下的“待核”，不是再跑一次周扫描。读者先分清本地 adapter、远端检索与自托管数据平台；能说出实际数据路径、原生替代和不装条件才算补全判断，以下均未试用。

| 候选／来源 | 当前选择、试用状态与重开条件 | 解决什么、谁在用与社区评价 |
|---|---|---|
| ⛔ [Ref Tools MCP](https://github.com/ref-tools/ref-tools-mcp)，[官方安装](https://docs.ref.tools/context/install/index)；[自托管疑问 #10](https://github.com/ref-tools/ref-tools-mcp/issues/10)、[项目文档用户 #32](https://github.com/ref-tools/ref-tools-mcp/issues/32)；固定 `f5feb829`，MIT | **保官方原文／已有 Context7，不因 adapter 开源就称无需账号、离线或可自托管**；当前未试用。只有现有入口确实漏必要文档且服务接入已获相应授权，才比较完整检索任务。当前官方接入需 API key 或 OAuth；未核当前价格，不引用历史免费额度，不开户或导入文档。 | 按检索历史筛文档，减少重复结果；真实用户用它查手册、希望保存项目材料，后者不能当自动笔记已发布。MIT 仓是 legacy stdio adapter，固定源码的搜索／读取仍请求 Ref 服务；历史维护者也明确索引不在本地。 |
| ⛔ [PipesHub](https://github.com/pipeshub-ai/pipeshub-ai)，[作者帖与资源／模型问答](https://www.reddit.com/r/LocalLLaMA/comments/1waobyi/an_opensource_context_layer_for_building_ai_on/) | **本仓公共文件没有跨组织撤权／连接器需求，保 `rg` 或显式索引**；当前未试用。出现真实多权限消费者后，再核撤权与引用版本；此前不部署多服务、不创建 PAT、不接公司资料。只读官方部署与可见问答，未核完整实现／权限传播；不把“自托管”写成离线或数据不外发。 | 把企业多源资料变成保源权限、带引用的 Agent 上下文；作者称测试过本地模型，评论追问小模型关系抽取与 slim 部署成本，不是独立采用证明。slim 不等于零模型／embedding 成本；按阶段选模型在该问答里仍是计划。 |
| 👀 [crw／fastcrw](https://github.com/fastcrw/crw)，[MCP 模式文档](https://docs.fastcrw.com/mcp/)；[真实 SDK 字段遗漏 #557](https://github.com/fastcrw/crw/issues/557)；固定 `dc1a5968`／0.39.0，AGPL-3.0 | **只在真实、已获准的网页格式转换需求下选它，先保原生网页读取**；当前未运行。MCP 的 `CRW_LOCAL` 分支强制本地引擎，不代表其他子命令也忽略远端配置；搜索还需 backend，本地模式会尝试发现／启动浏览器，Auto 按已配置后端回退，代理需另配。Chrome 启动代码含 `--no-sandbox`，本轮不走该入口；未核纯 HTTP／离线入口前不运行，既有 403 更不能拿来试抓取。 | 抓取／转换、站点映射与搜索接口。用户的 sitemap 不是“包没更新”，而是服务字段被 SDK 丢掉；维护者报告 0.36.0 发布后核过，两者不等于本仓复测。 |

### 2026-10-26 按生产问题补入

- 👀 [Humanizer 3.1.0](https://github.com/blader/humanizer/blob/8c307f367c91bd974002f10f2be2965d642c13df/SKILL.md)（MIT，固定 `8c307f367c91bd974002f10f2be2965d642c13df`）：技术写作风格编辑 Skill，**未试用**，等下一份真实新稿需要精简且能保住决策语义时再试，不重开已接收批次。[Akita 自用](https://akitaonrails.github.io/en/2026/09/17/talking-about-my-ai-skills/)的是定制 3.0；原版历史[添事实 #187](https://github.com/blader/humanizer/issues/187)与[删排名／同时性 #212](https://github.com/blader/humanizer/issues/212)已有修订，当前收益待验。

## 已处理

| 候选／来源 | 实际结果与去向 | 解决什么、谁在用与社区评价 |
|---|---|---|
| ✅ [HumanLayer show-me](https://github.com/humanlayer/skills/tree/653b6411c1f70c275a18e37673b042ff99f67ceb/plugins/show-me)，GitHub 清单线索；[真实组合需求 #12](https://github.com/humanlayer/skills/issues/12)；固定 `653b6411`，MIT | **[最小结构 diff 已用于真实补丁交接](../../experiments/show-me-symlink-handoff.md)**：显式读 Skill 后应用表达形状，熟悉补丁的接收者据 26 行交接正确定位四类分支与测试，原 diff 为 212 行；这只是材料量和定位结果，未测提速。复杂分支交接可借用，简单 diff 直接审；插件未安装／调用，不装整套 HumanLayer 循环。 | 给代码交接选最小表达：调用树、结构 diff、Mermaid，复杂时才用 HTML；发帖者称 Matt Pocock 的 PR Skill 已复制其形式，也准备借给 PR review Skill。禁止隐式调用仍是组合限制，不是发帖者已完成采用或自动触发已解决。 |
| ✅ [Hippo](https://github.com/kitfunso/hippo-memory)，[AgentIndex 10-07 清单](https://agentindex.app/zh/guides/new-tools-2026-10/)补入；[外部测试提议 #346](https://github.com/kitfunso/hippo-memory/issues/346)；固定 `4d078af8` | **[组件试用已独审](../../experiments/hippo-public-guidance-retrieval.md)**：组件已试，不是整插件采用；手动退役保留旧行并过滤当前召回，但四个中文问题丢失词项后返回同样前五条，新的主引擎／发布段未取出，替代行来源元数据仍指旧段。本仓指导继续用 Git 原文＋`rg` 并引用回源；只有出现跨客户端记忆且新段可被召回的真实需求才重开，未接全局记忆或私人会话。 | 跨编码客户端的本地记忆，区分 pinned、superseded 与 outcome。外部关注的是旧事实退役后是否仍被召回；该 issue 是测试提议，不是完成的独立效果证明。 |
| ✅ [context-mode](https://github.com/mksglu/context-mode)，GitHub 清单线索；[Pi 使用者讨论](https://www.reddit.com/r/PiCodingAgent/comments/1ugk8hi/contextmode_is_adding_15k_tokens_to_every_request/)、[中文原帖](https://linux.do/t/topic/2305228?tl=en)；固定 `8b74cbba`，Elastic-2.0 | **[组件试用记录](../../experiments/context-mode-retrieval.md)已获非作者接收**：组件已试，不是整插件采用，去向 [13 值得一试](../13-frontier-radar.md#值得一试近4周的新项目与做法)。已有路径仍用 `rg`＋按段读取；反复多源查阅才试显式索引，不声称提效。全插件启动会修用户 hooks/settings，独立 server 也有旧库清理／会话索引，先不启两者；不要把同名托管 gateway 当成本地项目，完整原段取不回就保原法。 | 把大输出存入索引，需要时取回原块，而非只留模型摘要。8 份公开本仓文件／344 块，18 个返回块逐字存在；两个完整中文问题无结果，改关键词／限定来源才补齐，入库时间不能当核实日。Pi 用户有保留长任务用法，也有报告额外提示、重复加载工具和临时交接丢失；版本未明确，不能直接套成当前故障率。 |
