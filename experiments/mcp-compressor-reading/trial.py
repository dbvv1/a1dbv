#!/usr/bin/env python3
"""Read one fixed public report through verified local stdio MCP packages.

No downloads, installation, accounts, model calls, source instructions, or writes
outside a NEW output directory. Raw request/results remain in that directory.
"""
from pathlib import Path
import argparse,hashlib,json,os,selectors,signal,subprocess,sys,time

SOURCE_SHA256="008ecd0741bc9bd27675ca46acdcc79953172fdd2551820610b606ae1b86c618"
LOCK_SHA256="af51b30fe667e3e735c94fb822e5335561e8011e24d3f895a0e5f64757687df6"
EXPECTED_FILES={
  "compressor": {
    "cli.py": "3ca371e4410a630d466f4f330b8f9513b7a723fbf0515b10e85e8736ad6d273f",
    "transforms.py": "bab08217d72c1fd76361930af426129c7901d59f9ba79e1211b5342cfecaddf3",
    "client.py": "4a5767c4a28335b70d233835cd1e13cacd7bd9da3344796df3448d8b0cf4d138",
    "_native.abi3.so": "0fd158f85cb3ad431642d2b2f5359599df0f24df1f99456a5eac6a22b60d69a2",
    "core.py": "741242af49d5e3f8752f5ebdba6f5381aa70afff4ca73fe8f798c2c897bfc454",
    "just_bash_host.py": "26420433a0dafaa9278739ea09d7da46a0cb259733f49262bf0e7d79cbd82ae8",
    "__init__.py": "958549e13f6916d4cbe631413d2edb63410d3dc8233bcd6babd673f83c70d9b7"
  },
  "filesystem": {
    "package.json": "42ddd58e3f5580d07af425bc7394d78496db410c3a522c73c174ea108a051771",
    "dist/path-utils.js": "5736001d7214f0d8eb47abeb0849f777529c17aa7b8b5c3320209e89bd963f38",
    "dist/version.js": "044a3819acfb25e8038eb742845502eb255fa719aaa158b4befad5a58a44854d",
    "dist/server.js": "139c72a59734005319ea66463ea4d405bb29b456082b9a6b68074d1063dbbc34",
    "dist/index.js": "fd44be644b81d088eded98d73a5521a179850e716102aa1d7a9edccf6d79fba9",
    "dist/roots-utils.js": "750172b0d92bdcccd17925e04f80b18aeb284e844b1fdd0a457fabf4a3e76ef9",
    "dist/path-validation.js": "07fbf314443ad3f4a30ab462b122a18f53bbc895f628e3a5830bca8aed59386b",
    "dist/pinned-directory.js": "170ab06bde78c692297ead795c279dae77db7c57f1dd37fc907a8304ce8fdd85",
    "dist/lib.js": "7acd502f656812f99e22e0352649564b5ce2707b5623a136239c0da7ab36b72c"
  }
}

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument("--node",type=Path,required=True)
parser.add_argument("--compressor-runtime",type=Path,required=True,help="Unpacked verified wheel directory")
parser.add_argument("--backend-root",type=Path,required=True,help="Directory containing the supplied npm lock and installed node_modules")
parser.add_argument("--source-report",type=Path,required=True)
parser.add_argument("--output",type=Path,required=True)
args=parser.parse_args()
NODE=args.node.resolve(strict=True)
COMPRESSOR=args.compressor_runtime.resolve(strict=True)
BACKEND=args.backend_root.resolve(strict=True)
PYTHON=Path(sys.executable)
if args.source_report.stat().st_size>1024*1024:raise SystemExit("Source report exceeds the fixed input size bound")
source=args.source_report.read_bytes()
if hashlib.sha256(source).hexdigest()!=SOURCE_SHA256:raise SystemExit("Source report differs from the fixed public artifact")
if hashlib.sha256((BACKEND/'package-lock.json').read_bytes()).hexdigest()!=LOCK_SHA256:raise SystemExit("Use the supplied lockfile and npm ci --ignore-scripts in a fresh directory")
for label,base in [('compressor',COMPRESSOR/'mcp_compressor'),('filesystem',BACKEND/'node_modules/@modelcontextprotocol/server-filesystem')]:
 for name,expected in EXPECTED_FILES[label].items():
  if hashlib.sha256((base/name).read_bytes()).hexdigest()!=expected:raise SystemExit(f"Verified package file differs: {label}/{name}")
