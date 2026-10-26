# 从公开指导历史判断当前方向：保留 Git 原文检索

**当前选择：继续用 `git show` 固定版本、`rg` 定位当前原文，不把 Hippo 接成本仓指导检索层。** Hippo 的显式退役关系能保留旧记录、从当前召回中过滤它；但本次中文问题未按意思区分结果，替代记录的来源元数据也不能直接当新规则的引用。

读者是要给多 Agent 工作分派下一任务的协调者。增量是分清“旧条文确被替换”“当前明确纠错”与“固定材料没有依据”，不把找到新规则当成已经执行。真用是据公开指导选下一本仓试用，并让非作者独立回答当前分工；不测调度空档、模型质量、速度或 token 节省。

## 下一任务应该怎么派

- **A 做发现 → 在本仓 AI 开发里试用 → 写成选择。** 不再新开第三方应用采用；已有 Datasette #3015、Memos #6502 跟到结束。固定 TASKS 的 P90 已完成本周扫描，下一步从已有收件箱按真实消费者选试用，不重复扫描。
- **A 观察 AI 开发，B 负责游戏及其发布。** A 不验证 B 的玩法、品质，不代管 B；双方各自发布接收的成果，不互相代合。
- **受阻只停对应动作。** 保留断点和恢复条件，继续其他有授权的工作；“待领取／等回传／待验收”不算正在执行。正确检索这些规则不能证明协调者已经续派。

