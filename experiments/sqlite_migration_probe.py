"""Synthetic data only. Run with PYTHONPATH pinned to an official checkout."""
if not __debug__:
 raise RuntimeError("Run acceptance probe without Python optimization (-O/PYTHONOPTIMIZE)")
import json, pathlib, shutil, sqlite3, subprocess, sys
from sqlite_utils import Database
from sqlite_utils.db import TransactionError
import sqlite_utils
root=pathlib.Path(sys.argv[1]); root.mkdir(parents=True,exist_ok=False)
mode=sys.argv[2]
p=root/'before.db'
c=sqlite3.connect(p)
c.executescript('''
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE);
INSERT INTO authors VALUES(1,'Ada'),(2,'Lin');
INSERT INTO books VALUES(1,'Transactions',1),(2,'Data migration',1),(3,'Graphs',2);
''');c.close()
def snap(path):
 c=sqlite3.connect(path)
 d={'authors':c.execute('select * from authors order by id').fetchall(),'books':c.execute('select * from books order by id').fetchall(),'schema':c.execute("select name,sql from sqlite_master where type='table' order by name").fetchall(),'foreign_key_check':c.execute('pragma foreign_key_check').fetchall()};c.close();return d
before=snap(p); report={'source':sqlite_utils.__file__,'python':sys.version,'sqlite':sqlite3.sqlite_version,'mode':mode,'before':before}
q=root/'after.db';shutil.copyfile(p,q);db=Database(q);db.execute('pragma foreign_keys=on')
if mode in ('old','guard'):
 error=None
 try:
  with db.atomic(): db['authors'].transform(rename={'name':'author_name'})
 except TransactionError as e: error=str(e)
 report['error']=error;report['pragma_after']=db.execute('pragma foreign_keys').fetchone()[0];db.close();after=snap(q)
 if mode=='old': assert error is None and after['books']==[] and after['foreign_key_check']==[]
 else: assert error is not None and after==before and report['pragma_after']==1
elif mode=='current':
 # Safe parent-table rebuild outside an outer transaction, with enforcement ON.
 db['authors'].transform(rename={'name':'author_name'}, strict=True)
 assert db.execute('pragma foreign_keys').fetchone()[0]==1
 assert list(db['books'].rows)==[{'id':r[0],'title':r[1],'author_id':r[2]} for r in before['books']]
 # Successful logical unit; failed nested unit is independently rolled back.
 with db.atomic():
  db['authors'].update(1,{'author_name':'Ada revised'})
  try:
   with db.atomic():
    db['books'].update(1,{'title':'NOT COMMITTED'})
    raise ValueError('synthetic nested failure')
  except ValueError: pass
  db['books'].update(3,{'title':'Graphs revised'})
 db.close(); committed=snap(q)
 db=Database(q);db.execute('pragma foreign_keys=on')
 try:
  with db.atomic():
   db['books'].transform(rename={'title':'book_title'}, strict=True)
   db['authors'].update(2,{'author_name':'NOT COMMITTED'})
   raise ValueError('synthetic outer failure')
 except ValueError:pass
 db.close(); assert snap(q)==committed
 # Full batch migration of parent and child: disable BEFORE the transaction,
 # explicitly validate before commit, then restore original pragma after exit.
 db=Database(q);db.execute('pragma foreign_keys=on');original=db.execute('pragma foreign_keys').fetchone()[0]
 db.execute('pragma foreign_keys=off')
 try:
  with db.atomic():
   db['authors'].transform(rename={'author_name':'display_name'})
   db['books'].transform(rename={'title':'book_title'}, strict=True)
   if db.execute('pragma foreign_key_check').fetchall():
    raise sqlite3.IntegrityError('Explicit foreign_key_check rejected batch')
 finally:db.execute('pragma foreign_keys={}'.format(original))
 assert db.execute('pragma foreign_keys').fetchone()[0]==1
 db.close();after=snap(q)
 assert after['authors']==[(1,'Ada revised'),(2,'Lin')]
 assert after['books']==[(1,'Transactions',1),(2,'Data migration',1),(3,'Graphs revised',2)]
 # Invalid FK in an OFF-before-batch transaction: explicit check must reject it.
 db=Database(q);db.execute('pragma foreign_keys=on');db.execute('pragma foreign_keys=off')
 rejected=False
 try:
  with db.atomic():
   db['books'].update(1,{'author_id':999})
   violations=db.execute('pragma foreign_key_check').fetchall()
   if violations: raise sqlite3.IntegrityError('Explicit foreign_key_check rejected batch')
 except sqlite3.IntegrityError:rejected=True
 finally:db.execute('pragma foreign_keys=on')
 assert rejected and db.execute('pragma foreign_keys').fetchone()[0]==1
 db.close();assert snap(q)==after
 # Verify final column types, constraints, primary keys and strict modes.
 c=sqlite3.connect(q)
 assert c.execute('pragma table_info(authors)').fetchall()==[(0,'id','INTEGER',0,None,1),(1,'display_name','TEXT',1,None,0)]
 assert c.execute('pragma table_info(books)').fetchall()==[(0,'id','INTEGER',0,None,1),(1,'book_title','TEXT',1,None,0),(2,'author_id','INTEGER',1,None,0)]
 assert c.execute('pragma foreign_key_list(books)').fetchall()==[(0,0,'authors','author_id','id','NO ACTION','CASCADE','NONE')]
 modes={row[1]:row[5] for row in c.execute('pragma table_list')}
 assert modes['authors']==modes['books']==1
 try:
  c.execute('update authors set display_name=? where id=1',(b'not text',))
 except sqlite3.IntegrityError: pass
 else: raise AssertionError('STRICT table accepted BLOB into TEXT')
 c.rollback();c.close()
 report['strict_schema_and_type_rejection']=True
 # Verify future cascades still work in a disposable copy; preserve after.db.
 cascade=root/'cascade.db';shutil.copyfile(q,cascade)
 db=Database(cascade);db.execute('pragma foreign_keys=on');db['authors'].delete(1);db.close()
 assert snap(cascade)['books']==[(3,'Graphs revised',2)]
 sql='select a.display_name,b.book_title from authors a join books b on b.author_id=a.id order by b.id'
 cli=subprocess.run([sys.executable,'-m','sqlite_utils',str(q),sql],capture_output=True,text=True,check=True)
 (root/'join.json').write_text(cli.stdout)
 assert json.loads(cli.stdout)==[{'display_name':'Ada revised','book_title':'Transactions'},{'display_name':'Ada revised','book_title':'Data migration'},{'display_name':'Lin','book_title':'Graphs revised'}]
 report.update({'nested_rollback':True,'outer_schema_and_data_rollback':True,'invalid_fk_batch_rollback':True,'cascade_after_migration':True,'cli_join':json.loads(cli.stdout)})
report['after']=after
(root/'report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
