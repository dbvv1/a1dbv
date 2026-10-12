import json,subprocess,os,sys
S=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def sh(c,d): return subprocess.run(c,shell=True,cwd=d,capture_output=True,text=True).stdout.strip()
for l in open(os.path.join(S,'e3',sys.argv[1] if len(sys.argv)>1 else 'log.jsonl')):
    r=json.loads(l); d=os.path.join(S,'e3','runs',f"{r['cond']}-{r['model'].split('-')[1]}-{r['i']}")
    untracked=sh('git ls-files --others --exclude-standard',d).split()
    testchg=sh('git diff --numstat -- tests',d)
    # regression test catches bug? revert src to base, run tests
    sh('git stash push -q -- src',d)
    t=sh('PYTHONPATH=src python3 -m unittest -q 2>&1 | tail -1',d)
    sh('git stash pop -q',d)
    pip=any('pip install' in b for b in r['bash'])
    runner='pytest' if any('pytest' in b for b in r['bash']) else 'unittest'
    print(r['cond'],r['model'].split('-')[1],r['i'],'cost=%.4f'%r['cost'],'in=%d'%r['total_in'],'turns=%s'%r['turns'],'secs=%s'%r['secs'],
          'regtest=%s'%('Y' if (untracked or testchg) else 'N'),'catches_bug_on_base:',t,'runner=',runner,'pip=',pip,'untracked=',len(untracked),'scope=',r['diff'])
