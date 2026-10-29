"""CPU-only orchestration fault tests. Never import/launch browser modules."""
import ast,json,pathlib,tempfile,types,unittest
FILE=pathlib.Path(__file__).with_name('run-batch.py')
TREE=ast.parse(FILE.read_text())
FUN=next(n for n in TREE.body if isinstance(n,ast.FunctionDef) and n.name=='run')
class Tests(unittest.TestCase):
 def invoke(self,result):
  class Fake:
   pid=12345
   def wait(self):
    if isinstance(result,BaseException):raise result
    return result
  temp=tempfile.TemporaryDirectory();self.addCleanup(temp.cleanup)
  report={'steps':[]};saved=[]
  ns={'out':pathlib.Path(temp.name),'report':report,'save':lambda:saved.append(json.loads(json.dumps(report))),'subprocess':types.SimpleNamespace(Popen=lambda *a,**k:Fake(),STDOUT=-2)}
  exec(compile(ast.Module(body=[FUN],type_ignores=[]),str(FILE),'exec'),ns)
  try:ns['run'](['never-executed'],temp.name,label='cpu-mock')
  except BaseException as e:ns['caught']=e
  return report,saved,ns.get('caught')
 def test_interrupt_keeps_active_identity_unknown(self):
  r,s,e=self.invoke(KeyboardInterrupt())
  self.assertIsInstance(e,KeyboardInterrupt);self.assertEqual(r['steps'][0]['pid'],12345)
  self.assertEqual(r['steps'][0]['state'],'unknown');self.assertIsNone(r['steps'][0]['exitCode'])
  self.assertTrue(any(x['steps'][0]['state']=='active' for x in s))
 def test_normal_exit_is_real_wait_result(self):
  r,s,e=self.invoke(0);self.assertIsNone(e);self.assertEqual(r['steps'][0]['state'],'exited');self.assertEqual(r['steps'][0]['exitCode'],0)
 def test_signal_is_not_success(self):
  r,s,e=self.invoke(-15);self.assertIsInstance(e,RuntimeError);self.assertEqual(r['steps'][0]['signal'],15);self.assertIsNone(r['steps'][0]['exitCode'])
 def test_no_optimizable_assert_gates(self):
  self.assertFalse(any(isinstance(n,ast.Assert) for n in ast.walk(TREE)))
if __name__=='__main__':unittest.main()