SERVER=BACKEND/'node_modules/@modelcontextprotocol/server-filesystem/dist/index.js'
R=args.output.absolute()
R.mkdir(exist_ok=False)
for name in ['home','config','cache','data','tmp','evidence','public-input']:(R/name).mkdir()
INPUT=R/'public-input'
(INPUT/'sources.md').write_bytes(source)
EVIDENCE=R/'evidence'
ENV={'PATH':str(NODE.parent)+':/usr/bin:/bin','HOME':str(R/'home'),'XDG_CONFIG_HOME':str(R/'config'),'XDG_CACHE_HOME':str(R/'cache'),'XDG_DATA_HOME':str(R/'data'),'TMPDIR':str(R/'tmp'),'PYTHONPATH':str(COMPRESSOR),'PYTHONNOUSERSITE':'1','PYTHONDONTWRITEBYTECODE':'1','LANG':'C.UTF-8','CI':'true','NO_UPDATE_NOTIFIER':'1'}

def h(x):return hashlib.sha256(x).hexdigest()
def encoded(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'))
def sizes(x):
 s=encoded(x);return {'unicode_chars':len(s),'utf8_bytes':len(s.encode())}
class RPC:
 def __init__(self,label,command):
  self.label=label;self.next_id=0;self.buffer=b'';self.log=[]
  self.err=(EVIDENCE/f'{label}.stderr').open('xb')
  self.p=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=self.err,env=ENV,start_new_session=True,bufsize=0,cwd=R)
  self.sel=selectors.DefaultSelector();self.sel.register(self.p.stdout,selectors.EVENT_READ)
 def send(self,msg):self.p.stdin.write((encoded(msg)+'\n').encode());self.p.stdin.flush()
 def request(self,method,params=None):
  self.next_id+=1;i=self.next_id;msg={'jsonrpc':'2.0','id':i,'method':method}
  if params is not None:msg['params']=params
  self.send(msg);deadline=time.monotonic()+25
  while time.monotonic()<deadline:
   while b'\n' in self.buffer:
    line,self.buffer=self.buffer.split(b'\n',1)
    if not line.strip():continue
    reply=json.loads(line)
    if reply.get('id')==i and 'method' not in reply:
     self.log.append({'request':msg,'response':reply});return reply
    if 'method' in reply and 'id' in reply:
     self.send({'jsonrpc':'2.0','id':reply['id'],'error':{'code':-32601,'message':'Client has no delegated capabilities'}})
   events=self.sel.select(max(0,deadline-time.monotonic()))
   if events:
    block=os.read(self.p.stdout.fileno(),65536)
    if not block:raise RuntimeError(f'{self.label}: stdout closed, exit={self.p.poll()}')
    self.buffer+=block
    if len(self.buffer)>4*1024*1024:raise RuntimeError('Response exceeded the bounded reader limit')
  raise TimeoutError(f'{self.label}: {method}')
 def start(self):
  init=self.request('initialize',{'protocolVersion':'2025-11-25','capabilities':{},'clientInfo':{'name':'a1dbv-public-read-probe','version':'1.0.0'}})
  assert 'result' in init,init
  self.send({'jsonrpc':'2.0','method':'notifications/initialized'})
  return init
 def close(self):
  if self.p.stdin:self.p.stdin.close()
  self.shutdown='stdin-eof'
  try:self.p.wait(timeout=3)
  except subprocess.TimeoutExpired:
   self.shutdown='sigterm'
   os.killpg(self.p.pid,signal.SIGTERM)
   try:self.p.wait(timeout=3)
   except subprocess.TimeoutExpired:
    self.shutdown='sigkill';os.killpg(self.p.pid,signal.SIGKILL);self.p.wait(timeout=3)
  self.sel.close();self.err.close()
  (EVIDENCE/f'{self.label}.json').write_text(json.dumps(self.log,ensure_ascii=False,indent=2)+'\n')

