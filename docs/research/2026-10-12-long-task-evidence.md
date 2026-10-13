主线：三
改变的建议：20：恢复最新目标、行为约束、运行事实与资源；旧绿灯和存在的文件不足以证明续接正确
新证据：官方设计、故障单例及既有机制资料迁移；此页无新的模型恢复实验，待运行矩阵仍为设计

# 长程任务：来源、反例与实验边界

> 资料整理：2026-10-12（UTC）。对应[20 · Codex 长程任务](../20-codex-long-horizon.md)，本页只保存正文省略的来源与细节。正文原有核实时间为 2026-10-11（UTC+8，检索截至 2026-10-10 UTC）；后续补充按所链接研究页的日期定位。本次阅读分层没有重新核实全部外部网页或发布状态。

## 官方来源与历史时点

下表保存直接出处；设计指南、开源文档与客户端实测分别计证据，不能互相替代。

| 来源 | 正文使用的依据 | 版本、状态与检查边界 |
|---|---|---|
| [Astra 提示与 Skills 指南](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) | 缩短常驻指令，按需读文档，避免复杂技能流程束缚模型 | 2026-09-11，面向特定模型代际；不支持删除所有脚手架的泛化判断。**[一手]** |
| [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | 项目指导入口、同层 override 优先与默认 32 KiB 总上限 | 文档机制不能证明会话中改文件后已自动重载。**[一手]** |
| [Build skills](https://learn.chatgpt.com/docs/build-skills) | `.agents/skills/<name>/SKILL.md`，元信息先加载、正文按需加载 | 可发现、触发、执行与结果正确是不同检查；没有由目录存在推断有效。**[一手]** |
| [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | 边界清楚、读多写少的任务适合拆分，主任务整合结果 | 本地 Codex 与托管 Work 的角色、配置及权限模型不能混用。**[一手]** |
| [OpenAI 长时任务实验](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex) | 持久化需求、计划和状态 | 报告的约 **25 小时**运行是特定实验，不是任意任务的时长或交付承诺。**[一手]** |
| [ExecPlans 旧文](https://developers.openai.com/cookbook/articles/codex_exec_plans) | 以文件保持可续接的计划 | 旧文已标为 **archived**；文件名是约定，不是系统保证。后续示例比较、固定源码与适用范围见 [Cookbook 复核](2026-10-11-codex-cookbook.md)。**[一手]** |
| [Goals 指南](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) | 可度量目标、验证、预算及停止原因 | 指南标注 **Codex 0.128.0 起支持**，不表示 dot 或任意 API runner 都暴露同一 `/goal`；线程续接条件与教程读取范围见 [Goals 复核](2026-10-11-codex-cookbook.md#2-goals官方设计与实际使用报告一起看)。**[一手]** |

[Codex 配置示例](../../templates/codex/README.md)是可选、未自动安装的示例；其中 Sol 6.1 / high 只是成本与能力的选择，原资料没有将其验证为任意任务的最优档位。**[经验：示例范围]**

## 社区故障与修复状态

以下保留原帖和当时状态，不把单例合并成故障率，也不从 issue 关闭推断整个故障类别已消失。阅读社区报告不等于本仓库独立复现。**[社区；研究：证据边界]**

| 原始来源 | 报告或变更内容 | 原核查中保留的反证与限制 |
|---|---|---|
| [Spec Kit #3752](https://github.com/github/spec-kit/issues/3752) | 把 **16 个场景压成 4 条故事**，导致误判完成 | 单例支持验收粒度被压缩的故障模式，不支持普遍发生率 |
| [Codex #42695](https://github.com/openai/codex/issues/42695) | 压缩后回到旧任务 | 与其他压缩失败分开观察，不能预设同一根因 |
| [Codex PR #44659](https://github.com/openai/codex/pull/44659) | 触发元信息传播修复，已合并 | 未确认首次发布版本，也没有证明修复全部“回旧任务”症状。**[一手：PR]** |
| [Codex #38969](https://github.com/openai/codex/issues/38969) | **10 月**仍有压缩失败报告 | 不同环境的根因未必相同，不能借一个旧 issue 关闭排除这类问题 |
| [Codex #40932](https://github.com/openai/codex/issues/40932) | 父任务过早结束，也有父任务仍在等待而结果投递停滞的报告 | 单加“不要提前结束”不能覆盖全部唤醒路径 |
| [Codex #38989](https://github.com/openai/codex/issues/38989) | 大量递归评审、重复测试及巨量记录 token | 记录 token 不等于实际账单，原文没有据此计算用户费用 |
| [Superpowers #1040](https://github.com/obra/superpowers/issues/1040) | 研究返回主 checkout 的绝对路径，后续写错位置 | 历史单例；工作树位置与实际写权限是不同条件 |
| [Superpowers #2050](https://github.com/obra/superpowers/issues/2050) | 子任务提交到 main | 原核查时已关闭，不能当作所有当前版本仍受影响的证据 |
| [Codex #52345](https://github.com/openai/codex/issues/52345)、[#50771](https://github.com/openai/codex/issues/50771) | 已有完成标准、知道未完成却结束；承认修正后没有行动 | 公开记录、成功控制案例、附件读取范围以及源码与部署未对应等细节统一保存在[连续性复核](2026-10-10-codex-continuity.md#c-知道目标与继续执行目标可能脱节) |

`needs_follow_up`、Stop hook 路径及后续相关修复的固定源码见[连续性复核](2026-10-10-codex-continuity.md#回合结束不等于完成用户目标)；它们说明可以在哪里观察续接，没有直接证明上述报告的部署根因。**[一手；研究：机制边界]**

## 恢复涉及哪些状态

这是原文用于区分恢复对象的状态表，属于设计分析，不是已运行的恢复实验。**[经验：设计]**

| 状态 | 例子 | 对应恢复载体或检查 |
|---|---|---|
| 用户目标与约束 | 兼容旧接口、不得发布 | 任务契约与后续变更 |
| 工作产物 | diff、生成文件、测试数据 | 文件系统、Git、制品存储 |
| 执行事实 | 测试运行、服务错误、已完成动作 | 日志、报告、外部操作回执 |
| 推理上下文 | 为什么放弃某种方案 | 有范围的交接摘要，必要时重新查证 |
| 活跃资源 | 进程、端口、浏览器、认证 | 重建与检查；旧 PID 不能证明存活 |

“记录存在但当前未加载”的实现反例见 [03 的实际运行反例](../03-context-engineering.md#43-实际运行中的反例)：激活标记不是路径规则或 Skill 正文仍在上下文中的证据。**[一手/社区：见该节来源；研究：解释]**

[SlopCodeBench 复核](2026-10-13-slopcodebench.md#4-代码留下了哪些信息没有自动留下)（2026-10-13，北京时间）保存固定 runner 依据：默认路径保留代码、重置会话、只给新规格，隐藏评分不反馈给 Agent。该页分别核查旧约束可恢复性和运行反馈可取得性，记录默认路径与实际 campaign 配置的对应缺口；据此无法直接推出日常项目必须部署记忆服务。**[一手：运行机制；研究：适用范围]**

## 工具、预算与权限：复用已有固定证据

不在本页复制完整技术审计，以下指向已维护的提交、版本、来源与读取范围。

| 主题 | 详细证据位置 | 原文需要保留的范围 |
|---|---|---|
| Codex app-server | [S4](2026-10-10-audit.md#s4--codex-app-server) | main 源码中区分关闭拒绝新工作、历史读取失败与历史耗尽；实验性 read-state 使用 `expectedRevision`，冲突后需重读。read-state 是线程已读状态，不能当作通用业务恢复数据库；最小发布版本未确认。**[一手]** |
| MCP 传输和结果 | [S5](2026-10-10-audit.md#s5--mcp-2026-07-28-规范) | **2026-07-28** 移除协议级会话和 SSE 消息重投，跨调用状态改用显式句柄；断流后重新发起请求不提供业务 exactly-once 保证。MRTR `input_required`、必需 `resultType` 及旧版缺字段兼容行为来自规范，未做客户端兼容性测试。**[一手；经验：业务含义推论]** |
| Hook 失败策略 | [S1](2026-10-10-audit.md#s1--claude-code-2129521296) 与 [06 返回值](../06-hooks-and-guardrails.md#返回值) | **2.1.295** 的 command/HTTP Hook 增加 `onFailure: "block"`；**2.1.296** 修复部分 managed hooks。Stop、SubagentStop、TaskCompleted、TeammateIdle 和 async 等有排除条件；原材料未做客户端实测，后续规则以 06 为准。**[一手]** |
| Auto Memory | [S3](2026-10-10-audit.md#s3--gemini-cli) | 源码文档标记实验性、默认关闭，patch/Skill 草稿进入 inbox 后由用户审阅；不能将 main 文档的全部功能归入某一安装版本。**[一手]** |

本仓库[独立 spec 与运行报告模板](../../templates/long-task/README.md)及[校验器](../../scripts/validate_task.py)只检查记录一致性：不执行检查、不打开证据、不证明证据真实、不阻止同时篡改 spec 与报告，也不是完整 agent harness。模板自己的“信任边界与坑”保留具体限制；其合成测试不是模型驱动恢复实验。**[经验：实现范围]**

## 待运行实验矩阵

以下是原文保留的实验设计，尚未成为真实模型或跨会话运行结果。**[经验：实验设计]**

| 实验 | 负面样例 | 判定 |
|---|---|---|
| 恢复 | 写完未测、测试失败、测试通过后又改代码、进程终止或活跃资源失效 | 不用旧绿灯宣称新版本完成 |
| 验收 | 缺 ID、只测快乐路径、零测试、skipped、输出截断 | 明确 incomplete/blocked |
| 子任务 | 仅进度、迟到、失败、结果未收集 | 必要结果未验证前不收尾 |
| 权限 | 目标变了、授权过期、外部写结果未知 | 先核对，不重放危险动作 |
| 成本 | 单 agent、分组读、逐项 reviewer | 同任务、同预算、记录质量与成本 |
| 技能 | 正例两种说法、近邻反例、旧版本配置 | 分开测发现、触发、执行、结果 |

已运行证据的类型是仓库确定性检查和模拟引擎回归，实际记录见 [19](../19-experiments.md)；表中真实模型、跨会话实验仍待执行。恢复设计还需覆盖并发文件修改、旧记忆中的失效命令；检查输出须读取完整报告并保留原退出码，不能据输出尾部猜通过。**[经验：验证范围与剩余问题]**
