import os,sys,tempfile,subprocess,time,socket,signal,json,pathlib
root=pathlib.Path(sys.argv[1]).resolve(); python=pathlib.Path(sys.argv[2]).absolute()
results=[]
for transport in ['sse','streamable-http']:
 for sig in [signal.SIGINT,signal.SIGTERM]:
  with tempfile.TemporaryDirectory() as td:
   s=socket.socket();s.bind(('127.0.0.1',0));port=s.getsockname()[1];s.close()
   env=dict(os.environ,HOME=td,SERENA_HOME=td,SERENA_USAGE_REPORTING='false',PYTHONPATH=str(root/'src'))
   log=pathlib.Path(td)/'out'
   with log.open('w') as f:
    p=subprocess.Popen([str(python),'-c','from serena.cli import top_level; top_level()', 'start-mcp-server','--transport',transport,'--port',str(port),'--enable-web-dashboard','false','--enable-gui-log-window','false','--open-web-dashboard','false'],cwd=root,env=env,stdout=f,stderr=f)
    try:
     deadline=time.monotonic()+40
     while time.monotonic()<deadline:
      if p.poll() is not None:break
      if 'Uvicorn running on' in log.read_text():break
      time.sleep(.1)
     ready='Uvicorn running on' in log.read_text()
     if not ready:raise RuntimeError(log.read_text()[-2000:])
     p.send_signal(sig);code=p.wait(timeout=15)
    finally:
     if p.poll() is None:p.kill();p.wait()
   txt=log.read_text();results.append(dict(transport=transport,signal=sig.name,exit=code,ready=ready,shutdown_count=txt.count('SerenaAgent is shutting down')))
print(json.dumps(results,indent=2))
