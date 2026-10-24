import os, pathlib, json, subprocess, socket, time, signal, urllib.request, argparse, hashlib, shutil

p = argparse.ArgumentParser(description="Run the fixed Payment RPC with real flagd, using installed dependencies only.")
p.add_argument("source", type=pathlib.Path)
p.add_argument("flagd", type=pathlib.Path)
p.add_argument("output", type=pathlib.Path)
a=p.parse_args()
SOURCE=a.source.resolve(); FLAGD=a.flagd.resolve(); ROOT=a.output.resolve()
ASSETS=pathlib.Path(__file__).resolve().parent
if ROOT.exists(): raise SystemExit("Output must not exist; nothing overwritten.")
if ROOT == SOURCE or SOURCE in ROOT.parents: raise SystemExit("Output must be outside source checkout.")
EXPECTED_SHA="ba1757b3f197916640fff4f7c549b99e54835ab8"
if subprocess.check_output(["git","-C",str(SOURCE),"rev-parse","HEAD"],text=True,timeout=30).strip()!=EXPECTED_SHA: raise SystemExit("Wrong source commit")
checks={"src/payment/package.json":"009df2fefe40d7dcd7c19be83203a83d90a6154b54202ad79bb183e4461e4d20","src/flagd/demo.flagd.json":"1b88feca8bed0c2cffdbc082a60222a11f65bdb24399240db1f75c9e5c01161f","src/payment/charge.js":"0b69b56d3d1151f5e9e2bf5f130d5fab49199afa4692f2112f3a208c493e4d80","src/payment/index.js":"b3ed7f8319f2af6b5a115d0d88b59101b78cee35acc7ae9531fc2bda80e55dda","src/payment/logger.js":"5d46b76352bd5056e9ddfd3b5448cbb2cf122318fd3c2a61eb8b661516c47405","src/payment/package-lock.json":"20c40f858e1ce135584c45a96056407108f153ea999e99ab5f629b775bda451d","pb/demo.proto":"28e2c4badedcbed88543afdafc8c60f9d9e9e5cc499ee3b7098a6438d3deaf85"}
for name,expected in checks.items():
 if hashlib.sha256((SOURCE/name).read_bytes()).hexdigest()!=expected: raise SystemExit("Source bytes changed: "+name)
if hashlib.sha256(FLAGD.read_bytes()).hexdigest()!="5595a65ee997d59ab4a5aeffb6401584754069f16408e235423ef1f00c7d0f1f": raise SystemExit("Wrong flagd binary hash")
PAY=SOURCE/"src/payment"
if (PAY/"demo.proto").read_bytes()!=(SOURCE/"pb/demo.proto").read_bytes(): raise SystemExit("Prepare matching demo.proto using the official local-build instructions")
if not (PAY/"node_modules/@opentelemetry/auto-instrumentations-node").is_dir(): raise SystemExit("Run npm ci in the fixed payment directory first")
ROOT.mkdir(parents=False)
(ROOT/"tmp").mkdir()
NODE=subprocess.check_output(['which','node'],text=True).strip()
base=json.loads((SOURCE/'src/flagd/demo.flagd.json').read_text())
results=[]
def ports(n):
 ss=[]
 try:
  for i in range(n):
   s=socket.socket();s.bind(('127.0.0.1',0));ss.append(s)
  return [s.getsockname()[1] for s in ss]
 finally:
  for s in ss:s.close()
def stop(p):
 forced=False
 if p.poll() is None:
  os.killpg(p.pid,signal.SIGTERM)
  try:p.wait(timeout=8)
  except subprocess.TimeoutExpired:os.killpg(p.pid,signal.SIGKILL);p.wait(timeout=5);forced=True
 try:os.killpg(p.pid,0);gone=False
 except ProcessLookupError:gone=True
 if not gone:
  os.killpg(p.pid,signal.SIGKILL)
  time.sleep(.1)
  try:os.killpg(p.pid,0);gone=False
  except ProcessLookupError:gone=True
 return {'pid':p.pid,'returncode':p.returncode,'forced':forced,'group_gone':gone}
for name,variant,tid in [('normal','off','11111111111111111111111111111111'),('injected','100%','22222222222222222222222222222222')]:
 out=ROOT/name;out.mkdir(exist_ok=False)
 flags=json.loads(json.dumps(base)); flags['flags']['paymentFailure']['defaultVariant']=variant;flags['flags']['emitRawPii']['defaultVariant']='off'
 (out/'flags.json').write_text(json.dumps(flags))
 payment,flagport,management,sync,ofrep=ports(5)
 env={'PATH':os.environ['PATH'],'HOME':str(ROOT/'home'),'TMPDIR':str(ROOT/'tmp'),'PAYMENT_PORT':str(payment),'FLAGD_HOST':'127.0.0.1','FLAGD_PORT':str(flagport),'FLAGD_TLS':'false','FLAGD_RESOLVER':'rpc','FLAGD_CACHE':'disabled','OTEL_SERVICE_NAME':'payment','OTEL_TRACES_EXPORTER':'console','OTEL_METRICS_EXPORTER':'none','OTEL_LOGS_EXPORTER':'none','OTEL_NODE_RESOURCE_DETECTORS':'env','OTEL_NODE_ENABLED_INSTRUMENTATIONS':'grpc,pino','OTEL_TRACES_SAMPLER':'always_on','P49_PAYMENT_DIR':str(PAY),'P49_TRACE_ID':tid,'P49_SCENARIO':name}
 (ROOT/'home').mkdir(exist_ok=True)
 flag_env=dict(env, OTEL_SERVICE_NAME='flagd')
 ff=open(out/'flagd.log','w');pf=open(out/'payment.log','w');ps=[]
 try:
  f=subprocess.Popen([str(FLAGD),'start','--uri',(out/'flags.json').as_uri(),'--port',str(flagport),'--management-port',str(management),'--sync-port',str(sync),'--ofrep-port',str(ofrep),'--log-format','json'],stdout=ff,stderr=subprocess.STDOUT,env=flag_env,start_new_session=True);ps.append(f)
  opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
  for i in range(100):
   if f.poll() is not None:raise RuntimeError('flagd exited; see log')
   try:
    with opener.open(f'http://127.0.0.1:{management}/readyz',timeout=.5) as r:
     if r.status==200:break
   except Exception:time.sleep(.1)
  else:raise RuntimeError('flagd readiness timed out')
  p=subprocess.Popen([NODE,'--require','@opentelemetry/auto-instrumentations-node/register','--require',str(ASSETS/'p49_observe_flags.cjs'),'index.js'],cwd=PAY,stdout=pf,stderr=subprocess.STDOUT,env=env,start_new_session=True);ps.append(p)
  client=subprocess.run([NODE,str(ASSETS/'p49_payment_request.cjs')],env=env,capture_output=True,text=True,timeout=40)
  (out/'client.stdout').write_text(client.stdout);(out/'client.stderr').write_text(client.stderr)
  if client.returncode:raise RuntimeError('client process failed')
  data=json.loads(client.stdout);data['ports']={'payment':payment,'flagd':flagport};data['processes']={'payment':p.pid,'flagd':f.pid};results.append(data)
  time.sleep(1)
 finally:
  cleanup=[stop(p) for p in reversed(ps)]
  (out/'cleanup.json').write_text(json.dumps(cleanup,indent=2))
  pf.close();ff.close()
(ROOT/'results.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))

subprocess.run([shutil.which("python3"),str(ASSETS/"p49_verify_payment.py"),str(ROOT)],check=True,timeout=30)
