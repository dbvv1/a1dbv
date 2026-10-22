# Requires an already checksum-verified Whiteboard v0.3.4 Linux x64 remote runtime.
# Raw state and local evidence are private; publish only sanitized results.
import json, pathlib, subprocess, os, time, urllib.request, tempfile, sys, shlex, signal, urllib.parse
def quiet_exception(kind,value,traceback):
 print('Trial failed ('+kind.__name__+'); inspect private local evidence.',file=sys.stderr)
sys.excepthook=quiet_exception
runtime=pathlib.Path(sys.argv[1]).resolve()
assert (runtime/'dist/cli.js').is_file()
T=pathlib.Path(tempfile.mkdtemp(prefix='whiteboard-replay-')); R=T/'repo'; W=str(T/'wb'); results={}
for name in ['repo','home','config','cache','state']: (T/name).mkdir()
env={'HOME':str(T/'home'),'XDG_CONFIG_HOME':str(T/'config'),'XDG_CACHE_HOME':str(T/'cache'),'DEV_REVIEW_HOME':str(T/'state'),'DEV_REVIEW_SERVER_DIR':str(T/'state'),'DO_NOT_TRACK':'1','PATH':str(runtime/'bin')+':/usr/bin:/bin','SHELL':'/bin/sh','GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':'/dev/null'}
cmd=['env','-i',*[k+'='+v for k,v in env.items()],str(runtime/'bin/node'),str(runtime/'dist/cli.js'),'--state-dir',str(T/'state')]
pathlib.Path(W).write_text('#!/bin/sh\nexec '+shlex.join(cmd)+' "$@"\n');pathlib.Path(W).chmod(0o700)
diffr=runtime/'node_modules/@dev.fast/diffr-linux-x64/diffr'
config=json.loads(subprocess.check_output([str(diffr),'config','show','--json'],env=env,text=True))
assert config['plugins']['shape']['bundled']['summarize']['enabled'] is False

def run(args,cwd=T):
 return subprocess.run(args,cwd=cwd,text=True,capture_output=True,env=env,timeout=30)
def git(*args):
 p=run(['git',*args],R); assert p.returncode==0,"Git command failed; inspect private local evidence";return p.stdout.strip()
def api(name,data):
 p=run([W,'api',name,json.dumps(data)]);return p.returncode,p.stdout,p.stderr
def store(name,x):
 (T/(name+'.json')).write_text(json.dumps(x,indent=2));return x
git('init','-b','main');git('config','user.name','Synthetic Trial');git('config','user.email','trial@example.invalid')
(R/'policy.ts').write_text('export function allowed(role: string): boolean {\n  return role === "admin";\n}\n')
(R/'entry.ts').write_text('import { allowed } from "./policy";\nexport function canDelete(role: string): boolean {\n  return allowed(role);\n}\n')
git('add','.');git('commit','-m','base: admin only');base=git('rev-parse','HEAD')
(R/'policy.ts').write_text('export function allowed(role: string): boolean {\n  return role === "admin" || role === "guest";\n}\n')
git('add','.');git('commit','-m','change: allow guests');head=git('rev-parse','HEAD')
store('fixture',{'base':base,'head':head,'diff':git('diff',base,head)})
def stop(p,log):
 try:
  try: os.killpg(p.pid,signal.SIGTERM)
  except ProcessLookupError: pass
  try: p.wait(timeout=5)
  except subprocess.TimeoutExpired:
   os.killpg(p.pid,signal.SIGKILL);p.wait(timeout=5)
  # Reap any descendant that outlived the leader, only in this owned group.
  try: os.killpg(p.pid,signal.SIGKILL)
  except ProcessLookupError: pass
 finally: log.close()
def start():
 log=open(T/'server.private.log','a');p=None
 try:
  p=subprocess.Popen([W,'server','start'],cwd=T,stdout=log,stderr=log,env=env,start_new_session=True)
  deadline=time.monotonic()+30
  while time.monotonic()<deadline:
   s=run([W,'server','status','--json'])
   if s.returncode==0:return p,log
   if p.poll() is not None:raise RuntimeError('server exited')
   time.sleep(.2)
  raise RuntimeError('server readiness timeout')
 except BaseException:
  if p is not None:stop(p,log)
  else:log.close()
  raise
def http(route):
 d=json.loads(next((T/'state').rglob('server.json')).read_text())
 u=urllib.parse.urlsplit(d['url'])
 assert u.scheme=='http' and u.hostname=='127.0.0.1' and u.port, 'Not a loopback service'
 req=urllib.request.Request(d['url']+'/reviews-api/'+route,headers={'x-review-token':d['token']})
 with urllib.request.build_opener(urllib.request.ProxyHandler({})).open(req,timeout=30) as r:return r.read().decode()
