# context-mode：原文能取回，检索仍会漏关键条件

**已知文件和关键词时继续用 `rg`＋按段读取；反复查多份长资料时，可试 context-mode 的显式索引组件。** 它保存原文块而非模型摘要，但取回完整块不代表找全了决定性条件。此次用它回查本仓既有 QMD、压缩成本与来源约定，实际完成 [13 的候选选择](../docs/13-frontier-radar.md#值得一试近4周的新项目与做法)：保留原生默认，新增按来源补取的用法，不启全套自动路由。

适合维护中文知识库的 Agent 开发者；新增能力是区分“原文没有丢”和“这次查询没有找到”，避免把空结果当不存在、把短输出当净收益。

## 实际取回与原生对照

2026-10-26 UTC，固定本仓 `16186164dc08ba9821841d317d8e3903d3c44914`。输入为 `AGENTS.md`、`CLAUDE.md`、13／24／25，以及研究记录 `2026-10-15-exploration-evidence.md`、`2026-10-22-frontier-trials.md`、`2026-10-12-community-source-records.md`，共 8 文件、344 块。先用 `rg -n` 定位 QMD／pi-trim／同源正文等词，再读对应完整语义段；不是拿全文倾倒作弱基线。

| 写作中需要回答的问题 | 组件实际返回（每次最多 3 块） | 怎样用于这次选择 |
|---|---|---|
| QMD 的中文未命中、混合检索旧过程高排，是否同一问题？ | 完整问句取回纯词法与混合记录；`QMD 中文 旧过程 重排` 把混合记录前半段补到首位 | 保留“已知交付入口先原生”的结论，不把检索相关性当当前状态 |
| 压缩输入能否代表总收益？ | 完整问句零结果；`压缩 缓存 费用 工具` 取回 pi-trim 首帖对照：输入减少，费用估计反增 | 新条目不引用作者节省百分比；成本须连缓存、工具定义和完整流程看 |
| 正文取不到时怎么办，怎样保留核实日期？ | 完整问句零结果；`同源正文 摘要 核实日期` 的跨来源前三块仍漏决定性正文；限定研究来源后补回，单搜 `同源正文` 则排首位 | 搜索只当定位；补读保留“官方支持入口、明确拒绝则停”和原核实日期 |

六次首轮查询与两次补取共返回 18 个块（含重复），全部逐字存在于固定源文件，8 文件前后 SHA-256 不变。行范围由本次对照脚本回源计算，不是组件原生返回字段；组件返回的 `timestamp` 是入库时间，原文的核实日期才是证据日期。以上是三个问题的实试，不是中文检索覆盖率或盲测；未测模型质量、总费用和净提速。

## 怎么试，而不先接整套插件

**先拿一个真实问题与明确授权的文件列表，检查关键反例能否取回。** 本次固定 [源码 `8b74cbba`](https://github.com/mksglu/context-mode/tree/8b74cbba68a79e45170dd5866dee949fd6ddd8e1)，用已安装的 Bun 1.4.4 直接加载 `ContentStore`，SQLite 为 Bun 内置分支；没有安装项目依赖。准备独立目录中的源码 clone、空 `home`／`tmp`／`claude`／`context` 目录后，组件调用如下：

```ts
import { ContentStore } from './context-mode/src/store.ts';
const store = new ContentStore('./context/trial.db');
try {
  store.index({ path: './public-repo/docs/research/2026-10-15-exploration-evidence.md', source: 'exploration' });
  const blocks = store.searchWithFallback('同源正文', 3, 'exploration', undefined, 'exact');
  console.log(JSON.stringify(blocks)); // 读返回原块，再回源核相邻限制
} finally {
  store.close();
}
```

运行时把 `HOME`、`TMPDIR`、`CLAUDE_CONFIG_DIR`、`CONTEXT_MODE_DIR` 指向上述空目录。索引本身包含原文，别混入未授权资料。本次只试组件，未接 MCP、全局插件或会话恢复；`start.mjs`／服务启动还涉及配置修复、旧库清理及会话索引，不能把这段调用当成整套安装指南。

其实现按标题分块，用 FTS5 porter／trigram 合并排序、fuzzy 兜底；查询按空白分词，不是自然语言语义检索。本次两条没有空格的中文问句没有命中，改关键词才取回，不能外推所有中文问句都失败。已知源文件时，额外建索引没有替代原生定位；只有反复查询多份资料、并能回核关键条件时才值得保留。

## 来源与选择依据

- [一手] [固定 store.ts](https://github.com/mksglu/context-mode/blob/8b74cbba68a79e45170dd5866dee949fd6ddd8e1/src/store.ts) 的查询清理、索引／原块返回与时间戳；[db-base.ts](https://github.com/mksglu/context-mode/blob/8b74cbba68a79e45170dd5866dee949fd6ddd8e1/src/db-base.ts) 的 Bun 分支。包版本写 1.0.169，但 [6-29 同号 release](https://github.com/mksglu/context-mode/releases/tag/v1.0.169) 不是本次 main 提交；许可 Elastic-2.0，属 source-available，不称 OSI 开源。
- [社区原帖] [Pi 使用者讨论](https://www.reddit.com/r/PiCodingAgent/comments/1ugk8hi/contextmode_is_adding_15k_tokens_to_every_request/)既有保留长任务用法，也有提示负担、重复 extension＋MCP 和临时交接丢失报告；版本未明确，不能当当前故障率。[LINUX DO 6-04 讨论](https://linux.do/t/topic/2305228?tl=en)提醒主侧输出减少不等总收益，不能拿评论猜测代替实现。
- [本仓实试／选择] 上述固定输入实际运行，原生对照已能找齐三题关键来源；因此保留原法、按需借原块索引，而非证明新工具更快或更准确。核实 2026-10-26 UTC。