本次核对版本：[`b2b3f65`](https://github.com/dbvv1/a1dbv/tree/b2b3f65d64b4304640563817a9388aff87c73c6a)。依据：[手册§9](https://github.com/dbvv1/a1dbv/blob/b2b3f65d64b4304640563817a9388aff87c73c6a/docs/collaboration/LONG-TERM-PLAN.md#L114-L119)、[TASKS](https://github.com/dbvv1/a1dbv/blob/b2b3f65d64b4304640563817a9388aff87c73c6a/docs/collaboration/TASKS.md#L26-L27)、[发布](https://github.com/dbvv1/a1dbv/blob/b2b3f65d64b4304640563817a9388aff87c73c6a/docs/collaboration/operations.md#L7-L20)、[续接](https://github.com/dbvv1/a1dbv/blob/b2b3f65d64b4304640563817a9388aff87c73c6a/docs/collaboration/LONG-TERM-PLAN.md#L38-L42)、[在途](https://github.com/dbvv1/a1dbv/blob/b2b3f65d64b4304640563817a9388aff87c73c6a/docs/collaboration/prompts/dot-a.md#L26-L29)。核实：2026-10-26；不能据此判断 PR 最新状态、权限恢复或当前代理是否在跑。

## 哪些旧判断应退出

| 判断 | 公开历史能证明什么 |
|---|---|
| 第三方应用采用仍是主线 | 当前提示词明确要求删改这项旧安排，最终主引擎在 `b2587cf` 改为发现、试用、选择。本次取出的旧条文只明确允许任务来自开源项目未决需求，并未逐字写“第三方应用为主线”；不把纠错描述伪造成历史授权。 |
| B 权限未恢复，继续由 A 代发布 | 旧临时分工确实存在；`a861f02` 已删除并改为各自发布，不从旧条件句推导当前仍有效。 |
| 有动作待批准，就停整条主线 | 当前和本次固定旧提示词都明确相反。固定材料未见该规则，不等于已查完全部历史。 |

依据：[最终方向替换](https://github.com/dbvv1/a1dbv/commit/b2587cfda2757d6647e54673b3fbd8753d0527fe)、[当前纠错](https://github.com/dbvv1/a1dbv/blob/b2b3f65d64b4304640563817a9388aff87c73c6a/docs/collaboration/prompts/dot-a.md#L40)、[旧采用与续接条文](https://github.com/dbvv1/a1dbv/blob/f48f31f8526197f987ec4b6911fefdc7d7dc4ac5/docs/collaboration/prompts/dot-a.md#L9-L19)、[旧临时发布](https://github.com/dbvv1/a1dbv/blob/f48f31f8526197f987ec4b6911fefdc7d7dc4ac5/docs/collaboration/operations.md#L25)、[发布规则替换](https://github.com/dbvv1/a1dbv/commit/a861f02fe3cae6e0009df16b946ea7c04dc9c94e)。核实：2026-10-26。

## Hippo 实际多了什么，又少了什么

在隔离目录中编译官方固定源码 `4d078af84d0eb8f48f2994f32068696db8d20665`，直接调用其存取组件，不走 CLI `init`、全局安装或宿主集成。输入是 12 段逐字公开 Git 原文：3 段历史、3 段替代正文、6 段当前上下文；由操作者先看 Git diff，再给出旧 ID 与替代正文。

| 实际动作 | 观察与选择意义 |
|---|---|
| `supersede` 三条历史记录 | 旧行仍可按 ID 读到，当前召回候选不再含旧行；再次替换同一旧 ID 报 `ConflictError`。新增的是显式退役链，不是自动识别哪条指导更新了。 |
| BM25 查询“主引擎”“A 代 B 发布”“等待批准”“第三方应用” | 四个问题的 tokenizer 输出均为 `[]`，都返回同一组前五条；替代后的主引擎和发布原段不在其中。不是中文内容不能保存，而是这些问句失去词项后退回默认候选顺序。 |
| 查询“dot-A 主引擎” | 只剩词项 `dot`，也未取出替代后的主引擎段。不能把“旧记录消失”当作“正确的新规则已找到”。 |
| 用替代记录元数据回源 | 新行沿用旧 `source` URL，`artifact_ref` 变为 `null`。正文里由操作者附带的新 Git URL 仍正确；仅用元数据无法引用新规则，仍须回原文件核对。 |
| 原生 `rg` 查询当前指导 | “主引擎”“各自发布\|代合”“等待\|受阻”“第三方应用”直接定位到相应当前条文，并保留文件与行号；不需另维护记忆副本。 |

这不是检索准确率或自动更新对照：前态仅有历史主题记录及其他当前上下文，后态由人输入三个替代版本。没有自动发现、完整宿主接入、跨会话效果或执行效率的成绩。

源码依据：[显式替换](https://github.com/kitfunso/hippo-memory/blob/4d078af84d0eb8f48f2994f32068696db8d20665/src/api/memories/promote.ts#L59-L84)、[继承来源](https://github.com/kitfunso/hippo-memory/blob/4d078af84d0eb8f48f2994f32068696db8d20665/src/core/memory.ts#L529-L550)、[tokenizer](https://github.com/kitfunso/hippo-memory/blob/4d078af84d0eb8f48f2994f32068696db8d20665/src/util/tokenize.ts#L1-L7)、[空词项与候选顺序](https://github.com/kitfunso/hippo-memory/blob/4d078af84d0eb8f48f2994f32068696db8d20665/src/store/search-rows.ts#L101-L157)。[外部 #346](https://github.com/kitfunso/hippo-memory/issues/346)只是测试提议，不是完成的效果证据。核实与组件实跑：2026-10-26。

### 运行范围

- Node `24.22.1`、工作区已有 TypeScript `5.9.3`、Node types `22.20.5`；固定源码的主 `tsc` 编译通过，实际 `remember → retrieve → supersede → retrieve → readEntry` 跑通。未跑完整构建、测试、UI 或包公开 SDK/CLI 兼容验收。
- `npm ci --ignore-scripts` 因 registry DNS `EAI_AGAIN` 后失败，未声称安装成功；改用已有编译器。此前 TypeScript `6.0.3` 未显式加载 Node types 的编译失败，未用它作为最终构建。
- 自加 Node 读写权限只允许本次目录。首次建库的项目身份探测尝试向父目录找 `.git`，被护栏阻止；依据源码的临时目录停止条件，设置本次目录为 `TMPDIR` 后在同一护栏内跑通，未扩大权限。
- `HOME`、`HIPPO_HOME` 均为隔离目录；未读私人记忆，未接账号，未改 hooks/settings，未执行 sleep 或自动导入。所覆盖的 JavaScript 网络入口 guard 计数为零，不外推全产品零网络保证。

**何时再考虑**：真实工作需要跨工具保留大量历史决定，且能明确维护替代关系时，再比较完整任务。当前几份 Git 指导已直接给答案，增加第二份可过期事实库没有收益；先解决读到之后的实际分派与接收。
