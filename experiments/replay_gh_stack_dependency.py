import os, subprocess, pathlib, json, shutil, hashlib, argparse
p=argparse.ArgumentParser(description="Isolated synthetic dependent-worktree trial; never modifies the source repository")
p.add_argument("--binary", type=pathlib.Path, required=True)
p.add_argument("--output", type=pathlib.Path, required=True)
p.add_argument("--template", type=pathlib.Path, default=pathlib.Path("templates/long-task/task.example.json"))
a=p.parse_args()
stack=a.binary.resolve(); source=a.template.resolve()
if not stack.is_file() or not os.access(stack,os.X_OK): p.error("--binary must be an executable official gh-stack binary")
expected_digest="ffe9d48b6342faffc3b0cb420202ff1df32e24faf32693debd7423274bbdf859"
if hashlib.sha256(stack.read_bytes()).hexdigest() != expected_digest: p.error("expected the official v0.2.1 linux-amd64 release asset (SHA-256 mismatch)")
if not source.is_file(): p.error("public template is missing; pass --template")
if a.output.exists(): p.error("--output must be a NEW directory; refusing to overwrite")
seed=json.loads(source.read_text())
if seed.get("spec_revision") != "contract-v1": p.error("expected public template with spec_revision contract-v1")
root=a.output.resolve(); root.mkdir(parents=True)
(root/'tmp').mkdir()
home=root/'isolated-home'; home.mkdir(exist_ok=True)
env={'PATH':'/usr/local/bin:/usr/bin:/bin','HOME':str(home),'GH_CONFIG_DIR':str(home/'gh'),'XDG_CONFIG_HOME':str(home/'config'),'XDG_STATE_HOME':str(home/'state'),'GIT_CONFIG_NOSYSTEM':'1','GIT_CONFIG_GLOBAL':'/dev/null','GH_STACK_NO_UPDATE_NOTIFIER':'1','GH_NO_UPDATE_NOTIFIER':'1','TMPDIR':str(root/'tmp'),'GIT_EDITOR':'true','LC_ALL':'C.UTF-8'}
log=open(root/'transcript.txt','w')
def run(args,cwd,expect=0):
 p=subprocess.run([str(a) for a in args],cwd=cwd,env=env,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=30)
 line=f'\n$ ({pathlib.Path(cwd).name}) '+ ' '.join(map(str,args))+'\n'+p.stdout+f'EXIT={p.returncode}\n'; print(line,flush=True);log.write(line);log.flush()
 if expect is not None: assert p.returncode==expect,line
 return p
run([stack,'--version'],root)
repo=root/'demo';repo.mkdir(); run(['git','init','-b','main'],repo)
run(['git','config','user.name','Synthetic integration trial'],repo);run(['git','config','user.email','trial@users.noreply.github.com'],repo)
shutil.copyfile(source,repo/'task.example.json')
(repo/'README.md').write_text('Synthetic isolated copy of public a1dbv long-task delivery.\n')
run(['git','add','.'],repo);run(['git','commit','-m','baseline public task template'],repo)
run(['git','worktree','add','-b','contract',root/'contract'],repo)
contract=root/'contract'
data=json.loads((contract/'task.example.json').read_text());data['spec_revision']='contract-v2'
(contract/'task.example.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
run(['git','commit','-am','parent defines contract-v2'],contract)
run(['git','worktree','add','-b','consumer',root/'consumer','contract'],repo)
consumer=root/'consumer'
data['spec_revision']='contract-v2-client'
(consumer/'task.example.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
(consumer/'consumer-check.py').write_text("import json\nfrom pathlib import Path\ntask=json.loads(Path('task.example.json').read_text())\nassert task['spec_revision'] == 'contract-v2-client'\nprint('consumer contract accepted')\n")
run(['git','add','.'],consumer);run(['git','commit','-m','dependent accepts v2 client revision'],consumer)
run([stack,'init','--base','main','contract','consumer'],contract)
# Parent changes an existing shared contract while consumer is on its earlier parent history.
data=json.loads((contract/'task.example.json').read_text());data['spec_revision']='contract-v3'
(contract/'task.example.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
run(['git','commit','-am','parent revises shared contract to v3'],contract)
# Unrelated worker's uncommitted tracked + untracked edits must remain byte-for-byte unchanged.
(repo/'README.md').write_text('Other worker in progress: DO NOT STASH OR RESET.\n')
(repo/'worker-untracked.txt').write_text('unsaved integration notes\n')
before={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [repo/'README.md',repo/'worker-untracked.txt']}
(root/'preservation-before.json').write_text(json.dumps(before,indent=2))
run([stack,'view'],consumer)
run([stack,'rebase','--no-trunk'],contract,expect=3)
state=repo/'.git'/'gh-stack-rebase-state';assert state.exists();shutil.copyfile(state,root/'conflict-state.json')
run(['git','status','--short'],consumer)
# Fresh process, different worktree: deliberate premature continue proves unresolved conflicts do not disappear.
run([stack,'rebase','--continue'],repo,expect=3)
assert state.exists()
# Resolve in the recorded owning worktree, preserving the parent's change and consumer's suffix.
data=json.loads((contract/'task.example.json').read_text());data['spec_revision']='contract-v3-client'
(consumer/'task.example.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
(consumer/'consumer-check.py').write_text((consumer/'consumer-check.py').read_text().replace('contract-v2-client','contract-v3-client'))
run(['git','add','task.example.json','consumer-check.py'],consumer)
run([stack,'rebase','--continue'],repo)
run(['python3','consumer-check.py'],consumer)
run(['git','merge-base','--is-ancestor','contract','consumer'],repo)
run(['git','log','--all','--graph','--oneline','--decorate'],repo)
run(['git','status','--short'],repo);run(['git','status','--short'],consumer)
after={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in [repo/'README.md',repo/'worker-untracked.txt']}
assert before==after;assert not state.exists()
result={'source_template_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'binary_sha256':hashlib.sha256(stack.read_bytes()).hexdigest(),'version':'0.2.1','source_commit':'29a36d314be664583705f18e41cebdf2b61ad514','other_worker_hashes_before':before,'other_worker_hashes_after':after,'parent_is_ancestor':True,'consumer_check':'passed','conflict_exit':3,'premature_continue_exit':3,'recovery_state_cleared':True}
(root/'result.json').write_text(json.dumps(result,indent=2)+'\n');print('ALL ASSERTIONS PASSED')
