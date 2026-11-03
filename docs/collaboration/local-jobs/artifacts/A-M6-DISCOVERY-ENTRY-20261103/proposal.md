# A-M6-DISCOVERY-ENTRY-20261103 · 单元 1 提案

**结论：25／12 缺的是“有无具体决定”的入口分流，不是定向检索本身；保留短任务读原文即停，只补一条广扫入口和现成 Skill 的准确链接。** 最小改动是 25 首屏、§1、§2 过渡句、§5，以及 12 首表一行；不新增探索框架、固定配额、研究产品或通用模板，也不改写 Skill 内容。

以下代码块里的链接按目标正文落点书写：放入 `docs/25-ai-exploration.md` 或 `docs/12-resources.md` 后可解析；在本 artifact 文件中直接点击不会解析。固定输入的提交内链接见 §2。

## 1. 最小替换稿

### 1.1 docs/25-ai-exploration.md 首屏

**替换原 L7：**

```markdown
**有具体决定或可定位的 API、版本或许可问题时，先写清决定或直接读原文，用已有 Agent 定向找当前强方案并把选中的机制交成编码任务，原文足够即停；没有具体决定且没有可定位问题时，给领域和已有材料，按 [explore-frontier](../templates/generic/.claude/skills/explore-frontier/SKILL.md) 的广扫入口收集候选，候选形成决定后再走本页六步。** 定向检索处理不了跨来源依赖或广覆盖比较时，再加一个现成 Research 产品；最终要让接手者知道采用／改造／自建／放弃什么，以及怎样实施和验收。
```

**替换首表第一行（原 L11）：**

```markdown
| ✅ 有具体决定或可定位的 API／版本、许可问题：需求卡／读原文 → 搜索与比较 → 条件决定 → 生成交接 | 定向默认路线；已有同任务材料足够就复用，补版本与事实缺口 |
```

**在原 L16 说明段之后、原 L18“来源”行之前新增一段（不得进入首表，不得改写原 L16）：**

```markdown
**没有具体决定且没有可定位问题时不用先编一个。** 给出领域和已有材料，按 [explore-frontier](../templates/generic/.claude/skills/explore-frontier/SKILL.md) 的广扫入口按来源类别收集候选；重要候选及时转定向核实或试用，阶段交付保留未覆盖项，不把阶段候选称为完整覆盖。候选自然形成具体决定后，再走本页六步；仍用现有工具和入口，不另建探索框架、固定配额或研究产品。
```

原 L16“本页流程与评级是经验设计判断，方法收益尚待验证；三题合成工程需求的限时对照没有发现显式渠道扩展带来采用增量”原样保留，不改写、不升级为“广扫已有效”。

### 1.2 docs/25-ai-exploration.md §1

**替换原 L22：**

```markdown
**先分清有没有具体决定，再选入口并复用已有工具。** 有明确决定或可定位的 API、版本或许可问题，读原文或定向检索，答案足够即停；不知道漏了什么时，给领域与已有材料，按 [explore-frontier](../templates/generic/.claude/skills/explore-frontier/SKILL.md) 的广扫入口发现候选，重要候选再转定向核实与试用。需要跨渠道比较约束与反例时，再升级研究方式。
```

**在 §1 表中“一个可定位的 API、版本或许可问题”一行之后新增一行：**

```markdown
| 不知道漏了什么、要发现新做法 | 给领域与已有材料，按 [explore-frontier](../templates/generic/.claude/skills/explore-frontier/SKILL.md) 的广扫入口 | 重要候选转定向核实或试用；阶段交付保留未覆盖项，剩余来源继续补，不把阶段成果称完整覆盖 |
```

不把 Skill 的“饱和”作为每个小查询的扩渠道要求；饱和只用于判断领域广扫是否完成。

### 1.3 docs/25-ai-exploration.md §2 过渡句

**在原 L38 段末追加一句，六步正文不动：**

