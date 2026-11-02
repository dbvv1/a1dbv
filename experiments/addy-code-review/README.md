# Addy code-review-and-quality：在真实待审 PR 上验测试，而非只数意见

**🧪 本轮按 Addy 的完整审查 Skill 接收了一个此前未审的新变更：与本仓既有方法同样没有确认阻断缺陷，额外留下了一次“测试确会变红”的反证。** 这支持借用测试反证动作，不证明多找出缺陷、更快，或应替换既有评审。

## 真实任务与输入

[LLM #1231](https://github.com/simonw/llm/issues/1231) 的用户在不同模型间切换时遇到含糊的非法选项报错，不知道怎样列出该模型支持的名称。[PR #1841](https://github.com/simonw/llm/pull/1841)为 prompt、chat、保存模板、设置默认选项四处错误增加模型名、近似名称与查看命令，保留普通类型错误和模板 YAML 校验。发现时 open、非 draft，公开 reviews 为空；本轮只审查，不代上游批准或发表评论。

- 固定 base：`aebaca27f9acb6cc56ba4b33ab81e08d6dcb3bc3`；head：`ecfd202adad3e448df2ccc56a99278358df670dc`。完整差量 3 文件、57 行新增／7 行删除。
- 候选方法：[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills/tree/301b02b12bff98e4688e6984af6556802322bbde) 的 [code-review-and-quality 全文](https://github.com/addyosmani/agent-skills/blob/301b02b12bff98e4688e6984af6556802322bbde/skills/code-review-and-quality/SKILL.md)，MIT。实际顺序是需求→先读测试→五轴检查→调用者／基线核验→分级→核作者的验证说明。
- 现行方法：a1dbv [`840b177e` 的 code-reviewer](https://github.com/dbvv1/a1dbv/blob/840b177ea1bcd0841ad68f6f4000e85017b1660a/templates/generic/.claude/agents/code-reviewer.md)与 [09 的对应审查／接收章节](https://github.com/dbvv1/a1dbv/blob/840b177ea1bcd0841ad68f6f4000e85017b1660a/docs/09-review-and-quality.md)。同样要求真实需求、调用者、可运行证据，排除风格偏好与不可达怀疑。

两名新上下文各在自己的固定检出中执行，不读另一报告；负责人另用原生子进程 CLI 接收。对照的是这次尚未接收的变更，不是已完成修复的回顾。它仍只是单个 PR 的实际工作记录，不是随机化方法基准。

## 实际结果：结论相同，证据动作不同

| 可数结果 | 本仓既有方法 | Addy Skill |
|---|---|---|
| 确认新增阻断缺陷／保留待证假设 | 0／0 | 0／0 |
| 相关 pytest 用例 | 76 通过 | 89 通过，含前一列相同三文件的 76 例，另查 options-parameter 文件 13 例 |
| 附加行为检查 | base/head 共 36 次 CliRunner 调用、68 条断言 | 6 次 CLI、3 次 base/head renderer 对照、1 次 YAML 校验；共 10 项检查 |
| 测试反证 | 未做源码突变，遵守该模板只读约定 | 1 个条件突变：5 失败／4 通过；恢复后 89 例通过 |
| 修改文件 Black／Ruff、全 `mypy llm` | 通过，mypy 19 个源文件 | 通过，mypy 19 个源文件 |
| 阶段审查决定 | 通过 | Approve；建议为 chat／保存模板补永久错误文案回归，不作为已发生的产品缺陷 |

**这些数量口径不同，不能相加成任务数或拿来排质量名次。** 两路都确认真实四入口已按需求改变；Addy 没有增加确认缺陷，只额外用一个故意改错的条件验证现有测试会报警。新增建议仍是测试维护建议，不为凑“发现”强改产品。

反证改动仅发生在隔离树的 `llm/cli.py`：将新增判断的 `error["type"] == "extra_forbidden"` 临时改为 `!=`，运行 `tests/test_cli_options.py`，5 例失败。随后从备份恢复，文件 SHA256 与原 head 一致，diff／status 为空。**这只证明该突变被测试检出，不是项目级 mutation score 或每个调用点都有永久回归。**

审查同时排除了两种过度结论：整数型嵌套错误位置的 `join` 风险在 base 已有，不报成本 PR 引入；CLI 原文件已超过四千行，也不因通用大小建议强迫这个小修先重构。该 Skill 的“大文件”提示是检查信号，不是硬阈值。

## 原生 CLI 接收与重放

负责人实际启动 `python -m llm` 子进程，固定 base/head 各跑四入口×三类错误（近似名、无近似名、合法名但值非法），再执行各自的查选项命令：**26 项观察通过**。head 四处均增加模型与帮助提示，只有近似名给出建议；普通类型错误保留。保存模板与设置默认值的失败路径未落盘目标文件。完整公开输出见 [cli-results.json](cli-results.json)。

已有 LLM 开发依赖的 Python、支持 `--no-lazy-fetch` 的 Git，以及上述两个**干净固定检出**时，从本实验目录运行：

```sh
python cli_consumer.py <固定base检出> <固定head检出>
python test_cli_consumer.py <固定base检出> <固定head检出>
```

[消费者](cli_consumer.py)核实际导入路径，用临时 HOME／LLM_USER_PATH，禁用额外插件自动加载，不带继承环境中的账号凭据，不安装、不 fetch、不请求模型。参数缺失／版本不符是失败而不是跳过；[三项回归](test_cli_consumer.py)覆盖缺输入、错误版本及真实 26 项观察。使用 Git 2.52.0、Python 3.12.14、Pydantic 2.14.2、pytest 9.2.0；这不是 Ollama／Gemini 真插件、Windows 或 Python 全版本矩阵验证。

两路均未验证全量 pytest、构建、Cog 或上游 CI，作者自报“全过”未据此接收。未发现当前性能问题，故不另起 performance-optimization 题，也没有真实性能收益结论。

## 引用依赖与何时不加这一层

**本轮是手动给齐 Skill 文本与适用引用后执行，不是插件安装／自动触发试验。** 审查者完整读取 security-and-hardening、performance-optimization、constraint-driven-development 及仓库根 security／performance checklist，并按输入／错误边界读相关 hardening patterns。项目级约束建制、Web Vitals、数据库／缓存等不适用于这次 CLI 错误提示，没有把它们标成通过或安装额外工具。

单独拿走一个 `SKILL.md` 不等于引用齐备：[官方 README](https://github.com/addyosmani/agent-skills/blob/301b02b12bff98e4688e6984af6556802322bbde/README.md#quick-start)明确说明单 Skill 的 `npx` 安装只复制 `skills/<name>/`，不带仓库根 `references/`。真实使用者 [#361](https://github.com/addyosmani/agent-skills/issues/361)报告过缺参考文件；本轮该 issue 为 closed，固定 README 仍保留此提醒。本轮没有运行安装器，不能把读到提醒写成已复现或已修复。

若现有评审已覆盖需求、调用者与实际消费者，就继续原入口；没有依据认为整包、每次多路审查或强制项目级新门禁更好。需要确认测试是否真能检出错误时，这个窄 Skill 给出了明确反证动作；代价与长期收益仍待更多自然任务观察。

**来源与核实**：[一手／维护者反馈] [#736 的收窄审查与合入](https://github.com/addyosmani/agent-skills/pull/736)，要求验证调用者／guards、区分既有缺陷、接受零发现，并删去无关过程与过量评估；该 PR 也明确未做 graded model-effectiveness run。[真实用户／实现者] LLM #1231／#1841。2026-11-02 UTC 读取原文并实际运行；不改变本仓答案页读者评级，不以测试计数替代缺陷判定。
