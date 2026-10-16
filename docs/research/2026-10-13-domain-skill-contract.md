主线：二，兼三、四
改变的建议：先复用原生文档、模板和生成器，只为缺失的平台契约、对象配方、生产缺省规则或明确质量目标补窄参考；实际入口已够用就撤回额外 Skill；性能分析显示转换／复制开销明显时，先查能否消除这些工作；续改按新热点与预算，交付选择满足必要行为和目标负载的候选；扩大搜索前先比较轻量候选、全尝试成本和独立复评；几何验收按消费者实际使用的坐标与单位判定；比较扫描结果前锁工具、数据库和判定身份。[经验]
新证据：原研究证据汇总（日期见各节，非本次编辑新增）；Cloudflare 历史迁移、pivot／Seedkit 产物、Next.js 固定三臂定义及设计 Skill；局部表达式／文件结构／AST 探测可复查，但没有完整应用或新模型对照。原生方案也能正确、整包干预混杂，不能宣称 Skill 净收益。2026-10-15 补 pandas 历史性能补丁与 SWE-fficiency 2026 年比较，支持实现机制，不把不同测量拼成同条件对照；同日补 PerfAgent 公开候选及反例，区分论文、保存轨迹和包内源码，未复跑模型。2026-10-16补轻量搜索论文v2及固定记账／复评实现，完整历史成本与选择链仍未取得；同日补 PDF 检查／填充的单位错配，只核源码与示例算术，未渲染。2026-10-17（UTC+8）读取 SkillsBench 指定同题运行，确认 DB 更新、工具版本差异及重复内容；未重跑，不归因 Skill 效果。[一手／研究]

# 窄领域 Skill：平台契约、原生对象与生产配置

> 核实：2026-10-13。长期任务二。第 1–5 节为 Cloudflare 调查（UTC+8）；第 6 节同日追加原生 pivot 调查（UTC）；第 7 节于 2026-10-14（UTC）补核生产缺省契约与历史生成产物。第 8 节同日追加 Next.js 固定源码比较及累计取舍；末节同日追加设计质量目标与历史操作反例。分别执行自行编写的表达式、文件结构与 AST 探测，未部署 Cloudflare、运行 Office/Django 应用或新模型。正文采用建议见 [05 §2.5](../05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么)。

## 1. 为什么选这个来源

任务不是“哪个插件更强”，而是：**将已有聊天室迁到支持空闲休眠的 WebSocket API 时，哪些额外事实实际迫使开发者改变实现？** Skill 是调查入口；历史补丁独立证明实现差异，不能反过来证明当年开发者使用了后来出现的 Skill。

## 2. 从 Skill 到实现的证据链

### 2.1 Skill 提供的是检索路由，完整契约仍在外部文档

固定 Cloudflare Skills 提交 `1f987d740b3fe3be1fe3c1839cfdb5fe1a44f1e1`：

- SKILL.md 第 10–22 行要求按需检索当前文档；第 33–37 行转入三个参考页。[S1]
- rules.md 第 3 行建议空闲 WebSocket 使用休眠并规划恢复；第 16 行指向官方 WebSocket 文档。[S2]
- testing.md 第 19 行明确：连续调用有状态不等于已证明重启恢复；第 3 行要求先查看已有测试依赖，不因加测试自动迁移整套框架。[S2]

它没有凭文本为 Agent 新增 Cloudflare 运行能力，也没有强制模型多想一轮。它主要增加**领域入口、应注意的状态转换和验收选择**。默认先读现有实现与文档可以取得同样事实，因此不能把它当成模型本来不可知的秘密知识。[研究：机制区分]

### 2.2 真正会改变实现的三个契约

固定官方文档提交 `4c8df6273822040a001088725c42e5ec9d456f67`：

1. **连接活着，内存可以消失。** 休眠保留客户端连接、清空实例内存，唤醒后重跑构造器；因此只维护一个内存 sessions Map 不足。需要 `getWebSockets()` 枚举存活连接、读取 attachment 并重建运行时对象。[S3a，第 51–71 行]
2. **回调参数不是传统 MessageEvent。** 文档中的 `webSocketMessage(ws, message: ArrayBuffer | string)` 直接接收消息内容。文本 JSON 的解析表达式应匹配这个形状，而不能照抄 `addEventListener` 的 `event.data`。[S3a，第 130–146 行]
3. **attachment 是连接级序列化快照，不是任意对象存储。** 支持 structured-clone 类型；对象后续变动要再次序列化；连接关闭后 attachment 丢失，超过连接寿命的数据应进入持久存储。[S3a，第 327–348 行]

这三项分别决定**恢复路径、处理函数签名、状态归属**，不是工具名单，也不是“输出多一点代码”。

### 2.3 真实历史补丁承认并修正了这些差异

