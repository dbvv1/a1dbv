#!/usr/bin/env python3
"""Compare fixed generic Skills with the official reference implementation.

This script does not download, install, configure a client, or execute Skill
instructions. Supply independently verified source and unpacked wheels.
"""
from pathlib import Path
import argparse,difflib,hashlib,json,os,re,subprocess,sys,time,xml.etree.ElementTree as ET
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--reference-root',type=Path,required=True,help='Verified skills-ref directory from the fixed official commit')
parser.add_argument('--dependencies',type=Path,required=True,help='Four hash-verified wheels unpacked into a new directory')
parser.add_argument('--skills-root',type=Path,required=True,help='Fixed generic/.claude/skills directory, read only')
parser.add_argument('--output',type=Path,required=True,help='New directory, never overwritten')
args=parser.parse_args()
LOCK=json.loads(Path(__file__).with_name('runtime-lock.json').read_text())
REF=args.reference_root.resolve(strict=True);DEPS=args.dependencies.resolve(strict=True);SKILLS=args.skills_root.resolve(strict=True)
h=lambda b:hashlib.sha256(b).hexdigest()
for rel,info in LOCK['reference_files'].items():
 if h((REF/rel).read_bytes())!=info['sha256']:raise SystemExit('Reference source hash differs: '+rel)
expected_deps={rel:digest for p in LOCK['dependency_packages'] for rel,digest in p['files'].items()}
for rel,digest in expected_deps.items():
 if h((DEPS/rel).read_bytes())!=digest:raise SystemExit('Dependency file hash differs: '+rel)
if any(str(p.relative_to(DEPS)) not in expected_deps for p in DEPS.rglob('*.py')):raise SystemExit('Unexpected Python module in dependencies')
source_data={name:(SKILLS/name/'SKILL.md').read_bytes() for name in LOCK['skills']}
for name,data in source_data.items():
 if h(data)!=LOCK['skills'][name]['original_sha256']:raise SystemExit('Skill differs from the fixed input: '+name)
NAMES=list(LOCK['skills']);TARGET=LOCK['target_commit']
O=args.output.absolute();O.mkdir(exist_ok=False)
for name in ['home','config','cache','tmp','evidence','original','projected','negative']:(O/name).mkdir()
E=O/'evidence';stamp=lambda:time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime())
def files(root):return {str(p.relative_to(root)):h(p.read_bytes()) for p in sorted(root.rglob('*')) if p.is_file()}
source_before=files(REF);deps_before=files(DEPS)
input_metadata={}
for name in NAMES:
 path=f'templates/generic/.claude/skills/{name}/SKILL.md'
 b=source_data[name]
 blob=LOCK['skills'][name]['git_blob']
 s=b.decode();parts=s.split('---',2);assert len(parts)==3 and not parts[0]
 lines=parts[1].splitlines(keepends=True);removed=[x for x in lines if x.startswith(('disable-model-invocation:','argument-hint:'))]
 assert any(x.strip()=='disable-model-invocation: true' for x in removed)
 projected='---'+''.join(x for x in lines if x not in removed)+'---'+parts[2]
 for label,text in [('original',s),('projected',projected)]:
  p=O/label/name;p.mkdir();(p/'SKILL.md').write_text(text)
 assert (O/'original'/name/'SKILL.md').read_bytes()==b
 (E/f'{name}.projection.diff').write_text(''.join(difflib.unified_diff(s.splitlines(keepends=True),projected.splitlines(keepends=True),fromfile=f'original/{name}/SKILL.md',tofile=f'projected/{name}/SKILL.md')))
 input_metadata[name]={'path':path,'git_blob':blob,'original_sha256':h(b),'projected_sha256':h(projected.encode()),'body_sha256':h(parts[2].encode()),'removed_fields':[x.strip() for x in removed],'body_equal':projected.split('---',2)[2]==parts[2],'body_argument_tokens':parts[2].count('$ARGUMENTS')}
inputs_before={k:files(O/k) for k in ['original','projected']}
ENV={'PATH':'/usr/bin:/bin','HOME':str(O/'home'),'XDG_CONFIG_HOME':str(O/'config'),'XDG_CACHE_HOME':str(O/'cache'),'TMPDIR':str(O/'tmp'),'PYTHONPATH':str(REF/'src')+os.pathsep+str(DEPS),'PYTHONDONTWRITEBYTECODE':'1','PYTHONNOUSERSITE':'1','LANG':'C.UTF-8','LC_ALL':'C.UTF-8'}
records=[]
def call(label,command,*targets):
 args=[sys.executable,'-S','-m','skills_ref.cli',command,*[str(p) for p in targets]]
 start=stamp();p=subprocess.run(args,cwd=O,env=ENV,capture_output=True,text=True,timeout=20)
 (E/f'{label}.stdout').write_text(p.stdout);(E/f'{label}.stderr').write_text(p.stderr)
 record={'id':label,'command':command,'started_utc':start,'completed_utc':stamp(),'exit_code':p.returncode,'stdout_sha256':h(p.stdout.encode()),'stderr_sha256':h(p.stderr.encode()),'targets':[str(t.relative_to(O)) for t in targets]}
 (E/f'{label}.json').write_text(json.dumps({**record,'argv':args},indent=2)+'\n');records.append(record)
 return p
