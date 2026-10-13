# Context7：版本 ID 是检索选择，不是依赖兼容性证明

> 核实时间：2026-10-13（UTC+8）。本次只读公开源码、测试及原帖，未运行客户端、真实查询或模型。**[一手：固定源码与测试；社区：原帖；经验：采用判断]**

**🧪 维持按需试用。** 缺少实际版本时，不把近邻版本当成已核实兼容；回目标版本官方文档或源码确认关键行为。返回片段还须分清真实项目原文与生成摘要，普通刷新不能自动证明所有内容层都已重建。

## 固定研究对象

GitHub API 在本轮返回 master 为 [`33414e6e3fc157c936348ca8ddba25e50dacaeee`](https://github.com/upstash/context7/commit/33414e6e3fc157c936348ca8ddba25e50dacaeee)，提交时间 2026-10-12 21:51:03（UTC+8）。该提交的 package.json 分别标记 [MCP 4.3.0](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/package.json)、[ctx7 CLI 0.6.0](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/package.json)。这是固定主分支快照的包版本，不声称 npm 发布物逐字相同。**[一手：固定源码]**

## 从输入到返回的实际边界

1. **resolve 不解析项目依赖。** [MCP 工具 schema/说明](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/index.ts#L220-L287) 接收 `libraryName` 和用于相关性排序的 `query`，提示 Agent 从 Versions 中选择 `/org/project/version`。该查询链没有 lockfile 输入、读取项目版本或比较 semver 的步骤。把版本写在自然语言 query 中只是检索信息，不是独立的版本约束字段。**[一手：源码；推断限于所读公开查询链]**

2. **query-docs 的版本选择在 libraryId 字符串中。** [ContextRequest](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/lib/types.ts) 只有 `query`、`libraryId`、可选 `language`；[API 实现 L185–225](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/lib/api.ts#L185-L225) 把它们发给 `/v2/context`，不核实 ID 所指版本等于项目版本。`language` 是例子排序提示，不是版本选择器。**[一手：源码]**

3. **Skill 的宽松退路正是项目级使用需要覆盖的地方。** [find-docs L51、L90–104](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/skills/find-docs/SKILL.md#L90-L104) 要求查 ID，并建议选择用户所需版本的 closest match；3 次查询仍不满足则用手头 best result。其配额错误段要求披露失败后可用训练知识作答。这是对 Agent 的指令，不是客户端保证；源码没有自动选择最近 semver 的算法，也没有验证“最近”是否兼容。**[一手：Skill/源码；经验：不接受其作为版本承诺]**

4. **客户端不会自动把缺失版本降级成最新版。** 所读 MCP 实现遇非 2xx 返回 error，空字符串返回 not_found，非空文本返回 success；没有去掉版本段重试的代码。MCP 工具层只在 `outcome === "error"` 时设置 `isError: true`，not_found 不属于协议错误，所以 `isError=false` 不表示找到有效文档，更不表示版本正确。[工具返回](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/src/index.ts#L365-L390)。后端未开源，不能从这个结论外推后端永不重定向或回退。**[一手：公开客户端实现]**

5. **CLI 同样是传参/呈现层。** [docs.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/commands/docs.ts#L108-L187) 检查 ID 大体格式，经 `recoverLibraryId` 修正 Git Bash 路径，再传给 API。字符串响应直接打印；有 redirectUrl 的错误提示新 ID、设置失败退出码，没有自己重新查询该 ID。零片段只警告并返回，不能只用进程成功判断命中。[getLibraryContext](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/utils/api.ts) 也没有依赖版本验证。**[一手：源码]**

## 测试究竟证明什么

- [library-id.test.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/__tests__/library-id.test.ts) 明确测试 `/vercel/next.js/v15.1.8` 不被改写、Windows 路径恢复保留版本段，能证明设计意图是保留字符串；不能证明服务器存在该索引或该版本片段正确。**[一手：测试源码，未运行]**
- [MCP integration.test.ts L150–159、L520–551](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/mcp/test/integration.test.ts#L520-L551) 使用本地 stub API；断言转发 `/vercel/next.js` 和 query，并原样得到 `STUB_DOCS`，错误场景返回 `isError=true`。测试名含 end to end 不等于真实文档后端或特定版本正确性验证。**[一手：测试源码，未运行]**
- [find-docs-skill-alignment.test.ts](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/cli/src/__tests__/find-docs-skill-alignment.test.ts) 检查调用风格、库名与安装建议顺序；没有验证 closest match 的兼容性。**[一手：测试源码，未运行]**
- [SDK GetContextCommand](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/sdk/src/commands/get-context/index.ts) 及其 [测试](https://github.com/upstash/context7/blob/33414e6e3fc157c936348ca8ddba25e50dacaeee/packages/sdk/src/commands/get-context/index.test.ts) 将返回 code/info snippets 映射成文档，或原样返回文本；测试用 fixture。其公开片段类型没有强制 resolvedVersion 字段，不可据此宣称所有后端响应都没有版本信息。**[一手：源码/类型与测试，未运行]**

## 社区原帖：支持、反证与已解决状态

### #3309：默认值实质不匹配，且刷新未覆盖生成内容

[原帖](https://github.com/upstash/context7/issues/3309) 由 react-broadcast-sync 维护者于 2026-10-03 提交：索引中的 `_autodocs/types.md` 片段仍说 telemetry 默认 true，而 2.0.0 起已 opt-in，默认关闭；多次 Refresh 后普通 README 已变，片段未变。**[社区：具体报告，未复现]**

[Context7 维护者 10月6日回复](https://github.com/upstash/context7/issues/3309#issuecomment-6012188572) 纠正了报告者的一点前提：那不是仓库中被删除的文件，而是 Context7 生成的文档页，生成于默认值变化前几分钟；这种页当时按月重建，因此普通 Refresh 没更新。回复说已从 main 重建，现已正确显示默认关闭，issue 当日以 completed 关闭。**[社区：维护者解释与处理结果]**

可采用结论：看到 SOURCE 样式链接或刷新时间，不足以确认片段来自当前真实仓库文件/目标版本；关键默认值仍应看真实版本源码。不可采用结论：所有 Context7 文档都按月刷新；Context7 当前仍返回这个错片段；固定版本 ID 一定能消除生成文档风险。**[经验：证据边界]**

### #2772：Versions 列表与最新内容不能混为一谈

[原帖](https://github.com/upstash/context7/issues/2772) 2026-06-16 提供了 Agent 工具调用记录：把 `/ant-design/ant-design` 搜索结果中最高列出的 5.26.2 称为最新发布，报告者指出应是 6.4.4。**[社区：具体调用记录，未复现]**

[维护者回复](https://github.com/upstash/context7/issues/2772#issuecomment-4716597579) 说明当时无版本 ID 的索引已刷新、实际内容对应 6.4.4；Versions 提供的是额外旧标签，不一定枚举最新版本。issue 当日关闭。**因此这是 Agent 解释元数据错误的强例，不是证实 query-docs 返回旧片段的证据。** 回复里使用过 `@版本` 写法，当前固定 Skill/schema 采用 `/org/project/version`；不要把历史回复的语法当成当前推荐命令。**[社区：原帖及维护者反证；一手：当前 schema]**

### #236：精确标签覆盖缺口，保留但不再重复扩写

既有正文已引用 [#236](https://github.com/upstash/context7/issues/236)，本轮读完回复补上结论：维护者在 [2025年5月确认标签尚未索引](https://github.com/upstash/context7/issues/236#issuecomment-2915567105)，并在 [6月20日说明可自行解析 tag/release](https://github.com/upstash/context7/issues/236#issuecomment-2991422342)，随后关闭。它支持“可拼出的版本 ID 不等于已有覆盖”，不能支持今天该标签仍缺失，也不值得另增正文。**[社区：历史单例]**

## 验证范围

本次已读固定查询链、相关测试和三帖回复，未安装或运行客户端、真实查询、目标库编译或模型。不能据源码阅读声称后端当前响应已复现。上述证据支持收紧采用行为，不支持断言全部内容不可靠，也不能把已修复历史问题当成当前故障。
