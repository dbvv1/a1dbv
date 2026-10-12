import json,subprocess,sys,os,time,shutil,uuid
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENVDROP='CLAUDE_CODE_SESSION_ID CLAUDE_CODE_REMOTE_SESSION_ID CLAUDE_CODE_MESSAGING_SOCKET CLAUDE_CODE_MESSAGING_TOKEN CLAUDE_CODE_TEE_SDK_STDOUT CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2 CLAUDE_CODE_SYNC_SESSION_REFS CLAUDE_CODE_SYNC_SKILLS CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD CLAUDE_ADDITIONAL_DIRECTORIES CLAUDE_CODE_CHILD_SESSION'.split()
def run(cond,i,model,tools,prompt,log,extra=()):
    d=os.path.join(S,'e3','runs',f'{cond}-{model.split("-")[1]}-{i}')
    shutil.rmtree(d,ignore_errors=True); shutil.copytree(os.path.join(S,'base'),d)
    md={'A':None,'B':'short.md','C':'long.md'}.get(cond[0])
    if md:
        shutil.copy(os.path.join(S,'e3',md),os.path.join(d,'CLAUDE.md'))
        subprocess.run('git add -A && git commit -qm md',shell=True,cwd=d)
    env={k:v for k,v in os.environ.items() if k not in ENVDROP}
    cmd=['claude','-p','--no-session-persistence','--session-id',str(uuid.uuid4()),'--output-format','stream-json','--verbose',
         '--model',model,f'--tools={tools}',f'--allowedTools={tools}',*extra,prompt]
    t=time.time()
    p=subprocess.run(cmd,cwd=d,env=env,stdin=subprocess.DEVNULL,capture_output=True,text=True,timeout=1500)
    secs=round(time.time()-t,1)
    bash=[];tools_used={};final=None;sub=0
    for line in p.stdout.splitlines():
        try: e=json.loads(line)
        except: continue
        if e.get('type')=='assistant':
            for c in e['message'].get('content',[]):
                if c.get('type')=='tool_use':
                    tools_used[c['name']]=tools_used.get(c['name'],0)+1
                    if c['name']=='Bash' and not e.get('parent_tool_use_id'): bash.append(c['input'].get('command','')[:160])
        if e.get('type')=='result': final=e
    open(os.path.join(d,'..',os.path.basename(d)+'.stream.jsonl'),'w').write(p.stdout)
    t2=subprocess.run('PYTHONPATH=src python3 -m unittest -q 2>&1 | tail -1',shell=True,cwd=d,capture_output=True,text=True).stdout.strip()
    fixed=subprocess.run("grep -c '^    pos += hex_len$' src/tomli/_parser.py",shell=True,cwd=d,capture_output=True,text=True).stdout.strip()
    ds=subprocess.run('git diff --numstat',shell=True,cwd=d,capture_output=True,text=True).stdout
    untracked=subprocess.run('git ls-files --others --exclude-standard',shell=True,cwd=d,capture_output=True,text=True).stdout.split()
    u=(final or {}).get('usage',{})
    rec=dict(cond=cond,i=i,model=model,tests_after=t2,fixed_line=fixed,diff=ds.strip().replace('\t',' ').split('\n'),untracked=untracked,
      ran_full_suite=any('unittest' in b and '-k' not in b and 'tests.test_' not in b for b in bash),bash=bash,tools=tools_used,
      total_in=u.get('input_tokens',0)+u.get('cache_creation_input_tokens',0)+u.get('cache_read_input_tokens',0),
      out=u.get('output_tokens'),cost=(final or {}).get('total_cost_usd'),turns=(final or {}).get('num_turns'),secs=secs,
      is_error=(final or {}).get('is_error'),result=((final or {}).get('result') or '')[:400])
    with open(log,'a') as f: f.write(json.dumps(rec,ensure_ascii=False)+'\n')
    return rec
if __name__=='__main__':
    cond,i,model,tools,log=sys.argv[1:6]
    prompt=open(os.path.join(S,'e3','prompt.txt')).read().strip() if len(sys.argv)<7 else open(sys.argv[6]).read().strip()
    r=run(cond,i,model,tools,prompt,log); print(json.dumps({k:r[k] for k in ('cond','i','tests_after','fixed_line','cost','turns','secs','ran_full_suite','diff')},ensure_ascii=False))
