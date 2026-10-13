主线：二，额外能力何时值得加
改变的建议：03/04 按问题组合检索工具并核对版本与状态；05/Claude 起步配置撤回 LSP 必装，先核会话支持与任务缺口
新证据：原研究固定索引/缓冲源码、测试、文档查询链及刷新原帖；后补 Claude Code 官方 LSP 会话与二进制边界，均未运行工具或模型

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
