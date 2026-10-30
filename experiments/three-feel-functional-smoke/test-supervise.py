import importlib.util,pathlib,tempfile,unittest,subprocess,io
spec=importlib.util.spec_from_file_location('supervise',pathlib.Path(__file__).with_name('supervise.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Child:
 pid=123
 def __init__(self,values):self.values=iter(values);self.stdin=io.StringIO()
 def wait(self,timeout):
  v=next(self.values)
  if v=='timeout':raise subprocess.TimeoutExpired('test',timeout)
  return v
class Tests(unittest.TestCase):
 def runrow(self,values):
  p=Child(values)
  with tempfile.TemporaryDirectory() as d:return m.run_owned(['never-executed'],d,pathlib.Path(d)/'test.log',popen=lambda *a,**k:p)
 def test_success_requires_inner_cleanup(self):
  r=self.runrow([0]);self.assertTrue(m.accepted(r,{'status':'passed-functional-scope-only','jobs':[{'cleanup':{'proven':True}}]}));self.assertFalse(m.accepted(r,{'status':'passed-functional-scope-only','jobs':[]}))
 def test_failure(self):self.assertEqual(self.runrow([1])['exitCode'],1)
 def test_timeout_with_cleanup_still_failed(self):
  r=self.runrow(['timeout',0]);self.assertEqual(r['state'],'exited');self.assertFalse(m.accepted(r,{'status':'passed-functional-scope-only','jobs':[{'cleanup':{'proven':True}}]}))
 def test_timeout_unknown_no_kill_or_next(self):self.assertEqual(self.runrow(['timeout','timeout'])['state'],'exit-unknown')
 def test_live_receipt_sequence(self):
  p=Child(['timeout','timeout']);states=[]
  with tempfile.TemporaryDirectory() as d:m.run_owned(['never-executed'],d,pathlib.Path(d)/'test.log',popen=lambda *a,**k:p,persist=lambda r:states.append((r['state'],r['child'] and r['child']['pid'])))
  self.assertEqual(states,[('spawn-requested',None),('active',123),('cancelling-owned-runner',123),('exit-unknown',123),('exit-unknown',123)])
 def test_spawn_failure_is_persisted(self):
  states=[]
  def fail(*a,**k):raise OSError('spawn')
  with tempfile.TemporaryDirectory() as d:
   with self.assertRaises(OSError):m.run_owned([],d,pathlib.Path(d)/'test.log',popen=fail,persist=lambda r:states.append(r['state']))
  self.assertEqual(states[-1],'spawn-unconfirmed')
 def test_interrupt_keeps_owned_identity(self):
  p=Child([]);states=[]
  def wait(timeout):raise KeyboardInterrupt()
  p.wait=wait
  with tempfile.TemporaryDirectory() as d:
   with self.assertRaises(KeyboardInterrupt):m.run_owned([],d,pathlib.Path(d)/'test.log',popen=lambda *a,**k:p,persist=lambda r:states.append((r['state'],r['child'] and r['child']['pid'])))
  self.assertEqual(states[-1],('exit-unknown',123))
unittest.main()
