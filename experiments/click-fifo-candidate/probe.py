import os, pathlib, subprocess, sys, tempfile, json
source=pathlib.Path(sys.argv[1]).resolve()
if not (source/'src/click/__init__.py').is_file():
 raise SystemExit('expected Click source checkout')
results=[]
for lazy in (True,False):
 with tempfile.TemporaryDirectory() as t:
  fifo=pathlib.Path(t)/'input.fifo'; os.mkfifo(fifo)
  env={'PATH':os.environ['PATH'],'PYTHONPATH':str(source/'src'),'LANG':'C.UTF-8','SOURCE_ROOT':str(source)}
  code='''import click,sys,time,os,pathlib
assert pathlib.Path(click.__file__).resolve() == pathlib.Path(os.environ['SOURCE_ROOT'])/'src/click/__init__.py'
@click.command()
@click.argument('path',type=click.File('rb',lazy=LAZY))
def main(path):
    print('PARSED',flush=True)
    time.sleep(1)
    print(path.read().decode(),flush=True)
main()
'''.replace('LAZY',repr(lazy))
  writer=subprocess.Popen([sys.executable,'-c',"import sys,time\nf=open(sys.argv[1],'wb',buffering=0)\ntime.sleep(0.25)\nf.write(b'fifo-payload')\nf.close()",str(fifo)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env)
  reader=subprocess.Popen([sys.executable,'-c',code,str(fifo)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,env=env)
  timeout=False
  try: out,err=reader.communicate(timeout=4)
  except subprocess.TimeoutExpired:
   timeout=True; reader.kill(); out,err=reader.communicate()
  try:wo,we=writer.communicate(timeout=1)
  except subprocess.TimeoutExpired:writer.kill();wo,we=writer.communicate()
  results.append({'lazy':lazy,'reader_timeout':timeout,'reader_exit':reader.returncode,'reader_stdout':out.decode(),'writer_exit':writer.returncode,'writer_broken_pipe':'BrokenPipeError' in we.decode()})
print(json.dumps(results,indent=2))
