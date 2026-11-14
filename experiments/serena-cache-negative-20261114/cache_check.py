import hashlib,asyncio,json,os,pathlib,shutil,signal,socket,subprocess,sys,tempfile,time
import httpx2
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client
root=pathlib.Path(sys.argv[1]).resolve(); py=pathlib.Path(sys.argv[2]).absolute(); source=pathlib.Path(sys.argv[3]).resolve()
async def read_symbols(port):
 async with streamable_http_client(f'http://127.0.0.1:{port}/mcp', http_client=httpx2.AsyncClient(trust_env=False,timeout=90)) as streams:
  async with ClientSession(streams[0],streams[1]) as session:
   await session.initialize()
   await session.call_tool('initial_instructions',{})
   r=await session.call_tool('get_symbols_overview',{'relative_path':'scripts/check_repo.py','depth':0})
   data=r.model_dump(mode='json')
   if r.is_error: raise RuntimeError(data)
   return data
results=[]
for sig in [signal.SIGTERM,signal.SIGINT]:
 with tempfile.TemporaryDirectory(prefix='serena-cache-') as td:
  d=pathlib.Path(td); project=d/'project'; project.mkdir(); shutil.copytree(source/'scripts',project/'scripts'); (project/'.serena').mkdir()
  (project/'.serena/project.yml').write_text('project_name: cache-real-public-project\nlanguage_servers: [python_jedi]\n')
  s=socket.socket();s.bind(('127.0.0.1',0));port=s.getsockname()[1];s.close()
  env=dict(os.environ,HOME=str(d/'home'),XDG_CACHE_HOME=str(d/'cache'),SERENA_HOME=str(d/'home'),SERENA_USAGE_REPORTING='false',PYTHONPATH=str(root/'src'),PATH=str(py.parent)+os.pathsep+os.environ['PATH'])
  log=d/'server.log'
  with log.open('w') as f:
   p=subprocess.Popen([str(py),'-c','from serena.cli import top_level; top_level()','start-mcp-server','--agent-interface','tools','--transport','streamable-http','--port',str(port),'--project',str(project),'--enable-web-dashboard','false','--enable-gui-log-window','false','--open-web-dashboard','false'],cwd=root,env=env,stdout=f,stderr=f,start_new_session=True)
   try:
    deadline=time.monotonic()+60
    while time.monotonic()<deadline and p.poll() is None and 'Uvicorn running on' not in log.read_text():time.sleep(.2)
    if 'Uvicorn running on' not in log.read_text(): raise RuntimeError(log.read_text()[-4000:])
    symbols=asyncio.run(asyncio.wait_for(read_symbols(port),90))
    before=[{'path':str(x.relative_to(project)),'bytes':x.stat().st_size,'sha256':hashlib.sha256(x.read_bytes()).hexdigest()} for x in project.rglob('*.pkl')]
    p.send_signal(sig);code=p.wait(timeout=20)
    after=[{'path':str(x.relative_to(project)),'bytes':x.stat().st_size,'sha256':hashlib.sha256(x.read_bytes()).hexdigest()} for x in project.rglob('*.pkl')]
    # Decode only files created by this run through the upstream restricted cache loader.
    inspect_code='import json,sys; from solidlsp.ls import SolidLanguageServer; print(json.dumps({p: list(SolidLanguageServer._cache_loader.load(p)["obj"].keys()) for p in sys.argv[1:]}))'
    files=[str(x) for x in project.rglob('*.pkl')]
    loaded=json.loads(subprocess.check_output([str(py),'-c',inspect_code,*files],env=env,text=True)) if files else {}
    results.append({'signal':sig.name,'exit':code,'symbols':symbols,'cache_before':before,'cache_after':after,'cache_keys':[v for v in loaded.values()],'shutdown_log_count':log.read_text().count('SerenaAgent is shutting down')})
   finally:
    if p.poll() is None:p.kill();p.wait()
    try:os.killpg(p.pid,signal.SIGKILL)
    except ProcessLookupError:pass
print(json.dumps(results,indent=2))
