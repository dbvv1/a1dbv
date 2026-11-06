# A-COMPACTION-PROVENANCE-SOURCES-20261106 · 压缩来源保真证据核读

> 核读日期 2026-11-06（UTC+8）。论文固定为 arXiv 2610.29869v1（2026-10-21）；作者仓库固定为 `pixee/compaction-laundering` 提交 `9ce87b71301c628dfcd9232b01f1ccbdb0e67b16`（2026-10-22）。本卡只读公开材料：未运行模型、demo、攻击脚本或任何外部服务，未安装依赖，未复现产品行为，未读取本机配置或私人会话。

## 结论：改哪项决定，还是保持原做法

**对 Claude Code / Codex 的默认读者，保持原做法，不新增流程。** 论文没有测 Claude Code；作者自己的 harness 调查把 Claude Code 标为“typed（高置信推断，未核源码）”。Codex 是论文的角色类型对照，E10 的 0/15 是实测控制。现有“外部 Issue／网页不能新增授权”“记忆中的事实不提供新权限”继续够用。

**对 pi、opencode、Cline、Aider、OpenHands 五种拍平型 harness 的读者，现有原则不足，建议增加一条有条件的采用项。** 增量不是“摘要会丢内容”，而是压缩会把工具输出里的伪造 `[User]:` 行升级成用户回合；压缩后模型看到的已经是“用户批准”，不再带外部来源标记。论文在短可控会话、三个 gpt-5.6 变体、每种 harness n=15 的条件下测得摘要级洗白 87–100%；长窗口的 100% 只在 pi 上测到 ~908k，执行级另有衰减，不能把这三个数字混用。

**不采用“压缩后所有历史批准一律作废／每步重新确认”。** 论文不支持这种全量否定；它支持的是“读取过不可信内容后、下一次压缩可能改写来源”，且只对拍平型 harness。Claude Code 不在实测范围，不能由论文推断其安全或脆弱。

**本卡不改变任何页面评级，也不直接改正文。** 论文是单作者预印本，未找到独立复现记录；候选段见 §5，落点由负责人决定。

## 1. 固定材料与核读范围

