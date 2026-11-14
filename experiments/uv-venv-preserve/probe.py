import pathlib, subprocess, tempfile, json, sys

repo = pathlib.Path(__file__).resolve().parents[2]
root=pathlib.Path(tempfile.mkdtemp(prefix='uv-link-probe-'))
results=[]
uv=sys.argv[1] if len(sys.argv)>1 else 'uv'
for mode in ['default-existing','allow-existing','separate-new']:
 d=root/mode; (d/'v/bin').mkdir(parents=True); s=d/'sentinel.txt';s.write_text('PUBLIC_TEST_SENTINEL\n');(d/'v/bin/activate').symlink_to(s)
 target=d/('fresh' if mode=='separate-new' else 'v')
 cmd=[uv,'venv','--cache-dir',str(root/'cache'),'--python',sys.executable,'--no-python-downloads',str(target)]
 if mode=='allow-existing':cmd+=['--allow-existing']
 p=subprocess.run(cmd,capture_output=True,text=True)
 consumer=None
 if p.returncode==0:
  c=subprocess.run([str(target/'bin/python'),'-c','import sys; print(sys.prefix != sys.base_prefix)'],capture_output=True,text=True)
  check = subprocess.run([str(target/'bin/python'), 'scripts/check_repo.py'], cwd=repo, capture_output=True, text=True)
  consumer={'exit':c.returncode,'venv_prefix_differs':c.stdout.strip()=='True', 'repo_check_exit':check.returncode, 'repo_check_stdout':check.stdout}
 results.append({'mode':mode,'exit':p.returncode,'sentinel_unchanged':s.read_text()=='PUBLIC_TEST_SENTINEL\n','link_remains':(d/'v/bin/activate').is_symlink(),'consumer':consumer,'stderr':p.stderr.replace(str(root),'<scratch>').replace(sys.executable,'<python>')})
print(json.dumps({'version':subprocess.check_output([uv,'--version'],text=True).strip(),'cases':results},indent=2))

a,b,c = results
assert a['exit'] == 2 and a['sentinel_unchanged']
assert b['exit'] == 0 and not b['sentinel_unchanged'] and b['link_remains']
assert c['exit'] == 0 and c['sentinel_unchanged']
assert all(x['consumer']['venv_prefix_differs'] and x['consumer']['repo_check_exit'] == 0 for x in [b,c])
