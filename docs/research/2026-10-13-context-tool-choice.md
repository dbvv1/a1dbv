主线：二，额外能力何时值得加
改变的建议：先缩小原生查询，再按缺口补能力：旧快照查刷新，语义为空查导入与依赖，原生有而封装漏查过滤与版本；定位与附加详情分开，预算省略不等于不存在，全量验收读命令侧完整报告。文档核目标版本，设计核结构／组件契约，记忆核来源／身份／事实失效；异步工具分任务终态、工具错误与业务结果，优先复用兼容 SDK。接入分工具面、凭证与输入信任；共享指令核宿主发现／导入，会话动作按问题选择，不以配置、日志或固定摘要大小替代加载与交付验收。[经验／研究]
新证据：汇总既有固定源码、官方契约、发布与测试定义[一手]，原帖及复测自报[社区]，历史数据复算[研究]与标准库局部演示[经验]；日期与反证见各节。未运行模型、上游客户端／服务或上游测试；源码及测试定义不等于执行，已修历史问题不作当前故障，语义检索链缺修后原任务验收，不推端到端收益。

# 上下文获取：问题、版本与状态边界

## 源码检索：map、语义引用与当前状态
> 核实时间：2026-10-13（UTC+8）。本次读取固定源码、测试和原帖，未运行 Aider、clangd 或模型；测试内容阅读不能冒充执行通过。**[一手：固定源码与测试；社区：失败报告；研究：采用判断]**

### 源码检索：map、语义引用与当前状态 · 1. 最具体的新反例：文件已经保存，map 仍可按设计返回旧内容

Aider API 当时 main 固定为 `5dc9490bb35f9729ef2c95d00a19ccd30c26339c`（2026-05-22）：

