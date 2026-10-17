# 05 · Agent Skills 与插件

> 核实时间：2026-10-15（UTC+8；读取于 10-14 UTC）。本轮重核规范、宿主触发／权限与插件迁移边界，撤去市场数量和跨平台能力清单；固定源码、官方契约与未运行范围见 [S2a](research/2026-10-10-audit.md#s2a--2026-10-15-skill-采用与宿主执行边界)。第 2.5 节保留各案例的历史核实范围，不将局部程序探测当成当前模型净收益。

**先选最小补充**：已有资料或生成器够用就沿用；缺领域配方或有明确质量目标时试窄 Skill；只有确需共同分发多个组件时才装插件。保留条件是目标结果改善、必要行为不退步且新增等待／人工处理可接受，否则缩减或撤回。**[经验：采用判断]**

## 1. Agent Skills 规范要点

```
skill-name/            # 目录名必须与 name 字段一致
├── SKILL.md           # 必需：YAML frontmatter + Markdown 指令
├── scripts/           # 可选：可执行脚本
├── references/        # 可选：按需读取的参考资料
└── assets/            # 可选：模板、资源
```

| 字段 | 必需 | 约束 |
|---|---|---|
| `name` | ✅ | 不超过 64 字符；只能用小写字母、数字和连字符；不能以连字符开头或结尾，不能出现连续连字符；**必须与目录名一致** |
| `description` | ✅ | 不超过 1024 字符；写清“做什么 + 什么时候用”，包含触发关键词 |
| `license` | | 许可证名或许可文件 |
| `compatibility` | | 不超过 500 字符；说明环境要求（目标产品、系统依赖、网络等） |
| `metadata` | | 字符串键到字符串值的映射 |
| `allowed-tools` | | 规范中的预授权工具声明，空格分隔（实验性）；是否支持及如何生效取决于宿主，不是通用权限白名单 |

**渐进式披露的三个阶段**：发现（加载 name 和 description）→ 激活（读取完整 SKILL.md）→ 执行（按需运行脚本、读取参考文件）。它降低了相对一次性加载全部正文的成本，但每个 Skill 的描述仍有累计开销，重复或宽泛的触发描述还会影响选择；不能据此推导“安装任意数量都没有代价”。

**宿主扩展不是规范的可移植部分。** Claude Code 的手动触发、子 Agent、路径匹配、动态 shell 和 Hook 字段须按[当前宿主文档](https://code.claude.com/docs/en/skills#frontmatter-reference)核对，不把字段名复制到其他产品就当生效。安装前的重点是下一节的权限与执行阶段，不必预装整套扩展。**[一手；经验：选择重点]**

### 能加载，不等于权限语义可移植

**✅ 采用：迁移 Skill 时单独核对权限；不为兼容而默认扩权。** 适合跨客户端复用或审查外部 Skill 的项目；仅改正文的小任务不必引入新验证框架。**[经验：设计建议]**

- **规范**：`allowed-tools` 仍是实验字段，规范明确提示不同 agent 的支持可能不同。格式合法不能证明运行时实现了授权或限制。[一手：[字段定义](https://agentskills.io/specification#allowed-tools-field)]
- **Claude Code 当前契约**：该字段给调用 Skill 的当前轮次免询问许可，下次用户消息到来后清除；它不移除未列出的工具，后者仍按权限设置处理。deny / ask 规则仍可覆盖它。项目 Skill 的此字段不受工作区信任闸门保护，未信任目录中的 `-p` 运行也可能应用它；应在运行前审查，而不是把“只列 Read”当成只读沙箱。组织的 `allowManagedPermissionRulesOnly` 从 v2.1.282 起可忽略项目/个人等来源的该字段。[一手：[授权范围与托管例外](https://code.claude.com/docs/en/skills#pre-approve-tools-for-a-skill)、[注入命令的权限检查](https://code.claude.com/docs/en/skills#permission-checks-on-injected-commands)]
- **Codex 0.162.1 的反例**：固定提交 `092d3acd6bec3e3a14bdc7e7a2810ab628ab759d` 的 Skill 元数据解析器没有把 `allowed-tools` 转为工具授权；其 Unix zsh-fork 测试另明确，`agents/openai.yaml` 的文件写权限声明不扩大当前轮次的 workspace-write 沙箱。二者不是同一个字段，也不能外推所有执行后端；采用时核实际轮次权限，不照搬 Claude 的预授权写法。[一手：[解析器与测试及边界](research/2026-10-10-audit.md#s2a--2026-10-15-skill-采用与宿主执行边界)]
- **OpenCode 的具体反例**：v1.19.0（提交 `733b2c627e5aec39cb33cc22373bdce33053ef2c`）CLI 的 [Skill 加载器](https://github.com/anomalyco/opencode/blob/733b2c627e5aec39cb33cc22373bdce33053ef2c/packages/opencode/src/skill/index.ts) 只把名称、描述、位置、正文存入 Skill 信息，没有把 `allowed-tools` 转为权限；[Skill 工具](https://github.com/anomalyco/opencode/blob/733b2c627e5aec39cb33cc22373bdce33053ef2c/packages/opencode/src/tool/skill.ts) 另以技能名请求 `skill` 权限后返回内容。[对应测试](https://github.com/anomalyco/opencode/blob/733b2c627e5aec39cb33cc22373bdce33053ef2c/packages/opencode/test/tool/skill.test.ts) 检查了加载请求和返回内容，不能据此宣称正文里的后续工具调用已获准或被限制。此处是发布版本源码/测试阅读，没有运行该客户端，也不外推到插件或其他版本。[一手：开源实现与测试]

**最小核对**：固定客户端版本，分别记录“能发现 / 能加载 / 调用者是谁 / 工具实际允许或拒绝什么”。离线检查可列出模板中的权限字段、Hook 和动态命令，并核对目标版本的解析与调用路径；这只证明检查了声明和源码。真正的允许/拒绝行为需另在获授权的隔离环境验证，本轮未运行，不新增模拟宿主来冒充兼容性测试。**[经验：验证边界]**

## 2. 写好 Skill：明确增量与触发边界

**✅ 先保存已有任务里确实改变实现的知识、可靠脚本或验收条件。** 能由一条精确资料入口解决的，不扩写完整流程；顺序脆弱时写具体步骤，多种实现都成立时保留自由。官方规范仓库的[创建与评估指南](https://github.com/agentskills/agentskills/tree/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/skill-creation)提供结构，不保证某个长度或固定写法提高成功率。**[一手；经验：采用建议]**

- **description 写清何时用、何时不用**，用真实任务意图区分邻近场景。撤回“宁可积极触发”的通用建议：误触发也会增加流程和副作用。涉及发布、发送或提交的工作流，应按宿主选择显式调用，并保留动作权限；手动调用不是沙箱。**[经验；一手：[触发契约](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill)]**
- **脚本优先复用项目已有实现**。需要新增时，约定输入、失败退出、诊断与可重试性；对可能写入的操作提供预览或隔离入口。固定依赖版本并限制返回量，具体输出上限看目标宿主，不套统一字符数。**[经验：工程建议]**
- **评估同时看该触发与不该触发的任务**，再比较有／无 Skill 的真实产物、耗时、费用与人工处理。起步样例用于找错，不能代替留出任务与重复运行；必要回归断言不能因两边都通过就从验收中删除。完整方法见 [22](22-agent-evaluation.md)，规范评估与回归价值的依据见 [S2](research/2026-10-10-audit.md#s2--agent-skills-规范与评估)。**[一手：方法指南；经验：采用边界]**

**✅ 会替换现有依赖或配置时，把互斥前提放在操作入口，详细配方仍按需读取。** 在安装／迁移规则旁写清先检查什么、冲突时保留什么；多个入口可能相互替换时，两边都检查。YugabyteDB 的 YSQL／RAG Skill 修订把包冲突条件从按需参考移到正文，又补了反方向的故障排查入口，见[固定补丁与反证](research/2026-10-13-domain-skill-contract.md#互斥依赖短契约应放在哪个入口)。这不要求每项操作都停下求批准；已有授权与兼容路径明确时照常执行。**局限：这是审阅与源码机制，未取得原用户复测，不证明 Skill 净收益。** **[一手：固定修订；经验：采用判断，2026-10-17 UTC+8]**

### 先检查加载时执行，再决定是否自动触发

**✅ 只需知识时，优先纯指令／参考资料；确需动态取数或事件检查才加执行部分。** Claude Code 的动态 shell 会在正文交给模型前处理，仍受工具权限检查；在普通权限模式下，需要询问的命令会使加载失败，而不是弹窗继续。不要为修复加载失败就给宽泛 shell 许可，可先改为普通工具调用。auto mode 的延后执行例外见[官方权限路径](https://code.claude.com/docs/en/skills#permission-checks-on-injected-commands)。**[一手；经验：选择建议]**

Skill frontmatter 的 Hook 在调用时注册，后续匹配事件仍可能执行至会话结束；`once: true` 在首次成功后移除，不等于首次尝试后移除。Subagent Hook 的寿命则限该子 Agent。因而一次手动调用后，不能把下一轮当成没有扩展影响；试用退出时应移除对应配置并在干净会话核验。具体事件／匹配与沙箱边界沿用 [06](06-hooks-and-guardrails.md)，不是所有事件都会触发。**[一手：[Hook 生命周期](https://code.claude.com/docs/en/hooks#hooks-in-skills-and-agents)；经验：撤回建议]**

**局限**：上述是当前官方契约和固定源码阅读，未运行宿主或验证 Skill 对当前模型的净收益。

## 2.5 Codex：Skill 应补什么，又可能增加什么

OpenAI 官方 [skill-creator](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.system/skill-creator/SKILL.md) 明确写着 “Default assumption: Codex is already very smart”，要求只增加模型不具备的上下文，按任务脆弱性选择自由度，并把参考资料按需加载。这里支持的是**领域知识、可靠脚本、特定工具契约与真实约束**；不等于官方保证任何短 Skill 都更有效。**[一手：固定提交，2026-10-10 读取；研究：解释]**

但官方出品也必须逐项检查。[gh-fix-ci](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/gh-fix-ci/SKILL.md) 提供 GitHub Actions 日志定位脚本与字段兼容方法，同时明确要求先出计划、经显式批准再实施，并将外部 CI 提供商排除。✅ 日志定位方法值得借鉴；🧪 完整 Skill 是否适合日常自主修 CI，取决于你是否需要这个人工关口。如果用户已授权修复且希望持续执行，不能仅凭“官方”二字认定该流程匹配。研究这个文件不代表已在本会话调用它。**[一手；研究：采用判断]**

Superpowers 的轻量分支也要和入口规则一起看：[using-superpowers](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/using-superpowers/SKILL.md) 要求哪怕仅 1% 可能相关也先调用 Skill，并要求未 brainstorm 时在进入 Plan 前调用 brainstorming；后者又允许清楚的小任务直接执行、用户跳过问题。因此准确判断是：**存在广泛触发与额外衔接的可能，同时存在跳过路径**，不是所有任务都必跑全套，也不是有轻量路径就没有额外成本。**[一手；研究：配置分析，未测延迟]**

**✅ 在原生查资料、短契约／生成器与完整 Skill 之间，按实际缺口选择。** 先复用已有资源，再决定补什么，不以文件形式或重复次数判断：**[经验：累计采用判断，2026-10-14]**

- **资料没找到或版本错了**：给对应版本的精确入口；已有生成器／模板满足时直接复用，不重写配方。
- **资料已读，关键顺序仍漏做**：先补短验收契约。例如迁移前取得生产基线，迁移后用不变断言复测；已有测试环境不重新搭建。
- **功能已满足，还有明确的质量目标**：补会改变选择的领域依据与项目偏好，不必等待功能失败。界面中，并列能力不因装饰需要就标成步骤，真正的依赖顺序则应显露；先复用 brief 与设计系统，需要跨任务复用时可🧪试窄 Skill。视觉独特性不能代替用户完成操作的结果，见[设计依据与反例](research/2026-10-13-domain-skill-contract.md#质量提升领域依据目标与过程分开判断)。**[一手：设计指导与操作复盘；经验：采用判断]**
- **缺少可执行、可观察的能力**：先解决获授权的运行环境或工具，文字不能代替它。窄补充仍有跨步骤遗漏时，可🧪试完整 Skill；有明确质量目标时也可试用相关领域输入，但要区分设计依据、偏好与新增流程。必要行为不退步，目标质量或返工有改善且实际等待／人工打断可接受时才保留，否则缩减或撤回。

Next.js 的公开三臂定义使用同一包与任务；关键迁移事实及基线测试方法已在原生文档，Skill 主要加强顺序门和测试环境配方。它支持该迁移场景先补资料／短契约的选择，**尚不能证明完整 Skill 的净收益**：文档可继续引向 Skill，且未取得绑定三臂的原始运行，见[固定内容比较与累计取舍](research/2026-10-13-domain-skill-contract.md#8-累计取舍原生资料短契约还是完整-skill)。成本不能只看 token；删除流程仍须保留范围和失败反馈，见 [Codex 续接反例](research/2026-10-10-codex-continuity.md)。**[一手：源码；研究：证据边界]**

**✅ 普通规格／计划的占位符、覆盖与接口一致性先做同会话自审；独立检查针对已识别缺口，不默认循环求批准。** Superpowers 曾实际撤回通用文档 reviewer 循环，复杂计划的使用者则保留按次自选，见[撤回与保留依据](research/2026-10-12-community-source-records.md#文档评审循环实际撤回与按需保留)。局限是收益数据仍属作者自报，不能推出所有独立评审无用，也不改变安全 Auto-review 或用户确认要求。**[一手／社区；经验：采用判断，2026-10-13]**

对“是否真的有用”，还应检查运行环境：官方合作示例中，独立工具循环与 Codex 收到的 server instructions 不同，结果也不同；但其评分器又漏检答案数值和调用顺序。本轮已重评记录并运行定向反例，见 [插件评估核对](research/2026-10-11-codex-cookbook.md#5-插件评估真实环境更有意义但评分器仍要核查)。✅ 验证实际安装与行为，不只拿 Skill 文本单独问模型打分。**[研究]**

### 领域增量：输入形状和状态寿命比“再检查一次”具体

**✅ 涉及平台回调、持久化或恢复时，先补对应版本的契约与真实输入。** 先读项目已有类型、正确实现和测试；按上面的缺口区分补资料入口、短契约或操作配方，不默认安装完整流程。**[经验：采用判断，2026-10-13]**

Cloudflare 官方 Durable Objects Skill 指向休眠、状态恢复与测试资料；官方聊天室迁移实际修过对象 ID 序列化和 `msg.data` 误用。新回调直接给文本内容，伪造 `{data: text}` 的测试却能让旧错实现通过。本轮 10 项零成本表达式探测区分了这两种输入，也确认文本修复不自动支持二进制；因此验收应匹配真实回调与状态恢复，而不是只增加评审次数。固定来源、修复链、输出及撤回条件见[研究记录](research/2026-10-13-domain-skill-contract.md)。**[一手：官方源码和修复；研究：表达式实测]**

**关键局限**：这证明领域契约会改变实现，尚未证明当前强模型加载 Skill 比直接查文档更有收益。

**✅ 框架初始化还要补清生产配置的缺省失败行为。** 先复用已有生成器或官方部署说明，用隔离测试配置走实际生产入口，确认必要值缺失时明确失败，不能悄悄回退到开发默认值。Seedkit 的历史产物中，同一 Sonnet 任务的两臂确有这条契约差异；另一个无 Skill 的 Opus 产物已正确处理，因此已有原生结果满足就不加 Skill。固定来源与 AST 复核见[生产缺省契约](research/2026-10-13-domain-skill-contract.md#7-框架初始化生产配置缺失时哪一条知识值得保存)。**[一手：配方与生成产物；经验：采用建议]** **局限：两臂框架版本及生产验收工作不同，不能据此宣称 Skill 净收益。**

**✅ 比较依赖扫描结果前，先固定扫描器版本、数据库快照和验收口径。** SkillsBench 同题公开运行中，有 Skill 的命令显式跳过 DB 更新，无 Skill 的 `--offline-scan` 仍下载了新库；两者扫描器版本也不同。先尝试对应版本的精确参数或窄约束；它们满足任务时，不必据奖励差异增加整套 Skill。官方参数区分、运行产物与重复记录见[扫描运行复核](research/2026-10-13-domain-skill-contract.md#依赖扫描先锁外部数据和判定身份)。**局限：选中记录有重复内容，历史判定器身份未闭合，不能归因 Skill 净收益。** **[一手：公开运行与官方源码；研究：采用判断，2026-10-17（UTC+8）]**

### 原生文件对象：补创建配方，不重复安装已有工具

**✅ 为代码生成的文件先确定“用户还要操作什么”，再补窄配方。** 要求原生 Excel 透视表时，正确的分组数值仍不能代替 PivotTable；SkillsBench 的具体任务在已有 openpyxl/pandas 的环境中提供缓存、字段与对象关系的创建配方，补的是用法而非新工具。本轮最小探测也区分了静态汇总与可重新读出的 pivot/cache 结构。固定来源与实测见[原生对象研究](research/2026-10-13-domain-skill-contract.md#6-原生文件对象创建配方与静态汇总的区别)。**[一手：任务与源码；研究：本轮程序实测]**

开发导出功能时，先找项目已有生成器或目标应用验证过的模板；没有时才🧪试用对应格式/版本的窄参考，并在目标客户端验收实际操作。若只需静态结果，或原生 Agent 加一条资料链接即可稳定交付，就撤回额外 Skill。**[经验：本仓库采用判断]** **局限：文件结构往返不证明客户端功能；历史模型成绩也不证明当前强模型比直接查文档更省时。**

## 3. 插件与市场

**✅ 把插件当分发包，按实际组件选择，不按市场数量或“官方”标签全装。** 一个纯 Skill 可以只交付知识；含 MCP、Hook、LSP 或辅助程序的包还引入连接、进程和宿主约束。Claude 的[插件清单](https://code.claude.com/docs/en/plugins-reference)与 OpenAI 的[打包契约](https://developers.openai.com/plugins/build/plugins)并不承诺所有组件互通。**[一手；经验：采用判断]**

| 需要补什么 | 首选与增加条件 | 何时缩减或不用 |
|---|---|---|
| 同一领域配方／原生文件对象 | 🧪 先取窄 Skill 或参考，见 §2.5 | 资料入口或已有生成器已满足，撤回额外流程 |
| 当前外部状态或受限操作 | ✅ 先复用现有 CLI／连接；🧪 缺能力再选 MCP 包，见 [04](04-mcp.md) | 插件只是重复连接，或权限／结果回读不满足，不接入 |
| 语义诊断／引用导航 | ✅ 已有类型检查、IDE／LSP；🧪 会话缺该能力时选对应组件 | 当前会话不启动服务器，或项目无法正确解析，不以文本搜索冒充语义验证 |
| 跨项目分发已验证的配置组合 | 🧪 插件统一版本与入口；先列实际启用组件 | 附带全局 Hook／额外流程没有用途，拆出必要部分；维护成本高于复用收益就撤回 |

以上是本仓库采用判断 **[经验]**；第三行宿主依据如下。

**LSP 按缺口接入，不按语言标签必装。** 日常修错先用项目已有类型检查，需要语义引用时先复用现有 IDE／LSP。Claude Code 插件不含服务器二进制，安装后还须确认实际诊断或查询；官方云会话不启动插件语言服务器，本地安装不能给该云任务补上导航。见[官方机制与采用边界](research/2026-10-13-context-tool-choice.md#源码检索map语义引用与当前状态--6-客户端接入边界)。**[一手：官方文档；经验：采用判断]** **局限**：能力可用不等于已证明节省上下文或总耗时。

完整方法论插件的入口控制与撤回证据由 [24](24-community-workflows.md#本仓库判断强-agent-的默认基线应更轻)维护；验证回执是否可复用见 [21](21-agent-patterns.md#验证回执能复用什么)。这里不再重复推荐名单，也不把单个机制可借鉴写成整包应安装。**[经验：采用边界]**

### 安装前分清信任对象

**✅ 审查实际下载版本的指令、脚本、动态命令、Hook、连接和依赖；只启用任务需要的部分。** 在 Claude Code，命令型 Hook 和本地 MCP／LSP 等不受 Bash 工具沙箱包住；若要求整包进程隔离，按 [10](10-security.md) 选择执行环境，不能靠 Skill 的只读描述实现。历史本地插件重载修复及范围见 [S1a](research/2026-10-10-audit.md#s1a--2026-10-14-无人值守的停止与重试边界)。**[一手；经验：采用判断]**

OpenAI 当前打包文档另明确：安装／启用插件不自动信任其中的非托管 Hook，须审查并信任当前定义；脚本还必须存在于执行环境，网页安装不等于部署脚本。**因此需要 Hook 才成立的工作流，不能只见安装成功就投入使用。** **[一手：[Hook 信任与执行位置](https://developers.openai.com/plugins/build/plugins#bundled-mcp-servers-and-lifecycle-hooks)；经验：采用判断]**

## 3.5 跨平台复用：保留配方，重新核对执行契约

**✅ 优先迁移 Skill 的知识与资源；🧪 带宿主执行功能的包按目标分发渠道改造，不承诺原样迁移。** OpenAI 的 [Claude 插件迁移契约](https://developers.openai.com/plugins/guides/submit-claude-plugin)要求将 commands／agents 中可复用行为转成 Skills；公共目录提交须移除生命周期 Hook，依赖它们的包另走 Codex desktop 手动安装路径。LSP、outputStyles 等声明与 `userConfig` 安装提示也不能直接继承。市场审核不随包转移。**[一手；经验：迁移选择，2026-10-15 UTC+8]**

- **只是领域配方**：保留必要的 `SKILL.md`、脚本／参考资源，核对目标环境的路径与依赖，再比较实际结果。
- **必须依赖宿主事件或进程**：先核目标产品、渠道和受支持事件；没有等价执行点时，继续用原环境或已有显式脚本，不用“让模型记住执行”伪装成自动 Hook。
- **只为复用而被迫扩权或新增远程服务**：先缩减到可独立工作的部分；核心能力仍不成立，就暂缓迁移。

以上是工程选择 **[经验]**。**关键局限**：迁移契约证明需要改造，不证明改造后的行为与原宿主等价；引擎专有 Skill 的执行能力另见[引擎接入](../domains/game-dev/01-engine-integration.md)。

## 4. Skill、MCP、Subagent、Hook、CLAUDE.md 怎么选

| 你遇到的情况 | 加什么 |
|---|---|
| 反复遗漏、且所有相关任务都适用的项目约定 | 先排除过期或错误资料，再在 CLAUDE.md / AGENTS.md 加一条并指向权威来源 |
| 重复任务需要仓库没有的领域配方或经过验证的资源 | **窄 Skill**；已有文档、脚本或模板可直接复用时，只加入口 |
| 总在从浏览器复制 Agent 看不到的数据 | **MCP**（或 CLI） |
| 同名符号多，需要确认语义引用，现有搜索难以消歧 | 先用现有 **IDE／LSP**；缺少时再评估插件，并核对会话支持与项目解析 |
| 某个支线任务的输出淹没了对话 | **Subagent** |
| 某个运行时事件需要机械检查 | **Hook**，并验证匹配、超时、错误处理和替代路径；不代替沙箱 |
| 多个项目需要共同分发已验证的组件组合 | 再打包成**插件**；单份资料或 Skill 不必升级为整包 |
| 想要固定的回答风格或长度 | 先用简短偏好；Claude Code 只需短回答可选内置 **Concise**，确需自定义 **Output style** 时先核下述编程指令保留条件 |

工具类别参考 Claude Code 官方文档《Extend Claude Code》；表中的选择条件是本仓库建议，尤其前两项按信息缺口与复用价值判断，不按固定出错或粘贴次数触发。**[一手：工具类别；经验：选择建议]**

**Claude Code 的自定义 style 不只是改格式**：在完整 system prompt 下，它默认移除内建软件工程指令这一节；仍要做编程任务时，设 `keep-coding-instructions: true` 并核对当前 prompt 模式，短 system prompt 下该字段无效。内置 Concise（v2.1.237+）保留工程指令，可避免只为简短回答而改变这一部分。Style 作用于主会话及继承全历史的 conversation fork，普通子 Agent 不继承；它不替代权限控制，也不保证遵从。无需为使用 style 一律切换完整 prompt；[原文与边界](research/2026-10-10-audit.md#s2b--2026-10-16-output-style-的编程指令边界)核实于 2026-10-16（UTC+8），未运行客户端。**[一手：官方契约；经验：采用判断]**

## 来源

- [agentskills.io 规范](https://agentskills.io/specification)、[规范仓库 docs/skill-creation](https://github.com/agentskills/agentskills/tree/main/docs/skill-creation)
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Code Skills 文档](https://code.claude.com/docs/en/skills)、[Extend Claude Code](https://code.claude.com/docs/en/features-overview)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)、[anthropics/claude-code/plugins](https://github.com/anthropics/claude-code/tree/main/plugins)
- [OpenAI 插件打包](https://developers.openai.com/plugins/build/plugins)、[Claude 插件迁移契约](https://developers.openai.com/plugins/guides/submit-claude-plugin)