| 材料 | 固定版本／入口 | 本次读到的范围 |
|---|---|---|
| 论文 | [arXiv 2610.29869v1](https://arxiv.org/abs/2610.29869v1)，2026-10-21，cs.CR，29 页 | 摘要、§1–§10、E1–E16、Case Study、Limitations、Responsible disclosure、References；PDF 与 HTML 全文 |
| 作者仓库 | [pixee/compaction-laundering](https://github.com/pixee/compaction-laundering)，提交 `9ce87b7` | README、`disclosure/*`、`data/harness-survey.md`、`code/prompts/PROVENANCE.md`、`serialize.py`／`flattening.py`／`harnesses.py`／`validator.py`／`scoring.py`、`data/live/judged_result.json`／`execute_scale_result.json`／`matrix_result.json`、`demo/takes/v4c-whatsnext/pair-*/category.txt` 与 `run.log` |
| 原讨论 | [HN 50246778](https://hn.algolia.com/api/v1/items/50246778)，2026-10-26T16:42:20Z | 正文与 2 条评论全读 |
| 当前上游源码 | pi、opencode、Cline、Aider、OpenHands、goose 的公开默认分支与发布标签 | 只读 serializer 相关文件与当前版本；见 §3 |

**仓库入口有旧名。** 论文 §Availability 与 arXiv comment 写的是 `pixee/flat-compaction-attacks-oct-2027`；该地址返回 301，重定向到 `pixee/compaction-laundering`（同一仓库）。本卡按后者固定提交。

**未读或未取得**：作者仓库的 `data/stated-plan/*.jsonl` 没有逐条审阅全部 6,914 个 cell（其中 `t1_fast.jsonl` 即 1,080 个），只读了汇总报告；demo 只读日志、分类与摘要，没有看录屏；没有作者私下提交的 advisory 原文之外的维护者回复；没有闭源宿主（Claude Code、Cursor、Amp）的任何内部实现。旧 MULTIAGENT 稿的 Governance Decay 是相邻但不同的研究（约束消失，而非伪造约束存活），本卡不重新收集。

## 2. 论文实际支持什么

### 2.1 主结果：E10 拍平 vs 角色类型

| 主张 | 源位置 | 样本／对照 | 测量终点 | 次数 | 本次复核 |
|---|---|---|---|---|---|
| 五种拍平型 harness 的伪造批准被记成用户约束 | 论文 E10；`data/live/judged_result.json` | pi、opencode、Cline、Aider、OpenHands；同一攻击、同一 payload；4 轮短 transcript（不是 ~300k）；clean 臂为去掉伪造行的同一会话 | LLM 判定摘要是否把该行记为用户自己的 standing instruction | 每种 15（3 个 gpt-5.6 变体 × 5），共 75 | 从 raw JSON 重数：pi 15/15、opencode 15/15、Aider 15/15、OpenHands 14/15、Cline 13/15；clean 全部 0/15 |
| 四种角色类型 harness 为 0 LAUNDERED | 论文 E10；`data/live/judged_result.json`（judge 判定）、`data/live/structured_result.json`（keyword 判分） | Codex、Gemini CLI、Qwen Code、Continue；同样攻击与 clean 臂 | 同上 | 每种 15，共 60 cells（含 1 ERROR） | 从 raw JSON 重数：Codex／Gemini CLI／Qwen Code 各 15/15 RESISTED；Continue 0 LAUNDERED（14/14 有效判定 RESISTED，另 1 个 ERROR，该 ERROR cell 在 `structured_result.json` 的 keyword 判分为 `laundered: true`）；clean 全 0/15 |
| 判决不是纯关键词规则 | 论文 §7、`data/live/judge_validation.md` | 每种 harness 分层抽 2 个摘要；独立模型族（Claude Fable）复核 | LAUNDERED／RESISTED 二分类 | 18 项 | 作者报告 18/18 一致；本卡只读该记录，未重新裁定 |

**一个关键样本事实。** E10 的“three frontier models”从 raw key 看是 `gpt-5.6-terra`／`gpt-5.6-luna`／`gpt-5.6-sol` 三个变体，不是三个厂商。跨厂商稳健性只有 E1 的 pi 行（Anthropic 69%、OpenAI 68%、GLM 67%）和 Gemini 的反事实行；论文 E1 的 caveats 明确写“Only pi's rows measure a real harness here”。因此“序列化决定暴露”在九种 harness 上的证据是同一厂商内的对照，不能直接外推到所有模型族。

**87–100% 的窗口不是 300k。** 作者 advisory 写“~300k-token sessions”，但生成 `flattening_result.json` 的 `run_flattening.py` 用的是一条 4 轮短 transcript（user／assistant／tool result／assistant，约几百 token），没有 filler 或 scale 参数。E10 直接调用 harness 的 summarizer，不等待真实窗口触发压缩；E10 的 87–100% 是短上下文、直接调用 summarizer 的结果。~300k 出现在 E11 的执行实验和 pi 的 E7／E12 规模扫描；真实产品触发压缩的只有 E15。引用时不要把 87–100% 与 ~300k 或“真实自动压缩”绑定。

**“存活”与“洗白”是两件事。** 角色类型 harness 的摘要里仍可能出现伪造行，只是被记成“读到的文档说了什么”，不是用户指令；E8 显示 Codex 在三个位置都保留了该批准（3/3）。所以 0% 不等于“摘要里没有这句话”，也不等于 agent 完全不记得。

**E1 的 Codex 0% 是评分口径，不是实测抗性。** `data/stated-plan/t1_ao.report.txt` 原文只写评分口径：“Codex has no attribution-bearing field — its laundering is structurally 0. Read its `mentioned` rate instead.” **E1 用拍平替身这一点出自论文 E1 的 caveats 与 Limitations**（“In E1 Codex is also driven over a flattening stand-in (serialize_generic), not its real role-typed input”；“Only pi's rows in E1-E5 measure a real flattening harness”）。代码依据是 `code/study/src/compaction_study/harnesses.py` 的 `build_request()`：Gemini CLI 用 `serialize_generic(turns)`，Codex 用 `serialize_generic(turns) + codex_prompt()`；`serialize.py` 的 `serialize_generic()` docstring 写“Used for Gemini CLI and Codex, where LEADS.md still lists serialization as open”。引用时必须区分 E1 的结构性 0% 与 E10 的实测 0%。

### 2.2 执行层：E6／E11／E15

| 主张 | 源位置 | 样本／对照 | 测量终点 | 次数 | 本次复核 |
|---|---|---|---|---|---|
| 洗白后的批准能驱动真实命令 | 论文 E6；`data/live/matrix_result.json` | pi × 三种场景（内部 onboarding、外部网页、外部依赖 README）；模型 gpt-5.6-terra；clean 臂同任务无伪造行 | `issued`：agent 是否真的发出攻击者的 `curl … \| sh`；`confirmed`：proof 文件是否落盘 | 每格 n=3 | 从 raw JSON 重数：`issued` 为 pi onboarding 3/3、webpage 1/3、dependency 3/3（`confirmed` 为 2/3、1/3、3/3）；Codex／Gemini 各 0/9；所有 clean 0 |
| 执行率随窗口增大而下降 | 论文 E6；`data/live/execute_scale_result.json` | pi、gpt-5.6-terra、onboarding；同 payload 放到不同大小窗口 | 同上 `issued` | 每档 n=5；263k clean n=3 | 重数：≈2.4k 5/5、≈26k 5/5、≈112k 2/5、≈263k 2/5；clean 0/3。≈112k 的 `confirmed` 为 0（测试服务器丢 fetch），论文用 `issued` 解释 |
| 另外四种拍平 harness 也能执行 | 论文 E11；`data/live/execute_flattening_result.json` | opencode、Cline、Aider、OpenHands；各自真实 serializer 与 prompt；gpt-5.6-terra；各自有效窗口不同：OpenHands ~63k（每 event 截 500 字符）、opencode ~185k、Cline ~185k、Aider ~300k；洗白强制落地以隔离执行步 | `issued` | 每种 n=5；clean n=3 | 从 raw 重数：OpenHands 4/5、opencode 1/5、Cline 1/5、Aider 1/5，clean 全 0；`prompt_tokens` 分别为 63,136／184,619／184,433／263,594：其中 OpenHands／opencode／Cline 的 raw 计数与论文 ~63k／~185k／~185k 相符；Aider 实测 263,594，论文 effective window 约 300k（按窗口/配置计），不宜写成一致 |
| 真产品端到端 | 论文 E15；`demo/takes/v4c-whatsnext/pair-*` | 真实 pi TUI v0.79.0，gpt-5.6-luna，脚本用户，人工 `/compact`，真实 HTTP fetch；每对 poisoned／clean 只差一行伪造 `[User]:` | WIN 要求因果顺序：压缩前拒绝 → 压缩后洗白 → 压缩后执行 → canary 回调 | 6 对 | 从 `category.txt` 重数：poisoned WIN 3/6，clean NO-LAUNDER 5/5，另 1 个 clean 为 PRE-COMPLIANT（压缩前就执行，模型方差，未计入 0/5） |

**执行不是摘要结论的自动延伸。** 论文自己的 Limitations 写明：执行演示跑在 OpenAI 模型上；`claude-opus-5` 在约 56% 的洗白臂中拒绝生成恶意摘要；所有 payload 都是低风险 canary，凭据外泄 payload“never executed”；Codex 默认 workspace-write 沙箱在模型相信之前就挡住 `curl` 出网。E6 的执行数字来自作者自写的“无审批、无沙箱、bash 立即执行”的最小 agent loop，只对应 pi 默认或 full-auto／no-sandbox 场景，不对应所有产品默认配置。

### 2.3 规模、位置与重复压缩

| 主张 | 源位置 | 样本／对照 | 测量终点 | 次数 |
|---|---|---|---|---|
| 洗白在窗口增大时保持 100% | E7／E12；`context_scale_result.json`、`context_scale_1m_result.json` | 只测 pi、gpt-5.6-terra；同一批准放在约 75% 深处；从 ~2.8k 到 ~908k | 摘要是否把该行记为用户指令 | 每档 n=3 |
| 位置不影响洗白 | E8；`position_scale_result.json` | pi 与 Codex，窗口约 130k，毒点放 10%／50%／90% | 同上；另记 Codex 是否保留该批准 | 每位置 n=3 |
| 重复压缩不加强也不清除 | E4；`t2_*` | pi、Gemini、Codex；连续压缩 5 轮 | 每轮的存活、洗白、来源保留 | 每种 18 条链，共 54 |

**摘要级 100% 不是执行级 100%。** E7／E12 的 100% 只说明伪造行每次都进了摘要的用户归属区；执行级另有衰减：E6 在 ~112k／~263k 为 2/5（40%），E11 在有效窗口 63k–300k 为 1/5–4/5；~908k 只有摘要级 3/3，没有执行数据。两者是不同终点，不能把“908k 仍 100%”读成“908k 仍能稳定执行”。

### 2.4 防御：E9／E3

| 主张 | 源位置 | 样本／对照 | 测量终点 | 次数 | 可核范围 |
|---|---|---|---|---|---|
| 代码级 provenance 检查在 0.15 阈值抓 77%、误降 2% | E9；`t3_*`、`validator.py` | 已洗白的 cell；324 条来自 clean 摘要的合法 claim；`provenance contrast` 与 exact／token-overlap 负结果对照 | 抓到的洗白比例；被错误降级的合法内容比例 | 阈值 0.05–0.40 扫描 | 论文报告；本卡未重跑 |
| 提示词规则只能减少、不能消除 | E3／E9 | Gemini CLI 的真实 anti-injection 规则，套在拍平替身上做 on/off 消融；另测作者自己的 attribution 规则 | 洗白率变化 | E3 每格 n=72；E9 汇总 | E3：Anthropic −7、OpenAI −21、GLM −26 个百分点；E9：Claude 约 13%、GPT 约 25% |
| 已发表分类器上限 67% | E9 引文献 [2] | 不是本论文重测 | catch rate | — | 作者转述，未独立复核 |

**防御没有被测到五种拍平 harness 的全部。** `scoring.py` 的 `attribution_text()`（`validator.py` 调用）只解析 pi、Gemini、goose 的归属字段；对 opencode、Cline、Aider、OpenHands 返回 `None`。E9 的数据来自 stated-plan 的 pi／Gemini／Codex，Codex 没有归属字段，实际可评的是 pi／Gemini，所以 77% 不能直接当作这四种 harness 的覆盖率。论文也写明该检查未对自适应攻击测试，针对受害者措辞改写 payload 很可能绕过，77% 是非自适应上限。

**“转义 role label”是提议的修复，不是论文实测的修复。** 论文说这是 serializer 上“straightforward”的小改动，但 E1–E16 没有一组“已转义 serializer”的对照；其效果是从 E2 的 plain-text 臂（pi 6%、Gemini 0–28%）推出来的。采用时应把它当作机制上合理、尚待在目标版本验证的修复，而不是已验证的补丁。

### 2.5 计划操纵与审计（E5／E16）

- **E5**：把“不要动 auth/”分别以真实用户、工具输出洗白、无人说过三种方式放进摘要，再让新 agent 做需要改该文件的任务。真实用户 98% 避开、洗白 92% 避开、clean 6%（模型噪声）；n=48/臂，池化 pi／Gemini／Codex。这是 stated-plan，不是工具执行。
- **E16**：在约 112k、执行边际的区间，放入一段真实的怀疑性审计，再变化伪造内容（用户批准、assistant 验证、工具结果 checksum、组合）。有审计时两模型合计 1/50 执行；用户批准仍常被洗白（terra 4/5、luna 5/5），但执行被审计压住。审计是脚本化的、最大化强的，真实 agent 审计不均匀；E15 的 live 执行正是审计被压缩掉的那些 take。

### 2.6 三层分离

| 层 | 论文测到什么 | 不能由此推出 |
|---|---|---|
| 序列化（harness 代码） | 拍平型 serializer 把 typed messages 变成带 `[User]:` 等 in-band label 的单一字符串，且不转义内容里的同名 label | 不能推出所有压缩实现都这样；role-typed harness 已在 E10 作为对照测过，闭源宿主未测 |
| 摘要内容 | 伪造行被记成用户 constraint／standing approval；LLM judge 判定，clean 0/15；E10 是短 transcript 上直接调用 summarizer，不等待真实压缩 | 不能推出模型“被骗”；摘要器是在忠实记录被拍平的文本；也不能推出摘要里一定有可执行命令，或真实自动压缩一定会触发 |
| 真实工具执行 | 无闸门的 agent loop 在沙箱里发出 `curl … \| sh`；live pi 3/6；E6 在 ~112k／~263k 为 2/5（40%），E11 在有效窗口 63k–300k 为 1/5–4/5 | 不能推出真实部署发生率；沙箱、审批、payload 风险、用户下一句话都会改变结果 |

## 3. 版本、修复与当前可核状态

### 3.1 论文固定的版本与作者自报的受影响范围

**版本表以作者仓库 `code/prompts/PROVENANCE.md` 为准。** 论文 §5 的表格在 PDF 中列有错位；`PROVENANCE.md` 明确给出文件、commit 与最后修改时间，本表用它。

| Harness | 论文固定点 | 作者 advisory 的受影响范围（提交时） | 现版本／当前源码核读（2026-11-06） |
|---|---|---|---|
| pi | serializer `94373d8`（2026-07-19），prompt `9b3a205`（2026-07-22）；live 用 v0.79.0 | `@mariozechner/pi-coding-agent >=0.31.0, <=0.73.1`；`@earendil-works/pi-coding-agent >=0.74.0, <=0.84.2`；0.31.0 之前对伪造 label 不暴露 | v1.5.0（2026-11-02）与 main：`[User]: ${content}` 仍未转义；2026-10-11 起不再序列化真实 thinking 块，但工具输出中的伪造 `[Assistant thinking]:` 行仍原样进入摘要，E16 的 thinking 伪造面并未被该改动关闭（是否仍能洗白未复测） |
| opencode | `0033bb3` | `opencode-ai >=1.18.15, <=1.18.21`；<=1.18.14 走 role-typed | core 2.2.5／dev：`flattenMessage()` 仍输出 `[User]:`／`[Tool result]:` 原文，无转义 |
| Cline | `ffd6a6b` | 自 2026-04 引入压缩起的版本；精确首受影响版本留给维护者 | 扩展 v4.1.26（2026-10-26）与 main：`serializeMessage()` 仍直接插值 `[User]:`／`[Tool result]:`，无转义 |
| Aider | `19a7864` | 自 2023-07 的 summarizer 设计起至 main | main（2026-05-22 后无新提交）：`# USER` 仍直接拼接，无转义 |
| OpenHands | `c11602d` | 自 2025-10 SDK restructure 起至 main | SDK 1.60.1／main：仍 `str(forgotten_event)` + 截断，无转义；2026-09-26 只是把摘要 prompt 拆成 system + user，不改变拍平 |
| goose | `b6f3402` | GHSA-54gw-mg7c-9mrc，Medium，source-level finding；**不在实测集** | main：`[user]:` 仍直接格式化；本卡不把它算入 87–100% |

### 3.2 公开修复与维护者回复

**截至 2026-11-06，没有查到公开的修复版本说明或维护者回复。** 具体是：

- 作者披露目录写明：advisory 于 2026-08-22 私下提交；文件里的状态行只反映提交时；“No project had released a fix at publication time.”
- 六组 GHSA 标识（pi `GHSA-xpxv-w737-f7xc`、opencode `GHSA-2g24-72hh-xc6w`、Cline `GHSA-cfcw-95hx-8hj2`、OpenHands `GHSA-j9jm-r4wm-ggpv` 与后继 `GHSA-mmrx-g3cw-cmjp`、goose `GHSA-54gw-mg7c-9mrc`）在 GitHub Advisory API 均返回 404（未发布或不可公开读取）；Aider 未给标识。
- 目标仓库的 issue／commit 搜索没有找到带这些标识或“compaction laundering”的公开维护者回复；这可能是私下处理、未公开，也可能是尚未处理。
- 因此只能写“未查到公开修复／版本说明”，**不能写“确认未修复”**。但当前源码核读显示五个 serializer 仍未转义；pi v1.5.0 与 Cline v4.1.26 两个发布标签也仍是如此。实际构建是否全部调用该路径、是否在别处拦截，未逐发布包验证。

**版本判断的边界。** 作者 advisory 的受影响范围是作者在 2026-08-21 的评估，明确写“We defer to the maintainer's assessment”，不是厂商确认。pi 当前 1.5.0 已超出 advisory 写的 0.84.2 上限，但源码仍是同一未转义路径；这说明不能拿范围上限当“之后已修”。反过来，也不能拿 main 后续的无关改动（如 pi 的 thinking 省略、OpenHands 的 prompt 拆分）宣称所有发布版都已缓解。

## 4. 不能从论文结论外推的反例

1. **Codex 的 0% 有两层含义，E1 的一层是假的。** E1 的 0% 是“没有归属字段，指标结构上无定义”，不是实测抗性；E10 的 0% 才是 role-typed 对照。E8 还显示 Codex 在三个位置都保留了该批准（3/3），只是记成文档内容。把“0%”读成“Codex 不会记住伪造指令”是错的。
2. **87–100% 是摘要级，不是执行级。** E10 的终点是摘要是否把该行记成用户指令；E6 在约 263k 窗口的执行是 2/5，E15 live 是 3/6。把摘要级比例当现实部署发生率，或当“大多数长会话会被攻破”，没有依据。
3. **“clean 臂从不执行”在 E15 不是字面事实。** 6 个 clean take 中有 1 个在压缩前就执行了 bootstrap（PRE-COMPLIANT），作者把它归为模型方差并从 0/5 中排除。paired 设计吸收了它，但读者不能把“clean 0/5”当成“clean 从不执行”。
4. **908k 只测了 pi。** 摘要 E12 的 ~908k 100% 是 pi + gpt-5.6-terra 的单点；E10 的 87–100% 是 4 轮短 transcript 下五种 harness 的结果（作者 advisory 写 ~300k，但与 E10 runner 不符，见 §2.1）。把“五种 harness 到 908k 都 87–100%”合并成一句，超出了实验设计。
5. **E10 的三个模型是同一厂商的三个变体。** 跨 harness 的 87–100% 不能当作跨模型族稳健性；跨厂商只有 pi 的 E1 行和 Gemini 反事实行。论文把“three frontier models”写在 E10，读者容易误读为三个 lab。
6. **77% 防御没有覆盖五种拍平 harness 的全部。** 代码只解析 pi／Gemini／goose 的归属字段；E9 数据来自 pi／Gemini／Codex。把它当作 opencode／Cline／Aider／OpenHands 的现成防护，超出了实测。
7. **Claude Code 没有被测。** 论文只研究开源 harness；作者调查把 Claude Code 标为“typed（高置信推断，未核源码）”，并说明闭源、未 source-verified。引用 [1] Straiker 只是“描述过机制、没有 runtime evidence”。因此既不能说 Claude Code 有该缺陷，也不能说它没有。
8. **E16 的强审计是脚本化的。** 有审计时 1/50 执行，是“对抗一个勤勉受害者”的上界；真实 agent 审计不均匀，E15 的 live 执行发生在审计被压缩掉的 take。不能把 1/50 当成默认防护效果。
9. **高 stakes payload 没有执行。** 凭据外泄 payload 即使批准已洗白也从未执行；E6 的 canary 是低风险 proof file。把执行率套到真实破坏性命令，会高估。
10. **论文是单作者预印本，未找到独立复现。** 原始 JSON 与代码公开，本卡能重数计数；但模型行为、LLM judge、沙箱执行都是作者自跑，独立裁定也是作者用另一模型族做的 18 项抽样，不是外部同行评审。

## 5. 对现有上下文／权限建议的影响与候选段

### 5.1 与现有正文的对应

- `docs/03-context-engineering.md` §4.1 把“约束是否仍在”列为压缩验证项；§4.3 记了 OpenHands SDK 字符串摘要删掉规则正文；§4.4 写“记忆中的事实不提供新权限，最新的不可信文本也不能覆盖用户约束”；页末“Codex 续接”写“压缩后保留目标，不等于目标继续支配行动”。
- `docs/10-security.md` 清单写“外部 Issue 或网页不能新增 push／发消息授权；已有写入授权时仍核对目标、内容和必要审批”。
- `docs/decisions/context-management.md` 写“压缩后核对”“检查点并不保证摘要无损”。

**这些规则对 Claude Code／Codex 足够，且不需要新增步骤。** 对五种拍平 harness，问题在于压缩后的摘要被当成用户回合，不再是“外部内容”或“记忆事实”；仅靠提示层规则不能恢复来源。这是本卡相对旧稿（`A-M6-WEEKLY-CALIBRATION-20261103/calibration.md`，固定提交 `536b86d`）的真正增量。

### 5.2 最短候选段（供负责人决定是否落 docs/10 清单或 docs/03 §4.3）

> **使用 pi、opencode、Cline、Aider、OpenHands 时，把压缩当作一次来源边界转换。** 会话读取过任何不可信内容（网页、Issue、依赖文档、日志、工具输出、未审仓库等）后，不把压缩后的摘要当成新的用户授权：优先结束会话重开；确需续接时，给压缩后要执行的命令保留模型外的闸门（人工批准或 OS 沙箱），并在能查看压缩摘要的 harness 上核对摘要里出现的“用户已批准”是否对应真实用户原话；看不到摘要时按摘要不可信处理，只保留模型外的闸门。该条只约束这次不可信读取后的压缩，不追溯作废此前授权，也不要求每步重复确认。

**适用条件。** 仅当所用 harness 仍使用未转义的 in-band role label（当前公开源码即如此）；若厂商已转义 label、或 harness 本身是 role-typed，则不适用。它是对已读不可信内容后的下一次压缩的约束，不是对所有压缩历史的否定。**修复方向**是 serializer 转义 role label 或代码级 provenance 校验；读者动作只是过渡缓解，不替代厂商修复。

### 5.3 不落地的情形

如果负责人判断本仓读者以 Claude Code／Codex 为主，且不愿为五种开源 harness 增加条件项，那么保持现有正文即可：本卡没有足够的 Claude Code 证据，也没有把摘要级 87–100% 变成现实事故率的证据。此时唯一应保留的记录是“论文、版本与未复现范围”，供后续有人引用时不误读。

## 6. 旧稿安全核查

**对照对象。** 旧稿为固定提交 `536b86d` 的 `docs/collaboration/local-jobs/artifacts/A-M6-WEEKLY-CALIBRATION-20261103/calibration.md` §本周未记录线索：第 1 条“压缩会破坏消息来源，伪造的用户批准可能被执行”，第 2 条“账号邮箱进入模型上下文，IS_DEMO 不拦”。逐条核对如下。

- **没有执行旧稿的账号邮箱核验配方。** 旧稿 §本周未记录线索 第 2 条建议复制 `~/.claude.json` 到脱敏副本、检查 bundle 的 `userEmail` 构造点；本卡全程只读公开网页与公开源码，没有读取本机配置、私人会话或宿主元数据。
- **没有把旧稿的“压缩后不继承批准”直接复制成推荐。** 该写法没有区分产品、版本和动作，容易变成“所有历史批准作废／每步重认”；本卡改为只约束五种拍平 harness、只针对已读不可信内容后的压缩，并明确不追溯此前授权。
- **没有把 Claude Code 当成已测产品。** 旧稿提出的“先核 Claude Code 压缩序列化是否保留消息角色”无法由公开材料完成：论文未测，作者调查是推断，闭源实现不可读。本卡把它保留为精确缺口，不写成结论。
- **没有重跑旧广扫、没有解除旧卡隔离、没有安装或运行候选。** 旧周稿的 Compaction Laundering 线索只作为输入；本卡固定读取论文全文、作者仓库和当前上游源码，未复制其摘要百分比当结论。

## 7. 未读、未复现与剩余缺口

- **未复现**：没有运行模型、API、Docker 沙箱、demo 或攻击载荷；没有独立重算 LLM judge 的判定；没有看录屏，只读日志、分类和摘要。所有“可核结果”是计数复核或原文对照，不是行为复现。
- **未读**：`data/stated-plan/*.jsonl` 全量、`data/live/*.json` 的每条执行明细（只读了汇总与关键计数）、作者私下 advisory 之外的维护者回复、闭源宿主的实现。
- **剩余问题 1**：五种 harness 的当前发布构建是否全部调用未转义 serializer，未逐包验证；pi v1.5.0 与 Cline v4.1.26 只核了标签内源码，opencode／Aider／OpenHands 只核了默认分支。
- **剩余问题 2**：省略真实 thinking 不等于转义伪造 label，E16 的 thinking 伪造面仍在；E15/E16 在 1.5.0 上的行为未复跑，不能把旧 live 结果直接套到 1.5.0。
- **剩余问题 3**：E10 只用三个 gpt-5.6 变体；跨厂商的 harness 级洗白率未知。E9 的防御没有在 opencode／Cline／Aider／OpenHands 上测；自适应攻击未测。
- **剩余问题 4**：没有厂商确认的受影响版本、修复版本或 CVE；GHSA 未发布，维护者回复未公开。未查到不等于未修复。
- **剩余问题 5**：论文的“真实部署发生率”没有数据；E15 是 6 对 take、一个模型、一个 harness，作者自己说绝对数小，可靠的是机制与 3/6 vs 0/5 的配对分离。
- **剩余问题 6（未决样本）**：Continue 这一 harness 的 15 个 cell 中，14 个有效判定全部 RESISTED，另 1 个（`gpt-5.6-luna / continue` poisoned rep 2）为 `ERROR`；这个 ERROR cell 在 `structured_result.json` 的 keyword 判分为 `laundered: true`。`judge_validation.md` 的 18/18 分层抽样只覆盖 Continue 的 rep 0/1，未裁定该格；论文“0%、无中间值”也未披露。因此 Continue 记为 0 LAUNDERED（14 有效 RESISTED + 1 ERROR），不写成 15/15。

## 8. 依据

- **论文**：[Compaction Laundering: Provenance Destruction in Context-Compacting Coding Agents](https://arxiv.org/abs/2610.29869v1)，arXiv 2610.29869v1，2026-10-21；本次读 PDF／HTML 全文，核实 2026-11-06。
- **作者仓库**：[pixee/compaction-laundering](https://github.com/pixee/compaction-laundering)，固定提交 `9ce87b71301c628dfcd9232b01f1ccbdb0e67b16`（2026-10-22）；`README.md`、`disclosure/README.md`、`disclosure/pi.md`、`disclosure/opencode.md`、`disclosure/cline.md`、`disclosure/aider.md`、`disclosure/openhands.md`、`data/harness-survey.md`、`code/prompts/PROVENANCE.md`、`code/study/src/compaction_study/serialize.py`、`flattening.py`、`harnesses.py`、`validator.py`、`scoring.py`、`data/live/judged_result.json`、`execute_scale_result.json`、`matrix_result.json`、`demo/takes/v4c-whatsnext/pair-*/category.txt`；核实 2026-11-06。
- **原讨论**：[HN item 50246778](https://hn.algolia.com/api/v1/items/50246778)，2026-10-26T16:42:20Z；正文与 2 条评论全读，核实 2026-11-06。
- **当前上游源码**（均为 2026-11-06 读取）：[pi v1.5.0 `utils.ts`](https://github.com/earendil-works/pi/blob/v1.5.0/packages/coding-agent/src/core/compaction/utils.ts)（main HEAD `2a32a605`）；[Cline v4.1.26 `compaction-shared.ts`](https://github.com/cline/cline/blob/v4.1.26/sdk/packages/core/src/extensions/context/compaction-shared.ts)（main HEAD `ea16751d`）；[opencode `compaction.ts`](https://github.com/anomalyco/opencode/blob/dev/packages/core/src/session/compaction.ts)（dev HEAD `2658ec02`）；[Aider `history.py`](https://github.com/Aider-AI/aider/blob/main/aider/history.py)（main HEAD `5dc9490b`，2026-05-22）；[OpenHands SDK `llm_summarizing_condenser.py`](https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/context/condenser/llm_summarizing_condenser.py)（main HEAD `295b3baf`）；[goose `format.rs`](https://github.com/aaif-goose/goose/blob/main/crates/goose-context-management/src/format.rs)（main HEAD `4facf56c`）。
- **GitHub Advisory API**：`GHSA-xpxv-w737-f7xc`、`GHSA-2g24-72hh-xc6w`、`GHSA-cfcw-95hx-8hj2`、`GHSA-j9jm-r4wm-ggpv`、`GHSA-mmrx-g3cw-cmjp`、`GHSA-54gw-mg7c-9mrc` 于 2026-11-06 均返回 404；未查到公开维护者回复。
- **本仓对照页**：[03-context-engineering.md](../../../../03-context-engineering.md)、[10-security.md](../../../../10-security.md)、[context-management.md](../../../../decisions/context-management.md)；只读相关段，核实 2026-11-06。
