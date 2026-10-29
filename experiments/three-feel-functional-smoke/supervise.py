"""Owned subprocess receipts, reusing quality-batch Popen/wait identity model.
No process-name kill, retries, browser changes or lease deletion.
"""
import datetime,json,os,pathlib,subprocess,sys

def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def run_owned(args,cwd,log,timeout=600,grace=30,popen=subprocess.Popen,persist=lambda row:None):
    row={'wrapperPid':os.getpid(),'wrapperParentPid':os.getppid(),'started':now(),'child':None,'state':'spawn-requested','exitCode':None,'signal':None}
    persist(row)
    p=None
    try:
        with open(log,'wb') as stream:
            p=popen(args,cwd=cwd,stdin=subprocess.PIPE,stdout=stream,stderr=subprocess.STDOUT,text=True)
            row['child']={'pid':p.pid,'parentPid':os.getpid(),'identity':'owned-Popen-handle'};row['state']='active';persist(row)
            try:code=p.wait(timeout=timeout)
            except subprocess.TimeoutExpired:
                row['state']='cancelling-owned-runner';row['timeoutAt']=now();persist(row)
                # The runner closes only its retained BrowserServer/HTTP handles.
                try:p.stdin.write('{"action":"cancel"}\n');p.stdin.flush()
                except (BrokenPipeError,OSError):pass
                try:code=p.wait(timeout=grace)
                except subprocess.TimeoutExpired:
                    row['state']='exit-unknown';row['knownUnclosedResources']='unknown';persist(row);return row
            row.update(state='exited',exitCode=code if code>=0 else None,signal=-code if code<0 else None,ended=now())
            persist(row);p.stdin.close()
    except BaseException as error:
        if row['state'] not in ['exited','exit-unknown']:row['state']='exit-unknown' if p is not None else 'spawn-unconfirmed'
        row['errorType']=type(error).__name__;persist(row)
        raise
    finally:
        persist(row)

    return row

def accepted(row,inner):
    return row['state']=='exited' and row['exitCode']==0 and row.get('signal') is None and 'timeoutAt' not in row and inner.get('status')=='passed-functional-scope-only' and all(j.get('cleanup',{}).get('proven') is True for j in inner.get('jobs',[])) and bool(inner.get('jobs'))

if __name__=='__main__':
    path=pathlib.Path(sys.argv[1]).resolve();cfg=json.loads(path.read_text())
    if cfg.get('approved') is not True or cfg.get('blockers')!=[]:raise SystemExit('BLOCKED: exact sources, serial receipt and parent approval required')
    # This is not a lock/queue ownership oracle. Receiver must hold existing serial
    # slot after verifying original task exits; no lease is created by this tool.
    if not cfg.get('existingSerialSlotReceipt'):raise SystemExit('BLOCKED: existing serial slot ownership receipt missing')
    out=pathlib.Path(cfg['supervisorOutput']);out.mkdir(parents=True,exist_ok=False)
    def persist(row):
        tmp=out/'supervisor.tmp';tmp.write_text(json.dumps(row,indent=2)+'\n');tmp.replace(out/'supervisor.json')
    row=run_owned([cfg['node'],'--import',cfg['tsxLoader'],str(pathlib.Path(__file__).with_name('runner.mjs')),str(path)],str(path.parent),out/'private-runner.log',persist=persist)
    try:inner=json.loads((pathlib.Path(cfg['output'])/'manifest.json').read_text())
    except (OSError,ValueError):inner={}
    row['passed']=accepted(row,inner);row['receiverMustObserveWrapperExit']=True
    persist(row)
    raise SystemExit(0 if row['passed'] else 1)
