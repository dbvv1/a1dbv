主线：二，兼三
改变的建议：05 §2.5 / §4：按平台、原生对象或生产缺省契约补窄参考；验收实际入口，已有实现、脚本或模板足够就不再加 Skill
新证据：Cloudflare、pivot、Seedkit 的既有契约证据；新增 Next.js 固定三臂定义与原生文档／Skill 内容覆盖比较，非模型净收益

# 窄领域 Skill：平台契约、原生对象与生产配置

> 核实：2026-10-13。长期任务二。第 1–5 节为 Cloudflare 调查（UTC+8）；第 6 节同日追加原生 pivot 调查（UTC）；第 7 节于 2026-10-14（UTC）补核生产缺省契约与历史生成产物。第 8 节同日追加 Next.js 固定源码比较及累计取舍。分别执行自行编写的表达式、文件结构与 AST 探测，未部署 Cloudflare、运行 Office/Django 应用或新模型。正文采用建议见 [05 §2.5](../05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么)。

## 1. 为什么选这个来源

本轮读取了 AGENTS/CLAUDE 编写约定、05、研究 README/STATE 与 BACKLOG 四条长期任务，并检索既有研究。已有 skill-creator、gh-fix-ci、Playwright、Superpowers、Matt Pocock 与 gstack 机制分析；没有发现对 Cloudflare Durable Objects Skill 及本例恢复链的既有深入研究。因此选择这一狭窄任务，不重做 D2、Catalog Compare 或 workflow-ablation。[研究：本仓库查重范围]

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

本轮机制调查可以完成。真正值得下一步做的是：遇到一个尚未看过的实际平台迁移任务时，事先固定业务验收，在有授权的同一环境比较“原生自行检索 / 一个短契约入口 / 完整 Skill”，记录实际读到什么、人的纠正与等待；不要拿这里已经公开的两处修复重做盲测，也不因缺预算而另造流程框架。[研究：后续判别条件]

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
- **P5**：[SkillsBench 论文 v1](https://arxiv.org/html/2602.12670v1)，§3.2、I.5 与 I.7 的 sales-pivot-analysis 案例。未读取完整逐次轨迹或重算成本。
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

找不到／读错版本时先给精确入口；已读但漏掉“迁移前基线→断言不变→迁移后验证”时，先补这条短契约并复用现有 rig。只有窄补充仍留下可定位的跨步骤遗漏，才试完整 Skill，且分别记录新事实、操作配方、实际执行与人的等待。必要行为不退步、返工减少且总投入在事先接受范围内才保留；原生或短契约已经满足、遗漏不改善或额外打断不值得时撤回。若环境无法执行或观察，优先解决获授权的能力缺口，不继续扩写文字。[经验：采用判断]

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
