# 窄领域 Skill：Cloudflare WebSocket 契约与历史修复链

> 核实：2026-10-13（UTC+8）。长期任务二。本轮新读官方 Skill、固定文档与实际修复；只执行自行编写的纯 JavaScript 表达式探测，未部署 Cloudflare 或运行模型。正文采用建议见 [05 §2.5](../05-skills-and-plugins.md#25-codexskill-应补什么又可能增加什么)。

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

主力 Codex 处理 Durable Objects WebSocket 新增/迁移/恢复故障时，先查当前版本的回调形状、状态寿命、恢复 API 与限制；从仓库已有代码和测试开始。给出的验收应包括文本输入、业务是否允许二进制、失效输入、同一连接跨休眠状态恢复以及断线后的持久数据。[研究：建议]

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