- [get_ranked_tags_map，L585–625](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/repomap.py#L585-L625)：map 缓存键含文件集合、预算，auto 另含提及的文件／标识符，但不含内容或 mtime；若此前生成耗时大于 1 秒，auto 可直接命中 map_cache，根本不到下层按 mtime 更新 tags 的路径。
- [test_repo_map_refresh_auto，L106–158](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/tests/basic/test_repomap.py#L106-L158)：官方测试先让生成耗时 1.1 秒，向磁盘文件追加 functionNEW，随后断言普通获取与旧 map 相等；force_refresh 后才断言出现新函数。files 模式测试也断言内容变更而文件集合不变时 map 不变（L49–100）。**这是测试内容阅读，未执行测试。**
- [cmd_map_refresh，L1426 起](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/commands.py#L1426-L1431) 已调用 force_refresh=True，不需另建索引系统。

**改变选择**：外部工具刚改过源码、map 中找不到新符号时，先刷新或直接读／搜当前文件，不通过增大 map 预算解决旧快照。不能由这个单独方法测试断言所有 Aider 交互轮次都会旧，因为调用者也可能主动强刷。**[一手：固定源码／测试；经验：建议]**

### 源码检索：map、语义引用与当前状态 · 2. repo map 给的是启发式入口，不能据此认定跨模块调用者

[同一 SHA 的 repomap.py L451–514](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/repomap.py#L451-L514) 用 tag.name 聚合 definitions/references，并对同名 referencer × definer 连边；同名定义超过五个会降权，并没有借此变成类型／作用域解析。

真实失败原帖 [Aider #2341](https://github.com/Aider-AI/aider/issues/2341)：jbellis 在编辑 Cassandra 时报告 getName 同名碰撞令不相关 FilterPipelineTask 定义排前。当前源码仍可解释“名称图不是精确符号图”这一机制，但已有降权启发式，所以不应把 2024 年的具体排名失败写成当前版已复现。该 issue 关闭且标 stale，也不能当成已修复证据。**[社区：原帖；一手：当前机制]**

**改变选择**：同名方法多、要确认某一个对象类型的调用关系时，map 仅缩小入口，转到能解析该项目的语言服务器／类型系统，而不是扩大排名上下文。

### 源码检索：map、语义引用与当前状态 · 3. LSP 能区分语义身份，但它返回的是特定状态下的结果

[clangd 官方索引设计](https://clangd.llvm.org/design/indexing)：引用按 SymbolID 查询；动态 FileIndex 覆盖正在编辑的文件；后台索引依赖编译数据库，逐源文件排队构建。这解释了相较名称图的用途，并不保证每次返回完整。

LLVM 当时 main 固定为 `f1136210323eb4cf169ea544c48fa650275a8c79`（2026-10-13）：

- [Merge.cpp L125–155](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/index/Merge.cpp#L125-L155) 对动态层已覆盖的文件丢弃静态层引用；[IndexTests.cpp L448–515](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/unittests/IndexTests.cpp#L448-L515) 专门构造旧引用，断言动态版本优先、动态删除后旧引用不复活。不能声称 clangd 普遍“没有更新机制”。
- 但 [clangd #2548](https://github.com/clangd/clangd/issues/2548) 的 Chromium 用户报告：插入空行、保存并等索引后，旧位置仍和新位置一起出现，重启才消失。报告版本为 Windows clangd 22.0.0git，配置先跳过后台索引再选择部分目录构建；作者随后明确最小项目无法复现；截至本次可见页面仍 open。故只用作真实异常提醒，不判定当前 SHA 根因或已验证修复。**[社区：原帖，未复现]**

**改变选择**：位置明显对不上当前文本，先读目标位置、核查日志／编译范围／刷新，不继续沿旧引用自动修改；反过来，文本同名命中也不是语义引用确认。

### 源码检索：map、语义引用与当前状态 · 4. 未保存缓冲不是“LSP 一定比磁盘更新”的简单关系

当前 clangd [ClangdServer.h L188–189](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.h#L188-L189) 中 UseDirtyHeaders 默认 false；[L483–485](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.h#L483-L485) 用该选项选择 DirtyFS 或底层 TFS。[ClangdServer.cpp L304–313](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.cpp#L304-L313) 则明确：当前文件使用客户端 Contents，头文件通过 getHeaderFS 读取。[CLI L508–512](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/tool/ClangdMain.cpp#L508-L512) 对应隐藏选项 use-dirty-headers。

**具体边界**：头文件里未保存的新声明，在另一个翻译单元解析时默认不一定可见；同时磁盘 grep 也看不见该未保存声明。任务若针对编辑器当前状态，应读取对应 buffer 或在用户认可的保存状态上核验，而不是在 LSP 和磁盘搜索之间盲目切换。若目标是磁盘提交版本，也不能把 buffer 引用结果直接套用到磁盘行号。**[一手：源码；经验：推导]**

### 源码检索：map、语义引用与当前状态 · 5. 字符串／动态关系：文本搜索补入口，也不是完整证明

Aider 自身就有具体例子：[commands.py L276–296](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/commands.py#L276-L296) 枚举 cmd_ 方法并将命令名替换连字符后拼成 cmd_{name}，通过 getattr 分派。[Python 官方 getattr](https://docs.python.org/3/library/functions.html#getattr) 解释按字符串取属性的运行语义。

针对命令重命名，不仅查某个 cmd_* 方法的普通调用引用，还要读该分派规则、搜索用户输入的命令字符串及文档／测试。若字符串运行时拼接，搜完整方法名也可能只看到定义；应沿构造／注册处追踪。不能写“所有 LSP 都漏所有字符串引用”，有些语言服务器可解析字面量访问；本轮未实跑任一 Python LSP，所以只断言存在动态分派契约，不能断言特定 LSP 的返回集。**[一手：源码／官方文档；经验：建议]**

### 源码检索：map、语义引用与当前状态 · 6. 客户端接入边界

补核：2026-10-13（UTC）。[Claude Code 官方 Code intelligence](https://code.claude.com/docs/en/plugins/code-intelligence) 将插件配置与服务器二进制分开：用户另行准备二进制，安装插件后验证实际诊断或查询。页面明确官方云会话不启动插件语言服务器；[Tools reference 的 LSP 行为](https://code.claude.com/docs/en/tools-reference#lsp-tool-behavior)也确认云会话不激活该工具。此处的云会话指 Claude Code 产品的 cloud sessions，不能外推为所有云机器上运行的 CLI。**[一手：官方文档]**

**改变选择**：撤回 05 的“强类型项目必装”及 Claude 起步配置中的无条件安装。日常修错先复用已有类型检查；确有语义引用或编辑后诊断缺口时，再核对当前会话、服务器启动及项目解析。Claude 的导航工具只读，不因后端是 LSP 就假定该入口能执行重命名。安装后仍不可用时先区分会话不支持与服务器／项目配置问题，不反复增装插件。**[一手：官方工具边界；经验：采用判断]**

本轮只读取官方正文，未安装或运行客户端，未测模型正确性、上下文成本或人的总投入；不形成效率收益结论。

### 源码检索：map、语义引用与当前状态 · 范围与后续价值

已取得两个原始失败报告、固定当前源码和官方测试，足以撤回无条件替代建议；无需再造模板或评估框架。下一轮若值得做，应在实际跨模块修改中验证“漏掉的是动态使用、旧状态还是配置范围”，不按 token 数推测收益。本轮未安装、未执行第三方代码、未模型付费，未验证当前 Aider／clangd 的端到端表现。

## 文档检索：版本选择与生成内容刷新
> 核实时间：2026-10-13（UTC+8）。本次只读公开源码、测试及原帖，未运行客户端、真实查询或模型。**[一手：固定源码与测试；社区：原帖；经验：采用判断]**

**🧪 维持按需试用。** 缺少实际版本时，不把近邻版本当成已核实兼容；回目标版本官方文档或源码确认关键行为。返回片段还须分清真实项目原文与生成摘要，普通刷新不能自动证明所有内容层都已重建。

### 文档检索：版本选择与生成内容刷新 · 固定研究对象

GitHub API 在本轮返回 master 为 [`33414e6e3fc157c936348ca8ddba25e50dacaeee`](https://github.com/upstash/context7/commit/33414e6e3fc157c936348ca8ddba25e50dacaeee)，提交时间 2026-10-12 21:51:03（UTC+8）。该提交的 package.json 分别标记 [MCP 4.3.0](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/package.json)、[ctx7 CLI 0.6.0](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/package.json)。这是固定主分支快照的包版本，不声称 npm 发布物逐字相同。**[一手：固定源码]**

### 文档检索：版本选择与生成内容刷新 · 从输入到返回的实际边界

1. **resolve 不解析项目依赖。** [MCP 工具 schema/说明](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/index.ts#L220-L287) 接收 `libraryName` 和用于相关性排序的 `query`，提示 Agent 从 Versions 中选择 `/org/project/version`。该查询链没有 lockfile 输入、读取项目版本或比较 semver 的步骤。把版本写在自然语言 query 中只是检索信息，不是独立的版本约束字段。**[一手：源码；推断限于所读公开查询链]**

2. **query-docs 的版本选择在 libraryId 字符串中。** [ContextRequest](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/lib/types.ts) 只有 `query`、`libraryId`、可选 `language`；[API 实现 L185–225](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/lib/api.ts#L185-L225) 把它们发给 `/v2/context`，不核实 ID 所指版本等于项目版本。`language` 是例子排序提示，不是版本选择器。**[一手：源码]**

3. **Skill 的宽松退路正是项目级使用需要覆盖的地方。** [find-docs L51、L90–104](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/skills/find-docs/SKILL.md#L90-L104) 要求查 ID，并建议选择用户所需版本的 closest match；3 次查询仍不满足则用手头 best result。其配额错误段要求披露失败后可用训练知识作答。这是对 Agent 的指令，不是客户端保证；源码没有自动选择最近 semver 的算法，也没有验证“最近”是否兼容。**[一手：Skill/源码；经验：不接受其作为版本承诺]**

4. **客户端不会自动把缺失版本降级成最新版。** 所读 MCP 实现遇非 2xx 返回 error，空字符串返回 not_found，非空文本返回 success；没有去掉版本段重试的代码。MCP 工具层只在 `outcome === "error"` 时设置 `isError: true`，not_found 不属于协议错误，所以 `isError=false` 不表示找到有效文档，更不表示版本正确。[工具返回](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/index.ts#L365-L390)。后端未开源，不能从这个结论外推后端永不重定向或回退。**[一手：公开客户端实现]**

5. **CLI 同样是传参/呈现层。** [docs.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/commands/docs.ts#L108-L187) 检查 ID 大体格式，经 `recoverLibraryId` 修正 Git Bash 路径，再传给 API。字符串响应直接打印；有 redirectUrl 的错误提示新 ID、设置失败退出码，没有自己重新查询该 ID。零片段只警告并返回，不能只用进程成功判断命中。[getLibraryContext](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/utils/api.ts) 也没有依赖版本验证。**[一手：源码]**

### 文档检索：版本选择与生成内容刷新 · 测试究竟证明什么

- [library-id.test.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/__tests__/library-id.test.ts) 明确测试 `/vercel/next.js/v15.1.8` 不被改写、Windows 路径恢复保留版本段，能证明设计意图是保留字符串；不能证明服务器存在该索引或该版本片段正确。**[一手：测试源码，未运行]**
- [MCP integration.test.ts L150–159、L520–551](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/test/integration.test.ts#L520-L551) 使用本地 stub API；断言转发 `/vercel/next.js` 和 query，并原样得到 `STUB_DOCS`，错误场景返回 `isError=true`。测试名含 end to end 不等于真实文档后端或特定版本正确性验证。**[一手：测试源码，未运行]**
- [find-docs-skill-alignment.test.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/__tests__/find-docs-skill-alignment.test.ts) 检查调用风格、库名与安装建议顺序；没有验证 closest match 的兼容性。**[一手：测试源码，未运行]**
- [SDK GetContextCommand](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/sdk/src/commands/get-context/index.ts) 及其 [测试](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/sdk/src/commands/get-context/index.test.ts) 将返回 code/info snippets 映射成文档，或原样返回文本；测试用 fixture。其公开片段类型没有强制 resolvedVersion 字段，不可据此宣称所有后端响应都没有版本信息。**[一手：源码/类型与测试，未运行]**

### 文档检索：版本选择与生成内容刷新 · 社区原帖：支持、反证与已解决状态

#### 文档检索：版本选择与生成内容刷新 · #3309：默认值实质不匹配，且刷新未覆盖生成内容

[原帖](https://github.com/upstash/context7/issues/3309) 由 react-broadcast-sync 维护者于 2026-10-03 提交：索引中的 `_autodocs/types.md` 片段仍说 telemetry 默认 true，而 2.0.0 起已 opt-in，默认关闭；多次 Refresh 后普通 README 已变，片段未变。**[社区：具体报告，未复现]**

[Context7 维护者 10月6日回复](https://github.com/upstash/context7/issues/3309#issuecomment-6012188572) 纠正了报告者的一点前提：那不是仓库中被删除的文件，而是 Context7 生成的文档页，生成于默认值变化前几分钟；这种页当时按月重建，因此普通 Refresh 没更新。回复说已从 main 重建，现已正确显示默认关闭，issue 当日以 completed 关闭。**[社区：维护者解释与处理结果]**

可采用结论：看到 SOURCE 样式链接或刷新时间，不足以确认片段来自当前真实仓库文件/目标版本；关键默认值仍应看真实版本源码。不可采用结论：所有 Context7 文档都按月刷新；Context7 当前仍返回这个错片段；固定版本 ID 一定能消除生成文档风险。**[经验：证据边界]**

#### 文档检索：版本选择与生成内容刷新 · #2772：Versions 列表与最新内容不能混为一谈

[原帖](https://github.com/upstash/context7/issues/2772) 2026-06-16 提供了 Agent 工具调用记录：把 `/ant-design/ant-design` 搜索结果中最高列出的 5.26.2 称为最新发布，报告者指出应是 6.4.4。**[社区：具体调用记录，未复现]**

[维护者回复](https://github.com/upstash/context7/issues/2772#issuecomment-4716597579) 说明当时无版本 ID 的索引已刷新、实际内容对应 6.4.4；Versions 提供的是额外旧标签，不一定枚举最新版本。issue 当日关闭。**因此这是 Agent 解释元数据错误的强例，不是证实 query-docs 返回旧片段的证据。** 回复里使用过 `@版本` 写法，当前固定 Skill/schema 采用 `/org/project/version`；不要把历史回复的语法当成当前推荐命令。**[社区：原帖及维护者反证；一手：当前 schema]**

#### 文档检索：版本选择与生成内容刷新 · #236：精确标签覆盖缺口，保留但不再重复扩写

既有正文已引用 [#236](https://github.com/upstash/context7/issues/236)，本轮读完回复补上结论：维护者在 [2025年5月确认标签尚未索引](https://github.com/upstash/context7/issues/236#issuecomment-2915567105)，并在 [6月20日说明可自行解析 tag/release](https://github.com/upstash/context7/issues/236#issuecomment-2991422342)，随后关闭。它支持“可拼出的版本 ID 不等于已有覆盖”，不能支持今天该标签仍缺失，也不值得另增正文。**[社区：历史单例]**

### 文档检索：版本选择与生成内容刷新 · 验证范围

本次已读固定查询链、相关测试和三帖回复，未安装或运行客户端、真实查询、目标库编译或模型。不能据源码阅读声称后端当前响应已复现。上述证据支持收紧采用行为，不支持断言全部内容不可靠，也不能把已修复历史问题当成当前故障。

## 工具接口：先缩小原生查询，再判断是否补接口

> 核实：2026-10-14（UTC）。主线二；改变 04 §2 的通用成本排名与“CLI 必配 Skill”；新证据是公开历史运行数据的只读复算和作者给出的具体轨迹摘录，未安装、运行上游程序或调用模型。

### 固定来源与干预边界

- **O1**：[论文 v1](https://arxiv.org/html/2607.10569v1)，2026-07-12。比较 Claude Code / Sonnet 4.6 与 Codex CLI / GPT-5.5 的原生、受限 shell、单一 `execute_code` 工具面；不是保持原生工具不变、仅加一个 MCP 的实验。Codex 限制由提示词实施，不能视为权限隔离。[研究：作者历史实验]
- **O2**：[公开逐次 CSV](https://github.com/hyang0129/onlycodes/blob/7548222e5f33b4e760b3cbeb193e5403f8e2e6cc/paper/data/raw/all_results.csv)，固定仓库 SHA `7548222e5f33b4e760b3cbeb193e5403f8e2e6cc`，内容 blob `04d9e998cf695ff3e8e260b0a394d467e127bfa4`。本节只复算其中 Codex SWE-bench 的 100 题、每臂 3 次；这些行记录 `codex-cli 0.130.0`，不是当前客户端表现。[一手：公开数据]
- **O3**：[作者轨迹摘录](https://github.com/hyang0129/onlycodes/blob/7548222e5f33b4e760b3cbeb193e5403f8e2e6cc/paper/investigations/concrete_examples_h1_h2.md)，blob `04008109f5e056e11f5438296af8489c12f012b4`。本轮读到的是带命令的摘录，未取得并独立重放完整模型轨迹。[一手：作者摘录]
- **O4**：[统计脚本](https://github.com/hyang0129/onlycodes/blob/7548222e5f33b4e760b3cbeb193e5403f8e2e6cc/paper/data/scripts/paired_contrasts.py)先按任务跨 seed 求均值，排除 `env_fail`；本轮未执行该第三方脚本。论文成本作缓存调整，并非用户账单或额度；未显著发现通过率差异也不是等价检验。[一手：源码；研究：解释]

### 已复算：同目标的成本与等待并不一起改善

本轮用 Python 标准库读取 O2，逐臂确认 300 行、100 个任务、300 个不同 `(instance_id, seed)`；所选行没有 `env_fail`。三次运行均等权，因此累计成本比与先按任务求均值再比较的成本比相同。[研究：本轮数据复算]

| Codex SWE-bench 臂 | PASS / 运行 | `cost_usd` 合计 | `cost_usd_adjusted` 合计 | `wall_secs` 合计 |
|---|---:|---:|---:|---:|
| baseline | 139 / 300 | 200.762607 | 193.352943 | 35,908 |
| bash_only | 136 / 300 | 210.302009 | 202.696505 | 39,811 |
| onlycode | 140 / 300 | 164.927510 | 154.859030 | 36,489 |

只读算术：`154.859030 / 193.352943 - 1 = -19.91%`；`36489 / 35908 - 1 = +1.62%`。少工具的 `bash_only` 调整成本却比 baseline 高 4.83%。这确认此历史数据里的成本差，不能证明人的主动投入减少，也不能把累计任务用时当实际并行 campaign 的完成时间。[研究：本轮复算]

复算方式：从 O2 下载 CSV 到自己的工作目录后，执行以下标准库代码；不调用模型、不执行上游代码。没有拿到 CSV 时不要把这段说明当作已运行结果。

```bash
python3 - all_results.csv <<'PY'
import collections, csv, sys
rows = list(csv.DictReader(open(sys.argv[1], newline='')))
reference_keys = None
for arm in ('baseline', 'bash_only', 'onlycode'):
  r = [x for x in rows if x['benchmark'] == 'swebench'
       and x['agent'] == 'codex' and x['arm'] == arm]
  assert len(r) == 300 and not any(x['verdict'] == 'env_fail' for x in r)
  counts = collections.Counter(x['instance_id'] for x in r)
  assert len(counts) == 100 and set(counts.values()) == {3}
  keys = {(x['instance_id'], x['seed']) for x in r}
  assert len(keys) == 300
  if reference_keys is None:
    reference_keys = keys
  assert keys == reference_keys
  print(arm, sum(x['verdict'] == 'PASS' for x in r),
        *(round(sum(float(x[k]) for x in r), 6)
          for k in ('cost_usd', 'cost_usd_adjusted', 'wall_secs')))
PY
```

**缺失值与统计口径**：Claude `onlycode` 的 300 行中只有 299 个数值成本（`sphinx-doc__sphinx-9229` seed 2 缺失）；按 O4 先对每题的可用 seed 求均值、再平均任务，得到 0.58603623525，与 `paired_contrasts.csv` 一致；直接平均 299 行得到 0.5686354765886288。差异来自权重与缺失值处理，不能据此判断数据过期。上表 Codex 每题均有三次完整记录；本轮只复算该子集，不声称重现整篇统计推断或重新运行模型。[研究：本轮独立复算]

### 具体任务给出的更窄选择

O3 的 `django__django-11848` seed 1，两臂均 PASS。原生调用把符号与年份等多个词 OR 到一次 `rg` 中，命中无关 fixture 数据后截断；代码接口臂只搜 `parse_http_date`。O2 对应记录的输入 token 为 454,946 对 108,245，等待 78 对 50 秒。这是一个具体有利结果，但查询内容同时变化；原生 shell 本来也能只搜符号，不能据此证明必须增加代码接口。[一手：O2/O3；研究：因果边界]

Sphinx 摘录中三次原生读取与一次脚本读取也不是逐字相同的查询：文件范围与符号定位不同。它展示可组合方式，不能隔离“少两次工具调用”的独立效果。作者选择这些案例来解释总体差异，并非随机抽取的全部任务。[一手：O3；研究：解释]

**采用判断**：先在已有授权工具里缩小查询、分块返回、合并独立读取；仍有重复高开销，才试用一个窄批处理接口，并比较任务成功、计价成本、等待与人的投入。已有原生路径达到要求就不加 Skill；新接口只是搬走同样的操作，或成本下降却更慢／更难恢复时，按实际目标撤回。工具可用范围、凭证隔离与沙箱不因价格比较放宽。[经验：本仓库建议]

**未采用的候选**：[WebDev-Skills-Bench](https://arxiv.org/html/2608.23067v1)的按钮命名重试与空元素可见性案例能提出假设，但主要对应测试定位器；其每次强制注入、近似等字节的无关 Skill 对照也不等于原生按需加载。匿名工件页本轮未取得文件，故不以该例推出当前 Skill 的净收益或建议改变产品文案。[研究：论文阅读边界]


## 工具输出：显示裁剪与采集丢失

> 核实时间：2026-10-14（UTC）。新证据为官方固定修复、回归源码与自写 Python 标准库演示；未运行上游 Rust 测试、Codex 客户端或模型，不推断当前发行版行为。**[一手；经验：局部演示]**

**改变 04 的建议**：定位符号时，原生查询缩小范围通常已足够；需要判断全部记录或验收结果时，则在命令执行侧保存完整报告、保留原退出码，再用原生解析器提取字段。返回给模型的首尾不是完整报告，提高显示预算不能恢复采集阶段已丢内容。若没有完整报告且重跑会重复写入、发布或扣费，先查任务的权威状态和已有产物，不为补日志自动重跑；不因此推荐额外 Skill 或 MCP。**[研究：采用判断]**

### 固定来源与修复范围

- **已合并的 unified exec 修复**：[PR #32150](https://github.com/openai/codex/pull/32150) 于 2026-07-10 合并，固定 SHA `6138909d6ec58b2fbe635ef973e02caecad5a5aa`。它将多次 drain 的收集器改为有界 head/tail 缓冲，并传递遗漏数量；修的是无界累积及遗漏信息丢失，不是让所有输出无损。修复没有给 legacy shell 同步更换采集器。**[一手：补丁]**
- [buffer 回归 L47–63](https://github.com/openai/codex/blob/6138909d6ec58b2fbe635ef973e02caecad5a5aa/codex-rs/core/src/unified_exec/head_tail_buffer_tests.rs#L47-L63)断言 12 字节仅保留 10 字节，drain 后仍有 `omitted=2`、`total=12`；[collector 回归 L238–324](https://github.com/openai/codex/blob/6138909d6ec58b2fbe635ef973e02caecad5a5aa/codex-rs/core/src/unified_exec/process_manager_tests.rs#L238-L324)覆盖反复 drain 仍有界、已有遗漏元数据不丢。它们定义修复应保留的性质，阅读断言不等于本轮执行通过。**[一手：测试源码]**
- [输出回归 L2883–2981](https://github.com/openai/codex/blob/6138909d6ec58b2fbe635ef973e02caecad5a5aa/codex-rs/core/tests/suite/unified_exec.rs#L2883-L2981)使用 mock 模型响应及进程输出夹具，断言 `HEAD`、`TAIL`、遗漏标记和观察总大小；它明确含 Windows、无网络、沙箱跳过条件。本轮未运行，也未核实该测试在 CI 的实际结果，不能把 PR 已合并写成各平台已验证。**[一手：测试源码；研究：证据边界]**
- **另一条历史 legacy shell 路径**：固定 SHA `a6645b6b8a656360fa16fb7e1c6721d0697d3d6a` 的 [append_capped L835–843](https://github.com/openai/codex/blob/a6645b6b8a656360fa16fb7e1c6721d0697d3d6a/codex-rs/core/src/exec.rs#L835-L843)只留前缀；[read_output L1141–1153](https://github.com/openai/codex/blob/a6645b6b8a656360fa16fb7e1c6721d0697d3d6a/codex-rs/core/src/exec.rs#L1141-L1153)继续读到 EOF，但不把超出上限的字节加进返回缓冲；[formatter L77–101](https://github.com/openai/codex/blob/a6645b6b8a656360fa16fb7e1c6721d0697d3d6a/codex-rs/core/src/tools/mod.rs#L77-L101)再裁剪已采集内容。因此该路径的显示尾部可能只是采集前缀的末尾，而非进程真实 EOF。此结论只对应固定历史源码，不据此声称十月发行版或当前会话仍有同一缺陷。**[一手：固定源码；研究：机制推论]**

### 标准库最小演示与反证

以下自写演示在本轮离线执行通过，只模拟两种采集方式的信息边界，不执行上游程序，也不模拟模型决策。`cap` 是演示参数，不是当前客户端能力探针。**[经验：局部演示]**

```python
cap = 1024 * 1024
prefix = b'x' * cap
streams = [prefix + b'\nFINAL=PASS\n', prefix + b'\nFINAL=FAIL\n']
def headtail(data):
  return data if len(data) <= cap else data[:cap // 2] + data[-cap // 2:]
assert streams[0][:cap] == streams[1][:cap]                 # 不同终态，同一前缀
assert [headtail(x).splitlines()[-1] for x in streams] == [b'FINAL=PASS', b'FINAL=FAIL']
a = b'H' * cap + b'\nFAIL test_middle\n' + b'T' * cap
b = b'H' * cap + b'\nPASS test_middle\n' + b'T' * cap
assert headtail(a) == headtail(b) and b'FAIL' not in headtail(a)
assert b'FAIL' in a and b'FAIL' not in b                    # 全文才能区分
print('4 assertions passed')
```

输出：`4 assertions passed`。反证尤其重要：保住首尾也不保证中间没有失败；官方修复改善可观察性，不能替代完整报告中的业务判据。只有所需字段已经完整、可核对地返回时，才无需再读全文；本轮未测模型成功率、等待时间或额外工具净收益。**[经验：局部演示；研究：采用边界]**


## 设计上下文：结构输入与组件契约

> 核实：2026-10-15（UTC+8；读取发生于 10-14 UTC）。主线二；改变 04 原空白 Figma 推荐：从“设计稿转代码”改为按缺失信息试用，并给出退出条件。仅阅读公开文档、固定类型声明、问题及维护者回复；没有账户访问、插件安装、设计调用、模型对照或付费测试。**[一手／社区；经验：采用判断]**

### 设计输入改变哪项选择

截图能交代外观；现有组件示例／源码能交代实现契约，二者已够用时不新增连接。若尚缺布局结构、变量身份或组件对应关系，Figma 的结构输入才有增量；官方明确服务端提供上下文，最终代码与设计系统适配仍由 Agent 完成，而非自动交付成品。[MCP 与 Agent 分工](https://developers.figma.com/docs/figma-mcp-server/mcp-vs-agent/) **[一手；经验：基线选择]**

[Code Connect 集成](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/)区分 UI 与 CLI：UI 路径／名称关联不等于完整的属性映射；CLI 可提供人为定义的用法片段及属性对应。反复需要将设计的 Size／状态翻译为代码 props 时，维护显式映射比只给颜色和尺寸更直接，但并未证明模型净收益。组件 API 变化后须同步映射。**[一手；经验：选择]**

### 当前维护路径与可核查例子

- [Writing template files](https://developers.figma.com/docs/code-connect/template-files/)的示例显式把 Size 的 Small／Medium／Large 映射到 sm／md／lg，并单独读取 Disabled；这解决的是语义对应，而非截图相似度。嵌套子组件需要自己的关联；slot 的 connectedInstances 只含直接、已连接实例，不含普通文本／图层及更深层实例，不能把返回当完整子树。**[一手：文档示例]**
- [旧 React 指南](https://developers.figma.com/docs/code-connect/react/)已警告框架专用 parsers 不再更新／支持，template files 是当前维护路径。新建议不再复制旧 `.figma.tsx` 接入教程。**[一手：动态契约]**
- 固定仓库 `figma/code-connect` 于 `1f75978328b9c3609565f31c4bc7d5d353976f77`（提交时间 2026-10-14T18:12:35Z）；[cli/package.json](https://github.com/figma/code-connect/blob/1f75978328b9c3609565f31c4bc7d5d353976f77/cli/package.json)声明版本 2.0.2。[cli/figma-types.d.ts L36–38](https://github.com/figma/code-connect/blob/1f75978328b9c3609565f31c4bc7d5d353976f77/cli/figma-types.d.ts#L36-L38)也把 SlotResult.connectedInstances 标为 shallow；[L119–140](https://github.com/figma/code-connect/blob/1f75978328b9c3609565f31c4bc7d5d353976f77/cli/figma-types.d.ts#L119-L140)区分 slot、嵌套检索与模板返回。只核声明，不据此声称已执行服务端或验证全部运行语义；仓库版本也不是远端服务版本。**[一手：固定声明]**

### 独立维护反馈与反证

- [Carbon #17607](https://github.com/carbon-design-system/carbon/issues/17607)由该设计系统维护者记录实际接入差异：同一 Figma 菜单项依上下文对应两个 React 组件、单项与整组的 skeleton／props 层级不同。该 2024 年起的清单含划除的已修项，不能把整页当当前缺陷清单；它支持“映射需维护语义差异”，不支持整个产品无效。**[社区：独立项目原帖]**
- [Code Connect #397](https://github.com/figma/code-connect/issues/397)报告 1.4.4 的嵌套 variant 多余 imports。Figma 维护者 2026-06-02 建议改用 templates；06-04 确认模板与真实代码解耦，组件 prop 改名不会由模板类型检查捕获，并提及 preview。06-06 关闭不是 parser 缺陷已修证明。结论是模板可减少表达限制，却仍须按当前源码核查片段；不把 preview 当应用编译或交互通过。**[社区：用户报告；一手：维护者说明，未复现旧版]**
- [Code Connect #407](https://github.com/figma/code-connect/issues/407)，2026-08-17 用户报告空 map 可能来自库／设计文件范围混淆或大节点查询超时，而非确实没有映射；本次可见状态 open。仅作为单例提醒，未验证全部客户端。不要因空结果自动重造组件；先查范围与实际组件来源。**[社区：原帖，未复现]**

### 接入限制与撤回

1. [大 frame 官方说明](https://developers.figma.com/docs/figma-mcp-server/avoid-large-frames/)承认慢、错误及不完整返回；只取目标区域，不能靠扩大上下文保证完整。**[一手]**
2. [当前访问规则](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/)按 seat／plan 限流且限制支持的客户端；还要求对文件已有权限。此为服务契约，不代表任一读者账户已具备访问。为避免把易变配额写成承诺，实际选择前重查该页。**[一手]**
3. [Code Connect 当前 Help](https://help.figma.com/hc/en-us/articles/23920389749655-Code-Connect)列 Professional／Organization／Government／Enterprise、Full 或 Dev seat；Professional 限一个 active library 和 framework，停用的连接不会返回给 MCP。MCP 可用与 Code Connect 可用须分别判断，不能沿用旧的 Org／Enterprise-only 概括。**[一手：动态事实]**
4. [平台输出说明](https://developers.figma.com/docs/figma-mcp-server/server-returning-web-code/)指出类 React 输出是设计上下文，不代表项目必须改用 React；多框架关联时，桌面端取 Dev Mode 当前选择，远端的设计上下文请求需使用准确的映射 label。连接故障或错框架先查对应上下文，不添加另一套组件实现。**[一手；经验：排查选择]**

**保留／退出判断**：选一个已有组件的实际任务，确认连接是否补齐原先缺失的 token、结构或属性对应；若仍只返回通用布局、映射与当前 API 不符，或维护成本超过少做的查找，就缩减到少数常用组件或退出，回到当前源码／示例。运行后的视觉、键盘、状态与保存验收仍按 [23](../23-browser-verification.md)进行。以上是待实际任务检验的工程判断，没有声称更快、更准确或省 token；当前阶段不执行对照实验。**[经验：采用与撤回条件]**


## 跨会话记忆：追加观察与事实失效

> 核实：2026-10-15（UTC+8；读取于 10-14 UTC）。主线二；将 04 的“方案太多、质量不一”改成具体采用／撤回条件。只读公开固定源码和文档，无安装、模型调用、服务端实验或私人记录访问。**[一手；经验：工程判断]**

### 基线与真正需要新增的能力

[20 §4](../20-codex-long-horizon.md#4-恢复包必须包含最新任务而非最长历史)已经要求保留最新目标、被取代要求、版本和下一安全动作；03 §4.4 已要求来源、范围、失效条件和派生物删除检查。本轮不再新增一套恢复清单。已知项目和记录位置时，直接读取当前记录足以解决续接；有多个历史任务、需要按对象／时间找回未知位置的相关经验，才存在额外检索能力缺口。区别不在 Markdown 或数据库，而在如何查到、更新和撤销事实。**[经验：采用边界]**

### M1：官方 reference memory 是追加图，不是当前决定寄存器

固定 `modelcontextprotocol/servers` SHA `bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c`：

- [数据结构 L89–104](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L89-L104)只有实体 name／entityType／observations 与关系端点／类型；没有结构化来源、项目范围、有效期或替代版本字段。可以人为编码进文字或命名，但不能据 schema 声称已自动维护。**[一手：固定源码]**
- [创建与追加 L517–585](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L517-L585)：createEntities 以 name 跳过既有实体；addObservations 对现有字符串作 includes 去重后 push。具体反例是同一实体先存“使用 A”、后存“改用 B”：两条不同字符串均保留，不产生 supersedes 关系；以相同 name 为另一个项目创建对象也被跳过。此为源码机制推论，不是实际模型失败率。**[一手；研究：反例推导]**
- [删除 L587–646](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L587-L646)按完整 observation 字符串删除，删实体同时删相连关系；[查询 L655–684](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L655-L684)是 name／类型／观察的小写子串匹配，返回匹配实体，未筛选当前有效观察。不能把它描述为语义召回或自动清理矛盾事实。**[一手：固定源码]**
- 反证：[每次变更的锁及保存链](https://github.com/modelcontextprotocol/servers/blob/bbb701e7ac1e57f3edd1c2836b94c5457eaf7b9c/src/memory/index.ts#L436-L529)有锁和临时文件替换，不能沿用旧版印象声称当前实现“完全没有并发／落盘保护”；存储保护仍不等于语义冲突裁决。**[一手；研究：限定]**

因此，如果需要的只是“本任务现在采用什么决定”，增加这个服务并不能消除人工维护最新状态的责任；已有版本记录可直接读取时不加。需要明确的实体／关系查询且能自行维护名称范围和来源文字时，才把它作为窄存储候选，而非泛化的自动长期记忆。**[经验：选择]**

### M2：Graphiti 增加时间与来源，但冲突和删除仍有契约边界

固定 `getzep/graphiti` SHA `5126eae0c7659ef521a043b04084506018c9cfcc`，与 M1 为不同作者／实现：

- [MCP 文档](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/mcp_server/README.md#available-tools)提供 group_id、episode 来源追溯、valid_at／invalid_at 筛选和 episode 删除；FalkorDB 按 group 分图，读取／删除需使用原 group。分组可用于范围区分，不能直接当成认证授权隔离保证。README 明标实验性，列出图数据库、LLM 和 embedding 提供方；这些运行与维护成本应纳入选择，不因本地部署就假定无需模型／索引资源。**[一手：文档]**
- [写入 L403–533](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/mcp_server/src/graphiti_mcp_server.py#L403-L533)将 add_memory 送队列，返回 queued；reference_time 表示事件发生时间，省略时用当前时间。排队成功不代表事实已提取或可检索；晚录入旧决定时须保留原发生时间，不以到达次序冒充事实新旧。**[一手；经验：采用判断]**
- [冲突解析 L940–1035](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/graphiti_core/utils/maintenance/edge_operations.py#L940-L1035)以完全相同端点和规范化事实文本作快速去重，否则向模型请求重复／矛盾候选；[时态处理 L715–783](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/graphiti_core/utils/maintenance/edge_operations.py#L715-L783)再按有效时间裁决失效。它比 M1 多了事实演化机制，但候选识别、实体解析和时间输入都可能影响结果；不能声称自动判定真相。**[一手；研究：机制边界]**
- **删除反例来自文档与实现差异**：[MCP delete_episode L729–755](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/mcp_server/src/graphiti_mcp_server.py#L729-L755)说明保留其他 episode 支持的事实，调用客户端 remove_episode；同一提交的 [core remove_episode L2164–2192](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/graphiti_core/graphiti.py#L2164-L2192)却以 edge.episodes[0] 等于被删 episode 作为删边条件，没有要求只剩一个 episode；上述去重路径又会给同一边追加后续 episode UUID。因此“第一条来源 + 后续重复支持”的边，按此源码删除第一来源时仍会被选中删除。节点另按提及次数判断，不能把节点条件套到边。此为同仓库静态契约差异；[MCP 依赖声明](https://github.com/getzep/graphiti/blob/5126eae0c7659ef521a043b04084506018c9cfcc/mcp_server/pyproject.toml)使用 `graphiti-core[falkordb]>=0.30.2`，不固定为这份源码，因此尚不能确认任一已安装 MCP 的实际行为。未运行数据库验证，不作为已复现生产故障或所有版本／托管服务结论。**[一手；研究：反例推导]**

这改变采用选择：需要多来源保留／撤销语义时，不能只看“支持 provenance 和 delete”就接入；先确认目标版本如何删除共享事实、是否重算衍生摘要，以及结果是否满足任务要求。时间字段和检索能力可能有增量，维护它们却未必比直接查版本化决定更便宜。**[经验：选择]**

### 保留与撤回条件

先明确一类现有记录难以定位的跨会话问题，再选实现；事实必须能回到来源，身份范围可区分，旧决定能被标记取代或从当前查询排除。若出现反复召回失效决定、同名串项目、删除／更正不能保持所需语义，或模型提取、索引、后端和人工纠正负担超过节省的查找，就缩小范围或退回直接可读记录。当前任务的授权、验收与外部操作状态仍查权威来源。**[经验：采用／撤回建议]**

本轮仅建立静态机制差异与可核查反例，没有比较模型完成率、长期召回效果、成本或当前服务端行为。03 的生命周期原则与 20 的恢复清单保留；04 增加条件入口足够，不新建记忆平台教程、模板或实验。**[研究：范围]**


## 异步工具：任务终态与业务结果

> 核实：2026-10-15（UTC+8）。主线二；改变 04 的异步工具接入验收，20 的对账原则不重复扩写。只读固定公开源码、协议与测试定义，未安装 SDK、运行模型／服务或执行上游测试。**[一手；研究：范围]**

### 具体缺口与采用判断

04 原有“先核客户端／SDK／服务端版本”没有给出会改变接入判断的状态反例：宿主只等 `completed`，或把 SDK 正常返回当工具成功，会漏掉合法的工具错误。先复用已有 SDK 的任务生命周期支持，再检查解包后的工具结果与业务状态；不是所有 MCP 服务都需要后台任务，也不是加一个 Tasks 包就能补齐服务自己的作业查询。**[研究：失败链推导；经验：采用判断]**

### 固定来源与实现链

| 来源 | 固定版本与观察 | 证明范围 |
|---|---|---|
| MCP Tasks 扩展 | [规范 2026-07-28](https://github.com/modelcontextprotocol/ext-tasks/blob/899c1bbc869567670093face3591b39c28ce3219/specification/2026-07-28/tasks.md#capability-negotiation)；`899c1bbc869567670093face3591b39c28ce3219` | 客户端在每次请求声明扩展能力；服务端决定返回直接结果或任务句柄，没有声明不能返回任务。并非所有 MCP 服务默认启用 |
| TypeScript 扩展客户端 | 同提交 [package.json](https://github.com/modelcontextprotocol/ext-tasks/blob/899c1bbc869567670093face3591b39c28ce3219/packages/ext-tasks/package.json) 声明 `@modelcontextprotocol/ext-tasks` 0.2.2；[api.ts L363–370](https://github.com/modelcontextprotocol/ext-tasks/blob/899c1bbc869567670093face3591b39c28ce3219/packages/ext-tasks/src/client/api.ts#L363-L370) | `resultFromTaskOutcome` 对 completed 原样返回 result；failed 抛 error，cancelled 抛取消错误。它不检查 result.isError |
| C# 新实现 | `00adf5489910388749686bee2a6a32ae1b149ba6`；[版本声明](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/src/Directory.Build.props)为 2.2.0；[后台包装 L245–307](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/src/ModelContextProtocol.Extensions.Tasks/Server/McpTasksBuilderExtensions.cs#L245-L307) | 普通结果序列化后 SetCompleted；非协议异常也可包装成 IsError=true 并 SetCompleted。版本号是所读源码声明，不是本地安装或发行验证 |
| C# 客户端 | 同提交 [轮询 L252–279](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/src/ModelContextProtocol.Extensions.Tasks/Client/McpTasksClientExtensions.cs#L252-L279) | CompletedTaskResult 反序列化成 CallToolResult 直接返回；failed／cancelled 另抛异常，因此只捕获异常仍会漏掉工具错误 |
| C# 官方回归定义 | 同提交 [McpTaskStoreTests L627–653](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/tests/ModelContextProtocol.Tests/Server/McpTaskStoreTests.cs#L627-L653) | `ToolReturnsCallToolResultWithIsError_AsTask_StoresAsCompleted_NotFailed` 同时断言 Completed 和结果 isError=true；这里阅读测试，未运行 |
| 旧版反例 | C# v1.4.1，`2b7fd35fbe58dfb9f00eae8b3393e1a7361b5e01`；[McpTaskStatus L60–68](https://github.com/modelcontextprotocol/csharp-sdk/blob/2b7fd35fbe58dfb9f00eae8b3393e1a7361b5e01/src/ModelContextProtocol.Core/Protocol/McpTaskStatus.cs#L60-L68) | 旧实验性 Tasks 将 isError=true 列入 Failed；这是版本化定义反例，不声称旧实现有缺陷或所有客户端已迁移 |

上述均为**[一手：固定规范／源码／测试定义]**。新版规范的 [Task Execution Errors](https://github.com/modelcontextprotocol/ext-tasks/blob/899c1bbc869567670093face3591b39c28ce3219/specification/2026-07-28/tasks.md#task-execution-errors)明确：JSON-RPC 错误用 failed，普通工具结果即使 isError=true 也用 completed。C# 的[迁移说明](https://github.com/modelcontextprotocol/csharp-sdk/blob/00adf5489910388749686bee2a6a32ae1b149ba6/docs/concepts/tasks/tasks.md)区分 v2 扩展与 v1.3／v1.4 实验协议；不能用旧版状态分支直接解释新版响应。

### 反例、选择与未证事项

- **不是 SDK 吞错。** SDK 按协议保留工具结果，宿主必须读它；将 completed 一律判成功才是本例的错误接法。正常直接返回也要检查同一工具结果，不能只修异步分支。**[研究：实现推论]**
- **不是工具无错误就证明外部任务完成。** 前文 Graphiti 固定实现的 add_memory 返回 queued，已说明工具可能只负责提交；即使外层没有 isError，事实提取和检索可见性仍是另一层。该案例为已有证据交叉引用，本轮新增证据是 Tasks 和 SDK 的终态解包路径。**[一手；研究：边界]**
- **不强制新增队列或自建框架。** 同步工具已经覆盖需要时保持原实现；确需后台作业时，优先选能查询目标结果、兼容现有客户端的实现。只有接受回执而无可查询结果时，不能承诺无人值守完成。副作用是否重试仍按 20 对账，不把工具错误自动当作安全重试许可。**[经验：采用／撤回判断]**
- 本轮没有 Agent 误报的真实运行轨迹，也没有测量 SDK 的净收益、服务持久性或业务幂等性；失败链是固定代码可见的条件推导，不能报告为已复现线上事故。**[研究：验证范围]**

## 服务接入：工具面、凭证与外部内容

> 核实：2026-10-15（UTC+8；读取于 10-14 UTC）。主线二；04 删除不影响选择的下载量／口碑风向，撤回“小模型、浏览器、高风险环境就用 MCP”的无条件建议，改为已有能力基线、服务权限与退出条件。新增证据为官方权限契约、固定服务实现、已修安全公告和原始研究报告；不重复成本、Figma、记忆或 Tasks 调查。**[一手；经验：选择]**

### 接口与装配不是执行边界

- [MCP 2026-07-28 授权规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)适用于 HTTP；stdio SHOULD 从环境取凭证。CIMD 为 SHOULD，DCR 为保留兼容的 MAY；不能把“弃用”写成现有服务已停止支持。规范本身不保证凭证永不进入进程环境，也不提供 OS 沙箱。**[一手；研究：界定]**
- [同版 HTTP 规范](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http#server-validation)要求按方法携带 metadata headers，服务端校验 header／body 一致。04 撤回“只看 header 就能鉴权”的过强表述；请求字段不替代身份、权限和业务授权。**[一手；经验：选择]**
- [Claude 插件 manifest](https://code.claude.com/docs/en/plugins-reference#mcpservers)可同时包含 Skills、Hook、LSP 与 MCP 配置；MCP 配置可为本地文件、内联或 bundle。[MCP 文档](https://code.claude.com/docs/en/mcp#plugin-provided-mcp-servers)明确启用插件会启动其 MCP，工具与手工配置一起提供。[沙箱范围](https://code.claude.com/docs/en/sandboxing#what-runs-outside-the-sandbox)明确本地 MCP、Hook、LSP 等不受 Bash 沙箱包裹。因此插件可减少装配工作，但没有第三种天然安全边界。这里是 Claude 的实际机制，不外推所有产品的插件格式。**[一手；研究：采用判断]**
- 同一 MCP 文档的 project scope 区分交互审批与 print／SDK／cloud 启动；后者不能弹提示。正文不再只给“共享 `.mcp.json` + npx 最新包”的安装例子，而让读者先核已有连接、实际组件、固定本地版本与启动审批。该文档描述当前产品，未实跑客户端；组织设置仍按其运行表面配置。**[一手；经验：采用判断]**

### G1：GitHub 的只读与 lockdown 不能替代凭证权限

固定 `github/github-mcp-server` 于 `c59e8c199efbf14467211861de44afaeeb6873e3`（本轮 GitHub commits API 返回的 main）：

- [filters.go L24–54](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/pkg/inventory/filters.go#L24-L54)先检查工具自身 Enabled，再按 readOnly／IsReadOnly 过滤，之后处理工具组与显式工具。它选择可用工具，不重签或缩小 GitHub token。[README](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/README.md#lockdown-mode)明确 lockdown 是 best-effort 内容过滤，私有仓库不受同样过滤；不改变底层凭证的读写权限，同一内容可能仍能经其他工具／API 获取。**[一手：固定实现与文档]**
- [remote-server.md](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/docs/remote-server.md)定义 `/readonly`、单工具组路径和 `X-MCP-Toolsets`／`X-MCP-Readonly`。这证明已有窄接口可复用，不需要为 PR 排障自建新服务器；本轮未登录托管端点，也未确认其部署 SHA。**[一手；经验：选择]**
- **实际故障与修复边界**：[官方 GHSA-pjp5-fpmr-3349](https://github.com/github/github-mcp-server/security/advisories/GHSA-pjp5-fpmr-3349)列受影响版本 `>=0.22.0, <1.1.2`、修复版 `1.1.2`。条件是 HTTP + lockdown，多用户请求曾复用首个用户的 GraphQL client，使内容信任判断跨身份混淆；不是单用户 stdio 的同等故障，也不是“读到了所有其他用户私有数据”的证明。**[一手：维护者安全公告，未复现]**
- **当前实现反证**：[dependencies.go L463–487](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/pkg/github/dependencies.go#L463-L487)按请求取客户端并带 identity，新建 RepoAccessCache；[lockdown.go L102–113](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/pkg/lockdown/lockdown.go#L102-L113)绑定传入客户端。[官方测试 L134–158](https://github.com/github/github-mcp-server/blob/c59e8c199efbf14467211861de44afaeeb6873e3/pkg/lockdown/lockdown_test.go#L134-L158)分别创建 attacker／victim 缓存并断言作者信任判断不同；另有 identity scoped keys 测试。阅读不等于执行，但足以拒绝“当前仍使用该 singleton”的描述。**[一手：固定源码／回归定义，未运行]**

**选择**：已有 `gh` 足够时不加层；确需受限远程工具时，按任务选工具面，按目标仓库限底层凭证，按输入来源处理内容。自托管多人 HTTP + lockdown 的旧部署须先升级到至少公告修复版；版本门槛只针对该已知漏洞，不保证所有安全问题消失，也不要求已修部署重新搭建。**[经验：采用边界]**

### D1：Supabase 的项目、查询与用户身份是不同范围

[当前官方 MCP 指南](https://supabase.com/docs/guides/ai-tools/mcp#configuration-options)给出 `project_ref`、`read_only=true`、`features`；安全部分明确开发者 MCP 按开发者权限运行，不应直接交给应用终端用户。生产证据确有必要才访问生产项目；只读不会把敏感列自动变成非敏感数据。此为供应方契约，不是本仓库对实际账户权限的认证。**[一手；研究：范围]**

固定 `supabase/mcp` 于 `f46b3d2996d93baad25cce1b94b46440dcc44ecb`：

- [server.ts L251–275](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/server.ts#L251-L275)在指定 projectId 时不装配 account tools，并把 projectId／readOnly 传给数据库工具；[L346–351](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/server.ts#L346-L351)在只读模式隐藏写工具。**[一手：固定源码]**
- [database-operation-tools.ts L461–476](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/tools/database-operation-tools.ts#L461-L476)明确阻止只读模式 apply_migration；[L626–635](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/tools/database-operation-tools.ts#L626-L635)把 read_only 送入 executeSql 并包裹不可信结果；[api-platform.ts L204–222](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/platform/api-platform.ts#L204-L222)调用 Management API 的 `/v1/projects/{ref}/database/query`，不是以客户 JWT 调应用查询接口。不能据此笼统声称所有 MCP 都绕过 RLS；它只支持不要把这个开发者入口当终端用户隔离。**[一手；研究：机制边界]**
- [server.database.test.ts L73–123](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/server.database.test.ts#L73-L123)定义只读查询通过与写入错误断言；[L696–718](https://github.com/supabase/mcp/blob/f46b3d2996d93baad25cce1b94b46440dcc44ecb/packages/mcp-server-supabase/src/server.database.test.ts#L696-L718)断言迁移错误。本轮只读测试，未执行数据库或确认远端角色／RLS 实际状态。**[一手：回归定义，未运行]**

**选择**：查线上问题只开放目标项目的必要读操作；改 schema 继续用开发环境和现有迁移链；给客户查其订单则继续用应用已验证的逐用户授权接口。三种任务不因同属“数据库”而共享开发者权限。若项目只需生成类型或查 schema，避免额外拉取整表业务数据。**[经验：采用判断]**

### S1：agentjacking 原研究证明哪条失败链

直接读取 [Tenet 原文](https://tenetsecurity.ai/blog/agentjacking-coding-agents-with-fake-sentry-errors/)（页面更新 2026-06-17），替换此前只有 CSA 二手转述的依据。研究者报告经公开 DSN 注入伪造错误，Agent 经 Sentry MCP 读取后执行验证包；文中把它称为受控真实环境验证，并给脱敏捕获。该报告的成功率与组织数未由本仓库复算；不能写成当前所有客户端必然中招、所有沙箱无效或已确认恶意攻击规模。**[一手：原研究作者报告，非独立复现]**

本次采用的是“可信服务可以返回外部作者指令，而读取后还存在执行边界”这一具体反例。对于日志／工单中推荐的修复包，先回源码与官方来源核查，再依据用户批准执行；CLI 读取同样内容也不自动免疫。没有必要因这一受控研究一律停用观测工具，也不能只加一句提示词就承诺自动修复安全。**[经验：选择与反证]**

### 验证范围与收敛

只读公开官方文档、固定源码／测试及安全报告；未安装软件、执行上游服务／利用代码、接私人账户或调用付费模型。本文没有新模型质量、成本或安全防御成功率数据。保留 Tasks 原段与固定证据；删除规模、厂商口碑、未给条件的推荐及无固定版本的安装例子，以免它们压过可直接采用的任务判断。完整离线与独立审阅结果随本工作单元交付，不据源码阅读宣称产品实测。

## 共享指令：发现、导入与加载证据

> 核实：2026-10-15（UTC+8，对应 10-14 UTC）。只读官方动态文档与固定发布记录；未启动 Claude Code／Codex、未修改真实配置、未执行模型或加载实验。**[一手：文档与发布记录；研究：采用判断]**

### 共享指令：改变的选择与范围

03 原有“只用 AGENTS.md（Claude Code 现在也会读）”省略了会让共享约定消失的实际条件。改为：已确认原生发现可只留 AGENTS；团队有项目内 `CLAUDE.local.md`、混合版本或附加仓库时，先保留明确的导入入口。不是增加另一份约定，也不要求安装同步工具；不重做 05 插件权限研究。**[研究]**

### 共享指令：直接来源及反证

| 来源 | 已读范围与结论 | 对选择的影响 |
|---|---|---|
| [Claude memory](https://code.claude.com/docs/en/memory#when-claude-code-reads-agentsmd) | 原生回退检查当前及祖先的 CLAUDE／`.claude/CLAUDE.md`／CLAUDE.local；不将用户级或 managed CLAUDE、rules 当抑制项；AGENTS.override 不被这个入口发现 | 项目路径增加 `CLAUDE.local.md` 可能让原共享约定不再加载；不能把 Codex override 当跨工具规则 |
| 同页 [Project instructions](https://code.claude.com/docs/en/memory#choose-which-instruction-files-load) | 默认二选一；共同加载模式按目录先 CLAUDE 后 AGENTS，并去重已导入文件；选项读取用户、`--settings`、managed，忽略 project/local。插件 ID 在 v2.1.285 前后有变化 | 需要全队可复制时不依赖项目内无效选项；不把后出现解释成硬覆盖 |
| 同页 [导入](https://code.claude.com/docs/en/memory#import-additional-files)及[额外目录](https://code.claude.com/docs/en/memory#load-from-additional-directories) | 相对导入按包含文件定位；代码块／行内代码中的 `@` 不导入。额外目录开关加载 CLAUDE 与 rules，原生 AGENTS 不在覆盖内；原生 AGENTS 的外部导入须此前获准，不弹新批准框 | “请读 AGENTS”的自然语言和实际导入不同；额外目录可读不等于约定已加载 |
| 同页 [差异](https://code.claude.com/docs/en/memory#where-agentsmd-differs-from-claudemd)与[排障](https://code.claude.com/docs/en/memory#my-agentsmd-isnt-loading) | 原生发现与 CLAUDE 导入的事件不同；v2.1.280 前原生 AGENTS 不显示在 `/memory`／`/context`，新版本可核路径 | 旧版 UI 无路径，或当前契约下原生入口无 Hook 事件，均不能单独证明 AGENTS 缺失 |
| [Hooks：InstructionsLoaded](https://code.claude.com/docs/en/hooks#instructionsloaded) | CLAUDE 导入 AGENTS 触发 `include`，可记录 `parent_file_path`；原生 AGENTS 不触发。事件异步、不能阻止或修改加载，输出决策字段被忽略 | 日志只证明其覆盖的加载路径，不是执行合规或规则生效验收 |
| [Codex AGENTS](https://learn.chatgpt.com/docs/agent-configuration/agents-md#how-codex-discovers-guidance) | 启动时建立链，全局与项目分开；项目每层至多一个文件，override 优先，默认项目预算 32 KiB | 文件名可以共享，发现时机、override 与合并路径不能共享假设 |

**顺序与触发补充**：Claude 的 CLAUDE 层级先 managed、再 user，项目路径从文件系统祖先向当前目录拼接，同目录 local 在后；子目录 CLAUDE 在访问相关文件时按需加载。原生 AGENTS 的官方子目录说明指定 Read 触发，不能把 CLAUDE 的所有触发操作自行外推过去。共同加载模式也不是冲突解决器：应移除互相矛盾的约定。**[一手：上述 memory 原文；研究：边界判断]**

**固定版本反证**：[Claude changelog `94506ff0d3bd9185f1752da36e968775021fb48f`](https://github.com/anthropics/claude-code/blob/94506ff0d3bd9185f1752da36e968775021fb48f/CHANGELOG.md)（本次 HEAD，顶版 2.1.300）记录 2.1.277 引入 AGENTS，2.1.281 扩展到 Bedrock／Vertex／Foundry／网关及禁遥测会话，2.1.290 修复子目录文件被 `@` 提及时未附带 AGENTS 的问题。它支持“版本与触发路径影响加载”，不证明任意客户端当前构建已实测。动态 memory／hooks 正文按核实日引用，不能假装它们全部固定在这个 SHA。**[一手：固定发布说明]**

### 共享指令：采用、撤回与未验证

- **采用**：只维护一份公共内容；原生入口条件成立时不额外造包装，否则保留 CLAUDE 显式导入。既有导入与原生共同加载会去重，不能仅为“少一个文件”删除仍承担兼容或观测作用的入口。**[研究：建议]**
- **撤回**：删除包装前确认它没有 Claude 专属内容、兼容旧会话、外部导入或日志用途；若共享约定缺失，先修正发现路径，不能先归因模型不听话或增加规则长度。**[研究：建议]**
- **验证分层**：本轮确认文档间契约与发布版本；未执行任何客户端，因此没有实际日志、规则遵循率、token／成本或质量收益。未来只有目标客户端的加载记录及任务行为能验证部署与效果；不以一张配置文件或事件日志替代。**[研究]**

## 会话动作：按问题与宿主选择

> 核实：2026-10-15（UTC+8，对应 10-14 UTC）。只读公开官方文档；未运行客户端、模型、真实配置或私人日志。**[一手：契约；研究：采用判断]**

**改变的选择**：03 不再将“长任务中途”当压缩触发器，或把子 Agent 固定为干净输入加 1–2k 摘要；先区分腾空间、舍弃旧思路、解释已有信息与独立查询。17 已有 thrashing／故障分流，20 已有恢复记录和失败压缩边界，本轮只引用，不再造恢复框架。

### 会话动作：直接证据

- [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 的 multi-agent 段把 1,000–2,000 token 写成常见摘要示例，不是接口上限；收益场景是复杂研究，不能据此规定 coding 调查的输出大小。压缩与结构化笔记也按任务选择。**[一手：工程博客]**
- [Claude sub-agents：选择主会话或子任务](https://code.claude.com/docs/en/sub-agents#choose-between-subagents-and-main-conversation)支持把可独立交付、输出冗长的工作拆出；频繁往返和共享背景可留主会话。[fork 差异](https://code.claude.com/docs/en/sub-agents#how-forks-differ-from-other-subagents)明确继承全历史；普通子 Agent 使用委派输入。文档给 `/subtask` 的版本起点为 2.1.212，交互式默认 fork mode 为 2.1.232；模式可用不意味着每次委派都采用 fork。此为 Claude 契约，不外推其他产品。**[一手]**
- [Claude commands](https://code.claude.com/docs/en/commands)区分 `/clear` 的新对话与 `/compact` 的同会话摘要；[上下文处理](https://code.claude.com/docs/en/how-claude-code-works#when-context-fills-up)说明会自动管理空间，也可能丢早期细节。故手动压缩按实际负担选择，不因时间长而强制执行。**[一手；研究：判断]**
- [Checkpointing](https://code.claude.com/docs/en/checkpointing#guide-a-summary)的摘要不改磁盘文件，原消息仍留在 transcript；两个摘要方向分别处理选中点之前／之后。原消息留存不等于每轮全部进入模型输入，摘要也不是代码回滚。**[一手；研究：边界]**
- [Claude 侧问答](https://code.claude.com/docs/en/interactive-mode#side-questions-with-btw)可见现有会话但无工具，问答不进入主历史。用于解释已有信息；不能靠它读取刚变的源码或查询最新外部事实，后续执行所依赖的结论应明确带回主会话。**[一手；研究：判断]**
- [Codex CLI 官方命令](https://learn.chatgpt.com/docs/developer-commands?surface=cli)的 compact／new／resume 分别总结、开新聊天、加载保存历史；fork 复制聊天而非上述 Claude 子 Agent。本次没有据命令同名推广继承、压缩或恢复语义。页面是核实日动态文档，不伪装成固定发布版的运行结果。**[一手]**

### 会话动作：保留的收益与撤回条件

§4.2 已分别记录 AGENTS 缺原文档时的收益、Agent KB 同模型 pass@1 迁移收益，以及 Complexity Trap 在不同模型上的收益／退化；没有新模型数据，不合并这些设置，也不删除正面结果来支持“一律少上下文”。指令加载证据足够但行为失败时，检查任务、内容和执行边界；历史过长才处理历史，当前事实缺失则补事实，跨任务检索反复缺失才评估记忆服务。**[研究：既有证据范围；经验：采用判断]**

本轮还撤回正文中“规则忽略通常因为文件长”、一律排除代码可推知信息，以及以第二次出错作维护触发的表述，它们和已经建立的加载、保留价值及事实变化判据冲突。无新增论文名单、依赖、服务或实测收益；自动记忆与旧研究仍沿各自核实日期。**[经验：全文一致性修订]**

**全文复审补核**：[Claude Read and Edit](https://code.claude.com/docs/en/permissions#read-and-edit)明确 deny 规则覆盖内置文件工具、识别的 Bash 文件命令及重定向，但不覆盖隐式递归读取或任意 Python／Node 子进程间接读写；03 因此撤回“不让 Agent 读”的全入口承诺，硬路径边界交回 10。另核 [Commands](https://code.claude.com/docs/en/commands)仍有 `/doctor prompt-audit`（v2.1.283+），未因另有 `/claude-api prompt-audit` 就删除前者。均为文档核查，未执行隔离或命令测试。**[一手；经验：独立审阅后的收窄]**


## Serena：定位与附加详情的成本取舍

> 核实：2026-10-15（UTC）。主线二；改变 03 §2.5：语义能力已经有用时，先区分定位与附加信息的成本，不因后者太慢直接弃用工具。本轮只读公开原帖、固定源码与测试定义，未安装、运行 LSP／模型或重放作者实验。**[社区／一手；经验：采用判断]**

### 用户反馈、复测与实际采用的机制

[Serena #951](https://github.com/oraios/serena/issues/951)中，n-r-w 于 2026-01-18 报告 Linux、clangd 21.1.0 的已索引大型 C++ 项目：引用查询附带详情时超时，关闭后立即返回；后来明确涉及 1000 多条记录、300 多个文件。作者曾怀疑关闭详情也慢，随后撤回，说明没有等索引结束。维护者作内容 hash 惰性计算后，**同一用户复测说仍未解决带详情的等待**，继而提出 hover 预算；不能把优化已合并当作用户收益。**[社区：实际使用与复测自报，未取得项目或完整轨迹]**

[#956](https://github.com/oraios/serena/pull/956)最终合并为 [`dcbf08520d9b6bccafc9f994284ea2be22458c56`](https://github.com/oraios/serena/commit/dcbf08520d9b6bccafc9f994284ea2be22458c56)：

- `find_referencing_symbols` **移除** `include_info` 参数及逐引用 hover，保留引用附近代码；`find_symbol` 的附加详情改为批量查询。不是给所有语义操作统一加一个参数。
- 最终配置名 `symbol_info_budget`，默认 10 秒，项目可覆盖；0 表示不提前停止。达到预算后不再发下一次 hover，已得详情保留，其余为 None，不取消已开始的请求。
- [固定测试](https://github.com/oraios/serena/blob/dcbf08520d9b6bccafc9f994284ea2be22458c56/test/serena/test_symbol.py)以模拟时间断言五个符号只查前两个、其余 None，并覆盖预算 0 及项目覆盖。这里是阅读测试，未执行；也未找到原报告者在合并版上的端到端成功复测，不能把早期关闭详情的成功自报算到预算机制上。**[一手：补丁／测试；研究：证据边界]**

**采用判断**：批量查询先保符号身份、位置与引用，需要理解具体契约时，再读取少量目标的正文或详情。这比默认附带全部资料、或因附加查询慢就退回纯文本搜索更贴合缺口；不推断所有语言后端同样慢。**[经验]**

### 后续反证：预算省略不等于本来没有

[另一报告者的 #2006](https://github.com/oraios/serena/issues/2006)在 2026-09-09 引用 `701e7c84` 指出：预算耗尽仅有 DEBUG 留痕，工具缺少 info 的结果与真正无文档相同。该帖主要是代码诊断，未提供模型因此错误修改的轨迹，不能升级成已发生的模型失败。**[社区／一手：诊断范围]**

[修订 PR #2010](https://github.com/oraios/serena/pull/2010)本轮核查仍 **open、draft、未合并**。最初拟逐符号加说明，[维护者质疑重复 token](https://github.com/oraios/serena/pull/2010#discussion_r4021141582)后，[作者改为每批一行遗漏计数](https://github.com/oraios/serena/pull/2010#discussion_r4025859992)，head 为 `4d680c856e9b6f8835919bb2db321ab0313287be`。不能照初始 PR 描述写成每符号提示，也不能声称当前已提供计数。作者的测试通过是自报，并未覆盖 MCP 客户端端到端收益。**[社区：评审／自报；一手：未合并补丁]**

当前固定提交 [`0c1091394eda5644887dc3399621e479d9f33aa3`](https://github.com/oraios/serena/commit/0c1091394eda5644887dc3399621e479d9f33aa3)（2026-10-15T08:52:59Z）交叉核对：

- [`symbol.py L627–728`](https://github.com/oraios/serena/blob/0c1091394eda5644887dc3399621e479d9f33aa3/src/serena/symbol.py#L627-L728)仍在下一次 hover 前检查累计时间，到限后 None、仅 DEBUG 计数；每文件打开也在预算分支外。**它不是整次调用硬时限，更不能约束单个已开始的 hover。**
- 当前已经重构，实际信息过滤见 [`repl/api/lsp_api.py L353–362`](https://github.com/oraios/serena/blob/0c1091394eda5644887dc3399621e479d9f33aa3/src/serena/repl/api/lsp_api.py#L353-L362)，[L127–169](https://github.com/oraios/serena/blob/0c1091394eda5644887dc3399621e479d9f33aa3/src/serena/repl/api/lsp_api.py#L127-L169)只将非空 info 渲染入结果，未传出预算原因。不能只读旧工具文件确认当前行为。
- [当前工具签名](https://github.com/oraios/serena/blob/0c1091394eda5644887dc3399621e479d9f33aa3/src/serena/tools/symbol_tools.py)中 find_symbol 的 include_info 仍默认 false，find_referencing_symbols 已无此参数。固定 main 不等于读者安装版本。**[一手：源码；研究：机制边界]**

因此，资料缺省时先缩小目标再读，不直接认定不存在；也不为追求全量附加信息无限放宽预算。不同报告者仍来自同一项目，本轮未证明跨产品普遍收益、模型正确率或人的总投入。**[经验／研究]**

### 对照：移除无关启动开销不必减少所需证据

[另一作者的 #2012](https://github.com/oraios/serena/issues/2012)报告 Serena 1.7.0 默认 CHAR_COUNT 仍在启动时加载 Anthropic SDK；Windows 局部修改后 CLI import 自报从 5.13 秒降到 2.89 秒，新 Codex CLI 会话仍能调用初始指令、C# overview 和诊断。此时间不是完整 MCP ready 时间，也未证明该 import 是所有初始工具缺失的根因。**[社区：使用者自报]**

[#2013](https://github.com/oraios/serena/pull/2013)由另一作者提交，2026-09-16 合并 [`16322651bb8a18c7a4d43a539dac308bbed02c50`](https://github.com/oraios/serena/commit/16322651bb8a18c7a4d43a539dac308bbed02c50)：类型导入移入 TYPE_CHECKING，真正选择该计数器才加载 SDK。维护者虽讨论删除计数器，实际合并的是惰性导入，不是删除功能。[第三位参与者的固定版本复测](https://github.com/oraios/serena/pull/2013#pullrequestreview-5191963066)比较 `403ad0a` 与 `8f121d51`，在 clean container 确认模块不再提前加载并报告四项测试通过；属于独立自报，不是本仓执行，也不是 API 计数或全客户端发现率验证。**[一手：补丁；社区：独立复测自报]**

这个对照只支持先找具体成本来源：无关启动依赖可以延迟加载；附加详情降级则留下需要补查的信息。两者不能合并成“少工具／少信息必然更好”，不另扩正文启动诊断。**[经验：适用边界]**


## Serena：语义检索为空时先核项目导入

> 核实时间：2026-10-16（UTC+8；读取于 10-15 UTC）。只读公开原帖、固定源码、测试定义和发布记录；未安装或运行 Serena／JDTLS，未执行上游测试或模型任务。**[社区：原帖；一手：固定实现与发布；经验：采用判断]**

**改变选择**：源码明确存在而符号查询为空时，先用原生文件／文本搜索定位，核对语言服务器的项目导入配置与依赖解析。修正导入后，以已知定义和调用点核验，再恢复跨文件语义操作；不靠扩大查询、增加上下文或无差别清缓存解决。这里新增的是“构建／导入上下文没有成立，或旧 workspace 掩盖了错误配置”，不是又一个源码内容缓存例子。**关键局限**：有真实多模块搜索失败与修复机制，但没有修复后原任务的编辑产物／验收，不能声称 Agent 成功率提高。**[经验：选择与证据边界]**

### 实际调用与报告者恢复：不要把空结果当目标不存在

- [Serena #1174](https://github.com/oraios/serena/issues/1174) 的 2026-03-16 日志来自 Windows Java/Maven 项目，Serena 日志版本为 0.1.4、后端为 LSP。`serena project index` 报告索引 2,400 个 Java 文件；随后 `find_symbol` 查 `MultilingualConfigGenerationService`，以及该类的 `generate`，均返回空数组。两次调用都未限定 `relative_path`，`include_body=False`、`include_info=False`，不是附加详情预算导致的缺省。3 月 18 日报告者确认符号存在、普通搜索可用，符号工具仍失败；对已定位 Java 文件的健康检查也返回空。维护者最初判断为慢启动，后重新打开，最终因无法复现关闭，不能把首次关闭当成修复。**[社区：原调用日志及作者复述，未复现]**
- 同一报告者在 2026-06-03 的 [#1541](https://github.com/oraios/serena/issues/1541) 补充：Windows 11、JDTLS 1.58.0-SNAPSHOT、23 个 Maven 模块，父 POM 依赖非默认配置指向的仓库；其称在 `project.local.yml` 补上 Maven 配置路径后可工作。更有辨别力的复现是：正确配置下健康检查通过，移除该配置仍通过；清掉对应 JDTLS workspace 后，才暴露父 POM 无法解析及空符号结果。该帖的 Serena 版本只写 latest，不能补成精确版本。**这是修复前的配置恢复自述，不是后来补丁发布后的用户重试。** **[社区：报告者环境／复现自述，未复现]**

因此，索引文件数只说明扫描范围，旧 workspace 下的成功也不能单独验证当前导入配置。文本搜索可先确认文件和定义存在；是否解析出正确跨模块引用，仍需在正确构建上下文里核验。**[经验：从该单例推导的诊断选择]**

### 固定修复与发布：自动失效覆盖哪些变化

[PR #1576](https://github.com/oraios/serena/pull/1576) 于 2026-06-28 合并，merge SHA 为 `88fe650f357aa47fcb851a068424f9fbbb14c332`：

- [workspace hash 实现](https://github.com/oraios/serena/blob/88fe650f357aa47fcb851a068424f9fbbb14c332/src/solidlsp/language_servers/eclipse_jdtls.py#L777-L813) 在项目根与 launcher 路径之外，纳入七项显式配置值：`maven_user_settings`、`gradle_user_home`、`gradle_wrapper_enabled`、`gradle_java_home`、`java_home`、`use_system_java_home`、`maven_offline`。legacy INITIAL 默认配置仍保留原 hash；设置受跟踪项后才退出该兼容路径。**[一手：固定源码]**
- [新增测试 L458–478](https://github.com/oraios/serena/blob/88fe650f357aa47fcb851a068424f9fbbb14c332/test/solidlsp/java/test_jdtls_path_resolution.py#L458-L478) 检查 Maven 配置路径变化会改变 hash，以及 legacy 配置增加显式 Gradle 路径会改变 hash。这是测试定义阅读，未运行；这些断言也没有启动真实多模块导入或验证 Agent 编辑。**[一手：测试源码，未运行]**
- 修复已进入 2026-07-16 发布的 [v1.6.0](https://github.com/oraios/serena/releases/tag/v1.6.0)，固定 tag SHA `93b9544ea9def8e93cb6a90f8ea67befe3c8fee4` 的 [changelog](https://github.com/oraios/serena/blob/93b9544ea9def8e93cb6a90f8ea67befe3c8fee4/CHANGELOG.md) 明列 #1576，[源码 L752 起](https://github.com/oraios/serena/blob/93b9544ea9def8e93cb6a90f8ea67befe3c8fee4/src/solidlsp/language_servers/eclipse_jdtls.py#L752-L800) 包含此机制，不能把历史缺陷写成当前版本仍普遍存在。**[一手：发布与固定源码]**
- 2026-10-13 发布的 v2.0.0，固定 SHA `4c4268f9c0adf8743a75e6dda2ef1fa635f34cc3` 的 [实现 L691 起](https://github.com/oraios/serena/blob/4c4268f9c0adf8743a75e6dda2ef1fa635f34cc3/src/solidlsp/language_servers/eclipse_jdtls.py#L691-L750) 仍保留该机制，另纳入 `runtimes`、Maven／Gradle 导入开关、build configuration、autobuild 和 custom JRE 等配置。hash 取配置值，不读取同一路径下 Maven 配置文件的内容，也不纳入 branch／HEAD；**这只限定这一层的自动失效范围，不能据此断言其他机制不会刷新或重新导入。** **[一手：固定源码；经验：边界解释]**

本链支持针对性检查导入环境，不支持“清空所有缓存”、无条件更换后端或升级就能完成原任务的建议。没有发现原报告者在 #1576 后的重试验收，也没有最终跨模块修改 diff／测试产物；保持为机制与诊断选择证据。**[经验：采用边界]**

## Serena：原生引用存在但封装过滤漏掉

> 核实时间：2026-10-16（UTC+8）。只读公开原始报告、固定补丁与测试定义、发布版本源码；未运行 Serena、Gleam、上游测试或模型。**[社区／一手；经验：采用判断]**

**改变选择**：03 §2.5 将“语义结果不全”进一步分流：原生 LSP 已返回、封装工具却漏掉的调用者，先核包装过滤和版本，临时沿用已核验的原生结果；不能用扩大上下文、增加文档服务或重建索引修复这层丢失。文本搜索可以发现可疑遗漏，仍不能单独确认语义身份。这不改变“先对照 IDE、确认覆盖再编辑”的采用门槛。**[经验]**

- **真实查询差异**：[Serena #2133](https://github.com/oraios/serena/issues/2133) 的报告者于 2026-10-05 给出 Serena 1.7.0、Claude Code、Windows 11、Gleam 1.17.0 环境与三文件代码：`a.run`、`c.run` 都调用 `b.run`，`find_referencing_symbols` 仅返回前者，而直接 `textDocument/references` 返回两者。报告者声明实际遇到此问题；这证明的是引用查询失败，未提供最终修改产物或编辑验收。**[社区：原始报告，未复现]**
- **固定修复**：[#2134](https://github.com/oraios/serena/pull/2134) 于 2026-10-06 合并为 [`c4a2fd425cbe0fb59db62f39e9db735d33a2dd4c`](https://github.com/oraios/serena/commit/c4a2fd425cbe0fb59db62f39e9db735d33a2dd4c)。旧实现见到目标声明后，将后续同 name、同 kind 的包含符号当成 import；新增条件要求引用位置还须落在该符号名称的 `selectionRange` 内，函数体内的调用不再仅因同名被过滤。PR 作者以 Gleam 1.19.0 自报修前／修后对照，并说明旧版表现受返回顺序影响；这不是原报告者回执。修复仍依赖语言服务器的 range 表达，作者没有验证所有后端。**[一手：补丁；社区：作者复测自报]**
- **测试定义与防假绿**：[固定单元测试 L59–85](https://github.com/oraios/serena/blob/c4a2fd425cbe0fb59db62f39e9db735d33a2dd4c/test/solidlsp/test_referencing_symbols.py#L59-L85) 用脚本化 LSP 响应将声明排在两个同名调用者之前，再断言两者均返回，确保触发旧过滤条件；[Gleam 后端测试 L110–126](https://github.com/oraios/serena/blob/c4a2fd425cbe0fb59db62f39e9db735d33a2dd4c/test/solidlsp/gleam/test_gleam_basic.py#L110-L126) 验证相应三模块场景，但旧版是否失败受实际返回顺序影响，不能只以一次旧版通过判定没有缺陷。以上是测试源码阅读，未执行；PR 自报测试通过不升级为本仓验证，也不证明 Agent 编辑成功。**[一手：测试定义；经验：验证边界]**
- **已发布边界**：[v2.0.0](https://github.com/oraios/serena/releases/tag/v2.0.0) 发布于 2026-10-13；[固定版本 `4c4268f9` 的实现 L2545–2569](https://github.com/oraios/serena/blob/4c4268f9c0adf8743a75e6dda2ef1fa635f34cc3/src/solidlsp/ls.py#L2545-L2569) 包含该过滤修正。不能把 1.7.0 的报告写成当前版本普遍仍有此故障，或因此无条件更换后端。原 issue 无评论，PR 讨论也未提供原报告者修复后回执；本链满足原报告、固定修复与测试定义，不满足端到端编辑收益。**[一手：发布与源码；研究：证据范围]**