summary={'started_utc':stamp(),'script_sha256':h(Path(__file__).read_bytes()),'runtime_lock_sha256':h(Path(__file__).with_name('runtime-lock.json').read_bytes()),'target_repo':'dbvv1/a1dbv','target_commit':TARGET,'reference_repo':'agentskills/agentskills','reference_commit':'69ef37e9424c0a7ea9dd2293b559e43ec8176379','reference_version':'0.1.0','inputs':input_metadata,'original':{},'projected':{},'negative':{},'external_model_or_native_client':False,'source_instructions_executed':False}
for label in ['original','projected']:
 for name in NAMES:
  p=O/label/name;v=call(f'{label}-{name}-validate','validate',p);props=call(f'{label}-{name}-properties','read-properties',p)
  summary[label][name]={'validate_exit':v.returncode,'validation_error':v.stderr.splitlines()[1:],'properties_exit':props.returncode,'properties':json.loads(props.stdout) if props.returncode==0 else None}
 prompt=call(f'{label}-to-prompt','to-prompt',*[O/label/name for name in NAMES])
 summary[label+'_discovery']={'exit_code':prompt.returncode,'skills':[{'name':s.findtext('name').strip(),'description':s.findtext('description').strip(),'location':str(Path(s.findtext('location').strip()).relative_to(O))} for s in ET.fromstring(prompt.stdout).findall('skill')],'unicode_chars':len(prompt.stdout)}
# Independent malformed/required-input cases derived from the normalized handoff.
base=(O/'projected/handoff/SKILL.md').read_text()
for case in ['missing-name','missing-description','name-directory-mismatch','malformed-yaml','missing-skill-file','missing-path']:
 p=O/'negative'/case/'handoff'
 if case!='missing-path':p.mkdir(parents=True)
 if case not in ['missing-skill-file','missing-path']:
  s=base
  if case=='missing-name':s=re.sub(r'^name:.*\n','',s,count=1,flags=re.M)
  elif case=='missing-description':s=re.sub(r'^description:.*\n','',s,count=1,flags=re.M)
  elif case=='name-directory-mismatch':s=s.replace('name: handoff\n','name: different-name\n',1)
  elif case=='malformed-yaml':s=s.replace('name: handoff\n','name: "unterminated\n',1)
  (p/'SKILL.md').write_text(s)
 r=call('negative-'+case,'validate',p);summary['negative'][case]={'exit_code':r.returncode,'error_lines':r.stderr.replace(str(O),'$RUN').splitlines()}
summary['integrity']={'original_source_files_unchanged':all((SKILLS/n/'SKILL.md').read_bytes()==b for n,b in source_data.items()),'original_unchanged':files(O/'original')==inputs_before['original'],'projected_unchanged':files(O/'projected')==inputs_before['projected'],'reference_source_unchanged':files(REF)==source_before,'dependency_files_unchanged':files(DEPS)==deps_before}
summary['commands']=records
summary['runtime']={'python':sys.version.split()[0],'process_environment_keys':sorted(ENV),'site_initialization_disabled':True,'package_build_or_install_scripts':False,'os_network_sandbox_claimed':False}
assert all(x['validate_exit']==1 and x['properties_exit']==0 and len(x['validation_error'])==1 and 'Unexpected fields in frontmatter:' in x['validation_error'][0] for x in summary['original'].values())
assert all(x['validate_exit']==0 and x['properties_exit']==0 for x in summary['projected'].values())
assert all(summary['original'][n]['properties']==summary['projected'][n]['properties'] for n in NAMES)
for label in ['original','projected']:
 assert summary[label+'_discovery']['exit_code']==0
 assert [s['name'] for s in summary[label+'_discovery']['skills']]==NAMES
assert all(summary['negative'][c]['exit_code']==(2 if c=='missing-path' else 1) for c in summary['negative'])
assert all(summary['integrity'].values())
summary['completed_utc']=stamp();summary['status']='pass'
(E/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'pass','commands':len(records),'original_validation_failures':5,'projected_validation_successes':5,'discovery_includes_manual_only_originals':5,'negative_cases':len(summary['negative']),'integrity':summary['integrity']},ensure_ascii=False))
