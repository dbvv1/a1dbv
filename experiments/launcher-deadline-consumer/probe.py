import os, pathlib, subprocess, sys, tempfile, time, json, signal, hashlib, argparse
parser = argparse.ArgumentParser(description="Offline fixed-launcher descendant acceptance; uses only synthetic executables")
parser.add_argument('source', type=pathlib.Path)
args = parser.parse_args()
source = args.source.resolve()
assert hashlib.sha256(source.read_bytes()).hexdigest() == '02eb67d7c11d27c59d83e62730ab854c80028f06b83f39d66f3157b6fe7171bc', 'unexpected launcher bytes'
with tempfile.TemporaryDirectory(prefix='deadline-consumer-') as temp:
 p=pathlib.Path(temp); b=p/'bin'; b.mkdir(); (p/'COMPANY.md').write_text('synthetic launcher deadline acceptance\n')
 stub=b/'claude'
 stub.write_text('#!/usr/bin/env python3\nimport subprocess,sys,time,os,pathlib\np=pathlib.Path(os.environ["PROBE_DIR"])\n(p/"leader.pid").write_text(str(os.getpid())+" "+pathlib.Path("/proc/self/stat").read_text().split(") ",1)[1].split()[19])\nsubprocess.Popen([sys.executable,str(p/"child.py")])\ntime.sleep(8)\n')
 stub.chmod(0o755)
 (p/'child.py').write_text('import subprocess,sys,time,os,pathlib\np=pathlib.Path(os.environ["PROBE_DIR"])\n(p/"child.pid").write_text(str(os.getpid())+" "+pathlib.Path("/proc/self/stat").read_text().split(") ",1)[1].split()[19])\nsubprocess.Popen([sys.executable,str(p/"grandchild.py")])\ntime.sleep(8)\n')
 (p/'grandchild.py').write_text('import time,os,pathlib\np=pathlib.Path(os.environ["PROBE_DIR"])\n(p/"grandchild.pid").write_text(str(os.getpid())+" "+pathlib.Path("/proc/self/stat").read_text().split(") ",1)[1].split()[19])\nend=time.monotonic()+8\nwhile time.monotonic()<end:\n (p/"ticks").write_text(str(time.monotonic()))\n time.sleep(.05)\n')
 env={**os.environ,'PATH':str(b)+os.pathsep+os.environ['PATH'],'PROBE_DIR':str(p),'TIMEOUT':'1','BUSY_MIN':'0','CLAUDE_FLAGS':'--synthetic-only','RUNNER':'claude'}
 result=None
 try:
  started=time.monotonic(); r=subprocess.run(['bash',str(source),str(p)],env=env,capture_output=True,text=True,timeout=5)
  elapsed=time.monotonic()-started
  first=(p/'ticks').read_text(); time.sleep(.25); second=(p/'ticks').read_text()
  result={'launcher_exit':r.returncode,'launcher_seconds':round(elapsed,3),'grandchild_kept_writing_after_exit':first!=second,'lock_removed':not (p/'.runtime/run.lock').exists(),'all_three_started':all((p/f'{n}.pid').exists() for n in ['leader','child','grandchild'])}
  assert elapsed < 4, 'host pause may confound self-exit'; assert result['all_three_started']; assert r.returncode==143; assert first!=second; assert result['lock_removed']
  print(json.dumps(result,indent=2))
 finally:
  for name in ['leader','child','grandchild']:
   f=p/f'{name}.pid'
   if f.exists():
    pid_text, expected_start = f.read_text().split()
    pid = int(pid_text)
    stat = pathlib.Path('/proc') / str(pid) / 'stat'
    fd = None
    try:
     fd = os.pidfd_open(pid)
     fields = stat.read_text().split(') ', 1)[1].split()
     if fields[19] == expected_start:
      signal.pidfd_send_signal(fd, signal.SIGKILL)
      deadline = time.monotonic() + 1
      while stat.exists() and time.monotonic() < deadline:
       current = stat.read_text().split(') ', 1)[1].split()
       if current[19] != expected_start or current[0] == 'Z': break
       time.sleep(.01)
    except (ProcessLookupError, FileNotFoundError): pass
    finally:
     if fd is not None: os.close(fd)