```markdown
**六步适用于已经形成的具体决定；没有具体决定、只想发现漏项时，先按 explore-frontier 的广扫入口收集候选，候选形成决定后再进入六步。**
```

### 1.4 docs/25-ai-exploration.md §5

**替换原 L202：**

```markdown
**先用短提示词，同类缺口反复出现且现有指令覆盖不足时，再封装窄 Skill。** 本页方法的真实效果比较仍在设计阶段（预注册见第六步）；仓内已有可复用的 [explore-frontier](../templates/generic/.claude/skills/explore-frontier/SKILL.md) 模板，负责证据到决定的薄层，搜索、调度和产品 API 复用现有入口。模板存在不等于已安装、会被自动调用或收益已验证。
```

**替换原 L206 表格行：**

```markdown
| 探索 Skill | 外部证据决定选择，或没有具体决定时的领域发现；输入需求卡与已有资料，或领域与已有材料；两者均含允许工具、预算 | 有决定时六步补缺并交付五项；无决定时先交候选与未覆盖项，形成决定后再转六步；已有答案足够即退出；安装、付费、实测按任务授权另办 |
```

**替换原 L211：**

```markdown
本仓内容项目可使用[探索自用提示词](collaboration/prompts/2026-10-21-exploration-self-use.md)，研究前固定输入；简单查询直接改写下面的短契约。要复用本页的发现入口，读 [explore-frontier 模板](../templates/generic/.claude/skills/explore-frontier/SKILL.md)：它当前设 `disable-model-invocation: true`，需显式调用；复制文件不代表已安装或已加载，其他宿主先核 Skill 发现路径与权限语义，实际收益仍按第六步验证。
```

**在原 L221 依据行之后新增一句标注（不改原依据行与页首核实日期）：**

```markdown
本次入口核对（2026-11-03）依据本页正文、[12 资源索引](12-resources.md) 首表、[explore-frontier 模板](../templates/generic/.claude/skills/explore-frontier/SKILL.md) 与 `templates/README.md` 现有摘要；新增的入口分流与 Skill 链接属经验判断，未运行新的广扫、模型调用或效果比较，不改变上文三题对照的阴性结果和页首核实日期。
```

### 1.5 docs/12-resources.md 首表

**替换原 L11：**

```markdown
| 答案不在代码库里，要找现成方案或设计参照 | [25 AI 探索](25-ai-exploration.md) | 有具体决定或可定位的 API／版本问题：先用已有 Agent 定向检索，核官方文档、固定源码或原作品，原文足够即停；不知道漏了什么：给领域与已有材料，按 [explore-frontier](../templates/generic/.claude/skills/explore-frontier/SKILL.md) 的广扫入口发现候选，重要候选再转定向核实；资料分散才考虑已有权限的 Research 产品，候选或维护证据有缺口才扩渠道 |
```

### 1.6 templates/README.md 同步提示（本卡不拟稿、不写入）

`templates/README.md` L57 的树状注释仍写“先写决定，去最强做法所在处找”，与 Skill L12–16 的“定向／广扫”分流不一致，且没有提到无具体决定时的广扫。这里只列同步提示：负责人同步该摘要时需让它与 Skill 的分流一致；本卡不提供该文件替换稿，也不写入。L72“本仓 M6 探索方法的可复用版，两个 dot 与其他会话共用”描述的是共享模板资产，不等于已安装、会被自动调用或收益已验证。

## 2. 原句→现成资产依据→保留与修正范围

固定输入（`base_ref` 6aafeae9 与 `origin/main` 的四个 blob 相同）：

