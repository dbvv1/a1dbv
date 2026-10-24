# 离线把堆快照变成 Agent 可用的持有链

核实：2026-10-24（UTC）。🧪 工具实试；原创建模示例，不是 OpenCode 原码回放，也不是生产故障修复。下列运行结果标为[本仓实试]，外部机制为[一手]，实践者报告为[社区]。

**已拿到堆快照，不必先给 Agent 连浏览器或让它自写 JSON 分析器。** Chrome DevTools MCP 1.12.0 的分析工具可直接读取本地 .heapsnapshot；从摘要、差量和指定对象进入持有链，别把原始大文件放进上下文。

## 解决什么问题

使用者面对内存增长，需要知道“哪种对象仍在、谁持有它”，而不是再收一份可能原因清单。[Eric Guo 的九月复盘](https://blog.cloud-mes.com/2026/09/14/fixing-opencode-memory-leak-in-node-esm-cache/)描述由Codex自写脚本分析大快照；本试用只借其import URL与加载器生命周期错配机制，检验现成工具能否交出可核查链段，没有运行其fork或重新修复OpenCode。[社区／本仓实试]

官方 1.12.0（10-22）将堆分析工具改成 browserless，采集工具 take_heapsnapshot 仍需浏览器。启用分析必须加 --memoryDebugging；本次工具调用未另接模型/API key。[一手／本仓实试]

## 一次重放

从仓库根目录运行；需要 Node.js（本次24.19.0）、npm、Python3、bash、tar与timeout：

    bash experiments/browserless-heap-run.sh

配套源码：[入口](browserless-heap-run.sh)、[采集](browserless-heap-capture.mjs)、[合成模块](browserless-heap-plugin.mjs)、[MCP客户端](browserless-heap-client.py)。

入口在临时目录下载官方注册表的固定包，核SHA-512后运行；不安装全局包、不执行npm生命周期脚本、不修改客户端配置。每次输出目录独立，结束后保留供本人检查，不自动上传或删除。

包来源：https://registry.npmjs.org/chrome-devtools-mcp/-/chrome-devtools-mcp-1.12.0.tgz

integrity：sha512-lAGpH0zXT1ZdaPefP1KK/MvxwihOlu7VGQ7p4wbhD9OhN17vUC4KWk/ImUYR9DE4s+7r4r0ySV4xr2OkTa7ZMA==

使用官方已安装Node，不下载模型/浏览器，不访问网页；MCP server用--memoryDebugging、--no-usage-statistics、--no-performance-crux，环境设CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS=1和CHROME_DEVTOOLS_MCP_NO_USAGE_STATISTICS=1。HOME隔离；采集与server只接收明确环境变量；npm下载另外保留已有代理／CA白名单，不关闭TLS验证、不传npm token或其他凭据配置。采集Node上限256MiB、分析Node老生代上限512MiB，外层超时30/90秒。这是V8老生代预算，不是进程RSS硬限制。客户端中断时停止追加RPC，限定等待后清理自身server进程组；异常退出不报完成。可用`python3 experiments/test_browserless_heap_client.py`复跑单个中断清理回归。[本仓实试]

## 输入和实际结果

自产三阶段快照：初始 → 同一模块以8个不同query URL加载 → 清空本地namespace数组、让出事件循环并GC。每份模块只导出一个持有10万元素数组的RetainedPluginPayload；不会读取会话或凭据。

- 三份文件约4.9、5.0、5.0MB（十进制），原始快照留在临时目录，不进仓库。
- 摘要总size：5,816,412 → 12,426,014 → 12,427,366 bytes；这些是快照模型统计，不是RSS。
- 初始→清理后，Array类别size delta约6,401kB；加载后→清理后总差约+1.4kB。
- query_heapsnapshot_objects返回8个RetainedPluginPayload，each retainedSize约801kB。本次代表nodeId为113715，重放ID会变。
- 实际持有链段：对象 ← Cell ← SourceTextModule ← ModuleWrap ← ModuleJob ← LoadCache ← ModuleLoader。结果明确标了depth/siblings截断，不能说已穷尽全部持有者或完整走到GC root。
- 三份已加载快照均关闭，server退出0。[本仓实试]

只调用initialize、tools/list以及堆摘要、比较、查询、持有链、关闭工具。浏览器路径故意指定为不存在的文件且仍完成上述分析；没有调用take_heapsnapshot或浏览器工具。这支持本次不依赖浏览器，未做系统级网络抓包，不声称已审计全部外发。

## 读者最小委派

“使用我已批准的本地快照。先get_heapsnapshot_summary，然后compare_heapsnapshots比较初始/清理后和加载/清理后；按增长类型query_heapsnapshot_objects，给get_heapsnapshot_retaining_paths传返回的nodeId。交回对象数量、持有链、源码对应和未解项；不读取原始JSON进上下文，不先修改代码，结束close_heapsnapshot。”

已核输入字段：summary传filePath；compare传baseFilePath/currentFilePath；query传filePath/className/nodeType/pageSize；retaining传filePath/nodeId/maxDepth/maxNodes/maxSiblings。输出对象表是CSV字段nodeId,nodeName,type,distance,selfSize,retainedSize，不是@ID列表。客户端从CSV读取ID。持有链深度上限太小可能返回空并标记截断，不能误判为没有持有者；本次使用maxDepth=25，仍仅解释已返回的链段。[本仓实试／经验]

## 怎么判断，而不是怎么刷数

Node以不同完整URL缓存ESM是预期语义；清本地变量不等于清模块缓存。只有应用原本要求这些对象随加载器生命周期释放时，才构成应用层生命周期错配。此示例只证明当前机制和工具读取成立，不证明真实OpenCode修复、Agent准确率、token或费用收益。

快照会暂停被测进程并增加内存压力，也可能改变GC/缓存行为。不要直接给生产进程照抄采集脚本；现有快照可能含凭据、页面和业务数据，必须先核授权和数据流。无需对象持有链时，继续用既有日志/指标，不为装工具增加工作。

## 来源及探索回执

官方、开源实现、中文实践者、linux.do及GitHub讨论原文已查，截止2026-10-24；部分固定fork源码页面缓存抓取失败，因此未声称原码重放。总体最强方案未知。

- 官方发布：https://github.com/ChromeDevTools/chrome-devtools-mcp/releases/tag/chrome-devtools-mcp-v1.12.0
- browserless实现：https://github.com/ChromeDevTools/chrome-devtools-mcp/commit/78c8320c505a7725980a10cb420b72fa59a7322e
- 官方指南：https://developer.chrome.com/docs/devtools/agents/memory
- 中文实践者：https://blog.cloud-mes.com/2026/09/14/fixing-opencode-memory-leak-in-node-esm-cache/
- 范围/负担讨论：https://linux.do/t/topic/2610808
- GC与解释反证：https://github.com/nodejs/node/issues/63186 （读后续维护者评论，非只读首帖Claude解释）

独立接收：全新上下文按本页完整入口重新下载固定包、核完整性并运行三阶段查询，取得8个对象和上述链段，关闭三份快照、server退出0；中断清理及缺少包／输入失败路径通过。仅限本页合成机制与工具入口，非浏览器／模型／生产应用验收。
