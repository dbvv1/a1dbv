"""Fetch fixed official sources, replay synthetic disk databases, preserve artifacts.

Requires git plus a Python environment with sqlite-utils 4.2.1 dependencies,
pytest and hypothesis if --tests is used. Does not install dependencies.
"""
import argparse, json, os, pathlib, subprocess, sys, tempfile
import xml.etree.ElementTree as ET
VERSIONS={
 'old':'d71420065903ff54247b5062b8c6af6165b7e638',
 'fixed':'f66ddcb215e76dcbc1fa1dff4359f2ac3dc702e5',
 'current':'28dc6278cc03a9245325d056e6986818544abc68',
}
def validate_pytest_report(path, expected):
 tree=ET.parse(path)
 cases=tree.findall('.//testcase')
 if len(cases)!=expected or not cases:
  raise RuntimeError('Unexpected test count: {} instead of {}'.format(len(cases),expected))
 for tag in ('skipped','failure','error'):
  if tree.findall('.//'+tag):
   raise RuntimeError('Test report contains '+tag)
 # Check counters too, including collection errors without a testcase.
 for suite in tree.iter('testsuite'):
  for key in ('skipped','failures','errors'):
   if int(suite.get(key,'0')):
    raise RuntimeError('Nonzero test report counter: '+key)
 return {'passed':len(cases),'skipped':0,'failures':0,'errors':0}

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--python',default=sys.executable)
 p.add_argument('--tests',action='store_true')
 p.add_argument('--output',type=pathlib.Path,help='A new directory; existing paths refused')
 a=p.parse_args(); python=os.path.abspath(a.python)
 if a.output:
  root=a.output.resolve();root.mkdir(parents=True,exist_ok=False)
 else:root=pathlib.Path(tempfile.mkdtemp(prefix='sqlite-migration-'))
 print('Artifacts:',root,flush=True)
 probe=pathlib.Path(__file__).with_name('sqlite_migration_probe.py')
 if not probe.is_file():
  raise FileNotFoundError('Missing probe: {}'.format(probe))
 source=root/'source'
 subprocess.run(['git','clone','https://github.com/simonw/sqlite-utils.git',str(source)],check=True)
 statuses={}
 for name,sha in VERSIONS.items():
  checkout=root/name
  subprocess.run(['git','-C',str(source),'worktree','add','--detach',str(checkout),sha],check=True)
  actual=subprocess.check_output(['git','-C',str(checkout),'rev-parse','HEAD'],text=True).strip()
  if actual!=sha:
   raise RuntimeError('Source SHA mismatch: {} != {}'.format(actual,sha))
  env=dict(os.environ,PYTHONPATH=str(checkout))
  with (root/(name+'.log')).open('w') as log:
   subprocess.run([python,str(probe),str(root/('artifacts-'+name)), 'guard' if name=='fixed' else name],env=env,cwd=root,stdout=log,stderr=subprocess.STDOUT,check=True)
  statuses[name]={'sha':sha,'probe':'passed'}
  if a.tests and name in ('fixed','current'):
   args=['tests/test_transform.py','-k','in_transaction'] if name=='fixed' else ['tests/test_atomic.py','tests/test_transform.py']
   junit=root/('pytest-'+name+'.xml')
   with (root/('pytest-'+name+'.log')).open('w') as log:
    subprocess.run([python,'-m','pytest','-q','--junitxml='+str(junit),*args],cwd=checkout,env=env,stdout=log,stderr=subprocess.STDOUT,check=True)
   statuses[name]['tests']=validate_pytest_report(junit,8 if name=='fixed' else 141)
 (root/'manifest.json').write_text(json.dumps(statuses,indent=2))
 print(json.dumps(statuses,indent=2))
if __name__=='__main__':main()
