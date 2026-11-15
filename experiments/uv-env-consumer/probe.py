import json,os,subprocess,sys,tempfile,importlib.metadata
from pathlib import Path
CASES={
 'plain':'SAMPLE=hello\n',
 'space':'SAMPLE=hello world\n',
 'quoted-space':'SAMPLE="hello world"\n',
 'dollar':'SAMPLE=cost$MISSING\n',
 'single-dollar':"SAMPLE='cost$MISSING'\n",
 'braced':'BASE=hello\nSAMPLE=${BASE}_world\n',
 'underscore':'A=short\nA_PLAIN=long\nSAMPLE=$A_PLAIN\n',
 'braced-underscore':'A=short\nA_PLAIN=long\nSAMPLE=${A_PLAIN}\n',
 'partial':'BEFORE=yes\nSAMPLE=hello world\nAFTER=yes\n',
}
assert subprocess.check_output(['uv','--version'],text=True).split()[1] == '0.13.6'
assert importlib.metadata.version('python-dotenv') == '1.2.2'
keys=['SAMPLE','BEFORE','AFTER']
output=[]
with tempfile.TemporaryDirectory(prefix='uv-env-consumer-') as td:
 p=Path(td); f=p/'case.env'; env={'PATH':os.environ['PATH'],'HOME':td,'UV_PYTHON_DOWNLOADS':'never'}
 consumer='import os,json; print(json.dumps({k:os.environ.get(k) for k in '+repr(keys)+'}))'
 for name,contents in CASES.items():
  f.write_text(contents)
  for impl in ['dotenv','uv']:
   cmd=([sys.executable,'-c','from dotenv import load_dotenv; load_dotenv('+repr(str(f))+'); '+consumer] if impl=='dotenv' else ['uv','run','--cache-dir',str(p/'cache'),'--offline','--no-project','--no-config','--env-file',str(f),sys.executable,'-c',consumer])
   r=subprocess.run(cmd,env=env,capture_output=True,text=True,timeout=15)
   output.append({'case':name,'implementation':impl,'exit':r.returncode,'values':json.loads(r.stdout) if r.stdout else None,'parse_warning':'Failed to parse environment file' in r.stderr})
expected_samples = {
 'dotenv':['hello','hello world','hello world','cost$MISSING','cost$MISSING','hello_world','$A_PLAIN','long','hello world'],
 'uv':['hello',None,'hello world','cost','cost$MISSING','hello_world','short_PLAIN','long',None],
}
for row in output:
 idx=list(CASES).index(row['case'])
 assert row['exit']==0, row
 assert row['values']['SAMPLE']==expected_samples[row['implementation']][idx], row
 assert row['parse_warning']==(row['implementation']=='uv' and row['case'] in ('space','partial')), row
 assert row['values']['BEFORE']==('yes' if row['case']=='partial' else None), row
 assert row['values']['AFTER']==('yes' if row['case']=='partial' and row['implementation']=='dotenv' else None), row
print(json.dumps({'uv':subprocess.check_output(['uv','--version'],text=True).strip(),'python_dotenv':importlib.metadata.version('python-dotenv'),'cases':output},indent=2))
