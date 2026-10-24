# A-CODING-ADOPTION-001：为连续功能交付选择下一项真实采用

id: A-CODING-ADOPTION-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 9ec657f937153986830cb0beb71126189736f2b9
result_branch: relay/a-coding-adoption-001

## 目标

沿 operations§2.2 使用已配置的 DSH＋DeepSeek、Claude Code＋DeepSeek 或 ZCode，调查一个值得进入实际开发的完整能力目标，供 dot-A 作关键取舍并接续实施。重点是连续功能交付的品质与周转，不是再找一种工具做边界小试。此次是普通生产协作，不运行 P79、旧冒烟或模型 benchmark。

从当前真实开发者需求和公开仓库的未决功能中寻找：哪些问题需要更好的知识加载、开发反馈或多 Agent 整合，原生 Agent 加现有工具能做到什么，哪种有竞争力的方法确实补上缺口。先核最新实现和在制 PR，已经解决的跳过。找到足够强的一项就深入，不凑候选数量；没有值得做的也允许交具体负结果。

先读 AGENTS、运行手册§4／7／9、TASKS、07工作流、15实操入口和25探索的相关段落，避免全库灌入。OpenSpec MDX 扩展已在 base_ref 完成交付，不继续扩其格式／边界矩阵；QMD、Context Hub、Serena、testmon、Worktrunk 的窄试用不重做。不要新造搜索器、配置打包器、通用流程框架或普通库修复案例。

## 需要交回什么

- 一个有原始需求和实际消费者的可实施目标：谁需要什么结果，现有产物缺什么；给固定来源／代码位置，并核是否已有解决方案。
- 原生起点与最有竞争力的替代或组合，给明确条件选择和理由。优先复用现成实现，不因无法证明全行业最优而只列名字和局限。
- 可供后续编码 Agent 直接接手的输入：拟改文件范围、保留的现有行为、第一次交付与自然后续修改、实际消费者怎样接收。不要制造故障或发明无使用者的演示项目。
- 必要的一手链接、源码判断、真实采用／退出反馈；区分自己读取到的事实、作者自报和推断。未运行的工具或模型效果不声称通过。

普通任务可直接沿正常 Workflow 调用，不先重测联通。记录实际执行通道和能核到的模型身份；身份未知如实记，不读取或输出账号用量、连接信息、秘密或私人历史。

## 写入和停止边界

只在本任务文件追加简洁结果并更新状态；不修改主专题、脚本、其他任务或产品仓库，不向外部 issue／PR 留言，不部署。公开源码只读调查可在任务工作区进行，不调用收费或新凭据入口，不访问公司代码或无关文件。此任务不授权重试已明确拒绝的动作。

沿任务入口约定先确认认领，再执行；结果推至上面的 result_branch，按§7检查实际新增内容及提交身份，并将本文件标为 review_ready。dot-A 接收后决定下一项实施，不将本调查自动算作功能已经完成。受阻只写准确失败与恢复条件，不新建替代会话、调度或证明台账。

## 执行与结果

认领：dot 本地协作；2026-10-24T18:21:56.346498+00:00。研究结果仅写本任务，使用独立结果分支 `relay/a-coding-adoption-001`；认领发布后通过已配置模型的原生 Workflow 开展公开来源调查与独立核查。

## 调查结果（2026-10-25）

**选题成立，但不建议把自研 Codex 内核补丁作为下一项默认采用。** 完整能力是：从 monorepo 根连续交付跨包功能时，随实际工作子树加载局部约束，减少漏规则造成的返工。Codex 当前仍有该原生缺口；Claude Code 和 OpenCode V2 已有现成机制。客户端可选时，优先在真实跨包需求中采用现成机制；客户端固定为 Codex 时，保留下面的有条件实施输入，由 dot-A 判断维护收益。本调查不把“需求真实”写成“上游愿意接收”或“交付已提速”。

### 消费者、源码与相反证据

