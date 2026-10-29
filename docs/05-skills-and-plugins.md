# 05 · Agent Skills 与插件

> 核实时间：项目采用主依据 2026-10-29；机制原核实 2026-10-22，同装 Skill 2026-10-23、原生预设 2026-10-24（UTC+8）。其余固定版本与验证范围随节标注，本轮未重跑客户端。

<a id="30-秒结论"></a>

## 先做什么

**🟡 按当前任务调用项目已有 Skill，把项目特有的操作配方、领域判断和检查命令一起用上；缺工具能力再补 MCP，插件按其中实际需要的组件选择。** 不必先经历失败才使用合适的配方，也不把所有任务送进同一套流程。具体首步与选择见[该装哪些 Skill 与插件](decisions/skills-and-plugins.md)。这条主路线仍待本仓新读者完成真实任务验收。

| 当前需要 | 借用强项目的做法 | 不照搬的部分 |
|---|---|---|
| 项目检查、文档同步、迁移或发布准备 | 根指令按任务指向 Skill；正文保存操作顺序、必要引用和真命令 | 别人的审批、发布权限、分支与环境约定 |
| 产品或领域质量判断 | 保存已接受的选择理由、适用范围、现成组件和已交付实例；机械规则交 lint／测试 | 只有外观描述、缺原项目资源的整包移植 |
| 多人或多客户端共享 | 将选定 Skill 与资源纳入版本管理；确有分发维护问题再用插件／管理器 | 为单份资料引入额外 Hook、服务或全局流程 |

## 主依据：项目怎样用，而不是装了多少

