import pathlib,json,subprocess,os,sys,tempfile
cli=pathlib.Path(sys.argv[1]).resolve()
root=pathlib.Path(tempfile.mkdtemp(prefix='rulesync-permissions-'))
rows=[]
for name,pat,act in [('literal-ask','rm -rf build','ask'),('variable-ask','rm -rf ${OUT}','ask'),('variable-deny','rm -rf ${OUT}','deny'),('literal-deny','rm -rf build','deny'),('alternation-ask','rm -rf {build,dist}','ask'),('expanded-ask','rm -rf build','ask'),('alternation-existing','rm -rf {build,dist}','ask')]:
 d=root/name; (d/'.rulesync').mkdir(parents=True,exist_ok=True)
 (d/'rulesync.jsonc').write_text(json.dumps({'targets':['claudecode','factorydroid'],'features':['permissions']}))
 rules={'git status':'allow',pat:act}
 if name=='expanded-ask': rules['rm -rf dist']='ask'
 (d/'.rulesync/permissions.jsonc').write_text(json.dumps({'permission':{'bash':rules}}))
 if name=='alternation-existing':
  (d/'.factory').mkdir()
  (d/'.factory/settings.json').write_text(json.dumps({'commandAllowlist':['git status']}))
 p=subprocess.run(['node',str(cli),'generate'],cwd=d,text=True,capture_output=True,timeout=60,env={**os.environ,'HOME':str(root/'home')})
 (d/'stdout.txt').write_text(p.stdout); (d/'stderr.txt').write_text(p.stderr)
 files={str(f.relative_to(d)):json.loads(f.read_text()) for sub in ['.factory','.claude'] for f in (d/sub).glob('*.json')}
 rows.append({'case':name,'exit':p.returncode,'files':files})
assert len(rows)==7 and all(r['exit']==0 for r in rows)
for r in rows:
 expected=[] if r['case'] in ('alternation-ask','alternation-existing') else ['git status']
 assert r['files'].get('.factory/settings.json',{}).get('commandAllowlist',[])==expected
 if r['case']=='alternation-ask': assert '.factory/settings.json' not in r['files']
 if r['case']=='alternation-existing': assert r['files']['.factory/settings.json']=={}
 assert r['files']['.claude/settings.json']['permissions']['allow']==['Bash(git status)']
print(json.dumps(rows,indent=2))