- [docs/25-ai-exploration.md](https://github.com/dbvv1/a1dbv/blob/6aafeae958f4e839051866fae1c52c8aabfa2c89/docs/25-ai-exploration.md)
- [docs/12-resources.md](https://github.com/dbvv1/a1dbv/blob/6aafeae958f4e839051866fae1c52c8aabfa2c89/docs/12-resources.md)
- [templates/generic/.claude/skills/explore-frontier/SKILL.md](https://github.com/dbvv1/a1dbv/blob/6aafeae958f4e839051866fae1c52c8aabfa2c89/templates/generic/.claude/skills/explore-frontier/SKILL.md)
- [templates/README.md](https://github.com/dbvv1/a1dbv/blob/6aafeae958f4e839051866fae1c52c8aabfa2c89/templates/README.md)

| 位置 | 原句（定位） | 现成资产依据 | 类型 | 保留／修正范围 |
|---|---|---|---|---|
| 25 L7 | “先写要做的决定，用已有 Agent 找当前强方案……”把写决定写成所有任务的起点 | Skill L12–16：定向是有具体决定；广扫是没有具体决定，“不先编一个决定再去找” | 经验建议（页首 L16 自述流程与评级为经验设计判断） | 改为两条入口；定向措辞、Research 升级条件和交接目标保留 |
| 25 L11 | 首表“✅ 需求卡 → 搜索与比较 → 条件决定 → 生成交接”／“默认路线” | 同上 | 经验建议 | 定向分支补“有具体决定或可定位的 API／版本、许可问题”限定，评级与行数不变 |
| 25 L22 | “按问题需要的研究深度选入口” | Skill L12–16 的第一分流是“有无具体决定”，不是研究深度 | 经验建议 | 改为先分有无决定；可定位问题的原文路线原样保留，不判为错误 |
| 25 §1 表 | 只有可定位 API、跨渠道比较等行，没有“不知道漏了什么” | Skill L18–33 的广扫来源类别、线索追踪与覆盖表 | 经验建议／入口缺行 | 新增一行；不引入固定配额，不要求每个小查询扩渠道 |
| 25 L38 | “六步依次解决……”，第一步从需求卡起 | Skill L14：广扫“不先编一个决定再去找”（L12–16 为定向／广扫分流） | 经验建议 | §2 首段后加一句过渡，限定六步从已形成的决定开始；六步正文、来源名册和历史研究不重写 |
| 25 L202 | “当前为设计阶段” | 仓内已有 `explore-frontier` 模板（front matter 的 name／description）；`LONG-TERM-PLAN.md` §3、`prompts/dot-a.md`、`TASKS.md` P90 已引用该入口 | 事实陈述（部分过时） | 区分“方法效果比较仍在设计阶段”与“已有可复用模板”；保留收益待验，不把模板存在写成收益证据 |
| 25 L206 | 触发为“外部证据决定选择”，输入为“需求卡、已有资料、允许工具、预算” | Skill L12–16 的广扫入口与领域输入 | 事实陈述／设计表缺项 | 补无决定时的领域输入、候选输出与转六步条件；已有资料、允许工具与预算原样保留 |
| 25 L211 | 只链接探索自用提示词，未链接现成 Skill | Skill front matter `disable-model-invocation: true`；`templates/generic/CLAUDE.md`“复制文件不代表已安装或已加载” | 事实陈述／入口缺失 | 补准确相对链接、显式调用约束和宿主适配条件；不改 Skill 正文 |
| 12 L11 | “先用已有 Agent 定向检索……资料分散才考虑……Research 产品”只给定向路线 | Skill L12–16；`LONG-TERM-PLAN.md` §3 已写“有具体决定时定向找，没有时广扫” | 经验建议／索引缺项 | 同一单元格补两条入口，原有 Research 产品升级条件保留 |
| 25 L16、L158 | “方法收益尚待验证”；三题合成工程需求的限时对照没有发现显式渠道扩展带来采用增量 | 本页历史校准记录 | 历史方法效果 | 原样保留；该阴性结果针对显式渠道扩展，不能拿来否定或追认广扫收益 |
| templates/README L57 | “先写决定，去最强做法所在处找” | Skill L12–16 | 事实摘要过时 | 只列同步提示，不在本卡拟稿或写入 |

**为什么现在改：** 2026-10-29 的 `ce391d28`（“Make exploration wide by default…”）把 Skill 改成定向／广扫分流，并同步了 `LONG-TERM-PLAN.md`、`operations.md` 与 `prompts/dot-a.md`，但 25／12 的正文未同步；`LONG-TERM-PLAN.md` §3 与 `README.md` L34 已经使用正确入口。本次是把读者页对齐现有规则和现成 Skill，不是新增方法或重新开展探索。

## 3. 两条入口与读者问答

| 读者问题 | 候选中的位置 | 预期动作 |
|---|---|---|
| 没有具体决定，怎样开始？是否必须编一个决定？ | 25 首屏新增段、§1 替换句与新行、12 L11 新单元格 | 不用编；给领域与已有材料，按广扫入口收候选，阶段保留未覆盖项，候选形成决定后再走六步 |
| 查一个已定位的 API，是否被要求先广扫？ | 25 §1 替换句、§1 第一行、12 L11 新单元格 | 不被迫广扫；读原文或定向检索，答案足够即停；短任务仍走最小路线 |
| 模板已存在，是否表示方法效果已验证或可自动调用？ | 25 §5 L202／L211、`templates/generic/CLAUDE.md` | 不表示；模板存在≠已安装≠已加载≠会被自动调用≠收益已验证。该模板需显式调用，其他宿主先核发现路径与权限语义 |

## 4. 去重与写者核对

- 领取时 `origin/main` 已推进到 `2292eba1`（本卡 claim），任务文件为 `running`，尚无“当前结果”或本卡 artifact；本次从固定输入起草，未复用未知写者结果。
- `git log --all --not origin/main` 对 25／12／Skill 无未合入提交；`templates/README.md` 有未合入的 `47d969cb`（`origin/relay/a-skill-template-reader-20261029`），本卡不写入该文件，只列同步提示。
- `A-STYLE-REWRITE-002` 的卡片声明仅改写法、不改知识；实际核对 refs，`origin/relay/a-style-rewrite-002` 已是 `origin/main` 的祖先，25 的改写提交 `b999102d`（“docs: rewrite 25 exploration page recommendation-first”）已在 main 历史中，其后经 `5306e8f0`／`852daeda` 继续修订。本卡不重复其写法工作。
- A-TEAM-POLICY-DELIVERY、A-API-CREDIT-ROUTING、A-MCP-READING-ROUTE、A-PRODUCT-AUTH-BOUNDARY 四项在途卡的写域均为各自 artifact 文件，与本卡无写入重叠；不重做其结论。
- `A-FRONTIER-SOURCE-COLLECTION-20261027` 与 `A-FRONTIER-WIDE-SCAN-20261027` 是来源采集／广扫产物，不处理本入口分流；本卡只报告归属，不新做已排或已取消探索。
- 本单元未运行广扫、模型调用、探索产品、下载或安装；未访问账号、凭据或外部写入。

## 5. 检查

| 检查 | 结果 |
|---|---|
| `python3 scripts/check_repo.py` | exit 0；738 files；0 errors。只新增本 artifact，固定正文未改 |
| `python3 scripts/check_public.py` | exit 0；1204 files；0 findings。artifact 只含仓库相对路径与公开提交链接 |
| `git diff --check` | exit 0；本文件 UTF-8、LF、无 BOM、无行尾空白 |
| 身份检查 | 本单元不提交；工作树身份不是公开安全的 noreply，未用于提交 |

## 6. 未完成与边界

- 本文件只是正文候选，未改 `docs/25-ai-exploration.md`、`docs/12-resources.md`、`templates/README.md`、Skill、研究页、TASKS 或配置；采用由负责人核写者与差量。通过只表示候选可供负责人接收，不升级地图实做状态或整卡探索完成度。
- 没有新增真实发现、工具采用、原生客户端调用或模型实验；不把本轮的入口审查写成广扫成功、Skill 已被自动调用或收益已证。
- 非作者只读复核应由接收端 Workflow 的审查阶段完成；本单元不替代读者实测。
- 稿内链接按采用后的正文位置书写；若负责人改变目标段落的层级，需按新落点复核相对链接。
