"""Independent synthetic reproduction of QuantEcon #646, not an upstream patch."""
import argparse, json, subprocess, sys, threading, time
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
CSV=b'observation_date,UNRATE\n2024-01-01,3.7\n2024-02-01,3.9\n'
LOG=[]
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args): pass
 def do_HEAD(self):
  LOG.append({'method':'HEAD','path':self.path,'range':self.headers.get('Range')})
  self.send_response(405 if self.path=='/head405' else 200)
  self.send_header('Content-Length',str(len(CSV)) if self.path=='/normal' else '0'); self.end_headers()
 def do_GET(self):
  LOG.append({'method':'GET','path':self.path,'range':self.headers.get('Range')})
  if self.path=='/slow': time.sleep(.4)
  payload=CSV
  status=200
  if self.path=='/missing': payload=b'not found';status=404
  if self.path=='/bad': payload=b'observation_date,UNRATE\n2024-01-01,bad\n'
  if self.path=='/empty': payload=b''
  if self.path=='/html': payload=b'<html>Service error</html>'
  headers={}
  if self.path=='/normal' and self.headers.get('Range'):
   first,last=self.headers['Range'].removeprefix('bytes=').split('-')
   first,last=int(first),int(last) if last else len(payload)-1
   headers['Content-Range']=f'bytes {first}-{min(last,len(payload)-1)}/{len(payload)}'
   payload=payload[first:last+1];status=206
  self.send_response(status);self.send_header('Content-Length',str(len(payload)))
  for key,value in headers.items(): self.send_header(key,value)
  self.end_headers()
  try:self.wfile.write(payload)
  except (BrokenPipeError,ConnectionResetError):pass

def fetch_csv(url, *, timeout=.15):
 import requests, polars as pl
 if not isinstance(url,str) or not url.strip(): raise ValueError('A URL is required')
 r=requests.get(url,timeout=timeout);r.raise_for_status()
 frame=pl.read_csv(r.content,try_parse_dates=True,schema_overrides={'UNRATE':pl.Float64})
 if frame.columns!=['observation_date','UNRATE'] or frame.schema!={'observation_date':pl.Date,'UNRATE':pl.Float64}:
  raise ValueError('Expected observation_date Date and UNRATE Float64 columns')
 return frame

def child(mode,url):
 import polars as pl
 if mode=='direct': frame=pl.read_csv(url,try_parse_dates=True)
 else:frame=fetch_csv(url)
 print(json.dumps({'version':pl.__version__,'rows':frame.height,'columns':frame.columns,'schema':{k:str(v) for k,v in frame.schema.items()},'data':frame.to_dict(as_series=False)},default=str))

VERSIONS={'old':'1.44.2','new':'2.0.0'}
CASES=[('direct',p) for p in ('normal','head405','zerohead')]+[('fixed',p) for p in ('normal','head405','zerohead','missing','bad','empty','slow','html','missing-input')]
FRAME={'rows':2,'columns':['observation_date','UNRATE'],'schema':{'observation_date':'Date','UNRATE':'Float64'},'data':{'observation_date':['2024-01-01','2024-02-01'],'UNRATE':[3.7,3.9]}}
def require(condition,message):
 if not condition: raise ValueError(message)
def validate(row):
 version,mode,case=row['environment'],row['mode'],row['case']
 r=row['result'];require('timeout' not in r,'child exceeded wall-clock limit')
 require(not r['stderr'],'unexpected stderr: '+r['stderr'])
 d=json.loads(r['stdout'])
 error={'missing':'HTTPError','bad':'ComputeError','empty':'NoDataError','slow':'ReadTimeout','html':'ValueError','missing-input':'ValueError'}.get(case) if mode=='fixed' else None
 if version=='new' and mode=='direct' and case!='normal':error={'head405':'FileNotFoundError','zerohead':'NoDataError'}[case]
 if error:
  require(r['exit']==1 and d.get('error')==error,f'expected {error}, got {r}')
  if case=='missing':require('404' in d['message'],'missing status evidence')
 else:
  require(r['exit']==0 and d.pop('version',None)==VERSIONS[version],'wrong version or failed read')
  require(d==FRAME,'frame schema or data differs')
 events=row['requests']
 if case=='missing-input':require(events==[],'missing input performed IO')
 elif mode=='fixed' or version=='old':require(events==[{'method':'GET','path':'/'+case,'range':None}],'expected one plain GET')
 elif case=='zerohead':require(events==[{'method':'HEAD','path':'/zerohead','range':None}],'expected HEAD only')
 else:
  require(bool(events) and events[0]['method']=='HEAD','expected initial HEAD')
  require(all(e['path']=='/'+case for e in events),'cross-case request')
  require(any(e['method']=='GET' and e['range'] for e in events),'expected ranged GET')

def main():
 parser=argparse.ArgumentParser(description=__doc__)
 parser.add_argument('--python-old',required=True);parser.add_argument('--python-new',required=True)
 parser.add_argument('--report',type=Path,required=True)
 args=parser.parse_args();report={'status':'failed','prerequisites':{},'cases':[],'errors':[]}
 server=None
 try:
  for env,exe in [('old',args.python_old),('new',args.python_new)]:
   result=subprocess.run([exe,'-c','import json,polars,requests,platform; print(json.dumps(dict(polars=polars.__version__, requests=requests.__version__, python=platform.python_version())))'],capture_output=True,text=True,timeout=10)
   require(result.returncode==0,f'{env} interpreter/dependencies unavailable: {result.stderr}')
   versions=json.loads(result.stdout);report['prerequisites'][env]=versions
   require(versions['polars']==VERSIONS[env] and versions['requests']=='2.32.5',f'{env} requires polars {VERSIONS[env]} and requests 2.32.5; got {versions}')
  server=ThreadingHTTPServer(('127.0.0.1',0),Handler)
  threading.Thread(target=server.serve_forever,daemon=True).start()
  for env,exe in [('old',args.python_old),('new',args.python_new)]:
   for mode,case in CASES:
    LOG.clear();url='' if case=='missing-input' else f'http://127.0.0.1:{server.server_port}/{case}'
    try:
     run=subprocess.run([exe,str(Path(__file__).resolve()),'--child',mode,url],capture_output=True,text=True,timeout=8)
     result={'exit':run.returncode,'stdout':run.stdout.strip(),'stderr':run.stderr.strip()[-500:]}
    except subprocess.TimeoutExpired:result={'timeout':8}
    row={'environment':env,'mode':mode,'case':case,'requests':LOG.copy(),'result':result}
    report['cases'].append(row)
    try:validate(row);row['passed']=True
    except Exception as e:row['passed']=False;report['errors'].append(f'{env}/{mode}/{case}: {e}')
  require(len(report['cases'])==24,'missing cases')
  if not report['errors']:report['status']='passed'
 except Exception as e:report['errors'].append(f'{type(e).__name__}: {e}')
 finally:
  if server is not None:server.shutdown();server.server_close()
  args.report.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'status':report['status'],'cases':len(report['cases']),'errors':report['errors'],'report':str(args.report)}))
 return 0 if report['status']=='passed' else 1

if __name__=='__main__':
 if len(sys.argv)>1 and sys.argv[1]=='--child':
  try:child(sys.argv[2],sys.argv[3])
  except Exception as e:print(json.dumps({'error':type(e).__name__,'message':str(e)[:300]}));sys.exit(1)
 else:sys.exit(main())
