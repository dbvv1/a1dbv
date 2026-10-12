# D4 来源记录：alchemy-utils 的第二次修改

> 核实：2026-10-12（北京时间）。原始调查只读公开来源及源码；本页后文保留对端新增的 SQLite API 运行报告；本侧整合仅作源码交叉核查，未独立复跑，证据缺口见末节。未调用模型、接触私人会话或生产数据库。正文与采用判断归 [24 社区工作流](../24-community-workflows.md#从原型到第二次修改alchemy-utils-的真实-csv-改变了什么)，本页只保存定位和证据缺口。

## 固定证据

- **A1 [社区：作者经历]**：[2026-08-12 发布说明](https://simonwillison.net/2026/aug/12/alchemy-utils/)披露 Codex／GPT-5.6 Sol Ultra、初始需求与实际 CSV 导入；接近一小时降至约 35 秒是作者报告。页面时间不是每一步执行时间；以仓库提交／release 时间定位后续版本，不将文章标题日期当成优化已于初版完成。
- **A2 [社区：公开对话]**：[作者公开 Gist，revision `d5bf8416`](https://gist.github.com/simonw/bd10e4886688e0fd1b833e4afaabf19e/d5bf8416e0b099561326dc04602987027716a782)。已读初始任务、DuckDB 反射问题后的人工拆分要求、追加 CLI 和重命名段落；结尾是一次 schema 命令异常与测试数据库恢复。它不是优化任务的完整记录，不能据它补写性能请求、profiler 结果、全部提示轮次或人的耗时。没有保存整份对话或其中本机路径。
- **A3 [一手：架构落实]**：[`768c090145d57ce4e71d1b36a2fca29a7425d5f7`](https://github.com/simonw/alchemy-utils/commit/768c090145d57ce4e71d1b36a2fca29a7425d5f7)引入各引擎 Database 子类；A2 的人工要求先于对应提交操作。源码表明后续复用了此边界，不证明没有该要求就做不到或更慢。
- **A4 [一手：初版与第二次修改]**：[初版 `14702954`](https://github.com/simonw/alchemy-utils/tree/147029549653238621b78104d0a93cd2f9cf4df6)；[优化 `e3b8d03`](https://github.com/simonw/alchemy-utils/commit/e3b8d03e040867b256aeff7db322a0b0eb1f8b06)（2026-08-13 UTC）；[0.1a1 `c2432fb`](https://github.com/simonw/alchemy-utils/tree/c2432fb580317dd6a8cdf3e3451a2fc6a85631f7)与[发布说明](https://github.com/simonw/alchemy-utils/releases/tag/0.1a1)。读完整优化补丁，涉及 README、CLI、共享 db、DuckDB adapter 和两份测试。初版忽略 batch_size／全量物化是已披露的 spike 取舍，不定性为违反初始需求。
- **A5 [一手：测试与历史执行]**：[test_writes.py](https://github.com/simonw/alchemy-utils/blob/e3b8d03e040867b256aeff7db322a0b0eb1f8b06/tests/test_writes.py)新增的原子性例子是在已创建表上，三条输入第二批出现重复主键后检查表空；不是建表 DDL 回滚证明。[test_databases.py](https://github.com/simonw/alchemy-utils/blob/e3b8d03e040867b256aeff7db322a0b0eb1f8b06/tests/test_databases.py)检查缺 pandas 缓存退出后清理，不测并发。精确 `c2432fb` 的 [Test run 31662692544](https://github.com/simonw/alchemy-utils/actions/runs/31662692544)五个 Python job 状态 success；只进一步读取 [3.10 job 94330647807](https://github.com/simonw/alchemy-utils/actions/runs/31662692544/job/94330647807)完整日志，179 collected、178 passed、1 skipped、1 warning。[测试源码](https://github.com/simonw/alchemy-utils/blob/c2432fb580317dd6a8cdf3e3451a2fc6a85631f7/tests/test_introspection.py)与日志位置对应 DuckDB partial index skip。CI 通过不构成本轮复跑，也不验证作者的性能数字。

## 采用边界与仍未回答的问题

**[经验：本仓库源码分析]** 可采用的是“真实输入触发局部修改，并用旧行为反例约束优化”。不能从这个案例推导先拆子类总是最好、Codex 优于其他模型、TDD／并行调查各自带来多少收益，或 0.1a1 已具生产兼容性。多个改动共同发生，完整性能轨迹和逐项对照缺失。

**[社区：A2 同项目反例]** 公开对话结尾，Agent 承认重命名清理时把用户的未跟踪测试数据库移走，DuckDB 随后在原路径新建空库，schema 输出为空；用户给出实际命令后，Agent 报告恢复了原库。这里可见的是一次恢复报告，未见 create-on-read 的底层 UX 修复；也说明“初版测试通过”不涵盖工作区数据处理。未将该自述升级为本轮复现。

原调查留下字段缺失／默认值兼容、全局 pandas-miss 缓存并发影响及更长期维护三个问题；首项现有下文对端运行报告及本侧源码支持，完整执行材料仍不齐；后两项仍未验证。JSON／JSONL 仍物化，`alter=True` 与新表非流式输入仍需全量扫描；不能将 CSV 路径写成全 API 恒定内存保证。README 新旧限制的矛盾可以直接确认，但不是已报告用户因此出错。

## 为什么不继续扩写原候选

- **h3o [一手]**：[PR #11](https://github.com/simonw/research/pull/11)是 #10 次日的 Claude Code web 基准任务，合并 `52385971c815a457618a6b94b2ba939e87e04cad`。本轮查 `h3o-python` 的公开提交历史，只见初始实现、README 自动更新、该 PR 的 .gitignore 与后续 AI 说明；未找到绑定实现的后续维护，不将基准报告当成维护成本证据。此检索范围不能证明项目在其他地方没有使用。
- **BAML [一手]**：[PR #2259](https://github.com/BoundaryML/baml/pull/2259)已合并并披露 Claude Code；可见人的回复表示将随当晚发布。本轮没有取得同一实现的后续维护链，不把另一篇作者复盘拼成同项目结论。
- **herdr [一手／社区]**：[PR #52](https://github.com/arrrrny/herdr/pull/52)有真实上游同步与评审修复，但 owner 账号回复带自动修复任务标记；已读材料不足以确认具体 Codex 实现与人工纠正的归属。本例留作线索，不以账号类型代替作者身份核实。

这些只是本轮选材的已查范围；不是评价三个项目质量，也不要求每轮重新查一遍。下一项应补不同作者／用户情境或真实长期变更，避免同一作者的多篇材料被当作独立人群样本。

以下“独立复核”是对端运行报告的原记录；本侧未复跑，材料缺口与本侧源码核查另见末节。

## 独立复核：批大小确实改变 SQLite 数据结果

**核实：2026-10-12；[经验：实际执行]。** 前文描述 dot 的来源调查；本节为方向端新增运行。直接执行未修改的优化前父提交 [`05c3b3d15ad518b1dfca172847d21d0272bf39f5`](https://github.com/simonw/alchemy-utils/tree/05c3b3d15ad518b1dfca172847d21d0272bf39f5) 与发布版 `c2432fb` 的 `src`，没有安装项目构建后端。临时隔离环境为 Python 3.12.14、SQLAlchemy 2.0.43、SQLite 3.53.1、typing_extensions 4.15.0、greenlet 3.5.6。版本符合项目依赖范围，但不是作者当时的锁定环境；仅 SQLite、内存数据库、公开合成数据，没有运行 CLI、DuckDB、PostgreSQL、上游全套测试或模型。

同一输入 `[{"id": 1}, {"id": 2, "label": "new"}]`，预建表 `items(id INTEGER PRIMARY KEY, label TEXT DEFAULT 'fallback')`；分别以 `batch_size=1,2,100` 调用 API。每次新建数据库，按 id 排序查询真实落库值。下表只展示 id=1；id=2 在前四行均为 `new`（完整字段行的 id=1 为 `one`），最后一行两条记录均为 `fallback`。

| 情境 | 优化前：1 / 2 / 100 | 发布版：1 | 发布版：2 / 100 |
|---|---|---|---|
| insert，第 1 条缺 label，第 2 条有 label | 均 NULL | fallback | NULL |
| upsert，先存 `(1,'keep'),(2,'old')`，相同稀疏输入 | 均 NULL | keep | NULL |
| insert，第 1 条显式 `label=None` | 均 NULL | NULL | NULL |
| insert，两条都明确提供 label | 均 one | one | one |
| insert，两条都缺 label | 均 fallback | fallback | fallback |

共 2 版本 × 5 情境 × 3 批大小，30 次调用均完成并读取结果；随后逐条对照上述预期，无不符。前三个控制变量有不同作用：显式 NULL 与缺失不同；完整字段不暴露此问题；全部缺失仍应触发默认值，不能简单给所有表字段补 NULL 当作兼容修复。这里的“预期”用于核对观察记录，不是宣称已决定正确的产品契约。

最小复现（在各固定版本的 `src` 可导入且依赖可用时执行；先用 1，再将 batch_size 改成 2；upsert 情境另需预置旧行）：

```python
import sqlalchemy as sa
from alchemy_utils import Database

engine = sa.create_engine("sqlite:///:memory:")
with engine.begin() as connection:
  connection.exec_driver_sql(
    "CREATE TABLE items (id INTEGER PRIMARY KEY, label TEXT DEFAULT 'fallback')"
  )
db = Database(engine)
db["items"].insert_all([{"id": 1}, {"id": 2, "label": "new"}], batch_size=1)
with engine.connect() as connection:
  print(list(connection.exec_driver_sql("SELECT id, label FROM items ORDER BY id")))
db.close()
```

**[一手：补丁；研究：机制解释]** 优化前 `input_names` 是全体记录的字段并集，缺失字段经 `record.get` 变成显式 NULL；优化后这段逻辑移入批次循环。同一条缺字段记录是否被补 NULL，取决于同批是否有其他记录携带该字段。upsert 又据归一化字段选择更新列，因此不仅影响默认值，还影响是否覆盖旧值。这确认了 A4 的兼容疑点，不能再把它描述成“尚未复现”。但没有证明作者那份字段整齐的 CSV 出错，也没有验证最新 main 仍然如此。

### 为什么不能只让 Agent “补个测试修掉”

**[研究：设计取舍；🧪 按接口要求选择]** 应先决定缺失字段的含义。旧实现可作为兼容参照，但旧行为本身也可能不符合调用者希望的 patch 语义；不能将 `keep` 与 NULL 中任意一方无条件叫作正确答案。

- **必须精确保留旧的整批并集语义**：对任意单遍输入，在第一条记录写入前可能尚不知道末尾才出现的字段。若还要求立即写入、固定内存且不回写，就不能同时靠未知的未来字段决定第一条的 NULL。可预扫可重放输入、暂存输入或让调用者提供本次字段集合；各自付出 I/O、内存、延迟或接口成本。
- **采用逐记录的缺失语义**：插入缺失用默认值，更新缺失不覆盖；执行可按字段集合组织，但不能随意重排有重复主键的记录。这能消除批边界对上述结果的影响，却是相对旧版的兼容性选择，需说明和迁移。
- **把所有表列都补 NULL**：看似统一，但会破坏“两条都缺 label”时原本正常的默认值；上表控制情境正是这个修法的反例。

因此推荐的验证是：**在声明为性能参数的批大小变化下，结果是否满足已选的同一语义**。批大小确实允许改变结果的接口，则必须明确公开这种契约。不是要求所有算法分批都交换等价，也不要求每次优化增加完整方法论。


## 本侧整合复核与运行证据缺口

**核实：2026-10-12；[一手：只读固定源码；研究：证据范围判断]。** 上节“30 次调用”是对端 `362491e8` 保存的运行报告，原表及原执行叙述保留其历史归属。本侧未安装依赖、执行上游或复跑模型；只读优化前 `05c3b3d15ad518b1dfca172847d21d0272bf39f5` 与发布版 `c2432fb580317dd6a8cdf3e3451a2fc6a85631f7` 的 `src/alchemy_utils/db.py`，交叉核查 `input_names` 从全输入移到每批、`record.get` 将并集内缺字段补为 None，以及 SQLite upsert 按记录 keys 决定更新列。这支持缺失触发默认值／保留旧值、显式 NULL 则写 NULL 的机制解释，不等于本侧运行验证。

对端声称的覆盖是 2 版本 × 5 情境 × 3 批大小 = 30 次调用；仓库实际保存的是五行结果汇总与一个稀疏 insert 最小程序。没有保存完整矩阵 driver、upsert 预置及调用程序、三个控制组程序或逐次原始输出。上节示例只展示 insert，不能当作全套复现程序；现存记录不足以独立核对每次执行与环境，也不能把汇总升级为原始证据。补齐这些材料或获准独立复跑前，正文采用条件建议及源码支持的机制判断，运行数量始终归属对端报告。

对端的 [54083033 限定审计](../collaboration/reviews/2026-10-12-5408303.md)原样保留，不回写成从未有过局限；它没有覆盖本侧后续 `865b096` 或实用工具模块。本次整合也未验证其他数据库、性能、完整上游测试、最新 main 或模型工作流净收益。
