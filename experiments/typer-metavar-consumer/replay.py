import json, os, subprocess, sys, tempfile
from pathlib import Path
import argparse

REVISIONS = {
  'old': 'b210c0e2376d99344f79f11fab3ad34cf890cc20',
  'release': '60af34b60ab2650a74af32c6ce340c5cfbceb3d8',
  'base': 'a80f6e5ecd74f32b983cca336a2f3cba98d9853a',
  'pr': '09bf9a55a86e88bc3a79b2e63682a599eed4ffc5',
  'current': 'f2183bffb2bae9a79b56e69561cbae32969451a3',
}
parser = argparse.ArgumentParser(description='Replay Typer option parsing, not a product workflow.')
parser.add_argument('--python', required=True, type=Path)
for arm in REVISIONS:
  parser.add_argument('--' + arm, required=True, type=Path)
args = parser.parse_args()
PYTHON = args.python.absolute()
ARMS = {arm: getattr(args, arm).resolve() for arm in REVISIONS}
for arm, source in ARMS.items():
  sha = subprocess.run(['git', '-C', str(source), 'rev-parse', 'HEAD'],
    capture_output=True, text=True, check=True, timeout=15).stdout.strip()
  assert sha == REVISIONS[arm], (arm, sha)
  clean = subprocess.run(['git', '-C', str(source), 'diff', 'HEAD', '--', 'typer'],
    capture_output=True, check=True, timeout=15)
  assert not clean.stdout, (arm, 'modified Typer source')
results=[]
with tempfile.TemporaryDirectory() as tmp:
  tmp=Path(tmp)
  for arm, folder in ARMS.items():
    source=folder
    env={k:v for k,v in os.environ.items() if k in ('PATH','LANG','LC_ALL')}
    env.update(PYTHONPATH=str(source),PYTHONIOENCODING='utf-8',NO_COLOR='1',TERM='dumb',COLUMNS='180')
    identity=subprocess.run([str(PYTHON),'-c','import typer,json; print(json.dumps([typer.__file__,typer.__version__]))'],env=env,cwd=tmp,capture_output=True,text=True,check=True,timeout=15)
    module,version=json.loads(identity.stdout); assert Path(module).resolve()==source/'typer/__init__.py'
    for variant,decl in {'original':'metavar="FUZZY_MUFFINS"','explicit':'"--fuzzy-muffins", metavar="FUZZY_MUFFINS"','unrelated':'metavar="VALUE"'}.items():
      app=tmp/'app.py'
      app.write_text('from typing import Annotated\nimport typer\ndef main(fuzzy_muffins: Annotated[str, typer.Option('+decl+')]="Very fuzzy"):\n    print(f"Hello {fuzzy_muffins}")\nif __name__ == "__main__": typer.run(main)\n')
      expected_flag='--FUZZY-MUFFINS' if variant=='original' and arm in ('release','base','current') else '--fuzzy-muffins'
      cases=[]
      for args in ([],['--fuzzy-muffins','reader'],['--FUZZY-MUFFINS','reader'],['--help']):
        p=subprocess.run([str(PYTHON),str(app),*args],env=env,cwd=tmp,capture_output=True,text=True,timeout=15)
        if args==['--help']:
          assert p.returncode==0 and expected_flag in p.stdout,(arm,variant,p.stdout,p.stderr)
        elif not args:
          assert p.returncode==0 and p.stdout=='Hello Very fuzzy\n'
        elif args[0]==expected_flag:
          assert p.returncode==0 and p.stdout=='Hello reader\n'
        else:
          assert p.returncode==2 and 'No such option' in p.stderr,(arm,variant,p.stdout,p.stderr)
        cases.append({'args':args,'exit':p.returncode,'output':p.stdout if args!=['--help'] else None,'help_has_expected_flag':expected_flag in p.stdout if args==['--help'] else None,'unknown_option':'No such option' in p.stderr})
      results.append({'arm':arm,'version':version,'variant':variant,'expected_flag':expected_flag,'cases':cases})
metadata = subprocess.run([str(PYTHON), '-c',
  'import sys,importlib.metadata as m,json; print(json.dumps({"python":sys.version.split()[0],"rich":m.version("rich"),"shellingham":m.version("shellingham"),"annotated-doc":m.version("annotated-doc")}))'],
  capture_output=True, text=True, check=True, timeout=15)
print(json.dumps({'environment': json.loads(metadata.stdout),
  'source_revisions': REVISIONS, 'cases': results}, indent=2))
