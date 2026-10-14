主线：二，额外能力何时值得加
改变的建议：先用原生查询定位问题，再按语义与版本缺口补工具；map 可能是旧快照，LSP 依赖会话和缓冲状态，文档近邻版本不保证兼容。全量验收读命令侧完整报告；设计输入按结构／组件契约缺口补充，映射漂移时撤回。[经验]
证据摘要：固定索引／客户端／采集源码及测试定义、社区刷新案例、onlycodes 历史数据复算和标准库演示。减少工具或账面成本未必缩短等待，显示预算不能补回采集丢失；未运行模型或上游客户端。[一手／社区／研究]

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