实际需求来自 [openai/codex #12115](https://github.com/openai/codex/issues/12115)：根启动的 monorepo 用户希望跨子系统时带上局部规则，评论给出 Rendering、Persistence、Networking 的约束例子，并有留在 Claude Code／转用 OpenCode 的自述。这些是用户反馈；正文企业账户与严重性清单是 tracker 自报，不能作为独立效果统计。该 issue 仍 open，标签同时包含 High impact、Moderate 和 Normal queue，不能只挑高优先级标签。

相反证据直接影响推荐：[#9836](https://github.com/openai/codex/issues/9836) 已以 not_planned 关闭，维护者解释当前设计优化子目录启动；[#13288](https://github.com/openai/codex/issues/13288) 的维护者称当前行为符合设计并指向 #12115；[#17239](https://github.com/openai/codex/issues/17239) 以重复关闭。因而“Codex 有需求”不等于“只差写补丁”，本轮没有取得上游采用承诺。

核查固定 Codex main **970111f6cb62cc02fe36a82ea7d71b37a2889c97**：

- [agents_md.rs](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/agents_md.rs)：`load_project_instructions`／`agents_md_paths` 沿项目根到当前 cwd 发现文件，没有遍历启动 cwd 以下的子树；按环境 filesystem、sandbox 和项目 trust 读取。
- [agents_md_manager.rs](https://github.com/openai/codex/blob/970111f6cb62cc02fe36a82ea7d71b37a2889c97/codex-rs/core/src/agents_md_manager.rs)：仓库文档缓存随 environment selections／trust 变化失效；没有实际访问子树的缓存维度。不能把 step refresh 等同于递归发现。
- 当前 handlers 中没有通用 `read_file`／`list_dir` handler；shell 中 `cat`／`cd` 的路径不是现成的结构化文件访问事件。不能把添加一个 targets 参数说成完整的预编辑保护。
- 本轮针对 open PR 的 `agents_md`／`nested AGENTS` 搜索未发现覆盖此目标的实现；[#17401](https://github.com/openai/codex/issues/17401) 是根指令 `@include` 组合需求，作用不同。这是本次检索范围的结果，不声称穷尽全部 PR；真正实施前再核对应源码即可。

[官方 AGENTS.md 文档](https://learn.chatgpt.com/docs/agent-configuration/agents-md) 同样规定根到 cwd 的启动链，默认项目文档预算 32 KiB。Workflow 在本机 codex-cli 0.154.0 的隔离 fixture 上运行 `codex debug prompt-input`：根启动见根标记 1／包标记 0；包目录启动见根 1／包 1。**这只验证上下文组装**，并非上述 main 构建或模型遵守规则的验证，不需为本次研究再次运行。

### 原生起点、现成替代与条件选择

| 路线 | 已查到的实际机制 | 适用选择 |
| --- | --- | --- |
| Codex 原生＋`--cd` | 根到 cwd 的链；在目标包启动即可带入祖先和包规则 | 单包任务沿用即可；根会话跨兄弟包仍缺自动加载 |
| Claude Code | 祖先 CLAUDE 文件启动加载；子目录 CLAUDE 文件在读取、写入或编辑其中另一个文件时加载 | 团队已用 Claude Code 时优先复用。AGENTS 的配置入口与 CLAUDE／import 入口不能混为一谈 |
| OpenCode V2 | 读取文件或列目录时发现 workspace 内嵌套 AGENTS，nearest-first、去重；compaction／revert 可重载，修改嵌套规则文件后不自动重载 | **团队以 AGENTS 为现有规范且客户端可选时，最直接的现成参照与采用候选** |
| Codex 自研动态发现 | 当前没有上述结构化访问链；需承担源码维护及语义设计 | 只在确有 Codex 固定需求和具体跨包消费者时再实施；不因为已有研究而自动开工 |

依据是 [Claude Code memory 文档](https://code.claude.com/docs/en/memory) 与 [OpenCode V2 instructions](https://opencode.ai/v2/docs/instructions/)，本轮仅读文档，未实跑这两个客户端的采用效果。Claude 的 `InstructionsLoaded` 对通过 project instructions setting 读取的 AGENTS 不触发；对 CLAUDE 或 import 的行为需按官方入口区分。它不能被用来证明所有 AGENTS 均有加载回执。

[LINUX DO 一线使用帖](https://linux.do/t/topic/2400709) 作者自述公司 AI 编码中的返工、规范遗漏和 32 KiB 截断经历；结合 GitHub 需求讨论，支持“上下文范围影响交付”的问题方向，不证明动态加载一定提速。采用／退出反馈属于个人自述，本轮没有受控对照或全行业优劣结论。

### 后续编码交接：保留目标，修正首批触发设计

如果 dot-A 选择维护 Codex，**第一次交付应解决真实根启动任务在读取一个子包后、生成下一次修改前获得该包规则**。先以消费者已有仓库的一个真实跨包功能为入口；目前公开需求没有可直接修改的消费者私有仓库，不能虚构其业务文件清单。本轮只给 Codex 本身的拟改范围，不承诺工期，也不把合成 fixture 当采用完成。

拟改文件均位于上述固定 commit 的 `codex-rs/core/src/`：

- `agents_md.rs`：复用现有祖先发现和读取逻辑，支持同一 environment 内的已访问子树；根链保留在前，动态来源去重、有明确优先级及预算耗尽提示。
- `agents_md_manager.rs`：将实际访问目标纳入刷新／失效，保留隔离 reviewer 的 pinned snapshot 及 trust 收紧后的清除逻辑。
- `session/mod.rs`、`session/turn.rs`：将发现的指令在下一次模型生成前送入上下文，并更新已有来源展示；确认 compaction／继承不重复或丢失。
- `tools/handlers/unified_exec/exec_command.rs`、`tools/handlers/shell_spec.rs`：显式 workdir 可作为一个已知目标来源，但覆盖不了 shell 内路径。需要为实际消费者选择可观察的读／目录访问契约；若新增结构化读工具，应明确为新增能力并在 handler 注册／schema 处接入，不能冒充当前已有接口。具体新增文件与签名在实现时按源码确定，不预造 API。
- `agents_md_tests.rs`、`session/tests.rs`：沿现有测试位置验证发现和下一次请求的实际上下文，不新建通用测试框架。

**不可沿用原稿的“patch 后再加载＝首改保护”方案。** 仅从 `apply_patch` 的变更路径提取目标，最多影响后续生成，第一次写入已经发生；在一个工具调用内部才读规则，也不能追溯改变已经生成的 patch。首批必须覆盖实际消费者的读／发现入口，验证“读子包→收到局部规则→生成修改”的顺序。未经过该入口的直接盲写仍是明确缺口；若需求包含所有写入前的强制保证，需另设计生成前的目标发现／重新生成契约，不能把本首批算完整保护。若真实工作主要使用不可可靠观测的 shell 访问且不愿增加原生访问能力，**撤回自研首批，复用现成客户端**，不退成一套提示包装。

保留：启动全局／项目根／cwd 链；每目录 override＞AGENTS＞fallback 选择；既有共享字节预算；环境身份、trust、sandbox、Windows 路径与符号链接约定；subagent／reviewer 快照。新增目标须按目标环境规范化，限定在所选 project／workspace 的合法范围，并防止符号链接把探测带到另一仓库；显式外部 workdir 不能自动扩展指令来源。预算耗尽必须可见，不能默默把“发现文件”当成已完整载入。

消费者接收应看到：根会话接续一个真实跨包需求，读取两个子树后，在各自下一次修改生成前已收到适用规则；实际输出遵守各子树规则，来源不串包且不重复；一次自然后续需求继续成立。直接失败路径覆盖 override、无剩余预算、越界／不信任目标、重复访问和 compaction。fixture 与 Rust 测试支持机制判断；真实功能修改和后续需求才接收采用。**未运行这些实施验收。**

自然第二次交付再处理消费者尚未覆盖的 shell／cwd 访问、规则编辑后的失效及上下文恢复；不先扩规则矩阵，不先建监测台账。若上游提供同能力或维护成本不值，撤回自研并复用现成实现。

### 实际执行、保留材料与交付边界

本次使用已配置 **Claude Code＋DeepSeek 的普通原生 Workflow**，研究及核查两阶段均完成；原始 assistant 消息中，主调用和两个阶段均报告 **`deepseek-flash`**。这是实际通道自报的 model 字段，不能外推未披露的后端版本；harness 别名不当独立身份。调用实际起止为 2026-10-24 18:24:37—18:50:18 UTC，一次调用，未重测联通。原始 stdout／stderr、Workflow 两阶段结果和初稿失败判断保留本机；公开任务不带私有路径、会话标识或原始日志。

初稿曾选择性突出高影响标签、把 patch 后加载写成首批保护，并把父执行端尚未发布误记为阻塞。上述问题已修正；原始失败结果未覆盖。当前交付是有正反来源和条件选择的调查输入，**不是已实现功能、上游接受、规则遵守或提速通过**。本轮没有运行 Rust 构建、真实 Codex 模型效果、Claude／OpenCode 的目标功能会话或 hook。

状态 `review_ready` 供 dot-A 接收本调查、决定是否采用或另发实施任务；不替 dot-A 标 accepted。结果仅写本任务文件。检查：`check_repo.py` 342 files／0 errors，`check_public.py` 600 files／0 findings；独立只读审查未发现实质缺陷，按原任务核过需求、固定源码、官方原文及现成原始结果。已人工检查新增内容，原始日志留本机；发布前执行空白与提交身份扫描，结果提交链接回填 main 原任务。

发布：结果分支 `relay/a-coding-adoption-001` 已快进发布，产物提交 [b36de7d](https://github.com/dbvv1/a1dbv/commit/b36de7dcac07b183dba7c5cf3fac41991ca5bef3)。结果分支的 `check_public.py --commits origin/main..HEAD` 检查 601 files／0 findings，`git diff --cached --check` 通过；命令级提交身份为 Codex Local Executor，未修改全局配置。由 dot-A 接收调查和决定下一项采用；当前没有在途模型调用。
