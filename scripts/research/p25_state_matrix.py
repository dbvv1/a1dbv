import os,sys
from pathlib import Path
import json,hashlib,copy

def generate(a,b):
 assert a and b
 assert set(a)==set(b)
 matrix=[]
 serialize=lambda v:json.dumps(v,ensure_ascii=False,separators=(',',':')).encode('utf-8')
 h=lambda v:hashlib.sha256(serialize(v)).hexdigest()
 for t,rows in a.items():
  assert rows and b[t]
  assert len(rows)==len(b[t])
  assert serialize([r['id'] for r in rows])==serialize([r['id'] for r in b[t]])
  assert len({serialize(row['id']) for row in rows})==len(rows)
  for i,row in enumerate(rows):
   assert set(row)==set(b[t][i])
   matrix.append({'table':t,'rowIndex':i,'cells':{k:{'before':h(v),'after':h(b[t][i][k]),'equal':serialize(v)==serialize(b[t][i][k])} for k,v in row.items()}})
 return {'serialization':'Python json UTF-8, compact separators, insertion order; values hashed individually. Row identity privately checked against id.','rows':matrix}

def regressions():
 base={'Example':[{'id':1,'flag':True,'value':None},{'id':2,'flag':False,'value':'ok'}]}
 cases={}
 try:generate({},{})
 except AssertionError:cases['both_empty']='rejected'
 else:raise AssertionError('both_empty')
 positive=generate(base,copy.deepcopy(base));assert all(c['equal'] for row in positive['rows'] for c in row['cells'].values());cases['identical']='pass'
 b=copy.deepcopy(base);b['Example'][0]['flag']=1
 out=generate(base,b);cell=out['rows'][0]['cells']['flag'];assert not cell['equal'] and cell['before']!=cell['after'];cases['boolean_to_number']='difference_detected'
 for name,mutate in [
  ('missing_row',lambda x:x['Example'].pop()),
  ('extra_row',lambda x:x['Example'].append({'id':3,'flag':True,'value':None})),
  ('missing_column',lambda x:x['Example'][0].pop('flag')),
  ('extra_column',lambda x:x['Example'][0].update(extra=True)),
  ('wrong_id',lambda x:x['Example'][0].update(id=99)),
  ('typed_id_change',lambda x:x['Example'][0].update(id=True)),
  ('duplicate_id',lambda x:x['Example'][1].update(id=1)),
  ('missing_table',lambda x:x.clear()),
  ('extra_table',lambda x:x.update(Extra=[])),
 ]:
  b=copy.deepcopy(base);mutate(b)
  try:generate(base,b)
  except AssertionError:cases[name]='rejected'
  else:raise AssertionError(name)
 return cases

if __name__=='__main__':
 if '--synthetic-only' in sys.argv:
  print(json.dumps(regressions(),indent=2));sys.exit(0)
 r=Path(os.environ.get('P25_ARTIFACT_DIR', Path(__file__).resolve().parent))
 a=json.loads((r/'stateverify-S1.private.json').read_text(encoding='utf-8'));b=json.loads((r/'stateverify-S2.private.json').read_text(encoding='utf-8'))
 cases=regressions()
 required={'Envelope':1,'DocumentMeta':1,'Recipient':7,'Field':5,'Signature':1,'DocumentAuditLog':21}
 assert set(a)==set(b)==set(required)
 assert all(len(a[t])==len(b[t])==n for t,n in required.items())
 assert sum(len(row) for rows in a.values() for row in rows)==477
 assert sum(len(row) for rows in b.values() for row in rows)==477
 out=generate(a,b)
 reference=(r/'stateverify-cell-matrix.json').read_bytes()
 assert hashlib.sha256(reference).hexdigest()=='19ad0e976de64691cbf80559a82b6b1492c3f177faf23ec4958cfb806c66b74a'
 expected=json.loads(reference.decode('utf-8'));assert out==expected
 (r/'stateverify-cell-matrix-v3.json').write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8')
 (r/'stateverify-matrix-regressions-v3.json').write_text(json.dumps({'comparison':'Strict serialized representation, not universal JSON semantic equivalence.','cases':cases},indent=2)+'\n',encoding='utf-8')
 print('Original matrix reproduced exactly: 36 rows / 477 cells; synthetic cases: '+str(len(cases)))
