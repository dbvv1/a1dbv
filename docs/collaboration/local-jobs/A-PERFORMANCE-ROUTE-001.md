# A-PERFORMANCE-ROUTE-001 · 性能任务的强方法选择与采用入口

id: A-PERFORMANCE-ROUTE-001
owner: dot-A
status: accepted
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

Git 回传：结果分支 `relay/a-performance-route-001`，固定提交 [`f31f36bc9d068245e0b0dce0bd2c17ede72003fd`](https://github.com/dbvv1/a1dbv/commit/f31f36bc9d068245e0b0dce0bd2c17ede72003fd)。一次独立核查与恢复条件 delta 复核完成，文档／公开内容／实际新增提交身份／空白检查通过；仅回传具体负结果，未改15、未运行基准或实施优化，状态 `review_ready`，由 dot-A 接收。

## dot-A 取舍纠偏与同任务续接（2026-10-25）

接收以上公开调查事实及“未运行当前基线、未证明收益”的结果，但不采纳两项过强推断。历史 self-assigned／旧分支不证明当前活跃，长期无更新也不证明放弃；Sphinx 当前活动应记为未证实。缺 Go／Rust／Java 是该执行席当前环境事实与成本，不是所有已授权环境的权限硬门槛。上文“必须解除 assignee／声明放弃才可实施”与“环境仍是硬门槛”的通用判断由本节取代；原始调查保留，不抹去失败和修订。仅纠正这两项选择推断，不重跑候选广搜。

继续同任务：围绕 Sphinx #10966 的真实公开负载，建立固定 `1ddf1981c4aac4ff72bfb4a97e05909d55c3a149` 当前性能证据。先窄查原 issue、优化分支的最近实质变化及关联 PR；现成有效实现优先复用，确证同范围活跃实现则停重叠开发，只交独立复现。未知不自动当独占禁令，也不宣布无人执行；不外发询问、issue 或 PR，不声称接管维护者任务。

取得原报告可复制真实负载，在普通隔离工作区运行 Sphinx 构建和 cProfile，记录输入来源、固定版本、命令、墙钟、调用情况与输出。不要要求先有新 profile 才能采集 profile。生成规模语料只能辅助解释／回归，不替代真实负载；取不到真实负载或不能复现，准确写缺口并停实现。瓶颈消失则按实际结果收口。

仅当真实负载确认候选扫描确为有效瓶颈、无确证冲突时，让实际编码 Agent 结合 profile、C domain 索引与 C++ 查找语义作可撤回本地优化。保重载、模板、匿名实体的候选顺序与解析语义；实际 CLI 接收构建前后耗时、解析目标／anchor／ID／warning 差分和固定树受影响测试。可用实现胜出则借用而不另写。不是正式方法 A/B，不预设提速倍数，不以基准变绿替代正确输出。

代码只在临时项目工作区；仓库仍仅写15§7和本任务，结果可在任务中保留可接手的固定差量与命令，不新建目录或编号专题。当前席位只沿既有批准安装／运行范围，不扩大到用户电脑、全局配置或凭据；dot 自己云端的官方可信非付费依赖可按现有授权处理，席位不足则交接具体动作和输入，不能笼统写成缺用户授权。无需为此安装 Go／Rust 或重启其他候选。

保持一次有效独审：已有事实核查复用，只审新增实际采用及取舍delta。更新结果后按§7做适用测试与发布扫描，回传同一结果分支 review_ready，真实模型／执行起止与消费者结果分开记。本地验证不等于上游接受。浏览器／服务／账号／数据库、部署、外发、新会话与调度及已拒动作边界仍不变。

续接认领：dot 本地协作；2026-10-25T04:04:13.132150+00:00。按 main `c64e2af` 的负责人新决定继续同任务与原结果分支，保留首轮调查和审查；仅做指定 Sphinx 窄查、真实负载复现及条件优化，不重复候选广搜。

## Sphinx 真实负载复现与可撤回本地索引（2026-10-25，续接）

**结论：在固定 Sphinx `1ddf1981` 与 GCC 撤除 Sphinx 文档前的 `bd044da` 上，issue #10966 的真实 `cpp` 负载可稳定构建；当前热点不是 5.3.0 的 `direct_lookup`（0.50s），而是 `_find_named_symbols` 的同名候选线性扫描（profile 累计 5.35s）。按 C domain 的有序候选索引做可撤回本地差量后，五次成对构建（含两次倒序）墙钟均值 31.22s→28.92s（−2.31s，约 7.4%），`gccint.texi` 逐字节相同、54 条 warning 集合相同、116 个 C++ domain 测试与 299 个 domain 测试通过。该差量只在临时工作区验证，未提交上游、未在本仓采用；收益只代表这一固定历史负载与单机，不能写成 Sphinx 全面提速。** 首轮负结果和审查保留在上文；本节只取代“未运行／无当前 profile／环境硬门槛”这组缺口，不重跑候选广搜。

### 窄查：issue、旧优化分支与当前源码

- [issue #10966](https://github.com/sphinx-doc/sphinx/issues/10966) 仍 OPEN，labels `domains:cpp`、`help wanted`、`type:performance`；assignee 是 2022-11-11 self-assigned 的 jakobandersen；页面 Development 显示 “No branches or pull requests”；最后实质评论 2026-03-24 称 issue 已 stalled，无维护者新答复。按负责人纠偏，只记为“当前活动未证实”，不据此宣布无人执行或活跃实现。
- fork 分支 [`c_cpp_optimizations`](https://github.com/jakobandersen/sphinx/tree/c_cpp_optimizations) 头为 [`2f21346`](https://github.com/jakobandersen/sphinx/commit/2f2134671c91016735ff94097c1f1fada8b4306e)（2022-11-11），只有三项提交：`018105f` 缓存 `get_newest_id`、`d752a79` 特化 `ASTIdentifier`／`ASTOperator` 的 `__eq__`、`2f21346` 类型修正；没有关联 PR，2022 年后无更新。
- 两项实质优化已在当前固定源码中：`_ast.py` [`get_newest_id`](https://github.com/sphinx-doc/sphinx/blob/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149/sphinx/domains/cpp/_ast.py#L4629) 已有 `_newest_id_cache`；`_ast.py` [`ASTIdentifier.__eq__`](https://github.com/sphinx-doc/sphinx/blob/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149/sphinx/domains/cpp/_ast.py#L61) 已特化并注明为性能。旧 profile 的 55.776s `direct_lookup` 不再成立，本次实测 0.495s；复用时不需要再抄一遍这两项。
- 仍未索引的是名字查找：[`_find_named_symbols`](https://github.com/sphinx-doc/sphinx/blob/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149/sphinx/domains/cpp/_symbol.py#L390) 经 [`_candidates`](https://github.com/sphinx-doc/sphinx/blob/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149/sphinx/domains/cpp/_symbol.py#L480) 逐项遍历 `_children`。C domain 的 [`_children_by_name`](https://github.com/sphinx-doc/sphinx/blob/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149/sphinx/domains/c/_symbol.py#L126)（[#12162](https://github.com/sphinx-doc/sphinx/pull/12162) 合入）是单值 dict，不能直接照搬：C++ 同一作用域有重载／特化候选，还需要匿名实体候选顺序。

### 真实负载、固定版本与命令

原 issue 的负载是 GCC 的 `gcc/doc/gccint`，但 GCC 主干已在 2022-11-14 撤除这批 Sphinx 文档（[`191dbc35`](https://github.com/gcc-mirror/gcc/commit/191dbc356882)），当前 `master` 已无 `gcc/doc/gccint`。因此固定撤除前最后提交 [`bd044dae`](https://github.com/gcc-mirror/gcc/commit/bd044dae51caea3c641f86ec5cb0ebccf7e06de7)（2022-11-10），并固定 Sphinx [`1ddf1981`](https://github.com/sphinx-doc/sphinx/commit/1ddf1981c4aac4ff72bfb4a97e05909d55c3a149)（9.3.0，BSD-2-Clause）。只取文档路径，不克隆整棵 GCC：

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/gcc-mirror/gcc.git gcc
cd gcc
git sparse-checkout set gcc/doc doc
git fetch --depth 1 origin bd044dae51caea3c641f86ec5cb0ebccf7e06de7
git checkout bd044dae51caea3c641f86ec5cb0ebccf7e06de7
python -m venv venv
venv/Scripts/python -m pip install -e <Sphinx 1ddf1981 checkout>
venv/Scripts/python -m sphinx -b texinfo -d doctrees gcc/doc/gccint output -j 1
venv/Scripts/python -m cProfile -o profile.prof -m sphinx -b texinfo -d doctrees-prof gcc/doc/gccint output-prof -j 1
```

- 环境：Windows 11、Python 3.13.5、docutils 0.23；`-j auto` 与 `-j 1` 在本负载都约 31s，配对实验统一用 `-j 1` 降低多进程噪声。
- 16 个 intersphinx inventory 在本次环境不可达；54 条 warning 包含这些网络失败、文档既有重复声明和不存在的跨手册 label，before／after 逐项相同。原 issue 的 44s／79s 来自 2022 年另一台机器和 Sphinx 5.3.0，不能与本轮绝对值比较。
- 构建后的 C++ 符号树：根作用域 1057 个子符号、全树 2655 个、无匿名符号；每次名字查找平均要扫约 683 个候选，这是线性扫描的成本来源。

### Profile 与五次成对构建

| 指标 | 固定源码 | 本地索引差量 |
|---|---|---|
| cProfile 墙钟 | 53.283s | 48.887s |
| profiler 内累计 | 46.403s | 41.867s |
| 总函数调用 | 102,274,565 | 78,259,767 |
| `_find_named_symbols` 累计 | 5.353s | 0.033s |
| `_matches` 调用 | 4,202,919 | 48 |
| `resolve_xref` 累计 | 5.112s | 0.376s |
| `direct_lookup` 累计 | 0.495s | 0.395s |

无 profiler 的五次成对构建（同一命令、每次全新 doctree）：

| 轮次 | 顺序 | baseline | 本地索引 | 差 |
|---|---|---|---|---|
| 1 | base→opt | 31.546s | 28.748s | −2.798s |
| 2 | base→opt | 30.736s | 29.580s | −1.156s |
| 3 | base→opt | 30.296s | 27.700s | −2.596s |
| 4 | opt→base | 31.452s | 28.602s | −2.850s |
| 5 | opt→base | 32.088s | 29.963s | −2.125s |
| 均值 | — | 31.224s | 28.919s | −2.305s（−7.4%） |

前三次 baseline→opt，后两次 opt→base 控制顺序偏差；五次方向一致，差值 1.2–2.9s。后两轮整体墙钟更高（机器负载漂移），不影响相对方向。profile 的函数调用开销会放大索引收益，因此以墙钟约 7.4% 为准，不写更高倍数。

### 可撤回本地差量

只改 `sphinx/domains/cpp/_symbol.py`（+96/−6）：

- 每个 `Symbol` 增加 `_children_by_ident: dict[str, list[Symbol]]`，按 `str(identOrOp)` 保存直接子符号，保持插入顺序；在 `Symbol.__init__`、`remove`、`_unconditional_add` 三处维护；旧 pickle 首次访问时按 `_children` 惰性重建。
- `_candidates` 增加 `ident_or_op` 参数：`match_self` 只在名字相等时产出；无匿名子节点时从索引取同名候选；有匿名子节点时退回原 `children_recurse_anon` 全遍历并按名字过滤，保证匿名候选与原顺序一致。
- 索引只是预过滤，候选仍交给 `_matches` 做模板参数／实参的精确比较，重载与特化选择逻辑不变。

```diff
diff --git a/sphinx/domains/cpp/_symbol.py b/sphinx/domains/cpp/_symbol.py
index 7d815c0..e6681ee 100644
--- a/sphinx/domains/cpp/_symbol.py
+++ b/sphinx/domains/cpp/_symbol.py
@@ -27,6 +27,18 @@
 logger = logging.getLogger(__name__)


+def _ident_key(identOrOp: ASTIdentifier | ASTOperator) -> str:
+    """Return a hashable key for the per-scope child index.
+
+    ``ASTIdentifier`` and the concrete ``ASTOperator`` classes are equal when
+    their fields are equal, and their string form is derived from those same
+    fields.  Equal names therefore always get the same key.  The key may be
+    coarser than equality for some AST type nodes, which is harmless: every
+    candidate is still checked by ``Symbol._matches``.
+    """
+    return str(identOrOp)
+
+
 class _DuplicateSymbolError(Exception):
     def __init__(self, symbol: Symbol, declaration: ASTDeclaration) -> None:
         assert symbol
@@ -221,15 +233,58 @@ def __init__(
         # Remember to modify Symbol.remove if modifications to the parent change.
         self._children: list[Symbol] = []
         self._anon_children: list[Symbol] = []
+        # Index of direct children keyed by their identifier/operator, used to
+        # avoid scanning every child of a scope for each symbol lookup.
+        self._children_by_ident: dict[str, list[Symbol]] = {}
+        self._anon_present = False
         # note: _children includes _anon_children
         if self.parent:
             self.parent._children.append(self)
+            self.parent._index_child(self)
         if self.declaration:
             self.declaration.symbol = self

         # Do symbol addition after self._children has been initialised.
         self._add_template_and_function_params()

+    def _child_index(self) -> dict[str, list[Symbol]]:
+        """Return the index of direct children by identifier/operator.
+
+        The index is rebuilt lazily for symbol trees loaded from a pickle
+        written before this optimization existed.
+        """
+        index = self.__dict__.get('_children_by_ident')
+        if index is None:
+            index = {}
+            for child in self._children:
+                if child.identOrOp is not None:
+                    index.setdefault(_ident_key(child.identOrOp), []).append(child)
+            self._children_by_ident = index
+        return index
+
+    def _index_child(self, child: Symbol) -> None:
+        # Build the index before appending so that old trees stay complete.
+        index = self._child_index()
+        if child.identOrOp is not None:
+            key = _ident_key(child.identOrOp)
+            children = index.setdefault(key, [])
+            if child not in children:
+                children.append(child)
+            if child.identOrOp.is_anon():
+                self._anon_present = True
+                if child not in self._anon_children:
+                    self._anon_children.append(child)
+
+    def _has_anon_children(self) -> bool:
+        anon_present = self.__dict__.get('_anon_present')
+        if anon_present is None:
+            anon_present = any(
+                child.identOrOp is not None and child.identOrOp.is_anon()
+                for child in self._children
+            )
+            self._anon_present = anon_present
+        return anon_present
+
     def __repr__(self) -> str:
         return f'<Symbol {self.to_string(indent=0)!r}>'

@@ -293,6 +348,21 @@ def remove(self) -> None:
             return
         assert self in self.parent._children
         self.parent._children.remove(self)
+        if self.identOrOp is not None:
+            key = _ident_key(self.identOrOp)
+            children = self.parent._child_index().get(key)
+            if children is not None:
+                try:
+                    children.remove(self)
+                except ValueError:
+                    pass
+                if not children:
+                    del self.parent._children_by_ident[key]
+            if self.identOrOp.is_anon():
+                try:
+                    self.parent._anon_children.remove(self)
+                except ValueError:
+                    pass
         self.parent = None

     def clear_doc(self, docname: str) -> None:
@@ -424,7 +494,9 @@ def _find_named_symbols(
                     template_args = None

         for s in self._candidates(
-            match_self=match_self, recurse_in_anon=recurse_in_anon
+            ident_or_op=ident_or_op,
+            match_self=match_self,
+            recurse_in_anon=recurse_in_anon,
         ):
             if Symbol.debug_lookup:
                 Symbol.debug_print('candidate:')
@@ -478,19 +550,36 @@ def _matches(
         return True

     def _candidates(
-        self, *, match_self: bool, recurse_in_anon: bool
+        self,
+        *,
+        ident_or_op: ASTIdentifier | ASTOperator,
+        match_self: bool,
+        recurse_in_anon: bool,
     ) -> Iterator[Symbol]:
+        key = _ident_key(ident_or_op)
         s = self
         if Symbol.debug_lookup:
             Symbol.debug_print('searching in self:')
             logger.debug(s.to_string(Symbol.debug_indent + 1), end='')
         while True:
-            if match_self:
+            # Candidates that do not have the queried name are rejected by
+            # ``_matches`` anyway, so only the matching children need to be
+            # yielded, in their original insertion order.
+            if match_self and s.identOrOp == ident_or_op:
                 yield s
-            if recurse_in_anon:
-                yield from s.children_recurse_anon
+            if recurse_in_anon and s._has_anon_children():
+                # Symbols below anonymous children can match as well, and
+                # their candidates interleave with direct children.  Keep the
+                # original traversal when such children exist to preserve the
+                # candidate order exactly.
+                for candidate in s.children_recurse_anon:
+                    if (
+                        candidate.identOrOp is not None
+                        and candidate.identOrOp == ident_or_op
+                    ):
+                        yield candidate
             else:
-                yield from s._children
+                yield from s._child_index().get(key, ())

             if s.siblingAbove is None:
                 break
@@ -986,6 +1075,7 @@ def _unconditional_add(self, other_child: Symbol) -> None:
         # TODO: hmm, should we prune by docnames?
         self._children.append(other_child)
         other_child.parent = self
+        self._index_child(other_child)
         other_child._assert_invariants()

     def add_name(
```

（临时工作区路径不入公开记录；差量文件仅作交接，不新建目录。）

### 行为验收与消费者

- `gccint.texi` 与 `Makefile` 在 baseline 和 opt 的每次运行间 SHA-256 相同，`cmp` 逐字节一致；54 条 warning 集合逐项相同。
- `tests/test_domains/test_domain_cpp.py`：固定源码 116 passed，差量 116 passed；`tests/test_domains`：差量 299 passed。
- 实际 CLI 消费者就是 issue 命令里的 `sphinx-build -b texinfo`；下游 texinfo 编译（`makeinfo`／`texi2any`）本机没有，未运行，不能声称整条 GCC 文档发布链已验证。
- 本地验证不等于上游接受；未向外发 issue／PR／评论，也未声称接管维护者任务。

### 接收、撤回与仍缺

- 可接手：固定上述两个 SHA，按命令复现；差量只放在该固定 Sphinx 树内，接收方可先跑 `tests/test_domains` 与同一 GCC 构建再比较输出。
- 撤回条件：任一引用解析目标、anchor／ID、warning、texinfo 输出或测试出现差异；匿名作用域候选顺序不能保持；索引维护漏掉新增／删除子符号；或上游／他人出现同范围有序索引实现。满足任一即撤回差量，不用基准变绿替代行为验收。
- 仍缺：`makeinfo`／下游发布链验证；其他 GCC 版本、其他项目负载与 N／2N 伸缩曲线；多机重复；上游对方向的答复。当前结论只适用于本固定历史负载。
- 未做：未安装 Go／Rust／Java，未做正式 Agent 方法 A/B，未用生成语料替代真实负载，未提交上游，未新建目录或台账。

### 执行元数据（续接）

- 实际响应字段：本续接子代理原始 assistant `message.model` 为 `deepseek-flash`；请求别名 `deepseek-v4.1-flash[1m]`，后端具体型号未另证。
- 客户端与调用：Claude Code 子代理（原生 Workflow `sphinx-continuation` 的 sole writer），2026-10-25T04:05:56Z—04:31Z（本席检查完成）；同一 Workflow 后续只有机械 delivery-check，语义审查由父级原生 reviewer 负责。
- 差量可应用性：从本记录抽取的 diff 已在固定源码的干净 clone 上通过 `git apply --check`（无需忽略空白）。
- 检查：`check_repo.py` 364 files／0 errors；`check_public.py` 625 files／0 findings；`git diff --check` 无输出；本席未 commit／push，结果分支由父级发布。未运行完整离线套件（纯文档与临时工作区代码，按 §7 只跑适用检查）。
- 交付状态：`review_ready`；本地验证与机械检查完成，新增实际采用差量待父级原生 reviewer 语义审查，不宣称审查完成或上游接受。

### 续接独立审查与最终交付核对

原独立审查者只复核本次相对 `8fafe32` 的实际采用 delta，复用未变事实：已亲读固定源码、局部索引差量、五对原始 texinfo／warning、原始命令与测试输出，未发现实质缺陷。五对均值 31.2236s→28.9186s（约7.38%）只属于这份单机固定历史真实负载；未运行 makeinfo／完整发布链、其他项目、多机或正式模型方法对照。旧 pickle 惰性重建、特定增量及并行场景没有专项前后对照，不由现有测试数外推全面通过。

实际续接原生调用 2026-10-25T04:05:39.214Z—04:40:22.046Z（UTC）正常退出；父调用与两个阶段原始响应字段均为 `deepseek-flash`，请求别名另记。原始首轮负结果、负责人纠偏、真实负载证据和代码差量均保留。15与本任务之外无仓库改动，产品代码只在任务临时工作区。

最终回传：结果分支 `relay/a-performance-route-001`，固定提交 [`4be3b33048b07e79d759c706762a5d47f32741f0`](https://github.com/dbvv1/a1dbv/commit/4be3b33048b07e79d759c706762a5d47f32741f0)。最终文档 365 文件、公开内容 626 文件、实际新增提交身份扫描与空白检查通过；独立审查和必要定向修正完成。main 仅回传原任务，正文与成果由 dot-A 在结果分支接收整合，状态 `review_ready`。

## dot-A 接收（2026-10-25）

负责人抽读实际产物和回执，接收本次交付；保留最新main回传与结果分支历史，复用有效独审及受影响检查。 15实际路径为 `docs/15-task-playbooks.md`。正文改为通用任务路线在前、真实采用在后；新增文字已作窄范围证据核对，不重复代码审查。原报告“未在本仓采用”仅指未成为生产依赖，不能否认已完成的Agent实际采用；当前热点与单机历史负载结果已接收，不扩成模型优势或上游接受，不继续性能边界矩阵。 最终集成树执行文档、公开内容、提交身份与空白检查。
