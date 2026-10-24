"""One regression: interrupted client must kill its unresponsive owned server."""
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import tempfile
import time
import unittest


def running(pid):
  try:
    return Path(f'/proc/{pid}/stat').read_text().split()[2] != 'Z'
  except FileNotFoundError:
    return False


class CleanupTest(unittest.TestCase):
  def test_interrupted_unresponsive_server(self):
    with tempfile.TemporaryDirectory(prefix='heap-cleanup-test.') as directory:
      root = Path(directory)
      (root / 'bin').mkdir()
      source = Path(__file__).with_name('trial.py')
      if not source.exists():
        source = Path(__file__).with_name('browserless-heap-client.py')
      shutil.copyfile(source, root / 'trial.py')
      fake = root / 'bin/node'
      fake.write_text('#!' + sys.executable + '\n' + '''
import json,os,signal,subprocess,sys,time
from pathlib import Path
signal.signal(signal.SIGTERM,signal.SIG_IGN)
child=subprocess.Popen([sys.executable,'-c','import signal,time; signal.signal(signal.SIGTERM,signal.SIG_IGN); time.sleep(60)'])
Path('owned-pids.json').write_text(json.dumps([os.getpid(),child.pid]))
time.sleep(60)
''')
      fake.chmod(0o700)
      client = subprocess.Popen([sys.executable, str(root / 'trial.py')],
                                env={'PATH': str(root / 'bin') + ':/usr/bin:/bin'},
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
      pids = []
      try:
        end = time.monotonic() + 5
        while not (root / 'owned-pids.json').exists() and time.monotonic() < end:
          time.sleep(0.02)
        self.assertTrue((root / 'owned-pids.json').exists(), 'fake server did not start')
        pids = json.loads((root / 'owned-pids.json').read_text())
        client.send_signal(signal.SIGTERM)
        self.assertNotEqual(client.wait(timeout=8), 0)
        end = time.monotonic() + 2
        while any(running(pid) for pid in pids) and time.monotonic() < end:
          time.sleep(0.02)
        self.assertFalse(any(running(pid) for pid in pids), 'owned server/helper survived')
      finally:
        if client.poll() is None:
          client.kill()
          client.wait()
        if pids:
          try:
            os.killpg(pids[0], signal.SIGKILL)
          except ProcessLookupError:
            pass


if __name__ == '__main__':
  unittest.main()
