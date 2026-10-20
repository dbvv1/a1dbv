# OpenAI Codex（CLI / App / Cloud）

> 编辑更新：2026-10-20（UTC+8）；本次补有效运行配置与纠偏／中断／重启选择，其余分项沿用各自核实日期
> 评级：✅ **采用**（日常开发或交叉评审）；内容成熟度 L3

**✅ 30 秒默认：已有可靠配置就保留；新开始、范围清楚的日常编码用 GPT-6.1 Sol + medium，先完成一个有验收的交付。** 使用能访问工程并运行检查的原生入口，给目标、范围、现有证据与完成条件，让 Codex 调查、修改和运行检查；人核对改动与失败输出，防止把完成自报当作验收。Sol + medium 是本仓库给新任务的起点，不是所有客户端的出厂默认或效果排名，依据与跨模型边界统一见 [02](../02-models-and-cost.md#1-原则按任务分档而不是追榜单)。**[一手／研究：当前模型定位及采用判断，2026-10-20]**

**何时换档**：缺上下文或工具先补输入；需要更深入检查时提高 effort。跨步骤难题或有依据的质量目标可直接试 Astra（从 Light／low 起），不必先等 Sol 失败；若额外用量、等待与返工超过收益，就退回。任务依赖本机资源时，先修执行入口，不用换模型掩盖资源不可达。**[研究：验收与撤回条件]**

**⛔ 不默认选 Ultra、加整套流程包，或为了并行先升最高档。** 只有任务能够独立拆分、有整合者，或原生能力不足以达到明确质量目标时，再加对应的最小能力；新增等待和核查负担没有换来有效结果就撤回。配置能力与例外见下文，未做本仓库模型效果对照。**[研究：采用边界]**

| 现在要决定什么 | 直接看 |
|---|---|
| 在哪里运行、能访问什么 | [入口](#1-形态与入口) → [权限](#审批沙箱与-auto-review) |
| 用哪个模型、为何只规划不实施 | [模型](#2-模型按任务与实际用量选择) → [模式与慢任务](#慢保守和反复停下来先辨认是哪一种问题) |
| 给哪些上下文、何时加能力 | [任务输入](#6-使用建议从实际问题选择方法) → [项目规则](#项目规则先保证会加载再考虑写得多全面) |
| 继续旧任务、试另一方案或长期运行 | [会话与长任务](#长时运行与-dots按能力缺口增加任务) |

## 1. 形态与入口

✅ **先按任务选入口，再核套餐和开通状态。** 本机文件、浏览器登录和 VPN 不会自动进入云环境。**[一手；经验：2026-10-15，[入口证据](../research/2026-10-10-codex-continuity.md#8-客户端入口资格与安全评审边界)]**

| 任务 | 入口与关键条件 |
|---|---|
| 终端改仓库／脚本执行 | 开源 Rust **Codex CLI**：`npm i -g @openai/codex` 或 `brew install --cask codex` |
| 在编辑器协作 | IDE 扩展；不提供 App／web 的内置浏览器 |
| 用内置浏览器验页面 | web 或桌面 App；Work 也可从 web／mobile 继续符合条件的任务 |
| 操作本机 GUI | 核 macOS／Windows Computer Use 插件与系统权限；Linux App 仍是预览，不能推定同等 GUI 能力 |
| 不依赖本机在线的仓库任务 | **Codex Cloud**，先准备并发布可复用环境 |
| PR／MR 评审 | GitHub／GitLab（beta）的 `@codex review`；专门安全评审另核资格 |

**套餐不只影响额度。** [Pricing](https://learn.chatgpt.com/docs/pricing) 为 Free／Go 列桌面 Luna Standard（受 rollout 限制），Plus 列 web／CLI／IDE／iOS 及云端集成；[GitLab beta](https://learn.chatgpt.com/docs/third-party/gitlab)另明确支持所有 ChatGPT plans，不能把价格表当集成排除清单。**[一手：2026-10-15]**

**安全评审单独查资格。** [GitHub Security Review](https://learn.chatgpt.com/docs/security/security-review) 是 Pro／Business／Edu／Enterprise 的研究预览，不含 Plus；普通评审仍可发现部分安全问题。**[一手：2026-10-15]**

## 2. 模型：按任务与实际用量选择

✅ **已有可靠配置保留；新开始、范围清楚的日常编码按顶部 Sol + medium 起点。** 其他任务参照各模型与客户端建议调整，并行不必先选 Ultra。细选见 [02](../02-models-and-cost.md)；下表是官方定位与采用判断，不是实测排名。**[一手：沿用 2026-10-15 [核对记录](../research/2026-10-10-codex-continuity.md#9-模型选择成本口径与历史断言的适用范围)；研究：2026-10-20 仅修默认建议]**

| 选择 | 何时考虑 |
|---|---|
| **GPT-6.1 Sol** | 复杂编码与反复、长时间工作；`codex --model gpt-6.1-sol -c 'model_reasoning_effort="medium"'` 是[单次 CLI 覆盖](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)，不修改持久设置。官方称能力接近 Astra、成本较低，未证明同任务总成本或质量相当 |
| **GPT-6 Luna** | 目标清楚、可重复的聚焦任务；比较实际结果后再用于高频工作 |
| **GPT-6 Astra** | 最困难的跨步骤、跨工具工作；按目标质量判断额外用量是否值得 |
| **Max / Ultra** | Max 偏单任务深推理，Ultra 偏可有效拆分的复杂工作；Work web Ultra 启用最大推理与主动委派，其他 effort 也可显式要求子 Agent，App／CLI／IDE 可按请求或适用项目／Skill 指令并行 |
| **GPT-5.5 退役** | 2026-10-14 19:00 UTC 起，替换 ChatGPT 登录 Codex 的相应模型配置；此次不影响 API 或 API-key 登录 |

**预算看任务总消耗。** “Sol 为 Astra 五分之一”仅符合当前 Standard credits 非缓存输入／输出单价，缓存输入为十分之一；订阅与 API 口径另核，effort、速度档、上下文和子 Agent 都影响消耗。**[一手；研究]**

**上下文核模型、客户端与有效配置。** 2026-07 的 372k → 272k 是 GPT-5.6 bundled 元数据变更，不是所有 Codex／API 的当前窗口或自动压缩阈值，见上述核对记录。**[一手：固定源码；研究]**

## 3. 关键机制

### AGENTS.md（官方文档 + 源码 `codex-rs/core/src/agents_md.rs`）

✅ **先放真实命令、架构约束和完成条件，再核实际加载范围。** 全局按 `~/.codex/AGENTS.override.md`、`~/.codex/AGENTS.md` 取首个非空文件；项目从根到当前目录逐级取 override，否则取 AGENTS.md，较近规则后拼接。**[一手：S1]**

- 项目文档默认预算 `project_doc_max_bytes = 32768`（32 KiB）；根文件先占预算，子目录规则可能被截断
- `project_doc_fallback_filenames` 可加入 `CLAUDE.md`，但同目录已有 AGENTS.md 时不会追加它
- 自定义评审规则也可放入 AGENTS.md；加载与截断详见 [03](../03-context-engineering.md)

以上已读固定源码和测试，未运行真实客户端；规则写得更长或更短都不自动证明效果更好。**[一手：S1；研究：边界]**

### 审批、沙箱与 Auto-review

✅ **日常改代码先用受控工作区权限，遇到拒绝再查具体原因。** 沙箱限制可执行范围，审批决定某次动作能否获准；一般实现犹豫不需要全盘放权。**[研究：采用判断]**

| 要核对的项 | 当前契约与选择 |
|---|---|
| 审批策略 | `on-request`、`never` 或细粒度策略；当前参考不支持显式 `untrusted`，`on-failure` 已弃用。项目 `trust_level` 是另一项设置 |
| 沙箱 | `read-only`、`workspace-write`、`danger-full-access`；Linux、macOS、Windows 实现分别核对 |
| 自动审查 | `approvals_reviewer = "auto_review"` 只选择 reviewer；CLI `--approve-for-me` 还设置 `on-request` 与 `workspace-write` |
| 自动化脚本 | 固定源码的 `codex exec` 也处理上述组合；文档的“交互式审批”指会产生审批请求，不只指交互界面 |
| 策略来源 | `[auto_review].policy` 与 `extra_policy` 分开；托管 `guardian_policy_config` 优先于本地策略 |

**获批提权可能超过原沙箱范围。** 选择 reviewer 不改长期目录、网络或受保护路径配置，但也不能据此说单次获批动作永远不越界；禁止规则、托管要求与执行器仍决定上限。**[一手：S2/S3]**

**Computer Use 的 App 级审批仍由用户处理。** 固定源码还存在模型要求、强制 reviewer 和 strict review 路由，不能将单一路径当作所有客户端承诺。以上核实于 2026-10-11，未运行审批服务；详见[审批证据](../research/2026-10-10-codex-continuity.md)及页尾 S2/S3。**[一手；研究]**

### 子 Agent、Hooks、Skills、插件、记忆

✅ **机械支线先考虑脚本，需要模型时同时选 model 与 effort。** 子 Agent 默认开启，有 `default` 等内置角色；本地 `[agents]` 默认或自定义角色文件可调整配置。**[一手：[官方子 Agent](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents)]**

普通新子线程需固定轻量角色时，同时设 `model` 和受支持的 `model_reasoning_effort`；需保留临时改选时，用 `default_subagent_model`／`default_subagent_reasoning_effort` 作默认。角色显式值最后覆盖 spawn 参数，只换 model 可能保留过高或不兼容的 effort。此规则限读取本地配置的 App／CLI／IDE，不是 Work／dots 全局开关；详见[继承与 fork 边界](../research/2026-10-10-codex-continuity.md#子agent配置补研角色默认与显式覆盖)。**[一手；研究]**

**扩展按实际缺口选。** Hooks、Rules、Skills、Plugins、Memories、Goals 已有文档入口，模型变小不缩小权限。原生配置与插件支持不代表不同宿主采用同一契约。**[一手；研究]**

**导入按客户端选来源。** Desktop Settings > Import 支持 Claude Code、Cowork、Cursor 及自动更新；CLI `/import` 支持 Claude Code、Cursor，仅限本地空闲会话，远程或本地 app-server daemon 连接不可用，近期聊天最多近 30 天 50 个。**[一手：Import 文档／0.162.1 源码；2026-10-15]**

### 导入先选范围，再决定是否持续同步

✅ **少量迁移按项导入，完成后检查目标值。** 0.162.1 只补缺失设置键与缺失 MCP server 名称，重复导入不是覆盖同步；需要 Cowork 或自动更新时核桌面入口。**[一手：[导入证据](../research/2026-10-10-codex-continuity.md#7-导入入口配置合并与自动更新)]**

**需要隔离试用就先建工作副本。** “导入已有项目文件夹”继续使用原目录，不修改原 Agent 配置不等于以后不会修改原项目。**[一手；经验]**

🧪 **只有需要追随源端才启用自动更新。** 关闭它不撤销已导入内容；Hook 与插件适配见 [06](../06-hooks-and-guardrails.md#同名事件不等于可直接迁移claude-code--codex)、[05](../05-skills-and-plugins.md)。文档与固定源码未证明每个桌面构建的同步、删除和恢复都可靠，公开失败也不代表当前普遍失败。**[社区；经验]**

### 外来仓库转脚本

✅ **只读任务核有效权限，再查配置、AGENTS、Skills 和 Hook 来源。** 旧配置可用 `codex exec --sandbox read-only`；已有文件排除 profile 时不要叠加旧开关，按 [10 的生效条件](../10-security.md#codex-文件排除的采用条件)选。Git 仓库存在或项目配置未加载都不能替代检查。**[一手；经验：2026-10-15]**

**Hook 连同引用脚本一起审查。** 官方要求非托管 Hook 经定义信任后才运行；[固定源码](../research/2026-10-12-development-conditions.md#codex-脚本入口信任状态不等于有效权限)显示定义哈希不覆盖脚本，并区分未设 trust 与显式 untrusted。这是 2026-10-14 main 的实现证据，未验证发行客户端。**[一手；研究]**

### 源码里能看到的模块

**采用时查公开入口与开通条件，不按源码目录名选功能。** 源码可见 memories、hooks、skills、plugin、worktree、cloud-tasks 等模块；模块存在只支持实现调查，不能证明当前账户或客户端可用。**[一手；研究：证据边界]**

## 3.5 DevDay 2026（2026-09-29）的变化 **[一手：learn.chatgpt.com]**

**只按当前任务采用云环境、持续 Agent 或安全扫描。** DevDay 的发布背景见[官方记录](https://learn.chatgpt.com/docs/whats-new/devday-2026)；模型按 §2，持续任务按 §6，不把发布清单当配置清单。**[一手；研究：采用判断]**

- **云环境**：发布后，新任务在其文件系统的隔离工作区启动，适合不依赖本机在线的仓库工作
- **Dots**：有云端电脑、浏览器，也可连接本地电脑；先核[套餐、地区、年龄和工作区资格](https://learn.chatgpt.com/docs/dots#access)，符合资格仍可能等待 rollout
- **安全扫描**：先区分 PR Security Review 与 Security Cloud。后者另需[扫描资格](https://learn.chatgpt.com/docs/security#codex-security-cloud-access-and-prerequisites)、GitHub 仓库及兼容云环境

**扫描前核费用。** PR Security Review 消耗所含 Codex 用量或 credits；新建 Security Cloud 仓库／连续扫描按 token 计费，不在套餐所含用量内，免费扫描另有条件。详见[计费规则](https://learn.chatgpt.com/docs/security/faq#billing)与[入口记录](../research/2026-10-10-codex-continuity.md#8-客户端入口资格与安全评审边界)。**[一手：2026-10-15]**

## 3.6 从说明到可验证配置（2026-10-11 增补）

按需采用 [Codex 原生模板](../../templates/codex/README.md)，先核对运行时支持与生效状态，再选择受控写入范围；长任务使用 [验收和恢复记录](../20-codex-long-horizon.md)。TOML 可解析不是运行兼容性证明。模板未在真实 Codex 客户端执行，不会自动安装或扩大权限。

## 4. 优势与短板

**适合采用的理由**：有沙箱与可审计的开源实现，支持本地工作、导入和交叉评审；是否值得迁移，要以目标配置和真实任务能否接续为准。速度与自主性随模型、effort 和任务变化，现有材料不支持“社区普遍认为更快”。**[一手；研究：采用判断]**

| 采用前要防什么 | 做法与证据边界 |
|---|---|
| 缺语义导航 | 日常修错沿用编译器／typecheck；引用身份仍难消歧时再评估 LSP，规模或同名数量不单独触发安装。开放请求 [#8745](https://github.com/openai/codex/issues/8745) 不能证明所有客户端都缺此能力 |
| 误把聊天回退当文件恢复 | 探索前留 Git 检查点；CLI 请求 [#11626](https://github.com/openai/codex/issues/11626) 于 2026-10-15 仍开放，不代表所有客户端都无回滚 |
| 慢、停工或用量高 | 核模型、速度档、并行和[实际用量](https://chatgpt.com/codex/settings/usage)；[#51670](https://github.com/openai/codex/issues/51670) 是具体反馈，不能推出套餐普遍下调 |
| 子任务不易审计 | 检查本版本可见的委派内容与结果；[#28058](https://github.com/openai/codex/issues/28058) 是 2026-06 加密载荷报告，不是当前所有客户端结论 |

以上是原帖支持的风险提醒，不是失败率估计；具体应对见 §6。**[社区；经验]**

## 5. 与 Claude Code 配合使用

- **交叉评审**：有具体漏审风险值得额外核查费用时，再试另一模型；不默认每次互审。先区分原生本地评审与 GitHub 评审的输入、费用和完成信号，按 [09 的评审层选择](../09-review-and-quality.md)检查新增有效发现与误报。**[研究：已有结论同步]**
- **共享配置**：不要假定两边原生加载相同文件。将共同约定维护在一处，并在各自入口显式引用；检查实际加载路径。Codex 的 `CLAUDE.md` fallback 不会与同目录 `AGENTS.md` 自动叠加。导入能力也不等于持续同步语义已经验证。**[一手：S1；研究：采用建议]**
- 在 Claude Code 中调用 Codex：社区有 [skill-codex](https://github.com/skills-directory/skill-codex)。

## 6. 使用建议：从实际问题选择方法

以下建议以开发任务的产物与反馈为准；官方契约、源码机制和公开案例的证据范围分别注明。**[研究：采用判断]**

### 先给什么，遇到什么再增加能力

✅ **原生起步，有缺口或明确质量目标时再选最小有效补充。** 先复用项目资料和已有工具；具体流程见 [15](../15-task-playbooks.md#0-总表)，补充能力的选择见 [05](../05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么)。尚无受控模型对照证明统一最优流程。**[经验：采用判断]**

| 任务 | 先给什么、先做什么 | 何时补能力 |
|---|---|---|
| 明确 bug | 失败命令／输入、预期与实际、版本；复现后定位修复 | 修复位置不清再追调用链和同类校验 |
| 存量功能或优化 | 实际使用路径、兼容要求；沿现有实现完成改动 | 分批、缓存或并行改变数据语义时补契约测试 |
| 跨语言或运行时迁移 | 必须保留的外部行为、部署条件；先走通完整调用路径 | 跨内存管理边界时补所有权／释放检查，缺工具链先补运行能力 |
| 探索原型 | 目标使用者、要试的行为、可放弃范围；先做可体验产物 | 根据试用反馈或领域依据补质量约束 |
| 跨会话持续任务 | 当前目标、Git 状态、证据、未决问题与决定理由；核实后续接 | 反复丢失状态才改善记录或检索 |

这些选择保留了[实现位置](../research/2026-10-12-baml-and-review.md#baml实现反馈纠正研究计划)、[批处理数据语义](../research/2026-10-12-alchemy-utils-evolution.md#本侧整合复核与运行证据缺口)和[跨运行时迁移](../research/2026-10-12-vibetunnel-maintenance.md)的反例；它们说明该查什么，不能推成每个任务都要加同一流程。**[研究]**

### 五种情境：先做最小改变

| 情境 | 最小改变 | 何时换路线 |
|---|---|---|
| 目标明确且已有失败测试 | 复现、修复、重跑 | 不能稳定复现再补日志；目标冲突才问取舍 |
| 只知道“慢” | 先分模型等待与命令执行 | 测试慢查进程／依赖；确是推理投入过高才改 effort |
| 原型变化或已有质量目标 | 更新目标，复用 brief／设计系统，验新旧行为 | 缺选择依据时补领域资料或真实反馈 |
| 换会话但状态充分 | 核现状后继续，具体入口见长任务节 | 反复找不到决定理由才加检索／记忆 |
| 不熟悉框架 API | 查锁定版本的文档、类型和最小例子 | 反复误用同一契约再考虑窄 Skill |

这是一组文档情境走读，未测量各路线的收益。**[经验]**

**Superpowers 等流程包按缺口试用。** 缺版本知识就补文档，反复猜修复才补调试约束；需要跨任务复用时再固化为窄 Skill。比较目标质量、费用、等待和人工返工后保留有效部分；没有 Astra 同任务对照能证明整包必然有益或必然负收益。详见[已读 Skill 对照](../research/2026-10-12-community-source-records.md#小型入口的知识与控制成本)。**[研究：条件建议]**

### 官方建议怎么用：按协作目标选择示例

✅ **已授权连续任务，借鉴目标、证据和恢复记录，不默认每阶段停下。** 官方 ExecPlan 示例要求自主推进下一里程碑，另一阶段示例要求等人批准，应按任务契约选择。已读材料见[Cookbook 记录](../research/2026-10-11-codex-cookbook.md)。**[一手；研究]**

官方迭代教程的 `target_iteration` 教学逻辑可在执行和 judge 通过后继续判失败；本仓离线模拟已核实。因此“三轮改善”不能当模型收益数据，仍要核示例代码与适用版本。**[研究：源码及离线逻辑检查]**

### 项目规则先保证会加载，再考虑写得多全面

✅ **AGENTS.md 保留项目独有的信息。** 写真实测试命令、架构约束、完成条件和常见坑；领域细节放子目录，并核对根文件没有挤掉它。源码只证明加载及截断机制，不能证明“越短越正确”。**[一手：S1；研究]**

强推理模型先保留原生工作流，新增约束对准遗漏验证、版本知识或明确质量目标；复杂需求仍需澄清。尚无 Astra 同任务对照证明叠加完整规划、委派、评审流程的净收益。**[研究：条件建议]**

### LSP：修复反馈与语义操作不能混为一谈

✅ **日常修错沿用编译器和类型检查；同名符号先看导入与调用关系，身份仍难确认时再试语义工具。** 字符串 mock 路径、配置键和跨语言边界仍须文本核查。插件启动报错时，先恢复可用的原有检查或停用该插件；有任务收益再维护替代集成。**[研究：采用判断，2026-10-17 补核]**

PostHog 在同名重命名与引用查询的五题对照后，实际撤回了新增的 tsgo／ty 插件，只保留原插件故障处置。报告中两臂均完成所测任务，新增臂很少调用 LSP，Bash 改写也未触发自动诊断；这支持先核实际调用与反馈路径，再决定保留。**局限**：这是 Claude 的小样本、Agent 辅助报告，缺原始运行产物；未测方法／属性引用，不证明 Codex 效果或 LSP 普遍无益。固定撤回与成本范围见[任务对照](../research/2026-10-13-context-tool-choice.md#同名重命名新增lsp还是沿用原生搜索)。**[一手：补丁；社区：报告；研究：取舍]**

[#8745](https://github.com/openai/codex/issues/8745) 中贡献者报告其团队尝试 LSP 未获预期收益，使用者则需要引用查找、作用域重命名和符号移动。已读首帖及部分评论，双方都未提供完整收益对照，不能据此判 LSP 普遍有用或无用。**[社区：2026-10-10 读取；研究：采用判断]**

### 两种真实迭代方式：看 diff 与看产品

✅ **视觉／交互修改走用户路径，行为／数据修改核 diff 与验证结果。** 探索前保存 Git 检查点，有他人未提交修改时先分清归属；局部撤销不使用整仓 reset。**[研究：采用判断]**

[#9203](https://github.com/openai/codex/issues/9203) 的可见评论同时描述了“看代码再提交”和“看应用再调整”，也提到旧 undo 的问题。这些自述支持保留两类反馈，不是效果排名；自然语言撤销不等于可靠快照。**[社区：部分评论]**

### 近期失败经验比“又做了多少代码”更有价值

✅ **测试绿但产品坏，先指定运行版本和一个失败用户步骤，沿现有实现修通。** 特别检查部署、持久化与角色权限是否进入测试；加计划文档或换平台不能解决验收对象不清。**[研究：采用判断]**

[#52835](https://github.com/openai/codex/discussions/52835) 作者自述开发 KPI 系统数月、产物很多却没有可靠端到端应用，且不清楚权威仓库版本。原帖无开放代码，原核查只读首帖与当时一条回复，不能归因为 Codex 模型不足。**[社区：2026-10-10]**

### 长期记忆应保留理由，也允许用户改主意

✅ **先记录当前决定、理由、适用范围和替代关系；反复跨会话丢失时再试记忆服务。** 旧决定需要随新目标更新。[#52372](https://github.com/openai/codex/discussions/52372) 演示提示触发的 MCP 存取，回复提醒旧偏好可能妨碍新需求；这不是自动回忆或生产率效果评估。**[社区；研究：采用判断]**

**原生记忆分别核读取、贡献与作用域。** 只关 `generate_memories` 不停止读取已有记忆，不能当作“无记忆”对照。[Memories 页](https://learn.chatgpt.com/docs/customization/memories#control-local-memories-per-chat)称 `/memories` 只改当前聊天，[命令页](https://learn.chatgpt.com/docs/developer-commands#configure-memories-with-memories)却写影响未来会话；0.163.0 TUI 先写持久配置、再改线程贡献状态，可能部分成功。该差异不外推 App／Work；详见[记忆控制记录](../research/2026-10-10-codex-continuity.md#记忆控制补研读取贡献与持久设置分别核)。**[一手；研究]**

### 可复核的正向实践：把业务歧义变成验收输入

✅ **把业务含义写成独立预期，保存输入和可重跑命令。** [Catalog Compare](../research/2026-10-10-catalog-compare.md) 把空值／零、未匹配／删除分开；已有离线复核通过 95 项核心检查、11 项导出检查及 41 行的 102 个数字字段核对。浏览器记录与当前 HTML hash 不同，不能沿用为当前 UI 验证，也没有模型对照。**[社区；研究：离线复核]**

**交付格式与运行环境也要进入验收。** Simon Willison 的[另一公开案例](../24-community-workflows.md#codex-实际开发需求纠正与本机验证是不同的工作)通过明确 wheel、收紧 PR 范围和本机验证发现 Python 版本边界；它是 2025 年 Codex Cloud 过程，不能当当前 Astra 效果数据。**[社区；经验：采用判断]**

### 长时运行与 Dots：按能力缺口增加任务

✅ **继续同一任务先续接，试替代方案再分支，上下文拥挤再压缩。** 当前 CLI 官方说明给出了明确入口，补核于 2026-10-17（UTC+8）：**[一手：[CLI reference](https://learn.chatgpt.com/docs/cli/reference)、[Developer commands](https://learn.chatgpt.com/docs/developer-commands)]**

| 你要什么 | 选择 |
|---|---|
| 继续已保存工作 | `codex resume <SESSION_ID>`；`--last` 默认只找当前目录，跨目录查找加 `--all`；不支持 `--worktree` |
| 保留旧聊天、试另一方案 | `codex fork <SESSION_ID>`；还需隔离代码时用 `codex fork <SESSION_ID> --worktree`，限本地且必须给明确 ID |
| 腾出当前上下文 | `/compact`；只想看聊天摘要则用 `/recap`，后者不是释放上下文的入口 |
| 独立任务或独立评审 | 开新聊天，给必要目标和证据；不继承无关讨论 |

**接续前核目标、文件与活进程，不只核聊天 ID。** fork 不是文件快照；新聊天也不保证新运行环境，共享 daemon 沿用启动时环境。先对账未知的部署／发布结果，再续接；不要用清上下文修后台配置。**[一手：固定 README；研究：2026-10-20，未运行，见[有效配置证据](../research/2026-10-10-codex-continuity.md#有效配置与续接动作2026-10-20)]**

**交给 dot 时，先说清目标、验收、操作授权和停止条件。** 先校准一个交付物，再扩大持续责任；普通任务后续继续在任务内处理，固定周期重复工作才另排程。依据为[官方任务说明](https://learn.chatgpt.com/docs/dots/tasks-and-memory)及[起步案例](../research/2026-10-12-development-conditions.md#dot-持续责任起步先校准产物再扩大范围)，尚未证明长期无人监督可靠性。**[一手／社区；经验]**

**持续改仓库时，发布与验收绑定同一版本。** 调查可并行，整合发布由一人串行完成；主干前进就重新整合、验证并回读远端，详见 [20 的受检树](../20-codex-long-horizon.md#6-工作树隔离不是权限隔离)及[发布恢复](../20-codex-long-horizon.md#git-发布只传差异失败从已核实的断点继续)。这是本仓单例经验，不证明 dot 可无限持续运行。**[经验：2026-10-16]**

**依赖本地 Hook 时，先保留 local-only 工作流。** dot 可由云端协调、在已连接电脑执行，但当前官方不支持云协调任务使用本地 command／prompt／agent Hook 或本地配置／插件目录 Hook；企业远程 MCP Hook 另有资格。详见[协调与 Hook 契约](../research/2026-10-12-development-conditions.md#云端协调与本地执行同机不等于同一hook契约)。文档不能证明某次连接已可用。**[一手：2026-10-16；经验]**

**查询先用已有能力，同一交付物先尝试受支持的原任务接续。** 连接器已返回充分原文就不再套 shell；需要测试、本地改动、专属应用或宿主要求时保留执行委派。读取失败先查路线，独立评审用新上下文。详见[效率选择与反例](../research/2026-10-12-development-conditions.md#dot-效率选择少一层包装不等于少一项验收)，未测得统一的耗时或费用收益。**[一手／社区；经验]**

### 慢、保守和反复停下来：先辨认是哪一种问题

**先定位卡在哪，再改配置。** 需要改变当前目标时优先直接纠偏；需要立即停止动作时再中断。0.163.0 的中断会停止活动 Code Mode cell 与嵌套工具，固定 mock 测试还覆盖 store 保留；这不是重置运行时，更不回滚外部结果。后台配置需重新生效时才考虑重启，先确认其他聊天／排队工作可接受中断。**[一手：发布与固定测试定义；研究：2026-10-20，未运行，见[证据与反例](../research/2026-10-10-codex-continuity.md#有效配置与续接动作2026-10-20)]**

| 现象 | 先做什么 | 关键限制 |
|---|---|---|
| 一直规划、不实施 | 目标清楚时切执行模式 | 原生 Plan 禁止实施修改；普通 `update_plan` 清单不是 Plan 模式 |
| effort 改了，行为没变 | 查当前模式的生效设置 | CLI Plan 有单独覆盖，普通 effort 更新不改活动 Plan mask |
| CLI 已升级或固定，模型目录／行为仍旧 | 核 CLI、选中 daemon 包与运行 app-server 版本 | 包安装成功不等于后台已切换；有带版本输出的公开个案，不是普遍故障 |
| 长会话首输出慢，尚未跑工具 | 保存必要状态后比较新会话 | #52555 单对测量输入不同，reasoning token 为零仍有延迟差异；不能承诺压缩会提速 |
| 知道未完成却结束回合 | 继续已授权剩余工作，让反例改变下一动作 | #52345/#50771 是具体自述；运行时续接不等于业务验收 |
| 想重写底层提示来提速 | 先删重复项目流程，保留目标反馈 | schema 强烈不建议 `model_instructions_file`，不作为默认优化 |

**需要重现性时，先决定是否需要共享后台。** 不需要时可按入口评估非 daemon 路径；需要时再用已部署版本支持的 pin／更新偏好。0.162.1 已支持关闭自动更新，`daemon update --from-cli` 可固定当前 CLI 包，但会重启并可能中断工作；关闭自动启动、关闭更新、固定包不是同一操作。先读[固定官方说明](https://github.com/openai/codex/blob/092d3acd6bec3e3a14bdc7e7a2810ab628ab759d/codex-rs/app-server-daemon/README.md)，安排切换窗口后核运行端，不默认强杀／清 socket。两项公开撤回配置支持这条中间路线，尚无同一长任务恢复验收或净省证明。**[一手：源码；社区：采用记录；研究：2026-10-20，未执行配置，详见[证据](../research/2026-10-10-codex-continuity.md#有效配置与续接动作2026-10-20)]**

## 来源

- **本轮补核（2026-10-17，UTC+8）**：[CLI reference](https://learn.chatgpt.com/docs/cli/reference)、[Developer commands](https://learn.chatgpt.com/docs/developer-commands)。先检索再读原文，改会话选择建议；未运行客户端
- **各节完整证据、反例与日期**：[Codex 机制与续接记录](../research/2026-10-10-codex-continuity.md)、[开发条件记录](../research/2026-10-12-development-conditions.md)、[官方 Cookbook 核查](../research/2026-10-11-codex-cookbook.md)
- **S3 审批契约（2026-10-11）**：[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)、[配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)、[托管配置](https://learn.chatgpt.com/docs/enterprise/managed-configuration)
- **S2 固定审批实现**：[CLI 组合开关](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/utils/cli/src/shared_options.rs)、[headless exec](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/exec/src/lib.rs#L778-L810)、[默认策略](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/prompts/templates/guardian/policy.md)、[审批路由](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/ext/guardian-reviewer/src/routing.rs)、[执行编排](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/tools/orchestrator.rs)、[托管要求](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/guardian/decision.rs)
- **S1 固定加载实现**：[agents_md.rs](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/agents_md.rs)、[agents_md_tests.rs](https://github.com/openai/codex/blob/c3d3b142d10f4316b46e35aad7e5317e7e506cb7/codex-rs/core/src/agents_md_tests.rs)；S1/S2 为只读源码核查，未运行 Rust 测试或审批服务
- **当前官方入口**：[Models](https://learn.chatgpt.com/docs/models)、[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Import](https://learn.chatgpt.com/docs/import)、[更新记录](https://learn.chatgpt.com/docs/whats-new)

**L3 核查范围（2026-10-17）**：入口、模型、权限与任务选择经全文独立复核，官方记忆作用域冲突已按证据限定。未验证真实客户端行为、账户开通或长期无人监督可靠性；各历史案例仍按原范围理解。**[研究：成熟度判断]**
