# A-PERFORMANCE-ROUTE-001 · 性能任务的强方法选择与采用入口

id: A-PERFORMANCE-ROUTE-001
owner: dot-A
status: review_ready
target_repo: https://github.com/dbvv1/a1dbv
base_ref: 8a1235c7bc4c849c50ce81673f9e66df8eecd638
result_branch: relay/a-performance-route-001

## 目标

为已有真实功能的性能诊断／优化找到值得实际采用的 Agent 任务路线。15§7已有 profiler、堆分析和外部案例，但本仓尚缺自然需求下的完整性能采用；本轮先取得足够支持选题和实施选择的证据，不凭能跑一个基准就立项，不延续通用修库系列。

读取固定提示词、TASKS当前重点、15§7与已有实验。使用已配置原生 Workflow，把彼此独立的公开需求调查、源码／在制检查、替代方法判断并行，避免共享文件多写者。官方机制、真实开发者／维护者反馈、开源当前实现三方对照。正文与来源没有变化的结论复用。

## 本轮范围与取舍关

寻找真实尚未解决的性能问题，优先维护者已有真实负载、profile、复现命令、基准与行为验收的公开项目。先核当前固定源码、issue和在制PR，排除已解决、已有执行者、仅人工制造慢程序或纯小修题。没有满足条件的任务就交具体负结果与仍缺证据，不填工具名单或为了产出制造案例。不要把 Memos 未解释的历史测试超时改称性能问题，也不继续它的边界矩阵。

选出的唯一推荐必须说明：用户原来完成什么功能、实际慢在哪里、为什么重要；Agent 缺少哪种运行证据或项目窄知识；现成 profiler／日志／项目基准与堆分析等强替代谁适用，为什么选择某层而不全加；预期能改变什么实现判断；真实CLI／库消费者如何接收并保住原行为。实际工作量与风险不适合就不硬推。

本轮只做公开研究、源码／已有报告核对，必要的非付费既有基准复现须在普通工作区和现有权限内；不做正式方法对照。先交固定SHA、可复制输入、预期验收与推荐方案，由 dot-A 判断再进入同任务实施，避免研究席自行把普通性能小修冒充 AI coding 增量。若方案可形成有用的窄路线，可修改现有 `docs/15-codebase-understanding.md` §7，明确尚未本仓采用；不要写成实测收益。其余只改本任务，不新建目录、编号专题或证明台账。

## 回传与边界

回传实际模型／客户端、执行起止、来源永久链接、源码位置、当前需求／PR状态、选择与撤回条件。一次有效独审覆盖新增正文和推荐证据；无正文则独立核对选题关键事实，不叠评审。按手册§7做适用文档／公开内容／身份／空白检查；不为纯文档跑实验。推指定结果分支并回写 review_ready，不能称实现完成。

不接触私人会话、公司代码、账号用量、秘密，不付费、不下载大模型、不创建账号／数据库身份，不启动浏览器或服务、部署、外发issue／PR、新建会话或调度，不重试已拒动作。已有拒绝不换路；局部受阻只停对应动作。发布前fetch，15若并发变化先协调；13改写另有执行者，不碰。

认领：dot 本地协作；2026-10-25T02:44:04.284827+00:00。来源 main 固定 `fe4296b`；性能研究与13改写无文件重叠，先发布认领再执行既有正常原生 Workflow。复用已有成果，产物仅推指定结果分支。

## 结果回写（2026-10-25，review_ready）

**结论：本轮不立项，交具体负结果；15§7 不加性能路线，未运行基准或软件。** 已核候选中没有一项同时满足“真实未解决、无执行者、当前固定源码仍成立、本环境可跑同构建、有行为验收”。原始调查有两处关键事实需按页面纠正：Sphinx #10966 并非“无 assignee”，mypy #21997 已有 open linked PR。按原任务“排除已有执行者”的取舍关，两者均不进入推荐。

### 最接近的候选与排除依据