def result(reply):
 if 'error' in reply:raise RuntimeError(reply['error'])
 return reply['result']
def tool(call,name,args):return result(call.request('tools/call',{'name':name,'arguments':args}))

summary={'started_utc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'external_models_or_native_coding_clients_activated':False,'custom_stdio_mcp_client_used':True,'script_sha256':h(Path(__file__).read_bytes()),'modes':{},'inputs':{p.name:{'sha256':h(p.read_bytes()),'bytes':p.stat().st_size} for p in INPUT.iterdir() if p.is_file()}}
(R/'outside-public-sentinel.txt').write_text('Harmless synthetic outside-allowlist sentinel.\n')
backend=[str(NODE),str(SERVER),str(INPUT)]
queries={'small':{'path':str(INPUT/'sources.md'),'head':8},'large':{'path':str(INPUT/'sources.md')},'missing':{'path':str(INPUT/'missing-public-document.md')},'outside':{'path':str(R/'outside-public-sentinel.txt')}}
all_results={}
for label,options in [('direct',None),('medium',[]),('medium-shrink',['--shrinkfit=10000']),('max', ['-c','max'])]:
 command=backend if options is None else [str(PYTHON),'-S','-m','mcp_compressor.cli','-c','medium',*options,'--',*backend]
 # max has a single explicit compression flag.
 if label=='max':command=[str(PYTHON),'-S','-m','mcp_compressor.cli','-c','max','--',*backend]
 rpc=RPC(label,command)
 try:
  init=rpc.start();listing=result(rpc.request('tools/list'));tools=listing['tools'];names=[x['name'] for x in tools]
  mode={'initialize_result_size':sizes(init['result']),'protocol':init['result'].get('protocolVersion'),'tool_count':len(tools),'tool_names':names,'tools_list_size':sizes(listing),'results':{}}
  if label=='direct':
   assert 'read_text_file' in names,names
   selected=next(x for x in tools if x['name']=='read_text_file');mode['read_schema_size']=sizes(selected)
  else:
   schema_name=next(n for n in names if n.endswith('get_tool_schema'))
   invoke_name=next(n for n in names if n.endswith('invoke_tool'))
   if label=='max':
    list_name=next(n for n in names if n.endswith('list_tools'));mode['deferred_list_size']=sizes(tool(rpc,list_name,{}))
   schema=tool(rpc,schema_name,{'tool_name':'read_text_file'});mode['read_schema_size']=sizes(schema)
  outcomes={}
  for q,args in queries.items():
   response=tool(rpc,'read_text_file',args) if label=='direct' else tool(rpc,invoke_name,{'tool_name':'read_text_file','tool_input':args})
   outcomes[q]=response;mode['results'][q]={'envelope_size':sizes(response),'isError':response.get('isError',False),'content_types':[c.get('type') for c in response.get('content',[])],'has_structured_content':'structuredContent' in response,'serialized_sha256':h(encoded(response).encode())}
   if label=='medium-shrink' and q=='large':
    full=tool(rpc,invoke_name,{'tool_name':'read_text_file','tool_input':args,'full':True});outcomes['large_recovered']=full
    mode['results']['large_recovered']={'envelope_size':sizes(full),'serialized_sha256':h(encoded(full).encode())}
  all_results[label]=outcomes;summary['modes'][label]=mode
  print(label,mode['tool_count'],mode['tools_list_size'],flush=True)
 finally:
  rpc.close()
  if label in summary['modes']:summary['modes'][label]['shutdown']={'method':rpc.shutdown,'exit_code':rpc.p.returncode}
# v0.40.0 adds client display metadata. Keep raw envelope equality separate
# from exact preservation of every original upstream field, and validate the
# ONLY allowed addition against the actual discovered tool definition.
display_keys=['name','title','inputSchema','description','annotations']
display={key:selected[key] for key in display_keys if key in selected}
def compare(expected,actual):
 extra=set(actual)-set(expected)
 meta=actual.get('_meta',{})
 return {'raw_envelope_equal':expected==actual,
         'upstream_fields_exact':all(actual.get(k)==v for k,v in expected.items()),
         'only_added_display_metadata':extra=={'_meta'} and meta=={'atlassian.com/mcp-compressor/tool':display}}
for label in ['medium','max']:
 summary['modes'][label]['preservation']={q:compare(all_results['direct'][q],all_results[label][q]) for q in queries}
summary['modes']['medium-shrink']['recovery']=compare(all_results['direct']['large'],all_results['medium-shrink']['large_recovered'])
summary['modes']['medium-shrink']['unchanged_small_errors']={q:compare(all_results['direct'][q],all_results['medium-shrink'][q]) for q in ['small','missing','outside']}
shrunk=all_results['medium-shrink']['large'];original=all_results['direct']['large'];recovered=all_results['medium-shrink']['large_recovered']
texts=lambda value:sum(len(c.get('text','')) for c in value.get('content',[]))
summary['modes']['medium-shrink']['bounded_text_not_envelope']={
 'budget':10000,'text_chars':texts(shrunk),'serialized_envelope_chars':sizes(shrunk)['unicode_chars'],
 'structured_content_exact':shrunk.get('structuredContent')==original.get('structuredContent'),
 'truncation_report':shrunk.get('_meta',{}).get('truncation'),
 'original_text_sha256':h(original['content'][0]['text'].encode()),
 'recovered_text_sha256':h(recovered['content'][0]['text'].encode()),
 'source_file_sha256':h((INPUT/'sources.md').read_bytes())}
summary['measurement']='Compact ensure_ascii=False JSON of MCP result objects; Unicode characters and UTF-8 bytes, not model tokens, bills or complete-session cost.'
summary['runtime']={'compressor_version':'0.40.0','filesystem_version':'2.1.0','node_version':subprocess.check_output([str(NODE),'--version'],env=ENV,text=True,timeout=10).strip(),'python_version':sys.version.split()[0],'lock_sha256':LOCK_SHA256}
summary['upstream_input']={'repo':'dbvv1/a1dbv','commit':'9f905b0166278975f9831e7d142b9ca4cae423c5','path':'docs/collaboration/local-jobs/artifacts/A-SKILL-MCP-WIDE-20261029/sources.md','sha256':SOURCE_SHA256}
summary['completed_utc']=time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
checks=[v for label in ['medium','max'] for v in summary['modes'][label]['preservation'].values()]
checks+=[summary['modes']['medium-shrink']['recovery'],*summary['modes']['medium-shrink']['unchanged_small_errors'].values()]
assert all(v['upstream_fields_exact'] and v['only_added_display_metadata'] for v in checks)
assert texts(shrunk)<=10000 and summary['modes']['medium-shrink']['bounded_text_not_envelope']['structured_content_exact']
assert h(recovered['content'][0]['text'].encode())==h((INPUT/'sources.md').read_bytes())
assert all(v['shutdown']=={'method':'stdin-eof','exit_code':0} for v in summary['modes'].values()), 'Child did not exit normally'
summary['status']='pass'
(EVIDENCE/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':summary['status'],'modes':len(summary['modes']),'output':str(R)},ensure_ascii=False))