if '--inject-failure' in sys.argv[2:]:
 p,log=start()
 try:
  raise RuntimeError('intentional failure after server startup')
 finally:
  stop(p,log)
  try:os.killpg(p.pid,0);group_gone=False
  except ProcessLookupError:group_gone=True
  print(json.dumps({'injected_failure_cleanup':p.poll() is not None and group_gone,'discovery_removed':not list((T/'state').rglob('server.json'))}))
p,log=start()
try:
 rc,out,err=api('session_create',{'title':'Synthetic guest-access review','target':{'kind':'commits','repositoryPath':str(R),'base':base,'head':head},'open':False});assert rc==0,"Whiteboard API call failed; inspect private local evidence"
 created=store('created',json.loads(out));sid=created['sessionId'];results['created']=True
 results['pins_match']=created['session']['pins']['base']==base and created['session']['pins']['head']==head
 def edit(label,content):
  rc,out,err=api('session_edit',{'sessionId':sid,'edit':{'type':'insert','content':content}})
  store(label,{'rc':rc,'out':json.loads(out) if out.strip().startswith('{') else out,'error':err});return rc,out,err
 rc,_,err=edit('peek',{'type':'code_peek','source':'head/policy.ts#L1-L3'});assert rc==0,"Whiteboard API call failed; inspect private local evidence";results['peek_saved']=True
 rc,_,err=edit('stack',{'type':'call_stack_diff','title':'Real entry-to-policy chain','base':[{'key':'entry','source':'base/entry.ts#L2-L4','label':'canDelete'},{'key':'policy','parentKey':'entry','source':'base/policy.ts#L1-L3','label':'allowed'}],'head':[{'key':'entry','source':'head/entry.ts#L2-L4','label':'canDelete'},{'key':'policy','parentKey':'entry','source':'head/policy.ts#L1-L3','label':'allowed'}]});assert rc==0,"Whiteboard API call failed; inspect private local evidence";results['stack_saved']=True
 rc,_,err=edit('missing',{'type':'code_peek','source':'head/missing.ts#L1'});results['missing_rejected']=rc!=0 and 'File is unavailable at the pinned commit.' in err
 rc,_,err=edit('wrong_explanation',{'type':'call_stack_diff','title':'DELIBERATELY FALSE: guest deletion is blocked','base':[],'head':[{'key':'false','source':'head/policy.ts#L1-L3','label':'Rejects every guest; only admins pass'}]});results['wrong_explanation_accepted']=rc==0
 for side,sha in [('base',base),('head',head)]:
  data=store('file-'+side,json.loads(http(sid+'/file?side='+side+'&file=policy.ts')))
  results['file_'+side+'_matches_git']=data['text']==git('show',sha+':policy.ts')+'\n'
 diff=http(sid+'/structural-diff');(T/'structural.ndjson').write_text(diff)
 events=[json.loads(l) for l in diff.splitlines() if l.strip()];results['structural_event_types']=[e.get('type') for e in events];results['structural_errors']=[e for e in events if e.get('type')=='error'];store('structural-events',events)
 rc,out,err=api('session_get',{'sessionId':sid,'full':True,'format':'json'});assert rc==0,"Whiteboard API call failed; inspect private local evidence"
 before=store('before-restart',json.loads(out));results['snapshot_saved']=True
finally:stop(p,log)
p,log=start()
try:
 rc,out,err=api('session_get',{'sessionId':sid,'full':True,'format':'json'});assert rc==0,"Whiteboard API call failed; inspect private local evidence"
 after=store('after-restart',json.loads(out));results['restart_snapshot_equal']=before==after
finally:stop(p,log)
results['server_stopped']=p.poll() is not None and not list((T/'state').rglob('server.json'))
results['structural_complete']=events[-1].get('type')=='complete' and events[-1].get('succeeded')==1 and events[-1].get('failed')==0
results['readback_blocks']=before['document'][0]['type']=='code_peek' and before['document'][1]['type']=='call_stack_diff' and before['document'][2]['head'][0]['label']=='Rejects every guest; only admins pass'
store('results',results)
assert all(v is True for k,v in results.items() if k not in ('structural_event_types','structural_errors')), 'Trial checks did not match expected results'
assert results['structural_event_types']==['start','file','complete'] and results['structural_errors']==[], 'Structural diff failed'

store('results',results);print(json.dumps(results,indent=2));print('Evidence directory:',T)
