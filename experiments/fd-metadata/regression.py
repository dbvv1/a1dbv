#!/usr/bin/env python3
import argparse, json, os, pathlib, subprocess, sys, tempfile
if not __debug__:
    sys.exit("ERROR: optimized Python (-O) disables assertions; run without -O")
parser = argparse.ArgumentParser(description='Compare old CLI behavior on baseline and patched fd')
parser.add_argument('baseline')
parser.add_argument('patched')
args = parser.parse_args()
baseline, patched = map(lambda p: str(pathlib.Path(p).resolve()), [args.baseline, args.patched])
for binary in [baseline, patched]:
    if not pathlib.Path(binary).is_file() or not os.access(binary, os.X_OK):
        parser.error('both binaries must be existing executable files')
try:
    (pathlib.Path(__file__).parent / 'tmp').mkdir(exist_ok=True)
except OSError as exc:
    parser.error(f'cannot prepare fixture directory: {exc}')
root = pathlib.Path(tempfile.mkdtemp(prefix='regress-', dir=pathlib.Path(__file__).parent/'tmp'))
(root/'a.txt').write_text('a')
(root/'b.txt').write_text('bb')
# A metadata-looking executable name must remain literal in exec grammar.
(root/'{%y}').symlink_to(sys.executable)
code = 'import json,sys; print(json.dumps(sys.argv[1:]))'
cases=[]
for flag in ['--exec', '--exec-batch']:
    for args in [[r'{%y}\t{%s}\n'], ['{%y}', '{}', '{%s}'], ['{{%y}}', '{/}', r'\t']]:
        cases.append(['-e','txt',flag,sys.executable,'-c',code,*args])
    cases.append(['-e','txt',flag,str(root/'{%y}'),'-c',code,'{%s}'])
for template in ['{}', '{/} {.} {//} {/.}', r'\t{}\n', '{{}} {{%y}} {{%s}}', '{%y}} {%s}}', '{unknown} {}']:
    cases.append(['-e','txt','--print0','--format',template])
for args in cases:
    results=[]
    for exe in [baseline,patched]:
        p=subprocess.run([exe,'--color=never','--no-ignore','--threads=1',*args],cwd=root,capture_output=True, timeout=15)
        results.append((p.returncode,p.stdout,p.stderr))
    assert results[0] == results[1], (args,results)
    assert results[0][0] == 0, (args,results)
    assert results[0][1], ('expected fixture output; check binary arguments', args)
print(json.dumps({'old_cli_cases_identical':len(cases),'exec_and_batch':True,'literal_backslashes':True,'metadata_named_executable':True}))
