# alchemy-utils：完整批次语义复核材料

> 2026-10-13 补交，原运行日期为 2026-10-12。对应[研究记录](../../docs/research/2026-10-12-alchemy-utils-evolution.md)。仅含公开合成数据、原输出和完整程序，不含上游项目副本。**[经验：执行记录]**

接受 dot 的反馈：原文五行汇总和单个 insert 示例不足以逐项核对 30 次调用。本目录补齐当时程序、两版本逐次 stdout 与固定来源。`manifest.json` 保存文件 hash 用于检查内容是否变化，不作为执行真实性的独立证明。

## 固定输入与输出

- 优化前：`05c3b3d15ad518b1dfca172847d21d0272bf39f5` → [原输出](before-20261012.jsonl)。
- 发布版：`c2432fb580317dd6a8cdf3e3451a2fc6a85631f7` → [原输出](after-20261012.jsonl)。
- [manifest](manifest.json)；上游为 [simonw/alchemy-utils](https://github.com/simonw/alchemy-utils)。每个输出第一行是 Python／SQLAlchemy／SQLite 版本，随后 15 行为 5 情境 × 3 批大小的结果。
- Python 3.12.14、SQLAlchemy 2.0.43、SQLite 3.53.1；依赖还有 typing_extensions 4.15.0、greenlet 3.5.6。不是上游完整锁定环境，不要求把这些依赖装进本知识库的常规检查环境。

## 完整程序

下段是原程序全文，包含 upsert 预置和三类控制组。将其保存为临时 `probe.py`；在具有上述依赖的隔离环境中，对每个固定版本分别令 `PYTHONPATH` 指向其 `src` 后运行。每种情境新建内存库，不访问生产数据库；不要在同一解释器进程中换版本，以免复用已导入模块。

```python
import json, sqlite3, sys
import sqlalchemy as sa
from alchemy_utils import Database
print(json.dumps({'python':sys.version.split()[0], 'sqlalchemy':sa.__version__, 'sqlite':sqlite3.sqlite_version}))
for mode in ['missing','null','homogeneous','upsert','all_missing']:
 for batch in [1,2,100]:
  engine=sa.create_engine('sqlite:///:memory:')
  with engine.begin() as c:
   c.exec_driver_sql("CREATE TABLE items (id INTEGER PRIMARY KEY, label TEXT DEFAULT 'fallback')")
   if mode=='upsert': c.exec_driver_sql("INSERT INTO items VALUES (1,'keep'),(2,'old')")
  rows=[{'id':1}, {'id':2,'label':'new'}]
  if mode=='all_missing':rows[1].pop('label')
  if mode=='null':rows[0]['label']=None
  if mode=='homogeneous':rows[0]['label']='one'
  db=Database(engine)
  if mode=='upsert':db['items'].upsert_all(rows,pk='id',batch_size=batch)
  else:db['items'].insert_all(rows,batch_size=batch)
  with engine.connect() as c: result=[list(r) for r in c.exec_driver_sql('SELECT id,label FROM items ORDER BY id')]
  print(json.dumps({'mode':mode,'batch_size':batch,'rows':result}))
  db.close()
```

例如 `PYTHONPATH="$ALCHEMY_SOURCE/src" "$ALCHEMY_PYTHON" probe.py`；两变量分别指向固定源码目录和隔离解释器。本程序打印观察值，没有内嵌正确性结论；退出 0 只说明调用完成。对照结果的独立要求如下：

- 两版本的 null 组第一行均为 NULL，homogeneous 组均为 one，all_missing 两行均为 fallback。
- missing / upsert 组：优化前第一行均为 NULL；发布版批大小为 1 时分别为 fallback / keep，为 2 或 100 时为 NULL。
- 除 all_missing 外，第二行均为 new；每版必须包含 5 个 mode、各 3 个 batch_size，不能遗漏或重复。

这些要求用于复核报告里的观察值，不是在替上游决定缺失字段应当具有的产品语义。

## 补交时检查

2026-10-13 逐字节核对临时源码与固定 Git 对象，再从本文提取完整程序，以原隔离环境分别运行两版本。两次输出均与保存的原 stdout 完全一致；逐项核对 30 个结果和组合完整性，没有不符。只再次验证 SQLite API 行为，未运行其他数据库、CLI、性能基准、上游全套测试或模型。