Cloudflare 官方 `workers-chat-demo` 的 [PR #32](https://github.com/cloudflare/workers-chat-demo/pull/32) 于 2023 年提出迁移，2024-02-28 合并；当前固定读取 `dd32ce87617a9df6c614004d2fc2fb0628698121`，Git 祖先检查确认以下修复仍在其历史中。[S4]

- 初版迁移 `233d52943b7a49ae4acd0f0b2f068b5093904346` 将 `webSocket.accept()` 换成 `state.acceptWebSocket()`，把事件监听移为类方法，并加入 attachment 与构造器恢复。提交说明本身写明仍需测试。[S4a]
- `efcd1e402b69ece88eb2688f3f99e8714e332d80` 把直接写入 attachment 的 limiterId 改为 `limiterId.toString()`，恢复时调用 `idFromString()`。提交说明与注释解释对象 ID 不可直接 clone；限流客户端中的函数也不能整体放进 attachment。[S4b]
- `54f0defb5ae28f943ecb26097f15eca243102b53` 把 `JSON.parse(msg.data)` 修为 `JSON.parse(msg)`。提交说明直接指出新回调收到 String/ArrayBuffer，而非 MessageEvent。同一提交还修了 Map 迭代与遗漏的 `this`，因此不能把整次提交的所有改进都归因于 WebSocket 领域知识。[S4c]
- 当前源码在构造器恢复 limiterId / limiter，在建立会话时保存 limiterId，在接收用户名时再次保存 name；聊天记录使用独立 storage，而非仅依赖 attachment。[S5]

这是一条**真实人工迁移与纠正链**；没有公开模型轨迹或 Skill 使用记录，也没有足以计算开发时长、减少返工百分比的运行记录。PR 合并只证明变更被接受，不证明所有休眠场景均被测过。

## 3. 本轮零成本最小验证

运行已安装 Node.js v24.19.0，自行编写只使用语言内建能力的脚本，比较两条已人工审阅的解析表达式；没有 import、eval 或运行上游模块，也没有安装、模型调用、Cloudflare 账户访问或部署。

| 输入 | 旧式 `JSON.parse(x.data)` | 休眠式 `JSON.parse(x)` |
|---|---|---|
| 有效文本 JSON `{"name":"Ada"}` | SyntaxError | 成功，name 为 Ada |
| 传统事件形状 `{data: '…'}` | 成功，name 为 Ada | SyntaxError |
| 错误文本 `{` | SyntaxError | SyntaxError |
| 缺失消息 undefined | TypeError | SyntaxError |
| 相同 JSON 的 ArrayBuffer | SyntaxError | SyntaxError |

5 类输入 × 2 个表达式，共 10 个预期结果核对通过；主协调方用相同内建表达式独立重跑一致，[保存输出](data/cloudflare-websocket-parser-20261013.jsonl)。这里验证的是**数据形状与 JavaScript 解析的确定性关系**，不是整个聊天室，也不是 Cloudflare 真正的休眠投递。重要反例是：新表达式仅解决文本路径，不能由回调支持 ArrayBuffer 推断应用已经正确处理二进制消息。[研究：本轮表达式实测]

复核用最小脚本：

```javascript
const cases = [
  ['valid_text', '{"name":"Ada"}', false, true],
  ['message_event_shape', {data: '{"name":"Ada"}'}, true, false],
  ['malformed_text', '{', false, false],
  ['missing_message', undefined, false, false],
  ['binary_json', new TextEncoder().encode('{"name":"Ada"}').buffer, false, false]
];
let verified = 0;
for (const [name, msg, oldExpected, newExpected] of cases) {
  const results = [];
  for (const [variant, parse, expected] of [
    ['old_msg_data', x => JSON.parse(x.data), oldExpected],
    ['new_msg', x => JSON.parse(x), newExpected]
  ]) {
    let outcome;
    try { outcome = {ok: true, result: parse(msg)}; }
    catch (e) { outcome = {ok: false, error: e.name}; }
    if (outcome.ok !== expected || (outcome.ok && outcome.result.name !== 'Ada')) {
      throw new Error('Unexpected ' + name + '/' + variant);
    }
    verified++;
    results.push({variant, ...outcome});
  }
  console.log(JSON.stringify({case: name, results}));
}
console.log(JSON.stringify({verified}));
```

**已通过**：固定 Git 对象、历史 diff/当前源码核对、修复提交祖先关系、上述十项表达式结果。**未运行**：真实 Workers/Miniflare 休眠、Cloudflare Vitest、上游聊天室、计费测量、模型对照。**待人工/真实运行判断**：项目的业务状态哪些必须跨连接保存、何时有足够空闲使休眠值得。

## 4. 最小采用、缩减与撤回

### 采用：只为平台相关任务补一个入口

使用 Codex 处理 Durable Objects WebSocket 新增/迁移/恢复故障时，先查当前版本的回调形状、状态寿命、恢复 API 与限制；从仓库已有代码和测试开始。给出的验收应包括文本输入、业务是否允许二进制、失效输入、同一连接跨休眠状态恢复以及断线后的持久数据。[研究：建议]

若要保存可复用指导，最小内容可以是：“涉及 Durable Objects WebSocket 时，先核对当前官方休眠、回调与 attachment 契约；区分连接级状态和持久数据，验证恢复后的业务行为。”再给两条官方入口即可，不必在全局配置中复制所有 API、迁移、部署命令或完整聊天示例。[研究：缩减方案]

### 不适用与反例

- **原生已足够**：模型已从项目类型、官方文档和现有恢复测试得到同样信息时，没有证据要求再加载 Skill；这支持删减重复说明，不支持否定官方文档。[研究]
- **休眠并非一律更好**：官方生命周期列明未完成 I/O、定时器、标准 WebSocket API 等会阻止休眠；持续高频业务或主动外连场景不应仅凭 Skill 推荐强改架构。[S3b，第 47–60 行；S3a，第 312–319 行]
- **官方示例不是完整数据策略**：构造器恢复时刻意将 blockedMessages 设回空数组，函数型 limiter 需要重建；不能把“有 attachment”理解为全部会话状态自动保存。这里仅指出源码边界，没有复现延迟握手丢消息等生产故障。[S5，第 227–239 行]
- **验证器也会共享错误假设**：若单测始终伪造 `{data: text}`，旧表达式会通过，而实际平台文本输入会失败；这在本轮表达式探测中可直接区分。修正输入形状比再加一个读同样假设的 reviewer 更直接。[研究]
- **历史不是当前缺陷**：上述迁移修复在 2023 年完成并于 2024 年合并；不能写成 2026 年平台仍有这两处错误，也不能说强模型必然重犯。[S4]

### 成本与撤回条件

本轮静态字节测量：SKILL.md 为 6,040 字节；rules/testing/workers 三个参考页分别为 2,851 / 2,521 / 7,543 字节，合计 18,955 字节，另有按需官方文档。渐进加载意味着这不是每次实际输入量；字节也不是 token、等待时间或价格。真正新增成本是检索、读取和必要恢复测试；完整插件还可能引入与这项任务无关的能力和配置，不能据此自动安装。[研究：测量与建议]

若在独立真实任务中，无 Skill 的 Codex 已稳定自行检索正确契约，或窄提示并未减少人工纠正/返工，就撤回强制触发，只留项目代码、测试与文档链接。若真实问题是环境不能观察休眠，继续扩写 Skill 不能代替运行反馈；应另在已有且获授权的环境解决可观测性，不把本轮静态探测冒充平台实测。[研究]

## 5. 后续只在什么条件下继续

后续效果问题已由 [§8](#8-累计取舍原生资料短契约还是完整-skill) 收束：需要同任务、同环境的原生／短契约／完整 Skill 实际使用与投入记录。现有机制材料不重复扩成已公开修复的“盲测”，也不据此授权新实验。**[研究：继续条件]**

## 固定一手来源

- **S1**：[Cloudflare Durable Objects Skill，第 10–37 行](https://github.com/cloudflare/skills/blob/1f987d740b3fe3be1fe3c1839cfdb5fe1a44f1e1/skills/durable-objects/SKILL.md#L10-L37)。提交时间 2026-10-12，当前读取。
- **S2**：[rules，第 3–19 行](https://github.com/cloudflare/skills/blob/1f987d740b3fe3be1fe3c1839cfdb5fe1a44f1e1/skills/durable-objects/references/rules.md#L3-L19)；[testing，第 3–23 行](https://github.com/cloudflare/skills/blob/1f987d740b3fe3be1fe3c1839cfdb5fe1a44f1e1/skills/durable-objects/references/testing.md#L3-L23)。
- **S3a**：[官方 WebSockets 文档源码，休眠与接入](https://github.com/cloudflare/cloudflare-docs/blob/4c8df6273822040a001088725c42e5ec9d456f67/src/content/docs/durable-objects/best-practices/websockets.mdx#L51-L71)、[回调类型](https://github.com/cloudflare/cloudflare-docs/blob/4c8df6273822040a001088725c42e5ec9d456f67/src/content/docs/durable-objects/best-practices/websockets.mdx#L130-L146)、[attachment 边界](https://github.com/cloudflare/cloudflare-docs/blob/4c8df6273822040a001088725c42e5ec9d456f67/src/content/docs/durable-objects/best-practices/websockets.mdx#L327-L348)。
- **S3b**：[生命周期源码，第 47–62 行](https://github.com/cloudflare/cloudflare-docs/blob/4c8df6273822040a001088725c42e5ec9d456f67/src/content/docs/durable-objects/concepts/durable-object-lifecycle.mdx#L47-L62)。
- **S4**：[PR #32 原讨论与合并](https://github.com/cloudflare/workers-chat-demo/pull/32)；[固定合并提交 cf996e00d7a96d89dc969347bb8abcc89dea8da2](https://github.com/cloudflare/workers-chat-demo/commit/cf996e00d7a96d89dc969347bb8abcc89dea8da2)。本轮读了讨论与 Git 提交，没有完整历史运行日志。
- **S4a**：[初版休眠迁移 233d52943b7a49ae4acd0f0b2f068b5093904346](https://github.com/cloudflare/workers-chat-demo/commit/233d52943b7a49ae4acd0f0b2f068b5093904346)。
- **S4b**：[ID 序列化修正 efcd1e402b69ece88eb2688f3f99e8714e332d80](https://github.com/cloudflare/workers-chat-demo/commit/efcd1e402b69ece88eb2688f3f99e8714e332d80)；[恢复处第 220–233 行](https://github.com/cloudflare/workers-chat-demo/blob/efcd1e402b69ece88eb2688f3f99e8714e332d80/src/chat.mjs#L220-L233)、[写入处第 300–304 行](https://github.com/cloudflare/workers-chat-demo/blob/efcd1e402b69ece88eb2688f3f99e8714e332d80/src/chat.mjs#L300-L304)。
- **S4c**：[消息回调修正 54f0defb5ae28f943ecb26097f15eca243102b53](https://github.com/cloudflare/workers-chat-demo/commit/54f0defb5ae28f943ecb26097f15eca243102b53)；[父版本第 344–345 行](https://github.com/cloudflare/workers-chat-demo/blob/e50e762bd3d7d0645a0f5d7fed56e55f024828a4/src/chat.mjs#L344-L345)、[修正后第 344–345 行](https://github.com/cloudflare/workers-chat-demo/blob/54f0defb5ae28f943ecb26097f15eca243102b53/src/chat.mjs#L344-L345)。
- **S5**：[当前固定示例恢复第 220–239 行](https://github.com/cloudflare/workers-chat-demo/blob/dd32ce87617a9df6c614004d2fc2fb0628698121/src/chat.mjs#L220-L239)、[接入与 attachment 第 288–304 行](https://github.com/cloudflare/workers-chat-demo/blob/dd32ce87617a9df6c614004d2fc2fb0628698121/src/chat.mjs#L288-L304)、[用户名第 344–352 行](https://github.com/cloudflare/workers-chat-demo/blob/dd32ce87617a9df6c614004d2fc2fb0628698121/src/chat.mjs#L344-L352)、[历史消息持久化第 391–397 行](https://github.com/cloudflare/workers-chat-demo/blob/dd32ce87617a9df6c614004d2fc2fb0628698121/src/chat.mjs#L391-L397)。


## 6. 原生文件对象：创建配方与静态汇总的区别

### 新任务与最小基线

本节调查的是**代码生成报表时，静态汇总能否满足原生 PivotTable 的交付目标**。来源是公开 benchmark 任务，不是已经交付给生产用户的报表案例。SkillsBench 的人口/收入分析要求四张 pivot 表及源数据表，其中 `Quarter` 指收入四分位组 Q1–Q4，并非日历季度。[一手：P1]

同一任务环境预装 openpyxl 3.1.5、pandas 2.2.3 和 pdfplumber 0.11.4；XLSX Skill 给出缓存、字段索引及行/列/数值字段的构造配方，没有新增执行工具。模型本来仍可通过库源码、官方参考、项目生成器取得这些知识。因此可比较的更简单基线是“一条资料入口或直接复用现有生成器”，不应只比较完全没有资料与整份 Skill。[一手：P2–P3；研究：机制判断]

openpyxl 官方文档以保留、修改已有 pivot 为支持方向，明确不以客户端新建 pivot 为设计目标，也没有专门管理 API。开发导出功能时，优先找已经在目标应用验证过的模板；确实需要从零创建且缺少配方时，再试窄参考。[一手：P4；经验：采用顺序]

### 历史效果与实际成本

论文 v1 报告该任务七模型无 Skill 时均未通过，有 Skill 后平均通过率为 85.7%；其 Codex/GPT-5.2 案例曾用静态 DataFrame 整形，缺少 pivot 对象。这是作者历史运行报告，不是本轮模型复跑；后列公开源码快照也未证实与二月论文运行逐字相同。该任务同时提供 PDF Skill，不能将整个增益都归给 pivot 配方。[研究：P5]

公开 verifier 检查对象字段和部分源数据，没有打开 Excel 验证操作/重算，也未逐张充分核对数值字段选中了哪个源列。另有仍 open 的 #996 报告：任务要求保留原始数据，oracle 却 inner join，保留 Other Territories 会被拒绝。因此不把整体通过率直接等同业务正确率，也不据此推翻所有历史对象创建结果。[一手：P6–P7；研究：边界]

固定 XLSX Skill 为 7,845 字节；文件大小不是 token、等待或人的投入。真正需比较的是读取、对象构造返工与版本/客户端验证成本。本轮没有任务级净耗时/净美元证据，不承诺“更快/更便宜”；确定性探测只用已有库与自造数据，没有安装、付费模型或外部服务。[一手：P3；研究：成本边界]

### 本轮可复核的结构探测

以下为本轮自行编写的完整程序，调用已安装 openpyxl 3.1.5，以三条自造数据在内存中操作；没有执行下载的上游脚本或 oracle。协调方独立重跑，JSON 输出一致。这里只检查 ZIP 部件、库对象与重新读取，不进行 OOXML schema 验证或 Excel/LibreOffice 操作。[研究：本轮实际执行]

```python
"""Deterministic representation probe; no model comparison or Excel execution."""
from io import BytesIO
from zipfile import ZipFile
import json, openpyxl
from openpyxl import Workbook,load_workbook
from openpyxl.pivot.table import TableDefinition, Location, PivotField, DataField, RowColField
from openpyxl.pivot.cache import CacheDefinition,CacheField,CacheSource,WorksheetSource,SharedItems
DATA=[['STATE','EARNERS'],['A',10],['A',20],['B',5]]
def wb_base():
 w=Workbook(); w.active.title='SourceData'
 for r in DATA:w.active.append(r)
 return w
def pack(w):
 b=BytesIO();w.save(b);b.seek(0);return b
out=[]
w=wb_base();s=w.create_sheet('Summary');s.append(['STATE','EARNERS']);s.append(['A',30]);s.append(['B',5]);b=pack(w)
assert list(load_workbook(b)['Summary'].values)[1:]==[('A',30),('B',5)]
assert len(load_workbook(b)['Summary']._pivots)==0
out.append({'case':'static_sum_baseline','numeric_summary_correct':True,'native_pivot_count':0})
for cacheid in [0,1,7]:
 w=wb_base();s=w.create_sheet('Summary')
 c=CacheDefinition(cacheSource=CacheSource(type='worksheet',worksheetSource=WorksheetSource(ref='A1:B4',sheet='SourceData')),cacheFields=[CacheField(name='STATE',sharedItems=SharedItems()),CacheField(name='EARNERS',sharedItems=SharedItems())],refreshOnLoad=True)
 p=TableDefinition(name='EarnersByState',cacheId=cacheid,dataCaption='Values',location=Location(ref='A3:B6',firstHeaderRow=1,firstDataRow=1,firstDataCol=1))
 p.pivotFields=[PivotField(axis='axisRow',showAll=False),PivotField(dataField=True,showAll=False)]
 p.rowFields=[RowColField(x=0)];p.dataFields=[DataField(name='Total earners',fld=1,subtotal='sum')];p.cache=c;s.add_pivot(p)
 b=pack(w);r=load_workbook(b);p2=r['Summary']._pivots[0]
 assert p2.cache.cacheSource.worksheetSource.ref=='A1:B4'
 assert p2.dataFields[0].fld==1 and p2.dataFields[0].subtotal=='sum'
 out.append({'case':'native_pivot','input_cache_id':cacheid,'roundtrip_cache_id':p2.cacheId,'native_pivot_count':len(r['Summary']._pivots),'source_ref':p2.cache.cacheSource.worksheetSource.ref,'rendered_cell_values':list(r['Summary'].values),'zip_pivot_parts':[n for n in ZipFile(b).namelist() if n.startswith('xl/pivot')]})
print(json.dumps({'openpyxl':openpyxl.__version__,'results':out,'boundary':'In-memory OOXML structure and openpyxl roundtrip only. No Excel or LibreOffice calculation, UI, external benchmark, or LLM execution.'},indent=2))
```

观察结果：静态基线正确写入 A=30、B=5，但含 0 个 pivot；三个原生对象情境均可重新读取 1 个 pivot，源范围为 `A1:B4`、数值字段为第 2 列且聚合为 sum，ZIP 含 pivot table、cache definition 及关系文件。三个原生情境的工作表已存储单元格值列表均为空；这不说明目标应用打开/刷新成功或失败。[研究：结构探测结果]

**小反例**：输入 cacheId 分别为 0、1、7 时，本地均成功往返，重读 ID 与输入相同；因此 P3 中“非 0 必然令 openpyxl 读取 KeyError”的绝对措辞不成立。但这不证明任意 ID 满足 OOXML 关系或 Excel 要求，不能将该探测当作安全 ID 配方。[研究：局部反例]

**已通过**：上述静态数值、原生对象和库往返断言。**未运行**：完整 benchmark/模型、人口收入数据连接、schema 验证、Excel/LibreOffice 打开、刷新或字段重排。原生对象存在与最终用户可操作是两个验收层次。[研究：验证范围]

### 采用、缩减与撤回

✅ 先确定用户还要操作什么：只需静态数值时，简单汇总即可；需要原生对象时，保留对象和目标客户端行为验收。🧪 只在已有实现/模板缺失且对象构造知识确实导致返工时，补对应版本的窄参考。若项目生成器已经可靠，或原生 Agent 加一条链接即可稳定交付，撤回额外 Skill，保留代码、模板与测试；若目标应用不可验证，不据文件结构宣称已经交付可用。[经验：本仓库采用判断]

这支持 05 §4 按信息缺口与复用价值选择入口，不支持固定“出错两次/粘贴三次”即安装 Skill；当前强模型与短链接基线的净收益仍未确定。[研究：适用边界]

### 原生对象的固定来源

以下 SkillsBench 源码统一固定为 `27738384b1df694ea2ae466e416f476e94d8fab9`，本轮只读，不与二月历史成绩强行绑定：

- **P1**：[task.md](https://github.com/benchflow-ai/skillsbench/blob/27738384b1df694ea2ae466e416f476e94d8fab9/tasks/sales-pivot-analysis/task.md)。
- **P2**：[Dockerfile](https://github.com/benchflow-ai/skillsbench/blob/27738384b1df694ea2ae466e416f476e94d8fab9/tasks/sales-pivot-analysis/environment/Dockerfile)。
- **P3**：[XLSX Skill](https://github.com/benchflow-ai/skillsbench/blob/27738384b1df694ea2ae466e416f476e94d8fab9/tasks/sales-pivot-analysis/environment/skills/xlsx/SKILL.md)、[PDF Skill](https://github.com/benchflow-ai/skillsbench/blob/27738384b1df694ea2ae466e416f476e94d8fab9/tasks/sales-pivot-analysis/environment/skills/pdf/SKILL.md)。
- **P4**：[openpyxl 官方 Pivot Tables 文档](https://openpyxl.readthedocs.io/en/stable/pivot.html)。读取页标题为 3.1.3，本轮运行库为 3.1.5。
- **P5**：[SkillsBench 论文 v1](https://arxiv.org/html/2602.12670v1)，§3.2、I.5 与 I.7 的 sales-pivot-analysis 案例。2026-10-13 本节未读取该任务完整逐次轨迹或重算成本；下文 2026-10-17 的运行复核另属 software-dependency-audit，不补齐 pivot 历史运行。
- **P6**：[verifier](https://github.com/benchflow-ai/skillsbench/blob/27738384b1df694ea2ae466e416f476e94d8fab9/tasks/sales-pivot-analysis/verifier/test_outputs.py)、[oracle](https://github.com/benchflow-ai/skillsbench/blob/27738384b1df694ea2ae466e416f476e94d8fab9/tasks/sales-pivot-analysis/oracle/solve.sh)。仅源码阅读，未执行。
- **P7**：[join 语义争议 #996](https://github.com/benchflow-ai/skillsbench/issues/996)。2026-07-12 原报告，2026-10-13 读取仍 open；没有独立复现其 MAX 运行。

SkillsBench 根 [LICENSE](https://github.com/benchflow-ai/skillsbench/blob/27738384b1df694ea2ae466e416f476e94d8fab9/LICENSE) 为 Apache-2.0；本文未复制整份 Skill 或 oracle，探测为自行编写。openpyxl 已安装元数据为 MIT；若另行转载上游实现，仍须核对具体文件来源与适用版权声明。[一手：许可与本地元数据；经验：复用边界]

## 7. 框架初始化：生产配置缺失时，哪一条知识值得保存

> 核实：2026-10-14（UTC）。只读公开 Skill、历史生成产物、运行器和目标库源码，并执行标准库 AST 静态复核；没有安装依赖、运行 Django、部署或调用模型。

### 采用判断与具体增量

**✅ 保存必要配置的缺省失败契约，而不是为整个框架再加一轮通用检查。** 复用项目已有生成器或官方部署说明，在隔离测试配置下验证实际生产入口：正常配置可用，必要配置缺失时明确失败，不能悄悄回退到开发值；同时核对环境变量与 `.env` 的真实来源。已有原生输出满足时不加 Skill；只有反复遗漏这条契约时，才将其保存在窄参考与现有回归测试里。[经验：采用判断]

本例具体补的是“从环境读取”和“缺失时必须失败”的区别。Django 官方[部署指南](https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/#secret-key)已有无默认值的读取示例，并要求将 `check --deploy` 指向生产设置；它是比完整 Skill 更窄的可用资料入口。官方说明不证明 Agent 在这个任务里实际读取了它。[一手：官方文档；研究：替代入口]

### 从配方到实际生成文件

1. 运行前已存在的 Seedkit [`new-project.md`](https://github.com/viewflow/seedkit/blob/0cd958aa4f02bd6c84769fc4e8f4048dc1341a9f/skills/seedkit/references/new-project.md)明确给出：`DEBUG` 默认 false，开发后备值只在其为 true 时使用，否则传 `env.NOTSET`；WSGI/ASGI 默认生产设置。该历史提交不是原始运行日志中的版本回执，不能仅按时间证明实际运行逐字加载了它。[一手：固定配方；研究：绑定边界]
2. 产物提交 `3b2375ebbea72361a5784872664fb828bda985da`同时发布 Sonnet 5 的两臂。无 Skill 的 `02-shop`在 base 给 `SECRET_KEY` 一个可用硬编码后备值，production 没有覆盖；有 Skill 的 base 将 false 分支指向 `env.NOTSET`，production 也没有覆盖。双方 WSGI 均默认 `config.settings.production`。可见的差异在配置表达式，不是只凭评分或 README 推断。[一手：下列 S6–S11]
3. 两臂锁定的 `django-environ`均为 **0.14.0**。官方 tag 解析到完整提交 `6e1b461125e2313cae362e1ab9426a97d9e843b0`；其 `get_value`在环境中找不到变量且 default 为 NOTSET 时抛 `ImproperlyConfigured`，否则返回 default。由此可确认上述表达式的局部含义：在 `DJANGO_DEBUG`为 false、环境及 `.env`均未提供密钥的前提下，两份代码会作出不同选择；没有启动整个应用证明首个报错、数据库或外部服务可用。[一手：S13、锁文件；研究：静态解释]

这里没有创造新执行能力；可保存的最小知识就是必要值缺失时的行为及其生产入口。也不能倒推所有差异都由这段配方引起：完整 Skill 还包含其他参考、选项与操作步骤，没有“仅给这一条资料”的运行臂。[研究：增量边界]

### 反证、成本与停止条件

- **原生也能满足。** 同任务另一次 Opus 5 无 Skill 产物在 production 重新读取无默认值的 `env.str("DJANGO_SECRET_KEY")`，覆盖 base 的开发后备值。检查只读 base 会误判这一产物；因此验收对象必须是实际入口及覆盖关系，不能要求所有配置都按同一种布局书写。[一手：S12；经验：采用建议]
- **少修正不等于已省时间。** 固定[结果表](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/results-claude.tsv)中，Sonnet `02-shop`的 `fixes`为无 Skill 6／有 Skill 2，`build_s`为 911／1015，`tool_calls`为 145／210。`fixes`由生成 Agent 自报；`build_s`只计构建阶段，不含之后的独立审阅/评分，更不是人的主动工时。未取得原始运行日志，不将这些公开汇总写成本轮测量。[一手：表与运行器；社区：历史运行报告]
- **两臂工作量并不相同。** 历史 [Skill runner](https://github.com/viewflow/seedkit/blob/0cd958aa4f02bd6c84769fc4e8f4048dc1341a9f/train/run-tests.sh#L297-L348)在 Prompt/Boot check 外注入 Deploy check；[baseline runner](https://github.com/viewflow/seedkit/blob/0cd958aa4f02bd6c84769fc4e8f4048dc1341a9f/train/run-baseline.sh#L202-L256)没有。这一额外生产验收也可能影响产物与投入，不能把上面的时间差或修正差归因为 Skill 的净效果。两臂还分别锁定 Django **6.0.7／5.1.15**，不是相同框架环境的纯知识消融。[一手：运行器与锁文件；研究：因果边界]
- **保留真实适用范围。** 该配方以 DEBUG 值作开关，不保证误设 `DJANGO_DEBUG=True`仍拒绝开发后备值，也不检查显式给入的值是否足够随机；缺失保护不是完整安全审计。正文推荐实际生产入口的缺省验收，不直接照抄整个 Skill 或它的权限设置。[一手：表达式；经验：采用边界]
- 本轮已得到可执行的窄建议。只有获得真实部署结果、当前模型的一条资料基线或接收者投入后，再追净收益；不继续堆同类初始化样例。[研究：停止条件]

### 独立可复核的静态检查

将下方八个固定源文件按表中的本地别名保存到同一个临时目录，保存以下程序为 `probe.py`，运行 `python3 probe.py <源文件目录>`。程序仅用标准库解析 AST，不 import/执行这些源文件。当前环境没有 Django 或 django-environ，本轮未安装；语法与分支结构通过不能冒充启动成功。[研究：实际验证范围]

| 本地别名 | 固定来源 |
|---|---|
| `skill-base.py` | S6：[02-shop/config/settings/base.py](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/02-shop/config/settings/base.py) |
| `skill-production.py` | S7：[02-shop/config/settings/production.py](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/02-shop/config/settings/production.py) |
| `skill-wsgi.py` | S8：[02-shop/config/wsgi.py](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/02-shop/config/wsgi.py) |
| `baseline-base.py` | S9：[baselines/sonnet/02-shop/config/settings/base.py](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/baselines/sonnet/02-shop/config/settings/base.py) |
| `baseline-production.py` | S10：[baselines/sonnet/02-shop/config/settings/production.py](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/baselines/sonnet/02-shop/config/settings/production.py) |
| `baseline-wsgi.py` | S11：[baselines/sonnet/02-shop/config/wsgi.py](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/baselines/sonnet/02-shop/config/wsgi.py) |
| `opus-production.py` | S12：[baselines/opus/02-shop/config/settings/production.py](https://github.com/viewflow/seedkit-examples/blob/954415ff4b5197f4ca222b52cf0850d5a974dc86/baselines/opus/02-shop/config/settings/production.py) |
| `environ.py` | S13：[environ/environ.py](https://github.com/joke2k/django-environ/blob/6e1b461125e2313cae362e1ab9426a97d9e843b0/environ/environ.py) |

```python
"""Read-only AST checks, not Django execution. Usage: python3 probe.py SOURCE_DIR"""
import ast
import json
import sys
from pathlib import Path

root = Path(sys.argv[1])
names = ["skill-base.py", "skill-production.py", "skill-wsgi.py",
         "baseline-base.py", "baseline-production.py", "baseline-wsgi.py",
         "opus-production.py", "environ.py"]
trees = {name: ast.parse((root / name).read_text()) for name in names}

def assignments(tree, name):
    return [node.value for node in tree.body if isinstance(node, ast.Assign)
            and any(isinstance(t, ast.Name) and t.id == name for t in node.targets)]

def expr(tree, name):
    values = assignments(tree, name)
    if len(values) != 1:
        raise ValueError(f"{name}: expected one assignment")
    return ast.unparse(values[0])

def production_entry(name):
    return any(isinstance(n, ast.Call)
               and ast.unparse(n.func) == "os.environ.setdefault"
               and [ast.literal_eval(a) for a in n.args]
               == ["DJANGO_SETTINGS_MODULE", "config.settings.production"]
               for n in ast.walk(trees[name])
               if isinstance(n, ast.Call)
               and ast.unparse(n.func) == "os.environ.setdefault")

checks = {
    "python_syntax_files": len(trees) == 8,
    "both_wsgi_default_to_production":
        all(production_entry(n) for n in ["skill-wsgi.py", "baseline-wsgi.py"]),
    "sonnet_baseline_keeps_usable_fallback":
        expr(trees["baseline-base.py"], "SECRET_KEY")
        == "env.str('DJANGO_SECRET_KEY', default='django-insecure-change-me-in-production')"
        and not assignments(trees["baseline-production.py"], "SECRET_KEY"),
    "skill_default_false_selects_notset":
        expr(trees["skill-base.py"], "DEBUG")
        == "env.bool('DJANGO_DEBUG', default=False)"
        and expr(trees["skill-base.py"], "SECRET_KEY")
        == "env('DJANGO_SECRET_KEY', default='django-insecure-build-only' if DEBUG else env.NOTSET)"
        and not assignments(trees["skill-production.py"], "SECRET_KEY"),
    "opus_production_overrides_without_default":
        expr(trees["opus-production.py"], "SECRET_KEY") == "env.str('DJANGO_SECRET_KEY')",
}
env_class = next(n for n in trees["environ.py"].body
                 if isinstance(n, ast.ClassDef) and n.name == "Env")
getter = next(n for n in env_class.body
              if isinstance(n, ast.FunctionDef) and n.name == "get_value")
handler = next(n for n in ast.walk(getter)
               if isinstance(n, ast.ExceptHandler) and ast.unparse(n.type) == "KeyError")
checks["library_missing_without_default_raises"] = (
    ast.unparse(handler.body[0].test) == "default is self.NOTSET"
    and any(isinstance(n, ast.Raise) and isinstance(n.exc, ast.Call)
            and ast.unparse(n.exc.func) == "ImproperlyConfigured"
            for n in ast.walk(handler.body[0]))
    and ast.unparse(handler.body[1]) == "value = default"
)
if not all(checks.values()):
    raise RuntimeError(checks)
print(json.dumps(checks, sort_keys=True))
```

本轮实际 stdout（退出码 0）：

```json
{"both_wsgi_default_to_production": true, "library_missing_without_default_raises": true, "opus_production_overrides_without_default": true, "python_syntax_files": true, "skill_default_false_selects_notset": true, "sonnet_baseline_keeps_usable_fallback": true}
```

从本文代码块重新提取程序后输出相同；缺少输入文件、把 baseline 的目标表达式改成另一值，两项探测器自检均以退出码 1 拒绝。它们只验证静态检查器不会对缺失或不匹配的输入报通过，不是额外 Django 行为测试。[研究：本轮实际执行]

版本来源：[Skill 臂 uv.lock](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/02-shop/uv.lock)、[Sonnet baseline uv.lock](https://github.com/viewflow/seedkit-examples/blob/3b2375ebbea72361a5784872664fb828bda985da/baselines/sonnet/02-shop/uv.lock)；`fixes`解析及计数语义见[历史 agents.sh](https://github.com/viewflow/seedkit/blob/0cd958aa4f02bd6c84769fc4e8f4048dc1341a9f/train/agents.sh#L302-L368)。未重算整套成绩，也未据八项静态评分宣称软件已可上线。[一手；研究：范围]


## 8. 累计取舍：原生资料、短契约还是完整 Skill

> 核实：2026-10-14（UTC）。只读公开定义和文档、比较固定源文件；没有安装、运行 Next.js／评估器／新模型，也未获取非公开结果。

### 决策及本次改变

**✅ 默认保留当前版本的原生资料与已有生成器；按缺口补精确入口或短验收契约，完整 Skill 只作有条件试用。** 原有 §4 已按信息缺口而非固定次数选择，本次不是再撤回“出错几次就安装”，而是把“已有资料足够”拆开：资料可达不等于实际读到，读到不等于执行了必要顺序，操作配方也不等于获得运行能力。读者可据此避免为检索问题安装完整迁移流程，或用更多文字掩盖缺少运行环境。[经验：累计判断]

前面 Cloudflare 证明契约改变实现，pivot 证明静态结果不等于原生对象，Seedkit 给出产物差异和无 Skill 也能正确的反例；它们都未分离短资料与完整 Skill。新增 Next.js 的价值是公开定义同时存在三种入口，可核对同版本知识究竟在哪，而非再堆一个 API 错误。[研究：证据累计]

### 固定任务与三臂，不能把 baseline 叫作“无文档”

以下源码统一固定 `vercel/next.js@8521c6ae04998fc8ff87ae0d3de24e1fa4e88803`。N1 要求迁移音乐目录的 Partial Prefetching，三种 eager Aurora 链接点击后立即呈现标题和艺术家，推荐内容可流式到达，并保留回归覆盖。[一手：N1]

N2–N3 中三臂都安装同一 Next tarball、执行相同 fixture setup；包内文档原本可读。`agents-md` 另写先读 bundled docs 的短指令，`skills` 则预装本地 Skill，不另写该指令。生成配置使用相同 Claude Code、`claude-opus-4-8`、Haiku judge、build、runs；046 的 1800 秒上限同样传给各臂。它们首先比较**发现方式与预装入口**；相同时间上限不等于实际投入相同，也不是任何历史运行的版本回执。046 的 package.json 没有 `@playwright/test`，共享安装 helper 因此提前返回，不能写成三臂已预装浏览器；Skill 要求补缺失测试依赖仍是待执行操作。[一手：N1–N4；研究：解释]

### 原生路径覆盖了什么，Skill 另加什么

| 实现／验证决定 | 同版本原生 guide N5 | Skill N6 的增量 |
|---|---|---|
| 审计 explicit true、bare prop、有效值为 true 的 wrapper；排除 auto／false | L81–87 已给出 | 强调跨整个源码树追踪 wrapper，而非只 grep `app/` |
| 用 `@next/playwright` 的 `instant()` 检验真实链接点击 | L89–112 已有示例 | 引向 rig-template，处理没有现成测试环境的情况 |
| 生产模式 flag-off 取得基线，迁移后重跑相同测试 | L114 已说明；L39–52 先审计再开启 | L19–23、L86–98 强化为基线实际通过前禁止改业务代码的顺序门 |
| session 在缓存外读取，再作为参数传入 | L175–257 已给例子 | 将缓存与失效验证纳入逐步验收 |
| 移除临时 route export | L352–358 已给官方 codemod | 纳入全局开关后的执行顺序 |

这是固定内容的人工覆盖比较，**不是五项模型测试通过**。下载后可离线按上述行号复查 N5/N6，再检查 N2/N3 的三臂 setup；未执行源文件。读取完整 Git tree（`truncated:false`）确认该 Skill 包只含 `SKILL.md` 与 `rig-template.md`，没有新增可执行脚本；N7 提供生产构建、端口／进程、测试 API、认证状态与产物存活核对等配方。内容引用其他工具或安装命令，不代表工具已可用或权限已获准。[一手：N2–N3、N5–N7；研究：只读复核]

据此区分竞争解释：关键领域事实并非 Skill 独占；新配方可能减少测试环境摸索，但不是新增执行能力；更严格的顺序和更多验证可能减少返工，也可能增加成本。缺少实际读取与执行轨迹时，不能在这些解释中选定净收益来源。[研究]

### 为什么当前公共结果仍不能裁决净收益

- **docs 可进入 Skill。** N5 L23–36 推荐安装该 Skill，N3 L294–299 明示 docs 变体有意沿链接进入 canonical skills。因此不能把它视为禁止 Skill 的纯文档消融；没有轨迹也无法确认 baseline 实际未使用 Skill。[一手；研究]
- **定义不是原始运行。** N4 的 046/047/050/051/055 标记 `publish:false`，但 N2 不消费该字段，不能仅凭标记断言结果未公开。N8 排除 `evals/results/` 与 `evals/agent-results.json`，本轮完整树未发现 tracked results。未取得绑定三臂同一构建、权限、输出和实际成本的记录；这描述本轮获取范围，不宣称所有公开渠道都不存在记录。[一手；研究]
- **分数还含过程符合性。** N9 前三项用源码正则，后三项用环境／轨迹 judge，其中最后一项要求实际先通过 flag-off 基线，再保留断言完成迁移。其要求合理但不等于只测最终软件行为；分数若提高，仍应区分顺序符合和交付质量。[一手；研究]
- **公开榜不能代替这组三臂。** N10 读取时最近运行日期为 2026-09-25，注明 pass@4、AGENTS 列为 additional passes、基础设施失败丢弃重跑，新题未跑计入分母、重做题保留旧结果直到复跑。因此不能当独立 pass@1 两臂，也不能把相同百分比当成质量等价；未取得046完整 Skill 的对应结果。[一手：公开口径；研究：适用边界]

### 采用与撤回边界

找不到／读错版本时先给精确入口；已读但漏掉“迁移前基线→断言不变→迁移后验证”时，先补这条短契约并复用现有 rig。窄补充仍留下可定位的跨步骤遗漏时，可试完整 Skill；明确质量目标也可成为入口，边界见[末节](#质量提升领域依据目标与过程分开判断)。分别记录新事实、操作配方、实际执行与人的等待。必要行为不退步、返工减少且总投入在事先接受范围内才保留；原生或短契约已经满足、遗漏不改善或额外打断不值得时撤回。若环境无法执行或观察，优先解决获授权的能力缺口，不继续扩写文字。[经验：采用判断]

**尚不能由源码消除的缺口**：同任务／构建／模型／权限下，具有实际资料读取、Skill 使用、逐项行为与成本记录的配对运行，并有真正短契约臂；否则只能解释入口策略。此缺口不阻止采用较小补充，但阻止宣布它已量化胜过完整 Skill。本轮不以未经授权的模型实验填补，也不继续增加相似机制案例。[研究]

### 本节来源

- **N1**：[046 PROMPT.md](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/evals/evals/agent-046-adopt-partial-prefetching/PROMPT.md)、[fixture package.json](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/evals/evals/agent-046-adopt-partial-prefetching/package.json)。
- **N2**：[run-evals.js，基础变体与生成配置](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/run-evals.js#L41-L90)、[同 timeout 与 skills 变体](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/run-evals.js#L133-L165)。
- **N3**：[setup.ts，按依赖决定是否安装浏览器](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/evals/lib/setup.ts#L79-L90)、[bundled-docs 指令](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/evals/lib/setup.ts#L181-L210)、[Skill 安装及跨入口说明](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/evals/lib/setup.ts#L294-L325)。
- **N4**：[eval.config.json](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/evals/eval.config.json)。
- **N5**：[官方 adoption guide](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/docs/01-app/02-guides/adopting-partial-prefetching.mdx)。
- **N6**：[Skill](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/skills/next-partial-prefetching-adoption/SKILL.md)。
- **N7**：[rig-template.md](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/skills/next-partial-prefetching-adoption/rig-template.md)。
- **N8**：[根 .gitignore](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/.gitignore#L85-L89)、[evals README](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/evals/README.md)。
- **N9**：[046 EVAL.ts](https://github.com/vercel/next.js/blob/8521c6ae04998fc8ff87ae0d3de24e1fa4e88803/evals/evals/agent-046-adopt-partial-prefetching/EVAL.ts#L39-L74)。
- **N10**：[公开 Next.js Agent Evals](https://nextjs.org/evals)，2026-10-14 读取的统计说明；动态页面，不绑定本节源码快照或一月历史博客结果。

## 质量提升：领域依据、目标与过程分开判断

> 核实：2026-10-14（UTC）。只读固定 Skill、许可、W3C 技术说明与官方历史复盘；没有生成界面、运行模型或验证真实用户任务效率。

### 改变的建议

**✅ 功能可用并不排除有依据的质量改进。** 05 原有的资料、顺序与能力缺口仍成立；本节补充“明确质量目标”这一入口，不把跨步骤遗漏设为试用 Skill 的唯一前提。先复用项目 brief 与设计系统；需要跨任务复用的领域依据可保存为窄 Skill。是否保留看目标用户的实际操作及修改成本，而非只看截图的新颖程度。[经验：采用判断]

### 固定文本里的四种不同输入

固定读取 `anthropics/skills@dbd4588f9e1033efb41dad4bef2f7947c8993d44` 的 frontend-design；这份 2026-10-09 版本不是下面三月实验的版本回执。[一手：D1；研究：版本边界]

- **设计依据**：视觉结构表达信息关系；编号要对应真实序列，动作反馈与名称要保持可理解的一致性。
- **目标／偏好**：强化视觉身份、避开模板化默认值；同时以具体 brief 为先。这不能推出所有工作台都应优先追求新颖。
- **流程**：先计划，再对照 brief、实现与自评；整包试用会同时改变过程。
- **工具能力**：截图审阅依赖现有环境支持，文本没有创建浏览器执行能力。

以上是内容分类，不是效果测量，也不证明模型原本不知道这些原则。[一手：D1；研究：分类]

### 一项可采用的机制：让信息关系决定结构

并列产品能力不要仅为版式装饰标成 01/02/03；有先后依赖的操作则应显示步骤。前者避免暗示不存在的顺序，后者帮助理解下一步。HTML 的对应依据是 W3C H48：有序、无序及名称—值关系分别有适当的列表结构，辅助技术可据此导航。H48 是充分技术之一，不是唯一合规实现；本例不声称所有编号都代表操作依赖。[一手：D1、D2；经验：应用推导]

这比“再评审一次”多给了一项可判断的选择依据，也不依赖任何特定字体。反过来，不能为避开常见版式而删掉真正步骤；适合品牌展示的视觉偏好也不能自动替代高密度任务中的检索、比较与操作需求。[经验：采用边界]

### 历史产物和操作反例：漂亮仍可能不知下一步

Anthropic 2026-03-24 的游戏制作器复盘公开了同一初始提示的两臂界面及作者实际操作反馈：完整 harness 的 planner 读取 frontend-design，作者报告界面与可玩性改善，但仍需自行探索“先创建 sprite/entity，再填充关卡”的顺序。它支持视觉改善不自动解决任务引导这一反例，不是独立终端用户研究。[一手：D3，作者操作报告]

**不能归因给固定 Skill**：三月实验实际使用的 Skill 提交未锁定，更不能绑定十月文本；两臂同时改变代理架构、迭代、规格和投入，单代理为 20 分钟／9 美元，完整 harness 为 6 小时／200 美元，并由短提示扩展成 16 项功能。该报告不能拆出设计依据、流程或额外预算各自的贡献，也不能证明编号原则已被应用或测量。保留本例是为了限制视觉质量结论，不是推荐整套 harness。[一手：D3；研究：因果边界]

2025-11-12 官方文章另有 dashboard 前后图片，但未提供操作效率或真实任务使用反馈；后半的 web-artifacts-builder 还引入工具脚本，不能与纯设计指导混算。本文不据展示图宣称质量上限或当前模型净收益已经提高。[一手：D4；研究：证据边界]

**停止条件**：已有资料足以支持“质量目标也可成为入口”与信息关系这条窄建议。后续只有取得绑定版本的产物、实际操作反馈与投入，才继续追效果；不为补数字另跑未经授权的模型实验。[经验：研究取舍]

### 来源与许可

- **D1**：[固定 frontend-design](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/SKILL.md)。
- **D2**：[W3C H48：列表关系与语义](https://www.w3.org/WAI/WCAG22/Techniques/html/H48)，页面标注 2026-01-12 更新。
- **D3**：[Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)，2026-03-24，游戏制作器的两臂展示与作者操作反馈。
- **D4**：[Improving frontend design through Skills](https://claude.com/resources/articles/improving-frontend-design-through-skills)，2025-11-12，展示与工具配方边界。

D1 同目录固定 [LICENSE.txt](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/frontend-design/LICENSE.txt) 为 Apache-2.0；本文仅分析和少量转述并链接来源，没有复制整份 Skill、代码或图片，不将该许可外推至官方博客。[一手：许可；研究：使用范围]


## 性能质量：先消除表示转换与重复复制

> 核实：2026-10-15（UTC）。只读公开 PR、固定补丁、官方 API 文档和论文 v3；未运行 pandas、Arrow、基准或模型。新证据是 2026 年公开的历史模型比较，原生产补丁发生于 2023 年。采用建议只落 [15 §7](../15-task-playbooks.md#7-性能优化)。

### 改变的选择

**✅ 已有 profiler／调用链显示对象化、转换、分配或复制开销明显时，优先检查能否复用已有后端消除工作，再决定是否需要缓存或特殊快路径。** 更高层的算法或 I/O 是主要瓶颈时应先处理那里；两项 pandas 案例不构成所有性能任务的固定优化次序。 这类领域依据提供的是实现选择：同样输出可以经由不同存储表示和调用边界产生。若 Agent 已选对路径，不必增加指令；本例不推荐安装 Skill，也不要求每个任务重构。[研究：机制；经验：采用判断]

### 含 NULL 的比较：保留掩码，避免 object 中转

2023-01 的 pandas #50524 优化 ArrowExtensionArray 比较。原实现将 Arrow 结果转为 NumPy，再交给 BooleanArray 的通用序列构造；作者明确将开销归于含空值时的 object 数组转换。其公开负载为一百万个随机浮点数、首元素 NaN，构造 `float64[pyarrow]` 后测 `arr > 0`；原版 80.5ms ±619µs，补丁版 4.05ms ±11.4µs，均为七次运行的均值／标准差，但每次分别10与100 loops。维护者批准后合并。[一手：P1，作者测量而非本仓复测]

固定补丁 `d555c1d83b3ff1459e17d6940b594a5f1bbce8c3` 在有空值时先用 Arrow 的 `fill_null(result, False)` 得到值数组，另从原结果提取缺失掩码，直接构造 BooleanArray；无空值时使用全 False 掩码。代价是显式维护值／掩码及分支，未新增依赖或跨调用缓存。[一手：P2]

**False 只是被掩码遮住的存储占位，不能删除掩码、把缺失结果改成 False。** 当前官方文档确认 BooleanArray 用值与缺失掩码两组数组表示，mask=True 表示缺失，逻辑运算保留三值语义；这用于解释契约，不冒充 2023 年版本回执。后续若验证自己的改动，应覆盖有／无／全缺失与不同规模，而不是只重复一个 NaN 的速度负载；这些是待执行验收建议，不是本轮已通过用例。[一手：P3；经验：验收建议]

### 近期 Agent 比较说明什么

2026-06-27 的 SWE-fficiency v3 Fig.8 / Appendix M 公开该任务的专家与 Claude 3.7 Sonnet／OpenHands 补丁，报告20.5×与2.3×。模型补丁仍在有空值路径做 `to_numpy().astype(bool)`，没有消除同一表示转换。论文 Fig.9 同时给出反例：Series.to_dict 上 GPT-5 Mini 的方案达到1.98×，高于专家1.38×，说明专家补丁并非该负载上性能收益的上限。[一手：P4，作者历史实验]

**不能把 P1 的80.5／4.05ms与 P4 的倍数拼成同条件横向测量。** 前者是 PR 作者的 `%timeit` 报告；后者是论文评估。本文未取得足以逐项绑定两者环境、随机输入、计时设置与原始输出的记录，也未核到该模型产物逐项正确性回执、费用与主动工时。论文比较没有给同一 Agent 增补短领域依据或完整 Skill 的消融；原库实现也不是证明由原生 Agent 首次生成的产物。因此只据可见补丁说明候选机制，不推断当前 Codex／Claude 缺少这项知识或 Skill 能取得对应差额。[研究：证据边界]

### 复制边界：转换已分配时，别再复制一次

2023-03 的 pandas #52054 优化 `DataFrame(arr, dtype="int32", copy=True)`；作者报告6.01ms ±37.9µs→3.54ms ±25.4µs，均为七次运行、每次100 loops，维护者批准并合并。[一手：P5，作者测量]

补丁在构造器的类型转换前依据 `astype_is_view` 决定是否保留原复制请求：目标 dtype 未指定或转换可能返回视图时仍复制；转换不共享原存储时，跳过前面多余的复制。领域判断在于跨步骤辨认“后续转换已经承担分配”，不是无条件把 `copy=True` 改为 False。[一手：P6；研究：实现解释]

**反例是同 dtype／可能共享存储的转换：直接去掉复制可能让输入与结果别名相连，后续修改不再隔离。** 自己采用类似优化时，应核查修改输入或结果后的隔离契约；这是从补丁条件推出的验收要求，不是本轮已复现的回归。该例支持沿调用链减少重复工作，不足以泛化为“所有转换都应零拷贝”。[研究：反例推导]

### 取舍与停止

两例都让现有后端和表示知识进入实现选择，收益不依赖增加自评轮数。但未测新方案在所有规模上的收益、峰值内存或维护工时；可见分支增加也不自动等于维护成本降低。本轮停在机制与窄建议，不复刻模型榜单，不把2023年补丁包装成近期生产成果，也不为补齐归因启动实验。[研究：采用边界]

### 来源

- P1：[pandas #50524，原始负载、计时与合并](https://github.com/pandas-dev/pandas/pull/50524)。
- P2：[固定合并补丁 d555c1d](https://github.com/pandas-dev/pandas/commit/d555c1d83b3ff1459e17d6940b594a5f1bbce8c3)，重点为 `pandas/core/arrays/arrow/array.py`。
- P3：[BooleanArray 官方 API](https://pandas.pydata.org/docs/reference/api/pandas.arrays.BooleanArray.html)、[Arrow fill_null 官方 API](https://arrow.apache.org/docs/python/generated/pyarrow.compute.fill_null.html)；读取时分别为 pandas 3.0.6、Arrow 25.0.1。
- P4：[SWE-fficiency v3](https://arxiv.org/html/2511.06090v3)，2026-06-27，Fig.8/9 与 Appendix M；不同于持续变化的项目首页。
- P5：[pandas #52054，原始计时与合并](https://github.com/pandas-dev/pandas/pull/52054)。
- P6：[#52054 已合并差分](https://github.com/pandas-dev/pandas/pull/52054/files)，`pandas/core/internals/construction.py` 的 `_copy` 与 `astype_is_view` 条件；本轮读取合并 PR 差分，未取得可打开的完整提交页，不将短 SHA 当固定源码核验。


## 性能续改：观测层与候选选择

> 核实：2026-10-15（UTC）。主线二／三；只读论文、公开产物及源码，用标准库核算保存报告和比较补丁，没有运行上游、模型或性能基准。采用建议只落 [15 §7](../15-task-playbooks.md#7-性能优化)，不新增优化框架或模板。

### 先借现有反馈，再决定是否续改

**[研究：采用判断]** 已有正确加速仍未达目标，且新热点表明有具体改善机会时，可在既定预算内继续；先补缺失的观测，不默认换模型、安装完整框架或强制五轮。Python 调用层只显示 native 入口而不能解释内部耗时时，可借支持该层的现成 profiler；[py-spy 原生能力说明](https://github.com/benfred/py-spy#can-py-spy-profile-native-extensions)要求显式 `--native`，并受平台、符号和 Cython 生成文件条件限制。已有观测足够就保留原工具。**[一手：工具契约，非效果复测]**

[PerfAgent 论文 v1](https://arxiv.org/html/2607.19653v1)的同作者消融区分计时、测试和 profiler 反馈，支持考察反馈内容而非只增加循环。其 §VI 承认 Python 覆盖选择可能漏 native 回归，也未测将整套流程加到 Codex／OpenHands 后的收益。这里借机制，不按论文排名推荐框架；各版本结果不合并，身份边界见下文。**[一手：作者研究；研究：迁移边界]**

### 可复核候选：中间版本与最后版本不同

公开 [Zenodo 22921624 产物](https://zenodo.org/records/22921624)保存了 `numpy__numpy-2540554` 的五次候选：相对可见负载基线的 speedup 为 0.983／18.27／40.31／35.49／38.22。发布预测的 diff 与第三次逐字相同，与末次不同。第三次修改 `numpy/lib/recfunctions.py` 的 `structured_to_unstructured`：在不要求复制、连续内存、基础类型与字段偏移符合条件时返回 view，保留其他路径。**[一手：保存轨迹与补丁；本轮静态比对]**

同包最终 GSO 报告将该候选列为正确且达到专家优化门槛；多负载几何平均为相对基础 **2.69×**、相对专家 **1.09×**，部分负载仍慢于专家。可见负载约40×不是整体交付收益，也不能由“中间数最大”证明统计最优。**[一手：保存报告，未重测]** 因此保存可恢复候选，最终按目标负载与必要行为选择；无需自动交末版或追最高单次数字。目标满足、没有新依据或预算到限就停止。**[研究：采用判断]**

### 反证：通过测试仍可能删掉必要行为

同包 `pandas-dev__pandas-2a08b05` 在 GSO 报告中通过正确性与优化门槛，却被其模型裁判标为违反复制语义。发布补丁可独立静态核对：`pandas/_libs/lib.pyx` 的 `ensure_string_array` 删除了原先 `copy=True` 且结果仍为输入时的必要复制；object dtype 字符串数组沿 `continue` 路径可直接返回原数组。裁判结果不是唯一依据，也不据此推断 Agent 有意作弊。**[一手：补丁、保存评分与裁判输出；研究：静态路径判断]**

这支持前节已有的复制／别名守门，不另立一套检查表：必要语义不能被计时收益抵消。没有运行 Cython 或重放测试，因此这里只确认公开补丁的风险机制，不报告新复现成功率。**[研究：采用边界]**

### 机制可借，运行身份不能拼接

包内 `src/perfagent/agent.py` 先构建、测试再记录计时候选，失败反馈不作为成功候选；现有源码也拒绝重复 diff，并在退出时尝试验证尚未记录的改动。`cli.py` 只保存候选列表和轨迹，未找到生成发布预测的完整选择脚本，所以上文“第三次被选”来自产物匹配，不是完整选择器实现认证。**[一手：固定包内源码]**

GSO profiler 脚本把热点采样与无 profiler 的独立进程计时分开；默认多次计时取均值，部分重任务另设次数。SWE-fficiency 路径也将干净计时与采样分离。工作负载中的重复采样不能直接当收益测量；是否应测首轮、暖缓存或连续请求应由真实用途决定，不能把研究的防缓存投机设置当所有应用默认。测试选择依赖另存的稳定测试集与 testmon，不构成 native 或全部语义的保证。**[一手：源码；研究：采用边界]**

以下差异要求撤回“公开产物已复核论文整条成功链”的说法：

- 论文 Fig.3／§IV-D2 的 `numpy__numpy-1b861a2` 描述专用 native kernel 达到5.87×；包内同 ID 轨迹约1.16／1.56／1.57／1.56／1.56×，后四次 diff 相同，发布预测也匹配这一补丁。两者不能当同一运行。**[一手：两组材料比对]**
- 保存轨迹含重复 diff，包内源码却已拒绝重复；因此不能说当前代码产生了历史轨迹，或重复拒绝已被这些轨迹验证。重复计时挑最高值存在噪声选择风险，但缺完整计时分布与选择过程，不能断言某项成绩已因此虚高。**[一手／研究]**
- 论文附录 D 列为未达专家门槛的 `pandas-dev__pandas-c34da50`、`tornadoweb__tornado-1b464c4`，在包报告中已通过该门槛。只保留各自材料的适用范围，不拼旧失败与新结果。**[一手：保存报告与论文比对]**

### 分母、空补丁与实际核查范围

GSO 包内报告为102题、91题正确、43题达到优化门槛，另有4个空补丁；hack报告分析43个候选，其中1个为上述复制反例，剩42。**42/102=41.176%**，不是删除标记项后算42/101；这与包 README 的41.2%相符，但不是论文39.2%的同轮重算。**[一手：保存报告；本轮算术复核]**

SWE CSV 有100题、98题正确；按正确且专家速度比至少0.95筛得75。hack报告有74项分析、零标记，集合差 `pandas-dev__pandas-34192` 的发布补丁为空，因此差异可由排除空补丁解释，不能写成又检出一个 hack。完整生成／排除脚本未取得；其98%正确率也不同于论文90%，不能把此包当论文74%结果的同轮复现。**[一手：报告与预测；研究：版本边界]**

本轮未下载另存测试数据库、运行模型、安装框架或执行包内代码；只做公开材料读取、标准库计数、哈希与 diff 比对。条件建议可采用，整套方法的当前净收益仍未知。**[研究：验证范围]**

### 复查入口

[官方记录 API](https://zenodo.org/api/records/22921624)于2026-10-15返回成功，确认标题、发布日2026-09-23、创建／修改日09-26、署名 Anonymous、CC-BY-4.0，以及“ICSE 2027 rebuttal artifact”的描述。记录中的文件大小与 MD5 同下载包一致；这些身份字段不证明论文与包内所有记录来自同轮。**[一手：API与下载校验]**

- [固定记录下载](https://zenodo.org/records/22921624/files/perfagent_icse.zip?download=1)：25,218,273字节；MD5 `e8e754925ddd3e9900a9568cd77d7b52`；SHA256 `9fce9f5e5c9b53e17c0bb407cd2f7cc46bae46aaa303553ecb22ac3e1aa8d262`
- 包内根为 `perfagent_icse/`；候选见 `artifacts/trajectories/gso/<instance_id>/traj.json`，发布预测见 `artifacts/predictions/perfagent/gso.jsonl` 及 `swefficiency.jsonl`
- 报告见 `artifacts/reports/gso_report.json`、`swefficiency.csv`、`gso_hack_detection.json`、`swefficiency_hack_detection.json`
- 实现见 `src/perfagent/agent.py`、`cli.py`、`pytest_cmd.py` 和 `assets/{gso,swefficiency}/profiler/profile_prob_script.py`；源码静态阅读不等于该版本真实运行通过

### 竞争实现：先比较轻量搜索，并为复评留预算

**核实：2026-10-16（UTC+8）。** 新增选择不是“保留中间版”，而是决定是否值得扩大搜索：先比较现有工具上的轻量候选搜索，核全尝试成本，并为竞争候选的独立复评留预算；有稳定收益证据才增加复杂调度。下列材料没有完成生产软件的单线续改对照。**[研究：采用判断]**

#### 同任务比较支持什么

Gideoni 等人的[论文v2（2026-10-12）§4、表1及附录C](https://arxiv.org/html/2602.16805v2#S4)报告：按作者的20美元API预算，IID随机采样和SCS分别在九个数学任务中的四个、六个达到或超过ShinkaEvolve；圆打包仍是ShinkaEvolve更好。比较使用相同的低领域知识提示与Gemini 2.5家族，但Shinka混用Pro／Flash／Flash Lite，基线只用Pro；Shinka配置经过部分调优，每题只运行一次。不能写成同一模型、同一初始程序的纯搜索策略消融，更不能当生产软件成功率。**[一手：作者研究，非本仓复跑]**

SCS每代从上代成功执行的程序随机抽取三个作为生成参考，并非只续改当前最优；[固定实现](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/baselines/archive_utils.py#L17-L66)还把这些程序的分数放入提示。因此“不按适应度选父代”也不等于“没有反馈”。本例支持先比较轻量候选搜索，不能替代单线与多候选的直接对照。**[一手：源码；研究：边界]**

#### 保存候选的账，不一定是全部尝试的账

作者仓库固定于`93435c5afb15217c4e3f38da3d432e1018156fa7`。以下是该公开版本的静态路径，不是论文历史账单的复算：

- [生成器L133–146](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/baselines/gemini_utils.py#L133-L146)只在响应可抽出代码时保存usage；随后[汇总L189–227](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/baselines/solve_prob.py#L189-L227)累计这些结果的费用。生成后执行失败的候选也会计入，但未形成代码的响应不在这条累计路径中。**[一手：源码]**
- [SCS全失败重试L118–133](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/baselines/solve_prob_sequential.py#L118-L133)会备份失败代并重试，而代统计只追加最后成功尝试；连续五次全失败时追加零费用／零时长占位；核完整尝试需同时核备份，不能只读最后汇总。**[一手：源码；研究：核算边界]**
- AIME的[执行评估费用](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/baselines/problems/long/aime_scaffolding/evaluator.py#L44-L68)另存在`metrics.total_cost`，外层`cost_usd`累计的是Gemini生成费用。生成、运行评估和最终复评不是同一个费用字段。**[一手：源码]**

据此，比较搜索方案时应核未成候选、失败重试、评估和复评是否进入同一预算，不能拿候选数或一个费用字段代替总投入。**未取得对应历史运行记录，不能断言论文少算了费用，也不能据此推翻其比较结果。** **[研究：采用判断与限制]**

#### 重复测量与留出验收是两层

论文v2的[§5与附录K／L](https://arxiv.org/html/2602.16805v2#S5)报告AIME候选经更多重复评估后排序判断改变，并以分级复评减少一次低样本高分误选。公开[搜索配置](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/baselines/problems/long/aime_scaffolding/config.json)是2024题目、每题三次；[重评脚本L216–255](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/baselines/misc_analysis/aime_scaffolding/eval_agent.py#L216-L255)设2025题目、每题十次，并保存代码／参数hash和回答。重复同一题可估计随机波动，不等于增加未见输入；复评参与了选优，就仍是选择环节，之后另验未参与选择的输入。**[一手：作者研究及源码；研究：采用边界]**

这里尚未独立闭合运行链：[cascade脚本](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/baselines/misc_analysis/aime_scaffolding/eval_cascade.py#L35-L65)只存十组精度数组，没有候选hash、年份和原始回答映射；[notebook](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/eval_cascade_demo.ipynb)明确是高斯分布演示。不能用这些材料认证论文的完整候选选择链，或确认留出结果未被再次用于选择；也没有证据据此指控数据泄漏。**[一手：源码／演示；研究：证据边界]**

[固定README](https://github.com/YonatanGideoni/code_evo_simple_baselines/blob/93435c5afb15217c4e3f38da3d432e1018156fa7/README.md)说明ShinkaEvolve、ADAS与MLE-Bench配置将在后续发布；本轮读取的固定源码包有基线、题目与判定器、部分AIME评估代码，但未含完整历史候选、逐题回答和费用记录。这限定了本轮能核的范围，不等于整篇不可复现。没有安装依赖、执行上游程序或运行模型；维护接手成本、生产软件收益与完整同轮成本仍未知。**[一手／研究]**


## PDF 表单：验收按消费者的坐标与单位判定

**核实：2026-10-16（UTC+8）。** 改变的是 [22](../22-agent-evaluation.md) 的验收选择：涉及缩放或单位转换时，先按实际消费者的转换核对断言，再信任其成功结果。不是再重复“退出码不等于完成”，也不据此推荐或否定整套 Skill。**[研究：采用判断]**

### 固定版本与完整路径

GitHub 连接器读取 `anthropics/skills` 的 `main`，返回 `dbd4588f9e1033efb41dad4bef2f7947c8993d44`；[该提交](https://github.com/anthropics/skills/commit/dbd4588f9e1033efb41dad4bef2f7947c8993d44)修改的是 claude-api 内容，并非下列缺陷的修复。[Releases 页面](https://github.com/anthropics/skills/releases)当时没有发行记录，不能把当前源码称为已发布修复。PDF Skill 的[许可](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/pdf/LICENSE.txt)保留权利；这里仅链接并描述机制，不复制脚本或分发实现。**[一手：版本与许可]**

- [原报告 #1770](https://github.com/anthropics/skills/issues/1770)的第 5 项及作者更正说明：不能直接以最初的 200 DPI 换算，因为图像还会缩小；作者已撤回原先的固定比例建议。它是公开缺陷报告，本仓另读下列固定源码核对。**[社区：原报告]**
- [图像转换 L9–21](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/pdf/scripts/convert_pdf_to_images.py#L9-L21)先以 200 DPI 渲染，再将超过 1000 像素的最长边缩至 1000，宽高分别取整数。不同页尺寸不保证相同的最终像素／点比例。**[一手：源码]**
- [输入约定与检查入口 L224–252](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/pdf/forms.md#L224-L252)让视觉定位路径记录实际图像宽高及像素框；[检查器 L43–55](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/pdf/scripts/check_bounding_boxes.py#L43-L55)直接把框的原始高度与字号比较，没有使用页尺寸换算。**[一手：文档与源码]**
- [填充器 L10–20、43–85](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/pdf/scripts/fill_pdf_form_with_annotations.py#L10-L85)实际读取 PDF 页的 MediaBox，按该页 PDF 宽高除以图像宽高分别转换坐标；字号则以点传入 FreeText。PDF 坐标路径不做像素缩放。**[一手：实际调用路径]**

### 源码推导的示例，不是渲染复现

取一张高 792 点的 Letter 页：200 DPI 下高 2200 像素，按上述默认最长边规则缩为 1000 像素。设一个与标签及其他框不相交的输入框高 14 像素、字号 14 点，则检查器的高度条件接受 `14 >= 14`；填充器使用的框高却是 `14 × 792 / 1000 = 11.088` 点，小于 14 点。这里核实的是同一条“框高至少为字号”标准在两个表示下判定不同，**不是证明真实文字已经裁切、不可读或有交付损失**。本轮只用自行编写的算术表达式核对这些数字，没有构造或运行上游夹具。**[研究：源码推导；经验：示例算术核对]**

因此按每页实际尺寸换算后检查高度；比较水平方向时用实际宽度比，不能因理论等比缩放就忽略取整后的宽高差异。不要用固定 200/72，也不要把 Letter 的最终比例推广到所有页面。像素坐标有其用途，不要求所有工作流改用 PDF 点；只要求校验和消费者对同一尺寸作一致解释。**[研究：采用判断]**

### 保留反证与范围

[原工作流 L263–294](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/pdf/forms.md#L263-L294)已说明混合路径统一坐标，并要求填充后转图检查位置。因此不能写成整个 Skill 没有视觉验收，也不能声称错配必然绕过最终检查。高度检查本身不充分证明字形、换行或裁切正确；没有安装依赖、执行下载脚本、运行 PDF／Office 应用或模型，未测真实渲染和 Skill 净收益。**[一手：工作流；研究：边界]**

XLSX 线索不另扩写正文：[#2013](https://github.com/anthropics/skills/issues/2013)的直接／别名／局部／普通公式夹具只报告转换前保护漏检，作者明确未运行 LibreOffice；[当前保护源码](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/xlsx/scripts/recalc.py#L74-L111)支持该机制，但不证明工作簿已损坏。[#1517](https://github.com/anthropics/skills/pull/1517)当时仍未合并，只补大小写及相应检测用例，不覆盖作用域或别名。成功状态的检查范围与最终产物正确性仍按 22 既有建议区分，不再添加一般性案例。**[社区：夹具报告；一手：源码与 PR；研究：收敛判断]**


## 搜索赢家接管后：保内核还是扩大分派

核实：2026-10-16（UTC+8）。主线二／四；改变15 §7：性能候选进入目标库后，用接收方的类型、比较器和真实规模决定快路径范围；后续共享分派变化需与搜索内核分开归因。不是新框架推荐，也不重做轻量搜索机制比较。**[研究：采用判断]**

**选择与接收。** [AlphaDev原论文（2023-06-07）](https://www.nature.com/articles/s41586-023-06004-9)说明，将汇编结果转换为C++时，sort5选用43指令候选，因为转换后更高效；这里是RL搜索与人工转写，不是当前LLM编码。[D118029审阅](https://reviews.llvm.org/D118029)继续限制采用：`optional<int>`作者测试在Skylake近似无益、ARM变慢；算术类型也可能使用昂贵比较器，因此只给简单比较器启用。最终[194d1965（2022-04-08）](https://github.com/llvm/llvm-project/commit/194d1965d2c841fa81e107d19e27fae1467e7f11)的快路径限制连续迭代器、类型大小、算术类型和简单比较器，其他情况保留原算法；审阅还补非连续deque、pair及比较器复制检查。**[一手：论文、补丁；社区：作者测量与审阅]**

**接管不是永久不变。** 原接收维护者的[2024年重构#104902](https://github.com/llvm/llvm-project/pull/104902)整理traits与包装入口。随后[生产使用方报告](https://github.com/llvm/llvm-project/pull/104902#issuecomment-2359494998)小输入依平台退化5–25%，虽大输入更快，却不符合其实际负载；另一接收者称内部发布因此阻塞。维护者在09-20[回滚ef44e465](https://github.com/llvm/llvm-project/commit/ef44e4659878f256a46476efcf0398f3dd510f54)，并要求拆分相互独立的修改，不能用“正确性没坏”结束性能验收。**[社区：接收者反馈；一手：回滚]**

**撤回也不是算法无价值。** [维护者10-22解释](https://github.com/llvm/llvm-project/pull/104902#issuecomment-2428958718)：重构恢复了此前因比较器引用类型识别而意外关闭的bitset partition分派。它是更大排序路径，不能把回退直接归给AlphaDev的sort3／4／5内核。[#114023](https://github.com/llvm/llvm-project/pull/114023)于10-30以[0fb76bae](https://github.com/llvm/llvm-project/commit/0fb76bae6b2abfe5e0a34557f365a586be989364)重投，明确接受小输入代价以恢复大输入旧退化；固定代码仍保留sort5比较／交换顺序。这不等于小输入也已变快，也不证明所有接收方都应接受同一权衡。**[一手：固定修订；社区：归因与取舍]**

**范围与缺口。** 上述生产反馈不是本仓复测，后续重构包含共享路径变化，不能从其总差分出搜索内核的单独效果；原报告的完整搜索尝试账本、主动维护工时、当前LLM同条件净收益仍缺。#114023作者称CI失败与补丁无关，不当作CI全绿。本轮只读原文、固定代码及公开接收回执，没有运行算法、模型或基准。PerfAgent／Shinka的选中补丁到真实后续接管仍未闭合，因此只收窄交付选择，不声称该缺口已经解决。**[研究：验证边界]**


## 依赖扫描：先锁外部数据和判定身份

**核实：2026-10-17（UTC+8）。** 改变 05 §2.5 的选择：先固定扫描器版本、数据库快照与期望答案的身份，再判断还缺哪条指令；精确参数或窄约束已够用时，不增加整套 Skill。本节只读指定公开运行、产物回显及源码，不运行模型、扫描器或上游测试。此前 pivot、Next.js 等案例的历史运行缺口仍分别保留。**[研究：采用判断与范围]**

### 实际执行：离线依赖识别不等于冻结漏洞库

固定 HF revision 为 `f104580363a9642563593c475620196ecd36687d`。同题 MiniMax M3 的 [with 轨迹 W](https://huggingface.co/datasets/benchflow/skillsbench-leaderboard/blob/f104580363a9642563593c475620196ecd36687d/submissions/skillsbench/v1.1/openhands-with-skills__minimax-MiniMax-M3/2026-06-06__04-55-41-maxeffort/software-dependency-audit__d130477b/trajectory/acp_trajectory.jsonl)与 [without 轨迹 N](https://huggingface.co/datasets/benchflow/skillsbench-leaderboard/blob/f104580363a9642563593c475620196ecd36687d/submissions/skillsbench/v1.1/openhands-no-skills__minimax-MiniMax-M3/2026-06-06__04-55-41-maxeffort/software-dependency-audit__e206127c/trajectory/acp_trajectory.jsonl)首条任务文本完全相同；两边展示的锁文件大小及前 50 行相同，但没有全文件哈希，不能断言完整输入字节相同。**[一手：公开 ACP 记录]**

- W 第 6–8 行确实调用离线扫描、CSV 报告、CVSS 提取三个 Skill；第 12 行命令同时带 `--skip-db-update` 与 `--offline-scan`，第 17 行回显三条 CSV。其已查看的预置 DB 更新时间为 2026-01-21。**[一手]**
- N 第 14 行命令仅用 `--offline-scan`，同条工具输出明确为“Need to update DB”及“Artifact successfully downloaded”；第 21 行回显十四条 CSV，包括更多 minimatch／tar 漏洞。它最终自述使用预缓存库，不能覆盖工具输出已下载新库的事实。**[一手]**
- 官方 v0.70.0 的 [offline flag](https://github.com/aquasecurity/trivy/blob/8a3177aedf7ee0864920eb1852eef031cd3742b8/pkg/flag/scan_flags.go#L29-L34)说明“do not issue API requests to identify dependencies”，[DB flag](https://github.com/aquasecurity/trivy/blob/8a3177aedf7ee0864920eb1852eef031cd3742b8/pkg/flag/db_flags.go#L27-L37)另说明“skip updating vulnerability database”；v0.71.0 的 [offline](https://github.com/aquasecurity/trivy/blob/9b49920eebb2bf648ba54211617d6078f6105594/pkg/flag/scan_flags.go#L29-L34)与 [DB](https://github.com/aquasecurity/trivy/blob/9b49920eebb2bf648ba54211617d6078f6105594/pkg/flag/db_flags.go#L27-L37)契约相同。因此 `--offline-scan` 不是禁止 DB 刷新的充分条件；这些参数也不等于通用网络隔离。**[一手：官方版本源码]**

W 的 Trivy 为 0.71.0，N 为 0.70.0；初始 DB 元数据相同也没有数据库文件哈希。**工具版本及后续数据库均不同，不能把结果差异单独归因于 Skill。** 任务只说可以用离线工具／数据库，没有要求冻结某一天快照；更多记录与固定答案不符，不自动证明真实世界审计更差。**[一手：任务与运行；研究：归因边界]**

### 内容去重先于三次重复的解释

[manifest](https://huggingface.co/datasets/benchflow/skillsbench-leaderboard/blob/f104580363a9642563593c475620196ecd36687d/analysis/skillsbench/v1.1/official-selected/manifest.json)采用 healthy-first latest-3；timeout 只在其他 pass/fail 不足三条时补入，因此不是全尝试分母。[selected_runs](https://huggingface.co/datasets/benchflow/skillsbench-leaderboard/blob/f104580363a9642563593c475620196ecd36687d/analysis/skillsbench/v1.1/official-selected/selected_runs.jsonl)中，with 的 `42320f9d` 与 `d130477b` 虽是两行，但其 config、result、timing 的 Git OID 分别相同，ACP／LLM 的 LFS 内容哈希也分别相同，不能解释为三次独立 with 成功。重复发布的原因未知，不推断数据操纵。**[一手：固定清单与目录元数据；研究：去重判断]**

可复核的内容身份：两者 result OID 均为 `15caf99b31a84ff80c29d7dde14987231247abf1`；ACP SHA-256 均为 `313f37a1a2019d230250ff9eecce4dbd7d362c046a95603889122e083b928713`；LLM SHA-256 均为 `40c5b94481eda64af64aab9fb90042046eb40c38d6a1fbbc2bcc4362cb2f2af9`。依据 [W 目录](https://huggingface.co/api/datasets/benchflow/skillsbench-leaderboard/tree/f104580363a9642563593c475620196ecd36687d/submissions/skillsbench/v1.1/openhands-with-skills__minimax-MiniMax-M3/2026-06-06__04-55-41-maxeffort/software-dependency-audit__d130477b)、[D 目录](https://huggingface.co/api/datasets/benchflow/skillsbench-leaderboard/tree/f104580363a9642563593c475620196ecd36687d/submissions/skillsbench/v1.1/openhands-with-skills__minimax-MiniMax-M3/2026-06-05__22-55-01-maxeffort/software-dependency-audit__42320f9d)及各自 [W 轨迹元数据](https://huggingface.co/api/datasets/benchflow/skillsbench-leaderboard/tree/f104580363a9642563593c475620196ecd36687d/submissions/skillsbench/v1.1/openhands-with-skills__minimax-MiniMax-M3/2026-06-06__04-55-41-maxeffort/software-dependency-audit__d130477b/trajectory)／[D 轨迹元数据](https://huggingface.co/api/datasets/benchflow/skillsbench-leaderboard/tree/f104580363a9642563593c475620196ecd36687d/submissions/skillsbench/v1.1/openhands-with-skills__minimax-MiniMax-M3/2026-06-05__22-55-01-maxeffort/software-dependency-audit__42320f9d/trajectory)；本轮下载的 W ACP 哈希与其元数据相符，未下载两份 LLM 全轨迹。**[一手：元数据与内容哈希核对]**

### 产物与判定相容，不等于历史测试身份已闭合

[W result](https://huggingface.co/datasets/benchflow/skillsbench-leaderboard/blob/f104580363a9642563593c475620196ecd36687d/submissions/skillsbench/v1.1/openhands-with-skills__minimax-MiniMax-M3/2026-06-06__04-55-41-maxeffort/software-dependency-audit__d130477b/result.json)记录 reward=1，[N result](https://huggingface.co/datasets/benchflow/skillsbench-leaderboard/blob/f104580363a9642563593c475620196ecd36687d/submissions/skillsbench/v1.1/openhands-no-skills__minimax-MiniMax-M3/2026-06-06__04-55-41-maxeffort/software-dependency-audit__e206127c/result.json)记录 reward=0；CSV 只从工具回显核得，没有独立产物文件与 verifier 逐断言日志。manifest 声明源码 `27738384b1df694ea2ae466e416f476e94d8fab9`；其[判定器](https://github.com/benchflow-ai/skillsbench/blob/27738384b1df694ea2ae466e416f476e94d8fab9/tasks/software-dependency-audit/verifier/test_outputs.py)的三条期望与 W 相容，却包括 Title／Url 的全字典比较，并以 Package+Version 作键，可能覆盖同一版本的多个 CVE。它不能代替按漏洞身份核集合的实际审计验收。**[一手：产物回显、结果与源码；研究：验收边界]**

两份 config／result 没有历史 verifier 文件哈希或镜像 digest，不能由当前源码断言当次失败的唯一原因。公开费用字段及价格来源为 null，选中集也不含完整重试分母；本节不据运行时间或 token 差额声称美元收益。结论只支持补齐具体参数、冻结外部依赖和核清判定身份，不支持 Skill 的因果胜率或当前强模型净收益。**[一手／研究]**