| 候选 | 已核事实（2026-10-25） | 未选原因 |
|---|---|---|
| [sphinx#10966](https://github.com/sphinx-doc/sphinx/issues/10966) C++ 符号查找慢 | 固定 [`1ddf1981`](https://github.com/sphinx-doc/sphinx/commit/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149)（9.3.0，BSD-2-Clause）；OPEN，labels `domains:cpp`、`help wanted`、`type:performance`；**2022-11-11 由维护者 jakobandersen self-assigned**；无 linked PR；最后更新 2026-03-24。当前源码 [`_symbol.py` L1067](https://github.com/sphinx-doc/sphinx/blob/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149/sphinx/domains/cpp/_symbol.py#L1067-L1080) 的 `direct_lookup` 仍逐项扫描 `_children`，L390 `_find_named_symbols` 经 L480 `_candidates` 扫描；[`_ast.py` L4629](https://github.com/sphinx-doc/sphinx/blob/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149/sphinx/domains/cpp/_ast.py#L4629) 的 `get_newest_id` 已有缓存；C domain 的 [`_children_by_name`](https://github.com/sphinx-doc/sphinx/blob/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149/sphinx/domains/c/_symbol.py#L126) 索引已随 [#12162](https://github.com/sphinx-doc/sphinx/pull/12162) 合入 | **已有执行者**：issue 由 C++ domain 作者／维护者 jakobandersen 自派，2022 年优化分支仍在但无 PR；2024 年后无维护者进展，最后评论称 stalled。按取舍关不作无主任务推荐；是否覆盖此门槛由 dot-A 决定 |
| [pydantic#12911](https://github.com/pydantic/pydantic/issues/12911) 大字符串 JSON 序列化 | 固定 [`37dc34b`](https://github.com/pydantic/pydantic/commit/37dc34b4f001191b4f3db707cc52bac95baf17f0)（MIT）；OPEN，5 comments，无 linked PR/assignee；`gtkacz` 2026-04-21 请求接手并提出四项设计问题，维护者未答；消费者 Tesseract 已用 [PR #522](https://github.com/pasteurlabs/tesseract-core/pull/522) 的 orjson 绕过；本机无 Rust/maturin | 意向执行者、方向未定、消费者已绕过、需新工具链，四项均不适合现在硬推 |
| [tda4j#230](https://github.com/appliedtopology/tda4j/issues/230) Scala.js 性能 | OPEN，无 linked PR/assignee，0 comments；但 [#233](https://github.com/appliedtopology/tda4j/pull/233) 仍 OPEN 且是其基线前提；本机无 Java/sbt | 基线依赖未合入 PR，工具链缺失 |
| [mypy#21997](https://github.com/python/mypy/issues/21997) enum match 二次 | OPEN，0 comments，无 assignee；页面已有 open linked [PR #22003](https://github.com/python/mypy/pull/22003)（2026-09-17） | 已有在制 PR，排除 |
| [esbuild#3795](https://github.com/evanw/esbuild/issues/3795) resolver 慢 | 原始调查称 open、有 repro/pprof、无维护者回应；本席未独立复核；本机无 Go 工具链 | 工具链缺失，证据未复核，不据此立项 |

### 这次负结果改变什么判断

- **“无 linked PR”不等于“无执行者”。** 要看 issue 侧栏的 assignee 和 timeline 的 self-assigned 事件。Sphinx 推荐的前提正是被这一项推翻；以后选题先把 assignee、self-assigned、linked PR、在制分支四项一起核。
- **旧 profile 不能当当前基线。** Sphinx 的 `direct_lookup` 55.776s／3440 次调用、`get_newest_id` 1,570,402 次调用来自 5.3.0；当前 9.3.0 已缓存 newest id，热点份额会变。没有固定 SHA 重测，不能把“源码仍线性”写成“当前构建仍慢数倍”。
- **issue 页面的 linked PR 要直接核。** mypy #21997 的 #22003 在 issue 页面可见；只看“0 comments／无 PR”的摘要会漏。
- **环境仍是硬门槛。** 本机只有 Node 22.23.2、npm 10.9.8、Python 3.13.5、pip 25.1.1；没有 Go、Rust、Java/sbt、C/C++ 编译器。需要这些工具链的候选即使证据更强，也不作为本环境低风险入口。

### Sphinx 的后续只读核查方案（未运行，不作为实施推荐）

- 先固定 `1ddf1981`，取得可复制的真实负载，再视需要用生成的单命名空间语料（N=500/1000/2000/4000 个 `cpp:function` + 同量引用，另加重载/模板/匿名命名空间对照）辅助 `cProfile` 分析，核对 `direct_lookup`/`_find_named_symbols` 的候选扫描是否解释实际慢点；若不能解释，撤回该优化方向。生成语料与后续索引设计均未运行，不替代自然需求。
- 确认后才把 `_children` 按 `identOrOp` 建有序候选索引，保留现有 `_matches`/best-candidate 顺序；C domain 的 `_children_by_name` 只作模式参照，不直接照搬单值 dict。
- 验收要求：45 个 `test_domain_cpp.py` 测试与测试根全过；每个 `:cpp:func:` 的 anchor/ID 与 warning 集合逐项不变；重载/模板/匿名实体结果不变。
- 该方案未在本仓实施，不声称收益；若不能在不改上述语义的前提下维护索引，停止并交负结果。

### 恢复条件

- Sphinx #10966：出现固定 SHA 的新 profile 与可复制语料，可以恢复只读核查；进入实施候选还须确认 assignee 已解除、维护者明确交接／公开请求接手，或其优化分支删除并声明放弃。新性能证据不解除既有认领，仍须满足当前源码与真实行为验收要求。
- pydantic #12911：维护者回答四项设计问题并接受核心快路径；或 `gtkacz` 明确放弃且无 PR；且本机有 Rust/maturin，或任务改为只做 Python 侧测量。
- tda4j #230：#233 合入且 #232 的基准可比性问题解决，且本机有 Java 21/sbt 2。
- mypy #21997：#22003 关闭且无人接手，同时给出固定版本 profile 与可复现命令。

### 未做与仍缺证据

- 未运行 Sphinx、pydantic、tda4j、mypy、esbuild 或任何基准；未安装 Rust/Java/Go；未修改 15 正文；未向上游发 issue/PR；未启动浏览器/服务；未新建目录或台账。
- 仍缺：任一候选在固定 SHA 上的当前 profile；N/2N 伸缩曲线；修改前后逐引用解析目标与 warning 差分；维护者对方向的明确答复；真实 CLI/库消费者接收记录。
- 因此本轮不声称任何性能收益，也不把候选写成已采用。

### 执行元数据

- 实际响应字段：父调用与五个 Workflow 子代理原始 assistant `message.model` 均为 `deepseek-flash`；请求别名 `deepseek-v4.1-flash[1m]` 单列，后端具体型号未另证。
- 客户端：Claude Code 子代理（原生 Workflow 的 sole-public-writer）；具体版本未暴露。
- 实际原生调用：2026-10-25T02:45:21.953Z—03:20:00.013Z（UTC）正常退出；认领发布后启动，三个只读研究并行，单一写者汇总与机械检查。
- 检查：`check_repo.py` 363 files／0 errors；`check_public.py` 624 files／0 findings；`check_public.py --commits fe4296b..3c00abd` 无 findings（仅覆盖既有认领提交，本次改动未提交，发布前由父级按同一入口复扫）；`git diff --check` 无输出；未 commit/push，结果分支由父级发布。fetch 时 `origin/main` 为 `3c00abd`，15 与 HEAD 无并发差异。
- 来源与核实：上表链接、固定 SHA blob 链接与 issue/PR 页面；页面事实核实 2026-10-25。无新增正文，关键事实独立核对；语义审查由父级安排。

独立审查：已核原始需求、候选关键来源返回、固定源码与当前工具链事实，支持本轮负结果；发现 Sphinx 恢复条件把性能证据与认领解除误写成任选，已分开只读恢复和实施候选条件。未因此新增软件运行、研究或批准步骤。后续核查方案只保留能解释真实慢点的诊断条件，删除未运行的固定占比阈值。

最终交付：恢复条件修订已由原独立审查者仅复核受影响 delta，原问题解决，无新增实质问题。已整合最新 main `ac37c7f`，本次仍仅改原任务文件；最终文档检查 364 文件、公开内容检查 625 文件、空白检查通过。旧阶段计数按原范围保留，提交后扫描实际新增提交身份。