- **OpenAI Agents SDK：按改动触发。** [根指令](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/AGENTS.md#L25-L34)分别选择策略、审查、检查和知识 Skill；报告任务不进入实施审查。[docs-sync](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/.agents/skills/docs-sync/SKILL.md#L12-L59)按请求区分审计与修改，核代码和文档的对应关系，再按改动等级检查。[CI 配置](https://github.com/openai/openai-agents-python/blob/cd26bbbc52847845fde73b9952b51e62e2bcbdc0/.github/workflows/repo-skills.yml)还检查 Skill 自身。
- **Next.js：深操作知识按需加载。** [编写规范](https://github.com/vercel/next.js/blob/7fd2d0a69534e26cfa10c7c11acc7c8450bf7cd5/.agents/skills/README.md#L5-L17)把任务特定流程与诊断放进 Skill，普遍约束留在根指令。但其 [update-docs](https://github.com/vercel/next.js/blob/7fd2d0a69534e26cfa10c7c11acc7c8450bf7cd5/.agents/skills/update-docs/SKILL.md#L72-L92)要求逐处修改确认；已有实施授权的项目可借文档映射，不继承这套审批。
- **Sentry JavaScript：项目配方入 Git。** [agents.toml](https://github.com/getsentry/sentry-javascript/blob/b722d3cfde2f4484ff8928bdd166f7afc3cadb25/agents.toml#L1-L19)让协作者取得已提交的 Skill，无需先运行安装器；[框架更新 workflow](https://github.com/getsentry/sentry-javascript/blob/b722d3cfde2f4484ff8928bdd166f7afc3cadb25/.github/workflows/track-framework-updates.yml#L44-L64)已接入具体 Skill、脚本和输出约束。本轮核到工作流配置，未取得其成功运行结果。

Vercel 团队的 [product-design](https://vercel.com/blog/teaching-agents-product-design-at-vercel)保存代码里没有的产品决策；[后续实践](https://vercel.com/blog/how-our-agents-build-on-brand-pages-with-design-md)发现，把它直接压成公共提示会丢失组件与实例环境，改用指导、共享 CSS 和产物反馈。值得借的是领域知识与可执行资源的组合，不是“提示越短越好”。

**真实使用反馈决定触发范围。** [Luca 的 9 月实践](https://www.lucavallin.com/blog/how-i-actually-use-claude-code)推荐 Superpowers 和实际技术栈 Skill，并报告用它们完成 Apple Health 功能；同时清理闲置插件，把直接修改、只做计划和完整流程分开。[V2EX 的 7 月讨论](https://v2ex.com/t/1227194)既有小任务被流程拖慢的自报，也认可详细计划便于交给另一模型实施；同帖还质疑耗时归因，并指出 6.1.1 已简化流程。借用任务分流，不按不同版本的个人耗时给当前插件排序。

**官方配方仍要核接口。** [Supabase 使用者 #83](https://github.com/supabase/agent-skills/issues/83)转贴引入 Skill 时的 CodeRabbit 审查报告，未见维护者确认；本仓对照固定源码核了驱动选项与约束检查两项，见[收件记录](collaboration/inbox.md)。采用到哪一条，就按实际依赖和任务验证到哪一条。

**依据与范围**：以上为一手项目配置、团队实践及使用者自报，2026-10-29 核实；没有统一的当前模型净收益比较，整体最高水平仍未知。本仓 TanStack、Serena 等窄试用保留在对应节作操作与边界佐证，主推荐的真实读者验收尚待完成。模型迁移的历史证据见[代际复核](research/2026-10-13-domain-skill-contract.md#p52技能代际复核)，不再用它代替项目采用证据。

## 1. Agent Skills 规范要点

**写 Skill 从最小结构开始：`SKILL.md` 必需，脚本、参考资料和资源子目录按需添加。**

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

**渐进式披露分三个阶段：发现（加载 name 和 description）→ 激活（读取完整 SKILL.md）→ 执行（按需运行脚本、读取参考文件）。** 它降低了相对一次性加载全部正文的成本，但每个 Skill 的描述仍有累计开销，重复或宽泛的触发描述还会影响选择；不能据此推导“安装任意数量都没有代价”。

**宿主扩展不是规范的可移植部分。** Claude Code 的手动触发、子 Agent、路径匹配、动态 shell 和 Hook 字段须按当前宿主文档核对，不把字段名复制到其他产品就当生效。安装前的重点是下一节的权限与执行阶段，不必预装整套扩展。

**依据**：[一手] Agent Skills 规范、[Claude Code Skills frontmatter 文档](https://code.claude.com/docs/en/skills#frontmatter-reference)；[经验] 选择重点；核实 2026-10-22。

### 能加载，不等于权限语义可移植

**✅ 采用：迁移 Skill 时单独核对权限；不为兼容而默认扩权。** 适合跨客户端复用或审查外部 Skill 的项目；仅改正文的小任务不必引入新验证框架。

- **规范**：`allowed-tools` 仍是实验字段，规范明确提示不同 agent 的支持可能不同。格式合法不能证明运行时实现了授权或限制。
- **Claude Code 当前契约**：该字段给调用 Skill 的当前轮次免询问许可，下次用户消息到来后清除；它不移除未列出的工具，后者仍按权限设置处理，deny／ask 规则仍可覆盖它。项目 Skill 的此字段不受工作区信任闸门保护，未信任目录中的 `-p` 运行也可能应用它；应在运行前审查，而不是把“只列 Read”当成只读沙箱。组织的 `allowManagedPermissionRulesOnly` 从 v2.1.282 起可忽略项目／个人等来源的该字段。
- **Codex 0.162.1 的反例**：固定提交 `092d3acd6bec3e3a14bdc7e7a2810ab628ab759d` 的 Skill 元数据解析器没有把 `allowed-tools` 转为工具授权；其 Unix zsh-fork 测试另明确，`agents/openai.yaml` 的文件写权限声明不扩大当前轮次的 workspace-write 沙箱。二者不是同一个字段，也不能外推所有执行后端；采用时核实际轮次权限，不照搬 Claude 的预授权写法。解析器、测试与边界见[研究记录](research/2026-10-10-audit.md#s2a--2026-10-15-skill-采用与宿主执行边界)。
- **OpenCode 的具体反例**：v1.19.0（提交 `733b2c627e5aec39cb33cc22373bdce33053ef2c`）CLI 的 Skill 加载器只把名称、描述、位置、正文存入 Skill 信息，没有把 `allowed-tools` 转为权限；Skill 工具另以技能名请求 `skill` 权限后返回内容。对应测试检查了加载请求和返回内容，不能据此宣称正文里的后续工具调用已获准或被限制。此处是发布版本源码／测试阅读，没有运行该客户端，也不外推到插件或其他版本。

**最小核对：固定客户端版本，分别记录“能发现 / 能加载 / 调用者是谁 / 工具实际允许或拒绝什么”。** 离线检查可列出模板中的权限字段、Hook 和动态命令，并核对目标版本的解析与调用路径；这只证明检查了声明和源码。真正的允许／拒绝行为需另在获授权的隔离环境验证；本仓未运行该验证，也不新增模拟宿主来冒充兼容性测试。

**依据**：[一手] [Agent Skills 规范 allowed-tools 字段](https://agentskills.io/specification#allowed-tools-field)、[Claude Code 预授权说明](https://code.claude.com/docs/en/skills#pre-approve-tools-for-a-skill)与[注入命令的权限检查](https://code.claude.com/docs/en/skills#permission-checks-on-injected-commands)、Codex 0.162.1 固定提交源码与测试、[OpenCode v1.19.0 加载器](https://github.com/anomalyco/opencode/blob/733b2c627e5aec39cb33cc22373bdce33053ef2c/packages/opencode/src/skill/index.ts)、[Skill 工具](https://github.com/anomalyco/opencode/blob/733b2c627e5aec39cb33cc22373bdce33053ef2c/packages/opencode/src/tool/skill.ts)与[对应测试](https://github.com/anomalyco/opencode/blob/733b2c627e5aec39cb33cc22373bdce33053ef2c/packages/opencode/test/tool/skill.test.ts)；[经验] 设计建议、验证边界；核实 2026-10-22。

## 2. 写好 Skill：明确增量与触发边界

**✅ 先保存已有任务里确实改变实现的知识、可靠脚本或验收条件。** 能由一条精确资料入口解决的，不扩写完整流程；顺序脆弱时写具体步骤，多种实现都成立时保留自由。官方规范仓库的创建与评估指南提供结构，不保证某个长度或固定写法提高成功率。

- **description 写清何时用、何时不用**，用真实任务意图区分邻近场景。撤回“宁可积极触发”的通用建议：误触发也会增加流程和副作用。涉及发布、发送或提交的工作流，应按宿主选择显式调用，并保留动作权限；手动调用不是沙箱。
- **脚本优先复用项目已有实现。** 需要新增时，约定输入、失败退出、诊断与可重试性；对可能写入的操作提供预览或隔离入口。固定依赖版本并限制返回量，具体输出上限看目标宿主，不套统一字符数。
- **评估同时看该触发与不该触发的任务**，再比较有／无 Skill 的真实产物、耗时、费用与人工处理。起步样例用于找错，不能代替留出任务与重复运行；必要回归断言不能因两边都通过就从验收中删除。完整方法见 [22](22-agent-evaluation.md)，规范评估与回归价值的依据见 [S2](research/2026-10-10-audit.md#s2--agent-skills-规范与评估)。

**✅ 会替换现有依赖或配置时，把互斥前提放在操作入口，详细配方仍按需读取。** 在安装／迁移规则旁写清先检查什么、冲突时保留什么；多个入口可能相互替换时，两边都检查。YugabyteDB 的 YSQL／RAG Skill 修订把包冲突条件从按需参考移到正文，又补了反方向的故障排查入口，见[固定补丁与反证](research/2026-10-13-domain-skill-contract.md#互斥依赖短契约应放在哪个入口)。这不要求每项操作都停下求批准；已有授权与兼容路径明确时照常执行。**局限：这是审阅与源码机制，未取得原用户复测，不证明 Skill 净收益。**

**依据**：[一手] Agent Skills 仓库[创建与评估指南](https://github.com/agentskills/agentskills/tree/69ef37e9424c0a7ea9dd2293b559e43ec8176379/docs/skill-creation)、[Claude Code 触发契约](https://code.claude.com/docs/en/skills#control-who-invokes-a-skill)、YugabyteDB 固定修订（2026-10-17 UTC+8）；[经验] 采用建议、工程建议、采用判断；核实 2026-10-22。

### 已有多个 Skill：在原组合里验新增收益

**✅ 试一个新 Skill 时，两组都保留原项目真正需要的其他 Skill，只在候选组加入它。** 单独测过不等于放回组合后仍有效；不要把基线清空成缺少原有能力的环境。

接收时分看“任务完成”与“原有必要约束保留”，例如不改指定文件、沿用项目组件、保留既定输出格式；约束必须来自真实需求，不以执行了哪个 Skill 判胜负。若任务仍过、旧约束却丢失，先核实际加载与作用域，移除或缩窄冲突候选后再验，不继续叠相似 Skill。

[同装冲突研究与评估设计](research/2026-10-13-domain-skill-contract.md#同装-skill先保实际组合再验独有约束)分别提供反例与分组依据；相似度工具只能帮忙挑要查的组合。**本仓未运行同装对照，论文所测模型也不代表当前代收益。** 原生工具或人工少量核对足够时，不为此另装评测框架。

**依据**：[研究／经验] 同装冲突研究与评估设计（2026-10-23）；核实 2026-10-23。

### 先检查加载时执行，再决定是否自动触发

**✅ 只需知识时，优先纯指令／参考资料；确需动态取数或事件检查才加执行部分。** Claude Code 的动态 shell 会在正文交给模型前处理，仍受工具权限检查；在普通权限模式下，需要询问的命令会使加载失败，而不是弹窗继续。不要为修复加载失败就给宽泛 shell 许可，可先改为普通工具调用。auto mode 的延后执行例外见官方权限说明。

Skill frontmatter 的 Hook 在调用时注册，后续匹配事件仍可能执行至会话结束；`once: true` 在首次成功后移除，不等于首次尝试后移除。Subagent Hook 的寿命则限该子 Agent。因而一次手动调用后，不能把下一轮当成没有扩展影响；试用退出时应移除对应配置并在干净会话核验。具体事件／匹配与沙箱边界沿用 [06](06-hooks-and-guardrails.md)，不是所有事件都会触发。

**局限**：上述是当前官方契约和固定源码阅读，未运行宿主或验证 Skill 对当前模型的净收益。

**依据**：[一手] [Claude Code 注入命令的权限检查](https://code.claude.com/docs/en/skills#permission-checks-on-injected-commands)、[Hook 生命周期](https://code.claude.com/docs/en/hooks#hooks-in-skills-and-agents)；[经验] 选择建议、撤回建议；核实 2026-10-22。

### 会话内改 Skill：刷新目录后，再调用新配方

**先用原生刷新，不为每次改正文重启会话。** 非 bare 会话会监听启动时已存在的个人／项目／`--add-dir` 下 `.claude/skills/`，仅覆盖 `SKILL.md` 文本；若顶层 `.claude/skills/` 是会话启动后才建，执行 `/reload-skills`，之后该目录每次改动也再次执行。用 `/skills` 核目标，再在消息开头显式 `/技能名` 调用，并核新版关键步骤。

**发现刷新不等于替换旧对话。** 已载入正文保留在上下文，不会每轮重读；不要仅凭“文件已改”就认为后续采用新版。若同一目录也是插件，改 hooks、MCP、agents 或 output-styles 要用 `/reload-plugins`，不是只刷新 Skill。具体安装反例与范围见[研究记录](research/2026-10-13-domain-skill-contract.md#会话内改-skill刷新与正文生命周期)；本仓未运行原生客户端。

**依据**：[一手] [Claude Code 会话内改 Skill](https://code.claude.com/docs/en/skills#edit-a-skill-during-a-session)、[Skill 正文生命周期](https://code.claude.com/docs/en/skills#skill-content-lifecycle)（2026-10-23）；[经验] 操作选择；核实 2026-10-23。

## 2.5 Codex：Skill 应补什么，又可能增加什么

**Codex 的 Skill 只补模型不具备的上下文：领域知识、可靠脚本、特定工具契约与真实约束。** OpenAI 官方 skill-creator 明确写着 “Default assumption: Codex is already very smart”，要求只增加模型不具备的上下文，按任务脆弱性选择自由度，并把参考资料按需加载。这不等于官方保证任何短 Skill 都更有效。

**官方出品也必须逐项检查。** gh-fix-ci 提供 GitHub Actions 日志定位脚本与字段兼容方法，同时明确要求先出计划、经显式批准再实施，并将外部 CI 提供商排除。✅ 日志定位方法值得借鉴；🧪 完整 Skill 是否适合日常自主修 CI，取决于你是否需要这个人工关口。如果用户已授权修复且希望持续执行，不能仅凭“官方”二字认定该流程匹配。研究这个文件不代表已在本会话调用它。

**Superpowers 的轻量分支也要和入口规则一起看。** using-superpowers 要求哪怕仅 1% 可能相关也先调用 Skill，并要求未 brainstorm 时在进入 Plan 前调用 brainstorming；后者又允许清楚的小任务直接执行、用户跳过问题。因此要按实际入口判断：**这套规则可能广泛触发并增加衔接，同时保留了清楚小任务的跳过路径；有轻量路径也不等于没有额外成本。**

**✅ 在原生查资料、短契约／生成器与完整 Skill 之间，按实际缺口选择。** 先复用已有资源，再决定补什么，不以文件形式或重复次数判断：

- **资料没找到或版本错了**：给对应版本的精确入口；已有生成器／模板满足时直接复用，不重写配方。
- **资料已读，关键顺序仍漏做**：先补短验收契约。例如迁移前取得生产基线，迁移后用不变断言复测；已有测试环境不重新搭建。
- **功能已满足，还有明确的质量目标**：补会改变选择的领域依据与项目偏好，不必等待功能失败。界面中，并列能力不因装饰需要就标成步骤，真正的依赖顺序则应显露；先复用 brief 与设计系统，需要跨任务复用时可 🧪 试窄 Skill。视觉独特性不能代替用户完成操作的结果，见[设计依据与反例](research/2026-10-13-domain-skill-contract.md#质量提升领域依据目标与过程分开判断)。
- **缺少可执行、可观察的能力**：先解决获授权的运行环境或工具，文字不能代替它。窄补充仍有跨步骤遗漏时，可 🧪 试完整 Skill；有明确质量目标时也可试用相关领域输入，但要区分设计依据、偏好与新增流程。必要行为不退步，目标质量或返工有改善且实际等待／人工打断可接受时才保留，否则缩减或撤回。

Next.js 的公开三臂定义使用同一包与任务；关键迁移事实及基线测试方法已在原生文档，Skill 主要加强顺序门和测试环境配方。它支持该迁移场景先补资料／短契约的选择，**尚不能证明完整 Skill 的净收益**：文档可继续引向 Skill，且未取得绑定三臂的原始运行，见[固定内容比较与累计取舍](research/2026-10-13-domain-skill-contract.md#8-累计取舍原生资料短契约还是完整-skill)。成本不能只看 token；删除流程仍须保留范围和失败反馈，见 [Codex 续接反例](research/2026-10-10-codex-continuity.md)。

**✅ 普通规格／计划的占位符、覆盖与接口一致性先做同会话自审；独立检查针对已识别缺口，不默认循环求批准。** Superpowers 曾实际撤回通用文档 reviewer 循环，复杂计划的使用者则保留按次自选，见[撤回与保留依据](research/2026-10-12-community-source-records.md#文档评审循环实际撤回与按需保留)。局限是收益数据仍属作者自报，不能推出所有独立评审无用，也不改变安全 Auto-review 或用户确认要求。

**“是否真的有用”还要检查运行环境。** 官方合作示例中，独立工具循环与 Codex 收到的 server instructions 不同，结果也不同；但其评分器又漏检答案数值和调用顺序。已重评记录并运行定向反例，见 [插件评估核对](research/2026-10-11-codex-cookbook.md#5-插件评估真实环境更有意义但评分器仍要核查)。✅ 验证实际安装与行为，不只拿 Skill 文本单独问模型打分。

**依据**：[一手] OpenAI [skill-creator](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.system/skill-creator/SKILL.md)（固定提交，2026-10-10 读取）、[gh-fix-ci](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/gh-fix-ci/SKILL.md)、[using-superpowers](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/using-superpowers/SKILL.md)、Next.js 三臂定义与源码；[一手／社区] Superpowers 文档评审循环的撤回与按需保留；[研究] 配置分析（未测延迟）、证据边界；[经验] 累计采用判断（2026-10-14）、采用判断（2026-10-13）；核实 2026-10-22。

### 随依赖交付窄Skill：先定位，再验实际功能

**🧪 项目已经采用该库时，可先读安装包自带的任务配方，不必另装全套流程。** [TanStack Intent实试](../experiments/tanstack-url-state/README.md#窄-skill-的复制入口)用0.5.6的list／load找到实际router-core 1.171.39中的search-params配方，并完成可分享筛选功能；这是手动加载，不是自动激活或模型收益对照。

包里的`library_version`仍写1.171.15：随包交付能缩短定位路径，不能替代当前接口与行为核对。仅一次任务可直接读包内文件；已知官方资料足够就沿用，不为加载而加hooks。需要多包管理再用CLI，从实际消费者目录解析，并只采纳本题需要的来源。

**依据**：[本仓实试] TanStack Intent 0.5.6、router-core 1.171.39（2026-10-23）；[一手／研究] [TanStack 官方维护边界](https://tanstack.com/blog/intent-0.5-skills-you-can-maintain)；核实 2026-10-23。

### 缺执行顺序时，补程序知识而非概览

**✅ 文档或既有Skill已讲清步骤与边界，就沿用；🧪缺状态转换、失败恢复或先后依赖时，再从相关实现提炼可回查的程序卡。** 只保留本次任务所需的前提、顺序、不变量、失败出口与来源版本。不是把源码重新叙述一遍。

- **会决定执行方案或副作用的条件放计划**，例如先核身份再写入；不另加通用思考仪式。
- **已有草稿的遗漏检查放既有评审**，映射到diff、失败分支和测试；不因有卡新增审批轮次。
- **保留权威原文和有效Skill**。文档承诺与代码现状冲突，先查版本及目标行为；卡不匹配、过期或只重复材料，就回原文并缩减／撤回。

Agent提炼程序卡并核查来源，人判断目标行为及风险；按上面的分工接入计划或既有评审。

**从历史运行提炼Skill时，保留结果及其验收依据。** 让Agent区分已成立的步骤、失败尝试和待验证经验；失败轨迹可留下反例或恢复线索，其中的有效步骤也须按证据复用，不能把整段经历当成功配方。结果未知就先不升为默认。依据是[混合轨迹的旧代受控比较](research/2026-10-13-domain-skill-contract.md#p81运行经验提炼保留结果证据)，不是当前强模型自动维护Skill的收益证明。

**依据**：[研究] [Code2Skill §5.4](https://arxiv.org/html/2609.05571v1#S5.S4)（计划／评审接入线索，非插入点纯消融，未测当前 Astra／5.5；[固定实现与采用限制](research/2026-10-13-domain-skill-contract.md#p72审计补强程序卡放在能用它的地方)）、混合轨迹的旧代受控比较；[经验] 条件默认、采用判断；核实 2026-10-22。

### 领域增量：输入形状和状态寿命比“再检查一次”具体

**✅ 涉及平台回调、持久化或恢复时，先补对应版本的契约与真实输入。** 先读项目已有类型、正确实现和测试；按上面的缺口区分补资料入口、短契约或操作配方，不默认安装完整流程。

Cloudflare 官方 Durable Objects Skill 指向休眠、状态恢复与测试资料；官方聊天室迁移实际修过对象 ID 序列化和 `msg.data` 误用。新回调直接给文本内容，伪造 `{data: text}` 的测试却能让旧错实现通过。10 项零成本表达式探测区分了这两种输入，也确认文本修复不自动支持二进制；因此验收应匹配真实回调与状态恢复，而不是只增加评审次数。固定来源、修复链、输出及撤回条件见[研究记录](research/2026-10-13-domain-skill-contract.md)。**关键局限：这证明领域契约会改变实现，尚未证明当前强模型加载 Skill 比直接查文档更有收益。**

**✅ 框架初始化还要补清生产配置的缺省失败行为。** 先复用已有生成器或官方部署说明，用隔离测试配置走实际生产入口，确认必要值缺失时明确失败，不能悄悄回退到开发默认值。Seedkit 的历史产物中，同一 Sonnet 任务的两臂确有这条契约差异；另一个无 Skill 的 Opus 产物已正确处理，因此已有原生结果满足就不加 Skill。固定来源与 AST 复核见[生产缺省契约](research/2026-10-13-domain-skill-contract.md#7-框架初始化生产配置缺失时哪一条知识值得保存)。**局限：两臂框架版本及生产验收工作不同，不能据此宣称 Skill 净收益。**

**✅ 比较依赖扫描结果前，先固定扫描器版本、数据库快照和验收口径。** SkillsBench 同题公开运行中，有 Skill 的命令显式跳过 DB 更新，无 Skill 的 `--offline-scan` 仍下载了新库；两者扫描器版本也不同。先尝试对应版本的精确参数或窄约束；它们满足任务时，不必据奖励差异增加整套 Skill。官方参数区分、运行产物与重复记录见[扫描运行复核](research/2026-10-13-domain-skill-contract.md#依赖扫描先锁外部数据和判定身份)。**局限：选中记录有重复内容，历史判定器身份未闭合，不能归因 Skill 净收益。**

**依据**：[一手] Cloudflare 官方 Durable Objects Skill 与聊天室迁移源码、Seedkit 配方与生成产物、SkillsBench 公开运行与官方源码；[研究] 10 项零成本表达式实测、依赖扫描采用判断（2026-10-17 UTC+8）；[经验] 采用建议；核实 2026-10-22。

### 框架反馈已经可执行时，先让知识进入改法

**🧪 先让Agent运行框架的真实检查，并带上不能牺牲的需求；不必先给它整包Skill。** Next.js官方040任务要求标题不等库存、库存保持实时。实际16.4.3构建指出运行时数据在Suspense之外，给出stream／cache／block三条技术路线；按任务只能选同步标题＋异步库存边界，不能缓存库存或关闭校验求绿。[单文件补丁与最短重放](../experiments/next-static-shell.md)已完成真实构建1→0，保留原数据函数和配置。

这里增强的是Agent获得可执行领域反馈并正确取舍的能力，不是“多给资料”本身。该官方合成题尚未验证软导航、浏览器锁或模型增益；完整Skill是否有额外收益仍需真实缺口，不能从一次框架构建通过推断。

**依据**：[一手／本仓实试] Next.js 官方 040 任务与 16.4.3 构建（2026-10-24，真实构建 1→0）；[研究] 选择与边界；核实 2026-10-24。

### 原生文件对象：补创建配方，不重复安装已有工具

**✅ 为代码生成的文件先确定“用户还要操作什么”，再补窄配方。** 要求原生 Excel 透视表时，正确的分组数值仍不能代替 PivotTable；SkillsBench 的具体任务在已有 openpyxl／pandas 的环境中提供缓存、字段与对象关系的创建配方，补的是用法而非新工具。最小探测也区分了静态汇总与可重新读出的 pivot／cache 结构。固定来源与实测见[原生对象研究](research/2026-10-13-domain-skill-contract.md#6-原生文件对象创建配方与静态汇总的区别)。

开发导出功能时，先找项目已有生成器或目标应用验证过的模板；没有时才🧪试用对应格式／版本的窄参考，并在目标客户端验收实际操作。若只需静态结果，或原生 Agent 加一条资料链接即可稳定交付，就撤回额外 Skill。**局限：文件结构往返不证明客户端功能；历史模型成绩也不证明当前强模型比直接查文档更省时。**

**依据**：[一手] SkillsBench 任务与源码；[研究] 原生对象程序实测；[经验] 本仓库采用判断；核实 2026-10-22。

### 先定位实际依赖，再选文档或源码

**✅ 查实际行为，从调用方追到已解析包、项目补丁和具体模块；查版本用法，再看官方文档或 Context7。** Zed 的 `reqwest` 实际是重命名 fork，Vite 也有依赖 alias／patch，同名版本不能替代实现定位。

在已准备依赖的 opensrc 根目录，用 Bash、Cargo、jq、realpath 沿消费包的普通直接依赖边查询。换项目时改前三项，并给 metadata 带上与构建相同的 feature 参数：

```bash
set -o pipefail
manifest=packages/opensrc/cli/Cargo.toml
dep=reqwest
target=x86_64-unknown-linux-gnu
cargo metadata --format-version 1 --locked --offline \
  --manifest-path "$manifest" --filter-platform "$target" |
  jq -e --arg manifest "$(realpath "$manifest")" --arg dep "$dep" '
    . as $m
    | $m.packages[] | select(.manifest_path == $manifest)
    | .id as $consumer
    | $m.resolve.nodes[] | select(.id == $consumer)
    | .deps[] | select(.name == $dep)
    | select(any(.dep_kinds[]; .kind == null))
    | .pkg as $id
    | $m.packages[] | select(.id == $id)
    | {name, version, source, manifest_path,
       lib_src: [.targets[] | select(.kind | index("lib")) | .src_path]}
  '
```

读取返回的 `manifest_path`、`lib_src`，沿调用进入实际模块。缺包先补齐锁定依赖；无结果先查消费包与依赖类别。本仓 opensrc 0.7.3 修复中定位到 reqwest 0.12.28，发现 blocking 与异步客户端的同名 `timeout` 签名不同。API 接收仍跑消费包当前 target／feature 的检查；metadata 可能合并其他工作区成员的 feature。

**依据**：[Cargo metadata](https://doc.rust-lang.org/cargo/commands/cargo-metadata.html)、[Zed fork](https://github.com/zed-industries/zed/blob/57c7b10ece671185a8863515667ee5248c6f0d53/Cargo.toml#L864-L872)、[Vite alias／patch](https://github.com/vitejs/vite/blob/e954a9cda0b5254be495a937333a0be1b8503d8f/pnpm-workspace.yaml#L13-L22)、[feature 合并反馈](https://github.com/rust-lang/cargo/issues/7754)；[本仓 opensrc 入口](../experiments/opensrc-ref-integrity/README.md)。原核实 2026-10-26，验证范围为离线定位与源码阅读。

### 领域配方：先读安装包，不为一项知识装整套流程

**已有 TanStack Router，要让筛选在详情、返回和分享链接后保留，先读包内 `search-params`。** 在声明 `@tanstack/react-router` 且已安装依赖的应用目录运行；npm／pnpm 均可，无需传递依赖提升到根目录：

```sh
node --input-type=commonjs <<'NODE'
const { createRequire } = require('node:module')
const { dirname, join } = require('node:path')
const { readFileSync, existsSync } = require('node:fs')
const router = createRequire(require.resolve('@tanstack/react-router'))
const core = router.resolve('@tanstack/router-core/package.json')
const file = join(dirname(core), 'skills/router-core/search-params/SKILL.md')
console.log('router-core', JSON.parse(readFileSync(core, 'utf8')).version)
console.log(existsSync(file) ? readFileSync(file, 'utf8') : '该版本未附此 Skill，请查对应版本官方指南。')
NODE
```

预期看到实际 core 版本和正文；找不到 Router 先查消费包，包内无 Skill 就回对应版本指南。配方组合 `retainSearchParams` 与 `stripSearchParams`：已应用条件从 URL 读，未提交输入另存草稿，清空时显式给默认值。沿现有路由验详情／返回／清空／历史前进后退／分享恢复；[可复制任务与实现](../experiments/tanstack-url-state/README.md#窄-skill-的复制入口)无需新增 schema 库或全局 hooks。

**依据**：[TanStack 作者 Skill](https://github.com/TanStack/router/blob/6b9fe6d29552270836c511bc9b343d73541f4424/packages/router-core/skills/router-core/search-params/SKILL.md)，2026-10-28 重核固定源码。本仓 10-23～24 手动加载 core 1.171.39 的配方，在上述示例通过测试、构建与真实 Chrome 操作；Skill 元数据仍标 1.171.15，兼容性按当前源码和测试接收。自动触发与收益对照未测。

## 3. 插件与市场

**✅ 把插件当分发包，按实际组件选择，不按市场数量或“官方”标签全装。** 一个纯 Skill 可以只交付知识；含 MCP、Hook、LSP 或辅助程序的包还引入连接、进程和宿主约束。Claude 的插件清单与 OpenAI 的打包契约并不承诺所有组件互通。

| 需要补什么 | 首选与增加条件 | 何时缩减或不用 |
|---|---|---|
| 同一领域配方／原生文件对象 | 🧪 先取窄 Skill 或参考，见 §2.5 | 资料入口或已有生成器已满足，撤回额外流程 |
| 当前外部状态或受限操作 | ✅ 先复用现有 CLI／连接；🧪 缺能力再选 MCP 包，见 [04](04-mcp.md) | 插件只是重复连接，或权限／结果回读不满足，不接入 |
| 语义诊断／引用导航 | ✅ 已有类型检查、IDE／LSP；🧪 会话缺该能力时选对应组件 | 当前会话不启动服务器，或项目无法正确解析，不以文本搜索冒充语义验证 |
| 跨项目分发已验证的配置组合 | 🧪 插件统一版本与入口；先列实际启用组件 | 附带全局 Hook／额外流程没有用途，拆出必要部分；维护成本高于复用收益就撤回 |

**LSP 按缺口接入，不按语言标签必装。** 日常修错先用项目已有类型检查，需要语义引用时先复用现有 IDE／LSP。Claude Code 插件不含服务器二进制，安装后还须确认实际诊断或查询；官方云会话不启动插件语言服务器，本地安装不能给该云任务补上导航。见[官方机制与采用边界](research/2026-10-13-context-tool-choice.md#源码检索map语义引用与当前状态--6-客户端接入边界)。**局限**：能力可用不等于已证明节省上下文或总耗时。

完整方法论插件的入口控制与撤回证据由 [24](24-community-workflows.md#本仓库判断强-agent-的默认基线应更轻)维护；验证回执是否可复用见 [21](21-agent-patterns.md#验证回执能复用什么)。这里不再重复推荐名单，也不把单个机制可借鉴写成整包应安装。

**依据**：[一手] [Claude Code 插件清单](https://code.claude.com/docs/en/plugins-reference)、[OpenAI 插件打包契约](https://developers.openai.com/plugins/build/plugins)、Claude Code 插件 LSP 机制；[经验] 采用判断；核实 2026-10-22。

### 安装前分清信任对象

**✅ 审查实际下载版本的指令、脚本、动态命令、Hook、连接和依赖；只启用任务需要的部分。** 在 Claude Code，命令型 Hook 和本地 MCP／LSP 等不受 Bash 工具沙箱包住；若要求整包进程隔离，按 [10](10-security.md) 选择执行环境，不能靠 Skill 的只读描述实现。历史本地插件重载修复及范围见 [S1a](research/2026-10-10-audit.md#s1a--2026-10-14-无人值守的停止与重试边界)。

OpenAI 当前打包文档另明确：安装／启用插件不自动信任其中的非托管 Hook，须审查并信任当前定义；脚本还必须存在于执行环境，网页安装不等于部署脚本。**因此需要 Hook 才成立的工作流，不能只见安装成功就投入使用。**

**依据**：[一手] [OpenAI Hook 信任与执行位置](https://developers.openai.com/plugins/build/plugins#bundled-mcp-servers-and-lifecycle-hooks)；[经验] 采用判断；核实 2026-10-22。

## 3.5 跨平台复用：保留配方，重新核对执行契约

**✅ 优先迁移 Skill 的知识与资源；🧪 带宿主执行功能的包按目标分发渠道改造，不承诺原样迁移。** OpenAI 的 Claude 插件迁移契约要求将 commands／agents 中可复用行为转成 Skills；公共目录提交须移除生命周期 Hook，依赖它们的包另走 Codex desktop 手动安装路径。LSP、outputStyles 等声明与 `userConfig` 安装提示也不能直接继承。市场审核不随包转移。

- **只是领域配方**：保留必要的 `SKILL.md`、脚本／参考资源，核对目标环境的路径与依赖，再比较实际结果。
- **必须依赖宿主事件或进程**：先核目标产品、渠道和受支持事件；没有等价执行点时，继续用原环境或已有显式脚本，不用“让模型记住执行”伪装成自动 Hook。
- **只为复用而被迫扩权或新增远程服务**：先缩减到可独立工作的部分；核心能力仍不成立，就暂缓迁移。

以上是工程选择。**关键局限**：迁移契约证明需要改造，不证明改造后的行为与原宿主等价；引擎专有 Skill 的执行能力另见[引擎接入](../domains/game-dev/01-engine-integration.md)。

**依据**：[一手] OpenAI [Claude 插件迁移契约](https://developers.openai.com/plugins/guides/submit-claude-plugin)；[经验] 迁移选择（2026-10-15 UTC+8）；核实 2026-10-15。

## 4. Skill、MCP、Subagent、Hook、CLAUDE.md 怎么选

**按缺口选工具：先原生提示和已有资料，确实缺能力才升级到 Skill、MCP、Subagent、Hook 或插件。**

| 你遇到的情况 | 加什么 |
|---|---|
| 反复遗漏、且所有相关任务都适用的项目约定 | 先排除过期或错误资料，再在 CLAUDE.md / AGENTS.md 加一条并指向权威来源 |
| 只是反复输入几条短提示 | 先复用普通提示；Codex CLI 0.164.0 可试[原生预设](01-agents/codex.md#少量重复提示先用原生预设)，不为粘贴便利创建 Skill（客户端未试用） |
| 重复任务需要仓库没有的领域配方或经过验证的资源 | **窄 Skill**；已有文档、脚本或模板可直接复用时，只加入口 |
| 总在从浏览器复制 Agent 看不到的数据 | **MCP**（或 CLI） |
| 同名符号多，需要确认语义引用，现有搜索难以消歧 | 先用现有 **IDE／LSP**；缺少时再评估插件，并核对会话支持与项目解析 |
| 某个支线任务的输出淹没了对话 | **Subagent** |
| 某个运行时事件需要机械检查 | **Hook**，并验证匹配、超时、错误处理和替代路径；不代替沙箱 |
| 多个项目需要共同分发已验证的组件组合 | 再打包成**插件**；单份资料或 Skill 不必升级为整包 |
| 想要固定的回答风格或长度 | 先用简短偏好；Claude Code 只需短回答可选内置 **Concise**，确需自定义 **Output style** 时先核下述编程指令保留条件 |

工具类别参考 Claude Code 官方文档《Extend Claude Code》；表中的选择条件是本仓库建议，尤其前两项按信息缺口与复用价值判断，不按固定出错或粘贴次数触发。

**Claude Code 的自定义 style 不只是改格式**：在完整 system prompt 下，它默认移除内建软件工程指令这一节；仍要做编程任务时，设 `keep-coding-instructions: true` 并核对当前 prompt 模式，短 system prompt 下该字段无效。内置 Concise（v2.1.237+）保留工程指令，可避免只为简短回答而改变这一部分。Style 作用于主会话及继承全历史的 conversation fork，普通子 Agent 不继承；它不替代权限控制，也不保证遵从。无需为使用 style 一律切换完整 prompt；原文与边界见[研究记录](research/2026-10-10-audit.md#s2b--2026-10-16-output-style-的编程指令边界)，核实于 2026-10-16（UTC+8），未运行客户端。

**依据**：[一手] Claude Code《Extend Claude Code》与 Output style 官方契约（2026-10-16 UTC+8）；[经验] 选择建议、采用判断；核实 2026-10-16。

## 来源

- [agentskills.io 规范](https://agentskills.io/specification)、[规范仓库 docs/skill-creation](https://github.com/agentskills/agentskills/tree/main/docs/skill-creation)
- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Code Skills 文档](https://code.claude.com/docs/en/skills)、[Extend Claude Code](https://code.claude.com/docs/en/features-overview)
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)、[anthropics/claude-code/plugins](https://github.com/anthropics/claude-code/tree/main/plugins)
- [OpenAI 插件打包](https://developers.openai.com/plugins/build/plugins)、[Claude 插件迁移契约](https://developers.openai.com/plugins/guides/submit-claude-plugin)
