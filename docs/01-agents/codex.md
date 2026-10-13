# OpenAI Codex（CLI / App / Cloud）

> 核实时间：2026-10-11（本轮复核指令加载、模式、审批与使用讨论；版本、套餐和产品发布信息沿用 10-08 记录，未重新确认）。历史依据 [openai/codex 源码](https://github.com/openai/codex)和 [Releases](https://github.com/openai/codex/releases)，以及官方文档（历史记录指向 [learn.chatgpt.com](https://learn.chatgpt.com/llms.txt)；另一侧早期读取受代理限制；本次已补读当前 Auto-review、配置参考和托管配置页面，仍不据此宣称全面迁移或其他官网内容均已核实）**[一手]**。
> 评级：✅ **采用**（日常开发或交叉评审）

## 1. 形态与入口

| 形态 | 说明 |
|---|---|
| **Codex CLI** | 开源，用 Rust 编写；`curl -fsSL https://chatgpt.com/codex/install.sh \| sh`、`npm i -g @openai/codex` 或 `brew install --cask codex` |
| **ChatGPT 桌面 App（Codex / Work）** | 2026 年 Codex App 并入 ChatGPT 桌面 App（“ChatGPT Work”）；Linux 版 2026-08 预览 |
| **Codex Cloud** | 云端任务，可复用的云端环境（DevDay 2026） |
| IDE 扩展、GitHub / GitLab（beta）、Slack、Linear 集成 | 在 PR 里用 `@codex review` 做代码评审，`@codex security review` 做安全评审 |

ChatGPT 的 Free、Go、Plus、Pro、Business、Edu、Enterprise 各档都包含 Codex，额度不同 **[一手：Pricing 文档]**。

## 2. 模型（2026-10）

| 模型 | 说明 |
|---|---|
| **GPT-6.1 Sol** | DevDay 2026（9 月底）发布；官方称“接近 Astra 的能力、五分之一的价格”；`codex --model gpt-6.1-sol` |
| GPT-6 Sol / Luna | 2026-09-22 发布，价格约为 GPT-5.6 的一半；Sol Medium 适合日常和复杂编码，Luna High 适合聚焦、可重复的任务。**社区对 GPT-6 Sol 首发的评价偏差** **[社区]** |
| GPT-6 Astra | 2026-09 发布，推理 + computer use，适合高难度工作；500 美元 Pro 档有 Ultrafast 模式 |
| **GPT-5.5** | **2026-10-14 在 ChatGPT 和 Codex 中退役**（API 不受影响）。所有写死了 `gpt-5.5` 的配置、自定义 Agent、定时任务和脚本都要改 |
| Ultra 模式 | 不再是单 Agent 运行，而是把大任务拆给多个子 Agent |

注意：2026-07 Codex 的上下文窗口从 372k 缩到 272k（PR #33972）**[社区：HN]**。

## 3. 关键机制

### AGENTS.md（官方文档 + 源码 `codex-rs/core/src/agents_md.rs`）
- **全局**：`~/.codex/AGENTS.override.md` 存在时只用它，否则用 `~/.codex/AGENTS.md`；
- **项目**：从项目根目录（通常是 git 根）逐级走到当前目录，每一级优先用 `AGENTS.override.md`，否则用 `AGENTS.md`；
- 按从根到当前目录的顺序拼接，越靠近当前目录的越晚出现、优先级越高；
- 合计上限 `project_doc_max_bytes`，默认 **32 KiB**；
- 可以用 `project_doc_fallback_filenames` 将 `CLAUDE.md` 设为候选，但它是 **fallback，不是追加加载**：同目录已有 `AGENTS.md` 时不会再靠 fallback 加载 `CLAUDE.md`。
- 根目录先消耗项目文档字节预算；过长可能截断后面的子目录规则。“更近的规则优先”不代表它一定被完整加载。源码及对应测试已阅读，本轮未编译运行 Codex 测试。**[一手：S1]**
- 代码评审的自定义规则也写在 AGENTS.md 里。

### 审批、沙箱与 Auto-review
- 审批策略：`on-request` / `never` / 细粒度策略；2026-10-10 的当前配置参考已将显式 `untrusted` 列为不支持（不要与项目 `trust_level = "untrusted"` 混淆），`on-failure` 已弃用。见 [配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)；沙箱模式：`read-only` / `workspace-write` / `danger-full-access`。Linux 默认用 bubblewrap，macOS 用 Seatbelt，Windows 有独立的沙箱实现。
- **Auto-review**：`approvals_reviewer = "auto_review"` 选择自动审查者；固定源码中的 CLI `--approve-for-me` 同时设置 reviewer、`approval_policy="on-request"` 和 `sandbox_mode="workspace-write"`，不等同于只修改 reviewer 字段。**[一手：S2]**
  - 官方文档的“交互式审批”指仍产生审批请求的策略，如 `on-request` 或允许相应类别的细粒度策略，不应理解成只能在交互式界面运行。固定源码的 `codex exec` 也处理这个组合开关，并为 Auto-review 调整 headless 的默认审批配置。具体行为须核对所用客户端、版本和有效配置。**[一手：S2/S3；研究：概念区分]**
  - 单独选择 reviewer 不会自动改写长期可写目录、网络或受保护路径，也不保证请求获准；但获批的提权动作可能在比原沙箱更宽的执行范围内运行。不能把“不改默认配置”写成“获批动作也永远不能越过沙箱”。具体提权仍受禁止规则、托管要求和执行器能力限制。**[一手：S2/S3；研究：适用边界]**
  - 常规路由之外，固定源码还包含模型要求、强制 reviewer 与 strict review 的判断；不要把一条开源执行路径外推为所有发布客户端的统一行为。当前官方文档另说明，**Computer Use 的 App 级审批仍直接交给用户**，不能列为 Auto-review 必然接管的场景。**[一手：S2/S3]**
  - 默认策略位于 `codex-rs/prompts/templates/guardian/policy.md`；`[auto_review].policy` 配置本地策略文本，托管的 `guardian_policy_config` 优先。当前配置参考另列 `extra_policy`，不要把二者混为同一个字段。**[一手：S2/S3]** 权限故障应查实际拒绝原因，不用全盘放权处理一般实现偏好上的犹豫。**[经验：采用判断]**

### 子 Agent、Hooks、Skills、插件、记忆
- **子 Agent 默认开启**；有内置 Agent（如 `default`），可以在 `config.toml` 的 `[agents]` 里设默认值，也可以写自定义 Agent 文件。
- Hooks、Rules、Skills、Plugins（2026-03 推出；0.147 起支持可移植的 Agent Plugins 和多个插件目录搜索）、Memories、Goals 都已提供 **[一手：文档目录]**。
- **从其他 Agent 导入**（2026-08-11）：桌面 App 在 Settings > Import、CLI 用 `/import`，可以从 **Claude Code、Claude Cowork、Cursor** 导入指令、设置、Skills、插件、项目和近期工作，并可保持同步 **[一手]**。

### 源码里能看到的模块
`codex-rs/` 下有：`code-mode`、`memories`、`agent-roles`、`agent-message-board`、`hooks`、`skills`、`plugin`、`worktree`、`cloud-tasks`、`external-agent-migration`、`ollama` / `lmstudio`、`windows-sandbox-rs` 等。功能开关里还能看到 `Goals`、`BrowserUse`、`ComputerUse`、`MemoryTool`、`GuardianApproval` 等 **[一手]**。

## 3.5 DevDay 2026（2026-09-29）的变化 **[一手：learn.chatgpt.com]**

| 变化 | 说明 |
|---|---|
| **GPT-6.1 Sol** | “接近 Astra 的性能、更低的价格”，用于复杂编码；API 里支持 Responses 的多 Agent beta 和欧盟数据驻留 |
| **Astra Ultrafast** | Codex 和 Work 中更快的 GPT-6 Astra，只对 500 美元/月的 Pro 档和部分企业、教育计划开放 |
| **可复用的云端环境** | 描述开发环境 → Codex 准备并测试 → 发布；之后的新任务都在用这个文件系统的隔离工作区里启动，电脑休眠时云端任务也能继续 |
| **Codex Security Cloud**（研究预览） | 扫描已连接的 GitHub 仓库或监控新提交，给出发现、验证证据和补丁，再创建草稿 PR |
| **Dots**（常驻 Agent） | 由 GPT-6 Astra 驱动，有自己的云端电脑和浏览器；在对话之间持续推进工作，需要判断时再找你；可以连接一台本地电脑；在 Codex 或 Work 里启动的任务照常计入额度 |
| **企业 Agent Security** | 统一管控本地和 Codex Cloud 执行时能用的工具、文件和网络访问 |
| **MCP Events** | 让 ChatGPT 订阅 MCP 服务器的事件并据此行动（要求 MCP 2.0，基于草案规范的 webhook 投递） |

**含义**：OpenAI 在把 Codex 从“你发起的会话”推向“**常驻、云端、有自己环境的 Agent**”，和 Claude Projects 是同一个方向（见 [13](../13-frontier-radar.md#24-云端大脑本地双手会话管理正在被托管)）。

## 3.6 从说明到可验证配置（2026-10-11 增补）

按需采用 [Codex 原生模板](../../templates/codex/README.md)，先核对运行时支持与生效状态，再选择受控写入范围；长任务使用 [验收和恢复记录](../20-codex-long-horizon.md)。TOML 可解析不是运行兼容性证明。模板未在真实 Codex 客户端执行，不会自动安装或扩大权限。

## 4. 优势与短板

**优势**
- 速度、自主性和指令遵循应按模型、effort、任务及客户端区分；现有材料不足以支持“社区普遍认为更快”。用户的 Astra 偏慢、保守体验是研究起点，不应被泛化口碑覆盖。**[经验：用户反馈；研究：证据判断]**
- 默认开启沙箱，Auto-review 的策略开源可审计。
- 开源，可以自己编译和审计；可接本地模型。
- 迁移成本低：能直接导入 Claude Code 的配置。

**短板**
- **内建 LSP 的需求与收益仍有争论**：[#8745](https://github.com/openai/codex/issues/8745) 本轮页面显示开放，但不能仅凭一个开放功能请求判断所有客户端、扩展的能力。类型检查与语义导航是不同需求，见下文。**[社区：原帖]**
- 回滚体验弱：`/undo` 已移除（#9203），`/rewind` 未实现（#11626）。
- **额度和成本**：issue 区点赞第一是“token 消耗太快”（630 个赞）；200 美元 Pro 档额度被下调；10 月 3 日重置后用户普遍觉得额度缩水 **[社区]**。
- 透明度争议：2026-07 起子 Agent 的提示词被加密（issue #28058），HN 425 票讨论 **[社区]**。

## 5. 与 Claude Code 配合使用

- **交叉评审**：Claude Code 写的代码让 Codex 评审（`/review` 或 `@codex review`），反过来也一样。
- **共享配置**：不要假定两边原生加载相同文件。将共同约定维护在一处，并在各自入口显式引用；检查实际加载路径。Codex 的 `CLAUDE.md` fallback 不会与同目录 `AGENTS.md` 自动叠加。导入能力也不等于持续同步语义已经验证。**[一手：S1；研究：采用建议]**
- 在 Claude Code 中调用 Codex：社区有 [skill-codex](https://github.com/skills-directory/skill-codex)。

## 6. 使用建议：从实际问题选择方法

> 以下“采用判断”是本仓库分析，不冒充官方最佳实践。另一侧早期官网读取受限；已补读官方 Cookbook 的 GitHub 原文，本次另补核审批/配置页面，其他具体行为引用固定源码。**[研究]**

### 先给什么，遇到什么再增加能力

先从 [15 按任务类型的打法](../15-task-playbooks.md#0-总表)选择当前任务，再用下表补齐输入。**✅ 原生起步，🧪 出现具体失败才加一项能力**：默认让 Codex 在授权范围内连续调查、实现和验证；需要选工具时看[实用工具模块](../practical-tools/README.md)。依据是已有实现与失败案例，尚无受控模型对照证明统一最优流程。**[经验：采用判断，2026-10-13]**

| 手上的任务 | 最小有效输入与原生起点 | 何时增加什么 |
|---|---|---|
| 明确 bug | 失败命令／输入、预期与实际、相关版本；定位并修复，验证旧失败 | 修复位置不清时追调用链与同类校验；如 [BAML](../research/2026-10-12-baml-and-review.md)，研究需帮助选择实现位置，而非强制写全仓概览 |
| 存量功能或优化 | 一个实际使用路径、兼容要求；查现有实现后完成可运行改动 | 真实规模引出分批／缓存／并行时，查它改变的语义；[对端分批运行报告及本侧源码核查](../research/2026-10-12-alchemy-utils-evolution.md#本侧整合复核与运行证据缺口)支持只改批大小就可能改变 NULL／默认值，已有测试全绿不回答该问题 |
| 跨语言或运行时迁移 | 需要保留与允许改变的外部行为、部署条件；先验证一条完整调用路径 | 跨内存管理边界时加入所有权与释放检查，见 [VibeTunnel](../research/2026-10-12-vibetunnel-maintenance.md)；缺对应工具链时补运行能力，通用评审次数不能替代它 |
| 探索原型 | 目标使用者、要试的行为、可放弃的范围；先做可体验的产物 | 看到产物后按具体反馈修改；涉及持久化／权限时补对应条件。反馈只说明“不喜欢”时追体验原因，不能用更多计划替代试用；依据和限制见 [15](../15-task-playbooks.md#10-原型和一次性脚本) |
| 跨会话持续任务 | 当前目标、已改内容、相关证据、尚未解决的问题与决定理由；从实际 Git 状态续接 | 重复找不到状态再改善记录／检索；执行权限或关键决定缺失则明确阻塞，不默认安装记忆服务。见[长程恢复](../20-codex-long-horizon.md) |

### 五种情境：先做最小改变

| 观察到的情况 | 最少输入 → 原生起点 | 何时再增加能力 |
|---|---|---|
| 目标明确，已有失败测试 | 失败命令、预期行为与版本 → 复现、定位、修复并重跑 | 不能稳定复现才补输入与日志；目标冲突才问取舍，不重新开始完整需求访谈。见 [15 调试](../15-task-playbooks.md#2-调试) |
| 感觉慢，但不知道慢在哪 | 当前阶段、开始时间和可见工具输出 → 先区分模型等待与命令执行 | 首输出迟先核对排队、上下文和推理阶段；测试慢先检查进程、依赖和最小测试集。仅当推理投入确实过高才调整 effort，不让测试慢也得到同一建议 |
| 原型试用后需求变了 | 一次具体试用反馈、要保留和放弃的行为 → 更新目标，做最小可体验修改 | 无法判断方案时补真实使用反馈；涉及权限/持久化时补对应运行验证，不用旧 spec 阻止已授权的新方向。见 [15 原型](../15-task-playbooks.md#10-原型和一次性脚本) |
| 换了会话，已有充分状态 | 当前目标、Git 差异、失败命令和未决问题 → 读取现状后继续 | 反复丢失决定理由才改善交接或检索；状态已够用就不安装记忆服务 |
| 只是不熟悉新框架 API | 锁定版本、调用位置和实际报错 → 查该版本文档/类型/最小例子 | 仍反复误用同一领域契约才补窄 Skill；缺运行入口才加工具，不直接安装完整工作流 |

这五条是文档情境走读的采用建议；慢的原因仍需依据当前执行信号判断，不能仅凭体感归因。**[经验：情境走读]**

**如何看待 Superpowers 等流程包**：若缺少的是版本 API、数据语义或真实运行反馈，先补这些内容；若 Agent 反复不取证就猜修复，再考虑有针对性的调试约束。完整流程须计入串行等待、人工确认和重复调查；保留能纠正实际失败的部分。现有材料不能证明 Astra 下它必然负收益，也不能以“规范”代替净收益证据。具体触发和控制要求见[已读 Skill 对照](../research/README.md#主线三找出-skill-真正带来的增量)。**[研究：条件判断]**

### 官方建议怎么用：按协作目标选择示例

已从官方 Cookbook 的 GitHub 原文补读详细计划、持续 Goals、阶段工作流与迭代修复。官方示例并非同一种配置：ExecPlan 要求自主推进下一里程碑，另一份阶段流程要求每阶段等人批准；它们服务于不同任务。对当前已授权持续推进的使用方式，✅ 借鉴目标、证据与恢复记录，⛔ 不把逐阶段停顿模板设为全局默认。**[一手；研究：判断，详见来源](../research/2026-10-11-codex-cookbook.md)**

官方迭代修复教程还带 `target_iteration` 教学条件，能在真实执行和 judge 已通过时继续判未通过。本轮离线模拟核实该逻辑；因此教程的三轮“改善”不能直接当成模型收益数据。读官方材料也要追到实际代码，并区分它针对的模型/CLI 版本。**[研究：源码分析与离线逻辑检查]**

### 项目规则先保证会加载，再考虑写得多全面

✅ **采用**：在 AGENTS.md 写本项目真实的测试命令、架构约束、完成条件和容易踩的坑；领域细节放相关子目录，避免根文件挤占预算。不要为了“专业”复制一整套模型已经具备的规划、委派、评审流程。源码证明的是加载及截断机制；“更短一定提高正确率”没有本轮实验支持。**[一手：S1；研究：判断]**

对当前 Codex + Astra 的使用，建议先保留原生工作流，把额外 Skill 对准已观察到的失败：反复漏跑某个验证、不了解特定框架、跨会话重复已否决方案。仅因为存在高星项目就叠加完整流程，尚无收益依据。复杂需求不清楚时仍应先澄清；不能把减少形式步骤变成跳过必要思考。**[研究：基于用户情境的采用建议；非模型对照结果]**

### LSP：修复反馈与语义操作不能混为一谈

[#8745](https://github.com/openai/codex/issues/8745) 中，贡献者 `etraut-openai` 表示可让 Codex 执行 lint/typecheck，其团队尝试 LSP 后没有得到最初期待的收益；使用者则提出引用查找、带作用域的重命名、跨模块符号移动等需求。读取的是可见首帖与部分评论，线程有分页，不代表审阅全部讨论。**[社区：原帖，2026-01 的交流，2026-10-10 读取]**

✅ 日常修错先用项目已有编译器和类型检查；🧪 对跨语言或大量同名符号重构，再评估语义工具是否减少漏改和搜索往返。贡献者反馈没有附完整实验数据，不能推出 LSP 无价值；请求者提出的潜在收益同样不是已测结果。安装额外工具前先明确它补的是哪一种能力。**[研究：采用判断]**

### 两种真实迭代方式：看 diff 与看产品

[#9203](https://github.com/openai/codex/issues/9203) 的可见评论里，一位使用者描述“完成任务 → 看代码 → 提交 → 新会话”，另一位描述“观察应用 → 不合意就撤销 → 卡住才读代码”。这是不同使用方式，不是熟练程度或效果排名；该页还有未加载评论。贡献者说明旧 undo 实现曾带来问题，用户也分享自然语言撤销提示，不能把后者当作可靠快照。**[社区：原帖]**

✅ 根据任务保留两种反馈：视觉/交互修改应亲自走用户路径，行为与数据修改应核对 diff 和验证结果。探索性修改前保存可恢复的 Git 检查点，已有他人未提交修改时先界定归属；不要用整仓 reset 代替局部撤销。新会话适合独立任务，但不是每次小修必须清空上下文。**[研究：采用判断]**

### 近期失败经验比“又做了多少代码”更有价值

[Discussion #52835](https://github.com/openai/codex/discussions/52835)（2026-10-10）作者自述为约 25 人开发 KPI 系统，持续三四个月，测试、文档与构建产物很多，仍没有可靠端到端应用，并且无法确信哪个仓库版本是权威版本。一位回复者建议先走通员工创建、主管批准、进度更新和仪表盘读取的一条路径。这是两人的公开自述与建议，没有开放代码可供本轮验证，不能归因为 Codex 模型能力不足。**[社区：首帖和当时 1 条回复]**

✅ 借鉴的是定位反馈缺口：给 Codex 一个具体失败步骤、预期/实际结果和运行版本，先沿现有实现修通；测试绿但产品坏时，检查测试是否覆盖部署、持久化与角色权限。直接增加计划文档、再来一轮 reviewer 或全面换平台，并未解决版本不确定和验收对象不清的问题。**[研究：独立分析]**

### 长期记忆应保留理由，也允许用户改主意

[Discussion #52372](https://github.com/openai/codex/discussions/52372)（2026-10-09–10）作者演示两个 Codex 进程通过 MCP 保存、取回被否决方案，明确两步均由提示触发，不能证明自动回忆或生产率改善，并披露帖子由 Codex 起草和发布。回复者举例：最初只想聊天发帖，后来主动要求网页信息流；旧限制若永久生效反而妨碍迭代。双方都不是插件独立效果评估。**[社区：首帖与 2 条回复]**

✅ 先在项目续接记录中写当前决定、理由、适用范围及替代关系；🧪 只有频繁跨会话找不到这些信息时再考虑记忆服务。需要被召回的不只是“禁止过什么”，还有“后来为什么改了”。这也适用于 Codex/Claude 交替工作，避免旧交接文档压过用户新要求。**[研究：采用判断]**

### 可复核的正向实践：把业务歧义变成验收输入

[Catalog Compare](../research/2026-10-10-catalog-compare.md) 是一份公开 Codex 辅助开发案例。本轮重跑其 95 项核心检查和 11 项导出检查，均通过；补充用 Python Decimal 从原 CSV 核对 41 个匹配行与 102 个预期数字字段，也通过。**[社区：开发过程自述；研究：离线复核]**

✅ 值得借鉴的是把“空值不等于零、未匹配不等于删除”变成独立预期，以及保存可重跑的输入和命令。它不是 Codex 性能评测：无完整开发轨迹或模型对照；浏览器记录的 HTML hash 与当前检出不同，不能沿用成当前全量 UI 验证。真实使用者还指出界面与 CSV 命名的歧义，说明测试绿之后仍需检查产物怎样被人理解。**[研究：采用判断]**

另一个不同作者/任务的[公开开发过程](../24-community-workflows.md#codex-实际开发需求纠正与本机验证是不同的工作)来自 Simon Willison：明确 wheel 交付，失败后收紧 PR 范围，再本机验证并发现 Python 版本边界。它是 2025 年 Codex Cloud 案例，不是 Astra 实测；值得采用的是人的具体反馈与产物检查，而非追加一套通用流程。**[社区；经验：采用判断]**

### 慢、保守和反复停下来：先辨认是哪一种问题

本轮结合官方源码与近期原帖，形成以下判断；完整来源、版本边界和反例见 [机制与续接记录](../research/2026-10-10-codex-continuity.md)。**[一手 + 社区；建议为研究判断]**

| 现象 | 已核对的机制 / 反馈 | 当前采用建议 |
|---|---|---|
| 一直规划、不实施 | 原生 Plan 模式禁止实施修改；普通 `update_plan` 清单并非 Plan 模式 | ✅ 目标清楚时用执行模式；规划需要存在，但不必每次切 Plan 或再加规划 Skill |
| 改了 effort 但行为没有对应变化 | CLI 的 Plan 有单独 effort 覆盖，普通 effort 更新不改活动 Plan mask | ✅ 先检查当前模式及生效设置；不能只看配置文件里一个值 |
| 长会话首输出慢，工具尚未运行 | #52555 的单对测量在 reasoning token 为零时仍有明显差异；输入规模不同 | 🧪 保存必要状态后比较新会话；不能简单归因于“想太久”或承诺压缩解决 |
| 说知道未完成，却结束回合 | #52345/#50771 有具体自述；运行时回合续接不是业务验收 | ✅ 阶段汇报后仍推进已授权剩余工作；有已知反例就让它影响下一动作，而非只加结尾免责声明 |
| 准备全面重写底层提示来提速 | 官方 schema 对 `model_instructions_file` 明确强烈不建议 | ⛔ 不作为默认优化；先删掉重复的项目级流程，保留必要反馈与约束 |

**轻量不等于失去目标反馈。** 强 Agent 上不默认叠加完整 Superpowers，仍是当前建议；但它的理由是避免没有新增价值的步骤，不是认定模型不会偏离、停工或忽略验证结果。高 effort 抱怨没有同任务对照，不能据此统一推荐降低 Astra effort。**[研究：采用判断]**

## 来源

- **S3 当前审批契约（2026-10-11）**：[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)、[配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[托管配置](https://learn.chatgpt.com/docs/enterprise/managed-configuration)。本次独立读取；区分审批策略与 UI、长期配置与单次提权、Computer Use App 审批例外，以及 `policy` / `extra_policy` / 托管优先级。未运行客户端或审批服务。

- **S2 审批实现（2026-10-11，只读核对）**：[CLI 组合开关](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/utils/cli/src/shared_options.rs)、[headless exec 配置](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/exec/src/lib.rs#L778-L810)、[审批路由](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/ext/guardian-reviewer/src/routing.rs)、[执行编排](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/tools/orchestrator.rs)、[托管要求判断](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/guardian/decision.rs)、[默认策略](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/prompts/templates/guardian/policy.md)。未运行审批服务，不据此保证各客户端一致。

- **S1 官方实现（固定提交）**：[agents_md.rs](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/agents_md.rs)、[agents_md_tests.rs](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/agents_md_tests.rs)。关键测试：`total_byte_limit_truncates_later_project_docs`、`agents_md_preferred_over_fallbacks`。只读核对，未运行 Rust 测试。

- [learn.chatgpt.com：What's new](https://learn.chatgpt.com/docs/whats-new)、[DevDay 2026](https://learn.chatgpt.com/docs/whats-new/devday-2026)、[Dots](https://learn.chatgpt.com/docs/dots)（Markdown 版：在 URL 后加 `.md`）

- [openai/codex](https://github.com/openai/codex)、[Releases](https://github.com/openai/codex/releases)、[Issues（按点赞排序）](https://github.com/openai/codex/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)
- 官方文档：[What's new](https://learn.chatgpt.com/docs/whats-new)、[Models](https://learn.chatgpt.com/docs/models)、[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)、[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Import](https://learn.chatgpt.com/docs/import)
- HN：[GPT 6.1 Sol](https://news.ycombinator.com/item?id=49896586)、[Codex 上下文缩减](https://news.ycombinator.com/item?id=48965850)、[子 Agent 提示词加密](https://news.ycombinator.com/item?id=48905028)、[A week of using Codex more than Claude](https://news.ycombinator.com/item?id=49393051)
