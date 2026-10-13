# 上下文工具：按问题选择，先核对读取的版本

> 核实时间：2026-10-13（UTC+8）。本次读取固定源码、测试和原帖，未运行 Aider、clangd 或模型；测试内容阅读不能冒充执行通过。**[一手：固定源码与测试；社区：失败报告；研究：采用判断]**

## 1. 最具体的新反例：文件已经保存，map 仍可按设计返回旧内容

Aider API 当时 main 固定为 `5dc9490bb35f9729ef2c95d00a19ccd30c26339c`（2026-05-22）：

- [get_ranked_tags_map，L585–625](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/repomap.py#L585-L625)：map 缓存键含文件集合、预算，auto 另含提及的文件／标识符，但不含内容或 mtime；若此前生成耗时大于 1 秒，auto 可直接命中 map_cache，根本不到下层按 mtime 更新 tags 的路径。
- [test_repo_map_refresh_auto，L106–158](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/tests/basic/test_repomap.py#L106-L158)：官方测试先让生成耗时 1.1 秒，向磁盘文件追加 functionNEW，随后断言普通获取与旧 map 相等；force_refresh 后才断言出现新函数。files 模式测试也断言内容变更而文件集合不变时 map 不变（L49–100）。**这是测试内容阅读，未执行测试。**
- [cmd_map_refresh，L1426 起](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/commands.py#L1426-L1431) 已调用 force_refresh=True，不需另建索引系统。

**改变选择**：外部工具刚改过源码、map 中找不到新符号时，先刷新或直接读／搜当前文件，不通过增大 map 预算解决旧快照。不能由这个单独方法测试断言所有 Aider 交互轮次都会旧，因为调用者也可能主动强刷。**[一手：固定源码／测试；经验：建议]**

## 2. repo map 给的是启发式入口，不能据此认定跨模块调用者

[同一 SHA 的 repomap.py L451–514](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/repomap.py#L451-L514) 用 tag.name 聚合 definitions/references，并对同名 referencer × definer 连边；同名定义超过五个会降权，并没有借此变成类型／作用域解析。

真实失败原帖 [Aider #2341](https://github.com/Aider-AI/aider/issues/2341)：jbellis 在编辑 Cassandra 时报告 getName 同名碰撞令不相关 FilterPipelineTask 定义排前。当前源码仍可解释“名称图不是精确符号图”这一机制，但已有降权启发式，所以不应把 2024 年的具体排名失败写成当前版已复现。该 issue 关闭且标 stale，也不能当成已修复证据。**[社区：原帖；一手：当前机制]**

**改变选择**：同名方法多、要确认某一个对象类型的调用关系时，map 仅缩小入口，转到能解析该项目的语言服务器／类型系统，而不是扩大排名上下文。

## 3. LSP 能区分语义身份，但它返回的是特定状态下的结果

[clangd 官方索引设计](https://clangd.llvm.org/design/indexing)：引用按 SymbolID 查询；动态 FileIndex 覆盖正在编辑的文件；后台索引依赖编译数据库，逐源文件排队构建。这解释了相较名称图的用途，并不保证每次返回完整。

LLVM 当时 main 固定为 `f1136210323eb4cf169ea544c48fa650275a8c79`（2026-10-13）：

- [Merge.cpp L125–155](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/index/Merge.cpp#L125-L155) 对动态层已覆盖的文件丢弃静态层引用；[IndexTests.cpp L448–515](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/unittests/IndexTests.cpp#L448-L515) 专门构造旧引用，断言动态版本优先、动态删除后旧引用不复活。不能声称 clangd 普遍“没有更新机制”。
- 但 [clangd #2548](https://github.com/clangd/clangd/issues/2548) 的 Chromium 用户报告：插入空行、保存并等索引后，旧位置仍和新位置一起出现，重启才消失。报告版本为 Windows clangd 22.0.0git，配置先跳过后台索引再选择部分目录构建；作者随后明确最小项目无法复现；截至本次可见页面仍 open。故只用作真实异常提醒，不判定当前 SHA 根因或已验证修复。**[社区：原帖，未复现]**

**改变选择**：位置明显对不上当前文本，先读目标位置、核查日志／编译范围／刷新，不继续沿旧引用自动修改；反过来，文本同名命中也不是语义引用确认。

## 4. 未保存缓冲不是“LSP 一定比磁盘更新”的简单关系

当前 clangd [ClangdServer.h L188–189](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.h#L188-L189) 中 UseDirtyHeaders 默认 false；[L483–485](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.h#L483-L485) 用该选项选择 DirtyFS 或底层 TFS。[ClangdServer.cpp L304–313](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/ClangdServer.cpp#L304-L313) 则明确：当前文件使用客户端 Contents，头文件通过 getHeaderFS 读取。[CLI L508–512](https://github.com/llvm/llvm-project/blob/f1136210323eb4cf169ea544c48fa650275a8c79/clang-tools-extra/clangd/tool/ClangdMain.cpp#L508-L512) 对应隐藏选项 use-dirty-headers。

**具体边界**：头文件里未保存的新声明，在另一个翻译单元解析时默认不一定可见；同时磁盘 grep 也看不见该未保存声明。任务若针对编辑器当前状态，应读取对应 buffer 或在用户认可的保存状态上核验，而不是在 LSP 和磁盘搜索之间盲目切换。若目标是磁盘提交版本，也不能把 buffer 引用结果直接套用到磁盘行号。**[一手：源码；经验：推导]**

## 5. 字符串／动态关系：文本搜索补入口，也不是完整证明

Aider 自身就有具体例子：[commands.py L276–296](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/commands.py#L276-L296) 枚举 cmd_ 方法并将命令名替换连字符后拼成 cmd_{name}，通过 getattr 分派。[Python 官方 getattr](https://docs.python.org/3/library/functions.html#getattr) 解释按字符串取属性的运行语义。

针对命令重命名，不仅查某个 cmd_* 方法的普通调用引用，还要读该分派规则、搜索用户输入的命令字符串及文档／测试。若字符串运行时拼接，搜完整方法名也可能只看到定义；应沿构造／注册处追踪。不能写“所有 LSP 都漏所有字符串引用”，有些语言服务器可解析字面量访问；本轮未实跑任一 Python LSP，所以只断言存在动态分派契约，不能断言特定 LSP 的返回集。**[一手：源码／官方文档；经验：建议]**

## 范围与后续价值

已取得两个原始失败报告、固定当前源码和官方测试，足以撤回无条件替代建议；无需再造模板或评估框架。下一轮若值得做，应在实际跨模块修改中验证“漏掉的是动态使用、旧状态还是配置范围”，不按 token 数推测收益。本轮未安装、未执行第三方代码、未模型付费，未验证当前 Aider／clangd 的端到端表现。
