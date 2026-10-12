import json,subprocess,sys,os,time
RUNC=os.path.join(os.path.dirname(os.path.abspath(__file__)),'runc')
def run(cwd,args,prompt,log):
    t=time.time()
    p=subprocess.run([RUNC]+args+[prompt],cwd=cwd,stdin=subprocess.DEVNULL,capture_output=True,text=True,timeout=900)
    try: d=json.loads(p.stdout)
    except Exception: print("ERR",p.stdout[-500:],p.stderr[-500:]); return None
    u=d.get('usage',{})
    rec=dict(cwd=os.path.basename(cwd),args=' '.join(args),prompt=prompt[:60],
             total_in=u.get('input_tokens',0)+u.get('cache_creation_input_tokens',0)+u.get('cache_read_input_tokens',0),
             input=u.get('input_tokens'),cw=u.get('cache_creation_input_tokens'),cr=u.get('cache_read_input_tokens'),
             out=u.get('output_tokens'),cost=d.get('total_cost_usd'),turns=d.get('num_turns'),secs=round(time.time()-t,1),
             result=(d.get('result') or '')[:300],subagents=d.get('subagent_stats',{}).get('spawned'))
    with open(log,'a') as f: f.write(json.dumps(rec,ensure_ascii=False)+'\n')
    return rec
if __name__=='__main__':
    cwd,log,prompt=sys.argv[1],sys.argv[2],sys.argv[3]; args=sys.argv[4:]
    r=run(cwd,args,prompt,log); print(json.dumps(r,ensure_ascii=False))
